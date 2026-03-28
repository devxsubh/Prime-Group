"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import { IndianRupee, Loader2, Check, Coins, Sparkles, Zap, Crown } from "lucide-react";

// Payment method is fetched from API (set in Admin → Settings)

interface Plan {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price_inr: number;
  credits: number | null;
}

const planIcons: Record<string, React.ElementType> = {
  starter: Zap,
  popular: Sparkles,
  "premium-pack": Crown,
};

function CheckoutContent() {

  const searchParams = useSearchParams();
  const planSlug = searchParams.get("plan");
  const planIdParam = searchParams.get("plan_id");
  const [plan, setPlan] = useState<Plan | null>(null);
  const [allPlans, setAllPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [payLoading, setPayLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"razorpay" | "upi_qr">("razorpay");
  const [upiOrder, setUpiOrder] = useState<{
    orderId: string;
    upiUrl: string;
    qrDataUrl: string | null;
    amount: number;
    credits: number;
    merchantName: string;
  } | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const resolvePlan = useCallback(async () => {
    const supabase = createClient();
    if (planIdParam) {
      const { data } = await supabase
        .from("plans")
        .select("id, name, slug, description, price_inr, credits")
        .eq("id", planIdParam)
        .eq("is_active", true)
        .single();
      return { selected: data as Plan | null, all: [] as Plan[] };
    }
    if (planSlug) {
      const { data } = await supabase
        .from("plans")
        .select("id, name, slug, description, price_inr, credits")
        .eq("slug", planSlug)
        .eq("is_active", true)
        .single();
      return { selected: data as Plan | null, all: [] as Plan[] };
    }
    // No specific plan — load all active plans
    const { data } = await supabase
      .from("plans")
      .select("id, name, slug, description, price_inr, credits")
      .eq("is_active", true)
      .gt("price_inr", 0)
      .order("display_order", { ascending: true });
    return { selected: null, all: (data ?? []) as Plan[] };
  }, [planIdParam, planSlug]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const { data: { user } } = await createClient().auth.getUser();
        if (!user) {
          window.location.href = `/sign-in?next=${encodeURIComponent("/checkout" + (planSlug ? `?plan=${planSlug}` : planIdParam ? `?plan_id=${planIdParam}` : ""))}`;
          return;
        }
        const [result, methodRes] = await Promise.all([
          resolvePlan(),
          fetch("/api/settings/payment-method").then((r) => r.json()),
        ]);
        if (!cancelled && methodRes?.method) setPaymentMethod(methodRes.method === "upi_qr" ? "upi_qr" : "razorpay");
        if (!cancelled) {
          if (result.selected) {
            setPlan(result.selected);
          } else if (result.all.length > 0) {
            setAllPlans(result.all);
            // Don't auto-select; let user choose
          } else {
            setError("No credit packs available.");
          }
        }
      } catch {
        if (!cancelled) setError("Failed to load plans.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [resolvePlan, planSlug, planIdParam]);

  const startRazorpay = useCallback(
    async (order: {
      razorpayOrderId: string;
      key: string;
      amount: number;
      currency: string;
      paymentId: string;
      credits: number;
    }) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);
      await new Promise<void>((res, rej) => {
        script.onload = () => res();
        script.onerror = () => rej(new Error("Razorpay script failed"));
      });

      const Razorpay = (window as unknown as { Razorpay: new (o: Record<string, unknown>) => { open: () => void; on: (e: string, h: () => void) => void } }).Razorpay;
      if (!Razorpay) {
        setError("Razorpay not available.");
        return;
      }

      const options = {
        key: order.key,
        amount: order.amount * 100,
        currency: order.currency,
        order_id: order.razorpayOrderId,
        name: "Prime Group",
        description: `${order.credits} credits`,
        handler: async (res: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) => {
          setPayLoading(true);
          try {
            const verifyRes = await fetch("/api/payments/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: res.razorpay_order_id,
                razorpay_payment_id: res.razorpay_payment_id,
                razorpay_signature: res.razorpay_signature,
              }),
            });
            const data = await verifyRes.json();
            if (verifyRes.ok && data.success) {
              window.location.href = "/checkout/success";
            } else {
              setError(data.error || "Verification failed.");
            }
          } catch {
            setError("Verification failed.");
          } finally {
            setPayLoading(false);
          }
        },
      };
      const rzp = new Razorpay(options);
      rzp.on("payment.failed", () => setError("Payment failed or was cancelled."));
      rzp.open();
    },
    []
  );

  const handlePay = useCallback(async (selectedPlan?: Plan) => {
    const targetPlan = selectedPlan || plan;
    if (!targetPlan) return;
    setPayLoading(true);
    setError(null);
    setUpiOrder(null);
    try {
      const res = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan_id: targetPlan.id }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to create order");
        return;
      }
      if (data.method === "razorpay" || paymentMethod === "razorpay") {
        await startRazorpay({
          razorpayOrderId: data.razorpayOrderId,
          key: data.key,
          amount: data.amount,
          currency: data.currency,
          paymentId: data.paymentId,
          credits: data.credits ?? 0,
        });
      } else if (data.method === "upi_qr" || paymentMethod === "upi_qr") {
        setUpiOrder({
          orderId: data.orderId,
          upiUrl: data.upiUrl,
          qrDataUrl: data.qrDataUrl ?? null,
          amount: data.amount,
          credits: data.credits ?? 0,
          merchantName: data.merchantName ?? "Prime Group",
        });
      } else {
        setError("Unknown payment method");
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setPayLoading(false);
    }
  }, [plan, startRazorpay, paymentMethod]);

  // Poll for UPI payment status
  useEffect(() => {
    if (!upiOrder) return;
    pollRef.current = setInterval(async () => {
      try {
        const res = await fetch(`/api/payments/status?orderId=${encodeURIComponent(upiOrder.orderId)}`);
        const data = await res.json();
        if (res.ok && data.status === "success") {
          if (pollRef.current) clearInterval(pollRef.current);
          pollRef.current = null;
          window.location.href = "/checkout/success";
        }
      } catch {
        // ignore
      }
    }, 5000);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [upiOrder]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: "var(--primary-blue)" }} />
      </div>
    );
  }

  if (error && !plan && allPlans.length === 0) {
    return (
      <div className="container max-w-lg mx-auto py-16 px-4">
        <Card className="rounded-xl border" style={{ borderColor: "rgba(212, 175, 55, 0.3)" }}>
          <CardContent className="pt-6">
            <p className="font-montserrat text-red-600">{error}</p>
            <Button asChild className="mt-4 rounded-xl" style={{ backgroundColor: "var(--primary-blue)" }}>
              <Link href="/">Back to home</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Multi-plan selection view (no plan pre-selected)
  if (!plan && allPlans.length > 0 && !upiOrder) {
    return (
      <div className="container max-w-4xl mx-auto py-12 px-4">
        <h1 className="font-playfair-display text-3xl font-bold mb-2" style={{ color: "var(--primary-blue)" }}>
          Buy Credits
        </h1>
        <p className="font-montserrat text-gray-600 mb-8">
          Choose a credit pack to unlock contact details on profiles
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {allPlans.map((p) => {
            const Icon = planIcons[p.slug] || Coins;
            const isPopular = p.slug === "popular";
            return (
              <div
                key={p.id}
                className={`relative rounded-2xl p-6 flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                  isPopular ? "ring-2" : ""
                }`}
                style={{
                  border: isPopular ? "2px solid var(--accent-gold)" : "1px solid rgba(212, 175, 55, 0.2)",
                  boxShadow: isPopular ? "0 10px 40px rgba(212, 175, 55, 0.15)" : "0 4px 20px rgba(0, 0, 0, 0.06)",
                }}
              >
                {isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="px-4 py-1 rounded-full text-xs font-montserrat font-bold uppercase tracking-wider text-black bg-gold-gradient shadow-lg">
                      Best Value
                    </span>
                  </div>
                )}

                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: "var(--primary-blue)" }}>
                    <Icon className="w-5 h-5" style={{ color: "var(--accent-gold)" }} />
                  </div>
                  <h3 className="text-lg font-playfair-display font-bold" style={{ color: "var(--primary-blue)" }}>
                    {p.name}
                  </h3>
                </div>

                <div className="flex items-center gap-2 mb-1">
                  <Coins className="w-5 h-5" style={{ color: "var(--accent-gold)" }} />
                  <span className="text-2xl font-bold" style={{ color: "var(--primary-blue)" }}>
                    {(p.credits ?? 0).toLocaleString()}
                  </span>
                  <span className="text-sm font-montserrat" style={{ color: "var(--primary-blue)", opacity: 0.7 }}>
                    credits
                  </span>
                </div>

                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-xl font-bold" style={{ color: "var(--primary-blue)" }}>
                    ₹{p.price_inr.toLocaleString()}
                  </span>
                </div>

                {p.description && (
                  <p className="text-sm font-montserrat text-gray-600 mb-4 flex-1">{p.description}</p>
                )}

                <Button
                  className="w-full py-4 font-montserrat font-semibold rounded-xl border-none transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
                  style={
                    isPopular
                      ? { background: "linear-gradient(135deg, #D4AF37, #E8C547)", color: "var(--primary-blue)" }
                      : { backgroundColor: "var(--primary-blue)", color: "var(--pure-white)" }
                  }
                  onClick={() => handlePay(p)}
                  disabled={payLoading}
                >
                  {payLoading ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Processing…</>
                  ) : (
                    `Buy ${(p.credits ?? 0).toLocaleString()} Credits`
                  )}
                </Button>

                <p className="text-center text-xs font-montserrat mt-2" style={{ color: "var(--primary-blue)", opacity: 0.5 }}>
                  ₹{((p.credits ?? 1) > 0 ? (p.price_inr / (p.credits ?? 1)).toFixed(2) : "0")} / credit
                </p>
              </div>
            );
          })}
        </div>

        {error && <p className="font-montserrat text-sm text-red-600 text-center mt-4">{error}</p>}

        <p className="text-center mt-8">
          <Link href="/" className="font-montserrat text-sm underline" style={{ color: "var(--primary-blue)" }}>
            Back to home
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="container max-w-lg mx-auto py-12 px-4">
      <h1 className="font-playfair-display text-2xl font-bold mb-6" style={{ color: "var(--primary-blue)" }}>
        Buy Credits
      </h1>

      {!upiOrder ? (
        <Card className="rounded-xl border mb-6" style={{ borderColor: "rgba(212, 175, 55, 0.3)" }}>
          <CardHeader>
            <CardTitle className="font-playfair-display" style={{ color: "var(--primary-blue)" }}>
              {plan?.name ?? "Plan"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {plan?.description && (
              <p className="font-montserrat text-sm text-gray-600">{plan.description}</p>
            )}
            <div className="flex items-baseline gap-2">
              <IndianRupee className="w-5 h-5" style={{ color: "var(--accent-gold)" }} />
              <span className="text-2xl font-bold" style={{ color: "var(--primary-blue)" }}>
                {plan?.price_inr?.toLocaleString() ?? 0}
              </span>
              <span className="font-montserrat text-gray-600">
                · {plan?.credits ?? 0} credits
              </span>
            </div>
            <p className="font-montserrat text-xs text-gray-500">
              Payment via {paymentMethod === "upi_qr" ? "UPI QR code" : "Razorpay"}.
            </p>
            {error && <p className="font-montserrat text-sm text-red-600">{error}</p>}
            <Button
              className="w-full rounded-xl font-montserrat"
              style={{ backgroundColor: "var(--primary-blue)" }}
              onClick={() => handlePay()}
              disabled={payLoading}
            >
              {payLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Preparing…
                </>
              ) : (
                "Pay now"
              )}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="rounded-xl border" style={{ borderColor: "rgba(212, 175, 55, 0.3)" }}>
          <CardHeader>
            <CardTitle className="font-playfair-display text-lg" style={{ color: "var(--primary-blue)" }}>
              Scan to pay via UPI
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="font-montserrat text-sm text-gray-600">
              Amount: <strong>₹{upiOrder.amount.toLocaleString()}</strong> · {upiOrder.credits} credits
            </p>
            {upiOrder.qrDataUrl ? (
              <div className="flex justify-center p-4 bg-white rounded-lg border">
                <img src={upiOrder.qrDataUrl} alt="UPI QR Code" width={280} height={280} />
              </div>
            ) : (
              <div className="p-4 bg-gray-100 rounded-lg font-montserrat text-sm break-all">
                <p className="font-semibold mb-1">UPI link (copy and open in UPI app):</p>
                <a href={upiOrder.upiUrl} className="text-blue-600 underline">
                  {upiOrder.upiUrl}
                </a>
              </div>
            )}
            <p className="font-montserrat text-xs text-gray-500">
              After paying, we will verify and add credits. This page will update automatically, or check your dashboard in a few minutes.
            </p>
            <Button
              variant="outline"
              className="w-full rounded-xl font-montserrat"
              onClick={() => setUpiOrder(null)}
            >
              Cancel
            </Button>
          </CardContent>
        </Card>
      )}

      <p className="text-center">
        <Link href="/" className="font-montserrat text-sm underline" style={{ color: "var(--primary-blue)" }}>
          Back to home
        </Link>
      </p>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin" style={{ color: "var(--primary-blue)" }} />
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}

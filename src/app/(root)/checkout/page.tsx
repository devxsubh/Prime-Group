"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import { IndianRupee, Loader2 } from "lucide-react";

// Payment method is fetched from API (set in Admin → Settings)

interface Plan {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price_inr: number;
  credits: number | null;
}

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const planSlug = searchParams.get("plan");
  const planIdParam = searchParams.get("plan_id");
  const [plan, setPlan] = useState<Plan | null>(null);
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
      return data as Plan | null;
    }
    if (planSlug) {
      const { data } = await supabase
        .from("plans")
        .select("id, name, slug, description, price_inr, credits")
        .eq("slug", planSlug)
        .eq("is_active", true)
        .single();
      return data as Plan | null;
    }
    const { data } = await supabase
      .from("plans")
      .select("id, name, slug, description, price_inr, credits")
      .eq("is_active", true)
      .gt("price_inr", 0)
      .order("display_order", { ascending: true })
      .limit(1)
      .single();
    return data as Plan | null;
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
        const [p, methodRes] = await Promise.all([
          resolvePlan(),
          fetch("/api/settings/payment-method").then((r) => r.json()),
        ]);
        if (!cancelled && methodRes?.method) setPaymentMethod(methodRes.method === "upi_qr" ? "upi_qr" : "razorpay");
        if (!cancelled) {
          setPlan(p ?? null);
          if (!p) setError("Plan not found.");
        }
      } catch {
        if (!cancelled) setError("Failed to load plan.");
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

  const handlePay = useCallback(async () => {
    if (!plan) return;
    setPayLoading(true);
    setError(null);
    setUpiOrder(null);
    try {
      const res = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan_id: plan.id }),
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
  }, [plan, startRazorpay]);

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

  if (error && !plan) {
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

  return (
    <div className="container max-w-lg mx-auto py-12 px-4">
      <h1 className="font-playfair-display text-2xl font-bold mb-6" style={{ color: "var(--primary-blue)" }}>
        Buy credits
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
              onClick={handlePay}
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

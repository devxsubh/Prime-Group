import { NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server-service";
import { paymentConfig, getPaymentMethodFromDb } from "@/lib/payment/config";
import crypto from "crypto";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const supabase = createServiceRoleClient();
  const method = await getPaymentMethodFromDb(supabase);
  if (method !== "razorpay") {
    return NextResponse.json({ error: "Razorpay verify not applicable" }, { status: 400 });
  }

  try {
    const body = await req.json();
    const {
      razorpay_order_id: orderId,
      razorpay_payment_id: paymentId,
      razorpay_signature: signature,
    } = body as { razorpay_order_id?: string; razorpay_payment_id?: string; razorpay_signature?: string };

    if (!orderId || !paymentId || !signature) {
      return NextResponse.json(
        { error: "razorpay_order_id, razorpay_payment_id, razorpay_signature required" },
        { status: 400 }
      );
    }

    const secret = paymentConfig.razorpay.keySecret;
    if (!secret) {
      return NextResponse.json({ error: "Razorpay not configured" }, { status: 503 });
    }

    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(`${orderId}|${paymentId}`)
      .digest("hex");

    if (expectedSignature !== signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const { data: payment, error: fetchError } = await supabase
      .from("payments")
      .select("id, user_id, credits_added, status")
      .eq("gateway_transaction_id", orderId)
      .single();

    if (fetchError || !payment) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    if (payment.status === "success") {
      return NextResponse.json({ success: true, message: "Already verified" });
    }

    const creditsToAdd = Number(payment.credits_added) || 0;

    const { error: updatePaymentError } = await supabase
      .from("payments")
      .update({
        status: "success",
        paid_at: new Date().toISOString(),
      })
      .eq("id", payment.id);

    if (updatePaymentError) {
      console.error("Payment update error:", updatePaymentError);
      return NextResponse.json({ error: "Failed to update payment" }, { status: 500 });
    }

    if (payment.user_id && creditsToAdd > 0) {
      const { data: userRow } = await supabase
        .from("users")
        .select("credits")
        .eq("id", payment.user_id)
        .single();
      const currentCredits = Number((userRow as { credits?: number } | null)?.credits) || 0;
      await supabase
        .from("users")
        .update({ credits: currentCredits + creditsToAdd, updated_at: new Date().toISOString() })
        .eq("id", payment.user_id);
    }

    return NextResponse.json({
      success: true,
      creditsAdded: creditsToAdd,
    });
  } catch (e) {
    console.error("verify error:", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

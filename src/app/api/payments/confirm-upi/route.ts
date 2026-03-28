import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceRoleClient } from "@/lib/supabase/server-service";

export const dynamic = "force-dynamic";

/**
 * Mark a UPI payment as successful and add credits.
 * Allowed: admin/super_admin only (or optionally a shared secret for webhooks).
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const orderId = body?.order_id as string | undefined;
    if (!orderId) {
      return NextResponse.json({ error: "order_id required" }, { status: 400 });
    }

    const supabase = await createClient();
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();
    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: adminUser } = await supabase
      .from("users")
      .select("role")
      .eq("id", authUser.id)
      .single();

    const isAdmin =
      (adminUser as { role?: string } | null)?.role === "admin" ||
      (adminUser as { role?: string } | null)?.role === "super_admin";

    if (!isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const serviceSupabase = createServiceRoleClient();
    const { data: payment, error: fetchError } = await serviceSupabase
      .from("payments")
      .select("id, user_id, credits_added, status, payment_method")
      .eq("id", orderId)
      .single();

    if (fetchError || !payment) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    if (payment.status === "success") {
      return NextResponse.json({ success: true, message: "Already confirmed" });
    }
    if (payment.payment_method !== "upi_qr") {
      return NextResponse.json({ error: "Not a UPI QR order" }, { status: 400 });
    }

    const creditsToAdd = Number(payment.credits_added) || 0;

    const { error: updateError } = await serviceSupabase
      .from("payments")
      .update({
        status: "success",
        paid_at: new Date().toISOString(),
      })
      .eq("id", payment.id);

    if (updateError) {
      console.error("Confirm UPI update error:", updateError);
      return NextResponse.json({ error: "Failed to update payment" }, { status: 500 });
    }

    if (payment.user_id && creditsToAdd > 0) {
      const { data: userRow } = await serviceSupabase
        .from("users")
        .select("credits")
        .eq("id", payment.user_id)
        .single();
      const currentCredits = Number((userRow as { credits?: number } | null)?.credits) || 0;
      await serviceSupabase
        .from("users")
        .update({ credits: currentCredits + creditsToAdd, updated_at: new Date().toISOString() })
        .eq("id", payment.user_id);
    }

    return NextResponse.json({
      success: true,
      creditsAdded: creditsToAdd,
    });
  } catch (e) {
    console.error("confirm-upi error:", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

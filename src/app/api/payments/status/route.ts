import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const orderId = searchParams.get("orderId");
  if (!orderId) {
    return NextResponse.json({ error: "orderId required" }, { status: 400 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: payment, error } = await supabase
    .from("payments")
    .select("id, status, paid_at, credits_added, amount")
    .eq("id", orderId)
    .eq("user_id", user.id)
    .single();

  if (error || !payment) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  return NextResponse.json({
    status: payment.status,
    paid_at: payment.paid_at ?? undefined,
    credits_added: payment.credits_added ?? undefined,
    amount: payment.amount,
  });
}

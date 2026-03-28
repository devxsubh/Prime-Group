import { NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server-service";

export const dynamic = "force-dynamic";

/** Public API: returns current payment method for checkout. Backend reads from app_settings. */
export async function GET() {
  try {
    const supabase = createServiceRoleClient();
    const { data, error } = await supabase
      .from("app_settings")
      .select("value")
      .eq("key", "payment_method")
      .single();

    if (error || !data?.value) {
      return NextResponse.json({ method: "razorpay" });
    }
    const method = String(data.value).toLowerCase();
    return NextResponse.json({
      method: method === "upi_qr" ? "upi_qr" : "razorpay",
    });
  } catch {
    return NextResponse.json({ method: "razorpay" });
  }
}

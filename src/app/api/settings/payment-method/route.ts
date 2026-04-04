import { NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server-service";

export const dynamic = "force-dynamic";

/** Access: **public** read — no session; service role. See `@/lib/api-route-access`. */
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

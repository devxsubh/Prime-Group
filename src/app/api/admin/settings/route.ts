import { NextResponse } from "next/server";
import { createAdminServerClient } from "@/lib/supabase/server-admin";
import { createServiceRoleClient } from "@/lib/supabase/server-service";

export const dynamic = "force-dynamic";

/** GET: Admin reads all settings */
export async function GET() {
  const supabase = await createAdminServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: adminUser } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();
  const role = (adminUser as { role?: string } | null)?.role;
  if (role !== "admin" && role !== "super_admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const serviceSupabase = createServiceRoleClient();
  const { data: rows, error } = await serviceSupabase
    .from("app_settings")
    .select("key, value");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const settings: Record<string, string> = {};
  (rows ?? []).forEach((r: { key: string; value: string }) => {
    settings[r.key] = r.value;
  });

  return NextResponse.json({
    payment_method: settings.payment_method ?? "razorpay",
  });
}

/** PATCH: Admin updates settings (e.g. payment_method) */
export async function PATCH(req: Request) {
  const supabase = await createAdminServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: adminUser } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();
  const role = (adminUser as { role?: string } | null)?.role;
  if (role !== "admin" && role !== "super_admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json().catch(() => ({}));
  const payment_method = body.payment_method as string | undefined;

  if (payment_method !== undefined) {
    const method = String(payment_method).toLowerCase();
    const value = method === "upi_qr" ? "upi_qr" : "razorpay";

    const serviceSupabase = createServiceRoleClient();
    const { error: upsertError } = await serviceSupabase
      .from("app_settings")
      .upsert({ key: "payment_method", value, updated_at: new Date().toISOString() }, { onConflict: "key" });

    if (upsertError) {
      return NextResponse.json({ error: upsertError.message }, { status: 500 });
    }
  }

  return NextResponse.json({ success: true });
}

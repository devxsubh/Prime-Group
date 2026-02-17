import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceRoleClient } from "@/lib/supabase/server-service";

const ADMIN_ROLES = ["admin", "super_admin"];

export async function GET() {
  try {
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json(
        { error: "SUPABASE_SERVICE_ROLE_KEY is not set. Add it in .env (Project Settings > API > service_role)." },
        { status: 500 }
      );
    }
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const service = createServiceRoleClient();
    const { data: row, error } = await service
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();
    if (error || !row) {
      return NextResponse.json({ error: "Forbidden", role: null }, { status: 403 });
    }
    const isAdmin = ADMIN_ROLES.includes(row.role);
    return NextResponse.json({ role: row.role, isAdmin });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Server error" },
      { status: 500 }
    );
  }
}

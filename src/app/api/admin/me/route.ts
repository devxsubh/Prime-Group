import { NextResponse } from "next/server";
import { createAdminServerClient } from "@/lib/supabase/server-admin";
import { createServiceRoleClient } from "@/lib/supabase/server-service";

const ADMIN_ROLES = ["admin", "super_admin"] as const;

export async function GET() {
  try {
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json(
        {
          error:
            "SUPABASE_SERVICE_ROLE_KEY is not set. Add it in .env (Project Settings > API > service_role).",
        },
        { status: 500 }
      );
    }

    const supabase = await createAdminServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ isAdmin: false }, { status: 401 });
    }

    const service = createServiceRoleClient();
    const { data: row, error } = await service
      .from("users")
      .select("role, permissions")
      .eq("id", user.id)
      .single();

    if (error || !row) {
      return NextResponse.json({ isAdmin: false }, { status: 200 });
    }

    const isAdmin = ADMIN_ROLES.includes(row.role as (typeof ADMIN_ROLES)[number]);
    return NextResponse.json({
      isAdmin,
      role: row.role ?? null,
      permissions: Array.isArray(row.permissions) ? row.permissions : [],
    });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Server error" },
      { status: 500 }
    );
  }
}

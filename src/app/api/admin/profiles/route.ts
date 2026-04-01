import { NextResponse } from "next/server";
import { createAdminServerClient } from "@/lib/supabase/server-admin";
import { createServiceRoleClient } from "@/lib/supabase/server-service";

const ADMIN_ROLES = ["admin", "super_admin"];

export async function GET() {
  try {
    const supabase = await createAdminServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const service = createServiceRoleClient();

    const { data: caller, error: callerError } = await service
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    if (callerError) {
      return NextResponse.json({ error: callerError.message }, { status: 500 });
    }

    if (!caller || !ADMIN_ROLES.includes(caller.role)) {
      return NextResponse.json({ error: "Forbidden: not an admin" }, { status: 403 });
    }

    const { data: profiles, error } = await service
      .from("profiles")
      .select(
        "id, user_id, full_name, gender, city, profile_status, profile_completion_pct, created_at, contact_number"
      )
      .is("deleted_at", null)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const rows =
      (profiles as {
        id: string;
        user_id: string;
        full_name: string | null;
        gender: string | null;
        city: string | null;
        profile_status: string | null;
        profile_completion_pct: number | null;
        created_at: string;
        contact_number?: string | null;
      }[]) ?? [];

    const userIds = [...new Set(rows.map((r) => r.user_id).filter(Boolean))];
    let emailByUserId = new Map<string, string>();
    if (userIds.length) {
      const { data: users, error: usersError } = await service
        .from("users")
        .select("id, email")
        .in("id", userIds);
      if (usersError) {
        return NextResponse.json({ error: usersError.message }, { status: 500 });
      }
      for (const u of (users ?? []) as { id: string; email: string }[]) {
        emailByUserId.set(u.id, u.email);
      }
    }

    const enriched = rows.map((p) => ({
      ...p,
      users: emailByUserId.has(p.user_id) ? { email: emailByUserId.get(p.user_id)! } : null,
    }));

    return NextResponse.json({ profiles: enriched });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Server error" },
      { status: 500 }
    );
  }
}


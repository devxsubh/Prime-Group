import { NextResponse } from "next/server";
import crypto from "crypto";
import { createAdminServerClient } from "@/lib/supabase/server-admin";
import { createServiceRoleClient } from "@/lib/supabase/server-service";

function safeEqual(a: string, b: string) {
  const aBuf = Buffer.from(a, "utf8");
  const bBuf = Buffer.from(b, "utf8");
  if (aBuf.length !== bBuf.length) return false;
  return crypto.timingSafeEqual(aBuf, bBuf);
}

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => ({}))) as {
      email?: string;
      password?: string;
    };
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const password = typeof body.password === "string" ? body.password : "";

    const adminEmail = process.env.ADMIN_FIXED_EMAIL ?? "";
    const adminPassword = process.env.ADMIN_FIXED_PASSWORD ?? "";

    if (!adminEmail || !adminPassword) {
      return NextResponse.json(
        { error: "Admin login is not configured" },
        { status: 500 }
      );
    }

    // Validate the submitted credentials against env (do not expose env to client).
    // We validate both email and password to allow sharing a single fixed credential set with admins.
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }
    if (!safeEqual(email.toLowerCase(), adminEmail.toLowerCase()) || !safeEqual(password, adminPassword)) {
      return NextResponse.json(
        { error: "Invalid login credentials" },
        { status: 401 }
      );
    }

    const supabase = await createAdminServerClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: adminEmail,
      password: adminPassword,
    });

    if (error || !data.user) {
      // Auto-heal setup: ensure the fixed admin user exists and is an admin.
      // This avoids "invalid login credentials" when env values are set but the auth user wasn't created yet.
      const isInvalidCreds =
        (error?.message || "").toLowerCase().includes("invalid login credentials");
      if (!isInvalidCreds) {
        return NextResponse.json(
          { error: error?.message || "Login failed" },
          { status: 401 }
        );
      }

      const service = createServiceRoleClient();

      // Try create; if already exists, reset password.
      const created = await service.auth.admin
        .createUser({
          email: adminEmail,
          password: adminPassword,
          email_confirm: true,
        })
        .catch((e) => ({ data: { user: null }, error: e as Error }));

      let userId: string | null =
        created && "data" in created && created.data?.user?.id
          ? created.data.user.id
          : null;

      if (!userId) {
        const listed = await service.auth.admin.listUsers({ page: 1, perPage: 200 });
        const existing = (listed.data?.users ?? []).find(
          (u) => (u.email || "").toLowerCase() === adminEmail.toLowerCase()
        );
        if (existing?.id) {
          userId = existing.id;
          await service.auth.admin.updateUserById(userId, {
            password: adminPassword,
            email_confirm: true,
          });
        }
      }

      if (userId) {
        await service
          .from("users")
          .update({ role: "super_admin", updated_at: new Date().toISOString() })
          .eq("id", userId);
      }

      const retry = await supabase.auth.signInWithPassword({
        email: adminEmail,
        password: adminPassword,
      });

      if (retry.error || !retry.data.user) {
        return NextResponse.json(
          { error: retry.error?.message || "Invalid admin credentials" },
          { status: 401 }
        );
      }

      return NextResponse.json({ success: true, repaired: true });
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Server error" },
      { status: 500 }
    );
  }
}


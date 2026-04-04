import { NextResponse } from "next/server";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { hasCompletedBasicProfile } from "@/lib/profile-basic-gate";

const BASIC_PROFILE_FIELDS =
  "full_name, date_of_birth, gender, contact_number, country, city" as const;

export type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>;

export type RequireUserWithBasicProfileResult =
  | { ok: true; user: User; supabase: SupabaseServerClient }
  | { ok: false; response: NextResponse };

/**
 * Same gate as middleware on /discover, /profile, /settings, /favorites — blocks direct API abuse
 * when the session exists but onboarding basics are incomplete.
 *
 * Tier **member_onboarded** in `@/lib/api-route-access` — use this for member APIs, not “default” RLS alone.
 */
export async function requireUserWithBasicProfile(): Promise<RequireUserWithBasicProfileResult> {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { ok: false, response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }

  const { data: userRow, error: userRowError } = await supabase
    .from("users")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();

  if (userRowError) {
    return { ok: false, response: NextResponse.json({ error: "Unable to load account." }, { status: 503 }) };
  }

  if (!userRow) {
    await supabase.auth.signOut();
    return {
      ok: false,
      response: NextResponse.json(
        { error: "Your account is no longer active. Please sign in again.", code: "account_removed" },
        { status: 401 }
      ),
    };
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select(BASIC_PROFILE_FIELDS)
    .eq("user_id", user.id)
    .maybeSingle();

  if (profileError) {
    return { ok: false, response: NextResponse.json({ error: "Unable to load profile." }, { status: 503 }) };
  }

  if (!profile || !hasCompletedBasicProfile(profile)) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: "Complete your profile to use this feature.", code: "onboarding_required" },
        { status: 403 }
      ),
    };
  }

  return { ok: true, user, supabase };
}

import { createClient } from "@supabase/supabase-js";

/**
 * Server-only Supabase client using the service role key.
 * Bypasses RLS - use only for trusted server-side checks (e.g. admin role).
 * Requires SUPABASE_SERVICE_ROLE_KEY in env.
 */
export function createServiceRoleClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is required for admin role check. Add it in Project Settings > API.");
  }
  return createClient(url, key, { auth: { persistSession: false } });
}

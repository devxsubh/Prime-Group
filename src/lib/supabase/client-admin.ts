import { createBrowserClient } from "@supabase/ssr";
import { ADMIN_AUTH_STORAGE_KEY } from "./admin-session";

/**
 * Browser Supabase client for `/admin` only.
 * Keep a single instance per browser context to avoid multiple GoTrueClient warnings.
 */
let adminSupabaseClient: ReturnType<typeof createBrowserClient> | null = null;

export function createAdminBrowserClient() {
  if (!adminSupabaseClient) {
    adminSupabaseClient = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookieOptions: { name: ADMIN_AUTH_STORAGE_KEY },
      }
    );
  }
  return adminSupabaseClient;
}

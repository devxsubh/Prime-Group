import { createBrowserClient } from "@supabase/ssr";
import { ADMIN_AUTH_STORAGE_KEY } from "./admin-session";

/**
 * Browser Supabase client for `/admin` only. Uses separate cookie storage from the member site
 * (`isSingleton: false` so it never shares the global SSR browser singleton).
 */
export function createAdminBrowserClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookieOptions: { name: ADMIN_AUTH_STORAGE_KEY },
      isSingleton: false,
    }
  );
}

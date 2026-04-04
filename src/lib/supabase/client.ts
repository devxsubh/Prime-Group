import { createBrowserClient } from "@supabase/ssr";
import { MEMBER_AUTH_STORAGE_KEY } from "@/lib/supabase/member-session";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookieOptions: { name: MEMBER_AUTH_STORAGE_KEY },
    }
  );
}

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { supabaseNoStoreFetch } from "@/lib/supabase/no-store-fetch";
import { MEMBER_AUTH_STORAGE_KEY } from "@/lib/supabase/member-session";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookieOptions: { name: MEMBER_AUTH_STORAGE_KEY },
      global: { fetch: supabaseNoStoreFetch },
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options?: object }[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Ignore in Server Components
          }
        },
      },
    }
  );
}

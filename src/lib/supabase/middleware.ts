import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Only run Supabase auth in middleware where we enforce server-side rules.
 * Calling getUser() on every navigation (including RSC/prefetch) adds a round-trip
 * and makes in-app clicks feel slow; the browser client refreshes the session too.
 */
export async function updateSession(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const protectedRoutes = ["/discover", "/profile", "/settings", "/favorites"];
  const isProtected = protectedRoutes.some((route) => pathname.startsWith(route));

  if (!pathname.startsWith("/onboarding") && !isProtected) {
    return NextResponse.next();
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options?: object }[]) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const url = request.nextUrl.clone();
    url.pathname = "/sign-in";
    if (isProtected) {
      url.searchParams.set("next", request.nextUrl.pathname);
    }
    return NextResponse.redirect(url);
  }

  if (isProtected) {
    // For protected routes, check if user has minimum 40% completion
    const { data: profile } = await supabase
      .from("profiles")
      .select("profile_completion_pct, profile_status")
      .eq("user_id", user.id)
      .single();

    const pct = profile?.profile_completion_pct ?? 0;
    const isCompleted = profile?.profile_status === "active" || pct >= 40;

    if (!isCompleted) {
      return NextResponse.redirect(new URL("/onboarding", request.url));
    }
  }

  return supabaseResponse;
}

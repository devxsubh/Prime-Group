import type { User } from "@supabase/supabase-js";
import { hasCompletedBasicProfile, type BasicProfileCheckInput } from "@/lib/profile-basic-gate";
import { sanitizeOptionalNextPath } from "@/lib/safe-next-path";

/** Default destination when the user is allowed into the main app and `next` is missing/invalid. */
export const DEFAULT_POST_LOGIN_PATH = "/discover";

/**
 * Member app areas that require a completed basic profile (aligned with middleware).
 * `/discover` listing is public; `/discover/<profileId>` requires auth (see `isDiscoverProfileDetailPath`).
 */
export const PROTECTED_MEMBER_PATH_PREFIXES = ["/profile", "/settings", "/favorites"] as const;

/** `/discover/[id]` — single segment after /discover/ (profile detail). `/discover` alone is not protected. */
export function isDiscoverProfileDetailPath(pathname: string): boolean {
  if (!pathname.startsWith("/discover/")) return false;
  const rest = pathname.slice("/discover/".length);
  if (!rest || rest.includes("/")) return false;
  return true;
}

export function isProtectedMemberPath(pathname: string): boolean {
  if (PROTECTED_MEMBER_PATH_PREFIXES.some((prefix) => pathname.startsWith(prefix))) return true;
  return isDiscoverProfileDetailPath(pathname);
}

function pathnameOnly(fullPath: string): string {
  const q = fullPath.indexOf("?");
  return q === -1 ? fullPath : fullPath.slice(0, q);
}

/**
 * Destinations that are safe before basic onboarding is complete (email verify, reset password,
 * onboarding itself, auth pages, checkout).
 */
function bypassesBasicProfileGate(pathname: string): boolean {
  if (pathname === "/hi" || pathname === "/reset-password") return true;
  if (pathname.startsWith("/onboarding")) return true;
  if (
    pathname.startsWith("/sign-in") ||
    pathname.startsWith("/sign-up") ||
    pathname.startsWith("/forgot-password")
  ) {
    return true;
  }
  if (pathname.startsWith("/auth/")) return true;
  if (pathname.startsWith("/checkout")) return true;
  return false;
}

export type PostLoginContext = {
  /** Raw `next` from query string or sign-in props (sanitized inside). */
  next?: string | null;
  basicProfile: BasicProfileCheckInput;
};

/**
 * Single place for “after auth, where do we go?” — safe `next`, basic-profile gate, defaults.
 * Call only when a session user exists (e.g. after `signInWithPassword`, `/auth/callback` exchange).
 */
export function getPostLoginRedirect(user: User, ctx: PostLoginContext): string {
  const complete = hasCompletedBasicProfile(ctx.basicProfile);
  const safe = sanitizeOptionalNextPath(ctx.next);

  if (safe) {
    const path = pathnameOnly(safe);
    if (!complete && !bypassesBasicProfileGate(path)) {
      return "/onboarding";
    }
    return safe;
  }

  if (!complete) {
    return "/onboarding";
  }

  return DEFAULT_POST_LOGIN_PATH;
}

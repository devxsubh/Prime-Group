/**
 * Public site origin (no trailing slash).
 * Set **NEXT_PUBLIC_SITE_URL** in Vercel (Production) to your real domain — otherwise sign-up /
 * reset emails may embed `*.vercel.app` when `window.location.origin` was used (now avoided in app
 * code; this env still drives all auth email redirect targets).
 */
export const DEFAULT_SITE_URL = "https://www.primegroupmatrimony.com";

export function getSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim() || DEFAULT_SITE_URL;
  return raw.replace(/\/+$/, "");
}

/**
 * Public site origin (no trailing slash). Override with NEXT_PUBLIC_SITE_URL in production.
 */
export const DEFAULT_SITE_URL = "https://www.primegroupmatrimony.com";

export function getSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim() || DEFAULT_SITE_URL;
  return raw.replace(/\/+$/, "");
}

/**
 * Query flag appended on successful `/auth/callback` redirects. If the browser drops auth
 * cookies (Safari / strict privacy), the landing page can still show accurate copy.
 */
export const POST_AUTH_COOKIE_HINT_PARAM = "pg_verified";

/** Append `pg_verified=1` to a relative path (preserves existing query). */
export function withPostAuthVerificationHint(relativePathAndQuery: string): string {
  const path = relativePathAndQuery.startsWith("/") ? relativePathAndQuery : `/${relativePathAndQuery}`;
  const u = new URL(path, "http://pg.internal");
  u.searchParams.set(POST_AUTH_COOKIE_HINT_PARAM, "1");
  return `${u.pathname}${u.search}${u.hash}`;
}

export function pathnameOnly(fullPath: string): string {
  let s = fullPath;
  const hash = s.indexOf("#");
  if (hash !== -1) s = s.slice(0, hash);
  const q = s.indexOf("?");
  return q === -1 ? s : s.slice(0, q);
}

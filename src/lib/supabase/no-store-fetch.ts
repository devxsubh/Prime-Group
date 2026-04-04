/**
 * Supabase JS uses `fetch` for Auth and PostgREST. Next.js may cache `fetch` responses,
 * which can desync middleware profile checks from freshly updated DB rows (redirect loops).
 */
export function supabaseNoStoreFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  return fetch(input, {
    ...(init ?? {}),
    cache: "no-store",
  });
}

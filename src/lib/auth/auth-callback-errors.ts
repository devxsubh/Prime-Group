/**
 * Auth callback / session edge cases: transient network failures, rare JWT
 * validation issues (e.g. device clock skew), and duplicate opens of the same
 * magic / OAuth link (mail client + browser).
 */

export const AUTH_CALLBACK_RETRY_DELAY_MS = 900;

/** Expired, reused, or invalid OTP / PKCE — reset links, signup verify, or second hit on same link. */
export function isStaleOrInvalidAuthLinkError(err: { code?: string; message?: string }): boolean {
  const code = err.code ?? "";
  const msg = (err.message ?? "").toLowerCase();
  const codes = new Set([
    "otp_expired",
    "flow_state_expired",
    "flow_state_not_found",
    "bad_code_verifier",
    "bad_oauth_callback",
  ]);
  if (codes.has(code)) return true;
  if (msg.includes("otp") && msg.includes("expired")) return true;
  if (msg.includes("flow_state")) return true;
  if (msg.includes("expired") && msg.includes("link")) return true;
  if (msg.includes("invalid") && (msg.includes("token") || msg.includes("link"))) return true;
  return false;
}

/**
 * Failure may be a duplicate request after another tab/client already exchanged the code.
 * If `getUser()` still finds a session, redirect as success instead of error.
 */
export function authCallbackFailureMayBeDuplicateHit(err: { code?: string; message?: string }): boolean {
  if (isStaleOrInvalidAuthLinkError(err)) return true;
  const msg = (err.message ?? "").toLowerCase();
  const code = err.code ?? "";
  if (code === "invalid_grant" || msg.includes("invalid_grant")) return true;
  if (msg.includes("already") && (msg.includes("used") || msg.includes("exchanged") || msg.includes("redeemed"))) {
    return true;
  }
  if (msg.includes("authorization code") && msg.includes("invalid")) return true;
  return false;
}

export function authExchangeErrorShouldRetry(
  err: { code?: string; message?: string; status?: number },
  attemptIndex: number
): boolean {
  if (attemptIndex >= 1) return false;
  const code = err.code ?? "";
  if (code === "request_timeout" || code === "bad_jwt") return true;
  const st = err.status;
  if (typeof st === "number" && st >= 500 && st < 600) return true;
  const msg = (err.message ?? "").toLowerCase();
  if (
    msg.includes("timeout") ||
    msg.includes("network") ||
    msg.includes("econnreset") ||
    msg.includes("failed to fetch") ||
    msg.includes("fetch failed")
  ) {
    return true;
  }
  return false;
}

/** After retries: suggest clock / retry when failure looks like JWT timing, not a dead link. */
export function authCallbackFailureIsTimingLikely(err: { code?: string; message?: string } | null): boolean {
  if (!err) return false;
  if (err.code === "bad_jwt") return true;
  const msg = (err.message ?? "").toLowerCase();
  if (msg.includes("not before") || msg.includes("nbf") || msg.includes("clock")) return true;
  return false;
}

export function updatePasswordErrorUserMessage(err: { code?: string; message?: string }): string {
  const code = err.code ?? "";
  const raw = err.message ?? "Something went wrong.";
  const lower = raw.toLowerCase();
  if (
    code === "bad_jwt" ||
    code === "session_expired" ||
    lower.includes("jwt") ||
    lower.includes("session expired")
  ) {
    return "Your session could not be verified. If your device date or time is wrong, fix it and try again, refresh this page, or request a new reset link.";
  }
  return raw;
}

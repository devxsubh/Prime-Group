import { describe, expect, it } from "vitest";
import {
  authCallbackFailureMayBeDuplicateHit,
  isStaleOrInvalidAuthLinkError,
} from "./auth-callback-errors";

describe("authCallbackFailureMayBeDuplicateHit", () => {
  it("matches stale / single-use link errors", () => {
    expect(authCallbackFailureMayBeDuplicateHit({ code: "flow_state_not_found" })).toBe(true);
    expect(authCallbackFailureMayBeDuplicateHit({ code: "bad_oauth_callback" })).toBe(true);
  });

  it("matches OAuth already-used style messages", () => {
    expect(
      authCallbackFailureMayBeDuplicateHit({
        message: "Authorization code has already been used",
      })
    ).toBe(true);
    expect(
      authCallbackFailureMayBeDuplicateHit({ code: "invalid_grant", message: "Invalid grant" })
    ).toBe(true);
  });

  it("does not match arbitrary auth errors", () => {
    expect(authCallbackFailureMayBeDuplicateHit({ message: "Invalid login credentials" })).toBe(
      false
    );
  });
});

describe("isStaleOrInvalidAuthLinkError", () => {
  it("is subset used by duplicate-hit detection", () => {
    expect(isStaleOrInvalidAuthLinkError({ code: "otp_expired" })).toBe(true);
    expect(isStaleOrInvalidAuthLinkError({ message: "flow_state missing" })).toBe(true);
  });
});

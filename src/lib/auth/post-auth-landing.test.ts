import { describe, expect, it } from "vitest";
import { pathnameOnly, withPostAuthVerificationHint } from "./post-auth-landing";

describe("withPostAuthVerificationHint", () => {
  it("appends pg_verified", () => {
    expect(withPostAuthVerificationHint("/hi")).toBe("/hi?pg_verified=1");
  });

  it("merges with existing query", () => {
    const out = withPostAuthVerificationHint("/hi?foo=bar");
    const u = new URL(out, "http://local.test");
    expect(u.searchParams.get("foo")).toBe("bar");
    expect(u.searchParams.get("pg_verified")).toBe("1");
  });
});

describe("pathnameOnly", () => {
  it("strips query and hash", () => {
    expect(pathnameOnly("/reset-password?x=1")).toBe("/reset-password");
    expect(pathnameOnly("/path#h")).toBe("/path");
    expect(pathnameOnly("/r?a=1#h")).toBe("/r");
  });
});

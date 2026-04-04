import { describe, expect, it } from "vitest";
import type { User } from "@supabase/supabase-js";
import {
  DEFAULT_POST_LOGIN_PATH,
  getPostLoginRedirect,
  isProtectedMemberPath,
} from "./post-login-redirect";

const user = { id: "00000000-0000-4000-8000-000000000001" } as User;

const completeBasic = {
  full_name: "Ab Cd",
  date_of_birth: "1990-01-01",
  gender: "male" as const,
  contact_number: "+1 234 567 8901",
  country: "IN",
  city: "Mumbai",
};

describe("getPostLoginRedirect", () => {
  it("sends incomplete users to onboarding when next is missing", () => {
    expect(getPostLoginRedirect(user, { next: null, basicProfile: null })).toBe("/onboarding");
  });

  it("sends incomplete users to onboarding when next is a protected app path", () => {
    expect(getPostLoginRedirect(user, { next: "/favorites", basicProfile: null })).toBe("/onboarding");
  });

  it("allows /hi for incomplete users (email verification landing)", () => {
    expect(getPostLoginRedirect(user, { next: "/hi", basicProfile: null })).toBe("/hi");
  });

  it("allows /reset-password for incomplete users", () => {
    expect(getPostLoginRedirect(user, { next: "/reset-password", basicProfile: null })).toBe(
      "/reset-password"
    );
  });

  it("allows /onboarding for incomplete users", () => {
    expect(getPostLoginRedirect(user, { next: "/onboarding", basicProfile: null })).toBe("/onboarding");
  });

  it("defaults complete users to discover when next is missing", () => {
    expect(getPostLoginRedirect(user, { next: null, basicProfile: completeBasic })).toBe(
      DEFAULT_POST_LOGIN_PATH
    );
  });

  it("uses safe next for complete users", () => {
    expect(getPostLoginRedirect(user, { next: "/settings", basicProfile: completeBasic })).toBe(
      "/settings"
    );
  });

  it("rejects open redirects for complete users", () => {
    expect(
      getPostLoginRedirect(user, { next: "//evil.com", basicProfile: completeBasic })
    ).toBe(DEFAULT_POST_LOGIN_PATH);
  });
});

describe("isProtectedMemberPath", () => {
  it("protects discover profile detail but not listing", () => {
    expect(isProtectedMemberPath("/discover")).toBe(false);
    expect(isProtectedMemberPath("/discover/abc-uuid-here")).toBe(true);
    expect(isProtectedMemberPath("/discover/x/y")).toBe(false);
    expect(isProtectedMemberPath("/profile/edit")).toBe(true);
    expect(isProtectedMemberPath("/")).toBe(false);
    expect(isProtectedMemberPath("/onboarding")).toBe(false);
  });
});

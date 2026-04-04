/**
 * Minimum profile fields required before a member can use protected routes
 * (Discover, profile shell, favorites, settings, etc.).
 * Aligns middleware, sign-in redirect, and onboarding entry.
 */
export type BasicProfileCheckInput = {
  full_name?: string | null;
  date_of_birth?: string | null;
  gender?: string | null;
  contact_number?: string | null;
  country?: string | null;
  city?: string | null;
} | null;

function digitsOnly(s: string): string {
  return s.replace(/\D/g, "");
}

/** Reasonable minimum length for a phone number (digits only), international-safe lower bound. */
const MIN_PHONE_DIGITS = 8;

export function hasCompletedBasicProfile(profile: BasicProfileCheckInput): boolean {
  if (!profile) return false;

  const name = (profile.full_name ?? "").trim();
  if (name.length < 2) return false;

  const dob = (profile.date_of_birth ?? "").trim();
  if (!dob) return false;

  const gender = (profile.gender ?? "").trim().toLowerCase();
  if (!gender || !["male", "female", "other"].includes(gender)) return false;

  const phoneDigits = digitsOnly(profile.contact_number ?? "");
  if (phoneDigits.length < MIN_PHONE_DIGITS) return false;

  const country = (profile.country ?? "").trim();
  const city = (profile.city ?? "").trim();
  if (!country || !city) return false;

  return true;
}

/**
 * Supabase Auth cookie storage key for admin only.
 * The public site uses the default key; admin session never overwrites member cookies.
 */
export const ADMIN_AUTH_STORAGE_KEY = "sb-pg-admin-auth";

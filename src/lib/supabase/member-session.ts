/**
 * Member (public app) Supabase Auth cookie prefix.
 * Must stay distinct from {@link ADMIN_AUTH_STORAGE_KEY} so admin and member sessions never share storage.
 * Changing this logs everyone out once (new cookie names).
 */
export const MEMBER_AUTH_STORAGE_KEY = "sb-pg-member-auth";

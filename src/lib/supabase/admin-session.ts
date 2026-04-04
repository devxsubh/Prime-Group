/**
 * Supabase Auth cookie prefix for `/admin` only.
 * The public app uses {@link MEMBER_AUTH_STORAGE_KEY} from `./member-session` — never the default unnamed key.
 */
export const ADMIN_AUTH_STORAGE_KEY = "sb-pg-admin-auth";

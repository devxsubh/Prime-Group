# Supabase setup (Phase 2)

1. Create a project at [supabase.com](https://supabase.com) and get your project URL and anon key from **Project Settings > API**.

2. In the project root, copy env and fill in values:
   ```bash
   cp .env.example .env.local
   ```
   Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

3. Run the initial schema in the Supabase **SQL Editor** (Dashboard > SQL Editor > New query):
   - Open `supabase/migrations/20250209000000_initial_schema.sql`
   - Paste and run the full script. This creates `users`, `profiles`, `profile_photos`, `partner_preferences`, the auth trigger, and RLS policies.
   - If you already ran an older version of this migration and get **"new row violates row-level security policy"** on signup, run `supabase/migrations/20250209100000_fix_users_insert_rls.sql` to add the missing INSERT policy for `public.users`.

4. **Storage for profile photos:** Create bucket then add RLS via SQL:
   - In Dashboard go to **Storage > New bucket**. Name: `profile-photos`, set **Public** if you want photos viewable via public URL.
   - Run `supabase/migrations/20250210100000_storage_profile_photos_bucket.sql` in the SQL Editor. This adds RLS policies so authenticated users can upload to their own folder and read photos (fixes 400 / "new row violates row-level security policy" on upload).

5. In Supabase **Authentication > URL Configuration**, add:
   - **Site URL:** your app URL (e.g. `http://localhost:3000`)
   - **Redirect URLs:** `http://localhost:3000/auth/callback`, and your production URL when you deploy.

6. **Admin panel** (optional): Run `supabase/migrations/20250211100000_admin_rls.sql` in the SQL Editor. Add **SUPABASE_SERVICE_ROLE_KEY** to `.env` (from Project Settings > API > `service_role` secret) so the admin role check works. Grant admin: `UPDATE public.users SET role = 'admin' WHERE email = 'your-admin@example.com';`

7. Install dependencies and run the app:
   ```bash
   npm install
   npm run dev
   ```
   Sign up at `/sign-up`, confirm email (check Supabase Auth users or use “Confirm email” in dashboard for testing), then sign in. You’ll be sent to `/onboarding` to create your profile. Admin panel: `/admin` (login with a user whose `public.users.role` is `admin` or `super_admin`).

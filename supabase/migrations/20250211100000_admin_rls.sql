-- Allow admin and super_admin to read all users and all profiles for the admin panel.
-- Requires the authenticated user's role (from public.users) to be admin or super_admin.

CREATE POLICY "Admins can read all users"
  ON public.users FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users u
      WHERE u.id = auth.uid()
      AND u.role IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "Admins can read all profiles"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users u
      WHERE u.id = auth.uid()
      AND u.role IN ('admin', 'super_admin')
    )
  );

-- Optional: allow admins to update profile_status (e.g. approve/reject)
CREATE POLICY "Admins can update profiles"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users u
      WHERE u.id = auth.uid()
      AND u.role IN ('admin', 'super_admin')
    )
  );

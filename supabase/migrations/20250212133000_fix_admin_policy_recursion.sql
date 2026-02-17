-- Fix RLS infinite recursion caused by policies that query public.users
-- from inside other public.users/profile/payout policies.
--
-- Root cause:
-- Policies like:
--   EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role IN (...))
-- can recurse when evaluated on tables protected by RLS (especially public.users).
--
-- Solution:
-- Use a SECURITY DEFINER helper that checks admin role with table-owner privileges,
-- then reference that helper in policies.

-- 1) Helper function
CREATE OR REPLACE FUNCTION public.is_admin_user(_uid UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.users u
    WHERE u.id = _uid
      AND u.role IN ('admin', 'super_admin')
  );
$$;

-- Ensure authenticated clients can execute the helper from policies
GRANT EXECUTE ON FUNCTION public.is_admin_user(UUID) TO authenticated;

-- 2) Recreate admin policies without recursive subqueries

-- users
DROP POLICY IF EXISTS "Admins can read all users" ON public.users;
CREATE POLICY "Admins can read all users"
  ON public.users FOR SELECT
  TO authenticated
  USING (public.is_admin_user(auth.uid()));

-- profiles
DROP POLICY IF EXISTS "Admins can read all profiles" ON public.profiles;
CREATE POLICY "Admins can read all profiles"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (public.is_admin_user(auth.uid()));

DROP POLICY IF EXISTS "Admins can update profiles" ON public.profiles;
CREATE POLICY "Admins can update profiles"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (public.is_admin_user(auth.uid()));

-- plans
DROP POLICY IF EXISTS "Admins manage plans" ON public.plans;
CREATE POLICY "Admins manage plans"
  ON public.plans FOR ALL
  TO authenticated
  USING (public.is_admin_user(auth.uid()))
  WITH CHECK (public.is_admin_user(auth.uid()));

-- payments
DROP POLICY IF EXISTS "Admins can read payments" ON public.payments;
CREATE POLICY "Admins can read payments"
  ON public.payments FOR SELECT
  TO authenticated
  USING (public.is_admin_user(auth.uid()));

DROP POLICY IF EXISTS "Admins can insert payments" ON public.payments;
CREATE POLICY "Admins can insert payments"
  ON public.payments FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin_user(auth.uid()));

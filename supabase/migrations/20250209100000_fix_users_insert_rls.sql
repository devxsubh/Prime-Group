-- Fix: allow the trigger to insert into public.users when a new auth user signs up.
-- Run this in Supabase SQL Editor if you get "new row violates row-level security policy" on signup.
-- The trigger runs as SECURITY DEFINER (as the function owner). We allow both common owners.

-- Drop existing policies if re-running
DROP POLICY IF EXISTS "Allow trigger to insert user row" ON public.users;
DROP POLICY IF EXISTS "Allow supabase_admin to insert user row" ON public.users;

-- Allow postgres to insert (trigger runs as function owner; Dashboard migrations usually create function as postgres)
CREATE POLICY "Allow trigger to insert user row"
  ON public.users FOR INSERT TO postgres WITH CHECK (true);

-- Allow supabase_admin to insert (Supabase Cloud; skip if role does not exist)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'supabase_admin') THEN
    CREATE POLICY "Allow supabase_admin to insert user row"
      ON public.users FOR INSERT TO supabase_admin WITH CHECK (true);
  END IF;
END $$;

-- Ensure the trigger function runs as postgres so the policy above applies (run as postgres/superuser)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'postgres') THEN
    ALTER FUNCTION public.handle_new_user() OWNER TO postgres;
  END IF;
EXCEPTION WHEN OTHERS THEN
  NULL; -- ignore if we can't change owner (e.g. not superuser)
END $$;

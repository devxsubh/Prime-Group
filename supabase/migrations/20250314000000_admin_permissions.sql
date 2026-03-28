-- Add optional permissions for admin users (granular access).
-- super_admin implies all permissions; admin can have a subset.

ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS permissions JSONB DEFAULT '[]'::jsonb;

COMMENT ON COLUMN public.users.permissions IS 'Array of permission keys for admin users, e.g. ["manage_profiles","manage_blogs"]. Empty or null means use role defaults.';
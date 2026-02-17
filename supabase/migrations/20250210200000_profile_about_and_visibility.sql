-- Add bio/introduction and optional granular visibility for profile sections.
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS about_me TEXT,
  ADD COLUMN IF NOT EXISTS show_education BOOLEAN DEFAULT true,
  ADD COLUMN IF NOT EXISTS show_occupation BOOLEAN DEFAULT true,
  ADD COLUMN IF NOT EXISTS show_family BOOLEAN DEFAULT true,
  ADD COLUMN IF NOT EXISTS show_location BOOLEAN DEFAULT true;

COMMENT ON COLUMN public.profiles.about_me IS 'Short bio or introduction shown on public profile';
COMMENT ON COLUMN public.profiles.show_education IS 'Whether to show education on public profile';
COMMENT ON COLUMN public.profiles.show_occupation IS 'Whether to show occupation on public profile';
COMMENT ON COLUMN public.profiles.show_family IS 'Whether to show family details on public profile';
COMMENT ON COLUMN public.profiles.show_location IS 'Whether to show city/state/country on public profile';

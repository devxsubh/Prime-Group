-- Onboarding profile expansion: education, birth, family, contact, partner gotra

-- Profiles: education detail
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS school VARCHAR(150);

-- Profiles: birth and physical
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS birth_time VARCHAR(20),
  ADD COLUMN IF NOT EXISTS birthplace VARCHAR(200),
  ADD COLUMN IF NOT EXISTS complexion VARCHAR(50);

-- Profiles: family details (siblings)
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS has_siblings BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS siblings_brothers INT,
  ADD COLUMN IF NOT EXISTS siblings_sisters INT,
  ADD COLUMN IF NOT EXISTS siblings_notes TEXT;

-- Profiles: contact
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS contact_address TEXT,
  ADD COLUMN IF NOT EXISTS contact_number VARCHAR(20);

-- Partner preferences: gotra (optional)
ALTER TABLE public.partner_preferences
  ADD COLUMN IF NOT EXISTS gotra VARCHAR(100);

COMMENT ON COLUMN public.profiles.school IS 'School name for education';
COMMENT ON COLUMN public.profiles.birth_time IS 'Time of birth (e.g. 14:30 or text)';
COMMENT ON COLUMN public.profiles.birthplace IS 'Place of birth';
COMMENT ON COLUMN public.profiles.complexion IS 'Complexion description';
COMMENT ON COLUMN public.profiles.has_siblings IS 'Whether profile has siblings';
COMMENT ON COLUMN public.profiles.siblings_brothers IS 'Number of brothers';
COMMENT ON COLUMN public.profiles.siblings_sisters IS 'Number of sisters';
COMMENT ON COLUMN public.profiles.siblings_notes IS 'Optional siblings details';
COMMENT ON COLUMN public.profiles.contact_address IS 'Address for contact';
COMMENT ON COLUMN public.profiles.contact_number IS 'Contact phone number';
-- Gotra moved to profiles (user's own). This column deprecated; use profiles.gotra.
COMMENT ON COLUMN public.partner_preferences.gotra IS 'Deprecated: use profiles.gotra for user''s gotra. Partner preference is "looking for".';

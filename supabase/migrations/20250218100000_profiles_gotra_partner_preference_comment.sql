-- Gotra is the user's own gotra (stored on profile). Partner preference = what you're looking for in a partner.

-- Profiles: user's own gotra (optional)
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS gotra VARCHAR(100);

COMMENT ON COLUMN public.profiles.gotra IS 'User''s own gotra (optional)';

-- Clarify partner_preferences: "looking for" / preference for partner (not user's own details)
COMMENT ON TABLE public.partner_preferences IS 'What the user is looking for in a partner (e.g. age range, preferences). Not the user''s own attributes.';

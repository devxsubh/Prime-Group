-- Contact unlocks: track which profiles a user has unlocked (spent credits on).

CREATE TABLE IF NOT EXISTS public.contact_unlocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  credits_spent INT NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, profile_id)
);

CREATE INDEX IF NOT EXISTS idx_contact_unlocks_user ON public.contact_unlocks(user_id);
CREATE INDEX IF NOT EXISTS idx_contact_unlocks_profile ON public.contact_unlocks(profile_id);

-- RLS
ALTER TABLE public.contact_unlocks ENABLE ROW LEVEL SECURITY;

-- Users can read their own unlocks
CREATE POLICY "Users can read own unlocks"
  ON public.contact_unlocks FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can insert their own unlocks (via API)
CREATE POLICY "Users can insert own unlocks"
  ON public.contact_unlocks FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Admins can read all unlocks
CREATE POLICY "Admins can read all unlocks"
  ON public.contact_unlocks FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role IN ('admin', 'super_admin'))
  );

-- Update seed plans to credit packs (200 / 500 / 1000)
UPDATE public.plans SET is_active = false WHERE slug IN ('basic', 'premium', 'elite');

INSERT INTO public.plans (name, slug, description, price_inr, credits, features, display_order, is_active)
VALUES
  ('Starter', 'starter', '200 credits to unlock contact details', 499, 200, '["200 contact unlocks", "No expiry"]', 1, true),
  ('Popular', 'popular', '500 credits — best value for active searches', 999, 500, '["500 contact unlocks", "No expiry", "Best value"]', 2, true),
  ('Premium Pack', 'premium-pack', '1000 credits for power users', 1799, 1000, '["1000 contact unlocks", "No expiry", "Priority support"]', 3, true)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price_inr = EXCLUDED.price_inr,
  credits = EXCLUDED.credits,
  features = EXCLUDED.features,
  display_order = EXCLUDED.display_order,
  is_active = EXCLUDED.is_active;

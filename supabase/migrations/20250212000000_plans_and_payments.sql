-- Plans (pricing) and payments for revenue tracking.
-- Run in Supabase SQL Editor.

-- Plans table: admin-editable pricing
CREATE TABLE IF NOT EXISTS public.plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  price_inr INT NOT NULL DEFAULT 0,
  price_usd INT,
  duration_days INT,
  credits INT,
  features JSONB DEFAULT '[]',
  is_active BOOLEAN DEFAULT true,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_plans_slug ON public.plans(slug);
CREATE INDEX IF NOT EXISTS idx_plans_active ON public.plans(is_active);

-- Payments table: for revenue stats
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  plan_id UUID REFERENCES public.plans(id) ON DELETE SET NULL,
  amount INT NOT NULL,
  currency VARCHAR(3) DEFAULT 'INR',
  payment_gateway VARCHAR(50),
  gateway_transaction_id VARCHAR(255),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'success', 'failed', 'refunded')),
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_payments_user ON public.payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_plan ON public.payments(plan_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON public.payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_paid_at ON public.payments(paid_at);

-- RLS
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Plans: admins full access; authenticated can read active plans
CREATE POLICY "Admins manage plans"
  ON public.plans FOR ALL
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role IN ('admin', 'super_admin'))
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role IN ('admin', 'super_admin'))
  );

CREATE POLICY "Anyone can read active plans"
  ON public.plans FOR SELECT
  TO authenticated
  USING (is_active = true);

-- Payments: admins read for revenue; service/backend inserts (or admin for manual entry)
CREATE POLICY "Admins can read payments"
  ON public.payments FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role IN ('admin', 'super_admin'))
  );

CREATE POLICY "Admins can insert payments"
  ON public.payments FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role IN ('admin', 'super_admin'))
  );

-- Seed default plans (optional)
INSERT INTO public.plans (name, slug, description, price_inr, duration_days, credits, features, display_order)
VALUES
  ('Basic', 'basic', 'Free profile listing', 0, 30, 5, '["Profile listing", "5 contact unlocks"]', 1),
  ('Premium', 'premium', 'More visibility and unlocks', 999, 30, 25, '["Priority listing", "25 contact unlocks", "Highlighted profile"]', 2),
  ('Elite', 'elite', 'Unlimited access', 2999, 90, 999, '["Unlimited contact unlocks", "Verified badge", "Dedicated support"]', 3)
ON CONFLICT (slug) DO NOTHING;

-- App settings (key-value) for admin-configurable options, e.g. payment method.
CREATE TABLE IF NOT EXISTS public.app_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS: only admins can read/update; service role can read for public API.
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read app_settings"
  ON public.app_settings FOR SELECT
  TO authenticated
  USING (public.is_admin_user(auth.uid()));

CREATE POLICY "Admins can update app_settings"
  ON public.app_settings FOR ALL
  TO authenticated
  USING (public.is_admin_user(auth.uid()))
  WITH CHECK (public.is_admin_user(auth.uid()));

-- Default: payment method (razorpay | upi_qr). Service role will read this for checkout/create-order.
INSERT INTO public.app_settings (key, value)
VALUES ('payment_method', 'razorpay')
ON CONFLICT (key) DO NOTHING;

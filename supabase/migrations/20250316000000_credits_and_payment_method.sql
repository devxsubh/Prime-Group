-- Credit-based model: add credits to users; track payment method on payments.

-- User credits (buy credits, spend on contact unlocks)
ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS credits INT NOT NULL DEFAULT 0;

COMMENT ON COLUMN public.users.credits IS 'Available contact-unlock credits. Increased by purchases, decreased on unlock.';

-- Payment method used (razorpay | upi_qr)
ALTER TABLE public.payments
  ADD COLUMN IF NOT EXISTS payment_method VARCHAR(20);

-- Credits added by this payment (from plan at purchase time)
ALTER TABLE public.payments
  ADD COLUMN IF NOT EXISTS credits_added INT;

-- Allow RLS for users to read own credits (already have "Users can read own profile" / update own)
-- No change needed if existing policy allows SELECT on own row.

-- Ensure payments can be inserted by authenticated users for their own orders (e.g. from API using service role)
-- Existing policy "Admins can insert payments" is for admin. We need backend to insert/update.
-- Add policy: authenticated users can insert their own payment row (user_id = auth.uid()) for create-order flow.
DROP POLICY IF EXISTS "Users can insert own payment" ON public.payments;
CREATE POLICY "Users can insert own payment"
  ON public.payments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can read their own payments (for order status, history)
DROP POLICY IF EXISTS "Users can read own payments" ON public.payments;
CREATE POLICY "Users can read own payments"
  ON public.payments FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Backend (service role) will update payment status and credits; no policy needed for anon/authenticated update.
-- Admins already have full access via admin policies. For service role updates we don't use RLS.

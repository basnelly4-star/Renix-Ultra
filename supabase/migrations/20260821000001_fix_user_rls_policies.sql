-- Restore authenticated user access for dashboard claims, transactions, and withdrawals.
-- This does not expose another user's records.

ALTER TABLE public.claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.withdrawals ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own claims" ON public.claims;
CREATE POLICY "Users can view own claims"
  ON public.claims FOR SELECT TO authenticated
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can create own claims" ON public.claims;
CREATE POLICY "Users can create own claims"
  ON public.claims FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can view own transactions" ON public.transactions;
CREATE POLICY "Users can view own transactions"
  ON public.transactions FOR SELECT TO authenticated
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can create own transactions" ON public.transactions;
CREATE POLICY "Users can create own transactions"
  ON public.transactions FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can view own withdrawals" ON public.withdrawals;
CREATE POLICY "Users can view own withdrawals"
  ON public.withdrawals FOR SELECT TO authenticated
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can create own withdrawals" ON public.withdrawals;
CREATE POLICY "Users can create own withdrawals"
  ON public.withdrawals FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

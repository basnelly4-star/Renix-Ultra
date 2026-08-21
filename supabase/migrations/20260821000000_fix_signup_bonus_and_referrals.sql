-- Fix signup rewards and referral credits.
-- Run this in Supabase SQL Editor, or apply with Supabase migrations.

ALTER TABLE public.profiles
  ALTER COLUMN balance SET DEFAULT 20000,
  ALTER COLUMN referral_earnings SET DEFAULT 15000;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_referral_code text;
  referrer_id uuid;
  user_full_name text;
  user_referral_code text;
  welcome_bonus integer := 20000;
  referral_bonus integer := 15000;
BEGIN
  user_full_name := COALESCE(NULLIF(NEW.raw_user_meta_data->>'fullName', ''), split_part(COALESCE(NEW.email, 'user'), '@', 1), 'User');
  user_referral_code := NULLIF(upper(trim(COALESCE(NEW.raw_user_meta_data->>'referralCode', ''))), '');

  IF user_referral_code IS NOT NULL THEN
    SELECT p.id
      INTO referrer_id
      FROM public.profiles AS p
     WHERE upper(trim(p.referral_code)) = user_referral_code
     LIMIT 1;
  END IF;

  new_referral_code := 'CHIXX' || upper(substr(md5(random()::text || NEW.id::text), 1, 6));

  INSERT INTO public.profiles (
    id, full_name, email, referral_code, referred_by,
    balance, referral_earnings, total_referrals
  )
  VALUES (
    NEW.id,
    user_full_name,
    COALESCE(NEW.email, ''),
    new_referral_code,
    referrer_id,
    welcome_bonus,
    referral_bonus,
    0
  )
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.transactions (user_id, type, amount, description, status)
  SELECT NEW.id, 'credit', welcome_bonus, 'Welcome bonus', 'completed'
   WHERE NOT EXISTS (
     SELECT 1
       FROM public.transactions
      WHERE user_id = NEW.id
        AND description = 'Welcome bonus'
   );

  IF referrer_id IS NOT NULL AND referrer_id <> NEW.id THEN
    UPDATE public.profiles
       SET balance = COALESCE(balance, 0) + referral_bonus,
           total_referrals = COALESCE(total_referrals, 0) + 1,
           updated_at = now()
     WHERE id = referrer_id;

    INSERT INTO public.transactions (user_id, type, amount, description, status)
    VALUES (
      referrer_id,
      'credit',
      referral_bonus,
      'Referral bonus from ' || user_full_name,
      'completed'
    );
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Repair existing profiles that were created without the welcome credit.
UPDATE public.profiles AS p
   SET balance = 20000,
       updated_at = now()
 WHERE COALESCE(p.balance, 0) < 20000
   AND NOT EXISTS (
     SELECT 1 FROM public.transactions AS t
      WHERE t.user_id = p.id
        AND t.description = 'Welcome bonus'
   );

INSERT INTO public.transactions (user_id, type, amount, description, status)
SELECT p.id, 'credit', 20000, 'Welcome bonus', 'completed'
  FROM public.profiles AS p
 WHERE COALESCE(p.balance, 0) >= 20000
   AND NOT EXISTS (
     SELECT 1 FROM public.transactions AS t
      WHERE t.user_id = p.id
        AND t.description = 'Welcome bonus'
   );

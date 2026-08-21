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

-- Google OAuth does not include the app referral code in raw_user_meta_data.
-- Call this function after OAuth returns to finish rewards exactly once.
CREATE OR REPLACE FUNCTION public.finalize_signup_rewards(p_referral_code text DEFAULT NULL)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_user_id uuid := auth.uid();
  current_profile public.profiles%ROWTYPE;
  referrer_id uuid;
  welcome_bonus integer := 20000;
  referral_bonus integer := 15000;
BEGIN
  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  SELECT * INTO current_profile
    FROM public.profiles
   WHERE id = current_user_id
   FOR UPDATE;

  IF current_profile.id IS NULL THEN
    RAISE EXCEPTION 'Profile not found';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM public.transactions
     WHERE user_id = current_user_id
       AND description = 'Welcome bonus'
  ) THEN
    UPDATE public.profiles
       SET balance = COALESCE(balance, 0) + welcome_bonus,
           updated_at = now()
     WHERE id = current_user_id;

    INSERT INTO public.transactions (user_id, type, amount, description, status)
    VALUES (current_user_id, 'credit', welcome_bonus, 'Welcome bonus', 'completed');
  END IF;

  IF current_profile.referred_by IS NULL AND NULLIF(trim(p_referral_code), '') IS NOT NULL THEN
    SELECT id INTO referrer_id
      FROM public.profiles
     WHERE upper(trim(referral_code)) = upper(trim(p_referral_code))
       AND id <> current_user_id
     LIMIT 1;

    IF referrer_id IS NOT NULL THEN
      UPDATE public.profiles
         SET referred_by = referrer_id,
             updated_at = now()
       WHERE id = current_user_id;

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
        'Referral bonus for user ' || current_user_id::text,
        'completed'
      );
    END IF;
  END IF;
END;
$$;

REVOKE ALL ON FUNCTION public.finalize_signup_rewards(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.finalize_signup_rewards(text) TO authenticated;

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

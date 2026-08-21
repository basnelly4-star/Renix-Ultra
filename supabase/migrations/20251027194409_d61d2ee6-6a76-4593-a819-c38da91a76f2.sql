-- Drop and recreate the handle_new_user function with better error handling
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  new_referral_code TEXT;
  referrer_id UUID;
  user_full_name TEXT;
  user_referral_code TEXT;
BEGIN
  -- Generate unique referral code
  new_referral_code := 'CHIXX' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 6));
  
  -- Safely extract metadata with null coalescing
  user_full_name := COALESCE(NEW.raw_user_meta_data->>'fullName', '');
  user_referral_code := COALESCE(NEW.raw_user_meta_data->>'referralCode', '');
  
  -- Get referrer if referral code exists and is not empty
  IF user_referral_code IS NOT NULL AND user_referral_code != '' THEN
    SELECT id INTO referrer_id FROM public.profiles 
    WHERE referral_code = user_referral_code;
  END IF;
  
  -- Insert profile
  INSERT INTO public.profiles (id, full_name, email, referral_code, referred_by)
  VALUES (
    NEW.id,
    user_full_name,
    COALESCE(NEW.email, ''),
    new_referral_code,
    referrer_id
  );
  
  -- Update referrer stats if exists
  IF referrer_id IS NOT NULL THEN
    UPDATE public.profiles 
    SET 
      total_referrals = total_referrals + 1,
      balance = balance + referral_earnings
    WHERE id = referrer_id;
    
    -- Create transaction for referrer
    INSERT INTO public.transactions (user_id, type, amount, description, status)
    VALUES (
      referrer_id, 
      'credit', 
      15000.00, 
      'Referral bonus from ' || user_full_name,
      'completed'
    );
  END IF;
  
  -- Create welcome bonus transaction
  INSERT INTO public.transactions (user_id, type, amount, description, status)
  VALUES (NEW.id, 'credit', 20000.00, 'Welcome bonus', 'completed');
  
  RETURN NEW;
END;
$$;
-- Create daily_rewards table to track daily reward claims
CREATE TABLE IF NOT EXISTS public.daily_rewards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  day INTEGER NOT NULL CHECK (day >= 1 AND day <= 8),
  amount NUMERIC NOT NULL DEFAULT 10000,
  claimed_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add daily reward tracking columns to profiles table if they don't exist
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS daily_reward_day INTEGER DEFAULT 0;

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS last_claim_date TIMESTAMP WITH TIME ZONE;

-- Enable RLS
ALTER TABLE public.daily_rewards ENABLE ROW LEVEL SECURITY;

-- Users can view their own daily rewards
CREATE POLICY "Users can view own daily rewards"
  ON public.daily_rewards
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own daily rewards
CREATE POLICY "Users can insert own daily rewards"
  ON public.daily_rewards
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_daily_rewards_user_id ON public.daily_rewards(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_rewards_claimed_date ON public.daily_rewards(claimed_date DESC);
CREATE INDEX IF NOT EXISTS idx_daily_rewards_user_day ON public.daily_rewards(user_id, day);

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Gift, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface DayReward {
  day: number;
  amount: number;
  claimed: boolean;
  nextClaimDate?: string;
}

const DailyRewards = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [rewards, setRewards] = useState<DayReward[]>([]);
  const [loading, setLoading] = useState(true);
  const [claimingDay, setClaimingDay] = useState<number | null>(null);
  const [userEmail, setUserEmail] = useState<string>("");

  // Initialize reward data
  useEffect(() => {
    const fetchRewards = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) {
          navigate("/auth");
          return;
        }

        setUserEmail(session.user.email || "");

        // Check user's daily rewards status
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();

        if (profile) {
          const lastClaimDate = profile.last_claim_date
            ? new Date(profile.last_claim_date)
            : null;
          const today = new Date();
          today.setHours(0, 0, 0, 0);

          // Initialize 8 days of rewards
          const initialized: DayReward[] = Array.from({ length: 8 }, (_, i) => {
            const day = i + 1;
            const isClaimed =
              lastClaimDate &&
              lastClaimDate.toDateString() === today.toDateString() &&
              profile.daily_reward_day === day;

            return {
              day,
              amount: 100000,
              claimed: isClaimed,
              nextClaimDate: today.toISOString(),
            };
          });

          setRewards(initialized);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching rewards:", error);
        toast.error("Failed to load rewards");
        setLoading(false);
      }
    };

    fetchRewards();
  }, [navigate, toast]);

  const handleClaimReward = async (day: number) => {
    try {
      setClaimingDay(day);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Please login first");
        return;
      }

      // Get current profile
      const { data: profile } = await supabase
        .from("profiles")
        .select("balance, daily_reward_day, last_claim_date")
        .eq("id", user.id)
        .single();

      if (!profile) {
        toast.error("Profile not found");
        return;
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const lastClaimDate = profile.last_claim_date
        ? new Date(profile.last_claim_date)
        : null;

      // Check if already claimed today
      if (
        lastClaimDate &&
        lastClaimDate.toDateString() === today.toDateString()
      ) {
        toast.error("Already claimed today! Come back tomorrow.");
        setClaimingDay(null);
        return;
      }

      const rewardAmount = 100000;
      const newBalance = (profile.balance || 0) + rewardAmount;

      // Update profile with new balance and claim info
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          balance: newBalance,
          daily_reward_day: day,
          last_claim_date: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (updateError) throw updateError;

      // Record the claim in daily_rewards table
      await supabase.from("daily_rewards").insert({
        user_id: user.id,
        day,
        amount: rewardAmount,
        claimed_date: new Date().toISOString(),
      });

      toast.success(`₦${rewardAmount.toLocaleString()} claimed for Day ${day}!`);

      // Update local state
      setRewards((prev) =>
        prev.map((r) => (r.day === day ? { ...r, claimed: true } : r))
      );

      setClaimingDay(null);
    } catch (error) {
      console.error("Claim error:", error);
      toast.error("Failed to claim reward");
      setClaimingDay(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent" />
          <p className="mt-4 text-muted-foreground">Loading rewards...</p>
        </div>
      </div>
    );
  }

  const claimedToday = rewards.some((r) => r.claimed);
  const readyToClaim = !claimedToday;

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#0a0a0a] to-black px-4 py-6">
      {/* Header Section */}
      <div className="mb-8 mt-6">
        <div className="relative mx-auto max-w-2xl overflow-hidden rounded-3xl bg-gradient-to-br from-[#EAB308] via-[#FBBF24] to-[#CA8A04] p-0.5">
          <div className="rounded-3xl bg-black p-8 text-center">
            <div className="mb-6 flex justify-center">
              <div className="rounded-full border-4 border-[#EAB308] p-4">
                <Gift className="h-8 w-8 text-[#EAB308]" />
              </div>
            </div>

            <h1 className="mb-2 text-2xl font-bold text-white">
              Your reward is ready!
            </h1>
            <p className="mb-6 text-sm text-muted-foreground">
              Claim your daily bonus and grow your balance
            </p>

            <button
              onClick={() => {
                if (readyToClaim && rewards.length > 0) {
                  const firstReward = rewards.find((r) => r.day === 1);
                  if (firstReward) {
                    handleClaimReward(firstReward.day);
                  }
                }
              }}
              disabled={!readyToClaim || claimingDay !== null}
              className={`w-full rounded-2xl px-6 py-3 font-bold text-lg transition-all duration-300 ${
                readyToClaim && claimingDay === null
                  ? "bg-gradient-to-r from-[#EAB308] to-[#FBBF24] text-black hover:shadow-[0_0_30px_rgba(234,179,8,0.5)] active:scale-95"
                  : "bg-muted text-muted-foreground cursor-not-allowed"
              }`}
            >
              {claimingDay ? "Claiming..." : "Ready to Claim! 🎉"}
            </button>
          </div>
        </div>
      </div>

      {/* Rewards Grid */}
      <div className="mx-auto max-w-2xl">
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Claim your 8-day streak
          </p>
        </div>

        <div className="grid grid-cols-4 gap-3 sm:gap-4">
          {rewards.map((reward) => (
            <Card
              key={reward.day}
              className={`relative overflow-hidden rounded-2xl border p-4 text-center transition-all duration-300 ${
                reward.claimed
                  ? "border-[#EAB308] bg-gradient-to-br from-black/80 to-black shadow-[0_0_20px_rgba(234,179,8,0.2)]"
                  : "border-white/10 bg-gradient-to-br from-white/5 to-white/2 hover:border-white/20"
              }`}
            >
              {reward.claimed && (
                <div className="absolute inset-0 bg-gradient-to-t from-[#EAB308]/10 to-transparent" />
              )}

              <div className="relative z-10">
                <p className="text-xs font-semibold text-muted-foreground mb-2">
                  Day {reward.day}
                </p>

                <p className={`font-bold text-sm mb-3 ${
                  reward.claimed ? "text-[#EAB308]" : "text-foreground"
                }`}>
                  ₦{(reward.amount / 1000).toLocaleString()}K
                </p>

                {reward.claimed ? (
                  <div className="flex justify-center">
                    <div className="rounded-full bg-[#EAB308]/20 p-2">
                      <Check className="h-4 w-4 text-[#EAB308]" />
                    </div>
                  </div>
                ) : reward.day === 1 && readyToClaim ? (
                  <button
                    onClick={() => handleClaimReward(reward.day)}
                    disabled={claimingDay !== null}
                    className="w-full rounded-lg bg-[#EAB308] px-2 py-1.5 text-xs font-bold text-black transition-all hover:shadow-[0_0_15px_rgba(234,179,8,0.4)] active:scale-95"
                  >
                    {claimingDay === reward.day ? "..." : "Ready"}
                  </button>
                ) : (
                  <div className="flex justify-center">
                    <Lock className="h-4 w-4 text-muted-foreground" />
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Info Section */}
      <div className="mx-auto mt-12 max-w-2xl rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
        <h3 className="mb-4 font-semibold text-foreground">How it works</h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex items-start gap-3">
            <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-[#EAB308]" />
            Claim one reward per day for 8 consecutive days
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-[#EAB308]" />
            Each day gives you ₦100,000 bonus
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-[#EAB308]" />
            Complete the streak to earn ₦800,000 total
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-[#EAB308]" />
            Claims reset daily at midnight
          </li>
        </ul>
      </div>

      {/* Back Button */}
      <div className="mt-8 flex justify-center">
        <Button
          variant="ghost"
          onClick={() => navigate("/dashboard")}
          className="text-muted-foreground hover:text-foreground"
        >
          Back to Dashboard
        </Button>
      </div>
    </div>
  );
};

export default DailyRewards;

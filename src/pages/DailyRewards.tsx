import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Gift, Check, Flame } from "lucide-react";
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

interface RewardStatus {
  currentDay: number;
  nextDay: number;
  claimedToday: boolean;
  streakReset: boolean;
  streakLost: boolean;
  hasClaimedBefore: boolean;
}

const normalizeDay = (date: Date) => {
  const normalized = new Date(date);
  normalized.setHours(0, 0, 0, 0);
  return normalized;
};

const isSameDay = (a: Date, b: Date) => a.getTime() === b.getTime();

const getRewardStatus = (profile: any): RewardStatus => {
  const today = normalizeDay(new Date());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  // Get streak data from localStorage
  const storedData = localStorage.getItem("dailyRewardStreak");
  const streakData = storedData ? JSON.parse(storedData) : { currentDay: 0, lastClaimDate: null };

  const currentDay = streakData.currentDay || 0;
  const lastClaimDateStr = streakData.lastClaimDate;
  const lastClaimDate = lastClaimDateStr ? normalizeDay(new Date(lastClaimDateStr)) : null;

  if (!lastClaimDate) {
    return {
      currentDay: 0,
      nextDay: 1,
      claimedToday: false,
      streakReset: false,
      streakLost: false,
      hasClaimedBefore: false,
    };
  }

  if (isSameDay(lastClaimDate, today)) {
    return {
      currentDay,
      nextDay: currentDay < 8 ? currentDay + 1 : 1,
      claimedToday: true,
      streakReset: false,
      streakLost: false,
      hasClaimedBefore: true,
    };
  }

  if (isSameDay(lastClaimDate, yesterday) && currentDay >= 1 && currentDay < 8) {
    return {
      currentDay,
      nextDay: currentDay + 1,
      claimedToday: false,
      streakReset: false,
      streakLost: false,
      hasClaimedBefore: true,
    };
  }

  return {
    currentDay: 0,
    nextDay: 1,
    claimedToday: false,
    streakReset: true,
    streakLost: true,
    hasClaimedBefore: true,
  };
};

const DailyRewards = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [rewards, setRewards] = useState<DayReward[]>([]);
  const [rewardStatus, setRewardStatus] = useState<RewardStatus>({
    currentDay: 0,
    nextDay: 1,
    claimedToday: false,
    streakReset: false,
    streakLost: false,
    hasClaimedBefore: false,
  });
  const [loading, setLoading] = useState(true);
  const [claimingDay, setClaimingDay] = useState<number | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [claimedAmount, setClaimedAmount] = useState(0);
  const [claimedDayNum, setClaimedDayNum] = useState(0);
  const [timeUntilNextClaim, setTimeUntilNextClaim] = useState<{
    hours: number;
    minutes: number;
    seconds: number;
  }>({ hours: 0, minutes: 0, seconds: 0 });

  // Initialize reward data
  useEffect(() => {
    const fetchRewards = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) {
          navigate("/auth");
          return;
        }

        // Check user's daily rewards status
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("id,balance")
          .eq("id", session.user.id)
          .single();

        if (profileError) {
          console.error('Profile fetch error:', profileError);
          throw profileError;
        }

        if (profile) {
          const rewardStatus = getRewardStatus(profile);
          const today = new Date();
          today.setHours(0, 0, 0, 0);

          const initialized: DayReward[] = Array.from({ length: 8 }, (_, i) => {
            const day = i + 1;
            const amount = 10000 + (day - 1) * 5000; // Day 1: 10k, Day 2: 15k, Day 3: 20k, etc.
            return {
              day,
              amount,
              claimed: day <= rewardStatus.currentDay,
              nextClaimDate: today.toISOString(),
            };
          });

          setRewardStatus(rewardStatus);
          setRewards(initialized);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching rewards:", error);
        toast({ description: "Failed to load rewards" });
        setLoading(false);
      }
    };

    fetchRewards();
  }, [navigate, toast]);

  // Timer for next claim
  useEffect(() => {
    if (!rewardStatus.claimedToday) return;

    const updateTimer = () => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);

      const diff = tomorrow.getTime() - now.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeUntilNextClaim({ hours, minutes, seconds });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [rewardStatus.claimedToday]);
  const handleClaimReward = async (day: number) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({ description: "Please login first" });
        return;
      }

      // Get current profile - only fetch balance
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("balance")
        .eq("id", user.id)
        .single();

      if (profileError || !profile) {
        toast({ description: "Failed to load profile" });
        return;
      }

      const rewardState = getRewardStatus(profile);

      if (rewardState.claimedToday) {
        toast({ description: "Already claimed today! Come back tomorrow." });
        return;
      }

      if (day !== rewardState.nextDay) {
        toast({ description: "Your streak has reset. Claim Day 1." });
        return;
      }

      const rewardAmount = 10000 + (day - 1) * 5000;

      // OPTIMISTIC UPDATE - Update UI immediately
      setClaimingDay(day);
      setClaimedAmount(rewardAmount);
      setClaimedDayNum(day);

      const updatedStatus: RewardStatus = {
        currentDay: day,
        nextDay: day < 8 ? day + 1 : 1,
        claimedToday: true,
        streakReset: false,
        streakLost: false,
        hasClaimedBefore: true,
      };

      setRewardStatus(updatedStatus);
      setRewards((prev) => prev.map((r) => ({ ...r, claimed: r.day <= day })));

      // Show confetti immediately
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);

      // Save streak data to localStorage immediately
      const streakData = {
        currentDay: day,
        lastClaimDate: new Date().toISOString(),
      };
      localStorage.setItem("dailyRewardStreak", JSON.stringify(streakData));

      // Do database operations in background (non-blocking)
      const newBalance = (profile.balance || 0) + rewardAmount;
      
      // Update balance in background
      supabase
        .from("profiles")
        .update({ balance: newBalance })
        .eq("id", user.id)
        .then((result) => {
          if (!result.error) {
            toast({ description: `₦${rewardAmount.toLocaleString()} added to your balance!` });
          } else {
            console.error('Update error:', result.error);
            toast({ description: "Failed to save balance (try refreshing)" });
          }
        });

      // Log the claim in claims table (non-blocking)
      const claimData = {
        user_id: user.id,
        amount: rewardAmount,
        claimed_at: new Date().toISOString(),
      };
      
      supabase
        .from("claims")
        .insert([claimData])
        .then((result) => {
          if (result.error) {
            console.error('Insert error:', result.error);
          }
        });

      setClaimingDay(null);
    } catch (error) {
      console.error("Claim error:", error);
      toast({ description: "Failed to claim reward" });
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

  const claimedToday = rewardStatus.claimedToday;
  const availableDay = rewardStatus.nextDay;
  const readyToClaim = !claimedToday;
  const headerTitle = claimedToday
    ? rewardStatus.currentDay === 8
      ? "Streak Complete!"
      : `Day ${rewardStatus.currentDay} claimed`
    : "Your reward is ready!";
  const headerSubtitle = claimedToday
    ? "You already claimed today. Earn more by completing daily tasks."
    : `Claim Day ${availableDay} now and keep your streak alive.`;
  const headerButtonText = claimingDay
    ? "Claiming..."
    : claimedToday
    ? "Earn More"
    : `Claim Day ${availableDay}`;
  const showStreakResetNotice = rewardStatus.streakReset && rewardStatus.hasClaimedBefore && !claimedToday;

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#0a0a0a] to-black px-4 py-6">
      {/* Confetti Celebration Popup */}
      {showConfetti && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          {/* Confetti Burst - Multiple Particles */}
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className={`absolute w-2 h-2 animate-pulse confetti-particle confetti-${i} confetti-color-${i % 4}`}
            />
          ))}
          
          {/* Celebration Card */}
          <div className="absolute bg-gradient-to-br from-[#EAB308] via-[#FBBF24] to-[#CA8A04] rounded-3xl p-1 shadow-2xl shadow-[#EAB308]/50 animate-bounce-slow z-10">
            <div className="bg-black rounded-3xl p-8 text-center min-w-[280px]">
              <div className="mb-4 text-5xl animate-bounce">🎉</div>
              <h2 className="text-2xl font-bold text-[#EAB308] mb-2">Congratulations!</h2>
              <p className="text-white text-lg font-bold mb-1">Day {claimedDayNum} Reward Claimed!</p>
              <p className="text-[#FBBF24] text-3xl font-bold">₦{claimedAmount.toLocaleString()}</p>
              <div className="mt-4 text-green-400 flex items-center justify-center gap-2">
                <Check className="w-5 h-5" />
                <span className="font-semibold">Added to your balance</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Streak Counter Top Bar */}
      <div className="mx-auto max-w-2xl mb-6">
        <div className="flex items-center justify-between rounded-2xl border border-[#EAB308]/30 bg-gradient-to-r from-[#EAB308]/10 to-[#CA8A04]/10 px-6 py-3 shadow-lg shadow-[#EAB308]/10">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-[#EAB308]/20 p-2">
              <Flame className="h-5 w-5 text-[#EAB308]" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Current Streak
              </p>
              <p className="text-lg font-bold text-[#EAB308]">
                {rewardStatus.currentDay} / 8
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Total Earnings</p>
            <p className="text-xl font-bold text-white">
              ₦{rewards.slice(0, rewardStatus.currentDay).reduce((sum, r) => sum + r.amount, 0).toLocaleString()}
            </p>
          </div>
        </div>
      </div>

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
              {headerTitle}
            </h1>
            <p className="mb-6 text-sm text-muted-foreground">
              {headerSubtitle}
            </p>

            <button
              onClick={() => {
                if (claimedToday) {
                  navigate("/tasks");
                  return;
                }

                if (readyToClaim) {
                  handleClaimReward(availableDay);
                }
              }}
              disabled={claimingDay !== null}
              className={`w-full rounded-2xl px-6 py-3 font-bold text-lg transition-all duration-300 ${
                claimingDay === null
                  ? claimedToday
                    ? "bg-gradient-to-r from-[#EAB308] to-[#FBBF24] text-black hover:shadow-[0_0_30px_rgba(234,179,8,0.5)] active:scale-95"
                    : "bg-gradient-to-r from-[#EAB308] to-[#FBBF24] text-black hover:shadow-[0_0_30px_rgba(234,179,8,0.5)] active:scale-95"
                  : "bg-muted text-muted-foreground cursor-not-allowed"
              }`}
            >
              {headerButtonText}
            </button>

            {claimedToday && (
              <div className="mt-2 rounded-lg border border-[#EAB308]/20 bg-black/50 p-2 backdrop-blur-sm">
                <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-[#EAB308]">
                  Want more rewards?
                </p>
                <div className="flex items-center justify-center gap-1 text-center">
                  <div className="rounded bg-[#EAB308]/10 px-1.5 py-1 border border-[#EAB308]/20">
                    <p className="text-sm font-bold text-[#EAB308]">
                      {String(timeUntilNextClaim.hours).padStart(2, "0")}
                    </p>
                    <p className="text-[8px] text-muted-foreground">h</p>
                  </div>
                  <span className="text-[#EAB308]/60 text-xs font-bold">:</span>
                  <div className="rounded bg-[#EAB308]/10 px-1.5 py-1 border border-[#EAB308]/20">
                    <p className="text-sm font-bold text-[#EAB308]">
                      {String(timeUntilNextClaim.minutes).padStart(2, "0")}
                    </p>
                    <p className="text-[8px] text-muted-foreground">m</p>
                  </div>
                  <span className="text-[#EAB308]/60 text-xs font-bold">:</span>
                  <div className="rounded bg-[#EAB308]/10 px-1.5 py-1 border border-[#EAB308]/20">
                    <p className="text-sm font-bold text-[#EAB308]">
                      {String(timeUntilNextClaim.seconds).padStart(2, "0")}
                    </p>
                    <p className="text-[8px] text-muted-foreground">s</p>
                  </div>
                </div>
              </div>
            )}

            {claimedToday && (
              <div className="mt-4 rounded-2xl border border-[#EAB308]/30 bg-gradient-to-br from-[#EAB308] to-[#FBBF24] p-4 text-left text-sm text-white shadow-[0_0_20px_rgba(234,179,8,0.15)]">
                <p className="font-medium text-white">Want more rewards?</p>
                <p className="text-xs text-white">
                  Complete the 17 daily tasks to keep earning after your claim.
                </p>
              </div>
            )}
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

        <div className="grid grid-cols-4 gap-2 sm:gap-2.5">
          {rewards.map((reward) => (
            <Card
              key={reward.day}
              className={`relative overflow-hidden rounded-lg border p-2 text-center transition-all duration-300 ${
                reward.claimed
                  ? "border-[#EAB308] bg-gradient-to-br from-black/80 to-black shadow-[0_0_20px_rgba(234,179,8,0.2)]"
                  : "border-white/10 bg-gradient-to-br from-white/5 to-white/2 hover:border-white/20"
              }`}
            >
              {reward.claimed && (
                <div className="absolute inset-0 bg-gradient-to-t from-[#EAB308]/10 to-transparent" />
              )}

              <div className="relative z-10">
                <p className="text-[10px] font-semibold text-muted-foreground mb-1">
                  Day {reward.day}
                </p>

                <p className={`font-bold text-xs mb-1.5 ${
                  reward.claimed ? "text-[#EAB308]" : "text-foreground"
                }`}>
                  ₦{(reward.amount / 1000).toLocaleString()}K
                </p>

                {reward.claimed ? (
                  <div className="flex justify-center">
                    <div className="rounded-full bg-[#EAB308]/20 p-1">
                      <Check className="h-3 w-3 text-[#EAB308]" />
                    </div>
                  </div>
                ) : reward.day === availableDay && readyToClaim ? (
                  <button
                    onClick={() => handleClaimReward(reward.day)}
                    disabled={claimingDay !== null}
                    className="w-full rounded bg-[#EAB308] px-1 py-0.5 text-[10px] font-bold text-black transition-all hover:shadow-[0_0_15px_rgba(234,179,8,0.4)] active:scale-95"
                  >
                    {claimingDay === reward.day ? "..." : "Ready"}
                  </button>
                ) : (
                  <div className="flex justify-center">
                    <Lock className="h-3 w-3 text-muted-foreground" />
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
            Day 1: ₦10,000 | Day 2: ₦15,000 | Day 3: ₦20,000 (increases by ₦5,000 per day)
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-[#EAB308]" />
            Complete all 8 days to earn ₦340,000 total
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-[#EAB308]" />
            Miss a day and the streak resets to Day 1
          </li>
        </ul>
      </div>
      {showStreakResetNotice && (
        <div className="mx-auto mt-6 max-w-2xl rounded-2xl border border-[#EAB308]/20 bg-[#111111]/90 p-4 text-sm text-[#EAB308] shadow-lg shadow-[#EAB308]/10">
          <p>
            You missed a day, so your streak has been reset. Claim Day 1 to start again.
          </p>
        </div>
      )}

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

      <style>{`
        @keyframes confetti-burst {
          0% {
            transform: translate(0, 0) scale(1);
            opacity: 1;
            left: 50%;
            top: 50%;
          }
          100% {
            opacity: 0;
          }
        }
        
        @keyframes bounce-slow {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        
        .animate-bounce-slow {
          animation: bounce-slow 1s ease-in-out infinite;
        }

        .confetti-particle {
          left: 50%;
          top: 50%;
          position: absolute;
        }

        .confetti-color-0 {
          background-color: #EAB308;
        }

        .confetti-color-1 {
          background-color: #FBBF24;
        }

        .confetti-color-2 {
          background-color: #CA8A04;
        }

        .confetti-color-3 {
          background-color: #FFD700;
        }

        ${Array.from({ length: 50 }).map((_, i) => {
          const angle = (i / 50) * Math.PI * 2;
          const distance = 150 + Math.random() * 150;
          const tx = Math.cos(angle) * distance;
          const ty = Math.sin(angle) * distance - 100;
          const delay = i * 0.02;
          return `.confetti-${i} {
            animation: confetti-burst 2.5s ease-out ${delay}s forwards !important;
            --tx: ${tx}px;
            --ty: ${ty}px;
            transform: translate(var(--tx), var(--ty)) scale(0);
          }`;
        }).join('')}
      `}</style>
    </div>
  );
};

export default DailyRewards;

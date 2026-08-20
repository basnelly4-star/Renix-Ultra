import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Eye,
  EyeOff,
  Copy,
  Banknote,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Send,
  Users,
} from "lucide-react";
import {
  RewardsIcon,
  WithdrawIcon,
  HistoryIcon,
  CommunityIcon,
  ProfileIcon,
  TasksIcon,
  SupportIcon,
  SecurityIcon,
} from "@/assets/icons";
import { toast } from "sonner";
import {
  recoverFromInvalidRefreshToken,
  supabase,
} from "@/integrations/supabase/client";
import { FloatingActionButton } from "@/components/FloatingActionButton";
import { WelcomeModal } from "@/components/WelcomeModal";
import { WithdrawalNotification } from "@/components/WithdrawalNotification";
import { AddBalanceModal } from "@/components/AddBalanceModal";
import { WithdrawalMilestoneModal } from "@/components/WithdrawalMilestoneModal";
import DailyTasksPopup from "@/components/DailyTasksPopup";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const [showBalance, setShowBalance] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);
  const [canClaim, setCanClaim] = useState(false);
  const [lastClaimTime, setLastClaimTime] = useState<Date | null>(null);
  const [showTopUp, setShowTopUp] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState("Ready!");
  const [showDailyRewardNotif, setShowDailyRewardNotif] = useState(false);
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [showTestimonials, setShowTestimonials] = useState(false);
  const [showMilestoneModal, setShowMilestoneModal] = useState(false);
  const [showDailyTasksPopup, setShowDailyTasksPopup] = useState(false);
  const authRetryCountRef = useRef(0);
  const touchStartRef = useRef(0);
  const milestoneShownRef = useRef(false);
  const dailyRewardNotifTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const dailyRewardIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const testimonialIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const dailyTasksIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const dailyTasksHideTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const whySlideshowRef = useRef<NodeJS.Timeout | null>(null);
  const hasDailyClaimedRef = useRef(false);

  const testimonials = [
    {
      name: "Samuel T.",
      location: "Port Harcourt",
      amount: "₦520,000",
      quote: "The referral bonus is the best part. I invited 6 active users.",
    },
    {
      name: "Blessing O.",
      location: "Abuja",
      amount: "₦410,000",
      quote:
        "I love how simple the tasks are. Withdrawals processed in 48 hours.",
    },
    {
      name: "Chinedu A.",
      location: "Lagos",
      amount: "₦580,000",
      quote:
        "I was skeptical but earned my first withdrawal successfully. Renix-Ultra is legit!",
    },
    {
      name: "Amina F.",
      location: "Kano",
      amount: "₦450,000",
      quote: "Daily rewards and instant payouts. Best earning app I've used!",
    },
  ];

  useEffect(() => {
    checkAuth();
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "SIGNED_OUT") {
          setTimeout(() => checkAuth(), 300);
        } else if (session) {
          setUser(session.user);
          loadProfile(session.user.id);
        }
      },
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate]);

  // Daily Reward Notification Popup
  useEffect(() => {
    if (!profile) return;

    const checkDailyReward = () => {
      const storedData = localStorage.getItem("dailyRewardStreak");
      const streakData = storedData ? JSON.parse(storedData) : null;

      if (streakData?.lastClaimDate) {
        const lastClaim = new Date(streakData.lastClaimDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        lastClaim.setHours(0, 0, 0, 0);

        if (lastClaim.getTime() === today.getTime()) {
          hasDailyClaimedRef.current = true;
          if (dailyRewardIntervalRef.current) {
            clearInterval(dailyRewardIntervalRef.current);
            dailyRewardIntervalRef.current = null;
          }
          return;
        }
      }

      hasDailyClaimedRef.current = false;

      const showNotif = () => {
        setShowDailyRewardNotif(true);
        if (dailyRewardNotifTimeoutRef.current) {
          clearTimeout(dailyRewardNotifTimeoutRef.current);
        }
        dailyRewardNotifTimeoutRef.current = setTimeout(() => {
          setShowDailyRewardNotif(false);
        }, 10000);
      };

      dailyRewardIntervalRef.current = setInterval(showNotif, 60000);
    };

    checkDailyReward();

    // DAILY TASKS POPUP: show every 10s for 5s repeatedly until tasks complete
    try {
      const TASK_COUNT = 17;
      const isTaskClaimedToday = (taskId: number) => {
        const lastClaim = localStorage.getItem(`task_${taskId}_claimed`);
        if (!lastClaim) return false;
        const today = new Date().toDateString();
        const lastClaimDate = new Date(lastClaim).toDateString();
        return today === lastClaimDate;
      };

      let completed = 0;
      for (let i = 1; i <= TASK_COUNT; i++)
        if (isTaskClaimedToday(i)) completed++;

      const popupKey = `dailyTasksPopupShown_${profile.id}`;
      const todayKey = new Date().toDateString();

      if (completed >= TASK_COUNT) {
        try {
          localStorage.setItem(popupKey, todayKey);
        } catch (e) {}
        setShowDailyTasksPopup(false);
        if (dailyTasksIntervalRef.current) {
          clearInterval(dailyTasksIntervalRef.current);
          dailyTasksIntervalRef.current = null;
        }
        if (dailyTasksHideTimeoutRef.current) {
          clearTimeout(dailyTasksHideTimeoutRef.current);
          dailyTasksHideTimeoutRef.current = null;
        }
      } else {
        if (!dailyTasksIntervalRef.current) {
          setShowDailyTasksPopup(true);
          dailyTasksHideTimeoutRef.current = setTimeout(
            () => setShowDailyTasksPopup(false),
            5000,
          );

          dailyTasksIntervalRef.current = setInterval(() => {
            setShowDailyTasksPopup(true);
            if (dailyTasksHideTimeoutRef.current)
              clearTimeout(dailyTasksHideTimeoutRef.current);
            dailyTasksHideTimeoutRef.current = setTimeout(
              () => setShowDailyTasksPopup(false),
              5000,
            );
          }, 10000);
        }
      }
    } catch (e) {
      // ignore localStorage errors
    }

    return () => {
      if (dailyRewardIntervalRef.current) {
        clearInterval(dailyRewardIntervalRef.current);
      }
      if (dailyRewardNotifTimeoutRef.current) {
        clearTimeout(dailyRewardNotifTimeoutRef.current);
      }
      if (dailyTasksIntervalRef.current) {
        clearInterval(dailyTasksIntervalRef.current);
        dailyTasksIntervalRef.current = null;
      }
      if (dailyTasksHideTimeoutRef.current) {
        clearTimeout(dailyTasksHideTimeoutRef.current);
        dailyTasksHideTimeoutRef.current = null;
      }
    };
  }, [profile]);

  // Withdrawal Milestone Check
  useEffect(() => {
    if (!profile) return;

    const MINIMUM_WITHDRAW = 180000;
    const hasReachedMilestone = profile.balance >= MINIMUM_WITHDRAW;

    const milestoneKey = `withdrawal_milestone_seen_${profile.id}`;
    const hasSeenMilestone = localStorage.getItem(milestoneKey) === "true";

    if (
      hasReachedMilestone &&
      !hasSeenMilestone &&
      !milestoneShownRef.current
    ) {
      milestoneShownRef.current = true;
      setTimeout(() => {
        setShowMilestoneModal(true);
        localStorage.setItem(milestoneKey, "true");
      }, 500);
    }
  }, [profile]);

  // Testimonial Carousel Auto-rotate
  useEffect(() => {
    testimonialIntervalRef.current = setInterval(() => {
      setTestimonialIndex((prev) => (prev + 1) % testimonials.length);
    }, 60000);

    return () => {
      if (testimonialIntervalRef.current) {
        clearInterval(testimonialIntervalRef.current);
      }
    };
  }, [testimonials.length]);

  // Why Renix-Ultra auto-slideshow every 5 seconds
  useEffect(() => {
    const startSlideshow = () => {
      whySlideshowRef.current = setInterval(() => {
        setShowTestimonials((prev) => !prev);
      }, 5000);
    };

    startSlideshow();

    return () => {
      if (whySlideshowRef.current) clearInterval(whySlideshowRef.current);
    };
  }, []);

  const resetWhySlideshow = () => {
    if (whySlideshowRef.current) clearInterval(whySlideshowRef.current);
    whySlideshowRef.current = setInterval(() => {
      setShowTestimonials((prev) => !prev);
    }, 5000);
  };

  useEffect(() => {
    if (lastClaimTime) {
      const updateCountdown = () => {
        const timeDiff = Date.now() - lastClaimTime.getTime();
        const canClaimNow = timeDiff >= 2 * 60 * 1000;

        if (canClaimNow) {
          setTimeRemaining("Ready!");
          setCanClaim(true);
        } else {
          const remainingTime = 2 * 60 * 1000 - timeDiff;
          const minutes = Math.floor(remainingTime / 60000);
          const seconds = Math.floor((remainingTime % 60000) / 1000);
          setTimeRemaining(`${minutes}:${seconds.toString().padStart(2, "0")}`);
          setCanClaim(false);
        }
      };

      updateCountdown();
      const interval = setInterval(updateCountdown, 1000);
      return () => clearInterval(interval);
    }
  }, [lastClaimTime]);

  const checkAuth = async () => {
    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) {
        const recovered = await recoverFromInvalidRefreshToken(error);
        if (recovered) {
          setLoading(false);
          navigate("/auth");
          return;
        }

        console.warn("[Dashboard] Session check error:", error);
        if (authRetryCountRef.current < 3) {
          authRetryCountRef.current += 1;
          setTimeout(() => checkAuth(), 1000);
        } else {
          setLoading(false);
          toast.error("Authentication check failed. Please login again.");
          navigate("/auth");
        }
        return;
      }

      authRetryCountRef.current = 0;

      let userId = session?.user?.id;
      let authUser = session?.user ?? null;

      if (!userId) {
        const { data: userData, error: userError } =
          await supabase.auth.getUser();
        if (userError) throw userError;
        userId = userData.user?.id;
        authUser = userData.user ?? null;
      }

      if (!userId) {
        setLoading(false);
        setTimeout(() => navigate("/auth", { replace: true }), 100);
        return;
      }

      if (authUser) {
        setUser(authUser);
      }
      loadProfile(userId);
    } catch (error) {
      const recovered = await recoverFromInvalidRefreshToken(error);
      if (recovered) {
        setLoading(false);
        navigate("/auth", { replace: true });
        return;
      }

      console.warn("[Dashboard] Session check failed:", error);
      if (authRetryCountRef.current < 3) {
        authRetryCountRef.current += 1;
        setTimeout(() => checkAuth(), 2000);
      } else {
        setLoading(false);
        toast.error(
          "Network issue while loading dashboard. Please refresh and try again.",
        );
      }
    }
  };

  const ensureProfileExists = async (userId: string) => {
    const { data: userData } = await supabase.auth.getUser();
    const authUser = userData.user;

    const generatedRefCode = Math.random()
      .toString(36)
      .slice(2, 8)
      .toUpperCase();
    const fullNameFromMeta = (
      authUser?.user_metadata?.fullName ||
      authUser?.user_metadata?.full_name ||
      ""
    )
      .toString()
      .trim();
    const fallbackName =
      fullNameFromMeta || authUser?.email?.split("@")[0] || "User";

    const newProfile = {
      id: userId,
      email: authUser?.email || "",
      full_name: fallbackName,
      referral_code: generatedRefCode,
      balance: 0,
      total_referrals: 0,
    };

    const { error: createError } = await supabase
      .from("profiles")
      .upsert(newProfile as any);
    if (createError) throw createError;

    const { data: createdProfile, error: fetchError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle();

    if (fetchError) throw fetchError;
    if (!createdProfile) throw new Error("Failed to create profile");

    return createdProfile;
  };

  const loadProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      if (error) throw error;
      let currentProfile = data;

      if (!currentProfile) {
        currentProfile = await ensureProfileExists(userId);
      }

      setProfile(currentProfile);

      const { data: claims } = await supabase
        .from("claims")
        .select("*")
        .eq("user_id", userId)
        .order("claimed_at", { ascending: false })
        .limit(1);

      if (claims && claims.length > 0) {
        const lastClaim = new Date(claims[0].claimed_at);
        setLastClaimTime(lastClaim);
        const timeDiff = Date.now() - lastClaim.getTime();
        setCanClaim(timeDiff >= 2 * 60 * 1000);
      } else {
        setCanClaim(true);
      }
    } catch (error: any) {
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const copyReferralCode = () => {
    if (profile?.referral_code) {
      navigator.clipboard.writeText(
        `${window.location.origin}/auth?ref=${profile.referral_code}`,
      );
      toast.success("Referral link copied!");
    }
  };

  const handleClaim = async () => {
    if (!canClaim || claiming) return;

    setClaiming(true);
    try {
      const { error: claimError } = await supabase
        .from("claims")
        .insert({ user_id: user.id, amount: 1000 });

      if (claimError) throw claimError;

      const newBalance = (profile?.balance || 0) + 1000;
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ balance: newBalance })
        .eq("id", user.id);

      if (updateError) throw updateError;

      await supabase.from("transactions").insert({
        user_id: user.id,
        type: "credit",
        amount: 1000,
        description: "Mini claim bonus",
        status: "completed",
      });

      toast.success("₦1,000 claimed successfully!");
      setLastClaimTime(new Date());
      setCanClaim(false);
      await loadProfile(user.id);

      if (dailyRewardIntervalRef.current) {
        clearInterval(dailyRewardIntervalRef.current);
        dailyRewardIntervalRef.current = null;
      }
      if (dailyRewardNotifTimeoutRef.current) {
        clearTimeout(dailyRewardNotifTimeoutRef.current);
      }
      setShowDailyRewardNotif(false);
      hasDailyClaimedRef.current = true;
    } catch (error: any) {
      toast.error("Failed to claim bonus");
    } finally {
      setClaiming(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#06090d] flex items-center justify-center">
        <p className="text-[#94A3B8]">Loading dashboard...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#06090d] flex items-center justify-center p-6">
        <Card className="w-full max-w-md p-6 text-center space-y-3 bg-[#0b1118] border border-[#1e293b]">
          <p className="font-semibold text-white">
            Unable to load your profile
          </p>
          <p className="text-sm text-[#94A3B8]">
            Please login again to continue.
          </p>
          <Button
            onClick={() => navigate("/auth")}
            className="bg-[#00E53A] hover:bg-[#00FF55] text-[#04080a] font-bold shadow-[0_0_20px_rgba(0,229,58,0.5)]"
          >
            Go to Login
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-[#06090d] pb-20"
      style={{ position: "relative", zIndex: 1 }}
    >
      <WelcomeModal />
      <WithdrawalNotification />

      {/* Daily Reward Notification Popup */}
      {showDailyRewardNotif && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-xs sm:max-w-sm mx-auto">
            <Card className="rounded-2xl border-2 border-[#00E53A] bg-[#0b1118] shadow-[0_0_40px_rgba(0,229,58,0.35)] p-0 overflow-hidden text-white">
              <button
                className="absolute top-3 right-3 text-[#94A3B8] hover:text-[#00FF55] text-xl font-bold z-10 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/5"
                onClick={() => setShowDailyRewardNotif(false)}
                aria-label="Close"
              >
                ×
              </button>
              <div className="flex flex-col items-center px-6 pt-7 pb-4">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-[#00E53A]/15 border-2 border-[#00E53A] mb-4 shadow-[0_0_25px_rgba(0,229,58,0.5)]">
                  <RewardsIcon className="w-8 h-8 text-[#00FF55]" />
                </div>
                <h2 className="text-xl font-extrabold text-white mb-2 text-center tracking-tight">
                  Don't Miss Your Daily Reward!
                </h2>
                <p className="text-xs sm:text-sm text-[#CBD5E1] text-center mb-5 leading-relaxed">
                  Claim your{" "}
                  <span className="font-extrabold text-[#00FF55]">
                    daily bonus
                  </span>{" "}
                  now and keep your streak alive. Come back every day to earn
                  even more!
                </p>
                <Button
                  onClick={() => {
                    setShowDailyRewardNotif(false);
                    navigate("/daily-rewards");
                  }}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#00E53A] to-[#00FF66] hover:from-[#00FF55] hover:to-[#00E53A] text-[#04080a] text-sm sm:text-base font-black py-3.5 mb-2 shadow-[0_0_25px_rgba(0,229,58,0.6)] active:scale-[0.98] transition-all"
                >
                  <RewardsIcon className="w-5 h-5" /> Claim Daily Reward
                </Button>
                <button
                  className="w-full text-xs text-[#94A3B8] hover:text-white mt-1 py-1 transition-colors hover:underline"
                  onClick={() => setShowDailyRewardNotif(false)}
                >
                  Remind me later
                </button>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Daily Tasks Popup */}
      <DailyTasksPopup
        open={showDailyTasksPopup}
        onOpenChange={(open) => setShowDailyTasksPopup(open)}
        tasksCompleted={(() => {
          try {
            const TASK_COUNT = 17;
            let completed = 0;
            for (let i = 1; i <= TASK_COUNT; i++) {
              const lastClaim = localStorage.getItem(`task_${i}_claimed`);
              if (!lastClaim) continue;
              if (
                new Date(lastClaim).toDateString() === new Date().toDateString()
              )
                completed++;
            }
            return completed;
          } catch (e) {
            return 0;
          }
        })()}
        totalTasks={17}
      />

      {/* Header */}
      <div
        className="bg-gradient-to-r from-[#00C836] to-[#00E53A] p-4 text-[#04080a] shadow-[0_4px_20px_rgba(0,229,58,0.3)]"
        style={{ pointerEvents: "auto", position: "relative", zIndex: 2 }}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-black/20 backdrop-blur-lg flex items-center justify-center text-lg font-bold border-2 border-[#00FF55] shadow-[0_0_15px_rgba(0,229,58,0.4)]">
            {profile.full_name?.charAt(0) || "U"}
          </div>
          <div>
            <p className="text-xs opacity-80">Hi, {profile.full_name} 👋</p>
            <p className="text-sm font-semibold">Welcome back!</p>
          </div>
        </div>
      </div>

      <div
        className="space-y-4 py-4"
        style={{ position: "relative", zIndex: 2, pointerEvents: "auto" }}
      >
        {/* Balance Card */}
        <div className="px-4">
          <Card className="bg-[#0b1118] backdrop-blur-lg border border-[#00E53A]/25 p-4 shadow-[0_0_20px_rgba(0,229,58,0.1)]">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm text-[#94A3B8]">Your Balance</p>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowBalance(!showBalance)}
                  className="hover:bg-[#0d1620] h-8 w-8 text-[#00FF55]"
                >
                  {showBalance ? (
                    <Eye className="w-4 h-4" />
                  ) : (
                    <EyeOff className="w-4 h-4" />
                  )}
                </Button>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                {showBalance
                  ? `₦${Number(profile.balance || 0).toLocaleString()}.00`
                  : "****"}
              </h2>
              <Button
                onClick={handleClaim}
                disabled={!canClaim || claiming}
                className={`w-full py-3 rounded-xl font-black text-base ${
                  canClaim && !claiming
                    ? "bg-[#080C10] text-[#00FF55] hover:bg-[#0e141b] shadow-[0_4px_25px_rgba(0,229,58,0.4)] cursor-pointer"
                    : "bg-[#080C10]/80 text-[#94A3B8] cursor-not-allowed opacity-90"
                }`}
              >
                {claiming
                  ? "Claiming..."
                  : canClaim
                    ? "Claim ₦1,000"
                    : timeRemaining}
              </Button>
            </div>
          </Card>
        </div>

        {/* Support Telegram Card */}
        <div className="px-4">
          <Card className="bg-[#0b1118] border border-[#00E53A]/30 p-3 shadow-[0_0_12px_rgba(0,229,58,0.1)]">
            <div className="flex items-center justify-between gap-2">
              <div
                className="flex items-center gap-2 flex-1 min-w-0"
                style={{ minHeight: 36 }}
              >
                <div
                  className="flex-shrink-0"
                  style={{ position: "relative", zIndex: 2 }}
                >
                  <Send className="w-4 h-4 text-[#00FF55] mt-0.5" />
                </div>

                <div className="text-xs min-w-0">
                  <p className="font-semibold text-white">Support</p>
                  <p className="text-[#94A3B8] truncate">
                    We're here to help you
                  </p>
                </div>
              </div>

              <Button
                onClick={() => window.open("https://t.me/Renix-Ultra1")}
                className="bg-gradient-to-r from-[#00E53A] to-[#00FF66] hover:from-[#00FF55] hover:to-[#00E53A] text-[#04080a] font-bold text-xs px-3 py-1 h-auto flex-shrink-0 shadow-[0_0_15px_rgba(0,229,58,0.4)]"
              >
                Chat Us
              </Button>
            </div>
          </Card>
        </div>

        {/* View Daily Tasks Link */}
        <div className="px-4">
          <button
            type="button"
            onClick={() => navigate("/tasks")}
            className="w-full flex items-center justify-center gap-2 text-sm text-[#00FF55] hover:text-[#00E53A] py-2"
          >
            View Daily Tasks <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Actions */}
        <div className="px-4">
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => navigate("/referrals")}
              className="h-20 flex flex-col gap-1.5 items-center justify-center rounded-lg border border-[#1e293b] bg-[#0b1118] hover:bg-[#111a24] hover:border-[#00E53A]/50 transition-all active:scale-95 touch-manipulation cursor-pointer min-h-[44px] shadow-[0_0_8px_rgba(0,229,58,0.05)]"
              style={{ WebkitTapHighlightColor: "transparent" }}
            >
              <RewardsIcon className="w-5 h-5 text-[#00FF55]" />
              <span className="text-xs font-semibold text-white">
                Refer & Earn
              </span>
            </button>
            <button
              type="button"
              onClick={() => navigate("/withdraw")}
              className="h-20 flex flex-col gap-1.5 items-center justify-center rounded-lg border border-[#1e293b] bg-[#0b1118] hover:bg-[#111a24] hover:border-[#FFB800]/50 transition-all active:scale-95 touch-manipulation cursor-pointer min-h-[44px] shadow-[0_0_8px_rgba(255,184,0,0.05)]"
              style={{ WebkitTapHighlightColor: "transparent" }}
            >
              <WithdrawIcon className="w-5 h-5 text-[#FFB800]" />
              <span className="text-xs font-semibold text-white">Withdraw</span>
            </button>
            <button
              type="button"
              onClick={() => navigate("/tasks")}
              className="h-20 flex flex-col gap-1.5 items-center justify-center rounded-lg border border-[#1e293b] bg-[#0b1118] hover:bg-[#111a24] hover:border-[#00FF66]/50 transition-all active:scale-95 touch-manipulation cursor-pointer min-h-[44px] shadow-[0_0_8px_rgba(0,255,102,0.05)]"
              style={{ WebkitTapHighlightColor: "transparent" }}
            >
              <TasksIcon className="w-5 h-5 text-[#00FF66]" />
              <span className="text-xs font-semibold text-white">Tasks</span>
            </button>
            <button
              type="button"
              onClick={() => navigate("/loan")}
              className="h-20 flex flex-col gap-1.5 items-center justify-center rounded-lg border border-[#1e293b] bg-[#0b1118] hover:bg-[#111a24] hover:border-[#FFB800]/50 transition-all active:scale-95 touch-manipulation cursor-pointer min-h-[44px] shadow-[0_0_8px_rgba(255,184,0,0.05)]"
              style={{ WebkitTapHighlightColor: "transparent" }}
            >
              <HistoryIcon className="w-5 h-5 text-[#FFB800]" />
              <span className="text-xs font-semibold text-white">Loan</span>
            </button>
            <button
              type="button"
              onClick={() => navigate("/broadcast")}
              className="h-20 flex flex-col gap-1.5 items-center justify-center rounded-lg border border-[#1e293b] bg-[#0b1118] hover:bg-[#111a24] hover:border-[#00E53A]/50 transition-all active:scale-95 touch-manipulation cursor-pointer min-h-[44px] shadow-[0_0_8px_rgba(0,229,58,0.05)]"
              style={{ WebkitTapHighlightColor: "transparent" }}
            >
              <CommunityIcon className="w-5 h-5 text-[#00FF55]" />
              <span className="text-xs font-semibold text-white">Invest</span>
            </button>
            <button
              type="button"
              onClick={() => navigate("/support")}
              className="h-20 flex flex-col gap-1.5 items-center justify-center rounded-lg border border-[#1e293b] bg-[#0b1118] hover:bg-[#111a24] hover:border-[#00F0A0]/50 transition-all active:scale-95 touch-manipulation cursor-pointer min-h-[44px] shadow-[0_0_8px_rgba(0,240,160,0.05)]"
              style={{ WebkitTapHighlightColor: "transparent" }}
            >
              <SupportIcon className="w-5 h-5 text-[#00F0A0]" />
              <span className="text-xs font-semibold text-white">Support</span>
            </button>
          </div>
        </div>

        {/* Referral Card */}
        <div className="px-4">
          <Card className="bg-[#0b1118] backdrop-blur-lg border border-[#182330] p-4 shadow-md">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <RewardsIcon className="w-4 h-4 text-[#00FF55]" />
                <h3 className="text-sm font-semibold text-white">
                  Referral Program
                </h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-[#94A3B8]">Total Referrals</p>
                  <p className="text-xl font-bold text-[#00FF55]">
                    {profile.total_referrals || 0}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[#94A3B8]">
                    Total Referral Earnings
                  </p>
                  <p className="text-xl font-bold text-white">
                    ₦
                    {Number(
                      (profile.total_referrals || 0) * 12000,
                    ).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="bg-[#060a0f] p-3 rounded-lg border border-[#00E53A]/20">
                <p className="text-xs text-[#94A3B8] mb-1.5">
                  Your Referral Link
                </p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 text-[10px] font-bold text-white truncate">
                    {window.location.origin}/auth?ref={profile.referral_code}
                  </code>
                  <Button
                    size="sm"
                    onClick={copyReferralCode}
                    className="bg-gradient-to-r from-[#00E53A] to-[#00FF66] hover:from-[#00FF55] hover:to-[#00E53A] text-[#04080a] flex-shrink-0 h-7 w-7 p-0 shadow-[0_0_12px_rgba(0,229,58,0.4)]"
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Why Renix-Ultra / Testimonials Swipeable Section */}
        <div className="mt-6">
          <div
            className="relative rounded-3xl bg-gradient-to-b from-[#0b141d] to-[#06090d] p-5 sm:p-6 border-2 border-[#00E53A]/40 shadow-[0_0_35px_rgba(0,229,58,0.2)] overflow-hidden cursor-grab active:cursor-grabbing transition-all duration-300"
            onTouchStart={(e) => {
              touchStartRef.current = e.touches[0].clientX;
            }}
            onTouchEnd={(e) => {
              const touchEnd = e.changedTouches[0].clientX;
              const diff = touchStartRef.current - touchEnd;

              if (Math.abs(diff) > 50) {
                if (diff > 0) {
                  setShowTestimonials(true);
                } else {
                  setShowTestimonials(false);
                }
                resetWhySlideshow();
              }
            }}
          >
            {/* Why Renix-Ultra Content */}
            {!showTestimonials && (
              <div className="relative z-10 animate-in fade-in duration-300">
                <div className="absolute top-1/2 right-2 transform -translate-y-1/2 z-20">
                  <button
                    onClick={() => {
                      setShowTestimonials(true);
                      resetWhySlideshow();
                    }}
                    className="w-9 h-9 bg-[#00E53A] hover:bg-[#00FF55] text-[#04080a] rounded-full flex items-center justify-center font-black shadow-[0_0_20px_rgba(0,229,58,0.6)] transition-all active:scale-90"
                    aria-label="View testimonials"
                  >
                    <ChevronRight className="w-5 h-5 stroke-[3]" />
                  </button>
                </div>
                <div className="text-center mb-4 relative z-10">
                  <h2 className="text-2xl font-black text-white tracking-tight">
                    Why Renix-Ultra⁉️
                  </h2>
                  <div className="w-16 h-1 bg-gradient-to-r from-[#00E53A] to-[#00FF66] rounded-full mx-auto mt-2 shadow-[0_0_10px_rgba(0,229,58,0.8)]"></div>
                </div>

                <div className="space-y-3 mb-6 relative z-10">
                  <div className="flex items-start gap-3 bg-[#060a0f]/80 p-3 rounded-2xl border border-white/5">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00E53A] to-[#00C836] flex items-center justify-center flex-shrink-0 text-[#04080a] shadow-[0_0_12px_rgba(0,229,58,0.5)]">
                      <SecurityIcon className="w-5 h-5 stroke-[2.5]" />
                    </div>
                    <div>
                      <h3 className="text-white font-extrabold text-sm mb-0.5">
                        100% Secure
                      </h3>
                      <p className="text-xs text-[#CBD5E1] leading-relaxed">
                        Bank-level encryption protects your transactions and
                        personal data
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 bg-[#060a0f]/80 p-3 rounded-2xl border border-white/5">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00FF66] to-[#00E53A] flex items-center justify-center flex-shrink-0 text-[#04080a] shadow-[0_0_12px_rgba(0,229,58,0.5)]">
                      <CommunityIcon className="w-5 h-5 stroke-[2.5]" />
                    </div>
                    <div>
                      <h3 className="text-white font-extrabold text-sm mb-0.5">
                        Lightning Fast
                      </h3>
                      <p className="text-xs text-[#CBD5E1] leading-relaxed">
                        Instant withdrawals and seamless transactions in seconds
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 bg-[#060a0f]/80 p-3 rounded-2xl border border-white/5">
                    <div className="w-10 h-10 rounded-xl bg-[#00E53A] flex items-center justify-center flex-shrink-0 text-[#04080a] shadow-[0_0_12px_rgba(0,229,58,0.5)]">
                      <Users className="w-5 h-5 stroke-[2.5]" />
                    </div>
                    <div>
                      <h3 className="text-white font-extrabold text-sm mb-0.5">
                        100% Reliable
                      </h3>
                      <p className="text-xs text-[#CBD5E1] leading-relaxed">
                        24/7 support and guaranteed service uptime
                      </p>
                    </div>
                  </div>
                </div>

                <Link to="/referrals">
                  <Button className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#00E53A] to-[#00FF66] hover:from-[#00FF55] hover:to-[#00E53A] text-[#04080a] font-black text-base shadow-[0_0_30px_rgba(0,229,58,0.6)] active:scale-95 transition-all">
                    Invite & Earn Now
                  </Button>
                </Link>
              </div>
            )}

            {/* Testimonials Carousel Content */}
            {showTestimonials && (
              <div className="relative z-10 animate-in fade-in duration-300">
                <div className="absolute top-1/2 left-2 transform -translate-y-1/2 z-20">
                  <button
                    onClick={() => {
                      setShowTestimonials(false);
                      resetWhySlideshow();
                    }}
                    className="w-9 h-9 bg-[#00E53A] hover:bg-[#00FF55] text-[#04080a] rounded-full flex items-center justify-center font-black shadow-[0_0_20px_rgba(0,229,58,0.6)] transition-all active:scale-90"
                    aria-label="Back to Why Renix-Ultra"
                  >
                    <ChevronLeft className="w-5 h-5 stroke-[3]" />
                  </button>
                </div>
                <div className="text-center mb-4 relative z-10">
                  <h2 className="text-xl font-black text-white tracking-tight">
                    Member Success Stories
                  </h2>
                  <div className="w-16 h-1 bg-gradient-to-r from-[#00E53A] to-[#00FF66] rounded-full mx-auto mt-2 shadow-[0_0_10px_rgba(0,229,58,0.8)]"></div>
                </div>

                {/* Testimonial Slide */}
                <div className="relative z-10 bg-[#060a0f] rounded-2xl p-4 mb-4 border border-[#00E53A]/30 shadow-inner">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#00E53A] to-[#00C836] rounded-full flex items-center justify-center flex-shrink-0 shadow-[0_0_15px_rgba(0,229,58,0.5)]">
                      <span className="text-sm font-bold text-[#04080a]">
                        {testimonials[testimonialIndex].name.charAt(0)}
                      </span>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-white font-bold text-sm">
                          {testimonials[testimonialIndex].name}
                        </p>
                        <CheckCircle2 className="w-4 h-4 text-[#00FF55]" />
                      </div>
                      <p className="text-[#94A3B8] text-xs mb-2">
                        📍 {testimonials[testimonialIndex].location}
                      </p>
                      <p className="text-white font-bold italic text-sm mb-2">
                        "{testimonials[testimonialIndex].quote}"
                      </p>
                      <p className="text-[#FFB800] font-bold text-sm">
                        Withdrawn: {testimonials[testimonialIndex].amount}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Carousel Navigation */}
                <div className="flex items-center justify-center gap-4 relative z-10 mb-4">
                  <button
                    onClick={() =>
                      setTestimonialIndex(
                        (prev) =>
                          (prev - 1 + testimonials.length) %
                          testimonials.length,
                      )
                    }
                    className="w-8 h-8 rounded-full bg-[#0e1620] border border-[#00E53A]/40 text-[#00FF55] flex items-center justify-center hover:bg-[#00E53A] hover:text-[#04080a] transition-colors"
                    aria-label="Previous testimonial"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <div className="flex gap-2">
                    {testimonials.map((_, index) => (
                      <div
                        key={index}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          index === testimonialIndex
                            ? "w-6 bg-[#00FF55] shadow-[0_0_8px_rgba(0,229,58,0.8)]"
                            : "w-2 bg-[#1e2a38]"
                        }`}
                      />
                    ))}
                  </div>
                  <button
                    onClick={() =>
                      setTestimonialIndex(
                        (prev) => (prev + 1) % testimonials.length,
                      )
                    }
                    className="w-8 h-8 rounded-full bg-[#0e1620] border border-[#00E53A]/40 text-[#00FF55] flex items-center justify-center hover:bg-[#00E53A] hover:text-[#04080a] transition-colors"
                    aria-label="Next testimonial"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                <Link to="/testimonials" className="block mt-4">
                  <Button className="w-full py-3 rounded-xl bg-gradient-to-r from-[#00E53A] to-[#00FF66] text-[#04080a] font-black text-sm shadow-[0_0_20px_rgba(0,229,58,0.4)] active:scale-95 transition-all">
                    See More Success Stories
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      <FloatingActionButton />

      <AddBalanceModal
        open={showTopUp}
        onOpenChange={setShowTopUp}
        onSuccess={() => {
          if (user) loadProfile(user.id);
        }}
      />

      <WithdrawalMilestoneModal
        open={showMilestoneModal}
        onOpenChange={setShowMilestoneModal}
        onViewDetails={() => {
          setShowMilestoneModal(false);
          navigate("/withdraw");
        }}
        balance={profile?.balance || 0}
      />
    </div>
  );
};

export default Dashboard;

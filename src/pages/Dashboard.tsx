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
      <div className="min-h-screen liquid-bg flex items-center justify-center">
        <p className="text-muted-foreground">Loading dashboard...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen liquid-bg flex items-center justify-center p-6">
        <Card className="w-full max-w-md p-6 text-center space-y-3">
          <p className="font-semibold">Unable to load your profile</p>
          <p className="text-sm text-muted-foreground">
            Please login again to continue.
          </p>
          <Button onClick={() => navigate("/auth")} className="brand-glow-btn">
            Go to Login
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen liquid-bg pb-20"
      style={{ position: "relative", zIndex: 1 }}
    >
      <WelcomeModal />
      <WithdrawalNotification />

      {/* Daily Reward Notification Popup */}
      {showDailyRewardNotif && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 animate-in fade-in">
          <div className="relative w-full max-w-xs sm:max-w-sm mx-auto">
            <Card className="rounded-2xl border border-brand-green/30 bg-[#2a2a2a] shadow-2xl p-0 overflow-hidden brand-glow-card">
              <button
                className="absolute top-3 right-3 text-brand-green hover:text-brand-green-light text-lg font-bold z-10"
                onClick={() => setShowDailyRewardNotif(false)}
                aria-label="Close"
              >
                ×
              </button>
              <div className="flex flex-col items-center px-6 pt-7 pb-2">
                <div className="flex items-center justify-center w-14 h-14 rounded-full bg-[#3a3a3a] border-2 border-brand-green mb-4 brand-glow-icon">
                  <RewardsIcon className="w-8 h-8 text-brand-green" />
                </div>
                <h2 className="text-xl font-bold text-white mb-2 text-center">
                  Don't Miss Your Daily Reward!
                </h2>
                <p className="text-sm text-brand-green-light text-center mb-4">
                  Claim your{" "}
                  <span className="font-bold text-brand-green">
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
                  className="w-full rounded-full bg-gradient-to-r from-brand-green-dark to-brand-green text-black text-base font-bold py-3 mb-2 mt-1 brand-glow-btn hover:from-brand-green hover:to-brand-green-light"
                >
                  <RewardsIcon className="w-5 h-5 mr-2" /> Claim Daily Reward
                </Button>
                <button
                  className="w-full text-xs text-[#9aa08a] mt-1 mb-1 hover:underline"
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
        className="bg-gradient-to-r from-brand-green-dark to-brand-green p-4 text-white glow-brand"
        style={{ pointerEvents: "auto", position: "relative", zIndex: 2 }}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-background/20 backdrop-blur-lg flex items-center justify-center text-lg font-bold brand-glow-avatar">
            {profile.full_name?.charAt(0) || "U"}
          </div>
          <div>
            <p className="text-xs opacity-90">Hi, {profile.full_name} 👋</p>
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
          <Card className="bg-gradient-to-br from-[#2a2a2a] to-[#3a3a3a] backdrop-blur-lg border-brand-green/30 p-4 brand-glow-card animate-fade-in">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm text-[#9aa08a]">Your Balance</p>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowBalance(!showBalance)}
                  className="hover:bg-muted h-8 w-8 text-brand-green"
                >
                  {showBalance ? (
                    <Eye className="w-4 h-4" />
                  ) : (
                    <EyeOff className="w-4 h-4" />
                  )}
                </Button>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold brand-gradient-text">
                {showBalance
                  ? `₦${Number(profile.balance || 0).toLocaleString()}.00`
                  : "****"}
              </h2>
              <Button
                onClick={handleClaim}
                disabled={!canClaim || claiming}
                className="w-full bg-gradient-to-r from-brand-green-dark to-brand-green hover:opacity-90 text-sm py-2 brand-glow-btn"
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
          <Card className="bg-gradient-to-r from-brand-green/10 to-brand-green-dark/10 border-brand-green/20 p-3 brand-glow-card overflow-hidden">
            <div className="flex items-center justify-between gap-2">
              <div
                className="flex items-center gap-2 flex-1 min-w-0"
                style={{ minHeight: 36 }}
              >
                <div
                  className="flex-shrink-0"
                  style={{ position: "relative", zIndex: 2 }}
                >
                  <Send className="w-4 h-4 text-brand-green mt-0.5" />
                </div>

                <div className="text-xs min-w-0">
                  <p className="font-semibold text-foreground">Support</p>
                  <p className="text-[#9aa08a] truncate">
                    We're here to help you
                  </p>
                </div>
              </div>

              <Button
                onClick={() => window.open("https://t.me/Renix-Ultra1")}
                className="bg-gradient-to-r from-brand-green-dark to-brand-green hover:opacity-90 text-xs px-3 py-1 h-auto flex-shrink-0 brand-glow-btn"
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
            className="w-full flex items-center justify-center gap-2 text-sm text-brand-green hover:underline py-2"
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
              className="h-20 flex flex-col gap-1.5 items-center justify-center rounded-lg border bg-[#2a2a2a]/80 hover:bg-[#3a3a3a] border-brand-green/30 transition-all active:scale-95 touch-manipulation cursor-pointer min-h-[44px] brand-glow-action"
              style={{ WebkitTapHighlightColor: "transparent" }}
            >
              <RewardsIcon className="w-5 h-5 text-brand-green" />
              <span className="text-xs font-semibold">Refer & Earn</span>
            </button>
            <button
              type="button"
              onClick={() => navigate("/withdraw")}
              className="h-20 flex flex-col gap-1.5 items-center justify-center rounded-lg border bg-[#2a2a2a]/80 hover:bg-[#3a3a3a] border-brand-green/30 transition-all active:scale-95 touch-manipulation cursor-pointer min-h-[44px] brand-glow-action"
              style={{ WebkitTapHighlightColor: "transparent" }}
            >
              <WithdrawIcon className="w-5 h-5 text-brand-gold" />
              <span className="text-xs font-semibold">Withdraw</span>
            </button>
            <button
              type="button"
              onClick={() => navigate("/tasks")}
              className="h-20 flex flex-col gap-1.5 items-center justify-center rounded-lg border bg-[#2a2a2a]/80 hover:bg-[#3a3a3a] border-brand-green/30 transition-all active:scale-95 touch-manipulation cursor-pointer min-h-[44px] brand-glow-action"
              style={{ WebkitTapHighlightColor: "transparent" }}
            >
              <TasksIcon className="w-5 h-5 text-brand-green-light" />
              <span className="text-xs font-semibold">Tasks</span>
            </button>
            <button
              type="button"
              onClick={() => navigate("/loan")}
              className="h-20 flex flex-col gap-1.5 items-center justify-center rounded-lg border bg-[#2a2a2a]/80 hover:bg-[#3a3a3a] border-brand-green/30 transition-all active:scale-95 touch-manipulation cursor-pointer min-h-[44px] brand-glow-action"
              style={{ WebkitTapHighlightColor: "transparent" }}
            >
              <HistoryIcon className="w-5 h-5 text-brand-gold" />
              <span className="text-xs font-semibold">Loan</span>
            </button>
            <button
              type="button"
              onClick={() => navigate("/broadcast")}
              className="h-20 flex flex-col gap-1.5 items-center justify-center rounded-lg border bg-[#2a2a2a]/80 hover:bg-[#3a3a3a] border-brand-green/30 transition-all active:scale-95 touch-manipulation cursor-pointer min-h-[44px] brand-glow-action"
              style={{ WebkitTapHighlightColor: "transparent" }}
            >
              <CommunityIcon className="w-5 h-5 text-brand-green" />
              <span className="text-xs font-semibold">Invest</span>
            </button>
            <button
              type="button"
              onClick={() => navigate("/support")}
              className="h-20 flex flex-col gap-1.5 items-center justify-center rounded-lg border bg-[#2a2a2a]/80 hover:bg-[#3a3a3a] border-brand-green/30 transition-all active:scale-95 touch-manipulation cursor-pointer min-h-[44px] brand-glow-action"
              style={{ WebkitTapHighlightColor: "transparent" }}
            >
              <SupportIcon className="w-5 h-5 text-brand-gold-light" />
              <span className="text-xs font-semibold">Support</span>
            </button>
          </div>
        </div>

        {/* Referral Card */}
        <div className="px-4">
          <Card className="bg-[#2a2a2a]/80 backdrop-blur-lg border-brand-green/30 p-4 brand-glow-card">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <RewardsIcon className="w-4 h-4 text-brand-green" />
                <h3 className="text-sm font-semibold">Referral Program</h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-[#9aa08a]">Total Referrals</p>
                  <p className="text-xl font-bold text-brand-green">
                    {profile.total_referrals || 0}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[#9aa08a]">
                    Total Referral Earnings
                  </p>
                  <p className="text-xl font-bold brand-gradient-text">
                    ₦
                    {Number(
                      (profile.total_referrals || 0) * 12000,
                    ).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="bg-[#3a3a3a] p-3 rounded-lg brand-glow-inner">
                <p className="text-xs text-[#9aa08a] mb-1.5">
                  Your Referral Link
                </p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 text-[10px] font-bold text-foreground truncate">
                    {window.location.origin}/auth?ref={profile.referral_code}
                  </code>
                  <Button
                    size="sm"
                    onClick={copyReferralCode}
                    className="bg-gradient-to-r from-brand-green-dark to-brand-green hover:opacity-90 flex-shrink-0 h-7 w-7 p-0 brand-glow-btn"
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
            className="why-glow bg-gradient-to-br from-[#1a1a1a] via-brand-green-dark/30 to-[#1a1a1a] rounded-2xl p-6 mb-6 mx-2 border border-brand-green/40 relative overflow-hidden cursor-grab active:cursor-grabbing transition-all duration-300 brand-glow-section"
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
              <div className="animate-fadeIn">
                <div className="absolute top-1/2 right-2 transform -translate-y-1/2 z-20">
                  <button
                    onClick={() => {
                      setShowTestimonials(true);
                      resetWhySlideshow();
                    }}
                    className="bg-brand-green hover:bg-brand-green-light text-black rounded-full p-2 border border-brand-green/80 transition-all duration-200 active:scale-90 glow-arrow brand-arrow-pulse"
                    aria-label="View testimonials"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </div>
                <div className="text-center mb-4 relative z-10">
                  <h2 className="text-2xl font-bold text-white mb-2 animate-slide-up">
                    Why Renix-Ultra⁉️
                  </h2>
                  <div className="w-16 h-1 bg-gradient-to-r from-brand-green via-brand-green-light to-brand-green-dark mx-auto mb-4 shadow-lg shadow-brand-green/50 animate-slide-up-delay"></div>
                </div>

                <div className="space-y-3 mb-6 relative z-10">
                  <div className="flex items-start gap-3 animate-slide-up-delay2">
                    <div className="w-10 h-10 bg-gradient-to-br from-brand-green to-brand-green-dark rounded-full flex items-center justify-center flex-shrink-0 shadow-lg shadow-brand-green/40 brand-glow-icon">
                      <SecurityIcon className="w-5 h-5 text-black" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold mb-1">
                        100% Secure
                      </h3>
                      <p className="text-brand-green-light text-sm">
                        Bank-level encryption protects your transactions and
                        personal data
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 animate-slide-up-delay3">
                    <div className="w-10 h-10 bg-gradient-to-br from-brand-green-light to-brand-green rounded-full flex items-center justify-center flex-shrink-0 shadow-lg shadow-brand-green/40 brand-glow-icon">
                      <CommunityIcon className="w-5 h-5 text-black" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold mb-1">
                        Lightning Fast
                      </h3>
                      <p className="text-brand-green-light text-sm">
                        Instant withdrawals and seamless transactions in seconds
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 animate-slide-up-delay4">
                    <div className="w-10 h-10 bg-brand-green rounded-full flex items-center justify-center flex-shrink-0">
                      <Users className="w-5 h-5 text-black" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold mb-1">
                        100% Reliable
                      </h3>
                      <p className="text-brand-green-light text-sm">
                        24/7 support and guaranteed service uptime
                      </p>
                    </div>
                  </div>
                </div>

                <Link to="/referrals">
                  <Button className="w-full bg-gradient-to-r from-brand-green to-brand-green-light hover:from-brand-green-dark hover:to-brand-green text-black font-bold py-3 rounded-full text-lg shadow-[0_0_30px_rgba(140,200,0,0.45)] hover:shadow-[0_0_40px_rgba(140,200,0,0.65)] glow-cta brand-glow-btn">
                    Invite & Earn Now
                  </Button>
                </Link>
              </div>
            )}

            {/* Testimonials Carousel Content */}
            {showTestimonials && (
              <div className="animate-fadeIn">
                <div className="absolute top-1/2 left-2 transform -translate-y-1/2 z-20">
                  <button
                    onClick={() => {
                      setShowTestimonials(false);
                      resetWhySlideshow();
                    }}
                    className="bg-brand-green hover:bg-brand-green-light text-black rounded-full p-2 border border-brand-green/80 transition-all duration-200 active:scale-90 glow-arrow brand-arrow-pulse"
                    aria-label="Back to Why Renix-Ultra"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                </div>
                <div className="text-center mb-4 relative z-10">
                  <h2 className="text-2xl font-bold text-white mb-2">
                    Member Success Stories
                  </h2>
                  <div className="w-16 h-1 bg-gradient-to-r from-brand-green via-brand-green-light to-brand-green-dark mx-auto mb-4 shadow-lg shadow-brand-green/50"></div>
                </div>

                {/* Testimonial Slide */}
                <div className="relative z-10 bg-gradient-to-r from-brand-green/20 to-brand-green-dark/10 rounded-xl p-4 mb-4 border border-brand-green/30 brand-glow-inner">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-brand-green to-brand-green-dark rounded-full flex items-center justify-center flex-shrink-0 shadow-lg shadow-brand-green/40 brand-glow-icon">
                      <span className="text-sm font-bold text-black">
                        {testimonials[testimonialIndex].name.charAt(0)}
                      </span>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-white font-bold text-sm">
                          {testimonials[testimonialIndex].name}
                        </p>
                        <CheckCircle2 className="w-4 h-4 text-brand-green" />
                      </div>
                      <p className="text-brand-green-light text-xs mb-2">
                        📍 {testimonials[testimonialIndex].location}
                      </p>
                      <p className="text-brand-green font-bold italic text-sm mb-2">
                        "{testimonials[testimonialIndex].quote}"
                      </p>
                      <p className="text-brand-gold-light font-bold text-sm">
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
                    className="bg-brand-green/50 hover:bg-brand-green text-brand-green-light hover:text-black rounded-full p-2 shadow-[0_0_25px_rgba(140,200,0,0.45)] hover:shadow-[0_0_35px_rgba(140,200,0,0.6)] transition-all duration-200 active:scale-90 glow-arrow brand-arrow-pulse"
                    aria-label="Previous testimonial"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <div className="flex gap-2">
                    {testimonials.map((_, index) => (
                      <div
                        key={index}
                        className={`h-2 rounded-full transition-all duration-300 ${
                          index === testimonialIndex
                            ? "w-6 bg-brand-green shadow-lg shadow-brand-green/50"
                            : "w-2 bg-brand-green/30"
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
                    className="bg-brand-green/50 hover:bg-brand-green text-brand-green-light hover:text-black rounded-full p-2 shadow-[0_0_25px_rgba(140,200,0,0.45)] hover:shadow-[0_0_35px_rgba(140,200,0,0.6)] transition-all duration-200 active:scale-90 glow-arrow brand-arrow-pulse"
                    aria-label="Next testimonial"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>

                <Link to="/testimonials" className="block mt-4">
                  <Button className="w-full bg-gradient-to-r from-brand-green to-brand-green-light hover:from-brand-green-dark hover:to-brand-green text-black font-bold py-3 rounded-full text-lg shadow-[0_0_30px_rgba(140,200,0,0.45)] hover:shadow-[0_0_40px_rgba(140,200,0,0.65)] glow-cta brand-glow-btn">
                    See More Success Stories
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Custom Styles */}
        <style>{`
          /* ── Brand Colors (from extracted palette, with lighter backgrounds) ── */
          :root {
            --brand-green-dark: #3c7800;
            --brand-green-mid: #6ca800;
            --brand-green: #8cc800;
            --brand-green-light: #aadc00;
            --brand-green-flash: #dcf032;
            --brand-gold-dark: #785400;
            --brand-gold: #906c00;
            --brand-gold-light: #b4e400;
            --brand-highlight: #fafac8;
            --brand-metal: #d2d2d2;
            --brand-text-muted: #9aa08a;
          }

          /* ── Lighter background overrides ── */
          .liquid-bg {
            background-color: #1a1a1a !important;
          }

          @keyframes bounce-slow {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-6px); }
          }
          .animate-bounce-slow { animation: bounce-slow 3s ease-in-out infinite; }

          @keyframes glow-swipe {
            0% { opacity: 0.7; transform: translateX(-10%); filter: blur(10px); }
            50% { opacity: 1; transform: translateX(10%); filter: blur(18px); }
            100% { opacity: 0.7; transform: translateX(-10%); filter: blur(10px); }
          }

          @keyframes shimmer {
            0% { left: -120%; }
            50% { left: 120%; }
            100% { left: -120%; }
          }

          /* ── Glow System (brand green) ── */
          @keyframes brand-pulse {
            0%, 100% { box-shadow: 0 0 8px 2px rgba(140,200,0,0.45), 0 0 20px 4px rgba(140,200,0,0.2); }
            50% { box-shadow: 0 0 16px 4px rgba(140,200,0,0.7), 0 0 36px 8px rgba(140,200,0,0.35); }
          }

          @keyframes brand-border-pulse {
            0%, 100% { box-shadow: 0 0 6px 1px rgba(140,200,0,0.2), inset 0 0 6px 0px rgba(140,200,0,0.05); }
            50% { box-shadow: 0 0 14px 3px rgba(140,200,0,0.38), inset 0 0 10px 1px rgba(140,200,0,0.08); }
          }

          .brand-glow-btn {
            box-shadow: 0 0 10px 2px rgba(140,200,0,0.5), 0 0 24px 4px rgba(140,200,0,0.25);
            animation: brand-pulse 2.5s ease-in-out infinite;
          }
          .brand-glow-btn:hover { box-shadow: 0 0 18px 4px rgba(140,200,0,0.75), 0 0 40px 8px rgba(140,200,0,0.4); }
          .brand-glow-btn:disabled { box-shadow: 0 0 5px 1px rgba(140,200,0,0.2); animation: none; }

          .brand-glow-card {
            box-shadow: 0 0 0 1px rgba(140,200,0,0.15), 0 0 12px 2px rgba(140,200,0,0.15);
            animation: brand-border-pulse 3s ease-in-out infinite;
          }
          .brand-glow-action {
            box-shadow: 0 0 8px 1px rgba(140,200,0,0.18);
            animation: brand-border-pulse 3s ease-in-out infinite;
            transition: box-shadow 0.2s ease;
          }
          .brand-glow-action:hover { box-shadow: 0 0 16px 3px rgba(140,200,0,0.4); }
          .brand-glow-section {
            box-shadow: 0 0 20px 4px rgba(140,200,0,0.22), 0 0 50px 10px rgba(140,200,0,0.1);
            animation: brand-border-pulse 3.5s ease-in-out infinite;
          }
          .brand-glow-icon {
            box-shadow: 0 0 12px 3px rgba(140,200,0,0.45);
            animation: brand-pulse 2.5s ease-in-out infinite;
          }
          .brand-glow-avatar {
            box-shadow: 0 0 10px 2px rgba(140,200,0,0.4);
            animation: brand-pulse 3s ease-in-out infinite;
          }
          .brand-glow-inner {
            box-shadow: 0 0 8px 1px rgba(140,200,0,0.2);
            animation: brand-border-pulse 3s ease-in-out infinite;
          }

          /* ── Glowing Arrow Pulse (brand green) ── */
          @keyframes arrowGlow {
            0%, 100% {
              box-shadow: 0 0 8px 2px rgba(140,200,0,0.6),
                          0 0 20px 6px rgba(140,200,0,0.3),
                          0 0 40px 10px rgba(140,200,0,0.12);
              background-color: #8cc800;
            }
            50% {
              box-shadow: 0 0 18px 5px rgba(140,200,0,0.95),
                          0 0 40px 12px rgba(140,200,0,0.55),
                          0 0 70px 18px rgba(140,200,0,0.22);
              background-color: #aadc00;
            }
          }
          .brand-arrow-pulse {
            animation: arrowGlow 1.6s ease-in-out infinite !important;
          }

          /* ── Why section glow and shimmer ── */
          .why-glow {
            position: relative;
            overflow: hidden;
          }
          .why-glow::before {
            content: "";
            position: absolute;
            top: -25%; left: -25%;
            width: 150%; height: 150%;
            background: radial-gradient(circle at 20% 20%, rgba(140,200,0,0.10), transparent 8%),
                        radial-gradient(circle at 80% 80%, rgba(96,165,250,0.05), transparent 10%);
            filter: blur(22px);
            transform: translate3d(0,0,0);
            animation: glow-swipe 6s linear infinite;
            pointer-events: none;
          }
          .why-glow::after {
            content: "";
            position: absolute;
            top: -10%; left: -120%;
            width: 60%; height: 120%;
            background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0) 100%);
            transform: skewX(-20deg);
            filter: blur(6px);
            animation: shimmer 3.5s ease-in-out infinite;
            pointer-events: none;
          }
          .why-glow > * { position: relative; z-index: 1; }

          @keyframes slide-up {
            from { transform: translateY(200px); opacity: 0; }
            to   { transform: translateY(0); opacity: 1; }
          }
          .animate-slide-up          { animation: slide-up 1s ease-out; }
          .animate-slide-up-delay    { animation: slide-up 1s ease-out 0.3s both; }
          .animate-slide-up-delay2   { animation: slide-up 1s ease-out 0.6s both; }
          .animate-slide-up-delay3   { animation: slide-up 1s ease-out 0.9s both; }
          .animate-slide-up-delay4   { animation: slide-up 1s ease-out 1.2s both; }

          @keyframes fadeIn {
            from { opacity: 0; }
            to   { opacity: 1; }
          }
          .animate-fadeIn { animation: fadeIn 0.3s ease-in-out; }

          .glow-cta { box-shadow: 0 0 28px rgba(140,200,0,0.35); }
          .glow-cta:hover { box-shadow: 0 0 40px rgba(140,200,0,0.55); }

          .glow-arrow { box-shadow: 0 0 26px rgba(140,200,0,0.55); }
          .glow-arrow:hover { box-shadow: 0 0 36px rgba(140,200,0,0.75); }

          /* ── Gradient Text ── */
          .brand-gradient-text {
            background: linear-gradient(180deg, var(--brand-highlight), var(--brand-green-light) 40%, var(--brand-green) 70%, var(--brand-green-dark));
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
          }

          /* ── Utility classes for Tailwind custom colors ── */
          .text-brand-green { color: var(--brand-green); }
          .text-brand-green-light { color: var(--brand-green-light); }
          .text-brand-gold { color: var(--brand-gold); }
          .text-brand-gold-light { color: var(--brand-gold-light); }
          .border-brand-green { border-color: var(--brand-green); }
          .border-brand-green\/30 { border-color: rgba(140,200,0,0.3); }
          .border-brand-green\/40 { border-color: rgba(140,200,0,0.4); }
          .border-brand-green\/80 { border-color: rgba(140,200,0,0.8); }
          .bg-brand-green-dark { background-color: var(--brand-green-dark); }
          .bg-brand-green { background-color: var(--brand-green); }
          .bg-brand-green\/10 { background-color: rgba(140,200,0,0.1); }
          .bg-brand-green\/20 { background-color: rgba(140,200,0,0.2); }
          .bg-brand-green\/50 { background-color: rgba(140,200,0,0.5); }
          .from-brand-green-dark { --tw-gradient-from: var(--brand-green-dark); }
          .to-brand-green { --tw-gradient-to: var(--brand-green); }
          .via-brand-green-dark\/30 { --tw-gradient-via: rgba(60,120,0,0.3); }
          .shadow-brand-green\/50 { box-shadow: 0 0 15px rgba(140,200,0,0.5); }
          .shadow-brand-green\/40 { box-shadow: 0 0 15px rgba(140,200,0,0.4); }
          .glow-brand { box-shadow: 0 4px 20px rgba(140,200,0,0.3); }
        `}</style>
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

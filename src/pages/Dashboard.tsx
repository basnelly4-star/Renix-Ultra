import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Eye,
  EyeOff,
  Copy,
  Gift,
  Banknote,
  CheckCircle2,
  History,
  Disc3,
  Radio,
  Shield,
  TrendingUp,
  Users,
  Home,
  Gamepad2,
  User,
  Send,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import {
  recoverFromInvalidRefreshToken,
  supabase,
} from "@/integrations/supabase/client";
import { FloatingActionButton } from "@/components/FloatingActionButton";
import { ArrowRight } from "lucide-react";
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
  // NEW: ref for the auto-slide interval
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
        "I was skeptical but earned my first withdrawal successfully. Earnix9ja is legit!",
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

    // DAILY TASKS POPUP: show once per day if tasks incomplete
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
      for (let i = 1; i <= TASK_COUNT; i++) if (isTaskClaimedToday(i)) completed++;

      const popupKey = `dailyTasksPopupShown_${profile.id}`;
      const shownDate = localStorage.getItem(popupKey);
      const todayKey = new Date().toDateString();

      // If user completed all tasks today, mark popup as shown for today (don't show again)
      if (completed >= TASK_COUNT) {
        localStorage.setItem(popupKey, todayKey);
        setShowDailyTasksPopup(false);
      } else {
        // show popup only if not shown today
        if (shownDate !== todayKey) {
          setShowDailyTasksPopup(true);
          localStorage.setItem(popupKey, todayKey);
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

  // ── NEW: Why Earnix9ja auto-slideshow every 5 seconds ──────────────────────
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

  // Helper: reset the auto-slideshow timer when user manually clicks an arrow
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
          <Button onClick={() => navigate("/auth")} className="gold-glow-btn">
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
            <Card className="rounded-2xl border border-[#EAB308]/30 bg-[#101112] shadow-2xl p-0 overflow-hidden gold-glow-card">
              <button
                className="absolute top-3 right-3 text-[#EAB308] hover:text-[#fbbf24] text-lg font-bold z-10"
                onClick={() => setShowDailyRewardNotif(false)}
                aria-label="Close"
              >
                ×
              </button>
              <div className="flex flex-col items-center px-6 pt-7 pb-2">
                <div className="flex items-center justify-center w-14 h-14 rounded-full bg-[#181200] border-2 border-[#EAB308] mb-4 gold-glow-icon">
                  <Gift className="w-8 h-8 text-[#EAB308]" />
                </div>
                <h2 className="text-xl font-bold text-white mb-2 text-center">
                  Don't Miss Your Daily Reward!
                </h2>
                <p className="text-sm text-[#e7c95c] text-center mb-4">
                  Claim your{" "}
                  <span className="font-bold text-[#EAB308]">daily bonus</span>{" "}
                  now and keep your streak alive. Come back every day to earn
                  even more!
                </p>
                <Button
                  onClick={() => {
                    setShowDailyRewardNotif(false);
                    navigate("/daily-rewards");
                  }}
                  className="w-full rounded-full bg-gradient-to-r from-[#EAB308] to-[#FBBF24] text-black text-base font-bold py-3 mb-2 mt-1 gold-glow-btn hover:from-[#fbbf24] hover:to-[#EAB308]"
                >
                  <Gift className="w-5 h-5 mr-2" /> Claim Daily Reward
                </Button>
                <button
                  className="w-full text-xs text-[#b0b0b0] mt-1 mb-1 hover:underline"
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
              if (new Date(lastClaim).toDateString() === new Date().toDateString()) completed++;
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
        className="bg-gradient-to-r from-primary to-secondary p-4 text-primary-foreground glow-primary"
        style={{ pointerEvents: "auto", position: "relative", zIndex: 2 }}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-background/20 backdrop-blur-lg flex items-center justify-center text-lg font-bold gold-glow-avatar">
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
          <Card className="bg-gradient-to-br from-card to-card/80 backdrop-blur-lg border-border/50 p-4 gold-glow-card animate-fade-in">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Your Balance</p>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowBalance(!showBalance)}
                  className="hover:bg-muted h-8 w-8"
                >
                  {showBalance ? (
                    <Eye className="w-4 h-4" />
                  ) : (
                    <EyeOff className="w-4 h-4" />
                  )}
                </Button>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold gradient-text">
                {showBalance
                  ? `₦${Number(profile.balance || 0).toLocaleString()}.00`
                  : "****"}
              </h2>
              <Button
                onClick={handleClaim}
                disabled={!canClaim || claiming}
                className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-sm py-2 gold-glow-btn"
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

        {/* ── Support Telegram Card ── */}
        <div className="px-4">
          <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20 p-3 gold-glow-card overflow-hidden">
                <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 flex-1 min-w-0" style={{ minHeight: 36 }}>
                <div className="flex-shrink-0" style={{ position: "relative", zIndex: 2 }}>
                  <Send className="w-4 h-4 text-secondary mt-0.5" />
                </div>

                <div className="text-xs min-w-0">
                  <p className="font-semibold text-foreground">Support</p>
                  <p className="text-muted-foreground truncate">
                    We're here to help you
                  </p>
                </div>
              </div>

              <Button
                onClick={() => window.open("https://t.me/earnix9jachannel")}
                className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-xs px-3 py-1 h-auto flex-shrink-0 gold-glow-btn"
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
            className="w-full flex items-center justify-center gap-2 text-sm text-primary hover:underline py-2"
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
              className="h-20 flex flex-col gap-1.5 items-center justify-center rounded-lg border bg-card/80 hover:bg-card border-border/50 transition-all active:scale-95 touch-manipulation cursor-pointer min-h-[44px] gold-glow-action"
              style={{ WebkitTapHighlightColor: "transparent" }}
            >
              <Gift className="w-5 h-5 text-primary" />
              <span className="text-xs font-semibold">Refer & Earn</span>
            </button>
            <button
              type="button"
              onClick={() => navigate("/withdraw")}
              className="h-20 flex flex-col gap-1.5 items-center justify-center rounded-lg border bg-card/80 hover:bg-card border-border/50 transition-all active:scale-95 touch-manipulation cursor-pointer min-h-[44px] gold-glow-action"
              style={{ WebkitTapHighlightColor: "transparent" }}
            >
              <Banknote className="w-5 h-5 text-secondary" />
              <span className="text-xs font-semibold">Withdraw</span>
            </button>
            <button
              type="button"
              onClick={() => navigate("/tasks")}
              className="h-20 flex flex-col gap-1.5 items-center justify-center rounded-lg border bg-card/80 hover:bg-card border-border/50 transition-all active:scale-95 touch-manipulation cursor-pointer min-h-[44px] gold-glow-action"
              style={{ WebkitTapHighlightColor: "transparent" }}
            >
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              <span className="text-xs font-semibold">Tasks</span>
            </button>
            <button
              type="button"
              onClick={() => navigate("/loan")}
              className="h-20 flex flex-col gap-1.5 items-center justify-center rounded-lg border bg-card/80 hover:bg-card border-border/50 transition-all active:scale-95 touch-manipulation cursor-pointer min-h-[44px] gold-glow-action"
              style={{ WebkitTapHighlightColor: "transparent" }}
            >
              <History className="w-5 h-5 text-blue-500" />
              <span className="text-xs font-semibold">Loan</span>
            </button>
            <button
              type="button"
              onClick={() => navigate("/broadcast")}
              className="h-20 flex flex-col gap-1.5 items-center justify-center rounded-lg border bg-card/80 hover:bg-card border-border/50 transition-all active:scale-95 touch-manipulation cursor-pointer min-h-[44px] gold-glow-action"
              style={{ WebkitTapHighlightColor: "transparent" }}
            >
              <TrendingUp className="w-5 h-5 text-accent" />
              <span className="text-xs font-semibold">Invest</span>
            </button>
            <button
              type="button"
              onClick={() => navigate("/support")}
              className="h-20 flex flex-col gap-1.5 items-center justify-center rounded-lg border bg-card/80 hover:bg-card border-border/50 transition-all active:scale-95 touch-manipulation cursor-pointer min-h-[44px] gold-glow-action"
              style={{ WebkitTapHighlightColor: "transparent" }}
            >
              <HelpCircle className="w-5 h-5 text-[#EAB308]" />
              <span className="text-xs font-semibold">Support</span>
            </button>
          </div>
        </div>

        {/* Referral Card */}
        <div className="px-4">
          <Card className="bg-card/80 backdrop-blur-lg border-border/50 p-4 gold-glow-card">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Gift className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-semibold">Referral Program</h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-muted-foreground">
                    Total Referrals
                  </p>
                  <p className="text-xl font-bold text-primary">
                    {profile.total_referrals || 0}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">
                    Total Referral Earnings
                  </p>
                  <p className="text-xl font-bold gradient-text">
                    ₦
                    {Number(
                      (profile.total_referrals || 0) * 12000,
                    ).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="bg-muted/50 p-3 rounded-lg gold-glow-inner">
                <p className="text-xs text-muted-foreground mb-1.5">
                  Your Referral Link
                </p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 text-[10px] font-bold text-foreground truncate">
                    {window.location.origin}/auth?ref={profile.referral_code}
                  </code>
                  <Button
                    size="sm"
                    onClick={copyReferralCode}
                    className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 flex-shrink-0 h-7 w-7 p-0 gold-glow-btn"
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Why Earnix9ja / Testimonials Swipeable Section */}
        <div className="mt-6">
          <div
            className="why-glow bg-gradient-to-br from-black via-amber-950 to-black rounded-2xl p-6 mb-6 mx-2 border border-yellow-600/40 relative overflow-hidden cursor-grab active:cursor-grabbing transition-all duration-300 gold-glow-section"
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
            {/* Why Earnix9ja Content */}
            {!showTestimonials && (
              <div className="animate-fadeIn">
                <div className="absolute top-1/2 right-2 transform -translate-y-1/2 z-20">
                  {/* ── UPDATED: glow-arrow-pulse class for glowing chevron ── */}
                  <button
                    onClick={() => {
                      setShowTestimonials(true);
                      resetWhySlideshow();
                    }}
                    className="bg-yellow-500 hover:bg-yellow-400 text-black rounded-full p-2 border border-yellow-300/80 transition-all duration-200 active:scale-90 glow-arrow glow-arrow-pulse"
                    aria-label="View testimonials"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </div>
                <div className="text-center mb-4 relative z-10">
                  <h2 className="text-2xl font-bold text-white mb-2 animate-slide-up">
                    Why Earnix9ja⁉️
                  </h2>
                  <div className="w-16 h-1 bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-600 mx-auto mb-4 shadow-lg shadow-yellow-500/50 animate-slide-up-delay"></div>
                </div>

                <div className="space-y-3 mb-6 relative z-10">
                  <div className="flex items-start gap-3 animate-slide-up-delay2">
                    <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-yellow-700 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg shadow-yellow-500/40 gold-glow-icon">
                      <Shield className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold mb-1">
                        100% Secure
                      </h3>
                      <p className="text-yellow-100 text-sm">
                        Bank-level encryption protects your transactions and
                        personal data
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 animate-slide-up-delay3">
                    <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg shadow-yellow-500/40 gold-glow-icon">
                      <TrendingUp className="w-5 h-5 text-black" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold mb-1">
                        Lightning Fast
                      </h3>
                      <p className="text-yellow-100 text-sm">
                        Instant withdrawals and seamless transactions in seconds
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 animate-slide-up-delay4">
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <Users className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold mb-1">
                        100% Reliable
                      </h3>
                      <p className="text-green-200 text-sm">
                        24/7 support and guaranteed service uptime
                      </p>
                    </div>
                  </div>
                </div>

                <Link to="/referrals">
                  <Button className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black font-bold py-3 rounded-full text-lg shadow-[0_0_30px_rgba(234,179,8,0.45)] hover:shadow-[0_0_40px_rgba(234,179,8,0.65)] glow-cta gold-glow-btn">
                    Invite & Earn Now
                  </Button>
                </Link>
              </div>
            )}

            {/* Testimonials Carousel Content */}
            {showTestimonials && (
              <div className="animate-fadeIn">
                <div className="absolute top-1/2 left-2 transform -translate-y-1/2 z-20">
                  {/* ── UPDATED: glow-arrow-pulse class for glowing chevron ── */}
                  <button
                    onClick={() => {
                      setShowTestimonials(false);
                      resetWhySlideshow();
                    }}
                    className="bg-yellow-500 hover:bg-yellow-400 text-black rounded-full p-2 border border-yellow-300/80 transition-all duration-200 active:scale-90 glow-arrow glow-arrow-pulse"
                    aria-label="Back to Why Earnix9ja"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                </div>
                <div className="text-center mb-4 relative z-10">
                  <h2 className="text-2xl font-bold text-white mb-2">
                    Member Success Stories
                  </h2>
                  <div className="w-16 h-1 bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-600 mx-auto mb-4 shadow-lg shadow-yellow-500/50"></div>
                </div>

                {/* Testimonial Slide */}
                <div className="relative z-10 bg-gradient-to-r from-yellow-900/20 to-yellow-800/10 rounded-xl p-4 mb-4 border border-yellow-600/30 gold-glow-inner">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg shadow-yellow-500/40 gold-glow-icon">
                      <span className="text-sm font-bold text-black">
                        {testimonials[testimonialIndex].name.charAt(0)}
                      </span>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-white font-bold text-sm">
                          {testimonials[testimonialIndex].name}
                        </p>
                        <CheckCircle2 className="w-4 h-4 text-yellow-400" />
                      </div>
                      <p className="text-yellow-100 text-xs mb-2">
                        📍 {testimonials[testimonialIndex].location}
                      </p>
                      <p className="text-yellow-300 font-bold italic text-sm mb-2">
                        "{testimonials[testimonialIndex].quote}"
                      </p>
                      <p className="text-yellow-400 font-bold text-sm">
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
                    className="bg-yellow-600/50 hover:bg-yellow-500 text-yellow-300 hover:text-white rounded-full p-2 shadow-[0_0_25px_rgba(234,179,8,0.45)] hover:shadow-[0_0_35px_rgba(234,179,8,0.6)] transition-all duration-200 active:scale-90 glow-arrow glow-arrow-pulse"
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
                            ? "w-6 bg-yellow-400 shadow-lg shadow-yellow-500/50"
                            : "w-2 bg-yellow-700/50"
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
                    className="bg-yellow-600/50 hover:bg-yellow-500 text-yellow-300 hover:text-white rounded-full p-2 shadow-[0_0_25px_rgba(234,179,8,0.45)] hover:shadow-[0_0_35px_rgba(234,179,8,0.6)] transition-all duration-200 active:scale-90 glow-arrow glow-arrow-pulse"
                    aria-label="Next testimonial"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>

                <Link to="/testimonials" className="block mt-4">
                  <Button className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black font-bold py-3 rounded-full text-lg shadow-[0_0_30px_rgba(234,179,8,0.45)] hover:shadow-[0_0_40px_rgba(234,179,8,0.65)] glow-cta gold-glow-btn">
                    See More Success Stories
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Custom Styles */}
        <style>{`
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

          /* ========== GOLD GLOW SYSTEM ========== */
          @keyframes gold-pulse {
            0%, 100% { box-shadow: 0 0 8px 2px rgba(234,179,8,0.45), 0 0 20px 4px rgba(234,179,8,0.2); }
            50% { box-shadow: 0 0 16px 4px rgba(234,179,8,0.7), 0 0 36px 8px rgba(234,179,8,0.35); }
          }

          @keyframes gold-border-pulse {
            0%, 100% { box-shadow: 0 0 6px 1px rgba(234,179,8,0.2), inset 0 0 6px 0px rgba(234,179,8,0.05); }
            50% { box-shadow: 0 0 14px 3px rgba(234,179,8,0.38), inset 0 0 10px 1px rgba(234,179,8,0.08); }
          }

          .gold-glow-btn {
            box-shadow: 0 0 10px 2px rgba(234,179,8,0.5), 0 0 24px 4px rgba(234,179,8,0.25);
            animation: gold-pulse 2.5s ease-in-out infinite;
          }
          .gold-glow-btn:hover { box-shadow: 0 0 18px 4px rgba(234,179,8,0.75), 0 0 40px 8px rgba(234,179,8,0.4); }
          .gold-glow-btn:disabled { box-shadow: 0 0 5px 1px rgba(234,179,8,0.2); animation: none; }

          .gold-glow-card {
            box-shadow: 0 0 0 1px rgba(234,179,8,0.15), 0 0 12px 2px rgba(234,179,8,0.15);
            animation: gold-border-pulse 3s ease-in-out infinite;
          }
          .gold-glow-action {
            box-shadow: 0 0 8px 1px rgba(234,179,8,0.18);
            animation: gold-border-pulse 3s ease-in-out infinite;
            transition: box-shadow 0.2s ease;
          }
          .gold-glow-action:hover { box-shadow: 0 0 16px 3px rgba(234,179,8,0.4); }
          .gold-glow-section {
            box-shadow: 0 0 20px 4px rgba(234,179,8,0.22), 0 0 50px 10px rgba(234,179,8,0.1);
            animation: gold-border-pulse 3.5s ease-in-out infinite;
          }
          .gold-glow-icon {
            box-shadow: 0 0 12px 3px rgba(234,179,8,0.45);
            animation: gold-pulse 2.5s ease-in-out infinite;
          }
          .gold-glow-avatar {
            box-shadow: 0 0 10px 2px rgba(234,179,8,0.4);
            animation: gold-pulse 3s ease-in-out infinite;
          }
          .gold-glow-inner {
            box-shadow: 0 0 8px 1px rgba(234,179,8,0.2);
            animation: gold-border-pulse 3s ease-in-out infinite;
          }

          /* ── 1. GLOWING ARROW PULSE ─────────────────────────────────────── */
          @keyframes arrowGlow {
            0%, 100% {
              box-shadow: 0 0 8px 2px rgba(234,179,8,0.6),
                          0 0 20px 6px rgba(234,179,8,0.3),
                          0 0 40px 10px rgba(234,179,8,0.12);
              background-color: #EAB308;
            }
            50% {
              box-shadow: 0 0 18px 5px rgba(234,179,8,0.95),
                          0 0 40px 12px rgba(234,179,8,0.55),
                          0 0 70px 18px rgba(234,179,8,0.22);
              background-color: #fde047;
            }
          }
          .glow-arrow-pulse {
            animation: arrowGlow 1.6s ease-in-out infinite !important;
          }

          /* ── (existing styles kept below, unchanged) ─────────────────────── */
          .why-glow {
            position: relative;
            overflow: hidden;
          }
          .why-glow::before {
            content: "";
            position: absolute;
            top: -25%; left: -25%;
            width: 150%; height: 150%;
            background: radial-gradient(circle at 20% 20%, rgba(34,197,94,0.10), transparent 8%),
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

          .glow-cta { box-shadow: 0 0 28px rgba(234,179,8,0.35); }
          .glow-cta:hover { box-shadow: 0 0 40px rgba(234,179,8,0.55); }

          .glow-arrow { box-shadow: 0 0 26px rgba(234,179,8,0.55); }
          .glow-arrow:hover { box-shadow: 0 0 36px rgba(234,179,8,0.75); }
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

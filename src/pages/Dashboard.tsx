import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Eye, EyeOff, Copy, Gift, Banknote, CheckCircle2, History, Disc3, Radio, Shield, TrendingUp, Users, Home, Gamepad2, User, Send, HelpCircle } from "lucide-react";
import { toast } from "sonner";
import { recoverFromInvalidRefreshToken, supabase } from "@/integrations/supabase/client";
import { FloatingActionButton } from "@/components/FloatingActionButton";
import { ArrowRight } from "lucide-react";
import { WelcomeModal } from "@/components/WelcomeModal";
import { WithdrawalNotification } from "@/components/WithdrawalNotification";
import { AddBalanceModal } from "@/components/AddBalanceModal";
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
  const [supportMessage, setSupportMessage] = useState("Contact Support");
  const authRetryCountRef = useRef(0);
  const dailyRewardNotifTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const dailyRewardIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const supportIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const hasDailyClaimedRef = useRef(false);

  const supportMessages = ["Support", "Contact Support", "Need Help"];

  useEffect(() => {
    checkAuth();
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") {
        setTimeout(() => checkAuth(), 300);
      } else if (session) {
        setUser(session.user);
        loadProfile(session.user.id);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate]);

  // Daily Reward Notification Popup
  useEffect(() => {
    if (!profile) return;

    // Check if claimed today from localStorage
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
          // Clear any existing intervals
          if (dailyRewardIntervalRef.current) {
            clearInterval(dailyRewardIntervalRef.current);
            dailyRewardIntervalRef.current = null;
          }
          return;
        }
      }
      
      hasDailyClaimedRef.current = false;
      
      // Show notification immediately and every 1 minute
      const showNotif = () => {
        setShowDailyRewardNotif(true);
        // Auto-dismiss after 5 seconds
        if (dailyRewardNotifTimeoutRef.current) {
          clearTimeout(dailyRewardNotifTimeoutRef.current);
        }
        dailyRewardNotifTimeoutRef.current = setTimeout(() => {
          setShowDailyRewardNotif(false);
        }, 5000);
      };

      showNotif();
      
      // Set interval to show every 60 seconds
      if (dailyRewardIntervalRef.current) {
        clearInterval(dailyRewardIntervalRef.current);
      }
      dailyRewardIntervalRef.current = setInterval(showNotif, 60000);
    };

    checkDailyReward();

    return () => {
      if (dailyRewardIntervalRef.current) {
        clearInterval(dailyRewardIntervalRef.current);
      }
      if (dailyRewardNotifTimeoutRef.current) {
        clearTimeout(dailyRewardNotifTimeoutRef.current);
      }
    };
  }, [profile]);

  // Support Message Cycling
  useEffect(() => {
    let messageIndex = 0;
    
    const updateMessage = () => {
      setSupportMessage(supportMessages[messageIndex]);
      messageIndex = (messageIndex + 1) % supportMessages.length;
    };

    supportIntervalRef.current = setInterval(updateMessage, 20000);

    return () => {
      if (supportIntervalRef.current) {
        clearInterval(supportIntervalRef.current);
      }
    };
  }, [supportMessages]);

  useEffect(() => {
    if (lastClaimTime) {
      const updateCountdown = () => {
        const timeDiff = Date.now() - lastClaimTime.getTime();
        const canClaimNow = timeDiff >= 2 * 60 * 1000; // 2 minutes
        
        if (canClaimNow) {
          setTimeRemaining("Ready!");
          setCanClaim(true);
        } else {
          const remainingTime = 2 * 60 * 1000 - timeDiff;
          const minutes = Math.floor(remainingTime / 60000);
          const seconds = Math.floor((remainingTime % 60000) / 1000);
          setTimeRemaining(`${minutes}:${seconds.toString().padStart(2, '0')}`);
          setCanClaim(false);
        }
      };

      // Update immediately
      updateCountdown();

      // Then set interval for continuous updates
      const interval = setInterval(updateCountdown, 1000);

      return () => clearInterval(interval);
    }
  }, [lastClaimTime]);

  const checkAuth = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        const recovered = await recoverFromInvalidRefreshToken(error);
        if (recovered) {
          setLoading(false);
          navigate("/auth");
          return;
        }

        console.warn('[Dashboard] Session check error:', error);
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
        const { data: userData, error: userError } = await supabase.auth.getUser();
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

      console.warn('[Dashboard] Session check failed:', error);
      if (authRetryCountRef.current < 3) {
        authRetryCountRef.current += 1;
        setTimeout(() => checkAuth(), 2000);
      } else {
        setLoading(false);
        toast.error("Network issue while loading dashboard. Please refresh and try again.");
      }
    }
  };

  const ensureProfileExists = async (userId: string) => {
    const { data: userData } = await supabase.auth.getUser();
    const authUser = userData.user;

    const generatedRefCode = Math.random().toString(36).slice(2, 8).toUpperCase();
    const fullNameFromMeta = (authUser?.user_metadata?.fullName || authUser?.user_metadata?.full_name || "").toString().trim();
    const fallbackName = fullNameFromMeta || authUser?.email?.split("@")[0] || "User";

    const newProfile = {
      id: userId,
      email: authUser?.email || "",
      full_name: fallbackName,
      referral_code: generatedRefCode,
      balance: 0,
      total_referrals: 0,
    };

    const { error: createError } = await supabase.from("profiles").upsert(newProfile as any);
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
      navigator.clipboard.writeText(`${window.location.origin}/auth?ref=${profile.referral_code}`);
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

      await supabase
        .from("transactions")
        .insert({
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
      
      // Stop showing daily reward notification after claim
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
          <p className="text-sm text-muted-foreground">Please login again to continue.</p>
          <Button onClick={() => navigate("/auth")}>Go to Login</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen liquid-bg pb-20" style={{ position: 'relative', zIndex: 1 }}>
      <WelcomeModal />
      <WithdrawalNotification />

      {/* Daily Reward Notification Popup */}

      {showDailyRewardNotif && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 animate-in fade-in">
          <div className="relative w-full max-w-xs sm:max-w-sm mx-auto">
            <Card className="rounded-2xl border border-[#EAB308]/30 bg-[#101112] shadow-2xl p-0 overflow-hidden">
              <button
                className="absolute top-3 right-3 text-[#EAB308] hover:text-[#fbbf24] text-lg font-bold z-10"
                onClick={() => setShowDailyRewardNotif(false)}
                aria-label="Close"
              >
                ×
              </button>
              <div className="flex flex-col items-center px-6 pt-7 pb-2">
                <div className="flex items-center justify-center w-14 h-14 rounded-full bg-[#181200] border-2 border-[#EAB308] mb-4">
                  <Gift className="w-8 h-8 text-[#EAB308]" />
                </div>
                <h2 className="text-xl font-bold text-white mb-2 text-center">Don't Miss Your Daily Reward!</h2>
                <p className="text-sm text-[#e7c95c] text-center mb-4">
                  Claim your <span className="font-bold text-[#EAB308]">daily bonus</span> now and keep your streak alive. Come back every day to earn even more!
                </p>
                <Button
                  onClick={() => {
                    setShowDailyRewardNotif(false);
                    navigate("/daily-rewards");
                  }}
                  className="w-full rounded-full bg-gradient-to-r from-[#EAB308] to-[#FBBF24] text-black text-base font-bold py-3 mb-2 mt-1 shadow-[0_4px_32px_rgba(234,179,8,0.18)] hover:from-[#fbbf24] hover:to-[#EAB308]"
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

      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-secondary p-4 text-primary-foreground glow-primary" style={{ pointerEvents: 'auto', position: 'relative', zIndex: 2 }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-background/20 backdrop-blur-lg flex items-center justify-center text-lg font-bold">
            {profile.full_name?.charAt(0) || "U"}
          </div>
          <div>
            <p className="text-xs opacity-90">Hi, {profile.full_name} 👋</p>
            <p className="text-sm font-semibold">Welcome back!</p>
          </div>
        </div>
      </div>

      <div className="space-y-4 py-4" style={{ position: 'relative', zIndex: 2, pointerEvents: 'auto' }}>
        {/* Balance Card - NOW WITH CLAIM BUTTON INSTEAD OF TOP UP */}
        <div className="px-4">
          <Card className="bg-gradient-to-br from-card to-card/80 backdrop-blur-lg border-border/50 p-4 glow-primary animate-fade-in">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Your Balance</p>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowBalance(!showBalance)}
                  className="hover:bg-muted h-8 w-8"
                >
                  {showBalance ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </Button>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold gradient-text">
                {showBalance ? `₦${Number(profile.balance || 0).toLocaleString()}.00` : "****"}
              </h2>
              {/* CLAIM BUTTON REPLACES TOP UP BUTTON */}
              <Button
                onClick={handleClaim}
                disabled={!canClaim || claiming}
                className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-sm py-2"
              >
                {claiming ? "Claiming..." : canClaim ? "Claim ₦1,000" : timeRemaining}
              </Button>
            </div>
          </Card>
        </div>

        {/* Join Telegram Channel Card */}
        <div className="px-4">
          <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20 p-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-start gap-2 flex-1 min-w-0">
                <Send className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
                <div className="text-xs min-w-0">
                  <p className="font-semibold text-foreground">Join Our Community</p>
                  <p className="text-muted-foreground truncate">Get updates on Telegram</p>
                </div>
              </div>
              <Button
                onClick={() => window.open('https://t.me/earnix9jachannel')}
                className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-xs px-3 py-1 h-auto flex-shrink-0"
              >
                Join
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
              className="h-20 flex flex-col gap-1.5 items-center justify-center rounded-lg border bg-card/80 hover:bg-card border-border/50 transition-all active:scale-95 touch-manipulation cursor-pointer min-h-[44px]"
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              <Gift className="w-5 h-5 text-primary" />
              <span className="text-xs font-semibold">Refer & Earn</span>
            </button>
            <button
              type="button"
              onClick={() => navigate("/withdraw")}
              className="h-20 flex flex-col gap-1.5 items-center justify-center rounded-lg border bg-card/80 hover:bg-card border-border/50 transition-all active:scale-95 touch-manipulation cursor-pointer min-h-[44px]"
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              <Banknote className="w-5 h-5 text-secondary" />
              <span className="text-xs font-semibold">Withdraw</span>
            </button>
            <button
              type="button"
              onClick={() => navigate("/tasks")}
              className="h-20 flex flex-col gap-1.5 items-center justify-center rounded-lg border bg-card/80 hover:bg-card border-border/50 transition-all active:scale-95 touch-manipulation cursor-pointer min-h-[44px]"
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              <span className="text-xs font-semibold">Tasks</span>
            </button>
            <button
              type="button"
              onClick={() => navigate("/history")}
              className="h-20 flex flex-col gap-1.5 items-center justify-center rounded-lg border bg-card/80 hover:bg-card border-border/50 transition-all active:scale-95 touch-manipulation cursor-pointer min-h-[44px]"
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              <History className="w-5 h-5 text-blue-500" />
              <span className="text-xs font-semibold">History</span>
            </button>
            <button
              type="button"
              onClick={() => toast.info("Coming Soon! 🚀")}
              className="h-20 flex flex-col gap-1.5 items-center justify-center rounded-lg border bg-card/80 hover:bg-card border-border/50 transition-all active:scale-95 touch-manipulation cursor-pointer min-h-[44px]"
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              <Disc3 className="w-5 h-5 text-accent" />
              <span className="text-xs font-semibold">Spin</span>
            </button>
            <button
              type="button"
              onClick={() => navigate("/support")}
              className="h-20 flex flex-col gap-1.5 items-center justify-center rounded-lg border bg-card/80 hover:bg-card border-border/50 transition-all active:scale-95 touch-manipulation cursor-pointer min-h-[44px] relative"
              style={{ WebkitTapHighlightColor: 'transparent' }}
              title={supportMessage}
            >
              <HelpCircle className="w-5 h-5 text-[#EAB308]" />
              <span className="text-xs font-semibold">{supportMessage}</span>
            </button>
          </div>
        </div>

        {/* Referral Card */}
        <div className="px-4">
          <Card className="bg-card/80 backdrop-blur-lg border-border/50 p-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Gift className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-semibold">Referral Program</h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-muted-foreground">Total Referrals</p>
                  <p className="text-xl font-bold text-primary">{profile.total_referrals || 0}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total Referral Earnings</p>
                  <p className="text-xl font-bold gradient-text">₦{Number((profile.total_referrals || 0) * 12000).toLocaleString()}</p>
                </div>
              </div>
              <div className="bg-muted/50 p-3 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1.5">Your Referral Link</p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 text-[10px] font-bold text-foreground truncate">{window.location.origin}/auth?ref={profile.referral_code}</code>
                  <Button
                    size="sm"
                    onClick={copyReferralCode}
                    className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 flex-shrink-0 h-7 w-7 p-0"
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Why Tivexx9ja Section */}
        <div className="mt-6">
          <div className="why-glow bg-gradient-to-br from-black via-amber-950 to-black rounded-2xl p-6 mb-6 mx-2 border border-yellow-600/40 relative overflow-hidden">
            <div className="text-center mb-4 relative z-10">
              <h2 className="text-2xl font-bold text-white mb-2">Why Earnix9ja⁉️</h2>
              <div className="w-16 h-1 bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-600 mx-auto mb-4 shadow-lg shadow-yellow-500/50"></div>
            </div>

            <div className="space-y-3 mb-6 relative z-10">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-yellow-700 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg shadow-yellow-500/40">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">100% Secure</h3>
                  <p className="text-yellow-100 text-sm">Bank-level encryption protects your transactions and personal data</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg shadow-yellow-500/40">
                  <TrendingUp className="w-5 h-5 text-black" />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Lightning Fast</h3>
                  <p className="text-yellow-100 text-sm">Instant withdrawals and seamless transactions in seconds</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">100% Reliable</h3>
                  <p className="text-green-200 text-sm">24/7 support and guaranteed service uptime</p>
                </div>
              </div>
            </div>

            <Link to="/referrals">
              <Button className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black font-bold py-3 rounded-full text-lg">
                Invite & Earn Now
              </Button>
            </Link>
          </div>
        </div>

        {/* Custom Styles for Glow Effect */}
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

          .why-glow {
            position: relative;
            overflow: hidden;
          }

          .why-glow::before {
            content: "";
            position: absolute;
            top: -25%;
            left: -25%;
            width: 150%;
            height: 150%;
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
            top: -10%;
            left: -120%;
            width: 60%;
            height: 120%;
            background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0) 100%);
            transform: skewX(-20deg);
            filter: blur(6px);
            animation: shimmer 3.5s ease-in-out infinite;
            pointer-events: none;
          }

          .why-glow > * {
            position: relative;
            z-index: 1;
          }
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
    </div>
  );
};

export default Dashboard;
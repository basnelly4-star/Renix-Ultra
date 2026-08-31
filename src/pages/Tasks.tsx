import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Clock, CheckCircle2, ExternalLink } from "lucide-react";
import { FloatingActionButton } from "@/components/FloatingActionButton";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const AD_VIEW_SECONDS = 15;

const Tasks = () => {
  const navigate = useNavigate();

  const tasks = [
    {
      id: 1,
      title: "Tap Sponsor Link",
      description: "Join our official Telegram channel for updates",
      reward: "₦5,000",
      link: "https://omg10.com/4/10573002",
    },
    {
      id: 2,
      title: "Join WhatsApp Group",
      description: "Join our WhatsApp community for instant updates",
      reward: "₦5,000",
      link: "https://omg10.com/4/10573002",
    },
    {
      id: 3,
      title: "Earn Extra",
      description:
        "Tap on our sponsorship ads to earn extra and get closer to your minimum withdrawal!",
      reward: "₦5,000",
      link: "https://omg10.com/4/10573002",
    },
    {
      id: 4,
      title: "Tap Sponsor Offer",
      description: "Join our official Telegram channel for updates",
      reward: "₦5,000",
      link: "https://omg10.com/4/10573002",
    },
    {
      id: 5,
      title: "Tap Sponsor Ad",
      description: "Join our official Telegram channel for updates",
      reward: "₦5,000",
      link: "https://omg10.com/4/10573002",
    },
    {
      id: 6,
      title: "Tap Sponsor Link Premium",
      description: "Join our official Telegram channel for updates",
      reward: "₦5,000",
      link: "https://www.effectivegatecpm.com/vmv8q8003e?key=86df7f349a5444d876061f4d1430b01c",
    },
    {
      id: 7,
      title: "Sponsor Verification",
      description:
        "Complete the official sponsor verification process to secure your bonus reward.",
      reward: "₦5,000",
      link: "https://www.effectivegatecpm.com/vmv8q8003e?key=86df7f349a5444d876061f4d1430b01c",
    },
    {
      id: 8,
      title: "Join WhatsApp Group",
      description: "Join our WhatsApp community for instant updates",
      reward: "₦5,000",
      link: "https://omg10.com/4/10573002",
    },
    {
      id: 9,
      title: "Earn Extra",
      description:
        "Tap on our sponsorship ads to earn extra and get closer to your minimum withdrawal!",
      reward: "₦5,000",
      link: "https://omg10.com/4/10573002",
    },
    {
      id: 10,
      title: "Tap Sponsor Ads",
      description: "Join our official Telegram channel for updates",
      reward: "₦5,000",
      link: "https://omg10.com/4/10573002",
    },
    {
      id: 11,
      title: "Tap Sponsor Opportunity",
      description: "Join our official Telegram channel for updates",
      reward: "₦5,000",
      link: "https://omg10.com/4/10573002",
    },
    {
      id: 12,
      title: "Tap Sponsor Link Fast",
      description: "Join our official Telegram channel for updates",
      reward: "₦5,000",
      link: "https://www.effectivegatecpm.com/vmv8q8003e?key=86df7f349a5444d876061f4d1430b01c",
    },
    {
      id: 13,
      title: "Tap Sponsor Revenue",
      description: "Join our official Telegram channel for updates",
      reward: "₦5,000",
      link: "https://t.me/Renixultra",
    },
    {
      id: 14,
      title: "Join WhatsApp Group",
      description: "Join our WhatsApp community for instant updates",
      reward: "₦5,000",
      link: "https://omg10.com/4/10573002",
    },
    {
      id: 15,
      title: "Earn Extra",
      description:
        "Tap on our sponsorship ads to earn extra and get closer to your minimum withdrawal!",
      reward: "₦5,000",
      link: "https://omg10.com/4/10573002",
    },
    {
      id: 16,
      title: "Tap Sponsor Link Now",
      description: "Join our official Telegram channel for updates",
      reward: "₦5,000",
      link: "https://omg10.com/4/10573002",
    },
    {
      id: 17,
      title: "Tap Sponsor Deal",
      description: "Join our official Telegram channel for updates",
      reward: "₦5,000",
      link: "https://omg10.com/4/10573002",
    },
  ];

  // Check if task was claimed today
  const isTaskClaimedToday = (taskId: number) => {
    const lastClaim = localStorage.getItem(`task_${taskId}_claimed`);
    if (!lastClaim) return false;
    const today = new Date().toDateString();
    const lastClaimDate = new Date(lastClaim).toDateString();
    return today === lastClaimDate;
  };

  const [claimedTodayMap, setClaimedTodayMap] = useState<Record<number, boolean>>({});

  // Ad dwell verification state
  const [activeTask, setActiveTask] = useState<(typeof tasks)[number] | null>(null);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(AD_VIEW_SECONDS);
  const [isCounting, setIsCounting] = useState(false);
  const [canClaim, setCanClaim] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const map: Record<number, boolean> = {};
    for (const t of tasks) map[t.id] = isTaskClaimedToday(t.id);
    setClaimedTodayMap(map);
  }, []);

  // countdown ticker
  useEffect(() => {
    if (!showVerifyModal || !isCounting) return;
    if (secondsLeft <= 0) {
      setCanClaim(true);
      setIsCounting(false);
      return;
    }
    timerRef.current = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [showVerifyModal, isCounting, secondsLeft]);

  // pause if user hides tab / switches away — forces real dwell
  useEffect(() => {
    const onVisibility = () => {
      if (!showVerifyModal || canClaim) return;
      if (document.hidden) {
        setIsCounting(false);
      } else {
        // resume only if still has time left
        if (secondsLeft > 0) setIsCounting(true);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [showVerifyModal, canClaim, secondsLeft]);

  const markTaskAsClaimed = (taskId: number) => {
    localStorage.setItem(`task_${taskId}_claimed`, new Date().toISOString());
    setClaimedTodayMap((prev) => ({ ...prev, [taskId]: true }));
  };

  const parseReward = (reward: string) => {
    const n = parseInt(reward.replace(/[^0-9]/g, ""), 10);
    return isNaN(n) ? 0 : n;
  };

  // Step 1: user taps task -> open ad IMMEDIATELY (same click = not blocked) + start timer
  const handleTaskTap = (task: (typeof tasks)[number]) => {
    if (isTaskClaimedToday(task.id)) {
      toast.error("Already claimed today! Come back tomorrow.");
      return;
    }
    // open ad synchronously so popup blocker allows it
    let opened = false;
    try {
      const win = window.open(task.link, "_blank", "noopener,noreferrer");
      if (win) opened = true;
    } catch {
      // ignore
    }
    if (!opened) {
      // fallback: still open but inform user
      toast.info("Popup blocked — opening ad...");
      window.location.href = task.link;
      return;
    }

    // start verification flow
    setActiveTask(task);
    setSecondsLeft(AD_VIEW_SECONDS);
    setCanClaim(false);
    setIsCounting(true);
    setShowVerifyModal(true);
    toast.info("Ad opened! Keep it open for 15s to verify.", { duration: 3000 });
  };

  const handleCancelVerify = () => {
    setShowVerifyModal(false);
    setIsCounting(false);
    setCanClaim(false);
    setActiveTask(null);
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  // Step 2: after dwell, verify & pay
  const handleVerifyAndClaim = async () => {
    if (!activeTask) return;
    if (!canClaim) {
      toast.error(`Please wait ${secondsLeft}s — keep the sponsor page open!`);
      return;
    }
    if (isTaskClaimedToday(activeTask.id)) {
      toast.error("Already claimed today! Come back tomorrow.");
      handleCancelVerify();
      return;
    }

    setIsClaiming(true);
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      const user = userData?.user;
      if (userError || !user) {
        toast.error("Please login first");
        setIsClaiming(false);
        return;
      }

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("balance")
        .eq("id", user.id)
        .single();

      if (error) throw error;

      const amount = parseReward(activeTask.reward);
      const newBalance = (profile.balance ?? 0) + amount;

      const { error: updateError } = await supabase
        .from("profiles")
        .update({ balance: newBalance })
        .eq("id", user.id);

      if (updateError) {
        toast.error("Failed to update balance. Try again.");
      } else {
        markTaskAsClaimed(activeTask.id);
        toast.success(`${activeTask.reward} added to your balance!`);
        handleCancelVerify();
      }
    } catch (err) {
      console.error("Claim error:", err);
      toast.error("Something went wrong");
    } finally {
      setIsClaiming(false);
    }
  };

  const progressPct = ((AD_VIEW_SECONDS - secondsLeft) / AD_VIEW_SECONDS) * 100;

  return (
    <div className="min-h-screen bg-[#06090d] pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#00C836] to-[#00E53A] p-6 text-[#04080a] shadow-[0_4px_20px_rgba(0,229,58,0.3)]">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/dashboard")}
            className="text-[#04080a] hover:bg-black/20"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold">Daily Tasks</h1>
        </div>
      </div>

      <div className="p-6 space-y-4">
        <Card className="bg-gradient-to-br from-[#0b1118] to-[#06090d] backdrop-blur-lg border border-[#00E53A]/30 p-6 shadow-[0_0_20px_rgba(0,229,58,0.1)]">
          <h2 className="text-xl font-bold text-white mb-2">Earn Extra Rewards</h2>
          <p className="text-sm text-[#94A3B8]">
            Complete 17 daily tasks to earn bonus credits and boost your earnings. Tap a task to open the sponsor ad — keep it open for 15s to verify!
          </p>
        </Card>

        {tasks.map((task) => {
          const isClaimed = claimedTodayMap[task.id] ?? false;
          return (
            <Card
              key={task.id}
              className="bg-[#0b1118]/80 backdrop-blur-lg border border-[#1e293b] p-4 shadow-[0_0_20px_rgba(0,229,58,0.05)]"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-white mb-1">{task.title}</h3>
                  <p className="text-sm text-[#94A3B8] mb-3">{task.description}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-[#00FF55]">{task.reward}</span>
                    <span className="text-xs text-[#94A3B8]">reward</span>
                    {isClaimed && (
                      <span className="text-xs bg-[#00E53A] text-[#04080a] px-2 py-1 rounded-full font-bold shadow-[0_0_10px_rgba(0,229,58,0.3)]">
                        Claimed Today
                      </span>
                    )}
                  </div>
                </div>
                <Button
                  onClick={() => handleTaskTap(task)}
                  disabled={isClaimed}
                  className={`px-6 py-3 font-bold whitespace-nowrap ${
                    isClaimed
                      ? "bg-[#1e293b] text-[#64748B] cursor-not-allowed"
                      : "bg-gradient-to-r from-[#00C836] to-[#00E53A] hover:from-[#00E53A] hover:to-[#00FF55] text-[#04080a] shadow-[0_0_20px_rgba(0,229,58,0.3)] transition-all active:scale-[0.98]"
                  }`}
                >
                  {isClaimed ? "Claimed" : "Tap to Earn"}
                </Button>
              </div>
            </Card>
          );
        })}

        <Card className="bg-[#0b1118] border border-[#00E53A]/20 p-4">
          <p className="text-sm text-center text-[#94A3B8]">
            Tasks reset every day at midnight. Check back tomorrow for more rewards!
          </p>
        </Card>
      </div>

      {/* Verification Modal — forces dwell */}
      {showVerifyModal && activeTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <Card className="w-full max-w-md bg-[#0b1118] border border-[#00E53A]/30 p-6 shadow-[0_0_30px_rgba(0,229,58,0.2)]">
            <div className="text-center space-y-4">
              <div className="mx-auto w-14 h-14 rounded-full bg-[#00E53A]/15 flex items-center justify-center border border-[#00E53A]/30">
                {canClaim ? (
                  <CheckCircle2 className="w-7 h-7 text-[#00E53A]" />
                ) : (
                  <Clock className="w-7 h-7 text-[#00E53A] animate-pulse" />
                )}
              </div>

              <div>
                <h3 className="text-lg font-bold text-white">{canClaim ? "Verified!" : "Verifying Sponsor View..."}</h3>
                <p className="text-sm text-[#94A3B8] mt-1">
                  {canClaim
                    ? "You kept the sponsor page open. Claim your reward now!"
                    : `Keep the sponsor tab open. Claiming unlocks in ${secondsLeft}s`}
                </p>
                <p className="text-xs text-[#64748B] mt-1 flex items-center justify-center gap-1">
                  <ExternalLink className="w-3 h-3" /> {activeTask.title} — {activeTask.reward}
                </p>
              </div>

              {/* Progress */}
              <div className="space-y-2">
                <div className="w-full h-2 bg-[#1e293b] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#00C836] to-[#00E53A] transition-all duration-1000 ease-linear"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-[#94A3B8]">{canClaim ? "Ready to claim" : "Stay on sponsor page..."}</span>
                  <span className={`font-bold ${canClaim ? "text-[#00E53A]" : "text-white"}`}>
                    {canClaim ? "✓" : `${secondsLeft}s`}
                  </span>
                </div>
                {!canClaim && !isCounting && (
                  <p className="text-xs text-amber-400">Paused — return to this tab to continue timer</p>
                )}
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  variant="outline"
                  onClick={handleCancelVerify}
                  disabled={isClaiming}
                  className="flex-1 border-[#1e293b] text-[#94A3B8] hover:bg-[#1e293b] hover:text-white"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleVerifyAndClaim}
                  disabled={!canClaim || isClaiming}
                  className={`flex-1 font-bold ${
                    canClaim
                      ? "bg-gradient-to-r from-[#00C836] to-[#00E53A] text-[#04080a] hover:from-[#00E53A] hover:to-[#00FF55] shadow-[0_0_20px_rgba(0,229,58,0.3)]"
                      : "bg-[#1e293b] text-[#64748B] cursor-not-allowed"
                  }`}
                >
                  {isClaiming ? "Claiming..." : canClaim ? `Claim ${activeTask.reward}` : `Wait ${secondsLeft}s`}
                </Button>
              </div>

              <p className="text-[11px] text-[#475569]">Tip: Don't close the sponsor tab early or your view won't count.</p>
            </div>
          </Card>
        </div>
      )}

      <FloatingActionButton />
    </div>
  );
};

export default Tasks;

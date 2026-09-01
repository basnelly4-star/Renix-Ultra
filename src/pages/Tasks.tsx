import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Loader2 } from "lucide-react";
import { FloatingActionButton } from "@/components/FloatingActionButton";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const AD_VIEW_SECONDS = 8;
const PENDING_KEY = "task_pending_v2";

type Pending = { id: number; reward: string; link: string; start: number; title: string };

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

  const isTaskClaimedToday = (taskId: number) => {
    const lastClaim = localStorage.getItem(`task_${taskId}_claimed`);
    if (!lastClaim) return false;
    const today = new Date().toDateString();
    const lastClaimDate = new Date(lastClaim).toDateString();
    return today === lastClaimDate;
  };

  const [claimedTodayMap, setClaimedTodayMap] = useState<Record<number, boolean>>({});
  const [processingTask, setProcessingTask] = useState<(typeof tasks)[number] | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const refreshClaimedMap = () => {
    const map: Record<number, boolean> = {};
    for (const t of tasks) map[t.id] = isTaskClaimedToday(t.id);
    setClaimedTodayMap(map);
  };

  const parseReward = (reward: string) => {
    const n = parseInt(reward.replace(/[^0-9]/g, ""), 10);
    return isNaN(n) ? 0 : n;
  };

  const markTaskAsClaimed = (taskId: number) => {
    localStorage.setItem(`task_${taskId}_claimed`, new Date().toISOString());
    setClaimedTodayMap((prev) => ({ ...prev, [taskId]: true }));
  };

  const doCredit = async (task: Pending | (typeof tasks)[number]) => {
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      const user = userData?.user;
      if (userError || !user) {
        toast.error("Please login first");
        return false;
      }
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("balance")
        .eq("id", user.id)
        .single();
      if (error) throw error;

      const amount = parseReward(task.reward);
      if (amount <= 0) {
        toast.error("Invalid reward");
        return false;
      }
      const newBalance = Number(profile?.balance ?? 0) + amount;
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ balance: newBalance })
        .eq("id", user.id);
      if (updateError) throw updateError;

      markTaskAsClaimed(task.id);
      toast.success(`${task.reward} added to your balance!`);
      return true;
    } catch (err: any) {
      console.error("Credit error", err);
      toast.error(err?.message || "Failed to credit — try again");
      return false;
    }
  };

  // On mount: check if we have a pending same-tab task that was opened 8s ago
  useEffect(() => {
    refreshClaimedMap();

    const raw = localStorage.getItem(PENDING_KEY);
    if (!raw) return;

    try {
      const pending: Pending = JSON.parse(raw);
      const elapsed = Date.now() - pending.start;
      const remaining = AD_VIEW_SECONDS * 1000 - elapsed;

      // If already claimed today (maybe double), just clear pending
      if (isTaskClaimedToday(pending.id)) {
        localStorage.removeItem(PENDING_KEY);
        return;
      }

      if (elapsed >= AD_VIEW_SECONDS * 1000) {
        // User spent 8s on advert (stayed on ad page 8s then came back) -> auto credit
        doCredit(pending).finally(() => {
          localStorage.removeItem(PENDING_KEY);
          setProcessingTask(null);
          setSecondsLeft(0);
        });
      } else if (elapsed >= 0 && elapsed < AD_VIEW_SECONDS * 1000) {
        // Returned too early -> must redo
        if (elapsed > 1000) {
          toast.error(`You came back too early! You need 8s on the advert. You only spent ${Math.floor(elapsed / 1000)}s. Please tap the task again.`, { duration: 5000 });
        }
        localStorage.removeItem(PENDING_KEY);
        // don't credit
      } else {
        localStorage.removeItem(PENDING_KEY);
      }
    } catch {
      localStorage.removeItem(PENDING_KEY);
    }
  }, []);

  // In-page countdown (only used if navigation didn't happen or user stayed)
  useEffect(() => {
    if (!processingTask) return;
    if (secondsLeft <= 0) {
      // should not happen in same-tab mode because we navigate away, but handle fallback
      const raw = localStorage.getItem(PENDING_KEY);
      if (raw) {
        try {
          const pending: Pending = JSON.parse(raw);
          doCredit(pending).finally(() => {
            localStorage.removeItem(PENDING_KEY);
            setProcessingTask(null);
          });
        } catch {
          setProcessingTask(null);
        }
      } else {
        setProcessingTask(null);
      }
      return;
    }
    timerRef.current = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [processingTask, secondsLeft]);

  const handleTaskTap = (task: (typeof tasks)[number]) => {
    if (isTaskClaimedToday(task.id)) {
      toast.error("Already claimed today! Come back tomorrow.");
      return;
    }

    const pendingRaw = localStorage.getItem(PENDING_KEY);
    if (pendingRaw) {
      try {
        const pending: Pending = JSON.parse(pendingRaw);
        const elapsed = Date.now() - pending.start;
        if (elapsed < AD_VIEW_SECONDS * 1000) {
          const wait = Math.ceil((AD_VIEW_SECONDS * 1000 - elapsed) / 1000);
          toast.error(`Please wait ${wait}s — finish "${pending.title}" first. You need 8s on the advert before you can claim another.`, { duration: 4000 });
          return;
        } else {
          // stale, clear
          localStorage.removeItem(PENDING_KEY);
        }
      } catch {
        localStorage.removeItem(PENDING_KEY);
      }
    }

    if (processingTask) {
      toast.error(`Please wait ${secondsLeft}s — "${processingTask.title}" is processing. You must stay 8s on the advert.`, { duration: 4000 });
      return;
    }

    // Start countdown IMMEDIATELY on tap (UI updates in same tick) then open same tab
    setProcessingTask(task);
    setSecondsLeft(AD_VIEW_SECONDS);

    const pending: Pending = {
      id: task.id,
      reward: task.reward,
      link: task.link,
      title: task.title,
      start: Date.now(),
    };
    localStorage.setItem(PENDING_KEY, JSON.stringify(pending));

    toast.info(`Opening "${task.title}" — stay 8s on the advert to get credited!`);

    // Small delay so user SEES the Processing state start counting before navigation
    setTimeout(() => {
      window.location.href = task.link;
    }, 350);
  };

  const isProcessing = (id: number) => processingTask?.id === id;

  return (
    <div className="min-h-screen bg-[#06090d] pb-20">
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
            Tap a task to open the sponsor ad in this tab — stay 8s on the advert, then come back to be credited automatically!
          </p>
        </Card>

        {tasks.map((task) => {
          const isClaimed = claimedTodayMap[task.id] ?? false;
          const processing = isProcessing(task.id);
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
                      <span className="text-xs bg-[#00E53A] text-[#04080a] px-2 py-1 rounded-full font-bold">Claimed Today</span>
                    )}
                    {processing && (
                      <span className="text-xs bg-amber-400 text-black px-2 py-1 rounded-full font-bold animate-pulse">
                        Processing {secondsLeft}s
                      </span>
                    )}
                  </div>
                </div>
                <Button
                  onClick={() => handleTaskTap(task)}
                  disabled={isClaimed || processing}
                  className={`px-6 py-3 font-bold whitespace-nowrap min-w-[124px] ${
                    isClaimed
                      ? "bg-[#1e293b] text-[#64748B] cursor-not-allowed"
                      : processing
                      ? "bg-amber-400 text-black cursor-wait"
                      : "bg-gradient-to-r from-[#00C836] to-[#00E53A] hover:from-[#00E53A] hover:to-[#00FF55] text-[#04080a] shadow-[0_0_20px_rgba(0,229,58,0.3)]"
                  }`}
                >
                  {isClaimed ? "Claimed" : processing ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" /> {secondsLeft}s
                    </span>
                  ) : (
                    "Tap to Earn"
                  )}
                </Button>
              </div>
              {processing && (
                <div className="mt-3 w-full h-1.5 bg-[#1e293b] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-400 transition-all duration-1000 ease-linear"
                    style={{ width: `${((AD_VIEW_SECONDS - secondsLeft) / AD_VIEW_SECONDS) * 100}%` }}
                  />
                </div>
              )}
            </Card>
          );
        })}

        <Card className="bg-[#0b1118] border border-[#00E53A]/20 p-4">
          <p className="text-sm text-center text-[#94A3B8]">Tasks reset daily at midnight. Return after 8s on advert to claim!</p>
        </Card>
      </div>

      <FloatingActionButton />
    </div>
  );
};

export default Tasks;

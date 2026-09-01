import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Loader2 } from "lucide-react";
import { FloatingActionButton } from "@/components/FloatingActionButton";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const AD_VIEW_SECONDS = 8;

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

  const [claimedTodayMap, setClaimedTodayMap] = useState<
    Record<number, boolean>
  >({});

  // auto-claim state: only one task can be processing at a time
  const [processingTask, setProcessingTask] = useState<
    (typeof tasks)[number] | null
  >(null);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const map: Record<number, boolean> = {};
    for (const t of tasks) map[t.id] = isTaskClaimedToday(t.id);
    setClaimedTodayMap(map);
  }, []);

  const markTaskAsClaimed = (taskId: number) => {
    localStorage.setItem(`task_${taskId}_claimed`, new Date().toISOString());
    setClaimedTodayMap((prev) => ({ ...prev, [taskId]: true }));
  };

  const parseReward = (reward: string) => {
    const n = parseInt(reward.replace(/[^0-9]/g, ""), 10);
    return isNaN(n) ? 0 : n;
  };

  const doAutoClaim = async (task: (typeof tasks)[number]) => {
    try {
      const { data: userData, error: userError } =
        await supabase.auth.getUser();
      const user = userData?.user;
      if (userError || !user) {
        toast.error("Please login first");
        setProcessingTask(null);
        return;
      }

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("balance")
        .eq("id", user.id)
        .single();

      if (error) throw error;

      const amount = parseReward(task.reward);
      if (amount <= 0) {
        toast.error("Invalid reward amount");
        setProcessingTask(null);
        return;
      }

      const currentBalance = Number(profile?.balance ?? 0);
      const newBalance = currentBalance + amount;

      const { error: updateError } = await supabase
        .from("profiles")
        .update({ balance: newBalance })
        .eq("id", user.id);

      if (updateError) {
        toast.error(`Failed to update balance: ${updateError.message}`);
        setProcessingTask(null);
        return;
      }

      markTaskAsClaimed(task.id);
      toast.success(`${task.reward} added to your balance!`);
    } catch (err: any) {
      console.error("Auto claim error:", err);
      toast.error(err?.message || "Something went wrong — please try again");
    } finally {
      setProcessingTask(null);
      setSecondsLeft(0);
      if (timerRef.current) clearTimeout(timerRef.current);
    }
  };

  // countdown -> auto claim at 0
  useEffect(() => {
    if (!processingTask) return;

    if (secondsLeft <= 0) {
      // time up -> auto credit
      doAutoClaim(processingTask);
      return;
    }

    timerRef.current = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [processingTask, secondsLeft]);

  const handleTaskTap = (task: (typeof tasks)[number]) => {
    // already claimed today?
    if (isTaskClaimedToday(task.id)) {
      toast.error("Already claimed today! Come back tomorrow.");
      return;
    }

    // if another task is still processing, block and tell them to wait / redo
    if (processingTask) {
      if (processingTask.id === task.id) {
        toast.error(
          `Please wait ${secondsLeft}s — "${task.title}" is still processing. Stay on the advert for 8s.`,
        );
      } else {
        toast.error(
          `You must wait ${secondsLeft}s on "${processingTask.title}" advert before you can start another task. Please finish and try again.`,
          { duration: 4000 },
        );
      }
      return;
    }

    // start counting immediately on tap so the user sees the timer begin right away
    const beginTaskCountdown = () => {
      setProcessingTask(task);
      setSecondsLeft(AD_VIEW_SECONDS);
      k;
      toast.info(
        `Ad opening... Processing "${tas.title}" — you'll be credited in ${AD_VIEW_SECONDS}s. Stay on the advert!`,
      );
    };

    beginTaskCountdown();

    // open ad immediately (same click so not blocked)
    let opened = false;
    try {
      const win = window.open(task.link, "_blank", "noopener,noreferrer");
      if (win) opened = true;
    } catch {
      // ignore
    }
    if (!opened) {
      setProcessingTask(null);
      setSecondsLeft(0);
      toast.error("Popup blocked — please allow popups and tap again");
      return;
    }

    // countdown is already running as soon as the task is tapped
  };

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
          <h2 className="text-xl font-bold text-white mb-2">
            Earn Extra Rewards
          </h2>
          <p className="text-sm text-[#94A3B8]">
            Complete 17 daily tasks to earn bonus credits. Tap a task to open
            the sponsor ad — reward is credited automatically after 8s!
          </p>
        </Card>

        {tasks.map((task) => {
          const isClaimed = claimedTodayMap[task.id] ?? false;
          const isProcessing = processingTask?.id === task.id;

          return (
            <Card
              key={task.id}
              className="bg-[#0b1118]/80 backdrop-blur-lg border border-[#1e293b] p-4 shadow-[0_0_20px_rgba(0,229,58,0.05)]"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-white mb-1">
                    {task.title}
                  </h3>
                  <p className="text-sm text-[#94A3B8] mb-3">
                    {task.description}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-[#00FF55]">
                      {task.reward}
                    </span>
                    <span className="text-xs text-[#94A3B8]">reward</span>
                    {isClaimed && (
                      <span className="text-xs bg-[#00E53A] text-[#04080a] px-2 py-1 rounded-full font-bold shadow-[0_0_10px_rgba(0,229,58,0.3)]">
                        Claimed Today
                      </span>
                    )}
                    {isProcessing && (
                      <span className="text-xs bg-amber-400 text-black px-2 py-1 rounded-full font-bold animate-pulse">
                        Processing {secondsLeft}s
                      </span>
                    )}
                  </div>
                </div>
                <Button
                  onClick={() => handleTaskTap(task)}
                  disabled={isClaimed || isProcessing}
                  className={`px-6 py-3 font-bold whitespace-nowrap min-w-[124px] ${
                    isClaimed
                      ? "bg-[#1e293b] text-[#64748B] cursor-not-allowed"
                      : isProcessing
                        ? "bg-amber-400 text-black cursor-wait"
                        : "bg-gradient-to-r from-[#00C836] to-[#00E53A] hover:from-[#00E53A] hover:to-[#00FF55] text-[#04080a] shadow-[0_0_20px_rgba(0,229,58,0.3)] transition-all active:scale-[0.98]"
                  }`}
                >
                  {isClaimed ? (
                    "Claimed"
                  ) : isProcessing ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" /> {secondsLeft}
                      s
                    </span>
                  ) : (
                    "Tap to Earn"
                  )}
                </Button>
              </div>
              {isProcessing && (
                <div className="mt-3 w-full h-1.5 bg-[#1e293b] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-400 transition-all duration-1000 ease-linear"
                    style={{
                      width: `${((AD_VIEW_SECONDS - secondsLeft) / AD_VIEW_SECONDS) * 100}%`,
                    }}
                  />
                </div>
              )}
            </Card>
          );
        })}

        <Card className="bg-[#0b1118] border border-[#00E53A]/20 p-4">
          <p className="text-sm text-center text-[#94A3B8]">
            Tasks reset every day at midnight. Check back tomorrow for more
            rewards!
          </p>
        </Card>
      </div>

      <FloatingActionButton />
    </div>
  );
};

export default Tasks;

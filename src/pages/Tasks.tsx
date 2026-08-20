import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { FloatingActionButton } from "@/components/FloatingActionButton";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const Tasks = () => {
  const navigate = useNavigate();

  const tasks = [
    {
      id: 1,
      title: "Tap Sponsor Link",
      description: "Join our official Telegram channel for updates",
      reward: "₦5,000",
      link: "https://omg10.com/4/11018116",
    },
    {
      id: 2,
      title: "Join WhatsApp Group",
      description: "Join our WhatsApp community for instant updates",
      reward: "₦5,000",
      link: "https://omg10.com/4/11018116",
    },
    {
      id: 3,
      title: "Earn Extra",
      description:
        "Tap on our sponsorship ads to earn extra and get closer to your minimum withdrawal!",
      reward: "₦5,000",
      link: "https://omg10.com/4/11018116",
    },
    {
      id: 4,
      title: "Tap Sponsor Offer",
      description: "Join our official Telegram channel for updates",
      reward: "₦5,000",
      link: "https://omg10.com/4/11018116",
    },
    {
      id: 5,
      title: "Tap Sponsor Ad",
      description: "Join our official Telegram channel for updates",
      reward: "₦5,000",
      link: "https://omg10.com/4/11018116",
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
      link: "https://omg10.com/4/11018116",
    },
    {
      id: 9,
      title: "Earn Extra",
      description:
        "Tap on our sponsorship ads to earn extra and get closer to your minimum withdrawal!",
      reward: "₦5,000",
      link: "https://omg10.com/4/11018116",
    },
    {
      id: 10,
      title: "Tap Sponsor Ads",
      description: "Join our official Telegram channel for updates",
      reward: "₦5,000",
      link: "https://omg10.com/4/11018116",
    },
    {
      id: 11,
      title: "Tap Sponsor Opportunity",
      description: "Join our official Telegram channel for updates",
      reward: "₦5,000",
      link: "https://omg10.com/4/11018116",
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
      link: "https://t.me/earnixupdate",
    },
    {
      id: 14,
      title: "Join WhatsApp Group",
      description: "Join our WhatsApp community for instant updates",
      reward: "₦5,000",
      link: "https://omg10.com/4/11018116",
    },
    {
      id: 15,
      title: "Earn Extra",
      description:
        "Tap on our sponsorship ads to earn extra and get closer to your minimum withdrawal!",
      reward: "₦5,000",
      link: "https://omg10.com/4/11018116",
    },
    {
      id: 16,
      title: "Tap Sponsor Link Now",
      description: "Join our official Telegram channel for updates",
      reward: "₦5,000",
      link: "https://omg10.com/4/11018116",
    },
    {
      id: 17,
      title: "Tap Sponsor Deal",
      description: "Join our official Telegram channel for updates",
      reward: "₦5,000",
      link: "https://omg10.com/4/11018116",
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

  // Track claimed tasks in state so UI updates immediately without refresh
  const [claimedTodayMap, setClaimedTodayMap] = useState<
    Record<number, boolean>
  >({});

  useEffect(() => {
    const map: Record<number, boolean> = {};
    for (const t of tasks) map[t.id] = isTaskClaimedToday(t.id);
    setClaimedTodayMap(map);
  }, []);

  // Mark task as claimed for today
  const markTaskAsClaimed = (taskId: number) => {
    localStorage.setItem(`task_${taskId}_claimed`, new Date().toISOString());
    setClaimedTodayMap((prev) => ({ ...prev, [taskId]: true }));
  };

  const handleClaim = async (task: any) => {
    // Check if already claimed today
    if (isTaskClaimedToday(task.id)) {
      toast.error("Already claimed today! Come back tomorrow.");
      return;
    }

    const { data: userData, error: userError } = await supabase.auth.getUser();
    const user = userData?.user;
    if (userError || !user) {
      toast.error("Please login first");
      return;
    }

    try {
      // Get current balance
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("balance")
        .eq("id", user.id)
        .single();

      if (error) throw error;

      // Calculate new balance
      let amount = 0;
      if (task.id === 1 || task.id === 2) amount = 5000;
      if (task.id === 5) amount = 15000;

      if (task.id === 7) {
        await new Promise((resolve) => setTimeout(resolve, 5000));
      }

      const newBalance = profile.balance + amount;

      // Update balance in database
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ balance: newBalance })
        .eq("id", user.id);

      if (updateError) {
        toast.error("Failed to update balance. Try again.");
      } else {
        // Mark as claimed for today
        markTaskAsClaimed(task.id);

        // Show success message
        toast.success(`${task.reward} added to your balance!`);

        // Open external link in a new tab so session stays intact
        if (task.link) {
          try {
            window.open(task.link, "_blank", "noopener,noreferrer");
          } catch (e) {
            // fallback to same-tab if popup blocked
            window.location.href = task.link;
          }
        }
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Something went wrong");
    }
  };

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
        {/* Intro Card */}
        <Card className="bg-gradient-to-br from-[#0b1118] to-[#06090d] backdrop-blur-lg border border-[#00E53A]/30 p-6 shadow-[0_0_20px_rgba(0,229,58,0.1)]">
          <h2 className="text-xl font-bold text-white mb-2">
            Earn Extra Rewards
          </h2>
          <p className="text-sm text-[#94A3B8]">
            Complete 17 daily tasks to earn bonus credits and boost your
            earnings
          </p>
        </Card>

        {/* Task Cards */}
        {tasks.map((task) => {
          const isClaimed = claimedTodayMap[task.id] ?? false;

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
                  </div>
                </div>

                <Button
                  onClick={() => handleClaim(task)}
                  disabled={isClaimed}
                  className={`px-6 py-3 font-bold ${
                    isClaimed
                      ? "bg-[#1e293b] text-[#64748B] cursor-not-allowed"
                      : "bg-gradient-to-r from-[#00C836] to-[#00E53A] hover:from-[#00E53A] hover:to-[#00FF55] text-[#04080a] shadow-[0_0_20px_rgba(0,229,58,0.3)] transition-all active:scale-[0.98]"
                  }`}
                >
                  {isClaimed ? "Claimed" : "Claim Now"}
                </Button>
              </div>
            </Card>
          );
        })}

        {/* Footer Info */}
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

import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Gift } from "lucide-react";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tasksCompleted: number;
  totalTasks: number;
};

const DailyTasksPopup: React.FC<Props> = ({
  open,
  onOpenChange,
  tasksCompleted,
  totalTasks,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 animate-in fade-in">
      <div className="relative w-full max-w-xs sm:max-w-sm mx-auto">
        <Card className="rounded-2xl border border-[#00E53A]/30 bg-[#0f0f0f] shadow-2xl p-5 overflow-hidden gold-glow-card">
          <button
            className="absolute top-3 right-3 text-[#00FF55] hover:text-[#66FF88] text-lg font-bold z-10"
            onClick={() => onOpenChange(false)}
            aria-label="Close"
          >
            ×
          </button>

          <div className="flex flex-col items-center px-2 pt-2 pb-1">
            <div className="flex items-center justify-center w-14 h-14 rounded-full bg-[#00E53A]/10 border-2 border-[#00E53A] mb-4 gold-glow-icon">
              <Gift className="w-8 h-8 text-[#00FF55]" />
            </div>

            <h2 className="text-xl font-bold text-white mb-2 text-center">
              Daily Tasks Progress
            </h2>

            <p className="text-sm text-[#00FF55]/80 text-center mb-3">
              You have completed{" "}
              <span className="font-bold text-white">{tasksCompleted}</span> of{" "}
              <span className="font-bold text-white">{totalTasks}</span> daily
              tasks today.
            </p>

            <p className="text-sm text-muted-foreground text-center mb-4">
              Keep going — complete your daily tasks to boost your balance.
            </p>

            <div className="w-full grid grid-cols-2 gap-2">
              <Button
                onClick={() => {
                  onOpenChange(false);
                  window.location.href = "/tasks";
                }}
                className="bg-gradient-to-r from-primary to-secondary"
              >
                View Tasks
              </Button>

              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Dismiss
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DailyTasksPopup;

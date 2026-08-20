import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface WithdrawalMilestoneModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onViewDetails: () => void;
  balance: number;
}

export const WithdrawalMilestoneModal = ({
  open,
  onOpenChange,
  onViewDetails,
  balance,
}: WithdrawalMilestoneModalProps) => {
  if (!open) return null;

  const minimumWithdraw = 180000;
  const earnedText = `₦${(balance - minimumWithdraw).toLocaleString()}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      {/* Close Button */}
      <button
        onClick={() => onOpenChange(false)}
        title="Close modal"
        className="absolute top-6 right-6 text-gray-400 hover:text-white p-2 rounded-full bg-gray-800/50 hover:bg-gray-700/50 transition"
      >
        <X className="w-6 h-6" />
      </button>

      <div className="relative">
        {/* Coin Animations */}
        <div className="absolute -top-20 left-1/4 animate-float-coin">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#00FF55] to-[#00C836] shadow-lg shadow-[#00E53A]/50 flex items-center justify-center">
            <span className="text-2xl">💰</span>
          </div>
        </div>

        <div className="absolute -top-10 right-1/4 animate-float-coin-delay">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#00FF55] to-[#00C836] shadow-lg shadow-[#00E53A]/40 flex items-center justify-center">
            <span className="text-xl">💰</span>
          </div>
        </div>

        <div className="absolute top-0 right-0 animate-float-coin-delay-2">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#00FF55] to-[#00C836] shadow-lg shadow-[#00E53A]/50 flex items-center justify-center">
            <span className="text-xl">💰</span>
          </div>
        </div>

        {/* SPARKLEs */}
        <div className="absolute -left-8 top-1/2 text-2xl animate-pulse">
          ✨
        </div>
        <div className="absolute -right-8 top-1/3 text-xl animate-pulse animation-delay-500">
          ✨
        </div>
        <div className="absolute top-0 left-1/2 text-xl animate-pulse animation-delay-1000">
          ⭐
        </div>

        {/* Main Celebration Card */}
        <div className="relative px-8 py-12 mx-auto max-w-md">
          {/* Stack of Money Animation */}
          <div className="absolute left-1/2 transform -translate-x-1/2 -top-24 flex flex-col items-center gap-2">
            <div className="w-24 h-4 bg-gradient-to-r from-[#00E53A] to-[#00FF55] rounded-sm shadow-lg shadow-[#00E53A]/50" />
            <div className="w-28 h-4 bg-gradient-to-r from-[#00E53A] to-[#00FF55] rounded-sm shadow-lg shadow-[#00E53A]/50 ml-2" />
            <div className="w-32 h-4 bg-gradient-to-r from-[#00E53A] to-[#00FF55] rounded-sm shadow-lg shadow-[#00E53A]/50 ml-4" />
            <div className="absolute -left-4 top-1 w-2 h-10 bg-[#00FF55] opacity-30 rounded" />
          </div>

          {/* Gradient Card */}
          <div className="relative mt-12 rounded-2xl bg-gradient-to-r from-[#00C836] via-[#00E53A] to-[#00FF55] p-1 shadow-2xl shadow-[#00E53A]/40">
            <div className="rounded-2xl bg-black/90 backdrop-blur-xl px-8 py-6 text-center relative overflow-hidden">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#00E53A]/10 via-[#00FF55]/10 to-[#00C836]/10 opacity-50" />

              <div className="relative z-10">
                <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-[#00FF55] to-[#66FF88] bg-clip-text text-transparent">
                  Congratulations! 🎉
                </h2>
                <p className="text-white/80 text-sm mb-6 leading-relaxed">
                  You've reached the minimum withdrawal threshold!
                </p>

                <div className="mb-6 inline-block">
                  <p className="text-white/60 text-xs mb-2">
                    You will earn around
                  </p>
                  <p className="text-4xl font-bold bg-gradient-to-r from-[#00FF55] to-[#66FF88] bg-clip-text text-transparent">
                    {earnedText}
                  </p>
                </div>

                <p className="text-white/60 text-xs mb-8">
                  You are now eligible for withdrawal! Your balance: ₦
                  {balance.toLocaleString()}
                </p>

                <Button
                  onClick={onViewDetails}
                  className="w-full bg-gradient-to-r from-[#00E53A] to-[#00FF55] hover:from-[#00C836] hover:to-[#00E53A] text-black font-bold py-3 rounded-full text-lg shadow-lg shadow-[#00E53A]/50 transition-all duration-200 hover:shadow-[#00E53A]/70 active:scale-95"
                >
                  View Details →
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float-coin {
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.8; }
          50% { transform: translateY(-20px) rotate(10deg); opacity: 1; }
        }

        @keyframes float-coin-delay {
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.7; }
          50% { transform: translateY(-25px) rotate(-8deg); opacity: 1; }
        }

        @keyframes float-coin-delay-2 {
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.75; }
          50% { transform: translateY(-18px) rotate(15deg); opacity: 1; }
        }

        .animate-float-coin {
          animation: float-coin 3s ease-in-out infinite;
        }

        .animate-float-coin-delay {
          animation: float-coin-delay 3.5s ease-in-out infinite;
        }

        .animate-float-coin-delay-2 {
          animation: float-coin-delay-2 3s ease-in-out infinite 0.5s;
        }

        .animation-delay-500 {
          animation-delay: 0.5s;
        }

        .animation-delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
    </div>
  );
};

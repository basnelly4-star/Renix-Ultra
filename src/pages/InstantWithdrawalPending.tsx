import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { X, MessageCircle } from "lucide-react";
import { FloatingActionButton } from "@/components/FloatingActionButton";

const InstantWithdrawalPending = () => {
  const navigate = useNavigate();

  const openWhatsApp = () => {
    window.location.href = "https://t.me/RenixUltraSupport";
  };

  const openTelegram = () => {
    window.location.href = "https://t.me/RenixUltraSupport";
  };

  return (
    <div className="min-h-screen liquid-bg pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#00C836] to-[#00E53A] p-6 text-[#04080a] shadow-[0_4px_20px_rgba(0,229,58,0.3)]">
        <h1 className="text-2xl font-bold text-center">Payment Failed</h1>
      </div>

      <div className="p-6 space-y-6">
        {/* Main Card */}
        <Card className="bg-[#0b1118]/80 backdrop-blur-lg border border-[#1e293b] p-8 text-center shadow-[0_0_20px_rgba(0,229,58,0.05)]">
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center border-2 border-red-500/40">
              <X className="w-12 h-12 text-red-500 stroke-[3]" />
            </div>
          </div>

          <h2 className="text-2xl font-bold mb-2 text-red-500">
            Payment Failed
          </h2>
          <p className="text-sm text-[#94A3B8] mb-6">
            Your instant withdrawal activation payment could not be processed
          </p>

          <p className="text-[#94A3B8] mb-6">
            We encountered an issue processing your instant withdrawal
            activation payment of ₦12,600. This could be due to, incorrect
            account details, or a network error.
          </p>

          <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg mb-6">
            <p className="text-sm text-red-400">
              ⚠️ Please contact our support team to resolve this issue and retry
              your payment.
            </p>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-semibold text-white mb-4">
              Contact Support for Assistance:
            </p>

            <Button
              onClick={openTelegram}
              className="w-full bg-gradient-to-r from-[#00E53A] to-[#00FF55] hover:from-[#00C836] hover:to-[#00E53A] text-[#04080a] font-black rounded-xl shadow-[0_0_20px_rgba(0,229,58,0.3)] transition-all active:scale-[0.98]"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Message Telegram Support
            </Button>

            <Button
              onClick={openWhatsApp}
              className="w-full bg-gradient-to-r from-[#00FF55] to-[#66FF88] hover:from-[#00E53A] hover:to-[#00FF55] text-[#04080a] font-black rounded-xl shadow-[0_0_20px_rgba(0,255,85,0.3)] transition-all active:scale-[0.98]"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Message WhatsApp Support
            </Button>

            <Button
              onClick={() => navigate("/withdraw")}
              variant="outline"
              className="w-full mt-4 font-semibold border-[#00E53A]/30 text-[#00FF55] hover:bg-[#00E53A]/10 hover:text-[#00FF55] transition-all"
            >
              Try Again
            </Button>

            <Button
              onClick={() => navigate("/dashboard")}
              variant="ghost"
              className="w-full mt-2 font-semibold text-[#94A3B8] hover:text-white"
            >
              Back to Dashboard
            </Button>
          </div>
        </Card>
      </div>

      <FloatingActionButton />
    </div>
  );
};

export default InstantWithdrawalPending;

import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Clock, MessageCircle } from "lucide-react";
import { FloatingActionButton } from "@/components/FloatingActionButton";

const GatewayPending = () => {
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
        <h1 className="text-2xl font-bold text-center">Payment Pending</h1>
      </div>

      <div className="p-6 space-y-6">
        {/* Main Status Card */}
        <Card className="bg-gradient-to-br from-[#0b1118] to-[#06090d] backdrop-blur-lg border border-[#00E53A]/30 p-8 text-center shadow-[0_0_20px_rgba(0,229,58,0.1)]">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-[#00E53A]/10 flex items-center justify-center">
            <Clock className="w-10 h-10 text-[#00FF55]" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Payment Not Confirmed
          </h2>
          <p className="text-[#94A3B8] mb-6">
            Your gateway activation payment is being reviewed. This usually
            takes up to 24 hours.
          </p>
          <div className="bg-[#06090d] p-4 rounded-lg border border-[#00E53A]/20 mb-6">
            <p className="text-sm font-semibold text-white mb-2">Need Help?</p>
            <p className="text-sm text-[#94A3B8]">
              Contact our support team if you have any questions
            </p>
          </div>
        </Card>

        {/* Support Card */}
        <Card className="bg-[#0b1118]/80 backdrop-blur-lg border border-[#1e293b] p-6 shadow-[0_0_20px_rgba(0,229,58,0.05)]">
          <h3 className="font-semibold mb-4 text-white">Contact Support</h3>
          <div className="space-y-3">
            <Button
              onClick={openWhatsApp}
              className="w-full bg-gradient-to-r from-[#00E53A] to-[#00FF55] hover:from-[#00C836] hover:to-[#00E53A] text-[#04080a] font-black rounded-xl shadow-[0_0_20px_rgba(0,229,58,0.3)] transition-all active:scale-[0.98]"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              WhatsApp Support
            </Button>
            <Button
              onClick={openTelegram}
              className="w-full bg-gradient-to-r from-[#00FF55] to-[#66FF88] hover:from-[#00E53A] hover:to-[#00FF55] text-[#04080a] font-black rounded-xl shadow-[0_0_20px_rgba(0,255,85,0.3)] transition-all active:scale-[0.98]"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Telegram Support
            </Button>
          </div>
        </Card>

        {/* Back Button */}
        <Button
          onClick={() => navigate("/dashboard")}
          variant="outline"
          className="w-full border-[#00E53A]/30 text-[#00FF55] hover:bg-[#00E53A]/10 hover:text-[#00FF55] transition-all"
        >
          Back to Dashboard
        </Button>
      </div>

      <FloatingActionButton />
    </div>
  );
};

export default GatewayPending;

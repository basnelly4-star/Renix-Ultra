import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, MessageCircle, Send } from "lucide-react";
import { FloatingActionButton } from "@/components/FloatingActionButton";

const Support = () => {
  const navigate = useNavigate();

  const openWhatsApp = () => {
    window.location.href = "https://t.me/Renix-Ultrasupport1";
  };

  const openTelegram = () => {
    window.location.href = "https://t.me/Renix-Ultrasupport1";
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
          <h1 className="text-2xl font-bold">Support</h1>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Hero Card */}
        <Card className="bg-gradient-to-br from-[#0b1118] to-[#06090d] backdrop-blur-lg border border-[#00E53A]/30 p-6 text-center shadow-[0_0_20px_rgba(0,229,58,0.1)]">
          <MessageCircle className="w-16 h-16 mx-auto mb-4 text-[#00FF55]" />
          <h2 className="text-2xl font-bold text-white mb-2">Need Help? 💬</h2>
          <p className="text-[#94A3B8] mb-4">
            Our support team is ready to assist you! Choose your preferred
            platform below.
          </p>
        </Card>

        {/* Support Buttons Card */}
        <Card className="bg-[#0b1118]/80 backdrop-blur-lg border border-[#1e293b] p-6 shadow-[0_0_20px_rgba(0,229,58,0.05)]">
          <h3 className="font-semibold mb-4 text-lg text-white">
            Contact Support 🎯
          </h3>
          <div className="space-y-3">
            <button
              onClick={openWhatsApp}
              className="w-full bg-gradient-to-r from-[#00E53A] to-[#00FF55] hover:from-[#00C836] hover:to-[#00E53A] text-[#04080a] font-black py-3 px-4 rounded-lg transition-all active:scale-[0.98] touch-manipulation min-h-[44px] flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,229,58,0.3)]"
            >
              <MessageCircle className="w-5 h-5" />
              Telegram Support
            </button>
            <button
              onClick={openTelegram}
              className="w-full bg-gradient-to-r from-[#00FF55] to-[#66FF88] hover:from-[#00E53A] hover:to-[#00FF55] text-[#04080a] font-black py-3 px-4 rounded-lg transition-all active:scale-[0.98] touch-manipulation min-h-[44px] flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,255,85,0.3)]"
            >
              <Send className="w-5 h-5" />
              Telegram Support
            </button>
          </div>
        </Card>

        {/* Contact Info Card */}
        <Card className="bg-[#0b1118] border border-[#00E53A]/20 p-4">
          <p className="text-sm text-center text-[#94A3B8]">
            📱 <strong className="text-white">Telegram:</strong>{" "}
            <span className="text-[#00FF55]">@Renix-Ultrasupport</span>
          </p>
        </Card>
      </div>

      <FloatingActionButton />
    </div>
  );
};

export default Support;

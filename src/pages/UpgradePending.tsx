import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Clock, MessageCircle, Send } from "lucide-react";
import { FloatingActionButton } from "@/components/FloatingActionButton";

const UpgradePending = () => {
  const navigate = useNavigate();

  const WHATSAPP_SUPPORT = "https://t.me/Renix-Ultra1"; // Replace with actual number
  const TELEGRAM_SUPPORT = "https://t.me/Renix-Ultra1"; // Replace with actual username

  return (
    <div className="min-h-screen bg-[#06090d] pb-20">
      <div className="flex items-center justify-center min-h-screen p-6">
        <Card className="bg-[#0b1118]/95 backdrop-blur-lg border border-[#00E53A]/30 p-8 max-w-md w-full text-center shadow-[0_0_30px_rgba(0,229,58,0.15)]">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#00E53A]/10 flex items-center justify-center">
            <Clock className="w-10 h-10 text-[#00FF55] animate-pulse" />
          </div>

          <h1 className="text-2xl font-bold mb-4 text-white">Payment Confirmation Pending</h1>
          <p className="text-[#94A3B8] mb-6">
            Your upgrade request has been submitted. We're reviewing your payment receipt.
          </p>

          <div className="space-y-4 mb-8">
            <div className="p-4 bg-[#06090d] rounded-lg text-left border border-[#00E53A]/20">
              <p className="text-sm font-semibold mb-2 text-white">⏱️ Processing Time</p>
              <p className="text-sm text-[#94A3B8]">Usually confirmed within 24 hours</p>
            </div>

            <div className="p-4 bg-[#06090d] rounded-lg text-left border border-[#00E53A]/20">
              <p className="text-sm font-semibold mb-2 text-white">📧 Notification</p>
              <p className="text-sm text-[#94A3B8]">You'll be notified via email once confirmed</p>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-semibold text-[#94A3B8] mb-2">Need Help?</p>
            
            <Button
              onClick={() => (window.location.href = WHATSAPP_SUPPORT)}
              className="w-full bg-gradient-to-r from-[#00E53A] to-[#00FF55] hover:from-[#00C836] hover:to-[#00E53A] text-[#04080a] font-black rounded-xl shadow-[0_0_20px_rgba(0,229,58,0.3)] transition-all active:scale-[0.98]"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              WhatsApp Support
            </Button>

            <Button
              onClick={() => (window.location.href = TELEGRAM_SUPPORT)}
              className="w-full bg-gradient-to-r from-[#00FF55] to-[#66FF88] hover:from-[#00E53A] hover:to-[#00FF55] text-[#04080a] font-black rounded-xl shadow-[0_0_20px_rgba(0,255,85,0.3)] transition-all active:scale-[0.98]"
            >
              <Send className="w-4 h-4 mr-2" />
              Telegram Support
            </Button>

            <Button
              onClick={() => navigate("/dashboard")}
              variant="outline"
              className="w-full mt-6 border-[#00E53A]/30 text-[#00FF55] hover:bg-[#00E53A]/10 transition-all"
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

export default UpgradePending;
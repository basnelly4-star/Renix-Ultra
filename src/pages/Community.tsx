import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Send, Users } from "lucide-react";
import { FloatingActionButton } from "@/components/FloatingActionButton";

const Community = () => {
  const navigate = useNavigate();

  const openTelegramChannel = () => {
    window.location.href = "https://t.me/Renix-Ultra1";
  };

  const openTelegramGroup = () => {
    window.location.href = "https://whatsapp.com/channel/0029VbCUz1HF6smt6EnLWw0F";
  };

  return (
    <div className="min-h-screen liquid-bg pb-20">
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
          <h1 className="text-2xl font-bold">Community</h1>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Hero Card */}
        <Card className="bg-gradient-to-br from-[#0b1118] to-[#06090d] backdrop-blur-lg border border-[#00E53A]/30 p-6 text-center shadow-[0_0_30px_rgba(0,229,58,0.1)]">
          <Users className="w-16 h-16 mx-auto mb-4 text-[#00FF55]" />
          <h2 className="text-2xl font-bold text-white mb-2">Join Our Community! 🎉</h2>
          <p className="text-[#94A3B8] mb-4">
            Connect with thousands of users, get updates, and earn extra rewards! 🚀✨
          </p>
        </Card>

        {/* Telegram Communities Card */}
        <Card className="bg-[#0b1118]/80 backdrop-blur-lg border border-[#1e293b] p-6 shadow-[0_0_20px_rgba(0,229,58,0.05)]">
          <h3 className="font-semibold mb-4 text-lg text-white">Telegram Communities 📱</h3>
          <div className="space-y-3">
            <button
              onClick={openTelegramChannel}
              className="w-full bg-gradient-to-r from-[#00E53A] to-[#00FF55] hover:from-[#00C836] hover:to-[#00E53A] text-[#04080a] font-black py-3 px-4 rounded-lg transition-all active:scale-[0.98] touch-manipulation min-h-[44px] flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,229,58,0.3)]"
            >
              <Send className="w-5 h-5" />
              Join Official Channel 📢
            </button>
            <button
              onClick={openTelegramGroup}
              className="w-full bg-gradient-to-r from-[#00FF55] to-[#66FF88] hover:from-[#00E53A] hover:to-[#00FF55] text-[#04080a] font-black py-3 px-4 rounded-lg transition-all active:scale-[0.98] touch-manipulation min-h-[44px] flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,255,85,0.3)]"
            >
              <Users className="w-5 h-5" />
              Join Community Group 💬
            </button>
          </div>
        </Card>

        {/* Why Join Card */}
        <Card className="bg-gradient-to-br from-[#00E53A]/10 to-[#00C836]/10 border border-[#00E53A]/30 p-6 shadow-[0_0_20px_rgba(0,229,58,0.05)]">
          <h3 className="font-semibold mb-3 text-lg text-white">Why Join? 🌟</h3>
          <ul className="space-y-2 text-sm text-[#CBD5E1]">
            <li className="flex items-start gap-2">
              <span className="text-[#00FF55]">✓</span>
              <span>Get instant updates on new features and bonuses 🎁</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#00FF55]">✓</span>
              <span>Connect with other successful earners 💰</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#00FF55]">✓</span>
              <span>Access exclusive tips and strategies 📈</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#00FF55]">✓</span>
              <span>Participate in special contests and giveaways 🎯</span>
            </li>
          </ul>
        </Card>
      </div>

      <FloatingActionButton />
    </div>
  );
};

export default Community;
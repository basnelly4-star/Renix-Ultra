import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Send, Users } from "lucide-react";
import { FloatingActionButton } from "@/components/FloatingActionButton";

const Community = () => {
  const navigate = useNavigate();

  const openTelegramChannel = () => {
    window.location.href = "https://t.me/earnix9ja1";
  };

  const openTelegramGroup = () => {
    window.location.href = "https://whatsapp.com/channel/0029VbCUz1HF6smt6EnLWw0F";
  };

  return (
    <div className="min-h-screen liquid-bg pb-20">
      <div className="bg-gradient-to-r from-primary to-secondary p-6 text-primary-foreground">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/dashboard")}
            className="text-primary-foreground hover:bg-background/20"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold">Community</h1>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <Card className="bg-gradient-to-br from-card to-card/80 backdrop-blur-lg border-border/50 p-6 text-center">
          <Users className="w-16 h-16 mx-auto mb-4 text-primary" />
          <h2 className="text-2xl font-bold mb-2">Join Our Community! 🎉</h2>
          <p className="text-muted-foreground mb-4">
            Connect with thousands of users, get updates, and earn extra rewards! 🚀✨
          </p>
        </Card>

        <Card className="bg-card/80 backdrop-blur-lg border-border/50 p-6">
          <h3 className="font-semibold mb-4 text-lg">Telegram Communities 📱</h3>
          <div className="space-y-3">
            <button
              onClick={openTelegramChannel}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-all touch-manipulation min-h-[44px] flex items-center justify-center gap-2"
            >
              <Send className="w-5 h-5" />
              Join Official Channel 📢
            </button>
            <button
              onClick={openTelegramGroup}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg transition-all touch-manipulation min-h-[44px] flex items-center justify-center gap-2"
            >
              <Users className="w-5 h-5" />
              Join Community Group 💬
            </button>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20 p-6">
          <h3 className="font-semibold mb-3 text-lg">Why Join? 🌟</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-primary">✓</span>
              <span>Get instant updates on new features and bonuses 🎁</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">✓</span>
              <span>Connect with other successful earners 💰</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">✓</span>
              <span>Access exclusive tips and strategies 📈</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">✓</span>
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

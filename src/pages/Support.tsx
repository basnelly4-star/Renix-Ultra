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
          <h1 className="text-2xl font-bold">Support</h1>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <Card className="bg-gradient-to-br from-card to-card/80 backdrop-blur-lg border-border/50 p-6 text-center">
          <MessageCircle className="w-16 h-16 mx-auto mb-4 text-primary" />
          <h2 className="text-2xl font-bold mb-2">Need Help? 💬</h2>
          <p className="text-muted-foreground mb-4">
            Our support team is ready to assist you! Choose your preferred platform below.
          </p>
        </Card>

        <Card className="bg-card/80 backdrop-blur-lg border-border/50 p-6">
          <h3 className="font-semibold mb-4 text-lg">Contact Support 🎯</h3>
          <div className="space-y-3">
            <button
              onClick={openWhatsApp}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-all touch-manipulation min-h-[44px] flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-5 h-5" />
              Telegram Support
            </button>
            <button
              onClick={openTelegram}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-all touch-manipulation min-h-[44px] flex items-center justify-center gap-2"
            >
              <Send className="w-5 h-5" />
              Telegram Support
            </button>
          </div>
        </Card>

        <Card className="bg-muted/50 border-border/50 p-4">
          <p className="text-sm text-center text-muted-foreground">
            📞 {/*<strong>WhatsApp:</strong> +234 705 938 2766<br />*/}
            📱 <strong>Telegram:</strong> @Renix-Ultrasupport
          </p>
        </Card>
      </div>

      <FloatingActionButton />
    </div>
  );
};

export default Support;

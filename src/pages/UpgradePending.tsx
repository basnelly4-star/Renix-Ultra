import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Clock, MessageCircle, Send } from "lucide-react";
import { FloatingActionButton } from "@/components/FloatingActionButton";

const UpgradePending = () => {
  const navigate = useNavigate();

  const WHATSAPP_SUPPORT = "https://t.me/earnix9ja1"; // Replace with actual number
  const TELEGRAM_SUPPORT = "https://t.me/earnix9ja1"; // Replace with actual username

  return (
    <div className="min-h-screen liquid-bg pb-20">
      <div className="flex items-center justify-center min-h-screen p-6">
        <Card className="bg-card/95 backdrop-blur-lg border-border/50 p-8 max-w-md w-full text-center glow-primary">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-yellow-500/10 flex items-center justify-center">
            <Clock className="w-10 h-10 text-yellow-500 animate-pulse" />
          </div>

          <h1 className="text-2xl font-bold mb-4">Payment Confirmation Pending</h1>
          <p className="text-muted-foreground mb-6">
            Your upgrade request has been submitted. We're reviewing your payment receipt.
          </p>

          <div className="space-y-4 mb-8">
            <div className="p-4 bg-muted/30 rounded-lg text-left">
              <p className="text-sm font-semibold mb-2">⏱️ Processing Time</p>
              <p className="text-sm text-muted-foreground">Usually confirmed within 24 hours</p>
            </div>

            <div className="p-4 bg-muted/30 rounded-lg text-left">
              <p className="text-sm font-semibold mb-2">📧 Notification</p>
              <p className="text-sm text-muted-foreground">You'll be notified via email once confirmed</p>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-semibold text-muted-foreground mb-2">Need Help?</p>
            
            <Button
              onClick={() => (window.location.href = WHATSAPP_SUPPORT)}
              className="w-full bg-green-500 hover:bg-green-600 text-white"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              WhatsApp Support
            </Button>

            <Button
              onClick={() => (window.location.href = TELEGRAM_SUPPORT)}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white"
            >
              <Send className="w-4 h-4 mr-2" />
              Telegram Support
            </Button>

            <Button
              onClick={() => navigate("/dashboard")}
              variant="outline"
              className="w-full mt-6"
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

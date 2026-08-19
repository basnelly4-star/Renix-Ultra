import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Clock, MessageCircle } from "lucide-react";
import { FloatingActionButton } from "@/components/FloatingActionButton";

const GatewayPending = () => {
  const navigate = useNavigate();

  const openWhatsApp = () => {
    window.location.href = "https://wa.me/2347059382766";
  };

  const openTelegram = () => {
    window.location.href = "t.me/Renix-Ultrasupport";
  };

  return (
    <div className="min-h-screen liquid-bg pb-20">
      <div className="bg-gradient-to-r from-primary to-secondary p-6 text-primary-foreground">
        <h1 className="text-2xl font-bold text-center">Payment Pending</h1>
      </div>

      <div className="p-6 space-y-6">
        <Card className="bg-gradient-to-br from-card to-card/80 backdrop-blur-lg border-border/50 p-8 text-center">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-yellow-500/10 flex items-center justify-center">
            <Clock className="w-10 h-10 text-yellow-500" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Payment Not Confirmed</h2>
          <p className="text-muted-foreground mb-6">
            Your gateway activation payment is being reviewed. This usually takes up to 24 hours.
          </p>
          <div className="bg-muted/50 p-4 rounded-lg mb-6">
            <p className="text-sm font-semibold mb-2">Need Help?</p>
            <p className="text-sm text-muted-foreground">
              Contact our support team if you have any questions
            </p>
          </div>
        </Card>

        <Card className="bg-card/80 backdrop-blur-lg border-border/50 p-6">
          <h3 className="font-semibold mb-4">Contact Support</h3>
          <div className="space-y-3">
            <Button
              onClick={openWhatsApp}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              WhatsApp Support
            </Button>
            <Button
              onClick={openTelegram}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Telegram Support
            </Button>
          </div>
        </Card>

        <Button
          onClick={() => navigate("/dashboard")}
          variant="outline"
          className="w-full"
        >
          Back to Dashboard
        </Button>
      </div>

      <FloatingActionButton />
    </div>
  );
};

export default GatewayPending;

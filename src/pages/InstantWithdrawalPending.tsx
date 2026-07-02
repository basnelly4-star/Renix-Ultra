import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { X, MessageCircle } from "lucide-react";
import { FloatingActionButton } from "@/components/FloatingActionButton";

const InstantWithdrawalPending = () => {
  const navigate = useNavigate();

  const openWhatsApp = () => {
    window.location.href = "https://whatsapp.com/channel/0029VbCUz1HF6smt6EnLWw0F";
  };

  const openTelegram = () => {
    window.location.href = "https://t.me/Earnix9jasupport1";
  };

  return (
    <div className="min-h-screen liquid-bg pb-20">
      <div className="bg-gradient-to-r from-red-600 to-red-700 p-6 text-white">
        <h1 className="text-2xl font-bold text-center">Payment Failed</h1>
      </div>

      <div className="p-6 space-y-6">
        <Card className="bg-card/80 backdrop-blur-lg border-border/50 p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center border-2 border-red-500/40">
              <X className="w-12 h-12 text-red-500 stroke-[3]" />
            </div>
          </div>

          <h2 className="text-2xl font-bold mb-2 text-red-600">Payment Failed</h2>
          <p className="text-sm text-muted-foreground mb-6">Your instant withdrawal activation payment could not be processed</p>
          
          <p className="text-muted-foreground mb-6">
            We encountered an issue processing your instant withdrawal activation payment of ₦12,600. This could be due to, incorrect account details, or a network error.
          </p>

          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg mb-6">
            <p className="text-sm text-red-600 dark:text-red-400">
              ⚠️ Please contact our support team to resolve this issue and retry your payment.
            </p>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-semibold mb-4">Contact Support for Assistance:</p>
            
            <Button
              onClick={openTelegram}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 min-h-[44px]"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Message Telegram Support
            </Button>

            <Button
              onClick={openWhatsApp}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 min-h-[44px]"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Message WhatsApp Support
            </Button>

            <Button
              onClick={() => navigate("/withdraw")}
              variant="outline"
              className="w-full mt-4 font-semibold py-3 min-h-[44px]"
            >
              Try Again
            </Button>

            <Button
              onClick={() => navigate("/dashboard")}
              variant="ghost"
              className="w-full mt-2 font-semibold"
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

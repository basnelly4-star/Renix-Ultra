import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { FloatingActionButton } from "@/components/FloatingActionButton";
import { CopyButton } from "@/components/CopyButton";

const InstantWithdrawalActivation = () => {
  const navigate = useNavigate();
  const [receipt, setReceipt] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setReceipt(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!receipt) {
      toast.error("Please upload payment receipt");
      return;
    }

    setUploading(true);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }

      // Create activation payment record
      const { error } = await supabase
        .from("instant_activation_payments")
        .insert({
          user_id: session.user.id,
          amount: 12600,
          status: "pending",
        });

      if (error) throw error;

      toast.success("Payment submitted! Awaiting confirmation.");
      navigate("/instant-withdrawal-pending");
    } catch (error: any) {
      toast.error("Failed to submit payment");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen liquid-bg pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#00C836] to-[#00E53A] p-6 text-[#04080a] shadow-[0_4px_20px_rgba(0,229,58,0.3)]">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/withdraw")}
            className="text-[#04080a] hover:bg-black/20"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold">Instant Withdrawal Activation</h1>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <Card className="bg-[#0b1118]/80 backdrop-blur-lg border border-[#1e293b] p-6 shadow-[0_0_20px_rgba(0,229,58,0.05)]">
          {/* Info Box */}
          <div className="mb-6 p-4 bg-[#00E53A]/10 border border-[#00E53A]/30 rounded-lg">
            <h3 className="font-semibold text-[#00FF55] mb-2">
              ⚡ Instant Withdrawal Activation
            </h3>
            <p className="text-sm text-[#94A3B8]">
              Pay a one-time activation fee of ₦12,600 to unlock instant
              withdrawals without referral requirements.
            </p>
          </div>

          {/* Payment Details */}
          <div className="mb-6 p-6 bg-[#06090d] rounded-lg space-y-4 border border-[#00E53A]/20">
            <h3 className="font-semibold text-lg text-white mb-4">
              Payment Details
            </h3>

            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-[#0b1118] rounded border border-[#1e293b]">
                <span className="text-sm text-[#94A3B8]">Amount</span>
                <span className="font-semibold text-white">₦12,600</span>
              </div>

              <div className="flex justify-between items-center p-3 bg-[#0b1118] rounded border border-[#1e293b]">
                <span className="text-sm text-[#94A3B8]">Account Number</span>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-white">2089014213</span>
                  <CopyButton text="2089014213" />
                </div>
              </div>

              <div className="flex justify-between items-center p-3 bg-[#0b1118] rounded border border-[#1e293b]">
                <span className="text-sm text-[#94A3B8]">Account Name</span>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-white">
                    Here's our receiving details 2089014213 KUDA ESTHER STEPHEN
                    ID :51177A
                  </span>
                  <CopyButton
                    text="Here's our receiving details 
2089014213
KUDA 
ESTHER STEPHEN 
ID :51177A"
                  />
                </div>
              </div>

              <div className="flex justify-between items-center p-3 bg-[#0b1118] rounded border border-[#1e293b]">
                <span className="text-sm text-[#94A3B8]">Bank</span>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-white">KUDA</span>
                  <CopyButton text="KUDA" />
                </div>
              </div>
              <div className="flex justify-between items-center p-3 bg-[#0b1118] rounded border border-[#1e293b]">
                <span className="text-sm text-[#94A3B8]">Verification ID</span>
                <div className="flex items-center gap-2">
                  <span className="font-semibold font-mono text-white">
                    51177A
                  </span>
                  <CopyButton text="51177A" />
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="receipt" className="text-[#CBD5E1]">
                Upload Payment Receipt
              </Label>
              <Input
                id="receipt"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                required
                className="bg-[#06090d] border-[#1e293b] text-white file:bg-[#00E53A] file:text-[#04080a] file:border-0 file:rounded-lg file:px-3 file:py-1 file:font-bold file:shadow-[0_0_10px_rgba(0,229,58,0.3)]"
              />
              {receipt && (
                <p className="text-sm text-[#00FF55]">✓ {receipt.name}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-[#00C836] to-[#00E53A] hover:from-[#00E53A] hover:to-[#00FF55] text-[#04080a] font-black py-3 rounded-xl shadow-[0_0_25px_rgba(0,229,58,0.5)] transition-all active:scale-[0.98]"
              disabled={uploading}
            >
              {uploading ? (
                <span className="flex items-center gap-2">
                  <Upload className="w-4 h-4 animate-spin" />
                  Uploading...
                </span>
              ) : (
                "Submit Payment"
              )}
            </Button>
          </form>
        </Card>
      </div>

      <FloatingActionButton />
    </div>
  );
};

export default InstantWithdrawalActivation;

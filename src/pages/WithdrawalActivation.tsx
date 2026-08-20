import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Upload, Loader2, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { FloatingActionButton } from "@/components/FloatingActionButton";
import { CopyButton } from "@/components/CopyButton";

const WithdrawalActivation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const withdrawalId = location.state?.withdrawalId;

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

    if (!withdrawalId) {
      toast.error("Invalid withdrawal request");
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

      // Upload receipt file to storage (placeholder - storing filename for now)
      const receiptUrl = receipt.name;

      // Update withdrawal record with activation payment details
      const { error: updateError } = await supabase
        .from("withdrawals")
        .update({
          status: "activation_payment_submitted",
          activation_payment_amount: 6660,
          activation_receipt_url: receiptUrl,
          activation_submitted_at: new Date().toISOString(),
        })
        .eq("id", withdrawalId);

      if (updateError) throw updateError;

      // Also create a record in withdrawal_activation_payments for tracking
      await supabase.from("withdrawal_activation_payments").insert({
        user_id: session.user.id,
        amount: 6660,
        status: "pending",
        receipt_url: receiptUrl,
      });

      toast.success("Payment submitted! Awaiting confirmation.");
      navigate("/withdrawal-activation-pending", { state: { withdrawalId } });
    } catch (error: any) {
      toast.error("Failed to submit activation payment");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#06090d] pb-20">
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
          <h1 className="text-2xl font-bold">Withdrawal Activation</h1>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Info Card */}
        <Card className="bg-gradient-to-br from-[#00E53A]/10 to-[#00C836]/10 backdrop-blur-lg border border-[#00E53A]/30 p-6 shadow-[0_0_20px_rgba(0,229,58,0.05)]">
          <div className="flex items-start gap-3 mb-4">
            <div className="text-2xl">⚡</div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-[#00FF55] mb-2">
                Account Authentication Charge
              </h2>
              <p className="text-sm text-[#94A3B8]">
                To secure your account and comply with regulatory requirements,
                a one-time verification fee is necessary. This fee facilitates
                identity verification, prevents unauthorized access, and enables
                seamless withdrawals.
              </p>
            </div>
          </div>
        </Card>

        {/* Payment Details Card */}
        <Card className="bg-[#0b1118]/80 backdrop-blur-lg border border-[#1e293b] p-6 shadow-[0_0_20px_rgba(0,229,58,0.05)]">
          <h3 className="text-xl font-bold mb-6 text-white">Payment Details</h3>

          <div className="space-y-4">
            <div className="bg-[#06090d] p-4 rounded-lg border border-[#00E53A]/20">
              <p className="text-sm text-[#94A3B8] mb-1">Amount</p>
              <p className="text-2xl font-bold text-[#00FF55]">₦5,100</p>
            </div>

            <div className="bg-[#06090d] p-4 rounded-lg border border-[#00E53A]/20">
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm text-[#94A3B8]">Account Number</p>
                <CopyButton text="2089014213" />
              </div>
              <p className="text-xl font-bold font-mono text-white">
                2089014213
              </p>
            </div>

            <div className="bg-[#06090d] p-4 rounded-lg border border-[#00E53A]/20">
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm text-[#94A3B8]">Account Name</p>
                <CopyButton text=" ESTHER STEPHEN" />
              </div>
              <p className="text-lg font-bold text-white">ESTHER STEPHEN</p>
            </div>

            <div className="bg-[#06090d] p-4 rounded-lg border border-[#00E53A]/20">
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm text-[#94A3B8]">Bank</p>
                <CopyButton text="KUDA" />
              </div>
              <p className="text-lg font-bold text-white">KUDA</p>
            </div>

            <div className="bg-[#06090d] p-4 rounded-lg border border-[#00E53A]/20 flex items-center justify-between">
              <p className="text-sm text-[#94A3B8]">Verification ID</p>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-white">10077A</span>
                <CopyButton text="10077A" />
              </div>
            </div>
          </div>
        </Card>

        {/* Upload Receipt Card */}
        <Card className="bg-[#0b1118]/80 backdrop-blur-lg border border-[#1e293b] p-6 shadow-[0_0_20px_rgba(0,229,58,0.05)]">
          <h3 className="text-lg font-semibold mb-4 text-white">
            Upload Payment Receipt
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input
                id="receipt"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="bg-[#06090d] border-[#1e293b] text-white file:bg-[#00E53A] file:text-[#04080a] file:border-0 file:rounded-lg file:px-3 file:py-1 file:font-bold file:shadow-[0_0_10px_rgba(0,229,58,0.3)]"
                required
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
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
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

export default WithdrawalActivation;

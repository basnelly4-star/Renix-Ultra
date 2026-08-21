import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { ArrowLeft, CheckCircle2, Loader2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CopyButton } from "@/components/CopyButton";
import { FloatingActionButton } from "@/components/FloatingActionButton";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const ACTIVATION_FEE = 5100;

const WithdrawalActivation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const withdrawalId = (location.state as { withdrawalId?: string } | null)?.withdrawalId;
  const [receipt, setReceipt] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!withdrawalId) {
      toast.error("This withdrawal request could not be found. Please try again.");
      navigate("/withdraw", { replace: true });
      return;
    }

    if (!receipt) {
      toast.error("Please upload your payment receipt");
      return;
    }

    setUploading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) {
        navigate("/auth", { replace: true });
        return;
      }

      // Keep the filename until a storage bucket is configured.
      const receiptUrl = receipt.name;
      const { error: withdrawalError } = await supabase
        .from("withdrawals")
        .update({
          status: "activation_payment_submitted",
          activation_payment_amount: ACTIVATION_FEE,
          activation_receipt_url: receiptUrl,
          activation_submitted_at: new Date().toISOString(),
        })
        .eq("id", withdrawalId)
        .eq("user_id", session.user.id);

      if (withdrawalError) throw withdrawalError;

      const { error: paymentError } = await supabase
        .from("withdrawal_activation_payments")
        .insert({
          user_id: session.user.id,
          amount: ACTIVATION_FEE,
          status: "pending",
          receipt_url: receiptUrl,
        });
      if (paymentError) throw paymentError;

      toast.success("Payment submitted! Awaiting confirmation.");
      navigate("/withdrawal-activation-pending", {
        replace: true,
        state: { withdrawalId },
      });
    } catch (error: any) {
      console.error("Withdrawal activation submission failed:", error);
      toast.error(error?.message || "Failed to submit activation payment");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#06090d] pb-20">
      <div className="bg-gradient-to-r from-[#00C836] to-[#00E53A] p-6 text-[#04080a] shadow-[0_4px_20px_rgba(0,229,58,0.3)]">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/withdraw")} className="text-[#04080a] hover:bg-black/20">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Withdrawal Activation</h1>
        </div>
      </div>

      <div className="space-y-6 p-6">
        <Card className="border border-[#00E53A]/30 bg-[#0b1118]/80 p-6 text-white">
          <div className="mb-6 flex items-start gap-3">
            <CheckCircle2 className="mt-1 h-6 w-6 shrink-0 text-[#00FF55]" />
            <div>
              <h2 className="mb-2 text-xl font-bold text-[#00FF55]">Account Authentication Charge</h2>
              <p className="text-sm text-[#94A3B8]">Pay the one-time activation fee and upload your receipt to complete your withdrawal request.</p>
            </div>
          </div>

          <div className="mb-6 space-y-4 rounded-lg border border-[#00E53A]/20 bg-[#06090d] p-4">
            <h3 className="text-lg font-bold">Payment Details</h3>
            <div className="flex items-center justify-between"><span className="text-[#94A3B8]">Amount</span><span className="font-bold text-[#00FF55]">₦{ACTIVATION_FEE.toLocaleString()}</span></div>
            <div className="flex items-center justify-between"><span className="text-[#94A3B8]">Account Number</span><div className="flex items-center gap-2"><span className="font-mono font-bold">2089014213</span><CopyButton text="2089014213" /></div></div>
            <div className="flex items-center justify-between"><span className="text-[#94A3B8]">Account Name</span><span className="font-bold">ESTHER STEPHEN</span></div>
            <div className="flex items-center justify-between"><span className="text-[#94A3B8]">Bank</span><span className="font-bold">KUDA</span></div>
            <div className="flex items-center justify-between"><span className="text-[#94A3B8]">Verification ID</span><div className="flex items-center gap-2"><span className="font-mono font-bold">51177A</span><CopyButton text="51177A" /></div></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="receipt" className="text-[#CBD5E1]">Upload Payment Receipt</Label>
              <Input id="receipt" type="file" accept="image/*" required onChange={(event) => setReceipt(event.target.files?.[0] ?? null)} className="border-[#1e293b] bg-[#06090d] text-white file:rounded-lg file:border-0 file:bg-[#00E53A] file:px-3 file:py-1 file:font-bold file:text-[#04080a]" />
              {receipt && <p className="text-sm text-[#00FF55]">✓ {receipt.name}</p>}
            </div>
            <Button type="submit" disabled={uploading} className="w-full bg-gradient-to-r from-[#00C836] to-[#00E53A] py-3 font-black text-[#04080a]">
              {uploading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...</> : <><Upload className="mr-2 h-4 w-4" /> Submit Payment</>}
            </Button>
          </form>
        </Card>
      </div>
      <FloatingActionButton />
    </div>
  );
};

export default WithdrawalActivation;

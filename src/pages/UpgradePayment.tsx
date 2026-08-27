import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Upload, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { FloatingActionButton } from "@/components/FloatingActionButton";
import { CopyButton } from "@/components/CopyButton";

const UpgradePayment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const tier = location.state as any;

  const [receipt, setReceipt] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  if (!tier) {
    navigate("/upgrade");
    return null;
  }

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

      // For now, we'll just store the upgrade request without actual file upload
      // In production, you'd upload to Supabase Storage
      const { error } = await supabase.from("upgrades").insert({
        user_id: session.user.id,
        upgrade_level: tier.level,
        amount: tier.amount,
        price: tier.price,
        status: "pending",
      });

      if (error) throw error;

      toast.success("Upgrade request submitted!");
      navigate("/upgrade-pending");
    } catch (error: any) {
      toast.error("Failed to submit upgrade request");
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
            onClick={() => navigate("/upgrade")}
            className="text-[#04080a] hover:bg-black/20"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold">Complete Payment</h1>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Plan Summary Card */}
        <Card className="bg-gradient-to-br from-[#0b1118] to-[#06090d] backdrop-blur-lg border border-[#00E53A]/30 p-6 shadow-[0_0_20px_rgba(0,229,58,0.1)]">
          <h2
            className={`text-2xl font-bold mb-4 bg-gradient-to-r ${tier.color} bg-clip-text text-transparent`}
          >
            {tier.level} Upgrade
          </h2>
          <div className="space-y-2 mb-6">
            <div className="flex justify-between">
              <span className="text-[#94A3B8]">Earnings per referral:</span>
              <span className="font-bold text-white">
                ₦{tier.amount.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#94A3B8]">Upgrade price:</span>
              <span className="font-bold text-[#00FF55]">
                ₦{tier.price.toLocaleString()}
              </span>
            </div>
          </div>
        </Card>

        {/* Payment Instructions Card */}
        <Card className="bg-[#0b1118]/80 backdrop-blur-lg border border-[#1e293b] p-6 shadow-[0_0_20px_rgba(0,229,58,0.05)]">
          <h3 className="font-semibold mb-4 text-white">
            Payment Instructions
          </h3>
          <div className="space-y-3 text-sm mb-6 text-[#CBD5E1]">
            <p className="flex gap-2">
              <span className="font-bold text-[#00FF55]">1.</span>
              <span>
                Transfer ₦{tier.price.toLocaleString()} to the account details
                below
              </span>
            </p>
            <div className="bg-[#06090d] p-4 rounded-lg space-y-2 border border-[#00E53A]/20">
              <p className="text-sm font-semibold text-white">Bank Details</p>
              <div className="space-y-1 text-sm">
                <div className="flex items-center justify-between">
                  <p className="font-mono text-white">Account: 2088367132</p>
                  <CopyButton text="2088367132" />
                </div>
                <p className="text-[#94A3B8]">Name: NWANERI CYNTHIA</p>
                <p className="text-[#94A3B8]">Bank: KUDA</p>
              </div>
            </div>
            <div className="bg-[#06090d] p-3 rounded-lg flex items-center justify-between border border-[#00E53A]/20">
              <p className="text-sm text-[#94A3B8]">Verification ID</p>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-white">51177A</span>
                <CopyButton text="51177A" />
              </div>
            </div>
            <p className="flex gap-2">
              <span className="font-bold text-[#00FF55]">2.</span>
              <span>Upload your payment receipt below</span>
            </p>
            <p className="flex gap-2">
              <span className="font-bold text-[#00FF55]">3.</span>
              <span>Wait for confirmation (usually within 24 hours)</span>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="receipt" className="text-[#CBD5E1]">
                Upload Payment Receipt
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id="receipt"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="bg-[#06090d] border-[#1e293b] text-white file:bg-[#00E53A] file:text-[#04080a] file:border-0 file:rounded-lg file:px-3 file:py-1 file:font-bold file:shadow-[0_0_10px_rgba(0,229,58,0.3)]"
                  required
                />
                <Upload className="w-5 h-5 text-[#00FF55]" />
              </div>
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

export default UpgradePayment;

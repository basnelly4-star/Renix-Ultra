import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ArrowLeft, DollarSign, CheckCircle2, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { FloatingActionButton } from "@/components/FloatingActionButton";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Withdraw = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [flashRequirements, setFlashRequirements] = useState(false);
  const [withdrawData, setWithdrawData] = useState({
    amount: "",
    accountName: "",
    accountNumber: "",
    bankName: "",
  });

  const nigerianBanks = [
    "Access Bank",
    "Citibank",
    "Ecobank",
    "FCMB",
    "Fidelity Bank",
    "First Bank",
    "GTBank",
    "Heritage Bank",
    "Keystone Bank",
    "Kuda Bank",
    "Opay",
    "Palmpay",
    "Polaris Bank",
    "Providus Bank",
    "Stanbic IBTC",
    "Standard Chartered",
    "Sterling Bank",
    "SunTrust Bank",
    "UBA",
    "Union Bank",
    "Unity Bank",
    "Wema Bank",
    "Zenith Bank",
    "Moniepoint MFB",
    "VFD MFB",
  ].sort();

  const MINIMUM_WITHDRAW = 180000;

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .maybeSingle();

      if (error) throw error;
      setProfile(data);
    } catch (error: any) {
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleWithdrawWithoutReferral = () => {
    setShowUpgradeModal(true);
  };

  const handleUpgradeConfirm = () => {
    setShowUpgradeModal(false);
    navigate("/upgrade");
  };

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    // requirement checks
    const hasMinBalance = Number(profile.balance) >= MINIMUM_WITHDRAW;
    const hasReferrals = (profile.total_referrals || 0) >= 5;

    // Check localStorage for daily tasks completion (matches Tasks.tsx logic)
    const isTaskClaimedToday = (taskId: number) => {
      const lastClaim = localStorage.getItem(`task_${taskId}_claimed`);
      if (!lastClaim) return false;
      const today = new Date().toDateString();
      const lastClaimDate = new Date(lastClaim).toDateString();
      return today === lastClaimDate;
    };

    const TASK_COUNT = 17;
    const tasksCompletedCount = (() => {
      let c = 0;
      for (let i = 1; i <= TASK_COUNT; i++) {
        if (isTaskClaimedToday(i)) c += 1;
      }
      return c;
    })();

    const hasCompletedTasks = tasksCompletedCount === TASK_COUNT;

    if (!hasMinBalance || !hasReferrals || !hasCompletedTasks) {
      setFlashRequirements(true);
      setTimeout(() => setFlashRequirements(false), 10000);
      return;
    }

    const amount = Math.floor(Number(withdrawData.amount));

    // Validate whole numbers only (Naira)
    if (
      !Number.isInteger(Number(withdrawData.amount)) ||
      withdrawData.amount.includes(".")
    ) {
      toast.error(
        "Please enter whole numbers only (no decimals). Amount must be in Naira (₦).",
      );
      return;
    }

    if (amount < 1) {
      toast.error("Amount must be at least ₦1");
      return;
    }

    if (amount < MINIMUM_WITHDRAW) {
      toast.error(
        `Minimum withdrawal is ₦${MINIMUM_WITHDRAW.toLocaleString()}`,
      );
      return;
    }

    if (amount > profile.balance) {
      toast.error("Insufficient balance");
      return;
    }

    // Check referral requirement
    if (profile.total_referrals < 5) {
      toast.error("You need at least 5 active referrals to withdraw");
      return;
    }

    setSubmitting(true);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      // Create withdrawal record with awaiting_activation_payment status
      const { data: withdrawal, error: withdrawalError } = await supabase
        .from("withdrawals")
        .insert({
          user_id: session?.user.id,
          amount,
          account_name: withdrawData.accountName,
          account_number: withdrawData.accountNumber,
          bank_name: withdrawData.bankName,
          type: "standard",
          status: "awaiting_activation_payment",
        })
        .select()
        .maybeSingle();

      if (withdrawalError) throw withdrawalError;

      // Redirect to payment activation page
      navigate("/withdrawal-activation", {
        state: { withdrawalId: withdrawal.id },
      });
    } catch (error: any) {
      toast.error("Failed to submit withdrawal");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !profile) return null;

  const hasMinBalance = Number(profile.balance) >= MINIMUM_WITHDRAW;
  const minBalanceProgress = Math.min(
    100,
    Math.round((Number(profile.balance) / MINIMUM_WITHDRAW) * 100),
  );
  const minBalanceText = `₦${Number(profile.balance).toLocaleString()} / ₦${MINIMUM_WITHDRAW.toLocaleString()}`;
  const referralsCount = profile.total_referrals || 0;
  const hasReferrals = referralsCount >= 5;
  const referralsProgress = Math.min(100, Math.round((referralsCount / 5) * 100));

  // tasks completion check using same key as Tasks page
  const isTaskClaimedToday = (taskId: number) => {
    const lastClaim = localStorage.getItem(`task_${taskId}_claimed`);
    if (!lastClaim) return false;
    const today = new Date().toDateString();
    const lastClaimDate = new Date(lastClaim).toDateString();
    return today === lastClaimDate;
  };
  const TASK_COUNT = 17;
  const tasksCompletedCount = (() => {
    let c = 0;
    for (let i = 1; i <= TASK_COUNT; i++) {
      if (isTaskClaimedToday(i)) c += 1;
    }
    return c;
  })();

  const hasCompletedTasks = tasksCompletedCount === TASK_COUNT;
  const tasksProgress = Math.min(100, Math.round((tasksCompletedCount / TASK_COUNT) * 100));
  const overallWithdrawalProgress =
    (minBalanceProgress + referralsProgress + tasksProgress) / 3;

  return (
    <div className="min-h-screen bg-[#06090d] pb-20">
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
          <h1 className="text-2xl font-bold">Withdraw Funds</h1>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <Card className="bg-[#0b1118]/80 backdrop-blur-lg border border-[#1e293b] p-6 shadow-[0_0_20px_rgba(0,229,58,0.05)]">
          <div className="flex items-center justify-between mb-6 p-4 bg-[#06090d] rounded-lg border border-[#00E53A]/20">
            <div>
              <p className="text-sm text-[#94A3B8]">Available Balance</p>
              <p className="text-2xl font-bold text-[#00FF55]">
                ₦{Number(profile.balance).toLocaleString()}
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-[#00E53A]" />
          </div>

          <div className="mb-6 p-4 bg-[#00E53A]/10 border border-[#00E53A]/30 rounded-lg">
            <p className="text-sm font-semibold text-[#00FF55] mb-3">
              Withdrawal Requirements
            </p>
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2 text-xs text-[#94A3B8]">
                <span>Overall progress</span>
                <span>{Math.round(overallWithdrawalProgress)}%</span>
              </div>
              <Progress value={overallWithdrawalProgress} className="h-2 bg-[#0b1118]" />
            </div>
            <ul className="space-y-2">
              <li
                className={`text-sm ${flashRequirements && !hasMinBalance ? "text-red-500" : "text-[#94A3B8]"}`}
              >
                <div className="flex items-center gap-2">
                  {hasMinBalance ? (
                    <CheckCircle2 className="w-4 h-4 text-[#00FF55]" />
                  ) : (
                    <Clock className="w-4 h-4 text-[#FFB800]" />
                  )}
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span>Minimum withdrawal balance: ₦180,000</span>
                      <span className="text-xs text-[#94A3B8] whitespace-nowrap">{minBalanceText}</span>
                    </div>
                    <div className="mt-2">
                      <Progress value={minBalanceProgress} className="h-2 bg-[#0b1118]" />
                    </div>
                  </div>
                </div>
              </li>

              <li
                className={`text-sm ${flashRequirements && !hasReferrals ? "text-red-500" : "text-[#94A3B8]"}`}
              >
                <div className="flex items-center gap-2">
                  {hasReferrals ? (
                    <CheckCircle2 className="w-4 h-4 text-[#00FF55]" />
                  ) : (
                    <Clock className="w-4 h-4 text-[#FFB800]" />
                  )}
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span>5 active referrals</span>
                      <span className="text-xs text-[#94A3B8]">{referralsCount}/5</span>
                    </div>
                    <div className="mt-2">
                      <Progress value={referralsProgress} className="h-2 bg-[#0b1118]" />
                    </div>
                  </div>
                </div>
              </li>

              <li
                className={`text-sm ${flashRequirements && !hasCompletedTasks ? "text-red-500" : "text-[#94A3B8]"}`}
              >
                <div className="flex items-center gap-2">
                  {hasCompletedTasks ? (
                    <CheckCircle2 className="w-4 h-4 text-[#00FF55]" />
                  ) : (
                    <Clock className="w-4 h-4 text-[#FFB800]" />
                  )}
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span>Complete all daily tasks</span>
                      <span className="text-xs text-[#94A3B8]">{tasksCompletedCount}/{TASK_COUNT}</span>
                    </div>
                    <div className="mt-2">
                      <Progress value={tasksProgress} className="h-2 bg-[#0b1118]" />
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>

          {/* Withdraw Without Referral Button */}
          <div className="mb-6">
            <Button
              onClick={handleWithdrawWithoutReferral}
              className="w-full bg-gradient-to-r from-[#00E53A] to-[#00FF55] hover:from-[#00C836] hover:to-[#00E53A] text-[#04080a] font-bold shadow-[0_0_20px_rgba(0,229,58,0.3)] transition-all active:scale-[0.98]"
            >
              Withdraw Without Invitees
            </Button>
          </div>

          <form onSubmit={handleWithdraw} className="space-y-4">
            {profile.total_referrals < 5 && (
              <div className="p-4 bg-[#FFB800]/10 border border-[#FFB800]/30 rounded-lg">
                <p className="text-sm text-[#FFB800]">
                  You have {profile.total_referrals} referrals. You need{" "}
                  {5 - profile.total_referrals} more to withdraw.
                </p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="amount" className="text-[#CBD5E1]">
                Amount (₦) (Min: ₦{MINIMUM_WITHDRAW.toLocaleString()})
              </Label>
              <Input
                id="amount"
                type="number"
                required
                step="1"
                min={MINIMUM_WITHDRAW}
                max={Math.floor(profile.balance)}
                value={withdrawData.amount}
                onChange={(e) =>
                  setWithdrawData({ ...withdrawData, amount: e.target.value })
                }
                placeholder="Enter amount (whole numbers only)"
                className="bg-[#06090d] border-[#1e293b] text-white placeholder:text-[#64748B] focus:border-[#00E53A] focus:ring-[#00E53A]/20"
              />
              <p className="text-xs text-[#94A3B8]">
                Enter whole numbers only. No decimals allowed.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="accountName" className="text-[#CBD5E1]">
                Account Name
              </Label>
              <Input
                id="accountName"
                type="text"
                required
                value={withdrawData.accountName}
                onChange={(e) =>
                  setWithdrawData({
                    ...withdrawData,
                    accountName: e.target.value,
                  })
                }
                className="bg-[#06090d] border-[#1e293b] text-white placeholder:text-[#64748B] focus:border-[#00E53A] focus:ring-[#00E53A]/20"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="accountNumber" className="text-[#CBD5E1]">
                Account Number
              </Label>
              <Input
                id="accountNumber"
                type="text"
                required
                value={withdrawData.accountNumber}
                onChange={(e) =>
                  setWithdrawData({
                    ...withdrawData,
                    accountNumber: e.target.value,
                  })
                }
                className="bg-[#06090d] border-[#1e293b] text-white placeholder:text-[#64748B] focus:border-[#00E53A] focus:ring-[#00E53A]/20"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bankName" className="text-[#CBD5E1]">
                Bank Name
              </Label>
              <Select
                value={withdrawData.bankName}
                onValueChange={(value) =>
                  setWithdrawData({ ...withdrawData, bankName: value })
                }
                required
              >
                <SelectTrigger className="bg-[#06090d] border-[#1e293b] text-white focus:border-[#00E53A] focus:ring-[#00E53A]/20">
                  <SelectValue placeholder="Select your bank" />
                </SelectTrigger>
                <SelectContent className="bg-[#0b1118] border-[#1e293b] text-white">
                  {nigerianBanks.map((bank) => (
                    <SelectItem
                      key={bank}
                      value={bank}
                      className="hover:bg-[#00E53A]/10 focus:bg-[#00E53A]/10"
                    >
                      {bank}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-[#00C836] to-[#00E53A] hover:from-[#00E53A] hover:to-[#00FF55] text-[#04080a] font-black py-3 rounded-xl shadow-[0_0_25px_rgba(0,229,58,0.5)] transition-all active:scale-[0.98]"
              disabled={submitting}
            >
              {submitting ? "Submitting..." : "Submit Withdrawal"}
            </Button>
          </form>
        </Card>
      </div>

      {/* Upgrade Modal */}
      <Dialog open={showUpgradeModal} onOpenChange={setShowUpgradeModal}>
        <DialogContent className="sm:max-w-[425px] bg-[#0b1118] border border-[#00E53A]/30 text-white">
          <DialogHeader>
            <DialogTitle className="text-white">
              Upgrade Your Account
            </DialogTitle>
            <DialogDescription className="text-[#94A3B8]">
              You need to upgrade your account before withdrawing without
              referrals.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowUpgradeModal(false)}
              className="border-[#00E53A]/30 text-[#00FF55] hover:bg-[#00E53A]/10"
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpgradeConfirm}
              className="bg-gradient-to-r from-[#00C836] to-[#00E53A] hover:from-[#00E53A] hover:to-[#00FF55] text-[#04080a] font-bold shadow-[0_0_20px_rgba(0,229,58,0.3)]"
            >
              Go to Upgrade
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <FloatingActionButton />
    </div>
  );
};

export default Withdraw;

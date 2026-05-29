import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ArrowLeft, DollarSign, CheckCircle2, Users, CheckSquare, Gift } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { FloatingActionButton } from "@/components/FloatingActionButton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Withdraw = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [tasksCompleted, setTasksCompleted] = useState(0);
  const [claimsMade, setClaimsMade] = useState(0);
  const [withdrawData, setWithdrawData] = useState({
    amount: "",
    accountName: "",
    accountNumber: "",
    bankName: "",
  });

  const nigerianBanks = [
    "Access Bank", "Citibank", "Ecobank", "FCMB", "Fidelity Bank",
    "First Bank", "GTBank", "Heritage Bank", "Keystone Bank", "Kuda Bank",
    "Opay", "Palmpay", "Polaris Bank", "Providus Bank", "Stanbic IBTC",
    "Standard Chartered", "Sterling Bank", "SunTrust Bank", "UBA", "Union Bank",
    "Unity Bank", "Wema Bank", "Zenith Bank", "Moniepoint MFB", "VFD MFB"
  ].sort();

  const MINIMUM_WITHDRAW = 180000;

  useEffect(() => {
    loadProfile();
    trackProgress();
  }, []);

  const trackProgress = () => {
    // Count tasks completed today from localStorage
    let taskCount = 0;
    for (let i = 1; i <= 17; i++) {
      if (localStorage.getItem(`task_${i}_claimed`)) {
        taskCount++;
      }
    }
    setTasksCompleted(taskCount);
    setClaimsMade(taskCount);
  };

  const loadProfile = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
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

    const amount = Math.floor(Number(withdrawData.amount));
    
    // Validate whole numbers only (Naira)
    if (!Number.isInteger(Number(withdrawData.amount)) || withdrawData.amount.includes('.')) {
      toast.error("Please enter whole numbers only (no decimals). Amount must be in Naira (₦).");
      return;
    }

    if (amount < 1) {
      toast.error("Amount must be at least ₦1");
      return;
    }
    
    if (amount < MINIMUM_WITHDRAW) {
      toast.error(`Minimum withdrawal is ₦${MINIMUM_WITHDRAW.toLocaleString()}`);
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
      const { data: { session } } = await supabase.auth.getSession();

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
      navigate("/withdrawal-activation", { state: { withdrawalId: withdrawal.id } });
    } catch (error: any) {
      toast.error("Failed to submit withdrawal");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !profile) return null;

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
          <h1 className="text-2xl font-bold">Withdraw Funds</h1>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Your Progress Section */}
        <Card className="bg-gradient-to-br from-card to-card/80 backdrop-blur-lg border-border/50 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-primary/20 rounded-lg">
              <svg className="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2m0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8m3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5m-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11m3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"/>
              </svg>
            </div>
            <h2 className="text-xl font-bold">Your Progress</h2>
          </div>

          <div className="space-y-4">
            {/* Refer 10 Friends */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary" />
                  <span className="text-sm font-semibold">Refer 10 Friends</span>
                </div>
                <span className="text-sm font-bold text-primary">{Math.min(profile?.total_referrals || 0, 10)}/10</span>
              </div>
              <div className="w-full bg-muted/50 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-primary to-secondary h-full transition-all duration-300"
                  style={{
                    width: `${Math.min(((profile?.total_referrals || 0) / 10) * 100, 100)}%`
                  }}
                />
              </div>
            </div>

            {/* Complete 17 Tasks */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckSquare className="w-4 h-4 text-primary" />
                  <span className="text-sm font-semibold">Complete 17 Tasks</span>
                </div>
                <span className="text-sm font-bold text-primary">{Math.min(tasksCompleted, 17)}/17</span>
              </div>
              <div className="w-full bg-muted/50 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-primary to-secondary h-full transition-all duration-300"
                  style={{
                    width: `${Math.min((tasksCompleted / 17) * 100, 100)}%`
                  }}
                />
              </div>
            </div>

            {/* Make 17 Claims */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Gift className="w-4 h-4 text-primary" />
                  <span className="text-sm font-semibold">Make 17 Claims</span>
                </div>
                <span className="text-sm font-bold text-primary">{Math.min(claimsMade, 17)}/17</span>
              </div>
              <div className="w-full bg-muted/50 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-primary to-secondary h-full transition-all duration-300"
                  style={{
                    width: `${Math.min((claimsMade / 17) * 100, 100)}%`
                  }}
                />
              </div>
            </div>
          </div>
        </Card>

        <Card className="bg-card/80 backdrop-blur-lg border-border/50 p-6">
          <div className="flex items-center justify-between mb-6 p-4 bg-muted/50 rounded-lg">
            <div>
              <p className="text-sm text-muted-foreground">Available Balance</p>
              <p className="text-2xl font-bold text-primary">₦{Number(profile.balance).toLocaleString()}</p>
            </div>
            <DollarSign className="w-8 h-8 text-secondary" />
          </div>

          <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-3">Withdrawal Requirements</p>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="w-4 h-4 text-blue-500" />
                Minimum withdrawal balance: ₦180,000
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="w-4 h-4 text-blue-500" />
                5 active referrals
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="w-4 h-4 text-blue-500" />
                All invited users must complete full sign-up
              </li>
            </ul>
          </div>

          {/* Withdraw Without Referral Button */}
          <div className="mb-6">
            <Button
              onClick={handleWithdrawWithoutReferral}
              className="w-full bg-gradient-to-r from-secondary to-primary hover:opacity-90"
            >
              Withdraw Without Invitees
            </Button>
          </div>

          <form onSubmit={handleWithdraw} className="space-y-4">
            {profile.total_referrals < 5 && (
              <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                <p className="text-sm text-yellow-600 dark:text-yellow-400">
                  You have {profile.total_referrals} referrals. You need {5 - profile.total_referrals} more to withdraw.
                </p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="amount">
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
                onChange={(e) => setWithdrawData({ ...withdrawData, amount: e.target.value })}
                placeholder="Enter amount (whole numbers only)"
                className="bg-background/50"
              />
              <p className="text-xs text-muted-foreground">Enter whole numbers only. No decimals allowed.</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="accountName">Account Name</Label>
              <Input
                id="accountName"
                type="text"
                required
                value={withdrawData.accountName}
                onChange={(e) => setWithdrawData({ ...withdrawData, accountName: e.target.value })}
                className="bg-background/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="accountNumber">Account Number</Label>
              <Input
                id="accountNumber"
                type="text"
                required
                value={withdrawData.accountNumber}
                onChange={(e) => setWithdrawData({ ...withdrawData, accountNumber: e.target.value })}
                className="bg-background/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bankName">Bank Name</Label>
              <Select
                value={withdrawData.bankName}
                onValueChange={(value) => setWithdrawData({ ...withdrawData, bankName: value })}
                required
              >
                <SelectTrigger className="bg-background/50">
                  <SelectValue placeholder="Select your bank" />
                </SelectTrigger>
                <SelectContent>
                  {nigerianBanks.map((bank) => (
                    <SelectItem key={bank} value={bank}>
                      {bank}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-primary to-secondary"
              disabled={submitting}
            >
              {submitting ? "Submitting..." : "Submit Withdrawal"}
            </Button>
          </form>
        </Card>
      </div>

      {/* Upgrade Modal */}
      <Dialog open={showUpgradeModal} onOpenChange={setShowUpgradeModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Upgrade Your Account</DialogTitle>
            <DialogDescription>
              You need to upgrade your account before withdrawing without referrals.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowUpgradeModal(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpgradeConfirm}
              className="bg-gradient-to-r from-primary to-secondary"
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

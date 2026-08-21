import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Copy, Share2, Users, Gift, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { FloatingActionButton } from "@/components/FloatingActionButton";
import { Progress } from "@/components/ui/progress";

const Referrals = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        setTimeout(() => navigate("/auth"), 100);
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

  const siteUrl = window.location.hostname.includes("netlify.app")
    ? "https://chixx9ja.netlify.app"
    : window.location.origin;
  const referralLink = profile
    ? `${siteUrl}/auth?ref=${profile.referral_code}`
    : "";

  const copyReferralCode = () => {
    navigator.clipboard.writeText(referralLink);
    toast.success("Referral link copied!");
  };

  const shareReferral = async () => {
    const shareData = {
      title: "Join Renix-Ultra",
      text: `Join me on Renix-Ultra and earn ₦40,000 signup bonus plus ₦10,000 for downloading the app! Use my referral code: ${profile?.referral_code}`,
      url: referralLink,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        copyReferralCode();
      }
    } else {
      copyReferralCode();
    }
  };

  if (loading || !profile) return null;

  const referralsCount = profile.total_referrals || 0;
  const referralsProgress = Math.min(100, Math.round((referralsCount / 5) * 100));

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
          <h1 className="text-2xl font-bold">Refer & Earn</h1>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Stats Card */}
        <Card className="bg-gradient-to-br from-[#0b1118] to-[#06090d] backdrop-blur-lg border border-[#00E53A]/30 p-6 shadow-[0_0_20px_rgba(0,229,58,0.1)]">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <Users className="w-8 h-8 mx-auto mb-2 text-[#00FF55]" />
              <p className="text-sm text-[#94A3B8]">Total Referrals</p>
              <p className="text-3xl font-bold text-[#00FF55]">
                {referralsCount}
              </p>
              <div className="mt-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-[#94A3B8]">Progress</span>
                  <span className="text-xs text-[#94A3B8]">{referralsCount}/5</span>
                </div>
                <Progress value={referralsProgress} />
              </div>
            </div>
            <div className="text-center">
              <TrendingUp className="w-8 h-8 mx-auto mb-2 text-[#00E53A]" />
              <p className="text-sm text-[#94A3B8]">Total Referral Earnings</p>
              <p className="text-3xl font-bold text-[#00E53A]">
                ₦
                {Number(
                  (profile.total_referrals || 0) * 15000,
                ).toLocaleString()}
              </p>
            </div>
          </div>
        </Card>

        {/* Referral Link Card */}
        <Card className="bg-[#0b1118]/80 backdrop-blur-lg border border-[#1e293b] p-6 shadow-[0_0_20px_rgba(0,229,58,0.05)]">
          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2 text-white">
              <Gift className="w-5 h-5 text-[#00FF55]" />
              Your Referral Link
            </h3>
            <div className="bg-[#06090d] p-4 rounded-lg space-y-3 border border-[#00E53A]/20">
              <code className="text-sm font-mono break-all block text-white">
                {referralLink}
              </code>
              <div className="flex gap-2">
                <Button
                  onClick={copyReferralCode}
                  className="flex-1 bg-gradient-to-r from-[#00C836] to-[#00E53A] hover:from-[#00E53A] hover:to-[#00FF55] text-[#04080a] font-black shadow-[0_0_15px_rgba(0,229,58,0.3)]"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Link
                </Button>
                <Button
                  onClick={shareReferral}
                  className="flex-1 bg-gradient-to-r from-[#00E53A] to-[#00FF55] hover:from-[#00FF55] hover:to-[#66FF88] text-[#04080a] font-black shadow-[0_0_15px_rgba(0,229,58,0.3)]"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Upgrade Card */}
        <Card className="bg-gradient-to-r from-[#00E53A]/10 to-[#00C836]/10 border border-[#00E53A]/30 p-6 shadow-[0_0_20px_rgba(0,229,58,0.05)]">
          <h3 className="font-semibold mb-4 flex items-center gap-2 text-white">
            <TrendingUp className="w-5 h-5 text-[#00FF55]" />
            Upgrade Referral Earnings
          </h3>
          <p className="text-sm text-[#94A3B8] mb-4">
            Increase your earnings per referral by upgrading to premium tiers
          </p>
          <button
            type="button"
            onClick={() => navigate("/upgrade")}
            className="w-full bg-gradient-to-r from-[#00C836] to-[#00E53A] text-[#04080a] font-black py-2 px-4 rounded-lg hover:shadow-[0_0_20px_rgba(0,229,58,0.4)] transition-all active:scale-95 touch-manipulation cursor-pointer min-h-[44px]"
            style={{ WebkitTapHighlightColor: "transparent" }}
          >
            View Upgrade Options
          </button>
        </Card>

        {/* How It Works */}
        <Card className="bg-[#0b1118]/80 backdrop-blur-lg border border-[#1e293b] p-6 shadow-[0_0_20px_rgba(0,229,58,0.05)]">
          <h3 className="font-semibold mb-4 text-white">How It Works</h3>
          <ol className="space-y-3 text-sm text-[#CBD5E1]">
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#00E53A] text-[#04080a] flex items-center justify-center text-xs font-bold">
                1
              </span>
              <span>Share your unique referral link with friends</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#00E53A] text-[#04080a] flex items-center justify-center text-xs font-bold">
                2
              </span>
              <span>
                They sign up using your link and get ₦40,000, plus ₦10,000 when they download the app
              </span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#00E53A] text-[#04080a] flex items-center justify-center text-xs font-bold">
                3
              </span>
              <span>You earn ₦15,000 added to your balance instantly!</span>
            </li>
          </ol>
        </Card>
      </div>

      <FloatingActionButton />
    </div>
  );
};

export default Referrals;

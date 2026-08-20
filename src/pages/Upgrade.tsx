import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, TrendingUp, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { FloatingActionButton } from "@/components/FloatingActionButton";

const Upgrade = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const upgradeTiers = [
    {
      level: "Tier 2",
      amount: 15000,
      price: 15000,
      color: "from-[#00C836] to-[#00E53A]",
    },
    {
      level: "Tier 3",
      amount: 25000,
      price: 25000,
      color: "from-[#00E53A] to-[#00FF55]",
    },
    {
      level: "Tier 4",
      amount: 35000,
      price: 35000,
      color: "from-[#00FF55] to-[#66FF88]",
    },
    {
      level: "Tier 5",
      amount: 40000,
      price: 40000,
      color: "from-[#66FF88] to-[#00FF55]",
    },
  ];

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

  const handleUpgrade = (tier: (typeof upgradeTiers)[0]) => {
    navigate("/upgrade-payment", { state: tier });
  };

  const currentEarnings = profile?.referral_earnings || 12000;

  if (loading || !profile) return null;

  return (
    <div className="min-h-screen bg-[#06090d] pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#00C836] to-[#00E53A] p-6 text-[#04080a] shadow-[0_4px_20px_rgba(0,229,58,0.3)]">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="text-[#04080a] hover:bg-black/20"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold">Upgrade</h1>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Upgrade Benefits */}
        <Card className="bg-gradient-to-br from-[#0b1118] to-[#06090d] backdrop-blur-lg border border-[#00E53A]/30 p-6 shadow-[0_0_20px_rgba(0,229,58,0.1)]">
          <div className="text-center">
            <p className="text-sm text-[#00FF55]/70 mb-4">UPGRADE</p>
            <p className="text-sm text-[#94A3B8] mb-2">
              Unlock Premium Features
            </p>
            <p className="text-xl font-bold brand-gradient-text mb-3">
              Withdraw Without Referral Requirements
            </p>
            <p className="text-xl font-bold brand-gradient-text mb-3">
              Upgrade allows you to earn more on each referral than regular
              members
            </p>
          </div>
        </Card>

        {/* Upgrade Tiers */}
        <div className="space-y-4">
          {upgradeTiers.map((tier, index) => {
            const earningsByTier = [
              "Earn ₦15,000 per each referral",
              "Earn ₦25,000 per each referral",
              "Earn ₦35,000 per each referral",
              "Earn ₦45,000 per each referral",
            ];
            return (
              <Card
                key={tier.level}
                className="bg-gradient-to-br from-[#0b1118] via-[#00E53A]/10 to-[#0b1118] backdrop-blur-lg border border-[#00E53A]/40 p-6 hover:border-[#00E53A]/70 transition-all shadow-lg shadow-[#00E53A]/10"
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3
                      className={`text-xl font-bold bg-gradient-to-r ${tier.color} bg-clip-text text-transparent`}
                    >
                      {tier.level}
                    </h3>
                    <p
                      className={`text-2xl font-bold bg-gradient-to-r ${tier.color} bg-clip-text text-transparent`}
                    >
                      ₦{tier.amount.toLocaleString()}
                    </p>
                    <p className="text-xs text-[#00E53A]/70 mt-1">
                      Upgrade cost
                    </p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-[#00FF55] drop-shadow-[0_0_10px_rgba(0,255,85,0.4)]" />
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-[#00FF55] flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-[#CBD5E1]">
                      {earningsByTier[index]}
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-[#00FF55] flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-[#CBD5E1]">
                      Lifetime upgrade benefit
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-[#00FF55] flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-[#CBD5E1]">
                      Priority support & fast processing
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-sm text-[#00E53A]/70">
                    Upgrade Price:{" "}
                    <span className="font-bold text-[#00FF55]">
                      ₦{tier.price.toLocaleString()}
                    </span>
                  </p>
                  <Button
                    onClick={() => handleUpgrade(tier)}
                    className={`bg-gradient-to-r ${tier.color} text-[#04080a] font-bold hover:from-[#00E53A] hover:to-[#00FF55] shadow-lg shadow-[#00E53A]/40 hover:shadow-[#00FF55]/60 transition-all active:scale-[0.98]`}
                  >
                    Upgrade Now
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      <FloatingActionButton />
    </div>
  );
};

export default Upgrade;

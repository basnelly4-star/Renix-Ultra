import { useNavigate } from "react-router-dom";
import { ArrowLeft, TrendingUp, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

interface InvestmentPlan {
  name: string;
  investment: number;
  returns: number;
  duration: string;
  color: string;
  icon: React.ReactNode;
}

const Invest = () => {
  const navigate = useNavigate();

  const plans: InvestmentPlan[] = [
    {
      name: "Silver Plan",
      investment: 10000,
      returns: 70000,
      duration: "24 hours",
      color: "from-[#00C836] to-[#00E53A]",
      icon: <Zap className="w-5 h-5" />,
    },
    {
      name: "Gold Plan",
      investment: 20000,
      returns: 150000,
      duration: "24 hours",
      color: "from-[#FFB800] to-[#FFD94D]",
      icon: <TrendingUp className="w-5 h-5" />,
    },
    {
      name: "Platinum Plan",
      investment: 30000,
      returns: 200000,
      duration: "24 hours",
      color: "from-[#00E53A] to-[#00FF55]",
      icon: <Zap className="w-5 h-5" />,
    },
    {
      name: "Diamond Plan",
      investment: 40000,
      returns: 300000,
      duration: "24 hours",
      color: "from-[#00FF55] to-[#66FF88]",
      icon: <TrendingUp className="w-5 h-5" />,
    },
  ];

  const handleInvestNow = (plan: InvestmentPlan) => {
    // Navigate to payment page with the exact amount for the chosen plan
    // Pass only serializable data (exclude JSX icon element)
    navigate("/invest-payment", {
      state: {
        name: plan.name,
        investment: plan.investment,
        returns: plan.returns,
        duration: plan.duration,
        color: plan.color,
      },
    });
  };

  return (
    <div className="min-h-screen liquid-bg pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#00C836] to-[#00E53A] p-4 text-[#04080a] shadow-[0_4px_20px_rgba(0,229,58,0.3)]">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/dashboard")}
            className="hover:bg-black/20 text-[#04080a]"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-lg font-bold">Invest</h1>
            <p className="text-xs opacity-80">Crowdfunding Investment Plans</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Info Card */}
        <Card className="bg-[#0b1118] border border-[#00E53A]/30 p-4 shadow-[0_0_20px_rgba(0,229,58,0.1)]">
          <h2 className="text-sm font-semibold text-white mb-2">
            How It Works
          </h2>
          <p className="text-xs text-[#94A3B8]">
            Choose an investment plan, invest the required amount, and earn
            returns in 24 hours. All returns are credited directly to your
            balance.
          </p>
        </Card>

        {/* Investment Plans Grid */}
        <div className="space-y-3">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className="bg-[#0b1118]/80 backdrop-blur-lg border border-[#1e293b] overflow-hidden hover:shadow-[0_0_30px_rgba(0,229,58,0.15)] transition-all"
            >
              {/* Plan Header with Color Gradient */}
              <div
                className={`bg-gradient-to-r ${plan.color} p-4 text-[#04080a]`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg">{plan.icon}</div>
                  <h3 className="font-bold text-lg">{plan.name}</h3>
                </div>
              </div>

              {/* Plan Details */}
              <div className="p-4 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-[#06090d] rounded-lg p-3 border border-[#1e293b]">
                    <p className="text-xs text-[#94A3B8] mb-1">Investment</p>
                    <p className="text-lg font-bold text-white">
                      ₦{plan.investment.toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-[#06090d] rounded-lg p-3 border border-[#1e293b]">
                    <p className="text-xs text-[#94A3B8] mb-1">Returns</p>
                    <p className="text-lg font-bold bg-gradient-to-r from-[#00FF55] to-[#66FF88] bg-clip-text text-transparent">
                      ₦{plan.returns.toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Duration & Profit */}
                <div className="bg-gradient-to-r from-[#00E53A]/10 to-[#00C836]/10 border border-[#00E53A]/30 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-[#94A3B8]">Duration</span>
                    <span className="text-sm font-semibold text-white">
                      {plan.duration}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#94A3B8]">Profit</span>
                    <span className="text-sm font-bold text-[#00FF55]">
                      +₦{(plan.returns - plan.investment).toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Invest Button */}
                <Button
                  type="button"
                  onClick={() => handleInvestNow(plan)}
                  className={`w-full bg-gradient-to-r ${plan.color} hover:opacity-90 text-[#04080a] font-black py-2 shadow-[0_0_20px_rgba(0,229,58,0.3)] transition-all active:scale-[0.98]`}
                >
                  Invest Now
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Footer Info */}
        <Card className="bg-[#0b1118] backdrop-blur-lg border border-[#1e293b] p-4 text-center">
          <p className="text-xs text-[#94A3B8] mb-2">
            💡 Tip: Choose a plan that matches your investment capacity
          </p>
          <p className="text-xs text-[#94A3B8]">
            All returns are guaranteed within 24 hours of investment.
          </p>
        </Card>
      </div>
    </div>
  );
};

export default Invest;

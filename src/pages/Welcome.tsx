import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Gift, Users, TrendingUp } from "lucide-react";

const Welcome = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      navigate("/auth");
    }
  }, [navigate]);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  return (
    <div className="min-h-screen bg-[#06090d] flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center space-y-8 animate-slide-up">
        <div className="space-y-4">
          <h1 className="text-5xl md:text-6xl font-bold brand-gradient-text animate-float">
            Welcome to Renix-Ultra!
          </h1>
          <p className="text-2xl text-white">
            Hi, {user.fullName || "Friend"} 👋
          </p>
          <p className="text-xl text-[#94A3B8]">
            Your journey to financial freedom starts here!
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 py-8">
          <div className="bg-[#0b1118]/80 backdrop-blur-lg p-6 rounded-2xl border border-[#00E53A]/30 space-y-2 shadow-[0_0_20px_rgba(0,229,58,0.05)]">
            <Gift className="w-12 h-12 mx-auto text-[#00FF55] animate-pulse-glow" />
            <h3 className="text-xl font-bold text-white">₦20,000 Bonus</h3>
            <p className="text-[#94A3B8] text-sm">
              Welcome reward credited to your account
            </p>
          </div>

          <div className="bg-[#0b1118]/80 backdrop-blur-lg p-6 rounded-2xl border border-[#00E53A]/30 space-y-2 shadow-[0_0_20px_rgba(0,229,58,0.05)]">
            <Users className="w-12 h-12 mx-auto text-[#00E53A] animate-pulse-glow" />
            <h3 className="text-xl font-bold text-white">Refer & Earn</h3>
            <p className="text-[#94A3B8] text-sm">
              ₦15,000 for each friend you invite
            </p>
          </div>

          <div className="bg-[#0b1118]/80 backdrop-blur-lg p-6 rounded-2xl border border-[#00E53A]/30 space-y-2 shadow-[0_0_20px_rgba(0,229,58,0.05)]">
            <TrendingUp className="w-12 h-12 mx-auto text-[#00FF55] animate-pulse-glow" />
            <h3 className="text-xl font-bold text-white">
              Unlimited Potential
            </h3>
            <p className="text-[#94A3B8] text-sm">
              No limit to how much you can earn
            </p>
          </div>
        </div>

        <Button
          onClick={() => navigate("/dashboard")}
          size="lg"
          className="bg-gradient-to-r from-[#00C836] to-[#00E53A] hover:from-[#00E53A] hover:to-[#00FF55] text-[#04080a] font-semibold text-lg px-12 py-6 shadow-[0_0_30px_rgba(0,229,58,0.4)] transition-all active:scale-[0.98]"
        >
          Go to Dashboard
        </Button>
      </div>
    </div>
  );
};

export default Welcome;

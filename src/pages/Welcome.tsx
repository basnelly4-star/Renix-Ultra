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
    <div className="min-h-screen liquid-bg flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center space-y-8 animate-slide-up">
        <div className="space-y-4">
          <h1 className="text-5xl md:text-6xl font-bold gradient-text animate-float">
            Welcome to Renix-Ultra!
          </h1>
          <p className="text-2xl text-foreground">
            Hi, {user.fullName || "Friend"} 👋
          </p>
          <p className="text-xl text-muted-foreground">
            Your journey to financial freedom starts here!
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 py-8">
          <div className="bg-card/80 backdrop-blur-lg p-6 rounded-2xl border border-border/50 space-y-2">
            <Gift className="w-12 h-12 mx-auto text-secondary animate-pulse-glow" />
            <h3 className="text-xl font-bold text-foreground">₦50,000 Bonus</h3>
            <p className="text-muted-foreground text-sm">Welcome reward credited to your account</p>
          </div>
          
          <div className="bg-card/80 backdrop-blur-lg p-6 rounded-2xl border border-border/50 space-y-2">
            <Users className="w-12 h-12 mx-auto text-primary animate-pulse-glow" />
            <h3 className="text-xl font-bold text-foreground">Refer & Earn</h3>
            <p className="text-muted-foreground text-sm">₦12,000 for each friend you invite</p>
          </div>
          
          <div className="bg-card/80 backdrop-blur-lg p-6 rounded-2xl border border-border/50 space-y-2">
            <TrendingUp className="w-12 h-12 mx-auto text-secondary animate-pulse-glow" />
            <h3 className="text-xl font-bold text-foreground">Unlimited Potential</h3>
            <p className="text-muted-foreground text-sm">No limit to how much you can earn</p>
          </div>
        </div>

        <Button
          onClick={() => navigate("/dashboard")}
          size="lg"
          className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-primary-foreground font-semibold text-lg px-12 py-6 glow-primary"
        >
          Go to Dashboard
        </Button>
      </div>
    </div>
  );
};

export default Welcome;

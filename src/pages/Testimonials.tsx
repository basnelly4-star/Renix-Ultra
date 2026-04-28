import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Star, User, MessageCircle } from "lucide-react";

const testimonials = [
  {
    name: "Samuel L.",
    subtitle: "Verified Success",
    amount: "₦500,000",
    quote: "The daily tasks are so easy and the rewards are instant. Best app ever!",
  },
  {
    name: "Ada O.",
    subtitle: "Daily Earner",
    amount: "₦350,000",
    quote: "I keep coming back every day because the streak rewards really stack up fast.",
  },
  {
    name: "Tunde A.",
    subtitle: "VIP Member",
    amount: "₦1,200,000",
    quote: "Support is responsive, and the dashboard makes it easy to track my earnings daily.",
  },
];

const Testimonials = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#050505] to-black px-4 py-8 text-white">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="rounded-[2rem] border border-[#EAB308]/20 bg-[#090909]/90 p-8 shadow-[0_30px_80px_rgba(234,179,8,0.15)]">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.32em] text-[#EAB308]/80">Success Stories</p>
              <h1 className="mt-3 text-4xl font-bold text-white">Real users, real daily rewards.</h1>
              <p className="mt-3 max-w-2xl text-sm text-[#d4d4d4]">
                See how Earnix9ja members are building streaks and boosting their balance with daily tasks, referrals, and consistent claims.
              </p>
            </div>
            <Button
              onClick={() => navigate("/dashboard")}
              className="rounded-full bg-gradient-to-r from-[#EAB308] to-[#FBBF24] text-black px-6 py-3 font-bold shadow-[0_18px_40px_rgba(234,179,8,0.25)] hover:shadow-[0_20px_50px_rgba(234,179,8,0.35)]"
            >
              Back to Dashboard
            </Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {testimonials.map((item) => (
            <Card key={item.name} className="rounded-[2rem] border border-[#EAB308]/10 bg-[#111111]/90 p-6 shadow-[0_20px_60px_rgba(234,179,8,0.12)]">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#EAB308]/10 text-[#EAB308]">
                    <User className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-white">{item.name}</p>
                    <p className="text-xs uppercase tracking-[0.25em] text-[#EAB308]/70">{item.subtitle}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 rounded-full bg-[#EAB308]/10 px-3 py-1 text-xs font-bold text-[#EAB308]">
                  <Star className="h-4 w-4" />
                  Earned
                </div>
              </div>
              <p className="mt-6 text-4xl font-bold text-[#EAB308]">{item.amount}</p>
              <p className="mt-4 text-sm leading-7 text-[#d4d4d4]">“{item.quote}”</p>
              <div className="mt-6 flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-[#EAB308]/70">
                <MessageCircle className="h-4 w-4" />
                Live reward testimonials
              </div>
            </Card>
          ))}
        </div>

        <div className="mx-auto max-w-4xl rounded-[2rem] border border-[#EAB308]/20 bg-[#0b0b0b]/80 p-6 shadow-[0_20px_60px_rgba(234,179,8,0.12)]">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-[#EAB308]/80">Thousands of users sharing success</p>
              <h2 className="mt-3 text-2xl font-semibold text-white">Real-time member results, right here.</h2>
            </div>
            <Button
              onClick={() => navigate("/daily-rewards")}
              className="rounded-full bg-gradient-to-r from-[#EAB308] to-[#FBBF24] text-black px-6 py-3 font-bold"
            >
              Start your streak
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;

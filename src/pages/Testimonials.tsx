import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle, ArrowRight } from "lucide-react";

const testimonials = [
  {
    name: "Samuel T.",
    location: "Port Harcourt",
    status: "VERIFIED SUCCESS",
    amount: "₦520,000",
    quote: "The referral bonus is the best part. I invited 6 active users and qualified for withdrawal easily.",
    highlight: true,
  },
  {
    name: "Blessing O.",
    location: "Abuja",
    status: "WITHDRAWAL SUCCESS",
    amount: "₦410,000",
    quote: "I love how simple the tasks are. Once I completed everything required, my withdrawal was processed within 48 hours.",
    highlight: false,
  },
  {
    name: "Chinedu A.",
    location: "Lagos",
    status: "LEGIT VERIFIED",
    amount: "₦580,000",
    quote: "I was skeptical at first, but after completing my daily tasks and inviting my friends, I received my first withdrawal successfully. Earnix9ja is legit!",
    highlight: false,
  },
];

const Testimonials = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#050505] to-black px-4 py-8 text-white pb-20">
      <div className="mx-auto max-w-6xl space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-white">Success Stories</h1>
          <p className="text-sm text-[#b0b0b0]">Real withdrawals from real members. Join thousands earning daily.</p>
        </div>

        {/* Testimonials Grid */}
        <div className="space-y-6">
          {testimonials.map((item, idx) => (
            <Card
              key={idx}
              className={`rounded-2xl border p-6 transition-all ${
                item.highlight
                  ? "border-[#EAB308]/40 bg-gradient-to-br from-[#0d0d0d] to-[#0a0a0a] shadow-[0_0_60px_rgba(234,179,8,0.2)]"
                  : "border-[#EAB308]/20 bg-[#0d0d0d] shadow-[0_0_30px_rgba(234,179,8,0.1)]"
              }`}
            >
              <div className="space-y-4">
                {/* Header with Avatar & Quick Stats */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#EAB308] text-black font-bold text-lg flex-shrink-0">
                      {item.name.charAt(0)}
                    </div>

                    {/* Name & Location */}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-lg font-bold text-white">{item.name}</p>
                        <CheckCircle className="h-5 w-5 text-[#EAB308] flex-shrink-0" />
                      </div>
                      <p className="text-xs text-[#b0b0b0] mt-1">📍 {item.location}</p>
                    </div>
                  </div>

                  {/* Amount Badge */}
                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <div className="rounded-full bg-[#EAB308]/10 border border-[#EAB308]/30 px-4 py-2 text-right">
                      <p className="text-xs text-[#EAB308] uppercase font-bold tracking-widest">{item.status}</p>
                    </div>
                    <p className="text-2xl font-bold text-[#EAB308]">{item.amount}</p>
                  </div>
                </div>

                {/* Quote */}
                <div className="space-y-3">
                  <p className="text-sm leading-relaxed text-[#d1d1d1] italic">"{item.quote}"</p>
                </div>

                {/* Footer */}
                <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#EAB308]/70 pt-2 border-t border-[#EAB308]/10">
                  <span>💚</span>
                  <span>Live Feed: Real-time member testimonials</span>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-12 rounded-2xl border border-[#EAB308]/30 bg-[#0a0a0a] p-8 shadow-[0_0_40px_rgba(234,179,8,0.15)]">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-widest text-[#EAB308]/70">📈 THOUSANDS OF USERS SHARING SUCCESS</p>
              <h2 className="text-2xl font-bold text-white">Post your success story</h2>
              <p className="text-sm text-[#b0b0b0] max-w-md">
                Love how you've used Earnix9ja? Share your story and inspire others. We'll feature the best ones here.
              </p>
              <p className="text-xs text-[#EAB308] font-bold pt-2">RETURN TO DASHBOARD TO UPGRADE</p>
            </div>
            <div className="flex flex-col gap-3 flex-shrink-0">
              <Button
                onClick={() => navigate("/dashboard")}
                className="rounded-full bg-gradient-to-r from-[#EAB308] to-[#FBBF24] text-black px-8 py-3 font-bold shadow-[0_8px_32px_rgba(234,179,8,0.2)] hover:shadow-[0_10px_40px_rgba(234,179,8,0.25)]"
              >
                Back to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                onClick={() => navigate("/daily-rewards")}
                variant="outline"
                className="rounded-full border border-[#EAB308]/40 text-[#EAB308] px-8 py-3 font-bold hover:bg-[#EAB308]/5"
              >
                Start Earning Daily
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;

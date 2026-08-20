import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Loan = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#06090d] via-[#0b1118] to-[#06090d] px-4 py-8 text-white">
      <div className="mx-auto max-w-md rounded-[2rem] border border-[#00E53A]/20 bg-[#0b1118]/90 p-6 shadow-[0_0_40px_rgba(0,229,58,0.18)]">
        <p className="text-sm font-semibold uppercase tracking-[0.32em] text-[#CBD5E1]/80">
          Loans Restricted
        </p>

        <h1 className="mt-5 text-3xl font-bold text-white">Loans Restricted</h1>

        <p className="mt-5 text-sm leading-6 text-[#94A3B8]">
          Free loans are exclusive to{" "}
          <span className="font-semibold text-[#00FF55]">Only</span> Upgraded{" "}
          <span className="font-semibold text-[#00FF55]">Users</span>.
        </p>

        <div className="mt-6 rounded-3xl border border-[#00E53A]/20 bg-[#06090d]/70 px-5 py-4 text-sm text-[#00FF55] shadow-[inset_0_0_0_1px_rgba(0,229,58,0.1)]">
          Please upgrade your plan to access instant business credit up to
          ₦500,000 with 0% interest.
        </div>

        <Button
          onClick={() => navigate("/upgrade")}
          className="mt-8 w-full rounded-full bg-gradient-to-r from-[#00C836] to-[#00E53A] px-6 py-4 text-[#04080a] text-base font-bold shadow-[0_8px_32px_rgba(0,229,58,0.25)] hover:from-[#00E53A] hover:to-[#00FF55] mb-3 animate-pulse"
        >
          🚀 Upgrade Now & Unlock Loans
        </Button>
        <Button
          onClick={() => navigate("/dashboard")}
          className="w-full rounded-full bg-gradient-to-r from-[#00E53A] to-[#00FF55] px-6 py-4 text-[#04080a] text-base font-bold shadow-[0_20px_60px_rgba(0,229,58,0.3)] hover:shadow-[0_22px_70px_rgba(0,229,58,0.35)]"
        >
          Back to Dashboard
        </Button>
      </div>
    </div>
  );
};

export default Loan;

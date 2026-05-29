import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Loan = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#050505] to-black px-4 py-8 text-white">
      <div className="mx-auto max-w-md rounded-[2rem] border border-[#EAB308]/20 bg-[#090909]/90 p-6 shadow-[0_0_40px_rgba(234,179,8,0.18)]">
        <p className="text-sm font-semibold uppercase tracking-[0.32em] text-[#f8f2d2]/80">
          Loans Restricted
        </p>

        <h1 className="mt-5 text-3xl font-bold text-white">
          Loans Restricted
        </h1>

        <p className="mt-5 text-sm leading-6 text-[#d1d5db]">
          Free loans are exclusive to <span className="font-semibold text-[#EAB308]">Only</span> Upgraded <span className="font-semibold text-[#EAB308]">Users</span>.
        </p>

        <div className="mt-6 rounded-3xl border border-[#EAB308]/20 bg-[#111111]/70 px-5 py-4 text-sm text-[#EAB308] shadow-[inset_0_0_0_1px_rgba(234,179,8,0.1)]">
          Please upgrade your plan to access instant business credit up to ₦500,000 with 0% interest.
        </div>

        <Button
          onClick={() => navigate("/upgrade")}
          className="mt-8 w-full rounded-full bg-gradient-to-r from-[#0ea5e9] to-[#22d3ee] px-6 py-4 text-white text-base font-bold shadow-[0_8px_32px_rgba(14,165,233,0.18)] hover:from-[#22d3ee] hover:to-[#0ea5e9] mb-3 animate-pulse"
        >
          🚀 Upgrade Now & Unlock Loans
        </Button>
        <Button
          onClick={() => navigate("/dashboard")}
          className="w-full rounded-full bg-gradient-to-r from-[#EAB308] to-[#FBBF24] px-6 py-4 text-black text-base font-bold shadow-[0_20px_60px_rgba(234,179,8,0.3)] hover:shadow-[0_22px_70px_rgba(234,179,8,0.35)]"
        >
          Back to Dashboard
        </Button>
      </div>
    </div>
  );
};

export default Loan;

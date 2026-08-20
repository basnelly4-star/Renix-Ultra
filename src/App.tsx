import { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Auth from "./pages/Auth";
import Welcome from "./pages/Welcome";
import Dashboard from "./pages/Dashboard";
import { supabase } from "@/integrations/supabase/client";
import History from "./pages/History";
import Referrals from "./pages/Referrals";
import Profile from "./pages/Profile";
import Withdraw from "./pages/Withdraw";
import Loan from "./pages/Loan";
import Upgrade from "./pages/Upgrade";
import UpgradePayment from "./pages/UpgradePayment";
import InvestPayment from "./pages/InvestPayment";
import UpgradePending from "./pages/UpgradePending";
import GatewayActivation from "./pages/GatewayActivation";
import GatewayPending from "./pages/GatewayPending";
import WithdrawalActivation from "./pages/WithdrawalActivation";
import InstantWithdrawalActivation from "./pages/InstantWithdrawalActivation";
import InstantWithdrawalPending from "./pages/InstantWithdrawalPending";
import WithdrawalActivationPending from "./pages/WithdrawalActivationPending";
import Tasks from "./pages/Tasks";
import DailyRewards from "./pages/DailyRewards";
import Support from "./pages/Support";
import Community from "./pages/Community";
import Spin from "./pages/Spin";
import Invest from "./pages/Broadcast";
import Testimonials from "./pages/Testimonials";
import NotFound from "./pages/NotFound";
import BottomNavigation from "./components/BottomNavigation";
import InstallPwaPrompt from "./components/InstallPwaPrompt";
import ServiceWorkerUpdater from "./components/ServiceWorkerUpdater";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [sessionReady, setSessionReady] = useState<boolean | null>(null);

  useEffect(() => {
    let active = true;

    const check = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (active) setSessionReady(Boolean(session));
    };

    check();
    return () => {
      active = false;
    };
  }, []);

  if (sessionReady === null) return null;
  if (!sessionReady) return <Navigate to="/auth" replace />;

  return <>{children}</>;
};

const App = () => {
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session && (window.location.pathname === "/" || window.location.pathname === "/auth")) {
          window.location.replace("/dashboard");
        }
      } catch (error) {
        // no-op: allow auth page to handle session checks itself
        console.warn("PWA session check failed", error);
      }
    };

    checkSession();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen pb-28">
          <Routes>
            <Route path="/" element={<Auth />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/welcome" element={<Welcome />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
            <Route path="/referrals" element={<ProtectedRoute><Referrals /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/withdraw" element={<ProtectedRoute><Withdraw /></ProtectedRoute>} />
            <Route path="/loan" element={<ProtectedRoute><Loan /></ProtectedRoute>} />
            <Route path="/upgrade" element={<ProtectedRoute><Upgrade /></ProtectedRoute>} />
            <Route path="/upgrade-payment" element={<ProtectedRoute><UpgradePayment /></ProtectedRoute>} />
            <Route path="/invest-payment" element={<ProtectedRoute><InvestPayment /></ProtectedRoute>} />
            <Route path="/upgrade-pending" element={<ProtectedRoute><UpgradePending /></ProtectedRoute>} />
            <Route path="/gateway-activation" element={<ProtectedRoute><GatewayActivation /></ProtectedRoute>} />
            <Route path="/gateway-pending" element={<ProtectedRoute><GatewayPending /></ProtectedRoute>} />
            <Route path="/withdrawal-activation" element={<ProtectedRoute><WithdrawalActivation /></ProtectedRoute>} />
            <Route path="/instant-withdrawal-activation" element={<ProtectedRoute><InstantWithdrawalActivation /></ProtectedRoute>} />
            <Route path="/instant-withdrawal-pending" element={<ProtectedRoute><InstantWithdrawalPending /></ProtectedRoute>} />
            <Route path="/withdrawal-activation-pending" element={<ProtectedRoute><WithdrawalActivationPending /></ProtectedRoute>} />
            <Route path="/tasks" element={<ProtectedRoute><Tasks /></ProtectedRoute>} />
            <Route path="/daily-rewards" element={<ProtectedRoute><DailyRewards /></ProtectedRoute>} />
            <Route path="/support" element={<ProtectedRoute><Support /></ProtectedRoute>} />
            <Route path="/community" element={<ProtectedRoute><Community /></ProtectedRoute>} />
            <Route path="/testimonials" element={<ProtectedRoute><Testimonials /></ProtectedRoute>} />
            <Route path="/spin" element={<ProtectedRoute><Spin /></ProtectedRoute>} />
            <Route path="/broadcast" element={<ProtectedRoute><Invest /></ProtectedRoute>} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
        <BottomNavigation />
        <InstallPwaPrompt />
        <ServiceWorkerUpdater />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
  );
};

export default App;

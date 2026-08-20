import { useEffect, useState, lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import BottomNavigation from "./components/BottomNavigation";
import InstallPwaPrompt from "./components/InstallPwaPrompt";
import ServiceWorkerUpdater from "./components/ServiceWorkerUpdater";

// TIER 1: PRELOAD (critical path)
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";

// TIER 2: LAZY-LOAD (secondary/lower priority routes)
const Welcome = lazy(() => import("./pages/Welcome"));
const History = lazy(() => import("./pages/History"));
const Referrals = lazy(() => import("./pages/Referrals"));
const Profile = lazy(() => import("./pages/Profile"));
const Withdraw = lazy(() => import("./pages/Withdraw"));
const Loan = lazy(() => import("./pages/Loan"));
const Upgrade = lazy(() => import("./pages/Upgrade"));
const UpgradePayment = lazy(() => import("./pages/UpgradePayment"));
const InvestPayment = lazy(() => import("./pages/InvestPayment"));
const UpgradePending = lazy(() => import("./pages/UpgradePending"));
const GatewayActivation = lazy(() => import("./pages/GatewayActivation"));
const GatewayPending = lazy(() => import("./pages/GatewayPending"));
const WithdrawalActivation = lazy(() => import("./pages/WithdrawalActivation"));
const InstantWithdrawalActivation = lazy(() => import("./pages/InstantWithdrawalActivation"));
const InstantWithdrawalPending = lazy(() => import("./pages/InstantWithdrawalPending"));
const WithdrawalActivationPending = lazy(() => import("./pages/WithdrawalActivationPending"));
const Tasks = lazy(() => import("./pages/Tasks"));
const DailyRewards = lazy(() => import("./pages/DailyRewards"));
const Support = lazy(() => import("./pages/Support"));
const Community = lazy(() => import("./pages/Community"));
const Spin = lazy(() => import("./pages/Spin"));
const Invest = lazy(() => import("./pages/Broadcast"));
const Testimonials = lazy(() => import("./pages/Testimonials"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Loading fallback component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-black via-slate-900 to-black">
    <div className="text-center">
      <div className="mb-4 inline-block">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-400 border-t-amber-500"></div>
      </div>
      <p className="text-sm text-slate-400">Loading...</p>
    </div>
  </div>
);

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
            <Suspense fallback={<PageLoader />}>
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
            </Suspense>
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

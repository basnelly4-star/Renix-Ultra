import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Eye, EyeOff, Chrome } from "lucide-react";
import { FloatingActionButton } from "@/components/FloatingActionButton";
import { recoverFromInvalidRefreshToken, supabase } from "@/integrations/supabase/client";

const isRetryableAuthIssue = (error: unknown) => {
  const message = error instanceof Error ? error.message : String(error ?? "");
  return /AuthRetryableFetchError|504|503|502|Failed to fetch|NetworkError/i.test(message);
};

const Auth = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  // Referral code handling
  const refParam = searchParams.get("ref");
  const storedRef = localStorage.getItem("referralCode") || "";
  const initialRefCode = refParam || storedRef;

  useEffect(() => {
    if (refParam) {
      localStorage.setItem("referralCode", refParam);
    }
  }, [refParam]);

  const [signupData, setSignupData] = useState({
    fullName: "",
    email: "",
    password: "",
    referralCode: initialRefCode,
  });

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    const handleAuthRedirectAndSession = async () => {
      try {
        // If this page is the OAuth redirect target, consume the session from the URL
        const href = window.location.href;
        if (href.includes("access_token") || href.includes("provider_token") || href.includes("code") || href.includes("error_description")) {
          try {
            const { data, error } = await supabase.auth.getSessionFromUrl();
            if (!error && data?.session) {
              // ensure profile exists for oauth users
              const userId = data.session.user.id;
              const email = data.session.user.email || "";
              const fullName =
                data.session.user.user_metadata?.fullName ||
                data.session.user.user_metadata?.full_name ||
                email.split("@")[0] ||
                "User";

              await supabase.from("profiles").upsert({
                id: userId,
                email,
                full_name: fullName,
                referral_code: Math.random().toString(36).substr(2, 6).toUpperCase(),
              });

              navigate("/dashboard", { replace: true });
              return;
            }
          } catch (err) {
            console.warn("OAuth session consumption failed", err);
          }
        }

        // Fallback: normal session check
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;

        if (session) {
          navigate("/dashboard", { replace: true });
          return;
        }

        const { data: userData, error: userError } = await supabase.auth.getUser();
        if (userError) throw userError;
        if (userData.user) {
          navigate("/dashboard", { replace: true });
        }
      } catch (error) {
        const recovered = await recoverFromInvalidRefreshToken(error);
        if (recovered) {
          return;
        }

        if (!isRetryableAuthIssue(error)) {
          console.error(error);
        }
      }
    };

    handleAuthRedirectAndSession();
  }, [navigate]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const finalRefCode = signupData.referralCode || localStorage.getItem("referralCode") || "";

      const { data, error } = await supabase.auth.signUp({
        email: signupData.email.trim(),
        password: signupData.password,
        options: {
          data: {
            fullName: signupData.fullName,
            referralCode: finalRefCode,
          },
        },
      });

      if (error) throw error;
      if (!data.user) throw new Error("Signup failed");

      const userId = data.user.id;
      const generatedRefCode = Math.random().toString(36).substr(2, 6).toUpperCase();

      // Create user profile
      await supabase.from("profiles").upsert({
        id: userId,
        email: data.user.email!,
        full_name: signupData.fullName,
        referral_code: generatedRefCode,
        balance: 50000,
        total_referrals: 0,
      });

      // Welcome bonus
      await supabase.from("transactions").insert({
        user_id: userId,
        type: "credit",
        amount: 50000,
        description: "Welcome bonus",
        status: "completed",
      });

      // Handle referral
      if (finalRefCode && finalRefCode.trim() !== "") {
        console.log("🔍 DEBUG: Looking for referrer with code:", finalRefCode.trim());
        
        const { data: referrer, error: referrerError } = await supabase
          .from("profiles")
          .select("id, balance, total_referrals, referral_code")
          .ilike("referral_code", finalRefCode.trim())
          .maybeSingle();

        console.log("🔍 DEBUG: Referrer found:", referrer);
        console.log("🔍 DEBUG: Referrer error:", referrerError);

        if (referrer) {
          console.log("🔍 DEBUG: Updating referrer:", referrer.id);
          const currentBalance = Number(referrer.balance) || 0;
          const currentReferrals = Number(referrer.total_referrals) || 0;
          
          const newBalance = currentBalance + 12000;
          const newReferrals = currentReferrals + 1;

          console.log("🔍 DEBUG: Current balance:", currentBalance, "referrals:", currentReferrals);
          console.log("🔍 DEBUG: New balance:", newBalance, "referrals:", newReferrals);

          const { error: updateError } = await supabase
            .from("profiles")
            .update({
              balance: newBalance,
              total_referrals: newReferrals,
            })
            .eq("id", referrer.id);

          console.log("🔍 DEBUG: Update error:", updateError);

          if (!updateError) {
            console.log("🔍 DEBUG: Successfully updated referrer");
          }

          await supabase.from("transactions").insert({
            user_id: referrer.id,
            type: "credit",
            amount: 12000,
            description: `Referral bonus from ${signupData.fullName}`,
            status: "completed",
          });
        } else {
          console.log("🔍 DEBUG: No referrer found or error occurred");
        }
      }

      localStorage.removeItem("referralCode");
      toast.success("Welcome to Renix-Ultra! You got ₦50,000 bonus!");
      navigate("/dashboard", { replace: true });
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Signup failed. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let loginError: unknown;
      let loginSession: unknown = null;

      for (let attempt = 1; attempt <= 2; attempt++) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: loginData.email.trim(),
          password: loginData.password,
        });

        if (!error) {
          loginSession = data.session;
          loginError = null;
          break;
        }

        loginError = error;

        if (!isRetryableAuthIssue(error) || attempt === 2) {
          throw error;
        }

        await new Promise((resolve) => setTimeout(resolve, 500));
      }

      if (loginError) throw loginError;
      if (!loginSession) {
        throw new Error("Login succeeded but session was not created. Please try again.");
      }

      toast.success("Welcome back!");
      navigate("/dashboard", { replace: true });
    } catch (error: any) {
      const recovered = await recoverFromInvalidRefreshToken(error);
      if (recovered) {
        toast.error("Your previous session expired. Please login again.");
        return;
      }

      if (isRetryableAuthIssue(error)) {
        toast.error("Authentication server timed out. Please try again in a few seconds.");
      } else {
        toast.error(error.message || "Invalid email or password");
      }
    } finally {
      setIsLoading(false);
    }
  };;

  const handleGoogleAuth = async () => {
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (error) throw error;
      toast.success("Redirecting to Google...");
    } catch (error: any) {
      console.error("Google auth error:", error);
      toast.error(error.message || "Google sign-in failed. Please try again.");
      setIsLoading(false);
    }
  };

  const GoogleAuthButton = ({ label = "Continue with Google" }: { label?: string }) => (
    <button
      type="button"
      onClick={handleGoogleAuth}
      disabled={isLoading}
      className="google-shimmer-button group relative w-full overflow-hidden rounded-xl border border-[#00E53A]/30 bg-[radial-gradient(circle_at_top,_rgba(0,229,58,0.15),_transparent_38%),linear-gradient(135deg,#0b1118_0%,#06090d_45%,#0b1118_100%)] px-4 py-3 text-sm font-semibold text-white transition-all duration-300 hover:scale-[1.01] hover:shadow-[0_0_30px_rgba(0,229,58,0.4)] disabled:cursor-not-allowed disabled:opacity-70"
    >
      <span className="google-shimmer-button__shine" aria-hidden="true" />
      <span className="relative z-10 flex items-center justify-center gap-2">
        <Chrome className="h-4 w-4" />
        {label}
      </span>
    </button>
  );

  return (
    <>
    <div className="min-h-screen liquid-bg flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-[#0b1118] backdrop-blur-lg border border-[#00E53A]/30 shadow-[0_0_30px_rgba(0,229,58,0.1)] animate-slide-up">
        <CardHeader className="text-center">
          <CardTitle className="text-4xl font-bold gradient-text mb-2 text-white">
            Renix-Ultra
          </CardTitle>
          <CardDescription className="text-[#94A3B8]">
            Turn one click into thousands!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="signup" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-[#06090d] border border-[#1e293b] p-1 rounded-xl">
              <TabsTrigger
                value="signup"
                className="data-[state=active]:bg-[#00E53A] data-[state=active]:text-[#04080a] data-[state=active]:shadow-[0_0_15px_rgba(0,229,58,0.4)] text-[#94A3B8] font-semibold rounded-lg transition-all"
              >
                Sign Up
              </TabsTrigger>
              <TabsTrigger
                value="login"
                className="data-[state=active]:bg-[#00E53A] data-[state=active]:text-[#04080a] data-[state=active]:shadow-[0_0_15px_rgba(0,229,58,0.4)] text-[#94A3B8] font-semibold rounded-lg transition-all"
              >
                Login
              </TabsTrigger>
            </TabsList>

            <TabsContent value="signup">
              <div className="mb-4">
                <GoogleAuthButton label="Continue with Google" />
              </div>

              <div className="relative mb-4">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-[#1e293b]" />
                </div>
                <div className="relative flex justify-center text-[11px] uppercase tracking-[0.2em] text-[#94A3B8]">
                  <span className="bg-[#0b1118] px-2">or sign up with email</span>
                </div>
              </div>

              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-[#CBD5E1]">Full Name</Label>
                  <Input
                    id="fullName"
                    placeholder="Enter your full name"
                    value={signupData.fullName}
                    onChange={(e) => setSignupData({ ...signupData, fullName: e.target.value })}
                    required
                    className="bg-[#06090d] border-[#1e293b] text-white placeholder:text-[#64748B] focus:border-[#00E53A] focus:ring-[#00E53A]/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-[#CBD5E1]">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={signupData.email}
                    onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                    required
                    className="bg-[#06090d] border-[#1e293b] text-white placeholder:text-[#64748B] focus:border-[#00E53A] focus:ring-[#00E53A]/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-[#CBD5E1]">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showSignupPassword ? "text" : "password"}
                      placeholder="Create a password"
                      value={signupData.password}
                      onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                      required
                      className="bg-[#06090d] border-[#1e293b] text-white placeholder:text-[#64748B] focus:border-[#00E53A] focus:ring-[#00E53A]/20"
                    />
                    <button
                      type="button"
                      onClick={() => setShowSignupPassword((s) => !s)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-[#94A3B8]"
                      aria-label={showSignupPassword ? "Hide password" : "Show password"}
                    >
                      {showSignupPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="referralCode" className="text-[#CBD5E1]">Referral Code (Optional)</Label>
                  <Input
                    id="referralCode"
                    placeholder="Enter referral code"
                    value={signupData.referralCode}
                    onChange={(e) => setSignupData({ ...signupData, referralCode: e.target.value })}
                    disabled={!!refParam}
                    readOnly={!!refParam}
                    className="bg-[#06090d] border-[#1e293b] text-white placeholder:text-[#64748B] focus:border-[#00E53A] focus:ring-[#00E53A]/20 disabled:opacity-60"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#00C836] to-[#00E53A] hover:from-[#00E53A] hover:to-[#00FF55] text-[#04080a] font-black py-3 rounded-xl shadow-[0_0_25px_rgba(0,229,58,0.5)] transition-all active:scale-[0.98]"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating Account..." : "Sign Up & Get ₦50,000 Bonus"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="login">
              <div className="mb-4">
                <GoogleAuthButton label="Continue with Google" />
              </div>

              <div className="relative mb-4">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-[#1e293b]" />
                </div>
                <div className="relative flex justify-center text-[11px] uppercase tracking-[0.2em] text-[#94A3B8]">
                  <span className="bg-[#0b1118] px-2">or login with email</span>
                </div>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email" className="text-[#CBD5E1]">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="Enter your email"
                    value={loginData.email}
                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                    required
                    className="bg-[#06090d] border-[#1e293b] text-white placeholder:text-[#64748B] focus:border-[#00E53A] focus:ring-[#00E53A]/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password" className="text-[#CBD5E1]">Password</Label>
                  <div className="relative">
                    <Input
                      id="login-password"
                      type={showLoginPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      required
                      className="bg-[#06090d] border-[#1e293b] text-white placeholder:text-[#64748B] focus:border-[#00E53A] focus:ring-[#00E53A]/20"
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword((s) => !s)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-[#94A3B8]"
                      aria-label={showLoginPassword ? "Hide password" : "Show password"}
                    >
                      {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#00C836] to-[#00E53A] hover:from-[#00E53A] hover:to-[#00FF55] text-[#04080a] font-black py-3 rounded-xl shadow-[0_0_25px_rgba(0,229,58,0.5)] transition-all active:scale-[0.98]"
                  disabled={isLoading}
                >
                  {isLoading ? "Logging in..." : "Login"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
    <FloatingActionButton position="left" messageIntervalMs={10000} supportOnly />
    <style>{`
      /* ── Dark background (liquid-bg) ── */
      .liquid-bg {
        background-color: #06090d !important;
      }

      /* ── Slide‑up animation ── */
      @keyframes slide-up {
        from { transform: translateY(30px); opacity: 0; }
        to   { transform: translateY(0); opacity: 1; }
      }
      .animate-slide-up {
        animation: slide-up 0.6s ease-out;
      }

      /* ── Gradient text (green) ── */
      .gradient-text {
        background: linear-gradient(180deg, #f0fff0, #00FF55 40%, #00E53A 70%, #00C836);
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
      }

      /* ── Google Shimmer Button (colors updated to green theme) ── */
      .google-shimmer-button {
        position: relative;
        isolation: isolate;
        border: 1px solid rgba(0,229,58,0.30);
        background: linear-gradient(135deg, #0b1118 0%, #06090d 100%);
        box-shadow: 0 0 0 1px rgba(0,229,58,0.08), 0 18px 34px rgba(0,0,0,0.6);
        overflow: hidden;
      }

      .google-shimmer-button::before {
        content: "";
        position: absolute;
        inset: -2px;
        border-radius: 14px;
        padding: 1px;
        background: conic-gradient(
          from 0deg,
          rgba(0,229,58,0.2),
          rgba(0,255,85,0.8),
          rgba(0,229,58,0.8),
          rgba(0,200,54,0.8),
          rgba(0,255,85,0.8),
          rgba(0,229,58,0.2)
        );
        -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
        -webkit-mask-composite: xor;
        mask-composite: exclude;
        animation: google-border-spin 3s linear infinite;
        z-index: 0;
      }

      .google-shimmer-button::after {
        content: "";
        position: absolute;
        inset: 0;
        background: linear-gradient(
          120deg,
          transparent 0%,
          rgba(0,255,85,0.12) 28%,
          rgba(0,255,85,0.5) 45%,
          rgba(0,229,58,0.1) 60%,
          transparent 100%
        );
        transform: translateX(-140%);
        animation: google-sheen 2.6s ease-in-out infinite;
        z-index: 1;
      }

      .google-shimmer-button__shine {
        position: absolute;
        inset: 1px;
        border-radius: 12px;
        background: linear-gradient(135deg, rgba(0,229,58,0.18), rgba(0,200,54,0.08), rgba(255,255,255,0.02));
        z-index: 0;
      }

      @keyframes google-border-spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }

      @keyframes google-sheen {
        0% { transform: translateX(-160%); }
        55% { transform: translateX(160%); }
        100% { transform: translateX(160%); }
      }
    `}</style>
  </>
  );
};

export default Auth;
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Download, X } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const DISMISS_KEY = "renix-install-prompt-dismissed";
const REAPPEAR_DELAY_MS = 5 * 60 * 1000;
const INSTALL_REWARD_KEY = "renix-app-download-reward-claimed";

type BeforeInstallPromptEvent = Event & {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
};

const isStandaloneApp = () =>
  window.matchMedia("(display-mode: standalone)").matches ||
  ((window.navigator as Navigator & { standalone?: boolean }).standalone ??
    false);

const isMobileBrowser = () => {
  const ua = navigator.userAgent || "";
  return /android|iphone|ipad|ipod|mobile/i.test(ua);
};

const isIos = () => {
  const ua = navigator.userAgent || "";
  return /iphone|ipad|ipod/i.test(ua) && !/crios|fxios|opera mini/i.test(ua);
};

const getDismissUntil = (): number => {
  if (typeof window === "undefined") return 0;

  const value = Number(localStorage.getItem(DISMISS_KEY));
  return Number.isFinite(value) ? value : 0;
};

const InstallPwaPrompt = () => {
  const location = useLocation();
  const isAuthPage = location.pathname === "/" || location.pathname === "/auth";
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [hasInstalled, setHasInstalled] = useState(false);
  const reopenTimeoutRef = useRef<number | null>(null);

  const clearReopenTimer = () => {
    if (reopenTimeoutRef.current !== null) {
      window.clearTimeout(reopenTimeoutRef.current);
      reopenTimeoutRef.current = null;
    }
  };

  const claimInstallReward = async () => {
    if (localStorage.getItem(INSTALL_REWARD_KEY) === "true") return;

    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return;

    const { error } = await supabase.rpc("claim_app_download_bonus");
    if (error) {
      console.error("App download reward failed:", error);
      return;
    }

    localStorage.setItem(INSTALL_REWARD_KEY, "true");
    toast.success("₦10,000 app download bonus added to your balance!");
  };

  const scheduleReopen = () => {
    clearReopenTimer();

    if (typeof window === "undefined" || isStandaloneApp()) return;

    const reopenAt = Date.now() + REAPPEAR_DELAY_MS;
    localStorage.setItem(DISMISS_KEY, String(reopenAt));

    reopenTimeoutRef.current = window.setTimeout(() => {
      const dismissUntil = getDismissUntil();
      const shouldReopen = dismissUntil <= Date.now();

      if (shouldReopen && !isStandaloneApp()) {
        localStorage.removeItem(DISMISS_KEY);
        setShowPrompt(true);
      }
    }, REAPPEAR_DELAY_MS);
  };

  useEffect(() => {
    if (isStandaloneApp()) {
      setHasInstalled(true);
      setShowPrompt(false);
      clearReopenTimer();
      return;
    }

    const dismissUntil = getDismissUntil();
    const isTemporarilyDismissed = dismissUntil > Date.now();

    if (isTemporarilyDismissed) {
      setShowPrompt(false);
      const remainingDelay = Math.max(dismissUntil - Date.now(), 0);
      reopenTimeoutRef.current = window.setTimeout(() => {
        localStorage.removeItem(DISMISS_KEY);
        setShowPrompt(true);
      }, remainingDelay);
      return;
    }

    if (typeof window !== "undefined") {
      localStorage.removeItem(DISMISS_KEY);
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      if (!isStandaloneApp() && isMobileBrowser()) {
        setShowPrompt(true);
      }
    };

    const appInstalled = () => {
      setHasInstalled(true);
      setShowPrompt(false);
      clearReopenTimer();
      void claimInstallReward();
      if (typeof window !== "undefined") {
        localStorage.removeItem(DISMISS_KEY);
      }
    };

    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", appInstalled);

    if (isIos() && !isStandaloneApp()) {
      setShowPrompt(true);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      window.removeEventListener("appinstalled", appInstalled);
      clearReopenTimer();
    };
  }, []);

  useEffect(() => {
    if (isStandaloneApp()) {
      setHasInstalled(true);
      setShowPrompt(false);
    }
  }, []);

  const dismiss = () => {
    setShowPrompt(false);
    scheduleReopen();
  };

  const installApp = async () => {
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const choice = await deferredPrompt.userChoice;
        setShowPrompt(false);
        clearReopenTimer();
        if (choice.outcome === "accepted") {
          setHasInstalled(true);
          void claimInstallReward();
          if (typeof window !== "undefined") {
            localStorage.removeItem(DISMISS_KEY);
          }
        }
      } catch (error) {
        console.warn("PWA install prompt failed", error);
        window.alert(
          "Install did not start. Please use your browser menu and select 'Add to Home screen' to install the app.",
        );
        setShowPrompt(false);
      }
      return;
    }

    if (isIos()) {
      window.alert(
        "Open Safari’s share menu and choose 'Add to Home Screen' to install Renix-Ultra.",
      );
      setShowPrompt(false);
      return;
    }

    window.alert(
      "Your browser cannot start the install directly right now. Please open the browser menu and choose 'Add to Home screen' to install the app.",
    );
    setShowPrompt(false);
  };

  if (isAuthPage || !showPrompt || hasInstalled) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4 py-6"
      onClick={(event) => {
        if (event.target === event.currentTarget) dismiss();
      }}
    >
      <Card className="relative w-full max-w-md rounded-3xl border border-[#00E53A]/30 bg-[#0f0f0f]/95 p-6 shadow-[0_0_30px_rgba(0,229,58,0.3)] backdrop-blur-xl">
        <button
          type="button"
          onClick={dismiss}
          className="absolute right-4 top-4 rounded-full border border-[#00E53A]/30 bg-[#111111] p-2 text-muted-foreground hover:text-white"
          aria-label="Close install prompt"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-3xl border border-[#00E53A]/30 bg-[#111111] shadow-[0_0_20px_rgba(0,229,58,0.15)]">
            <img
              src="/Renix-Ultra-icon.svg"
              alt="Renix-Ultra icon"
              className="h-12 w-12"
            />
          </div>

          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-[#00FF55]">
              Renix-Ultra App
            </p>
            <h2 className="mt-2 text-2xl font-bold text-white">
              Install Renix-Ultra
            </h2>
          </div>

          <p className="text-sm text-muted-foreground">
            Download the app to receive notifications, stay updated instantly,
            and get an extra <span className="font-bold text-[#00FF55]">₦10,000</span> bonus.
            That makes your total welcome reward <span className="font-bold text-[#00FF55]">₦50,000</span>.
            If you already signed in on this browser, opening the app will keep
            you logged in automatically.
          </p>
          <p className="text-xs text-[#00FF55]">
            If install does not start automatically, use your browser menu and
            choose "Add to Home screen".
          </p>

          <div className="flex items-center gap-2 rounded-3xl bg-[#161616] px-4 py-3 text-left">
            <Download className="h-5 w-5 text-[#00FF55]" />
            <div>
              <p className="text-sm font-semibold text-white">
                Fast install for Android
              </p>
              <p className="text-xs text-muted-foreground">
                Tap Download Now and get your ₦10,000 app bonus.
              </p>
            </div>
          </div>

          <Button
            onClick={installApp}
            className="w-full bg-gradient-to-r from-[#00C836] to-[#00E53A] hover:from-[#00E53A] hover:to-[#00FF55] text-[#04080a] py-3 text-sm font-semibold shadow-[0_0_20px_rgba(0,229,58,0.4)] transition-all active:scale-[0.98]"
          >
            Download Now
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default InstallPwaPrompt;

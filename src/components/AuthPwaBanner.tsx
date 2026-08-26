import { useEffect, useState } from "react";
import { Download, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";

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
  ((window.navigator as Navigator & { standalone?: boolean }).standalone ?? false);

const isIos = () => {
  const ua = navigator.userAgent || "";
  return /iphone|ipad|ipod/i.test(ua) && !/crios|fxios|opera mini/i.test(ua);
};

const AuthPwaBanner = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    if (isStandaloneApp()) {
      setIsStandalone(true);
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const onInstalled = () => setIsStandalone(true);

    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", onInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  if (isStandalone) return null;

  const handleInstall = async () => {
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        await deferredPrompt.userChoice;
        setDeferredPrompt(null);
      } catch {
        window.alert(
          "Install did not start. Please use your browser menu and select 'Add to Home screen' to install the app."
        );
      }
      return;
    }

    if (isIos()) {
      window.alert(
        "Open Safari's share menu and choose 'Add to Home Screen' to install Renix-Ultra."
      );
      return;
    }

    window.alert(
      "Your browser cannot start the install directly right now. Please open the browser menu and choose 'Add to Home screen' to install the app."
    );
  };

  return (
    <div className="mt-5 overflow-hidden rounded-2xl border border-[#00E53A]/20 bg-gradient-to-br from-[#0f1a14] via-[#0b1118] to-[#0a1210] p-[1px]">
      <div className="rounded-[15px] bg-[#0f1419]/90 p-4">
        {/* Header */}
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#00E53A]/20 to-[#00C836]/20 border border-[#00E53A]/25 shadow-[0_0_15px_rgba(0,229,58,0.15)]">
            <Smartphone className="h-5 w-5 text-[#00E53A]" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-bold text-white leading-tight">Install Renix-Ultra App</h3>
            <p className="mt-0.5 inline-flex items-center gap-1.5 rounded-full bg-[#00E53A]/10 border border-[#00E53A]/20 px-2.5 py-0.5 text-[11px] font-semibold tracking-wide text-[#00FF55]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#00FF55] animate-pulse" />
              Fast install for Android
            </p>
          </div>
          <div className="hidden sm:flex h-7 w-7 items-center justify-center rounded-full bg-[#00E53A]/10 border border-[#00E53A]/20">
            <Download className="h-3.5 w-3.5 text-[#00E53A]" />
          </div>
        </div>

        {/* Description */}
        <p className="mt-3 text-xs leading-relaxed text-[#94A3B8]">
          Tap <span className="font-semibold text-white">Download Now</span> to have faster accessibility and more rewards.
        </p>

        {/* Button */}
        <Button
          type="button"
          onClick={handleInstall}
          className="mt-3.5 w-full bg-gradient-to-r from-[#00C836] to-[#00E53A] hover:from-[#00E53A] hover:to-[#00FF55] text-[#04080a] font-black py-3 rounded-xl shadow-[0_0_20px_rgba(0,229,58,0.4)] transition-all active:scale-[0.98] text-sm"
        >
          <Download className="mr-2 h-4 w-4" />
          Download Now
        </Button>

        <p className="mt-2 text-center text-[10px] leading-none text-[#64748B]">
          Works on Android & iOS • One-tap install
        </p>
      </div>
    </div>
  );
};

export default AuthPwaBanner;

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Download, X } from "lucide-react";

type BeforeInstallPromptEvent = Event & {
  readonly platforms: string[];
  readonly userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
  prompt(): Promise<void>;
};

const isStandaloneApp = () =>
  window.matchMedia("(display-mode: standalone)").matches ||
  ((window.navigator as Navigator & { standalone?: boolean }).standalone ?? false);

const isMobileBrowser = () => {
  const ua = navigator.userAgent || "";
  return /android|iphone|ipad|ipod|mobile/i.test(ua);
};

const isIos = () => {
  const ua = navigator.userAgent || "";
  return /iphone|ipad|ipod/i.test(ua) && !/crios|fxios|opera mini/i.test(ua);
};

const InstallPwaPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [hasInstalled, setHasInstalled] = useState(false);

  useEffect(() => {
    if (isStandaloneApp()) {
      setHasInstalled(true);
      return;
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
    };

    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", appInstalled);

    if (isIos() && !isStandaloneApp()) {
      setShowPrompt(true);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      window.removeEventListener("appinstalled", appInstalled);
    };
  }, []);

  useEffect(() => {
    if (isStandaloneApp()) {
      setHasInstalled(true);
      setShowPrompt(false);
    }
  }, []);

  const installApp = async () => {
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const choice = await deferredPrompt.userChoice;
        setShowPrompt(false);
        if (choice.outcome === "accepted") {
          setHasInstalled(true);
        }
      } catch (error) {
        console.warn("PWA install prompt failed", error);
        window.alert(
          "Install did not start. Please use your browser menu and select 'Add to Home screen' to install the app."
        );
        setShowPrompt(false);
      }
      return;
    }

    if (isIos()) {
      window.alert(
        "Open Safari’s share menu and choose 'Add to Home Screen' to install Earnix9ja."
      );
      setShowPrompt(false);
      return;
    }

    window.alert(
      "Your browser cannot start the install directly right now. Please open the browser menu and choose 'Add to Home screen' to install the app."
    );
    setShowPrompt(false);
  };

  const dismiss = () => {
    setShowPrompt(false);
  };

  if (!showPrompt || hasInstalled) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4 py-6">
      <Card className="relative w-full max-w-md rounded-3xl border border-[#EAB308]/30 bg-[#0f0f0f]/95 p-6 shadow-[0_0_30px_rgba(234,179,8,0.3)] backdrop-blur-xl">
        <button
          onClick={dismiss}
          className="absolute right-4 top-4 rounded-full border border-[#EAB308]/30 bg-[#111111] p-2 text-muted-foreground hover:text-white"
          aria-label="Close install prompt"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-3xl border border-[#EAB308]/30 bg-[#111111] shadow-[0_0_20px_rgba(234,179,8,0.15)]">
            <img src="/earnix9ja-icon.svg" alt="Earnix9ja icon" className="h-12 w-12" />
          </div>

          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-[#EAB308]">Earnix9ja App</p>
            <h2 className="mt-2 text-2xl font-bold text-white">Install Earnix9ja</h2>
          </div>

          <p className="text-sm text-muted-foreground">
            Download the app to receive notifications, stay updated instantly, and keep your earnings within reach.
            If you already signed in on this browser, opening the app will keep you logged in automatically.
          </p>
          <p className="text-xs text-[#EAB308]">
            If install does not start automatically, use your browser menu and choose "Add to Home screen".
          </p>

          <div className="flex items-center gap-2 rounded-3xl bg-[#161616] px-4 py-3 text-left">
            <Download className="h-5 w-5 text-secondary" />
            <div>
              <p className="text-sm font-semibold text-white">Fast install for Android</p>
              <p className="text-xs text-muted-foreground">Tap Download Now and add Earnix9ja to your home screen.</p>
            </div>
          </div>

          <Button onClick={installApp} className="w-full bg-gradient-to-r from-primary to-secondary text-black py-3 text-sm font-semibold">
            Download Now
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default InstallPwaPrompt;

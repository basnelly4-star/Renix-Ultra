import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Download, X } from "lucide-react";

type BeforeInstallPromptEvent = Event & {
  readonly platforms: string[];
  readonly userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
  prompt(): Promise<void>;
};

const InstallPwaPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      const dismissed = localStorage.getItem("earnix9ja_pwa_prompt_dismissed");
      const alreadyInstalled = window.matchMedia("(display-mode: standalone)").matches || (window.navigator as Navigator & { standalone?: boolean }).standalone;
      if (!dismissed && !alreadyInstalled) {
        setShowPrompt(true);
      }
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const installApp = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    if (choice.outcome === "accepted") {
      setShowPrompt(false);
    }
  };

  const dismiss = () => {
    localStorage.setItem("earnix9ja_pwa_prompt_dismissed", "true");
    setShowPrompt(false);
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-[100] sm:left-auto sm:right-4 sm:w-[360px]">
      <Card className="border border-[#EAB308]/30 bg-[#111111]/95 backdrop-blur-xl p-4 shadow-[0_0_20px_rgba(234,179,8,0.25)]">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <img src="/earnix9ja-icon.svg" alt="Earnix9ja logo" className="h-10 w-10 rounded-xl border border-[#EAB308]/20 bg-[#111111]" />
            <div>
              <p className="text-sm font-semibold text-white">Install Earnix9ja</p>
              <p className="text-xs text-muted-foreground">Get the full app experience on your phone and earn faster.</p>
            </div>
          </div>
          <button onClick={dismiss} className="text-muted-foreground hover:text-white" aria-label="Dismiss install prompt">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-3 flex gap-2">
          <Button onClick={installApp} className="flex-1 bg-gradient-to-r from-primary to-secondary text-black">Install App</Button>
          <Button variant="outline" onClick={dismiss} className="flex-1">Later</Button>
        </div>
      </Card>
    </div>
  );
};

export default InstallPwaPrompt;

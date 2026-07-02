import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X, History, Gift, User, DollarSign, MessageCircle, Radio, CheckCircle2, Users, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type FABProps = {
  position?: "left" | "right";
  messageIntervalMs?: number;
  supportOnly?: boolean;
};

export const FloatingActionButton = ({ position = "right", messageIntervalMs = 20000, supportOnly = false }: FABProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [telegramVisible, setTelegramVisible] = useState(true);
  const [supportMessage, setSupportMessage] = useState("Contact Support");
  const [showPasteLabel, setShowPasteLabel] = useState(false);
  const navigate = useNavigate();
  const sidebarRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const supportIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const pasteLabelTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const supportMessages = ["Support", "Contact Support", "Need Help"];

  const menuItems = [
    { icon: CheckCircle2, label: "Tasks", path: "/tasks" },
    { icon: History, label: "History", path: "/history" },
    { icon: Gift, label: "Referrals", path: "/referrals" },
    { icon: User, label: "Profile", path: "/profile" },
    { icon: DollarSign, label: "Withdraw", path: "/withdraw" },
    { icon: Users, label: "Community", path: "/community" },
    { icon: MessageCircle, label: "Support", path: "/support" },
  ];

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    setTelegramVisible(false);
  };

  useEffect(() => {
    if (supportOnly) {
      return;
    }

    if (!isOpen) {
      const timer = setTimeout(() => {
        setTelegramVisible(true);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen, supportOnly]);

  useEffect(() => {
    let messageIndex = 0;

    const updateMessage = () => {
      setSupportMessage(supportMessages[messageIndex]);
      setShowPasteLabel(true);

      if (pasteLabelTimeoutRef.current) {
        clearTimeout(pasteLabelTimeoutRef.current);
      }

      pasteLabelTimeoutRef.current = setTimeout(() => {
        setShowPasteLabel(false);
      }, 7200);

      messageIndex = (messageIndex + 1) % supportMessages.length;
    };

    updateMessage();
    supportIntervalRef.current = setInterval(updateMessage, messageIntervalMs);

    return () => {
      if (supportIntervalRef.current) {
        clearInterval(supportIntervalRef.current);
      }
      if (pasteLabelTimeoutRef.current) {
        clearTimeout(pasteLabelTimeoutRef.current);
      }
    };
  }, [messageIntervalMs]);

  return (
    <>
      <style>{`
        .tg-paste-label {
          position: absolute;
          right: 100%;
          top: 50%;
          transform: translate(6px, -50%) scaleX(0.04);
          transform-origin: right center;
          opacity: 0;
          white-space: nowrap;
          padding: 0.5rem 0.875rem;
          border-radius: 999px;
          font-size: 0.75rem;
          font-weight: 700;
          color: #ffffff;
          background: linear-gradient(90deg, rgba(59, 130, 246, 0.95), rgba(37, 99, 235, 0.95));
          box-shadow: 0 15px 30px rgba(59, 130, 246, 0.16);
          pointer-events: none;
        }

        .tg-paste-label--left {
          right: auto;
          left: 100%;
          transform-origin: left center;
        }

        .tg-paste-label--left.tg-paste-label--active {
          animation: tgPasteExtrudeLeft 7.2s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }

        .tg-paste-label--active {
          animation: tgPasteExtrude 7.2s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }

        @keyframes tgPasteExtrude {
          0% {
            opacity: 0;
            transform: translate(6px, -50%) scaleX(0.04);
          }
          8% {
            opacity: 1;
            transform: translate(6px, -50%) scaleX(1);
          }
          93% {
            opacity: 1;
            transform: translate(6px, -50%) scaleX(1);
          }
          100% {
            opacity: 0;
            transform: translate(6px, -50%) scaleX(0.04);
          }
        }

        @keyframes tgPasteExtrudeLeft {
          0% {
            opacity: 0;
            transform: translate(-6px, -50%) scaleX(0.04);
          }
          8% {
            opacity: 1;
            transform: translate(-6px, -50%) scaleX(1);
          }
          93% {
            opacity: 1;
            transform: translate(-6px, -50%) scaleX(1);
          }
          100% {
            opacity: 0;
            transform: translate(-6px, -50%) scaleX(0.04);
          }
        }

        .tg-icon-pushed {
          transform: translateX(-5px) scale(0.92);
        }
      `}</style>
      {!supportOnly && isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40" 
          onClick={() => setIsOpen(false)}
          style={{ pointerEvents: 'auto' }}
        />
      )}

      <div className={`fixed bottom-6 ${position === "left" ? "left-6" : "right-6"} z-50`} ref={sidebarRef}>
        {/* Telegram Support Circle - Absolute positioning above menu button */}
        {telegramVisible && (
          <div className={`absolute -top-20 ${position === "left" ? "left-0" : "right-0"}`}>
            <div className="relative">
              <div
                className={`tg-paste-label ${position === "left" ? "tg-paste-label--left" : ""} ${showPasteLabel ? "tg-paste-label--active" : ""}`}
                aria-hidden="true"
              >
                {supportMessage}
              </div>
              <button
                onClick={() => window.location.href = "https://t.me/Earnix9jasupport1"}
                className={`w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg flex items-center justify-center transition-all active:scale-95 touch-manipulation cursor-pointer z-10 ${showPasteLabel ? "tg-icon-pushed" : ""}`}
                style={{ WebkitTapHighlightColor: 'transparent', pointerEvents: 'auto' }}
                aria-label="Telegram Support"
                title="Telegram Support"
              >
                <Send className="w-6 h-6 text-white" />
              </button>
            </div>
          </div>
        )}

          {!supportOnly && isOpen && (
          <Card className="absolute bottom-16 right-0 p-2 bg-card/95 backdrop-blur-lg border-border/50 shadow-lg animate-fade-in mb-2" style={{ pointerEvents: 'auto', zIndex: 60 }}>
            <div className="flex flex-col gap-2">
              {menuItems.map((item, index) => (
                <button
                  key={index}
                  type="button"
                  className="flex items-center justify-start gap-3 hover:bg-muted px-4 py-2 rounded-md transition-colors touch-manipulation cursor-pointer min-h-[44px]"
                  style={{ WebkitTapHighlightColor: 'transparent' }}
                  onClick={() => {
                    navigate(item.path);
                    setIsOpen(false);
                  }}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </Card>
        )}

        {!supportOnly && (
          <button
            ref={menuButtonRef}
            type="button"
            onClick={toggleMenu}
            className={`w-14 h-14 rounded-full bg-gradient-to-r from-primary to-secondary shadow-lg glow-primary hover:opacity-90 flex items-center justify-center transition-all active:scale-95 touch-manipulation cursor-pointer relative ${position === "left" ? "ml-0" : "mr-0"}`}
            style={{ WebkitTapHighlightColor: 'transparent', pointerEvents: 'auto', zIndex: 20 }}
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        )}
      </div>
    </>
  );
};

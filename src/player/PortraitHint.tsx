import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "fhsw:portrait-hint-dismissed";

export interface PortraitHintProps {
  language: "en" | "zh";
}

/**
 * Shows a dismissible hint on mobile devices in portrait orientation,
 * suggesting the user rotate to landscape for best experience.
 *
 * Dismissal is stored in sessionStorage (resets per session).
 */
export default function PortraitHint({ language }: PortraitHintProps) {
  const [isPortrait, setIsPortrait] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    function checkOrientation() {
      if (typeof window === "undefined") return;
      const isMobile = window.innerWidth < 768;
      const portrait = window.innerHeight > window.innerWidth;
      setIsPortrait(isMobile && portrait);
    }

    checkOrientation();
    window.addEventListener("resize", checkOrientation);
    window.addEventListener("orientationchange", checkOrientation);

    return () => {
      window.removeEventListener("resize", checkOrientation);
      window.removeEventListener("orientationchange", checkOrientation);
    };
  }, []);

  // Check sessionStorage for dismissal
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      if (stored === "1") setDismissed(true);
    } catch {
      // sessionStorage unavailable
    }
  }, []);

  useEffect(() => {
    if (!isPortrait || dismissed) return;
    const id = window.setTimeout(() => {
      setDismissed(true);
      try {
        sessionStorage.setItem(STORAGE_KEY, "1");
      } catch {
        // ignore
      }
    }, 3000);
    return () => window.clearTimeout(id);
  }, [dismissed, isPortrait]);

  const handleDismiss = useCallback(() => {
    setDismissed(true);
    try {
      sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // ignore
    }
  }, []);

  if (!isPortrait || dismissed) return null;

  const message =
    language === "zh" ? "旋转设备可获得更大画面" : "Rotate for a larger view";
  const dismissLabel = language === "zh" ? "关闭" : "Dismiss";

  return (
    <div
      data-testid="portrait-hint"
      role="alert"
      className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 px-4 py-3 bg-ink text-paper rounded-xl shadow-lg flex items-center gap-3 max-w-[90vw]"
      style={{ animation: "slideUp 0.3s ease" }}
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="shrink-0"
      >
        {/* Phone rotated icon */}
        <rect x="5" y="2" width="14" height="20" rx="2" ry="2" transform="rotate(90 12 12)" />
        <line x1="12" y1="18" x2="12.01" y2="18" />
      </svg>
      <span className="text-sm">{message}</span>
      <button
        type="button"
        onClick={handleDismiss}
        className="ml-2 text-xs opacity-60 hover:opacity-100 transition-opacity shrink-0"
        aria-label={dismissLabel}
      >
        {dismissLabel}
      </button>
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateX(-50%) translateY(20px); }
          to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>
    </div>
  );
}

import { useEffect, type ReactNode } from "react";
import { useKeyboard } from "../hooks/useKeyboard";

export interface PureModeOverlayProps {
  isPureMode: boolean;
  onExitPure: () => void;
  children: ReactNode;
}

/**
 * Wrapper that enables Pure Mode presentation.
 *
 * When isPureMode is true:
 * - Sets data-pure-mode="true" on <html> so CSS can hide header, sidebar, bottombar
 * - Stage fills the viewport, centered
 * - Esc key calls onExitPure
 *
 * The stage wrapper always renders children (even in non-pure mode)
 * so the component can wrap the stage unconditionally.
 */
export default function PureModeOverlay({
  isPureMode,
  onExitPure,
  children,
}: PureModeOverlayProps) {
  // Set data-pure-mode on document root for CSS-based hiding of chrome
  useEffect(() => {
    document.documentElement.setAttribute(
      "data-pure-mode",
      isPureMode ? "true" : "false",
    );
    return () => {
      document.documentElement.removeAttribute("data-pure-mode");
    };
  }, [isPureMode]);

  // Esc key exits pure mode
  useKeyboard({
    onEsc: isPureMode ? onExitPure : undefined,
  });

  return (
    <div
      data-testid="pure-mode-stage"
      className={
        isPureMode
          ? "fixed inset-0 w-full h-full flex items-center justify-center z-40"
          : "w-full h-full"
      }
    >
      {children}
    </div>
  );
}

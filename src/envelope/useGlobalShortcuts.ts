import { useEffect, useRef } from "react";

export interface GlobalShortcutOptions {
  onCommandPalette?: () => void;
  onHelp?: () => void;
}

function ownsGlobalShortcuts(target: EventTarget | null) {
  if (!(target instanceof Element)) return false;
  const editable = target.closest("[contenteditable]");
  if (editable && editable.getAttribute("contenteditable") !== "false") {
    return true;
  }
  return Boolean(
    target.closest(
      [
        "input",
        "textarea",
        "select",
        "[role='menu']",
        "[role='menuitem']",
        "[role='dialog']",
        "[aria-haspopup='menu'][aria-expanded='true']",
      ].join(","),
    ),
  );
}

/** Global Catalog shortcuts only; Player input is owned by Player Runtime. */
export function useGlobalShortcuts({
  onCommandPalette,
  onHelp,
}: GlobalShortcutOptions = {}) {
  const handlersRef = useRef({ onCommandPalette, onHelp });
  handlersRef.current = { onCommandPalette, onHelp };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (ownsGlobalShortcuts(event.target)) return;
      const handlers = handlersRef.current;
      if (
        (event.metaKey || event.ctrlKey) &&
        !event.altKey &&
        event.key.toLowerCase() === "k" &&
        handlers.onCommandPalette
      ) {
        event.preventDefault();
        handlers.onCommandPalette();
      } else if (
        event.key === "?" &&
        !event.metaKey &&
        !event.ctrlKey &&
        !event.altKey &&
        handlers.onHelp
      ) {
        event.preventDefault();
        handlers.onHelp();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);
}

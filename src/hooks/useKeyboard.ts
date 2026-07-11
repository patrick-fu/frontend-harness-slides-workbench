import { useEffect, useRef } from "react";

export interface UseKeyboardOptions {
  /** Called when the Escape key is pressed. */
  onEsc?: () => void;
  /** Called when the ArrowRight key is pressed. */
  onArrowRight?: () => void;
  /** Called when the ArrowLeft key is pressed. */
  onArrowLeft?: () => void;
  /** Called when Space is pressed. */
  onSpace?: () => void;
  /** Called when Cmd+K or Ctrl+K is pressed. */
  onCommandPalette?: () => void;
  /** Called when ? is pressed. */
  onHelp?: () => void;
}

/**
 * Hook that attaches global keyboard event listeners.
 *
 * Currently handles:
 * - Escape → onEsc
 * - ArrowRight → onArrowRight
 * - ArrowLeft → onArrowLeft
 * - Space → onSpace
 * - Cmd+K / Ctrl+K → onCommandPalette
 * - ? → onHelp
 */
export function useKeyboard({
  onEsc,
  onArrowRight,
  onArrowLeft,
  onSpace,
  onCommandPalette,
  onHelp,
}: UseKeyboardOptions = {}): void {
  const onEscRef = useRef(onEsc);
  const onArrowRightRef = useRef(onArrowRight);
  const onArrowLeftRef = useRef(onArrowLeft);
  const onSpaceRef = useRef(onSpace);
  const onCommandPaletteRef = useRef(onCommandPalette);
  const onHelpRef = useRef(onHelp);

  onEscRef.current = onEsc;
  onArrowRightRef.current = onArrowRight;
  onArrowLeftRef.current = onArrowLeft;
  onSpaceRef.current = onSpace;
  onCommandPaletteRef.current = onCommandPalette;
  onHelpRef.current = onHelp;

  useEffect(() => {
    function isShortcutSuppressed(target: EventTarget | null): boolean {
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
            "[role='menuitemcheckbox']",
            "[role='menuitemradio']",
            "[aria-haspopup='menu'][aria-expanded='true']",
            "[role='dialog']",
            "[aria-haspopup='menu']",
          ].join(","),
        ),
      );
    }

    function handleKeyDown(e: KeyboardEvent) {
      if (isShortcutSuppressed(e.target)) return;

      if (
        (e.metaKey || e.ctrlKey) &&
        !e.altKey &&
        e.key.toLowerCase() === "k" &&
        onCommandPaletteRef.current
      ) {
        e.preventDefault();
        onCommandPaletteRef.current();
        return;
      }

      switch (e.key) {
        case "Escape":
          if (onEscRef.current) {
            e.preventDefault();
            onEscRef.current();
          }
          break;
        case "ArrowRight":
          if (onArrowRightRef.current) {
            e.preventDefault();
            onArrowRightRef.current();
          }
          break;
        case "ArrowLeft":
          if (onArrowLeftRef.current) {
            e.preventDefault();
            onArrowLeftRef.current();
          }
          break;
        case " ":
        case "Spacebar":
          if (onSpaceRef.current) {
            e.preventDefault();
            onSpaceRef.current();
          }
          break;
        case "?":
          if (
            !e.metaKey &&
            !e.ctrlKey &&
            !e.altKey &&
            onHelpRef.current
          ) {
            e.preventDefault();
            onHelpRef.current();
          }
          break;
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);
}

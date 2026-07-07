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
}

/**
 * Hook that attaches global keyboard event listeners.
 *
 * Currently handles:
 * - Escape → onEsc
 * - ArrowRight → onArrowRight
 * - ArrowLeft → onArrowLeft
 * - Space → onSpace
 */
export function useKeyboard({
  onEsc,
  onArrowRight,
  onArrowLeft,
  onSpace,
}: UseKeyboardOptions = {}): void {
  const onEscRef = useRef(onEsc);
  const onArrowRightRef = useRef(onArrowRight);
  const onArrowLeftRef = useRef(onArrowLeft);
  const onSpaceRef = useRef(onSpace);

  onEscRef.current = onEsc;
  onArrowRightRef.current = onArrowRight;
  onArrowLeftRef.current = onArrowLeft;
  onSpaceRef.current = onSpace;

  useEffect(() => {
    function isEditableTarget(target: EventTarget | null): boolean {
      if (!(target instanceof HTMLElement)) return false;
      const tagName = target.tagName.toLowerCase();
      return (
        tagName === "input" ||
        tagName === "textarea" ||
        tagName === "select" ||
        target.isContentEditable
      );
    }

    function handleKeyDown(e: KeyboardEvent) {
      if (isEditableTarget(e.target)) return;

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
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);
}

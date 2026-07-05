import { useEffect, useRef } from "react";

export interface UseKeyboardOptions {
  /** Called when the Escape key is pressed. */
  onEsc?: () => void;
  /** Called when the ArrowRight key is pressed. */
  onArrowRight?: () => void;
  /** Called when the ArrowLeft key is pressed. */
  onArrowLeft?: () => void;
}

/**
 * Hook that attaches global keyboard event listeners.
 *
 * Currently handles:
 * - Escape → onEsc
 * - ArrowRight → onArrowRight
 * - ArrowLeft → onArrowLeft
 */
export function useKeyboard({
  onEsc,
  onArrowRight,
  onArrowLeft,
}: UseKeyboardOptions = {}): void {
  const onEscRef = useRef(onEsc);
  const onArrowRightRef = useRef(onArrowRight);
  const onArrowLeftRef = useRef(onArrowLeft);

  onEscRef.current = onEsc;
  onArrowRightRef.current = onArrowRight;
  onArrowLeftRef.current = onArrowLeft;

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      switch (e.key) {
        case "Escape":
          onEscRef.current?.();
          break;
        case "ArrowRight":
          onArrowRightRef.current?.();
          break;
        case "ArrowLeft":
          onArrowLeftRef.current?.();
          break;
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);
}

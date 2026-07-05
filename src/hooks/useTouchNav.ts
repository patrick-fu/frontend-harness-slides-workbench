import { useEffect, useRef } from "react";
import type { RefObject } from "react";

export interface UseTouchNavOptions {
  /** Reference to the element to attach touch listeners to. */
  elementRef: RefObject<HTMLElement | null>;
  /** Called when navigating to next (swipe left or tap right half). */
  onNext: () => void;
  /** Called when navigating to previous (swipe right or tap left half). */
  onPrev: () => void;
  /** When false, no listeners are attached. */
  enabled: boolean;
}

const SWIPE_THRESHOLD = 50; // pixels

/**
 * Hook that attaches touch-based navigation to an element.
 *
 * - Horizontal swipe left (>= 50px, horizontal > vertical) → onNext
 * - Horizontal swipe right (>= 50px, horizontal > vertical) → onPrev
 * - Tap on right half → onNext (only if not a swipe)
 * - Tap on left half → onPrev (only if not a swipe)
 * - Vertical swipe: no-op
 */
export function useTouchNav({
  elementRef,
  onNext,
  onPrev,
  enabled,
}: UseTouchNavOptions): void {
  const onNextRef = useRef(onNext);
  const onPrevRef = useRef(onPrev);
  onNextRef.current = onNext;
  onPrevRef.current = onPrev;

  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const el = elementRef.current;
    if (!el) return;

    function handleTouchStart(e: TouchEvent) {
      const touch = e.touches[0];
      if (!touch) return;
      touchStartRef.current = { x: touch.clientX, y: touch.clientY };
    }

    function handleTouchEnd(e: TouchEvent) {
      const start = touchStartRef.current;
      touchStartRef.current = null;
      if (!start) return;

      const touch = e.changedTouches[0];
      if (!touch) return;

      const dx = touch.clientX - start.x;
      const dy = touch.clientY - start.y;
      const absDx = Math.abs(dx);
      const absDy = Math.abs(dy);

      // Vertical-dominant gesture → no-op
      if (absDy > absDx) return;

      // Horizontal swipe (above threshold)
      if (absDx >= SWIPE_THRESHOLD) {
        if (dx < 0) {
          // Swipe left → next
          onNextRef.current();
        } else {
          // Swipe right → prev
          onPrevRef.current();
        }
        return;
      }

      // Not a swipe → treat as tap, determine half based on start position
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const tapX = start.x - rect.left;
      const halfWidth = rect.width / 2;

      if (tapX > halfWidth) {
        // Tap on right half → next
        onNextRef.current();
      } else {
        // Tap on left half (including center) → prev
        onPrevRef.current();
      }
    }

    el.addEventListener("touchstart", handleTouchStart, { passive: true });
    el.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      el.removeEventListener("touchstart", handleTouchStart);
      el.removeEventListener("touchend", handleTouchEnd);
      touchStartRef.current = null;
    };
  }, [enabled, elementRef]);
}

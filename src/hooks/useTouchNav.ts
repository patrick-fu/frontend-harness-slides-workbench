import { useEffect, useRef } from "react";
import type { RefObject } from "react";
import {
  getStageTapNavigationDirection,
  getSwipeNavigationDirection,
  SWIPE_NAVIGATION_THRESHOLD,
} from "../utils/navigation";

export interface UseTouchNavOptions {
  /** Reference to the element to attach touch listeners to. */
  elementRef: RefObject<HTMLElement | null>;
  /** Called when navigating to next (swipe left/up or tap outside the left edge). */
  onNext: () => void;
  /** Called when navigating to previous (swipe right/down or left-edge tap). */
  onPrev: () => void;
  /** When false, no listeners are attached. */
  enabled: boolean;
}

/**
 * Hook that attaches touch-based navigation to an element.
 *
 * - Swipe left/up (>= 50px on the dominant axis) → onNext
 * - Swipe right/down (>= 50px on the dominant axis) → onPrev
 * - Tap left 20% → onPrev; remaining stage → onNext
 * - Interactive Stage targets opt out
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
    const stage = el;

    function isInteractiveTarget(target: EventTarget | null): boolean {
      if (!(target instanceof Element)) return false;
      return Boolean(
        target.closest(
          [
            "button",
            "a",
            "input",
            "textarea",
            "select",
            "summary",
            "[role='button']",
            "[role='link']",
            "[role='menuitem']",
            "[contenteditable]",
          ].join(","),
        ),
      );
    }

    function handleTouchStart(e: TouchEvent) {
      const touch = e.touches[0];
      if (!touch || e.touches.length !== 1) return;
      if (isInteractiveTarget(e.target)) {
        touchStartRef.current = null;
        return;
      }
      touchStartRef.current = { x: touch.clientX, y: touch.clientY };
    }

    function handleTouchEnd(e: TouchEvent) {
      const start = touchStartRef.current;
      touchStartRef.current = null;
      if (!start) return;

      const touch = e.changedTouches[0];
      if (!touch || isInteractiveTarget(e.target)) return;

      const end = { x: touch.clientX, y: touch.clientY };
      const swipeDirection = getSwipeNavigationDirection(start, end);
      if (swipeDirection) {
        if (swipeDirection === "next") onNextRef.current();
        else onPrevRef.current();
        return;
      }

      const maxDistance = Math.max(
        Math.abs(end.x - start.x),
        Math.abs(end.y - start.y),
      );
      if (maxDistance >= SWIPE_NAVIGATION_THRESHOLD) return;

      const rect = stage.getBoundingClientRect();
      const tapDirection = getStageTapNavigationDirection({
        clientX: start.x,
        stageLeft: rect.left,
        stageWidth: rect.width,
      });
      if (tapDirection === "next") onNextRef.current();
      else onPrevRef.current();
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

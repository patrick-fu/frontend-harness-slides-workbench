import { useRef, useCallback, useEffect } from "react";

export interface UseFlipOptions {
  /**
   * Dependencies that trigger a FLIP measurement when they change.
   * Typically `[beat]` or `[scene, beat]`.
   */
  watch: unknown[];
  /** Animation duration in ms. Default 400. */
  duration?: number;
  /** CSS easing function. Default cubic-bezier(0.16, 1, 0.3, 1). */
  easing?: string;
  /**
   * Optional CSS selector to scope FLIP to specific child elements.
   * If omitted, all direct children of the ref'd container are FLIP'd.
   */
  selector?: string;
}

export interface UseFlipReturn<T extends HTMLElement> {
  /** Attach this ref to the container whose children should FLIP. */
  ref: React.RefObject<T>;
  /**
   * Call this BEFORE the state change that will cause layout shifts.
   * It snapshots current positions. If you can't call it manually,
   * the hook auto-snapshots when `watch` deps change (via layout effect).
   */
  snapshot: () => void;
}

/**
 * FLIP animation hook for smooth element position transitions.
 *
 * Usage:
 * ```tsx
 * const { ref } = useFLIP({ watch: [beat], duration: 400 });
 * return <div ref={ref}>{items}</div>;
 * ```
 *
 * How it works:
 * 1. Before render (via useLayoutEffect), snapshot element positions (First)
 * 2. After render, measure new positions (Last)
 * 3. Compute delta (Invert) and apply transform to put elements back at old positions
 * 4. On next frame, remove transform — CSS transition animates to final position (Play)
 */
export function useFLIP<T extends HTMLElement>({
  watch,
  duration = 400,
  easing = "cubic-bezier(0.16, 1, 0.3, 1)",
  selector,
}: UseFlipOptions): UseFlipReturn<T> {
  const containerRef = useRef<T>(null);
  const firstPositions = useRef<Map<Element, { left: number; top: number }>>(
    new Map(),
  );
  const isAnimating = useRef(false);

  const getElements = useCallback((): Element[] => {
    const el = containerRef.current;
    if (!el) return [];
    if (selector) {
      return Array.from(el.querySelectorAll(selector));
    }
    return Array.from(el.children);
  }, [selector]);

  const snapshot = useCallback(() => {
    const elements = getElements();
    const map = new Map<Element, { left: number; top: number }>();
    for (const el of elements) {
      const rect = el.getBoundingClientRect();
      map.set(el, { left: rect.left, top: rect.top });
    }
    firstPositions.current = map;
  }, [getElements]);

  // Auto-snapshot before the watched state causes a re-render
  // We use a ref to track previous watch values
  const prevWatch = useRef(watch);
  const watchChanged = useRef(false);

  // Simple dep comparison
  const depsEqual = (a: unknown[], b: unknown[]): boolean => {
    if (a.length !== b.length) return false;
    return a.every((val, i) => val === b[i]);
  };

  if (!depsEqual(prevWatch.current, watch)) {
    watchChanged.current = true;
    // Snapshot immediately when we detect a change (synchronous)
    snapshot();
  }
  prevWatch.current = watch;

  // After render, apply the FLIP inversion and play animation
  useEffect(() => {
    if (!watchChanged.current) return;
    watchChanged.current = false;

    const elements = getElements();
    if (elements.length === 0) return;

    const previous = firstPositions.current;
    if (previous.size === 0) return;

    // Phase 1: Invert — set transform to put elements at old positions
    const toAnimate: Array<{
      el: HTMLElement;
      dx: number;
      dy: number;
    }> = [];

    for (const el of elements) {
      const first = previous.get(el);
      if (!first) continue; // new element, skip (will just appear)
      const last = el.getBoundingClientRect();
      const dx = first.left - last.left;
      const dy = first.top - last.top;
      if (dx === 0 && dy === 0) continue;

      const htmlEl = el as HTMLElement;
      const prevTransform = htmlEl.style.transform;

      // Set to inverted position WITHOUT transition
      htmlEl.style.transition = "none";
      htmlEl.style.transform = `translate(${dx}px, ${dy}px) ${prevTransform ? prevTransform : ""}`;

      toAnimate.push({ el: htmlEl, dx, dy });
    }

    if (toAnimate.length === 0) return;

    // Phase 2: Play — on next frame, remove transform with transition
    isAnimating.current = true;
    const frameId = requestAnimationFrame(() => {
      for (const { el } of toAnimate) {
        el.style.transition = `transform ${duration}ms ${easing}`;
        el.style.transform = "";
      }

      // Cleanup after animation
      setTimeout(() => {
        for (const { el } of toAnimate) {
          el.style.transition = "";
          el.style.transform = "";
        }
        isAnimating.current = false;
      }, duration + 50);
    });

    return () => {
      cancelAnimationFrame(frameId);
      for (const { el } of toAnimate) {
        el.style.transition = "";
        el.style.transform = "";
      }
      isAnimating.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watch, duration, easing, getElements]);

  return { ref: containerRef as React.RefObject<T>, snapshot };
}

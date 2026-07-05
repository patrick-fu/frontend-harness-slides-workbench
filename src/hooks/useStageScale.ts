import { useState, useEffect, useCallback, useRef } from "react";

const STAGE_WIDTH = 1920;
const STAGE_HEIGHT = 1080;

export interface StageScale {
  /** The computed scale factor (e.g. 0.5 means 50%). */
  scale: number;
  /** The scaled width in CSS pixels. */
  width: number;
  /** The scaled height in CSS pixels. */
  height: number;
}

/**
 * Hook that computes the scale factor to fit the 1920x1080 Stage
 * inside its container while preserving aspect ratio.
 *
 * Uses a ResizeObserver on the provided container ref to recalculate
 * whenever the container size changes.
 *
 * Returns { scale, width, height } where width/height are the scaled
 * dimensions in CSS pixels (1920 * scale, 1080 * scale).
 */
export function useStageScale(
  containerRef: React.RefObject<HTMLElement | null>,
): StageScale {
  const [scale, setScale] = useState(1);
  const roRef = useRef<ResizeObserver | null>(null);

  const computeScale = useCallback((el: HTMLElement) => {
    const rect = el.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return 1;

    const scaleX = rect.width / STAGE_WIDTH;
    const scaleY = rect.height / STAGE_HEIGHT;
    return Math.min(scaleX, scaleY);
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Initial computation
    setScale(computeScale(el));

    // Observe size changes
    if (typeof ResizeObserver !== "undefined") {
      const ro = new ResizeObserver((entries) => {
        for (const entry of entries) {
          setScale(computeScale(entry.target as HTMLElement));
        }
      });
      ro.observe(el);
      roRef.current = ro;

      return () => {
        ro.disconnect();
        roRef.current = null;
      };
    }

    // Fallback: window resize listener
    const handleResize = () => {
      setScale(computeScale(el));
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [containerRef, computeScale]);

  return {
    scale,
    width: STAGE_WIDTH * scale,
    height: STAGE_HEIGHT * scale,
  };
}

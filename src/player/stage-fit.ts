import { useCallback, useEffect, useState, type RefObject } from "react";

export const STAGE_WIDTH = 1920;
export const STAGE_HEIGHT = 1080;

export interface StageFit {
  scale: number;
  width: number;
  height: number;
}

export function calculateStageFit(width: number, height: number): StageFit {
  if (width <= 0 || height <= 0) {
    return { scale: 1, width: STAGE_WIDTH, height: STAGE_HEIGHT };
  }
  const scale = Math.min(width / STAGE_WIDTH, height / STAGE_HEIGHT);
  return {
    scale,
    width: Math.min(width, STAGE_WIDTH * scale),
    height: Math.min(height, STAGE_HEIGHT * scale),
  };
}

export function useStageFit(containerRef: RefObject<HTMLElement | null>) {
  const [fit, setFit] = useState<StageFit>(() =>
    calculateStageFit(STAGE_WIDTH, STAGE_HEIGHT),
  );
  const measure = useCallback((element: HTMLElement) => {
    const rect = element.getBoundingClientRect();
    setFit(calculateStageFit(rect.width, rect.height));
  }, []);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;
    measure(element);
    if (typeof ResizeObserver !== "undefined") {
      const observer = new ResizeObserver(() => measure(element));
      observer.observe(element);
      return () => observer.disconnect();
    }
    const handleResize = () => measure(element);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [containerRef, measure]);

  return fit;
}

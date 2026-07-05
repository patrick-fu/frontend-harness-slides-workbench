import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

interface ReducedMotionContextValue {
  reducedMotion: boolean;
}

const ReducedMotionContext = createContext<ReducedMotionContextValue | null>(
  null,
);

export function ReducedMotionProvider({ children }: { children: ReactNode }) {
  const [reducedMotion, setReducedMotion] = useState<boolean>(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function")
      return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function")
      return;
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches);
    };
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  return (
    <ReducedMotionContext.Provider value={{ reducedMotion }}>
      {children}
    </ReducedMotionContext.Provider>
  );
}

export function useReducedMotion(): ReducedMotionContextValue {
  const ctx = useContext(ReducedMotionContext);
  if (!ctx) {
    throw new Error(
      "useReducedMotion must be used within a ReducedMotionProvider",
    );
  }
  return ctx;
}

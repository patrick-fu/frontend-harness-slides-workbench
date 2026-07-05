import { describe, it, expect, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { ReducedMotionProvider, useReducedMotion } from "./ReducedMotionContext";

describe("ReducedMotionContext", () => {
  beforeEach(() => {
    // Reset any mock state
  });

  it("exposes reducedMotion as a boolean", () => {
    const { result } = renderHook(() => useReducedMotion(), {
      wrapper: ReducedMotionProvider,
    });
    expect(typeof result.current.reducedMotion).toBe("boolean");
  });

  it("exposes the correct context value shape", () => {
    const { result } = renderHook(() => useReducedMotion(), {
      wrapper: ReducedMotionProvider,
    });
    expect(result.current).toHaveProperty("reducedMotion");
    expect(Object.keys(result.current)).toEqual(["reducedMotion"]);
  });

  it("defaults to false in jsdom (no prefers-reduced-motion support)", () => {
    const { result } = renderHook(() => useReducedMotion(), {
      wrapper: ReducedMotionProvider,
    });
    expect(result.current.reducedMotion).toBe(false);
  });
});

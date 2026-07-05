import { describe, it, expect, vi, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useKeyboard } from "./useKeyboard";

describe("useKeyboard", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("calls onEsc when Escape key is pressed", () => {
    const onEsc = vi.fn();
    renderHook(() => useKeyboard({ onEsc }));

    act(() => {
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    });

    expect(onEsc).toHaveBeenCalledTimes(1);
  });

  it("does not call onEsc for other keys", () => {
    const onEsc = vi.fn();
    renderHook(() => useKeyboard({ onEsc }));

    act(() => {
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight" }));
    });
    act(() => {
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "a" }));
    });

    expect(onEsc).not.toHaveBeenCalled();
  });

  it("calls onArrowRight when ArrowRight is pressed", () => {
    const onArrowRight = vi.fn();
    renderHook(() => useKeyboard({ onArrowRight }));

    act(() => {
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight" }));
    });

    expect(onArrowRight).toHaveBeenCalledTimes(1);
  });

  it("calls onArrowLeft when ArrowLeft is pressed", () => {
    const onArrowLeft = vi.fn();
    renderHook(() => useKeyboard({ onArrowLeft }));

    act(() => {
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowLeft" }));
    });

    expect(onArrowLeft).toHaveBeenCalledTimes(1);
  });

  it("supports all handlers simultaneously", () => {
    const onEsc = vi.fn();
    const onArrowRight = vi.fn();
    const onArrowLeft = vi.fn();
    renderHook(() => useKeyboard({ onEsc, onArrowRight, onArrowLeft }));

    act(() => {
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    });
    act(() => {
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight" }));
    });
    act(() => {
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowLeft" }));
    });

    expect(onEsc).toHaveBeenCalledTimes(1);
    expect(onArrowRight).toHaveBeenCalledTimes(1);
    expect(onArrowLeft).toHaveBeenCalledTimes(1);
  });

  it("removes listener on unmount", () => {
    const onEsc = vi.fn();
    const { unmount } = renderHook(() => useKeyboard({ onEsc }));

    unmount();

    act(() => {
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    });

    expect(onEsc).not.toHaveBeenCalled();
  });

  it("uses latest handler reference (no stale closure)", () => {
    const onEsc1 = vi.fn();
    const onEsc2 = vi.fn();
    const { rerender } = renderHook(
      ({ handler }) => useKeyboard({ onEsc: handler }),
      { initialProps: { handler: onEsc1 } },
    );

    rerender({ handler: onEsc2 });

    act(() => {
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    });

    expect(onEsc1).not.toHaveBeenCalled();
    expect(onEsc2).toHaveBeenCalledTimes(1);
  });

  it("does not throw when handlers are undefined", () => {
    expect(() => {
      const { unmount } = renderHook(() => useKeyboard({}));
      unmount();
    }).not.toThrow();
  });
});

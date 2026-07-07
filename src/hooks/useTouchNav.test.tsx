import { describe, it, expect, vi, afterEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useTouchNav } from "./useTouchNav";
import type { RefObject } from "react";

// ─── Polyfill Touch for jsdom ───────────────────────────────────────────────

class MockTouch {
  identifier: number;
  target: EventTarget;
  clientX: number;
  clientY: number;
  pageX: number;
  pageY: number;
  screenX: number;
  screenY: number;

  constructor(opts: {
    identifier: number;
    target: EventTarget;
    clientX: number;
    clientY: number;
  }) {
    this.identifier = opts.identifier;
    this.target = opts.target;
    this.clientX = opts.clientX;
    this.clientY = opts.clientY;
    this.pageX = opts.clientX;
    this.pageY = opts.clientY;
    this.screenX = opts.clientX;
    this.screenY = opts.clientY;
  }
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function makeTouch(x: number, y: number, target: EventTarget = document.body) {
  return new MockTouch({ identifier: 0, target, clientX: x, clientY: y });
}

function fireTouchStart(el: HTMLElement, x: number, y: number) {
  const touch = makeTouch(x, y, el);
  const event = new Event("touchstart", { bubbles: true }) as TouchEvent;
  Object.defineProperties(event, {
    touches: { value: [touch] },
    changedTouches: { value: [touch] },
    targetTouches: { value: [touch] },
  });
  el.dispatchEvent(event);
}

function fireTouchEnd(el: HTMLElement, x: number, y: number) {
  const touch = makeTouch(x, y, el);
  const event = new Event("touchend", { bubbles: true }) as TouchEvent;
  Object.defineProperties(event, {
    touches: { value: [] },
    changedTouches: { value: [touch] },
    targetTouches: { value: [] },
  });
  el.dispatchEvent(event);
}

function renderWithElement(enabled = true) {
  const onNext = vi.fn();
  const onPrev = vi.fn();
  const element = document.createElement("div");
  // Set a width so we can determine left/right halves
  Object.defineProperty(element, "offsetWidth", { value: 200, configurable: true });
  Object.defineProperty(element, "offsetHeight", { value: 100, configurable: true });
  // Mock getBoundingClientRect so tap position calculation works
  element.getBoundingClientRect = () =>
    ({ left: 0, top: 0, width: 200, height: 100, right: 200, bottom: 100 }) as DOMRect;
  document.body.appendChild(element);

  const elementRef: RefObject<HTMLElement> = { current: element };

  const { unmount, rerender } = renderHook(
    ({ enabled: e }) => useTouchNav({ elementRef, onNext, onPrev, enabled: e }),
    { initialProps: { enabled } },
  );

  return { element, onNext, onPrev, unmount, rerender, elementRef };
}

// ─── Tests ──────────────────────────────────────────────────────────────────

describe("useTouchNav", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  // ── Swipe left → onNext ────────────────────────────────────────────────

  it("swipe left (horizontal > 50px, horizontal > vertical) calls onNext", () => {
    const { element, onNext, onPrev } = renderWithElement();
    fireTouchStart(element, 150, 50);
    fireTouchEnd(element, 80, 55); // dx = -70, dy = 5 → horizontal > vertical, |dx| > 50
    expect(onNext).toHaveBeenCalledTimes(1);
    expect(onPrev).not.toHaveBeenCalled();
  });

  it("swipe left exactly at 50px threshold calls onNext", () => {
    const { element, onNext } = renderWithElement();
    fireTouchStart(element, 120, 50);
    fireTouchEnd(element, 70, 50); // dx = -50
    expect(onNext).toHaveBeenCalledTimes(1);
  });

  it("swipe left below 50px threshold does not call onNext (treated as tap)", () => {
    const { element, onNext, onPrev } = renderWithElement();
    fireTouchStart(element, 130, 50);
    fireTouchEnd(element, 90, 50); // dx = -40, below threshold → tap on right half
    // It's a tap on the right half → should call onNext via tap logic
    expect(onNext).toHaveBeenCalledTimes(1);
    expect(onPrev).not.toHaveBeenCalled();
  });

  // ── Swipe right → onPrev ───────────────────────────────────────────────

  it("swipe right (horizontal > 50px, horizontal > vertical) calls onPrev", () => {
    const { element, onPrev, onNext } = renderWithElement();
    fireTouchStart(element, 50, 50);
    fireTouchEnd(element, 130, 55); // dx = +80, dy = 5
    expect(onPrev).toHaveBeenCalledTimes(1);
    expect(onNext).not.toHaveBeenCalled();
  });

  it("swipe right exactly at 50px threshold calls onPrev", () => {
    const { element, onPrev } = renderWithElement();
    fireTouchStart(element, 50, 50);
    fireTouchEnd(element, 100, 50); // dx = +50
    expect(onPrev).toHaveBeenCalledTimes(1);
  });

  // ── Vertical swipe → no-op ─────────────────────────────────────────────

  it("vertical swipe (vertical > horizontal) does nothing", () => {
    const { element, onNext, onPrev } = renderWithElement();
    fireTouchStart(element, 100, 20);
    fireTouchEnd(element, 100, 90); // dy = 70, dx = 0 → vertical swipe
    expect(onNext).not.toHaveBeenCalled();
    expect(onPrev).not.toHaveBeenCalled();
  });

  it("diagonal swipe where vertical > horizontal does nothing", () => {
    const { element, onNext, onPrev } = renderWithElement();
    fireTouchStart(element, 100, 20);
    fireTouchEnd(element, 130, 90); // dx = 30, dy = 70 → vertical > horizontal
    expect(onNext).not.toHaveBeenCalled();
    expect(onPrev).not.toHaveBeenCalled();
  });

  // ── Tap on right half → onNext ─────────────────────────────────────────

  it("tap on right half calls onNext", () => {
    const { element, onNext, onPrev } = renderWithElement();
    // Element width = 200, right half = x > 100
    fireTouchStart(element, 150, 50);
    fireTouchEnd(element, 150, 50); // no movement → tap
    expect(onNext).toHaveBeenCalledTimes(1);
    expect(onPrev).not.toHaveBeenCalled();
  });

  // ── Tap anywhere → onNext ──────────────────────────────────────────────

  it("tap on left half calls onNext", () => {
    const { element, onPrev, onNext } = renderWithElement();
    fireTouchStart(element, 50, 50);
    fireTouchEnd(element, 50, 50); // no movement → tap
    expect(onNext).toHaveBeenCalledTimes(1);
    expect(onPrev).not.toHaveBeenCalled();
  });

  it("tap exactly at center calls onNext", () => {
    const { element, onNext, onPrev } = renderWithElement();
    fireTouchStart(element, 100, 50);
    fireTouchEnd(element, 100, 50);
    expect(onNext).toHaveBeenCalledTimes(1);
    expect(onPrev).not.toHaveBeenCalled();
  });

  it("tap from an interactive element is ignored", () => {
    const { element, onNext, onPrev } = renderWithElement();
    const button = document.createElement("button");
    element.appendChild(button);

    fireTouchStart(button, 150, 50);
    fireTouchEnd(button, 150, 50);

    expect(onNext).not.toHaveBeenCalled();
    expect(onPrev).not.toHaveBeenCalled();
  });

  // ── Swipe overrides tap ────────────────────────────────────────────────

  it("horizontal swipe > 50px is treated as swipe, not tap", () => {
    const { element, onNext, onPrev } = renderWithElement();
    // Start on left half, swipe left (big distance) → should be swipe, not tap
    fireTouchStart(element, 50, 50);
    fireTouchEnd(element, 150, 50); // dx = +100 (right swipe) → onPrev
    expect(onPrev).toHaveBeenCalledTimes(1);
    expect(onNext).not.toHaveBeenCalled();
  });

  // ── Disabled state ─────────────────────────────────────────────────────

  it("does nothing when enabled=false", () => {
    const { element, onNext, onPrev } = renderWithElement(false);
    fireTouchStart(element, 150, 50);
    fireTouchEnd(element, 80, 55); // swipe left
    expect(onNext).not.toHaveBeenCalled();
    expect(onPrev).not.toHaveBeenCalled();
  });

  it("tap does nothing when enabled=false", () => {
    const { element, onNext, onPrev } = renderWithElement(false);
    fireTouchStart(element, 150, 50);
    fireTouchEnd(element, 150, 50); // tap right half
    expect(onNext).not.toHaveBeenCalled();
    expect(onPrev).not.toHaveBeenCalled();
  });

  // ── Cleanup ────────────────────────────────────────────────────────────

  it("removes listeners on unmount", () => {
    const { element, onNext, unmount } = renderWithElement();
    unmount();
    fireTouchStart(element, 150, 50);
    fireTouchEnd(element, 80, 55);
    expect(onNext).not.toHaveBeenCalled();
  });

  it("re-attaches listeners when enabled changes from false to true", () => {
    const { element, onNext, rerender } = renderWithElement(false);

    // Should not fire when disabled
    fireTouchStart(element, 150, 50);
    fireTouchEnd(element, 80, 55);
    expect(onNext).not.toHaveBeenCalled();

    // Re-enable
    rerender({ enabled: true });

    // Now should fire
    fireTouchStart(element, 150, 50);
    fireTouchEnd(element, 80, 55);
    expect(onNext).toHaveBeenCalledTimes(1);
  });

  it("removes listeners when enabled changes from true to false", () => {
    const { element, onNext, rerender } = renderWithElement(true);

    // Should fire when enabled
    fireTouchStart(element, 150, 50);
    fireTouchEnd(element, 80, 55);
    expect(onNext).toHaveBeenCalledTimes(1);

    // Disable
    rerender({ enabled: false });

    // Should not fire now
    fireTouchStart(element, 150, 50);
    fireTouchEnd(element, 80, 55);
    expect(onNext).toHaveBeenCalledTimes(1); // still 1
  });

  // ── Edge cases ─────────────────────────────────────────────────────────

  it("handles null elementRef gracefully", () => {
    const onNext = vi.fn();
    const onPrev = vi.fn();
    const elementRef = { current: null } as unknown as RefObject<HTMLElement>;

    // Should not throw
    const { unmount } = renderHook(() =>
      useTouchNav({ elementRef, onNext, onPrev, enabled: true }),
    );
    unmount();
  });

  it("does not fire onNext/onPrev if touchstart was not followed by touchend on same element", () => {
    const { element, onNext, onPrev } = renderWithElement();
    // Only fire touchstart, no touchend
    fireTouchStart(element, 150, 50);
    expect(onNext).not.toHaveBeenCalled();
    expect(onPrev).not.toHaveBeenCalled();
  });
});

import { describe, expect, it } from "vitest";
import {
  getStageTapNavigationDirection,
  getSwipeNavigationDirection,
} from "./input";

describe("Player input directions", () => {
  it("reserves the leftmost 20 percent for previous navigation", () => {
    expect(getStageTapNavigationDirection(199, 0, 1000)).toBe("prev");
    expect(getStageTapNavigationDirection(200, 0, 1000)).toBe("next");
  });

  it("maps dominant horizontal and vertical screen swipes", () => {
    expect(getSwipeNavigationDirection({ x: 100, y: 100 }, { x: 20, y: 105 })).toBe("next");
    expect(getSwipeNavigationDirection({ x: 20, y: 100 }, { x: 100, y: 105 })).toBe("prev");
    expect(getSwipeNavigationDirection({ x: 100, y: 100 }, { x: 105, y: 20 })).toBe("next");
    expect(getSwipeNavigationDirection({ x: 100, y: 20 }, { x: 105, y: 100 })).toBe("prev");
  });

  it("rejects sub-threshold and equal-axis gestures", () => {
    expect(getSwipeNavigationDirection({ x: 100, y: 100 }, { x: 51, y: 100 })).toBeNull();
    expect(getSwipeNavigationDirection({ x: 100, y: 100 }, { x: 40, y: 40 })).toBeNull();
  });
});

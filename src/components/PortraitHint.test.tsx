import { act, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import PortraitHint from "./PortraitHint";

beforeEach(() => {
  sessionStorage.clear();
  Object.defineProperty(window, "innerWidth", { value: 390, configurable: true });
  Object.defineProperty(window, "innerHeight", { value: 844, configurable: true });
});

describe("PortraitHint", () => {
  it("dismisses itself after three seconds and stays dismissed for the session", () => {
    vi.useFakeTimers();
    render(<PortraitHint language="en" />);
    expect(screen.getByTestId("portrait-hint")).toBeVisible();

    act(() => vi.advanceTimersByTime(3000));

    expect(screen.queryByTestId("portrait-hint")).not.toBeInTheDocument();
    expect(sessionStorage.getItem("fhsw:portrait-hint-dismissed")).toBe("1");
    vi.useRealTimers();
  });
});

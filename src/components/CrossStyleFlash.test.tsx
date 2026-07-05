import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import CrossStyleFlash from "./CrossStyleFlash";

describe("CrossStyleFlash", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders style ID and name", () => {
    render(<CrossStyleFlash styleId="02" styleName="Swiss Precision" onDone={vi.fn()} />);
    expect(screen.getByText(/Style 02/)).toBeInTheDocument();
    expect(screen.getByText(/Swiss Precision/)).toBeInTheDocument();
  });

  it("has the correct data attribute for testing", () => {
    render(<CrossStyleFlash styleId="02" styleName="Swiss Precision" onDone={vi.fn()} />);
    const flash = screen.getByTestId("cross-style-flash");
    expect(flash).toBeInTheDocument();
    expect(flash).toHaveAttribute("data-style-id", "02");
  });

  it("calls onDone after animation completes (1200ms total)", () => {
    const onDone = vi.fn();
    render(<CrossStyleFlash styleId="01" styleName="Executive Silence" onDone={onDone} />);

    expect(onDone).not.toHaveBeenCalled();

    // 200ms fade-in + 800ms hold + 200ms fade-out = 1200ms
    act(() => {
      vi.advanceTimersByTime(1200);
    });

    expect(onDone).toHaveBeenCalledTimes(1);
  });

  it("does not call onDone before animation completes", () => {
    const onDone = vi.fn();
    render(<CrossStyleFlash styleId="01" styleName="Executive Silence" onDone={onDone} />);

    act(() => {
      vi.advanceTimersByTime(1199);
    });

    expect(onDone).not.toHaveBeenCalled();
  });

  it("renders with different style IDs and names", () => {
    const { unmount } = render(
      <CrossStyleFlash styleId="17" styleName="Editorial Broadsheet" onDone={vi.fn()} />,
    );
    expect(screen.getByText(/Style 17/)).toBeInTheDocument();
    expect(screen.getByText(/Editorial Broadsheet/)).toBeInTheDocument();
    unmount();
  });

  it("formats the display text as 'Style XX — Name'", () => {
    render(<CrossStyleFlash styleId="33" styleName="Glass Dashboard" onDone={vi.fn()} />);
    expect(screen.getByTestId("cross-style-flash")).toHaveTextContent("Style 33 — Glass Dashboard");
  });
});

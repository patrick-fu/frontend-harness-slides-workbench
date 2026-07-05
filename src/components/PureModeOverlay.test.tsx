import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import PureModeOverlay from "./PureModeOverlay";

describe("PureModeOverlay", () => {
  afterEach(() => {
    // Clean up data attributes
    document.documentElement.removeAttribute("data-pure-mode");
  });

  it("renders children when isPureMode=true", () => {
    render(
      <PureModeOverlay isPureMode={true} onExitPure={vi.fn()}>
        <div data-testid="stage-content">Stage</div>
      </PureModeOverlay>,
    );
    expect(screen.getByTestId("stage-content")).toBeInTheDocument();
  });

  it("renders children when isPureMode=false", () => {
    render(
      <PureModeOverlay isPureMode={false} onExitPure={vi.fn()}>
        <div data-testid="stage-content">Stage</div>
      </PureModeOverlay>,
    );
    expect(screen.getByTestId("stage-content")).toBeInTheDocument();
  });

  it("has data-testid='pure-mode-stage' on the stage wrapper", () => {
    render(
      <PureModeOverlay isPureMode={true} onExitPure={vi.fn()}>
        <div>Stage</div>
      </PureModeOverlay>,
    );
    const wrapper = screen.getByTestId("pure-mode-stage");
    expect(wrapper).toBeInTheDocument();
  });

  it("sets data-pure-mode='true' on document root when isPureMode=true", () => {
    render(
      <PureModeOverlay isPureMode={true} onExitPure={vi.fn()}>
        <div>Stage</div>
      </PureModeOverlay>,
    );
    expect(document.documentElement).toHaveAttribute("data-pure-mode", "true");
  });

  it("sets data-pure-mode='false' on document root when isPureMode=false", () => {
    render(
      <PureModeOverlay isPureMode={false} onExitPure={vi.fn()}>
        <div>Stage</div>
      </PureModeOverlay>,
    );
    expect(document.documentElement).toHaveAttribute("data-pure-mode", "false");
  });

  it("updates data-pure-mode when isPureMode changes", () => {
    const { rerender } = render(
      <PureModeOverlay isPureMode={false} onExitPure={vi.fn()}>
        <div>Stage</div>
      </PureModeOverlay>,
    );
    expect(document.documentElement).toHaveAttribute("data-pure-mode", "false");

    rerender(
      <PureModeOverlay isPureMode={true} onExitPure={vi.fn()}>
        <div>Stage</div>
      </PureModeOverlay>,
    );
    expect(document.documentElement).toHaveAttribute("data-pure-mode", "true");
  });

  it("calls onExitPure when Escape key is pressed", () => {
    const onExitPure = vi.fn();
    render(
      <PureModeOverlay isPureMode={true} onExitPure={onExitPure}>
        <div>Stage</div>
      </PureModeOverlay>,
    );

    act(() => {
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    });

    expect(onExitPure).toHaveBeenCalledTimes(1);
  });

  it("does not call onExitPure when Escape is pressed and isPureMode=false", () => {
    const onExitPure = vi.fn();
    render(
      <PureModeOverlay isPureMode={false} onExitPure={onExitPure}>
        <div>Stage</div>
      </PureModeOverlay>,
    );

    act(() => {
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    });

    expect(onExitPure).not.toHaveBeenCalled();
  });

  it("removes data-pure-mode attribute on unmount", () => {
    const { unmount } = render(
      <PureModeOverlay isPureMode={true} onExitPure={vi.fn()}>
        <div>Stage</div>
      </PureModeOverlay>,
    );
    expect(document.documentElement).toHaveAttribute("data-pure-mode", "true");

    unmount();
    expect(document.documentElement).not.toHaveAttribute("data-pure-mode");
  });

  it("stage wrapper fills the viewport when isPureMode=true", () => {
    render(
      <PureModeOverlay isPureMode={true} onExitPure={vi.fn()}>
        <div>Stage</div>
      </PureModeOverlay>,
    );
    const wrapper = screen.getByTestId("pure-mode-stage");
    // Should have classes that make it fill the viewport
    const cls = wrapper.className;
    expect(cls).toMatch(/fixed|absolute|w-full|h-full|inset-0/);
  });
});

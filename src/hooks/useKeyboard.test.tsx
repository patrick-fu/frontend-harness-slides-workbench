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

  it("calls onSpace when Space is pressed", () => {
    const onSpace = vi.fn();
    renderHook(() => useKeyboard({ onSpace }));

    act(() => {
      window.dispatchEvent(new KeyboardEvent("keydown", { key: " " }));
    });

    expect(onSpace).toHaveBeenCalledTimes(1);
  });

  it("opens the command palette for Ctrl+K and Cmd+K, but not plain K", () => {
    const onCommandPalette = vi.fn();
    renderHook(() => useKeyboard({ onCommandPalette }));

    const plainK = new KeyboardEvent("keydown", {
      key: "k",
      cancelable: true,
    });
    const ctrlK = new KeyboardEvent("keydown", {
      key: "k",
      ctrlKey: true,
      cancelable: true,
    });
    const metaK = new KeyboardEvent("keydown", {
      key: "K",
      metaKey: true,
      cancelable: true,
    });

    act(() => {
      window.dispatchEvent(plainK);
      window.dispatchEvent(ctrlK);
      window.dispatchEvent(metaK);
    });

    expect(onCommandPalette).toHaveBeenCalledTimes(2);
    expect(plainK.defaultPrevented).toBe(false);
    expect(ctrlK.defaultPrevented).toBe(true);
    expect(metaK.defaultPrevented).toBe(true);
  });

  it("opens the controls guide for ?", () => {
    const onHelp = vi.fn();
    renderHook(() => useKeyboard({ onHelp }));

    const questionMark = new KeyboardEvent("keydown", {
      key: "?",
      cancelable: true,
    });
    act(() => window.dispatchEvent(questionMark));

    expect(onHelp).toHaveBeenCalledTimes(1);
    expect(questionMark.defaultPrevented).toBe(true);
  });

  it("prevents default browser behavior for handled navigation keys", () => {
    const onArrowRight = vi.fn();
    const onArrowLeft = vi.fn();
    const onSpace = vi.fn();
    renderHook(() => useKeyboard({ onArrowRight, onArrowLeft, onSpace }));

    const right = new KeyboardEvent("keydown", {
      key: "ArrowRight",
      cancelable: true,
    });
    const left = new KeyboardEvent("keydown", {
      key: "ArrowLeft",
      cancelable: true,
    });
    const space = new KeyboardEvent("keydown", {
      key: " ",
      cancelable: true,
    });

    act(() => {
      window.dispatchEvent(right);
      window.dispatchEvent(left);
      window.dispatchEvent(space);
    });

    expect(right.defaultPrevented).toBe(true);
    expect(left.defaultPrevented).toBe(true);
    expect(space.defaultPrevented).toBe(true);
  });

  it("does not handle shortcuts when focus is in an editable element", () => {
    const onArrowRight = vi.fn();
    const input = document.createElement("input");
    document.body.appendChild(input);
    input.focus();

    renderHook(() => useKeyboard({ onArrowRight }));

    act(() => {
      input.dispatchEvent(
        new KeyboardEvent("keydown", {
          key: "ArrowRight",
          bubbles: true,
          cancelable: true,
        }),
      );
    });

    expect(onArrowRight).not.toHaveBeenCalled();
    input.remove();
  });

  it("does not handle shortcuts from a contenteditable target", () => {
    const onSpace = vi.fn();
    const editable = document.createElement("div");
    editable.setAttribute("contenteditable", "");
    document.body.appendChild(editable);
    editable.focus();

    renderHook(() => useKeyboard({ onSpace }));

    const space = new KeyboardEvent("keydown", {
      key: " ",
      bubbles: true,
      cancelable: true,
    });
    act(() => editable.dispatchEvent(space));

    expect(onSpace).not.toHaveBeenCalled();
    expect(space.defaultPrevented).toBe(false);
    editable.remove();
  });

  it("leaves Space available to a focused native button", () => {
    const onSpace = vi.fn();
    const button = document.createElement("button");
    document.body.appendChild(button);
    button.focus();

    renderHook(() => useKeyboard({ onSpace }));

    const space = new KeyboardEvent("keydown", {
      key: " ",
      bubbles: true,
      cancelable: true,
    });
    act(() => button.dispatchEvent(space));

    expect(onSpace).not.toHaveBeenCalled();
    expect(space.defaultPrevented).toBe(false);
    button.remove();
  });

  it("keeps Cmd/Ctrl+K available from a focused native button", () => {
    const onCommandPalette = vi.fn();
    const button = document.createElement("button");
    document.body.appendChild(button);
    button.focus();

    renderHook(() => useKeyboard({ onCommandPalette }));

    const ctrlK = new KeyboardEvent("keydown", {
      key: "k",
      ctrlKey: true,
      bubbles: true,
      cancelable: true,
    });
    const metaK = new KeyboardEvent("keydown", {
      key: "k",
      metaKey: true,
      bubbles: true,
      cancelable: true,
    });
    act(() => {
      button.dispatchEvent(ctrlK);
      button.dispatchEvent(metaK);
    });

    expect(onCommandPalette).toHaveBeenCalledTimes(2);
    expect(ctrlK.defaultPrevented).toBe(true);
    expect(metaK.defaultPrevented).toBe(true);
    button.remove();
  });

  it("leaves Arrow navigation available to a focused native link", () => {
    const onArrowRight = vi.fn();
    const link = document.createElement("a");
    link.href = "#scene-4";
    document.body.appendChild(link);
    link.focus();

    renderHook(() => useKeyboard({ onArrowRight }));

    const arrow = new KeyboardEvent("keydown", {
      key: "ArrowRight",
      bubbles: true,
      cancelable: true,
    });
    act(() => link.dispatchEvent(arrow));

    expect(onArrowRight).not.toHaveBeenCalled();
    expect(arrow.defaultPrevented).toBe(false);
    link.remove();
  });

  it("leaves Space available to a focused native disclosure control", () => {
    const onSpace = vi.fn();
    const details = document.createElement("details");
    const summary = document.createElement("summary");
    details.appendChild(summary);
    document.body.appendChild(details);
    summary.focus();

    renderHook(() => useKeyboard({ onSpace }));

    const space = new KeyboardEvent("keydown", {
      key: " ",
      bubbles: true,
      cancelable: true,
    });
    act(() => summary.dispatchEvent(space));

    expect(onSpace).not.toHaveBeenCalled();
    expect(space.defaultPrevented).toBe(false);
    details.remove();
  });

  it("suppresses presentation shortcuts while a menu owns focus", () => {
    const onArrowRight = vi.fn();
    const onCommandPalette = vi.fn();
    const onHelp = vi.fn();
    const menu = document.createElement("div");
    menu.setAttribute("role", "menu");
    const menuItem = document.createElement("button");
    menuItem.setAttribute("role", "menuitem");
    menu.appendChild(menuItem);
    document.body.appendChild(menu);
    menuItem.focus();

    renderHook(() =>
      useKeyboard({ onArrowRight, onCommandPalette, onHelp }),
    );

    const arrow = new KeyboardEvent("keydown", {
      key: "ArrowRight",
      bubbles: true,
      cancelable: true,
    });
    const command = new KeyboardEvent("keydown", {
      key: "k",
      ctrlKey: true,
      bubbles: true,
      cancelable: true,
    });
    const help = new KeyboardEvent("keydown", {
      key: "?",
      bubbles: true,
      cancelable: true,
    });

    act(() => {
      menuItem.dispatchEvent(arrow);
      menuItem.dispatchEvent(command);
      menuItem.dispatchEvent(help);
    });

    expect(onArrowRight).not.toHaveBeenCalled();
    expect(onCommandPalette).not.toHaveBeenCalled();
    expect(onHelp).not.toHaveBeenCalled();
    expect(arrow.defaultPrevented).toBe(false);
    expect(command.defaultPrevented).toBe(false);
    expect(help.defaultPrevented).toBe(false);
    menu.remove();
  });

  it("suppresses presentation shortcuts while a menu trigger owns focus", () => {
    const onArrowLeft = vi.fn();
    const trigger = document.createElement("button");
    trigger.setAttribute("aria-haspopup", "menu");
    document.body.appendChild(trigger);
    trigger.focus();

    renderHook(() => useKeyboard({ onArrowLeft }));

    const arrow = new KeyboardEvent("keydown", {
      key: "ArrowLeft",
      bubbles: true,
      cancelable: true,
    });
    act(() => trigger.dispatchEvent(arrow));

    expect(onArrowLeft).not.toHaveBeenCalled();
    expect(arrow.defaultPrevented).toBe(false);
    trigger.remove();
  });

  it("supports all handlers simultaneously", () => {
    const onEsc = vi.fn();
    const onArrowRight = vi.fn();
    const onArrowLeft = vi.fn();
    const onSpace = vi.fn();
    renderHook(() => useKeyboard({ onEsc, onArrowRight, onArrowLeft, onSpace }));

    act(() => {
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    });
    act(() => {
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight" }));
    });
    act(() => {
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowLeft" }));
    });
    act(() => {
      window.dispatchEvent(new KeyboardEvent("keydown", { key: " " }));
    });

    expect(onEsc).toHaveBeenCalledTimes(1);
    expect(onArrowRight).toHaveBeenCalledTimes(1);
    expect(onArrowLeft).toHaveBeenCalledTimes(1);
    expect(onSpace).toHaveBeenCalledTimes(1);
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

import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useGlobalShortcuts } from "./useGlobalShortcuts";

describe("useGlobalShortcuts", () => {
  afterEach(() => document.body.replaceChildren());

  it("opens Catalog search for Ctrl/Cmd+K and help for ?", () => {
    const onCommandPalette = vi.fn();
    const onHelp = vi.fn();
    renderHook(() => useGlobalShortcuts({ onCommandPalette, onHelp }));
    act(() => {
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", ctrlKey: true }));
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "K", metaKey: true }));
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "?" }));
    });
    expect(onCommandPalette).toHaveBeenCalledTimes(2);
    expect(onHelp).toHaveBeenCalledOnce();
  });

  it("yields global shortcuts to editable and menu-owned focus", () => {
    const onCommandPalette = vi.fn();
    const onHelp = vi.fn();
    renderHook(() => useGlobalShortcuts({ onCommandPalette, onHelp }));
    const input = document.createElement("input");
    const menuItem = document.createElement("button");
    menuItem.setAttribute("role", "menuitem");
    document.body.append(input, menuItem);
    act(() => {
      input.dispatchEvent(new KeyboardEvent("keydown", { key: "k", ctrlKey: true, bubbles: true }));
      menuItem.dispatchEvent(new KeyboardEvent("keydown", { key: "?", bubbles: true }));
    });
    expect(onCommandPalette).not.toHaveBeenCalled();
    expect(onHelp).not.toHaveBeenCalled();
  });

  it("keeps global search available from a focused native button", () => {
    const onCommandPalette = vi.fn();
    renderHook(() => useGlobalShortcuts({ onCommandPalette }));
    const button = document.createElement("button");
    document.body.appendChild(button);
    act(() =>
      button.dispatchEvent(
        new KeyboardEvent("keydown", {
          key: "k",
          ctrlKey: true,
          bubbles: true,
          cancelable: true,
        }),
      ),
    );
    expect(onCommandPalette).toHaveBeenCalledOnce();
  });
});

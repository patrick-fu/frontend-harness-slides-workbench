import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { ThemeProvider, useTheme } from "./ThemeContext";

describe("ThemeContext", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute("data-theme");
  });

  it("defaults to 'auto' when localStorage is empty", () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: ThemeProvider,
    });
    expect(result.current.theme).toBe("auto");
  });

  it("reads theme from localStorage on mount", () => {
    localStorage.setItem("fhsw:theme", "dark");
    const { result } = renderHook(() => useTheme(), {
      wrapper: ThemeProvider,
    });
    expect(result.current.theme).toBe("dark");
  });

  it("persists theme to localStorage when setTheme is called", () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: ThemeProvider,
    });
    act(() => {
      result.current.setTheme("light");
    });
    expect(result.current.theme).toBe("light");
    expect(localStorage.getItem("fhsw:theme")).toBe("light");
  });

  it("sets data-theme attribute on <html> when theme is set", () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: ThemeProvider,
    });
    act(() => {
      result.current.setTheme("dark");
    });
    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
  });

  it("resolvedTheme resolves 'auto' to a concrete value", () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: ThemeProvider,
    });
    expect(["light", "dark"]).toContain(result.current.resolvedTheme);
  });

  it("resolvedTheme matches explicit theme setting", () => {
    localStorage.setItem("fhsw:theme", "light");
    const { result } = renderHook(() => useTheme(), {
      wrapper: ThemeProvider,
    });
    expect(result.current.resolvedTheme).toBe("light");
  });

  it("exposes the correct context value shape", () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: ThemeProvider,
    });
    expect(result.current).toHaveProperty("theme");
    expect(result.current).toHaveProperty("setTheme");
    expect(result.current).toHaveProperty("resolvedTheme");
    expect(typeof result.current.setTheme).toBe("function");
    expect(["light", "dark", "auto"]).toContain(result.current.theme);
    expect(["light", "dark"]).toContain(result.current.resolvedTheme);
  });
});

import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { LanguageProvider, useLanguage } from "./LanguageContext";

describe("LanguageContext", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("defaults to 'auto' when localStorage is empty", () => {
    const { result } = renderHook(() => useLanguage(), {
      wrapper: LanguageProvider,
    });
    expect(result.current.language).toBe("auto");
  });

  it("resolvedLanguage defaults to 'en' when navigator.language is not zh", () => {
    const { result } = renderHook(() => useLanguage(), {
      wrapper: LanguageProvider,
    });
    // In jsdom, navigator.language is typically "en-US"
    expect(result.current.resolvedLanguage).toBe("en");
  });

  it("reads language from localStorage on mount", () => {
    localStorage.setItem("fhsw:language", "zh");
    const { result } = renderHook(() => useLanguage(), {
      wrapper: LanguageProvider,
    });
    expect(result.current.language).toBe("zh");
    expect(result.current.resolvedLanguage).toBe("zh");
  });

  it("reads 'auto' from localStorage on mount", () => {
    localStorage.setItem("fhsw:language", "auto");
    const { result } = renderHook(() => useLanguage(), {
      wrapper: LanguageProvider,
    });
    expect(result.current.language).toBe("auto");
  });

  it("persists language to localStorage when setLanguage is called", () => {
    const { result } = renderHook(() => useLanguage(), {
      wrapper: LanguageProvider,
    });
    act(() => {
      result.current.setLanguage("zh");
    });
    expect(result.current.language).toBe("zh");
    expect(result.current.resolvedLanguage).toBe("zh");
    expect(localStorage.getItem("fhsw:language")).toBe("zh");
  });

  it("setLanguage('auto') is persisted to localStorage", () => {
    const { result } = renderHook(() => useLanguage(), {
      wrapper: LanguageProvider,
    });
    act(() => {
      result.current.setLanguage("auto");
    });
    expect(result.current.language).toBe("auto");
    expect(localStorage.getItem("fhsw:language")).toBe("auto");
  });

  it("t() returns EN string for known key with default (auto) language", () => {
    const { result } = renderHook(() => useLanguage(), {
      wrapper: LanguageProvider,
    });
    expect(result.current.t("appTitle")).toBe("FH Slides Workbench");
  });

  it("t() returns ZH string when language is zh", () => {
    localStorage.setItem("fhsw:language", "zh");
    const { result } = renderHook(() => useLanguage(), {
      wrapper: LanguageProvider,
    });
    expect(result.current.t("overview")).toBe("总览");
  });

  it("t() falls back gracefully for unknown keys", () => {
    const { result } = renderHook(() => useLanguage(), {
      wrapper: LanguageProvider,
    });
    act(() => {
      result.current.setLanguage("zh");
    });
    expect(typeof result.current.t("appTitle")).toBe("string");
    expect(typeof result.current.t("nonexistent" as any)).toBe("string");
  });

  it("exposes the correct context value shape", () => {
    const { result } = renderHook(() => useLanguage(), {
      wrapper: LanguageProvider,
    });
    expect(result.current).toHaveProperty("language");
    expect(result.current).toHaveProperty("resolvedLanguage");
    expect(result.current).toHaveProperty("setLanguage");
    expect(result.current).toHaveProperty("t");
    expect(typeof result.current.t).toBe("function");
    expect(typeof result.current.setLanguage).toBe("function");
    expect(typeof result.current.resolvedLanguage).toBe("string");
  });
});

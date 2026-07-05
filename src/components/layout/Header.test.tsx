import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Header from "./Header";

// ─── Helpers ────────────────────────────────────────────────────────────────

function renderHeader(props: Partial<React.ComponentProps<typeof Header>> = {}) {
  const defaultProps = {
    onToggleSidebar: vi.fn(),
    onGoOverview: vi.fn(),
    language: "en" as const,
    setLanguage: vi.fn(),
    theme: "light" as const,
    setTheme: vi.fn(),
    ...props,
  };
  const result = render(<Header {...defaultProps} />);
  return {
    ...result,
    onToggleSidebar: defaultProps.onToggleSidebar,
    onGoOverview: defaultProps.onGoOverview,
    setLanguage: defaultProps.setLanguage,
    setTheme: defaultProps.setTheme,
  };
}

// ─── Semantic structure ─────────────────────────────────────────────────────

describe("Header — semantic structure", () => {
  it("renders a <header> element", () => {
    renderHeader();
    const header = screen.getByRole("banner");
    expect(header).toBeInTheDocument();
    expect(header.tagName).toBe("HEADER");
  });

  it("header spans full width and is fixed to top", () => {
    renderHeader();
    const header = screen.getByRole("banner");
    expect(header.className).toMatch(/fixed/);
    expect(header.className).toMatch(/top-0/);
    expect(header.className).toMatch(/w-full/);
  });
});

// ─── Hamburger / sidebar toggle ─────────────────────────────────────────────

describe("Header — sidebar toggle button", () => {
  it("renders a button with data-testid='sidebar-toggle'", () => {
    renderHeader();
    const btn = screen.getByTestId("sidebar-toggle");
    expect(btn).toBeInTheDocument();
    expect(btn.tagName).toBe("BUTTON");
  });

  it("clicking the sidebar toggle calls onToggleSidebar", () => {
    const { onToggleSidebar } = renderHeader();
    const btn = screen.getByTestId("sidebar-toggle");
    fireEvent.click(btn);
    expect(onToggleSidebar).toHaveBeenCalledTimes(1);
  });
});

// ─── App title / go to overview ─────────────────────────────────────────────

describe("Header — app title", () => {
  it("renders the app title text", () => {
    renderHeader();
    expect(
      screen.getByText("Frontend Harness Slides Workbench"),
    ).toBeInTheDocument();
  });

  it("clicking the title calls onGoOverview", () => {
    const { onGoOverview } = renderHeader();
    const title = screen.getByText("Frontend Harness Slides Workbench");
    fireEvent.click(title);
    expect(onGoOverview).toHaveBeenCalledTimes(1);
  });
});

// ─── Language segmented control ─────────────────────────────────────────────

describe("Header — language segmented control", () => {
  it("renders lang-toggle container", () => {
    renderHeader();
    expect(screen.getByTestId("lang-toggle")).toBeInTheDocument();
  });

  it("renders all three desktop language segments", () => {
    renderHeader();
    expect(screen.getByTestId("lang-segment-auto")).toBeInTheDocument();
    expect(screen.getByTestId("lang-segment-en")).toBeInTheDocument();
    expect(screen.getByTestId("lang-segment-zh")).toBeInTheDocument();
  });

  it("desktop EN segment is selected when language='en'", () => {
    renderHeader({ language: "en" });
    const en = screen.getByTestId("lang-segment-en");
    expect(en.className).toMatch(/bg-elevated/);
    expect(en.className).toMatch(/text-ink/);
  });

  it("desktop ZH segment is selected when language='zh'", () => {
    renderHeader({ language: "zh" });
    const zh = screen.getByTestId("lang-segment-zh");
    expect(zh.className).toMatch(/bg-elevated/);
    expect(zh.className).toMatch(/text-ink/);
  });

  it("desktop Auto segment is selected when language='auto'", () => {
    renderHeader({ language: "auto" });
    const auto = screen.getByTestId("lang-segment-auto");
    expect(auto.className).toMatch(/bg-elevated/);
    expect(auto.className).toMatch(/text-ink/);
  });

  it("unselected language segments are transparent", () => {
    renderHeader({ language: "en" });
    const auto = screen.getByTestId("lang-segment-auto");
    const zh = screen.getByTestId("lang-segment-zh");
    expect(auto.className).not.toMatch(/bg-elevated/);
    expect(zh.className).not.toMatch(/bg-elevated/);
  });

  it("clicking a language segment calls setLanguage with that value", () => {
    const { setLanguage } = renderHeader({ language: "en" });
    fireEvent.click(screen.getByTestId("lang-segment-zh"));
    expect(setLanguage).toHaveBeenCalledWith("zh");
  });

  it("renders mobile language cycling button", () => {
    renderHeader();
    expect(screen.getByTestId("lang-segment-mobile")).toBeInTheDocument();
  });

  it("mobile button shows 'EN' when language='en'", () => {
    renderHeader({ language: "en" });
    expect(screen.getByTestId("lang-segment-mobile")).toHaveTextContent("EN");
  });

  it("mobile button shows 'ZH' when language='zh'", () => {
    renderHeader({ language: "zh" });
    expect(screen.getByTestId("lang-segment-mobile")).toHaveTextContent("ZH");
  });

  it("mobile button shows globe SVG icon when language='auto'", () => {
    renderHeader({ language: "auto" });
    const btn = screen.getByTestId("lang-segment-mobile");
    expect(btn.querySelector("svg")).toBeInTheDocument();
  });

  it("clicking mobile language button cycles to next language", () => {
    const { setLanguage } = renderHeader({ language: "auto" });
    fireEvent.click(screen.getByTestId("lang-segment-mobile"));
    expect(setLanguage).toHaveBeenCalledWith("en");
  });
});

// ─── Theme segmented control ────────────────────────────────────────────────

describe("Header — theme segmented control", () => {
  it("renders theme-toggle container", () => {
    renderHeader();
    expect(screen.getByTestId("theme-toggle")).toBeInTheDocument();
  });

  it("renders all three desktop theme segments", () => {
    renderHeader();
    expect(screen.getByTestId("theme-segment-auto")).toBeInTheDocument();
    expect(screen.getByTestId("theme-segment-light")).toBeInTheDocument();
    expect(screen.getByTestId("theme-segment-dark")).toBeInTheDocument();
  });

  it("desktop light segment is selected when theme='light'", () => {
    renderHeader({ theme: "light" });
    const light = screen.getByTestId("theme-segment-light");
    expect(light.className).toMatch(/bg-elevated/);
    expect(light.className).toMatch(/text-ink/);
  });

  it("desktop dark segment is selected when theme='dark'", () => {
    renderHeader({ theme: "dark" });
    const dark = screen.getByTestId("theme-segment-dark");
    expect(dark.className).toMatch(/bg-elevated/);
    expect(dark.className).toMatch(/text-ink/);
  });

  it("desktop auto segment is selected when theme='auto'", () => {
    renderHeader({ theme: "auto" });
    const auto = screen.getByTestId("theme-segment-auto");
    expect(auto.className).toMatch(/bg-elevated/);
    expect(auto.className).toMatch(/text-ink/);
  });

  it("clicking a theme segment calls setTheme with that value", () => {
    const { setTheme } = renderHeader({ theme: "light" });
    fireEvent.click(screen.getByTestId("theme-segment-dark"));
    expect(setTheme).toHaveBeenCalledWith("dark");
  });

  it("renders mobile theme cycling button", () => {
    renderHeader();
    expect(screen.getByTestId("theme-segment-mobile")).toBeInTheDocument();
  });

  it("mobile button shows sun SVG icon when theme='light'", () => {
    renderHeader({ theme: "light" });
    const btn = screen.getByTestId("theme-segment-mobile");
    expect(btn.querySelector("svg")).toBeInTheDocument();
  });

  it("mobile button shows moon SVG icon when theme='dark'", () => {
    renderHeader({ theme: "dark" });
    const btn = screen.getByTestId("theme-segment-mobile");
    expect(btn.querySelector("svg")).toBeInTheDocument();
  });

  it("mobile button shows auto SVG icon when theme='auto'", () => {
    renderHeader({ theme: "auto" });
    const btn = screen.getByTestId("theme-segment-mobile");
    expect(btn.querySelector("svg")).toBeInTheDocument();
  });

  it("clicking mobile theme button cycles to next theme", () => {
    const { setTheme } = renderHeader({ theme: "auto" });
    fireEvent.click(screen.getByTestId("theme-segment-mobile"));
    expect(setTheme).toHaveBeenCalledWith("light");
  });
});

// ─── GitHub link ────────────────────────────────────────────────────────────

describe("Header — GitHub link", () => {
  it("renders a link to the GitHub repo with target='_blank'", () => {
    renderHeader();
    const link = screen.getByTestId("github-link") as HTMLAnchorElement;
    expect(link).toBeInTheDocument();
    expect(link.tagName).toBe("A");
    expect(link.href).toBe(
      "https://github.com/patrick-fu/frontend-harness-slides-workbench",
    );
    expect(link.target).toBe("_blank");
  });

  it("GitHub link has rel='noopener noreferrer'", () => {
    renderHeader();
    const link = screen.getByTestId("github-link") as HTMLAnchorElement;
    expect(link.rel).toContain("noopener");
    expect(link.rel).toContain("noreferrer");
  });
});

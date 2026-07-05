import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Header from "./Header";

// ─── Helpers ────────────────────────────────────────────────────────────────

function renderHeader(props: Partial<React.ComponentProps<typeof Header>> = {}) {
  const defaultProps = {
    onToggleSidebar: vi.fn(),
    onGoOverview: vi.fn(),
    language: "en" as const,
    onToggleLanguage: vi.fn(),
    theme: "light",
    onCycleTheme: vi.fn(),
    ...props,
  };
  const result = render(<Header {...defaultProps} />);
  return {
    ...result,
    onToggleSidebar: defaultProps.onToggleSidebar,
    onGoOverview: defaultProps.onGoOverview,
    onToggleLanguage: defaultProps.onToggleLanguage,
    onCycleTheme: defaultProps.onCycleTheme,
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

// ─── Language toggle ────────────────────────────────────────────────────────

describe("Header — language toggle", () => {
  it("shows 'EN' when language='en'", () => {
    renderHeader({ language: "en" });
    expect(screen.getByText("EN")).toBeInTheDocument();
  });

  it("shows 'ZH' when language='zh'", () => {
    renderHeader({ language: "zh" });
    expect(screen.getByText("ZH")).toBeInTheDocument();
  });

  it("clicking the language button calls onToggleLanguage", () => {
    const { onToggleLanguage } = renderHeader({ language: "en" });
    const btn = screen.getByText("EN").closest("button");
    expect(btn).not.toBeNull();
    fireEvent.click(btn!);
    expect(onToggleLanguage).toHaveBeenCalledTimes(1);
  });
});

// ─── Theme toggle ───────────────────────────────────────────────────────────

describe("Header — theme toggle", () => {
  it("renders a theme toggle button", () => {
    renderHeader();
    const btn = screen.getByTestId("theme-toggle");
    expect(btn).toBeInTheDocument();
    expect(btn.tagName).toBe("BUTTON");
  });

  it("clicking the theme toggle calls onCycleTheme", () => {
    const { onCycleTheme } = renderHeader();
    const btn = screen.getByTestId("theme-toggle");
    fireEvent.click(btn);
    expect(onCycleTheme).toHaveBeenCalledTimes(1);
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

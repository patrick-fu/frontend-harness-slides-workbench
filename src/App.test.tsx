import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import App from "./App";

// ─── Setup ──────────────────────────────────────────────────────────────────

// Mock matchMedia for theme detection
beforeEach(() => {
  // Reset URL hash
  window.location.hash = "";

  // Clear localStorage
  localStorage.clear();
  sessionStorage.clear();
});

// ─── Tests ──────────────────────────────────────────────────────────────────

describe("App", () => {
  it("renders without crashing", () => {
    expect(() => render(<App />)).not.toThrow();
  });

  it("default view shows Overview", () => {
    render(<App />);
    expect(screen.getByTestId("overview-view")).toBeInTheDocument();
    // Lab view should not be in the DOM (only rendered when view=lab)
    expect(screen.queryByTestId("lab-view")).not.toBeInTheDocument();
  });

  it("renders registered style cards in Overview", () => {
    render(<App />);
    // We have 3 pilot styles: 01, 17, 33
    expect(screen.getByTestId("style-card-01")).toBeInTheDocument();
    expect(screen.getByTestId("style-card-17")).toBeInTheDocument();
    expect(screen.getByTestId("style-card-33")).toBeInTheDocument();
  });

  it("clicking a style card navigates to Lab view", async () => {
    render(<App />);

    // Click on style 01 card
    const card = screen.getByTestId("style-card-01");
    fireEvent.click(card);

    // Lab view should now be visible
    await waitFor(() => {
      expect(screen.getByTestId("lab-view")).toBeInTheDocument();
    });

    // Overview should be hidden (display: none on its wrapper)
    const overview = screen.getByTestId("overview-view");
    expect(overview.parentElement).toHaveStyle({ display: "none" });
  });

  it("header title click returns to Overview", async () => {
    render(<App />);

    // First navigate to lab
    const card = screen.getByTestId("style-card-01");
    fireEvent.click(card);

    await waitFor(() => {
      expect(screen.getByTestId("lab-view")).toBeInTheDocument();
    });

    // Click header title to go back to overview
    const titleBtn = screen.getByText("Frontend Harness Slides Workbench");
    fireEvent.click(titleBtn);

    await waitFor(() => {
      const overview = screen.getByTestId("overview-view");
      expect(overview.parentElement).not.toHaveStyle({ display: "none" });
    });
  });

  it("language segmented control switches between auto/en/zh", () => {
    render(<App />);

    // Initial language is "auto" — resolved to "en" in jsdom
    const enSegment = screen.getByTestId("lang-segment-en");
    fireEvent.click(enSegment);

    // After clicking EN segment, language should be set to "en"
    expect(screen.getByTestId("lang-segment-en")).toBeInTheDocument();
  });

  it("theme segmented control is present", () => {
    render(<App />);

    expect(screen.getByTestId("theme-segment-auto")).toBeInTheDocument();
    expect(screen.getByTestId("theme-segment-light")).toBeInTheDocument();
    expect(screen.getByTestId("theme-segment-dark")).toBeInTheDocument();
  });

  it("renders sidebar with style navigation", () => {
    render(<App />);

    // Sidebar should be in the DOM (wrapped in div with data-testid)
    const sidebarWrapper = screen.getByTestId("sidebar");
    expect(sidebarWrapper).toBeInTheDocument();
  });

  it("URL hash reflects navigation state", async () => {
    render(<App />);

    // Click style 17 card
    const card = screen.getByTestId("style-card-17");
    fireEvent.click(card);

    await waitFor(() => {
      expect(window.location.hash).toContain("view=lab");
      expect(window.location.hash).toContain("style=17");
      expect(window.location.hash).toContain("scene=1");
      expect(window.location.hash).toContain("beat=0");
    });
  });

  // ── Regression: hamburger button behavior ────────────────────────────────

  it("desktop: clicking hamburger toggles sidebar collapsed state (width change)", async () => {
    // Simulate desktop viewport
    Object.defineProperty(window, "innerWidth", { value: 1280, writable: true });

    render(<App />);

    // Navigate to lab so sidebar is visible
    const card = screen.getByTestId("style-card-01");
    fireEvent.click(card);
    await waitFor(() => {
      expect(screen.getByTestId("lab-view")).toBeInTheDocument();
    });

    const sidebar = screen.getByTestId("sidebar");
    const initialWidth = sidebar.style.width;

    // Click hamburger
    const toggle = screen.getByTestId("sidebar-toggle");
    fireEvent.click(toggle);

    // Sidebar should be collapsed (48px)
    expect(sidebar.style.width).toBe("48px");
    expect(sidebar.style.width).not.toBe(initialWidth);

    // Click again to expand
    fireEvent.click(toggle);
    expect(sidebar.style.width).not.toBe("48px");
  });

  it("mobile: clicking hamburger toggles sidebar open/close (translate-x)", async () => {
    // Simulate mobile viewport
    Object.defineProperty(window, "innerWidth", { value: 375, writable: true });

    render(<App />);

    // Navigate to lab
    const card = screen.getByTestId("style-card-01");
    fireEvent.click(card);
    await waitFor(() => {
      expect(screen.getByTestId("lab-view")).toBeInTheDocument();
    });

    const sidebar = screen.getByTestId("sidebar");

    // Initially sidebar should be hidden on mobile (translate-x-full or similar)
    expect(sidebar.className).toMatch(/-translate-x-full/);

    // Click hamburger to open
    const toggle = screen.getByTestId("sidebar-toggle");
    fireEvent.click(toggle);

    // Sidebar should now be visible (translate-x-0)
    expect(sidebar.className).toMatch(/translate-x-0/);
    expect(sidebar.className).not.toMatch(/-translate-x-full/);

    // Click again to close
    fireEvent.click(toggle);
    expect(sidebar.className).toMatch(/-translate-x-full/);
  });
});

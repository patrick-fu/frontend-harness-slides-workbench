import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import App from "./App";

beforeEach(() => {
  window.history.replaceState(null, "", "/");
  localStorage.clear();
  sessionStorage.clear();
});

describe("Workbench Catalog + Player", () => {
  it("opens as a complete Topic Catalog", () => {
    render(<App />);
    expect(screen.getByTestId("overview-view")).toBeVisible();
    expect(screen.getAllByTestId("topic-card")).toHaveLength(146);
    expect(screen.getByTestId("catalog-summary")).toHaveTextContent(
      "All 146 Topics · 49 Styles",
    );
  });

  it("opens an exact Topic through a native Catalog link without using a hash", async () => {
    render(<App />);
    const card = screen.getAllByTestId("topic-card")[0];
    const link = card.querySelector("a");
    expect(link).toHaveAttribute(
      "href",
      expect.stringContaining("topic=product-keynote"),
    );
    fireEvent.click(link!);

    await waitFor(() => expect(screen.getByTestId("lab-view")).toBeVisible());
    expect(window.location.hash).toBe("");
    expect(window.location.search).toContain("view=lab");
    expect(window.location.search).toContain("style=minimal-product-keynote");
    expect(window.location.search).toContain("topic=product-keynote");
    expect(window.location.search).toContain("scene=1");
    expect(window.location.search).toContain("beat=0");
  });

  it("renders Stage-first Player navigation without a layout-pushing Sidebar", () => {
    window.history.replaceState(
      null,
      "",
      "/?view=lab&style=minimal-product-keynote&topic=product-keynote&scene=1&beat=0",
    );
    render(<App />);
    expect(screen.getByRole("navigation", { name: "Player navigation" })).toBeVisible();
    expect(screen.getByRole("button", { name: "Present" })).toBeVisible();
    expect(screen.getAllByTestId(/scene-dot-/)).toHaveLength(5);
    expect(screen.queryByTestId("sidebar")).not.toBeInTheDocument();
  });

  it("opens the Command Palette from Cmd/Ctrl+K", () => {
    render(<App />);
    fireEvent.keyDown(window, { key: "k", ctrlKey: true });
    expect(screen.getByRole("dialog", { name: "Command palette" })).toBeVisible();
  });

  it("preserves unresolved URL filters as an explicit unavailable state", () => {
    window.history.replaceState(
      null,
      "",
      "/?view=overview&model=Retired+Model",
    );
    render(<App />);
    expect(screen.getByTestId("catalog-unavailable-state")).toHaveTextContent(
      "Retired Model",
    );
    expect(window.location.search).toContain("model=Retired+Model");
  });

  it("keeps Pure Mode free of Workbench chrome", () => {
    window.history.replaceState(
      null,
      "",
      "/?view=lab&style=minimal-product-keynote&topic=product-keynote&scene=1&beat=0&pure=1",
    );
    render(<App />);
    expect(screen.getByTestId("stage")).toBeVisible();
    expect(screen.queryByRole("navigation", { name: "Player navigation" })).not.toBeInTheDocument();
    expect(screen.queryByTestId("bottom-bar")).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Present" })).not.toBeInTheDocument();
  });

  it("shows explicit recovery actions for a missing Topic", () => {
    window.history.replaceState(
      null,
      "",
      "/?view=lab&style=minimal-product-keynote&topic=missing-topic&scene=1&beat=0",
    );
    render(<App />);
    expect(screen.getByText("This slide deck is unavailable")).toBeVisible();
    expect(screen.getByRole("button", { name: "Open Library" })).toBeVisible();
  });
});

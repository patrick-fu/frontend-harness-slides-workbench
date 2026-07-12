import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import App from "./App";
import { CATALOG_MANIFEST } from "./catalog/manifest.generated";

const CATALOG_TOPIC_COUNT = CATALOG_MANIFEST.reduce(
  (total, style) => total + style.topics.length,
  0,
);

beforeEach(() => {
  window.history.replaceState(null, "", "/");
  localStorage.clear();
  sessionStorage.clear();
});

describe("Workbench Catalog + Player", () => {
  it("opens as a complete Topic Catalog", () => {
    render(<App />);
    expect(screen.getByTestId("catalog-view")).toBeVisible();
    expect(screen.getAllByTestId("topic-card")).toHaveLength(
      CATALOG_TOPIC_COUNT,
    );
    expect(screen.getByTestId("catalog-summary")).toHaveTextContent(
      `All ${CATALOG_TOPIC_COUNT} Topics · ${CATALOG_MANIFEST.length} Styles`,
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

    await waitFor(() => expect(screen.getByTestId("player-runtime")).toBeVisible());
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
    expect(screen.getByRole("button", { name: "Filter" })).toBeVisible();
    expect(screen.getAllByTestId(/scene-dot-/)).toHaveLength(5);
    expect(screen.queryByTestId("sidebar")).not.toBeInTheDocument();
  });

  it("edits Model Filters in Player and exposes the resulting Cycle Scope", async () => {
    window.history.replaceState(
      null,
      "",
      "/?view=lab&style=minimal-product-keynote&topic=product-keynote&scene=1&beat=0",
    );
    const matchingTopics = CATALOG_MANIFEST.flatMap((group) => group.topics)
      .filter((topic) => topic.modelId === "GPT 5.5").length;
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: "Filter" }));
    const dialog = screen.getByRole("dialog", { name: "Filters" });
    fireEvent.click(
      within(within(dialog).getByRole("group", { name: "Model ID" }))
        .getByRole("button", { name: /GPT 5\.5/ }),
    );

    await waitFor(() =>
      expect(new URLSearchParams(window.location.search).getAll("model"))
        .toEqual(["GPT 5.5"]),
    );
    expect(
      screen.getByRole("button", {
        name: `Current Topic outside filtered scope: ${matchingTopics} Topics`,
      }),
    ).toBeVisible();
    expect(screen.getByRole("button", { name: "Clear filters" })).toBeVisible();
  });

  it("limits the Topic Switcher to the active Cycle Scope and clears Filters in place", async () => {
    window.history.replaceState(
      null,
      "",
      "/?view=lab&style=minimal-product-keynote&topic=quiet-launch&scene=1&beat=0&model=GPT+5.5",
    );
    const matchingTopics = CATALOG_MANIFEST.flatMap((group) => group.topics)
      .filter((topic) => topic.modelId === "GPT 5.5").length;
    render(<App />);

    const scope = screen.getByRole("button", {
      name: `Filtered: ${matchingTopics} Topics`,
    });
    expect(scope).toBeVisible();
    fireEvent.click(
      screen.getByRole("button", {
        name: /Minimal Product Keynote.*Quiet Launch.*GPT 5\.5/,
      }),
    );
    expect(
      screen.getByRole("menuitemradio", { name: /Quiet Launch/ }),
    ).toBeVisible();
    expect(
      screen.queryByRole("menuitemradio", { name: /Product Keynote/ }),
    ).not.toBeInTheDocument();

    fireEvent.click(scope);
    const dialog = screen.getByRole("dialog", { name: "Filters" });
    fireEvent.click(within(dialog).getByRole("button", { name: "Clear all" }));

    await waitFor(() =>
      expect(new URLSearchParams(window.location.search).getAll("model"))
        .toEqual([]),
    );
    expect(screen.getByRole("button", { name: "Filter" })).toBeVisible();
    expect(dialog).toBeVisible();
  });

  it("clears active Player Filters from the persistent Cycle Scope Indicator", async () => {
    window.history.replaceState(
      null,
      "",
      "/?view=lab&style=minimal-product-keynote&topic=quiet-launch&scene=1&beat=0&model=GPT+5.5",
    );
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: "Clear filters" }));

    await waitFor(() =>
      expect(new URLSearchParams(window.location.search).getAll("model"))
        .toEqual([]),
    );
    expect(screen.getByRole("button", { name: "Filter" })).toBeVisible();
    expect(
      screen.queryByRole("button", { name: "Clear filters" }),
    ).not.toBeInTheDocument();
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
    expect(screen.queryByTestId("player-transport")).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Present" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Filter" })).not.toBeInTheDocument();
    expect(screen.queryByTestId("catalog-view")).not.toBeInTheDocument();
  });

  it("enters Pure Mode without replacing the active Stage node", async () => {
    window.history.replaceState(
      null,
      "",
      "/?view=lab&style=minimal-product-keynote&topic=product-keynote&scene=1&beat=0",
    );
    render(<App />);
    const stage = screen.getByTestId("stage");
    await waitFor(() => expect(stage).toHaveAttribute("data-topic-ready", "true"));

    fireEvent.click(screen.getByRole("button", { name: "Present" }));

    await waitFor(() => expect(window.location.search).toContain("pure=1"));
    expect(screen.getByTestId("stage")).toBe(stage);
    expect(screen.queryByRole("navigation", { name: "Player navigation" })).not.toBeInTheDocument();
    expect(screen.queryByTestId("player-transport")).not.toBeInTheDocument();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(screen.queryByTestId("catalog-view")).not.toBeInTheDocument();
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

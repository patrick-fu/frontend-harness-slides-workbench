import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, within } from "@testing-library/react";
import type { StyleMetadata, StyleRegistryEntry, StyleTopic } from "../types";
import OverviewView from "./OverviewView";

function makeMetadata(
  styleId: string,
  band: StyleMetadata["band"],
): StyleMetadata {
  return {
    id: styleId,
    band,
    name: `Style ${styleId}`,
    theme: "A test theme",
    densityLabel: "Sparse",
    heroScene: 1,
    colors: { bg: "#f5f5f5", ink: "#101010", panel: "#ffffff" },
    typography: { header: "sans-serif", body: "sans-serif" },
    tags: [],
    fonts: [],
    scenes: [],
  };
}

function makeTopic(
  styleId: string,
  id: string,
  model: string,
  band: StyleMetadata["band"],
): StyleTopic {
  return {
    id,
    topic: { en: `Topic ${id}`, zh: `题材 ${id}` },
    model,
    component: () => null,
    getMetadata: () => makeMetadata(styleId, band),
  };
}

const registry: StyleRegistryEntry[] = [
  {
    id: "alpha",
    name: { en: "Alpha", zh: "甲" },
    topics: [
      makeTopic("alpha", "a-one", "GPT 5.5", "minimal-keynote"),
      makeTopic("alpha", "a-two", "Claude 4", "minimal-keynote"),
    ],
  },
  {
    id: "beta",
    name: { en: "Beta", zh: "乙" },
    topics: [makeTopic("beta", "b-one", "GPT 5.5", "text-report")],
  },
];

const defaultProps = {
  registry,
  language: "en" as const,
  filters: { bands: [], models: [] },
  onFiltersChange: vi.fn(),
  getTopicHref: (styleId: string, topicId: string) =>
    `/open/${styleId}/${topicId}`,
  onOpenTopic: vi.fn(),
};

describe("OverviewView", () => {
  it("renders every Topic in registry order as a native link in one continuous grid", () => {
    render(<OverviewView {...defaultProps} />);

    const grid = screen.getByTestId("catalog-grid");
    const cards = within(grid).getAllByTestId("topic-card");

    expect(cards.map((card) => card.getAttribute("data-topic-key"))).toEqual([
      "alpha/a-one",
      "alpha/a-two",
      "beta/b-one",
    ]);
    expect(within(cards[0]).getByRole("link")).toHaveAttribute(
      "href",
      "/open/alpha/a-one",
    );
    expect(within(cards[1]).getByRole("link")).toHaveAttribute(
      "href",
      "/open/alpha/a-two",
    );
    expect(within(cards[2]).getByRole("link")).toHaveAttribute(
      "href",
      "/open/beta/b-one",
    );
  });

  it("marks only the first visible Topic Card in each contiguous Style group", () => {
    render(<OverviewView {...defaultProps} />);

    expect(screen.getByTestId("style-group-marker-alpha")).toHaveTextContent(
      "01 · Alpha",
    );
    expect(screen.getByTestId("style-group-marker-beta")).toHaveTextContent(
      "02 · Beta",
    );
    expect(screen.queryByTestId("style-group-marker-alpha-a-two")).toBeNull();
  });

  it("opens a plain card click through the catalog owner", () => {
    const onOpenTopic = vi.fn();
    render(<OverviewView {...defaultProps} onOpenTopic={onOpenTopic} />);

    const link = within(screen.getAllByTestId("topic-card")[0]).getByRole("link");
    fireEvent.click(link);
    expect(onOpenTopic).toHaveBeenCalledWith("alpha", "a-one");
  });

  it("prefetches an exact Topic on hover, keyboard focus, and touch intent", () => {
    const onPrefetchTopic = vi.fn();
    render(
      <OverviewView
        {...defaultProps}
        onPrefetchTopic={onPrefetchTopic}
      />,
    );

    const link = within(screen.getAllByTestId("topic-card")[0]).getByRole("link");
    fireEvent.mouseEnter(link);
    fireEvent.focus(link);
    fireEvent.touchStart(link);

    expect(onPrefetchTopic).toHaveBeenCalledTimes(3);
    expect(onPrefetchTopic).toHaveBeenLastCalledWith("alpha", "a-one");
  });

  it("summarizes all Topics and Styles, then hands user facet choices to the URL owner", () => {
    const onFiltersChange = vi.fn();
    render(
      <OverviewView {...defaultProps} onFiltersChange={onFiltersChange} />,
    );

    expect(screen.getByTestId("catalog-summary")).toHaveTextContent(
      "All 3 Topics · 2 Styles",
    );
    fireEvent.click(
      within(screen.getByRole("group", { name: "Category" })).getByRole(
        "button",
        { name: /Minimal Keynote/ },
      ),
    );

    expect(onFiltersChange).toHaveBeenCalledWith({
      bands: ["minimal-keynote"],
      models: [],
    });
  });

  it("shows a filter-empty state without losing the catalog summary", () => {
    render(
      <OverviewView
        {...defaultProps}
        filters={{ bands: ["text-report"], models: ["Claude 4"] }}
      />,
    );

    expect(screen.getByTestId("catalog-empty-state")).toHaveTextContent(
      "No Topics match",
    );
    expect(screen.getByTestId("catalog-summary")).toHaveTextContent(
      "0 of 3 Topics · 0 of 2 Styles",
    );
  });

  it("keeps unknown URL criteria visible as an unavailable filter state", () => {
    render(
      <OverviewView
        {...defaultProps}
        filters={{ bands: [], models: ["retired-model"] }}
      />,
    );

    expect(screen.getByTestId("catalog-unavailable-state")).toHaveTextContent(
      "retired-model",
    );
    expect(screen.queryByTestId("catalog-grid")).toBeNull();
  });
});

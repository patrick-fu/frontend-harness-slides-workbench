import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { lazy } from "react";
import type {
  RuntimeStyleGroup,
  RuntimeTopic,
} from "../catalog/runtime-registry";
import type { Band } from "../domain/style";
import type { TopicMetadata, TopicStageProps } from "../domain/topic";
import { resolveCatalogFilters } from "../utils/catalog-filter";
import CatalogView from "./CatalogView";

const EmptyStage = (_props: TopicStageProps) => null;

function makeMetadata(): TopicMetadata {
  return {
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
  modelId: RuntimeTopic["modelId"],
): RuntimeTopic {
  const metadata = makeMetadata();
  return {
    id,
    styleId,
    title: { en: `Topic ${id}`, zh: `题材 ${id}` },
    modelId,
    metadata: { en: metadata, zh: metadata },
    navigation: { mode: "none" },
    transitionScore: {
      "1->2": "hard-cut",
      "2->3": "hard-cut",
      "3->4": "hard-cut",
      "4->5": "hard-cut",
    },
    evidence: { kind: "none" },
    modulePath: `../topics/${id}.tsx`,
    Stage: lazy(async () => ({ default: EmptyStage })),
    loadStage: async () => EmptyStage,
  };
}

function makeGroup(
  id: string,
  name: { en: string; zh: string },
  band: Band,
  topics: RuntimeTopic[],
): RuntimeStyleGroup {
  return { style: { id, name, band }, topics };
}

const registry: readonly RuntimeStyleGroup[] = [
  makeGroup("alpha", { en: "Alpha", zh: "甲" }, "minimal-keynote", [
    makeTopic("alpha", "a-one", "GPT 5.5"),
    makeTopic("alpha", "a-two", "Claude Opus 4.8"),
  ]),
  makeGroup("beta", { en: "Beta", zh: "乙" }, "text-report", [
    makeTopic("beta", "b-one", "GPT 5.5"),
  ]),
];

const defaultProps = {
  registry,
  language: "en" as const,
  filters: { bands: [], models: [] },
  resolution: resolveCatalogFilters(registry, "en", { bands: [], models: [] }),
  onFiltersChange: vi.fn(),
  getTopicHref: (styleId: string, topicId: string) =>
    `/open/${styleId}/${topicId}`,
  onOpenTopic: vi.fn(),
};

describe("CatalogView", () => {
  it("renders every Topic in registry order as a native link in one continuous grid", () => {
    render(<CatalogView {...defaultProps} />);

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
    render(<CatalogView {...defaultProps} />);

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
    render(<CatalogView {...defaultProps} onOpenTopic={onOpenTopic} />);

    const link = within(screen.getAllByTestId("topic-card")[0]).getByRole("link");
    fireEvent.click(link);
    expect(onOpenTopic).toHaveBeenCalledWith("alpha", "a-one");
  });

  it("prefetches an exact Topic on hover, keyboard focus, and touch intent", () => {
    const onPrefetchTopic = vi.fn();
    render(
      <CatalogView
        {...defaultProps}
        onPrefetchTopic={onPrefetchTopic}
      />,
    );

    const link = within(screen.getAllByTestId("topic-card")[0]).getByRole("link");
    fireEvent.mouseEnter(link);
    fireEvent.focus(link);
    fireEvent.touchStart(link);

    expect(onPrefetchTopic).toHaveBeenCalledTimes(3);
    expect(onPrefetchTopic).toHaveBeenLastCalledWith("a-one");
  });

  it("summarizes all Topics and Styles, then hands user facet choices to the URL owner", () => {
    const onFiltersChange = vi.fn();
    render(
      <CatalogView {...defaultProps} onFiltersChange={onFiltersChange} />,
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

  it("renders results, summary, and facet counts from one supplied resolution", () => {
    const resolution = resolveCatalogFilters(registry, "en", {
      bands: ["text-report"],
      models: [],
    });
    render(
      <CatalogView
        {...defaultProps}
        resolution={resolution}
      />,
    );

    const cards = within(screen.getByTestId("catalog-grid")).getAllByTestId(
      "topic-card",
    );
    expect(cards.map((card) => card.getAttribute("data-topic-key"))).toEqual([
      "beta/b-one",
    ]);
    expect(screen.getByTestId("catalog-summary")).toHaveTextContent(
      "1 of 3 Topics · 1 of 2 Styles",
    );
    expect(
      screen.getByRole("button", { name: /Minimal Keynote, 2 Topics/ }),
    ).toBeVisible();
  });

  it("shows a filter-empty state without losing the catalog summary", () => {
    render(
      <CatalogView
        {...defaultProps}
        filters={{ bands: ["text-report"], models: ["Claude Opus 4.8"] }}
        resolution={resolveCatalogFilters(registry, "en", {
          bands: ["text-report"],
          models: ["Claude Opus 4.8"],
        })}
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
      <CatalogView
        {...defaultProps}
        filters={{ bands: [], models: ["retired-model"] }}
        resolution={resolveCatalogFilters(registry, "en", {
          bands: [],
          models: ["retired-model"],
        })}
      />,
    );

    expect(screen.getByTestId("catalog-unavailable-state")).toHaveTextContent(
      "retired-model",
    );
    expect(screen.queryByTestId("catalog-grid")).toBeNull();
  });

  it("localizes thumbnail alternative text in Chinese", () => {
    render(<CatalogView {...defaultProps} language="zh" />);

    expect(screen.getByRole("img", { name: "题材 a-one 缩略图" })).toBeVisible();
  });
});

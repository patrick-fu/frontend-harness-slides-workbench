import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { lazy } from "react";
import TopicBar from "./TopicBar";
import type {
  RuntimeStyleGroup,
  RuntimeTopic,
} from "../../catalog/runtime-registry";
import type { TopicMetadata, TopicStageProps } from "../../domain/topic";

const metadata: TopicMetadata = {
  theme: "test",
  densityLabel: "Sparse",
  heroScene: 1,
  colors: { bg: "#fff", ink: "#111", panel: "#eee" },
  typography: { header: "Test 700", body: "Test 400" },
  tags: ["test"],
  fonts: [],
  scenes: [],
};

const EmptyStage = (_props: TopicStageProps) => null;

function makeGroup(
  topics: Array<{
    id: string;
    title: { en: string; zh: string };
    modelId: RuntimeTopic["modelId"];
  }>,
): RuntimeStyleGroup {
  return {
    style: {
      id: "minimal-product-keynote",
      name: { en: "Minimal Product Keynote", zh: "极简产品演示" },
      band: "minimal-keynote",
    },
    topics: topics.map((topic) => ({
      ...topic,
      styleId: "minimal-product-keynote",
      metadata: { en: metadata, zh: metadata },
      navigation: { mode: "none" },
      transitionScore: {
        "1->2": "hard-cut",
        "2->3": "hard-cut",
        "3->4": "hard-cut",
        "4->5": "hard-cut",
      },
      evidence: { kind: "none" },
      modulePath: `../topics/${topic.id}.tsx`,
      Stage: lazy(async () => ({ default: EmptyStage })),
      loadStage: async () => EmptyStage,
    })),
  };
}

function renderTopicBar(
  props: Partial<React.ComponentProps<typeof TopicBar>> = {},
) {
  const defaultProps = {
    group: makeGroup([
      {
        id: "product-keynote",
        title: { en: "Product Keynote", zh: "产品主题" },
        modelId: "Doubao-Seed-Evolving",
      },
      {
        id: "decision-art",
        title: { en: "Decision Art", zh: "决策艺术" },
        modelId: "GPT 5.5",
      },
    ]),
    currentTopicId: "decision-art",
    language: "en" as const,
    onGoOverview: vi.fn(),
    onSelectTopic: vi.fn(),
    ...props,
  };

  const result = render(<TopicBar {...defaultProps} />);
  return {
    ...result,
    onGoOverview: defaultProps.onGoOverview,
    onSelectTopic: defaultProps.onSelectTopic,
  };
}

describe("TopicBar", () => {
  it("renders a compact dropdown trigger instead of direct topic buttons", () => {
    renderTopicBar();

    expect(screen.getByTestId("topic-switcher")).toBeInTheDocument();
    expect(screen.getByTestId("topic-switcher")).toHaveTextContent("2/2");
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    expect(
      screen.queryByTestId("topic-option-product-keynote"),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId("topic-option-decision-art"),
    ).not.toBeInTheDocument();
  });

  it("opens the topic menu on click", () => {
    renderTopicBar();

    fireEvent.click(screen.getByTestId("topic-switcher"));

    expect(screen.getByTestId("topic-menu")).toBeInTheDocument();
    expect(screen.getByTestId("topic-option-product-keynote")).toHaveTextContent(
      "1",
    );
    expect(screen.getByTestId("topic-option-product-keynote")).toHaveTextContent(
      "Product Keynote",
    );
    expect(screen.getByTestId("topic-option-decision-art")).toHaveTextContent(
      "2",
    );
    expect(screen.getByTestId("topic-option-decision-art")).toHaveTextContent(
      "Decision Art",
    );
  });

  it("opens the topic menu on hover", () => {
    renderTopicBar();

    fireEvent.mouseEnter(screen.getByTestId("topic-switcher"));

    expect(screen.getByTestId("topic-menu")).toBeInTheDocument();
    expect(screen.getByTestId("topic-option-product-keynote")).toBeInTheDocument();
  });

  it("marks the active topic inside the dropdown", () => {
    renderTopicBar();

    fireEvent.click(screen.getByTestId("topic-switcher"));

    expect(screen.getByTestId("topic-option-decision-art")).toHaveAttribute(
      "aria-current",
      "true",
    );
    expect(screen.getByTestId("topic-option-decision-art")).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByTestId("topic-option-product-keynote")).not.toHaveAttribute(
      "aria-current",
      "true",
    );
  });

  it("clicking another topic requests that topic id", () => {
    const { onSelectTopic } = renderTopicBar();

    fireEvent.click(screen.getByTestId("topic-switcher"));
    fireEvent.click(screen.getByTestId("topic-option-product-keynote"));

    expect(onSelectTopic).toHaveBeenCalledTimes(1);
    expect(onSelectTopic).toHaveBeenCalledWith("product-keynote");
  });

  it("does not request a topic change when clicking the active topic", () => {
    const { onSelectTopic } = renderTopicBar();

    fireEvent.click(screen.getByTestId("topic-switcher"));
    fireEvent.click(screen.getByTestId("topic-option-decision-art"));

    expect(onSelectTopic).not.toHaveBeenCalled();
  });

  it("does not render the switcher for a single-topic style", () => {
    renderTopicBar({
      group: makeGroup([
        {
          id: "product-keynote",
          title: { en: "Product Keynote", zh: "产品主题" },
          modelId: "Doubao-Seed-Evolving",
        },
      ]),
      currentTopicId: "product-keynote",
    });

    expect(screen.queryByTestId("topic-switcher")).not.toBeInTheDocument();
    expect(screen.getByTestId("topic-count")).toHaveTextContent("1/1");
  });

  it("localizes the switcher label", () => {
    renderTopicBar({ language: "zh" });

    expect(screen.getByTestId("topic-switcher")).toHaveAttribute(
      "aria-label",
      "主题",
    );
  });

  it("localizes topics in the bar and menu", () => {
    renderTopicBar({ language: "zh" });

    expect(screen.getByText("决策艺术")).toBeInTheDocument();

    fireEvent.click(screen.getByTestId("topic-switcher"));

    expect(screen.getByTestId("topic-option-product-keynote")).toHaveTextContent(
      "产品主题",
    );
    expect(screen.getByTestId("topic-option-decision-art")).toHaveTextContent(
      "决策艺术",
    );
  });
});

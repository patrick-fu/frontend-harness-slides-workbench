import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import TopicBar from "./TopicBar";
import type { StyleRegistryEntry } from "../../types";

function makeStyle(
  topics: Array<{
    id: string;
    topic: { en: string; zh: string };
    model: string;
  }>,
): StyleRegistryEntry {
  return {
    id: "minimal-product-keynote",
    name: { en: "Minimal Product Keynote", zh: "极简产品演示" },
    topics: topics.map((topic) => ({
      ...topic,
      component: () => null,
      getMetadata: () => ({
        id: "minimal-product-keynote",
        name: "Minimal Product Keynote",
        band: "minimal-keynote",
        theme: "test",
        densityLabel: "Sparse",
        heroScene: 1,
        colors: { bg: "#fff", ink: "#111", panel: "#eee" },
        typography: { header: "Test 700", body: "Test 400" },
        tags: ["test"],
        fonts: [],
        scenes: [],
      }),
    })),
  };
}

function renderTopicBar(
  props: Partial<React.ComponentProps<typeof TopicBar>> = {},
) {
  const defaultProps = {
    style: makeStyle([
      {
        id: "product-keynote",
        topic: { en: "Product Keynote", zh: "产品主题" },
        model: "Doubao-Seed-Evolving",
      },
      {
        id: "decision-art",
        topic: { en: "Decision Art", zh: "决策艺术" },
        model: "GPT 5.5",
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
      style: makeStyle([
        {
          id: "product-keynote",
          topic: { en: "Product Keynote", zh: "产品主题" },
          model: "Doubao-Seed-Evolving",
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

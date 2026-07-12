import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type {
  RuntimeCatalogStyleGroup,
  RuntimeCatalogTopic,
} from "../catalog/runtime-catalog";
import type { TopicMetadata } from "../domain/topic";
import LibraryDrawer from "./LibraryDrawer";

const metadata: TopicMetadata = {
  theme: "",
  densityLabel: "",
  heroScene: 1,
  colors: { bg: "#fff", ink: "#111", panel: "#eee" },
  typography: { header: "serif", body: "sans" },
  tags: [],
  fonts: [],
  scenes: Array.from({ length: 5 }, (_, index) => ({
    id: index + 1,
    title: `Scene ${index + 1}`,
    beats: [{ id: 0, action: "", title: "", body: "" }],
  })),
};

function topic(
  styleId: string,
  id: string,
  name: string,
  modelId: RuntimeCatalogTopic["modelId"],
): RuntimeCatalogTopic {
  return {
    id,
    styleId,
    title: { en: name, zh: name },
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
  };
}

const registry: readonly RuntimeCatalogStyleGroup[] = [
  {
    style: {
      id: "quiet-grid",
      name: { en: "Quiet Grid", zh: "静默网格" },
      band: "minimal-keynote",
    },
    topics: [
      topic("quiet-grid", "launch", "Quiet launch", "GPT 5.6 Sol"),
      topic("quiet-grid", "grain", "Presolar grain", "GPT 5.5"),
    ],
  },
  {
    style: {
      id: "field-notes",
      name: { en: "Field Notes", zh: "田野笔记" },
      band: "text-report",
    },
    topics: [
      topic("field-notes", "dust", "Saharan dust", "Doubao-Seed-Evolving"),
    ],
  },
];
const allTopicsInScope = () => true;

describe("LibraryDrawer", () => {
  it("exposes the current Style's Topics with Model IDs", () => {
    render(
      <LibraryDrawer
        open
        registry={registry}
        currentStyleId="quiet-grid"
        currentTopicId="launch"
        language="en"
        isTopicInCycleScope={allTopicsInScope}
        onClose={vi.fn()}
        onSelectTopic={vi.fn()}
      />,
    );

    expect(screen.getByRole("dialog", { name: "Library" })).toBeVisible();
    expect(screen.getByText("Quiet Grid")).toBeVisible();
    expect(screen.getByText("Quiet launch")).toBeVisible();
    expect(screen.getByText("GPT 5.6 Sol")).toBeVisible();
    expect(screen.getByText("Presolar grain")).toBeVisible();
  });

  it("searches exact Topics through Style, Topic, and Model ID text", () => {
    render(
      <LibraryDrawer
        open
        registry={registry}
        currentStyleId="quiet-grid"
        currentTopicId="launch"
        language="en"
        isTopicInCycleScope={allTopicsInScope}
        onClose={vi.fn()}
        onSelectTopic={vi.fn()}
      />,
    );

    fireEvent.change(screen.getByRole("searchbox"), {
      target: { value: "Doubao" },
    });

    expect(screen.getByText("Saharan dust")).toBeVisible();
    expect(screen.queryByText("Quiet launch")).not.toBeInTheDocument();
  });

  it("selects an exact Topic and closes the overlay", () => {
    const onSelectTopic = vi.fn();
    const onClose = vi.fn();
    render(
      <LibraryDrawer
        open
        registry={registry}
        currentStyleId="quiet-grid"
        currentTopicId="launch"
        language="en"
        isTopicInCycleScope={allTopicsInScope}
        onClose={onClose}
        onSelectTopic={onSelectTopic}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /Presolar grain/ }));

    expect(onSelectTopic).toHaveBeenCalledWith("grain");
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("keeps global Topics visible and marks destinations outside the Cycle Scope", () => {
    render(
      <LibraryDrawer
        open
        registry={registry}
        currentStyleId="quiet-grid"
        currentTopicId="launch"
        language="en"
        isTopicInCycleScope={(topicId) => topicId === "launch"}
        onClose={vi.fn()}
        onSelectTopic={vi.fn()}
      />,
    );

    expect(
      screen.getByRole("button", {
        name: /Presolar grain.*Outside filter/,
      }),
    ).toBeVisible();
  });
});

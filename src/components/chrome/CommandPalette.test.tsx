import { fireEvent, render, screen } from "@testing-library/react";
import { lazy } from "react";
import { describe, expect, it, vi } from "vitest";
import type {
  RuntimeStyleGroup,
  RuntimeTopic,
} from "../../catalog/runtime-registry";
import type { TopicMetadata, TopicStageProps } from "../../domain/topic";
import CommandPalette from "./CommandPalette";

const Noop = (_props: TopicStageProps) => null;
const metadata: TopicMetadata = {
  theme: "",
  densityLabel: "",
  heroScene: 1,
  colors: { bg: "#fff", ink: "#111", panel: "#eee" },
  typography: { header: "serif", body: "sans" },
  tags: [],
  fonts: [],
  scenes: [],
};

function topic(
  styleId: string,
  id: string,
  title: string,
  modelId: RuntimeTopic["modelId"],
): RuntimeTopic {
  return {
    id,
    styleId,
    title: { en: title, zh: title },
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
    Stage: lazy(async () => ({ default: Noop })),
    loadStage: async () => Noop,
  };
}

const registry: readonly RuntimeStyleGroup[] = [
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
    topics: [topic("field-notes", "dust", "Saharan dust", "GPT 5.6 Sol")],
  },
];

describe("CommandPalette", () => {
  it("shows recent exact Topics before the user searches", () => {
    render(
      <CommandPalette
        open
        registry={registry}
        language="en"
        recent={["field-notes/dust"]}
        onClose={vi.fn()}
        onSelectTopic={vi.fn()}
      />,
    );

    expect(screen.getByText("Saharan dust")).toBeVisible();
    expect(screen.queryByText("Quiet launch")).not.toBeInTheDocument();
  });

  it("searches Style, Topic, and Model ID with one result per Topic", () => {
    render(
      <CommandPalette
        open
        registry={registry}
        language="en"
        recent={[]}
        onClose={vi.fn()}
        onSelectTopic={vi.fn()}
      />,
    );

    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: "GPT 5.6 Sol" },
    });

    expect(screen.getByText("Quiet launch")).toBeVisible();
    expect(screen.getByText("Saharan dust")).toBeVisible();
    expect(screen.queryByText("Presolar grain")).not.toBeInTheDocument();
  });

  it("opens the highlighted Topic at Scene 1 / Beat 0", () => {
    const onSelectTopic = vi.fn();
    const onClose = vi.fn();
    render(
      <CommandPalette
        open
        registry={registry}
        language="en"
        recent={[]}
        onClose={onClose}
        onSelectTopic={onSelectTopic}
      />,
    );

    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: "Presolar" },
    });
    fireEvent.keyDown(screen.getByRole("combobox"), { key: "Enter" });

    expect(onSelectTopic).toHaveBeenCalledWith("quiet-grid", "grain");
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});

import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { StyleRegistryEntry, StyleTopic } from "../../types";
import CommandPalette from "./CommandPalette";

const Noop = () => null;
function topic(id: string, title: string, model: string): StyleTopic {
  return {
    id,
    topic: { en: title, zh: title },
    model,
    component: Noop,
    getMetadata: () => ({
      id,
      band: "minimal-keynote",
      name: title,
      theme: "",
      densityLabel: "",
      heroScene: 1,
      colors: { bg: "#fff", ink: "#111", panel: "#eee" },
      typography: { header: "serif", body: "sans" },
      tags: [],
      fonts: [],
      scenes: [],
    }),
  };
}

const registry: StyleRegistryEntry[] = [
  {
    id: "quiet-grid",
    name: { en: "Quiet Grid", zh: "静默网格" },
    topics: [
      topic("launch", "Quiet launch", "GPT 5.6 Sol"),
      topic("grain", "Presolar grain", "GPT 5.5"),
    ],
  },
  {
    id: "field-notes",
    name: { en: "Field Notes", zh: "田野笔记" },
    topics: [topic("dust", "Saharan dust", "GPT 5.6 Sol")],
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

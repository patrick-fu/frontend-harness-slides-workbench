import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { StyleRegistryEntry, StyleTopic } from "../../types";
import LibraryDrawer from "./LibraryDrawer";

const Noop = () => null;

function topic(id: string, name: string, model: string): StyleTopic {
  return {
    id,
    topic: { en: name, zh: name },
    model,
    component: Noop,
    getMetadata: () => ({
      id,
      band: "minimal-keynote",
      name,
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
    topics: [topic("dust", "Saharan dust", "Doubao-Seed-Evolving")],
  },
];

describe("LibraryDrawer", () => {
  it("exposes the current Style's Topics with Model IDs", () => {
    render(
      <LibraryDrawer
        open
        registry={registry}
        currentStyleId="quiet-grid"
        currentTopicId="launch"
        language="en"
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
        onClose={onClose}
        onSelectTopic={onSelectTopic}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /Presolar grain/ }));

    expect(onSelectTopic).toHaveBeenCalledWith("quiet-grid", "grain");
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});

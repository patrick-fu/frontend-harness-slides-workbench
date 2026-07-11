import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import App from "../../App";
import FilterPanel, { type FilterOption } from "../FilterPanel";
import BottomBar from "../layout/BottomBar";
import type { SceneMetadata, StyleRegistryEntry, StyleTopic } from "../../types";
import CommandPalette from "./CommandPalette";

const Noop = () => null;

function topic(id: string, title: string): StyleTopic {
  return {
    id,
    topic: { en: title, zh: title },
    model: "GPT 5.6 Sol",
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
    topics: [topic("quiet-launch", "Quiet launch")],
  },
];

const filterOptions: FilterOption[] = [
  { value: "minimal-keynote", label: "Minimal Keynote", count: 1 },
];

const scenes: SceneMetadata[] = [
  {
    id: 1,
    title: "Opening",
    beats: [{ id: 0, action: "", title: "Beat one", body: "" }],
  },
  {
    id: 2,
    title: "Evidence",
    beats: [{ id: 0, action: "", title: "Beat one", body: "" }],
  },
];

beforeEach(() => {
  window.history.replaceState(null, "", "/");
  localStorage.clear();
  sessionStorage.clear();
});

describe("Catalog + Player shell accessibility", () => {
  it("returns focus to the Command Palette launcher after the modal closes", async () => {
    render(<App />);

    const launcher = screen.getByRole("button", {
      name: /Search styles, topics, or Model ID/,
    });
    launcher.focus();
    fireEvent.click(launcher);

    const input = screen.getByRole("combobox", {
      name: "Search Style, Topic, or Model ID",
    });
    await waitFor(() => expect(input).toHaveFocus());

    fireEvent.keyDown(input, { key: "Escape" });

    await waitFor(() =>
      expect(
        screen.queryByRole("dialog", { name: "Command palette" }),
      ).not.toBeInTheDocument(),
    );
    await waitFor(() => expect(launcher).toHaveFocus());
  });

  it("closes the Command Palette when Escape is pressed from a result", () => {
    const onClose = vi.fn();
    render(
      <CommandPalette
        open
        registry={registry}
        language="en"
        recent={["quiet-grid/quiet-launch"]}
        onClose={onClose}
        onSelectTopic={vi.fn()}
      />,
    );

    const result = screen.getByRole("option", { name: /Quiet launch/ });
    result.focus();
    fireEvent.keyDown(result, { key: "Escape" });

    expect(onClose).toHaveBeenCalledOnce();
  });

  it("keeps Shift+Tab inside the Command Palette instead of moving to its backdrop", async () => {
    render(
      <CommandPalette
        open
        registry={registry}
        language="en"
        recent={["quiet-grid/quiet-launch"]}
        onClose={vi.fn()}
        onSelectTopic={vi.fn()}
      />,
    );

    const input = screen.getByRole("combobox", {
      name: "Search Style, Topic, or Model ID",
    });
    await waitFor(() => expect(input).toHaveFocus());

    fireEvent.keyDown(input, { key: "Tab", shiftKey: true });

    expect(screen.getByRole("option", { name: /Quiet launch/ })).toHaveFocus();
  });

  it("moves focus into the mobile Filters dialog rather than leaving it on the covered trigger", async () => {
    render(
      <FilterPanel
        bandOptions={filterOptions}
        modelOptions={filterOptions}
        selectedBands={[]}
        selectedModels={[]}
        unavailableBands={[]}
        unavailableModels={[]}
        onToggleBand={vi.fn()}
        onToggleModel={vi.fn()}
        onClearFilters={vi.fn()}
        language="en"
      />,
    );

    const trigger = screen.getByRole("button", { name: "Filters" });
    trigger.focus();
    fireEvent.click(trigger);

    const dialog = screen.getByRole("dialog", { name: "Filters" });
    await waitFor(() => {
      const activeElement = document.activeElement;
      if (!(activeElement instanceof HTMLElement)) {
        throw new Error("The Filters dialog did not receive an HTMLElement focus target");
      }
      expect(dialog).toContainElement(activeElement);
    });
  });

  it("marks the active scene as the current presentation step", () => {
    render(
      <BottomBar
        scenes={scenes}
        currentScene={1}
        currentBeat={0}
        onPrev={vi.fn()}
        onNext={vi.fn()}
        onJumpScene={vi.fn()}
        onJumpBeat={vi.fn()}
      />,
    );

    expect(screen.getByRole("button", { name: "Scene 1" })).toHaveAttribute(
      "aria-current",
      "step",
    );
    expect(screen.getByRole("group", { name: "Scene navigation" })).toBeVisible();
  });
});

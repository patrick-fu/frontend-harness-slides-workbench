import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { lazy } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import App from "../App";
import CatalogFilters, { type FilterOption } from "./CatalogFilters";
import PlayerTransport from "./PlayerTransport";
import type {
  RuntimeStyleGroup,
  RuntimeTopic,
} from "../catalog/runtime-registry";
import type { TopicMetadata, TopicStageProps } from "../domain/topic";
import CommandPalette from "./CommandPalette";

const Noop = (_props: TopicStageProps) => null;

function topic(id: string, title: string): RuntimeTopic {
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
  return {
    id,
    styleId: "quiet-grid",
    title: { en: title, zh: title },
    modelId: "GPT 5.6 Sol",
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
    topics: [topic("quiet-launch", "Quiet launch")],
  },
];

const filterOptions: FilterOption[] = [
  { value: "minimal-keynote", label: "Minimal Keynote", count: 1 },
];

const scenes: TopicMetadata["scenes"] = [
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
      <CatalogFilters
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
      <PlayerTransport
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

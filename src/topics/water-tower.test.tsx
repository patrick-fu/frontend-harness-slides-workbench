import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { TopicStageProps } from "../domain/topic";
import { runTopicContract } from "../testing/topic-contract";
import definition, {
  WATER_TOWER_SOURCES,
  WATER_TOWER_TRANSITION_SCORE,
} from "./water-tower";

runTopicContract(definition);

const Stage = definition.Stage;
const getMetadata = (language: "en" | "zh") => definition.metadata[language];

function renderTopic({
  scene = 1,
  beat = 0,
  language = "en",
  isThumbnail = false,
  reducedMotion = false,
  onNavigate = vi.fn(),
}: Partial<TopicStageProps> = {}) {
  return {
    onNavigate,
    ...render(
      <div data-testid="event-boundary" onClick={vi.fn()} style={{ width: 1920, height: 1080, containerType: "size" }}>
        <Stage
          scene={scene}
          beat={beat}
          language={language}
          isThumbnail={isThumbnail}
          reducedMotion={reducedMotion}
          onNavigate={onNavigate}
        />
      </div>,
    ),
  };
}

describe("Engineering Whiteboard · Water Tower", () => {
  it("exports the planned semantic topic and exact transition score", () => {
    expect(definition.id).toBe("water-tower");
    expect(definition.title).toEqual({
      en: "Water Tower",
      zh: "城市水塔",
    });
    expect(definition.navigation).toEqual({
      geometry: "spatial-node",
      carrier: "water-network-node-map",
      invocation: "proximity-reveal",
      feedback: "history-trail",
    });
    expect(WATER_TOWER_TRANSITION_SCORE).toEqual({
      "1->2": "grid-reveal",
      "2->3": "push-y",
      "3->4": "focus-swap",
      "4->5": "split-merge",
    });
    expect(definition.transitionScore).toBe(WATER_TOWER_TRANSITION_SCORE);
    if (definition.evidence.kind !== "facts") {
      throw new Error("Water Tower must retain factual Evidence.");
    }
    expect(definition.evidence.sources).toBe(WATER_TOWER_SOURCES);
  });

  it("keeps five bilingual scenes structurally aligned with the 1-1-2-3-4 curve", () => {
    const en = getMetadata("en");
    const zh = getMetadata("zh");

    expect(definition.styleId).toBe("engineering-whiteboard-explainer");
    expect(en.heroScene).toBe(4);
    expect(en.scenes.map((scene) => scene.beats.length)).toEqual([1, 1, 2, 3, 4]);
    expect(zh.scenes.map((scene) => scene.beats.length)).toEqual([1, 1, 2, 3, 4]);
    expect(zh.scenes.map((scene) => scene.id)).toEqual(en.scenes.map((scene) => scene.id));
    expect(en.fonts).toContain("cjk:LXGW WenKai");
  });

  it("ships a traceable authority-led fact pack", () => {
    expect(WATER_TOWER_SOURCES).toHaveLength(4);
    expect(WATER_TOWER_SOURCES.map((source) => source.authority)).toEqual([
      "US EPA",
      "USGS",
      "Washington State Department of Health",
      "Minnesota Department of Health",
    ]);
    expect(WATER_TOWER_SOURCES.every((source) => source.url.startsWith("https://"))).toBe(true);
  });

  it("routes every authored scene edge through its canonical transition", () => {
    const props = {
      beat: 0,
      language: "en" as const,
      isThumbnail: false,
      reducedMotion: false,
      onNavigate: vi.fn(),
    };
    const { rerender } = render(
      <div style={{ width: 1920, height: 1080, containerType: "size" }}>
        <Stage scene={1} {...props} />
      </div>,
    );
    const track = screen.getByTestId("spatial-scene-track");

    for (const [scene, transition] of [
      [2, "grid-reveal"],
      [3, "push-y"],
      [4, "focus-swap"],
      [5, "split-merge"],
    ] as const) {
      rerender(
        <div style={{ width: 1920, height: 1080, containerType: "size" }}>
          <Stage scene={scene} {...props} />
        </div>,
      );
      expect(track).toHaveAttribute("data-scene-transition-kind", transition);
    }
  });

  it("renders the opening question and the Chinese system caveat", () => {
    const { rerender } = renderTopic({ scene: 1 });

    expect(screen.getByText("If the pump pauses, why does the tap still run?")).toBeInTheDocument();

    rerender(
      <div style={{ width: 1920, height: 1080, containerType: "size" }}>
        <Stage
          scene={5}
          beat={3}
          language="zh"
          isThumbnail={false}
          reducedMotion
          onNavigate={vi.fn()}
        />
      </div>,
    );

    expect(screen.getByText("现实系统不是一道静水压算式")).toBeInTheDocument();
    expect(
      screen.getByText("泵、阀门、摩阻、地形、需求、控制与水质约束必须一起进入真实模型。"),
    ).toBeInTheDocument();
  });

  it("uses stickers only as semantic diagram nodes in the tower cutaway", () => {
    renderTopic({ scene: 3, beat: 1 });

    expect(screen.getByTestId("water-tower-cutaway")).toBeInTheDocument();
    const stickers = screen.getAllByTestId("water-node-sticker");
    expect(stickers).toHaveLength(2);
    expect(stickers.every((sticker) => sticker.dataset.nodeSticker === "true")).toBe(true);
    expect(screen.getByText("Home demand")).toBeInTheDocument();
    expect(screen.getByText("Fire-flow reserve")).toBeInTheDocument();
  });

  it("reserves multi-beat geometry and exposes the final network state", () => {
    renderTopic({ scene: 5, beat: 3, reducedMotion: true });

    const sceneFive = screen
      .getAllByTestId("spatial-scene-panel")
      .find((panel) => panel.dataset.sceneId === "5");
    expect(sceneFive).toHaveAttribute("data-beat-layout-mode", "reserved");
    expect(screen.getByTestId("water-network-map")).toHaveAttribute("data-final-network", "true");
    expect(screen.getByText("One job, several system forms")).toBeInTheDocument();
    expect(screen.getByTestId("spatial-scene-strip")).toHaveAttribute("data-reduced-motion", "true");
  });

  it("hides node navigation in thumbnails and isolates desktop navigation clicks", () => {
    const onNavigate = vi.fn();
    const boundaryClick = vi.fn();
    const { rerender } = render(
      <div onClick={boundaryClick} style={{ width: 1920, height: 1080, containerType: "size" }}>
        <Stage
          scene={2}
          beat={0}
          language="en"
          isThumbnail={false}
          reducedMotion={false}
          onNavigate={onNavigate}
        />
      </div>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Open scene 4: Pressure zones" }));
    expect(onNavigate).toHaveBeenCalledWith(4, 0);
    expect(boundaryClick).not.toHaveBeenCalled();
    expect(screen.getByTestId("water-network-navigation")).toHaveAttribute(
      "data-navigation-carrier",
      "water-network-node-map",
    );

    rerender(
      <div style={{ width: 1920, height: 1080, containerType: "size" }}>
        <Stage
          scene={2}
          beat={0}
          language="en"
          isThumbnail
          reducedMotion={false}
          onNavigate={onNavigate}
        />
      </div>,
    );
    expect(screen.queryByTestId("water-network-navigation")).not.toBeInTheDocument();
  });

  it("uses first touch to reveal a node label and second touch to navigate", () => {
    const onNavigate = vi.fn();
    renderTopic({ scene: 1, onNavigate });
    const target = screen.getByRole("button", { name: "Open scene 5: Network reality" });

    fireEvent.touchStart(target);
    fireEvent.click(target);
    expect(onNavigate).not.toHaveBeenCalled();
    expect(target).toHaveAttribute("data-touch-preview", "true");

    fireEvent.touchStart(target);
    fireEvent.click(target);
    expect(onNavigate).toHaveBeenCalledWith(5, 0);
  });
});

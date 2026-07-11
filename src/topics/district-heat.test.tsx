import { fireEvent, render, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { TopicStageProps } from "../domain/topic";
import { runTopicContract } from "../testing/topic-contract";
import definition, {
  DISTRICT_HEAT_SOURCES,
  DISTRICT_HEAT_TRANSITION_SCORE,
} from "./district-heat";
import componentSource from "./district-heat.tsx?raw";
import styleSource from "./district-heat.module.css?inline";

runTopicContract(definition);

const Stage = definition.Stage;
const getMetadata = (language: "en" | "zh") => definition.metadata[language];

const BEAT_COUNTS: Record<number, number> = {
  1: 2,
  2: 3,
  3: 3,
  4: 3,
  5: 1,
};

const BASE_PROPS: TopicStageProps = {
  scene: 1,
  beat: 0,
  language: "en",
  isThumbnail: false,
  reducedMotion: false,
  onNavigate: vi.fn(),
};

function renderStage(
  overrides: Partial<TopicStageProps> = {},
  onStageClick = vi.fn(),
  onStagePointerDown = vi.fn(),
) {
  const props = { ...BASE_PROPS, onNavigate: vi.fn(), ...overrides };
  const result = render(
    <div
      data-testid="stage"
      style={{
        width: 1920,
        height: 1080,
        containerType: "size",
        overflow: "hidden",
        position: "relative",
      }}
      onClick={onStageClick}
      onPointerDown={onStagePointerDown}
    >
      <Stage {...props} />
    </div>,
  );

  return {
    ...result,
    root: () =>
      result.container.querySelector<HTMLElement>(
        '[data-topic-id="district-heat"]',
      ),
    activePanel: () =>
      result.container.querySelector<HTMLElement>(
        '[data-spatial-scene-panel="true"][data-active="true"]',
      ),
    rerenderProps(next: Partial<TopicStageProps>) {
      result.rerender(
        <div
          data-testid="stage"
          style={{
            width: 1920,
            height: 1080,
            containerType: "size",
            overflow: "hidden",
            position: "relative",
          }}
          onClick={onStageClick}
          onPointerDown={onStagePointerDown}
        >
          <Stage {...props} {...next} />
        </div>,
      );
    },
  };
}

describe("Second Heat topic contract", () => {
  it("declares the planned facts packet, navigation, score, and bilingual beat curve", () => {
    expect(definition.id).toBe("district-heat");
    expect(definition.title).toEqual({
      en: "Second Heat",
      zh: "城市余热",
    });
    expect(definition.navigation).toEqual({
      geometry: "path",
      carrier: "heat-pipe-loop",
      invocation: "auto-hide",
      feedback: "mechanical-displacement",
    });
    if (definition.evidence.kind !== "facts") {
      throw new Error("District Heat must retain factual Evidence.");
    }
    expect(definition.evidence.sources).toBe(DISTRICT_HEAT_SOURCES);
    expect(definition.transitionScore).toBe(
      DISTRICT_HEAT_TRANSITION_SCORE,
    );
    expect(DISTRICT_HEAT_TRANSITION_SCORE).toEqual({
      "1->2": "push-x",
      "2->3": "grid-reveal",
      "3->4": "scanline",
      "4->5": "push-y",
    });

    expect(DISTRICT_HEAT_SOURCES.length).toBeGreaterThanOrEqual(3);
    for (const source of DISTRICT_HEAT_SOURCES) {
      expect(source.url).toMatch(/^https:\/\//);
      expect(source.supports.trim().length).toBeGreaterThan(30);
      expect(source.authority.trim()).not.toBe("");
      expect(source.title.trim()).not.toBe("");
      expect(source.citation.trim()).not.toBe("");
    }

    const english = getMetadata("en");
    const chinese = getMetadata("zh");
    expect(definition.styleId).toBe("signal-pipeline-flow");
    expect(english.scenes.map((scene) => scene.beats.length)).toEqual([
      2, 3, 3, 3, 1,
    ]);
    expect(chinese.scenes.map((scene) => scene.beats.length)).toEqual([
      2, 3, 3, 3, 1,
    ]);
  });

  it("renders every English and Chinese beat through the shared spatial track", () => {
    for (const language of ["en", "zh"] as const) {
      for (let scene = 1; scene <= 5; scene += 1) {
        for (let beat = 0; beat < BEAT_COUNTS[scene]; beat += 1) {
          const view = renderStage({ language, scene, beat });
          expect(view.root()).not.toBeNull();
          expect(view.activePanel()).toHaveAttribute(
            "data-scene-id",
            String(scene),
          );
          if (BEAT_COUNTS[scene] > 1) {
            expect(view.activePanel()).toHaveAttribute(
              "data-beat-layout-mode",
              "reserved",
            );
          }
          expect(
            view.activePanel()?.querySelectorAll(
              '[data-beat-layout-item="true"]',
            ).length,
          ).toBeGreaterThanOrEqual(3);
          view.unmount();
        }
      }
    }
  });

  it("turns the five planned thermodynamic claims into distinct routed diagrams", () => {
    const source = renderStage({ scene: 1, beat: 1 });
    expect(source.activePanel()).toHaveTextContent("below 45 °C");
    expect(source.activePanel()).toHaveTextContent(
      "Composite technical schematic",
    );
    expect(source.activePanel()).toHaveTextContent("Stockholm Exergi");
    expect(
      source.activePanel()?.querySelector('[data-heat-source="true"]'),
    ).not.toBeNull();
    expect(
      source.activePanel()?.querySelector('[data-route-state="recover"]'),
    ).not.toBeNull();
    source.unmount();

    const exchange = renderStage({ scene: 2, beat: 2 });
    expect(exchange.activePanel()).toHaveTextContent(
      "Heat crosses; fluids stay separate",
    );
    expect(
      exchange.activePanel()?.querySelectorAll('[data-fluid-circuit="true"]'),
    ).toHaveLength(2);
    expect(
      exchange.activePanel()?.querySelector('[data-exchanger-wall="true"]'),
    ).not.toBeNull();
    exchange.unmount();

    const lift = renderStage({ scene: 3, beat: 2 });
    expect(lift.activePanel()).toHaveTextContent("electricity required");
    expect(
      lift.activePanel()?.querySelector('[data-heat-pump="true"]'),
    ).not.toBeNull();
    expect(
      lift.activePanel()?.querySelector('[data-peak-backup="active"]'),
    ).not.toBeNull();
    lift.unmount();

    const loop = renderStage({ scene: 4, beat: 2 });
    expect(
      loop.activePanel()?.querySelectorAll('[data-building-branch="true"]'),
    ).toHaveLength(4);
    expect(
      loop.activePanel()?.querySelectorAll(
        '[data-building-branch="true"][data-demand="open"]',
      ).length,
    ).toBeGreaterThan(0);
    expect(
      loop.activePanel()?.querySelectorAll(
        '[data-building-branch="true"][data-demand="closed"]',
      ).length,
    ).toBeGreaterThan(0);
    expect(
      loop.activePanel()?.querySelector('[data-return-state="cooler"]'),
    ).not.toBeNull();
    loop.unmount();

    const balance = renderStage({ scene: 5, beat: 0 });
    expect(
      balance.activePanel()?.querySelector('[data-seasonal-store="true"]'),
    ).not.toBeNull();
    expect(balance.activePanel()).toHaveTextContent(
      "distance · loss · season",
    );
    expect(balance.activePanel()).toHaveTextContent(
      "Recoverable heat and usable heat are not the same quantity",
    );
    balance.unmount();
  });

  it("exposes the valve-loop contract and isolates click, tap, and keyboard jumps", () => {
    const onNavigate = vi.fn();
    const onStageClick = vi.fn();
    const onStagePointerDown = vi.fn();
    const onWindowKey = vi.fn();
    window.addEventListener("keydown", onWindowKey);
    const view = renderStage(
      { scene: 2, beat: 1, onNavigate },
      onStageClick,
      onStagePointerDown,
    );
    try {
      const nav = view.root()?.querySelector<HTMLElement>(
        '[data-topic-navigation="true"]',
      );

      expect(nav).toHaveAttribute("data-navigation-geometry", "path");
      expect(nav).toHaveAttribute(
        "data-navigation-carrier",
        "heat-pipe-loop",
      );
      expect(nav).toHaveAttribute("data-navigation-invocation", "auto-hide");
      expect(nav).toHaveAttribute(
        "data-navigation-feedback",
        "mechanical-displacement",
      );
      expect(within(nav!).getAllByRole("button")).toHaveLength(5);
      expect(nav?.querySelectorAll('[data-nav-state="active"]')).toHaveLength(1);

      const pipe = nav?.querySelector<HTMLElement>('[aria-hidden="true"]');
      expect(pipe).not.toBeNull();
      fireEvent.pointerDown(nav!);
      fireEvent.click(nav!);
      fireEvent.pointerDown(pipe!);
      fireEvent.click(pipe!);
      expect(onNavigate).not.toHaveBeenCalled();
      expect(onStagePointerDown).not.toHaveBeenCalled();
      expect(onStageClick).not.toHaveBeenCalled();

      const fifth = within(nav!).getByRole("button", {
        name: "Scene 5: balance",
      });
      fireEvent.pointerDown(fifth);
      fireEvent.click(fifth);
      expect(onNavigate).toHaveBeenLastCalledWith(5, 0);
      expect(onStageClick).not.toHaveBeenCalled();

      const current = within(nav!).getByRole("button", {
        name: "Scene 2: exchange",
      });
      const callCount = onNavigate.mock.calls.length;
      expect(fireEvent.keyDown(current, { key: " " })).toBe(true);
      expect(fireEvent.keyDown(current, { key: "Enter" })).toBe(true);
      fireEvent.keyDown(current, { key: "ArrowRight", repeat: true });
      expect(onNavigate).toHaveBeenCalledTimes(callCount);
      expect(onWindowKey).not.toHaveBeenCalled();

      fireEvent.keyDown(current, { key: "ArrowRight" });
      expect(onNavigate).toHaveBeenLastCalledWith(3, 0);
      fireEvent.keyDown(current, { key: "End" });
      expect(onNavigate).toHaveBeenLastCalledWith(5, 0);
      fireEvent.keyDown(current, { key: "Home" });
      expect(onNavigate).toHaveBeenLastCalledWith(1, 0);
      expect(onWindowKey).not.toHaveBeenCalled();
      expect(onStageClick).not.toHaveBeenCalled();
    } finally {
      window.removeEventListener("keydown", onWindowKey);
    }
  });

  it("applies the exact four-edge transition score", () => {
    const view = renderStage({ scene: 1, beat: 0 });
    const track = () =>
      view.container.querySelector<HTMLElement>(
        '[data-spatial-scene-track="true"]',
      );

    for (const [target, kind] of [
      [2, "push-x"],
      [3, "grid-reveal"],
      [4, "scanline"],
      [5, "push-y"],
    ] as const) {
      view.rerenderProps({ scene: target, beat: 0 });
      expect(track()).toHaveAttribute("data-scene-transition-kind", kind);
    }
  });

  it("settles reduced-motion and thumbnail frames without exposing thumbnail navigation", () => {
    const reduced = renderStage({
      scene: 4,
      beat: 2,
      reducedMotion: true,
      onNavigate: undefined,
    });
    expect(reduced.root()).toHaveAttribute("data-motion", "off");
    expect(
      reduced.container.querySelector('[data-spatial-scene-strip="true"]'),
    ).toHaveAttribute("data-reduced-motion", "true");
    expect(
      reduced.activePanel()?.querySelector('[data-return-state="cooler"]'),
    ).not.toBeNull();
    reduced.unmount();

    const thumbnail = renderStage({
      scene: 1,
      beat: 0,
      isThumbnail: true,
      onNavigate: undefined,
    });
    expect(thumbnail.root()).toHaveAttribute("data-motion", "off");
    expect(
      thumbnail.activePanel()?.querySelector('[data-active-beat="1"]'),
    ).not.toBeNull();
    expect(
      thumbnail.root()?.querySelector('[data-topic-navigation="true"]'),
    ).toBeNull();
    expect(
      thumbnail.activePanel()?.querySelector('[data-route-state="recover"]'),
    ).not.toBeNull();
    thumbnail.unmount();
  });

  it("keeps the topic free of clone lifecycle, unbounded motion, remote media, and unsafe stage units", () => {
    const source = `${componentSource}\n${styleSource}`;
    expect(componentSource).toContain("<SpatialSceneTrack");
    expect(source).not.toMatch(
      /outgoingScene|isTransitionClone|data-transition-clone|setInterval|requestAnimationFrame/,
    );
    expect(source).not.toMatch(/animation[^;{]*infinite/i);
    expect(componentSource).not.toMatch(/<img[^>]+https?:\/\//i);
    expect(source).not.toMatch(/@import\s+url\([^)]*https?:\/\//i);
    expect(componentSource).not.toMatch(/createElement\(["']link["']\)/);
    expect(source).not.toMatch(
      /(?:^|[^a-z-])\d*\.?\d+(?:px|vw|vh|rem|em)\b/i,
    );
  });
});

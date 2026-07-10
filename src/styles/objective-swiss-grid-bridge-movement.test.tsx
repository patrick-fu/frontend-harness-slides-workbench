import { cleanup, fireEvent, render, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { BespokeStyleProps } from "../types";
import BridgeMovement, {
  BRIDGE_MOVEMENT_CLAIM_SOURCE_MAP,
  BRIDGE_MOVEMENT_SOURCES,
  BRIDGE_MOVEMENT_TRANSITION_SCORE,
  bridgeMovementTopic,
  getMetadata,
} from "./objective-swiss-grid-bridge-movement";
import componentSource from "./objective-swiss-grid-bridge-movement.tsx?raw";

const BEAT_COUNTS: Record<number, number> = {
  1: 4,
  2: 3,
  3: 2,
  4: 1,
  5: 1,
};

const EXPECTED_COMPOSITIONS = [
  "thesis-grid",
  "component-row",
  "section-comparison",
  "force-table",
  "resolved-grid",
];

const NATIVE_TOUCH_PHASES = [
  "touchstart",
  "touchmove",
  "touchend",
  "touchcancel",
] as const;

function renderStage(
  overrides: Partial<BespokeStyleProps> = {},
  stageHandlers: {
    onClick?: () => void;
    onTouchStart?: () => void;
    onKeyDown?: () => void;
  } = {},
) {
  const props: BespokeStyleProps = {
    scene: 1,
    beat: 0,
    language: "en",
    isThumbnail: false,
    reducedMotion: false,
    onNavigate: vi.fn(),
    ...overrides,
  };
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
      onClick={stageHandlers.onClick}
      onTouchStart={stageHandlers.onTouchStart}
      onKeyDown={stageHandlers.onKeyDown}
    >
      <BridgeMovement {...props} />
    </div>,
  );

  return {
    ...result,
    props,
    root: () =>
      result.container.querySelector<HTMLElement>(
        '[data-topic-id="bridge-movement"]',
      ),
    activePanel: () =>
      result.container.querySelector<HTMLElement>(
        '[data-spatial-scene-panel="true"][data-active="true"]',
      ),
    rerenderProps(next: Partial<BespokeStyleProps>) {
      Object.assign(props, next);
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
          onClick={stageHandlers.onClick}
          onTouchStart={stageHandlers.onTouchStart}
          onKeyDown={stageHandlers.onKeyDown}
        >
          <BridgeMovement {...props} />
        </div>,
      );
    },
  };
}

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("Objective Swiss Grid / Bridge Movement — topic protocol", () => {
  it("exports the assigned topic, model, navigation profile, and transition score", () => {
    expect(bridgeMovementTopic.id).toBe("bridge-movement");
    expect(bridgeMovementTopic.topic).toEqual({
      en: "Bridge Movement",
      zh: "桥的位移",
    });
    expect(bridgeMovementTopic.model).toBe("GPT-5.6 Terra/Max");
    expect(bridgeMovementTopic.navigation).toEqual({
      geometry: "edge-scale",
      carrier: "bearing-ruler",
      invocation: "persistent",
      feedback: "history-trail",
    });
    expect(bridgeMovementTopic.sources).toBe(BRIDGE_MOVEMENT_SOURCES);
    expect(bridgeMovementTopic.transitionScore).toBe(
      BRIDGE_MOVEMENT_TRANSITION_SCORE,
    );
    expect(BRIDGE_MOVEMENT_TRANSITION_SCORE).toEqual({
      "1->2": "dip-to-color",
      "2->3": "linear-wipe",
      "3->4": "crossfade",
      "4->5": "linear-wipe",
    });
  });

  it("keeps every factual claim reciprocal with a live, claim-scoped primary source", () => {
    const sourceIds = new Set<string>(
      BRIDGE_MOVEMENT_SOURCES.map((source) => source.id),
    );
    expect(BRIDGE_MOVEMENT_SOURCES).toHaveLength(4);

    for (const source of BRIDGE_MOVEMENT_SOURCES) {
      expect(source.url).toMatch(/^https:\/\//);
      expect(source.authority.length).toBeGreaterThan(8);
      expect(source.citation.length).toBeGreaterThan(18);
      expect(source.supports.length).toBeGreaterThan(70);
      expect(source.boundary.length).toBeGreaterThan(45);
      expect(source.accessDate).toBe("2026-07-10");
    }

    expect(Object.keys(BRIDGE_MOVEMENT_CLAIM_SOURCE_MAP).length).toBeGreaterThanOrEqual(
      7,
    );
    const sourceIdSets = Object.values(
      BRIDGE_MOVEMENT_CLAIM_SOURCE_MAP,
    ) as readonly (readonly string[])[];
    for (const sourceIdsForClaim of sourceIdSets) {
      expect(sourceIdsForClaim.length).toBeGreaterThan(0);
      sourceIdsForClaim.forEach((sourceId) => {
        expect(sourceIds.has(sourceId)).toBe(true);
      });
    }

    for (const source of BRIDGE_MOVEMENT_SOURCES) {
      expect(
        sourceIdSets.some((sourceIdsForClaim) =>
          sourceIdsForClaim.includes(source.id),
        ),
      ).toBe(true);
    }
  });

  it("keeps EN and ZH metadata aligned to the 4-3-2-1-1 beat curve", () => {
    const en = getMetadata("en");
    const zh = getMetadata("zh");

    for (const metadata of [en, zh]) {
      expect(metadata.id).toBe("objective-swiss-grid");
      expect(metadata.scenes.map((scene) => scene.id)).toEqual([1, 2, 3, 4, 5]);
      expect(metadata.scenes.map((scene) => scene.beats.length)).toEqual([
        4, 3, 2, 1, 1,
      ]);
      for (const scene of metadata.scenes) {
        expect(scene.beats).toHaveLength(BEAT_COUNTS[scene.id]);
        scene.beats.forEach((beat, index) => {
          expect(beat.id).toBe(index);
          expect(beat.action.trim()).not.toHaveLength(0);
          expect(beat.title.trim()).not.toHaveLength(0);
          expect(beat.body.trim()).not.toHaveLength(0);
        });
      }
    }
  });
});

describe("Objective Swiss Grid / Bridge Movement — scene evidence", () => {
  it("renders every English and Chinese frame with the planned five compositions", () => {
    for (const language of ["en", "zh"] as const) {
      const compositions = new Set<string>();
      for (let scene = 1; scene <= 5; scene += 1) {
        for (let beat = 0; beat < BEAT_COUNTS[scene]; beat += 1) {
          const view = renderStage({ language, scene, beat });
          const panel = view.activePanel();
          const sceneRoot = panel?.querySelector<HTMLElement>(
            "[data-scene-root=\"true\"]",
          );
          expect(panel).toHaveAttribute("data-scene-id", String(scene));
          expect(sceneRoot).toHaveAttribute(
            "data-composition",
            EXPECTED_COMPOSITIONS[scene - 1],
          );
          expect(sceneRoot?.textContent?.trim().length).toBeGreaterThan(80);
          expect(sceneRoot?.querySelector("[data-source-stamp=\"true\"]")).not.toBeNull();
          expect(sceneRoot?.querySelectorAll("[data-claim-source]").length).toBeGreaterThan(
            0,
          );
          compositions.add(sceneRoot!.dataset.composition!);
          view.unmount();
        }
      }
      expect(compositions).toEqual(new Set(EXPECTED_COMPOSITIONS));
    }
  });

  it("uses reserved beat slots for the three multi-beat scenes", () => {
    for (const scene of [1, 2, 3]) {
      const view = renderStage({
        scene,
        beat: BEAT_COUNTS[scene] - 1,
        reducedMotion: true,
      });
      const panel = view.activePanel();
      expect(panel).toHaveAttribute("data-beat-layout-container", "true");
      expect(panel).toHaveAttribute("data-beat-layout-mode", "reserved");
      expect(
        panel?.querySelectorAll('[data-beat-layout-item="true"]').length,
      ).toBeGreaterThanOrEqual(3);
      view.unmount();
    }
  });

  it("states device roles and direction constraints without turning the topic into a dashboard", () => {
    const components = renderStage({ scene: 2, beat: 2, reducedMotion: true });
    const componentPanel = components.activePanel();
    expect(componentPanel?.querySelectorAll("[data-bridge-device]")).toHaveLength(5);
    expect(componentPanel).toHaveTextContent("BEARING");
    expect(componentPanel).toHaveTextContent("EXPANSION JOINT");
    expect(componentPanel).toHaveTextContent("DAMPER");
    expect(componentPanel).toHaveTextContent("HINGE");
    expect(componentPanel).toHaveTextContent("SLIDING PLANE");
    expect(getMetadata("en").scenes[1].beats[0].body).toContain(
      "selected bearing type and detail",
    );
    expect(getMetadata("zh").scenes[1].beats[0].body).toContain(
      "选定支座类型与构造",
    );
    components.unmount();

    for (let beat = 0; beat < BEAT_COUNTS[2]; beat += 1) {
      const focusView = renderStage({ scene: 2, beat, reducedMotion: true });
      expect(
        focusView.activePanel()?.querySelectorAll(
          '[data-bridge-device][data-focus="true"]',
        ).length,
      ).toBe(1);
      focusView.unmount();
    }

    const directions = renderStage({ scene: 3, beat: 1, reducedMotion: true });
    const directionPanel = directions.activePanel();
    expect(directionPanel?.querySelectorAll("[data-direction-constraint]")).toHaveLength(2);
    expect(directionPanel).toHaveTextContent("LONGITUDINAL X · ALLOW");
    expect(directionPanel).toHaveTextContent("TRANSVERSE Y · GUIDE / LIMIT");
    expect(directionPanel).toHaveTextContent("PIN AXIS · ALLOW ROTATION");
    expect(directionPanel).toHaveTextContent(
      "TRANSLATION · RESTRAINED UNLESS A SEPARATE SLIDE IS DETAILED",
    );
    directions.unmount();

    const table = renderStage({ scene: 4, reducedMotion: true });
    const tablePanel = table.activePanel();
    expect(tablePanel?.querySelector("[data-force-table=\"true\"]")).not.toBeNull();
    expect(tablePanel).toHaveTextContent("TEMPERATURE");
    expect(tablePanel).toHaveTextContent("TRAFFIC");
    expect(tablePanel).toHaveTextContent("WIND");
    expect(tablePanel).toHaveTextContent("EARTHQUAKE");
    expect(tablePanel?.querySelector("[data-dashboard=\"true\"]")).toBeNull();

    const earthquakeRow = Array.from(
      tablePanel?.querySelectorAll<HTMLElement>('[role="row"]') ?? [],
    ).find((row) => row.textContent?.includes("EARTHQUAKE"));
    expect(
      within(earthquakeRow!).getAllByRole("cell").map((cell) => cell.textContent),
    ).toEqual([
      "IF ISOLATED: JOINT CAPACITY",
      "SYSTEM-SPECIFIC: BEARING CAPACITY",
      "SYSTEM-SPECIFIC: DISSIPATION",
      "SYSTEM-SPECIFIC: HINGE / RESTRAINT",
      "SYSTEM-SPECIFIC: SLIDE CAPACITY",
    ]);
    table.unmount();

    const chineseTable = renderStage({
      scene: 4,
      language: "zh",
      reducedMotion: true,
    });
    const chineseEarthquakeRow = Array.from(
      chineseTable.activePanel()?.querySelectorAll<HTMLElement>('[role="row"]') ?? [],
    ).find((row) => row.textContent?.includes("地震"));
    expect(
      within(chineseEarthquakeRow!).getAllByRole("cell").map((cell) => cell.textContent),
    ).toEqual([
      "若采用隔震：校核伸缩缝能力",
      "体系特定：支座位移能力",
      "体系特定：耗能装置",
      "体系特定：铰 / 约束",
      "体系特定：滑移能力",
    ]);
  });

  it("keeps component-axis allocation and the Caltrans seismic bearing check aligned in EN and ZH", () => {
    const english = renderStage({ scene: 1, beat: 3, reducedMotion: true });
    expect(english.activePanel()).toHaveTextContent(
      "Assign displacement by component and axis, then check capacity",
    );
    expect(english.activePanel()).toHaveTextContent(
      "check each bearing's displacement capacity and failure mode against the assumptions in the seismic analysis",
    );
    english.unmount();

    const chinese = renderStage({
      scene: 1,
      beat: 3,
      language: "zh",
      reducedMotion: true,
    });
    expect(chinese.activePanel()).toHaveTextContent(
      "按构件与轴线分配位移，再校核能力",
    );
    expect(chinese.activePanel()).toHaveTextContent(
      "校核每个支座的位移能力与破坏模式是否符合抗震分析假设",
    );
  });

  it("locks the Scene 3 Chinese title to two semantic CJK lines without changing English", () => {
    const chinese = renderStage({
      scene: 3,
      beat: 1,
      language: "zh",
      reducedMotion: true,
    });
    const chineseTitle = chinese.activePanel()?.querySelector<HTMLElement>(
      'h1[data-cjk-line-break="semantic"]',
    );
    const titleLines = Array.from(
      chineseTitle?.querySelectorAll<HTMLElement>("[data-title-line]") ?? [],
    ).map((line) => line.textContent);
    expect(chineseTitle).toHaveAttribute("data-title-line-count", "2");
    expect(titleLines).toEqual(["放行一个方向。", "写清其余方向。"]);
    expect(titleLines.every((line) => Array.from(line ?? "").length > 2)).toBe(
      true,
    );
    chinese.unmount();

    const english = renderStage({
      scene: 3,
      beat: 1,
      language: "en",
      reducedMotion: true,
    });
    const englishTitle = english.activePanel()?.querySelector("h1");
    expect(englishTitle).toHaveTextContent(
      "ALLOW ONE DIRECTION. NAME THE OTHERS.",
    );
    expect(englishTitle).not.toHaveAttribute("data-cjk-line-break");
    expect(englishTitle?.querySelector("[data-title-line]")).toBeNull();
  });

  it("returns to a resolved bridge silhouette with five assigned freedoms", () => {
    const view = renderStage({ scene: 5, beat: 0, reducedMotion: true });
    const panel = view.activePanel();
    expect(panel?.querySelector("[data-resolved-bridge=\"true\"]")).not.toBeNull();
    expect(panel?.querySelectorAll("[data-resolved-note]")).toHaveLength(5);
    expect(panel).toHaveTextContent("ASSIGNED FREEDOM");
  });
});

describe("Objective Swiss Grid / Bridge Movement — transition and navigation", () => {
  it("authors all four spatial-track edges", () => {
    const view = renderStage({ scene: 1, beat: 0 });
    const track = () =>
      view.container.querySelector<HTMLElement>(
        '[data-spatial-scene-track="true"]',
      );

    for (const [scene, kind] of [
      [2, "dip-to-color"],
      [3, "linear-wipe"],
      [4, "crossfade"],
      [5, "linear-wipe"],
    ] as const) {
      view.rerenderProps({ scene, beat: 0 });
      expect(track()).toHaveAttribute("data-scene-transition-kind", kind);
    }
  });

  it("provides the persistent edge-scale bearing ruler with history", () => {
    const view = renderStage({ scene: 4 });
    const nav = view.root()?.querySelector<HTMLElement>(
      '[data-topic-navigation="true"]',
    );
    expect(nav).toHaveAttribute("data-navigation-geometry", "edge-scale");
    expect(nav).toHaveAttribute("data-navigation-carrier", "bearing-ruler");
    expect(nav).toHaveAttribute("data-navigation-invocation", "persistent");
    expect(nav).toHaveAttribute("data-navigation-feedback", "history-trail");
    expect(nav?.querySelectorAll("[data-history-trail=\"true\"]")).toHaveLength(3);
    expect(within(nav!).getAllByRole("button")).toHaveLength(5);
    expect(
      within(nav!).getByRole("button", { name: "Scene 4: force table" }),
    ).toHaveAttribute("aria-current", "step");
  });

  it("uses absolute click, tap, and keyboard jumps without leaking into the stage", () => {
    const onNavigate = vi.fn();
    const onStageClick = vi.fn();
    const onStageTouch = vi.fn();
    const onStageKey = vi.fn();
    const view = renderStage(
      { scene: 2, onNavigate },
      {
        onClick: onStageClick,
        onTouchStart: onStageTouch,
        onKeyDown: onStageKey,
      },
    );
    const nav = view.root()?.querySelector<HTMLElement>(
      '[data-topic-navigation="true"]',
    );
    const fifth = within(nav!).getByRole("button", {
      name: "Scene 5: resolved bridge",
    });
    fireEvent.pointerDown(fifth);
    fireEvent.click(fifth);
    expect(onNavigate).toHaveBeenLastCalledWith(5, 0);
    expect(onStageClick).not.toHaveBeenCalled();

    const fourth = within(nav!).getByRole("button", {
      name: "Scene 4: force table",
    });
    onNavigate.mockClear();
    fireEvent.touchStart(fourth);
    fireEvent.touchEnd(fourth);
    fireEvent.click(fourth);
    expect(onNavigate).toHaveBeenCalledTimes(1);
    expect(onNavigate).toHaveBeenCalledWith(4, 0);
    expect(onStageTouch).not.toHaveBeenCalled();

    const second = within(nav!).getByRole("button", {
      name: "Scene 2: components",
    });
    fireEvent.keyDown(second, { key: "5" });
    expect(onNavigate).toHaveBeenLastCalledWith(5, 0);
    expect(onStageKey).not.toHaveBeenCalled();
  });

  it("isolates all four native touch phases at nav and source roots from stage and window listeners", () => {
    const onNavigate = vi.fn();
    const view = renderStage({ scene: 2, onNavigate });
    const stage = view.getByTestId("stage");
    const nav = view.root()?.querySelector<HTMLElement>(
      '[data-topic-navigation="true"]',
    );
    const target = within(nav!).getByRole("button", {
      name: "Scene 5: resolved bridge",
    });
    const sourceStamp = view.activePanel()?.querySelector<HTMLElement>(
      '[data-source-stamp="true"]',
    );
    const sourceLink = sourceStamp?.querySelector<HTMLAnchorElement>("a");

    expect(nav).toHaveAttribute("data-native-touch-isolation", "capture");
    expect(sourceStamp).toHaveAttribute(
      "data-native-touch-isolation",
      "capture",
    );

    const stageListeners = Object.fromEntries(
      NATIVE_TOUCH_PHASES.map((phase) => [phase, vi.fn()]),
    ) as Record<(typeof NATIVE_TOUCH_PHASES)[number], ReturnType<typeof vi.fn>>;
    const windowListeners = Object.fromEntries(
      NATIVE_TOUCH_PHASES.map((phase) => [phase, vi.fn()]),
    ) as Record<(typeof NATIVE_TOUCH_PHASES)[number], ReturnType<typeof vi.fn>>;

    for (const phase of NATIVE_TOUCH_PHASES) {
      stage.addEventListener(phase, stageListeners[phase]);
      window.addEventListener(phase, windowListeners[phase]);
    }

    try {
      for (const phase of NATIVE_TOUCH_PHASES) {
        target.dispatchEvent(
          new Event(phase, { bubbles: true, cancelable: true }),
        );
        sourceLink?.dispatchEvent(
          new Event(phase, { bubbles: true, cancelable: true }),
        );
      }

      expect(onNavigate).toHaveBeenCalledTimes(1);
      expect(onNavigate).toHaveBeenCalledWith(5, 0);
      for (const phase of NATIVE_TOUCH_PHASES) {
        expect(stageListeners[phase]).not.toHaveBeenCalled();
        expect(windowListeners[phase]).not.toHaveBeenCalled();
      }
    } finally {
      for (const phase of NATIVE_TOUCH_PHASES) {
        stage.removeEventListener(phase, stageListeners[phase]);
        window.removeEventListener(phase, windowListeners[phase]);
      }
    }
  });

  it("supports Space, Spacebar, Home, and End once while ignoring repeats", () => {
    const onNavigate = vi.fn();
    const onStageKey = vi.fn();
    const view = renderStage(
      { scene: 2, onNavigate },
      { onKeyDown: onStageKey },
    );
    const nav = view.root()?.querySelector<HTMLElement>(
      '[data-topic-navigation="true"]',
    );
    const fourth = within(nav!).getByRole("button", {
      name: "Scene 4: force table",
    });

    for (const [key, expectedScene] of [
      [" ", 4],
      ["Space", 4],
      ["Spacebar", 4],
      ["Home", 1],
      ["End", 5],
    ] as const) {
      onNavigate.mockClear();
      fireEvent.keyDown(fourth, { key });
      fireEvent.keyDown(fourth, { key, repeat: true });
      expect(onNavigate).toHaveBeenCalledTimes(1);
      expect(onNavigate).toHaveBeenCalledWith(expectedScene, 0);
    }
    expect(onStageKey).not.toHaveBeenCalled();
  });

  it("removes all native capture touch listeners from nav and source roots", () => {
    const view = renderStage({ scene: 3 });
    const nav = view.root()?.querySelector<HTMLElement>(
      '[data-topic-navigation="true"]',
    );
    const sourceStamp = view.activePanel()?.querySelector<HTMLElement>(
      '[data-source-stamp="true"]',
    );
    const navRemove = vi.spyOn(nav!, "removeEventListener");
    const sourceRemove = vi.spyOn(sourceStamp!, "removeEventListener");

    view.unmount();

    for (const phase of NATIVE_TOUCH_PHASES) {
      expect(navRemove).toHaveBeenCalledWith(
        phase,
        expect.any(Function),
        true,
      );
      expect(sourceRemove).toHaveBeenCalledWith(
        phase,
        expect.any(Function),
        true,
      );
    }
    expect(componentSource).toContain("capture: true");
  });
});

describe("Objective Swiss Grid / Bridge Movement — deterministic fixed-stage safety", () => {
  it("hides the ruler in thumbnails and settles reduced/frozen frames", () => {
    const thumbnail = renderStage({ scene: 1, beat: 0, isThumbnail: true });
    expect(thumbnail.root()).toHaveAttribute("data-motion-state", "settled");
    expect(thumbnail.root()).toHaveAttribute("data-frozen", "true");
    expect(
      thumbnail.root()?.querySelector('[data-topic-navigation="true"]'),
    ).toBeNull();
    expect(thumbnail.activePanel()).toHaveAttribute("data-scene-id", "1");
    expect(thumbnail.activePanel()).toHaveTextContent("EARTHQUAKE");
    expect(
      thumbnail.container.querySelector('[data-spatial-scene-strip="true"]'),
    ).toHaveAttribute("data-reduced-motion", "true");
    thumbnail.unmount();

    const reduced = renderStage({ scene: 3, beat: 1, reducedMotion: true });
    expect(reduced.root()).toHaveAttribute("data-motion-state", "settled");
    expect(reduced.root()).toHaveAttribute("data-frozen", "true");
    expect(
      reduced.container.querySelector('[data-spatial-scene-strip="true"]'),
    ).toHaveAttribute("data-reduced-motion", "true");
    expect(reduced.activePanel()).toHaveTextContent("PIN AXIS");
  });

  it("keeps stage safety structural: clipped DOM, no clone lifecycle, no remote raster, and no unsafe units", () => {
    const source = componentSource;
    expect(componentSource).toContain("<SpatialSceneTrack");
    const view = renderStage({ scene: 3, beat: 1 });
    expect(
      view.container.querySelector<HTMLElement>(
        '[data-spatial-scene-track="true"]',
      )?.style.overflow,
    ).toBe("hidden");
    expect(view.activePanel()?.querySelector('[data-scene-root="true"]')).not.toBeNull();
    view.unmount();
    expect(source).not.toMatch(
      /outgoingScene|isTransitionClone|data-transition-clone|setInterval|requestAnimationFrame/,
    );
    expect(componentSource).not.toMatch(/<img[^>]+https?:\/\//);
    expect(source).not.toMatch(/animation[^;{]*infinite/);
    expect(source).not.toMatch(
      /(?:^|[^a-z-])\d*\.?\d+(?:px|vw|vh|rem|em)\b/i,
    );
    expect(source).not.toMatch(/border-radius|box-shadow|linear-gradient|radial-gradient/);
    expect(source).not.toMatch(/translate(?:X|Y|3d)?\([^)]*(?:1(?:\.\d+)?|[2-9]\d*)cqw/i);
  });
});

import { fireEvent, render, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { BespokeStyleProps } from "../types";
import SinkingDelta, {
  getMetadata,
  sinkingDeltaTopic,
  SINKING_DELTA_SOURCES,
  SINKING_DELTA_TRANSITION_SCORE,
  SINKING_DELTA_VISIBLE_CLAIMS,
} from "./neo-brutalist-bulletin-sinking-delta";
import componentSource from "./neo-brutalist-bulletin-sinking-delta.tsx?raw";

const BEAT_COUNTS: Record<number, number> = {
  1: 4,
  2: 1,
  3: 2,
  4: 2,
  5: 1,
};

const BASE_PROPS: BespokeStyleProps = {
  scene: 1,
  beat: 0,
  language: "en",
  isThumbnail: false,
  reducedMotion: false,
  onNavigate: vi.fn(),
};

function StageFrame({
  props,
  onStageClick,
  onStageKeyDown,
}: {
  props: BespokeStyleProps;
  onStageClick?: () => void;
  onStageKeyDown?: () => void;
}) {
  return (
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
      onKeyDown={onStageKeyDown}
    >
      <SinkingDelta {...props} />
    </div>
  );
}

function renderStage(
  overrides: Partial<BespokeStyleProps> = {},
  onStageClick = vi.fn(),
  onStageKeyDown = vi.fn(),
) {
  const props = { ...BASE_PROPS, onNavigate: vi.fn(), ...overrides };
  const result = render(
    <StageFrame
      props={props}
      onStageClick={onStageClick}
      onStageKeyDown={onStageKeyDown}
    />,
  );

  return {
    ...result,
    props,
    root: () =>
      result.container.querySelector<HTMLElement>(
        '[data-topic-id="sinking-delta"]',
      ),
    activePanel: () =>
      result.container.querySelector<HTMLElement>(
        '[data-spatial-scene-panel="true"][data-active="true"]',
      ),
    rerenderProps(next: Partial<BespokeStyleProps>) {
      result.rerender(
        <StageFrame
          props={{ ...props, ...next }}
          onStageClick={onStageClick}
          onStageKeyDown={onStageKeyDown}
        />,
      );
    },
  };
}

describe("Sinking Delta topic protocol", () => {
  it("exports the planned Topic contract, evidence packet, and exact score", () => {
    expect(sinkingDeltaTopic.id).toBe("sinking-delta");
    expect(sinkingDeltaTopic.topic).toEqual({
      en: "Sinking Delta",
      zh: "下沉三角洲",
    });
    expect(sinkingDeltaTopic.model).toBe("GPT 5.6 Sol");
    expect(sinkingDeltaTopic.navigation).toEqual({
      geometry: "spatial-node",
      carrier: "delta-distributary-blocks",
      invocation: "drag-scrub",
      feedback: "mechanical-displacement",
    });
    expect(sinkingDeltaTopic.sources).toBe(SINKING_DELTA_SOURCES);
    expect(sinkingDeltaTopic.transitionScore).toBe(
      SINKING_DELTA_TRANSITION_SCORE,
    );
    expect(SINKING_DELTA_TRANSITION_SCORE).toEqual({
      "1->2": "hard-cut",
      "2->3": "grid-reveal",
      "3->4": "diagonal-pan",
      "4->5": "hard-cut",
    });
  });

  it("keeps USGS, CPRA, and peer-reviewed compaction claims scoped", () => {
    expect(SINKING_DELTA_SOURCES.length).toBeGreaterThanOrEqual(4);
    expect(
      SINKING_DELTA_SOURCES.some(
        (source) => source.authority === "U.S. Geological Survey",
      ),
    ).toBe(true);
    expect(
      SINKING_DELTA_SOURCES.some((source) =>
        source.authority.includes("Coastal Protection"),
      ),
    ).toBe(true);
    expect(
      SINKING_DELTA_SOURCES.some((source) =>
        source.authority.includes("Nature Geoscience"),
      ),
    ).toBe(true);

    for (const source of SINKING_DELTA_SOURCES) {
      expect(source.url).toMatch(/^https:\/\//);
      expect(source.supports.trim().length).toBeGreaterThan(30);
      expect(source.boundary.trim().length).toBeGreaterThan(45);
    }
  });

  it("gives every source a stable id, claim ids, and complete audit fields", () => {
    const expectedIds = [
      "usgs-coastal-louisiana-land-loss-2024",
      "usgs-wetland-loss-processes-2010",
      "cpra-deep-subsidence-2023",
      "nature-holocene-compaction-2008",
      "cpra-adaptive-coastal-plan",
    ];

    expect(SINKING_DELTA_SOURCES).toHaveLength(5);
    expect(SINKING_DELTA_SOURCES.map((source) => source.id)).toEqual(expectedIds);
    expect(new Set(expectedIds).size).toBe(expectedIds.length);

    for (const source of SINKING_DELTA_SOURCES) {
      expect(source.id).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
      expect(source.claimIds.length).toBeGreaterThan(0);
      expect(new Set(source.claimIds).size).toBe(source.claimIds.length);
      expect(source.authority.trim().length).toBeGreaterThan(3);
      expect(source.title.trim().length).toBeGreaterThan(6);
      expect(source.citation.trim().length).toBeGreaterThan(8);
      expect(source.url).toMatch(/^https:\/\//);
      expect(source.supports.trim().length).toBeGreaterThan(30);
      expect(source.boundary.trim().length).toBeGreaterThan(45);
    }
  });

  it("resolves every visible claim to sources and every source back to claims", () => {
    const sourcesById = new Map(
      SINKING_DELTA_SOURCES.map((source) => [source.id, source]),
    );

    for (const [claimId, claim] of Object.entries(
      SINKING_DELTA_VISIBLE_CLAIMS,
    )) {
      expect(claim.scene).toBeGreaterThanOrEqual(1);
      expect(claim.scene).toBeLessThanOrEqual(5);
      expect(claim.beat).toBeGreaterThanOrEqual(0);
      expect(claim.sourceIds.length).toBeGreaterThan(0);
      expect(claim.visibleLabels.en.length).toBeGreaterThan(0);
      expect(claim.visibleLabels.zh.length).toBeGreaterThan(0);

      for (const sourceId of claim.sourceIds) {
        const source = sourcesById.get(sourceId);
        expect(source, `${claimId} references ${sourceId}`).toBeDefined();
        expect(source?.claimIds).toContain(claimId);
      }
    }

    for (const source of SINKING_DELTA_SOURCES) {
      for (const claimId of source.claimIds) {
        const claim = SINKING_DELTA_VISIBLE_CLAIMS[claimId];
        expect(claim, `${source.id} references ${claimId}`).toBeDefined();
        expect(claim.sourceIds).toContain(source.id);
      }
    }
  });

  it("keeps mapped claim labels visible in both languages", () => {
    for (const claim of Object.values(SINKING_DELTA_VISIBLE_CLAIMS)) {
      for (const language of ["en", "zh"] as const) {
        const view = renderStage({
          scene: claim.scene,
          beat: claim.beat,
          language,
        });

        for (const label of claim.visibleLabels[language]) {
          expect(view.activePanel()).toHaveTextContent(label);
        }
        view.unmount();
      }
    }
  });

  it("removes the terminated Mid-Barataria case from current strategy evidence", () => {
    const sourceText = JSON.stringify(SINKING_DELTA_SOURCES);
    const auditedText = `${componentSource}\n${sourceText}`;

    expect(auditedText).not.toContain(
      "https://coastal.la.gov/midbarataria/faqs.html",
    );
    expect(auditedText).not.toMatch(/Mid-Barataria|midbarataria/i);
    expect(auditedText).not.toMatch(/2023 construction/i);

    const adaptivePlan = SINKING_DELTA_SOURCES.find(
      (source) => source.id === "cpra-adaptive-coastal-plan",
    );
    expect(adaptivePlan?.url).toBe("https://coastal.la.gov/our-plan/");
    expect(adaptivePlan?.supports).toContain("adaptive systems portfolio");
    expect(adaptivePlan?.boundary).toContain("not the current status");

    const sediment = renderStage({ scene: 2 });
    expect(sediment.activePanel()).toHaveTextContent(
      "A distributary moves sediment; deposition depends on where material can reach and remain.",
    );
    sediment.unmount();

    const restoration = renderStage({ scene: 5 });
    expect(restoration.activePanel()).toHaveTextContent(
      "STRATEGY FAMILY ≠ ACTIVE PROJECT",
    );
    restoration.unmount();
  });

  it("keeps five localized scenes aligned to the 4-1-2-2-1 curve", () => {
    const english = getMetadata("en");
    const chinese = getMetadata("zh");

    expect(english.id).toBe("neo-brutalist-bulletin");
    expect(english.scenes.map((scene) => scene.id)).toEqual([1, 2, 3, 4, 5]);
    expect(chinese.scenes.map((scene) => scene.id)).toEqual([1, 2, 3, 4, 5]);
    expect(english.scenes.map((scene) => scene.beats.length)).toEqual(
      chinese.scenes.map((scene) => scene.beats.length),
    );

    for (const scene of english.scenes) {
      expect(scene.beats).toHaveLength(BEAT_COUNTS[scene.id]);
      scene.beats.forEach((beat, index) => expect(beat.id).toBe(index));
    }
  });

  it("renders every English and Chinese beat in stable reserved layouts", () => {
    for (const language of ["en", "zh"] as const) {
      for (let scene = 1; scene <= 5; scene += 1) {
        for (let beat = 0; beat < BEAT_COUNTS[scene]; beat += 1) {
          const stage = renderStage({ language, scene, beat });
          expect(stage.root()).not.toBeNull();
          expect(stage.activePanel()).toHaveAttribute(
            "data-scene-id",
            String(scene),
          );
          expect(stage.activePanel()).toHaveAttribute(
            "data-beat-layout-mode",
            "reserved",
          );
          expect(
            stage.activePanel()?.querySelectorAll(
              '[data-beat-layout-item="true"]',
            ).length,
          ).toBeGreaterThanOrEqual(2);
          expect(stage.activePanel()?.textContent?.trim().length).toBeGreaterThan(
            28,
          );
          stage.unmount();
        }
      }
    }
  });

  it("renders every authored scene edge with the score's transition", () => {
    const { container, rerenderProps } = renderStage({ scene: 1 });
    const track = () =>
      container.querySelector<HTMLElement>('[data-spatial-scene-track="true"]');

    rerenderProps({ scene: 2 });
    expect(track()).toHaveAttribute("data-scene-transition-kind", "hard-cut");

    rerenderProps({ scene: 3 });
    expect(track()).toHaveAttribute("data-scene-transition-kind", "grid-reveal");

    rerenderProps({ scene: 4 });
    expect(track()).toHaveAttribute("data-scene-transition-kind", "diagonal-pan");

    rerenderProps({ scene: 5 });
    expect(track()).toHaveAttribute("data-scene-transition-kind", "hard-cut");
  });
});

describe("Sinking Delta facts and boundaries", () => {
  it("labels the shoreline estimate with its region, years, and scope", () => {
    const { activePanel } = renderStage({ scene: 1, beat: 1 });

    expect(activePanel()).toHaveTextContent("COASTAL LOUISIANA");
    expect(activePanel()).toHaveTextContent("1932—2016");
    expect(activePanel()).toHaveTextContent(">2,000 SQ MI");
    expect(activePanel()).toHaveTextContent("NOT A MISSISSIPPI DELTA-ONLY TOTAL");
  });

  it("keeps the balance multi-force and refuses a single subsidence rate", () => {
    const section = renderStage({ scene: 3, beat: 1 });
    expect(section.activePanel()).toHaveTextContent("PLACE + STRATA CHANGE THE RATE");
    expect(section.activePanel()).toHaveTextContent("NOT ONE RATE");
    section.unmount();

    const routing = renderStage({ scene: 4, beat: 1 });
    expect(routing.activePanel()).toHaveTextContent("NOT ONE CAUSE");
    expect(routing.activePanel()).toHaveTextContent("LEVEES");
    expect(routing.activePanel()).toHaveTextContent("EROSION");
    routing.unmount();

    const finish = renderStage({ scene: 5 });
    expect(finish.activePanel()).toHaveTextContent("RESTORATION IS NOT A SWITCH");
    expect(finish.activePanel()).toHaveTextContent(
      "LIMITED SEDIMENT · SYSTEM FIT · CHANGE OVER TIME",
    );
  });

  it("localizes the scene-one regional estimate and multi-force boundary", () => {
    const { activePanel } = renderStage({ language: "zh", scene: 1, beat: 3 });
    const panel = within(activePanel()!);

    expect(panel.getByText("沿海路易斯安那州 / 历史陆地变化")).toBeInTheDocument();
    expect(panel.getByText("1932—2016")).toBeInTheDocument();
    expect(panel.getByText(">2,000 平方英里")).toBeInTheDocument();
    expect(
      panel.getByText("不是密西西比河三角洲单一区域总量 · [S1]"),
    ).toBeInTheDocument();
    expect(
      panel.getByText("压实 · 海平面 · 侵蚀 · 流路 · 沉积 [S2–S4]"),
    ).toBeInTheDocument();
  });

  it("localizes the scene-two sediment diagram labels", () => {
    const { activePanel } = renderStage({ language: "zh", scene: 2 });
    const panel = within(activePanel()!);

    expect(panel.getByText("河流携带泥沙")).toBeInTheDocument();
    expect(panel.getByText("沉积楔体")).toBeInTheDocument();
    expect(panel.getByText("开阔水域")).toBeInTheDocument();
    expect(panel.getByText("输入 ≠ 保证")).toBeInTheDocument();
    expect(
      panel.getByText("密西西比河三角洲 · 原创示意图 · [S2, S5]"),
    ).toBeInTheDocument();
  });

  it("localizes the scene-three elevation section and rate boundary", () => {
    const { activePanel } = renderStage({ language: "zh", scene: 3, beat: 1 });
    const panel = within(activePanel()!);

    expect(panel.getByText("海平面 / 独立基线")).toBeInTheDocument();
    expect(panel.getByText("湿地表面")).toBeInTheDocument();
    expect(panel.getByText("矿物质 + 有机物累积")).toBeInTheDocument();
    expect(panel.getByText("压实 / 脱水")).toBeInTheDocument();
    expect(panel.getByText("三角洲地层")).toBeInTheDocument();
    expect(panel.getByText("地点 + 地层改变速率")).toBeInTheDocument();
    expect(
      panel.getByText("不是单一速率 · 不是单一剖面 · [S3, S4]"),
    ).toBeInTheDocument();
  });

  it("localizes the scene-four routing topology and force legend", () => {
    const { activePanel } = renderStage({ language: "zh", scene: 4, beat: 1 });
    const panel = within(activePanel()!);

    expect(panel.getByText("主河道")).toBeInTheDocument();
    expect(panel.getByText("有堤边缘")).toBeInTheDocument();
    expect(panel.getByText("湿地块")).toBeInTheDocument();
    expect(panel.getByText("漫滩输送改变")).toBeInTheDocument();
    expect(panel.getByText("边缘流失能重新搬运泥沙")).toBeInTheDocument();
    expect(panel.getByText("相对位置改变淹水")).toBeInTheDocument();
    expect(panel.getByText("地下过程持续")).toBeInTheDocument();
    expect(
      panel.getByText("耦合陆地—水域系统中的一条流路 · [S2, S3]"),
    ).toBeInTheDocument();
  });

  it("localizes the scene-five restoration limits", () => {
    const { activePanel } = renderStage({ language: "zh", scene: 5 });
    const panel = within(activePanel()!);

    expect(
      panel.getByText("密西西比河三角洲 / 原创修复镶嵌 [S5]"),
    ).toBeInTheDocument();
    expect(
      panel.getByText("泥沙有限 · 系统适配 · 随时间调整"),
    ).toBeInTheDocument();
    expect(
      panel.getByText("策略类型 ≠ 在建项目 · 不保证永久陆地 [S5]"),
    ).toBeInTheDocument();
  });
});

describe("Sinking Delta navigation and deterministic modes", () => {
  it("renders five draggable distributary blocks with the declared audit profile", () => {
    const { root } = renderStage({ scene: 3 });
    const navigation = root()?.querySelector<HTMLElement>(
      '[data-topic-navigation="true"]',
    );

    expect(navigation).toHaveAttribute("data-navigation-geometry", "spatial-node");
    expect(navigation).toHaveAttribute(
      "data-navigation-carrier",
      "delta-distributary-blocks",
    );
    expect(navigation).toHaveAttribute("data-navigation-invocation", "drag-scrub");
    expect(navigation).toHaveAttribute(
      "data-navigation-feedback",
      "mechanical-displacement",
    );
    expect(navigation).toHaveAttribute("tabindex", "0");
    expect(within(navigation!).getAllByRole("button")).toHaveLength(5);
    expect(
      within(navigation!).getByRole("button", {
        name: "Scene 3 · Compaction section",
      }),
    ).toHaveAttribute("aria-current", "step");
  });

  it("isolates click, tap, Space, Enter, repeat keys, and container keys", () => {
    const onNavigate = vi.fn();
    const onStageClick = vi.fn();
    const onStageKeyDown = vi.fn();
    const { root } = renderStage(
      { scene: 2, onNavigate },
      onStageClick,
      onStageKeyDown,
    );
    const navigation = root()?.querySelector<HTMLElement>(
      '[data-topic-navigation="true"]',
    );
    const target = within(navigation!).getByRole("button", {
      name: "Scene 4 · Routed sediment",
    });

    fireEvent.pointerDown(target);
    fireEvent.click(target);
    expect(onNavigate).toHaveBeenLastCalledWith(4, 0);
    expect(onStageClick).not.toHaveBeenCalled();

    onNavigate.mockClear();
    fireEvent.keyDown(target, { key: " ", repeat: false });
    expect(onNavigate).toHaveBeenCalledTimes(1);
    expect(onNavigate).toHaveBeenCalledWith(4, 0);
    expect(onStageKeyDown).not.toHaveBeenCalled();

    onNavigate.mockClear();
    fireEvent.keyDown(target, { key: "Enter", repeat: false });
    expect(onNavigate).toHaveBeenCalledTimes(1);
    expect(onNavigate).toHaveBeenCalledWith(4, 0);

    onNavigate.mockClear();
    fireEvent.keyDown(target, { key: "Enter", repeat: true });
    expect(onNavigate).not.toHaveBeenCalled();

    fireEvent.keyDown(navigation!, { key: "ArrowRight", repeat: false });
    expect(onNavigate).toHaveBeenCalledWith(3, 0);
  });

  it("keeps every touch phase inside the navigation before stage touch navigation sees it", () => {
    const view = renderStage({ scene: 2 });
    const stage = view.getByTestId("stage");
    const navigation = view.root()?.querySelector<HTMLElement>(
      '[data-topic-navigation="true"]',
    );
    const surface = view.root()?.querySelector<HTMLElement>(
      '[data-navigation-scrub-surface="true"]',
    );
    const stageTouchListener = vi.fn();
    const windowTouchListener = vi.fn();
    const touchTypes = [
      "touchstart",
      "touchmove",
      "touchend",
      "touchcancel",
    ] as const;

    for (const type of touchTypes) {
      stage.addEventListener(type, stageTouchListener);
      window.addEventListener(type, windowTouchListener);
    }

    try {
      for (const target of [navigation!, surface!]) {
        for (const type of touchTypes) {
          const event = new Event(type, { bubbles: true, cancelable: true });
          fireEvent(target, event);
        }
      }

      expect(stageTouchListener).not.toHaveBeenCalled();
      expect(windowTouchListener).not.toHaveBeenCalled();
    } finally {
      for (const type of touchTypes) {
        stage.removeEventListener(type, stageTouchListener);
        window.removeEventListener(type, windowTouchListener);
      }
      view.unmount();
    }
  });

  it("scrubs scenes by pointer movement and safely ignores a zero-width surface", () => {
    const onNavigate = vi.fn();
    const { root } = renderStage({ scene: 1, onNavigate });
    const surface = root()?.querySelector<HTMLElement>(
      '[data-navigation-scrub-surface="true"]',
    );

    vi.spyOn(surface!, "getBoundingClientRect").mockReturnValue({
      x: 100,
      y: 0,
      width: 1000,
      height: 100,
      top: 0,
      right: 1100,
      bottom: 100,
      left: 100,
      toJSON: () => ({}),
    });

    const pointer = (type: string, clientX: number) => {
      const event = new Event(type, { bubbles: true });
      Object.defineProperties(event, {
        clientX: { value: clientX },
        pointerId: { value: 7 },
      });
      fireEvent(surface!, event);
    };

    pointer("pointerdown", 630);
    pointer("pointermove", 1090);
    pointer("pointerup", 1090);
    expect(onNavigate).toHaveBeenCalledWith(3, 0);
    expect(onNavigate).toHaveBeenCalledWith(5, 0);

    onNavigate.mockClear();
    vi.spyOn(surface!, "getBoundingClientRect").mockReturnValue({
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      toJSON: () => ({}),
    });
    expect(() => pointer("pointerdown", 0)).not.toThrow();
    expect(onNavigate).not.toHaveBeenCalled();
  });

  it("settles reduced and thumbnail frames, with no thumbnail navigation", () => {
    const reduced = renderStage({ scene: 3, beat: 1, reducedMotion: true });
    expect(reduced.root()).toHaveAttribute("data-motion", "off");
    expect(reduced.root()).toHaveAttribute("data-frozen", "true");
    expect(
      reduced.activePanel()?.querySelector('[data-cross-section="settled"]'),
    ).not.toBeNull();
    reduced.unmount();

    const thumbnail = renderStage({
      scene: 4,
      beat: 1,
      isThumbnail: true,
      onNavigate: undefined,
    });
    expect(thumbnail.root()).toHaveAttribute("data-motion", "off");
    expect(thumbnail.root()).toHaveAttribute("data-frozen", "true");
    expect(
      thumbnail.root()?.querySelector('[data-topic-navigation="true"]'),
    ).toBeNull();
  });
});

describe("Sinking Delta lifecycle and layout hygiene", () => {
  it("uses shared scene lifecycle without clones, loops, timers, or remote assets", () => {
    expect(componentSource).toContain("<SpatialSceneTrack");
    expect(componentSource).not.toMatch(
      /outgoingScene|isTransitionClone|data-transition-clone|setInterval|setTimeout|requestAnimationFrame/,
    );
    expect(componentSource).not.toMatch(/<img[^>]+https?:\/\//);
    expect(componentSource).not.toMatch(/animation-iteration-count:\s*infinite/);
  });

  it("uses only stage-relative authored dimensions and clips the track", () => {
    const { root } = renderStage();
    expect(root()).not.toBeNull();
    expect(
      root()?.querySelector<HTMLElement>('[data-spatial-scene-track="true"]')
        ?.style.overflow,
    ).toBe("hidden");
    expect(componentSource).not.toMatch(
      /\b\d+(?:\.\d+)?(?:px|rem|em|vw|vh)\b/,
    );
  });
});

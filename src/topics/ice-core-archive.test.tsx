import { useRef } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, within } from "@testing-library/react";
import type { TopicStageProps } from "../domain/topic";
import { useTouchNav } from "../hooks/useTouchNav";
import definition, {
  ICE_CORE_ARCHIVE_CLAIMS,
  ICE_CORE_ARCHIVE_SCENE_CLAIMS,
  ICE_CORE_ARCHIVE_SOURCES,
  ICE_CORE_ARCHIVE_TRANSITION_SCORE,
} from "./ice-core-archive";
import componentSource from "./ice-core-archive.tsx?raw";
import { runTopicContract } from "../testing/topic-contract";

const { Stage: IceCoreArchive } = definition;

runTopicContract(definition);

const BEAT_COUNTS: Record<number, number> = {
  1: 4,
  2: 3,
  3: 2,
  4: 1,
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

function StageFrame({
  props,
  onStageClick,
  onStageNext,
  onStagePrev,
}: {
  props: TopicStageProps;
  onStageClick?: () => void;
  onStageNext: () => void;
  onStagePrev: () => void;
}) {
  const stageRef = useRef<HTMLDivElement>(null);
  useTouchNav({
    elementRef: stageRef,
    onNext: onStageNext,
    onPrev: onStagePrev,
    enabled: true,
  });

  return (
    <div
      ref={stageRef}
      data-testid="stage"
      style={{
        width: 1920,
        height: 1080,
        containerType: "size",
        overflow: "hidden",
        position: "relative",
      }}
      onClick={onStageClick}
    >
      <IceCoreArchive {...props} />
    </div>
  );
}

function renderStage(
  overrides: Partial<TopicStageProps> = {},
  onStageClick = vi.fn(),
  onStageNext = vi.fn(),
  onStagePrev = vi.fn(),
) {
  const props = { ...BASE_PROPS, onNavigate: vi.fn(), ...overrides };
  const result = render(
    <StageFrame
      props={props}
      onStageClick={onStageClick}
      onStageNext={onStageNext}
      onStagePrev={onStagePrev}
    />,
  );

  return {
    ...result,
    props,
    stage: () => result.getByTestId("stage"),
    root: () =>
      result.container.querySelector<HTMLElement>(
        '[data-topic-id="ice-core-archive"]',
      ),
    activePanel: () =>
      result.container.querySelector<HTMLElement>(
        '[data-spatial-scene-panel="true"][data-active="true"]',
      ),
    rerenderProps(next: Partial<TopicStageProps>) {
      result.rerender(
        <StageFrame
          props={{ ...props, ...next }}
          onStageClick={onStageClick}
          onStageNext={onStageNext}
          onStagePrev={onStagePrev}
        />,
      );
    },
  };
}

function dispatchPointer(
  element: Element,
  type: "pointerdown" | "pointermove" | "pointerup",
  clientX: number,
) {
  const event = new Event(type, { bubbles: true, cancelable: true });
  Object.defineProperties(event, {
    clientX: { value: clientX },
    clientY: { value: 220 },
    pointerId: { value: 1 },
  });
  fireEvent(element, event);
}

type NativeTouchType = "touchstart" | "touchmove" | "touchend" | "touchcancel";

function dispatchNativeTouch(
  element: Element,
  type: NativeTouchType,
  clientX = 80,
  clientY = 120,
) {
  const touch = { clientX, clientY, target: element };
  const event = new Event(type, {
    bubbles: true,
    cancelable: true,
  }) as TouchEvent;
  const activeTouches = type === "touchend" || type === "touchcancel" ? [] : [touch];
  Object.defineProperties(event, {
    touches: { value: activeTouches },
    changedTouches: { value: [touch] },
    targetTouches: { value: activeTouches },
  });
  fireEvent(element, event);
}

afterEach(() => {
  document.documentElement.removeAttribute("data-frozen");
  cleanup();
});

describe("Cassette-Era Packaging / Ice-Core Archive — topic protocol and evidence", () => {
  it("exports the assigned topic, model, navigation profile, and exact transition score", () => {
    expect(definition.id).toBe("ice-core-archive");
    expect(definition.title).toEqual({
      en: "Ice-Core Archive",
      zh: "冰芯档案",
    });
    expect(definition.modelId).toBe("GPT 5.6 Sol");
    expect(definition.navigation).toEqual({
      geometry: "object-controller",
      carrier: "ice-core-tape-reels",
      invocation: "drag-scrub",
      feedback: "active-glow",
    });
    expect(definition.evidence.kind).toBe("mixed");
    if (definition.evidence.kind === "mixed") {
      expect(definition.evidence.sources).toBe(ICE_CORE_ARCHIVE_SOURCES);
    }
    expect(definition.transitionScore).toBe(
      ICE_CORE_ARCHIVE_TRANSITION_SCORE,
    );
    expect(ICE_CORE_ARCHIVE_TRANSITION_SCORE).toEqual({
      "1->2": "scanline",
      "2->3": "push-y",
      "3->4": "afterimage",
      "4->5": "hard-cut",
    });
  });

  it("ships authoritative, claim-scoped source packets with real HTTPS links and explicit boundaries", () => {
    expect(ICE_CORE_ARCHIVE_SOURCES).toHaveLength(7);
    expect(ICE_CORE_ARCHIVE_SOURCES.map((source) => source.id)).toEqual([
      "noaa-ncei-ice-core-proxies",
      "nasa-ice-core-record",
      "noaa-climate-ice-core-study",
      "fischer-dust-transport",
      "bender-gas-ice-age",
      "van-der-wel-isotope-diffusion",
      "winski-sp19-chronology",
    ]);
    expect(ICE_CORE_ARCHIVE_SOURCES.map((source) => source.authority)).toEqual(
      expect.arrayContaining([
        "NOAA National Centers for Environmental Information",
        "NASA Earth Observatory",
        "The Cryosphere",
        "Climate of the Past",
      ]),
    );

    for (const source of ICE_CORE_ARCHIVE_SOURCES) {
      expect(source.id).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
      expect(source.url).toMatch(/^https:\/\//);
      expect(source.accessDate).toBe("2026-07-10");
      expect(source.title.trim().length).toBeGreaterThan(12);
      expect(source.citation.trim().length).toBeGreaterThan(30);
      expect(source.supports.trim().length).toBeGreaterThan(100);
      expect(source.boundary.trim().length).toBeGreaterThan(100);
      expect(source.claimIds.length).toBeGreaterThan(0);
      expect(new Set(source.claimIds).size).toBe(source.claimIds.length);
    }
  });

  it("resolves every visible claim bidirectionally through source IDs and scene assignments", () => {
    const claimsById = new Map(
      ICE_CORE_ARCHIVE_CLAIMS.map((claim) => [claim.id, claim]),
    );
    const sourcesById = new Map(
      ICE_CORE_ARCHIVE_SOURCES.map((source) => [source.id, source]),
    );

    expect(claimsById.size).toBe(ICE_CORE_ARCHIVE_CLAIMS.length);
    expect(sourcesById.size).toBe(ICE_CORE_ARCHIVE_SOURCES.length);

    for (const claim of ICE_CORE_ARCHIVE_CLAIMS) {
      expect(claim.visibleClaim.trim().length).toBeGreaterThan(100);
      expect(claim.sceneIds.length).toBeGreaterThan(0);
      expect(claim.sourceIds.length).toBeGreaterThan(0);
      for (const sceneId of claim.sceneIds) {
        expect(ICE_CORE_ARCHIVE_SCENE_CLAIMS[sceneId]).toContain(claim.id);
      }
      for (const sourceId of claim.sourceIds) {
        const source = sourcesById.get(sourceId);
        expect(source, claim.id + " -> " + sourceId).toBeDefined();
        expect(source?.claimIds).toContain(claim.id);
      }
    }

    for (const source of ICE_CORE_ARCHIVE_SOURCES) {
      for (const claimId of source.claimIds) {
        const claim = claimsById.get(claimId);
        expect(claim, source.id + " -> " + claimId).toBeDefined();
        expect(claim?.sourceIds).toContain(source.id);
      }
    }

    const allSceneClaims = new Set(
      Object.values(ICE_CORE_ARCHIVE_SCENE_CLAIMS).flat(),
    );
    expect(allSceneClaims).toEqual(
      new Set(ICE_CORE_ARCHIVE_CLAIMS.map((claim) => claim.id)),
    );
  });

  it("keeps both languages aligned to the planned 4-3-2-1-1 beat curve", () => {
    for (const language of ["en", "zh"] as const) {
      const metadata = definition.metadata[language];
      expect(definition.styleId).toBe("cassette-era-packaging");
      expect(metadata.heroScene).toBe(3);
      expect(metadata.scenes.map((scene) => scene.id)).toEqual([1, 2, 3, 4, 5]);
      expect(metadata.scenes.map((scene) => scene.beats.length)).toEqual([
        4, 3, 2, 1, 1,
      ]);
      for (const scene of metadata.scenes) {
        scene.beats.forEach((beat, index) => {
          expect(beat.id).toBe(index);
          expect(beat.action.trim().length).toBeGreaterThan(0);
          expect(beat.title.trim().length).toBeGreaterThan(0);
          expect(beat.body.trim().length).toBeGreaterThan(0);
        });
      }
    }
  });
});

describe("Cassette-Era Packaging / Ice-Core Archive — scenes and scientific boundary", () => {
  it("renders every English and Chinese frame with five distinct compositions and visible source stamps", () => {
    for (const language of ["en", "zh"] as const) {
      const compositions = new Set<string>();
      for (let scene = 1; scene <= 5; scene += 1) {
        for (let beat = 0; beat < BEAT_COUNTS[scene]; beat += 1) {
          const view = renderStage({
            language,
            scene,
            beat,
            reducedMotion: true,
          });
          const panel = view.activePanel();
          const composition = panel?.querySelector<HTMLElement>("[data-composition]");
          const expectedClaimIds =
            ICE_CORE_ARCHIVE_SCENE_CLAIMS[
              scene as keyof typeof ICE_CORE_ARCHIVE_SCENE_CLAIMS
            ].join(" ");

          expect(view.root()).not.toBeNull();
          expect(panel).toHaveAttribute("data-scene-id", String(scene));
          expect(composition).toHaveAttribute(
            "data-composition",
            expect.any(String),
          );
          expect(composition).toHaveAttribute("data-claim-ids", expectedClaimIds);
          expect(composition?.querySelector("[data-source-stamp='true']")).not.toBeNull();
          expect(panel?.textContent?.trim().length).toBeGreaterThan(70);
          if (beat === BEAT_COUNTS[scene] - 1) {
            compositions.add(composition?.dataset.composition ?? "");
          }
          view.unmount();
        }
      }
      expect(compositions.size).toBe(5);
    }
  });

  it("maps every active-scene claim to its exact source links in both languages", () => {
    for (const language of ["en", "zh"] as const) {
      for (const scene of [1, 2, 3, 4, 5] as const) {
        const view = renderStage({
          language,
          scene,
          beat: BEAT_COUNTS[scene] - 1,
          reducedMotion: true,
        });
        const panel = view.activePanel();
        const claimIds = ICE_CORE_ARCHIVE_SCENE_CLAIMS[scene];
        const claims = claimIds.map((claimId) => {
          const claim = ICE_CORE_ARCHIVE_CLAIMS.find(
            (candidate) => candidate.id === claimId,
          );
          expect(claim, "missing claim " + claimId).toBeDefined();
          return claim!;
        });
        const sourceIds = Array.from(
          new Set(claims.flatMap((claim) => [...claim.sourceIds])),
        );
        const expectedClaimSourceLinks = claims
          .map((claim) => claim.id + ":" + claim.sourceIds.join(","))
          .join(";");
        const traces = panel?.querySelectorAll<HTMLElement>(
          '[data-claim-source-map="true"]',
        );
        const trace = traces?.item(0);
        const visibleClaimIds = new Set(
          Array.from(
            panel?.querySelectorAll<HTMLElement>("[data-claim-id]") ?? [],
          ).map((element) => element.dataset.claimId),
        );
        const linkedSourceIds = Array.from(
          trace?.querySelectorAll<HTMLElement>("[data-source-id]") ?? [],
        ).map((element) => element.dataset.sourceId);

        expect(traces).toHaveLength(1);
        expect(trace).toHaveAttribute("data-scene-id", String(scene));
        expect(trace).toHaveAttribute("data-claim-ids", claimIds.join(" "));
        expect(trace).toHaveAttribute("data-source-ids", sourceIds.join(" "));
        expect(trace).toHaveAttribute(
          "data-claim-source-links",
          expectedClaimSourceLinks,
        );
        expect(linkedSourceIds).toEqual(sourceIds);

        for (const claim of claims) {
          expect(visibleClaimIds).toContain(claim.id);
          expect(trace?.dataset.claimSourceLinks?.split(";")).toContain(
            claim.id + ":" + claim.sourceIds.join(","),
          );
          for (const sourceId of claim.sourceIds) {
            const source = ICE_CORE_ARCHIVE_SOURCES.find(
              (candidate) => candidate.id === sourceId,
            );
            const link = trace?.querySelector<HTMLAnchorElement>(
              '[data-source-id="' + sourceId + '"]',
            );
            expect(source, claim.id + " -> " + sourceId).toBeDefined();
            expect(link, claim.id + " -> " + sourceId).not.toBeNull();
            expect(link?.href).toBe(source?.url);
          }
        }
        view.unmount();
      }
    }
  });

  it("keeps the proxy meanings distinct and rejects a direct-temperature reading", () => {
    const sceneTwo = renderStage({ scene: 2, beat: 2, reducedMotion: true });
    const panelTwo = sceneTwo.activePanel();
    const isotopeClaim = ICE_CORE_ARCHIVE_CLAIMS.find(
      (claim) => claim.id === "water-isotope-proxy",
    );
    const isotopeLane = panelTwo?.querySelector<HTMLElement>(
      '[data-claim-id="water-isotope-proxy"]',
    );
    expect(panelTwo).toHaveTextContent(/Air is sealed after firn closes/i);
    expect(isotopeClaim?.visibleClaim).toMatch(
      /temperature-related.*firn diffusion.*accumulation rate/i,
    );
    expect(isotopeClaim?.visibleClaim).not.toMatch(/moisture|source|path/i);
    expect(isotopeLane).toHaveTextContent(
      /temperature-related.*firn diffusion.*accumulation/i,
    );
    expect(isotopeLane).not.toHaveTextContent(/moisture|source, path/i);
    expect(panelTwo).toHaveTextContent(/source, transport, and deposition/i);
    expect(panelTwo).toHaveTextContent(/not one temperature dial/i);
    sceneTwo.unmount();

    const sceneTwoZh = renderStage({
      scene: 2,
      beat: 2,
      language: "zh",
      reducedMotion: true,
    });
    const isotopeLaneZh = sceneTwoZh.activePanel()?.querySelector<HTMLElement>(
      '[data-claim-id="water-isotope-proxy"]',
    );
    expect(isotopeLaneZh).toHaveTextContent(/粒雪层扩散.*积累率/);
    expect(isotopeLaneZh).not.toHaveTextContent(/水汽来源|路径/);
    sceneTwoZh.unmount();

    const sceneThree = renderStage({ scene: 3, beat: 1, reducedMotion: true });
    expect(sceneThree.activePanel()).toHaveTextContent(
      /not climate values, not an audio spectrum/i,
    );
    expect(
      sceneThree.activePanel()?.querySelectorAll("[data-sampling-lane]"),
    ).toHaveLength(3);
    expect(
      sceneThree.activePanel()?.querySelector("[data-reader-head='true']"),
    ).toHaveAttribute("data-reader-position", "settled");
    sceneThree.unmount();

    const sceneFour = renderStage({ scene: 4, beat: 0, reducedMotion: true });
    expect(sceneFour.activePanel()).toHaveTextContent(/TIE POINT/i);
    expect(sceneFour.activePanel()).toHaveTextContent(/THIN OR UNRESOLVED LAYERS/i);
    expect(
      sceneFour.activePanel()?.querySelector("[data-chronology-gap='true']"),
    ).not.toBeNull();
    sceneFour.unmount();

    const sceneFive = renderStage({ scene: 5, beat: 0, reducedMotion: true });
    expect(sceneFive.activePanel()).toHaveTextContent(
      /ARCHIVE, NOT A SINGLE THERMOMETER/i,
    );
    expect(
      sceneFive.activePanel()?.querySelectorAll("[data-final-track]"),
    ).toHaveLength(5);
    sceneFive.unmount();
  });

  it("marks every multi-beat scene as a stable reserved layout", () => {
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
});

describe("Cassette-Era Packaging / Ice-Core Archive — transitions and reel navigation", () => {
  it("applies the planned four-edge score with the ice-core scrub modifier on the signature edge", () => {
    const view = renderStage({ scene: 1, beat: 0 });
    const track = () =>
      view.container.querySelector<HTMLElement>(
        '[data-spatial-scene-track="true"]',
      );

    view.rerenderProps({ scene: 2, beat: 0 });
    expect(track()).toHaveAttribute("data-scene-transition-kind", "scanline");
    view.rerenderProps({ scene: 3, beat: 0 });
    expect(track()).toHaveAttribute("data-scene-transition-kind", "push-y");
    expect(track()).toHaveAttribute(
      "data-scene-transition-modifier",
      "ice-core-scrub",
    );
    view.rerenderProps({ scene: 4, beat: 0 });
    expect(track()).toHaveAttribute("data-scene-transition-kind", "afterimage");
    view.rerenderProps({ scene: 5, beat: 0 });
    expect(track()).toHaveAttribute("data-scene-transition-kind", "hard-cut");
    expect(
      view.container.querySelector("[data-transition-clone='true']"),
    ).toBeNull();
  });

  it("exposes the ice-core tape-reel contract and isolates direct click/tap navigation", () => {
    const onStageClick = vi.fn();
    const view = renderStage({}, onStageClick);
    const navigation = view.container.querySelector<HTMLElement>(
      '[data-topic-navigation="true"]',
    );
    const sceneThree = within(navigation!).getByRole("button", {
      name: /^Jump to scene 3:/,
    });

    expect(navigation).toHaveAttribute("data-navigation-geometry", "object-controller");
    expect(navigation).toHaveAttribute(
      "data-navigation-carrier",
      "ice-core-tape-reels",
    );
    expect(navigation).toHaveAttribute("data-navigation-invocation", "drag-scrub");
    expect(navigation).toHaveAttribute("data-navigation-feedback", "active-glow");
    expect(within(navigation!).getAllByRole("button")).toHaveLength(5);

    fireEvent.pointerDown(sceneThree, { clientX: 80, clientY: 100, pointerId: 1 });
    fireEvent.pointerUp(sceneThree, { clientX: 80, clientY: 100, pointerId: 1 });
    fireEvent.click(sceneThree);

    expect(view.props.onNavigate).toHaveBeenCalledTimes(1);
    expect(view.props.onNavigate).toHaveBeenCalledWith(3, 0);
    expect(onStageClick).not.toHaveBeenCalled();
  });

  it("offers drag-scrub and absolute keyboard equivalents without leaking a key to the stage", () => {
    const onStageClick = vi.fn();
    const onWindowKeyDown = vi.fn();
    const view = renderStage({}, onStageClick);
    const navigation = view.container.querySelector<HTMLElement>(
      '[data-topic-navigation="true"]',
    );
    const sceneThree = within(navigation!).getByRole("button", {
      name: /^Jump to scene 3:/,
    });

    Object.defineProperty(navigation!, "getBoundingClientRect", {
      configurable: true,
      value: () =>
        ({
          left: 0,
          top: 0,
          right: 500,
          bottom: 120,
          width: 500,
          height: 120,
        }) as DOMRect,
    });

    dispatchPointer(navigation!, "pointerdown", 40);
    dispatchPointer(navigation!, "pointermove", 378);
    expect(navigation).toHaveAttribute("data-scrubbing", "true");
    dispatchPointer(navigation!, "pointerup", 378);
    expect(view.props.onNavigate).toHaveBeenCalledWith(4, 0);

    window.addEventListener("keydown", onWindowKeyDown);
    try {
      fireEvent.keyDown(sceneThree, { key: "ArrowLeft" });
      fireEvent.keyDown(sceneThree, { key: "ArrowRight" });
      fireEvent.keyDown(sceneThree, { key: "Home" });
      fireEvent.keyDown(sceneThree, { key: "End" });
      fireEvent.keyDown(sceneThree, { key: " ", repeat: true });
      fireEvent.keyDown(sceneThree, { key: "a" });
    } finally {
      window.removeEventListener("keydown", onWindowKeyDown);
    }

    const onNavigate = view.props.onNavigate as ReturnType<typeof vi.fn>;
    expect(onNavigate.mock.calls).toEqual([
      [4, 0],
      [2, 0],
      [4, 0],
      [1, 0],
      [5, 0],
    ]);
    expect(onWindowKeyDown).not.toHaveBeenCalled();
    expect(onStageClick).not.toHaveBeenCalled();
  });

  it("isolates native touch phases from stage and window navigation while ordinary stage touch still advances", () => {
    const onStageNext = vi.fn();
    const onStageTouch = vi.fn();
    const onWindowTouch = vi.fn();
    const view = renderStage({}, vi.fn(), onStageNext);
    const stage = view.stage();
    const navigation = view.container.querySelector<HTMLElement>(
      '[data-topic-navigation="true"]',
    );
    const sceneFour = within(navigation!).getByRole("button", {
      name: /^Jump to scene 4:/,
    });
    const touchTypes = [
      "touchstart",
      "touchmove",
      "touchend",
      "touchcancel",
    ] as const;

    for (const type of touchTypes) {
      stage.addEventListener(type, onStageTouch);
      window.addEventListener(type, onWindowTouch);
    }

    try {
      for (const target of [navigation!, sceneFour]) {
        dispatchNativeTouch(target, "touchstart");
        dispatchNativeTouch(target, "touchmove", 84, 160);
        dispatchNativeTouch(target, "touchcancel", 84, 160);
        dispatchNativeTouch(target, "touchstart");
        dispatchNativeTouch(target, "touchend");
      }

      expect(onStageNext).not.toHaveBeenCalled();
      expect(onStageTouch).not.toHaveBeenCalled();
      expect(onWindowTouch).not.toHaveBeenCalled();

      dispatchNativeTouch(stage, "touchstart", 960, 540);
      dispatchNativeTouch(stage, "touchend", 960, 540);

      expect(onStageNext).toHaveBeenCalledTimes(1);
      expect(onStageTouch).toHaveBeenCalledTimes(2);
      expect(onWindowTouch).toHaveBeenCalledTimes(2);
    } finally {
      for (const type of touchTypes) {
        stage.removeEventListener(type, onStageTouch);
        window.removeEventListener(type, onWindowTouch);
      }
      view.unmount();
    }
  });
});

describe("Cassette-Era Packaging / Ice-Core Archive — deterministic fixed-stage contract", () => {
  it("hides navigation in thumbnails and settles reduced-motion and frozen frames", () => {
    const thumbnail = renderStage({
      scene: 3,
      beat: 1,
      isThumbnail: true,
      reducedMotion: false,
    });
    expect(thumbnail.root()).toHaveAttribute("data-settled", "true");
    expect(thumbnail.root()).toHaveAttribute("data-motion", "off");
    expect(
      thumbnail.container.querySelector("[data-topic-navigation='true']"),
    ).toBeNull();
    expect(
      thumbnail.container.querySelector("[data-spatial-scene-strip='true']"),
    ).toHaveAttribute("data-reduced-motion", "true");
    expect(
      thumbnail.activePanel()?.querySelector("[data-reader-head='true']"),
    ).toHaveAttribute("data-reader-position", "settled");
    thumbnail.unmount();

    document.documentElement.dataset.frozen = "true";
    const frozen = renderStage({ scene: 2, beat: 2, reducedMotion: false });
    expect(frozen.root()).toHaveAttribute("data-frozen", "true");
    expect(frozen.root()).toHaveAttribute("data-settled", "true");
    expect(
      frozen.container.querySelector("[data-spatial-scene-strip='true']"),
    ).toHaveAttribute("data-reduced-motion", "true");
    frozen.unmount();
  });

  it("keeps navigation, source stamps, and all five mounted panels inside the stage-local topic DOM", () => {
    const view = renderStage({ scene: 5, beat: 0, reducedMotion: true });
    const root = view.root();
    const track = view.container.querySelector<HTMLElement>(
      "[data-spatial-scene-track='true']",
    );
    const navigation = root?.querySelector<HTMLElement>(
      "[data-topic-navigation='true']",
    );

    expect(track?.parentElement).toBe(root);
    expect(track?.querySelectorAll("[data-spatial-scene-panel='true']")).toHaveLength(5);
    expect(track).toHaveStyle({ overflow: "hidden" });
    expect(root?.contains(navigation ?? null)).toBe(true);
    expect(root?.querySelectorAll("[data-source-stamp='true']").length).toBeGreaterThan(0);
    expect(componentSource).toContain("className={styles.sceneTrack}");
    expect(componentSource).toContain('data-topic-navigation="true"');
  });

  it("uses original DOM and SVG only, without clone lifecycle, remote image assets, or forbidden cassette defaults", () => {
    expect(componentSource).toContain("<SpatialSceneTrack");
    expect(componentSource).not.toMatch(
      /isTransitionClone|outgoingScene|setInterval|requestAnimationFrame|<img\b/i,
    );
    expect(componentSource).not.toMatch(/player controls|retro catalog/i);
    expect(componentSource).toContain("not an audio spectrum");
    expect(componentSource).toContain("not a direct temperature dial");
  });
});

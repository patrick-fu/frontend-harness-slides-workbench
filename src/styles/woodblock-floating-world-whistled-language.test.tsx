import { useRef } from "react";
import { cleanup, fireEvent, render, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { BespokeStyleProps } from "../types";
import { useTouchNav } from "../hooks/useTouchNav";
import WhistledLanguage, {
  WHISTLED_LANGUAGE_CLAIMS,
  WHISTLED_LANGUAGE_COPY_CLAIMS,
  WHISTLED_LANGUAGE_SCENE_CLAIMS,
  WHISTLED_LANGUAGE_SOURCES,
  WHISTLED_LANGUAGE_TRANSITION_SCORE,
  getMetadata,
  whistledLanguageTopic,
} from "./woodblock-floating-world-whistled-language";
import componentSource from "./woodblock-floating-world-whistled-language.tsx?raw";

const BEAT_COUNTS: Record<number, number> = {
  1: 4,
  2: 3,
  3: 2,
  4: 1,
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
  onStageNext,
  onStagePrev,
}: {
  props: BespokeStyleProps;
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
      <WhistledLanguage {...props} />
    </div>
  );
}

function renderStage(
  overrides: Partial<BespokeStyleProps> = {},
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

  const root = () =>
    result.container.querySelector<HTMLElement>(
      '[data-topic-id="whistled-language"]',
    );
  const panel = () =>
    result.container.querySelector<HTMLElement>(
      '[data-spatial-scene-panel="true"][data-active="true"]',
    );

  return {
    ...result,
    props,
    root,
    panel,
    rerenderProps(next: Partial<BespokeStyleProps>) {
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

type NativeTouchType = "touchstart" | "touchmove" | "touchend" | "touchcancel";

function dispatchNativeTouch(
  element: Element,
  type: NativeTouchType,
  clientX = 80,
  clientY = 120,
) {
  const touch = { clientX, clientY, target: element };
  const event = new Event(type, { bubbles: true, cancelable: true }) as TouchEvent;
  const activeTouches = type === "touchend" || type === "touchcancel" ? [] : [touch];
  Object.defineProperties(event, {
    touches: { value: activeTouches },
    changedTouches: { value: [touch] },
    targetTouches: { value: activeTouches },
  });
  fireEvent(element, event);
}

afterEach(() => {
  cleanup();
  document.documentElement.removeAttribute("data-frozen");
});

describe("Woodblock Floating World / Whistled Language — topic packet", () => {
  it("exports the planned Topic, mountain-peak navigation, model, and transition score", () => {
    expect(whistledLanguageTopic.id).toBe("whistled-language");
    expect(whistledLanguageTopic.topic).toEqual({
      en: "Whistled Language",
      zh: "口哨语言",
    });
    expect(whistledLanguageTopic.model).toBe("GPT 5.6 Sol");
    expect(whistledLanguageTopic.navigation).toEqual({
      geometry: "spatial-node",
      carrier: "mountain-peak-array",
      invocation: "click-expand",
      feedback: "next-state-preview",
    });
    expect(whistledLanguageTopic.sources).toBe(WHISTLED_LANGUAGE_SOURCES);
    expect(whistledLanguageTopic.transitionScore).toBe(
      WHISTLED_LANGUAGE_TRANSITION_SCORE,
    );
    expect(WHISTLED_LANGUAGE_TRANSITION_SCORE).toEqual({
      "1->2": "ink-spread",
      "2->3": "crossfade",
      "3->4": "diagonal-pan",
      "4->5": "ink-spread",
    });
  });

  it("ships UNESCO, community, and Mazatec sources with bounded HTTPS claims", () => {
    expect(WHISTLED_LANGUAGE_SOURCES).toHaveLength(7);
    expect(WHISTLED_LANGUAGE_SOURCES.map((source) => source.id)).toEqual(
      expect.arrayContaining([
        "silbo-unesco",
        "silbo-community",
        "kus-unesco",
        "kus-safeguarding",
        "mazatec-sil-archive",
        "mazatec-cowan",
      ]),
    );

    for (const source of WHISTLED_LANGUAGE_SOURCES) {
      expect(source.authority.trim().length).toBeGreaterThan(3);
      expect(source.title.trim().length).toBeGreaterThan(8);
      expect(source.citation.trim().length).toBeGreaterThan(12);
      expect(source.url).toMatch(/^https:\/\//);
      expect(source.accessDate).toBe("2026-07-10");
      expect(source.supports.length).toBeGreaterThan(90);
      expect(source.boundary.length).toBeGreaterThan(100);
      expect(source.claimIds.length).toBeGreaterThan(0);
    }
  });

  it("keeps each visible claim reciprocal with its sources and scene stamps", () => {
    const claimsById = new Map(
      WHISTLED_LANGUAGE_CLAIMS.map((claim) => [claim.id, claim]),
    );
    const sourcesById = new Map(
      WHISTLED_LANGUAGE_SOURCES.map((source) => [source.id, source]),
    );

    for (const claim of WHISTLED_LANGUAGE_CLAIMS) {
      expect(claim.visibleClaim.length).toBeGreaterThan(70);
      expect(claim.sceneIds.length).toBeGreaterThan(0);
      expect(claim.sourceIds.length).toBeGreaterThan(0);

      for (const sceneId of claim.sceneIds) {
        expect(WHISTLED_LANGUAGE_SCENE_CLAIMS[sceneId]).toContain(claim.id);
      }
      for (const sourceId of claim.sourceIds) {
        const source = sourcesById.get(sourceId);
        expect(source, `${claim.id} -> ${sourceId}`).toBeDefined();
        expect(source?.claimIds).toContain(claim.id);
      }
    }

    for (const source of WHISTLED_LANGUAGE_SOURCES) {
      for (const claimId of source.claimIds) {
        const claim = claimsById.get(claimId);
        expect(claim, `${source.id} -> ${claimId}`).toBeDefined();
        expect(claim?.sourceIds).toContain(source.id);
      }
    }

    for (const [sceneId, claimIds] of Object.entries(
      WHISTLED_LANGUAGE_SCENE_CLAIMS,
    )) {
      for (const claimId of claimIds) {
        const claim = claimsById.get(claimId);
        expect(claim, `scene ${sceneId} -> ${claimId}`).toBeDefined();
        expect(claim?.sceneIds).toContain(Number(sceneId));
      }
    }
  });

  it("keeps EN/ZH metadata aligned to the 4-3-2-1-1 curve", () => {
    for (const language of ["en", "zh"] as const) {
      const metadata = getMetadata(language);
      expect(metadata.id).toBe("woodblock-floating-world");
      expect(metadata.band).toBe("craft-cultural");
      expect(metadata.heroScene).toBe(5);
      expect(metadata.scenes.map((scene) => scene.id)).toEqual([1, 2, 3, 4, 5]);
      expect(metadata.scenes.map((scene) => scene.beats.length)).toEqual([
        4, 3, 2, 1, 1,
      ]);
      for (const scene of metadata.scenes) {
        expect(scene.beats).toHaveLength(BEAT_COUNTS[scene.id]);
        scene.beats.forEach((beat, index) => {
          expect(beat.id).toBe(index);
          expect(beat.action.length).toBeGreaterThan(0);
          expect(beat.title.length).toBeGreaterThan(0);
          expect(beat.body.length).toBeGreaterThan(0);
        });
      }
    }
  });
});

describe("Woodblock Floating World / Whistled Language — scenes and boundaries", () => {
  it("renders every EN/ZH frame with five distinct compositions and a source stamp", () => {
    for (const language of ["en", "zh"] as const) {
      const compositions = new Set<string>();
      for (let scene = 1; scene <= 5; scene += 1) {
        for (let beat = 0; beat < BEAT_COUNTS[scene]; beat += 1) {
          const view = renderStage({ scene, beat, language, reducedMotion: true });
          const panel = view.panel();
          const sceneRoot = panel?.querySelector<HTMLElement>("[data-composition]");
          const stamp = panel?.querySelector<HTMLElement>("[data-source-stamp='true']");

          expect(panel).toHaveAttribute("data-scene-id", String(scene));
          expect(sceneRoot?.dataset.composition).toBeTruthy();
          expect(
            sceneRoot?.dataset.claimIds,
          ).toBe(WHISTLED_LANGUAGE_SCENE_CLAIMS[scene as 1 | 2 | 3 | 4 | 5].join(" "));
          expect(stamp?.dataset.sourceIds?.split(" ").length).toBeGreaterThan(0);
          expect(panel?.textContent?.trim().length).toBeGreaterThan(50);
          if (beat === BEAT_COUNTS[scene] - 1) {
            compositions.add(sceneRoot!.dataset.composition!);
          }
          view.unmount();
        }
      }
      expect(compositions.size).toBe(5);
    }
  });

  it("maps every final-frame factual node to the exact claim sources and scene stamp union", () => {
    const claimsById = new Map(
      WHISTLED_LANGUAGE_CLAIMS.map((claim) => [claim.id, claim]),
    );

    for (const language of ["en", "zh"] as const) {
      for (let scene = 1; scene <= 5; scene += 1) {
        const sceneId = scene as 1 | 2 | 3 | 4 | 5;
        const view = renderStage({
          language,
          scene,
          beat: BEAT_COUNTS[scene] - 1,
          reducedMotion: true,
        });
        const panel = view.panel();
        const claimMap = WHISTLED_LANGUAGE_COPY_CLAIMS[sceneId];
        const factualNodes = Array.from(
          panel?.querySelectorAll<HTMLElement>('[data-factual-node="true"]') ?? [],
        );
        const expectedClaimIds = [
          claimMap.eyebrow,
          claimMap.title,
          claimMap.deck,
          ...claimMap.beats.flatMap((beatClaim) => [
            beatClaim.title,
            beatClaim.body,
          ]),
          claimMap.boundary,
          ...claimMap.supplemental,
        ];

        expect(factualNodes.map((node) => node.dataset.claimId)).toEqual(
          expectedClaimIds,
        );

        const renderedSourceUnion = new Set<string>();
        for (const node of factualNodes) {
          const claimId = node.dataset.claimId;
          const claim = claimsById.get(
            claimId as (typeof WHISTLED_LANGUAGE_CLAIMS)[number]["id"],
          );
          expect(claim, `scene ${scene} factual node ${claimId}`).toBeDefined();
          expect(node.dataset.claimSource).toBe(claim?.sourceIds.join(" "));
          expect(node.textContent?.trim().length).toBeGreaterThan(0);
          for (const sourceId of node.dataset.claimSource?.split(" ") ?? []) {
            renderedSourceUnion.add(sourceId);
          }
        }

        const stamp = panel?.querySelector<HTMLElement>(
          '[data-source-stamp="true"]',
        );
        const stampSourceIds = stamp?.dataset.sourceIds?.split(" ") ?? [];
        expect(stampSourceIds.sort()).toEqual(
          Array.from(renderedSourceUnion).sort(),
        );
        if (scene === 1) {
          expect(stampSourceIds).toContain("kuskoy-linguistics");
        }
        if (scene === 2) {
          expect(stamp).toHaveTextContent("Cabildo Insular de La Gomera");
        }
        view.unmount();
      }
    }
  });

  it("states the three cases without flattening their language structure or context", () => {
    const silbo = renderStage({ scene: 2, beat: 2, reducedMotion: true });
    expect(silbo.panel()).toHaveTextContent("Spanish");
    expect(silbo.panel()).toHaveTextContent("Two vowel paths");
    expect(silbo.panel()).toHaveTextContent("four consonant paths");
    expect(silbo.panel()).toHaveTextContent("School teaching");
    silbo.unmount();

    const kus = renderStage({ scene: 3, beat: 1, reducedMotion: true });
    expect(kus.panel()).toHaveTextContent("steep mountains");
    expect(kus.panel()).toHaveTextContent("dispersed settlements");
    expect(kus.panel()).toHaveTextContent("not extraction from context");
    kus.unmount();

    const mazatec = renderStage({ scene: 4, beat: 0, reducedMotion: true });
    expect(mazatec.panel()).toHaveTextContent("Río Santiago");
    expect(mazatec.panel()).toHaveTextContent("tone carrying a wide lexical range");
    expect(mazatec.panel()).toHaveTextContent("not a claim about every Mazatec community");
    expect(mazatec.panel()).toHaveTextContent(
      /no recorded or generated voice used/i,
    );
    mazatec.unmount();

    const conclusion = renderStage({ scene: 5, beat: 0, reducedMotion: true });
    expect(conclusion.panel()).toHaveTextContent("Not a single language");
    expect(conclusion.panel()).toHaveTextContent(
      /no recorded or generated voice used/i,
    );
    conclusion.unmount();
  });

  it("uses reserved beat layouts for all multi-beat scenes", () => {
    for (const scene of [1, 2, 3]) {
      const view = renderStage({
        scene,
        beat: BEAT_COUNTS[scene] - 1,
        reducedMotion: true,
      });
      const panel = view.panel();
      const sceneRoot = panel?.querySelector<HTMLElement>("[data-composition]");

      expect(panel).toHaveAttribute("data-beat-layout-container", "true");
      expect(panel).toHaveAttribute("data-beat-layout-mode", "reserved");
      expect(sceneRoot).toHaveAttribute("data-beat-layout-container", "true");
      expect(sceneRoot).toHaveAttribute("data-beat-layout-mode", "reserved");
      expect(
        sceneRoot?.querySelectorAll('[data-beat-layout-item="true"]').length,
      ).toBeGreaterThanOrEqual(4);
      view.unmount();
    }
  });

  it("exposes intrinsic reserved copy rows for the crowded frozen terminal frames", () => {
    document.documentElement.dataset.frozen = "true";
    const cases = [
      { language: "zh" as const, scene: 1, beat: 3, rowCount: 4 },
      { language: "en" as const, scene: 2, beat: 2, rowCount: 3 },
      { language: "en" as const, scene: 5, beat: 0, rowCount: 1 },
    ];

    for (const testCase of cases) {
      const view = renderStage({
        language: testCase.language,
        scene: testCase.scene,
        beat: testCase.beat,
      });
      const layout = view.panel()?.querySelector<HTMLElement>(
        '[data-copy-layout="intrinsic-reserved-rows"]',
      );
      const rows = Array.from(
        layout?.querySelectorAll<HTMLElement>(':scope > [data-copy-row="true"]') ??
          [],
      );

      expect(layout).toHaveAttribute(
        "data-copy-row-count",
        String(testCase.rowCount),
      );
      expect(rows).toHaveLength(testCase.rowCount);
      for (const row of rows) {
        expect(row).toHaveAttribute("data-reveal", "true");
        expect(
          row.querySelector(':scope > [data-copy-role="action"]'),
        ).not.toBeNull();
        expect(
          row.querySelector(':scope > [data-copy-role="heading"]'),
        ).not.toBeNull();
        expect(
          row.querySelector(':scope > [data-copy-role="body"]'),
        ).not.toBeNull();
      }
      view.unmount();
    }
  });
});

describe("Woodblock Floating World / Whistled Language — transitions and mountain peaks", () => {
  it("renders the exact ink-spread, crossfade, diagonal-pan, ink-spread sequence", () => {
    const view = renderStage({ reducedMotion: false });
    const track = () =>
      view.container.querySelector<HTMLElement>(
        '[data-spatial-scene-track="true"]',
      );

    view.rerenderProps({ scene: 2 });
    expect(track()).toHaveAttribute("data-scene-transition-kind", "ink-spread");
    view.rerenderProps({ scene: 3 });
    expect(track()).toHaveAttribute("data-scene-transition-kind", "crossfade");
    view.rerenderProps({ scene: 4 });
    expect(track()).toHaveAttribute("data-scene-transition-kind", "diagonal-pan");
    view.rerenderProps({ scene: 5 });
    expect(track()).toHaveAttribute("data-scene-transition-kind", "ink-spread");
    expect(view.container.querySelector("[data-transition-clone='true']")).toBeNull();
    view.unmount();
  });

  it("uses click-expand mountain peaks for absolute scene jumps and next-state preview", () => {
    const onStageClick = vi.fn();
    const view = renderStage({}, onStageClick);
    const navigation = view.container.querySelector<HTMLElement>(
      '[data-topic-navigation="true"]',
    );
    const sceneThree = within(navigation!).getByRole("button", {
      name: "Jump to mountain scene 3",
    });

    expect(navigation).toHaveAttribute("data-navigation-geometry", "spatial-node");
    expect(navigation).toHaveAttribute(
      "data-navigation-carrier",
      "mountain-peak-array",
    );
    expect(navigation).toHaveAttribute("data-navigation-invocation", "click-expand");
    expect(navigation).toHaveAttribute(
      "data-navigation-feedback",
      "next-state-preview",
    );
    expect(within(navigation!).getAllByRole("button")).toHaveLength(5);

    fireEvent.pointerDown(sceneThree, { pointerId: 1 });
    fireEvent.click(sceneThree);

    expect(view.props.onNavigate).toHaveBeenCalledWith(3, 0);
    expect(navigation).toHaveAttribute("data-expanded-scene", "3");
    expect(navigation).toHaveAttribute("data-next-state-preview", "4");
    expect(onStageClick).not.toHaveBeenCalled();
    view.unmount();
  });

  it("offers keyboard-equivalent absolute jumps without leaking stage keys", () => {
    const onStageClick = vi.fn();
    const onWindowKeyDown = vi.fn();
    const view = renderStage({}, onStageClick);
    const sceneThree = view.getByRole("button", {
      name: "Jump to mountain scene 3",
    });

    window.addEventListener("keydown", onWindowKeyDown);
    try {
      fireEvent.keyDown(sceneThree, { key: "Enter" });
      fireEvent.keyDown(sceneThree, { key: " " });
      fireEvent.keyDown(sceneThree, { key: "ArrowLeft" });
      fireEvent.keyDown(sceneThree, { key: "ArrowRight" });
      fireEvent.keyDown(sceneThree, { key: "Home" });
      fireEvent.keyDown(sceneThree, { key: "End" });
      fireEvent.keyDown(sceneThree, { key: "ArrowRight", repeat: true });
    } finally {
      window.removeEventListener("keydown", onWindowKeyDown);
    }

    expect(view.props.onNavigate).toHaveBeenNthCalledWith(1, 3, 0);
    expect(view.props.onNavigate).toHaveBeenNthCalledWith(2, 3, 0);
    expect(view.props.onNavigate).toHaveBeenNthCalledWith(3, 2, 0);
    expect(view.props.onNavigate).toHaveBeenNthCalledWith(4, 4, 0);
    expect(view.props.onNavigate).toHaveBeenNthCalledWith(5, 1, 0);
    expect(view.props.onNavigate).toHaveBeenNthCalledWith(6, 5, 0);
    expect(view.props.onNavigate).toHaveBeenCalledTimes(6);
    expect(onStageClick).not.toHaveBeenCalled();
    expect(onWindowKeyDown).not.toHaveBeenCalled();
    view.unmount();
  });

  it("keeps native touches inside mountain navigation while an ordinary stage touch still advances", () => {
    const onStageNext = vi.fn();
    const onStageTouch = vi.fn();
    const onWindowTouch = vi.fn();
    const view = renderStage({}, vi.fn(), onStageNext);
    const stage = view.getByTestId("stage");
    const navigation = view.container.querySelector<HTMLElement>(
      '[data-topic-navigation="true"]',
    );
    const sceneThree = view.getByRole("button", {
      name: "Jump to mountain scene 3",
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
      for (const target of [navigation!, sceneThree]) {
        dispatchNativeTouch(target, "touchstart");
        dispatchNativeTouch(target, "touchmove", 88, 160);
        dispatchNativeTouch(target, "touchcancel", 88, 160);
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

describe("Woodblock Floating World / Whistled Language — deterministic stage-safe DOM", () => {
  it("hides navigation in thumbnails and settles reduced-motion and frozen frames", () => {
    const thumbnail = renderStage({ isThumbnail: true, scene: 3, beat: 1 });
    expect(thumbnail.root()).toHaveAttribute("data-settled", "true");
    expect(
      thumbnail.container.querySelector('[data-topic-navigation="true"]'),
    ).toBeNull();
    expect(
      thumbnail.container.querySelector('[data-spatial-scene-strip="true"]'),
    ).toHaveAttribute("data-reduced-motion", "true");
    thumbnail.unmount();

    const reduced = renderStage({ scene: 2, beat: 2, reducedMotion: true });
    expect(reduced.root()).toHaveAttribute("data-settled", "true");
    expect(
      reduced.container.querySelector('[data-spatial-scene-strip="true"]'),
    ).toHaveAttribute("data-reduced-motion", "true");
    reduced.unmount();

    document.documentElement.dataset.frozen = "true";
    const frozen = renderStage({ scene: 4, beat: 0 });
    expect(frozen.root()).toHaveAttribute("data-frozen", "true");
    expect(frozen.root()).toHaveAttribute("data-settled", "true");
    expect(
      frozen.container.querySelector('[data-spatial-scene-strip="true"]'),
    ).toHaveAttribute("data-reduced-motion", "true");
    frozen.unmount();
  });

  it("uses a clipped fixed-stage DOM with original SVG/CSS, not a fake JSDOM overflow assertion", () => {
    const view = renderStage({ scene: 5, beat: 0, reducedMotion: true });
    expect(view.root()).toHaveAttribute("data-motion-ceiling", "1");
    expect(view.root()).toHaveAttribute("data-style-id", "woodblock-floating-world");
    expect(
      view.container.querySelector('[data-spatial-scene-track="true"]'),
    ).not.toBeNull();
    expect(
      view.container.querySelectorAll('[data-spatial-scene-panel="true"]'),
    ).toHaveLength(5);
    expect(
      view.container.querySelector('[data-composition="three-waveforms"] svg'),
    ).not.toBeNull();
    view.unmount();

    expect(componentSource).not.toMatch(
      /isTransitionClone|outgoingScene|requestAnimationFrame|setInterval|<img\b|fonts\.googleapis|Great Wave|Ukiyo/i,
    );
  });
});

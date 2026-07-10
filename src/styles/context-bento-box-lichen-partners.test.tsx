import { act, fireEvent, render, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { BespokeStyleProps, TopicSource } from "../types";
import LichenPartners, {
  LICHEN_CLAIMS,
  LICHEN_SCENE_CLAIMS,
  LICHEN_SOURCES,
  LICHEN_TRANSITION_SCORE,
  getMetadata,
  lichenPartnersTopic,
} from "./context-bento-box-lichen-partners";
import componentSource from "./context-bento-box-lichen-partners.tsx?raw";
import cssSource from "./context-bento-box-lichen-partners.module.css?inline";

const BEAT_COUNTS = [4, 3, 2, 1, 1] as const;

function StageFrame({
  props,
  onStageClick,
  onStageTouch,
  onStageKey,
}: {
  props: BespokeStyleProps;
  onStageClick?: () => void;
  onStageTouch?: () => void;
  onStageKey?: () => void;
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
      onTouchStart={onStageTouch}
      onKeyDown={onStageKey}
    >
      <LichenPartners {...props} />
    </div>
  );
}

function renderStage(
  overrides: Partial<BespokeStyleProps> = {},
  handlers: {
    onStageClick?: () => void;
    onStageTouch?: () => void;
    onStageKey?: () => void;
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
  const view = render(<StageFrame props={props} {...handlers} />);
  const root = () =>
    view.container.querySelector<HTMLElement>('[data-topic-id="lichen-partners"]');
  const activePanel = () =>
    view.container.querySelector<HTMLElement>(
      '[data-spatial-scene-panel="true"][data-active="true"]',
    );

  return {
    ...view,
    props,
    root,
    activePanel,
    onNavigate: props.onNavigate as ReturnType<typeof vi.fn>,
    rerenderProps(next: Partial<BespokeStyleProps>) {
      view.rerender(<StageFrame props={{ ...props, ...next }} {...handlers} />);
    },
  };
}

describe("Lichen Partners topic contract", () => {
  it("exports the assigned ID, model, navigation profile, and transition score", () => {
    expect(lichenPartnersTopic.id).toBe("lichen-partners");
    expect(lichenPartnersTopic.topic).toEqual({
      en: "Lichen Partners",
      zh: "地衣伙伴",
    });
    expect(lichenPartnersTopic.model).toBe("GPT-5.6 Terra/Max");
    expect(lichenPartnersTopic.navigation).toEqual({
      geometry: "spatial-node",
      carrier: "lichen-compartments",
      invocation: "gesture-hold",
      feedback: "material-color-change",
    });
    expect(lichenPartnersTopic.transitionScore).toBe(LICHEN_TRANSITION_SCORE);
    expect(LICHEN_TRANSITION_SCORE).toEqual({
      "1->2": "grid-reveal",
      "2->3": "focus-swap",
      "3->4": "iris-open",
      "4->5": "grid-reveal",
    });
  });

  it("keeps bilingual metadata structurally aligned to the 4-3-2-1-1 curve", () => {
    const en = getMetadata("en");
    const zh = getMetadata("zh");

    expect(en.id).toBe("context-bento-box");
    expect(en.band).toBe("text-report");
    expect(en.scenes).toHaveLength(5);
    expect(en.scenes.map((scene) => scene.beats.length)).toEqual(BEAT_COUNTS);
    expect(zh.scenes.map((scene) => scene.beats.length)).toEqual(BEAT_COUNTS);
    expect(en.scenes.map((scene) => scene.id)).toEqual([1, 2, 3, 4, 5]);
    expect(zh.scenes.map((scene) => scene.id)).toEqual([1, 2, 3, 4, 5]);

    for (const metadata of [en, zh]) {
      metadata.scenes.forEach((scene) => {
        scene.beats.forEach((beat, index) => {
          expect(beat.id).toBe(index);
          expect(beat.action.trim()).not.toHaveLength(0);
          expect(beat.title.trim()).not.toHaveLength(0);
          expect(beat.body.trim()).not.toHaveLength(0);
        });
      });
    }
  });

  it("keeps source IDs and claim IDs reciprocal, authoritative, and parseable", () => {
    const sourceById = new Map(LICHEN_SOURCES.map((source) => [source.id, source]));
    const claimById = new Map(LICHEN_CLAIMS.map((claim) => [claim.id, claim]));

    expect(lichenPartnersTopic.sources).toBe(LICHEN_SOURCES);
    expect(LICHEN_SOURCES.length).toBeGreaterThanOrEqual(3);

    for (const source of LICHEN_SOURCES) {
      const topicSource: TopicSource = source;
      expect(topicSource.url).toMatch(/^https:\/\//);
      expect(topicSource.authority?.length).toBeGreaterThan(3);
      expect(topicSource.title?.length).toBeGreaterThan(8);
      expect(topicSource.citation?.length).toBeGreaterThan(8);
      expect(topicSource.supports.length).toBeGreaterThan(45);
      expect(source.accessDate).toBe("2026-07-10");
      for (const claimId of source.claimIds) {
        expect(claimById.get(claimId)?.sourceIds).toContain(source.id);
      }
    }

    for (const claim of LICHEN_CLAIMS) {
      expect(claim.sourceIds.length).toBeGreaterThan(0);
      for (const sourceId of claim.sourceIds) {
        expect(sourceById.get(sourceId)?.claimIds).toContain(claim.id);
      }
    }
  });
});

describe("Lichen Partners scenes", () => {
  it("renders every English and Chinese scene beat with source-stamped claims", () => {
    const claimIds = new Set(LICHEN_CLAIMS.map((claim) => claim.id));
    const sourceIds = new Set(LICHEN_SOURCES.map((source) => source.id));
    const claimById = new Map(LICHEN_CLAIMS.map((claim) => [claim.id, claim]));

    for (const language of ["en", "zh"] as const) {
      for (let scene = 1; scene <= 5; scene += 1) {
        for (let beat = 0; beat < BEAT_COUNTS[scene - 1]; beat += 1) {
          const view = renderStage({ language, scene, beat });
          const panel = view.activePanel();

          expect(panel).toHaveAttribute("data-scene-id", String(scene));
          expect(panel?.querySelector('[data-lichen-scene]')).not.toBeNull();
          expect(panel?.textContent?.trim().length).toBeGreaterThan(80);

          const sceneId = scene as keyof typeof LICHEN_SCENE_CLAIMS;
          const expectedClaimIds = LICHEN_SCENE_CLAIMS[sceneId];
          const expectedSourceIds = LICHEN_SOURCES.filter((source) =>
            expectedClaimIds.some((claimId) => source.claimIds.includes(claimId)),
          ).map((source) => source.id);
          const expectedClaimSourceLinks = expectedClaimIds
            .map(
              (claimId) =>
                `${claimId}:${claimById.get(claimId)?.sourceIds.join(",")}`,
            )
            .join(";");
          const visibleFacts = Array.from(
            panel?.querySelectorAll<HTMLElement>("[data-claim-id]") ?? [],
          );
          const visibleClaimIds = visibleFacts.map(
            (element) => element.dataset.claimId,
          );

          visibleFacts.forEach((element) => {
            expect(claimIds.has(element.dataset.claimId as never)).toBe(true);
          });

          const sceneBody = panel?.querySelector<HTMLElement>("[data-composition]");
          const stamp = panel?.querySelector<HTMLElement>(
            '[data-claim-source-map="true"]',
          );
          expect(stamp).not.toBeNull();
          expect(sceneBody).toHaveAttribute(
            "data-visible-claim-ids",
            expectedClaimIds.join(" "),
          );
          expect(stamp).toHaveAttribute("data-scene-id", String(scene));
          expect(stamp).toHaveAttribute(
            "data-claim-ids",
            expectedClaimIds.join(" "),
          );
          expect(stamp).toHaveAttribute(
            "data-source-ids",
            expectedSourceIds.join(" "),
          );
          expect(stamp).toHaveAttribute(
            "data-claim-source-links",
            expectedClaimSourceLinks,
          );
          expect(new Set(visibleClaimIds)).toEqual(new Set(expectedClaimIds));
          expect(
            Array.from(
              stamp?.querySelectorAll<HTMLElement>("[data-source-id]") ?? [],
            ).map((source) => source.dataset.sourceId),
          ).toEqual(expectedSourceIds);

          for (const claimId of expectedClaimIds) {
            const claim = claimById.get(claimId);
            expect(visibleClaimIds).toContain(claimId);
            for (const sourceId of claim?.sourceIds ?? []) {
              expect(expectedSourceIds).toContain(sourceId);
              expect(
                stamp?.querySelector(`[data-source-id="${sourceId}"]`),
              ).not.toBeNull();
            }
          }
          expectedSourceIds.forEach((sourceId) =>
            expect(sourceIds.has(sourceId)).toBe(true),
          );
          view.unmount();
        }
      }
    }
  });

  it("gives all five scenes a distinct planned composition", () => {
    const compositions = new Set<string>();
    const expected = [
      "whole-thallus",
      "asymmetric-cutaway",
      "partner-compartments",
      "research-boundary",
      "recombined-organism",
    ];

    for (let scene = 1; scene <= 5; scene += 1) {
      const view = renderStage({ scene, beat: BEAT_COUNTS[scene - 1] });
      const composition = view.activePanel()?.querySelector<HTMLElement>("[data-composition]")
        ?.dataset.composition;
      expect(composition).toBe(expected[scene - 1]);
      compositions.add(composition ?? "");
      view.unmount();
    }

    expect(compositions.size).toBe(5);
  });

  it("uses reserved beat layout containers with stable child items", () => {
    for (let scene = 1; scene <= 5; scene += 1) {
      const view = renderStage({ scene, beat: BEAT_COUNTS[scene - 1] - 1 });
      const panel = view.activePanel();
      expect(panel).toHaveAttribute("data-beat-layout-container", "true");
      expect(panel).toHaveAttribute("data-beat-layout-mode", "reserved");
      expect(
        panel?.querySelectorAll('[data-beat-layout-item="true"]').length,
      ).toBeGreaterThanOrEqual(3);
      view.unmount();
    }
  });

  it("applies the exact transition primitive on every forward edge", () => {
    const view = renderStage({ scene: 1, beat: 3 });
    const track = () => view.getByTestId("spatial-scene-track");

    view.rerenderProps({ scene: 2, beat: 0 });
    expect(track()).toHaveAttribute("data-scene-transition-kind", "grid-reveal");
    view.rerenderProps({ scene: 3, beat: 0 });
    expect(track()).toHaveAttribute("data-scene-transition-kind", "focus-swap");
    view.rerenderProps({ scene: 4, beat: 0 });
    expect(track()).toHaveAttribute("data-scene-transition-kind", "iris-open");
    view.rerenderProps({ scene: 5, beat: 0 });
    expect(track()).toHaveAttribute("data-scene-transition-kind", "grid-reveal");
    expect(view.container.querySelector('[data-transition-clone="true"]')).toBeNull();
    view.unmount();
  });
});

describe("Lichen Partners navigation", () => {
  it("keeps click and keyboard jumps absolute while isolating stage input", () => {
    const onStageClick = vi.fn();
    const onStageKey = vi.fn();
    const view = renderStage({ scene: 2 }, { onStageClick, onStageKey });
    const nav = view.root()?.querySelector<HTMLElement>('[data-topic-navigation="true"]');
    expect(nav).toHaveAttribute("data-navigation-geometry", "spatial-node");
    expect(nav).toHaveAttribute("data-navigation-carrier", "lichen-compartments");
    expect(nav).toHaveAttribute("data-navigation-invocation", "gesture-hold");
    expect(nav).toHaveAttribute("data-navigation-feedback", "material-color-change");

    const sceneFour = within(nav!).getByRole("button", { name: /scene 4/i });
    fireEvent.pointerDown(sceneFour);
    fireEvent.click(sceneFour);
    expect(view.onNavigate).toHaveBeenCalledWith(4, 0);
    expect(onStageClick).not.toHaveBeenCalled();

    const sceneTwo = within(nav!).getByRole("button", { name: /scene 2/i });
    fireEvent.keyDown(sceneTwo, { key: "End" });
    expect(view.onNavigate).toHaveBeenCalledWith(5, 0);
    fireEvent.keyDown(sceneTwo, { key: "ArrowRight" });
    expect(view.onNavigate).toHaveBeenCalledWith(3, 0);
    expect(onStageKey).not.toHaveBeenCalled();
    view.unmount();
  });

  it("supports Spacebar and suppresses repeated node keydown to one absolute jump", () => {
    const onStageKey = vi.fn();
    const onWindowKey = vi.fn();
    window.addEventListener("keydown", onWindowKey);
    const view = renderStage({ scene: 2 }, { onStageKey });
    const nav = view.root()?.querySelector<HTMLElement>('[data-topic-navigation="true"]');
    const sceneFour = within(nav!).getByRole("button", { name: /scene 4/i });

    expect(
      fireEvent.keyDown(sceneFour, { key: "Spacebar", repeat: false }),
    ).toBe(false);
    expect(
      fireEvent.keyDown(sceneFour, { key: "Spacebar", repeat: true }),
    ).toBe(false);
    expect(
      fireEvent.keyDown(sceneFour, { key: "Spacebar", repeat: true }),
    ).toBe(false);

    expect(view.onNavigate).toHaveBeenCalledTimes(1);
    expect(view.onNavigate).toHaveBeenCalledWith(4, 0);
    expect(onStageKey).not.toHaveBeenCalled();
    expect(onWindowKey).not.toHaveBeenCalled();
    window.removeEventListener("keydown", onWindowKey);
    view.unmount();
  });

  it("reveals all lichen nodes only after a real 360ms hold", () => {
    vi.useFakeTimers();
    const view = renderStage({ scene: 3 });
    const nav = view.root()?.querySelector<HTMLElement>('[data-topic-navigation="true"]');
    const hold = within(nav!).getByRole("button", { name: /hold about 360/i });

    expect(nav).toHaveAttribute("data-hold-complete", "false");
    fireEvent.pointerDown(hold, { pointerId: 7 });
    expect(nav).toHaveAttribute("data-holding", "true");
    act(() => vi.advanceTimersByTime(359));
    expect(nav).toHaveAttribute("data-hold-complete", "false");
    act(() => vi.advanceTimersByTime(1));
    expect(nav).toHaveAttribute("data-hold-complete", "true");
    expect(within(nav!).getByRole("button", { name: /scene 5/i })).toHaveTextContent("Recombine");

    fireEvent.pointerUp(hold, { pointerId: 7 });
    expect(nav).toHaveAttribute("data-holding", "false");
    expect(nav).toHaveAttribute("data-hold-complete", "false");
    view.unmount();
    vi.useRealTimers();
  });

  it("keeps a Spacebar keyboard hold on its original 360ms deadline and jumps once", () => {
    vi.useFakeTimers();
    const view = renderStage({ scene: 1 });
    const nav = view.root()?.querySelector<HTMLElement>('[data-topic-navigation="true"]');
    const hold = within(nav!).getByRole("button", { name: /hold about 360/i });

    fireEvent.keyDown(hold, { key: "Spacebar", repeat: false });
    act(() => vi.advanceTimersByTime(180));
    expect(nav).toHaveAttribute("data-hold-complete", "false");

    expect(
      fireEvent.keyDown(hold, { key: "Spacebar", repeat: true }),
    ).toBe(false);
    act(() => vi.advanceTimersByTime(179));
    expect(nav).toHaveAttribute("data-hold-complete", "false");
    act(() => vi.advanceTimersByTime(1));
    expect(nav).toHaveAttribute("data-hold-complete", "true");

    const sceneFive = within(nav!).getByRole("button", { name: /scene 5/i });
    fireEvent.keyDown(sceneFive, { key: "Spacebar", repeat: false });
    fireEvent.keyDown(sceneFive, { key: "Spacebar", repeat: true });
    expect(view.onNavigate).toHaveBeenCalledTimes(1);
    expect(view.onNavigate).toHaveBeenCalledWith(5, 0);

    fireEvent.keyUp(hold, { key: "Spacebar" });
    expect(nav).toHaveAttribute("data-hold-complete", "false");
    view.unmount();
    vi.useRealTimers();
  });

  it("isolates native touchstart, move, end, and cancel from stage and window", () => {
    const onStageClick = vi.fn();
    const view = renderStage({ scene: 1 }, { onStageClick });
    const nav = view.root()?.querySelector<HTMLElement>('[data-topic-navigation="true"]');
    const node = within(nav!).getByRole("button", { name: /scene 3/i });
    const stage = view.getByTestId("stage");
    const touchEvents = [
      "touchstart",
      "touchmove",
      "touchend",
      "touchcancel",
    ] as const;

    for (const eventName of touchEvents) {
      const onStageTouch = vi.fn();
      const onWindowTouch = vi.fn();
      stage.addEventListener(eventName, onStageTouch);
      window.addEventListener(eventName, onWindowTouch);

      if (eventName === "touchstart") fireEvent.touchStart(nav!);
      if (eventName === "touchmove") fireEvent.touchMove(nav!);
      if (eventName === "touchend") fireEvent.touchEnd(nav!);
      if (eventName === "touchcancel") fireEvent.touchCancel(nav!);

      expect(onStageTouch).not.toHaveBeenCalled();
      expect(onWindowTouch).not.toHaveBeenCalled();
      stage.removeEventListener(eventName, onStageTouch);
      window.removeEventListener(eventName, onWindowTouch);
    }

    fireEvent.click(node);
    expect(view.onNavigate).toHaveBeenCalledWith(3, 0);
    expect(onStageClick).not.toHaveBeenCalled();
    view.unmount();
  });

  it("hides navigation in thumbnails and stabilizes thumbnail and reduced-motion frames", () => {
    const thumbnail = renderStage({
      scene: 3,
      beat: 1,
      isThumbnail: true,
      reducedMotion: false,
      onNavigate: undefined,
    });
    expect(thumbnail.root()).toHaveAttribute("data-motion", "off");
    expect(thumbnail.root()).toHaveAttribute("data-frozen", "true");
    expect(thumbnail.root()?.querySelector('[data-topic-navigation="true"]')).toBeNull();
    expect(thumbnail.getByTestId("spatial-scene-strip")).toHaveAttribute(
      "data-reduced-motion",
      "true",
    );
    thumbnail.unmount();

    const reduced = renderStage({ scene: 2, beat: 2, reducedMotion: true });
    expect(reduced.root()).toHaveAttribute("data-motion", "off");
    expect(reduced.root()).toHaveAttribute("data-frozen", "true");
    expect(reduced.root()?.querySelector('[data-topic-navigation="true"]')).not.toBeNull();
    expect(reduced.getByTestId("spatial-scene-strip")).toHaveAttribute(
      "data-reduced-motion",
      "true",
    );
    reduced.unmount();
  });
});

describe("Lichen Partners stage-safe contract", () => {
  it("keeps visual content in one clipped 1920×1080 stage contract without faux JSDOM overflow checks", () => {
    const view = renderStage({ scene: 5, beat: 0, language: "zh" });
    const root = view.root();
    const track = view.getByTestId("spatial-scene-track");

    expect(root).toHaveAttribute("data-stage-safe", "1920x1080");
    expect(root?.querySelector('[data-stage-clip="true"]')).not.toBeNull();
    expect(track).toHaveStyle({ overflow: "hidden" });
    expect(view.activePanel()?.querySelector('[data-composition="recombined-organism"]')).not.toBeNull();
    expect(view.container.querySelector('[data-transition-clone="true"]')).toBeNull();
    view.unmount();
  });

  it("uses original DOM and SVG with no remote asset, forbidden stage units, or universal roster claim", () => {
    const forbiddenStageUnit = /(?:^|[^a-z-])\d*\.?\d+(?:px|vw|vh|rem|em)\b/i;

    expect(componentSource).not.toMatch(/<img\b|<image\b/i);
    expect(componentSource).not.toMatch(/isTransitionClone|outgoingScene|setInterval|requestAnimationFrame/);
    expect(componentSource).not.toMatch(forbiddenStageUnit);
    expect(cssSource).not.toMatch(forbiddenStageUnit);
    expect(cssSource).not.toMatch(/\binfinite\b/i);
    expect(componentSource).not.toMatch(/(?:^|[".])Every lichen (has|contains)/);
    expect(componentSource).toMatch(/Some study systems/i);
  });
});

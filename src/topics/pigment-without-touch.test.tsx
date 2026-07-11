import { fireEvent, render, within } from "@testing-library/react";
// @ts-expect-error -- Vitest executes this focused test in Node; app types omit Node built-ins.
import { readFileSync } from "node:fs";
import { describe, expect, it, vi } from "vitest";
import type { Source } from "../domain/evidence";
import type { TopicStageProps } from "../domain/topic";
import { runTopicContract } from "../testing/topic-contract";
import topic, {
  PIGMENT_WITHOUT_TOUCH_CLAIMS,
  PIGMENT_WITHOUT_TOUCH_SCENE_CLAIMS,
  PIGMENT_WITHOUT_TOUCH_SOURCES,
  PIGMENT_WITHOUT_TOUCH_TRANSITION_SCORE,
} from "./pigment-without-touch";
import componentSource from "./pigment-without-touch.tsx?raw";

runTopicContract(topic);

const cssSource = readFileSync(
  "src/topics/pigment-without-touch.module.css",
  "utf8",
) as string;

const BEAT_COUNTS: Record<number, number> = {
  1: 2,
  2: 4,
  3: 1,
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

function StageFrame({
  props,
  onStageClick,
  onStageKeyDown,
}: {
  props: TopicStageProps;
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
      <topic.Stage {...props} />
    </div>
  );
}

function renderStage(
  overrides: Partial<TopicStageProps> = {},
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
  const root = () =>
    result.container.querySelector<HTMLElement>(
      '[data-topic-id="pigment-without-touch"]',
    );
  const activePanel = () =>
    result.container.querySelector<HTMLElement>(
      '[data-spatial-scene-panel="true"][data-active="true"]',
    );

  return {
    ...result,
    props,
    root,
    activePanel,
    rerenderProps(next: Partial<TopicStageProps>) {
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

function cssRules() {
  return Array.from(cssSource.matchAll(/([^{}]+)\{([^{}]*)\}/g), (match) => ({
    selector: match[1].trim(),
    body: match[2],
  }));
}

function cssRuleContaining(label: string, ...declarations: RegExp[]) {
  const matches = cssRules().filter(({ body }) =>
    declarations.every((declaration) => declaration.test(body)),
  );

  if (matches.length !== 1) {
    throw new Error(
      `Expected one CSS rule for ${label}, found ${matches.length}`,
    );
  }

  return matches[0];
}

const VISIBLE_CLAIM_FIELDS = ["heading", "visual", "beat", "boundary"] as const;

function sceneClaimsFor(scene: number) {
  return PIGMENT_WITHOUT_TOUCH_SCENE_CLAIMS[
    scene as keyof typeof PIGMENT_WITHOUT_TOUCH_SCENE_CLAIMS
  ];
}

function isProgressiveEvidence(scene: number) {
  const sceneClaims = sceneClaimsFor(scene);
  return (
    "progressiveEvidence" in sceneClaims &&
    sceneClaims.progressiveEvidence === true
  );
}

function sourceIdsFor(claimIds: readonly string[]) {
  const requiredSourceIds = new Set<string>();

  for (const claimId of claimIds) {
    for (const sourceId of PIGMENT_WITHOUT_TOUCH_CLAIMS[
      claimId as keyof typeof PIGMENT_WITHOUT_TOUCH_CLAIMS
    ].sourceIds) {
      requiredSourceIds.add(sourceId);
    }
  }

  return PIGMENT_WITHOUT_TOUCH_SOURCES.filter((source) =>
    requiredSourceIds.has(source.id),
  ).map((source) => source.id);
}

function visibleClaimIdsFor(scene: number, beat: number) {
  const sceneClaims = sceneClaimsFor(scene);
  const evidence = isProgressiveEvidence(scene)
    ? sceneClaims.evidence.slice(0, beat + 1)
    : sceneClaims.evidence;

  return [
    ...new Set([
      ...sceneClaims.heading,
      ...sceneClaims.visual,
      ...(sceneClaims.beats[beat] ?? sceneClaims.beats[0]),
      ...(sceneClaims.boundaries[beat] ?? sceneClaims.boundaries[0]),
      ...evidence.flat(),
    ]),
  ];
}

function claimIdsFrom(element: HTMLElement | null | undefined) {
  return element?.dataset.claimIds?.split(" ").filter(Boolean) ?? [];
}

describe("Pigment Without Touch — topic contract", () => {
  it("exports the planned topic, swatch-rail navigation, facts packet, and score", () => {
    expect(topic.id).toBe("pigment-without-touch");
    expect(topic.title).toEqual({
      en: "Pigment Without Touch",
      zh: "无损识色",
    });
    expect(topic.navigation).toEqual({
      geometry: "edge-scale",
      carrier: "pigment-swatch-rail",
      invocation: "gesture-hold",
      feedback: "active-glow",
    });
    expect(topic.evidence).toEqual({
      kind: "facts",
      sources: PIGMENT_WITHOUT_TOUCH_SOURCES,
    });
    expect(topic.transitionScore).toBe(
      PIGMENT_WITHOUT_TOUCH_TRANSITION_SCORE,
    );
    expect(PIGMENT_WITHOUT_TOUCH_TRANSITION_SCORE).toEqual({
      "1->2": "crossfade",
      "2->3": "hard-cut",
      "3->4": "linear-wipe",
      "4->5": "crossfade",
    });
  });

  it("ships five authoritative, stable, claim-scoped HTTPS sources", () => {
    expect(PIGMENT_WITHOUT_TOUCH_SOURCES).toHaveLength(5);
    expect(PIGMENT_WITHOUT_TOUCH_SOURCES.map((source) => source.id)).toEqual([
      "mauritshuis-girl-in-the-spotlight",
      "mauritshuis-examination-methods",
      "delaney-2020-pigment-distribution",
      "van-loon-2019-skin-tones",
      "elkhuizen-2019-3d-scanning",
    ]);
    for (const source of PIGMENT_WITHOUT_TOUCH_SOURCES) {
      const traceable: Source = source;
      expect(source.id).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
      expect(source.stamp).toMatch(/^[A-Z0-9/-]+$/);
      expect(source.claimIds.length).toBeGreaterThan(0);
      expect(new Set(source.claimIds).size).toBe(source.claimIds.length);
      expect(traceable.authority?.length).toBeGreaterThan(2);
      expect(traceable.title?.length).toBeGreaterThan(5);
      expect(traceable.citation?.length).toBeGreaterThan(12);
      expect(traceable.url).toMatch(/^https:\/\//);
      expect(traceable.supports.length).toBeGreaterThan(50);
    }
  });

  it("closes each pigment source and claim in both directions", () => {
    const sourcesById = new Map(
      PIGMENT_WITHOUT_TOUCH_SOURCES.map((source) => [source.id, source]),
    );

    expect(sourcesById.size).toBe(PIGMENT_WITHOUT_TOUCH_SOURCES.length);
    expect(Object.keys(PIGMENT_WITHOUT_TOUCH_CLAIMS)).toHaveLength(15);

    for (const source of PIGMENT_WITHOUT_TOUCH_SOURCES) {
      for (const claimId of source.claimIds) {
        const claim = PIGMENT_WITHOUT_TOUCH_CLAIMS[claimId];
        expect(claim, `${source.id} -> ${claimId}`).toBeDefined();
        expect(claim.sourceIds).toContain(source.id);
      }
    }

    for (const [claimId, claim] of Object.entries(
      PIGMENT_WITHOUT_TOUCH_CLAIMS,
    )) {
      expect(claim.id).toBe(claimId);
      expect(claim.statement.trim().length).toBeGreaterThan(40);
      expect(claim.sourceIds.length).toBeGreaterThan(0);
      for (const sourceId of claim.sourceIds) {
        const source = sourcesById.get(sourceId);
        expect(source, `${claimId} -> ${sourceId}`).toBeDefined();
        expect(source?.claimIds).toContain(claim.id);
      }
    }

    expect(PIGMENT_WITHOUT_TOUCH_CLAIMS["element-map-not-pigment-label"].sourceIds).toEqual([
      "mauritshuis-examination-methods",
      "delaney-2020-pigment-distribution",
    ]);
    expect(PIGMENT_WITHOUT_TOUCH_CLAIMS["ris-fis-fors-complementarity"].sourceIds).toEqual([
      "delaney-2020-pigment-distribution",
    ]);
    expect(PIGMENT_WITHOUT_TOUCH_CLAIMS["red-lake-ris-nondetection"].sourceIds).toEqual([
      "delaney-2020-pigment-distribution",
    ]);
    expect(PIGMENT_WITHOUT_TOUCH_CLAIMS["red-lake-fors-fis-evidence"].sourceIds).toEqual([
      "delaney-2020-pigment-distribution",
    ]);
    expect(PIGMENT_WITHOUT_TOUCH_CLAIMS["potassium-ambiguity"].sourceIds).toEqual([
      "delaney-2020-pigment-distribution",
    ]);
    expect(PIGMENT_WITHOUT_TOUCH_CLAIMS["red-lake-bounded-support"].sourceIds).toEqual([
      "delaney-2020-pigment-distribution",
    ]);
  });

  it("keeps five bilingual scenes aligned to the 2-4-1-3-1 curve", () => {
    const english = topic.metadata.en;
    const chinese = topic.metadata.zh;

    expect(topic.styleId).toBe("checklist-ledger");
    expect(topic.title).toEqual({ en: "Pigment Without Touch", zh: "无损识色" });
    expect(english.heroScene).toBe(4);
    expect(english.scenes.map((scene) => scene.beats.length)).toEqual([
      2, 4, 1, 3, 1,
    ]);
    expect(chinese.scenes.map((scene) => scene.beats.length)).toEqual([
      2, 4, 1, 3, 1,
    ]);

    for (const metadata of [english, chinese]) {
      expect(metadata.scenes.map((scene) => scene.id)).toEqual([1, 2, 3, 4, 5]);
      for (const scene of metadata.scenes) {
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

describe("Pigment Without Touch — evidence states", () => {
  it("maps every rendered fact field, evidence row, visible claim, and source stamp", () => {
    for (const language of ["en", "zh"] as const) {
      for (let scene = 1; scene <= 5; scene += 1) {
        const sceneClaims = sceneClaimsFor(scene);
        expect(sceneClaims.beats).toHaveLength(BEAT_COUNTS[scene]);
        expect(sceneClaims.boundaries).toHaveLength(BEAT_COUNTS[scene]);

        for (let beat = 0; beat < BEAT_COUNTS[scene]; beat += 1) {
          const expectedVisibleClaimIds = visibleClaimIdsFor(scene, beat);
          const expectedSourceIds = sourceIdsFor(expectedVisibleClaimIds);
          const view = renderStage({ language, scene, beat });
          const sceneContent = view.activePanel()?.querySelector<HTMLElement>(
            `[data-scene-content="${scene}"]`,
          );
          const factFields = Array.from(
            sceneContent?.querySelectorAll<HTMLElement>("[data-claim-field]") ?? [],
          );
          const nonEvidenceFields = factFields.filter(
            (field) => field.dataset.claimField !== "evidence",
          );

          expect(nonEvidenceFields.map((field) => field.dataset.claimField)).toEqual(
            VISIBLE_CLAIM_FIELDS,
          );

          const expectedClaimsByField = {
            heading: sceneClaims.heading,
            visual: sceneClaims.visual,
            beat: sceneClaims.beats[beat],
            boundary: sceneClaims.boundaries[beat],
          } as const;

          for (const fieldName of VISIBLE_CLAIM_FIELDS) {
            const field = nonEvidenceFields.find(
              (candidate) => candidate.dataset.claimField === fieldName,
            );
            const expectedClaimIds = expectedClaimsByField[fieldName];

            expect(claimIdsFrom(field)).toEqual([...expectedClaimIds]);
            expect(field).toHaveAttribute(
              "data-source-ids",
              sourceIdsFor(expectedClaimIds).join(" "),
            );
          }

          const evidenceRows = Array.from(
            sceneContent?.querySelectorAll<HTMLElement>("[data-evidence-id]") ?? [],
          );
          expect(evidenceRows).toHaveLength(sceneClaims.evidence.length);
          evidenceRows.forEach((row, index) => {
            const expectedClaimIds = sceneClaims.evidence[index];
            const expectedVisible =
              !isProgressiveEvidence(scene) || index <= beat;

            expect(row.dataset.claimField).toBe("evidence");
            expect(claimIdsFrom(row)).toEqual([...expectedClaimIds]);
            expect(row).toHaveAttribute(
              "data-source-ids",
              sourceIdsFor(expectedClaimIds).join(" "),
            );
            expect(row).toHaveAttribute(
              "data-evidence-visible",
              expectedVisible ? "true" : "false",
            );
          });

          expect(sceneContent).toHaveAttribute(
            "data-visible-claim-ids",
            expectedVisibleClaimIds.join(" "),
          );
          expect(sceneContent).toHaveAttribute(
            "data-source-ids",
            expectedSourceIds.join(" "),
          );

          const sourceStamp = sceneContent?.querySelector<HTMLElement>(
            '[data-source-stamp="true"]',
          );
          const expectedSourceRefs = expectedSourceIds
            .map(
              (sourceId) =>
                PIGMENT_WITHOUT_TOUCH_SOURCES.find(
                  (source) => source.id === sourceId,
                )?.stamp,
            )
            .join(" · ");

          expect(sourceStamp).toHaveAttribute(
            "data-source-ids",
            expectedSourceIds.join(" "),
          );
          expect(sourceStamp).toHaveAttribute(
            "data-source-refs",
            expectedSourceRefs,
          );
          expect(sourceStamp).toHaveTextContent(
            language === "zh" ? "来源" : "SOURCES",
          );
          view.unmount();
        }
      }
    }
  });

  it("replaces red-lake free-text citations with stable source refs", () => {
    const view = renderStage({ scene: 4, beat: 2, language: "en" });
    const sourceRefs = Array.from(
      view.activePanel()?.querySelectorAll<HTMLElement>(
        '[data-source-ref="true"]',
      ) ?? [],
    );

    expect(sourceRefs).toHaveLength(3);
    for (const sourceRef of sourceRefs) {
      expect(sourceRef).toHaveAttribute(
        "data-source-ids",
        "delaney-2020-pigment-distribution",
      );
      expect(sourceRef).toHaveTextContent("HS/PIGMENT-2020");
      expect(sourceRef.textContent).not.toMatch(
        /Delaney et al\.|Fig\. 2|matrix-effects note|Flesh tones/i,
      );
    }
  });

  it("renders every English and Chinese beat with reserved multi-beat geometry", () => {
    for (const language of ["en", "zh"] as const) {
      for (let scene = 1; scene <= 5; scene += 1) {
        for (let beat = 0; beat < BEAT_COUNTS[scene]; beat += 1) {
          const view = renderStage({ language, scene, beat });
          const panel = view.activePanel();

          expect(view.root()).not.toBeNull();
          expect(panel).toHaveAttribute("data-scene-id", String(scene));
          if (BEAT_COUNTS[scene] > 1) {
            expect(panel).toHaveAttribute("data-beat-layout-mode", "reserved");
          }
          expect(panel?.textContent?.trim().length).toBeGreaterThan(35);
          expect(
            panel?.querySelectorAll('[data-beat-layout-item="true"]').length,
          ).toBeGreaterThanOrEqual(3);
          view.unmount();
        }
      }
    }
  });

  it("opens with a coordinate frame and an explicit no-new-sampling boundary", () => {
    const view = renderStage({ scene: 1, beat: 1 });
    const overview = view.activePanel()?.querySelector<HTMLElement>(
      '[data-painting-overview="original-schematic"]',
    );

    expect(overview).not.toBeNull();
    expect(overview).toHaveAttribute("data-coordinate-system", "registered");
    expect(view.activePanel()).toHaveTextContent("NO NEW SAMPLING");
    expect(view.activePanel()).toHaveTextContent("archived micro-samples");
    expect(view.activePanel()?.querySelector("img")).toBeNull();
  });

  it("registers four methods by what they measure and what they cannot decide", () => {
    const methodIds = ["ma-xrf", "ris-fis", "xray-nir", "oct-3d"];

    methodIds.forEach((methodId, beat) => {
      const view = renderStage({ scene: 2, beat });
      const selected = view.activePanel()?.querySelector<HTMLElement>(
        '[data-method-selected="true"]',
      );

      expect(selected).toHaveAttribute("data-method-id", methodId);
      expect(
        view.activePanel()?.querySelectorAll('[data-method-selected="true"]'),
      ).toHaveLength(1);
      expect(selected).toHaveTextContent(/measures/i);
      expect(selected).toHaveTextContent(/cannot decide/i);
      view.unmount();
    });
  });

  it("keeps the element map static and refuses to rename mercury as a pigment", () => {
    const view = renderStage({ scene: 3, beat: 0 });
    const map = view.activePanel()?.querySelector<HTMLElement>(
      '[data-element-map="mercury"]',
    );

    expect(map).not.toBeNull();
    expect(map).toHaveAttribute("data-element-not-pigment", "true");
    expect(map).toHaveAttribute("data-map-motion", "static");
    expect(view.activePanel()).toHaveTextContent("Hg signal ≠ vermilion by itself");
    expect(view.activePanel()?.querySelector('[data-pigment-map="true"]')).toBeNull();
  });

  it("preserves the red-lake conflict before resolving a bounded inference", () => {
    const early = renderStage({ scene: 4, beat: 0 });
    expect(early.activePanel()).toHaveTextContent("No direct red-lake signal");
    expect(early.activePanel()).toHaveTextContent("not absence");
    early.unmount();

    const combined = renderStage({ scene: 4, beat: 2 });
    const inference = combined.activePanel()?.querySelector<HTMLElement>(
      '[data-inference-state="bounded-support"]',
    );

    expect(inference).not.toBeNull();
    expect(combined.activePanel()).toHaveTextContent("weak absorption bands");
    expect(combined.activePanel()).toHaveTextContent("Potassium remains ambiguous");
    expect(combined.activePanel()).toHaveTextContent("Lips + cheek");
  });

  it("ends at beat zero with conclusions, confidence limits, unknowns, and provenance", () => {
    const metadata = topic.metadata.en;
    const view = renderStage({ scene: 5, beat: 0 });

    expect(metadata.scenes[4].beats).toHaveLength(1);
    expect(view.activePanel()).toHaveTextContent("CONSERVATION RECORD");
    expect(view.activePanel()).toHaveTextContent("UNRESOLVED");
    expect(view.activePanel()).toHaveTextContent("Original vector schematic");
    expect(view.activePanel()).toHaveTextContent("No artwork image reproduced");
  });

  it("applies the exact four-edge score without a clone lifecycle", () => {
    const view = renderStage({ scene: 1 });
    const track = () =>
      view.container.querySelector<HTMLElement>(
        '[data-spatial-scene-track="true"]',
      );

    view.rerenderProps({ scene: 2 });
    expect(track()).toHaveAttribute("data-scene-transition-kind", "crossfade");
    view.rerenderProps({ scene: 3 });
    expect(track()).toHaveAttribute("data-scene-transition-kind", "hard-cut");
    view.rerenderProps({ scene: 4 });
    expect(track()).toHaveAttribute("data-scene-transition-kind", "linear-wipe");
    view.rerenderProps({ scene: 5 });
    expect(track()).toHaveAttribute("data-scene-transition-kind", "crossfade");
    expect(view.container.querySelector('[data-transition-clone="true"]')).toBeNull();
  });
});

describe("Pigment Without Touch — pigment swatch rail", () => {
  it("renders the planned edge scale and five accessible swatches", () => {
    const view = renderStage({ scene: 3 });
    const nav = view.root()?.querySelector<HTMLElement>(
      '[data-topic-navigation="true"]',
    );

    expect(nav).toHaveAttribute("data-navigation-geometry", "edge-scale");
    expect(nav).toHaveAttribute(
      "data-navigation-carrier",
      "pigment-swatch-rail",
    );
    expect(nav).toHaveAttribute("data-navigation-invocation", "gesture-hold");
    expect(nav).toHaveAttribute("data-navigation-feedback", "active-glow");
    expect(within(nav!).getAllByRole("button")).toHaveLength(6);
    expect(within(nav!).getByRole("button", { name: /scene 3/i })).toHaveAttribute(
      "aria-current",
      "step",
    );
  });

  it("supports click and Space while suppressing repeat and stage leakage", () => {
    const onNavigate = vi.fn();
    const onStageClick = vi.fn();
    const onStageKeyDown = vi.fn();
    const onWindowKey = vi.fn();
    window.addEventListener("keydown", onWindowKey);
    const view = renderStage(
      { scene: 2, onNavigate },
      onStageClick,
      onStageKeyDown,
    );
    const nav = view.root()?.querySelector<HTMLElement>(
      '[data-topic-navigation="true"]',
    );
    const scene4 = within(nav!).getByRole("button", { name: /scene 4/i });

    fireEvent.pointerDown(scene4);
    fireEvent.click(scene4);
    expect(onNavigate).toHaveBeenLastCalledWith(4, 0);
    expect(onStageClick).not.toHaveBeenCalled();

    const scene3 = within(nav!).getByRole("button", { name: /scene 3/i });
    fireEvent.keyDown(scene3, { key: " ", repeat: false });
    expect(onNavigate).toHaveBeenLastCalledWith(3, 0);
    const callCount = onNavigate.mock.calls.length;
    fireEvent.keyDown(scene3, { key: " ", repeat: true });
    expect(onNavigate).toHaveBeenCalledTimes(callCount);
    expect(onStageKeyDown).not.toHaveBeenCalled();
    expect(onWindowKey).not.toHaveBeenCalled();
    window.removeEventListener("keydown", onWindowKey);
  });

  it("reveals only the track detail while held by pointer or keyboard", () => {
    const view = renderStage({ scene: 2 });
    const nav = view.root()?.querySelector<HTMLElement>(
      '[data-topic-navigation="true"]',
    );
    const hold = within(nav!).getByRole("button", { name: /hold/i });

    fireEvent.pointerDown(hold);
    expect(nav).toHaveAttribute("data-holding", "true");
    fireEvent.pointerUp(hold);
    expect(nav).toHaveAttribute("data-holding", "false");

    fireEvent.keyDown(hold, { key: " ", repeat: false });
    expect(nav).toHaveAttribute("data-holding", "true");
    fireEvent.keyUp(hold, { key: " " });
    expect(nav).toHaveAttribute("data-holding", "false");
  });

  it("hides the rail in thumbnails and settles thumbnail/reduced frames", () => {
    const thumbnail = renderStage({
      scene: 4,
      beat: 2,
      isThumbnail: true,
      onNavigate: undefined,
    });

    expect(
      thumbnail.root()?.querySelector('[data-topic-navigation="true"]'),
    ).toBeNull();
    expect(thumbnail.root()).toHaveAttribute("data-motion", "off");
    expect(
      thumbnail.container.querySelector('[data-spatial-scene-strip="true"]'),
    ).toHaveAttribute("data-reduced-motion", "true");
    expect(
      thumbnail.activePanel()?.querySelector(
        '[data-inference-state="bounded-support"]',
      ),
    ).not.toBeNull();

    const reduced = renderStage({ scene: 2, beat: 3, reducedMotion: true });
    expect(reduced.root()).toHaveAttribute("data-motion", "off");
    expect(
      reduced.activePanel()?.querySelector('[data-method-id="oct-3d"]'),
    ).toHaveAttribute("data-method-selected", "true");
  });
});

describe("Pigment Without Touch — stage and asset safety", () => {
  it("uses no decorative loops, remote assets, or clone hooks", () => {
    expect(componentSource).not.toMatch(/setInterval|requestAnimationFrame/);
    expect(componentSource).not.toMatch(/isTransitionClone|outgoingScene/);
    expect(componentSource).not.toMatch(/<img|<image|url\(https?:|src=["']https?:/i);
    expect(cssSource).not.toMatch(/animation-iteration-count\s*:\s*infinite/i);
    expect(cssSource).not.toMatch(/\binfinite\b/i);
    expect(cssSource).not.toMatch(/url\(https?:/i);
  });

  it("renders stable stage-local root, track, scene, and beat contracts", () => {
    for (const language of ["en", "zh"] as const) {
      for (let scene = 1; scene <= 5; scene += 1) {
        const finalBeat = BEAT_COUNTS[scene] - 1;
        const view = renderStage({ language, scene, beat: finalBeat });
        const stage = view.getByTestId("stage");
        const root = view.root();
        const track = root?.querySelector<HTMLElement>(
          '[data-spatial-scene-track="true"]',
        );
        const panel = view.activePanel();
        const sceneContent = panel?.querySelector<HTMLElement>(
          `[data-scene-content="${scene}"]`,
        );

        expect(root?.parentElement).toBe(stage);
        expect(root).toHaveAttribute("data-topic-id", "pigment-without-touch");
        expect(root).toHaveAttribute(
          "data-transition-score",
          "crossfade|hard-cut|linear-wipe|crossfade",
        );
        expect(track).toHaveAttribute("data-active-scene", String(scene));
        expect(panel).toHaveAttribute("data-scene-id", String(scene));
        expect(panel).toHaveAttribute("data-active", "true");
        expect(panel).toHaveAttribute("data-beat-layout-container", "true");
        expect(panel).toHaveAttribute("data-beat-layout-mode", "reserved");
        expect(sceneContent).toHaveAttribute("data-scene-content", String(scene));
        expect(sceneContent).toHaveAttribute("data-beat", String(finalBeat));
        expect(root?.querySelector('[data-transition-clone="true"]')).toBeNull();
        view.unmount();
      }
    }
  });

  it("enforces stage clipping and container-query units in authored CSS", () => {
    const forbiddenStageUnit = /(?:^|[^a-z-])\d*\.?\d+(?:px|vw|vh|rem|em)\b/i;
    const rootRule = cssRuleContaining(
      "topic root",
      /--style-checklist-ledger-bg:/,
      /container-type:\s*size/,
    ).body;
    const sceneRule = cssRuleContaining(
      "scene shell",
      /grid-template-rows:\s*5\.5cqh 15cqh/,
      /padding:\s*4\.5cqh 12\.2cqw/,
    ).body;
    const sceneBodyRule = cssRuleContaining(
      "scene body",
      /min-width:\s*0/,
      /min-height:\s*0/,
      /overflow:\s*hidden/,
    ).body;

    expect(componentSource).not.toMatch(forbiddenStageUnit);
    expect(cssSource).not.toMatch(forbiddenStageUnit);
    expect(cssSource).toMatch(/\d+(?:\.\d+)?cqw\b/);
    expect(cssSource).toMatch(/\d+(?:\.\d+)?cqh\b/);
    expect(rootRule).toMatch(/position:\s*relative/);
    expect(rootRule).toMatch(/width:\s*100%/);
    expect(rootRule).toMatch(/height:\s*100%/);
    expect(rootRule).toMatch(/overflow:\s*hidden/);
    expect(rootRule).toMatch(/container-type:\s*size/);
    expect(sceneRule).toMatch(/position:\s*absolute/);
    expect(sceneRule).toMatch(/inset:\s*0/);
    expect(sceneRule).toMatch(/overflow:\s*hidden/);
    expect(sceneBodyRule).toMatch(/min-width:\s*0/);
    expect(sceneBodyRule).toMatch(/min-height:\s*0/);
    expect(sceneBodyRule).toMatch(/overflow:\s*hidden/);
    expect(
      cssRules().some(
        ({ selector, body }) =>
          selector.includes(",") &&
          /position:\s*absolute/.test(body) &&
          /inset:\s*0/.test(body),
      ),
      "the stage-local track wrapper must remain absolutely inset",
    ).toBe(true);
  });

  it("keeps the longest source authority and source stamp visible in English and Chinese", () => {
    const longestAuthority = [...PIGMENT_WITHOUT_TOUCH_SOURCES]
      .map((source) => source.authority ?? "")
      .sort((left, right) => right.length - left.length)[0];
    const provenanceRule = cssRuleContaining(
      "source authority",
      /font-size:\s*0\.61cqw/,
      /overflow-wrap:\s*anywhere/,
    ).body;
    const sourceStampRule = cssRuleContaining(
      "scene source stamp",
      /font-size:\s*0\.56cqw/,
      /overflow-wrap:\s*anywhere/,
    ).body;
    const longestStampFrame = Array.from({ length: 5 }, (_, sceneOffset) => {
      const scene = sceneOffset + 1;
      return Array.from({ length: BEAT_COUNTS[scene] }, (_, beat) => {
        const sourceIds = sourceIdsFor(visibleClaimIdsFor(scene, beat));
        const sourceRefs = sourceIds
          .map(
            (sourceId) =>
              PIGMENT_WITHOUT_TOUCH_SOURCES.find(
                (source) => source.id === sourceId,
              )?.stamp,
          )
          .join(" · ");

        return { scene, beat, sourceRefs };
      });
    })
      .flat()
      .sort((left, right) => right.sourceRefs.length - left.sourceRefs.length)[0];

    expect(longestAuthority.length).toBeGreaterThan(50);
    expect(provenanceRule).toMatch(/min-width:\s*0/);
    expect(provenanceRule).toMatch(/overflow-wrap:\s*anywhere/);
    expect(provenanceRule).not.toMatch(/white-space:\s*nowrap/);
    expect(sourceStampRule).toMatch(/display:\s*block/);
    expect(sourceStampRule).toMatch(/min-width:\s*0/);
    expect(sourceStampRule).toMatch(/overflow-wrap:\s*anywhere/);
    expect(sourceStampRule).not.toMatch(/white-space:\s*nowrap/);

    const authorityView = renderStage({ scene: 5, beat: 0, language: "en" });
    expect(authorityView.activePanel()).toHaveTextContent(longestAuthority);
    authorityView.unmount();

    for (const language of ["en", "zh"] as const) {
      const view = renderStage({
        scene: longestStampFrame.scene,
        beat: longestStampFrame.beat,
        language,
      });
      const sourceStamp = view.activePanel()?.querySelector<HTMLElement>(
        '[data-source-stamp="true"]',
      );

      expect(sourceStamp).toHaveTextContent(longestStampFrame.sourceRefs);
      expect(sourceStamp).toHaveTextContent(
        language === "zh" ? "来源" : "SOURCES",
      );
      view.unmount();
    }
  });
});

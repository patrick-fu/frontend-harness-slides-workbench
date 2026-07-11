import { cleanup, fireEvent, render, within } from "@testing-library/react";
// @ts-expect-error -- Vitest executes focused source checks in Node.
import { readFileSync } from "node:fs";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { Source } from "../domain/evidence";
import type { TopicStageProps } from "../domain/topic";
import { runTopicContract } from "../testing/topic-contract";
import sevenBlues, {
  SEVEN_BLUES_CLAIMS,
  SEVEN_BLUES_SCENE_CLAIMS,
  SEVEN_BLUES_SOURCES,
  SEVEN_BLUES_TRANSITION_SCORE,
} from "./seven-blues";
import componentSource from "./seven-blues.tsx?raw";

const { Stage } = sevenBlues;

runTopicContract(sevenBlues);

const cssSource = readFileSync(
  "src/topics/seven-blues.module.css",
  "utf8",
) as string;

const BEAT_COUNTS: Record<number, number> = {
  1: 4,
  2: 3,
  3: 2,
  4: 1,
  5: 1,
};

function StageFrame({
  props,
  onStageClick,
  onStageKeyDown,
  onStageTouchStart,
}: {
  props: TopicStageProps;
  onStageClick?: () => void;
  onStageKeyDown?: () => void;
  onStageTouchStart?: () => void;
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
      onTouchStart={onStageTouchStart}
    >
      <Stage {...props} />
    </div>
  );
}

function renderStage(
  overrides: Partial<TopicStageProps> = {},
  handlers: {
    onStageClick?: () => void;
    onStageKeyDown?: () => void;
    onStageTouchStart?: () => void;
  } = {},
) {
  const props: TopicStageProps = {
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
    view.container.querySelector<HTMLElement>('[data-topic-id="seven-blues"]');
  const activePanel = () =>
    view.container.querySelector<HTMLElement>(
      '[data-spatial-scene-panel="true"][data-active="true"]',
    );

  return {
    ...view,
    props,
    root,
    activePanel,
    rerenderProps(next: Partial<TopicStageProps>) {
      view.rerender(<StageFrame props={{ ...props, ...next }} {...handlers} />);
    },
  };
}

afterEach(() => {
  cleanup();
  document.documentElement.removeAttribute("data-frozen");
});

describe("Riso Print Zine / Seven Blues — topic contract", () => {
  it("exports the planned topic, swatch navigation, exact score, and required model", () => {
    expect(sevenBlues.id).toBe("seven-blues");
    expect(sevenBlues.title).toEqual({
      en: "Seven Blues",
      zh: "七种蓝",
    });
    expect(sevenBlues.modelId).toBe("GPT 5.6 Sol");
    expect(sevenBlues.navigation).toEqual({
      geometry: "card-miniature",
      carrier: "blue-pigment-swatches",
      invocation: "proximity-reveal",
      feedback: "typographic-emphasis",
    });
    expect(sevenBlues.evidence).toEqual(
      expect.objectContaining({ kind: "mixed", sources: SEVEN_BLUES_SOURCES }),
    );
    expect(sevenBlues.transitionScore).toBe(
      SEVEN_BLUES_TRANSITION_SCORE,
    );
    expect(SEVEN_BLUES_TRANSITION_SCORE).toEqual({
      "1->2": "multi-blind",
      "2->3": "ink-spread",
      "3->4": "afterimage",
      "4->5": "multi-blind",
    });
  });

  it("ships reciprocal, claim-scoped authority sources for every displayed material route", () => {
    expect(SEVEN_BLUES_SOURCES.length).toBeGreaterThanOrEqual(6);
    const authorities = SEVEN_BLUES_SOURCES.map(
      (source) => source.authority,
    ).join(" ");
    expect(authorities).toMatch(/Smithsonian/i);
    expect(authorities).toMatch(/Getty/i);
    expect(authorities).toMatch(/National Gallery/i);
    expect(authorities).toMatch(/Harvard/i);

    const sourcesById = new Map(
      SEVEN_BLUES_SOURCES.map((source) => [source.id, source]),
    );

    for (const source of SEVEN_BLUES_SOURCES) {
      const traceable: Source = source;
      expect(source.id).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
      expect(source.stamp).toMatch(/^[A-Z0-9/-]+$/);
      expect(source.url).toMatch(/^https:\/\//);
      expect(source.accessDate).toBe("2026-07-10");
      expect(source.accessDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(source.title.length).toBeGreaterThan(3);
      expect(source.citation.length).toBeGreaterThan(20);
      expect(source.supports.length).toBeGreaterThan(60);
      expect(source.boundary.length).toBeGreaterThan(45);
      expect(source.claimIds.length).toBeGreaterThan(0);
      expect(traceable.url).toBe(source.url);

      for (const claimId of source.claimIds) {
        const claim = SEVEN_BLUES_CLAIMS[claimId];
        expect(claim, source.id + " -> " + claimId).toBeDefined();
        expect(claim.sourceIds).toContain(source.id);
      }
    }

    for (const [claimId, claim] of Object.entries(SEVEN_BLUES_CLAIMS)) {
      expect(claim.id).toBe(claimId);
      expect(claim.statement.length).toBeGreaterThan(45);
      expect(claim.sourceIds.length).toBeGreaterThan(0);
      for (const sourceId of claim.sourceIds) {
        const source = sourcesById.get(sourceId);
        expect(source, claimId + " -> " + sourceId).toBeDefined();
        expect(source?.claimIds).toContain(claim.id);
      }
    }

    const vatChemistry = SEVEN_BLUES_SOURCES.find(
      (source) => source.id === "smithsonian-indigo-vat",
    );
    expect(vatChemistry?.claimIds).toContain("indigo-oxidation");
    expect(vatChemistry?.supports).toMatch(/reduced.*leuco-indigo.*oxidation/i);
    expect(SEVEN_BLUES_CLAIMS["indigo-oxidation"].sourceIds).toContain(
      "smithsonian-indigo-vat",
    );
  });

  it("keeps English and Chinese metadata structurally aligned to 4-3-2-1-1", () => {
    const en = sevenBlues.metadata.en;
    const zh = sevenBlues.metadata.zh;

    for (const metadata of [en, zh]) {
      expect(metadata.heroScene).toBe(1);
      expect(metadata.scenes.map((scene) => scene.id)).toEqual([1, 2, 3, 4, 5]);
      expect(metadata.scenes.map((scene) => scene.beats.length)).toEqual([
        4, 3, 2, 1, 1,
      ]);
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

describe("Riso Print Zine / Seven Blues — bilingual visual narrative", () => {
  it("uses exact lazurite and cobalt-aluminate terminology in equivalent EN/ZH frames", () => {
    expect(componentSource).not.toContain("方钠石");
    expect(componentSource).not.toMatch(
      /Cobalt oxide lattice|钴氧化物晶格/,
    );

    const mineralEn = renderStage({
      scene: 2,
      beat: 2,
      language: "en",
      reducedMotion: true,
    });
    expect(mineralEn.activePanel()).toHaveTextContent(
      /lazurite particles separated from lapis lazuli rock/i,
    );
    mineralEn.unmount();

    const mineralZh = renderStage({
      scene: 2,
      beat: 2,
      language: "zh",
      reducedMotion: true,
    });
    expect(mineralZh.activePanel()).toHaveTextContent(
      /从青金石岩中分离出的 lazurite 颗粒/,
    );
    expect(mineralZh.activePanel()).toHaveTextContent(
      /青金石矿物（lazurite）/,
    );
    mineralZh.unmount();

    const labEn = renderStage({ scene: 4, language: "en", reducedMotion: true });
    expect(labEn.activePanel()).toHaveTextContent(
      /Cobalt aluminate \(spinel\) lattice/i,
    );
    labEn.unmount();

    const labZh = renderStage({ scene: 4, language: "zh", reducedMotion: true });
    expect(labZh.activePanel()).toHaveTextContent(
      /铝酸钴（尖晶石）晶格/,
    );
    labZh.unmount();
  });

  it("maps every active scene claim to its exact scene-local source links", () => {
    for (const language of ["en", "zh"] as const) {
      for (const scene of [1, 2, 3, 4, 5] as const) {
        const view = renderStage({
          language,
          scene,
          beat: BEAT_COUNTS[scene] - 1,
          reducedMotion: true,
        });
        const panel = view.activePanel();
        const claimIds = SEVEN_BLUES_SCENE_CLAIMS[scene];
        const sourceIds = new Set(
          claimIds.flatMap(
            (claimId) => SEVEN_BLUES_CLAIMS[claimId].sourceIds,
          ),
        );
        const expectedSourceIds = SEVEN_BLUES_SOURCES.filter((source) =>
          sourceIds.has(source.id),
        ).map((source) => source.id);
        const expectedClaimSourceLinks = claimIds
          .map(
            (claimId) =>
              claimId +
              ":" +
              SEVEN_BLUES_CLAIMS[claimId].sourceIds.join(","),
          )
          .join(";");
        const audit = panel?.querySelector<HTMLElement>(
          '[data-claim-source-map="true"]',
        );

        expect(audit).toHaveAttribute("data-scene-id", String(scene));
        expect(audit).toHaveAttribute("data-claim-ids", claimIds.join(" "));
        expect(audit).toHaveAttribute(
          "data-source-ids",
          expectedSourceIds.join(" "),
        );
        expect(audit).toHaveAttribute(
          "data-claim-source-links",
          expectedClaimSourceLinks,
        );
        expect(
          Array.from(
            audit?.querySelectorAll<HTMLElement>("[data-source-id]") ?? [],
          ).map((source) => source.dataset.sourceId),
        ).toEqual(expectedSourceIds);

        for (const claimId of claimIds) {
          const expectedLink =
            claimId +
            ":" +
            SEVEN_BLUES_CLAIMS[claimId].sourceIds.join(",");
          expect(audit?.dataset.claimSourceLinks?.split(";")).toContain(
            expectedLink,
          );
        }
        view.unmount();
      }
    }
  });

  it("renders every English and Chinese frame with a source stamp and stable reserved layout", () => {
    const compositions = new Set<string>();

    for (const language of ["en", "zh"] as const) {
      for (let scene = 1; scene <= 5; scene += 1) {
        for (let beat = 0; beat < BEAT_COUNTS[scene]; beat += 1) {
          const view = renderStage({ scene, beat, language });
          const panel = view.activePanel();
          const content = panel?.querySelector<HTMLElement>(
            "[data-scene-content]",
          );
          const stamp = content?.querySelector<HTMLElement>(
            '[data-source-stamp="true"]',
          );

          expect(panel).toHaveAttribute("data-scene-id", String(scene));
          expect(panel).toHaveAttribute("data-beat-layout-container", "true");
          expect(panel).toHaveAttribute("data-beat-layout-mode", "reserved");
          expect(content).toHaveAttribute("data-beat", String(beat));
          expect(content?.textContent?.trim().length).toBeGreaterThan(55);
          expect(content?.querySelectorAll('[data-beat-layout-item="true"]').length).toBeGreaterThanOrEqual(3);
          expect(stamp).toHaveAttribute("data-source-ids");
          expect(stamp?.querySelectorAll("a").length).toBeGreaterThan(0);

          if (beat === BEAT_COUNTS[scene] - 1) {
            compositions.add(content?.dataset.composition ?? "");
          }
          view.unmount();
        }
      }
    }

    expect(compositions).toEqual(
      new Set([
        "blue-field",
        "mineral-pairs",
        "plant-vat",
        "synthetic-lab",
        "swatch-wall",
      ]),
    );
  });

  it("uses five materially distinct scene constructions instead of seven repeated cards", () => {
    const expectedMarkers: Record<number, string> = {
      1: "[data-blue-field='true']",
      2: "[data-mineral-pairs='true']",
      3: "[data-plant-vat='true']",
      4: "[data-synthetic-lab='true']",
      5: "[data-swatch-wall='true']",
    };

    for (let scene = 1; scene <= 5; scene += 1) {
      const view = renderStage({
        scene,
        beat: BEAT_COUNTS[scene] - 1,
        reducedMotion: true,
      });
      const panel = view.activePanel();
      expect(panel?.querySelector(expectedMarkers[scene])).not.toBeNull();
      view.unmount();
    }
  });

  it("builds the planned chorus curve with progressive blue cuts, mineral notes, and vat inversion", () => {
    const expectedBlueCuts = [2, 4, 6, 7];
    for (let beat = 0; beat < 4; beat += 1) {
      const view = renderStage({ scene: 1, beat });
      expect(
        view.activePanel()?.querySelectorAll(
          '[data-blue-cut][data-visible="true"]',
        ),
      ).toHaveLength(expectedBlueCuts[beat]);
      view.unmount();
    }

    const mineralStart = renderStage({ scene: 2, beat: 0 });
    expect(
      mineralStart.activePanel()?.querySelector("[data-grind-strip]"),
    ).toHaveAttribute("data-visible", "false");
    mineralStart.unmount();

    const mineralFinish = renderStage({ scene: 2, beat: 2 });
    expect(
      mineralFinish.activePanel()?.querySelector("[data-grind-strip]"),
    ).toHaveAttribute("data-visible", "true");
    expect(
      mineralFinish.activePanel()?.querySelector("[data-grind-strip]"),
    ).toHaveAttribute("data-source-ids", "smithsonian-blue");
    expect(
      mineralFinish.activePanel()?.querySelector(
        "[data-grain-boundary='true'][data-visible='true']",
      ),
    ).not.toBeNull();
    mineralFinish.unmount();

    const vatStart = renderStage({ scene: 3, beat: 0 });
    expect(vatStart.activePanel()?.querySelector("[data-vat-state]")).toHaveAttribute(
      "data-vat-state",
      "vat",
    );
    vatStart.unmount();

    const vatAir = renderStage({ scene: 3, beat: 1 });
    expect(vatAir.activePanel()?.querySelector("[data-vat-state]")).toHaveAttribute(
      "data-vat-state",
      "air",
    );
    expect(vatAir.activePanel()).toHaveTextContent(/oxidation/i);
  });

  it("keeps synthetic, optical, safety, cultural, and screen boundaries conservative", () => {
    const lab = renderStage({ scene: 4, beat: 0, language: "en" });
    const panel = lab.activePanel();
    expect(panel?.querySelectorAll("[data-mechanism]")).toHaveLength(4);
    expect(panel).toHaveTextContent(/calcium–copper silicate/i);
    expect(panel).toHaveTextContent(/CoO·Al₂O₃/i);
    expect(panel).toHaveTextContent(/mixed-valence iron/i);
    expect(panel).toHaveTextContent(/Microstructure selects and scatters light/i);
    expect(panel).toHaveTextContent(/not a material-handling guide/i);
    lab.unmount();

    const finish = renderStage({ scene: 5, beat: 0, language: "en" });
    expect(finish.activePanel()?.querySelectorAll("[data-final-swatch]")).toHaveLength(
      7,
    );
    expect(finish.activePanel()?.querySelector("[data-screen-boundary='true']")).toHaveAttribute(
      "data-source-ids",
      "getty-egyptian-blue harvard-structural-color",
    );
    expect(finish.activePanel()).toHaveTextContent(
      /Screen swatches index material difference/i,
    );
  });

  it("keeps the final title and swatch wall in separate authored layout bands", () => {
    for (const language of ["en", "zh"] as const) {
      const finish = renderStage({
        scene: 5,
        beat: 0,
        language,
        reducedMotion: true,
      });
      const scene = finish.activePanel()?.querySelector<HTMLElement>(
        '[data-scene-content="5"]',
      );
      const header = scene?.querySelector<HTMLElement>(
        '[data-layout-band="header"]',
      );
      const body = scene?.querySelector<HTMLElement>(
        '[data-layout-band="body"]',
      );
      const wall = body?.querySelector<HTMLElement>(
        '[data-swatch-wall="true"]',
      );

      expect(scene).toHaveAttribute(
        "data-layout-contract",
        "title-safe-swatch-wall",
      );
      expect(header?.nextElementSibling).toBe(body);
      expect(wall?.parentElement).toBe(body);
      expect(header?.querySelector("h1")).toHaveTextContent(
        language === "zh" ? "保留差异" : "Keep the difference",
      );
      finish.unmount();
    }

    expect(cssSource).toMatch(
      /\.stillScene \.titleBlock h1\s*\{[\s\S]*?font-size:\s*min\([^)]*cqw[^)]*cqh\)[\s\S]*?white-space:\s*nowrap/,
    );
  });
});

describe("Riso Print Zine / Seven Blues — transitions and blue swatch navigation", () => {
  it("applies all four authored transitions through SpatialSceneTrack", () => {
    const view = renderStage({ scene: 1 });
    const expected = ["multi-blind", "ink-spread", "afterimage", "multi-blind"];

    for (let scene = 2; scene <= 5; scene += 1) {
      view.rerenderProps({ scene });
      expect(
        view.getByTestId("spatial-scene-track"),
      ).toHaveAttribute("data-scene-transition-kind", expected[scene - 2]);
    }

    expect(
      view.container.querySelector("[data-transition-clone='true']"),
    ).toBeNull();
  });

  it("reveals card labels by proximity/tap, navigates absolutely, and isolates click and keyboard events", () => {
    const onNavigate = vi.fn();
    const onStageClick = vi.fn();
    const onStageKeyDown = vi.fn();
    const view = renderStage(
      { scene: 2, onNavigate },
      { onStageClick, onStageKeyDown },
    );
    const nav = view.root()?.querySelector<HTMLElement>(
      '[data-topic-navigation="true"]',
    );
    const buttons = within(nav!).getAllByRole("button");

    expect(nav).toHaveAttribute("data-navigation-geometry", "card-miniature");
    expect(nav).toHaveAttribute(
      "data-navigation-carrier",
      "blue-pigment-swatches",
    );
    expect(nav).toHaveAttribute(
      "data-navigation-invocation",
      "proximity-reveal",
    );
    expect(nav).toHaveAttribute(
      "data-navigation-feedback",
      "typographic-emphasis",
    );
    expect(buttons).toHaveLength(5);

    const sceneFour = within(nav!).getByRole("button", {
      name: /jump to scene 4/i,
    });
    fireEvent.pointerDown(sceneFour, { pointerType: "touch" });
    expect(nav).toHaveAttribute("data-revealed-scene", "4");
    fireEvent.click(sceneFour);
    expect(onNavigate).toHaveBeenLastCalledWith(4, 0);
    expect(onStageClick).not.toHaveBeenCalled();

    const sceneTwo = within(nav!).getByRole("button", {
      name: /jump to scene 2/i,
    });
    fireEvent.keyDown(sceneTwo, { key: "ArrowRight" });
    expect(onNavigate).toHaveBeenLastCalledWith(3, 0);
    fireEvent.keyDown(sceneTwo, { key: "Home" });
    expect(onNavigate).toHaveBeenLastCalledWith(1, 0);
    fireEvent.keyDown(sceneTwo, { key: "End" });
    expect(onNavigate).toHaveBeenLastCalledWith(5, 0);
    const callsBeforeRepeat = onNavigate.mock.calls.length;
    fireEvent.keyDown(sceneTwo, { key: " ", repeat: true });
    expect(onNavigate).toHaveBeenCalledTimes(callsBeforeRepeat);
    expect(onStageKeyDown).not.toHaveBeenCalled();
  });

  it("stops native touch phases at the navigation while leaving the surrounding stage contract intact", () => {
    const stageTouch = vi.fn();
    const windowTouch = vi.fn();
    const view = renderStage({}, { onStageTouchStart: stageTouch });
    const stage = view.getByTestId("stage");
    const nav = view.root()?.querySelector<HTMLElement>(
      '[data-topic-navigation="true"]',
    );
    const phases = ["touchstart", "touchmove", "touchend", "touchcancel"] as const;

    for (const phase of phases) {
      stage.addEventListener(phase, stageTouch);
      window.addEventListener(phase, windowTouch);
    }

    try {
      fireEvent.touchStart(nav!);
      fireEvent.touchMove(nav!);
      fireEvent.touchEnd(nav!);
      fireEvent.touchCancel(nav!);
      expect(stageTouch).not.toHaveBeenCalled();
      expect(windowTouch).not.toHaveBeenCalled();

      fireEvent.touchStart(stage);
      expect(stageTouch).toHaveBeenCalled();
      expect(windowTouch).toHaveBeenCalled();
    } finally {
      for (const phase of phases) {
        stage.removeEventListener(phase, stageTouch);
        window.removeEventListener(phase, windowTouch);
      }
    }
  });
});

describe("Riso Print Zine / Seven Blues — deterministic stage safety", () => {
  it("hides navigation in thumbnails and settles thumbnail, reduced-motion, and frozen frames", () => {
    const thumbnail = renderStage({
      scene: 3,
      beat: 1,
      isThumbnail: true,
      reducedMotion: false,
    });
    expect(
      thumbnail.root()?.querySelector('[data-topic-navigation="true"]'),
    ).toBeNull();
    expect(thumbnail.root()).toHaveAttribute("data-motion", "off");
    expect(thumbnail.root()).toHaveAttribute("data-settled", "true");
    expect(
      thumbnail.container.querySelector("[data-spatial-scene-strip='true']"),
    ).toHaveAttribute("data-reduced-motion", "true");
    thumbnail.unmount();

    const reduced = renderStage({ scene: 2, beat: 2, reducedMotion: true });
    expect(reduced.root()).toHaveAttribute("data-motion", "off");
    expect(
      reduced.activePanel()?.querySelector("[data-grind-strip]"),
    ).toHaveAttribute("data-visible", "true");
    reduced.unmount();

    document.documentElement.dataset.frozen = "true";
    const frozen = renderStage({ scene: 1, beat: 3 });
    expect(frozen.root()).toHaveAttribute("data-frozen", "true");
    expect(frozen.root()).toHaveAttribute("data-settled", "true");
    expect(
      frozen.container.querySelector("[data-spatial-scene-strip='true']"),
    ).toHaveAttribute("data-reduced-motion", "true");
  });

  it("keeps root, track, navigation, panels, and source stamps inside the fixed stage DOM", () => {
    const view = renderStage({ scene: 5, beat: 0, reducedMotion: true });
    const stage = view.getByTestId("stage");
    const root = view.root();
    const track = root?.querySelector<HTMLElement>(
      '[data-spatial-scene-track="true"]',
    );
    const nav = root?.querySelector<HTMLElement>(
      '[data-topic-navigation="true"]',
    );

    expect(root?.parentElement).toBe(stage);
    expect(root).toHaveAttribute("data-style-id", "riso-print-zine");
    expect(root).toHaveAttribute(
      "data-transition-score",
      "multi-blind|ink-spread|afterimage|multi-blind",
    );
    expect(track?.parentElement).toBe(root);
    expect(track?.querySelectorAll("[data-spatial-scene-panel='true']")).toHaveLength(
      5,
    );
    expect(track).toHaveStyle({ overflow: "hidden" });
    expect(root?.contains(nav ?? null)).toBe(true);
    expect(root?.querySelectorAll("[data-source-stamp='true']").length).toBeGreaterThan(
      0,
    );
    expect(root?.querySelector("[data-transition-clone='true']")).toBeNull();
  });

  it("uses stage-local container units and original DOM/SVG/CSS without remote visual assets or fake overflow assertions", () => {
    const forbiddenUnit = /(?:^|[^a-z-])\d*\.?\d+(?:px|vw|vh|rem|em)\b/i;
    expect(componentSource).toContain("<SpatialSceneTrack");
    expect(componentSource).not.toMatch(
      /isTransitionClone|outgoingScene|setInterval|requestAnimationFrame|<(?:img|image|video|audio)\b/i,
    );
    expect(componentSource).not.toMatch(/<img[^>]+https?:\/\//i);
    expect(cssSource).not.toMatch(forbiddenUnit);
    expect(componentSource).not.toMatch(forbiddenUnit);
    expect(cssSource).toMatch(/container-type:\s*size/);
    expect(cssSource).toMatch(/\.sceneTrack\s*\{[\s\S]*?position:\s*absolute[\s\S]*?inset:\s*0/);
    expect(cssSource).toMatch(/\.sceneBody\s*\{[\s\S]*?min-width:\s*0[\s\S]*?min-height:\s*0[\s\S]*?overflow:\s*hidden/);
    expect(cssSource).toMatch(/\d+(?:\.\d+)?cqw\b/);
    expect(cssSource).toMatch(/\d+(?:\.\d+)?cqh\b/);
    expect(cssSource).not.toMatch(/animation[^;{]*infinite|animation-iteration-count\s*:\s*infinite/i);
    expect(cssSource).not.toMatch(/url\(https?:/i);
  });
});

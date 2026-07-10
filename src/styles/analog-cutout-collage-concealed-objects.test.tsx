import { fireEvent, render, waitFor, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { BespokeStyleProps } from "../types";
import ConcealedObjects, {
  CONCEALED_OBJECT_RECORDS,
  CONCEALED_OBJECTS_CLAIMS,
  CONCEALED_OBJECTS_SCENE_CLAIMS,
  CONCEALED_OBJECTS_SOURCES,
  CONCEALED_OBJECTS_TRANSITION_SCORE,
  concealedObjectsTopic,
  getMetadata,
  type ConcealedObjectsClaim,
  type ConcealedObjectsClaimId,
  type ConcealedObjectsSourceId,
} from "./analog-cutout-collage-concealed-objects";
import styleClasses from "./analog-cutout-collage-concealed-objects.module.css";
import componentSource from "./analog-cutout-collage-concealed-objects.tsx?raw";

const runtimeProcess = (
  globalThis as typeof globalThis & {
    process: { getBuiltinModule: (name: "node:fs") => unknown };
  }
).process;
const { readFileSync } = runtimeProcess.getBuiltinModule("node:fs") as {
  readFileSync: (path: string, encoding: "utf8") => string;
};
const cssSource = readFileSync(
  "src/styles/analog-cutout-collage-concealed-objects.module.css",
  "utf8",
);

const BEAT_COUNTS: Record<number, number> = {
  1: 4,
  2: 3,
  3: 2,
  4: 1,
  5: 1,
};

const EXPECTED_SOURCE_URLS: Record<ConcealedObjectsSourceId, string> = {
  "leigh-barton-report": "https://historicengland.org.uk/research/results/reports/2145/CONCEALEDSHOEFROMLEIGHBARTONCHURCHSTOWSOUTHDEVON",
  "york-concealed-shoes": "https://www.yorkmuseumstrust.org.uk/blog/concealed-shoes-in-the-york-castle-museum-collection/",
  "mola-holywell": "https://www.mola.org.uk/discoveries/news/holywell-witch-bottle",
  "lauderdale-cache": "https://www.londonmuseum.org.uk/blog/lauderdale-house-witchcraft-relics-hidden-in-the-wall/",
  "avebury-shoe-cache": "https://wshc.org.uk/concealed-shoes/",
  "carhullan-mark": "https://historicengland.org.uk/listing/the-list/list-entry/1485219",
  "historic-england-marks": "https://historicengland.org.uk/whats-new/features/discovering-witches-marks/what-are-witches-marks",
  "houlbrook-2013": "https://www.cambridge.org/core/journals/cambridge-archaeological-journal/article/abs/ritual-recycling-and-recontextualization-putting-the-concealed-shoe-into-context/C6F6897C2F8778F6EA30F5DB74305491",
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
}: {
  props: BespokeStyleProps;
  onStageClick?: () => void;
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
    >
      <ConcealedObjects {...props} />
    </div>
  );
}

function renderStage(
  overrides: Partial<BespokeStyleProps> = {},
  onStageClick = vi.fn(),
) {
  const props = { ...BASE_PROPS, onNavigate: vi.fn(), ...overrides };
  const result = render(<StageFrame props={props} onStageClick={onStageClick} />);
  const root = () =>
    result.container.querySelector<HTMLElement>(
      '[data-topic-id="concealed-objects"]',
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
    rerenderProps(next: Partial<BespokeStyleProps>) {
      result.rerender(
        <StageFrame props={{ ...props, ...next }} onStageClick={onStageClick} />,
      );
    },
  };
}

describe("Analog Cutout Collage: concealed objects — topic contract", () => {
  it("exports the locked topic, wall-cache navigation, model, and score", () => {
    expect(concealedObjectsTopic.id).toBe("concealed-objects");
    expect(concealedObjectsTopic.topic).toEqual({
      en: "Inside the Wall",
      zh: "墙中藏物",
    });
    expect(concealedObjectsTopic.model).toBe("GPT 5.6 Sol");
    expect(concealedObjectsTopic.navigation).toEqual({
      geometry: "card-miniature",
      carrier: "wall-cache-fragments",
      invocation: "click-expand",
      feedback: "active-glow",
    });
    expect(concealedObjectsTopic.sources).toBe(CONCEALED_OBJECTS_SOURCES);
    expect(concealedObjectsTopic.transitionScore).toBe(
      CONCEALED_OBJECTS_TRANSITION_SCORE,
    );
    expect(CONCEALED_OBJECTS_TRANSITION_SCORE).toEqual({
      "1->2": "paper-fold",
      "2->3": "card-carousel",
      "3->4": "push-x",
      "4->5": "paper-fold",
    });
  });

  it("locks seven documented object records and traceable primary or scholarly sources", () => {
    expect(CONCEALED_OBJECT_RECORDS).toHaveLength(7);
    expect(CONCEALED_OBJECT_RECORDS.map((record) => record.id)).toEqual([
      "leigh",
      "bishopthorpe",
      "holywell",
      "gillygate",
      "lauderdale",
      "avebury",
      "carhullan",
    ]);

    for (const source of CONCEALED_OBJECTS_SOURCES) {
      expect(source.url).toBe(EXPECTED_SOURCE_URLS[source.id]);
      expect(source.url).toMatch(/^https:\/\//);
      expect(source.accessDate).toBe("2026-07-10");
      expect(source.accessDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(source.authority?.trim().length).toBeGreaterThan(6);
      expect(source.title?.trim().length).toBeGreaterThan(12);
      expect(source.citation.trim().length).toBeGreaterThan(30);
      expect(source.supports.trim().length).toBeGreaterThan(90);
      expect(source.boundary.trim().length).toBeGreaterThan(90);
      expect(source.shortLabel.en.trim().length).toBeGreaterThan(5);
      expect(source.shortLabel.zh.trim().length).toBeGreaterThan(5);
      expect(source.claimIds.length).toBeGreaterThan(0);
    }

    for (const record of CONCEALED_OBJECT_RECORDS) {
      const claim = CONCEALED_OBJECTS_CLAIMS[record.claimId];
      expect(claim.sourceIds).toContain(record.sourceId);
      expect(
        CONCEALED_OBJECTS_SOURCES.find((source) => source.id === record.sourceId)
          ?.claimIds,
      ).toContain(record.claimId);
    }

    expect(
      CONCEALED_OBJECTS_SOURCES.find(
        (source) => source.id === "leigh-barton-report",
      )?.citation,
    ).toBe("J. H. Thornton, 1982, Ancient Monuments Laboratory Report 3736.");
    const holywell = CONCEALED_OBJECTS_SOURCES.find(
      (source) => source.id === "mola-holywell",
    );
    expect(holywell?.citation).toBe(
      "MOLA webpage article, “The Holywell witch-bottle.”",
    );
    expect(holywell?.supports).toMatch(/London stoneware vessel/);
    expect(holywell?.supports).toMatch(/copper-alloy pins, nail residue/);
  });

  it("keeps every claim, source, and scene stamp reciprocal", () => {
    const sourceById = new Map(
      CONCEALED_OBJECTS_SOURCES.map((source) => [source.id, source] as const),
    );
    const claimEntries = Object.entries(CONCEALED_OBJECTS_CLAIMS) as Array<
      [ConcealedObjectsClaimId, ConcealedObjectsClaim]
    >;

    for (const [claimId, claim] of claimEntries) {
      expect(claim.id).toBe(claimId);
      expect(claim.sourceIds.length).toBeGreaterThan(0);
      expect(new Set(claim.sourceIds).size).toBe(claim.sourceIds.length);
      expect(Object.keys(claim.visibleByScene).length).toBeGreaterThan(0);
      for (const sourceId of claim.sourceIds) {
        expect(sourceById.get(sourceId)?.claimIds).toContain(claimId);
      }
      for (const fragment of Object.values(claim.visibleByScene)) {
        expect(fragment?.en.trim()).not.toBe("");
        expect(fragment?.zh.trim()).not.toBe("");
      }
    }

    for (const source of CONCEALED_OBJECTS_SOURCES) {
      for (const claimId of source.claimIds) {
        expect(CONCEALED_OBJECTS_CLAIMS[claimId].sourceIds).toContain(source.id);
      }
    }

    for (const scene of [1, 2, 3, 4, 5] as const) {
      const visibleClaims = claimEntries
        .filter(([, claim]) => claim.visibleByScene[scene] !== undefined)
        .map(([claimId]) => claimId);
      expect(CONCEALED_OBJECTS_SCENE_CLAIMS[scene]).toEqual(visibleClaims);
    }
  });

  it("keeps EN and ZH metadata aligned to the 4/3/2/1/1 curve", () => {
    const en = getMetadata("en");
    const zh = getMetadata("zh");

    expect(en.id).toBe("analog-cutout-collage");
    expect(en.band).toBe("craft-cultural");
    expect(en.heroScene).toBe(1);
    expect(en.scenes.map((scene) => scene.beats.length)).toEqual([4, 3, 2, 1, 1]);
    expect(zh.scenes.map((scene) => scene.beats.length)).toEqual([4, 3, 2, 1, 1]);

    for (const metadata of [en, zh]) {
      expect(metadata.scenes.map((scene) => scene.id)).toEqual([1, 2, 3, 4, 5]);
      for (const scene of metadata.scenes) {
        scene.beats.forEach((beat, index) => {
          expect(beat.id).toBe(index);
          expect(beat.action.trim()).not.toBe("");
          expect(beat.title.trim()).not.toBe("");
          expect(beat.body.trim()).not.toBe("");
        });
      }
    }
  });
});

describe("Analog Cutout Collage: concealed objects — evidence scenes", () => {
  it("renders every EN/ZH frame with five distinct collage compositions and source stamps", () => {
    for (const language of ["en", "zh"] as const) {
      const compositions = new Set<string>();
      for (let scene = 1; scene <= 5; scene += 1) {
        for (let beat = 0; beat < BEAT_COUNTS[scene]; beat += 1) {
          const view = renderStage({ language, scene, beat });
          const panel = view.activePanel();
          expect(view.root()).toHaveClass(styleClasses.root);
          expect(panel).toHaveAttribute("data-scene-id", String(scene));
          expect(panel).toHaveAttribute("data-beat-layout-container", "true");
          expect(panel).toHaveAttribute("data-beat-layout-mode", "reserved");
          expect(panel?.textContent?.replace(/\s+/g, " ").trim().length).toBeGreaterThan(120);
          const sceneBody = panel?.querySelector<HTMLElement>(
            `[data-scene-content="${scene}"]`,
          );
          expect(sceneBody).toHaveAttribute("data-composition");
          expect(sceneBody).toHaveAttribute("data-beat-layout-container", "true");
          expect(sceneBody).toHaveAttribute("data-beat-layout-mode", "reserved");
          expect(sceneBody?.querySelector('[data-scene-source-stamp="true"]')).not.toBeNull();
          compositions.add(sceneBody?.dataset.composition ?? "");
          view.unmount();
        }
      }
      expect(compositions.size).toBe(5);
    }
  });

  it("renders scene-local claims and source map attributes in both languages", () => {
    for (const language of ["en", "zh"] as const) {
      for (const scene of [1, 2, 3, 4, 5] as const) {
        const view = renderStage({
          language,
          scene,
          beat: BEAT_COUNTS[scene] - 1,
          reducedMotion: true,
        });
        const panel = view.activePanel();
        const claimIds = CONCEALED_OBJECTS_SCENE_CLAIMS[scene];
        const sourceIds = Array.from(
          new Set(
            claimIds.flatMap(
              (claimId) => CONCEALED_OBJECTS_CLAIMS[claimId].sourceIds,
            ),
          ),
        );
        const expectedLinks = claimIds
          .map(
            (claimId) =>
              `${claimId}:${CONCEALED_OBJECTS_CLAIMS[claimId].sourceIds.join(",")}`,
          )
          .join(";");
        const trace = panel?.querySelector<HTMLElement>(
          '[data-claim-source-map="true"]',
        );

        expect(panel?.querySelector('[data-visible-claim-ids]')).toHaveAttribute(
          "data-visible-claim-ids",
          claimIds.join(" "),
        );
        expect(trace).toHaveAttribute("data-scene-id", String(scene));
        expect(trace).toHaveAttribute("data-claim-ids", claimIds.join(" "));
        expect(trace).toHaveAttribute("data-source-ids", sourceIds.join(" "));
        expect(trace).toHaveAttribute("data-claim-source-links", expectedLinks);
        expect(
          Array.from(trace?.querySelectorAll<HTMLElement>("[data-source-id]") ?? []).map(
            (item) => item.dataset.sourceId,
          ),
        ).toEqual(sourceIds);

        for (const claimId of claimIds) {
          const fragment = CONCEALED_OBJECTS_CLAIMS[claimId].visibleByScene[scene]?.[language];
          expect(fragment).toBeDefined();
          expect(panel).toHaveTextContent(fragment!);
        }
        view.unmount();
      }
    }
  });

  it("separates fact, research interpretation, and folklore analogy", () => {
    const evidence = renderStage({ scene: 4, language: "en", reducedMotion: true });
    expect(evidence.activePanel()).toHaveTextContent("Documented find");
    expect(evidence.activePanel()).toHaveTextContent("Research reading");
    expect(evidence.activePanel()).toHaveTextContent("Folklore analogy");
    expect(evidence.activePanel()).toHaveTextContent(
      "about 60 bent copper-alloy pins and nail residue",
    );
    expect(evidence.activePanel()).toHaveTextContent(
      "do not name a historic person's intention",
    );
    expect(evidence.activePanel()).toHaveTextContent("purpose remains disputed");
    const findingLayer = evidence.activePanel()?.querySelector<HTMLElement>(
      '[data-evidence-layer="finding"]',
    );
    expect(
      Array.from(
        findingLayer?.querySelectorAll<HTMLElement>("[data-source-id]") ?? [],
      ).map((source) => source.dataset.sourceId),
    ).toEqual(["leigh-barton-report", "mola-holywell", "carhullan-mark"]);
    expect(findingLayer).toHaveTextContent("HE · Leigh Barton");
    expect(findingLayer).toHaveTextContent("MOLA · Holywell");
    expect(findingLayer).toHaveTextContent("HE · Carhullan");
    evidence.unmount();

    const evidenceZh = renderStage({ scene: 4, language: "zh", reducedMotion: true });
    const findingLayerZh = evidenceZh.activePanel()?.querySelector<HTMLElement>(
      '[data-evidence-layer="finding"]',
    );
    expect(findingLayerZh).toHaveTextContent("英格兰遗产 · Leigh Barton");
    expect(findingLayerZh).toHaveTextContent("MOLA · Holywell");
    expect(findingLayerZh).toHaveTextContent("英格兰遗产 · Carhullan");
    expect(evidenceZh.activePanel()).toHaveTextContent("伦敦炻器瓶");
    expect(evidenceZh.activePanel()).toHaveTextContent("弯曲铜合金针，另有钉子残留");
    evidenceZh.unmount();

    const gillygateZh = renderStage({ scene: 2, language: "zh", reducedMotion: true });
    expect(gillygateZh.activePanel()).toHaveTextContent("商铺上方二层卧室地板下");
    gillygateZh.unmount();

    const closing = renderStage({ scene: 5, language: "en", reducedMotion: true });
    expect(closing.activePanel()).toHaveTextContent("Concealed does not mean understood.");
    expect(closing.activePanel()).toHaveTextContent(
      "Condition, repair, dirt, and find location",
    );
    expect(closing.activePanel()?.querySelector('[data-conservation-tray="true"]')).not.toBeNull();
    expect(closing.activePanel()?.querySelectorAll('[data-claim-id]').length).toBeGreaterThanOrEqual(7);
    closing.unmount();
  });
});

describe("Analog Cutout Collage: concealed objects — transitions and navigation", () => {
  it("renders the required transition primitive on every forward edge", async () => {
    const view = renderStage({ scene: 1 });
    const track = () =>
      view.container.querySelector<HTMLElement>(
        '[data-spatial-scene-track="true"]',
      );

    for (const [scene, kind] of [
      [2, "paper-fold"],
      [3, "card-carousel"],
      [4, "push-x"],
      [5, "paper-fold"],
    ] as const) {
      view.rerenderProps({ scene });
      await waitFor(() => {
        expect(track()).toHaveAttribute("data-scene-transition-kind", kind);
      });
    }
  });

  it("exposes five click-expand wall-cache miniatures with active glow feedback", () => {
    const { root } = renderStage({ scene: 3 });
    const navigation = root()?.querySelector<HTMLElement>(
      '[data-topic-navigation="true"]',
    );

    expect(navigation).toHaveAttribute("data-navigation-geometry", "card-miniature");
    expect(navigation).toHaveAttribute("data-navigation-carrier", "wall-cache-fragments");
    expect(navigation).toHaveAttribute("data-navigation-invocation", "click-expand");
    expect(navigation).toHaveAttribute("data-navigation-feedback", "active-glow");
    expect(navigation).toHaveAttribute("data-expanded", "true");
    expect(within(navigation!).getAllByRole("button")).toHaveLength(5);
    expect(
      within(navigation!).getByRole("button", {
        name: "Open wall fragment 3: location plan",
      }),
    ).toHaveAttribute("aria-current", "page");
  });

  it("uses absolute click, tap, and keyboard jumps without native event leakage", () => {
    const onNavigate = vi.fn();
    const onStageClick = vi.fn();
    const { root } = renderStage({ scene: 1, onNavigate }, onStageClick);
    const navigation = root()?.querySelector<HTMLElement>(
      '[data-topic-navigation="true"]',
    );
    const target = within(navigation!).getByRole("button", {
      name: "Open wall fragment 5: conservation tray",
    });
    const sceneFour = within(navigation!).getByRole("button", {
      name: "Open wall fragment 4: evidence clusters",
    });

    fireEvent.pointerDown(target);
    fireEvent.touchStart(target);
    fireEvent.click(target);
    expect(onNavigate).toHaveBeenLastCalledWith(5, 0);
    expect(onNavigate).toHaveBeenCalledTimes(1);
    expect(onStageClick).not.toHaveBeenCalled();

    fireEvent.keyDown(sceneFour, { key: "Enter" });
    expect(onNavigate).toHaveBeenLastCalledWith(4, 0);
    expect(onNavigate).toHaveBeenCalledTimes(2);

    fireEvent.keyDown(target, { key: " ", repeat: true });
    expect(onNavigate).toHaveBeenCalledTimes(2);
    fireEvent.keyDown(target, { key: " " });
    expect(onNavigate).toHaveBeenLastCalledWith(5, 0);
    expect(onNavigate).toHaveBeenCalledTimes(3);
    expect(onStageClick).not.toHaveBeenCalled();
  });

  it("hides navigation in thumbnails and settles reduced or thumbnail motion", () => {
    for (const props of [
      { isThumbnail: true, reducedMotion: false },
      { isThumbnail: false, reducedMotion: true },
    ]) {
      const view = renderStage({
        scene: 2,
        beat: 2,
        onNavigate: undefined,
        ...props,
      });
      expect(view.root()).toHaveAttribute("data-motion", "off");
      expect(
        view.container.querySelector('[data-spatial-scene-strip="true"]'),
      ).toHaveAttribute("data-reduced-motion", "true");
      if (props.isThumbnail) {
        expect(view.root()?.querySelector('[data-topic-navigation="true"]')).toBeNull();
      }
      view.unmount();
    }
  });
});

describe("Analog Cutout Collage: concealed objects — stage-safe authored DOM", () => {
  it("uses original DOM/SVG/CSS without remote visual assets, loops, or legacy clones", () => {
    expect(componentSource).not.toMatch(/<img\b[^>]*https?:\/\//i);
    expect(componentSource).not.toMatch(/<img\b|<video\b|<canvas\b/i);
    expect(componentSource).not.toMatch(/setInterval|requestAnimationFrame/);
    expect(componentSource).not.toMatch(/outgoingScene|isTransitionClone/);
    expect(componentSource).toMatch(/<text x="27" y="25">JL<\/text>/);
    expect(componentSource).toMatch(/<text x="18" y="41">1676<\/text>/);
    expect(componentSource).toMatch(/<rect x="18" y="57" width="62" height="15"/);
    expect(cssSource).not.toMatch(/animation[^;{]*infinite/i);
    expect(cssSource).not.toMatch(/linear-gradient|radial-gradient|border-radius/i);
  });

  it("uses a clipped container-query stage without claiming JSDOM can measure overflow", () => {
    const rootRule = cssSource.match(/(?:^|\n)\.root\s*\{([^}]*)\}/)?.[1];
    const trackShellRule = cssSource.match(
      /(?:^|\n)\.trackShell\s*\{([^}]*)\}/,
    )?.[1];
    const sceneRule = cssSource.match(/(?:^|\n)\.scene\s*\{([^}]*)\}/)?.[1];
    const forbiddenStageUnit = /(?:^|[^a-z-])\d*\.?\d+(?:px|vw|vh|rem|em)\b/i;

    expect(rootRule).toMatch(/container-type:\s*size\s*;/);
    expect(rootRule).toMatch(/position:\s*relative\s*;/);
    expect(rootRule).toMatch(/width:\s*100%\s*;/);
    expect(rootRule).toMatch(/height:\s*100%\s*;/);
    expect(rootRule).toMatch(/overflow:\s*hidden\s*;/);
    expect(trackShellRule).toMatch(/position:\s*absolute\s*;/);
    expect(trackShellRule).toMatch(/top:\s*\d*\.?\d+cqh\s*;/);
    expect(trackShellRule).toMatch(/right:\s*\d*\.?\d+cqw\s*;/);
    expect(trackShellRule).toMatch(/bottom:\s*\d*\.?\d+cqh\s*;/);
    expect(trackShellRule).toMatch(/left:\s*\d*\.?\d+cqw\s*;/);
    expect(trackShellRule).toMatch(/overflow:\s*hidden\s*;/);
    expect(sceneRule).toMatch(/position:\s*relative\s*;/);
    expect(sceneRule).toMatch(/overflow:\s*hidden\s*;/);
    expect(cssSource).toMatch(/\d*\.?\d+cqw\b/i);
    expect(cssSource).toMatch(/\d*\.?\d+cqh\b/i);
    expect(cssSource).not.toMatch(/position:\s*fixed\b/i);
    expect(componentSource).not.toMatch(forbiddenStageUnit);
    expect(cssSource).not.toMatch(forbiddenStageUnit);
  });
});

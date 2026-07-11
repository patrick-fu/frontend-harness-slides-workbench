import { fireEvent, render, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { BespokeStyleProps } from "../types";
import NaturalClocks, {
  getMetadata,
  NATURAL_CLOCKS_EVIDENCE,
  NATURAL_CLOCKS_SOURCE_MAP,
  NATURAL_CLOCKS_SOURCES,
  NATURAL_CLOCKS_TRANSITION_SCORE,
  naturalClocksTopic,
} from "./benchmark-matrix-natural-clocks";
import componentSource from "./benchmark-matrix-natural-clocks.tsx?raw";
import styleSource from "./benchmark-matrix-natural-clocks.module.css?inline";

const BEAT_COUNTS: Record<number, number> = {
  1: 4,
  2: 3,
  3: 2,
  4: 1,
  5: 1,
};

const CLAIM_FIELDS = [
  "mechanism",
  "resolution",
  "span",
  "calibration",
  "boundary",
] as const;

const EXPECTED_SOURCE_FIELDS = [
  {
    id: "nasa-ice",
    authority: "NASA Science",
    title: "Core questions: An introduction to ice cores",
    citation:
      "Stoller-Conrad, J. (2017), NASA Science; updated October 22, 2024.",
    url: "https://science.nasa.gov/science-research/earth-science/climate-science/core-questions-an-introduction-to-ice-cores/",
  },
  {
    id: "nasa-tree",
    authority: "NASA Science",
    title:
      "How do we know what greenhouse gas and temperature levels were in the distant past?",
    citation:
      "NASA Science (2024), “How do we know what greenhouse gas and temperature levels were in the distant past?”",
    url: "https://science.nasa.gov/climate-change/faq/how-do-we-know-what-greenhouse-gas-and-temperature-levels-were-in-the-distant-past/",
  },
  {
    id: "noaa-coral",
    authority: "NOAA National Centers for Environmental Information",
    title: "How Can Corals Teach Us About Climate?",
    citation:
      "NOAA National Centers for Environmental Information (2016), “How Can Corals Teach Us About Climate?”",
    url: "https://www.ncei.noaa.gov/news/how-can-corals-teach-us-about-climate",
  },
  {
    id: "ltrr-annual",
    authority: "University of Arizona Laboratory of Tree-Ring Research",
    title: "About Us",
    citation:
      "University of Arizona Laboratory of Tree-Ring Research, “About Us” (accessed July 10, 2026).",
    url: "https://ltrr.arizona.edu/about",
  },
  {
    id: "ltrr-chronology",
    authority: "University of Arizona Laboratory of Tree-Ring Research",
    title: "Program Overview and History",
    citation:
      "University of Arizona Laboratory of Tree-Ring Research, “Program Overview and History” (accessed July 10, 2026).",
    url: "https://www.ltrr.arizona.edu/archaeology/progandhist.htm",
  },
  {
    id: "noaa-varve",
    authority: "NOAA World Data Service for Paleoclimatology",
    title:
      "A 3000-year varved record of glacier activity and climate change from the proglacial lake Hvítárvatn, Iceland",
    citation:
      "Larsen, D.J., Miller, G.H., Geirsdóttir, Á., & Thordarson, T. (2011), Quaternary Science Reviews 30, 2715–2731, doi:10.1016/j.quascirev.2011.05.026; NOAA/WDS Study 14730.",
    url: "https://www.ncei.noaa.gov/pub/data/paleo/paleolimnology/europe/iceland/hvitarvatn2011-3varvethickness.txt",
  },
  {
    id: "usgs-archives",
    authority: "U.S. Geological Survey",
    title: "Paleoclimate Archives",
    citation:
      "U.S. Geological Survey, “Paleoclimate Archives” (accessed July 10, 2026).",
    url: "https://www.usgs.gov/programs/climate-research-and-development-program/science/paleoclimate-archives",
  },
  {
    id: "usgs-calcite",
    authority: "U.S. Geological Survey",
    title:
      "Continuous 500,000-year climate record from vein calcite in Devils Hole, Nevada",
    citation:
      "Winograd, I.J., et al. (1992), Science 258, 255–260, doi:10.1126/science.258.5080.255.",
    url: "https://www.usgs.gov/publications/continuous-500000-year-climate-record-vein-calcite-devils-hole-nevada",
  },
  {
    id: "nanograv",
    authority:
      "North American Nanohertz Observatory for Gravitational Waves (NANOGrav)",
    title: "Detector Characterization and Noise Budget",
    citation:
      "Agazie, G., et al. (2023), The Astrophysical Journal Letters 951:L9, doi:10.3847/2041-8213/acda88.",
    url: "https://nanograv.org/15yr/Summary/Detector",
  },
] as const;

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
      <NaturalClocks {...props} />
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
    root: () =>
      result.container.querySelector<HTMLElement>(
        '[data-topic-id="natural-clocks"]',
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

describe("Natural Clocks topic protocol", () => {
  it("declares the benchmark-matrix topic, source packet, navigation, and exact score", () => {
    expect(naturalClocksTopic.id).toBe("natural-clocks");
    expect(naturalClocksTopic.topic).toEqual({
      en: "Natural Clocks",
      zh: "自然时钟",
    });
    expect(naturalClocksTopic.model).toBe("GPT 5.6 Sol");
    expect(naturalClocksTopic.navigation).toEqual({
      geometry: "typographic-index",
      carrier: "clock-taxonomy-index",
      invocation: "auto-hide",
      feedback: "typographic-emphasis",
    });
    expect(naturalClocksTopic.sources).toBe(NATURAL_CLOCKS_SOURCES);
    expect(naturalClocksTopic.transitionScore).toBe(
      NATURAL_CLOCKS_TRANSITION_SCORE,
    );
    expect(NATURAL_CLOCKS_TRANSITION_SCORE).toEqual({
      "1->2": "page-turn",
      "2->3": "grid-reveal",
      "3->4": "crossfade",
      "4->5": "dip-to-color",
    });

  });

  it("publishes complete, stable source records field by field", () => {
    expect(
      NATURAL_CLOCKS_SOURCES.map(
        ({ id, authority, title, citation, url }) => ({
          id,
          authority,
          title,
          citation,
          url,
        }),
      ),
    ).toEqual(EXPECTED_SOURCE_FIELDS);

    const supportBoundaries = {
      "nasa-ice": ["800,000-year", "harder to identify at depth"],
      "nasa-tree": ["about 2,000 years", "not a universal tree-ring limit"],
      "noaa-coral": ["exact year and season", "x-ray imaging"],
      "ltrr-annual": ["annual rings", "dendrochronological archive"],
      "ltrr-chronology": ["chronology building", "living-tree and archaeological chronologies"],
      "noaa-varve": ["past 3,000 years", "continuous, annual nature"],
      "usgs-archives": [
        "analytical resolution varying by material",
        "reconstruction at the sample site",
      ],
      "usgs-calcite": ["500,000-year", "replicated uranium-series dates"],
      nanograv: ["one microsecond", "15 years"],
    } as const;

    for (const expected of EXPECTED_SOURCE_FIELDS) {
      const source = NATURAL_CLOCKS_SOURCE_MAP[expected.id];
      expect(source).toBeDefined();
      expect(source.url).toMatch(/^https:\/\//);
      for (const boundary of supportBoundaries[expected.id]) {
        expect(source.supports).toContain(boundary);
      }
      expect(source.claimIds.length).toBeGreaterThan(0);
    }
  });

  it("resolves every evidence source key and every field-level claim", () => {
    expect(Object.keys(NATURAL_CLOCKS_SOURCE_MAP)).toEqual(
      EXPECTED_SOURCE_FIELDS.map((source) => source.id),
    );

    for (const evidence of NATURAL_CLOCKS_EVIDENCE) {
      expect(evidence.sourceKeys.length).toBeGreaterThan(0);
      for (const sourceKey of evidence.sourceKeys) {
        expect(NATURAL_CLOCKS_SOURCE_MAP[sourceKey]).toBeDefined();
      }

      for (const field of CLAIM_FIELDS) {
        const claimId = evidence.claimIds[field];
        expect(claimId).toBe(`${evidence.id}.${field}`);
        const supportingSources = evidence.sourceKeys.filter((sourceKey) => {
          const sourceClaimIds: readonly string[] =
            NATURAL_CLOCKS_SOURCE_MAP[sourceKey].claimIds;
          return sourceClaimIds.includes(claimId);
        });
        expect(
          supportingSources,
          `${claimId} must resolve through ${evidence.sourceKeys.join(", ")}`,
        ).not.toHaveLength(0);
      }
    }
  });

  it("uses the accessible NOAA varve dataset and preserves its claim boundary", () => {
    const packet = JSON.stringify(NATURAL_CLOCKS_SOURCES);
    const varveSource = NATURAL_CLOCKS_SOURCE_MAP["noaa-varve"];
    const varveEvidence = NATURAL_CLOCKS_EVIDENCE.find(
      (record) => record.id === "varved-lake-mud",
    );

    expect(packet).not.toContain(
      "metadata/landing-page/bin/iso?id=noaa-lake-14730",
    );
    expect(varveSource.url).toBe(
      "https://www.ncei.noaa.gov/pub/data/paleo/paleolimnology/europe/iceland/hvitarvatn2011-3varvethickness.txt",
    );
    expect(varveSource.citation).toContain(
      "doi:10.1016/j.quascirev.2011.05.026",
    );
    expect(varveSource.claimIds).toEqual(
      CLAIM_FIELDS.map((field) => `varved-lake-mud.${field}`),
    );
    expect(varveEvidence?.span.en).toBe("3,000-year Iceland example");
    expect(varveEvidence?.boundary.en).toBe(
      "only where annual laminae remain continuous",
    );
  });

  it("keeps coral and sediment claims inside their cited source boundaries", () => {
    const coral = NATURAL_CLOCKS_EVIDENCE.find(
      (record) => record.id === "coral",
    );
    const sediment = NATURAL_CLOCKS_EVIDENCE.find(
      (record) => record.id === "sediment-layers",
    );
    const boundedCopy = JSON.stringify([coral, sediment]);

    expect(boundedCopy).not.toContain("seasonal → monthly");
    expect(boundedCopy).not.toContain("季节到月度");
    expect(boundedCopy).not.toContain("stratigraphy + markers");
    expect(boundedCopy).not.toContain("地层与标志层");
    expect(boundedCopy).not.toContain("gaps and mixing can break continuity");
    expect(boundedCopy).not.toContain("缺层与扰动可打断连续性");

    expect(coral).toMatchObject({
      resolution: { en: "exact year + season", zh: "精确到年份与季节" },
      calibration: {
        en: "mark bands by year + season",
        zh: "按年份与季节标记条带",
      },
      boundary: {
        en: "banding may need X-ray imaging",
        zh: "条带有时需 X 射线成像",
      },
      sourceKeys: ["noaa-coral"],
    });
    expect(sediment).toMatchObject({
      mechanism: { en: "deposits in layers", zh: "逐层沉积" },
      resolution: { en: "varies by material", zh: "分辨率随材料而变" },
      span: { en: "time period varies", zh: "保存时段各不相同" },
      calibration: {
        en: "sample + analyze proxies",
        zh: "取样并分析代用指标",
      },
      boundary: {
        en: "reconstruction is site-specific",
        zh: "重建结果针对采样地点",
      },
      sourceKeys: ["usgs-archives"],
    });

    for (const [record, sourceKey] of [
      [coral, "noaa-coral"],
      [sediment, "usgs-archives"],
    ] as const) {
      expect(record).toBeDefined();
      for (const field of CLAIM_FIELDS) {
        expect(NATURAL_CLOCKS_SOURCE_MAP[sourceKey].claimIds).toContain(
          record?.claimIds[field],
        );
      }
    }
  });

  it("keeps seven claim-scoped media rows without turning the matrix into a rank", () => {
    expect(NATURAL_CLOCKS_EVIDENCE).toHaveLength(7);
    expect(NATURAL_CLOCKS_EVIDENCE.map((record) => record.id)).toEqual([
      "tree-rings",
      "coral",
      "ice-core",
      "sediment-layers",
      "cave-mineral",
      "varved-lake-mud",
      "pulsar-timing",
    ]);

    for (const record of NATURAL_CLOCKS_EVIDENCE) {
      expect(record.label.en.trim()).not.toBe("");
      expect(record.label.zh.trim()).not.toBe("");
      expect(record.resolution.en.trim()).not.toBe("");
      expect(record.span.en.trim()).not.toBe("");
      expect(record.calibration.en.trim()).not.toBe("");
      expect(record.boundary.en.trim()).not.toBe("");
      expect(record.sourceKeys.length).toBeGreaterThan(0);
    }

    expect(
      NATURAL_CLOCKS_EVIDENCE.find((record) => record.id === "sediment-layers")
        ?.resolution.en,
    ).toMatch(/varies by material/i);
    expect(
      NATURAL_CLOCKS_EVIDENCE.find((record) => record.id === "varved-lake-mud")
        ?.boundary.en,
    ).toMatch(/where annual laminae remain continuous/i);
    expect(
      NATURAL_CLOCKS_EVIDENCE.find((record) => record.id === "cave-mineral")
        ?.span.en,
    ).toMatch(/500,000-year calcite example/i);
    expect(
      NATURAL_CLOCKS_EVIDENCE.find((record) => record.id === "pulsar-timing")
        ?.boundary.en,
    ).toMatch(/not a material climate proxy/i);
  });

  it("keeps five bilingual scenes aligned to the 4-3-2-1-1 curve", () => {
    const english = getMetadata("en");
    const chinese = getMetadata("zh");

    expect(english.id).toBe("benchmark-matrix");
    expect(english.band).toBe("balanced-hybrid");
    expect(english.scenes.map((scene) => scene.id)).toEqual([1, 2, 3, 4, 5]);
    expect(chinese.scenes.map((scene) => scene.id)).toEqual([1, 2, 3, 4, 5]);
    expect(english.scenes.map((scene) => scene.beats.length)).toEqual([
      4, 3, 2, 1, 1,
    ]);
    expect(english.scenes.map((scene) => scene.beats.length)).toEqual(
      chinese.scenes.map((scene) => scene.beats.length),
    );
    expect(english.scenes[4].beats.map((beat) => beat.id)).toEqual([0]);

    for (const scene of english.scenes) {
      expect(scene.beats).toHaveLength(BEAT_COUNTS[scene.id]);
      for (const [index, beat] of scene.beats.entries()) {
        expect(beat.id).toBe(index);
        expect(beat.title.trim()).not.toBe("");
        expect(beat.body.trim()).not.toBe("");
      }
    }
  });

  it("renders every English and Chinese frame in a settled reserved layout", () => {
    for (const language of ["en", "zh"] as const) {
      for (let scene = 1; scene <= 5; scene += 1) {
        for (let beat = 0; beat < BEAT_COUNTS[scene]; beat += 1) {
          const view = renderStage({ language, scene, beat });
          expect(view.root()).not.toBeNull();
          expect(view.activePanel()).toHaveAttribute(
            "data-scene-id",
            String(scene),
          );
          expect(view.activePanel()).toHaveAttribute(
            "data-beat-layout-mode",
            "reserved",
          );
          expect(
            view.activePanel()?.querySelectorAll(
              '[data-beat-layout-item="true"]',
            ).length,
          ).toBeGreaterThanOrEqual(3);
          expect(view.activePanel()?.textContent?.trim().length).toBeGreaterThan(
            32,
          );
          view.unmount();
        }
      }
    }
  });

  it("applies all four authored scene-edge transitions", () => {
    const view = renderStage({ scene: 1 });
    const track = () =>
      view.container.querySelector<HTMLElement>(
        '[data-spatial-scene-track="true"]',
      );

    for (const [scene, kind] of [
      [2, "page-turn"],
      [3, "grid-reveal"],
      [4, "crossfade"],
      [5, "dip-to-color"],
    ] as const) {
      view.rerenderProps({ scene });
      expect(track()).toHaveAttribute("data-scene-transition-kind", kind);
    }
  });
});

describe("Natural Clocks visual boundary", () => {
  it("opens with seven original specimen silhouettes and never a winner", () => {
    const view = renderStage({ scene: 1, beat: 3 });
    expect(
      view.activePanel()?.querySelectorAll('[data-clock-specimen="true"]'),
    ).toHaveLength(7);
    expect(view.activePanel()).toHaveTextContent("not grades");
    expect(view.activePanel()).toHaveTextContent("different materials");
  });

  it("aligns source-bounded ranges without pretending every archive shares one resolution", () => {
    const view = renderStage({ scene: 3, beat: 1 });
    const records = view.activePanel()?.querySelectorAll(
      '[data-clock-range-row="true"]',
    );
    expect(records).toHaveLength(7);
    expect(view.activePanel()).toHaveTextContent("~2,000 yr");
    expect(view.activePanel()).toHaveTextContent("800,000 yr");
    expect(view.activePanel()).toHaveTextContent("varies by material");
    expect(view.activePanel()).toHaveTextContent("not a material climate proxy");
  });

  it("holds the fourth scene as a fair matrix with calibration and boundary columns", () => {
    const view = renderStage({ scene: 4, beat: 0 });
    expect(
      view.activePanel()?.querySelectorAll('[data-clock-matrix-row="true"]'),
    ).toHaveLength(7);
    expect(view.activePanel()).toHaveTextContent("Calibration");
    expect(view.activePanel()).toHaveTextContent("Boundary");
    expect(view.activePanel()).toHaveTextContent("No winner. No total.");
  });

  it("ends with one material record rather than a numerical verdict", () => {
    const view = renderStage({ scene: 5, beat: 0 });
    expect(
      view.activePanel()?.querySelector('[data-one-record="true"]'),
    ).not.toBeNull();
    expect(view.activePanel()).toHaveTextContent("A clock is material first.");
  });
});

describe("Natural Clocks navigation and settled modes", () => {
  it("renders a typographic clock taxonomy index with complete audit attributes", () => {
    const view = renderStage({ scene: 3 });
    const nav = view.root()?.querySelector<HTMLElement>(
      '[data-topic-navigation="true"]',
    );

    expect(nav).toHaveAttribute("data-navigation-geometry", "typographic-index");
    expect(nav).toHaveAttribute(
      "data-navigation-carrier",
      "clock-taxonomy-index",
    );
    expect(nav).toHaveAttribute("data-navigation-invocation", "auto-hide");
    expect(nav).toHaveAttribute(
      "data-navigation-feedback",
      "typographic-emphasis",
    );
    expect(within(nav!).getAllByRole("button")).toHaveLength(5);
    expect(nav?.querySelectorAll('[data-nav-state="active"]')).toHaveLength(1);
    expect(
      nav?.querySelectorAll('[data-clock-taxonomy-token="true"]'),
    ).toHaveLength(7);
  });

  it("supports ordinary click, tap, Space, Enter, and scene keys without stage leakage", () => {
    const onNavigate = vi.fn();
    const onStageClick = vi.fn();
    const onStageKeyDown = vi.fn();
    const view = renderStage(
      { scene: 2, onNavigate },
      onStageClick,
      onStageKeyDown,
    );
    const nav = view.root()?.querySelector<HTMLElement>(
      '[data-topic-navigation="true"]',
    );
    const ranges = within(nav!).getByRole("button", {
      name: "Scene 3: ranges",
    });

    fireEvent.pointerDown(ranges);
    fireEvent.click(ranges);
    expect(onNavigate).toHaveBeenLastCalledWith(3, 0);
    expect(onNavigate).toHaveBeenCalledTimes(1);
    expect(onStageClick).not.toHaveBeenCalled();

    const opening = within(nav!).getByRole("button", {
      name: "Scene 1: chorus",
    });
    fireEvent.keyDown(opening, { key: " " });
    expect(onNavigate).toHaveBeenLastCalledWith(1, 0);
    fireEvent.keyDown(opening, { key: "Enter" });
    expect(onNavigate).toHaveBeenLastCalledWith(1, 0);
    fireEvent.keyDown(opening, { key: "ArrowRight" });
    expect(onNavigate).toHaveBeenLastCalledWith(2, 0);
    fireEvent.keyDown(opening, { key: "End" });
    expect(onNavigate).toHaveBeenLastCalledWith(5, 0);
    fireEvent.keyDown(opening, { key: "Home" });
    expect(onNavigate).toHaveBeenLastCalledWith(1, 0);
    expect(onStageClick).not.toHaveBeenCalled();
    expect(onStageKeyDown).not.toHaveBeenCalled();
  });

  it("ignores repeat navigation keys and leaves container navigation isolated", () => {
    const onNavigate = vi.fn();
    const onStageKeyDown = vi.fn();
    const view = renderStage({ scene: 3, onNavigate }, vi.fn(), onStageKeyDown);
    const nav = view.root()?.querySelector<HTMLElement>(
      '[data-topic-navigation="true"]',
    );
    const active = within(nav!).getByRole("button", {
      name: "Scene 3: ranges",
    });

    fireEvent.keyDown(active, { key: "ArrowRight", repeat: true });
    fireEvent.keyDown(active, { key: " ", repeat: true });
    expect(onNavigate).not.toHaveBeenCalled();
    expect(onStageKeyDown).not.toHaveBeenCalled();
  });

  it("hides navigation in thumbnails and settles reduced-motion and frozen-like frames", () => {
    for (const overrides of [
      { isThumbnail: true, reducedMotion: false },
      { isThumbnail: false, reducedMotion: true },
    ]) {
      const view = renderStage({ scene: 3, beat: 1, ...overrides });
      expect(view.root()).toHaveAttribute("data-motion", "off");
      expect(
        view.container.querySelector('[data-spatial-scene-strip="true"]'),
      ).toHaveAttribute("data-reduced-motion", "true");
      if (overrides.isThumbnail) {
        expect(
          view.root()?.querySelector('[data-topic-navigation="true"]'),
        ).toBeNull();
      }
      expect(
        view.activePanel()?.querySelectorAll('[data-clock-range-row="true"]')
          .length,
      ).toBe(7);
      view.unmount();
    }
  });
});

describe("Natural Clocks stage hygiene", () => {
  it("uses the shared track, no clone lifecycle, no hotlinks, no loops, and stage-safe units", () => {
    const source = `${componentSource}\n${styleSource}`;
    expect(componentSource).toContain("<SpatialSceneTrack");
    expect(source).not.toMatch(
      /outgoingScene|isTransitionClone|data-transition-clone|setInterval|requestAnimationFrame/,
    );
    expect(source).not.toMatch(/animation[^;{]*infinite/);
    expect(componentSource).not.toMatch(/<img[^>]+https?:\/\//);
    expect(source).not.toMatch(
      /(?:^|[^a-z-])\d*\.?\d+(?:px|vw|vh|rem|em)\b/i,
    );
  });
});

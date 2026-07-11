import { fireEvent, render, waitFor, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { Source } from "../domain/evidence";
import type { TopicStageProps } from "../domain/topic";
import { runTopicContract } from "../testing/topic-contract";
import topic, {
  MOTH_EXPERIMENT_CLAIMS,
  MOTH_EXPERIMENT_SCENE_CLAIMS,
  MOTH_EXPERIMENT_SOURCES,
  MOTH_EXPERIMENT_TRANSITION_SCORE,
  type MothExperimentClaim,
  type MothExperimentClaimId,
  type MothExperimentSourceId,
} from "./moth-experiment";
import styleClasses from "./moth-experiment.module.css";
import componentSource from "./moth-experiment.tsx?raw";

runTopicContract(topic);

const runtimeProcess = (
  globalThis as typeof globalThis & {
    process: { getBuiltinModule: (name: "node:fs") => unknown };
  }
).process;
const { readFileSync } = runtimeProcess.getBuiltinModule("node:fs") as {
  readFileSync: (path: string, encoding: "utf8") => string;
};
const cssSource = readFileSync(
  "src/topics/moth-experiment.module.css",
  "utf8",
);

const BEAT_COUNTS: Record<number, number> = {
  1: 2,
  2: 4,
  3: 1,
  4: 3,
  5: 1,
};

const EXPECTED_SOURCE_URLS: Record<MothExperimentSourceId, string> = {
  "kettlewell-1955": "https://www.nature.com/articles/hdy195536",
  "majerus-cook-2012":
    "https://royalsocietypublishing.org/doi/10.1098/rsbl.2011.1136",
  "nhm-frequency-overview":
    "https://www.nhm.ac.uk/discover/rainbow-nature-life-in-black-and-white.html",
  "cook-saccheri-2013-review":
    "https://www.nature.com/articles/hdy201292",
};

const EXPECTED_SOURCE_CLAIMS: Record<
  MothExperimentSourceId,
  readonly MothExperimentClaimId[]
> = {
  "kettlewell-1955": ["background-predation-field-test"],
  "majerus-cook-2012": [
    "method-design-caveats",
    "majerus-six-year-replication",
  ],
  "nhm-frequency-overview": ["historical-frequency-shift"],
  "cook-saccheri-2013-review": [
    "background-predation-field-test",
    "historical-frequency-shift",
    "method-design-caveats",
    "majerus-six-year-replication",
    "bounded-selection-inference",
  ],
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
}: {
  props: TopicStageProps;
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
      <topic.Stage {...props} />
    </div>
  );
}

function renderStage(
  overrides: Partial<TopicStageProps> = {},
  onStageClick = vi.fn(),
) {
  const props = { ...BASE_PROPS, onNavigate: vi.fn(), ...overrides };
  const result = render(<StageFrame props={props} onStageClick={onStageClick} />);
  const root = () =>
    result.container.querySelector<HTMLElement>('[data-topic-id="moth-experiment"]');
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
        <StageFrame props={{ ...props, ...next }} onStageClick={onStageClick} />,
      );
    },
  };
}

describe("Magazine Masthead: moth experiment — topic contract", () => {
  it("exports the locked topic, specimen-card navigation, and authored score", () => {
    expect(topic.id).toBe("moth-experiment");
    expect(topic.title).toEqual({
      en: "Moth Experiment",
      zh: "桦尺蛾实验",
    });
    expect(topic.modelId).toBe("GPT 5.6 Sol");
    expect(topic.navigation).toEqual({
      geometry: "card-miniature",
      carrier: "moth-specimen-cards",
      invocation: "auto-hide",
      feedback: "material-color-change",
    });
    expect(topic.evidence).toEqual({
      kind: "facts",
      sources: MOTH_EXPERIMENT_SOURCES,
    });
    expect(topic.transitionScore).toBe(
      MOTH_EXPERIMENT_TRANSITION_SCORE,
    );
    expect(MOTH_EXPERIMENT_TRANSITION_SCORE).toEqual({
      "1->2": "iris-open",
      "2->3": "crossfade",
      "3->4": "focus-swap",
      "4->5": "iris-open",
    });
  });

  it("ships stable source ids, verified URLs, claim ids, and explicit boundaries", () => {
    expect(MOTH_EXPERIMENT_SOURCES.map((source) => source.id)).toEqual([
      "kettlewell-1955",
      "majerus-cook-2012",
      "nhm-frequency-overview",
      "cook-saccheri-2013-review",
    ]);

    for (const source of MOTH_EXPERIMENT_SOURCES) {
      const typedSource: Source = source;
      expect(source.url).toBe(EXPECTED_SOURCE_URLS[source.id]);
      expect(source.claimIds).toEqual(EXPECTED_SOURCE_CLAIMS[source.id]);
      expect(new Set(source.claimIds).size).toBe(source.claimIds.length);
      expect(source.authority?.trim().length).toBeGreaterThan(8);
      expect(source.title?.trim().length).toBeGreaterThan(20);
      expect(source.citation.trim().length).toBeGreaterThan(45);
      expect(source.supports.trim().length).toBeGreaterThan(80);
      expect(source.boundary.trim().length).toBeGreaterThan(80);
      expect(source.shortLabel.en.trim().length).toBeGreaterThan(7);
      expect(source.shortLabel.zh.trim().length).toBeGreaterThan(7);
      expect(typedSource.url).toBe(source.url);
    }

    const sourcesById = new Map(
      MOTH_EXPERIMENT_SOURCES.map((source) => [source.id, source]),
    );
    expect(sourcesById.get("majerus-cook-2012")?.supports).toMatch(/4,864/);
    expect(sourcesById.get("nhm-frequency-overview")?.supports).toMatch(/98%/);
    expect(sourcesById.get("cook-saccheri-2013-review")?.boundary).toMatch(
      /single photograph/i,
    );
  });

  it("resolves every claim, source, and scene link in both directions", () => {
    const sourcesById = new Map(
      MOTH_EXPERIMENT_SOURCES.map((source) => [source.id, source]),
    );
    const claimEntries = Object.entries(MOTH_EXPERIMENT_CLAIMS) as Array<
      [MothExperimentClaimId, MothExperimentClaim]
    >;

    expect(claimEntries.map(([claimId]) => claimId)).toEqual([
      "background-predation-field-test",
      "historical-frequency-shift",
      "method-design-caveats",
      "majerus-six-year-replication",
      "bounded-selection-inference",
    ]);

    for (const [claimId, claim] of claimEntries) {
      expect(claim.id).toBe(claimId);
      expect(claim.sourceIds.length).toBeGreaterThan(0);
      expect(new Set(claim.sourceIds).size).toBe(claim.sourceIds.length);
      expect(Object.keys(claim.visibleByScene).length).toBeGreaterThan(0);
      for (const sourceId of claim.sourceIds) {
        expect(sourcesById.get(sourceId)?.claimIds).toContain(claimId);
      }
      for (const localizedFragment of Object.values(claim.visibleByScene)) {
        expect(localizedFragment?.en.trim()).not.toBe("");
        expect(localizedFragment?.zh.trim()).not.toBe("");
      }
    }

    for (const source of MOTH_EXPERIMENT_SOURCES) {
      for (const claimId of source.claimIds) {
        expect(MOTH_EXPERIMENT_CLAIMS[claimId].sourceIds).toContain(source.id);
      }
    }

    for (const scene of [1, 2, 3, 4, 5] as const) {
      const claimsVisibleInRegistry = claimEntries
        .filter(([, claim]) => claim.visibleByScene[scene] !== undefined)
        .map(([claimId]) => claimId);
      expect(MOTH_EXPERIMENT_SCENE_CLAIMS[scene]).toEqual(
        claimsVisibleInRegistry,
      );
    }
  });

  it("keeps EN and ZH metadata aligned to the 2/4/1/3/1 curve", () => {
    const en = topic.metadata.en;
    const zh = topic.metadata.zh;

    expect(topic.styleId).toBe("magazine-masthead");
    expect(en.heroScene).toBe(1);
    expect(en.scenes.map((scene) => scene.beats.length)).toEqual([
      2, 4, 1, 3, 1,
    ]);
    expect(zh.scenes.map((scene) => scene.beats.length)).toEqual([
      2, 4, 1, 3, 1,
    ]);
    expect(en.scenes[4].beats.map((beat) => beat.id)).toEqual([0]);
    expect(zh.scenes[4].beats.map((beat) => beat.id)).toEqual([0]);

    for (const metadata of [en, zh]) {
      expect(metadata.scenes.map((scene) => scene.id)).toEqual([1, 2, 3, 4, 5]);
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

describe("Magazine Masthead: moth experiment — reading evidence", () => {
  it("renders every beat in both languages with five distinct editorial compositions", () => {
    for (const language of ["en", "zh"] as const) {
      const compositions = new Set<string>();
      for (let scene = 1; scene <= 5; scene += 1) {
        for (let beat = 0; beat < BEAT_COUNTS[scene]; beat += 1) {
          const view = renderStage({ language, scene, beat });
          expect(view.root()).not.toBeNull();
          expect(view.activePanel()).toHaveAttribute("data-scene-id", String(scene));
          expect(view.activePanel()?.textContent?.trim().length).toBeGreaterThan(100);
          expect(view.activePanel()).toHaveAttribute(
            "data-beat-layout-container",
            "true",
          );
          expect(view.activePanel()).toHaveAttribute(
            "data-beat-layout-mode",
            "reserved",
          );
          const composition = view.activePanel()?.querySelector<HTMLElement>(
            "[data-composition]",
          )?.dataset.composition;
          expect(composition).toBeDefined();
          compositions.add(composition!);
          view.unmount();
        }
      }
      expect(compositions.size).toBe(5);
    }
  });

  it("renders each visible claim with its explicit scene-local source mapping", () => {
    expect(componentSource).not.toMatch(/\bS[1-4](?:\b|–)/);

    for (const language of ["en", "zh"] as const) {
      for (const scene of [1, 2, 3, 4, 5] as const) {
        const view = renderStage({
          language,
          scene,
          beat: BEAT_COUNTS[scene] - 1,
          reducedMotion: true,
        });
        const claimIds: readonly MothExperimentClaimId[] =
          MOTH_EXPERIMENT_SCENE_CLAIMS[scene];
        const expectedSourceIds = MOTH_EXPERIMENT_SOURCES.filter((source) => {
          const sourceClaimIds: readonly MothExperimentClaimId[] =
            source.claimIds;
          return claimIds.some((claimId) => sourceClaimIds.includes(claimId));
        }).map((source) => source.id);
        const expectedClaimSourceLinks = claimIds
          .map(
            (claimId) =>
              `${claimId}:${MOTH_EXPERIMENT_CLAIMS[claimId].sourceIds.join(",")}`,
          )
          .join(";");
        const sceneBody = view.activePanel()?.querySelector<HTMLElement>(
          '[data-visible-claim-ids]',
        );
        const trace = view.activePanel()?.querySelector<HTMLElement>(
          '[data-claim-source-map="true"]',
        );

        expect(sceneBody).toHaveAttribute(
          "data-visible-claim-ids",
          claimIds.join(" "),
        );
        expect(trace).toHaveAttribute("data-scene-id", String(scene));
        expect(trace).toHaveAttribute("data-claim-ids", claimIds.join(" "));
        expect(trace).toHaveAttribute(
          "data-source-ids",
          expectedSourceIds.join(" "),
        );
        expect(trace).toHaveAttribute(
          "data-claim-source-links",
          expectedClaimSourceLinks,
        );
        expect(
          Array.from(trace?.querySelectorAll<HTMLElement>("[data-source-id]") ?? []).map(
            (source) => source.dataset.sourceId,
          ),
        ).toEqual(expectedSourceIds);

        for (const claimId of claimIds) {
          const claim: MothExperimentClaim = MOTH_EXPERIMENT_CLAIMS[claimId];
          const visibleFragment =
            claim.visibleByScene[scene]?.[language];
          expect(visibleFragment).toBeDefined();
          expect(view.activePanel()).toHaveTextContent(visibleFragment!);
        }

        view.unmount();
      }
    }
  });

  it("keeps observation, method criticism, later improvement, and inference limits distinct", () => {
    const frequency = renderStage({ scene: 3, language: "en" });
    expect(frequency.activePanel()).toHaveTextContent("98% dark form");
    expect(frequency.activePanel()).toHaveTextContent(
      "not a controlled causal result",
    );
    frequency.unmount();

    const critique = renderStage({ scene: 4, beat: 2, language: "en" });
    expect(critique.activePanel()).toHaveTextContent(
      "inflated release density, tree-trunk placement",
    );
    expect(critique.activePanel()).toHaveTextContent("4,864 releases over six years");
    expect(critique.activePanel()).toHaveTextContent("one unpolluted site");
    expect(critique.activePanel()).toHaveTextContent(
      "not a hero-versus-villain story",
    );
    expect(critique.activePanel()).toHaveTextContent("not a morality play");
    critique.unmount();

    const closing = renderStage({ scene: 5, language: "en" });
    expect(closing.activePanel()).toHaveTextContent("A single photograph proves");
    expect(closing.activePanel()).toHaveTextContent(
      "Visual predation is the whole of evolution",
    );
    expect(closing.root()).toHaveAttribute("data-specimen-art", "drawn");
    expect(closing.activePanel()?.querySelector("img, video, canvas")).toBeNull();
  });
});

describe("Magazine Masthead: moth experiment — transitions and navigation", () => {
  it("renders the exact transition primitive on every forward edge", async () => {
    const view = renderStage({ scene: 1 });
    const track = () =>
      view.container.querySelector<HTMLElement>(
        '[data-spatial-scene-track="true"]',
      );

    for (const [scene, kind] of [
      [2, "iris-open"],
      [3, "crossfade"],
      [4, "focus-swap"],
      [5, "iris-open"],
    ] as const) {
      view.rerenderProps({ scene });
      await waitFor(() => {
        expect(track()).toHaveAttribute("data-scene-transition-kind", kind);
      });
    }
  });

  it("exposes five auto-hide specimen cards with material-color-change feedback", () => {
    const { root } = renderStage({ scene: 3 });
    const nav = root()?.querySelector<HTMLElement>(
      '[data-topic-navigation="true"]',
    );

    expect(nav).toHaveAttribute("data-navigation-geometry", "card-miniature");
    expect(nav).toHaveAttribute(
      "data-navigation-carrier",
      "moth-specimen-cards",
    );
    expect(nav).toHaveAttribute("data-navigation-invocation", "auto-hide");
    expect(nav).toHaveAttribute(
      "data-navigation-feedback",
      "material-color-change",
    );
    expect(nav).toHaveAttribute("data-auto-hide", "true");
    expect(within(nav!).getAllByRole("button")).toHaveLength(5);
    expect(
      within(nav!).getByRole("button", {
        name: "Open specimen card 3: frequency evidence",
      }),
    ).toHaveAttribute("aria-current", "page");
  });

  it("keeps click, tap, Space, Enter, repeat keys, and local controls isolated from the stage", () => {
    const onNavigate = vi.fn();
    const onStageClick = vi.fn();
    const { root } = renderStage({ scene: 1, onNavigate }, onStageClick);
    const nav = root()?.querySelector<HTMLElement>(
      '[data-topic-navigation="true"]',
    );
    const evidence = within(nav!).getByRole("button", {
      name: "Open specimen card 3: frequency evidence",
    });
    const margin = within(nav!).getByRole("button", {
      name: "Open specimen card 4: method margin",
    });
    const method = within(nav!).getByRole("button", {
      name: "Open specimen card 2: field method",
    });

    fireEvent.pointerDown(evidence);
    fireEvent.click(evidence);
    expect(onNavigate).toHaveBeenLastCalledWith(3, 0);
    expect(onStageClick).not.toHaveBeenCalled();

    fireEvent.keyDown(margin, { key: " " });
    expect(onNavigate).toHaveBeenLastCalledWith(4, 0);
    expect(onNavigate).toHaveBeenCalledTimes(2);

    fireEvent.keyDown(margin, { key: " ", repeat: true });
    expect(onNavigate).toHaveBeenCalledTimes(2);

    fireEvent.keyDown(method, { key: "Enter" });
    expect(onNavigate).toHaveBeenLastCalledWith(2, 0);
    expect(onNavigate).toHaveBeenCalledTimes(3);
    expect(onStageClick).not.toHaveBeenCalled();
  });

  it("hides navigation in thumbnails and settles thumbnail or frozen-compatible motion", () => {
    for (const props of [
      { isThumbnail: true, reducedMotion: false },
      { isThumbnail: false, reducedMotion: true },
    ]) {
      const { root, container, unmount } = renderStage({
        scene: 2,
        beat: 3,
        ...props,
        onNavigate: undefined,
      });
      expect(root()).toHaveAttribute("data-motion", "off");
      expect(
        container.querySelector('[data-spatial-scene-strip="true"]'),
      ).toHaveAttribute("data-reduced-motion", "true");
      if (props.isThumbnail) {
        expect(root()?.querySelector('[data-topic-navigation="true"]')).toBeNull();
      }
      unmount();
    }
  });
});

describe("Magazine Masthead: moth experiment — stage-local safety", () => {
  it("uses drawn specimen evidence and finite authored motion", () => {
    expect(componentSource).not.toMatch(/<img\b[^>]*https?:\/\//i);
    expect(componentSource).not.toMatch(/<img\b|<video\b|<canvas\b/i);
    expect(componentSource).not.toMatch(/setInterval|requestAnimationFrame/);
    expect(componentSource).not.toMatch(/outgoingScene|isTransitionClone/);
    expect(cssSource).not.toMatch(/animation[^;{]*infinite/i);
    expect(cssSource).not.toMatch(/linear-gradient|radial-gradient|box-shadow|border-radius/i);
  });

  it("keeps settled bilingual bodies on the root, track, scene, and data contract", () => {
    const compositions: Record<number, string> = {
      1: "cover-specimen",
      2: "method-spread",
      3: "frequency-evidence",
      4: "critique-margin",
      5: "revised-cover",
    };

    for (const language of ["en", "zh"] as const) {
      for (let scene = 1; scene <= 5; scene += 1) {
        const view = renderStage({
          scene,
          beat: BEAT_COUNTS[scene] - 1,
          language,
          reducedMotion: true,
        });
        const stage = view.getByTestId("stage");
        const root = view.root();
        const trackShell = root?.querySelector<HTMLElement>(
          `.${styleClasses.trackShell}`,
        );
        const track = trackShell?.querySelector<HTMLElement>(
          '[data-spatial-scene-track="true"]',
        );
        const panel = view.activePanel();
        const sceneLayer = panel?.querySelector<HTMLElement>(
          `[data-scene-content="${scene}"]`,
        );
        const sceneBody = sceneLayer?.querySelector<HTMLElement>(
          `.${styleClasses.scene}`,
        );
        const bodyText = sceneBody?.textContent?.replace(/\s+/g, " ").trim() ?? "";

        expect(root?.parentElement).toBe(stage);
        expect(root).toHaveClass(styleClasses.root);
        expect(root).toHaveAttribute("data-topic-id", "moth-experiment");
        expect(root).toHaveAttribute("data-style-id", "magazine-masthead");
        expect(root).toHaveAttribute("data-motion", "off");
        expect(root).toHaveAttribute("data-specimen-art", "drawn");

        expect(trackShell).toHaveClass(styleClasses.trackShell);
        expect(track).toHaveClass(styleClasses.track);
        expect(track).toHaveAttribute("data-active-scene", String(scene));
        expect(track).toHaveAttribute("data-spatial-scene-track", "true");
        expect(track).toHaveAttribute("data-scene-transition-kind", "hard-cut");

        expect(panel).toHaveAttribute("data-scene-id", String(scene));
        expect(panel).toHaveAttribute("data-active", "true");
        expect(panel).toHaveAttribute("data-beat-layout-container", "true");
        expect(panel).toHaveAttribute("data-beat-layout-mode", "reserved");
        expect(sceneLayer).toHaveClass(styleClasses.sceneLayer);
        expect(sceneLayer).toHaveAttribute("data-scene-content", String(scene));
        expect(sceneBody).toHaveClass(styleClasses.scene);
        expect(sceneBody).toHaveAttribute("data-composition", compositions[scene]);
        expect(sceneBody).toHaveAttribute("data-beat-layout-container", "true");
        expect(sceneBody).toHaveAttribute("data-beat-layout-mode", "reserved");
        expect(bodyText.length).toBeGreaterThan(100);
        expect(bodyText).not.toMatch(/\b(?:undefined|NaN)\b/);
        expect(
          root?.querySelectorAll(
            '[data-spatial-scene-panel="true"][data-active="true"]',
          ),
        ).toHaveLength(1);
        view.unmount();
      }
    }
  });

  it("enforces authored clipping and container units without JSDOM geometry claims", () => {
    const rootRule = cssSource.match(/(?:^|\n)\.root\s*\{([^}]*)\}/)?.[1];
    const trackShellRule = cssSource.match(
      /(?:^|\n)\.trackShell\s*\{([^}]*)\}/,
    )?.[1];
    const trackRule = cssSource.match(/(?:^|\n)\.track\s*\{([^}]*)\}/)?.[1];
    const sceneRules = [...cssSource.matchAll(/(?:^|\n)\.scene\s*\{([^}]*)\}/g)].map(
      (match) => match[1],
    );
    const sceneLayoutRule = sceneRules.find((rule) =>
      /overflow:\s*hidden\s*;/.test(rule),
    );
    const forbiddenStageUnit =
      /(?:^|[^a-z-])\d*\.?\d+(?:px|vw|vh|rem|em)\b/i;

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

    expect(trackRule).toMatch(/width:\s*100%\s*;/);
    expect(trackRule).toMatch(/height:\s*100%\s*;/);
    expect(cssSource).toMatch(
      /\.sceneLayer,\s*\.scene\s*\{[^}]*width:\s*100%\s*;[^}]*height:\s*100%\s*;/,
    );
    expect(sceneLayoutRule).toMatch(/position:\s*relative\s*;/);
    expect(sceneLayoutRule).toMatch(/overflow:\s*hidden\s*;/);
    expect(sceneLayoutRule).toMatch(/padding:\s*[^;]*cqh[^;]*cqw[^;]*;/);

    expect(cssSource).toMatch(/\d*\.?\d+cqw\b/i);
    expect(cssSource).toMatch(/\d*\.?\d+cqh\b/i);
    expect(cssSource).not.toMatch(/position:\s*fixed\b/i);
    expect(componentSource).not.toMatch(forbiddenStageUnit);
    expect(cssSource).not.toMatch(forbiddenStageUnit);
  });
});

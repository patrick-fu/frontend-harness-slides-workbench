import { fireEvent, render, waitFor, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { Source } from "../domain/evidence";
import type { TopicStageProps } from "../domain/topic";
import { runTopicContract } from "../testing/topic-contract";
import topic, {
  EGG_MIMICRY_CLAIMS,
  EGG_MIMICRY_SCENE_CLAIMS,
  EGG_MIMICRY_SOURCES,
  EGG_MIMICRY_TRANSITION_SCORE,
  type EggMimicryClaim,
  type EggMimicryClaimId,
  type EggMimicrySourceId,
} from "./egg-mimicry";
import styleClasses from "./egg-mimicry.module.css";
import componentSource from "./egg-mimicry.tsx?raw";

runTopicContract(topic);

const { Stage } = topic;
const metadataFor = (language: "en" | "zh") => topic.metadata[language];

const runtimeProcess = (
  globalThis as typeof globalThis & {
    process: { getBuiltinModule: (name: "node:fs") => unknown };
  }
).process;
const { readFileSync } = runtimeProcess.getBuiltinModule("node:fs") as {
  readFileSync: (path: string, encoding: "utf8") => string;
};
const cssSource = readFileSync(
  "src/topics/egg-mimicry.module.css",
  "utf8",
);

const BEAT_COUNTS: Record<number, number> = {
  1: 4,
  2: 1,
  3: 2,
  4: 2,
  5: 1,
};

const EXPECTED_SOURCE_URLS: Record<EggMimicrySourceId, string> = {
  "abolins-abols-2019": "https://pubmed.ncbi.nlm.nih.gov/31283976/",
  "moskat-2010": "https://pubmed.ncbi.nlm.nih.gov/20472785/",
  "cherry-bennett-moskat-2007": "https://pubmed.ncbi.nlm.nih.gov/17465931/",
  "honza-et-al-2014": "https://pmc.ncbi.nlm.nih.gov/articles/PMC3843844/",
};

const NATIVE_TOUCH_PHASES = [
  "touchstart",
  "touchmove",
  "touchend",
  "touchcancel",
] as const;

type NativeTouchPhase = (typeof NATIVE_TOUCH_PHASES)[number];

function dispatchNativeTouch(target: EventTarget, phase: NativeTouchPhase) {
  target.dispatchEvent(
    new window.TouchEvent(phase, {
      bubbles: true,
      cancelable: true,
      composed: true,
    }),
  );
}

function installNativeTouchProbes(stage: HTMLElement) {
  const stageListener = vi.fn();
  const windowListener = vi.fn();

  for (const phase of NATIVE_TOUCH_PHASES) {
    stage.addEventListener(phase, stageListener);
    window.addEventListener(phase, windowListener);
  }

  return {
    stageListener,
    windowListener,
    cleanup() {
      for (const phase of NATIVE_TOUCH_PHASES) {
        stage.removeEventListener(phase, stageListener);
        window.removeEventListener(phase, windowListener);
      }
    },
  };
}

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
      <Stage {...props} />
    </div>
  );
}

function renderStage(
  overrides: Partial<TopicStageProps> = {},
  onStageClick = vi.fn(),
) {
  let currentProps = { ...BASE_PROPS, onNavigate: vi.fn(), ...overrides };
  const result = render(
    <StageFrame
      props={currentProps}
      onStageClick={onStageClick}
    />,
  );
  const root = () =>
    result.container.querySelector<HTMLElement>('[data-topic-id="egg-mimicry"]');
  const activePanel = () =>
    result.container.querySelector<HTMLElement>(
      '[data-spatial-scene-panel="true"][data-active="true"]',
    );

  return {
    ...result,
    root,
    activePanel,
    onNavigate: currentProps.onNavigate as ReturnType<typeof vi.fn>,
    rerenderProps(next: Partial<TopicStageProps>) {
      currentProps = { ...currentProps, ...next };
      result.rerender(
        <StageFrame
          props={currentProps}
          onStageClick={onStageClick}
        />,
      );
    },
  };
}

describe("Arcade Boss Fight: egg mimicry — topic contract", () => {
  it("exports the locked topic, nest-map navigation, and authored score", () => {
    expect(topic.id).toBe("egg-mimicry");
    expect(topic.title).toEqual({
      en: "Egg Mimicry",
      zh: "卵拟态",
    });
    expect(topic.modelId).toBe("GPT 5.6 Sol");
    expect(topic.navigation).toEqual({
      geometry: "spatial-node",
      carrier: "nest-map",
      invocation: "keyboard-focus",
      feedback: "geometry-reflow",
    });
    expect(topic.evidence).toEqual({ kind: "facts", sources: EGG_MIMICRY_SOURCES });
    expect(topic.transitionScore).toBe(EGG_MIMICRY_TRANSITION_SCORE);
    expect(EGG_MIMICRY_TRANSITION_SCORE).toEqual({
      "1->2": "push-x",
      "2->3": "glitch",
      "3->4": "split-merge",
      "4->5": "push-x",
    });
  });

  it("ships four authoritative HTTPS sources with readable scope boundaries", () => {
    expect(EGG_MIMICRY_SOURCES.map((source) => source.id)).toEqual([
      "abolins-abols-2019",
      "moskat-2010",
      "cherry-bennett-moskat-2007",
      "honza-et-al-2014",
    ]);

    for (const source of EGG_MIMICRY_SOURCES) {
      const typedSource: Source = source;
      expect(source.url).toBe(EXPECTED_SOURCE_URLS[source.id]);
      expect(new URL(source.url).protocol).toBe("https:");
      expect(source.accessDate).toBe("2026-07-10");
      expect(source.accessDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(source.authority?.trim().length).toBeGreaterThan(8);
      expect(source.title?.trim().length).toBeGreaterThan(30);
      expect(source.citation.trim().length).toBeGreaterThan(75);
      expect(source.supports.trim().length).toBeGreaterThan(150);
      expect(source.boundary.trim().length).toBeGreaterThan(120);
      expect(source.shortLabel.en.trim().length).toBeGreaterThan(8);
      expect(source.shortLabel.zh.trim().length).toBeGreaterThan(6);
      expect(source.claimIds.length).toBeGreaterThan(0);
      expect(typedSource.url).toBe(source.url);
    }
  });

  it("resolves reciprocal claim_id ↔ source_id links and scene-local fragments", () => {
    const sourcesById = new Map(
      EGG_MIMICRY_SOURCES.map((source) => [source.id, source]),
    );
    const claimEntries = Object.entries(EGG_MIMICRY_CLAIMS) as Array<
      [EggMimicryClaimId, EggMimicryClaim]
    >;

    expect(claimEntries.map(([claimId]) => claimId)).toEqual([
      "apaj-field-protocol",
      "colour-gradient-response",
      "recognition-error-cost",
      "within-population-matching",
      "arms-race-boundary",
    ]);

    for (const [claimId, claim] of claimEntries) {
      expect(claim.id).toBe(claimId);
      expect(claim.sourceIds.length).toBeGreaterThan(0);
      expect(new Set(claim.sourceIds).size).toBe(claim.sourceIds.length);
      expect(Object.keys(claim.visibleByScene).length).toBeGreaterThan(0);
      for (const sourceId of claim.sourceIds) {
        expect(sourcesById.get(sourceId)?.claimIds).toContain(claimId);
      }
      for (const fragment of Object.values(claim.visibleByScene)) {
        expect(fragment?.en.trim()).not.toBe("");
        expect(fragment?.zh.trim()).not.toBe("");
      }
    }

    for (const source of EGG_MIMICRY_SOURCES) {
      for (const claimId of source.claimIds) {
        const claim: EggMimicryClaim = EGG_MIMICRY_CLAIMS[claimId];
        expect(claim.sourceIds).toContain(source.id);
      }
    }

    for (const scene of [1, 2, 3, 4, 5] as const) {
      const visibleClaimIds = claimEntries
        .filter(([, claim]) => claim.visibleByScene[scene] !== undefined)
        .map(([claimId]) => claimId);
      expect(EGG_MIMICRY_SCENE_CLAIMS[scene]).toEqual(visibleClaimIds);
    }
  });

  it("keeps EN and ZH metadata aligned to the 4/1/2/2/1 curve", () => {
    const en = metadataFor("en");
    const zh = metadataFor("zh");

    expect(topic.styleId).toBe("arcade-boss-fight");
    expect(en.heroScene).toBe(4);
    expect(en.scenes.map((scene) => scene.beats.length)).toEqual([4, 1, 2, 2, 1]);
    expect(zh.scenes.map((scene) => scene.beats.length)).toEqual([4, 1, 2, 2, 1]);

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

describe("Arcade Boss Fight: egg mimicry — bilingual frame coverage", () => {
  it("renders every beat in both languages with five distinct compositions", () => {
    for (const language of ["en", "zh"] as const) {
      const compositions = new Set<string>();
      for (let scene = 1; scene <= 5; scene += 1) {
        for (let beat = 0; beat < BEAT_COUNTS[scene]; beat += 1) {
          const view = renderStage({ language, scene, beat });
          const panel = view.activePanel();
          expect(view.root()).not.toBeNull();
          expect(panel).toHaveAttribute("data-scene-id", String(scene));
          expect(panel).toHaveAttribute("data-beat-layout-container", "true");
          expect(panel).toHaveAttribute("data-beat-layout-mode", "reserved");
          expect(panel?.textContent?.replace(/\s+/g, " ").trim().length).toBeGreaterThan(
            160,
          );
          const composition = panel?.querySelector<HTMLElement>(
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

  it("renders every visible research fragment with a parseable scene-local source stamp", () => {
    for (const language of ["en", "zh"] as const) {
      for (const scene of [1, 2, 3, 4, 5] as const) {
        const view = renderStage({
          language,
          scene,
          beat: BEAT_COUNTS[scene] - 1,
          reducedMotion: true,
        });
        const panel = view.activePanel();
        const claimIds: readonly EggMimicryClaimId[] = EGG_MIMICRY_SCENE_CLAIMS[scene];
        const expectedSourceIds = EGG_MIMICRY_SOURCES.filter((source) => {
          const sourceClaimIds: readonly EggMimicryClaimId[] = source.claimIds;
          return claimIds.some((claimId) => sourceClaimIds.includes(claimId));
        }).map((source) => source.id);
        const expectedLinks = claimIds
          .map((claimId) => {
            const claim: EggMimicryClaim = EGG_MIMICRY_CLAIMS[claimId];
            return `${claimId}:${claim.sourceIds.join(",")}`;
          })
          .join(";");
        const sceneBody = panel?.querySelector<HTMLElement>(
          "[data-visible-claim-ids]",
        );
        const stamp = panel?.querySelector<HTMLElement>(
          '[data-claim-source-map="true"]',
        );

        expect(sceneBody).toHaveAttribute(
          "data-visible-claim-ids",
          claimIds.join(" "),
        );
        expect(stamp).toHaveAttribute("data-scene-id", String(scene));
        expect(stamp).toHaveAttribute("data-claim-ids", claimIds.join(" "));
        expect(stamp).toHaveAttribute("data-source-ids", expectedSourceIds.join(" "));
        expect(stamp).toHaveAttribute("data-claim-source-links", expectedLinks);
        expect(
          Array.from(stamp?.querySelectorAll<HTMLElement>("[data-source-id]") ?? []).map(
            (source) => source.dataset.sourceId,
          ),
        ).toEqual(expectedSourceIds);

        for (const claimId of claimIds) {
          const claim: EggMimicryClaim = EGG_MIMICRY_CLAIMS[claimId];
          const fragment = claim.visibleByScene[scene]?.[language];
          expect(fragment).toBeDefined();
          expect(panel).toHaveTextContent(fragment!);
        }

        for (const sourceId of expectedSourceIds) {
          const source = EGG_MIMICRY_SOURCES.find(
            (candidate) => candidate.id === sourceId,
          );
          const link = stamp?.querySelector<HTMLAnchorElement>(
            `[data-source-id="${sourceId}"]`,
          );
          expect(link).toHaveAttribute("href", source?.url);
        }
        view.unmount();
      }
    }
  });
});

describe("Arcade Boss Fight: egg mimicry — transitions and beat discipline", () => {
  it("uses the exact transition primitive on every forward scene edge", async () => {
    const view = renderStage({ scene: 1 });
    const track = () =>
      view.container.querySelector<HTMLElement>(
        '[data-spatial-scene-track="true"]',
      );

    for (const [scene, transition] of [
      [2, "push-x"],
      [3, "glitch"],
      [4, "split-merge"],
      [5, "push-x"],
    ] as const) {
      view.rerenderProps({ scene });
      await waitFor(() => {
        expect(track()).toHaveAttribute("data-scene-transition-kind", transition);
      });
    }
    view.unmount();
  });

  it("keeps multi-beat space reserved instead of removing or reflowing slots", () => {
    const view = renderStage({ scene: 1, beat: 0, reducedMotion: true });
    const opening = () =>
      view.activePanel()?.querySelector<HTMLElement>(
        '[data-composition="cold-open-nest"]',
      );
    expect(opening()).toHaveAttribute("data-beat-layout-mode", "reserved");
    const reservedItemCount =
      opening()?.querySelectorAll('[data-beat-layout-item="true"]').length ?? 0;
    expect(reservedItemCount).toBeGreaterThan(6);
    expect(opening()?.querySelectorAll('[data-beat-visible="false"]')).toHaveLength(4);

    view.rerenderProps({ beat: 3 });
    expect(opening()).toHaveAttribute("data-beat-layout-mode", "reserved");
    expect(
      opening()?.querySelectorAll('[data-beat-layout-item="true"]'),
    ).toHaveLength(reservedItemCount);
    expect(opening()?.querySelectorAll('[data-beat-visible="true"]')).toHaveLength(4);
    view.unmount();
  });

  it("uses static generation sprites for reduced motion and thumbnail frames", () => {
    for (const props of [
      { reducedMotion: true, isThumbnail: false },
      { reducedMotion: false, isThumbnail: true },
    ]) {
      const view = renderStage({ scene: 4, beat: 1, ...props });
      const panel = view.activePanel();
      expect(view.root()).toHaveAttribute("data-motion", "off");
      expect(
        view.container.querySelector('[data-spatial-scene-strip="true"]'),
      ).toHaveAttribute("data-reduced-motion", "true");
      expect(panel?.querySelector('[data-generation-mode="static"]')).not.toBeNull();
      expect(panel?.querySelectorAll('[data-static-generation-sprite="true"]')).toHaveLength(3);
      if (props.isThumbnail) {
        expect(view.root()?.querySelector('[data-topic-navigation="true"]')).toBeNull();
      }
      view.unmount();
    }
  });
});

describe("Arcade Boss Fight: egg mimicry — nest-map navigation", () => {
  it("exposes five spatial nodes, focus invocation, and geometry reflow", () => {
    const view = renderStage({ scene: 3 });
    const nav = view.root()?.querySelector<HTMLElement>(
      '[data-topic-navigation="true"]',
    );

    expect(nav).toHaveAttribute("data-navigation-geometry", "spatial-node");
    expect(nav).toHaveAttribute("data-navigation-carrier", "nest-map");
    expect(nav).toHaveAttribute("data-navigation-invocation", "keyboard-focus");
    expect(nav).toHaveAttribute("data-navigation-feedback", "geometry-reflow");
    expect(nav).toHaveAttribute("data-geometry-reflow", "true");
    expect(nav).toHaveAttribute("data-native-touch-isolation", "capture");
    expect(within(nav!).getAllByRole("button")).toHaveLength(5);
    expect(
      within(nav!).getByRole("button", {
        name: "Focus nest node 3: decision costs",
      }),
    ).toHaveAttribute("aria-current", "page");
    view.unmount();
  });

  it("uses absolute click, keyboard, pointer, and four-phase native-touch-safe navigation", () => {
    const onStageClick = vi.fn();
    const onNavigate = vi.fn();
    const view = renderStage({ scene: 1, onNavigate }, onStageClick);
    const nav = view.root()?.querySelector<HTMLElement>(
      '[data-topic-navigation="true"]',
    );
    const sceneFour = within(nav!).getByRole("button", {
      name: "Focus nest node 4: generation sprites",
    });
    const sceneThree = within(nav!).getByRole("button", {
      name: "Focus nest node 3: decision costs",
    });

    fireEvent.pointerDown(sceneFour);
    const probes = installNativeTouchProbes(view.getByTestId("stage"));
    try {
      for (const phase of NATIVE_TOUCH_PHASES) {
        dispatchNativeTouch(sceneFour, phase);
      }
      expect(probes.stageListener).not.toHaveBeenCalled();
      expect(probes.windowListener).not.toHaveBeenCalled();
    } finally {
      probes.cleanup();
    }
    fireEvent.click(sceneFour);
    expect(onNavigate).toHaveBeenLastCalledWith(4, 0);
    expect(onStageClick).not.toHaveBeenCalled();

    fireEvent.keyDown(sceneThree, { key: "Enter" });
    expect(onNavigate).toHaveBeenLastCalledWith(3, 0);
    fireEvent.keyDown(sceneThree, { key: "ArrowRight" });
    expect(onNavigate).toHaveBeenLastCalledWith(4, 0);
    fireEvent.keyDown(sceneThree, { key: "End" });
    expect(onNavigate).toHaveBeenLastCalledWith(5, 0);
    fireEvent.keyDown(sceneThree, { key: " ", repeat: true });
    expect(onNavigate).toHaveBeenCalledTimes(4);
    expect(onStageClick).not.toHaveBeenCalled();
    view.unmount();
  });

  it("isolates all native touch phases on source links from stage and window", () => {
    const onStageClick = vi.fn();
    const view = renderStage({ scene: 1, beat: 3 }, onStageClick);
    const sourceLinks = view.activePanel()?.querySelector<HTMLElement>(
      '[data-source-link-container="true"]',
    );
    const sourceLink = within(sourceLinks!).getAllByRole("link")[0];

    expect(sourceLinks).toHaveAttribute("data-native-touch-isolation", "capture");
    const probes = installNativeTouchProbes(view.getByTestId("stage"));
    try {
      for (const phase of NATIVE_TOUCH_PHASES) {
        dispatchNativeTouch(sourceLink, phase);
      }
      expect(probes.stageListener).not.toHaveBeenCalled();
      expect(probes.windowListener).not.toHaveBeenCalled();
    } finally {
      probes.cleanup();
    }

    fireEvent.pointerDown(sourceLink);
    fireEvent.click(sourceLink);
    expect(onStageClick).not.toHaveBeenCalled();
    view.unmount();
  });

  it("removes native touch capture listeners from both boundaries on unmount", () => {
    const view = renderStage({ scene: 1, beat: 3 });
    const nav = view.root()?.querySelector<HTMLElement>(
      '[data-topic-navigation="true"]',
    );
    const sourceLinks = view.activePanel()?.querySelector<HTMLElement>(
      '[data-source-link-container="true"]',
    );
    expect(nav).not.toBeNull();
    expect(sourceLinks).not.toBeNull();

    view.unmount();
    const host = document.createElement("div");
    document.body.append(host);
    host.append(nav!, sourceLinks!);
    const windowListener = vi.fn();
    for (const phase of NATIVE_TOUCH_PHASES) {
      window.addEventListener(phase, windowListener);
    }

    try {
      for (const phase of NATIVE_TOUCH_PHASES) {
        dispatchNativeTouch(nav!, phase);
        dispatchNativeTouch(sourceLinks!, phase);
      }
      expect(windowListener).toHaveBeenCalledTimes(NATIVE_TOUCH_PHASES.length * 2);
    } finally {
      for (const phase of NATIVE_TOUCH_PHASES) {
        window.removeEventListener(phase, windowListener);
      }
      host.remove();
    }
  });
});

describe("Arcade Boss Fight: egg mimicry — stage-local safety", () => {
  it("uses original finite pixel art and avoids prohibited boss-fight defaults", () => {
    expect(componentSource).not.toMatch(/<img\b[^>]*https?:\/\//i);
    expect(componentSource).not.toMatch(/<img\b|<video\b|<canvas\b/i);
    expect(componentSource).not.toMatch(/setInterval|requestAnimationFrame/);
    expect(componentSource).not.toMatch(/outgoingScene|isTransitionClone/);
    expect(componentSource).not.toMatch(/\bHP\b|victory|death|revive|emoji/i);
    expect(cssSource).not.toMatch(/animation[^;{]*infinite/i);
  });

  it("keeps settled EN and ZH frames inside the root, track, and reserved-layout contract", () => {
    const compositions: Record<number, string> = {
      1: "cold-open-nest",
      2: "pattern-comparison",
      3: "decision-rule-panel",
      4: "generation-sprite-loop",
      5: "continuation-boundary-screen",
    };

    for (const language of ["en", "zh"] as const) {
      for (let scene = 1; scene <= 5; scene += 1) {
        const view = renderStage({
          language,
          scene,
          beat: BEAT_COUNTS[scene] - 1,
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
          `[data-composition="${compositions[scene]}"]`,
        );
        const bodyText = sceneBody?.textContent?.replace(/\s+/g, " ").trim() ?? "";

        expect(root?.parentElement).toBe(stage);
        expect(root).toHaveClass(styleClasses.root);
        expect(root).toHaveAttribute("data-topic-id", "egg-mimicry");
        expect(root).toHaveAttribute("data-style-id", "arcade-boss-fight");
        expect(root).toHaveAttribute("data-motion", "off");
        expect(root).toHaveAttribute("data-pixel-art", "original");
        expect(trackShell).toHaveClass(styleClasses.trackShell);
        expect(track).toHaveClass(styleClasses.track);
        expect(track).toHaveAttribute("data-active-scene", String(scene));
        expect(track).toHaveAttribute("data-spatial-scene-track", "true");
        expect(panel).toHaveAttribute("data-scene-id", String(scene));
        expect(panel).toHaveAttribute("data-active", "true");
        expect(panel).toHaveAttribute("data-beat-layout-container", "true");
        expect(panel).toHaveAttribute("data-beat-layout-mode", "reserved");
        expect(sceneLayer).toHaveClass(styleClasses.sceneLayer);
        expect(sceneBody).toHaveClass(styleClasses.scene);
        expect(sceneBody).toHaveAttribute("data-beat-layout-container", "true");
        expect(sceneBody).toHaveAttribute("data-beat-layout-mode", "reserved");
        expect(bodyText.length).toBeGreaterThan(160);
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

  it("enforces stage containment and container units without JSDOM overflow claims", () => {
    const rootRule = cssSource.match(/(?:^|\n)\.root\s*\{([^}]*)\}/)?.[1];
    const trackShellRule = cssSource.match(
      /(?:^|\n)\.trackShell\s*\{([^}]*)\}/,
    )?.[1];
    const trackRule = cssSource.match(/(?:^|\n)\.track\s*\{([^}]*)\}/)?.[1];
    const sceneRules = [
      ...cssSource.matchAll(/(?:^|\n)\.scene\s*\{([^}]*)\}/g),
    ].map((match) => match[1]);
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
    expect(trackRule).toMatch(/width:\s*100%\s*;/);
    expect(trackRule).toMatch(/height:\s*100%\s*;/);
    expect(sceneRules.join(" ")).toMatch(/position:\s*relative\s*;/);
    expect(sceneRules.join(" ")).toMatch(/overflow:\s*hidden\s*;/);
    expect(sceneRules.join(" ")).toMatch(/padding:\s*[^;]*cqh[^;]*cqw[^;]*;/);
    expect(cssSource).toMatch(/\d*\.?\d+cqw\b/i);
    expect(cssSource).toMatch(/\d*\.?\d+cqh\b/i);
    expect(cssSource).not.toMatch(/position:\s*fixed\b/i);
    expect(componentSource).not.toMatch(forbiddenStageUnit);
    expect(cssSource).not.toMatch(forbiddenStageUnit);
  });
});

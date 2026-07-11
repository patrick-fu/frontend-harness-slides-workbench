import { act, fireEvent, render, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { Source } from "../domain/evidence";
import type { TopicStageProps } from "../domain/topic";
import definition, {
  ORAL_TO_WRITTEN_SOURCES,
  ORAL_TO_WRITTEN_TRANSITION_SCORE,
} from "./oral-to-written";
import { runTopicContract } from "../testing/topic-contract";
import componentSource from "./oral-to-written.tsx?raw";
import styleClasses from "./oral-to-written.module.css";

runTopicContract(definition);

const TopicStage = definition.Stage;
const getMetadata = (language: "en" | "zh") => definition.metadata[language];

const runtimeProcess = (
  globalThis as typeof globalThis & {
    process: { getBuiltinModule: (name: "node:fs") => unknown };
  }
).process;
const { readFileSync } = runtimeProcess.getBuiltinModule("node:fs") as {
  readFileSync: (path: string, encoding: "utf8") => string;
};
const cssSource = readFileSync(
  "src/topics/oral-to-written.module.css",
  "utf8",
);

const BEAT_COUNTS: Record<number, number> = {
  1: 2,
  2: 3,
  3: 3,
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
      <TopicStage {...props} />
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
    result.container.querySelector<HTMLElement>(
      '[data-topic-id="oral-to-written"]',
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
        <StageFrame props={{ ...props, ...next }} onStageClick={onStageClick} />,
      );
    },
  };
}

describe("Warm Editorial Feature: oral to written — topic contract", () => {
  it("exports the locked topic, chapter-index navigation, and transition score", () => {
    expect(definition.id).toBe("oral-to-written");
    expect(definition.title).toEqual({
      en: "Oral to Written",
      zh: "史诗成文",
    });
    expect(definition.navigation).toEqual({
      geometry: "typographic-index",
      carrier: "oral-written-chapter-labels",
      invocation: "proximity-reveal",
      feedback: "active-glow",
    });
    expect(definition.evidence).toEqual({
      kind: "facts",
      sources: ORAL_TO_WRITTEN_SOURCES,
    });
    expect(definition.transitionScore).toBe(
      ORAL_TO_WRITTEN_TRANSITION_SCORE,
    );
    expect(ORAL_TO_WRITTEN_TRANSITION_SCORE).toEqual({
      "1->2": "linear-wipe",
      "2->3": "page-turn",
      "3->4": "hard-cut",
      "4->5": "page-turn",
    });
  });

  it("carries a claim-scoped archive packet with explicit reuse limits", () => {
    expect(ORAL_TO_WRITTEN_SOURCES.length).toBeGreaterThanOrEqual(6);
    expect(
      ORAL_TO_WRITTEN_SOURCES.some((source) => source.id === "harvard-rights"),
    ).toBe(true);

    for (const source of ORAL_TO_WRITTEN_SOURCES) {
      const typedSource: Source = source;
      expect(source.url).toMatch(/^https:\/\//);
      expect(source.authority.trim().length).toBeGreaterThan(8);
      expect(source.citation.trim().length).toBeGreaterThan(25);
      expect(source.supports.trim().length).toBeGreaterThan(45);
      expect(source.boundary.trim().length).toBeGreaterThan(40);
      expect(typedSource.url).toBe(source.url);
    }
  });

  it("keeps EN and ZH metadata aligned to the 2/3/3/3/1 reading curve", () => {
    const en = getMetadata("en");
    const zh = getMetadata("zh");

    expect(definition.styleId).toBe("warm-editorial-feature");
    expect(en.heroScene).toBe(3);
    expect(en.scenes.map((scene) => scene.beats.length)).toEqual([
      2, 3, 3, 3, 1,
    ]);
    expect(zh.scenes.map((scene) => scene.beats.length)).toEqual([
      2, 3, 3, 3, 1,
    ]);

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

describe("Warm Editorial Feature: oral to written — reading scenes", () => {
  it("renders every beat in both languages with five distinct compositions", () => {
    for (const language of ["en", "zh"] as const) {
      const compositions = new Set<string>();
      for (let scene = 1; scene <= 5; scene += 1) {
        for (let beat = 0; beat < BEAT_COUNTS[scene]; beat += 1) {
          const view = renderStage({ language, scene, beat });
          expect(view.root()).not.toBeNull();
          expect(view.activePanel()).toHaveAttribute(
            "data-scene-id",
            String(scene),
          );
          expect(view.activePanel()?.textContent?.trim().length).toBeGreaterThan(
            90,
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

  it("uses reserved slots so every reading page stays still after reveal", () => {
    for (const scene of [1, 2, 3, 4]) {
      const view = renderStage({
        scene,
        beat: BEAT_COUNTS[scene] - 1,
      });
      expect(view.activePanel()).toHaveAttribute(
        "data-beat-layout-container",
        "true",
      );
      expect(view.activePanel()).toHaveAttribute(
        "data-beat-layout-mode",
        "reserved",
      );
      expect(
        view.activePanel()?.querySelectorAll('[data-beat-layout-item="true"]')
          .length,
      ).toBeGreaterThanOrEqual(3);
      view.unmount();
    }
  });

  it("identifies the performer, collectors, transcriber, editors, and archive", () => {
    const opener = renderStage({ scene: 1, beat: 1, language: "en" });
    expect(opener.activePanel()).toHaveTextContent("Avdo Međedović");
    expect(opener.activePanel()).toHaveTextContent("Albert B. Lord");
    expect(opener.activePanel()).toHaveTextContent("Milman Parry Collection");
    opener.unmount();

    const layers = renderStage({ scene: 3, beat: 2, language: "en" });
    expect(layers.activePanel()).toHaveTextContent("Nikola Vujnović");
    expect(layers.activePanel()).toHaveTextContent("David E. Bynum");
    expect(layers.activePanel()).toHaveTextContent("Harvard University Press");
    layers.unmount();
  });

  it("separates a schematic listening trace from copyrighted archive media", () => {
    const view = renderStage({ scene: 2, beat: 2, language: "en" });
    expect(view.root()).toHaveAttribute("data-archive-media-reproduced", "false");
    expect(
      view.activePanel()?.querySelector('[data-audio-kind="schematic"]'),
    ).not.toBeNull();
    expect(
      view.activePanel()?.querySelectorAll('[data-waveform-bar="true"]').length,
    ).toBeGreaterThanOrEqual(24);
    expect(view.activePanel()).toHaveTextContent(/no archive audio reproduced/i);
    expect(view.activePanel()?.querySelector("audio, img, video")).toBeNull();
  });

  it("compares two performances and one edition without treating variance as error", () => {
    const view = renderStage({ scene: 4, beat: 2, language: "en" });
    expect(view.activePanel()).toHaveTextContent("12,311");
    expect(view.activePanel()).toHaveTextContent("8,488");
    expect(view.activePanel()).toHaveTextContent("1974");
    expect(view.activePanel()).toHaveTextContent(/not errors/i);
    expect(
      view.activePanel()?.querySelectorAll('[data-version-card="true"]'),
    ).toHaveLength(3);
  });

  it("closes with attribution and the access-is-not-permission boundary", () => {
    const view = renderStage({ scene: 5, language: "en" });
    expect(view.activePanel()).toHaveTextContent("Listen before you cite the page");
    expect(view.activePanel()).toHaveTextContent(/online access is not blanket reuse permission/i);
    expect(view.activePanel()).toHaveTextContent(/no audio, transcript, or archive image is reproduced/i);
  });
});

describe("Warm Editorial Feature: oral to written — transitions and navigation", () => {
  it("keeps every authored transition after continuous forward edges settle", async () => {
    vi.useFakeTimers();
    const view = renderStage({ scene: 1 });

    try {
      for (const [scene, kind] of [
        [2, "linear-wipe"],
        [3, "page-turn"],
        [4, "hard-cut"],
        [5, "page-turn"],
      ] as const) {
        view.rerenderProps({ scene });
        const track = view.container.querySelector<HTMLElement>(
          '[data-spatial-scene-track="true"]',
        );
        expect(track).toHaveAttribute("data-scene-transition-kind", kind);

        await act(async () => {
          vi.advanceTimersByTime(800);
        });
        expect(track).toHaveAttribute("data-scene-transition-kind", kind);
      }
    } finally {
      view.unmount();
      vi.useRealTimers();
    }
  });

  it("exposes five typographic chapter labels with the locked profile", () => {
    const view = renderStage({ scene: 3 });
    const navigation = view.root()?.querySelector<HTMLElement>(
      '[data-topic-navigation="true"]',
    );

    expect(navigation).toHaveAttribute(
      "data-navigation-geometry",
      "typographic-index",
    );
    expect(navigation).toHaveAttribute(
      "data-navigation-carrier",
      "oral-written-chapter-labels",
    );
    expect(navigation).toHaveAttribute(
      "data-navigation-invocation",
      "proximity-reveal",
    );
    expect(navigation).toHaveAttribute(
      "data-navigation-feedback",
      "active-glow",
    );
    expect(within(navigation!).getAllByRole("button")).toHaveLength(6);
    expect(
      within(navigation!).getByRole("button", { name: "Open chapter 3: edit" }),
    ).toHaveAttribute("aria-current", "page");
  });

  it("supports proximity, tap expansion, click, and keyboard without leaking", () => {
    const onNavigate = vi.fn();
    const onStageClick = vi.fn();
    const view = renderStage({ scene: 3, onNavigate }, onStageClick);
    const navigation = view.root()?.querySelector<HTMLElement>(
      '[data-topic-navigation="true"]',
    );
    const toggle = within(navigation!).getByRole("button", {
      name: "Open chapter index",
    });

    fireEvent.pointerEnter(navigation!);
    expect(navigation).toHaveAttribute("data-open", "true");
    fireEvent.pointerLeave(navigation!);
    expect(navigation).toHaveAttribute("data-open", "false");

    fireEvent.click(toggle);
    expect(navigation).toHaveAttribute("data-open", "true");

    const target = within(navigation!).getByRole("button", {
      name: "Open chapter 5: return",
    });
    fireEvent.pointerDown(target);
    fireEvent.click(target);
    expect(onNavigate).toHaveBeenLastCalledWith(5, 0);
    expect(onStageClick).not.toHaveBeenCalled();

    const current = within(navigation!).getByRole("button", {
      name: "Open chapter 3: edit",
    });
    fireEvent.keyDown(current, { key: "ArrowRight" });
    expect(onNavigate).toHaveBeenLastCalledWith(4, 0);
  });

  it("hides navigation in thumbnails and settles reduced-motion frames", () => {
    for (const props of [
      { isThumbnail: true, reducedMotion: false },
      { isThumbnail: false, reducedMotion: true },
    ]) {
      const view = renderStage({
        scene: 4,
        beat: 2,
        ...props,
        onNavigate: undefined,
      });
      expect(view.root()).toHaveAttribute("data-motion", "off");
      expect(
        view.container.querySelector('[data-spatial-scene-strip="true"]'),
      ).toHaveAttribute("data-reduced-motion", "true");
      if (props.isThumbnail) {
        expect(
          view.root()?.querySelector('[data-topic-navigation="true"]'),
        ).toBeNull();
      }
      view.unmount();
    }
  });

  it("zeros descendant and pseudo motion only beneath the motion-off root", () => {
    const motionOffRule = cssSource.match(
      /\.motionOff\s+\*,\s*\.motionOff\s+\*::before,\s*\.motionOff\s+\*::after\s*\{([^}]*)\}/,
    );
    expect(motionOffRule).not.toBeNull();
    for (const property of [
      "animation-duration",
      "animation-delay",
      "transition-duration",
      "transition-delay",
    ]) {
      expect(motionOffRule?.[1]).toMatch(
        new RegExp(`${property}:\\s*0ms\\s*!important`),
      );
    }

    const live = renderStage({ scene: 3, reducedMotion: false });
    expect(live.root()).not.toHaveClass(styleClasses.motionOff);
    live.unmount();

    const reduced = renderStage({ scene: 3, reducedMotion: true });
    const root = reduced.root();
    expect(root).toHaveClass(styleClasses.motionOff);
    expect(root?.querySelector(`.${styleClasses.indexToggleText}`)).not.toBeNull();
    expect(root?.querySelectorAll(`.${styleClasses.chapterLabel}`)).toHaveLength(5);
    reduced.unmount();
  });
});

describe("Warm Editorial Feature: oral to written — stage safety", () => {
  it("contains no loops, hotlinked visuals, outgoing clones, or unsafe stage units", () => {
    expect(componentSource).not.toMatch(/setInterval|requestAnimationFrame/);
    expect(componentSource).not.toMatch(/animation[^;{]*infinite/);
    expect(componentSource).not.toMatch(/<img[^>]+https?:\/\//);
    expect(componentSource).not.toMatch(/<audio|<video/);
    expect(componentSource).not.toMatch(/outgoingScene|isTransitionClone/);
    expect(cssSource).not.toMatch(/url\(\s*["']?https?:\/\//);
    expect(`${componentSource}\n${cssSource}`).not.toMatch(
      /(?:^|[^a-z-])\d*\.?\d+(?:px|vw|vh|rem|em)\b/i,
    );
  });

  it("keeps every final bilingual frame inside the fixed stage", () => {
    for (const language of ["en", "zh"] as const) {
      for (let scene = 1; scene <= 5; scene += 1) {
        const view = renderStage({
          scene,
          beat: BEAT_COUNTS[scene] - 1,
          language,
          reducedMotion: true,
        });
        const root = view.root();
        expect(root?.scrollWidth ?? 0).toBeLessThanOrEqual(
          (root?.clientWidth ?? 0) + 1,
        );
        expect(root?.scrollHeight ?? 0).toBeLessThanOrEqual(
          (root?.clientHeight ?? 0) + 1,
        );
        view.unmount();
      }
    }
  });
});

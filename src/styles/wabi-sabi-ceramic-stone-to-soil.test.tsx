import { afterEach, describe, expect, it, vi } from "vitest";
import {
  cleanup,
  fireEvent,
  render,
  waitFor,
  within,
} from "@testing-library/react";
import type { BespokeStyleProps } from "../types";
import StoneToSoil, {
  STONE_TO_SOIL_SOURCES,
  STONE_TO_SOIL_TRANSITION_SCORE,
  getMetadata,
  stoneToSoilTopic,
} from "./wabi-sabi-ceramic-stone-to-soil";

const BEAT_COUNTS: Record<number, number> = {
  1: 2,
  2: 3,
  3: 3,
  4: 3,
  5: 1,
};

function renderStage(props: Partial<BespokeStyleProps> = {}) {
  const onNavigate = props.onNavigate ?? vi.fn();
  const componentProps: BespokeStyleProps = {
    scene: 1,
    beat: 0,
    language: "en",
    isThumbnail: false,
    reducedMotion: false,
    ...props,
    onNavigate,
  };
  const result = render(
    <div
      data-testid="stage"
      style={{
        width: 1920,
        height: 1080,
        containerType: "size",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <StoneToSoil {...componentProps} />
    </div>,
  );
  return {
    ...result,
    stage: result.container.firstElementChild as HTMLElement,
    onNavigate,
  };
}

function activePanel(container: HTMLElement): HTMLElement {
  const panel = container.querySelector<HTMLElement>(
    '[data-spatial-scene-panel="true"][data-active="true"]',
  );
  if (!panel) throw new Error("Active stone-to-soil scene was not rendered");
  return panel;
}

afterEach(() => cleanup());

describe("Style 03 / Stone to Soil — topic contract", () => {
  it("exports the coordinated topic profile and exact transition score", () => {
    expect(stoneToSoilTopic.id).toBe("stone-to-soil");
    expect(stoneToSoilTopic.topic).toEqual({
      en: "Stone to Soil",
      zh: "石成土",
    });
    expect(stoneToSoilTopic.navigation).toEqual({
      geometry: "object-controller",
      carrier: "ceramic-shard-ring",
      invocation: "persistent",
      feedback: "mechanical-displacement",
    });
    expect(stoneToSoilTopic.sources).toBe(STONE_TO_SOIL_SOURCES);
    expect(stoneToSoilTopic.transitionScore).toBe(
      STONE_TO_SOIL_TRANSITION_SCORE,
    );
    expect(STONE_TO_SOIL_TRANSITION_SCORE).toEqual({
      "1->2": "ink-spread",
      "2->3": "dolly-pull",
      "3->4": "ink-spread",
      "4->5": "iris-open",
    });
  });

  it("ships claim-scoped institutional and basalt-weathering sources", () => {
    expect(STONE_TO_SOIL_SOURCES.length).toBeGreaterThanOrEqual(3);
    for (const source of STONE_TO_SOIL_SOURCES) {
      expect(source.url).toMatch(/^https:\/\//);
      expect(source.authority.length).toBeGreaterThan(3);
      expect(source.title.length).toBeGreaterThan(8);
      expect(source.citation.length).toBeGreaterThan(8);
      expect(source.supports.length).toBeGreaterThan(50);
      expect(source.boundary.length).toBeGreaterThan(40);
    }
  });

  it("cites basalt lithology in scene one and keeps S1 on weathering mechanism", () => {
    const basaltLithology = STONE_TO_SOIL_SOURCES[4];
    expect(basaltLithology).toMatchObject({
      authority: "U.S. National Park Service",
      title: "Igneous Rocks — Basalt and Rock Descriptors",
      url: "https://www.nps.gov/subjects/geology/igneous.htm",
    });
    expect(basaltLithology.supports).toMatch(
      /typically dark, commonly vesicular.*aphanitic \(fine-grained\)/i,
    );
    expect(basaltLithology.boundary).toMatch(
      /commonly rather than invariably vesicular/i,
    );

    const specimen = renderStage({ scene: 1, beat: 1 });
    const specimenPanel = activePanel(specimen.container);
    expect(specimenPanel).toHaveTextContent(
      "NPS basalt lithology · selected texture, not universal [S5]",
    );
    expect(specimenPanel).not.toHaveTextContent("[S1]");
    specimen.unmount();

    const weathering = renderStage({ scene: 2, beat: 2 });
    expect(activePanel(weathering.container)).toHaveTextContent(
      "Uneven weathering and water-to-rock contact [S1, S3]",
    );
    weathering.unmount();
  });

  it("keeps EN/ZH metadata aligned to the 2/3/3/3/1 stage-impact curve", () => {
    const en = getMetadata("en");
    const zh = getMetadata("zh");
    expect(en.id).toBe("wabi-sabi-ceramic");
    expect(en.band).toBe("minimal-keynote");
    expect(en.heroScene).toBe(4);
    expect(en.scenes.map((scene) => scene.beats.length)).toEqual([
      2, 3, 3, 3, 1,
    ]);
    expect(zh.scenes.map((scene) => scene.beats.length)).toEqual([
      2, 3, 3, 3, 1,
    ]);

    for (const metadata of [en, zh]) {
      expect(metadata.scenes.map((scene) => scene.id)).toEqual([1, 2, 3, 4, 5]);
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

describe("Style 03 / Stone to Soil — render and evidence", () => {
  it("renders every beat in both languages through five distinct material compositions", () => {
    for (const language of ["en", "zh"] as const) {
      const compositions = new Set<string>();
      for (let scene = 1; scene <= 5; scene += 1) {
        for (let beat = 0; beat < BEAT_COUNTS[scene]; beat += 1) {
          const view = renderStage({ scene, beat, language });
          const panel = activePanel(view.container);
          const sceneRoot = panel.querySelector<HTMLElement>("[data-composition]");
          expect(panel).toHaveAttribute("data-scene-id", String(scene));
          expect(sceneRoot?.dataset.composition).toBeTruthy();
          expect(panel.textContent?.trim().length).toBeGreaterThan(0);
          if (beat === BEAT_COUNTS[scene] - 1) {
            compositions.add(sceneRoot!.dataset.composition!);
          }
          expect(panel.querySelector("img")).toBeNull();
          view.unmount();
        }
      }
      expect(compositions.size).toBe(5);
    }
  });

  it("marks every multi-beat material scene as a stable reserved layout", () => {
    for (const scene of [1, 2, 3, 4]) {
      const view = renderStage({
        scene,
        beat: BEAT_COUNTS[scene] - 1,
        reducedMotion: true,
      });
      const panel = activePanel(view.container);
      expect(panel).toHaveAttribute("data-beat-layout-container", "true");
      expect(panel).toHaveAttribute("data-beat-layout-mode", "reserved");
      expect(
        panel.querySelectorAll('[data-beat-layout-item="true"]').length,
      ).toBeGreaterThan(2);
      view.unmount();
    }
  });

  it("distinguishes leaching, residual material, new minerals, and the red field profile", () => {
    const fragments = renderStage({ scene: 3, beat: 2 });
    const fragmentPanel = activePanel(fragments.container);
    expect(fragmentPanel).toHaveTextContent("LEACHED");
    expect(fragmentPanel).toHaveTextContent("RESIDUAL");
    expect(fragmentPanel).toHaveTextContent("NEOFORMED");
    fragments.unmount();

    const profile = renderStage({ scene: 4, beat: 2 });
    const profilePanel = activePanel(profile.container);
    expect(profilePanel).toHaveTextContent("Leyte field case");
    expect(profilePanel).toHaveTextContent("2,700 mm");
    expect(profilePanel).toHaveTextContent("28 °C");
    expect(profilePanel).toHaveTextContent(/iron oxides tint/i);
    profile.unmount();

    const bowl = renderStage({ scene: 5 });
    expect(activePanel(bowl.container)).toHaveTextContent(/not ground rock alone/i);
    bowl.unmount();
  });
});

describe("Style 03 / Stone to Soil — transitions and shard controller", () => {
  it("renders all four authored transition edges", async () => {
    const baseProps: BespokeStyleProps = {
      scene: 1,
      beat: 0,
      language: "en",
      isThumbnail: false,
      reducedMotion: false,
      onNavigate: vi.fn(),
    };
    const view = render(
      <div style={{ width: 1920, height: 1080, containerType: "size" }}>
        <StoneToSoil {...baseProps} />
      </div>,
    );
    const expected = ["ink-spread", "dolly-pull", "ink-spread", "iris-open"];

    for (let scene = 2; scene <= 5; scene += 1) {
      view.rerender(
        <div style={{ width: 1920, height: 1080, containerType: "size" }}>
          <StoneToSoil {...baseProps} scene={scene} />
        </div>,
      );
      await waitFor(() => {
        expect(
          view.container.querySelector('[data-testid="spatial-scene-track"]'),
        ).toHaveAttribute("data-scene-transition-kind", expected[scene - 2]);
      });
    }
  });

  it("exposes five irregular shards and mechanically displaces the active one", () => {
    const stageClick = vi.fn();
    const onNavigate = vi.fn();
    const view = render(
      <div
        onClick={stageClick}
        style={{ width: 1920, height: 1080, containerType: "size" }}
      >
        <StoneToSoil
          scene={2}
          beat={0}
          language="en"
          isThumbnail={false}
          reducedMotion={false}
          onNavigate={onNavigate}
        />
      </div>,
    );
    const nav = view.container.querySelector<HTMLElement>(
      '[data-topic-navigation="true"]',
    );
    expect(nav).toHaveAttribute("data-navigation-geometry", "object-controller");
    expect(nav).toHaveAttribute("data-navigation-carrier", "ceramic-shard-ring");
    expect(nav).toHaveAttribute("data-navigation-invocation", "persistent");
    expect(nav).toHaveAttribute(
      "data-navigation-feedback",
      "mechanical-displacement",
    );
    const buttons = within(nav!).getAllByRole("button");
    expect(buttons).toHaveLength(5);
    expect(nav!.querySelectorAll('[data-mechanical-offset="true"]')).toHaveLength(1);

    const target = within(nav!).getByRole("button", {
      name: "Fragment 4: Soil profile",
    });
    fireEvent.pointerDown(target);
    fireEvent.click(target);
    expect(onNavigate).toHaveBeenCalledWith(4, 0);
    expect(stageClick).not.toHaveBeenCalled();
  });

  it("provides Arrow-key and Home/End fallback from a focused shard", () => {
    const view = renderStage({ scene: 2 });
    const nav = view.container.querySelector<HTMLElement>(
      '[data-topic-navigation="true"]',
    );
    const current = within(nav!).getByRole("button", {
      name: "Fragment 2: Water enters",
    });
    fireEvent.keyDown(current, { key: "ArrowRight" });
    expect(view.onNavigate).toHaveBeenCalledWith(3, 0);
    fireEvent.keyDown(current, { key: "End" });
    expect(view.onNavigate).toHaveBeenCalledWith(5, 0);
  });

  it("hides the controller in thumbnails and settles reduced-motion frames", () => {
    for (const props of [
      { isThumbnail: true, reducedMotion: false },
      { isThumbnail: false, reducedMotion: true },
    ]) {
      const view = renderStage({
        scene: 3,
        beat: 2,
        ...props,
        onNavigate: undefined,
      });
      expect(
        view.container.querySelector('[data-testid="spatial-scene-strip"]'),
      ).toHaveAttribute("data-reduced-motion", "true");
      expect(view.container.querySelector('[data-transition-clone="true"]')).toBeNull();
      if (props.isThumbnail) {
        expect(
          view.container.querySelector('[data-topic-navigation="true"]'),
        ).toBeNull();
      }
      view.unmount();
    }
  });
});

describe("Style 03 / Stone to Soil — fixed-stage safety", () => {
  it("clips every final beat in both languages to the 1920×1080 stage", () => {
    for (const language of ["en", "zh"] as const) {
      for (let scene = 1; scene <= 5; scene += 1) {
        const view = renderStage({
          scene,
          beat: BEAT_COUNTS[scene] - 1,
          language,
          reducedMotion: true,
        });
        expect(view.stage.scrollWidth).toBeLessThanOrEqual(view.stage.clientWidth + 1);
        expect(view.stage.scrollHeight).toBeLessThanOrEqual(view.stage.clientHeight + 1);
        view.unmount();
      }
    }
  });
});

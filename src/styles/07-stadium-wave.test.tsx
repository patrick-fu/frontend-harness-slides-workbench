import { fireEvent, render, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { BespokeStyleProps } from "../types";
import StadiumWave, {
  getMetadata,
  stadiumWaveTopic,
  STADIUM_WAVE_ASSET_CREDIT,
  STADIUM_WAVE_SOURCES,
  STADIUM_WAVE_TRANSITION_SCORE,
} from "./07-stadium-wave";
import componentSource from "./07-stadium-wave.tsx?raw";

const BEAT_COUNTS: Record<number, number> = {
  1: 2,
  2: 4,
  3: 3,
  4: 5,
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
      <StadiumWave {...props} />
    </div>
  );
}

function renderStage(
  overrides: Partial<BespokeStyleProps> = {},
  onStageClick = vi.fn(),
) {
  const props = { ...BASE_PROPS, onNavigate: vi.fn(), ...overrides };
  const result = render(<StageFrame props={props} onStageClick={onStageClick} />);
  const root = result.container.querySelector<HTMLElement>(
    '[data-topic-id="stadium-wave"]',
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
      const nextProps = { ...props, ...next };
      result.rerender(
        <StageFrame props={nextProps} onStageClick={onStageClick} />,
      );
    },
  };
}

describe("Stadium Wave topic protocol", () => {
  it("exports the planned semantic topic and navigation profile", () => {
    expect(stadiumWaveTopic.id).toBe("stadium-wave");
    expect(stadiumWaveTopic.topic).toEqual({
      en: "Stadium Wave",
      zh: "看台人浪",
    });
    expect(stadiumWaveTopic.navigation).toEqual({
      geometry: "spatial-node",
      carrier: "stadium-seating-array",
      invocation: "auto-hide",
      feedback: "active-glow",
    });
    expect(stadiumWaveTopic.sources).toBe(STADIUM_WAVE_SOURCES);
    expect(stadiumWaveTopic.transitionScore).toBe(
      STADIUM_WAVE_TRANSITION_SCORE,
    );
    expect(STADIUM_WAVE_TRANSITION_SCORE).toEqual({
      "1->2": "push-x",
      "2->3": "card-carousel",
      "3->4": "diagonal-pan",
      "4->5": "grid-reveal",
    });
  });

  it("keeps five localized scenes structurally aligned", () => {
    const english = getMetadata("en");
    const chinese = getMetadata("zh");

    expect(english.id).toBe("sketch-board-emoji");
    expect(english.heroScene).toBe(4);
    expect(english.scenes).toHaveLength(5);
    expect(chinese.scenes).toHaveLength(5);
    expect(english.scenes.map((scene) => scene.id)).toEqual([1, 2, 3, 4, 5]);
    expect(chinese.scenes.map((scene) => scene.id)).toEqual([1, 2, 3, 4, 5]);
    expect(english.scenes.map((scene) => scene.beats.length)).toEqual(
      chinese.scenes.map((scene) => scene.beats.length),
    );

    for (const scene of english.scenes) {
      expect(scene.beats).toHaveLength(BEAT_COUNTS[scene.id]);
      scene.beats.forEach((beat, index) => expect(beat.id).toBe(index));
    }
  });

  it("renders every English and Chinese beat with stable reserved layout", () => {
    for (const language of ["en", "zh"] as const) {
      for (let scene = 1; scene <= 5; scene += 1) {
        for (let beat = 0; beat < BEAT_COUNTS[scene]; beat += 1) {
          const { activePanel, root, unmount } = renderStage({
            language,
            scene,
            beat,
          });
          expect(root).not.toBeNull();
          expect(activePanel()).toHaveAttribute("data-scene-id", String(scene));
          expect(activePanel()).toHaveAttribute(
            "data-beat-layout-mode",
            "reserved",
          );
          expect(activePanel()?.textContent?.trim().length).toBeGreaterThan(20);
          unmount();
        }
      }
    }
  });

  it("uses the exact four-edge transition score and the stadium signature modifier", () => {
    const { container, rerenderProps } = renderStage({ scene: 1 });
    const track = () =>
      container.querySelector<HTMLElement>('[data-spatial-scene-track="true"]');

    rerenderProps({ scene: 2 });
    expect(track()).toHaveAttribute("data-scene-transition-kind", "push-x");

    rerenderProps({ scene: 3 });
    expect(track()).toHaveAttribute(
      "data-scene-transition-kind",
      "card-carousel",
    );

    rerenderProps({ scene: 4 });
    expect(track()).toHaveAttribute(
      "data-scene-transition-kind",
      "diagonal-pan",
    );
    expect(track()).toHaveAttribute(
      "data-scene-transition-modifier",
      "stadium-wave",
    );

    rerenderProps({ scene: 5 });
    expect(track()).toHaveAttribute(
      "data-scene-transition-kind",
      "grid-reveal",
    );
  });
});

describe("Stadium Wave SVG actors and beat semantics", () => {
  it("renders local deterministic SVG assets without native emoji glyphs", () => {
    const { activePanel } = renderStage({ scene: 4, beat: 2 });
    const panel = activePanel();
    const actors = panel?.querySelectorAll<HTMLImageElement>(
      'img[data-emoji-asset="openmoji"]',
    );

    expect(actors?.length).toBe(20);
    actors?.forEach((actor) => {
      expect(actor.getAttribute("src")).toMatch(
        /^(?:data:image\/svg\+xml|\/src\/.*openmoji-person-)/,
      );
      expect(actor).toHaveAttribute("alt", "");
    });
    expect(panel?.textContent).not.toMatch(/\p{Extended_Pictographic}/u);
  });

  it("keeps people fixed while changing pose state by beat", () => {
    const { activePanel, rerenderProps } = renderStage({ scene: 1, beat: 0 });

    expect(
      activePanel()?.querySelectorAll('[data-actor-state="seated"]'),
    ).toHaveLength(20);

    rerenderProps({ scene: 1, beat: 1 });
    expect(
      activePanel()?.querySelectorAll('[data-actor-state="raised"]'),
    ).toHaveLength(1);
    expect(
      activePanel()?.querySelectorAll('[data-actor-state="watching"]'),
    ).toHaveLength(2);

    rerenderProps({ scene: 4, beat: 3 });
    expect(
      activePanel()?.querySelectorAll('[data-actor-state="raised"]'),
    ).toHaveLength(1);
    expect(
      activePanel()?.querySelectorAll('[data-actor-state="watching"]'),
    ).toHaveLength(3);

    rerenderProps({ scene: 4, beat: 4 });
    expect(
      activePanel()?.querySelectorAll('[data-actor-state="seated"]'),
    ).toHaveLength(20);
  });

  it("ends with a settled crowd instead of a looping wave", () => {
    const { activePanel } = renderStage({ scene: 5, beat: 0 });
    expect(
      activePanel()?.querySelectorAll('[data-actor-state="seated"]'),
    ).toHaveLength(11);
    expect(activePanel()).toHaveTextContent(
      "Coordination, one neighbor at a time",
    );
    expect(componentSource).not.toMatch(/setInterval|requestAnimationFrame/);
    activePanel()?.querySelectorAll<HTMLElement>("*").forEach((element) => {
      expect(window.getComputedStyle(element).animationIterationCount).not.toBe(
        "infinite",
      );
    });
  });
});

describe("Stadium Wave navigation and deterministic modes", () => {
  it("renders a five-node stadium navigation with its audit attributes", () => {
    const { root } = renderStage({ scene: 3 });
    const nav = root?.querySelector<HTMLElement>('[data-topic-navigation="true"]');

    expect(nav).toHaveAttribute("data-navigation-geometry", "spatial-node");
    expect(nav).toHaveAttribute(
      "data-navigation-carrier",
      "stadium-seating-array",
    );
    expect(nav).toHaveAttribute("data-navigation-invocation", "auto-hide");
    expect(nav).toHaveAttribute("data-navigation-feedback", "active-glow");
    expect(within(nav!).getAllByRole("button")).toHaveLength(5);
  });

  it("supports click/tap without leaking the event to the stage", () => {
    const onNavigate = vi.fn();
    const onStageClick = vi.fn();
    const { root } = renderStage({ onNavigate }, onStageClick);
    const target = within(root!).getByRole("button", {
      name: "Jump to scene 4: fade",
    });

    fireEvent.pointerDown(target);
    fireEvent.click(target);

    expect(onNavigate).toHaveBeenCalledWith(4, 0);
    expect(onStageClick).not.toHaveBeenCalled();
  });

  it("provides an Arrow-key fallback and isolates the key from global navigation", () => {
    const onNavigate = vi.fn();
    const onWindowKey = vi.fn();
    window.addEventListener("keydown", onWindowKey);
    const { root } = renderStage({ scene: 3, onNavigate });
    const active = within(root!).getByRole("button", {
      name: "Jump to scene 3: state",
    });

    fireEvent.keyDown(active, { key: "ArrowRight" });

    expect(onNavigate).toHaveBeenCalledWith(4, 0);
    expect(onWindowKey).not.toHaveBeenCalled();
    window.removeEventListener("keydown", onWindowKey);
  });

  it("removes navigation and disables motion in thumbnail mode", () => {
    const { root, container } = renderStage({
      isThumbnail: true,
      reducedMotion: false,
      onNavigate: undefined,
      scene: 4,
      beat: 2,
    });

    expect(root).toHaveAttribute("data-motion", "off");
    expect(root?.querySelector('[data-topic-navigation="true"]')).toBeNull();
    expect(
      container.querySelector('[data-spatial-scene-strip="true"]'),
    ).toHaveAttribute("data-reduced-motion", "true");
  });

  it("settles the requested frame when reducedMotion is true", () => {
    const { root, activePanel } = renderStage({
      reducedMotion: true,
      scene: 4,
      beat: 3,
    });

    expect(root).toHaveAttribute("data-motion", "off");
    expect(
      activePanel()?.querySelector('[data-scene-content="4"]'),
    ).toHaveAttribute("data-beat", "3");
    expect(
      activePanel()?.querySelectorAll('[data-actor-state="raised"]'),
    ).toHaveLength(1);
  });
});

describe("Stadium Wave research, licensing, and stage safety", () => {
  it("ships a traceable three-source research pack", () => {
    expect(STADIUM_WAVE_SOURCES).toHaveLength(3);
    for (const source of STADIUM_WAVE_SOURCES) {
      expect(source.url).toMatch(/^https:\/\/doi\.org\/10\./);
      expect(source.citation.length).toBeGreaterThan(60);
      expect(source.supports.length).toBeGreaterThan(60);
    }
  });

  it("records the local OpenMoji license and source", () => {
    expect(STADIUM_WAVE_ASSET_CREDIT.license).toBe("CC BY-SA 4.0");
    expect(STADIUM_WAVE_ASSET_CREDIT.source).toBe("https://openmoji.org/");
    expect(STADIUM_WAVE_ASSET_CREDIT.localAssets).toHaveLength(2);
  });

  it("uses stage-safe units and no remote visual assets", () => {
    const forbiddenUnit = /(?:^|[^a-z-])\d*\.?\d+(?:px|vw|vh|rem|em)\b/i;
    expect(componentSource).not.toMatch(forbiddenUnit);
    expect(componentSource).not.toMatch(/<img[^>]+https?:\/\//);
  });

  it("keeps every rendered frame clipped to the stage root", () => {
    for (let scene = 1; scene <= 5; scene += 1) {
      const beat = BEAT_COUNTS[scene] - 1;
      const { root, unmount } = renderStage({ scene, beat, language: "zh" });
      expect(root?.scrollWidth ?? 0).toBeLessThanOrEqual(
        (root?.clientWidth ?? 0) + 1,
      );
      expect(root?.scrollHeight ?? 0).toBeLessThanOrEqual(
        (root?.clientHeight ?? 0) + 1,
      );
      unmount();
    }
  });
});

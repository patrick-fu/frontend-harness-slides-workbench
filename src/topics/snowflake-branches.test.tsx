import { fireEvent, render, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { TopicStageProps } from "../domain/topic";
import { runTopicContract } from "../testing/topic-contract";
import topic, {
  SNOWFLAKE_BRANCHES_SOURCES,
  SNOWFLAKE_BRANCHES_TRANSITION_SCORE,
} from "./snowflake-branches";
import componentSource from "./snowflake-branches.tsx?raw";
import styleSource from "./snowflake-branches.module.css?inline";

runTopicContract(topic);

const BEAT_COUNTS: Record<number, number> = {
  1: 1,
  2: 1,
  3: 2,
  4: 3,
  5: 4,
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

  return {
    ...result,
    root: () =>
      result.container.querySelector<HTMLElement>(
        '[data-topic-id="snowflake-branches"]',
      ),
    activePanel: () =>
      result.container.querySelector<HTMLElement>(
        '[data-spatial-scene-panel="true"][data-active="true"]',
      ),
    rerenderProps(next: Partial<TopicStageProps>) {
      result.rerender(
        <StageFrame
          props={{ ...props, ...next }}
          onStageClick={onStageClick}
        />,
      );
    },
  };
}

describe("Snowflake Branches topic protocol", () => {
  it("exports the planned facts packet, navigation, and exact transition score", () => {
    expect(topic.id).toBe("snowflake-branches");
    expect(topic.title).toEqual({
      en: "Snowflake Branches",
      zh: "雪花分支",
    });
    expect(topic.navigation).toEqual({
      geometry: "object-controller",
      carrier: "crystal-morphology-dial",
      invocation: "keyboard-focus",
      feedback: "history-trail",
    });
    expect(topic.evidence).toEqual({
      kind: "facts",
      sources: SNOWFLAKE_BRANCHES_SOURCES,
    });
    expect(topic.transitionScore).toBe(
      SNOWFLAKE_BRANCHES_TRANSITION_SCORE,
    );
    expect(SNOWFLAKE_BRANCHES_TRANSITION_SCORE).toEqual({
      "1->2": "grid-reveal",
      "2->3": "push-y",
      "3->4": "afterimage",
      "4->5": "push-y",
    });

    expect(SNOWFLAKE_BRANCHES_SOURCES.length).toBeGreaterThanOrEqual(3);
    for (const source of SNOWFLAKE_BRANCHES_SOURCES) {
      expect(source.url).toMatch(/^https:\/\//);
      expect(source.supports.trim().length).toBeGreaterThan(30);
      expect(
        ("authority" in source ? source.authority : undefined) ||
          ("citation" in source ? source.citation : undefined) ||
          ("title" in source ? source.title : undefined),
      ).toBeTruthy();
    }
  });

  it("keeps five bilingual scene structures and claims aligned", () => {
    const english = topic.metadata.en;
    const chinese = topic.metadata.zh;

    expect(topic.styleId).toBe("mechanical-scoring-funnel");
    expect(english.heroScene).toBe(4);
    expect(english.scenes.map((scene) => scene.id)).toEqual([1, 2, 3, 4, 5]);
    expect(chinese.scenes.map((scene) => scene.id)).toEqual([1, 2, 3, 4, 5]);
    expect(english.scenes.map((scene) => scene.beats.length)).toEqual(
      chinese.scenes.map((scene) => scene.beats.length),
    );

    for (const scene of english.scenes) {
      expect(scene.beats).toHaveLength(BEAT_COUNTS[scene.id]);
      scene.beats.forEach((beat, index) => {
        expect(beat.id).toBe(index);
        expect(beat.title.trim().length).toBeGreaterThan(0);
        expect(beat.body.trim().length).toBeGreaterThan(0);
      });
    }
  });

  it("renders every English and Chinese beat in a stable reserved layout", () => {
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
            20,
          );
          view.unmount();
        }
      }
    }
  });

  it("applies all four planned scene-edge transitions", () => {
    const view = renderStage({ scene: 1 });
    const track = () =>
      view.container.querySelector<HTMLElement>(
        '[data-spatial-scene-track="true"]',
      );

    for (const [scene, kind] of [
      [2, "grid-reveal"],
      [3, "push-y"],
      [4, "afterimage"],
      [5, "push-y"],
    ] as const) {
      view.rerenderProps({ scene });
      expect(track()).toHaveAttribute("data-scene-transition-kind", kind);
    }
  });
});

describe("Snowflake Branches visual explanation", () => {
  it("progresses from molecule hopper through lattice and condition gates", () => {
    const hopper = renderStage({ scene: 1 });
    expect(
      hopper.activePanel()?.querySelector('[data-molecule-hopper="true"]'),
    ).not.toBeNull();
    hopper.unmount();

    const lattice = renderStage({ scene: 2 });
    expect(
      lattice.activePanel()?.querySelectorAll('[data-lattice-cell="true"]'),
    ).toHaveLength(7);
    lattice.unmount();

    const gates = renderStage({ scene: 3, beat: 1 });
    expect(
      gates.activePanel()?.querySelectorAll('[data-condition-gate="true"]'),
    ).toHaveLength(2);
    expect(gates.activePanel()).toHaveTextContent("Temperature");
    expect(gates.activePanel()).toHaveTextContent("Supersaturation");
    expect(gates.activePanel()).toHaveTextContent("PLATE");
    expect(gates.activePanel()).toHaveTextContent("COLUMN");
    gates.unmount();
  });

  it("grows six related but non-identical arms and amplifies small perturbations", () => {
    const view = renderStage({ scene: 4, beat: 2 });
    const arms = view.activePanel()?.querySelectorAll('[data-crystal-arm="true"]');
    const variants = new Set(
      Array.from(arms ?? []).map((arm) => arm.getAttribute("data-arm-variant")),
    );

    expect(arms).toHaveLength(6);
    expect(variants.size).toBeGreaterThanOrEqual(3);
    expect(view.activePanel()).toHaveTextContent("Small perturbations grow");
  });

  it("ends on an irregular specimen tray without presenting a winner", () => {
    const view = renderStage({ scene: 5, beat: 3 });

    expect(
      view.activePanel()?.querySelectorAll('[data-imperfect-specimen="true"]'),
    ).toHaveLength(6);
    expect(view.activePanel()).toHaveTextContent("GENERATED MORPHOLOGY");
    expect(view.activePanel()).toHaveTextContent("NOT AN OBSERVATION");
    expect(view.activePanel()?.textContent).not.toMatch(/winner|best crystal/i);
  });
});

describe("Snowflake Branches navigation and deterministic modes", () => {
  it("renders a crystal morphology dial with its complete audit profile", () => {
    const view = renderStage({ scene: 3 });
    const nav = view.root()?.querySelector<HTMLElement>(
      '[data-topic-navigation="true"]',
    );

    expect(nav).toHaveAttribute("data-navigation-geometry", "object-controller");
    expect(nav).toHaveAttribute(
      "data-navigation-carrier",
      "crystal-morphology-dial",
    );
    expect(nav).toHaveAttribute("data-navigation-invocation", "keyboard-focus");
    expect(nav).toHaveAttribute("data-navigation-feedback", "history-trail");
    expect(within(nav!).getAllByRole("button")).toHaveLength(5);
    expect(nav?.querySelectorAll('[data-history-mark="seen"]')).toHaveLength(3);
  });

  it("supports click/tap and Arrow-key fallback without leaking events", () => {
    const onNavigate = vi.fn();
    const onStageClick = vi.fn();
    const view = renderStage({ scene: 3, onNavigate }, onStageClick);
    const nav = view.root()?.querySelector<HTMLElement>(
      '[data-topic-navigation="true"]',
    );
    const fifth = within(nav!).getByRole("button", {
      name: "Scene 5: specimen tray",
    });

    fireEvent.pointerDown(fifth);
    fireEvent.click(fifth);
    expect(onNavigate).toHaveBeenLastCalledWith(5, 0);
    expect(onStageClick).not.toHaveBeenCalled();

    const current = within(nav!).getByRole("button", {
      name: "Scene 3: condition gates",
    });
    fireEvent.keyDown(current, { key: "ArrowRight" });
    expect(onNavigate).toHaveBeenLastCalledWith(4, 0);
    expect(onStageClick).not.toHaveBeenCalled();
  });

  it("hides navigation in thumbnails and settles reduced-motion frames", () => {
    for (const overrides of [
      { isThumbnail: true, reducedMotion: false },
      { isThumbnail: false, reducedMotion: true },
    ]) {
      const view = renderStage({
        scene: 5,
        beat: 3,
        onNavigate: undefined,
        ...overrides,
      });

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
        view.activePanel()?.querySelectorAll('[data-imperfect-specimen="true"]'),
      ).toHaveLength(6);
      view.unmount();
    }
  });
});

describe("Snowflake Branches source and stage hygiene", () => {
  it("uses the shared track without clone lifecycle, remote images, loops, or unsafe units", () => {
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

  it("keeps every final bilingual frame clipped to the fixed stage", () => {
    for (const language of ["en", "zh"] as const) {
      for (let scene = 1; scene <= 5; scene += 1) {
        const view = renderStage({
          language,
          scene,
          beat: BEAT_COUNTS[scene] - 1,
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

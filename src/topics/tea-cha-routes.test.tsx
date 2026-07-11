import { fireEvent, render, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { TopicStageProps } from "../domain/topic";
import definition, {
  TEA_CHA_EVIDENCE,
  TEA_CHA_ROUTES_SOURCES,
  TEA_CHA_ROUTES_TRANSITION_SCORE,
} from "./tea-cha-routes";
import { runTopicContract } from "../testing/topic-contract";
import componentSource from "./tea-cha-routes.tsx?raw";
import styleSource from "./tea-cha-routes.module.css?inline";

const { Stage } = definition;

runTopicContract(definition);

const BEAT_COUNTS: Record<number, number> = {
  1: 1,
  2: 3,
  3: 2,
  4: 4,
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
      <Stage {...props} />
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
        '[data-topic-id="tea-cha-routes"]',
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

describe("Tea / Cha Routes topic protocol", () => {
  it("exports the planned facts packet, navigation, and exact transition score", () => {
    expect(definition.id).toBe("tea-cha-routes");
    expect(definition.title).toEqual({
      en: "Tea / Cha",
      zh: "茶与 Cha",
    });
    expect(definition.navigation).toEqual({
      geometry: "path",
      carrier: "tea-cha-route-lines",
      invocation: "persistent",
      feedback: "next-state-preview",
    });
    expect(definition.evidence).toEqual({
      kind: "facts",
      sources: TEA_CHA_ROUTES_SOURCES,
    });
    expect(definition.transitionScore).toBe(
      TEA_CHA_ROUTES_TRANSITION_SCORE,
    );
    expect(TEA_CHA_ROUTES_TRANSITION_SCORE).toEqual({
      "1->2": "push-x",
      "2->3": "linear-wipe",
      "3->4": "iris-open",
      "4->5": "diagonal-pan",
    });

    expect(TEA_CHA_ROUTES_SOURCES.length).toBeGreaterThanOrEqual(3);
    for (const source of TEA_CHA_ROUTES_SOURCES) {
      expect(source.url).toMatch(/^https:\/\//);
      expect(source.supports.trim().length).toBeGreaterThan(30);
      expect(
        ("authority" in source ? source.authority : undefined) ||
          ("citation" in source ? source.citation : undefined) ||
          ("title" in source ? source.title : undefined),
      ).toBeTruthy();
    }
  });

  it("keeps a claim-scoped language-form-record-path evidence table", () => {
    expect(TEA_CHA_EVIDENCE.length).toBeGreaterThanOrEqual(9);
    for (const row of TEA_CHA_EVIDENCE) {
      expect(row.language.en.trim()).not.toBe("");
      expect(row.language.zh.trim()).not.toBe("");
      expect(row.form.trim()).not.toBe("");
      expect(row.record.en.trim()).not.toBe("");
      expect(row.record.zh.trim()).not.toBe("");
      expect(row.path).toMatch(/^(origin|sea|land|exception)$/);
      expect(row.sourceKeys.length).toBeGreaterThan(0);
    }

    expect(TEA_CHA_EVIDENCE).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ form: "tea", path: "sea" }),
        expect.objectContaining({ form: "chaa", path: "exception" }),
        expect.objectContaining({ form: "chá", path: "exception" }),
      ]),
    );
  });

  it("keeps five bilingual scenes aligned to the 1-3-2-4-1 curve", () => {
    const english = definition.metadata.en;
    const chinese = definition.metadata.zh;

    expect(definition.styleId).toBe("subway-map-of-intent");
    expect(english.heroScene).toBe(5);
    expect(english.scenes.map((scene) => scene.id)).toEqual([1, 2, 3, 4, 5]);
    expect(chinese.scenes.map((scene) => scene.id)).toEqual([1, 2, 3, 4, 5]);
    expect(english.scenes.map((scene) => scene.beats.length)).toEqual(
      chinese.scenes.map((scene) => scene.beats.length),
    );
    expect(english.scenes.map((scene) => scene.beats.length)).toEqual([
      1, 3, 2, 4, 1,
    ]);

    for (const scene of english.scenes) {
      expect(scene.beats).toHaveLength(BEAT_COUNTS[scene.id]);
      scene.beats.forEach((beat, index) => {
        expect(beat.id).toBe(index);
        expect(beat.title.trim()).not.toBe("");
        expect(beat.body.trim()).not.toBe("");
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
            24,
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
      [2, "push-x"],
      [3, "linear-wipe"],
      [4, "iris-open"],
      [5, "diagonal-pan"],
    ] as const) {
      view.rerenderProps({ scene });
      expect(track()).toHaveAttribute("data-scene-transition-kind", kind);
    }
  });
});

describe("Tea / Cha Routes visual explanation", () => {
  it("opens on 茶 as the shared source rather than an English-centered map", () => {
    const view = renderStage({ scene: 1 });
    expect(view.activePanel()).toHaveTextContent("茶");
    expect(view.activePanel()).toHaveTextContent("tê");
    expect(view.activePanel()).toHaveTextContent("chá");
    expect(
      view.activePanel()?.querySelector('[data-source-character="tea"]'),
    ).not.toBeNull();
  });

  it("reveals the Chinese origin cluster as written form and localized readings", () => {
    const view = renderStage({ scene: 2, beat: 2 });
    const nodes = view.activePanel()?.querySelectorAll(
      '[data-origin-language-node="true"]',
    );
    expect(nodes?.length).toBeGreaterThanOrEqual(4);
    expect(view.activePanel()).toHaveTextContent("Southern Min");
    expect(view.activePanel()).toHaveTextContent("Mandarin");
    expect(view.activePanel()).toHaveTextContent("Cantonese");
  });

  it("draws the sea-route braid without claiming one certain Dutch entry point", () => {
    const view = renderStage({ scene: 3, beat: 1 });
    expect(
      view.activePanel()?.querySelectorAll('[data-sea-language-node="true"]')
        .length,
    ).toBeGreaterThanOrEqual(6);
    expect(view.activePanel()).toHaveTextContent("Xiamen");
    expect(view.activePanel()).toHaveTextContent("Batavia");
    expect(view.activePanel()).toHaveTextContent("both remain possible");
    expect(view.activePanel()).toHaveTextContent("1655");
  });

  it("builds a sourced Eurasian contact corridor rather than one causal caravan", () => {
    const view = renderStage({ scene: 4, beat: 3 });
    expect(
      view.activePanel()?.querySelectorAll('[data-land-language-node="true"]')
        .length,
    ).toBeGreaterThanOrEqual(7);
    expect(view.activePanel()).toHaveTextContent("Persian");
    expect(view.activePanel()).toHaveTextContent("Russian");
    expect(view.activePanel()).toHaveTextContent("Hindi");
    expect(view.activePanel()).toHaveTextContent("network");
  });

  it("ends with exceptions and states that the route split is a pattern, not a rule", () => {
    const view = renderStage({ scene: 5 });
    expect(
      view.activePanel()?.querySelectorAll('[data-route-exception="true"]'),
    ).toHaveLength(3);
    expect(view.activePanel()).toHaveTextContent("Portuguese chá");
    expect(view.activePanel()).toHaveTextContent("English chaa");
    expect(view.activePanel()).toHaveTextContent("STRONG PATTERN");
    expect(view.activePanel()).toHaveTextContent("NOT A RULE");
  });
});

describe("Tea / Cha Routes navigation and deterministic modes", () => {
  it("renders a branched route navigator with complete audit attributes", () => {
    const view = renderStage({ scene: 2 });
    const nav = view.root()?.querySelector<HTMLElement>(
      '[data-topic-navigation="true"]',
    );

    expect(nav).toHaveAttribute("data-navigation-geometry", "path");
    expect(nav).toHaveAttribute(
      "data-navigation-carrier",
      "tea-cha-route-lines",
    );
    expect(nav).toHaveAttribute("data-navigation-invocation", "persistent");
    expect(nav).toHaveAttribute(
      "data-navigation-feedback",
      "next-state-preview",
    );
    expect(within(nav!).getAllByRole("button")).toHaveLength(5);
    expect(nav?.querySelectorAll('[data-nav-state="active"]')).toHaveLength(1);
    expect(nav?.querySelectorAll('[data-nav-state="next"]')).toHaveLength(1);
  });

  it("supports click/tap and absolute keyboard jumps without leaking events", () => {
    const onNavigate = vi.fn();
    const onStageClick = vi.fn();
    const view = renderStage({ scene: 2, onNavigate }, onStageClick);
    const nav = view.root()?.querySelector<HTMLElement>(
      '[data-topic-navigation="true"]',
    );
    const fifth = within(nav!).getByRole("button", {
      name: "Scene 5: exceptions",
    });

    fireEvent.pointerDown(fifth);
    fireEvent.click(fifth);
    expect(onNavigate).toHaveBeenLastCalledWith(5, 0);
    expect(onStageClick).not.toHaveBeenCalled();

    const current = within(nav!).getByRole("button", {
      name: "Scene 2: source cluster",
    });
    fireEvent.keyDown(current, { key: "ArrowRight" });
    expect(onNavigate).toHaveBeenLastCalledWith(3, 0);
    fireEvent.keyDown(current, { key: "End" });
    expect(onNavigate).toHaveBeenLastCalledWith(5, 0);
    fireEvent.keyDown(current, { key: "Home" });
    expect(onNavigate).toHaveBeenLastCalledWith(1, 0);
    expect(onStageClick).not.toHaveBeenCalled();
  });

  it("hides navigation in thumbnails and settles reduced-motion frames", () => {
    for (const overrides of [
      { isThumbnail: true, reducedMotion: false },
      { isThumbnail: false, reducedMotion: true },
    ]) {
      const view = renderStage({
        scene: 4,
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
        view.activePanel()?.querySelectorAll('[data-land-language-node="true"]')
          .length,
      ).toBeGreaterThanOrEqual(7);
      view.unmount();
    }
  });
});

describe("Tea / Cha Routes stage hygiene", () => {
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
});

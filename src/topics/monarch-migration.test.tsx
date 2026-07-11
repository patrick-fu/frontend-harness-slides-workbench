import { afterEach, describe, expect, it, vi } from "vitest";
import {
  cleanup,
  fireEvent,
  render,
  waitFor,
  within,
} from "@testing-library/react";
import type { TopicStageProps } from "../domain/topic";
import { runTopicContract } from "../testing/topic-contract";
import topic from "./monarch-migration";

runTopicContract(topic);

const BEAT_COUNTS: Record<number, number> = {
  1: 1,
  2: 3,
  3: 2,
  4: 4,
  5: 1,
};

function factualSources() {
  if (topic.evidence.kind !== "facts") {
    throw new Error("Monarch Migration must retain factual Evidence.");
  }
  return topic.evidence.sources;
}

function renderStage(props: Partial<TopicStageProps> = {}) {
  const onNavigate = props.onNavigate ?? vi.fn();
  const componentProps: TopicStageProps = {
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
      <topic.Stage {...componentProps} />
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
  if (!panel) throw new Error("Active monarch-migration scene was not rendered");
  return panel;
}

afterEach(() => cleanup());

describe("Monarch Migration Topic contract", () => {
  it("retains its identity, seasonal-halo navigation, factual sources, and exact score", () => {
    expect(topic.id).toBe("monarch-migration");
    expect(topic.title).toEqual({
      en: "Monarch Migration",
      zh: "帝王蝶迁徙",
    });
    expect(topic.navigation).toEqual({
      geometry: "ambient",
      carrier: "seasonal-halo",
      invocation: "keyboard-focus",
      feedback: "material-color-change",
    });
    expect(topic.evidence).toMatchObject({ kind: "facts" });
    expect(factualSources()).toHaveLength(4);
    expect(topic.transitionScore).toEqual({
      "1->2": "push-y",
      "2->3": "push-x",
      "3->4": "focus-swap",
      "4->5": "push-y",
    });
  });

  it("ships claim-scoped authoritative sources with explicit route boundaries", () => {
    expect(factualSources().length).toBeGreaterThanOrEqual(3);
    for (const source of factualSources()) {
      const boundary =
        "boundary" in source && typeof source.boundary === "string"
          ? source.boundary
          : undefined;
      expect(source.url).toMatch(/^https:\/\//);
      expect(source.authority?.trim().length ?? 0).toBeGreaterThan(0);
      expect(source.title?.trim().length ?? 0).toBeGreaterThan(8);
      expect(source.citation?.trim().length ?? 0).toBeGreaterThan(20);
      expect(source.supports.trim().length).toBeGreaterThan(50);
      expect(boundary?.trim().length ?? 0).toBeGreaterThan(50);
    }
  });

  it("keeps EN/ZH metadata aligned to the 1/3/2/4/1 narrative curve", () => {
    const en = topic.metadata.en;
    const zh = topic.metadata.zh;
    expect(topic.styleId).toBe("mid-century-grove");
    expect(en.heroScene).toBe(4);
    expect(en.scenes.map((scene) => scene.beats.length)).toEqual([
      1, 3, 2, 4, 1,
    ]);
    expect(zh.scenes.map((scene) => scene.beats.length)).toEqual([
      1, 3, 2, 4, 1,
    ]);
    expect(en.scenes[4].beats.at(-1)?.id).toBe(0);
    expect(zh.scenes[4].beats.at(-1)?.id).toBe(0);

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

describe("Monarch Migration render and evidence", () => {
  it("renders every scene beat in both languages with five distinct compositions", () => {
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
          view.unmount();
        }
      }
      expect(compositions.size).toBe(5);
    }
  });

  it("marks every multi-beat map as a stable reserved layout", () => {
    for (const scene of [2, 3, 4]) {
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

  it("frames the annual cycle as an eastern-population relay, not one butterfly's loop", () => {
    const spring = renderStage({ scene: 2, beat: 2 });
    expect(activePanel(spring.container)).toHaveTextContent(/relay, not a round trip/i);
    expect(activePanel(spring.container)).toHaveTextContent(/next generation/i);
    spring.unmount();

    const summer = renderStage({ scene: 3, beat: 1 });
    expect(activePanel(summer.container)).toHaveTextContent(/successive generations/i);
    expect(activePanel(summer.container)).toHaveTextContent(/vary by place and year/i);
    summer.unmount();

    const autumn = renderStage({ scene: 4, beat: 3 });
    expect(activePanel(autumn.container)).toHaveTextContent(/super generation/i);
    expect(activePanel(autumn.container)).toHaveTextContent(/one long southbound journey/i);
    autumn.unmount();

    const boundary = renderStage({ scene: 5, beat: 0 });
    expect(activePanel(boundary.container)).toHaveTextContent(/eastern migratory population/i);
    expect(activePanel(boundary.container)).toHaveTextContent(/western routes are separate/i);
    boundary.unmount();
  });

  it("keeps the same factual boundaries legible in Chinese", () => {
    const relay = renderStage({ scene: 2, beat: 2, language: "zh" });
    expect(activePanel(relay.container)).toHaveTextContent("接力，不是同一只蝶往返");
    relay.unmount();

    const final = renderStage({ scene: 5, beat: 0, language: "zh" });
    expect(activePanel(final.container)).toHaveTextContent("北美东部迁徙种群");
    expect(activePanel(final.container)).toHaveTextContent("西部路线另行叙述");
  });
});

describe("Monarch Migration transitions and navigation", () => {
  it("renders all four authored transition edges", async () => {
    const baseProps: TopicStageProps = {
      scene: 1,
      beat: 0,
      language: "en",
      isThumbnail: false,
      reducedMotion: false,
      onNavigate: vi.fn(),
    };
    const view = render(
      <div style={{ width: 1920, height: 1080, containerType: "size" }}>
        <topic.Stage {...baseProps} />
      </div>,
    );
    const expected = ["push-y", "push-x", "focus-swap", "push-y"];

    for (let scene = 2; scene <= 5; scene += 1) {
      view.rerender(
        <div style={{ width: 1920, height: 1080, containerType: "size" }}>
          <topic.Stage {...baseProps} scene={scene} />
        </div>,
      );
      await waitFor(() => {
        expect(
          view.container.querySelector('[data-testid="spatial-scene-track"]'),
        ).toHaveAttribute("data-scene-transition-kind", expected[scene - 2]);
      });
    }
  });

  it("exposes a five-season halo with click/tap and Arrow-key fallback", () => {
    const stageClick = vi.fn();
    const onNavigate = vi.fn();
    const view = render(
      <div
        onClick={stageClick}
        style={{ width: 1920, height: 1080, containerType: "size" }}
      >
        <topic.Stage
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
    expect(nav).toHaveAttribute("data-navigation-geometry", "ambient");
    expect(nav).toHaveAttribute("data-navigation-carrier", "seasonal-halo");
    expect(nav).toHaveAttribute("data-navigation-invocation", "keyboard-focus");
    expect(nav).toHaveAttribute(
      "data-navigation-feedback",
      "material-color-change",
    );
    const buttons = within(nav!).getAllByRole("button");
    expect(buttons).toHaveLength(5);
    expect(new Set(buttons.map((button) => button.dataset.material)).size).toBe(5);

    const autumn = within(nav!).getByRole("button", {
      name: "Scene 4: Autumn return",
    });
    fireEvent.pointerDown(autumn);
    fireEvent.click(autumn);
    expect(onNavigate).toHaveBeenCalledWith(4, 0);
    expect(stageClick).not.toHaveBeenCalled();

    const current = within(nav!).getByRole("button", {
      name: "Scene 2: Spring relay",
    });
    fireEvent.keyDown(current, { key: "ArrowRight" });
    expect(onNavigate).toHaveBeenCalledWith(3, 0);
  });

  it("hides the halo in thumbnails and settles reduced-motion frames", () => {
    for (const props of [
      { isThumbnail: true, reducedMotion: false },
      { isThumbnail: false, reducedMotion: true },
    ]) {
      const view = renderStage({
        scene: 4,
        beat: 3,
        ...props,
        onNavigate: undefined,
      });
      expect(
        view.container.querySelector('[data-testid="spatial-scene-strip"]'),
      ).toHaveAttribute("data-reduced-motion", "true");
      expect(
        view.container.querySelector('[data-transition-clone="true"]'),
      ).toBeNull();
      if (props.isThumbnail) {
        expect(
          view.container.querySelector('[data-topic-navigation="true"]'),
        ).toBeNull();
        expect(
          activePanel(view.container).querySelector("[data-composition]"),
        ).toHaveAttribute("data-beat", "3");
      }
      view.unmount();
    }
  });
});

describe("Monarch Migration stage safety", () => {
  it("clips every final beat in both languages to the fixed stage", () => {
    for (const language of ["en", "zh"] as const) {
      for (let scene = 1; scene <= 5; scene += 1) {
        const view = renderStage({
          scene,
          beat: BEAT_COUNTS[scene] - 1,
          language,
          reducedMotion: true,
        });
        expect(view.stage.scrollWidth).toBeLessThanOrEqual(
          view.stage.clientWidth + 1,
        );
        expect(view.stage.scrollHeight).toBeLessThanOrEqual(
          view.stage.clientHeight + 1,
        );
        view.unmount();
      }
    }
  });
});

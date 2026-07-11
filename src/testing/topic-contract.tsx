import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  defineTopic,
  SCENE_TRANSITION_KINDS,
  type TopicDefinition,
  type TopicStageProps,
} from "../domain/topic";

const STAGE_STYLE = {
  width: 1920,
  height: 1080,
  containerType: "size",
  overflow: "hidden",
  position: "relative",
} as const;

function renderFrame(
  topic: TopicDefinition,
  props: Pick<TopicStageProps, "scene" | "beat" | "language"> &
    Partial<Omit<TopicStageProps, "scene" | "beat" | "language">>,
) {
  const stageProps: TopicStageProps = {
    isThumbnail: false,
    reducedMotion: true,
    ...props,
  };

  return render(
    <div data-topic-contract-stage="true" style={STAGE_STYLE}>
      <topic.Stage {...stageProps} />
    </div>,
  );
}

export function runTopicContract(topic: TopicDefinition): void {
  describe(`${topic.id} Topic contract`, () => {
    it("satisfies the canonical TopicDefinition contract", () => {
      expect(() => defineTopic(topic)).not.toThrow();
    });

    it("keeps its bilingual title concise for Catalog controls", () => {
      expect(topic.title.en.trim()).not.toHaveLength(0);
      expect(topic.title.zh.trim()).not.toHaveLength(0);
      expect(topic.title.en.length).toBeLessThanOrEqual(32);
      expect(topic.title.zh.length).toBeLessThanOrEqual(8);
    });

    for (const language of ["en", "zh"] as const) {
      it(`renders every authored ${language} Scene and Beat through the shared lifecycle`, () => {
        const metadata = topic.metadata[language];

        for (const scene of metadata.scenes) {
          for (const beat of scene.beats) {
            const frame = renderFrame(topic, {
              scene: scene.id,
              beat: beat.id,
              language,
            });
            const activePanel = frame.container.querySelector<HTMLElement>(
              '[data-testid="spatial-scene-panel"][data-active="true"]',
            );

            expect(
              frame.container.querySelector(
                '[data-testid="spatial-scene-track"]',
              ),
              `${topic.id} must use SpatialSceneTrack`,
            ).not.toBeNull();
            expect(
              frame.container.querySelectorAll(
                '[data-testid="spatial-scene-panel"]',
              ).length,
              `${topic.id} must keep all Scene panels mounted`,
            ).toBeGreaterThanOrEqual(5);
            expect(activePanel?.dataset.sceneId).toBe(String(scene.id));
            expect(
              frame.container.querySelector('[data-transition-clone="true"]'),
            ).toBeNull();
            frame.unmount();
          }
        }
      });
    }

    it("renders the declared transition score on every Scene edge", () => {
      const metadata = topic.metadata.en;
      const initialBeat = metadata.scenes[0]?.beats[0]?.id ?? 0;
      const frame = renderFrame(topic, {
        scene: 1,
        beat: initialBeat,
        language: "en",
        reducedMotion: false,
      });

      for (let targetScene = 2; targetScene <= 5; targetScene += 1) {
        frame.rerender(
          <div data-topic-contract-stage="true" style={STAGE_STYLE}>
            <topic.Stage
              scene={targetScene}
              beat={metadata.scenes[targetScene - 1]?.beats[0]?.id ?? 0}
              language="en"
              isThumbnail={false}
              reducedMotion={false}
            />
          </div>,
        );
        const transitionKind = frame.container.querySelector<HTMLElement>(
          '[data-testid="spatial-scene-track"]',
        )?.dataset.sceneTransitionKind;
        const edge = `${targetScene - 1}->${targetScene}` as
          keyof TopicDefinition["transitionScore"];

        expect(SCENE_TRANSITION_KINDS).toContain(transitionKind);
        expect(transitionKind).toBe(topic.transitionScore[edge]);
      }
      frame.unmount();
    });

    it("declares stable layout for every multi-Beat Scene", () => {
      for (const scene of topic.metadata.en.scenes.filter(
        (candidate) => candidate.beats.length > 1,
      )) {
        const finalBeat = scene.beats.at(-1);
        if (!finalBeat) continue;
        const frame = renderFrame(topic, {
          scene: scene.id,
          beat: finalBeat.id,
          language: "en",
        });
        const activePanel = frame.container.querySelector<HTMLElement>(
          '[data-testid="spatial-scene-panel"][data-active="true"]',
        );
        const layout = activePanel?.matches(
          '[data-beat-layout-container="true"]',
        )
          ? activePanel
          : activePanel?.querySelector<HTMLElement>(
              '[data-beat-layout-container="true"]',
            );

        expect(layout?.dataset.beatLayoutMode).toMatch(/^(motion|reserved)$/);
        if (layout !== activePanel) {
          expect(
            layout?.querySelectorAll('[data-beat-layout-item="true"]').length ??
              0,
          ).toBeGreaterThanOrEqual(2);
        }
        frame.unmount();
      }
    });

    it("keeps declared internal navigation aligned with rendered controls", () => {
      const firstScene = topic.metadata.en.scenes[0];
      const firstBeat = firstScene?.beats[0];
      if (!firstScene || !firstBeat) {
        throw new Error(`Topic "${topic.id}" has no initial frame.`);
      }
      const frame = renderFrame(topic, {
        scene: firstScene.id,
        beat: firstBeat.id,
        language: "en",
        reducedMotion: false,
        onNavigate: () => undefined,
      });
      const navigation = frame.container.querySelector<HTMLElement>(
        '[data-topic-navigation="true"]',
      );

      if ("mode" in topic.navigation) {
        expect(navigation).toBeNull();
      } else {
        expect(navigation).toHaveAttribute(
          "data-navigation-geometry",
          topic.navigation.geometry,
        );
        expect(navigation).toHaveAttribute(
          "data-navigation-carrier",
          topic.navigation.carrier,
        );
        expect(navigation).toHaveAttribute(
          "data-navigation-invocation",
          topic.navigation.invocation,
        );
        expect(navigation).toHaveAttribute(
          "data-navigation-feedback",
          topic.navigation.feedback,
        );
      }
      frame.unmount();

      const thumbnail = renderFrame(topic, {
        scene: firstScene.id,
        beat: firstBeat.id,
        language: "en",
        isThumbnail: true,
        onNavigate: undefined,
      });
      expect(
        thumbnail.container.querySelector('[data-topic-navigation="true"]'),
      ).toBeNull();
      thumbnail.unmount();
    });

    it("renders a Stage-owned Evidence boundary when the contract assigns it to the Stage", () => {
      if (
        (topic.evidence.kind !== "illustrative" &&
          topic.evidence.kind !== "mixed") ||
        topic.evidence.display !== "stage"
      ) {
        return;
      }
      const metadata = topic.metadata.en;
      const hero = metadata.scenes.find(
        (scene) => scene.id === metadata.heroScene,
      );
      const finalBeat = hero?.beats.at(-1);
      if (!hero || !finalBeat) {
        throw new Error(`Topic "${topic.id}" has no Hero Final Frame.`);
      }
      const frame = renderFrame(topic, {
        scene: hero.id,
        beat: finalBeat.id,
        language: "en",
      });
      const boundary = frame.container.querySelector(
        '[data-topic-evidence-boundary="true"]',
      );

      expect(boundary).toHaveTextContent(topic.evidence.boundary.en);
      frame.unmount();
    });
  });
}

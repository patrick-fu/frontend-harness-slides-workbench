import { cleanup, render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { defineTopic, type TopicDefinition } from "../domain/topic";

export function runTopicContract(topic: TopicDefinition): void {
  describe(`${topic.id} Topic contract`, () => {
    it("satisfies the canonical TopicDefinition contract", () => {
      expect(() => defineTopic(topic)).not.toThrow();
    });

    for (const language of ["en", "zh"] as const) {
      it(`renders the ${language} Hero Final Frame deterministically`, () => {
        const metadata = topic.metadata[language];
        const hero = metadata.scenes.find(
          (scene) => scene.id === metadata.heroScene,
        );
        if (!hero) {
          throw new Error(
            `Topic "${topic.id}" ${language} metadata references missing Hero Scene ${metadata.heroScene}.`,
          );
        }
        const finalBeat = hero.beats.at(-1);
        if (!finalBeat) {
          throw new Error(
            `Topic "${topic.id}" ${language} Hero Scene has no Beats.`,
          );
        }

        const { container } = render(
          <div
            data-topic-contract-stage="true"
            style={{
              width: 1920,
              height: 1080,
              containerType: "size",
              overflow: "hidden",
              position: "relative",
            }}
          >
            <topic.Stage
              scene={hero.id}
              beat={finalBeat.id}
              language={language}
              isThumbnail
              reducedMotion
            />
          </div>,
        );

        expect(
          container.querySelector('[data-topic-contract-stage="true"]')
            ?.firstElementChild,
        ).not.toBeNull();
        cleanup();
      });
    }
  });
}

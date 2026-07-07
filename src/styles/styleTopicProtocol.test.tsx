import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { STYLE_REGISTRY } from "./registry";
import type { BespokeStyleProps, StyleTopic } from "../types";

function renderTopic(
  topic: StyleTopic,
  props: Partial<BespokeStyleProps> = {},
) {
  const Component = topic.component;
  return render(
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
      <Component
        scene={1}
        beat={0}
        language="en"
        isThumbnail={false}
        reducedMotion={false}
        {...props}
      />
    </div>,
  );
}

const allTopics = STYLE_REGISTRY.flatMap((style) =>
  style.topics.map((topic) => ({ styleId: style.id, topic })),
);
const secondaryTopics = STYLE_REGISTRY.flatMap((style) =>
  style.topics.slice(1).map((topic) => ({ styleId: style.id, topic })),
);

const numberedStyleSources = import.meta.glob("./[0-9][0-9]-*.tsx", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;
const semanticStyleSources = import.meta.glob(
  "./engineering-whiteboard-explainer.tsx",
  {
    query: "?raw",
    import: "default",
    eager: true,
  },
) as Record<string, string>;
const styleSources = { ...numberedStyleSources, ...semanticStyleSources };

const SCENE_TRANSITION_KINDS = [
  "slide-x",
  "slide-y",
  "fade",
  "scale-fade",
  "hard-cut",
  "wipe",
  "page-flip",
  "glitch",
] as const;

describe("style topic protocol", () => {
  it("requires every topic to use the spatial scene lifecycle", () => {
    for (const { styleId, topic } of allTopics) {
      const { container, unmount } = renderTopic(topic);
      const track = container.querySelector(
        '[data-testid="spatial-scene-track"]',
      );
      const panels = container.querySelectorAll(
        '[data-testid="spatial-scene-panel"]',
      );

      expect(
        track,
        `${styleId}/${topic.id} must render SpatialSceneTrack`,
      ).not.toBeNull();
      expect(
        panels.length,
        `${styleId}/${topic.id} must render mounted scene panels instead of transition clones`,
      ).toBeGreaterThanOrEqual(5);
      expect(
        container.querySelector("[data-transition-clone='true']"),
        `${styleId}/${topic.id} must not render outgoing transition clones`,
      ).toBeNull();

      unmount();
    }
  });

  it("requires every style source to explicitly choose scene transition behavior", () => {
    for (const [sourcePath, source] of Object.entries(styleSources)) {
      if (sourcePath.includes(".test.")) continue;

      expect(
        source,
        `${sourcePath} must pass transitionKind or transitionMap to SpatialSceneTrack so scene motion is not silently homogenized`,
      ).toMatch(/\btransition(?:Kind|Map)=/);
    }
  });

  it("keeps scene transition kinds diverse across the full style set", () => {
    const usedKinds = new Set<string>();

    for (const { styleId, topic } of allTopics) {
      const { container, unmount } = renderTopic(topic);
      const track = container.querySelector(
        '[data-testid="spatial-scene-track"]',
      ) as HTMLElement | null;
      const transitionKind = track?.dataset.sceneTransitionKind;

      expect(
        transitionKind,
        `${styleId}/${topic.id} must expose data-scene-transition-kind`,
      ).toBeDefined();
      expect(
        SCENE_TRANSITION_KINDS,
        `${styleId}/${topic.id} uses unsupported transition kind ${transitionKind}`,
      ).toContain(transitionKind as (typeof SCENE_TRANSITION_KINDS)[number]);
      usedKinds.add(transitionKind as string);
      unmount();
    }

    expect(
      usedKinds.size,
      `The style set should keep a varied transition vocabulary, not collapse into ${Array.from(usedKinds).join(", ")}`,
    ).toBeGreaterThanOrEqual(6);
    expect(usedKinds).not.toEqual(new Set(["slide-x"]));
  });

  it("keeps style sources off legacy outgoing-clone lifecycle hooks", () => {
    for (const [sourcePath, source] of Object.entries(styleSources)) {
      if (sourcePath.includes(".test.")) continue;

      expect(
        source,
        `${sourcePath} must not read the deprecated isTransitionClone prop`,
      ).not.toMatch(/\bisTransitionClone\b/);
      expect(
        source,
        `${sourcePath} must not maintain outgoingScene clone state`,
      ).not.toMatch(/\boutgoingScene\b|\btransitionInfo\b/);
      expect(
        source,
        `${sourcePath} must not emit transition clone markers`,
      ).not.toMatch(/data-transition-clone/);
    }
  });

  it("requires every topic to declare a beat layout strategy for multi-beat scenes", () => {
    for (const { styleId, topic } of allTopics) {
      const metadata = topic.getMetadata("en");
      const multiBeatScenes = metadata.scenes.filter(
        (scene) => scene.beats.length > 1,
      );

      for (const scene of multiBeatScenes) {
        const { container, unmount } = renderTopic(topic, {
          scene: scene.id,
          beat: scene.beats.length - 1,
        });
        const activePanel = container.querySelector(
          '[data-testid="spatial-scene-panel"][data-active="true"]',
        ) as HTMLElement | null;
        const layoutContainer = activePanel?.matches(
          '[data-beat-layout-container="true"]',
        )
          ? activePanel
          : activePanel?.querySelector(
            '[data-beat-layout-container="true"]',
          ) as HTMLElement | null;
        const layoutMode = layoutContainer?.dataset.beatLayoutMode;
        const layoutItems = layoutContainer?.querySelectorAll(
          '[data-beat-layout-item="true"]',
        );

        expect(
          layoutContainer,
          `${styleId}/${topic.id} scene ${scene.id} must mark the beat layout container`,
        ).not.toBeNull();
        expect(
          layoutMode,
          `${styleId}/${topic.id} scene ${scene.id} must choose data-beat-layout-mode="motion" or "reserved"`,
        ).toMatch(/^(motion|reserved)$/);
        if (layoutContainer !== activePanel) {
          expect(
            layoutItems?.length ?? 0,
            `${styleId}/${topic.id} scene ${scene.id} nested beat layout containers must mark stable children for the chosen strategy`,
          ).toBeGreaterThanOrEqual(2);
        }
        unmount();
      }
    }
  }, 20000);

  it("requires registry topics to use semantic IDs without legacy aliases", () => {
    expect(STYLE_REGISTRY.length).toBe(49);

    for (const style of STYLE_REGISTRY) {
      const topicIds = style.topics.map((topic) => topic.id);

      expect(style.topics.length, `style ${style.id} must expose topics`).toBeGreaterThan(0);
      expect((style as { versions?: unknown }).versions).toBeUndefined();
      expect(new Set(topicIds).size, `style ${style.id} topic IDs must be unique`).toBe(
        topicIds.length,
      );
      expect(
        topicIds.every((topicId) => /^[a-z0-9][a-z0-9-]*$/.test(topicId)),
        `style ${style.id} topic IDs must be lowercase slugs`,
      ).toBe(true);
      expect(
        topicIds.some((topicId) => /^v\d+$/.test(topicId)),
        `style ${style.id} must not expose legacy v-number topic IDs`,
      ).toBe(false);
    }
  });

  it("requires every topic to be localized and concise", () => {
    for (const { styleId, topic } of allTopics) {
      expect(
        topic.topic.en.trim(),
        `${styleId}/${topic.id} must define an English topic`,
      ).not.toHaveLength(0);
      expect(
        topic.topic.zh.trim(),
        `${styleId}/${topic.id} must define a Chinese topic`,
      ).not.toHaveLength(0);
      expect(
        topic.topic.en.length,
        `${styleId}/${topic.id} English topic should stay compact for the topic switcher`,
      ).toBeLessThanOrEqual(32);
      expect(
        topic.topic.zh.length,
        `${styleId}/${topic.id} Chinese topic should stay compact for the topic switcher`,
      ).toBeLessThanOrEqual(8);
    }
  });

  it("requires secondary topics to render a supported per-edge transition map", () => {
    const usedKinds = new Set<string>();

    for (const { styleId, topic } of secondaryTopics) {
      const Component = topic.component;
      const { container, rerender, unmount } = render(
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
          <Component
            scene={1}
            beat={0}
            language="en"
            isThumbnail={false}
            reducedMotion={false}
          />
        </div>,
      );

      for (let targetScene = 2; targetScene <= 5; targetScene++) {
        rerender(
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
            <Component
              scene={targetScene}
              beat={0}
              language="en"
              isThumbnail={false}
              reducedMotion={false}
            />
          </div>,
        );

        const transitionKind = container.querySelector<HTMLElement>(
          '[data-testid="spatial-scene-track"]',
        )?.dataset.sceneTransitionKind;

        expect(
          SCENE_TRANSITION_KINDS,
          `${styleId}/${topic.id} edge ${targetScene - 1}->${targetScene} must expose a supported transition kind`,
        ).toContain(transitionKind as (typeof SCENE_TRANSITION_KINDS)[number]);
        usedKinds.add(transitionKind as string);
      }

      unmount();
    }

    expect(
      usedKinds.size,
      `secondary topic transitions must remain varied, not collapse into ${Array.from(usedKinds).join(", ")}`,
    ).toBeGreaterThanOrEqual(6);
  });
});

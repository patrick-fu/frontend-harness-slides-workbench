import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { STYLE_REGISTRY } from "./registry";
import { STYLE_CATALOG_SOURCE } from "./catalog-source";
import { CATALOG_MANIFEST } from "./catalog-manifest.generated";
import {
  CURATED_TOPIC_CONTRACTS,
  CURATED_TOPIC_SET_ID,
  CURATED_STYLE_NAMES,
} from "./curated-topic-contract";
import {
  hasVisibleTopicNavigation,
  type BespokeStyleProps,
  type StyleTopic,
} from "../types";
import {
  CANONICAL_SCENE_TRANSITION_KINDS,
  LEGACY_SCENE_TRANSITION_KINDS,
} from "./SpatialSceneTrack";

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

// Runtime registry components are lazy by design. The authoring protocol must
// inspect concrete Topic implementations without forcing the Catalog bundle to
// import them eagerly.
const allTopics = STYLE_CATALOG_SOURCE.flatMap((style) =>
  style.topics.map((topic) => ({ styleId: style.id, topic })),
);
const secondaryTopics = STYLE_CATALOG_SOURCE.flatMap((style) =>
  style.topics.slice(1).map((topic) => ({ styleId: style.id, topic })),
);
const coordinatedTopics = allTopics.filter(({ topic }) =>
  hasVisibleTopicNavigation(topic.navigation),
);
const curatedTopics = allTopics.filter(
  ({ topic }) => topic.topicSet === CURATED_TOPIC_SET_ID,
);

const numberedStyleSources = import.meta.glob("./[0-9][0-9]-*.tsx", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;
const semanticStyleSources = import.meta.glob(
  "./engineering-whiteboard-*.tsx",
  {
    query: "?raw",
    import: "default",
    eager: true,
  },
) as Record<string, string>;
const styleSources = { ...numberedStyleSources, ...semanticStyleSources };

const SCENE_TRANSITION_KINDS = [
  ...CANONICAL_SCENE_TRANSITION_KINDS,
  ...LEGACY_SCENE_TRANSITION_KINDS,
] as const;

describe("style topic protocol", () => {
  it("keeps the curated Topic Set declared, complete, and distinct from legacy navigation", () => {
    expect(CURATED_TOPIC_CONTRACTS.length).toBeGreaterThan(0);
    expect(curatedTopics).toHaveLength(CURATED_TOPIC_CONTRACTS.length);

    for (const contract of CURATED_TOPIC_CONTRACTS) {
      const registered = curatedTopics.find(
        ({ styleId, topic }) =>
          styleId === contract.styleId && topic.id === contract.topicId,
      )?.topic;

      expect(
        registered,
        `${contract.styleId}/${contract.topicId} must be registered in ${CURATED_TOPIC_SET_ID}`,
      ).toBeDefined();
      expect(registered?.model).toBe("GPT 5.6 Sol");
      expect(registered?.transitionScore).toEqual(contract.transitionScore);
      expect(registered?.navigation).toEqual(contract.navigation);
      expect(registered?.evidence).toEqual(contract.evidence);
      expect(registered?.topicSet).toBe(CURATED_TOPIC_SET_ID);

      const expectedStyleName = CURATED_STYLE_NAMES[contract.styleId];
      expect(expectedStyleName).toBeDefined();
      const metadataEn = registered!.getMetadata("en");
      const metadataZh = registered!.getMetadata("zh");
      expect(metadataEn.name).toBe(expectedStyleName.en);
      expect(metadataZh.name).toBe(expectedStyleName.zh);
      expect(
        metadataEn.scenes.map((scene) => ({
          id: scene.id,
          beats: scene.beats.map((beat) => beat.id),
        })),
      ).toEqual(
        metadataZh.scenes.map((scene) => ({
          id: scene.id,
          beats: scene.beats.map((beat) => beat.id),
        })),
      );

      for (const language of ["en", "zh"] as const) {
        const metadata = registered!.getMetadata(language);
        for (const scene of metadata.scenes) {
          for (const beat of scene.beats) {
            const frame = renderTopic(registered!, {
              language,
              scene: scene.id,
              beat: beat.id,
            });
            expect(
              frame.container.querySelector(
                '[data-testid="spatial-scene-panel"][data-active="true"]',
              ),
              `${contract.styleId}/${contract.topicId} must render ${language} scene ${scene.id} beat ${beat.id}`,
            ).not.toBeNull();
            frame.unmount();
          }
        }
      }

      if (contract.evidence.kind === "illustrative") {
        expect(contract.evidence.boundary.en.trim()).not.toHaveLength(0);
        expect(contract.evidence.boundary.zh.trim()).not.toHaveLength(0);
      } else {
        expect(registered?.sources?.length ?? 0).toBeGreaterThan(0);
      }

      if (!hasVisibleTopicNavigation(contract.navigation)) {
        const { container, unmount } = renderTopic(registered!);
        expect(
          container.querySelector('[data-topic-navigation="true"]'),
          `${contract.styleId}/${contract.topicId} explicitly declares no visible navigation`,
        ).toBeNull();
        unmount();
      }
    }
  }, 60_000);

  it("settles curated capture frames before their first paint", () => {
    const onboarding = curatedTopics.find(
      ({ topic }) => topic.id === "onboarding-toolkit",
    )?.topic;
    expect(onboarding).toBeDefined();

    for (const props of [
      { reducedMotion: true, isThumbnail: false },
      { reducedMotion: false, isThumbnail: true },
    ]) {
      const frame = renderTopic(onboarding!, props);
      const title = frame.container.querySelector("h1") as HTMLElement | null;
      expect(title).not.toBeNull();
      expect(title?.style.opacity).toBe("1");
      expect(title?.style.transform).toBe("translateY(0)");
      frame.unmount();
    }

    const launch = curatedTopics.find(
      ({ topic }) => topic.id === "three-teams-launch",
    )?.topic;
    expect(launch).toBeDefined();
    const frozen = renderTopic(launch!, { reducedMotion: true });
    expect(
      frozen.container.querySelector<HTMLElement>("[data-route-progress='true']")
        ?.style.transition,
    ).toBe("none");
    frozen.unmount();
  });

  it("shows the synthetic churn evidence boundary in both languages", () => {
    const churn = curatedTopics.find(
      ({ topic }) => topic.id === "why-users-churn",
    )?.topic;
    const contract = CURATED_TOPIC_CONTRACTS.find(
      ({ topicId }) => topicId === "why-users-churn",
    );
    expect(churn).toBeDefined();
    expect(contract?.evidence.kind).toBe("illustrative");
    if (!churn || contract?.evidence.kind !== "illustrative") return;

    for (const language of ["en", "zh"] as const) {
      const frame = renderTopic(churn, { language });
      expect(frame.container).toHaveTextContent(
        contract.evidence.boundary[language],
      );
      frame.unmount();
    }
  });

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
  }, 15_000);

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
    expect(STYLE_REGISTRY).toHaveLength(CATALOG_MANIFEST.length);

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
        const edge = `${targetScene - 1}->${targetScene}` as
          | "1->2"
          | "2->3"
          | "3->4"
          | "4->5";
        if (topic.transitionScore) {
          expect(
            transitionKind,
            `${styleId}/${topic.id} must render its declared transition score on edge ${edge}`,
          ).toBe(topic.transitionScore[edge]);
        }
        usedKinds.add(transitionKind as string);
      }

      unmount();
    }

    expect(
      usedKinds.size,
      `secondary topic transitions must remain varied, not collapse into ${Array.from(usedKinds).join(", ")}`,
    ).toBeGreaterThanOrEqual(6);
  }, 15_000);

  it("keeps coordinated navigation profiles unique and reflected in the rendered control", () => {
    const carriersByTopicSet = new Map<string, Set<string>>();
    const invocationFeedbackPairsByTopicSet = new Map<string, Set<string>>();

    for (const { styleId, topic } of coordinatedTopics) {
      const profile = topic.navigation!;
      if (!hasVisibleTopicNavigation(profile)) continue;
      const topicSet = topic.topicSet ?? "legacy-unscoped";
      const pair = `${profile.invocation}/${profile.feedback}`;
      const transitionScore = topic.transitionScore;
      const carriers = carriersByTopicSet.get(topicSet) ?? new Set<string>();
      const invocationFeedbackPairs =
        invocationFeedbackPairsByTopicSet.get(topicSet) ?? new Set<string>();

      expect(
        transitionScore,
        `${styleId}/${topic.id} must declare its four-edge transition score`,
      ).toBeDefined();
      const scoreKinds = transitionScore
        ? [
            transitionScore["1->2"],
            transitionScore["2->3"],
            transitionScore["3->4"],
            transitionScore["4->5"],
          ]
        : [];
      expect(scoreKinds).toHaveLength(4);
      for (const transitionKind of scoreKinds) {
        expect(SCENE_TRANSITION_KINDS).toContain(transitionKind);
      }

      if (topic.evidence?.kind === "illustrative") {
        expect(
          topic.evidence.boundary.en.trim(),
          `${styleId}/${topic.id} illustrative evidence must state an English boundary`,
        ).not.toHaveLength(0);
        expect(
          topic.evidence.boundary.zh.trim(),
          `${styleId}/${topic.id} illustrative evidence must state a Chinese boundary`,
        ).not.toHaveLength(0);
      } else {
        expect(
          topic.sources?.length ?? 0,
          `${styleId}/${topic.id} must carry at least three traceable sources`,
        ).toBeGreaterThanOrEqual(3);
        for (const source of topic.sources ?? []) {
          expect(
            source.url,
            `${styleId}/${topic.id} source URLs must be absolute HTTPS links`,
          ).toMatch(/^https:\/\//);
          expect(
            source.supports.trim(),
            `${styleId}/${topic.id} sources must state the supported claim`,
          ).not.toHaveLength(0);
          expect(
            Boolean(source.authority || source.title || source.citation),
            `${styleId}/${topic.id} sources must identify their authority or citation`,
          ).toBe(true);
        }
      }

      expect(
        profile.carrier,
        `${styleId}/${topic.id} must use a stable carrier slug`,
      ).toMatch(/^[a-z0-9][a-z0-9-]*$/);
      expect(
        carriers.has(profile.carrier),
        `${styleId}/${topic.id} repeats navigation carrier ${profile.carrier}`,
      ).toBe(false);
      expect(
        invocationFeedbackPairs.has(pair),
        `${styleId}/${topic.id} repeats invocation/feedback pair ${pair}`,
      ).toBe(false);
      carriers.add(profile.carrier);
      invocationFeedbackPairs.add(pair);
      carriersByTopicSet.set(topicSet, carriers);
      invocationFeedbackPairsByTopicSet.set(topicSet, invocationFeedbackPairs);

      const { container, unmount } = renderTopic(topic, { onNavigate: () => {} });
      const navigation = container.querySelector<HTMLElement>(
        '[data-topic-navigation="true"]',
      );

      expect(
        navigation,
        `${styleId}/${topic.id} must expose its internal navigation contract`,
      ).not.toBeNull();
      expect(navigation).toHaveAttribute(
        "data-navigation-geometry",
        profile.geometry,
      );
      expect(navigation).toHaveAttribute(
        "data-navigation-carrier",
        profile.carrier,
      );
      expect(navigation).toHaveAttribute(
        "data-navigation-invocation",
        profile.invocation,
      );
      expect(navigation).toHaveAttribute(
        "data-navigation-feedback",
        profile.feedback,
      );
      unmount();

      const thumbnail = renderTopic(topic, {
        isThumbnail: true,
        onNavigate: undefined,
      });
      expect(
        thumbnail.container.querySelector('[data-topic-navigation="true"]'),
        `${styleId}/${topic.id} must hide internal navigation in thumbnails`,
      ).toBeNull();
      thumbnail.unmount();
    }
  });
});

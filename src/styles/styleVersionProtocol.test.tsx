import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { STYLE_REGISTRY } from "./registry";
import type { BespokeStyleProps, StyleVersion } from "../types";

function renderVersion(
  version: StyleVersion,
  props: Partial<BespokeStyleProps> = {},
) {
  const Component = version.component;
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

const allVersions = STYLE_REGISTRY.flatMap((style) =>
  style.versions.map((version) => ({ styleId: style.id, version })),
);
const curatedV2Versions = STYLE_REGISTRY.map((style) => ({
  styleId: style.id,
  version: style.versions.find((version) => version.id === "v2"),
}));
const REQUIRED_CURATED_V2_STYLE_IDS = [
  "01",
  "02",
  "03",
  "04",
  "05",
  "06",
  "07",
  "08",
  "09",
  "10",
  "11",
  "12",
  "13",
  "14",
  "15",
  "16",
  "17",
  "18",
  "19",
  "20",
  "21",
  "22",
  "23",
  "24",
  "25",
  "26",
  "27",
  "28",
  "29",
  "30",
  "31",
  "32",
];

const styleSources = import.meta.glob("./[0-9][0-9]-*.tsx", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

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

describe("style version protocol", () => {
  it("requires every version to use the spatial scene lifecycle", () => {
    for (const { styleId, version } of allVersions) {
      const { container, unmount } = renderVersion(version);
      const track = container.querySelector(
        '[data-testid="spatial-scene-track"]',
      );
      const panels = container.querySelectorAll(
        '[data-testid="spatial-scene-panel"]',
      );

      expect(
        track,
        `${styleId}/${version.id} must render SpatialSceneTrack`,
      ).not.toBeNull();
      expect(
        panels.length,
        `${styleId}/${version.id} must render mounted scene panels instead of transition clones`,
      ).toBeGreaterThanOrEqual(5);
      expect(
        container.querySelector("[data-transition-clone='true']"),
        `${styleId}/${version.id} must not render outgoing transition clones`,
      ).toBeNull();

      unmount();
    }
  });

  it("requires every style source to explicitly choose a scene transition kind", () => {
    for (const [sourcePath, source] of Object.entries(styleSources)) {
      if (sourcePath.includes(".test.")) continue;

      expect(
        source,
        `${sourcePath} must pass transitionKind to SpatialSceneTrack so scene motion is not silently homogenized`,
      ).toMatch(/\btransitionKind=/);
    }
  });

  it("keeps scene transition kinds diverse across the full style set", () => {
    const usedKinds = new Set<string>();

    for (const { styleId, version } of allVersions) {
      const { container, unmount } = renderVersion(version);
      const track = container.querySelector(
        '[data-testid="spatial-scene-track"]',
      ) as HTMLElement | null;
      const transitionKind = track?.dataset.sceneTransitionKind;

      expect(
        transitionKind,
        `${styleId}/${version.id} must expose data-scene-transition-kind`,
      ).toBeDefined();
      expect(
        SCENE_TRANSITION_KINDS,
        `${styleId}/${version.id} uses unsupported transition kind ${transitionKind}`,
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

  it("requires every version to declare a beat layout strategy for multi-beat scenes", () => {
    for (const { styleId, version } of allVersions) {
      const metadata = version.getMetadata("en");
      const multiBeatScenes = metadata.scenes.filter(
        (scene) => scene.beats.length > 1,
      );

      for (const scene of multiBeatScenes) {
        const { container, unmount } = renderVersion(version, {
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
          `${styleId}/${version.id} scene ${scene.id} must mark the beat layout container`,
        ).not.toBeNull();
        expect(
          layoutMode,
          `${styleId}/${version.id} scene ${scene.id} must choose data-beat-layout-mode="motion" or "reserved"`,
        ).toMatch(/^(motion|reserved)$/);
        if (layoutContainer !== activePanel) {
          expect(
            layoutItems?.length ?? 0,
            `${styleId}/${version.id} scene ${scene.id} nested beat layout containers must mark stable children for the chosen strategy`,
          ).toBeGreaterThanOrEqual(2);
        }
        unmount();
      }
    }
  });

  it("requires completed style batches to expose the curated v2 version without removing v1", () => {
    expect(STYLE_REGISTRY).toHaveLength(48);

    for (const style of STYLE_REGISTRY.filter((entry) =>
      REQUIRED_CURATED_V2_STYLE_IDS.includes(entry.id),
    )) {
      const versionIds = style.versions.map((version) => version.id);

      expect(versionIds, `style ${style.id} must keep legacy v1`).toContain("v1");
      expect(versionIds, `style ${style.id} must expose curated v2`).toContain("v2");
    }
  });

  it("requires every curated v2 version to render a per-edge transition map", () => {
    const usedKinds = new Set<string>();

    for (const { styleId, version } of curatedV2Versions.filter((entry) =>
      REQUIRED_CURATED_V2_STYLE_IDS.includes(entry.styleId),
    )) {
      expect(version, `${styleId} must register a v2 version`).toBeDefined();
      if (!version) continue;

      const Component = version.component;
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
          `${styleId}/v2 edge ${targetScene - 1}->${targetScene} must expose a supported transition kind`,
        ).toContain(transitionKind as (typeof SCENE_TRANSITION_KINDS)[number]);
        usedKinds.add(transitionKind as string);
      }

      unmount();
    }

    expect(
      usedKinds.size,
      `curated v2 transitions must remain varied, not collapse into ${Array.from(usedKinds).join(", ")}`,
    ).toBeGreaterThanOrEqual(6);
  });
});

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

const styleSources = import.meta.glob("./[0-9][0-9]-*.tsx", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

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
        `${styleId}/${version.id} must render adjacent scene panels instead of transition clones`,
      ).toBeGreaterThanOrEqual(5);
      expect(
        container.querySelector("[data-transition-clone='true']"),
        `${styleId}/${version.id} must not render outgoing transition clones`,
      ).toBeNull();

      unmount();
    }
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
});

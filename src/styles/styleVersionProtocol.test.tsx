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

const explicitVersions = STYLE_REGISTRY.flatMap((style) =>
  style.versions
    .filter((version) => version.id !== "v1")
    .map((version) => ({ styleId: style.id, version })),
);

describe("style version protocol", () => {
  it("requires explicit versions to declare a beat layout strategy for multi-beat scenes", () => {
    for (const { styleId, version } of explicitVersions) {
      const metadata = version.getMetadata("en");
      const multiBeatScenes = metadata.scenes.filter(
        (scene) => scene.beats.length > 1,
      );

      for (const scene of multiBeatScenes) {
        const { container, unmount } = renderVersion(version, {
          scene: scene.id,
          beat: 0,
        });
        const layoutContainer = container.querySelector(
          '[data-beat-layout-container="true"]',
        ) as HTMLElement | null;
        const layoutItems = container.querySelectorAll(
          '[data-beat-layout-container="true"] [data-beat-layout-item="true"]',
        );
        const layoutMode = layoutContainer?.dataset.beatLayoutMode;

        expect(
          layoutContainer,
          `${styleId}/${version.id} scene ${scene.id} must mark the beat layout container`,
        ).not.toBeNull();
        expect(
          layoutMode,
          `${styleId}/${version.id} scene ${scene.id} must choose data-beat-layout-mode="motion" or "reserved"`,
        ).toMatch(/^(motion|reserved)$/);
        expect(
          layoutItems.length,
          `${styleId}/${version.id} scene ${scene.id} must mark stable children for the chosen beat layout strategy`,
        ).toBeGreaterThanOrEqual(2);
        unmount();
      }
    }
  });
});

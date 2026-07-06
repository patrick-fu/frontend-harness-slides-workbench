import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import SpatialSceneTrack from "./SpatialSceneTrack";

function renderTrack(props: Partial<React.ComponentProps<typeof SpatialSceneTrack>> = {}) {
  return render(
    <SpatialSceneTrack
      scene={2}
      beat={0}
      axis="x"
      sceneIds={[1, 2, 3]}
      reducedMotion={false}
      renderScene={(sceneId) => (
        <section aria-label={`Scene ${sceneId}`}>Scene {sceneId}</section>
      )}
      {...props}
    />,
  );
}

describe("SpatialSceneTrack", () => {
  it("keeps five horizontal panels one viewport wide and moves one panel per scene", () => {
    renderTrack({ sceneIds: [1, 2, 3, 4, 5], scene: 2 });

    const strip = screen.getByTestId("spatial-scene-strip");
    const panels = screen.getAllByTestId("spatial-scene-panel");

    expect(strip.style.width).toBe("500%");
    expect(strip.style.transform).toBe("translate3d(-20%, 0, 0)");
    expect(panels).toHaveLength(5);
    expect(panels.map((panel) => panel.style.flex)).toEqual(
      Array(5).fill("0 0 20%"),
    );
    expect(panels.map((panel) => panel.style.width)).toEqual(
      Array(5).fill("20%"),
    );
  });

  it("keeps five vertical panels one viewport tall and moves one panel per scene", () => {
    renderTrack({ sceneIds: [1, 2, 3, 4, 5], scene: 3, axis: "y" });

    const strip = screen.getByTestId("spatial-scene-strip");
    const panels = screen.getAllByTestId("spatial-scene-panel");

    expect(strip.style.height).toBe("500%");
    expect(strip.style.transform).toBe("translate3d(0, -40%, 0)");
    expect(panels.map((panel) => panel.style.flex)).toEqual(
      Array(5).fill("0 0 20%"),
    );
    expect(panels.map((panel) => panel.style.height)).toEqual(
      Array(5).fill("20%"),
    );
  });

  it("passes the current beat only to the active scene panel", () => {
    const calls: Array<{ scene: number; beat: number; isActive: boolean }> = [];

    renderTrack({
      sceneIds: [1, 2, 3, 4, 5],
      scene: 4,
      beat: 2,
      renderScene: (sceneId, beat, isActive) => {
        calls.push({ scene: sceneId, beat, isActive });
        return <section>Scene {sceneId}</section>;
      },
    });

    expect(calls).toEqual([
      { scene: 1, beat: 0, isActive: false },
      { scene: 2, beat: 0, isActive: false },
      { scene: 3, beat: 0, isActive: false },
      { scene: 4, beat: 2, isActive: true },
      { scene: 5, beat: 0, isActive: false },
    ]);
  });

  it("renders adjacent scene panels inside one clipped spatial track instead of outgoing clones", () => {
    renderTrack();

    const track = screen.getByTestId("spatial-scene-track");
    const strip = screen.getByTestId("spatial-scene-strip");
    const panels = screen.getAllByTestId("spatial-scene-panel");

    expect(track).toHaveAttribute("data-axis", "x");
    expect(track).toHaveStyle({ overflow: "hidden" });
    expect(strip.style.transform).toBe("translate3d(-33.333333333333336%, 0, 0)");
    expect(panels).toHaveLength(3);
    expect(panels.map((panel) => panel.dataset.sceneId)).toEqual(["1", "2", "3"]);
    expect(panels.map((panel) => panel.dataset.active)).toEqual(["false", "true", "false"]);
    expect(panels.map((panel) => panel.style.flex)).toEqual(
      Array(3).fill("0 0 33.333333333333336%"),
    );
    expect(panels.map((panel) => panel.style.width)).toEqual(
      Array(3).fill("33.333333333333336%"),
    );
    expect(track.querySelector("[data-transition-clone='true']")).toBeNull();
  });

  it("supports vertical tracks with reduced-motion transitions disabled", () => {
    renderTrack({ scene: 3, axis: "y", reducedMotion: true });

    const track = screen.getByTestId("spatial-scene-track");
    const strip = screen.getByTestId("spatial-scene-strip");

    expect(track).toHaveAttribute("data-axis", "y");
    expect(strip.style.transform).toBe("translate3d(0, -66.66666666666667%, 0)");
    expect(strip.style.transition).toBe("none");
    expect(
      screen
        .getAllByTestId("spatial-scene-panel")
        .map((panel) => panel.style.height),
    ).toEqual(Array(3).fill("33.333333333333336%"));
  });
});

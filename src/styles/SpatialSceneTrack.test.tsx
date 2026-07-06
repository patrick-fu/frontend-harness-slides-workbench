import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import SpatialSceneTrack from "./SpatialSceneTrack";

function renderTrack(props: Partial<React.ComponentProps<typeof SpatialSceneTrack>> = {}) {
  return render(
    <SpatialSceneTrack
      scene={2}
      beat={0}
      axis="x"
      transitionKind="slide-x"
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
  it("marks the selected scene transition kind on the track", () => {
    renderTrack({ transitionKind: "fade" });

    const track = screen.getByTestId("spatial-scene-track");
    const strip = screen.getByTestId("spatial-scene-strip");
    const panels = screen.getAllByTestId("spatial-scene-panel");

    expect(track).toHaveAttribute("data-scene-transition-kind", "fade");
    expect(strip).toHaveAttribute("data-scene-transition-kind", "fade");
    expect(panels.map((panel) => panel.dataset.transitionState)).toEqual([
      "idle",
      "active",
      "idle",
    ]);
  });

  it("keeps five slide-x panels mounted without transition clones", () => {
    renderTrack({ sceneIds: [1, 2, 3, 4, 5], scene: 2 });

    const strip = screen.getByTestId("spatial-scene-strip");
    const panels = screen.getAllByTestId("spatial-scene-panel");

    expect(strip).toHaveAttribute("data-scene-transition-kind", "slide-x");
    expect(strip).toHaveAttribute("data-transition-direction", "forward");
    expect(panels).toHaveLength(5);
    expect(panels.map((panel) => panel.style.position)).toEqual(
      Array(5).fill("absolute"),
    );
    expect(strip.querySelector("[data-transition-clone='true']")).toBeNull();
  });

  it("keeps five slide-y panels mounted without transition clones", () => {
    renderTrack({ sceneIds: [1, 2, 3, 4, 5], scene: 3, transitionKind: "slide-y" });

    const strip = screen.getByTestId("spatial-scene-strip");
    const panels = screen.getAllByTestId("spatial-scene-panel");

    expect(strip).toHaveAttribute("data-scene-transition-kind", "slide-y");
    expect(strip).toHaveAttribute("data-transition-direction", "forward");
    expect(panels).toHaveLength(5);
    expect(panels.map((panel) => panel.style.inset)).toEqual(
      Array(5).fill("0px"),
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

  it("marks panel-level beat layout strategy when provided", () => {
    renderTrack({
      scene: 2,
      beatLayoutModes: {
        2: "motion",
        3: "reserved",
      },
    });

    const panels = screen.getAllByTestId("spatial-scene-panel");

    expect(panels[0]).not.toHaveAttribute("data-beat-layout-container");
    expect(panels[1]).toHaveAttribute("data-beat-layout-container", "true");
    expect(panels[1]).toHaveAttribute("data-beat-layout-mode", "motion");
    expect(panels[2]).toHaveAttribute("data-beat-layout-container", "true");
    expect(panels[2]).toHaveAttribute("data-beat-layout-mode", "reserved");
  });

  it("renders mounted scene panels inside one clipped spatial track instead of outgoing clones", () => {
    renderTrack();

    const track = screen.getByTestId("spatial-scene-track");
    const strip = screen.getByTestId("spatial-scene-strip");
    const panels = screen.getAllByTestId("spatial-scene-panel");

    expect(track).toHaveAttribute("data-axis", "x");
    expect(track).toHaveStyle({ overflow: "hidden" });
    expect(strip).toHaveAttribute("data-scene-transition-kind", "slide-x");
    expect(panels).toHaveLength(3);
    expect(panels.map((panel) => panel.dataset.sceneId)).toEqual(["1", "2", "3"]);
    expect(panels.map((panel) => panel.dataset.active)).toEqual(["false", "true", "false"]);
    expect(panels.map((panel) => panel.dataset.transitionState)).toEqual([
      "idle",
      "active",
      "idle",
    ]);
    expect(track.querySelector("[data-transition-clone='true']")).toBeNull();
  });

  it("supports vertical tracks with reduced-motion transitions disabled", () => {
    renderTrack({ scene: 3, transitionKind: "slide-y", reducedMotion: true });

    const track = screen.getByTestId("spatial-scene-track");
    const strip = screen.getByTestId("spatial-scene-strip");

    expect(track).toHaveAttribute("data-axis", "y");
    expect(track).toHaveAttribute("data-scene-transition-kind", "slide-y");
    expect(strip).toHaveAttribute("data-reduced-motion", "true");
    expect(
      screen
        .getAllByTestId("spatial-scene-panel")
        .map((panel) => panel.dataset.transitionState),
    ).toEqual(["idle", "idle", "active"]);
  });

  it("keeps the outgoing panel mounted with its previous beat during a scene change", () => {
    const { rerender } = render(
      <SpatialSceneTrack
        scene={2}
        beat={1}
        transitionKind="fade"
        sceneIds={[1, 2, 3]}
        reducedMotion={false}
        renderScene={(sceneId, beat) => (
          <section data-testid={`scene-${sceneId}`}>Scene {sceneId} beat {beat}</section>
        )}
      />,
    );

    rerender(
      <SpatialSceneTrack
        scene={3}
        beat={0}
        transitionKind="fade"
        sceneIds={[1, 2, 3]}
        reducedMotion={false}
        renderScene={(sceneId, beat) => (
          <section data-testid={`scene-${sceneId}`}>Scene {sceneId} beat {beat}</section>
        )}
      />,
    );

    const panels = screen.getAllByTestId("spatial-scene-panel");

    expect(panels.map((panel) => panel.dataset.transitionState)).toEqual([
      "idle",
      "outgoing",
      "active",
    ]);
    expect(screen.getByTestId("scene-2")).toHaveTextContent("Scene 2 beat 1");
    expect(screen.getByTestId("scene-3")).toHaveTextContent("Scene 3 beat 0");
  });
});

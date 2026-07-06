import type React from "react";

export interface SpatialSceneTrackProps {
  scene: number;
  beat: number;
  sceneIds?: number[];
  axis?: "x" | "y";
  reducedMotion: boolean;
  className?: string;
  renderScene: (scene: number, beat: number, isActive: boolean) => React.ReactNode;
}

export default function SpatialSceneTrack({
  scene,
  beat,
  sceneIds = [1, 2, 3, 4, 5],
  axis = "x",
  reducedMotion,
  className,
  renderScene,
}: SpatialSceneTrackProps) {
  const activeIndex = Math.max(0, sceneIds.indexOf(scene));
  const panelSize = `${100 / sceneIds.length}%`;
  const offset = `-${activeIndex * (100 / sceneIds.length)}%`;
  const transform =
    axis === "x"
      ? `translate3d(${offset}, 0, 0)`
      : `translate3d(0, ${offset}, 0)`;

  return (
    <div
      data-testid="spatial-scene-track"
      data-spatial-scene-track="true"
      data-axis={axis}
      data-active-scene={scene}
      className={className}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "hidden",
      }}
    >
      <div
        data-testid="spatial-scene-strip"
        data-spatial-scene-strip="true"
        style={{
          display: "flex",
          flexDirection: axis === "x" ? "row" : "column",
          width: axis === "x" ? `${sceneIds.length * 100}%` : "100%",
          height: axis === "y" ? `${sceneIds.length * 100}%` : "100%",
          transform,
          transition: reducedMotion
            ? "none"
            : "transform 650ms cubic-bezier(0.16, 1, 0.3, 1)",
          willChange: reducedMotion ? undefined : "transform",
        }}
      >
        {sceneIds.map((sceneId) => {
          const isActive = sceneId === scene;
          return (
            <div
              key={sceneId}
              data-testid="spatial-scene-panel"
              data-spatial-scene-panel="true"
              data-scene-id={sceneId}
              data-active={isActive ? "true" : "false"}
              aria-hidden={isActive ? undefined : true}
              style={{
                position: "relative",
                flex: `0 0 ${panelSize}`,
                width: axis === "x" ? panelSize : "100%",
                height: axis === "y" ? panelSize : "100%",
              }}
            >
              {renderScene(sceneId, isActive ? beat : 0, isActive)}
            </div>
          );
        })}
      </div>
    </div>
  );
}

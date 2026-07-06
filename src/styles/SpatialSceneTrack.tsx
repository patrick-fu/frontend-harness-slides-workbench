import { useLayoutEffect, useRef, useState } from "react";
import type React from "react";
import styles from "./SpatialSceneTrack.module.css";

export type BeatLayoutMode = "motion" | "reserved";
export type SceneTransitionKind =
  | "slide-x"
  | "slide-y"
  | "fade"
  | "scale-fade"
  | "hard-cut"
  | "wipe"
  | "page-flip"
  | "glitch";

type TransitionDirection = "forward" | "backward";

interface ActiveTransition {
  key: number;
  outgoingScene: number;
  outgoingBeat: number;
  direction: TransitionDirection;
}

export interface SpatialSceneTrackProps {
  scene: number;
  beat: number;
  sceneIds?: number[];
  axis?: "x" | "y";
  transitionKind?: SceneTransitionKind;
  transitionDurationMs?: number;
  reducedMotion: boolean;
  beatLayoutModes?: Partial<Record<number, BeatLayoutMode>>;
  className?: string;
  renderScene: (scene: number, beat: number, isActive: boolean) => React.ReactNode;
}

const DEFAULT_SCENE_IDS = [1, 2, 3, 4, 5];
const DEFAULT_TRANSITION_DURATION_MS = 650;

export default function SpatialSceneTrack({
  scene,
  beat,
  sceneIds = DEFAULT_SCENE_IDS,
  axis,
  transitionKind,
  transitionDurationMs = DEFAULT_TRANSITION_DURATION_MS,
  reducedMotion,
  beatLayoutModes,
  className,
  renderScene,
}: SpatialSceneTrackProps) {
  const effectiveTransitionKind =
    transitionKind ?? (axis === "y" ? "slide-y" : "slide-x");
  const effectiveAxis = effectiveTransitionKind === "slide-y" ? "y" : "x";
  const sceneIdsKey = sceneIds.join(":");
  const lastSceneRef = useRef(scene);
  const lastBeatRef = useRef(beat);
  const transitionKeyRef = useRef(0);
  const [activeTransition, setActiveTransition] =
    useState<ActiveTransition | null>(null);

  useLayoutEffect(() => {
    const lastScene = lastSceneRef.current;
    const lastBeat = lastBeatRef.current;

    if (lastScene !== scene) {
      const fromIndex = sceneIds.indexOf(lastScene);
      const toIndex = sceneIds.indexOf(scene);
      const direction =
        fromIndex >= 0 && toIndex >= 0 && toIndex < fromIndex
          ? "backward"
          : "forward";

      if (reducedMotion || effectiveTransitionKind === "hard-cut") {
        setActiveTransition(null);
      } else {
        transitionKeyRef.current += 1;
        setActiveTransition({
          key: transitionKeyRef.current,
          outgoingScene: lastScene,
          outgoingBeat: lastBeat,
          direction,
        });
      }
    }

    lastSceneRef.current = scene;
    lastBeatRef.current = beat;
  }, [scene, beat, sceneIds, sceneIdsKey, reducedMotion, effectiveTransitionKind]);

  useLayoutEffect(() => {
    if (!activeTransition || reducedMotion || effectiveTransitionKind === "hard-cut") {
      return undefined;
    }

    const timeout = window.setTimeout(() => {
      setActiveTransition((current) =>
        current?.key === activeTransition.key ? null : current,
      );
    }, transitionDurationMs);

    return () => window.clearTimeout(timeout);
  }, [
    activeTransition,
    effectiveTransitionKind,
    reducedMotion,
    transitionDurationMs,
  ]);

  const direction = activeTransition?.direction ?? "forward";
  const isTransitioning = Boolean(activeTransition) && !reducedMotion;

  return (
    <div
      data-testid="spatial-scene-track"
      data-spatial-scene-track="true"
      data-axis={effectiveAxis}
      data-active-scene={scene}
      data-scene-transition-kind={effectiveTransitionKind}
      data-transition-direction={direction}
      className={[styles.track, className].filter(Boolean).join(" ")}
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
        data-scene-transition-kind={effectiveTransitionKind}
        data-transition-direction={direction}
        data-transitioning={isTransitioning ? "true" : undefined}
        data-reduced-motion={reducedMotion ? "true" : undefined}
        className={styles.stack}
      >
        {sceneIds.map((sceneId) => {
          const isCurrent = sceneId === scene;
          const isOutgoing =
            activeTransition?.outgoingScene === sceneId &&
            !isCurrent &&
            !reducedMotion &&
            effectiveTransitionKind !== "hard-cut";
          const transitionState = isCurrent
            ? "active"
            : isOutgoing
              ? "outgoing"
              : "idle";
          const beatLayoutMode = beatLayoutModes?.[sceneId];
          const sceneBeat = isCurrent
            ? beat
            : isOutgoing
              ? activeTransition.outgoingBeat
              : 0;

          return (
            <div
              key={sceneId}
              data-testid="spatial-scene-panel"
              data-spatial-scene-panel="true"
              data-scene-id={sceneId}
              data-active={isCurrent ? "true" : "false"}
              data-transition-state={transitionState}
              data-scene-transition-kind={effectiveTransitionKind}
              data-beat-layout-container={beatLayoutMode ? "true" : undefined}
              data-beat-layout-mode={beatLayoutMode}
              aria-hidden={isCurrent ? undefined : true}
              className={styles.panel}
              style={{
                position: "absolute",
                inset: "0px",
                width: "100%",
                height: "100%",
                zIndex: isCurrent ? 2 : isOutgoing ? 1 : 0,
              }}
            >
              {renderScene(sceneId, sceneBeat, isCurrent)}
            </div>
          );
        })}
      </div>
    </div>
  );
}

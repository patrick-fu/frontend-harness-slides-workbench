import { useLayoutEffect, useRef, useState } from "react";
import type React from "react";
import styles from "./SpatialSceneTrack.module.css";

export type BeatLayoutMode = "motion" | "reserved";
export const CANONICAL_SCENE_TRANSITION_KINDS = [
  "hard-cut",
  "crossfade",
  "dip-to-color",
  "push-x",
  "push-y",
  "diagonal-pan",
  "zoom-through",
  "dolly-pull",
  "focus-swap",
  "linear-wipe",
  "iris-open",
  "multi-blind",
  "page-turn",
  "paper-fold",
  "ink-spread",
  "grid-reveal",
  "split-merge",
  "card-carousel",
  "glitch",
  "scanline",
  "afterimage",
] as const;
export const LEGACY_SCENE_TRANSITION_KINDS = [
  "slide-x",
  "slide-y",
  "fade",
  "scale-fade",
  "wipe",
  "page-flip",
] as const;
export type CanonicalSceneTransitionKind =
  (typeof CANONICAL_SCENE_TRANSITION_KINDS)[number];
export type LegacySceneTransitionKind =
  (typeof LEGACY_SCENE_TRANSITION_KINDS)[number];
export type SceneTransitionKind =
  | CanonicalSceneTransitionKind
  | LegacySceneTransitionKind;
export type SceneTransitionEdge = `${number}->${number}`;
export type SceneTransitionMap = Partial<
  Record<SceneTransitionEdge, SceneTransitionKind>
>;
export type SceneTransitionModifier =
  | "letterform-lineage"
  | "stadium-wave"
  | "ice-core-scrub"
  | "pneumatic-burst"
  | "voyager-boundary"
  | "urushi-sheen"
  | "egg-mimicry";
export type SceneTransitionModifierMap = Partial<
  Record<SceneTransitionEdge, SceneTransitionModifier>
>;

type TransitionDirection = "forward" | "backward";

interface ActiveTransition {
  key: number;
  outgoingScene: number;
  outgoingBeat: number;
  direction: TransitionDirection;
  transitionKind: SceneTransitionKind;
  transitionModifier?: SceneTransitionModifier;
}

export interface SpatialSceneTrackProps {
  scene: number;
  beat: number;
  sceneIds?: number[];
  axis?: "x" | "y";
  transitionKind?: SceneTransitionKind;
  transitionMap?: SceneTransitionMap;
  transitionModifier?: SceneTransitionModifier;
  transitionModifierMap?: SceneTransitionModifierMap;
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
  transitionMap,
  transitionModifier,
  transitionModifierMap,
  transitionDurationMs = DEFAULT_TRANSITION_DURATION_MS,
  reducedMotion,
  beatLayoutModes,
  className,
  renderScene,
}: SpatialSceneTrackProps) {
  const fallbackTransitionKind =
    transitionKind ?? (axis === "y" ? "slide-y" : "slide-x");
  const sceneIdsKey = sceneIds.join(":");
  const lastSceneRef = useRef(scene);
  const lastBeatRef = useRef(beat);
  const transitionKeyRef = useRef(0);
  const [activeTransition, setActiveTransition] =
    useState<ActiveTransition | null>(null);
  const [settledTransitionKind, setSettledTransitionKind] =
    useState<SceneTransitionKind>(fallbackTransitionKind);
  const resolveTransitionKind = (
    fromScene: number,
    toScene: number,
  ): SceneTransitionKind =>
    transitionMap?.[`${fromScene}->${toScene}`] ?? fallbackTransitionKind;
  const resolveTransitionModifier = (
    fromScene: number,
    toScene: number,
  ): SceneTransitionModifier | undefined =>
    transitionModifierMap?.[`${fromScene}->${toScene}`] ?? transitionModifier;
  const pendingTransitionKind =
    lastSceneRef.current !== scene
      ? resolveTransitionKind(lastSceneRef.current, scene)
      : fallbackTransitionKind;
  const effectiveTransitionKind = activeTransition?.transitionKind ?? (
    lastSceneRef.current !== scene
      ? pendingTransitionKind
      : settledTransitionKind
  );
  const pendingTransitionModifier =
    lastSceneRef.current !== scene
      ? resolveTransitionModifier(lastSceneRef.current, scene)
      : transitionModifier;
  const effectiveTransitionModifier =
    activeTransition?.transitionModifier ?? pendingTransitionModifier;
  const effectiveAxis =
    effectiveTransitionKind === "slide-y" ||
    effectiveTransitionKind === "push-y"
      ? "y"
      : "x";

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
      const nextTransitionKind = resolveTransitionKind(lastScene, scene);
      const nextTransitionModifier = resolveTransitionModifier(lastScene, scene);

      setSettledTransitionKind(nextTransitionKind);

      if (reducedMotion || nextTransitionKind === "hard-cut") {
        setActiveTransition(null);
      } else {
        transitionKeyRef.current += 1;
        setActiveTransition({
          key: transitionKeyRef.current,
          outgoingScene: lastScene,
          outgoingBeat: lastBeat,
          direction,
          transitionKind: nextTransitionKind,
          transitionModifier: nextTransitionModifier,
        });
      }
    }

    lastSceneRef.current = scene;
    lastBeatRef.current = beat;
  }, [
    scene,
    beat,
    sceneIds,
    sceneIdsKey,
    reducedMotion,
    transitionMap,
    transitionModifier,
    transitionModifierMap,
    fallbackTransitionKind,
  ]);

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
      data-scene-transition-modifier={effectiveTransitionModifier}
      data-transition-direction={direction}
      className={[styles.track, className].filter(Boolean).join(" ")}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        ["--scene-transition-duration" as string]: `${transitionDurationMs}ms`,
      }}
    >
      <div
        data-testid="spatial-scene-strip"
        data-spatial-scene-strip="true"
        data-scene-transition-kind={effectiveTransitionKind}
        data-scene-transition-modifier={effectiveTransitionModifier}
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
              data-scene-transition-modifier={effectiveTransitionModifier}
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

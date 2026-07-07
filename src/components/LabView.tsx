import { useRef, useCallback, useMemo, useEffect, type MouseEvent } from "react";
import type {
  StyleRegistryEntry,
  BespokeStyleProps,
  SceneMetadata,
  StyleVersion,
} from "../types";
import { useStageScale } from "../hooks/useStageScale";
import { useKeyboard } from "../hooks/useKeyboard";
import { useTouchNav } from "../hooks/useTouchNav";
import {
  computeNext,
  computePrev,
  jumpScene,
} from "../utils/navigation";
import PureModeOverlay from "./PureModeOverlay";
import CrossStyleFlash from "./CrossStyleFlash";
import BottomBar from "./layout/BottomBar";
import VersionBar from "./layout/VersionBar";

export interface LabViewProps {
  registry: StyleRegistryEntry[];
  styleId: string;
  versionId: string;
  scene: number;
  beat: number;
  isPureMode: boolean;
  reducedMotion: boolean;
  language: "en" | "zh";
  frozen: boolean;
  flashStyle: boolean;
  onNavigate: (target: {
    styleId: string;
    versionId: string;
    scene: number;
    beat: number;
    flashStyle?: boolean;
  }) => void;
  onFlashDone: () => void;
  onExitPure: () => void;
  onGoOverview: () => void;
}

/**
 * Look up a style + version from the registry.
 * Falls back to first version if the specified versionId is not found.
 */
function findStyleAndVersion(
  registry: StyleRegistryEntry[],
  styleId: string,
  versionId: string,
): {
  style: StyleRegistryEntry;
  version: StyleVersion;
  versionIndex: number;
} | null {
  const style = registry.find((s) => s.id === styleId);
  if (!style || style.versions.length === 0) return null;
  let versionIndex = style.versions.findIndex((v) => v.id === versionId);
  if (versionIndex === -1) versionIndex = 0;
  return {
    style,
    version: style.versions[versionIndex],
    versionIndex,
  };
}

export default function LabView({
  registry,
  styleId,
  versionId,
  scene,
  beat,
  isPureMode,
  reducedMotion,
  language,
  frozen,
  flashStyle,
  onNavigate,
  onFlashDone,
  onExitPure,
  onGoOverview,
}: LabViewProps) {
  const stageContainerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const { scale, width: scaledWidth, height: scaledHeight } =
    useStageScale(stageContainerRef);

  // Find current style + version
  const found = useMemo(
    () => findStyleAndVersion(registry, styleId, versionId),
    [registry, styleId, versionId],
  );

  const meta = useMemo(() => {
    if (!found) return null;
    return found.version.getMetadata(language);
  }, [found, language]);

  // Build scenes metadata for BottomBar
  const scenes: SceneMetadata[] = useMemo(() => {
    if (!meta) return [];
    return meta.scenes.map((s) => ({
      id: s.id,
      title: s.title,
      beats: s.beats,
    }));
  }, [meta]);

  // Determine if at absolute first/last for button states
  const isFirst = useMemo(() => {
    if (!found) return false;
    const firstStyle = registry[0];
    if (found.style.id !== firstStyle?.id) return false;
    if (found.versionIndex !== 0) return false;
    return scene === 1 && beat === 0;
  }, [found, registry, scene, beat]);

  const isLast = useMemo(() => {
    if (!found || !meta) return false;
    const lastStyle = registry[registry.length - 1];
    if (found.style.id !== lastStyle?.id) return false;
    if (found.versionIndex !== found.style.versions.length - 1) return false;
    const lastScene = meta.scenes[meta.scenes.length - 1];
    const lastBeat = lastScene?.beats[lastScene.beats.length - 1]?.id ?? 0;
    return scene === 5 && beat >= lastBeat;
  }, [found, registry, scene, beat, meta]);

  // ── Navigation handlers ─────────────────────────────────────────────────

  const handleNext = useCallback(() => {
    const target = computeNext(
      registry,
      styleId,
      versionId,
      scene,
      beat,
      isPureMode,
    );
    if (target) onNavigate(target);
  }, [registry, styleId, versionId, scene, beat, isPureMode, onNavigate]);

  const handlePrev = useCallback(() => {
    const target = computePrev(
      registry,
      styleId,
      versionId,
      scene,
      beat,
      isPureMode,
    );
    if (target) onNavigate(target);
  }, [registry, styleId, versionId, scene, beat, isPureMode, onNavigate]);

  const handleJumpScene = useCallback(
    (targetScene: number) => {
      const target = jumpScene(registry, styleId, versionId, targetScene);
      onNavigate(target);
    },
    [registry, styleId, versionId, onNavigate],
  );

  const handleStyleInternalNavigate = useCallback(
    (targetScene: number, targetBeat: number) => {
      onNavigate({
        styleId,
        versionId,
        scene: targetScene,
        beat: targetBeat,
      });
    },
    [styleId, versionId, onNavigate],
  );

  const handleStageClick = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      if (event.defaultPrevented) return;
      if (event.button !== 0) return;
      if (event.metaKey || event.altKey || event.ctrlKey || event.shiftKey) {
        return;
      }

      const target = event.target;
      if (
        target instanceof Element &&
        target.closest(
          [
            "button",
            "a",
            "input",
            "textarea",
            "select",
            "summary",
            "[role='button']",
            "[role='link']",
            "[role='menuitem']",
            "[contenteditable='true']",
          ].join(","),
        )
      ) {
        return;
      }

      handleNext();
    },
    [handleNext],
  );

  const handleVersionBarSelect = useCallback(
    (targetVersionId: string) => {
      if (!found) return;

      const targetVersion = found.style.versions.find(
        (v) => v.id === targetVersionId,
      );
      if (!targetVersion) return;

      const targetMeta = targetVersion.getMetadata(language);
      const targetScene = targetMeta.scenes.find((s) => s.id === scene)
        ?? targetMeta.scenes[0];
      const targetSceneId = targetScene?.id ?? 1;
      const lastBeat =
        targetScene?.beats[targetScene.beats.length - 1]?.id ?? 0;

      onNavigate({
        styleId: found.style.id,
        versionId: targetVersionId,
        scene: targetSceneId,
        beat: Math.min(beat, lastBeat),
      });
    },
    [found, language, scene, beat, onNavigate],
  );

  // ── Keyboard navigation ─────────────────────────────────────────────────

  useKeyboard({
    onArrowRight: handleNext,
    onArrowLeft: handlePrev,
    onSpace: handleNext,
  });

  // ── Touch navigation ────────────────────────────────────────────────────

  useTouchNav({
    elementRef: stageRef,
    onNext: handleNext,
    onPrev: handlePrev,
    enabled: true,
  });

  // ── Frozen mode: set data-frozen on html ────────────────────────────────

  useEffect(() => {
    if (frozen) {
      document.documentElement.setAttribute("data-frozen", "true");
    } else {
      document.documentElement.removeAttribute("data-frozen");
    }
    return () => {
      document.documentElement.removeAttribute("data-frozen");
    };
  }, [frozen]);

  // ── Render ──────────────────────────────────────────────────────────────

  if (!found || !meta) {
    return (
      <div
        data-testid="lab-view"
        className="w-full h-full flex items-center justify-center"
      >
        <p className="opacity-50">
          {language === "zh"
            ? `风格 ${styleId} 未找到`
            : `Style ${styleId} not found`}
        </p>
      </div>
    );
  }

  const StyleComponent = found.version.component;

  const styleProps: BespokeStyleProps = {
    scene,
    beat,
    language,
    isThumbnail: false,
    reducedMotion: reducedMotion || frozen,
    onNavigate: handleStyleInternalNavigate,
  };

  // Cross-style flash notification
  const flashNotification = flashStyle ? (
    <CrossStyleFlash
      styleId={meta.id}
      styleName={meta.name}
      onDone={onFlashDone}
    />
  ) : null;

  return (
    <div
      data-testid="lab-view"
      className="w-full h-full flex flex-col"
    >
      {/* VersionBar (hidden in pure mode) */}
      {!isPureMode && (
        <VersionBar
          style={found.style}
          currentVersionId={versionId}
          language={language}
          onGoOverview={onGoOverview}
          onSelectVersion={handleVersionBarSelect}
        />
      )}

      {/* Stage area */}
      <div
        ref={stageContainerRef}
        className="flex-1 flex items-center justify-center overflow-hidden relative bg-canvas"
        style={{ minHeight: 0, minWidth: 0 }}
      >
        <PureModeOverlay isPureMode={isPureMode} onExitPure={onExitPure}>
          {/* Wrapper with real visual dimensions so flex centering works */}
          <div
            style={{
              width: scaledWidth,
              height: scaledHeight,
              position: "relative",
              flexShrink: 0,
            }}
          >
            <div
              ref={stageRef}
              data-testid="stage"
              data-stage="true"
              tabIndex={-1}
              onClick={handleStageClick}
              className="absolute top-0 left-0 overflow-hidden select-none"
              style={{
                width: 1920,
                height: 1080,
                containerType: "size",
                transform: `scale(${scale})`,
                transformOrigin: "top left",
              }}
            >
              <StyleComponent {...styleProps} />
              {flashNotification}
            </div>
          </div>
        </PureModeOverlay>
      </div>

      {/* Bottom navigation bar (hidden in pure mode by CSS) */}
      {!isPureMode && scenes.length > 0 && (
        <BottomBar
          scenes={scenes}
          currentScene={scene}
          currentBeat={beat}
          onPrev={handlePrev}
          onNext={handleNext}
          onJumpScene={handleJumpScene}
          isFirst={isFirst}
          isLast={isLast}
        />
      )}
    </div>
  );
}

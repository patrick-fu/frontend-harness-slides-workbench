import { useRef, useCallback, useMemo, useEffect } from "react";
import type { StyleRegistryEntry, BespokeStyleProps, SceneMetadata } from "../types";
import { useStageScale } from "../hooks/useStageScale";
import { useKeyboard } from "../hooks/useKeyboard";
import { useTouchNav } from "../hooks/useTouchNav";
import { computeNext, computePrev, jumpScene } from "../utils/navigation";
import PureModeOverlay from "./PureModeOverlay";
import CrossStyleFlash from "./CrossStyleFlash";
import BottomBar from "./layout/BottomBar";

export interface LabViewProps {
  registry: StyleRegistryEntry[];
  styleId: string;
  scene: number;
  beat: number;
  isPureMode: boolean;
  reducedMotion: boolean;
  language: "en" | "zh";
  frozen: boolean;
  flashStyle: boolean;
  onNavigate: (target: {
    styleId: string;
    scene: number;
    beat: number;
    flashStyle?: boolean;
  }) => void;
  onFlashDone: () => void;
  onExitPure: () => void;
}

export default function LabView({
  registry,
  styleId,
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
}: LabViewProps) {
  const stageContainerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const { scale, width: scaledWidth, height: scaledHeight } = useStageScale(stageContainerRef);

  // Find current style entry and metadata
  const currentEntry = useMemo(
    () => registry.find((e) => e.id === styleId),
    [registry, styleId],
  );

  const meta = useMemo(() => {
    if (!currentEntry) return null;
    return currentEntry.getMetadata(language);
  }, [currentEntry, language]);

  // Build scenes metadata for BottomBar
  const scenes: SceneMetadata[] = useMemo(() => {
    if (!meta) return [];
    return meta.scenes.map((s) => ({
      id: s.id,
      title: s.title,
      beats: s.beats,
    }));
  }, [meta]);

  // Determine if at first/last for button states
  const isFirst = useMemo(() => {
    if (styleId !== registry[0]?.id) return false;
    return scene === 1 && beat === 0;
  }, [registry, styleId, scene, beat]);

  const isLast = useMemo(() => {
    if (styleId !== registry[registry.length - 1]?.id) return false;
    if (!meta) return false;
    const lastScene = meta.scenes[meta.scenes.length - 1];
    const lastBeat = lastScene?.beats[lastScene.beats.length - 1]?.id ?? 0;
    return scene === 5 && beat >= lastBeat;
  }, [registry, styleId, scene, beat, meta]);

  // ── Navigation handlers ─────────────────────────────────────────────────

  const handleNext = useCallback(() => {
    const target = computeNext(registry, styleId, scene, beat, isPureMode);
    if (target) onNavigate(target);
  }, [registry, styleId, scene, beat, isPureMode, onNavigate]);

  const handlePrev = useCallback(() => {
    const target = computePrev(registry, styleId, scene, beat, isPureMode);
    if (target) onNavigate(target);
  }, [registry, styleId, scene, beat, isPureMode, onNavigate]);

  const handleJumpScene = useCallback(
    (targetScene: number) => {
      const target = jumpScene(registry, styleId, targetScene);
      onNavigate(target);
    },
    [registry, styleId, onNavigate],
  );

  const handleStyleInternalNavigate = useCallback(
    (targetScene: number, targetBeat: number) => {
      onNavigate({ styleId, scene: targetScene, beat: targetBeat });
    },
    [styleId, onNavigate],
  );

  // ── Keyboard navigation ─────────────────────────────────────────────────

  useKeyboard({
    onArrowRight: handleNext,
    onArrowLeft: handlePrev,
  });

  // ── Touch navigation ────────────────────────────────────────────────────

  useTouchNav({
    elementRef: stageRef,
    onNext: handleNext,
    onPrev: handlePrev,
    enabled: !isPureMode,
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

  if (!currentEntry || !meta) {
    return (
      <div
        data-testid="lab-view"
        className="w-full h-full flex items-center justify-center"
      >
        <p className="opacity-50">
          {language === "zh" ? `风格 ${styleId} 未找到` : `Style ${styleId} not found`}
        </p>
      </div>
    );
  }

  const StyleComponent = currentEntry.component;

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

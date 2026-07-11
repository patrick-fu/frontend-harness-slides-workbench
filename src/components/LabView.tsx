import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent,
} from "react";
import type {
  BespokeStyleProps,
  SceneMetadata,
  StyleRegistryEntry,
  TopicComponent,
} from "../types";
import { useKeyboard } from "../hooks/useKeyboard";
import { useStageScale } from "../hooks/useStageScale";
import { useTouchNav } from "../hooks/useTouchNav";
import {
  computeNext,
  computePrev,
  getStageTapNavigationDirection,
  jumpScene,
  STAGE_PREVIOUS_ZONE_RATIO,
  type NavTarget,
} from "../utils/navigation";
import BottomBar from "./layout/BottomBar";
import PureModeOverlay from "./PureModeOverlay";
import CrossTopicNotice from "./chrome/CrossTopicNotice";

export interface LabViewProps {
  registry: StyleRegistryEntry[];
  styleId: string;
  topicId: string;
  scene: number;
  beat: number;
  isPureMode: boolean;
  reducedMotion: boolean;
  language: "en" | "zh";
  frozen: boolean;
  announceTopic: boolean;
  onNavigate: (target: NavTarget) => void;
  onAnnouncementDone: () => void;
  onExitPure: () => void;
  onGoOverview: () => void;
  onOpenLibrary: () => void;
  onOpenPalette: () => void;
  onOpenControls: () => void;
  loadTopic?: (styleId: string, topicId: string) => Promise<TopicComponent>;
  prefetchAdjacentTopics?: (styleId: string, topicId: string) => Promise<void>;
}

interface TopicLoadState {
  key: string;
  status: "loading" | "ready" | "error";
  component: TopicComponent | null;
}

const INTERACTIVE_SELECTOR = [
  "button",
  "a",
  "input",
  "textarea",
  "select",
  "summary",
  "[role='button']",
  "[role='link']",
  "[role='menuitem']",
  "[contenteditable]",
].join(",");

export default function LabView({
  registry,
  styleId,
  topicId,
  scene,
  beat,
  isPureMode,
  reducedMotion,
  language,
  frozen,
  announceTopic,
  onNavigate,
  onAnnouncementDone,
  onExitPure,
  onGoOverview,
  onOpenLibrary,
  onOpenPalette,
  onOpenControls,
  loadTopic,
  prefetchAdjacentTopics,
}: LabViewProps) {
  const stageContainerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const lastTouchRef = useRef(0);
  const [hoverCue, setHoverCue] = useState<"prev" | "next" | null>(null);
  const [retryToken, setRetryToken] = useState(0);
  const [mobileTouchInput, setMobileTouchInput] = useState(false);
  const [topicLoadState, setTopicLoadState] = useState<TopicLoadState>({
    key: "",
    status: "loading",
    component: null,
  });
  const { scale, width: scaledWidth, height: scaledHeight } =
    useStageScale(stageContainerRef);

  useEffect(() => {
    const query = window.matchMedia("(max-width: 767px) and (pointer: coarse)");
    const update = () => setMobileTouchInput(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  const found = useMemo(() => {
    const style = registry.find((entry) => entry.id === styleId);
    const topic = style?.topics.find((entry) => entry.id === topicId);
    return style && topic ? { style, topic } : null;
  }, [registry, styleId, topicId]);
  const meta = useMemo(
    () => found?.topic.getMetadata(language) ?? null,
    [found, language],
  );
  const scenes = useMemo<SceneMetadata[]>(
    () => meta?.scenes.map((item) => ({ ...item })) ?? [],
    [meta],
  );
  const topicKey = `${styleId}/${topicId}`;
  const activeLoadState =
    topicLoadState.key === topicKey
      ? topicLoadState
      : { key: topicKey, status: "loading" as const, component: null };

  useEffect(() => {
    if (!found || !loadTopic) return;
    let cancelled = false;
    setTopicLoadState({ key: topicKey, status: "loading", component: null });
    void loadTopic(styleId, topicId).then(
      (component) => {
        if (cancelled) return;
        setTopicLoadState({ key: topicKey, status: "ready", component });
        if (prefetchAdjacentTopics) {
          void prefetchAdjacentTopics(styleId, topicId).catch(() => undefined);
        }
      },
      () => {
        if (!cancelled) {
          setTopicLoadState({ key: topicKey, status: "error", component: null });
        }
      },
    );
    return () => {
      cancelled = true;
    };
  }, [found, loadTopic, prefetchAdjacentTopics, retryToken, styleId, topicId, topicKey]);

  const handleNext = useCallback(() => {
    const target = computeNext(registry, styleId, topicId, scene, beat, isPureMode);
    if (target) onNavigate(target);
  }, [beat, isPureMode, onNavigate, registry, scene, styleId, topicId]);
  const handlePrev = useCallback(() => {
    const target = computePrev(registry, styleId, topicId, scene, beat, isPureMode);
    if (target) onNavigate(target);
  }, [beat, isPureMode, onNavigate, registry, scene, styleId, topicId]);
  const handleJumpScene = useCallback(
    (targetScene: number) =>
      onNavigate(jumpScene(registry, styleId, topicId, targetScene)),
    [onNavigate, registry, styleId, topicId],
  );
  const handleJumpBeat = useCallback(
    (targetBeat: number) =>
      onNavigate({ styleId, topicId, scene, beat: targetBeat }),
    [onNavigate, scene, styleId, topicId],
  );
  const handleStyleInternalNavigate = useCallback(
    (targetScene: number, targetBeat: number) =>
      onNavigate({ styleId, topicId, scene: targetScene, beat: targetBeat }),
    [onNavigate, styleId, topicId],
  );

  useKeyboard({
    onArrowRight: handleNext,
    onArrowLeft: handlePrev,
    onSpace: handleNext,
    onCommandPalette: isPureMode ? undefined : onOpenPalette,
    onHelp: isPureMode ? undefined : onOpenControls,
  });
  useTouchNav({
    elementRef: stageRef,
    onNext: handleNext,
    onPrev: handlePrev,
    enabled: mobileTouchInput,
  });

  useEffect(() => {
    document.documentElement.toggleAttribute("data-frozen", frozen);
    if (frozen) document.documentElement.setAttribute("data-frozen", "true");
    return () => document.documentElement.removeAttribute("data-frozen");
  }, [frozen]);

  const handleStageClick = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      if (Date.now() - lastTouchRef.current < 600) return;
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.altKey || event.ctrlKey || event.shiftKey) return;
      if (event.target instanceof Element && event.target.closest(INTERACTIVE_SELECTOR)) return;
      const rect = event.currentTarget.getBoundingClientRect();
      const direction = getStageTapNavigationDirection({
        clientX: event.clientX,
        stageLeft: rect.left,
        stageWidth: rect.width,
      });
      if (direction === "prev") handlePrev();
      else handleNext();
    },
    [handleNext, handlePrev],
  );

  if (!found || !meta) {
    return (
      <div data-testid="lab-view" className="grid h-full w-full place-items-center bg-canvas p-6 text-ink">
        <div className="max-w-md text-center">
          <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.18em] text-ink/40">404 · Topic unavailable</div>
          <h1 className="text-xl font-semibold">{language === "zh" ? "无法找到这份 Slides" : "This slide deck is unavailable"}</h1>
          <p className="mt-2 break-all text-sm text-ink/50">{styleId} / {topicId}</p>
          <div className="mt-6 flex justify-center gap-2">
            <button type="button" onClick={onGoOverview} className="h-10 rounded-xl bg-ink px-4 text-xs font-semibold text-paper">{language === "zh" ? "返回总览" : "Back to Overview"}</button>
            <button type="button" onClick={onOpenLibrary} className="h-10 rounded-xl border border-ink/15 px-4 text-xs font-semibold">{language === "zh" ? "打开资料库" : "Open Library"}</button>
          </div>
        </div>
      </div>
    );
  }

  const StyleComponent = loadTopic
    ? activeLoadState.component
    : found.topic.component;
  const isTopicReady = Boolean(StyleComponent);
  const styleProps: BespokeStyleProps = {
    scene,
    beat,
    language,
    isThumbnail: false,
    reducedMotion: reducedMotion || frozen,
    onNavigate: handleStyleInternalNavigate,
  };
  const styleNumber = registry.findIndex((entry) => entry.id === found.style.id) + 1;
  const illustrativeBoundary =
    found.topic.evidence?.kind === "illustrative" &&
    found.topic.evidence.display !== "stage"
      ? found.topic.evidence.boundary[language]
      : null;

  return (
    <div data-testid="lab-view" className="flex h-full w-full min-h-0 flex-col">
      <div
        ref={stageContainerRef}
        className="relative flex min-h-0 min-w-0 flex-1 items-center justify-center overflow-hidden bg-canvas"
      >
        <PureModeOverlay isPureMode={isPureMode} onExitPure={onExitPure}>
          <div
            className="relative shrink-0"
            style={{ width: scaledWidth, height: scaledHeight }}
            onMouseLeave={() => setHoverCue(null)}
          >
            <div
              ref={stageRef}
              data-testid="stage"
              data-stage="true"
              data-topic-ready={isTopicReady ? "true" : "false"}
              tabIndex={-1}
              onClick={handleStageClick}
              onTouchEndCapture={() => {
                lastTouchRef.current = Date.now();
              }}
              onMouseMove={(event) => {
                if (isPureMode) return setHoverCue(null);
                const rect = event.currentTarget.getBoundingClientRect();
                const ratio = (event.clientX - rect.left) / rect.width;
                setHoverCue(
                  ratio < STAGE_PREVIOUS_ZONE_RATIO
                    ? "prev"
                    : ratio > 1 - STAGE_PREVIOUS_ZONE_RATIO
                      ? "next"
                      : null,
                );
              }}
              className="absolute left-0 top-0 select-none overflow-hidden"
              style={{
                width: 1920,
                height: 1080,
                containerType: "size",
                transform: `scale(${scale})`,
                transformOrigin: "top left",
              }}
            >
              {StyleComponent ? (
                <>
                  <StyleComponent {...styleProps} />
                  {illustrativeBoundary && (
                    <div
                      role="note"
                      data-topic-evidence-boundary="true"
                      className="pointer-events-none absolute flex justify-center"
                      style={{
                        left: "1.25cqw",
                        right: "1.25cqw",
                        bottom: "1.5cqh",
                        zIndex: 70,
                      }}
                    >
                      <span
                        className="border border-white/20 bg-black/70 text-center font-sans text-white/90 shadow-lg backdrop-blur-sm"
                        style={{
                          maxWidth: "92cqw",
                          padding: "0.55cqh 0.75cqw",
                          borderRadius: "0.4cqw",
                          fontSize: "1.3cqh",
                          lineHeight: 1.35,
                        }}
                      >
                        {illustrativeBoundary}
                      </span>
                    </div>
                  )}
                </>
              ) : activeLoadState.status === "error" ? (
                <div
                  className="grid h-full w-full place-items-center p-16 text-center"
                  style={{
                    backgroundColor: meta.colors.bg,
                    color: meta.colors.ink,
                  }}
                >
                  <div>
                    <p className="text-3xl font-semibold">
                      {language === "zh" ? "Slides 加载失败" : "Slides failed to load"}
                    </p>
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        setRetryToken((value) => value + 1);
                      }}
                      className="mt-6 rounded-xl border border-current px-5 py-2 text-lg font-semibold"
                    >
                      {language === "zh" ? "重试" : "Retry"}
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  role="status"
                  aria-label={language === "zh" ? "正在加载 Slides" : "Loading slides"}
                  className="grid h-full w-full place-items-center"
                  style={{
                    backgroundColor: meta.colors.bg,
                    color: meta.colors.ink,
                  }}
                >
                  <span className="font-mono text-xl uppercase tracking-[0.18em] opacity-45">
                    {language === "zh" ? "正在加载" : "Loading"}
                  </span>
                </div>
              )}
            </div>
            {!isPureMode && hoverCue && (
              <div
                aria-hidden="true"
                className={`pointer-events-none absolute top-1/2 z-20 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-black/35 text-2xl text-white backdrop-blur-sm ${hoverCue === "prev" ? "left-3" : "right-3"}`}
              >
                {hoverCue === "prev" ? "‹" : "›"}
              </div>
            )}
            {announceTopic && !isPureMode && (
              <CrossTopicNotice
                styleNumber={styleNumber}
                styleName={found.style.name[language]}
                topicName={found.topic.topic[language]}
                modelId={found.topic.model}
                reducedMotion={reducedMotion}
                onDone={onAnnouncementDone}
              />
            )}
          </div>
        </PureModeOverlay>
      </div>
      {!isPureMode && scenes.length > 0 && (
        <BottomBar
          scenes={scenes}
          currentScene={scene}
          currentBeat={beat}
          onPrev={handlePrev}
          onNext={handleNext}
          onJumpScene={handleJumpScene}
          onJumpBeat={handleJumpBeat}
        />
      )}
    </div>
  );
}

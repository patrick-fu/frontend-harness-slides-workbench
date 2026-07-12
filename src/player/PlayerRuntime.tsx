import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent,
} from "react";
import type { RuntimeTopicEntry } from "../catalog/runtime-registry";
import type {
  TopicMetadata,
  TopicStage,
  TopicStageProps,
} from "../domain/topic";
import type { NavigationIntent, NavigationState } from "../navigation";
import PlayerTransport from "../envelope/PlayerTransport";
import PortraitHint from "./PortraitHint";
import TopicAnnouncement from "./TopicAnnouncement";
import {
  getStageTapNavigationDirection,
  isInteractivePlayerTarget,
  MOBILE_TOUCH_QUERY,
  STAGE_PREVIOUS_ZONE_RATIO,
  usePlayerKeyboard,
  usePlayerTouch,
} from "./input";
import { useStageFit } from "./stage-fit";

export interface PlayerCatalogAccess {
  findTopic: (topicId: string) => RuntimeTopicEntry | null;
  loadStage: (topicId: string) => Promise<TopicStage>;
  prefetchAdjacent: (topicId: string) => Promise<void>;
}

export interface PlayerNavigationAccess {
  state: Pick<
    NavigationState,
    "styleId" | "topicId" | "scene" | "beat" | "pureMode" | "frozen"
  >;
  dispatch: (intent: NavigationIntent) => NavigationState;
  reload: () => void;
}

export type PlayerEnvelopeAction =
  | "overview"
  | "library"
  | "search"
  | "controls";

export interface PlayerRuntimeProps {
  catalog: PlayerCatalogAccess;
  navigation: PlayerNavigationAccess;
  language: "en" | "zh";
  reducedMotion: boolean;
  onEnvelopeAction: (action: PlayerEnvelopeAction) => void;
}

interface TopicStageLoadState {
  key: string;
  status: "loading" | "ready" | "error";
  stage: TopicStage | null;
}

export default function PlayerRuntime({
  catalog,
  navigation,
  language,
  reducedMotion,
  onEnvelopeAction,
}: PlayerRuntimeProps) {
  const { state, dispatch, reload } = navigation;
  const {
    styleId,
    topicId,
    scene,
    beat,
    pureMode: isPureMode,
    frozen,
  } = state;
  const stageContainerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const previousTopicIdRef = useRef(topicId);
  const [hoverCue, setHoverCue] = useState<"prev" | "next" | null>(null);
  const [mobileTouchInput, setMobileTouchInput] = useState(false);
  const [announceTopic, setAnnounceTopic] = useState(false);
  const [topicLoadState, setTopicLoadState] = useState<TopicStageLoadState>({
    key: "",
    status: "loading",
    stage: null,
  });
  const handleTopicAnnouncementDone = useCallback(
    () => setAnnounceTopic(false),
    [],
  );
  const { scale, width: scaledWidth, height: scaledHeight } =
    useStageFit(stageContainerRef);

  useEffect(() => {
    const query = window.matchMedia(MOBILE_TOUCH_QUERY);
    const update = () => setMobileTouchInput(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  const found = useMemo(() => catalog.findTopic(topicId), [catalog, topicId]);
  const meta = useMemo(
    () => found?.topic.metadata[language] ?? null,
    [found, language],
  );
  const scenes = useMemo<TopicMetadata["scenes"]>(
    () => meta?.scenes.map((item) => ({ ...item })) ?? [],
    [meta],
  );
  const topicKey = topicId;
  const activeLoadState =
    topicLoadState.key === topicKey
      ? topicLoadState
      : { key: topicKey, status: "loading" as const, stage: null };

  useEffect(() => {
    if (previousTopicIdRef.current !== topicId) {
      previousTopicIdRef.current = topicId;
      setAnnounceTopic(true);
    }
  }, [topicId]);

  useEffect(() => {
    if (!found) return;
    let cancelled = false;
    setTopicLoadState({ key: topicKey, status: "loading", stage: null });
    void catalog.loadStage(topicId).then(
      (stage) => {
        if (cancelled) return;
        setTopicLoadState({ key: topicKey, status: "ready", stage });
        void catalog.prefetchAdjacent(topicId).catch(() => undefined);
      },
      () => {
        if (!cancelled) {
          setTopicLoadState({ key: topicKey, status: "error", stage: null });
        }
      },
    );
    return () => {
      cancelled = true;
    };
  }, [catalog, found, topicId, topicKey]);

  const handleNext = useCallback(() => {
    dispatch({ type: "move", direction: "next" });
  }, [dispatch]);
  const handlePrev = useCallback(() => {
    dispatch({ type: "move", direction: "prev" });
  }, [dispatch]);
  const handleJumpScene = useCallback(
    (targetScene: number) =>
      dispatch({ type: "jump-scene", scene: targetScene }),
    [dispatch],
  );
  const handleJumpBeat = useCallback(
    (targetBeat: number) =>
      dispatch({ type: "jump-position", scene, beat: targetBeat }),
    [dispatch, scene],
  );
  const handleStageNavigate = useCallback(
    (targetScene: number, targetBeat: number) =>
      dispatch({
        type: "jump-position",
        scene: targetScene,
        beat: targetBeat,
      }),
    [dispatch],
  );
  const handleExitPure = useCallback(() => {
    if (document.fullscreenElement) return;
    dispatch({ type: "set-pure", pureMode: false });
  }, [dispatch]);

  usePlayerKeyboard({
    pureMode: isPureMode,
    onNext: handleNext,
    onPrev: handlePrev,
    onExitPure: handleExitPure,
    onSearch: () => onEnvelopeAction("search"),
    onControls: () => onEnvelopeAction("controls"),
  });
  const { markRecentTouch, wasRecentTouch } = usePlayerTouch({
    elementRef: stageRef,
    onNext: handleNext,
    onPrev: handlePrev,
    enabled: mobileTouchInput,
  });

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-pure-mode",
      isPureMode ? "true" : "false",
    );
    return () => document.documentElement.removeAttribute("data-pure-mode");
  }, [isPureMode]);

  useEffect(() => {
    document.documentElement.toggleAttribute("data-frozen", frozen);
    if (frozen) document.documentElement.setAttribute("data-frozen", "true");
    return () => document.documentElement.removeAttribute("data-frozen");
  }, [frozen]);

  const handleStageClick = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      if (wasRecentTouch()) return;
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.altKey || event.ctrlKey || event.shiftKey) return;
      if (isInteractivePlayerTarget(event.target)) return;
      const rect = event.currentTarget.getBoundingClientRect();
      const direction = getStageTapNavigationDirection(
        event.clientX,
        rect.left,
        rect.width,
      );
      if (direction === "prev") handlePrev();
      else handleNext();
    },
    [handleNext, handlePrev, wasRecentTouch],
  );

  if (!found || !meta) {
    return (
      <div
        data-testid="player-runtime"
        data-player-runtime="true"
        data-player-state="unavailable"
        className="grid h-full w-full place-items-center bg-canvas p-6 text-ink"
      >
        <div className="max-w-md text-center">
          <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.18em] text-ink/40">404 · Topic unavailable</div>
          <h1 className="text-xl font-semibold">{language === "zh" ? "无法找到这份 Slides" : "This slide deck is unavailable"}</h1>
          <p className="mt-2 break-all text-sm text-ink/50">{styleId} / {topicId}</p>
          <div className="mt-6 flex justify-center gap-2">
            <button type="button" onClick={() => onEnvelopeAction("overview")} className="h-10 rounded-xl bg-ink px-4 text-xs font-semibold text-paper">{language === "zh" ? "返回总览" : "Back to Overview"}</button>
            <button type="button" onClick={() => onEnvelopeAction("library")} className="h-10 rounded-xl border border-ink/15 px-4 text-xs font-semibold">{language === "zh" ? "打开资料库" : "Open Library"}</button>
          </div>
        </div>
      </div>
    );
  }

  const LoadedStage = activeLoadState.stage;
  const isTopicReady = Boolean(LoadedStage);
  const stageProps: TopicStageProps = {
    scene,
    beat,
    language,
    isThumbnail: false,
    reducedMotion: reducedMotion || frozen,
    onNavigate: handleStageNavigate,
  };
  const styleNumber = found.styleIndex + 1;

  return (
    <div
      data-testid="player-runtime"
      data-player-runtime="true"
      data-player-state={activeLoadState.status}
      data-player-topic={topicId}
      className="flex h-full w-full min-h-0 flex-col"
    >
      <div
        ref={stageContainerRef}
        className="relative flex min-h-0 min-w-0 flex-1 items-center justify-center overflow-hidden bg-canvas"
      >
        <div
          data-testid="pure-mode-stage"
          className={
            isPureMode
              ? "fixed inset-0 z-40 flex h-full w-full items-center justify-center"
              : "flex h-full w-full items-center justify-center"
          }
        >
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
              onTouchEndCapture={markRecentTouch}
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
              {LoadedStage ? (
                <LoadedStage {...stageProps} />
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
                        // Browsers cache a failed module import, so the same loader cannot retry it.
                        reload();
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
              <TopicAnnouncement
                key={topicId}
                styleNumber={styleNumber}
                styleName={found.style.name[language]}
                topicName={found.topic.title[language]}
                modelId={found.topic.modelId}
                reducedMotion={reducedMotion}
                onDone={handleTopicAnnouncementDone}
              />
            )}
          </div>
        </div>
      </div>
      {!isPureMode && scenes.length > 0 && (
        <PlayerTransport
          language={language}
          scenes={scenes}
          currentScene={scene}
          currentBeat={beat}
          onPrev={handlePrev}
          onNext={handleNext}
          onJumpScene={handleJumpScene}
          onJumpBeat={handleJumpBeat}
        />
      )}
      {!isPureMode && <PortraitHint language={language} />}
    </div>
  );
}

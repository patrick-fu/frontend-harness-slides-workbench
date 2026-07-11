import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  LanguageProvider,
  ReducedMotionProvider,
  ThemeProvider,
  useLanguage,
  useReducedMotion,
  useTheme,
} from "./contexts";
import CatalogHeader from "./components/chrome/CatalogHeader";
import CommandPalette from "./components/chrome/CommandPalette";
import ControlsGuide from "./components/chrome/ControlsGuide";
import GlobalControls from "./components/chrome/GlobalControls";
import LibraryDrawer from "./components/chrome/LibraryDrawer";
import PlayerRail from "./components/chrome/PlayerRail";
import PlayerTopBar from "./components/chrome/PlayerTopBar";
import LabView from "./components/LabView";
import OverviewView from "./components/OverviewView";
import PortraitHint from "./components/PortraitHint";
import { useFontPreload } from "./hooks/useFontPreload";
import { useKeyboard } from "./hooks/useKeyboard";
import { useUrlState } from "./hooks/useUrlState";
import {
  STYLE_REGISTRY,
  loadRegistryTopicComponent,
  prefetchAdjacentRegistryTopics,
} from "./styles/registry";
import type { NavTarget } from "./utils/navigation";

const RECENT_TOPICS_KEY = "fhsw:recent-topics";

function readRecentTopics(): string[] {
  try {
    const value = JSON.parse(localStorage.getItem(RECENT_TOPICS_KEY) ?? "[]");
    return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string").slice(0, 8) : [];
  } catch {
    return [];
  }
}

function AppContent() {
  const { language, resolvedLanguage, setLanguage } = useLanguage();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const { reducedMotion } = useReducedMotion();
  const [urlState, setUrlState] = useUrlState();
  const displayLanguage = urlState.lang ?? resolvedLanguage;
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [controlsOpen, setControlsOpen] = useState(false);
  const [announceTopic, setAnnounceTopic] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(Boolean(document.fullscreenElement));
  const [recentTopics, setRecentTopics] = useState(readRecentTopics);
  const catalogScrollRef = useRef<HTMLDivElement>(null);

  useFontPreload(STYLE_REGISTRY, displayLanguage);

  const activeStyle = useMemo(
    () => STYLE_REGISTRY.find((style) => style.id === urlState.styleId) ?? null,
    [urlState.styleId],
  );
  const activeTopic = useMemo(
    () => activeStyle?.topics.find((topic) => topic.id === urlState.topicId) ?? null,
    [activeStyle, urlState.topicId],
  );

  useEffect(() => {
    const base = displayLanguage === "zh" ? "FH Slides 工作台" : "FH Slides Workbench";
    document.title =
      urlState.view === "lab" && activeTopic
        ? `${activeTopic.topic[displayLanguage]} — ${base}`
        : base;
  }, [activeTopic, displayLanguage, urlState.view]);

  useEffect(() => {
    if (urlState.view !== "lab" || !activeTopic || !activeStyle) return;
    const key = `${activeStyle.id}/${activeTopic.id}`;
    setRecentTopics((current) => {
      const next = [key, ...current.filter((item) => item !== key)].slice(0, 8);
      try {
        localStorage.setItem(RECENT_TOPICS_KEY, JSON.stringify(next));
      } catch {
        // localStorage unavailable
      }
      return next;
    });
  }, [activeStyle, activeTopic, urlState.view]);

  useEffect(() => {
    if (!activeTopic) return;
    const metadata = activeTopic.getMetadata(displayLanguage);
    const targetScene = metadata.scenes.find((item) => item.id === urlState.scene) ?? metadata.scenes[0];
    if (!targetScene) return;
    const lastBeat = targetScene.beats[targetScene.beats.length - 1]?.id ?? 0;
    const nextBeat = Math.min(Math.max(0, urlState.beat), lastBeat);
    if (targetScene.id !== urlState.scene || nextBeat !== urlState.beat) {
      setUrlState({ scene: targetScene.id, beat: nextBeat }, { history: "replace" });
    }
  }, [activeTopic, displayLanguage, setUrlState, urlState.beat, urlState.scene]);

  useEffect(() => {
    const handler = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const id = window.setTimeout(() => setToast(null), 1800);
    return () => window.clearTimeout(id);
  }, [toast]);

  const openPalette = useCallback(() => setPaletteOpen(true), []);
  const openControls = useCallback(() => setControlsOpen(true), []);
  useKeyboard({
    onCommandPalette: urlState.view === "overview" ? openPalette : undefined,
    onHelp: urlState.view === "overview" ? openControls : undefined,
  });

  const goOverview = useCallback(() => {
    setLibraryOpen(false);
    setUrlState({ view: "overview", pureMode: false }, { history: "push" });
  }, [setUrlState]);
  const goHome = useCallback(() => {
    setUrlState({ view: "overview", bands: [], models: [], pureMode: false }, { history: "replace" });
    catalogScrollRef.current?.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
  }, [reducedMotion, setUrlState]);
  const selectTopic = useCallback(
    (styleId: string, topicId: string) => {
      setLibraryOpen(false);
      setPaletteOpen(false);
      setUrlState(
        { view: "lab", styleId, topicId, scene: 1, beat: 0, pureMode: false },
        { history: "push" },
      );
    },
    [setUrlState],
  );
  const navigate = useCallback(
    (target: NavTarget) => {
      const crossedTopic = target.styleId !== urlState.styleId || target.topicId !== urlState.topicId;
      setUrlState(
        {
          styleId: target.styleId,
          topicId: target.topicId,
          scene: target.scene,
          beat: target.beat,
        },
        { history: "replace" },
      );
      if (crossedTopic) setAnnounceTopic(true);
    },
    [setUrlState, urlState.styleId, urlState.topicId],
  );

  const updateFilters = useCallback(
    (next: { bands: string[]; models: string[] }) =>
      setUrlState(next, { history: "replace" }),
    [setUrlState],
  );

  const getTopicHref = useCallback(
    (styleId: string, topicId: string) => {
      const params = new URLSearchParams(window.location.search);
      params.set("view", "lab");
      params.set("style", styleId);
      params.set("topic", topicId);
      params.set("scene", "1");
      params.set("beat", "0");
      params.delete("pure");
      return `${window.location.pathname}?${params.toString()}`;
    },
    [],
  );

  const handleLanguageChange = useCallback(
    (mode: "auto" | "en" | "zh") => {
      setLanguage(mode);
      setUrlState({ lang: mode === "auto" ? null : mode }, { history: "replace" });
    },
    [setLanguage, setUrlState],
  );
  const copyLink = useCallback(async () => {
    const url = new URL(window.location.href);
    url.searchParams.set("lang", displayLanguage);
    try {
      await navigator.clipboard.writeText(url.toString());
      setToast(displayLanguage === "zh" ? "链接已复制" : "Link copied");
    } catch {
      setToast(displayLanguage === "zh" ? "复制失败" : "Copy failed");
    }
  }, [displayLanguage]);
  const shareLink = useCallback(async () => {
    const url = new URL(window.location.href);
    url.searchParams.set("lang", displayLanguage);
    try {
      await navigator.share({ title: document.title, url: url.toString() });
    } catch {
      // Native share cancellation is not an error state.
    }
  }, [displayLanguage]);
  const toggleFullscreen = useCallback(async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await document.documentElement.requestFullscreen();
    } catch {
      setToast(displayLanguage === "zh" ? "无法进入全屏" : "Fullscreen unavailable");
    }
  }, [displayLanguage]);
  const exitPure = useCallback(() => {
    if (document.fullscreenElement) return;
    setUrlState({ pureMode: false }, { history: "replace" });
  }, [setUrlState]);

  const controls = (view: "overview" | "lab") => (
    <GlobalControls
      view={view}
      language={displayLanguage}
      languageMode={urlState.lang ?? language}
      themeMode={theme}
      onLanguageChange={handleLanguageChange}
      onThemeChange={setTheme}
      onCopyLink={copyLink}
      onShare={shareLink}
      onOpenControls={openControls}
      onToggleFullscreen={toggleFullscreen}
      isFullscreen={isFullscreen}
    />
  );

  return (
    <div className="h-full w-full overflow-hidden bg-paper text-ink" data-theme={resolvedTheme}>
      <div
        ref={catalogScrollRef}
        className="h-full w-full overflow-y-auto"
        style={{ display: urlState.view === "overview" ? "block" : "none" }}
      >
        <CatalogHeader
          language={displayLanguage}
          onHome={goHome}
          onOpenPalette={openPalette}
          controls={controls("overview")}
        />
        <OverviewView
          registry={STYLE_REGISTRY}
          language={displayLanguage}
          filters={{ bands: urlState.bands, models: urlState.models }}
          onFiltersChange={updateFilters}
          getTopicHref={getTopicHref}
          onOpenTopic={selectTopic}
          onPrefetchTopic={(styleId, topicId) => {
            void loadRegistryTopicComponent(styleId, topicId).catch(() => undefined);
          }}
        />
      </div>

      {urlState.view === "lab" && (
        <div className="flex h-full w-full">
          {!urlState.pureMode && (
            <PlayerRail
              language={displayLanguage}
              onOverview={goOverview}
              onLibrary={() => setLibraryOpen(true)}
              onSearch={openPalette}
            />
          )}
          <div className="flex min-w-0 flex-1 flex-col">
            {!urlState.pureMode && (
              <PlayerTopBar
                style={activeStyle}
                topicId={urlState.topicId}
                language={displayLanguage}
                onOverview={goOverview}
                onLibrary={() => setLibraryOpen(true)}
                onSearch={openPalette}
                onSelectTopic={(topicId) => activeStyle && selectTopic(activeStyle.id, topicId)}
                onPresent={() => setUrlState({ pureMode: true }, { history: "replace" })}
                controls={controls("lab")}
              />
            )}
            <div className="min-h-0 flex-1">
              <LabView
                registry={STYLE_REGISTRY}
                styleId={urlState.styleId}
                topicId={urlState.topicId}
                scene={urlState.scene}
                beat={urlState.beat}
                isPureMode={urlState.pureMode}
                reducedMotion={reducedMotion}
                language={displayLanguage}
                frozen={urlState.frozen}
                announceTopic={announceTopic}
                onNavigate={navigate}
                onAnnouncementDone={() => setAnnounceTopic(false)}
                onExitPure={exitPure}
                onGoOverview={goOverview}
                onOpenLibrary={() => setLibraryOpen(true)}
                onOpenPalette={openPalette}
                onOpenControls={openControls}
                loadTopic={loadRegistryTopicComponent}
                prefetchAdjacentTopics={prefetchAdjacentRegistryTopics}
              />
            </div>
          </div>
        </div>
      )}

      <LibraryDrawer
        open={libraryOpen}
        registry={STYLE_REGISTRY}
        currentStyleId={urlState.styleId}
        currentTopicId={urlState.topicId}
        language={displayLanguage}
        onClose={() => setLibraryOpen(false)}
        onSelectTopic={selectTopic}
      />
      <CommandPalette
        open={paletteOpen}
        registry={STYLE_REGISTRY}
        language={displayLanguage}
        recent={recentTopics}
        onClose={() => setPaletteOpen(false)}
        onSelectTopic={selectTopic}
      />
      <ControlsGuide
        open={controlsOpen}
        view={urlState.view}
        language={displayLanguage}
        onClose={() => setControlsOpen(false)}
      />
      {urlState.view === "lab" && !urlState.pureMode && <PortraitHint language={displayLanguage} />}
      {toast && (
        <div role="status" className="fixed bottom-5 left-1/2 z-[120] -translate-x-1/2 rounded-full bg-ink px-4 py-2 text-xs font-medium text-paper shadow-xl">
          {toast}
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <ReducedMotionProvider>
          <AppContent />
        </ReducedMotionProvider>
      </ThemeProvider>
    </LanguageProvider>
  );
}

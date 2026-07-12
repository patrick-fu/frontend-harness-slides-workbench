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
import OverviewView from "./components/OverviewView";
import { useFontPreload } from "./hooks/useFontPreload";
import { useGlobalShortcuts } from "./hooks/useGlobalShortcuts";
import { useNavigationState } from "./navigation/useNavigationState";
import {
  findRuntimeTopic,
  loadRuntimeTopicStage,
  RUNTIME_REGISTRY,
} from "./catalog/runtime-registry";
import PlayerRuntime, {
  type PlayerEnvelopeAction,
} from "./player/PlayerRuntime";
import { RUNTIME_PLAYER_CATALOG } from "./player/runtime-catalog";

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
  const {
    state: urlState,
    dispatch: dispatchNavigation,
    href: getNavigationHref,
    catalogScrollTop,
  } = useNavigationState(RUNTIME_REGISTRY);
  const displayLanguage = urlState.lang ?? resolvedLanguage;
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [controlsOpen, setControlsOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(Boolean(document.fullscreenElement));
  const [recentTopics, setRecentTopics] = useState(readRecentTopics);
  const catalogScrollRef = useRef<HTMLDivElement>(null);
  const skipNextCatalogScrollRestoreRef = useRef(false);

  useFontPreload(RUNTIME_REGISTRY, displayLanguage);

  const activeTopicEntry = useMemo(
    () => findRuntimeTopic(urlState.topicId),
    [urlState.topicId],
  );
  const activeGroup = activeTopicEntry
    ? RUNTIME_REGISTRY[activeTopicEntry.styleIndex] ?? null
    : null;
  const activeStyle = activeTopicEntry?.style ?? null;
  const activeTopic = activeTopicEntry?.topic ?? null;
  const resolvedStyleId = activeTopic?.styleId ?? urlState.styleId;

  useEffect(() => {
    const base = displayLanguage === "zh" ? "FH Slides 工作台" : "FH Slides Workbench";
    document.title =
      urlState.view === "lab" && activeTopic
        ? `${activeTopic.title[displayLanguage]} — ${base}`
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
    if (skipNextCatalogScrollRestoreRef.current) {
      skipNextCatalogScrollRestoreRef.current = false;
      return;
    }
    if (urlState.view !== "overview" || catalogScrollTop === null) return;
    const scroller = catalogScrollRef.current;
    if (!scroller) return;
    if (typeof scroller.scrollTo === "function") {
      scroller.scrollTo({ top: catalogScrollTop, behavior: "auto" });
    } else {
      scroller.scrollTop = catalogScrollTop;
    }
  }, [catalogScrollTop, urlState.view]);

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
  useGlobalShortcuts({
    onCommandPalette: urlState.view === "overview" ? openPalette : undefined,
    onHelp: urlState.view === "overview" ? openControls : undefined,
  });

  const goOverview = useCallback(() => {
    setLibraryOpen(false);
    dispatchNavigation({ type: "show-overview" });
  }, [dispatchNavigation]);
  const goHome = useCallback(() => {
    skipNextCatalogScrollRestoreRef.current = catalogScrollTop !== 0;
    dispatchNavigation({ type: "reset-catalog" });
    catalogScrollRef.current?.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
  }, [catalogScrollTop, dispatchNavigation, reducedMotion]);
  const selectTopic = useCallback(
    (_styleId: string, topicId: string) => {
      setLibraryOpen(false);
      setPaletteOpen(false);
      dispatchNavigation({
        type: "open-topic",
        topicId,
        catalogScrollTop: catalogScrollRef.current?.scrollTop,
      });
    },
    [dispatchNavigation],
  );
  const updateFilters = useCallback(
    (next: { bands: string[]; models: string[] }) =>
      dispatchNavigation({ type: "set-filters", ...next }),
    [dispatchNavigation],
  );

  const getTopicHref = useCallback(
    (_styleId: string, topicId: string) =>
      getNavigationHref({ type: "open-topic", topicId }),
    [getNavigationHref],
  );

  const handleLanguageChange = useCallback(
    (mode: "auto" | "en" | "zh") => {
      setLanguage(mode);
      dispatchNavigation({
        type: "set-language",
        language: mode === "auto" ? null : mode,
      });
    },
    [dispatchNavigation, setLanguage],
  );
  const copyLink = useCallback(async () => {
    const url = new URL(
      getNavigationHref({
        type: "set-language",
        language: displayLanguage,
      }),
      window.location.origin,
    );
    try {
      await navigator.clipboard.writeText(url.toString());
      setToast(displayLanguage === "zh" ? "链接已复制" : "Link copied");
    } catch {
      setToast(displayLanguage === "zh" ? "复制失败" : "Copy failed");
    }
  }, [displayLanguage, getNavigationHref]);
  const shareLink = useCallback(async () => {
    const url = new URL(
      getNavigationHref({
        type: "set-language",
        language: displayLanguage,
      }),
      window.location.origin,
    );
    try {
      await navigator.share({ title: document.title, url: url.toString() });
    } catch {
      // Native share cancellation is not an error state.
    }
  }, [displayLanguage, getNavigationHref]);
  const toggleFullscreen = useCallback(async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await document.documentElement.requestFullscreen();
    } catch {
      setToast(displayLanguage === "zh" ? "无法进入全屏" : "Fullscreen unavailable");
    }
  }, [displayLanguage]);
  const handlePlayerEnvelopeAction = useCallback(
    (action: PlayerEnvelopeAction) => {
      if (action === "overview") goOverview();
      else if (action === "library") setLibraryOpen(true);
      else if (action === "search") openPalette();
      else openControls();
    },
    [goOverview, openControls, openPalette],
  );

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
          registry={RUNTIME_REGISTRY}
          language={displayLanguage}
          filters={{ bands: urlState.bands, models: urlState.models }}
          onFiltersChange={updateFilters}
          getTopicHref={getTopicHref}
          onOpenTopic={selectTopic}
          onPrefetchTopic={(topicId) => {
            void loadRuntimeTopicStage(topicId).catch(() => undefined);
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
                group={activeGroup}
                topicId={urlState.topicId}
                language={displayLanguage}
                onOverview={goOverview}
                onLibrary={() => setLibraryOpen(true)}
                onSearch={openPalette}
                onSelectTopic={(topicId) => activeStyle && selectTopic(activeStyle.id, topicId)}
                onPresent={() =>
                  dispatchNavigation({ type: "set-pure", pureMode: true })
                }
                controls={controls("lab")}
              />
            )}
            <div className="min-h-0 flex-1">
              <PlayerRuntime
                catalog={RUNTIME_PLAYER_CATALOG}
                navigation={{ state: urlState, dispatch: dispatchNavigation }}
                language={displayLanguage}
                reducedMotion={reducedMotion}
                onEnvelopeAction={handlePlayerEnvelopeAction}
              />
            </div>
          </div>
        </div>
      )}

      <LibraryDrawer
        open={libraryOpen}
        registry={RUNTIME_REGISTRY}
        currentStyleId={resolvedStyleId}
        currentTopicId={urlState.topicId}
        language={displayLanguage}
        onClose={() => setLibraryOpen(false)}
        onSelectTopic={selectTopic}
      />
      <CommandPalette
        open={paletteOpen}
        registry={RUNTIME_REGISTRY}
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

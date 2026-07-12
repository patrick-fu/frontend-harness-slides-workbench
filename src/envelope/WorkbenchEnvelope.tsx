import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  useLanguage,
  useReducedMotion,
  useTheme,
} from "../contexts";
import CatalogHeader from "./CatalogHeader";
import CommandPalette from "./CommandPalette";
import ControlsGuide from "./ControlsGuide";
import GlobalControls from "./GlobalControls";
import IdentityBadge from "./IdentityBadge";
import LibraryDrawer from "./LibraryDrawer";
import PlayerRail from "./PlayerRail";
import PlayerTopBar from "./PlayerTopBar";
import PlayerTransport from "./PlayerTransport";
import PlayerFilterControl from "./PlayerFilterControl";
import CatalogView from "./CatalogView";
import { useFontPreload } from "./useFontPreload";
import { useGlobalShortcuts } from "./useGlobalShortcuts";
import { useNavigationState } from "../navigation/useNavigationState";
import {
  findRuntimeTopic,
  loadRuntimeTopicStage,
  RUNTIME_REGISTRY,
} from "../catalog/runtime-registry";
import { RUNTIME_CATALOG } from "../catalog/runtime-catalog";
import PlayerRuntime, {
  type PlayerEnvelopeAction,
} from "../player/PlayerRuntime";
import { resolveCatalogFilters } from "../utils/catalog-filter";

const RECENT_TOPICS_KEY = "fhsw:recent-topics";

function readRecentTopics(): string[] {
  try {
    const value = JSON.parse(localStorage.getItem(RECENT_TOPICS_KEY) ?? "[]");
    return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string").slice(0, 8) : [];
  } catch {
    return [];
  }
}

export default function WorkbenchEnvelope() {
  const { language, resolvedLanguage, setLanguage } = useLanguage();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const { reducedMotion } = useReducedMotion();
  const {
    state: urlState,
    dispatch: dispatchNavigation,
    href: getNavigationHref,
    reload: reloadNavigation,
    catalogScrollTop,
  } = useNavigationState(RUNTIME_CATALOG.discovery.styleGroups);
  const displayLanguage = urlState.lang ?? resolvedLanguage;
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [controlsOpen, setControlsOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(Boolean(document.fullscreenElement));
  const [recentTopics, setRecentTopics] = useState(readRecentTopics);
  const catalogScrollRef = useRef<HTMLDivElement>(null);
  const skipNextCatalogScrollRestoreRef = useRef(false);

  useFontPreload(RUNTIME_CATALOG.discovery.styleGroups, displayLanguage);

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
  const filterResolution = useMemo(
    () =>
      resolveCatalogFilters(
        RUNTIME_CATALOG.discovery.styleGroups,
        displayLanguage,
        {
          bands: urlState.bands,
          models: urlState.models,
        },
        urlState.topicId,
      ),
    [displayLanguage, urlState.bands, urlState.models, urlState.topicId],
  );
  const topicSwitcherOptions = useMemo(
    () =>
      activeGroup?.topics.filter(
        (topic) => filterResolution.isTopicInCycleScope(topic.id),
      ) ?? [],
    [activeGroup, filterResolution],
  );

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

  useEffect(() => {
    if (!urlState.pureMode) return;
    setLibraryOpen(false);
    setPaletteOpen(false);
    setControlsOpen(false);
    setToast(null);
  }, [urlState.pureMode]);

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
  const selectTopicById = useCallback(
    (topicId: string) => {
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
  const selectTopic = useCallback(
    (_styleId: string, topicId: string) => selectTopicById(topicId),
    [selectTopicById],
  );
  const updateFilters = useCallback(
    (next: { bands: string[]; models: string[] }) =>
      dispatchNavigation({ type: "set-filters", ...next }),
    [dispatchNavigation],
  );

  const getTopicHrefById = useCallback(
    (topicId: string) => getNavigationHref({ type: "open-topic", topicId }),
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
      {urlState.view === "overview" && (
        <div
          ref={catalogScrollRef}
          className="h-full w-full overflow-y-auto"
        >
          <CatalogHeader
            language={displayLanguage}
            onHome={goHome}
            onOpenPalette={openPalette}
            controls={controls("overview")}
          />
          <CatalogView
            registry={RUNTIME_REGISTRY}
            language={displayLanguage}
            filters={{ bands: urlState.bands, models: urlState.models }}
            resolution={filterResolution}
            onFiltersChange={updateFilters}
            getTopicHref={getTopicHrefById}
            onOpenTopic={selectTopicById}
            onPrefetchTopic={(topicId) => {
              void loadRuntimeTopicStage(topicId).catch(() => undefined);
            }}
          />
        </div>
      )}

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
                language={displayLanguage}
                onOverview={goOverview}
                onLibrary={() => setLibraryOpen(true)}
                onSearch={openPalette}
                onPresent={() =>
                  dispatchNavigation({ type: "set-pure", pureMode: true })
                }
                filterControl={
                  <PlayerFilterControl
                    language={displayLanguage}
                    filters={{ bands: urlState.bands, models: urlState.models }}
                    resolution={filterResolution}
                    onFiltersChange={updateFilters}
                  />
                }
                controls={controls("lab")}
              />
            )}
            <div
              data-testid="stage-matte"
              className="relative min-h-0 flex-1"
            >
              <PlayerRuntime
                catalog={RUNTIME_CATALOG.player}
                navigation={{
                  state: urlState,
                  dispatch: dispatchNavigation,
                  reload: reloadNavigation,
                }}
                language={displayLanguage}
                reducedMotion={reducedMotion}
                onEnvelopeAction={handlePlayerEnvelopeAction}
              />
              {!urlState.pureMode && (
                <div className="absolute left-2 top-0 z-[80]">
                  <IdentityBadge
                    group={activeGroup}
                    topicId={urlState.topicId}
                    topicOptions={topicSwitcherOptions}
                    language={displayLanguage}
                    onSelectTopic={(topicId) =>
                      activeStyle && selectTopic(activeStyle.id, topicId)
                    }
                  />
                </div>
              )}
            </div>
            {!urlState.pureMode &&
              activeTopic &&
              activeTopic.metadata[displayLanguage].scenes.length > 0 && (
                <PlayerTransport
                  language={displayLanguage}
                  scenes={activeTopic.metadata[displayLanguage].scenes}
                  currentScene={urlState.scene}
                  currentBeat={urlState.beat}
                  onPrev={() =>
                    dispatchNavigation({ type: "move", direction: "prev" })
                  }
                  onNext={() =>
                    dispatchNavigation({ type: "move", direction: "next" })
                  }
                  onJumpScene={(scene) =>
                    dispatchNavigation({ type: "jump-scene", scene })
                  }
                  onJumpBeat={(beat) =>
                    dispatchNavigation({
                      type: "jump-position",
                      scene: urlState.scene,
                      beat,
                    })
                  }
                />
              )}
          </div>
        </div>
      )}

      {!urlState.pureMode && <>
        <LibraryDrawer
          open={libraryOpen}
          registry={RUNTIME_REGISTRY}
          currentStyleId={resolvedStyleId}
          currentTopicId={urlState.topicId}
          language={displayLanguage}
          isTopicInCycleScope={filterResolution.isTopicInCycleScope}
          onClose={() => setLibraryOpen(false)}
          onSelectTopic={selectTopicById}
        />
        <CommandPalette
          open={paletteOpen}
          registry={RUNTIME_REGISTRY}
          language={displayLanguage}
          recent={recentTopics}
          isTopicInCycleScope={filterResolution.isTopicInCycleScope}
          onClose={() => setPaletteOpen(false)}
          onSelectTopic={selectTopic}
        />
        <ControlsGuide
          open={controlsOpen}
          view={urlState.view}
          language={displayLanguage}
          onClose={() => setControlsOpen(false)}
        />
      </>}
      {!urlState.pureMode && toast && (
        <div role="status" className="fixed bottom-5 left-1/2 z-[120] -translate-x-1/2 rounded-full bg-ink px-4 py-2 text-xs font-medium text-paper shadow-xl">
          {toast}
        </div>
      )}
    </div>
  );
}

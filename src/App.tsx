import { useState, useCallback, useEffect, useMemo } from "react";
import {
  LanguageProvider,
  useLanguage,
  ThemeProvider,
  useTheme,
  ReducedMotionProvider,
  useReducedMotion,
} from "./contexts";
import { STYLE_REGISTRY } from "./styles/registry";
import { useUrlState } from "./hooks/useUrlState";
import { useFontPreload } from "./hooks/useFontPreload";
import Header from "./components/layout/Header";
import Sidebar from "./components/layout/Sidebar";
import OverviewView from "./components/OverviewView";
import LabView from "./components/LabView";
import PortraitHint from "./components/PortraitHint";

// ─── Sidebar localStorage keys ──────────────────────────────────────────────

const SIDEBAR_WIDTH_KEY = "fhsw:sidebar-width";
const SIDEBAR_COLLAPSED_KEY = "fhsw:sidebar-collapsed";
const DEFAULT_SIDEBAR_WIDTH = 280;

// ─── App Content (inside providers) ─────────────────────────────────────────

function AppContent() {
  const { language, resolvedLanguage, setLanguage } = useLanguage();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const { reducedMotion } = useReducedMotion();
  const [urlState, setUrlState] = useUrlState();

  // Font preloading
  useFontPreload(STYLE_REGISTRY, resolvedLanguage);

  // ── Sidebar state ────────────────────────────────────────────────────────

  const [sidebarWidth, setSidebarWidth] = useState(() => {
    try {
      const stored = localStorage.getItem(SIDEBAR_WIDTH_KEY);
      if (stored) {
        const n = parseInt(stored, 10);
        if (!isNaN(n) && n >= 240 && n <= 360) return n;
      }
    } catch {
      // ignore
    }
    return DEFAULT_SIDEBAR_WIDTH;
  });

  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    try {
      return localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === "1";
    } catch {
      return false;
    }
  });

  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Persist sidebar settings
  useEffect(() => {
    try {
      localStorage.setItem(SIDEBAR_WIDTH_KEY, String(sidebarWidth));
    } catch {
      // ignore
    }
  }, [sidebarWidth]);

  useEffect(() => {
    try {
      localStorage.setItem(SIDEBAR_COLLAPSED_KEY, sidebarCollapsed ? "1" : "0");
    } catch {
      // ignore
    }
  }, [sidebarCollapsed]);

  // ── Cross-style flash state ──────────────────────────────────────────────

  const [flashStyle, setFlashStyle] = useState(false);

  // ── Viewport detection: sidebar only pushes content on desktop (≥md=768px)
  // On mobile, sidebar is a drawer overlay — content should be full-width.

  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth >= 768 : true,
  );

  useEffect(() => {
    const mql = window.matchMedia("(min-width: 768px)");
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    setIsDesktop(mql.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  // ── Document title ───────────────────────────────────────────────────────

  useEffect(() => {
    const baseTitle =
      resolvedLanguage === "zh" ? "FH Slides 工作台" : "FH Slides Workbench";

    if (urlState.view === "lab") {
      const style = STYLE_REGISTRY.find((s) => s.id === urlState.styleId);
      if (style) {
        const styleName = style.name[resolvedLanguage];
        document.title = `${styleName} — ${baseTitle}`;
        return;
      }
    }

    document.title = baseTitle;
  }, [urlState.view, urlState.styleId, resolvedLanguage]);

  // ── Handlers ─────────────────────────────────────────────────────────────

  const handleToggleSidebar = useCallback(() => {
    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      setSidebarOpen((prev) => !prev);
    } else {
      setSidebarCollapsed((prev) => !prev);
    }
  }, []);

  const handleCloseSidebar = useCallback(() => {
    setSidebarOpen(false);
  }, []);

  const handleSidebarWidthChange = useCallback((w: number) => {
    setSidebarWidth(w);
  }, []);

  const handleGoOverview = useCallback(() => {
    setUrlState({ view: "overview" });
  }, [setUrlState]);

  const handleSelectStyle = useCallback(
    (styleId: string) => {
      // Find the style to get its first topic.
      const style = STYLE_REGISTRY.find((s) => s.id === styleId);
      const topicId = style?.topics[0]?.id || "product-keynote";
      setUrlState({
        view: "lab",
        styleId,
        topicId,
        scene: 1,
        beat: 0,
      });
      setSidebarOpen(false);
    },
    [setUrlState],
  );

  const handleSelectTopic = useCallback(
    (styleId: string, topicId: string) => {
      setUrlState({
        view: "lab",
        styleId,
        topicId,
        scene: 1,
        beat: 0,
      });
      setSidebarOpen(false);
    },
    [setUrlState],
  );

  const handleNavigate = useCallback(
    (target: {
      styleId: string;
      topicId: string;
      scene: number;
      beat: number;
      flashStyle?: boolean;
    }) => {
      setUrlState({
        styleId: target.styleId,
        topicId: target.topicId,
        scene: target.scene,
        beat: target.beat,
      });
      if (target.flashStyle) {
        setFlashStyle(true);
      }
    },
    [setUrlState],
  );

  const handleFlashDone = useCallback(() => {
    setFlashStyle(false);
  }, []);

  const handleExitPure = useCallback(() => {
    setUrlState({ pureMode: false });
  }, [setUrlState]);

  // ── Compute layout offsets ───────────────────────────────────────────────

  const isLab = urlState.view === "lab";

  const contentStyle = useMemo(() => {
    const effectiveSidebarWidth = sidebarCollapsed ? 48 : sidebarWidth;
    const headerHeight = 36; // h-9
    const topicBarHeight = isLab ? 28 : 0; // h-7, only in lab
    const bottomBarHeight = isLab ? 36 : 0; // h-9

    return {
      paddingTop: headerHeight + topicBarHeight,
      paddingLeft: isDesktop ? effectiveSidebarWidth : 0,
      paddingBottom: bottomBarHeight,
    };
  }, [sidebarWidth, sidebarCollapsed, isLab, isDesktop]);

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <div
      className="w-full h-full bg-paper text-ink"
      data-theme={resolvedTheme}
    >
      {/* Header (hidden in pure mode by CSS) */}
      <div
        style={{ display: urlState.pureMode ? "none" : undefined }}
      >
        <Header
          onToggleSidebar={handleToggleSidebar}
          onGoOverview={handleGoOverview}
          language={language}
          setLanguage={setLanguage}
          theme={theme}
          setTheme={setTheme}
        />
      </div>

      {/* Sidebar (hidden in pure mode by CSS) */}
      <div
        style={{ display: urlState.pureMode ? "none" : undefined }}
      >
          <Sidebar
            registry={STYLE_REGISTRY}
            currentStyleId={urlState.styleId}
            currentTopicId={urlState.topicId}
            onSelectStyle={handleSelectStyle}
            onSelectTopic={handleSelectTopic}
          isOpen={sidebarOpen}
          onClose={handleCloseSidebar}
          language={resolvedLanguage}
          width={sidebarWidth}
          onWidthChange={handleSidebarWidthChange}
          collapsed={sidebarCollapsed}
        />
      </div>

      {/* Main content area */}
      <main
        className="w-full h-full"
        style={
          urlState.pureMode
            ? undefined
            : {
                paddingTop: contentStyle.paddingTop,
                paddingLeft: contentStyle.paddingLeft,
                paddingBottom: contentStyle.paddingBottom,
                height: "100vh",
              }
        }
      >
        {/* OverviewView: always mounted, hidden via display:none when not active */}
        <div
          style={{
            display: urlState.view === "overview" ? "block" : "none",
            width: "100%",
            height: "100%",
            overflow: "auto",
          }}
        >
          <OverviewView
            registry={STYLE_REGISTRY}
            language={resolvedLanguage}
            onSelectStyle={handleSelectStyle}
          />
        </div>

        {/* LabView: rendered only when view is "lab" */}
        {urlState.view === "lab" && (
          <div style={{ width: "100%", height: "100%" }}>
            <LabView
              registry={STYLE_REGISTRY}
              styleId={urlState.styleId}
              topicId={urlState.topicId}
              scene={urlState.scene}
              beat={urlState.beat}
              isPureMode={urlState.pureMode}
              reducedMotion={reducedMotion}
              language={resolvedLanguage}
              frozen={urlState.frozen}
              flashStyle={flashStyle}
              onNavigate={handleNavigate}
              onFlashDone={handleFlashDone}
              onExitPure={handleExitPure}
              onGoOverview={handleGoOverview}
            />
          </div>
        )}
      </main>

      {/* Portrait hint */}
      <PortraitHint language={resolvedLanguage} />
    </div>
  );
}

// ─── App Root ───────────────────────────────────────────────────────────────

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

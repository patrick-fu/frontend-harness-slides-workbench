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
  const { language, setLanguage } = useLanguage();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const { reducedMotion } = useReducedMotion();
  const [urlState, setUrlState] = useUrlState();

  // Font preloading
  useFontPreload(STYLE_REGISTRY, language);

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

  // ── Document title ───────────────────────────────────────────────────────

  useEffect(() => {
    const baseTitle =
      language === "zh" ? "FH Slides 工作台" : "FH Slides Workbench";

    if (urlState.view === "lab") {
      const entry = STYLE_REGISTRY.find((e) => e.id === urlState.styleId);
      if (entry) {
        const meta = entry.getMetadata(language);
        document.title = `${meta.name} — ${baseTitle}`;
        return;
      }
    }

    document.title = baseTitle;
  }, [urlState.view, urlState.styleId, language]);

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

  const handleToggleSidebarCollapsed = useCallback(() => {
    setSidebarCollapsed((prev) => !prev);
  }, []);

  const handleSidebarWidthChange = useCallback((w: number) => {
    setSidebarWidth(w);
  }, []);

  const handleGoOverview = useCallback(() => {
    setUrlState({ view: "overview" });
  }, [setUrlState]);

  const handleSelectStyle = useCallback(
    (styleId: string) => {
      setUrlState({ view: "lab", styleId, scene: 1, beat: 0 });
      setSidebarOpen(false);
    },
    [setUrlState],
  );

  const handleToggleLanguage = useCallback(() => {
    setLanguage(language === "en" ? "zh" : "en");
  }, [language, setLanguage]);

  const handleCycleTheme = useCallback(() => {
    const order: Array<"light" | "dark" | "auto"> = ["light", "dark", "auto"];
    const currentIndex = order.indexOf(theme);
    const next = order[(currentIndex + 1) % order.length];
    setTheme(next);
  }, [theme, setTheme]);

  const handleNavigate = useCallback(
    (target: {
      styleId: string;
      scene: number;
      beat: number;
      flashStyle?: boolean;
    }) => {
      setUrlState({
        styleId: target.styleId,
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
    const headerHeight = 56; // h-14
    const bottomBarHeight = isLab ? 56 : 0; // h-14

    return {
      paddingTop: headerHeight,
      paddingLeft: effectiveSidebarWidth,
      paddingBottom: bottomBarHeight,
    };
  }, [sidebarWidth, sidebarCollapsed, isLab]);

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
          onToggleLanguage={handleToggleLanguage}
          theme={theme}
          onCycleTheme={handleCycleTheme}
        />
      </div>

      {/* Sidebar (hidden in pure mode by CSS) */}
      <div
        style={{ display: urlState.pureMode ? "none" : undefined }}
      >
        <Sidebar
          registry={STYLE_REGISTRY}
          currentStyleId={urlState.styleId}
          onSelectStyle={handleSelectStyle}
          isOpen={sidebarOpen}
          onClose={handleCloseSidebar}
          language={language}
          width={sidebarWidth}
          onWidthChange={handleSidebarWidthChange}
          collapsed={sidebarCollapsed}
          onToggleCollapsed={handleToggleSidebarCollapsed}
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
            language={language}
            onSelectStyle={handleSelectStyle}
          />
        </div>

        {/* LabView: rendered only when view is "lab" */}
        {urlState.view === "lab" && (
          <div style={{ width: "100%", height: "100%" }}>
            <LabView
              registry={STYLE_REGISTRY}
              styleId={urlState.styleId}
              scene={urlState.scene}
              beat={urlState.beat}
              isPureMode={urlState.pureMode}
              reducedMotion={reducedMotion}
              language={language}
              frozen={urlState.frozen}
              flashStyle={flashStyle}
              onNavigate={handleNavigate}
              onFlashDone={handleFlashDone}
              onExitPure={handleExitPure}
            />
          </div>
        )}
      </main>

      {/* Portrait hint */}
      <PortraitHint language={language} />
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

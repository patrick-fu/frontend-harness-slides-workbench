export interface HeaderProps {
  onToggleSidebar: () => void;
  onGoOverview: () => void;
  language: "auto" | "en" | "zh";
  setLanguage: (lang: "auto" | "en" | "zh") => void;
  theme: "auto" | "light" | "dark";
  setTheme: (t: "auto" | "light" | "dark") => void;
}

type LanguageMode = "auto" | "en" | "zh";
type ThemeMode = "auto" | "light" | "dark";

const LANG_ORDER: LanguageMode[] = ["auto", "en", "zh"];
const THEME_ORDER: ThemeMode[] = ["auto", "light", "dark"];

function langLabel(mode: LanguageMode): string {
  switch (mode) {
    case "auto":
      return "Auto";
    case "en":
      return "EN";
    case "zh":
      return "ZH";
  }
}

function langMobileLabel(mode: LanguageMode): string {
  switch (mode) {
    case "auto":
      return "A";
    case "en":
      return "EN";
    case "zh":
      return "中";
  }
}

function themeMobileLabel(mode: ThemeMode): string {
  switch (mode) {
    case "auto":
      return "⚙";
    case "light":
      return "☀";
    case "dark":
      return "☾";
  }
}

function cycleLanguage(current: LanguageMode): LanguageMode {
  const i = LANG_ORDER.indexOf(current);
  return LANG_ORDER[(i + 1) % LANG_ORDER.length];
}

function cycleTheme(current: ThemeMode): ThemeMode {
  const i = THEME_ORDER.indexOf(current);
  return THEME_ORDER[(i + 1) % THEME_ORDER.length];
}

export default function Header({
  onToggleSidebar,
  onGoOverview,
  language,
  setLanguage,
  theme,
  setTheme,
}: HeaderProps) {
  return (
    <header
      data-testid="header"
      className="fixed top-0 left-0 right-0 w-full z-50 h-9 bg-chrome text-chrome-ink border-b border-ink/10 flex items-center px-3"
    >
      {/* Left: hamburger / sidebar toggle */}
      <button
        type="button"
        data-testid="sidebar-toggle"
        onClick={onToggleSidebar}
        className="p-1.5 rounded-md hover:bg-ink/10 transition-colors flex items-center justify-center"
        aria-label="Toggle sidebar"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        >
          <line x1="3" y1="5" x2="17" y2="5" />
          <line x1="3" y1="10" x2="17" y2="10" />
          <line x1="3" y1="15" x2="17" y2="15" />
        </svg>
      </button>

      {/* Center: app title */}
      <div className="flex-1 flex justify-center min-w-0 px-2">
        <button
          type="button"
          onClick={onGoOverview}
          className="text-sm font-semibold tracking-tight hover:opacity-70 transition-opacity cursor-pointer text-chrome-ink truncate"
        >
          Frontend Harness Slides Workbench
        </button>
      </div>

      {/* Right: language, theme, GitHub */}
      <div className="flex items-center gap-1">
        {/* ── Language: desktop segmented / mobile cycling button ── */}
        <div data-testid="lang-toggle" className="flex items-center">
          {/* Desktop segmented control */}
          <div
            className="hidden md:flex items-center rounded-md overflow-hidden border border-ink/10"
            role="group"
            aria-label="Language"
          >
            {LANG_ORDER.map((mode) => {
              const selected = language === mode;
              return (
                <button
                  key={mode}
                  type="button"
                  data-testid={`lang-segment-${mode}`}
                  onClick={() => setLanguage(mode)}
                  className={[
                    "px-2 py-0.5 text-[11px] font-medium transition-colors",
                    selected
                      ? "bg-chrome-ink text-chrome"
                      : "text-chrome-ink hover:bg-ink/10",
                  ].join(" ")}
                  aria-pressed={selected}
                >
                  {langLabel(mode)}
                </button>
              );
            })}
          </div>

          {/* Mobile cycling button */}
          <button
            type="button"
            data-testid="lang-segment-mobile"
            onClick={() => setLanguage(cycleLanguage(language))}
            className="md:hidden px-2 py-0.5 text-[11px] font-medium rounded-md hover:bg-ink/10 transition-colors text-chrome-ink"
            aria-label={`Language: ${language}. Click to cycle.`}
          >
            {langMobileLabel(language)}
          </button>
        </div>

        {/* ── Theme: desktop segmented / mobile cycling button ── */}
        <div data-testid="theme-toggle" className="flex items-center">
          {/* Desktop segmented control */}
          <div
            className="hidden md:flex items-center rounded-md overflow-hidden border border-ink/10"
            role="group"
            aria-label="Theme"
          >
            {THEME_ORDER.map((mode) => {
              const selected = theme === mode;
              return (
                <button
                  key={mode}
                  type="button"
                  data-testid={`theme-segment-${mode}`}
                  onClick={() => setTheme(mode)}
                  className={[
                    "px-2 py-0.5 text-[11px] font-medium transition-colors capitalize",
                    selected
                      ? "bg-chrome-ink text-chrome"
                      : "text-chrome-ink hover:bg-ink/10",
                  ].join(" ")}
                  aria-pressed={selected}
                >
                  {mode}
                </button>
              );
            })}
          </div>

          {/* Mobile cycling button */}
          <button
            type="button"
            data-testid="theme-segment-mobile"
            onClick={() => setTheme(cycleTheme(theme))}
            className="md:hidden p-1.5 rounded-md hover:bg-ink/10 transition-colors text-chrome-ink"
            aria-label={`Theme: ${theme}. Click to cycle.`}
          >
            {themeMobileLabel(theme)}
          </button>
        </div>

        {/* GitHub link */}
        <a
          data-testid="github-link"
          href="https://github.com/patrick-fu/frontend-harness-slides-workbench"
          target="_blank"
          rel="noopener noreferrer"
          className="p-1.5 rounded-md hover:bg-ink/10 transition-colors text-chrome-ink"
          aria-label="View source on GitHub"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
          </svg>
        </a>
      </div>
    </header>
  );
}

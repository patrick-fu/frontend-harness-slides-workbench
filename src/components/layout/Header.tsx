export interface HeaderProps {
  onToggleSidebar: () => void;
  onGoOverview: () => void;
  language: "en" | "zh";
  onToggleLanguage: () => void;
  theme: string;
  onCycleTheme: () => void;
}

export default function Header({
  onToggleSidebar,
  onGoOverview,
  language,
  onToggleLanguage,
  onCycleTheme,
}: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 w-full z-50 h-12 md:h-14 bg-paper border-b border-ink/10 flex items-center px-3 md:px-4">
      {/* Left: hamburger / sidebar toggle */}
      <button
        type="button"
        data-testid="sidebar-toggle"
        onClick={onToggleSidebar}
        className="p-2 rounded-md hover:bg-ink/10 transition-colors flex items-center justify-center"
        aria-label="Toggle sidebar"
      >
        <svg
          width="20"
          height="20"
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
      <div className="flex-1 flex justify-center">
        <button
          type="button"
          onClick={onGoOverview}
          className="text-sm md:text-base font-semibold tracking-tight hover:opacity-70 transition-opacity cursor-pointer"
        >
          Frontend Harness Slides Workbench
        </button>
      </div>

      {/* Right: language, theme, GitHub */}
      <div className="flex items-center gap-1">
        {/* Language toggle */}
        <button
          type="button"
          onClick={onToggleLanguage}
          className="px-2 py-1 text-xs font-medium rounded-md hover:bg-ink/10 transition-colors"
          aria-label={`Switch to ${language === "en" ? "Chinese" : "English"}`}
        >
          {language === "en" ? "EN" : "ZH"}
        </button>

        {/* Theme toggle */}
        <button
          type="button"
          data-testid="theme-toggle"
          onClick={onCycleTheme}
          className="p-2 rounded-md hover:bg-ink/10 transition-colors"
          aria-label="Cycle theme"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="10" cy="10" r="3.5" />
            <path d="M10 2v1.5M10 16.5V18M2 10h1.5M16.5 10H18M4.2 4.2l1 1M14.8 14.8l1 1M4.2 15.8l1-1M14.8 5.2l1-1" />
          </svg>
        </button>

        {/* GitHub link */}
        <a
          data-testid="github-link"
          href="https://github.com/patrick-fu/frontend-harness-slides-workbench"
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-md hover:bg-ink/10 transition-colors"
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

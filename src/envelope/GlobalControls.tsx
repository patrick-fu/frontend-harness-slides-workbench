import { useEffect, useRef, useState } from "react";

type LanguageMode = "auto" | "en" | "zh";
type ThemeMode = "auto" | "light" | "dark";

export interface GlobalControlsProps {
  view: "overview" | "lab";
  language: "en" | "zh";
  languageMode: LanguageMode;
  themeMode: ThemeMode;
  onLanguageChange: (mode: LanguageMode) => void;
  onThemeChange: (mode: ThemeMode) => void;
  onCopyLink: () => void;
  onShare?: () => void;
  onOpenControls: () => void;
  onToggleFullscreen: () => void;
  isFullscreen: boolean;
}

type OpenMenu = "language" | "theme" | "more" | null;

export default function GlobalControls({
  view,
  language,
  languageMode,
  themeMode,
  onLanguageChange,
  onThemeChange,
  onCopyLink,
  onShare,
  onOpenControls,
  onToggleFullscreen,
  isFullscreen,
}: GlobalControlsProps) {
  const [open, setOpen] = useState<OpenMenu>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const languageTriggerRef = useRef<HTMLButtonElement>(null);
  const themeTriggerRef = useRef<HTMLButtonElement>(null);
  const moreTriggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (event: MouseEvent | KeyboardEvent) => {
      if (event instanceof KeyboardEvent && event.key === "Escape") {
        setOpen(null);
      } else if (
        event instanceof MouseEvent &&
        !rootRef.current?.contains(event.target as Node)
      ) {
        setOpen(null);
      }
    };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", close);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", close);
    };
  }, [open]);

  const labels =
    language === "zh"
      ? {
          language: "语言",
          theme: "主题",
          more: "更多",
          copy: "复制链接",
          share: "分享…",
          controls: "操作说明",
          enterFullscreen: "进入全屏",
          exitFullscreen: "退出全屏",
          skill: "Slides skill 的 GitHub",
          workbench: "Workbench 的 GitHub",
        }
      : {
          language: "Language",
          theme: "Theme",
          more: "More",
          copy: "Copy link",
          share: "Share…",
          controls: "Controls",
          enterFullscreen: "Enter fullscreen",
          exitFullscreen: "Exit fullscreen",
          skill: "Slides skill on GitHub",
          workbench: "Workbench on GitHub",
        };
  const languageDisplay = languageMode === "zh" ? "中" : languageMode === "en" ? "EN" : "Auto";
  const themeDisplay = themeMode === "light" ? "☀" : themeMode === "dark" ? "◐" : "Auto";
  const buttonClass =
    "flex h-9 items-center justify-center gap-1.5 rounded-lg px-2.5 text-xs font-medium text-ink/60 hover:bg-ink/[0.06] hover:text-ink";
  const menuClass =
    "absolute right-0 top-[calc(100%+.4rem)] z-[90] min-w-44 rounded-xl border border-ink/10 bg-elevated p-1.5 text-ink shadow-xl";
  const itemClass =
    "flex min-h-9 w-full items-center gap-2 rounded-lg px-2.5 text-left text-xs text-ink/70 hover:bg-ink/[0.06] hover:text-ink";
  const focusFirstItem = () =>
    window.requestAnimationFrame(() =>
      rootRef.current?.querySelector<HTMLElement>(
        "[role='menuitem'],[role='menuitemradio']",
      )?.focus(),
    );
  const openWithKeyboard = (menu: Exclude<OpenMenu, null>) => {
    setOpen(menu);
    focusFirstItem();
  };
  const handleMenuKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const items = [
      ...event.currentTarget.querySelectorAll<HTMLElement>(
        "[role='menuitem'],[role='menuitemradio']",
      ),
    ];
    const index = items.indexOf(document.activeElement as HTMLElement);
    if (event.key === "ArrowDown") {
      event.preventDefault();
      items[(index + 1 + items.length) % items.length]?.focus();
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      items[(index - 1 + items.length) % items.length]?.focus();
    } else if (event.key === "Home") {
      event.preventDefault();
      items[0]?.focus();
    } else if (event.key === "End") {
      event.preventDefault();
      items.at(-1)?.focus();
    } else if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      const trigger = open === "language"
        ? languageTriggerRef.current
        : open === "theme"
          ? themeTriggerRef.current
          : moreTriggerRef.current;
      setOpen(null);
      trigger?.focus();
    }
  };

  return (
    <div ref={rootRef} className="flex items-center gap-0.5">
      <div className="relative">
        <button
          ref={languageTriggerRef}
          type="button"
          aria-label={`${labels.language}: ${languageDisplay}`}
          aria-haspopup="menu"
          aria-expanded={open === "language"}
          className={buttonClass}
          onClick={() => setOpen(open === "language" ? null : "language")}
          onKeyDown={(event) => {
            if (event.key === "ArrowDown") {
              event.preventDefault();
              openWithKeyboard("language");
            }
          }}
        >
          <span aria-hidden="true" className="text-[13px]">文</span>
          <span className="hidden sm:inline">{languageDisplay}</span>
        </button>
        {open === "language" && (
          <div role="menu" aria-label={labels.language} className={menuClass} onKeyDown={handleMenuKeyDown}>
            {([
              ["auto", "Auto"],
              ["en", "English"],
              ["zh", "中文"],
            ] as const).map(([mode, label]) => (
              <button
                key={mode}
                type="button"
                role="menuitemradio"
                aria-checked={languageMode === mode}
                className={itemClass}
                onClick={() => {
                  onLanguageChange(mode);
                  setOpen(null);
                }}
              >
                <span className="w-4 text-center">{languageMode === mode ? "•" : ""}</span>
                {label}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="relative">
        <button
          ref={themeTriggerRef}
          type="button"
          aria-label={`${labels.theme}: ${themeMode}`}
          aria-haspopup="menu"
          aria-expanded={open === "theme"}
          className={buttonClass}
          onClick={() => setOpen(open === "theme" ? null : "theme")}
          onKeyDown={(event) => {
            if (event.key === "ArrowDown") {
              event.preventDefault();
              openWithKeyboard("theme");
            }
          }}
        >
          <span aria-hidden="true">{themeDisplay}</span>
          <span className="sr-only">{themeMode}</span>
        </button>
        {open === "theme" && (
          <div role="menu" aria-label={labels.theme} className={menuClass} onKeyDown={handleMenuKeyDown}>
            {(["auto", "light", "dark"] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                role="menuitemradio"
                aria-checked={themeMode === mode}
                className={itemClass}
                onClick={() => {
                  onThemeChange(mode);
                  setOpen(null);
                }}
              >
                <span className="w-4 text-center">{themeMode === mode ? "•" : ""}</span>
                {mode === "auto" ? "Auto" : mode === "light" ? "Light" : "Dark"}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="relative">
        <button
          ref={moreTriggerRef}
          type="button"
          aria-label={labels.more}
          aria-haspopup="menu"
          aria-expanded={open === "more"}
          className={`${buttonClass} w-9 px-0 text-base`}
          onClick={() => setOpen(open === "more" ? null : "more")}
          onKeyDown={(event) => {
            if (event.key === "ArrowDown") {
              event.preventDefault();
              openWithKeyboard("more");
            }
          }}
        >
          <span aria-hidden="true">•••</span>
        </button>
        {open === "more" && (
          <div role="menu" aria-label={labels.more} className={`${menuClass} min-w-56`} onKeyDown={handleMenuKeyDown}>
            <button
              type="button"
              role="menuitem"
              className={itemClass}
              onClick={() => {
                onCopyLink();
                setOpen(null);
              }}
            >
              <span aria-hidden="true" className="w-4">↗</span>{labels.copy}
            </button>
            {onShare && typeof navigator.share === "function" && (
              <button
                type="button"
                role="menuitem"
                className={itemClass}
                onClick={() => {
                  onShare();
                  setOpen(null);
                }}
              >
                <span aria-hidden="true" className="w-4">⌁</span>{labels.share}
              </button>
            )}
            {view === "lab" && (
              <button
                type="button"
                role="menuitem"
                className={itemClass}
                onClick={() => {
                  onToggleFullscreen();
                  setOpen(null);
                }}
              >
                <span aria-hidden="true" className="w-4">□</span>
                {isFullscreen ? labels.exitFullscreen : labels.enterFullscreen}
              </button>
            )}
            <button
              type="button"
              role="menuitem"
              className={itemClass}
              onClick={() => {
                onOpenControls();
                setOpen(null);
              }}
            >
              <span aria-hidden="true" className="w-4">?</span>{labels.controls}
            </button>
            <div role="separator" className="my-1 border-t border-ink/10" />
            <a
              role="menuitem"
              className={itemClass}
              href="https://github.com/patrick-fu/frontend-harness-slides"
              target="_blank"
              rel="noreferrer"
            >
              <span aria-hidden="true" className="w-4">↗</span>{labels.skill}
            </a>
            <a
              role="menuitem"
              className={itemClass}
              href="https://github.com/patrick-fu/frontend-harness-slides-workbench"
              target="_blank"
              rel="noreferrer"
            >
              <span aria-hidden="true" className="w-4">↗</span>{labels.workbench}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

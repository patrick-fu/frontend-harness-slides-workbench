import type { ReactNode } from "react";

export interface CatalogHeaderProps {
  language: "en" | "zh";
  onHome: () => void;
  onOpenPalette: () => void;
  controls: ReactNode;
}

export default function CatalogHeader({
  language,
  onHome,
  onOpenPalette,
  controls,
}: CatalogHeaderProps) {
  return (
    <header className="sticky top-0 z-50 flex h-[52px] items-center gap-3 border-b border-ink/10 bg-paper/94 px-3 text-ink backdrop-blur-xl sm:px-5">
      <button
        type="button"
        onClick={onHome}
        className="flex min-w-0 items-center gap-2 rounded-lg pr-2 text-left hover:opacity-70"
        aria-label={language === "zh" ? "回到未筛选总览" : "Return to unfiltered Overview"}
      >
        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-ink text-[10px] font-bold tracking-tight text-paper">
          FH
        </span>
        <span className="hidden min-w-0 sm:block">
          <span className="block truncate text-xs font-semibold leading-tight">Slides Workbench</span>
          <span className="block text-[9px] uppercase tracking-[0.16em] text-ink/35">Catalog</span>
        </span>
      </button>
      <button
        type="button"
        onClick={onOpenPalette}
        className="mx-auto flex h-9 min-w-0 max-w-[520px] flex-1 items-center gap-2 rounded-xl border border-ink/10 bg-ink/[0.035] px-3 text-left text-xs text-ink/40 hover:border-ink/20 hover:bg-ink/[0.055]"
      >
        <svg aria-hidden="true" width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6">
          <circle cx="8.5" cy="8.5" r="5.5" />
          <path d="m13 13 4 4" />
        </svg>
        <span className="min-w-0 flex-1 truncate">
          {language === "zh" ? "搜索 Style、Topic 或 Model ID" : "Search styles, topics, or Model ID"}
        </span>
        <kbd className="hidden rounded border border-ink/10 bg-panel px-1.5 py-0.5 font-mono text-[9px] text-ink/35 md:inline">
          ⌘K
        </kbd>
      </button>
      <div className="shrink-0">{controls}</div>
    </header>
  );
}

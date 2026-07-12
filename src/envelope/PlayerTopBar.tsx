import type { ReactNode } from "react";

export interface PlayerTopBarProps {
  language: "en" | "zh";
  onOverview: () => void;
  onLibrary: () => void;
  onSearch: () => void;
  onPresent: () => void;
  filterControl: ReactNode;
  controls: ReactNode;
}

export default function PlayerTopBar({
  language,
  onOverview,
  onLibrary,
  onSearch,
  onPresent,
  filterControl,
  controls,
}: PlayerTopBarProps) {
  return (
    <header className="flex h-11 shrink-0 items-center gap-1 border-b border-ink/10 bg-chrome px-1.5 text-chrome-ink sm:px-2.5">
      <div className="flex items-center md:hidden">
        <button type="button" onClick={onOverview} className="grid h-9 w-9 place-items-center rounded-lg hover:bg-ink/[0.07]" aria-label={language === "zh" ? "返回总览" : "Overview"}>⌂</button>
        <button type="button" onClick={onLibrary} className="grid h-9 w-9 place-items-center rounded-lg hover:bg-ink/[0.07]" aria-label={language === "zh" ? "资料库" : "Library"}>≡</button>
        <button type="button" onClick={onSearch} className="grid h-9 w-9 place-items-center rounded-lg hover:bg-ink/[0.07]" aria-label={language === "zh" ? "快速跳转" : "Search"}>⌕</button>
      </div>

      <div className="min-w-0 flex-1" />

      {filterControl}
      <button
        type="button"
        onClick={onPresent}
        className="h-8 shrink-0 rounded-lg bg-ink px-3 text-[11px] font-semibold text-paper hover:opacity-80"
      >
        {language === "zh" ? "演示" : "Present"}
      </button>
      <div className="shrink-0">{controls}</div>
    </header>
  );
}

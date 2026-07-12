export interface PlayerRailProps {
  language: "en" | "zh";
  onOverview: () => void;
  onLibrary: () => void;
  onSearch: () => void;
}

export default function PlayerRail({ language, onOverview, onLibrary, onSearch }: PlayerRailProps) {
  const items = [
    { label: language === "zh" ? "返回总览" : "Overview", glyph: "⌂", action: onOverview },
    { label: language === "zh" ? "资料库" : "Library", glyph: "≡", action: onLibrary },
    { label: language === "zh" ? "快速跳转" : "Search", glyph: "⌕", action: onSearch },
  ];
  return (
    <nav
      aria-label={language === "zh" ? "播放器导航" : "Player navigation"}
      className="hidden h-full w-12 shrink-0 flex-col items-center gap-1 border-r border-ink/10 bg-chrome px-1.5 py-2 text-chrome-ink md:flex"
    >
      <div className="mb-2 grid h-8 w-8 place-items-center rounded-lg bg-ink text-[10px] font-bold text-paper">FH</div>
      {items.map((item) => (
        <button
          key={item.label}
          type="button"
          onClick={item.action}
          className="grid h-9 w-9 place-items-center rounded-lg text-base text-ink/50 hover:bg-ink/[0.07] hover:text-ink"
          aria-label={item.label}
          title={item.label}
        >
          <span aria-hidden="true">{item.glyph}</span>
        </button>
      ))}
    </nav>
  );
}

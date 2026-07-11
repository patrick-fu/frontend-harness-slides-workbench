import { useEffect, useRef, useState, type ReactNode } from "react";
import type { RuntimeStyleGroup } from "../../catalog/runtime-registry";
import { modelColor } from "../../utils/model-color";

export interface PlayerTopBarProps {
  group: RuntimeStyleGroup | null;
  topicId: string;
  language: "en" | "zh";
  onOverview: () => void;
  onLibrary: () => void;
  onSearch: () => void;
  onSelectTopic: (topicId: string) => void;
  onPresent: () => void;
  controls: ReactNode;
}

export default function PlayerTopBar({
  group,
  topicId,
  language,
  onOverview,
  onLibrary,
  onSearch,
  onSelectTopic,
  onPresent,
  controls,
}: PlayerTopBarProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const topic = group?.topics.find((item) => item.id === topicId) ?? null;

  useEffect(() => {
    if (!open) return;
    const close = (event: MouseEvent | KeyboardEvent) => {
      if (event instanceof KeyboardEvent && event.key === "Escape") setOpen(false);
      if (event instanceof MouseEvent && !menuRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", close);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", close);
    };
  }, [open]);

  return (
    <header className="flex h-11 shrink-0 items-center gap-1 border-b border-ink/10 bg-chrome px-1.5 text-chrome-ink sm:px-2.5">
      <div className="flex items-center md:hidden">
        <button type="button" onClick={onOverview} className="grid h-9 w-9 place-items-center rounded-lg hover:bg-ink/[0.07]" aria-label={language === "zh" ? "返回总览" : "Overview"}>⌂</button>
        <button type="button" onClick={onLibrary} className="grid h-9 w-9 place-items-center rounded-lg hover:bg-ink/[0.07]" aria-label={language === "zh" ? "资料库" : "Library"}>≡</button>
        <button type="button" onClick={onSearch} className="grid h-9 w-9 place-items-center rounded-lg hover:bg-ink/[0.07]" aria-label={language === "zh" ? "快速跳转" : "Search"}>⌕</button>
      </div>

      <div ref={menuRef} className="relative min-w-0 flex-1 md:max-w-[720px]">
        <button
          ref={triggerRef}
          type="button"
          disabled={!group || !topic}
          aria-haspopup="menu"
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
          onKeyDown={(event) => {
            if (event.key === "ArrowDown") {
              event.preventDefault();
              setOpen(true);
              window.requestAnimationFrame(() =>
                menuRef.current?.querySelector<HTMLElement>("[role='menuitemradio']")?.focus(),
              );
            }
          }}
          className="flex h-9 max-w-full items-center gap-2 rounded-lg px-2 text-left hover:bg-ink/[0.06] disabled:opacity-50"
        >
          <span className="hidden truncate text-[11px] text-ink/45 sm:block">{group?.style.name[language]}</span>
          <span className="hidden text-ink/20 sm:block">›</span>
          <span className="min-w-0 truncate text-xs font-medium text-ink/80">{topic?.title[language] ?? topicId}</span>
          {topic && (
            <span className="hidden shrink-0 items-center gap-1.5 font-mono text-[9px] text-ink/40 lg:flex">
              <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: modelColor(topic.modelId) }} />
              {topic.modelId}
            </span>
          )}
          <span aria-hidden="true" className="text-[10px] text-ink/35">⌄</span>
        </button>
        {open && group && (
          <div
            role="menu"
            onKeyDown={(event) => {
              const items = [...event.currentTarget.querySelectorAll<HTMLElement>("[role='menuitemradio']")];
              const index = items.indexOf(document.activeElement as HTMLElement);
              if (event.key === "ArrowDown" || event.key === "ArrowUp") {
                event.preventDefault();
                const delta = event.key === "ArrowDown" ? 1 : -1;
                items[(index + delta + items.length) % items.length]?.focus();
              } else if (event.key === "Escape") {
                event.preventDefault();
                event.stopPropagation();
                setOpen(false);
                triggerRef.current?.focus();
              }
            }}
            className="absolute left-0 top-[calc(100%+.35rem)] z-[90] w-[min(420px,calc(100vw-1rem))] rounded-xl border border-ink/10 bg-elevated p-1.5 text-ink shadow-xl"
          >
            <div className="px-2.5 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-ink/35">{group.style.name[language]}</div>
            {group.topics.map((item) => {
              const active = item.id === topicId;
              return (
                <button
                  key={item.id}
                  type="button"
                  role="menuitemradio"
                  aria-checked={active}
                  onClick={() => {
                    if (!active) onSelectTopic(item.id);
                    setOpen(false);
                  }}
                  className={`flex min-h-11 w-full items-center gap-2 rounded-lg px-2.5 text-left ${active ? "bg-ink/[0.08]" : "hover:bg-ink/[0.05]"}`}
                >
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: modelColor(item.modelId) }} />
                  <span className="min-w-0 flex-1 truncate text-xs">{item.title[language]}</span>
                  <span className="max-w-[150px] truncate font-mono text-[9px] text-ink/40">{item.modelId}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

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

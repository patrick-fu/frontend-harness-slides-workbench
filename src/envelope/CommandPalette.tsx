import { useEffect, useMemo, useRef, useState } from "react";
import type {
  RuntimeStyleGroup,
  RuntimeTopic,
} from "../catalog/runtime-registry";
import { modelColor } from "../utils/model-color";
import { useModalFocus } from "./useModalFocus";

export interface CommandPaletteProps {
  open: boolean;
  registry: readonly RuntimeStyleGroup[];
  language: "en" | "zh";
  recent: string[];
  onClose: () => void;
  onSelectTopic: (styleId: string, topicId: string) => void;
}

interface TopicResult {
  key: string;
  group: RuntimeStyleGroup;
  topic: RuntimeTopic;
  registryIndex: number;
}

function rank(result: TopicResult, query: string): number | null {
  const values = [
    result.topic.title.en,
    result.topic.title.zh,
    result.topic.id,
    result.topic.modelId,
    result.group.style.name.en,
    result.group.style.name.zh,
    result.group.style.id,
  ].map((value) => value.toLocaleLowerCase());
  if (values.some((value) => value === query)) return 0;
  if (values.some((value) => value.startsWith(query))) return 1;
  if (values.some((value) => value.includes(query))) return 2;
  return null;
}

export default function CommandPalette({
  open,
  registry,
  language,
  recent,
  onClose,
  onSelectTopic,
}: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLElement>(null);
  const allTopics = useMemo<TopicResult[]>(
    () =>
      registry.flatMap((group, styleIndex) =>
        group.topics.map((topic, topicIndex) => ({
          key: `${group.style.id}/${topic.id}`,
          group,
          topic,
          registryIndex: styleIndex * 1000 + topicIndex,
        })),
      ),
    [registry],
  );
  const results = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase();
    if (!normalized) {
      const byKey = new Map(allTopics.map((item) => [item.key, item]));
      return recent
        .map((key) => byKey.get(key))
        .filter((item): item is TopicResult => Boolean(item))
        .slice(0, 8);
    }
    return allTopics
      .map((item) => ({ item, score: rank(item, normalized) }))
      .filter(
        (entry): entry is { item: TopicResult; score: number } =>
          entry.score !== null,
      )
      .sort(
        (a, b) =>
          a.score - b.score || a.item.registryIndex - b.item.registryIndex,
      )
      .map((entry) => entry.item)
      .slice(0, 80);
  }, [allTopics, query, recent]);

  useEffect(() => {
    if (!open) return;
    setQuery("");
    setActiveIndex(0);
  }, [open]);

  useModalFocus(open, dialogRef, onClose);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  if (!open) return null;

  const labels =
    language === "zh"
      ? {
          title: "快速跳转",
          search: "搜索 Style、Topic 或 Model ID",
          recent: "最近访问",
          results: "搜索结果",
          empty: "没有匹配的 Topic",
          hint: "↑↓ 选择 · Enter 打开 · Esc 关闭",
        }
      : {
          title: "Command palette",
          search: "Search Style, Topic, or Model ID",
          recent: "Recently visited",
          results: "Results",
          empty: "No matching Topics",
          hint: "↑↓ select · Enter open · Esc close",
        };

  const choose = (result: TopicResult | undefined) => {
    if (!result) return;
    onSelectTopic(result.group.style.id, result.topic.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center px-3 pt-[10vh] sm:pt-[14vh]">
      <button
        type="button"
        className="absolute inset-0 cursor-default bg-black/35 backdrop-blur-[2px]"
        aria-label={language === "zh" ? "关闭快速跳转" : "Close command palette"}
        onClick={onClose}
      />
      <section
        ref={dialogRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={labels.title}
        className="relative flex max-h-[72vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-elevated text-ink shadow-[0_28px_90px_rgba(0,0,0,.35)]"
      >
        <div className="flex h-14 shrink-0 items-center gap-3 border-b border-ink/10 px-4 focus-within:border-ink/25">
          <svg aria-hidden="true" width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6">
            <circle cx="8.5" cy="8.5" r="5.5" />
            <path d="m13 13 4 4" />
          </svg>
          <input
            ref={inputRef}
            role="combobox"
            aria-expanded="true"
            aria-controls="command-results"
            aria-activedescendant={results[activeIndex]?.key}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Escape") {
                event.preventDefault();
                onClose();
              } else if (event.key === "ArrowDown") {
                event.preventDefault();
                setActiveIndex((index) => Math.min(index + 1, results.length - 1));
              } else if (event.key === "ArrowUp") {
                event.preventDefault();
                setActiveIndex((index) => Math.max(index - 1, 0));
              } else if (event.key === "Enter") {
                event.preventDefault();
                choose(results[activeIndex]);
              }
            }}
            placeholder={labels.search}
            aria-label={labels.search}
            className="chrome-search-input min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-ink/35"
          />
          <kbd className="hidden rounded-md border border-ink/10 bg-ink/[0.04] px-2 py-1 font-mono text-[10px] text-ink/45 sm:block">
            ESC
          </kbd>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto p-2">
          <div className="px-3 pb-2 pt-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-ink/35">
            {query ? labels.results : labels.recent}
          </div>
          {!results.length && (
            <div className="px-3 py-10 text-center text-sm text-ink/45">
              {labels.empty}
            </div>
          )}
          <div id="command-results" role="listbox" className="space-y-1">
            {results.map((result, index) => {
              const active = index === activeIndex;
              return (
                <button
                  id={result.key}
                  key={result.key}
                  type="button"
                  role="option"
                  aria-selected={active}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => choose(result)}
                  className={`flex min-h-14 w-full items-center gap-3 rounded-xl px-3 text-left ${
                    active ? "bg-ink/[0.08]" : "hover:bg-ink/[0.045]"
                  }`}
                >
                  <span
                    className="h-2 w-2 shrink-0 rounded-full"
                    style={{ backgroundColor: modelColor(result.topic.modelId) }}
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[11px] text-ink/45">
                      {result.group.style.name[language]}
                    </span>
                    <span className="block truncate text-sm font-medium">
                      {result.topic.title[language]}
                    </span>
                  </span>
                  <span className="max-w-[170px] truncate font-mono text-[10px] text-ink/40">
                    {result.topic.modelId}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
        <div className="hidden h-9 shrink-0 items-center border-t border-ink/10 px-4 text-[10px] text-ink/35 sm:flex">
          {labels.hint}
        </div>
      </section>
    </div>
  );
}

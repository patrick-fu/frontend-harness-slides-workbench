import { useEffect, useMemo, useRef, useState } from "react";
import type { RuntimeStyleGroup } from "../catalog/runtime-registry";
import { modelColor } from "../utils/model-color";
import { useModalFocus } from "./useModalFocus";
import { BAND_LABELS, groupByBand } from "../catalog/bands";

export interface LibraryDrawerProps {
  open: boolean;
  registry: readonly RuntimeStyleGroup[];
  currentStyleId: string;
  currentTopicId: string;
  language: "en" | "zh";
  isTopicInCycleScope: (topicId: string) => boolean;
  onClose: () => void;
  onSelectTopic: (styleId: string, topicId: string) => void;
}

export default function LibraryDrawer({
  open,
  registry,
  currentStyleId,
  currentTopicId,
  language,
  isTopicInCycleScope,
  onClose,
  onSelectTopic,
}: LibraryDrawerProps) {
  const [query, setQuery] = useState("");
  const [expandedStyles, setExpandedStyles] = useState<Set<string>>(
    () => new Set([currentStyleId]),
  );
  const searchRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!open) return;
    setExpandedStyles((current) => new Set(current).add(currentStyleId));
  }, [currentStyleId, open]);

  useModalFocus(open, dialogRef, onClose, searchRef);

  const grouped = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase();
    return groupByBand(registry).map(([band, groups]) => [
      band,
      groups.flatMap((group) => {
        const style = group.style;
        if (!normalized) return [{ group, topics: group.topics }];
        const styleMatches = `${style.name.en} ${style.name.zh} ${style.id}`
          .toLocaleLowerCase()
          .includes(normalized);
        const topics = group.topics.filter((topic) =>
          styleMatches
            ? true
            : `${topic.title.en} ${topic.title.zh} ${topic.id} ${topic.modelId}`
                .toLocaleLowerCase()
                .includes(normalized),
        );
        return topics.length ? [{ group, topics }] : [];
      }),
    ] as const);
  }, [query, registry]);

  if (!open) return null;

  const labels =
    language === "zh"
      ? {
          title: "资料库",
          search: "搜索风格、题材或 Model ID",
          close: "关闭资料库",
          empty: "没有匹配的题材",
          outside: "筛选范围外",
        }
      : {
          title: "Library",
          search: "Search styles, topics, or Model ID",
          close: "Close library",
          empty: "No matching topics",
          outside: "Outside filter",
        };
  const hasResults = grouped.some(([, styles]) => styles.length > 0);

  return (
    <div className="fixed inset-0 z-[80]" data-testid="library-overlay">
      <button
        type="button"
        className="absolute inset-0 cursor-default bg-black/30 backdrop-blur-[1px]"
        aria-label={labels.close}
        onClick={onClose}
      />
      <aside
        ref={dialogRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={labels.title}
        className="library-drawer absolute inset-y-0 left-0 flex w-[min(92vw,360px)] flex-col border-r border-ink/10 bg-elevated text-ink shadow-2xl"
      >
        <div className="flex h-14 shrink-0 items-center gap-3 border-b border-ink/10 px-4">
          <div className="min-w-0 flex-1">
            <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-ink/40">
              FH Slides
            </div>
            <h2 className="truncate text-sm font-semibold">{labels.title}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-lg text-ink/55 hover:bg-ink/[0.06] hover:text-ink"
            aria-label={labels.close}
          >
            <span aria-hidden="true" className="text-xl leading-none">×</span>
          </button>
        </div>

        <div className="shrink-0 p-3">
          <label className="flex h-10 items-center gap-2 rounded-xl border border-ink/10 bg-ink/[0.035] px-3 focus-within:border-ink/30">
            <svg aria-hidden="true" width="15" height="15" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6">
              <circle cx="8.5" cy="8.5" r="5.5" />
              <path d="m13 13 4 4" />
            </svg>
            <input
              ref={searchRef}
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={labels.search}
              aria-label={labels.search}
              className="chrome-search-input min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-ink/35"
            />
          </label>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-2 pb-8">
          {!hasResults && (
            <div className="px-3 py-10 text-center text-sm text-ink/45">
              {labels.empty}
            </div>
          )}
          {grouped.map(([band, groups]) => {
            if (!groups.length) return null;
            return (
              <section key={band} className="mb-5">
                <h3 className="sticky top-0 z-10 bg-elevated/95 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-ink/40 backdrop-blur">
                  {BAND_LABELS[band][language]}
                </h3>
                <div className="space-y-1">
                  {groups.map(({ group, topics }) => {
                    const style = group.style;
                    const isExpanded = Boolean(query) || expandedStyles.has(style.id);
                    const isCurrent = style.id === currentStyleId;
                    return (
                      <div key={style.id}>
                        <button
                          type="button"
                          aria-expanded={isExpanded}
                          onClick={() =>
                            setExpandedStyles((current) => {
                              const next = new Set(current);
                              if (next.has(style.id)) next.delete(style.id);
                              else next.add(style.id);
                              return next;
                            })
                          }
                          className={`flex min-h-10 w-full items-center gap-2 rounded-lg px-3 text-left text-sm ${
                            isCurrent ? "bg-ink/[0.07] font-medium" : "hover:bg-ink/[0.045]"
                          }`}
                        >
                          <span className="min-w-0 flex-1 truncate">{style.name[language]}</span>
                          <span className="font-mono text-[10px] text-ink/35">{topics.length}</span>
                          <span
                            aria-hidden="true"
                            className={`text-xs text-ink/35 transition-transform ${isExpanded ? "rotate-90" : ""}`}
                          >
                            ›
                          </span>
                        </button>
                        {isExpanded && (
                          <div className="ml-3 border-l border-ink/10 py-1 pl-2">
                            {topics.map((topic) => {
                              const active = isCurrent && topic.id === currentTopicId;
                              const outsideScope = !isTopicInCycleScope(topic.id);
                              return (
                                <button
                                  key={topic.id}
                                  type="button"
                                  aria-current={active ? "page" : undefined}
                                  aria-label={`${topic.title[language]} · ${topic.modelId}${outsideScope ? ` · ${labels.outside}` : ""}`}
                                  onClick={() => {
                                    onSelectTopic(style.id, topic.id);
                                    onClose();
                                  }}
                                  className={`flex min-h-10 w-full items-center gap-2 rounded-lg px-3 text-left ${
                                    active ? "bg-ink/[0.08]" : "hover:bg-ink/[0.045]"
                                  }`}
                                >
                                  <span
                                    className="h-1.5 w-1.5 shrink-0 rounded-full"
                                    style={{ backgroundColor: modelColor(topic.modelId) }}
                                  />
                                  <span className="min-w-0 flex-1">
                                    <span className="block truncate text-xs">
                                      {topic.title[language]}
                                    </span>
                                    {outsideScope && (
                                      <span className="block text-[8px] font-semibold uppercase tracking-[0.08em] text-amber-700 dark:text-amber-300">
                                        {labels.outside}
                                      </span>
                                    )}
                                  </span>
                                  <span className="max-w-[112px] truncate font-mono text-[9px] text-ink/40">
                                    {topic.modelId}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      </aside>
    </div>
  );
}

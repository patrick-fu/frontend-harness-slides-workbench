import { useRef, useState } from "react";
import { BAND_LABELS } from "../catalog/bands";
import type { RuntimeCatalogFilterResolution } from "../catalog/runtime-catalog";
import CatalogFilters from "./CatalogFilters";
import type { FilterEditor } from "./filter-editor";
import { useModalFocus } from "./useModalFocus";

export interface PlayerFilterControlProps {
  language: "en" | "zh";
  resolution: RuntimeCatalogFilterResolution;
  filterEditor: FilterEditor;
}

export default function PlayerFilterControl({
  language,
  resolution,
  filterEditor,
}: PlayerFilterControlProps) {
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const hasFilters = filterEditor.hasActiveFilters;
  const matchingCount = resolution.matchingTopics.length;
  const currentInScope = resolution.currentTopicInCycleScope;
  const copy = language === "zh"
    ? {
        filter: "筛选",
        filters: "筛选",
        close: "关闭筛选",
        clear: "清除筛选",
        filtered: (count: number) => `已筛选：${count} 个 Topic`,
        outside: (count: number) => `当前 Topic 不在筛选范围内：${count} 个 Topic`,
        empty: "当前筛选没有匹配的 Topic",
      }
    : {
        filter: "Filter",
        filters: "Filters",
        close: "Close filters",
        clear: "Clear filters",
        filtered: (count: number) => `Filtered: ${count} Topics`,
        outside: (count: number) =>
          `Current Topic outside filtered scope: ${count} Topics`,
        empty: "No Topics match current filters",
      };
  const scopeLabel = !hasFilters
    ? copy.filter
    : matchingCount === 0
      ? copy.empty
      : currentInScope
        ? copy.filtered(matchingCount)
        : copy.outside(matchingCount);
  const selectedSummary = [
    ...filterEditor.selectedBands.map(
      (band) =>
        BAND_LABELS[band as keyof typeof BAND_LABELS]?.[language] ?? band,
    ),
    ...filterEditor.selectedModels,
  ].join(" · ");

  useModalFocus(open, dialogRef, () => setOpen(false));

  return (
    <div className="relative flex shrink-0 items-center gap-1">
      <button
        type="button"
        aria-label={scopeLabel}
        aria-haspopup="dialog"
        aria-expanded={open}
        title={selectedSummary || scopeLabel}
        onClick={() => setOpen((value) => !value)}
        className={`flex h-8 max-w-[360px] items-center gap-1.5 rounded-lg border px-2 text-[11px] font-medium transition-colors ${
          hasFilters && (!currentInScope || matchingCount === 0)
            ? "border-amber-500/45 bg-amber-500/10 text-amber-800 dark:text-amber-200"
            : hasFilters
              ? "border-ink/25 bg-ink/[0.07] text-ink/75"
              : "border-ink/12 text-ink/60 hover:border-ink/25 hover:bg-ink/[0.05] hover:text-ink"
        }`}
      >
        <svg
          aria-hidden="true"
          width="14"
          height="14"
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 5h14M6 10h8M8.5 15h3" />
        </svg>
        <span className="hidden min-w-0 truncate lg:inline">{scopeLabel}</span>
        {hasFilters && selectedSummary && (
          <span className="hidden min-w-0 truncate border-l border-current/15 pl-1.5 text-[9px] font-normal opacity-65 xl:inline">
            {selectedSummary}
          </span>
        )}
        {hasFilters && (
          <span className="rounded bg-ink/10 px-1 font-mono text-[9px] tabular-nums lg:hidden">
            {matchingCount}
          </span>
        )}
        {hasFilters && (!currentInScope || matchingCount === 0) && (
          <span
            aria-hidden="true"
            className="grid h-4 w-4 shrink-0 place-items-center rounded-full bg-amber-500/20 text-[10px] font-bold lg:hidden"
          >
            !
          </span>
        )}
      </button>
      {hasFilters && (
        <button
          type="button"
          aria-label={copy.clear}
          title={copy.clear}
          onClick={filterEditor.clear}
          className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-ink/12 text-base text-ink/45 transition-colors hover:border-ink/25 hover:bg-ink/[0.05] hover:text-ink"
        >
          ×
        </button>
      )}

      {open && (
        <>
          <button
            type="button"
            aria-label={copy.close}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-[95] cursor-default bg-ink/25 md:bg-transparent"
          />
          <div
            ref={dialogRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-label={copy.filters}
            className="fixed inset-x-3 bottom-3 z-[100] max-h-[82vh] overflow-y-auto rounded-2xl border border-ink/12 bg-panel p-4 text-ink shadow-2xl md:absolute md:inset-x-auto md:bottom-auto md:right-0 md:top-[calc(100%+.5rem)] md:w-[min(720px,calc(100vw-5rem))]"
          >
            <div className="mb-4 flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h2 className="text-sm font-semibold">{copy.filters}</h2>
                {hasFilters && (
                  <p className="mt-1 truncate text-[11px] text-ink/50">
                    {scopeLabel}{selectedSummary ? ` · ${selectedSummary}` : ""}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-lg text-ink/45 hover:bg-ink/[0.06] hover:text-ink"
                aria-label={copy.close}
              >
                ×
              </button>
            </div>
            <CatalogFilters
              presentation="embedded"
              editor={filterEditor}
              language={language}
            />
          </div>
        </>
      )}
    </div>
  );
}

import { BAND_LABELS, BAND_ORDER, type BandId } from "./layout/bands";

export interface FilterPanelProps {
  allTags: Array<{ tag: string; count: number }>;
  selectedBands: string[];
  selectedTags: string[];
  onToggleBand: (band: string) => void;
  onToggleTag: (tag: string) => void;
  onClearFilters: () => void;
  language: "en" | "zh";
}

export default function FilterPanel({
  allTags,
  selectedBands,
  selectedTags,
  onToggleBand,
  onToggleTag,
  onClearFilters,
  language,
}: FilterPanelProps) {
  const hasActiveFilters =
    selectedBands.length > 0 || selectedTags.length > 0;

  const clearLabel =
    language === "zh" ? "清除全部" : "Clear All";

  return (
    <div
      data-testid="filter-panel"
      className="w-full flex flex-col gap-3 py-3"
    >
      {/* Band filter row */}
      <div className="flex items-center gap-2 flex-wrap">
        {BAND_ORDER.map((band) => {
          const isSelected = selectedBands.includes(band);
          const label = BAND_LABELS[band as BandId][language];
          return (
            <button
              key={band}
              type="button"
              data-testid={`band-${band}`}
              onClick={() => onToggleBand(band)}
              aria-pressed={isSelected}
              className={[
                "px-3 py-1.5 rounded-full text-xs font-medium transition-colors",
                "border",
                isSelected
                  ? "bg-ink text-paper border-ink"
                  : "bg-transparent text-ink border-ink/20 hover:border-ink/40",
              ].join(" ")}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Tag filter row */}
      <div
        data-testid="tag-row"
        className="flex items-center gap-2 overflow-x-auto pb-1"
        style={{ overflowX: "auto" }}
      >
        {allTags.map(({ tag, count }) => {
          const isSelected = selectedTags.includes(tag);
          return (
            <button
              key={tag}
              type="button"
              data-testid={`tag-${tag}`}
              onClick={() => onToggleTag(tag)}
              aria-pressed={isSelected}
              className={[
                "shrink-0 px-2.5 py-1 rounded-full text-xs font-medium transition-colors",
                "border flex items-center gap-1.5",
                isSelected
                  ? "bg-accent text-white border-accent"
                  : "bg-transparent text-ink/70 border-ink/15 hover:border-ink/30",
              ].join(" ")}
            >
              <span>{tag}</span>
              <span
                className={[
                  "text-[10px] font-mono px-1 rounded",
                  isSelected ? "bg-white/20" : "bg-ink/10",
                ].join(" ")}
              >
                {count}
              </span>
              {isSelected && (
                <span
                  data-testid={`tag-remove-${tag}`}
                  role="button"
                  tabIndex={0}
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleTag(tag);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      e.stopPropagation();
                      onToggleTag(tag);
                    }
                  }}
                  className="ml-0.5 cursor-pointer hover:opacity-70"
                  aria-label={`Remove ${tag} filter`}
                >
                  ×
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Clear all button */}
      {hasActiveFilters && (
        <div className="flex justify-end">
          <button
            type="button"
            data-testid="clear-filters"
            onClick={onClearFilters}
            className="text-xs text-ink/50 hover:text-ink transition-colors underline underline-offset-2"
          >
            {clearLabel}
          </button>
        </div>
      )}
    </div>
  );
}

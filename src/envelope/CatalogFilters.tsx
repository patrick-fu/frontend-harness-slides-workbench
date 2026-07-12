import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { modelColor } from "../utils/model-color";
import { useModalFocus } from "./useModalFocus";

export interface FilterOption {
  value: string;
  label: string;
  /** Topic count after applying the opposite facet. */
  count: number;
  /** Zero-count options stay visible but cannot add a new constraint. */
  disabled?: boolean;
}

export interface CatalogFiltersProps {
  bandOptions: FilterOption[];
  modelOptions: FilterOption[];
  selectedBands: string[];
  selectedModels: string[];
  unavailableBands: string[];
  unavailableModels: string[];
  onToggleBand: (band: string) => void;
  onToggleModel: (model: string) => void;
  onClearFilters: () => void;
  language: "en" | "zh";
}

const DESKTOP_MODEL_CHIP_LIMIT = 8;

function facetCopy(language: "en" | "zh") {
  if (language === "zh") {
    return {
      category: "风格类别",
      model: "Model ID",
      filters: "筛选",
      closeFilters: "关闭筛选",
      moreModels: (count: number) => `+${count} 个 Model ID`,
      moreModelsMenu: "更多 Model ID",
      searchModels: "搜索 Model ID",
      noModels: "没有匹配的 Model ID",
      done: "完成",
      clear: "清除全部",
      unavailable: "不可用筛选",
      topics: "个主题",
    };
  }

  return {
    category: "Category",
    model: "Model ID",
    filters: "Filters",
    closeFilters: "Close filters",
    moreModels: (count: number) => `+${count} Model IDs`,
    moreModelsMenu: "More Model IDs",
    searchModels: "Search Model IDs",
    noModels: "No Model IDs found",
    done: "Done",
    clear: "Clear all",
    unavailable: "Unavailable filters",
    topics: "Topics",
  };
}

interface FacetOptionButtonProps {
  option: FilterOption;
  selected: boolean;
  onToggle: (value: string) => void;
  topicsLabel: string;
  showModelMarker?: boolean;
  role?: "button" | "menuitemcheckbox";
}

function FacetOptionButton({
  option,
  selected,
  onToggle,
  topicsLabel,
  showModelMarker = false,
  role = "button",
}: FacetOptionButtonProps) {
  const isDisabled = Boolean(option.disabled) && !selected;

  return (
    <button
      type="button"
      role={role === "button" ? undefined : role}
      aria-pressed={role === "button" ? selected : undefined}
      aria-checked={role === "menuitemcheckbox" ? selected : undefined}
      aria-label={`${option.label}, ${option.count} ${topicsLabel}`}
      disabled={isDisabled}
      onClick={() => onToggle(option.value)}
      className={[
        "inline-flex min-h-7 shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium leading-none transition-colors",
        selected
          ? "border-ink bg-ink text-paper"
          : "border-ink/15 bg-panel/70 text-ink/75 hover:border-ink/35 hover:text-ink",
        isDisabled
          ? "cursor-not-allowed opacity-35 hover:border-ink/15 hover:text-ink/75"
          : "",
      ].join(" ")}
    >
      {showModelMarker && (
        <span
          aria-hidden="true"
          className="h-1.5 w-1.5 shrink-0 rounded-full"
          style={{ backgroundColor: modelColor(option.value) }}
        />
      )}
      <span className="truncate">{option.label}</span>
      <span
        aria-hidden="true"
        className={[
          "rounded px-1 font-mono text-[9px] tabular-nums",
          selected ? "bg-paper/15" : "bg-ink/7",
        ].join(" ")}
      >
        {option.count}
      </span>
    </button>
  );
}

interface FacetRowProps {
  label: string;
  options: FilterOption[];
  selectedValues: string[];
  onToggle: (value: string) => void;
  topicsLabel: string;
  overflow?: boolean;
  showModelMarkers?: boolean;
  overflowButtonLabel?: (count: number) => string;
  overflowMenuLabel?: string;
  searchLabel?: string;
  noResultsLabel?: string;
}

function FacetRow({
  label,
  options,
  selectedValues,
  onToggle,
  topicsLabel,
  overflow = false,
  showModelMarkers = false,
  overflowButtonLabel,
  overflowMenuLabel,
  searchLabel,
  noResultsLabel,
}: FacetRowProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const overflowTriggerRef = useRef<HTMLButtonElement>(null);
  const overflowSearchRef = useRef<HTMLInputElement>(null);
  const visibleOptions = overflow
    ? options.slice(0, DESKTOP_MODEL_CHIP_LIMIT)
    : options;
  const overflowingOptions = overflow
    ? options.slice(DESKTOP_MODEL_CHIP_LIMIT)
    : [];
  const searchedOptions = overflowingOptions.filter((option) =>
    option.label.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()),
  );

  useEffect(() => {
    if (isMenuOpen) overflowSearchRef.current?.focus();
  }, [isMenuOpen]);

  return (
    <div
      role="group"
      aria-label={label}
      className="flex min-w-0 items-center gap-2"
    >
      <span className="w-16 shrink-0 text-[10px] font-semibold uppercase tracking-[0.12em] text-ink/45">
        {label}
      </span>
      <div className="flex min-w-0 flex-wrap items-center gap-1.5">
        {visibleOptions.map((option) => (
          <FacetOptionButton
            key={option.value}
            option={option}
            selected={selectedValues.includes(option.value)}
            onToggle={onToggle}
            topicsLabel={topicsLabel}
            showModelMarker={showModelMarkers}
          />
        ))}
        {overflowingOptions.length > 0 && (
          <div className="relative">
            <button
              ref={overflowTriggerRef}
              type="button"
              aria-expanded={isMenuOpen}
              aria-haspopup="dialog"
              onClick={() => {
                setIsMenuOpen((open) => !open);
                setQuery("");
              }}
              className="inline-flex min-h-7 items-center rounded-full border border-ink/15 bg-panel/70 px-2.5 py-1 text-[11px] font-medium text-ink/75 transition-colors hover:border-ink/35 hover:text-ink"
            >
              {overflowButtonLabel?.(overflowingOptions.length) ??
                `+${overflowingOptions.length}`}
            </button>
            {isMenuOpen && (
              <div
                role="dialog"
                aria-label={overflowMenuLabel ?? `More ${label}`}
                onKeyDown={(event) => {
                  if (event.key !== "Escape") return;
                  event.stopPropagation();
                  setIsMenuOpen(false);
                  overflowTriggerRef.current?.focus();
                }}
                className="absolute left-0 z-20 mt-1.5 flex w-64 flex-col gap-1 rounded-xl border border-ink/12 bg-panel p-2 shadow-lg"
              >
                <input
                  ref={overflowSearchRef}
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  aria-label={searchLabel ?? "Search"}
                  placeholder={searchLabel ?? "Search"}
                  className="mb-1 h-8 w-full rounded-lg border border-ink/12 bg-paper px-2 text-xs text-ink outline-none placeholder:text-ink/35 focus:border-ink/35"
                />
                {searchedOptions.length > 0 ? (
                  searchedOptions.map((option) => (
                    <FacetOptionButton
                      key={option.value}
                      option={option}
                      selected={selectedValues.includes(option.value)}
                      onToggle={onToggle}
                      topicsLabel={topicsLabel}
                      showModelMarker={showModelMarkers}
                    />
                  ))
                ) : (
                  <p className="px-2 py-3 text-xs text-ink/45">
                    {noResultsLabel ?? "No results"}
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function MobileFacetList({
  label,
  options,
  selectedValues,
  onToggle,
  topicsLabel,
  showModelMarkers = false,
}: FacetRowProps) {
  return (
    <section aria-label={label} className="space-y-2">
      <h3 className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ink/45">
        {label}
      </h3>
      <div className="flex flex-wrap gap-1.5">
        {options.map((option) => (
          <FacetOptionButton
            key={option.value}
            option={option}
            selected={selectedValues.includes(option.value)}
            onToggle={onToggle}
            topicsLabel={topicsLabel}
            showModelMarker={showModelMarkers}
          />
        ))}
      </div>
    </section>
  );
}

export default function CatalogFilters({
  bandOptions,
  modelOptions,
  selectedBands,
  selectedModels,
  unavailableBands,
  unavailableModels,
  onToggleBand,
  onToggleModel,
  onClearFilters,
  language,
}: CatalogFiltersProps) {
  const [isMobileSheetOpen, setIsMobileSheetOpen] = useState(false);
  const [mobileModelQuery, setMobileModelQuery] = useState("");
  const mobileDialogRef = useRef<HTMLDivElement>(null);
  const copy = facetCopy(language);
  const activeCount = selectedBands.length + selectedModels.length;
  const hasActiveFilters = activeCount > 0;
  const unavailable = [...unavailableBands, ...unavailableModels];
  const mobileModelOptions = useMemo(
    () =>
      modelOptions.filter((option) =>
        option.label
          .toLocaleLowerCase()
          .includes(mobileModelQuery.trim().toLocaleLowerCase()),
      ),
    [mobileModelQuery, modelOptions],
  );

  useModalFocus(
    isMobileSheetOpen,
    mobileDialogRef,
    () => setIsMobileSheetOpen(false),
  );

  return (
    <div data-testid="filter-panel" className="w-full">
      <div className="hidden space-y-2 md:block">
        <FacetRow
          label={copy.category}
          options={bandOptions}
          selectedValues={selectedBands}
          onToggle={onToggleBand}
          topicsLabel={copy.topics}
        />
        <FacetRow
          label={copy.model}
          options={modelOptions}
          selectedValues={selectedModels}
          onToggle={onToggleModel}
          topicsLabel={copy.topics}
          overflow
          showModelMarkers
          overflowButtonLabel={copy.moreModels}
          overflowMenuLabel={copy.moreModelsMenu}
          searchLabel={copy.searchModels}
          noResultsLabel={copy.noModels}
        />
        {unavailable.length > 0 && (
          <p className="text-xs text-red-700 dark:text-red-300" role="status">
            {copy.unavailable}: {unavailable.join(", ")}
          </p>
        )}
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onClearFilters}
            className="text-[11px] text-ink/50 underline underline-offset-2 transition-colors hover:text-ink"
          >
            {copy.clear}
          </button>
        )}
      </div>

      <div className="md:hidden">
        <button
          type="button"
          aria-label={copy.filters}
          aria-expanded={isMobileSheetOpen}
          onClick={() => setIsMobileSheetOpen(true)}
          className="inline-flex min-h-9 items-center gap-2 rounded-full border border-ink/15 bg-panel px-3 text-xs font-medium text-ink shadow-sm"
        >
          <span>{copy.filters}</span>
          {activeCount > 0 && (
            <span className="rounded-full bg-ink px-1.5 py-0.5 text-[10px] leading-none text-paper">
              {activeCount}
            </span>
          )}
        </button>

        {isMobileSheetOpen && createPortal(
          <div className="fixed inset-0 z-[100] md:hidden">
            <button
              type="button"
              aria-label={copy.closeFilters}
              onClick={() => setIsMobileSheetOpen(false)}
              className="absolute inset-0 cursor-default bg-ink/35"
            />
            <div
              ref={mobileDialogRef}
              tabIndex={-1}
              role="dialog"
              aria-modal="true"
              aria-label={copy.filters}
              className="absolute inset-x-0 bottom-0 max-h-[82vh] overflow-y-auto rounded-t-2xl border border-ink/12 bg-panel px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4 shadow-2xl"
            >
              <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-ink/15" />
              <div className="mb-5 flex items-center justify-between gap-4">
                <h2 className="text-sm font-semibold">{copy.filters}</h2>
                <button
                  type="button"
                  onClick={() => setIsMobileSheetOpen(false)}
                  className="min-h-9 rounded-full px-3 text-xs font-medium text-ink/70 hover:bg-ink/5"
                >
                  {copy.done}
                </button>
              </div>
              <div className="space-y-5">
                <MobileFacetList
                  label={copy.category}
                  options={bandOptions}
                  selectedValues={selectedBands}
                  onToggle={onToggleBand}
                  topicsLabel={copy.topics}
                />
                <section aria-label={copy.model} className="space-y-2">
                  <h3 className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ink/45">
                    {copy.model}
                  </h3>
                  {modelOptions.length > DESKTOP_MODEL_CHIP_LIMIT && (
                    <input
                      type="search"
                      value={mobileModelQuery}
                      onChange={(event) => setMobileModelQuery(event.target.value)}
                      aria-label={copy.searchModels}
                      placeholder={copy.searchModels}
                      className="h-9 w-full rounded-lg border border-ink/12 bg-paper px-2.5 text-xs text-ink outline-none placeholder:text-ink/35 focus:border-ink/35"
                    />
                  )}
                  <MobileFacetList
                    label={copy.model}
                    options={mobileModelOptions}
                    selectedValues={selectedModels}
                    onToggle={onToggleModel}
                    topicsLabel={copy.topics}
                    showModelMarkers
                  />
                </section>
                {unavailable.length > 0 && (
                  <p className="text-xs text-red-700 dark:text-red-300" role="status">
                    {copy.unavailable}: {unavailable.join(", ")}
                  </p>
                )}
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={onClearFilters}
                    className="min-h-9 text-xs text-ink/60 underline underline-offset-2"
                  >
                    {copy.clear}
                  </button>
                )}
              </div>
            </div>
          </div>,
          document.body,
        )}
      </div>
    </div>
  );
}

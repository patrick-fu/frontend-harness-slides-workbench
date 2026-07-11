import { useCallback, useMemo, useState, type MouseEvent } from "react";
import type { StyleRegistryEntry } from "../types";
import {
  buildCatalogTopics,
  filterCatalogTopics,
  getCatalogFacetCounts,
  type CatalogFilters,
  type CatalogTopic,
} from "../utils/catalog-filter";
import { modelColor } from "../utils/model-color";
import { getShowcaseThumbnail } from "../data/showcase-thumbnails";
import { BAND_LABELS, BAND_ORDER } from "./layout/bands";
import FilterPanel, { type FilterOption } from "./FilterPanel";

export type { CatalogFilters as OverviewFilters } from "../utils/catalog-filter";

export interface OverviewViewProps {
  registry: StyleRegistryEntry[];
  language: "en" | "zh";
  /** URL-owned Catalog facets. Overview never serializes them itself. */
  filters: CatalogFilters;
  /** Replaces the URL-owned filters after a user interaction. */
  onFiltersChange: (filters: CatalogFilters) => void;
  /** Supplies the exact route for an independently openable Topic Card. */
  getTopicHref: (styleId: string, topicId: string) => string;
  /** Handles an ordinary left-click so the shell can retain Catalog scroll state. */
  onOpenTopic: (styleId: string, topicId: string) => void;
  /** Warms the exact Stage chunk when intent is visible, without navigating. */
  onPrefetchTopic?: (styleId: string, topicId: string) => void;
}

function toggleValue(values: string[], value: string): string[] {
  return values.includes(value)
    ? values.filter((current) => current !== value)
    : [...values, value];
}

function summaryLabel(
  language: "en" | "zh",
  visibleTopics: number,
  totalTopics: number,
  visibleStyles: number,
  totalStyles: number,
  hasFilters: boolean,
) {
  if (language === "zh") {
    return hasFilters
      ? `${visibleTopics} / ${totalTopics} 个主题 · ${visibleStyles} / ${totalStyles} 种风格`
      : `全部 ${totalTopics} 个主题 · ${totalStyles} 种风格`;
  }

  return hasFilters
    ? `${visibleTopics} of ${totalTopics} Topics · ${visibleStyles} of ${totalStyles} Styles`
    : `All ${totalTopics} Topics · ${totalStyles} Styles`;
}

function isPlainPrimaryClick(event: MouseEvent<HTMLAnchorElement>) {
  return (
    !event.defaultPrevented &&
    event.button === 0 &&
    !event.metaKey &&
    !event.ctrlKey &&
    !event.shiftKey &&
    !event.altKey
  );
}

interface TopicCardProps {
  topic: CatalogTopic;
  href: string;
  isStyleGroupStart: boolean;
  styleNumber: string;
  onOpenTopic: (styleId: string, topicId: string) => void;
  onPrefetchTopic?: (styleId: string, topicId: string) => void;
}

function TopicCard({
  topic,
  href,
  isStyleGroupStart,
  styleNumber,
  onOpenTopic,
  onPrefetchTopic,
}: TopicCardProps) {
  const [isThumbnailLoaded, setIsThumbnailLoaded] = useState(false);
  const thumbnailSrc = getShowcaseThumbnail(topic.styleId, topic.topicId);
  const cardLabel = `${topic.styleName}: ${topic.topicName}, ${topic.model}`;

  const handleOpen = useCallback(
    (event: MouseEvent<HTMLAnchorElement>) => {
      if (!isPlainPrimaryClick(event)) return;
      event.preventDefault();
      onOpenTopic(topic.styleId, topic.topicId);
    },
    [onOpenTopic, topic.styleId, topic.topicId],
  );

  return (
    <article
      data-testid="topic-card"
      data-topic-key={`${topic.styleId}/${topic.topicId}`}
      className="min-w-0"
    >
      <a
        href={href}
        aria-label={cardLabel}
        onClick={handleOpen}
        onMouseEnter={() => onPrefetchTopic?.(topic.styleId, topic.topicId)}
        onFocus={() => onPrefetchTopic?.(topic.styleId, topic.topicId)}
        onTouchStart={() => onPrefetchTopic?.(topic.styleId, topic.topicId)}
        className={[
          "group block overflow-hidden rounded-2xl border border-ink/12 bg-panel shadow-sm transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-ink/28 hover:shadow-md focus-visible:outline-offset-4",
          isStyleGroupStart ? "border-l-2" : "",
        ].join(" ")}
        style={
          isStyleGroupStart
            ? { borderLeftColor: topic.metadata.colors.ink }
            : undefined
        }
      >
        <div
          className="relative aspect-video overflow-hidden"
          style={{ backgroundColor: topic.metadata.colors.bg }}
        >
          <div
            data-testid="thumbnail-placeholder"
            aria-hidden="true"
            className="absolute inset-0 flex items-end bg-[radial-gradient(circle_at_82%_14%,rgba(255,255,255,0.25),transparent_36%)] p-4"
          >
            <span className="min-w-0 max-w-[78%]" style={{ color: topic.metadata.colors.ink }}>
              <span className="block truncate text-sm font-semibold">{topic.topicName}</span>
              <span className="mt-1 flex items-center gap-1.5 font-mono text-[9px] opacity-65">
                <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: modelColor(topic.model) }} />
                <span className="truncate">{topic.model}</span>
              </span>
            </span>
          </div>
          {thumbnailSrc && (
            <img
              src={thumbnailSrc}
              alt={`${topic.topicName} thumbnail`}
              loading="lazy"
              decoding="async"
              onLoad={() => setIsThumbnailLoaded(true)}
              onError={() => setIsThumbnailLoaded(false)}
              className={[
                "absolute inset-0 h-full w-full object-cover transition-opacity duration-300",
                isThumbnailLoaded ? "opacity-100" : "opacity-0",
              ].join(" ")}
            />
          )}
          {isStyleGroupStart && (
            <div
              data-testid={`style-group-marker-${topic.styleId}`}
              className="absolute left-3 top-3 max-w-[calc(100%-1.5rem)] truncate rounded-full border border-white/25 bg-black/55 px-2.5 py-1 text-[10px] font-semibold tracking-[0.08em] text-white shadow-sm backdrop-blur-sm"
            >
              {styleNumber} · {topic.styleName}
            </div>
          )}
        </div>

        <div className="flex h-11 min-w-0 items-center gap-2 px-3">
          <span className="min-w-0 flex-1 truncate text-xs font-semibold text-ink">
            {topic.topicName}
          </span>
          <span
            aria-hidden="true"
            className="h-1.5 w-1.5 shrink-0 rounded-full"
            style={{ backgroundColor: modelColor(topic.model) }}
          />
          <span
            title={topic.model}
            className="max-w-[40%] shrink truncate font-mono text-[10px] text-ink/55"
          >
            {topic.model}
          </span>
        </div>
      </a>
    </article>
  );
}

export default function OverviewView({
  registry,
  language,
  filters,
  onFiltersChange,
  getTopicHref,
  onOpenTopic,
  onPrefetchTopic,
}: OverviewViewProps) {
  const allTopics = useMemo(
    () => buildCatalogTopics(registry, language),
    [language, registry],
  );
  const knownBands = useMemo(
    () => new Set<string>(allTopics.map((topic) => topic.band)),
    [allTopics],
  );
  const knownModels = useMemo(
    () => new Set(allTopics.map((topic) => topic.model)),
    [allTopics],
  );
  const unavailableBands = filters.bands.filter((band) => !knownBands.has(band));
  const unavailableModels = filters.models.filter(
    (model) => !knownModels.has(model),
  );
  const hasUnavailableFilters =
    unavailableBands.length > 0 || unavailableModels.length > 0;
  const visibleTopics = useMemo(
    () =>
      hasUnavailableFilters
        ? []
        : filterCatalogTopics(allTopics, filters),
    [allTopics, filters, hasUnavailableFilters],
  );
  const facetCounts = useMemo(
    () => getCatalogFacetCounts(allTopics, filters),
    [allTopics, filters],
  );
  const totalStyles = useMemo(
    () => new Set(allTopics.map((topic) => topic.styleId)).size,
    [allTopics],
  );
  const styleNumbers = useMemo(
    () =>
      new Map(
        registry.map((style, index) => [
          style.id,
          String(index + 1).padStart(2, "0"),
        ]),
      ),
    [registry],
  );
  const visibleStyles = useMemo(
    () => new Set(visibleTopics.map((topic) => topic.styleId)).size,
    [visibleTopics],
  );
  const bandOptions = useMemo<FilterOption[]>(() => {
    const counts = new Map(
      facetCounts.bands.map(({ band, count }) => [band, count]),
    );
    return BAND_ORDER.map((band) => {
      const count = counts.get(band) ?? 0;
      return {
        value: band,
        label: BAND_LABELS[band][language],
        count,
        disabled: count === 0,
      };
    });
  }, [facetCounts.bands, language]);
  const modelOptions = useMemo<FilterOption[]>(
    () =>
      facetCounts.models.map(({ model, count }) => ({
        value: model,
        label: model,
        count,
        disabled: count === 0,
      })),
    [facetCounts.models],
  );
  const hasFilters = filters.bands.length > 0 || filters.models.length > 0;

  const updateBands = useCallback(
    (band: string) => {
      onFiltersChange({
        bands: toggleValue(filters.bands, band),
        models: [...filters.models],
      });
    },
    [filters.bands, filters.models, onFiltersChange],
  );
  const updateModels = useCallback(
    (model: string) => {
      onFiltersChange({
        bands: [...filters.bands],
        models: toggleValue(filters.models, model),
      });
    },
    [filters.bands, filters.models, onFiltersChange],
  );
  const clearFilters = useCallback(() => {
    onFiltersChange({ bands: [], models: [] });
  }, [onFiltersChange]);

  let lastStyleId: string | null = null;

  return (
    <div
      data-testid="overview-view"
      className="w-full bg-paper text-ink"
    >
      <div className="px-3 pb-8 sm:px-5 lg:px-7">
        <div
          data-testid="catalog-filter-bar"
          className="sticky top-[52px] z-10 -mx-3 border-b border-ink/10 bg-paper/95 px-3 py-3 backdrop-blur sm:-mx-5 sm:px-5 lg:-mx-7 lg:px-7"
        >
          <div className="flex items-center justify-between gap-3">
            <p
              data-testid="catalog-summary"
              className="text-xs font-medium tabular-nums text-ink/62"
              role="status"
            >
              {summaryLabel(
                language,
                visibleTopics.length,
                allTopics.length,
                visibleStyles,
                totalStyles,
                hasFilters,
              )}
            </p>
          </div>
          <div className="mt-2">
            <FilterPanel
              bandOptions={bandOptions}
              modelOptions={modelOptions}
              selectedBands={filters.bands}
              selectedModels={filters.models}
              unavailableBands={unavailableBands}
              unavailableModels={unavailableModels}
              onToggleBand={updateBands}
              onToggleModel={updateModels}
              onClearFilters={clearFilters}
              language={language}
            />
          </div>
        </div>

        <div className="pt-5">
          {allTopics.length === 0 ? (
            <div
              data-testid="catalog-unavailable-state"
              className="rounded-2xl border border-dashed border-ink/18 px-5 py-14 text-center text-sm text-ink/55"
            >
              {language === "zh" ? "目录当前不可用。" : "The catalog is unavailable."}
            </div>
          ) : hasUnavailableFilters ? (
            <div
              data-testid="catalog-unavailable-state"
              className="rounded-2xl border border-amber-500/30 bg-amber-500/5 px-5 py-12 text-center"
            >
              <p className="text-sm font-medium text-ink">
                {language === "zh" ? "筛选条件不可用" : "A selected filter is unavailable"}
              </p>
              <p className="mt-1 text-xs text-ink/58">
                {[...unavailableBands, ...unavailableModels].join(", ")}
              </p>
              <button
                type="button"
                onClick={clearFilters}
                className="mt-4 text-xs font-medium text-ink/70 underline underline-offset-4 hover:text-ink"
              >
                {language === "zh" ? "清除全部筛选" : "Clear all filters"}
              </button>
            </div>
          ) : visibleTopics.length === 0 ? (
            <div
              data-testid="catalog-empty-state"
              className="rounded-2xl border border-dashed border-ink/18 px-5 py-14 text-center text-sm text-ink/55"
            >
              {language === "zh"
                ? "没有符合筛选条件的主题。"
                : "No Topics match your filters."}
            </div>
          ) : (
            <div
              data-testid="catalog-grid"
              className="grid gap-3 sm:gap-4"
              style={{
                gridTemplateColumns:
                  "repeat(auto-fill, minmax(min(100%, 400px), 1fr))",
              }}
            >
              {visibleTopics.map((topic) => {
                const isStyleGroupStart = lastStyleId !== topic.styleId;
                lastStyleId = topic.styleId;
                return (
                  <TopicCard
                    key={`${topic.styleId}/${topic.topicId}`}
                    topic={topic}
                    href={getTopicHref(topic.styleId, topic.topicId)}
                    isStyleGroupStart={isStyleGroupStart}
                    styleNumber={styleNumbers.get(topic.styleId) ?? ""}
                    onOpenTopic={onOpenTopic}
                    onPrefetchTopic={onPrefetchTopic}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

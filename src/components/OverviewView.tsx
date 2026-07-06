import { useMemo, useState, useCallback } from "react";
import type { StyleRegistryEntry, StyleMetadata } from "../types";
import { applyFilters, aggregateTags } from "../utils/filter";
import FilterPanel from "./FilterPanel";
import { translateBand, type BandId } from "../i18n/translations";
import { scene3Thumbnails } from "../data/showcase-thumbnails";

export interface OverviewViewProps {
  registry: StyleRegistryEntry[];
  language: "en" | "zh";
  onSelectStyle: (styleId: string) => void;
}

export default function OverviewView({
  registry,
  language,
  onSelectStyle,
}: OverviewViewProps) {
  const [selectedBands, setSelectedBands] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Build metadata list for all registered styles (using first version)
  const allMetadata = useMemo(
    () =>
      registry
        .filter((entry) => entry.versions.length > 0)
        .map((entry) => entry.versions[0].getMetadata(language)),
    [registry, language],
  );

  // Aggregate tags across all styles
  const allTags = useMemo(
    () => aggregateTags(allMetadata),
    [allMetadata],
  );

  // Apply filters
  const filteredMetadata = useMemo(
    () => applyFilters(allMetadata, selectedBands, selectedTags),
    [allMetadata, selectedBands, selectedTags],
  );

  const handleToggleBand = useCallback((band: string) => {
    setSelectedBands((prev) =>
      prev.includes(band) ? prev.filter((b) => b !== band) : [...prev, band],
    );
  }, []);

  const handleToggleTag = useCallback((tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  }, []);

  const handleClearFilters = useCallback(() => {
    setSelectedBands([]);
    setSelectedTags([]);
  }, []);

  // Group filtered styles by band
  const grouped = useMemo(() => {
    const map = new Map<string, StyleMetadata[]>();
    for (const meta of filteredMetadata) {
      const existing = map.get(meta.band) || [];
      existing.push(meta);
      map.set(meta.band, existing);
    }
    return map;
  }, [filteredMetadata]);

  const bandOrder = [
    "minimal-keynote",
    "balanced-hybrid",
    "editorial-print",
    "craft-cultural",
    "contemporary-digital",
    "text-report",
  ] as const;

  const noResults = filteredMetadata.length === 0 && allMetadata.length > 0;

  // Count total versions
  const totalVersions = useMemo(
    () => registry.reduce((sum, s) => sum + s.versions.length, 0),
    [registry],
  );

  return (
    <div
      data-testid="overview-view"
      className="w-full h-full overflow-y-auto"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
        {/* Page header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-1">
            {language === "zh" ? "风格总览" : "Style Overview"}
          </h1>
          <p className="text-sm opacity-50">
            {language === "zh"
              ? `${registry.length} 种风格 · ${totalVersions} 个版本`
              : `${registry.length} styles · ${totalVersions} versions`}
          </p>
        </div>

        {/* Filter panel */}
        {allMetadata.length > 0 && (
          <div className="mb-6 border-b border-ink/10 pb-4">
            <FilterPanel
              allTags={allTags}
              selectedBands={selectedBands}
              selectedTags={selectedTags}
              onToggleBand={handleToggleBand}
              onToggleTag={handleToggleTag}
              onClearFilters={handleClearFilters}
              language={language}
            />
          </div>
        )}

        {/* No results */}
        {noResults && (
          <div className="text-center py-16 opacity-50">
            <p className="text-lg">
              {language === "zh"
                ? "没有匹配的风格"
                : "No styles match your filters"}
            </p>
          </div>
        )}

        {/* Band sections with cards */}
        {bandOrder.map((band) => {
          const styles = grouped.get(band);
          if (!styles || styles.length === 0) return null;

          return (
            <section
              key={band}
              data-testid={`overview-band-${band}`}
              className="mb-8"
            >
              <h2 className="text-sm font-semibold uppercase tracking-wider opacity-50 mb-3">
                {translateBand(band as BandId, language)}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {styles.map((meta) => {
                  const versionCount =
                    registry.find((e) => e.id === meta.id)?.versions.length ??
                    0;
                  return (
                    <StyleCard
                      key={meta.id}
                      meta={meta}
                      versionCount={versionCount}
                      onSelect={onSelectStyle}
                    />
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}

// ─── Style Card ────────────────────────────────────────────────────────────

interface StyleCardProps {
  meta: StyleMetadata;
  versionCount: number;
  onSelect: (styleId: string) => void;
}

function StyleCard({ meta, versionCount, onSelect }: StyleCardProps) {
  const scene3Filename = scene3Thumbnails[meta.id];

  const handleClick = useCallback(() => {
    onSelect(meta.id);
  }, [meta.id, onSelect]);

  return (
    <button
      type="button"
      data-testid={`style-card-${meta.id}`}
      onClick={handleClick}
      className="group text-left rounded-xl overflow-hidden border border-ink/10 bg-panel transition-all duration-200 hover:border-ink/25 hover:shadow-md cursor-pointer"
      style={{ background: meta.colors.panel }}
    >
      {/* Thumbnail area */}
      <div
        className="aspect-video w-full relative overflow-hidden"
        style={{ background: meta.colors.bg }}
      >
        {scene3Filename && (
          <img
            src={`/showcase/${scene3Filename}`}
            alt={`${meta.name} thumbnail`}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        )}
        {/* Version count badge */}
        {versionCount > 1 && (
          <div
            className="absolute top-2 right-2 px-1.5 py-0.5 rounded-md text-[10px] font-medium"
            style={{
              background: "rgba(0,0,0,0.5)",
              color: "#fff",
              backdropFilter: "blur(4px)",
            }}
          >
            ×{versionCount}
          </div>
        )}
      </div>

      {/* Card info */}
      <div className="p-3">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-mono opacity-40">{meta.id}</span>
          <span className="text-xs opacity-30">·</span>
          <span className="text-xs opacity-50">{meta.densityLabel}</span>
        </div>
        <h3
          className="text-sm font-semibold truncate"
          style={{ color: meta.colors.ink }}
        >
          {meta.name}
        </h3>
        <p
          className="text-xs opacity-50 mt-0.5 line-clamp-2"
          style={{ color: meta.colors.ink }}
        >
          {meta.theme}
        </p>
      </div>
    </button>
  );
}

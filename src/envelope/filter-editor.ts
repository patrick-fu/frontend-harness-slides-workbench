import { BAND_LABELS, BAND_ORDER } from "../catalog/bands";
import type { RuntimeCatalogFilterResolution } from "../catalog/runtime-catalog";
import type { WorkbenchFilters } from "../domain/filter";

export interface FilterOption {
  value: string;
  label: string;
  count: number;
  disabled?: boolean;
}

export interface FilterEditor {
  bandOptions: FilterOption[];
  modelOptions: FilterOption[];
  selectedBands: string[];
  selectedModels: string[];
  unavailable: { bands: string[]; models: string[] };
  activeCount: number;
  hasActiveFilters: boolean;
  toggleBand: (band: string) => void;
  toggleModel: (model: string) => void;
  clear: () => void;
}

function toggled(values: string[], value: string) {
  return values.includes(value)
    ? values.filter((current) => current !== value)
    : [...values, value];
}

export function createFilterEditor({
  filters,
  resolution,
  language,
  onChange,
}: {
  filters: WorkbenchFilters;
  resolution: RuntimeCatalogFilterResolution;
  language: "en" | "zh";
  onChange: (filters: WorkbenchFilters) => void;
}): FilterEditor {
  const bandCounts = new Map(
    resolution.facetCounts.bands.map(({ band, count }) => [band, count]),
  );
  const bandOptions = BAND_ORDER.map((band) => {
    const count = bandCounts.get(band) ?? 0;
    return {
      value: band,
      label: BAND_LABELS[band][language],
      count,
      disabled: count === 0,
    };
  });
  const modelOptions = resolution.facetCounts.models.map(
    ({ modelId, count }) => ({
      value: modelId,
      label: modelId,
      count,
      disabled: count === 0,
    }),
  );
  const selectedBands = [...filters.bands];
  const selectedModels = [...filters.models];
  const activeCount = selectedBands.length + selectedModels.length;

  return {
    bandOptions,
    modelOptions,
    selectedBands,
    selectedModels,
    unavailable: {
      bands: [...resolution.unresolved.bands],
      models: [...resolution.unresolved.models],
    },
    activeCount,
    hasActiveFilters: activeCount > 0,
    toggleBand: (band) =>
      onChange({
        bands: toggled(selectedBands, band),
        models: [...selectedModels],
      }),
    toggleModel: (model) =>
      onChange({
        bands: [...selectedBands],
        models: toggled(selectedModels, model),
      }),
    clear: () => onChange({ bands: [], models: [] }),
  };
}

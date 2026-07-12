export interface WorkbenchFilters {
  bands: string[];
  models: string[];
}

/** Band and Model selections are OR within a facet and AND across facets. */
export function matchesWorkbenchFilters(
  band: string,
  modelId: string,
  filters: WorkbenchFilters,
): boolean {
  return (
    (filters.bands.length === 0 || filters.bands.includes(band)) &&
    (filters.models.length === 0 || filters.models.includes(modelId))
  );
}

/** Unknown query values remain unresolved instead of broadening results. */
export function hasUnresolvedWorkbenchFilters(
  knownBands: ReadonlySet<string>,
  knownModels: ReadonlySet<string>,
  filters: WorkbenchFilters,
): boolean {
  return (
    filters.bands.some((band) => !knownBands.has(band)) ||
    filters.models.some((model) => !knownModels.has(model))
  );
}

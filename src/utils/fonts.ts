import type { RuntimeStyleGroup } from "../catalog/runtime-registry";

const LEGACY_FONT_WEIGHTS = ["400", "700"];
const LOCAL_FONT_FAMILIES = new Set([
  "avenir next",
  "avenir next rounded",
  "aptos",
  "arial",
  "baskerville",
  "bodoni 72",
  "charter",
  "didot",
  "iowan old style",
  "kaiti sc",
  "lxgw wenkai",
  "menlo",
  "microsoft yahei",
  "monospace",
  "ms sans serif",
  "noteworthy",
  "noto serif cjk sc",
  "pingfang sc",
  "sf mono",
  "sfmono-regular",
  "songti sc",
  "system-ui",
  "ui-monospace",
]);

interface GoogleFontRequest {
  family: string;
  axes: string[];
  tuples: string[][];
}

/**
 * Returns true if the font name is prefixed with "cjk:".
 */
export function isCJKFont(fontName: string): boolean {
  return fontName.startsWith("cjk:");
}

/**
 * Collect all font families used across all Topics in the runtime registry.
 *
 * - Iterates every Style Group → every Topic → reads static metadata.
 * - Deduplicates (first occurrence wins).
 * - When lang="en": drops fonts prefixed with "cjk:".
 * - When lang="zh": keeps all fonts, stripping the "cjk:" prefix.
 */
export function collectAllFonts(
  registry: readonly RuntimeStyleGroup[],
  lang: "en" | "zh",
): string[] {
  const seen = new Set<string>();
  const result: string[] = [];

  for (const group of registry) {
    for (const topic of group.topics) {
      const meta = topic.metadata[lang];
      for (const font of meta.fonts) {
        if (lang === "en" && isCJKFont(font)) {
          continue;
        }

        const normalized =
          lang === "zh" && isCJKFont(font)
            ? font.slice("cjk:".length)
            : font;

        if (!seen.has(normalized)) {
          seen.add(normalized);
          result.push(normalized);
        }
      }
    }
  }

  return result;
}

/**
 * Build a Google Fonts CSS URL for the given families.
 *
 * A bare metadata string remains backwards compatible and requests weights
 * 400 and 700. A string may also include a Google Fonts CSS2 descriptor after
 * the family name, for example
 * `Fraunces:opsz,wght@9..144,300..500`. This lets Topic metadata preserve
 * the exact weight and axis range that a Stage uses without a local loader.
 * Returns "" when the input array is empty.
 */
export function buildGoogleFontsUrl(fontFamilies: string[]): string {
  if (fontFamilies.length === 0) {
    return "";
  }

  const requests = mergeGoogleFontRequests(fontFamilies);
  if (requests.length === 0) {
    return "";
  }

  const familyParams = requests
    .map(({ family, axes, tuples }) => {
      const encoded = family.replace(/ /g, "+");
      const selector = tuples.map((tuple) => tuple.join(",")).join(";");
      return `family=${encoded}:${axes.join(",")}@${selector}`;
    })
    .join("&");

  return `https://fonts.googleapis.com/css2?${familyParams}&display=swap`;
}

function mergeGoogleFontRequests(fontFamilies: string[]): GoogleFontRequest[] {
  const requestsByFamily = new Map<string, GoogleFontRequest[]>();

  for (const family of fontFamilies) {
    const request = parseGoogleFontRequest(family);
    const key = request.family.toLowerCase();
    if (LOCAL_FONT_FAMILIES.has(key)) {
      continue;
    }
    const requests = requestsByFamily.get(key);
    if (requests) {
      requests.push(request);
    } else {
      requestsByFamily.set(key, [request]);
    }
  }

  return Array.from(requestsByFamily.values(), (requests) =>
    mergeGoogleFontFamily(requests),
  );
}

function parseGoogleFontRequest(font: string): GoogleFontRequest {
  const separator = font.indexOf(":");
  if (separator === -1) {
    return {
      family: font,
      axes: ["wght"],
      tuples: LEGACY_FONT_WEIGHTS.map((weight) => [weight]),
    };
  }

  const family = font.slice(0, separator);
  const descriptor = font.slice(separator + 1);
  const at = descriptor.indexOf("@");
  if (at <= 0 || at === descriptor.length - 1) {
    return {
      family,
      axes: ["wght"],
      tuples: LEGACY_FONT_WEIGHTS.map((weight) => [weight]),
    };
  }

  const axisList = descriptor.slice(0, at);
  const tupleList = descriptor.slice(at + 1);
  const axes = axisList.split(",");
  const tuples = tupleList
    .split(";")
    .map((tuple) => tuple.split(","));

  if (tuples.some((tuple) => tuple.length !== axes.length)) {
    return {
      family,
      axes: ["wght"],
      tuples: LEGACY_FONT_WEIGHTS.map((weight) => [weight]),
    };
  }

  return { family, axes, tuples };
}

function mergeGoogleFontFamily(requests: GoogleFontRequest[]): GoogleFontRequest {
  const axes = Array.from(new Set(requests.flatMap((request) => request.axes))).sort();
  const fallbackValues = new Map(
    axes.map((axis) => [axis, fallbackAxisValue(axis, requests)]),
  );
  const tuples = requests.flatMap((request) =>
    request.tuples.map((tuple) => {
      const values = new Map(request.axes.map((axis, index) => [axis, tuple[index]]));
      return axes.map((axis) => values.get(axis) ?? fallbackValues.get(axis)!);
    }),
  );

  return {
    family: requests[0].family,
    axes,
    tuples: collapseWeightRanges(axes, tuples),
  };
}

function fallbackAxisValue(axis: string, requests: GoogleFontRequest[]): string {
  if (axis === "ital") {
    return "0";
  }

  for (const request of requests) {
    const index = request.axes.indexOf(axis);
    if (index !== -1 && request.tuples[0]?.[index]) {
      return request.tuples[0][index];
    }
  }

  return "0";
}

function collapseWeightRanges(axes: string[], tuples: string[][]): string[][] {
  const weightIndex = axes.indexOf("wght");
  if (weightIndex === -1) {
    return uniqueAndSortTuples(axes, tuples);
  }

  const tuplesByOtherAxes = new Map<string, string[][]>();
  for (const tuple of tuples) {
    const key = tuple.filter((_, index) => index !== weightIndex).join(",");
    const group = tuplesByOtherAxes.get(key);
    if (group) {
      group.push(tuple);
    } else {
      tuplesByOtherAxes.set(key, [tuple]);
    }
  }

  const collapsed = Array.from(tuplesByOtherAxes.values()).flatMap((group) => {
    const hasRange = group.some((tuple) => tuple[weightIndex].includes(".."));
    if (!hasRange) {
      return group;
    }

    const first = group[0].slice();
    const weights = group.map((tuple) => parseFontAxisRange(tuple[weightIndex]));
    const lower = weights.map((weight) => weight.lower).reduce((current, weight) =>
      weight.value < current.value ? weight : current,
    );
    const upper = weights.map((weight) => weight.upper).reduce((current, weight) =>
      weight.value > current.value ? weight : current,
    );
    first[weightIndex] =
      lower.raw === upper.raw ? lower.raw : `${lower.raw}..${upper.raw}`;
    return [first];
  });

  return uniqueAndSortTuples(axes, collapsed);
}

function parseFontAxisRange(value: string): {
  lower: { raw: string; value: number };
  upper: { raw: string; value: number };
} {
  const [lower, upper = lower] = value.split("..");
  return {
    lower: { raw: lower, value: Number(lower) },
    upper: { raw: upper, value: Number(upper) },
  };
}

function uniqueAndSortTuples(axes: string[], tuples: string[][]): string[][] {
  const unique = Array.from(
    new Map(tuples.map((tuple) => [tuple.join(","), tuple])).values(),
  );

  return unique.sort((left, right) => {
    for (let index = 0; index < axes.length; index += 1) {
      const difference =
        parseFontAxisRange(left[index]).lower.value -
        parseFontAxisRange(right[index]).lower.value;
      if (difference !== 0) {
        return difference;
      }
    }
    return 0;
  });
}

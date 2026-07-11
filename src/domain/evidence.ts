export interface Source {
  authority?: string;
  title?: string;
  citation?: string;
  url: string;
  supports: string;
}

export type Evidence =
  | { kind: "none" }
  | { kind: "facts"; sources: readonly Source[] }
  | {
      kind: "illustrative";
      boundary: { en: string; zh: string };
      display: "envelope" | "stage";
    }
  | {
      kind: "mixed";
      sources: readonly Source[];
      boundary: { en: string; zh: string };
      display: "envelope" | "stage";
    };

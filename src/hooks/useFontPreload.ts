import { useEffect, useRef } from "react";
import { collectAllFonts, buildGoogleFontsUrl } from "../utils/fonts";
import type { StyleRegistryEntry } from "../types";

/**
 * Hook that preloads fonts used by the registered styles.
 *
 * - Collects all font families from the registry for the current language.
 * - Builds a Google Fonts CSS URL and injects a <link> tag into <head>.
 * - Cleans up the link tag when language changes or component unmounts.
 *
 * This is a no-op if the registry is empty or no fonts are found.
 */
export function useFontPreload(
  registry: StyleRegistryEntry[],
  language: "en" | "zh",
): void {
  const linkRef = useRef<HTMLLinkElement | null>(null);

  useEffect(() => {
    // Clean up previous link tag
    if (linkRef.current) {
      linkRef.current.remove();
      linkRef.current = null;
    }

    if (registry.length === 0) return;

    const fonts = collectAllFonts(registry, language);
    if (fonts.length === 0) return;

    const url = buildGoogleFontsUrl(fonts);
    if (!url) return;

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = url;
    link.setAttribute("data-font-preload", "true");
    document.head.appendChild(link);
    linkRef.current = link;

    return () => {
      if (linkRef.current) {
        linkRef.current.remove();
        linkRef.current = null;
      }
    };
  }, [registry, language]);
}

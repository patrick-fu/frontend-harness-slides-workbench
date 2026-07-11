import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { CATALOG_MANIFEST } from "./src/styles/catalog-manifest.generated";

function catalogStatsAsset(): Plugin {
  return {
    name: "catalog-stats-asset",
    generateBundle() {
      const stats = {
        styles: CATALOG_MANIFEST.length,
        topics: CATALOG_MANIFEST.reduce(
          (total, style) => total + style.topics.length,
          0,
        ),
      };

      this.emitFile({
        type: "asset",
        fileName: "catalog-stats.json",
        source: `${JSON.stringify(stats)}\n`,
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), catalogStatsAsset()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    exclude: ["e2e/**", "worktrees/**", "node_modules/**"],
  },
});

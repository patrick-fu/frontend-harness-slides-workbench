import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { CATALOG_STATS } from "./src/catalog/manifest.generated";

function catalogStatsAsset(): Plugin {
  return {
    name: "catalog-stats-asset",
    generateBundle() {
      this.emitFile({
        type: "asset",
        fileName: "catalog-stats.json",
        source: `${JSON.stringify(CATALOG_STATS)}\n`,
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

import { readdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repositoryRoot = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "../..",
);

async function createSourceRuntime() {
  const { createServer } = await import("vite");
  const vite = await createServer({
    configFile: false,
    root: repositoryRoot,
    logLevel: "warn",
    server: { middlewareMode: true, hmr: false },
    appType: "custom",
    optimizeDeps: { noDiscovery: true },
  });
  return {
    loadModule: (modulePath) => vite.ssrLoadModule(modulePath),
    close: () => vite.close(),
  };
}

export function createInMemorySourceInventoryAdapter({ files, definitions }) {
  return async () => ({
    files: [...files],
    loadDefinition: async (target) => {
      const definition = definitions[target.topicId];
      if (definition instanceof Error) throw definition;
      return definition;
    },
    close: async () => undefined,
  });
}

export function createProductionSourceInventoryAdapter() {
  return async () => {
    const files = await readdir(resolve(repositoryRoot, "src/topics"));
    const runtime = await createSourceRuntime();
    return {
      files,
      async loadDefinition(target) {
        const modulePath = `/src/${target.modulePath.replace(/^\.\.\//, "")}`;
        const module = await runtime.loadModule(modulePath);
        return module.default;
      },
      close: () => runtime.close(),
    };
  };
}

export function createPublicationInventory({ openSource }) {
  return {
    async validateSource(targets) {
      const source = await openSource();
      try {
        const files = new Set(source.files);
        const barrelNames = ["index.js", "index.jsx", "index.ts", "index.tsx"];
        const eagerBarrels = barrelNames.filter((filename) => files.has(filename));
        const expectedModules = targets.map((target) =>
          target.modulePath.split("/").at(-1),
        );
        const expectedTests = targets.map((target) =>
          target.testPath.split("/").at(-1),
        );
        const actualModules = source.files
          .filter(
            (filename) =>
              filename.endsWith(".tsx") &&
              !filename.endsWith(".test.tsx") &&
              !eagerBarrels.includes(filename),
          )
          .sort();
        const actualTests = source.files
          .filter((filename) => filename.endsWith(".test.tsx"))
          .sort();
        const registeredTopicIds = new Set(
          targets.map((target) => target.topicId),
        );
        const orphanCss = source.files
          .filter((filename) => filename.endsWith(".module.css"))
          .filter((filename) =>
            !registeredTopicIds.has(filename.slice(0, -".module.css".length)),
          )
          .sort();
        const coverageFailures = [];
        const addCoverageFailure = (label, values) => {
          if (values.length > 0) {
            coverageFailures.push(`- ${label}: ${values.join(", ")}`);
          }
        };
        addCoverageFailure(
          "Missing Topic modules",
          expectedModules.filter((filename) => !files.has(filename)),
        );
        addCoverageFailure(
          "Extra Topic modules",
          actualModules.filter((filename) => !expectedModules.includes(filename)),
        );
        addCoverageFailure(
          "Missing focused Topic tests",
          expectedTests.filter((filename) => !files.has(filename)),
        );
        addCoverageFailure(
          "Extra focused Topic tests",
          actualTests.filter((filename) => !expectedTests.includes(filename)),
        );
        addCoverageFailure("Orphan Topic CSS", orphanCss);
        addCoverageFailure("Eager Topic barrels", eagerBarrels);

        const identityFailures = [];
        for (const [index, target] of targets.entries()) {
          const moduleFilename = expectedModules[index];
          if (moduleFilename && files.has(moduleFilename)) {
            let definition;
            try {
              definition = await source.loadDefinition(target);
            } catch {
              identityFailures.push(
                `- ${target.topicId}: failed to load the default export.`,
              );
              continue;
            }
            if (!definition) {
              identityFailures.push(
                `- ${target.topicId}: module has no default export.`,
              );
              continue;
            }
            if (definition.id !== target.topicId) {
              identityFailures.push(
                `- ${target.topicId}: default export Topic ID "${definition.id}" does not match "${target.topicId}".`,
              );
            }
            if (definition.styleId !== target.styleId) {
              identityFailures.push(
                `- ${target.topicId}: default export Style ID "${definition.styleId}" does not match "${target.styleId}".`,
              );
            }
          }
        }

        if (coverageFailures.length > 0 || identityFailures.length > 0) {
          const sections = [];
          if (coverageFailures.length > 0) {
            sections.push("Source coverage:", ...coverageFailures);
          }
          if (identityFailures.length > 0) {
            sections.push("Topic identity:", ...identityFailures);
          }
          throw new Error(
            [
              "Source Publication inventory is invalid:",
              ...sections,
            ].join("\n"),
          );
        }
      } finally {
        await source.close();
      }
    },
  };
}

export const publicationInventory = createPublicationInventory({
  openSource: createProductionSourceInventoryAdapter(),
});

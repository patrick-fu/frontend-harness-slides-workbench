import { Buffer } from "node:buffer";
import { readFile, readdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repositoryRoot = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "../..",
);
const showcaseDirectory = resolve(repositoryRoot, "public/showcase");

function inspectWebpArtifact({ filename, bytes }) {
  const fail = (reason) => {
    throw new Error(`${filename}: ${reason}`);
  };
  let buffer;
  try {
    buffer = Buffer.isBuffer(bytes) ? bytes : Buffer.from(bytes);
  } catch {
    fail("artifact bytes are unavailable");
  }
  if (
    buffer.length < 12 ||
    buffer.toString("ascii", 0, 4) !== "RIFF" ||
    buffer.toString("ascii", 8, 12) !== "WEBP"
  ) {
    fail("not a WebP RIFF file");
  }

  const riffSize = buffer.readUInt32LE(4);
  const riffEnd = riffSize + 8;
  if (riffSize < 4) fail("invalid RIFF payload size");
  if (riffEnd > buffer.length) fail("truncated RIFF payload");
  if (riffEnd < buffer.length) fail("RIFF payload size does not match artifact bytes");

  let dimensions;
  for (let offset = 12; offset < riffEnd;) {
    if (offset + 8 > riffEnd) fail("truncated WebP chunk header");
    const kind = buffer.toString("ascii", offset, offset + 4);
    const size = buffer.readUInt32LE(offset + 4);
    const payload = offset + 8;
    const nextOffset = payload + size + (size % 2);
    if (nextOffset > riffEnd) fail("truncated WebP chunk");

    if (kind === "VP8 ") {
      if (size < 10) fail("undersized VP8 chunk");
      if (
        buffer[payload + 3] !== 0x9d ||
        buffer[payload + 4] !== 0x01 ||
        buffer[payload + 5] !== 0x2a
      ) {
        fail("invalid VP8 frame marker");
      }
      dimensions ??= {
        width: buffer.readUInt16LE(payload + 6) & 0x3fff,
        height: buffer.readUInt16LE(payload + 8) & 0x3fff,
      };
    } else if (kind === "VP8L") {
      if (size < 5) fail("undersized VP8L chunk");
      if (buffer[payload] !== 0x2f) fail("invalid VP8L marker");
      const b1 = buffer[payload + 1];
      const b2 = buffer[payload + 2];
      const b3 = buffer[payload + 3];
      const b4 = buffer[payload + 4];
      dimensions ??= {
        width: 1 + b1 + ((b2 & 0x3f) << 8),
        height: 1 + (b2 >> 6) + (b3 << 2) + ((b4 & 0x0f) << 10),
      };
    } else if (kind === "VP8X") {
      if (size < 10) fail("undersized VP8X chunk");
      dimensions ??= {
        width: 1 + buffer.readUIntLE(payload + 4, 3),
        height: 1 + buffer.readUIntLE(payload + 7, 3),
      };
    }

    offset = nextOffset;
  }

  if (!dimensions) fail("WebP image chunk not found");
  return { filename, ...dimensions, bytes: buffer.length };
}

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

export function createInMemoryPreviewInventoryAdapter({
  files,
  bytesByFilename,
}) {
  return async () => ({
    files: [...files],
    read: async (filename) => bytesByFilename[filename],
    close: async () => undefined,
  });
}

export function createProductionPreviewInventoryAdapter() {
  return async () => ({
    files: await readdir(showcaseDirectory),
    read: (filename) => readFile(resolve(showcaseDirectory, filename)),
    close: async () => undefined,
  });
}

export function createPublicationInventory({ openSource, openPreviews }) {
  const inspectPreview = (artifact) => {
    const inspection = inspectWebpArtifact(artifact);
    if (inspection.width !== 1920 || inspection.height !== 1080) {
      throw new Error(
        `${inspection.filename}: is ${inspection.width}×${inspection.height}, expected 1920×1080`,
      );
    }
    return inspection;
  };

  return {
    inspectPreview,

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

    async validatePreviews(targets) {
      if (!openPreviews) {
        throw new Error("Preview Publication inventory adapter is unavailable.");
      }
      const previews = await openPreviews();
      try {
        const files = new Set(previews.files);
        const expectedFilenames = targets.map(
          (target) => target.previewFilename,
        );
        const actualFilenames = previews.files
          .filter((filename) => filename.endsWith(".webp"))
          .sort();
        const expected = new Set(expectedFilenames);
        const coverageFailures = [];
        const missing = expectedFilenames.filter(
          (filename) => !files.has(filename),
        );
        const orphan = actualFilenames.filter(
          (filename) => !expected.has(filename),
        );
        if (missing.length > 0) {
          coverageFailures.push(
            `- Missing showcase WebPs: ${missing.join(", ")}`,
          );
        }
        if (orphan.length > 0) {
          coverageFailures.push(
            `- Orphan showcase WebPs: ${orphan.join(", ")}`,
          );
        }

        let totalBytes = 0;
        const validityFailures = [];
        for (const filename of expectedFilenames) {
          if (!files.has(filename)) continue;
          try {
            const bytes = await previews.read(filename);
            const inspection = inspectPreview({ filename, bytes });
            totalBytes += inspection.bytes;
          } catch (error) {
            const reason =
              error instanceof Error && error.message.startsWith(`${filename}:`)
                ? error.message
                : `${filename}: failed to read preview artifact`;
            validityFailures.push(`- ${reason}`);
          }
        }

        if (coverageFailures.length > 0 || validityFailures.length > 0) {
          const sections = [];
          if (coverageFailures.length > 0) {
            sections.push("Preview coverage:", ...coverageFailures);
          }
          if (validityFailures.length > 0) {
            sections.push("Preview validity:", ...validityFailures);
          }
          throw new Error(
            [
              "Preview Publication inventory is invalid:",
              ...sections,
            ].join("\n"),
          );
        }

        return { count: targets.length, bytes: totalBytes };
      } finally {
        await previews.close();
      }
    },
  };
}

export const publicationInventory = createPublicationInventory({
  openSource: createProductionSourceInventoryAdapter(),
  openPreviews: createProductionPreviewInventoryAdapter(),
});

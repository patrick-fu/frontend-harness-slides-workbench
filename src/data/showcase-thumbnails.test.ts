import { describe, expect, it } from "vitest";
import { RUNTIME_REGISTRY } from "../catalog/runtime-registry";
import { getShowcaseThumbnail } from "./showcase-thumbnails";

type WebpBuffer = {
  length: number;
  readUInt16LE: (offset: number) => number;
  readUInt32LE: (offset: number) => number;
  readUIntLE: (offset: number, byteLength: number) => number;
  toString: (encoding: string, start?: number, end?: number) => string;
};

const runtimeProcess = (
  globalThis as typeof globalThis & {
    process: {
      cwd: () => string;
      getBuiltinModule: (name: "node:fs" | "node:path") => unknown;
    };
  }
).process;
const { readFileSync, readdirSync } = runtimeProcess.getBuiltinModule(
  "node:fs",
) as {
  readFileSync: (path: string) => WebpBuffer;
  readdirSync: (path: string) => string[];
};
const { resolve } = runtimeProcess.getBuiltinModule("node:path") as {
  resolve: (...segments: string[]) => string;
};
const showcaseDirectory = resolve(runtimeProcess.cwd(), "public/showcase");

function webpDimensions(filename: string) {
  const buffer = readFileSync(resolve(showcaseDirectory, filename));
  if (
    buffer.toString("ascii", 0, 4) !== "RIFF" ||
    buffer.toString("ascii", 8, 12) !== "WEBP"
  ) {
    throw new Error(`${filename} is not a WebP RIFF file`);
  }

  for (let offset = 12; offset + 8 <= buffer.length;) {
    const kind = buffer.toString("ascii", offset, offset + 4);
    const size = buffer.readUInt32LE(offset + 4);
    const payload = offset + 8;

    if (kind === "VP8 ") {
      return {
        width: buffer.readUInt16LE(payload + 6) & 0x3fff,
        height: buffer.readUInt16LE(payload + 8) & 0x3fff,
      };
    }
    if (kind === "VP8X") {
      return {
        width: 1 + buffer.readUIntLE(payload + 4, 3),
        height: 1 + buffer.readUIntLE(payload + 7, 3),
      };
    }

    offset = payload + size + (size % 2);
  }

  throw new Error(`${filename} has no readable WebP image chunk`);
}

describe("getShowcaseThumbnail", () => {
  it("derives the preview from Topic ID and the application base URL", () => {
    expect(getShowcaseThumbnail("product-keynote", "/")).toBe(
      "/showcase/product-keynote.webp",
    );
    expect(getShowcaseThumbnail("product-keynote", "/workbench/")).toBe(
      "/workbench/showcase/product-keynote.webp",
    );
    expect(getShowcaseThumbnail("product-keynote", "/workbench")).toBe(
      "/workbench/showcase/product-keynote.webp",
    );
  });

  it("commits exactly one 1920×1080 Topic-ID WebP for every Topic", () => {
    const topicIds = RUNTIME_REGISTRY.flatMap((styleGroup) =>
      styleGroup.topics.map((topic) => topic.id),
    );
    const expectedFilenames = topicIds.map((topicId) => `${topicId}.webp`);
    const committedWebps = readdirSync(showcaseDirectory)
      .filter((filename) => filename.endsWith(".webp"))
      .sort();

    expect(new Set(topicIds).size).toBe(topicIds.length);
    expect(committedWebps).toEqual([...expectedFilenames].sort());
    for (const filename of expectedFilenames) {
      expect(webpDimensions(filename)).toEqual({ width: 1920, height: 1080 });
    }
  });
});

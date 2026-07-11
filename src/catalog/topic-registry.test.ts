import { describe, expect, it } from "vitest";
import type { TopicDefinition } from "../domain/topic";
import { CATALOG_MANIFEST } from "./manifest.generated";
import { validateTopicRegistry } from "./topic-catalog";
import { TOPIC_REGISTRY } from "./topic-registry";
import { STYLE_DEFINITIONS } from "./style-definitions";

const topicModules = import.meta.glob<TopicDefinition>(
  ["../topics/*.tsx", "!../topics/*.test.tsx"],
  { eager: true, import: "default" },
);
const topicTests = Object.keys(import.meta.glob("../topics/*.test.tsx"));

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
  readFileSync: (path: string, encoding: "utf8") => string;
  readdirSync: (path: string) => string[];
};
const { resolve } = runtimeProcess.getBuiltinModule("node:path") as {
  resolve: (...segments: string[]) => string;
};
const topicFiles = readdirSync(resolve(runtimeProcess.cwd(), "src/topics"));
const showcaseFiles = readdirSync(
  resolve(runtimeProcess.cwd(), "public/showcase"),
);

function sorted(values: Iterable<string>): string[] {
  return [...values].sort();
}

describe("TOPIC_REGISTRY", () => {
  const styleGroups = validateTopicRegistry(STYLE_DEFINITIONS, TOPIC_REGISTRY);
  const registeredTopics = TOPIC_REGISTRY.flat();
  const registeredIds = registeredTopics.map((topic) => topic.id);

  it("is the unique global ordering source and projects exactly into the generated Manifest", () => {
    expect(new Set(registeredIds).size).toBe(registeredIds.length);
    expect(
      CATALOG_MANIFEST.map((group) => [
        group.style.id,
        group.topics.map((topic) => topic.id),
      ]),
    ).toEqual(
      styleGroups.map((group) => [
        group.style.id,
        group.topics.map((topic) => topic.id),
      ]),
    );

    for (const topic of registeredTopics) {
      const { Stage: _stage, ...catalogTopic } = topic;
      const manifestTopic = CATALOG_MANIFEST
        .flatMap((group) => group.topics)
        .find((candidate) => candidate.id === topic.id);

      expect(manifestTopic).toEqual({
        ...catalogTopic,
        modulePath: `../topics/${topic.id}.tsx`,
      });
    }
  });

  it("keeps Topic modules, focused tests, optional CSS, and showcase WebPs bidirectionally complete", () => {
    const expectedModules = registeredIds.map((id) => `../topics/${id}.tsx`);
    const expectedTests = registeredIds.map((id) => `../topics/${id}.test.tsx`);
    const expectedWebps = registeredIds.map((id) => `${id}.webp`);
    const cssTopicIds = topicFiles
      .filter((filename) => filename.endsWith(".module.css"))
      .map((filename) => filename.slice(0, -".module.css".length));

    expect(sorted(Object.keys(topicModules))).toEqual(sorted(expectedModules));
    expect(sorted(topicTests)).toEqual(sorted(expectedTests));
    expect(sorted(cssTopicIds)).toEqual(
      sorted(cssTopicIds.filter((id) => registeredIds.includes(id))),
    );
    expect(
      sorted(showcaseFiles.filter((filename) => filename.endsWith(".webp"))),
    ).toEqual(sorted(expectedWebps));

    for (const topic of registeredTopics) {
      expect(topicModules[`../topics/${topic.id}.tsx`]).toBe(topic);
    }
  });

  it("does not allow an eager Topic barrel", () => {
    expect(topicFiles).not.toContain("index.ts");
    expect(topicFiles).not.toContain("index.tsx");
    expect(topicFiles).not.toContain("index.js");
    expect(topicFiles).not.toContain("index.jsx");
  });

  it("keeps Style identity and structural generation labels out of Topic internals", () => {
    const forbidden = [
      /data-style-id=/,
      /data-topic-(?:origin|set)=/,
      /--style-\d+/,
      /\b(?:style|tw)\d+[a-z0-9_-]*/i,
      /\bSTYLE_\d/,
      /^const\s+(?:MODEL|MODEL_ID|STYLE_ID)\b/m,
    ];

    for (const filename of topicFiles.filter((candidate) =>
      /\.(?:tsx|css)$/.test(candidate),
    )) {
      const source = readFileSync(
        resolve(runtimeProcess.cwd(), "src/topics", filename),
        "utf8",
      );
      for (const pattern of forbidden) {
        expect(source, `${filename} contains forbidden ${pattern}`).not.toMatch(
          pattern,
        );
      }
    }

    for (const filename of topicFiles.filter((candidate) =>
      candidate.endsWith(".test.tsx"),
    )) {
      const source = readFileSync(
        resolve(runtimeProcess.cwd(), "src/topics", filename),
        "utf8",
      );
      expect(
        source,
        `${filename} uses a removed collection or compatibility label`,
      ).not.toMatch(/\b(?:curated|coordinated|legacy|Style\s+\d+)\b/i);
    }
  });
});

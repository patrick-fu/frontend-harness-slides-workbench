// @vitest-environment node

import { describe, expect, it } from "vitest";
import {
  createInMemorySourceInventoryAdapter,
  createPublicationInventory,
} from "./inventory.mjs";

const targets = [
  {
    topicId: "first-topic",
    styleId: "first-style",
    modulePath: "../topics/first-topic.tsx",
    testPath: "src/topics/first-topic.test.tsx",
  },
  {
    topicId: "second-topic",
    styleId: "second-style",
    modulePath: "../topics/second-topic.tsx",
    testPath: "src/topics/second-topic.test.tsx",
  },
];

describe("Source Publication Inventory", () => {
  it("accepts exact module/test coverage while Topic CSS remains optional", async () => {
    const inventory = createPublicationInventory({
      openSource: createInMemorySourceInventoryAdapter({
        files: [
          "first-topic.tsx",
          "first-topic.test.tsx",
          "first-topic.module.css",
          "second-topic.tsx",
          "second-topic.test.tsx",
        ],
        definitions: {
          "first-topic": { id: "first-topic", styleId: "first-style" },
          "second-topic": { id: "second-topic", styleId: "second-style" },
        },
      }),
    });

    await expect(inventory.validateSource(targets)).resolves.toBeUndefined();
  });

  it("aggregates source coverage failures in deterministic target order", async () => {
    const inventory = createPublicationInventory({
      openSource: createInMemorySourceInventoryAdapter({
        files: [
          "orphan.test.tsx",
          "orphan.tsx",
          "second-topic.test.tsx",
          "first-topic.tsx",
          "orphan.module.css",
          "index.tsx",
          "notes.md",
        ],
        definitions: {
          "first-topic": { id: "first-topic", styleId: "wrong-style" },
        },
      }),
    });

    await expect(inventory.validateSource(targets)).rejects.toThrow(
      [
        "Source Publication inventory is invalid:",
        "Source coverage:",
        "- Missing Topic modules: second-topic.tsx",
        "- Extra Topic modules: orphan.tsx",
        "- Missing focused Topic tests: first-topic.test.tsx",
        "- Extra focused Topic tests: orphan.test.tsx",
        "- Orphan Topic CSS: orphan.module.css",
        "- Eager Topic barrels: index.tsx",
        "Topic identity:",
        '- first-topic: default export Style ID "wrong-style" does not match "first-style".',
      ].join("\n"),
    );
  });

  it.each(["index.ts", "index.tsx", "index.js", "index.jsx"])(
    "rejects eager Topic barrel %s",
    async (barrel) => {
      const inventory = createPublicationInventory({
        openSource: createInMemorySourceInventoryAdapter({
          files: [
            "first-topic.tsx",
            "first-topic.test.tsx",
            "second-topic.tsx",
            "second-topic.test.tsx",
            barrel,
          ],
          definitions: {
            "first-topic": { id: "first-topic", styleId: "first-style" },
            "second-topic": { id: "second-topic", styleId: "second-style" },
          },
        }),
      });

      await expect(inventory.validateSource(targets)).rejects.toThrow(
        `Eager Topic barrels: ${barrel}`,
      );
    },
  );

  it("aggregates default-export loading and identity failures without paths", async () => {
    const identityTargets = [
      ...targets,
      {
        topicId: "third-topic",
        styleId: "third-style",
        modulePath: "../topics/third-topic.tsx",
        testPath: "src/topics/third-topic.test.tsx",
      },
      {
        topicId: "fourth-topic",
        styleId: "fourth-style",
        modulePath: "../topics/fourth-topic.tsx",
        testPath: "src/topics/fourth-topic.test.tsx",
      },
    ];
    const inventory = createPublicationInventory({
      openSource: createInMemorySourceInventoryAdapter({
        files: identityTargets.flatMap((target) => [
          `${target.topicId}.tsx`,
          `${target.topicId}.test.tsx`,
        ]),
        definitions: {
          "first-topic": { id: "wrong-topic", styleId: "first-style" },
          "second-topic": { id: "second-topic", styleId: "wrong-style" },
          "third-topic": undefined,
          "fourth-topic": new Error("/Users/name/project/module failed"),
        },
      }),
    });

    await expect(inventory.validateSource(identityTargets)).rejects.toThrow(
      [
        "Source Publication inventory is invalid:",
        "Topic identity:",
        '- first-topic: default export Topic ID "wrong-topic" does not match "first-topic".',
        '- second-topic: default export Style ID "wrong-style" does not match "second-style".',
        "- third-topic: module has no default export.",
        "- fourth-topic: failed to load the default export.",
      ].join("\n"),
    );
  });
});

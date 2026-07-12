import { describe, expect, it } from "vitest";
import type { StyleDefinitions } from "../domain/style";
import { makeTopicDefinition } from "../testing/topic-fixture";
import { createTopicCatalog } from "./topic-catalog";

const styles: StyleDefinitions = {
  "first-style": {
    id: "first-style",
    name: { en: "First Style", zh: "第一风格" },
    band: "minimal-keynote",
  },
  "second-style": {
    id: "second-style",
    name: { en: "Second Style", zh: "第二风格" },
    band: "balanced-hybrid",
  },
};

describe("createTopicCatalog", () => {
  it("preserves two-dimensional Registry order in the validated Topic Catalog", () => {
    const first = makeTopicDefinition({
      id: "first-topic",
      styleId: "first-style",
    });
    const second = makeTopicDefinition({
      id: "second-topic",
      styleId: "first-style",
    });
    const third = makeTopicDefinition({
      id: "third-topic",
      styleId: "second-style",
    });

    const catalog = createTopicCatalog(styles, [[first, second], [third]]);

    expect(
      catalog.styleGroups.map((group) => [
        group.style.id,
        group.topics.map((topic) => topic.id),
      ]),
    ).toEqual([
      ["first-style", ["first-topic", "second-topic"]],
      ["second-style", ["third-topic"]],
    ]);
    expect(catalog.styleGroups[0]?.topics[0]).toBe(first);
  });

  it.each([
    {
      name: "an empty Style Group",
      registry: () => [[]],
      message: "Topic Registry group 1 must contain at least one Topic.",
    },
    {
      name: "an unknown Style reference",
      registry: () => [
        [
          makeTopicDefinition({
            id: "unknown-style-topic",
            styleId: "missing-style",
          }),
        ],
      ],
      message:
        'Topic "unknown-style-topic" references unknown Style "missing-style".',
    },
    {
      name: "mixed Styles in one group",
      registry: () => [
        [
          makeTopicDefinition({ id: "first-topic", styleId: "first-style" }),
          makeTopicDefinition({
            id: "second-topic",
            styleId: "second-style",
          }),
        ],
      ],
      message:
        'Topic Registry group 1 mixes Style "first-style" with "second-style".',
    },
    {
      name: "the same Style in two groups",
      registry: () => [
        [makeTopicDefinition({ id: "first-topic", styleId: "first-style" })],
        [makeTopicDefinition({ id: "second-topic", styleId: "first-style" })],
      ],
      message: 'Style "first-style" appears in more than one Registry group.',
    },
    {
      name: "a Style definition omitted from the Registry",
      registry: () => [
        [makeTopicDefinition({ id: "first-topic", styleId: "first-style" })],
      ],
      message:
        "Style definitions missing from the Topic Registry: second-style.",
    },
    {
      name: "a globally duplicated Topic ID",
      registry: () => [
        [makeTopicDefinition({ id: "same-topic", styleId: "first-style" })],
        [makeTopicDefinition({ id: "same-topic", styleId: "second-style" })],
      ],
      message: 'Duplicate global Topic ID "same-topic".',
    },
  ])("rejects $name", ({ registry, message }) => {
    expect(() => createTopicCatalog(styles, registry())).toThrow(message);
  });

  it("rejects a Style definition whose map key and canonical ID diverge", () => {
    const first = makeTopicDefinition({
      id: "first-topic",
      styleId: "first-style",
    });

    expect(() =>
      createTopicCatalog(
        {
          ...styles,
          "first-style": { ...styles["first-style"], id: "renamed-style" },
        },
        [[first]],
      ),
    ).toThrow(
      'Style definition key "first-style" does not match canonical ID "renamed-style".',
    );
  });
});

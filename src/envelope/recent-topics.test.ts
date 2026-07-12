import { describe, expect, it, vi } from "vitest";
import { createRecentTopics, RECENT_TOPICS_KEY } from "./recent-topics";

function makeRegistry(topicIds: string[]) {
  return [
    {
      style: { id: "current-style", name: "Current Style" },
      topics: topicIds.map((id) => ({ id, title: `${id} title` })),
    },
  ];
}

function memoryStorage(initial: string | null = null) {
  let value = initial;
  return {
    getItem: vi.fn(() => value),
    setItem: vi.fn((_key: string, next: string) => {
      value = next;
    }),
  };
}

describe("Recent Topics", () => {
  it("normalizes current and legacy entries to known semantic Topic IDs", () => {
    const storage = memoryStorage(
      JSON.stringify([
        "first-topic",
        "retired-style/second-topic",
        "current-style/first-topic",
        "missing-topic",
        "too/many/parts",
        42,
        null,
      ]),
    );
    const recent = createRecentTopics(makeRegistry(["first-topic", "second-topic"]), {
      storage: () => storage,
    });

    expect(recent.readIds()).toEqual(["first-topic", "second-topic"]);
    expect(storage.setItem).not.toHaveBeenCalled();
  });

  it("resolves moved legacy Topics through current Registry data", () => {
    const registry = makeRegistry(["moved-topic"]);
    const recent = createRecentTopics(registry, {
      storage: () => memoryStorage(JSON.stringify(["stale-style/moved-topic"])),
    });

    expect(recent.resolve()).toEqual([
      {
        group: registry[0],
        topic: registry[0]?.topics[0],
      },
    ]);
  });

  it("records newest-first semantic IDs with deduplication and an eight-entry cap", () => {
    const ids = Array.from({ length: 10 }, (_, index) => `topic-${index + 1}`);
    const storage = memoryStorage(JSON.stringify(ids.slice(0, 8)));
    const recent = createRecentTopics(makeRegistry(ids), {
      storage: () => storage,
    });

    expect(recent.record("topic-8")).toEqual([
      "topic-8",
      "topic-1",
      "topic-2",
      "topic-3",
      "topic-4",
      "topic-5",
      "topic-6",
      "topic-7",
    ]);
    expect(storage.setItem).toHaveBeenLastCalledWith(
      RECENT_TOPICS_KEY,
      JSON.stringify([
        "topic-8",
        "topic-1",
        "topic-2",
        "topic-3",
        "topic-4",
        "topic-5",
        "topic-6",
        "topic-7",
      ]),
    );

    expect(recent.record("topic-9")).toEqual([
      "topic-9",
      "topic-8",
      "topic-1",
      "topic-2",
      "topic-3",
      "topic-4",
      "topic-5",
      "topic-6",
    ]);
  });

  it.each([
    ["malformed JSON", () => memoryStorage("{"), []],
    ["non-array payload", () => memoryStorage('{"topic":"first-topic"}'), []],
    [
      "unavailable storage",
      () => {
        throw new Error("storage unavailable");
      },
      [],
    ],
  ])("treats %s as an empty resilient history", (_name, storage, expected) => {
    const recent = createRecentTopics(makeRegistry(["first-topic"]), { storage });

    expect(recent.readIds()).toEqual(expected);
    expect(recent.resolve()).toEqual([]);
  });

  it("keeps working when browser persistence rejects writes", () => {
    const storage = {
      getItem: vi.fn(() => null),
      setItem: vi.fn(() => {
        throw new Error("quota denied");
      }),
    };
    const recent = createRecentTopics(makeRegistry(["first-topic"]), {
      storage: () => storage,
    });

    expect(recent.record("first-topic")).toEqual(["first-topic"]);
    expect(storage.setItem).toHaveBeenCalledOnce();
  });

  it("ignores unknown Topics and never persists composite navigation state", () => {
    const storage = memoryStorage(
      JSON.stringify([
        { topicId: "first-topic", lang: "zh", scene: 4, beat: 2 },
        "old-style/first-topic?scene=4&pure=1",
      ]),
    );
    const recent = createRecentTopics(makeRegistry(["first-topic"]), {
      storage: () => storage,
    });

    expect(recent.record("missing-topic")).toEqual([]);
    expect(storage.setItem).not.toHaveBeenCalled();
    expect(recent.record("first-topic")).toEqual(["first-topic"]);
    expect(storage.setItem).toHaveBeenLastCalledWith(
      RECENT_TOPICS_KEY,
      '["first-topic"]',
    );
  });
});

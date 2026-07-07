import { describe, expect, it } from "vitest";
import type { StyleMetadata } from "../types";
import {
  buildStyleRegistryEntry,
  defineStyleTopic,
} from "./topic";

function makeMetadata(id: string): StyleMetadata {
  return {
    id,
    band: "minimal-keynote",
    name: `Style ${id}`,
    theme: "Explicit protocol test",
    densityLabel: "Sparse",
    heroScene: 1,
    colors: { bg: "#000", ink: "#fff", panel: "#111" },
    typography: { header: "Test 500", body: "Test 400" },
    tags: ["test"],
    fonts: [],
    scenes: [1, 2, 3, 4, 5].map((sceneId) => ({
      id: sceneId,
      title: `Scene ${sceneId}`,
      beats: [{ id: 0, action: "Show", title: "Title", body: "" }],
    })),
  };
}

const TestComponent = () => <div>test</div>;

describe("style topic protocol", () => {
  it("accepts stable explicit topic IDs for registry modules", () => {
    const protocolTopic = defineStyleTopic({
      id: "decision-art",
      topic: { en: "Decision Art", zh: "决策艺术" },
      model: "protocol-test",
      component: TestComponent,
      getMetadata: () => makeMetadata("decision-record"),
    });

    const entry = buildStyleRegistryEntry("decision-record", [protocolTopic]);

    expect(entry.topics).toHaveLength(1);
    expect(entry.topics[0].id).toBe("decision-art");
    expect(entry.topics[0].topic).toEqual({
      en: "Decision Art",
      zh: "决策艺术",
    });
    expect(entry.topics[0].model).toBe("protocol-test");
  });

  it("rejects incomplete topic modules instead of generating legacy IDs", () => {
    expect(() =>
      buildStyleRegistryEntry("decision-record", [
        {
          component: TestComponent,
          getMetadata: () => makeMetadata("decision-record"),
        } as any,
      ]),
    ).toThrow(/Invalid topic id/);
  });

  it("requires both localized topic labels", () => {
    expect(() =>
      defineStyleTopic({
        id: "missing-zh",
        topic: { en: "Decision Art", zh: "" },
        model: "protocol-test",
        component: TestComponent,
        getMetadata: () => makeMetadata("decision-record"),
      }),
    ).toThrow(/localized en\/zh topic/);
  });

  it("rejects v-prefixed legacy topic IDs", () => {
    expect(() =>
      defineStyleTopic({
        id: "v1",
        topic: { en: "Legacy", zh: "旧版" },
        model: "protocol-test",
        component: TestComponent,
        getMetadata: () => makeMetadata("decision-record"),
      }),
    ).toThrow(/legacy version id/);
  });

  it("uses registry entry order and topic array order without sequence IDs", () => {
    const entry = buildStyleRegistryEntry("decision-record", [
      {
        id: "legacy",
        topic: { en: "Legacy", zh: "旧版" },
        model: "Doubao-Seed-Evolving",
        component: TestComponent,
        getMetadata: () => makeMetadata("decision-record"),
      },
      defineStyleTopic({
        id: "decision-art",
        topic: { en: "Decision Art", zh: "决策艺术" },
        model: "protocol-test",
        component: TestComponent,
        getMetadata: () => makeMetadata("decision-record"),
      }),
    ]);

    expect(entry.topics.map((topic) => topic.id)).toEqual([
      "legacy",
      "decision-art",
    ]);
  });

  it("rejects duplicate explicit topic IDs", () => {
    const duplicateTopic = defineStyleTopic({
      id: "legacy",
      topic: { en: "Duplicate", zh: "重复" },
      model: "protocol-test",
      component: TestComponent,
      getMetadata: () => makeMetadata("decision-record"),
    });

    expect(() =>
      buildStyleRegistryEntry("decision-record", [
        {
          id: "legacy",
          topic: { en: "Legacy", zh: "旧版" },
          model: "Doubao-Seed-Evolving",
          component: TestComponent,
          getMetadata: () => makeMetadata("decision-record"),
        },
        duplicateTopic,
      ]),
    ).toThrow(/Duplicate topic id "legacy"/);
  });
});

import { describe, expect, it } from "vitest";
import type { StyleMetadata } from "../types";
import {
  buildStyleRegistryEntry,
  defineStyleVersion,
} from "./version";

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

describe("style version protocol", () => {
  it("accepts stable explicit version IDs for protocol modules", () => {
    const protocolVersion = defineStyleVersion({
      id: "decision-art",
      topic: { en: "Decision Art", zh: "决策艺术" },
      model: "protocol-test",
      component: TestComponent,
      getMetadata: () => makeMetadata("99"),
    });

    const entry = buildStyleRegistryEntry("99", [protocolVersion]);

    expect(entry.versions).toHaveLength(1);
    expect(entry.versions[0].id).toBe("decision-art");
    expect(entry.versions[0].topic).toEqual({
      en: "Decision Art",
      zh: "决策艺术",
    });
    expect(entry.versions[0].model).toBe("protocol-test");
  });

  it("rejects incomplete version modules instead of generating legacy IDs", () => {
    expect(() =>
      buildStyleRegistryEntry("99", [
        {
          component: TestComponent,
          getMetadata: () => makeMetadata("99"),
        } as any,
      ]),
    ).toThrow(/Invalid version id/);
  });

  it("requires both localized topic labels", () => {
    expect(() =>
      defineStyleVersion({
        id: "missing-zh",
        topic: { en: "Decision Art", zh: "" },
        model: "protocol-test",
        component: TestComponent,
        getMetadata: () => makeMetadata("99"),
      }),
    ).toThrow(/localized en\/zh topic/);
  });

  it("accepts explicit v1 modules", () => {
    const entry = buildStyleRegistryEntry("99", [
      {
        id: "v1",
        topic: { en: "Legacy", zh: "旧版" },
        model: "Doubao-Seed-Evolving",
        component: TestComponent,
        getMetadata: () => makeMetadata("99"),
      },
    ]);

    expect(entry.versions).toHaveLength(1);
    expect(entry.versions[0].id).toBe("v1");
  });

  it("rejects duplicate explicit version IDs", () => {
    const duplicateV1 = defineStyleVersion({
      id: "v1",
      topic: { en: "Duplicate", zh: "重复" },
      model: "protocol-test",
      component: TestComponent,
      getMetadata: () => makeMetadata("99"),
    });

    expect(() =>
      buildStyleRegistryEntry("99", [
        {
          id: "v1",
          topic: { en: "Legacy", zh: "旧版" },
          model: "Doubao-Seed-Evolving",
          component: TestComponent,
          getMetadata: () => makeMetadata("99"),
        },
        duplicateV1,
      ]),
    ).toThrow(/Duplicate version id "v1"/);
  });
});

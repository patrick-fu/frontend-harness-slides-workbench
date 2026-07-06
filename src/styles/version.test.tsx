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
      topic: "Decision Art",
      model: "protocol-test",
      component: TestComponent,
      getMetadata: () => makeMetadata("99"),
    });

    const entry = buildStyleRegistryEntry("99", [protocolVersion]);

    expect(entry.versions).toHaveLength(1);
    expect(entry.versions[0].id).toBe("decision-art");
    expect(entry.versions[0].topic).toBe("Decision Art");
    expect(entry.versions[0].model).toBe("protocol-test");
  });

  it("preserves generated v1 IDs for legacy version tuples", () => {
    const entry = buildStyleRegistryEntry("99", [
      {
        component: TestComponent,
        getMetadata: () => makeMetadata("99"),
      },
    ]);

    expect(entry.versions).toHaveLength(1);
    expect(entry.versions[0].id).toBe("v1");
  });

  it("rejects duplicate explicit and generated version IDs", () => {
    const duplicateV1 = defineStyleVersion({
      id: "v1",
      topic: "Duplicate",
      model: "protocol-test",
      component: TestComponent,
      getMetadata: () => makeMetadata("99"),
    });

    expect(() =>
      buildStyleRegistryEntry("99", [
        {
          component: TestComponent,
          getMetadata: () => makeMetadata("99"),
        },
        duplicateV1,
      ]),
    ).toThrow(/Duplicate version id "v1"/);
  });
});

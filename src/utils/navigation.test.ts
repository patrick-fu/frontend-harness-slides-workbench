import { describe, it, expect } from "vitest";
import type { StyleRegistryEntry, StyleMetadata } from "../types";
import { computeNext, computePrev, jumpScene, jumpStyle } from "./navigation";

// ─── Helpers ────────────────────────────────────────────────────────────────

function makeScenes(beatCounts: number[]): StyleMetadata["scenes"] {
  return beatCounts.map((count, i) => ({
    id: i + 1,
    title: `Scene ${i + 1}`,
    beats: Array.from({ length: count }, (_, j) => ({
      id: j,
      action: `beat-${j}`,
      title: `Beat ${j}`,
      body: "",
    })),
  }));
}

function makeStyle(
  id: string,
  beatCounts: number[],
): StyleRegistryEntry {
  const metadata: StyleMetadata = {
    id,
    band: "minimal-keynote",
    name: `Style ${id}`,
    theme: "",
    densityLabel: "",
    heroScene: 1,
    colors: { bg: "#000", ink: "#fff", panel: "#222" },
    typography: { header: "", body: "" },
    tags: [],
    fonts: [],
    scenes: makeScenes(beatCounts),
  };
  return {
    id,
    component: () => null,
    getMetadata: () => metadata,
  };
}

// ─── Mock registry: 3 styles with varied beat counts ────────────────────────
//
// Style "01": [3, 2, 4, 1, 3] beats per scene
// Style "02": [2, 3, 2, 3, 2] beats per scene
// Style "03": [1, 1, 1, 1, 1] beats per scene (single-beat scenes)

const registry: StyleRegistryEntry[] = [
  makeStyle("01", [3, 2, 4, 1, 3]),
  makeStyle("02", [2, 3, 2, 3, 2]),
  makeStyle("03", [1, 1, 1, 1, 1]),
];

// ─── computeNext ────────────────────────────────────────────────────────────

describe("computeNext", () => {
  it("advances beat within the same scene", () => {
    // Style "01" scene 1 has 3 beats (ids 0,1,2)
    const result = computeNext(registry, "01", 1, 0, false);
    expect(result).toEqual({ styleId: "01", scene: 1, beat: 1, flashStyle: false });
  });

  it("advances to the last beat within a scene", () => {
    const result = computeNext(registry, "01", 1, 1, false);
    expect(result).toEqual({ styleId: "01", scene: 1, beat: 2, flashStyle: false });
  });

  it("advances scene when at last beat, resets beat to 0", () => {
    // Style "01" scene 1 last beat = 2
    const result = computeNext(registry, "01", 1, 2, false);
    expect(result).toEqual({ styleId: "01", scene: 2, beat: 0, flashStyle: false });
  });

  it("advances scene 4 to 5 when at last beat", () => {
    // Style "01" scene 4 has 1 beat (id 0)
    const result = computeNext(registry, "01", 4, 0, false);
    expect(result).toEqual({ styleId: "01", scene: 5, beat: 0, flashStyle: false });
  });

  it("wraps to next style at scene 5 last beat, flashStyle=true", () => {
    // Style "01" scene 5 has 3 beats (ids 0,1,2)
    const result = computeNext(registry, "01", 5, 2, false);
    expect(result).toEqual({ styleId: "02", scene: 1, beat: 0, flashStyle: true });
  });

  it("wraps from last style back to first style", () => {
    // Style "03" scene 5 has 1 beat (id 0)
    const result = computeNext(registry, "03", 5, 0, false);
    expect(result).toEqual({ styleId: "01", scene: 1, beat: 0, flashStyle: true });
  });

  it("returns null at scene 5 last beat when isPureMode=true", () => {
    const result = computeNext(registry, "01", 5, 2, true);
    expect(result).toBeNull();
  });

  it("returns null at last style scene 5 last beat when isPureMode=true", () => {
    const result = computeNext(registry, "03", 5, 0, true);
    expect(result).toBeNull();
  });

  it("still advances beat within scene when isPureMode=true", () => {
    const result = computeNext(registry, "01", 1, 0, true);
    expect(result).toEqual({ styleId: "01", scene: 1, beat: 1, flashStyle: false });
  });

  it("still advances scene when isPureMode=true", () => {
    const result = computeNext(registry, "01", 1, 2, true);
    expect(result).toEqual({ styleId: "01", scene: 2, beat: 0, flashStyle: false });
  });

  it("handles single-beat scenes: beat 0 goes to next scene", () => {
    // Style "03" every scene has 1 beat
    const result = computeNext(registry, "03", 1, 0, false);
    expect(result).toEqual({ styleId: "03", scene: 2, beat: 0, flashStyle: false });
  });

  it("handles middle scene with multiple beats", () => {
    // Style "02" scene 2 has 3 beats (ids 0,1,2)
    const result = computeNext(registry, "02", 2, 1, false);
    expect(result).toEqual({ styleId: "02", scene: 2, beat: 2, flashStyle: false });
  });
});

// ─── computePrev ────────────────────────────────────────────────────────────

describe("computePrev", () => {
  it("goes to previous beat within the same scene", () => {
    const result = computePrev(registry, "01", 1, 2, false);
    expect(result).toEqual({ styleId: "01", scene: 1, beat: 1, flashStyle: false });
  });

  it("goes from beat 1 to beat 0", () => {
    const result = computePrev(registry, "01", 1, 1, false);
    expect(result).toEqual({ styleId: "01", scene: 1, beat: 0, flashStyle: false });
  });

  it("goes to previous scene last beat when at beat 0", () => {
    // Style "01" scene 2 has 2 beats (ids 0,1). Prev scene 1 has 3 beats (last=2).
    const result = computePrev(registry, "01", 2, 0, false);
    expect(result).toEqual({ styleId: "01", scene: 1, beat: 2, flashStyle: false });
  });

  it("goes from scene 5 beat 0 to scene 4 last beat", () => {
    // Style "01" scene 4 has 1 beat (last=0)
    const result = computePrev(registry, "01", 5, 0, false);
    expect(result).toEqual({ styleId: "01", scene: 4, beat: 0, flashStyle: false });
  });

  it("wraps to previous style at scene 1 beat 0, flashStyle=true", () => {
    // Prev style "03", last scene 5 has 1 beat (last=0)
    const result = computePrev(registry, "01", 1, 0, false);
    expect(result).toEqual({ styleId: "03", scene: 5, beat: 0, flashStyle: true });
  });

  it("wraps from first style to last style", () => {
    // computePrev on "01" scene 1 beat 0 goes to last style in registry
    const result = computePrev(registry, "01", 1, 0, false);
    expect(result).toEqual({ styleId: "03", scene: 5, beat: 0, flashStyle: true });
  });

  it("wraps to previous style with correct last scene last beat", () => {
    // Style "02" scene 1 beat 0 -> prev style "01" scene 5 has 3 beats (last=2)
    const result = computePrev(registry, "02", 1, 0, false);
    expect(result).toEqual({ styleId: "01", scene: 5, beat: 2, flashStyle: true });
  });

  it("returns null at scene 1 beat 0 when isPureMode=true", () => {
    const result = computePrev(registry, "01", 1, 0, true);
    expect(result).toBeNull();
  });

  it("still goes to previous beat when isPureMode=true", () => {
    const result = computePrev(registry, "01", 1, 2, true);
    expect(result).toEqual({ styleId: "01", scene: 1, beat: 1, flashStyle: false });
  });

  it("still goes to previous scene when isPureMode=true", () => {
    const result = computePrev(registry, "01", 2, 0, true);
    expect(result).toEqual({ styleId: "01", scene: 1, beat: 2, flashStyle: false });
  });

  it("handles single-beat scenes: scene 2 beat 0 goes to scene 1 beat 0", () => {
    // Style "03" every scene has 1 beat
    const result = computePrev(registry, "03", 2, 0, false);
    expect(result).toEqual({ styleId: "03", scene: 1, beat: 0, flashStyle: false });
  });
});

// ─── jumpScene ──────────────────────────────────────────────────────────────

describe("jumpScene", () => {
  it("jumps to a valid scene with beat 0", () => {
    const result = jumpScene(registry, "01", 3);
    expect(result).toEqual({ styleId: "01", scene: 3, beat: 0 });
  });

  it("jumps to scene 1", () => {
    const result = jumpScene(registry, "02", 1);
    expect(result).toEqual({ styleId: "02", scene: 1, beat: 0 });
  });

  it("jumps to scene 5", () => {
    const result = jumpScene(registry, "03", 5);
    expect(result).toEqual({ styleId: "03", scene: 5, beat: 0 });
  });

  it("clamps targetScene below 1 to 1", () => {
    const result = jumpScene(registry, "01", 0);
    expect(result).toEqual({ styleId: "01", scene: 1, beat: 0 });
  });

  it("clamps targetScene above 5 to 5", () => {
    const result = jumpScene(registry, "01", 10);
    expect(result).toEqual({ styleId: "01", scene: 5, beat: 0 });
  });

  it("clamps negative scene to 1", () => {
    const result = jumpScene(registry, "01", -3);
    expect(result).toEqual({ styleId: "01", scene: 1, beat: 0 });
  });
});

// ─── jumpStyle ──────────────────────────────────────────────────────────────

describe("jumpStyle", () => {
  it("jumps to an existing style at scene 1 beat 0", () => {
    const result = jumpStyle(registry, "02");
    expect(result).toEqual({ styleId: "02", scene: 1, beat: 0 });
  });

  it("jumps to first style", () => {
    const result = jumpStyle(registry, "01");
    expect(result).toEqual({ styleId: "01", scene: 1, beat: 0 });
  });

  it("jumps to last style", () => {
    const result = jumpStyle(registry, "03");
    expect(result).toEqual({ styleId: "03", scene: 1, beat: 0 });
  });

  it("returns null for non-existent style id", () => {
    const result = jumpStyle(registry, "99");
    expect(result).toBeNull();
  });

  it("returns null for empty string id", () => {
    const result = jumpStyle(registry, "");
    expect(result).toBeNull();
  });
});

import { lazy } from "react";
import { describe, it, expect } from "vitest";
import type {
  RuntimeStyleGroup,
  RuntimeTopic,
} from "../catalog/runtime-registry";
import type { TopicMetadata, TopicStage } from "../domain/topic";
import {
  computeNext,
  computePrev,
  getStageTapNavigationDirection,
  getSwipeNavigationDirection,
  jumpScene,
  jumpStyle,
  jumpTopic,
} from "./navigation";

// ─── Helpers ────────────────────────────────────────────────────────────────

function makeScenes(beatCounts: number[]): TopicMetadata["scenes"] {
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
  topicCount: number = 1,
): RuntimeStyleGroup {
  const metadata: TopicMetadata = {
    theme: "",
    densityLabel: "",
    heroScene: 1,
    colors: { bg: "#000", ink: "#fff", panel: "#222" },
    typography: { header: "", body: "" },
    tags: [],
    fonts: [],
    scenes: makeScenes(beatCounts),
  };
  const Stage: TopicStage = () => null;
  const topics: RuntimeTopic[] = Array.from(
    { length: topicCount },
    (_, i) => ({
      id: `topic-${i + 1}`,
      styleId: id,
      title: { en: `Topic ${i + 1}`, zh: `题材 ${i + 1}` },
      modelId: "GPT 5.5",
      metadata: { en: metadata, zh: metadata },
      navigation: { mode: "none" },
      transitionScore: {
        "1->2": "hard-cut",
        "2->3": "hard-cut",
        "3->4": "hard-cut",
        "4->5": "hard-cut",
      },
      evidence: { kind: "none" },
      modulePath: `../topics/topic-${i + 1}.tsx`,
      Stage: lazy(async () => ({ default: Stage })),
      loadStage: async () => Stage,
    }),
  );
  return {
    style: {
      id,
      name: { en: `Style ${id}`, zh: `风格 ${id}` },
      band: "minimal-keynote",
    },
    topics,
  };
}

// ─── Mock registry: 3 styles with varied beat counts ────────────────────────
//
// Style "alpha-style": [3, 2, 4, 1, 3] beats per scene
// Style "beta-style": [2, 3, 2, 3, 2] beats per scene
// Style "gamma-style": [1, 1, 1, 1, 1] beats per scene (single-beat scenes)

const registry: RuntimeStyleGroup[] = [
  makeStyle("alpha-style", [3, 2, 4, 1, 3]),
  makeStyle("beta-style", [2, 3, 2, 3, 2]),
  makeStyle("gamma-style", [1, 1, 1, 1, 1]),
];

// ─── Player input directions ───────────────────────────────────────────────

describe("player input directions", () => {
  it("maps the left 20% of the stage to previous and the rest to next", () => {
    expect(
      getStageTapNavigationDirection({
        clientX: 39,
        stageLeft: 0,
        stageWidth: 200,
      }),
    ).toBe("prev");
    expect(
      getStageTapNavigationDirection({
        clientX: 40,
        stageLeft: 0,
        stageWidth: 200,
      }),
    ).toBe("next");
  });

  it("maps left or up swipes to next and right or down swipes to previous", () => {
    expect(
      getSwipeNavigationDirection({ x: 150, y: 50 }, { x: 100, y: 50 }),
    ).toBe("next");
    expect(
      getSwipeNavigationDirection({ x: 100, y: 50 }, { x: 150, y: 50 }),
    ).toBe("prev");
    expect(
      getSwipeNavigationDirection({ x: 100, y: 100 }, { x: 100, y: 50 }),
    ).toBe("next");
    expect(
      getSwipeNavigationDirection({ x: 100, y: 50 }, { x: 100, y: 100 }),
    ).toBe("prev");
  });

  it("uses the dominant axis and ignores ambiguous or below-threshold gestures", () => {
    expect(
      getSwipeNavigationDirection({ x: 150, y: 100 }, { x: 90, y: 55 }),
    ).toBe("next");
    expect(
      getSwipeNavigationDirection({ x: 100, y: 150 }, { x: 145, y: 90 }),
    ).toBe("next");
    expect(
      getSwipeNavigationDirection({ x: 100, y: 100 }, { x: 140, y: 140 }),
    ).toBeNull();
    expect(
      getSwipeNavigationDirection({ x: 100, y: 100 }, { x: 149, y: 100 }),
    ).toBeNull();
  });
});

// ─── computeNext ────────────────────────────────────────────────────────────

describe("computeNext", () => {
  it("advances beat within the same scene", () => {
    const result = computeNext(registry, "alpha-style", "topic-1", 1, 0, false);
    expect(result).toEqual({
      styleId: "alpha-style",
      topicId: "topic-1",
      scene: 1,
      beat: 1,
      flashStyle: false,
    });
  });

  it("advances to the last beat within a scene", () => {
    const result = computeNext(registry, "alpha-style", "topic-1", 1, 1, false);
    expect(result).toEqual({
      styleId: "alpha-style",
      topicId: "topic-1",
      scene: 1,
      beat: 2,
      flashStyle: false,
    });
  });

  it("advances scene when at last beat, resets beat to 0", () => {
    const result = computeNext(registry, "alpha-style", "topic-1", 1, 2, false);
    expect(result).toEqual({
      styleId: "alpha-style",
      topicId: "topic-1",
      scene: 2,
      beat: 0,
      flashStyle: false,
    });
  });

  it("advances scene 4 to 5 when at last beat", () => {
    const result = computeNext(registry, "alpha-style", "topic-1", 4, 0, false);
    expect(result).toEqual({
      styleId: "alpha-style",
      topicId: "topic-1",
      scene: 5,
      beat: 0,
      flashStyle: false,
    });
  });

  it("wraps to next style at scene 5 last beat, flashStyle=true", () => {
    const result = computeNext(registry, "alpha-style", "topic-1", 5, 2, false);
    expect(result).toEqual({
      styleId: "beta-style",
      topicId: "topic-1",
      scene: 1,
      beat: 0,
      flashStyle: true,
    });
  });

  it("wraps from last style back to first style", () => {
    const result = computeNext(registry, "gamma-style", "topic-1", 5, 0, false);
    expect(result).toEqual({
      styleId: "alpha-style",
      topicId: "topic-1",
      scene: 1,
      beat: 0,
      flashStyle: true,
    });
  });

  it("returns null at scene 5 last beat when isPureMode=true", () => {
    const result = computeNext(registry, "alpha-style", "topic-1", 5, 2, true);
    expect(result).toBeNull();
  });

  it("returns null at last style scene 5 last beat when isPureMode=true", () => {
    const result = computeNext(registry, "gamma-style", "topic-1", 5, 0, true);
    expect(result).toBeNull();
  });

  it("still advances beat within scene when isPureMode=true", () => {
    const result = computeNext(registry, "alpha-style", "topic-1", 1, 0, true);
    expect(result).toEqual({
      styleId: "alpha-style",
      topicId: "topic-1",
      scene: 1,
      beat: 1,
      flashStyle: false,
    });
  });

  it("still advances scene when isPureMode=true", () => {
    const result = computeNext(registry, "alpha-style", "topic-1", 1, 2, true);
    expect(result).toEqual({
      styleId: "alpha-style",
      topicId: "topic-1",
      scene: 2,
      beat: 0,
      flashStyle: false,
    });
  });

  it("handles single-beat scenes: beat 0 goes to next scene", () => {
    const result = computeNext(registry, "gamma-style", "topic-1", 1, 0, false);
    expect(result).toEqual({
      styleId: "gamma-style",
      topicId: "topic-1",
      scene: 2,
      beat: 0,
      flashStyle: false,
    });
  });

  it("handles middle scene with multiple beats", () => {
    const result = computeNext(registry, "beta-style", "topic-1", 2, 1, false);
    expect(result).toEqual({
      styleId: "beta-style",
      topicId: "topic-1",
      scene: 2,
      beat: 2,
      flashStyle: false,
    });
  });
});

// ─── computeNext with multiple topics ─────────────────────────────────────

describe("computeNext with multiple topics", () => {
  const multiTopicRegistry: RuntimeStyleGroup[] = [
    makeStyle("alpha-style", [1, 1, 1, 1, 1], 2), // 2 topics
    makeStyle("beta-style", [1, 1, 1, 1, 1], 1),
  ];

  it("cycles to next topic within the same style", () => {
    const result = computeNext(multiTopicRegistry, "alpha-style", "topic-1", 5, 0, false);
    expect(result).toEqual({
      styleId: "alpha-style",
      topicId: "topic-2",
      scene: 1,
      beat: 0,
      flashStyle: true,
    });
  });

  it("goes to next style after last topic of current style", () => {
    const result = computeNext(multiTopicRegistry, "alpha-style", "topic-2", 5, 0, false);
    expect(result).toEqual({
      styleId: "beta-style",
      topicId: "topic-1",
      scene: 1,
      beat: 0,
      flashStyle: true,
    });
  });
});

// ─── computePrev ────────────────────────────────────────────────────────────

describe("computePrev", () => {
  it("goes to previous beat within the same scene", () => {
    const result = computePrev(registry, "alpha-style", "topic-1", 1, 2, false);
    expect(result).toEqual({
      styleId: "alpha-style",
      topicId: "topic-1",
      scene: 1,
      beat: 1,
      flashStyle: false,
    });
  });

  it("goes from beat 1 to beat 0", () => {
    const result = computePrev(registry, "alpha-style", "topic-1", 1, 1, false);
    expect(result).toEqual({
      styleId: "alpha-style",
      topicId: "topic-1",
      scene: 1,
      beat: 0,
      flashStyle: false,
    });
  });

  it("goes to previous scene last beat when at beat 0", () => {
    const result = computePrev(registry, "alpha-style", "topic-1", 2, 0, false);
    expect(result).toEqual({
      styleId: "alpha-style",
      topicId: "topic-1",
      scene: 1,
      beat: 2,
      flashStyle: false,
    });
  });

  it("goes from scene 5 beat 0 to scene 4 last beat", () => {
    const result = computePrev(registry, "alpha-style", "topic-1", 5, 0, false);
    expect(result).toEqual({
      styleId: "alpha-style",
      topicId: "topic-1",
      scene: 4,
      beat: 0,
      flashStyle: false,
    });
  });

  it("wraps to previous style at scene 1 beat 0, flashStyle=true", () => {
    const result = computePrev(registry, "alpha-style", "topic-1", 1, 0, false);
    expect(result).toEqual({
      styleId: "gamma-style",
      topicId: "topic-1",
      scene: 5,
      beat: 0,
      flashStyle: true,
    });
  });

  it("wraps from first style to last style", () => {
    const result = computePrev(registry, "alpha-style", "topic-1", 1, 0, false);
    expect(result).toEqual({
      styleId: "gamma-style",
      topicId: "topic-1",
      scene: 5,
      beat: 0,
      flashStyle: true,
    });
  });

  it("wraps to previous style with correct last scene last beat", () => {
    const result = computePrev(registry, "beta-style", "topic-1", 1, 0, false);
    expect(result).toEqual({
      styleId: "alpha-style",
      topicId: "topic-1",
      scene: 5,
      beat: 2,
      flashStyle: true,
    });
  });

  it("returns null at scene 1 beat 0 when isPureMode=true", () => {
    const result = computePrev(registry, "alpha-style", "topic-1", 1, 0, true);
    expect(result).toBeNull();
  });

  it("still goes to previous beat when isPureMode=true", () => {
    const result = computePrev(registry, "alpha-style", "topic-1", 1, 2, true);
    expect(result).toEqual({
      styleId: "alpha-style",
      topicId: "topic-1",
      scene: 1,
      beat: 1,
      flashStyle: false,
    });
  });

  it("still goes to previous scene when isPureMode=true", () => {
    const result = computePrev(registry, "alpha-style", "topic-1", 2, 0, true);
    expect(result).toEqual({
      styleId: "alpha-style",
      topicId: "topic-1",
      scene: 1,
      beat: 2,
      flashStyle: false,
    });
  });

  it("handles single-beat scenes: scene 2 beat 0 goes to scene 1 beat 0", () => {
    const result = computePrev(registry, "gamma-style", "topic-1", 2, 0, false);
    expect(result).toEqual({
      styleId: "gamma-style",
      topicId: "topic-1",
      scene: 1,
      beat: 0,
      flashStyle: false,
    });
  });
});

// ─── computePrev with multiple topics ─────────────────────────────────────

describe("computePrev with multiple topics", () => {
  const multiTopicRegistry: RuntimeStyleGroup[] = [
    makeStyle("alpha-style", [1, 1, 1, 1, 1], 2), // 2 topics
    makeStyle("beta-style", [1, 1, 1, 1, 1], 1),
  ];

  it("cycles to previous topic within the same style", () => {
    const result = computePrev(multiTopicRegistry, "alpha-style", "topic-2", 1, 0, false);
    expect(result).toEqual({
      styleId: "alpha-style",
      topicId: "topic-1",
      scene: 5,
      beat: 0,
      flashStyle: true,
    });
  });

  it("goes to previous style's last topic from first topic", () => {
    const result = computePrev(multiTopicRegistry, "beta-style", "topic-1", 1, 0, false);
    expect(result).toEqual({
      styleId: "alpha-style",
      topicId: "topic-2",
      scene: 5,
      beat: 0,
      flashStyle: true,
    });
  });
});

// ─── jumpScene ──────────────────────────────────────────────────────────────

describe("jumpScene", () => {
  it("jumps to a valid scene with beat 0", () => {
    const result = jumpScene(registry, "alpha-style", "topic-1", 3);
    expect(result).toEqual({
      styleId: "alpha-style",
      topicId: "topic-1",
      scene: 3,
      beat: 0,
    });
  });

  it("jumps to scene 1", () => {
    const result = jumpScene(registry, "beta-style", "topic-1", 1);
    expect(result).toEqual({
      styleId: "beta-style",
      topicId: "topic-1",
      scene: 1,
      beat: 0,
    });
  });

  it("jumps to scene 5", () => {
    const result = jumpScene(registry, "gamma-style", "topic-1", 5);
    expect(result).toEqual({
      styleId: "gamma-style",
      topicId: "topic-1",
      scene: 5,
      beat: 0,
    });
  });

  it("clamps targetScene below 1 to 1", () => {
    const result = jumpScene(registry, "alpha-style", "topic-1", 0);
    expect(result).toEqual({
      styleId: "alpha-style",
      topicId: "topic-1",
      scene: 1,
      beat: 0,
    });
  });

  it("clamps targetScene above 5 to 5", () => {
    const result = jumpScene(registry, "alpha-style", "topic-1", 10);
    expect(result).toEqual({
      styleId: "alpha-style",
      topicId: "topic-1",
      scene: 5,
      beat: 0,
    });
  });

  it("clamps negative scene to 1", () => {
    const result = jumpScene(registry, "alpha-style", "topic-1", -3);
    expect(result).toEqual({
      styleId: "alpha-style",
      topicId: "topic-1",
      scene: 1,
      beat: 0,
    });
  });
});

// ─── jumpStyle ──────────────────────────────────────────────────────────────

describe("jumpStyle", () => {
  it("jumps to an existing style at scene 1 beat 0 first topic", () => {
    const result = jumpStyle(registry, "beta-style");
    expect(result).toEqual({
      styleId: "beta-style",
      topicId: "topic-1",
      scene: 1,
      beat: 0,
    });
  });

  it("jumps to first style", () => {
    const result = jumpStyle(registry, "alpha-style");
    expect(result).toEqual({
      styleId: "alpha-style",
      topicId: "topic-1",
      scene: 1,
      beat: 0,
    });
  });

  it("jumps to last style", () => {
    const result = jumpStyle(registry, "gamma-style");
    expect(result).toEqual({
      styleId: "gamma-style",
      topicId: "topic-1",
      scene: 1,
      beat: 0,
    });
  });

  it("returns null for non-existent style id", () => {
    const result = jumpStyle(registry, "missing-style");
    expect(result).toBeNull();
  });

  it("returns null for empty string id", () => {
    const result = jumpStyle(registry, "");
    expect(result).toBeNull();
  });
});

// ─── jumpTopic ────────────────────────────────────────────────────────────

describe("jumpTopic", () => {
  const multiTopicRegistry: RuntimeStyleGroup[] = [
    makeStyle("alpha-style", [1, 1, 1, 1, 1], 3),
  ];

  it("jumps to a specific topic", () => {
    const result = jumpTopic(multiTopicRegistry, "alpha-style", "topic-2");
    expect(result).toEqual({
      styleId: "alpha-style",
      topicId: "topic-2",
      scene: 1,
      beat: 0,
    });
  });

  it("returns null for non-existent topic", () => {
    const result = jumpTopic(multiTopicRegistry, "alpha-style", "missing-topic");
    expect(result).toBeNull();
  });

  it("returns null for non-existent style", () => {
    const result = jumpTopic(multiTopicRegistry, "missing-style", "topic-1");
    expect(result).toBeNull();
  });
});

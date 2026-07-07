import { describe, expect, it } from "vitest";
import {
  findTopic,
  getNextTopic,
  STYLE_REGISTRY,
} from "./registry";

describe("STYLE_REGISTRY topic catalog", () => {
  it("uses semantic style IDs instead of sequence numbers", () => {
    expect(STYLE_REGISTRY[0]?.id).toBe("minimal-product-keynote");
    expect(STYLE_REGISTRY.some((entry) => entry.id === "01")).toBe(false);
  });

  it("uses topic IDs instead of v1/v2 version IDs", () => {
    const firstStyle = STYLE_REGISTRY[0];

    expect(firstStyle?.topics.map((topic) => topic.id)).toEqual([
      "product-keynote",
      "quiet-launch",
    ]);
    expect(
      STYLE_REGISTRY.flatMap((style) => style.topics).some((topic) =>
        /^v\d+$/.test(topic.id)
      ),
    ).toBe(false);
  });

  it("finds topics by style slug and topic slug", () => {
    const topic = findTopic("minimal-product-keynote", "quiet-launch");

    expect(topic?.styleId).toBe("minimal-product-keynote");
    expect(topic?.topicId).toBe("quiet-launch");
  });

  it("keeps topic-aware navigation order inside each style", () => {
    const next = getNextTopic("minimal-product-keynote", "product-keynote");

    expect(next.styleId).toBe("minimal-product-keynote");
    expect(next.topicId).toBe("quiet-launch");
  });

  it("registers Engineering Whiteboard Explainer after Signal Pipeline Flow", () => {
    const ids = STYLE_REGISTRY.map((entry) => entry.id);
    const signalIndex = ids.indexOf("signal-pipeline-flow");
    const whiteboardIndex = ids.indexOf("engineering-whiteboard-explainer");

    expect(signalIndex).toBeGreaterThanOrEqual(0);
    expect(whiteboardIndex).toBe(signalIndex + 1);
    expect(STYLE_REGISTRY[whiteboardIndex].topics.map((topic) => topic.id)).toEqual([
      "from-prompt-to-patch",
    ]);
  });
});

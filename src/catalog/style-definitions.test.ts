import { describe, expect, it } from "vitest";
import { validateStyleDefinitions, validateTopicRegistry } from "./topic-catalog";
import { TOPIC_REGISTRY } from "./topic-registry";
import { STYLE_DEFINITIONS } from "./style-definitions";

describe("STYLE_DEFINITIONS", () => {
  it("defines every Style used by the sole Topic Registry without introducing an ordering map", () => {
    const styleGroups = validateTopicRegistry(STYLE_DEFINITIONS, TOPIC_REGISTRY);

    expect(() => validateStyleDefinitions(STYLE_DEFINITIONS)).not.toThrow();
    expect(new Set(styleGroups.map((group) => group.style.id))).toEqual(
      new Set(Object.keys(STYLE_DEFINITIONS)),
    );
  });
});

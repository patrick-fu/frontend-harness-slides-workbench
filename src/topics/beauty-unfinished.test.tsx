import { describe, expect, it } from "vitest";
import { runTopicContract } from "../testing/topic-contract";
import topic from "./beauty-unfinished";

runTopicContract(topic);

describe("Beauty Unfinished protocol", () => {
  it("keeps envelope navigation and its authored transition score", () => {
    expect(topic).toMatchObject({
      id: "beauty-unfinished",
      styleId: "wabi-sabi-ceramic",
      title: { en: "The Beauty of the Unfinished", zh: "未完成之美" },
      modelId: "Claude Opus 4.8",
      navigation: { mode: "none" },
      transitionScore: {
        "1->2": "fade",
        "2->3": "fade",
        "3->4": "slide-x",
        "4->5": "fade",
      },
      evidence: { kind: "illustrative", display: "envelope" },
    });
  });
});

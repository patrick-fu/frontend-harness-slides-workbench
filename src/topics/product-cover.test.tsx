import { describe, expect, it } from "vitest";
import { runTopicContract } from "../testing/topic-contract";
import topic from "./product-cover";

runTopicContract(topic);

describe("Product Cover protocol", () => {
  it("retains its identity, issue-strip navigation, transition score, and evidence state", () => {
    expect(topic).toMatchObject({
      id: "product-cover",
      styleId: "magazine-masthead",
      title: { en: "Product Cover", zh: "产品封面" },
      modelId: "GPT 5.5",
      navigation: {
        geometry: "typographic-index",
        carrier: "product-cover-issue-strip",
        invocation: "persistent",
        feedback: "typographic-emphasis",
      },
      transitionScore: {
        "1->2": "scale-fade",
        "2->3": "page-flip",
        "3->4": "slide-x",
        "4->5": "fade",
      },
      evidence: { kind: "none" },
    });
  });

  it("keeps its bilingual issue pages on the 3/3/3/3/2 beat curve", () => {
    expect(topic.metadata.en.scenes.map((scene) => scene.beats.length)).toEqual([
      3, 3, 3, 3, 2,
    ]);
    expect(topic.metadata.zh.scenes.map((scene) => scene.beats.length)).toEqual([
      3, 3, 3, 3, 2,
    ]);
  });
});

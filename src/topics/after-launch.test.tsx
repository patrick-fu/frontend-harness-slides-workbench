import { describe, expect, it } from "vitest";
import { runTopicContract } from "../testing/topic-contract";
import topic from "./after-launch";

runTopicContract(topic);

describe("After Launch protocol", () => {
  it("retains its identity, folio navigation, transition score, and evidence state", () => {
    expect(topic).toMatchObject({
      id: "after-launch",
      styleId: "front-page-broadsheet",
      title: { en: "After Launch", zh: "发布翌日" },
      modelId: "GPT 5.5",
      navigation: {
        geometry: "typographic-index",
        carrier: "launch-folio-navigation",
        invocation: "persistent",
        feedback: "typographic-emphasis",
      },
      transitionScore: {
        "1->2": "page-flip",
        "2->3": "slide-y",
        "3->4": "wipe",
        "4->5": "fade",
      },
      evidence: { kind: "none" },
    });
  });

  it("keeps the bilingual five-scene folio curve aligned", () => {
    expect(topic.metadata.en.scenes.map((scene) => scene.beats.length)).toEqual([
      3, 3, 3, 3, 3,
    ]);
    expect(topic.metadata.zh.scenes.map((scene) => scene.beats.length)).toEqual([
      3, 3, 3, 3, 3,
    ]);
  });
});

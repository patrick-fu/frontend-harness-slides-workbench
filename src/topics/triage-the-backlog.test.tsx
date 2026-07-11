import { describe, expect, it } from "vitest";
import { runTopicContract } from "../testing/topic-contract";
import topic from "./triage-the-backlog";

runTopicContract(topic);

describe("Triage the Backlog protocol", () => {
  it("keeps its authored identity, lane navigation, authored edges, and illustrative boundary", () => {
    expect(topic).toMatchObject({
      id: "triage-the-backlog",
      styleId: "mechanical-scoring-funnel",
      title: { en: "Triage the Backlog", zh: "需求分拣" },
      modelId: "Claude Opus 4.8",
      navigation: {
        geometry: "spatial-node",
        carrier: "backlog-stage-lanes",
        invocation: "drag-scrub",
        feedback: "history-trail",
      },
      transitionScore: {
        "1->2": "slide-y",
        "2->3": "slide-y",
        "3->4": "slide-y",
        "4->5": "scale-fade",
      },
      evidence: { kind: "illustrative", display: "envelope" },
    });
  });

  it("keeps bilingual scene and beat identifiers aligned", () => {
    expect(topic.metadata.en.scenes.map((scene) => scene.beats.length)).toEqual(
      topic.metadata.zh.scenes.map((scene) => scene.beats.length),
    );
  });
});

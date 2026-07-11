import { describe, expect, it } from "vitest";
import { runTopicContract } from "../testing/topic-contract";
import topic from "./handoff-box";

runTopicContract(topic);

describe("Handoff Box protocol", () => {
  it("retains its authored identity, navigation, and transitions", () => {
    expect(topic.title).toEqual({ en: "Handoff Box", zh: "交接盒" });
    expect(topic.modelId).toBe("GPT 5.5");
    expect(topic.navigation).toEqual({
      geometry: "card-miniature",
      carrier: "handoff-compartment-selector",
      invocation: "persistent",
      feedback: "material-color-change",
    });
    expect(topic.transitionScore).toEqual({
      "1->2": "scale-fade",
      "2->3": "wipe",
      "3->4": "slide-x",
      "4->5": "fade",
    });
  });
});

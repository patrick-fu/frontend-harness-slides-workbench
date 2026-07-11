import { createElement } from "react";
import { defineTopic, type TopicDefinition } from "../domain/topic";
import type { ModelId } from "../domain/model";

export function makeTopicDefinition({
  id,
  styleId,
  modelId = "GPT 5.5",
}: {
  id: string;
  styleId: string;
  modelId?: ModelId;
}): TopicDefinition {
  const scenes = Array.from({ length: 5 }, (_, index) => ({
    id: index + 1,
    title: `Scene ${index + 1}`,
    beats: [
      {
        id: 0,
        action: "reveal",
        title: `Beat ${index + 1}`,
        body: "Known fixture copy.",
      },
    ],
  }));
  const metadata = {
    theme: "Known fixture theme",
    densityLabel: "Sparse",
    heroScene: 1,
    colors: { bg: "#fff", ink: "#111", panel: "#eee" },
    typography: { header: "Inter", body: "Inter" },
    tags: ["fixture"],
    fonts: ["Inter"],
    scenes,
  };

  function TopicStage() {
    return createElement("div", { "data-fixture-stage": "true" });
  }

  return defineTopic({
    id,
    styleId,
    title: { en: `${id} title`, zh: `${id} 标题` },
    modelId,
    Stage: TopicStage,
    metadata: { en: metadata, zh: metadata },
    navigation: { mode: "none" },
    transitionScore: {
      "1->2": "hard-cut",
      "2->3": "hard-cut",
      "3->4": "hard-cut",
      "4->5": "hard-cut",
    },
    evidence: { kind: "none" },
  });
}

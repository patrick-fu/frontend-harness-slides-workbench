import { describe, expect, it } from "vitest";
import { defineTopic } from "./topic";

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
  return null;
}

function validTopic() {
  return {
    id: "known-topic",
    styleId: "known-style",
    title: { en: "Known Topic", zh: "已知题材" },
    modelId: "GPT 5.5" as const,
    Stage: TopicStage,
    metadata: { en: metadata, zh: metadata },
    navigation: { mode: "none" as const },
    transitionScore: {
      "1->2": "hard-cut" as const,
      "2->3": "hard-cut" as const,
      "3->4": "hard-cut" as const,
      "4->5": "hard-cut" as const,
    },
    evidence: { kind: "none" as const },
  };
}

describe("defineTopic", () => {
  it("accepts one complete model-neutral Topic definition", () => {
    const topic = validTopic();

    expect(defineTopic(topic)).toBe(topic);
  });

  it("rejects a Model ID spelling that is not in the canonical registry", () => {
    expect(() =>
      defineTopic({
        ...validTopic(),
        modelId: "GPT-5.5",
      } as never),
    ).toThrow('Topic "known-topic" uses unknown Model ID "GPT-5.5".');
  });

  it("rejects a Topic ID that is not a semantic kebab-case identifier", () => {
    expect(() =>
      defineTopic({
        ...validTopic(),
        id: "01 Known Topic",
      }),
    ).toThrow(
      'Invalid Topic ID "01 Known Topic". Use semantic kebab-case without structural ordinals.',
    );
  });

  it("rejects bilingual metadata whose Scene and Beat structure diverges", () => {
    expect(() =>
      defineTopic({
        ...validTopic(),
        metadata: {
          en: metadata,
          zh: {
            ...metadata,
            scenes: metadata.scenes.map((scene, index) =>
              index === 0
                ? { ...scene, beats: [{ ...scene.beats[0], id: 1 }] }
                : scene,
            ),
          },
        },
      }),
    ).toThrow(
      'Topic "known-topic" metadata must use identical English and Chinese Scene and Beat IDs.',
    );
  });

  it("rejects factual Evidence without a traceable Source", () => {
    expect(() =>
      defineTopic({
        ...validTopic(),
        evidence: { kind: "facts", sources: [] },
      }),
    ).toThrow('Topic "known-topic" factual Evidence requires a Source.');
  });

  it.each([
    {
      name: "an empty localized title",
      topic: () => ({
        ...validTopic(),
        title: { en: "Known Topic", zh: "" },
      }),
      message: 'Topic "known-topic" requires non-empty English and Chinese titles.',
    },
    {
      name: "a non-semantic Style ID",
      topic: () => ({ ...validTopic(), styleId: "Known Style" }),
      message: 'Topic "known-topic" uses invalid Style ID "Known Style".',
    },
    {
      name: "fewer than five Scenes",
      topic: () => ({
        ...validTopic(),
        metadata: {
          en: { ...metadata, scenes: metadata.scenes.slice(0, 4) },
          zh: { ...metadata, scenes: metadata.scenes.slice(0, 4) },
        },
      }),
      message: 'Topic "known-topic" metadata must define exactly five Scenes.',
    },
    {
      name: "an incomplete transition score",
      topic: () => {
        const { ["4->5"]: _omitted, ...transitionScore } =
          validTopic().transitionScore;
        return { ...validTopic(), transitionScore };
      },
      message: 'Topic "known-topic" transitionScore must define all four Scene edges.',
    },
    {
      name: "an invalid visible navigation carrier",
      topic: () => ({
        ...validTopic(),
        navigation: {
          geometry: "path",
          carrier: "Visible Carrier",
          invocation: "persistent",
          feedback: "active-glow",
        },
      }),
      message: 'Topic "known-topic" navigation carrier must be semantic kebab-case.',
    },
    {
      name: "an empty illustrative boundary",
      topic: () => ({
        ...validTopic(),
        evidence: {
          kind: "illustrative",
          boundary: { en: "", zh: "示例" },
          display: "envelope",
        },
      }),
      message: 'Topic "known-topic" illustrative Evidence requires a bilingual boundary.',
    },
  ])("rejects $name", ({ topic, message }) => {
    expect(() => defineTopic(topic() as never)).toThrow(message);
  });
});

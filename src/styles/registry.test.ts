import { describe, expect, it } from "vitest";
import {
  findTopic,
  getNextTopic,
  STYLE_REGISTRY,
} from "./registry";
import {
  CURATED_TOPIC_CONTRACTS,
  CURATED_TOPIC_SET_ID,
} from "./curated-topic-contract";

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
      "presolar-grain",
      "last-feature-cut",
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
      "water-tower",
      "tcp-congestion-control",
    ]);
  });

  it("uses the normalized model ID for the legacy GPT 5.5 Topic set", () => {
    const models = STYLE_REGISTRY.flatMap((style) =>
      style.topics.map((topic) => topic.model),
    );

    expect(models).toContain("GPT 5.5");
    expect(models).not.toContain("GPT-5");
  });

  it("exposes the complete curated Topic Set with its confirmed model ID", () => {
    const curated = STYLE_REGISTRY.flatMap((style) =>
      style.topics
        .filter((topic) => topic.topicSet === CURATED_TOPIC_SET_ID)
        .map((topic) => ({ styleId: style.id, topic })),
    );

    expect(curated).toHaveLength(CURATED_TOPIC_CONTRACTS.length);
    expect(curated.map(({ topic }) => topic.model)).toEqual(
      Array(CURATED_TOPIC_CONTRACTS.length).fill("Claude Opus 4.8"),
    );
    expect(
      new Set(curated.map(({ styleId, topic }) => `${styleId}/${topic.id}`)),
    ).toEqual(
      new Set(
        CURATED_TOPIC_CONTRACTS.map(
          (contract) => `${contract.styleId}/${contract.topicId}`,
        ),
      ),
    );
  });

  it("registers the complete coordinated Topic Set plus curated", () => {
    expect(findTopic("interactive-dialogue-stage", "vocal-folds")).toBeDefined();
    expect(findTopic("cyanotype-drafting-table", "comet-anatomy")).toBeDefined();
    expect(findTopic("kinetic-type-punchline", "before-a")).toBeDefined();
    expect(findTopic("sketch-board-emoji", "stadium-wave")).toBeDefined();
    expect(
      findTopic("engineering-whiteboard-explainer", "water-tower"),
    ).toBeDefined();
    expect(findTopic("front-page-broadsheet", "rogue-wave")).toBeDefined();
    expect(findTopic("scholars-vellum", "hidden-text")).toBeDefined();
    expect(findTopic("botanical-specimen-plate", "leaf-stomata")).toBeDefined();
    expect(findTopic("expedition-screenprint", "saharan-dust")).toBeDefined();
    expect(findTopic("red-wedge-agitprop", "pneumatic-post")).toBeDefined();
    expect(findTopic("retro-windows", "voyager-boundary")).toBeDefined();
    expect(findTopic("after-hours-luxe", "urushi-cure")).toBeDefined();
    expect(findTopic("minimal-product-keynote", "presolar-grain")).toBeDefined();
    expect(
      findTopic("mechanical-scoring-funnel", "snowflake-branches"),
    ).toBeDefined();
    expect(findTopic("research-memo", "impact-evidence")).toBeDefined();
    expect(findTopic("operating-manual", "escapement")).toBeDefined();
    expect(findTopic("widescreen-title-card", "whale-fall")).toBeDefined();
    expect(findTopic("object-metaphor-hero", "cocoon-to-cloth")).toBeDefined();
    expect(findTopic("blackboard-chalk-talk", "hearing-path")).toBeDefined();
    expect(findTopic("liquid-glass", "safety-glass")).toBeDefined();
    expect(findTopic("subway-map-of-intent", "tea-cha-routes")).toBeDefined();
    expect(findTopic("mid-century-grove", "monarch-migration")).toBeDefined();
    expect(findTopic("kitchen-prep-station", "cocoa-fermentation")).toBeDefined();
    expect(findTopic("soft-pastel-friendly", "chrysalis-rebuild")).toBeDefined();
    expect(findTopic("maintainer-issue-brief", "ozone-hole")).toBeDefined();
    expect(findTopic("studio-mixing-console", "tidal-time")).toBeDefined();
    expect(findTopic("duotone-session", "dance-notation")).toBeDefined();
    expect(findTopic("signal-pipeline-flow", "district-heat")).toBeDefined();
    expect(findTopic("wabi-sabi-ceramic", "stone-to-soil")).toBeDefined();
    expect(findTopic("solar-biennale-poster", "iron-from-stars")).toBeDefined();
    expect(findTopic("warm-editorial-feature", "oral-to-written")).toBeDefined();
    expect(findTopic("spotlight-quote-poster", "freedive")).toBeDefined();
    expect(findTopic("benchmark-matrix", "natural-clocks")).toBeDefined();
    expect(
      findTopic("collaborative-pairing-board", "elevator-counterweight"),
    ).toBeDefined();
    expect(findTopic("debug-reaction-board", "acoustic-crack")).toBeDefined();
    expect(findTopic("magazine-masthead", "moth-experiment")).toBeDefined();
    expect(
      findTopic("machine-age-deco", "reinforced-concrete"),
    ).toBeDefined();
    expect(findTopic("neo-brutalist-bulletin", "sinking-delta")).toBeDefined();
    expect(findTopic("field-notes-report", "ancient-sound")).toBeDefined();
    expect(findTopic("annotated-source-diff", "reading-rosetta")).toBeDefined();
    expect(
      findTopic("checklist-ledger", "pigment-without-touch"),
    ).toBeDefined();
    expect(findTopic("decision-record", "standard-time")).toBeDefined();
    expect(
      findTopic("cassette-era-packaging", "ice-core-archive"),
    ).toBeDefined();
    expect(findTopic("arcade-boss-fight", "egg-mimicry")).toBeDefined();
    expect(findTopic("context-bento-box", "lichen-partners")).toBeDefined();
    expect(findTopic("riso-print-zine", "seven-blues")).toBeDefined();
    expect(findTopic("objective-swiss-grid", "bridge-movement")).toBeDefined();
    expect(
      findTopic("woodblock-floating-world", "whistled-language"),
    ).toBeDefined();
    expect(
      findTopic("analog-cutout-collage", "concealed-objects"),
    ).toBeDefined();
    expect(
      getNextTopic("analog-cutout-collage", "rebuilt-archive").topicId,
    ).toBe("concealed-objects");
  });
});

import {
  hasVisibleTopicNavigation,
  type TopicEvidence,
  type TopicNavigation,
  type TopicNavigationProfile,
  type TopicTransitionScore,
} from "../types";
import type { StyleTopicModule } from "./topic";

/** A semantic collection label, deliberately separate from version identifiers. */
export const CURATED_TOPIC_SET_ID = "curated";
export const CURATED_TOPIC_MODEL = "Claude Opus 4.8";

/** Canonical localized Style names shared by every Topic in this collection. */
export const CURATED_STYLE_NAMES: Readonly<
  Record<string, { en: string; zh: string }>
> = {
  "minimal-product-keynote": { en: "Minimal Product Keynote", zh: "极简产品主题演讲" },
  "objective-swiss-grid": { en: "Objective Swiss Grid", zh: "客观瑞士网格" },
  "wabi-sabi-ceramic": { en: "Wabi-Sabi Ceramic", zh: "侘寂陶器" },
  "interactive-dialogue-stage": { en: "Interactive Dialogue Stage", zh: "互动对话舞台" },
  "cyanotype-drafting-table": { en: "Cyanotype Drafting Table", zh: "蓝图制图台" },
  "kinetic-type-punchline": { en: "Kinetic Type Punchline", zh: "动感字体金句" },
  "sketch-board-emoji": { en: "Sketch Board Emoji", zh: "草图白板表情" },
  "spotlight-quote-poster": { en: "Spotlight Quote Poster", zh: "聚光引言海报" },
  "subway-map-of-intent": { en: "Subway Map of Intent", zh: "意图地铁图" },
  "benchmark-matrix": { en: "Benchmark Matrix", zh: "基准矩阵" },
  "signal-pipeline-flow": { en: "Signal Pipeline Flow", zh: "信号管道流" },
  "soft-pastel-friendly": { en: "Soft Pastel Friendly", zh: "柔和粉彩友好" },
  "kitchen-prep-station": { en: "Kitchen Prep Station", zh: "厨房备料台" },
  "collaborative-pairing-board": { en: "Collaborative Pairing Board", zh: "协作配对板" },
  "studio-mixing-console": { en: "Studio Mixing Console", zh: "录音混音控制台" },
  "debug-reaction-board": { en: "Debug Reaction Board", zh: "调试反应面板" },
  "front-page-broadsheet": { en: "Front-Page Broadsheet", zh: "头版大报" },
  "magazine-masthead": { en: "Magazine Masthead", zh: "杂志刊头" },
  "warm-editorial-feature": { en: "Warm Editorial Feature", zh: "暖色专题特稿" },
  "scholars-vellum": { en: "Scholar's Vellum", zh: "学者羊皮卷" },
  "solar-biennale-poster": { en: "Solar Biennale Poster", zh: "日光双年展海报" },
  "duotone-session": { en: "Duotone Session", zh: "双调录制" },
  "riso-print-zine": { en: "Riso Print Zine", zh: "孔版印刷杂志" },
  "analog-cutout-collage": { en: "Analog Cutout Collage", zh: "模拟剪纸拼贴" },
  "woodblock-floating-world": { en: "Woodblock Floating-World", zh: "木版浮世绘" },
  "botanical-specimen-plate": { en: "Botanical Specimen Plate", zh: "植物标本板" },
  "machine-age-deco": { en: "Machine-Age Deco", zh: "机器时代装饰艺术" },
  "expedition-screenprint": { en: "Expedition Screenprint", zh: "探险丝网印" },
  "cassette-era-packaging": { en: "Cassette-Era Packaging", zh: "卡带时代包装" },
  "neo-brutalist-bulletin": { en: "Neo-Brutalist Bulletin", zh: "新粗野公告" },
  "red-wedge-agitprop": { en: "Red-Wedge Agitprop", zh: "红楔宣传画" },
  "mechanical-scoring-funnel": { en: "Mechanical Scoring Funnel", zh: "机械评分漏斗" },
  "liquid-glass": { en: "Liquid Glass", zh: "液态玻璃" },
  "retro-windows": { en: "Retro Windows", zh: "复古 Windows" },
  "mid-century-grove": { en: "Mid-Century Grove", zh: "中世纪林间" },
  "after-hours-luxe": { en: "After-Hours Luxe", zh: "深夜奢华" },
  "operating-manual": { en: "Operating Manual", zh: "操作手册" },
  "widescreen-title-card": { en: "Widescreen Title Card", zh: "宽屏标题卡" },
  "blackboard-chalk-talk": { en: "Blackboard Chalk Talk", zh: "粉笔推导" },
  "arcade-boss-fight": { en: "Arcade Boss Fight", zh: "街机 Boss 战" },
  "research-memo": { en: "Research Memo", zh: "研究备忘录" },
  "decision-record": { en: "Decision Record", zh: "决策记录" },
  "maintainer-issue-brief": { en: "Maintainer Issue Brief", zh: "维护者问题简报" },
  "field-notes-report": { en: "Field Notes Report", zh: "田野笔记" },
  "annotated-source-diff": { en: "Annotated Source & Diff", zh: "注解源码与差异" },
  "checklist-ledger": { en: "Checklist Ledger", zh: "检查清单台账" },
  "context-bento-box": { en: "Context Bento Box", zh: "上下文便当盒" },
  "object-metaphor-hero": { en: "Object Metaphor Hero", zh: "物体主视觉" },
};

export interface CuratedTopicContract {
  styleId: string;
  topicId: string;
  navigation: TopicNavigation;
  transitionScore: Readonly<TopicTransitionScore>;
  evidence: TopicEvidence;
}

const illustrative = (
  boundary: { en: string; zh: string },
  display?: "envelope" | "stage",
): Extract<TopicEvidence, { kind: "illustrative" }> => ({
  kind: "illustrative",
  boundary,
  ...(display ? { display } : {}),
});

const ILLUSTRATIVE_SCENARIO = illustrative({
  en: "Illustrative scenario: names, figures, and outcomes are presentation examples, not external factual claims.",
  zh: "示例场景：其中名称、数字和结果均为演示内容，并非外部事实主张。",
});

export const SYNTHETIC_CHURN_DATASET_EVIDENCE = illustrative(
  {
    en: "Illustrative synthetic dataset: all cohort sizes, rates, ratios, and recommendations in this Topic are examples, not measured outcomes.",
    zh: "示例合成数据集：本 Topic 中的所有群组规模、比率、倍率和建议均为示例，并非实测结果。",
  },
  "stage",
);

const nav = (
  geometry: TopicNavigationProfile["geometry"],
  carrier: string,
  invocation: TopicNavigationProfile["invocation"],
  feedback: TopicNavigationProfile["feedback"],
): TopicNavigationProfile => ({ geometry, carrier, invocation, feedback });

const score = (
  oneToTwo: TopicTransitionScore["1->2"],
  twoToThree: TopicTransitionScore["2->3"],
  threeToFour: TopicTransitionScore["3->4"],
  fourToFive: TopicTransitionScore["4->5"],
): TopicTransitionScore => ({
  "1->2": oneToTwo,
  "2->3": twoToThree,
  "3->4": threeToFour,
  "4->5": fourToFive,
});

const curated = (
  styleId: string,
  topicId: string,
  navigation: TopicNavigation,
  transitionScore: TopicTransitionScore,
  evidence: TopicEvidence = ILLUSTRATIVE_SCENARIO,
): CuratedTopicContract => ({
  styleId,
  topicId,
  navigation,
  transitionScore,
  evidence,
});

/**
 * The auditable authored contract for the curated Topic Set. It is keyed by
 * semantic style/topic IDs rather than catalog position, so adding a Topic
 * cannot silently retarget another Topic's navigation or transition score.
 */
export const CURATED_TOPIC_CONTRACTS = [
  curated("minimal-product-keynote", "last-feature-cut", nav("typographic-index", "feature-cut-whisper", "persistent", "active-glow"), score("scale-fade", "fade", "scale-fade", "fade")),
  curated("objective-swiss-grid", "anatomy-timetable", nav("spatial-node", "timetable-coordinate-marker", "persistent", "history-trail"), score("hard-cut", "slide-y", "hard-cut", "slide-y")),
  curated("wabi-sabi-ceramic", "beauty-unfinished", { mode: "none" }, score("fade", "fade", "slide-x", "fade")),
  curated("interactive-dialogue-stage", "rubber-duck", nav("spatial-node", "duck-turn-stepper", "persistent", "next-state-preview"), score("slide-y", "slide-y", "fade", "scale-fade")),
  curated("cyanotype-drafting-table", "drawing-a-bridge", nav("edge-scale", "bridge-revision-index", "persistent", "mechanical-displacement"), score("wipe", "wipe", "slide-x", "hard-cut")),
  curated("kinetic-type-punchline", "ship-it", { mode: "none" }, score("hard-cut", "glitch", "hard-cut", "glitch")),
  curated("sketch-board-emoji", "how-we-named-it", nav("path", "naming-connector-trail", "persistent", "geometry-reflow"), score("slide-x", "slide-x", "scale-fade", "scale-fade")),
  curated("spotlight-quote-poster", "on-quitting-well", nav("ambient", "quitting-folio-glow", "persistent", "material-color-change"), score("fade", "fade", "scale-fade", "fade")),

  curated("subway-map-of-intent", "three-teams-launch", nav("path", "launch-route-line", "persistent", "typographic-emphasis"), score("slide-x", "slide-x", "scale-fade", "slide-x")),
  curated("benchmark-matrix", "build-buy-borrow", nav("edge-scale", "decision-dot-row", "auto-hide", "active-glow"), score("slide-y", "slide-y", "fade", "scale-fade")),
  curated("signal-pipeline-flow", "where-request-goes", nav("path", "request-stage-stepper", "auto-hide", "history-trail"), score("slide-x", "slide-x", "glitch", "fade")),
  curated("soft-pastel-friendly", "first-week-here", nav("object-controller", "week-day-picker", "auto-hide", "next-state-preview"), score("scale-fade", "slide-y", "slide-y", "scale-fade")),
  curated("kitchen-prep-station", "raw-logs-to-report", nav("path", "report-recipe-rail", "auto-hide", "mechanical-displacement"), score("wipe", "wipe", "slide-x", "scale-fade")),
  curated("collaborative-pairing-board", "human-reviews-ai", nav("edge-scale", "review-seam-tabs", "auto-hide", "geometry-reflow"), score("slide-x", "slide-x", "fade", "scale-fade")),
  curated("studio-mixing-console", "tuning-the-model", nav("object-controller", "model-channel-selector", "auto-hide", "material-color-change"), score("slide-y", "slide-y", "hard-cut", "fade")),
  curated("debug-reaction-board", "safe-to-deploy", nav("typographic-index", "deploy-status-ticks", "auto-hide", "typographic-emphasis"), score("hard-cut", "hard-cut", "slide-x", "glitch")),

  curated("front-page-broadsheet", "day-feed-stopped", nav("typographic-index", "feed-page-spine", "proximity-reveal", "active-glow"), score("page-flip", "slide-y", "slide-y", "page-flip")),
  curated("magazine-masthead", "comeback-issue", nav("typographic-index", "comeback-issue-spine", "proximity-reveal", "history-trail"), score("page-flip", "scale-fade", "page-flip", "fade")),
  curated("warm-editorial-feature", "letter-to-past-self", nav("ambient", "past-self-folio", "proximity-reveal", "next-state-preview"), score("fade", "fade", "slide-x", "fade")),
  curated("scholars-vellum", "what-ancients-knew", nav("typographic-index", "ancients-folio-counter", "proximity-reveal", "mechanical-displacement"), score("fade", "hard-cut", "hard-cut", "fade")),
  curated("solar-biennale-poster", "festival-slow-ideas", nav("typographic-index", "festival-mono-folio", "proximity-reveal", "geometry-reflow"), score("scale-fade", "fade", "fade", "scale-fade")),
  curated("duotone-session", "cut-in-one-take", nav("typographic-index", "one-take-track-index", "proximity-reveal", "material-color-change"), score("slide-y", "hard-cut", "slide-y", "hard-cut")),
  curated("riso-print-zine", "make-something-weekly", nav("typographic-index", "weekly-ink-seal", "proximity-reveal", "typographic-emphasis"), score("page-flip", "hard-cut", "page-flip", "hard-cut")),
  curated("analog-cutout-collage", "piecing-idea-together", nav("spatial-node", "collage-pin-pricks", "click-expand", "active-glow"), score("slide-x", "scale-fade", "slide-x", "scale-fade")),

  curated("woodblock-floating-world", "a-rivers-journey", nav("path", "river-horizon-boat", "click-expand", "history-trail"), score("slide-x", "slide-x", "slide-x", "fade")),
  curated("botanical-specimen-plate", "anatomy-of-an-idea", nav("typographic-index", "idea-plate-numerals", "click-expand", "next-state-preview"), score("page-flip", "fade", "fade", "page-flip")),
  curated("machine-age-deco", "grand-unveiling", nav("object-controller", "unveiling-gate-dial", "click-expand", "mechanical-displacement"), score("scale-fade", "scale-fade", "slide-y", "scale-fade")),
  curated("expedition-screenprint", "mapping-unknown-ground", nav("edge-scale", "expedition-altitude-scale", "click-expand", "geometry-reflow"), score("slide-x", "slide-y", "slide-x", "fade")),
  curated("cassette-era-packaging", "greatest-hits-vol1", nav("typographic-index", "cassette-tape-counter", "click-expand", "material-color-change"), score("hard-cut", "slide-y", "slide-y", "hard-cut")),
  curated("neo-brutalist-bulletin", "read-before-merge", nav("card-miniature", "merge-page-chips", "click-expand", "typographic-emphasis"), score("hard-cut", "slide-x", "hard-cut", "slide-x")),
  curated("red-wedge-agitprop", "refactor-the-system", nav("path", "refactor-progress-wedge", "drag-scrub", "active-glow"), score("glitch", "hard-cut", "glitch", "hard-cut")),
  curated("mechanical-scoring-funnel", "triage-the-backlog", nav("spatial-node", "backlog-stage-lanes", "drag-scrub", "history-trail"), score("slide-y", "slide-y", "slide-y", "scale-fade")),

  curated("liquid-glass", "layers-of-a-product", nav("object-controller", "product-layer-stack", "drag-scrub", "next-state-preview"), score("fade", "scale-fade", "scale-fade", "fade")),
  curated("retro-windows", "setup-exe", nav("edge-scale", "setup-wizard-controls", "drag-scrub", "mechanical-displacement"), score("hard-cut", "hard-cut", "glitch", "hard-cut")),
  curated("mid-century-grove", "growing-slowly-on-purpose", nav("ambient", "grove-rust-mark", "drag-scrub", "geometry-reflow"), score("fade", "slide-y", "slide-y", "fade")),
  curated("after-hours-luxe", "the-midnight-release", nav("ambient", "midnight-hairline-index", "drag-scrub", "material-color-change"), score("fade", "scale-fade", "fade", "fade")),
  curated("operating-manual", "rotate-the-secrets", nav("typographic-index", "rotation-command-status", "drag-scrub", "typographic-emphasis"), score("hard-cut", "slide-y", "slide-y", "hard-cut")),
  curated("widescreen-title-card", "chapter-zero", { mode: "none" }, score("fade", "scale-fade", "fade", "fade")),
  curated("blackboard-chalk-talk", "deriving-big-o", nav("typographic-index", "chalk-step-line", "keyboard-focus", "active-glow"), score("wipe", "wipe", "wipe", "fade")),
  curated("arcade-boss-fight", "defeating-tech-debt", nav("edge-scale", "arcade-stage-hud", "keyboard-focus", "history-trail"), score("glitch", "hard-cut", "glitch", "hard-cut")),

  curated("research-memo", "why-users-churn", nav("typographic-index", "churn-section-spine", "keyboard-focus", "next-state-preview"), score("fade", "slide-y", "slide-y", "fade"), SYNTHETIC_CHURN_DATASET_EVIDENCE),
  curated("decision-record", "why-we-chose-monorepo", nav("path", "monorepo-decision-stepper", "keyboard-focus", "mechanical-displacement"), score("slide-x", "slide-x", "fade", "scale-fade")),
  curated("maintainer-issue-brief", "flaky-test-root-cause", nav("typographic-index", "flaky-ticket-status", "keyboard-focus", "geometry-reflow"), score("hard-cut", "slide-y", "slide-x", "hard-cut")),
  curated("field-notes-report", "shadowing-support", nav("typographic-index", "support-notebook-folio", "keyboard-focus", "material-color-change"), score("page-flip", "slide-y", "slide-y", "page-flip")),
  curated("annotated-source-diff", "killing-a-god-object", nav("edge-scale", "god-object-diff-toggle", "keyboard-focus", "typographic-emphasis"), score("slide-y", "slide-y", "wipe", "slide-y")),
  curated("checklist-ledger", "close-the-quarter", nav("edge-scale", "quarter-close-meter", "gesture-hold", "active-glow"), score("slide-y", "slide-y", "fade", "hard-cut")),
  curated("context-bento-box", "everything-the-intern-needs", nav("object-controller", "intern-bento-selector", "gesture-hold", "history-trail"), score("scale-fade", "scale-fade", "fade", "scale-fade")),
  curated("object-metaphor-hero", "onboarding-toolkit", nav("object-controller", "onboarding-kit-slots", "gesture-hold", "next-state-preview"), score("page-flip", "scale-fade", "fade", "scale-fade")),
] as const satisfies readonly CuratedTopicContract[];

function findContract(styleId: string, topicId: string): CuratedTopicContract {
  const contract = CURATED_TOPIC_CONTRACTS.find(
    (candidate) =>
      candidate.styleId === styleId && candidate.topicId === topicId,
  );
  if (!contract) {
    throw new Error(
      `Missing curated Topic contract for "${styleId}/${topicId}".`,
    );
  }
  return contract;
}

export function hasCuratedTopicContract(
  styleId: string,
  topicId: string,
): boolean {
  return CURATED_TOPIC_CONTRACTS.some(
    (contract) =>
      contract.styleId === styleId && contract.topicId === topicId,
  );
}

/** Adds the contract at the catalog seam while retaining the Topic module as its author. */
export function withCuratedTopicContract(
  styleId: string,
  topic: StyleTopicModule,
): StyleTopicModule {
  const contract = findContract(styleId, topic.id);
  if (topic.model !== CURATED_TOPIC_MODEL) {
    throw new Error(
      `${styleId}/${topic.id} must declare model "${CURATED_TOPIC_MODEL}" in its Topic module.`,
    );
  }
  return {
    ...topic,
    topicSet: CURATED_TOPIC_SET_ID,
    navigation: contract.navigation,
    evidence: contract.evidence,
    transitionScore: contract.transitionScore,
  };
}

/** Data attributes are emitted by the visible navigation root in each Stage. */
export function curatedNavigationAttributes(styleId: string, topicId: string): {
  "data-topic-navigation": "true";
  "data-navigation-geometry": TopicNavigationProfile["geometry"];
  "data-navigation-carrier": string;
  "data-navigation-invocation": TopicNavigationProfile["invocation"];
  "data-navigation-feedback": TopicNavigationProfile["feedback"];
} {
  const navigation = findContract(styleId, topicId).navigation;
  if (!hasVisibleTopicNavigation(navigation)) {
    throw new Error(
      `Topic "${styleId}/${topicId}" does not render visible navigation.`,
    );
  }
  return {
    "data-topic-navigation": "true",
    "data-navigation-geometry": navigation.geometry,
    "data-navigation-carrier": navigation.carrier,
    "data-navigation-invocation": navigation.invocation,
    "data-navigation-feedback": navigation.feedback,
  };
}

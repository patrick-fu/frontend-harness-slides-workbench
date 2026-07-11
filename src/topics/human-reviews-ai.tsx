import type { CSSProperties } from "react";
import {
  defineTopic,
  type TopicDefinition,
  type TopicMetadata,
  type TopicStageProps,
} from "../domain/topic";
import SpatialSceneTrack, {
  type SceneTransitionMap,
} from "../components/stage/SpatialSceneTrack";
import { useFLIP } from "../hooks/useFLIP";
import styles from "./human-reviews-ai.module.css";

/* ------------------------------------------------------------------ *
 * Collaborative Pairing Board �
 * Human <-> AI code review as a two-party division of labor with a
 * shared center seam and visible sync points. Clean light neutral
 * ground, one calm professional accent (blue), even-handed neutral
 * type on both sides. Built in isolation from DNA + assignment.
 * ------------------------------------------------------------------ */

const TRANSITION_SCORE = {
  "1->2": "slide-x",
  "2->3": "slide-x",
  "3->4": "fade",
  "4->5": "scale-fade",
} as const satisfies TopicDefinition["transitionScore"];

const TRANSITIONS: SceneTransitionMap = TRANSITION_SCORE;

const BEAT_LAYOUT_MODES = { 2: "reserved", 3: "reserved", 4: "motion" } as const;
const SCENE_IDS = [1, 2, 3, 4, 5];

/* ---- Icons ------------------------------------------------------- */
function HumanIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="8" r="3.4" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M5.5 19c0-3.3 2.9-5.6 6.5-5.6s6.5 2.3 6.5 5.6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function AiIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 3.2l1.9 4.9 4.9 1.9-4.9 1.9L12 16.8l-1.9-4.9L5.2 10l4.9-1.9L12 3.2z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <circle cx="18.4" cy="17.6" r="1.5" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M5 12.5l4.4 4.4L19 7.3"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ---- Content ----------------------------------------------------- */
type Beat = { action: string; title: string; body: string };
type Lang = "en" | "zh";

interface Content {
  kicker: string;
  human: { role: string; tag: string; desc: string };
  ai: { role: string; tag: string; desc: string };
  steps: string[];
  scenes: { title: string; beats: Beat[] }[];
  draft: { aiStatus: string[]; humanStatus: string[]; diff: string[] };
  review: {
    humanComment: string;
    humanMeta: string;
    aiComment: string;
    aiMeta: string;
    toAi: string;
    toHuman: string;
  };
  sync: {
    humanTitle: string;
    humanBody: string;
    aiTitle: string;
    aiBody: string;
    labelWait: string;
    labelDone: string;
  };
  merged: { tag: string; title: string; body: string };
}

const CONTENT: Record<Lang, Content> = {
  en: {
    kicker: "Collaborative Pairing Board",
    human: {
      role: "Reviewer",
      tag: "Human",
      desc: "Reads intent, judges risk, decides what ships.",
    },
    ai: {
      role: "Drafter",
      tag: "AI",
      desc: "Proposes the change, explains it, iterates fast.",
    },
    steps: ["Split", "Draft", "Review", "Sync", "Merge"],
    scenes: [
      {
        title: "Two Sides, One Board",
        beats: [
          {
            action: "Open the board",
            title: "A shared board, split in two",
            body: "One seam down the middle. AI drafts on one side, the human reviews on the other. Same board, clear division of labor.",
          },
        ],
      },
      {
        title: "The Draft",
        beats: [
          {
            action: "AI proposes",
            title: "The AI side puts up a change",
            body: "A patch lands on the AI side of the seam. The human side stays quiet and watches it take shape.",
          },
          {
            action: "Human observes",
            title: "The human reads before touching",
            body: "No edits yet — the reviewer takes in the whole diff and starts marking what deserves a closer look.",
          },
        ],
      },
      {
        title: "The Review",
        beats: [
          {
            action: "Human comments",
            title: "A note crosses to the AI",
            body: "The reviewer flags an edge case. The comment travels across the seam and lands on the AI side.",
          },
          {
            action: "AI answers",
            title: "The AI replies across the seam",
            body: "The AI revises and sends its reasoning back. Turns alternate, side to side, neither one running ahead.",
          },
        ],
      },
      {
        title: "The Sync",
        beats: [
          {
            action: "Hold at the checkpoint",
            title: "Both sides reach a checkpoint",
            body: "Two tokens sit apart on the track. The checkpoint stays dark until human and AI actually agree.",
          },
          {
            action: "Alignment lights up",
            title: "They align — the light comes on",
            body: "The tokens slide together and the checkpoint lights. Agreement is visible, not assumed.",
          },
        ],
      },
      {
        title: "Merged",
        beats: [
          {
            action: "Dissolve the seam",
            title: "One artifact, both authors",
            body: "The boundary dissolves. What ships carries both signatures — an AI draft the human stood behind.",
          },
        ],
      },
    ],
    draft: {
      aiStatus: ["Proposing patch", "Patch ready for review"],
      humanStatus: ["Watching…", "Marked 2 items"],
      diff: [
        "  function retry(fn, max) {",
        "-   for (let i=0;i<max;i++)",
        "+   for (let i=0;i<=max;i++)",
        "      return fn();",
        "  }",
      ],
    },
    review: {
      humanComment: "Off-by-one on the retry bound — should this include the final attempt?",
      humanMeta: "Reviewer · comment",
      aiComment: "Good catch. Switched to `<=` and added a guard test for the last attempt.",
      aiMeta: "Drafter · reply",
      toAi: "comment →",
      toHuman: "← reply",
    },
    sync: {
      humanTitle: "Reviewer OK",
      humanBody: "Intent clear, risk understood, tests cover the fix.",
      aiTitle: "Drafter OK",
      aiBody: "Patch updated, reasoning shared, edge case handled.",
      labelWait: "Awaiting sync",
      labelDone: "Synced",
    },
    merged: {
      tag: "Merged to main",
      title: "Reviewed & shipped, together",
      body: "One commit, two authors. The pairing leaves a trail: who drafted, who reviewed, where they agreed.",
    },
  },
  zh: {
    kicker: "协作配对板",
    human: {
      role: "评审者",
      tag: "人类",
      desc: "读懂意图、判断风险、决定什么能上线。",
    },
    ai: {
      role: "起草者",
      tag: "AI",
      desc: "提出改动、解释思路、快速迭代。",
    },
    steps: ["分屏", "起草", "评审", "同步", "合并"],
    scenes: [
      {
        title: "两侧一板",
        beats: [
          {
            action: "打开看板",
            title: "一块看板，从中一分为二",
            body: "中间一条缝。AI 在一侧起草，人类在另一侧评审。同一块板，分工清晰。",
          },
        ],
      },
      {
        title: "起草",
        beats: [
          {
            action: "AI 提案",
            title: "AI 一侧提出改动",
            body: "一段补丁落在 AI 一侧。人类这边保持安静，看它逐渐成形。",
          },
          {
            action: "人类观察",
            title: "先读懂，再动手",
            body: "还没有修改——评审者通读整段 diff，开始标记值得细看的地方。",
          },
        ],
      },
      {
        title: "评审",
        beats: [
          {
            action: "人类评论",
            title: "一条批注越过缝隙",
            body: "评审者指出一个边界情况。评论穿过中缝，落到 AI 一侧。",
          },
          {
            action: "AI 回应",
            title: "AI 隔缝作答",
            body: "AI 修订并把理由送回。回合两侧交替，谁都不抢跑。",
          },
        ],
      },
      {
        title: "同步",
        beats: [
          {
            action: "停在检查点",
            title: "两侧抵达同一个检查点",
            body: "两枚令牌分列轨道两端。在人与 AI 真正达成一致前，检查点始终不亮。",
          },
          {
            action: "对齐亮灯",
            title: "对齐达成——灯亮起",
            body: "两枚令牌相向靠拢，检查点亮起。一致是看得见的，而非默认的。",
          },
        ],
      },
      {
        title: "已合并",
        beats: [
          {
            action: "缝隙消融",
            title: "一件成果，双方署名",
            body: "边界消融。上线的东西带着两个签名——一份 AI 起草、人类为之背书的改动。",
          },
        ],
      },
    ],
    draft: {
      aiStatus: ["正在提交补丁", "补丁待评审"],
      humanStatus: ["观察中…", "已标记 2 处"],
      diff: [
        "  function retry(fn, max) {",
        "-   for (let i=0;i<max;i++)",
        "+   for (let i=0;i<=max;i++)",
        "      return fn();",
        "  }",
      ],
    },
    review: {
      humanComment: "重试上界差一——最后一次尝试应该被算进来吗？",
      humanMeta: "评审者 · 批注",
      aiComment: "抓得好。已改为 `<=`，并为最后一次尝试补了守卫测试。",
      aiMeta: "起草者 · 回复",
      toAi: "批注 →",
      toHuman: "← 回复",
    },
    sync: {
      humanTitle: "评审通过",
      humanBody: "意图清楚，风险已知，测试覆盖到位。",
      aiTitle: "起草通过",
      aiBody: "补丁已更新，思路已同步，边界已处理。",
      labelWait: "等待同步",
      labelDone: "已同步",
    },
    merged: {
      tag: "已合并至 main",
      title: "评审后共同交付",
      body: "一次提交，两位作者。配对留下痕迹：谁起草、谁评审、在哪里达成一致。",
    },
  },
};

/* ---- Metadata ---------------------------------------------------- */
function buildMetadata(lang: Lang): TopicMetadata {
  const c = CONTENT[lang];
  return {
    theme: lang === "en" ? "Human Reviews the AI" : "人审 AI",
    densityLabel: lang === "en" ? "Structured" : "结构化",
    heroScene: 3,
    colors: { bg: "#edf1f6", ink: "#202832", panel: "#ffffff" },
    typography: { header: "Inter", body: "Inter" },
    tags: [
      "balanced",
      "cooperative",
      "professional",
      "light",
      "neutral",
      "structured",
      "calm-motion",
      lang === "en" ? "pairing" : "配对",
    ],
    fonts: [
      "Inter:wght@400;500;600;700",
      "IBM Plex Mono:wght@400;500",
      "cjk:Noto Sans SC:wght@400;500;700",
    ],
    scenes: c.scenes.map((scene, si) => ({
      id: si + 1,
      title: scene.title,
      beats: scene.beats.map((b, bi) => ({
        id: bi,
        action: b.action,
        title: b.title,
        body: b.body,
      })),
    })),
  };
}

const METADATA = {
  en: buildMetadata("en"),
  zh: buildMetadata("zh"),
} satisfies TopicDefinition["metadata"];

const NAVIGATION = {
  geometry: "edge-scale",
  carrier: "review-seam-tabs",
  invocation: "auto-hide",
  feedback: "geometry-reflow",
} as const satisfies TopicDefinition["navigation"];

/* ---- Role chip --------------------------------------------------- */
function RoleChip({
  side,
  role,
  tag,
  active,
}: {
  side: "human" | "ai";
  role: string;
  tag: string;
  active: boolean;
}) {
  return (
    <div
      className={`${styles.chip} ${side === "ai" ? styles.chipAi : ""}`}
      data-active={active ? "true" : "false"}
    >
      <span className={styles.avatar}>
        {side === "human" ? <HumanIcon /> : <AiIcon />}
      </span>
      <span className={styles.chipName}>
        <span className={styles.chipRole}>{role}</span>
        <span className={styles.chipTag}>{tag}</span>
      </span>
    </div>
  );
}

function activeSide(scene: number, beat: number): "human" | "ai" | null {
  if (scene === 2) return "ai";
  if (scene === 3) return beat === 0 ? "human" : "ai";
  return null;
}

/* ---- Scene content ----------------------------------------------- */
function SceneView({
  scene,
  beat,
  isActive,
  lang,
  reducedMotion,
  isThumbnail,
}: {
  scene: number;
  beat: number;
  isActive: boolean;
  lang: Lang;
  reducedMotion: boolean;
  isThumbnail: boolean;
}) {
  const c = CONTENT[lang];
  const sc = c.scenes[scene - 1];
  const b = sc.beats[Math.min(beat, sc.beats.length - 1)];
  const side = activeSide(scene, beat);

  const flip = useFLIP<HTMLDivElement>({
    watch: [beat],
    disabled: reducedMotion || isThumbnail || !isActive || scene !== 4,
    duration: 480,
    easing: "cubic-bezier(0.34, 1.56, 0.64, 1)",
    selector: '[data-beat-layout-item="true"]',
  });

  return (
    <div className={styles.frame}>
      <div className={styles.topbar}>
        <RoleChip
          side="human"
          role={c.human.role}
          tag={c.human.tag}
          active={side === "human" || scene === 5}
        />
        <div className={styles.deck}>
          <span className={styles.deckKicker}>{c.kicker}</span>
          <span className={styles.deckStep}>
            {String(scene).padStart(2, "0")} / {c.steps[scene - 1]}
          </span>
        </div>
        <RoleChip
          side="ai"
          role={c.ai.role}
          tag={c.ai.tag}
          active={side === "ai" || scene === 5}
        />
      </div>

      <div className={styles.body}>
        <div className={styles.headline}>
          <span className={styles.action}>{b.action}</span>
          <h1 className={styles.headTitle}>{b.title}</h1>
          <p className={styles.headBody}>{b.body}</p>
        </div>

        <div className={styles.region}>
          {scene !== 5 && <div className={styles.seam} aria-hidden="true" />}

          {scene === 1 && (
            <div className={styles.cols}>
              <div className={styles.col}>
                <div className={styles.introCard}>
                  <span className={styles.introAvatar}>
                    <HumanIcon />
                  </span>
                  <span className={styles.introRole}>{c.human.role}</span>
                  <span className={styles.introTag}>{c.human.tag}</span>
                  <span className={styles.introDesc}>{c.human.desc}</span>
                </div>
              </div>
              <div className={styles.col}>
                <div className={styles.introCard}>
                  <span className={styles.introAvatar}>
                    <AiIcon />
                  </span>
                  <span className={styles.introRole}>{c.ai.role}</span>
                  <span className={styles.introTag}>{c.ai.tag}</span>
                  <span className={styles.introDesc}>{c.ai.desc}</span>
                </div>
              </div>
            </div>
          )}

          {scene === 2 && (
            <div
              className={styles.cols}
              data-beat-layout-container="true"
              data-beat-layout-mode="reserved"
            >
              <div className={styles.col} data-beat-layout-item="true">
                <div className={styles.card} data-dim={beat === 0 ? "true" : "false"}>
                  <div className={styles.cardHead}>
                    <span className={styles.miniAvatar}>
                      <HumanIcon />
                    </span>
                    <span className={styles.cardTag}>{c.human.tag}</span>
                  </div>
                  <div className={styles.statusLine}>
                    {c.draft.humanStatus[beat]}
                  </div>
                </div>
              </div>
              <div className={styles.col} data-beat-layout-item="true">
                <div className={styles.card} data-active="true">
                  <div className={styles.cardHead}>
                    <span className={styles.miniAvatar}>
                      <AiIcon />
                    </span>
                    <span className={styles.cardTag}>{c.ai.tag}</span>
                    <span className={styles.pulse} aria-hidden="true" />
                  </div>
                  <div className={styles.diff}>
                    {c.draft.diff.map((line, i) => {
                      const kind =
                        line.startsWith("+")
                          ? styles.diffAdd
                          : line.startsWith("-")
                            ? styles.diffDel
                            : styles.diffCtx;
                      const hidden = beat === 0 && (i === 1 || i === 2);
                      return (
                        <span
                          key={i}
                          className={`${styles.diffRow} ${kind}`}
                          style={{ opacity: hidden ? 0.18 : 1 }}
                        >
                          {line}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {scene === 3 && (
            <div
              className={styles.cols}
              data-beat-layout-container="true"
              data-beat-layout-mode="reserved"
            >
              <div className={styles.col} data-beat-layout-item="true">
                <div
                  className={styles.card}
                  data-active={beat === 0 ? "true" : "false"}
                  data-dim={beat === 0 ? "false" : "true"}
                >
                  <div className={styles.bubble}>
                    <span className={styles.bubbleBody}>
                      {c.review.humanComment}
                    </span>
                    <span className={styles.bubbleMeta}>
                      <span className={styles.miniAvatar}>
                        <HumanIcon />
                      </span>
                      {c.review.humanMeta}
                    </span>
                  </div>
                </div>
              </div>
              <div className={styles.col} data-beat-layout-item="true">
                <div
                  className={styles.card}
                  data-active={beat === 1 ? "true" : "false"}
                  data-dim={beat === 1 ? "false" : "true"}
                >
                  <div className={styles.bubble}>
                    <span className={styles.bubbleBody}>
                      {c.review.aiComment}
                    </span>
                    <span className={styles.bubbleMeta}>
                      <span className={styles.miniAvatar}>
                        <AiIcon />
                      </span>
                      {c.review.aiMeta}
                    </span>
                  </div>
                </div>
              </div>
              <div
                className={`${styles.cross} ${styles.crossToAi}`}
                style={{ opacity: beat === 0 ? 1 : 0 }}
              >
                <span>{c.review.toAi}</span>
              </div>
              <div
                className={`${styles.cross} ${styles.crossToHuman}`}
                style={{ opacity: beat === 1 ? 1 : 0 }}
              >
                <span>{c.review.toHuman}</span>
              </div>
            </div>
          )}

          {scene === 4 && (
            <div
              ref={flip.ref}
              className={styles.syncTrack}
              data-aligned={beat === 1 ? "true" : "false"}
              data-beat-layout-container="true"
              data-beat-layout-mode="motion"
            >
              <div className={styles.token} data-beat-layout-item="true">
                <span className={styles.tokenTitle}>{c.sync.humanTitle}</span>
                <span className={styles.tokenBody}>{c.sync.humanBody}</span>
              </div>
              <div className={styles.token} data-beat-layout-item="true">
                <span className={styles.tokenTitle}>{c.sync.aiTitle}</span>
                <span className={styles.tokenBody}>{c.sync.aiBody}</span>
              </div>
              <div
                className={styles.checkpoint}
                data-lit={beat === 1 ? "true" : "false"}
              >
                <CheckIcon />
                <span className={styles.checkpointLabel}>
                  {beat === 1 ? c.sync.labelDone : c.sync.labelWait}
                </span>
              </div>
            </div>
          )}

          {scene === 5 && (
            <div className={styles.merged}>
              <div className={styles.mergedFaces}>
                <span className={styles.miniAvatar}>
                  <HumanIcon />
                </span>
                <span className={styles.miniAvatar}>
                  <AiIcon />
                </span>
                <span className={styles.checkMini}>
                  <CheckIcon />
                </span>
              </div>
              <span className={styles.mergedTag}>{c.merged.tag}</span>
              <h2 className={styles.mergedTitle}>{c.merged.title}</h2>
              <p className={styles.mergedBody}>{c.merged.body}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---- Nav: center-seam vertical tab stack ------------------------- */
function SeamNav({
  scene,
  beat,
  steps,
  isThumbnail,
  onNavigate,
}: {
  scene: number;
  beat: number;
  steps: string[];
  isThumbnail: boolean;
  onNavigate?: (scene: number, beat: number) => void;
}) {
  if (isThumbnail) return null;
  const side = activeSide(scene, beat);
  return (
    <nav
      className={styles.nav}
      aria-label="scene navigation"
      data-topic-navigation="true"
      data-navigation-geometry={NAVIGATION.geometry}
      data-navigation-carrier={NAVIGATION.carrier}
      data-navigation-invocation={NAVIGATION.invocation}
      data-navigation-feedback={NAVIGATION.feedback}
    >
      {SCENE_IDS.map((id) => {
        const current = id === scene;
        return (
          <button
            key={id}
            type="button"
            className={styles.navTick}
            data-current={current ? "true" : "false"}
            aria-label={steps[id - 1]}
            aria-current={current ? "step" : undefined}
            onClick={(e) => {
              e.stopPropagation();
              onNavigate?.(id, 0);
            }}
          >
            {current && side === "human" && (
              <span className={`${styles.navCaret} ${styles.navCaretHuman}`}>
                ‹
              </span>
            )}
            {current && side === "ai" && (
              <span className={`${styles.navCaret} ${styles.navCaretAi}`}>›</span>
            )}
          </button>
        );
      })}
    </nav>
  );
}

/* ---- Root -------------------------------------------------------- */
function TopicStage({
  scene,
  beat,
  language,
  isThumbnail,
  reducedMotion,
  onNavigate,
}: TopicStageProps) {
  const still = reducedMotion || isThumbnail;

  return (
    <div
      className={styles.root}
      data-static={still ? "true" : "false"}
      data-topic-id="human-reviews-ai"
      style={{ "--stage": "1" } as CSSProperties}
    >
      <SpatialSceneTrack
        scene={scene}
        beat={beat}
        transitionKind="slide-x"
        transitionMap={TRANSITIONS}
        reducedMotion={still}
        beatLayoutModes={BEAT_LAYOUT_MODES}
        renderScene={(sceneId, sceneBeat, isActive) => (
          <SceneView
            scene={sceneId}
            beat={sceneBeat}
            isActive={isActive}
            lang={language}
            reducedMotion={reducedMotion}
            isThumbnail={isThumbnail}
          />
        )}
      />
      <SeamNav
        scene={scene}
        beat={beat}
        steps={CONTENT[language].steps}
        isThumbnail={isThumbnail}
        onNavigate={onNavigate}
      />
    </div>
  );
}

export default defineTopic({
  id: "human-reviews-ai",
  styleId: "collaborative-pairing-board",
  title: { en: "Human Reviews the AI", zh: "人审 AI" },
  modelId: "Claude Opus 4.8",
  Stage: TopicStage,
  metadata: METADATA,
  navigation: NAVIGATION,
  transitionScore: TRANSITION_SCORE,
  evidence: {
    kind: "illustrative",
    boundary: {
      en: "Illustrative scenario: names, figures, and outcomes are presentation examples, not external factual claims.",
      zh: "示例场景：其中名称、数字和结果均为演示内容，并非外部事实主张。",
    },
    display: "envelope",
  },
});

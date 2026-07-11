// On Quitting Well � — "Spotlight Quote Poster" / 聚光引言海报
// A darkened stage; a single soft pool of light lifts one statement out of the
// shadow. Luminous serif text, one muted gold accent, dominant emptiness.
// Written from DNA + assignment only. cqw/cqh units; Envelope owns responsive.

// On Quitting Well � — "Spotlight Quote Poster" / 聚光引言海报
// A darkened stage; a single soft pool of light lifts one statement out of the
// shadow. Luminous serif text, one muted gold accent, dominant emptiness.
// Written from DNA + assignment only. cqw/cqh units; Envelope owns responsive.
import React from "react";
import {
  defineTopic,
  type TopicDefinition,
  type TopicMetadata,
  type TopicStageProps,
} from "../domain/topic";
import SpatialSceneTrack from "../components/stage/SpatialSceneTrack";
import type { SceneTransitionMap } from "../components/stage/SpatialSceneTrack";
import { useFLIP } from "../hooks/useFLIP";
import styles from "./on-quitting-well.module.css";

type Lang = "en" | "zh";

const ITEM = '[data-beat-layout-item="true"]';
// calm, atmospheric settle — no bounce; the light and words never snap
const CALM = "cubic-bezier(0.22, 1, 0.36, 1)";

const cx = (...c: Array<string | false | undefined>) => c.filter(Boolean).join(" ");

// ── Bilingual content (single source → drives render AND metadata) ──────────
const CONTENT = {
  en: {
    theme: "On Quitting Well",
    densityLabel: "One statement, held",
    s1: { opening: "On Quitting Well", sub: "a quiet meditation on leaving" },
    s2: {
      quote: "I did not fail here. I simply finished.",
      attr: "— the morning I chose to go",
    },
    s3: {
      a: { line: "The last day arrives quietly.", sub: "no speeches, no alarms" },
      b: { line: "And the light moves on.", sub: "as light always does" },
    },
    s4: {
      l1: "What stays is not the title,",
      l2: "not the desk, not the badge —",
      l3pre: "but the people you left ",
      l3accent: "whole",
      l3post: ".",
    },
    s5: { door: "Leave softly — the door stays warm." },
    sceneTitles: ["Title", "The decision", "The last day", "What stays", "The door"],
    actions: {
      s1: ["fade up from dark", "hold in the light"],
      s2: ["let it land", "set the source apart"],
      s3: ["settle in stillness", "drift with the light"],
      s4: ["first line surfaces", "second surfaces", "the word that stays"],
      s5: ["dim to close"],
    },
    tags: ["reflective", "reverent", "minimal", "spotlight", "slow"],
  },
  zh: {
    theme: "好好离开",
    densityLabel: "一句话，静置",
    s1: { opening: "好好离开", sub: "一场关于离开的沉思" },
    s2: {
      quote: "我不是失败，只是把它做完了。",
      attr: "—— 我决定离开的那个清晨",
    },
    s3: {
      a: { line: "最后一天，静静到来。", sub: "没有致辞，没有闹钟" },
      b: { line: "光，也随之移开。", sub: "一如光，总会移开" },
    },
    s4: {
      l1: "留下的不是头衔，",
      l2: "不是工位，也不是工牌——",
      l3pre: "而是你",
      l3accent: "善待",
      l3post: "过的人。",
    },
    s5: { door: "轻轻离开——门，仍有余温。" },
    sceneTitles: ["标题", "决定", "最后一天", "留下的", "门"],
    actions: {
      s1: ["自暗中浮现", "停驻在光里"],
      s2: ["让它落下", "让出处独立"],
      s3: ["在静止中安放", "随光移动"],
      s4: ["第一行浮现", "第二行浮现", "留下的那个词"],
      s5: ["渐暗收束"],
    },
    tags: ["沉思", "庄重", "极简", "聚光", "缓慢"],
  },
} as const;

type Content = (typeof CONTENT)[Lang];

// The single pool of light. It drifts (never cuts) as scene/beat change.
type Spot = { sx: string; sy: string; lit: number };
function getSpotlight(scene: number, beat: number): Spot {
  switch (scene) {
    case 1:
      return beat >= 1
        ? { sx: "50%", sy: "43%", lit: 1 }
        : { sx: "50%", sy: "39%", lit: 0.26 };
    case 2:
      return { sx: "50%", sy: "46%", lit: 0.96 };
    case 3:
      return beat >= 1
        ? { sx: "69%", sy: "53%", lit: 0.95 }
        : { sx: "33%", sy: "49%", lit: 0.95 };
    case 4:
      return { sx: "41%", sy: "47%", lit: 0.95 };
    case 5:
      return { sx: "50%", sy: "50%", lit: 0.42 }; // dims to close
    default:
      return { sx: "50%", sy: "46%", lit: 0.9 };
  }
}

// ── Scene 1 · Title (motion) ────────────────────────────────────────────────
function TitleScene(p: SceneProps) {
  const { ref } = useFLIP<HTMLDivElement>({
    watch: [p.beat],
    disabled: p.still || !p.isActive,
    duration: 680,
    easing: CALM,
    selector: ITEM,
  });
  const lit = p.beat >= 1 ? 1 : 0;
  return (
    <div className={styles.center}>
      <div
        ref={ref}
        className={styles.titleBlock}
        data-beat={p.beat}
        data-beat-layout-container="true"
        data-beat-layout-mode="motion"
      >
        <h1 className={styles.title} data-beat-layout-item="true" data-lit={lit}>
          {p.c.s1.opening}
        </h1>
        <p className={styles.titleSub} data-beat-layout-item="true" data-lit={lit}>
          {p.c.s1.sub}
        </p>
      </div>
    </div>
  );
}

// ── Scene 2 · The decision (reserved) ───────────────────────────────────────
function DecisionScene(p: SceneProps) {
  const lit = p.beat >= 1 ? 1 : 0;
  return (
    <div className={styles.center}>
      <div
        className={styles.quoteBlock}
        data-beat-layout-container="true"
        data-beat-layout-mode="reserved"
      >
        <p className={styles.quote} data-beat-layout-item="true">
          “{p.c.s2.quote}”
        </p>
        <span className={styles.attr} data-beat-layout-item="true" data-lit={lit}>
          {p.c.s2.attr}
        </span>
      </div>
    </div>
  );
}

// ── Scene 3 · The last day (motion — statement drifts with the light) ────────
function LastDayScene(p: SceneProps) {
  const { ref } = useFLIP<HTMLDivElement>({
    watch: [p.beat],
    disabled: p.still || !p.isActive,
    duration: 760,
    easing: CALM,
    selector: ITEM,
  });
  const cur = p.beat >= 1 ? p.c.s3.b : p.c.s3.a;
  return (
    <div className={styles.drift} data-beat={p.beat}>
      <div
        ref={ref}
        className={styles.driftBlock}
        data-beat-layout-container="true"
        data-beat-layout-mode="motion"
      >
        <p className={styles.driftLine} data-beat-layout-item="true">
          {cur.line}
        </p>
        <p className={styles.driftSub} data-beat-layout-item="true">
          {cur.sub}
        </p>
      </div>
    </div>
  );
}

// ── Scene 4 · What stays (reserved — three slots, one accent word) ──────────
function StaysScene(p: SceneProps) {
  return (
    <div className={styles.center}>
      <div
        className={styles.staysBlock}
        data-beat-layout-container="true"
        data-beat-layout-mode="reserved"
      >
        <p className={styles.staysLine} data-beat-layout-item="true" data-lit={1}>
          {p.c.s4.l1}
        </p>
        <p
          className={styles.staysLine}
          data-beat-layout-item="true"
          data-lit={p.beat >= 1 ? 1 : 0}
        >
          {p.c.s4.l2}
        </p>
        <p
          className={styles.staysLine}
          data-beat-layout-item="true"
          data-lit={p.beat >= 2 ? 1 : 0}
        >
          {p.c.s4.l3pre}
          <span className={styles.accent} data-lit={p.beat >= 2 ? 1 : 0}>
            {p.c.s4.l3accent}
          </span>
          {p.c.s4.l3post}
        </p>
      </div>
    </div>
  );
}

// ── Scene 5 · The door (single beat — a line lingers, light dims) ───────────
function DoorScene(p: SceneProps) {
  return (
    <div className={styles.center}>
      <p className={styles.doorLine}>{p.c.s5.door}</p>
    </div>
  );
}

interface SceneProps {
  scene: number;
  beat: number;
  isActive: boolean;
  still: boolean;
  c: Content;
}

function SceneContent(p: SceneProps) {
  switch (p.scene) {
    case 1:
      return <TitleScene {...p} />;
    case 2:
      return <DecisionScene {...p} />;
    case 3:
      return <LastDayScene {...p} />;
    case 4:
      return <StaysScene {...p} />;
    default:
      return <DoorScene {...p} />;
  }
}

// ── Nav · N7 ghost / hover-reveal roman index (glows only on hover) ─────────
function GhostIndex({
  scene,
  isThumbnail,
  onNavigate,
}: {
  scene: number;
  isThumbnail: boolean;
  onNavigate?: (scene: number, beat: number) => void;
}) {
  if (isThumbnail) return null; // hide in overview cards
  const roman = ["i", "ii", "iii", "iv", "v"];
  return (
    <nav
      className={styles.nav}
      aria-label="scene index"
      data-topic-navigation="true"
      data-navigation-geometry={NAVIGATION.geometry}
      data-navigation-carrier={NAVIGATION.carrier}
      data-navigation-invocation={NAVIGATION.invocation}
      data-navigation-feedback={NAVIGATION.feedback}
    >
      {roman.map((r, i) => (
        <button
          key={r}
          type="button"
          className={cx(styles.navItem, scene === i + 1 && styles.navHere)}
          aria-current={scene === i + 1 ? "true" : undefined}
          onClick={(e) => {
            e.stopPropagation(); // do not double-trigger envelope click-zones
            onNavigate?.(i + 1, 0);
          }}
        >
          {r}
        </button>
      ))}
    </nav>
  );
}

// ── Root ────────────────────────────────────────────────────────────────────
const TRANSITION_SCORE = {
  "1->2": "fade",
  "2->3": "fade",
  "3->4": "scale-fade",
  "4->5": "fade",
} as const satisfies TopicDefinition["transitionScore"];

const TRANSITIONS: SceneTransitionMap = TRANSITION_SCORE;

const NAVIGATION = {
  geometry: "typographic-index",
  carrier: "quitting-ghost-index",
  invocation: "proximity-reveal",
  feedback: "typographic-emphasis",
} as const satisfies TopicDefinition["navigation"];

function TopicStage({
  scene,
  beat,
  language,
  isThumbnail,
  reducedMotion,
  onNavigate,
}: TopicStageProps) {
  const still = reducedMotion || isThumbnail;
  const c = CONTENT[language];
  const spot = still ? { sx: "50%", sy: "46%", lit: 0.95 } : getSpotlight(scene, beat);

  return (
    <div
      className={cx(styles.root, still && styles.still)}
      lang={language}
      data-topic-id="on-quitting-well"
      data-motion={still ? "off" : "on"}
    >
      <div
        className={styles.spotlight}
        aria-hidden="true"
        style={
          {
            "--sx": spot.sx,
            "--sy": spot.sy,
            "--lit": spot.lit,
          } as React.CSSProperties
        }
      />
      <div className={styles.stageLayer}>
        <SpatialSceneTrack
          scene={scene}
          beat={beat}
          transitionKind="fade"
          transitionMap={TRANSITIONS}
          reducedMotion={reducedMotion || isThumbnail}
          beatLayoutModes={{ 1: "motion", 2: "reserved", 3: "motion", 4: "reserved" }}
          renderScene={(sceneId, sceneBeat, isActive) => (
            <SceneContent
              scene={sceneId}
              beat={sceneBeat}
              isActive={isActive}
              still={still}
              c={c}
            />
          )}
        />
      </div>
      <div className={styles.vignette} aria-hidden="true" />
      <GhostIndex scene={scene} isThumbnail={isThumbnail} onNavigate={onNavigate} />
    </div>
  );
}

// ── Metadata (en/zh structurally identical — built by the same code path) ────
function buildScenes(c: Content) {
  return [
    {
      id: 1,
      title: c.sceneTitles[0],
      beats: [
        { id: 0, action: c.actions.s1[0], title: c.s1.opening, body: c.s1.sub },
        { id: 1, action: c.actions.s1[1], title: c.s1.opening, body: c.s1.sub },
      ],
    },
    {
      id: 2,
      title: c.sceneTitles[1],
      beats: [
        { id: 0, action: c.actions.s2[0], title: c.s2.quote, body: c.s2.attr },
        { id: 1, action: c.actions.s2[1], title: c.s2.quote, body: c.s2.attr },
      ],
    },
    {
      id: 3,
      title: c.sceneTitles[2],
      beats: [
        { id: 0, action: c.actions.s3[0], title: c.s3.a.line, body: c.s3.a.sub },
        { id: 1, action: c.actions.s3[1], title: c.s3.b.line, body: c.s3.b.sub },
      ],
    },
    {
      id: 4,
      title: c.sceneTitles[3],
      beats: [
        { id: 0, action: c.actions.s4[0], title: c.sceneTitles[3], body: c.s4.l1 },
        { id: 1, action: c.actions.s4[1], title: c.sceneTitles[3], body: c.s4.l2 },
        {
          id: 2,
          action: c.actions.s4[2],
          title: c.sceneTitles[3],
          body: c.s4.l3pre + c.s4.l3accent + c.s4.l3post,
        },
      ],
    },
    {
      id: 5,
      title: c.sceneTitles[4],
      beats: [
        { id: 0, action: c.actions.s5[0], title: c.sceneTitles[4], body: c.s5.door },
      ],
    },
  ];
}

function buildMetadata(language: Lang): TopicMetadata {
  const c = CONTENT[language];
  return {
    theme: c.theme,
    densityLabel: c.densityLabel,
    heroScene: 2,
    colors: { bg: "#0a090c", ink: "#f3eee4", panel: "#14101a" },
    typography: { header: "Cormorant Garamond", body: "Cormorant Garamond" },
    tags: [...c.tags],
    fonts: [
      "Cormorant Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500;1,600",
      "cjk:Noto Serif SC:wght@400;500;600",
    ],
    scenes: buildScenes(c),
  };
}

const METADATA = {
  en: buildMetadata("en"),
  zh: buildMetadata("zh"),
} satisfies TopicDefinition["metadata"];

const EVIDENCE = {
  kind: "illustrative",
  boundary: {
    en: "Illustrative reflection: the speaker, quoted lines, and departure narrative are authored presentation content, not attributed testimony or reporting.",
    zh: "示例性沉思：其中说话者、引言与离开叙事均为创作的演示内容，并非归属证词或报道。",
  },
  display: "envelope",
} as const satisfies TopicDefinition["evidence"];

export default defineTopic({
  id: "on-quitting-well",
  styleId: "spotlight-quote-poster",
  title: { en: "On Quitting Well", zh: "好好离开" },
  modelId: "Claude Opus 4.8",
  Stage: TopicStage,
  metadata: METADATA,
  navigation: NAVIGATION,
  transitionScore: TRANSITION_SCORE,
  evidence: EVIDENCE,
});

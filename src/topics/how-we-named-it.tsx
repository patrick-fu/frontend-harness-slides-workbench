// A warm workshop-whiteboard telling of a product-naming session: candidate
// notes get dumped up, debated with emoji reactions, shortlisted with hand
// circles, and one name wins.
//
// Stage is 1920x1080; all layout sizing uses cqw/cqh. Emoji are plain Unicode
// text inside <span> nodes — no icon fonts, no pseudo-element emoji.
import { useRef } from "react";
import {
  defineTopic,
  type TopicDefinition,
  type TopicMetadata,
  type TopicStageProps,
} from "../domain/topic";
import SpatialSceneTrack from "../components/stage/SpatialSceneTrack";
import type { SceneTransitionMap } from "../components/stage/SpatialSceneTrack";
import { useFLIP } from "../hooks/useFLIP";
import styles from "./how-we-named-it.module.css";

type Lang = "en" | "zh";

// ── content tables (EN / ZH kept structurally identical) ───────────────────
const NOTE_NAMES: Record<Lang, string[]> = {
  en: ["Nimbus", "Flow", "Beacon", "Loom", "Spark", "Atlas"],
  zh: ["云雀", "溪流", "灯塔", "织机", "火花", "磐石"],
};
const TONE_CLASS = [
  styles.toneYellow,
  styles.toneBlue,
  styles.toneRed,
  styles.toneYellow,
  styles.toneBlue,
  styles.toneRed,
];
const NOTE_ROT = [-4, 3, -2, 4, -3, 2];

// debate uses 3 of the candidates: Beacon (idx2), Loom (idx3), Spark (idx4)
const DEBATE_IDS = [2, 3, 4];
const DEBATE_POS = [
  { left: "18cqw", top: "24cqh" }, // Beacon
  { left: "56cqw", top: "18cqh" }, // Loom
  { left: "38cqw", top: "54cqh" }, // Spark
];
const DEBATE_REACT = ["👍", "❌", "👍"]; // Beacon kept, Loom rejected, Spark kept
const REACT_POS = [
  { left: "34cqw", top: "20cqh" },
  { left: "72cqw", top: "14cqh" },
  { left: "54cqw", top: "50cqh" },
];

const SHORTLIST_IDS = [2, 4]; // Beacon + Spark survive
const WINNER_ID = 2; // Beacon / 灯塔

const T = {
  kicker: { en: "Naming workshop", zh: "起名工作坊" },
  title: { en: "How We Named It", zh: "起名字" },
  sub: {
    en: "From a messy board to one good name.",
    zh: "从满板便利贴，到一个好名字。",
  },
  speech: { en: "let's go!", zh: "开工！" },
  sceneLabel: {
    en: ["the board", "the dump", "the debate", "the shortlist", "the name"],
    zh: ["白板", "倒名字", "争论", "入围", "定名"],
  },
  vs: { en: "vs", zh: "对" },
  winCap: { en: "…and that's the one.", zh: "……就叫它了。" },
  navLabel: { en: "trail", zh: "路线" },
} as const;

// ── metadata ────────────────────────────────────────────────────────────
function buildMetadata(lang: Lang): TopicMetadata {
  const en = lang === "en";
  const nm = NOTE_NAMES[lang];
  const scenes = [
    {
      id: 1,
      title: en ? "Title" : "标题",
      beats: [
        {
          id: 0,
          action: en ? "tape up the header" : "贴上标题",
          title: en ? "How We Named It" : "起名字",
          body: en
            ? "A taped title card opens the naming session."
            : "一张贴着胶带的标题卡，拉开起名会。",
        },
      ],
    },
    {
      id: 2,
      title: en ? "The dump" : "倒名字",
      beats: [
        {
          id: 0,
          action: en ? "stick up first ideas" : "先贴几个想法",
          title: en ? "First three notes" : "先来三张",
          body: en
            ? `${nm[0]}, ${nm[1]}, ${nm[2]} land on the board.`
            : `${nm[0]}、${nm[1]}、${nm[2]} 先上墙。`,
        },
        {
          id: 1,
          action: en ? "dump the rest" : "把剩下的都倒出来",
          title: en ? "Everything up" : "全贴上",
          body: en
            ? `${nm[3]}, ${nm[4]}, ${nm[5]} join — notes reflow.`
            : `${nm[3]}、${nm[4]}、${nm[5]} 加入，便利贴重新排布。`,
        },
      ],
    },
    {
      id: 3,
      title: en ? "The debate" : "争论",
      beats: [
        {
          id: 0,
          action: en ? "draw the links" : "画出连线",
          title: en ? "Connect the notes" : "把想法连起来",
          body: en
            ? "Hand-drawn connectors link three finalists."
            : "手绘连线把三个入选项串起来。",
        },
        {
          id: 1,
          action: en ? "react and reject" : "反应与否决",
          title: en ? "Thumbs and a cross" : "点赞与打叉",
          body: en
            ? `${nm[3]} gets an ❌; ${nm[2]} and ${nm[4]} get 👍.`
            : `${nm[3]} 被打 ❌；${nm[2]} 和 ${nm[4]} 得 👍。`,
        },
      ],
    },
    {
      id: 4,
      title: en ? "The shortlist" : "入围",
      beats: [
        {
          id: 0,
          action: en ? "keep two survivors" : "留下两张",
          title: en ? "Two left" : "只剩两张",
          body: en
            ? `${nm[2]} and ${nm[4]} make the shortlist.`
            : `${nm[2]} 与 ${nm[4]} 进入决选。`,
        },
        {
          id: 1,
          action: en ? "circle them by hand" : "手动圈出",
          title: en ? "Head to head" : "正面对决",
          body: en
            ? "A 'vs' slides in; both notes get circled."
            : "中间插入“对”字，两张都被圈起来。",
        },
      ],
    },
    {
      id: 5,
      title: en ? "The name" : "定名",
      beats: [
        {
          id: 0,
          action: en ? "highlight the winner" : "高亮胜者",
          title: en ? `It's ${nm[WINNER_ID]}` : `就是 ${nm[WINNER_ID]}`,
          body: en
            ? "One note is highlighted; a happy emoji lands. 🎉"
            : "一张便利贴被高亮，开心表情落下。🎉",
        },
      ],
    },
  ];

  return {
    theme: T.title[lang],
    densityLabel: en ? "loose · hand-arranged" : "松散 · 手工排布",
    heroScene: 2,
    colors: { bg: "#f1e8d2", ink: "#3b352c", panel: "#fcf7eb" },
    typography: { header: "Caveat", body: "Inter" },
    tags: en
      ? ["warm", "playful", "hand-drawn", "workshop", "loose", "gentle-motion"]
      : ["温暖", "俏皮", "手绘", "工作坊", "松散", "柔和动效"],
    fonts: [
      "Caveat:wght@400;700",
      "Inter:wght@400;500;600;700",
      "cjk:Zhi Mang Xing:wght@400",
    ],
    scenes,
  };
}

const METADATA = {
  en: buildMetadata("en"),
  zh: buildMetadata("zh"),
} satisfies TopicDefinition["metadata"];

const NAVIGATION = {
  geometry: "path",
  carrier: "naming-connector-trail",
  invocation: "persistent",
  feedback: "geometry-reflow",
} as const satisfies TopicDefinition["navigation"];

const EVIDENCE = {
  kind: "illustrative",
  boundary: {
    en: "Illustrative naming workshop: the candidate names, reactions, and selection are authored presentation content, not a record of an external process.",
    zh: "示例起名工作坊：候选名称、反馈与选择均为创作的演示内容，并非外部流程记录。",
  },
  display: "envelope",
} as const satisfies TopicDefinition["evidence"];

// ── shared bits ────────────────────────────────────────────────────────────
function SceneTag({ scene, language }: { scene: number; language: Lang }) {
  const label = T.sceneLabel[language][scene - 1];
  return (
    <div className={styles.sceneTag}>
      <span className={styles.sceneTagNum}>
        {"0" + scene}
      </span>
      <span>{label}</span>
    </div>
  );
}

interface SceneInner {
  beat: number;
  isActive: boolean;
  language: Lang;
  still: boolean; // reducedMotion || isThumbnail
}

function wrapClass(isActive: boolean, still: boolean) {
  return [styles.scene, still ? styles.still : isActive ? styles.motionOn : ""]
    .filter(Boolean)
    .join(" ");
}

// ── Scene 1 · title ─────────────────────────────────────────────────────
function TitleScene({ isActive, language, still }: SceneInner) {
  return (
    <div className={wrapClass(isActive, still)}>
      <SceneTag scene={1} language={language} />
      <div
        className={styles.titleCard}
        data-beat-layout-container="true"
        data-beat-layout-mode="reserved"
      >
        <span className={styles.kicker} data-beat-layout-item="true">
          {T.kicker[language]}
        </span>
        <h1 className={styles.bigTitle} data-beat-layout-item="true">
          {T.title[language]}
        </h1>
        <svg className={styles.underline} viewBox="0 0 340 14" preserveAspectRatio="none">
          <path d="M4 9 C 70 2, 150 13, 230 6 S 320 3, 336 8" />
        </svg>
        <p className={styles.sub} data-beat-layout-item="true">
          {T.sub[language]}
        </p>
        <div className={styles.facil}>
          <span className={styles.speech}>{T.speech[language]}</span>
          <span className={styles.facilFace} role="img" aria-label="facilitator">
            🙂
          </span>
        </div>
      </div>
    </div>
  );
}

// ── Scene 2 · the dump (motion) ─────────────────────────────────────────
function DumpScene({ beat, isActive, language, still }: SceneInner) {
  const count = beat === 0 ? 3 : 6;
  const { ref } = useFLIP<HTMLDivElement>({
    watch: [beat],
    disabled: still || !isActive,
    duration: 480,
    easing: "cubic-bezier(0.34, 1.56, 0.64, 1)",
    selector: '[data-beat-layout-item="true"]',
  });
  const names = NOTE_NAMES[language];
  return (
    <div className={wrapClass(isActive, still)}>
      <SceneTag scene={2} language={language} />
      <div
        className={styles.noteWrap}
        ref={ref}
        data-beat-layout-container="true"
        data-beat-layout-mode="motion"
      >
        {names.slice(0, count).map((name, i) => (
          <div className={styles.noteCell} key={name} data-beat-layout-item="true">
            <div
              className={`${styles.note} ${TONE_CLASS[i]}`}
              style={{ ["--rot" as string]: `${NOTE_ROT[i]}deg` }}
            >
              {name}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Scene 3 · the debate (reserved) ─────────────────────────────────────
function DebateScene({ beat, isActive, language, still }: SceneInner) {
  const names = NOTE_NAMES[language];
  const reacted = beat >= 1;
  return (
    <div className={wrapClass(isActive, still)}>
      <SceneTag scene={3} language={language} />
      <div
        className={styles.board3}
        data-beat-layout-container="true"
        data-beat-layout-mode="reserved"
      >
        {/* loose hand-drawn connectors between the three finalists */}
        <svg className={styles.connSvg} viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M28 32 C 42 26, 54 24, 66 26" />
          <path d="M28 34 C 34 46, 40 54, 48 60" />
          <path d="M66 30 C 62 44, 56 54, 50 60" />
        </svg>

        {DEBATE_IDS.map((id, i) => (
          <div
            key={id}
            className={styles.absNote}
            style={DEBATE_POS[i]}
            data-beat-layout-item="true"
          >
            <div
              className={`${styles.note} ${TONE_CLASS[id]}`}
              style={{ ["--rot" as string]: `${NOTE_ROT[id]}deg` }}
            >
              {names[id]}
            </div>
          </div>
        ))}

        {/* beat 0: a thinking actor; beat 1: reactions land in fixed slots */}
        <span
          className={styles.thought}
          role="img"
          aria-label="thinking"
          style={{ left: "48cqw", top: "34cqh", opacity: reacted ? 0 : 1 }}
        >
          🤔
        </span>
        {DEBATE_REACT.map((emoji, i) => (
          <span
            key={i}
            className={`${styles.react} ${reacted ? "" : styles.reactHidden}`}
            role="img"
            aria-label="reaction"
            style={REACT_POS[i]}
          >
            {emoji}
          </span>
        ))}
      </div>
    </div>
  );
}

// ── Scene 4 · the shortlist (motion) ────────────────────────────────────
function ShortlistScene({ beat, isActive, language, still }: SceneInner) {
  const { ref } = useFLIP<HTMLDivElement>({
    watch: [beat],
    disabled: still || !isActive,
    duration: 480,
    easing: "cubic-bezier(0.34, 1.56, 0.64, 1)",
    selector: '[data-beat-layout-item="true"]',
  });
  const names = NOTE_NAMES[language];
  const showVs = beat >= 1;
  return (
    <div className={wrapClass(isActive, still)}>
      <SceneTag scene={4} language={language} />
      <div
        className={styles.noteWrap}
        ref={ref}
        data-beat-layout-container="true"
        data-beat-layout-mode="motion"
        style={{ flexWrap: "nowrap", gap: "6cqw" }}
      >
        {SHORTLIST_IDS.map((id, i) => (
          <div className={styles.noteCell} key={id} data-beat-layout-item="true">
            <div style={{ position: "relative" }}>
              <div
                className={`${styles.note} ${TONE_CLASS[id]}`}
                style={{
                  ["--rot" as string]: `${i === 0 ? -3 : 3}deg`,
                  width: "26cqw",
                  height: "18cqh",
                  fontSize: "7cqh",
                }}
              >
                {names[id]}
              </div>
              {showVs && (
                <svg className={styles.circle} viewBox="0 0 120 90" preserveAspectRatio="none">
                  <ellipse cx="60" cy="45" rx="56" ry="40" transform="rotate(-4 60 45)" />
                </svg>
              )}
            </div>
          </div>
        ))}
        {showVs && (
          <div
            className={styles.vs}
            data-beat-layout-item="true"
            style={{ order: 1 }}
          >
            {T.vs[language]}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Scene 5 · the name ──────────────────────────────────────────────────
function NameScene({ isActive, language, still }: SceneInner) {
  const names = NOTE_NAMES[language];
  return (
    <div className={wrapClass(isActive, still)}>
      <SceneTag scene={5} language={language} />
      <div
        className={styles.winnerWrap}
        data-beat-layout-container="true"
        data-beat-layout-mode="reserved"
      >
        <div className={styles.winnerNote} data-beat-layout-item="true">
          {names[WINNER_ID]}
          <span className={styles.cheer} role="img" aria-label="celebrate">
            🎉
          </span>
          <span className={styles.winFace} role="img" aria-label="happy">
            😀
          </span>
        </div>
        <span className={styles.winCap} data-beat-layout-item="true">
          {T.winCap[language]}
        </span>
      </div>
    </div>
  );
}

// ── bespoke nav: a hand-drawn connector trail ──────────────────────────────
function ConnectorTrailNav({
  scene,
  language,
  isThumbnail,
  onNavigate,
}: {
  scene: number;
  language: Lang;
  isThumbnail: boolean;
  onNavigate?: (scene: number, beat: number) => void;
}) {
  if (isThumbnail) return null;
  const nodes = [1, 2, 3, 4, 5];
  return (
    <nav
      className={styles.nav}
      aria-label="scenes"
      data-topic-navigation="true"
      data-navigation-geometry={NAVIGATION.geometry}
      data-navigation-carrier={NAVIGATION.carrier}
      data-navigation-invocation={NAVIGATION.invocation}
      data-navigation-feedback={NAVIGATION.feedback}
    >
      <div className={styles.navTrail}>
        {nodes.map((n) => (
          <div className={styles.navItem} key={n}>
            <button
              type="button"
              className={`${styles.navNode} ${n === scene ? styles.navNodeOn : ""}`}
              onClick={(e) => {
                e.stopPropagation();
                onNavigate?.(n, 0);
              }}
              aria-current={n === scene ? "step" : undefined}
              aria-label={`scene ${n}`}
            >
              {n}
              {n === scene && (
                <svg className={styles.navRing} viewBox="0 0 60 60" preserveAspectRatio="none">
                  <ellipse cx="30" cy="30" rx="26" ry="24" transform="rotate(-8 30 30)" />
                </svg>
              )}
            </button>
            {n < nodes.length && (
              <svg className={styles.navArrow} viewBox="0 0 40 24" preserveAspectRatio="none">
                <path d="M3 12 C 14 6, 24 18, 34 12" />
                <path d="M28 6 L 35 12 L 28 18" />
              </svg>
            )}
          </div>
        ))}
      </div>
      <span className={styles.navLabel}>{T.navLabel[language]}</span>
    </nav>
  );
}

// ── transitions ────────────────────────────────────────────────────────
const TRANSITION_SCORE = {
  "1->2": "slide-x",
  "2->3": "slide-x",
  "3->4": "scale-fade",
  "4->5": "scale-fade",
} as const satisfies TopicDefinition["transitionScore"];

const TRANSITIONS: SceneTransitionMap = TRANSITION_SCORE;

// ── root component ─────────────────────────────────────────────────────
function TopicStage({
  scene,
  beat,
  language,
  isThumbnail,
  reducedMotion,
  onNavigate,
}: TopicStageProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const still = reducedMotion || isThumbnail;

  return (
    <div
      className={styles.root}
      ref={rootRef}
      lang={language}
      data-topic-id="how-we-named-it"
      data-motion={still ? "off" : "on"}
    >
      <div className={styles.grid} aria-hidden="true" />
      <SpatialSceneTrack
        scene={scene}
        beat={beat}
        transitionKind="slide-x"
        transitionMap={TRANSITIONS}
        reducedMotion={reducedMotion || isThumbnail}
        beatLayoutModes={{ 2: "motion", 3: "reserved", 4: "motion" }}
        renderScene={(sceneId, sceneBeat, isActive) => {
          const inner: SceneInner = {
            beat: sceneBeat,
            isActive,
            language,
            still,
          };
          switch (sceneId) {
            case 1:
              return <TitleScene {...inner} />;
            case 2:
              return <DumpScene {...inner} />;
            case 3:
              return <DebateScene {...inner} />;
            case 4:
              return <ShortlistScene {...inner} />;
            case 5:
              return <NameScene {...inner} />;
            default:
              return null;
          }
        }}
      />
      <div className={styles.vignette} aria-hidden="true" />
      <ConnectorTrailNav
        scene={scene}
        language={language}
        isThumbnail={isThumbnail}
        onNavigate={onNavigate}
      />
    </div>
  );
}

export default defineTopic({
  id: "how-we-named-it",
  styleId: "sketch-board-emoji",
  title: { en: "How We Named It", zh: "起名字" },
  modelId: "Claude Opus 4.8",
  Stage: TopicStage,
  metadata: METADATA,
  navigation: NAVIGATION,
  transitionScore: TRANSITION_SCORE,
  evidence: EVIDENCE,
});

import { useState } from "react";
import type { CSSProperties, KeyboardEvent, MouseEvent, PointerEvent } from "react";
import type {
  BespokeStyleProps,
  StyleMetadata,
  TopicSource,
  TopicTransitionScore,
} from "../types";
import SpatialSceneTrack from "./SpatialSceneTrack";
import type { BeatLayoutMode, SceneTransitionMap } from "./SpatialSceneTrack";
import { defineStyleTopic } from "./topic";
import styles from "./duotone-session-dance-notation.module.css";

type Language = "en" | "zh";
const SCENE_IDS = [1, 2, 3, 4, 5] as const;
type SceneId = (typeof SCENE_IDS)[number];

interface BeatCopy {
  id: number;
  action: string;
  title: string;
  body: string;
}

interface LegendCopy {
  id: "space" | "body" | "time";
  index: string;
  label: string;
  title: string;
  body: string;
}

interface PhaseCopy {
  index: string;
  label: string;
  body: string;
}

interface ReconstructionCopy {
  label: string;
  title: string;
  body: string;
}

interface SceneCopy {
  nav: string;
  take: string;
  eyebrow: string;
  titleLines: string[];
  subtitle: string;
  body: string;
  caption: string;
  sourceLine: string;
  beats: BeatCopy[];
  legends?: LegendCopy[];
  phases?: PhaseCopy[];
  reconstructions?: ReconstructionCopy[];
  boundary?: string;
}

export const DANCE_NOTATION_TRANSITION_SCORE = {
  "1->2": "focus-swap",
  "2->3": "afterimage",
  "3->4": "push-x",
  "4->5": "afterimage",
} as const satisfies TopicTransitionScore;

const TRANSITION_MAP: SceneTransitionMap = DANCE_NOTATION_TRANSITION_SCORE;

const BEAT_LAYOUT_MODES: Partial<Record<SceneId, BeatLayoutMode>> = {
  1: "reserved",
  2: "reserved",
  3: "reserved",
  4: "reserved",
};

export const DANCE_NOTATION_SOURCES = [
  {
    authority: "Dance Notation Bureau",
    title: "Labanotation Fundamentals",
    citation: "Dance Notation Bureau, Labanotation Fundamentals, accessed 2026-07-10.",
    url: "https://www.dancenotation.org/labanotation-fundamentals/",
    supports:
      "Supports the four encoding claims used in Scene 2: symbol shape indicates direction, staff placement identifies the body part, shading indicates level, and symbol length indicates duration.",
    boundary:
      "The page is an introductory overview, so the deck uses schematic original symbols and does not present them as a publishable or complete Labanotation score.",
  },
  {
    authority: "Dance Notation Bureau",
    title: "Staging from Score",
    citation: "Dance Notation Bureau, Staging from Score, accessed 2026-07-10.",
    url: "https://www.dancenotation.org/staging-from-score/",
    supports:
      "Supports the reconstruction boundary in Scenes 4 and 5: trained stagers consult detailed scores, while style coaches, rehearsal materials, and production information also contribute to a staged work.",
    boundary:
      "The source describes professional staging practice; it does not justify claiming that any two readers must produce arbitrary or equally valid differences from the same score.",
  },
  {
    authority: "The New York Public Library",
    title: "Passacaglia and fugue in C minor — Labanotation research catalog record",
    citation:
      "NYPL Research Catalog, Doris Humphrey, Passacaglia and fugue in C minor, Dance Notation Bureau score, bib b12115887.",
    url: "https://www.nypl.org/research/research-catalog/bib/b12115887",
    supports:
      "Supports the archival claim that substantial Labanotation scores are preserved as research objects: the catalog identifies a 151-leaf score, its reconstruction context, notators, and checking history.",
    boundary:
      "The catalog record proves the existence and documented chain of one score; this topic does not reproduce its notation, choreography, dancers, or copyrighted pages.",
  },
  {
    authority: "The Ohio State University Department of Dance",
    title: "Dance Notation Bureau Extension Resources — Labanotation",
    citation:
      "Ohio State Department of Dance, DNB Extension Resources: Labanotation, accessed 2026-07-10.",
    url: "https://dance.osu.edu/research/dnb/resources",
    supports:
      "Supports the explanation that Labanotation is a structured system whose symbols encode direction, level, timing, and body part on a staff read from bottom to top.",
    boundary:
      "The university resource summarizes the system for learners; the visual examples here remain original teaching diagrams rather than transcriptions of an archived dance.",
  },
] as const satisfies readonly (TopicSource & { boundary: string })[];

const SCENES: Record<SceneId, Record<Language, SceneCopy>> = {
  1: {
    en: {
      nav: "Opening pose",
      take: "01",
      eyebrow: "BODY ↔ SCORE",
      titleLines: ["A Dance", "Written", "Twice"],
      subtitle: "One movement. Two carriers.",
      body:
        "The body moves through three-dimensional space. Labanotation compresses that changing structure onto a vertical staff.",
      caption: "Original silhouette · schematic score, not a published choreography",
      sourceLine: "DNB FUNDAMENTALS / ORIGINAL DIAGRAM",
      beats: [
        {
          id: 0,
          action: "Pose meets score",
          title: "A Dance Written Twice",
          body: "One pose and one unfamiliar staff establish the two carriers.",
        },
        {
          id: 1,
          action: "Two carriers lock",
          title: "One movement, two carriers",
          body: "The first lives in a body; the second preserves movement structure on paper.",
        },
      ],
    },
    zh: {
      nav: "起始姿态",
      take: "01",
      eyebrow: "身体 ↔ 舞谱",
      titleLines: ["一支舞", "两次", "书写"],
      subtitle: "一个动作，两种载体。",
      body: "身体在三维空间里连续运动；拉班舞谱把不断变化的结构压缩到一条纵向谱表上。",
      caption: "原创姿态剪影 · 示意舞谱，并非已出版舞作的转录",
      sourceLine: "DNB 基础资料 / 原创示意图",
      beats: [
        {
          id: 0,
          action: "姿态与谱表相遇",
          title: "一支舞的两次书写",
          body: "一个姿态与一列陌生符号建立两种载体。",
        },
        {
          id: 1,
          action: "两种载体锁定",
          title: "一个动作，两种载体",
          body: "第一次发生在身体里；第二次把动作结构保存在纸面上。",
        },
      ],
    },
  },
  2: {
    en: {
      nav: "Symbol key",
      take: "02",
      eyebrow: "READ THE STAFF",
      titleLines: ["Where", "Who", "When"],
      subtitle: "Four fundamentals, grouped into three reading dimensions.",
      body:
        "Shape and shading locate movement in space. Column placement identifies the body part. Symbol length carries duration.",
      caption: "The staff proceeds upward: later actions sit above earlier ones.",
      sourceLine: "DANCE NOTATION BUREAU / LABANOTATION FUNDAMENTALS",
      legends: [
        {
          id: "space",
          index: "A",
          label: "SPACE",
          title: "Direction + level",
          body: "Shape indicates direction; shading distinguishes low, middle, and high levels.",
        },
        {
          id: "body",
          index: "B",
          label: "BODY",
          title: "Body part",
          body: "Placement in the staff columns says which body part performs the movement.",
        },
        {
          id: "time",
          index: "C",
          label: "TIME",
          title: "Duration",
          body: "A longer symbol takes more time; the score is read from bottom to top.",
        },
      ],
      beats: [
        {
          id: 0,
          action: "Space key enters",
          title: "Direction and level",
          body: "Shape and shading specify where movement goes.",
        },
        {
          id: 1,
          action: "Body key enters",
          title: "The staff names the mover",
          body: "Column placement identifies the body part and side.",
        },
        {
          id: 2,
          action: "Time key enters",
          title: "Length carries duration",
          body: "The vertical score turns movement into an ordered sequence.",
        },
      ],
    },
    zh: {
      nav: "符号图例",
      take: "02",
      eyebrow: "读懂谱表",
      titleLines: ["去哪里", "谁在动", "动多久"],
      subtitle: "四个基础编码，归入三个阅读维度。",
      body: "形状与填充定位空间；谱表栏位标明身体部位；符号长度承载时值。",
      caption: "谱表自下向上推进：较晚的动作写在较早动作上方。",
      sourceLine: "舞蹈记谱局 / 拉班舞谱基础",
      legends: [
        {
          id: "space",
          index: "甲",
          label: "空间",
          title: "方向 + 高度",
          body: "符号形状表示方向；填充方式区分低、中、高三个高度。",
        },
        {
          id: "body",
          index: "乙",
          label: "身体",
          title: "身体部位",
          body: "符号位于谱表的哪一栏，决定由哪个身体部位完成动作。",
        },
        {
          id: "time",
          index: "丙",
          label: "时间",
          title: "时值",
          body: "符号越长，动作持续越久；谱面从下向上阅读。",
        },
      ],
      beats: [
        {
          id: 0,
          action: "空间图例进入",
          title: "方向与高度",
          body: "形状和填充共同说明动作去向。",
        },
        {
          id: 1,
          action: "身体图例进入",
          title: "谱表指出谁在动",
          body: "栏位标明身体部位与左右侧。",
        },
        {
          id: 2,
          action: "时间图例进入",
          title: "长度承载时值",
          body: "纵向谱表把动作组织成有顺序的过程。",
        },
      ],
    },
  },
  3: {
    en: {
      nav: "Score in motion",
      take: "03",
      eyebrow: "BOTTOM → TOP",
      titleLines: ["Read", "Into", "Motion"],
      subtitle: "The score cursor and sampled body advance together.",
      body:
        "A score is not a pose sheet. Each vertical interval carries the movement forward in time.",
      caption: "Three-frame teaching phrase · original silhouette sequence",
      sourceLine: "DNB + OHIO STATE / SCHEMATIC PHRASE",
      phases: [
        {
          index: "01",
          label: "SUPPORT",
          body: "Weight settles before the gesture opens.",
        },
        {
          index: "02",
          label: "REACH",
          body: "The upper body extends while the support remains legible.",
        },
        {
          index: "03",
          label: "TRANSFER",
          body: "The support changes and the phrase resolves into a new stance.",
        },
      ],
      beats: [
        {
          id: 0,
          action: "Support frame locks",
          title: "The phrase begins at the floor",
          body: "The cursor meets the first sampled body state.",
        },
        {
          id: 1,
          action: "Reach frame locks",
          title: "Gesture enters the phrase",
          body: "Paper and body advance by the same interval.",
        },
        {
          id: 2,
          action: "Transfer frame locks",
          title: "The sequence changes support",
          body: "The final sampled state closes the short phrase.",
        },
      ],
    },
    zh: {
      nav: "谱面运动",
      take: "03",
      eyebrow: "自下向上",
      titleLines: ["读谱", "回到", "动作"],
      subtitle: "谱面游标与抽帧身体同步向前。",
      body: "舞谱不是姿态图册；每一段纵向距离都把动作继续推向时间前方。",
      caption: "三帧教学短句 · 原创姿态序列",
      sourceLine: "DNB + 俄亥俄州立大学 / 示意动作短句",
      phases: [
        {
          index: "01",
          label: "支撑",
          body: "重量先落稳，手势随后打开。",
        },
        {
          index: "02",
          label: "延伸",
          body: "上身伸展，同时保留清晰支撑。",
        },
        {
          index: "03",
          label: "转移",
          body: "支撑发生改变，短句落到新的站姿。",
        },
      ],
      beats: [
        {
          id: 0,
          action: "支撑帧锁定",
          title: "动作短句从地面开始",
          body: "游标对齐第一个抽帧身体状态。",
        },
        {
          id: 1,
          action: "延伸帧锁定",
          title: "手势进入动作短句",
          body: "纸面与身体按同一个时间间隔前进。",
        },
        {
          id: 2,
          action: "转移帧锁定",
          title: "动作序列改变支撑",
          body: "最后一个抽帧状态收住这段短句。",
        },
      ],
    },
  },
  4: {
    en: {
      nav: "Reconstruction",
      take: "04",
      eyebrow: "SAME SCORE / TWO BODIES",
      titleLines: ["Structure", "Is Not", "The Whole"],
      subtitle: "A score answers movement questions; staging still requires trained bodies.",
      body:
        "The score anchors direction, level, body part, and timing. Phrasing, style, context, and rehearsal return through people.",
      caption: "Evidence boundary: score structure ≠ total performance",
      sourceLine: "DNB / STAGING FROM SCORE",
      reconstructions: [
        {
          label: "READER A · STAGER",
          title: "Structure",
          body: "Direction · level · body · timing",
        },
        {
          label: "READER B · STYLE COACH",
          title: "Phrasing",
          body: "Dynamics · emphasis · historical context",
        },
      ],
      boundary:
        "The same score can anchor definitive movement questions. A trained stager teaches the dance; a style coach restores phrasing and context.",
      beats: [
        {
          id: 0,
          action: "Shared score appears",
          title: "One score anchors the reconstruction",
          body: "The written structure enters before either embodied reading.",
        },
        {
          id: 1,
          action: "Stager reading enters",
          title: "Structure returns to a body",
          body: "A trained reader converts the written sequence into rehearsal action.",
        },
        {
          id: 2,
          action: "Style boundary enters",
          title: "The score is detailed, not total",
          body: "A second trained role restores phrasing, context, and performance choices.",
        },
      ],
    },
    zh: {
      nav: "重建",
      take: "04",
      eyebrow: "同一份舞谱 / 两个身体",
      titleLines: ["结构", "不是", "全部"],
      subtitle: "舞谱回答动作问题；重建仍要经过训练有素的身体。",
      body: "谱面锁定方向、高度、身体部位与时值；乐句、风格、语境和排练仍要由人带回现场。",
      caption: "证据边界：谱面结构 ≠ 完整表演",
      sourceLine: "舞蹈记谱局 / 从舞谱重建",
      reconstructions: [
        {
          label: "读谱者 A · 重建指导",
          title: "结构",
          body: "方向 · 高度 · 身体 · 时值",
        },
        {
          label: "读谱者 B · 风格指导",
          title: "乐句",
          body: "力度 · 重音 · 历史语境",
        },
      ],
      boundary: "同一份舞谱能锚定明确的动作问题；重建指导教授舞作，风格指导补回乐句与语境。",
      beats: [
        {
          id: 0,
          action: "共同谱面出现",
          title: "一份舞谱锚定重建",
          body: "书面结构先于两个身体读法进入画面。",
        },
        {
          id: 1,
          action: "重建读法进入",
          title: "结构回到身体",
          body: "受过训练的读谱者把书面序列转成排练动作。",
        },
        {
          id: 2,
          action: "风格边界进入",
          title: "舞谱很细，但不是全部",
          body: "第二个训练角色补回乐句、语境与表演选择。",
        },
      ],
    },
  },
  5: {
    en: {
      nav: "Double exposure",
      take: "05",
      eyebrow: "BODY → SCORE → BODY",
      titleLines: ["Notation", "Preserves", "Structure"],
      subtitle: "Performance still needs a body.",
      body:
        "Labanotation can carry where, who, level, and time across years. It does not replace the trained reader, rehearsal, or performer.",
      caption: "Original double exposure · no archived choreography reproduced",
      sourceLine: "DNB · NYPL · OHIO STATE",
      beats: [
        {
          id: 0,
          action: "Body and score hold",
          title: "Notation preserves structure",
          body: "Performance still needs a body.",
        },
      ],
    },
    zh: {
      nav: "双重曝光",
      take: "05",
      eyebrow: "身体 → 舞谱 → 身体",
      titleLines: ["舞谱", "保存", "结构"],
      subtitle: "表演仍然需要身体。",
      body: "拉班舞谱能让去向、部位、高度与时间跨越年代；它不会取代读谱者、排练和表演者。",
      caption: "原创双重曝光 · 未复制任何档案舞作",
      sourceLine: "DNB · NYPL · 俄亥俄州立大学",
      beats: [
        {
          id: 0,
          action: "身体与谱面停住",
          title: "舞谱保存结构",
          body: "表演仍然需要身体。",
        },
      ],
    },
  },
};

function clampScene(scene: number): SceneId {
  return SCENE_IDS.includes(scene as SceneId) ? (scene as SceneId) : 1;
}

function clampBeat(scene: SceneId, beat: number): number {
  const lastBeat = SCENES[scene].en.beats.length - 1;
  return Math.max(0, Math.min(lastBeat, beat));
}

export function getMetadata(lang: Language): StyleMetadata {
  return {
    id: "duotone-session",
    band: "editorial-print",
    name: lang === "zh" ? "双色录制" : "Duotone Session",
    theme: lang === "zh" ? "一支舞的两次书写" : "A Dance Written Twice",
    densityLabel: lang === "zh" ? "舞台冲击" : "Stage impact",
    heroScene: 3,
    colors: {
      bg: "#171411",
      ink: "#f1e7d0",
      panel: "#1f55b7",
    },
    typography: {
      header: "Arial Narrow 800",
      body: lang === "zh" ? "PingFang SC 400" : "Helvetica Neue 400",
    },
    tags: [
      "duotone",
      "labanotation",
      "dance",
      "type-as-image",
      "silhouette",
      "score",
      "editorial-print",
      "stage-impact",
    ],
    fonts: ["Arial Narrow", "Helvetica Neue", "cjk:PingFang SC"],
    scenes: SCENE_IDS.map((sceneId) => ({
      id: sceneId,
      title: SCENES[sceneId][lang].nav,
      beats: SCENES[sceneId][lang].beats,
    })),
  };
}

function PoseSilhouette({
  phase,
  active = true,
  className,
}: {
  phase: number;
  active?: boolean;
  className?: string;
}) {
  const poses = [
    {
      torso: "M146 198 C116 252 114 352 138 414 L204 414 C224 342 217 251 189 198 Z",
      leftArm: "M148 238 C112 276 78 318 50 368",
      rightArm: "M188 238 C228 258 261 296 286 338",
      leftLeg: "M151 402 C138 464 112 522 82 578",
      rightLeg: "M192 402 C210 468 244 521 278 563",
    },
    {
      torso: "M143 202 C126 260 130 344 151 414 L211 401 C215 328 202 250 181 198 Z",
      leftArm: "M151 242 C112 202 91 147 83 84",
      rightArm: "M184 236 C224 204 253 158 274 104",
      leftLeg: "M155 404 C145 468 130 527 117 584",
      rightLeg: "M197 398 C228 450 265 491 302 526",
    },
    {
      torso: "M137 208 C118 268 128 349 155 416 L216 394 C213 326 194 251 176 204 Z",
      leftArm: "M146 246 C105 254 61 246 18 226",
      rightArm: "M180 238 C226 224 270 200 309 166",
      leftLeg: "M160 406 C138 458 101 502 56 544",
      rightLeg: "M201 394 C225 459 247 521 263 582",
    },
  ];
  const pose = poses[Math.max(0, Math.min(2, phase))];

  return (
    <svg
      className={[styles.poseSilhouette, className].filter(Boolean).join(" ")}
      viewBox="0 0 330 620"
      role="img"
      aria-label="Original dancer silhouette"
      data-pose-silhouette="true"
      data-pose-phase={phase}
      data-active={active ? "true" : "false"}
      preserveAspectRatio="xMidYMid meet"
    >
      <circle cx="166" cy="132" r="48" fill="currentColor" />
      <path d={pose.torso} fill="currentColor" />
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="34"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d={pose.leftArm} />
        <path d={pose.rightArm} />
        <path d={pose.leftLeg} />
        <path d={pose.rightLeg} />
      </g>
    </svg>
  );
}

function NotationGlyph({
  x,
  y,
  height,
  tone,
  direction,
}: {
  x: number;
  y: number;
  height: number;
  tone: "open" | "middle" | "solid";
  direction: "left" | "right" | "forward";
}) {
  const width = 42;
  const point =
    direction === "left"
      ? `${x + width},${y} ${x},${y + height * 0.5} ${x + width},${y + height}`
      : direction === "right"
        ? `${x},${y} ${x + width},${y + height * 0.5} ${x},${y + height}`
        : `${x},${y + height} ${x + width * 0.5},${y} ${x + width},${y + height}`;

  return (
    <g className={styles.scoreGlyph} data-glyph-tone={tone}>
      <polygon points={point} />
      {tone === "middle" && (
        <g className={styles.hatchLines}>
          <line x1={x + 8} y1={y + height * 0.72} x2={x + 31} y2={y + height * 0.3} />
          <line x1={x + 16} y1={y + height * 0.88} x2={x + 38} y2={y + height * 0.47} />
        </g>
      )}
    </g>
  );
}

function NotationScore({
  phase = 0,
  className,
  showCursor = false,
}: {
  phase?: number;
  className?: string;
  showCursor?: boolean;
}) {
  const cursorY = [478, 300, 122][Math.max(0, Math.min(2, phase))];

  return (
    <svg
      className={[styles.notationScore, className].filter(Boolean).join(" ")}
      viewBox="0 0 360 620"
      role="img"
      aria-label="Original schematic Labanotation staff"
      data-notation-score="true"
      preserveAspectRatio="xMidYMid meet"
    >
      <g className={styles.staffLines}>
        <line x1="108" y1="40" x2="108" y2="580" />
        <line x1="154" y1="40" x2="154" y2="580" />
        <line x1="206" y1="40" x2="206" y2="580" />
        <line x1="252" y1="40" x2="252" y2="580" />
        <line className={styles.centerLine} x1="180" y1="40" x2="180" y2="580" />
      </g>
      <g className={styles.measureLines}>
        <line x1="76" y1="512" x2="284" y2="512" />
        <line x1="76" y1="332" x2="284" y2="332" />
        <line x1="76" y1="152" x2="284" y2="152" />
      </g>
      <g className={styles.scoreInk}>
        <NotationGlyph x={112} y={444} height={64} tone="solid" direction="left" />
        <NotationGlyph x={208} y={420} height={88} tone="open" direction="right" />
        <NotationGlyph x={158} y={268} height={60} tone="middle" direction="forward" />
        <NotationGlyph x={208} y={238} height={90} tone="solid" direction="right" />
        <NotationGlyph x={112} y={78} height={70} tone="open" direction="left" />
        <NotationGlyph x={158} y={54} height={94} tone="middle" direction="forward" />
      </g>
      <g className={styles.staffLabels} aria-hidden="true">
        <text x="84" y="604">L</text>
        <text x="268" y="604">R</text>
        <text x="168" y="604">↑</text>
      </g>
      {showCursor && (
        <g
          className={styles.scoreCursor}
          data-score-cursor="true"
          data-cursor-index={phase}
        >
          <line x1="62" y1={cursorY} x2="298" y2={cursorY} />
          <circle cx="62" cy={cursorY} r="10" />
        </g>
      )}
    </svg>
  );
}

function TakeHeader({ copy }: { copy: SceneCopy }) {
  return (
    <header className={styles.takeHeader} data-beat-layout-item="true">
      <span className={styles.takeNumber}>{copy.take}</span>
      <span className={styles.takeEyebrow}>{copy.eyebrow}</span>
      <span className={styles.takeRule} aria-hidden="true" />
      <span className={styles.takeSource}>{copy.sourceLine}</span>
    </header>
  );
}

function DisplayTitle({ copy }: { copy: SceneCopy }) {
  return (
    <div className={styles.displayBlock} data-beat-layout-item="true">
      <h1 className={styles.displayTitle}>
        {copy.titleLines.map((line) => (
          <span key={line}>{line}</span>
        ))}
      </h1>
      <p className={styles.serifSubtitle}>{copy.subtitle}</p>
    </div>
  );
}

function SceneOne({ copy, beat }: { copy: SceneCopy; beat: number }) {
  return (
    <div
      className={[styles.composition, styles.posePhoto].join(" ")}
      data-composition="pose-photo"
      data-visible-beat={beat}
      data-beat-layout-container="true"
      data-beat-layout-mode="reserved"
    >
      <TakeHeader copy={copy} />
      <div className={styles.poseField} data-beat-layout-item="true">
        <PoseSilhouette phase={0} className={styles.heroPose} />
        <NotationScore className={styles.introScore} />
        <span className={styles.poseFieldLabel}>POSE / SCORE</span>
      </div>
      <div className={styles.introCopy} data-beat-layout-item="true">
        <DisplayTitle copy={copy} />
        <p className={styles.bodyCopy}>{copy.body}</p>
        <p
          className={styles.beatStatement}
          data-visible={beat >= 1 ? "true" : "false"}
        >
          {copy.beats[1].title} — {copy.beats[1].body}
        </p>
        <p className={styles.caption}>{copy.caption}</p>
      </div>
    </div>
  );
}

function LegendGlyph({ id }: { id: LegendCopy["id"] }) {
  if (id === "space") {
    return (
      <svg viewBox="0 0 160 120" aria-hidden="true">
        <polygon className={styles.legendOpen} points="20,94 56,26 92,94" />
        <polygon className={styles.legendSolid} points="74,94 110,26 146,94" />
      </svg>
    );
  }
  if (id === "body") {
    return (
      <svg viewBox="0 0 160 120" aria-hidden="true">
        <line className={styles.legendStaff} x1="54" y1="14" x2="54" y2="106" />
        <line className={styles.legendStaff} x1="80" y1="14" x2="80" y2="106" />
        <line className={styles.legendStaff} x1="106" y1="14" x2="106" y2="106" />
        <polygon className={styles.legendSolid} points="86,86 104,50 122,86" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 160 120" aria-hidden="true">
      <rect className={styles.legendOpen} x="28" y="64" width="34" height="34" />
      <rect className={styles.legendSolid} x="92" y="20" width="34" height="78" />
      <line className={styles.legendStaff} x1="14" y1="104" x2="144" y2="104" />
    </svg>
  );
}

function SceneTwo({ copy, beat }: { copy: SceneCopy; beat: number }) {
  const legends = copy.legends ?? [];
  return (
    <div
      className={[styles.composition, styles.symbolKey].join(" ")}
      data-composition="symbol-key"
      data-visible-beat={beat}
      data-beat-layout-container="true"
      data-beat-layout-mode="reserved"
    >
      <TakeHeader copy={copy} />
      <div className={styles.keyTitle} data-beat-layout-item="true">
        <DisplayTitle copy={copy} />
        <p className={styles.bodyCopy}>{copy.body}</p>
        <p className={styles.caption}>{copy.caption}</p>
      </div>
      <div className={styles.legendStack} data-beat-layout-item="true">
        {legends.map((legend, index) => (
          <article
            key={legend.id}
            className={styles.legendDimension}
            data-legend-dimension="true"
            data-visible={index <= beat ? "true" : "false"}
            data-beat-layout-item="true"
          >
            <div className={styles.legendIndex}>{legend.index}</div>
            <div className={styles.legendIcon}>
              <LegendGlyph id={legend.id} />
            </div>
            <div className={styles.legendText}>
              <span>{legend.label}</span>
              <strong>{legend.title}</strong>
              <p>{legend.body}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function SceneThree({ copy, beat }: { copy: SceneCopy; beat: number }) {
  const phases = copy.phases ?? [];
  return (
    <div
      className={[styles.composition, styles.splitScore].join(" ")}
      data-composition="split-score"
      data-visible-beat={beat}
      data-beat-layout-container="true"
      data-beat-layout-mode="reserved"
    >
      <TakeHeader copy={copy} />
      <div className={styles.scoreColumn} data-beat-layout-item="true">
        <NotationScore phase={beat} showCursor className={styles.motionScore} />
        <span className={styles.readDirection}>{copy.eyebrow}</span>
      </div>
      <div className={styles.motionColumn} data-beat-layout-item="true">
        <DisplayTitle copy={copy} />
        <div className={styles.poseSequence}>
          {phases.map((phase, index) => (
            <article
              key={phase.index}
              className={styles.poseFrame}
              data-visible={index <= beat ? "true" : "false"}
              data-current={index === beat ? "true" : "false"}
              data-beat-layout-item="true"
            >
              <PoseSilhouette phase={index} active={index === beat} />
              <span>{phase.index}</span>
              <strong>{phase.label}</strong>
              <p>{phase.body}</p>
            </article>
          ))}
        </div>
        <div className={styles.motionNote}>
          <p className={styles.bodyCopy}>{copy.body}</p>
          <p className={styles.caption}>{copy.caption}</p>
        </div>
      </div>
    </div>
  );
}

function SceneFour({ copy, beat }: { copy: SceneCopy; beat: number }) {
  const reconstructions = copy.reconstructions ?? [];
  return (
    <div
      className={[styles.composition, styles.reconstructionStage].join(" ")}
      data-composition="reconstruction-stage"
      data-visible-beat={beat}
      data-beat-layout-container="true"
      data-beat-layout-mode="reserved"
    >
      <TakeHeader copy={copy} />
      <div className={styles.reconstructionField} data-beat-layout-item="true">
        <NotationScore className={styles.reconstructionScore} />
        {reconstructions.map((item, index) => (
          <article
            key={item.label}
            className={[
              styles.reconstruction,
              index === 0 ? styles.reconstructionA : styles.reconstructionB,
            ].join(" ")}
            data-reconstruction="true"
            data-visible={index + 1 <= beat ? "true" : "false"}
            data-beat-layout-item="true"
          >
            <PoseSilhouette phase={index + 1} active={index + 1 === beat} />
            <div>
              <span>{item.label}</span>
              <strong>{item.title}</strong>
              <p>{item.body}</p>
            </div>
          </article>
        ))}
        <span className={styles.sharedScoreLabel}>SAME SCORE</span>
      </div>
      <div className={styles.reconstructionCopy} data-beat-layout-item="true">
        <DisplayTitle copy={copy} />
        <p className={styles.bodyCopy}>{copy.body}</p>
        <aside
          className={styles.evidenceBoundary}
          data-evidence-boundary="true"
          data-visible={beat >= 2 ? "true" : "false"}
        >
          <span>EVIDENCE BOUNDARY</span>
          <p>{copy.boundary}</p>
        </aside>
        <p className={styles.caption}>{copy.caption}</p>
      </div>
    </div>
  );
}

function SceneFive({ copy }: { copy: SceneCopy }) {
  return (
    <div
      className={[styles.composition, styles.doubleExposure].join(" ")}
      data-composition="double-exposure"
      data-visible-beat="0"
    >
      <TakeHeader copy={copy} />
      <div className={styles.exposureField} data-beat-layout-item="true">
        <PoseSilhouette phase={2} className={styles.exposurePoseA} />
        <PoseSilhouette phase={1} className={styles.exposurePoseB} />
        <NotationScore className={styles.exposureScore} />
        <span className={styles.exposureRoute}>{copy.eyebrow}</span>
      </div>
      <div className={styles.finalCopy} data-beat-layout-item="true">
        <DisplayTitle copy={copy} />
        <p className={styles.bodyCopy}>{copy.body}</p>
        <p className={styles.finalSource}>{copy.sourceLine}</p>
        <p className={styles.caption}>{copy.caption}</p>
      </div>
    </div>
  );
}

function ScenePanel({
  sceneId,
  beat,
  language,
  isThumbnail,
}: {
  sceneId: SceneId;
  beat: number;
  language: Language;
  isThumbnail: boolean;
}) {
  const copy = SCENES[sceneId][language];
  const visibleBeat = isThumbnail
    ? copy.beats.length - 1
    : clampBeat(sceneId, beat);

  return (
    <section className={styles.scene} data-scene={sceneId} aria-label={copy.nav}>
      {sceneId === 1 && <SceneOne copy={copy} beat={visibleBeat} />}
      {sceneId === 2 && <SceneTwo copy={copy} beat={visibleBeat} />}
      {sceneId === 3 && <SceneThree copy={copy} beat={visibleBeat} />}
      {sceneId === 4 && <SceneFour copy={copy} beat={visibleBeat} />}
      {sceneId === 5 && <SceneFive copy={copy} />}
    </section>
  );
}

function NotationTurntableNav({
  currentScene,
  language,
  onNavigate,
}: {
  currentScene: SceneId;
  language: Language;
  onNavigate?: (scene: number, beat: number) => void;
}) {
  const [expandedScene, setExpandedScene] = useState<SceneId | null>(null);

  const navigate = (target: SceneId) => {
    setExpandedScene(target);
    onNavigate?.(target, 0);
  };

  const handleClick = (event: MouseEvent<HTMLButtonElement>, target: SceneId) => {
    event.stopPropagation();
    navigate(target);
  };

  const handlePointerDown = (event: PointerEvent<HTMLElement>) => {
    event.stopPropagation();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    event.stopPropagation();
    if (event.repeat) {
      event.preventDefault();
      return;
    }
    let target: SceneId | null = null;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      target = clampScene(Math.min(5, currentScene + 1));
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      target = clampScene(Math.max(1, currentScene - 1));
    } else if (event.key === "Home") {
      target = 1;
    } else if (event.key === "End") {
      target = 5;
    }
    if (!target) return;
    event.preventDefault();
    navigate(target);
  };

  return (
    <nav
      className={styles.notationTurntable}
      aria-label={language === "zh" ? "舞谱转盘场景导航" : "Notation turntable scene navigation"}
      tabIndex={0}
      data-topic-navigation="true"
      data-navigation-geometry="object-controller"
      data-navigation-carrier="notation-turntable"
      data-navigation-invocation="click-expand"
      data-navigation-feedback="typographic-emphasis"
      data-expanded-scene={expandedScene ?? "none"}
      onKeyDown={handleKeyDown}
      onPointerDown={handlePointerDown}
      onClick={(event) => event.stopPropagation()}
      onTouchStart={(event) => event.stopPropagation()}
      onWheel={(event) => event.stopPropagation()}
    >
      <svg className={styles.turntableStaff} viewBox="0 0 240 240" aria-hidden="true">
        <circle cx="120" cy="120" r="92" />
        <circle cx="120" cy="120" r="55" />
        <line x1="120" y1="18" x2="120" y2="222" />
        <line x1="109" y1="48" x2="109" y2="192" />
        <line x1="131" y1="48" x2="131" y2="192" />
      </svg>
      <span className={styles.turntableLabel}>TAKE</span>
      <div className={styles.turntableMarks}>
        {SCENE_IDS.map((sceneId) => {
          const copy = SCENES[sceneId][language];
          const isCurrent = sceneId === currentScene;
          const isExpanded = sceneId === expandedScene;
          return (
            <button
              key={sceneId}
              type="button"
              className={styles.turntableMark}
              aria-label={
                language === "zh"
                  ? `打开第 ${sceneId} 段：${copy.nav}`
                  : `Open take ${sceneId}: ${copy.nav}`
              }
              aria-current={isCurrent ? "step" : undefined}
              data-current={isCurrent ? "true" : "false"}
              data-expanded={isExpanded ? "true" : "false"}
              onPointerDown={handlePointerDown}
              onClick={(event) => handleClick(event, sceneId)}
            >
              <span className={styles.turntableNumber}>0{sceneId}</span>
              <span className={styles.turntableGlyph} aria-hidden="true">
                <i />
                <i />
              </span>
              <span className={styles.turntableName}>{copy.nav}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

export default function DanceNotation({
  scene,
  beat,
  language,
  isThumbnail,
  reducedMotion,
  onNavigate,
}: BespokeStyleProps) {
  const currentScene = clampScene(scene);
  const motionDisabled = reducedMotion || isThumbnail;
  const rootStyle = {
    "--dance-active-scene": currentScene,
  } as CSSProperties;

  return (
    <div
      className={[styles.root, motionDisabled ? styles.noMotion : ""]
        .filter(Boolean)
        .join(" ")}
      data-testid="dance-notation-root"
      data-motion={motionDisabled ? "off" : "on"}
      data-scene={currentScene}
      lang={language === "zh" ? "zh-CN" : "en"}
      style={rootStyle}
    >
      <SpatialSceneTrack
        scene={currentScene}
        beat={beat}
        transitionKind="focus-swap"
        transitionMap={TRANSITION_MAP}
        transitionDurationMs={620}
        reducedMotion={motionDisabled}
        beatLayoutModes={BEAT_LAYOUT_MODES}
        className={styles.track}
        renderScene={(sceneId, sceneBeat) => (
          <ScenePanel
            sceneId={clampScene(sceneId)}
            beat={sceneBeat}
            language={language}
            isThumbnail={isThumbnail}
          />
        )}
      />

      {!isThumbnail && (
        <NotationTurntableNav
          currentScene={currentScene}
          language={language}
          onNavigate={onNavigate}
        />
      )}
    </div>
  );
}

export const danceNotationTopic = defineStyleTopic({
  id: "dance-notation",
  topic: {
    en: "Dance Notation",
    zh: "舞谱",
  },
  model: "GPT-5.5",
  component: DanceNotation,
  getMetadata,
  navigation: {
    geometry: "object-controller",
    carrier: "notation-turntable",
    invocation: "click-expand",
    feedback: "typographic-emphasis",
  },
  sources: DANCE_NOTATION_SOURCES,
  transitionScore: DANCE_NOTATION_TRANSITION_SCORE,
});

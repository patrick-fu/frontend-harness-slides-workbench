import type { CSSProperties, ReactNode } from "react";
import type { BespokeStyleProps, StyleMetadata } from "../types";
import { defineStyleTopic } from "./topic";
import SpatialSceneTrack from "./SpatialSceneTrack";
import type { BeatLayoutMode, SceneTransitionMap } from "./SpatialSceneTrack";
import { useFLIP } from "../hooks/useFLIP";
import styles from "./chapter-zero.module.css";

/* ── Type & font constants ─────────────────────────────────────────── */
const FONT_TITLE = '"Bebas Neue", "Noto Serif SC", serif';
const FONT_CREDIT = '"Barlow Condensed", "Noto Sans SC", sans-serif';
const WARM = "#e9a24f"; // the single warm highlight drawn from the still

const TRANSITIONS: SceneTransitionMap = {
  "1->2": "fade",
  "2->3": "scale-fade",
  "3->4": "fade",
  "4->5": "fade",
};

const BEAT_LAYOUT_MODES: Partial<Record<number, BeatLayoutMode>> = {
  1: "motion",
  3: "motion",
};

const TAGS = [
  "cinematic",
  "atmospheric",
  "reverent",
  "letterbox",
  "title-card",
  "film-poster",
  "dark",
  "warm-black",
  "sparse",
  "slow-motion",
  "chapter",
  "opening-credit",
];

/* ── Bilingual content ─────────────────────────────────────────────── */
const COPY = {
  en: {
    name: "Widescreen Title Card",
    topic: "Chapter Zero",
    density: "Cinematic",
    reelTag: "REEL 00",
    whisper: "a graded still surfaces from black",
    title: "CHAPTER ZERO",
    kicker: "an opening credit",
    premise1: "Before the first word, there is the dark.",
    premise2: "Everything you will read begins right here.",
    castHead: "FEATURING",
    cast1: "an idea not yet spoken",
    cast2: "the silence that holds it",
    castHighlight: "and the light to come",
    closing: "END OF PRELUDE",
    scenes: [
      {
        id: 1,
        title: "Fade In",
        beats: [
          { id: 0, action: "Letterbox opens", title: "Into the dark", body: "Deep warm-black bars frame the void." },
          { id: 1, action: "Still emerges", title: "A graded still", body: "The scene surfaces from black." },
        ],
      },
      {
        id: 2,
        title: "The Title",
        beats: [
          { id: 0, action: "Title settles", title: "Chapter Zero", body: "The film-poster title takes the frame." },
        ],
      },
      {
        id: 3,
        title: "The Premise",
        beats: [
          { id: 0, action: "A credit line", title: "Before the word", body: "A recessive line drifts beneath." },
          { id: 1, action: "Slow push", title: "The dark holds", body: "A Ken Burns push settles the still." },
        ],
      },
      {
        id: 4,
        title: "The Cast",
        beats: [
          { id: 0, action: "Credits stack", title: "A sparse cast", body: "One warm highlight from the still." },
        ],
      },
      {
        id: 5,
        title: "Cut to Black",
        beats: [
          { id: 0, action: "Light dims", title: "It lingers", body: "The title holds as the light fades." },
        ],
      },
    ],
  },
  zh: {
    name: "宽屏标题卡",
    topic: "第零章",
    density: "电影感",
    reelTag: "第 00 卷",
    whisper: "一帧调色影像自黑暗中浮现",
    title: "第零章",
    kicker: "开场字幕",
    premise1: "在第一个字之前，只有黑暗。",
    premise2: "你将读到的一切，皆从此处开始。",
    castHead: "出演",
    cast1: "一个尚未说出的念头",
    cast2: "承托它的静默",
    castHighlight: "以及即将到来的光",
    closing: "序章终",
    scenes: [
      {
        id: 1,
        title: "淡入",
        beats: [
          { id: 0, action: "信箱框开启", title: "没入黑暗", body: "深暖黑的黑边框住虚空。" },
          { id: 1, action: "影像浮现", title: "一帧调色画面", body: "场景自黑暗中浮出。" },
        ],
      },
      {
        id: 2,
        title: "标题",
        beats: [
          { id: 0, action: "标题落定", title: "第零章", body: "电影海报式标题占据画面。" },
        ],
      },
      {
        id: 3,
        title: "前提",
        beats: [
          { id: 0, action: "一行字幕", title: "在言语之前", body: "一行低调的字幕在下方浮动。" },
          { id: 1, action: "缓慢推进", title: "黑暗仍在", body: "肯·伯恩斯式推镜让画面沉淀。" },
        ],
      },
      {
        id: 4,
        title: "演职",
        beats: [
          { id: 0, action: "字幕堆叠", title: "稀疏的演职", body: "仅有一处取自画面的暖光。" },
        ],
      },
      {
        id: 5,
        title: "转黑",
        beats: [
          { id: 0, action: "灯光渐暗", title: "余韵未散", body: "标题停留，光渐渐熄灭。" },
        ],
      },
    ],
  },
};

type Copy = typeof COPY.en;

/* ── Text style tokens (cqw/cqh only) ──────────────────────────────── */
const titleHero: CSSProperties = {
  fontFamily: FONT_TITLE,
  fontSize: "15cqh",
  lineHeight: 0.9,
  letterSpacing: "0.6cqw",
  color: "#f6efe1",
  textShadow: "0 0.4cqh 3cqh rgba(0,0,0,0.6)",
};
const titleMedium: CSSProperties = {
  fontFamily: FONT_TITLE,
  fontSize: "8.5cqh",
  lineHeight: 0.92,
  letterSpacing: "0.35cqw",
  color: "#f2ead9",
  textShadow: "0 0.3cqh 2.2cqh rgba(0,0,0,0.55)",
};
const titleSmall: CSSProperties = {
  fontFamily: FONT_TITLE,
  fontSize: "5.4cqh",
  lineHeight: 0.95,
  letterSpacing: "0.3cqw",
  color: "#e9e0cd",
};
const reelStyle: CSSProperties = {
  fontFamily: FONT_CREDIT,
  fontWeight: 600,
  fontSize: "1.9cqh",
  letterSpacing: "0.9cqw",
  textTransform: "uppercase",
  color: "#c9bfa8",
};
const whisperStyle: CSSProperties = {
  fontFamily: FONT_CREDIT,
  fontWeight: 300,
  fontSize: "2.1cqh",
  letterSpacing: "0.25cqw",
  color: "rgba(224,214,193,0.62)",
  maxWidth: "52cqw",
};
const kickerStyle: CSSProperties = {
  fontFamily: FONT_CREDIT,
  fontWeight: 400,
  fontSize: "2cqh",
  letterSpacing: "0.8cqw",
  textTransform: "uppercase",
  color: "rgba(224,214,193,0.55)",
};
const premiseStyle: CSSProperties = {
  fontFamily: FONT_CREDIT,
  fontWeight: 300,
  fontSize: "3.1cqh",
  lineHeight: 1.25,
  letterSpacing: "0.12cqw",
  color: "rgba(232,223,203,0.9)",
  maxWidth: "58cqw",
};
const premiseFaint: CSSProperties = { ...premiseStyle, color: "rgba(232,223,203,0.26)" };
const castHeadStyle: CSSProperties = {
  fontFamily: FONT_CREDIT,
  fontWeight: 600,
  fontSize: "1.8cqh",
  letterSpacing: "1cqw",
  textTransform: "uppercase",
  color: "rgba(201,191,168,0.7)",
};
const castLineStyle: CSSProperties = {
  fontFamily: FONT_CREDIT,
  fontWeight: 300,
  fontSize: "3cqh",
  lineHeight: 1.35,
  letterSpacing: "0.1cqw",
  color: "rgba(230,221,201,0.82)",
};
const castWarmStyle: CSSProperties = { ...castLineStyle, color: WARM, fontWeight: 400 };
const closingStyle: CSSProperties = {
  fontFamily: FONT_CREDIT,
  fontWeight: 400,
  fontSize: "2.2cqh",
  letterSpacing: "0.9cqw",
  textTransform: "uppercase",
  color: "rgba(214,205,185,0.6)",
};

/* ── Cinematic frame: letterbox bars + graded still as ground ──────── */
interface FrameProps {
  kenBurns?: boolean;
  veil?: number | null;
  dim?: "none" | "anim";
  reduce: boolean;
  children: ReactNode;
}

function Frame({ kenBurns = false, veil = null, dim = "none", reduce, children }: FrameProps) {
  return (
    <div className={styles.frame}>
      <div className={styles.bar} />
      <div className={styles.band}>
        <div className={styles.still}>
          <div
            className={`${styles.stillImage} ${kenBurns && !reduce ? styles.kenburns : ""}`}
          />
          <div className={styles.grain} />
          <div className={styles.vignette} />
          {veil != null && (
            <div
              className={styles.emergeVeil}
              style={{ opacity: veil, transitionDuration: reduce ? "0s" : "1.8s" }}
            />
          )}
          {dim === "anim" && <div className={reduce ? styles.dimStatic : styles.dim} />}
        </div>
        <div className={styles.content}>{children}</div>
      </div>
      <div className={styles.bar} />
    </div>
  );
}

/* ── Scenes ────────────────────────────────────────────────────────── */
interface SceneProps {
  beat: number;
  isActive: boolean;
  language: "en" | "zh";
  reduce: boolean;
}

// Scene 1 — Fade in: letterbox opens, a graded still emerges. (motion)
function Scene1({ beat, isActive, language, reduce }: SceneProps) {
  const c: Copy = COPY[language];
  const { ref } = useFLIP<HTMLDivElement>({
    watch: [beat],
    disabled: reduce || !isActive,
    duration: 520,
    easing: "cubic-bezier(0.34, 1.56, 0.64, 1)",
    selector: '[data-beat-layout-item="true"]',
  });
  const veil = beat >= 1 ? 0.1 : 0.82;
  const stack: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    height: "100%",
    justifyContent: "flex-end",
    ...(beat >= 1
      ? { alignItems: "flex-start", gap: "2.6cqh", paddingBottom: "3cqh" }
      : { alignItems: "center", gap: "1.4cqh", paddingBottom: "7cqh" }),
  };
  return (
    <Frame veil={veil} reduce={reduce}>
      <div
        ref={ref}
        data-beat-layout-container="true"
        data-beat-layout-mode="motion"
        style={stack}
      >
        <span data-beat-layout-item="true" style={reelStyle}>
          {c.reelTag}
        </span>
        <span data-beat-layout-item="true" style={whisperStyle}>
          {c.whisper}
        </span>
      </div>
    </Frame>
  );
}

// Scene 2 — The title: film-poster title settles into the frame.
function Scene2({ language, reduce }: SceneProps) {
  const c: Copy = COPY[language];
  return (
    <Frame reduce={reduce}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          gap: "3cqh",
          textAlign: "center",
        }}
      >
        <h1 className={styles.titleIn} style={titleHero}>
          {c.title}
        </h1>
        <div
          className={styles.subIn}
          style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1.6cqh" }}
        >
          <span style={{ width: "9cqw", height: "0.18cqh", background: "rgba(233,162,79,0.6)" }} />
          <span style={kickerStyle}>{c.kicker}</span>
        </div>
      </div>
    </Frame>
  );
}

// Scene 3 — The premise: a recessive credit line, still drifts (Ken Burns). (motion)
function Scene3({ beat, isActive, language, reduce }: SceneProps) {
  const c: Copy = COPY[language];
  const { ref } = useFLIP<HTMLDivElement>({
    watch: [beat],
    disabled: reduce || !isActive,
    duration: 560,
    easing: "cubic-bezier(0.16, 1, 0.3, 1)",
    selector: '[data-beat-layout-item="true"]',
  });
  const lines: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    ...(beat >= 1 ? { gap: "2.4cqh", paddingBottom: "6cqh" } : { gap: "0.8cqh", paddingBottom: "2cqh" }),
  };
  return (
    <Frame kenBurns veil={0.04} reduce={reduce}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: "100%",
          height: "100%",
        }}
      >
        <h2 style={titleMedium}>{c.title}</h2>
        <div ref={ref} data-beat-layout-container="true" data-beat-layout-mode="motion" style={lines}>
          <p data-beat-layout-item="true" style={premiseStyle}>
            {c.premise1}
          </p>
          <p data-beat-layout-item="true" style={beat >= 1 ? premiseStyle : premiseFaint}>
            {c.premise2}
          </p>
        </div>
      </div>
    </Frame>
  );
}

// Scene 4 — The cast: sparse credit stack, one warm highlight from the still.
function Scene4({ language, reduce }: SceneProps) {
  const c: Copy = COPY[language];
  return (
    <Frame veil={0.05} reduce={reduce}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          gap: "2.2cqh",
        }}
      >
        <h2 className={styles.markerIn} style={titleSmall}>
          {c.title}
        </h2>
        <div
          className={styles.creditIn}
          style={{ display: "flex", flexDirection: "column", gap: "1.1cqh" }}
        >
          <span style={castHeadStyle}>{c.castHead}</span>
          <span style={castLineStyle}>{c.cast1}</span>
          <span style={castLineStyle}>{c.cast2}</span>
          <span style={castWarmStyle}>{c.castHighlight}</span>
        </div>
      </div>
    </Frame>
  );
}

// Scene 5 — Cut to black: title lingers, light dims.
function Scene5({ language, reduce }: SceneProps) {
  const c: Copy = COPY[language];
  return (
    <Frame dim="anim" veil={0.05} reduce={reduce}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          gap: "2.6cqh",
          textAlign: "center",
        }}
      >
        <h2 style={titleMedium}>{c.title}</h2>
        <span className={styles.creditIn} style={closingStyle}>
          {c.closing}
        </span>
      </div>
    </Frame>
  );
}

/* ── Metadata ──────────────────────────────────────────────────────── */
export function getMetadata(lang: "en" | "zh"): StyleMetadata {
  const c: Copy = COPY[lang];
  return {
    id: "widescreen-title-card",
    band: "contemporary-digital",
    name: c.name,
    theme: c.topic,
    densityLabel: c.density,
    heroScene: 2,
    colors: { bg: "#080604", ink: "#f3ebdd", panel: "#14110b" },
    typography: { header: "Bebas Neue", body: "Barlow Condensed" },
    tags: TAGS,
    fonts: [
      "Bebas Neue:wght@400",
      "Barlow Condensed:wght@300;400;600",
      "cjk:Noto Serif SC:wght@500;700",
      "cjk:Noto Sans SC:wght@300;400",
    ],
    scenes: c.scenes,
  };
}

/* ── Root component ────────────────────────────────────────────────── */
export default function ChapterZeroV3({
  scene,
  beat,
  language,
  isThumbnail,
  reducedMotion,
}: BespokeStyleProps) {
  const reduce = reducedMotion || isThumbnail;
  return (
    <div className={styles.root} data-rm={reduce ? "true" : undefined}>
      <SpatialSceneTrack
        scene={scene}
        beat={beat}
        transitionKind="fade"
        transitionMap={TRANSITIONS}
        reducedMotion={reduce}
        beatLayoutModes={BEAT_LAYOUT_MODES}
        renderScene={(sceneId, sceneBeat, isActive) => {
          const p: SceneProps = { beat: sceneBeat, isActive, language, reduce };
          switch (sceneId) {
            case 1:
              return <Scene1 {...p} />;
            case 2:
              return <Scene2 {...p} />;
            case 3:
              return <Scene3 {...p} />;
            case 4:
              return <Scene4 {...p} />;
            default:
              return <Scene5 {...p} />;
          }
        }}
      />
    </div>
  );
}

export const ChapterZeroTopic = defineStyleTopic({
  id: "chapter-zero",
  topic: { en: "Chapter Zero", zh: "第零章" },
  model: "Claude Opus 4.8",
  component: ChapterZeroV3,
  getMetadata,
});

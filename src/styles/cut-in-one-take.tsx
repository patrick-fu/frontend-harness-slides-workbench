import { useEffect } from "react";
import type { BespokeStyleProps, StyleMetadata } from "../types";
import { defineStyleTopic } from "./topic";
import SpatialSceneTrack from "./SpatialSceneTrack";
import type { SceneTransitionMap } from "./SpatialSceneTrack";
import { useFLIP } from "../hooks/useFLIP";
import styles from "./cut-in-one-take.module.css";

/* ── Duotone Session · v3 "Cut in One Take" ──────────────────────────────
   Blue Note-style record of a single perfect take. Warm black ground, ONE
   flat cobalt spot ink over a B&W-feeling frame, enormous condensed gothic,
   sparse high-contrast serif credits. Flat ink only. cqw/cqh only. */

type Lang = "en" | "zh";

const SPOT = "#2e56e6"; // single flat spot ink: cobalt
const BG = "#0d0a06"; // rich warm black — never pure screen black
const INK = "#f3ece0"; // warm printed off-white
const PANEL = "#100b06";

/* ── fonts ── */
const FONT_ID = "ds-fonts-v3-22";
const FONT_HREF =
  "https://fonts.googleapis.com/css2?" +
  "family=Oswald:wght@500;600;700&" +
  "family=Playfair+Display:ital,wght@0,600;0,700;1,600&" +
  "family=Noto+Sans+SC:wght@700;900&" +
  "family=Noto+Serif+SC:wght@600;700&display=swap";

function useFonts() {
  useEffect(() => {
    if (document.getElementById(FONT_ID)) return;
    const link = document.createElement("link");
    link.id = FONT_ID;
    link.rel = "stylesheet";
    link.href = FONT_HREF;
    document.head.appendChild(link);
  }, []);
}

/* ── copy ── */
interface Copy {
  session: string; // scene1 kicker
  live: string; // scene1 credit
  signKicker: string; // scene1 beat1 line
  signBody: string;
  s1big: string[]; // huge title lines
  s2tag: string;
  s2title: string;
  fields: { key: string; val: string }[]; // 4
  s3tag: string;
  s3rolling: string[]; // beat0 huge
  s3take: string[]; // beat1 huge
  s3note: string;
  s4tag: string;
  s4head: string;
  tracks: { num: string; name: string; time: string }[]; // 4
  keeperIdx: number;
  s5stamp: string;
  s5credits: string[];
  s5head: string[];
  navSide: string;
  navNames: string[]; // 5
}

const EN: Copy = {
  session: "Session 07 · Live to Tape",
  live: "No overdubs. No punch-ins.",
  signKicker: "One pass, printed as played",
  signBody: "The record is the moment it happened.",
  s1big: ["ONE", "TAKE"],
  s2tag: "The Setup",
  s2title: "Room Tone",
  fields: [
    { key: "Studio", val: "Room B" },
    { key: "Date", val: "07 · 08" },
    { key: "Engineer", val: "R. Vance" },
    { key: "Format", val: "1/2\u2033 · 15 ips" },
  ],
  s3tag: "The Take",
  s3rolling: ["ROLLING"],
  s3take: ["TAKE 1"],
  s3note: "First and only \u2014 the slate claps, we commit.",
  s4tag: "Side A",
  s4head: "The Groove",
  tracks: [
    { num: "A1", name: "Count Off", time: "0:48" },
    { num: "A2", name: "Downbeat", time: "3:12" },
    { num: "A3", name: "The Keeper", time: "4:57" },
    { num: "A4", name: "Fade Room", time: "2:03" },
  ],
  keeperIdx: 2,
  s5stamp: "Pressed",
  s5credits: [
    "Recorded live to tape",
    "Engineered by R. Vance",
    "Mastered from take 1",
  ],
  s5head: ["ONE", "TAKE"],
  navSide: "Side A",
  navNames: ["Sleeve", "Setup", "Take", "Groove", "Pressed"],
};

const ZH: Copy = {
  session: "\u7b2c 07 \u573a \u00b7 \u76f4\u5f55\u6bcd\u5e26",
  live: "\u4e0d\u53e0\u5f55\uff0c\u4e0d\u8865\u5f55\u3002",
  signKicker: "\u4e00\u904d\u6210\u578b\uff0c\u539f\u6837\u5f55\u5236",
  signBody: "\u5531\u7247\u5c31\u662f\u5b83\u53d1\u751f\u7684\u90a3\u4e00\u523b\u3002",
  s1big: ["\u4e00\u6761\u8fc7"],
  s2tag: "\u67b6\u8bbe",
  s2title: "\u623f\u95f4\u58f0",
  fields: [
    { key: "\u68da\u53f7", val: "B \u623f" },
    { key: "\u65e5\u671f", val: "07 \u00b7 08" },
    { key: "\u5f55\u97f3\u5e08", val: "\u6587\u65af" },
    { key: "\u683c\u5f0f", val: "1/2\u2033 \u00b7 15 ips" },
  ],
  s3tag: "\u5f00\u5f55",
  s3rolling: ["\u8f6c\u52a8\u4e2d"],
  s3take: ["\u7b2c1\u6761"],
  s3note: "\u4ec5\u6b64\u4e00\u6761 \u2014 \u6253\u677f\u843d\u4e0b\uff0c\u5c31\u6b64\u5b9a\u6848\u3002",
  s4tag: "A \u9762",
  s4head: "\u7eb9\u69fd",
  tracks: [
    { num: "A1", name: "\u6570\u62cd", time: "0:48" },
    { num: "A2", name: "\u91cd\u62cd", time: "3:12" },
    { num: "A3", name: "\u5b9a\u6848\u6761", time: "4:57" },
    { num: "A4", name: "\u6de1\u51fa", time: "2:03" },
  ],
  keeperIdx: 2,
  s5stamp: "\u5df2\u538b\u5236",
  s5credits: [
    "\u73b0\u573a\u76f4\u5f55\u6bcd\u5e26",
    "\u5f55\u97f3\uff1a\u6587\u65af",
    "\u7531\u7b2c 1 \u6761\u6bcd\u7248\u538b\u5236",
  ],
  s5head: ["\u4e00\u6761\u8fc7"],
  navSide: "A \u9762",
  navNames: ["\u5c01\u5957", "\u67b6\u8bbe", "\u5f00\u5f55", "\u7eb9\u69fd", "\u538b\u5236"],
};

const COPY: Record<Lang, Copy> = { en: EN, zh: ZH };

/* ── duotone frame (evokes a single-ink photo — NO external image) ── */
function DuotoneFrame({ className }: { className: string }) {
  return (
    <div className={`${styles.frame} ${className}`} aria-hidden>
      <div className={styles.sil}>
        <span className={styles.silBody} />
        <span className={styles.silHead} />
        <span className={styles.micStand} />
        <span className={styles.micHead} />
      </div>
      <div className={styles.grain} />
    </div>
  );
}

interface SceneProps {
  beat: number;
  isActive: boolean;
  lang: Lang;
  reducedMotion: boolean;
  isThumbnail: boolean;
}

/* ── scene 1 · the sleeve (motion, 2 beats) ── */
function SceneSleeve({ beat, isActive, lang, reducedMotion, isThumbnail }: SceneProps) {
  const c = COPY[lang];
  const { ref } = useFLIP<HTMLDivElement>({
    watch: [beat],
    disabled: reducedMotion || isThumbnail || !isActive,
    duration: 480,
    easing: "cubic-bezier(0.34, 1.56, 0.64, 1)",
    selector: '[data-beat-layout-item="true"]',
  });
  return (
    <>
      <DuotoneFrame className={styles.s1frame} />
      <div
        ref={ref}
        className={styles.s1block}
        data-beat-layout-container="true"
        data-beat-layout-mode="motion"
      >
        <span className={`${styles.kicker} ${styles.snap}`} data-beat-layout-item="true">
          <i className={styles.tick} />
          {c.session}
        </span>
        {c.s1big.map((line) => (
          <h1
            key={line}
            className={`${styles.big} ${styles.bigLang} ${styles.snap2}`}
            data-lang={lang}
            data-beat-layout-item="true"
          >
            {line}
          </h1>
        ))}
        {beat >= 1 && (
          <p className={`${styles.credit} ${styles.snap}`} data-beat-layout-item="true">
            {c.signKicker}. {c.signBody}
          </p>
        )}
        {beat < 1 && (
          <p className={styles.credit} data-beat-layout-item="true">
            {c.live}
          </p>
        )}
      </div>
    </>
  );
}

/* ── scene 2 · the setup (reserved, 2 beats) ── */
function SceneSetup({ beat, lang }: SceneProps) {
  const c = COPY[lang];
  const lit = beat === 0 ? 1 : 3; // reserved slots, progressively lit
  return (
    <>
      <DuotoneFrame className={styles.s2frame} />
      <div className={styles.s2head}>
        <span className={`${styles.sceneTag} ${styles.snap}`}>{c.s2tag}</span>
        <h2
          className={`${styles.big} ${styles.bigLang} ${styles.snap2}`}
          data-lang={lang}
          style={{ fontSize: "7cqw" }}
        >
          {c.s2title}
        </h2>
      </div>
      <div
        className={styles.band}
        data-beat-layout-container="true"
        data-beat-layout-mode="reserved"
      >
        {c.fields.map((f, i) => (
          <div
            key={f.key}
            className={styles.field}
            data-lit={i <= lit}
            data-beat-layout-item="true"
          >
            <span className={styles.fieldKey}>{f.key}</span>
            <span className={styles.fieldVal}>{f.val}</span>
          </div>
        ))}
      </div>
    </>
  );
}

/* ── scene 3 · the take (motion, 2 beats) ── */
function SceneTake({ beat, isActive, lang, reducedMotion, isThumbnail }: SceneProps) {
  const c = COPY[lang];
  const { ref } = useFLIP<HTMLDivElement>({
    watch: [beat],
    disabled: reducedMotion || isThumbnail || !isActive,
    duration: 480,
    easing: "cubic-bezier(0.34, 1.56, 0.64, 1)",
    selector: '[data-beat-layout-item="true"]',
  });
  const lines = beat >= 1 ? c.s3take : c.s3rolling;
  return (
    <>
      <DuotoneFrame className={styles.s3frame} />
      <div
        ref={ref}
        className={styles.s3block}
        data-beat-layout-container="true"
        data-beat-layout-mode="motion"
      >
        {beat >= 1 && (
          <span className={`${styles.slate} ${styles.inkPop}`} data-beat-layout-item="true">
            <i className={styles.slateStripe} />
            {c.s3take[0]}
          </span>
        )}
        <span className={styles.sceneTag} data-beat-layout-item="true">
          {c.s3tag}
        </span>
        {lines.map((line) => (
          <h1
            key={line}
            className={`${styles.big} ${styles.bigLang}`}
            data-lang={lang}
            data-beat-layout-item="true"
          >
            {line}
          </h1>
        ))}
        {beat >= 1 && (
          <p className={styles.credit} data-beat-layout-item="true">
            {c.s3note}
          </p>
        )}
      </div>
    </>
  );
}

/* ── scene 4 · the groove (reserved, 2 beats) ── */
function SceneGroove({ beat, lang }: SceneProps) {
  const c = COPY[lang];
  return (
    <>
      <DuotoneFrame className={styles.s4frame} />
      <div className={styles.s4head}>
        <span className={`${styles.sceneTag} ${styles.snap}`}>{c.s4tag}</span>
        <h2
          className={`${styles.big} ${styles.bigLang} ${styles.snap2}`}
          data-lang={lang}
          style={{ fontSize: "7cqw" }}
        >
          {c.s4head}
        </h2>
      </div>
      <div className={styles.shelf}>
        <div
          className={styles.rows}
          data-beat-layout-container="true"
          data-beat-layout-mode="reserved"
        >
          {c.tracks.map((t, i) => (
            <div
              key={t.num}
              className={styles.row}
              data-keeper={i === c.keeperIdx}
              data-lit={beat >= 1}
              data-beat-layout-item="true"
            >
              <span className={styles.rowNum}>{t.num}</span>
              <span className={styles.rowTitle}>{t.name}</span>
              <span className={styles.rowTime}>{t.time}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

/* ── scene 5 · pressed (1 beat) ── */
function ScenePressed({ lang }: SceneProps) {
  const c = COPY[lang];
  return (
    <>
      <DuotoneFrame className={styles.s5frame} />
      <div className={styles.s5block}>
        {c.s5head.map((line) => (
          <h1
            key={line}
            className={`${styles.big} ${styles.bigLang} ${styles.snap}`}
            data-lang={lang}
          >
            {line}
          </h1>
        ))}
        <div className={`${styles.creditsSet} ${styles.snap2}`}>
          {c.s5credits.map((line) => (
            <p key={line} className={styles.creditLine}>
              {line}
            </p>
          ))}
        </div>
        <span className={`${styles.stamp} ${styles.inkPop}`}>{c.s5stamp}</span>
      </div>
    </>
  );
}

/* ── bespoke nav · LP track index (A1·A2·A3…), current track lit ── */
function TrackIndex({
  scene,
  lang,
  isThumbnail,
  onNavigate,
}: {
  scene: number;
  lang: Lang;
  isThumbnail: boolean;
  onNavigate?: (scene: number, beat: number) => void;
}) {
  if (isThumbnail) return null;
  const c = COPY[lang];
  return (
    <nav className={styles.nav} aria-label="LP track index">
      <span className={styles.navSide}>{c.navSide}</span>
      <div className={styles.navList}>
        {c.navNames.map((name, i) => {
          const target = i + 1;
          const current = target === scene;
          return (
            <button
              key={name}
              type="button"
              className={styles.navItem}
              data-cur={current}
              aria-current={current}
              onClick={(e) => {
                e.stopPropagation();
                onNavigate?.(target, 0);
              }}
            >
              <span className={styles.navDot} />
              <span className={styles.navNum}>{`A${target}`}</span>
              <span className={styles.navName}>{name}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

/* ── transitions ── */
const TRANSITIONS: SceneTransitionMap = {
  "1->2": "slide-y",
  "2->3": "hard-cut",
  "3->4": "slide-y",
  "4->5": "hard-cut",
};

/* ── component ── */
function CutInOneTakeV3({
  scene,
  beat,
  language,
  isThumbnail,
  reducedMotion,
  onNavigate,
}: BespokeStyleProps) {
  useFonts();
  const lang: Lang = language === "zh" ? "zh" : "en";
  const motionOff = reducedMotion || isThumbnail;

  const rootStyle = {
    ["--ds-bg" as string]: BG,
    ["--ds-ink" as string]: INK,
    ["--ds-spot" as string]: SPOT,
    ["--ds-panel" as string]: PANEL,
    ["--ds-gothic" as string]: "'Oswald', 'Noto Sans SC', sans-serif",
    ["--ds-serif" as string]: "'Playfair Display', 'Noto Serif SC', serif",
  } as React.CSSProperties;

  return (
    <div className={styles.root} style={rootStyle} data-motion={motionOff ? "off" : "on"}>
      <SpatialSceneTrack
        scene={scene}
        beat={beat}
        transitionKind="slide-y"
        transitionMap={TRANSITIONS}
        reducedMotion={motionOff}
        beatLayoutModes={{ 1: "motion", 2: "reserved", 3: "motion", 4: "reserved" }}
        renderScene={(sceneId, sceneBeat, isActive) => {
          const p: SceneProps = {
            beat: sceneBeat,
            isActive,
            lang,
            reducedMotion,
            isThumbnail,
          };
          if (sceneId === 1) return <SceneSleeve {...p} />;
          if (sceneId === 2) return <SceneSetup {...p} />;
          if (sceneId === 3) return <SceneTake {...p} />;
          if (sceneId === 4) return <SceneGroove {...p} />;
          return <ScenePressed {...p} />;
        }}
      />
      <TrackIndex
        scene={scene}
        lang={lang}
        isThumbnail={isThumbnail}
        onNavigate={onNavigate}
      />
    </div>
  );
}

/* ── metadata (EN + ZH structurally identical) ── */
export function getMetadata(lang: Lang): StyleMetadata {
  const en: StyleMetadata = {
    id: "duotone-session",
    band: "editorial-print",
    name: "Duotone Session",
    theme: "Cut in One Take",
    densityLabel: "Bold · Photographic",
    heroScene: 3,
    colors: { bg: BG, ink: INK, panel: PANEL },
    typography: { header: "Oswald", body: "Playfair Display" },
    tags: ["cool", "disciplined", "photo-first", "duotone", "condensed-gothic", "percussive"],
    fonts: ["Oswald", "Playfair Display", "cjk:Noto Sans SC", "cjk:Noto Serif SC"],
    scenes: [
      {
        id: 1,
        title: "The Sleeve",
        beats: [
          { id: 0, action: "Bleed", title: "One Take", body: "Live to tape — no overdubs, no punch-ins." },
          { id: 1, action: "Sign", title: "Session 07", body: "A single pass, printed exactly as played." },
        ],
      },
      {
        id: 2,
        title: "The Setup",
        beats: [
          { id: 0, action: "Patch", title: "Room Tone", body: "Ribbon mic up, tape rolling at fifteen ips." },
          { id: 1, action: "Log", title: "Session Data", body: "Studio, date, engineer, and format on the band." },
        ],
      },
      {
        id: 3,
        title: "The Take",
        beats: [
          { id: 0, action: "Roll", title: "Rolling", body: "Count it off — the whole thing goes down now." },
          { id: 1, action: "Slate", title: "Take 1", body: "First and only. The slate claps and we commit." },
        ],
      },
      {
        id: 4,
        title: "The Groove",
        beats: [
          { id: 0, action: "Cut", title: "Side A", body: "Four tracks pressed onto the shelf in order." },
          { id: 1, action: "Keep", title: "The Keeper", body: "One cut glows — the take that made the record." },
        ],
      },
      {
        id: 5,
        title: "Pressed",
        beats: [
          { id: 0, action: "Press", title: "Pressed", body: "Credits set, sleeve closed, the record is out." },
        ],
      },
    ],
  };

  const zh: StyleMetadata = {
    id: "duotone-session",
    band: "editorial-print",
    name: "Duotone Session",
    theme: "\u4e00\u6761\u8fc7",
    densityLabel: "\u6d53\u70c8 \u00b7 \u5f71\u50cf",
    heroScene: 3,
    colors: { bg: BG, ink: INK, panel: PANEL },
    typography: { header: "Oswald", body: "Playfair Display" },
    tags: ["\u51b7\u9759", "\u81ea\u5f8b", "\u5f71\u50cf\u4f18\u5148", "\u53cc\u8c03", "\u7a84\u4f53\u9ed1\u4f53", "\u987f\u632b\u611f"],
    fonts: ["Oswald", "Playfair Display", "cjk:Noto Sans SC", "cjk:Noto Serif SC"],
    scenes: [
      {
        id: 1,
        title: "\u5c01\u5957",
        beats: [
          { id: 0, action: "\u51fa\u8840", title: "\u4e00\u6761\u8fc7", body: "\u76f4\u5f55\u6bcd\u5e26 \u2014 \u4e0d\u53e0\u5f55\uff0c\u4e0d\u8865\u5f55\u3002" },
          { id: 1, action: "\u7b7e\u540d", title: "\u7b2c 07 \u573a", body: "\u4e00\u904d\u6210\u578b\uff0c\u539f\u6837\u5f55\u5236\u3002" },
        ],
      },
      {
        id: 2,
        title: "\u67b6\u8bbe",
        beats: [
          { id: 0, action: "\u63a5\u7ebf", title: "\u623f\u95f4\u58f0", body: "\u5e26\u5f0f\u8bdd\u7b52\u5c31\u4f4d\uff0c\u78c1\u5e26\u4ee5 15 ips \u8f6c\u52a8\u3002" },
          { id: 1, action: "\u8bb0\u5f55", title: "\u573a\u8bb0\u4fe1\u606f", body: "\u68da\u53f7\u3001\u65e5\u671f\u3001\u5f55\u97f3\u5e08\u4e0e\u683c\u5f0f\u5217\u5728\u5e26\u4e0a\u3002" },
        ],
      },
      {
        id: 3,
        title: "\u5f00\u5f55",
        beats: [
          { id: 0, action: "\u5f00\u673a", title: "\u8f6c\u52a8\u4e2d", body: "\u6570\u62cd\u8d77 \u2014 \u6574\u6bb5\u73b0\u5728\u4e00\u6b21\u5f55\u4e0b\u3002" },
          { id: 1, action: "\u6253\u677f", title: "\u7b2c 1 \u6761", body: "\u4ec5\u6b64\u4e00\u6761\u3002\u6253\u677f\u843d\u4e0b\uff0c\u5c31\u6b64\u5b9a\u6848\u3002" },
        ],
      },
      {
        id: 4,
        title: "\u7eb9\u69fd",
        beats: [
          { id: 0, action: "\u5207\u5206", title: "A \u9762", body: "\u56db\u9996\u66f2\u76ee\u6309\u5e8f\u538b\u8fdb\u67b6\u4e0a\u3002" },
          { id: 1, action: "\u7559\u7528", title: "\u5b9a\u6848\u6761", body: "\u4e00\u6761\u4eae\u8d77 \u2014 \u6210\u5c31\u5531\u7247\u7684\u90a3\u4e00\u6761\u3002" },
        ],
      },
      {
        id: 5,
        title: "\u538b\u5236",
        beats: [
          { id: 0, action: "\u538b\u7247", title: "\u5df2\u538b\u5236", body: "\u7f72\u540d\u843d\u5b9a\uff0c\u5c01\u5957\u5408\u62e2\uff0c\u5531\u7247\u53d1\u884c\u3002" },
        ],
      },
    ],
  };

  return lang === "zh" ? zh : en;
}

export const cutInOneTakeTopic = defineStyleTopic({
  id: "cut-in-one-take",
  topic: { en: "Cut in One Take", zh: "\u4e00\u6761\u8fc7" },
  model: "Claude-Opus-4.8",
  component: CutInOneTakeV3,
  getMetadata,
});

export default CutInOneTakeV3;

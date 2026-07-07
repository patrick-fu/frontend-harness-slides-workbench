import { useEffect } from "react";
import type { BespokeStyleProps, StyleMetadata } from "../types";
import { defineStyleVersion } from "./version";
import SpatialSceneTrack from "./SpatialSceneTrack";
import type { SceneTransitionMap } from "./SpatialSceneTrack";
import { useFLIP } from "../hooks/useFLIP";
import styles from "./21-festival-slow-ideas-v3.module.css";

/* ── Solar Biennale Poster · v3 "Festival of Slow Ideas" ──
   Warm parchment ground, one solar-yellow atmosphere, single deep indigo ink.
   Three type voices: Playfair Display (serif display), Archivo (sans
   annotation), Space Mono (data). Depth from light + hairline rules only.
   Slow, atmospheric motion. Sizing is cqw/cqh only. */

const FONT_LINK_ID = "solar-biennale-poster-v3-fonts";
const FONT_HREF =
  "https://fonts.googleapis.com/css2?" +
  "family=Archivo:wght@400;600;700&" +
  "family=Playfair+Display:ital,wght@0,400;0,700;0,800;1,400;1,700&" +
  "family=Space+Mono:wght@400;700&" +
  "family=Noto+Serif+SC:wght@400;700;900&display=swap";

function useFonts() {
  useEffect(() => {
    if (document.getElementById(FONT_LINK_ID)) return;
    const link = document.createElement("link");
    link.id = FONT_LINK_ID;
    link.rel = "stylesheet";
    link.href = FONT_HREF;
    document.head.appendChild(link);
  }, []);
}

const PALETTE = {
  parchment: "#F4E9CE",
  parchmentDeep: "#EBDCB6",
  ink: "#21285A",
  solar: "#F3C33C",
  solarSoft: "#F7D869",
  peach: "#F6D9C0",
};

const ROOT_VARS: React.CSSProperties = {
  ["--parchment" as string]: PALETTE.parchment,
  ["--parchment-deep" as string]: PALETTE.parchmentDeep,
  ["--ink" as string]: PALETTE.ink,
  ["--solar" as string]: PALETTE.solar,
  ["--solar-soft" as string]: PALETTE.solarSoft,
  ["--peach" as string]: PALETTE.peach,
  ["--serif" as string]: '"Playfair Display", "Noto Serif SC", Georgia, serif',
  ["--sans" as string]: '"Archivo", "Noto Serif SC", system-ui, sans-serif',
  ["--mono" as string]: '"Space Mono", "Noto Serif SC", monospace',
};

/* ── Bilingual rendered copy (visual layer) ── */
type Copy = typeof COPY.en;
const COPY = {
  en: {
    s1: {
      eyebrow: "A Cultural Festival · MMXXVI",
      titleLines: ["Festival of", "Slow Ideas"],
      foot: "Warm paper, a low sun, one idea held still.",
    },
    s2: {
      eyebrow: "The Theme",
      statementLines: ["In praise", "of slowness"],
      body:
        "One idea, held long enough to warm the whole room — a season to read, not to scan.",
      panelTop: "Theme No.",
      panelMark: "I",
      panelBottom: "Slow / Ideas",
    },
    s3: {
      eyebrow: "The Programme",
      rows: [
        { time: "09:00", title: "Morning Readings", place: "Sunlit Hall" },
        { time: "14:00", title: "Afternoon Studios", place: "East Court" },
        { time: "19:30", title: "Evening Address", place: "Lamp Room" },
      ],
    },
    s4: {
      eyebrow: "You Are Invited",
      day: "12",
      monthYear: "September · MMXXVI",
      cta: "Doors open when the light does. Come slowly.",
    },
    s5: {
      mark: "Come slowly.",
      colophon: "Festival of Slow Ideas · MMXXVI",
    },
  },
  zh: {
    s1: {
      eyebrow: "文化节 · 二〇二六",
      titleLines: ["慢想", "节"],
      foot: "暖纸，低阳，一念长留。",
    },
    s2: {
      eyebrow: "主题",
      statementLines: ["为缓慢", "辩护"],
      body: "一个念头，久留至暖满室内——这是细读的季节，而非速览。",
      panelTop: "主题 第",
      panelMark: "一",
      panelBottom: "慢 / 想",
    },
    s3: {
      eyebrow: "节目",
      rows: [
        { time: "09:00", title: "晨间朗读", place: "阳光大厅" },
        { time: "14:00", title: "午后工作坊", place: "东庭" },
        { time: "19:30", title: "夜间致辞", place: "灯室" },
      ],
    },
    s4: {
      eyebrow: "诚邀莅临",
      day: "12",
      monthYear: "九月 · 二〇二六",
      cta: "光亮时，门即开启。请缓步而来。",
    },
    s5: {
      mark: "缓步而来。",
      colophon: "慢想节 · 二〇二六",
    },
  },
};

interface SceneProps {
  beat: number;
  isActive: boolean;
  language: "en" | "zh";
  reducedMotion: boolean;
  isThumbnail: boolean;
}

/* ── Scene 1 · The Poster (1 beat) ── */
function SceneOne({ language }: SceneProps) {
  const c: Copy["s1"] = COPY[language].s1;
  return (
    <div className={`${styles.scene} ${styles.s1}`}>
      <div
        className={styles.bloom}
        style={{ top: "-16cqh", left: "24cqw", width: "58cqw", height: "58cqw" }}
      />
      <div
        className={styles.counterBloom}
        style={{ bottom: "6cqh", right: "10cqw", width: "26cqw", height: "26cqw" }}
      />
      <div className={`${styles.layer} ${styles.s1Cluster} ${styles.settle}`}>
        <span className={styles.eyebrow}>{c.eyebrow}</span>
        <h1 className={styles.s1Title}>
          {c.titleLines.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </h1>
        <div className={styles.s1Rule} />
        <span className={`${styles.mono} ${styles.s1Foot}`}>{c.foot}</span>
      </div>
    </div>
  );
}

/* ── Scene 2 · The Theme (2 beats · motion) ── */
function SceneTwo({ beat, isActive, language, reducedMotion, isThumbnail }: SceneProps) {
  const c: Copy["s2"] = COPY[language].s2;
  const { ref } = useFLIP<HTMLDivElement>({
    watch: [beat],
    disabled: reducedMotion || isThumbnail || !isActive,
    duration: 620,
    easing: "cubic-bezier(0.22, 1, 0.36, 1)",
    selector: '[data-beat-layout-item="true"]',
  });
  return (
    <div className={`${styles.scene} ${styles.s2}`}>
      <div
        className={styles.bloom}
        style={{ top: "12cqh", left: "-8cqw", width: "46cqw", height: "46cqw" }}
      />
      <div
        ref={ref}
        className={`${styles.layer} ${styles.s2Left}`}
        data-beat-layout-container="true"
        data-beat-layout-mode="motion"
      >
        <span className={styles.eyebrow} data-beat-layout-item="true">
          {c.eyebrow}
        </span>
        <h2 className={styles.s2Statement} data-beat-layout-item="true">
          {c.statementLines.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </h2>
        {beat >= 1 && (
          <p className={styles.s2Body} data-beat-layout-item="true">
            {c.body}
          </p>
        )}
      </div>
      <aside className={styles.s2Panel}>
        <span className={`${styles.mono} ${styles.s2PanelTop}`}>{c.panelTop}</span>
        <span className={styles.s2PanelMark}>{c.panelMark}</span>
        <span className={`${styles.mono} ${styles.s2PanelBottom}`}>{c.panelBottom}</span>
      </aside>
    </div>
  );
}

/* ── Scene 3 · The Programme (3 beats · reserved) ── */
function SceneThree({ beat, language }: SceneProps) {
  const c: Copy["s3"] = COPY[language].s3;
  return (
    <div className={`${styles.scene} ${styles.s3}`}>
      <div
        className={styles.bloom}
        style={{ top: "-20cqh", right: "-6cqw", width: "42cqw", height: "42cqw" }}
      />
      <div className={styles.layer}>
        <span className={`${styles.eyebrow} ${styles.settle}`}>{c.eyebrow}</span>
        <div
          className={styles.s3Ledger}
          data-beat-layout-container="true"
          data-beat-layout-mode="reserved"
        >
          {c.rows.map((row, i) => (
            <div
              key={row.time}
              className={styles.s3Row}
              data-beat-layout-item="true"
              data-active={i <= beat}
            >
              <span className={styles.s3Time}>{row.time}</span>
              <span className={styles.s3Title}>{row.title}</span>
              <span className={styles.s3Place}>{row.place}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Scene 4 · The Invitation (2 beats · motion) ── */
function SceneFour({ beat, isActive, language, reducedMotion, isThumbnail }: SceneProps) {
  const c: Copy["s4"] = COPY[language].s4;
  const { ref } = useFLIP<HTMLDivElement>({
    watch: [beat],
    disabled: reducedMotion || isThumbnail || !isActive,
    duration: 640,
    easing: "cubic-bezier(0.22, 1, 0.36, 1)",
    selector: '[data-beat-layout-item="true"]',
  });
  return (
    <div className={`${styles.scene} ${styles.s4}`}>
      <div
        className={styles.bloom}
        data-intense={beat >= 1}
        style={{ top: "6cqh", left: "28cqw", width: "56cqw", height: "56cqw" }}
      />
      <div
        ref={ref}
        className={`${styles.layer} ${styles.s4}`}
        data-beat-layout-container="true"
        data-beat-layout-mode="motion"
      >
        <div className={styles.s4DateBlock}>
          <span className={styles.eyebrow} data-beat-layout-item="true">
            {c.eyebrow}
          </span>
          <span className={styles.s4Day} data-beat-layout-item="true">
            {c.day}
          </span>
          <span className={`${styles.mono} ${styles.s4MonthYear}`} data-beat-layout-item="true">
            {c.monthYear}
          </span>
        </div>
        {beat >= 1 && (
          <p className={styles.s4Cta} data-beat-layout-item="true">
            {c.cta}
          </p>
        )}
      </div>
    </div>
  );
}

/* ── Scene 5 · The Mark (1 beat) ── */
function SceneFive({ language }: SceneProps) {
  const c: Copy["s5"] = COPY[language].s5;
  return (
    <div className={`${styles.scene} ${styles.s5}`}>
      <div
        className={styles.bloom}
        style={{ bottom: "-18cqh", left: "30cqw", width: "44cqw", height: "44cqw" }}
      />
      <div className={`${styles.layer} ${styles.s5} ${styles.settle}`}>
        <p className={styles.s5Mark}>{c.mark}</p>
        <div className={styles.s5Rule} />
        <span className={`${styles.mono} ${styles.s5Colophon}`}>{c.colophon}</span>
      </div>
    </div>
  );
}

const SCENE_TOTAL = 5;

/* ── Nav prototype N1 · persistent mono page number (signature gesture) ── */
function PageMark({
  scene,
  isThumbnail,
  onNavigate,
}: {
  scene: number;
  isThumbnail: boolean;
  onNavigate?: (scene: number, beat: number) => void;
}) {
  if (isThumbnail) return null;
  const next = (scene % SCENE_TOTAL) + 1;
  return (
    <button
      type="button"
      className={styles.pageMark}
      aria-label={`Page ${scene} of ${SCENE_TOTAL}`}
      onClick={(e) => {
        e.stopPropagation();
        onNavigate?.(next, 0);
      }}
    >
      <span className={styles.pageMarkNum}>{String(scene).padStart(2, "0")}</span>
      <span className={styles.pageMarkSlash}>/</span>
      <span className={styles.pageMarkTotal}>{String(SCENE_TOTAL).padStart(2, "0")}</span>
    </button>
  );
}

const TRANSITIONS: SceneTransitionMap = {
  "1->2": "scale-fade",
  "2->3": "fade",
  "3->4": "fade",
  "4->5": "scale-fade",
};

const BEAT_LAYOUT_MODES = { 2: "motion", 3: "reserved", 4: "motion" } as const;

function SolarBiennalePosterV3({
  scene,
  beat,
  language,
  isThumbnail,
  reducedMotion,
  onNavigate,
}: BespokeStyleProps) {
  useFonts();
  const still = reducedMotion || isThumbnail;
  return (
    <div
      className={`${styles.root}${still ? ` ${styles.still}` : ""}`}
      style={ROOT_VARS}
      lang={language}
    >
      <SpatialSceneTrack
        scene={scene}
        beat={beat}
        transitionKind="fade"
        transitionMap={TRANSITIONS}
        reducedMotion={reducedMotion || isThumbnail}
        beatLayoutModes={BEAT_LAYOUT_MODES}
        renderScene={(sceneId, sceneBeat, isActive) => {
          const props: SceneProps = {
            beat: sceneBeat,
            isActive,
            language,
            reducedMotion,
            isThumbnail,
          };
          if (sceneId === 1) return <SceneOne {...props} />;
          if (sceneId === 2) return <SceneTwo {...props} />;
          if (sceneId === 3) return <SceneThree {...props} />;
          if (sceneId === 4) return <SceneFour {...props} />;
          return <SceneFive {...props} />;
        }}
      />
      <PageMark scene={scene} isThumbnail={isThumbnail} onNavigate={onNavigate} />
    </div>
  );
}

/* ── Metadata (en/zh structurally identical) ── */
export function getMetadata(lang: "en" | "zh"): StyleMetadata {
  const en = lang === "en";
  return {
    id: "21",
    band: "editorial-print",
    name: en ? "Solar Biennale Poster" : "日光双年展海报",
    theme: en ? "Festival of Slow Ideas" : "慢想节",
    densityLabel: en ? "Poster · Sparse" : "海报 · 疏朗",
    heroScene: 1,
    colors: { bg: PALETTE.parchment, ink: PALETTE.ink, panel: PALETTE.solar },
    typography: {
      header: '"Playfair Display", serif',
      body: '"Archivo", sans-serif',
    },
    tags: en
      ? ["contemplative", "warm", "editorial", "solar", "slow-motion"]
      : ["沉思", "温暖", "编辑设计", "日光", "慢速动效"],
    fonts: ["Playfair Display", "Archivo", "Space Mono", "cjk:Noto Serif SC"],
    scenes: [
      {
        id: 1,
        title: en ? "The Poster" : "海报",
        beats: [
          {
            id: 0,
            action: en ? "reveal" : "揭幕",
            title: en ? "Festival of Slow Ideas" : "慢想节",
            body: en
              ? "A cultural festival held in warm solar light."
              : "沐浴在暖阳中的一场文化节。",
          },
        ],
      },
      {
        id: 2,
        title: en ? "The Theme" : "主题",
        beats: [
          {
            id: 0,
            action: en ? "state" : "陈述",
            title: en ? "In praise of slowness" : "为缓慢辩护",
            body: en
              ? "One idea, held long enough to warm."
              : "一个念头，久留至生暖。",
          },
          {
            id: 1,
            action: en ? "expand" : "展开",
            title: en ? "Read, don't scan" : "细读，而非速览",
            body: en
              ? "Sessions unfold at the pace of thought."
              : "场次以思考的节奏展开。",
          },
        ],
      },
      {
        id: 3,
        title: en ? "The Programme" : "节目",
        beats: [
          {
            id: 0,
            action: en ? "open" : "开场",
            title: en ? "Morning readings" : "晨间朗读",
            body: en ? "Sunlit hall, a slow opening." : "阳光大厅，缓缓开启。",
          },
          {
            id: 1,
            action: en ? "add" : "追加",
            title: en ? "Afternoon studios" : "午后工作坊",
            body: en ? "Long-form making and talk." : "长时创作与对谈。",
          },
          {
            id: 2,
            action: en ? "add" : "追加",
            title: en ? "Evening address" : "夜间致辞",
            body: en ? "The closing statement, under lamps." : "灯下的闭幕陈词。",
          },
        ],
      },
      {
        id: 4,
        title: en ? "The Invitation" : "邀请",
        beats: [
          {
            id: 0,
            action: en ? "date" : "日期",
            title: en ? "The twelfth" : "十二日",
            body: en ? "September, two thousand twenty-six." : "二〇二六年九月。",
          },
          {
            id: 1,
            action: en ? "bloom" : "绽放",
            title: en ? "Come slowly" : "缓步而来",
            body: en ? "Doors open when the light does." : "光亮时，门即开启。",
          },
        ],
      },
      {
        id: 5,
        title: en ? "The Mark" : "落款",
        beats: [
          {
            id: 0,
            action: en ? "settle" : "沉定",
            title: en ? "Slow ideas, warmly kept" : "慢想，暖藏",
            body: en ? "Festival of Slow Ideas · MMXXVI." : "慢想节 · 二〇二六。",
          },
        ],
      },
    ],
  };
}

export const festivalSlowIdeasV3Version = defineStyleVersion({
  id: "v3",
  topic: { en: "Festival of Slow Ideas", zh: "慢想节" },
  model: "Claude-Opus-4.8",
  component: SolarBiennalePosterV3,
  getMetadata,
});

export default SolarBiennalePosterV3;

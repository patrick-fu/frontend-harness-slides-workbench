import { useEffect } from "react";
import type { CSSProperties, ReactNode } from "react";
import { defineStyleVersion } from "./version";
import SpatialSceneTrack from "./SpatialSceneTrack";
import type { SceneTransitionMap } from "./SpatialSceneTrack";
import { useFLIP } from "../hooks/useFLIP";
import type { BespokeStyleProps, StyleMetadata } from "../types";
import styles from "./36-the-midnight-release-v3.module.css";

/* ── Palette (one hot accent only) ── */
const BG = "#150f11";
const INK = "#efe6d6";
const ACCENT = "#ff2e74";
const CREAM = "#f4ede0";

/* ── Type voices ── */
const SERIF = '"Playfair Display", "Noto Serif SC", serif';
const SANS = '"Jost", "Noto Sans SC", sans-serif';
const MONO = '"Space Mono", "Noto Sans SC", monospace';

const FONT_ID = "font-midnight-release-v3";

function useFonts(): void {
  useEffect(() => {
    if (document.getElementById(FONT_ID)) return;
    const link = document.createElement("link");
    link.id = FONT_ID;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,500&family=Jost:wght@300;400&family=Space+Mono:wght@400;700&family=Noto+Serif+SC:wght@500;700&family=Noto+Sans+SC:wght@300;400&display=swap";
    document.head.appendChild(link);
  }, []);
}

/* ── Bilingual content (no `as const` — it breaks the build) ── */
const COPY = {
  en: {
    nav: ["Last call", "The pour", "The reveal", "The details", "Signed"],
    s1: {
      kicker: "Last Call",
      head: "The bar is still open.",
      sub: "One hour to midnight — the house pours its final vintage.",
    },
    s2: {
      kicker: "The Pour",
      title: "Tonight's offering",
      line1: "A single-cask release, bottled the moment the room went quiet.",
      line2: "Forty-eight bottles. No second run.",
    },
    s3: {
      kicker: "The Reveal",
      hero: "Midnight",
      caption: "Reserve — N\u00ba 01",
    },
    s4: {
      kicker: "The Details",
      frags: [
        { k: "Proof", v: "92\u00b0 · cask strength" },
        { k: "Nose", v: "Smoke, fig, warm leather" },
        { k: "Release", v: "Midnight — tonight only" },
      ],
    },
    s5: {
      kicker: "Signed",
      line: "Drink it slowly. It won't come again.",
      sign: "— The House, after hours",
    },
  },
  zh: {
    nav: ["最后一杯", "斟酒", "揭幕", "细节", "落款"],
    s1: {
      kicker: "最后一杯",
      head: "酒吧仍未打烊。",
      sub: "距午夜还有一小时，酒馆斟出最后一款佳酿。",
    },
    s2: {
      kicker: "斟酒时刻",
      title: "今夜之选",
      line1: "单桶限定，在全场静默的那一刻装瓶。",
      line2: "仅四十八瓶，绝不复刻。",
    },
    s3: {
      kicker: "揭幕",
      hero: "午夜",
      caption: "珍藏 — 第 01 号",
    },
    s4: {
      kicker: "细节",
      frags: [
        { k: "度数", v: "92 度 · 原桶强度" },
        { k: "气息", v: "烟熏、无花果、温润皮革" },
        { k: "发售", v: "午夜 — 仅限今夜" },
      ],
    },
    s5: {
      kicker: "落款",
      line: "慢慢品。它不会再来。",
      sign: "— 酒馆，深夜",
    },
  },
};
type Copy = typeof COPY.en;

/* ── Transitions: slow fades, the reveal zooms gently ── */
const TRANSITIONS: SceneTransitionMap = {
  "1->2": "fade",
  "2->3": "scale-fade",
  "3->4": "fade",
  "4->5": "fade",
};

const rootStyle: CSSProperties = {
  background: `radial-gradient(88% 84% at 15% 12%, rgba(96,70,60,0.55), rgba(21,15,17,0) 60%), ${BG}`,
  fontFamily: SANS,
};

/* ── Shared kicker eyebrow (accent, above every headline) ── */
function Kicker({
  children,
  style,
  className,
  item,
}: {
  children: ReactNode;
  style?: CSSProperties;
  className?: string;
  item?: boolean;
}) {
  return (
    <span
      className={className}
      data-beat-layout-item={item ? "true" : undefined}
      style={{
        fontFamily: MONO,
        fontSize: "1cqw",
        letterSpacing: "0.34cqw",
        textTransform: "uppercase",
        color: ACCENT,
        ...style,
      }}
    >
      {children}
    </span>
  );
}

interface SceneProps {
  beat: number;
  isActive: boolean;
  copy: Copy;
  reducedMotion: boolean;
  isThumbnail: boolean;
}

/* ── Scene 1 · Last call — motion ── */
function SceneLastCall({ beat, isActive, copy, reducedMotion, isThumbnail }: SceneProps) {
  const { ref } = useFLIP<HTMLDivElement>({
    watch: [beat],
    disabled: reducedMotion || isThumbnail || !isActive,
    duration: 520,
    easing: "cubic-bezier(0.22, 1, 0.36, 1)",
    selector: '[data-beat-layout-item="true"]',
  });
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        paddingLeft: "9cqw",
        paddingRight: "13cqw",
      }}
    >
      <div
        ref={ref}
        data-beat-layout-container="true"
        data-beat-layout-mode="motion"
        style={{ display: "flex", flexDirection: "column", gap: "2.6cqh", maxWidth: "74cqw" }}
      >
        <Kicker item style={{ marginBottom: "0.6cqh" }}>{copy.s1.kicker}</Kicker>
        <h1
          data-beat-layout-item="true"
          style={{
            margin: 0,
            fontFamily: SERIF,
            fontSize: "7.4cqw",
            fontWeight: 500,
            lineHeight: 1.02,
            color: INK,
            textShadow: `0 0 3.4cqw rgba(255,46,116,0.32)`,
          }}
        >
          {copy.s1.head}
        </h1>
        {beat >= 1 && (
          <p
            data-beat-layout-item="true"
            style={{
              margin: 0,
              fontFamily: SANS,
              fontWeight: 300,
              fontSize: "1.7cqw",
              lineHeight: 1.5,
              color: "rgba(239,230,214,0.72)",
              maxWidth: "48cqw",
            }}
          >
            {copy.s1.sub}
          </p>
        )}
      </div>
    </div>
  );
}

/* ── Scene 2 · The pour — reserved (pearl-cream callout rail) ── */
function ScenePour({ beat, copy }: SceneProps) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        paddingLeft: "12cqw",
        paddingRight: "14cqw",
      }}
    >
      <div
        className={styles.rise}
        data-beat-layout-container="true"
        data-beat-layout-mode="reserved"
        style={{
          borderLeft: `0.22cqw solid ${CREAM}`,
          paddingLeft: "3.2cqw",
          display: "flex",
          flexDirection: "column",
          gap: "2.8cqh",
          maxWidth: "66cqw",
        }}
      >
        <Kicker>{copy.s2.kicker}</Kicker>
        <h2
          style={{
            margin: 0,
            fontFamily: SERIF,
            fontStyle: "italic",
            fontSize: "4cqw",
            fontWeight: 500,
            color: CREAM,
            lineHeight: 1.05,
          }}
        >
          {copy.s2.title}
        </h2>
        <p
          data-beat-layout-item="true"
          style={{
            margin: 0,
            fontFamily: SANS,
            fontWeight: 300,
            fontSize: "1.9cqw",
            lineHeight: 1.5,
            color: "rgba(239,230,214,0.78)",
            maxWidth: "52cqw",
          }}
        >
          {copy.s2.line1}
        </p>
        <p
          data-beat-layout-item="true"
          style={{
            margin: 0,
            fontFamily: SERIF,
            fontSize: "2.9cqw",
            fontWeight: 500,
            color: ACCENT,
            opacity: beat >= 1 ? 1 : 0.16,
            transform: beat >= 1 ? "translateY(0)" : "translateY(0.6cqh)",
            transition: "opacity 700ms ease, transform 700ms ease",
          }}
        >
          {copy.s2.line2}
        </p>
      </div>
    </div>
  );
}

/* ── Scene 3 · The reveal — motion (hero serif swells with halo) ── */
function SceneReveal({ beat, isActive, copy, reducedMotion, isThumbnail }: SceneProps) {
  const { ref } = useFLIP<HTMLDivElement>({
    watch: [beat],
    disabled: reducedMotion || isThumbnail || !isActive,
    duration: 560,
    easing: "cubic-bezier(0.22, 1, 0.36, 1)",
    selector: '[data-beat-layout-item="true"]',
  });
  const swelled = beat >= 1;
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        paddingLeft: "10cqw",
        paddingRight: "8cqw",
      }}
    >
      <div
        ref={ref}
        data-beat-layout-container="true"
        data-beat-layout-mode="motion"
        style={{ position: "relative", display: "flex", flexDirection: "column", gap: "1.4cqh" }}
      >
        <div
          className={styles.halo}
          style={{
            position: "absolute",
            left: "-6cqw",
            top: "-8cqh",
            width: swelled ? "72cqw" : "52cqw",
            height: swelled ? "58cqh" : "44cqh",
            background: `radial-gradient(closest-side, rgba(255,46,116,0.42), rgba(255,46,116,0) 70%)`,
            filter: "blur(2cqw)",
            transition: "width 900ms ease, height 900ms ease",
            pointerEvents: "none",
          }}
        />
        <Kicker style={{ position: "relative" }}>{copy.s3.kicker}</Kicker>
        <h1
          data-beat-layout-item="true"
          style={{
            margin: 0,
            position: "relative",
            fontFamily: SERIF,
            fontSize: swelled ? "15cqw" : "10cqw",
            fontWeight: 600,
            lineHeight: 0.98,
            color: ACCENT,
            textShadow: `0 0 5cqw rgba(255,46,116,0.5)`,
            transition: "font-size 900ms cubic-bezier(0.16,1,0.3,1)",
          }}
        >
          {copy.s3.hero}
        </h1>
        <span
          data-beat-layout-item="true"
          style={{
            position: "relative",
            fontFamily: MONO,
            fontSize: "1.1cqw",
            letterSpacing: "0.3cqw",
            textTransform: "uppercase",
            color: "rgba(239,230,214,0.7)",
          }}
        >
          {copy.s3.caption}
        </span>
      </div>
    </div>
  );
}

/* ── Scene 4 · The details — reserved (fragments orbit in imbalance) ── */
function SceneDetails({ beat, copy }: SceneProps) {
  const pos = [
    { left: "11cqw", top: "27cqh" },
    { left: "56cqw", top: "45cqh" },
    { left: "24cqw", top: "66cqh" },
  ];
  return (
    <div data-beat-layout-container="true" data-beat-layout-mode="reserved" style={{ position: "absolute", inset: 0 }}>
      <Kicker style={{ position: "absolute", left: "11cqw", top: "16cqh" }} >{copy.s4.kicker}</Kicker>
      {copy.s4.frags.map((frag, i) => {
        const active = beat >= 1 ? true : i === 0;
        return (
          <div
            key={frag.k}
            data-beat-layout-item="true"
            style={{
              position: "absolute",
              left: pos[i].left,
              top: pos[i].top,
              maxWidth: "34cqw",
              opacity: active ? 1 : 0.34,
              transform: active ? "scale(1)" : "scale(0.97)",
              transition: "opacity 650ms ease, transform 650ms ease",
            }}
          >
            <div
              style={{
                fontFamily: MONO,
                fontSize: "0.95cqw",
                letterSpacing: "0.24cqw",
                textTransform: "uppercase",
                color: ACCENT,
                marginBottom: "1cqh",
              }}
            >
              {frag.k}
            </div>
            <div style={{ fontFamily: SERIF, fontSize: "3cqw", fontWeight: 500, color: INK, lineHeight: 1.08 }}>
              {frag.v}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ── Scene 5 · Signed — motion (final line dims to close) ── */
function SceneSigned({ copy }: SceneProps) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: "3cqh",
        paddingLeft: "10cqw",
        paddingRight: "12cqw",
      }}
    >
      <Kicker className={styles.rise}>{copy.s5.kicker}</Kicker>
      <h1
        className={styles.dim}
        style={{
          margin: 0,
          fontFamily: SERIF,
          fontStyle: "italic",
          fontSize: "6cqw",
          fontWeight: 500,
          lineHeight: 1.06,
          color: INK,
          maxWidth: "70cqw",
          textShadow: `0 0 3cqw rgba(255,46,116,0.28)`,
        }}
      >
        {copy.s5.line}
      </h1>
      <span
        className={styles.rise}
        style={{
          fontFamily: MONO,
          fontSize: "1.1cqw",
          letterSpacing: "0.28cqw",
          textTransform: "uppercase",
          color: ACCENT,
        }}
      >
        {copy.s5.sign}
      </span>
    </div>
  );
}

function SceneContent({ sceneId, beat, isActive, copy, reducedMotion, isThumbnail }: SceneProps & { sceneId: number }) {
  const shared: SceneProps = { beat, isActive, copy, reducedMotion, isThumbnail };
  switch (sceneId) {
    case 1:
      return <SceneLastCall {...shared} />;
    case 2:
      return <ScenePour {...shared} />;
    case 3:
      return <SceneReveal {...shared} />;
    case 4:
      return <SceneDetails {...shared} />;
    case 5:
      return <SceneSigned {...shared} />;
    default:
      return null;
  }
}

/* ── N7 Ghost nav: hot-accent hairline index, glows on hover ── */
function GhostNav({
  current,
  labels,
  isThumbnail,
  onJump,
}: {
  current: number;
  labels: string[];
  isThumbnail: boolean;
  onJump: (scene: number) => void;
}) {
  if (isThumbnail) return null;
  return (
    <nav className={styles.nav} aria-label="scene index">
      {labels.map((label, i) => {
        const n = i + 1;
        return (
          <button
            key={n}
            type="button"
            className={[styles.navItem, current === n ? styles.navActive : ""].filter(Boolean).join(" ")}
            onClick={(e) => {
              e.stopPropagation();
              onJump(n);
            }}
          >
            <span className={styles.navLabel}>
              {String(n).padStart(2, "0")} · {label}
            </span>
            <span className={styles.navLine} />
          </button>
        );
      })}
    </nav>
  );
}

function TheMidnightRelease({
  scene,
  beat,
  language,
  isThumbnail,
  reducedMotion,
  onNavigate,
}: BespokeStyleProps) {
  useFonts();
  const copy = COPY[language];
  const rm = reducedMotion || isThumbnail;
  return (
    <div className={styles.root} data-reduced={rm ? "true" : undefined} style={rootStyle}>
      <div className={styles.grain} />
      <SpatialSceneTrack
        scene={scene}
        beat={beat}
        transitionKind="fade"
        transitionMap={TRANSITIONS}
        reducedMotion={rm}
        beatLayoutModes={{ 1: "motion", 2: "reserved", 3: "motion", 4: "reserved" }}
        renderScene={(sceneId, sceneBeat, isActive) => (
          <SceneContent
            sceneId={sceneId}
            beat={sceneBeat}
            isActive={isActive}
            copy={copy}
            reducedMotion={reducedMotion}
            isThumbnail={isThumbnail}
          />
        )}
      />
      <div className={styles.frame} />
      <GhostNav
        current={scene}
        labels={copy.nav}
        isThumbnail={isThumbnail}
        onJump={(n) => onNavigate?.(n, 0)}
      />
    </div>
  );
}

export function getMetadata(lang: "en" | "zh"): StyleMetadata {
  const c = COPY[lang];
  const en = lang === "en";
  return {
    id: "36",
    band: "contemporary-digital",
    name: en ? "After-Hours Luxe" : "深夜奢华",
    theme: en ? "The Midnight Release" : "午夜上线",
    densityLabel: en ? "Sparse · Nocturnal" : "疏朗 · 夜色",
    heroScene: 3,
    colors: { bg: BG, ink: INK, panel: CREAM },
    typography: { header: "Playfair Display", body: "Jost" },
    tags: en
      ? ["sultry", "luxe", "editorial", "nocturnal", "warm-black", "magenta-accent", "serif-display", "slow-motion", "asymmetric"]
      : ["性感", "奢华", "编辑感", "夜色", "暖黑", "品红点缀", "衬线大标题", "慢速动效", "非对称"],
    fonts: ["Playfair Display", "Jost", "Space Mono", "cjk:Noto Serif SC", "cjk:Noto Sans SC"],
    scenes: [
      {
        id: 1,
        title: c.nav[0],
        beats: [
          { id: 0, action: en ? "Kicker over the glow" : "点题字覆于辉光之上", title: c.s1.kicker, body: c.s1.head },
          { id: 1, action: en ? "Subline rises in" : "副标题上浮", title: c.s1.head, body: c.s1.sub },
        ],
      },
      {
        id: 2,
        title: c.nav[1],
        beats: [
          { id: 0, action: en ? "Rail states the offering" : "边栏道出今夜之选", title: c.s2.title, body: c.s2.line1 },
          { id: 1, action: en ? "Scarcity is emphasized" : "强调稀缺", title: c.s2.title, body: c.s2.line2 },
        ],
      },
      {
        id: 3,
        title: c.nav[2],
        beats: [
          { id: 0, action: en ? "Hero glows in" : "主字浮现辉光", title: c.s3.hero, body: c.s3.caption },
          { id: 1, action: en ? "Hero swells with halo" : "主字与光晕齐涨", title: c.s3.hero, body: c.s3.caption },
        ],
      },
      {
        id: 4,
        title: c.nav[3],
        beats: [
          { id: 0, action: en ? "Fragments settle" : "碎片就位", title: c.nav[3], body: c.s4.frags[0].v },
          { id: 1, action: en ? "Emphasis shifts across" : "重心游移", title: c.nav[3], body: c.s4.frags[2].v },
        ],
      },
      {
        id: 5,
        title: c.nav[4],
        beats: [
          { id: 0, action: en ? "Final line dims to close" : "尾句渐暗收束", title: c.s5.line, body: c.s5.sign },
        ],
      },
    ],
  };
}

export const TheMidnightReleaseV3Version = defineStyleVersion({
  id: "v3",
  topic: { en: "The Midnight Release", zh: "午夜上线" },
  model: "Claude-Opus-4.8",
  component: TheMidnightRelease,
  getMetadata,
});

export default TheMidnightRelease;

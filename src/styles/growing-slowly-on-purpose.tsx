import { useEffect } from "react";
import type { CSSProperties } from "react";
import type { BespokeStyleProps, StyleMetadata } from "../types";
import { defineStyleTopic } from "./topic";
import SpatialSceneTrack from "./SpatialSceneTrack";
import type { SceneTransitionMap } from "./SpatialSceneTrack";
import { useFLIP } from "../hooks/useFLIP";
import styles from "./growing-slowly-on-purpose.module.css";

/* ── Palette (Mid-Century Grove: green ground wins, warm cream ink, one rust) ── */
const GREEN = "#33483b";
const CREAM = "#f2e7d3";
const CREAM_PANEL = "#ece0c8";
const RUST = "#c0602c";
const INK_ON_CREAM = "#31443a";

const FONT_DISPLAY = "'Fraunces', 'Noto Serif SC', serif";
const FONT_BODY = "'Spectral', 'Noto Serif SC', serif";
const FONT_LABEL = "'Archivo', 'Noto Sans SC', sans-serif";

/* Warm wood-brown glow from one corner over the deep green — atmosphere, not edges. */
const GROUND_BG =
  "radial-gradient(130% 100% at 6% 8%, rgba(158,98,44,0.24), rgba(51,72,59,0) 56%), " +
  "radial-gradient(120% 120% at 100% 100%, rgba(41,58,48,0.55), rgba(51,72,59,0) 60%), " +
  GREEN;

/* ── Bilingual content (NO `as const` — that breaks the build) ── */
const COPY = {
  en: {
    nav: ["Seed", "Roots", "Canopy", "Grove", "Rings"],
    s1: {
      kicker: "— a field guide to patience",
      title: "Growing Slowly on Purpose",
      sub: "Notes from a garden that keeps its own time.",
    },
    s2: {
      eyebrow: "Roots",
      heading: "What holds it up",
      roots: [
        { t: "Depth before height", b: "Send roots down before reaching for light." },
        { t: "Slow and unhurried", b: "Growth measured in seasons, not sprints." },
        { t: "Quiet and cultivated", b: "Tended daily, noticed rarely." },
      ],
    },
    s3: {
      eyebrow: "Canopy",
      heading: "Where it opens",
      leaves: [
        { t: "Shade for others", b: "Shelter is the point of height." },
        { t: "Air between", b: "Leave room to breathe." },
        { t: "Light, shared", b: "Enough for everything below." },
        { t: "Still moving", b: "Even at rest, always adjusting." },
      ],
    },
    s4: {
      eyebrow: "The grove",
      sections: [
        { h: "Alone", b: "A single tree keeps its own weather." },
        { h: "Together", b: "A grove makes a climate." },
        { h: "In time", b: "Roots braid underground, unseen." },
      ],
    },
    s5: {
      close: "A ring for every quiet year.",
      sub: "Growing slowly, on purpose.",
    },
  },
  zh: {
    nav: ["种子", "根系", "树冠", "林间", "年轮"],
    s1: {
      kicker: "—— 一本关于耐心的田野手记",
      title: "慢成长",
      sub: "来自一座不肯被催促的花园的笔记。",
    },
    s2: {
      eyebrow: "根系",
      heading: "支撑它的东西",
      roots: [
        { t: "先扎根，再向上", b: "在追逐阳光之前，先把根伸向深处。" },
        { t: "缓慢而从容", b: "以季节丈量生长，而非冲刺。" },
        { t: "安静地耕耘", b: "每日照料，鲜少张扬。" },
      ],
    },
    s3: {
      eyebrow: "树冠",
      heading: "它舒展的地方",
      leaves: [
        { t: "为他人遮荫", b: "高度的意义在于庇护。" },
        { t: "留出间隙", b: "给彼此呼吸的余地。" },
        { t: "分享光", b: "足够照亮下面的一切。" },
        { t: "仍在生长", b: "即使静止，也始终微调。" },
      ],
    },
    s4: {
      eyebrow: "林间",
      sections: [
        { h: "独木", b: "一棵树自成气候。" },
        { h: "成林", b: "一片林改变气候。" },
        { h: "经年", b: "根须在地下悄然交织。" },
      ],
    },
    s5: {
      close: "每一个安静的年头，都是一圈年轮。",
      sub: "慢成长，是一种选择。",
    },
  },
};

type Copy = typeof COPY.en;

/* ── Fonts: one deduped Google Fonts link ── */
function useFonts(): void {
  useEffect(() => {
    const id = "grove-v3-fonts";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;1,9..144,400&family=Spectral:ital,wght@0,300;0,400;1,400&family=Archivo:wght@500;600&family=Noto+Serif+SC:wght@400;600&family=Noto+Sans+SC:wght@500&display=swap";
    document.head.appendChild(link);
  }, []);
}

const kickerStyle: CSSProperties = {
  fontFamily: FONT_LABEL,
  fontSize: "1.9cqh",
  letterSpacing: "0.42cqw",
  textTransform: "uppercase",
  color: RUST,
  fontWeight: 600,
};

const eyebrowStyle: CSSProperties = {
  fontFamily: FONT_LABEL,
  fontSize: "1.7cqh",
  letterSpacing: "0.34cqw",
  textTransform: "uppercase",
  color: RUST,
  fontWeight: 600,
};

interface SceneProps {
  scene: number;
  beat: number;
  isActive: boolean;
  c: Copy;
  reducedMotion: boolean;
  isThumbnail: boolean;
}

function GroveScene({ scene, beat, isActive, c, reducedMotion, isThumbnail }: SceneProps) {
  // FLIP drives the reflow in Scene 2 (motion). Disabled elsewhere / when still.
  const { ref: flipRef } = useFLIP<HTMLDivElement>({
    watch: [beat],
    disabled: reducedMotion || isThumbnail || !isActive || scene !== 2,
    duration: 560,
    easing: "cubic-bezier(0.16, 1, 0.3, 1)",
    selector: '[data-beat-layout-item="true"]',
  });

  const still = reducedMotion || isThumbnail;

  if (scene === 1) {
    return (
      <div style={{ padding: "0 9cqw", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", gap: "3.2cqh" }}>
        <span className={styles.fadeUp} style={{ ...kickerStyle, animationDelay: still ? "0s" : "60ms" }}>
          {c.s1.kicker}
        </span>
        <h1
          className={styles.fadeUp}
          style={{
            margin: 0,
            fontFamily: FONT_DISPLAY,
            fontSize: "9.6cqh",
            lineHeight: 1.02,
            color: CREAM,
            fontWeight: 400,
            maxWidth: "72cqw",
            animationDelay: still ? "0s" : "260ms",
          }}
        >
          {c.s1.title}
        </h1>
        <p
          className={styles.fadeUp}
          style={{
            margin: 0,
            fontFamily: FONT_BODY,
            fontSize: "2.7cqh",
            lineHeight: 1.5,
            color: CREAM,
            opacity: 0.82,
            maxWidth: "44cqw",
            animationDelay: still ? "0s" : "520ms",
          }}
        >
          {c.s1.sub}
        </p>
      </div>
    );
  }

  if (scene === 2) {
    const visible = isThumbnail ? c.s2.roots.length : Math.min(beat + 1, c.s2.roots.length);
    return (
      <div style={{ padding: "0 9cqw", height: "100%", display: "flex", alignItems: "center", gap: "6cqw" }}>
        <div style={{ width: "34cqw", flexShrink: 0 }}>
          <div style={{ ...eyebrowStyle, marginBottom: "2.4cqh" }}>{c.s2.eyebrow}</div>
          <h2 style={{ margin: 0, fontFamily: FONT_DISPLAY, fontSize: "6.4cqh", lineHeight: 1.06, color: CREAM, fontWeight: 400 }}>
            {c.s2.heading}
          </h2>
        </div>
        {/* Cream inset panel — breaks the green like a pressed leaf. */}
        <div
          style={{
            flex: 1,
            height: "66cqh",
            background: CREAM_PANEL,
            borderRadius: "1.2cqw",
            boxShadow: "0 1.2cqh 4.5cqh rgba(28,38,31,0.28)",
            padding: "5cqh 4cqw",
            display: "flex",
            alignItems: "center",
          }}
        >
          <div
            ref={flipRef}
            data-beat-layout-container="true"
            data-beat-layout-mode="motion"
            style={{ width: "100%", display: "flex", flexDirection: "column", justifyContent: "center", gap: "3.4cqh" }}
          >
            {c.s2.roots.slice(0, visible).map((r) => (
              <div
                key={r.t}
                data-beat-layout-item="true"
                className={still ? undefined : styles.leafIn}
                style={{ display: "grid", gridTemplateColumns: "3.4cqw 1fr", alignItems: "baseline", columnGap: "1.4cqw" }}
              >
                <span style={{ fontFamily: FONT_DISPLAY, fontSize: "3.4cqh", color: RUST, lineHeight: 1 }}>—</span>
                <div>
                  <h3 style={{ margin: 0, fontFamily: FONT_DISPLAY, fontSize: "3.4cqh", color: INK_ON_CREAM, fontWeight: 600, lineHeight: 1.14 }}>
                    {r.t}
                  </h3>
                  <p style={{ margin: "0.6cqh 0 0", fontFamily: FONT_BODY, fontSize: "2.15cqh", color: INK_ON_CREAM, opacity: 0.78, lineHeight: 1.45 }}>
                    {r.b}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (scene === 3) {
    const settled = isThumbnail || beat >= 1;
    return (
      <div style={{ padding: "8cqh 9cqw", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", gap: "4.4cqh" }}>
        <div>
          <div style={{ ...eyebrowStyle, marginBottom: "1.6cqh" }}>{c.s3.eyebrow}</div>
          <h2 style={{ margin: 0, fontFamily: FONT_DISPLAY, fontSize: "6cqh", color: CREAM, fontWeight: 400, lineHeight: 1.05 }}>
            {c.s3.heading}
          </h2>
        </div>
        {/* Reserved: all leaves hold their slots from beat 0; beats only settle opacity. */}
        <div data-beat-layout-container="true" data-beat-layout-mode="reserved" style={{ display: "flex", flexDirection: "column", gap: "2.6cqh" }}>
          {c.s3.leaves.map((leaf, i) => (
            <div
              key={leaf.t}
              data-beat-layout-item="true"
              style={{
                marginLeft: `${i * 6}cqw`,
                display: "flex",
                alignItems: "baseline",
                gap: "1.4cqw",
                opacity: settled ? 1 : 0.28,
                transform: settled ? "translateY(0)" : "translateY(1.4cqh)",
                transition: still ? "none" : `opacity 900ms cubic-bezier(0.16,1,0.3,1) ${i * 140}ms, transform 900ms cubic-bezier(0.16,1,0.3,1) ${i * 140}ms`,
              }}
            >
              <span style={{ width: "1cqw", height: "1cqw", borderRadius: "50%", background: RUST, flexShrink: 0, transform: "translateY(-0.3cqh)" }} />
              <span style={{ fontFamily: FONT_DISPLAY, fontSize: "3.6cqh", color: CREAM, fontWeight: 400 }}>{leaf.t}</span>
              <span style={{ fontFamily: FONT_BODY, fontSize: "2.3cqh", color: CREAM, opacity: 0.66 }}>{leaf.b}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (scene === 4) {
    const allLit = isThumbnail || beat >= 1;
    return (
      <div style={{ padding: "9cqh 9cqw", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", gap: "5cqh" }}>
        <div style={{ ...eyebrowStyle }}>{c.s4.eyebrow}</div>
        {/* Reserved: three thin-ruled sections coexist from beat 0. */}
        <div data-beat-layout-container="true" data-beat-layout-mode="reserved" style={{ display: "flex", alignItems: "stretch" }}>
          {c.s4.sections.map((sec, i) => {
            const lit = allLit || i === 0;
            return (
              <div
                key={sec.h}
                data-beat-layout-item="true"
                style={{
                  flex: 1,
                  padding: "0 3cqw",
                  borderLeft: i === 0 ? "none" : `0.1cqw solid rgba(242,231,211,0.24)`,
                  opacity: lit ? 1 : 0.34,
                  transition: still ? "none" : `opacity 820ms cubic-bezier(0.16,1,0.3,1) ${i * 120}ms`,
                }}
              >
                <div style={{ fontFamily: FONT_LABEL, fontSize: "1.5cqh", letterSpacing: "0.28cqw", color: RUST, marginBottom: "1.8cqh" }}>
                  {String(i + 1).padStart(2, "0")}
                </div>
                <h3 style={{ margin: "0 0 1.6cqh", fontFamily: FONT_DISPLAY, fontSize: "4.6cqh", color: CREAM, fontWeight: 400, lineHeight: 1.08 }}>
                  {sec.h}
                </h3>
                <p style={{ margin: 0, fontFamily: FONT_BODY, fontSize: "2.4cqh", color: CREAM, opacity: 0.78, lineHeight: 1.5 }}>
                  {sec.b}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Scene 5 — Rings.
  return (
    <div style={{ padding: "0 9cqw", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", gap: "2.8cqh", position: "relative" }}>
      {/* Faint concentric rings watermark anchoring the corner. */}
      <div style={{ position: "absolute", right: "-6cqw", bottom: "-9cqh", width: "44cqh", height: "44cqh", pointerEvents: "none" }} aria-hidden>
        {[0, 1, 2, 3].map((r) => (
          <span
            key={r}
            style={{
              position: "absolute",
              inset: `${r * 5}cqh`,
              borderRadius: "50%",
              border: `0.12cqw solid ${r === 1 ? "rgba(192,96,44,0.30)" : "rgba(242,231,211,0.16)"}`,
            }}
          />
        ))}
      </div>
      <span className={styles.fadeUp} style={{ fontFamily: FONT_DISPLAY, fontSize: "4cqh", color: RUST, animationDelay: still ? "0s" : "80ms" }}>
        —
      </span>
      <h1
        className={styles.fadeUp}
        style={{ margin: 0, fontFamily: FONT_DISPLAY, fontSize: "6.8cqh", lineHeight: 1.1, color: CREAM, fontWeight: 400, maxWidth: "70cqw", animationDelay: still ? "0s" : "260ms" }}
      >
        {c.s5.close}
      </h1>
      <p className={styles.fadeUp} style={{ margin: 0, fontFamily: FONT_BODY, fontSize: "2.6cqh", color: CREAM, opacity: 0.72, animationDelay: still ? "0s" : "520ms" }}>
        {c.s5.sub}
      </p>
    </div>
  );
}

/* N7 Ghost — a faint rust progress mark low on the green, surfacing only on hover. */
function GhostNav({
  scene,
  labels,
  onNavigate,
  isThumbnail,
}: {
  scene: number;
  labels: string[];
  onNavigate?: (scene: number, beat: number) => void;
  isThumbnail: boolean;
}) {
  if (isThumbnail) return null;
  return (
    <div className={styles.ghostNav} style={{ position: "absolute", left: "9cqw", bottom: "5cqh", display: "flex", gap: "1.4cqw", alignItems: "center", zIndex: 20 }}>
      {labels.map((label, i) => {
        const n = i + 1;
        const active = n === scene;
        return (
          <button
            key={label}
            type="button"
            title={label}
            aria-label={label}
            onClick={(e) => {
              e.stopPropagation();
              onNavigate?.(n, 0);
            }}
            style={{
              width: active ? "4.2cqw" : "2cqw",
              height: "0.4cqh",
              padding: 0,
              border: "none",
              cursor: "pointer",
              borderRadius: "0.4cqh",
              background: active ? RUST : "rgba(242,231,211,0.42)",
              transition: "width 600ms cubic-bezier(0.16,1,0.3,1), background 600ms",
            }}
          />
        );
      })}
    </div>
  );
}

const TRANSITIONS: SceneTransitionMap = {
  "1->2": "fade",
  "2->3": "slide-y",
  "3->4": "slide-y",
  "4->5": "fade",
};

function GrowingSlowlyOnPurpose({ scene, beat, language, isThumbnail, reducedMotion, onNavigate }: BespokeStyleProps) {
  useFonts();
  const c = COPY[language];
  const still = reducedMotion || isThumbnail;

  return (
    <div
      className={still ? styles.reduced : undefined}
      style={{ width: "100%", height: "100%", position: "relative", background: GROUND_BG, overflow: "hidden", color: CREAM, fontFamily: FONT_BODY }}
    >
      <SpatialSceneTrack
        scene={scene}
        beat={beat}
        transitionKind="fade"
        transitionMap={TRANSITIONS}
        reducedMotion={reducedMotion || isThumbnail}
        beatLayoutModes={{ 2: "motion", 3: "reserved", 4: "reserved" }}
        renderScene={(sceneId, sceneBeat, isActive) => (
          <GroveScene
            scene={sceneId}
            beat={sceneBeat}
            isActive={isActive}
            c={c}
            reducedMotion={reducedMotion}
            isThumbnail={isThumbnail}
          />
        )}
      />
      <GhostNav scene={scene} labels={c.nav} onNavigate={onNavigate} isThumbnail={isThumbnail} />
    </div>
  );
}

export function getMetadata(lang: "en" | "zh"): StyleMetadata {
  const t = COPY[lang];
  const name = lang === "en" ? "Mid-Century Grove" : "中世纪林间";
  const theme = lang === "en" ? "Growing Slowly on Purpose" : "慢成长";
  const densityLabel = lang === "en" ? "Sparse" : "疏朗";
  const a = (en: string, zh: string) => (lang === "en" ? en : zh);

  return {
    id: "mid-century-grove",
    band: "contemporary-digital",
    name,
    theme,
    densityLabel,
    heroScene: 1,
    colors: { bg: GREEN, ink: CREAM, panel: CREAM_PANEL },
    typography: { header: "Fraunces", body: "Spectral" },
    tags: ["warm", "botanical", "cultivated", "patient", "serif", "green", "cream", "rust-accent", "sparse", "organic-motion", "mid-century"],
    fonts: ["Fraunces", "Spectral", "Archivo", "cjk:Noto Serif SC", "cjk:Noto Sans SC"],
    scenes: [
      {
        id: 1,
        title: t.nav[0],
        beats: [{ id: 0, action: a("Fade the title up from the green", "标题自绿地缓缓浮现"), title: t.s1.title, body: t.s1.sub }],
      },
      {
        id: 2,
        title: t.nav[1],
        beats: t.s2.roots.map((r, i) => ({
          id: i,
          action: a(`Reveal root ${i + 1}, reflow the panel`, `展开第 ${i + 1} 条根系，面板重排`),
          title: r.t,
          body: r.b,
        })),
      },
      {
        id: 3,
        title: t.nav[2],
        beats: [
          { id: 0, action: a("Leaves arrive, faint and settling", "叶片浮现，若隐若现"), title: t.s3.eyebrow, body: t.s3.leaves[0].b },
          { id: 1, action: a("Leaves settle into full emphasis", "叶片沉稳落定，清晰呈现"), title: t.s3.heading, body: t.s3.leaves[3].b },
        ],
      },
      {
        id: 4,
        title: t.nav[3],
        beats: [
          { id: 0, action: a("The first section leads", "首节先立"), title: t.s4.sections[0].h, body: t.s4.sections[0].b },
          { id: 1, action: a("All sections coexist evenly", "各节并存，均衡呈现"), title: t.s4.sections[2].h, body: t.s4.sections[2].b },
        ],
      },
      {
        id: 5,
        title: t.nav[4],
        beats: [{ id: 0, action: a("Closing line over faint rings", "收束语落于淡淡年轮之上"), title: t.s5.close, body: t.s5.sub }],
      },
    ],
  };
}

export const GrowingSlowlyOnPurposeTopic = defineStyleTopic({
  id: "growing-slowly-on-purpose",
  topic: { en: "Growing Slowly on Purpose", zh: "慢成长" },
  model: "Claude Opus 4.8",
  component: GrowingSlowlyOnPurpose,
  getMetadata,
});

export default GrowingSlowlyOnPurpose;

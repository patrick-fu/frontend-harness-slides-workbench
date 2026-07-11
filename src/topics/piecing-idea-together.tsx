import React from "react";
import {
  defineTopic,
  type TopicDefinition,
  type TopicMetadata,
  type TopicStageProps,
} from "../domain/topic";
import SpatialSceneTrack from "../styles/SpatialSceneTrack";
import { useFLIP } from "../hooks/useFLIP";
import styles from "./piecing-idea-together.module.css";

/* ── Infra ──────────────────────────────────────────────────────────── */

const TRANSITIONS = {
  "1->2": "slide-x",
  "2->3": "scale-fade",
  "3->4": "slide-x",
  "4->5": "scale-fade",
} as const satisfies TopicDefinition["transitionScore"];

const NAVIGATION = {
  geometry: "spatial-node",
  carrier: "collage-pin-pricks",
  invocation: "click-expand",
  feedback: "active-glow",
} as const satisfies TopicDefinition["navigation"];

/* ── Palette (earthy found materials) ───────────────────────────────── */

const CLR = {
  bg: "#e7dcc4",
  ink: "#2b2118",
  panel: "#efe7d2",
  manila: "#e4d6b4",
  rust: "#b0432c",
  indigo: "#4a5a72",
  mustard: "#c9992e",
  focal: "#e0592a", // the one saturated cutout
  cream: "#f3ecd8",
};

/* Irregular scissor-cut edges — never clean curves. */
const TORN = [
  "polygon(2% 7%, 19% 0%, 45% 4%, 71% 0%, 93% 6%, 100% 24%, 96% 52%, 100% 81%, 87% 100%, 59% 95%, 31% 100%, 8% 96%, 0% 73%, 4% 39%)",
  "polygon(0% 13%, 23% 3%, 51% 0%, 79% 5%, 100% 1%, 95% 31%, 100% 61%, 94% 89%, 71% 100%, 39% 94%, 13% 100%, 0% 81%, 5% 47%)",
  "polygon(5% 0%, 41% 7%, 75% 0%, 100% 11%, 95% 45%, 100% 75%, 85% 98%, 51% 91%, 19% 100%, 0% 87%, 6% 54%, 0% 23%)",
];

/* ── Bilingual content shared by metadata and scene visuals ─────────── */

interface Beat {
  action: string;
  title: string;
  body: string;
}
interface SceneText {
  title: string;
  hand: string;
  frags: string[];
  labels: string[];
  beats: Beat[];
}
interface Locale {
  theme: string;
  density: string;
  tags: string[];
  scenes: SceneText[];
}

const TEXT: Record<"en" | "zh", Locale> = {
  en: {
    theme: "Piecing the Idea Together",
    density: "Layered / tactile",
    tags: ["warm", "handmade", "layered", "earthy", "collage", "restless"],
    scenes: [
      {
        title: "the desk",
        hand: "piece it together",
        frags: ["A first scrap, set down."],
        labels: [],
        beats: [
          {
            action: "A first fragment lands",
            title: "Start here",
            body: "One torn scrap laid on the paper, its title scrawled by hand.",
          },
        ],
      },
      {
        title: "the scraps",
        hand: "keep cutting",
        frags: ["an observation", "half a question", "a stray fact", "a late hunch"],
        labels: [],
        beats: [
          {
            action: "Scraps pile on",
            title: "Gather pieces",
            body: "Clippings land at odd angles, each casting its own soft shadow.",
          },
          {
            action: "The pile thickens",
            title: "More arrive",
            body: "New fragments push in and the earlier ones shift to make room.",
          },
        ],
      },
      {
        title: "the connections",
        hand: "because →",
        frags: ["a cause", "an effect", "the context"],
        labels: ["because", "leads to"],
        beats: [
          {
            action: "Pieces sit apart",
            title: "Loose ends",
            body: "Three fragments wait, unrelated, in reserved slots on the desk.",
          },
          {
            action: "Arrows link them",
            title: "Draw the links",
            body: "A hand traces arrows between scraps, naming each relation.",
          },
        ],
      },
      {
        title: "the composition",
        hand: "nudge, don't snap",
        frags: ["intro", "claim", "proof", "turn"],
        labels: [],
        beats: [
          {
            action: "Pieces nudge closer",
            title: "Nudge into place",
            body: "The scattered pile drifts inward, spacing tightening by a hand.",
          },
          {
            action: "A whole emerges",
            title: "It reads as one",
            body: "Overlap becomes composition — the fragments finally cohere.",
          },
        ],
      },
      {
        title: "pinned down",
        hand: "done.",
        frags: ["the finished collage", "one piece runs off the edge"],
        labels: [],
        beats: [
          {
            action: "The collage is fixed",
            title: "Pinned down",
            body: "Tape and pins hold it; one scrap still bleeds past the frame.",
          },
        ],
      },
    ],
  },
  zh: {
    theme: "拼出想法",
    density: "分层 / 触感",
    tags: ["温暖", "手作", "分层", "土色", "拼贴", "躁动"],
    scenes: [
      {
        title: "书桌",
        hand: "拼起来",
        frags: ["第一片纸，落定。"],
        labels: [],
        beats: [
          {
            action: "第一片碎纸落下",
            title: "从这里开始",
            body: "一片撕下的纸放在桌面，标题用手随笔写下。",
          },
        ],
      },
      {
        title: "碎纸",
        hand: "继续剪",
        frags: ["一处观察", "半个问题", "零散事实", "迟来的直觉"],
        labels: [],
        beats: [
          {
            action: "碎纸堆叠",
            title: "收集碎片",
            body: "剪报以斜角落下，每片都投出自己的柔和阴影。",
          },
          {
            action: "越堆越厚",
            title: "越来越多",
            body: "新碎片挤入，先前的纸片挪动腾出位置。",
          },
        ],
      },
      {
        title: "连接",
        hand: "因为 →",
        frags: ["起因", "结果", "背景"],
        labels: ["因为", "导向"],
        beats: [
          {
            action: "碎片各自散着",
            title: "散乱线头",
            body: "三片碎纸在预留的位置上等待，尚无关联。",
          },
          {
            action: "箭头连起它们",
            title: "画出连线",
            body: "手在碎片之间描出箭头，为每段关系命名。",
          },
        ],
      },
      {
        title: "构图",
        hand: "推，别对齐",
        frags: ["引子", "主张", "佐证", "转折"],
        labels: [],
        beats: [
          {
            action: "碎片相互靠拢",
            title: "推入位置",
            body: "散落的纸堆向内漂移，被手一点点收紧间距。",
          },
          {
            action: "整体浮现",
            title: "读作一体",
            body: "重叠成了构图，碎片终于连成一片。",
          },
        ],
      },
      {
        title: "钉住",
        hand: "成。",
        frags: ["拼贴定稿", "一片探出画框"],
        labels: [],
        beats: [
          {
            action: "拼贴定稿",
            title: "钉牢",
            body: "胶带与图钉压住它；仍有一片纸探出画框之外。",
          },
        ],
      },
    ],
  },
};

/* ── Paper primitives ───────────────────────────────────────────────── */

interface ScrapProps {
  l: number;
  t: number;
  w: number;
  h: number;
  rot: number;
  bg: string;
  clip: string;
  z?: number;
  land?: boolean;
  delay?: number;
  children?: React.ReactNode;
}

/** Absolute, rotated on the outer box (used by non-FLIP scenes). */
function AbsScrap({ l, t, w, h, rot, bg, clip, z = 1, land, delay = 0, children }: ScrapProps) {
  return (
    <div
      className={`${styles.scrap} ${land ? styles.land : ""}`}
      style={{
        left: `${l}cqw`,
        top: `${t}cqh`,
        width: `${w}cqw`,
        height: `${h}cqh`,
        transform: `rotate(${rot}deg)`,
        zIndex: z,
        animationDelay: `${delay}ms`,
      }}
    >
      <div className={styles.paper} style={{ background: bg, clipPath: clip }}>
        <div className={styles.pad}>{children}</div>
      </div>
    </div>
  );
}

/** Flex item; rotation on the INNER paper so FLIP can own the outer transform. */
function FlexScrap({
  w,
  h,
  rot,
  bg,
  clip,
  children,
}: {
  w: number;
  h: number;
  rot: number;
  bg: string;
  clip: string;
  children?: React.ReactNode;
}) {
  return (
    <div data-beat-layout-item="true" style={{ width: `${w}cqw`, height: `${h}cqh`, flex: "0 0 auto" }}>
      <div className={styles.paper} style={{ background: bg, clipPath: clip, transform: `rotate(${rot}deg)` }}>
        <div className={styles.pad}>{children}</div>
      </div>
    </div>
  );
}

function Frag({ children }: { children: React.ReactNode }) {
  return <span className={styles.frag}>{children}</span>;
}

/* ── Scenes ─────────────────────────────────────────────────────────── */

interface SceneProps {
  scene: number;
  beat: number;
  isActive: boolean;
  reducedMotion: boolean;
  isThumbnail: boolean;
  language: "en" | "zh";
}

function CollageScene({ scene, beat, isActive, reducedMotion, isThumbnail, language }: SceneProps) {
  const motionScene = scene === 2 || scene === 4;
  const { ref } = useFLIP<HTMLDivElement>({
    watch: [beat, scene],
    disabled: reducedMotion || isThumbnail || !isActive || !motionScene,
    duration: 480,
    easing: "cubic-bezier(0.34, 1.56, 0.64, 1)",
    selector: '[data-beat-layout-item="true"]',
  });

  const t = TEXT[language].scenes[scene - 1];
  const b = t.beats[Math.min(beat, t.beats.length - 1)];

  if (scene === 1) {
    return (
      <div className={styles.scene}>
        <div className={styles.tape} style={{ left: "26cqw", top: "20cqh", width: "12cqw", height: "5cqh", transform: "rotate(-7deg)" }} />
        <AbsScrap l={22} t={22} w={44} h={52} rot={-3.5} bg={CLR.cream} clip={TORN[0]} z={4} land delay={60}>
          <div>
            <div className={styles.hand} style={{ fontSize: "6cqh", color: CLR.rust, marginBottom: "1.4cqh" }}>{t.hand}</div>
            <Frag>{b.title}</Frag>
            <p className={styles.body} style={{ fontSize: "2.4cqh", marginTop: "1.2cqh" }}>{b.body}</p>
          </div>
        </AbsScrap>
        <AbsScrap l={60} t={54} w={22} h={16} rot={5} bg={CLR.mustard} clip={TORN[2]} z={5} land delay={220}>
          <span className={styles.hand} style={{ fontSize: "3.8cqh", color: CLR.ink }}>{t.frags[0]}</span>
        </AbsScrap>
        <div className={styles.pin} style={{ left: "24cqw", top: "23cqh" }} />
      </div>
    );
  }

  if (scene === 2) {
    const count = beat >= 1 ? 4 : 2;
    const specs = [
      { w: 30, h: 15, rot: -3, bg: CLR.manila, clip: TORN[1] },
      { w: 34, h: 16, rot: 4, bg: CLR.cream, clip: TORN[0] },
      { w: 28, h: 14, rot: -5, bg: CLR.indigo, clip: TORN[2] },
      { w: 32, h: 15, rot: 3, bg: CLR.mustard, clip: TORN[1] },
    ];
    const inkOn = [CLR.ink, CLR.ink, CLR.cream, CLR.ink];
    return (
      <div className={styles.scene}>
        <div className={styles.hand} style={{ position: "absolute", left: "70cqw", top: "16cqh", fontSize: "5cqh", color: CLR.rust, transform: "rotate(6deg)", zIndex: 30 }}>{t.hand}</div>
        <div className={styles.tape} style={{ left: "8cqw", top: "12cqh", width: "10cqw", height: "4.4cqh", transform: "rotate(-11deg)" }} />
        <div
          ref={ref}
          data-beat-layout-container="true"
          data-beat-layout-mode="motion"
          style={{ position: "absolute", left: "12cqw", top: "0", width: "56cqw", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", gap: "2.4cqh" }}
        >
          {specs.slice(0, count).map((s, i) => (
            <FlexScrap key={i} {...s}>
              <span className={styles.frag} style={{ fontSize: "3cqh", color: inkOn[i] }}>{t.frags[i]}</span>
            </FlexScrap>
          ))}
        </div>
        <div className={styles.pin} style={{ left: "13cqw", top: "13cqh" }} />
      </div>
    );
  }

  if (scene === 3) {
    const linked = beat >= 1;
    const slots = [
      { l: 8, t: 34, w: 22, h: 22, rot: -4, bg: CLR.manila, clip: TORN[0], ink: CLR.ink },
      { l: 40, t: 22, w: 22, h: 22, rot: 3, bg: CLR.focal, clip: TORN[1], ink: CLR.cream },
      { l: 71, t: 40, w: 22, h: 22, rot: -3, bg: CLR.indigo, clip: TORN[2], ink: CLR.cream },
    ];
    return (
      <div className={styles.scene}>
        <div className={styles.hand} style={{ position: "absolute", left: "6cqw", top: "12cqh", fontSize: "4.6cqh", color: CLR.rust, zIndex: 30 }}>{t.title}</div>
        <div
          ref={ref}
          data-beat-layout-container="true"
          data-beat-layout-mode="reserved"
          className={styles.scene}
        >
          {slots.map((s, i) => (
            <div key={i} data-beat-layout-item="true">
              <AbsScrap l={s.l} t={s.t} w={s.w} h={s.h} rot={s.rot} bg={s.bg} clip={s.clip} z={6}>
                <span className={styles.frag} style={{ fontSize: "3cqh", color: s.ink }}>{t.frags[i]}</span>
              </AbsScrap>
            </div>
          ))}
          <svg className={styles.arrows} viewBox="0 0 100 56" preserveAspectRatio="none" style={{ opacity: linked ? 1 : 0 }} data-beat-layout-item="true">
            <path className={styles.arrowPath} d="M 26 40 C 33 30, 40 34, 47 32" />
            <path className={styles.arrowPath} d="M 44 32 L 47 32 L 45.5 35" />
            <path className={styles.arrowPath} d="M 58 33 C 66 33, 72 40, 79 44" />
            <path className={styles.arrowPath} d="M 76 44 L 79 44 L 77.5 41" />
          </svg>
          <div data-beat-layout-item="true" className={styles.hand} style={{ position: "absolute", left: "32cqw", top: "58cqh", fontSize: "3.6cqh", color: CLR.rust, transform: "rotate(-5deg)", zIndex: 25, opacity: linked ? 1 : 0, transition: "opacity 380ms" }}>{t.labels[0]}</div>
          <div data-beat-layout-item="true" className={styles.hand} style={{ position: "absolute", left: "62cqw", top: "30cqh", fontSize: "3.6cqh", color: CLR.rust, transform: "rotate(6deg)", zIndex: 25, opacity: linked ? 1 : 0, transition: "opacity 380ms" }}>{t.labels[1]}</div>
        </div>
        <div className={styles.pin} style={{ left: "50cqw", top: "23cqh" }} />
      </div>
    );
  }

  if (scene === 4) {
    const cohered = beat >= 1;
    const specs = [
      { w: 21, h: 24, rot: -4, bg: CLR.manila, clip: TORN[0], ink: CLR.ink },
      { w: 21, h: 24, rot: 3, bg: CLR.focal, clip: TORN[1], ink: CLR.cream },
      { w: 21, h: 24, rot: -3, bg: CLR.indigo, clip: TORN[2], ink: CLR.cream },
      { w: 21, h: 24, rot: 5, bg: CLR.mustard, clip: TORN[0], ink: CLR.ink },
    ];
    return (
      <div className={styles.scene}>
        <div className={styles.hand} style={{ position: "absolute", left: "8cqw", top: "13cqh", fontSize: "4.6cqh", color: CLR.rust, transform: "rotate(-4deg)", zIndex: 30 }}>{t.hand}</div>
        <div className={styles.tape} style={{ left: "45cqw", top: "20cqh", width: "11cqw", height: "4.6cqh", transform: "rotate(4deg)" }} />
        <div
          ref={ref}
          data-beat-layout-container="true"
          data-beat-layout-mode="motion"
          style={{ position: "absolute", inset: "0", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center", gap: cohered ? "1cqw" : "5cqw", padding: "0 12cqw" }}
        >
          {specs.map((s, i) => (
            <FlexScrap key={i} w={s.w} h={s.h} rot={cohered ? s.rot * 0.35 : s.rot} bg={s.bg} clip={s.clip}>
              <span className={styles.frag} style={{ fontSize: "2.9cqh", color: s.ink }}>{t.frags[i]}</span>
            </FlexScrap>
          ))}
        </div>
        <div className={styles.pin} style={{ left: "50cqw", top: "34cqh" }} />
      </div>
    );
  }

  // scene 5 — pinned down; one piece bleeds off the right edge
  return (
    <div className={styles.scene}>
      <div className={styles.tape} style={{ left: "30cqw", top: "16cqh", width: "13cqw", height: "5cqh", transform: "rotate(-6deg)" }} />
      <AbsScrap l={14} t={26} w={40} h={44} rot={-2.5} bg={CLR.cream} clip={TORN[0]} z={4} land delay={40}>
        <div>
          <Frag>{b.title}</Frag>
          <p className={styles.body} style={{ fontSize: "2.3cqh", marginTop: "1.2cqh" }}>{b.body}</p>
        </div>
      </AbsScrap>
      <AbsScrap l={40} t={52} w={26} h={22} rot={4} bg={CLR.focal} clip={TORN[1]} z={6} land delay={200}>
        <span className={styles.frag} style={{ fontSize: "2.8cqh", color: CLR.cream }}>{t.frags[0]}</span>
      </AbsScrap>
      {/* bleed off-frame */}
      <AbsScrap l={78} t={30} w={34} h={26} rot={7} bg={CLR.indigo} clip={TORN[2]} z={3} land delay={320}>
        <span className={styles.frag} style={{ fontSize: "2.6cqh", color: CLR.cream }}>{t.frags[1]}</span>
      </AbsScrap>
      <div className={styles.hand} style={{ position: "absolute", left: "17cqw", top: "62cqh", fontSize: "6.5cqh", color: CLR.rust, transform: "rotate(-6deg)", zIndex: 20 }}>{t.hand}</div>
      <div className={styles.pin} style={{ left: "16cqw", top: "28cqh" }} />
      <div className={styles.pin} style={{ left: "52cqw", top: "68cqh" }} />
    </div>
  );
}

/* ── Navigation: N10 pin-prick scene index ──────────────────────────── */

function PinNav({
  scene,
  isThumbnail,
  onNavigate,
  language,
}: {
  scene: number;
  isThumbnail: boolean;
  onNavigate?: (scene: number, beat: number) => void;
  language: "en" | "zh";
}) {
  if (isThumbnail) return null;
  const scenes = TEXT[language].scenes;
  return (
    <div
      className={styles.nav}
      data-topic-navigation="true"
      data-navigation-geometry={NAVIGATION.geometry}
      data-navigation-carrier={NAVIGATION.carrier}
      data-navigation-invocation={NAVIGATION.invocation}
      data-navigation-feedback={NAVIGATION.feedback}
    >
      {scenes.map((s, i) => {
        const target = i + 1;
        const active = target === scene;
        return (
          <button
            key={target}
            type="button"
            aria-label={s.title}
            title={s.title}
            className={`${styles.navPin} ${active ? styles.navPinActive : ""}`}
            onClick={(e) => {
              e.stopPropagation();
              onNavigate?.(target, 0);
            }}
          />
        );
      })}
    </div>
  );
}

/* ── Root ───────────────────────────────────────────────────────────── */

function TopicStage({
  scene,
  beat,
  language,
  isThumbnail,
  reducedMotion,
  onNavigate,
}: TopicStageProps) {
  const off = reducedMotion || isThumbnail;
  return (
    <div className={styles.root} data-motion={off ? "off" : "on"}>
      <SpatialSceneTrack
        scene={scene}
        beat={beat}
        transitionKind="slide-x"
        transitionMap={TRANSITIONS}
        reducedMotion={off}
        beatLayoutModes={{ 2: "motion", 3: "reserved", 4: "motion" }}
        renderScene={(sceneId, sceneBeat, isActive) => (
          <CollageScene
            scene={sceneId}
            beat={sceneBeat}
            isActive={isActive}
            reducedMotion={reducedMotion}
            isThumbnail={isThumbnail}
            language={language}
          />
        )}
      />
      <PinNav scene={scene} isThumbnail={isThumbnail} onNavigate={onNavigate} language={language} />
    </div>
  );
}

/* ── Metadata ───────────────────────────────────────────────────────── */

function buildMetadata(lang: "en" | "zh"): TopicMetadata {
  const L = TEXT[lang];
  return {
    theme: L.theme,
    densityLabel: L.density,
    heroScene: 2,
    colors: { bg: CLR.bg, ink: CLR.ink, panel: CLR.panel },
    typography: { header: "Caveat", body: "Source Serif 4" },
    tags: L.tags,
    fonts: [
      "Caveat:wght@400;700",
      "Source Serif 4:ital,wght@0,400;0,600;0,700",
      "cjk:Noto Serif SC:wght@400;600",
      "cjk:Ma Shan Zheng:wght@400",
    ],
    scenes: L.scenes.map((s, i) => ({
      id: i + 1,
      title: s.title,
      beats: s.beats.map((b, j) => ({
        id: j,
        action: b.action,
        title: b.title,
        body: b.body,
      })),
    })),
  };
}

const metadata = {
  en: buildMetadata("en"),
  zh: buildMetadata("zh"),
} satisfies TopicDefinition["metadata"];

export default defineTopic({
  id: "piecing-idea-together",
  styleId: "analog-cutout-collage",
  title: { en: "Piecing the Idea Together", zh: "拼出想法" },
  modelId: "Claude Opus 4.8",
  Stage: TopicStage,
  metadata,
  navigation: NAVIGATION,
  transitionScore: TRANSITIONS,
  evidence: {
    kind: "illustrative",
    boundary: {
      en: "Illustrative scenario: names, figures, and outcomes are presentation examples, not external factual claims.",
      zh: "示例场景：其中名称、数字和结果均为演示内容，并非外部事实主张。",
    },
    display: "envelope",
  },
});

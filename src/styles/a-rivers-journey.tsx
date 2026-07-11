import { useEffect } from "react";
import type { BespokeStyleProps, StyleMetadata } from "../types";
import { defineStyleTopic } from "./topic";
import SpatialSceneTrack from "./SpatialSceneTrack";
import type { SceneTransitionMap } from "./SpatialSceneTrack";
import { useFLIP } from "../hooks/useFLIP";
import styles from "./a-rivers-journey.module.css";

/* ── Woodblock Floating-World · v3 · "A River's Journey" ──────────────────────
   A river from source to sea told as a floating-world journey. Flat unshaded
   ink planes bounded by confident key-lines on warm paper, one bokashi sky in
   the valley, a single red seal stamping the opening and the close. Motion is
   calm drift + ink-settling fades — nothing snaps or bounces. cqw/cqh only. */

const STYLE_ID = "woodblock-floating-world";
const BAND = "craft-cultural";
const NAME = "Woodblock Floating-World";

const PALETTE = {
  paper: "#f2e6cf",
  panel: "#e7d6b4",
  indigo: "#1e2c4f",
  indigoMid: "#34507e",
  ochre: "#b4813c",
  malachite: "#2f7d5b",
  vermilion: "#c33a2b",
};

const FONT_LINK_ID = "woodblock-floating-world-v3-fonts";
const FONT_HREF =
  "https://fonts.googleapis.com/css2?family=Shippori+Mincho:wght@500;700&family=Zen+Kaku+Gothic+New:wght@400;500;700&family=Noto+Serif+SC:wght@700&family=Noto+Sans+SC:wght@400;500&display=swap";

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

/* ── Bilingual copy (plain object — NO `as const`, keeps en/zh widened) ─────── */
interface BeatCopy {
  title: string;
  body: string;
}
interface SceneCopy {
  title: string;
  eyebrow: string;
  beats: BeatCopy[];
}
interface LangCopy {
  theme: string;
  densityLabel: string;
  scenes: SceneCopy[];
}

const COPY: Record<"en" | "zh", LangCopy> = {
  en: {
    theme: "A River's Journey",
    densityLabel: "Sparse · Serene",
    scenes: [
      {
        title: "Source",
        eyebrow: "The Beginning",
        beats: [
          {
            title: "A spring in high stone",
            body: "Snowmelt gathers in a hollow of rock and takes its first step downhill.",
          },
        ],
      },
      {
        title: "The Rapids",
        eyebrow: "Descent",
        beats: [
          {
            title: "White water",
            body: "The channel narrows; the current quickens between the stones.",
          },
          {
            title: "Cutting the gorge",
            body: "Century upon century, the water carves the rock a little deeper.",
          },
          {
            title: "Spray and thread",
            body: "Where it falls, the river breaks into a thousand bright threads.",
          },
        ],
      },
      {
        title: "The Valley",
        eyebrow: "Stillness",
        beats: [
          {
            title: "The river slows",
            body: "Free of the mountains, the water spreads wide and grows calm.",
          },
          {
            title: "Fields and villages",
            body: "Along the banks, rice terraces and quiet roofs take the water's gift.",
          },
          {
            title: "One graded evening",
            body: "A single soft sky settles over the valley as the day cools.",
          },
        ],
      },
      {
        title: "The Delta",
        eyebrow: "Dispersal",
        beats: [
          {
            title: "The river divides",
            body: "Nearing the coast, one channel becomes two, then several.",
          },
          {
            title: "Silt and marsh",
            body: "Carried earth settles into flats of reed, mud, and shallow light.",
          },
          {
            title: "Many mouths",
            body: "The single river arrives as a fan of quiet, branching water.",
          },
        ],
      },
      {
        title: "The Sea",
        eyebrow: "Arrival",
        beats: [
          {
            title: "The horizon opens",
            body: "The river gives itself to the sea, and the journey rests. The seal closes the tale.",
          },
        ],
      },
    ],
  },
  zh: {
    theme: "一条河",
    densityLabel: "疏朗 · 静谧",
    scenes: [
      {
        title: "源头",
        eyebrow: "起始",
        beats: [
          { title: "高石之泉", body: "融雪聚于石凹，河水迈出下山的第一步。" },
        ],
      },
      {
        title: "急流",
        eyebrow: "下行",
        beats: [
          { title: "白色的水", body: "河道收窄，水流在乱石之间骤然加快。" },
          { title: "切开峡谷", body: "一个世纪又一个世纪，流水把岩层刻得更深。" },
          { title: "飞沫成丝", body: "跌落之处，河水碎成千缕明亮的细线。" },
        ],
      },
      {
        title: "河谷",
        eyebrow: "静缓",
        beats: [
          { title: "河流放慢", body: "脱离山峦，水面铺展开来，渐渐平静。" },
          { title: "田畴与村落", body: "两岸的稻田与静默的屋檐，承接着水的馈赠。" },
          { title: "一抹晚色", body: "一层柔和的天光，随日暮沉落在河谷之上。" },
        ],
      },
      {
        title: "三角洲",
        eyebrow: "分流",
        beats: [
          { title: "河分为二", body: "临近海岸，一条河先分作两支，再化为数股。" },
          { title: "淤泥与滩涂", body: "带来的泥沙沉为芦苇、泥滩与浅浅的光。" },
          { title: "众多河口", body: "同一条河，以一把安静的、分叉的水抵达。" },
        ],
      },
      {
        title: "入海",
        eyebrow: "抵达",
        beats: [
          {
            title: "地平线打开",
            body: "河把自己交给海，旅程就此安歇；印章为故事收尾。",
          },
        ],
      },
    ],
  },
};

const TRANSITIONS: SceneTransitionMap = {
  "1->2": "slide-x",
  "2->3": "slide-x",
  "3->4": "slide-x",
  "4->5": "fade",
};

/* ── Shared bits ────────────────────────────────────────────────────────── */
function Seal() {
  return (
    <div className={styles.seal} aria-hidden>
      <span className={styles.sealChar}>河</span>
    </div>
  );
}

/* Scene 1 — Source: mountain spring, vertical title, seal. */
function SceneSource({ text, still }: { text: SceneCopy; still: boolean }) {
  const beat = text.beats[0];
  return (
    <div className={styles.scene}>
      <svg
        className={styles.svgFill}
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden
      >
        {/* far ridge — cropped hard off the top-right */}
        <polygon
          points="34,0 100,0 100,46 62,20 40,40 34,26"
          fill={PALETTE.indigoMid}
          stroke={PALETTE.indigo}
          strokeWidth={1.4}
          vectorEffect="non-scaling-stroke"
        />
        {/* near mountain plane */}
        <polygon
          points="0,58 30,14 52,40 44,58 20,58"
          fill={PALETTE.indigo}
          stroke={PALETTE.indigo}
          strokeWidth={1.4}
          vectorEffect="non-scaling-stroke"
        />
        {/* spring pool */}
        <ellipse
          cx="27"
          cy="60"
          rx="7.5"
          ry="2.6"
          fill={PALETTE.malachite}
          stroke={PALETTE.indigo}
          strokeWidth={1.2}
          vectorEffect="non-scaling-stroke"
        />
        {/* first river line descending, asymmetric */}
        <path
          d="M27 62 C 30 74, 46 78, 52 92 S 70 104, 78 108"
          fill="none"
          stroke={PALETTE.indigoMid}
          strokeWidth={2.4}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      <div
        className={styles.verticalTitle}
        style={{ right: "9cqw", top: "10cqh", fontSize: "12cqh" }}
      >
        {text.title}
      </div>

      <div
        className={`${styles.copyStack} ${still ? "" : styles.inkIn}`}
        style={{ left: "7cqw", bottom: "28cqh", width: "42cqw" }}
      >
        <span className={styles.action}>{text.eyebrow}</span>
        <h2 className={styles.display} style={{ fontSize: "5.4cqh" }}>
          {beat.title}
        </h2>
        <p className={styles.bodyLine}>{beat.body}</p>
      </div>

      <Seal />
    </div>
  );
}

/* A motion scene (Rapids / Delta): bottom-anchored line stack that grows per
   beat; existing lines glide up via FLIP. */
function MotionScene({
  text,
  beat,
  isActive,
  still,
  svg,
  stackStyle,
}: {
  text: SceneCopy;
  beat: number;
  isActive: boolean;
  still: boolean;
  svg: React.ReactNode;
  stackStyle: React.CSSProperties;
}) {
  const { ref } = useFLIP<HTMLDivElement>({
    watch: [beat],
    disabled: still || !isActive,
    duration: 520,
    easing: "cubic-bezier(0.22, 1, 0.36, 1)",
    selector: '[data-beat-layout-item="true"]',
  });
  const shown = text.beats.slice(0, beat + 1);
  const current = text.beats[Math.min(beat, text.beats.length - 1)];
  return (
    <div className={styles.scene}>
      {svg}
      <div
        ref={ref}
        className={styles.copyStack}
        style={stackStyle}
        data-beat-layout-container="true"
        data-beat-layout-mode="motion"
      >
        <span className={styles.action} data-beat-layout-item="true">
          {text.eyebrow}
        </span>
        {shown.map((b, i) => (
          <h2
            key={i}
            className={styles.display}
            data-beat-layout-item="true"
            style={{ fontSize: "4.4cqh", opacity: i === beat ? 1 : 0.4 }}
          >
            {b.title}
          </h2>
        ))}
        <p
          className={styles.bodyLine}
          data-beat-layout-item="true"
          style={{ marginTop: "0.6cqh" }}
        >
          {current.body}
        </p>
      </div>
    </div>
  );
}

function RapidsSvg() {
  return (
    <svg
      className={styles.svgFill}
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden
    >
      {/* dramatic diagonal water plane, cropped mid-form */}
      <polygon
        points="0,0 70,0 30,100 0,100"
        fill={PALETTE.indigo}
        stroke={PALETTE.indigo}
        strokeWidth={1.4}
        vectorEffect="non-scaling-stroke"
      />
      <polygon
        points="70,0 100,0 100,100 30,100"
        fill={PALETTE.indigoMid}
        stroke={PALETTE.indigo}
        strokeWidth={1.4}
        vectorEffect="non-scaling-stroke"
      />
      {/* foam threads — paper-colored gaps breaking the form */}
      <path
        d="M64 0 L26 100 M74 0 L36 100 M84 0 L46 100"
        stroke={PALETTE.paper}
        strokeWidth={2.6}
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
        opacity={0.85}
      />
    </svg>
  );
}

/* Scene 3 — Valley: reserved layout, ONE bokashi (graded) sky. */
function SceneValley({ text, beat }: { text: SceneCopy; beat: number }) {
  return (
    <div className={styles.scene}>
      <svg
        className={styles.svgFill}
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden
      >
        <defs>
          {/* the single permitted graded sky */}
          <linearGradient id="valleyBokashi" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#c8804f" />
            <stop offset="55%" stopColor="#e7c98f" />
            <stop offset="100%" stopColor={PALETTE.paper} />
          </linearGradient>
        </defs>
        {/* graded evening sky */}
        <rect x="0" y="0" width="100" height="40" fill="url(#valleyBokashi)" />
        {/* far fields — flat ochre + malachite */}
        <polygon
          points="0,40 100,40 100,58 0,52"
          fill={PALETTE.ochre}
          stroke={PALETTE.indigo}
          strokeWidth={1.2}
          vectorEffect="non-scaling-stroke"
        />
        <polygon
          points="0,52 100,58 100,66 0,62"
          fill={PALETTE.malachite}
          stroke={PALETTE.indigo}
          strokeWidth={1.2}
          vectorEffect="non-scaling-stroke"
        />
        {/* wide calm river low in the frame */}
        <polygon
          points="0,66 100,62 100,100 0,100"
          fill={PALETTE.indigoMid}
          stroke={PALETTE.indigo}
          strokeWidth={1.4}
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      <div
        className={styles.reservedStack}
        style={{ left: "7cqw", top: "12cqh", width: "40cqw", height: "44cqh" }}
        data-beat-layout-container="true"
        data-beat-layout-mode="reserved"
      >
        {text.beats.map((b, i) => (
          <div
            key={i}
            className={styles.reservedSlot}
            data-beat-layout-item="true"
            style={{ opacity: i === beat ? 1 : 0.32 }}
          >
            <span className={styles.action}>{text.eyebrow}</span>
            <h2
              className={styles.display}
              style={{ fontSize: "4cqh", color: i === beat ? PALETTE.indigo : PALETTE.indigoMid }}
            >
              {b.title}
            </h2>
            <p className={styles.bodyLine} style={{ fontSize: "1.9cqh" }}>
              {b.body}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function DeltaSvg({ beat }: { beat: number }) {
  const channels = [
    "M100 44 C 70 46, 48 40, 0 34",
    "M100 52 C 66 54, 40 56, 0 52",
    "M100 60 C 60 62, 34 70, 0 72",
    "M100 68 C 56 72, 30 84, 0 90",
  ];
  return (
    <svg
      className={styles.svgFill}
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden
    >
      {/* land flats */}
      <rect x="0" y="0" width="100" height="100" fill={PALETTE.panel} />
      <polygon
        points="0,30 100,20 100,40 0,44"
        fill={PALETTE.ochre}
        stroke={PALETTE.indigo}
        strokeWidth={1.2}
        vectorEffect="non-scaling-stroke"
      />
      <polygon
        points="0,80 100,74 100,100 0,100"
        fill={PALETTE.malachite}
        stroke={PALETTE.indigo}
        strokeWidth={1.2}
        vectorEffect="non-scaling-stroke"
      />
      {/* branching channels revealed with the beats */}
      {channels.map((d, i) => (
        <path
          key={i}
          d={d}
          fill="none"
          stroke={PALETTE.indigoMid}
          strokeWidth={i === 0 ? 3.2 : 2.2}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          opacity={i <= beat + 1 ? 0.92 : 0.12}
        />
      ))}
    </svg>
  );
}

/* Scene 5 — Sea: high open horizon, seal closes. */
function SceneSea({ text, still }: { text: SceneCopy; still: boolean }) {
  const beat = text.beats[0];
  return (
    <div className={styles.scene}>
      <svg
        className={styles.svgFill}
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden
      >
        {/* flat sky, flat sea — no gradient, discipline holds here */}
        <rect x="0" y="0" width="100" height="34" fill={PALETTE.panel} />
        <rect
          x="0"
          y="34"
          width="100"
          height="66"
          fill={PALETTE.indigo}
          stroke={PALETTE.indigo}
          strokeWidth={1.4}
          vectorEffect="non-scaling-stroke"
        />
        {/* a few quiet swell key-lines */}
        <path
          d="M0 50 H100 M0 64 H100 M0 80 H100"
          stroke={PALETTE.indigoMid}
          strokeWidth={2}
          vectorEffect="non-scaling-stroke"
          opacity={0.55}
        />
      </svg>

      <div
        className={`${styles.copyStack} ${still ? "" : styles.inkIn}`}
        style={{ left: "7cqw", top: "9cqh", width: "48cqw", justifyContent: "flex-start" }}
      >
        <span className={styles.action}>{text.eyebrow}</span>
        <h2 className={styles.display} style={{ fontSize: "6.4cqh" }}>
          {beat.title}
        </h2>
        <p className={styles.bodyLine} style={{ color: PALETTE.paper }}>
          {beat.body}
        </p>
      </div>

      <Seal />
    </div>
  );
}

/* ── Bespoke navigation: a boat drifting along a river line ─────────────────── */
const NAV_STOPS = [8, 29, 50, 71, 92];

function HorizonNav({
  scene,
  isThumbnail,
  onNavigate,
}: {
  scene: number;
  isThumbnail: boolean;
  onNavigate?: (scene: number, beat: number) => void;
}) {
  if (isThumbnail) return null;
  const boatLeft = NAV_STOPS[Math.min(Math.max(scene, 1), 5) - 1];
  return (
    <div className={styles.nav} aria-hidden>
      <div className={styles.navRiver} />
      {NAV_STOPS.map((pos, i) => (
        <button
          key={i}
          type="button"
          className={styles.navStop}
          style={{ left: `${pos}%` }}
          onClick={(e) => {
            e.stopPropagation();
            onNavigate?.(i + 1, 0);
          }}
        >
          <span className={styles.navTick} data-active={scene === i + 1} />
        </button>
      ))}
      <svg
        className={styles.boat}
        style={{ left: `${boatLeft}%` }}
        viewBox="0 0 24 24"
        aria-hidden
      >
        <path d="M3 15 L21 15 L18 20 L6 20 Z" fill={PALETTE.vermilion} />
        <path
          d="M12 3 L12 14 M12 4 C 17 6, 18 11, 18 13 L12 13 Z"
          fill={PALETTE.indigo}
          stroke={PALETTE.indigo}
          strokeWidth={1}
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

/* ── Root ───────────────────────────────────────────────────────────────── */
function WoodblockFloatingWorldV3(props: BespokeStyleProps) {
  const { scene, beat, language, isThumbnail, reducedMotion, onNavigate } = props;
  useFonts();
  const still = reducedMotion || isThumbnail;
  const lang = COPY[language];

  return (
    <div
      className={styles.root}
      data-reduced={still}
      style={{ background: PALETTE.paper }}
    >
      <SpatialSceneTrack
        scene={scene}
        beat={beat}
        transitionKind="slide-x"
        transitionMap={TRANSITIONS}
        reducedMotion={still}
        beatLayoutModes={{ 2: "motion", 3: "reserved", 4: "motion" }}
        renderScene={(sceneId, sceneBeat, isActive) => {
          const text = lang.scenes[sceneId - 1];
          if (sceneId === 1) return <SceneSource text={text} still={still} />;
          if (sceneId === 2)
            return (
              <MotionScene
                text={text}
                beat={sceneBeat}
                isActive={isActive}
                still={still}
                svg={<RapidsSvg />}
                stackStyle={{ left: "8cqw", bottom: "24cqh", width: "42cqw" }}
              />
            );
          if (sceneId === 3)
            return <SceneValley text={text} beat={sceneBeat} />;
          if (sceneId === 4)
            return (
              <MotionScene
                text={text}
                beat={sceneBeat}
                isActive={isActive}
                still={still}
                svg={<DeltaSvg beat={sceneBeat} />}
                stackStyle={{ right: "7cqw", bottom: "24cqh", width: "42cqw", alignItems: "flex-end", textAlign: "right" }}
              />
            );
          return <SceneSea text={text} still={still} />;
        }}
      />
      <HorizonNav scene={scene} isThumbnail={isThumbnail} onNavigate={onNavigate} />
    </div>
  );
}

/* ── Metadata (en/zh structurally identical) ────────────────────────────────── */
export function getMetadata(lang: "en" | "zh"): StyleMetadata {
  const c = COPY[lang];
  return {
    id: STYLE_ID,
    band: BAND,
    name: NAME,
    theme: c.theme,
    densityLabel: c.densityLabel,
    heroScene: 3,
    colors: { bg: PALETTE.paper, ink: PALETTE.indigo, panel: PALETTE.panel },
    typography: { header: "Shippori Mincho", body: "Zen Kaku Gothic New" },
    tags: [
      "contemplative",
      "craft-heritage",
      "flat-planes",
      "limited-ink",
      "calm-drift",
      "asymmetric",
    ],
    fonts: [
      "Shippori Mincho",
      "Zen Kaku Gothic New",
      "cjk:Noto Serif SC",
      "cjk:Noto Sans SC",
    ],
    scenes: c.scenes.map((s, si) => ({
      id: si + 1,
      title: s.title,
      beats: s.beats.map((b, bi) => ({
        id: bi,
        action: s.eyebrow,
        title: b.title,
        body: b.body,
      })),
    })),
  };
}

export const aRiversJourneyTopic = defineStyleTopic({
  id: "a-rivers-journey",
  topic: { en: COPY.en.theme, zh: COPY.zh.theme },
  model: "Claude Opus 4.8",
  component: WoodblockFloatingWorldV3,
  getMetadata,
});

export default WoodblockFloatingWorldV3;

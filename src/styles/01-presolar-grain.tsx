import type React from "react";
import type {
  BespokeStyleProps,
  StyleMetadata,
  TopicSource,
  TopicTransitionScore,
} from "../types";
import SpatialSceneTrack, {
  type BeatLayoutMode,
  type SceneTransitionMap,
} from "./SpatialSceneTrack";
import { defineStyleTopic } from "./topic";
import styles from "./01-presolar-grain.module.css";

type Language = "en" | "zh";
type SceneId = 1 | 2 | 3 | 4 | 5;

interface SceneCopy {
  eyebrow: string;
  title: string;
  subtitle: string;
  detail: string;
  annotation: string;
}

const SCENE_IDS: SceneId[] = [1, 2, 3, 4, 5];

const BEAT_COUNTS: Record<SceneId, number> = {
  1: 2,
  2: 2,
  3: 3,
  4: 3,
  5: 2,
};

const BEAT_LAYOUT_MODES: Partial<Record<number, BeatLayoutMode>> = {
  1: "reserved",
  2: "reserved",
  3: "reserved",
  4: "reserved",
  5: "reserved",
};

export const PRESOLAR_GRAIN_TRANSITION_SCORE = {
  "1->2": "crossfade",
  "2->3": "iris-open",
  "3->4": "zoom-through",
  "4->5": "dip-to-color",
} as const satisfies Readonly<TopicTransitionScore>;

const REDUCED_TRANSITION_SCORE: SceneTransitionMap = {
  "1->2": "hard-cut",
  "2->3": "hard-cut",
  "3->4": "hard-cut",
  "4->5": "hard-cut",
};

export const PRESOLAR_GRAIN_SOURCES = [
  {
    authority: "NASA Astromaterials Acquisition and Curation Office",
    title: "Why Research Meteorites?",
    url: "https://ares.jsc.nasa.gov/meteorite-falls/why-research-meteorites/",
    supports:
      "Meteorites preserve materials used to study Solar System evolution, and presolar grains inform the study of star formation and stellar evolution.",
  },
  {
    authority: "NASA Astrobiology",
    title: "Clues to the Processing of Dust around Stars",
    url: "https://astrobiology.nasa.gov/news/clues-to-the-processing-of-dust-around-stars/",
    supports:
      "Presolar grains originated before the Sun and occur in meteorites, interplanetary dust, and returned comet material; their minerals record stellar dust processing.",
  },
  {
    citation:
      "Hoppe, P. et al. (1994), The Astrophysical Journal 430, 870–890. doi:10.1086/174458",
    title:
      "Carbon, nitrogen, magnesium, silicon, and titanium isotopic compositions of single interstellar silicon carbide grains",
    url: "https://doi.org/10.1086/174458",
    supports:
      "Measurements of several isotope systems in individual Murchison SiC grains demonstrate that single grains carry non-solar patterns used to constrain their stellar sources.",
  },
  {
    citation:
      "Heck, P. R. et al. (2020), Proceedings of the National Academy of Sciences 117, 1884–1889. doi:10.1073/pnas.1904573117",
    title:
      "Lifetimes of interstellar dust from cosmic ray exposure ages of presolar silicon carbide",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC6995017/",
    supports:
      "Cosmogenic helium and neon in individual Murchison SiC grains preserve evidence of residence in interstellar space before incorporation into the Solar System.",
  },
] as const satisfies readonly TopicSource[];

const COPY: Record<SceneId, Record<Language, SceneCopy>> = {
  1: {
    en: {
      eyebrow: "PRESOLAR GRAIN · METEORITE SAMPLE",
      title: "Before the Sun, this grain existed.",
      subtitle:
        "A mineral fragment can preserve material made around another star.",
      detail: "One object. One earlier chapter of cosmic matter.",
      annotation: "ORIGINAL SVG MINERAL SECTION",
    },
    zh: {
      eyebrow: "太阳前尘 · 陨石样本",
      title: "在太阳诞生之前，这粒尘已经存在。",
      subtitle: "一片矿物，可以保存形成于另一颗恒星周围的物质。",
      detail: "一个物体。宇宙物质更早的一章。",
      annotation: "原创 SVG 矿物切面",
    },
  },
  2: {
    en: {
      eyebrow: "LOCATE",
      title: "Found in a meteorite. Identified by isotopes.",
      subtitle:
        "A meteorite thin section shows where the grain sits; its ratios show that its origin is not Solar.",
      detail: "Appearance locates the grain. Isotopic anomaly identifies it.",
      annotation: "METEORITE THIN SECTION",
    },
    zh: {
      eyebrow: "定位",
      title: "在陨石中找到。用同位素确认。",
      subtitle: "陨石薄片显示它位于何处；同位素比值表明它并非形成于太阳系。",
      detail: "外观负责定位。同位素异常负责识别。",
      annotation: "陨石薄片",
    },
  },
  3: {
    en: {
      eyebrow: "READ",
      title: "The fingerprint is a ratio.",
      subtitle:
        "Carbon and silicon isotope patterns can depart sharply from Solar System material.",
      detail:
        "Those departures connect a grain to nucleosynthesis in its parent star.",
      annotation: "not the Solar baseline",
    },
    zh: {
      eyebrow: "读取",
      title: "这枚指纹，是一组比值。",
      subtitle: "碳、硅同位素的组合，可以明显偏离太阳系物质。",
      detail: "这些偏离，把尘粒与其母恒星中的核合成过程连接起来。",
      annotation: "不是太阳系基线",
    },
  },
  4: {
    en: {
      eyebrow: "EXPAND",
      title: "One object. Four scales.",
      subtitle:
        "Lab → meteorite → Solar nebula → parent star",
      detail:
        "Condensed around another star, crossed interstellar space, entered Solar System material, then survived inside a meteorite.",
      annotation: "THE OBJECT STAYS STILL · THE CONTEXT EXPANDS",
    },
    zh: {
      eyebrow: "扩展",
      title: "一个物体。四重尺度。",
      subtitle: "实验室 → 陨石 → 太阳星云 → 母恒星",
      detail: "它在另一颗恒星周围凝结，穿过星际空间，进入太阳系物质，最终保存在陨石里。",
      annotation: "物体不动 · 背景尺度展开",
    },
  },
  5: {
    en: {
      eyebrow: "RETURN",
      title: "One grain. A stellar signature.",
      subtitle: "The evidence survived because the mineral survived.",
      detail:
        "A laboratory can read a star's material history from matter held inside a meteorite.",
      annotation: "QUIET HOLD",
    },
    zh: {
      eyebrow: "回到原点",
      title: "一粒尘。一枚恒星签名。",
      subtitle: "矿物保存下来，证据也随之保存。",
      detail: "实验室可以从陨石中的物质，读出一颗恒星的材料史。",
      annotation: "静默停留",
    },
  },
};

const NAV_LABELS: Record<Language, string[]> = {
  en: [
    "macro grain",
    "thin section",
    "isotope map",
    "cosmic scale",
    "return to grain",
  ],
  zh: ["尘粒特写", "陨石薄片", "同位素图", "宇宙尺度", "回到尘粒"],
};

const SCENE_TITLES: Record<Language, string[]> = {
  en: ["The Grain", "The Thin Section", "The Isotope Map", "The Scales", "The Return"],
  zh: ["一粒尘", "陨石薄片", "同位素图", "尺度展开", "回到一粒尘"],
};

const BEAT_ACTIONS: Record<Language, string[][]> = {
  en: [
    ["Hold the grain alone in darkness.", "Reveal the presolar claim."],
    ["Locate the grain in a meteorite section.", "Separate location from identification."],
    ["Introduce the ratio baseline.", "Reveal the carbon comparison.", "Complete the silicon isotope map."],
    ["Hold at laboratory scale.", "Expand through the meteorite and Solar nebula.", "Reach the parent-star context."],
    ["Fold all scales back into the grain.", "Settle on the stellar signature."],
  ],
  zh: [
    ["让尘粒独自停在黑暗中。", "揭示太阳前尘的核心判断。"],
    ["在陨石薄片中定位尘粒。", "区分位置证据与身份识别。"],
    ["建立比值基线。", "揭示碳同位素对照。", "完成硅同位素图。"],
    ["停留在实验室尺度。", "扩展到陨石与太阳星云。", "抵达母恒星背景。"],
    ["把所有尺度折回一粒尘。", "停在恒星签名上。"],
  ],
};

function toSceneId(scene: number): SceneId {
  return SCENE_IDS.includes(scene as SceneId) ? (scene as SceneId) : 1;
}

function clampBeat(scene: SceneId, beat: number): number {
  return Math.max(0, Math.min(Math.trunc(beat), BEAT_COUNTS[scene] - 1));
}

function getCopy(scene: SceneId, language: Language): SceneCopy {
  return COPY[scene][language];
}

export function getMetadata(lang: Language): StyleMetadata {
  const scenes = SCENE_IDS.map((scene) => {
    const copy = getCopy(scene, lang);
    const bodies = [copy.subtitle, copy.detail, copy.annotation];

    return {
      id: scene,
      title: SCENE_TITLES[lang][scene - 1],
      beats: Array.from({ length: BEAT_COUNTS[scene] }, (_, beat) => ({
        id: beat,
        action: BEAT_ACTIONS[lang][scene - 1][beat],
        title: copy.title,
        body: bodies[Math.min(beat, bodies.length - 1)],
      })),
    };
  });

  return {
    id: "minimal-product-keynote",
    band: "minimal-keynote",
    name: lang === "zh" ? "极简产品主题演讲" : "Minimal Product Keynote",
    theme: lang === "zh" ? "太阳前尘" : "Presolar Grain",
    densityLabel: lang === "zh" ? "舞台冲击 · 稀疏" : "Stage Impact · Sparse",
    heroScene: 1,
    colors: {
      bg: "#090908",
      ink: "#f4f0e6",
      panel: "#141310",
    },
    typography: {
      header: "Iowan Old Style 500",
      body: "Avenir Next 400",
    },
    tags: [
      "minimal",
      "premium",
      "presolar",
      "cosmochemistry",
      "stage-impact",
      "sparse",
      "scientific",
      "scale-journey",
    ],
    fonts: [
      "Iowan Old Style",
      "Avenir Next",
      "cjk:Songti SC",
      "cjk:PingFang SC",
    ],
    scenes,
  };
}

export default function PresolarGrain({
  scene,
  beat,
  language,
  isThumbnail,
  reducedMotion,
  onNavigate,
}: BespokeStyleProps) {
  const activeScene = toSceneId(scene);
  const activeBeat = clampBeat(activeScene, beat);
  const motionOff = reducedMotion || isThumbnail;

  return (
    <section
      className={styles.root}
      data-style-id="minimal-product-keynote"
      data-topic-id="presolar-grain"
      data-motion={motionOff ? "off" : "on"}
      data-frozen-state={motionOff ? "settled" : undefined}
    >
      <SpatialSceneTrack
        scene={activeScene}
        beat={activeBeat}
        sceneIds={SCENE_IDS}
        transitionKind={motionOff ? "hard-cut" : "crossfade"}
        transitionMap={
          motionOff ? REDUCED_TRANSITION_SCORE : PRESOLAR_GRAIN_TRANSITION_SCORE
        }
        transitionDurationMs={1120}
        reducedMotion={motionOff}
        beatLayoutModes={BEAT_LAYOUT_MODES}
        className={styles.sceneTrack}
        renderScene={(trackScene, trackBeat, isActive) => {
          const sceneId = toSceneId(trackScene);
          return (
            <ScenePanel
              scene={sceneId}
              beat={clampBeat(sceneId, trackBeat)}
              language={language}
              isActive={isActive}
            />
          );
        }}
      />
      <GrainNavigation
        activeScene={activeScene}
        language={language}
        hidden={isThumbnail}
        onNavigate={onNavigate}
      />
    </section>
  );
}

function ScenePanel({
  scene,
  beat,
  language,
  isActive,
}: {
  scene: SceneId;
  beat: number;
  language: Language;
  isActive: boolean;
}) {
  const copy = getCopy(scene, language);

  return (
    <article
      className={`${styles.scene} ${styles[`scene${scene}`]}`}
      data-scene-composition={
        ["macro", "thin-section", "isotope-map", "cosmic-scale", "single-object"][
          scene - 1
        ]
      }
      data-scene-beat={beat}
      data-active-panel={isActive ? "true" : "false"}
    >
      <div className={styles.makerMark} data-beat-layout-item="true">
        <span>{copy.eyebrow}</span>
        <span aria-hidden="true">P / 0{scene}</span>
      </div>
      <div className={styles.copyBlock} data-beat-layout-item="true">
        <h1 className={styles.title}>{copy.title}</h1>
        <p className={styles.subtitle} data-visible={beat >= 1 ? "true" : "false"}>
          {copy.subtitle}
        </p>
      </div>
      <div className={styles.visualField} data-beat-layout-item="true">
        {scene === 1 && <MacroGrain scene={scene} beat={beat} copy={copy} />}
        {scene === 2 && (
          <ThinSection scene={scene} beat={beat} copy={copy} />
        )}
        {scene === 3 && (
          <IsotopeMap scene={scene} beat={beat} copy={copy} />
        )}
        {scene === 4 && (
          <CosmicScale scene={scene} beat={beat} copy={copy} />
        )}
        {scene === 5 && <QuietReturn scene={scene} beat={beat} copy={copy} />}
      </div>
      <p
        className={styles.detail}
        data-beat-layout-item="true"
        data-visible={beat >= BEAT_COUNTS[scene] - 1 ? "true" : "false"}
      >
        {copy.detail}
      </p>
    </article>
  );
}

function MacroGrain({
  scene,
  beat,
  copy,
}: {
  scene: SceneId;
  beat: number;
  copy: SceneCopy;
}) {
  return (
    <div className={styles.macroComposition}>
      <span className={styles.giantScaleWord} aria-hidden="true">
        GRAIN
      </span>
      <div className={styles.macroGrain}>
        <GrainHero scene={scene} />
      </div>
      <span className={styles.objectLabel} data-visible={beat >= 1 ? "true" : "false"}>
        {copy.annotation}
      </span>
    </div>
  );
}

function ThinSection({
  scene,
  beat,
  copy,
}: {
  scene: SceneId;
  beat: number;
  copy: SceneCopy;
}) {
  return (
    <div className={styles.thinSectionComposition} data-thin-section="true">
      <svg
        className={styles.sectionPlate}
        aria-hidden="true"
        viewBox="0 0 900 520"
        preserveAspectRatio="xMidYMid meet"
      >
        <path
          d="M74 285 C72 126 228 55 411 71 C590 45 808 128 826 279 C840 410 675 474 492 448 C305 492 91 432 74 285Z"
          fill="url(#thin-section-matrix)"
          stroke="rgba(244,240,230,0.22)"
          strokeWidth="2"
        />
        <defs>
          <radialGradient id="thin-section-matrix" cx="46%" cy="42%" r="68%">
            <stop offset="0" stopColor="#28251f" />
            <stop offset="0.62" stopColor="#171612" />
            <stop offset="1" stopColor="#0c0c0a" />
          </radialGradient>
        </defs>
        <path d="M205 196L313 128L396 202L344 302L224 318Z" fill="#343027" opacity="0.62" />
        <path d="M535 118L690 173L645 287L516 269Z" fill="#302b24" opacity="0.48" />
        <path d="M435 315L597 306L671 392L518 430L402 392Z" fill="#25231e" opacity="0.72" />
      </svg>
      <div className={styles.embeddedGrain}>
        <GrainHero scene={scene} />
      </div>
      <span className={styles.sectionLeader} data-visible={beat >= 1 ? "true" : "false"} />
      <span className={styles.sectionCaption} data-visible={beat >= 1 ? "true" : "false"}>
        {copy.annotation.toLocaleLowerCase()}
      </span>
    </div>
  );
}

function IsotopeMap({
  scene,
  beat,
  copy,
}: {
  scene: SceneId;
  beat: number;
  copy: SceneCopy;
}) {
  const rails = [
    { label: "¹²C / ¹³C", visibleAt: 0, shift: "wide" },
    { label: "²⁹Si / ²⁸Si", visibleAt: 1, shift: "low" },
    { label: "³⁰Si / ²⁸Si", visibleAt: 2, shift: "high" },
  ];

  return (
    <div className={styles.isotopeComposition}>
      <div className={styles.isotopeGrain}>
        <GrainHero scene={scene} />
      </div>
      <div className={styles.railField}>
        <div className={styles.baselineLabel}>SOLAR BASELINE</div>
        {rails.map((rail) => (
          <div
            key={rail.label}
            className={styles.isotopeRail}
            data-isotope-rail="true"
            data-visible={beat >= rail.visibleAt ? "true" : "false"}
          >
            <span className={styles.railName}>{rail.label}</span>
            <span className={styles.railLine} />
            <span className={styles.solarMark} />
            <span className={styles.grainMark} data-shift={rail.shift} />
          </div>
        ))}
        <div className={styles.grainSignatureLabel} data-visible={beat >= 2 ? "true" : "false"}>
          {copy.annotation}
        </div>
      </div>
    </div>
  );
}

function CosmicScale({
  scene,
  beat,
  copy,
}: {
  scene: SceneId;
  beat: number;
  copy: SceneCopy;
}) {
  const scales = [
    { label: "LAB", visibleAt: 0 },
    { label: "METEORITE", visibleAt: 1 },
    { label: "SOLAR NEBULA", visibleAt: 1 },
    { label: "PARENT STAR", visibleAt: 2 },
  ];

  return (
    <div className={styles.scaleComposition}>
      <span className={styles.scaleStatement} aria-hidden="true">
        FOUR SCALES
      </span>
      <div className={styles.scaleSystem}>
        {scales.map((scale, index) => (
          <div
            key={scale.label}
            className={styles.scaleRing}
            data-scale-index={index}
            data-visible={beat >= scale.visibleAt ? "true" : "false"}
          >
            <span>{scale.label}</span>
          </div>
        ))}
        <div className={styles.scaleGrain}>
          <GrainHero scene={scene} />
        </div>
      </div>
      <span className={styles.scaleAnnotation} data-visible={beat >= 2 ? "true" : "false"}>
        {copy.annotation}
      </span>
    </div>
  );
}

function QuietReturn({
  scene,
  beat,
  copy,
}: {
  scene: SceneId;
  beat: number;
  copy: SceneCopy;
}) {
  return (
    <div className={styles.returnComposition} data-final-focus={beat >= 1 ? "true" : "false"}>
      <span className={styles.returnWord} aria-hidden="true">
        BEFORE
      </span>
      <div className={styles.returnGrain}>
        <GrainHero scene={scene} />
      </div>
      <span className={styles.returnLabel} data-visible={beat >= 1 ? "true" : "false"}>
        {copy.annotation}
      </span>
    </div>
  );
}

function GrainHero({ scene }: { scene: SceneId }) {
  const coreId = `presolar-grain-core-${scene}`;
  const edgeId = `presolar-grain-edge-${scene}`;

  return (
    <svg
      className={styles.grainSvg}
      data-grain-hero="true"
      role="img"
      aria-label="Faceted presolar mineral grain"
      viewBox="0 0 260 300"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <radialGradient id={coreId} cx="36%" cy="28%" r="78%">
          <stop offset="0" stopColor="#f4de9e" />
          <stop offset="0.24" stopColor="#ad8454" />
          <stop offset="0.67" stopColor="#51402f" />
          <stop offset="1" stopColor="#191816" />
        </radialGradient>
        <linearGradient id={edgeId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff5cc" stopOpacity="0.82" />
          <stop offset="0.45" stopColor="#b68a55" stopOpacity="0.35" />
          <stop offset="1" stopColor="#171614" stopOpacity="0.9" />
        </linearGradient>
      </defs>
      <ellipse cx="132" cy="270" rx="74" ry="12" fill="#000" opacity="0.38" />
      <path
        d="M64 60L139 22L216 72L232 166L189 251L98 270L37 204L28 112Z"
        fill={`url(#${coreId})`}
        stroke={`url(#${edgeId})`}
        strokeWidth="3"
      />
      <path d="M64 60L128 88L139 22Z" fill="#e2c27c" opacity="0.58" />
      <path d="M128 88L216 72L139 22Z" fill="#8c6845" opacity="0.64" />
      <path d="M128 88L178 151L216 72Z" fill="#705039" opacity="0.74" />
      <path d="M128 88L76 166L178 151Z" fill="#b28857" opacity="0.48" />
      <path d="M76 166L98 270L178 151Z" fill="#5b4432" opacity="0.72" />
      <path d="M178 151L189 251L98 270Z" fill="#382d24" opacity="0.82" />
      <path d="M28 112L76 166L64 60Z" fill="#927050" opacity="0.46" />
      <path
        className={styles.grainSheen}
        d="M58 73C96 55 125 45 161 45"
        fill="none"
        stroke="#fff4c9"
        strokeLinecap="round"
        strokeWidth="7"
        opacity="0.72"
      />
      <path d="M45 207L98 270L76 166Z" fill="#47372b" opacity="0.88" />
      <circle cx="119" cy="132" r="4" fill="#fff3c2" opacity="0.78" />
    </svg>
  );
}

function GrainNavigation({
  activeScene,
  language,
  hidden,
  onNavigate,
}: {
  activeScene: SceneId;
  language: Language;
  hidden: boolean;
  onNavigate?: (scene: number, beat: number) => void;
}) {
  if (hidden) return null;

  const navigate = (target: number) => {
    const next = Math.max(1, Math.min(5, target));
    onNavigate?.(next, 0);
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLButtonElement>,
  ) => {
    event.stopPropagation();
    if (event.repeat) return;

    const keyTargets: Partial<Record<string, number>> = {
      ArrowRight: activeScene + 1,
      ArrowDown: activeScene + 1,
      ArrowLeft: activeScene - 1,
      ArrowUp: activeScene - 1,
      Home: 1,
      End: 5,
    };
    const target = keyTargets[event.key];
    if (target === undefined) return;
    event.preventDefault();
    navigate(target);
  };

  return (
    <nav
      className={styles.grainNavigation}
      aria-label={language === "zh" ? "场景微尘导航" : "Scene grain navigation"}
      data-topic-navigation="true"
      data-navigation-geometry="ambient"
      data-navigation-carrier="corner-grain-field"
      data-navigation-invocation="persistent"
      data-navigation-feedback="active-glow"
      onPointerDown={(event) => event.stopPropagation()}
      onClick={(event) => event.stopPropagation()}
    >
      {SCENE_IDS.map((targetScene) => {
        const active = targetScene === activeScene;
        const label =
          language === "zh"
            ? `场景 ${targetScene}：${NAV_LABELS.zh[targetScene - 1]}`
            : `Scene ${targetScene}: ${NAV_LABELS.en[targetScene - 1]}`;

        return (
          <button
            key={targetScene}
            type="button"
            className={styles.grainNavButton}
            aria-label={label}
            aria-current={active ? "step" : undefined}
            data-active={active ? "true" : "false"}
            onClick={(event) => {
              event.stopPropagation();
              navigate(targetScene);
            }}
            onKeyDown={handleKeyDown}
          >
            <span className={styles.grainNavFacet} aria-hidden="true" />
          </button>
        );
      })}
    </nav>
  );
}

export const presolarGrainTopic = defineStyleTopic({
  id: "presolar-grain",
  topic: {
    en: "Presolar Grain",
    zh: "太阳前尘",
  },
  model: "GPT 5.6 Sol",
  component: PresolarGrain,
  getMetadata,
  navigation: {
    geometry: "ambient",
    carrier: "corner-grain-field",
    invocation: "persistent",
    feedback: "active-glow",
  },
  sources: PRESOLAR_GRAIN_SOURCES,
  transitionScore: PRESOLAR_GRAIN_TRANSITION_SCORE,
});

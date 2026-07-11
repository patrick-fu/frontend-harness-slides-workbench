import { useEffect } from "react";
import type React from "react";
import {
  defineTopic,
  type TopicDefinition,
  type TopicStageProps,
} from "../domain/topic";
import SpatialSceneTrack, {
  type BeatLayoutMode,
  type SceneTransitionMap,
} from "../styles/SpatialSceneTrack";
import styles from "./comet-anatomy.module.css";

type Language = TopicStageProps["language"];
type SceneId = 1 | 2 | 3 | 4 | 5;

interface BeatCopy {
  action: string;
  title: string;
  body: string;
  marker: string;
}

interface SceneCopy {
  code: string;
  sceneTitle: string;
  title: string;
  subtitle: string;
  evidence: string;
  beats: BeatCopy[];
}

const SCENE_IDS: SceneId[] = [1, 2, 3, 4, 5];

const BEAT_LAYOUT_MODES: Partial<Record<number, BeatLayoutMode>> = {
  2: "reserved",
  3: "reserved",
  4: "reserved",
};

const COMET_ANATOMY_TRANSITION_SCORE = {
  "1->2": "linear-wipe",
  "2->3": "push-x",
  "3->4": "iris-open",
  "4->5": "dip-to-color",
} as const satisfies TopicDefinition["transitionScore"];

const TRANSITION_MAP: SceneTransitionMap = COMET_ANATOMY_TRANSITION_SCORE;

const COMET_ANATOMY_SOURCES = [
  {
    authority: "NASA Science",
    title: "Comet Facts",
    citation: "NASA Science, Solar System Exploration, “Comet Facts,” accessed 2026.",
    url: "https://science.nasa.gov/solar-system/comets/facts/",
    supports:
      "Supports the general anatomy used across the Topic: a frozen nucleus containing ices and dust, solar heating that produces a coma, and distinct dust and ion tails directed away from the Sun.",
    boundary:
      "NASA describes a broad comet model; individual nuclei, activity levels, compositions, and tail visibility vary, so the drawings are explanatory rather than a universal specimen.",
  },
  {
    authority: "NASA Jet Propulsion Laboratory",
    title: "Basics of Space Flight — Chapter 1: The Solar System",
    citation: "NASA/JPL, Basics of Space Flight, Chapter 1, “Components of a Comet in the Vicinity of the Sun.”",
    url: "https://science.nasa.gov/learn/basics-of-space-flight/chapter1-3/",
    supports:
      "Supports the tail geometry: radiation pressure accelerates solid grains more slowly into a commonly curved dust tail, while solar-wind-driven ions form a straighter anti-solar tail.",
    boundary:
      "The page presents a teaching-level model and notes that cometary structures are diverse and dynamic; the two tail curves shown here are not trajectory predictions for one observation date.",
  },
  {
    authority: "European Space Agency — Rosetta Science",
    title: "Rosetta’s target: comet 67P/Churyumov–Gerasimenko",
    citation: "ESA Science & Technology, 67P target fact sheet, updated mission reference.",
    url: "https://sci.esa.int/web/rosetta/-/14615-comet-67p",
    supports:
      "Supports the 67P reference envelope of 4.34 × 2.60 × 2.12 kilometres, its 6.45-year orbital period, and the 1.243 AU perihelion and 5.68 AU aphelion values on the final plate.",
    boundary:
      "Those measurements belong to comet 67P, not to all comets; the opening silhouette is a newly drawn reference profile and does not reproduce a Rosetta photograph.",
  },
  {
    authority: "European Space Agency — Rosetta Mission",
    title: "Rosetta Frequently Asked Questions",
    citation: "ESA, Rosetta Mission FAQ, sections on comet activity, coma, and tails.",
    url: "https://www.esa.int/Science_Exploration/Space_Science/Rosetta/Frequently_asked_questions",
    supports:
      "Supports the causal sequence in the jet-field sheet: solar heating drives solid-to-gas sublimation, outflowing gas drags small dust grains, and the released material builds the coma and subsequent tails.",
    boundary:
      "The regular activity sequence is simplified into four beats; real outgassing is uneven, rotates with the nucleus, and can include short-lived outbursts that this Topic does not simulate.",
  },
  {
    authority: "Science / Rosetta MIRO team",
    title: "Subsurface properties and early activity of comet 67P/Churyumov–Gerasimenko",
    citation: "Gulkis, S. et al. Science 347 (2015): aaa0709. doi:10.1126/science.aaa0709.",
    url: "https://pubmed.ncbi.nlm.nih.gov/25613896/",
    supports:
      "Supports the scientific caution in the cutaway and jet plates: heat transport and sublimation are coupled, early water outgassing was localized, and observed rates varied with nucleus rotation and shape.",
    boundary:
      "MIRO measurements characterize 67P during a particular early mission interval; the internal dots and vents are schematic marks, not a reconstruction of measured three-dimensional strata.",
  },
] as const;

const COPY: Record<SceneId, Record<Language, SceneCopy>> = {
  1: {
    en: {
      code: "CA–01 / ORTHOGRAPHIC",
      sceneTitle: "Nucleus silhouette",
      title: "ANATOMY OF A COMET",
      subtitle: "Reference specimen · 67P/Churyumov–Gerasimenko",
      evidence: "Measured 67P envelope [S3] · silhouette redrawn, not mission imagery",
      beats: [
        {
          action: "Expose the irregular nucleus profile and its reference dimensions.",
          title: "4.34 × 2.60 × 2.12 km",
          body: "The solid nucleus is tiny beside the atmosphere and tails it can produce.",
          marker: "NUCLEUS / SCALE 1:50,000",
        },
      ],
    },
    zh: {
      code: "CA–01 / 正投影",
      sceneTitle: "彗核轮廓",
      title: "彗星解剖图",
      subtitle: "参考样本 · 67P/丘留莫夫–格拉西缅科彗星",
      evidence: "67P 实测包络尺寸 [S3] · 轮廓为原创重绘，并非任务照片",
      beats: [
        {
          action: "显露不规则彗核轮廓及参考尺寸。",
          title: "4.34 × 2.60 × 2.12 千米",
          body: "固态彗核很小，却能形成远大于自身的彗发与彗尾。",
          marker: "彗核 / 比例 1:50,000",
        },
      ],
    },
  },
  2: {
    en: {
      code: "CA–02 / SECTION A–A",
      sceneTitle: "Nucleus cutaway",
      title: "A NUCLEUS IS A MIXTURE",
      subtitle: "Porous dust, ices, and frozen gases—not a neat layered sphere.",
      evidence: "Schematic mixture—not literal strata [S1, S4, S5]",
      beats: [
        {
          action: "Cut through the irregular outline and reveal the insulating surface.",
          title: "A dusty surface limits the view",
          body: "Exposed ice can be scarce even when volatile material remains below.",
          marker: "SURFACE MANTLE",
        },
        {
          action: "Populate the section with a mixed ice-and-dust matrix.",
          title: "Volatiles occupy a porous matrix",
          body: "The symbols show ingredients and voids; they do not claim geological layers.",
          marker: "MIXED INTERIOR",
        },
      ],
    },
    zh: {
      code: "CA–02 / A–A 剖面",
      sceneTitle: "彗核剖面",
      title: "彗核是一种混合体",
      subtitle: "多孔尘埃、冰与冻结气体，而不是整齐分层的球体。",
      evidence: "混合物示意，并非真实地层 [S1, S4, S5]",
      beats: [
        {
          action: "切开不规则轮廓，显露隔热表层。",
          title: "含尘表面遮住了内部",
          body: "即使下方仍有挥发物，直接暴露的冰也可能很少。",
          marker: "表面尘幔",
        },
        {
          action: "在剖面中加入冰、尘与孔隙的混合矩阵。",
          title: "挥发物存在于多孔基质中",
          body: "符号只表达成分与孔隙，不代表真实地质分层。",
          marker: "混合内部",
        },
      ],
    },
  },
  3: {
    en: {
      code: "CA–03 / ACTIVE FIELD",
      sceneTitle: "Jet field",
      title: "SUNLIGHT SWITCHES ON THE FIELD",
      subtitle: "Activity is local: illuminated regions feed jets and an expanding coma.",
      evidence: "Mechanism simplified from Rosetta observations [S4, S5]",
      beats: [
        {
          action: "Mark the illuminated surface patch.",
          title: "01 · Heating reaches a volatile-bearing region",
          body: "The Sun-facing surface warms unevenly as the nucleus rotates.",
          marker: "INSOLATION",
        },
        {
          action: "Draw gas leaving the active patch.",
          title: "02 · Solid ice becomes gas",
          body: "Sublimation releases gas through active areas rather than every point equally.",
          marker: "SUBLIMATION",
        },
        {
          action: "Add entrained dust to the gas jets.",
          title: "03 · Outflow carries dust",
          body: "Gas flow can lift small grains into surrounding space.",
          marker: "DUST ENTRAINMENT",
        },
        {
          action: "Expand the diffuse coma around the nucleus.",
          title: "04 · Jets feed the coma",
          body: "The atmosphere grows far beyond the compact solid nucleus.",
          marker: "COMA FIELD",
        },
      ],
    },
    zh: {
      code: "CA–03 / 活跃区",
      sceneTitle: "喷流场",
      title: "阳光开启活跃区",
      subtitle: "活动具有局部性：受光区域产生喷流，并扩展成彗发。",
      evidence: "依据 Rosetta 观测简化机制 [S4, S5]",
      beats: [
        {
          action: "标出受光的表面区域。",
          title: "01 · 热量到达含挥发物区域",
          body: "彗核旋转时，朝向太阳的表面并非均匀升温。",
          marker: "日照",
        },
        {
          action: "绘出气体离开活跃区。",
          title: "02 · 固态冰直接变成气体",
          body: "升华集中发生在活跃区，而不是每一处表面。",
          marker: "升华",
        },
        {
          action: "在气体喷流中加入被带出的尘粒。",
          title: "03 · 外流携带尘埃",
          body: "气体流动可以把小颗粒带入周围空间。",
          marker: "尘埃夹带",
        },
        {
          action: "扩展彗核周围的弥散彗发。",
          title: "04 · 喷流供给彗发",
          body: "彗星大气可以扩展到远超固态彗核的尺度。",
          marker: "彗发场",
        },
      ],
    },
  },
  4: {
    en: {
      code: "CA–04 / VECTOR PLATE",
      sceneTitle: "Twin tails",
      title: "TWO TAILS. TWO FORCES.",
      subtitle: "Neither tail is simply a trail left behind the comet.",
      evidence: "Direction schematic—not an ephemeris [S1, S2]",
      beats: [
        {
          action: "Trace the broad curved dust tail under radiation pressure.",
          title: "Dust responds slowly",
          body: "Solid grains spread into a broad tail that commonly curves along the orbit.",
          marker: "DUST TAIL",
        },
        {
          action: "Add the straighter ion tail aligned with the solar wind.",
          title: "Ions couple to the solar wind",
          body: "Charged gas is swept into a narrower tail directed approximately anti-sunward.",
          marker: "ION TAIL",
        },
      ],
    },
    zh: {
      code: "CA–04 / 向量图版",
      sceneTitle: "双彗尾",
      title: "两条彗尾，两种作用",
      subtitle: "彗尾都不是简单拖在彗星身后的运动尾迹。",
      evidence: "方向示意，并非特定日期星历图 [S1, S2]",
      beats: [
        {
          action: "绘出受光压作用的宽阔弯曲尘尾。",
          title: "尘埃响应较慢",
          body: "固体颗粒形成宽阔尘尾，并常沿轨道方向弯曲。",
          marker: "尘尾",
        },
        {
          action: "加入沿太阳风方向展开的较直离子尾。",
          title: "离子与太阳风耦合",
          body: "带电气体被扫入更窄、近似背向太阳的尾部。",
          marker: "离子尾",
        },
      ],
    },
  },
  5: {
    en: {
      code: "CA–05 / ORBITAL PLATE",
      sceneTitle: "Orbital plate",
      title: "THE ANATOMY CHANGES WITH POSITION",
      subtitle: "The nucleus persists; sunlight changes how much of its larger structure appears.",
      evidence: "67P reference orbit · P 6.45 yr · q 1.243 AU · Q 5.68 AU [S3]",
      beats: [
        {
          action: "Place the nucleus, coma, and tails back onto the reference orbit.",
          title: "Near perihelion: coma and tails become prominent",
          body: "Farther out, the compact nucleus remains while activity weakens.",
          marker: "ORBIT / ACTIVITY WINDOW",
        },
      ],
    },
    zh: {
      code: "CA–05 / 轨道图版",
      sceneTitle: "轨道图版",
      title: "结构会随轨道位置改变",
      subtitle: "彗核持续存在；日照决定更大尺度结构显现多少。",
      evidence: "67P 参考轨道 · 周期 6.45 年 · 近日点 1.243 AU · 远日点 5.68 AU [S3]",
      beats: [
        {
          action: "把彗核、彗发与彗尾放回参考轨道位置。",
          title: "接近近日点：彗发与彗尾更明显",
          body: "远离太阳时，紧凑彗核仍在，而活动减弱。",
          marker: "轨道 / 活动窗口",
        },
      ],
    },
  },
};

const NAV_LABELS: Record<Language, string[]> = {
  en: [
    "Nucleus silhouette",
    "Nucleus cutaway",
    "Jet field",
    "Twin tails",
    "Orbital plate",
  ],
  zh: ["彗核轮廓", "彗核剖面", "喷流场", "双彗尾", "轨道图版"],
};

const COMPOSITIONS = [
  "orthographic-specimen",
  "sectioned-nucleus",
  "radial-jet-field",
  "anti-solar-vectors",
  "elliptical-orbit-plate",
] as const;

function useFonts() {
  useEffect(() => {
    const id = "comet-anatomy-fonts";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=Noto+Sans+SC:wght@400;500;600&display=swap";
    document.head.appendChild(link);
  }, []);
}

function clampScene(scene: number): SceneId {
  return SCENE_IDS.includes(scene as SceneId) ? (scene as SceneId) : 1;
}

function clampBeat(sceneId: SceneId, beat: number, settle: boolean): number {
  const lastBeat = COPY[sceneId].en.beats.length - 1;
  if (settle) return lastBeat;
  return Math.max(0, Math.min(beat, lastBeat));
}

function revealAt(beat: number, threshold: number): "true" | "false" {
  return beat >= threshold ? "true" : "false";
}

function createMetadata(
  language: Language,
): TopicDefinition["metadata"]["en"] {
  return {
    theme: language === "zh" ? "彗星解剖图" : "Anatomy of a Comet",
    densityLabel: language === "zh" ? "视觉叙事 · 技术图版" : "Visual narrative · Technical plate",
    heroScene: 3,
    colors: {
      bg: "#07345d",
      ink: "#edf8f4",
      panel: "#0b446f",
    },
    typography: {
      header: "IBM Plex Mono 600",
      body: "IBM Plex Mono 400",
    },
    tags: [
      "cyanotype",
      "comet",
      "scientific-plate",
      "cutaway",
      "astronomy",
      "technical-linework",
      "visual-narrative",
      "stroke-drawing",
    ],
    fonts: ["IBM Plex Mono", "cjk:Noto Sans SC"],
    scenes: SCENE_IDS.map((sceneId) => {
      const scene = COPY[sceneId][language];
      return {
        id: sceneId,
        title: scene.sceneTitle,
        beats: scene.beats.map((beat, beatId) => ({
          id: beatId,
          action: beat.action,
          title: beat.title,
          body: beat.body,
        })),
      };
    }),
  };
}

const metadata = {
  en: createMetadata("en"),
  zh: createMetadata("zh"),
} satisfies TopicDefinition["metadata"];

function NucleusSilhouetteArt({ language }: { language: Language }) {
  const dimension = language === "zh" ? "67P 总体包络" : "67P OVERALL ENVELOPE";
  const scale = language === "zh" ? "2 千米参考尺" : "2 KM REFERENCE SCALE";
  const irregular = language === "zh" ? "不规则 / 双叶形" : "IRREGULAR / BILOBED";
  return (
    <svg className={styles.plateArt} viewBox="0 0 1500 720" aria-hidden="true">
      <defs>
        <pattern id="ca-grid-1" width="60" height="60" patternUnits="userSpaceOnUse">
          <path d="M60 0H0V60" className={styles.gridLine} />
        </pattern>
        <pattern id="ca-hatch-1" width="18" height="18" patternUnits="userSpaceOnUse" patternTransform="rotate(18)">
          <path d="M0 0V18" className={styles.hatchLine} />
        </pattern>
      </defs>
      <rect width="1500" height="720" fill="url(#ca-grid-1)" />
      <path className={styles.constructionLine} d="M236 110H1264M236 590H1264M326 72V636M1174 72V636" />
      <path
        className={styles.nucleusFill}
        d="M476 394 C430 328 455 244 536 211 C594 187 633 204 684 187 C739 168 799 194 823 242 C842 280 829 311 859 335 C895 364 968 355 1012 393 C1060 435 1040 499 986 528 C936 555 875 529 832 542 C774 560 706 565 650 536 C603 511 579 476 532 461 C493 448 485 421 476 394Z"
      />
      <path
        className={styles.nucleusHatch}
        d="M476 394 C430 328 455 244 536 211 C594 187 633 204 684 187 C739 168 799 194 823 242 C842 280 829 311 859 335 C895 364 968 355 1012 393 C1060 435 1040 499 986 528 C936 555 875 529 832 542 C774 560 706 565 650 536 C603 511 579 476 532 461 C493 448 485 421 476 394Z"
        fill="url(#ca-hatch-1)"
      />
      <path className={styles.primaryLine} d="M476 394 C430 328 455 244 536 211 C594 187 633 204 684 187 C739 168 799 194 823 242 C842 280 829 311 859 335 C895 364 968 355 1012 393 C1060 435 1040 499 986 528 C936 555 875 529 832 542 C774 560 706 565 650 536 C603 511 579 476 532 461 C493 448 485 421 476 394Z" />
      <path className={styles.dimensionLine} d="M438 150H1050M438 136V166M1050 136V166" />
      <text className={styles.svgLabel} x="744" y="132" textAnchor="middle">{dimension} · 4.34 KM</text>
      <path className={styles.dimensionLine} d="M1095 194V548M1081 194H1110M1081 548H1110" />
      <text className={styles.svgLabel} x="1130" y="371" transform="rotate(90 1130 371)" textAnchor="middle">2.60 KM</text>
      <path className={styles.primaryLine} d="M330 626H630M330 612V640M630 612V640M480 618V636" />
      <text className={styles.svgLabel} x="480" y="676" textAnchor="middle">{scale}</text>
      <path className={styles.annotationLine} d="M918 245L1050 188L1188 188" />
      <text className={styles.svgWarmLabel} x="1195" y="193">{irregular}</text>
    </svg>
  );
}

function NucleusCutawayArt({ beat, language }: { beat: number; language: Language }) {
  const labels =
    language === "zh"
      ? ["含尘表层", "多孔基质", "水冰 / 其他挥发物", "尘粒", "孔隙", "A–A 剖面"]
      : ["DUST-RICH SURFACE", "POROUS MATRIX", "WATER ICE / OTHER VOLATILES", "DUST GRAINS", "VOIDS", "SECTION A–A"];
  return (
    <svg className={styles.plateArt} viewBox="0 0 1500 720" aria-hidden="true">
      <defs>
        <pattern id="ca-grid-2" width="50" height="50" patternUnits="userSpaceOnUse">
          <path d="M50 0H0V50" className={styles.gridLine} />
        </pattern>
        <clipPath id="ca-nucleus-clip">
          <path d="M322 420 C289 309 353 196 474 174 C560 158 630 193 702 181 C792 166 884 197 914 269 C932 313 918 352 955 379 C1004 416 1080 414 1116 470 C1153 528 1093 584 1012 585 H479 C397 580 342 520 322 420Z" />
        </clipPath>
        <pattern id="ca-hatch-2" width="22" height="22" patternUnits="userSpaceOnUse" patternTransform="rotate(28)">
          <path d="M0 0V22" className={styles.hatchLine} />
        </pattern>
      </defs>
      <rect width="1500" height="720" fill="url(#ca-grid-2)" />
      <path className={styles.constructionLine} d="M206 112H1265M206 618H1265M270 82V648M1200 82V648" />
      <g clipPath="url(#ca-nucleus-clip)">
        <rect x="270" y="140" width="900" height="480" className={styles.sectionBase} />
        <path className={styles.surfaceMantle} d="M242 208 C472 128 782 145 1128 256 L1102 324 C791 218 492 204 280 276Z" />
        <path d="M270 140H1170V620H270Z" fill="url(#ca-hatch-2)" opacity="0.36" />
        <g className={styles.cutawayIngredients} data-visible={revealAt(beat, 1)}>
          {[{ x: 460, y: 334, r: 42 }, { x: 610, y: 466, r: 64 }, { x: 746, y: 300, r: 52 }, { x: 875, y: 448, r: 45 }, { x: 998, y: 346, r: 38 }].map((item, index) => (
            <circle key={`ice-${item.x}`} cx={item.x} cy={item.y} r={item.r} className={index % 2 ? styles.icePocket : styles.volatilePocket} />
          ))}
          {[{ x: 406, y: 492 }, { x: 550, y: 284 }, { x: 700, y: 390 }, { x: 824, y: 530 }, { x: 945, y: 270 }, { x: 1052, y: 505 }].map((item) => (
            <path key={`dust-${item.x}`} className={styles.dustGrain} d={`M${item.x - 20} ${item.y + 4}L${item.x - 5} ${item.y - 18}L${item.x + 22} ${item.y - 8}L${item.x + 18} ${item.y + 20}L${item.x - 12} ${item.y + 22}Z`} />
          ))}
          {[{ x: 500, y: 410, r: 16 }, { x: 677, y: 246, r: 12 }, { x: 780, y: 478, r: 18 }, { x: 925, y: 392, r: 14 }].map((item) => (
            <circle key={`void-${item.x}`} cx={item.x} cy={item.y} r={item.r} className={styles.voidMark} />
          ))}
        </g>
      </g>
      <path className={styles.primaryLine} d="M322 420 C289 309 353 196 474 174 C560 158 630 193 702 181 C792 166 884 197 914 269 C932 313 918 352 955 379 C1004 416 1080 414 1116 470 C1153 528 1093 584 1012 585 H479 C397 580 342 520 322 420Z" />
      <path className={styles.annotationLine} d="M398 226L244 142H116" />
      <text className={styles.svgWarmLabel} x="110" y="130">{labels[0]}</text>
      <g data-visible={revealAt(beat, 1)}>
        <path className={styles.dimensionLine} d="M686 370L676 640H492" />
        <text className={styles.svgLabel} x="484" y="668">{labels[1]}</text>
        <path className={styles.dimensionLine} d="M850 300L1100 144H1334" />
        <text className={styles.svgLabel} x="1336" y="134" textAnchor="end">{labels[2]}</text>
        <path className={styles.dimensionLine} d="M976 486L1184 576H1360" />
        <text className={styles.svgLabel} x="1360" y="608" textAnchor="end">{labels[3]} · {labels[4]}</text>
      </g>
      <path className={styles.cutLine} d="M718 116V642" />
      <text className={styles.svgLabel} x="736" y="112">{labels[5]}</text>
    </svg>
  );
}

function JetFieldArt({ beat, language }: { beat: number; language: Language }) {
  const labels =
    language === "zh"
      ? ["太阳", "局部受光", "气体喷流", "夹带尘埃", "彗发", "不按彗核比例"]
      : ["SUN", "LOCAL INSOLATION", "GAS JETS", "ENTRAINED DUST", "COMA", "NOT TO NUCLEUS SCALE"];
  return (
    <svg className={styles.plateArt} viewBox="0 0 1500 720" aria-hidden="true">
      <defs>
        <radialGradient id="ca-coma-3" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#eaf9f3" stopOpacity="0.18" />
          <stop offset="0.55" stopColor="#a8d9e0" stopOpacity="0.09" />
          <stop offset="1" stopColor="#79b8d2" stopOpacity="0" />
        </radialGradient>
      </defs>
      <path className={styles.constructionLine} d="M180 106H1320M180 612H1320M244 74V650M1256 74V650" />
      <circle className={styles.sunDisc} cx="1328" cy="118" r="58" />
      {[0, 45, 90, 135].map((angle) => (
        <path key={angle} className={styles.sunRay} d="M1328 34V4" transform={`rotate(${angle} 1328 118)`} />
      ))}
      <text className={styles.svgWarmLabel} x="1328" y="203" textAnchor="middle">{labels[0]}</text>
      <path className={styles.illuminationArrow} d="M1244 158L735 350" />
      <path className={styles.arrowHead} d="M735 350L770 314L779 360Z" />
      <text className={styles.svgWarmLabel} x="1024" y="228" transform="rotate(-20 1024 228)">{labels[1]}</text>
      <g className={styles.comaField} data-visible={revealAt(beat, 3)}>
        <ellipse cx="554" cy="430" rx="440" ry="260" fill="url(#ca-coma-3)" />
        <ellipse className={styles.comaRing} cx="554" cy="430" rx="330" ry="190" />
        <ellipse className={styles.comaRing} cx="554" cy="430" rx="405" ry="236" />
      </g>
      <path className={styles.nucleusFill} d="M378 458 C346 405 375 336 431 310 C482 287 520 310 563 294 C617 273 681 300 696 353 C708 393 687 421 713 452 C739 483 708 538 655 553 C607 568 566 544 526 555 C468 570 406 528 378 458Z" />
      <path className={styles.primaryLine} d="M378 458 C346 405 375 336 431 310 C482 287 520 310 563 294 C617 273 681 300 696 353 C708 393 687 421 713 452 C739 483 708 538 655 553 C607 568 566 544 526 555 C468 570 406 528 378 458Z" />
      <path className={styles.activePatch} data-visible={revealAt(beat, 0)} d="M642 326C671 339 689 362 693 390" />
      <g className={styles.jetGroup} data-visible={revealAt(beat, 1)}>
        <path className={styles.jetLine} pathLength={1} d="M676 351C790 245 894 200 1038 178" />
        <path className={styles.jetLine} pathLength={1} d="M690 392C830 335 930 334 1080 372" />
        <path className={styles.jetLine} pathLength={1} d="M678 433C812 451 916 514 1010 608" />
        <text className={styles.svgLabel} x="1054" y="164">{labels[2]}</text>
      </g>
      <g className={styles.dustField} data-visible={revealAt(beat, 2)}>
        {[{ x: 754, y: 310 }, { x: 812, y: 270 }, { x: 872, y: 236 }, { x: 922, y: 218 }, { x: 778, y: 402 }, { x: 846, y: 394 }, { x: 918, y: 402 }, { x: 978, y: 424 }, { x: 766, y: 472 }, { x: 826, y: 510 }, { x: 888, y: 548 }, { x: 944, y: 580 }].map((point, index) => (
          <circle key={`${point.x}-${point.y}`} cx={point.x} cy={point.y} r={index % 3 === 0 ? 7 : 4} className={styles.dustDot} />
        ))}
        <text className={styles.svgLabel} x="1098" y="456">{labels[3]}</text>
      </g>
      <g data-visible={revealAt(beat, 3)}>
        <path className={styles.dimensionLine} d="M210 626H885" />
        <text className={styles.svgLabel} x="548" y="662" textAnchor="middle">{labels[4]} · {labels[5]}</text>
      </g>
    </svg>
  );
}

function TwinTailArt({ beat, language }: { beat: number; language: Language }) {
  const labels =
    language === "zh"
      ? ["太阳", "太阳光 / 太阳风", "尘尾", "离子尾", "背向太阳", "弯曲 / 宽阔", "更直 / 更窄"]
      : ["SUN", "SUNLIGHT / SOLAR WIND", "DUST TAIL", "ION TAIL", "ANTI-SOLAR", "CURVED / BROAD", "STRAIGHTER / NARROW"];
  return (
    <svg className={styles.plateArt} viewBox="0 0 1500 720" aria-hidden="true">
      <path className={styles.constructionLine} d="M170 108H1330M170 612H1330M232 76V648M1268 76V648" />
      <circle className={styles.sunDisc} cx="188" cy="358" r="74" />
      {[0, 45, 90, 135].map((angle) => (
        <path key={angle} className={styles.sunRay} d="M188 250V210" transform={`rotate(${angle} 188 358)`} />
      ))}
      <text className={styles.svgWarmLabel} x="188" y="470" textAnchor="middle">{labels[0]}</text>
      <path className={styles.solarWindArrow} d="M300 300H666" />
      <path className={styles.arrowHead} d="M666 300L626 278V322Z" />
      <text className={styles.svgWarmLabel} x="478" y="276" textAnchor="middle">{labels[1]}</text>
      <g data-visible={revealAt(beat, 0)}>
        <path className={styles.dustTailFill} d="M692 360C870 350 1012 380 1252 542C1080 458 898 438 690 408Z" />
        <path className={styles.dustTailLine} pathLength={1} d="M698 373C881 365 1042 414 1280 566" />
        <path className={styles.dustTailLineSecondary} pathLength={1} d="M700 392C880 401 1034 448 1200 532" />
        <path className={styles.dimensionLine} d="M1018 472L1138 626H1322" />
        <text className={styles.svgLabel} x="1324" y="656" textAnchor="end">{labels[2]} · {labels[5]}</text>
      </g>
      <g data-visible={revealAt(beat, 1)}>
        <path className={styles.ionTailFill} d="M696 347L1354 255L1378 292L704 382Z" />
        <path className={styles.ionTailLine} pathLength={1} d="M698 364L1370 272" />
        <path className={styles.dimensionLine} d="M1102 306L1188 162H1366" />
        <text className={styles.svgLabel} x="1368" y="150" textAnchor="end">{labels[3]} · {labels[6]}</text>
      </g>
      <path className={styles.nucleusFill} d="M615 382C598 344 628 305 674 302C706 300 732 312 756 334C780 357 772 394 741 411C710 427 670 427 642 410C628 401 620 392 615 382Z" />
      <path className={styles.primaryLine} d="M615 382C598 344 628 305 674 302C706 300 732 312 756 334C780 357 772 394 741 411C710 427 670 427 642 410C628 401 620 392 615 382Z" />
      <ellipse className={styles.comaOutline} cx="692" cy="365" rx="100" ry="82" />
      <path className={styles.antiSolarAxis} d="M692 365H1392" />
      <text className={styles.svgLabel} x="1388" y="350" textAnchor="end">{labels[4]} →</text>
    </svg>
  );
}

function OrbitalPlateArt({ language }: { language: Language }) {
  const labels =
    language === "zh"
      ? ["远日点 · 活动较弱", "近日点 · 活动增强", "太阳", "轨道运动", "彗尾始终主要背向太阳"]
      : ["APHELION · LOWER ACTIVITY", "PERIHELION · STRONGER ACTIVITY", "SUN", "ORBITAL MOTION", "TAILS POINT MAINLY AWAY FROM THE SUN"];
  return (
    <svg className={styles.plateArt} viewBox="0 0 1500 720" aria-hidden="true">
      <defs>
        <radialGradient id="ca-orbit-sun" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#dcaa65" stopOpacity="0.72" />
          <stop offset="1" stopColor="#dcaa65" stopOpacity="0" />
        </radialGradient>
      </defs>
      <path className={styles.constructionLine} d="M160 100H1340M160 620H1340M220 68V652M1280 68V652" />
      <ellipse className={styles.orbitLine} cx="760" cy="360" rx="560" ry="250" transform="rotate(-8 760 360)" />
      <ellipse cx="475" cy="402" rx="108" ry="108" fill="url(#ca-orbit-sun)" />
      <circle className={styles.sunDisc} cx="475" cy="402" r="46" />
      <text className={styles.svgWarmLabel} x="475" y="480" textAnchor="middle">{labels[2]}</text>
      <g className={styles.aphelionSpecimen}>
        <path className={styles.nucleusFill} d="M1190 208C1172 179 1194 150 1224 149C1245 148 1262 157 1276 172C1293 188 1285 214 1264 226C1239 240 1205 232 1190 208Z" />
        <path className={styles.primaryLine} d="M1190 208C1172 179 1194 150 1224 149C1245 148 1262 157 1276 172C1293 188 1285 214 1264 226C1239 240 1205 232 1190 208Z" />
        <path className={styles.dimensionLine} d="M1236 244V298H1328" />
        <text className={styles.svgLabel} x="1332" y="304" textAnchor="end">{labels[0]}</text>
      </g>
      <g className={styles.perihelionSpecimen}>
        <ellipse className={styles.comaOutline} cx="282" cy="468" rx="82" ry="64" />
        <path className={styles.nucleusFill} d="M250 474C237 450 253 428 278 427C300 426 318 444 317 463C316 487 292 501 269 495C260 492 254 484 250 474Z" />
        <path className={styles.primaryLine} d="M250 474C237 450 253 428 278 427C300 426 318 444 317 463C316 487 292 501 269 495C260 492 254 484 250 474Z" />
        <path className={styles.dustTailLine} d="M240 476C176 500 118 544 78 606" />
        <path className={styles.ionTailLine} d="M246 458L72 420" />
        <path className={styles.dimensionLine} d="M280 532V592H448" />
        <text className={styles.svgLabel} x="454" y="598">{labels[1]}</text>
      </g>
      <path className={styles.orbitArrow} d="M842 109C996 115 1115 166 1194 244" />
      <path className={styles.arrowHead} d="M1194 244L1152 226L1174 270Z" />
      <text className={styles.svgLabel} x="1000" y="106" textAnchor="middle">{labels[3]}</text>
      <path className={styles.annotationLine} d="M238 394L126 330H70" />
      <text className={styles.svgWarmLabel} x="66" y="318">{labels[4]}</text>
    </svg>
  );
}

function SceneArt({ sceneId, beat, language }: { sceneId: SceneId; beat: number; language: Language }) {
  if (sceneId === 1) return <NucleusSilhouetteArt language={language} />;
  if (sceneId === 2) return <NucleusCutawayArt beat={beat} language={language} />;
  if (sceneId === 3) return <JetFieldArt beat={beat} language={language} />;
  if (sceneId === 4) return <TwinTailArt beat={beat} language={language} />;
  return <OrbitalPlateArt language={language} />;
}

function ScenePanel({
  sceneId,
  beat,
  language,
  isActive,
}: {
  sceneId: SceneId;
  beat: number;
  language: Language;
  isActive: boolean;
}) {
  const content = COPY[sceneId][language];
  const activeBeat = clampBeat(sceneId, beat, false);
  const currentBeat = content.beats[activeBeat];
  const multiBeat = content.beats.length > 1;
  const chrome =
    language === "zh"
      ? {
          original: "原创科学图版",
          revision: "修订 · A",
          drawing: "图号",
          evidence: "证据边界",
          sources: "来源",
        }
      : {
          original: "ORIGINAL SCIENTIFIC PLATE",
          revision: "REV · A",
          drawing: "DRAWING",
          evidence: "EVIDENCE BOUNDARY",
          sources: "SOURCES",
        };
  return (
    <section
      className={[styles.scene, styles[`scene${sceneId}`], isActive ? styles.activeScene : ""]
        .filter(Boolean)
        .join(" ")}
      data-scene={sceneId}
      data-composition={COMPOSITIONS[sceneId - 1]}
      data-final-state={sceneId === 5 ? "settled" : undefined}
      data-beat-layout-container={multiBeat ? "true" : undefined}
      data-beat-layout-mode={multiBeat ? "reserved" : undefined}
      aria-label={content.sceneTitle}
    >
      <div className={styles.paperTexture} aria-hidden="true" />
      <header className={styles.sheetHeader} data-beat-layout-item="true">
        <span>{content.code}</span>
        <span>{chrome.original}</span>
        <span>{chrome.revision}</span>
      </header>
      <div className={styles.copyBlock} data-beat-layout-item="true">
        <p className={styles.eyebrow}>{currentBeat.marker}</p>
        <h1>{content.title}</h1>
        <p className={styles.subtitle}>{content.subtitle}</p>
      </div>
      <div className={styles.artFrame} data-beat-layout-item="true">
        <SceneArt sceneId={sceneId} beat={activeBeat} language={language} />
      </div>
      <aside className={styles.beatLedger} data-beat-layout-item="true">
        <span>{String(activeBeat + 1).padStart(2, "0")}/{String(content.beats.length).padStart(2, "0")}</span>
        <strong>{currentBeat.title}</strong>
        <p>{currentBeat.body}</p>
      </aside>
      <footer className={styles.titleBlock} data-beat-layout-item="true">
        <div>
          <span>{chrome.drawing}</span>
          <strong>{content.code}</strong>
        </div>
        <div>
          <span>{chrome.evidence}</span>
          <strong>{content.evidence}</strong>
        </div>
        <div>
          <span>{chrome.sources}</span>
          <strong>[S1–S5]</strong>
        </div>
      </footer>
    </section>
  );
}

function ScalePreview({ sceneId }: { sceneId: SceneId }) {
  return (
    <span className={[styles.scalePreview, styles[`scalePreview${sceneId}`]].join(" ")} aria-hidden="true">
      <span className={styles.previewNucleus} />
      <span className={styles.previewCut} />
      <span className={styles.previewJet} />
      <span className={styles.previewOrbit} />
    </span>
  );
}

function SectionalScaleNavigation({
  activeScene,
  language,
  onNavigate,
}: {
  activeScene: SceneId;
  language: Language;
  onNavigate?: (scene: number, beat: number) => void;
}) {
  const navigate = (target: number) => {
    onNavigate?.(Math.max(1, Math.min(5, target)), 0);
  };
  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLButtonElement>,
    sceneId: SceneId,
  ) => {
    event.stopPropagation();
    if (event.repeat) return;
    const targetByKey: Partial<Record<string, number>> = {
      ArrowRight: sceneId + 1,
      ArrowDown: sceneId + 1,
      ArrowLeft: sceneId - 1,
      ArrowUp: sceneId - 1,
      Home: 1,
      End: 5,
    };
    const target = targetByKey[event.key];
    if (target === undefined) return;
    event.preventDefault();
    navigate(target);
  };

  return (
    <nav
      className={styles.sectionalScale}
      aria-label={language === "zh" ? "彗星剖面比例尺导航" : "Comet sectional scale navigation"}
      data-topic-navigation="true"
      data-navigation-geometry="edge-scale"
      data-navigation-carrier="comet-sectional-scale"
      data-navigation-invocation="auto-hide"
      data-navigation-feedback="next-state-preview"
      data-auto-hide="true"
      onPointerDown={(event) => event.stopPropagation()}
      onTouchStart={(event) => event.stopPropagation()}
      onClick={(event) => event.stopPropagation()}
    >
      <span className={styles.scaleSpine} aria-hidden="true" />
      {SCENE_IDS.map((sceneId) => {
        const active = sceneId === activeScene;
        const next = sceneId === activeScene + 1;
        const label = NAV_LABELS[language][sceneId - 1];
        return (
          <button
            key={sceneId}
            type="button"
            className={styles.scaleButton}
            aria-label={
              language === "zh"
                ? `剖面 ${sceneId}：${label}`
                : `Section ${sceneId}: ${label}`
            }
            aria-current={active ? "step" : undefined}
            data-active={active ? "true" : "false"}
            data-next-preview={next ? "true" : "false"}
            onClick={(event) => {
              event.stopPropagation();
              navigate(sceneId);
            }}
            onKeyDown={(event) => handleKeyDown(event, sceneId)}
          >
            <span className={styles.scaleTick} aria-hidden="true" />
            <span className={styles.scaleNumber}>{String(sceneId).padStart(2, "0")}</span>
            <ScalePreview sceneId={sceneId} />
            <span className={styles.scaleLabel}>{label}</span>
          </button>
        );
      })}
    </nav>
  );
}

function TopicStage({
  scene,
  beat,
  language,
  isThumbnail,
  reducedMotion,
  onNavigate,
}: TopicStageProps) {
  useFonts();
  const activeScene = clampScene(scene);
  const motionOff = reducedMotion || isThumbnail;
  const activeBeat = clampBeat(activeScene, beat, isThumbnail);

  return (
    <main
      className={[
        styles.root,
        motionOff ? styles.motionOff : "",
        isThumbnail ? styles.thumbnail : "",
      ]
        .filter(Boolean)
        .join(" ")}
      data-style-id="cyanotype-drafting-table"
      data-topic-id="comet-anatomy"
      data-current-scene={activeScene}
      data-motion-state={motionOff ? "settled" : "measured"}
    >
      <SpatialSceneTrack
        scene={activeScene}
        beat={activeBeat}
        transitionKind="linear-wipe"
        transitionMap={TRANSITION_MAP}
        transitionDurationMs={820}
        reducedMotion={motionOff}
        beatLayoutModes={BEAT_LAYOUT_MODES}
        className={styles.track}
        renderScene={(trackScene, trackBeat, isActive) => (
          <ScenePanel
            sceneId={clampScene(trackScene)}
            beat={clampBeat(clampScene(trackScene), trackBeat, isThumbnail && isActive)}
            language={language}
            isActive={isActive}
          />
        )}
      />
      {!isThumbnail && (
        <SectionalScaleNavigation
          activeScene={activeScene}
          language={language}
          onNavigate={onNavigate}
        />
      )}
    </main>
  );
}

export default defineTopic({
  id: "comet-anatomy",
  styleId: "cyanotype-drafting-table",
  title: {
    en: "Comet Anatomy",
    zh: "彗星解剖",
  },
  modelId: "GPT 5.6 Sol",
  Stage: TopicStage,
  metadata,
  navigation: {
    geometry: "edge-scale",
    carrier: "comet-sectional-scale",
    invocation: "auto-hide",
    feedback: "next-state-preview",
  },
  transitionScore: COMET_ANATOMY_TRANSITION_SCORE,
  evidence: {
    kind: "mixed",
    sources: COMET_ANATOMY_SOURCES,
    boundary: {
      en: "Educational schematic: the drawings synthesize broad comet physics with 67P-specific reference measurements; individual nuclei, activity patterns, tails, and orbit displays vary by comet and observation time.",
      zh: "教学示意图：图中综合了通用彗星物理与 67P 的参考测量；不同彗星及不同观测时段的彗核、活动模式、彗尾和轨道显示都会不同。",
    },
    display: "stage",
  },
});

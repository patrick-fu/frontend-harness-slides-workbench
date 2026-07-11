import { useCallback, useEffect, useState } from "react";
import type { CSSProperties, KeyboardEvent, MouseEvent, PointerEvent } from "react";
import type {
  TopicMetadata,
  TopicStageProps,
  TopicTransitionScore,
} from "../domain/topic";
import { defineTopic } from "../domain/topic";
import type { Source } from "../domain/evidence";
import SpatialSceneTrack from "../components/stage/SpatialSceneTrack";
import type {
  BeatLayoutMode,
  SceneTransitionMap,
} from "../components/stage/SpatialSceneTrack";
import styles from "./iron-from-stars.module.css";

type Language = "en" | "zh";
type SceneId = 1 | 2 | 3 | 4 | 5;
type CustomStyle = CSSProperties & Record<`--${string}`, string>;

interface BeatCopy {
  id: number;
  action: string;
  title: string;
  body: string;
}

interface SceneCopy {
  title: string;
  shortTitle: string;
  eyebrow: string;
  statement: string;
  detail: string;
  sourceLine: string;
  beats: BeatCopy[];
}

const SCENE_IDS: SceneId[] = [1, 2, 3, 4, 5];

export const IRON_FROM_STARS_TRANSITION_SCORE = {
  "1->2": "iris-open",
  "2->3": "zoom-through",
  "3->4": "dip-to-color",
  "4->5": "iris-open",
} as const satisfies TopicTransitionScore;

const TRANSITION_MAP: SceneTransitionMap = IRON_FROM_STARS_TRANSITION_SCORE;

const BEAT_LAYOUT_MODES = {
  1: "reserved",
  2: "reserved",
  3: "reserved",
  4: "reserved",
} satisfies Partial<Record<SceneId, BeatLayoutMode>>;

export const IRON_FROM_STARS_SOURCES = [
  {
    id: "nasa-massive-stars",
    authority: "NASA Science / Webb",
    title: "Massive Stars: Engines of Creation",
    citation: "NASA, ESA, and Leah Hustak (STScI), released 2019; updated 2025.",
    url: "https://science.nasa.gov/asset/webb/massive-stars-engines-of-creation-infographic/",
    supports:
      "Supports the massive-star sequence from hydrogen fusion through a multi-shell core, silicon burning, iron-group production, and core collapse.",
    boundary:
      "The infographic is a teaching synthesis: exact shell composition, duration, and reaction networks vary with stellar mass and model assumptions.",
  },
  {
    id: "doe-nucleosynthesis",
    authority: "U.S. Department of Energy, Office of Science",
    title: "DOE Explains…Nucleosynthesis",
    citation: "DOE Office of Science, Nuclear Physics overview of cosmic element formation.",
    url: "https://www.energy.gov/science/doe-explainsnucleosynthesis",
    supports:
      "Supports element production up to iron in massive stars and the role of core-collapse supernovae, white-dwarf events, and neutron-star mergers in cosmic enrichment.",
    boundary:
      "This overview names broad source classes; it does not assign a universal event-by-event abundance share to each heavy element.",
  },
  {
    id: "kajino-r-process",
    authority: "Progress in Particle and Nuclear Physics",
    title: "Current Status of r-Process Nucleosynthesis",
    citation:
      "Kajino et al., Progress in Particle and Nuclear Physics 107 (2019), 109–166, doi:10.1016/j.ppnp.2019.02.008.",
    url: "https://arxiv.org/abs/1906.05002",
    supports:
      "Reviews rapid neutron capture, evidence from neutron-star mergers, alternative candidate environments, and unresolved Galactic source contributions.",
    boundary:
      "The review explicitly keeps multiple r-process sites in play; the deck therefore avoids assigning all heavy nuclei to one event class.",
  },
  {
    id: "crawford-rare-isotopes",
    authority: "Annual Review of Nuclear and Particle Science",
    title: "A Vision for the Science of Rare Isotopes",
    citation:
      "Crawford, Fossez, König, and Spyrou, Annual Review of Nuclear and Particle Science 74 (2024), 141–172.",
    url: "https://doi.org/10.1146/annurev-nucl-121423-091501",
    supports:
      "Distinguishes stellar fusion through the iron region from s-, r-, p-, and additional capture or explosive processes used to explain heavier nuclei.",
    boundary:
      "The review emphasizes remaining nuclear-input and astrophysical-site uncertainties, so the final scene labels channels rather than fixed percentages.",
  },
] as const satisfies readonly (Source & {
  id: string;
  boundary: string;
})[];

const SCENES: Record<SceneId, Record<Language, SceneCopy>> = {
  1: {
    en: {
      title: "The first fuel is hydrogen",
      shortTitle: "first fuel",
      eyebrow: "STELLAR FURNACE / PLATE I",
      statement: "Gravity raises pressure and temperature; fusion joins light nuclei.",
      detail: "In massive stars, that sequence can continue far beyond helium.",
      sourceLine: "NASA / massive-star fusion sequence",
      beats: [
        {
          id: 0,
          action: "Solar disc and hydrogen symbol enter",
          title: "Hydrogen opens the sequence",
          body: "A massive star begins its long energy-producing life with hydrogen fusion.",
        },
        {
          id: 1,
          action: "Helium product enters the orbit",
          title: "Light nuclei become more tightly bound",
          body: "Hydrogen fusion makes helium and releases energy that helps support the star.",
        },
      ],
    },
    zh: {
      title: "第一种燃料是氢",
      shortTitle: "初始燃料",
      eyebrow: "恒星熔炉 / 图版 I",
      statement: "引力抬高压力与温度；聚变让轻原子核结合。",
      detail: "在大质量恒星里，这条序列可以越过氦继续推进。",
      sourceLine: "NASA / 大质量恒星聚变序列",
      beats: [
        {
          id: 0,
          action: "太阳圆盘与氢符号进入",
          title: "氢开启序列",
          body: "大质量恒星漫长的产能阶段从氢聚变开始。",
        },
        {
          id: 1,
          action: "氦产物进入轨道",
          title: "轻原子核变得结合更紧密",
          body: "氢聚变生成氦，并释放帮助恒星抵抗引力的能量。",
        },
      ],
    },
  },
  2: {
    en: {
      title: "Heat changes what can fuse",
      shortTitle: "element rings",
      eyebrow: "TEMPERATURE RINGS / PLATE II",
      statement: "Temperature rises inward. Each later stage buys less time.",
      detail: "The sequence is a nuclear reaction network, shown as a restrained geometric register.",
      sourceLine: "NASA / shell-burning stages; durations are schematic",
      beats: [
        {
          id: 0,
          action: "Hydrogen and helium rings register",
          title: "The long stages begin with light nuclei",
          body: "Hydrogen and helium burning occupy the broad outer register of the sequence.",
        },
        {
          id: 1,
          action: "Carbon and oxygen stages accumulate",
          title: "A hotter core opens later reactions",
          body: "Carbon, neon, and oxygen burning build an increasingly layered interior.",
        },
        {
          id: 2,
          action: "Silicon burning reaches the iron group",
          title: "The last energy-releasing stages are brief",
          body: "Silicon burning approaches iron-group nuclei as the available timescale contracts.",
        },
      ],
    },
    zh: {
      title: "温度改变可发生的聚变",
      shortTitle: "元素环",
      eyebrow: "温度环 / 图版 II",
      statement: "越向内温度越高；越靠后的阶段维持时间越短。",
      detail: "这是一张核反应网络，以克制的几何序列来表达。",
      sourceLine: "NASA / 壳层燃烧阶段；时长为示意",
      beats: [
        {
          id: 0,
          action: "氢与氦环定位",
          title: "漫长阶段从轻原子核开始",
          body: "氢燃烧与氦燃烧占据这条序列最宽阔的外圈。",
        },
        {
          id: 1,
          action: "碳与氧阶段累积",
          title: "更热的核心打开后续反应",
          body: "碳、氖与氧燃烧塑造出越来越分层的内部。",
        },
        {
          id: 2,
          action: "硅燃烧抵达铁族",
          title: "最后的释能阶段非常短暂",
          body: "硅燃烧逼近铁族原子核，同时可用时间尺度急剧收缩。",
        },
      ],
    },
  },
  3: {
    en: {
      title: "A star becomes an onion-shell furnace",
      shortTitle: "onion-shell",
      eyebrow: "CUTAWAY / PLATE III",
      statement: "Different shells can burn different fuels at the same late stage.",
      detail: "The diagram is structural: real boundaries mix, shift, and depend on stellar mass.",
      sourceLine: "NASA / multi-shell core model",
      beats: [
        {
          id: 0,
          action: "Outer hydrogen and helium shells appear",
          title: "The older fuels move outward",
          body: "Hydrogen and helium burning continue in broad shells around a contracting center.",
        },
        {
          id: 1,
          action: "Carbon and oxygen shells appear",
          title: "Later fuels occupy hotter inner shells",
          body: "Carbon, neon, and oxygen reactions gather closer to the center.",
        },
        {
          id: 2,
          action: "Silicon shell and iron core complete",
          title: "Iron-group ash gathers at the center",
          body: "A silicon-burning shell surrounds a compact iron-group core near the end state.",
        },
      ],
    },
    zh: {
      title: "恒星变成洋葱壳层熔炉",
      shortTitle: "洋葱壳层",
      eyebrow: "剖面 / 图版 III",
      statement: "在生命晚期，不同壳层可以同时燃烧不同燃料。",
      detail: "这是结构示意；真实边界会混合、移动，也随恒星质量而变。",
      sourceLine: "NASA / 多壳层核心模型",
      beats: [
        {
          id: 0,
          action: "外部氢壳与氦壳出现",
          title: "较早的燃料移向外层",
          body: "氢与氦燃烧继续发生在收缩中心之外的宽阔壳层。",
        },
        {
          id: 1,
          action: "碳壳与氧壳出现",
          title: "后续燃料占据更热的内层",
          body: "碳、氖与氧反应聚集到更靠近中心的位置。",
        },
        {
          id: 2,
          action: "硅壳与铁核完成",
          title: "铁族灰烬聚集于中心",
          body: "接近末期时，硅燃烧壳包围着紧凑的铁族核心。",
        },
      ],
    },
  },
  4: {
    en: {
      title: "At the iron peak, the bargain changes",
      shortTitle: "iron boundary",
      eyebrow: "BINDING-ENERGY LIMIT / PLATE IV",
      statement: "Near the iron peak, further fusion does not release net fusion energy.",
      detail: "The core cannot keep using the same fusion bargain to support the layered star.",
      sourceLine: "NASA + DOE / iron-group energy boundary",
      beats: [
        {
          id: 0,
          action: "Iron-group core condenses",
          title: "The center fills with tightly bound nuclei",
          body: "Iron-group ash accumulates while overlying shells continue to weigh inward.",
        },
        {
          id: 1,
          action: "Binding-energy crest resolves",
          title: "Fusion stops paying the same energy dividend",
          body: "Pushing fusion beyond the iron region requires energy instead of sustaining the star.",
        },
        {
          id: 2,
          action: "Solar movement falls quiet",
          title: "The iron core becomes a boundary, not a factory",
          body: "When support fails, core collapse begins; heavier nuclei need other pathways too.",
        },
      ],
    },
    zh: {
      title: "抵达铁峰，能量交易改变",
      shortTitle: "铁的边界",
      eyebrow: "结合能边界 / 图版 IV",
      statement: "接近铁峰后，继续聚变不再净释放聚变能。",
      detail: "核心无法继续用同一种聚变收益支撑层层叠压的恒星。",
      sourceLine: "NASA + DOE / 铁族能量边界",
      beats: [
        {
          id: 0,
          action: "铁族核心凝聚",
          title: "中心积累结合紧密的原子核",
          body: "铁族灰烬持续累积，上方壳层的重量仍向内压迫。",
        },
        {
          id: 1,
          action: "结合能峰值显现",
          title: "聚变不再支付同样的能量收益",
          body: "把聚变推进到铁区以外需要能量，而不是继续支撑恒星。",
        },
        {
          id: 2,
          action: "日光运动归于安静",
          title: "铁核成为边界，而非工厂",
          body: "当支撑失效，核心坍缩开始；更重的原子核还需要其他通道。",
        },
      ],
    },
  },
  5: {
    en: {
      title: "Beyond iron: more than one route",
      shortTitle: "many sites",
      eyebrow: "COSMIC SOURCES / PLATE V",
      statement: "No single event makes every heavy element.",
      detail: "Different capture and explosive processes contribute; relative contributions remain under study.",
      sourceLine: "DOE + Kajino et al. + Crawford et al. / bounded synthesis",
      beats: [
        {
          id: 0,
          action: "Multiple source sites settle into view",
          title: "Heavy nuclei have a plural history",
          body: "Stellar winds, supernovae, mergers, and other channels do different work across the abundance pattern.",
        },
      ],
    },
    zh: {
      title: "铁以外：不止一条路线",
      shortTitle: "多重来源",
      eyebrow: "宇宙来源 / 图版 V",
      statement: "没有一种事件制造所有重元素。",
      detail: "不同俘获与爆发过程共同贡献；各自相对份额仍在研究中。",
      sourceLine: "DOE + Kajino 等 + Crawford 等 / 有边界的综合",
      beats: [
        {
          id: 0,
          action: "多种来源静止并列",
          title: "重原子核拥有复数的历史",
          body: "恒星风、超新星、并合与其他通道在丰度图谱中承担不同工作。",
        },
      ],
    },
  },
};

const ELEMENT_STAGES = {
  en: [
    { symbol: "H", name: "hydrogen → helium", phase: "longest register" },
    { symbol: "He", name: "helium → carbon · oxygen", phase: "hotter" },
    { symbol: "C", name: "carbon → neon · magnesium", phase: "shorter" },
    { symbol: "O", name: "oxygen → silicon · sulfur", phase: "still hotter" },
    { symbol: "Si", name: "silicon → iron group", phase: "briefest" },
  ],
  zh: [
    { symbol: "H", name: "氢 → 氦", phase: "最长阶段" },
    { symbol: "He", name: "氦 → 碳 · 氧", phase: "温度更高" },
    { symbol: "C", name: "碳 → 氖 · 镁", phase: "时间更短" },
    { symbol: "O", name: "氧 → 硅 · 硫", phase: "继续升温" },
    { symbol: "Si", name: "硅 → 铁族", phase: "最短阶段" },
  ],
} satisfies Record<Language, Array<{ symbol: string; name: string; phase: string }>>;

const SHELLS = {
  en: [
    { symbol: "H", label: "hydrogen shell" },
    { symbol: "He", label: "helium shell" },
    { symbol: "C", label: "carbon · neon shell" },
    { symbol: "O", label: "oxygen · silicon shell" },
    { symbol: "Fe", label: "iron-group core" },
  ],
  zh: [
    { symbol: "H", label: "氢壳层" },
    { symbol: "He", label: "氦壳层" },
    { symbol: "C", label: "碳 · 氖壳层" },
    { symbol: "O", label: "氧 · 硅壳层" },
    { symbol: "Fe", label: "铁族核心" },
  ],
} satisfies Record<Language, Array<{ symbol: string; label: string }>>;

const ORIGIN_SITES = {
  en: [
    {
      code: "s",
      title: "Evolved stars + stellar winds",
      body: "Slow neutron capture builds some nuclei; winds return enriched material.",
    },
    {
      code: "SN",
      title: "Core-collapse supernovae",
      body: "Explosive burning and ejection reshape and disperse several element groups.",
    },
    {
      code: "r",
      title: "Neutron-star mergers",
      body: "Neutron-rich ejecta provide strong evidence for rapid-capture production.",
    },
    {
      code: "?",
      title: "Other channels under study",
      body: "Additional capture and explosive sites remain necessary in current models.",
    },
  ],
  zh: [
    {
      code: "s",
      title: "演化恒星 + 恒星风",
      body: "慢中子俘获生成一部分原子核；恒星风把富集物质送回星际空间。",
    },
    {
      code: "SN",
      title: "核心坍缩超新星",
      body: "爆发性燃烧与物质抛射重塑并散播多组元素。",
    },
    {
      code: "r",
      title: "中子星并合",
      body: "富中子抛射物为快中子俘获提供强有力证据。",
    },
    {
      code: "?",
      title: "仍在研究的其他通道",
      body: "当前模型仍需要其他俘获过程与爆发来源。",
    },
  ],
} satisfies Record<Language, Array<{ code: string; title: string; body: string }>>;

const NAV_LABELS = {
  en: ["first fuel", "element rings", "onion-shell", "iron boundary", "many sites"],
  zh: ["初始燃料", "元素环", "洋葱壳层", "铁的边界", "多重来源"],
} satisfies Record<Language, string[]>;

function useFonts() {
  useEffect(() => {
    const id = "solar-biennale-iron-from-stars-fonts";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500&family=IBM+Plex+Mono:wght@400;500&family=Manrope:wght@500;600;700&family=Noto+Sans+SC:wght@500;600;700&family=Noto+Serif+SC:wght@500;600&display=swap";
    document.head.appendChild(link);
  }, []);
}

function isSceneId(scene: number): scene is SceneId {
  return SCENE_IDS.includes(scene as SceneId);
}

function getVisibleBeat(sceneId: SceneId, beat: number, isThumbnail: boolean) {
  const lastBeat = SCENES[sceneId].en.beats.length - 1;
  if (isThumbnail) return lastBeat;
  return Math.min(Math.max(beat, 0), lastBeat);
}

function buildMetadata(language: Language): TopicMetadata {
  return {
    theme: language === "zh" ? "恒星炼铁" : "Iron from Stars",
    densityLabel: language === "zh" ? "舞台冲击" : "Stage impact",
    heroScene: 3,
    colors: {
      bg: "#f3dfac",
      ink: "#182044",
      panel: "#e4b83f",
    },
    typography: {
      header: "Cormorant Garamond 600",
      body: "Manrope 500",
    },
    tags: [
      "solar",
      "biennale",
      "cosmic-geometric",
      "nucleosynthesis",
      "stage-impact",
      "poster",
      "slow-motion",
    ],
    fonts: [
      "Cormorant Garamond",
      "Manrope",
      "IBM Plex Mono",
      "cjk:Noto Serif SC",
      "cjk:Noto Sans SC",
    ],
    scenes: SCENE_IDS.map((sceneId) => {
      const scene = SCENES[sceneId][language];
      return {
        id: sceneId,
        title: scene.shortTitle,
        beats: scene.beats.map((beat) => ({ ...beat })),
      };
    }),
  };
}

function SourceLine({ copy }: { copy: SceneCopy }) {
  return (
    <p className={styles.sourceLine} data-source-ref="true">
      {copy.sourceLine}
    </p>
  );
}

function PosterHeader({ copy }: { copy: SceneCopy }) {
  return (
    <header className={styles.posterHeader} data-beat-layout-item="true">
      <p className={styles.eyebrow}>{copy.eyebrow}</p>
      <span className={styles.headerRule} aria-hidden="true" />
    </header>
  );
}

function SceneOne({ copy, beat }: { copy: SceneCopy; beat: number }) {
  return (
    <>
      <PosterHeader copy={copy} />
      <div className={styles.solarDisc} data-beat-layout-item="true" aria-hidden="true">
        <span className={styles.discOrbit} />
        <span className={styles.hydrogenSymbol}>H</span>
        <span className={styles.atomicNumber}>1</span>
        <span className={styles.heliumProduct} data-visible={beat >= 1 ? "true" : "false"}>
          He
        </span>
      </div>
      <main className={styles.heroCopy} data-beat-layout-item="true">
        <h1 className={styles.heroTitle}>{copy.title}</h1>
        <p className={styles.statement}>{copy.statement}</p>
        <p className={styles.detail} data-visible={beat >= 1 ? "true" : "false"}>
          {copy.detail}
        </p>
      </main>
      <aside className={styles.reactionMark} data-beat-layout-item="true">
        <span>H</span>
        <span className={styles.reactionArrow}>→</span>
        <span data-visible={beat >= 1 ? "true" : "false"}>He + energy</span>
      </aside>
      <SourceLine copy={copy} />
    </>
  );
}

function SceneTwo({ copy, beat, language }: { copy: SceneCopy; beat: number; language: Language }) {
  const visibleCount = beat === 0 ? 2 : beat === 1 ? 4 : 5;
  return (
    <>
      <PosterHeader copy={copy} />
      <main className={styles.ringCopy} data-beat-layout-item="true">
        <h1 className={styles.sectionTitle}>{copy.title}</h1>
        <p className={styles.statement}>{copy.statement}</p>
        <p className={styles.detail}>{copy.detail}</p>
      </main>
      <div className={styles.elementOrbit} data-beat-layout-item="true">
        <div className={styles.orbitSun} aria-hidden="true" />
        {ELEMENT_STAGES[language].map((stage, index) => (
          <article
            key={stage.symbol}
            className={styles.elementStage}
            data-element-ring="true"
            data-visible={index < visibleCount ? "true" : "false"}
            data-current={index === visibleCount - 1 ? "true" : "false"}
            style={{
              "--ring-index": String(index),
              "--stage-angle": `${-118 + index * 55}deg`,
            } as CustomStyle}
          >
            <strong>{stage.symbol}</strong>
            <span>{stage.name}</span>
            <small>{stage.phase}</small>
          </article>
        ))}
      </div>
      <SourceLine copy={copy} />
    </>
  );
}

function SceneThree({ copy, beat, language }: { copy: SceneCopy; beat: number; language: Language }) {
  const visibleCount = beat === 0 ? 2 : beat === 1 ? 4 : 5;
  return (
    <>
      <PosterHeader copy={copy} />
      <main className={styles.shellCopy} data-beat-layout-item="true">
        <h1 className={styles.sectionTitle}>{copy.title}</h1>
        <p className={styles.statement}>{copy.statement}</p>
        <p className={styles.detail}>{copy.detail}</p>
      </main>
      <div
        className={styles.shellCutaway}
        data-beat-layout-item="true"
        role="img"
        aria-label={language === "zh" ? "大质量恒星洋葱壳层剖面" : "Massive-star onion-shell cutaway"}
      >
        {SHELLS[language].map((shell, index) => (
          <div
            key={shell.symbol}
            className={styles.stellarShell}
            data-stellar-shell="true"
            data-visible={index < visibleCount ? "true" : "false"}
            data-current={index === visibleCount - 1 ? "true" : "false"}
            style={{ "--shell-index": String(index) } as CustomStyle}
          >
            <span className={styles.shellSymbol}>{shell.symbol}</span>
            <span className={styles.shellLabel}>{shell.label}</span>
          </div>
        ))}
        <span className={styles.cutawayAxis} aria-hidden="true" />
      </div>
      <div className={styles.shellLegend} data-beat-layout-item="true">
        {SHELLS[language].map((shell, index) => (
          <span key={shell.symbol} data-visible={index < visibleCount ? "true" : "false"}>
            {shell.symbol} / {shell.label}
          </span>
        ))}
      </div>
      <SourceLine copy={copy} />
    </>
  );
}

function SceneFour({ copy, beat, language }: { copy: SceneCopy; beat: number; language: Language }) {
  return (
    <>
      <PosterHeader copy={copy} />
      <main className={styles.boundaryCopy} data-beat-layout-item="true">
        <p className={styles.boundaryIndex}>26 / Fe</p>
        <h1 className={styles.sectionTitle}>{copy.title}</h1>
        <p className={styles.statement}>{copy.statement}</p>
        <p className={styles.detail} data-visible={beat >= 2 ? "true" : "false"}>
          {copy.detail}
        </p>
      </main>
      <div className={styles.energyDiagram} data-beat-layout-item="true">
        <svg viewBox="0 0 100 72" role="img" aria-label={language === "zh" ? "结合能示意曲线" : "Schematic binding-energy curve"}>
          <path className={styles.energyAxis} d="M8 62 H94 M8 62 V8" />
          <path
            className={styles.energyCurve}
            data-visible={beat >= 1 ? "true" : "false"}
            d="M9 58 C22 29 36 15 56 11 C66 9 76 10 93 14"
          />
          <line className={styles.ironGuide} data-visible={beat >= 1 ? "true" : "false"} x1="61" y1="10" x2="61" y2="62" />
          <circle className={styles.ironPoint} data-visible={beat >= 1 ? "true" : "false"} cx="61" cy="10" r="2.6" />
          <text className={styles.diagramLabel} x="58" y="7" fontSize="5.5">Fe</text>
          <text className={styles.diagramNote} x="10" y="69" fontSize="2.2">{language === "zh" ? "原子核质量增加 →" : "increasing nuclear mass →"}</text>
        </svg>
        <div className={styles.ironCore} data-still={beat >= 2 ? "true" : "false"}>
          <span>Fe</span>
          <small>{language === "zh" ? "能量边界" : "energy boundary"}</small>
        </div>
      </div>
      <aside className={styles.boundaryNotes} data-beat-layout-item="true">
        {copy.beats.map((item, index) => (
          <p key={item.id} data-visible={index <= beat ? "true" : "false"}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            {item.body}
          </p>
        ))}
      </aside>
      <SourceLine copy={copy} />
    </>
  );
}

function SceneFive({ copy, language }: { copy: SceneCopy; language: Language }) {
  return (
    <>
      <PosterHeader copy={copy} />
      <main className={styles.finalCopy}>
        <h1 className={styles.finalTitle}>{copy.title}</h1>
        <p className={styles.finalStatement}>{copy.statement}</p>
        <p className={styles.detail}>{copy.detail}</p>
      </main>
      <div className={styles.originField}>
        {ORIGIN_SITES[language].map((site, index) => (
          <article
            key={site.code + site.title}
            className={styles.originSite}
            data-origin-site="true"
            style={{ "--origin-index": String(index) } as CustomStyle}
          >
            <span className={styles.originDisc}>{site.code}</span>
            <div>
              <h2>{site.title}</h2>
              <p>{site.body}</p>
            </div>
          </article>
        ))}
      </div>
      <SourceLine copy={copy} />
    </>
  );
}

function ScenePanel({
  sceneId,
  beat,
  language,
  isThumbnail,
  motionOff,
}: {
  sceneId: SceneId;
  beat: number;
  language: Language;
  isThumbnail: boolean;
  motionOff: boolean;
}) {
  const copy = SCENES[sceneId][language];
  const visibleBeat = getVisibleBeat(sceneId, beat, isThumbnail);
  return (
    <section
      className={[styles.scene, styles[`scene${sceneId}`]].join(" ")}
      data-composition={
        sceneId === 1
          ? "solar-disc"
          : sceneId === 2
            ? "element-ring"
            : sceneId === 3
              ? "onion-shell"
              : sceneId === 4
                ? "iron-core"
                : "multiple-sites"
      }
      data-visible-beat={visibleBeat}
      data-motion-state={
        sceneId === 4 && visibleBeat >= 2
          ? "quiet"
          : motionOff
            ? "settled"
            : "solar-bloom"
      }
      aria-label={copy.title}
    >
      <div
        className={styles.sceneBody}
        data-beat-layout-container={sceneId < 5 ? "true" : undefined}
        data-beat-layout-mode={sceneId < 5 ? "reserved" : undefined}
      >
        {sceneId === 1 && <SceneOne copy={copy} beat={visibleBeat} />}
        {sceneId === 2 && (
          <SceneTwo copy={copy} beat={visibleBeat} language={language} />
        )}
        {sceneId === 3 && (
          <SceneThree copy={copy} beat={visibleBeat} language={language} />
        )}
        {sceneId === 4 && (
          <SceneFour copy={copy} beat={visibleBeat} language={language} />
        )}
        {sceneId === 5 && <SceneFive copy={copy} language={language} />}
      </div>
    </section>
  );
}

function SolarOrbitPoints({
  scene,
  language,
  onNavigate,
}: {
  scene: SceneId;
  language: Language;
  onNavigate?: (scene: number, beat: number) => void;
}) {
  const [expandedScene, setExpandedScene] = useState<SceneId | null>(null);

  const openOrbit = useCallback(
    (target: SceneId) => {
      setExpandedScene(target);
      onNavigate?.(target, 0);
    },
    [onNavigate],
  );

  const handleClick = useCallback(
    (event: MouseEvent<HTMLButtonElement>, target: SceneId) => {
      event.preventDefault();
      event.stopPropagation();
      openOrbit(target);
    },
    [openOrbit],
  );

  const handlePointerDown = useCallback((event: PointerEvent<HTMLElement>) => {
    event.stopPropagation();
  }, []);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLElement>) => {
      event.stopPropagation();
      const keyTargets: Partial<Record<string, SceneId>> = {
        ArrowRight: Math.min(scene + 1, 5) as SceneId,
        ArrowDown: Math.min(scene + 1, 5) as SceneId,
        ArrowLeft: Math.max(scene - 1, 1) as SceneId,
        ArrowUp: Math.max(scene - 1, 1) as SceneId,
        Home: 1,
        End: 5,
      };
      const target = keyTargets[event.key];
      if (!target) return;
      event.preventDefault();
      openOrbit(target);
    },
    [openOrbit, scene],
  );

  return (
    <nav
      className={styles.orbitNavigation}
      aria-label={language === "zh" ? "太阳轨道场景导航" : "Solar orbit scene navigation"}
      data-topic-navigation="true"
      data-navigation-geometry="ambient"
      data-navigation-carrier="solar-orbit-points"
      data-navigation-invocation="click-expand"
      data-navigation-feedback="mechanical-displacement"
      data-expanded-scene={expandedScene ?? "none"}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onPointerDown={handlePointerDown}
      onClick={(event) => event.stopPropagation()}
    >
      <span className={styles.navSun} aria-hidden="true">Fe</span>
      <span className={styles.navOrbitRule} aria-hidden="true" />
      {SCENE_IDS.map((sceneId, index) => {
        const expanded = expandedScene === sceneId;
        const angle = -92 + index * 72 + (expanded ? 13 : 0);
        return (
          <button
            key={sceneId}
            type="button"
            className={styles.orbitPoint}
            aria-label={`${language === "zh" ? "打开轨道" : "Open orbit"} ${sceneId}: ${NAV_LABELS[language][index]}`}
            aria-current={sceneId === scene ? "step" : undefined}
            data-active={sceneId === scene ? "true" : "false"}
            data-expanded={expanded ? "true" : "false"}
            data-orbit-angle={`${angle}deg`}
            style={{ "--orbit-angle": `${angle}deg` } as CustomStyle}
            onPointerDown={handlePointerDown}
            onClick={(event) => handleClick(event, sceneId)}
          >
            <span className={styles.orbitDot}>{String(sceneId).padStart(2, "0")}</span>
            <span className={styles.orbitLabel}>{NAV_LABELS[language][index]}</span>
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
  const activeScene = isSceneId(scene) ? scene : 1;
  const motionOff = reducedMotion || isThumbnail;

  return (
    <div
      className={styles.root}
      data-testid="iron-from-stars-root"
      data-motion={motionOff ? "off" : "on"}
      data-thumbnail={isThumbnail ? "true" : "false"}
    >
      <div className={styles.paperGrain} aria-hidden="true" />
      <div className={styles.ambientBloom} aria-hidden="true" />
      <SpatialSceneTrack
        scene={activeScene}
        beat={beat}
        sceneIds={SCENE_IDS}
        transitionKind="crossfade"
        transitionMap={TRANSITION_MAP}
        transitionDurationMs={960}
        reducedMotion={motionOff}
        beatLayoutModes={BEAT_LAYOUT_MODES}
        className={styles.track}
        renderScene={(sceneId, sceneBeat) => (
          <ScenePanel
            sceneId={isSceneId(sceneId) ? sceneId : 1}
            beat={sceneBeat}
            language={language}
            isThumbnail={isThumbnail}
            motionOff={motionOff}
          />
        )}
      />
      {!isThumbnail && (
        <SolarOrbitPoints
          scene={activeScene}
          language={language}
          onNavigate={onNavigate}
        />
      )}
      {!isThumbnail && (
        <p className={styles.folio} aria-hidden="true">
          SB / {String(activeScene).padStart(2, "0")}
        </p>
      )}
    </div>
  );
}

const metadata = {
  en: buildMetadata("en"),
  zh: buildMetadata("zh"),
};

export default defineTopic({
  id: "iron-from-stars",
  styleId: "solar-biennale-poster",
  title: {
    en: "Iron from Stars",
    zh: "恒星炼铁",
  },
  modelId: "GPT 5.6 Sol",
  Stage: TopicStage,
  metadata,
  navigation: {
    geometry: "ambient",
    carrier: "solar-orbit-points",
    invocation: "click-expand",
    feedback: "mechanical-displacement",
  },
  transitionScore: IRON_FROM_STARS_TRANSITION_SCORE,
  evidence: {
    kind: "facts",
    sources: IRON_FROM_STARS_SOURCES,
  },
});

import { useCallback } from "react";
import type {
  KeyboardEvent as ReactKeyboardEvent,
  MouseEvent as ReactMouseEvent,
  PointerEvent as ReactPointerEvent,
} from "react";
import {
  defineTopic,
  type TopicMetadata,
  type TopicStageProps,
  type TopicTransitionScore,
} from "../domain/topic";
import type { Source } from "../domain/evidence";
import SpatialSceneTrack, {
  type BeatLayoutMode,
  type SceneTransitionMap,
} from "../components/stage/SpatialSceneTrack";
import styles from "./natural-clocks.module.css";

type Lang = "en" | "zh";
type ClockId =
  | "tree-rings"
  | "coral"
  | "ice-core"
  | "sediment-layers"
  | "cave-mineral"
  | "varved-lake-mud"
  | "pulsar-timing";

type ClockEvidenceClaimField =
  | "mechanism"
  | "resolution"
  | "span"
  | "calibration"
  | "boundary";

export type NaturalClockClaimId =
  `${ClockId}.${ClockEvidenceClaimField}`;

export type NaturalClockSourceId =
  | "nasa-ice"
  | "nasa-tree"
  | "noaa-coral"
  | "ltrr-annual"
  | "ltrr-chronology"
  | "noaa-varve"
  | "usgs-archives"
  | "usgs-calcite"
  | "nanograv";

export interface NaturalClocksSource extends Source {
  id: NaturalClockSourceId;
  authority: string;
  title: string;
  citation: string;
  url: string;
  supports: string;
  claimIds: readonly NaturalClockClaimId[];
}

interface LocalText {
  en: string;
  zh: string;
}

interface ClockEvidenceRow {
  id: ClockId;
  short: string;
  label: LocalText;
  mechanism: LocalText;
  resolution: LocalText;
  span: LocalText;
  calibration: LocalText;
  boundary: LocalText;
  sourceLabel: string;
  sourceKeys: readonly NaturalClockSourceId[];
  claimIds: Readonly<Record<ClockEvidenceClaimField, NaturalClockClaimId>>;
  rangeLeft: string;
  rangeWidth: string;
}

interface BeatCopy {
  action: string;
  title: string;
  body: string;
}

interface SceneCopy {
  index: string;
  kicker: string;
  title: string;
  body: string;
  navLabel: string;
  caveat: string;
  beats: BeatCopy[];
}

const SCENE_IDS = [1, 2, 3, 4, 5] as const;

export const NATURAL_CLOCKS_CLAIMS = {
  "tree-rings": {
    mechanism: "tree-rings.mechanism",
    resolution: "tree-rings.resolution",
    span: "tree-rings.span",
    calibration: "tree-rings.calibration",
    boundary: "tree-rings.boundary",
  },
  coral: {
    mechanism: "coral.mechanism",
    resolution: "coral.resolution",
    span: "coral.span",
    calibration: "coral.calibration",
    boundary: "coral.boundary",
  },
  "ice-core": {
    mechanism: "ice-core.mechanism",
    resolution: "ice-core.resolution",
    span: "ice-core.span",
    calibration: "ice-core.calibration",
    boundary: "ice-core.boundary",
  },
  "sediment-layers": {
    mechanism: "sediment-layers.mechanism",
    resolution: "sediment-layers.resolution",
    span: "sediment-layers.span",
    calibration: "sediment-layers.calibration",
    boundary: "sediment-layers.boundary",
  },
  "cave-mineral": {
    mechanism: "cave-mineral.mechanism",
    resolution: "cave-mineral.resolution",
    span: "cave-mineral.span",
    calibration: "cave-mineral.calibration",
    boundary: "cave-mineral.boundary",
  },
  "varved-lake-mud": {
    mechanism: "varved-lake-mud.mechanism",
    resolution: "varved-lake-mud.resolution",
    span: "varved-lake-mud.span",
    calibration: "varved-lake-mud.calibration",
    boundary: "varved-lake-mud.boundary",
  },
  "pulsar-timing": {
    mechanism: "pulsar-timing.mechanism",
    resolution: "pulsar-timing.resolution",
    span: "pulsar-timing.span",
    calibration: "pulsar-timing.calibration",
    boundary: "pulsar-timing.boundary",
  },
} as const satisfies Readonly<
  Record<
    ClockId,
    Readonly<Record<ClockEvidenceClaimField, NaturalClockClaimId>>
  >
>;

export const NATURAL_CLOCKS_TRANSITION_SCORE = {
  "1->2": "page-turn",
  "2->3": "grid-reveal",
  "3->4": "crossfade",
  "4->5": "dip-to-color",
} as const satisfies TopicTransitionScore;

const TRANSITION_MAP: SceneTransitionMap = NATURAL_CLOCKS_TRANSITION_SCORE;

export const NATURAL_CLOCKS_SOURCES = [
  {
    id: "nasa-ice",
    authority: "NASA Science",
    title: "Core questions: An introduction to ice cores",
    citation:
      "Stoller-Conrad, J. (2017), NASA Science; updated October 22, 2024.",
    url: "https://science.nasa.gov/science-research/earth-science/climate-science/core-questions-an-introduction-to-ice-cores/",
    supports:
      "Supports annual layer counting in ice, the East Antarctic 800,000-year record, and the boundary that annual layers become harder to identify at depth and need additional age methods.",
    claimIds: Object.values(NATURAL_CLOCKS_CLAIMS["ice-core"]),
  },
  {
    id: "nasa-tree",
    authority: "NASA Science",
    title: "How do we know what greenhouse gas and temperature levels were in the distant past?",
    citation:
      "NASA Science (2024), “How do we know what greenhouse gas and temperature levels were in the distant past?”",
    url: "https://science.nasa.gov/climate-change/faq/how-do-we-know-what-greenhouse-gas-and-temperature-levels-were-in-the-distant-past/",
    supports:
      "Supports the cautious overview framing that tree growth rings retain rough growing-season information for about 2,000 years; this is an overview range, not a universal tree-ring limit.",
    claimIds: [
      NATURAL_CLOCKS_CLAIMS["tree-rings"].span,
      NATURAL_CLOCKS_CLAIMS["tree-rings"].boundary,
    ],
  },
  {
    id: "noaa-coral",
    authority: "NOAA National Centers for Environmental Information",
    title: "How Can Corals Teach Us About Climate?",
    citation:
      "NOAA National Centers for Environmental Information (2016), “How Can Corals Teach Us About Climate?”",
    url: "https://www.ncei.noaa.gov/news/how-can-corals-teach-us-about-climate",
    supports:
      "Supports coral seasonal density bands, dating and marking them by exact year and season, records over the past few hundred years, and the need for x-ray imaging when banding patterns are not visually evident.",
    claimIds: Object.values(NATURAL_CLOCKS_CLAIMS.coral),
  },
  {
    id: "ltrr-annual",
    authority: "University of Arizona Laboratory of Tree-Ring Research",
    title: "About Us",
    citation:
      "University of Arizona Laboratory of Tree-Ring Research, “About Us” (accessed July 10, 2026).",
    url: "https://ltrr.arizona.edu/about",
    supports:
      "Supports treating annual rings in trees as a dendrochronological archive and names the specialist institution behind the tree-ring evidence family used here.",
    claimIds: [
      NATURAL_CLOCKS_CLAIMS["tree-rings"].mechanism,
      NATURAL_CLOCKS_CLAIMS["tree-rings"].resolution,
    ],
  },
  {
    id: "ltrr-chronology",
    authority: "University of Arizona Laboratory of Tree-Ring Research",
    title: "Program Overview and History",
    citation:
      "University of Arizona Laboratory of Tree-Ring Research, “Program Overview and History” (accessed July 10, 2026).",
    url: "https://www.ltrr.arizona.edu/archaeology/progandhist.htm",
    supports:
      "Supports chronology building, dendrochronological dating of wood, and linking living-tree and archaeological chronologies to assign calendar dates.",
    claimIds: [NATURAL_CLOCKS_CLAIMS["tree-rings"].calibration],
  },
  {
    id: "noaa-varve",
    authority: "NOAA World Data Service for Paleoclimatology",
    title:
      "A 3000-year varved record of glacier activity and climate change from the proglacial lake Hvítárvatn, Iceland",
    citation:
      "Larsen, D.J., Miller, G.H., Geirsdóttir, Á., & Thordarson, T. (2011), Quaternary Science Reviews 30, 2715–2731, doi:10.1016/j.quascirev.2011.05.026; NOAA/WDS Study 14730.",
    url: "https://www.ncei.noaa.gov/pub/data/paleo/paleolimnology/europe/iceland/hvitarvatn2011-3varvethickness.txt",
    supports:
      "Supports one Icelandic lake record spanning the past 3,000 years; sedimentology and tephrostratigraphy confirm the continuous, annual nature of its laminae, without generalizing that continuity to every lake.",
    claimIds: Object.values(NATURAL_CLOCKS_CLAIMS["varved-lake-mud"]),
  },
  {
    id: "usgs-archives",
    authority: "U.S. Geological Survey",
    title: "Paleoclimate Archives",
    citation:
      "U.S. Geological Survey, “Paleoclimate Archives” (accessed July 10, 2026).",
    url: "https://www.usgs.gov/programs/climate-research-and-development-program/science/paleoclimate-archives",
    supports:
      "Supports sediment deposited in layers, archive time period and analytical resolution varying by material, sampling and analysis of proxies, and reconstruction at the sample site; it also describes groundwater-deposited cave-mineral layers and analysis of their thickness and chemistry across varied forms.",
    claimIds: [
      ...Object.values(NATURAL_CLOCKS_CLAIMS["sediment-layers"]),
      NATURAL_CLOCKS_CLAIMS["cave-mineral"].mechanism,
      NATURAL_CLOCKS_CLAIMS["cave-mineral"].resolution,
      NATURAL_CLOCKS_CLAIMS["cave-mineral"].boundary,
    ],
  },
  {
    id: "usgs-calcite",
    authority: "U.S. Geological Survey",
    title:
      "Continuous 500,000-year climate record from vein calcite in Devils Hole, Nevada",
    citation:
      "Winograd, I.J., et al. (1992), Science 258, 255–260, doi:10.1126/science.258.5080.255.",
    url: "https://www.usgs.gov/publications/continuous-500000-year-climate-record-vein-calcite-devils-hole-nevada",
    supports:
      "Supports one continuous 500,000-year cave calcite example whose chronology uses replicated uranium-series dates; it is displayed as an example, not a general duration for all cave minerals.",
    claimIds: [
      NATURAL_CLOCKS_CLAIMS["cave-mineral"].span,
      NATURAL_CLOCKS_CLAIMS["cave-mineral"].calibration,
    ],
  },
  {
    id: "nanograv",
    authority:
      "North American Nanohertz Observatory for Gravitational Waves (NANOGrav)",
    title: "Detector Characterization and Noise Budget",
    citation:
      "Agazie, G., et al. (2023), The Astrophysical Journal Letters 951:L9, doi:10.3847/2041-8213/acda88.",
    url: "https://nanograv.org/15yr/Summary/Detector",
    supports:
      "Supports prediction of pulse arrivals to about one microsecond across 15 years, plus the requirement to model pulse jitter, propagation, receiver, clock, and solar-system effects.",
    claimIds: Object.values(NATURAL_CLOCKS_CLAIMS["pulsar-timing"]),
  },
] as const satisfies readonly NaturalClocksSource[];

export const NATURAL_CLOCKS_SOURCE_MAP = {
  "nasa-ice": NATURAL_CLOCKS_SOURCES[0],
  "nasa-tree": NATURAL_CLOCKS_SOURCES[1],
  "noaa-coral": NATURAL_CLOCKS_SOURCES[2],
  "ltrr-annual": NATURAL_CLOCKS_SOURCES[3],
  "ltrr-chronology": NATURAL_CLOCKS_SOURCES[4],
  "noaa-varve": NATURAL_CLOCKS_SOURCES[5],
  "usgs-archives": NATURAL_CLOCKS_SOURCES[6],
  "usgs-calcite": NATURAL_CLOCKS_SOURCES[7],
  nanograv: NATURAL_CLOCKS_SOURCES[8],
} as const satisfies Readonly<
  Record<NaturalClockSourceId, NaturalClocksSource>
>;

export const NATURAL_CLOCKS_EVIDENCE = [
  {
    id: "tree-rings",
    short: "TR",
    label: { en: "Tree rings", zh: "树轮" },
    mechanism: { en: "adds one growth ring", zh: "长出一圈生长层" },
    resolution: { en: "annual rings", zh: "年度年轮" },
    span: { en: "~2,000 yr overview", zh: "约 2,000 年概览范围" },
    calibration: { en: "cross-date patterns", zh: "交叉定年比对纹样" },
    boundary: {
      en: "growth signal is site- and species-bound",
      zh: "生长信号受地点与树种限制",
    },
    sourceLabel: "NASA · LTRR",
    sourceKeys: ["nasa-tree", "ltrr-annual", "ltrr-chronology"],
    claimIds: NATURAL_CLOCKS_CLAIMS["tree-rings"],
    rangeLeft: "10%",
    rangeWidth: "35%",
  },
  {
    id: "coral",
    short: "CO",
    label: { en: "Coral", zh: "珊瑚" },
    mechanism: { en: "seasonal density bands", zh: "季节性密度条带" },
    resolution: { en: "exact year + season", zh: "精确到年份与季节" },
    span: { en: "past few hundred yr", zh: "过去数百年" },
    calibration: { en: "mark bands by year + season", zh: "按年份与季节标记条带" },
    boundary: {
      en: "banding may need X-ray imaging",
      zh: "条带有时需 X 射线成像",
    },
    sourceLabel: "NOAA",
    sourceKeys: ["noaa-coral"],
    claimIds: NATURAL_CLOCKS_CLAIMS.coral,
    rangeLeft: "10%",
    rangeWidth: "25%",
  },
  {
    id: "ice-core",
    short: "IC",
    label: { en: "Ice core", zh: "冰芯" },
    mechanism: { en: "buries snow; seals air", zh: "埋藏降雪并封存空气" },
    resolution: { en: "annual layers where legible", zh: "可辨处为年度层" },
    span: { en: "up to 800,000 yr", zh: "最长至 800,000 年" },
    calibration: { en: "layers + chemistry + models", zh: "层理加化学与模型" },
    boundary: {
      en: "deep layers compress; counts get harder",
      zh: "深层受压，计数更难",
    },
    sourceLabel: "NASA",
    sourceKeys: ["nasa-ice"],
    claimIds: NATURAL_CLOCKS_CLAIMS["ice-core"],
    rangeLeft: "10%",
    rangeWidth: "82%",
  },
  {
    id: "sediment-layers",
    short: "SD",
    label: { en: "Sediment layers", zh: "沉积层" },
    mechanism: { en: "deposits in layers", zh: "逐层沉积" },
    resolution: { en: "varies by material", zh: "分辨率随材料而变" },
    span: { en: "time period varies", zh: "保存时段各不相同" },
    calibration: { en: "sample + analyze proxies", zh: "取样并分析代用指标" },
    boundary: {
      en: "reconstruction is site-specific",
      zh: "重建结果针对采样地点",
    },
    sourceLabel: "USGS",
    sourceKeys: ["usgs-archives"],
    claimIds: NATURAL_CLOCKS_CLAIMS["sediment-layers"],
    rangeLeft: "23%",
    rangeWidth: "49%",
  },
  {
    id: "cave-mineral",
    short: "CM",
    label: { en: "Cave mineral", zh: "洞穴矿物" },
    mechanism: { en: "drip precipitates mineral", zh: "滴水沉淀矿物" },
    resolution: { en: "layer chemistry", zh: "层状化学信号" },
    span: { en: "500,000-year calcite example", zh: "500,000 年方解石实例" },
    calibration: { en: "replicated U-series dates", zh: "重复铀系测年" },
    boundary: {
      en: "one cave mineral is not every cave record",
      zh: "一个洞穴矿物实例不代表所有洞穴记录",
    },
    sourceLabel: "USGS",
    sourceKeys: ["usgs-archives", "usgs-calcite"],
    claimIds: NATURAL_CLOCKS_CLAIMS["cave-mineral"],
    rangeLeft: "22%",
    rangeWidth: "64%",
  },
  {
    id: "varved-lake-mud",
    short: "VM",
    label: { en: "Varved lake mud", zh: "年层湖泥" },
    mechanism: { en: "settles a paired varve", zh: "沉积一对年层" },
    resolution: { en: "annual where varves persist", zh: "年层连续时为年度" },
    span: { en: "3,000-year Iceland example", zh: "3,000 年冰岛实例" },
    calibration: { en: "varves + tephra checks", zh: "年层加火山灰校核" },
    boundary: {
      en: "only where annual laminae remain continuous",
      zh: "仅在年度薄层保持连续的地方成立",
    },
    sourceLabel: "NOAA",
    sourceKeys: ["noaa-varve"],
    claimIds: NATURAL_CLOCKS_CLAIMS["varved-lake-mud"],
    rangeLeft: "10%",
    rangeWidth: "43%",
  },
  {
    id: "pulsar-timing",
    short: "PT",
    label: { en: "Pulsar timing", zh: "脉冲星计时" },
    mechanism: { en: "arrives as a radio pulse", zh: "以无线电脉冲到达" },
    resolution: { en: "~1 μs predicted arrivals", zh: "约 1 微秒到达预测" },
    span: { en: "15-year data set", zh: "15 年数据集" },
    calibration: { en: "timing model + corrections", zh: "计时模型加校正" },
    boundary: {
      en: "not a material climate proxy; noise is modeled",
      zh: "不是材料气候代用指标；需建模噪声",
    },
    sourceLabel: "NANOGrav",
    sourceKeys: ["nanograv"],
    claimIds: NATURAL_CLOCKS_CLAIMS["pulsar-timing"],
    rangeLeft: "10%",
    rangeWidth: "16%",
  },
] as const satisfies readonly ClockEvidenceRow[];

const COPY: Record<Lang, Record<number, SceneCopy>> = {
  en: {
    1: {
      index: "01",
      kicker: "SEVEN RECORDING MATERIALS",
      title: "Time leaves different materials behind.",
      body: "A tree, coral skeleton, ice, sediment, cave mineral, lake mud, and a pulsar signal can all carry time—but not by the same clockwork.",
      navLabel: "chorus",
      caveat: "Comparison, not a contest. The marks describe a record’s conditions—not its value.",
      beats: [
        {
          action: "Set out the seven materials",
          title: "One question; seven carriers",
          body: "Each specimen holds time in a different physical form.",
        },
        {
          action: "Bring growth records forward",
          title: "Growth leaves rings and bands",
          body: "Tree and coral archives make their own seasonal structure.",
        },
        {
          action: "Bring layered records forward",
          title: "Layers do not all settle alike",
          body: "Ice, sediment, cave mineral, and lake mud need different reading rules.",
        },
        {
          action: "Add the signal clock boundary",
          title: "A pulse is not a core",
          body: "Pulsar timing is precise signal modeling, not a material climate archive. These are not grades.",
        },
      ],
    },
    2: {
      index: "02",
      kicker: "FORMATION MECHANISMS",
      title: "A layer is an event, not a universal unit.",
      body: "One record grows, another settles, freezes, precipitates, or arrives. The formation rule determines what a tick can mean.",
      navLabel: "formation",
      caveat: "Formation is only the first test. Dating, continuity, and site conditions arrive next.",
      beats: [
        {
          action: "Reveal formation verbs",
          title: "Seven ways to leave a mark",
          body: "Grow, densify, bury, deposit, drip, settle, arrive.",
        },
        {
          action: "Expose the material contact",
          title: "The medium decides what is stored",
          body: "A trapped gas bubble, a mineral layer, and a radio arrival are not interchangeable samples.",
        },
        {
          action: "Attach the calibration question",
          title: "Every mark needs a reading rule",
          body: "Count, cross-date, anchor, or model—each record has its own route to time.",
        },
      ],
    },
    3: {
      index: "03",
      kicker: "SOURCE-BOUNDED TIME WINDOWS",
      title: "Use ranges as examples, not a leaderboard.",
      body: "The horizontal bands are schematic order-of-magnitude contexts. Every stated span and resolution is source-bounded; missing continuity stays visible.",
      navLabel: "ranges",
      caveat: "Range does not mean superiority. Resolution, continuity, and calibration are separate questions.",
      beats: [
        {
          action: "Align seven source-bounded windows",
          title: "A shared axis; unequal evidence",
          body: "Short, long, annual, seasonal, variable, and modeled belong on one page only with their boundaries intact.",
        },
        {
          action: "Keep caveats attached to each range",
          title: "The qualifiers are part of the data",
          body: "Examples are labeled as examples. Unknown or variable coverage is not stretched into a precise bar.",
        },
      ],
    },
    4: {
      index: "04",
      kicker: "FAIR COMPARISON INSTRUMENT",
      title: "Read the conditions before the chronology.",
      body: "A useful comparison asks what stores the signal, how finely it can be read, how it is anchored, and where it can fail. No winner. No total.",
      navLabel: "boundaries",
      caveat: "This matrix has no score column: it is a reading instrument, not a ranking machine.",
      beats: [
        {
          action: "Hold the complete matrix for reading",
          title: "Material × span × resolution × calibration",
          body: "The final matrix is deliberately still: a concise way to compare conditions without hiding uncertainty.",
        },
      ],
    },
    5: {
      index: "05",
      kicker: "ONE RECORD, ONE MATERIAL",
      title: "A clock is material first.",
      body: "Before a chronology becomes a line, it is a physical or measured trace with a formation process, a calibration route, and a boundary.",
      navLabel: "material",
      caveat: "Fair comparison begins by keeping different clocks different.",
      beats: [
        {
          action: "Reduce the comparison to one record",
          title: "Read the material before the time",
          body: "The last view keeps the core, the signal, and the caveat together.",
        },
      ],
    },
  },
  zh: {
    1: {
      index: "01",
      kicker: "七种记录材料",
      title: "时间会留在不同的材料里。",
      body: "树、珊瑚骨骼、冰、沉积物、洞穴矿物、湖泥和脉冲星信号都能携带时间，却不靠同一套钟表机制。",
      navLabel: "合唱",
      caveat: "这是比较，不是竞赛。标记描述记录的条件，不判断它的价值。",
      beats: [
        {
          action: "陈列七种材料",
          title: "一个问题，七种载体",
          body: "每件标本都以不同的物理形式保存时间。",
        },
        {
          action: "前置生长记录",
          title: "生长留下年轮与条带",
          body: "树与珊瑚档案各自生成季节性的结构。",
        },
        {
          action: "前置层状记录",
          title: "层状沉积并不按同一种方式形成",
          body: "冰、沉积层、洞穴矿物与湖泥需要不同的阅读规则。",
        },
        {
          action: "加入信号钟的边界",
          title: "脉冲不是岩芯",
          body: "脉冲星计时是精密信号建模，不是材料气候档案。这些不是等级。",
        },
      ],
    },
    2: {
      index: "02",
      kicker: "形成机制",
      title: "一层是一次事件，不是通用单位。",
      body: "有的记录生长，有的沉降、冻结、沉淀或到达。形成规则决定一次“刻度”能代表什么。",
      navLabel: "形成",
      caveat: "形成只是第一关；测年、连续性与地点条件随后才进入。",
      beats: [
        {
          action: "显现形成动词",
          title: "留下痕迹的七种方式",
          body: "生长、增密、埋藏、沉降、滴落、年层沉积、到达。",
        },
        {
          action: "显露材料接触",
          title: "介质决定储存的东西",
          body: "被困气泡、矿物层和无线电到达时刻不是可互换的样本。",
        },
        {
          action: "附上校准问题",
          title: "每一个痕迹都需要读法",
          body: "计数、交叉定年、锚定或建模——每种记录都有自己的时间路径。",
        },
      ],
    },
    3: {
      index: "03",
      kicker: "来源限定的时间窗口",
      title: "把范围当作实例，不当作排行榜。",
      body: "横向条带是示意性的数量级语境。每个跨度和分辨率都受来源限定；不连续之处仍然可见。",
      navLabel: "范围",
      caveat: "跨度不等于优越。分辨率、连续性和校准是独立问题。",
      beats: [
        {
          action: "对齐七种来源限定窗口",
          title: "同一坐标，不同证据",
          body: "短、长、年度、季节、可变与模型化记录可以同页出现，但边界不能丢。",
        },
        {
          action: "把限定语留在范围旁",
          title: "限定语也是数据的一部分",
          body: "实例明确写为实例；未知或可变覆盖不被拉成伪精确条带。",
        },
      ],
    },
    4: {
      index: "04",
      kicker: "公平比较仪器",
      title: "先读条件，再读年代序列。",
      body: "有意义的比较会问：信号存在哪里、能读多细、如何锚定、又会在哪里失效。没有赢家，没有总分。",
      navLabel: "边界",
      caveat: "矩阵没有得分列：它是阅读仪器，不是排序机器。",
      beats: [
        {
          action: "静置完整矩阵供阅读",
          title: "材料 × 跨度 × 分辨率 × 校准",
          body: "最终矩阵刻意静止：在不藏起不确定性的前提下，紧凑地比较条件。",
        },
      ],
    },
    5: {
      index: "05",
      kicker: "一条记录，一种材料",
      title: "时钟首先是材料。",
      body: "年代序列成为一条线之前，它先是一段物理或测量痕迹，带着形成过程、校准路径和边界。",
      navLabel: "材料",
      caveat: "公平比较从保留不同钟表的不同开始。",
      beats: [
        {
          action: "把比较收束为一条记录",
          title: "先读材料，再读时间",
          body: "最后一页让岩芯、信号与限定语留在一起。",
        },
      ],
    },
  },
};

const BEAT_LAYOUT_MODES: Record<number, BeatLayoutMode> = {
  1: "reserved",
  2: "reserved",
  3: "reserved",
  4: "reserved",
  5: "reserved",
};

function clampScene(scene: number): number {
  return Math.max(1, Math.min(5, scene));
}

function clampBeat(scene: number, beat: number): number {
  return Math.max(0, Math.min(COPY.en[scene].beats.length - 1, beat));
}

function getCopy(scene: number, language: Lang): SceneCopy {
  return COPY[language][scene] ?? COPY[language][1];
}

function text(value: LocalText, language: Lang): string {
  return value[language];
}

function buildMetadata(language: Lang): TopicMetadata {
  const isZh = language === "zh";
  return {
    theme: isZh ? "自然时钟" : "Natural Clocks",
    densityLabel: isZh ? "图解型 · 中高密度" : "Diagram explainer · Medium-high",
    heroScene: 4,
    colors: {
      bg: "#f3f0e8",
      ink: "#19292f",
      panel: "#fffdf8",
    },
    typography: {
      header: "Arial 800",
      body: "Arial 500",
    },
    tags: [
      "benchmark-matrix",
      "diagram-explainer",
      "paleoclimate",
      "chronology",
      "fair-comparison",
      "evidence-boundaries",
      "material-archives",
      "medium-high-density",
    ],
    fonts: ["Arial", "Georgia", "cjk:PingFang SC"],
    scenes: SCENE_IDS.map((sceneId) => {
      const scene = getCopy(sceneId, language);
      return {
        id: sceneId,
        title: scene.navLabel,
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

function SpecimenIcon({ id }: { id: ClockId }) {
  switch (id) {
    case "tree-rings":
      return (
        <svg viewBox="0 0 120 120" aria-hidden="true">
          <circle cx="60" cy="60" r="48" className={styles.specimenLine} />
          <circle cx="60" cy="60" r="36" className={styles.specimenLineSoft} />
          <circle cx="60" cy="60" r="24" className={styles.specimenLine} />
          <circle cx="60" cy="60" r="11" className={styles.specimenFill} />
          <path d="M60 11 V109" className={styles.specimenMark} />
        </svg>
      );
    case "coral":
      return (
        <svg viewBox="0 0 120 120" aria-hidden="true">
          <path d="M60 106 C57 84 63 71 60 51 C58 35 48 32 44 18" className={styles.specimenLine} />
          <path d="M59 74 C42 67 34 55 30 41 M60 64 C79 56 85 43 86 29 M49 87 C34 84 23 75 19 64 M68 89 C86 83 98 74 100 62" className={styles.specimenLine} />
          <path d="M28 41 L19 29 M86 29 L94 17 M19 64 L12 53 M100 62 L108 50" className={styles.specimenMark} />
          <circle cx="60" cy="106" r="7" className={styles.specimenFill} />
        </svg>
      );
    case "ice-core":
      return (
        <svg viewBox="0 0 120 120" aria-hidden="true">
          <path d="M42 10 H78 L88 110 H32 Z" className={styles.iceBody} />
          {[31, 50, 69, 88].map((y) => (
            <path key={y} d={`M36 ${y} H84`} className={styles.specimenLine} />
          ))}
          <circle cx="56" cy="40" r="4" className={styles.specimenBubble} />
          <circle cx="68" cy="76" r="5" className={styles.specimenBubble} />
        </svg>
      );
    case "sediment-layers":
      return (
        <svg viewBox="0 0 120 120" aria-hidden="true">
          <path d="M14 91 C29 82 40 98 56 90 C72 81 83 97 106 86 V106 H14 Z" className={styles.specimenFillSoft} />
          <path d="M15 35 C31 27 41 39 57 31 C73 23 87 38 106 29" className={styles.specimenLine} />
          <path d="M15 51 C31 43 43 57 59 48 C75 39 87 55 106 45" className={styles.specimenLineSoft} />
          <path d="M15 68 C30 60 44 75 60 65 C76 56 88 72 106 62" className={styles.specimenLine} />
          <path d="M15 85 C31 77 43 91 59 81 C75 72 88 88 106 78" className={styles.specimenLineSoft} />
        </svg>
      );
    case "cave-mineral":
      return (
        <svg viewBox="0 0 120 120" aria-hidden="true">
          <path d="M15 18 H105" className={styles.specimenLine} />
          <path d="M39 18 C42 42 50 43 51 66 C52 80 46 91 42 102" className={styles.specimenLine} />
          <path d="M77 18 C75 38 68 45 70 65 C72 79 78 91 81 102" className={styles.specimenLine} />
          <path d="M28 105 C34 83 41 73 51 73 C61 73 64 91 69 105" className={styles.specimenLineSoft} />
          <circle cx="60" cy="58" r="4" className={styles.specimenFill} />
        </svg>
      );
    case "varved-lake-mud":
      return (
        <svg viewBox="0 0 120 120" aria-hidden="true">
          <ellipse cx="60" cy="76" rx="45" ry="23" className={styles.specimenFillSoft} />
          <path d="M15 77 C31 68 39 82 57 73 C75 64 91 80 106 70" className={styles.specimenLine} />
          <path d="M18 64 C31 57 42 68 58 60 C75 52 89 67 102 59" className={styles.specimenLineSoft} />
          <path d="M25 50 C37 44 46 53 60 47 C74 41 85 54 96 48" className={styles.specimenLine} />
          <path d="M60 19 V42" className={styles.specimenMark} />
        </svg>
      );
    case "pulsar-timing":
      return (
        <svg viewBox="0 0 120 120" aria-hidden="true">
          <circle cx="60" cy="60" r="10" className={styles.specimenFill} />
          <circle cx="60" cy="60" r="25" className={styles.specimenLineSoft} />
          <circle cx="60" cy="60" r="40" className={styles.specimenLine} />
          <path d="M60 4 V31 M60 89 V116 M4 60 H31 M89 60 H116" className={styles.specimenMark} />
          <path d="M82 22 L105 9 M15 111 L38 98" className={styles.specimenLineSoft} />
        </svg>
      );
  }
}

function SpecimenCard({
  record,
  language,
  emphasis,
  compact = false,
}: {
  record: (typeof NATURAL_CLOCKS_EVIDENCE)[number];
  language: Lang;
  emphasis: "quiet" | "active" | "steady";
  compact?: boolean;
}) {
  return (
    <article
      className={[styles.specimenCard, compact ? styles.specimenCardCompact : ""]
        .filter(Boolean)
        .join(" ")}
      data-clock-specimen="true"
      data-clock-id={record.id}
      data-emphasis={emphasis}
      data-beat-layout-item="true"
    >
      <div className={styles.specimenIcon}>
        <SpecimenIcon id={record.id} />
      </div>
      <div className={styles.specimenText}>
        <span>{record.short}</span>
        <strong>{text(record.label, language)}</strong>
        {!compact && <small>{text(record.resolution, language)}</small>}
      </div>
    </article>
  );
}

function SceneHeader({ copy, beat }: { copy: SceneCopy; beat: number }) {
  const beatCopy = copy.beats[beat] ?? copy.beats[0];
  return (
    <header className={styles.sceneHeader} data-beat-layout-item="true">
      <div className={styles.sceneIndex}>{copy.index}</div>
      <div className={styles.sceneHeading}>
        <p>{copy.kicker}</p>
        <h1>{copy.title}</h1>
        <div className={styles.beatStatement} data-current-beat={beat}>
          <span>{beatCopy.action}</span>
          <strong>{beatCopy.title}</strong>
          <small>{beatCopy.body}</small>
        </div>
      </div>
      <p className={styles.sceneBody}>{copy.body}</p>
    </header>
  );
}

function SceneOne({ language, beat }: { language: Lang; beat: number }) {
  const emphasized = (record: ClockId): "quiet" | "active" | "steady" => {
    if (beat === 0) return "steady";
    if (beat === 1) {
      return record === "tree-rings" || record === "coral" ? "active" : "quiet";
    }
    if (beat === 2) {
      return ["ice-core", "sediment-layers", "cave-mineral", "varved-lake-mud"].includes(record)
        ? "active"
        : "quiet";
    }
    return record === "pulsar-timing" ? "active" : "steady";
  };

  return (
    <div className={styles.chorusScene} data-beat-layout-item="true">
      <div className={styles.specimenChorus}>
        {NATURAL_CLOCKS_EVIDENCE.map((record) => (
          <SpecimenCard
            key={record.id}
            record={record}
            language={language}
            emphasis={emphasized(record.id)}
          />
        ))}
      </div>
      <div className={styles.chorusRule}>
        <span>{language === "zh" ? "同问时间" : "ONE QUESTION"}</span>
        <strong>{language === "zh" ? "不同材料 · 不同读法" : "DIFFERENT MATERIALS · DIFFERENT READS"}</strong>
        <small>{language === "zh" ? "不设等级，不汇总得分。" : "No grades. No total."}</small>
      </div>
    </div>
  );
}

function SceneTwo({ language, beat }: { language: Lang; beat: number }) {
  return (
    <div className={styles.formationScene} data-beat-layout-item="true">
      <div className={styles.formationGrid}>
        {NATURAL_CLOCKS_EVIDENCE.map((record, index) => (
          <article
            key={record.id}
            className={styles.formationCard}
            data-formation-step="true"
            data-revealed={index <= beat + 4 ? "true" : "false"}
          >
            <div className={styles.formationGlyph}>
              <SpecimenIcon id={record.id} />
            </div>
            <span>{record.short}</span>
            <strong>{text(record.label, language)}</strong>
            <p>{text(record.mechanism, language)}</p>
            <small data-formation-calibration={beat >= 2 ? "true" : "false"}>
              {beat >= 2
                ? text(record.calibration, language)
                : language === "zh"
                  ? "形成中"
                  : "forming"}
            </small>
          </article>
        ))}
      </div>
      <div className={styles.formationLegend}>
        <span>{language === "zh" ? "形成" : "FORMATION"}</span>
        <strong>{language === "zh" ? "材料先决定痕迹；校准再把痕迹接到时间。" : "Material makes the mark; calibration connects the mark to time."}</strong>
      </div>
    </div>
  );
}

function SceneThree({ language, beat }: { language: Lang; beat: number }) {
  const labels =
    language === "zh"
      ? ["年", "百年", "千年", "十万年", "百万年"]
      : ["years", "centuries", "millennia", "100k", "1m"];

  return (
    <div className={styles.rangeScene} data-beat-layout-item="true">
      <div className={styles.rangeAxis} aria-hidden="true">
        {labels.map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>
      <div className={styles.rangeRows}>
        {NATURAL_CLOCKS_EVIDENCE.map((record) => (
          <article
            key={record.id}
            className={styles.rangeRow}
            data-clock-range-row="true"
            data-revealed={beat >= 0 ? "true" : "false"}
          >
            <div className={styles.rangeName}>
              <span>{record.short}</span>
              <strong>{text(record.label, language)}</strong>
            </div>
            <div className={styles.rangeTrack}>
              <i
                className={styles.rangeBand}
                style={{
                  ["--range-left" as string]: record.rangeLeft,
                  ["--range-width" as string]: record.rangeWidth,
                }}
              />
            </div>
            <div className={styles.rangeFacts}>
              <strong>{text(record.span, language)}</strong>
              <span>{text(record.resolution, language)}</span>
              {beat >= 1 && <small>{text(record.boundary, language)}</small>}
            </div>
            <em>{record.sourceLabel}</em>
          </article>
        ))}
      </div>
      <p className={styles.rangeFootnote}>
        {language === "zh"
          ? "示意性数量级轴；每一行都是来源限定的实例或条件，不构成长度与精度排名。"
          : "Schematic order-of-magnitude axis: each row is a source-bounded example or condition, not a span or precision rank."}
      </p>
    </div>
  );
}

function SceneFour({ language }: { language: Lang }) {
  const headings =
    language === "zh"
      ? ["材料", "分辨率", "跨度", "校准", "边界"]
      : ["Material", "Resolution", "Span", "Calibration", "Boundary"];

  return (
    <div className={styles.matrixScene} data-beat-layout-item="true">
      <div className={styles.matrixTable} role="table" aria-label={language === "zh" ? "自然时钟比较矩阵" : "Natural clocks comparison matrix"}>
        <div className={styles.matrixHeader} role="row">
          {headings.map((heading) => (
            <span key={heading} role="columnheader">{heading}</span>
          ))}
        </div>
        {NATURAL_CLOCKS_EVIDENCE.map((record) => (
          <div
            key={record.id}
            className={styles.matrixRow}
            role="row"
            data-clock-matrix-row="true"
          >
            <div role="cell"><b>{record.short}</b><strong>{text(record.label, language)}</strong></div>
            <div role="cell">{text(record.resolution, language)}</div>
            <div role="cell">{text(record.span, language)}</div>
            <div role="cell">{text(record.calibration, language)}</div>
            <div role="cell">{text(record.boundary, language)}</div>
          </div>
        ))}
      </div>
      <div className={styles.matrixVerdict}>
        <span>{language === "zh" ? "读法" : "READING RULE"}</span>
        <strong>{language === "zh" ? "没有赢家，没有总分。" : "No winner. No total."}</strong>
        <p>{language === "zh" ? "并列的列让差异可扫描，而不把差异压成一个分数。" : "Parallel columns make differences scannable without compressing them into a score."}</p>
      </div>
    </div>
  );
}

function SceneFive({ language }: { language: Lang }) {
  return (
    <div className={styles.oneRecordScene} data-beat-layout-item="true">
      <div className={styles.oneRecordCore} data-one-record="true">
        <svg viewBox="0 0 400 660" role="img" aria-label={language === "zh" ? "一段层状记录芯" : "One layered record core"}>
          <path d="M110 32 H290 L324 628 H76 Z" className={styles.coreShell} />
          {[118, 194, 270, 346, 422, 498, 574].map((y, index) => (
            <path key={y} d={`M92 ${y} C145 ${y - 10} 252 ${y + 10} 308 ${y}`} className={index % 2 === 0 ? styles.coreLayerStrong : styles.coreLayerSoft} />
          ))}
          <circle cx="201" cy="156" r="11" className={styles.coreBubble} />
          <circle cx="218" cy="380" r="8" className={styles.coreBubble} />
          <path d="M200 56 V598" className={styles.coreSpine} />
        </svg>
      </div>
      <div className={styles.oneRecordText}>
        <span>{language === "zh" ? "记录先于年代序列" : "RECORD BEFORE TIMELINE"}</span>
        <h2>{language === "zh" ? "先问：什么留下了痕迹？" : "Ask first: what left the trace?"}</h2>
        <div>
          <p><b>{language === "zh" ? "形成" : "FORMATION"}</b>{language === "zh" ? "材料如何被留下" : "how the material was left"}</p>
          <p><b>{language === "zh" ? "校准" : "CALIBRATION"}</b>{language === "zh" ? "如何把痕迹接到时间" : "how the trace connects to time"}</p>
          <p><b>{language === "zh" ? "边界" : "BOUNDARY"}</b>{language === "zh" ? "在哪些地方不能外推" : "where it should not be extended"}</p>
        </div>
      </div>
    </div>
  );
}

function ScenePanel({
  scene,
  beat,
  language,
}: {
  scene: number;
  beat: number;
  language: Lang;
}) {
  const safeScene = clampScene(scene);
  const safeBeat = clampBeat(safeScene, beat);
  const copy = getCopy(safeScene, language);

  let visual: React.ReactNode;
  switch (safeScene) {
    case 1:
      visual = <SceneOne language={language} beat={safeBeat} />;
      break;
    case 2:
      visual = <SceneTwo language={language} beat={safeBeat} />;
      break;
    case 3:
      visual = <SceneThree language={language} beat={safeBeat} />;
      break;
    case 4:
      visual = <SceneFour language={language} />;
      break;
    default:
      visual = <SceneFive language={language} />;
      break;
  }

  return (
    <section
      className={styles.scenePanel}
      data-natural-clock-scene={safeScene}
      data-current-beat={safeBeat}
    >
      <SceneHeader copy={copy} beat={safeBeat} />
      <div className={styles.sceneCanvas}>{visual}</div>
      <p className={styles.sceneCaveat} data-beat-layout-item="true">{copy.caveat}</p>
    </section>
  );
}

const NAV_GROUPS = [
  { scene: 1, tokens: "TR · CO" },
  { scene: 2, tokens: "IC · SD" },
  { scene: 3, tokens: "CM · VM" },
  { scene: 4, tokens: "PT" },
  { scene: 5, tokens: "MAT" },
] as const;

function TaxonomyNavigator({
  scene,
  language,
  onNavigate,
}: {
  scene: number;
  language: Lang;
  onNavigate?: (scene: number, beat: number) => void;
}) {
  const invoke = useCallback(
    (targetScene: number) => {
      onNavigate?.(targetScene, 0);
    },
    [onNavigate],
  );

  const stopPointer = useCallback((event: ReactPointerEvent<HTMLButtonElement>) => {
    event.stopPropagation();
  }, []);

  const handleClick = useCallback(
    (event: ReactMouseEvent<HTMLButtonElement>, targetScene: number) => {
      event.preventDefault();
      event.stopPropagation();
      invoke(targetScene);
    },
    [invoke],
  );

  const handleKeyDown = useCallback(
    (event: ReactKeyboardEvent<HTMLButtonElement>, targetScene: number) => {
      event.stopPropagation();
      if (event.repeat) return;

      let nextScene: number | null = null;
      if (event.key === " " || event.key === "Spacebar" || event.key === "Enter") {
        nextScene = targetScene;
      } else if (event.key === "ArrowRight" || event.key === "ArrowDown") {
        nextScene = Math.min(5, targetScene + 1);
      } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
        nextScene = Math.max(1, targetScene - 1);
      } else if (event.key === "Home") {
        nextScene = 1;
      } else if (event.key === "End") {
        nextScene = 5;
      }

      if (nextScene === null) return;
      event.preventDefault();
      invoke(nextScene);
    },
    [invoke],
  );

  return (
    <nav
      className={styles.taxonomyNav}
      data-topic-navigation="true"
      data-navigation-geometry="typographic-index"
      data-navigation-carrier="clock-taxonomy-index"
      data-navigation-invocation="auto-hide"
      data-navigation-feedback="typographic-emphasis"
      aria-label={language === "zh" ? "自然时钟分类导航" : "Natural clocks taxonomy navigation"}
    >
      <span className={styles.navCaption}>{language === "zh" ? "时钟分类" : "CLOCK TAXONOMY"}</span>
      <div className={styles.navButtons}>
        {NAV_GROUPS.map((group) => {
          const copy = getCopy(group.scene, language);
          const state = scene === group.scene ? "active" : "idle";
          const label =
            language === "zh"
              ? `场景 ${group.scene}：${copy.navLabel}`
              : `Scene ${group.scene}: ${copy.navLabel}`;

          return (
            <button
              key={group.scene}
              type="button"
              className={styles.navButton}
              data-nav-state={state}
              data-nav-scene={group.scene}
              aria-current={scene === group.scene ? "page" : undefined}
              aria-label={label}
              onPointerDown={stopPointer}
              onClick={(event) => handleClick(event, group.scene)}
              onKeyDown={(event) => handleKeyDown(event, group.scene)}
            >
              <span>{String(group.scene).padStart(2, "0")}</span>
              <strong>{group.tokens}</strong>
              <small>{copy.navLabel}</small>
            </button>
          );
        })}
      </div>
      <div className={styles.taxonomyTokens} aria-hidden="true">
        {NATURAL_CLOCKS_EVIDENCE.map((record) => (
          <span
            key={record.id}
            data-clock-taxonomy-token="true"
            data-clock-taxonomy-id={record.id}
          >
            {record.short}
          </span>
        ))}
      </div>
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
  const safeScene = clampScene(scene);
  const safeBeat = clampBeat(safeScene, beat);
  const settled = reducedMotion || isThumbnail;

  return (
    <section
      className={styles.root}
      data-topic-id="natural-clocks"
      data-motion={settled ? "off" : "on"}
      data-language={language}
    >
      <div className={styles.envelope}>
        <div className={styles.envelopeMark}>{language === "zh" ? "自然时钟" : "NATURAL CLOCKS"}</div>
        <div className={styles.envelopeRule} />
        <div className={styles.envelopeMark}>{language === "zh" ? "材料比较" : "MATERIAL COMPARISON"}</div>
      </div>
      <SpatialSceneTrack
        scene={safeScene}
        beat={safeBeat}
        transitionKind="crossfade"
        transitionMap={TRANSITION_MAP}
        transitionDurationMs={520}
        reducedMotion={settled}
        beatLayoutModes={BEAT_LAYOUT_MODES}
        className={styles.sceneTrack}
        renderScene={(sceneId, sceneBeat) => (
          <ScenePanel scene={sceneId} beat={sceneBeat} language={language} />
        )}
      />
      {!isThumbnail && (
        <TaxonomyNavigator
          scene={safeScene}
          language={language}
          onNavigate={onNavigate}
        />
      )}
    </section>
  );
}

const metadata = {
  en: buildMetadata("en"),
  zh: buildMetadata("zh"),
};

export default defineTopic({
  id: "natural-clocks",
  styleId: "benchmark-matrix",
  title: { en: "Natural Clocks", zh: "自然时钟" },
  modelId: "GPT 5.6 Sol",
  Stage: TopicStage,
  metadata,
  navigation: {
    geometry: "typographic-index",
    carrier: "clock-taxonomy-index",
    invocation: "auto-hide",
    feedback: "typographic-emphasis",
  },
  transitionScore: NATURAL_CLOCKS_TRANSITION_SCORE,
  evidence: {
    kind: "facts",
    sources: NATURAL_CLOCKS_SOURCES,
  },
});

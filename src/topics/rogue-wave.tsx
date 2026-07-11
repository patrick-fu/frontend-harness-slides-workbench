import { useEffect } from "react";
import type { CSSProperties, KeyboardEvent, MouseEvent, PointerEvent } from "react";
import type {
  Source,
} from "../domain/evidence";
import {
  defineTopic,
  type TopicMetadata,
  type TopicStageProps,
  type TopicTransitionScore,
} from "../domain/topic";
import SpatialSceneTrack from "../components/stage/SpatialSceneTrack";
import type {
  BeatLayoutMode,
  SceneTransitionMap,
} from "../components/stage/SpatialSceneTrack";
import styles from "./rogue-wave.module.css";

type Language = TopicStageProps["language"];
type SceneId = 1 | 2 | 3 | 4 | 5;

interface BeatCopy {
  action: string;
  title: string;
  body: string;
}

interface BaseSceneCopy {
  nav: string;
  navAria: string;
  section: string;
  kicker: string;
  headline: string;
  deck: string;
  beats: readonly BeatCopy[];
}

interface RogueWaveCopy {
  paperName: string;
  issueLine: string;
  folio: string;
  openClipping: string;
  sourceLabel: string;
  scenes: Record<SceneId, BaseSceneCopy>;
  front: {
    event: string;
    measuredLabel: string;
    measuredValue: string;
    seaLabel: string;
    seaValue: string;
    ratioLabel: string;
    ratioValue: string;
    recordLabel: string;
    recordBody: string;
    mapLabel: string;
    mapCaption: string;
    timeline: readonly [string, string, string];
  };
  measure: {
    instrumentTitle: string;
    instrumentBody: string;
    traceLabel: string;
    traceNote: string;
    definitionTitle: string;
    definitionBody: string;
    thresholdTitle: string;
    thresholdBody: string;
    denominator: string;
  };
  cutaway: {
    figureLabel: string;
    axisTime: string;
    axisHeight: string;
    layerLabels: readonly [string, string, string, string];
    layers: readonly [
      { title: string; body: string },
      { title: string; body: string },
      { title: string; body: string },
      { title: string; body: string },
    ];
    caveat: string;
  };
  mechanisms: {
    ledgerTitle: string;
    conditionTitle: string;
    evidenceTitle: string;
    rows: readonly [
      { name: string; condition: string; evidence: string },
      { name: string; condition: string; evidence: string },
      { name: string; condition: string; evidence: string },
      { name: string; condition: string; evidence: string },
    ];
    margin: string;
  };
  correction: {
    notice: string;
    knownTitle: string;
    unknownTitle: string;
    known: readonly [string, string, string];
    unknown: readonly [string, string, string];
    closing: string;
    desk: string;
  };
}

const SCENE_IDS = [1, 2, 3, 4, 5] as const;
const ROMAN = ["I", "II", "III", "IV", "V"] as const;
const BEAT_COUNTS: Record<SceneId, number> = {
  1: 1,
  2: 2,
  3: 4,
  4: 2,
  5: 1,
};

export const ROGUE_WAVE_TRANSITION_SCORE = {
  "1->2": "page-turn",
  "2->3": "hard-cut",
  "3->4": "crossfade",
  "4->5": "page-turn",
} as const satisfies TopicTransitionScore;

const TRANSITION_MAP: SceneTransitionMap = ROGUE_WAVE_TRANSITION_SCORE;

const BEAT_LAYOUT_MODES: Partial<Record<SceneId, BeatLayoutMode>> = {
  2: "reserved",
  3: "reserved",
  4: "reserved",
};

export interface RogueWaveSource extends Source {
  citation: string;
  boundary: string;
}

export const ROGUE_WAVE_SOURCES = [
  {
    authority: "NOAA National Data Buoy Center",
    title: "How significant wave height is calculated",
    citation:
      "NOAA NDBC. How are significant wave height, dominant period, average period, and wave steepness calculated?",
    url: "https://www.ndbc.noaa.gov/faq/wavecalc.shtml",
    supports:
      "Supports the denominator used on the measurement page: significant wave height is approximately the average trough-to-crest height of the highest one-third of waves and is estimated from the wave spectrum.",
    boundary:
      "This measurement note defines Hs; it does not itself define every rogue-wave screening convention or identify the mechanism behind a particular extreme crest.",
  },
  {
    authority: "American Meteorological Society",
    title: "Are Rogue Waves Really Unexpected?",
    citation:
      "Fedele, F. (2016). Are Rogue Waves Really Unexpected? Journal of Physical Oceanography, 46(5), 1495–1508. doi:10.1175/JPO-D-15-0137.1.",
    url: "https://doi.org/10.1175/JPO-D-15-0137.1",
    supports:
      "Supports the Draupner comparison printed on the front page: Hs 11.9 m, crest-to-trough height 25.6 m, crest 18.5 m, and H/Hs 2.15 for the recorded event.",
    boundary:
      "The ratios describe one instrument record and a statistical framing of rarity; they are not a universal forecast threshold or proof of one generating mechanism.",
  },
  {
    authority: "Scientific Reports",
    title: "Real world ocean rogue waves explained without the modulational instability",
    citation:
      "Fedele, F., Brennan, J., Ponce de León, S., Dudley, J. M., & Dias, F. (2016). Scientific Reports, 6, 27715. doi:10.1038/srep27715.",
    url: "https://doi.org/10.1038/srep27715",
    supports:
      "Supports presenting constructive interference and second-order bound nonlinearities as a sufficient explanation for several measured waves without requiring modulational instability in those cases.",
    boundary:
      "The paper argues that modulational instability was unnecessary for the records it analyzed; the slide does not generalize that result into a claim that nonlinear focusing never occurs.",
  },
  {
    authority: "Journal of Geophysical Research: Oceans",
    title: "The Draupner wave: A fresh look and the emerging view",
    citation:
      "Cavaleri, L. et al. (2016). The Draupner wave: A fresh look and the emerging view. JGR Oceans, 121. doi:10.1002/2016JC011649.",
    url: "https://doi.org/10.1002/2016JC011649",
    supports:
      "Supports the crossing-sea interpretation as a plausible part of the Draupner sea state and the broader claim that directional structure matters when evaluating extreme-wave likelihood.",
    boundary:
      "The directional sea state was reconstructed with a model rather than fully measured at the platform, so the clipping labels crossing seas as plausible, not proven.",
  },
  {
    authority: "Annual Review of Fluid Mechanics",
    title: "Oceanic Rogue Waves",
    citation:
      "Dysthe, K., Krogstad, H. E., & Müller, P. (2008). Oceanic Rogue Waves. Annual Review of Fluid Mechanics, 40, 287–310. doi:10.1146/annurev.fluid.40.111406.102203.",
    url: "https://doi.org/10.1146/annurev.fluid.40.111406.102203",
    supports:
      "Supports the multi-route mechanism ledger: dispersive and directional focusing, wave-current interaction, and nonlinear effects can each alter the tail of an extreme sea-state distribution.",
    boundary:
      "This is a synthesis of candidate mechanisms and observations, not a diagnostic that can assign a mechanism to one wave without directional spectra and local current measurements.",
  },
] as const satisfies readonly RogueWaveSource[];

const COPY: Record<Language, RogueWaveCopy> = {
  en: {
    paperName: "THE NORTH SEA RECORD",
    issueLine: "Evidence desk · instrument edition · 01 January 1995",
    folio: "Five clippings / one exceptional record",
    openClipping: "Open clipping",
    sourceLabel: "Source notes",
    scenes: {
      1: {
        nav: "front",
        navAria: "front page",
        section: "Front Page",
        kicker: "DRAUPNER E · NORTH SEA · INSTRUMENT RECORD",
        headline: "A wave outside the weather report",
        deck: "One measured crest-to-trough event stood more than twice as high as its sea-state reference. The ratio—not the adjective—made it rogue.",
        beats: [
          {
            action: "Open the complete evidence front page",
            title: "The Draupner record",
            body: "Place 25.6 m beside Hs 11.9 m before interpreting the event.",
          },
        ],
      },
      2: {
        nav: "measure",
        navAria: "measurement",
        section: "Measurement Desk",
        kicker: "WHAT WAS MEASURED / WHAT IT WAS COMPARED WITH",
        headline: "The denominator comes first",
        deck: "A large wave is not automatically a rogue wave. The instrument trace must be compared with the surrounding sea state.",
        beats: [
          {
            action: "Set the laser record and time trace",
            title: "The instrument",
            body: "A downward-looking laser tracked surface elevation at the platform.",
          },
          {
            action: "Reveal Hs and the common two-times screen in its reserved column",
            title: "The reference sea",
            body: "Hs summarizes the energetic background; H/Hs compares one wave with it.",
          },
        ],
      },
      3: {
        nav: "mechanisms",
        navAria: "mechanisms",
        section: "Cutaway",
        kicker: "HOW ORDINARY COMPONENTS CAN CONCENTRATE",
        headline: "Four layers, not one recipe",
        deck: "The diagram separates a measured outcome from candidate routes that can concentrate or sharpen wave energy.",
        beats: [
          {
            action: "Draw the component wave group",
            title: "Components",
            body: "A sea surface is the sum of many directions, periods, and phases.",
          },
          {
            action: "Align phases at one place and time",
            title: "Space-time focus",
            body: "Dispersive components can arrive together and interfere constructively.",
          },
          {
            action: "Add current refraction and crossing directions",
            title: "Sea-state geometry",
            body: "Currents and crossing systems can alter where energy gathers.",
          },
          {
            action: "Add nonlinear sharpening and the diagnostic boundary",
            title: "The limit",
            body: "Nonlinearity can sharpen a crest, but no single route explains every record.",
          },
        ],
      },
      4: {
        nav: "conditions",
        navAria: "conditions",
        section: "Mechanism Ledger",
        kicker: "CANDIDATE ROUTES / CONDITIONS / DISTINGUISHING EVIDENCE",
        headline: "A mechanism must earn its byline",
        deck: "Each route predicts different conditions. Without the corresponding observation, the label remains a hypothesis.",
        beats: [
          {
            action: "Print interference and dispersive focusing rows",
            title: "Routes in the wave field",
            body: "Phase alignment and focused groups need spectra and directional context.",
          },
          {
            action: "Print nonlinear and current rows with their evidence limits",
            title: "Routes with stricter conditions",
            body: "Narrowband nonlinearity and current refraction are conditional, not universal.",
          },
        ],
      },
      5: {
        nav: "correction",
        navAria: "correction",
        section: "Correction Box",
        kicker: "WHAT THE RECORD SHOWS / WHAT REMAINS OPEN",
        headline: "The myth is smaller than the measurement",
        deck: "The correction is not that every large wave has one hidden cause. It is that rare, measured extremes belong inside ocean physics.",
        beats: [
          {
            action: "Settle the known and not-yet-unified correction notice",
            title: "Correction to the folklore",
            body: "Keep the instrument record firm and the mechanism diagnosis bounded.",
          },
        ],
      },
    },
    front: {
      event: "Draupner E platform · North Sea · 1 January 1995",
      measuredLabel: "Single wave height",
      measuredValue: "25.6 m",
      seaLabel: "Significant wave height",
      seaValue: "11.9 m",
      ratioLabel: "Record / sea state",
      ratioValue: "H / Hs = 2.15",
      recordLabel: "Why the record matters",
      recordBody:
        "The platform instrument preserved the surface-elevation trace. A rare event became a number that could be tested against the surrounding storm sea.[2]",
      mapLabel: "North Sea evidence plate",
      mapCaption:
        "A location sketch, not a disaster image: platform, storm field, and measurement line.",
      timeline: [
        "Storm sea established the Hs reference",
        "One crest-to-trough trace reached 25.6 m",
        "The ratio crossed a common H > 2Hs screen",
      ],
    },
    measure: {
      instrumentTitle: "Laser → surface elevation → time series",
      instrumentBody:
        "A downward-looking laser rangefinder sampled the sea surface at the structure. The trace records elevation through time; wave height is measured trough to crest.[2]",
      traceLabel: "SURFACE ELEVATION / SCHEMATIC",
      traceNote: "One event is read inside a longer record—not cropped away from its neighbors.",
      definitionTitle: "Hs is the sea-state reference",
      definitionBody:
        "NOAA describes significant wave height as approximately the average height of the highest one-third of waves, estimated from the spectrum.[1]",
      thresholdTitle: "The common screen is relative",
      thresholdBody:
        "Ocean engineering commonly flags H/Hs > 2. Draupner: 25.6 / 11.9 = 2.15. A ratio identifies an extreme; it does not identify its cause.[2]",
      denominator:
        "A forecast saying “12 m seas” describes a distribution. It does not say every wave is 12 m.",
    },
    cutaway: {
      figureLabel: "FIG. 3 · CONCEPTUAL WAVE-FIELD CUTAWAY",
      axisTime: "place / time",
      axisHeight: "surface elevation",
      layerLabels: ["components", "phase focus", "current / crossing", "nonlinear crest"],
      layers: [
        {
          title: "01 · Many components",
          body: "Directions, periods, and phases coexist. Their linear sum is the baseline—not the only possible mechanism.",
        },
        {
          title: "02 · Space-time focus",
          body: "Dispersive components can align briefly. Constructive interference concentrates amplitude at one place and time.[3]",
        },
        {
          title: "03 · Geometry changes",
          body: "Crossing systems or opposing and varying currents can redirect and compress parts of a wave field.[4][5]",
        },
        {
          title: "04 · A crest may sharpen",
          body: "Bound nonlinearities can increase crest asymmetry. Modulational instability requires particular sea-state conditions and is not necessary in every record.[3][5]",
        },
      ],
      caveat:
        "No single recipe fits every record. Directional spectra and local currents decide which explanations are plausible.",
    },
    mechanisms: {
      ledgerTitle: "Candidate route",
      conditionTitle: "When it is plausible",
      evidenceTitle: "What would distinguish it",
      rows: [
        {
          name: "Constructive interference",
          condition: "Components happen to align in phase at one place and time.",
          evidence: "Local time series plus a spectrum consistent with the reconstructed group.",
        },
        {
          name: "Dispersive / directional focus",
          condition: "Different periods or directions converge through wave-field geometry.",
          evidence: "Directional spectra or a spatial surface measurement—not one point alone.",
        },
        {
          name: "Nonlinear focusing or sharpening",
          condition: "Sufficient steepness and, for modulational instability, restricted bandwidth and directionality.",
          evidence: "Phase-resolved evolution and statistics beyond a linear or second-order account.",
        },
        {
          name: "Wave–current / crossing-sea effect",
          condition: "Current gradients oppose or refract waves; distinct systems intersect.",
          evidence: "Co-located current field and directional wave observations.[4][5]",
        },
      ],
      margin:
        "Draupner's directional field was partly reconstructed, so “crossing sea” remains a supported interpretation—not a witness statement.[4]",
    },
    correction: {
      notice: "CORRECTION TO THE FOLKLORE",
      knownTitle: "WHAT THE RECORD SHOWS",
      unknownTitle: "NOT YET UNIFIED",
      known: [
        "Instrument records contain waves more than twice their sea-state reference.",
        "Draupner's 25.6 m event occurred in Hs 11.9 m seas: H/Hs 2.15.[2]",
        "Several physical routes can concentrate or sharpen wave energy.[3][5]",
      ],
      unknown: [
        "One universal generating mechanism for every event.",
        "A mechanism diagnosis from wave height alone.",
        "Exact event-by-event prediction without the evolving directional field and currents.",
      ],
      closing: "A measurement problem before it is a myth.",
      desk: "Evidence desk · terms corrected · mechanism left conditional",
    },
  },
  zh: {
    paperName: "北海实录",
    issueLine: "证据编辑台 · 仪器记录版 · 1995年1月1日",
    folio: "五张剪页 / 一次异常记录",
    openClipping: "打开剪页",
    sourceLabel: "来源注记",
    scenes: {
      1: {
        nav: "头版",
        navAria: "头版",
        section: "头版",
        kicker: "DRAUPNER E · 北海 · 仪器记录",
        headline: "天气预报之外的一道浪",
        deck: "一次实测峰谷波高超过海况基准的两倍。让它成为怪浪的是比值，而不是形容词。",
        beats: [
          {
            action: "打开完整证据头版",
            title: "Draupner记录",
            body: "先把25.6米与11.9米有效波高并置，再解释事件。",
          },
        ],
      },
      2: {
        nav: "测量",
        navAria: "测量",
        section: "测量台",
        kicker: "测到了什么 / 与什么比较",
        headline: "先看分母",
        deck: "大浪不自动等于怪浪。仪器曲线必须与周围海况比较。",
        beats: [
          {
            action: "落位激光测量与时间曲线",
            title: "仪器",
            body: "朝下的激光测距仪在平台处追踪海面高度。",
          },
          {
            action: "在预留栏中揭示Hs与两倍筛选线",
            title: "参照海况",
            body: "Hs概括高能海况；H/Hs把单个波与它比较。",
          },
        ],
      },
      3: {
        nav: "机制",
        navAria: "机制",
        section: "剖面",
        kicker: "普通波分量如何集中",
        headline: "四层解释，不是一份配方",
        deck: "图中把实测结果与可能集中或锐化波能的路径分开。",
        beats: [
          {
            action: "绘出波群分量",
            title: "分量",
            body: "海面由多个方向、周期和相位共同组成。",
          },
          {
            action: "让相位在一个时空点对齐",
            title: "时空聚焦",
            body: "色散分量可同时抵达并发生相长干涉。",
          },
          {
            action: "加入流场折射与交叉波向",
            title: "海况几何",
            body: "海流与交叉波系会改变能量汇聚的位置。",
          },
          {
            action: "加入非线性锐化与诊断边界",
            title: "边界",
            body: "非线性可使波峰更尖，但没有一条路径解释全部记录。",
          },
        ],
      },
      4: {
        nav: "条件",
        navAria: "条件",
        section: "机制账页",
        kicker: "候选路径 / 适用条件 / 区分证据",
        headline: "机制也要凭证署名",
        deck: "不同路径要求不同条件。缺少相应观测时，标签仍是假设。",
        beats: [
          {
            action: "印出相长干涉与色散聚焦两行",
            title: "波场内部路径",
            body: "相位对齐与波群聚焦都需要频谱和方向背景。",
          },
          {
            action: "印出非线性与海流两行及证据边界",
            title: "条件更严格的路径",
            body: "窄带非线性与海流折射是条件性解释，不是万能答案。",
          },
        ],
      },
      5: {
        nav: "更正",
        navAria: "更正",
        section: "更正栏",
        kicker: "记录证明什么 / 仍未统一什么",
        headline: "传说比测量更小",
        deck: "更正不是每一道大浪都有同一个隐秘原因，而是罕见的实测极值属于海洋物理。",
        beats: [
          {
            action: "落定已知与尚未统一的更正告示",
            title: "给传说的更正",
            body: "稳固仪器记录，同时给机制诊断保留边界。",
          },
        ],
      },
    },
    front: {
      event: "Draupner E平台 · 北海 · 1995年1月1日",
      measuredLabel: "单个峰谷波高",
      measuredValue: "25.6 米",
      seaLabel: "有效波高",
      seaValue: "11.9 米",
      ratioLabel: "记录 / 海况",
      ratioValue: "H / Hs = 2.15",
      recordLabel: "这份记录为什么重要",
      recordBody:
        "平台仪器保存了海面高度曲线。一次罕见事件因此成为可与周围风暴海况比较的数字。[2]",
      mapLabel: "北海证据图版",
      mapCaption: "这是一张位置示意，不是灾难图片：平台、风暴场与测量线。",
      timeline: [
        "风暴海况建立Hs参照",
        "一次峰谷曲线达到25.6米",
        "比值越过常用H > 2Hs筛选线",
      ],
    },
    measure: {
      instrumentTitle: "激光 → 海面高度 → 时间序列",
      instrumentBody:
        "朝下的激光测距仪在结构处采样海面。曲线记录高度随时间的变化；波高从波谷量到波峰。[2]",
      traceLabel: "海面高度 / 示意曲线",
      traceNote: "一个事件要放回更长的记录中读，不能把相邻波裁掉。",
      definitionTitle: "Hs是海况参照",
      definitionBody:
        "NOAA把有效波高描述为最高三分之一波高的近似平均值，并由波谱估计。[1]",
      thresholdTitle: "常用筛选线是相对值",
      thresholdBody:
        "海洋工程常用H/Hs > 2筛选极端波。Draupner：25.6 / 11.9 = 2.15。比值识别极端，不识别成因。[2]",
      denominator: "“12米海况”描述一个分布，并不意味着每一道波都是12米。",
    },
    cutaway: {
      figureLabel: "图3 · 波场概念剖面",
      axisTime: "位置 / 时间",
      axisHeight: "海面高度",
      layerLabels: ["波分量", "相位聚焦", "海流 / 交叉波", "非线性波峰"],
      layers: [
        {
          title: "01 · 多个分量",
          body: "方向、周期与相位同时存在。线性叠加是基线，但不是唯一可能机制。",
        },
        {
          title: "02 · 时空聚焦",
          body: "色散分量可短暂对齐；相长干涉把振幅集中到一个时空点。[3]",
        },
        {
          title: "03 · 几何改变",
          body: "交叉波系、逆流或变化海流会重定向并压缩部分波场。[4][5]",
        },
        {
          title: "04 · 波峰可能锐化",
          body: "束缚非线性会提高波峰不对称性。调制不稳定需要特定海况，也不是每份记录都必须依赖它。[3][5]",
        },
      ],
      caveat: "没有一份配方适合所有记录。方向谱与局地海流决定哪些解释成立。",
    },
    mechanisms: {
      ledgerTitle: "候选路径",
      conditionTitle: "何时可能成立",
      evidenceTitle: "什么证据能区分",
      rows: [
        {
          name: "相长干涉",
          condition: "多个分量恰好在一个时空点同相。",
          evidence: "局地时间序列，以及与重构波群一致的频谱。",
        },
        {
          name: "色散 / 方向聚焦",
          condition: "不同周期或方向通过波场几何汇聚。",
          evidence: "方向谱或空间海面测量，单点记录不够。",
        },
        {
          name: "非线性聚焦或锐化",
          condition: "足够陡峭；调制不稳定还要求受限的带宽与方向扩散。",
          evidence: "相位分辨演化，以及超出线性或二阶解释的统计。",
        },
        {
          name: "波流 / 交叉海况效应",
          condition: "海流梯度逆向或折射波；不同波系相交。",
          evidence: "同址海流场与方向波浪观测。[4][5]",
        },
      ],
      margin:
        "Draupner的方向场有一部分来自重构，因此“交叉海况”是有依据的解释，不是现场证词。[4]",
    },
    correction: {
      notice: "给传说的更正",
      knownTitle: "记录已经证明",
      unknownTitle: "尚未统一",
      known: [
        "仪器记录中存在超过海况参照两倍的波。",
        "Draupner的25.6米事件发生在Hs 11.9米海况中：H/Hs为2.15。[2]",
        "多条物理路径都可能集中或锐化波能。[3][5]",
      ],
      unknown: [
        "适用于每次事件的唯一生成机制。",
        "只凭波高就完成机制诊断。",
        "缺少演化方向场与海流时的逐事件精确预测。",
      ],
      closing: "它首先是测量问题，然后才是传说。",
      desk: "证据编辑台 · 术语已更正 · 机制仍保持条件性",
    },
  },
};

function useFonts() {
  useEffect(() => {
    const id = "rogue-wave-broadsheet-fonts";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Libre+Baskerville:wght@400;700&family=Libre+Caslon+Text:wght@400;700&family=Noto+Serif+SC:wght@400;600;700;900&display=swap";
    document.head.appendChild(link);
  }, []);
}

function normalizeScene(scene: number): SceneId {
  if (scene <= 1) return 1;
  if (scene >= 5) return 5;
  return scene as SceneId;
}

function clampBeat(scene: SceneId, beat: number): number {
  return Math.max(0, Math.min(BEAT_COUNTS[scene] - 1, beat));
}

function PaperHeader({ copy, sceneId }: { copy: RogueWaveCopy; sceneId: SceneId }) {
  return (
    <header className={styles.paperHeader} data-beat-layout-item="true">
      <div className={styles.issueLine}>
        <span>{copy.issueLine}</span>
        <span>{copy.folio}</span>
      </div>
      <div className={styles.nameplateRow}>
        <span className={styles.nameplateRule} />
        <p className={styles.nameplate}>{copy.paperName}</p>
        <span className={styles.nameplateRule} />
      </div>
      <div className={styles.sectionLine}>
        <span>{copy.scenes[sceneId].section}</span>
        <span>NO. {String(sceneId).padStart(2, "0")}</span>
      </div>
    </header>
  );
}

function NorthSeaPlate({ copy }: { copy: RogueWaveCopy["front"] }) {
  return (
    <figure className={styles.mapPlate} aria-label={copy.mapLabel}>
      <svg viewBox="0 0 520 350" role="img" aria-label={copy.mapLabel}>
        <defs>
          <pattern id="rogue-wave-halftone" width="8" height="8" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.1" fill="currentColor" opacity="0.28" />
          </pattern>
        </defs>
        <rect x="1" y="1" width="518" height="348" fill="url(#rogue-wave-halftone)" stroke="currentColor" />
        <path d="M65 25 L96 48 112 92 94 133 122 166 110 229 77 278 38 322" fill="none" stroke="currentColor" strokeWidth="4" />
        <path d="M420 18 L392 60 403 93 374 124 387 155 349 191 363 232 330 270 337 333" fill="none" stroke="currentColor" strokeWidth="4" />
        <path d="M130 95 C190 56 258 55 329 91 M126 141 C203 104 270 112 348 150 M118 196 C188 168 274 174 360 212 M113 250 C205 220 274 235 345 274" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="9 8" opacity="0.65" />
        <path d="M235 304 C256 264 256 218 259 170 C261 125 267 85 291 49" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray="14 8" />
        <circle cx="258" cy="170" r="14" fill="#f2ead8" stroke="currentColor" strokeWidth="4" />
        <path d="M258 149 V117 M242 117 H274 M249 117 L242 133 M267 117 L274 133" fill="none" stroke="currentColor" strokeWidth="4" />
        <path d="M286 163 H448" stroke="currentColor" strokeWidth="2" />
        <text x="300" y="153" fontSize="18" fontWeight="700" fill="currentColor">DRAUPNER E</text>
        <text x="301" y="181" fontSize="14" fill="currentColor">NORTH SEA · PLATFORM E</text>
        <path d="M151 302 C177 287 203 287 229 302 C255 317 282 317 308 302 C334 287 361 287 387 302" fill="none" stroke="currentColor" strokeWidth="5" />
      </svg>
      <figcaption>
        <strong>{copy.mapLabel}</strong>
        <span>{copy.mapCaption}</span>
      </figcaption>
    </figure>
  );
}

function SurfaceTrace({ copy }: { copy: RogueWaveCopy["measure"] }) {
  return (
    <figure className={styles.traceFigure} aria-label={copy.traceLabel}>
      <div className={styles.instrumentSketch}>
        <svg viewBox="0 0 720 360" role="img" aria-label={copy.traceLabel}>
          <path d="M88 30 H270 V116 H88 Z M112 116 L95 198 M246 116 L263 198" fill="none" stroke="currentColor" strokeWidth="5" />
          <rect x="154" y="54" width="50" height="46" fill="none" stroke="currentColor" strokeWidth="4" />
          <path d="M179 100 V231" stroke="currentColor" strokeWidth="3" strokeDasharray="10 8" />
          <path d="M20 255 C52 239 85 239 118 255 C151 271 184 271 217 255 C250 239 283 239 316 255" fill="none" stroke="currentColor" strokeWidth="5" />
          <path d="M350 180 H704 M350 288 H704" stroke="currentColor" strokeWidth="2" opacity="0.45" />
          <path d="M350 237 C374 219 395 219 418 237 C440 255 462 256 485 234 C507 212 523 215 542 237 C558 256 568 254 583 202 C597 151 609 74 629 199 C643 269 661 260 680 236 C692 220 699 221 704 225" fill="none" stroke="currentColor" strokeWidth="5" />
          <path d="M629 74 V288" stroke="currentColor" strokeWidth="2" strokeDasharray="7 7" />
          <text x="576" y="52" fontSize="18" fontWeight="700" fill="currentColor">ONE EVENT</text>
          <text x="350" y="320" fontSize="15" fill="currentColor">NEIGHBORING WAVES RETAINED</text>
        </svg>
      </div>
      <figcaption>
        <strong>{copy.traceLabel}</strong>
        <span>{copy.traceNote}</span>
      </figcaption>
    </figure>
  );
}

function WaveCutaway({
  copy,
  beat,
}: {
  copy: RogueWaveCopy["cutaway"];
  beat: number;
}) {
  return (
    <figure className={styles.cutawayFigure} aria-label={copy.figureLabel}>
      <div className={styles.figureHeading}>
        <strong>{copy.figureLabel}</strong>
        <span>{copy.axisTime}</span>
      </div>
      <svg viewBox="0 0 1280 440" role="img" aria-label={copy.figureLabel}>
        <path d="M60 370 H1230 M86 394 V45" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.48" />
        <text x="18" y="60" fontSize="16" fill="currentColor" transform="rotate(-90 18 60)">{copy.axisHeight}</text>
        <g data-revealed={beat >= 0 ? "true" : "false"} className={styles.figureLayer}>
          <path d="M90 305 C145 266 192 269 246 305 C299 341 350 342 405 304 C460 266 511 268 565 304 C620 340 672 342 728 304 C784 266 834 270 890 306 C945 342 998 340 1052 303 C1104 268 1157 270 1215 306" fill="none" stroke="currentColor" strokeWidth="3" opacity="0.35" />
          <path d="M90 292 C133 317 175 316 217 291 C261 265 304 265 347 292 C391 319 434 317 478 292 C522 267 565 267 609 292 C653 317 696 316 740 290 C784 265 827 266 871 292 C915 318 958 318 1002 291 C1046 265 1091 266 1136 293 C1165 310 1192 312 1215 299" fill="none" stroke="currentColor" strokeWidth="3" opacity="0.35" strokeDasharray="11 8" />
          <text x="105" y="345" fontSize="16" fill="currentColor">{copy.layerLabels[0]}</text>
        </g>
        <g data-revealed={beat >= 1 ? "true" : "false"} className={styles.figureLayer}>
          <path d="M90 318 C310 315 420 304 512 275 C583 253 615 204 640 115 C665 204 697 253 768 275 C860 304 970 315 1215 318" fill="none" stroke="currentColor" strokeWidth="6" />
          <path d="M475 275 C548 246 605 193 640 115 C675 193 732 246 805 275" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="8 7" />
          <path d="M640 82 V342" stroke="currentColor" strokeWidth="2" strokeDasharray="6 7" />
          <text x="655" y="105" fontSize="16" fontWeight="700" fill="currentColor">{copy.layerLabels[1]}</text>
        </g>
        <g data-revealed={beat >= 2 ? "true" : "false"} className={styles.figureLayer}>
          <path d="M202 100 C358 138 500 180 619 264 M1080 104 C928 139 788 183 661 264" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray="16 9" />
          <path d="M235 93 L202 100 224 127 M1047 93 L1080 104 1055 128" fill="none" stroke="currentColor" strokeWidth="3" />
          <path d="M320 360 C398 330 469 334 537 361 M752 361 C821 331 893 331 970 361" fill="none" stroke="currentColor" strokeWidth="8" opacity="0.56" />
          <text x="902" y="80" fontSize="16" fontWeight="700" fill="currentColor">{copy.layerLabels[2]}</text>
        </g>
        <g data-revealed={beat >= 3 ? "true" : "false"} className={styles.figureLayer}>
          <path d="M603 194 C616 152 627 106 640 52 C653 106 664 152 677 194" fill="none" stroke="currentColor" strokeWidth="8" />
          <path d="M574 51 H707 M574 43 V59 M707 43 V59" fill="none" stroke="currentColor" strokeWidth="2" />
          <text x="720" y="53" fontSize="16" fontWeight="700" fill="currentColor">{copy.layerLabels[3]}</text>
        </g>
      </svg>
    </figure>
  );
}

function SceneOne({ copy }: { copy: RogueWaveCopy }) {
  const scene = copy.scenes[1];
  return (
    <article className={styles.page} data-composition="front-page-evidence">
      <PaperHeader copy={copy} sceneId={1} />
      <section className={styles.frontLead} data-beat-layout-item="true">
        <p className={styles.kicker}>{scene.kicker}</p>
        <h1 className={styles.frontHeadline}>{scene.headline}</h1>
        <p className={styles.deck}>{scene.deck}</p>
        <p className={styles.byline}>{copy.front.event}</p>
      </section>
      <NorthSeaPlate copy={copy.front} />
      <section className={styles.frontStats} data-beat-layout-item="true">
        <div>
          <span>{copy.front.measuredLabel}</span>
          <strong>{copy.front.measuredValue}</strong>
        </div>
        <div>
          <span>{copy.front.seaLabel}</span>
          <strong>{copy.front.seaValue}</strong>
        </div>
        <div>
          <span>{copy.front.ratioLabel}</span>
          <strong>{copy.front.ratioValue}</strong>
        </div>
      </section>
      <section className={styles.frontRecord} data-beat-layout-item="true">
        <h2>{copy.front.recordLabel}</h2>
        <p>{copy.front.recordBody}</p>
      </section>
      <ol className={styles.timeline} data-beat-layout-item="true">
        {copy.front.timeline.map((item, index) => (
          <li key={item}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <p>{item}</p>
          </li>
        ))}
      </ol>
    </article>
  );
}

function SceneTwo({ copy, beat }: { copy: RogueWaveCopy; beat: number }) {
  const scene = copy.scenes[2];
  const revealDefinition = beat >= 1;
  return (
    <article className={styles.page} data-composition="instrument-definition-columns">
      <PaperHeader copy={copy} sceneId={2} />
      <section className={styles.compactLead} data-beat-layout-item="true">
        <div>
          <p className={styles.kicker}>{scene.kicker}</p>
          <h1>{scene.headline}</h1>
        </div>
        <p className={styles.deck}>{scene.deck}</p>
      </section>
      <section className={styles.measureGrid} data-beat-layout-item="true">
        <div className={styles.instrumentColumn} data-revealed="true">
          <h2>{copy.measure.instrumentTitle}</h2>
          <p>{copy.measure.instrumentBody}</p>
          <SurfaceTrace copy={copy.measure} />
        </div>
        <div
          className={styles.definitionColumn}
          data-revealed={revealDefinition ? "true" : "false"}
          aria-hidden={revealDefinition ? undefined : true}
        >
          <div>
            <p className={styles.columnNumber}>01</p>
            <h2>{copy.measure.definitionTitle}</h2>
            <p>{copy.measure.definitionBody}</p>
          </div>
          <div>
            <p className={styles.columnNumber}>02</p>
            <h2>{copy.measure.thresholdTitle}</h2>
            <p>{copy.measure.thresholdBody}</p>
          </div>
          <blockquote>{copy.measure.denominator}</blockquote>
        </div>
      </section>
      <SourceRail copy={copy} refs="[1] NOAA NDBC · [2] Fedele 2016" />
    </article>
  );
}

function SceneThree({ copy, beat }: { copy: RogueWaveCopy; beat: number }) {
  const scene = copy.scenes[3];
  return (
    <article className={styles.page} data-composition="cross-column-wave-cutaway">
      <PaperHeader copy={copy} sceneId={3} />
      <section className={styles.compactLead} data-beat-layout-item="true">
        <div>
          <p className={styles.kicker}>{scene.kicker}</p>
          <h1>{scene.headline}</h1>
        </div>
        <p className={styles.deck}>{scene.deck}</p>
      </section>
      <WaveCutaway copy={copy.cutaway} beat={beat} />
      <section className={styles.layerNotes} data-beat-layout-item="true">
        {copy.cutaway.layers.map((layer, index) => {
          const revealed = beat >= index;
          return (
            <div
              key={layer.title}
              data-revealed={revealed ? "true" : "false"}
              aria-hidden={revealed ? undefined : true}
            >
              <h2>{layer.title}</h2>
              <p>{layer.body}</p>
            </div>
          );
        })}
      </section>
      <p
        className={styles.cutawayCaveat}
        data-beat-layout-item="true"
        data-revealed={beat >= 3 ? "true" : "false"}
        aria-hidden={beat >= 3 ? undefined : true}
      >
        {copy.cutaway.caveat}
      </p>
    </article>
  );
}

function MechanismMark({ index }: { index: number }) {
  if (index === 0) {
    return (
      <svg viewBox="0 0 120 60" aria-hidden="true">
        <path d="M2 38 C20 15 38 15 58 38 C78 59 97 57 118 32 M2 24 C22 44 42 46 61 25 C80 4 99 7 118 27" fill="none" stroke="currentColor" strokeWidth="4" />
      </svg>
    );
  }
  if (index === 1) {
    return (
      <svg viewBox="0 0 120 60" aria-hidden="true">
        <path d="M4 45 C34 45 47 39 59 9 C71 39 84 45 116 45" fill="none" stroke="currentColor" strokeWidth="4" />
      </svg>
    );
  }
  if (index === 2) {
    return (
      <svg viewBox="0 0 120 60" aria-hidden="true">
        <path d="M4 48 C29 47 45 40 58 10 C71 40 87 47 116 48 M42 11 H76" fill="none" stroke="currentColor" strokeWidth="4" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 120 60" aria-hidden="true">
      <path d="M4 42 C25 24 46 25 65 42 C84 57 101 52 116 38 M13 9 L46 25 M107 9 L74 26" fill="none" stroke="currentColor" strokeWidth="4" />
    </svg>
  );
}

function SceneFour({ copy, beat }: { copy: RogueWaveCopy; beat: number }) {
  const scene = copy.scenes[4];
  return (
    <article className={styles.page} data-composition="conditional-mechanism-ledger">
      <PaperHeader copy={copy} sceneId={4} />
      <section className={styles.compactLead} data-beat-layout-item="true">
        <div>
          <p className={styles.kicker}>{scene.kicker}</p>
          <h1>{scene.headline}</h1>
        </div>
        <p className={styles.deck}>{scene.deck}</p>
      </section>
      <section className={styles.mechanismLedger} data-beat-layout-item="true">
        <header>
          <span>{copy.mechanisms.ledgerTitle}</span>
          <span>{copy.mechanisms.conditionTitle}</span>
          <span>{copy.mechanisms.evidenceTitle}</span>
        </header>
        {copy.mechanisms.rows.map((row, index) => {
          const revealed = index < 2 || beat >= 1;
          return (
            <div
              className={styles.ledgerRow}
              key={row.name}
              data-revealed={revealed ? "true" : "false"}
              aria-hidden={revealed ? undefined : true}
            >
              <div className={styles.mechanismName}>
                <MechanismMark index={index} />
                <h2>{row.name}</h2>
              </div>
              <p>{row.condition}</p>
              <p>{row.evidence}</p>
            </div>
          );
        })}
      </section>
      <aside
        className={styles.marginNote}
        data-beat-layout-item="true"
        data-revealed={beat >= 1 ? "true" : "false"}
        aria-hidden={beat >= 1 ? undefined : true}
      >
        {copy.mechanisms.margin}
      </aside>
    </article>
  );
}

function SceneFive({ copy }: { copy: RogueWaveCopy }) {
  const scene = copy.scenes[5];
  return (
    <article className={styles.page} data-composition="correction-notice">
      <PaperHeader copy={copy} sceneId={5} />
      <section className={styles.correctionLead} data-beat-layout-item="true">
        <p className={styles.kicker}>{scene.kicker}</p>
        <h1>{scene.headline}</h1>
        <p className={styles.deck}>{scene.deck}</p>
      </section>
      <section className={styles.correctionBox} data-beat-layout-item="true">
        <p className={styles.correctionNotice}>{copy.correction.notice}</p>
        <div className={styles.correctionColumns}>
          <div>
            <h2>{copy.correction.knownTitle}</h2>
            <ul>
              {copy.correction.known.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <h2>{copy.correction.unknownTitle}</h2>
            <ul>
              {copy.correction.unknown.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
        <blockquote>{copy.correction.closing}</blockquote>
        <p className={styles.correctionDesk}>{copy.correction.desk}</p>
      </section>
    </article>
  );
}

function SourceRail({ copy, refs }: { copy: RogueWaveCopy; refs: string }) {
  return (
    <footer className={styles.sourceRail} data-beat-layout-item="true">
      <span>{copy.sourceLabel}</span>
      <p>{refs}</p>
    </footer>
  );
}

function ScenePage({
  sceneId,
  beat,
  language,
}: {
  sceneId: SceneId;
  beat: number;
  language: Language;
}) {
  const copy = COPY[language];
  if (sceneId === 1) return <SceneOne copy={copy} />;
  if (sceneId === 2) return <SceneTwo copy={copy} beat={beat} />;
  if (sceneId === 3) return <SceneThree copy={copy} beat={beat} />;
  if (sceneId === 4) return <SceneFour copy={copy} beat={beat} />;
  return <SceneFive copy={copy} />;
}

function ClippingDeck({
  copy,
  scene,
  onNavigate,
}: {
  copy: RogueWaveCopy;
  scene: SceneId;
  onNavigate?: TopicStageProps["onNavigate"];
}) {
  const navigate = (target: SceneId) => onNavigate?.(target, 0);

  const handlePointerDown = (event: PointerEvent<HTMLButtonElement>) => {
    event.stopPropagation();
  };

  const handleClick = (event: MouseEvent<HTMLButtonElement>, target: SceneId) => {
    event.stopPropagation();
    navigate(target);
  };

  const handleKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    current: SceneId,
  ) => {
    let target: SceneId | null = null;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      target = Math.min(5, current + 1) as SceneId;
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      target = Math.max(1, current - 1) as SceneId;
    } else if (event.key === "Home") {
      target = 1;
    } else if (event.key === "End") {
      target = 5;
    }
    if (target === null) return;
    event.preventDefault();
    event.stopPropagation();
    navigate(target);
  };

  return (
    <nav
      className={styles.clippingDeck}
      aria-label={copy.folio}
      data-topic-navigation="true"
      data-navigation-geometry="card-miniature"
      data-navigation-carrier="wavefront-clipping-deck"
      data-navigation-invocation="persistent"
      data-navigation-feedback="geometry-reflow"
    >
      <p className={styles.deckSpine}>CLIPPINGS</p>
      {SCENE_IDS.map((sceneId, index) => {
        const isCurrent = sceneId === scene;
        const sceneCopy = copy.scenes[sceneId];
        return (
          <button
            key={sceneId}
            type="button"
            className={isCurrent ? styles.activeClipping : undefined}
            aria-current={isCurrent ? "page" : undefined}
            aria-label={`${copy.openClipping} ${sceneId}: ${sceneCopy.navAria}`}
            onPointerDown={handlePointerDown}
            onClick={(event) => handleClick(event, sceneId)}
            onKeyDown={(event) => handleKeyDown(event, sceneId)}
            style={{ "--clip-tilt": `${(index - 2) * 0.35}deg` } as CSSProperties}
          >
            <span className={styles.clipFolio}>{ROMAN[index]}</span>
            <span className={styles.clipLines} aria-hidden="true">
              <i />
              <i />
              <i />
              <i />
            </span>
            <span className={styles.clipWave} aria-hidden="true" />
            <span className={styles.clipLabel}>{sceneCopy.nav}</span>
          </button>
        );
      })}
    </nav>
  );
}

function buildMetadata(language: Language): TopicMetadata {
  const copy = COPY[language];
  return {
    theme: language === "zh" ? "怪浪档案" : "The Rogue Wave File",
    densityLabel: language === "zh" ? "高密阅读" : "Dense Reading",
    heroScene: 3,
    colors: {
      bg: "#f2ead8",
      ink: "#171814",
      panel: "#ded4bd",
    },
    typography: {
      header: "Libre Caslon Text 700",
      body: "Libre Baskerville 400",
    },
    tags: [
      "editorial",
      "broadsheet",
      "newspaper",
      "reading-first",
      "oceanography",
      "evidence",
      "line-diagram",
      "low-motion",
    ],
    fonts: ["Libre Caslon Text", "Libre Baskerville", "cjk:Noto Serif SC"],
    scenes: SCENE_IDS.map((sceneId) => ({
      id: sceneId,
      title: copy.scenes[sceneId].section,
      beats: copy.scenes[sceneId].beats.map((beatCopy, beatId) => ({
        id: beatId,
        action: beatCopy.action,
        title: beatCopy.title,
        body: beatCopy.body,
      })),
    })),
  };
}

const METADATA = {
  en: buildMetadata("en"),
  zh: buildMetadata("zh"),
};

function TopicStage({
  scene,
  beat,
  language,
  isThumbnail,
  reducedMotion,
  onNavigate,
}: TopicStageProps) {
  useFonts();
  const activeScene = normalizeScene(scene);
  const motionDisabled = reducedMotion || isThumbnail;
  const safeBeat = clampBeat(activeScene, beat);
  const copy = COPY[language];

  return (
    <div
      className={[
        styles.root,
        language === "zh" ? styles.langZh : styles.langEn,
        motionDisabled ? styles.motionOff : "",
        isThumbnail ? styles.thumbnail : "",
      ]
        .filter(Boolean)
        .join(" ")}
      data-topic-id="rogue-wave"
      data-motion={motionDisabled ? "off" : "restrained"}
    >
      <SpatialSceneTrack
        className={styles.track}
        scene={activeScene}
        beat={safeBeat}
        transitionKind="hard-cut"
        transitionMap={TRANSITION_MAP}
        transitionDurationMs={720}
        reducedMotion={motionDisabled}
        beatLayoutModes={BEAT_LAYOUT_MODES}
        renderScene={(sceneId, sceneBeat) => (
          <div className={styles.sceneLayer} data-scene-content={sceneId}>
            <ScenePage
              sceneId={normalizeScene(sceneId)}
              beat={sceneBeat}
              language={language}
            />
          </div>
        )}
      />
      {!isThumbnail && (
        <ClippingDeck copy={copy} scene={activeScene} onNavigate={onNavigate} />
      )}
    </div>
  );
}

export default defineTopic({
  id: "rogue-wave",
  styleId: "front-page-broadsheet",
  title: { en: "Rogue Wave", zh: "怪浪" },
  modelId: "GPT 5.6 Sol",
  Stage: TopicStage,
  metadata: METADATA,
  navigation: {
    geometry: "card-miniature",
    carrier: "wavefront-clipping-deck",
    invocation: "persistent",
    feedback: "geometry-reflow",
  },
  transitionScore: ROGUE_WAVE_TRANSITION_SCORE,
  evidence: {
    kind: "facts",
    sources: ROGUE_WAVE_SOURCES,
  },
});

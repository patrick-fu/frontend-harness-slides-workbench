import { useState, type KeyboardEvent, type MouseEvent } from "react";
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
import styles from "./42-impact-evidence.module.css";

type Language = "en" | "zh";
type SceneId = 1 | 2 | 3 | 4 | 5;
type SourceId = "S1" | "S2" | "S3" | "S4" | "S5" | "S6";

interface BeatCopy {
  id: number;
  action: string;
  title: string;
  body: string;
}

interface SceneCopy {
  tab: string;
  eyebrow: string;
  title: string;
  deck: string;
  beats: BeatCopy[];
}

interface LocalizedCopy {
  memo: string;
  subject: string;
  scope: string;
  record: string;
  scenes: Record<SceneId, SceneCopy>;
  question: {
    prompt: string;
    boundary: string;
    frames: Array<{ label: string; text: string }>;
    test: string;
  };
  table: {
    headers: [string, string, string, string];
    rows: Array<{
      place: string;
      archive: string;
      signal: string;
      reading: string;
    }>;
    layerLabel: string;
    upper: string;
    boundary: string;
    lower: string;
    interpretation: string;
    limit: string;
  };
  samples: {
    plateLabel: string;
    scaleNote: string;
    items: Array<{ name: string; cue: string; caption: string }>;
    reading: string;
    limit: string;
  };
  correlation: {
    registers: Array<{
      index: string;
      name: string;
      measure: string;
      detail: string;
      source: SourceId;
    }>;
    lineLabel: string;
    lineNote: string;
    limit: string;
  };
  finding: {
    conclusion: string;
    chain: Array<{ year: string; label: string }>;
    boundaryTitle: string;
    boundaries: string[];
    closing: string;
  };
  navigation: {
    label: string;
    expand: string;
    collapse: string;
    open: string;
    sourceIndex: string;
  };
}

const SCENE_IDS = [1, 2, 3, 4, 5] as const;

export const impactEvidenceTransitionScore = {
  "1->2": "hard-cut",
  "2->3": "crossfade",
  "3->4": "focus-swap",
  "4->5": "hard-cut",
} satisfies TopicTransitionScore;

const TRANSITION_MAP: SceneTransitionMap = impactEvidenceTransitionScore;

const BEAT_LAYOUT_MODES = {
  1: "reserved",
  2: "reserved",
  4: "reserved",
} satisfies Partial<Record<SceneId, BeatLayoutMode>>;

export const impactEvidenceSources = [
  {
    id: "S1",
    authority: "U.S. Department of Energy, Office of Scientific and Technical Information / Science",
    citation:
      "Alvarez, L. W., Alvarez, W., Asaro, F. & Michel, H. V. (1980). Extraterrestrial cause for the Cretaceous-Tertiary extinction. Science 208, 1095–1108. DOI 10.1126/science.208.4448.1095.",
    url: "https://www.osti.gov/biblio/5729041",
    supports:
      "Reports boundary-layer iridium enrichments in Italy, Denmark, and New Zealand and presents the impact hypothesis. The paper is the opening hypothesis and measurement record, not the whole later consensus.",
  },
  {
    id: "S2",
    authority: "U.S. Geological Survey Publications Warehouse",
    citation:
      "Bohor, B. F. (1990). Shock-induced microdeformations in quartz and other mineralogical indications of an impact event at the Cretaceous-Tertiary boundary. Tectonophysics 171. DOI 10.1016/0040-1951(90)90110-T.",
    url: "https://www.usgs.gov/publications/shock-induced-microdeformations-quartz-and-other-mineralogical-indications-impact",
    supports:
      "Documents multiple planar shock features in quartz and the boundary-clay association of shocked grains, altered glass, spinel, and spherules. Diagrammatic specimens in this Topic are explanatory, not observations.",
  },
  {
    id: "S3",
    authority: "International Ocean Discovery Program / International Continental Scientific Drilling Program",
    citation:
      "Gulick, S. et al. (2017). Expedition 364 summary: Chicxulub—Drilling the K-Pg Impact Crater. Proceedings of the IODP 364. DOI 10.14379/iodp.proc.364.101.2017.",
    url: "https://publications.iodp.org/proceedings/364/101/364_101.html",
    supports:
      "Reports Hole M0077A through the Chicxulub peak ring, core recovery from 505.70 to 1334.69 m below seafloor at about 99%, and study of suevite, impact melt, fractured basement, shock, and geophysical logs.",
  },
  {
    id: "S4",
    authority: "U.S. Geological Survey Publications Warehouse / Nature",
    citation:
      "Sharpton, V. L. et al. (1992). New links between the Chicxulub impact structure and the Cretaceous/Tertiary boundary. Nature 359, 819–821. DOI 10.1038/359819a0.",
    url: "https://www.usgs.gov/publications/new-links-between-chicxulub-impact-structure-and-cretaceoustertiary-boundary",
    supports:
      "Links Chicxulub core materials to worldwide boundary ejecta through shocked fragments, melt-rock chemistry, iridium, and age evidence. It supports source-crater correlation, not every extinction mechanism by itself.",
  },
  {
    id: "S5",
    authority: "Science / U.S. National Library of Medicine",
    citation:
      "Schulte, P. et al. (2010). The Chicxulub asteroid impact and mass extinction at the Cretaceous-Paleogene boundary. Science 327, 1214–1218. DOI 10.1126/science.1177265.",
    url: "https://pubmed.ncbi.nlm.nih.gov/20203042/",
    supports:
      "Synthesizes global stratigraphy, ejecta, crater evidence, timing, fossil patterns, and modeled perturbations; concludes the Chicxulub impact triggered the mass extinction. This is a synthesis across evidence, not an appeal to one investigator.",
  },
  {
    id: "S6",
    authority: "Science / U.S. National Library of Medicine",
    citation:
      "Hull, P. M. et al. (2020). On impact and volcanism across the Cretaceous-Paleogene boundary. Science 367, 266–272. DOI 10.1126/science.aay5055.",
    url: "https://pubmed.ncbi.nlm.nih.gov/31949074/",
    supports:
      "Separates impact and volcanic forcing across the boundary and preserves a bounded interpretation: impact is the principal extinction trigger in the analyzed record, while volcanism remains relevant to broader climate and recovery history.",
  },
] as const satisfies readonly (TopicSource & { id: SourceId })[];

export const impactEvidenceClaims = [
  {
    id: "C1",
    sourceIds: ["S5", "S6"],
    claim:
      "The K-Pg question is resolved by converging stratigraphic, mineralogical, crater, chronological, and ecological evidence.",
    boundary:
      "The evidence classes have different inferential roles; their co-occurrence is not a single measurement or a single-person discovery story.",
  },
  {
    id: "C2",
    sourceIds: ["S1"],
    claim:
      "The 1980 report measured strong iridium enrichments at the boundary in Italy, Denmark, and New Zealand.",
    boundary:
      "These are values reported by that study at selected sections, not a uniform global concentration or a stand-alone proof of extinction mechanism.",
  },
  {
    id: "C3",
    sourceIds: ["S2"],
    claim:
      "Planar shock features in quartz, altered glass, spinel, and spherules add mineralogical evidence for high-energy impact ejecta.",
    boundary:
      "The explanatory plate is schematic; identification depends on petrography, chemistry, stratigraphic context, and expert interpretation.",
  },
  {
    id: "C4",
    sourceIds: ["S3"],
    claim:
      "Expedition 364 recovered and logged a deep core through Chicxulub's peak ring, including impact-related units and fractured basement.",
    boundary:
      "The drilling record constrains crater formation and aftermath; it does not by itself measure every global ecological response.",
  },
  {
    id: "C5",
    sourceIds: ["S4"],
    claim:
      "Core materials, shocked fragments, chemistry, and age evidence connect Chicxulub to the boundary ejecta layer.",
    boundary:
      "Correlation identifies the source crater; causal attribution still requires timing, mechanism, and fossil-pattern evidence.",
  },
  {
    id: "C6",
    sourceIds: ["S5", "S6"],
    claim:
      "The best-supported synthesis identifies Chicxulub as the principal trigger of the K-Pg mass extinction.",
    boundary:
      "This does not erase Deccan volcanism, background environmental stress, regional variation, or uncertainty in every downstream mechanism.",
  },
] as const;

const SOURCE_SHORT_CITATIONS: ReadonlyArray<{ id: SourceId; label: string }> = [
  { id: "S1", label: "Alvarez et al. 1980 · Science · 10.1126/science.208.4448.1095" },
  { id: "S2", label: "Bohor 1990 · Tectonophysics · 10.1016/0040-1951(90)90110-T" },
  { id: "S3", label: "Gulick et al. 2017 · IODP Expedition 364 · 10.14379/iodp.proc.364.101.2017" },
  { id: "S4", label: "Sharpton et al. 1992 · Nature · 10.1038/359819a0" },
  { id: "S5", label: "Schulte et al. 2010 · Science · 10.1126/science.1177265" },
  { id: "S6", label: "Hull et al. 2020 · Science · 10.1126/science.aay5055" },
];

const COPY: Record<Language, LocalizedCopy> = {
  en: {
    memo: "EVIDENCE MEMO / K–PG",
    subject: "Impact Evidence",
    scope: "Question → observations → source crater → bounded finding",
    record: "RESEARCH DOSSIER · CLAIM-SCOPED SOURCES",
    scenes: {
      1: {
        tab: "Question",
        eyebrow: "01 / RESEARCH QUESTION",
        title: "What turns an impact hypothesis into a causal case?",
        deck:
          "At the Cretaceous–Paleogene boundary, about 66 million years ago, abrupt biotic turnover and an unusual sediment layer demanded an explanation.",
        beats: [
          {
            id: 0,
            action: "Place the time boundary and competing frames.",
            title: "The boundary question",
            body: "Separate what happened, where the source was, and how it changed ecosystems.",
          },
          {
            id: 1,
            action: "Focus the tests that can discriminate explanations.",
            title: "A chain, not a headline",
            body: "Ask whether chemistry, shock products, crater materials, timing, and fossil response agree.",
          },
        ],
      },
      2: {
        tab: "Ir record",
        eyebrow: "02 / STRATIGRAPHIC SIGNAL",
        title: "The same boundary carries an unusual iridium signal.",
        deck:
          "Alvarez and colleagues reported enrichments at three distant marine sections. The repeated placement matters more than any one number.",
        beats: [
          {
            id: 0,
            action: "Focus the Italian section.",
            title: "Gubbio",
            body: "A boundary clay signal at one well-studied section.",
          },
          {
            id: 1,
            action: "Focus the Danish section.",
            title: "Stevns Klint",
            body: "A stronger reported enrichment in another depositional setting.",
          },
          {
            id: 2,
            action: "Focus the New Zealand section.",
            title: "Woodside Creek",
            body: "A third distant section repeats the boundary association.",
          },
          {
            id: 3,
            action: "Read the sections as one bounded pattern.",
            title: "Repeated placement",
            body: "Anomalous chemistry becomes stronger evidence when stratigraphic placement repeats across sites.",
          },
        ],
      },
      3: {
        tab: "Specimens",
        eyebrow: "03 / SAMPLE PLATE",
        title: "The layer also preserves products of extreme shock and melt.",
        deck:
          "Mineralogy tests a different prediction from iridium chemistry: whether boundary material records the pressures and melts expected from impact.",
        beats: [
          {
            id: 0,
            action: "Hold a static, fully captioned sample plate.",
            title: "Independent material signatures",
            body: "Shocked quartz, altered glass, spinel, and spherules are interpreted together with context.",
          },
        ],
      },
      4: {
        tab: "Correlation",
        eyebrow: "04 / SOURCE-CRATER CORRELATION",
        title: "A buried crater, a drilled peak ring, and the boundary layer align.",
        deck:
          "Geophysics locates the structure; core and downhole records test its materials; ejecta correlations connect that source to distant sections.",
        beats: [
          {
            id: 0,
            action: "Focus the buried structure.",
            title: "Structure",
            body: "Concentric geophysical anomalies define a large buried impact basin.",
          },
          {
            id: 1,
            action: "Focus the peak-ring core.",
            title: "Core",
            body: "Drilling samples impact-related units and the fractured rocks beneath them.",
          },
          {
            id: 2,
            action: "Connect the crater record to distal ejecta.",
            title: "Correlation",
            body: "Material, chemistry, and age evidence tie Chicxulub to the boundary layer.",
          },
        ],
      },
      5: {
        tab: "Finding",
        eyebrow: "05 / BOUNDED FINDING",
        title: "Convergence—not a single paper—makes the case durable.",
        deck:
          "The strongest synthesis identifies Chicxulub as the principal trigger while keeping other forcing, ecological variation, and mechanism uncertainty visible.",
        beats: [
          {
            id: 0,
            action: "State the conclusion with its limits.",
            title: "A causal synthesis",
            body: "Multiple independent records agree on source, time, mechanism, and biological consequence.",
          },
        ],
      },
    },
    question: {
      prompt: "One event is proposed. Which observations would have to agree?",
      boundary: "Boundary interval: approximately 66 Ma · claim C1 is a synthesis, not a discovery anecdote.",
      frames: [
        {
          label: "EVENT",
          text: "Was there a high-energy extraterrestrial impact at the boundary?",
        },
        {
          label: "SOURCE",
          text: "Can a crater be matched to the distributed ejecta record?",
        },
        {
          label: "CONSEQUENCE",
          text: "Do timing and ecological patterns support a principal causal trigger?",
        },
      ],
      test: "Discriminating tests: stratigraphy · mineral physics · geophysics · drilling · chronology · paleontology",
    },
    table: {
      headers: ["SECTION", "ARCHIVE", "REPORTED Ir / BACKGROUND", "INFERENTIAL ROLE"],
      rows: [
        {
          place: "Gubbio, Italy",
          archive: "deep-sea limestone + boundary clay",
          signal: "~30×",
          reading: "repeated boundary placement",
        },
        {
          place: "Stevns Klint, Denmark",
          archive: "marine limestone + boundary clay",
          signal: "~160×",
          reading: "distant section, stronger local contrast",
        },
        {
          place: "Woodside Creek, New Zealand",
          archive: "marine section + boundary clay",
          signal: "~20×",
          reading: "Southern Hemisphere replication",
        },
      ],
      layerLabel: "DIAGRAMMATIC SECTION",
      upper: "PALEOGENE LIMESTONE",
      boundary: "Ir-RICH BOUNDARY CLAY",
      lower: "CRETACEOUS LIMESTONE",
      interpretation:
        "The claim is not “iridium equals extinction.” It is that an unusual extraterrestrial-compatible signal recurs at the same geological boundary.",
      limit:
        "Reported multiples are section-specific values from the 1980 study; they are not a uniform planetary concentration.",
    },
    samples: {
      plateLabel: "PLATE 03 · DIAGRAMMATIC SPECIMENS",
      scaleNote: "Explanatory drawings · not observational images · not to scale",
      items: [
        {
          name: "SHOCKED QUARTZ",
          cue: "multiple planar features",
          caption: "Microscopic planar deformation records extreme pressure history.",
        },
        {
          name: "ALTERED GLASS + SPINEL",
          cue: "melt / vapor products",
          caption: "Chemistry and morphology are interpreted within the boundary layer.",
        },
        {
          name: "SPHERULES",
          cue: "rounded melt-derived forms",
          caption: "Shape alone is insufficient; composition and stratigraphy carry the inference.",
        },
      ],
      reading:
        "A second evidence class now agrees with the chemical anomaly: the layer contains materials associated with shock, melt, and ejecta.",
      limit:
        "No specimen on this page is presented as a microscope observation. The visual plate translates published diagnostic categories.",
    },
    correlation: {
      registers: [
        {
          index: "A",
          name: "BURIED STRUCTURE",
          measure: "~145 km post-impact basin",
          detail: "Seismic and potential-field records image rings and a peak-ring basin beneath younger sediment.",
          source: "S3",
        },
        {
          index: "B",
          name: "HOLE M0077A",
          measure: "505.70–1334.69 mbsf · ~99% core recovery",
          detail: "Peak-ring drilling records suevite, impact melt, shock, fractures, and uplifted basement context.",
          source: "S3",
        },
        {
          index: "C",
          name: "DISTAL BOUNDARY LAYER",
          measure: "material + chemistry + age",
          detail: "Shocked fragments and melt-rock relationships connect the crater to globally distributed ejecta.",
          source: "S4",
        },
      ],
      lineLabel: "SOURCE-TO-LAYER CORRELATION",
      lineNote: "One link is drawn only after structure and core are read separately.",
      limit:
        "Finding the source crater closes the event-correlation question; extinction causality still requires timing and biological mechanism.",
    },
    finding: {
      conclusion:
        "Chicxulub is not persuasive because one dramatic observation won. It is persuasive because independent records converge on a principal trigger.",
      chain: [
        { year: "1980", label: "Ir anomaly + testable impact hypothesis" },
        { year: "1980s–90s", label: "shock products + distributed ejecta" },
        { year: "1990s", label: "Chicxulub source-crater correlation" },
        { year: "2010", label: "global stratigraphic synthesis" },
        { year: "2016–17", label: "peak-ring drilling + calibrated core record" },
      ],
      boundaryTitle: "WHAT THE FINDING DOES NOT CLAIM",
      boundaries: [
        "Temporal association alone is not the causal argument.",
        "Deccan volcanism and background environmental stress do not disappear from Earth history.",
        "One trigger does not imply one identical mechanism or response for every lineage and region.",
      ],
      closing: "Consensus here is an evidence architecture: claim → test → source → limit.",
    },
    navigation: {
      label: "Impact citation chain",
      expand: "Expand citation chain",
      collapse: "Collapse citation chain",
      open: "Open evidence section",
      sourceIndex: "Sources carried by this dossier",
    },
  },
  zh: {
    memo: "证据备忘录 / K–PG",
    subject: "撞击证据",
    scope: "问题 → 观测 → 源撞击坑 → 有边界的结论",
    record: "研究档案 · 逐项主张溯源",
    scenes: {
      1: {
        tab: "问题",
        eyebrow: "01 / 研究问题",
        title: "撞击假说如何变成一条因果证据链？",
        deck: "约 6600 万年前的白垩纪—古近纪边界，生物群突变与一层异常沉积物要求解释。",
        beats: [
          {
            id: 0,
            action: "落位时间边界与候选解释框架。",
            title: "边界问题",
            body: "把发生了什么、源头在哪里、生态如何受影响分开检验。",
          },
          {
            id: 1,
            action: "聚焦能够区分解释的检验。",
            title: "证据链，而非标题",
            body: "看化学、冲击产物、撞击坑材料、年代与化石响应是否一致。",
          },
        ],
      },
      2: {
        tab: "铱记录",
        eyebrow: "02 / 地层信号",
        title: "同一边界反复出现异常铱信号。",
        deck: "Alvarez 等人在三个相距很远的海相剖面报告铱富集；重复出现的位置，比单个数字更重要。",
        beats: [
          {
            id: 0,
            action: "聚焦意大利剖面。",
            title: "古比奥",
            body: "一个研究充分的剖面在边界黏土中记录信号。",
          },
          {
            id: 1,
            action: "聚焦丹麦剖面。",
            title: "斯泰温斯克林特",
            body: "另一个沉积环境报告了更强的局部富集。",
          },
          {
            id: 2,
            action: "聚焦新西兰剖面。",
            title: "伍德赛德溪",
            body: "第三个遥远剖面再次对应同一边界。",
          },
          {
            id: 3,
            action: "把三个剖面读成有边界的模式。",
            title: "重复落位",
            body: "异常化学信号在多地重复对应同一地层位置，证据才更强。",
          },
        ],
      },
      3: {
        tab: "标本",
        eyebrow: "03 / 标本图版",
        title: "这一层还保存了极端冲击与熔融的产物。",
        deck: "矿物学检验的是不同于铱化学的预测：边界材料是否记录了撞击所需的压力与熔融过程。",
        beats: [
          {
            id: 0,
            action: "停留在静态、完整图注的标本图版。",
            title: "独立材料信号",
            body: "冲击石英、蚀变玻璃、尖晶石与球粒必须连同地层背景一起解释。",
          },
        ],
      },
      4: {
        tab: "关联",
        eyebrow: "04 / 源撞击坑关联",
        title: "埋藏撞击坑、峰环钻芯与边界层彼此对齐。",
        deck: "地球物理定位结构，钻芯与井下记录检验材料，喷出物关联把源区连到远端剖面。",
        beats: [
          {
            id: 0,
            action: "聚焦埋藏结构。",
            title: "结构",
            body: "同心地球物理异常勾勒出大型埋藏撞击盆地。",
          },
          {
            id: 1,
            action: "聚焦峰环钻芯。",
            title: "钻芯",
            body: "钻探取得撞击相关单元及其下方破碎岩石。",
          },
          {
            id: 2,
            action: "把撞击坑记录连到远端喷出物。",
            title: "关联",
            body: "材料、化学与年代证据把希克苏鲁伯连到边界层。",
          },
        ],
      },
      5: {
        tab: "结论",
        eyebrow: "05 / 有边界的结论",
        title: "让结论持久的，是证据汇合，而非一篇论文。",
        deck: "最强综合结论把希克苏鲁伯撞击识别为主要触发因素，同时保留其他强迫、生态差异与机制不确定性。",
        beats: [
          {
            id: 0,
            action: "同时写下结论与边界。",
            title: "因果综合",
            body: "多类独立记录在源头、时间、机制与生物后果上相互支持。",
          },
        ],
      },
    },
    question: {
      prompt: "提出了一个事件。哪些观测必须相互吻合？",
      boundary: "时间边界：约 6600 万年前 · C1 是综合结论，不是发现者轶事。",
      frames: [
        { label: "事件", text: "边界时刻是否发生过高能天体撞击？" },
        { label: "源头", text: "一个撞击坑能否与分布广泛的喷出物记录匹配？" },
        { label: "后果", text: "年代与生态模式是否支持主要因果触发？" },
      ],
      test: "区分性检验：地层学 · 矿物物理 · 地球物理 · 钻探 · 年代学 · 古生物学",
    },
    table: {
      headers: ["剖面", "地层档案", "报告的铱 / 背景值", "推理作用"],
      rows: [
        {
          place: "意大利 · 古比奥",
          archive: "深海石灰岩 + 边界黏土",
          signal: "约 30×",
          reading: "重复对应边界位置",
        },
        {
          place: "丹麦 · 斯泰温斯克林特",
          archive: "海相石灰岩 + 边界黏土",
          signal: "约 160×",
          reading: "遥远剖面，更强局部反差",
        },
        {
          place: "新西兰 · 伍德赛德溪",
          archive: "海相剖面 + 边界黏土",
          signal: "约 20×",
          reading: "南半球重复记录",
        },
      ],
      layerLabel: "示意地层剖面",
      upper: "古近纪石灰岩",
      boundary: "富铱边界黏土",
      lower: "白垩纪石灰岩",
      interpretation: "主张不是“铱等于灭绝”，而是与天体物质相容的异常信号在同一地质边界反复出现。",
      limit: "倍数来自 1980 年研究所报告的具体剖面值，不代表全球统一浓度。",
    },
    samples: {
      plateLabel: "图版 03 · 标本示意",
      scaleNote: "解释性绘图 · 非观测照片 · 不按比例",
      items: [
        { name: "冲击石英", cue: "多组平面变形构造", caption: "微观平面变形记录极端压力历史。" },
        { name: "蚀变玻璃 + 尖晶石", cue: "熔融 / 蒸气产物", caption: "化学与形态必须放在边界层背景中解释。" },
        { name: "球粒", cue: "圆形熔融衍生体", caption: "仅凭形状不够，成分与地层位置共同承担推理。" },
      ],
      reading: "第二类证据与化学异常相互支持：这一层含有与冲击、熔融和喷出物相关的材料。",
      limit: "本页没有把任何图形当作显微观测；图版只是翻译已发表研究中的诊断类别。",
    },
    correlation: {
      registers: [
        {
          index: "A",
          name: "埋藏结构",
          measure: "约 145 km 撞击后盆地",
          detail: "地震与位场资料成像出被年轻沉积物覆盖的环状结构和峰环盆地。",
          source: "S3",
        },
        {
          index: "B",
          name: "M0077A 钻孔",
          measure: "505.70–1334.69 mbsf · 约 99% 岩芯回收率",
          detail: "峰环钻探记录角砾岩、撞击熔融物、冲击、裂隙与抬升基底背景。",
          source: "S3",
        },
        {
          index: "C",
          name: "远端边界层",
          measure: "材料 + 化学 + 年代",
          detail: "冲击碎屑与熔融岩关系把撞击坑连到全球分布的喷出物。",
          source: "S4",
        },
      ],
      lineLabel: "源区—边界层关联",
      lineNote: "先分别阅读结构与钻芯，最后只绘制一条关联线。",
      limit: "找到源撞击坑解决事件关联问题；灭绝因果仍需年代与生物机制证据。",
    },
    finding: {
      conclusion: "希克苏鲁伯并非靠一个戏剧性观测获胜；独立记录共同指向主要触发因素，结论才可信。",
      chain: [
        { year: "1980", label: "铱异常 + 可检验的撞击假说" },
        { year: "1980s–90s", label: "冲击产物 + 广布喷出物" },
        { year: "1990s", label: "希克苏鲁伯源撞击坑关联" },
        { year: "2010", label: "全球地层综合" },
        { year: "2016–17", label: "峰环钻探 + 校准钻芯记录" },
      ],
      boundaryTitle: "这一结论没有声称",
      boundaries: [
        "单靠时间相关就已经构成因果论证。",
        "德干火山活动与背景环境压力从地球史中消失。",
        "一个主要触发因素意味着每个谱系与地区都经历同一种机制和响应。",
      ],
      closing: "这里的共识是一套证据架构：主张 → 检验 → 来源 → 边界。",
    },
    navigation: {
      label: "撞击证据引用链",
      expand: "展开引用链",
      collapse: "收起引用链",
      open: "打开证据章节",
      sourceIndex: "本研究档案携带的来源",
    },
  },
};

function ClaimRef({ id, sources }: { id: string; sources: readonly SourceId[] }) {
  return (
    <span
      className={styles.claimRef}
      data-claim-id={id}
      data-source-id={sources.join(" ")}
    >
      {id} → {sources.join("+")}
    </span>
  );
}

function MemoSceneHeader({ copy }: { copy: SceneCopy }) {
  return (
    <header className={styles.sceneHeader} data-beat-layout-item="true">
      <div className={styles.eyebrow}>{copy.eyebrow}</div>
      <div className={styles.titleRow}>
        <h1>{copy.title}</h1>
      </div>
      <p>{copy.deck}</p>
    </header>
  );
}

function QuestionScene({ copy, beat }: { copy: LocalizedCopy; beat: number }) {
  const sceneCopy = copy.scenes[1];
  return (
    <article className={styles.scene} data-scene-id="1" data-beat={beat}>
      <MemoSceneHeader copy={sceneCopy} />
      <div className={styles.questionBody} data-beat-layout-item="true">
        <div className={styles.questionPrompt} data-focused={beat === 0 ? "true" : "false"}>
          <span>{copy.question.prompt}</span>
          <ClaimRef id="C1" sources={["S5", "S6"]} />
        </div>
        <div className={styles.questionFrames}>
          {copy.question.frames.map((frame, index) => (
            <section
              key={frame.label}
              className={styles.questionFrame}
              data-beat-layout-item="true"
              data-focused={beat === 1 ? "true" : undefined}
            >
              <span>0{index + 1} / {frame.label}</span>
              <p>{frame.text}</p>
            </section>
          ))}
        </div>
        <div className={styles.testLine} data-beat-layout-item="true">
          {copy.question.test}
        </div>
        <p className={styles.boundaryNote}>{copy.question.boundary}</p>
      </div>
    </article>
  );
}

function EvidenceTableScene({ copy, beat }: { copy: LocalizedCopy; beat: number }) {
  const sceneCopy = copy.scenes[2];
  return (
    <article className={styles.scene} data-scene-id="2" data-beat={beat}>
      <MemoSceneHeader copy={sceneCopy} />
      <div className={styles.tableComposition} data-beat-layout-item="true">
        <div className={styles.tableRegion}>
          <div className={styles.tableHead} role="row">
            {copy.table.headers.map((header) => <span key={header}>{header}</span>)}
          </div>
          {copy.table.rows.map((row, index) => (
            <div
              key={row.place}
              className={styles.evidenceRow}
              data-evidence-row="true"
              data-focused={beat === index ? "true" : "false"}
              data-beat-layout-item="true"
              role="row"
            >
              <strong>{row.place}</strong>
              <span>{row.archive}</span>
              <b>{row.signal}</b>
              <span>{row.reading}</span>
            </div>
          ))}
          <div
            className={styles.tableReading}
            data-boundary-reading="true"
            data-focused={beat === 3 ? "true" : "false"}
          >
            <ClaimRef id="C2" sources={["S1"]} />
            <p>{copy.table.interpretation}</p>
          </div>
        </div>
        <figure className={styles.layerFigure} data-beat-layout-item="true">
          <figcaption>{copy.table.layerLabel}</figcaption>
          <div className={styles.layerUpper}><span>{copy.table.upper}</span></div>
          <div className={styles.layerBoundary}><span>{copy.table.boundary}</span></div>
          <div className={styles.layerLower}><span>{copy.table.lower}</span></div>
          <p>{copy.table.limit}</p>
        </figure>
      </div>
    </article>
  );
}

function QuartzDiagram() {
  return (
    <svg viewBox="0 0 300 180" aria-hidden="true">
      <path className={styles.specimenShape} d="M56 26 L218 18 L270 78 L224 158 L78 150 L28 92 Z" />
      <path className={styles.specimenLine} d="M64 54 L218 132 M44 86 L190 154 M102 28 L252 106" />
      <path className={styles.specimenFine} d="M76 39 L232 118 M58 70 L207 149 M120 23 L264 91" />
    </svg>
  );
}

function GlassDiagram() {
  return (
    <svg viewBox="0 0 300 180" aria-hidden="true">
      <path className={styles.specimenShape} d="M38 120 C70 52 138 16 208 38 C258 55 278 112 233 145 C183 172 95 166 38 120 Z" />
      <path className={styles.specimenLine} d="M83 122 C112 78 155 54 215 68 M97 145 C142 111 190 101 245 112" />
      <path className={styles.specimenFine} d="M84 85 L107 70 M166 60 L190 46 M196 126 L222 136" />
    </svg>
  );
}

function SpheruleDiagram() {
  return (
    <svg viewBox="0 0 300 180" aria-hidden="true">
      <circle className={styles.specimenShape} cx="92" cy="96" r="52" />
      <circle className={styles.specimenShape} cx="197" cy="76" r="39" />
      <circle className={styles.specimenShape} cx="224" cy="132" r="22" />
      <path className={styles.specimenLine} d="M52 92 C78 68 104 62 130 76 M168 76 C189 57 211 55 230 68" />
      <path className={styles.specimenFine} d="M70 124 C94 110 112 110 130 118 M207 124 C221 115 234 116 244 127" />
    </svg>
  );
}

function SamplePlateScene({ copy }: { copy: LocalizedCopy }) {
  const sceneCopy = copy.scenes[3];
  const diagrams = [<QuartzDiagram key="quartz" />, <GlassDiagram key="glass" />, <SpheruleDiagram key="spherule" />];
  return (
    <article className={styles.scene} data-scene-id="3" data-beat="0">
      <MemoSceneHeader copy={sceneCopy} />
      <div className={styles.plateMeta}>
        <span>{copy.samples.plateLabel}</span>
        <span>{copy.samples.scaleNote}</span>
        <ClaimRef id="C3" sources={["S2"]} />
      </div>
      <div className={styles.samplePlate}>
        {copy.samples.items.map((item, index) => (
          <figure key={item.name} className={styles.sampleItem} data-beat-layout-item="true">
            <div className={styles.specimen}>{diagrams[index]}</div>
            <figcaption>
              <strong>{item.name}</strong>
              <span>{item.cue}</span>
              <p>{item.caption}</p>
            </figcaption>
          </figure>
        ))}
      </div>
      <div className={styles.plateReading}>
        <p>{copy.samples.reading}</p>
        <small>{copy.samples.limit}</small>
      </div>
    </article>
  );
}

function CorrelationArt({ index }: { index: number }) {
  if (index === 0) {
    return (
      <div className={styles.craterArt} aria-hidden="true">
        <i /><i /><i /><b />
      </div>
    );
  }
  if (index === 1) {
    return (
      <div className={styles.coreArt} aria-hidden="true">
        <i /><i /><i /><i />
      </div>
    );
  }
  return (
    <div className={styles.layerArt} aria-hidden="true">
      <i /><b /><i />
    </div>
  );
}

function CorrelationScene({
  copy,
  beat,
  reducedMotion,
}: {
  copy: LocalizedCopy;
  beat: number;
  reducedMotion: boolean;
}) {
  const sceneCopy = copy.scenes[4];
  const lineSettled = reducedMotion || beat >= 2;
  return (
    <article className={styles.scene} data-scene-id="4" data-beat={beat}>
      <MemoSceneHeader copy={sceneCopy} />
      <div className={styles.correlationRegisters} data-beat-layout-item="true">
        {copy.correlation.registers.map((register, index) => (
          <section
            key={register.index}
            className={styles.correlationRegister}
            data-focused={beat === index ? "true" : "false"}
            data-beat-layout-item="true"
          >
            <div className={styles.registerIndex}>{register.index}</div>
            <CorrelationArt index={index} />
            <div className={styles.registerCopy}>
              <strong>{register.name}</strong>
              <b>{register.measure}</b>
              <p>{register.detail}</p>
              <span>{register.source}</span>
            </div>
          </section>
        ))}
      </div>
      <div className={styles.correlationLineWrap} data-beat-layout-item="true">
        <span>{copy.correlation.lineLabel}</span>
        <svg viewBox="0 0 1200 80" preserveAspectRatio="none" aria-hidden="true">
          <path className={styles.correlationBase} d="M20 40 H1180" />
          <path
            className={styles.correlationPath}
            d="M20 40 H1180"
            pathLength="100"
            data-correlation-line="true"
            data-settled={lineSettled ? "true" : "false"}
          />
        </svg>
        <p>{copy.correlation.lineNote}</p>
      </div>
      <div className={styles.correlationLimit}>
        <ClaimRef id="C4" sources={["S3"]} />
        <ClaimRef id="C5" sources={["S4"]} />
        <p>{copy.correlation.limit}</p>
      </div>
    </article>
  );
}

function FindingScene({ copy }: { copy: LocalizedCopy }) {
  const sceneCopy = copy.scenes[5];
  return (
    <article className={styles.scene} data-scene-id="5" data-beat="0">
      <MemoSceneHeader copy={sceneCopy} />
      <div className={styles.findingComposition}>
        <section className={styles.findingStatement} data-beat-layout-item="true">
          <ClaimRef id="C6" sources={["S5", "S6"]} />
          <p>{copy.finding.conclusion}</p>
          <strong>{copy.finding.closing}</strong>
        </section>
        <ol className={styles.historyChain} data-beat-layout-item="true">
          {copy.finding.chain.map((item) => (
            <li key={item.year}>
              <time>{item.year}</time>
              <span>{item.label}</span>
            </li>
          ))}
        </ol>
        <aside className={styles.findingBoundaries} data-beat-layout-item="true">
          <h2>{copy.finding.boundaryTitle}</h2>
          <ul>
            {copy.finding.boundaries.map((boundary) => <li key={boundary}>{boundary}</li>)}
          </ul>
        </aside>
      </div>
    </article>
  );
}

function ScenePanel({
  scene,
  beat,
  copy,
  reducedMotion,
}: {
  scene: number;
  beat: number;
  copy: LocalizedCopy;
  reducedMotion: boolean;
}) {
  const sceneId = (SCENE_IDS.includes(scene as SceneId) ? scene : 1) as SceneId;
  const safeBeat = Math.max(0, Math.min(beat, copy.scenes[sceneId].beats.length - 1));

  if (sceneId === 1) return <QuestionScene copy={copy} beat={safeBeat} />;
  if (sceneId === 2) return <EvidenceTableScene copy={copy} beat={safeBeat} />;
  if (sceneId === 3) return <SamplePlateScene copy={copy} />;
  if (sceneId === 4) {
    return <CorrelationScene copy={copy} beat={safeBeat} reducedMotion={reducedMotion} />;
  }
  return <FindingScene copy={copy} />;
}

function CitationChain({
  copy,
  scene,
  onNavigate,
}: {
  copy: LocalizedCopy;
  scene: number;
  onNavigate?: (scene: number, beat: number) => void;
}) {
  const [expanded, setExpanded] = useState(false);

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    event.stopPropagation();
    const delta = event.key === "ArrowRight" ? 1 : -1;
    const target = Math.max(1, Math.min(5, scene + delta));
    if (target !== scene) onNavigate?.(target, 0);
  };

  const openScene = (event: MouseEvent<HTMLButtonElement>, target: number) => {
    event.stopPropagation();
    onNavigate?.(target, 0);
  };

  return (
    <nav
      className={styles.citationChain}
      aria-label={copy.navigation.label}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      data-topic-navigation="true"
      data-navigation-geometry="typographic-index"
      data-navigation-carrier="impact-citation-chain"
      data-navigation-invocation="click-expand"
      data-navigation-feedback="history-trail"
      data-expanded={expanded ? "true" : "false"}
    >
      <button
        type="button"
        className={styles.citationToggle}
        aria-expanded={expanded}
        aria-label={expanded ? copy.navigation.collapse : copy.navigation.expand}
        onClick={(event) => {
          event.stopPropagation();
          setExpanded((current) => !current);
        }}
      >
        <span>{expanded ? "−" : "+"}</span>
        <b>{copy.navigation.label}</b>
      </button>
      <div className={styles.citationIndices}>
        {SCENE_IDS.map((sceneId) => (
          <button
            key={sceneId}
            type="button"
            aria-current={sceneId === scene ? "page" : undefined}
            aria-label={`${copy.navigation.open} ${sceneId}`}
            data-visited={sceneId <= scene ? "true" : "false"}
            data-active={sceneId === scene ? "true" : "false"}
            onClick={(event) => openScene(event, sceneId)}
          >
            <span>0{sceneId}</span>
            <b>C{sceneId === 4 ? "4–5" : sceneId === 5 ? "6" : sceneId}</b>
          </button>
        ))}
      </div>
      <div className={styles.sourceDrawer} aria-hidden={!expanded}>
        <span className={styles.sourceDrawerTitle}>{copy.navigation.sourceIndex}</span>
        <ul>
          {SOURCE_SHORT_CITATIONS.map((source) => (
            <li key={source.id} data-source-citation="true" data-source-id={source.id}>
              <b>{source.id}</b>
              <span>{source.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

export function getMetadata(language: Language): StyleMetadata {
  const copy = COPY[language];
  return {
    id: "research-memo",
    band: "text-report",
    name: language === "zh" ? "研究备忘录" : "Research Memo",
    theme: language === "zh" ? "撞击证据：跨介质、可追溯且有边界的科学证据链" : "Impact evidence: a traceable, cross-medium, bounded scientific case",
    densityLabel: language === "zh" ? "阅读优先 · 高密度" : "Reading-first · High density",
    heroScene: 2,
    colors: {
      bg: "#f7f4ed",
      ink: "#181a1b",
      panel: "#eeebe3",
    },
    typography: {
      header: language === "zh" ? "Songti SC 700" : "Iowan Old Style 700",
      body: language === "zh" ? "PingFang SC 500" : "Aptos 500",
    },
    tags: [
      "research-memo",
      "impact-evidence",
      "reading-first",
      "evidence-report",
      "claim-source-chain",
      "minimal-motion",
      "geology",
    ],
    fonts:
      language === "zh"
        ? ["cjk:Songti SC", "cjk:PingFang SC"]
        : ["Iowan Old Style", "Aptos"],
    scenes: SCENE_IDS.map((sceneId) => ({
      id: sceneId,
      title: copy.scenes[sceneId].title,
      beats: copy.scenes[sceneId].beats,
    })),
  };
}

export default function ImpactEvidence({
  scene,
  beat,
  language,
  isThumbnail,
  reducedMotion,
  onNavigate,
}: BespokeStyleProps) {
  const copy = COPY[language];
  const effectiveReducedMotion = reducedMotion || isThumbnail;

  return (
    <section
      className={styles.root}
      data-testid="impact-evidence-root"
      data-style-id="research-memo"
      data-topic-id="impact-evidence"
      data-topic-origin="curated"
      data-motion={effectiveReducedMotion ? "off" : "restrained"}
    >
      <header className={styles.memoHeader}>
        <div>
          <span>{copy.memo}</span>
          <strong>{copy.subject}</strong>
        </div>
        <p>{copy.scope}</p>
        <b>{copy.record}</b>
      </header>
      <main className={styles.canvas}>
        <SpatialSceneTrack
          scene={scene}
          beat={beat}
          sceneIds={[...SCENE_IDS]}
          transitionKind="hard-cut"
          transitionMap={TRANSITION_MAP}
          transitionDurationMs={520}
          reducedMotion={effectiveReducedMotion}
          beatLayoutModes={BEAT_LAYOUT_MODES}
          renderScene={(sceneId, sceneBeat) => (
            <ScenePanel
              scene={sceneId}
              beat={sceneBeat}
              copy={copy}
              reducedMotion={effectiveReducedMotion}
            />
          )}
        />
      </main>
      {!isThumbnail && (
        <CitationChain copy={copy} scene={scene} onNavigate={onNavigate} />
      )}
    </section>
  );
}

export const impactEvidenceTopic = defineStyleTopic({
  id: "impact-evidence",
  topic: {
    en: "Impact Evidence",
    zh: "撞击证据",
  },
  model: "GPT-5",
  component: ImpactEvidence,
  getMetadata,
  navigation: {
    geometry: "typographic-index",
    carrier: "impact-citation-chain",
    invocation: "click-expand",
    feedback: "history-trail",
  },
  transitionScore: impactEvidenceTransitionScore,
  sources: impactEvidenceSources,
});

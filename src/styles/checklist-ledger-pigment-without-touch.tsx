import { useState } from "react";
import type {
  CSSProperties,
  KeyboardEvent,
  MouseEvent,
  PointerEvent,
  ReactNode,
  TouchEvent,
} from "react";
import type {
  BespokeStyleProps,
  StyleMetadata,
  TopicNavigationProfile,
  TopicSource,
  TopicTransitionScore,
} from "../types";
import SpatialSceneTrack from "./SpatialSceneTrack";
import type {
  BeatLayoutMode,
  SceneTransitionKind,
  SceneTransitionMap,
} from "./SpatialSceneTrack";
import { defineStyleTopic } from "./topic";
import styles from "./checklist-ledger-pigment-without-touch.module.css";

type Language = "en" | "zh";
type SceneId = 1 | 2 | 3 | 4 | 5;
type MethodId = "ma-xrf" | "ris-fis" | "xray-nir" | "oct-3d";

interface BeatCopy {
  action: string;
  title: string;
  body: string;
}

interface SceneCopy {
  code: string;
  title: string;
  subtitle: string;
  beats: BeatCopy[];
}

interface MethodCopy {
  id: MethodId;
  name: string;
  channel: string;
  measures: string;
  cannot: string;
  scope: string;
}

interface EvidenceCopy {
  id: string;
  method: string;
  observation: string;
  boundary: string;
}

const PIGMENT_WITHOUT_TOUCH_SOURCE_IDS = [
  "mauritshuis-girl-in-the-spotlight",
  "mauritshuis-examination-methods",
  "delaney-2020-pigment-distribution",
  "van-loon-2019-skin-tones",
  "elkhuizen-2019-3d-scanning",
] as const;

type PigmentWithoutTouchSourceId =
  (typeof PIGMENT_WITHOUT_TOUCH_SOURCE_IDS)[number];

const PIGMENT_WITHOUT_TOUCH_CLAIM_IDS = [
  "object-study-2018",
  "registered-multimodal-records",
  "no-new-sampling-boundary",
  "ma-xrf-element-distribution",
  "ris-fis-fors-complementarity",
  "xray-nir-layer-record",
  "surface-topography-record",
  "element-map-not-pigment-label",
  "mercury-vermilion-context",
  "red-lake-ris-nondetection",
  "red-lake-fors-fis-evidence",
  "potassium-ambiguity",
  "red-lake-bounded-support",
  "headscarf-ultramarine-lead-white",
  "conservation-record-boundary",
] as const;

type PigmentWithoutTouchClaimId =
  (typeof PIGMENT_WITHOUT_TOUCH_CLAIM_IDS)[number];

type ClaimIdList = readonly [
  PigmentWithoutTouchClaimId,
  ...PigmentWithoutTouchClaimId[],
];

interface PigmentWithoutTouchSource extends TopicSource {
  id: PigmentWithoutTouchSourceId;
  stamp: string;
  claimIds: readonly PigmentWithoutTouchClaimId[];
}

interface PigmentWithoutTouchClaim {
  id: PigmentWithoutTouchClaimId;
  statement: string;
  sourceIds: readonly PigmentWithoutTouchSourceId[];
}

interface SceneClaimMap {
  heading: ClaimIdList;
  visual: ClaimIdList;
  beats: readonly ClaimIdList[];
  boundaries: readonly ClaimIdList[];
  evidence: readonly ClaimIdList[];
  progressiveEvidence?: boolean;
}

type LedgerVariables = CSSProperties & {
  "--swatch-color"?: string;
};

const SCENE_IDS: SceneId[] = [1, 2, 3, 4, 5];

export const PIGMENT_WITHOUT_TOUCH_TRANSITION_SCORE = {
  "1->2": "crossfade",
  "2->3": "hard-cut",
  "3->4": "linear-wipe",
  "4->5": "crossfade",
} as const satisfies TopicTransitionScore;

const TRANSITION_MAP: SceneTransitionMap = {
  ...PIGMENT_WITHOUT_TOUCH_TRANSITION_SCORE,
  "2->1": "crossfade",
  "3->2": "hard-cut",
  "4->3": "linear-wipe",
  "5->4": "crossfade",
};

const INCOMING_TRANSITION_KIND: Record<SceneId, SceneTransitionKind> = {
  1: "crossfade",
  2: "crossfade",
  3: "hard-cut",
  4: "linear-wipe",
  5: "crossfade",
};

const BEAT_LAYOUT_MODES = {
  1: "reserved",
  2: "reserved",
  3: "reserved",
  4: "reserved",
  5: "reserved",
} satisfies Record<SceneId, BeatLayoutMode>;

const NAVIGATION_PROFILE = {
  geometry: "edge-scale",
  carrier: "pigment-swatch-rail",
  invocation: "gesture-hold",
  feedback: "active-glow",
} as const satisfies TopicNavigationProfile;

export const PIGMENT_WITHOUT_TOUCH_SOURCES = [
  {
    id: "mauritshuis-girl-in-the-spotlight",
    stamp: "MRT/GITS-2018",
    claimIds: ["object-study-2018", "no-new-sampling-boundary"],
    authority: "Mauritshuis",
    title: "The Girl in the Spotlight",
    citation:
      "Mauritshuis. The Girl in the Spotlight. Technical examination conducted 26 February–11 March 2018.",
    url: "https://www.mauritshuis.nl/en/what-s-on/exhibitions/exhibitions-from-the-past/the-girl-in-the-spotlight",
    supports:
      "The public 2018 research project, its question about Vermeer’s materials and process, and its use of newer non-invasive technical-analysis methods without a restoration treatment.",
  },
  {
    id: "mauritshuis-examination-methods",
    stamp: "MRT/METHODS",
    claimIds: [
      "registered-multimodal-records",
      "ma-xrf-element-distribution",
      "xray-nir-layer-record",
      "element-map-not-pigment-label",
      "mercury-vermilion-context",
    ],
    authority: "Mauritshuis",
    title: "Examination Methods",
    citation:
      "Mauritshuis. Examination Methods. Girl with a Blog / The Girl in the Spotlight research dossier.",
    url: "https://www.mauritshuis.nl/en/our-collection/restoration-and-research/closer-to-vermeer-and-the-girl/girl-with-a-blog/examination-methods",
    supports:
      "What X-radiography, MA-XRF, near-infrared imaging, digital microscopy, and related methods measure on the painting, including element distribution, density, subsurface structure, and surface detail.",
  },
  {
    id: "delaney-2020-pigment-distribution",
    stamp: "HS/PIGMENT-2020",
    claimIds: [
      "registered-multimodal-records",
      "ma-xrf-element-distribution",
      "ris-fis-fors-complementarity",
      "element-map-not-pigment-label",
      "mercury-vermilion-context",
      "red-lake-ris-nondetection",
      "red-lake-fors-fis-evidence",
      "potassium-ambiguity",
      "red-lake-bounded-support",
      "headscarf-ultramarine-lead-white",
      "conservation-record-boundary",
    ],
    authority: "Heritage Science / National Gallery of Art and Mauritshuis",
    title:
      "Mapping the pigment distribution of Vermeer’s Girl with a Pearl Earring",
    citation:
      "Delaney, J. K., Dooley, K. A., van Loon, A., & Vandivere, A. Heritage Science 8, 4 (2020). doi:10.1186/s40494-019-0348-9.",
    url: "https://www.nature.com/articles/s40494-019-0348-9",
    supports:
      "The complementary use of RIS, FIS, FORS, and MA-XRF; pigment-distribution conclusions; matrix effects; the red-lake non-detection versus weak-site evidence; and the ambiguity of potassium as a material marker.",
  },
  {
    id: "van-loon-2019-skin-tones",
    stamp: "HS/SKIN-2019",
    claimIds: [
      "registered-multimodal-records",
      "ma-xrf-element-distribution",
      "conservation-record-boundary",
    ],
    authority: "Heritage Science / Rijksmuseum and Mauritshuis",
    title:
      "Beauty is skin deep: the skin tones of Vermeer’s Girl with a Pearl Earring",
    citation:
      "van Loon, A., Vandivere, A., Delaney, J. K., et al. Heritage Science 7, 102 (2019). doi:10.1186/s40494-019-0344-0.",
    url: "https://www.nature.com/articles/s40494-019-0344-0",
    supports:
      "MA-XRF as elemental information from surface and subsurface layers, RIS as complementary molecular information, and the registered comparison of maps and microscopy needed for bounded layer interpretation.",
  },
  {
    id: "elkhuizen-2019-3d-scanning",
    stamp: "HS/3D-2019",
    claimIds: ["surface-topography-record", "conservation-record-boundary"],
    authority: "Heritage Science / Delft University of Technology and Mauritshuis",
    title:
      "Comparison of three 3D scanning techniques for paintings, as applied to Vermeer’s Girl with a Pearl Earring",
    citation:
      "Elkhuizen, W. S., Callewaert, T. W. J., Leonhardt, E., et al. Heritage Science 7, 89 (2019). doi:10.1186/s40494-019-0331-5.",
    url: "https://www.nature.com/articles/s40494-019-0331-5",
    supports:
      "MS-OCT, 3D digital microscopy, and fringe-encoded scanning as non-invasive surface-topography records, plus their resolution, field-of-view, stitching, and capture-time trade-offs.",
  },
] as const satisfies readonly PigmentWithoutTouchSource[];

export const PIGMENT_WITHOUT_TOUCH_CLAIMS = {
  "object-study-2018": {
    id: "object-study-2018",
    statement:
      "Mauritshuis examined Girl with a Pearl Earring publicly in 2018 to investigate Vermeer’s materials and process with newer technical methods.",
    sourceIds: ["mauritshuis-girl-in-the-spotlight"],
  },
  "registered-multimodal-records": {
    id: "registered-multimodal-records",
    statement:
      "Technical photographs, spectral imaging, elemental maps, and surface records become comparable when their evidence is registered to the same painting coordinates.",
    sourceIds: [
      "mauritshuis-examination-methods",
      "delaney-2020-pigment-distribution",
      "van-loon-2019-skin-tones",
    ],
  },
  "no-new-sampling-boundary": {
    id: "no-new-sampling-boundary",
    statement:
      "The public 2018 examination centered non-invasive technical analysis; this walkthrough keeps any archived micro-sample corroboration separate from its full-field evidence.",
    sourceIds: ["mauritshuis-girl-in-the-spotlight"],
  },
  "ma-xrf-element-distribution": {
    id: "ma-xrf-element-distribution",
    statement:
      "MA-XRF maps emitted X-ray signatures and the spatial distribution of elements, including mercury and lead, across surface and subsurface paint layers.",
    sourceIds: [
      "mauritshuis-examination-methods",
      "delaney-2020-pigment-distribution",
      "van-loon-2019-skin-tones",
    ],
  },
  "ris-fis-fors-complementarity": {
    id: "ris-fis-fors-complementarity",
    statement:
      "RIS, FIS, and FORS contribute complementary reflectance, fluorescence, and point-spectrum evidence that narrows pigment interpretation without replacing elemental maps.",
    sourceIds: ["delaney-2020-pigment-distribution"],
  },
  "xray-nir-layer-record": {
    id: "xray-nir-layer-record",
    statement:
      "X-radiography records density contrast such as lead white, while near-infrared imaging can reveal carbon-rich features beneath visible paint layers.",
    sourceIds: ["mauritshuis-examination-methods"],
  },
  "surface-topography-record": {
    id: "surface-topography-record",
    statement:
      "MS-OCT, 3D digital microscopy, and fringe-based scanning record surface topography with resolution, field-of-view, stitching, and capture-time trade-offs.",
    sourceIds: ["elkhuizen-2019-3d-scanning"],
  },
  "element-map-not-pigment-label": {
    id: "element-map-not-pigment-label",
    statement:
      "An elemental map localizes an element signal; pigment attribution still depends on context, depth sensitivity, absorption, matrix effects, and corroborating evidence.",
    sourceIds: [
      "mauritshuis-examination-methods",
      "delaney-2020-pigment-distribution",
    ],
  },
  "mercury-vermilion-context": {
    id: "mercury-vermilion-context",
    statement:
      "Mercury distribution is consistent with vermilion in the studied context, but the Hg channel itself does not automatically print a pigment name.",
    sourceIds: [
      "mauritshuis-examination-methods",
      "delaney-2020-pigment-distribution",
    ],
  },
  "red-lake-ris-nondetection": {
    id: "red-lake-ris-nondetection",
    statement:
      "Wide-field RIS did not directly detect red lake in the Girl’s flesh tones at the available signal-to-noise; that non-detection is not evidence of absence.",
    sourceIds: ["delaney-2020-pigment-distribution"],
  },
  "red-lake-fors-fis-evidence": {
    id: "red-lake-fors-fis-evidence",
    statement:
      "Higher-sensitivity FORS measurements at lip sites and FIS fluorescence maps supplied weak optical evidence that narrows the red-lake interpretation.",
    sourceIds: ["delaney-2020-pigment-distribution"],
  },
  "potassium-ambiguity": {
    id: "potassium-ambiguity",
    statement:
      "Potassium near the lips remains non-decisive because K can be associated with several materials, including ultramarine, green earth, smalt, and iron earth.",
    sourceIds: ["delaney-2020-pigment-distribution"],
  },
  "red-lake-bounded-support": {
    id: "red-lake-bounded-support",
    statement:
      "Registered elemental and optical evidence together supports red lake in the lips and cheek while retaining the limits of each individual method.",
    sourceIds: ["delaney-2020-pigment-distribution"],
  },
  "headscarf-ultramarine-lead-white": {
    id: "headscarf-ultramarine-lead-white",
    statement:
      "The pigment-distribution study supports an ultramarine and lead-white mixture in passages of the Girl’s blue headscarf.",
    sourceIds: ["delaney-2020-pigment-distribution"],
  },
  "conservation-record-boundary": {
    id: "conservation-record-boundary",
    statement:
      "A conservation conclusion is bounded by registered method coverage, layer sensitivity, and the stated limits of elemental, optical, and topographic records.",
    sourceIds: [
      "delaney-2020-pigment-distribution",
      "van-loon-2019-skin-tones",
      "elkhuizen-2019-3d-scanning",
    ],
  },
} as const satisfies Record<PigmentWithoutTouchClaimId, PigmentWithoutTouchClaim>;

export const PIGMENT_WITHOUT_TOUCH_SCENE_CLAIMS = {
  1: {
    heading: ["object-study-2018"],
    visual: ["registered-multimodal-records", "no-new-sampling-boundary"],
    beats: [
      ["registered-multimodal-records"],
      ["no-new-sampling-boundary"],
    ],
    boundaries: [
      ["registered-multimodal-records"],
      ["no-new-sampling-boundary"],
    ],
    evidence: [["no-new-sampling-boundary"]],
  },
  2: {
    heading: [
      "ma-xrf-element-distribution",
      "ris-fis-fors-complementarity",
      "xray-nir-layer-record",
      "surface-topography-record",
    ],
    visual: [
      "ma-xrf-element-distribution",
      "ris-fis-fors-complementarity",
      "xray-nir-layer-record",
      "surface-topography-record",
    ],
    beats: [
      ["ma-xrf-element-distribution"],
      ["ris-fis-fors-complementarity"],
      ["xray-nir-layer-record"],
      ["surface-topography-record"],
    ],
    boundaries: [
      ["ma-xrf-element-distribution", "element-map-not-pigment-label"],
      ["ris-fis-fors-complementarity"],
      ["xray-nir-layer-record"],
      ["surface-topography-record"],
    ],
    evidence: [
      ["ma-xrf-element-distribution", "element-map-not-pigment-label"],
      ["ris-fis-fors-complementarity"],
      ["xray-nir-layer-record"],
      ["surface-topography-record"],
    ],
  },
  3: {
    heading: ["element-map-not-pigment-label"],
    visual: [
      "ma-xrf-element-distribution",
      "mercury-vermilion-context",
      "element-map-not-pigment-label",
    ],
    beats: [["mercury-vermilion-context", "element-map-not-pigment-label"]],
    boundaries: [["element-map-not-pigment-label"]],
    evidence: [
      ["ma-xrf-element-distribution"],
      ["mercury-vermilion-context"],
      ["element-map-not-pigment-label"],
    ],
  },
  4: {
    heading: ["red-lake-bounded-support", "potassium-ambiguity"],
    visual: ["red-lake-bounded-support"],
    beats: [
      ["red-lake-ris-nondetection"],
      ["red-lake-fors-fis-evidence"],
      ["red-lake-bounded-support", "potassium-ambiguity"],
    ],
    boundaries: [
      ["red-lake-ris-nondetection"],
      ["red-lake-fors-fis-evidence"],
      ["red-lake-bounded-support", "potassium-ambiguity"],
    ],
    evidence: [
      ["red-lake-ris-nondetection"],
      ["red-lake-fors-fis-evidence"],
      ["potassium-ambiguity"],
    ],
    progressiveEvidence: true,
  },
  5: {
    heading: ["conservation-record-boundary"],
    visual: [
      "ma-xrf-element-distribution",
      "ris-fis-fors-complementarity",
      "red-lake-bounded-support",
      "headscarf-ultramarine-lead-white",
      "element-map-not-pigment-label",
      "potassium-ambiguity",
      "conservation-record-boundary",
    ],
    beats: [["conservation-record-boundary"]],
    boundaries: [["conservation-record-boundary"]],
    evidence: [
      ["ma-xrf-element-distribution", "ris-fis-fors-complementarity"],
      ["red-lake-bounded-support", "headscarf-ultramarine-lead-white"],
      ["element-map-not-pigment-label"],
      ["potassium-ambiguity"],
    ],
  },
} as const satisfies Record<SceneId, SceneClaimMap>;

function getEvidenceClaimIds(
  sceneId: SceneId,
  index: number,
): ClaimIdList {
  return (
    PIGMENT_WITHOUT_TOUCH_SCENE_CLAIMS[sceneId].evidence[index] ??
    PIGMENT_WITHOUT_TOUCH_SCENE_CLAIMS[sceneId].visual
  );
}

function getVisibleClaimIds(
  sceneId: SceneId,
  beat: number,
): PigmentWithoutTouchClaimId[] {
  const sceneClaims: SceneClaimMap =
    PIGMENT_WITHOUT_TOUCH_SCENE_CLAIMS[sceneId];
  const evidence = sceneClaims.progressiveEvidence
    ? sceneClaims.evidence.slice(0, beat + 1)
    : sceneClaims.evidence;

  return [
    ...new Set<PigmentWithoutTouchClaimId>([
      ...sceneClaims.heading,
      ...sceneClaims.visual,
      ...(sceneClaims.beats[beat] ?? sceneClaims.beats[0]),
      ...(sceneClaims.boundaries[beat] ?? sceneClaims.boundaries[0]),
      ...evidence.flat(),
    ]),
  ];
}

function getSourceIds(
  claimIds: readonly PigmentWithoutTouchClaimId[],
): PigmentWithoutTouchSourceId[] {
  const requiredSourceIds = new Set<PigmentWithoutTouchSourceId>();

  for (const claimId of claimIds) {
    for (const sourceId of PIGMENT_WITHOUT_TOUCH_CLAIMS[claimId].sourceIds) {
      requiredSourceIds.add(sourceId);
    }
  }

  return PIGMENT_WITHOUT_TOUCH_SOURCES.filter((source) =>
    requiredSourceIds.has(source.id),
  ).map((source) => source.id);
}

function getSourceRefs(
  sourceIds: readonly PigmentWithoutTouchSourceId[],
): string {
  return sourceIds
    .map(
      (sourceId) =>
        PIGMENT_WITHOUT_TOUCH_SOURCES.find((source) => source.id === sourceId)
          ?.stamp ?? sourceId,
    )
    .join(" · ");
}

function getSourceStamp(
  sourceIds: readonly PigmentWithoutTouchSourceId[],
  language: Language,
): string {
  return `${language === "zh" ? "来源" : "SOURCES"} · ${getSourceRefs(sourceIds)}`;
}

function claimData(claimIds: readonly PigmentWithoutTouchClaimId[]) {
  const sourceIds = getSourceIds(claimIds);

  return {
    "data-claim-ids": claimIds.join(" "),
    "data-source-ids": sourceIds.join(" "),
  };
}

const COPY: Record<SceneId, Record<Language, SceneCopy>> = {
  1: {
    en: {
      code: "GITS / OBJECT REGISTER",
      title: "Identify the pigment without touching it",
      subtitle:
        "Girl with a Pearl Earring · Mauritshuis 670 · one registered coordinate frame for evidence collected at different scales.",
      beats: [
        {
          action: "Register the object",
          title: "One object, one coordinate frame",
          body: "Visible, spectral, elemental, and topographic records become comparable only after they share position.",
        },
        {
          action: "Fix the evidence boundary",
          title: "No new sampling in this walkthrough",
          body: "Published studies sometimes compare scans with archived micro-samples; that corroboration is labeled instead of being folded into the non-invasive claim.",
        },
      ],
    },
    zh: {
      code: "GITS / 对象登记",
      title: "不触碰，也能逐步识别颜料",
      subtitle:
        "《戴珍珠耳环的少女》· Mauritshuis 670 · 用同一坐标框登记不同尺度的证据。",
      beats: [
        {
          action: "登记对象",
          title: "一件作品，一套坐标",
          body: "可见光、光谱、元素与表面形貌记录，只有对齐位置后才可比较。",
        },
        {
          action: "固定证据边界",
          title: "本讲解不新增取样",
          body: "论文有时用既有微样本对照扫描结果；这类佐证会明确标记，不混入“非侵入”主张。",
        },
      ],
    },
  },
  2: {
    en: {
      code: "GITS / METHOD REGISTER",
      title: "Register what each instrument can see",
      subtitle:
        "A method earns a row for its measurement and a second row for its blind spot. Selection changes; the ledger does not move.",
      beats: [
        {
          action: "Select MA-XRF",
          title: "Element distribution",
          body: "Map elemental channels before proposing a material name.",
        },
        {
          action: "Select RIS and FIS",
          title: "Optical and molecular signatures",
          body: "Use reflectance and fluorescence behavior to narrow pigment families.",
        },
        {
          action: "Select X-ray and NIR",
          title: "Density and underlayers",
          body: "Read dense lead-bearing passages and carbon-rich structures beneath the visible surface.",
        },
        {
          action: "Select OCT and 3D microscopy",
          title: "Surface topology",
          body: "Record height, cracks, and impasto without pretending topography identifies chemistry.",
        },
      ],
    },
    zh: {
      code: "GITS / 方法登记",
      title: "先登记每台仪器能看见什么",
      subtitle: "每种方法同时登记“测到什么”和“看不到什么”；切换选择，正文位置不动。",
      beats: [
        {
          action: "选择 MA-XRF",
          title: "元素分布",
          body: "先画元素通道，再提出材料名称。",
        },
        {
          action: "选择 RIS 与 FIS",
          title: "光学与分子特征",
          body: "用反射与荧光行为缩小颜料候选范围。",
        },
        {
          action: "选择 X 光与近红外",
          title: "密度与底层",
          body: "读取含铅的高密度区域和可见层下含碳结构。",
        },
        {
          action: "选择 OCT 与 3D 显微",
          title: "表面形貌",
          body: "记录高度、裂纹与厚涂，但不把形貌假装成化学识别。",
        },
      ],
    },
  },
  3: {
    en: {
      code: "GITS / ELEMENT MAP",
      title: "An element map is not a pigment label",
      subtitle:
        "The mercury channel shows where a mercury-bearing material contributes signal. Attribution still needs context, depth, and another kind of evidence.",
      beats: [
        {
          action: "Hold the mercury map static",
          title: "Element first; material second",
          body: "Hg can support a vermilion inference in this context, but the map does not print the pigment name by itself.",
        },
      ],
    },
    zh: {
      code: "GITS / 元素图",
      title: "元素分布图不是颜料标签",
      subtitle:
        "汞通道显示含汞材料在哪里贡献信号；归属仍要结合语境、探测深度和另一类证据。",
      beats: [
        {
          action: "保持汞元素图静止",
          title: "先说元素，再说材料",
          body: "在这一语境中，Hg 可支持朱砂推断；但元素图不会自动印出颜料名称。",
        },
      ],
    },
  },
  4: {
    en: {
      code: "GITS / CROSS-CHECK",
      title: "Keep disagreement in the ledger",
      subtitle:
        "One red-lake inference changes confidence as wide-field, point, fluorescence, and elemental observations are compared—not averaged away.",
      beats: [
        {
          action: "Record the wide-field non-detection",
          title: "RIS does not show direct evidence",
          body: "A non-detection at the available signal-to-noise is a limit, not proof of absence.",
        },
        {
          action: "Add higher-sensitivity optical evidence",
          title: "FORS and FIS recover weak evidence",
          body: "Lip-site absorption bands and mapped fluorescence narrow the material interpretation.",
        },
        {
          action: "Bound the inference",
          title: "Support the claim; retain the ambiguity",
          body: "Combined evidence supports red lake in the lips and cheek, while potassium alone remains non-decisive.",
        },
      ],
    },
    zh: {
      code: "GITS / 交叉核验",
      title: "把分歧留在账本里",
      subtitle:
        "同一条红色有机湖颜料推断，要比较广域、点测、荧光与元素观察；不能把分歧平均掉。",
      beats: [
        {
          action: "登记广域未检出",
          title: "RIS 未显示直接证据",
          body: "在现有信噪比下未检出，是方法边界，不等于不存在。",
        },
        {
          action: "加入更高灵敏度的光学证据",
          title: "FORS 与 FIS 找到弱证据",
          body: "嘴唇点位的吸收带与荧光分布共同收窄材料解释。",
        },
        {
          action: "限定推断范围",
          title: "支持结论，同时保留歧义",
          body: "组合证据支持嘴唇与脸颊存在红色有机湖颜料；单独的钾信号仍不足以定论。",
        },
      ],
    },
  },
  5: {
    en: {
      code: "GITS / CONSERVATION RECORD",
      title: "Close with claims, limits, and provenance",
      subtitle:
        "A conservation record separates observation, material inference, confidence boundary, unresolved questions, and the origin of every visual asset.",
      beats: [
        {
          action: "File the evidence record",
          title: "Auditable, not automatic",
          body: "Multiple registered methods constrain a pigment interpretation; none turns a single channel into a complete answer.",
        },
      ],
    },
    zh: {
      code: "GITS / 保护记录",
      title: "以结论、边界与来源收束",
      subtitle:
        "保护记录把观察、材料推断、置信边界、未解问题和每个视觉资产的来源分开登记。",
      beats: [
        {
          action: "归档证据记录",
          title: "可审计，不自动判定",
          body: "多种已对齐的方法共同约束颜料解释；没有任何单一通道能自动给出完整答案。",
        },
      ],
    },
  },
};

const METHODS: Record<Language, MethodCopy[]> = {
  en: [
    {
      id: "ma-xrf",
      name: "MA-XRF",
      channel: "Element channel",
      measures: "MEASURES · emitted X-ray signatures and spatial element distribution",
      cannot: "CANNOT DECIDE · a unique pigment name, concentration, or layer without context and matrix effects",
      scope: "Whole painting · surface + subsurface sensitivity",
    },
    {
      id: "ris-fis",
      name: "RIS + FIS",
      channel: "Optical channel",
      measures: "MEASURES · reflectance absorptions and molecular fluorescence across registered pixels",
      cannot: "CANNOT DECIDE · every weak or dark material when signal-to-noise and absorption suppress a feature",
      scope: "Wide-field spectra · selected point checks",
    },
    {
      id: "xray-nir",
      name: "X-RAY + NIR",
      channel: "Layer channel",
      measures: "MEASURES · density contrast, lead-bearing passages, and carbon-rich underlayers",
      cannot: "CANNOT DECIDE · a complete layer recipe or every material with one image",
      scope: "Transmitted density · near-infrared response",
    },
    {
      id: "oct-3d",
      name: "MS-OCT + 3D",
      channel: "Surface channel",
      measures: "MEASURES · surface height, cracks, impasto, and local topographic change",
      cannot: "CANNOT DECIDE · pigment chemistry; high-resolution tiles also trade field-of-view for time",
      scope: "Small precise fields · stitched surface record",
    },
  ],
  zh: [
    {
      id: "ma-xrf",
      name: "MA-XRF",
      channel: "元素通道",
      measures: "测量 · X 射线发射特征与元素空间分布",
      cannot: "无法单独判断 · 唯一颜料名称、浓度或层位；还要考虑语境与基体效应",
      scope: "全画幅 · 对表层与下层均有灵敏度",
    },
    {
      id: "ris-fis",
      name: "RIS + FIS",
      channel: "光学通道",
      measures: "测量 · 已配准像素的反射吸收与分子荧光",
      cannot: "无法单独判断 · 信噪比不足或吸收压低特征时的所有弱信号与深色材料",
      scope: "广域光谱 · 选定点位复核",
    },
    {
      id: "xray-nir",
      name: "X 光 + 近红外",
      channel: "层次通道",
      measures: "测量 · 密度反差、含铅区域与含碳底层",
      cannot: "无法单独判断 · 一张影像无法给出完整层次配方或所有材料",
      scope: "透射密度 · 近红外响应",
    },
    {
      id: "oct-3d",
      name: "MS-OCT + 3D",
      channel: "表面通道",
      measures: "测量 · 表面高度、裂纹、厚涂与局部形貌变化",
      cannot: "无法单独判断 · 颜料化学；高分辨率小块还要用视野换取时间",
      scope: "小型精密视野 · 拼接表面记录",
    },
  ],
};

const RED_LAKE_EVIDENCE: Record<Language, EvidenceCopy[]> = {
  en: [
    {
      id: "ris",
      method: "RIS · wide field",
      observation: "No direct red-lake signal in the flesh tones",
      boundary: "Non-detection at this signal-to-noise is not absence.",
    },
    {
      id: "fors-fis",
      method: "FORS + FIS · optical",
      observation:
        "Higher-SNR lip sites show two weak absorption bands; fluorescence imaging maps red-lake response",
      boundary: "Localized and optical evidence must stay registered to the same area.",
    },
    {
      id: "potassium",
      method: "MA-XRF K · element",
      observation: "Potassium emission increases around the lips",
      boundary:
        "Potassium remains ambiguous: it can also relate to ultramarine, green earth, smalt, or iron earth.",
    },
  ],
  zh: [
    {
      id: "ris",
      method: "RIS · 广域",
      observation: "肤色区域未出现红色有机湖颜料的直接信号",
      boundary: "这一信噪比下未检出，不等于不存在。",
    },
    {
      id: "fors-fis",
      method: "FORS + FIS · 光学",
      observation: "嘴唇高信噪比点位出现两条弱吸收带；荧光成像绘出相关响应",
      boundary: "局部与光学证据必须配准到同一区域。",
    },
    {
      id: "potassium",
      method: "MA-XRF K · 元素",
      observation: "嘴唇附近的钾发射增强",
      boundary: "钾仍有歧义：也可能关联群青、绿土、花青或铁土颜料。",
    },
  ],
};

const MERCURY_CELLS = [
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 1, 1, 1, 0, 0, 0, 0,
  0, 0, 1, 2, 3, 2, 1, 0, 0, 0,
  0, 1, 2, 3, 4, 3, 2, 1, 0, 0,
  0, 1, 2, 2, 3, 3, 2, 1, 0, 0,
  0, 0, 1, 1, 4, 4, 1, 0, 0, 0,
  0, 0, 0, 1, 2, 2, 1, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
] as const;

const SWATCHES: Record<
  Language,
  Array<{ scene: SceneId; label: string; color: string }>
> = {
  en: [
    { scene: 1, label: "Object", color: "#cfc8b5" },
    { scene: 2, label: "Methods", color: "#315d86" },
    { scene: 3, label: "Element", color: "#b65a47" },
    { scene: 4, label: "Cross-check", color: "#ab7a2e" },
    { scene: 5, label: "Record", color: "#2f7062" },
  ],
  zh: [
    { scene: 1, label: "对象", color: "#cfc8b5" },
    { scene: 2, label: "方法", color: "#315d86" },
    { scene: 3, label: "元素", color: "#b65a47" },
    { scene: 4, label: "交叉核验", color: "#ab7a2e" },
    { scene: 5, label: "记录", color: "#2f7062" },
  ],
};

function isSceneId(value: number): value is SceneId {
  return SCENE_IDS.includes(value as SceneId);
}

function clampBeat(sceneId: SceneId, beat: number): number {
  const lastBeat = COPY[sceneId].en.beats.length - 1;
  return Math.max(0, Math.min(beat, lastBeat));
}

function SceneShell({
  sceneId,
  beat,
  language,
  children,
}: {
  sceneId: SceneId;
  beat: number;
  language: Language;
  children: ReactNode;
}) {
  const scene = COPY[sceneId][language];
  const activeBeat = scene.beats[beat];
  const sceneClaims = PIGMENT_WITHOUT_TOUCH_SCENE_CLAIMS[sceneId];
  const beatClaimIds = sceneClaims.beats[beat] ?? sceneClaims.beats[0];
  const boundaryClaimIds =
    sceneClaims.boundaries[beat] ?? sceneClaims.boundaries[0];
  const visibleClaimIds = getVisibleClaimIds(sceneId, beat);
  const sourceIds = getSourceIds(visibleClaimIds);

  return (
    <section
      className={styles.scene}
      data-scene-content={sceneId}
      data-beat={beat}
      data-visible-claim-ids={visibleClaimIds.join(" ")}
      data-source-ids={sourceIds.join(" ")}
      aria-label={scene.title}
    >
      <header className={styles.sceneHeader} data-beat-layout-item="true">
        <div className={styles.headerCode}>{scene.code}</div>
        <div className={styles.headerRule} aria-hidden="true" />
        <div className={styles.headerObject}>MAURITSHUIS · INV. 670</div>
      </header>

      <div
        className={styles.titleRow}
        data-beat-layout-item="true"
        data-claim-field="heading"
        {...claimData(sceneClaims.heading)}
      >
        <div className={styles.sceneNumber}>{String(sceneId).padStart(2, "0")}</div>
        <div>
          <h1>{scene.title}</h1>
          <p>{scene.subtitle}</p>
        </div>
      </div>

      <main
        className={styles.sceneBody}
        data-beat-layout-item="true"
        data-claim-field="visual"
        {...claimData(sceneClaims.visual)}
      >
        {children}
      </main>

      <footer className={styles.sceneFooter} data-beat-layout-item="true">
        <div data-claim-field="beat" {...claimData(beatClaimIds)}>
          <span>{activeBeat.action}</span>
          <strong>{activeBeat.title}</strong>
          <b
            className={styles.sourceStamp}
            data-source-stamp="true"
            data-source-ids={sourceIds.join(" ")}
            data-source-refs={getSourceRefs(sourceIds)}
          >
            {getSourceStamp(sourceIds, language)}
          </b>
        </div>
        <p data-claim-field="boundary" {...claimData(boundaryClaimIds)}>
          {activeBeat.body}
        </p>
        <div className={styles.beatTicks} aria-label={language === "zh" ? "场景节拍" : "Scene beats"}>
          {scene.beats.map((item, index) => (
            <i
              key={item.action}
              data-state={index === beat ? "active" : index < beat ? "history" : "waiting"}
            />
          ))}
        </div>
      </footer>
    </section>
  );
}

function OverviewScene({ beat, language }: { beat: number; language: Language }) {
  const boundaryClaimIds = getEvidenceClaimIds(1, 0);
  const labels =
    language === "zh"
      ? {
          register: "对象登记",
          object: "对象 / 布面油画",
          date: "研究 / 2018",
          frame: "坐标 / 已配准",
          boundary: "不新增取样",
          boundaryText: "非侵入全画幅证据为主；既有微样本仅作为明确标记的论文佐证。",
          schematic: "原创抽象坐标示意，不复制作品图像",
          points: ["脸颊 ROI", "嘴唇 ROI", "头巾 ROI"],
        }
      : {
          register: "OBJECT REGISTER",
          object: "OBJECT / OIL ON CANVAS",
          date: "STUDY / 2018",
          frame: "COORDINATES / REGISTERED",
          boundary: "NO NEW SAMPLING",
          boundaryText:
            "Non-invasive full-field evidence leads; archived micro-samples appear only as explicitly labeled corroboration.",
          schematic: "Original abstract coordinate schematic · no artwork image reproduced",
          points: ["CHEEK ROI", "LIP ROI", "SCARF ROI"],
        };

  return (
    <div className={styles.overviewLayout}>
      <div className={styles.objectLedger} data-beat-layout-item="true">
        <div className={styles.ledgerCaption}>{labels.register}</div>
        {[labels.object, labels.date, labels.frame].map((label, index) => (
          <div className={styles.registerRow} key={label}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <strong>{label}</strong>
            <i>{index === 2 ? "LOCKED" : "FILED"}</i>
          </div>
        ))}
        <div
          className={styles.boundaryCard}
          data-evidence-id="sampling-boundary"
          data-evidence-visible="true"
          data-claim-field="evidence"
          data-active={beat >= 1 ? "true" : "false"}
          {...claimData(boundaryClaimIds)}
        >
          <strong>{labels.boundary}</strong>
          <p>{labels.boundaryText}</p>
        </div>
      </div>

      <div
        className={styles.overviewSchematic}
        data-beat-layout-item="true"
        data-painting-overview="original-schematic"
        data-coordinate-system="registered"
      >
        <div className={styles.coordinateLabels}>
          <span>X / 000–390</span>
          <span>Y / 000–445</span>
        </div>
        <svg
          className={styles.overviewSvg}
          viewBox="0 0 760 560"
          role="img"
          aria-label={labels.schematic}
        >
          {Array.from({ length: 9 }, (_, index) => (
            <line key={`v-${index}`} x1={80 + index * 75} x2={80 + index * 75} y1="40" y2="520" />
          ))}
          {Array.from({ length: 7 }, (_, index) => (
            <line key={`h-${index}`} x1="80" x2="680" y1={40 + index * 80} y2={40 + index * 80} />
          ))}
          <path className={styles.abstractHead} d="M 304 120 C 392 68 502 126 516 234 C 528 332 464 410 366 398 C 278 386 238 318 244 236 C 248 184 266 146 304 120 Z" />
          <path className={styles.abstractScarf} d="M 286 126 C 334 64 452 62 522 130 L 580 276 L 496 254 C 470 144 370 116 286 180 Z" />
          <path className={styles.abstractShoulder} d="M 244 378 C 324 342 468 354 560 466 L 196 466 C 202 424 214 400 244 378 Z" />
          <circle className={styles.roiOne} cx="406" cy="270" r="56" />
          <circle className={styles.roiTwo} cx="438" cy="326" r="24" />
          <circle className={styles.roiThree} cx="430" cy="146" r="68" />
          <text x="474" y="258">A</text>
          <text x="470" y="340">B</text>
          <text x="512" y="136">C</text>
        </svg>
        <div className={styles.roiLegend}>
          {labels.points.map((point, index) => (
            <span key={point}>
              <i>{String.fromCharCode(65 + index)}</i>
              {point}
            </span>
          ))}
        </div>
        <p>{labels.schematic}</p>
      </div>
    </div>
  );
}

function MethodRegisterScene({ beat, language }: { beat: number; language: Language }) {
  const methods = METHODS[language];
  const selected = methods[beat];

  return (
    <div className={styles.methodLayout}>
      <div className={styles.methodTable} data-beat-layout-item="true">
        <div className={styles.methodHeader}>
          <span>{language === "zh" ? "方法" : "METHOD"}</span>
          <span>{language === "zh" ? "测量与边界" : "MEASUREMENT + LIMIT"}</span>
        </div>
        {methods.map((method, index) => {
          const isSelected = index === beat;
          const claimIds = getEvidenceClaimIds(2, index);
          return (
            <article
              className={styles.methodRow}
              data-method-id={method.id}
              data-method-selected={isSelected ? "true" : "false"}
              data-evidence-id={method.id}
              data-evidence-visible="true"
              data-claim-field="evidence"
              {...claimData(claimIds)}
              key={method.id}
            >
              <div>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{method.name}</strong>
                <small>{method.channel}</small>
              </div>
              <div>
                <p>{method.measures}</p>
                <p>{method.cannot}</p>
              </div>
            </article>
          );
        })}
      </div>

      <aside className={styles.methodFocus} data-beat-layout-item="true">
        <div className={styles.focusDial} aria-hidden="true">
          <span>{String(beat + 1).padStart(2, "0")}</span>
          <i />
        </div>
        <p>{selected.scope}</p>
        <h2>{selected.name}</h2>
        <strong>{selected.channel}</strong>
        <div className={styles.spectrumGlyph} aria-hidden="true">
          {Array.from({ length: 15 }, (_, index) => (
            <i key={index} style={{ height: `${18 + ((index * 17) % 60)}%` }} />
          ))}
        </div>
        <small>
          {language === "zh"
            ? "高亮只表示当前阅读行，不表示“通过”。"
            : "Highlight means current reading row—not a pass state."}
        </small>
      </aside>
    </div>
  );
}

function ElementMapScene({ language }: { language: Language }) {
  const labels =
    language === "zh"
      ? {
          channel: "MA-XRF 元素通道 / Hg-L",
          title: "Hg 信号 ≠ 自动等于朱砂",
          body: "在嘴唇和肤色语境中，汞分布与朱砂使用相符；但元素通道仍受层位、吸收与基体效应影响。",
          observe: "观察",
          observation: "局部汞发射增强",
          infer: "受限推断",
          inference: "含汞材料；结合其他证据可支持朱砂",
          reject: "拒绝",
          rejected: "把每个亮像素直接改名为颜料",
          scale: "相对信号 / 非浓度刻度",
        }
      : {
          channel: "MA-XRF ELEMENT CHANNEL / Hg-L",
          title: "Hg signal ≠ vermilion by itself",
          body: "Around lips and flesh, mercury distribution is consistent with vermilion use; the element channel still depends on layer, absorption, and matrix effects.",
          observe: "OBSERVATION",
          observation: "Localized mercury emission rises",
          infer: "BOUNDED INFERENCE",
          inference: "Mercury-bearing material; vermilion supported with corroboration",
          reject: "REJECT",
          rejected: "Rename every bright pixel as a pigment",
          scale: "RELATIVE SIGNAL / NOT A CONCENTRATION SCALE",
        };

  return (
    <div className={styles.elementLayout}>
      <div
        className={styles.elementMap}
        data-beat-layout-item="true"
        data-element-map="mercury"
        data-element-not-pigment="true"
        data-map-motion="static"
      >
        <div className={styles.elementMapHeader}>
          <strong>{labels.channel}</strong>
          <span>{labels.scale}</span>
        </div>
        <div className={styles.elementGrid} aria-label={labels.channel}>
          {MERCURY_CELLS.map((level, index) => (
            <i key={index} data-level={level} />
          ))}
          <div className={styles.mapContour} aria-hidden="true" />
          <div className={styles.mapMouth} aria-hidden="true" />
        </div>
        <div className={styles.elementScale} aria-hidden="true">
          {[0, 1, 2, 3, 4].map((level) => (
            <i key={level} data-level={level} />
          ))}
        </div>
      </div>

      <aside className={styles.elementNotes} data-beat-layout-item="true">
        <h2>{labels.title}</h2>
        <p>{labels.body}</p>
        {[
          [labels.observe, labels.observation],
          [labels.infer, labels.inference],
          [labels.reject, labels.rejected],
        ].map(([label, text], index) => {
          const claimIds = getEvidenceClaimIds(3, index);

          return (
            <div
              className={styles.inferenceRow}
              data-kind={index === 2 ? "reject" : "record"}
              data-evidence-id={`element-${index + 1}`}
              data-evidence-visible="true"
              data-claim-field="evidence"
              {...claimData(claimIds)}
              key={label}
            >
              <span>{label}</span>
              <strong>{text}</strong>
            </div>
          );
        })}
      </aside>
    </div>
  );
}

function CrossCheckScene({ beat, language }: { beat: number; language: Language }) {
  const evidence = RED_LAKE_EVIDENCE[language];
  const conclusion =
    language === "zh"
      ? "嘴唇 + 脸颊：组合证据支持红色有机湖颜料；钾通道单独不足以定论。"
      : "Lips + cheek: combined evidence supports red lake; the potassium channel alone remains non-decisive.";

  return (
    <div className={styles.crossCheckLayout}>
      <div className={styles.evidenceLedger} data-beat-layout-item="true">
        <div className={styles.evidenceHeader}>
          <span>{language === "zh" ? "方法" : "METHOD"}</span>
          <span>{language === "zh" ? "观察" : "OBSERVATION"}</span>
          <span>{language === "zh" ? "边界" : "BOUNDARY"}</span>
        </div>
        {evidence.map((row, index) => {
          const claimIds = getEvidenceClaimIds(4, index);
          const sourceIds = getSourceIds(claimIds);

          return (
            <article
              className={styles.evidenceRow}
              data-evidence-visible={index <= beat ? "true" : "false"}
              data-evidence-id={row.id}
              data-claim-field="evidence"
              {...claimData(claimIds)}
              key={row.id}
            >
              <div>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{row.method}</strong>
                <small
                  data-source-ref="true"
                  data-source-ids={sourceIds.join(" ")}
                >
                  {getSourceRefs(sourceIds)}
                </small>
              </div>
              <p>{row.observation}</p>
              <p>{row.boundary}</p>
            </article>
          );
        })}
      </div>

      <aside
        className={styles.crossCheckConclusion}
        data-beat-layout-item="true"
        data-inference-state={beat >= 2 ? "bounded-support" : "open"}
      >
        <span>{language === "zh" ? "推断状态" : "INFERENCE STATE"}</span>
        <strong>
          {beat >= 2
            ? language === "zh"
              ? "有边界的支持"
              : "BOUNDED SUPPORT"
            : language === "zh"
              ? "保持开放"
              : "KEEP OPEN"}
        </strong>
        <p>{conclusion}</p>
        <div className={styles.confidenceScale} aria-hidden="true">
          {[0, 1, 2].map((index) => (
            <i key={index} data-filled={index <= beat ? "true" : "false"} />
          ))}
        </div>
      </aside>
    </div>
  );
}

function ConservationRecordScene({ language }: { language: Language }) {
  const rows =
    language === "zh"
      ? [
          ["观察", "Hg、K、Pb 等通道是元素分布；RIS/FIS/FORS 是光学或分子证据。"],
          ["结论", "多方法配准后，可支持嘴唇与脸颊的红色有机湖颜料，以及头巾中群青与铅白的组合。"],
          ["置信边界", "信号强度受探测深度、吸收、基体效应和信噪比影响。"],
          ["未解", "UNRESOLVED · 钾信号的单一来源、所有层次的完整配方、老化前的精确颜色。"],
        ]
      : [
          ["OBSERVATION", "Hg, K, and Pb channels are element distributions; RIS, FIS, and FORS add optical or molecular evidence."],
          ["CONCLUSION", "Registered methods support red lake at lips and cheek, plus ultramarine mixed with lead white in the headscarf."],
          ["CONFIDENCE LIMIT", "Signal intensity depends on depth sensitivity, absorption, matrix effects, and signal-to-noise."],
          ["UNRESOLVED", "UNRESOLVED · one source for potassium, every layer’s complete recipe, and exact pre-ageing colour."],
        ];

  return (
    <div className={styles.recordLayout}>
      <div className={styles.recordSheet} data-beat-layout-item="true">
        <div className={styles.recordHeading}>
          <span>{language === "zh" ? "保护记录" : "CONSERVATION RECORD"}</span>
          <strong>GITS / PIGMENT ATTRIBUTION / REV-A</strong>
        </div>
        {rows.map(([label, text], index) => {
          const claimIds = getEvidenceClaimIds(5, index);

          return (
            <div
              className={styles.recordRow}
              data-record-kind={index}
              data-evidence-id={`record-${index + 1}`}
              data-evidence-visible="true"
              data-claim-field="evidence"
              {...claimData(claimIds)}
              key={label}
            >
              <span>{label}</span>
              <p>{text}</p>
            </div>
          );
        })}
      </div>

      <aside className={styles.provenanceSheet} data-beat-layout-item="true">
        <div>
          <span>{language === "zh" ? "来源账" : "SOURCE LEDGER"}</span>
          {PIGMENT_WITHOUT_TOUCH_SOURCES.map((source, index) => (
            <p key={source.id} data-source-ref="true" data-source-ids={source.id}>
              <i>{String(index + 1).padStart(2, "0")}</i>
              <strong>{source.stamp}</strong>
              <small>{source.authority}</small>
            </p>
          ))}
        </div>
        <div className={styles.assetRecord}>
          <span>{language === "zh" ? "资产来源" : "ASSET PROVENANCE"}</span>
          <strong>
            {language === "zh" ? "原创矢量示意" : "Original vector schematic"}
          </strong>
          <p>
            {language === "zh"
              ? "不复制作品图像 · 不请求远程素材 · 图形仅表达证据逻辑。"
              : "No artwork image reproduced · no remote asset request · geometry represents evidence logic only."}
          </p>
        </div>
      </aside>
    </div>
  );
}

function ScenePanel({
  sceneId,
  beat,
  language,
}: {
  sceneId: SceneId;
  beat: number;
  language: Language;
}) {
  const safeBeat = clampBeat(sceneId, beat);
  let body: ReactNode;

  if (sceneId === 1) body = <OverviewScene beat={safeBeat} language={language} />;
  else if (sceneId === 2) body = <MethodRegisterScene beat={safeBeat} language={language} />;
  else if (sceneId === 3) body = <ElementMapScene language={language} />;
  else if (sceneId === 4) body = <CrossCheckScene beat={safeBeat} language={language} />;
  else body = <ConservationRecordScene language={language} />;

  return (
    <SceneShell sceneId={sceneId} beat={safeBeat} language={language}>
      {body}
    </SceneShell>
  );
}

function PigmentSwatchRail({
  activeScene,
  language,
  onNavigate,
}: {
  activeScene: SceneId;
  language: Language;
  onNavigate?: (scene: number, beat: number) => void;
}) {
  const [holding, setHolding] = useState(false);
  const swatches = SWATCHES[language];

  const stopPointer = (event: PointerEvent<HTMLElement>) => {
    event.stopPropagation();
  };

  const activate = (event: MouseEvent<HTMLButtonElement>, target: SceneId) => {
    event.preventDefault();
    event.stopPropagation();
    onNavigate?.(target, 0);
  };

  const keyboardTarget = (from: SceneId, key: string): SceneId | null => {
    if (key === "Home") return 1;
    if (key === "End") return 5;
    if (key === "ArrowDown" || key === "ArrowRight") {
      return Math.min(5, from + 1) as SceneId;
    }
    if (key === "ArrowUp" || key === "ArrowLeft") {
      return Math.max(1, from - 1) as SceneId;
    }
    if (key === " " || key === "Enter") return from;
    return null;
  };

  const handleSwatchKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    from: SceneId,
  ) => {
    const target = keyboardTarget(from, event.key);
    if (target === null) return;
    event.preventDefault();
    event.stopPropagation();
    if (event.repeat) return;
    onNavigate?.(target, 0);
  };

  const stopActivationKeyUp = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key !== " " && event.key !== "Enter") return;
    event.preventDefault();
    event.stopPropagation();
  };

  const beginHold = (event: PointerEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    event.currentTarget.setPointerCapture?.(event.pointerId);
    setHolding(true);
  };

  const endHold = (event: PointerEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (event.currentTarget.hasPointerCapture?.(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    setHolding(false);
  };

  const beginTouchHold = (event: TouchEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setHolding(true);
  };

  const endTouchHold = (event: TouchEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setHolding(false);
  };

  const handleHoldKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key !== " " && event.key !== "Enter") return;
    event.preventDefault();
    event.stopPropagation();
    if (event.repeat) return;
    setHolding(true);
  };

  const handleHoldKeyUp = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key !== " " && event.key !== "Enter") return;
    event.preventDefault();
    event.stopPropagation();
    setHolding(false);
  };

  return (
    <nav
      className={styles.swatchRail}
      aria-label={language === "zh" ? "颜料色样轨道场景导航" : "Pigment swatch rail scene navigation"}
      data-topic-navigation="true"
      data-navigation-geometry={NAVIGATION_PROFILE.geometry}
      data-navigation-carrier={NAVIGATION_PROFILE.carrier}
      data-navigation-invocation={NAVIGATION_PROFILE.invocation}
      data-navigation-feedback={NAVIGATION_PROFILE.feedback}
      data-holding={holding ? "true" : "false"}
      onPointerDown={stopPointer}
      onClick={(event) => event.stopPropagation()}
    >
      <div className={styles.railScale} aria-hidden="true">
        {Array.from({ length: 17 }, (_, index) => (
          <i key={index} data-major={index % 4 === 0 ? "true" : "false"} />
        ))}
      </div>
      <div className={styles.swatchStack}>
        {swatches.map((swatch) => {
          const active = swatch.scene === activeScene;
          return (
            <button
              type="button"
              className={styles.swatchButton}
              data-active={active ? "true" : "false"}
              aria-current={active ? "step" : undefined}
              aria-label={
                language === "zh"
                  ? `跳转到场景 ${swatch.scene}：${swatch.label}`
                  : `Jump to scene ${swatch.scene}: ${swatch.label}`
              }
              key={swatch.scene}
              style={{ "--swatch-color": swatch.color } as LedgerVariables}
              onPointerDown={stopPointer}
              onClick={(event) => activate(event, swatch.scene)}
              onKeyDown={(event) => handleSwatchKeyDown(event, swatch.scene)}
              onKeyUp={stopActivationKeyUp}
            >
              <span className={styles.swatchChip} aria-hidden="true" />
              <span className={styles.swatchIndex}>{String(swatch.scene).padStart(2, "0")}</span>
              <span className={styles.swatchLabel}>{swatch.label}</span>
            </button>
          );
        })}
      </div>
      <button
        type="button"
        className={styles.holdButton}
        aria-label={
          language === "zh"
            ? "按住以显示完整颜料色样轨道"
            : "Hold to reveal the full pigment swatch track"
        }
        aria-pressed={holding}
        onPointerDown={beginHold}
        onPointerUp={endHold}
        onPointerCancel={endHold}
        onTouchStart={beginTouchHold}
        onTouchEnd={endTouchHold}
        onKeyDown={handleHoldKeyDown}
        onKeyUp={handleHoldKeyUp}
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
        }}
      >
        <span aria-hidden="true">↕</span>
        {language === "zh" ? "按住看轨道" : "HOLD · TRACK"}
      </button>
    </nav>
  );
}

export function getMetadata(language: Language): StyleMetadata {
  return {
    id: "checklist-ledger",
    band: "text-report",
    name: language === "zh" ? "检查清单台账" : "Checklist Ledger",
    theme: language === "zh" ? "无损识色" : "Pigment Without Touch",
    densityLabel: language === "zh" ? "证据账本" : "Evidence Ledger",
    heroScene: 4,
    colors: {
      bg: "#f4f0e5",
      ink: "#17231f",
      panel: "#fbf8ef",
    },
    typography: {
      header: "Aptos 720",
      body: "Aptos 430",
    },
    tags: [
      "checklist-ledger",
      "conservation-science",
      "pigment-analysis",
      "evidence-report",
      "registered-imaging",
      "reading-first",
      "motion-2-of-5",
    ],
    fonts: ["Aptos", "Iowan Old Style", "cjk:PingFang SC", "cjk:Songti SC"],
    scenes: SCENE_IDS.map((sceneId) => ({
      id: sceneId,
      title: COPY[sceneId][language].title,
      beats: COPY[sceneId][language].beats.map((beat, index) => ({
        id: index,
        action: beat.action,
        title: beat.title,
        body: beat.body,
      })),
    })),
  };
}

export default function PigmentWithoutTouch({
  scene,
  beat,
  language,
  isThumbnail,
  reducedMotion,
  onNavigate,
}: BespokeStyleProps) {
  const activeScene = isSceneId(scene) ? scene : 1;
  const safeBeat = clampBeat(activeScene, beat);
  const motionOff = reducedMotion || isThumbnail;

  return (
    <div
      className={`${styles.root} ${motionOff ? styles.reducedMotion : ""}`}
      data-topic-id="pigment-without-touch"
      data-motion={motionOff ? "off" : "on"}
      data-transition-score="crossfade|hard-cut|linear-wipe|crossfade"
    >
      <div className={styles.paperGrain} aria-hidden="true" />
      <div className={styles.trackFrame}>
        <SpatialSceneTrack
          scene={activeScene}
          beat={safeBeat}
          sceneIds={SCENE_IDS}
          transitionKind={INCOMING_TRANSITION_KIND[activeScene]}
          transitionMap={TRANSITION_MAP}
          transitionDurationMs={680}
          reducedMotion={motionOff}
          beatLayoutModes={BEAT_LAYOUT_MODES}
          className={styles.track}
          renderScene={(sceneId, sceneBeat) => (
            <ScenePanel
              sceneId={sceneId as SceneId}
              beat={sceneBeat}
              language={language}
            />
          )}
        />
      </div>
      {!isThumbnail && (
        <PigmentSwatchRail
          activeScene={activeScene}
          language={language}
          onNavigate={onNavigate}
        />
      )}
    </div>
  );
}

export const pigmentWithoutTouchTopic = defineStyleTopic({
  id: "pigment-without-touch",
  topic: {
    en: "Pigment Without Touch",
    zh: "无损识色",
  },
  model: "GPT 5.6 Sol",
  component: PigmentWithoutTouch,
  getMetadata,
  navigation: NAVIGATION_PROFILE,
  sources: PIGMENT_WITHOUT_TOUCH_SOURCES,
  transitionScore: PIGMENT_WITHOUT_TOUCH_TRANSITION_SCORE,
});

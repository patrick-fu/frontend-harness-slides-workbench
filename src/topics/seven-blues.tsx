import { useState } from "react";
import type { KeyboardEvent, PointerEvent, TouchEvent } from "react";
import type { Source } from "../domain/evidence";
import {
  defineTopic,
  type TopicDefinition,
  type TopicMetadata,
  type TopicStageProps,
  type TopicTransitionScore,
} from "../domain/topic";
import SpatialSceneTrack from "../styles/SpatialSceneTrack";
import styles from "./seven-blues.module.css";

type Lang = "en" | "zh";
type SceneId = 1 | 2 | 3 | 4 | 5;
type SourceId =
  | "smithsonian-blue"
  | "getty-ultramarine"
  | "mci-azurite"
  | "getty-indigo"
  | "smithsonian-indigo-vat"
  | "getty-egyptian-blue"
  | "met-cobalt-blue"
  | "national-gallery-prussian-blue"
  | "harvard-structural-color";
type ClaimId =
  | "ultramarine-lazurite"
  | "azurite-copper-carbonate"
  | "azurite-grinding"
  | "indigo-plant-vat"
  | "indigo-oxidation"
  | "egyptian-blue-frit"
  | "egyptian-blue-luminescence"
  | "cobalt-aluminate"
  | "prussian-blue-mixed-valence"
  | "structural-blue"
  | "cultural-context-boundary"
  | "screen-is-not-material";

interface BlueClaim {
  id: ClaimId;
  statement: string;
  sourceIds: readonly SourceId[];
}

interface BlueSource extends Source {
  id: SourceId;
  accessDate: "2026-07-10";
  stamp: string;
  claimIds: readonly ClaimId[];
  boundary: string;
}

interface BeatCopy {
  action: string;
  title: string;
  body: string;
}

interface SceneCopy {
  kicker: string;
  title: string;
  deck: string;
  boundary: string;
  sourceLabel: string;
  beats: readonly BeatCopy[];
}

interface SwatchCopy {
  id: string;
  en: string;
  zh: string;
  modeEn: string;
  modeZh: string;
  claimId: ClaimId;
}

const SCENE_IDS: readonly SceneId[] = [1, 2, 3, 4, 5];

const BEAT_COUNTS: Record<SceneId, number> = {
  1: 4,
  2: 3,
  3: 2,
  4: 1,
  5: 1,
};

const BEAT_LAYOUT_MODES = {
  1: "reserved",
  2: "reserved",
  3: "reserved",
  4: "reserved",
  5: "reserved",
} as const;

export const SEVEN_BLUES_TRANSITION_SCORE = {
  "1->2": "multi-blind",
  "2->3": "ink-spread",
  "3->4": "afterimage",
  "4->5": "multi-blind",
} as const satisfies TopicTransitionScore;

const NAVIGATION = {
  geometry: "card-miniature",
  carrier: "blue-pigment-swatches",
  invocation: "proximity-reveal",
  feedback: "typographic-emphasis",
} as const satisfies TopicDefinition["navigation"];

export const SEVEN_BLUES_CLAIMS: Record<ClaimId, BlueClaim> = {
  "ultramarine-lazurite": {
    id: "ultramarine-lazurite",
    statement:
      "Natural ultramarine is prepared from blue lazurite particles separated from lapis lazuli; it is a mineral pigment, not a generic screen blue.",
    sourceIds: ["getty-ultramarine"],
  },
  "azurite-copper-carbonate": {
    id: "azurite-copper-carbonate",
    statement:
      "Azurite is a naturally occurring basic copper carbonate mineral that can be ground for blue pigment.",
    sourceIds: ["mci-azurite", "smithsonian-blue"],
  },
  "azurite-grinding": {
    id: "azurite-grinding",
    statement:
      "Azurite becomes paler as it is ground more finely, so particle size is part of its appearance.",
    sourceIds: ["smithsonian-blue"],
  },
  "indigo-plant-vat": {
    id: "indigo-plant-vat",
    statement:
      "Indigo is a plant-derived colorant; historical production and use include fermentation and vat processes rather than a mineral being ground into paint.",
    sourceIds: ["smithsonian-blue", "getty-indigo"],
  },
  "indigo-oxidation": {
    id: "indigo-oxidation",
    statement:
      "In an indigo vat, a reduced soluble form can be applied before exposure to air oxidizes it back toward the insoluble blue form.",
    sourceIds: ["smithsonian-indigo-vat", "getty-indigo"],
  },
  "egyptian-blue-frit": {
    id: "egyptian-blue-frit",
    statement:
      "Egyptian blue is a synthetic calcium copper silicate made by firing silica, calcium and copper-bearing ingredients into a blue frit and grinding it.",
    sourceIds: ["getty-egyptian-blue", "smithsonian-blue"],
  },
  "egyptian-blue-luminescence": {
    id: "egyptian-blue-luminescence",
    statement:
      "Egyptian blue can show strong visible-induced near-infrared luminescence, a conservation imaging property rather than a visible color match.",
    sourceIds: ["getty-egyptian-blue"],
  },
  "cobalt-aluminate": {
    id: "cobalt-aluminate",
    statement:
      "Cobalt blue is cobalt aluminate, commonly written CoO·Al₂O₃, with a spinel lattice; it is a stable bright-blue pigment documented in nineteenth-century painting practice.",
    sourceIds: ["met-cobalt-blue"],
  },
  "prussian-blue-mixed-valence": {
    id: "prussian-blue-mixed-valence",
    statement:
      "Prussian blue is a hydrated mixed-valence iron(III) hexacyanoferrate(II) complex; its deep blue is tied to an intervalence charge-transfer absorption.",
    sourceIds: ["national-gallery-prussian-blue"],
  },
  "structural-blue": {
    id: "structural-blue",
    statement:
      "Structural blue can arise when micro- or nanostructure selects and scatters light; its appearance can depend on structure and viewing geometry rather than a blue pigment alone.",
    sourceIds: ["harvard-structural-color"],
  },
  "cultural-context-boundary": {
    id: "cultural-context-boundary",
    statement:
      "Blue materials have different historical and cultural contexts across objects and places; this sequence does not assign one universal meaning to blue.",
    sourceIds: ["smithsonian-blue", "getty-ultramarine"],
  },
  "screen-is-not-material": {
    id: "screen-is-not-material",
    statement:
      "This deck uses diagrammatic swatches only: particle size and optical structure affect appearance, so a screen sample is not a material-color equivalence.",
    sourceIds: ["getty-egyptian-blue", "harvard-structural-color"],
  },
};

export const SEVEN_BLUES_SOURCES = [
  {
    id: "smithsonian-blue",
    accessDate: "2026-07-10",
    stamp: "SI/BLUE",
    authority: "Smithsonian National Museum of Asian Art",
    title: "Blue",
    citation:
      "Smithsonian National Museum of Asian Art, “Blue,” Making Blue and Associations of Blue.",
    url: "https://asia.si.edu/explore-art-culture/art-stories/colors/blue/",
    supports:
      "Supports azurite as a copper-bearing mineral whose color changes with grinding, the produced-material account of Egyptian blue, indigo fermentation, and bounded cultural examples for blue.",
    boundary:
      "Used for collection-informed material and cultural-context statements only; it does not establish a universal symbolism or a handling protocol.",
    claimIds: [
      "azurite-copper-carbonate",
      "azurite-grinding",
      "indigo-plant-vat",
      "egyptian-blue-frit",
      "cultural-context-boundary",
    ],
  },
  {
    id: "getty-ultramarine",
    accessDate: "2026-07-10",
    stamp: "GETTY/ULTRA",
    authority: "Getty Research Institute, Art & Architecture Thesaurus",
    title: "Ultramarine blue (pigment)",
    citation:
      "Getty Research Institute, Art & Architecture Thesaurus, “ultramarine blue (pigment),” subject ID 300013200.",
    url: "https://www.getty.edu/vow/AATFullDisplay?find=bima&logic=AND&note=&page=1&subjectid=300013200",
    supports:
      "Supports natural ultramarine as separated lazurite from lapis lazuli and documents its historically costly, context-specific use in Western medieval and Renaissance painting.",
    boundary:
      "The historical note is not generalized into a global social meaning for ultramarine or for blue as a category.",
    claimIds: ["ultramarine-lazurite", "cultural-context-boundary"],
  },
  {
    id: "mci-azurite",
    accessDate: "2026-07-10",
    stamp: "MCI/AZUR",
    authority: "Smithsonian Museum Conservation Institute",
    title: "Azurite: historical pigment reference abstract",
    citation:
      "Smithsonian Museum Conservation Institute, AATA reference record 43910, azurite as a basic carbonate of copper.",
    url: "https://mci.si.edu/node/1299334",
    supports:
      "Supports the material identification of azurite as a basic copper carbonate historically used as a blue pigment.",
    boundary:
      "The abstract is used for mineral identification only; no conservation treatment or exposure guidance is inferred from it.",
    claimIds: ["azurite-copper-carbonate"],
  },
  {
    id: "getty-indigo",
    accessDate: "2026-07-10",
    stamp: "GETTY/INDIGO",
    authority: "Getty Research Institute, Art & Architecture Thesaurus",
    title: "Indigo (colorant)",
    citation:
      "Getty Research Institute, Art & Architecture Thesaurus, “indigo (colorant),” subject ID 300013055.",
    url: "https://www.getty.edu/vow/AATFullDisplay?find=bima&logic=AND&note=&page=1&subjectid=300013055",
    supports:
      "Supports indigo as a natural plant colorant recovered from fermented solution and describes oxidation into the familiar blue material.",
    boundary:
      "This source is used to explain a colorant process, not to prescribe a particular historic or contemporary dye recipe.",
    claimIds: ["indigo-plant-vat", "indigo-oxidation"],
  },
  {
    id: "smithsonian-indigo-vat",
    accessDate: "2026-07-10",
    stamp: "SI/LEUCO",
    authority:
      "International Biodeterioration & Biodegradation / Smithsonian Research Online",
    title:
      "Proteomic evaluation of the biodegradation of wool fabrics in experimental burials",
    citation:
      "Caroline Solazzo et al., “Proteomic evaluation of the biodegradation of wool fabrics in experimental burials,” International Biodeterioration & Biodegradation 80 (2013): 48–59. doi:10.1016/j.ibiod.2012.11.013.",
    url: "https://repository.si.edu/server/api/core/bitstreams/1b558823-42e0-42ac-bcba-cf42e83089fd/content",
    supports:
      "Directly states that indigotin is reduced to leuco-indigo in an alkaline vat and that oxidation returns it to the insoluble colored form.",
    boundary:
      "Used only for the general vat redox mechanism; it does not prescribe a recipe or generalize one practice to every indigo tradition.",
    claimIds: ["indigo-oxidation"],
  },
  {
    id: "getty-egyptian-blue",
    accessDate: "2026-07-10",
    stamp: "GETTY/EB",
    authority: "Getty Conservation Institute",
    title: "Egyptian Blue in Romano-Egyptian Mummy Portraits",
    citation:
      "Gabrielle Thiboutot, “Egyptian Blue in Romano-Egyptian Mummy Portraits,” Getty Publications.",
    url: "https://www.getty.edu/publications/mummyportraits/part-one/5/",
    supports:
      "Supports Egyptian blue as calcium copper silicate produced by firing raw materials and its visible-induced near-infrared luminescence used in conservation imaging.",
    boundary:
      "Its historical production and imaging observations do not make any displayed screen swatch a reconstruction of a specific ancient object.",
    claimIds: [
      "egyptian-blue-frit",
      "egyptian-blue-luminescence",
      "screen-is-not-material",
    ],
  },
  {
    id: "met-cobalt-blue",
    accessDate: "2026-07-10",
    stamp: "MET/CO",
    authority: "The Metropolitan Museum of Art",
    title: "Modern Pigments Found in Thomas Cole's Paintings",
    citation:
      "The Metropolitan Museum of Art, “Modern Pigments Found in Thomas Cole's Paintings Shed New Light on the Artist's Practice.”",
    url: "https://www.metmuseum.org/pt/perspectives/thomas-cole-conservation",
    supports:
      "Supports cobalt blue as CoO·Al₂O₃, a stable bright-blue pigment available to nineteenth-century painters.",
    boundary:
      "The cited painting case is evidence for this pigment description, not proof of use in every blue object or region.",
    claimIds: ["cobalt-aluminate"],
  },
  {
    id: "national-gallery-prussian-blue",
    accessDate: "2026-07-10",
    stamp: "NG/PB",
    authority: "The National Gallery, London",
    title: "The structure of Prussian blue and the chemistry of its manufacture",
    citation:
      "Joyce H. Townsend and colleagues, National Gallery Technical Bulletin 25, “The Structure of Prussian Blue and the Chemistry of its Manufacture.”",
    url: "https://www.nationalgallery.org.uk/upload/pdf/kirby_saunders2004.pdf",
    supports:
      "Supports Prussian blue as a hydrated iron(III) hexacyanoferrate(II) mixed-valence network and explains its intervalence electronic charge-transfer color mechanism.",
    boundary:
      "The chemistry is simplified to a mechanism label; no manufacturing recipe or safety classification is presented.",
    claimIds: ["prussian-blue-mixed-valence"],
  },
  {
    id: "harvard-structural-color",
    accessDate: "2026-07-10",
    stamp: "HARVARD/SC",
    authority: "Harvard John A. Paulson School of Engineering and Applied Sciences",
    title: "Structural color",
    citation:
      "Manoharan Lab, Harvard SEAS, “Structural color.”",
    url: "https://www.manoharan.seas.harvard.edu/structural-color",
    supports:
      "Supports structural color as an optical response of ordered or disordered microstructure, including scattering and viewing-angle distinctions rather than pigment absorption alone.",
    boundary:
      "The example is intentionally generic: it does not claim that every blue feather, wing, or manufactured surface uses one identical structural mechanism.",
    claimIds: ["structural-blue", "screen-is-not-material"],
  },
] as const satisfies readonly BlueSource[];

const SWATCHES: readonly SwatchCopy[] = [
  {
    id: "ultramarine",
    en: "Ultramarine",
    zh: "群青",
    modeEn: "lazurite mineral",
    modeZh: "青金石矿物（lazurite）",
    claimId: "ultramarine-lazurite",
  },
  {
    id: "azurite",
    en: "Azurite",
    zh: "蓝铜矿",
    modeEn: "copper carbonate mineral",
    modeZh: "碱式碳酸铜矿物",
    claimId: "azurite-copper-carbonate",
  },
  {
    id: "egyptian",
    en: "Egyptian blue",
    zh: "埃及蓝",
    modeEn: "fired Ca–Cu silicate",
    modeZh: "烧制钙–铜硅酸盐",
    claimId: "egyptian-blue-frit",
  },
  {
    id: "indigo",
    en: "Indigo",
    zh: "靛蓝",
    modeEn: "plant vat colorant",
    modeZh: "植物还原染缸",
    claimId: "indigo-plant-vat",
  },
  {
    id: "cobalt",
    en: "Cobalt blue",
    zh: "钴蓝",
    modeEn: "cobalt aluminate",
    modeZh: "铝酸钴",
    claimId: "cobalt-aluminate",
  },
  {
    id: "prussian",
    en: "Prussian blue",
    zh: "普鲁士蓝",
    modeEn: "iron cyanide network",
    modeZh: "铁氰网络",
    claimId: "prussian-blue-mixed-valence",
  },
  {
    id: "structural",
    en: "Structural blue",
    zh: "结构蓝",
    modeEn: "microstructure + light",
    modeZh: "微结构 + 光",
    claimId: "structural-blue",
  },
];

const SCENES: Record<SceneId, Record<Lang, SceneCopy>> = {
  1: {
    en: {
      kicker: "RISO / MATERIAL CHORUS / 01",
      title: "Seven Blues",
      deck: "One apparent field. Seven different ways to make light look blue.",
      boundary: "Names are material paths, not a universal color taxonomy.",
      sourceLabel: "SOURCES",
      beats: [
        {
          action: "Open the blue field with two material cuts",
          title: "Blue is not one substance",
          body: "A single-looking field breaks into distinct material routes.",
        },
        {
          action: "Add four more halftone cuts",
          title: "Same family, different matter",
          body: "Mineral, plant, furnace, iron network, and optical structure enter separately.",
        },
        {
          action: "Reveal the seventh structural route",
          title: "A color can be built by light",
          body: "Not every blue starts as a blue pigment.",
        },
        {
          action: "Set the comparison boundary",
          title: "Compare mechanisms, not screenshots",
          body: "The field becomes an index for five material scenes.",
        },
      ],
    },
    zh: {
      kicker: "RISO / 材料合唱 / 01",
      title: "七种蓝",
      deck: "看似同一片蓝，却有七条让光呈蓝的材料路径。",
      boundary: "这些名称是材料路径，不是“蓝色”的通用分类。",
      sourceLabel: "来源",
      beats: [
        {
          action: "以两道材料切口打开蓝色场",
          title: "蓝不是一种物质",
          body: "一片看似相同的蓝，裂成不同的材料路线。",
        },
        {
          action: "加入四道网点切口",
          title: "同属蓝，材料不同",
          body: "矿物、植物、窑炉、铁网络和光学结构依次进入。",
        },
        {
          action: "揭示第七条结构路线",
          title: "颜色也能由光构成",
          body: "不是每一种蓝都从蓝色颜料开始。",
        },
        {
          action: "落下比较边界",
          title: "比较机制，不比较截图",
          body: "这片蓝成为五个材料场景的索引。",
        },
      ],
    },
  },
  2: {
    en: {
      kicker: "MINERAL PAIR / GROUND, NOT FLAT / 02",
      title: "Stone / copper",
      deck: "Two mined blues: ultramarine starts with lazurite particles separated from lapis lazuli rock; azurite is a copper carbonate mineral.",
      boundary: "Particle size changes appearance; neither diagram is a geological specimen.",
      sourceLabel: "SOURCES",
      beats: [
        {
          action: "Place ultramarine beside azurite",
          title: "Two minerals, two routes",
          body: "Ultramarine begins with lazurite particles separated from lapis lazuli rock; azurite begins as a copper mineral.",
        },
        {
          action: "Expose azurite's copper-carbonate label",
          title: "Grinding is not neutral",
          body: "Azurite can look paler when more finely ground.",
        },
        {
          action: "Lock the granular comparison",
          title: "A blue has a particle history",
          body: "The print keeps grain, pressure, and imperfect registration visible.",
        },
      ],
    },
    zh: {
      kicker: "矿物对照 / 不是平涂 / 02",
      title: "石 / 铜",
      deck: "两种矿物蓝：群青来自从青金石岩中分离出的 lazurite 颗粒；蓝铜矿是碳酸铜矿物。",
      boundary: "颗粒尺度会改变外观；两张图都不是地质标本。",
      sourceLabel: "来源",
      beats: [
        {
          action: "并置群青与蓝铜矿",
          title: "两种矿物，两条路线",
          body: "群青从青金石岩中分离出的 lazurite 颗粒开始；蓝铜矿从铜矿物开始。",
        },
        {
          action: "显出蓝铜矿的碳酸铜标签",
          title: "研磨不是中性的",
          body: "蓝铜矿被磨得更细时，可能显得更浅。",
        },
        {
          action: "固定颗粒化对照",
          title: "每种蓝都有颗粒历史",
          body: "印刷保留颗粒、压力和不完全套准。",
        },
      ],
    },
  },
  3: {
    en: {
      kicker: "PLANT VAT / REDUCE → AIR / 03",
      title: "Indigo turns",
      deck: "A plant-derived colorant changes state in the vat, then returns to blue in air.",
      boundary: "This is a process diagram, not a recipe or a claim about every indigo tradition.",
      sourceLabel: "SOURCES",
      beats: [
        {
          action: "Lower the folded sheet into the vat",
          title: "Make the color mobile",
          body: "Reduction makes an indigo form soluble enough for a vat process.",
        },
        {
          action: "Lift the sheet into air",
          title: "Air returns the blue",
          body: "Oxidation moves the color back toward its insoluble blue form.",
        },
      ],
    },
    zh: {
      kicker: "植物染缸 / 还原 → 空气 / 03",
      title: "靛蓝翻转",
      deck: "一种植物色料在染缸里改变状态，再在空气中回到蓝色。",
      boundary: "这是过程图，不是配方，也不代表所有靛蓝传统。",
      sourceLabel: "来源",
      beats: [
        {
          action: "把折页放入染缸",
          title: "让颜色变得可移动",
          body: "还原使靛蓝的一种形态足够可溶，可进入染缸过程。",
        },
        {
          action: "把折页提到空气中",
          title: "空气让蓝回来",
          body: "氧化使颜色回到趋于不溶的蓝色形态。",
        },
      ],
    },
  },
  4: {
    en: {
      kicker: "SYNTHETIC / NETWORK / STRUCTURE / 04",
      title: "Four mechanisms",
      deck: "Fired silicate. Cobalt aluminate (spinel) lattice. Iron cyanide network. Structure that selects light.",
      boundary: "No safety rating is implied here; this is not a material-handling guide.",
      sourceLabel: "SOURCES",
      beats: [
        {
          action: "Hold four unlike mechanisms in one comparison wall",
          title: "Similar blue, unlike physics",
          body: "Egyptian, cobalt, Prussian, and structural blue should not be collapsed into one pigment story.",
        },
      ],
    },
    zh: {
      kicker: "合成 / 网络 / 结构 / 04",
      title: "四种机制",
      deck: "烧制硅酸盐。铝酸钴（尖晶石）晶格。铁氰网络。选择光的微结构。",
      boundary: "这里不暗示安全评级；它不是材料操作指南。",
      sourceLabel: "来源",
      beats: [
        {
          action: "把四种不同机制置于同一面比较墙",
          title: "看似同蓝，物理不同",
          body: "埃及蓝、钴蓝、普鲁士蓝与结构蓝不能被压成同一种颜料故事。",
        },
      ],
    },
  },
  5: {
    en: {
      kicker: "FOLDOUT / SWATCH WALL / 05",
      title: "Keep the difference",
      deck: "Seven material labels fold into one wall without becoming one color.",
      boundary: "On-screen swatches are diagrams, not matches for real pigment, dye, glaze, or structure under changing light.",
      sourceLabel: "SOURCES",
      beats: [
        {
          action: "Freeze the seven swatches as a final material index",
          title: "Same word, different routes",
          body: "The last frame stays still: screen blue is not material blue.",
        },
      ],
    },
    zh: {
      kicker: "折页 / 色片墙 / 05",
      title: "保留差异",
      deck: "七种材料标签折进同一面墙，却不变成同一种蓝。",
      boundary: "屏幕色片只是图解，不是现实颜料、染料、釉或结构在不同光线下的色彩匹配。",
      sourceLabel: "来源",
      beats: [
        {
          action: "把七张色片冻结为最终材料索引",
          title: "同一个词，不同的路线",
          body: "最后一帧静止：屏幕蓝不是材料蓝。",
        },
      ],
    },
  },
};

export const SEVEN_BLUES_SCENE_CLAIMS: Record<
  SceneId,
  readonly ClaimId[]
> = {
  1: [
    "ultramarine-lazurite",
    "azurite-copper-carbonate",
    "indigo-plant-vat",
    "egyptian-blue-frit",
    "cobalt-aluminate",
    "prussian-blue-mixed-valence",
    "structural-blue",
    "cultural-context-boundary",
  ],
  2: [
    "ultramarine-lazurite",
    "azurite-copper-carbonate",
    "azurite-grinding",
  ],
  3: ["indigo-plant-vat", "indigo-oxidation"],
  4: [
    "egyptian-blue-frit",
    "egyptian-blue-luminescence",
    "cobalt-aluminate",
    "prussian-blue-mixed-valence",
    "structural-blue",
  ],
  5: [
    "ultramarine-lazurite",
    "azurite-copper-carbonate",
    "indigo-plant-vat",
    "egyptian-blue-frit",
    "cobalt-aluminate",
    "prussian-blue-mixed-valence",
    "structural-blue",
    "screen-is-not-material",
  ],
};

function cx(...names: Array<string | false | undefined>) {
  return names.filter(Boolean).join(" ");
}

function clampScene(scene: number): SceneId {
  return Math.max(1, Math.min(5, scene)) as SceneId;
}

function clampBeat(scene: SceneId, beat: number): number {
  return Math.max(0, Math.min(BEAT_COUNTS[scene] - 1, beat));
}

function sourceFor(id: SourceId): BlueSource {
  const source = SEVEN_BLUES_SOURCES.find((candidate) => candidate.id === id);
  if (!source) {
    throw new Error("Unknown Seven Blues source: " + id);
  }
  return source;
}

function sourceIdsFor(claimIds: readonly ClaimId[]): SourceId[] {
  const needed = new Set<SourceId>();
  for (const claimId of claimIds) {
    for (const sourceId of SEVEN_BLUES_CLAIMS[claimId].sourceIds) {
      needed.add(sourceId);
    }
  }
  return SEVEN_BLUES_SOURCES.filter((source) => needed.has(source.id)).map(
    (source) => source.id,
  );
}

function claimAttributes(claimIds: readonly ClaimId[]) {
  return {
    "data-claim-ids": claimIds.join(" "),
    "data-source-ids": sourceIdsFor(claimIds).join(" "),
  };
}

function SourceStamp({
  sourceIds,
  claimIds,
  scene,
  language,
}: {
  sourceIds: readonly SourceId[];
  claimIds: readonly ClaimId[];
  scene: SceneId;
  language: Lang;
}) {
  const claimSourceLinks = claimIds
    .map(
      (claimId) =>
        claimId + ":" + SEVEN_BLUES_CLAIMS[claimId].sourceIds.join(","),
    )
    .join(";");

  return (
    <div
      className={styles.sourceStamp}
      data-source-stamp="true"
      data-claim-source-map="true"
      data-scene-id={scene}
      data-claim-ids={claimIds.join(" ")}
      data-source-ids={sourceIds.join(" ")}
      data-claim-source-links={claimSourceLinks}
      data-source-refs={sourceIds.map((id) => sourceFor(id).stamp).join(" · ")}
      aria-label={language === "zh" ? "来源链接" : "Source links"}
      onPointerDown={(event) => event.stopPropagation()}
      onTouchStartCapture={(event) => event.stopPropagation()}
      onTouchMoveCapture={(event) => event.stopPropagation()}
      onTouchEndCapture={(event) => event.stopPropagation()}
      onTouchCancelCapture={(event) => event.stopPropagation()}
    >
      <span className={styles.sourceWord}>
        {language === "zh" ? "来源" : "SOURCES"}
      </span>
      {sourceIds.map((sourceId) => {
        const source = sourceFor(sourceId);
        return (
          <a
            key={source.id}
            href={source.url}
            target="_blank"
            rel="noreferrer"
            data-source-id={source.id}
            title={source.title}
            onClick={(event) => event.stopPropagation()}
          >
            {source.stamp}
          </a>
        );
      })}
    </div>
  );
}

function RisoHeader({
  scene,
  copy,
  claimIds,
}: {
  scene: SceneId;
  copy: SceneCopy;
  claimIds: readonly ClaimId[];
}) {
  return (
    <header className={styles.header} data-layout-band="header">
      <p className={styles.kicker} data-beat-layout-item="true">
        {copy.kicker}
      </p>
      <p className={styles.sceneNumber} aria-label={"Scene " + scene}>
        0{scene}
      </p>
      <div className={styles.titleBlock} data-beat-layout-item="true">
        <h1>{copy.title}</h1>
        <p className={styles.deck} {...claimAttributes(claimIds)}>
          {copy.deck}
        </p>
      </div>
    </header>
  );
}

function BlueFieldArt({
  beat,
  language,
}: {
  beat: number;
  language: Lang;
}) {
  const visibleCount = Math.min(SWATCHES.length, (beat + 1) * 2);
  return (
    <div className={styles.blueFieldArt} data-blue-field="true">
      <svg
        className={styles.blueFieldPrint}
        viewBox="0 0 1000 560"
        role="img"
        aria-label={language === "zh" ? "七层蓝色孔版印刷场" : "Seven-layer blue riso field"}
      >
        <defs>
          <pattern id="seven-blues-dot-a" width="24" height="24" patternUnits="userSpaceOnUse">
            <circle cx="4" cy="4" r="3" fill="#102f7b" />
            <circle cx="16" cy="16" r="2" fill="#102f7b" />
          </pattern>
          <pattern id="seven-blues-dot-b" width="16" height="16" patternUnits="userSpaceOnUse">
            <path d="M0 8H16M8 0V16" stroke="#00a9b7" strokeWidth="2" />
          </pattern>
          <pattern id="seven-blues-dot-c" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="3" cy="3" r="2" fill="#f5e8be" />
            <circle cx="13" cy="13" r="2" fill="#f5e8be" />
          </pattern>
          <filter id="seven-blues-field-rough">
            <feTurbulence type="fractalNoise" baseFrequency="0.018" numOctaves="2" seed="24" />
            <feDisplacementMap in="SourceGraphic" scale="8" />
          </filter>
        </defs>
        <rect width="1000" height="560" fill="#102f7b" />
        <path d="M-40 88C170 35 290 150 470 84S770 72 1040 26V250C826 306 610 220 432 290S130 290-40 348Z" fill="url(#seven-blues-dot-a)" filter="url(#seven-blues-field-rough)" />
        <path d="M-24 360C160 284 270 430 440 356S694 300 1038 392V598H-24Z" fill="url(#seven-blues-dot-b)" opacity="0.86" />
        <path d="M168 16C286 58 386 124 416 226S614 400 736 546L570 570C472 472 346 390 312 276S138 108 82 48Z" fill="#004f82" opacity="0.82" />
        <path d="M662 -18C740 108 744 212 920 330S1040 486 1036 584L852 568C820 462 660 404 614 286S590 74 542 0Z" fill="url(#seven-blues-dot-c)" opacity="0.5" />
        <path d="M58 500L924 122" stroke="#f05545" strokeWidth="18" strokeDasharray="8 16" opacity="0.65" />
        <path d="M88 492L954 108" stroke="#f5e8be" strokeWidth="5" strokeDasharray="2 19" opacity="0.92" />
      </svg>
      <div className={styles.blueFieldType} aria-hidden="true">
        <span>BLUE</span>
        <span>蓝</span>
      </div>
      <div className={styles.blueCuts} data-beat-layout-item="true">
        {SWATCHES.map((swatch, index) => {
          const visible = index < visibleCount;
          return (
            <div
              key={swatch.id}
              className={styles.blueCut}
              data-blue-cut={swatch.id}
              data-visible={visible ? "true" : "false"}
              {...claimAttributes([swatch.claimId])}
            >
              <span>{language === "zh" ? swatch.zh : swatch.en}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MineralPlate({
  kind,
  title,
  body,
  claimIds,
}: {
  kind: "lazurite" | "azurite";
  title: string;
  body: string;
  claimIds: readonly ClaimId[];
}) {
  return (
    <article
      className={cx(styles.mineralPlate, kind === "azurite" && styles.azuritePlate)}
      data-mineral-plate={kind}
      data-beat-layout-item="true"
      {...claimAttributes(claimIds)}
    >
      <svg viewBox="0 0 360 320" aria-hidden="true">
        <defs>
          <pattern id={kind === "lazurite" ? "seven-lazu-grain" : "seven-azur-grain"} width="18" height="18" patternUnits="userSpaceOnUse">
            <circle cx="4" cy="4" r="3" fill={kind === "lazurite" ? "#0e2d82" : "#087f9a"} />
            <circle cx="13" cy="11" r="2" fill={kind === "lazurite" ? "#f5e8be" : "#d8ead5"} />
          </pattern>
        </defs>
        <path d="M42 226C42 128 102 52 190 46C278 42 326 110 314 203C306 274 252 294 170 278C94 264 42 264 42 226Z" fill={kind === "lazurite" ? "#173f99" : "#0c7893"} />
        <path d="M66 218C88 126 144 74 218 86C288 100 292 166 270 222C246 272 132 264 66 218Z" fill={kind === "lazurite" ? "url(#seven-lazu-grain)" : "url(#seven-azur-grain)"} opacity="0.92" />
        <path d="M54 238C130 208 218 256 304 178" fill="none" stroke="#f05545" strokeWidth="8" strokeDasharray="4 11" />
        <path d="M84 94L260 238M132 68L286 184M72 160L248 272" stroke="#f5e8be" strokeWidth="3" opacity="0.7" />
      </svg>
      <div>
        <p className={styles.plateIndex}>{kind === "lazurite" ? "01" : "02"}</p>
        <h2>{title}</h2>
        <p>{body}</p>
      </div>
    </article>
  );
}

function MineralPairs({
  beat,
  language,
}: {
  beat: number;
  language: Lang;
}) {
  const late = beat >= 1;
  const final = beat >= 2;
  return (
    <div className={styles.mineralPairs} data-mineral-pairs="true">
      <MineralPlate
        kind="lazurite"
        title={
          language === "zh"
            ? "群青 / 青金石矿物（lazurite）"
            : "Ultramarine / lazurite mineral"
        }
        body={
          language === "zh"
            ? "从青金石岩中分离出的 lazurite 颗粒。"
            : "Lazurite particles separated from lapis lazuli rock."
        }
        claimIds={["ultramarine-lazurite"]}
      />
      <MineralPlate
        kind="azurite"
        title={language === "zh" ? "蓝铜矿 / 碳酸铜" : "Azurite / copper carbonate"}
        body={
          language === "zh"
            ? "天然碱式碳酸铜矿物，被研磨成蓝色颜料。"
            : "A basic copper carbonate mineral, ground for blue pigment."
        }
        claimIds={["azurite-copper-carbonate"]}
      />
      <div
        className={styles.grindStrip}
        data-grind-strip="true"
        data-visible={late ? "true" : "false"}
        data-beat-layout-item="true"
        {...claimAttributes(["azurite-grinding"])}
      >
        <span>{language === "zh" ? "粗颗粒" : "coarse"}</span>
        <i />
        <i />
        <i />
        <span>{language === "zh" ? "细颗粒 → 更浅" : "fine → paler"}</span>
      </div>
      <p
        className={styles.grainBoundary}
        data-grain-boundary="true"
        data-visible={final ? "true" : "false"}
        data-beat-layout-item="true"
      >
        {language === "zh"
          ? "颗粒尺度也是颜色的一部分。"
          : "Particle scale belongs to the color story."}
      </p>
    </div>
  );
}

function IndigoVat({
  beat,
  language,
}: {
  beat: number;
  language: Lang;
}) {
  const lifted = beat >= 1;
  return (
    <div className={styles.indigoVat} data-plant-vat="true">
      <div className={styles.vatArt} data-beat-layout-item="true">
        <svg viewBox="0 0 700 470" role="img" aria-label={language === "zh" ? "靛蓝染缸过程图" : "Indigo vat process diagram"}>
          <defs>
            <pattern id="seven-indigo-dots" width="18" height="18" patternUnits="userSpaceOnUse">
              <circle cx="4" cy="4" r="2" fill="#1a3f86" />
              <circle cx="13" cy="11" r="2" fill="#1a3f86" />
            </pattern>
          </defs>
          <path d="M116 164H586L534 412H168Z" fill="#153879" stroke="#171914" strokeWidth="12" />
          <path d="M138 190H564L526 374H176Z" fill="url(#seven-indigo-dots)" opacity="0.94" />
          <path d="M154 236C260 210 408 252 552 220" stroke="#00a9b7" strokeWidth="16" fill="none" opacity="0.82" />
          <path d="M312 36H402L438 174H276Z" fill={lifted ? "#173f99" : "#b8bf6c"} stroke="#171914" strokeWidth="10" />
          <path d="M294 70L422 138M286 104L430 164" stroke="#f5e8be" strokeWidth="5" strokeDasharray="4 12" opacity="0.8" />
          <path d="M350 38V10M350 10L330 38M350 10L370 38" stroke="#f05545" strokeWidth="10" fill="none" opacity={lifted ? "1" : "0.18"} />
          <path d="M80 142C142 94 208 88 258 124" stroke="#f5e8be" strokeWidth="5" fill="none" strokeDasharray="7 11" />
        </svg>
        <span className={styles.vatState} data-vat-state={lifted ? "air" : "vat"}>
          {lifted
            ? language === "zh"
              ? "空气"
              : "AIR"
            : language === "zh"
              ? "还原染缸"
              : "REDUCED VAT"}
        </span>
      </div>
      <div className={styles.vatNotes}>
        <p
          className={styles.vatNote}
          data-visible="true"
          data-beat-layout-item="true"
          {...claimAttributes(["indigo-plant-vat"])}
        >
          {language === "zh"
            ? "植物来源的靛蓝，在染缸中先走向可溶的状态。"
            : "Plant-derived indigo first moves toward a soluble vat state."}
        </p>
        <p
          className={styles.vatNote}
          data-visible={lifted ? "true" : "false"}
          data-beat-layout-item="true"
          {...claimAttributes(["indigo-oxidation"])}
        >
          {language === "zh"
            ? "离开染缸后，空气中的氧化让蓝色回到趋于不溶的形态。"
            : "Out of the vat, oxidation in air returns the color toward an insoluble blue form."}
        </p>
      </div>
    </div>
  );
}

function MechanismTile({
  kind,
  label,
  detail,
  claimIds,
}: {
  kind: "egyptian" | "cobalt" | "prussian" | "structural";
  label: string;
  detail: string;
  claimIds: readonly ClaimId[];
}) {
  return (
    <article
      className={cx(styles.mechanismTile, styles[kind + "Tile"])}
      data-mechanism={kind}
      data-beat-layout-item="true"
      {...claimAttributes(claimIds)}
    >
      <svg viewBox="0 0 260 180" aria-hidden="true">
        {kind === "egyptian" && (
          <>
            <path d="M28 138L74 48H178L232 138Z" fill="#1c5fac" />
            <path d="M50 120L92 66L154 66L208 120Z" fill="none" stroke="#f5e8be" strokeWidth="7" strokeDasharray="6 9" />
            <circle cx="130" cy="94" r="28" fill="#00a9b7" opacity="0.9" />
          </>
        )}
        {kind === "cobalt" && (
          <>
            <path d="M26 38L232 38M26 90L232 90M26 142L232 142M60 14V166M130 14V166M200 14V166" stroke="#1b2f7c" strokeWidth="15" />
            <circle cx="60" cy="38" r="16" fill="#f05545" />
            <circle cx="130" cy="90" r="16" fill="#f05545" />
            <circle cx="200" cy="142" r="16" fill="#f05545" />
          </>
        )}
        {kind === "prussian" && (
          <>
            <path d="M46 38L130 90L214 38M46 142L130 90L214 142M46 38V142M214 38V142" stroke="#0d337f" strokeWidth="13" fill="none" />
            <circle cx="46" cy="38" r="17" fill="#f5e8be" />
            <circle cx="214" cy="38" r="17" fill="#f05545" />
            <circle cx="130" cy="90" r="20" fill="#00a9b7" />
            <circle cx="46" cy="142" r="17" fill="#f05545" />
            <circle cx="214" cy="142" r="17" fill="#f5e8be" />
          </>
        )}
        {kind === "structural" && (
          <>
            <path d="M28 126C62 56 112 54 142 126S212 192 238 76" stroke="#0c4c9a" strokeWidth="11" fill="none" strokeDasharray="5 7" />
            <path d="M30 56L230 56M30 92L230 92M30 128L230 128" stroke="#00a9b7" strokeWidth="5" />
            <path d="M52 154L205 32" stroke="#f05545" strokeWidth="9" />
          </>
        )}
      </svg>
      <h2>{label}</h2>
      <p>{detail}</p>
    </article>
  );
}

function SyntheticLab({ language }: { language: Lang }) {
  return (
    <div className={styles.syntheticLab} data-synthetic-lab="true">
      <MechanismTile
        kind="egyptian"
        label={language === "zh" ? "埃及蓝" : "Egyptian blue"}
        detail={
          language === "zh"
            ? "烧制的钙–铜硅酸盐熔块；保育成像可见近红外发光。"
            : "Fired calcium–copper silicate frit; conservation imaging can detect NIR luminescence."
        }
        claimIds={["egyptian-blue-frit", "egyptian-blue-luminescence"]}
      />
      <MechanismTile
        kind="cobalt"
        label={language === "zh" ? "钴蓝" : "Cobalt blue"}
        detail={
          language === "zh"
            ? "CoO·Al₂O₃：铝酸钴（尖晶石）晶格。"
            : "CoO·Al₂O₃: a cobalt aluminate (spinel) lattice."
        }
        claimIds={["cobalt-aluminate"]}
      />
      <MechanismTile
        kind="prussian"
        label={language === "zh" ? "普鲁士蓝" : "Prussian blue"}
        detail={
          language === "zh"
            ? "混合价铁的六氰合铁网络；价间电荷转移。"
            : "Mixed-valence iron hexacyanoferrate network; intervalence charge transfer."
        }
        claimIds={["prussian-blue-mixed-valence"]}
      />
      <MechanismTile
        kind="structural"
        label={language === "zh" ? "结构蓝" : "Structural blue"}
        detail={
          language === "zh"
            ? "微结构选择并散射光；不是一团蓝色粉末。"
            : "Microstructure selects and scatters light; not a mound of blue powder."
        }
        claimIds={["structural-blue"]}
      />
    </div>
  );
}

function SwatchWall({ language }: { language: Lang }) {
  return (
    <div className={styles.swatchWall} data-swatch-wall="true">
      {SWATCHES.map((swatch, index) => (
        <article
          key={swatch.id}
          className={styles.finalSwatch}
          data-final-swatch={swatch.id}
          data-beat-layout-item="true"
          {...claimAttributes([swatch.claimId])}
        >
          <span className={styles.swatchNo}>0{index + 1}</span>
          <div className={styles.swatchInk} aria-hidden="true">
            <i />
            <i />
            <i />
          </div>
          <h2>{language === "zh" ? swatch.zh : swatch.en}</h2>
          <p>{language === "zh" ? swatch.modeZh : swatch.modeEn}</p>
        </article>
      ))}
      <p
        className={styles.screenBoundary}
        data-screen-boundary="true"
        data-beat-layout-item="true"
        {...claimAttributes(["screen-is-not-material"])}
      >
        {language === "zh"
          ? "屏幕色片只是材料差异的索引，不是实物颜色的替身。"
          : "Screen swatches index material difference; they do not stand in for a real sample."}
      </p>
    </div>
  );
}

function SceneBody({
  scene,
  beat,
  language,
}: {
  scene: SceneId;
  beat: number;
  language: Lang;
}) {
  if (scene === 1) return <BlueFieldArt beat={beat} language={language} />;
  if (scene === 2) return <MineralPairs beat={beat} language={language} />;
  if (scene === 3) return <IndigoVat beat={beat} language={language} />;
  if (scene === 4) return <SyntheticLab language={language} />;
  return <SwatchWall language={language} />;
}

function SevenBluesScene({
  scene,
  beat,
  language,
}: {
  scene: SceneId;
  beat: number;
  language: Lang;
}) {
  const safeBeat = clampBeat(scene, beat);
  const copy = SCENES[scene][language];
  const claimIds = SEVEN_BLUES_SCENE_CLAIMS[scene];
  const sourceIds = sourceIdsFor(claimIds);
  const composition =
    scene === 1
      ? "blue-field"
      : scene === 2
        ? "mineral-pairs"
        : scene === 3
          ? "plant-vat"
          : scene === 4
            ? "synthetic-lab"
            : "swatch-wall";

  return (
    <section
      className={cx(styles.scene, scene === 5 && styles.stillScene)}
      data-scene-content={scene}
      data-composition={composition}
      data-layout-contract={
        scene === 5 ? "title-safe-swatch-wall" : "standard-scene-grid"
      }
      data-beat={safeBeat}
      data-visible-claim-ids={claimIds.join(" ")}
      data-source-ids={sourceIds.join(" ")}
      data-beat-layout-container="true"
      data-beat-layout-mode="reserved"
      aria-label={copy.title}
    >
      <RisoHeader scene={scene} copy={copy} claimIds={claimIds} />
      <div className={styles.sceneBody} data-layout-band="body">
        <SceneBody scene={scene} beat={safeBeat} language={language} />
      </div>
      <footer className={styles.footer}>
        <p
          className={styles.beatLine}
          data-beat-layout-item="true"
          {...claimAttributes(claimIds)}
        >
          <span>{String(safeBeat + 1).padStart(2, "0")}</span>
          <strong>{copy.beats[safeBeat].title}</strong>
          <em>{copy.beats[safeBeat].body}</em>
        </p>
        <div className={styles.footerRight}>
          <p
            className={styles.boundary}
            data-beat-layout-item="true"
            {...claimAttributes(claimIds)}
          >
            {copy.boundary}
          </p>
          <SourceStamp
            sourceIds={sourceIds}
            claimIds={claimIds}
            scene={scene}
            language={language}
          />
        </div>
      </footer>
    </section>
  );
}

function BlueSwatchNavigation({
  scene,
  language,
  onNavigate,
}: {
  scene: SceneId;
  language: Lang;
  onNavigate?: (scene: number, beat: number) => void;
}) {
  const [revealedScene, setRevealedScene] = useState<SceneId | null>(null);
  const jump = (target: SceneId) => onNavigate?.(target, 0);
  const isolateTouch = (event: TouchEvent<HTMLElement>) => event.stopPropagation();

  const handleKey = (
    event: KeyboardEvent<HTMLButtonElement>,
    target: SceneId,
  ) => {
    event.stopPropagation();
    if (event.repeat) {
      event.preventDefault();
      return;
    }

    let destination: SceneId | null = null;
    if (event.key === "Enter" || event.key === " " || event.key === "Spacebar") {
      destination = target;
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      destination = clampScene(target - 1);
    } else if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      destination = clampScene(target + 1);
    } else if (event.key === "Home") {
      destination = 1;
    } else if (event.key === "End") {
      destination = 5;
    } else {
      return;
    }

    event.preventDefault();
    setRevealedScene(destination);
    jump(destination);
  };

  const handleKeyUp = (event: KeyboardEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    if (event.key === "Enter" || event.key === " " || event.key === "Spacebar") {
      event.preventDefault();
    }
  };

  const handlePointerDown = (
    event: PointerEvent<HTMLButtonElement>,
    target: SceneId,
  ) => {
    event.stopPropagation();
    setRevealedScene(target);
  };

  return (
    <nav
      className={styles.swatchNavigation}
      aria-label={language === "zh" ? "蓝色色片场景导航" : "Blue pigment swatch scene navigation"}
      data-topic-navigation="true"
      data-navigation-geometry={NAVIGATION.geometry}
      data-navigation-carrier={NAVIGATION.carrier}
      data-navigation-invocation={NAVIGATION.invocation}
      data-navigation-feedback={NAVIGATION.feedback}
      data-revealed-scene={revealedScene ?? "none"}
      onClick={(event) => event.stopPropagation()}
      onPointerDown={(event) => event.stopPropagation()}
      onTouchStartCapture={isolateTouch}
      onTouchMoveCapture={isolateTouch}
      onTouchEndCapture={isolateTouch}
      onTouchCancelCapture={isolateTouch}
    >
      <span className={styles.navHint} aria-hidden="true">
        {language === "zh" ? "靠近 / 轻触 / 按键" : "NEAR / TAP / KEYS"}
      </span>
      <div className={styles.swatchNavList}>
        {SCENE_IDS.map((sceneId) => {
          const active = sceneId === scene;
          const revealed = sceneId === revealedScene;
          const copy = SCENES[sceneId][language];
          const firstSwatch = SWATCHES[sceneId - 1];
          return (
            <button
              key={sceneId}
              type="button"
              className={styles.swatchButton}
              data-nav-swatch={sceneId}
              data-current={active ? "true" : "false"}
              data-revealed={revealed ? "true" : "false"}
              aria-current={active ? "step" : undefined}
              aria-label={
                language === "zh"
                  ? "跳至场景 " + sceneId + "：" + copy.title
                  : "Jump to scene " + sceneId + ": " + copy.title
              }
              onPointerEnter={(event) => {
                if (event.pointerType !== "touch") setRevealedScene(sceneId);
              }}
              onFocus={() => setRevealedScene(sceneId)}
              onPointerDown={(event) => handlePointerDown(event, sceneId)}
              onTouchStartCapture={(event) => event.stopPropagation()}
              onClick={(event) => {
                event.stopPropagation();
                setRevealedScene(sceneId);
                jump(sceneId);
              }}
              onKeyDown={(event) => handleKey(event, sceneId)}
              onKeyUp={handleKeyUp}
            >
              <span className={styles.navMiniInk} aria-hidden="true">
                <i />
                <i />
              </span>
              <span className={styles.navNumber}>0{sceneId}</span>
              <span className={styles.navLabel}>
                {sceneId === 5
                  ? language === "zh"
                    ? "色片墙"
                    : "Swatch wall"
                  : language === "zh"
                    ? firstSwatch.zh
                    : firstSwatch.en}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

function buildMetadata(language: Lang): TopicMetadata {
  return {
    theme: language === "zh" ? "七种蓝" : "Seven Blues",
    densityLabel: language === "zh" ? "视觉叙事" : "Visual narrative",
    heroScene: 1,
    colors: {
      bg: "#f5e8be",
      ink: "#171914",
      panel: "#173f99",
    },
    typography: {
      header: "Arial Narrow 700",
      body: "system-ui 500",
    },
    tags: [
      "riso",
      "print",
      "materials",
      "pigment",
      "blue",
      "halftone",
      "visual-narrative",
      "bilingual",
    ],
    fonts: ["Arial Narrow", "system-ui", "cjk:Noto Sans SC"],
    scenes: SCENE_IDS.map((scene) => {
      const copy = SCENES[scene][language];
      return {
        id: scene,
        title: copy.title,
        beats: copy.beats.map((beat, index) => ({
          id: index,
          action: beat.action,
          title: beat.title,
          body: beat.body,
        })),
      };
    }),
  };
}

const metadata = {
  en: buildMetadata("en"),
  zh: buildMetadata("zh"),
} satisfies TopicDefinition["metadata"];

function TopicStage({
  scene,
  beat,
  language,
  isThumbnail,
  reducedMotion,
  onNavigate,
}: TopicStageProps) {
  const frozen =
    typeof document !== "undefined" &&
    document.documentElement.dataset.frozen === "true";
  const settled = reducedMotion || isThumbnail || frozen;
  const activeScene = clampScene(scene);
  const activeBeat = clampBeat(activeScene, beat);

  return (
    <div
      className={cx(styles.root, settled && styles.settled)}
      data-topic-id="seven-blues"
      data-style-id="riso-print-zine"
      data-language={language}
      data-motion={settled ? "off" : "on"}
      data-settled={settled ? "true" : "false"}
      data-frozen={frozen ? "true" : "false"}
      data-thumbnail={isThumbnail ? "true" : "false"}
      data-transition-score="multi-blind|ink-spread|afterimage|multi-blind"
    >
      <svg className={styles.paperGrain} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <filter id="seven-blues-paper-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.76" numOctaves="3" seed="24" />
          <feColorMatrix type="saturate" values="0" />
          <feComponentTransfer>
            <feFuncA type="table" tableValues="0 0.34" />
          </feComponentTransfer>
        </filter>
        <rect width="100" height="100" filter="url(#seven-blues-paper-grain)" />
      </svg>
      <div className={styles.registerMark} aria-hidden="true" />
      <SpatialSceneTrack
        scene={activeScene}
        beat={activeBeat}
        sceneIds={[...SCENE_IDS]}
        transitionKind="multi-blind"
        transitionMap={SEVEN_BLUES_TRANSITION_SCORE}
        transitionDurationMs={500}
        reducedMotion={settled}
        beatLayoutModes={BEAT_LAYOUT_MODES}
        className={styles.sceneTrack}
        renderScene={(trackScene, trackBeat) => (
          <SevenBluesScene
            scene={trackScene as SceneId}
            beat={trackBeat}
            language={language}
          />
        )}
      />
      {!isThumbnail && (
        <BlueSwatchNavigation
          scene={activeScene}
          language={language}
          onNavigate={onNavigate}
        />
      )}
    </div>
  );
}

export default defineTopic({
  id: "seven-blues",
  styleId: "riso-print-zine",
  title: {
    en: "Seven Blues",
    zh: "七种蓝",
  },
  modelId: "GPT 5.6 Sol",
  Stage: TopicStage,
  metadata,
  navigation: NAVIGATION,
  transitionScore: SEVEN_BLUES_TRANSITION_SCORE,
  evidence: {
    kind: "mixed",
    sources: SEVEN_BLUES_SOURCES,
    boundary: {
      en: "Material and process statements are source-backed; the swatches and diagrams are illustrative, not material-color matches or universal cultural meanings of blue.",
      zh: "材料与工艺陈述有来源支持；色片和图示仅为说明，并非材料颜色等同物，也不代表蓝色具有普遍文化含义。",
    },
    display: "stage",
  },
});

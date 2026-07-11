import type {
  CSSProperties,
  KeyboardEvent,
  MouseEvent,
  PointerEvent,
  SyntheticEvent,
  TouchEvent,
} from "react";
import type { Source } from "../domain/evidence";
import {
  defineTopic,
  type TopicDefinition,
  type TopicMetadata,
  type TopicStageProps,
  type TopicTransitionScore,
} from "../domain/topic";
import SpatialSceneTrack from "../components/stage/SpatialSceneTrack";
import type {
  BeatLayoutMode,
  SceneTransitionMap,
} from "../components/stage/SpatialSceneTrack";
import styles from "./concealed-objects.module.css";

type Language = TopicStageProps["language"];
type SceneId = 1 | 2 | 3 | 4 | 5;

const SCENE_IDS: readonly SceneId[] = [1, 2, 3, 4, 5];

const BEAT_COUNTS: Record<SceneId, number> = {
  1: 4,
  2: 3,
  3: 2,
  4: 1,
  5: 1,
};

export type ConcealedObjectsSourceId =
  | "leigh-barton-report"
  | "york-concealed-shoes"
  | "mola-holywell"
  | "lauderdale-cache"
  | "avebury-shoe-cache"
  | "carhullan-mark"
  | "historic-england-marks"
  | "houlbrook-2013";

export type ConcealedObjectsClaimId =
  | "leigh-barton-shoe"
  | "bishopthorpe-pair"
  | "gillygate-child-shoe"
  | "holywell-bottle"
  | "lauderdale-cache"
  | "avebury-shoe-cache"
  | "carhullan-mark"
  | "interpretation-boundary"
  | "marks-interpretation"
  | "conservation-context";

type LocalizedText = Readonly<Record<Language, string>>;

interface ConcealedObjectsSource extends Source {
  id: ConcealedObjectsSourceId;
  accessDate: string;
  citation: string;
  boundary: string;
  claimIds: readonly ConcealedObjectsClaimId[];
  shortLabel: LocalizedText;
}

export interface ConcealedObjectsClaim {
  id: ConcealedObjectsClaimId;
  sourceIds: readonly ConcealedObjectsSourceId[];
  visibleByScene: Readonly<Partial<Record<SceneId, LocalizedText>>>;
}

interface BeatCopy {
  action: string;
  title: string;
  body: string;
}

interface SceneCopy {
  eyebrow: string;
  title: string;
  deck: string;
  nav: string;
  navAria: string;
  beats: readonly BeatCopy[];
}

export const CONCEALED_OBJECTS_TRANSITION_SCORE = {
  "1->2": "paper-fold",
  "2->3": "card-carousel",
  "3->4": "push-x",
  "4->5": "paper-fold",
} as const satisfies TopicTransitionScore;

const TRANSITION_MAP: SceneTransitionMap = CONCEALED_OBJECTS_TRANSITION_SCORE;

const NAVIGATION = {
  geometry: "card-miniature",
  carrier: "wall-cache-fragments",
  invocation: "click-expand",
  feedback: "active-glow",
} as const satisfies TopicDefinition["navigation"];

const BEAT_LAYOUT_MODES: Partial<Record<SceneId, BeatLayoutMode>> = {
  1: "reserved",
  2: "reserved",
  3: "reserved",
  4: "reserved",
  5: "reserved",
};

export const CONCEALED_OBJECTS_SOURCES = [
  {
    id: "leigh-barton-report",
    authority: "Historic England",
    title: "Concealed Shoe from Leigh Barton, Churchstow, South Devon",
    citation:
      "J. H. Thornton, 1982, Ancient Monuments Laboratory Report 3736.",
    url: "https://historicengland.org.uk/research/results/reports/2145/CONCEALEDSHOEFROMLEIGHBARTONCHURCHSTOWSOUTHDEVON",
    accessDate: "2026-07-10",
    supports:
      "Records a roughly 230 mm, right-shaped adult shoe from Leigh Barton, with a repaired sole and upper loss before it was built into plaster; it cautions that exact dating is not possible from the surviving form.",
    boundary:
      "The report describes the object and its condition. It does not identify a wearer or prove why a particular person placed it in the building fabric.",
    shortLabel: { en: "HE · Leigh Barton", zh: "英格兰遗产 · Leigh Barton" },
    claimIds: ["leigh-barton-shoe"],
  },
  {
    id: "york-concealed-shoes",
    authority: "York Museums Trust",
    title: "Concealed Shoes in the York Castle Museum Collection",
    citation:
      "Faye Prior, York Museums Trust, collection research article.",
    url: "https://www.yorkmuseumstrust.org.uk/blog/concealed-shoes-in-the-york-castle-museum-collection/",
    accessDate: "2026-07-10",
    supports:
      "Documents the Bishopthorpe pair found in a wall during 1996 renovation and the 13 cm Gillygate child shoe found under floorboards in a first-floor bedroom above a shop in 2007, including their wear and repair evidence.",
    boundary:
      "The museum explicitly says it does not know who wore or concealed these shoes. The suggested Bishopthorpe concealment date is presented as a probability, not a witnessed event.",
    shortLabel: { en: "YMT · York shoes", zh: "约克博物馆 · 鞋履" },
    claimIds: ["bishopthorpe-pair", "gillygate-child-shoe", "conservation-context"],
  },
  {
    id: "mola-holywell",
    authority: "Museum of London Archaeology",
    title: "The Holywell witch-bottle",
    citation:
      "MOLA webpage article, “The Holywell witch-bottle.”",
    url: "https://www.mola.org.uk/discoveries/news/holywell-witch-bottle",
    accessDate: "2026-07-10",
    supports:
      "Records a London stoneware vessel dated about 1670–1710, placed upright below a floor in the doorway of an eighteenth-century house, with about 60 fine bent copper-alloy pins, nail residue, and an unidentified possible wood or bone fragment.",
    boundary:
      "The possible wood-or-bone fragment is not securely identified. MOLA treats the bottle's ritual or protective reading as an archaeological probability, not proof of a named actor's intention.",
    shortLabel: { en: "MOLA · Holywell", zh: "MOLA · Holywell" },
    claimIds: ["holywell-bottle"],
  },
  {
    id: "lauderdale-cache",
    authority: "London Museum",
    title: "Lauderdale House: Witchcraft relics hidden in the wall",
    citation:
      "London Museum, Lauderdale House collection interpretation, 2024.",
    url: "https://www.londonmuseum.org.uk/blog/lauderdale-house-witchcraft-relics-hidden-in-the-wall/",
    accessDate: "2026-07-10",
    supports:
      "Documents a basket found in 1963 behind a bricked-up wall near a first-floor fireplace: two odd shoes, plaited rush, a broken ceramic candlestick, a broken tazza, and four desiccated chickens; one shoe has been dated to 1650.",
    boundary:
      "The cache is a documented grouping and location, not a biography. Its intended protection, household meaning, and maker cannot be recovered as certain facts from the objects alone.",
    shortLabel: { en: "LM · Lauderdale", zh: "伦敦博物馆 · Lauderdale" },
    claimIds: ["lauderdale-cache"],
  },
  {
    id: "avebury-shoe-cache",
    authority: "Wiltshire and Swindon History Centre",
    title: "Concealed shoes",
    citation:
      "Wiltshire and Swindon History Centre, conservation update for Wiltshire Museum shoes.",
    url: "https://wshc.org.uk/concealed-shoes/",
    accessDate: "2026-07-10",
    supports:
      "Documents three latchet-tie shoes found in 2022 in a chimney wall of a seventeenth-century Avebury cottage, dating them around 1640–70 and describing evidence retained through conservation assessment.",
    boundary:
      "The source lists several possible purposes for concealed shoes but states that their purpose remains uncertain; unusual material details in the cache are also left unresolved.",
    shortLabel: { en: "WSHC · Avebury", zh: "WSHC · Avebury" },
    claimIds: ["avebury-shoe-cache", "conservation-context"],
  },
  {
    id: "carhullan-mark",
    authority: "Historic England",
    title: "Carhullan farmhouse and barn, Bampton — List Entry 1485219",
    citation:
      "Historic England, National Heritage List for England, List Entry 1485219.",
    url: "https://historicengland.org.uk/listing/the-list/list-entry/1485219",
    accessDate: "2026-07-10",
    supports:
      "Records a detached stone discovered during renovation at Carhullan farmhouse, inscribed with JL and 1676 within a circle plus rough marks; the listing says the inscriptions are consistent with apotropaic or ritual marks.",
    boundary:
      "“Consistent with” is not a determination of intent. The listing does not establish whether the markings were protective, commemorative, or made by a specific individual.",
    shortLabel: { en: "HE · Carhullan", zh: "英格兰遗产 · Carhullan" },
    claimIds: ["carhullan-mark"],
  },
  {
    id: "historic-england-marks",
    authority: "Historic England",
    title: "What Are Witches’ Marks?",
    citation:
      "Historic England, Discovering Witches’ Marks guidance feature.",
    url: "https://historicengland.org.uk/whats-new/features/discovering-witches-marks/what-are-witches-marks",
    accessDate: "2026-07-10",
    supports:
      "Explains that ritual-protection or apotropaic marks are often found near doorways, windows, and fireplaces, and notes that the purpose of hexafoils remains disputed even where a protective interpretation is widely used.",
    boundary:
      "The guidance differentiates an interpretive vocabulary from a proven motive. A mark's shape or position cannot by itself establish the belief of a particular historic person.",
    shortLabel: { en: "HE · marks guide", zh: "英格兰遗产 · 刻痕" },
    claimIds: ["marks-interpretation"],
  },
  {
    id: "houlbrook-2013",
    authority: "Cambridge Archaeological Journal",
    title: "Ritual, Recycling and Recontextualization: Putting the Concealed Shoe into Context",
    citation:
      "Ceri Houlbrook, Cambridge Archaeological Journal 23(1), 2013, 99–112.",
    url: "https://www.cambridge.org/core/journals/cambridge-archaeological-journal/article/abs/ritual-recycling-and-recontextualization-putting-the-concealed-shoe-into-context/C6F6897C2F8778F6EA30F5DB74305491",
    accessDate: "2026-07-10",
    supports:
      "Reviews concealed-shoe evidence and states that, beyond the pattern of old and damaged shoes in unconventional building locations, motivations must be approached as archaeological interpretation because contemporaneous written explanations are absent.",
    boundary:
      "This research supports bounded interpretation, not a single explanation for every shoe, bottle, animal remain, or carved mark in this small evidence set.",
    shortLabel: { en: "CAJ · Houlbrook", zh: "CAJ · Houlbrook" },
    claimIds: ["interpretation-boundary"],
  },
] as const satisfies readonly ConcealedObjectsSource[];

export const CONCEALED_OBJECTS_CLAIMS: Record<
  ConcealedObjectsClaimId,
  ConcealedObjectsClaim
> = {
  "leigh-barton-shoe": {
    id: "leigh-barton-shoe",
    sourceIds: ["leigh-barton-report"],
    visibleByScene: {
      1: {
        en: "Leigh Barton, Churchstow: a repaired adult shoe, roughly 230 mm long, was built into plaster.",
        zh: "Churchstow 的 Leigh Barton：一只修补过的成人鞋，约 230 毫米长，被嵌入灰泥。",
      },
      3: {
        en: "Leigh Barton shoe · built into plaster",
        zh: "Leigh Barton 鞋 · 嵌入灰泥",
      },
      4: {
        en: "A repaired shoe and its plaster location are documented at Leigh Barton.",
        zh: "Leigh Barton 的修补鞋及其灰泥位置有记录可查。",
      },
      5: {
        en: "Leigh Barton shoe · plaster · repair",
        zh: "Leigh Barton 鞋 · 灰泥 · 修补",
      },
    },
  },
  "bishopthorpe-pair": {
    id: "bishopthorpe-pair",
    sourceIds: ["york-concealed-shoes"],
    visibleByScene: {
      2: {
        en: "Bishopthorpe pair · found in a wall during 1996 renovation; worn soles carry repairs.",
        zh: "Bishopthorpe 鞋对 · 1996 年修缮时发现于墙内；磨损鞋底留有修补。",
      },
      3: {
        en: "Bishopthorpe pair · wall during renovation",
        zh: "Bishopthorpe 鞋对 · 修缮时的墙内",
      },
      5: {
        en: "Bishopthorpe pair · wall · wear",
        zh: "Bishopthorpe 鞋对 · 墙内 · 磨损",
      },
    },
  },
  "gillygate-child-shoe": {
    id: "gillygate-child-shoe",
    sourceIds: ["york-concealed-shoes"],
    visibleByScene: {
      2: {
        en: "Gillygate shoe · 13 cm child shoe found beneath floorboards in a first-floor bedroom above a shop in 2007.",
        zh: "Gillygate 鞋 · 13 厘米童鞋，2007 年发现于商铺上方二层卧室地板下。",
      },
      3: {
        en: "Gillygate child shoe · floorboards",
        zh: "Gillygate 童鞋 · 地板下",
      },
      5: {
        en: "Gillygate shoe · floorboards · 13 cm",
        zh: "Gillygate 鞋 · 地板下 · 13 厘米",
      },
    },
  },
  "holywell-bottle": {
    id: "holywell-bottle",
    sourceIds: ["mola-holywell"],
    visibleByScene: {
      2: {
        en: "Holywell vessel · c. 1670–1710 London stoneware, placed upright below a floor with about 60 bent copper-alloy pins and nail residue.",
        zh: "Holywell 伦敦炻器瓶 · 约 1670–1710 年，直立置于地板下，内有约 60 枚弯曲铜合金针，另有钉子残留。",
      },
      3: {
        en: "Holywell bottle · below a floor doorway",
        zh: "Holywell 瓶 · 门道地板下",
      },
      4: {
        en: "MOLA recorded an upright London stoneware vessel below a floor, with about 60 bent copper-alloy pins and nail residue.",
        zh: "MOLA 记录到一只直立置于地板下的伦敦炻器瓶，内有约 60 枚弯曲铜合金针，另有钉子残留。",
      },
      5: {
        en: "Holywell bottle · floor · contents",
        zh: "Holywell 瓶 · 地板 · 内容物",
      },
    },
  },
  "lauderdale-cache": {
    id: "lauderdale-cache",
    sourceIds: ["lauderdale-cache"],
    visibleByScene: {
      2: {
        en: "Lauderdale cache · 1963 wall find near a first-floor fireplace: shoes, a broken cup, candlestick, rush, and four desiccated chickens.",
        zh: "Lauderdale 缓存 · 1963 年发现于一层壁炉旁墙内：鞋、破杯、烛台、编织芦苇和四只干尸鸡。",
      },
      3: {
        en: "Lauderdale cache · bricked wall by fireplace",
        zh: "Lauderdale 缓存 · 壁炉旁封砖墙内",
      },
      5: {
        en: "Lauderdale cache · wall · animal remains",
        zh: "Lauderdale 缓存 · 墙内 · 动物遗存",
      },
    },
  },
  "avebury-shoe-cache": {
    id: "avebury-shoe-cache",
    sourceIds: ["avebury-shoe-cache"],
    visibleByScene: {
      2: {
        en: "Avebury cache · three latchet-tie shoes, c. 1640–70, found in a seventeenth-century cottage chimney wall in 2022.",
        zh: "Avebury 缓存 · 三只约 1640–70 年系带鞋，2022 年发现于一座十七世纪小屋的烟囱墙内。",
      },
      3: {
        en: "Avebury cache · chimney wall",
        zh: "Avebury 缓存 · 烟囱墙内",
      },
      5: {
        en: "Avebury cache · chimney · three shoes",
        zh: "Avebury 缓存 · 烟囱 · 三只鞋",
      },
    },
  },
  "carhullan-mark": {
    id: "carhullan-mark",
    sourceIds: ["carhullan-mark"],
    visibleByScene: {
      2: {
        en: "Carhullan stone · found in renovation, inscribed JL and 1676 inside a circle with rough additional marks.",
        zh: "Carhullan 石块 · 修缮中发现，圆圈内刻有 JL 和 1676，另有粗略刻痕。",
      },
      3: {
        en: "Carhullan stone · discovered in renovation",
        zh: "Carhullan 石块 · 修缮中发现",
      },
      4: {
        en: "The Carhullan listing records JL, 1676, and rough marks on a detached renovation find.",
        zh: "Carhullan 名录记录了一块修缮时发现的石块，上有 JL、1676 和粗略刻痕。",
      },
      5: {
        en: "Carhullan stone · record · mark",
        zh: "Carhullan 石块 · 记录 · 刻痕",
      },
    },
  },
  "interpretation-boundary": {
    id: "interpretation-boundary",
    sourceIds: ["houlbrook-2013"],
    visibleByScene: {
      1: {
        en: "The location is recorded. A personal motive is not.",
        zh: "位置有记录；个人动机没有。",
      },
      3: {
        en: "A location plan is evidence, not a universal rule.",
        zh: "位置图是证据，不是普遍规律。",
      },
      4: {
        en: "Deliberate concealment and protective use are research readings; they do not name a historic person's intention.",
        zh: "“有意藏置”和“保护用途”属于研究解读；它们不能替某个历史人物说出动机。",
      },
      5: {
        en: "A documented cache is not a recovered biography.",
        zh: "有记录的缓存，不等于找回了一段人物传记。",
      },
    },
  },
  "marks-interpretation": {
    id: "marks-interpretation",
    sourceIds: ["historic-england-marks"],
    visibleByScene: {
      4: {
        en: "“Apotropaic” is a comparison vocabulary for marks near openings; a hexafoil's purpose remains disputed.",
        zh: "“辟邪性”是比较刻痕时使用的词汇；六瓣花纹的用途仍有争议。",
      },
    },
  },
  "conservation-context": {
    id: "conservation-context",
    sourceIds: ["york-concealed-shoes", "avebury-shoe-cache"],
    visibleByScene: {
      5: {
        en: "Condition, repair, dirt, and find location are part of the evidence—not clutter to erase.",
        zh: "状态、修补、泥土和发现位置都是证据，不是该被抹掉的杂物。",
      },
    },
  },
};

export const CONCEALED_OBJECTS_SCENE_CLAIMS: Record<
  SceneId,
  readonly ConcealedObjectsClaimId[]
> = {
  1: ["leigh-barton-shoe", "interpretation-boundary"],
  2: [
    "bishopthorpe-pair",
    "gillygate-child-shoe",
    "holywell-bottle",
    "lauderdale-cache",
    "avebury-shoe-cache",
    "carhullan-mark",
  ],
  3: [
    "leigh-barton-shoe",
    "bishopthorpe-pair",
    "gillygate-child-shoe",
    "holywell-bottle",
    "lauderdale-cache",
    "avebury-shoe-cache",
    "carhullan-mark",
    "interpretation-boundary",
  ],
  4: [
    "leigh-barton-shoe",
    "holywell-bottle",
    "carhullan-mark",
    "interpretation-boundary",
    "marks-interpretation",
  ],
  5: [
    "leigh-barton-shoe",
    "bishopthorpe-pair",
    "gillygate-child-shoe",
    "holywell-bottle",
    "lauderdale-cache",
    "avebury-shoe-cache",
    "carhullan-mark",
    "interpretation-boundary",
    "conservation-context",
  ],
};

const SCENE_COPY: Record<Language, Record<SceneId, SceneCopy>> = {
  en: {
    1: {
      eyebrow: "OBJECT RECORD / 01",
      title: "Inside the\nWall",
      deck: "A sealed surface opens onto an object record—not a ghost story.",
      nav: "sealed wall",
      navAria: "Open wall fragment 1: sealed wall",
      beats: [
        { action: "Wall fragment holds", title: "Inside the Wall", body: "A sealed wall begins as a record surface." },
        { action: "Shoe appears", title: "Object revealed", body: "A documented shoe enters the opening." },
        { action: "Condition label lands", title: "Condition retained", body: "Repair and material evidence stay attached to the find." },
        { action: "Limit is pinned", title: "Record, not motive", body: "The location is known; intention remains unassigned." },
      ],
    },
    2: {
      eyebrow: "OBJECT FRAGMENTS / 02",
      title: "Seven records,\nseveral thresholds",
      deck: "Shoes, a bottle, animal remains, and a marked stone arrive with their actual find contexts.",
      nav: "object fragments",
      navAria: "Open wall fragment 2: object fragments",
      beats: [
        { action: "First records land", title: "Object fragments", body: "Three documented finds enter as separate scraps." },
        { action: "Further records land", title: "More evidence", body: "More materials add locations without inventing owners." },
        { action: "Location tabs attach", title: "Context stays attached", body: "Each fragment keeps its record trail." },
      ],
    },
    3: {
      eyebrow: "LOCATION PLAN / 03",
      title: "Where the record\nputs the object",
      deck: "Wall, floor, chimney, fireplace: a small documented set, stitched without turning it into a rule.",
      nav: "location plan",
      navAria: "Open wall fragment 3: location plan",
      beats: [
        { action: "Plan labels settle", title: "Find locations", body: "Records are placed beside their documented building locations." },
        { action: "Evidence stitches appear", title: "Stitch the plan", body: "A line compares locations while preserving uncertainty." },
      ],
    },
    4: {
      eyebrow: "EVIDENCE CLUSTERS / 04",
      title: "Three layers.\nDo not blend them.",
      deck: "Finding facts, research interpretation, and folklore analogy carry different evidential weight.",
      nav: "evidence clusters",
      navAria: "Open wall fragment 4: evidence clusters",
      beats: [
        { action: "Three evidence layers settle", title: "Separate the claims", body: "The overlay stays readable because the categories remain distinct." },
      ],
    },
    5: {
      eyebrow: "CONSERVATION TRAY / 05",
      title: "Concealed does not\nmean understood.",
      deck: "Return the fragments to a tray with condition, location, source, and uncertainty still attached.",
      nav: "conservation tray",
      navAria: "Open wall fragment 5: conservation tray",
      beats: [
        { action: "Tray settles", title: "Return to the record", body: "Evidence survives best when its context and limits stay together." },
      ],
    },
  },
  zh: {
    1: {
      eyebrow: "物件记录 / 01",
      title: "墙中\n藏物",
      deck: "封闭表面打开的是物件记录，不是鬼故事。",
      nav: "封墙",
      navAria: "打开墙体碎片 1：封墙",
      beats: [
        { action: "墙体碎片静置", title: "墙中藏物", body: "封闭的墙面先作为记录表面。" },
        { action: "鞋履出现", title: "物件显现", body: "一只可追溯的鞋进入开口。" },
        { action: "状态标签落位", title: "保留状态", body: "修补和材料证据继续附着在发现记录上。" },
        { action: "限制被钉住", title: "记录，不代言动机", body: "位置可知；意图不被擅自指定。" },
      ],
    },
    2: {
      eyebrow: "物件碎片 / 02",
      title: "七份记录，\n数个边界",
      deck: "鞋、瓶、动物遗存和带刻痕的石块，连同真实发现位置一同抵达。",
      nav: "物件碎片",
      navAria: "打开墙体碎片 2：物件碎片",
      beats: [
        { action: "首批记录落下", title: "物件碎片", body: "三项有记录的发现以独立纸片进入。" },
        { action: "更多记录落下", title: "更多证据", body: "更多材料带来位置，不虚构主人。" },
        { action: "位置标签附着", title: "语境不脱落", body: "每片碎片都保留可追溯的记录路径。" },
      ],
    },
    3: {
      eyebrow: "位置图 / 03",
      title: "记录把物件\n放在哪里",
      deck: "墙、地板、烟囱、壁炉：一组小样本记录，被缝合但不被夸大成规则。",
      nav: "位置图",
      navAria: "打开墙体碎片 3：位置图",
      beats: [
        { action: "平面标签稳定", title: "发现位置", body: "记录被放到对应的建筑位置旁。" },
        { action: "证据缝线出现", title: "缝合位置图", body: "线条比较位置，同时保留不确定性。" },
      ],
    },
    4: {
      eyebrow: "证据簇 / 04",
      title: "三层证据。\n不要混色。",
      deck: "发现事实、研究推断和民俗类比分别承载不同的证据重量。",
      nav: "证据簇",
      navAria: "打开墙体碎片 4：证据簇",
      beats: [
        { action: "三层证据静置", title: "分开主张", body: "透明纸叠放，但分类保持清晰。" },
      ],
    },
    5: {
      eyebrow: "保护托盘 / 05",
      title: "被藏起，\n不等于已被理解。",
      deck: "碎片回到托盘，状态、位置、来源和不确定性仍然附着其上。",
      nav: "保护托盘",
      navAria: "打开墙体碎片 5：保护托盘",
      beats: [
        { action: "托盘静置", title: "回到记录", body: "当语境与边界被保留，证据才更可读。" },
      ],
    },
  },
};

interface ObjectRecord {
  id: string;
  claimId: ConcealedObjectsClaimId;
  sourceId: ConcealedObjectsSourceId;
  showAt: number;
  x: number;
  y: number;
  w: number;
  h: number;
  rotate: number;
  tone: "cream" | "rust" | "indigo" | "mustard" | "note" | "olive";
  clip: "one" | "two" | "three" | "four" | "five";
}

export const CONCEALED_OBJECT_RECORDS: readonly ObjectRecord[] = [
  { id: "leigh", claimId: "leigh-barton-shoe", sourceId: "leigh-barton-report", showAt: 0, x: 4, y: 20, w: 28, h: 20, rotate: -6, tone: "cream", clip: "one" },
  { id: "bishopthorpe", claimId: "bishopthorpe-pair", sourceId: "york-concealed-shoes", showAt: 0, x: 33, y: 25, w: 27, h: 18, rotate: 5, tone: "indigo", clip: "two" },
  { id: "holywell", claimId: "holywell-bottle", sourceId: "mola-holywell", showAt: 0, x: 66, y: 16, w: 27, h: 21, rotate: -4, tone: "rust", clip: "three" },
  { id: "gillygate", claimId: "gillygate-child-shoe", sourceId: "york-concealed-shoes", showAt: 1, x: 9, y: 48, w: 25, h: 17, rotate: 7, tone: "mustard", clip: "four" },
  { id: "lauderdale", claimId: "lauderdale-cache", sourceId: "lauderdale-cache", showAt: 1, x: 39, y: 46, w: 30, h: 18, rotate: -5, tone: "note", clip: "five" },
  { id: "avebury", claimId: "avebury-shoe-cache", sourceId: "avebury-shoe-cache", showAt: 1, x: 69, y: 49, w: 25, h: 16, rotate: 6, tone: "olive", clip: "one" },
  { id: "carhullan", claimId: "carhullan-mark", sourceId: "carhullan-mark", showAt: 2, x: 24, y: 54, w: 38, h: 11, rotate: -2, tone: "cream", clip: "three" },
];

function getClaimText(
  claimId: ConcealedObjectsClaimId,
  scene: SceneId,
  language: Language,
): string {
  return CONCEALED_OBJECTS_CLAIMS[claimId].visibleByScene[scene]?.[language] ?? "";
}

function getSource(sourceId: ConcealedObjectsSourceId): ConcealedObjectsSource {
  const source = CONCEALED_OBJECTS_SOURCES.find((item) => item.id === sourceId);
  if (!source) {
    throw new Error(`Missing concealed-object source ${sourceId}`);
  }
  return source;
}

function getSceneSourceIds(scene: SceneId): ConcealedObjectsSourceId[] {
  return Array.from(
    new Set(
      CONCEALED_OBJECTS_SCENE_CLAIMS[scene].flatMap(
        (claimId) => CONCEALED_OBJECTS_CLAIMS[claimId].sourceIds,
      ),
    ),
  );
}

function eventStop(event: SyntheticEvent) {
  event.stopPropagation();
}

function TraceabilityRail({ scene, language }: { scene: SceneId; language: Language }) {
  const claimIds = CONCEALED_OBJECTS_SCENE_CLAIMS[scene];
  const sourceIds = getSceneSourceIds(scene);
  const claimSourceLinks = claimIds
    .map(
      (claimId) =>
        `${claimId}:${CONCEALED_OBJECTS_CLAIMS[claimId].sourceIds.join(",")}`,
    )
    .join(";");

  return (
    <aside
      className={styles.traceabilityRail}
      data-beat-layout-item="true"
      data-scene-source-stamp="true"
      data-claim-source-map="true"
      data-scene-id={scene}
      data-claim-ids={claimIds.join(" ")}
      data-source-ids={sourceIds.join(" ")}
      data-claim-source-links={claimSourceLinks}
      aria-label={language === "zh" ? "本场来源" : "Sources for this scene"}
    >
      <span className={styles.traceLabel}>{language === "zh" ? "来源 / 证据" : "SOURCE / EVIDENCE"}</span>
      <span className={styles.traceStamps}>
        {sourceIds.map((sourceId) => {
          const source = getSource(sourceId);
          return (
            <a
              key={sourceId}
              className={styles.sourceStamp}
              data-source-id={sourceId}
              href={source.url}
              target="_blank"
              rel="noreferrer"
              onPointerDown={eventStop}
              onTouchStart={eventStop}
              onClick={eventStop}
            >
              {source.shortLabel[language]}
            </a>
          );
        })}
      </span>
    </aside>
  );
}

function PaperGrain() {
  return (
    <svg className={styles.paperGrain} aria-hidden="true" viewBox="0 0 100 100" preserveAspectRatio="none">
      <path d="M0 12 C12 8 24 17 38 11 S63 8 78 14 S92 11 100 15 M0 37 C16 31 29 42 45 35 S70 31 86 38 S96 36 100 39 M0 67 C12 61 27 72 43 65 S69 62 81 69 S94 65 100 70 M0 90 C17 85 29 96 47 88 S71 85 89 91" />
      <g>
        <circle cx="9" cy="24" r="0.25" />
        <circle cx="19" cy="77" r="0.19" />
        <circle cx="33" cy="49" r="0.18" />
        <circle cx="52" cy="21" r="0.21" />
        <circle cx="64" cy="82" r="0.22" />
        <circle cx="79" cy="40" r="0.18" />
        <circle cx="93" cy="61" r="0.21" />
      </g>
    </svg>
  );
}

function ShoeDrawing() {
  return (
    <svg className={styles.shoeDrawing} aria-hidden="true" viewBox="0 0 160 100">
      <path d="M16 62 C27 54 38 37 51 20 C60 8 75 8 86 21 L102 41 C111 51 129 55 144 61 C153 65 154 77 145 83 C113 96 63 94 19 84 C10 82 8 69 16 62 Z" />
      <path d="M51 20 C51 42 57 54 70 63 C80 70 98 74 121 74" />
      <path d="M28 72 C54 80 91 84 139 77" />
      <path d="M66 28 L79 44 M61 38 L76 52 M56 48 L70 59" />
      <circle cx="42" cy="65" r="3" />
      <circle cx="102" cy="72" r="2.5" />
    </svg>
  );
}

function BottleDrawing() {
  return (
    <svg className={styles.bottleDrawing} aria-hidden="true" viewBox="0 0 100 140">
      <path d="M37 8 H63 V35 C63 43 76 52 79 64 L89 111 C92 127 80 135 50 135 C20 135 8 127 11 111 L21 64 C24 52 37 43 37 35 Z" />
      <path d="M30 77 C42 70 60 70 72 77 M24 101 C42 94 59 94 78 101" />
      <circle cx="42" cy="90" r="3" />
      <circle cx="58" cy="107" r="3" />
      <circle cx="66" cy="88" r="2" />
    </svg>
  );
}

function MarkDrawing() {
  return (
    <svg className={styles.markDrawing} aria-hidden="true" viewBox="0 0 120 80">
      <circle cx="39" cy="29" r="22" />
      <text x="27" y="25">JL</text>
      <text x="18" y="41">1676</text>
      <rect x="18" y="57" width="62" height="15" />
      <path d="M24 68 L32 60 L39 69 M47 61 L54 68 L62 60 M68 69 L75 61" />
    </svg>
  );
}

function Reveal({
  shown,
  className,
  children,
  label,
}: {
  shown: boolean;
  className?: string;
  children: React.ReactNode;
  label?: string;
}) {
  return (
    <div
      className={[styles.reveal, className].filter(Boolean).join(" ")}
      data-beat-layout-item="true"
      data-revealed={shown ? "true" : "false"}
      aria-hidden={shown ? undefined : true}
      aria-label={label}
    >
      {children}
    </div>
  );
}

function SceneFrame({
  scene,
  language,
  composition,
  children,
}: {
  scene: SceneId;
  language: Language;
  composition: string;
  children: React.ReactNode;
}) {
  return (
    <section
      className={[styles.scene, styles[`scene${scene}`]].join(" ")}
      data-scene-content={scene}
      data-composition={composition}
      data-beat-layout-container="true"
      data-beat-layout-mode="reserved"
      data-visible-claim-ids={CONCEALED_OBJECTS_SCENE_CLAIMS[scene].join(" ")}
    >
      <PaperGrain />
      {children}
      <TraceabilityRail scene={scene} language={language} />
    </section>
  );
}

function SceneHeading({
  scene,
  language,
}: {
  scene: SceneId;
  language: Language;
}) {
  const copy = SCENE_COPY[language][scene];
  return (
    <header className={styles.sceneHeading} data-beat-layout-item="true">
      <p>{copy.eyebrow}</p>
      <h1>{copy.title}</h1>
      <span>{copy.deck}</span>
    </header>
  );
}

function SceneOne({ beat, language }: { beat: number; language: Language }) {
  const firstFact = getClaimText("leigh-barton-shoe", 1, language);
  const boundary = getClaimText("interpretation-boundary", 1, language);
  const detail = language === "zh" ? "修补 · 约 230 毫米 · 灰泥" : "repair · c. 230 mm · plaster";

  return (
    <SceneFrame scene={1} language={language} composition="sealed-wall">
      <div className={styles.wallSurface} data-beat-layout-item="true">
        <span className={styles.wallSeam} />
        <span className={styles.wallLabel}>{language === "zh" ? "墙层 / 未打开" : "WALL LAYER / SEALED"}</span>
      </div>
      <SceneHeading scene={1} language={language} />
      <div className={styles.wallOpening} data-beat-layout-item="true">
        <span className={styles.tapeTop} />
        <div className={styles.tornReveal}>
          <ShoeDrawing />
          <span className={styles.objectTag}>{language === "zh" ? "鞋履记录" : "SHOE RECORD"}</span>
        </div>
      </div>
      <Reveal shown={beat >= 1} className={styles.sceneOneFact}>
        <p>{firstFact}</p>
      </Reveal>
      <Reveal shown={beat >= 2} className={styles.sceneOneDetail}>
        <span>{detail}</span>
      </Reveal>
      <Reveal shown={beat >= 3} className={styles.sceneOneBoundary}>
        <span className={styles.pinDot} />
        <p>{boundary}</p>
      </Reveal>
      <span className={styles.handArrow} aria-hidden="true">{language === "zh" ? "先读记录 →" : "read the record →"}</span>
    </SceneFrame>
  );
}

function EvidenceScrap({
  record,
  shown,
  language,
}: {
  record: ObjectRecord;
  shown: boolean;
  language: Language;
}) {
  const source = getSource(record.sourceId);
  const style = {
    left: `${record.x}cqw`,
    top: `${record.y}cqh`,
    width: `${record.w}cqw`,
    minHeight: `${record.h}cqh`,
    transform: `rotate(${record.rotate}deg)`,
  } satisfies CSSProperties;

  return (
    <Reveal shown={shown} className={styles.evidenceReveal}>
      <article
        className={[styles.evidenceScrap, styles[`tone${record.tone}`], styles[`clip${record.clip}`]].join(" ")}
        style={style}
        data-claim-id={record.claimId}
        data-source-id={record.sourceId}
      >
        <span className={styles.scrapPin} />
        {record.claimId === "holywell-bottle" ? <BottleDrawing /> : null}
        {record.claimId === "carhullan-mark" ? <MarkDrawing /> : null}
        <p>{getClaimText(record.claimId, 2, language)}</p>
        <span>{source.shortLabel[language]}</span>
      </article>
    </Reveal>
  );
}

function SceneTwo({ beat, language }: { beat: number; language: Language }) {
  return (
    <SceneFrame scene={2} language={language} composition="object-fragments">
      <SceneHeading scene={2} language={language} />
      <div className={styles.fragmentDesk} data-beat-layout-item="true">
        <span className={styles.deskCutLine} />
        {CONCEALED_OBJECT_RECORDS.map((record) => (
          <EvidenceScrap key={record.id} record={record} shown={beat >= record.showAt} language={language} />
        ))}
      </div>
      <span className={styles.fragmentInstruction} data-beat-layout-item="true">
        {language === "zh" ? "每片都带着位置与来源。" : "Every fragment keeps a location and source."}
      </span>
    </SceneFrame>
  );
}

const PLAN_RECORD_IDS = [
  "leigh",
  "bishopthorpe",
  "gillygate",
  "holywell",
  "lauderdale",
  "avebury",
  "carhullan",
] as const;

const PLAN_POSITIONS: Record<(typeof PLAN_RECORD_IDS)[number], { x: number; y: number; rotate: number }> = {
  leigh: { x: 44, y: 22, rotate: -4 },
  bishopthorpe: { x: 65, y: 18, rotate: 5 },
  gillygate: { x: 72, y: 45, rotate: -2 },
  holywell: { x: 49, y: 54, rotate: 4 },
  lauderdale: { x: 59, y: 35, rotate: -5 },
  avebury: { x: 76, y: 56, rotate: 3 },
  carhullan: { x: 35, y: 48, rotate: -3 },
};

function StitchPlan({ shown }: { shown: boolean }) {
  return (
    <svg
      className={styles.stitchPlan}
      data-beat-layout-item="true"
      data-revealed={shown ? "true" : "false"}
      aria-hidden="true"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      <path d="M20 30 C31 24 36 30 45 28 S62 19 75 24 S87 35 74 44 S63 58 53 63 S35 62 29 52 S20 42 20 30" />
      <path d="M31 52 C43 44 53 49 60 42 S68 32 75 24" />
      <path d="M45 28 C46 43 46 53 53 63" />
    </svg>
  );
}

function SceneThree({ beat, language }: { beat: number; language: Language }) {
  return (
    <SceneFrame scene={3} language={language} composition="location-plan">
      <div className={styles.planMargin} data-beat-layout-item="true">
        <SceneHeading scene={3} language={language} />
        <p>{language === "zh" ? "墙腔、地板、烟囱和壁炉附近在这些具体记录中出现。" : "Wall cavities, floors, chimneys, and fireplace-adjacent space occur in these particular records."}</p>
      </div>
      <div className={styles.housePlan} data-beat-layout-item="true">
        <span className={styles.planOuter} />
        <span className={styles.planRoomOne} />
        <span className={styles.planRoomTwo} />
        <span className={styles.planFireplace} />
        <span className={styles.planChimney} />
        <span className={styles.planFloor} />
        {PLAN_RECORD_IDS.map((recordId) => {
          const record = CONCEALED_OBJECT_RECORDS.find((item) => item.id === recordId)!;
          const position = PLAN_POSITIONS[recordId];
          return (
            <span
              key={record.id}
              className={[styles.planTag, styles[`tone${record.tone}`]].join(" ")}
              style={{
                left: `${position.x}cqw`,
                top: `${position.y}cqh`,
                transform: `rotate(${position.rotate}deg)`,
              }}
              data-beat-layout-item="true"
              data-claim-id={record.claimId}
              data-source-id={record.sourceId}
            >
              {getClaimText(record.claimId, 3, language)}
            </span>
          );
        })}
        <StitchPlan shown={beat >= 1} />
      </div>
      <Reveal shown={beat >= 1} className={styles.planBoundary}>
        <span className={styles.handArrow} aria-hidden="true">{language === "zh" ? "位置相连 ≠ 动机确定" : "linked places ≠ fixed motive"}</span>
        <p>{getClaimText("interpretation-boundary", 3, language)}</p>
      </Reveal>
    </SceneFrame>
  );
}

function EvidenceLayer({
  kind,
  title,
  body,
  sourceIds,
  language,
}: {
  kind: "finding" | "research" | "folklore";
  title: string;
  body: string;
  sourceIds: readonly ConcealedObjectsSourceId[];
  language: Language;
}) {
  return (
    <article
      className={[styles.evidenceLayer, styles[`layer${kind}`]].join(" ")}
      data-beat-layout-item="true"
      data-evidence-layer={kind}
    >
      <span className={styles.layerTape} />
      <h2>{title}</h2>
      <p>{body}</p>
      <footer>
        {sourceIds.map((sourceId) => (
          <span key={sourceId} data-source-id={sourceId}>
            {getSource(sourceId).shortLabel[language]}
          </span>
        ))}
      </footer>
    </article>
  );
}

function SceneFour({ language }: { language: Language }) {
  const documentTitle = language === "zh" ? "发现事实" : "Documented find";
  const researchTitle = language === "zh" ? "研究推断" : "Research reading";
  const folkloreTitle = language === "zh" ? "民俗类比" : "Folklore analogy";
  const finding = `${getClaimText("leigh-barton-shoe", 4, language)} ${getClaimText("holywell-bottle", 4, language)} ${getClaimText("carhullan-mark", 4, language)}`;

  return (
    <SceneFrame scene={4} language={language} composition="evidence-clusters">
      <SceneHeading scene={4} language={language} />
      <div className={styles.evidenceStack} data-beat-layout-item="true">
        <EvidenceLayer
          kind="finding"
          title={documentTitle}
          body={finding}
          language={language}
          sourceIds={["leigh-barton-report", "mola-holywell", "carhullan-mark"]}
        />
        <EvidenceLayer
          kind="research"
          title={researchTitle}
          body={getClaimText("interpretation-boundary", 4, language)}
          language={language}
          sourceIds={["houlbrook-2013"]}
        />
        <EvidenceLayer
          kind="folklore"
          title={folkloreTitle}
          body={getClaimText("marks-interpretation", 4, language)}
          language={language}
          sourceIds={["historic-england-marks"]}
        />
      </div>
      <span className={styles.evidenceNote} data-beat-layout-item="true">
        {language === "zh" ? "透明纸重叠；结论不混色。" : "The papers overlap; their conclusion types do not."}
      </span>
    </SceneFrame>
  );
}

function TrayObject({
  record,
  language,
  index,
}: {
  record: ObjectRecord;
  language: Language;
  index: number;
}) {
  return (
    <div
      className={[styles.trayObject, styles[`traySlot${index}`], styles[`tone${record.tone}`]].join(" ")}
      data-beat-layout-item="true"
      data-claim-id={record.claimId}
      data-source-id={record.sourceId}
    >
      <span className={styles.trayString} />
      <p>{getClaimText(record.claimId, 5, language)}</p>
    </div>
  );
}

function SceneFive({ language }: { language: Language }) {
  return (
    <SceneFrame scene={5} language={language} composition="conservation-tray">
      <div className={styles.closingPanel} data-beat-layout-item="true">
        <SceneHeading scene={5} language={language} />
        <p className={styles.closingBoundary}>{getClaimText("interpretation-boundary", 5, language)}</p>
        <p className={styles.closingCare}>{getClaimText("conservation-context", 5, language)}</p>
      </div>
      <div className={styles.conservationTray} data-beat-layout-item="true" data-conservation-tray="true">
        <span className={styles.trayLabel}>{language === "zh" ? "保护托盘 / 位置与状态" : "CONSERVATION TRAY / CONTEXT + CONDITION"}</span>
        {CONCEALED_OBJECT_RECORDS.map((record, index) => (
          <TrayObject key={record.id} record={record} index={index + 1} language={language} />
        ))}
      </div>
      <span className={styles.finalPin} aria-hidden="true" />
    </SceneFrame>
  );
}

function ScenePanel({
  scene,
  beat,
  language,
}: {
  scene: SceneId;
  beat: number;
  language: Language;
}) {
  const safeBeat = Math.max(0, Math.min(beat, BEAT_COUNTS[scene] - 1));

  if (scene === 1) return <SceneOne beat={safeBeat} language={language} />;
  if (scene === 2) return <SceneTwo beat={safeBeat} language={language} />;
  if (scene === 3) return <SceneThree beat={safeBeat} language={language} />;
  if (scene === 4) return <SceneFour language={language} />;
  return <SceneFive language={language} />;
}

function stopNavigationPointer(
  event: PointerEvent<HTMLButtonElement> | TouchEvent<HTMLButtonElement>,
) {
  event.stopPropagation();
}

function WallCacheNavigation({
  scene,
  language,
  onNavigate,
}: {
  scene: SceneId;
  language: Language;
  onNavigate?: TopicStageProps["onNavigate"];
}) {
  const jump = (event: MouseEvent<HTMLButtonElement>, targetScene: SceneId) => {
    event.preventDefault();
    event.stopPropagation();
    onNavigate?.(targetScene, 0);
  };

  const jumpWithKeyboard = (
    event: KeyboardEvent<HTMLButtonElement>,
    targetScene: SceneId,
  ) => {
    if (event.repeat || !["Enter", " ", "Spacebar"].includes(event.key)) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    onNavigate?.(targetScene, 0);
  };

  return (
    <nav
      className={styles.wallCacheNavigation}
      data-topic-navigation="true"
      data-navigation-geometry={NAVIGATION.geometry}
      data-navigation-carrier={NAVIGATION.carrier}
      data-navigation-invocation={NAVIGATION.invocation}
      data-navigation-feedback={NAVIGATION.feedback}
      data-expanded="true"
      aria-label={language === "zh" ? "墙体碎片场景导航" : "Wall-cache fragment navigation"}
    >
      <span className={styles.navCaption}>{language === "zh" ? "墙体碎片" : "WALL-CACHE"}</span>
      <div className={styles.navFragments}>
        {SCENE_IDS.map((sceneId) => {
          const active = sceneId === scene;
          const copy = SCENE_COPY[language][sceneId];
          return (
            <button
              key={sceneId}
              type="button"
              className={styles.navFragment}
              data-active={active ? "true" : "false"}
              aria-current={active ? "page" : undefined}
              aria-label={copy.navAria}
              onPointerDown={stopNavigationPointer}
              onTouchStart={stopNavigationPointer}
              onClick={(event) => jump(event, sceneId)}
              onKeyDown={(event) => jumpWithKeyboard(event, sceneId)}
            >
              <span>{sceneId}</span>
              <small>{copy.nav}</small>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

function buildMetadata(language: Language): TopicMetadata {
  const localized = SCENE_COPY[language];
  return {
    theme: language === "zh" ? "墙中藏物" : "Inside the Wall",
    densityLabel: language === "zh" ? "中高密度 / 证据拼贴" : "Medium-dense / Evidence collage",
    heroScene: 1,
    colors: {
      bg: "#d8c7a2",
      ink: "#2e2519",
      panel: "#f0e2bd",
    },
    typography: {
      header: language === "zh" ? "Songti SC 700" : "Georgia 700",
      body: language === "zh" ? "PingFang SC 500" : "Georgia 400",
    },
    tags: [
      "collage",
      "cutout",
      "archaeology",
      "material-culture",
      "evidence",
      "paper",
      "conservation",
      "hand-annotated",
    ],
    fonts: ["Georgia", "cjk:Songti SC", "cjk:PingFang SC"],
    scenes: SCENE_IDS.map((scene) => ({
      id: scene,
      title: localized[scene].title.replace("\n", " "),
      beats: localized[scene].beats.map((beat, index) => ({
        id: index,
        action: beat.action,
        title: beat.title,
        body: beat.body,
      })),
    })),
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
  const safeScene = SCENE_IDS.includes(scene as SceneId) ? (scene as SceneId) : 1;
  const motionDisabled = reducedMotion || isThumbnail;

  return (
    <div
      className={styles.root}
      data-topic-id="concealed-objects"
      data-motion={motionDisabled ? "off" : "on"}
      data-object-art="drawn"
    >
      <header className={styles.staticHeader} data-beat-layout-item="true">
        <span>{language === "zh" ? "建筑内部的物质证据" : "MATERIAL EVIDENCE INSIDE BUILDINGS"}</span>
        <strong>{language === "zh" ? "墙中藏物" : "INSIDE THE WALL"}</strong>
        <span>{language === "zh" ? "发现事实 · 推断边界" : "FIND · INFERENCE · LIMIT"}</span>
      </header>
      <div className={styles.trackShell}>
        <SpatialSceneTrack
          scene={safeScene}
          beat={beat}
          transitionKind="paper-fold"
          transitionMap={TRANSITION_MAP}
          transitionDurationMs={560}
          reducedMotion={motionDisabled}
          beatLayoutModes={BEAT_LAYOUT_MODES}
          className={styles.track}
          renderScene={(sceneId, sceneBeat) => (
            <ScenePanel scene={sceneId as SceneId} beat={sceneBeat} language={language} />
          )}
        />
      </div>
      {isThumbnail ? null : (
        <WallCacheNavigation scene={safeScene} language={language} onNavigate={onNavigate} />
      )}
    </div>
  );
}

export default defineTopic({
  id: "concealed-objects",
  styleId: "analog-cutout-collage",
  title: { en: "Inside the Wall", zh: "墙中藏物" },
  modelId: "GPT 5.6 Sol",
  Stage: TopicStage,
  metadata,
  navigation: NAVIGATION,
  transitionScore: CONCEALED_OBJECTS_TRANSITION_SCORE,
  evidence: {
    kind: "mixed",
    sources: CONCEALED_OBJECTS_SOURCES,
    boundary: {
      en: "Object details and find contexts are source-backed; associations with concealment practices remain bounded interpretations and do not establish a historic person's intent.",
      zh: "物件细节与发现背景均有来源支持；与藏匿习俗的联系仍属有边界的解释，不能证明某位历史人物的意图。",
    },
  display: "envelope",
  },
});

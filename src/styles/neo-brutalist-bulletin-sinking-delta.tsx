import { useRef } from "react";
import type {
  CSSProperties,
  KeyboardEvent,
  PointerEvent,
  TouchEvent,
} from "react";
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
import styles from "./neo-brutalist-bulletin-sinking-delta.module.css";

type Language = BespokeStyleProps["language"];
type SceneId = 1 | 2 | 3 | 4 | 5;

export type SinkingDeltaClaimId =
  | "scene-1-regional-land-loss"
  | "scene-1-multi-force-balance"
  | "scene-2-sediment-input-limit"
  | "scene-3-spatial-subsidence"
  | "scene-4-routing-not-sole-cause"
  | "scene-5-adaptive-restoration-portfolio";

export type SinkingDeltaSourceId =
  | "usgs-coastal-louisiana-land-loss-2024"
  | "usgs-wetland-loss-processes-2010"
  | "cpra-deep-subsidence-2023"
  | "nature-holocene-compaction-2008"
  | "cpra-adaptive-coastal-plan";

interface SinkingDeltaSource extends TopicSource {
  id: SinkingDeltaSourceId;
  claimIds: readonly SinkingDeltaClaimId[];
  authority: string;
  title: string;
  citation: string;
  boundary: string;
}

interface SinkingDeltaVisibleClaim {
  scene: SceneId;
  beat: number;
  sourceIds: readonly SinkingDeltaSourceId[];
  visibleLabels: Record<Language, readonly string[]>;
}

interface BeatCopy {
  action: string;
  title: string;
  body: string;
}

interface SceneCopy {
  kicker: string;
  headline: string;
  deck: string;
  beats: BeatCopy[];
}

const SCENE_IDS: SceneId[] = [1, 2, 3, 4, 5];

const BEAT_LAYOUT_MODES: Record<SceneId, BeatLayoutMode> = {
  1: "reserved",
  2: "reserved",
  3: "reserved",
  4: "reserved",
  5: "reserved",
};

export const SINKING_DELTA_TRANSITION_SCORE = {
  "1->2": "hard-cut",
  "2->3": "grid-reveal",
  "3->4": "diagonal-pan",
  "4->5": "hard-cut",
} as const satisfies Readonly<TopicTransitionScore>;

const TRANSITION_MAP: SceneTransitionMap = SINKING_DELTA_TRANSITION_SCORE;

export const SINKING_DELTA_SOURCES = [
  {
    id: "usgs-coastal-louisiana-land-loss-2024",
    claimIds: ["scene-1-regional-land-loss"],
    authority: "U.S. Geological Survey",
    title:
      "USGS scientists find new relationship between elevation change and wetland loss in Mississippi River Delta",
    citation: "U.S. Geological Survey, June 26, 2024.",
    url: "https://www.usgs.gov/news/state-news-release/usgs-scientists-find-new-relationship-between-elevation-change-and-wetland",
    supports:
      "Supports the dated, coastal-Louisiana-wide estimate of more than 2,000 square miles of land lost from 1932 to 2016 and the finding that edge erosion can coexist with elevation gain.",
    boundary:
      "This is a coastal Louisiana total, not a Mississippi Delta-only shoreline polygon. The Topic labels that scope and date range and does not apportion the loss among individual drivers.",
  },
  {
    id: "usgs-wetland-loss-processes-2010",
    claimIds: [
      "scene-1-multi-force-balance",
      "scene-2-sediment-input-limit",
      "scene-4-routing-not-sole-cause",
    ],
    authority: "U.S. Geological Survey",
    title: "Sea-Level Rise, Subsidence, and Wetland Loss",
    citation: "U.S. Geological Survey Ecosystems Mission Area, August 31, 2010.",
    url: "https://www.usgs.gov/media/videos/sea-level-rise-subsidence-and-wetland-loss",
    supports:
      "Supports the Mississippi River Delta framing that compaction and dewatering, reduced sediment delivery after leveeing, canals, hurricanes, and sea-level rise combine in wetland loss.",
    boundary:
      "This is a process overview, not a time-specific attribution model. It does not quantify every contributor or predict the result of a single restoration project.",
  },
  {
    id: "cpra-deep-subsidence-2023",
    claimIds: [
      "scene-1-multi-force-balance",
      "scene-3-spatial-subsidence",
      "scene-4-routing-not-sole-cause",
    ],
    authority: "Louisiana Coastal Protection and Restoration Authority",
    title: "2023 Coastal Master Plan Data Access Portal — Deep Subsidence",
    citation: "Louisiana CPRA, 2023 Coastal Master Plan Data Access Portal.",
    url: "https://mpdap.coastal.la.gov/dataset/deep-subsidence",
    supports:
      "Supports keeping deep subsidence, spatially variable shallow subsidence, mineral deposition, and organic accretion as separate coastal-Louisiana model components.",
    boundary:
      "The portal is a planning dataset rather than a direct measurement of every Mississippi Delta marsh. This Topic therefore shows no single observed subsidence rate.",
  },
  {
    id: "nature-holocene-compaction-2008",
    claimIds: [
      "scene-1-multi-force-balance",
      "scene-3-spatial-subsidence",
    ],
    authority: "Nature Geoscience",
    title: "Mississippi Delta subsidence primarily caused by compaction of Holocene strata",
    citation: "Törnqvist et al., Nature Geoscience 1, 173–176, 2008.",
    url: "https://www.nature.com/articles/ngeo129",
    supports:
      "Supports the claim that compaction of Holocene strata contributes substantially to relative sea-level rise and wetland loss in the Mississippi Delta, with rates dependent on place and timescale.",
    boundary:
      "The core-based result is not a uniform present-day rate across the delta. The cross-section is an original teaching diagram, not a measured local stratigraphic profile.",
  },
  {
    id: "cpra-adaptive-coastal-plan",
    claimIds: [
      "scene-2-sediment-input-limit",
      "scene-5-adaptive-restoration-portfolio",
    ],
    authority: "Louisiana Coastal Protection and Restoration Authority",
    title: "Our Plan — Louisiana's Coastal Master Plan",
    citation: "Louisiana CPRA, Our Plan, accessed July 10, 2026.",
    url: "https://coastal.la.gov/our-plan/",
    supports:
      "Supports treating coastal restoration as an adaptive systems portfolio: coordinating project synergies, acknowledging limited sediment supply and access, and considering natural-process and dredging options as conditions change.",
    boundary:
      "This statewide planning page describes principles and strategy families, not the current status, viability, funding, permitting, construction, or outcome of any named project.",
  },
] as const satisfies readonly SinkingDeltaSource[];

const COPY: Record<SceneId, Record<Language, SceneCopy>> = {
  1: {
    en: {
      kicker: "MISSISSIPPI DELTA / LAND–WATER LEDGER",
      headline: "THE DELTA IS LOSING GROUND",
      deck: "A land-forming river meets a changing balance sheet.",
      beats: [
        {
          action: "Cut water channels through an original delta block map.",
          title: "Land and water share the same page",
          body: "This is an abstract Mississippi Delta teaching map, not a shoreline survey.",
        },
        {
          action: "Pin the dated coastal-Louisiana land-loss card.",
          title: "A dated regional loss",
          body: "Coastal Louisiana lost more than 2,000 square miles from 1932 to 2016. [S1]",
        },
        {
          action: "Add sediment as a land-building input.",
          title: "Sediment still builds where it arrives",
          body: "Delivery can raise a wetland surface, but delivery is not the whole balance. [S2]",
        },
        {
          action: "Expose the multi-force ledger.",
          title: "No one arrow explains the map",
          body: "Compaction, sea level, erosion, flow routing, and sediment deposition act together. [S2–S4]",
        },
      ],
    },
    zh: {
      kicker: "密西西比河三角洲 / 陆地—水域账本",
      headline: "三角洲正在失去地面",
      deck: "能造陆的河流，也面对一张不断变化的收支表。",
      beats: [
        {
          action: "让水道切开原创三角洲块状地图。",
          title: "陆地与水域共用一页",
          body: "这是密西西比河三角洲的教学抽象图，不是岸线测绘图。",
        },
        {
          action: "钉上带年份和区域的失地卡。",
          title: "带日期的区域失地",
          body: "沿海路易斯安那州在 1932—2016 年失去超过 2,000 平方英里土地。[S1]",
        },
        {
          action: "把泥沙加入造陆输入。",
          title: "泥沙在抵达处仍能造陆",
          body: "输送能抬高湿地表面，但输送不是全部收支。[S2]",
        },
        {
          action: "露出多力收支表。",
          title: "没有一支箭能解释整张地图",
          body: "压实、海平面、侵蚀、流路与泥沙沉积共同作用。[S2–S4]",
        },
      ],
    },
  },
  2: {
    en: {
      kicker: "SEDIMENT / ONE INPUT",
      headline: "A RIVER CAN BUILD LAND",
      deck: "A distributary moves sediment; deposition depends on where material can reach and remain.",
      beats: [
        {
          action: "Push an original sediment wedge into the river mouth.",
          title: "Sediment is an input, not a promise",
          body: "Where sediment reaches and remains, it can support wetland elevation; limited supply and access constrain what restoration can do. [S2, S5]",
        },
      ],
    },
    zh: {
      kicker: "泥沙 / 一项输入",
      headline: "河流能够造陆",
      deck: "分汊输送泥沙；能否沉积，取决于物质能否抵达并留存。",
      beats: [
        {
          action: "把原创泥沙楔推入河口。",
          title: "泥沙是输入，不是承诺",
          body: "泥沙抵达并留存的地方，可支持湿地高程；有限的泥沙供给与可达性约束修复能力。[S2, S5]",
        },
      ],
    },
  },
  3: {
    en: {
      kicker: "SECTION / ELEVATION BALANCE",
      headline: "THE SURFACE CAN MOVE BOTH WAYS",
      deck: "Deposits may build upward while layers compact below; sea level remains an independent baseline.",
      beats: [
        {
          action: "Lay a sediment section beneath the wetland surface.",
          title: "Elevation is a balance",
          body: "Vertical change combines processes above and below the marsh surface. [S3]",
        },
        {
          action: "Drop the compacting strata while holding the water baseline apart.",
          title: "Place and strata change the rate",
          body: "No single subsidence rate describes the Mississippi Delta. [S3, S4]",
        },
      ],
    },
    zh: {
      kicker: "剖面 / 高程收支",
      headline: "地表可以双向移动",
      deck: "沉积物能向上堆积，下面的层位也会压实；海平面是独立基线。",
      beats: [
        {
          action: "在湿地表面下铺开沉积剖面。",
          title: "高程是一张收支表",
          body: "垂直变化结合了湿地表面上下的过程。[S3]",
        },
        {
          action: "让压实层位下移，同时分开水位基线。",
          title: "地点与层位改变速率",
          body: "没有单一沉降率能描述整个密西西比河三角洲。[S3, S4]",
        },
      ],
    },
  },
  4: {
    en: {
      kicker: "ROUTING / NOT A SINGLE CAUSE",
      headline: "WHERE SEDIMENT CAN REACH",
      deck: "Levees, channels, wetland edges, and water levels rearrange the route between river and marsh.",
      beats: [
        {
          action: "Split the river channel from the adjacent wetland blocks.",
          title: "Routing changes delivery",
          body: "Levees can reduce overbank sediment delivery while channels, erosion, storms, and water levels alter the setting. [S2]",
        },
        {
          action: "Lock the force ledger into a multi-cause read.",
          title: "Do not make one block the villain",
          body: "The route is a condition inside a coupled land–water system—not a sole cause. [S2, S3]",
        },
      ],
    },
    zh: {
      kicker: "流路 / 不止一个原因",
      headline: "泥沙能抵达哪里",
      deck: "堤坝、渠道、湿地边缘与水位重排了河流到沼泽之间的路径。",
      beats: [
        {
          action: "把主河道与相邻湿地块分开。",
          title: "流路改变输送",
          body: "堤坝会减少漫滩泥沙；渠道、侵蚀、风暴和水位也改变环境。[S2]",
        },
        {
          action: "把力量账本固定为多因读法。",
          title: "不要把一块当成反派",
          body: "流路只是耦合陆地—水域系统中的一个条件，不是唯一原因。[S2, S3]",
        },
      ],
    },
  },
  5: {
    en: {
      kicker: "RESTORATION / MOSAIC, NOT SWITCH",
      headline: "RESTORATION IS NOT A SWITCH",
      deck: "Combine reconnection, sediment placement, edge protection, and measurement; the mix must adapt as conditions change.",
      beats: [
        {
          action: "Settle an original restoration mosaic beside its limits.",
          title: "A working mosaic",
          body: "Restoration works as an adaptive system of natural-process and dredging options; limited sediment and changing conditions constrain every choice. [S5]",
        },
      ],
    },
    zh: {
      kicker: "修复 / 镶嵌，而非开关",
      headline: "修复不是一个开关",
      deck: "组合重新连通、泥沙放置、边缘保护与持续测量；条件变化时，策略组合也要调整。",
      beats: [
        {
          action: "把原创修复镶嵌与限制一同静置。",
          title: "一组协作的镶嵌",
          body: "修复是由自然过程与疏浚方案组成的适应性系统；泥沙有限且条件会变化，每种选择都受约束。[S5]",
        },
      ],
    },
  },
};

export const SINKING_DELTA_VISIBLE_CLAIMS = {
  "scene-1-regional-land-loss": {
    scene: 1,
    beat: 1,
    sourceIds: ["usgs-coastal-louisiana-land-loss-2024"],
    visibleLabels: {
      en: [
        "COASTAL LOUISIANA / HISTORIC LAND CHANGE",
        "1932—2016",
        ">2,000 SQ MI",
        "NOT A MISSISSIPPI DELTA-ONLY TOTAL · [S1]",
      ],
      zh: [
        "沿海路易斯安那州 / 历史陆地变化",
        "1932—2016",
        ">2,000 平方英里",
        "不是密西西比河三角洲单一区域总量 · [S1]",
      ],
    },
  },
  "scene-1-multi-force-balance": {
    scene: 1,
    beat: 3,
    sourceIds: [
      "usgs-wetland-loss-processes-2010",
      "cpra-deep-subsidence-2023",
      "nature-holocene-compaction-2008",
    ],
    visibleLabels: {
      en: [
        "NOT ONE CAUSE",
        "COMPACTION · SEA LEVEL · EROSION · ROUTING · DEPOSITION [S2–S4]",
      ],
      zh: [
        "不止一个原因",
        "压实 · 海平面 · 侵蚀 · 流路 · 沉积 [S2–S4]",
      ],
    },
  },
  "scene-2-sediment-input-limit": {
    scene: 2,
    beat: 0,
    sourceIds: [
      "usgs-wetland-loss-processes-2010",
      "cpra-adaptive-coastal-plan",
    ],
    visibleLabels: {
      en: [
        "A distributary moves sediment; deposition depends on where material can reach and remain.",
        "INPUT ≠ GUARANTEE",
      ],
      zh: [
        "分汊输送泥沙；能否沉积，取决于物质能否抵达并留存。",
        "输入 ≠ 保证",
      ],
    },
  },
  "scene-3-spatial-subsidence": {
    scene: 3,
    beat: 1,
    sourceIds: [
      "cpra-deep-subsidence-2023",
      "nature-holocene-compaction-2008",
    ],
    visibleLabels: {
      en: [
        "PLACE + STRATA CHANGE THE RATE",
        "NOT ONE RATE · NOT ONE PROFILE · [S3, S4]",
      ],
      zh: [
        "地点 + 地层改变速率",
        "不是单一速率 · 不是单一剖面 · [S3, S4]",
      ],
    },
  },
  "scene-4-routing-not-sole-cause": {
    scene: 4,
    beat: 1,
    sourceIds: [
      "usgs-wetland-loss-processes-2010",
      "cpra-deep-subsidence-2023",
    ],
    visibleLabels: {
      en: [
        "NOT ONE CAUSE",
        "ONE ROUTE INSIDE A COUPLED LAND–WATER SYSTEM · [S2, S3]",
      ],
      zh: [
        "不止一个原因",
        "耦合陆地—水域系统中的一条流路 · [S2, S3]",
      ],
    },
  },
  "scene-5-adaptive-restoration-portfolio": {
    scene: 5,
    beat: 0,
    sourceIds: ["cpra-adaptive-coastal-plan"],
    visibleLabels: {
      en: [
        "Combine reconnection, sediment placement, edge protection, and measurement; the mix must adapt as conditions change.",
        "LIMITED SEDIMENT · SYSTEM FIT · CHANGE OVER TIME",
        "STRATEGY FAMILY ≠ ACTIVE PROJECT · NO GUARANTEED PERMANENT LAND [S5]",
      ],
      zh: [
        "组合重新连通、泥沙放置、边缘保护与持续测量；条件变化时，策略组合也要调整。",
        "泥沙有限 · 系统适配 · 随时间调整",
        "策略类型 ≠ 在建项目 · 不保证永久陆地 [S5]",
      ],
    },
  },
} as const satisfies Readonly<
  Record<SinkingDeltaClaimId, SinkingDeltaVisibleClaim>
>;

const NAV_LABELS: Record<Language, readonly string[]> = {
  en: [
    "Loss ledger",
    "Sediment wedge",
    "Compaction section",
    "Routed sediment",
    "Restoration mosaic",
  ],
  zh: ["失地账本", "泥沙楔", "压实剖面", "泥沙流路", "修复镶嵌"],
};

function clampScene(scene: number): SceneId {
  if (scene <= 1) return 1;
  if (scene >= 5) return 5;
  return scene as SceneId;
}

function clampBeat(scene: SceneId, beat: number): number {
  return Math.min(Math.max(beat, 0), COPY[scene].en.beats.length - 1);
}

function revealClass(show: boolean) {
  return show ? styles.revealVisible : styles.revealReserved;
}

function SceneHeader({
  scene,
  copy,
  language,
}: {
  scene: SceneId;
  copy: SceneCopy;
  language: Language;
}) {
  return (
    <header className={styles.sceneHeader} data-beat-layout-item="true">
      <span className={styles.sceneIndex}>0{scene}</span>
      <span className={styles.kicker}>{copy.kicker}</span>
      <span className={styles.sourceKey}>
        {language === "zh" ? "密西西比河三角洲" : "MISSISSIPPI DELTA"}
      </span>
    </header>
  );
}

function OriginalDeltaMap({
  className,
  language,
}: {
  className?: string;
  language: Language;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 1000 600"
      role="img"
      aria-label={
        language === "zh"
          ? "原创密西西比河三角洲陆地—水域块状地图"
          : "Original abstract Mississippi Delta land and water block map"
      }
    >
      <path d="M88 66H548L674 142L586 252L744 356L650 526H138L208 418L62 320L170 216Z" />
      <path className={styles.mapWater} d="M188 100L296 170L244 264L122 236Z" />
      <path className={styles.mapWater} d="M392 70L470 152L406 274L324 218Z" />
      <path className={styles.mapWater} d="M528 132L618 184L540 304L452 250Z" />
      <path className={styles.mapWater} d="M266 302L398 354L326 478L214 426Z" />
      <path className={styles.mapWater} d="M480 314L614 398L540 522L420 446Z" />
      <path className={styles.mapRoute} d="M804 82L662 198L556 330L486 524" />
      <path className={styles.mapRoute} d="M662 198L792 292L894 444" />
      <path className={styles.mapRoute} d="M556 330L742 404L856 548" />
    </svg>
  );
}

function SceneOne({
  beat,
  copy,
  language,
}: {
  beat: number;
  copy: SceneCopy;
  language: Language;
}) {
  const isZh = language === "zh";

  return (
    <div className={styles.sceneOneLayout}>
      <section className={styles.lossMapCard} data-beat-layout-item="true">
        <div className={styles.mapMeta}>
          <span>{isZh ? "原创块状制图" : "ORIGINAL BLOCKY CARTOGRAPHY"}</span>
          <span>{isZh ? "教学地图 · 不是测绘图" : "TEACHING MAP · NOT A SURVEY"}</span>
        </div>
        <OriginalDeltaMap className={styles.lossMap} language={language} />
        <h1>{copy.headline}</h1>
        <p>{copy.deck}</p>
      </section>

      <aside
        className={[styles.lossFact, revealClass(beat >= 1)].join(" ")}
        data-beat-layout-item="true"
      >
        <span>
          {isZh
            ? "沿海路易斯安那州 / 历史陆地变化"
            : "COASTAL LOUISIANA / HISTORIC LAND CHANGE"}
        </span>
        <strong>1932—2016</strong>
        <b>{isZh ? ">2,000 平方英里" : ">2,000 SQ MI"}</b>
        <p>
          {isZh
            ? "不是密西西比河三角洲单一区域总量 · [S1]"
            : "NOT A MISSISSIPPI DELTA-ONLY TOTAL · [S1]"}
        </p>
      </aside>

      <aside
        className={[styles.sedimentNote, revealClass(beat >= 2)].join(" ")}
        data-beat-layout-item="true"
      >
        <span>{isZh ? "泥沙" : "SEDIMENT"}</span>
        <p>
          {isZh
            ? "造陆输入 · 不是保证 [S2]"
            : "LAND-BUILDING INPUT · NOT A GUARANTEE [S2]"}
        </p>
      </aside>

      <aside
        className={[styles.ledgerNote, revealClass(beat >= 3)].join(" ")}
        data-beat-layout-item="true"
      >
        <strong>{isZh ? "不止一个原因" : "NOT ONE CAUSE"}</strong>
        <span>
          {isZh
            ? "压实 · 海平面 · 侵蚀 · 流路 · 沉积 [S2–S4]"
            : "COMPACTION · SEA LEVEL · EROSION · ROUTING · DEPOSITION [S2–S4]"}
        </span>
      </aside>
    </div>
  );
}

function SedimentWedge({ language }: { language: Language }) {
  return (
    <svg
      className={styles.wedgeGraphic}
      viewBox="0 0 1100 520"
      role="img"
      aria-label={
        language === "zh"
          ? "原创分汊泥沙楔体图"
          : "Original sediment wedge flowing through a distributary"
      }
    >
      <path className={styles.wedgeRiver} d="M0 214H458L602 154L776 210L1100 88V264L834 330L616 280L456 342H0Z" />
      <path className={styles.wedgeSediment} d="M452 278L694 142L956 388L706 420Z" />
      <path className={styles.wedgeLine} d="M90 278H472L694 142L956 388" />
      <path className={styles.wedgeLine} d="M470 278L706 420L1030 452" />
      <path className={styles.wedgeLine} d="M598 154L616 280L834 330" />
    </svg>
  );
}

function SceneTwo({ copy, language }: { copy: SceneCopy; language: Language }) {
  const isZh = language === "zh";

  return (
    <div className={styles.sceneTwoLayout}>
      <section className={styles.wedgePanel} data-beat-layout-item="true">
        <SedimentWedge language={language} />
        <div className={styles.wedgeLabels}>
          <span>{isZh ? "河流携带泥沙" : "RIVER-BORNE SEDIMENT"}</span>
          <span>{isZh ? "沉积楔体" : "DEPOSITION WEDGE"}</span>
          <span>{isZh ? "开阔水域" : "OPEN WATER"}</span>
        </div>
      </section>
      <section className={styles.sedimentLead} data-beat-layout-item="true">
        <h1>{copy.headline}</h1>
        <p>{copy.deck}</p>
        <div className={styles.inputStamp}>
          {isZh ? "输入 ≠ 保证" : "INPUT ≠ GUARANTEE"}
        </div>
        <small>
          {isZh
            ? "密西西比河三角洲 · 原创示意图 · [S2, S5]"
            : "MISSISSIPPI DELTA · ORIGINAL DIAGRAM · [S2, S5]"}
        </small>
      </section>
    </div>
  );
}

function CrossSection({
  compacted,
  motionOff,
  language,
}: {
  compacted: boolean;
  motionOff: boolean;
  language: Language;
}) {
  const isZh = language === "zh";

  return (
    <div
      className={styles.crossSection}
      data-cross-section={motionOff ? "settled" : "live"}
    >
      <div className={styles.waterBaseline}>
        <span>{isZh ? "海平面 / 独立基线" : "SEA LEVEL / INDEPENDENT BASELINE"}</span>
      </div>
      <div className={styles.marshSurface}>
        <span>{isZh ? "湿地表面" : "WETLAND SURFACE"}</span>
      </div>
      <div className={styles.accretionLayer}>
        <span>{isZh ? "矿物质 + 有机物累积" : "MINERAL + ORGANIC ACCRETION"}</span>
      </div>
      <div
        className={[styles.compactionStack, compacted ? styles.compactionOn : ""]
          .filter(Boolean)
          .join(" ")}
      >
        <i />
        <i />
        <i />
        <span>{isZh ? "压实 / 脱水" : "COMPACTION / DEWATERING"}</span>
      </div>
      <div className={styles.subsurfaceLayer}>
        {isZh ? "三角洲地层" : "DELTAIC STRATA"}
      </div>
      <div className={styles.downArrow} aria-hidden="true">↓</div>
    </div>
  );
}

function SceneThree({
  beat,
  copy,
  motionOff,
  language,
}: {
  beat: number;
  copy: SceneCopy;
  motionOff: boolean;
  language: Language;
}) {
  const isZh = language === "zh";

  return (
    <div className={styles.sceneThreeLayout}>
      <section className={styles.sectionLead} data-beat-layout-item="true">
        <h1>{copy.headline}</h1>
        <p>{copy.deck}</p>
        <span>
          {isZh
            ? "密西西比河三角洲 / 原创剖面 [S3, S4]"
            : "MISSISSIPPI DELTA / ORIGINAL SECTION [S3, S4]"}
        </span>
      </section>
      <section className={styles.sectionDiagram} data-beat-layout-item="true">
        <CrossSection
          compacted={beat >= 1}
          motionOff={motionOff}
          language={language}
        />
      </section>
      <aside
        className={[styles.rateBoundary, revealClass(beat >= 1)].join(" ")}
        data-beat-layout-item="true"
      >
        <strong>{isZh ? "地点 + 地层改变速率" : "PLACE + STRATA CHANGE THE RATE"}</strong>
        <span>
          {isZh
            ? "不是单一速率 · 不是单一剖面 · [S3, S4]"
            : "NOT ONE RATE · NOT ONE PROFILE · [S3, S4]"}
        </span>
      </aside>
    </div>
  );
}

function RoutingDiagram({ language }: { language: Language }) {
  return (
    <svg
      className={styles.routingDiagram}
      viewBox="0 0 1080 560"
      role="img"
      aria-label={
        language === "zh"
          ? "原创堤坝与分汊流路图"
          : "Original levee and distributary routing diagram"
      }
    >
      <path className={styles.routeWetland} d="M48 112H1030V474H48Z" />
      <path className={styles.routeRiver} d="M90 42L340 162L486 270L646 392L996 522L860 566L566 446L394 330L232 236L42 142Z" />
      <path className={styles.routeLevee} d="M86 86L360 222L482 324L646 434L988 552" />
      <path className={styles.routeLevee} d="M110 16L420 176L552 276L710 372L1044 490" />
      <path className={styles.routeBranch} d="M472 276L322 422L162 504" />
      <path className={styles.routeBranch} d="M552 332L580 502" />
      <path className={styles.routeBranch} d="M636 388L826 260L1026 170" />
      <circle className={styles.routeNode} cx="472" cy="276" r="22" />
      <circle className={styles.routeNode} cx="636" cy="388" r="22" />
    </svg>
  );
}

function SceneFour({
  beat,
  copy,
  language,
}: {
  beat: number;
  copy: SceneCopy;
  language: Language;
}) {
  const isZh = language === "zh";

  return (
    <div className={styles.sceneFourLayout}>
      <section className={styles.routeLead} data-beat-layout-item="true">
        <h1>{copy.headline}</h1>
        <p>{copy.deck}</p>
        <span>
          {isZh
            ? "密西西比河三角洲 / 流路拓扑 [S2]"
            : "MISSISSIPPI DELTA / ROUTING TOPOLOGY [S2]"}
        </span>
      </section>
      <section className={styles.routePanel} data-beat-layout-item="true">
        <RoutingDiagram language={language} />
        <div className={styles.routeLabels}>
          <span>{isZh ? "主河道" : "MAIN CHANNEL"}</span>
          <span>{isZh ? "有堤边缘" : "LEVEED EDGE"}</span>
          <span>{isZh ? "湿地块" : "WETLAND BLOCKS"}</span>
        </div>
      </section>
      <aside className={styles.forceLedger} data-beat-layout-item="true">
        <div>
          <b>{isZh ? "堤坝" : "LEVEES"}</b>
          <span>{isZh ? "漫滩输送改变" : "OVERBANK DELIVERY CHANGES"}</span>
        </div>
        <div>
          <b>{isZh ? "侵蚀" : "EROSION"}</b>
          <span>{isZh ? "边缘流失能重新搬运泥沙" : "EDGE LOSS CAN REWORK SEDIMENT"}</span>
        </div>
        <div>
          <b>{isZh ? "水位" : "WATER LEVEL"}</b>
          <span>{isZh ? "相对位置改变淹水" : "RELATIVE POSITION CHANGES FLOODING"}</span>
        </div>
        <div>
          <b>{isZh ? "压实" : "COMPACTION"}</b>
          <span>{isZh ? "地下过程持续" : "SUBSURFACE PROCESSES CONTINUE"}</span>
        </div>
      </aside>
      <aside
        className={[styles.causeBoundary, revealClass(beat >= 1)].join(" ")}
        data-beat-layout-item="true"
      >
        <strong>{isZh ? "不止一个原因" : "NOT ONE CAUSE"}</strong>
        <span>
          {isZh
            ? "耦合陆地—水域系统中的一条流路 · [S2, S3]"
            : "ONE ROUTE INSIDE A COUPLED LAND–WATER SYSTEM · [S2, S3]"}
        </span>
      </aside>
    </div>
  );
}

const MOSAIC_LABELS: Record<Language, readonly string[]> = {
  en: [
    "ROUTE SEDIMENT",
    "BUILD MARSH",
    "PROTECT EDGES",
    "OBSERVE CHANGE",
    "KEEP LIMITS VISIBLE",
  ],
  zh: ["输送泥沙", "营造沼泽", "保护边缘", "观察变化", "保持限制可见"],
};

function SceneFive({ copy, language }: { copy: SceneCopy; language: Language }) {
  const isZh = language === "zh";

  return (
    <div className={styles.sceneFiveLayout}>
      <section className={styles.mosaicLead} data-beat-layout-item="true">
        <h1>{copy.headline}</h1>
        <p>{copy.deck}</p>
        <small>
          {isZh
            ? "密西西比河三角洲 / 原创修复镶嵌 [S5]"
            : "MISSISSIPPI DELTA / ORIGINAL RESTORATION MOSAIC [S5]"}
        </small>
      </section>
      <section className={styles.mosaicGrid} data-beat-layout-item="true">
        {MOSAIC_LABELS[language].map((label, index) => (
          <article
            key={label}
            className={styles.mosaicTile}
            data-tone={index === 0 ? "accent" : "paper"}
          >
            <span>0{index + 1}</span>
            <b>{label}</b>
          </article>
        ))}
      </section>
      <aside className={styles.limitStrip} data-beat-layout-item="true">
        <strong>
          {isZh
            ? "泥沙有限 · 系统适配 · 随时间调整"
            : "LIMITED SEDIMENT · SYSTEM FIT · CHANGE OVER TIME"}
        </strong>
        <span>
          {isZh
            ? "策略类型 ≠ 在建项目 · 不保证永久陆地 [S5]"
            : "STRATEGY FAMILY ≠ ACTIVE PROJECT · NO GUARANTEED PERMANENT LAND [S5]"}
        </span>
      </aside>
    </div>
  );
}

function ScenePanel({
  scene,
  beat,
  language,
  motionOff,
}: {
  scene: SceneId;
  beat: number;
  language: Language;
  motionOff: boolean;
}) {
  const safeBeat = clampBeat(scene, beat);
  const copy = COPY[scene][language];

  return (
    <section
      className={[styles.scene, styles[`scene${scene}` as keyof typeof styles]]
        .filter(Boolean)
        .join(" ")}
      data-scene={scene}
      data-beat={safeBeat}
      data-beat-layout-container="true"
      data-beat-layout-mode="reserved"
    >
      <SceneHeader scene={scene} copy={copy} language={language} />
      {scene === 1 && <SceneOne beat={safeBeat} copy={copy} language={language} />}
      {scene === 2 && <SceneTwo copy={copy} language={language} />}
      {scene === 3 && (
        <SceneThree
          beat={safeBeat}
          copy={copy}
          motionOff={motionOff}
          language={language}
        />
      )}
      {scene === 4 && <SceneFour beat={safeBeat} copy={copy} language={language} />}
      {scene === 5 && <SceneFive copy={copy} language={language} />}
    </section>
  );
}

function DeltaDistributaryNavigation({
  scene,
  language,
  onNavigate,
}: {
  scene: SceneId;
  language: Language;
  onNavigate?: (scene: number, beat: number) => void;
}) {
  const draggingRef = useRef(false);
  const lastScrubSceneRef = useRef<SceneId>(scene);

  if (!draggingRef.current) {
    lastScrubSceneRef.current = scene;
  }

  const navigate = (next: number) => {
    const target = clampScene(next);
    lastScrubSceneRef.current = target;
    onNavigate?.(target, 0);
  };

  const isolate = (event: { preventDefault: () => void; stopPropagation: () => void }) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const isolateTouch = (event: TouchEvent<HTMLElement>) => {
    event.stopPropagation();
  };

  const scrub = (clientX: number, element: HTMLDivElement) => {
    const bounds = element.getBoundingClientRect();
    if (bounds.width <= 0) return;
    const progress = Math.min(Math.max((clientX - bounds.left) / bounds.width, 0), 1);
    const target = clampScene(Math.round(progress * 4) + 1);
    if (target !== lastScrubSceneRef.current) navigate(target);
  };

  const handleNodeKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    current: SceneId,
  ) => {
    if (event.repeat) {
      isolate(event);
      return;
    }

    let target: number | null = null;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") target = current + 1;
    if (event.key === "ArrowLeft" || event.key === "ArrowUp") target = current - 1;
    if (event.key === "Home") target = 1;
    if (event.key === "End") target = 5;
    if (event.key === " " || event.key === "Enter") target = current;
    if (target === null) return;

    isolate(event);
    navigate(target);
  };

  const handleContainerKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.target !== event.currentTarget) return;
    if (event.repeat) {
      isolate(event);
      return;
    }

    let target: number | null = null;
    if (
      event.key === "ArrowRight" ||
      event.key === "ArrowDown" ||
      event.key === " " ||
      event.key === "Enter"
    ) {
      target = scene === 5 ? 1 : scene + 1;
    }
    if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      target = scene === 1 ? 5 : scene - 1;
    }
    if (event.key === "Home") target = 1;
    if (event.key === "End") target = 5;
    if (target === null) return;

    isolate(event);
    navigate(target);
  };

  const shouldIgnoreSurfaceTarget = (target: EventTarget | null) =>
    target instanceof Element && Boolean(target.closest("button"));

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (shouldIgnoreSurfaceTarget(event.target)) return;
    event.stopPropagation();
    draggingRef.current = true;
    event.currentTarget.setPointerCapture?.(event.pointerId);
    scrub(event.clientX, event.currentTarget);
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    event.stopPropagation();
    scrub(event.clientX, event.currentTarget);
  };

  const handlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    event.stopPropagation();
    scrub(event.clientX, event.currentTarget);
    draggingRef.current = false;
    event.currentTarget.releasePointerCapture?.(event.pointerId);
  };

  return (
    <nav
      className={styles.navigation}
      aria-label={language === "zh" ? "三角洲分汊块导航" : "Delta distributary block navigation"}
      data-topic-navigation="true"
      data-navigation-geometry="spatial-node"
      data-navigation-carrier="delta-distributary-blocks"
      data-navigation-invocation="drag-scrub"
      data-navigation-feedback="mechanical-displacement"
      tabIndex={0}
      onKeyDown={handleContainerKeyDown}
      onTouchStartCapture={isolateTouch}
      onTouchMoveCapture={isolateTouch}
      onTouchEndCapture={isolateTouch}
      onTouchCancelCapture={isolateTouch}
      onPointerDown={(event) => event.stopPropagation()}
      onClick={(event) => event.stopPropagation()}
    >
      <div
        className={styles.scrubSurface}
        data-navigation-scrub-surface="true"
        onPointerDownCapture={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={(event) => {
          event.stopPropagation();
          draggingRef.current = false;
        }}
      >
        <span className={styles.navBranch} aria-hidden="true" />
        {SCENE_IDS.map((sceneId) => {
          const active = sceneId === scene;
          const label = NAV_LABELS[language][sceneId - 1];
          return (
            <button
              key={sceneId}
              type="button"
              className={styles.navBlock}
              data-active={active ? "true" : "false"}
              aria-current={active ? "step" : undefined}
              aria-label={`${language === "zh" ? "场景" : "Scene"} ${sceneId} · ${label}`}
              style={{ "--node-index": sceneId } as CSSProperties}
              onPointerDown={(event) => event.stopPropagation()}
              onClick={(event) => {
                event.stopPropagation();
                navigate(sceneId);
              }}
              onKeyDown={(event) => handleNodeKeyDown(event, sceneId)}
            >
              <i>0{sceneId}</i>
              <span>{label}</span>
            </button>
          );
        })}
      </div>
      <p>{language === "zh" ? "拖动分汊块 / 点击节点 / 键盘" : "DRAG BLOCKS / TAP NODE / KEYBOARD"}</p>
    </nav>
  );
}

export function getMetadata(language: Language): StyleMetadata {
  return {
    id: "neo-brutalist-bulletin",
    band: "craft-cultural",
    name: language === "zh" ? "新粗野主义公告" : "Neo-Brutalist Bulletin",
    theme:
      language === "zh"
        ? "下沉三角洲：密西西比河三角洲"
        : "Sinking Delta: Mississippi Delta",
    densityLabel:
      language === "zh" ? "视觉叙事 · 强度 3" : "Visual narrative · intensity 3",
    heroScene: 1,
    colors: {
      bg: "#f5eedb",
      ink: "#171510",
      panel: "#ffd429",
    },
    typography: {
      header: "Impact / Noto Sans SC 900",
      body: "Arial Narrow / PingFang SC 600",
    },
    tags: [
      "neo-brutalist",
      "bulletin",
      "sinking-delta",
      "mississippi-delta",
      "blocky-cartography",
      "wetland-balance",
      "spatial-navigation",
      "bilingual",
    ],
    fonts: ["Impact", "Arial Narrow", "cjk:PingFang SC", "cjk:Noto Sans SC"],
    scenes: SCENE_IDS.map((sceneId) => {
      const copy = COPY[sceneId][language];
      return {
        id: sceneId,
        title: copy.headline,
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

export default function SinkingDelta({
  scene,
  beat,
  language,
  isThumbnail,
  reducedMotion,
  onNavigate,
}: BespokeStyleProps) {
  const safeScene = clampScene(scene);
  const safeBeat = clampBeat(safeScene, beat);
  const motionOff = reducedMotion || isThumbnail;

  return (
    <main
      className={styles.root}
      lang={language === "zh" ? "zh-CN" : "en"}
      data-style-id="neo-brutalist-bulletin"
      data-topic-id="sinking-delta"
      data-motion={motionOff ? "off" : "on"}
      data-frozen={motionOff ? "true" : "false"}
    >
      <SpatialSceneTrack
        scene={safeScene}
        beat={safeBeat}
        transitionKind="hard-cut"
        transitionMap={TRANSITION_MAP}
        transitionDurationMs={600}
        reducedMotion={motionOff}
        beatLayoutModes={BEAT_LAYOUT_MODES}
        className={styles.track}
        renderScene={(sceneId, sceneBeat) => (
          <ScenePanel
            scene={clampScene(sceneId)}
            beat={sceneBeat}
            language={language}
            motionOff={motionOff}
          />
        )}
      />
      {!isThumbnail && (
        <DeltaDistributaryNavigation
          scene={safeScene}
          language={language}
          onNavigate={onNavigate}
        />
      )}
    </main>
  );
}

export const sinkingDeltaTopic = defineStyleTopic({
  id: "sinking-delta",
  topic: {
    en: "Sinking Delta",
    zh: "下沉三角洲",
  },
  model: "GPT 5.6 Sol",
  component: SinkingDelta,
  getMetadata,
  navigation: {
    geometry: "spatial-node",
    carrier: "delta-distributary-blocks",
    invocation: "drag-scrub",
    feedback: "mechanical-displacement",
  },
  sources: SINKING_DELTA_SOURCES,
  transitionScore: SINKING_DELTA_TRANSITION_SCORE,
});

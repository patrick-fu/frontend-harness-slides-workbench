import { useEffect, useState } from "react";
import type {
  BespokeStyleProps,
  StyleMetadata,
  TopicNavigationProfile,
  TopicSource,
  TopicTransitionScore,
} from "../types";
import SpatialSceneTrack from "./SpatialSceneTrack";
import type { BeatLayoutMode } from "./SpatialSceneTrack";
import { defineStyleTopic } from "./topic";
import styles from "./expedition-screenprint-saharan-dust.module.css";

type Lang = BespokeStyleProps["language"];
type SceneId = 1 | 2 | 3 | 4 | 5;

interface BeatCopy {
  action: string;
  title: string;
  body: string;
}

interface SceneCopy {
  folio: string;
  navLabel: string;
  title: string;
  subtitle: string;
  evidence: string;
  boundary: string;
  stamp: string;
  beats: BeatCopy[];
}

const SCENE_IDS: SceneId[] = [1, 2, 3, 4, 5];

export const SAHARAN_DUST_TRANSITION_SCORE = {
  "1->2": "diagonal-pan",
  "2->3": "ink-spread",
  "3->4": "push-x",
  "4->5": "ink-spread",
} as const satisfies TopicTransitionScore;

export const SAHARAN_DUST_NAVIGATION = {
  geometry: "path",
  carrier: "dust-arc",
  invocation: "click-expand",
  feedback: "material-color-change",
} as const satisfies TopicNavigationProfile;

const BEAT_LAYOUT_MODES = {
  2: "reserved",
  3: "reserved",
  4: "reserved",
} satisfies Partial<Record<number, BeatLayoutMode>>;

export const SAHARAN_DUST_SOURCES = [
  {
    authority: "NASA Earth Observatory",
    title: "Dust in the Bodélé Depression",
    citation: "MODIS observation note, 2004",
    url: "https://earthobservatory.nasa.gov/images/4452/dust-in-the-bodele-depression",
    supports:
      "The Bodélé Depression in northern Chad is one highly active wind-blown dust source, where terrain channels winds across loose lake-bed material.",
  },
  {
    authority: "NASA",
    title: "NASA Satellite Reveals How Much Saharan Dust Feeds Amazon’s Plants",
    citation: "CALIPSO mission feature, 2015",
    url: "https://www.nasa.gov/missions/calipso/nasa-satellite-reveals-how-much-saharan-dust-feeds-amazons-plants/",
    supports:
      "CALIOP lidar returns distinguish dust by optical properties and reveal the three-dimensional trans-Atlantic aerosol pathway over multiple years.",
  },
  {
    authority: "Geophysical Research Letters",
    title: "The fertilizing role of African dust in the Amazon rainforest",
    citation: "Yu et al., 2015, doi:10.1002/2015GL063040",
    url: "https://acd-ext.gsfc.nasa.gov/People/Chin/papers/Yu_grl_2015.pdf",
    supports:
      "A seven-year CALIOP record supports African dust deposition over the Amazon and reports significant interannual variation rather than a fixed annual shipment.",
  },
  {
    authority: "NASA",
    title: "NASA, CNES Space Laser Measures Massive Saharan Dust Plume",
    citation: "CALIPSO observation feature, 2020",
    url: "https://www.nasa.gov/earth/nasa-cnes-space-laser-measures-massive-saharan-dust-plume/",
    supports:
      "Satellite observations combine vertical and horizontal views to track Saharan dust within a warm, dry air mass across the Atlantic.",
  },
  {
    authority: "Global Biogeochemical Cycles",
    title: "Characterizing and Quantifying African Dust Transport and Deposition to South America",
    citation: "Prospero et al., 2020, doi:10.1029/2020GB006536",
    url: "https://doi.org/10.1029/2020GB006536",
    supports:
      "Long-running sampling and source analysis complicate any single-source or simple-fertilizer story; source regions, trajectories, and nutrient consequences require qualification.",
  },
] as const satisfies readonly TopicSource[];

const COPY: Record<Lang, Record<SceneId, SceneCopy>> = {
  en: {
    1: {
      folio: "FIELD PLATE 01 · SOURCE",
      navLabel: "Source",
      title: "DUST BEGINS IN PLACES",
      subtitle:
        "Wind can lift fine lake-bed and soil particles from specific source regions—not from one uniform desert surface.",
      evidence: "MODIS identifies the Bodélé Depression as one active source region.",
      boundary: "Bodélé is an emblematic source, not the whole Sahara and not a claim of sole origin.",
      stamp: "SOURCE STAMP · BODÉLÉ / CHAD",
      beats: [
        {
          action: "Stamp one observed source region into a wider source field",
          title: "A source has coordinates",
          body: "Terrain, exposed sediment, and wind determine where mineral dust can enter the air.",
        },
      ],
    },
    2: {
      folio: "FIELD PLATE 02 · VERTICAL SECTION",
      navLabel: "Lift",
      title: "GROUND BECOMES A LAYER",
      subtitle:
        "Emission, uplift, and downwind transport are different steps. The section keeps particles separate from the wind field that moves them.",
      evidence: "Schematic mechanism · ground source → turbulent lift → elevated dust layer",
      boundary: "Layer height and particle density are illustrative; no measured profile is plotted here.",
      stamp: "SECTION A–A · NOT TO SCALE",
      beats: [
        {
          action: "Expose loose mineral sediment at the source",
          title: "Particles are available",
          body: "Dry, erodible material sits beneath a channeled near-surface wind.",
        },
        {
          action: "Lift a finite column of particles above the source",
          title: "Turbulence raises dust",
          body: "The plume gains height without turning the entire sky into one homogeneous cloud.",
        },
        {
          action: "Separate the elevated layer from its carrying wind",
          title: "A layer travels west",
          body: "The dust occupies an air mass; arrows describe transport, not particles themselves.",
        },
      ],
    },
    3: {
      folio: "FIELD PLATE 03 · OBSERVATION",
      navLabel: "Observe",
      title: "A LASER CUTS THE PLUME",
      subtitle:
        "CALIOP samples a narrow atmospheric curtain. Repeated profiles reveal layer height; a map then connects the sampled sections.",
      evidence: "OBSERVED · lidar return structure and aerosol optical classification",
      boundary: "SCHEMATIC · the route map is explanatory; the colored curtain is not a downloaded data product.",
      stamp: "CALIPSO GRAMMAR · REDRAWN",
      beats: [
        {
          action: "Reveal a lidar-like vertical observation curtain",
          title: "OBSERVED: a vertical slice",
          body: "Laser returns locate aerosol layers and distinguish dust by optical behavior.",
        },
        {
          action: "Place the narrow slice beside a schematic ocean route",
          title: "SCHEMATIC: slices become a pathway",
          body: "The map explains geographic continuity without pretending every point was measured at once.",
        },
      ],
    },
    4: {
      folio: "FIELD PLATE 04 · DEPOSITION",
      navLabel: "Settle",
      title: "THE PLUME DOES NOT ARRIVE WHOLE",
      subtitle:
        "Some dust settles over the Atlantic; some is washed out; a remaining fraction reaches South America and enters larger nutrient cycles.",
      evidence: "CALIPSO + field sampling support transport and deposition across the basin.",
      boundary: "Dust is one input to Amazon nutrient budgets—not a complete explanation of forest fertility.",
      stamp: "ATLANTIC TRANSECT · PEAK",
      beats: [
        {
          action: "Send an elevated plume over the Atlantic",
          title: "Cross the ocean",
          body: "A broad atmospheric path links African source regions with the western tropical Atlantic.",
        },
        {
          action: "Let dry settling and rain remove part of the layer",
          title: "Lose material en route",
          body: "Transport is also removal: gravity and precipitation thin the airborne layer.",
        },
        {
          action: "Connect a remaining fraction with Amazon deposition",
          title: "Reach a receiving ecosystem",
          body: "Deposited mineral material can carry phosphorus and other constituents into the basin.",
        },
        {
          action: "Set the deposition pathway inside a plural nutrient budget",
          title: "One contribution, not the whole budget",
          body: "Soils, weathering, rivers, fire, biology, and other atmospheric inputs remain part of the story.",
        },
      ],
    },
    5: {
      folio: "FIELD PLATE 05 · VARIATION",
      navLabel: "Vary",
      title: "SAME OCEAN. DIFFERENT YEARS.",
      subtitle:
        "The multi-year CALIOP record shows meaningful year-to-year variation in transport and deposition.",
      evidence: "Three illustrative routes show stronger, weaker, and shifted plume states.",
      boundary: "Schematic thickness only—this is not a mass scale and not a fixed annual shipment.",
      stamp: "SEASONAL MAP · NO TONNAGE",
      beats: [
        {
          action: "Compare three non-quantitative route states",
          title: "The pathway persists; its strength changes",
          body: "Weather and source conditions alter layer thickness, latitude, and how much material survives the crossing.",
        },
      ],
    },
  },
  zh: {
    1: {
      folio: "野外图版 01 · 源区",
      navLabel: "源区",
      title: "尘埃从具体地点出发",
      subtitle: "风能从特定源区扬起细小湖床与土壤颗粒，而不是从一整片均匀沙漠表面起尘。",
      evidence: "MODIS 将博德莱洼地识别为一个活跃尘源区。",
      boundary: "博德莱是代表性源区，不等于整个撒哈拉，也不宣称它是唯一来源。",
      stamp: "源区印记 · 博德莱 / 乍得",
      beats: [
        {
          action: "把一个观测到的源区盖进更大的尘源分布",
          title: "源区有坐标",
          body: "地形、裸露沉积物与风，共同决定矿物尘从哪里进入空气。",
        },
      ],
    },
    2: {
      folio: "野外图版 02 · 垂直剖面",
      navLabel: "抬升",
      title: "地面成为空气层",
      subtitle: "起尘、抬升与顺风输送是不同步骤；剖面把颗粒与携带它们的风场分开。",
      evidence: "机制示意 · 地面源区 → 湍流抬升 → 高空尘层",
      boundary: "尘层高度与颗粒密度仅作示意，此处没有绘制实测剖面。",
      stamp: "A–A 剖面 · 不按比例",
      beats: [
        {
          action: "露出源区可被侵蚀的矿物沉积物",
          title: "颗粒已经就位",
          body: "干燥、易侵蚀的物质位于受地形约束的近地风之下。",
        },
        {
          action: "把有限的颗粒柱抬离地面",
          title: "湍流抬升尘埃",
          body: "尘羽获得高度，但不会把整片天空画成均匀尘云。",
        },
        {
          action: "把高空尘层与携带它的风分开",
          title: "尘层向西移动",
          body: "尘埃位于气团之中；箭头表示输送，而不是颗粒本身。",
        },
      ],
    },
    3: {
      folio: "野外图版 03 · 观测",
      navLabel: "观测",
      title: "激光切开尘羽",
      subtitle: "CALIOP 采样一条狭窄的大气帘幕；反复剖面揭示尘层高度，再由地图连接采样位置。",
      evidence: "观测层 · 激光雷达回波结构与气溶胶光学分类",
      boundary: "示意层 · 路线图用于解释；彩色帘幕不是下载的实测数据产品。",
      stamp: "CALIPSO 视觉语法 · 原创重绘",
      beats: [
        {
          action: "揭示近似激光雷达语法的垂直观测帘幕",
          title: "观测：一道垂直切片",
          body: "激光回波定位气溶胶层，并依据光学特征区分尘埃。",
        },
        {
          action: "把狭窄切片放到示意跨洋路线旁",
          title: "示意：切片连接成路径",
          body: "地图解释地理连续性，但不假装所有位置同时被测量。",
        },
      ],
    },
    4: {
      folio: "野外图版 04 · 沉降",
      navLabel: "沉降",
      title: "尘羽不会完整抵达",
      subtitle: "一部分尘埃落入大西洋，一部分被降水清除，剩余部分抵达南美并进入更大的养分循环。",
      evidence: "CALIPSO 与野外采样共同支持跨盆地输送和沉降路径。",
      boundary: "尘埃只是亚马孙养分收支的一项输入，不是森林肥力的完整解释。",
      stamp: "大西洋剖面 · 峰值",
      beats: [
        {
          action: "让高空尘层越过大西洋",
          title: "横渡海洋",
          body: "一条广阔大气路径把非洲源区与热带大西洋西部连接起来。",
        },
        {
          action: "让干沉降与降雨移除部分尘层",
          title: "途中损失物质",
          body: "输送同时也是清除：重力与降水会削薄空中的尘层。",
        },
        {
          action: "把剩余部分与亚马孙沉降连接",
          title: "抵达接收生态系统",
          body: "沉降的矿物物质可以把磷和其他成分带进流域。",
        },
        {
          action: "把沉降路径放入多元养分收支",
          title: "一项贡献，不是全部收支",
          body: "土壤、风化、河流、火、生命过程和其他大气输入仍属于同一故事。",
        },
      ],
    },
    5: {
      folio: "野外图版 05 · 变化",
      navLabel: "变化",
      title: "同一片海，不同年份",
      subtitle: "CALIOP 多年记录显示，输送与沉降存在显著年际变化。",
      evidence: "三条示意路线分别表达较强、较弱与位置偏移的尘羽状态。",
      boundary: "线条粗细只是示意，不是质量刻度，也不代表固定的年度输送量。",
      stamp: "季节图 · 不标吨数",
      beats: [
        {
          action: "对比三种非定量路线状态",
          title: "路径仍在，强弱会变",
          body: "天气与源区条件会改变尘层厚度、纬度，以及最终有多少物质完成横渡。",
        },
      ],
    },
  },
};

function cx(...classes: Array<string | false | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

function clampScene(scene: number): SceneId {
  return Math.min(5, Math.max(1, Math.round(scene))) as SceneId;
}

function clampBeat(beat: number, total: number): number {
  return Math.min(total - 1, Math.max(0, Math.round(beat)));
}

function useFonts() {
  useEffect(() => {
    const id = "expedition-screenprint-saharan-dust-fonts";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700;800;900&family=Noto+Sans+SC:wght@400;500;700;900&display=swap";
    document.head.appendChild(link);
  }, []);
}

function InkGrain() {
  return (
    <svg className={styles.grain} viewBox="0 0 960 540" aria-hidden="true">
      <defs>
        <pattern
          id="saharan-dust-grain"
          width="17"
          height="13"
          patternUnits="userSpaceOnUse"
        >
          <rect x="1" y="2" width="2" height="1" />
          <rect x="9" y="8" width="1" height="2" />
          <rect x="14" y="3" width="2" height="2" />
          <rect x="5" y="11" width="3" height="1" />
        </pattern>
      </defs>
      <rect width="960" height="540" fill="url(#saharan-dust-grain)" />
    </svg>
  );
}

function RegistrationMarks() {
  return (
    <div className={styles.registration} aria-hidden="true">
      <span className={styles.regTopLeft} />
      <span className={styles.regTopRight} />
      <span className={styles.regBottomLeft} />
      <span className={styles.regBottomRight} />
    </div>
  );
}

function SceneOneArtwork({ language }: { language: Lang }) {
  const labels =
    language === "zh"
      ? { bod: "博德莱洼地", active: "活跃源区", others: "其他源区", lake: "古湖床沉积" }
      : { bod: "BODÉLÉ DEPRESSION", active: "ACTIVE SOURCE", others: "OTHER SOURCE REGIONS", lake: "ANCIENT LAKE-BED SEDIMENT" };

  return (
    <svg className={styles.sourceMap} viewBox="0 0 1100 610" role="img" aria-label={labels.bod}>
      <path className={styles.africaPlate} d="M466 55 L598 64 L712 128 L766 228 L741 332 L673 412 L624 556 L536 484 L504 370 L421 318 L373 207 L397 110 Z" />
      <path className={styles.saharaPlate} d="M397 112 L592 66 L710 130 L736 216 L648 257 L514 224 L389 187 Z" />
      <path className={styles.lakeBed} d="M554 210 C595 186 642 196 663 224 C634 254 583 259 546 238 Z" />
      <path className={styles.windChannel} d="M519 139 C565 161 598 179 625 213" />
      <path className={styles.windChannel} d="M535 126 C582 144 620 166 647 207" />
      <circle className={styles.sourceRingOuter} cx="620" cy="224" r="72" />
      <circle className={styles.sourceRingInner} cx="620" cy="224" r="46" />
      <circle className={styles.sourceCore} cx="620" cy="224" r="11" />
      <circle className={styles.otherSource} cx="476" cy="178" r="8" />
      <circle className={styles.otherSource} cx="538" cy="154" r="6" />
      <circle className={styles.otherSource} cx="691" cy="170" r="7" />
      <path className={styles.labelRule} d="M650 225 L832 190" />
      <text className={styles.mapLabelStrong} x="848" y="185">{labels.bod}</text>
      <text className={styles.mapLabel} x="848" y="218">{labels.active}</text>
      <path className={styles.labelRule} d="M487 178 L282 144" />
      <text className={styles.mapLabel} x="82" y="139">{labels.others}</text>
      <path className={styles.labelRule} d="M590 251 L807 332" />
      <text className={styles.mapLabel} x="820" y="340">{labels.lake}</text>
      <g className={styles.coordinateStamp}>
        <rect x="70" y="402" width="294" height="126" />
        <text x="96" y="451">17°N · 18°E</text>
        <text x="96" y="493">MODIS / SOURCE NOTE</text>
      </g>
    </svg>
  );
}

function DustParticles({ lifted }: { lifted: boolean }) {
  const particles = [
    [182, 402], [221, 384], [259, 410], [295, 371], [329, 400],
    [363, 356], [402, 390], [440, 340], [477, 368], [515, 326],
    [555, 352], [595, 305], [636, 329], [677, 290], [720, 312],
    [758, 274], [800, 296], [840, 262], [878, 282], [914, 251],
  ];
  return (
    <g className={cx(styles.particleField, lifted && styles.visible)} data-visible={lifted ? "true" : "false"}>
      {particles.map(([cx, cy], index) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={index % 3 === 0 ? 7 : 5} />
      ))}
    </g>
  );
}

function SceneTwoArtwork({ beat, language }: { beat: number; language: Lang }) {
  const labels = language === "zh"
    ? { source: "裸露沉积物", lift: "湍流抬升", layer: "高空尘层", wind: "携带气流", coast: "非洲西岸" }
    : { source: "EXPOSED SEDIMENT", lift: "TURBULENT LIFT", layer: "ELEVATED DUST LAYER", wind: "CARRYING WIND", coast: "WEST AFRICAN COAST" };
  return (
    <svg className={styles.sectionMap} viewBox="0 0 1200 610" role="img" aria-label={labels.layer}>
      <rect className={styles.sectionSky} width="1200" height="610" />
      <path className={styles.sectionGround} d="M0 466 C170 420 300 440 460 411 C570 391 647 425 734 438 L778 495 L0 610 Z" />
      <path className={styles.sectionOcean} d="M778 495 C900 478 1030 481 1200 458 L1200 610 L778 610 Z" />
      <path className={styles.exposedBed} d="M76 432 C178 398 289 407 392 390 L437 433 C309 451 188 462 76 471 Z" />
      <path className={cx(styles.airLayer, beat >= 2 && styles.visible)} data-visible={beat >= 2 ? "true" : "false"} d="M359 236 C561 174 790 187 1052 231 L1070 320 C803 278 574 266 373 321 Z" />
      <DustParticles lifted={beat >= 1} />
      <g className={cx(styles.liftArrows, beat >= 1 && styles.visible)} data-visible={beat >= 1 ? "true" : "false"}>
        <path d="M236 409 C254 340 288 304 330 260" />
        <path d="M344 399 C364 320 405 273 455 239" />
        <path d="M454 384 C475 310 517 265 570 225" />
      </g>
      <g className={cx(styles.windField, beat >= 2 && styles.visible)} data-visible={beat >= 2 ? "true" : "false"}>
        <path d="M419 191 C598 138 802 149 1031 196" />
        <path d="M438 351 C625 300 828 309 1075 348" />
      </g>
      <path className={styles.sectionRule} d="M68 496 H747" />
      <text className={styles.sectionLabelStrong} x="74" y="548">{labels.source}</text>
      <text className={styles.sectionLabel} x="274" y="247">{labels.lift}</text>
      <text className={styles.sectionLabelStrong} x="710" y="224">{labels.layer}</text>
      <text className={styles.sectionLabel} x="840" y="178">{labels.wind}</text>
      <text className={styles.sectionLabel} x="796" y="548">{labels.coast}</text>
    </svg>
  );
}

function SceneThreeArtwork({ beat, language }: { beat: number; language: Lang }) {
  const labels = language === "zh"
    ? { observed: "观测层", schematic: "示意层", returns: "激光回波", profile: "垂直剖面", slices: "重复窄切片", route: "解释性路径" }
    : { observed: "OBSERVED", schematic: "SCHEMATIC", returns: "LASER RETURNS", profile: "VERTICAL PROFILE", slices: "REPEATED NARROW SLICES", route: "EXPLANATORY ROUTE" };
  return (
    <div className={styles.observationPair}>
      <div className={styles.observationPanel} data-evidence-layer="observed" data-beat-layout-item="true">
        <div className={styles.layerTag}>{labels.observed}</div>
        <svg viewBox="0 0 560 500" role="img" aria-label={labels.profile}>
          <rect className={styles.obsSky} width="560" height="500" />
          <path className={styles.obsGround} d="M0 448 C120 421 212 441 330 418 C418 401 484 417 560 405 L560 500 L0 500 Z" />
          <path className={styles.laserBeam} d="M281 22 V447" />
          <rect className={styles.dustReturnA} x="235" y="132" width="92" height="65" />
          <rect className={styles.dustReturnB} x="218" y="211" width="126" height="82" />
          <rect className={styles.cloudReturn} x="253" y="314" width="55" height="39" />
          <path className={styles.obsAxis} d="M77 70 V421 M70 421 H454" />
          <text className={styles.obsLabelStrong} x="102" y="98">{labels.returns}</text>
          <text className={styles.obsLabel} x="102" y="387">{labels.profile}</text>
        </svg>
      </div>
      <div
        className={cx(styles.schematicPanel, beat >= 1 && styles.visible)}
        data-evidence-layer="schematic"
        data-visible={beat >= 1 ? "true" : "false"}
        data-beat-layout-item="true"
      >
        <div className={styles.layerTag}>{labels.schematic}</div>
        <svg viewBox="0 0 560 500" role="img" aria-label={labels.route}>
          <path className={styles.africaMini} d="M60 92 L176 72 L240 125 L232 224 L188 276 L166 385 L108 320 L93 237 L44 179 Z" />
          <path className={styles.amazonMini} d="M416 184 L514 151 L550 215 L524 302 L466 362 L405 325 L384 248 Z" />
          <path className={styles.routeBand} d="M171 182 C255 127 344 137 434 219" />
          <path className={styles.sliceMark} d="M215 113 V257 M300 102 V271 M383 126 V290" />
          <circle className={styles.routePoint} cx="171" cy="182" r="9" />
          <circle className={styles.routePoint} cx="434" cy="219" r="9" />
          <text className={styles.obsLabelStrong} x="183" y="64">{labels.slices}</text>
          <text className={styles.obsLabel} x="252" y="330">{labels.route}</text>
        </svg>
      </div>
    </div>
  );
}

function SceneFourArtwork({ beat, language }: { beat: number; language: Lang }) {
  const labels = language === "zh"
    ? { africa: "非洲", atlantic: "大西洋", amazon: "亚马孙", settle: "沉降 / 雨洗", input: "一项输入", budget: "养分收支" }
    : { africa: "AFRICA", atlantic: "ATLANTIC", amazon: "AMAZON", settle: "SETTLING / RAINOUT", input: "ONE INPUT", budget: "NUTRIENT BUDGET" };
  return (
    <div className={styles.depositionField} data-deposition-field="true" data-peak={beat === 3 ? "true" : "false"}>
      <svg className={styles.depositionMap} viewBox="0 0 1200 590" role="img" aria-label={labels.atlantic}>
        <path className={styles.africaWest} d="M86 116 L288 82 L383 151 L369 257 L301 321 L267 485 L174 400 L147 298 L68 230 Z" />
        <path className={styles.southAmericaEast} d="M966 143 L1137 125 L1190 227 L1151 340 L1077 445 L985 411 L943 301 L906 223 Z" />
        <rect className={styles.atlanticPlate} x="383" y="91" width="523" height="394" />
        <path className={cx(styles.transAtlanticPlume, beat >= 0 && styles.visible)} d="M286 199 C478 121 693 139 987 239" />
        <path className={cx(styles.plumeCore, beat >= 0 && styles.visible)} d="M298 222 C512 166 724 171 978 258" />
        <g className={cx(styles.settlingMarks, beat >= 1 && styles.visible)} data-visible={beat >= 1 ? "true" : "false"}>
          <path d="M484 211 V347" /><path d="M592 191 V379" /><path d="M714 197 V364" /><path d="M828 218 V389" />
          <circle cx="484" cy="356" r="7" /><circle cx="592" cy="388" r="7" /><circle cx="714" cy="373" r="7" /><circle cx="828" cy="398" r="7" />
        </g>
        <g className={cx(styles.amazonField, beat >= 2 && styles.visible)} data-visible={beat >= 2 ? "true" : "false"}>
          <path d="M996 246 C1030 211 1087 219 1110 258 C1080 279 1031 284 996 246 Z" />
          <path d="M1028 291 C1062 255 1121 266 1141 306 C1102 328 1054 325 1028 291 Z" />
          <path d="M985 334 C1023 303 1073 313 1090 350 C1052 368 1014 364 985 334 Z" />
        </g>
        <g className={cx(styles.budgetStamp, beat >= 3 && styles.visible)} data-visible={beat >= 3 ? "true" : "false"}>
          <circle cx="1046" cy="323" r="105" />
          <circle cx="1046" cy="323" r="78" />
          <text x="1046" y="309">{labels.input}</text>
          <text x="1046" y="347">{labels.budget}</text>
        </g>
        <text className={styles.depositionLabel} x="128" y="532">{labels.africa}</text>
        <text className={styles.depositionLabel} x="591" y="532">{labels.atlantic}</text>
        <text className={styles.depositionLabel} x="1009" y="532">{labels.amazon}</text>
        <text className={cx(styles.depositionNote, beat >= 1 && styles.visible)} x="548" y="432">{labels.settle}</text>
      </svg>
    </div>
  );
}

function RouteRow({
  label,
  path,
  tone,
  weight,
}: {
  label: string;
  path: string;
  tone: "ochre" | "teal" | "forest";
  weight: "wide" | "narrow" | "medium";
}) {
  return (
    <g className={styles.routeRow} data-route-tone={tone} data-route-weight={weight}>
      <path d={path} />
      <circle cx="354" cy="-7" r="12" />
      <circle cx="1071" cy="-7" r="12" />
      <text x="68" y="-25">{label}</text>
    </g>
  );
}

function SceneFiveArtwork({ language }: { language: Lang }) {
  const labels = language === "zh"
    ? { strong: "较强输送年", weak: "较弱输送年", shifted: "路径偏移年", africa: "非洲源区", amazon: "南美接收区", note: "示意粗细 · 无质量刻度" }
    : { strong: "STRONGER TRANSPORT YEAR", weak: "WEAKER TRANSPORT YEAR", shifted: "SHIFTED-TRACK YEAR", africa: "AFRICAN SOURCES", amazon: "SOUTH AMERICAN RECEPTOR", note: "SCHEMATIC THICKNESS · NO MASS SCALE" };
  return (
    <div className={styles.variationMap} data-quantitative="false">
      <svg viewBox="0 0 1200 610" role="img" aria-label={labels.note}>
        <path className={styles.africaEdge} d="M306 22 L369 64 L353 177 L330 305 L359 466 L305 586 L241 520 L223 361 L254 217 L216 94 Z" />
        <path className={styles.amazonEdge} d="M1111 33 L1164 118 L1137 236 L1170 355 L1124 552 L1058 588 L1033 451 L1052 318 L1011 199 L1040 86 Z" />
        <g transform="translate(0 174)">
          <RouteRow label={labels.strong} tone="ochre" weight="wide" path="M354 -7 C570 -82 826 -74 1071 -7" />
        </g>
        <g transform="translate(0 326)">
          <RouteRow label={labels.weak} tone="teal" weight="narrow" path="M354 -7 C587 -38 828 -25 1071 -7" />
        </g>
        <g transform="translate(0 478)">
          <RouteRow label={labels.shifted} tone="forest" weight="medium" path="M354 -7 C570 76 838 48 1071 -7" />
        </g>
        <text className={styles.variationRegion} x="54" y="69">{labels.africa}</text>
        <text className={styles.variationRegion} x="898" y="69">{labels.amazon}</text>
        <text className={styles.variationNote} x="488" y="583">{labels.note}</text>
      </svg>
    </div>
  );
}

function SceneArtwork({
  scene,
  beat,
  language,
}: {
  scene: SceneId;
  beat: number;
  language: Lang;
}) {
  if (scene === 1) return <SceneOneArtwork language={language} />;
  if (scene === 2) return <SceneTwoArtwork beat={beat} language={language} />;
  if (scene === 3) return <SceneThreeArtwork beat={beat} language={language} />;
  if (scene === 4) return <SceneFourArtwork beat={beat} language={language} />;
  return <SceneFiveArtwork language={language} />;
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
  const sceneId = clampScene(scene);
  const copy = COPY[language][sceneId];
  const activeBeat = clampBeat(beat, copy.beats.length);
  const beatCopy = copy.beats[activeBeat];

  return (
    <section
      className={cx(styles.scene, styles[`scene${sceneId}`])}
      data-scene={sceneId}
      data-beat={activeBeat}
      data-composition={[
        "source-stamp",
        "vertical-section",
        "observation-split",
        "deposition-field",
        "seasonal-routes",
      ][sceneId - 1]}
    >
      <header className={styles.sceneHeader} data-beat-layout-item="true">
        <p className={styles.folio}>{copy.folio}</p>
        <h1>{copy.title}</h1>
        <p className={styles.subtitle}>{copy.subtitle}</p>
      </header>

      <div className={styles.artwork} data-beat-layout-item="true">
        <SceneArtwork scene={sceneId} beat={activeBeat} language={language} />
      </div>

      <aside className={styles.evidenceCard} data-beat-layout-item="true">
        <p className={styles.evidenceLabel}>{language === "zh" ? "证据层" : "EVIDENCE LAYER"}</p>
        <p>{copy.evidence}</p>
      </aside>

      <aside className={styles.boundaryCard} data-beat-layout-item="true">
        <p className={styles.evidenceLabel}>{language === "zh" ? "解释边界" : "INTERPRETIVE BOUNDARY"}</p>
        <p>{copy.boundary}</p>
      </aside>

      <div className={styles.beatCard} data-beat-layout-item="true">
        <span className={styles.beatIndex}>{String(activeBeat + 1).padStart(2, "0")}</span>
        <div>
          <strong>{beatCopy.title}</strong>
          <p>{beatCopy.body}</p>
        </div>
      </div>

      <footer className={styles.sceneFooter} data-beat-layout-item="true">
        <span>{copy.stamp}</span>
        <span>NASA MODIS / CALIPSO · YU ET AL. · PROSPERO ET AL.</span>
      </footer>
    </section>
  );
}

function DustArcNavigation({
  scene,
  language,
  onNavigate,
}: {
  scene: SceneId;
  language: Lang;
  onNavigate?: (scene: number, beat: number) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const expandLabel = language === "zh" ? "展开尘埃路径" : "Expand dust arc";
  const collapseLabel = language === "zh" ? "收起尘埃路径" : "Collapse dust arc";

  const navigateRelative = (delta: number) => {
    const target = Math.min(5, Math.max(1, scene + delta)) as SceneId;
    onNavigate?.(target, 0);
  };

  return (
    <nav
      className={styles.dustArcNav}
      aria-label={language === "zh" ? "尘埃跨洋路径导航" : "Dust arc scene navigation"}
      tabIndex={0}
      data-topic-navigation="true"
      data-navigation-geometry="path"
      data-navigation-carrier="dust-arc"
      data-navigation-invocation="click-expand"
      data-navigation-feedback="material-color-change"
      data-expanded={expanded ? "true" : "false"}
      data-ink-state={expanded ? "forest" : "ochre"}
      onPointerDown={(event) => event.stopPropagation()}
      onClick={(event) => event.stopPropagation()}
      onKeyDown={(event) => {
        event.stopPropagation();
        if (event.key === "ArrowRight" || event.key === "ArrowDown") {
          event.preventDefault();
          navigateRelative(1);
        }
        if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
          event.preventDefault();
          navigateRelative(-1);
        }
      }}
    >
      <button
        type="button"
        className={styles.arcToggle}
        aria-label={expanded ? collapseLabel : expandLabel}
        aria-expanded={expanded}
        aria-controls="saharan-dust-arc-stops"
        onClick={(event) => {
          event.stopPropagation();
          setExpanded((current) => !current);
        }}
      >
        <span className={styles.toggleStamp}>{expanded ? "×" : "+"}</span>
        <span>{language === "zh" ? "尘埃路径" : "DUST ARC"}</span>
      </button>

      <div id="saharan-dust-arc-stops" className={styles.arcStops} aria-hidden={!expanded}>
        <svg className={styles.arcLine} viewBox="0 0 720 100" aria-hidden="true">
          <path d="M35 76 C178 5 521 5 685 76" />
        </svg>
        {SCENE_IDS.map((sceneId, index) => {
          const current = sceneId === scene;
          return (
            <button
              key={sceneId}
              type="button"
              className={styles.arcStop}
              style={{ ["--arc-stop" as string]: index }}
              tabIndex={expanded ? 0 : -1}
              disabled={!expanded}
              aria-current={current ? "step" : undefined}
              aria-label={`Scene ${sceneId}: ${COPY[language][sceneId].navLabel}`}
              data-visited={sceneId <= scene ? "true" : "false"}
              data-current={current ? "true" : "false"}
              onClick={(event) => {
                event.stopPropagation();
                onNavigate?.(sceneId, 0);
              }}
            >
              <span>{String(sceneId).padStart(2, "0")}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

export function getMetadata(language: Lang): StyleMetadata {
  return {
    id: "expedition-screenprint",
    band: "craft-cultural",
    name: language === "zh" ? "探险丝网印" : "Expedition Screenprint",
    theme: language === "zh" ? "撒哈拉尘埃横渡大西洋" : "Saharan Dust Across the Atlantic",
    densityLabel: language === "zh" ? "舞台冲击" : "Stage Impact",
    heroScene: 4,
    colors: {
      bg: "#e9d49a",
      ink: "#183d35",
      panel: "#c95f31",
    },
    typography: {
      header: "Barlow Condensed 900",
      body: "Noto Sans SC 500",
    },
    tags: [
      "screenprint",
      "stamped-map",
      "satellite-section",
      "saharan-dust",
      "atmosphere",
      "path",
      "stage-impact",
      "flat-ink",
    ],
    fonts: ["Barlow Condensed", "cjk:Noto Sans SC"],
    scenes: SCENE_IDS.map((sceneId) => {
      const copy = COPY[language][sceneId];
      return {
        id: sceneId,
        title: copy.navLabel,
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

export default function SaharanDust({
  scene,
  beat,
  language,
  isThumbnail,
  reducedMotion,
  onNavigate,
}: BespokeStyleProps) {
  useFonts();
  const sceneId = clampScene(scene);
  const staticMode = reducedMotion || isThumbnail;

  return (
    <div
      className={styles.root}
      data-testid="saharan-dust-root"
      data-motion={staticMode ? "off" : "on"}
    >
      <InkGrain />
      <RegistrationMarks />
      <SpatialSceneTrack
        scene={sceneId}
        beat={beat}
        transitionKind="diagonal-pan"
        transitionMap={SAHARAN_DUST_TRANSITION_SCORE}
        transitionDurationMs={760}
        reducedMotion={staticMode}
        beatLayoutModes={BEAT_LAYOUT_MODES}
        className={styles.track}
        renderScene={(renderedScene, renderedBeat) => (
          <ScenePanel
            scene={renderedScene}
            beat={renderedBeat}
            language={language}
          />
        )}
      />
      {!isThumbnail && (
        <DustArcNavigation
          scene={sceneId}
          language={language}
          onNavigate={onNavigate}
        />
      )}
    </div>
  );
}

export const saharanDustTopic = defineStyleTopic({
  id: "saharan-dust",
  topic: {
    en: "Saharan Dust",
    zh: "撒哈拉尘",
  },
  model: "GPT 5.6 Sol",
  component: SaharanDust,
  getMetadata,
  navigation: SAHARAN_DUST_NAVIGATION,
  sources: SAHARAN_DUST_SOURCES,
  transitionScore: SAHARAN_DUST_TRANSITION_SCORE,
});

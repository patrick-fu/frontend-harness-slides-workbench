import { useRef, useState } from "react";
import type {
  CSSProperties,
  KeyboardEvent as ReactKeyboardEvent,
  PointerEvent as ReactPointerEvent,
  TouchEvent as ReactTouchEvent,
} from "react";
import type { BespokeStyleProps, StyleMetadata, TopicSource } from "../types";
import SpatialSceneTrack from "./SpatialSceneTrack";
import type {
  BeatLayoutMode,
  SceneTransitionMap,
  SceneTransitionModifierMap,
} from "./SpatialSceneTrack";
import { defineStyleTopic } from "./topic";
import styles from "./cassette-era-packaging-ice-core-archive.module.css";

type Lang = "en" | "zh";
type SceneId = 1 | 2 | 3 | 4 | 5;

const STYLE_ID = "cassette-era-packaging";
const TOPIC_ID = "ice-core-archive";
const SCENE_IDS = [1, 2, 3, 4, 5] as const;

const BEAT_COUNTS: Record<SceneId, number> = {
  1: 4,
  2: 3,
  3: 2,
  4: 1,
  5: 1,
};

const ICE_CORE_ARCHIVE_SOURCE_IDS = [
  "noaa-ncei-ice-core-proxies",
  "nasa-ice-core-record",
  "noaa-climate-ice-core-study",
  "fischer-dust-transport",
  "bender-gas-ice-age",
  "van-der-wel-isotope-diffusion",
  "winski-sp19-chronology",
] as const;

const ICE_CORE_ARCHIVE_CLAIM_IDS = [
  "trapped-air-composition",
  "water-isotope-proxy",
  "dust-aerosol-record",
  "event-marker-chemistry",
  "age-model-resolution",
  "archive-not-single-thermometer",
] as const;

type IceCoreArchiveSourceId = (typeof ICE_CORE_ARCHIVE_SOURCE_IDS)[number];
type IceCoreArchiveClaimId = (typeof ICE_CORE_ARCHIVE_CLAIM_IDS)[number];

type SourcePacket = TopicSource & {
  id: IceCoreArchiveSourceId;
  authority: string;
  title: string;
  citation: string;
  shortLabel: string;
  accessDate: "2026-07-10";
  boundary: string;
  claimIds: readonly IceCoreArchiveClaimId[];
};

export const ICE_CORE_ARCHIVE_SCENE_CLAIMS = {
  1: ["archive-not-single-thermometer"],
  2: ["trapped-air-composition", "water-isotope-proxy", "dust-aerosol-record"],
  3: [
    "trapped-air-composition",
    "water-isotope-proxy",
    "dust-aerosol-record",
    "age-model-resolution",
  ],
  4: ["event-marker-chemistry", "age-model-resolution"],
  5: ["archive-not-single-thermometer", "age-model-resolution"],
} as const satisfies Record<SceneId, readonly IceCoreArchiveClaimId[]>;

export const ICE_CORE_ARCHIVE_CLAIMS = [
  {
    id: "trapped-air-composition",
    visibleClaim:
      "Air sealed in ice-core bubbles records atmospheric composition, but the trapped gas is younger than the surrounding ice because closure occurs after firn processes.",
    sceneIds: [2, 3] as const,
    sourceIds: ["nasa-ice-core-record", "bender-gas-ice-age"] as const,
  },
  {
    id: "water-isotope-proxy",
    visibleClaim:
      "Water-isotope ratios in ice are temperature-related precipitation proxies whose fine-scale detail is smoothed by firn diffusion, with diffusion length depending on firn temperature and accumulation rate; they are not direct thermometer readings.",
    sceneIds: [2, 3] as const,
    sourceIds: [
      "noaa-climate-ice-core-study",
      "van-der-wel-isotope-diffusion",
    ] as const,
  },
  {
    id: "dust-aerosol-record",
    visibleClaim:
      "Dust preserved in ice is a particle or aerosol channel; its meaning depends on source, transport, and deposition rather than a one-to-one temperature conversion.",
    sceneIds: [2, 3] as const,
    sourceIds: [
      "noaa-ncei-ice-core-proxies",
      "noaa-climate-ice-core-study",
      "fischer-dust-transport",
    ] as const,
  },
  {
    id: "event-marker-chemistry",
    visibleClaim:
      "Volcanic sulfate, tephra, sea-salt, and related chemistry can form event or stratigraphic markers, while a marker alone does not establish every source or date without context.",
    sceneIds: [4] as const,
    sourceIds: [
      "nasa-ice-core-record",
      "noaa-climate-ice-core-study",
      "winski-sp19-chronology",
    ] as const,
  },
  {
    id: "age-model-resolution",
    visibleClaim:
      "Ice-core chronologies combine layer information with tie points, and temporal resolution or age uncertainty can change where annual layers are thin, missing, or not consistently resolvable.",
    sceneIds: [3, 4, 5] as const,
    sourceIds: ["winski-sp19-chronology", "bender-gas-ice-age"] as const,
  },
  {
    id: "archive-not-single-thermometer",
    visibleClaim:
      "A core is a multi-proxy archive: bubbles, isotopes, particles, and chemistry preserve different physical signals and should not be collapsed into one direct temperature reading.",
    sceneIds: [1, 5] as const,
    sourceIds: [
      "noaa-ncei-ice-core-proxies",
      "nasa-ice-core-record",
      "noaa-climate-ice-core-study",
      "van-der-wel-isotope-diffusion",
      "winski-sp19-chronology",
    ] as const,
  },
] as const satisfies readonly {
  id: IceCoreArchiveClaimId;
  visibleClaim: string;
  sceneIds: readonly SceneId[];
  sourceIds: readonly IceCoreArchiveSourceId[];
}[];

export const ICE_CORE_ARCHIVE_SOURCES = [
  {
    id: "noaa-ncei-ice-core-proxies",
    authority: "NOAA National Centers for Environmental Information",
    shortLabel: "NOAA NCEI",
    title: "Ice Core Paleoclimatology Archive",
    citation:
      "NOAA National Centers for Environmental Information. Ice Core: World Data Service for Paleoclimatology overview.",
    url: "https://www.ncei.noaa.gov/products/paleoclimatology/ice-core",
    accessDate: "2026-07-10",
    supports:
      "NOAA's ice-core archive describes oxygen isotopes, methane concentrations, dust content, and many other parameters as proxy climate indicators preserved in ice-core data collections.",
    boundary:
      "This archive overview establishes that ice cores hold multiple proxy categories. It does not license a universal conversion from any one category to temperature, a single site history, or a specific numeric reconstruction.",
    claimIds: ["dust-aerosol-record", "archive-not-single-thermometer"],
  },
  {
    id: "nasa-ice-core-record",
    authority: "NASA Earth Observatory",
    shortLabel: "NASA EO",
    title: "Paleoclimatology: The Ice Core Record",
    citation:
      "NASA Earth Observatory. Paleoclimatology: The Ice Core Record. NASA Science.",
    url: "https://science.nasa.gov/earth/earth-observatory/paleoclimatology-the-ice-core-record/",
    accessDate: "2026-07-10",
    supports:
      "NASA explains that trapped air bubbles provide a record of past atmospheric composition and that volcanic ash can be trapped in ice along with snow and dust.",
    boundary:
      "The page supports the physical presence of gas and volcanic material in ice. It does not make every bubble exactly contemporaneous with its enclosing ice or identify a volcanic source from an ash or chemical layer alone.",
    claimIds: [
      "trapped-air-composition",
      "event-marker-chemistry",
      "archive-not-single-thermometer",
    ],
  },
  {
    id: "noaa-climate-ice-core-study",
    authority: "NOAA Climate.gov",
    shortLabel: "NOAA Climate",
    title: "Climate at the core: how scientists study ice cores to reveal Earth's climate history",
    citation:
      "NOAA Climate.gov. Climate at the core: how scientists study ice cores to reveal Earth's climate history.",
    url: "https://www.climate.gov/news-features/climate-tech/climate-core-how-scientists-study-ice-cores-reveal-earths-climate",
    accessDate: "2026-07-10",
    supports:
      "NOAA Climate.gov describes dust, air bubbles, sea salts, volcanic ash, and soot as materials preserved in ice, and explains that oxygen-isotope ratios provide temperature-related climate evidence.",
    boundary:
      "The explanatory article is used for category-level physical meaning. The slide deliberately does not turn isotope, dust, salt, or ash signals into a site-independent temperature series or exact event attribution.",
    claimIds: [
      "water-isotope-proxy",
      "dust-aerosol-record",
      "event-marker-chemistry",
      "archive-not-single-thermometer",
    ],
  },
  {
    id: "fischer-dust-transport",
    authority: "Reviews of Geophysics",
    shortLabel: "Fischer 2007",
    title:
      "Glacial/interglacial changes in mineral dust and sea-salt records in polar ice cores: Sources, transport, and deposition",
    citation:
      "Fischer, H., et al. (2007). Glacial/interglacial changes in mineral dust and sea-salt records in polar ice cores: Sources, transport, and deposition. Reviews of Geophysics, 45. https://doi.org/10.1029/2005RG000192.",
    url: "https://agupubs.onlinelibrary.wiley.com/doi/full/10.1029/2005RG000192",
    accessDate: "2026-07-10",
    supports:
      "This peer-reviewed review explains that mineral dust and sea-salt in polar ice-core records reflect linked source, atmospheric transport, and wet or dry deposition processes, so concentration changes cannot be assigned to one climate cause by themselves.",
    boundary:
      "The review treats site- and process-dependent aerosol records. It supports keeping dust interpretation conditional; it does not identify the provenance, wind history, or climate state of the schematic dust lane in this topic.",
    claimIds: ["dust-aerosol-record"],
  },
  {
    id: "bender-gas-ice-age",
    authority: "Journal of Geophysical Research: Atmospheres",
    shortLabel: "Bender 2006",
    title: "Gas age–ice age differences and the chronology of the Vostok ice core, 0–100 ka",
    citation:
      "Bender, M. L., et al. (2006). Gas age–ice age differences and the chronology of the Vostok ice core, 0–100 ka. Journal of Geophysical Research: Atmospheres. https://doi.org/10.1029/2005JD006488.",
    url: "https://agupubs.onlinelibrary.wiley.com/doi/full/10.1029/2005JD006488",
    accessDate: "2026-07-10",
    supports:
      "The paper states that air is trapped after firn densification, so gas is younger than enclosing ice, and discusses how the gas-age/ice-age difference introduces chronology uncertainty.",
    boundary:
      "Its Vostok discussion does not set one gas-age offset for all sites or depths. The visual therefore shows a relationship and uncertainty boundary, not a universal age correction.",
    claimIds: ["trapped-air-composition", "age-model-resolution"],
  },
  {
    id: "van-der-wel-isotope-diffusion",
    authority: "The Cryosphere",
    shortLabel: "TC 2015",
    title: "Estimation and calibration of the water isotope differential diffusion length in ice core records",
    citation:
      "van der Wel, G., Fischer, H., Oerter, H., Meyer, H., & Meijer, H. A. J. (2015). Estimation and calibration of the water isotope differential diffusion length in ice core records. The Cryosphere, 9, 1601–1616. https://doi.org/10.5194/tc-9-1601-2015.",
    url: "https://tc.copernicus.org/articles/9/1601/2015/",
    accessDate: "2026-07-10",
    supports:
      "This peer-reviewed study explains that stable-water-isotope information is affected by diffusion during firnification and that diffusion length depends on firn temperature and accumulation rate.",
    boundary:
      "The paper supports a resolution and interpretation limit for isotope records. It does not support reading a schematic isotope strip as a calibrated temperature reconstruction.",
    claimIds: ["water-isotope-proxy", "archive-not-single-thermometer"],
  },
  {
    id: "winski-sp19-chronology",
    authority: "Climate of the Past",
    shortLabel: "SP19 2019",
    title: "The SP19 chronology for the South Pole Ice Core – Part 1: volcanic matching and annual layer counting",
    citation:
      "Winski, D. A., et al. (2019). The SP19 chronology for the South Pole Ice Core – Part 1: volcanic matching and annual layer counting. Climate of the Past, 15, 1793–1808. https://doi.org/10.5194/cp-15-1793-2019.",
    url: "https://cp.copernicus.org/articles/15/1793/2019/",
    accessDate: "2026-07-10",
    supports:
      "The SP19 chronology combines annual layer counting with volcanic matching; it documents sulfate and electrical-conductivity volcanic horizons and explains that annual layers can become too thin to resolve consistently, increasing interpolation uncertainty.",
    boundary:
      "This is a South Pole core chronology, not a template that makes all ice-core age models equally precise. The slide uses it to show why tie points and unresolved intervals must remain visible.",
    claimIds: [
      "event-marker-chemistry",
      "age-model-resolution",
      "archive-not-single-thermometer",
    ],
  },
] as const satisfies readonly SourcePacket[];

export const ICE_CORE_ARCHIVE_TRANSITION_SCORE = {
  "1->2": "scanline",
  "2->3": "push-y",
  "3->4": "afterimage",
  "4->5": "hard-cut",
} as const;

const transitionMap: SceneTransitionMap = ICE_CORE_ARCHIVE_TRANSITION_SCORE;

const TRANSITION_MODIFIER_MAP: SceneTransitionModifierMap = {
  "2->3": "ice-core-scrub",
};

const BEAT_LAYOUT_MODES: Partial<Record<number, BeatLayoutMode>> = {
  1: "reserved",
  2: "reserved",
  3: "reserved",
};

type SceneCopy = {
  eyebrow: string;
  title: string;
  deck: string;
  beats: Array<{
    action: string;
    title: string;
    body: string;
  }>;
};

type SceneDefinition = {
  composition:
    | "ice-cylinder"
    | "tape-reel"
    | "multitrack-sampling"
    | "event-marker"
    | "archive-case";
  en: SceneCopy;
  zh: SceneCopy;
};

const SCENES: Record<SceneId, SceneDefinition> = {
  1: {
    composition: "ice-cylinder",
    en: {
      eyebrow: "ICE-CORE ARCHIVE / BAY 01",
      title: "ONE CORE. SEVERAL RECORDING PATHS.",
      deck:
        "The cassette is an instrument metaphor: one ice column can preserve different physical traces at once.",
      beats: [
        {
          action: "Place the transparent ice cylinder",
          title: "A physical archive",
          body: "Set the core before assigning any climate meaning to it.",
        },
        {
          action: "Seat the core in the archive gate",
          title: "One material, many deposits",
          body: "Snow becomes ice while materials arrive through distinct pathways.",
        },
        {
          action: "Expose the blank channel sleeves",
          title: "Channels are not interchangeable",
          body: "The sleeves name separate records before any trace is read.",
        },
        {
          action: "Hold the five empty archive lanes",
          title: "Archive before answer",
          body: "The object is prepared for comparison, not reduced to one dial.",
        },
      ],
    },
    zh: {
      eyebrow: "冰芯档案 / 舱位 01",
      title: "同一冰芯，几条不同的记录路径。",
      deck: "卡带只是仪器隐喻：同一根冰柱能同时保留不同物理痕迹。",
      beats: [
        {
          action: "放置透明冰芯柱",
          title: "一个物理档案",
          body: "先放置冰芯，再谈它可能说明什么。",
        },
        {
          action: "把冰芯装入档案门",
          title: "一种介质，多条沉积路径",
          body: "积雪成冰时，不同物质沿不同路径抵达。",
        },
        {
          action: "露出空白的通道套",
          title: "通道不能互换",
          body: "先为不同记录命名，再去读取痕迹。",
        },
        {
          action: "保留五条空档案轨",
          title: "先有档案，再谈答案",
          body: "这个物件服务于比较，而不是一只单读数仪表。",
        },
      ],
    },
  },
  2: {
    composition: "tape-reel",
    en: {
      eyebrow: "CHANNEL ASSIGNMENT / BAY 02",
      title: "THREE SIGNALS. THREE PHYSICS.",
      deck:
        "Bubbles, water isotopes, and dust enter separate tracks because they are not measuring the same thing.",
      beats: [
        {
          action: "Route bubbles into the gas track",
          title: "Trapped air",
          body: "Atmospheric composition is not the same clock as the surrounding ice.",
        },
        {
          action: "Route water isotopes into the ice track",
          title: "Isotope proxy",
          body:
            "Temperature-related precipitation signal; firn diffusion and accumulation rate affect preserved detail, so it is not a direct temperature dial.",
        },
        {
          action: "Route dust into the particle track",
          title: "Particle history",
          body: "Aerosol material arrives through source, transport, and deposition.",
        },
      ],
    },
    zh: {
      eyebrow: "通道分配 / 舱位 02",
      title: "三种信号，三种物理。",
      deck: "气泡、水稳定同位素和尘埃进入不同轨道，因为它们并不测量同一件事。",
      beats: [
        {
          action: "把气泡接入气体轨",
          title: "被封存的空气",
          body: "大气成分并不与周围冰处于同一时间钟。",
        },
        {
          action: "把水同位素接入冰轨",
          title: "同位素 proxy",
          body: "与温度相关的降水信号；粒雪层扩散和积累率影响保留细节，因此它不是直接温度表。",
        },
        {
          action: "把尘埃接入颗粒轨",
          title: "颗粒历史",
          body: "气溶胶物质经历来源、输送和沉降。",
        },
      ],
    },
  },
  3: {
    composition: "multitrack-sampling",
    en: {
      eyebrow: "ALIGNED DEPTH / BAY 03",
      title: "ALIGN DEPTH. KEEP RESOLUTION SEPARATE.",
      deck:
        "A reading head can cross one depth axis while every proxy retains its own sampling window and uncertainty.",
      beats: [
        {
          action: "Park the optical reader at the shared depth axis",
          title: "Same core coordinate",
          body: "Alignment lets channels be compared without claiming they resolve time equally.",
        },
        {
          action: "Move the reader across the three sample strips",
          title: "Different resolution remains visible",
          body: "The transport moves once, then stops on a settled comparison state.",
        },
      ],
    },
    zh: {
      eyebrow: "对齐深度 / 舱位 03",
      title: "深度对齐，分辨率仍要分开。",
      deck: "读取头可以跨过同一深度轴，但每种 proxy 仍保有自己的采样窗口与不确定性。",
      beats: [
        {
          action: "把光学读取头停在共同深度轴",
          title: "同一个冰芯坐标",
          body: "对齐让通道能被比较，不代表它们等分辨率。",
        },
        {
          action: "让读取头跨过三条采样带",
          title: "不同分辨率仍然可见",
          body: "走带只发生一次，随后停在稳定的比较状态。",
        },
      ],
    },
  },
  4: {
    composition: "event-marker",
    en: {
      eyebrow: "CHRONOLOGY BENCH / BAY 04",
      title: "EVENT MARKERS ANCHOR TIME — NOT CERTAINTY.",
      deck:
        "Chemistry and tephra can help build an age model; tie points constrain a timeline while gaps remain explicit.",
      beats: [
        {
          action: "Align event markers with a bounded age model",
          title: "Tie points with an unresolved span",
          body: "Layer information and markers work together; neither erases uncertainty alone.",
        },
      ],
    },
    zh: {
      eyebrow: "年代台 / 舱位 04",
      title: "事件标记锚定时间，不会抹去不确定性。",
      deck: "化学物和火山灰可帮助建立年代模型；锚点约束时间线，空白区仍需明确可见。",
      beats: [
        {
          action: "让事件标记对齐受限年代模型",
          title: "有锚点，也有未解区间",
          body: "层信息与标记共同工作，任一方都不能独自消除不确定性。",
        },
      ],
    },
  },
  5: {
    composition: "archive-case",
    en: {
      eyebrow: "CLOSEOUT LABEL / BAY 05",
      title: "ARCHIVE, NOT A SINGLE THERMOMETER.",
      deck:
        "Read each proxy for its own physical meaning, then compare channels through an explicit age model.",
      beats: [
        {
          action: "Close the archive case around the multitrack label",
          title: "Keep the channels distinct",
          body: "The conclusion is a comparison discipline, not one temperature answer.",
        },
      ],
    },
    zh: {
      eyebrow: "归档标签 / 舱位 05",
      title: "这是档案，不是一支单读数温度计。",
      deck: "先读取每种 proxy 自己的物理意义，再通过明确的年代模型比较通道。",
      beats: [
        {
          action: "让档案盒合上多轨标签",
          title: "保持通道彼此不同",
          body: "结论是一种比较纪律，不是一个温度答案。",
        },
      ],
    },
  },
};

const CHANNEL_LABELS: Record<Lang, string[]> = {
  en: ["GAS", "ISOTOPE", "DUST", "CHEMISTRY", "AGE MODEL"],
  zh: ["气体", "同位素", "尘埃", "化学物", "年代模型"],
};

function clampScene(scene: number): SceneId {
  return Math.max(1, Math.min(5, scene)) as SceneId;
}

function clampBeat(scene: SceneId, beat: number): number {
  return Math.max(0, Math.min(BEAT_COUNTS[scene] - 1, beat));
}

function sourceFor(sourceId: IceCoreArchiveSourceId): SourcePacket {
  const source = ICE_CORE_ARCHIVE_SOURCES.find(
    (candidate) => candidate.id === sourceId,
  );
  if (!source) {
    throw new Error("Unknown Ice-Core Archive source: " + sourceId);
  }
  return source;
}

function claimFor(claimId: IceCoreArchiveClaimId) {
  const claim = ICE_CORE_ARCHIVE_CLAIMS.find(
    (candidate) => candidate.id === claimId,
  );
  if (!claim) {
    throw new Error("Unknown Ice-Core Archive claim: " + claimId);
  }
  return claim;
}

function sceneSourceIds(scene: SceneId): IceCoreArchiveSourceId[] {
  return Array.from(
    new Set(
      ICE_CORE_ARCHIVE_SCENE_CLAIMS[scene].flatMap(
        (claimId) => claimFor(claimId).sourceIds,
      ),
    ),
  );
}

function copyFor(scene: SceneId, language: Lang): SceneCopy {
  return SCENES[scene][language];
}

function revealClass(visible: boolean): string {
  return [styles.reveal, visible ? styles.revealVisible : styles.revealHidden]
    .filter(Boolean)
    .join(" ");
}

function SourceStamp({
  scene,
  language,
}: {
  scene: SceneId;
  language: Lang;
}) {
  const claimIds = ICE_CORE_ARCHIVE_SCENE_CLAIMS[scene];
  const sourceIds = sceneSourceIds(scene);
  const claimSourceLinks = claimIds
    .map(
      (claimId) =>
        claimId + ":" + claimFor(claimId).sourceIds.join(","),
    )
    .join(";");

  return (
    <aside
      className={styles.sourceStamp}
      data-source-stamp="true"
      data-scene-source-stamp="true"
      data-claim-source-map="true"
      data-scene-id={scene}
      data-claim-ids={claimIds.join(" ")}
      data-source-ids={sourceIds.join(" ")}
      data-claim-source-links={claimSourceLinks}
      data-beat-layout-item="true"
      aria-label={language === "zh" ? "本场事实来源" : "Sources for this scene"}
      onPointerDown={(event) => event.stopPropagation()}
      onTouchStartCapture={(event) => event.stopPropagation()}
      onTouchMoveCapture={(event) => event.stopPropagation()}
      onTouchEndCapture={(event) => event.stopPropagation()}
      onTouchCancelCapture={(event) => event.stopPropagation()}
    >
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
            SRC: {source.shortLabel}
          </a>
        );
      })}
    </aside>
  );
}

function ArchiveHeader({
  scene,
  language,
}: {
  scene: SceneId;
  language: Lang;
}) {
  const copy = copyFor(scene, language);
  return (
    <header className={styles.sceneHeader} data-beat-layout-item="true">
      <span className={styles.sceneIndex}>{String(scene).padStart(2, "0")}</span>
      <div>
        <p className={styles.eyebrow}>{copy.eyebrow}</p>
        <h1 className={styles.sceneTitle}>{copy.title}</h1>
      </div>
      <span className={styles.archiveCode}>ICA / {String(scene).padStart(2, "0")}</span>
    </header>
  );
}

function IceCylinder({ showSleeves, language }: { showSleeves: boolean; language: Lang }) {
  return (
    <div className={styles.iceCylinderAssembly} data-ice-cylinder="true">
      <svg
        className={styles.iceCylinder}
        viewBox="0 0 160 560"
        role="img"
        aria-label={language === "zh" ? "透明冰芯柱示意图" : "Transparent ice-core cylinder schematic"}
      >
        <rect x="35" y="26" width="90" height="506" rx="42" fill="#cce4e8" opacity="0.68" />
        <rect x="43" y="34" width="74" height="490" rx="34" fill="#edf7ef" opacity="0.78" />
        <ellipse cx="80" cy="36" rx="37" ry="12" fill="#f7f1d6" opacity="0.78" />
        <ellipse cx="80" cy="524" rx="37" ry="12" fill="#99c4cc" opacity="0.56" />
        {[76, 128, 182, 244, 307, 366, 432, 481].map((y) => (
          <line
            key={y}
            x1="47"
            y1={y}
            x2="113"
            y2={y}
            stroke="#386874"
            strokeWidth="2"
            opacity="0.3"
          />
        ))}
        {[98, 155, 272, 345, 454].map((y) => (
          <circle key={y} cx="72" cy={y} r="5" fill="#f7f1d6" stroke="#386874" strokeWidth="1" opacity="0.76" />
        ))}
        <path d="M52 212 H108 M52 214 H108" stroke="#bb553d" strokeWidth="2" opacity="0.74" />
        <path d="M52 389 H108" stroke="#b8882a" strokeWidth="3" opacity="0.7" />
      </svg>
      <span className={styles.depthCap}>DEPTH</span>
      <div
        className={[
          styles.channelSleeves,
          showSleeves ? styles.channelSleevesVisible : styles.channelSleevesHidden,
        ].join(" ")}
        aria-hidden={!showSleeves}
      >
        {CHANNEL_LABELS[language].map((label, index) => (
          <span key={label} data-empty-channel={String(index + 1)}>
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}

function SceneOne({
  beat,
  language,
}: {
  beat: number;
  language: Lang;
}) {
  const copy = copyFor(1, language);

  return (
    <section
      className={[styles.scene, styles.sceneOne].join(" ")}
      data-composition="ice-cylinder"
      data-claim-ids={ICE_CORE_ARCHIVE_SCENE_CLAIMS[1].join(" ")}
    >
      <ArchiveHeader scene={1} language={language} />
      <div className={styles.introGrid} data-beat-layout-item="true">
        <div className={styles.coreDock} data-beat-layout-item="true">
          <span className={styles.dockLabel}>
            {language === "zh" ? "原始介质" : "PRIMARY MEDIUM"}
          </span>
          <IceCylinder showSleeves={beat >= 2} language={language} />
          <span className={revealClass(beat >= 1)}>
            {language === "zh" ? "档案门已闭合" : "ARCHIVE GATE SEALED"}
          </span>
        </div>
        <div className={styles.introCopy} data-beat-layout-item="true">
          <p className={styles.deck} data-claim-id="archive-not-single-thermometer">
            {copy.deck}
          </p>
          <div className={styles.blankTrackStack} aria-label="Five empty archive tracks">
            {CHANNEL_LABELS[language].map((label, index) => (
              <div
                key={label}
                className={revealClass(beat >= 2)}
                data-archive-track="empty"
                data-track-index={String(index + 1)}
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                <span>{label}</span>
                <i />
              </div>
            ))}
          </div>
          <p
            className={[styles.boundaryNote, revealClass(beat >= 3)].join(" ")}
            data-claim-id="archive-not-single-thermometer"
          >
            {language === "zh"
              ? "先把不同物理量分轨；不要把任一条轨当作单独的温度答案。"
              : "Separate the physical quantities first; do not make any one track a stand-alone temperature answer."}
          </p>
          <SourceStamp scene={1} language={language} />
        </div>
      </div>
    </section>
  );
}

type ProxyLane = {
  id: IceCoreArchiveClaimId;
  en: { token: string; label: string; fact: string; note: string };
  zh: { token: string; label: string; fact: string; note: string };
};

const PROXY_LANES: readonly ProxyLane[] = [
  {
    id: "trapped-air-composition",
    en: {
      token: "A",
      label: "TRAPPED AIR / GAS COMPOSITION",
      fact: "Air is sealed after firn closes; the gas record is younger than its surrounding ice.",
      note: "physical phase: enclosed atmosphere",
    },
    zh: {
      token: "A",
      label: "封存空气 / 气体成分",
      fact: "空气在粒雪层闭合后被封存；气体记录比周围冰更年轻。",
      note: "物理相态：被包裹的大气",
    },
  },
  {
    id: "water-isotope-proxy",
    en: {
      token: "B",
      label: "WATER ISOTOPES / δ18O + δD",
      fact:
        "Precipitation isotopes are temperature-related; firn diffusion and accumulation rate affect the detail preserved.",
      note: "physical phase: ice-water molecules",
    },
    zh: {
      token: "B",
      label: "水同位素 / δ18O + δD",
      fact: "降水同位素与温度相关；粒雪层扩散和积累率会影响所保留的细节。",
      note: "物理相态：冰中的水分子",
    },
  },
  {
    id: "dust-aerosol-record",
    en: {
      token: "C",
      label: "DUST / INSOLUBLE PARTICLES",
      fact: "Particles hold aerosol history; source, transport, and deposition are not one temperature dial.",
      note: "physical phase: deposited particles",
    },
    zh: {
      token: "C",
      label: "尘埃 / 不溶颗粒",
      fact: "颗粒保存气溶胶历史；来源、输送和沉降并不是一只温度表。",
      note: "物理相态：沉积颗粒",
    },
  },
];

function ProxyDiagram({ laneId }: { laneId: IceCoreArchiveClaimId }) {
  const shapes =
    laneId === "trapped-air-composition"
      ? [1, 3, 2, 4, 2]
      : laneId === "water-isotope-proxy"
        ? [2, 3, 4, 2, 3, 4, 2]
        : [4, 1, 3, 2, 4, 2];
  return (
    <div className={styles.proxyDiagram} data-proxy-diagram={laneId} aria-hidden="true">
      <span className={styles.proxyAxis} />
      {shapes.map((height, index) => (
        <i
          key={index}
          data-sample-height={String(height)}
            style={{ "--sample-height": String(height) } as CSSProperties}
        />
      ))}
    </div>
  );
}

function SceneTwo({
  beat,
  language,
}: {
  beat: number;
  language: Lang;
}) {
  const copy = copyFor(2, language);
  return (
    <section
      className={[styles.scene, styles.sceneTwo].join(" ")}
      data-composition="tape-reel"
      data-claim-ids={ICE_CORE_ARCHIVE_SCENE_CLAIMS[2].join(" ")}
    >
      <ArchiveHeader scene={2} language={language} />
      <p className={styles.deck} data-beat-layout-item="true">
        {copy.deck}
      </p>
      <div className={styles.proxyLaneGrid} data-beat-layout-item="true">
        <div className={styles.proxyReelBridge} aria-hidden="true">
          <span>
            <i />
          </span>
          <b>{language === "zh" ? "一根冰芯 / 三条路径" : "ONE CORE / THREE PATHS"}</b>
          <span>
            <i />
          </span>
        </div>
        {PROXY_LANES.map((lane, index) => {
          const laneCopy = lane[language];
          return (
            <article
              key={lane.id}
              className={[styles.proxyLane, revealClass(beat >= index)].join(" ")}
              data-beat-layout-item="true"
              data-claim-id={lane.id}
              data-proxy-lane={lane.id}
            >
              <div className={styles.proxyRail}>
                <span>{laneCopy.token}</span>
                <span>{String(index + 1).padStart(2, "0")}</span>
              </div>
              <div className={styles.proxyBody}>
                <p className={styles.proxyLabel}>{laneCopy.label}</p>
                <ProxyDiagram laneId={lane.id} />
                <p className={styles.proxyFact}>{laneCopy.fact}</p>
                <p className={styles.proxyNote}>{laneCopy.note}</p>
              </div>
            </article>
          );
        })}
      </div>
      <SourceStamp scene={2} language={language} />
    </section>
  );
}

type SamplingLane = {
  id: IceCoreArchiveClaimId;
  label: string;
  zhLabel: string;
  samples: number[];
};

const SAMPLING_LANES: readonly SamplingLane[] = [
  {
    id: "trapped-air-composition",
    label: "GAS / SEALED AIR",
    zhLabel: "气体 / 封存空气",
    samples: [2, 4, 2, 3, 2],
  },
  {
    id: "water-isotope-proxy",
    label: "ICE / WATER ISOTOPES",
    zhLabel: "冰 / 水同位素",
    samples: [1, 3, 4, 2, 3, 4, 2, 1, 3],
  },
  {
    id: "dust-aerosol-record",
    label: "PARTICLES / DUST",
    zhLabel: "颗粒 / 尘埃",
    samples: [4, 2, 1, 3, 2, 4, 1],
  },
];

function SamplingLaneRow({
  lane,
  language,
}: {
  lane: SamplingLane;
  language: Lang;
}) {
  return (
    <div className={styles.samplingRow} data-sampling-lane={lane.id} data-claim-id={lane.id}>
      <div className={styles.samplingMeta}>
        <span>{language === "zh" ? lane.zhLabel : lane.label}</span>
        <small>{language === "zh" ? "采样窗口" : "SAMPLE WINDOWS"}</small>
      </div>
      <div className={styles.samplingStrip} aria-label="Schematic sampling relationship, not data values">
        {lane.samples.map((height, index) => (
          <i
            key={index}
            data-window-height={String(height)}
            style={{ "--window-height": String(height) } as CSSProperties}
          />
        ))}
      </div>
    </div>
  );
}

function SceneThree({
  beat,
  language,
}: {
  beat: number;
  language: Lang;
}) {
  const copy = copyFor(3, language);
  const complete = beat >= 1;
  return (
    <section
      className={[styles.scene, styles.sceneThree].join(" ")}
      data-composition="multitrack-sampling"
      data-claim-ids={ICE_CORE_ARCHIVE_SCENE_CLAIMS[3].join(" ")}
    >
      <ArchiveHeader scene={3} language={language} />
      <div className={styles.samplingIntro} data-beat-layout-item="true">
        <p className={styles.deck} data-claim-id="age-model-resolution">
          {copy.deck}
        </p>
        <p className={styles.samplingBoundary}>
          {language === "zh"
            ? "这些带只表达采样关系，不是气候数值图，也不是声谱图。"
            : "These strips show sampling relationships only: not climate values, not an audio spectrum."}
        </p>
      </div>
      <div
        className={styles.readerBench}
        data-beat-layout-item="true"
        data-transport={complete ? "settled" : "parked"}
      >
        <span className={styles.depthRuler}>
          {language === "zh" ? "共同深度轴" : "SHARED DEPTH AXIS"}
        </span>
        <div className={styles.readerRail}>
          {SAMPLING_LANES.map((lane) => (
            <SamplingLaneRow key={lane.id} lane={lane} language={language} />
          ))}
          <span
            className={styles.readerHead}
            data-reader-head="true"
            data-reader-position={complete ? "settled" : "parked"}
            aria-label={language === "zh" ? "光学读取头" : "Optical reader head"}
          >
            <i />
          </span>
        </div>
      </div>
      <div className={styles.readerFooter} data-beat-layout-item="true">
        <p data-claim-id="age-model-resolution">
          {language === "zh"
            ? "同一深度可比较；不同分辨率、年龄关系和不确定性仍须保留。"
            : "Compare at a shared depth; retain different resolution, age relation, and uncertainty."}
        </p>
        <SourceStamp scene={3} language={language} />
      </div>
    </section>
  );
}

function SceneFour({ language }: { language: Lang }) {
  const copy = copyFor(4, language);
  return (
    <section
      className={[styles.scene, styles.sceneFour].join(" ")}
      data-composition="event-marker"
      data-claim-ids={ICE_CORE_ARCHIVE_SCENE_CLAIMS[4].join(" ")}
    >
      <ArchiveHeader scene={4} language={language} />
      <div className={styles.chronologyLayout}>
        <div className={styles.chronologyCopy} data-beat-layout-item="true">
          <p className={styles.deck} data-claim-id="event-marker-chemistry">
            {copy.deck}
          </p>
          <p className={styles.chronologyBoundary} data-claim-id="age-model-resolution">
            {language === "zh"
              ? "层计数与火山匹配共同建立时间；锚点之间的插值与不确定性不能被隐藏。"
              : "Layer information and volcanic matching build time together; interpolation and uncertainty between anchors stay visible."}
          </p>
          <SourceStamp scene={4} language={language} />
        </div>
        <div className={styles.ageModel} data-age-model="true" data-beat-layout-item="true">
          <div className={styles.ageSpine}>
            <span>{language === "zh" ? "冰芯深度" : "CORE DEPTH"}</span>
            <i />
          </div>
          <div className={styles.markerField}>
            <div className={styles.markerLine} />
            <div className={styles.eventMarker} data-event-marker="sulfate">
              <b>{language === "zh" ? "硫酸盐峰" : "SULFATE PEAK"}</b>
              <span>{language === "zh" ? "火山化学信号" : "VOLCANIC CHEMISTRY"}</span>
            </div>
            <div className={styles.eventMarker} data-event-marker="tephra">
              <b>{language === "zh" ? "火山灰层" : "TEPHRA LAYER"}</b>
              <span>{language === "zh" ? "可匹配的颗粒证据" : "MATCHABLE PARTICLE EVIDENCE"}</span>
            </div>
            <div className={styles.eventMarker} data-event-marker="salt">
              <b>{language === "zh" ? "海盐 / 离子" : "SEA SALT / IONS"}</b>
              <span>{language === "zh" ? "化学序列的一部分" : "ONE CHEMISTRY CHANNEL"}</span>
            </div>
            <div className={styles.unresolvedSpan} data-chronology-gap="true">
              <span>{language === "zh" ? "层过薄或未解" : "THIN OR UNRESOLVED LAYERS"}</span>
              <i />
            </div>
            <div className={styles.tiePoint} data-age-tie="one">
              {language === "zh" ? "锚点" : "TIE POINT"}
            </div>
            <div className={styles.tiePoint} data-age-tie="two">
              {language === "zh" ? "锚点" : "TIE POINT"}
            </div>
          </div>
          <div className={styles.ageLegend}>
            <span>{language === "zh" ? "年代模型" : "AGE MODEL"}</span>
            <span>{language === "zh" ? "不是条码" : "NOT A BARCODE"}</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function SceneFive({ language }: { language: Lang }) {
  const copy = copyFor(5, language);
  return (
    <section
      className={[styles.scene, styles.sceneFive].join(" ")}
      data-composition="archive-case"
      data-claim-ids={ICE_CORE_ARCHIVE_SCENE_CLAIMS[5].join(" ")}
    >
      <ArchiveHeader scene={5} language={language} />
      <div className={styles.caseAssembly} data-archive-case="closed" data-beat-layout-item="true">
        <div className={styles.caseSpine}>
          <span>{language === "zh" ? "冰芯档案" : "ICE-CORE ARCHIVE"}</span>
          <span>ICA / MULTITRACK</span>
        </div>
        <div className={styles.caseFace}>
          <div className={styles.caseLabel}>
            <p>{language === "zh" ? "归档标签" : "ARCHIVE LABEL"}</p>
            <h2 data-claim-id="archive-not-single-thermometer">
              {language === "zh"
                ? "档案，不是一支单读数温度计。"
                : "ARCHIVE, NOT A SINGLE THERMOMETER."}
            </h2>
            <p data-claim-id="age-model-resolution">{copy.deck}</p>
          </div>
          <div className={styles.caseTracks} aria-label="Five archive channels">
            {CHANNEL_LABELS[language].map((label, index) => (
              <span key={label} data-final-track={String(index + 1)}>
                <i />
                {label}
              </span>
            ))}
          </div>
        </div>
        <div className={styles.caseSeal}>
          <span>5</span>
          <small>{language === "zh" ? "通道" : "CHANNELS"}</small>
        </div>
      </div>
      <div className={styles.finalFooter} data-beat-layout-item="true">
        <p data-claim-id="archive-not-single-thermometer">
          {language === "zh"
            ? "气体、同位素、尘埃、化学物和年代模型各自提供证据；比较时不取消它们的边界。"
            : "Gas, isotopes, dust, chemistry, and chronology each contribute evidence; comparison does not cancel their boundaries."}
        </p>
        <SourceStamp scene={5} language={language} />
      </div>
    </section>
  );
}

function ScenePanel({
  scene,
  beat,
  language,
  isActive,
}: {
  scene: number;
  beat: number;
  language: Lang;
  isActive: boolean;
}) {
  const sceneId = clampScene(scene);
  const safeBeat = clampBeat(sceneId, beat);
  return (
    <div
      className={styles.scenePanel}
      data-scene-panel={sceneId}
      data-active-panel={isActive ? "true" : "false"}
      data-scene-beat={safeBeat}
    >
      {sceneId === 1 ? (
        <SceneOne beat={safeBeat} language={language} />
      ) : sceneId === 2 ? (
        <SceneTwo beat={safeBeat} language={language} />
      ) : sceneId === 3 ? (
        <SceneThree beat={safeBeat} language={language} />
      ) : sceneId === 4 ? (
        <SceneFour language={language} />
      ) : (
        <SceneFive language={language} />
      )}
    </div>
  );
}

function sceneForPointer(element: HTMLElement, clientX: number): SceneId {
  const rect = element.getBoundingClientRect();
  if (rect.width <= 0) return 1;
  const progress = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
  return clampScene(Math.round(progress * (SCENE_IDS.length - 1)) + 1);
}

function IceCoreTapeReels({
  scene,
  language,
  onNavigate,
}: {
  scene: SceneId;
  language: Lang;
  onNavigate?: (scene: number, beat: number) => void;
}) {
  const [previewScene, setPreviewScene] = useState<SceneId | null>(null);
  const [dragging, setDragging] = useState(false);
  const draggingRef = useRef(false);
  const startXRef = useRef(0);
  const displayedScene = previewScene ?? scene;

  const jump = (targetScene: SceneId) => {
    onNavigate?.(targetScene, 0);
  };

  const isolateTouch = (event: ReactTouchEvent<HTMLElement>) => {
    event.stopPropagation();
  };

  const beginScrub = (event: ReactPointerEvent<HTMLElement>) => {
    event.stopPropagation();
    if (event.target instanceof Element && event.target.closest("button")) {
      return;
    }
    draggingRef.current = true;
    startXRef.current = event.clientX;
    setDragging(true);
    setPreviewScene(sceneForPointer(event.currentTarget, event.clientX));
    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      // Clickable reel markers remain available where pointer capture is absent.
    }
  };

  const moveScrub = (event: ReactPointerEvent<HTMLElement>) => {
    if (!draggingRef.current) return;
    event.stopPropagation();
    setPreviewScene(sceneForPointer(event.currentTarget, event.clientX));
  };

  const finishScrub = (event: ReactPointerEvent<HTMLElement>) => {
    if (!draggingRef.current) return;
    event.stopPropagation();
    const targetScene = sceneForPointer(event.currentTarget, event.clientX);
    const moved = Math.abs(event.clientX - startXRef.current) > 8;
    draggingRef.current = false;
    setDragging(false);
    setPreviewScene(null);
    try {
      event.currentTarget.releasePointerCapture(event.pointerId);
    } catch {
      // No additional cleanup is required in environments without capture.
    }
    if (moved) jump(targetScene);
  };

  const cancelScrub = (event: ReactPointerEvent<HTMLElement>) => {
    event.stopPropagation();
    draggingRef.current = false;
    setDragging(false);
    setPreviewScene(null);
  };

  const handleKeyboard = (
    event: ReactKeyboardEvent<HTMLButtonElement>,
    targetScene: SceneId,
  ) => {
    event.stopPropagation();
    if (event.repeat) {
      event.preventDefault();
      return;
    }
    let nextScene: SceneId | null = null;
    switch (event.key) {
      case "Enter":
      case " ":
      case "Spacebar":
        nextScene = targetScene;
        break;
      case "ArrowLeft":
      case "ArrowUp":
        nextScene = clampScene(targetScene - 1);
        break;
      case "ArrowRight":
      case "ArrowDown":
        nextScene = clampScene(targetScene + 1);
        break;
      case "Home":
        nextScene = 1;
        break;
      case "End":
        nextScene = 5;
        break;
      default:
        return;
    }
    event.preventDefault();
    jump(nextScene);
  };

  const handleKeyboardUp = (event: ReactKeyboardEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    if (event.key === "Enter" || event.key === " " || event.key === "Spacebar") {
      event.preventDefault();
    }
  };

  return (
    <nav
      className={styles.tapeReelNav}
      aria-label={language === "zh" ? "冰芯磁带盘导航" : "Ice-core tape reel navigation"}
      data-topic-navigation="true"
      data-navigation-geometry="object-controller"
      data-navigation-carrier="ice-core-tape-reels"
      data-navigation-invocation="drag-scrub"
      data-navigation-feedback="active-glow"
      data-scrubbing={dragging ? "true" : "false"}
      data-preview-scene={displayedScene}
      onClick={(event) => event.stopPropagation()}
      onTouchStartCapture={isolateTouch}
      onTouchMoveCapture={isolateTouch}
      onTouchEndCapture={isolateTouch}
      onTouchCancelCapture={isolateTouch}
      onPointerDown={beginScrub}
      onPointerMove={moveScrub}
      onPointerUp={finishScrub}
      onPointerCancel={cancelScrub}
    >
      <span className={styles.navReel} aria-hidden="true">
        <i />
      </span>
      <div className={styles.reelWindow}>
        {SCENE_IDS.map((sceneId) => {
          const active = sceneId === displayedScene;
          const copy = copyFor(sceneId, language);
          return (
            <button
              key={sceneId}
              type="button"
              className={[styles.reelMark, active ? styles.reelMarkActive : ""].join(" ")}
              data-reel-mark="true"
              data-active={active ? "true" : "false"}
              aria-current={sceneId === scene ? "step" : undefined}
              aria-label={
                language === "zh"
                  ? "跳至场景 " + sceneId + "：" + copy.title
                  : "Jump to scene " + sceneId + ": " + copy.title
              }
              onClick={(event) => {
                event.stopPropagation();
                jump(sceneId);
              }}
              onKeyDown={(event) => handleKeyboard(event, sceneId)}
              onKeyUp={handleKeyboardUp}
            >
              <span>{String(sceneId).padStart(2, "0")}</span>
            </button>
          );
        })}
      </div>
      <span className={styles.navReel} aria-hidden="true">
        <i />
      </span>
      <span className={styles.navHint} aria-hidden="true">
        {language === "zh" ? "拖动 · 点击 · 按键" : "DRAG · TAP · KEYS"}
      </span>
    </nav>
  );
}

export function getMetadata(language: Lang): StyleMetadata {
  const zh = language === "zh";
  return {
    id: STYLE_ID,
    band: "craft-cultural",
    name: zh ? "卡带时代包装" : "Cassette-Era Packaging",
    theme: zh ? "冰芯档案" : "Ice-Core Archive",
    densityLabel: zh ? "图解中密度" : "Diagram-led Medium",
    heroScene: 3,
    colors: {
      bg: "#e8ddbc",
      ink: "#203d48",
      panel: "#d6c896",
    },
    typography: {
      header: "Arial Narrow 700",
      body: "Arial 400 / PingFang SC 500",
    },
    tags: [
      "ice-core",
      "paleoclimate",
      "archive",
      "cassette-instrument",
      "multi-proxy",
      "science-diagram",
      "craft-cultural",
    ],
    fonts: ["Arial Narrow", "Arial", "cjk:PingFang SC", "cjk:Microsoft YaHei"],
    scenes: SCENE_IDS.map((sceneId) => {
      const copy = copyFor(sceneId, language);
      return {
        id: sceneId,
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

export default function IceCoreArchive({
  scene,
  beat,
  language,
  isThumbnail,
  reducedMotion,
  onNavigate,
}: BespokeStyleProps) {
  const frozen =
    typeof document !== "undefined" &&
    document.documentElement.dataset.frozen === "true";
  const settled = reducedMotion || isThumbnail || frozen;
  const activeScene = clampScene(scene);
  const activeBeat = clampBeat(activeScene, beat);

  return (
    <div
      className={[styles.root, settled ? styles.settled : ""].join(" ")}
      data-topic-id={TOPIC_ID}
      data-style-id={STYLE_ID}
      data-language={language}
      data-motion={settled ? "off" : "on"}
      data-settled={settled ? "true" : "false"}
      data-frozen={frozen ? "true" : "false"}
      data-thumbnail={isThumbnail ? "true" : "false"}
    >
      <div className={styles.paperNoise} aria-hidden="true" />
      <div className={styles.archiveFrame} aria-hidden="true" />
      <SpatialSceneTrack
        scene={activeScene}
        beat={activeBeat}
        sceneIds={[...SCENE_IDS]}
        transitionKind="hard-cut"
        transitionMap={transitionMap}
        transitionModifierMap={TRANSITION_MODIFIER_MAP}
        transitionDurationMs={560}
        reducedMotion={settled}
        beatLayoutModes={BEAT_LAYOUT_MODES}
        className={styles.sceneTrack}
        renderScene={(trackScene, trackBeat, isActive) => (
          <ScenePanel
            scene={trackScene}
            beat={trackBeat}
            language={language}
            isActive={isActive}
          />
        )}
      />
      {!isThumbnail && (
        <IceCoreTapeReels
          scene={activeScene}
          language={language}
          onNavigate={onNavigate}
        />
      )}
    </div>
  );
}

export const iceCoreArchiveTopic = defineStyleTopic({
  id: TOPIC_ID,
  topic: {
    en: "Ice-Core Archive",
    zh: "冰芯档案",
  },
  model: "GPT 5.6 Sol",
  component: IceCoreArchive,
  getMetadata,
  navigation: {
    geometry: "object-controller",
    carrier: "ice-core-tape-reels",
    invocation: "drag-scrub",
    feedback: "active-glow",
  },
  sources: ICE_CORE_ARCHIVE_SOURCES,
  transitionScore: ICE_CORE_ARCHIVE_TRANSITION_SCORE,
});

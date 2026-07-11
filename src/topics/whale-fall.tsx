import { useEffect } from "react";
import type React from "react";
import type { Source } from "../domain/evidence";
import {
  defineTopic,
  type TopicMetadata,
  type TopicStageProps,
  type TopicTransitionScore,
} from "../domain/topic";
import SpatialSceneTrack, {
  type BeatLayoutMode,
  type SceneTransitionMap,
} from "../styles/SpatialSceneTrack";
import styles from "./whale-fall.module.css";

type Language = TopicStageProps["language"];
type SceneId = 1 | 2 | 3 | 4 | 5;

interface BeatCopy {
  action: string;
  title: string;
  body: string;
  marker: string;
}

interface SceneCopy {
  eyebrow: string;
  title: string;
  subtitle: string;
  evidence: string;
  sceneTitle: string;
  beats: BeatCopy[];
}

const SCENE_IDS: SceneId[] = [1, 2, 3, 4, 5];

const BEAT_LAYOUT_MODES: Partial<Record<number, BeatLayoutMode>> = {
  3: "reserved",
  4: "reserved",
  5: "reserved",
};

const TRANSITION_SCORE = {
  "1->2": "dip-to-color",
  "2->3": "dolly-pull",
  "3->4": "focus-swap",
  "4->5": "crossfade",
} as const satisfies TopicTransitionScore;

const TRANSITION_MAP: SceneTransitionMap = TRANSITION_SCORE;

const WHALE_FALL_SOURCES = [
  {
    authority: "NOAA Ocean Exploration",
    title: "Whale falls, wood, or kelp: A bonanza for life in the deep sea",
    url: "https://oceanexplorer.noaa.gov/edu/oceanage/04baco_taylor/media/smithwhalefalls.pdf",
    supports:
      "Supports the broad succession from soft-tissue scavenging through enriched sediment to long-lived sulfide-based communities, including the months-to-decades range used in the scene notes.",
    boundary:
      "The expedition summary describes observed and expected ranges at particular study sites; this Topic therefore avoids presenting those durations as a universal clock for every carcass and depth.",
  },
  {
    authority: "Monterey Bay Aquarium Research Institute (MBARI)",
    title: "Whale falls—Islands of abundance and diversity in the deep sea",
    url: "https://www.mbari.org/news/whale-falls-islands-of-abundance-and-diversity-in-the-deep-sea/",
    supports:
      "Supports rapid arrival of mobile scavengers, subsequent enrichment-opportunist assemblages, and a sulfophilic community powered by microbial processing of lipids within whale bones.",
    boundary:
      "The article reports Monterey and Southern California observations and uses representative stage descriptions; species, rates, and the clarity of each stage vary beyond those observed falls.",
  },
  {
    citation:
      "Smith, C. R. et al. (2015), Annual Review of Marine Science 7, 571–596. doi:10.1146/annurev-marine-010213-135144",
    title:
      "Whale-Fall Ecosystems: Recent Insights into Ecology, Paleoecology, and Evolution",
    url: "https://doi.org/10.1146/annurev-marine-010213-135144",
    supports:
      "Supports whale falls as organic- and sulfide-rich habitat islands and describes overlapping successional assemblages whose expression varies with carcass size, water depth, and environmental conditions.",
    boundary:
      "The review explicitly frames succession as overlapping and variable, so the five scenes are an explanatory sequence rather than a claim that every site passes through sharply separated stages.",
  },
  {
    authority: "Monterey Bay Aquarium Research Institute (MBARI)",
    title: "Fleshing out the life histories of dead whales",
    url: "https://www.mbari.org/news/fleshing-out-the-life-histories-of-dead-whales/",
    supports:
      "Supports repeated ROV observations of experimental whale falls and the distinction between widespread deep-sea animals and abundant bone specialists such as Osedax worms at individual sites.",
    boundary:
      "The study followed five carcasses in Monterey Canyon; the Topic uses it to show local evidence and specialist niches, not to imply that the same fauna colonize every whale fall worldwide.",
  },
] as const satisfies readonly (Source & { boundary: string })[];

const NAVIGATION = {
  geometry: "card-miniature",
  carrier: "whale-fall-filmstrip",
  invocation: "keyboard-focus",
  feedback: "next-state-preview",
} as const;

const COPY: Record<SceneId, Record<Language, SceneCopy>> = {
  1: {
    en: {
      eyebrow: "A DEEP-SEA ECOLOGY · OPENING",
      title: "AFTER THE WHALE FALLS",
      subtitle: "A body leaves the bright ocean. A habitat begins far below.",
      evidence: "The subject remains beyond the frame.",
      sceneTitle: "Surface title",
      beats: [
        {
          action: "Hold the surface title before the whale appears",
          title: "The last light",
          body: "Only the boundary between air and water is visible.",
          marker: "SURFACE",
        },
      ],
    },
    zh: {
      eyebrow: "深海生态 · 开场",
      title: "鲸落之后",
      subtitle: "一个身体离开明亮海洋。一个栖息地在深处开始。",
      evidence: "主体仍在画外。",
      sceneTitle: "海面片名",
      beats: [
        {
          action: "在鲸体出现前停住海面片名",
          title: "最后一道光",
          body: "画面只留下空气与海水的边界。",
          marker: "海面",
        },
      ],
    },
  },
  2: {
    en: {
      eyebrow: "DESCENT · WATER COLUMN TO SEAFLOOR",
      title: "The ocean closes above it.",
      subtitle:
        "The carcass arrives as a concentrated pulse of organic matter in an energy-poor deep sea.",
      evidence: "Destination: benthic boundary · depth and condition vary by fall",
      sceneTitle: "Descent",
      beats: [
        {
          action: "Descend through the water column and reveal the carcass",
          title: "A large food fall reaches bottom",
          body: "The event is local, sudden, and vastly larger than ordinary marine snow.",
          marker: "ARRIVAL",
        },
      ],
    },
    zh: {
      eyebrow: "下沉 · 从水柱到海床",
      title: "海面在它上方合拢。",
      subtitle: "鲸体把高度集中的有机物，带进能量稀缺的深海。",
      evidence: "终点：海底边界 · 深度与状态因鲸落而异",
      sceneTitle: "下沉",
      beats: [
        {
          action: "穿过水柱下沉，让鲸体从暗处显现",
          title: "一个巨大的食物降落到海床",
          body: "这个事件局部、突然，远大于平常的海洋雪输入。",
          marker: "抵达",
        },
      ],
    },
  },
  3: {
    en: {
      eyebrow: "SUCCESSION · OBSERVED ASSEMBLAGES",
      title: "First, the feast. Then, the enriched ground.",
      subtitle:
        "Mobile scavengers and enrichment opportunists can dominate at different moments—and overlap.",
      evidence: "Representative ranges from studied falls · not a universal stopwatch",
      sceneTitle: "Scavenger succession",
      beats: [
        {
          action: "Bring mobile scavengers to the soft tissue",
          title: "Days → months",
          body: "Sharks, hagfish, rattails, crabs, and amphipods can remove soft tissue.",
          marker: "MOBILE SCAVENGERS",
        },
        {
          action: "Reveal the enriched sediment community beside the bones",
          title: "Months → years · stages overlap",
          body: "Organic-rich bones and nearby sediment support dense opportunistic assemblages.",
          marker: "ENRICHMENT OPPORTUNISTS",
        },
      ],
    },
    zh: {
      eyebrow: "生态接替 · 观测到的群落",
      title: "先是盛宴。随后，海床被有机物富集。",
      subtitle: "大型食腐者与富集机会主义生物会在不同时段占优，也可能重叠。",
      evidence: "研究地点的代表性范围 · 不是所有鲸落的统一秒表",
      sceneTitle: "食腐接替",
      beats: [
        {
          action: "让大型食腐者进入软组织区域",
          title: "数日 → 数月",
          body: "鲨、盲鳗、鼠尾鳕、蟹与端足类会取食软组织。",
          marker: "大型食腐者",
        },
        {
          action: "显露骨骼旁被有机物富集的沉积物群落",
          title: "数月 → 数年 · 阶段彼此重叠",
          body: "富含有机物的骨骼与邻近沉积物，支持高密度机会主义群落。",
          marker: "富集机会主义者",
        },
      ],
    },
  },
  4: {
    en: {
      eyebrow: "BONE MICROCOSM · CHEMICAL ENERGY",
      title: "Inside the bone, another food web opens.",
      subtitle:
        "Bone lipids, anaerobic microbes, and sulfide connect a carcass to chemosynthetic life.",
      evidence: "Scientific schematic · processes simplified, organisms not to scale",
      sceneTitle: "Bone microcosm",
      beats: [
        {
          action: "Expose lipid-rich pores inside a whale bone",
          title: "Stored energy remains",
          body: "Large whale bones can retain lipid-rich organic matter after soft tissue is gone.",
          marker: "BONE LIPIDS",
        },
        {
          action: "Trace anaerobic breakdown toward hydrogen sulfide",
          title: "Microbes transform the reserve",
          body: "Sulfate-reducing activity contributes sulfide within and around the bone.",
          marker: "H₂S",
        },
        {
          action: "Reveal sulfur-based microbial production and consumers",
          title: "Chemosynthesis supports a community",
          body: "Sulfur-oxidizing microbes become producers for grazers and symbiotic animals.",
          marker: "CHEMICAL FOOD WEB",
        },
      ],
    },
    zh: {
      eyebrow: "骨骼微世界 · 化学能",
      title: "骨骼内部，另一张食物网打开。",
      subtitle: "骨脂、厌氧微生物与硫化物，把鲸体连接到化能生态。",
      evidence: "科学示意图 · 过程已简化，生物不按比例",
      sceneTitle: "骨骼微生态",
      beats: [
        {
          action: "显露鲸骨内部富含脂质的孔隙",
          title: "储存的能量仍在",
          body: "软组织消失后，大型鲸骨仍可保留富含脂质的有机物。",
          marker: "骨脂",
        },
        {
          action: "沿厌氧分解过程追踪到硫化氢",
          title: "微生物转化这份储备",
          body: "硫酸盐还原活动会在骨内及周边形成硫化物。",
          marker: "H₂S",
        },
        {
          action: "显露以硫为基础的微生物生产与消费者",
          title: "化能合成支持一个群落",
          body: "硫氧化微生物成为生产者，支持取食者与共生动物。",
          marker: "化学食物网",
        },
      ],
    },
  },
  5: {
    en: {
      eyebrow: "ABYSSAL ISLAND · LONG VIEW",
      title: "One skeleton becomes an island in the dark.",
      subtitle:
        "A whale fall can concentrate food, hard substrate, and chemical energy across years to decades.",
      evidence:
        "Stages overlap and vary with carcass size, depth, oxygen, sediment, and local fauna.",
      sceneTitle: "Abyssal island",
      beats: [
        {
          action: "Pull back from the bone to the surrounding seafloor",
          title: "The scale widens",
          body: "A bone microcosm sits inside a larger patch of altered seabed.",
          marker: "LOCAL PATCH",
        },
        {
          action: "Mark the whale fall as a concentrated habitat island",
          title: "Resources gather in one place",
          body: "Food, attachment surfaces, and microbial energy create neighboring niches.",
          marker: "HABITAT ISLAND",
        },
        {
          action: "Add the evidence boundary around the succession",
          title: "No two falls keep the same schedule",
          body: "Carcass size, depth, oxygen, sediment, and local fauna reshape the sequence.",
          marker: "SITE VARIATION",
        },
        {
          action: "Settle into a motionless final wide shot",
          title: "A temporary island. A lasting ecological trace.",
          body: "The sequence is a field guide to overlapping assemblages, not a rigid law.",
          marker: "QUIET HOLD",
        },
      ],
    },
    zh: {
      eyebrow: "深渊岛屿 · 长镜头",
      title: "一副骨架，在黑暗中成为一座岛。",
      subtitle: "鲸落能在多年到数十年间，集中食物、硬质基底与化学能。",
      evidence: "阶段会重叠，并随鲸体大小、深度、氧、沉积物与当地生物而变化。",
      sceneTitle: "深渊岛屿",
      beats: [
        {
          action: "从骨骼拉远到周围海床",
          title: "尺度扩大",
          body: "骨骼微生态，位于一片更大的受影响海床之中。",
          marker: "局部斑块",
        },
        {
          action: "把鲸落标为资源集中的栖息地岛屿",
          title: "资源聚集在一处",
          body: "食物、附着表面与微生物能量，形成彼此相邻的生态位。",
          marker: "栖息地岛屿",
        },
        {
          action: "为接替过程加上证据边界",
          title: "没有两处鲸落遵循同一时刻表",
          body: "鲸体大小、深度、氧、沉积物与当地生物都会改写过程。",
          marker: "地点差异",
        },
        {
          action: "停在完全静止的深海远景",
          title: "临时的岛。长久的生态痕迹。",
          body: "这是一份重叠群落的观察指南，不是严格线性定律。",
          marker: "静默停留",
        },
      ],
    },
  },
};

const NAV_LABELS: Record<Language, string[]> = {
  en: ["Surface", "Descent", "Scavengers", "Bone microcosm", "Abyssal island"],
  zh: ["海面", "下沉", "食腐群落", "骨骼微生态", "深渊岛屿"],
};

const NAV_SCALES = [
  "surface-threshold",
  "ocean-column",
  "carcass-community",
  "bone-microcosm",
  "habitat-island",
] as const;

function useFonts() {
  useEffect(() => {
    const id = "whale-fall-fonts";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600&family=IBM+Plex+Sans:wght@400;500;600&family=Noto+Serif+SC:wght@500;600&display=swap";
    document.head.appendChild(link);
  }, []);
}

function clampScene(scene: number): SceneId {
  return SCENE_IDS.includes(scene as SceneId) ? (scene as SceneId) : 1;
}

function clampBeat(sceneId: SceneId, beat: number): number {
  return Math.max(0, Math.min(beat, COPY[sceneId].en.beats.length - 1));
}

function buildMetadata(language: Language): TopicMetadata {
  return {
    theme: language === "zh" ? "鲸落：深海接替" : "Whale Fall: Deep-Sea Succession",
    densityLabel: language === "zh" ? "强视觉 · 稀疏" : "Stage Impact · Sparse",
    heroScene: 5,
    colors: {
      bg: "#02070d",
      ink: "#e7f3ef",
      panel: "#071925",
    },
    typography: {
      header: "Cormorant Garamond 600",
      body: "IBM Plex Sans 500",
    },
    tags: [
      "cinematic",
      "letterbox",
      "deep-sea",
      "scientific-illustration",
      "stage-impact",
      "scale",
      "succession",
    ],
    fonts: ["Cormorant Garamond", "IBM Plex Sans", "cjk:Noto Serif SC"],
    scenes: SCENE_IDS.map((id) => {
      const scene = COPY[id][language];
      return {
        id,
        title: scene.sceneTitle,
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

function SurfaceArt() {
  return (
    <svg className={styles.art} viewBox="0 0 1600 720" aria-hidden="true">
      <defs>
        <linearGradient id="wf-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#08131f" />
          <stop offset="0.72" stopColor="#173849" />
          <stop offset="1" stopColor="#6a8b8d" />
        </linearGradient>
        <linearGradient id="wf-water" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#173d4b" />
          <stop offset="0.2" stopColor="#071a27" />
          <stop offset="1" stopColor="#02070d" />
        </linearGradient>
        <radialGradient id="wf-horizon" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#e6cfa9" stopOpacity="0.82" />
          <stop offset="1" stopColor="#8da9a2" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="1600" height="286" fill="url(#wf-sky)" />
      <ellipse cx="1040" cy="273" rx="430" ry="84" fill="url(#wf-horizon)" />
      <rect y="286" width="1600" height="434" fill="url(#wf-water)" />
      <path
        d="M0 291 C190 273 332 309 510 288 C727 262 912 312 1092 288 C1295 261 1420 301 1600 284"
        fill="none"
        stroke="#bed0c8"
        strokeOpacity="0.46"
        strokeWidth="3"
      />
      <path
        d="M0 315 C245 299 430 338 686 310 C910 287 1221 341 1600 306"
        fill="none"
        stroke="#4e7f87"
        strokeOpacity="0.48"
        strokeWidth="2"
      />
      <path d="M1015 286 L1090 720 L1375 720 L1104 286Z" fill="#d6e3d7" opacity="0.04" />
    </svg>
  );
}

function WhaleSilhouette({ skeleton = false }: { skeleton?: boolean }) {
  if (skeleton) {
    return (
      <g className={styles.skeleton}>
        <path
          d="M412 394 C552 302 777 302 950 368 C1044 404 1120 398 1220 350"
          fill="none"
          stroke="#d3c7a5"
          strokeWidth="18"
          strokeLinecap="round"
        />
        {[510, 585, 660, 735, 810, 885, 960].map((x, index) => (
          <path
            key={x}
            d={`M${x} ${index < 5 ? 344 - index * 2 : 352} C${x - 65} 392 ${x - 54} 468 ${x - 10} 496 M${x} ${index < 5 ? 344 - index * 2 : 352} C${x + 55} 392 ${x + 50} 455 ${x + 14} 480`}
            fill="none"
            stroke="#b8ae91"
            strokeWidth="8"
            strokeLinecap="round"
          />
        ))}
        <path
          d="M392 388 C334 366 278 388 254 430 C309 454 363 447 416 415Z"
          fill="none"
          stroke="#d3c7a5"
          strokeWidth="10"
        />
      </g>
    );
  }

  return (
    <g className={styles.whaleBody}>
      <path
        d="M238 422 C308 310 536 258 760 282 C923 299 1011 362 1148 365 C1212 365 1277 341 1353 297 C1342 347 1308 381 1261 404 C1309 420 1340 452 1351 494 C1278 449 1209 430 1140 438 C1005 455 908 520 726 538 C517 559 325 514 238 422Z"
        fill="#152b34"
        stroke="#75959a"
        strokeOpacity="0.54"
        strokeWidth="4"
      />
      <path
        d="M658 520 C719 568 783 581 855 575 C798 536 765 491 754 444Z"
        fill="#0c202a"
      />
      <path d="M352 398 C376 376 399 365 432 356" fill="none" stroke="#91aaab" strokeOpacity="0.45" strokeWidth="5" />
      <circle cx="326" cy="411" r="6" fill="#b5d0ca" opacity="0.66" />
    </g>
  );
}

function DescentArt() {
  return (
    <svg className={styles.art} viewBox="0 0 1600 720" aria-hidden="true">
      <defs>
        <linearGradient id="wf-column" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#12394a" />
          <stop offset="0.32" stopColor="#08202f" />
          <stop offset="0.78" stopColor="#020a12" />
          <stop offset="1" stopColor="#010508" />
        </linearGradient>
        <linearGradient id="wf-rays" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#c5e1d5" stopOpacity="0.19" />
          <stop offset="1" stopColor="#c5e1d5" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width="1600" height="720" fill="url(#wf-column)" />
      <path d="M210 0 L720 0 L1010 720 L650 720Z" fill="url(#wf-rays)" />
      <path d="M1040 0 L1280 0 L1110 720 L900 720Z" fill="url(#wf-rays)" opacity="0.42" />
      <g className={styles.descentWhale} transform="translate(70 135) scale(.82)">
        <WhaleSilhouette />
      </g>
      <path d="M0 630 C300 587 489 642 764 612 C1063 578 1323 637 1600 598 L1600 720 L0 720Z" fill="#061017" />
      <path d="M0 630 C320 590 505 643 775 612 C1050 580 1336 635 1600 598" fill="none" stroke="#34515a" strokeWidth="3" opacity="0.48" />
      <g className={styles.depthRegister}>
        <path d="M1470 78 L1470 598" stroke="#85aaa7" strokeOpacity="0.48" strokeWidth="2" />
        {[90, 214, 338, 462, 586].map((y) => (
          <path key={y} d={`M1452 ${y} L1488 ${y}`} stroke="#85aaa7" strokeOpacity="0.5" strokeWidth="2" />
        ))}
      </g>
    </svg>
  );
}

function ScavengerArt({ beat }: { beat: number }) {
  const enriched = beat >= 1;
  return (
    <svg className={styles.art} viewBox="0 0 1600 720" aria-hidden="true">
      <defs>
        <linearGradient id="wf-floor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#061522" />
          <stop offset="0.58" stopColor="#03101a" />
          <stop offset="1" stopColor="#0d1719" />
        </linearGradient>
        <radialGradient id="wf-carcass-light" cx="50%" cy="54%" r="54%">
          <stop offset="0" stopColor="#5e8f89" stopOpacity="0.3" />
          <stop offset="1" stopColor="#07131d" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="1600" height="720" fill="url(#wf-floor)" />
      <ellipse cx="815" cy="412" rx="680" ry="340" fill="url(#wf-carcass-light)" />
      <path d="M0 538 C295 492 505 555 782 520 C1050 486 1307 555 1600 510 L1600 720 L0 720Z" fill="#111a1a" />
      <g transform="translate(60 96) scale(.78)">
        <WhaleSilhouette skeleton={enriched} />
      </g>
      <g className={styles.scavengerSchool}>
        <path d="M344 240 C397 204 476 213 523 248 C474 281 398 290 344 253 L307 273 L316 237Z" fill="#263d44" stroke="#789398" strokeWidth="3" />
        <circle cx="474" cy="241" r="4" fill="#c7ded7" />
        <path d="M1176 262 C1222 230 1294 236 1335 267 C1293 296 1223 303 1176 273 L1142 288 L1152 257Z" fill="#1a313a" stroke="#68868b" strokeWidth="3" />
        <circle cx="1293" cy="261" r="4" fill="#c7ded7" />
        <path d="M470 488 C455 469 459 442 481 430 C501 450 504 473 491 491 M481 430 L448 416 M481 430 L513 412" fill="none" stroke="#b16f54" strokeWidth="5" strokeLinecap="round" />
      </g>
      <g className={enriched ? styles.opportunistsVisible : styles.opportunistsHidden}>
        {[620, 666, 710, 756, 804, 856, 910, 963, 1018, 1070].map((x, index) => (
          <g key={x} transform={`translate(${x} ${526 + (index % 3) * 8})`}>
            <path d="M0 12 C-8 -4 5 -19 0 -31 C14 -20 11 -5 0 12Z" fill={index % 2 ? "#cb8d67" : "#79a99c"} opacity="0.86" />
            <circle cx="0" cy="13" r="3" fill="#d8c6a5" />
          </g>
        ))}
        <ellipse cx="830" cy="550" rx="300" ry="46" fill="#ba6f50" opacity="0.11" />
      </g>
    </svg>
  );
}

function BoneArt({ beat }: { beat: number }) {
  return (
    <svg className={styles.art} viewBox="0 0 1600 720" aria-hidden="true">
      <defs>
        <linearGradient id="wf-lab-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#04131d" />
          <stop offset="0.55" stopColor="#092431" />
          <stop offset="1" stopColor="#06121c" />
        </linearGradient>
        <linearGradient id="wf-bone" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#e1d7b8" />
          <stop offset="0.48" stopColor="#9b947c" />
          <stop offset="1" stopColor="#504e43" />
        </linearGradient>
        <radialGradient id="wf-pore" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#0d2229" />
          <stop offset="0.7" stopColor="#5c5a4e" />
          <stop offset="1" stopColor="#c9c0a3" />
        </radialGradient>
      </defs>
      <rect width="1600" height="720" fill="url(#wf-lab-bg)" />
      <g className={styles.boneSection} transform="rotate(-11 600 390)">
        <path d="M-120 270 C134 170 385 155 610 240 C783 305 923 302 1124 226 L1325 542 C1052 656 795 653 573 575 C361 501 126 521 -120 617Z" fill="url(#wf-bone)" />
        {[120, 216, 318, 421, 528, 640, 756, 875, 997, 1125].map((x, index) => (
          <ellipse key={x} cx={x} cy={350 + (index % 3) * 68} rx={42 + (index % 2) * 20} ry={28 + (index % 3) * 7} fill="url(#wf-pore)" opacity="0.78" />
        ))}
        <path d="M-80 296 C245 227 410 243 631 315 C820 376 1025 356 1215 288" fill="none" stroke="#f2e9c9" strokeOpacity="0.34" strokeWidth="7" />
      </g>
      <g className={beat >= 0 ? styles.chemistryVisible : styles.chemistryHidden}>
        <circle cx="1040" cy="186" r="58" fill="#a9794f" opacity="0.9" />
        <path d="M945 235 C856 274 808 314 760 370" fill="none" stroke="#d6ad75" strokeWidth="5" strokeDasharray="12 10" />
      </g>
      <g className={beat >= 1 ? styles.chemistryVisible : styles.chemistryHidden}>
        <circle cx="1238" cy="307" r="66" fill="#55b4a5" opacity="0.88" />
        <text x="1238" y="319" textAnchor="middle" fill="#e4fff4" fontSize="31" fontFamily="IBM Plex Sans">H₂S</text>
        <path d="M1095 207 C1174 215 1216 243 1238 270" fill="none" stroke="#68d5c0" strokeWidth="5" strokeDasharray="12 10" />
      </g>
      <g className={beat >= 2 ? styles.chemistryVisible : styles.chemistryHidden}>
        <path d="M1292 320 C1378 343 1422 397 1430 464" fill="none" stroke="#8ce1cd" strokeWidth="5" strokeDasharray="12 10" />
        {[1363, 1417, 1471].map((x, index) => (
          <g key={x} transform={`translate(${x} ${486 + index * 18})`}>
            <circle r="28" fill={index === 1 ? "#dfbb6d" : "#7ed6c4"} opacity="0.88" />
            <circle r="12" fill="#08232c" opacity="0.68" />
          </g>
        ))}
      </g>
    </svg>
  );
}

function IslandArt({ beat }: { beat: number }) {
  return (
    <svg className={styles.art} viewBox="0 0 1600 720" aria-hidden="true">
      <defs>
        <linearGradient id="wf-abyss" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#020910" />
          <stop offset="0.7" stopColor="#03101a" />
          <stop offset="1" stopColor="#0c1517" />
        </linearGradient>
        <radialGradient id="wf-island" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#63bbaa" stopOpacity="0.3" />
          <stop offset="0.45" stopColor="#3d7e78" stopOpacity="0.13" />
          <stop offset="1" stopColor="#06121a" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="1600" height="720" fill="url(#wf-abyss)" />
      <path d="M0 536 C241 502 402 552 642 528 C886 503 1124 553 1600 502 L1600 720 L0 720Z" fill="#0c1718" />
      <ellipse className={beat >= 1 ? styles.islandGlowVisible : styles.islandGlowHidden} cx="922" cy="503" rx="540" ry="272" fill="url(#wf-island)" />
      <g className={styles.distantSkeleton} transform="translate(526 267) scale(.43)">
        <WhaleSilhouette skeleton />
      </g>
      <g className={beat >= 0 ? styles.ringVisible : styles.ringHidden}>
        <ellipse cx="900" cy="503" rx="235" ry="72" fill="none" stroke="#c4b98f" strokeWidth="3" strokeOpacity="0.52" />
      </g>
      <g className={beat >= 1 ? styles.ringVisible : styles.ringHidden}>
        <ellipse cx="900" cy="503" rx="378" ry="126" fill="none" stroke="#5cae9e" strokeWidth="3" strokeOpacity="0.48" strokeDasharray="15 12" />
      </g>
      <g className={beat >= 2 ? styles.ringVisible : styles.ringHidden}>
        <ellipse cx="900" cy="503" rx="520" ry="187" fill="none" stroke="#5f7c80" strokeWidth="2" strokeOpacity="0.36" strokeDasharray="7 15" />
        <path d="M320 464 L228 390" stroke="#7c9695" strokeWidth="2" />
        <path d="M1430 470 L1510 405" stroke="#7c9695" strokeWidth="2" />
      </g>
      {[582, 648, 723, 794, 856, 1008, 1087, 1160, 1240].map((x, index) => (
        <path
          key={x}
          d={`M${x} ${548 + (index % 3) * 8} C${x - 9} ${528 - index % 2 * 8} ${x + 8} ${511 - index % 3 * 6} ${x + 2} ${492 - index % 2 * 9}`}
          fill="none"
          stroke={index % 3 === 0 ? "#d39c70" : "#6eb4a6"}
          strokeWidth="4"
          strokeLinecap="round"
          opacity={beat >= 1 ? 0.76 : 0.28}
        />
      ))}
    </svg>
  );
}

function EvidenceRail({ sceneId, activeBeat }: { sceneId: SceneId; activeBeat: number }) {
  const beats = COPY[sceneId].en.beats;
  if (beats.length === 1) return null;

  return (
    <div className={styles.evidenceRail} aria-hidden="true" data-beat-layout-item="true">
      {beats.map((_, index) => (
        <span
          key={index}
          className={index <= activeBeat ? styles.evidenceLit : styles.evidenceDormant}
          data-revealed={index <= activeBeat ? "true" : "false"}
        />
      ))}
    </div>
  );
}

function ScenePanel({
  sceneId,
  beat,
  language,
  isActive,
}: {
  sceneId: SceneId;
  beat: number;
  language: Language;
  isActive: boolean;
}) {
  const content = COPY[sceneId][language];
  const activeBeat = clampBeat(sceneId, beat);
  const current = content.beats[activeBeat];
  const composition = [
    "surface-title-threshold",
    "vertical-descent-wide",
    "scavenger-carcass-close",
    "bone-chemistry-macro",
    "abyssal-island-long-view",
  ][sceneId - 1];

  return (
    <section
      className={[styles.scene, styles[`scene${sceneId}`], isActive ? styles.activeScene : ""]
        .filter(Boolean)
        .join(" ")}
      data-scene={sceneId}
      data-active={isActive ? "true" : "false"}
      data-composition={composition}
      data-scale={NAV_SCALES[sceneId - 1]}
      data-final-state={sceneId === 5 && activeBeat === 3 ? "settled" : undefined}
      aria-label={content.sceneTitle}
    >
      <div className={styles.projectedFrame}>
        {sceneId === 1 && <SurfaceArt />}
        {sceneId === 2 && <DescentArt />}
        {sceneId === 3 && <ScavengerArt beat={activeBeat} />}
        {sceneId === 4 && <BoneArt beat={activeBeat} />}
        {sceneId === 5 && <IslandArt beat={activeBeat} />}
        <div className={styles.vignette} aria-hidden="true" />
        <div className={styles.frameGrain} aria-hidden="true" />

        <div
          className={styles.copy}
          data-beat-layout-container={content.beats.length > 1 ? "true" : undefined}
          data-beat-layout-mode={content.beats.length > 1 ? "reserved" : undefined}
        >
          <p className={styles.eyebrow} data-beat-layout-item="true">
            {content.eyebrow}
          </p>
          <h1 data-beat-layout-item="true">{content.title}</h1>
          <p className={styles.subtitle} data-beat-layout-item="true">
            {content.subtitle}
          </p>
          <div className={styles.beatStatement} data-beat-layout-item="true">
            <span>{current.marker}</span>
            <strong>{current.title}</strong>
            <p>{current.body}</p>
          </div>
          <EvidenceRail sceneId={sceneId} activeBeat={activeBeat} />
          <p className={styles.evidenceBoundary} data-beat-layout-item="true">
            {content.evidence}
          </p>
        </div>
        <div className={styles.frameCode} aria-hidden="true">
          <span>{String(sceneId).padStart(2, "0")}</span>
          <span>WHALE FALL / FIELD CUT</span>
        </div>
      </div>
    </section>
  );
}

function Miniature({ sceneId }: { sceneId: SceneId }) {
  return (
    <span className={[styles.miniature, styles[`miniature${sceneId}`]].join(" ")} aria-hidden="true">
      <span className={styles.miniHorizon} />
      <span className={styles.miniWhale} />
      <span className={styles.miniBone} />
      <span className={styles.miniHalo} />
    </span>
  );
}

function FilmstripNavigation({
  activeScene,
  language,
  onNavigate,
}: {
  activeScene: SceneId;
  language: Language;
  onNavigate?: (scene: number, beat: number) => void;
}) {
  const navigate = (target: number) => {
    const next = Math.max(1, Math.min(5, target));
    onNavigate?.(next, 0);
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLButtonElement>,
    sceneId: SceneId,
  ) => {
    event.stopPropagation();
    if (event.repeat) return;
    const targetByKey: Partial<Record<string, number>> = {
      ArrowRight: sceneId + 1,
      ArrowDown: sceneId + 1,
      ArrowLeft: sceneId - 1,
      ArrowUp: sceneId - 1,
      Home: 1,
      End: 5,
    };
    const target = targetByKey[event.key];
    if (target === undefined) return;
    event.preventDefault();
    navigate(target);
  };

  return (
    <nav
      className={styles.filmstrip}
      aria-label={language === "zh" ? "鲸落胶片场景导航" : "Whale fall filmstrip navigation"}
      data-topic-navigation="true"
      data-navigation-geometry={NAVIGATION.geometry}
      data-navigation-carrier={NAVIGATION.carrier}
      data-navigation-invocation={NAVIGATION.invocation}
      data-navigation-feedback={NAVIGATION.feedback}
      onPointerDown={(event) => event.stopPropagation()}
      onClick={(event) => event.stopPropagation()}
    >
      {SCENE_IDS.map((sceneId) => {
        const active = sceneId === activeScene;
        const next = sceneId === Math.min(5, activeScene + 1) && sceneId !== activeScene;
        const label = NAV_LABELS[language][sceneId - 1];
        return (
          <button
            key={sceneId}
            type="button"
            className={styles.filmFrame}
            aria-label={
              language === "zh"
                ? `场景 ${sceneId}：${label}`
                : `Scene ${sceneId}: ${label}`
            }
            aria-current={active ? "step" : undefined}
            data-active={active ? "true" : "false"}
            data-next-preview={next ? "true" : "false"}
            data-scale={NAV_SCALES[sceneId - 1]}
            onClick={(event) => {
              event.stopPropagation();
              navigate(sceneId);
            }}
            onKeyDown={(event) => handleKeyDown(event, sceneId)}
          >
            <Miniature sceneId={sceneId} />
            <span className={styles.frameNumber}>{String(sceneId).padStart(2, "0")}</span>
            <span className={styles.previewLabel}>{label}</span>
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
  const safeScene = clampScene(scene);
  const motionOff = reducedMotion || isThumbnail;

  return (
    <main
      className={[
        styles.root,
        motionOff ? styles.motionOff : "",
        isThumbnail ? styles.thumbnail : "",
      ]
        .filter(Boolean)
        .join(" ")}
      data-style-id="widescreen-title-card"
      data-topic-id="whale-fall"
      data-current-scene={safeScene}
      data-motion-state={motionOff ? "settled" : "cinematic"}
    >
      <SpatialSceneTrack
        scene={safeScene}
        beat={beat}
        transitionKind="crossfade"
        transitionMap={TRANSITION_MAP}
        transitionDurationMs={1180}
        reducedMotion={motionOff}
        beatLayoutModes={BEAT_LAYOUT_MODES}
        className={styles.track}
        renderScene={(trackScene, trackBeat, isActive) => (
          <ScenePanel
            sceneId={trackScene as SceneId}
            beat={trackBeat}
            language={language}
            isActive={isActive}
          />
        )}
      />
      <div className={styles.topLetterbox} aria-hidden="true">
        <span>PELAGIC / BENTHIC</span>
        <span>ORIGINAL DEEP-SEA ILLUSTRATION</span>
      </div>
      <div className={styles.bottomLetterbox} aria-hidden="true" />
      {!isThumbnail && (
        <FilmstripNavigation
          activeScene={safeScene}
          language={language}
          onNavigate={onNavigate}
        />
      )}
    </main>
  );
}

const METADATA = {
  en: buildMetadata("en"),
  zh: buildMetadata("zh"),
} satisfies { en: TopicMetadata; zh: TopicMetadata };

const EVIDENCE = {
  kind: "mixed",
  sources: WHALE_FALL_SOURCES,
  boundary: {
    en: "Evidence boundary: whale-fall succession is an explanatory sequence drawn from particular observed sites; stages, durations, species, and conditions overlap and vary by carcass and setting. The original scientific illustrations simplify processes and are not to scale.",
    zh: "证据边界：鲸落接替是基于特定观测地点的解释性序列；阶段、时长、物种和条件会随鲸体与环境重叠并变化。原创科学示意图简化了过程，且不按比例绘制。",
  },
  display: "stage",
} as const;

export default defineTopic({
  id: "whale-fall",
  styleId: "widescreen-title-card",
  title: {
    en: "Whale Fall",
    zh: "鲸落",
  },
  modelId: "GPT 5.6 Sol",
  Stage: TopicStage,
  metadata: METADATA,
  navigation: NAVIGATION,
  transitionScore: TRANSITION_SCORE,
  evidence: EVIDENCE,
});

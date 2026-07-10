import { useEffect, useRef } from "react";
import type {
  CSSProperties,
  KeyboardEvent,
  MouseEvent,
  PointerEvent,
} from "react";
import type {
  BespokeStyleProps,
  StyleMetadata,
  TopicSource,
  TopicTransitionScore,
} from "../types";
import SpatialSceneTrack from "./SpatialSceneTrack";
import type { BeatLayoutMode, SceneTransitionMap } from "./SpatialSceneTrack";
import { defineStyleTopic } from "./topic";
import styles from "./arcade-boss-fight-egg-mimicry.module.css";

type Language = BespokeStyleProps["language"];
type SceneId = 1 | 2 | 3 | 4 | 5;
type EggVariant = "host" | "cuckoo" | "blue" | "brown" | "threshold";

interface BeatCopy {
  action: string;
  title: string;
  body: string;
}

interface SceneCopy {
  nav: string;
  navAria: string;
  section: string;
  kicker: string;
  title: string;
  deck: string;
  beats: readonly BeatCopy[];
}

interface TopicCopy {
  sourceLabel: string;
  nestMapLabel: string;
  openNode: string;
  thresholdLabel: string;
  noScoreLabel: string;
  scenes: Record<SceneId, SceneCopy>;
  sceneOne: {
    foreignEgg: string;
    protocol: string;
    threshold: string;
  };
  sceneTwo: {
    hostLabel: string;
    cuckooLabel: string;
    comparisonLabel: string;
    noPerfectScore: string;
  };
  sceneThree: {
    acceptLabel: string;
    acceptBody: string;
    ejectLabel: string;
    ejectBody: string;
    errorLabel: string;
  };
  sceneFour: {
    schemeLabel: string;
    staticLabel: string;
    generations: readonly [string, string, string];
    reflowLabel: string;
  };
  sceneFive: {
    dependencyLabel: string;
    dependencies: readonly [string, string, string, string];
    boundaryLabel: string;
    continueLabel: string;
  };
}

const SCENE_IDS: readonly SceneId[] = [1, 2, 3, 4, 5];

const BEAT_COUNTS: Record<SceneId, number> = {
  1: 4,
  2: 1,
  3: 2,
  4: 2,
  5: 1,
};

export const EGG_MIMICRY_TRANSITION_SCORE = {
  "1->2": "push-x",
  "2->3": "glitch",
  "3->4": "split-merge",
  "4->5": "push-x",
} as const satisfies TopicTransitionScore;

const TRANSITION_MAP: SceneTransitionMap = EGG_MIMICRY_TRANSITION_SCORE;

const BEAT_LAYOUT_MODES: Partial<Record<SceneId, BeatLayoutMode>> = {
  1: "reserved",
  2: "reserved",
  3: "reserved",
  4: "reserved",
  5: "reserved",
};

const NATIVE_TOUCH_PHASES = [
  "touchstart",
  "touchmove",
  "touchend",
  "touchcancel",
] as const;

const NATIVE_TOUCH_CAPTURE_OPTIONS: AddEventListenerOptions = {
  capture: true,
  passive: true,
};

function useNativeTouchBoundary<T extends HTMLElement>() {
  const boundaryRef = useRef<T | null>(null);

  useEffect(() => {
    const boundary = boundaryRef.current;
    if (!boundary) return undefined;

    const isolateNativeTouch = (event: globalThis.TouchEvent) => {
      event.stopPropagation();
    };

    for (const phase of NATIVE_TOUCH_PHASES) {
      boundary.addEventListener(
        phase,
        isolateNativeTouch,
        NATIVE_TOUCH_CAPTURE_OPTIONS,
      );
    }

    return () => {
      for (const phase of NATIVE_TOUCH_PHASES) {
        boundary.removeEventListener(
          phase,
          isolateNativeTouch,
          NATIVE_TOUCH_CAPTURE_OPTIONS,
        );
      }
    };
  }, []);

  return boundaryRef;
}

export type EggMimicrySourceId =
  | "abolins-abols-2019"
  | "moskat-2010"
  | "cherry-bennett-moskat-2007"
  | "honza-et-al-2014";

export type EggMimicryClaimId =
  | "apaj-field-protocol"
  | "colour-gradient-response"
  | "recognition-error-cost"
  | "within-population-matching"
  | "arms-race-boundary";

type LocalizedClaimFragment = Readonly<Record<Language, string>>;

export interface EggMimicryClaim {
  id: EggMimicryClaimId;
  sourceIds: readonly EggMimicrySourceId[];
  visibleByScene: Readonly<
    Partial<Record<SceneId, LocalizedClaimFragment>>
  >;
}

export const EGG_MIMICRY_CLAIMS = {
  "apaj-field-protocol": {
    id: "apaj-field-protocol",
    sourceIds: ["abolins-abols-2019"],
    visibleByScene: {
      1: {
        en: "Field lock: common cuckoo × great reed warbler at Apaj, central Hungary; 2016–17 breeding-season trials used 3D-printed model eggs.",
        zh: "田野锁定：匈牙利中部 Apaj 的普通杜鹃 × 大苇莺；2016–17 繁殖季试验使用了 3D 打印模型卵。",
      },
    },
  },
  "colour-gradient-response": {
    id: "colour-gradient-response",
    sourceIds: ["abolins-abols-2019"],
    visibleByScene: {
      1: {
        en: "The trials ran in early May–June and compared blue-green-to-brown model eggs; this slide is a field-study frame, not a universal rulebook.",
        zh: "试验在 5 月初至 6 月初进行，比对蓝绿色到褐色的模型卵；本页是田野研究框架，不是通用规则书。",
      },
      2: {
        en: "In that Apaj experiment, browner model eggs were more likely to be rejected; maculation alone did not explain the response.",
        zh: "在那项 Apaj 试验中，较褐的模型卵更可能被拒绝；仅靠斑纹无法解释反应。",
      },
    },
  },
  "recognition-error-cost": {
    id: "recognition-error-cost",
    sourceIds: ["moskat-2010"],
    visibleByScene: {
      3: {
        en: "Manipulated-clutch experiments found both mismatch-to-clutch and recognition-template cues; rejection can also remove an own egg under experimental conditions.",
        zh: "操纵巢卵试验发现，巢内不一致线索与识别模板都会参与；在实验条件下，拒绝也可能移除自己的卵。",
      },
    },
  },
  "within-population-matching": {
    id: "within-population-matching",
    sourceIds: ["cherry-bennett-moskat-2007", "honza-et-al-2014"],
    visibleByScene: {
      2: {
        en: "Natural cuckoo eggs were more similar to host eggs than experimental placements in one comparison, so within-population nest choice matters to the study design.",
        zh: "一项比较中，自然寄生的杜鹃卵比实验放置的卵更接近宿主卵，因此同一种群内的选巢会影响研究设计。",
      },
      4: {
        en: "Host-clutch matching can be shaped within a population; these three sprites are a teaching scheme, not a recorded three-generation series.",
        zh: "宿主巢卵匹配可在同一种群内被塑造；这三张精灵图是教学示意，不是一段被记录的三代时间序列。",
      },
    },
  },
  "arms-race-boundary": {
    id: "arms-race-boundary",
    sourceIds: [
      "abolins-abols-2019",
      "moskat-2010",
      "cherry-bennett-moskat-2007",
      "honza-et-al-2014",
    ],
    visibleByScene: {
      4: {
        en: "A threshold reflow visualizes reciprocal selection pressure; it does not claim every turn is a one-way upgrade.",
        zh: "阈值重排把相互选择压力可视化；它不声称每一回合都是单向升级。",
      },
      5: {
        en: "This evidence is host-population specific. No single screen proves a final winner, a universal response, or a one-way evolutionary ladder.",
        zh: "这些证据只对应特定宿主种群。没有一张屏幕能证明最终赢家、普遍反应或单向演化阶梯。",
      },
    },
  },
} as const satisfies Record<EggMimicryClaimId, EggMimicryClaim>;

export const EGG_MIMICRY_SCENE_CLAIMS = {
  1: ["apaj-field-protocol", "colour-gradient-response"],
  2: ["colour-gradient-response", "within-population-matching"],
  3: ["recognition-error-cost"],
  4: ["within-population-matching", "arms-race-boundary"],
  5: ["arms-race-boundary"],
} as const satisfies Record<SceneId, readonly EggMimicryClaimId[]>;

export interface EggMimicrySource extends TopicSource {
  id: EggMimicrySourceId;
  accessDate: string;
  citation: string;
  boundary: string;
  claimIds: readonly EggMimicryClaimId[];
  shortLabel: Readonly<Record<Language, string>>;
}

export const EGG_MIMICRY_SOURCES = [
  {
    id: "abolins-abols-2019",
    accessDate: "2026-07-10",
    authority: "Behavioural Processes / PubMed",
    title:
      "Anti-parasitic egg rejection by great reed warblers tracks differences along an eggshell color gradient",
    citation:
      "Abolins-Abols M, Hanley D, Moskát C, Grim T, Hauber ME. Behavioural Processes 166 (2019) 103902. doi:10.1016/j.beproc.2019.103902.",
    url: "https://pubmed.ncbi.nlm.nih.gov/31283976/",
    supports:
      "At Apaj, central Hungary, during 2016 and 2017 in early May to early June, researchers introduced 46 3D-printed model eggs spanning blue-green to brown coloration. Great reed warblers rejected 41 of 46 models; browner models had higher rejection probability, while maculation was not the explanatory predictor in the tested models.",
    boundary:
      "This is a model-egg response experiment in one great reed warbler population. It does not measure lifetime fitness, every cue a host can use, or every common-cuckoo host race.",
    claimIds: ["apaj-field-protocol", "colour-gradient-response", "arms-race-boundary"],
    shortLabel: {
      en: "Abolins-Abols et al. 2019",
      zh: "Abolins-Abols 等，2019",
    },
  },
  {
    id: "moskat-2010",
    accessDate: "2026-07-10",
    authority: "Journal of Experimental Biology / PubMed",
    title:
      "Discordancy or template-based recognition? Dissecting the cognitive basis of the rejection of foreign eggs in hosts of avian brood parasites",
    citation:
      "Moskát C, Bán M, Székely T, et al. Journal of Experimental Biology 213 (2010) 1975–1982. doi:10.1242/jeb.040394.",
    url: "https://pubmed.ncbi.nlm.nih.gov/20472785/",
    supports:
      "Manipulated-clutch experiments with great reed warblers, a common-cuckoo host, supported both discordancy and recognition-template mechanisms. In a condition where manipulated eggs were the majority but a minority of own eggs remained, the study reported rejection of own eggs and manipulated eggs above controls, exposing a recognition-error cost rather than a cost-free defence.",
    boundary:
      "The experiment isolates cognitive decision cues under a manipulated clutch. It should not be read as a direct estimate of natural acceptance or rejection frequencies in every location or season.",
    claimIds: ["recognition-error-cost", "arms-race-boundary"],
    shortLabel: {
      en: "Moskát et al. 2010",
      zh: "Moskát 等，2010",
    },
  },
  {
    id: "cherry-bennett-moskat-2007",
    accessDate: "2026-07-10",
    authority: "Journal of Evolutionary Biology / PubMed",
    title:
      "Do cuckoos choose nests of great reed warblers on the basis of host egg appearance?",
    citation:
      "Cherry MI, Bennett ATD, Moskát C. Journal of Evolutionary Biology 20 (2007) 1218–1222. doi:10.1111/j.1420-9101.2007.01308.x.",
    url: "https://pubmed.ncbi.nlm.nih.gov/17465931/",
    supports:
      "By comparing naturally and experimentally parasitized great reed warbler nests, the authors found naturally parasitized cuckoo eggs were more similar to host eggs in measured visual features. The result supports the possibility that choice among nests within a population can improve egg matching.",
    boundary:
      "The authors frame nest choice as evidence from a comparison, not proof that every cuckoo laying event is visually selected or that matching alone explains host outcomes.",
    claimIds: ["within-population-matching", "arms-race-boundary"],
    shortLabel: {
      en: "Cherry, Bennett & Moskát 2007",
      zh: "Cherry、Bennett 与 Moskát，2007",
    },
  },
  {
    id: "honza-et-al-2014",
    accessDate: "2026-07-10",
    authority: "Proceedings of the Royal Society B / PubMed Central",
    title: "Brood parasites lay eggs matching the appearance of host clutches",
    citation:
      "Honza M, Šulc M, Jelínek V, Požgayová M, Procházka P. Proceedings of the Royal Society B 281 (2014) 20132665. doi:10.1098/rspb.2013.2665.",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC3843844/",
    supports:
      "The study tested whether common cuckoos select host nests within a population to improve egg matching. It reported better chromatic matching in naturally parasitized nests than in nearest active non-parasitized neighbours, while not finding matching in achromatic spectral characteristics.",
    boundary:
      "This evidence distinguishes chromatic from achromatic results in its study system. It does not license a simplified claim that all egg traits, hosts, or cuckoo populations follow one matching rule.",
    claimIds: ["within-population-matching", "arms-race-boundary"],
    shortLabel: {
      en: "Honza et al. 2014",
      zh: "Honza 等，2014",
    },
  },
] as const satisfies readonly EggMimicrySource[];

const COPY: Record<Language, TopicCopy> = {
  en: {
    sourceLabel: "SOURCE STAMP",
    nestMapLabel: "NEST MAP / ABSOLUTE JUMP",
    openNode: "Focus nest node",
    thresholdLabel: "RECOGNITION THRESHOLD",
    noScoreLabel: "NO SCOREBOARD / NO LIFE BARS",
    scenes: {
      1: {
        nav: "Nest",
        navAria: "field lock",
        section: "01 / field lock",
        kicker: "ROUND 01 / COLD OPEN",
        title: "ONE NEST.\nONE EXTRA EGG.",
        deck:
          "The encounter is an ecological decision problem: identify a foreign egg without turning either species into a hero or a villain.",
        beats: [
          {
            action: "Open the nest frame",
            title: "Recognition threshold appears",
            body: "The HUD tracks a decision boundary, not health.",
          },
          {
            action: "Mark the foreign egg",
            title: "A comparison enters the clutch",
            body: "Similarity can change what the host must decide.",
          },
          {
            action: "Lock the field protocol",
            title: "Apaj field-study conditions",
            body: "Host, location, season, and model condition stay explicit.",
          },
          {
            action: "Show the decision fork",
            title: "Accept or reject",
            body: "Neither branch is a free or morally coded move.",
          },
        ],
      },
      2: {
        nav: "Compare",
        navAria: "pattern comparison",
        section: "02 / compare",
        kicker: "ROUND 02 / PATTERN SPACE",
        title: "MATCHING IS\nNOT A BEAUTY SCORE.",
        deck:
          "A host clutch supplies a reference space. The foreign egg is evaluated as a pattern relation, not as perfect, ugly, good, or bad.",
        beats: [
          {
            action: "Hold pattern space",
            title: "Colour gradient comparison",
            body: "Model eggs make a response curve visible without flattening it into a single trait.",
          },
        ],
      },
      3: {
        nav: "Decide",
        navAria: "decision costs",
        section: "03 / decide",
        kicker: "ROUND 03 / RULES PANEL",
        title: "A RESPONSE\nHAS A COST.",
        deck:
          "Acceptance and rejection are both decisions under uncertainty. The interface pauses the action to show what each rule risks.",
        beats: [
          {
            action: "Expose the acceptance branch",
            title: "Acceptance retains the foreign egg",
            body: "The cost sits with the parasitism risk in this clutch.",
          },
          {
            action: "Expose the rejection branch",
            title: "Rejection can make a recognition error",
            body: "Experimental manipulation shows why a stricter rule is not cost-free.",
          },
        ],
      },
      4: {
        nav: "Reflow",
        navAria: "generation sprites",
        section: "04 / reflow",
        kicker: "ROUND 04 / SIGNATURE LOOP",
        title: "THREE SPRITES.\nRECIPROCAL PRESSURE.",
        deck:
          "A pixel teaching model puts pattern change and a host response threshold on one shared field. It is deliberately not a literal evolutionary replay.",
        beats: [
          {
            action: "Show three static sprite states",
            title: "Pattern states share one nest map",
            body: "The frame stays legible as a static comparison in reduced-motion mode.",
          },
          {
            action: "Reflow the threshold",
            title: "Selection pressure is reciprocal",
            body: "The relationship can shift without guaranteeing an upgrade every turn.",
          },
        ],
      },
      5: {
        nav: "Boundary",
        navAria: "research boundary",
        section: "05 / boundary",
        kicker: "ROUND 05 / CONTEXT SCREEN",
        title: "ARMS RACE\nCONTINUES.",
        deck:
          "The final screen preserves dependencies and limits: field populations, clutches, visual cues, and decision costs keep this system from becoming a simple win state.",
        beats: [
          {
            action: "Hold the research boundary",
            title: "Continue observing, do not declare a winner",
            body: "The evidence remains specific to studies, host populations, and experimental conditions.",
          },
        ],
      },
    },
    sceneOne: {
      foreignEgg: "FOREIGN EGG / pattern under comparison",
      protocol: "FIELD PROTOCOL / visible conditions",
      threshold: "DECISION FORK / accept ↔ reject",
    },
    sceneTwo: {
      hostLabel: "HOST CLUTCH RANGE",
      cuckooLabel: "CUCKOO EGG",
      comparisonLabel: "VISUAL COMPARISON FIELD",
      noPerfectScore: "NO “PERFECT” / “UGLY” METER",
    },
    sceneThree: {
      acceptLabel: "ACCEPT",
      acceptBody: "A foreign egg remains in the clutch.",
      ejectLabel: "EJECT",
      ejectBody: "A rule can misclassify an own egg.",
      errorLabel: "RECOGNITION ERROR",
    },
    sceneFour: {
      schemeLabel: "SCHEMATIC / NOT A RECORDED TIMELINE",
      staticLabel: "STATIC GENERATION SPRITES",
      generations: ["GEN 01", "GEN 02", "GEN 03"],
      reflowLabel: "THRESHOLD REFLOW",
    },
    sceneFive: {
      dependencyLabel: "SYSTEM DEPENDENCIES",
      dependencies: [
        "host-clutch variation",
        "cuckoo nest choice",
        "visual recognition cues",
        "accept / reject costs",
      ],
      boundaryLabel: "RESEARCH BOUNDARY",
      continueLabel: "NO FINAL WIN SCREEN",
    },
  },
  zh: {
    sourceLabel: "来源印章",
    nestMapLabel: "巢位地图 / 绝对跳转",
    openNode: "聚焦巢位节点",
    thresholdLabel: "识别阈值",
    noScoreLabel: "无记分板 / 无生命条",
    scenes: {
      1: {
        nav: "巢位",
        navAria: "田野锁定",
        section: "01 / 田野锁定",
        kicker: "回合 01 / 冷开场",
        title: "一个巢。\n一枚外来卵。",
        deck:
          "这是一道生态决策题：识别外来卵，同时不把任何一方写成英雄或反派。",
        beats: [
          {
            action: "打开巢位画面",
            title: "识别阈值出现",
            body: "HUD 追踪的是决策边界，不是生命值。",
          },
          {
            action: "标记外来卵",
            title: "一项比较进入巢卵",
            body: "相似性会改变宿主需要作出的判断。",
          },
          {
            action: "锁定田野协议",
            title: "Apaj 田野研究条件",
            body: "宿主、地点、季节和模型条件都明确写出。",
          },
          {
            action: "显示决策岔路",
            title: "接受或拒绝",
            body: "两条路径都不是无代价或带道德标签的动作。",
          },
        ],
      },
      2: {
        nav: "比对",
        navAria: "纹样比对",
        section: "02 / 比对",
        kicker: "回合 02 / 纹样空间",
        title: "匹配不是\n审美评分。",
        deck:
          "宿主巢卵提供参照空间。外来卵被当作纹样关系来判断，而非完美、丑陋、好或坏。",
        beats: [
          {
            action: "保持纹样空间",
            title: "颜色梯度比对",
            body: "模型卵让反应曲线可见，而不把它压扁成单一性状。",
          },
        ],
      },
      3: {
        nav: "决策",
        navAria: "决策代价",
        section: "03 / 决策",
        kicker: "回合 03 / 规则面板",
        title: "一次反应\n带着代价。",
        deck:
          "接受和拒绝都是不确定性下的决策。界面暂停动作，展示每条规则可能付出的代价。",
        beats: [
          {
            action: "展开接受分支",
            title: "接受会留下外来卵",
            body: "代价落在这巢中持续的寄生风险上。",
          },
          {
            action: "展开拒绝分支",
            title: "拒绝可能产生识别错误",
            body: "实验操纵表明，收紧规则并非没有代价。",
          },
        ],
      },
      4: {
        nav: "重排",
        navAria: "代际精灵图",
        section: "04 / 重排",
        kicker: "回合 04 / 标志性循环",
        title: "三张精灵图。\n相互压力。",
        deck:
          "像素教学模型把纹样变化和宿主反应阈值放进同一个场地。它刻意不是一段真实的演化回放。",
        beats: [
          {
            action: "显示三张静态精灵图",
            title: "纹样状态共用一张巢位地图",
            body: "在减少动画模式中，画面仍是清晰的静态比较。",
          },
          {
            action: "重排阈值",
            title: "选择压力是相互的",
            body: "关系可以变化，但不保证每回合都是升级。",
          },
        ],
      },
      5: {
        nav: "边界",
        navAria: "研究边界",
        section: "05 / 边界",
        kicker: "回合 05 / 语境屏幕",
        title: "军备竞赛\n仍在继续。",
        deck:
          "最终画面保留依赖与限制：田野种群、巢卵、视觉线索和决策代价，阻止这个系统变成简单的胜负状态。",
        beats: [
          {
            action: "保留研究边界",
            title: "继续观察，不宣布赢家",
            body: "证据仍对应具体研究、宿主种群与实验条件。",
          },
        ],
      },
    },
    sceneOne: {
      foreignEgg: "外来卵 / 等待比对的纹样",
      protocol: "田野协议 / 条件可见",
      threshold: "决策岔路 / 接受 ↔ 拒绝",
    },
    sceneTwo: {
      hostLabel: "宿主巢卵范围",
      cuckooLabel: "杜鹃卵",
      comparisonLabel: "视觉比对场",
      noPerfectScore: "无“完美”/“丑陋”量表",
    },
    sceneThree: {
      acceptLabel: "接受",
      acceptBody: "一枚外来卵留在巢卵中。",
      ejectLabel: "排出",
      ejectBody: "规则可能误判自己的卵。",
      errorLabel: "识别错误",
    },
    sceneFour: {
      schemeLabel: "示意 / 非记录时间线",
      staticLabel: "静态代际精灵图",
      generations: ["第 01 代", "第 02 代", "第 03 代"],
      reflowLabel: "阈值重排",
    },
    sceneFive: {
      dependencyLabel: "系统依赖",
      dependencies: ["宿主巢卵变异", "杜鹃选巢", "视觉识别线索", "接受 / 拒绝代价"],
      boundaryLabel: "研究边界",
      continueLabel: "没有最终胜利屏",
    },
  },
};

const EGG_TILES: Record<EggVariant, readonly [number, number, number, number][]> = {
  host: [
    [39, 31, 9, 8],
    [54, 42, 8, 8],
    [35, 59, 9, 8],
    [57, 72, 8, 8],
    [44, 92, 8, 8],
  ],
  cuckoo: [
    [35, 25, 13, 8],
    [54, 34, 10, 9],
    [42, 52, 13, 8],
    [59, 65, 9, 11],
    [36, 83, 12, 8],
  ],
  blue: [
    [43, 27, 8, 8],
    [58, 46, 8, 8],
    [38, 63, 8, 8],
    [55, 83, 8, 8],
  ],
  brown: [
    [35, 30, 12, 9],
    [53, 39, 12, 9],
    [42, 58, 11, 9],
    [59, 76, 9, 9],
    [38, 91, 10, 8],
  ],
  threshold: [
    [44, 26, 9, 9],
    [56, 49, 9, 9],
    [36, 69, 10, 9],
    [52, 88, 12, 9],
  ],
};

const EGG_COLORS: Record<EggVariant, { shell: string; mark: string }> = {
  host: { shell: "#d8cf9a", mark: "#587e63" },
  cuckoo: { shell: "#a6d8bb", mark: "#2d5961" },
  blue: { shell: "#9ed7d8", mark: "#3c7382" },
  brown: { shell: "#dfad71", mark: "#7c4e40" },
  threshold: { shell: "#d7c1df", mark: "#725282" },
};

const NEST_MAP_LAYOUTS: Record<
  SceneId,
  Record<SceneId, { x: number; y: number }>
> = {
  1: {
    1: { x: 50, y: 22 },
    2: { x: 74, y: 37 },
    3: { x: 68, y: 71 },
    4: { x: 32, y: 72 },
    5: { x: 25, y: 39 },
  },
  2: {
    1: { x: 26, y: 30 },
    2: { x: 51, y: 22 },
    3: { x: 75, y: 40 },
    4: { x: 67, y: 71 },
    5: { x: 30, y: 68 },
  },
  3: {
    1: { x: 27, y: 42 },
    2: { x: 41, y: 21 },
    3: { x: 68, y: 26 },
    4: { x: 75, y: 59 },
    5: { x: 40, y: 72 },
  },
  4: {
    1: { x: 28, y: 62 },
    2: { x: 27, y: 28 },
    3: { x: 54, y: 20 },
    4: { x: 75, y: 39 },
    5: { x: 62, y: 70 },
  },
  5: {
    1: { x: 25, y: 42 },
    2: { x: 42, y: 23 },
    3: { x: 70, y: 27 },
    4: { x: 73, y: 63 },
    5: { x: 46, y: 73 },
  },
};

function normalizeScene(scene: number): SceneId {
  return scene >= 1 && scene <= 5 ? (scene as SceneId) : 1;
}

function clampBeat(scene: SceneId, beat: number): number {
  return Math.max(0, Math.min(beat, BEAT_COUNTS[scene] - 1));
}

function claimText(
  claimId: EggMimicryClaimId,
  scene: SceneId,
  language: Language,
): string {
  const claim: EggMimicryClaim = EGG_MIMICRY_CLAIMS[claimId];
  return claim.visibleByScene[scene]?.[language] ?? "";
}

function PixelEgg({
  variant,
  label,
  staticSprite = false,
}: {
  variant: EggVariant;
  label: string;
  staticSprite?: boolean;
}) {
  const colors = EGG_COLORS[variant];
  return (
    <figure
      className={styles.pixelEgg}
      data-pixel-egg={variant}
      data-static-generation-sprite={staticSprite ? "true" : undefined}
      style={
        {
          "--egg-shell": colors.shell,
          "--egg-mark": colors.mark,
        } as CSSProperties
      }
    >
      <svg
        viewBox="0 0 100 132"
        role="img"
        aria-label={label}
        shapeRendering="crispEdges"
      >
        <polygon
          className={styles.eggShell}
          points="47,4 61,10 70,21 78,42 83,67 81,91 74,111 62,124 48,128 34,123 23,110 17,90 17,65 23,42 31,21 39,10"
        />
        <polygon
          className={styles.eggHighlight}
          points="39,17 49,10 52,16 43,35 33,55 28,54 31,35"
        />
        {EGG_TILES[variant].map(([x, y, width, height], index) => (
          <rect
            className={styles.eggMark}
            key={`${variant}-${index}`}
            x={x}
            y={y}
            width={width}
            height={height}
          />
        ))}
        <rect className={styles.eggPixelEdge} x="39" y="10" width="22" height="4" />
        <rect className={styles.eggPixelEdge} x="21" y="64" width="4" height="25" />
        <rect className={styles.eggPixelEdge} x="75" y="64" width="4" height="25" />
        <rect className={styles.eggPixelEdge} x="40" y="119" width="20" height="4" />
      </svg>
      <figcaption>{label}</figcaption>
    </figure>
  );
}

function PixelNest({ copy, beat }: { copy: TopicCopy; beat: number }) {
  const spriteState =
    beat === 0 ? "watch" : beat === 1 ? "foreign" : beat === 2 ? "protocol" : "fork";
  return (
    <div
      className={styles.pixelNest}
      data-pixel-nest="true"
      data-sprite-state={spriteState}
      data-pixel-fps="8"
    >
      <svg viewBox="0 0 240 150" aria-hidden="true" shapeRendering="crispEdges">
        <rect className={styles.nestStickDark} x="22" y="98" width="186" height="13" />
        <rect className={styles.nestStick} x="36" y="78" width="156" height="12" />
        <rect className={styles.nestStickDark} x="52" y="62" width="124" height="12" />
        <rect className={styles.nestStick} x="20" y="111" width="199" height="12" />
        <rect className={styles.nestStickDark} x="64" y="125" width="102" height="9" />
        <rect className={styles.nestStick} x="82" y="49" width="74" height="10" />
        <rect className={styles.nestStickDark} x="29" y="88" width="23" height="9" />
        <rect className={styles.nestStickDark} x="186" y="88" width="23" height="9" />
      </svg>
      <div className={styles.nestEggs}>
        <PixelEgg variant="host" label={copy.sceneTwo.hostLabel} />
        <PixelEgg variant="host" label={copy.sceneTwo.hostLabel} />
        <PixelEgg variant="cuckoo" label={copy.sceneTwo.cuckooLabel} />
      </div>
    </div>
  );
}

function SceneLead({
  copy,
  scene,
}: {
  copy: TopicCopy;
  scene: SceneId;
}) {
  const sceneCopy = copy.scenes[scene];
  return (
    <header className={styles.sceneLead} data-beat-layout-item="true">
      <p className={styles.kicker}>{sceneCopy.kicker}</p>
      <h1>{sceneCopy.title}</h1>
      <p className={styles.deck}>{sceneCopy.deck}</p>
    </header>
  );
}

function BeatSlot({
  visible,
  label,
  children,
}: {
  visible: boolean;
  label: string;
  children: string;
}) {
  return (
    <div
      className={[styles.beatSlot, visible ? styles.beatSlotVisible : ""]
        .filter(Boolean)
        .join(" ")}
      data-beat-layout-item="true"
      data-beat-visible={visible ? "true" : "false"}
      aria-hidden={!visible}
    >
      <span>{label}</span>
      <p>{children}</p>
    </div>
  );
}

function SourceRail({
  copy,
  language,
  scene,
}: {
  copy: TopicCopy;
  language: Language;
  scene: SceneId;
}) {
  const sourceLinksRef = useNativeTouchBoundary<HTMLParagraphElement>();
  const claimIds: readonly EggMimicryClaimId[] = EGG_MIMICRY_SCENE_CLAIMS[scene];
  const sourceIds = EGG_MIMICRY_SOURCES.filter((source) => {
    const sourceClaimIds: readonly EggMimicryClaimId[] = source.claimIds;
    return claimIds.some((claimId) => sourceClaimIds.includes(claimId));
  }).map((source) => source.id);
  const claimSourceMap = claimIds
    .map(
      (claimId) =>
        `${claimId}:${EGG_MIMICRY_CLAIMS[claimId].sourceIds.join(",")}`,
    )
    .join(";");

  return (
    <footer
      className={styles.sourceRail}
      data-beat-layout-item="true"
      data-claim-source-map="true"
      data-scene-id={scene}
      data-claim-ids={claimIds.join(" ")}
      data-source-ids={sourceIds.join(" ")}
      data-claim-source-links={claimSourceMap}
    >
      <span>{copy.sourceLabel}</span>
      <p
        ref={sourceLinksRef}
        data-source-link-container="true"
        data-native-touch-isolation="capture"
      >
        {sourceIds.map((sourceId, index) => {
          const source = EGG_MIMICRY_SOURCES.find(
            (candidate) => candidate.id === sourceId,
          );
          if (!source) return null;
          return (
            <a
              data-source-id={source.id}
              href={source.url}
              key={source.id}
              onClick={(event) => event.stopPropagation()}
              onPointerDown={(event) => event.stopPropagation()}
              rel="noreferrer"
              target="_blank"
              title={source.title}
            >
              {index > 0 ? " · " : ""}
              {source.shortLabel[language]}
            </a>
          );
        })}
      </p>
    </footer>
  );
}

function OpeningScene({
  beat,
  copy,
  language,
}: {
  beat: number;
  copy: TopicCopy;
  language: Language;
}) {
  const scene: SceneId = 1;
  return (
    <section
      className={[styles.scene, styles.openingScene].join(" ")}
      data-composition="cold-open-nest"
      data-beat-layout-container="true"
      data-beat-layout-mode="reserved"
      data-visible-claim-ids={EGG_MIMICRY_SCENE_CLAIMS[scene].join(" ")}
    >
      <SceneLead copy={copy} scene={scene} />
      <div className={styles.openingArena} data-beat-layout-item="true">
        <PixelNest beat={beat} copy={copy} />
        <aside className={styles.thresholdPanel}>
          <p>{copy.thresholdLabel}</p>
          <div className={styles.thresholdTicks} aria-hidden="true">
            <i />
            <i />
            <i />
            <i />
            <b />
          </div>
          <span>{copy.noScoreLabel}</span>
        </aside>
      </div>
      <div className={styles.openingSlots}>
        <BeatSlot visible={beat >= 1} label="01 / INPUT">
          {copy.sceneOne.foreignEgg}
        </BeatSlot>
        <BeatSlot visible={beat >= 2} label="02 / STUDY">
          {claimText("apaj-field-protocol", scene, language)}
        </BeatSlot>
        <BeatSlot visible={beat >= 2} label="03 / CONDITION">
          {claimText("colour-gradient-response", scene, language)}
        </BeatSlot>
        <BeatSlot visible={beat >= 3} label="04 / RULE">
          {copy.sceneOne.threshold}
        </BeatSlot>
      </div>
      <SourceRail copy={copy} language={language} scene={scene} />
    </section>
  );
}

function ComparisonScene({
  copy,
  language,
}: {
  copy: TopicCopy;
  language: Language;
}) {
  const scene: SceneId = 2;
  return (
    <section
      className={[styles.scene, styles.comparisonScene].join(" ")}
      data-composition="pattern-comparison"
      data-beat-layout-container="true"
      data-beat-layout-mode="reserved"
      data-visible-claim-ids={EGG_MIMICRY_SCENE_CLAIMS[scene].join(" ")}
    >
      <SceneLead copy={copy} scene={scene} />
      <div
        className={styles.comparisonField}
        data-beat-layout-item="true"
        data-pattern-morph="hard-cut"
        data-pixel-fps="12"
      >
        <div className={styles.hostRange}>
          <span>{copy.sceneTwo.hostLabel}</span>
          <div>
            <PixelEgg variant="blue" label={copy.sceneTwo.hostLabel} />
            <PixelEgg variant="host" label={copy.sceneTwo.hostLabel} />
            <PixelEgg variant="brown" label={copy.sceneTwo.hostLabel} />
          </div>
        </div>
        <div className={styles.compareArrow} aria-hidden="true">
          <i />
          <i />
          <i />
        </div>
        <div className={styles.cuckooCandidate}>
          <span>{copy.sceneTwo.cuckooLabel}</span>
          <PixelEgg variant="cuckoo" label={copy.sceneTwo.cuckooLabel} />
          <p>{copy.sceneTwo.noPerfectScore}</p>
        </div>
      </div>
      <div className={styles.comparisonFacts}>
        <p data-beat-layout-item="true">
          {claimText("colour-gradient-response", scene, language)}
        </p>
        <p data-beat-layout-item="true">
          {claimText("within-population-matching", scene, language)}
        </p>
        <span data-beat-layout-item="true">{copy.sceneTwo.comparisonLabel}</span>
      </div>
      <SourceRail copy={copy} language={language} scene={scene} />
    </section>
  );
}

function DecisionScene({
  beat,
  copy,
  language,
}: {
  beat: number;
  copy: TopicCopy;
  language: Language;
}) {
  const scene: SceneId = 3;
  return (
    <section
      className={[styles.scene, styles.decisionScene].join(" ")}
      data-composition="decision-rule-panel"
      data-beat-layout-container="true"
      data-beat-layout-mode="reserved"
      data-visible-claim-ids={EGG_MIMICRY_SCENE_CLAIMS[scene].join(" ")}
    >
      <SceneLead copy={copy} scene={scene} />
      <div className={styles.decisionBoard} data-beat-layout-item="true">
        <article className={[styles.decisionCard, styles.acceptCard].join(" ")}>
          <span>01 / {copy.sceneThree.acceptLabel}</span>
          <PixelEgg variant="cuckoo" label={copy.sceneTwo.cuckooLabel} />
          <h2>{copy.sceneThree.acceptLabel}</h2>
          <p>{copy.sceneThree.acceptBody}</p>
        </article>
        <div className={styles.ruleDivider} aria-hidden="true">
          <i />
          <b>?</b>
          <i />
        </div>
        <article
          className={[
            styles.decisionCard,
            styles.ejectCard,
            beat >= 1 ? styles.decisionCardVisible : "",
          ]
            .filter(Boolean)
            .join(" ")}
          data-beat-layout-item="true"
          data-beat-visible={beat >= 1 ? "true" : "false"}
          aria-hidden={beat < 1}
        >
          <span>02 / {copy.sceneThree.ejectLabel}</span>
          <PixelEgg variant="threshold" label={copy.sceneThree.errorLabel} />
          <h2>{copy.sceneThree.ejectLabel}</h2>
          <p>{copy.sceneThree.ejectBody}</p>
        </article>
      </div>
      <p className={styles.decisionEvidence} data-beat-layout-item="true">
        {claimText("recognition-error-cost", scene, language)}
      </p>
      <SourceRail copy={copy} language={language} scene={scene} />
    </section>
  );
}

function GenerationScene({
  beat,
  copy,
  language,
  motionDisabled,
}: {
  beat: number;
  copy: TopicCopy;
  language: Language;
  motionDisabled: boolean;
}) {
  const scene: SceneId = 4;
  const advanced = beat >= 1;
  return (
    <section
      className={[styles.scene, styles.generationScene].join(" ")}
      data-composition="generation-sprite-loop"
      data-beat-layout-container="true"
      data-beat-layout-mode="reserved"
      data-visible-claim-ids={EGG_MIMICRY_SCENE_CLAIMS[scene].join(" ")}
      data-generation-mode={motionDisabled ? "static" : advanced ? "stepped" : "ready"}
    >
      <SceneLead copy={copy} scene={scene} />
      <div
        className={[
          styles.generationBoard,
          advanced ? styles.generationBoardAdvanced : "",
          motionDisabled ? styles.generationBoardStatic : "",
        ]
          .filter(Boolean)
          .join(" ")}
        data-beat-layout-item="true"
        data-pattern-morph="hard-cut"
        data-pixel-fps={motionDisabled ? "static" : "8-12"}
      >
        <div className={styles.generationCaption}>
          <span>{copy.sceneFour.schemeLabel}</span>
          <b>{copy.sceneFour.staticLabel}</b>
        </div>
        <div className={styles.generationSprites}>
          {(["host", "cuckoo", "threshold"] as const).map((variant, index) => (
            <div className={styles.generationSprite} key={variant}>
              <PixelEgg
                variant={variant}
                label={copy.sceneFour.generations[index]}
                staticSprite
              />
              <span>{copy.sceneFour.generations[index]}</span>
            </div>
          ))}
        </div>
        <div className={styles.reflowMeter} aria-label={copy.sceneFour.reflowLabel}>
          <span>{copy.sceneFour.reflowLabel}</span>
          <div>
            <i />
            <i />
            <i />
            <b />
          </div>
        </div>
      </div>
      <div className={styles.generationFacts}>
        <p data-beat-layout-item="true">
          {claimText("within-population-matching", scene, language)}
        </p>
        <p
          className={advanced ? styles.generationFactVisible : styles.generationFactHidden}
          data-beat-layout-item="true"
          data-beat-visible={advanced ? "true" : "false"}
          aria-hidden={!advanced}
        >
          {claimText("arms-race-boundary", scene, language)}
        </p>
      </div>
      <SourceRail copy={copy} language={language} scene={scene} />
    </section>
  );
}

function BoundaryScene({
  copy,
  language,
}: {
  copy: TopicCopy;
  language: Language;
}) {
  const scene: SceneId = 5;
  return (
    <section
      className={[styles.scene, styles.boundaryScene].join(" ")}
      data-composition="continuation-boundary-screen"
      data-beat-layout-container="true"
      data-beat-layout-mode="reserved"
      data-visible-claim-ids={EGG_MIMICRY_SCENE_CLAIMS[scene].join(" ")}
    >
      <SceneLead copy={copy} scene={scene} />
      <div className={styles.boundaryField} data-beat-layout-item="true">
        <section className={styles.dependenciesPanel}>
          <p>{copy.sceneFive.dependencyLabel}</p>
          <ol>
            {copy.sceneFive.dependencies.map((dependency, index) => (
              <li key={dependency}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                {dependency}
              </li>
            ))}
          </ol>
        </section>
        <section className={styles.continuePanel}>
          <p>{copy.sceneFive.continueLabel}</p>
          <strong>ARMS RACE CONTINUES</strong>
          <span>{copy.sceneFive.boundaryLabel}</span>
        </section>
      </div>
      <p className={styles.boundaryEvidence} data-beat-layout-item="true">
        {claimText("arms-race-boundary", scene, language)}
      </p>
      <SourceRail copy={copy} language={language} scene={scene} />
    </section>
  );
}

function ScenePage({
  scene,
  beat,
  language,
  motionDisabled,
}: {
  scene: SceneId;
  beat: number;
  language: Language;
  motionDisabled: boolean;
}) {
  const copy = COPY[language];
  if (scene === 1) return <OpeningScene beat={beat} copy={copy} language={language} />;
  if (scene === 2) return <ComparisonScene copy={copy} language={language} />;
  if (scene === 3) return <DecisionScene beat={beat} copy={copy} language={language} />;
  if (scene === 4) {
    return (
      <GenerationScene
        beat={beat}
        copy={copy}
        language={language}
        motionDisabled={motionDisabled}
      />
    );
  }
  return <BoundaryScene copy={copy} language={language} />;
}

function NestMapNavigation({
  copy,
  scene,
  onNavigate,
}: {
  copy: TopicCopy;
  scene: SceneId;
  onNavigate?: (scene: number, beat: number) => void;
}) {
  const navRef = useNativeTouchBoundary<HTMLElement>();

  const navigate = (target: SceneId) => {
    onNavigate?.(target, 0);
  };

  const stopPointer = (event: PointerEvent<HTMLButtonElement>) => {
    event.stopPropagation();
  };

  const handleClick = (
    event: MouseEvent<HTMLButtonElement>,
    target: SceneId,
  ) => {
    event.preventDefault();
    event.stopPropagation();
    navigate(target);
  };

  const handleKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    current: SceneId,
  ) => {
    event.stopPropagation();
    if (event.repeat) {
      event.preventDefault();
      return;
    }

    let target: SceneId | null = null;
    if (event.key === "Enter" || event.key === " " || event.key === "Spacebar") {
      target = current;
    } else if (event.key === "ArrowRight" || event.key === "ArrowDown") {
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
    navigate(target);
  };

  return (
    <nav
      ref={navRef}
      className={styles.nestMap}
      aria-label={copy.nestMapLabel}
      data-topic-navigation="true"
      data-navigation-geometry="spatial-node"
      data-navigation-carrier="nest-map"
      data-navigation-invocation="keyboard-focus"
      data-navigation-feedback="geometry-reflow"
      data-nest-map="true"
      data-geometry-reflow="true"
      data-native-touch-isolation="capture"
    >
      <span className={styles.nestMapLabel}>{copy.nestMapLabel}</span>
      <div className={styles.nestMapRing} aria-hidden="true" />
      {SCENE_IDS.map((sceneId) => {
        const active = sceneId === scene;
        const position = NEST_MAP_LAYOUTS[scene][sceneId];
        return (
          <button
            type="button"
            key={sceneId}
            aria-current={active ? "page" : undefined}
            aria-label={`${copy.openNode} ${sceneId}: ${copy.scenes[sceneId].navAria}`}
            className={[styles.nestNode, active ? styles.nestNodeActive : ""]
              .filter(Boolean)
              .join(" ")}
            data-nest-node={sceneId}
            data-active={active ? "true" : "false"}
            onClick={(event) => handleClick(event, sceneId)}
            onKeyDown={(event) => handleKeyDown(event, sceneId)}
            onPointerDown={stopPointer}
            style={
              {
                "--node-x": `${position.x}%`,
                "--node-y": `${position.y}%`,
              } as CSSProperties
            }
          >
            <b>{String(sceneId).padStart(2, "0")}</b>
            <span>{copy.scenes[sceneId].nav}</span>
          </button>
        );
      })}
    </nav>
  );
}

export function getMetadata(language: Language): StyleMetadata {
  const copy = COPY[language];
  return {
    id: "arcade-boss-fight",
    band: "contemporary-digital",
    name: language === "zh" ? "街机 Boss 战" : "Arcade Boss Fight",
    theme: language === "zh" ? "普通杜鹃与大苇莺的卵拟态" : "Egg Mimicry: Cuckoo and Great Reed Warbler",
    densityLabel: language === "zh" ? "像素研究面板" : "Pixel Research Panel",
    heroScene: 4,
    colors: {
      bg: "#070914",
      ink: "#edf7df",
      panel: "#15243b",
    },
    typography: {
      header: "monospace 800",
      body: "monospace 600",
    },
    tags: [
      "arcade",
      "pixel",
      "egg-mimicry",
      "common-cuckoo",
      "great-reed-warbler",
      "behavioural-ecology",
      "research-boundary",
      "spatial-navigation",
    ],
    fonts: ["monospace", "cjk:PingFang SC"],
    scenes: SCENE_IDS.map((sceneId) => ({
      id: sceneId,
      title: copy.scenes[sceneId].section,
      beats: copy.scenes[sceneId].beats.map((beat, beatId) => ({
        id: beatId,
        action: beat.action,
        title: beat.title,
        body: beat.body,
      })),
    })),
  };
}

export default function EggMimicry({
  scene,
  beat,
  language,
  isThumbnail,
  reducedMotion,
  onNavigate,
}: BespokeStyleProps) {
  const activeScene = normalizeScene(scene);
  const activeBeat = clampBeat(activeScene, beat);
  const motionDisabled = reducedMotion || isThumbnail;

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
      data-topic-id="egg-mimicry"
      data-style-id="arcade-boss-fight"
      data-motion={motionDisabled ? "off" : "pixel-step"}
      data-pixel-fps={motionDisabled ? "static" : "8-12"}
      data-pixel-art="original"
    >
      <div className={styles.trackShell}>
        <SpatialSceneTrack
          className={styles.track}
          scene={activeScene}
          beat={activeBeat}
          transitionKind="push-x"
          transitionMap={TRANSITION_MAP}
          transitionModifier="egg-mimicry"
          transitionDurationMs={620}
          reducedMotion={motionDisabled}
          beatLayoutModes={BEAT_LAYOUT_MODES}
          renderScene={(sceneId, sceneBeat, isActive) => {
            const renderedScene = normalizeScene(sceneId);
            return (
              <div className={styles.sceneLayer} data-scene-content={renderedScene}>
                <ScenePage
                  scene={renderedScene}
                  beat={clampBeat(renderedScene, sceneBeat)}
                  language={language}
                  motionDisabled={motionDisabled || !isActive}
                />
              </div>
            );
          }}
        />
      </div>
      {!isThumbnail && (
        <NestMapNavigation
          copy={COPY[language]}
          scene={activeScene}
          onNavigate={onNavigate}
        />
      )}
    </div>
  );
}

export const eggMimicryTopic = defineStyleTopic({
  id: "egg-mimicry",
  topic: { en: "Egg Mimicry", zh: "卵拟态" },
  model: "GPT-5.6 Terra/Max",
  component: EggMimicry,
  getMetadata,
  navigation: {
    geometry: "spatial-node",
    carrier: "nest-map",
    invocation: "keyboard-focus",
    feedback: "geometry-reflow",
  },
  sources: EGG_MIMICRY_SOURCES,
  transitionScore: EGG_MIMICRY_TRANSITION_SCORE,
});

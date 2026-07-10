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
import styles from "./magazine-masthead-moth-experiment.module.css";

type Language = BespokeStyleProps["language"];
type SceneId = 1 | 2 | 3 | 4 | 5;
type MothVariant = "pale" | "dark";

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
  headline: string;
  deck: string;
  beats: readonly BeatCopy[];
}

interface MethodCardCopy {
  number: string;
  title: string;
  body: string;
}

interface CritiqueRowCopy {
  label: string;
  title: string;
  body: string;
}

interface MothExperimentCopy {
  masthead: string;
  issueLine: string;
  folio: string;
  sourceLabel: string;
  specimensLabel: string;
  openSpecimen: string;
  scenes: Record<SceneId, SceneCopy>;
  cover: {
    paleLabel: string;
    darkLabel: string;
    paleNote: string;
    darkNote: string;
    beatLine: string;
  };
  method: {
    stageLabel: string;
    pointerLabel: string;
    cards: readonly [MethodCardCopy, MethodCardCopy, MethodCardCopy, MethodCardCopy];
    note: string;
  };
  evidence: {
    observationLabel: string;
    frequencyLabel: string;
    contextLabel: string;
    entries: readonly [
      { date: string; title: string; body: string },
      { date: string; title: string; body: string },
      { date: string; title: string; body: string },
    ];
    boundary: string;
  };
  critique: {
    rows: readonly [CritiqueRowCopy, CritiqueRowCopy, CritiqueRowCopy];
    boundary: string;
  };
  close: {
    proves: string;
    provesItems: readonly [string, string, string];
    notProves: string;
    notProvesItems: readonly [string, string, string];
    closing: string;
  };
}

const SCENE_IDS: readonly SceneId[] = [1, 2, 3, 4, 5];
const BEAT_COUNTS: Record<SceneId, number> = {
  1: 2,
  2: 4,
  3: 1,
  4: 3,
  5: 1,
};

export const MOTH_EXPERIMENT_TRANSITION_SCORE = {
  "1->2": "iris-open",
  "2->3": "crossfade",
  "3->4": "focus-swap",
  "4->5": "iris-open",
} as const satisfies TopicTransitionScore;

const TRANSITION_MAP: SceneTransitionMap = MOTH_EXPERIMENT_TRANSITION_SCORE;

const BEAT_LAYOUT_MODES: Partial<Record<SceneId, BeatLayoutMode>> = {
  1: "reserved",
  2: "reserved",
  3: "reserved",
  4: "reserved",
  5: "reserved",
};

export type MothExperimentSourceId =
  | "kettlewell-1955"
  | "majerus-cook-2012"
  | "nhm-frequency-overview"
  | "cook-saccheri-2013-review";

export type MothExperimentClaimId =
  | "background-predation-field-test"
  | "historical-frequency-shift"
  | "method-design-caveats"
  | "majerus-six-year-replication"
  | "bounded-selection-inference";

type LocalizedClaimFragment = Readonly<Record<Language, string>>;

export interface MothExperimentClaim {
  id: MothExperimentClaimId;
  sourceIds: readonly MothExperimentSourceId[];
  visibleByScene: Readonly<
    Partial<Record<SceneId, LocalizedClaimFragment>>
  >;
}

export const MOTH_EXPERIMENT_CLAIMS = {
  "background-predation-field-test": {
    id: "background-predation-field-test",
    sourceIds: ["kettlewell-1955", "cook-saccheri-2013-review"],
    visibleByScene: {
      1: {
        en: "linked tests of predation, background matching, and changing morph frequency",
        zh: "相互连接的检验：捕食、背景匹配与形态频率变化",
      },
      2: {
        en: "whether the more conspicuous resting form was removed more often",
        zh: "更显眼的停栖形态是否更常被移除",
      },
      5: {
        en: "background-dependent predation mechanism",
        zh: "依赖背景的捕食机制",
      },
    },
  },
  "historical-frequency-shift": {
    id: "historical-frequency-shift",
    sourceIds: ["nhm-frequency-overview", "cook-saccheri-2013-review"],
    visibleByScene: {
      3: {
        en: "98% dark form in industrial Manchester",
        zh: "工业曼彻斯特报告 98% 为深色形态",
      },
      5: {
        en: "Frequency observations gain force when linked to field experiments",
        zh: "频率观察在连接到野外实验和其假设后",
      },
    },
  },
  "method-design-caveats": {
    id: "method-design-caveats",
    sourceIds: ["majerus-cook-2012", "cook-saccheri-2013-review"],
    visibleByScene: {
      4: {
        en: "inflated release density, tree-trunk placement",
        zh: "释放密度、树干摆放",
      },
      5: {
        en: "Critique can improve a design without erasing the question",
        zh: "批评可以改进设计，而不必抹除原问题",
      },
    },
  },
  "majerus-six-year-replication": {
    id: "majerus-six-year-replication",
    sourceIds: ["majerus-cook-2012", "cook-saccheri-2013-review"],
    visibleByScene: {
      4: {
        en: "4,864 releases over six years",
        zh: "六年中完成 4,864 次释放",
      },
    },
  },
  "bounded-selection-inference": {
    id: "bounded-selection-inference",
    sourceIds: ["cook-saccheri-2013-review"],
    visibleByScene: {
      1: {
        en: "One image can illustrate a hypothesis. It cannot carry the whole inference.",
        zh: "一张图可以说明假设，不能独自承担整条推断。",
      },
      2: {
        en: "not a universal explanation by themselves",
        zh: "并非独自解释一切的万能答案",
      },
      3: {
        en: "not a controlled causal result",
        zh: "不是受控因果结果",
      },
      4: {
        en: "not a morality play",
        zh: "不是道德剧",
      },
      5: {
        en: "Visual predation is the whole of evolution.",
        zh: "视觉捕食就是演化的全部。",
      },
    },
  },
} as const satisfies Record<MothExperimentClaimId, MothExperimentClaim>;

export const MOTH_EXPERIMENT_SCENE_CLAIMS = {
  1: ["background-predation-field-test", "bounded-selection-inference"],
  2: ["background-predation-field-test", "bounded-selection-inference"],
  3: ["historical-frequency-shift", "bounded-selection-inference"],
  4: [
    "method-design-caveats",
    "majerus-six-year-replication",
    "bounded-selection-inference",
  ],
  5: [
    "background-predation-field-test",
    "historical-frequency-shift",
    "method-design-caveats",
    "bounded-selection-inference",
  ],
} as const satisfies Record<SceneId, readonly MothExperimentClaimId[]>;

export interface MothExperimentSource extends TopicSource {
  id: MothExperimentSourceId;
  citation: string;
  boundary: string;
  claimIds: readonly MothExperimentClaimId[];
  shortLabel: Readonly<Record<Language, string>>;
}

export const MOTH_EXPERIMENT_SOURCES = [
  {
    id: "kettlewell-1955",
    claimIds: ["background-predation-field-test"],
    shortLabel: { en: "Kettlewell 1955", zh: "Kettlewell 1955" },
    authority: "Heredity / Springer Nature",
    title: "Selection experiments on industrial melanism in the Lepidoptera",
    citation:
      "Kettlewell, H. B. D. (1955). Selection experiments on industrial melanism in the Lepidoptera. Heredity, 9, 323–342. https://doi.org/10.1038/hdy.1955.36.",
    url: "https://www.nature.com/articles/hdy195536",
    supports:
      "Supports the early field-experiment frame: Kettlewell set out to test background advantage, whether visually hunting birds ate resting moths, and whether differently conspicuous forms were taken selectively.",
    boundary:
      "This original experiment is evidence about its own release, observation, and recapture designs. It does not by itself establish every later population-frequency pattern or exclude every other evolutionary process.",
  },
  {
    id: "majerus-cook-2012",
    claimIds: ["method-design-caveats", "majerus-six-year-replication"],
    shortLabel: { en: "Cook et al. 2012", zh: "Cook 2012" },
    authority: "The Royal Society / Biology Letters",
    title: "Selective bird predation on the peppered moth: the last experiment of Michael Majerus",
    citation:
      "Cook, L. M., Grant, B. S., Saccheri, I. J., & Mallet, J. (2012). Selective bird predation on the peppered moth: the last experiment of Michael Majerus. Biology Letters, 8, 609–612. https://doi.org/10.1098/rsbl.2011.1136.",
    url: "https://royalsocietypublishing.org/doi/10.1098/rsbl.2011.1136",
    supports:
      "Supports the later six-year field test: 4,864 moths were released at low, naturalistic density on substrates documented as normal resting sites; the study reported stronger bird predation against melanics at its unpolluted site.",
    boundary:
      "The result strengthens a camouflage-and-predation mechanism under that study's site and design. It is not a claim that visual predation alone explains every historical frequency change everywhere.",
  },
  {
    id: "nhm-frequency-overview",
    claimIds: ["historical-frequency-shift"],
    shortLabel: { en: "NHM London", zh: "NHM London" },
    authority: "Natural History Museum, London",
    title: "Rainbow nature: life in bold black and white — Peppered moth",
    citation:
      "Natural History Museum, London. Rainbow nature: life in bold black and white — Peppered moth (Biston betularia).",
    url: "https://www.nhm.ac.uk/discover/rainbow-nature-life-in-black-and-white.html",
    supports:
      "Supports the morphology and historical-frequency context printed in the evidence file: light typica, dark carbonaria, the 1848 Manchester record, a 98% dark-form report for industrial Manchester in 1895, and later recovery of the lighter form after cleaner air.",
    boundary:
      "This Museum overview summarizes historical observation and environmental context. It is not a controlled predation experiment and should not be read as an isolated causal test.",
  },
  {
    id: "cook-saccheri-2013-review",
    claimIds: [
      "background-predation-field-test",
      "historical-frequency-shift",
      "method-design-caveats",
      "majerus-six-year-replication",
      "bounded-selection-inference",
    ],
    shortLabel: {
      en: "Cook & Saccheri 2013",
      zh: "Cook 2013",
    },
    authority: "Heredity / Springer Nature",
    title: "The peppered moth and industrial melanism: evolution of a natural selection case study",
    citation:
      "Cook, L. M., & Saccheri, I. J. (2013). The peppered moth and industrial melanism: evolution of a natural selection case study. Heredity, 110, 207–212. https://doi.org/10.1038/hdy.2012.92.",
    url: "https://www.nature.com/articles/hdy201292",
    supports:
      "Supports the review-level distinction between geographic and temporal frequency evidence, earlier mark–recapture and predation studies, their methodological caveats, and the later controlled field work.",
    boundary:
      "This review synthesizes a case study; it does not make a single photograph, a single release, or an individual researcher into the whole evidentiary history of industrial melanism.",
  },
] as const satisfies readonly MothExperimentSource[];

const COPY: Record<Language, MothExperimentCopy> = {
  en: {
    masthead: "THE FIELD NOTE",
    issueLine: "EVIDENCE ISSUE · BISTON BETULARIA · 1955–2012",
    folio: "VOL. XIX / FIELD COPY",
    sourceLabel: "Source trace",
    specimensLabel: "Specimen cards",
    openSpecimen: "Open specimen card",
    scenes: {
      1: {
        nav: "cover",
        navAria: "cover specimens",
        section: "Cover evidence",
        kicker: "INDUSTRIAL MELANISM / A CASE REOPENED",
        headline: "THE EXPERIMENT,\nREOPENED",
        deck: "A famous case becomes more useful when it is read as linked tests of predation, background matching, and changing morph frequency—not as one staged tree-trunk image.",
        beats: [
          {
            action: "Set the two morphs as evidence specimens, not before-and-after mascots.",
            title: "The experiment, reopened",
            body: "Begin with variation: pale typica and dark carbonaria are two forms in one population.",
          },
          {
            action: "Add the editorial claim that the case is a chain of tests.",
            title: "A chain, not a picture",
            body: "The claim has to connect background, bird predation, and population frequency across more than one design.",
          },
        ],
      },
      2: {
        nav: "method",
        navAria: "field method",
        section: "Method spread",
        kicker: "FIELD DESIGN / WHAT THE TEST ACTUALLY ASKS",
        headline: "A PREDATOR TEST\nHAS FOUR PARTS",
        deck: "The early field work used releases and recovery records to ask whether the more conspicuous resting form was removed more often. Each step limits the next claim.",
        beats: [
          {
            action: "State the predation-and-background hypothesis in a fixed first slot.",
            title: "Question",
            body: "Does visual predation differ when a morph mismatches its resting background?",
          },
          {
            action: "Reveal the marked release step without moving the reading grid.",
            title: "Release",
            body: "Light and dark forms enter a field setting as marked experimental moths.",
          },
          {
            action: "Reveal the observed resting and predation route in its reserved column.",
            title: "Observe",
            body: "Background contrast and bird attack are the proposed mechanism, not decoration.",
          },
          {
            action: "Reveal recovery comparison and its inference limit.",
            title: "Compare",
            body: "Relative recovery carries a testable signal; it is not the same as a posed photograph.",
          },
        ],
      },
      3: {
        nav: "evidence",
        navAria: "frequency evidence",
        section: "Frequency file",
        kicker: "HISTORICAL OBSERVATION / KEEP THE SCALE VISIBLE",
        headline: "FREQUENCY IS\nA POPULATION PATTERN",
        deck: "The observation record gives the case its time scale. It shows changing form frequencies in environmental context; it does not independently perform the predation experiment.",
        beats: [
          {
            action: "Hold a static evidence file with dates, a local frequency report, and its causal boundary.",
            title: "A pattern with a boundary",
            body: "Historical frequency data provide context for the field tests but cannot substitute for them.",
          },
        ],
      },
      4: {
        nav: "margin",
        navAria: "method margin",
        section: "Method margin",
        kicker: "CRITIQUE / REVISION / EVIDENCE WEIGHT",
        headline: "THE METHOD\nGETS A MARGIN NOTE",
        deck: "The controversy was not a hero-versus-villain story. It asked whether placement, density, and behaviour made an experiment support more than its design could bear.",
        beats: [
          {
            action: "Set the early-study claim and the specific question it could address.",
            title: "What early work could show",
            body: "Birds could attack resting moths, and mismatch could matter under an experimental setup.",
          },
          {
            action: "Add procedural caveats as a margin note, not a takedown.",
            title: "What was questioned",
            body: "High densities, trunk placement, and released or reared moth behaviour could change the inference.",
          },
          {
            action: "Add the later field-design revision and its bounded result.",
            title: "What later work improved",
            body: "A six-year, 4,864-release study used low naturalistic density and normal substrates; at its unpolluted site, darker moths were removed more often.",
          },
        ],
      },
      5: {
        nav: "limits",
        navAria: "evidence limits",
        section: "Revised cover",
        kicker: "WHAT THIS CASE CAN CARRY / WHAT IT CANNOT",
        headline: "THE VALUE IS\nTHE TESTING",
        deck: "The peppered moth is strongest as a worked evidence chain: observation, experiment, critique, and better design. That is more durable than a single iconic image.",
        beats: [
          {
            action: "Settle the final specimen label with explicit evidentiary boundaries.",
            title: "Claim only what the chain supports",
            body: "The case tests one selection mechanism in context; it does not turn all evolution into a tree-trunk photograph.",
          },
        ],
      },
    },
    cover: {
      paleLabel: "typica / pale",
      darkLabel: "carbonaria / dark",
      paleNote: "light, speckled form",
      darkNote: "melanic form",
      beatLine: "One image can illustrate a hypothesis. It cannot carry the whole inference.",
    },
    method: {
      stageLabel: "THE FIELD SEQUENCE",
      pointerLabel: "reading step",
      cards: [
        {
          number: "01",
          title: "Hypothesis",
          body: "If birds hunt by sight, the less-matched morph should be more exposed at a resting background.",
        },
        {
          number: "02",
          title: "Release",
          body: "Marked light and dark moths are released into a field setting rather than compared in an illustration.",
        },
        {
          number: "03",
          title: "Observe",
          body: "Resting position, visibility, and attack matter because the mechanism is visual predation.",
        },
        {
          number: "04",
          title: "Recover",
          body: "Recapture differences are evidence within the design—not a universal explanation by themselves.",
        },
      ],
      note: "Only the reading marker moves; the four-step field design keeps its measured positions.",
    },
    evidence: {
      observationLabel: "observation",
      frequencyLabel: "reported frequency",
      contextLabel: "context shifts",
      entries: [
        {
          date: "1848",
          title: "Dark carbonaria recorded in Manchester",
          body: "A local historical observation, not a predation experiment.",
        },
        {
          date: "1895",
          title: "98% dark form in industrial Manchester",
          body: "A reported local frequency: powerful context, but not a controlled causal result.",
        },
        {
          date: "AFTER 1956",
          title: "The pale form regains ground as air becomes cleaner",
          body: "A reversal pattern to test against environmental and selection mechanisms.",
        },
      ],
      boundary: "The frequency file tells us that a population changed in context. It does not isolate bird predation from every possible contributor.",
    },
    critique: {
      rows: [
        {
          label: "EARLY CLAIM",
          title: "A workable mechanism",
          body: "Experiments and mark–recapture work linked moth visibility and bird predation under specific field conditions.",
        },
        {
          label: "METHOD QUESTION",
          title: "Does the setup resemble resting life?",
          body: "Critics focused on inflated release density, tree-trunk placement, and whether reared or released moths behaved naturally. That is a scope question, not a morality play.",
        },
        {
          label: "LATER REVISION",
          title: "A more naturalistic field test",
          body: "The later experiment used local morphs, low naturalistic density, normal substrates, 4,864 releases over six years, and found stronger bird predation against melanics at one unpolluted site.",
        },
      ],
      boundary: "Later field work strengthens the camouflage-and-predation explanation under its conditions. It does not turn every historical observation into one single-cause experiment.",
    },
    close: {
      proves: "THIS CASE CAN SUPPORT",
      provesItems: [
        "A visible phenotype can be tested against a background-dependent predation mechanism.",
        "Frequency observations gain force when linked to field experiments and their assumptions.",
        "Critique can improve a design without erasing the question it was built to test.",
      ],
      notProves: "THIS CASE DOES NOT SUPPORT",
      notProvesItems: [
        "A single photograph proves natural selection.",
        "Visual predation is the whole of evolution.",
        "Every historical frequency change has one cause, everywhere.",
      ],
      closing: "The lasting exhibit is not a moth on bark. It is the chain of observation, test, critique, and revision.",
    },
  },
  zh: {
    masthead: "田野证据志",
    issueLine: "证据专号 · BISTON BETULARIA · 1955–2012",
    folio: "第十九卷 / 田野本",
    sourceLabel: "来源线索",
    specimensLabel: "标本卡",
    openSpecimen: "打开标本卡",
    scenes: {
      1: {
        nav: "封面",
        navAria: "封面标本",
        section: "封面证据",
        kicker: "工业黑化 / 重新打开一个案例",
        headline: "重审\n桦尺蛾实验",
        deck: "这个著名案例更适合被读成一串相互连接的检验：捕食、背景匹配与形态频率变化，而不是一张摆在树干上的照片。",
        beats: [
          {
            action: "把两种形态作为证据标本摆上封面，而不是前后对比的吉祥物。",
            title: "重审实验",
            body: "从变异开始：浅色 typica 与深色 carbonaria 是同一群体里的两种形态。",
          },
          {
            action: "加入编辑判断：案例是一串检验，而不是一张图。",
            title: "一串证据，不是一张照片",
            body: "主张必须把背景、鸟类捕食和种群频率连接到不止一种研究设计上。",
          },
        ],
      },
      2: {
        nav: "方法",
        navAria: "野外方法",
        section: "方法跨页",
        kicker: "田野设计 / 这个检验究竟问什么",
        headline: "一次捕食检验\n有四个环节",
        deck: "早期野外工作用释放与再捕获记录，询问更显眼的停栖形态是否更常被移除。每一步都限定下一步可以说什么。",
        beats: [
          {
            action: "在稳定的第一格写下捕食与背景匹配假设。",
            title: "问题",
            body: "当形态与停栖背景不匹配时，视觉捕食是否不同？",
          },
          {
            action: "在不移动阅读网格的前提下显现标记释放步骤。",
            title: "释放",
            body: "浅色与深色形态作为带标记的实验个体进入野外环境。",
          },
          {
            action: "在预留栏位显现停栖和观察路径。",
            title: "观察",
            body: "背景对比度与鸟类攻击是待检验的机制，不是装饰。",
          },
          {
            action: "显现再捕获比较及其推断边界。",
            title: "比较",
            body: "相对再捕获率能在设计内部提供信号；它不等于一张摆拍照片。",
          },
        ],
      },
      3: {
        nav: "频率",
        navAria: "频率证据",
        section: "频率档案",
        kicker: "历史观察 / 把尺度留在画面上",
        headline: "频率是\n种群模式",
        deck: "观察记录给案例提供时间尺度：它说明形态频率在环境语境中发生变化，却不会独自完成一次捕食实验。",
        beats: [
          {
            action: "静态呈现日期、局部频率报告和因果边界。",
            title: "有边界的模式",
            body: "历史频率数据为野外检验提供语境，却不能替代野外检验。",
          },
        ],
      },
      4: {
        nav: "边注",
        navAria: "方法边注",
        section: "方法边注",
        kicker: "批评 / 修订 / 证据权重",
        headline: "方法需要\n一则边注",
        deck: "争议不是英雄对反派的故事。它追问的是：摆放、密度和行为，会不会让实验承受超过其设计能力的解释。",
        beats: [
          {
            action: "确定早期研究能够处理的具体问题。",
            title: "早期工作能说明什么",
            body: "鸟会攻击停栖的蛾；在实验设定内，不匹配可能影响暴露风险。",
          },
          {
            action: "把程序性保留写成边注，而不是打脸动画。",
            title: "哪些地方被追问",
            body: "高密度、树干摆放，以及饲养或释放个体的行为，都可能改变推断范围。",
          },
          {
            action: "加入后续野外设计改进与有边界的结果。",
            title: "后续工作改进了什么",
            body: "一项六年、4,864 次释放的研究使用低而自然的密度与正常基质；在其无污染地点，深色蛾更常被移除。",
          },
        ],
      },
      5: {
        nav: "边界",
        navAria: "证据边界",
        section: "修订封面",
        kicker: "这个案例能承载什么 / 不能承载什么",
        headline: "价值在于\n持续检验",
        deck: "桦尺蛾最有力之处，是一条可复查的证据链：观察、实验、批评与更好的设计。这比一张标志性照片更耐用。",
        beats: [
          {
            action: "以明确的证据边界固定最后一张标本标签。",
            title: "只说证据链支持的话",
            body: "案例在语境中检验一种选择机制；它不把所有演化压缩成一张树干照片。",
          },
        ],
      },
    },
    cover: {
      paleLabel: "typica / 浅色",
      darkLabel: "carbonaria / 深色",
      paleNote: "浅色、带斑点形态",
      darkNote: "黑化形态",
      beatLine: "一张图可以说明假设，不能独自承担整条推断。",
    },
    method: {
      stageLabel: "田野流程",
      pointerLabel: "阅读步骤",
      cards: [
        {
          number: "01",
          title: "假设",
          body: "如果鸟依靠视觉捕食，和停栖背景更不匹配的形态应该更容易暴露。",
        },
        {
          number: "02",
          title: "释放",
          body: "带标记的浅色与深色蛾进入田野环境，不是在插图中被并列比较。",
        },
        {
          number: "03",
          title: "观察",
          body: "停栖位置、可见性与攻击都重要，因为待检验机制是视觉捕食。",
        },
        {
          number: "04",
          title: "再捕获",
          body: "再捕获差异是在该设计内部的证据，并非独自解释一切的万能答案。",
        },
      ],
      note: "只有阅读标记移动；四个田野环节保持被测量过的固定位置。",
    },
    evidence: {
      observationLabel: "观察",
      frequencyLabel: "报告频率",
      contextLabel: "语境变化",
      entries: [
        {
          date: "1848",
          title: "深色 carbonaria 在曼彻斯特被记录",
          body: "一条局部历史观察，并非捕食实验。",
        },
        {
          date: "1895",
          title: "工业曼彻斯特报告 98% 为深色形态",
          body: "一项局部频率报告：语境很强，却不是受控因果结果。",
        },
        {
          date: "1956 年后",
          title: "空气变清洁后，浅色形态重新增加",
          body: "一种反转模式，可用来检验环境与选择机制之间的关系。",
        },
      ],
      boundary: "频率档案告诉我们种群在语境中变化；它不能把鸟类捕食同所有其他可能因素完全分离。",
    },
    critique: {
      rows: [
        {
          label: "早期主张",
          title: "一个可工作的机制",
          body: "实验与标记再捕获把蛾的可见性和鸟类捕食联系到具体野外条件中。",
        },
        {
          label: "方法追问",
          title: "设定像真实停栖生活吗？",
          body: "批评关注释放密度、树干摆放，以及饲养或释放个体是否会自然行为。这是范围问题，不是道德剧。",
        },
        {
          label: "后续修订",
          title: "更自然的野外检验",
          body: "后续研究使用当地形态、低而自然的密度、正常基质，在六年中完成 4,864 次释放；在一个无污染地点，鸟对深色形态的捕食更强。",
        },
      ],
      boundary: "后续野外工作在其条件下加强了背景匹配与捕食的解释，却不能把每一条历史观察变成单一原因的实验。",
    },
    close: {
      proves: "这个案例能够支持",
      provesItems: [
        "可见表型可以针对依赖背景的捕食机制进行检验。",
        "频率观察在连接到野外实验和其假设后，才获得更强解释力。",
        "批评可以改进设计，而不必抹除原问题。",
      ],
      notProves: "这个案例不能支持",
      notProvesItems: [
        "一张照片就证明自然选择。",
        "视觉捕食就是演化的全部。",
        "所有历史频率变化在任何地方都只有一个原因。",
      ],
      closing: "真正留下来的不是树皮上的一只蛾，而是观察、检验、批评与修订构成的链条。",
    },
  },
};

function normalizeScene(scene: number): SceneId {
  return SCENE_IDS.includes(scene as SceneId) ? (scene as SceneId) : 1;
}

function clampBeat(scene: SceneId, beat: number): number {
  return Math.max(0, Math.min(beat, BEAT_COUNTS[scene] - 1));
}

function DoubleRule() {
  return (
    <span className={styles.doubleRule} aria-hidden="true">
      <i />
      <i />
    </span>
  );
}

function MothSpecimen({ variant }: { variant: MothVariant }) {
  return (
    <svg
      className={styles.moth}
      data-variant={variant}
      viewBox="0 0 200 150"
      aria-hidden="true"
    >
      <path
        className={styles.mothWing}
        d="M96 74C73 29 30 22 20 45c-9 23 16 45 68 45l8-16Z"
      />
      <path
        className={styles.mothWing}
        d="M104 74c23-45 66-52 76-29 9 23-16 45-68 45l-8-16Z"
      />
      <path className={styles.mothHindWing} d="M92 84C57 89 43 113 59 127c18 15 40-4 42-31Z" />
      <path className={styles.mothHindWing} d="M108 84c35 5 49 29 33 43-18 15-40-4-42-31Z" />
      <path className={styles.mothBody} d="M94 46h12l8 58-14 28-14-28 8-58Z" />
      <path className={styles.mothLine} d="M95 47 78 27M105 47l17-20M72 41l16 17M128 41l-16 17" />
      <path className={styles.mothLine} d="M40 60c17 8 31 9 47 4M160 60c-17 8-31 9-47 4" />
      <circle className={styles.mothSpot} cx="62" cy="67" r="7" />
      <circle className={styles.mothSpot} cx="138" cy="67" r="7" />
      <circle className={styles.mothSpot} cx="77" cy="108" r="5" />
      <circle className={styles.mothSpot} cx="123" cy="108" r="5" />
    </svg>
  );
}

function PublicationHeader({ copy }: { copy: MothExperimentCopy }) {
  return (
    <header className={styles.publicationHeader}>
      <span>{copy.issueLine}</span>
      <div className={styles.mastheadWord}>
        <DoubleRule />
        <strong>{copy.masthead}</strong>
        <DoubleRule />
      </div>
      <span>{copy.folio}</span>
    </header>
  );
}

function SourceRail({
  label,
  language,
  scene,
}: {
  label: string;
  language: Language;
  scene: SceneId;
}) {
  const claimIds: readonly MothExperimentClaimId[] =
    MOTH_EXPERIMENT_SCENE_CLAIMS[scene];
  const sourceIds = MOTH_EXPERIMENT_SOURCES.filter((source) => {
    const sourceClaimIds: readonly MothExperimentClaimId[] = source.claimIds;
    return claimIds.some((claimId) => sourceClaimIds.includes(claimId));
  }).map((source) => source.id);
  const claimSourceMap = claimIds
    .map((claimId) => {
      const sourceIdsForClaim = MOTH_EXPERIMENT_CLAIMS[claimId].sourceIds;
      return `${claimId}:${sourceIdsForClaim.join(",")}`;
    })
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
      <span>{label}</span>
      <p>
        {sourceIds.map((sourceId, index) => {
          const source = MOTH_EXPERIMENT_SOURCES.find(
            (candidate) => candidate.id === sourceId,
          );
          return (
            <span data-source-id={sourceId} key={sourceId}>
              {index > 0 ? " · " : ""}
              {source?.shortLabel[language]}
            </span>
          );
        })}
      </p>
    </footer>
  );
}

function SpecimenTag({
  variant,
  label,
  note,
}: {
  variant: MothVariant;
  label: string;
  note: string;
}) {
  return (
    <figure className={styles.specimenTag} data-beat-layout-item="true">
      <span className={styles.pin} aria-hidden="true" />
      <MothSpecimen variant={variant} />
      <figcaption>
        <strong>{label}</strong>
        <span>{note}</span>
      </figcaption>
    </figure>
  );
}

function SceneLead({
  scene,
  className,
}: {
  scene: SceneCopy;
  className?: string;
}) {
  return (
    <header className={[styles.sceneLead, className].filter(Boolean).join(" ")}>
      <p className={styles.kicker}>{scene.kicker}</p>
      <h1>{scene.headline}</h1>
      <p className={styles.deck}>{scene.deck}</p>
    </header>
  );
}

function CoverScene({
  copy,
  beat,
  language,
}: {
  copy: MothExperimentCopy;
  beat: number;
  language: Language;
}) {
  const scene = copy.scenes[1];
  const revealed = beat >= 1;

  return (
    <article
      className={[styles.scene, styles.coverScene].join(" ")}
      data-composition="cover-specimen"
      data-visible-claim-ids={MOTH_EXPERIMENT_SCENE_CLAIMS[1].join(" ")}
      data-beat-layout-container="true"
      data-beat-layout-mode="reserved"
    >
      <SceneLead scene={scene} />
      <div className={styles.coverSpecimenPair}>
        <SpecimenTag
          variant="pale"
          label={copy.cover.paleLabel}
          note={copy.cover.paleNote}
        />
        <SpecimenTag
          variant="dark"
          label={copy.cover.darkLabel}
          note={copy.cover.darkNote}
        />
      </div>
      <p
        className={styles.coverBoundary}
        data-beat-layout-item="true"
        data-revealed={revealed ? "true" : "false"}
        aria-hidden={revealed ? undefined : true}
      >
        {copy.cover.beatLine}
      </p>
      <SourceRail label={copy.sourceLabel} language={language} scene={1} />
    </article>
  );
}

function MethodScene({
  copy,
  beat,
  language,
}: {
  copy: MothExperimentCopy;
  beat: number;
  language: Language;
}) {
  const scene = copy.scenes[2];
  const pointerStyle = {
    transform: `translateX(${beat * 22}cqw)`,
  } as CSSProperties;

  return (
    <article
      className={[styles.scene, styles.methodScene].join(" ")}
      data-composition="method-spread"
      data-visible-claim-ids={MOTH_EXPERIMENT_SCENE_CLAIMS[2].join(" ")}
      data-beat-layout-container="true"
      data-beat-layout-mode="reserved"
    >
      <SceneLead scene={scene} />
      <section className={styles.methodStage} data-beat-layout-item="true">
        <div className={styles.methodTopline}>
          <span>{copy.method.stageLabel}</span>
          <span>{copy.method.pointerLabel}</span>
        </div>
        <span
          className={styles.methodPointer}
          style={pointerStyle}
          aria-hidden="true"
        />
        <div className={styles.methodGrid}>
          {copy.method.cards.map((card, index) => {
            const revealed = index <= beat;
            return (
              <section
                className={styles.methodCard}
                data-beat-layout-item="true"
                data-revealed={revealed ? "true" : "false"}
                aria-hidden={revealed ? undefined : true}
                key={card.number}
              >
                <span>{card.number}</span>
                <h2>{card.title}</h2>
                <p>{card.body}</p>
              </section>
            );
          })}
        </div>
      </section>
      <p className={styles.methodNote} data-beat-layout-item="true">
        {copy.method.note}
      </p>
      <SourceRail label={copy.sourceLabel} language={language} scene={2} />
    </article>
  );
}

function EvidenceScene({
  copy,
  language,
}: {
  copy: MothExperimentCopy;
  language: Language;
}) {
  const scene = copy.scenes[3];

  return (
    <article
      className={[styles.scene, styles.evidenceScene].join(" ")}
      data-composition="frequency-evidence"
      data-visible-claim-ids={MOTH_EXPERIMENT_SCENE_CLAIMS[3].join(" ")}
      data-beat-layout-container="true"
      data-beat-layout-mode="reserved"
    >
      <SceneLead scene={scene} />
      <section className={styles.frequencyFile} data-beat-layout-item="true">
        <header>
          <span>{copy.evidence.observationLabel}</span>
          <span>{copy.evidence.frequencyLabel}</span>
          <span>{copy.evidence.contextLabel}</span>
        </header>
        <div className={styles.frequencyEntries}>
          {copy.evidence.entries.map((entry, index) => (
            <article key={entry.date}>
              <span className={styles.frequencyMark}>{String(index + 1).padStart(2, "0")}</span>
              <time>{entry.date}</time>
              <h2>{entry.title}</h2>
              <p>{entry.body}</p>
            </article>
          ))}
        </div>
        <blockquote>{copy.evidence.boundary}</blockquote>
      </section>
      <SourceRail label={copy.sourceLabel} language={language} scene={3} />
    </article>
  );
}

function CritiqueScene({
  copy,
  beat,
  language,
}: {
  copy: MothExperimentCopy;
  beat: number;
  language: Language;
}) {
  const scene = copy.scenes[4];

  return (
    <article
      className={[styles.scene, styles.critiqueScene].join(" ")}
      data-composition="critique-margin"
      data-visible-claim-ids={MOTH_EXPERIMENT_SCENE_CLAIMS[4].join(" ")}
      data-beat-layout-container="true"
      data-beat-layout-mode="reserved"
    >
      <SceneLead scene={scene} />
      <section className={styles.critiqueLedger} data-beat-layout-item="true">
        {copy.critique.rows.map((row, index) => {
          const revealed = index <= beat;
          return (
            <article
              data-beat-layout-item="true"
              data-revealed={revealed ? "true" : "false"}
              aria-hidden={revealed ? undefined : true}
              key={row.label}
            >
              <span>{row.label}</span>
              <h2>{row.title}</h2>
              <p>{row.body}</p>
            </article>
          );
        })}
      </section>
      <blockquote className={styles.critiqueBoundary} data-beat-layout-item="true">
        {copy.critique.boundary}
      </blockquote>
      <SourceRail label={copy.sourceLabel} language={language} scene={4} />
    </article>
  );
}

function ClosingScene({
  copy,
  language,
}: {
  copy: MothExperimentCopy;
  language: Language;
}) {
  const scene = copy.scenes[5];

  return (
    <article
      className={[styles.scene, styles.closingScene].join(" ")}
      data-composition="revised-cover"
      data-visible-claim-ids={MOTH_EXPERIMENT_SCENE_CLAIMS[5].join(" ")}
      data-beat-layout-container="true"
      data-beat-layout-mode="reserved"
    >
      <SceneLead scene={scene} />
      <section className={styles.verdictLabel} data-beat-layout-item="true">
        <SpecimenTag
          variant="pale"
          label="B. betularia"
          note={scene.section}
        />
        <div className={styles.verdictColumns}>
          <section>
            <h2>{copy.close.proves}</h2>
            <ul>
              {copy.close.provesItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
          <section>
            <h2>{copy.close.notProves}</h2>
            <ul>
              {copy.close.notProvesItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        </div>
        <blockquote>{copy.close.closing}</blockquote>
      </section>
      <SourceRail label={copy.sourceLabel} language={language} scene={5} />
    </article>
  );
}

function ScenePage({
  scene,
  beat,
  language,
}: {
  scene: SceneId;
  beat: number;
  language: Language;
}) {
  const copy = COPY[language];
  if (scene === 1) {
    return <CoverScene copy={copy} beat={beat} language={language} />;
  }
  if (scene === 2) {
    return <MethodScene copy={copy} beat={beat} language={language} />;
  }
  if (scene === 3) return <EvidenceScene copy={copy} language={language} />;
  if (scene === 4) {
    return <CritiqueScene copy={copy} beat={beat} language={language} />;
  }
  return <ClosingScene copy={copy} language={language} />;
}

function SpecimenDeck({
  copy,
  scene,
  onNavigate,
}: {
  copy: MothExperimentCopy;
  scene: SceneId;
  onNavigate?: BespokeStyleProps["onNavigate"];
}) {
  const navigate = (target: SceneId) => onNavigate?.(target, 0);

  const handlePointerDown = (event: PointerEvent<HTMLButtonElement>) => {
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
      className={styles.specimenDeck}
      aria-label={copy.specimensLabel}
      data-topic-navigation="true"
      data-navigation-geometry="card-miniature"
      data-navigation-carrier="moth-specimen-cards"
      data-navigation-invocation="auto-hide"
      data-navigation-feedback="material-color-change"
      data-auto-hide="true"
    >
      {SCENE_IDS.map((sceneId) => {
        const active = sceneId === scene;
        const sceneCopy = copy.scenes[sceneId];
        return (
          <button
            type="button"
            key={sceneId}
            aria-current={active ? "page" : undefined}
            aria-label={`${copy.openSpecimen} ${sceneId}: ${sceneCopy.navAria}`}
            onPointerDown={handlePointerDown}
            onClick={(event) => handleClick(event, sceneId)}
            onKeyDown={(event) => handleKeyDown(event, sceneId)}
          >
            <span className={styles.navPin} aria-hidden="true" />
            <MothSpecimen variant={sceneId % 2 === 0 ? "dark" : "pale"} />
            <span>{String(sceneId).padStart(2, "0")}</span>
            <strong>{sceneCopy.nav}</strong>
          </button>
        );
      })}
    </nav>
  );
}

export function getMetadata(language: Language): StyleMetadata {
  const copy = COPY[language];
  return {
    id: "magazine-masthead",
    band: "editorial-print",
    name: language === "zh" ? "杂志刊头" : "Magazine Masthead",
    theme: language === "zh" ? "重审桦尺蛾实验" : "The Moth Experiment, Reopened",
    densityLabel: language === "zh" ? "编辑阅读" : "Editorial Reading",
    heroScene: 1,
    colors: {
      bg: "#20276b",
      ink: "#151510",
      panel: "#f2e8d1",
    },
    typography: {
      header: "Playfair Display 900 / Noto Serif SC 900",
      body: "Inter 700 / Noto Sans SC 700",
    },
    tags: [
      "magazine",
      "masthead",
      "editorial",
      "evidence",
      "peppered-moth",
      "field-experiment",
      "specimen",
      "method-critique",
      "restrained-motion",
    ],
    fonts: ["Playfair Display", "Inter", "cjk:Noto Serif SC", "cjk:Noto Sans SC"],
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

export default function MothExperiment({
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
      data-topic-id="moth-experiment"
      data-style-id="magazine-masthead"
      data-motion={motionDisabled ? "off" : "settled"}
      data-specimen-art="drawn"
    >
      <PublicationHeader copy={copy} />
      <div className={styles.trackShell}>
        <SpatialSceneTrack
          className={styles.track}
          scene={activeScene}
          beat={activeBeat}
          transitionKind="hard-cut"
          transitionMap={TRANSITION_MAP}
          transitionDurationMs={680}
          reducedMotion={motionDisabled}
          beatLayoutModes={BEAT_LAYOUT_MODES}
          renderScene={(sceneId, sceneBeat) => (
            <div className={styles.sceneLayer} data-scene-content={sceneId}>
              <ScenePage
                scene={normalizeScene(sceneId)}
                beat={clampBeat(normalizeScene(sceneId), sceneBeat)}
                language={language}
              />
            </div>
          )}
        />
      </div>
      {!isThumbnail && (
        <SpecimenDeck copy={copy} scene={activeScene} onNavigate={onNavigate} />
      )}
    </div>
  );
}

export const mothExperimentTopic = defineStyleTopic({
  id: "moth-experiment",
  topic: { en: "Moth Experiment", zh: "桦尺蛾实验" },
  model: "GPT 5.6 Sol",
  component: MothExperiment,
  getMetadata,
  navigation: {
    geometry: "card-miniature",
    carrier: "moth-specimen-cards",
    invocation: "auto-hide",
    feedback: "material-color-change",
  },
  sources: MOTH_EXPERIMENT_SOURCES,
  transitionScore: MOTH_EXPERIMENT_TRANSITION_SCORE,
});

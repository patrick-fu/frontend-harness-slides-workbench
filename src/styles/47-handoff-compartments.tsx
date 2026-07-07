import type React from "react";
import type { BespokeStyleProps, StyleMetadata } from "../types";
import SpatialSceneTrack, {
  type BeatLayoutMode,
  type SceneTransitionMap,
} from "./SpatialSceneTrack";
import { defineStyleTopic } from "./topic";

type Language = "en" | "zh";
type SceneId = 1 | 2 | 3 | 4 | 5;
type AccentRole = "goal" | "constraint" | "risk" | "verify";

interface LocalText {
  label: string;
  title: string;
  body: string;
  stamp: string;
}

interface BentoSlot {
  id: string;
  area: string;
  accent: AccentRole;
  revealAt: number;
  text: Record<Language, LocalText>;
}

interface SceneCopy {
  nav: string;
  eyebrow: string;
  title: string;
  intro: string;
  marker: string;
  footer: string[];
}

interface SceneDefinition {
  copy: Record<Language, SceneCopy>;
  grid: React.CSSProperties;
  slots: BentoSlot[];
  beats: Record<
    Language,
    Array<{
      action: string;
      title: string;
      body: string;
    }>
  >;
}

const SCENE_IDS: SceneId[] = [1, 2, 3, 4, 5];

const COLORS = {
  bg: "#130f0b",
  tray: "#1b1510",
  trayLift: "#241b14",
  ink: "#eadfc8",
  muted: "#9f9077",
  quiet: "#665a49",
  rule: "rgba(234, 223, 200, 0.14)",
  ruleStrong: "rgba(234, 223, 200, 0.28)",
  shadow: "rgba(0, 0, 0, 0.32)",
  goal: "#d6a55f",
  constraint: "#8fbfa6",
  risk: "#c87968",
  verify: "#9da7cf",
} as const;

const ACCENTS: Record<AccentRole, string> = {
  goal: COLORS.goal,
  constraint: COLORS.constraint,
  risk: COLORS.risk,
  verify: COLORS.verify,
};

const FONT = {
  display: "Georgia, 'Songti SC', 'STSong', serif",
  body: "'Avenir Next', 'Source Sans 3', 'Noto Sans SC', sans-serif",
  mono: "'SF Mono', 'IBM Plex Mono', 'Roboto Mono', monospace",
};

const TRANSITION_MAP: SceneTransitionMap = {
  "1->2": "scale-fade",
  "2->3": "wipe",
  "3->4": "slide-x",
  "4->5": "fade",
};

const BEAT_LAYOUT_MODES: Record<SceneId, BeatLayoutMode> = {
  1: "reserved",
  2: "reserved",
  3: "reserved",
  4: "reserved",
  5: "reserved",
};

const sharedGridShell: React.CSSProperties = {
  display: "grid",
  width: "100%",
  height: "100%",
  gap: "1.05cqw",
};

const SCENES: Record<SceneId, SceneDefinition> = {
  1: {
    copy: {
      en: {
        nav: "Cover",
        eyebrow: "handoff container / 01",
        title: "Handoff in Six Compartments",
        intro:
          "A complete packet reads like a packed tray: every portion has a boundary, a role, and a receipt.",
        marker: "six sealed portions",
        footer: ["objective", "constraints", "sources", "assets", "risks", "receipt"],
      },
      zh: {
        nav: "封面",
        eyebrow: "交接容器 / 01",
        title: "六格交接",
        intro: "完整交接像一只打包好的食盒：每一份都有边界、用途和验收凭据。",
        marker: "六格封装",
        footer: ["目标", "约束", "来源", "资产", "风险", "回执"],
      },
    },
    grid: {
      ...sharedGridShell,
      gridTemplateColumns: "23% 17% 20% 18% 22%",
      gridTemplateRows: "32% 27% 31%",
      gridTemplateAreas: `
        "goal goal limits assets assets"
        "goal goal sources assets assets"
        "risks risks sources receipt receipt"
      `,
    },
    slots: [
      {
        id: "goal",
        area: "goal",
        accent: "goal",
        revealAt: 0,
        text: {
          en: {
            label: "01 / objective",
            title: "The work is named.",
            body: "State the outcome, current state, and next decision in one visible compartment.",
            stamp: "not a pile",
          },
          zh: {
            label: "01 / 目标",
            title: "先命名这份工作",
            body: "把结果、现状和下一步决策放进同一格，让接手者先看到主线。",
            stamp: "不是堆料",
          },
        },
      },
      {
        id: "limits",
        area: "limits",
        accent: "constraint",
        revealAt: 0,
        text: {
          en: {
            label: "02 / constraints",
            title: "Edges stay visible.",
            body: "Scope, deadlines, owners, and non-goals travel with the packet.",
            stamp: "hard sides",
          },
          zh: {
            label: "02 / 约束",
            title: "边界可见",
            body: "范围、期限、负责人和非目标必须随包同行。",
            stamp: "硬边界",
          },
        },
      },
      {
        id: "assets",
        area: "assets",
        accent: "verify",
        revealAt: 0,
        text: {
          en: {
            label: "03 / assets",
            title: "Links are plated.",
            body: "Documents, builds, traces, and screenshots each get a named slot.",
            stamp: "openable",
          },
          zh: {
            label: "03 / 资产",
            title: "链接被装盘",
            body: "文档、构建、链路和截图分别进入具名槽位。",
            stamp: "可打开",
          },
        },
      },
      {
        id: "sources",
        area: "sources",
        accent: "goal",
        revealAt: 0,
        text: {
          en: {
            label: "04 / context",
            title: "Why is preserved.",
            body: "Keep the reasoning near the artifact so the receiver can audit intent.",
            stamp: "rationale",
          },
          zh: {
            label: "04 / 上下文",
            title: "保留为什么",
            body: "把原因贴近产物，接手者才能复核意图。",
            stamp: "理由",
          },
        },
      },
      {
        id: "risks",
        area: "risks",
        accent: "risk",
        revealAt: 0,
        text: {
          en: {
            label: "05 / risk",
            title: "Sharp items are covered.",
            body: "Known breakpoints, open questions, and escalation paths are not hidden.",
            stamp: "handled",
          },
          zh: {
            label: "05 / 风险",
            title: "尖锐项有盖",
            body: "已知断点、开放问题和升级路径不藏在正文里。",
            stamp: "已处理",
          },
        },
      },
      {
        id: "receipt",
        area: "receipt",
        accent: "verify",
        revealAt: 0,
        text: {
          en: {
            label: "06 / receipt",
            title: "Acceptance is boxed.",
            body: "The receiver gets the exact check that proves the handoff is usable.",
            stamp: "signed",
          },
          zh: {
            label: "06 / 回执",
            title: "验收被封箱",
            body: "接手者拿到可以证明交接可用的明确检查。",
            stamp: "签收",
          },
        },
      },
    ],
    beats: {
      en: [
        {
          action: "Open the complete bento container",
          title: "Six compartments visible",
          body: "The packet starts as a complete, portioned whole.",
        },
      ],
      zh: [
        {
          action: "打开完整食盒",
          title: "六格同时可见",
          body: "交接包从一开始就是完整、分格的整体。",
        },
      ],
    },
  },
  2: {
    copy: {
      en: {
        nav: "Constraints",
        eyebrow: "boundary layer / 02",
        title: "Constraints Get Their Own Walls",
        intro:
          "Before assets move, the receiver needs the box dimensions: what cannot change, where judgment is allowed, and who can unblock.",
        marker: "reserved slots, no shifting",
        footer: ["scope", "non-goals", "deadline", "owner", "dependencies", "budget"],
      },
      zh: {
        nav: "约束",
        eyebrow: "边界层 / 02",
        title: "约束必须有独立隔间",
        intro: "资产交出前，接手者要先知道盒子的尺寸：什么不能改、哪里可判断、谁能解锁。",
        marker: "预留槽位，不跳版",
        footer: ["范围", "非目标", "期限", "负责人", "依赖", "成本"],
      },
    },
    grid: {
      ...sharedGridShell,
      gridTemplateColumns: "31% 18% 18% 33%",
      gridTemplateRows: "30% 23% 31%",
      gridTemplateAreas: `
        "limits limits contract contract"
        "limits limits owners dependencies"
        "nongoals deadline deadline dependencies"
      `,
    },
    slots: [
      {
        id: "limits",
        area: "limits",
        accent: "constraint",
        revealAt: 0,
        text: {
          en: {
            label: "fixed edge",
            title: "Scope is the tray size.",
            body: "Name the included surface and the surface intentionally left out.",
            stamp: "beat 0",
          },
          zh: {
            label: "固定边界",
            title: "范围就是盒子尺寸",
            body: "写明包含面，也写明故意不处理的面。",
            stamp: "节拍 0",
          },
        },
      },
      {
        id: "contract",
        area: "contract",
        accent: "constraint",
        revealAt: 1,
        text: {
          en: {
            label: "contract",
            title: "Assumptions are stamped.",
            body: "If a claim can expire, attach its date, source, and owner.",
            stamp: "beat 1",
          },
          zh: {
            label: "约定",
            title: "假设需要盖章",
            body: "会过期的判断必须附日期、来源和负责人。",
            stamp: "节拍 1",
          },
        },
      },
      {
        id: "owners",
        area: "owners",
        accent: "goal",
        revealAt: 1,
        text: {
          en: {
            label: "owner",
            title: "One unblock path.",
            body: "The receiver should know whose answer changes the plan.",
            stamp: "named",
          },
          zh: {
            label: "负责人",
            title: "一条解锁路径",
            body: "接手者要知道谁的回答会改变方案。",
            stamp: "具名",
          },
        },
      },
      {
        id: "dependencies",
        area: "dependencies",
        accent: "risk",
        revealAt: 2,
        text: {
          en: {
            label: "dependency",
            title: "External locks are visible.",
            body: "APIs, approvals, and environment gates sit outside the main food well.",
            stamp: "watch",
          },
          zh: {
            label: "依赖",
            title: "外部锁可见",
            body: "API、审批和环境门槛不混进主格。",
            stamp: "盯防",
          },
        },
      },
      {
        id: "nongoals",
        area: "nongoals",
        accent: "constraint",
        revealAt: 2,
        text: {
          en: {
            label: "non-goals",
            title: "No silent extras.",
            body: "The packet blocks scope creep by naming rejected work.",
            stamp: "closed",
          },
          zh: {
            label: "非目标",
            title: "没有静默加菜",
            body: "明确拒绝项，防止交接时悄悄扩范围。",
            stamp: "关闭",
          },
        },
      },
      {
        id: "deadline",
        area: "deadline",
        accent: "verify",
        revealAt: 2,
        text: {
          en: {
            label: "timebox",
            title: "Deadline has a test.",
            body: "A date without an acceptance check is only decoration.",
            stamp: "checkable",
          },
          zh: {
            label: "时间盒",
            title: "期限要有检查",
            body: "没有验收检查的日期只是装饰。",
            stamp: "可检查",
          },
        },
      },
    ],
    beats: {
      en: [
        {
          action: "Reserve the scope compartment",
          title: "Scope sets the tray",
          body: "The receiver sees the package boundary before touching any asset.",
        },
        {
          action: "Reveal assumptions and ownership",
          title: "Assumptions are owned",
          body: "Judgment calls become auditable because each one names a source.",
        },
        {
          action: "Reveal non-goals, dependencies, and timebox",
          title: "Loose edges are contained",
          body: "External locks and rejected work are visible instead of implied.",
        },
      ],
      zh: [
        {
          action: "预留范围格",
          title: "范围先定盒子",
          body: "接手者先看到包的边界，再接触任何资产。",
        },
        {
          action: "显露假设和负责人",
          title: "假设有人负责",
          body: "每个判断都带来源，才能被复核。",
        },
        {
          action: "显露非目标、依赖和时间盒",
          title: "松散边缘被收住",
          body: "外部锁和拒绝项变成可见内容，而不是暗含前提。",
        },
      ],
    },
  },
  3: {
    copy: {
      en: {
        nav: "Assets",
        eyebrow: "asset layer / 03",
        title: "Assets Are Plated, Not Pasted",
        intro:
          "Every link is served with a label, freshness signal, and expected use. The receiver should not forage.",
        marker: "source adjacent to use",
        footer: ["docs", "builds", "traces", "screens", "owners", "samples"],
      },
      zh: {
        nav: "资产",
        eyebrow: "资产层 / 03",
        title: "资产是摆盘，不是粘贴",
        intro: "每个链接都带标签、新鲜度和用途。接手者不该自己翻找。",
        marker: "来源贴近用途",
        footer: ["文档", "构建", "链路", "截图", "负责人", "样例"],
      },
    },
    grid: {
      ...sharedGridShell,
      gridTemplateColumns: "26% 22% 22% 14% 16%",
      gridTemplateRows: "28% 26% 30%",
      gridTemplateAreas: `
        "sources sources decisions decisions owners"
        "sources sources links links owners"
        "samples env env receipt receipt"
      `,
    },
    slots: [
      {
        id: "sources",
        area: "sources",
        accent: "goal",
        revealAt: 0,
        text: {
          en: {
            label: "source pack",
            title: "Primary context lives here.",
            body: "Link the design doc, thread, log, and decision note from the same well.",
            stamp: "canonical",
          },
          zh: {
            label: "来源包",
            title: "主上下文在这里",
            body: "设计文档、讨论串、日志和决策说明从同一格进入。",
            stamp: "主来源",
          },
        },
      },
      {
        id: "decisions",
        area: "decisions",
        accent: "constraint",
        revealAt: 0,
        text: {
          en: {
            label: "decision",
            title: "Settled calls are separate.",
            body: "Do not make the next person infer which debate is over.",
            stamp: "settled",
          },
          zh: {
            label: "决策",
            title: "已定判断单独放",
            body: "不要让下一个人猜哪场争论已经结束。",
            stamp: "已定",
          },
        },
      },
      {
        id: "owners",
        area: "owners",
        accent: "goal",
        revealAt: 1,
        text: {
          en: {
            label: "contact",
            title: "Owner near artifact.",
            body: "Every sensitive link has a person beside it.",
            stamp: "reachable",
          },
          zh: {
            label: "联系人",
            title: "负责人贴近产物",
            body: "每个敏感链接旁边都有能回答的人。",
            stamp: "可触达",
          },
        },
      },
      {
        id: "links",
        area: "links",
        accent: "verify",
        revealAt: 1,
        text: {
          en: {
            label: "openable",
            title: "Links include purpose.",
            body: "Name whether each asset is for reading, running, comparing, or signing.",
            stamp: "usable",
          },
          zh: {
            label: "可打开",
            title: "链接带用途",
            body: "标明资产用于阅读、运行、比对还是签收。",
            stamp: "可用",
          },
        },
      },
      {
        id: "samples",
        area: "samples",
        accent: "verify",
        revealAt: 1,
        text: {
          en: {
            label: "sample",
            title: "Known-good evidence.",
            body: "A tiny working sample beats a long promise.",
            stamp: "proof",
          },
          zh: {
            label: "样例",
            title: "已知可用证据",
            body: "一个能跑的小样例胜过很长的承诺。",
            stamp: "证明",
          },
        },
      },
      {
        id: "env",
        area: "env",
        accent: "risk",
        revealAt: 1,
        text: {
          en: {
            label: "environment",
            title: "Reproduction has a place.",
            body: "Versions, flags, test data, and access notes travel together.",
            stamp: "fragile",
          },
          zh: {
            label: "环境",
            title: "复现信息有位置",
            body: "版本、开关、测试数据和权限说明一起交出。",
            stamp: "脆弱",
          },
        },
      },
      {
        id: "receipt",
        area: "receipt",
        accent: "verify",
        revealAt: 1,
        text: {
          en: {
            label: "freshness",
            title: "Staleness is visible.",
            body: "Each asset carries its last trusted moment.",
            stamp: "dated",
          },
          zh: {
            label: "新鲜度",
            title: "过期风险可见",
            body: "每个资产都带最后可信时间。",
            stamp: "有日期",
          },
        },
      },
    ],
    beats: {
      en: [
        {
          action: "Show primary sources and decisions",
          title: "Canonical assets first",
          body: "The high-confidence materials sit in the largest compartments.",
        },
        {
          action: "Reveal owners, samples, environment, and freshness",
          title: "Usability details complete the tray",
          body: "The receiver gets enough context to open, run, and validate each asset.",
        },
      ],
      zh: [
        {
          action: "展示主来源和已定决策",
          title: "主资产先出现",
          body: "高可信材料放在最大隔间。",
        },
        {
          action: "显露负责人、样例、环境和新鲜度",
          title: "可用性细节补齐食盒",
          body: "接手者有足够信息打开、运行和验证每个资产。",
        },
      ],
    },
  },
  4: {
    copy: {
      en: {
        nav: "Risks",
        eyebrow: "risk layer / 04",
        title: "Risks Sit in Lidded Compartments",
        intro:
          "A careful handoff does not soften risk. It separates sharp issues, unknowns, fallbacks, and tests so nothing leaks.",
        marker: "watch zones separated",
        footer: ["critical", "unknown", "fallback", "owner", "test", "escalation"],
      },
      zh: {
        nav: "风险",
        eyebrow: "风险层 / 04",
        title: "风险进入有盖隔间",
        intro: "精心交接不会淡化风险，而是拆开尖锐项、未知项、兜底方案和验证检查。",
        marker: "盯防区分离",
        footer: ["关键项", "未知项", "兜底", "负责人", "测试", "升级"],
      },
    },
    grid: {
      ...sharedGridShell,
      gridTemplateColumns: "30% 20% 18% 16% 16%",
      gridTemplateRows: "33% 23% 28%",
      gridTemplateAreas: `
        "critical critical watch watch fallback"
        "critical critical owner tests fallback"
        "unknowns unknowns owner tests escalation"
      `,
    },
    slots: [
      {
        id: "critical",
        area: "critical",
        accent: "risk",
        revealAt: 0,
        text: {
          en: {
            label: "critical",
            title: "The sharpest edge is named.",
            body: "Put the most likely failure in the largest risk well, not in a footnote.",
            stamp: "visible",
          },
          zh: {
            label: "关键风险",
            title: "最尖锐的边先命名",
            body: "最可能失败的地方进入最大风险格，而不是脚注。",
            stamp: "可见",
          },
        },
      },
      {
        id: "watch",
        area: "watch",
        accent: "risk",
        revealAt: 1,
        text: {
          en: {
            label: "watch",
            title: "Signals have thresholds.",
            body: "Define what reading means normal, caution, and stop.",
            stamp: "threshold",
          },
          zh: {
            label: "盯防",
            title: "信号要有阈值",
            body: "定义什么读数算正常、谨慎和停手。",
            stamp: "阈值",
          },
        },
      },
      {
        id: "fallback",
        area: "fallback",
        accent: "constraint",
        revealAt: 1,
        text: {
          en: {
            label: "fallback",
            title: "The spare route is packed.",
            body: "When the main route fails, the receiver should not invent recovery live.",
            stamp: "ready",
          },
          zh: {
            label: "兜底",
            title: "备用路线已打包",
            body: "主路径失败时，接手者不该现场发明恢复方案。",
            stamp: "就绪",
          },
        },
      },
      {
        id: "unknowns",
        area: "unknowns",
        accent: "risk",
        revealAt: 2,
        text: {
          en: {
            label: "unknown",
            title: "Open questions are not gaps.",
            body: "Mark the question, the next probe, and the date it matters.",
            stamp: "bounded",
          },
          zh: {
            label: "未知项",
            title: "开放问题不是缺口",
            body: "标出问题、下一次探测和它变重要的日期。",
            stamp: "有界",
          },
        },
      },
      {
        id: "owner",
        area: "owner",
        accent: "goal",
        revealAt: 2,
        text: {
          en: {
            label: "owner",
            title: "Escalation has one name.",
            body: "Risk without a contact is only anxiety.",
            stamp: "assigned",
          },
          zh: {
            label: "负责人",
            title: "升级路径只有一个名字",
            body: "没有联系人的风险只是焦虑。",
            stamp: "已指派",
          },
        },
      },
      {
        id: "tests",
        area: "tests",
        accent: "verify",
        revealAt: 2,
        text: {
          en: {
            label: "test",
            title: "Risk gets a check.",
            body: "Attach the command, screen, or metric that catches regression.",
            stamp: "runnable",
          },
          zh: {
            label: "测试",
            title: "风险配检查",
            body: "附上能捕捉回归的命令、页面或指标。",
            stamp: "可运行",
          },
        },
      },
      {
        id: "escalation",
        area: "escalation",
        accent: "verify",
        revealAt: 2,
        text: {
          en: {
            label: "receipt",
            title: "The alert is pre-addressed.",
            body: "A clear risk route keeps the next move calm.",
            stamp: "sealed",
          },
          zh: {
            label: "回执",
            title: "告警地址已写好",
            body: "风险路径清楚，下一步才稳定。",
            stamp: "封存",
          },
        },
      },
    ],
    beats: {
      en: [
        {
          action: "Place the critical risk",
          title: "The largest risk is explicit",
          body: "The receiver sees the sharpest edge without digging.",
        },
        {
          action: "Reveal watch thresholds and fallback",
          title: "Failure has a route",
          body: "Signals and recovery sit beside the risk instead of after it.",
        },
        {
          action: "Reveal unknowns, owners, tests, and escalation",
          title: "Risk becomes operational",
          body: "Every unresolved item gains a next probe, owner, or check.",
        },
      ],
      zh: [
        {
          action: "放置关键风险",
          title: "最大风险显性化",
          body: "接手者不用挖，就能看到最尖锐的边。",
        },
        {
          action: "显露盯防阈值和兜底路径",
          title: "失败有路线",
          body: "信号和恢复路径贴着风险，而不是排在末尾。",
        },
        {
          action: "显露未知项、负责人、测试和升级路径",
          title: "风险进入操作态",
          body: "每个未解决项都有下一次探测、负责人或检查。",
        },
      ],
    },
  },
  5: {
    copy: {
      en: {
        nav: "Receipt",
        eyebrow: "receipt layer / 05",
        title: "The Receiver Signs the Whole Box",
        intro:
          "The final scene is not a flourish. It is the proof that the packet can be opened, trusted, and continued.",
        marker: "acceptance seal",
        footer: ["open", "run", "compare", "decide", "watch", "sign"],
      },
      zh: {
        nav: "回执",
        eyebrow: "回执层 / 05",
        title: "接手者签收整个盒子",
        intro: "最后一页不是装饰，而是证明交接包能被打开、信任并继续推进。",
        marker: "验收封签",
        footer: ["打开", "运行", "比对", "决策", "盯防", "签收"],
      },
    },
    grid: {
      ...sharedGridShell,
      gridTemplateColumns: "24% 20% 18% 18% 20%",
      gridTemplateRows: "31% 28% 27%",
      gridTemplateAreas: `
        "seal seal contents contents contents"
        "seal seal chain chain close"
        "checksum checksum signoff signoff close"
      `,
    },
    slots: [
      {
        id: "seal",
        area: "seal",
        accent: "verify",
        revealAt: 0,
        text: {
          en: {
            label: "receipt seal",
            title: "Openable packet.",
            body: "The receiver can locate the goal, boundary, asset, risk, and check without asking.",
            stamp: "accepted",
          },
          zh: {
            label: "回执封签",
            title: "可打开的交接包",
            body: "接手者无需追问，就能找到目标、边界、资产、风险和检查。",
            stamp: "已签收",
          },
        },
      },
      {
        id: "contents",
        area: "contents",
        accent: "goal",
        revealAt: 0,
        text: {
          en: {
            label: "contents",
            title: "Six compartments remain legible.",
            body: "The contents list mirrors the tray so later readers can audit what was handed over.",
            stamp: "indexed",
          },
          zh: {
            label: "目录",
            title: "六个隔间仍然清晰",
            body: "目录映射食盒结构，后续读者才能审计交出了什么。",
            stamp: "已索引",
          },
        },
      },
      {
        id: "chain",
        area: "chain",
        accent: "constraint",
        revealAt: 1,
        text: {
          en: {
            label: "chain",
            title: "Custody is clear.",
            body: "Who handed it off, who received it, and what changed after signoff.",
            stamp: "traceable",
          },
          zh: {
            label: "链路",
            title: "交接链清楚",
            body: "谁交出、谁接收、签收后发生了什么，都可追踪。",
            stamp: "可追踪",
          },
        },
      },
      {
        id: "close",
        area: "close",
        accent: "verify",
        revealAt: 1,
        text: {
          en: {
            label: "next action",
            title: "Continue from here.",
            body: "The next move is visible enough that work resumes without unpacking delay.",
            stamp: "ready",
          },
          zh: {
            label: "下一步",
            title: "从这里继续",
            body: "下一步足够可见，工作不用重新拆包就能恢复。",
            stamp: "就绪",
          },
        },
      },
      {
        id: "checksum",
        area: "checksum",
        accent: "risk",
        revealAt: 1,
        text: {
          en: {
            label: "checksum",
            title: "Missing pieces are listed.",
            body: "The receipt says what is absent as clearly as what is present.",
            stamp: "honest",
          },
          zh: {
            label: "校验",
            title: "缺失项列明",
            body: "回执写清楚缺什么，和写清楚有什么一样重要。",
            stamp: "诚实",
          },
        },
      },
      {
        id: "signoff",
        area: "signoff",
        accent: "verify",
        revealAt: 1,
        text: {
          en: {
            label: "signoff",
            title: "Acceptance is reproducible.",
            body: "A future person can repeat the receipt check and get the same answer.",
            stamp: "repeatable",
          },
          zh: {
            label: "签收",
            title: "验收可复现",
            body: "后续接手者能重复回执检查，并得到同样结论。",
            stamp: "可复现",
          },
        },
      },
    ],
    beats: {
      en: [
        {
          action: "Show receipt seal and contents",
          title: "The packet can be accepted",
          body: "The receiver sees the handoff as a complete, auditable container.",
        },
        {
          action: "Reveal custody, checksum, signoff, and next action",
          title: "The handoff continues",
          body: "Acceptance includes what changed hands and what remains to watch.",
        },
      ],
      zh: [
        {
          action: "展示回执封签和目录",
          title: "交接包可以签收",
          body: "接手者看到的是完整、可审计的容器。",
        },
        {
          action: "显露交接链、校验、签收和下一步",
          title: "交接继续推进",
          body: "验收包含交出了什么，以及之后还要盯什么。",
        },
      ],
    },
  },
};

function isSceneId(value: number): value is SceneId {
  return value >= 1 && value <= 5 && Number.isInteger(value);
}

function normalizeScene(value: number): SceneId {
  return isSceneId(value) ? value : 1;
}

function clampBeat(sceneId: SceneId, beat: number): number {
  const maxBeat = SCENES[sceneId].beats.en.length - 1;
  return Math.min(Math.max(beat, 0), maxBeat);
}

function motionTransition(disabled: boolean): string {
  return disabled
    ? "none"
    : "opacity 520ms cubic-bezier(0.22, 1, 0.36, 1), transform 520ms cubic-bezier(0.22, 1, 0.36, 1), border-color 520ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 520ms cubic-bezier(0.22, 1, 0.36, 1)";
}

function getSlotText(slot: BentoSlot, language: Language): LocalText {
  return slot.text[language];
}

function Compartment({
  slot,
  language,
  beat,
  reduced,
}: {
  slot: BentoSlot;
  language: Language;
  beat: number;
  reduced: boolean;
}) {
  const active = beat >= slot.revealAt;
  const accent = ACCENTS[slot.accent];
  const text = getSlotText(slot, language);

  return (
    <article
      data-beat-layout-item="true"
      data-slot-id={slot.id}
      data-slot-active={active ? "true" : "false"}
      style={{
        gridArea: slot.area,
        minWidth: "0",
        minHeight: "0",
        display: "grid",
        gridTemplateRows: "18% 25% 1fr 16%",
        gap: "0.6cqh",
        padding: "1.25cqw",
        border: `0.08cqw solid ${active ? accent : COLORS.rule}`,
        borderRadius: "0.38cqw",
        background: active ? COLORS.trayLift : COLORS.tray,
        boxShadow: active
          ? `0 1.2cqh 2.4cqw ${COLORS.shadow}, 0 0 0 0.05cqw ${COLORS.ruleStrong} inset`
          : `0 0.35cqh 0.9cqw ${COLORS.shadow}`,
        opacity: active ? 1 : 0.42,
        transform: active ? "translateY(0%)" : "translateY(1.5%)",
        transition: motionTransition(reduced),
        overflow: "hidden",
      }}
    >
      <div
        style={{
          minWidth: "0",
          color: active ? accent : COLORS.quiet,
          fontFamily: FONT.mono,
          fontSize: "0.68cqw",
          lineHeight: "1.1",
          letterSpacing: "0.14cqw",
          textTransform: "uppercase",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {text.label}
      </div>
      <h2
        style={{
          margin: "0",
          color: COLORS.ink,
          fontFamily: FONT.display,
          fontSize: "1.55cqw",
          lineHeight: "1.02",
          fontWeight: 500,
          overflow: "hidden",
        }}
      >
        {text.title}
      </h2>
      <p
        style={{
          margin: "0",
          color: COLORS.ink,
          fontFamily: FONT.body,
          fontSize: "0.9cqw",
          lineHeight: "1.34",
          opacity: active ? 0.82 : 0.32,
          overflow: "hidden",
          transition: motionTransition(reduced),
        }}
      >
        {text.body}
      </p>
      <div
        style={{
          alignSelf: "end",
          justifySelf: "start",
          color: active ? accent : COLORS.quiet,
          fontFamily: FONT.mono,
          fontSize: "0.62cqw",
          lineHeight: "1",
          letterSpacing: "0.12cqw",
          textTransform: "uppercase",
          borderTop: `0.06cqw solid ${active ? accent : COLORS.rule}`,
          paddingTop: "0.55cqh",
          maxWidth: "100%",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {text.stamp}
      </div>
    </article>
  );
}

function ScenePanel({
  sceneId,
  beat,
  language,
  isActive,
  reduced,
  isThumbnail,
}: {
  sceneId: SceneId;
  beat: number;
  language: Language;
  isActive: boolean;
  reduced: boolean;
  isThumbnail: boolean;
}) {
  const definition = SCENES[sceneId];
  const copy = definition.copy[language];
  const activeBeat = clampBeat(sceneId, beat);
  const beatCopy = definition.beats[language][activeBeat];

  return (
    <section
      data-scene-shell="true"
      data-scene-active={isActive ? "true" : "false"}
      data-beat-layout-container="true"
      data-beat-layout-mode="reserved"
      style={{
        boxSizing: "border-box",
        width: "100%",
        height: "100%",
        display: "grid",
        gridTemplateRows: "19% 67% 10%",
        gap: "1.8cqh",
        padding: isThumbnail ? "4.6cqh 4.2cqw" : "5.2cqh 12cqw 4.6cqh 4.6cqw",
        background: COLORS.bg,
        color: COLORS.ink,
        overflow: "hidden",
      }}
    >
      <header
        data-beat-layout-item="true"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 23%",
          gap: "2cqw",
          alignItems: "start",
          minWidth: "0",
          minHeight: "0",
        }}
      >
        <div style={{ minWidth: "0", overflow: "hidden" }}>
          <div
            style={{
              color: ACCENTS[sceneId === 4 ? "risk" : sceneId === 2 ? "constraint" : "goal"],
              fontFamily: FONT.mono,
              fontSize: "0.76cqw",
              lineHeight: "1.05",
              letterSpacing: "0.16cqw",
              textTransform: "uppercase",
              marginBottom: "1cqh",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {copy.eyebrow}
          </div>
          <h1
            style={{
              margin: "0",
              color: COLORS.ink,
              fontFamily: FONT.display,
              fontSize: sceneId === 1 ? "4.35cqw" : "3.55cqw",
              lineHeight: "0.98",
              fontWeight: 500,
              letterSpacing: "0",
              maxWidth: "100%",
            }}
          >
            {copy.title}
          </h1>
        </div>
        <aside
          data-beat-layout-item="true"
          style={{
            minWidth: "0",
            border: `0.08cqw solid ${COLORS.ruleStrong}`,
            borderRadius: "0.36cqw",
            padding: "1cqw",
            background: COLORS.tray,
            color: COLORS.muted,
            fontFamily: FONT.body,
            fontSize: "0.86cqw",
            lineHeight: "1.28",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              color: COLORS.ink,
              fontFamily: FONT.mono,
              fontSize: "0.64cqw",
              letterSpacing: "0.13cqw",
              textTransform: "uppercase",
              marginBottom: "0.7cqh",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {copy.marker}
          </div>
          {copy.intro}
        </aside>
      </header>

      <main
        data-beat-layout-item="true"
        style={{
          minHeight: "0",
          border: `0.1cqw solid ${COLORS.ruleStrong}`,
          borderRadius: "0.48cqw",
          padding: "1.1cqw",
          background: COLORS.tray,
          boxShadow: `0 1.4cqh 2.5cqw ${COLORS.shadow}`,
          overflow: "hidden",
        }}
      >
        <div style={definition.grid}>
          {definition.slots.map((slot) => (
            <Compartment
              key={slot.id}
              slot={slot}
              language={language}
              beat={activeBeat}
              reduced={reduced}
            />
          ))}
        </div>
      </main>

      <footer
        data-beat-layout-item="true"
        style={{
          display: "grid",
          gridTemplateColumns: "28% 1fr",
          gap: "1.8cqw",
          alignItems: "stretch",
          minHeight: "0",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            borderLeft: `0.08cqw solid ${COLORS.ruleStrong}`,
            paddingLeft: "1.15cqw",
            minWidth: "0",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              color: ACCENTS[sceneId === 4 ? "risk" : "verify"],
              fontFamily: FONT.mono,
              fontSize: "0.68cqw",
              letterSpacing: "0.13cqw",
              textTransform: "uppercase",
              marginBottom: "0.7cqh",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            beat {activeBeat + 1} / {definition.beats[language].length}
          </div>
          <div
            style={{
              color: COLORS.ink,
              fontFamily: FONT.body,
              fontSize: "0.92cqw",
              lineHeight: "1.22",
              overflow: "hidden",
            }}
          >
            {beatCopy.title}
          </div>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(6, 1fr)",
            gap: "0.7cqw",
            minWidth: "0",
            overflow: "hidden",
          }}
        >
          {copy.footer.map((item, index) => (
            <div
              key={`${sceneId}-${item}`}
              data-beat-layout-item="true"
              style={{
                border: `0.06cqw solid ${
                  index <= activeBeat + 2 ? COLORS.ruleStrong : COLORS.rule
                }`,
                borderRadius: "0.3cqw",
                padding: "0.72cqh 0.62cqw",
                color: index <= activeBeat + 2 ? COLORS.ink : COLORS.quiet,
                fontFamily: FONT.mono,
                fontSize: "0.58cqw",
                lineHeight: "1",
                letterSpacing: "0.1cqw",
                textTransform: "uppercase",
                textAlign: "center",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                transition: motionTransition(reduced),
              }}
            >
              {item}
            </div>
          ))}
        </div>
      </footer>
    </section>
  );
}

function CompartmentSelector({
  scene,
  language,
  onNavigate,
}: {
  scene: SceneId;
  language: Language;
  onNavigate?: (scene: number, beat: number) => void;
}) {
  return (
    <nav
      aria-label={language === "zh" ? "交接隔间选择器" : "Handoff compartment selector"}
      style={{
        position: "absolute",
        top: "9cqh",
        right: "2.1cqw",
        width: "8.2cqw",
        display: "grid",
        gridTemplateRows: "repeat(5, 1fr)",
        gap: "0.8cqh",
        zIndex: 5,
      }}
    >
      {SCENE_IDS.map((sceneId) => {
        const active = sceneId === scene;
        const accent =
          sceneId === 2 ? COLORS.constraint : sceneId === 4 ? COLORS.risk : COLORS.verify;
        return (
          <button
            key={sceneId}
            type="button"
            aria-current={active ? "step" : undefined}
            onClick={() => onNavigate?.(sceneId, 0)}
            style={{
              appearance: "none",
              WebkitAppearance: "none",
              display: "grid",
              gridTemplateColumns: "25% 1fr",
              gap: "0.45cqw",
              alignItems: "center",
              minHeight: "0",
              padding: "0.78cqh 0.55cqw",
              border: `0.07cqw solid ${active ? accent : COLORS.rule}`,
              borderRadius: "0.32cqw",
              background: active ? COLORS.trayLift : COLORS.tray,
              color: active ? COLORS.ink : COLORS.muted,
              cursor: "pointer",
              textAlign: "left",
              boxShadow: active ? `0 0.7cqh 1.1cqw ${COLORS.shadow}` : "none",
            }}
          >
            <span
              style={{
                color: active ? accent : COLORS.quiet,
                fontFamily: FONT.mono,
                fontSize: "0.6cqw",
                lineHeight: "1",
                letterSpacing: "0.08cqw",
              }}
            >
              {String(sceneId).padStart(2, "0")}
            </span>
            <span
              style={{
                minWidth: "0",
                fontFamily: FONT.mono,
                fontSize: "0.58cqw",
                lineHeight: "1.1",
                letterSpacing: "0.05cqw",
                textTransform: "uppercase",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {SCENES[sceneId].copy[language].nav}
            </span>
          </button>
        );
      })}
    </nav>
  );
}

export function getMetadata(lang: Language): StyleMetadata {
  return {
    id: "context-bento-box",
    band: "text-report",
    name: lang === "zh" ? "上下文食盒" : "Context Bento Box",
    theme: lang === "zh" ? "六格交接" : "Handoff in Six Compartments",
    densityLabel: lang === "zh" ? "高密度分格" : "Dense Compartments",
    heroScene: 1,
    colors: {
      bg: COLORS.bg,
      ink: COLORS.ink,
      panel: COLORS.tray,
    },
    typography: {
      header: "Georgia 500",
      body: "Avenir Next 400",
    },
    tags: [
      "context",
      "handoff",
      "bento",
      "lacquer",
      "structured",
      "text-report",
      "reserved-motion",
    ],
    fonts: ["Georgia", "Avenir Next", "SF Mono", "cjk:Songti SC", "cjk:Noto Sans SC"],
    scenes: SCENE_IDS.map((sceneId) => ({
      id: sceneId,
      title: SCENES[sceneId].copy[lang].nav,
      beats: SCENES[sceneId].beats[lang].map((beat, beatId) => ({
        id: beatId,
        action: beat.action,
        title: beat.title,
        body: beat.body,
      })),
    })),
  };
}

export default function HandoffCompartmentsV2({
  scene,
  beat,
  language,
  isThumbnail,
  reducedMotion,
  onNavigate,
}: BespokeStyleProps) {
  const activeScene = normalizeScene(scene);
  const effectiveReducedMotion = reducedMotion || isThumbnail;

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        containerType: "size",
        overflow: "hidden",
        background: COLORS.bg,
        color: COLORS.ink,
        fontFamily: FONT.body,
      }}
    >
      <SpatialSceneTrack
        scene={activeScene}
        beat={clampBeat(activeScene, beat)}
        sceneIds={SCENE_IDS}
        transitionKind="fade"
        transitionMap={TRANSITION_MAP}
        reducedMotion={effectiveReducedMotion}
        beatLayoutModes={BEAT_LAYOUT_MODES}
        renderScene={(sceneId, sceneBeat, isActive) => (
          <ScenePanel
            sceneId={normalizeScene(sceneId)}
            beat={sceneBeat}
            language={language}
            isActive={isActive}
            reduced={effectiveReducedMotion}
            isThumbnail={isThumbnail}
          />
        )}
      />
      {isThumbnail ? null : (
        <CompartmentSelector
          scene={activeScene}
          language={language}
          onNavigate={onNavigate}
        />
      )}
    </div>
  );
}

export const handoffCompartmentsTopic = defineStyleTopic({
  id: "handoff-box",
  topic: {
    en: "Handoff Box",
    zh: "交接盒",
  },
  model: "GPT-5.5",
  component: HandoffCompartmentsV2,
  getMetadata,
});

import { useEffect } from "react";
import type { CSSProperties } from "react";
import type {
  BespokeStyleProps,
  SceneMetadata,
  StyleMetadata,
} from "../types";
import { useFLIP } from "../hooks/useFLIP";
import SpatialSceneTrack, {
  type BeatLayoutMode,
  type SceneTransitionMap,
} from "./SpatialSceneTrack";
import { defineStyleVersion } from "./version";
import styles from "./07-human-loop-retrofit-v2.module.css";

type Lang = "en" | "zh";
type CssVars = CSSProperties & Record<`--${string}`, string | number>;

interface BoardNote {
  id: string;
  text: string;
  kind: "yellow" | "blue" | "red" | "cream" | "green";
  x: string;
  y: string;
  rotate: string;
  width?: "small" | "medium" | "large";
  showAt: number;
}

interface Actor {
  id: string;
  emoji: string;
  label: string;
  x: string;
  y: string;
  showAt: number;
}

interface SceneCopy {
  eyebrow: string;
  title: string;
  body: string;
  boardLabel: string;
  caption: string;
  notes: BoardNote[];
  actors: Actor[];
  beats: SceneMetadata["beats"];
}

const TRANSITION_MAP: SceneTransitionMap = {
  "1->2": "slide-x",
  "2->3": "scale-fade",
  "3->4": "wipe",
  "4->5": "fade",
};

const BEAT_LAYOUT_MODES: Record<number, BeatLayoutMode> = {
  1: "motion",
  2: "motion",
  3: "motion",
  4: "motion",
  5: "motion",
};

const COPY: Record<Lang, SceneCopy[]> = {
  en: [
    {
      eyebrow: "Scene 01 / messy board",
      title: "The loop already exists",
      body: "People, models, and queues are making calls together. The problem is that nobody can see the handoff.",
      boardLabel: "Unowned human loop",
      caption: "A retrofit starts by naming the mess without shaming it.",
      notes: [
        {
          id: "support-pings",
          text: "Support pings arrive as screenshots",
          kind: "yellow",
          x: "10%",
          y: "15%",
          rotate: "-4deg",
          width: "medium",
          showAt: 0,
        },
        {
          id: "model-guess",
          text: "Model guesses intent, then waits",
          kind: "blue",
          x: "41%",
          y: "19%",
          rotate: "3deg",
          width: "medium",
          showAt: 0,
        },
        {
          id: "review-memory",
          text: "Reviewer remembers the last exception",
          kind: "cream",
          x: "55%",
          y: "13%",
          rotate: "-2deg",
          width: "large",
          showAt: 1,
        },
        {
          id: "risk-circle",
          text: "Decision owner is implicit",
          kind: "red",
          x: "27%",
          y: "48%",
          rotate: "5deg",
          width: "medium",
          showAt: 2,
        },
        {
          id: "edge-case",
          text: "Edge case returns next week",
          kind: "green",
          x: "57%",
          y: "55%",
          rotate: "-3deg",
          width: "small",
          showAt: 2,
        },
      ],
      actors: [
        {
          id: "user",
          emoji: "🙋",
          label: "user",
          x: "18%",
          y: "39%",
          showAt: 0,
        },
        {
          id: "bot",
          emoji: "🤖",
          label: "model",
          x: "47%",
          y: "41%",
          showAt: 0,
        },
        {
          id: "reviewer",
          emoji: "🧑‍💻",
          label: "review",
          x: "73%",
          y: "39%",
          showAt: 1,
        },
      ],
      beats: [
        {
          id: 0,
          action: "Messy notes and first actors appear",
          title: "Messy board",
          body: "Existing human and model work is visible as scattered notes.",
        },
        {
          id: 1,
          action: "Reviewer memory joins the board",
          title: "Hidden context",
          body: "The process depends on what a person remembers.",
        },
        {
          id: 2,
          action: "Implicit ownership is marked",
          title: "Unowned decision",
          body: "The retrofit target is the invisible decision owner.",
        },
      ],
    },
    {
      eyebrow: "Scene 02 / actor map",
      title: "Map the cast before the flow",
      body: "A useful loop names each actor, what they decide, and what signal they owe the next person.",
      boardLabel: "Actor map",
      caption: "No swim lanes yet. First, show who is actually in the room.",
      notes: [
        {
          id: "human-judgment",
          text: "Human judgment: policy, empathy, exception",
          kind: "yellow",
          x: "9%",
          y: "18%",
          rotate: "3deg",
          width: "large",
          showAt: 0,
        },
        {
          id: "machine-speed",
          text: "Machine speed: draft, rank, retrieve",
          kind: "blue",
          x: "58%",
          y: "18%",
          rotate: "-3deg",
          width: "large",
          showAt: 0,
        },
        {
          id: "handoff",
          text: "Handoff signal must be explicit",
          kind: "red",
          x: "36%",
          y: "48%",
          rotate: "2deg",
          width: "medium",
          showAt: 1,
        },
        {
          id: "waiting",
          text: "Waiting is part of the system",
          kind: "cream",
          x: "15%",
          y: "61%",
          rotate: "-4deg",
          width: "medium",
          showAt: 2,
        },
        {
          id: "audit",
          text: "Audit trail follows the choice",
          kind: "green",
          x: "55%",
          y: "60%",
          rotate: "4deg",
          width: "medium",
          showAt: 2,
        },
      ],
      actors: [
        {
          id: "requester",
          emoji: "🧑",
          label: "request",
          x: "18%",
          y: "41%",
          showAt: 0,
        },
        {
          id: "model",
          emoji: "🤖",
          label: "draft",
          x: "43%",
          y: "36%",
          showAt: 0,
        },
        {
          id: "expert",
          emoji: "🧠",
          label: "judge",
          x: "68%",
          y: "42%",
          showAt: 1,
        },
        {
          id: "ops",
          emoji: "📎",
          label: "log",
          x: "49%",
          y: "63%",
          showAt: 2,
        },
      ],
      beats: [
        {
          id: 0,
          action: "Human and machine actor groups appear",
          title: "Actor map",
          body: "Each participant gets a visible role.",
        },
        {
          id: 1,
          action: "Handoff decision is labeled",
          title: "Decision handoff",
          body: "The system names what must move between actors.",
        },
        {
          id: 2,
          action: "Waiting and audit notes join",
          title: "Operational actors",
          body: "Queues and logs become first-class participants.",
        },
      ],
    },
    {
      eyebrow: "Scene 03 / intervention",
      title: "Place one interrupt where uncertainty peaks",
      body: "Do not wrap every step in review. Add one human turn where confidence, stakes, and reversibility disagree.",
      boardLabel: "Intervention point",
      caption: "The best patch is small enough to run every time.",
      notes: [
        {
          id: "signal",
          text: "Trigger: low confidence plus high user cost",
          kind: "red",
          x: "13%",
          y: "17%",
          rotate: "-3deg",
          width: "large",
          showAt: 0,
        },
        {
          id: "ask",
          text: "Ask for judgment, not permission theater",
          kind: "yellow",
          x: "48%",
          y: "16%",
          rotate: "2deg",
          width: "large",
          showAt: 1,
        },
        {
          id: "patch",
          text: "Patch: pause, compare, decide, log",
          kind: "blue",
          x: "31%",
          y: "43%",
          rotate: "-1deg",
          width: "large",
          showAt: 2,
        },
        {
          id: "owner",
          text: "Owner signs the exception",
          kind: "cream",
          x: "60%",
          y: "59%",
          rotate: "4deg",
          width: "medium",
          showAt: 3,
        },
      ],
      actors: [
        {
          id: "model",
          emoji: "🤖",
          label: "draft",
          x: "23%",
          y: "53%",
          showAt: 0,
        },
        {
          id: "facilitator",
          emoji: "✋",
          label: "interrupt",
          x: "47%",
          y: "53%",
          showAt: 2,
        },
        {
          id: "owner",
          emoji: "🧑‍⚖️",
          label: "owner",
          x: "72%",
          y: "49%",
          showAt: 3,
        },
      ],
      beats: [
        {
          id: 0,
          action: "Risk trigger is circled",
          title: "Find the uncertainty peak",
          body: "The loop starts with a concrete trigger.",
        },
        {
          id: 1,
          action: "Judgment request replaces blanket approval",
          title: "Ask for judgment",
          body: "The human turn has a specific question.",
        },
        {
          id: 2,
          action: "Blue patch note lands on the board",
          title: "Install the patch",
          body: "The retrofit adds one durable interrupt.",
        },
        {
          id: 3,
          action: "Owner signs the exception",
          title: "Make ownership visible",
          body: "Every override leaves a named trace.",
        },
      ],
    },
    {
      eyebrow: "Scene 04 / shared rhythm",
      title: "Turn the patch into a rhythm",
      body: "The loop works when the same small review habit repeats, improves the model, and gives people a shared tempo.",
      boardLabel: "Shared rhythm",
      caption: "A cadence beats a heroic reviewer.",
      notes: [
        {
          id: "observe",
          text: "Observe a live exception",
          kind: "yellow",
          x: "12%",
          y: "22%",
          rotate: "-2deg",
          width: "medium",
          showAt: 0,
        },
        {
          id: "label",
          text: "Label why it needed a person",
          kind: "blue",
          x: "43%",
          y: "17%",
          rotate: "3deg",
          width: "medium",
          showAt: 1,
        },
        {
          id: "adjust",
          text: "Adjust prompt, policy, or queue",
          kind: "green",
          x: "65%",
          y: "37%",
          rotate: "-4deg",
          width: "medium",
          showAt: 2,
        },
        {
          id: "share",
          text: "Share one weekly board photo",
          kind: "cream",
          x: "35%",
          y: "60%",
          rotate: "2deg",
          width: "large",
          showAt: 3,
        },
      ],
      actors: [
        {
          id: "team",
          emoji: "👥",
          label: "team",
          x: "21%",
          y: "46%",
          showAt: 0,
        },
        {
          id: "model",
          emoji: "🤖",
          label: "model",
          x: "50%",
          y: "41%",
          showAt: 1,
        },
        {
          id: "clock",
          emoji: "🕒",
          label: "cadence",
          x: "61%",
          y: "61%",
          showAt: 3,
        },
      ],
      beats: [
        {
          id: 0,
          action: "First rhythm note appears",
          title: "Observe",
          body: "A repeated loop starts with a live case.",
        },
        {
          id: 1,
          action: "Labeling step joins the cycle",
          title: "Label",
          body: "The reason for human input becomes training material.",
        },
        {
          id: 2,
          action: "Adjustment note completes the cycle",
          title: "Adjust",
          body: "The system changes after review.",
        },
        {
          id: 3,
          action: "Shared weekly ritual lands",
          title: "Share",
          body: "The board creates a common operating rhythm.",
        },
      ],
    },
    {
      eyebrow: "Scene 05 / open loop",
      title: "Leave one blank note on purpose",
      body: "A human loop is not finished software. It is a visible promise to keep learning where judgment still matters.",
      boardLabel: "Open loop",
      caption: "Closed enough to operate. Open enough to notice.",
      notes: [
        {
          id: "contract",
          text: "Trigger is named",
          kind: "green",
          x: "14%",
          y: "20%",
          rotate: "3deg",
          width: "medium",
          showAt: 0,
        },
        {
          id: "owner",
          text: "Owner is visible",
          kind: "yellow",
          x: "40%",
          y: "17%",
          rotate: "-2deg",
          width: "medium",
          showAt: 0,
        },
        {
          id: "cadence",
          text: "Rhythm is shared",
          kind: "blue",
          x: "62%",
          y: "25%",
          rotate: "4deg",
          width: "medium",
          showAt: 1,
        },
        {
          id: "blank",
          text: "Next unknown:",
          kind: "cream",
          x: "33%",
          y: "52%",
          rotate: "-3deg",
          width: "large",
          showAt: 2,
        },
      ],
      actors: [
        {
          id: "loop",
          emoji: "🔁",
          label: "loop",
          x: "21%",
          y: "51%",
          showAt: 0,
        },
        {
          id: "question",
          emoji: "❔",
          label: "next",
          x: "63%",
          y: "54%",
          showAt: 2,
        },
      ],
      beats: [
        {
          id: 0,
          action: "Operating contract notes appear",
          title: "Stable loop",
          body: "The retrofit has a visible operating shape.",
        },
        {
          id: 1,
          action: "Shared rhythm note joins",
          title: "Shared habit",
          body: "The team knows when the loop runs.",
        },
        {
          id: 2,
          action: "Blank sticky leaves the loop open",
          title: "Open question",
          body: "The system keeps room for new judgment.",
        },
      ],
    },
  ],
  zh: [
    {
      eyebrow: "场景 01 / 混乱白板",
      title: "回路已经在场",
      body: "人、模型和队列已经在一起做判断。真正的问题是：交接点没人看得见。",
      boardLabel: "无人认领的人机回路",
      caption: "改造的第一步，是把混乱说清楚，而不是责备它。",
      notes: [
        {
          id: "support-pings",
          text: "客服问题以截图形式涌入",
          kind: "yellow",
          x: "10%",
          y: "15%",
          rotate: "-4deg",
          width: "medium",
          showAt: 0,
        },
        {
          id: "model-guess",
          text: "模型猜意图，然后等待",
          kind: "blue",
          x: "41%",
          y: "19%",
          rotate: "3deg",
          width: "medium",
          showAt: 0,
        },
        {
          id: "review-memory",
          text: "审核者记得上次例外",
          kind: "cream",
          x: "65%",
          y: "13%",
          rotate: "-2deg",
          width: "large",
          showAt: 1,
        },
        {
          id: "risk-circle",
          text: "决策负责人是隐含的",
          kind: "red",
          x: "27%",
          y: "48%",
          rotate: "5deg",
          width: "medium",
          showAt: 2,
        },
        {
          id: "edge-case",
          text: "边界案例下周又回来",
          kind: "green",
          x: "57%",
          y: "55%",
          rotate: "-3deg",
          width: "small",
          showAt: 2,
        },
      ],
      actors: [
        {
          id: "user",
          emoji: "🙋",
          label: "用户",
          x: "18%",
          y: "39%",
          showAt: 0,
        },
        {
          id: "bot",
          emoji: "🤖",
          label: "模型",
          x: "47%",
          y: "41%",
          showAt: 0,
        },
        {
          id: "reviewer",
          emoji: "🧑‍💻",
          label: "审核",
          x: "73%",
          y: "39%",
          showAt: 1,
        },
      ],
      beats: [
        {
          id: 0,
          action: "混乱便签和第一组角色出现",
          title: "混乱白板",
          body: "人和模型的既有协作被摊开。",
        },
        {
          id: 1,
          action: "审核者记忆加入白板",
          title: "隐藏上下文",
          body: "流程依赖某个人记住的例外。",
        },
        {
          id: 2,
          action: "隐含负责人被标记",
          title: "无人认领的判断",
          body: "改造目标是那个看不见的决策责任。",
        },
      ],
    },
    {
      eyebrow: "场景 02 / 角色地图",
      title: "先画角色，再画流程",
      body: "有用的回路会说清楚：谁参与、谁判断、谁欠下一个人什么信号。",
      boardLabel: "角色地图",
      caption: "先不画泳道。先把真正进房间的人摆出来。",
      notes: [
        {
          id: "human-judgment",
          text: "人的判断：政策、共情、例外",
          kind: "yellow",
          x: "9%",
          y: "18%",
          rotate: "3deg",
          width: "large",
          showAt: 0,
        },
        {
          id: "machine-speed",
          text: "机器速度：起草、排序、检索",
          kind: "blue",
          x: "58%",
          y: "18%",
          rotate: "-3deg",
          width: "large",
          showAt: 0,
        },
        {
          id: "handoff",
          text: "交接信号必须显性化",
          kind: "red",
          x: "36%",
          y: "48%",
          rotate: "2deg",
          width: "medium",
          showAt: 1,
        },
        {
          id: "waiting",
          text: "等待也是系统的一部分",
          kind: "cream",
          x: "15%",
          y: "61%",
          rotate: "-4deg",
          width: "medium",
          showAt: 2,
        },
        {
          id: "audit",
          text: "审计轨迹跟着选择走",
          kind: "green",
          x: "65%",
          y: "60%",
          rotate: "4deg",
          width: "medium",
          showAt: 2,
        },
      ],
      actors: [
        {
          id: "requester",
          emoji: "🧑",
          label: "请求",
          x: "18%",
          y: "41%",
          showAt: 0,
        },
        {
          id: "model",
          emoji: "🤖",
          label: "草稿",
          x: "43%",
          y: "36%",
          showAt: 0,
        },
        {
          id: "expert",
          emoji: "🧠",
          label: "判断",
          x: "68%",
          y: "42%",
          showAt: 1,
        },
        {
          id: "ops",
          emoji: "📎",
          label: "记录",
          x: "49%",
          y: "63%",
          showAt: 2,
        },
      ],
      beats: [
        {
          id: 0,
          action: "人和机器两组角色出现",
          title: "角色地图",
          body: "每个参与者都有可见角色。",
        },
        {
          id: 1,
          action: "交接判断被标注",
          title: "决策交接",
          body: "系统说清楚什么必须在人之间移动。",
        },
        {
          id: 2,
          action: "等待和审计便签加入",
          title: "运营角色",
          body: "队列和日志成为一等参与者。",
        },
      ],
    },
    {
      eyebrow: "场景 03 / 干预点",
      title: "把一次打断放在不确定性最高处",
      body: "不要让每一步都走审核。只在人、风险和可逆性互相冲突的地方，加一次人的回合。",
      boardLabel: "干预点",
      caption: "最好的补丁，小到每次都能执行。",
      notes: [
        {
          id: "signal",
          text: "触发：低置信度 + 高用户成本",
          kind: "red",
          x: "13%",
          y: "17%",
          rotate: "-3deg",
          width: "large",
          showAt: 0,
        },
        {
          id: "ask",
          text: "要判断，不要许可表演",
          kind: "yellow",
          x: "48%",
          y: "16%",
          rotate: "2deg",
          width: "large",
          showAt: 1,
        },
        {
          id: "patch",
          text: "补丁：暂停、对比、决定、记录",
          kind: "blue",
          x: "31%",
          y: "43%",
          rotate: "-1deg",
          width: "large",
          showAt: 2,
        },
        {
          id: "owner",
          text: "负责人签下这个例外",
          kind: "cream",
          x: "60%",
          y: "59%",
          rotate: "4deg",
          width: "medium",
          showAt: 3,
        },
      ],
      actors: [
        {
          id: "model",
          emoji: "🤖",
          label: "草稿",
          x: "23%",
          y: "53%",
          showAt: 0,
        },
        {
          id: "facilitator",
          emoji: "✋",
          label: "打断",
          x: "47%",
          y: "53%",
          showAt: 2,
        },
        {
          id: "owner",
          emoji: "🧑‍⚖️",
          label: "负责",
          x: "72%",
          y: "49%",
          showAt: 3,
        },
      ],
      beats: [
        {
          id: 0,
          action: "风险触发器被圈出",
          title: "找到不确定性峰值",
          body: "回路从一个具体触发条件开始。",
        },
        {
          id: 1,
          action: "判断请求替代泛化审批",
          title: "请求判断",
          body: "人的回合有一个具体问题。",
        },
        {
          id: 2,
          action: "蓝色补丁贴上白板",
          title: "安装补丁",
          body: "改造加入一次稳定打断。",
        },
        {
          id: 3,
          action: "负责人签下例外",
          title: "责任可见",
          body: "每次覆盖都留下署名轨迹。",
        },
      ],
    },
    {
      eyebrow: "场景 04 / 共同节奏",
      title: "把补丁变成节奏",
      body: "当同一个小审核习惯反复发生、改进模型、并给团队共同节拍时，回路才真的运行。",
      boardLabel: "共同节奏",
      caption: "有节奏的机制，胜过英雄式审核。",
      notes: [
        {
          id: "observe",
          text: "观察一个真实例外",
          kind: "yellow",
          x: "12%",
          y: "22%",
          rotate: "-2deg",
          width: "medium",
          showAt: 0,
        },
        {
          id: "label",
          text: "标注为什么需要人",
          kind: "blue",
          x: "43%",
          y: "17%",
          rotate: "3deg",
          width: "medium",
          showAt: 1,
        },
        {
          id: "adjust",
          text: "调整提示词、政策或队列",
          kind: "green",
          x: "65%",
          y: "37%",
          rotate: "-4deg",
          width: "medium",
          showAt: 2,
        },
        {
          id: "share",
          text: "每周共享一张白板照片",
          kind: "cream",
          x: "35%",
          y: "60%",
          rotate: "2deg",
          width: "large",
          showAt: 3,
        },
      ],
      actors: [
        {
          id: "team",
          emoji: "👥",
          label: "团队",
          x: "21%",
          y: "46%",
          showAt: 0,
        },
        {
          id: "model",
          emoji: "🤖",
          label: "模型",
          x: "50%",
          y: "41%",
          showAt: 1,
        },
        {
          id: "clock",
          emoji: "🕒",
          label: "节拍",
          x: "61%",
          y: "61%",
          showAt: 3,
        },
      ],
      beats: [
        {
          id: 0,
          action: "第一张节奏便签出现",
          title: "观察",
          body: "重复回路从一个真实案例开始。",
        },
        {
          id: 1,
          action: "标注步骤加入循环",
          title: "标注",
          body: "人的输入原因变成训练材料。",
        },
        {
          id: 2,
          action: "调整便签完成循环",
          title: "调整",
          body: "审核之后，系统真的改变。",
        },
        {
          id: 3,
          action: "每周仪式落到白板上",
          title: "共享",
          body: "白板创造共同运行节奏。",
        },
      ],
    },
    {
      eyebrow: "场景 05 / 开放回路",
      title: "故意留下一张空白便签",
      body: "人机回路不是一次完成的软件。它是一份可见承诺：在判断仍然重要的地方继续学习。",
      boardLabel: "开放回路",
      caption: "足够闭合，可以运行；足够开放，可以察觉。",
      notes: [
        {
          id: "contract",
          text: "触发条件已命名",
          kind: "green",
          x: "14%",
          y: "20%",
          rotate: "3deg",
          width: "medium",
          showAt: 0,
        },
        {
          id: "owner",
          text: "负责人可见",
          kind: "yellow",
          x: "40%",
          y: "17%",
          rotate: "-2deg",
          width: "medium",
          showAt: 0,
        },
        {
          id: "cadence",
          text: "节奏已共享",
          kind: "blue",
          x: "62%",
          y: "25%",
          rotate: "4deg",
          width: "medium",
          showAt: 1,
        },
        {
          id: "blank",
          text: "下一个未知：",
          kind: "cream",
          x: "33%",
          y: "52%",
          rotate: "-3deg",
          width: "large",
          showAt: 2,
        },
      ],
      actors: [
        {
          id: "loop",
          emoji: "🔁",
          label: "回路",
          x: "21%",
          y: "51%",
          showAt: 0,
        },
        {
          id: "question",
          emoji: "❔",
          label: "下一个",
          x: "63%",
          y: "54%",
          showAt: 2,
        },
      ],
      beats: [
        {
          id: 0,
          action: "运行契约便签出现",
          title: "稳定回路",
          body: "改造已经有可见运行形状。",
        },
        {
          id: 1,
          action: "共同节奏便签加入",
          title: "共享习惯",
          body: "团队知道回路何时运转。",
        },
        {
          id: 2,
          action: "空白便签让回路保持开放",
          title: "开放问题",
          body: "系统为新的判断保留空间。",
        },
      ],
    },
  ],
};

function useFonts() {
  useEffect(() => {
    const id = "style-07-human-loop-retrofit-v2-fonts";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Inter:wght@500;600;700&family=Patrick+Hand&family=Noto+Sans+SC:wght@400;500;700&display=swap";
    document.head.appendChild(link);
  }, []);
}

function sceneCopy(scene: number, language: Lang): SceneCopy {
  return COPY[language][scene - 1] ?? COPY[language][0];
}

function maxBeat(scene: number, language: Lang): number {
  return sceneCopy(scene, language).beats.length - 1;
}

function clampBeat(scene: number, beat: number, language: Lang): number {
  return Math.max(0, Math.min(beat, maxBeat(scene, language)));
}

export function getMetadata(lang: Lang): StyleMetadata {
  const zh = lang === "zh";

  return {
    id: "07",
    band: "minimal-keynote",
    name: zh ? "手绘表情白板" : "Sketch Board Emoji",
    theme: zh ? "人机回路改造" : "Human Loop Retrofit",
    densityLabel: zh ? "工作坊中密度" : "Workshop Medium",
    heroScene: 3,
    colors: {
      bg: "#f4e8cf",
      ink: "#2f2a24",
      panel: "#fff5d8",
    },
    typography: {
      header: "Patrick Hand 700",
      body: "Inter 600",
    },
    tags: [
      "minimal-keynote",
      "workshop",
      "hand-drawn",
      "emoji",
      "collaboration",
      "motion",
    ],
    fonts: ["Patrick Hand", "Inter", "cjk:Noto Sans SC"],
    scenes: COPY[lang].map((item, index) => ({
      id: index + 1,
      title: item.title,
      beats: item.beats,
    })),
  };
}

function Note({ note, beat }: { note: BoardNote; beat: number }) {
  const visible = beat >= note.showAt;
  const style = {
    "--x": note.x,
    "--y": note.y,
    "--r": note.rotate,
  } as CssVars;

  return (
    <div
      className={[
        styles.note,
        styles[note.kind],
        styles[note.width ?? "medium"],
        visible ? styles.visible : styles.hidden,
      ]
        .filter(Boolean)
        .join(" ")}
      style={style}
      data-beat-layout-item="true"
    >
      <span className={styles.tape} aria-hidden="true" />
      {note.text}
    </div>
  );
}

function ActorToken({ actor, beat }: { actor: Actor; beat: number }) {
  const visible = beat >= actor.showAt;
  const style = {
    "--x": actor.x,
    "--y": actor.y,
  } as CssVars;

  return (
    <div
      className={[
        styles.actor,
        visible ? styles.visible : styles.hidden,
      ].join(" ")}
      style={style}
      data-beat-layout-item="true"
    >
      <span className={styles.actorEmoji} aria-hidden="true">
        {actor.emoji}
      </span>
      <span className={styles.actorLabel}>{actor.label}</span>
    </div>
  );
}

function ConnectorLayer({ scene, beat }: { scene: number; beat: number }) {
  return (
    <svg
      className={styles.connectorLayer}
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {scene === 1 && (
        <>
          <path className={styles.sketchPath} d="M 22 49 C 33 37, 41 39, 50 49" />
          <path className={styles.sketchPath} d="M 53 49 C 62 37, 68 39, 77 49" />
          {beat >= 2 && (
            <path className={styles.redCircle} d="M 31 61 C 28 52, 36 46, 48 48 C 61 51, 62 65, 50 69 C 39 73, 32 69, 31 61" />
          )}
        </>
      )}
      {scene === 2 && (
        <>
          <path className={styles.sketchPath} d="M 25 51 C 33 38, 39 37, 45 45" />
          {beat >= 1 && (
            <path className={styles.sketchPath} d="M 48 45 C 58 36, 66 40, 73 50" />
          )}
          {beat >= 2 && (
            <path className={styles.sketchPath} d="M 51 55 C 49 61, 50 67, 54 73" />
          )}
        </>
      )}
      {scene === 3 && (
        <>
          <path className={styles.redCircle} d="M 15 28 C 13 20, 22 14, 35 17 C 47 20, 48 31, 39 36 C 28 42, 16 37, 15 28" />
          {beat >= 2 && (
            <path className={styles.blueTapeLine} d="M 30 64 C 40 53, 52 53, 62 62" />
          )}
          {beat >= 3 && (
            <path className={styles.sketchPath} d="M 61 64 C 68 57, 73 56, 80 60" />
          )}
        </>
      )}
      {scene === 4 && (
        <>
          <path className={styles.loopPath} d="M 23 50 C 23 27, 75 26, 76 49 C 76 72, 23 73, 23 50" />
          {beat >= 1 && (
            <path className={styles.sketchPath} d="M 33 34 C 43 25, 51 26, 57 34" />
          )}
          {beat >= 2 && (
            <path className={styles.sketchPath} d="M 69 49 C 72 58, 66 66, 56 68" />
          )}
          {beat >= 3 && (
            <path className={styles.blueTapeLine} d="M 38 72 C 48 78, 58 77, 66 70" />
          )}
        </>
      )}
      {scene === 5 && (
        <>
          <path className={styles.loopPath} d="M 22 57 C 21 31, 70 27, 78 49 C 87 72, 38 78, 25 62" />
          {beat >= 2 && (
            <path className={styles.sketchPath} d="M 58 62 C 66 57, 70 58, 77 62" />
          )}
        </>
      )}
    </svg>
  );
}

function BoardScene({
  scene,
  beat,
  language,
  isActive,
  motionOff,
}: {
  scene: number;
  beat: number;
  language: Lang;
  isActive: boolean;
  motionOff: boolean;
}) {
  const content = sceneCopy(scene, language);
  const safeBeat = clampBeat(scene, beat, language);
  const { ref } = useFLIP<HTMLDivElement>({
    watch: [scene, safeBeat, language],
    disabled: motionOff || !isActive,
    duration: 540,
    easing: "cubic-bezier(0.22, 1, 0.36, 1)",
    selector: '[data-beat-layout-item="true"]',
  });

  return (
    <article className={[styles.scene, styles[`scene${scene}`]].join(" ")}>
      <header className={styles.header} data-beat-layout-item="true">
        <span className={styles.sceneNumber}>{String(scene).padStart(2, "0")}</span>
        <p className={styles.eyebrow}>{content.eyebrow}</p>
        <h1>{content.title}</h1>
        <p className={styles.body}>{content.body}</p>
      </header>

      <div
        ref={ref}
        className={styles.board}
        data-beat-layout-container="true"
        data-beat-layout-mode="motion"
      >
        <div className={styles.boardTitle} data-beat-layout-item="true">
          {content.boardLabel}
        </div>
        <ConnectorLayer scene={scene} beat={safeBeat} />
        {content.notes.map((note) => (
          <Note key={note.id} note={note} beat={safeBeat} />
        ))}
        {content.actors.map((actor) => (
          <ActorToken key={actor.id} actor={actor} beat={safeBeat} />
        ))}
        <div className={styles.caption} data-beat-layout-item="true">
          {content.caption}
        </div>
      </div>
    </article>
  );
}

function StickerNav({
  scene,
  language,
  onNavigate,
}: {
  scene: number;
  language: Lang;
  onNavigate?: (scene: number, beat: number) => void;
}) {
  const labels =
    language === "zh"
      ? ["乱", "图", "补", "节", "开"]
      : ["mess", "map", "patch", "beat", "open"];

  return (
    <nav className={styles.stickerNav} aria-label="Sketch board scene dots">
      {[1, 2, 3, 4, 5].map((item, index) => (
        <button
          key={item}
          type="button"
          className={[
            styles.navDot,
            scene === item ? styles.activeDot : "",
          ].join(" ")}
          aria-label={`Scene ${item}: ${labels[index]}`}
          aria-current={scene === item ? "step" : undefined}
          onClick={() => onNavigate?.(item, 0)}
        >
          <span>{labels[index]}</span>
        </button>
      ))}
    </nav>
  );
}

export default function HumanLoopRetrofitV2({
  scene,
  beat,
  language,
  isThumbnail,
  reducedMotion,
  onNavigate,
}: BespokeStyleProps) {
  useFonts();
  const motionOff = reducedMotion || isThumbnail;
  const activeScene = Math.max(1, Math.min(scene, 5));

  return (
    <section
      className={[styles.root, motionOff ? styles.motionOff : ""].join(" ")}
      lang={language}
      data-style-id="07"
      data-version-id="v2"
    >
      <div className={styles.paperGrain} aria-hidden="true" />
      <SpatialSceneTrack
        scene={activeScene}
        beat={clampBeat(activeScene, beat, language)}
        transitionKind="slide-x"
        transitionMap={TRANSITION_MAP}
        transitionDurationMs={760}
        reducedMotion={motionOff}
        beatLayoutModes={BEAT_LAYOUT_MODES}
        className={styles.track}
        renderScene={(sceneId, sceneBeat, isActive) => (
          <BoardScene
            scene={sceneId}
            beat={sceneBeat}
            language={language}
            isActive={isActive}
            motionOff={motionOff}
          />
        )}
      />
      {!isThumbnail && (
        <StickerNav
          scene={activeScene}
          language={language}
          onNavigate={onNavigate}
        />
      )}
    </section>
  );
}

export const humanLoopRetrofitV2Version = defineStyleVersion({
  id: "v2",
  topic: {
    en: "Human Loop",
    zh: "人机回路",
  },
  model: "GPT-5.5",
  component: HumanLoopRetrofitV2,
  getMetadata,
});

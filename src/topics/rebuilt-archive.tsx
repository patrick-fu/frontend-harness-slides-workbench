import React, { useEffect } from "react";
import {
  defineTopic,
  type TopicDefinition,
  type TopicMetadata,
  type TopicStageProps,
} from "../domain/topic";
import { useFLIP } from "../hooks/useFLIP";
import SpatialSceneTrack, {
  type BeatLayoutMode,
} from "../styles/SpatialSceneTrack";

type Lang = "en" | "zh";
type FragmentTone = "headline" | "body" | "annotation" | "stamp";

interface SceneBeatCopy {
  id: number;
  action: string;
  title: string;
  body: string;
}

interface SceneCopy {
  id: number;
  eyebrow: string;
  title: string;
  lead: string;
  note: string;
  beats: SceneBeatCopy[];
}

interface TapeSpec {
  x: number;
  y: number;
  w: number;
  h: number;
  rotate: number;
}

interface PinSpec {
  x: number;
  y: number;
}

interface FragmentSpec {
  id: string;
  scene: number;
  x: number;
  y: number;
  w: number;
  h: number;
  rotate: number;
  color: string;
  clip: number;
  z: number;
  showAt: number;
  tone: FragmentTone;
  text: Record<Lang, string>;
  subtext?: Record<Lang, string>;
  tape?: TapeSpec[];
  pin?: PinSpec;
}

const COLORS = {
  ground: "#d4bc8d",
  ink: "#2f261a",
  softInk: "#6b5037",
  line: "#573721",
  cream: "#efe2bd",
  note: "#f3e8c8",
  manila: "#d9bd82",
  indigo: "#2e5270",
  rust: "#b9513c",
  mustard: "#d5aa3f",
  olive: "#657045",
  tape: "rgba(241, 221, 176, 0.72)",
  shadow: "rgba(69, 45, 27, 0.28)",
};

const CLIPS = [
  "polygon(2% 5%, 97% 0%, 100% 92%, 89% 100%, 0% 96%)",
  "polygon(0% 8%, 86% 0%, 100% 15%, 95% 98%, 7% 100%, 2% 70%)",
  "polygon(4% 0%, 100% 6%, 92% 100%, 0% 94%)",
  "polygon(0% 0%, 94% 5%, 100% 86%, 76% 100%, 5% 95%)",
  "polygon(5% 4%, 100% 0%, 95% 70%, 100% 100%, 0% 91%)",
];

const TAPE_CLIP =
  "polygon(0% 14%, 8% 0%, 100% 8%, 95% 100%, 4% 92%)";

const TRANSITION_MAP = {
  "1->2": "scale-fade",
  "2->3": "slide-x",
  "3->4": "wipe",
  "4->5": "fade",
} as const satisfies TopicDefinition["transitionScore"];

const NAVIGATION = {
  geometry: "spatial-node",
  carrier: "archive-scrap-wheel",
  invocation: "persistent",
  feedback: "geometry-reflow",
} as const satisfies TopicDefinition["navigation"];

const BEAT_LAYOUT_MODES: Record<number, BeatLayoutMode> = {
  1: "motion",
  2: "motion",
  3: "motion",
  4: "motion",
  5: "motion",
};

const SCENES: Record<Lang, SceneCopy[]> = {
  en: [
    {
      id: 1,
      eyebrow: "Fragments",
      title: "The archive arrives as pieces",
      lead: "Edges first. Context later. Nothing agrees on a center yet.",
      note: "loose evidence, no order yet",
      beats: [
        {
          id: 0,
          action: "Loose scraps land",
          title: "Fragments",
          body: "A table fills with unclaimed evidence.",
        },
        {
          id: 1,
          action: "Labels surface",
          title: "First labels",
          body: "Dates, initials, and torn headings start to separate.",
        },
        {
          id: 2,
          action: "A pile forms",
          title: "Working pile",
          body: "The scraps make a field before they make an argument.",
        },
      ],
    },
    {
      id: 2,
      eyebrow: "Found Note",
      title: "A margin note changes the read",
      lead: "One pencil line gives the fragments a voice and a witness.",
      note: "a hand was here",
      beats: [
        {
          id: 0,
          action: "Note opens",
          title: "Found note",
          body: "A soft page appears with a sentence half spared.",
        },
        {
          id: 1,
          action: "Annotation points",
          title: "Witness mark",
          body: "The handwriting interrupts the printed record.",
        },
        {
          id: 2,
          action: "Evidence gathers",
          title: "New reading",
          body: "The surrounding scraps begin to orbit the note.",
        },
      ],
    },
    {
      id: 3,
      eyebrow: "Taped Sequence",
      title: "Three scraps hold a rough order",
      lead: "Tape does not hide the seams. It makes the sequence legible.",
      note: "pin the order, keep the seams",
      beats: [
        {
          id: 0,
          action: "First scrap fixed",
          title: "Start point",
          body: "A date becomes the first anchor.",
        },
        {
          id: 1,
          action: "Middle bridge added",
          title: "Bridge",
          body: "A torn caption carries the story across the gap.",
        },
        {
          id: 2,
          action: "End scrap taped",
          title: "Sequence",
          body: "The order is provisional, but it can now be followed.",
        },
      ],
    },
    {
      id: 4,
      eyebrow: "New Pattern",
      title: "The restored shape is not the point",
      lead: "Reassembly makes a pattern the original never had.",
      note: "not restored, recomposed",
      beats: [
        {
          id: 0,
          action: "Tiles spread",
          title: "Pattern field",
          body: "The pieces stop asking for their old positions.",
        },
        {
          id: 1,
          action: "Connection drawn",
          title: "Thread",
          body: "A hand-drawn route finds the useful adjacency.",
        },
        {
          id: 2,
          action: "Accent lands",
          title: "New grammar",
          body: "The archive becomes a pattern that can be read forward.",
        },
      ],
    },
    {
      id: 5,
      eyebrow: "Wall View",
      title: "Step back until the wall answers",
      lead: "The assembled wall keeps the cuts visible and still holds together.",
      note: "the archive holds",
      beats: [
        {
          id: 0,
          action: "Wall fills",
          title: "Wall view",
          body: "Separate scraps share one surface.",
        },
        {
          id: 1,
          action: "Wheel marks scenes",
          title: "Navigation wheel",
          body: "The small scraps become a way to revisit the path.",
        },
        {
          id: 2,
          action: "Final pattern settles",
          title: "Reassembled",
          body: "A new archive keeps every cut as evidence.",
        },
      ],
    },
  ],
  zh: [
    {
      id: 1,
      eyebrow: "碎片",
      title: "档案先以碎片抵达",
      lead: "先看见边缘，再寻找语境。此刻还没有中心。",
      note: "散落证据，尚未成序",
      beats: [
        {
          id: 0,
          action: "纸片落桌",
          title: "碎片",
          body: "未归类的证据铺开在桌面上。",
        },
        {
          id: 1,
          action: "标签浮现",
          title: "第一组标签",
          body: "日期、署名和残缺标题开始分开。",
        },
        {
          id: 2,
          action: "临时纸堆形成",
          title: "工作纸堆",
          body: "它们先形成一片场，再形成论点。",
        },
      ],
    },
    {
      id: 2,
      eyebrow: "拾得便笺",
      title: "一条边注改变读法",
      lead: "铅笔留下的半句话，让碎片拥有声音和证人。",
      note: "有人到过这里",
      beats: [
        {
          id: 0,
          action: "便笺展开",
          title: "拾得便笺",
          body: "柔软纸页露出被保留下来的半句。",
        },
        {
          id: 1,
          action: "手写标注指向",
          title: "目击标记",
          body: "手写痕迹打断了印刷记录。",
        },
        {
          id: 2,
          action: "证据聚拢",
          title: "新的读法",
          body: "周围纸片开始围绕便笺重新排列。",
        },
      ],
    },
    {
      id: 3,
      eyebrow: "胶带序列",
      title: "三张纸片撑起粗略顺序",
      lead: "胶带不掩盖接缝，只让顺序可以被追踪。",
      note: "钉住顺序，保留接缝",
      beats: [
        {
          id: 0,
          action: "固定第一张",
          title: "起点",
          body: "一个日期成为第一个锚点。",
        },
        {
          id: 1,
          action: "补上中段",
          title: "桥段",
          body: "残缺说明把故事带过断口。",
        },
        {
          id: 2,
          action: "贴上终点",
          title: "序列",
          body: "顺序仍是临时的，但已经能被跟随。",
        },
      ],
    },
    {
      id: 4,
      eyebrow: "新图案",
      title: "复原形状不是重点",
      lead: "重组生成了原件从未拥有的新图案。",
      note: "不是复原，是重组",
      beats: [
        {
          id: 0,
          action: "纸片铺成场",
          title: "图案场",
          body: "碎片不再索要旧位置。",
        },
        {
          id: 1,
          action: "画出连接",
          title: "线索",
          body: "手绘路线找到了真正有用的邻接关系。",
        },
        {
          id: 2,
          action: "重音落下",
          title: "新语法",
          body: "档案变成了可以继续阅读的图案。",
        },
      ],
    },
    {
      id: 5,
      eyebrow: "墙面总览",
      title: "退后一步，墙面开始回答",
      lead: "完成后的墙保留所有剪口，同时仍能站在一起。",
      note: "档案成立",
      beats: [
        {
          id: 0,
          action: "墙面铺满",
          title: "墙面总览",
          body: "分离的纸片共享同一片表面。",
        },
        {
          id: 1,
          action: "纸轮标记场景",
          title: "导航纸轮",
          body: "小纸片成为回看路径的方式。",
        },
        {
          id: 2,
          action: "最终图案稳定",
          title: "重组完成",
          body: "新的档案把每道剪口都保留下来。",
        },
      ],
    },
  ],
};

const FRAGMENTS: FragmentSpec[] = [
  {
    id: "s1-bleed",
    scene: 1,
    x: -5,
    y: 25,
    w: 32,
    h: 18,
    rotate: -8,
    color: COLORS.cream,
    clip: 0,
    z: 2,
    showAt: 0,
    tone: "stamp",
    text: { en: "box 17", zh: "十七号箱" },
    subtext: { en: "no index card", zh: "索引卡缺失" },
    pin: { x: 78, y: 18 },
  },
  {
    id: "s1-indigo",
    scene: 1,
    x: 20,
    y: 17,
    w: 30,
    h: 24,
    rotate: 5,
    color: COLORS.indigo,
    clip: 1,
    z: 3,
    showAt: 0,
    tone: "headline",
    text: { en: "unlabeled image", zh: "未署名影像" },
    subtext: { en: "reverse side stained", zh: "背面有污痕" },
    tape: [{ x: 56, y: -7, w: 34, h: 18, rotate: -10 }],
  },
  {
    id: "s1-rust",
    scene: 1,
    x: 58,
    y: 30,
    w: 25,
    h: 15,
    rotate: -3,
    color: COLORS.rust,
    clip: 2,
    z: 4,
    showAt: 1,
    tone: "stamp",
    text: { en: "received / late", zh: "迟到 / 收讫" },
  },
  {
    id: "s1-manila",
    scene: 1,
    x: 38,
    y: 55,
    w: 31,
    h: 13,
    rotate: 7,
    color: COLORS.mustard,
    clip: 3,
    z: 5,
    showAt: 2,
    tone: "body",
    text: { en: "receipt half with two names cut away", zh: "半张收据，两个名字被剪去" },
  },
  {
    id: "s1-note",
    scene: 1,
    x: 69,
    y: 61,
    w: 25,
    h: 17,
    rotate: -10,
    color: COLORS.note,
    clip: 4,
    z: 6,
    showAt: 2,
    tone: "annotation",
    text: { en: "start with the torn edge", zh: "从撕开的边开始" },
    pin: { x: 16, y: 18 },
  },
  {
    id: "s2-note",
    scene: 2,
    x: 26,
    y: 20,
    w: 40,
    h: 35,
    rotate: -2,
    color: COLORS.note,
    clip: 1,
    z: 4,
    showAt: 0,
    tone: "annotation",
    text: { en: "not lost, only waiting for the wall", zh: "不是遗失，只是在等一面墙" },
    subtext: { en: "pencil, folded twice", zh: "铅笔字，折过两次" },
    tape: [{ x: 6, y: -4, w: 26, h: 12, rotate: 8 }],
  },
  {
    id: "s2-blue",
    scene: 2,
    x: 55,
    y: 13,
    w: 28,
    h: 14,
    rotate: 9,
    color: COLORS.indigo,
    clip: 0,
    z: 3,
    showAt: 1,
    tone: "stamp",
    text: { en: "ledger B", zh: "账册 B" },
  },
  {
    id: "s2-rust",
    scene: 2,
    x: 8,
    y: 62,
    w: 35,
    h: 13,
    rotate: 4,
    color: COLORS.rust,
    clip: 2,
    z: 2,
    showAt: 1,
    tone: "body",
    text: { en: "the same initials appear again", zh: "相同缩写再次出现" },
  },
  {
    id: "s2-mustard",
    scene: 2,
    x: 64,
    y: 57,
    w: 25,
    h: 18,
    rotate: -6,
    color: COLORS.mustard,
    clip: 3,
    z: 5,
    showAt: 2,
    tone: "headline",
    text: { en: "witness", zh: "目击者" },
    pin: { x: 84, y: 20 },
  },
  {
    id: "s3-first",
    scene: 3,
    x: 13,
    y: 29,
    w: 21,
    h: 25,
    rotate: -7,
    color: COLORS.cream,
    clip: 0,
    z: 2,
    showAt: 0,
    tone: "headline",
    text: { en: "01 / date", zh: "01 / 日期" },
    subtext: { en: "anchor", zh: "锚点" },
    tape: [{ x: 60, y: -5, w: 30, h: 13, rotate: 7 }],
  },
  {
    id: "s3-middle",
    scene: 3,
    x: 38,
    y: 27,
    w: 23,
    h: 24,
    rotate: 4,
    color: COLORS.mustard,
    clip: 2,
    z: 3,
    showAt: 1,
    tone: "body",
    text: { en: "caption bridge", zh: "说明桥段" },
    subtext: { en: "the gap speaks", zh: "断口发声" },
    tape: [{ x: 10, y: -4, w: 28, h: 12, rotate: -8 }],
  },
  {
    id: "s3-last",
    scene: 3,
    x: 64,
    y: 30,
    w: 23,
    h: 24,
    rotate: -4,
    color: COLORS.rust,
    clip: 1,
    z: 4,
    showAt: 2,
    tone: "headline",
    text: { en: "03 / reply", zh: "03 / 回信" },
    subtext: { en: "kept with tape", zh: "由胶带固定" },
    pin: { x: 82, y: 22 },
  },
  {
    id: "s3-strip",
    scene: 3,
    x: 27,
    y: 59,
    w: 36,
    h: 11,
    rotate: 2,
    color: COLORS.indigo,
    clip: 4,
    z: 1,
    showAt: 2,
    tone: "stamp",
    text: { en: "sequence remains provisional", zh: "顺序仍为临时" },
  },
  {
    id: "s4-blue",
    scene: 4,
    x: 14,
    y: 22,
    w: 22,
    h: 17,
    rotate: -5,
    color: COLORS.indigo,
    clip: 0,
    z: 2,
    showAt: 0,
    tone: "stamp",
    text: { en: "source", zh: "来源" },
  },
  {
    id: "s4-cream",
    scene: 4,
    x: 38,
    y: 19,
    w: 21,
    h: 18,
    rotate: 4,
    color: COLORS.cream,
    clip: 1,
    z: 3,
    showAt: 0,
    tone: "body",
    text: { en: "a shape repeats where no page survives", zh: "页已缺失，形状仍在重复" },
  },
  {
    id: "s4-mustard",
    scene: 4,
    x: 62,
    y: 23,
    w: 21,
    h: 17,
    rotate: -2,
    color: COLORS.mustard,
    clip: 2,
    z: 2,
    showAt: 1,
    tone: "stamp",
    text: { en: "pattern", zh: "图案" },
    pin: { x: 14, y: 16 },
  },
  {
    id: "s4-rust",
    scene: 4,
    x: 27,
    y: 47,
    w: 22,
    h: 18,
    rotate: 5,
    color: COLORS.rust,
    clip: 3,
    z: 5,
    showAt: 2,
    tone: "headline",
    text: { en: "new grammar", zh: "新语法" },
    tape: [{ x: 58, y: -6, w: 32, h: 13, rotate: -10 }],
  },
  {
    id: "s4-note",
    scene: 4,
    x: 51,
    y: 51,
    w: 28,
    h: 18,
    rotate: -6,
    color: COLORS.note,
    clip: 4,
    z: 4,
    showAt: 2,
    tone: "annotation",
    text: { en: "read the joins, not the gaps", zh: "读连接处，不只读缺口" },
  },
  {
    id: "s5-left",
    scene: 5,
    x: 3,
    y: 22,
    w: 25,
    h: 17,
    rotate: -8,
    color: COLORS.cream,
    clip: 0,
    z: 2,
    showAt: 0,
    tone: "body",
    text: { en: "missing page becomes a hinge", zh: "缺页成为铰链" },
  },
  {
    id: "s5-blue",
    scene: 5,
    x: 25,
    y: 16,
    w: 34,
    h: 21,
    rotate: 3,
    color: COLORS.indigo,
    clip: 2,
    z: 3,
    showAt: 0,
    tone: "headline",
    text: { en: "archive wall", zh: "档案墙" },
    tape: [{ x: 64, y: -5, w: 22, h: 12, rotate: 9 }],
  },
  {
    id: "s5-rust",
    scene: 5,
    x: 57,
    y: 22,
    w: 27,
    h: 19,
    rotate: -2,
    color: COLORS.rust,
    clip: 1,
    z: 4,
    showAt: 1,
    tone: "stamp",
    text: { en: "five views", zh: "五个视角" },
    pin: { x: 80, y: 18 },
  },
  {
    id: "s5-mustard",
    scene: 5,
    x: 17,
    y: 51,
    w: 35,
    h: 14,
    rotate: 5,
    color: COLORS.mustard,
    clip: 3,
    z: 5,
    showAt: 1,
    tone: "body",
    text: { en: "the route can be walked again", zh: "这条路径可以再次走过" },
  },
  {
    id: "s5-note",
    scene: 5,
    x: 54,
    y: 53,
    w: 34,
    h: 18,
    rotate: -5,
    color: COLORS.note,
    clip: 4,
    z: 6,
    showAt: 2,
    tone: "annotation",
    text: { en: "keep every cut visible", zh: "保留每一道剪口" },
  },
  {
    id: "s5-bleed",
    scene: 5,
    x: 84,
    y: 35,
    w: 23,
    h: 25,
    rotate: 7,
    color: COLORS.olive,
    clip: 0,
    z: 1,
    showAt: 2,
    tone: "stamp",
    text: { en: "wall", zh: "墙" },
  },
];

const TITLE_LAYOUT: Record<number, { x: number; y: number; w: number; rotate: number }> = {
  1: { x: 6, y: 7, w: 46, rotate: -2 },
  2: { x: 7, y: 7, w: 45, rotate: 2 },
  3: { x: 8, y: 8, w: 48, rotate: -1 },
  4: { x: 6, y: 7, w: 43, rotate: 1 },
  5: { x: 7, y: 8, w: 46, rotate: -2 },
};

const NOTE_LAYOUT: Record<number, { x: number; y: number; w: number; rotate: number }> = {
  1: { x: 63, y: 11, w: 28, rotate: 5 },
  2: { x: 10, y: 49, w: 25, rotate: -7 },
  3: { x: 57, y: 61, w: 31, rotate: 4 },
  4: { x: 10, y: 61, w: 31, rotate: -4 },
  5: { x: 61, y: 11, w: 31, rotate: 4 },
};

function useFonts() {
  useEffect(() => {
    if (typeof document === "undefined") return;

    const id = "rebuilt-archive-fonts";
    if (document.getElementById(id)) return;

    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Kalam:wght@400;700&family=Noto+Serif+SC:wght@500;700&display=swap";
    document.head.appendChild(link);
  }, []);
}

function clampBeat(beat: number, sceneCopy: SceneCopy): number {
  return Math.max(0, Math.min(beat, sceneCopy.beats.length - 1));
}

function getSceneCopy(language: Lang, sceneId: number): SceneCopy {
  return SCENES[language].find((item) => item.id === sceneId) ?? SCENES[language][0];
}

function getSceneFragments(sceneId: number): FragmentSpec[] {
  return FRAGMENTS.filter((fragment) => fragment.scene === sceneId);
}

function paperShadow(strength = 1): string {
  const y = 0.78 * strength;
  const blur = 0.9 * strength;
  return `0.45cqw ${y}cqh ${blur}cqw ${COLORS.shadow}`;
}

function PaperGrain() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      style={{
        position: "absolute",
        inset: "0",
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        opacity: 0.3,
      }}
    >
      <path
        d="M0 12 C18 8 34 16 52 10 S82 8 100 14 M0 34 C22 28 40 38 58 32 S82 28 100 36 M0 61 C19 56 33 64 51 60 S78 58 100 63 M0 86 C24 80 43 91 64 84 S88 82 100 88"
        fill="none"
        stroke="#8a6c49"
        strokeWidth="0.18"
      />
      <g fill="#6e5136">
        <circle cx="8" cy="19" r="0.22" />
        <circle cx="18" cy="73" r="0.18" />
        <circle cx="29" cy="43" r="0.2" />
        <circle cx="44" cy="22" r="0.16" />
        <circle cx="54" cy="78" r="0.22" />
        <circle cx="68" cy="37" r="0.18" />
        <circle cx="79" cy="66" r="0.2" />
        <circle cx="92" cy="27" r="0.16" />
      </g>
    </svg>
  );
}

function StageInk({
  sceneId,
  beat,
  motionDisabled,
}: {
  sceneId: number;
  beat: number;
  motionDisabled: boolean;
}) {
  const visible = (threshold: number) => beat >= threshold;
  const styleFor = (threshold: number): React.CSSProperties => ({
    opacity: visible(threshold) ? 1 : 0,
    transition: motionDisabled ? "none" : "opacity 420ms cubic-bezier(0.22, 1, 0.36, 1)",
  });

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      style={{
        position: "absolute",
        inset: "0",
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 9,
      }}
    >
      <defs>
        <marker
          id={`archive-arrow-${sceneId}`}
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="4"
          markerHeight="4"
          orient="auto-start-reverse"
        >
          <path d="M0 0 L10 5 L0 10 Z" fill={COLORS.line} />
        </marker>
      </defs>

      {sceneId === 1 ? (
        <path
          d="M72 63 C66 54 58 50 50 56"
          fill="none"
          stroke={COLORS.line}
          strokeWidth="0.6"
          strokeLinecap="round"
          markerEnd={`url(#archive-arrow-${sceneId})`}
          style={styleFor(2)}
        />
      ) : null}

      {sceneId === 2 ? (
        <>
          <path
            d="M42 37 C51 31 59 30 68 24"
            fill="none"
            stroke={COLORS.line}
            strokeWidth="0.55"
            strokeLinecap="round"
            markerEnd={`url(#archive-arrow-${sceneId})`}
            style={styleFor(1)}
          />
          <path
            d="M37 50 C25 57 20 62 15 68"
            fill="none"
            stroke={COLORS.line}
            strokeWidth="0.5"
            strokeDasharray="2 2"
            strokeLinecap="round"
            style={styleFor(2)}
          />
        </>
      ) : null}

      {sceneId === 3 ? (
        <>
          <path
            d="M33 42 C35 41 36 41 38 41"
            fill="none"
            stroke={COLORS.line}
            strokeWidth="0.65"
            strokeDasharray="2 2"
            strokeLinecap="round"
            style={styleFor(1)}
          />
          <path
            d="M61 42 C63 42 64 42 66 43"
            fill="none"
            stroke={COLORS.line}
            strokeWidth="0.65"
            strokeDasharray="2 2"
            strokeLinecap="round"
            style={styleFor(2)}
          />
        </>
      ) : null}

      {sceneId === 4 ? (
        <path
          d="M26 57 C39 47 50 54 64 34"
          fill="none"
          stroke={COLORS.line}
          strokeWidth="0.65"
          strokeLinecap="round"
          markerEnd={`url(#archive-arrow-${sceneId})`}
          style={styleFor(1)}
        />
      ) : null}

      {sceneId === 5 ? (
        <path
          d="M17 41 C32 28 55 32 72 43 S88 61 70 71"
          fill="none"
          stroke={COLORS.line}
          strokeWidth="0.5"
          strokeDasharray="2.4 2.4"
          strokeLinecap="round"
          style={styleFor(2)}
        />
      ) : null}
    </svg>
  );
}

function Tape({ spec }: { spec: TapeSpec }) {
  return (
    <span
      aria-hidden="true"
      style={{
        position: "absolute",
        left: `${spec.x}%`,
        top: `${spec.y}%`,
        width: `${spec.w}%`,
        height: `${spec.h}%`,
        transform: `rotate(${spec.rotate}deg)`,
        background: COLORS.tape,
        clipPath: TAPE_CLIP,
        boxShadow: "0.12cqw 0.22cqh 0.3cqw rgba(80, 55, 33, 0.18)",
      }}
    />
  );
}

function Pin({ spec }: { spec: PinSpec }) {
  return (
    <span
      aria-hidden="true"
      style={{
        position: "absolute",
        left: `${spec.x}%`,
        top: `${spec.y}%`,
        width: "1.1cqw",
        height: "1.1cqw",
        transform: "translate(-50%, -50%)",
        background: COLORS.line,
        borderRadius: "50%",
        boxShadow: "0.14cqw 0.28cqh 0.28cqw rgba(60, 39, 24, 0.3)",
      }}
    />
  );
}

function PaperFragment({
  fragment,
  language,
  beat,
  motionDisabled,
}: {
  fragment: FragmentSpec;
  language: Lang;
  beat: number;
  motionDisabled: boolean;
}) {
  const isVisible = beat >= fragment.showAt;
  const isAnnotation = fragment.tone === "annotation";
  const isStamp = fragment.tone === "stamp";
  const fontFamily = isAnnotation
    ? "'Kalam', 'Marker Felt', 'Comic Sans MS', cursive"
    : language === "zh"
      ? "'Noto Serif SC', Songti SC, serif"
      : "Georgia, 'Times New Roman', serif";

  const textColor =
    fragment.color === COLORS.indigo || fragment.color === COLORS.rust
      ? COLORS.cream
      : COLORS.ink;

  return (
    <div
      data-beat-layout-item="true"
      aria-hidden={isVisible ? undefined : true}
      style={{
        position: "absolute",
        left: `${fragment.x}cqw`,
        top: `${fragment.y}cqh`,
        width: `${fragment.w}cqw`,
        minHeight: `${fragment.h}cqh`,
        zIndex: fragment.z,
        padding: isAnnotation ? "1.6cqh 1.6cqw" : "1.8cqh 1.8cqw",
        background: fragment.color,
        color: textColor,
        clipPath: CLIPS[fragment.clip],
        boxShadow: paperShadow(1 + fragment.z * 0.08),
        border: "0.1cqw solid rgba(76, 50, 30, 0.18)",
        opacity: isVisible ? 1 : 0,
        transform: `translateY(${isVisible ? "0" : "2.4cqh"}) rotate(${fragment.rotate + (isVisible ? 0 : 4)}deg)`,
        transformOrigin: "52% 48%",
        transition: motionDisabled
          ? "none"
          : "opacity 360ms cubic-bezier(0.22, 1, 0.36, 1), transform 560ms cubic-bezier(0.34, 1.56, 0.64, 1)",
        transitionDelay: motionDisabled ? "0s" : `${fragment.showAt * 80}ms`,
        fontFamily,
        letterSpacing: "0",
        pointerEvents: isVisible ? "auto" : "none",
      }}
    >
      {fragment.tape?.map((tape, index) => (
        <Tape key={`${fragment.id}-tape-${index}`} spec={tape} />
      ))}
      {fragment.pin ? <Pin spec={fragment.pin} /> : null}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          minHeight: `${Math.max(5, fragment.h - 4)}cqh`,
          flexDirection: "column",
          justifyContent: isAnnotation ? "center" : "space-between",
          gap: "1cqh",
        }}
      >
        <span
          style={{
            display: "block",
            fontSize: isAnnotation ? "2.8cqw" : isStamp ? "2.1cqw" : "2.7cqw",
            lineHeight: 1.04,
            fontWeight: fragment.tone === "body" ? 500 : 700,
          }}
        >
          {fragment.text[language]}
        </span>
        {fragment.subtext ? (
          <span
            style={{
              display: "block",
              fontSize: isAnnotation ? "1.45cqw" : "1.35cqw",
              lineHeight: 1.18,
              color: textColor,
              opacity: 0.82,
              fontFamily:
                language === "zh"
                  ? "'Noto Serif SC', Songti SC, serif"
                  : "Georgia, 'Times New Roman', serif",
            }}
          >
            {fragment.subtext[language]}
          </span>
        ) : null}
      </div>
    </div>
  );
}

function TitleScrap({
  sceneCopy,
  beat,
  language,
  motionDisabled,
}: {
  sceneCopy: SceneCopy;
  beat: number;
  language: Lang;
  motionDisabled: boolean;
}) {
  const layout = TITLE_LAYOUT[sceneCopy.id];
  const titleLift = Math.min(beat, 2) * 0.75;

  return (
    <section
      data-beat-layout-item="true"
      style={{
        position: "absolute",
        left: `${layout.x}cqw`,
        top: `${layout.y - titleLift}cqh`,
        width: `${layout.w}cqw`,
        minHeight: "16cqh",
        padding: "2.2cqh 2.4cqw 2.6cqh",
        zIndex: 12,
        background: COLORS.cream,
        color: COLORS.ink,
        clipPath: CLIPS[(sceneCopy.id + 1) % CLIPS.length],
        boxShadow: paperShadow(1.2),
        border: "0.1cqw solid rgba(76, 50, 30, 0.2)",
        transform: `rotate(${layout.rotate}deg)`,
        transition: motionDisabled
          ? "none"
          : "top 520ms cubic-bezier(0.34, 1.56, 0.64, 1)",
      }}
    >
      <p
        style={{
          margin: "0 0 0.9cqh",
          color: COLORS.rust,
          fontFamily: "'Kalam', 'Marker Felt', 'Comic Sans MS', cursive",
          fontSize: "2cqw",
          lineHeight: 1,
          fontWeight: 700,
          letterSpacing: "0",
        }}
      >
        {sceneCopy.eyebrow}
      </p>
      <h1
        style={{
          margin: "0",
          fontFamily:
            language === "zh"
              ? "'Noto Serif SC', Songti SC, serif"
              : "Georgia, 'Times New Roman', serif",
          fontSize: language === "zh" ? "4.4cqw" : "4.1cqw",
          lineHeight: language === "zh" ? 1.12 : 1.02,
          fontWeight: 700,
          letterSpacing: "0",
        }}
      >
        {sceneCopy.title}
      </h1>
      <p
        style={{
          margin: "1.3cqh 0 0",
          maxWidth: "36cqw",
          color: COLORS.softInk,
          fontFamily:
            language === "zh"
              ? "'Noto Serif SC', Songti SC, serif"
              : "Georgia, 'Times New Roman', serif",
          fontSize: "1.55cqw",
          lineHeight: 1.22,
          letterSpacing: "0",
        }}
      >
        {sceneCopy.lead}
      </p>
      <Tape spec={{ x: 72, y: -5, w: 22, h: 13, rotate: sceneCopy.id % 2 ? -8 : 9 }} />
    </section>
  );
}

function NoteScrap({
  sceneCopy,
  beat,
  motionDisabled,
}: {
  sceneCopy: SceneCopy;
  beat: number;
  motionDisabled: boolean;
}) {
  const layout = NOTE_LAYOUT[sceneCopy.id];
  const nudge = Math.min(beat, 2) * 0.55;

  return (
    <aside
      data-beat-layout-item="true"
      style={{
        position: "absolute",
        left: `${layout.x + nudge}cqw`,
        top: `${layout.y}cqh`,
        width: `${layout.w}cqw`,
        minHeight: "11cqh",
        padding: "1.6cqh 1.8cqw",
        zIndex: 15,
        background: COLORS.note,
        clipPath: CLIPS[(sceneCopy.id + 3) % CLIPS.length],
        boxShadow: paperShadow(1.35),
        border: "0.1cqw solid rgba(76, 50, 30, 0.18)",
        color: COLORS.line,
        transform: `rotate(${layout.rotate}deg)`,
        transition: motionDisabled
          ? "none"
          : "left 500ms cubic-bezier(0.34, 1.56, 0.64, 1)",
      }}
    >
      <p
        style={{
          margin: "0",
          fontFamily: "'Kalam', 'Marker Felt', 'Comic Sans MS', cursive",
          fontSize: "2.45cqw",
          lineHeight: 1.08,
          fontWeight: 700,
          letterSpacing: "0",
        }}
      >
        {sceneCopy.note}
      </p>
      <Pin spec={{ x: 88, y: 18 }} />
    </aside>
  );
}

function BeatMarkers({
  sceneCopy,
  beat,
}: {
  sceneCopy: SceneCopy;
  beat: number;
}) {
  return (
    <div
      data-beat-layout-item="true"
      aria-label="beat markers"
      style={{
        position: "absolute",
        left: "6cqw",
        bottom: "5cqh",
        zIndex: 20,
        display: "flex",
        alignItems: "center",
        gap: "0.7cqw",
      }}
    >
      {sceneCopy.beats.map((item, index) => {
        const active = index <= beat;
        return (
          <span
            key={item.id}
            title={item.title}
            style={{
              width: active ? "4.6cqw" : "2.4cqw",
              height: "2.4cqh",
              display: "grid",
              placeItems: "center",
              background: active ? COLORS.rust : COLORS.cream,
              color: active ? COLORS.cream : COLORS.softInk,
              clipPath: CLIPS[index % CLIPS.length],
              boxShadow: active ? paperShadow(0.6) : "none",
              fontFamily: "'Kalam', 'Marker Felt', 'Comic Sans MS', cursive",
              fontSize: "1.25cqw",
              fontWeight: 700,
              lineHeight: 1,
              letterSpacing: "0",
            }}
          >
            {index + 1}
          </span>
        );
      })}
    </div>
  );
}

function ScenePanel({
  sceneId,
  beat,
  language,
  isActive,
  motionDisabled,
}: {
  sceneId: number;
  beat: number;
  language: Lang;
  isActive: boolean;
  motionDisabled: boolean;
}) {
  const sceneCopy = getSceneCopy(language, sceneId);
  const safeBeat = clampBeat(beat, sceneCopy);
  const fragments = getSceneFragments(sceneId);
  const { ref } = useFLIP<HTMLDivElement>({
    watch: [sceneId, safeBeat],
    disabled: motionDisabled || !isActive,
    duration: 540,
    easing: "cubic-bezier(0.34, 1.56, 0.64, 1)",
    selector: '[data-beat-layout-item="true"]',
  });

  return (
    <div
      ref={ref}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        background: COLORS.ground,
        color: COLORS.ink,
        fontFamily:
          language === "zh"
            ? "'Noto Serif SC', Songti SC, serif"
            : "Georgia, 'Times New Roman', serif",
      }}
    >
      <PaperGrain />
      <TitleScrap
        sceneCopy={sceneCopy}
        beat={safeBeat}
        language={language}
        motionDisabled={motionDisabled}
      />
      {fragments.map((fragment) => (
        <PaperFragment
          key={fragment.id}
          fragment={fragment}
          language={language}
          beat={safeBeat}
          motionDisabled={motionDisabled || !isActive}
        />
      ))}
      <StageInk sceneId={sceneId} beat={safeBeat} motionDisabled={motionDisabled || !isActive} />
      <NoteScrap sceneCopy={sceneCopy} beat={safeBeat} motionDisabled={motionDisabled} />
      <BeatMarkers sceneCopy={sceneCopy} beat={safeBeat} />
    </div>
  );
}

const NAV_ITEMS = [
  { id: 1, x: 5.6, y: 0.4, rotate: -14, color: COLORS.cream },
  { id: 2, x: 10.3, y: 4.1, rotate: 12, color: COLORS.indigo },
  { id: 3, x: 8.1, y: 10.2, rotate: -5, color: COLORS.mustard },
  { id: 4, x: 2.7, y: 10, rotate: 16, color: COLORS.rust },
  { id: 5, x: 0.7, y: 4, rotate: -10, color: COLORS.note },
];

function ScrapWheelNav({
  scene,
  onNavigate,
  language,
}: {
  scene: number;
  onNavigate?: (scene: number, beat: number) => void;
  language: Lang;
}) {
  return (
    <nav
      aria-label={language === "zh" ? "纸片场景导航" : "paper scrap scene navigation"}
      data-topic-navigation="true"
      data-navigation-geometry={NAVIGATION.geometry}
      data-navigation-carrier={NAVIGATION.carrier}
      data-navigation-invocation={NAVIGATION.invocation}
      data-navigation-feedback={NAVIGATION.feedback}
      style={{
        position: "absolute",
        right: "5cqw",
        bottom: "5cqh",
        width: "16.5cqw",
        height: "16.5cqh",
        zIndex: 30,
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          left: "3.1cqw",
          top: "2.1cqh",
          width: "10cqw",
          height: "10cqw",
          border: "0.12cqw dashed rgba(87, 55, 33, 0.5)",
          borderRadius: "50%",
          transform: "rotate(-8deg)",
        }}
      />
      <span
        aria-hidden="true"
        style={{
          position: "absolute",
          left: "7.5cqw",
          top: "6.4cqh",
          width: "1.3cqw",
          height: "1.3cqw",
          background: COLORS.line,
          borderRadius: "50%",
          boxShadow: paperShadow(0.8),
        }}
      />
      {NAV_ITEMS.map((item) => {
        const active = item.id === scene;
        const color = active ? COLORS.rust : item.color;
        const textColor =
          color === COLORS.indigo || color === COLORS.rust ? COLORS.cream : COLORS.ink;

        return (
          <button
            key={item.id}
            type="button"
            aria-current={active ? "page" : undefined}
            aria-label={
              language === "zh"
                ? `跳转到场景 ${item.id}`
                : `Go to scene ${item.id}`
            }
            onClick={() => onNavigate?.(item.id, 0)}
            style={{
              appearance: "none",
              position: "absolute",
              left: `${item.x}cqw`,
              top: `${item.y}cqh`,
              width: active ? "5.1cqw" : "4.3cqw",
              height: active ? "4.1cqh" : "3.5cqh",
              display: "grid",
              placeItems: "center",
              border: "0.1cqw solid rgba(76, 50, 30, 0.2)",
              padding: "0",
              background: color,
              color: textColor,
              clipPath: CLIPS[(item.id + 2) % CLIPS.length],
              boxShadow: active ? paperShadow(1.1) : paperShadow(0.55),
              transform: `rotate(${item.rotate + (active ? 6 : 0)}deg)`,
              transformOrigin: "50% 50%",
              cursor: "pointer",
              fontFamily: "'Kalam', 'Marker Felt', 'Comic Sans MS', cursive",
              fontSize: active ? "1.75cqw" : "1.35cqw",
              fontWeight: 700,
              lineHeight: 1,
              letterSpacing: "0",
            }}
          >
            {item.id}
          </button>
        );
      })}
    </nav>
  );
}

function buildMetadata(lang: Lang): TopicMetadata {
  const localized = SCENES[lang];

  return {
    theme: lang === "zh" ? "重组档案" : "The Archive Reassembled",
    densityLabel: lang === "zh" ? "中高密度 / 手作" : "Medium-dense / Handmade",
    heroScene: 5,
    colors: {
      bg: COLORS.ground,
      ink: COLORS.ink,
      panel: COLORS.cream,
    },
    typography: {
      header: lang === "zh" ? "Noto Serif SC 700" : "Georgia 700",
      body: lang === "zh" ? "Noto Serif SC 500" : "Georgia 500",
    },
    tags: [
      "editorial",
      "print",
      "collage",
      "analog",
      "paper",
      "motion",
      "archive",
    ],
    fonts: ["Kalam", "Georgia", "cjk:Noto Serif SC"],
    scenes: localized.map((sceneCopy) => ({
      id: sceneCopy.id,
      title: sceneCopy.title,
      beats: sceneCopy.beats,
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
  useFonts();

  const motionDisabled = reducedMotion || isThumbnail;

  return (
    <div
      data-topic-id="rebuilt-archive"
      data-style-id="analog-cutout-collage"
      data-motion={motionDisabled ? "off" : "on"}
      style={{
        containerType: "size",
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        background: COLORS.ground,
      }}
    >
      <SpatialSceneTrack
        scene={scene}
        beat={beat}
        transitionKind="scale-fade"
        transitionMap={TRANSITION_MAP}
        transitionDurationMs={760}
        reducedMotion={motionDisabled}
        beatLayoutModes={BEAT_LAYOUT_MODES}
        renderScene={(sceneId, sceneBeat, isActive) => (
          <ScenePanel
            sceneId={sceneId}
            beat={sceneBeat}
            language={language}
            isActive={isActive}
            motionDisabled={motionDisabled}
          />
        )}
      />
      {isThumbnail ? null : (
        <ScrapWheelNav scene={scene} onNavigate={onNavigate} language={language} />
      )}
    </div>
  );
}

export default defineTopic({
  id: "rebuilt-archive",
  styleId: "analog-cutout-collage",
  title: {
    en: "Rebuilt Archive",
    zh: "重组档案",
  },
  modelId: "GPT 5.5",
  Stage: TopicStage,
  metadata,
  navigation: NAVIGATION,
  transitionScore: TRANSITION_MAP,
  evidence: {
    kind: "illustrative",
    boundary: {
      en: "Illustrative archive-reassembly scenario: fragments, dates, initials, and narrative connections are authored presentation devices, not documented archival provenance.",
      zh: "示例档案重组场景：其中碎片、日期、姓名首字母和叙事连接均为创作展示手法，并非有记录的档案来源。",
    },
    display: "envelope",
  },
});

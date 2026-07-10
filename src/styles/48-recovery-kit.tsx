import type { CSSProperties } from "react";
import type { BespokeStyleProps, StyleMetadata } from "../types";
import { useFLIP } from "../hooks/useFLIP";
import SpatialSceneTrack from "./SpatialSceneTrack";
import type { BeatLayoutMode, SceneTransitionMap } from "./SpatialSceneTrack";
import { defineStyleTopic } from "./topic";

type Lang = BespokeStyleProps["language"];
type SceneId = 1 | 2 | 3 | 4 | 5;
type PartId = "seal" | "patch" | "splint" | "signal";

interface BeatCopy {
  id: number;
  action: string;
  title: string;
  body: string;
}

interface SceneCopy {
  kicker: string;
  title: string;
  body: string;
  note: string;
  tag: string;
  beats: BeatCopy[];
}

interface PartCopy {
  label: string;
  role: string;
  mark: string;
}

interface PartSpec {
  id: PartId;
  revealBeat: number;
  orbit: CSSProperties;
  packed: CSSProperties;
  field: CSSProperties;
  fill: string;
  edge: string;
}

type StyleVars = CSSProperties &
  Record<
    | "--rk-bg"
    | "--rk-ink"
    | "--rk-muted"
    | "--rk-panel"
    | "--rk-leather"
    | "--rk-canvas"
    | "--rk-brass"
    | "--rk-olive"
    | "--rk-shadow",
    string
  >;

const SCENE_IDS: SceneId[] = [1, 2, 3, 4, 5];

const TRANSITION_MAP = {
  "1->2": "scale-fade",
  "2->3": "slide-y",
  "3->4": "wipe",
  "4->5": "hard-cut",
} satisfies SceneTransitionMap;

const BEAT_LAYOUT_MODES = {
  1: "motion",
  2: "motion",
  3: "motion",
  4: "motion",
  5: "motion",
} satisfies Partial<Record<number, BeatLayoutMode>>;

const COPY: Record<Lang, Record<SceneId, SceneCopy>> = {
  en: {
    1: {
      kicker: "Object reveal",
      title: "The Recovery Kit",
      body: "A prepared response, packed as one object you can trust under stress.",
      note: "Closed kit. Brass latch. One promise inside.",
      tag: "ready object",
      beats: [
        {
          id: 0,
          action: "Closed case arrives",
          title: "The kit becomes the thesis",
          body: "Readiness is easier to believe when it has weight.",
        },
        {
          id: 1,
          action: "Latch and label settle",
          title: "The first signal is restraint",
          body: "Nothing is scattered. Every repair has a place.",
        },
      ],
    },
    2: {
      kicker: "Parts",
      title: "Four parts, one recovery loop",
      body: "The orbit names the work before the case opens.",
      note: "Triage, patch, brace, and prove. No loose tool.",
      tag: "part orbit",
      beats: [
        {
          id: 0,
          action: "Triage seal appears",
          title: "Name the damage",
          body: "The seal marks what must be contained first.",
        },
        {
          id: 1,
          action: "Patch and splint join",
          title: "Cover the gap, hold the shape",
          body: "Soft repair and firm support arrive together.",
        },
        {
          id: 2,
          action: "Signal tag closes the orbit",
          title: "Proof travels with the kit",
          body: "A small tag carries the evidence of recovery.",
        },
      ],
    },
    3: {
      kicker: "Assembly",
      title: "Pack the repair path",
      body: "Parts settle into a sequence: isolate, patch, brace, verify.",
      note: "The layout changes by assembly, not by cut.",
      tag: "ordered tray",
      beats: [
        {
          id: 0,
          action: "Tray opens",
          title: "The tray gives every part a home",
          body: "Open space turns into a recovery order.",
        },
        {
          id: 1,
          action: "Repair parts seat",
          title: "The repair line is packed",
          body: "Patch and brace land where the hand expects them.",
        },
        {
          id: 2,
          action: "Verification tag locks in",
          title: "The last slot is proof",
          body: "The kit is not complete until the check is visible.",
        },
      ],
    },
    4: {
      kicker: "Field test",
      title: "Open at the failure line",
      body: "The kit is judged where the system bends, not where the plan looks neat.",
      note: "Lift, brace, seal, read the signal.",
      tag: "under load",
      beats: [
        {
          id: 0,
          action: "Kit opens in the field",
          title: "The object meets a real tear",
          body: "Recovery starts beside the fracture line.",
        },
        {
          id: 1,
          action: "Parts prove the repair",
          title: "The test leaves evidence",
          body: "The object returns with a marked result.",
        },
      ],
    },
    5: {
      kicker: "Kit closed",
      title: "Closed, labeled, ready",
      body: "Nothing extra remains outside the case. The response is packed for the next bend.",
      note: "A good kit ends quiet.",
      tag: "sealed",
      beats: [
        {
          id: 0,
          action: "Kit closes",
          title: "The kit returns to readiness",
          body: "The recovery system is useful because it can be carried.",
        },
      ],
    },
  },
  zh: {
    1: {
      kicker: "物件揭示",
      title: "恢复工具包",
      body: "把应对压力的能力，收进一个可拿起、可信任的物件。",
      note: "合上的包，黄铜扣，一个清楚承诺。",
      tag: "待命物件",
      beats: [
        {
          id: 0,
          action: "合上箱体进入",
          title: "工具包就是论点",
          body: "准备好这件事，有重量才更可信。",
        },
        {
          id: 1,
          action: "锁扣和标签落位",
          title: "第一个信号是克制",
          body: "没有散落工具，每个修复动作都有位置。",
        },
      ],
    },
    2: {
      kicker: "部件",
      title: "四个部件，一条恢复闭环",
      body: "环绕的部件先说明工作，再打开工具包。",
      note: "分诊、补片、支撑、验证。没有多余件。",
      tag: "部件环绕",
      beats: [
        {
          id: 0,
          action: "分诊封签出现",
          title: "先命名损伤",
          body: "封签标出最先需要收束的范围。",
        },
        {
          id: 1,
          action: "补片和夹板加入",
          title: "补住缺口，撑住形状",
          body: "柔性修补和稳定支撑一起到位。",
        },
        {
          id: 2,
          action: "信号吊牌闭合环绕",
          title: "证据随工具包移动",
          body: "一枚小吊牌带走恢复结果。",
        },
      ],
    },
    3: {
      kicker: "组装",
      title: "把修复路径装好",
      body: "部件依次落位：隔离、补片、支撑、验证。",
      note: "版式像组装一样变化，不硬切。",
      tag: "有序托盘",
      beats: [
        {
          id: 0,
          action: "托盘打开",
          title: "托盘让每个部件有归处",
          body: "空位变成恢复顺序。",
        },
        {
          id: 1,
          action: "修复部件入槽",
          title: "修复线被装进包里",
          body: "补片和支撑落在手会去找的位置。",
        },
        {
          id: 2,
          action: "验证吊牌锁入",
          title: "最后一个槽位是证据",
          body: "看得到检查，工具包才算完整。",
        },
      ],
    },
    4: {
      kicker: "现场测试",
      title: "在故障线旁打开",
      body: "工具包要在系统弯折处接受检验，而不是在漂亮计划里。",
      note: "抬起、支撑、封住、读取信号。",
      tag: "承压测试",
      beats: [
        {
          id: 0,
          action: "工具包在现场打开",
          title: "物件遇到真实裂口",
          body: "恢复从断裂线旁边开始。",
        },
        {
          id: 1,
          action: "部件证明修复有效",
          title: "测试留下证据",
          body: "物件带着标记结果返回。",
        },
      ],
    },
    5: {
      kicker: "工具包合上",
      title: "合上，贴签，待命",
      body: "没有多余部件留在外面。下一次弯折前，应对已经装好。",
      note: "好的工具包最后很安静。",
      tag: "已封存",
      beats: [
        {
          id: 0,
          action: "工具包合上",
          title: "工具包回到待命状态",
          body: "恢复系统有用，是因为它可以被带走。",
        },
      ],
    },
  },
};

const PARTS: Record<Lang, Record<PartId, PartCopy>> = {
  en: {
    seal: { label: "Triage seal", role: "name damage", mark: "01" },
    patch: { label: "Soft patch", role: "cover gap", mark: "02" },
    splint: { label: "Load splint", role: "hold shape", mark: "03" },
    signal: { label: "Signal tag", role: "prove calm", mark: "04" },
  },
  zh: {
    seal: { label: "分诊封签", role: "命名损伤", mark: "01" },
    patch: { label: "柔性补片", role: "补住缺口", mark: "02" },
    splint: { label: "承压夹板", role: "撑住形状", mark: "03" },
    signal: { label: "信号吊牌", role: "证明稳定", mark: "04" },
  },
};

const PART_SPECS: PartSpec[] = [
  {
    id: "seal",
    revealBeat: 0,
    orbit: { left: "6%", top: "12%" },
    packed: { left: "14%", top: "16%" },
    field: { left: "8%", top: "60%" },
    fill: "#d7a245",
    edge: "#8d642a",
  },
  {
    id: "patch",
    revealBeat: 1,
    orbit: { left: "70%", top: "10%" },
    packed: { left: "52%", top: "18%" },
    field: { left: "42%", top: "36%" },
    fill: "#c9895b",
    edge: "#7a4a2e",
  },
  {
    id: "splint",
    revealBeat: 1,
    orbit: { left: "76%", top: "68%" },
    packed: { left: "18%", top: "58%" },
    field: { left: "56%", top: "55%" },
    fill: "#80623f",
    edge: "#4e3a24",
  },
  {
    id: "signal",
    revealBeat: 2,
    orbit: { left: "4%", top: "66%" },
    packed: { left: "58%", top: "58%" },
    field: { left: "70%", top: "18%" },
    fill: "#66724e",
    edge: "#3f4932",
  },
];

const rootStyle: StyleVars = {
  "--rk-bg": "#efe3ce",
  "--rk-ink": "#2f261c",
  "--rk-muted": "#6d5b46",
  "--rk-panel": "#f8efd9",
  "--rk-leather": "#9f6a3f",
  "--rk-canvas": "#b9a178",
  "--rk-brass": "#c69a49",
  "--rk-olive": "#65704d",
  "--rk-shadow": "rgba(72, 48, 26, 0.24)",
  position: "relative",
  width: "100%",
  height: "100%",
  overflow: "hidden",
  containerType: "size",
  color: "var(--rk-ink)",
  background:
    "radial-gradient(circle at 20% 18%, rgba(255, 249, 226, 0.9) 0%, rgba(255, 249, 226, 0) 28%), radial-gradient(circle at 82% 74%, rgba(143, 97, 48, 0.18) 0%, rgba(143, 97, 48, 0) 32%), linear-gradient(135deg, #f3e7d1 0%, #e1caa6 100%)",
  fontFamily:
    "Avenir Next, Helvetica Neue, PingFang SC, Hiragino Sans GB, sans-serif",
  letterSpacing: "0",
};

const grainStyle: CSSProperties = {
  position: "absolute",
  inset: "0",
  pointerEvents: "none",
  opacity: 0.38,
  backgroundImage:
    "repeating-linear-gradient(90deg, rgba(76, 50, 28, 0.08) 0%, rgba(76, 50, 28, 0.08) 0.08%, rgba(255, 255, 255, 0) 0.2%, rgba(255, 255, 255, 0) 0.55%)",
  mixBlendMode: "multiply",
};

const trackStyle: CSSProperties = {
  position: "relative",
  width: "100%",
  height: "100%",
};

function clampScene(scene: number): SceneId {
  if (scene <= 1) return 1;
  if (scene >= 5) return 5;
  return scene as SceneId;
}

function clampBeat(beat: number, total: number): number {
  if (beat <= 0) return 0;
  return Math.min(beat, total - 1);
}

function motionStyle(
  visible: boolean,
  disabled: boolean,
  rest = "translate(0%, 0%) rotate(0deg)",
  start = "translate(0%, 12%) rotate(-4deg)",
): CSSProperties {
  return {
    opacity: visible ? 1 : 0,
    transform: visible ? rest : start,
    transition: disabled
      ? "none"
      : "opacity 560ms ease, transform 680ms cubic-bezier(0.2, 0.9, 0.24, 1)",
  };
}

function panelStyle(sceneId: SceneId): CSSProperties {
  const align =
    sceneId === 1 || sceneId === 5
      ? "center"
      : sceneId === 4
        ? "end"
        : "stretch";

  return {
    position: "relative",
    width: "100%",
    height: "100%",
    display: "grid",
    gridTemplateColumns: sceneId === 4 ? "42% 58%" : "58% 42%",
    gridTemplateRows: "18% 1fr",
    gap: "2.4cqw",
    padding: "7cqh 7cqw",
    alignItems: align,
  };
}

function headerStyle(sceneId: SceneId): CSSProperties {
  return {
    gridColumn: "1 / 3",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    alignSelf: "start",
    gap: "2cqw",
    opacity: sceneId === 5 ? 0.86 : 1,
  };
}

function eyebrowStyle(): CSSProperties {
  return {
    margin: "0",
    color: "var(--rk-muted)",
    fontSize: "1.15cqw",
    lineHeight: 1,
    textTransform: "uppercase",
    letterSpacing: "0",
  };
}

function titleStyle(sceneId: SceneId): CSSProperties {
  return {
    margin: "0",
    maxWidth: sceneId === 4 ? "32cqw" : "44cqw",
    fontFamily: "Georgia, Songti SC, STSong, serif",
    fontSize: sceneId === 1 ? "5.4cqw" : "3.8cqw",
    lineHeight: 0.96,
    fontWeight: 500,
    letterSpacing: "0",
  };
}

function tagStyle(): CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: "12cqw",
    minHeight: "4.2cqh",
    padding: "0.9cqh 1.4cqw",
    border: "0.12cqw solid rgba(85, 62, 35, 0.28)",
    borderRadius: "100cqw",
    color: "var(--rk-muted)",
    background: "rgba(255, 248, 228, 0.46)",
    boxShadow: "0 1.2cqh 3cqh rgba(82, 51, 26, 0.12)",
    fontSize: "1.1cqw",
    lineHeight: 1,
    textTransform: "uppercase",
    letterSpacing: "0",
    whiteSpace: "nowrap",
  };
}

function copyRailStyle(): CSSProperties {
  return {
    alignSelf: "center",
    justifySelf: "stretch",
    display: "grid",
    gap: "2.2cqh",
    padding: "3.2cqh 2.6cqw",
    borderLeft: "0.16cqw solid rgba(86, 61, 34, 0.26)",
    background:
      "linear-gradient(90deg, rgba(255, 249, 229, 0.68) 0%, rgba(255, 249, 229, 0.18) 100%)",
  };
}

function bodyStyle(): CSSProperties {
  return {
    margin: "0",
    maxWidth: "30cqw",
    color: "var(--rk-ink)",
    fontSize: "1.6cqw",
    lineHeight: 1.25,
    fontWeight: 500,
    letterSpacing: "0",
  };
}

function noteStyle(): CSSProperties {
  return {
    margin: "0",
    maxWidth: "28cqw",
    color: "var(--rk-muted)",
    fontSize: "1.08cqw",
    lineHeight: 1.35,
    letterSpacing: "0",
  };
}

function objectWellStyle(sceneId: SceneId): CSSProperties {
  return {
    position: "relative",
    alignSelf: sceneId === 4 ? "stretch" : "center",
    justifySelf: sceneId === 1 || sceneId === 5 ? "center" : "stretch",
    width: sceneId === 1 || sceneId === 5 ? "62cqw" : "54cqw",
    height: sceneId === 4 ? "66cqh" : "60cqh",
    minHeight: "50cqh",
  };
}

function KitCase({
  lang,
  beat,
  sceneId,
  reducedMotion,
}: {
  lang: Lang;
  beat: number;
  sceneId: SceneId;
  reducedMotion: boolean;
}) {
  const open = sceneId === 3 || sceneId === 4;
  const closed = sceneId === 1 || sceneId === 5;
  const revealLabel = sceneId === 1 ? beat >= 1 : true;
  const packedLevel = sceneId === 3 ? beat : sceneId === 5 ? 2 : 0;
  const title = lang === "zh" ? "恢复工具包" : "Recovery Kit";

  return (
    <div
      data-beat-layout-item="true"
      style={{
        position: "absolute",
        left: sceneId === 4 ? "5%" : "50%",
        top: sceneId === 4 ? "5%" : "50%",
        width: sceneId === 4 ? "38cqw" : "44cqw",
        height: sceneId === 4 ? "40cqh" : "48cqh",
        transform:
          sceneId === 4
            ? "rotate(-7deg)"
            : "translate(-50%, -50%) rotate(-3deg)",
        filter: "drop-shadow(0 3cqh 3.5cqh var(--rk-shadow))",
        transition: reducedMotion ? "none" : "transform 720ms ease",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: "7% 2% 4% 2%",
          borderRadius: "3cqw",
          background:
            "linear-gradient(145deg, #a87345 0%, #7f522f 48%, #5b3824 100%)",
          border: "0.22cqw solid rgba(64, 39, 22, 0.55)",
          boxShadow:
            "inset 0 1.6cqh 2.4cqh rgba(255, 235, 190, 0.26), inset 0 -2cqh 2.8cqh rgba(49, 28, 14, 0.26)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: "8%",
          right: "8%",
          top: open ? "-7%" : "0%",
          height: "34%",
          borderRadius: "2.6cqw 2.6cqw 1.5cqw 1.5cqw",
          background:
            "linear-gradient(145deg, #c1aa81 0%, #8f744e 48%, #705535 100%)",
          border: "0.18cqw solid rgba(66, 48, 28, 0.46)",
          boxShadow:
            "inset 0 1.2cqh 1.6cqh rgba(255, 246, 218, 0.3), 0 1.5cqh 2cqh rgba(62, 39, 22, 0.18)",
          transform: open
            ? "translate(0%, -48%) rotate(-5deg)"
            : "translate(0%, 0%) rotate(0deg)",
          transformOrigin: "50% 100%",
          transition: reducedMotion
            ? "none"
            : "transform 760ms cubic-bezier(0.2, 0.9, 0.24, 1), top 760ms ease",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: "9%",
            right: "9%",
            top: "24%",
            height: "14%",
            borderTop: "0.18cqw dashed rgba(66, 44, 24, 0.44)",
          }}
        />
      </div>
      <div
        style={{
          position: "absolute",
          left: "12%",
          right: "12%",
          top: "28%",
          bottom: "12%",
          borderRadius: "2.1cqw",
          background:
            "linear-gradient(135deg, rgba(246, 230, 199, 0.96) 0%, rgba(202, 174, 126, 0.96) 100%)",
          border: "0.16cqw solid rgba(68, 48, 27, 0.3)",
          opacity: open ? 1 : 0.2,
          transition: reducedMotion ? "none" : "opacity 520ms ease",
        }}
      >
        {PART_SPECS.map((part) => (
          <div
            key={part.id}
            style={{
              position: "absolute",
              ...(part.packed as CSSProperties),
              width: part.id === "splint" ? "24%" : "22%",
              height: part.id === "signal" ? "26%" : "20%",
              borderRadius: part.id === "signal" ? "1.2cqw" : "1.8cqw",
              background: part.fill,
              border: `0.12cqw solid ${part.edge}`,
              boxShadow:
                "inset 0 0.8cqh 1cqh rgba(255, 244, 211, 0.18), 0 0.8cqh 1.3cqh rgba(50, 31, 17, 0.12)",
              opacity:
                packedLevel >= part.revealBeat ||
                sceneId === 4 ||
                sceneId === 5
                  ? 1
                  : 0.18,
              transform:
                packedLevel >= part.revealBeat ||
                sceneId === 4 ||
                sceneId === 5
                  ? "translate(0%, 0%)"
                  : "translate(0%, 18%)",
              transition: reducedMotion
                ? "none"
                : "opacity 520ms ease, transform 640ms ease",
            }}
          />
        ))}
      </div>
      <div
        style={{
          position: "absolute",
          left: "38%",
          top: closed ? "43%" : "18%",
          width: "24%",
          height: "13%",
          borderRadius: "1.1cqw",
          background:
            "linear-gradient(145deg, #d8ae55 0%, #b78332 58%, #8f6124 100%)",
          border: "0.16cqw solid rgba(65, 43, 20, 0.38)",
          boxShadow:
            "inset 0 0.7cqh 0.9cqh rgba(255, 244, 202, 0.35), 0 0.8cqh 1.2cqh rgba(43, 27, 13, 0.18)",
          transition: reducedMotion ? "none" : "top 620ms ease",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: sceneId === 5 ? "18%" : "15%",
          bottom: sceneId === 5 ? "18%" : "14%",
          width: sceneId === 1 ? "34%" : "40%",
          minHeight: "8cqh",
          padding: "1.2cqh 1.2cqw",
          borderRadius: "1.1cqw",
          background: "rgba(255, 246, 222, 0.86)",
          border: "0.12cqw solid rgba(83, 58, 33, 0.28)",
          boxShadow: "0 1cqh 1.6cqh rgba(47, 32, 17, 0.15)",
          opacity: revealLabel ? 1 : 0,
          transform: revealLabel
            ? "rotate(2deg) translate(0%, 0%)"
            : "rotate(2deg) translate(0%, 18%)",
          transition: reducedMotion
            ? "none"
            : "opacity 520ms ease, transform 640ms ease",
        }}
      >
        <div
          style={{
            color: "var(--rk-muted)",
            fontSize: "0.86cqw",
            lineHeight: 1,
            textTransform: "uppercase",
            letterSpacing: "0",
          }}
        >
          {sceneId === 5 ? COPY[lang][5].tag : COPY[lang][1].tag}
        </div>
        <div
          style={{
            marginTop: "0.6cqh",
            fontFamily: "Georgia, Songti SC, STSong, serif",
            fontSize: sceneId === 1 ? "1.35cqw" : "1.2cqw",
            lineHeight: 1.08,
            letterSpacing: "0",
          }}
        >
          {title}
        </div>
      </div>
    </div>
  );
}

function PartTile({
  lang,
  spec,
  mode,
  visible,
  reducedMotion,
}: {
  lang: Lang;
  spec: PartSpec;
  mode: "orbit" | "packed" | "field";
  visible: boolean;
  reducedMotion: boolean;
}) {
  const copy = PARTS[lang][spec.id];
  const placement =
    mode === "orbit" ? spec.orbit : mode === "packed" ? spec.packed : spec.field;
  const wide = spec.id === "splint";

  return (
    <div
      data-beat-layout-item="true"
      style={{
        position: "absolute",
        ...placement,
        width: wide ? "15cqw" : "12.5cqw",
        minHeight: "10cqh",
        padding: "1.4cqh 1.1cqw",
        borderRadius: spec.id === "signal" ? "1.2cqw" : "1.8cqw",
        background:
          mode === "field"
            ? "rgba(255, 246, 221, 0.88)"
            : `linear-gradient(145deg, ${spec.fill} 0%, ${spec.edge} 100%)`,
        border: `0.14cqw solid ${spec.edge}`,
        boxShadow:
          "0 1.4cqh 2.4cqh rgba(65, 41, 22, 0.16), inset 0 0.7cqh 1cqh rgba(255, 246, 218, 0.18)",
        color: mode === "field" ? "var(--rk-ink)" : "#fff6df",
        ...motionStyle(
          visible,
          reducedMotion,
          mode === "orbit"
            ? "translate(0%, 0%) rotate(-4deg)"
            : "translate(0%, 0%) rotate(0deg)",
          mode === "orbit"
            ? "translate(0%, 22%) rotate(-12deg)"
            : "translate(0%, 18%) rotate(0deg)",
        ),
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "0.8cqw",
        }}
      >
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: "2.3cqw",
            height: "2.3cqw",
            borderRadius: "100cqw",
            background: "rgba(255, 246, 220, 0.18)",
            border: "0.1cqw solid rgba(255, 246, 220, 0.34)",
            fontSize: "0.9cqw",
            lineHeight: 1,
            letterSpacing: "0",
          }}
        >
          {copy.mark}
        </span>
        <span
          style={{
            width: "3.4cqw",
            height: "0.6cqh",
            borderRadius: "100cqw",
            background:
              mode === "field"
                ? "rgba(96, 67, 38, 0.2)"
                : "rgba(255, 246, 220, 0.32)",
          }}
        />
      </div>
      <div
        style={{
          marginTop: "1.2cqh",
          fontSize: "1.06cqw",
          lineHeight: 1.05,
          fontWeight: 700,
          letterSpacing: "0",
        }}
      >
        {copy.label}
      </div>
      <div
        style={{
          marginTop: "0.6cqh",
          color: mode === "field" ? "var(--rk-muted)" : "rgba(255, 246, 223, 0.78)",
          fontSize: "0.82cqw",
          lineHeight: 1.15,
          letterSpacing: "0",
        }}
      >
        {copy.role}
      </div>
    </div>
  );
}

function PartOrbit({
  lang,
  beat,
  reducedMotion,
}: {
  lang: Lang;
  beat: number;
  reducedMotion: boolean;
}) {
  return (
    <div
      data-beat-layout-item="true"
      style={{
        position: "absolute",
        inset: "0",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: "36cqw",
          height: "44cqh",
          border: "0.14cqw dashed rgba(89, 61, 34, 0.28)",
          borderRadius: "50%",
          transform: "translate(-50%, -50%) rotate(-8deg)",
        }}
      />
      <KitCase
        lang={lang}
        beat={beat}
        sceneId={2}
        reducedMotion={reducedMotion}
      />
      {PART_SPECS.map((part) => (
        <PartTile
          key={part.id}
          lang={lang}
          spec={part}
          mode="orbit"
          visible={beat >= part.revealBeat}
          reducedMotion={reducedMotion}
        />
      ))}
    </div>
  );
}

function AssemblyView({
  lang,
  beat,
  reducedMotion,
}: {
  lang: Lang;
  beat: number;
  reducedMotion: boolean;
}) {
  return (
    <div
      data-beat-layout-item="true"
      style={{
        position: "absolute",
        inset: "0",
      }}
    >
      <KitCase
        lang={lang}
        beat={beat}
        sceneId={3}
        reducedMotion={reducedMotion}
      />
      {PART_SPECS.map((part) => (
        <PartTile
          key={part.id}
          lang={lang}
          spec={part}
          mode="packed"
          visible={beat >= part.revealBeat}
          reducedMotion={reducedMotion}
        />
      ))}
    </div>
  );
}

function FieldTest({
  lang,
  beat,
  reducedMotion,
}: {
  lang: Lang;
  beat: number;
  reducedMotion: boolean;
}) {
  return (
    <div
      data-beat-layout-item="true"
      style={{
        position: "absolute",
        inset: "0",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: "42%",
          top: "12%",
          width: "36cqw",
          height: "50cqh",
          borderRadius: "2.2cqw",
          background:
            "linear-gradient(150deg, rgba(255, 247, 224, 0.88) 0%, rgba(211, 188, 145, 0.74) 100%)",
          border: "0.16cqw solid rgba(89, 62, 35, 0.28)",
          boxShadow: "0 2cqh 3.2cqh rgba(67, 43, 24, 0.16)",
          transform: "rotate(3deg)",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: "18%",
            top: "16%",
            width: "44%",
            height: "52%",
            borderLeft: "0.24cqw solid rgba(112, 70, 38, 0.48)",
            borderBottom: "0.24cqw solid rgba(112, 70, 38, 0.48)",
            transform: "skew(-8deg) rotate(-9deg)",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: "27%",
            top: "36%",
            width: beat >= 1 ? "34%" : "18%",
            height: "9%",
            borderRadius: "100cqw",
            background: "#c9895b",
            boxShadow: "0 0.7cqh 1.2cqh rgba(79, 48, 26, 0.14)",
            transition: reducedMotion ? "none" : "width 620ms ease",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: "12%",
            bottom: "12%",
            width: "12cqw",
            minHeight: "8cqh",
            padding: "1cqh 1cqw",
            borderRadius: "1cqw",
            background: "rgba(255, 246, 219, 0.86)",
            border: "0.12cqw solid rgba(76, 53, 31, 0.22)",
            opacity: beat >= 1 ? 1 : 0.36,
            transition: reducedMotion ? "none" : "opacity 520ms ease",
          }}
        >
          <div
            style={{
              fontSize: "0.82cqw",
              color: "var(--rk-muted)",
              textTransform: "uppercase",
              letterSpacing: "0",
              lineHeight: 1,
            }}
          >
            {lang === "zh" ? "测试" : "test"}
          </div>
          <div
            style={{
              marginTop: "0.9cqh",
              fontSize: "1.2cqw",
              lineHeight: 1.05,
              fontWeight: 700,
              letterSpacing: "0",
            }}
          >
            {beat >= 1
              ? lang === "zh"
                ? "通过"
                : "holds"
              : lang === "zh"
                ? "承压"
                : "load"}
          </div>
        </div>
      </div>
      <KitCase
        lang={lang}
        beat={beat}
        sceneId={4}
        reducedMotion={reducedMotion}
      />
      {PART_SPECS.map((part) => (
        <PartTile
          key={part.id}
          lang={lang}
          spec={part}
          mode="field"
          visible={beat >= 1 || part.id === "seal"}
          reducedMotion={reducedMotion}
        />
      ))}
    </div>
  );
}

function SceneVisual({
  lang,
  sceneId,
  beat,
  reducedMotion,
}: {
  lang: Lang;
  sceneId: SceneId;
  beat: number;
  reducedMotion: boolean;
}) {
  if (sceneId === 2) {
    return <PartOrbit lang={lang} beat={beat} reducedMotion={reducedMotion} />;
  }

  if (sceneId === 3) {
    return <AssemblyView lang={lang} beat={beat} reducedMotion={reducedMotion} />;
  }

  if (sceneId === 4) {
    return <FieldTest lang={lang} beat={beat} reducedMotion={reducedMotion} />;
  }

  return (
    <div
      data-beat-layout-item="true"
      style={{
        position: "absolute",
        inset: "0",
      }}
    >
      <KitCase
        lang={lang}
        beat={beat}
        sceneId={sceneId}
        reducedMotion={reducedMotion}
      />
      {sceneId === 1 && (
        <div
          data-beat-layout-item="true"
          style={{
            position: "absolute",
            left: "61%",
            top: "23%",
            width: "13cqw",
            minHeight: "11cqh",
            padding: "1.4cqh 1cqw",
            borderRadius: "1.2cqw",
            background: "rgba(255, 247, 223, 0.82)",
            border: "0.12cqw solid rgba(81, 57, 33, 0.26)",
            boxShadow: "0 1.4cqh 2.4cqh rgba(64, 41, 24, 0.14)",
            ...motionStyle(beat >= 1, reducedMotion),
          }}
        >
          <div
            style={{
              color: "var(--rk-muted)",
              fontSize: "0.84cqw",
              textTransform: "uppercase",
              lineHeight: 1,
              letterSpacing: "0",
            }}
          >
            {lang === "zh" ? "封签" : "seal"}
          </div>
          <div
            style={{
              marginTop: "0.8cqh",
              fontSize: "1.25cqw",
              lineHeight: 1.12,
              fontWeight: 700,
              letterSpacing: "0",
            }}
          >
            {COPY[lang][1].note}
          </div>
        </div>
      )}
    </div>
  );
}

function ScenePanel({
  sceneId,
  beat,
  language,
  isActive,
  frozen,
}: {
  sceneId: SceneId;
  beat: number;
  language: Lang;
  isActive: boolean;
  frozen: boolean;
}) {
  const scene = COPY[language][sceneId];
  const safeBeat = clampBeat(beat, scene.beats.length);
  const currentBeat = scene.beats[safeBeat];
  const { ref } = useFLIP<HTMLDivElement>({
    watch: [sceneId, safeBeat, language],
    disabled: frozen || !isActive,
    duration: 620,
    easing: "cubic-bezier(0.2, 0.9, 0.24, 1)",
    selector: '[data-beat-layout-item="true"]',
  });

  return (
    <div
      ref={ref}
      data-beat-layout-container="true"
      data-beat-layout-mode="motion"
      data-scene={sceneId}
      data-current-beat={safeBeat}
      style={panelStyle(sceneId)}
    >
      <header data-beat-layout-item="true" style={headerStyle(sceneId)}>
        <div>
          <p style={eyebrowStyle()}>{scene.kicker}</p>
          <h1 style={titleStyle(sceneId)}>{scene.title}</h1>
        </div>
        <div style={tagStyle()}>{scene.tag}</div>
      </header>
      <div data-beat-layout-item="true" style={objectWellStyle(sceneId)}>
        <SceneVisual
          lang={language}
          sceneId={sceneId}
          beat={safeBeat}
          reducedMotion={frozen}
        />
      </div>
      <aside data-beat-layout-item="true" style={copyRailStyle()}>
        <p style={bodyStyle()}>{scene.body}</p>
        <div
          style={{
            display: "grid",
            gap: "1.2cqh",
          }}
        >
          <p
            data-beat-layout-item="true"
            style={{
              margin: "0",
              color: "var(--rk-ink)",
              fontSize: "1.28cqw",
              lineHeight: 1.22,
              fontWeight: 700,
              letterSpacing: "0",
              ...motionStyle(true, frozen),
            }}
          >
            {currentBeat.title}
          </p>
          <p
            data-beat-layout-item="true"
            style={{
              ...noteStyle(),
              ...motionStyle(true, frozen),
            }}
          >
            {currentBeat.body}
          </p>
        </div>
        <p style={noteStyle()}>{scene.note}</p>
      </aside>
    </div>
  );
}

function OrbitNav({
  language,
  scene,
  onNavigate,
}: {
  language: Lang;
  scene: SceneId;
  onNavigate?: BespokeStyleProps["onNavigate"];
}) {
  const navItems = SCENE_IDS.map((id) => ({
    id,
    label: COPY[language][id].tag,
    title: COPY[language][id].kicker,
  }));
  const positions: Record<SceneId, CSSProperties> = {
    1: { left: "42%", top: "0%" },
    2: { left: "84%", top: "26%" },
    3: { left: "68%", top: "74%" },
    4: { left: "16%", top: "74%" },
    5: { left: "0%", top: "26%" },
  };

  return (
    <nav
      aria-label={language === "zh" ? "工具包部件导航" : "Recovery kit parts"}
      style={{
        position: "absolute",
        right: "3.2cqw",
        top: "50%",
        width: "16cqw",
        height: "26cqh",
        transform: "translate(0%, -50%)",
        zIndex: 5,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: "7.2cqw",
          height: "7.2cqw",
          borderRadius: "2cqw",
          transform: "translate(-50%, -50%) rotate(-8deg)",
          background:
            "linear-gradient(145deg, var(--rk-canvas) 0%, var(--rk-leather) 100%)",
          border: "0.12cqw solid rgba(65, 43, 24, 0.38)",
          boxShadow: "0 1.2cqh 2cqh rgba(59, 38, 21, 0.18)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: "13cqw",
          height: "20cqh",
          border: "0.1cqw dashed rgba(82, 58, 34, 0.34)",
          borderRadius: "50%",
          transform: "translate(-50%, -50%) rotate(-10deg)",
        }}
      />
      {navItems.map((item) => {
        const active = item.id === scene;
        return (
          <button
            key={item.id}
            type="button"
            aria-label={item.title}
            title={item.title}
            onClick={() => onNavigate?.(item.id, 0)}
            style={{
              position: "absolute",
              ...(positions[item.id] as CSSProperties),
              width: active ? "5.2cqw" : "4.4cqw",
              height: active ? "5.2cqw" : "4.4cqw",
              padding: "0",
              borderRadius: "100cqw",
              border: active
                ? "0.18cqw solid var(--rk-brass)"
                : "0.12cqw solid rgba(74, 52, 31, 0.3)",
              background: active
                ? "linear-gradient(145deg, #fff2cf 0%, #c69a49 100%)"
                : "rgba(255, 246, 223, 0.78)",
              color: "var(--rk-ink)",
              boxShadow: active
                ? "0 1.2cqh 2cqh rgba(74, 47, 23, 0.22)"
                : "0 0.8cqh 1.4cqh rgba(74, 47, 23, 0.12)",
              cursor: "pointer",
              fontSize: "1cqw",
              lineHeight: 1,
              fontWeight: 800,
              letterSpacing: "0",
              transition:
                "width 220ms ease, height 220ms ease, border 220ms ease, background 220ms ease",
            }}
          >
            {item.id}
          </button>
        );
      })}
    </nav>
  );
}

export function getMetadata(lang: Lang): StyleMetadata {
  return {
    id: "object-metaphor-hero",
    band: "text-report",
    name: lang === "zh" ? "物件隐喻主视觉" : "Object Metaphor Hero",
    theme: lang === "zh" ? "恢复工具包" : "The Recovery Kit",
    densityLabel: lang === "zh" ? "触感叙事" : "Tactile Narrative",
    heroScene: 1,
    colors: {
      bg: "#efe3ce",
      ink: "#2f261c",
      panel: "#f8efd9",
    },
    typography: {
      header: "Georgia 500",
      body: "Avenir Next 500",
    },
    tags: [
      "object-metaphor",
      "tactile",
      "warm",
      "kit",
      "assembly",
      "motion",
    ],
    fonts: ["Georgia", "Avenir Next", "cjk:Songti SC", "cjk:PingFang SC"],
    scenes: SCENE_IDS.map((id) => ({
      id,
      title: COPY[lang][id].title,
      beats: COPY[lang][id].beats,
    })),
  };
}

export default function RecoveryKitV2({
  scene,
  beat,
  language,
  isThumbnail,
  reducedMotion,
  onNavigate,
}: BespokeStyleProps) {
  const safeScene = clampScene(scene);
  const frozen = reducedMotion || isThumbnail;

  return (
    <div style={rootStyle} data-style-id="48" data-topic-origin="curated">
      <div style={grainStyle} />
      <div style={trackStyle}>
        <SpatialSceneTrack
          scene={safeScene}
          beat={beat}
          sceneIds={SCENE_IDS}
          transitionKind="scale-fade"
          transitionMap={TRANSITION_MAP}
          reducedMotion={frozen}
          beatLayoutModes={BEAT_LAYOUT_MODES}
          renderScene={(sceneId, sceneBeat, isActive) => (
            <ScenePanel
              sceneId={clampScene(sceneId)}
              beat={sceneBeat}
              language={language}
              isActive={isActive}
              frozen={frozen}
            />
          )}
        />
      </div>
      {!isThumbnail && (
        <OrbitNav
          language={language}
          scene={safeScene}
          onNavigate={onNavigate}
        />
      )}
    </div>
  );
}

export const recoveryKitTopic = defineStyleTopic({
  id: "recovery-kit",
  topic: {
    en: "Recovery Kit",
    zh: "恢复工具包",
  },
  model: "GPT 5.5",
  component: RecoveryKitV2,
  getMetadata,
});

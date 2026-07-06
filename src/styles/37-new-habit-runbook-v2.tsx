import type { CSSProperties } from "react";
import { useEffect } from "react";
import type { BespokeStyleProps, StyleMetadata } from "../types";
import SpatialSceneTrack from "./SpatialSceneTrack";
import type {
  BeatLayoutMode,
  SceneTransitionMap,
} from "./SpatialSceneTrack";
import { defineStyleVersion } from "./version";

type Lang = "en" | "zh";
type Tone = "neutral" | "command" | "warning" | "success";

interface BeatCopy {
  action: string;
  title: string;
  body: string;
}

interface ProcedureLine {
  code: string;
  label: string;
  status: string;
  tone?: Tone;
}

interface SceneCopy {
  eyebrow: string;
  title: string;
  subtitle: string;
  command: string;
  note: string;
  beats: BeatCopy[];
  lines: ProcedureLine[];
}

const TRANSITION_MAP: SceneTransitionMap = {
  "1->2": "hard-cut",
  "2->3": "slide-y",
  "3->4": "glitch",
  "4->5": "hard-cut",
};

const BEAT_LAYOUT_MODES: Record<number, BeatLayoutMode> = {
  1: "reserved",
  2: "reserved",
  3: "reserved",
  4: "reserved",
  5: "reserved",
};

const SCENE_ORDER = [1, 2, 3, 4, 5] as const;

const COPY: Record<number, Record<Lang, SceneCopy>> = {
  1: {
    en: {
      eyebrow: "01 / COMMAND",
      title: "Install the habit as a command",
      subtitle: "Pick one trigger, one slot, one tiny action.",
      command: "$ habit:init --trigger morning --size tiny",
      note: "No motivation dependency. The command owns the first move.",
      beats: [
        {
          action: "Declare the command",
          title: "Command line opens",
          body: "The habit starts with a single executable sentence.",
        },
        {
          action: "Bind the trigger",
          title: "Trigger is locked",
          body: "Attach it to a visible daily event.",
        },
        {
          action: "Reduce the action",
          title: "Action is tiny",
          body: "Make the first version too small to negotiate.",
        },
      ],
      lines: [
        {
          code: "TRIGGER",
          label: "After water hits the cup",
          status: "bound",
          tone: "command",
        },
        {
          code: "ACTION",
          label: "Two focused minutes",
          status: "tiny",
          tone: "neutral",
        },
        {
          code: "OUTPUT",
          label: "One visible mark",
          status: "ready",
          tone: "success",
        },
      ],
    },
    zh: {
      eyebrow: "01 / 命令",
      title: "把新习惯安装成一条命令",
      subtitle: "只选一个触发器、一个时段、一个极小动作。",
      command: "$ habit:init --trigger morning --size tiny",
      note: "不依赖动力。第一步由命令接管。",
      beats: [
        {
          action: "声明命令",
          title: "命令行打开",
          body: "习惯从一句可执行的话开始。",
        },
        {
          action: "绑定触发器",
          title: "触发器锁定",
          body: "把它挂到每天可见的事件后面。",
        },
        {
          action: "缩小动作",
          title: "动作足够小",
          body: "第一版小到没必要讨价还价。",
        },
      ],
      lines: [
        {
          code: "TRIGGER",
          label: "水倒进杯子之后",
          status: "已绑定",
          tone: "command",
        },
        {
          code: "ACTION",
          label: "专注两分钟",
          status: "极小",
          tone: "neutral",
        },
        {
          code: "OUTPUT",
          label: "留下一个可见标记",
          status: "就绪",
          tone: "success",
        },
      ],
    },
  },
  2: {
    en: {
      eyebrow: "02 / STEPS",
      title: "Run the procedure in fixed order",
      subtitle: "The sequence protects the habit from choice fatigue.",
      command: "$ habit:run --mode checklist",
      note: "Reserved slots stay stable while each beat arms the next step.",
      beats: [
        {
          action: "Prime the surface",
          title: "Step 01 visible",
          body: "Put the tool where the trigger happens.",
        },
        {
          action: "Execute the minimum",
          title: "Step 02 active",
          body: "Complete the smallest valid action.",
        },
        {
          action: "Record the proof",
          title: "Step 03 active",
          body: "Leave evidence before adding ambition.",
        },
        {
          action: "Reset the station",
          title: "Step 04 active",
          body: "Make tomorrow's first move cheaper.",
        },
      ],
      lines: [
        {
          code: "01",
          label: "Place the cue in the path",
          status: "arm",
          tone: "command",
        },
        {
          code: "02",
          label: "Run the tiny action",
          status: "execute",
          tone: "neutral",
        },
        {
          code: "03",
          label: "Log one proof mark",
          status: "record",
          tone: "success",
        },
        {
          code: "04",
          label: "Reset the station",
          status: "reload",
          tone: "neutral",
        },
      ],
    },
    zh: {
      eyebrow: "02 / 步骤",
      title: "按固定顺序执行流程",
      subtitle: "顺序用来抵抗选择疲劳。",
      command: "$ habit:run --mode checklist",
      note: "槽位提前预留，每个 beat 只激活下一步。",
      beats: [
        {
          action: "准备表面",
          title: "步骤 01 可见",
          body: "把工具放到触发器发生的位置。",
        },
        {
          action: "执行最小动作",
          title: "步骤 02 激活",
          body: "完成最小有效动作。",
        },
        {
          action: "记录证据",
          title: "步骤 03 激活",
          body: "先留下证据，再谈加码。",
        },
        {
          action: "重置工位",
          title: "步骤 04 激活",
          body: "让明天的第一步更便宜。",
        },
      ],
      lines: [
        {
          code: "01",
          label: "把提示放进路径",
          status: "预备",
          tone: "command",
        },
        {
          code: "02",
          label: "执行极小动作",
          status: "执行",
          tone: "neutral",
        },
        {
          code: "03",
          label: "记录一个证据点",
          status: "记录",
          tone: "success",
        },
        {
          code: "04",
          label: "重置工位",
          status: "装填",
          tone: "neutral",
        },
      ],
    },
  },
  3: {
    en: {
      eyebrow: "03 / WARNING",
      title: "Do not scale the promise",
      subtitle: "A bigger target is not progress when the loop is new.",
      command: "$ habit:guard --block ambition",
      note: "Missed runs are handled by shrink, resume, log. No drama.",
      beats: [
        {
          action: "Raise the warning",
          title: "Risk banner active",
          body: "The runbook blocks heroic upgrades.",
        },
        {
          action: "Show failure mode",
          title: "Failure mode named",
          body: "Missing once is data, not identity.",
        },
        {
          action: "Apply fallback",
          title: "Fallback armed",
          body: "Shrink the task and resume the next scheduled slot.",
        },
      ],
      lines: [
        {
          code: "RISK",
          label: "Promise grew before the loop stabilized",
          status: "blocked",
          tone: "warning",
        },
        {
          code: "IF MISS",
          label: "Shrink to the starter action",
          status: "resume",
          tone: "command",
        },
        {
          code: "IF BORED",
          label: "Keep size; improve precision",
          status: "hold",
          tone: "neutral",
        },
      ],
    },
    zh: {
      eyebrow: "03 / 警告",
      title: "不要放大承诺",
      subtitle: "循环还没稳定时，更大的目标不是进展。",
      command: "$ habit:guard --block ambition",
      note: "漏做时只做三件事：缩小、恢复、记录。不加戏。",
      beats: [
        {
          action: "升起警告",
          title: "风险条激活",
          body: "手册禁止英雄式升级。",
        },
        {
          action: "暴露失败模式",
          title: "失败模式命名",
          body: "漏做一次是数据，不是身份。",
        },
        {
          action: "启用兜底",
          title: "兜底已装填",
          body: "缩小任务，在下一个固定时段恢复。",
        },
      ],
      lines: [
        {
          code: "RISK",
          label: "循环稳定前承诺被放大",
          status: "阻断",
          tone: "warning",
        },
        {
          code: "IF MISS",
          label: "退回启动动作",
          status: "恢复",
          tone: "command",
        },
        {
          code: "IF BORED",
          label: "不加量，只提精度",
          status: "保持",
          tone: "neutral",
        },
      ],
    },
  },
  4: {
    en: {
      eyebrow: "04 / VERIFICATION",
      title: "Verify the loop, not the mood",
      subtitle: "Pass criteria are visible, binary, and boring.",
      command: "$ habit:verify --window 7d --strict",
      note: "The system passes only when the evidence survives a normal week.",
      beats: [
        {
          action: "Check cue",
          title: "Cue check passes",
          body: "The trigger appears without search.",
        },
        {
          action: "Check action",
          title: "Action check passes",
          body: "The starter action finishes inside the slot.",
        },
        {
          action: "Check evidence",
          title: "Evidence check passes",
          body: "The log shows completion, miss, and recovery.",
        },
        {
          action: "Check repeatability",
          title: "Repeat check passes",
          body: "The next run is already staged.",
        },
      ],
      lines: [
        {
          code: "PASS 01",
          label: "Cue visible at trigger point",
          status: "green",
          tone: "success",
        },
        {
          code: "PASS 02",
          label: "Tiny action completed",
          status: "green",
          tone: "success",
        },
        {
          code: "PASS 03",
          label: "Recovery path tested",
          status: "green",
          tone: "success",
        },
        {
          code: "PASS 04",
          label: "Tomorrow preloaded",
          status: "green",
          tone: "success",
        },
      ],
    },
    zh: {
      eyebrow: "04 / 验证",
      title: "验证循环，不验证心情",
      subtitle: "通过标准必须可见、二元、乏味。",
      command: "$ habit:verify --window 7d --strict",
      note: "证据能撑过普通一周，系统才算通过。",
      beats: [
        {
          action: "检查提示",
          title: "提示检查通过",
          body: "触发点出现时不需要寻找。",
        },
        {
          action: "检查动作",
          title: "动作检查通过",
          body: "启动动作能在时段内完成。",
        },
        {
          action: "检查证据",
          title: "证据检查通过",
          body: "记录里有完成、漏做和恢复。",
        },
        {
          action: "检查重复",
          title: "重复检查通过",
          body: "下一次执行已经预装。",
        },
      ],
      lines: [
        {
          code: "PASS 01",
          label: "提示在触发点可见",
          status: "绿色",
          tone: "success",
        },
        {
          code: "PASS 02",
          label: "极小动作已完成",
          status: "绿色",
          tone: "success",
        },
        {
          code: "PASS 03",
          label: "恢复路径已测试",
          status: "绿色",
          tone: "success",
        },
        {
          code: "PASS 04",
          label: "明天已预装",
          status: "绿色",
          tone: "success",
        },
      ],
    },
  },
  5: {
    en: {
      eyebrow: "05 / DONE",
      title: "Habit state: installed",
      subtitle: "The runbook is now shorter than the excuse.",
      command: "$ habit:status --installed --next tomorrow",
      note: "Close the manual. Reopen it only when the loop drifts.",
      beats: [
        {
          action: "Confirm done",
          title: "State changes to done",
          body: "The procedure has a command, steps, guard, and proof.",
        },
        {
          action: "Schedule next run",
          title: "Next run staged",
          body: "Tomorrow starts from the same small command.",
        },
      ],
      lines: [
        {
          code: "STATE",
          label: "Installed habit loop",
          status: "done",
          tone: "success",
        },
        {
          code: "NEXT",
          label: "Repeat the starter action tomorrow",
          status: "queued",
          tone: "command",
        },
      ],
    },
    zh: {
      eyebrow: "05 / 完成",
      title: "习惯状态：已安装",
      subtitle: "手册已经比借口更短。",
      command: "$ habit:status --installed --next tomorrow",
      note: "关闭手册。只有循环漂移时再打开。",
      beats: [
        {
          action: "确认完成",
          title: "状态切到完成",
          body: "流程已经具备命令、步骤、护栏和证据。",
        },
        {
          action: "安排下次执行",
          title: "下一次已预备",
          body: "明天仍从同一个小命令开始。",
        },
      ],
      lines: [
        {
          code: "STATE",
          label: "习惯循环已安装",
          status: "完成",
          tone: "success",
        },
        {
          code: "NEXT",
          label: "明天重复启动动作",
          status: "排队",
          tone: "command",
        },
      ],
    },
  },
};

const palette = {
  bg: "#080b0c",
  panel: "#121819",
  ink: "#f0f5f1",
  muted: "#86938e",
  amber: "#f5b642",
  amberSoft: "#3a2a0f",
  danger: "#ff5f57",
  ok: "#5cff9d",
};

function useFonts() {
  useEffect(() => {
    const id = "style-37-v2-fonts";
    if (document.getElementById(id)) return;

    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600;700&family=Noto+Sans+SC:wght@400;500;700&display=swap";
    document.head.appendChild(link);
  }, []);
}

function metadataScenes(lang: Lang): StyleMetadata["scenes"] {
  return SCENE_ORDER.map((id) => {
    const scene = COPY[id][lang];
    return {
      id,
      title: scene.title,
      beats: scene.beats.map((beat, index) => ({
        id: index,
        action: beat.action,
        title: beat.title,
        body: beat.body,
      })),
    };
  });
}

export function getMetadata(lang: Lang): StyleMetadata {
  return {
    id: "37",
    band: "contemporary-digital",
    name: lang === "zh" ? "操作手册" : "Operating Manual",
    theme:
      lang === "zh"
        ? "新习惯运行手册"
        : "Runbook for the New Habit",
    densityLabel: lang === "zh" ? "程序化" : "Procedural",
    heroScene: 2,
    colors: {
      bg: palette.bg,
      ink: palette.ink,
      panel: palette.panel,
    },
    typography: {
      header: "IBM Plex Mono 700",
      body: "IBM Plex Mono 400",
    },
    tags: [
      "terminal",
      "runbook",
      "industrial",
      "warning",
      "monospace",
      "procedural",
    ],
    fonts: ["IBM Plex Mono", "cjk:Noto Sans SC"],
    scenes: metadataScenes(lang),
  };
}

function getScene(scene: number, language: Lang): SceneCopy {
  return COPY[scene]?.[language] ?? COPY[1][language];
}

function getBeatIndex(scene: SceneCopy, beat: number): number {
  return Math.max(0, Math.min(beat, scene.beats.length - 1));
}

function toneColor(tone: Tone = "neutral"): string {
  if (tone === "command") return palette.amber;
  if (tone === "warning") return palette.danger;
  if (tone === "success") return palette.ok;
  return palette.ink;
}

function slotStyle(isVisible: boolean, reduce: boolean): CSSProperties {
  return {
    opacity: isVisible ? 1 : 0,
    visibility: isVisible ? "visible" : "hidden",
    transform: isVisible ? "translateY(0)" : "translateY(1.4cqh)",
    transition: reduce
      ? "none"
      : "opacity 180ms linear, transform 220ms cubic-bezier(0.16, 1, 0.3, 1)",
  };
}

function TerminalNav({
  activeScene,
  language,
  onNavigate,
}: {
  activeScene: number;
  language: Lang;
  onNavigate?: (scene: number, beat: number) => void;
}) {
  const label = language === "zh" ? "runbook 跳转" : "runbook index";

  return (
    <nav
      aria-label={label}
      style={{
        position: "absolute",
        left: "4cqw",
        right: "4cqw",
        bottom: "3.2cqh",
        height: "5.6cqh",
        display: "flex",
        alignItems: "center",
        gap: "1.1cqw",
        borderTop: `0.1cqw solid ${palette.amber}`,
        color: palette.ink,
        fontFamily:
          '"IBM Plex Mono", "Noto Sans SC", "SFMono-Regular", monospace',
        fontSize: "1.1cqw",
        letterSpacing: "0",
      }}
    >
      <span
        style={{
          color: palette.amber,
          fontWeight: 700,
          whiteSpace: "nowrap",
        }}
      >
        {language === "zh" ? "$ runbook --场景" : "$ runbook --scene"}
      </span>
      {SCENE_ORDER.map((targetScene) => {
        const active = targetScene === activeScene;
        return (
          <button
            key={targetScene}
            type="button"
            aria-current={active ? "step" : undefined}
            onClick={() => onNavigate?.(targetScene, 0)}
            style={{
              appearance: "none",
              border: `0.1cqw solid ${active ? palette.amber : palette.muted}`,
              background: active ? palette.amber : "transparent",
              color: active ? palette.bg : palette.ink,
              minWidth: "5cqw",
              height: "3.4cqh",
              padding: "0 0.9cqw",
              font: "inherit",
              fontWeight: active ? 700 : 500,
              cursor: "pointer",
            }}
          >
            [{String(targetScene).padStart(2, "0")}]
          </button>
        );
      })}
    </nav>
  );
}

function BeatRail({
  scene,
  beatIndex,
  reduce,
}: {
  scene: SceneCopy;
  beatIndex: number;
  reduce: boolean;
}) {
  return (
    <div
      data-beat-layout-item="true"
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${scene.beats.length}, 1fr)`,
        gap: "0.45cqw",
        width: "24cqw",
      }}
    >
      {scene.beats.map((item, index) => {
        const active = index <= beatIndex;
        return (
          <div
            key={item.title}
            aria-label={item.action}
            style={{
              height: "0.75cqh",
              background: active ? palette.amber : "#283030",
              transition: reduce ? "none" : "background 160ms linear",
            }}
          />
        );
      })}
    </div>
  );
}

function ProcedureTable({
  lines,
  beatIndex,
  reduce,
}: {
  lines: ProcedureLine[];
  beatIndex: number;
  reduce: boolean;
}) {
  return (
    <div
      data-beat-layout-item="true"
      style={{
        display: "grid",
        gridTemplateRows: `repeat(${lines.length}, minmax(7cqh, 1fr))`,
        border: `0.1cqw solid ${palette.muted}`,
        background: "#0d1112",
      }}
    >
      {lines.map((line, index) => {
        const visible = index <= beatIndex;
        const color = toneColor(line.tone);
        return (
          <div
            key={`${line.code}-${line.label}`}
            style={{
              ...slotStyle(visible, reduce),
              display: "grid",
              gridTemplateColumns: "10cqw 1fr 9cqw",
              alignItems: "center",
              gap: "1.4cqw",
              padding: "0 1.4cqw",
              borderBottom:
                index === lines.length - 1
                  ? "0"
                  : `0.1cqw solid ${palette.amberSoft}`,
            }}
          >
            <span
              style={{
                color,
                fontWeight: 700,
                fontSize: "1.35cqw",
                whiteSpace: "nowrap",
              }}
            >
              {line.code}
            </span>
            <span
              style={{
                color: palette.ink,
                fontSize: "1.35cqw",
                lineHeight: 1.25,
              }}
            >
              {line.label}
            </span>
            <span
              style={{
                color,
                justifySelf: "end",
                fontWeight: 700,
                fontSize: "1.1cqw",
                textTransform: "uppercase",
                whiteSpace: "nowrap",
              }}
            >
              {line.status}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function CommandBlock({
  scene,
  reduce,
}: {
  scene: SceneCopy;
  reduce: boolean;
}) {
  return (
    <div
      data-beat-layout-item="true"
      style={{
        border: `0.1cqw solid ${palette.amber}`,
        background: "#090c0d",
        padding: "1.7cqh 1.5cqw",
        minHeight: "12cqh",
        display: "grid",
        alignContent: "center",
        boxShadow: `0 0 2.2cqw ${palette.amberSoft}`,
        transition: reduce ? "none" : "box-shadow 180ms linear",
      }}
    >
      <code
        style={{
          color: palette.amber,
          fontSize: "1.65cqw",
          lineHeight: 1.35,
          fontFamily:
            '"IBM Plex Mono", "Noto Sans SC", "SFMono-Regular", monospace',
          whiteSpace: "normal",
        }}
      >
        {scene.command}
      </code>
    </div>
  );
}

function WarningHeader({
  isWarning,
}: {
  isWarning: boolean;
}) {
  return (
    <div
      data-beat-layout-item="true"
      style={{
        height: "5.4cqh",
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr 1fr",
        border: `0.1cqw solid ${isWarning ? palette.danger : palette.amber}`,
        background: isWarning
          ? `repeating-linear-gradient(135deg, ${palette.amber} 0 1.1cqw, ${palette.bg} 1.1cqw 2.2cqw)`
          : `repeating-linear-gradient(135deg, ${palette.amberSoft} 0 1.1cqw, ${palette.bg} 1.1cqw 2.2cqw)`,
      }}
    >
      <span style={{ visibility: "hidden" }}>stripe</span>
    </div>
  );
}

function ScenePanel({
  sceneId,
  beat,
  language,
  reduce,
}: {
  sceneId: number;
  beat: number;
  language: Lang;
  reduce: boolean;
}) {
  const scene = getScene(sceneId, language);
  const beatIndex = getBeatIndex(scene, beat);
  const currentBeat = scene.beats[beatIndex];
  const isWarning = sceneId === 3;
  const isDone = sceneId === 5;

  return (
    <section
      aria-label={scene.title}
      style={{
        width: "100%",
        height: "100%",
        padding: "5.6cqh 4cqw 10.5cqh",
        boxSizing: "border-box",
        color: palette.ink,
        display: "grid",
        gridTemplateRows: "5.4cqh 1fr",
        gap: "3cqh",
      }}
    >
      <WarningHeader isWarning={isWarning} />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isDone ? "1fr 31cqw" : "40cqw 1fr",
          gap: "3cqw",
          minHeight: "0",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateRows: "auto auto auto auto 1fr",
            gap: "1.8cqh",
            minWidth: "0",
          }}
        >
          <div
            data-beat-layout-item="true"
            style={{
              color: isWarning ? palette.danger : palette.amber,
              fontSize: "1.25cqw",
              fontWeight: 700,
              textTransform: "uppercase",
            }}
          >
            {scene.eyebrow}
          </div>
          <h1
            data-beat-layout-item="true"
            style={{
              margin: 0,
              color: palette.ink,
              fontSize: isDone ? "5.4cqw" : "3.7cqw",
              lineHeight: 0.95,
              fontWeight: 700,
              letterSpacing: "0",
              textTransform: "uppercase",
              maxWidth: isDone ? "54cqw" : "38cqw",
            }}
          >
            {scene.title}
          </h1>
          <p
            data-beat-layout-item="true"
            style={{
              margin: 0,
              color: palette.muted,
              fontSize: "1.5cqw",
              lineHeight: 1.35,
              maxWidth: "37cqw",
            }}
          >
            {scene.subtitle}
          </p>
          <BeatRail scene={scene} beatIndex={beatIndex} reduce={reduce} />
          <div
            data-beat-layout-item="true"
            style={{
              alignSelf: "end",
              borderLeft: `0.35cqw solid ${isWarning ? palette.danger : palette.amber}`,
              paddingLeft: "1.3cqw",
              color: palette.ink,
              fontSize: "1.35cqw",
              lineHeight: 1.35,
              maxWidth: "36cqw",
            }}
          >
            <strong
              style={{
                display: "block",
                color: toneColor(isWarning ? "warning" : isDone ? "success" : "command"),
                fontSize: "1.2cqw",
                marginBottom: "0.8cqh",
                textTransform: "uppercase",
              }}
            >
              {currentBeat.title}
            </strong>
            {currentBeat.body}
          </div>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateRows: "auto 1fr auto",
            gap: "2cqh",
            minWidth: "0",
            minHeight: "0",
          }}
        >
          <CommandBlock scene={scene} reduce={reduce} />
          <ProcedureTable
            lines={scene.lines}
            beatIndex={beatIndex}
            reduce={reduce}
          />
          <div
            data-beat-layout-item="true"
            style={{
              border: `0.1cqw solid ${palette.amberSoft}`,
              color: palette.muted,
              background: "#0b0f10",
              minHeight: "8cqh",
              padding: "1.3cqh 1.2cqw",
              fontSize: "1.15cqw",
              lineHeight: 1.35,
              display: "flex",
              alignItems: "center",
            }}
          >
            {scene.note}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function NewHabitRunbookV2({
  scene,
  beat,
  language,
  isThumbnail,
  reducedMotion,
  onNavigate,
}: BespokeStyleProps) {
  useFonts();
  const reduce = reducedMotion || isThumbnail;

  return (
    <div
      style={
        {
          "--manual-bg": palette.bg,
          "--manual-ink": palette.ink,
          "--manual-panel": palette.panel,
          "--manual-amber": palette.amber,
          width: "100%",
          height: "100%",
          position: "relative",
          overflow: "hidden",
          containerType: "size",
          background:
            "linear-gradient(180deg, #080b0c 0%, #0d1213 58%, #070909 100%)",
          color: palette.ink,
          fontFamily:
            '"IBM Plex Mono", "Noto Sans SC", "SFMono-Regular", monospace',
          letterSpacing: "0",
        } as CSSProperties
      }
      data-style-id="37"
      data-style-version="v2"
    >
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: "0",
          backgroundImage:
            "linear-gradient(rgba(245, 182, 66, 0.08) 0.1cqh, transparent 0.1cqh), linear-gradient(90deg, rgba(245, 182, 66, 0.05) 0.1cqw, transparent 0.1cqw)",
          backgroundSize: "4cqw 4cqh",
          opacity: 0.55,
        }}
      />
      <SpatialSceneTrack
        scene={scene}
        beat={beat}
        transitionKind="hard-cut"
        transitionMap={TRANSITION_MAP}
        transitionDurationMs={620}
        reducedMotion={reduce}
        beatLayoutModes={BEAT_LAYOUT_MODES}
        renderScene={(sceneId, sceneBeat, isActive) => (
          <ScenePanel
            sceneId={sceneId}
            beat={sceneBeat}
            language={language}
            reduce={reduce || !isActive}
          />
        )}
      />
      {!isThumbnail && (
        <TerminalNav
          activeScene={scene}
          language={language}
          onNavigate={onNavigate}
        />
      )}
    </div>
  );
}

export const newHabitRunbookV2Version = defineStyleVersion({
  id: "v2",
  topic: "Runbook for the New Habit",
  model: "GPT-5",
  component: NewHabitRunbookV2,
  getMetadata,
});

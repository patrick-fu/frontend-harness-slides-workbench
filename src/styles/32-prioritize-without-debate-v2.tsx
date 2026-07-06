import type React from "react";
import type { BespokeStyleProps, StyleMetadata } from "../types";
import { useFLIP } from "../hooks/useFLIP";
import SpatialSceneTrack, {
  type BeatLayoutMode,
  type SceneTransitionMap,
} from "./SpatialSceneTrack";
import { defineStyleVersion } from "./version";

type Lang = "en" | "zh";
type Accent = "blue" | "gold" | "green" | "red" | "violet";
type SceneCopy = {
  kicker: string;
  title: string;
  body: string;
  callout: string;
  labels: string[];
  beats: Array<{ action: string; title: string; body: string }>;
};

const ACCENTS: Record<Accent, string> = {
  blue: "#39a7ff",
  gold: "#ffd23f",
  green: "#80f05a",
  red: "#ff5548",
  violet: "#a269ff",
};

const SCENES: Record<number, Record<Lang, SceneCopy>> = {
  1: {
    en: {
      kicker: "HOPPER",
      title: "Collect every candidate before anyone argues.",
      body: "The machine accepts raw options first. No ranking at the gate.",
      callout: "Inputs are cheap until scored.",
      labels: ["Inbox", "Ideas", "No debate"],
      beats: [
        {
          action: "Open the hopper",
          title: "Open intake",
          body: "Every candidate enters the same chute.",
        },
        {
          action: "Drop candidate balls",
          title: "Drop options",
          body: "The room sees inputs, not owners.",
        },
        {
          action: "Lock the gate",
          title: "Lock debate out",
          body: "Argument waits until the scores exist.",
        },
      ],
    },
    zh: {
      kicker: "进料斗",
      title: "先收集所有候选项，再开始讨论。",
      body: "机器先接收原始选项。入口不排名，也不抢话语权。",
      callout: "未评分前，输入成本很低。",
      labels: ["收件口", "想法", "不争论"],
      beats: [
        {
          action: "打开进料斗",
          title: "打开入口",
          body: "所有候选项进入同一条通道。",
        },
        {
          action: "投入候选球",
          title: "投入选项",
          body: "房间里看到的是输入，不是提出者。",
        },
        {
          action: "锁住争论门",
          title: "争论先停",
          body: "等分数出来，再讨论例外。",
        },
      ],
    },
  },
  2: {
    en: {
      kicker: "SCORE LANES",
      title: "Each lane asks one question and adds one weight.",
      body: "Impact, urgency, confidence, and effort become visible rails.",
      callout: "A loud opinion cannot skip a lane.",
      labels: ["Impact", "Urgency", "Confidence", "Effort"],
      beats: [
        {
          action: "Light the impact lane",
          title: "Impact lane",
          body: "Will this move the outcome?",
        },
        {
          action: "Add urgency and confidence",
          title: "Urgency plus confidence",
          body: "Is timing real, and do we trust the signal?",
        },
        {
          action: "Subtract effort",
          title: "Effort friction",
          body: "High cost pulls the total back down.",
        },
      ],
    },
    zh: {
      kicker: "评分通道",
      title: "每条通道只问一个问题，只加一个权重。",
      body: "影响、紧急度、信心和成本变成可见轨道。",
      callout: "声音再大，也不能跳过通道。",
      labels: ["影响", "紧急", "信心", "成本"],
      beats: [
        {
          action: "点亮影响通道",
          title: "影响通道",
          body: "它会改变结果吗？",
        },
        {
          action: "加入紧急度和信心",
          title: "紧急度与信心",
          body: "时间是否真实？信号是否可靠？",
        },
        {
          action: "扣除成本",
          title: "成本摩擦",
          body: "高成本会把总分拉回去。",
        },
      ],
    },
  },
  3: {
    en: {
      kicker: "REJECT CHUTE",
      title: "Low-fit work exits cleanly instead of lingering.",
      body: "The reject chute is not a verdict on taste. It is a rule for focus.",
      callout: "If it misses the lane, it leaves the board.",
      labels: ["Duplicate", "Unowned", "Weak signal"],
      beats: [
        {
          action: "Expose weak candidates",
          title: "Show low fit",
          body: "Candidates below threshold turn red.",
        },
        {
          action: "Route rejects away",
          title: "Route out",
          body: "Rejected work moves to a visible chute.",
        },
        {
          action: "Leave an audit trace",
          title: "Keep the reason",
          body: "A reject still records why it lost.",
        },
      ],
    },
    zh: {
      kicker: "淘汰槽",
      title: "低匹配工作干净离场，不继续占位。",
      body: "淘汰槽不是审美判决，而是聚焦规则。",
      callout: "没通过通道，就离开面板。",
      labels: ["重复", "无负责人", "弱信号"],
      beats: [
        {
          action: "暴露弱候选项",
          title: "显示低匹配",
          body: "低于阈值的候选项变红。",
        },
        {
          action: "送入淘汰槽",
          title: "送出主轨",
          body: "淘汰项进入可见的侧槽。",
        },
        {
          action: "保留审计痕迹",
          title: "保留原因",
          body: "被淘汰也要记录输在哪里。",
        },
      ],
    },
  },
  4: {
    en: {
      kicker: "WINNER BIN",
      title: "The best option lands where the team can act.",
      body: "The winner bin turns scoring into a next move, not another meeting.",
      callout: "One item becomes the default action.",
      labels: ["Now", "Next", "Parked"],
      beats: [
        {
          action: "Catch the top scorer",
          title: "Catch the winner",
          body: "The highest total drops into the bright bin.",
        },
        {
          action: "Promote the next action",
          title: "Promote action",
          body: "Ownership and first step appear together.",
        },
        {
          action: "Hold backup options",
          title: "Hold backups",
          body: "Good-but-not-now items stay visible, not debated.",
        },
      ],
    },
    zh: {
      kicker: "胜出仓",
      title: "最佳选项落到团队能行动的位置。",
      body: "胜出仓把评分转成下一步，而不是再开一次会。",
      callout: "一个事项成为默认行动。",
      labels: ["现在", "下一步", "暂存"],
      beats: [
        {
          action: "接住最高分",
          title: "接住胜出项",
          body: "总分最高的选项落入亮起的仓位。",
        },
        {
          action: "推出下一步",
          title: "推出行动",
          body: "负责人和第一步同时出现。",
        },
        {
          action: "保留备选项",
          title: "保留备选",
          body: "好但不急的事项留在可见位置，不继续争论。",
        },
      ],
    },
  },
  5: {
    en: {
      kicker: "SCOREBOARD",
      title: "The final board explains the priority without a speech.",
      body: "Scores, thresholds, and reasons remain visible after the meeting ends.",
      callout: "The scoreboard becomes the decision record.",
      labels: ["Priority A", "Priority C", "Priority D"],
      beats: [
        {
          action: "Display totals",
          title: "Show totals",
          body: "Everyone sees the same ranked board.",
        },
        {
          action: "Attach reasons",
          title: "Attach reasons",
          body: "Each score keeps its short evidence trail.",
        },
        {
          action: "Freeze the decision",
          title: "Freeze priority",
          body: "The team can act without replaying the debate.",
        },
      ],
    },
    zh: {
      kicker: "记分板",
      title: "最终面板无需演讲，也能解释优先级。",
      body: "分数、阈值和原因在会后仍然可见。",
      callout: "记分板就是决策记录。",
      labels: ["优先 A", "优先 C", "优先 D"],
      beats: [
        {
          action: "展示总分",
          title: "展示总分",
          body: "所有人看到同一张排序面板。",
        },
        {
          action: "附上原因",
          title: "附上原因",
          body: "每个分数保留简短证据链。",
        },
        {
          action: "冻结决策",
          title: "冻结优先级",
          body: "团队可以行动，不必重放争论。",
        },
      ],
    },
  },
};

const BEAT_LAYOUT_MODES: Record<number, BeatLayoutMode> = {
  1: "motion",
  2: "motion",
  3: "motion",
  4: "motion",
  5: "motion",
};

const TRANSITION_MAP: SceneTransitionMap = {
  "1->2": "slide-y",
  "2->3": "wipe",
  "3->4": "glitch",
  "4->5": "hard-cut",
};

const css = (styles: React.CSSProperties): React.CSSProperties => styles;

function clampBeat(beat: number): number {
  return Math.max(0, Math.min(2, beat));
}

function showAt(beat: number, step: number): boolean {
  return beat >= step;
}

function withAlpha(hex: string, alpha: string): string {
  return `${hex}${alpha}`;
}

function sceneAccent(scene: number): Accent {
  if (scene === 1) return "blue";
  if (scene === 2) return "gold";
  if (scene === 3) return "red";
  if (scene === 4) return "green";
  return "violet";
}

function getCopy(scene: number, lang: Lang): SceneCopy {
  return SCENES[scene]?.[lang] ?? SCENES[1][lang];
}

function getMetadata(lang: Lang): StyleMetadata {
  const isZh = lang === "zh";
  return {
    id: "32",
    band: "craft-cultural",
    name: isZh ? "机械评分漏斗" : "Mechanical Scoring Funnel",
    theme: isZh ? "无需争论，优先排序" : "Prioritize Without Debate",
    densityLabel: isZh ? "中等密度" : "Medium density",
    heroScene: 5,
    colors: {
      bg: "#05080f",
      ink: "#eef5ff",
      panel: "#111722",
    },
    typography: {
      header: "Arial Black 800",
      body: "Arial 500",
    },
    tags: [
      "mechanical",
      "scoring",
      "funnel",
      "pinball",
      "prioritization",
      "energetic",
      "dark",
      "motion",
    ],
    fonts: ["Arial Black", "Arial", "ui-monospace", "cjk:PingFang SC"],
    scenes: [1, 2, 3, 4, 5].map((id) => {
      const copy = getCopy(id, lang);
      return {
        id,
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

function MarkerRail({
  scene,
  beat,
  accent,
}: {
  scene: number;
  beat: number;
  accent: string;
}) {
  return (
    <div
      data-beat-layout-item="true"
      aria-hidden="true"
      style={css({
        position: "absolute",
        left: "6.3cqw",
        bottom: "6cqh",
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "0.7cqw",
        width: "10cqw",
      })}
    >
      {[0, 1, 2].map((marker) => {
        const isActive = marker <= beat;
        return (
          <span
            key={`${scene}-beat-${marker}`}
            style={css({
              height: "0.9cqh",
              borderRadius: "99cqw",
              background: isActive ? accent : "rgba(238, 245, 255, 0.22)",
              boxShadow: isActive
                ? `0 0 1.1cqw ${withAlpha(accent, "99")}`
                : "none",
              transform: isActive ? "translateY(-0.25cqh)" : "none",
              transition: "inherit",
            })}
          />
        );
      })}
    </div>
  );
}

function PinballNav({
  scene,
  onNavigate,
  reduced,
}: {
  scene: number;
  onNavigate?: (scene: number, beat: number) => void;
  reduced: boolean;
}) {
  return (
    <nav
      aria-label="Pinball lane lights"
      style={css({
        position: "absolute",
        right: "3.2cqw",
        top: "15cqh",
        height: "70cqh",
        width: "5.5cqw",
        display: "grid",
        gridTemplateRows: "repeat(5, 1fr)",
        placeItems: "center",
        padding: "2cqh 0",
        borderRadius: "99cqw",
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))",
        border: "0.12cqw solid rgba(238,245,255,0.18)",
        boxShadow:
          "inset 0 0 2cqw rgba(255,255,255,0.06), 0 0 3cqw rgba(57,167,255,0.12)",
        zIndex: 8,
      })}
    >
      {[1, 2, 3, 4, 5].map((target) => {
        const accent = ACCENTS[sceneAccent(target)];
        const active = scene === target;
        return (
          <button
            key={target}
            type="button"
            aria-label={`Scene ${target}`}
            onClick={(event) => {
              event.stopPropagation();
              onNavigate?.(target, 0);
            }}
            style={css({
              width: active ? "2.4cqw" : "1.55cqw",
              height: active ? "2.4cqw" : "1.55cqw",
              borderRadius: "50%",
              border: `0.12cqw solid ${active ? accent : "rgba(238,245,255,0.42)"}`,
              background: active
                ? `radial-gradient(circle, #ffffff 0, ${accent} 38%, ${withAlpha(accent, "22")} 72%)`
                : "rgba(238,245,255,0.14)",
              boxShadow: active
                ? `0 0 1.8cqw ${accent}, 0 0 4cqw ${withAlpha(accent, "66")}`
                : "inset 0 0 0.7cqw rgba(255,255,255,0.08)",
              cursor: "pointer",
              transform: active ? "scale(1.08)" : "scale(1)",
              transition: reduced
                ? "none"
                : "all 320ms cubic-bezier(0.16, 1, 0.3, 1)",
            })}
          />
        );
      })}
    </nav>
  );
}

function Header({
  copy,
  accent,
  scene,
}: {
  copy: SceneCopy;
  accent: string;
  scene: number;
}) {
  return (
    <header
      data-beat-layout-item="true"
      style={css({
        position: "absolute",
        left: "6cqw",
        top: "6.2cqh",
        width: "72cqw",
        display: "grid",
        gap: "1.3cqh",
      })}
    >
      <div
        style={css({
          display: "flex",
          alignItems: "center",
          gap: "1cqw",
          color: accent,
          fontFamily:
            '"Arial Black", "PingFang SC", "Microsoft YaHei", sans-serif',
          fontSize: "1.7cqw",
          letterSpacing: "0",
          textTransform: "uppercase",
        })}
      >
        <span
          style={css({
            width: "3.3cqw",
            height: "3.3cqw",
            display: "grid",
            placeItems: "center",
            borderRadius: "50%",
            border: `0.16cqw solid ${accent}`,
            boxShadow: `0 0 1.5cqw ${withAlpha(accent, "77")}`,
            fontFamily: '"Arial Black", sans-serif',
            fontSize: "1.5cqw",
          })}
        >
          {scene}
        </span>
        {copy.kicker}
      </div>
      <h1
        style={css({
          margin: "0",
          maxWidth: "67cqw",
          color: "#eef5ff",
          fontFamily:
            '"Arial Black", "PingFang SC", "Microsoft YaHei", sans-serif',
          fontSize: "4.25cqw",
          lineHeight: 1.02,
          letterSpacing: "0",
        })}
      >
        {copy.title}
      </h1>
      <p
        style={css({
          margin: "0",
          maxWidth: "53cqw",
          color: "rgba(238,245,255,0.74)",
          fontFamily: '"Arial", "PingFang SC", "Microsoft YaHei", sans-serif',
          fontSize: "1.65cqw",
          lineHeight: 1.35,
        })}
      >
        {copy.body}
      </p>
    </header>
  );
}

function ScoreChip({
  label,
  value,
  accent,
  visible,
}: {
  label: string;
  value: string;
  accent: string;
  visible: boolean;
}) {
  return (
    <div
      data-beat-layout-item="true"
      style={css({
        position: "absolute",
        left: "6cqw",
        top: "50cqh",
        width: "25cqw",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(2cqh)",
        display: "grid",
        gap: "0.4cqh",
        padding: "1.3cqh 1cqw",
        borderRadius: "1cqw",
        background: `linear-gradient(145deg, ${withAlpha(accent, "22")}, rgba(255,255,255,0.05))`,
        border: `0.12cqw solid ${withAlpha(accent, visible ? "aa" : "44")}`,
        boxShadow: visible ? `0 0 2cqw ${withAlpha(accent, "44")}` : "none",
        transition: "inherit",
      })}
    >
      <span
        style={css({
          color: "rgba(238,245,255,0.72)",
          fontSize: "1.05cqw",
          fontFamily: '"Arial", "PingFang SC", "Microsoft YaHei", sans-serif',
          textTransform: "uppercase",
        })}
      >
        {label}
      </span>
      <strong
        style={css({
          color: accent,
          fontSize: "2.5cqw",
          fontFamily: '"Courier New", ui-monospace, monospace',
          lineHeight: 1,
          textShadow: `0 0 1cqw ${withAlpha(accent, "77")}`,
        })}
      >
        {value}
      </strong>
    </div>
  );
}

function SceneOne({
  copy,
  beat,
  accent,
}: {
  copy: SceneCopy;
  beat: number;
  accent: string;
}) {
  const balls = [
    { left: "55cqw", top: "28cqh", label: copy.labels[0], step: 0 },
    { left: "62cqw", top: "35cqh", label: copy.labels[1], step: 1 },
    { left: "70cqw", top: "29cqh", label: copy.labels[2], step: 2 },
  ];
  return (
    <>
      <div
        data-beat-layout-item="true"
        style={css({
          position: "absolute",
          right: "11cqw",
          top: "19cqh",
          width: "32cqw",
          height: "60cqh",
        })}
      >
        <div
          style={css({
            position: "absolute",
            left: "4cqw",
            top: "0",
            width: "24cqw",
            height: "26cqh",
            clipPath: "polygon(0 0, 100% 0, 78% 100%, 22% 100%)",
            background:
              "linear-gradient(180deg, rgba(57,167,255,0.34), rgba(57,167,255,0.08))",
            border: `0.2cqw solid ${accent}`,
            boxShadow: `0 0 3cqw ${withAlpha(accent, "55")}`,
          })}
        />
        <div
          style={css({
            position: "absolute",
            left: "13.7cqw",
            top: "25cqh",
            width: "4.6cqw",
            height: "26cqh",
            background:
              "linear-gradient(180deg, rgba(57,167,255,0.58), rgba(57,167,255,0.1))",
            borderLeft: `0.18cqw solid ${accent}`,
            borderRight: `0.18cqw solid ${accent}`,
            boxShadow: `0 0 2cqw ${withAlpha(accent, "44")}`,
          })}
        />
        <div
          style={css({
            position: "absolute",
            left: "8cqw",
            bottom: "0",
            width: "16cqw",
            height: "8cqh",
            borderRadius: "1.4cqw 1.4cqw 4cqw 4cqw",
            background: "rgba(238,245,255,0.08)",
            border: `0.18cqw solid ${accent}`,
          })}
        />
      </div>
      {balls.map((ball, index) => (
        <div
          key={ball.label}
          data-beat-layout-item="true"
          style={css({
            position: "absolute",
            left: showAt(beat, ball.step) ? ball.left : "43cqw",
            top: showAt(beat, ball.step) ? ball.top : "18cqh",
            width: "6.7cqw",
            height: "6.7cqw",
            display: "grid",
            placeItems: "center",
            borderRadius: "50%",
            color: "#071018",
            background: `radial-gradient(circle at 32% 28%, #ffffff, ${accent} 43%, #135280)`,
            boxShadow: `0 0 2.3cqw ${withAlpha(accent, "77")}`,
            opacity: showAt(beat, ball.step) ? 1 : 0,
            transition: "inherit",
            fontFamily:
              '"Arial Black", "PingFang SC", "Microsoft YaHei", sans-serif',
            fontSize: index === 2 ? "0.9cqw" : "1.05cqw",
            textAlign: "center",
            padding: "0.4cqw",
          })}
        >
          {ball.label}
        </div>
      ))}
      <ScoreChip
        label={copy.callout}
        value={showAt(beat, 2) ? "000" : "INTAKE"}
        accent={accent}
        visible={showAt(beat, 1)}
      />
    </>
  );
}

function SceneTwo({
  copy,
  beat,
  accent,
}: {
  copy: SceneCopy;
  beat: number;
  accent: string;
}) {
  const values = [86, 72, 91, 38];
  return (
    <div
      data-beat-layout-item="true"
      style={css({
        position: "absolute",
        right: "12cqw",
        top: "18cqh",
        width: "40cqw",
        height: "64cqh",
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: "1.2cqw",
      })}
    >
      {copy.labels.map((label, index) => {
        const visible = showAt(beat, index === 0 ? 0 : index < 3 ? 1 : 2);
        return (
          <div
            key={label}
            data-beat-layout-item="true"
            style={css({
              position: "relative",
              display: "grid",
              gridTemplateRows: "max-content 1fr max-content",
              gap: "1.3cqh",
              padding: "1.6cqh 0.8cqw",
              borderRadius: "1.1cqw",
              background:
                "linear-gradient(180deg, rgba(255,210,63,0.16), rgba(255,210,63,0.04))",
              border: `0.14cqw solid ${visible ? accent : "rgba(238,245,255,0.18)"}`,
              opacity: visible ? 1 : 0.24,
              transform: visible ? "translateY(0)" : "translateY(4cqh)",
              boxShadow: visible
                ? `0 0 2.2cqw ${withAlpha(accent, "44")}`
                : "none",
              transition: "inherit",
            })}
          >
            <strong
              style={css({
                color: visible ? accent : "rgba(238,245,255,0.36)",
                fontFamily:
                  '"Arial Black", "PingFang SC", "Microsoft YaHei", sans-serif',
                fontSize: "1.12cqw",
                writingMode: "vertical-rl",
                justifySelf: "center",
                textTransform: "uppercase",
                letterSpacing: "0",
              })}
            >
              {label}
            </strong>
            <div
              style={css({
                position: "relative",
                width: "1.15cqw",
                justifySelf: "center",
                borderRadius: "99cqw",
                background: "rgba(255,255,255,0.1)",
                overflow: "hidden",
              })}
            >
              <span
                style={css({
                  position: "absolute",
                  left: "0",
                  right: "0",
                  bottom: "0",
                  height: visible ? `${values[index] * 0.46}cqh` : "0",
                  borderRadius: "99cqw",
                  background: accent,
                  boxShadow: `0 0 1.7cqw ${withAlpha(accent, "88")}`,
                  transition: "inherit",
                })}
              />
            </div>
            <span
              style={css({
                color: visible ? "#fff4bd" : "rgba(238,245,255,0.4)",
                fontFamily: '"Courier New", ui-monospace, monospace',
                fontSize: "1.65cqw",
                textAlign: "center",
              })}
            >
              {visible ? values[index] : "--"}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function SceneThree({
  copy,
  beat,
  accent,
}: {
  copy: SceneCopy;
  beat: number;
  accent: string;
}) {
  return (
    <>
      <div
        data-beat-layout-item="true"
        style={css({
          position: "absolute",
          right: "11cqw",
          top: "15cqh",
          width: "37cqw",
          height: "68cqh",
        })}
      >
        <div
          style={css({
            position: "absolute",
            left: "2cqw",
            top: "6cqh",
            width: "25cqw",
            height: "44cqh",
            border: `0.16cqw solid ${ACCENTS.gold}`,
            borderRadius: "2cqw",
            transform: "skewX(-10deg)",
            background: "rgba(255,210,63,0.08)",
          })}
        />
        <div
          style={css({
            position: "absolute",
            right: "1cqw",
            top: showAt(beat, 1) ? "18cqh" : "6cqh",
            width: "10cqw",
            height: "45cqh",
            borderRadius: "5cqw 5cqw 1.2cqw 1.2cqw",
            background:
              "linear-gradient(180deg, rgba(255,85,72,0.1), rgba(255,85,72,0.48))",
            border: `0.22cqw solid ${accent}`,
            boxShadow: `0 0 3cqw ${withAlpha(accent, "66")}`,
            transition: "inherit",
          })}
        />
        {copy.labels.map((label, index) => {
          const visible = showAt(beat, index);
          return (
            <div
              key={label}
              data-beat-layout-item="true"
              style={css({
                position: "absolute",
                left: visible ? `${3 + index * 4.7}cqw` : "1cqw",
                top: visible ? `${14 + index * 12}cqh` : "6cqh",
                width: "12cqw",
                minHeight: "7cqh",
                display: "grid",
                placeItems: "center",
                borderRadius: "1cqw",
                background: visible
                  ? "rgba(255,85,72,0.16)"
                  : "rgba(238,245,255,0.08)",
                border: `0.14cqw solid ${visible ? accent : "rgba(238,245,255,0.25)"}`,
                color: visible ? "#ffd2cc" : "rgba(238,245,255,0.4)",
                fontFamily:
                  '"Arial Black", "PingFang SC", "Microsoft YaHei", sans-serif',
                fontSize: "1.15cqw",
                textAlign: "center",
                transform: visible ? "rotate(-4deg)" : "rotate(0)",
                opacity: visible ? 1 : 0,
                boxShadow: visible
                  ? `0 0 1.8cqw ${withAlpha(accent, "55")}`
                  : "none",
                transition: "inherit",
              })}
            >
              {label}
            </div>
          );
        })}
      </div>
      <ScoreChip
        label={copy.callout}
        value={showAt(beat, 2) ? "TRACE" : "CUT"}
        accent={accent}
        visible={showAt(beat, 1)}
      />
    </>
  );
}

function SceneFour({
  copy,
  beat,
  accent,
}: {
  copy: SceneCopy;
  beat: number;
  accent: string;
}) {
  return (
    <div
      data-beat-layout-item="true"
      style={css({
        position: "absolute",
        right: "12cqw",
        top: "16cqh",
        width: "39cqw",
        height: "66cqh",
      })}
    >
      <div
        style={css({
          position: "absolute",
          left: "6cqw",
          top: "9cqh",
          width: "27cqw",
          height: "28cqh",
          borderRadius: "1.6cqw",
          border: `0.22cqw solid ${accent}`,
          background:
            "linear-gradient(145deg, rgba(128,240,90,0.22), rgba(128,240,90,0.06))",
          boxShadow: `0 0 3.4cqw ${withAlpha(accent, "66")}`,
        })}
      />
      <div
        data-beat-layout-item="true"
        style={css({
          position: "absolute",
          left: showAt(beat, 0) ? "15.5cqw" : "2cqw",
          top: showAt(beat, 0) ? "17cqh" : "4cqh",
          width: "8.5cqw",
          height: "8.5cqw",
          display: "grid",
          placeItems: "center",
          borderRadius: "50%",
          background: `radial-gradient(circle, #ffffff 0, ${accent} 42%, #226b26 72%)`,
          color: "#071006",
          fontFamily:
            '"Arial Black", "PingFang SC", "Microsoft YaHei", sans-serif',
          fontSize: "1.1cqw",
          textAlign: "center",
          boxShadow: `0 0 2.8cqw ${withAlpha(accent, "88")}`,
          transition: "inherit",
        })}
      >
        {copy.labels[0]}
      </div>
      {[1, 2].map((item) => (
        <div
          key={copy.labels[item]}
          data-beat-layout-item="true"
          style={css({
            position: "absolute",
            left: `${7 + item * 10}cqw`,
            top: showAt(beat, item) ? "48cqh" : "57cqh",
            width: "10cqw",
            minHeight: "8cqh",
            display: "grid",
            placeItems: "center",
            borderRadius: "1cqw",
            background: "rgba(238,245,255,0.08)",
            border: "0.12cqw solid rgba(238,245,255,0.22)",
            color: showAt(beat, item) ? "#d7ffd0" : "rgba(238,245,255,0.25)",
            opacity: showAt(beat, item) ? 1 : 0.22,
            fontFamily:
              '"Arial Black", "PingFang SC", "Microsoft YaHei", sans-serif',
            fontSize: "1.25cqw",
            textAlign: "center",
            transition: "inherit",
          })}
        >
          {copy.labels[item]}
        </div>
      ))}
      <ScoreChip
        label={copy.callout}
        value={showAt(beat, 2) ? "GO" : "92"}
        accent={accent}
        visible={showAt(beat, 1)}
      />
    </div>
  );
}

function SceneFive({
  copy,
  beat,
  accent,
}: {
  copy: SceneCopy;
  beat: number;
  accent: string;
}) {
  const scores = [92, 78, 65];
  return (
    <div
      data-beat-layout-item="true"
      style={css({
        position: "absolute",
        right: "12cqw",
        top: "15cqh",
        width: "42cqw",
        minHeight: "66cqh",
        display: "grid",
        gap: "1.5cqh",
        padding: "2cqh 1.6cqw",
        borderRadius: "1.4cqw",
        background:
          "linear-gradient(180deg, rgba(162,105,255,0.16), rgba(57,167,255,0.08))",
        border: `0.16cqw solid ${withAlpha(accent, "bb")}`,
        boxShadow: `0 0 3.5cqw ${withAlpha(accent, "44")}`,
      })}
    >
      <strong
        data-beat-layout-item="true"
        style={css({
          color: accent,
          fontFamily: '"Courier New", ui-monospace, monospace',
          fontSize: "2.2cqw",
          textShadow: `0 0 1.2cqw ${withAlpha(accent, "77")}`,
        })}
      >
        {copy.callout}
      </strong>
      {copy.labels.map((label, index) => {
        const visible = showAt(beat, index);
        return (
          <div
            key={label}
            data-beat-layout-item="true"
            style={css({
              display: "grid",
              gridTemplateColumns: "10cqw 1fr 5cqw",
              alignItems: "center",
              gap: "1.2cqw",
              minHeight: "10cqh",
              opacity: visible ? 1 : 0.18,
              transform: visible ? "translateX(0)" : "translateX(4cqw)",
              transition: "inherit",
            })}
          >
            <span
              style={css({
                color: "#eef5ff",
                fontFamily:
                  '"Arial Black", "PingFang SC", "Microsoft YaHei", sans-serif',
                fontSize: "1.45cqw",
              })}
            >
              {label}
            </span>
            <span
              style={css({
                height: "2cqh",
                borderRadius: "99cqw",
                background: "rgba(255,255,255,0.12)",
                overflow: "hidden",
              })}
            >
              <span
                style={css({
                  display: "block",
                  height: "100%",
                  width: visible ? `${scores[index]}%` : "0%",
                  borderRadius: "99cqw",
                  background: index === 0 ? ACCENTS.green : accent,
                  boxShadow: `0 0 1.6cqw ${withAlpha(index === 0 ? ACCENTS.green : accent, "77")}`,
                  transition: "inherit",
                })}
              />
            </span>
            <strong
              style={css({
                color: index === 0 ? ACCENTS.green : accent,
                fontFamily: '"Courier New", ui-monospace, monospace',
                fontSize: "2.3cqw",
                textAlign: "right",
              })}
            >
              {visible ? scores[index] : "--"}
            </strong>
          </div>
        );
      })}
    </div>
  );
}

function ScenePanel({
  scene,
  beat,
  language,
  reduced,
  isActive,
}: {
  scene: number;
  beat: number;
  language: Lang;
  reduced: boolean;
  isActive: boolean;
}) {
  const safeBeat = clampBeat(beat);
  const copy = getCopy(scene, language);
  const accent = ACCENTS[sceneAccent(scene)];
  const { ref } = useFLIP<HTMLDivElement>({
    watch: [scene, safeBeat],
    disabled: reduced || !isActive,
    duration: 520,
    easing: "cubic-bezier(0.34, 1.56, 0.64, 1)",
    selector: '[data-beat-layout-item="true"]',
  });
  return (
    <section
      ref={ref}
      data-scene={scene}
      data-beat={safeBeat}
      data-beat-layout-container="true"
      data-beat-layout-mode="motion"
      style={css({
        position: "absolute",
        inset: "0",
        overflow: "hidden",
        transition: reduced
          ? "none"
          : "all 520ms cubic-bezier(0.16, 1, 0.3, 1)",
      })}
    >
      <Header copy={copy} accent={accent} scene={scene} />
      <div
        data-beat-layout-item="true"
        style={css({
          position: "absolute",
          left: "6cqw",
          top: showAt(safeBeat, 2) ? "62cqh" : "66cqh",
          width: "36cqw",
          display: "grid",
          gap: "1cqh",
          padding: "2cqh 1.5cqw",
          borderRadius: "1.2cqw",
          border: `0.12cqw solid ${withAlpha(accent, "77")}`,
          background: "rgba(8, 12, 18, 0.72)",
          boxShadow: `0 0 2.5cqw ${withAlpha(accent, "24")}`,
          transition: "inherit",
        })}
      >
        <strong
          style={css({
            color: accent,
            fontFamily:
              '"Arial Black", "PingFang SC", "Microsoft YaHei", sans-serif',
            fontSize: "1.35cqw",
            textTransform: "uppercase",
          })}
        >
          {copy.beats[safeBeat].title}
        </strong>
        <span
          style={css({
            color: "rgba(238,245,255,0.78)",
            fontFamily: '"Arial", "PingFang SC", "Microsoft YaHei", sans-serif',
            fontSize: "1.35cqw",
            lineHeight: 1.32,
          })}
        >
          {copy.beats[safeBeat].body}
        </span>
      </div>
      {scene === 1 && <SceneOne copy={copy} beat={safeBeat} accent={accent} />}
      {scene === 2 && <SceneTwo copy={copy} beat={safeBeat} accent={accent} />}
      {scene === 3 && (
        <SceneThree copy={copy} beat={safeBeat} accent={accent} />
      )}
      {scene === 4 && <SceneFour copy={copy} beat={safeBeat} accent={accent} />}
      {scene === 5 && <SceneFive copy={copy} beat={safeBeat} accent={accent} />}
      <MarkerRail scene={scene} beat={safeBeat} accent={accent} />
    </section>
  );
}

export default function PrioritizeWithoutDebateV2({
  scene,
  beat,
  language,
  isThumbnail,
  reducedMotion,
  onNavigate,
}: BespokeStyleProps) {
  const reduced = reducedMotion || isThumbnail;
  return (
    <div
      style={css({
        width: "100%",
        height: "100%",
        position: "relative",
        overflow: "hidden",
        containerType: "size",
        background:
          "radial-gradient(circle at 18cqw 12cqh, rgba(57,167,255,0.22), transparent 24cqw), radial-gradient(circle at 82cqw 86cqh, rgba(128,240,90,0.15), transparent 28cqw), linear-gradient(135deg, #05080f 0%, #10131b 54%, #050506 100%)",
        color: "#eef5ff",
        fontFamily: '"Arial", "PingFang SC", "Microsoft YaHei", sans-serif',
      })}
    >
      <div
        aria-hidden="true"
        style={css({
          position: "absolute",
          inset: "0",
          backgroundImage:
            "linear-gradient(rgba(238,245,255,0.055) 0.12cqh, transparent 0.12cqh), linear-gradient(90deg, rgba(238,245,255,0.055) 0.12cqw, transparent 0.12cqw)",
          backgroundSize: "4cqw 4cqh",
          opacity: 0.55,
        })}
      />
      <div
        aria-hidden="true"
        style={css({
          position: "absolute",
          left: "4cqw",
          right: "4cqw",
          top: "4cqh",
          bottom: "4cqh",
          border: "0.18cqw solid rgba(238,245,255,0.14)",
          borderRadius: "2cqw",
          boxShadow:
            "inset 0 0 5cqw rgba(238,245,255,0.04), 0 0 5cqw rgba(0,0,0,0.35)",
        })}
      />
      <SpatialSceneTrack
        scene={scene}
        beat={beat}
        transitionKind="slide-y"
        transitionMap={TRANSITION_MAP}
        transitionDurationMs={720}
        reducedMotion={reduced}
        beatLayoutModes={BEAT_LAYOUT_MODES}
        renderScene={(sceneId, sceneBeat, isActive) => (
          <ScenePanel
            scene={sceneId}
            beat={sceneBeat}
            language={language}
            reduced={reduced}
            isActive={isActive}
          />
        )}
      />
      {!isThumbnail && (
        <PinballNav scene={scene} onNavigate={onNavigate} reduced={reduced} />
      )}
    </div>
  );
}

export { getMetadata };

export const prioritizeWithoutDebateV2Version = defineStyleVersion({
  id: "v2",
  topic: "Prioritize Without Debate",
  model: "GPT-5",
  component: PrioritizeWithoutDebateV2,
  getMetadata,
});

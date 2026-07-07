import type React from "react";
import type { BespokeStyleProps, StyleMetadata } from "../types";
import SpatialSceneTrack, {
  type BeatLayoutMode,
  type SceneTransitionMap,
} from "./SpatialSceneTrack";
import { defineStyleVersion } from "./version";
import styles from "./15-tuning-operating-model-v2.module.css";

type Lang = "en" | "zh";

interface BeatCopy {
  id: number;
  action: string;
  title: string;
  body: string;
}

interface LocalizedScene {
  short: string;
  kicker: string;
  title: string;
  subtitle: string;
  lead: string;
  channels: string[];
  badges: string[];
  cue: string;
  beats: BeatCopy[];
}

interface SceneDef {
  id: number;
  tone: "faders" | "noise" | "mix" | "preset" | "master";
  accent: string;
  navLevel: number;
  targets: number[];
  levels: number[][];
  en: LocalizedScene;
  zh: LocalizedScene;
}

type CSSVarStyle = React.CSSProperties & Record<`--${string}`, string | number>;

const SCENE_IDS = [1, 2, 3, 4, 5];

const TRANSITION_MAP: SceneTransitionMap = {
  "1->2": "slide-y",
  "2->1": "slide-y",
  "2->3": "glitch",
  "3->2": "glitch",
  "3->4": "scale-fade",
  "4->3": "scale-fade",
  "4->5": "hard-cut",
  "5->4": "hard-cut",
};

const BEAT_LAYOUT_MODES: Partial<Record<number, BeatLayoutMode>> = {
  1: "motion",
  2: "motion",
  3: "motion",
  4: "motion",
  5: "motion",
};

const SCENES: SceneDef[] = [
  {
    id: 1,
    tone: "faders",
    accent: "#42d7c8",
    navLevel: 62,
    targets: [64, 58, 54, 46, 60],
    levels: [
      [72, 48, 35, 61, 24],
      [72, 48, 35, 61, 24],
      [64, 52, 42, 50, 36],
    ],
    en: {
      short: "Faders",
      kicker: "Scene 01 / Fader check",
      title: "Read the current mix",
      subtitle: "The operating model is already broadcasting levels.",
      lead: "Cadence is loud, feedback is buried, and support is masking the product signal.",
      channels: ["Cadence", "Delivery", "Quality", "Support", "Feedback"],
      badges: ["Current levels", "Target ghosts", "Gap marked"],
      cue: "Input gain is visible.",
      beats: [
        {
          id: 0,
          action: "Map",
          title: "Touch every channel",
          body: "Expose the model as adjustable levels instead of abstract claims.",
        },
        {
          id: 1,
          action: "Compare",
          title: "Show target ghosts",
          body: "The mix reveals where execution is thin and where it is too hot.",
        },
        {
          id: 2,
          action: "Cue",
          title: "Mark the gap",
          body: "The next move is to lower noise before raising output.",
        },
      ],
    },
    zh: {
      short: "推子",
      kicker: "场景 01 / 推子检查",
      title: "读取当前混音",
      subtitle: "运营模型已经在输出各自的电平。",
      lead: "节奏很响，反馈被埋住，支持噪声正在盖过产品信号。",
      channels: ["节奏", "交付", "质量", "支持", "反馈"],
      badges: ["当前电平", "目标影线", "差距标记"],
      cue: "输入增益已显形。",
      beats: [
        {
          id: 0,
          action: "映射",
          title: "摸到每一路",
          body: "把模型变成可调电平，而不是抽象判断。",
        },
        {
          id: 1,
          action: "对比",
          title: "显示目标影线",
          body: "混音暴露哪里偏薄，哪里过热。",
        },
        {
          id: 2,
          action: "提示",
          title: "标出缺口",
          body: "先降噪，再提高整体输出。",
        },
      ],
    },
  },
  {
    id: 2,
    tone: "noise",
    accent: "#ff6f61",
    navLevel: 78,
    targets: [38, 32, 28, 54, 34],
    levels: [
      [82, 74, 68, 42, 77],
      [74, 66, 58, 48, 64],
      [48, 38, 34, 56, 42],
    ],
    en: {
      short: "Noise",
      kicker: "Scene 02 / Gate input",
      title: "Gate the noisy input",
      subtitle: "Escalations are peaking above the useful work.",
      lead: "Late context, duplicate loops, and decision delay raise the noise floor.",
      channels: [
        "Escalation",
        "Late context",
        "Duplicate work",
        "Customer pulse",
        "Decision lag",
      ],
      badges: ["Noise floor", "Redline peaks", "Signal isolated"],
      cue: "Useful signal has room.",
      beats: [
        {
          id: 0,
          action: "Detect",
          title: "Hear the distortion",
          body: "The loudest inputs are not the most valuable ones.",
        },
        {
          id: 1,
          action: "Gate",
          title: "Cut the hum",
          body: "Repeated questions and late context move below threshold.",
        },
        {
          id: 2,
          action: "Isolate",
          title: "Lift the signal",
          body: "Customer pulse comes forward after the noisy channels settle.",
        },
      ],
    },
    zh: {
      short: "噪声",
      kicker: "场景 02 / 输入降噪",
      title: "关掉噪声输入",
      subtitle: "升级和返工正在盖过有效工作。",
      lead: "迟到上下文、重复循环和决策延迟抬高了噪声地板。",
      channels: ["升级", "迟到上下文", "重复工作", "客户脉冲", "决策延迟"],
      badges: ["噪声地板", "削峰红区", "信号分离"],
      cue: "有效信号有了空间。",
      beats: [
        {
          id: 0,
          action: "侦测",
          title: "听见失真",
          body: "最响的输入不一定最有价值。",
        },
        {
          id: 1,
          action: "降噪",
          title: "切掉嗡声",
          body: "重复问题和迟到上下文降到阈值以下。",
        },
        {
          id: 2,
          action: "分离",
          title: "抬起信号",
          body: "噪声通道稳定后，客户脉冲向前。",
        },
      ],
    },
  },
  {
    id: 3,
    tone: "mix",
    accent: "#7ee787",
    navLevel: 58,
    targets: [58, 62, 57, 60, 55],
    levels: [
      [44, 70, 51, 48, 36],
      [52, 66, 55, 55, 46],
      [58, 62, 57, 60, 55],
    ],
    en: {
      short: "Balance",
      kicker: "Scene 03 / Balanced mix",
      title: "Balance the operating mix",
      subtitle: "Each function sits inside a shared output range.",
      lead: "Planning, building, review, release, and learning now move as one console.",
      channels: ["Plan", "Build", "Review", "Release", "Learn"],
      badges: ["Level match", "Pan centered", "Bus healthy"],
      cue: "The mix can carry load.",
      beats: [
        {
          id: 0,
          action: "Bring in",
          title: "Raise the quiet lanes",
          body: "Hidden review and learning work receive enough gain to register.",
        },
        {
          id: 1,
          action: "Center",
          title: "Set the shared range",
          body: "No channel needs to dominate the operating model.",
        },
        {
          id: 2,
          action: "Listen",
          title: "Check the blend",
          body: "The output is even enough to make trade-offs visible.",
        },
      ],
    },
    zh: {
      short: "平衡",
      kicker: "场景 03 / 平衡混音",
      title: "平衡运营混音",
      subtitle: "每个职能都落在共同输出区间里。",
      lead: "计划、建设、评审、发布和学习现在由同一张台面控制。",
      channels: ["计划", "建设", "评审", "发布", "学习"],
      badges: ["电平匹配", "声像居中", "总线健康"],
      cue: "这个混音可以承载负荷。",
      beats: [
        {
          id: 0,
          action: "推入",
          title: "抬起安静通道",
          body: "隐藏的评审和学习工作获得足够增益。",
        },
        {
          id: 1,
          action: "居中",
          title: "设定共享区间",
          body: "没有一路需要压过整个运营模型。",
        },
        {
          id: 2,
          action: "监听",
          title: "检查融合",
          body: "输出足够均衡，取舍开始可见。",
        },
      ],
    },
  },
  {
    id: 4,
    tone: "preset",
    accent: "#f5c84c",
    navLevel: 46,
    targets: [60, 56, 58, 62, 57],
    levels: [
      [58, 56, 55, 60, 54],
      [60, 56, 58, 62, 57],
      [60, 56, 58, 62, 57],
    ],
    en: {
      short: "Preset",
      kicker: "Scene 04 / Save preset",
      title: "Save the operating preset",
      subtitle: "A tuned model needs recall, not heroic memory.",
      lead: "Rules, owners, and checkpoints store the balance so teams can return to it.",
      channels: [
        "Sync rule",
        "Decision rule",
        "Release gate",
        "Owner check",
        "Feedback loop",
      ],
      badges: ["Snapshot", "Owner tags", "Recall locked"],
      cue: "Preset saved as operating model v2.",
      beats: [
        {
          id: 0,
          action: "Capture",
          title: "Freeze the levels",
          body: "The current mix becomes a repeatable operating preset.",
        },
        {
          id: 1,
          action: "Assign",
          title: "Label the controls",
          body: "Each channel has a named owner and a visible check.",
        },
        {
          id: 2,
          action: "Store",
          title: "Lock recall",
          body: "The preset survives handoffs and busy weeks.",
        },
      ],
    },
    zh: {
      short: "预设",
      kicker: "场景 04 / 保存预设",
      title: "保存运营预设",
      subtitle: "调好的模型需要可召回，而不是靠英雄记忆。",
      lead: "规则、负责人和检查点保存平衡，让团队能回到同一状态。",
      channels: ["同步规则", "决策规则", "发布闸门", "负责人检查", "反馈循环"],
      badges: ["快照", "负责人标签", "召回锁定"],
      cue: "已保存为运营模型 v2。",
      beats: [
        {
          id: 0,
          action: "捕捉",
          title: "冻结电平",
          body: "当前混音变成可重复的运营预设。",
        },
        {
          id: 1,
          action: "分配",
          title: "标注控制项",
          body: "每一路都有命名负责人和可见检查。",
        },
        {
          id: 2,
          action: "存储",
          title: "锁定召回",
          body: "预设能穿过交接和忙碌周。",
        },
      ],
    },
  },
  {
    id: 5,
    tone: "master",
    accent: "#8ab4ff",
    navLevel: 84,
    targets: [66, 62, 60, 64, 68],
    levels: [
      [62, 58, 57, 61, 65],
      [66, 62, 60, 64, 68],
    ],
    en: {
      short: "Master",
      kicker: "Scene 05 / Master bus",
      title: "Send a clean master bus",
      subtitle: "The system output is loud enough, calm enough, and learnable.",
      lead: "The final bus carries throughput, resilience, and feedback without clipping.",
      channels: ["Throughput", "Calm", "Quality", "Learning", "Trust"],
      badges: ["No clipping", "Stereo field", "Ready to run"],
      cue: "Master bus is clean.",
      beats: [
        {
          id: 0,
          action: "Route",
          title: "Sum the channels",
          body: "All tuned controls feed one operating output.",
        },
        {
          id: 1,
          action: "Print",
          title: "Hold the master",
          body: "The model is balanced enough to run and clear enough to improve.",
        },
      ],
    },
    zh: {
      short: "总线",
      kicker: "场景 05 / 主控总线",
      title: "送出干净主控总线",
      subtitle: "系统输出足够响，也足够稳定和可学习。",
      lead: "最终总线承载吞吐、韧性和反馈，并且不削波。",
      channels: ["吞吐", "稳定", "质量", "学习", "信任"],
      badges: ["不削波", "立体声场", "可以运行"],
      cue: "主控总线干净。",
      beats: [
        {
          id: 0,
          action: "路由",
          title: "汇总通道",
          body: "所有调好的控制项进入同一个运营输出。",
        },
        {
          id: 1,
          action: "输出",
          title: "保持母版",
          body: "模型足够平衡，可以运行；也足够清晰，可以继续改善。",
        },
      ],
    },
  },
];

const METADATA_LABELS = {
  en: {
    name: "Studio Mixing Console",
    theme: "Tuning the Operating Model",
    density: "Instrumented",
  },
  zh: {
    name: "工作室调音台",
    theme: "调校运营模型",
    density: "仪表化",
  },
};

function getScene(sceneId: number): SceneDef {
  return SCENES.find((item) => item.id === sceneId) ?? SCENES[0];
}

function getSafeBeat(sceneDef: SceneDef, lang: Lang, beat: number): number {
  const maxBeat = sceneDef[lang].beats.length - 1;
  return Math.max(0, Math.min(beat, maxBeat));
}

function toVars(values: Record<string, string | number>): CSSVarStyle {
  return values as CSSVarStyle;
}

export function getMetadata(lang: Lang): StyleMetadata {
  const labels = METADATA_LABELS[lang];

  return {
    id: "15",
    band: "balanced-hybrid",
    name: labels.name,
    theme: labels.theme,
    densityLabel: labels.density,
    heroScene: 3,
    colors: {
      bg: "#080b0d",
      ink: "#e8f8f5",
      panel: "#151b20",
    },
    typography: {
      header: "IBM Plex Mono 700",
      body: "IBM Plex Mono 400",
    },
    tags: ["console", "tactile", "balanced", "meters", "operations"],
    fonts: ["IBM Plex Mono", "cjk:Noto Sans SC"],
    scenes: SCENES.map((sceneDef) => ({
      id: sceneDef.id,
      title: sceneDef[lang].title,
      beats: sceneDef[lang].beats.map((beatCopy, index) => ({
        id: index,
        action: beatCopy.action,
        title: beatCopy.title,
        body: beatCopy.body,
      })),
    })),
  };
}

function FaderRailNav({
  activeScene,
  language,
  onNavigate,
}: {
  activeScene: number;
  language: Lang;
  onNavigate?: (scene: number, beat: number) => void;
}) {
  return (
    <nav
      className={styles.faderRail}
      aria-label={
        language === "zh" ? "迷你推子场景导航" : "Mini fader scene navigation"
      }
    >
      {SCENES.map((sceneDef) => {
        const active = sceneDef.id === activeScene;
        const copy = sceneDef[language];

        return (
          <button
            key={sceneDef.id}
            type="button"
            className={styles.navFader}
            data-active={active ? "true" : "false"}
            style={toVars({
              "--nav-level": `${sceneDef.navLevel}%`,
              "--accent": sceneDef.accent,
            })}
            onClick={() => onNavigate?.(sceneDef.id, 0)}
            aria-current={active ? "step" : undefined}
          >
            <span className={styles.navSlot} aria-hidden="true">
              <span className={styles.navHandle} />
            </span>
            <span className={styles.navIndex}>
              {String(sceneDef.id).padStart(2, "0")}
            </span>
            <span className={styles.navLabel}>{copy.short}</span>
          </button>
        );
      })}
    </nav>
  );
}

function BeatMarkers({
  sceneDef,
  language,
  beat,
}: {
  sceneDef: SceneDef;
  language: Lang;
  beat: number;
}) {
  const copy = sceneDef[language];
  const activeBeat = copy.beats[beat];

  return (
    <div className={styles.beatPanel} data-beat-layout-item>
      <div className={styles.beatLeds} aria-hidden="true">
        {copy.beats.map((item, index) => (
          <span
            key={item.title}
            className={styles.beatLed}
            data-active={index <= beat ? "true" : "false"}
          />
        ))}
      </div>
      <div className={styles.beatCopy}>
        <span>{activeBeat.action}</span>
        <strong>{activeBeat.title}</strong>
        <p>{activeBeat.body}</p>
      </div>
    </div>
  );
}

function StatusBadges({
  sceneDef,
  language,
  beat,
}: {
  sceneDef: SceneDef;
  language: Lang;
  beat: number;
}) {
  const copy = sceneDef[language];

  return (
    <div className={styles.badges} data-beat-layout-item>
      {copy.badges.map((badge, index) => (
        <span
          key={badge}
          className={styles.badge}
          data-active={index <= beat ? "true" : "false"}
          style={toVars({ "--accent": sceneDef.accent })}
        >
          {badge}
        </span>
      ))}
    </div>
  );
}

function FaderBank({
  sceneDef,
  language,
  beat,
  compact = false,
}: {
  sceneDef: SceneDef;
  language: Lang;
  beat: number;
  compact?: boolean;
}) {
  const copy = sceneDef[language];
  const levels = sceneDef.levels[Math.min(beat, sceneDef.levels.length - 1)];

  return (
    <div
      className={compact ? styles.compactFaderBank : styles.faderBank}
      data-beat-layout-item
    >
      {copy.channels.map((label, index) => {
        const level = levels[index] ?? 50;
        const target = sceneDef.targets[index] ?? 50;

        return (
          <div
            key={`${sceneDef.id}-${label}`}
            className={styles.faderStrip}
            data-hot={level > 74 ? "true" : "false"}
            style={toVars({
              "--level": `${level}%`,
              "--target": `${target}%`,
              "--accent": sceneDef.accent,
              "--delay": `${index * 0.07}s`,
            })}
          >
            <div className={styles.ledStack} aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
            <div className={styles.meterSlot} aria-hidden="true">
              <span className={styles.targetLine} />
              <span className={styles.meterFill} />
            </div>
            <div className={styles.faderTrack} aria-hidden="true">
              <span className={styles.faderHandle} />
            </div>
            <strong>{label}</strong>
            <span>{level}</span>
          </div>
        );
      })}
    </div>
  );
}

function NoiseScope({
  sceneDef,
  language,
  beat,
}: {
  sceneDef: SceneDef;
  language: Lang;
  beat: number;
}) {
  const copy = sceneDef[language];
  const levels = sceneDef.levels[Math.min(beat, sceneDef.levels.length - 1)];

  return (
    <div className={styles.noiseDesk} data-beat-layout-item>
      <div className={styles.scopeFrame}>
        <svg
          className={styles.scopeSvg}
          viewBox="0 0 640 300"
          role="img"
          aria-label={copy.title}
        >
          <path
            className={styles.noiseWave}
            d="M0 148 L22 74 L46 186 L72 88 L106 220 L140 112 L166 154 L196 64 L230 204 L262 130 L294 166 L328 92 L362 214 L398 108 L430 150 L466 72 L502 188 L536 126 L572 162 L612 88 L640 180"
          />
          <path
            className={styles.signalWave}
            d="M0 172 C74 132 116 132 174 168 C236 204 292 204 354 168 C420 130 474 130 536 166 C586 194 616 190 640 178"
          />
        </svg>
      </div>
      <div className={styles.noiseRows}>
        {copy.channels.map((label, index) => (
          <div
            key={label}
            className={styles.noiseRow}
            style={toVars({
              "--level": `${levels[index] ?? 50}%`,
              "--accent": sceneDef.accent,
            })}
          >
            <span>{label}</span>
            <i aria-hidden="true" />
          </div>
        ))}
      </div>
    </div>
  );
}

function BalancedMix({
  sceneDef,
  language,
  beat,
}: {
  sceneDef: SceneDef;
  language: Lang;
  beat: number;
}) {
  const copy = sceneDef[language];
  const levels = sceneDef.levels[Math.min(beat, sceneDef.levels.length - 1)];

  return (
    <div className={styles.mixDesk} data-beat-layout-item>
      <div
        className={styles.balanceCore}
        style={toVars({ "--accent": sceneDef.accent })}
        aria-hidden="true"
      >
        <span />
        <span />
        <span />
      </div>
      <div className={styles.mixRows}>
        {copy.channels.map((label, index) => (
          <div
            key={label}
            className={styles.mixRow}
            style={toVars({
              "--level": `${levels[index] ?? 50}%`,
              "--accent": sceneDef.accent,
            })}
          >
            <span>{label}</span>
            <i aria-hidden="true" />
          </div>
        ))}
      </div>
    </div>
  );
}

function PresetPanel({
  sceneDef,
  language,
  beat,
}: {
  sceneDef: SceneDef;
  language: Lang;
  beat: number;
}) {
  const copy = sceneDef[language];
  const levels = sceneDef.levels[Math.min(beat, sceneDef.levels.length - 1)];
  const savedLabel = language === "zh" ? "已保存" : "SAVED";

  return (
    <div className={styles.presetDesk} data-beat-layout-item>
      <div
        className={styles.savedStamp}
        data-active={beat >= 2 ? "true" : "false"}
        style={toVars({ "--accent": sceneDef.accent })}
      >
        {savedLabel}
      </div>
      <div className={styles.memoryGrid}>
        {copy.channels.map((label, index) => (
          <div
            key={label}
            className={styles.memorySlot}
            data-active={index <= beat + 2 ? "true" : "false"}
            style={toVars({
              "--level": `${levels[index] ?? 50}%`,
              "--accent": sceneDef.accent,
            })}
          >
            <span>{String(index + 1).padStart(2, "0")}</span>
            <strong>{label}</strong>
            <i aria-hidden="true" />
          </div>
        ))}
      </div>
    </div>
  );
}

function MasterBus({
  sceneDef,
  language,
  beat,
}: {
  sceneDef: SceneDef;
  language: Lang;
  beat: number;
}) {
  const copy = sceneDef[language];
  const levels = sceneDef.levels[Math.min(beat, sceneDef.levels.length - 1)];
  const masterLabel = language === "zh" ? "主控" : "MASTER";

  return (
    <div className={styles.masterDesk} data-beat-layout-item>
      <div className={styles.masterMeters} aria-hidden="true">
        <span
          className={styles.masterMeter}
          style={toVars({
            "--level": `${levels[0]}%`,
            "--accent": sceneDef.accent,
          })}
        />
        <span
          className={styles.masterMeter}
          style={toVars({
            "--level": `${levels[4]}%`,
            "--accent": sceneDef.accent,
          })}
        />
      </div>
      <div className={styles.masterReadout}>
        <span>{masterLabel}</span>
        <strong>{copy.cue}</strong>
        <div className={styles.masterBusLine}>
          {copy.channels.map((label, index) => (
            <i
              key={label}
              style={toVars({
                "--level": `${levels[index] ?? 50}%`,
                "--accent": sceneDef.accent,
              })}
              aria-label={label}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function ConsoleVisual({
  sceneDef,
  language,
  beat,
}: {
  sceneDef: SceneDef;
  language: Lang;
  beat: number;
}) {
  if (sceneDef.tone === "noise") {
    return <NoiseScope sceneDef={sceneDef} language={language} beat={beat} />;
  }

  if (sceneDef.tone === "mix") {
    return <BalancedMix sceneDef={sceneDef} language={language} beat={beat} />;
  }

  if (sceneDef.tone === "preset") {
    return <PresetPanel sceneDef={sceneDef} language={language} beat={beat} />;
  }

  if (sceneDef.tone === "master") {
    return <MasterBus sceneDef={sceneDef} language={language} beat={beat} />;
  }

  return <FaderBank sceneDef={sceneDef} language={language} beat={beat} />;
}

function ScenePanel({
  sceneId,
  beat,
  language,
  isActive,
}: {
  sceneId: number;
  beat: number;
  language: Lang;
  isActive: boolean;
}) {
  const sceneDef = getScene(sceneId);
  const safeBeat = getSafeBeat(sceneDef, language, beat);
  const copy = sceneDef[language];

  return (
    <section
      className={styles.scene}
      data-scene-tone={sceneDef.tone}
      data-active={isActive ? "true" : "false"}
      data-beat={safeBeat}
    >
      <div className={styles.copyRail} data-beat-layout-item>
        <span className={styles.kicker}>{copy.kicker}</span>
        <h1>{copy.title}</h1>
        <p className={styles.subtitle}>{copy.subtitle}</p>
        <p className={styles.lead}>{copy.lead}</p>
        <StatusBadges sceneDef={sceneDef} language={language} beat={safeBeat} />
      </div>
      <div className={styles.consoleShell} data-beat-layout-item>
        <div className={styles.consoleHeader}>
          <span>{copy.cue}</span>
          <i aria-hidden="true" />
        </div>
        <ConsoleVisual
          sceneDef={sceneDef}
          language={language}
          beat={safeBeat}
        />
      </div>
      <BeatMarkers sceneDef={sceneDef} language={language} beat={safeBeat} />
    </section>
  );
}

export default function TuningOperatingModelV2({
  scene,
  beat,
  language,
  isThumbnail,
  reducedMotion,
  onNavigate,
}: BespokeStyleProps) {
  const currentScene = getScene(scene);
  const safeBeat = getSafeBeat(currentScene, language, beat);
  const motionFrozen = reducedMotion || isThumbnail;

  return (
    <div
      className={[
        styles.root,
        motionFrozen ? styles.reducedMotion : "",
        isThumbnail ? styles.thumbnail : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className={styles.hardwareGlow} aria-hidden="true" />
      <SpatialSceneTrack
        scene={currentScene.id}
        beat={safeBeat}
        sceneIds={SCENE_IDS}
        transitionKind="scale-fade"
        transitionMap={TRANSITION_MAP}
        transitionDurationMs={720}
        reducedMotion={motionFrozen}
        beatLayoutModes={BEAT_LAYOUT_MODES}
        className={styles.track}
        renderScene={(trackScene, trackBeat, isActive) => (
          <ScenePanel
            sceneId={trackScene}
            beat={trackBeat}
            language={language}
            isActive={isActive}
          />
        )}
      />
      {!isThumbnail ? (
        <FaderRailNav
          activeScene={currentScene.id}
          language={language}
          onNavigate={onNavigate}
        />
      ) : null}
    </div>
  );
}

export const tuningOperatingModelV2Version = defineStyleVersion({
  id: "v2",
  topic: {
    en: "Operating Model",
    zh: "运营模型",
  },
  model: "GPT-5.5",
  component: TuningOperatingModelV2,
  getMetadata,
});

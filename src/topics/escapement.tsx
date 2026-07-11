import type { KeyboardEvent, MouseEvent, PointerEvent } from "react";
import type { Source } from "../domain/evidence";
import {
  defineTopic,
  type TopicMetadata,
  type TopicStageProps,
  type TopicTransitionScore,
} from "../domain/topic";
import SpatialSceneTrack from "../components/stage/SpatialSceneTrack";
import type {
  BeatLayoutMode,
  SceneTransitionMap,
} from "../components/stage/SpatialSceneTrack";
import styles from "./escapement.module.css";

type Lang = "en" | "zh";
type SceneId = 1 | 2 | 3 | 4 | 5;
type CyclePhase = "lock" | "impulse" | "release" | "relock";

interface BeatCopy {
  action: string;
  title: string;
  body: string;
}

interface SceneCopy {
  plate: string;
  title: string;
  subtitle: string;
  annotation: string;
  measure: string;
  beats: BeatCopy[];
}

const SCENE_IDS = [1, 2, 3, 4, 5] as const;

const COPY: Record<SceneId, Record<Lang, SceneCopy>> = {
  1: {
    en: {
      plate: "PLATE 01 · THE QUESTION",
      title: "Why does the second hand wait?",
      subtitle:
        "A wound spring pushes continuously. The display must advance in countable steps.",
      annotation: "Continuous torque enters. One measured release leaves.",
      measure: "OBSERVE · the hand is held between ticks",
      beats: [
        {
          action: "Hold the hand",
          title: "The pause is part of the mechanism",
          body: "A clock needs a gate between stored energy and the hands.",
        },
      ],
    },
    zh: {
      plate: "图版 01 · 提问",
      title: "秒针为什么会停住？",
      subtitle: "上紧的发条持续施力；显示端却必须一格一格地走。",
      annotation: "持续转矩进入；一次可计数的释放离开。",
      measure: "观察 · 两次滴答之间，指针被锁住",
      beats: [
        {
          action: "锁住指针",
          title: "停顿本来就是机构的一部分",
          body: "机械钟需要一道门，把储能和指针隔开。",
        },
      ],
    },
  },
  2: {
    en: {
      plate: "PLATE 02 · EXPLODED TRAIN",
      title: "Five parts, one regulated path",
      subtitle:
        "This manual follows a recoil anchor escapement in a pendulum clock—not a generic mix of escapements.",
      annotation:
        "Stored energy → going train → escape wheel → anchor pallets → pendulum",
      measure: "SECTION A–A · functional order, not physical scale",
      beats: [
        {
          action: "Trace the drive",
          title: "Power reaches the escape wheel",
          body: "The spring or weight turns the train; the train carries torque toward the regulator.",
        },
        {
          action: "Name the regulator",
          title: "The anchor and pendulum set the release",
          body: "Two pallet faces alternately hold and release the toothed wheel.",
        },
      ],
    },
    zh: {
      plate: "图版 02 · 轮系爆炸图",
      title: "五个部件，一条受控路径",
      subtitle: "本手册只解释摆钟中的反冲式锚形擒纵，不混用其他擒纵机构。",
      annotation: "储能 → 轮系 → 擒纵轮 → 锚形叉瓦 → 摆",
      measure: "A–A 剖面 · 按功能排序，不代表真实比例",
      beats: [
        {
          action: "追踪动力",
          title: "动力传到擒纵轮",
          body: "发条或重锤推动轮系，轮系把转矩送向调速机构。",
        },
        {
          action: "标出调速机构",
          title: "锚形叉与摆决定释放",
          body: "两块叉瓦交替锁住并放行带齿的擒纵轮。",
        },
      ],
    },
  },
  3: {
    en: {
      plate: "PLATE 03 · CONTACT DETAIL",
      title: "One tooth, four inspectable states",
      subtitle:
        "The wheel never free-runs here. Each beat freezes one state of the same anchor cycle.",
      annotation: "LOCK → IMPULSE → RELEASE → RELOCK",
      measure: "DETAIL B · two contact points only",
      beats: [
        {
          action: "Lock",
          title: "Entry pallet holds the tooth",
          body: "Drive torque is present, but the escape wheel cannot pass the pallet face.",
        },
        {
          action: "Give impulse",
          title: "The contact transfers a small push",
          body: "As the anchor rocks, the tooth acts along the entry pallet face and helps sustain the pendulum.",
        },
        {
          action: "Release",
          title: "The tooth clears the entry pallet",
          body: "For a brief geometric interval neither marked contact point is locked.",
        },
        {
          action: "Relock",
          title: "The opposite pallet catches the next tooth",
          body: "The wheel advances discretely, then waits for the pendulum to return.",
        },
      ],
    },
    zh: {
      plate: "图版 03 · 接触细节",
      title: "一个轮齿，四个可检查状态",
      subtitle: "擒纵轮不会自由旋转；每个 beat 都冻结同一个锚形周期的一个状态。",
      annotation: "锁止 → 冲量 → 释放 → 再锁止",
      measure: "细节 B · 只标两个接触点",
      beats: [
        {
          action: "锁止",
          title: "进瓦挡住轮齿",
          body: "驱动转矩仍在，但轮齿无法越过叉瓦工作面。",
        },
        {
          action: "冲量",
          title: "接触面传递一小次推力",
          body: "锚形叉摆动时，轮齿沿进瓦工作面作用，帮助摆维持振荡。",
        },
        {
          action: "释放",
          title: "轮齿越过进瓦",
          body: "在一个短暂的几何区间内，两个标记接触点都没有锁住。",
        },
        {
          action: "再锁止",
          title: "另一块叉瓦接住下一齿",
          body: "擒纵轮离散地前进一步，然后等待摆返回。",
        },
      ],
    },
  },
  4: {
    en: {
      plate: "PLATE 04 · COUNTING CHAIN",
      title: "A release becomes a reading",
      subtitle:
        "The oscillator sets the rhythm; the escapement meters the train; gear ratios carry the count to the dial.",
      annotation: "Oscillation → release → ratio → display",
      measure: "MODEL LIMIT · not a precision-adjustment recipe",
      beats: [
        {
          action: "Count the release",
          title: "Discrete motion enters the gear ratios",
          body: "Repeated releases let the train advance in increments the hands can count.",
        },
        {
          action: "Mark the boundary",
          title: "Accuracy depends on more than this diagram",
          body: "Tooth profile, friction, recoil, drive, pendulum geometry, and environment all matter in a real clock.",
        },
      ],
    },
    zh: {
      plate: "图版 04 · 计数链",
      title: "一次释放，变成一次读数",
      subtitle: "振荡器给出节律；擒纵机构计量轮系；齿轮比把计数送到表盘。",
      annotation: "振荡 → 释放 → 齿轮比 → 显示",
      measure: "模型边界 · 不是精密调校配方",
      beats: [
        {
          action: "计数释放",
          title: "离散运动进入齿轮比",
          body: "重复释放让轮系逐步前进，指针据此累计读数。",
        },
        {
          action: "标出边界",
          title: "精度不只由这张图决定",
          body: "真实钟表还受齿形、摩擦、反冲、驱动力、摆的几何和环境影响。",
        },
      ],
    },
  },
  5: {
    en: {
      plate: "PLATE 05 · ASSEMBLED CLOCK",
      title: "One measured step. Then stillness.",
      subtitle:
        "The escapement lets stored energy pass only when the oscillator's geometry permits it.",
      annotation: "Release one tooth · sustain the pendulum · count the interval",
      measure: "FINAL STATE · settled for inspection",
      beats: [
        {
          action: "Reassemble",
          title: "Continuous power becomes discrete time",
          body: "The dial moves because the mechanism repeatedly releases, pushes, and locks—not because the wheel spins freely.",
        },
      ],
    },
    zh: {
      plate: "图版 05 · 组装完成",
      title: "走一格，然后静止。",
      subtitle: "只有振荡器的几何状态允许时，擒纵机构才放行储存的能量。",
      annotation: "放行一齿 · 维持摆动 · 累计间隔",
      measure: "最终状态 · 静置供检查",
      beats: [
        {
          action: "重新组装",
          title: "持续动力变成离散时间",
          body: "表盘前进，靠的是反复释放、冲量和锁止，而不是齿轮自由旋转。",
        },
      ],
    },
  },
};

const TRANSITION_SCORE = {
  "1->2": "hard-cut",
  "2->3": "linear-wipe",
  "3->4": "iris-open",
  "4->5": "focus-swap",
} as const satisfies TopicTransitionScore;

const TRANSITION_MAP: SceneTransitionMap = TRANSITION_SCORE;

const BEAT_LAYOUT_MODES: Record<SceneId, BeatLayoutMode> = {
  1: "reserved",
  2: "reserved",
  3: "reserved",
  4: "reserved",
  5: "reserved",
};

const ESCAPEMENT_SOURCES = [
  {
    authority: "Smithsonian National Air and Space Museum · Time and Navigation",
    title: "Mechanical Clock",
    url: "https://timeandnavigation.si.edu/timeline2/1000",
    supports:
      "Defines the escapement as the clock's regulating brake, releasing power from a falling weight or unwinding spring at a controlled rate.",
  },
  {
    authority: "National Institute of Standards and Technology",
    title: "Everyday Time and Atomic Time: Part 3",
    url: "https://www.nist.gov/blogs/taking-measure/everyday-time-and-atomic-time-part-3",
    supports:
      "Explains that a pendulum-clock escapement advances a toothed wheel discretely and gives the pendulum a gentle push to replace frictional losses.",
  },
  {
    authority: "Science Museum Group Collection",
    title: "Anchor escapement collection records",
    url: "https://collection.sciencemuseumgroup.org.uk/search/objects/object_type/anchor-escapement",
    supports:
      "Documents surviving anchor-escapement models and longcase-clock movements, grounding the selected mechanism in real museum objects.",
  },
  {
    authority: "Getty Research Institute · Art & Architecture Thesaurus",
    title: "Anchor escapements",
    url: "https://www.getty.edu/vow/AATFullDisplay?find=&logic=AND&note=chinese&subjectid=300197628",
    supports:
      "Defines anchor escapements by wedge-shaped pallets engaging an escape wheel and notes the recoil that distinguishes this selected type.",
  },
] as const satisfies readonly Source[];

const NAVIGATION = {
  geometry: "edge-scale",
  carrier: "gear-tooth-register",
  invocation: "keyboard-focus",
  feedback: "typographic-emphasis",
} as const;

const PHASES: CyclePhase[] = ["lock", "impulse", "release", "relock"];

const NAV_LABELS: Record<Lang, Record<SceneId, string>> = {
  en: {
    1: "question",
    2: "train",
    3: "cycle",
    4: "count",
    5: "clock",
  },
  zh: {
    1: "提问",
    2: "轮系",
    3: "周期",
    4: "计数",
    5: "组装",
  },
};

function clampBeat(scene: SceneCopy, beat: number): number {
  return Math.max(0, Math.min(beat, scene.beats.length - 1));
}

function metadataScenes(language: Lang): TopicMetadata["scenes"] {
  return SCENE_IDS.map((sceneId) => {
    const scene = COPY[sceneId][language];
    return {
      id: sceneId,
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

function buildMetadata(language: Lang): TopicMetadata {
  return {
    theme: language === "zh" ? "锚形擒纵机构剖解" : "Anchor Escapement Cutaway",
    densityLabel: language === "zh" ? "图解型" : "Diagram Explainer",
    heroScene: 3,
    colors: {
      bg: "#101313",
      ink: "#f4f0df",
      panel: "#1a1f1f",
    },
    typography: {
      header: "IBM Plex Mono 700",
      body: "IBM Plex Mono 500",
    },
    tags: [
      "operating-manual",
      "mechanical-cutaway",
      "diagram",
      "industrial",
      "monospace",
      "reading-first",
      "restrained-motion",
    ],
    fonts: ["IBM Plex Mono", "cjk:Noto Sans SC"],
    scenes: metadataScenes(language),
  };
}

const CLOCK_MARKS = Array.from({ length: 60 }, (_, index) => index);
const GEAR_TEETH = Array.from({ length: 16 }, (_, index) => index);
const SMALL_GEAR_TEETH = Array.from({ length: 12 }, (_, index) => index);

function ClockFace({
  language,
  compact = false,
}: {
  language: Lang;
  compact?: boolean;
}) {
  return (
    <svg
      className={compact ? styles.clockSvgCompact : styles.clockSvg}
      viewBox="0 0 620 620"
      role="img"
      aria-label={
        language === "zh"
          ? "两次滴答之间被锁住的钟面与锚形擒纵剖面"
          : "Clock face held between ticks with an anchor escapement cutaway"
      }
    >
      <circle className={styles.clockOuter} cx="310" cy="310" r="258" />
      <circle className={styles.clockInner} cx="310" cy="310" r="226" />
      {CLOCK_MARKS.map((mark) => (
        <line
          key={mark}
          className={mark % 5 === 0 ? styles.hourMark : styles.minuteMark}
          x1="310"
          y1={mark % 5 === 0 ? "78" : "88"}
          x2="310"
          y2={mark % 5 === 0 ? "104" : "98"}
          transform={`rotate(${mark * 6} 310 310)`}
        />
      ))}
      <text className={styles.dialNumber} x="310" y="140" textAnchor="middle">
        12
      </text>
      <text className={styles.dialNumber} x="482" y="324" textAnchor="middle">
        3
      </text>
      <text className={styles.dialNumber} x="310" y="506" textAnchor="middle">
        6
      </text>
      <text className={styles.dialNumber} x="136" y="324" textAnchor="middle">
        9
      </text>
      <line className={styles.hourHand} x1="310" y1="310" x2="244" y2="350" />
      <line className={styles.minuteHand} x1="310" y1="310" x2="310" y2="170" />
      <g className={styles.secondHandHeld}>
        <line x1="310" y1="346" x2="310" y2="116" />
        <circle cx="310" cy="310" r="10" />
      </g>
      <g className={styles.cutawayWindow} transform="translate(386 354)">
        <rect x="0" y="0" width="164" height="132" rx="4" />
        <g transform="translate(82 76)">
          {SMALL_GEAR_TEETH.map((tooth) => (
            <rect
              key={tooth}
              className={styles.cutawayTooth}
              x="-5"
              y="-57"
              width="10"
              height="18"
              transform={`rotate(${tooth * 30})`}
            />
          ))}
          <circle className={styles.cutawayWheel} cx="0" cy="0" r="42" />
          <path className={styles.cutawayAnchor} d="M -46 -32 L 0 10 L 46 -32" />
        </g>
      </g>
      <path className={styles.calloutLine} d="M 466 350 L 520 290 L 582 290" />
      <text className={styles.calloutText} x="580" y="280" textAnchor="end">
        {language === "zh" ? "锁止" : "HELD"}
      </text>
    </svg>
  );
}

function Gear({
  x,
  y,
  radius,
  teeth = 16,
  className,
}: {
  x: number;
  y: number;
  radius: number;
  teeth?: number;
  className?: string;
}) {
  const marks = Array.from({ length: teeth }, (_, index) => index);
  return (
    <g className={className} transform={`translate(${x} ${y})`}>
      {marks.map((tooth) => (
        <rect
          key={tooth}
          className={styles.gearTooth}
          x="-6"
          y={-radius - 15}
          width="12"
          height="25"
          rx="2"
          transform={`rotate(${tooth * (360 / teeth)})`}
        />
      ))}
      <circle className={styles.gearRing} cx="0" cy="0" r={radius} />
      <circle className={styles.gearHub} cx="0" cy="0" r={radius * 0.24} />
      {Array.from({ length: 6 }, (_, index) => (
        <line
          key={index}
          className={styles.gearSpoke}
          x1="0"
          y1={-radius * 0.22}
          x2="0"
          y2={-radius * 0.82}
          transform={`rotate(${index * 60})`}
        />
      ))}
    </g>
  );
}

function ExplodedTrain({ beat, language }: { beat: number; language: Lang }) {
  const labels =
    language === "zh"
      ? ["储能", "轮系", "擒纵轮", "锚形叉瓦", "摆"]
      : ["STORED ENERGY", "GOING TRAIN", "ESCAPE WHEEL", "ANCHOR PALLETS", "PENDULUM"];
  const descriptions =
    language === "zh"
      ? ["发条 / 重锤", "传递转矩", "离散放行", "交替接触", "给出节律"]
      : ["spring / weight", "carries torque", "metered release", "alternating contact", "sets the rhythm"];

  return (
    <div className={styles.explodedWrap} data-exploded-beat={beat}>
      <div className={styles.mechanismName}>
        {language === "zh" ? "锚形擒纵 · 反冲式" : "ANCHOR ESCAPEMENT · RECOIL TYPE"}
      </div>
      <svg
        className={styles.explodedSvg}
        viewBox="0 0 900 500"
        role="img"
        aria-label="Exploded functional path of a pendulum clock with an anchor escapement"
      >
        <path className={styles.powerPath} d="M 122 258 H 758" />
        <path className={styles.powerArrow} d="M 750 246 L 772 258 L 750 270" />

        <g data-mechanism-part="true" data-visible="true" className={styles.explodedPart}>
          <circle className={styles.springBarrel} cx="112" cy="258" r="72" />
          <path
            className={styles.springCoil}
            d="M 112 258 c 0 -42 54 -42 54 0 c 0 54 -108 54 -108 0 c 0 -78 162 -78 162 0"
          />
          <line className={styles.partLeader} x1="112" y1="178" x2="112" y2="116" />
          <text className={styles.partNumber} x="112" y="78" textAnchor="middle">01</text>
          <text className={styles.partLabel} x="112" y="98" textAnchor="middle">{labels[0]}</text>
          <text className={styles.partDescription} x="112" y="378" textAnchor="middle">{descriptions[0]}</text>
        </g>

        <g data-mechanism-part="true" data-visible="true" className={styles.explodedPart}>
          <Gear x={286} y={258} radius={58} teeth={14} />
          <Gear x={354} y={212} radius={30} teeth={10} />
          <line className={styles.partLeader} x1="320" y1="174" x2="320" y2="116" />
          <text className={styles.partNumber} x="320" y="78" textAnchor="middle">02</text>
          <text className={styles.partLabel} x="320" y="98" textAnchor="middle">{labels[1]}</text>
          <text className={styles.partDescription} x="320" y="378" textAnchor="middle">{descriptions[1]}</text>
        </g>

        <g
          data-mechanism-part="true"
          data-visible="true"
          className={styles.explodedPart}
        >
          <Gear x={482} y={258} radius={72} teeth={16} className={styles.escapeGearExploded} />
          <line className={styles.partLeader} x1="482" y1="168" x2="482" y2="116" />
          <text className={styles.partNumber} x="482" y="78" textAnchor="middle">03</text>
          <text className={styles.partLabel} x="482" y="98" textAnchor="middle">{labels[2]}</text>
          <text className={styles.partDescription} x="482" y="378" textAnchor="middle">{descriptions[2]}</text>
        </g>

        <g
          data-mechanism-part="true"
          data-visible={beat >= 1 ? "true" : "pending"}
          className={`${styles.explodedPart} ${beat >= 1 ? styles.partRevealed : styles.partPending}`}
        >
          <circle className={styles.anchorPivot} cx="650" cy="188" r="13" />
          <path className={styles.explodedAnchor} d="M 650 188 L 592 270 L 620 284 L 650 248 L 680 284 L 708 270 Z" />
          <line className={styles.partLeader} x1="650" y1="166" x2="650" y2="116" />
          <text className={styles.partNumber} x="650" y="78" textAnchor="middle">04</text>
          <text className={styles.partLabel} x="650" y="98" textAnchor="middle">{labels[3]}</text>
          <text className={styles.partDescription} x="650" y="378" textAnchor="middle">{descriptions[3]}</text>
        </g>

        <g
          data-mechanism-part="true"
          data-visible={beat >= 1 ? "true" : "pending"}
          className={`${styles.explodedPart} ${beat >= 1 ? styles.partRevealed : styles.partPending}`}
        >
          <line className={styles.pendulumRod} x1="794" y1="150" x2="794" y2="324" />
          <circle className={styles.pendulumBob} cx="794" cy="338" r="42" />
          <line className={styles.partLeader} x1="794" y1="132" x2="794" y2="116" />
          <text className={styles.partNumber} x="794" y="78" textAnchor="middle">05</text>
          <text className={styles.partLabel} x="794" y="98" textAnchor="middle">{labels[4]}</text>
          <text className={styles.partDescription} x="794" y="406" textAnchor="middle">{descriptions[4]}</text>
        </g>
      </svg>
    </div>
  );
}

function EscapementCycle({
  beat,
  language,
  reduce,
}: {
  beat: number;
  language: Lang;
  reduce: boolean;
}) {
  const phase = PHASES[Math.max(0, Math.min(beat, PHASES.length - 1))];
  const wheelSteps = [0, 6, 13, 20];
  const anchorSteps = [-3, 0, 4, 2];
  const entryEngaged = phase === "lock" || phase === "impulse";
  const exitEngaged = phase === "relock";
  const phaseLabels =
    language === "zh"
      ? ["锁止", "冲量", "释放", "再锁止"]
      : ["LOCK", "IMPULSE", "RELEASE", "RELOCK"];

  return (
    <div
      className={styles.cycleWrap}
      data-escapement-cycle="true"
      data-phase={phase}
      data-motion={reduce ? "off" : "on"}
    >
      <svg
        className={styles.cycleSvg}
        viewBox="0 0 760 560"
        role="img"
        aria-label="Four-step close-up of the same recoil anchor escapement cycle"
      >
        <g className={styles.measureLines}>
          <line x1="80" y1="120" x2="680" y2="120" />
          <line x1="80" y1="110" x2="80" y2="130" />
          <line x1="680" y1="110" x2="680" y2="130" />
          <text x="380" y="100" textAnchor="middle">
            {language === "zh" ? "细节 B · 接触几何" : "DETAIL B · CONTACT GEOMETRY"}
          </text>
        </g>

        <line className={styles.pendulumAxis} x1="380" y1="98" x2="380" y2="548" />
        <g
          className={styles.stepGear}
          transform={`translate(380 350) rotate(${wheelSteps[beat] ?? wheelSteps[0]})`}
        >
          {GEAR_TEETH.map((tooth) => (
            <rect
              key={tooth}
              className={styles.escapeTooth}
              x="-8"
              y="-175"
              width="16"
              height="34"
              rx="2"
              transform={`rotate(${tooth * 22.5})`}
            />
          ))}
          <circle className={styles.escapeWheel} cx="0" cy="0" r="145" />
          <circle className={styles.escapeHub} cx="0" cy="0" r="26" />
          {Array.from({ length: 8 }, (_, index) => (
            <line
              key={index}
              className={styles.escapeSpoke}
              x1="0"
              y1="-25"
              x2="0"
              y2="-126"
              transform={`rotate(${index * 45})`}
            />
          ))}
        </g>

        <g
          className={styles.anchorAssembly}
          transform={`translate(380 142) rotate(${anchorSteps[beat] ?? anchorSteps[0]})`}
        >
          <circle className={styles.anchorAxis} cx="0" cy="0" r="18" />
          <path
            className={styles.anchorBody}
            d="M 0 0 L -118 124 L -84 146 L -38 106 L 0 82 L 38 106 L 84 146 L 118 124 Z"
          />
          <rect className={styles.palletFace} x="-132" y="118" width="48" height="20" rx="3" transform="rotate(-18 -108 128)" />
          <rect className={styles.palletFace} x="84" y="118" width="48" height="20" rx="3" transform="rotate(18 108 128)" />
          <line className={styles.pendulumRodDetail} x1="0" y1="8" x2="0" y2="332" />
          <circle className={styles.pendulumBobDetail} cx="0" cy="360" r="42" />
        </g>

        <g className={styles.contactLayer}>
          <circle
            data-contact-point="true"
            data-contact-side="entry"
            data-contact-state={entryEngaged ? "engaged" : "clear"}
            className={styles.contactPoint}
            cx="274"
            cy="278"
            r="16"
          />
          <circle
            data-contact-point="true"
            data-contact-side="exit"
            data-contact-state={exitEngaged ? "engaged" : "clear"}
            className={styles.contactPoint}
            cx="486"
            cy="278"
            r="16"
          />
          <text className={styles.contactLabel} x="236" y="248" textAnchor="end">
            {language === "zh" ? "进瓦接触" : "ENTRY CONTACT"}
          </text>
          <text className={styles.contactLabel} x="524" y="248">
            {language === "zh" ? "出瓦接触" : "EXIT CONTACT"}
          </text>
        </g>
      </svg>
      <ol className={styles.phaseRail} aria-label={language === "zh" ? "擒纵周期" : "Escapement cycle"}>
        {PHASES.map((item, index) => (
          <li
            key={item}
            data-phase-state={index === beat ? "active" : index < beat ? "complete" : "pending"}
          >
            <span>{String(index + 1).padStart(2, "0")}</span>
            <strong>{phaseLabels[index]}</strong>
          </li>
        ))}
      </ol>
    </div>
  );
}

function CountingChain({ beat, language }: { beat: number; language: Lang }) {
  const stages =
    language === "zh"
      ? ["摆的节律", "离散释放", "齿轮比", "表盘读数"]
      : ["PENDULUM RHYTHM", "METERED RELEASE", "GEAR RATIO", "DIAL READING"];
  const boundary =
    language === "zh"
      ? ["齿形", "摩擦", "反冲", "驱动力", "摆长与环境"]
      : ["tooth profile", "friction", "recoil", "drive", "pendulum + environment"];

  return (
    <div className={styles.countingWrap} data-counting-beat={beat}>
      <svg
        className={styles.countingSvg}
        viewBox="0 0 900 480"
        role="img"
        aria-label="Counting chain from oscillator through escapement and gear ratio to dial"
      >
        <path className={styles.countPath} d="M 88 236 H 812" />
        <path className={styles.countArrow} d="M 800 222 L 824 236 L 800 250" />

        <g className={styles.pendulumSymbol} transform="translate(118 92)">
          <circle cx="0" cy="0" r="12" />
          <line x1="0" y1="0" x2="0" y2="144" />
          <circle cx="0" cy="164" r="34" />
          <path d="M -48 120 Q 0 162 48 120" />
        </g>
        <g className={styles.releaseSymbol} transform="translate(338 236)">
          <Gear x={0} y={0} radius={64} teeth={12} />
          <path className={styles.countAnchor} d="M -62 -84 L 0 -26 L 62 -84" />
        </g>
        <g className={styles.ratioSymbol} transform="translate(570 236)">
          <Gear x={-28} y={12} radius={54} teeth={14} />
          <Gear x={48} y={-28} radius={32} teeth={10} />
        </g>
        <g className={styles.dialSymbol} transform="translate(790 236)">
          <circle cx="0" cy="0" r="74" />
          <line x1="0" y1="0" x2="0" y2="-50" />
          <line x1="0" y1="0" x2="40" y2="18" />
          <circle cx="0" cy="0" r="6" />
        </g>

        {stages.map((stage, index) => (
          <g key={stage} className={styles.stageLabel} transform={`translate(${118 + index * 224} 396)`}>
            <text className={styles.stageNumber} x="0" y="0" textAnchor="middle">{String(index + 1).padStart(2, "0")}</text>
            <text x="0" y="26" textAnchor="middle">{stage}</text>
          </g>
        ))}
      </svg>

      <div
        className={`${styles.boundaryStrip} ${beat >= 1 ? styles.boundaryVisible : ""}`}
        data-boundary={beat >= 1 ? "visible" : "reserved"}
      >
        <span>{language === "zh" ? "真实误差还来自" : "REAL ERROR ALSO ENTERS THROUGH"}</span>
        {boundary.map((item) => (
          <strong key={item}>{item}</strong>
        ))}
      </div>
    </div>
  );
}

function AssembledClock({ language, reduce }: { language: Lang; reduce: boolean }) {
  return (
    <div className={styles.assembledWrap} data-clock-state="settled" data-motion={reduce ? "off" : "on"}>
      <svg
        className={styles.assembledSvg}
        viewBox="0 0 760 600"
        role="img"
        aria-label="Assembled pendulum clock with a settled one-step second hand"
      >
        <path className={styles.clockCase} d="M 190 48 H 570 L 604 100 V 552 H 156 V 100 Z" />
        <rect className={styles.clockCaseInset} x="184" y="82" width="392" height="438" rx="4" />
        <circle className={styles.finalDial} cx="380" cy="238" r="142" />
        {Array.from({ length: 12 }, (_, index) => (
          <line
            key={index}
            className={styles.finalDialMark}
            x1="380"
            y1="116"
            x2="380"
            y2="136"
            transform={`rotate(${index * 30} 380 238)`}
          />
        ))}
        <line className={styles.finalHourHand} x1="380" y1="238" x2="320" y2="266" />
        <line className={styles.finalMinuteHand} x1="380" y1="238" x2="380" y2="154" />
        <g className={styles.finalSecondHand} transform="rotate(6 380 238)">
          <line x1="380" y1="268" x2="392" y2="128" />
          <circle cx="380" cy="238" r="8" />
        </g>
        <g className={styles.finalCutaway} transform="translate(380 395)">
          <Gear x={0} y={0} radius={64} teeth={14} />
          <path className={styles.finalAnchor} d="M -70 -74 L 0 -18 L 70 -74" />
          <line className={styles.finalPendulum} x1="0" y1="-84" x2="0" y2="112" />
          <circle className={styles.finalPendulumBob} cx="0" cy="132" r="34" />
        </g>
        <path className={styles.finalCallout} d="M 480 395 H 650 V 344" />
        <text className={styles.finalCalloutLabel} x="650" y="326" textAnchor="end">
          {language === "zh" ? "已锁止" : "LOCKED"}
        </text>
      </svg>
      <div className={styles.finalStamp}>
        <span>01</span>
        <strong>{language === "zh" ? "一格" : "ONE STEP"}</strong>
        <small>{language === "zh" ? "然后静止" : "THEN STILL"}</small>
      </div>
    </div>
  );
}

function SceneVisual({
  sceneId,
  beat,
  language,
  reduce,
}: {
  sceneId: SceneId;
  beat: number;
  language: Lang;
  reduce: boolean;
}) {
  if (sceneId === 1) return <ClockFace language={language} />;
  if (sceneId === 2) return <ExplodedTrain beat={beat} language={language} />;
  if (sceneId === 3) {
    return <EscapementCycle beat={beat} language={language} reduce={reduce} />;
  }
  if (sceneId === 4) return <CountingChain beat={beat} language={language} />;
  return <AssembledClock language={language} reduce={reduce} />;
}

function ScenePanel({
  sceneId,
  beat,
  language,
  reduce,
}: {
  sceneId: SceneId;
  beat: number;
  language: Lang;
  reduce: boolean;
}) {
  const scene = COPY[sceneId][language];
  const safeBeat = clampBeat(scene, beat);
  const currentBeat = scene.beats[safeBeat];

  return (
    <section
      className={styles.scene}
      data-scene-content={sceneId}
      data-scene={sceneId}
      data-beat={safeBeat}
      aria-label={scene.title}
    >
      <header className={styles.sceneHeader} data-beat-layout-item="true">
        <div className={styles.plateCode}>{scene.plate}</div>
        <div className={styles.headerRule} aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <div className={styles.sheetNumber}>SHT {String(sceneId).padStart(2, "0")} / 05</div>
      </header>

      <div className={styles.sceneBody}>
        <div className={styles.titleBlock} data-beat-layout-item="true">
          <div className={styles.sceneIndex}>{String(sceneId).padStart(2, "0")}</div>
          <h1>{scene.title}</h1>
          <p>{scene.subtitle}</p>
          <div className={styles.annotation}>{scene.annotation}</div>
        </div>

        <div className={styles.visualPlate} data-beat-layout-item="true">
          <div className={styles.cropMarkTopLeft} aria-hidden="true" />
          <div className={styles.cropMarkBottomRight} aria-hidden="true" />
          <SceneVisual
            sceneId={sceneId}
            beat={safeBeat}
            language={language}
            reduce={reduce}
          />
          <div className={styles.measureCaption}>{scene.measure}</div>
        </div>

        <aside className={styles.beatNote} data-beat-layout-item="true">
          <div className={styles.beatNoteHead}>
            <span>{String(safeBeat + 1).padStart(2, "0")}</span>
            <strong>{currentBeat.action}</strong>
          </div>
          <h2>{currentBeat.title}</h2>
          <p>{currentBeat.body}</p>
          <div className={styles.beatTicks} aria-label={language === "zh" ? "当前步骤" : "Current step"}>
            {scene.beats.map((item, index) => (
              <i
                key={item.action}
                data-state={index === safeBeat ? "active" : index < safeBeat ? "complete" : "pending"}
              />
            ))}
          </div>
        </aside>
      </div>

      <footer className={styles.sceneFooter} data-beat-layout-item="true">
        <span>OM–38 · RECOIL ANCHOR</span>
        <span>{language === "zh" ? "原创示意 · 非真实比例" : "ORIGINAL DIAGRAM · NOT TO SCALE"}</span>
        <span>REV A</span>
      </footer>
    </section>
  );
}

function GearToothNavigation({
  activeScene,
  language,
  onNavigate,
}: {
  activeScene: number;
  language: Lang;
  onNavigate?: (scene: number, beat: number) => void;
}) {
  const moveFrom = (from: number, key: string) => {
    if (key === "Home") return 1;
    if (key === "End") return 5;
    if (key === "ArrowDown" || key === "ArrowRight") return Math.min(5, from + 1);
    if (key === "ArrowUp" || key === "ArrowLeft") return Math.max(1, from - 1);
    return null;
  };

  const stopPointer = (event: PointerEvent<HTMLButtonElement>) => {
    event.stopPropagation();
  };

  const activate = (event: MouseEvent<HTMLButtonElement>, target: SceneId) => {
    event.preventDefault();
    event.stopPropagation();
    onNavigate?.(target, 0);
  };

  const handleKey = (event: KeyboardEvent<HTMLButtonElement>, from: SceneId) => {
    const target = moveFrom(from, event.key);
    if (target === null) return;
    event.preventDefault();
    event.stopPropagation();
    onNavigate?.(target, 0);
  };

  return (
    <nav
      className={styles.gearRegister}
      aria-label={language === "zh" ? "齿号场景索引" : "Gear-tooth scene register"}
      data-topic-navigation="true"
      data-navigation-geometry={NAVIGATION.geometry}
      data-navigation-carrier={NAVIGATION.carrier}
      data-navigation-invocation={NAVIGATION.invocation}
      data-navigation-feedback={NAVIGATION.feedback}
    >
      <span className={styles.registerLabel}>{language === "zh" ? "齿号" : "TOOTH"}</span>
      <div className={styles.registerButtons}>
        {SCENE_IDS.map((sceneId) => {
          const active = sceneId === activeScene;
          return (
            <button
              key={sceneId}
              type="button"
              aria-label={
                language === "zh"
                  ? `跳转到场景 ${sceneId}：${NAV_LABELS.zh[sceneId]}`
                  : `Jump to scene ${sceneId}: ${NAV_LABELS.en[sceneId]}`
              }
              aria-current={active ? "step" : undefined}
              data-register-state={active ? "active" : "idle"}
              onPointerDown={stopPointer}
              onClick={(event) => activate(event, sceneId)}
              onKeyDown={(event) => handleKey(event, sceneId)}
            >
              <span>{String(sceneId).padStart(2, "0")}</span>
              <small>{NAV_LABELS[language][sceneId]}</small>
            </button>
          );
        })}
      </div>
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
  const reduce = reducedMotion || isThumbnail;

  return (
    <div
      className={`${styles.root} ${reduce ? styles.reduce : ""} ${isThumbnail ? styles.thumbnail : ""}`}
      data-style="operating-manual"
      data-topic-id="escapement"
      data-motion={reduce ? "off" : "on"}
      data-thumbnail={isThumbnail ? "true" : "false"}
    >
      <div className={styles.gridField} aria-hidden="true" />
      <SpatialSceneTrack
        scene={scene}
        beat={beat}
        transitionKind="hard-cut"
        transitionMap={TRANSITION_MAP}
        transitionDurationMs={560}
        reducedMotion={reduce}
        beatLayoutModes={BEAT_LAYOUT_MODES}
        renderScene={(sceneId, sceneBeat, isActive) => (
          <ScenePanel
            sceneId={sceneId as SceneId}
            beat={sceneBeat}
            language={language}
            reduce={reduce || !isActive}
          />
        )}
      />
      {!isThumbnail && (
        <GearToothNavigation
          activeScene={scene}
          language={language}
          onNavigate={onNavigate}
        />
      )}
    </div>
  );
}

const METADATA = {
  en: buildMetadata("en"),
  zh: buildMetadata("zh"),
} satisfies { en: TopicMetadata; zh: TopicMetadata };

const EVIDENCE = {
  kind: "mixed",
  sources: ESCAPEMENT_SOURCES,
  boundary: {
    en: "Illustrative mechanical schematic: the recoil anchor escapement diagrams are conceptual, not to scale, and not a precision-adjustment recipe.",
    zh: "示意性机械图：反冲式锚形擒纵图仅用于概念说明，不按比例绘制，也不是精密调校配方。",
  },
  display: "envelope",
} as const;

export default defineTopic({
  id: "escapement",
  styleId: "operating-manual",
  title: {
    en: "The Escapement",
    zh: "擒纵器",
  },
  modelId: "GPT 5.6 Sol",
  Stage: TopicStage,
  metadata: METADATA,
  navigation: NAVIGATION,
  transitionScore: TRANSITION_SCORE,
  evidence: EVIDENCE,
});

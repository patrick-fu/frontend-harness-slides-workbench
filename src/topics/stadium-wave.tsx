import { useEffect } from "react";
import type { CSSProperties, KeyboardEvent, MouseEvent, PointerEvent } from "react";
import type {
  TopicDefinition,
  TopicMetadata,
  TopicStageProps,
} from "../domain/topic";
import { defineTopic } from "../domain/topic";
import SpatialSceneTrack, {
  type BeatLayoutMode,
  type SceneTransitionMap,
  type SceneTransitionModifierMap,
} from "../styles/SpatialSceneTrack";
import standingActorUrl from "../styles/assets/stadium-wave/openmoji-person-standing.svg";
import raisedActorUrl from "../styles/assets/stadium-wave/openmoji-person-raising-hand.svg";
import styles from "./stadium-wave.module.css";

type Language = "en" | "zh";
type SceneId = 1 | 2 | 3 | 4 | 5;
type ActorState = "seated" | "watching" | "standing" | "raised";
type CssVars = CSSProperties & Record<`--${string}`, string | number>;

interface SceneCopy {
  eyebrow: string;
  title: string;
  body: string;
  note: string;
  source: string;
  labels: string[];
  beats: TopicMetadata["scenes"][number]["beats"];
}

interface ActorPosition {
  x: string;
  y: string;
  rotation: string;
}

export const STADIUM_WAVE_SOURCES = [
  {
    id: "farkas-helbing-vicsek-2002",
    citation:
      "Farkas, I., Helbing, D. & Vicsek, T. Mexican waves in an excitable medium. Nature 419, 131–132 (2002).",
    url: "https://doi.org/10.1038/419131a",
    supports:
      "Spectators stand, raise their arms, sit, and pass the visible front to the next section; excitable-medium models reproduce this collective pattern.",
  },
  {
    id: "farkas-helbing-vicsek-2003",
    citation:
      "Farkas, I., Helbing, D. & Vicsek, T. Human waves in stadiums. Physica A 330, 18–24 (2003).",
    url: "https://doi.org/10.1016/j.physa.2003.08.014",
    supports:
      "Wave formation and propagation can be treated as distinct stages; a small local excitation spreads only when nearby reactions sustain it.",
  },
  {
    id: "farkas-vicsek-2006",
    citation:
      "Farkas, I. J. & Vicsek, T. Initiating a Mexican wave: An instantaneous collective decision with both short- and long-range interactions. Physica A 369, 830–840 (2006).",
    url: "https://doi.org/10.1016/j.physa.2006.01.075",
    supports:
      "A small group launches the wave; neighboring groups repeat the stand–raise–sit action with a short delay, while collective interactions select a propagation direction.",
  },
] as const;

export const STADIUM_WAVE_ASSET_CREDIT = {
  creator: "OpenMoji",
  version: "16.0",
  license: "CC BY-SA 4.0",
  source: "https://openmoji.org/",
  localAssets: [
    "assets/stadium-wave/openmoji-person-standing.svg",
    "assets/stadium-wave/openmoji-person-raising-hand.svg",
  ],
} as const;

const SCENE_IDS: SceneId[] = [1, 2, 3, 4, 5];

export const STADIUM_WAVE_TRANSITION_SCORE = {
  "1->2": "push-x",
  "2->3": "card-carousel",
  "3->4": "diagonal-pan",
  "4->5": "grid-reveal",
} as const satisfies TopicDefinition["transitionScore"];

const NAVIGATION = {
  geometry: "spatial-node",
  carrier: "stadium-seating-array",
  invocation: "auto-hide",
  feedback: "active-glow",
} as const satisfies TopicDefinition["navigation"];

const TRANSITION_MAP: SceneTransitionMap = STADIUM_WAVE_TRANSITION_SCORE;

const TRANSITION_MODIFIER_MAP: SceneTransitionModifierMap = {
  "3->4": "stadium-wave",
};

const BEAT_LAYOUT_MODES: Record<SceneId, BeatLayoutMode> = {
  1: "reserved",
  2: "reserved",
  3: "reserved",
  4: "reserved",
  5: "reserved",
};

const COPY: Record<Language, Record<SceneId, SceneCopy>> = {
  en: {
    1: {
      eyebrow: "Crowd physics / opening trigger",
      title: "A wave with no water",
      body:
        "A small group stands, lifts its arms, then sits. Nearby spectators decide whether to repeat the action.",
      note: "First, only a few bodies move.",
      source:
        "Farkas · Helbing · Vicsek, Nature 419 (2002) · SVG actors: OpenMoji / CC BY-SA 4.0",
      labels: ["seated crowd", "small trigger"],
      beats: [
        {
          id: 0,
          action: "Hold the seated stadium still",
          title: "The crowd is ready",
          body: "No wave exists until a local group attempts to start one.",
        },
        {
          id: 1,
          action: "Raise one local trigger group",
          title: "A few spectators stand",
          body: "The disturbance begins locally rather than everywhere at once.",
        },
      ],
    },
    2: {
      eyebrow: "Crowd physics / local rule",
      title: "The rule lives next door",
      body:
        "Watch the nearby section. If the movement catches, rise after a short delay, then sit as the front moves on.",
      note: "watch → rise → sit → repeat",
      source: "Farkas · Vicsek, Physica A 369 (2006)",
      labels: ["WATCH", "RISE", "SIT", "REPEAT"],
      beats: [
        {
          id: 0,
          action: "The initiator raises both arms",
          title: "Trigger",
          body: "A small group makes the first visible move.",
        },
        {
          id: 1,
          action: "The nearest section responds",
          title: "Neighbor reacts",
          body: "Nearby spectators repeat the action after a short delay.",
        },
        {
          id: 2,
          action: "The activation front moves one section onward",
          title: "Front advances",
          body: "The earlier group returns toward its seat.",
        },
        {
          id: 3,
          action: "The previous groups settle while the next group rises",
          title: "Reset and repeat",
          body: "Resting behind the front lets the pattern remain legible.",
        },
      ],
    },
    3: {
      eyebrow: "Crowd physics / top view",
      title: "People stay. The state travels.",
      body:
        "Each spectator remains at one seat. What moves around the bowl is a sequence of states: ready, rising, standing, resting.",
      note: "position = fixed / state = moving",
      source: "Farkas · Helbing · Vicsek, Physica A 330 (2003)",
      labels: ["fixed seat", "moving state", "visible path"],
      beats: [
        {
          id: 0,
          action: "Pin every spectator to a fixed seat node",
          title: "Seats do not move",
          body: "The stadium geometry stays unchanged.",
        },
        {
          id: 1,
          action: "Move the active state along the same nodes",
          title: "Activation moves",
          body: "A new section stands while the last one settles.",
        },
        {
          id: 2,
          action: "Trace the state path without moving any node",
          title: "A traveling pattern",
          body: "The visible wave is coordination, not crowd transport.",
        },
      ],
    },
    4: {
      eyebrow: "Crowd physics / signature relay",
      title: "Not every start survives",
      body:
        "Excitable-medium models separate a successful traveling front from a trigger that fades before recruiting the next section.",
      note: "A weak handoff can stop the front.",
      source: "Model view · Nature 2002 + Physica A 2003",
      labels: ["trigger", "front", "weak section", "decay", "rest"],
      beats: [
        {
          id: 0,
          action: "Section one launches a relay",
          title: "Trigger",
          body: "A compact group rises together.",
        },
        {
          id: 1,
          action: "Section two catches the front",
          title: "Recruit",
          body: "The next local group repeats the action.",
        },
        {
          id: 2,
          action: "Section three continues the front",
          title: "Propagate",
          body: "The relay becomes a recognizable wave.",
        },
        {
          id: 3,
          action: "A weak section only partly responds",
          title: "Below threshold",
          body: "The attempted handoff loses coherence.",
        },
        {
          id: 4,
          action: "The downstream section remains seated",
          title: "The front fades",
          body: "This start does not complete a lap.",
        },
      ],
    },
    5: {
      eyebrow: "Crowd physics / quiet hold",
      title: "Coordination, one neighbor at a time",
      body:
        "No spectator runs around the bowl. A shared pattern emerges from delayed local reactions—and disappears when those reactions stop.",
      note: "The people return to rest. The path remains as a chalk line.",
      source:
        "Research pack: Nature 419 · Physica A 330 · Physica A 369 · SVG: OpenMoji / CC BY-SA 4.0",
      labels: ["local action", "shared pattern"],
      beats: [
        {
          id: 0,
          action: "Settle every actor and keep only the chalk waveform",
          title: "Local action, collective pattern",
          body: "The final state is still and reviewable.",
        },
      ],
    },
  },
  zh: {
    1: {
      eyebrow: "群体动力学 / 启动",
      title: "没有水的人浪",
      body: "一小群观众起立、举手，再坐下。附近的人决定是否接着重复这个动作。",
      note: "最先移动的，只是少数几个人。",
      source:
        "Farkas · Helbing · Vicsek，Nature 419（2002）· SVG 角色：OpenMoji / CC BY-SA 4.0",
      labels: ["全场坐定", "局部启动"],
      beats: [
        {
          id: 0,
          action: "让整圈观众保持坐姿",
          title: "人群已经就位",
          body: "局部人群尝试启动之前，还不存在人浪。",
        },
        {
          id: 1,
          action: "让一个局部小组举手起立",
          title: "少数观众起立",
          body: "扰动从局部开始，而不是全场同时发生。",
        },
      ],
    },
    2: {
      eyebrow: "群体动力学 / 邻座规则",
      title: "规则发生在邻座之间",
      body: "观察附近分区。如果动作传过来，短暂延迟后起立；当前沿继续移动时，再坐回去。",
      note: "观察 → 起立 → 坐下 → 传递",
      source: "Farkas · Vicsek，Physica A 369（2006）",
      labels: ["观察", "起立", "坐下", "传递"],
      beats: [
        {
          id: 0,
          action: "启动者举起双手",
          title: "启动",
          body: "一个小组做出第一个清晰可见的动作。",
        },
        {
          id: 1,
          action: "最近的分区作出响应",
          title: "邻座响应",
          body: "附近观众稍作延迟后重复动作。",
        },
        {
          id: 2,
          action: "激活前沿向下一分区移动",
          title: "前沿前进",
          body: "较早起立的分区开始坐回去。",
        },
        {
          id: 3,
          action: "前面的人坐下，后面的人起立",
          title: "复位，再传递",
          body: "前沿经过后恢复坐姿，波形才保持清楚。",
        },
      ],
    },
    3: {
      eyebrow: "群体动力学 / 俯视",
      title: "人没有移动，状态在移动",
      body: "每位观众都留在自己的座位。沿看台传播的是一组状态：准备、起身、站立、恢复。",
      note: "位置固定 / 状态移动",
      source: "Farkas · Helbing · Vicsek，Physica A 330（2003）",
      labels: ["座位固定", "状态移动", "路径可见"],
      beats: [
        {
          id: 0,
          action: "把每位观众固定在座位节点上",
          title: "座位不移动",
          body: "看台几何结构保持不变。",
        },
        {
          id: 1,
          action: "让激活状态沿固定节点前进",
          title: "激活在移动",
          body: "新分区起立，上一分区恢复坐姿。",
        },
        {
          id: 2,
          action: "画出状态路径但不移动任何节点",
          title: "传播的是模式",
          body: "可见的人浪来自协同，而非人群位移。",
        },
      ],
    },
    4: {
      eyebrow: "群体动力学 / 接力峰值",
      title: "不是每次启动都能传下去",
      body: "可激发介质模型会区分持续传播的前沿，以及未能带动下一分区、逐渐消退的启动。",
      note: "一次微弱交接，可能让前沿停下。",
      source: "模型视角 · Nature 2002 + Physica A 2003",
      labels: ["启动", "前沿", "薄弱分区", "衰减", "恢复"],
      beats: [
        {
          id: 0,
          action: "第一分区启动接力",
          title: "启动",
          body: "一组观众近乎同时起立。",
        },
        {
          id: 1,
          action: "第二分区接住前沿",
          title: "带动",
          body: "相邻局部人群重复同一动作。",
        },
        {
          id: 2,
          action: "第三分区继续传递前沿",
          title: "传播",
          body: "接力形成可辨认的人浪。",
        },
        {
          id: 3,
          action: "薄弱分区只有少数人响应",
          title: "未过阈值",
          body: "这次交接开始失去一致性。",
        },
        {
          id: 4,
          action: "下游分区继续保持坐姿",
          title: "前沿消退",
          body: "这次启动没有绕场一周。",
        },
      ],
    },
    5: {
      eyebrow: "群体动力学 / 安静收束",
      title: "一位邻座接着一位邻座",
      body: "没有观众沿看台奔跑。共享模式来自带有延迟的局部响应；响应停止，模式也随之消失。",
      note: "人群恢复坐姿，只留下粉笔画出的路径。",
      source:
        "研究包：Nature 419 · Physica A 330 · Physica A 369 · SVG：OpenMoji / CC BY-SA 4.0",
      labels: ["局部动作", "共同模式"],
      beats: [
        {
          id: 0,
          action: "让全部角色坐下，只保留粉笔波形",
          title: "局部动作，共同模式",
          body: "最终状态安静、稳定，可以直接审阅。",
        },
      ],
    },
  },
};

const RING_POSITIONS: ActorPosition[] = [
  { x: "50%", y: "10%", rotation: "-1deg" },
  { x: "61%", y: "12%", rotation: "2deg" },
  { x: "72%", y: "17%", rotation: "-3deg" },
  { x: "81%", y: "25%", rotation: "3deg" },
  { x: "87%", y: "36%", rotation: "-2deg" },
  { x: "90%", y: "49%", rotation: "2deg" },
  { x: "87%", y: "62%", rotation: "-4deg" },
  { x: "80%", y: "73%", rotation: "3deg" },
  { x: "70%", y: "81%", rotation: "-2deg" },
  { x: "58%", y: "85%", rotation: "2deg" },
  { x: "46%", y: "86%", rotation: "-3deg" },
  { x: "34%", y: "83%", rotation: "3deg" },
  { x: "24%", y: "76%", rotation: "-2deg" },
  { x: "16%", y: "66%", rotation: "4deg" },
  { x: "11%", y: "54%", rotation: "-3deg" },
  { x: "11%", y: "41%", rotation: "2deg" },
  { x: "15%", y: "29%", rotation: "-4deg" },
  { x: "23%", y: "20%", rotation: "3deg" },
  { x: "33%", y: "14%", rotation: "-2deg" },
  { x: "42%", y: "11%", rotation: "2deg" },
];

function useFonts() {
  useEffect(() => {
    const id = "stadium-wave-fonts";
    if (document.getElementById(id)) return;

    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Noto+Sans+SC:wght@400;500;600;700&family=Patrick+Hand&display=swap";
    document.head.appendChild(link);
  }, []);
}

function toSceneId(scene: number): SceneId {
  return SCENE_IDS.includes(scene as SceneId) ? (scene as SceneId) : 1;
}

function clampBeat(scene: SceneId, beat: number, language: Language): number {
  const maximum = COPY[language][scene].beats.length - 1;
  return Math.max(0, Math.min(Math.trunc(beat), maximum));
}

function actorStyle(
  position: ActorPosition,
  index: number,
  colorIndex = index,
): CssVars {
  const palette = ["#f1b86a", "#82bfd0", "#de8b7d", "#9bbf79", "#d7a4bd"];
  return {
    "--actor-x": position.x,
    "--actor-y": position.y,
    "--actor-r": position.rotation,
    "--actor-delay": `${(index % 5) * 140}ms`,
    "--seat-color": palette[colorIndex % palette.length],
  };
}

function EmojiActor({
  state,
  position,
  index,
  compact = false,
}: {
  state: ActorState;
  position: ActorPosition;
  index: number;
  compact?: boolean;
}) {
  const actorUrl = state === "raised" ? raisedActorUrl : standingActorUrl;

  return (
    <span
      className={[
        styles.actor,
        styles[`actor${state[0].toUpperCase()}${state.slice(1)}`],
        compact ? styles.actorCompact : "",
      ].join(" ")}
      style={actorStyle(position, index)}
      data-actor-state={state}
      data-beat-layout-item="true"
      aria-hidden="true"
    >
      <span className={styles.seat} />
      <img
        className={styles.actorArt}
        src={actorUrl}
        alt=""
        draggable={false}
        data-emoji-asset="openmoji"
      />
    </span>
  );
}

function stateForRing(scene: SceneId, beat: number, index: number): ActorState {
  if (scene === 1) {
    if (beat >= 1 && index === 0) return "raised";
    if (beat >= 1 && (index === 1 || index === 19)) return "watching";
    return "seated";
  }

  if (scene === 3) {
    const activeStart = [0, 5, 10][beat] ?? 10;
    if (index === activeStart) return "raised";
    if (index > activeStart && index <= activeStart + 2) return "standing";
    if (index === (activeStart + 3) % RING_POSITIONS.length) return "watching";
    return "seated";
  }

  if (scene === 4) {
    const group = Math.floor(index / 4);
    if (beat <= 2) {
      if (group === beat && index % 4 === 0) return "raised";
      if (group === beat) return "standing";
      if (group === beat + 1) return "watching";
      return "seated";
    }
    if (beat === 3 && group === 3) {
      return index % 4 === 0 ? "raised" : "watching";
    }
    return "seated";
  }

  return "seated";
}

function StadiumRing({
  scene,
  beat,
  language,
}: {
  scene: 1 | 3 | 4;
  beat: number;
  language: Language;
}) {
  const activeArc =
    scene === 1
      ? beat === 0
        ? 0
        : 9
      : scene === 3
        ? 22 + beat * 27
        : beat < 4
          ? 18 + beat * 19
          : 0;
  const ariaLabel =
    language === "zh"
      ? "俯视看台：观众位置固定，起立状态沿分区传播"
      : "Top view of fixed stadium seats while the standing state travels by section";

  return (
    <div
      className={[styles.stadium, styles[`stadiumScene${scene}`]].join(" ")}
      role="img"
      aria-label={ariaLabel}
      data-beat-layout-item="true"
    >
      <svg className={styles.stadiumLines} viewBox="0 0 100 100" aria-hidden="true">
        <ellipse className={styles.outerBowl} cx="50" cy="50" rx="44" ry="42" />
        <ellipse className={styles.innerBowl} cx="50" cy="50" rx="28" ry="25" />
        <ellipse className={styles.pitch} cx="50" cy="50" rx="21" ry="17" />
        <path
          className={styles.waveTrace}
          pathLength="100"
          style={{ strokeDashoffset: 100 - activeArc }}
          d="M50 8 C78 8 94 25 94 50 C94 76 75 92 50 92 C25 92 6 76 6 50 C6 25 23 8 50 8"
        />
        {scene === 4 && beat >= 3 && (
          <path className={styles.breakMark} d="M76 68 l8 8 M84 68 l-8 8" />
        )}
      </svg>

      <div className={styles.pitchLabel}>
        {scene === 4
          ? language === "zh"
            ? beat < 3
              ? "接力中"
              : beat === 3
                ? "交接变弱"
                : "前沿停止"
            : beat < 3
              ? "relay live"
              : beat === 3
                ? "weak handoff"
                : "front stopped"
          : language === "zh"
            ? "座位固定"
            : "fixed seats"}
      </div>

      {RING_POSITIONS.map((position, index) => (
        <EmojiActor
          key={`${scene}-${index}`}
          state={stateForRing(scene, beat, index)}
          position={position}
          index={index}
          compact={scene !== 1}
        />
      ))}
    </div>
  );
}

function LocalRule({ beat, language, labels }: { beat: number; language: Language; labels: string[] }) {
  const positions: ActorPosition[] = Array.from({ length: 7 }, (_, index) => ({
    x: `${9 + index * 13.6}%`,
    y: "52%",
    rotation: `${index % 2 === 0 ? -2 : 2}deg`,
  }));

  return (
    <div
      className={styles.localRule}
      role="img"
      aria-label={
        language === "zh"
          ? "相邻观众依次观察、起立、坐下并传递动作"
          : "Neighboring spectators watch, rise, sit, and pass the action onward"
      }
      data-beat-layout-item="true"
    >
      <svg className={styles.ruleArrow} viewBox="0 0 100 30" aria-hidden="true">
        <path d="M5 17 C25 3 70 3 94 17" />
        <path d="m90 12 5 5-7 2" />
      </svg>
      <div className={styles.ruleLabels}>
        {labels.map((label, index) => (
          <span key={label} className={index <= beat ? styles.ruleLabelActive : ""}>
            {label}
          </span>
        ))}
      </div>
      {positions.map((position, index) => {
        const active = Math.min(beat, 3);
        let state: ActorState = "seated";
        if (index === active) state = index === 0 ? "raised" : "standing";
        else if (index === active + 1) state = "watching";
        return (
          <EmojiActor
            key={index}
            state={state}
            position={position}
            index={index}
          />
        );
      })}
      <div className={styles.ruleCaption}>
        {language === "zh" ? `第 ${beat + 1} 步 / 前沿只移动一段` : `step ${beat + 1} / one local handoff`}
      </div>
    </div>
  );
}

function QuietCrowd({ language }: { language: Language }) {
  const positions: ActorPosition[] = Array.from({ length: 11 }, (_, index) => ({
    x: `${7 + index * 8.6}%`,
    y: `${61 + (index % 2) * 3}%`,
    rotation: `${index % 2 === 0 ? -2 : 2}deg`,
  }));

  return (
    <div
      className={styles.quietCrowd}
      role="img"
      aria-label={language === "zh" ? "全部观众坐下，粉笔线保留人浪路径" : "Every spectator sits while a chalk line preserves the wave path"}
      data-beat-layout-item="true"
    >
      <svg className={styles.finalWave} viewBox="0 0 100 40" aria-hidden="true">
        <path d="M2 29 C12 29 12 7 22 7 C32 7 32 29 42 29 C52 29 52 7 62 7 C72 7 72 29 82 29 C90 29 92 18 98 18" />
      </svg>
      {positions.map((position, index) => (
        <EmojiActor key={index} state="seated" position={position} index={index} compact />
      ))}
    </div>
  );
}

function ScenePanel({
  scene,
  beat,
  language,
}: {
  scene: SceneId;
  beat: number;
  language: Language;
}) {
  const copy = COPY[language][scene];
  const safeBeat = clampBeat(scene, beat, language);

  return (
    <article
      className={[styles.scene, styles[`scene${scene}`]].join(" ")}
      data-scene-content={scene}
      data-beat={safeBeat}
      data-beat-layout-container="true"
      data-beat-layout-mode="reserved"
    >
      <header className={styles.header} data-beat-layout-item="true">
        <p className={styles.eyebrow}>{copy.eyebrow}</p>
        <h1>{copy.title}</h1>
        <p className={styles.body}>{copy.body}</p>
      </header>

      <div className={styles.board} data-beat-layout-item="true">
        <span className={styles.blueTape} aria-hidden="true" />
        <span className={styles.redTape} aria-hidden="true" />
        {scene === 1 && <StadiumRing scene={1} beat={safeBeat} language={language} />}
        {scene === 2 && (
          <LocalRule beat={safeBeat} language={language} labels={copy.labels} />
        )}
        {scene === 3 && <StadiumRing scene={3} beat={safeBeat} language={language} />}
        {scene === 4 && <StadiumRing scene={4} beat={safeBeat} language={language} />}
        {scene === 5 && <QuietCrowd language={language} />}

        <div className={styles.boardNote} data-beat-layout-item="true">
          {copy.note}
        </div>
        <div className={styles.beatTag} data-beat-layout-item="true">
          <span>{String(scene).padStart(2, "0")}</span>
          <strong>{copy.beats[safeBeat].title}</strong>
        </div>
      </div>

      <footer className={styles.source} data-source-note="true" data-beat-layout-item="true">
        {copy.source}
      </footer>
    </article>
  );
}

function StadiumNav({
  scene,
  language,
  onNavigate,
}: {
  scene: SceneId;
  language: Language;
  onNavigate?: (scene: number, beat: number) => void;
}) {
  const labels =
    language === "zh"
      ? ["启动", "邻座", "状态", "衰减", "余波"]
      : ["start", "neighbor", "state", "fade", "after"];

  const navigateFromKey = (event: KeyboardEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    let target: SceneId | null = null;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      target = (scene === 5 ? 1 : scene + 1) as SceneId;
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      target = (scene === 1 ? 5 : scene - 1) as SceneId;
    } else if (event.key === "Home") {
      target = 1;
    } else if (event.key === "End") {
      target = 5;
    }

    if (target !== null) {
      event.preventDefault();
      onNavigate?.(target, 0);
    }
  };

  const navigateFromClick = (event: MouseEvent<HTMLButtonElement>, target: SceneId) => {
    event.preventDefault();
    event.stopPropagation();
    onNavigate?.(target, 0);
  };

  const stopPointer = (event: PointerEvent<HTMLElement>) => event.stopPropagation();

  return (
    <nav
      className={styles.stadiumNav}
      aria-label={language === "zh" ? "看台分区场景导航" : "Stadium section scene navigation"}
      data-topic-navigation="true"
      data-navigation-geometry={NAVIGATION.geometry}
      data-navigation-carrier={NAVIGATION.carrier}
      data-navigation-invocation={NAVIGATION.invocation}
      data-navigation-feedback={NAVIGATION.feedback}
      onPointerDown={stopPointer}
    >
      <span className={styles.navArc} aria-hidden="true" />
      {SCENE_IDS.map((target, index) => (
        <button
          key={target}
          type="button"
          className={scene === target ? styles.navActive : ""}
          aria-label={
            language === "zh"
              ? `跳到场景 ${target}：${labels[index]}`
              : `Jump to scene ${target}: ${labels[index]}`
          }
          aria-current={scene === target ? "step" : undefined}
          onClick={(event) => navigateFromClick(event, target)}
          onKeyDown={navigateFromKey}
        >
          <span>{labels[index]}</span>
        </button>
      ))}
    </nav>
  );
}

function buildMetadata(language: Language): TopicMetadata {
  return {
    theme: language === "zh" ? "看台人浪" : "Stadium Wave",
    densityLabel: language === "zh" ? "视觉叙事" : "Visual Narrative",
    heroScene: 4,
    colors: {
      bg: "#f5ead2",
      ink: "#302a25",
      panel: "#fff5d9",
    },
    typography: {
      header: "Patrick Hand 400",
      body: "Inter 600",
    },
    tags: [
      "minimal-keynote",
      "warm-approachable",
      "hand-drawn",
      "fixed-svg-emoji",
      "crowd-dynamics",
      "visual-narrative",
      "expressive-motion",
    ],
    fonts: ["Patrick Hand", "Inter", "cjk:Noto Sans SC"],
    scenes: SCENE_IDS.map((scene) => ({
      id: scene,
      title: COPY[language][scene].title,
      beats: COPY[language][scene].beats,
    })),
  };
}

const METADATA = {
  en: buildMetadata("en"),
  zh: buildMetadata("zh"),
} satisfies TopicDefinition["metadata"];

const EVIDENCE = {
  kind: "facts",
  sources: STADIUM_WAVE_SOURCES,
} as const satisfies TopicDefinition["evidence"];

function TopicStage({
  scene,
  beat,
  language,
  isThumbnail,
  reducedMotion,
  onNavigate,
}: TopicStageProps) {
  useFonts();
  const activeScene = toSceneId(scene);
  const activeBeat = clampBeat(activeScene, beat, language);
  const motionOff = reducedMotion || isThumbnail;

  return (
    <section
      className={[styles.root, motionOff ? styles.motionOff : ""].join(" ")}
      lang={language}
      data-style-id="sketch-board-emoji"
      data-topic-id="stadium-wave"
      data-emoji-rendering="local-svg"
      data-motion={motionOff ? "off" : "on"}
    >
      <div className={styles.paperTexture} aria-hidden="true" />
      <SpatialSceneTrack
        scene={activeScene}
        beat={activeBeat}
        transitionKind="push-x"
        transitionMap={TRANSITION_MAP}
        transitionModifierMap={TRANSITION_MODIFIER_MAP}
        transitionDurationMs={820}
        reducedMotion={motionOff}
        beatLayoutModes={BEAT_LAYOUT_MODES}
        className={styles.track}
        renderScene={(sceneId, sceneBeat) => (
          <ScenePanel
            scene={toSceneId(sceneId)}
            beat={sceneBeat}
            language={language}
          />
        )}
      />
      {!isThumbnail && (
        <StadiumNav
          scene={activeScene}
          language={language}
          onNavigate={onNavigate}
        />
      )}
    </section>
  );
}

export default defineTopic({
  id: "stadium-wave",
  styleId: "sketch-board-emoji",
  title: {
    en: "Stadium Wave",
    zh: "看台人浪",
  },
  modelId: "GPT 5.6 Sol",
  Stage: TopicStage,
  metadata: METADATA,
  evidence: EVIDENCE,
  transitionScore: STADIUM_WAVE_TRANSITION_SCORE,
  navigation: NAVIGATION,
});

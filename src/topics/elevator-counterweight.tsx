import {
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type MouseEvent,
  type TouchEvent,
} from "react";
import type {
  TopicDefinition,
  TopicMetadata,
  TopicStageProps,
  TopicTransitionScore,
} from "../domain/topic";
import { defineTopic } from "../domain/topic";
import type { Source } from "../domain/evidence";
import SpatialSceneTrack, {
  type BeatLayoutMode,
  type SceneTransitionMap,
} from "../components/stage/SpatialSceneTrack";
import styles from "./elevator-counterweight.module.css";

type Language = "en" | "zh";
type SceneId = 1 | 2 | 3 | 4 | 5;
type CSSVariables = CSSProperties & Record<`--${string}`, string>;

interface BeatCopy {
  action: string;
  title: string;
  body: string;
}

interface SceneCopy {
  kicker: string;
  title: string;
  subtitle: string;
  source: string;
  nav: string;
  beats: BeatCopy[];
}

const SCENE_IDS: SceneId[] = [1, 2, 3, 4, 5];

const BEAT_COUNTS: Record<SceneId, number> = {
  1: 4,
  2: 1,
  3: 2,
  4: 2,
  5: 1,
};

const BEAT_LAYOUT_MODES: Partial<Record<number, BeatLayoutMode>> = {
  1: "reserved",
  2: "reserved",
  3: "reserved",
  4: "reserved",
  5: "reserved",
};

export const ELEVATOR_COUNTERWEIGHT_TRANSITION_SCORE = {
  "1->2": "split-merge",
  "2->3": "focus-swap",
  "3->4": "push-y",
  "4->5": "split-merge",
} as const satisfies Readonly<TopicTransitionScore>;

const TRANSITION_MAP: SceneTransitionMap = {
  ...ELEVATOR_COUNTERWEIGHT_TRANSITION_SCORE,
  "2->1": "split-merge",
  "3->2": "focus-swap",
  "4->3": "push-y",
  "5->4": "split-merge",
};

type ElevatorCounterweightClaimId =
  | "scene-1:traction-pair"
  | "scene-2:design-reference"
  | "scene-3:drive-regulation"
  | "scene-3:reduced-machine-effort"
  | "scene-4:safety-chain"
  | "scene-5:distinct-responsibilities";

type ElevatorCounterweightSourceId =
  | "asme-a17"
  | "kone-elevator-glossary"
  | "tke-traction-elevators"
  | "otis-basic-lift-workings"
  | "otis-high-rise-safety-systems";

interface ElevatorCounterweightSource extends Source {
  id: ElevatorCounterweightSourceId;
  authority: string;
  title: string;
  citation: string;
  claimIds: readonly ElevatorCounterweightClaimId[];
}

export const ELEVATOR_COUNTERWEIGHT_SOURCES = [
  {
    id: "asme-a17",
    authority: "ASME",
    title: "A17 — Elevators and Escalators Offerings",
    citation: "ASME Codes and Standards, A17 portfolio",
    url: "https://www.asme.org/resources/a17-elevators-and-escalators",
    supports:
      "ASME identifies A17.1/CSA B44 as the safety-code family for elevator design and identifies A17.6 as the dedicated standard for suspension, compensation, and governor systems.",
    claimIds: ["scene-4:safety-chain", "scene-5:distinct-responsibilities"],
  },
  {
    id: "tke-traction-elevators",
    authority: "TK Elevator",
    title: "Traction Versus Hydraulic Elevators",
    citation: "TK Elevator, traction-elevator system and advantages sections",
    url: "https://www.tkelevator.com/us-en/company/insights/traction-versus-hydraulic-elevators.html",
    supports:
      "TK Elevator explains that traction elevators use belts or steel ropes with a counterweight and that offsetting cab and occupant weight means the motor moves less weight, improving energy efficiency in the stated applications.",
    claimIds: ["scene-3:reduced-machine-effort", "scene-5:distinct-responsibilities"],
  },
  {
    id: "kone-elevator-glossary",
    authority: "KONE",
    title: "Elevator Glossary",
    citation: "KONE Distributors technical glossary, entries for balancing ratio, balancing weight, counterweight, governor, and safety gear",
    url: "https://distributors.kone.com/en/tools-downloads/glossary/",
    supports:
      "KONE defines balancing ratio as a selected share of rated load, describes balancing weight as balancing all or part of the car, sling, and rated load, and defines the rope-elevator drive system as supplying motor energy and regulating speed.",
    claimIds: [
      "scene-2:design-reference",
      "scene-3:drive-regulation",
      "scene-5:distinct-responsibilities",
    ],
  },
  {
    id: "otis-basic-lift-workings",
    authority: "Otis",
    title: "Understanding Basic Workings of a Lift",
    citation: "Otis UK technical explainer, traction-lift section",
    url: "https://www.otis.com/en-GB/w/the-basic-workings-of-a-lift",
    supports:
      "Otis describes ropes or belts over a machine sheave, the car and counterweight moving in opposite directions to reduce required energy, and the controller and drive regulating elevator speed.",
    claimIds: [
      "scene-1:traction-pair",
      "scene-3:drive-regulation",
      "scene-5:distinct-responsibilities",
    ],
  },
  {
    id: "otis-high-rise-safety-systems",
    authority: "Otis",
    title: "High-Rise Safety Systems",
    citation: "Otis technical safety-system explainer",
    url: "https://www.otis.com/en/us/tools-resources/high-rise-safety-systems",
    supports:
      "Otis distinguishes the motor, traction sheave, machine brake, overspeed governor, and car safeties, and explains that a governor can engage car safeties that clamp the hoistway rails during an overspeed condition.",
    claimIds: ["scene-4:safety-chain", "scene-5:distinct-responsibilities"],
  },
] as const satisfies readonly ElevatorCounterweightSource[];

export const ELEVATOR_COUNTERWEIGHT_SCENE_SOURCES = {
  1: ["otis-basic-lift-workings"],
  2: ["kone-elevator-glossary"],
  3: ["tke-traction-elevators", "kone-elevator-glossary"],
  4: ["otis-high-rise-safety-systems", "asme-a17"],
  5: [
    "kone-elevator-glossary",
    "tke-traction-elevators",
    "otis-basic-lift-workings",
    "otis-high-rise-safety-systems",
    "asme-a17",
  ],
} as const satisfies Readonly<Record<SceneId, readonly ElevatorCounterweightSourceId[]>>;

const COPY: Record<SceneId, Record<Language, SceneCopy>> = {
  1: {
    en: {
      kicker: "TRACTION PAIR / 01",
      title: "The car has an invisible partner.",
      subtitle:
        "Car and counterweight share one cable path over a traction sheave. They lower imbalance; they do not make gravity disappear.",
      source: "OTIS · BASIC WORKINGS",
      nav: "paired path",
      beats: [
        {
          action: "PAIR",
          title: "Cab and counterweight share a path",
          body: "The two sides are coupled through one traction system.",
        },
        {
          action: "ROUTE",
          title: "The sheave turns the cable path",
          body: "The machine connects the two sides; it does not remove their weight.",
        },
        {
          action: "OPPOSE",
          title: "One rises while the other descends",
          body: "Their opposite travel reduces the load difference seen by the drive.",
        },
        {
          action: "FRAME",
          title: "Reduce imbalance—not gravity",
          body: "Counterweight reduces the imbalance. It does not cancel gravity.",
        },
      ],
    },
    zh: {
      kicker: "曳引配对 / 01",
      title: "轿厢有一位看不见的搭档。",
      subtitle:
        "轿厢与配重跨过同一条缆绳路径和曳引轮。它们降低不平衡负载，不会让重力消失。",
      source: "OTIS · 电梯工作原理",
      nav: "成对路径",
      beats: [
        {
          action: "配对",
          title: "轿厢与配重共用一条路径",
          body: "两侧通过同一套曳引系统耦合在一起。",
        },
        {
          action: "路径",
          title: "曳引轮带动缆绳路径",
          body: "机器连接两侧，但不会移走它们的重量。",
        },
        {
          action: "反向",
          title: "一侧上行，另一侧下行",
          body: "反向运动降低驱动所面对的负载差。",
        },
        {
          action: "定框",
          title: "降低不平衡，不是消除重力",
          body: "配重降低不平衡负载，不会抵消重力。",
        },
      ],
    },
  },
  2: {
    en: {
      kicker: "DESIGN BASIS / 02",
      title: "Balance starts from a design reference.",
      subtitle:
        "Car load changes. Counterweight selection balances the car, sling, and a chosen portion of rated load—not a universal percentage.",
      source: "KONE · ELEVATOR GLOSSARY",
      nav: "design basis",
      beats: [
        {
          action: "SELECT",
          title: "A selected reference, not a fixed rule",
          body: "The balance point is designed around the installation and expected duty; real payload still varies trip to trip.",
        },
      ],
    },
    zh: {
      kicker: "设计基准 / 02",
      title: "平衡从设计基准开始。",
      subtitle:
        "轿厢载荷会变化。配重针对轿厢、轿架和额定载荷的选定部分设计；没有通用百分比。",
      source: "KONE · 电梯术语表",
      nav: "设计基准",
      beats: [
        {
          action: "选定",
          title: "选定的参考，而非固定规则",
          body: "平衡点由安装条件和预期工况决定；每一趟的真实载荷仍会变化。",
        },
      ],
    },
  },
  3: {
    en: {
      kicker: "DRIVE DIFFERENCE / 03",
      title: "The drive works on what balance leaves behind.",
      subtitle:
        "Counterweighting reduces the weight the motor must move; the machine still manages the remaining difference, motion, and losses. This is a concept sketch, not a power calculation.",
      source: "TK ELEVATOR · KONE",
      nav: "difference + losses",
      beats: [
        {
          action: "COMPARE",
          title: "Balance is not zero work",
          body: "The two sides can be nearer a design reference, while the drive still regulates their motion.",
        },
        {
          action: "DRIVE",
          title: "Difference + losses reach the machine",
          body: "The arrow names remaining imbalance and losses without inventing an exact power value.",
        },
      ],
    },
    zh: {
      kicker: "驱动差值 / 03",
      title: "驱动处理平衡之后留下的部分。",
      subtitle:
        "配重减少电机需要搬动的重量；机器仍处理剩余差值、运动与损耗。这是概念图，不是功率计算。",
      source: "TK ELEVATOR · KONE",
      nav: "差值与损耗",
      beats: [
        {
          action: "比较",
          title: "平衡不等于零工作",
          body: "两侧可以更接近设计基准，驱动仍要调节它们的运动。",
        },
        {
          action: "驱动",
          title: "差值与损耗进入机器",
          body: "箭头只标出剩余不平衡与损耗，不虚构精确功率值。",
        },
      ],
    },
  },
  4: {
    en: {
      kicker: "SAFETY CHAIN / 04",
      title: "Safety is a separate chain.",
      subtitle:
        "Machine brake, overspeed governor, and car safety gear serve a safety path. The counterweight is not a safety device.",
      source: "OTIS · SAFETY SYSTEMS / ASME A17",
      nav: "safety chain",
      beats: [
        {
          action: "SEPARATE",
          title: "Work reduction is not fall protection",
          body: "The counterweight reduces imbalance in normal traction operation; it does not replace safety functions.",
        },
        {
          action: "INTERVENE",
          title: "Brake, governor, safety gear",
          body: "A distinct safety chain monitors and stops abnormal speed; this diagram is explanatory, not service guidance.",
        },
      ],
    },
    zh: {
      kicker: "安全链 / 04",
      title: "安全是另一条独立链。",
      subtitle:
        "机制动器、限速器和轿厢安全钳服务于安全路径；配重不是安全装置。",
      source: "OTIS · 安全系统 / ASME A17",
      nav: "安全链",
      beats: [
        {
          action: "分开",
          title: "降低工作量，不等于防坠",
          body: "配重在正常曳引运行中降低不平衡，不能替代安全功能。",
        },
        {
          action: "介入",
          title: "制动器、限速器、安全钳",
          body: "独立的安全链监测并制止异常速度；此图用于解释，不提供检修指引。",
        },
      ],
    },
  },
  5: {
    en: {
      kicker: "ONE SYSTEM / 05",
      title: "A partner reduces work. It does not erase it.",
      subtitle:
        "Design balance, drive control, and safety functions remain distinct jobs inside one traction system.",
      source: "KONE · TK ELEVATOR · OTIS · ASME",
      nav: "quiet system",
      beats: [
        {
          action: "SETTLE",
          title: "Two sides, one quieter job",
          body: "Counterweight lowers imbalance; the drive and safety chain keep their own responsibilities.",
        },
      ],
    },
    zh: {
      kicker: "同一系统 / 05",
      title: "搭档减少工作，不取消工作。",
      subtitle:
        "设计平衡、驱动控制与安全功能在同一套曳引系统里仍是不同的职责。",
      source: "KONE · TK ELEVATOR · OTIS · ASME",
      nav: "安静系统",
      beats: [
        {
          action: "落定",
          title: "两侧配对，一项更轻的工作",
          body: "配重降低不平衡；驱动与安全链继续承担各自的职责。",
        },
      ],
    },
  },
};

const NAV_PATHS: Record<SceneId, string> = {
  1: "M 40 64 C 210 18 360 104 548 54 S 880 18 1060 58",
  2: "M 40 48 C 220 92 360 18 548 54 S 860 94 1060 42",
  3: "M 40 70 C 190 34 368 32 548 56 S 860 28 1060 68",
  4: "M 40 42 C 198 18 376 94 548 48 S 850 18 1060 46",
  5: "M 40 56 C 224 56 362 56 548 56 S 858 56 1060 56",
};

const NAV_POINTS: Record<SceneId, Array<{ x: number; y: number }>> = {
  1: [
    { x: 5, y: 58 },
    { x: 26, y: 40 },
    { x: 48, y: 54 },
    { x: 70, y: 38 },
    { x: 91, y: 55 },
  ],
  2: [
    { x: 5, y: 43 },
    { x: 26, y: 64 },
    { x: 48, y: 44 },
    { x: 70, y: 63 },
    { x: 91, y: 40 },
  ],
  3: [
    { x: 5, y: 62 },
    { x: 26, y: 48 },
    { x: 48, y: 48 },
    { x: 70, y: 45 },
    { x: 91, y: 60 },
  ],
  4: [
    { x: 5, y: 40 },
    { x: 26, y: 51 },
    { x: 48, y: 57 },
    { x: 70, y: 42 },
    { x: 91, y: 43 },
  ],
  5: [
    { x: 5, y: 52 },
    { x: 26, y: 52 },
    { x: 48, y: 52 },
    { x: 70, y: 52 },
    { x: 91, y: 52 },
  ],
};

function toVars(values: Record<`--${string}`, string>): CSSVariables {
  return values as CSSVariables;
}

function toSceneId(scene: number): SceneId {
  return SCENE_IDS.includes(scene as SceneId) ? (scene as SceneId) : 1;
}

function clampBeat(scene: SceneId, beat: number): number {
  if (!Number.isFinite(beat)) return 0;
  return Math.max(0, Math.min(Math.trunc(beat), BEAT_COUNTS[scene] - 1));
}

function getCopy(scene: SceneId, language: Language): SceneCopy {
  return COPY[scene][language];
}

function buildMetadata(lang: Language): TopicMetadata {
  return {
    theme: lang === "zh" ? "电梯配重" : "Elevator Counterweight",
    densityLabel:
      lang === "zh" ? "图解说明 · 成对机械" : "Diagram Explainer · Paired Mechanics",
    heroScene: 3,
    colors: {
      bg: "#edf1ee",
      ink: "#173a45",
      panel: "#fbfcf8",
    },
    typography: {
      header: "Avenir Next 700",
      body: "Avenir Next 500",
    },
    tags: [
      "collaborative-pairing-board",
      "traction-elevator",
      "counterweight",
      "mechanical-diagram",
      "safety-chain",
      "paired-system",
      "light",
      "technical",
    ],
    fonts: ["Avenir Next", "Helvetica Neue", "cjk:PingFang SC", "cjk:Microsoft YaHei"],
    scenes: SCENE_IDS.map((scene) => {
      const copy = getCopy(scene, lang);
      return {
        id: scene,
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

const METADATA = {
  en: buildMetadata("en"),
  zh: buildMetadata("zh"),
} satisfies TopicDefinition["metadata"];

const NAVIGATION = {
  geometry: "path",
  carrier: "counterweight-cable",
  invocation: "proximity-reveal",
  feedback: "geometry-reflow",
} as const satisfies TopicDefinition["navigation"];

function SceneHeader({
  scene,
  language,
}: {
  scene: SceneId;
  language: Language;
}) {
  const copy = getCopy(scene, language);

  return (
    <header className={styles.sceneHeader} data-beat-layout-item="true">
      <div className={styles.sceneCopy}>
        <span className={styles.kicker}>0{scene} · {copy.kicker}</span>
        <h1>{copy.title}</h1>
        <p>{copy.subtitle}</p>
      </div>
      <aside
        className={styles.sourceStamp}
        aria-label={copy.source}
        data-source-ids={ELEVATOR_COUNTERWEIGHT_SCENE_SOURCES[scene].join(" ")}
      >
        <span>{language === "zh" ? "事实透镜" : "FACT LENS"}</span>
        <strong>{copy.source}</strong>
      </aside>
    </header>
  );
}

function BeatReadout({
  scene,
  beat,
  language,
}: {
  scene: SceneId;
  beat: number;
  language: Language;
}) {
  const copy = getCopy(scene, language);
  const activeBeat = copy.beats[beat] ?? copy.beats[0];

  return (
    <aside className={styles.beatReadout} data-beat-layout-item="true">
      <div className={styles.beatMarkers} aria-hidden="true">
        {copy.beats.map((item, index) => (
          <span data-active={index <= beat ? "true" : "false"} key={item.title} />
        ))}
      </div>
      <span className={styles.beatAction}>{activeBeat.action}</span>
      <strong>{activeBeat.title}</strong>
      <p>{activeBeat.body}</p>
    </aside>
  );
}

function TractionPair({
  beat,
  language,
  settled = false,
  showClaim = true,
}: {
  beat: number;
  language: Language;
  settled?: boolean;
  showClaim?: boolean;
}) {
  const copy = language === "zh"
    ? {
        car: "轿厢",
        payload: "可变载荷",
        counterweight: "配重",
        sheave: "曳引轮",
        cable: "承载缆绳",
        rise: "上行",
        descend: "下行",
        designMass: "设计质量",
      }
    : {
        car: "CAR",
        payload: "VARIABLE PAYLOAD",
        counterweight: "COUNTERWEIGHT",
        sheave: "TRACTION SHEAVE",
        cable: "SUSPENSION CABLE",
        rise: "RISE",
        descend: "DESCEND",
        designMass: "DESIGN MASS",
      };

  return (
    <div
      className={styles.tractionSystem}
      data-traction-system="true"
      data-beat={beat}
      data-settled={settled ? "true" : "false"}
    >
      <svg
        className={styles.tractionDiagram}
        viewBox="0 0 1440 610"
        role="img"
        aria-label={language === "zh" ? "轿厢、配重、缆绳和曳引轮示意图" : "Schematic car, counterweight, cable and traction sheave"}
      >
        <path className={styles.guideRail} d="M 278 104 V 556 M 1162 104 V 556" />
        <path
          className={styles.cableShadow}
          d="M 336 496 L 638 152 A 116 116 0 0 1 802 152 L 1104 496"
        />
        <path
          className={styles.cableLine}
          data-elevator-cable="true"
          d="M 336 496 L 638 152 A 116 116 0 0 1 802 152 L 1104 496"
        />
        <circle className={styles.sheaveOuter} cx="720" cy="152" r="104" />
        <circle className={styles.sheaveInner} cx="720" cy="152" r="62" />
        <path className={styles.sheaveGrooves} d="M 653 116 L 787 188 M 653 188 L 787 116" />
        <path className={styles.directionArrow} data-visible={beat >= 2 ? "true" : "false"} d="M 255 448 V 334 M 255 334 L 232 362 M 255 334 L 278 362" />
        <path className={styles.directionArrow} data-visible={beat >= 2 ? "true" : "false"} d="M 1185 334 V 448 M 1185 448 L 1162 420 M 1185 448 L 1208 420" />
      </svg>

      <article className={styles.carAssembly} data-elevator-car="true">
        <span>{copy.car}</span>
        <div className={styles.carShell} aria-hidden="true">
          <i />
          <i />
          <i />
        </div>
        <strong>{copy.payload}</strong>
      </article>

      <div className={styles.machineCore} data-visible={beat >= 1 ? "true" : "false"}>
        <span>{copy.sheave}</span>
        <strong>{copy.cable}</strong>
      </div>

      <article
        className={styles.counterweightAssembly}
        data-counterweight="true"
        data-visible={beat >= 2 ? "true" : "false"}
      >
        <span>{copy.counterweight}</span>
        <div className={styles.weightStack} aria-hidden="true">
          <i />
          <i />
          <i />
          <i />
        </div>
        <strong>{settled ? "" : copy.designMass}</strong>
      </article>

      <span className={styles.travelLabel} data-side="car" data-visible={beat >= 2 ? "true" : "false"}>
        {copy.rise}
      </span>
      <span className={styles.travelLabel} data-side="weight" data-visible={beat >= 2 ? "true" : "false"}>
        {copy.descend}
      </span>

      {showClaim && (
        <div className={styles.tractionClaim} data-visible={beat >= 3 ? "true" : "false"}>
          <span>{language === "zh" ? "关键边界" : "KEY BOUNDARY"}</span>
          <strong>
            {language === "zh"
              ? "降低不平衡负载，不会抵消重力。"
              : "Reduces imbalance. Does not cancel gravity."}
          </strong>
        </div>
      )}
    </div>
  );
}

function DesignBasisDesk({ language }: { language: Language }) {
  const copy = language === "zh"
    ? {
        car: "轿厢侧",
        body: "轿厢",
        sling: "轿架",
        payload: "可变载荷",
        balance: "配重侧",
        reference: "设计平衡参考",
        selected: "选定的额定载荷部分",
        note: "没有通用百分比",
      }
    : {
        car: "CAR SIDE",
        body: "CAR",
        sling: "SLING",
        payload: "VARIABLE PAYLOAD",
        balance: "COUNTERWEIGHT SIDE",
        reference: "DESIGN BALANCE REFERENCE",
        selected: "SELECTED PART OF RATED LOAD",
        note: "NO UNIVERSAL PERCENTAGE",
      };

  return (
    <div className={styles.designDesk} data-design-basis="true" data-beat-layout-item="true">
      <article className={styles.loadLane} data-side="car">
        <span>{copy.car}</span>
        <div className={styles.massStack} aria-hidden="true">
          <i data-kind="body" />
          <i data-kind="sling" />
          <i data-kind="payload" />
        </div>
        <strong>{copy.body}</strong>
        <strong>{copy.sling}</strong>
        <strong>{copy.payload}</strong>
      </article>
      <div className={styles.designReference}>
        <span>{copy.reference}</span>
        <div className={styles.referenceArc} aria-hidden="true">
          <i />
        </div>
        <strong>{copy.selected}</strong>
        <p>{copy.note}</p>
      </div>
      <article className={styles.loadLane} data-side="weight">
        <span>{copy.balance}</span>
        <div className={styles.designWeightStack} aria-hidden="true">
          <i />
          <i />
          <i />
          <i />
          <i />
        </div>
        <strong>{language === "zh" ? "由设计选定" : "SELECTED BY DESIGN"}</strong>
      </article>
    </div>
  );
}

function DifferenceDesk({
  beat,
  language,
}: {
  beat: number;
  language: Language;
}) {
  const copy = language === "zh"
    ? {
        car: "轿厢侧",
        weight: "配重侧",
        delta: "剩余差值",
        losses: "系统损耗",
        drive: "驱动机器",
        regulate: "调节速度",
        notCalc: "不是功率计算",
      }
    : {
        car: "CAR SIDE",
        weight: "COUNTERWEIGHT SIDE",
        delta: "REMAINING DIFFERENCE",
        losses: "SYSTEM LOSSES",
        drive: "DRIVE MACHINE",
        regulate: "REGULATES SPEED",
        notCalc: "NOT A POWER CALCULATION",
      };

  return (
    <div className={styles.differenceDesk} data-beat-layout-item="true">
      <div className={styles.differenceSide} data-side="car">
        <span>{copy.car}</span>
        <i aria-hidden="true" />
      </div>
      <div
        className={styles.differenceMeter}
        data-difference-meter="true"
        data-active={beat >= 1 ? "true" : "false"}
        style={toVars({ "--difference-level": beat >= 1 ? "78%" : "42%" })}
      >
        <span>{copy.delta}</span>
        <strong>Δ</strong>
        <div className={styles.differenceScale} aria-hidden="true"><i /></div>
        <p>{copy.notCalc}</p>
      </div>
      <div className={styles.differenceSide} data-side="weight">
        <span>{copy.weight}</span>
        <i aria-hidden="true" />
      </div>
      <div className={styles.driveRoute} data-visible={beat >= 1 ? "true" : "false"}>
        <span>{copy.losses}</span>
        <i aria-hidden="true" />
        <strong>{copy.drive}</strong>
        <em>{copy.regulate}</em>
      </div>
    </div>
  );
}

function SafetyDesk({
  beat,
  language,
}: {
  beat: number;
  language: Language;
}) {
  const copy = language === "zh"
    ? {
        work: "降低不平衡负载",
        notSafety: "配重不是安全装置",
        safety: "独立安全链",
        brake: "机制动器",
        governor: "限速器",
        gear: "轿厢安全钳",
        rail: "导轨夹紧",
      }
    : {
        work: "REDUCES IMBALANCE",
        notSafety: "COUNTERWEIGHT IS NOT A SAFETY DEVICE",
        safety: "SEPARATE SAFETY CHAIN",
        brake: "MACHINE BRAKE",
        governor: "OVERSPEED GOVERNOR",
        gear: "CAR SAFETY GEAR",
        rail: "CLAMPS GUIDE RAIL",
      };

  return (
    <div className={styles.safetyDesk} data-safety-chain="true" data-step={beat} data-beat-layout-item="true">
      <aside className={styles.workReductionPath}>
        <div className={styles.smallWeight} aria-hidden="true"><i /><i /><i /></div>
        <span>{copy.work}</span>
        <strong>{copy.notSafety}</strong>
      </aside>
      <section className={styles.safetyChain} aria-label={copy.safety}>
        <span className={styles.chainTitle}>{copy.safety}</span>
        <div className={styles.safetyLinks}>
          <article className={styles.safetyLink} data-visible="true">
            <i aria-hidden="true" />
            <strong>{copy.brake}</strong>
          </article>
          <article className={styles.safetyLink} data-visible={beat >= 1 ? "true" : "false"}>
            <i aria-hidden="true" />
            <strong>{copy.governor}</strong>
          </article>
          <article className={styles.safetyLink} data-visible={beat >= 1 ? "true" : "false"}>
            <i aria-hidden="true" />
            <strong>{copy.gear}</strong>
          </article>
        </div>
        <div className={styles.railClamp} data-visible={beat >= 1 ? "true" : "false"}>
          <i aria-hidden="true" />
          <span>{copy.rail}</span>
          <i aria-hidden="true" />
        </div>
      </section>
    </div>
  );
}

function QuietSystem({ language }: { language: Language }) {
  return (
    <div className={styles.quietDesk} data-quiet-system="true" data-beat-layout-item="true">
      <TractionPair beat={3} language={language} settled showClaim={false} />
      <aside className={styles.quietStatement}>
        <span>{language === "zh" ? "最后的区分" : "FINAL DISTINCTION"}</span>
        <strong>
          {language === "zh"
            ? "配重降低不平衡；驱动控制运动；安全链保护异常。"
            : "Counterweight reduces imbalance. Drive controls motion. Safety chain handles abnormal speed."}
        </strong>
      </aside>
    </div>
  );
}

function SceneVisual({
  scene,
  beat,
  language,
}: {
  scene: SceneId;
  beat: number;
  language: Language;
}) {
  switch (scene) {
    case 1:
      return <TractionPair beat={beat} language={language} />;
    case 2:
      return <DesignBasisDesk language={language} />;
    case 3:
      return <DifferenceDesk beat={beat} language={language} />;
    case 4:
      return <SafetyDesk beat={beat} language={language} />;
    case 5:
      return <QuietSystem language={language} />;
  }
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
  return (
    <section className={[styles.scene, styles[`scene${scene}`]].join(" ")} data-scene={scene}>
      <SceneHeader scene={scene} language={language} />
      <div className={styles.sceneVisual} data-beat-layout-item="true">
        <SceneVisual scene={scene} beat={beat} language={language} />
      </div>
      <BeatReadout scene={scene} beat={beat} language={language} />
    </section>
  );
}

function CableNavigation({
  scene,
  language,
  onNavigate,
}: {
  scene: SceneId;
  language: Language;
  onNavigate?: (scene: number, beat: number) => void;
}) {
  const [nearby, setNearby] = useState(false);
  const [previewScene, setPreviewScene] = useState<number | null>(null);
  const labels = SCENE_IDS.map((sceneId) => getCopy(sceneId, language).nav);

  const navigate = (targetScene: number) => {
    onNavigate?.(targetScene, 0);
  };

  const handleClick = (
    event: MouseEvent<HTMLButtonElement>,
    targetScene: number,
  ) => {
    event.preventDefault();
    event.stopPropagation();
    navigate(targetScene);
  };

  const handleKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    targetScene: number,
  ) => {
    if (event.repeat) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    let destination: number | null = null;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      destination = Math.min(5, targetScene + 1);
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      destination = Math.max(1, targetScene - 1);
    } else if (event.key === "Enter" || event.key === " " || event.key === "Spacebar") {
      destination = targetScene;
    }

    if (destination === null) return;
    event.preventDefault();
    event.stopPropagation();
    navigate(destination);
  };

  const handleTouchStartCapture = (event: TouchEvent<HTMLElement>) => {
    event.stopPropagation();
    setNearby(true);

    const marker = (event.target as HTMLElement).closest<HTMLButtonElement>(
      "[data-scene-target]",
    );
    setPreviewScene(marker ? Number(marker.dataset.sceneTarget) : null);
  };

  const handleTouchEndCapture = (event: TouchEvent<HTMLElement>) => {
    event.stopPropagation();
    setNearby(false);
    setPreviewScene(null);
  };

  return (
    <nav
      className={styles.cableNavigation}
      aria-label={language === "zh" ? "配重缆绳场景导航" : "Counterweight cable scene navigation"}
      data-topic-navigation="true"
      data-testid="counterweight-cable-navigation"
      data-navigation-geometry="path"
      data-navigation-carrier="counterweight-cable"
      data-navigation-invocation="proximity-reveal"
      data-navigation-feedback="geometry-reflow"
      data-active-scene={scene}
      data-proximity-reveal={nearby || previewScene !== null ? "true" : "false"}
      data-geometry-reflow="true"
      onPointerEnter={() => setNearby(true)}
      onPointerLeave={() => {
        setNearby(false);
        setPreviewScene(null);
      }}
      onFocus={() => setNearby(true)}
      onBlur={() => {
        setNearby(false);
        setPreviewScene(null);
      }}
      onClick={(event) => event.stopPropagation()}
      onPointerDown={(event) => event.stopPropagation()}
      onPointerUp={(event) => event.stopPropagation()}
      onPointerCancel={(event) => event.stopPropagation()}
      onTouchStartCapture={handleTouchStartCapture}
      onTouchEndCapture={handleTouchEndCapture}
      onTouchCancelCapture={handleTouchEndCapture}
    >
      <svg className={styles.navigationCable} viewBox="0 0 1100 112" aria-hidden="true">
        <path className={styles.navigationCableShadow} d={NAV_PATHS[scene]} />
        <path className={styles.navigationCableLine} data-navigation-path="true" d={NAV_PATHS[scene]} />
      </svg>
      <div className={styles.navigationMarkers}>
        {SCENE_IDS.map((sceneId, index) => {
          const point = NAV_POINTS[scene][index];
          const isCurrent = sceneId === scene;
          const isPreview = previewScene === sceneId;
          return (
            <button
              aria-current={isCurrent ? "step" : undefined}
              aria-label={`${language === "zh" ? "打开场景" : "Open scene"} ${sceneId}: ${labels[index]}`}
              className={styles.cableMarker}
              data-active={isCurrent ? "true" : "false"}
              data-preview={isPreview ? "true" : "false"}
              data-scene-target={sceneId}
              disabled={!onNavigate}
              key={sceneId}
              style={toVars({
                "--nav-x": `${point.x}%`,
                "--nav-y": `${point.y}%`,
              })}
              type="button"
              onBlur={() => setPreviewScene(null)}
              onClick={(event) => handleClick(event, sceneId)}
              onFocus={() => setPreviewScene(sceneId)}
              onKeyDownCapture={(event) => handleKeyDown(event, sceneId)}
              onPointerDown={(event) => event.stopPropagation()}
              onPointerUp={(event) => event.stopPropagation()}
              onPointerCancel={(event) => event.stopPropagation()}
              onPointerEnter={() => setPreviewScene(sceneId)}
            >
              <span>{`0${sceneId}`}</span>
              <strong>{labels[index]}</strong>
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
  const safeScene = toSceneId(scene);
  const noMotion = reducedMotion || isThumbnail;
  const safeBeat = isThumbnail
    ? BEAT_COUNTS[safeScene] - 1
    : clampBeat(safeScene, beat);

  return (
    <div
      className={[styles.root, noMotion ? styles.motionOff : ""].filter(Boolean).join(" ")}
      data-topic-id="elevator-counterweight"
      data-motion={noMotion ? "off" : "on"}
    >
      <div className={styles.surfaceGrid} aria-hidden="true" />
      <SpatialSceneTrack
        beat={safeBeat}
        beatLayoutModes={BEAT_LAYOUT_MODES}
        className={styles.sceneTrack}
        reducedMotion={noMotion}
        renderScene={(sceneId, sceneBeat) => (
          <ScenePanel
            beat={clampBeat(toSceneId(sceneId), sceneBeat)}
            language={language}
            scene={toSceneId(sceneId)}
          />
        )}
        scene={safeScene}
        sceneIds={SCENE_IDS}
        transitionKind="split-merge"
        transitionMap={TRANSITION_MAP}
      />
      {!isThumbnail && (
        <CableNavigation language={language} onNavigate={onNavigate} scene={safeScene} />
      )}
    </div>
  );
}

export default defineTopic({
  id: "elevator-counterweight",
  styleId: "collaborative-pairing-board",
  title: {
    en: "Counterweight",
    zh: "电梯配重",
  },
  modelId: "GPT 5.6 Sol",
  Stage: TopicStage,
  metadata: METADATA,
  navigation: NAVIGATION,
  transitionScore: ELEVATOR_COUNTERWEIGHT_TRANSITION_SCORE,
  evidence: {
    kind: "facts",
    sources: ELEVATOR_COUNTERWEIGHT_SOURCES,
  },
});

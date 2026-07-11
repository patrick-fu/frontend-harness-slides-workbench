import { useCallback, useEffect, useRef } from "react";
import type React from "react";
import type {
  TopicMetadata,
  TopicStageProps,
  TopicTransitionScore,
} from "../domain/topic";
import { defineTopic } from "../domain/topic";
import type { Source } from "../domain/evidence";
import SpatialSceneTrack, {
  type BeatLayoutMode,
  type SceneTransitionMap,
} from "../styles/SpatialSceneTrack";
import styles from "./bridge-movement.module.css";

type Language = "en" | "zh";
type SceneId = 1 | 2 | 3 | 4 | 5;
type SourceId = "S1" | "S2" | "S3" | "S4";

interface BridgeSource extends Source {
  id: SourceId;
  authority: string;
  title: string;
  citation: string;
  boundary: string;
  accessDate: "2026-07-10";
}

interface BeatCopy {
  action: string;
  title: string;
  body: string;
}

interface SceneCopy {
  code: string;
  title: string;
  subtitle: string;
  sourceIds: readonly SourceId[];
  beats: readonly BeatCopy[];
}

interface ClaimCopy {
  en: string;
  zh: string;
}

const SCENE_IDS: readonly SceneId[] = [1, 2, 3, 4, 5];
const NATIVE_TOUCH_EVENTS = [
  "touchstart",
  "touchmove",
  "touchend",
  "touchcancel",
] as const;

const BEAT_COUNTS: Record<SceneId, number> = {
  1: 4,
  2: 3,
  3: 2,
  4: 1,
  5: 1,
};

const BEAT_LAYOUT_MODES: Partial<Record<number, BeatLayoutMode>> = {
  1: "reserved",
  2: "reserved",
  3: "reserved",
};

export const BRIDGE_MOVEMENT_TRANSITION_SCORE = {
  "1->2": "dip-to-color",
  "2->3": "linear-wipe",
  "3->4": "crossfade",
  "4->5": "linear-wipe",
} as const satisfies Readonly<TopicTransitionScore>;

const REDUCED_TRANSITION_SCORE: SceneTransitionMap = {
  "1->2": "hard-cut",
  "2->3": "hard-cut",
  "3->4": "hard-cut",
  "4->5": "hard-cut",
};

export const BRIDGE_MOVEMENT_SOURCES = [
  {
    id: "S1",
    authority: "Federal Highway Administration",
    title: "Bridge Geometry Manual",
    citation:
      "FHWA-HIF-22-034, Bridge Geometry Manual, Part 1, bearing definition and common bearing types.",
    url: "https://www.fhwa.dot.gov/bridge/pubs/hif22034.pdf",
    supports:
      "Defines a bearing as a load-carrying element supporting the bridge superstructure while allowing translation, rotation, or translation with rotation, and identifies elastomeric, pot, disc, spherical, rocker, and roller-pin bearings as common types.",
    boundary:
      "This is a definition and geometry reference. It does not prescribe one bearing layout or the same degrees of freedom for every bridge, support, or load case.",
    accessDate: "2026-07-10",
  },
  {
    id: "S2",
    authority: "Federal Highway Administration",
    title:
      "Engineering Design, Fabrication, and Erection of Prefabricated Bridge Elements and Systems",
    citation:
      "FHWA-HIF-17-019, section 8.1.1, Bridge Deck Expansion Joints.",
    url: "https://www.fhwa.dot.gov/bridge/pubs/hif17019.pdf",
    supports:
      "States that deck expansion joints accommodate thermal movement in bridge superstructures and notes that joint capability, spacing, construction, drainage, and maintenance remain project-specific design considerations.",
    boundary:
      "The cited discussion is about deck expansion joints and thermal movement. It is not a universal instruction to use a joint at every support or to apply one movement range to every bridge.",
    accessDate: "2026-07-10",
  },
  {
    id: "S3",
    authority: "Washington State Department of Transportation",
    title: "Bridge Design Manual M 23-50.24, Chapter 9: Bearings and Expansion Joints",
    citation:
      "WSDOT Bridge Design Manual M 23-50.24, June 2025, sections 9.1–9.3.",
    url: "https://www.wsdot.wa.gov/publications/manuals/fulltext/m23-50/chapter9.pdf",
    supports:
      "Provides design guidance for expansion-joint movement ranges, bearing movement considerations, pin bearings, guided and non-guided translational bearing capability, and seismic isolation devices including high-damping rubber, friction pendulum systems, and hydraulic dampers.",
    boundary:
      "WSDOT requirements and device listings are used here as an authoritative design-manual example. Device selection, guide direction, detailing, and capacity require project-specific analysis and agency criteria.",
    accessDate: "2026-07-10",
  },
  {
    id: "S4",
    authority: "California Department of Transportation",
    title: "Seismic Design Criteria, Version 2.0",
    citation:
      "Caltrans Seismic Design Criteria Version 2.0, section 7.5, Bearings and Expansion Joints.",
    url: "https://dot.ca.gov/-/media/dot-media/programs/engineering/documents/seismicdesigncriteria-sdc/202007-seismicdesigncriteria-v2-a11y.pdf",
    supports:
      "Requires bearings to be checked so displacement capacity and failure mode are consistent with seismic-analysis assumptions, and explains that rotation in PTFE spherical bearings occurs along the spherical surface.",
    boundary:
      "Caltrans seismic criteria are not a substitute for local governing specifications. The Topic uses the source only to bound the seismic-capacity claim, not to specify a bearing for a real bridge.",
    accessDate: "2026-07-10",
  },
] as const satisfies readonly BridgeSource[];

export const BRIDGE_MOVEMENT_CLAIM_SOURCE_MAP = {
  "bearing-function": ["S1"],
  "thermal-joint": ["S2"],
  "traffic-reaction": ["S1", "S3"],
  "seismic-capacity": ["S3", "S4"],
  "guided-slide": ["S3"],
  "hinge-axis": ["S3"],
  "force-assignment": ["S2", "S3", "S4"],
  "resolved-synthesis": ["S1", "S2", "S3", "S4"],
} as const satisfies Record<string, readonly SourceId[]>;

type ClaimId = keyof typeof BRIDGE_MOVEMENT_CLAIM_SOURCE_MAP;

const CLAIMS: Record<ClaimId, ClaimCopy> = {
  "bearing-function": {
    en: "A bearing carries superstructure load; the selected bearing type and detail may allow translation, rotation, or both.",
    zh: "支座承托上部结构荷载；选定支座类型与构造后，可允许平移、转动或二者兼有。",
  },
  "thermal-joint": {
    en: "A deck expansion joint accommodates thermal movement in the superstructure.",
    zh: "桥面伸缩缝用于容纳上部结构的温度位移。",
  },
  "traffic-reaction": {
    en: "Traffic reactions pass through the support system; the permitted motion is a detail decision.",
    zh: "车辆反力经支承体系传递；允许何种位移，取决于构造细节。",
  },
  "seismic-capacity": {
    en: "For seismic design, check each bearing's displacement capacity and failure mode against the assumptions in the seismic analysis.",
    zh: "抗震设计中，应校核每个支座的位移能力与破坏模式是否符合抗震分析假设。",
  },
  "guided-slide": {
    en: "A guided slide can allow travel along one assigned axis while guides limit the other plan direction.",
    zh: "导向滑移面可沿指定轴线移动，同时由导向件限制另一平面方向。",
  },
  "hinge-axis": {
    en: "A pinned hinge permits rotation about its pin axis; translation needs its own detail.",
    zh: "销铰允许绕销轴转动；平移必须由独立构造另行处理。",
  },
  "force-assignment": {
    en: "Assign displacement by component and axis, then check capacity for the governing action and structural system.",
    zh: "按构件与轴线分配位移，再针对控制作用与结构体系校核能力。",
  },
  "resolved-synthesis": {
    en: "Engineering synthesis: safety comes from assigning freedom and restraint by detail, not from making every connection rigid.",
    zh: "工程归纳：安全来自按构造分配自由度与约束，而非让每一处连接都刚死。",
  },
};

const COPY: Record<Language, Record<SceneId, SceneCopy>> = {
  en: {
    1: {
      code: "01 / THESIS GRID",
      title: "THE BRIDGE MUST MOVE",
      subtitle:
        "Assign displacement by component and axis, then check capacity. Complete stillness is not the design goal.",
      sourceIds: ["S1", "S2", "S3", "S4"],
      beats: [
        {
          action: "Hold the bridge line and its supporting bearings.",
          title: "Support is not a weld",
          body: "The support carries load while the bearing type and detail define permitted motion.",
        },
        {
          action: "Mark the thermal travel path at the deck joint.",
          title: "Temperature changes length",
          body: "The deck joint is an assigned gap, not an accidental break.",
        },
        {
          action: "Add the traffic-reaction path through the support.",
          title: "Traffic adds reaction",
          body: "Load transfer and movement allowance are designed together.",
        },
        {
          action: "Add the seismic capacity condition and settle the bridge line.",
          title: "Earthquake checks the bearing",
          body: "Check bearing displacement capacity and failure mode against the seismic-analysis assumptions.",
        },
      ],
    },
    2: {
      code: "02 / COMPONENT ROW",
      title: "FIVE PARTS. FIVE JOBS.",
      subtitle:
        "Each element is drawn as a specimen. Its freedom is useful only because its constraint is explicit.",
      sourceIds: ["S1", "S2", "S3", "S4"],
      beats: [
        {
          action: "Enter the bearing and joint specimens; focus the bearing.",
          title: "Bearing",
          body: "Support reaction; the selected bearing type and detail may also permit rotation or translation.",
        },
        {
          action: "Add the guided sliding plane; focus the expansion joint.",
          title: "Expansion joint",
          body: "A controlled deck gap accommodates thermal movement.",
        },
        {
          action: "Add the damper and hinge; focus the damper.",
          title: "Damper",
          body: "An assigned seismic device can contribute isolation or energy dissipation.",
        },
      ],
    },
    3: {
      code: "03 / SECTION COMPARISON",
      title: "ALLOW ONE DIRECTION. NAME THE OTHERS.",
      subtitle:
        "A section is a contract: it says what may travel, what is guided, and what must be carried.",
      sourceIds: ["S1", "S3"],
      beats: [
        {
          action: "Show the guided sliding bearing plan and its permitted longitudinal axis.",
          title: "Guided slide",
          body: "Longitudinal X travel is allowed; transverse Y travel is limited by guides.",
        },
        {
          action: "Add the pinned hinge comparison and its rotational axis.",
          title: "Pinned hinge",
          body: "Rotation follows the pin axis. A separate slide is needed for translation.",
        },
      ],
    },
    4: {
      code: "04 / FORCE TABLE",
      title: "ACTION × DEVICE",
      subtitle:
        "A sparse check table, not a ranking: each mark names a design responsibility rather than a winner.",
      sourceIds: ["S2", "S3", "S4"],
      beats: [
        {
          action: "Set the full temperature, traffic, wind, and earthquake matrix in place.",
          title: "Assign the path",
          body: "No device is assumed to solve every action; capacity and detailing remain project-specific.",
        },
      ],
    },
    5: {
      code: "05 / RESOLVED GRID",
      title: "ASSIGNED FREEDOM",
      subtitle:
        "The bridge returns as one line. Five small annotations explain why that line can stay safe while it moves.",
      sourceIds: ["S1", "S2", "S3", "S4"],
      beats: [
        {
          action: "Hold the resolved bridge and its five component annotations.",
          title: "Move by design",
          body: "Freedom and restraint are both structural decisions.",
        },
      ],
    },
  },
  zh: {
    1: {
      code: "01 / 论点网格",
      title: "桥必须会移动",
      subtitle: "按构件与轴线分配位移，再校核能力；完全不动并不是设计目标。",
      sourceIds: ["S1", "S2", "S3", "S4"],
      beats: [
        {
          action: "停住桥面线与下方支座。",
          title: "支承不是焊死",
          body: "支承传递荷载，选定支座类型与构造共同决定允许的运动。",
        },
        {
          action: "标出桥面伸缩缝的温度位移路径。",
          title: "温度改变长度",
          body: "桥面缝是被分配的间隙，不是偶然断口。",
        },
        {
          action: "加入车辆反力穿过支承体系的路径。",
          title: "交通带来反力",
          body: "荷载传递和位移预留需要一起设计。",
        },
        {
          action: "加入抗震位移能力条件，并让桥面线稳定。",
          title: "地震校核支座",
          body: "校核支座位移能力与破坏模式是否符合抗震分析假设。",
        },
      ],
    },
    2: {
      code: "02 / 构件行",
      title: "五个构件。五种职责。",
      subtitle: "每个构件都像一个标本。它的自由度之所以可靠，是因为约束被明确写出。",
      sourceIds: ["S1", "S2", "S3", "S4"],
      beats: [
        {
          action: "进入支座与伸缩缝标本；聚焦支座。",
          title: "支座",
          body: "传递支承反力；选定支座类型与构造也可允许转动或平移。",
        },
        {
          action: "加入导向滑移面；聚焦伸缩缝。",
          title: "伸缩缝",
          body: "受控桥面间隙容纳温度位移。",
        },
        {
          action: "加入阻尼器与铰；聚焦阻尼器。",
          title: "阻尼器",
          body: "被指定的抗震装置可提供隔震或耗能作用。",
        },
      ],
    },
    3: {
      code: "03 / 剖面比较",
      title: "放行一个方向。写清其余方向。",
      subtitle: "剖面是一份契约：什么可以移动、什么被导向、什么必须承托，都要写清。",
      sourceIds: ["S1", "S3"],
      beats: [
        {
          action: "展示导向滑动支座平面与允许的纵向轴。",
          title: "导向滑移",
          body: "允许纵向 X 位移；横向 Y 位移由导向件限制。",
        },
        {
          action: "加入销铰比较与转动轴。",
          title: "销铰",
          body: "转动沿销轴发生；平移需另设滑移构造。",
        },
      ],
    },
    4: {
      code: "04 / 作用表",
      title: "作用 × 装置",
      subtitle: "这是稀疏校核表，不是排名：每个标记只说明一项设计职责。",
      sourceIds: ["S2", "S3", "S4"],
      beats: [
        {
          action: "让温度、交通、风和地震的完整矩阵静态落位。",
          title: "分配路径",
          body: "不默认任何装置解决全部作用；能力与构造仍需按项目确定。",
        },
      ],
    },
    5: {
      code: "05 / 收束网格",
      title: "被分配的自由度",
      subtitle: "桥梁回到一条线。五个微小注记解释这条线为何能在移动时仍保持安全。",
      sourceIds: ["S1", "S2", "S3", "S4"],
      beats: [
        {
          action: "停在收束的桥梁轮廓与五个构件注记上。",
          title: "按设计移动",
          body: "自由与约束，都是结构决策。",
        },
      ],
    },
  },
};

const NAV_LABELS: Record<Language, readonly string[]> = {
  en: ["thesis grid", "components", "section comparison", "force table", "resolved bridge"],
  zh: ["论点网格", "构件", "剖面比较", "作用表", "收束桥梁"],
};

const NAV_MARKS = ["T", "C", "D", "F", "R"] as const;

const COMPOSITIONS = [
  "thesis-grid",
  "component-row",
  "section-comparison",
  "force-table",
  "resolved-grid",
] as const;

function clampScene(scene: number): SceneId {
  return SCENE_IDS.includes(scene as SceneId) ? (scene as SceneId) : 1;
}

function clampBeat(scene: SceneId, beat: number, settle: boolean): number {
  if (settle) return BEAT_COUNTS[scene] - 1;
  return Math.max(0, Math.min(Math.trunc(beat), BEAT_COUNTS[scene] - 1));
}

function visibleAt(beat: number, threshold: number): "true" | "false" {
  return beat >= threshold ? "true" : "false";
}

function sourceIdsFor(claimId: ClaimId): readonly SourceId[] {
  return BRIDGE_MOVEMENT_CLAIM_SOURCE_MAP[claimId];
}

function useNativeTouchIsolation(
  onTouchEnd?: (event: Event) => void,
) {
  const rootRef = useRef<HTMLElement>(null);
  const onTouchEndRef = useRef(onTouchEnd);
  onTouchEndRef.current = onTouchEnd;

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    const isolateNativeTouch = (event: Event) => {
      event.stopPropagation();
      if (event.type === "touchend") {
        onTouchEndRef.current?.(event);
      }
    };

    for (const eventName of NATIVE_TOUCH_EVENTS) {
      root.addEventListener(eventName, isolateNativeTouch, {
        capture: true,
        passive: false,
      });
    }

    return () => {
      for (const eventName of NATIVE_TOUCH_EVENTS) {
        root.removeEventListener(eventName, isolateNativeTouch, true);
      }
    };
  }, []);

  return rootRef;
}

function GridField() {
  return (
    <div className={styles.gridField} aria-hidden="true">
      {Array.from({ length: 12 }, (_, index) => (
        <span
          className={styles.gridVertical}
          data-grid-column={index + 1}
          key={`column-${index}`}
        />
      ))}
      {Array.from({ length: 6 }, (_, index) => (
        <span
          className={styles.gridHorizontal}
          data-grid-row={index + 1}
          key={`row-${index}`}
        />
      ))}
    </div>
  );
}

function ClaimLine({
  claimId,
  language,
  visible,
  label,
}: {
  claimId: ClaimId;
  language: Language;
  visible: boolean;
  label: string;
}) {
  const sourceIds = sourceIdsFor(claimId);
  return (
    <div
      className={[styles.claimLine, styles.reveal].join(" ")}
      data-beat-layout-item="true"
      data-claim-id={claimId}
      data-claim-source={sourceIds.join(" ")}
      data-visible={visible ? "true" : "false"}
    >
      <span className={styles.claimLabel}>{label}</span>
      <span>{CLAIMS[claimId][language]}</span>
      <span className={styles.claimReferences}>[{sourceIds.join(", ")}]</span>
    </div>
  );
}

function SourceStamp({
  language,
  sourceIds,
}: {
  language: Language;
  sourceIds: readonly SourceId[];
}) {
  const sourceLabel = language === "zh" ? "来源" : "SOURCES";
  const touchIsolationRef = useNativeTouchIsolation();
  return (
    <aside
      className={styles.sourceStamp}
      data-native-touch-isolation="capture"
      data-source-stamp="true"
      data-source-ids={sourceIds.join(" ")}
      data-beat-layout-item="true"
      ref={touchIsolationRef}
    >
      <span>{sourceLabel}</span>
      {sourceIds.map((sourceId) => {
        const source = BRIDGE_MOVEMENT_SOURCES.find(
          (item) => item.id === sourceId,
        );
        if (!source) return null;
        return (
          <a
            href={source.url}
            key={sourceId}
            onClick={(event) => event.stopPropagation()}
            onPointerDown={(event) => event.stopPropagation()}
            rel="noreferrer"
            target="_blank"
            title={source.citation}
          >
            [{sourceId}]
          </a>
        );
      })}
    </aside>
  );
}

function BeatLedger({
  scene,
  beat,
  language,
}: {
  scene: SceneId;
  beat: number;
  language: Language;
}) {
  const copy = COPY[language][scene];
  const current = copy.beats[beat];
  const stepLabel = language === "zh" ? "节拍" : "BEAT";
  return (
    <aside className={styles.beatLedger} data-beat-layout-item="true">
      <span>{stepLabel} {String(beat + 1).padStart(2, "0")}</span>
      <strong>{current.title}</strong>
      <p>{current.body}</p>
    </aside>
  );
}

function ThesisBridge({
  beat,
  language,
  active,
}: {
  beat: number;
  language: Language;
  active: boolean;
}) {
  const labels =
    language === "zh"
      ? { deck: "桥面", support: "支座", joint: "伸缩缝", load: "车辆反力", quake: "地震位移能力" }
      : { deck: "DECK", support: "BEARING", joint: "EXPANSION JOINT", load: "TRAFFIC REACTION", quake: "EARTHQUAKE CAPACITY" };

  return (
    <div
      className={styles.thesisBridge}
      data-bridge-thesis="true"
      data-motion-limited="true"
      data-active={active ? "true" : "false"}
      data-beat-layout-item="true"
    >
      <div className={styles.thesisDeck} data-active={active ? "true" : "false"}>
        <span className={styles.deckBeam} />
        <span className={styles.deckBeamLower} />
        <span className={styles.deckLabel}>{labels.deck}</span>
      </div>
      <span className={styles.deckJoint} aria-hidden="true" />
      <span className={styles.jointLabel}>{labels.joint}</span>
      <span className={styles.supportLine} aria-hidden="true" />
      <span className={styles.supportLineSecond} aria-hidden="true" />
      <span className={styles.bearingBlock} aria-hidden="true" />
      <span className={styles.bearingBlockSecond} aria-hidden="true" />
      <span className={styles.supportLabel}>{labels.support}</span>
      <span
        className={[styles.trafficArrow, styles.reveal].join(" ")}
        data-visible={visibleAt(beat, 2)}
      >
        {labels.load} ↓
      </span>
      <span
        className={[styles.quakeArrow, styles.reveal].join(" ")}
        data-visible={visibleAt(beat, 3)}
      >
        ↔ {labels.quake}
      </span>
      <span
        className={[styles.thermalArrow, styles.reveal].join(" ")}
        data-visible={visibleAt(beat, 1)}
      >
        ← →
      </span>
    </div>
  );
}

const DEVICE_IDS = [
  "bearing",
  "expansion-joint",
  "damper",
  "hinge",
  "sliding-plane",
] as const;

type DeviceId = (typeof DEVICE_IDS)[number];

const DEVICE_REVEAL_BEAT: Record<DeviceId, number> = {
  bearing: 0,
  "expansion-joint": 0,
  "sliding-plane": 1,
  damper: 2,
  hinge: 2,
};

const DEVICE_FOCUS_BY_BEAT: Record<number, DeviceId> = {
  0: "bearing",
  1: "expansion-joint",
  2: "damper",
};

const DEVICE_COPY: Record<
  Language,
  Record<DeviceId, { label: string; role: string; claimId: ClaimId }>
> = {
  en: {
    bearing: {
      label: "BEARING",
      role: "SUPPORT REACTION · TYPE + DETAIL DEFINE MOTION",
      claimId: "bearing-function",
    },
    "expansion-joint": {
      label: "EXPANSION JOINT",
      role: "DECK GAP · THERMAL TRAVEL",
      claimId: "thermal-joint",
    },
    damper: {
      label: "DAMPER",
      role: "SEISMIC SYSTEM · DISSIPATE WHEN SPECIFIED",
      claimId: "seismic-capacity",
    },
    hinge: {
      label: "HINGE",
      role: "PIN AXIS · ROTATION ONLY",
      claimId: "hinge-axis",
    },
    "sliding-plane": {
      label: "SLIDING PLANE",
      role: "GUIDED X TRAVEL · Y LIMITED",
      claimId: "guided-slide",
    },
  },
  zh: {
    bearing: {
      label: "支座",
      role: "传递支承反力 · 类型与构造定义自由度",
      claimId: "bearing-function",
    },
    "expansion-joint": {
      label: "伸缩缝",
      role: "桥面间隙 · 温度位移",
      claimId: "thermal-joint",
    },
    damper: {
      label: "阻尼器",
      role: "抗震体系 · 按指定耗能",
      claimId: "seismic-capacity",
    },
    hinge: {
      label: "铰",
      role: "销轴 · 仅允许转动",
      claimId: "hinge-axis",
    },
    "sliding-plane": {
      label: "滑移面",
      role: "导向 X 位移 · Y 受限",
      claimId: "guided-slide",
    },
  },
};

function DeviceGlyph({ deviceId }: { deviceId: DeviceId }) {
  if (deviceId === "bearing") {
    return (
      <svg className={styles.deviceGlyph} viewBox="0 0 200 90" aria-hidden="true">
        <path d="M18 20H182M18 70H182" />
        <path d="M42 33H158V57H42Z" className={styles.glyphFill} />
        <path d="M42 33H158V57H42Z" />
        <path d="M58 57L70 70M92 57L100 70M126 57L138 70" />
      </svg>
    );
  }
  if (deviceId === "expansion-joint") {
    return (
      <svg className={styles.deviceGlyph} viewBox="0 0 200 90" aria-hidden="true">
        <path d="M18 32H82M118 32H182" />
        <path d="M18 58H82M118 58H182" />
        <path d="M92 18V72M108 18V72" className={styles.signalStroke} />
        <path d="M74 45H126" />
      </svg>
    );
  }
  if (deviceId === "damper") {
    return (
      <svg className={styles.deviceGlyph} viewBox="0 0 200 90" aria-hidden="true">
        <path d="M18 45H52M148 45H182" />
        <path d="M52 28H128V62H52Z" className={styles.glyphFill} />
        <path d="M52 28H128V62H52Z" />
        <path d="M128 35H148V55H128M92 28V62" />
      </svg>
    );
  }
  if (deviceId === "hinge") {
    return (
      <svg className={styles.deviceGlyph} viewBox="0 0 200 90" aria-hidden="true">
        <path d="M20 64H88M112 64H180" />
        <path d="M48 64L82 34M152 64L118 34" />
        <circle cx="100" cy="34" r="16" className={styles.glyphFill} />
        <circle cx="100" cy="34" r="16" />
        <path d="M100 18V50M84 34H116" className={styles.signalStroke} />
      </svg>
    );
  }
  return (
    <svg className={styles.deviceGlyph} viewBox="0 0 200 90" aria-hidden="true">
      <path d="M20 64H180M20 72H180" />
      <path d="M48 28H152V52H48Z" className={styles.glyphFill} />
      <path d="M48 28H152V52H48Z" />
      <path d="M36 16H164M36 16L48 8M36 16L48 24M164 16L152 8M164 16L152 24" className={styles.signalStroke} />
    </svg>
  );
}

function ComponentRow({ beat, language }: { beat: number; language: Language }) {
  const focusId = DEVICE_FOCUS_BY_BEAT[beat];
  return (
    <div className={styles.componentRow} data-beat-layout-item="true">
      {DEVICE_IDS.map((deviceId) => {
        const copy = DEVICE_COPY[language][deviceId];
        const sourceIds = sourceIdsFor(copy.claimId);
        return (
          <article
            className={[styles.deviceSpecimen, styles.reveal].join(" ")}
            data-bridge-device={deviceId}
            data-claim-id={copy.claimId}
            data-claim-source={sourceIds.join(" ")}
            data-focus={focusId === deviceId ? "true" : "false"}
            data-visible={visibleAt(beat, DEVICE_REVEAL_BEAT[deviceId])}
            key={deviceId}
          >
            <DeviceGlyph deviceId={deviceId} />
            <strong>{copy.label}</strong>
            <span>{copy.role}</span>
            <small>[{sourceIds.join(", ")}]</small>
          </article>
        );
      })}
    </div>
  );
}

function DirectionConstraint({
  kind,
  visible,
  language,
}: {
  kind: "guided" | "hinge";
  visible: boolean;
  language: Language;
}) {
  const isGuided = kind === "guided";
  const claimId: ClaimId = isGuided ? "guided-slide" : "hinge-axis";
  const sourceIds = sourceIdsFor(claimId);
  const text =
    language === "zh"
      ? isGuided
        ? {
            title: "导向滑移支座",
            allow: "纵向 X · 允许 ↔",
            limit: "横向 Y · 导向 / 限制",
            reaction: "竖向 Z · 承托反力",
          }
        : {
            title: "销铰连接",
            allow: "销轴 · 允许转动",
            limit: "平移 · 除非另设滑移构造，否则受限",
            reaction: "反力路径 · 由连接构造定义",
          }
      : isGuided
        ? {
            title: "GUIDED SLIDING BEARING",
            allow: "LONGITUDINAL X · ALLOW ↔",
            limit: "TRANSVERSE Y · GUIDE / LIMIT",
            reaction: "VERTICAL Z · REACTION CARRIED",
          }
        : {
            title: "PINNED HINGE",
            allow: "PIN AXIS · ALLOW ROTATION",
            limit: "TRANSLATION · RESTRAINED UNLESS A SEPARATE SLIDE IS DETAILED",
            reaction: "REACTION PATH · SET BY CONNECTION DETAIL",
          };

  return (
    <figure
      className={[styles.directionConstraint, styles.reveal].join(" ")}
      data-direction-constraint={kind}
      data-claim-id={claimId}
      data-claim-source={sourceIds.join(" ")}
      data-visible={visible ? "true" : "false"}
      data-beat-layout-item="true"
    >
      <svg className={styles.directionDiagram} viewBox="0 0 640 320" aria-hidden="true">
        <path d="M52 64H588M52 256H588" className={styles.constructionStroke} />
        {isGuided ? (
          <>
            <path d="M164 184H476M164 208H476" className={styles.heavyStroke} />
            <path d="M214 104H426V168H214Z" className={styles.diagramFill} />
            <path d="M214 104H426V168H214Z" className={styles.heavyStroke} />
            <path d="M184 86V224M456 86V224" className={styles.signalDiagramStroke} />
            <path d="M246 136H394M246 136L268 120M246 136L268 152M394 136L372 120M394 136L372 152" className={styles.signalDiagramStroke} />
            <path d="M320 168V232M308 220L320 236L332 220" className={styles.heavyStroke} />
          </>
        ) : (
          <>
            <path d="M112 232H294M346 232H528" className={styles.heavyStroke} />
            <path d="M154 232L284 116M486 232L356 116" className={styles.heavyStroke} />
            <circle cx="320" cy="116" r="34" className={styles.diagramFill} />
            <circle cx="320" cy="116" r="34" className={styles.heavyStroke} />
            <path d="M286 116H354M320 82V150" className={styles.signalDiagramStroke} />
            <path d="M270 68C302 44 340 44 372 68M270 68L280 46M270 68L294 70" className={styles.signalDiagramStroke} />
          </>
        )}
      </svg>
      <figcaption>
        <strong>{text.title}</strong>
        <span>{text.allow}</span>
        <span>{text.limit}</span>
        <small>{text.reaction} [{sourceIds.join(", ")}]</small>
      </figcaption>
    </figure>
  );
}

const FORCE_TABLE: Record<
  Language,
  readonly {
    action: string;
    cells: readonly [string, string, string, string, string];
  }[]
> = {
  en: [
    { action: "TEMPERATURE", cells: ["GAP", "TRAVEL IF EXPANSION", "—", "—", "X TRAVEL"] },
    { action: "TRAFFIC", cells: ["WHEEL PASSAGE", "VERTICAL REACTION", "—", "ROTATION DETAIL", "FRICTION / GUIDE"] },
    { action: "WIND", cells: ["LAYOUT", "RESTRAINT LAYOUT", "IF SPECIFIED", "AXIS DETAIL", "GUIDE RESISTS Y"] },
    { action: "EARTHQUAKE", cells: ["IF ISOLATED: JOINT CAPACITY", "SYSTEM-SPECIFIC: BEARING CAPACITY", "SYSTEM-SPECIFIC: DISSIPATION", "SYSTEM-SPECIFIC: HINGE / RESTRAINT", "SYSTEM-SPECIFIC: SLIDE CAPACITY"] },
  ],
  zh: [
    { action: "温度", cells: ["间隙", "若为活动支座则位移", "—", "—", "X 位移"] },
    { action: "交通", cells: ["车轮通过", "竖向反力", "—", "转动构造", "摩擦 / 导向"] },
    { action: "风", cells: ["布置", "约束布置", "若指定", "轴线构造", "导向限制 Y"] },
    { action: "地震", cells: ["若采用隔震：校核伸缩缝能力", "体系特定：支座位移能力", "体系特定：耗能装置", "体系特定：铰 / 约束", "体系特定：滑移能力"] },
  ],
};

const FORCE_HEADERS: Record<Language, readonly string[]> = {
  en: ["EXPANSION JOINT", "BEARING", "DAMPER", "HINGE", "SLIDE"],
  zh: ["伸缩缝", "支座", "阻尼器", "铰", "滑移面"],
};

function ForceTable({ language }: { language: Language }) {
  const sourceIds = sourceIdsFor("force-assignment");
  return (
    <div
      className={styles.forceTable}
      data-force-table="true"
      data-claim-id="force-assignment"
      data-claim-source={sourceIds.join(" ")}
      data-beat-layout-item="true"
      role="table"
    >
      <div className={styles.forceHeaderRow} role="row">
        <span role="columnheader">{language === "zh" ? "作用" : "ACTION"}</span>
        {FORCE_HEADERS[language].map((header) => (
          <span key={header} role="columnheader">{header}</span>
        ))}
      </div>
      {FORCE_TABLE[language].map((row) => (
        <div className={styles.forceRow} key={row.action} role="row">
          <strong role="rowheader">{row.action}</strong>
          {row.cells.map((cell, index) => (
            <span key={`${row.action}-${FORCE_HEADERS[language][index]}`} role="cell">
              {cell}
            </span>
          ))}
        </div>
      ))}
      <p className={styles.tableBoundary}>
        {language === "zh"
          ? "示意：地震关系均为条件式并取决于具体体系；能力、导向和构造按项目校核。"
          : "SCHEMATIC: EARTHQUAKE RELATIONSHIPS ARE CONDITIONAL AND SYSTEM-SPECIFIC; CHECK PROJECT CAPACITY, GUIDANCE, AND DETAILING."}
        <span> [{sourceIds.join(", ")}]</span>
      </p>
    </div>
  );
}

const RESOLVED_COPY: Record<
  Language,
  readonly { label: string; detail: string; claimId: ClaimId }[]
> = {
  en: [
    { label: "JOINT", detail: "GAP FOR THERMAL TRAVEL", claimId: "thermal-joint" },
    { label: "BEARING", detail: "LOAD PATH + TYPE / DETAIL MOTION", claimId: "bearing-function" },
    { label: "DAMPER", detail: "SEISMIC DISSIPATION WHEN SPECIFIED", claimId: "seismic-capacity" },
    { label: "HINGE", detail: "ROTATION ABOUT PIN AXIS", claimId: "hinge-axis" },
    { label: "SLIDE", detail: "GUIDED ONE-AXIS TRAVEL", claimId: "guided-slide" },
  ],
  zh: [
    { label: "伸缩缝", detail: "温度位移间隙", claimId: "thermal-joint" },
    { label: "支座", detail: "荷载路径 + 类型 / 构造自由度", claimId: "bearing-function" },
    { label: "阻尼器", detail: "按指定抗震耗能", claimId: "seismic-capacity" },
    { label: "铰", detail: "绕销轴转动", claimId: "hinge-axis" },
    { label: "滑移面", detail: "导向单轴位移", claimId: "guided-slide" },
  ],
};

function ResolvedBridge({ language }: { language: Language }) {
  const sourceIds = sourceIdsFor("resolved-synthesis");
  return (
    <div
      className={styles.resolvedBridge}
      data-resolved-bridge="true"
      data-claim-id="resolved-synthesis"
      data-claim-source={sourceIds.join(" ")}
      data-beat-layout-item="true"
    >
      <svg className={styles.resolvedDiagram} viewBox="0 0 1400 420" aria-hidden="true">
        <path d="M84 206H1316" className={styles.resolvedDeck} />
        <path d="M84 230H1316" className={styles.resolvedDeckLower} />
        <path d="M194 230L270 330H118M510 230L570 330H438M910 230L830 330H982M1216 230L1140 330H1292" className={styles.resolvedSupport} />
        <path d="M652 188V246M680 188V246" className={styles.signalDiagramStroke} />
        <circle cx="860" cy="230" r="16" className={styles.diagramFill} />
        <circle cx="860" cy="230" r="16" className={styles.heavyStroke} />
        <path d="M1030 196H1140M1030 214H1140" className={styles.heavyStroke} />
      </svg>
      <div className={styles.resolvedNotes}>
        {RESOLVED_COPY[language].map((item) => {
          const references = sourceIdsFor(item.claimId);
          return (
            <div
              data-claim-id={item.claimId}
              data-claim-source={references.join(" ")}
              data-resolved-note={item.label}
              key={item.label}
            >
              <strong>{item.label}</strong>
              <span>{item.detail}</span>
              <small>[{references.join(", ")}]</small>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SceneBody({
  scene,
  beat,
  language,
  active,
}: {
  scene: SceneId;
  beat: number;
  language: Language;
  active: boolean;
}) {
  if (scene === 1) {
    const labels =
      language === "zh"
        ? ["支承", "温度", "交通", "地震"]
        : ["SUPPORT", "TEMPERATURE", "TRAFFIC", "EARTHQUAKE"];
    const claims: readonly ClaimId[] = [
      "bearing-function",
      "thermal-joint",
      "traffic-reaction",
      "seismic-capacity",
    ];
    return (
      <>
        <div className={styles.thesisCopy} data-beat-layout-item="true">
          <h1>{COPY[language][1].title}</h1>
          <p>{COPY[language][1].subtitle}</p>
        </div>
        <ThesisBridge active={active} beat={beat} language={language} />
        <div className={styles.thesisClaims} data-beat-layout-item="true">
          {claims.map((claimId, index) => (
            <ClaimLine
              claimId={claimId}
              key={claimId}
              label={labels[index]}
              language={language}
              visible={beat >= index}
            />
          ))}
        </div>
      </>
    );
  }

  if (scene === 2) {
    return (
      <>
        <div className={styles.componentCopy} data-beat-layout-item="true">
          <h1>{COPY[language][2].title}</h1>
          <p>{COPY[language][2].subtitle}</p>
        </div>
        <ComponentRow beat={beat} language={language} />
      </>
    );
  }

  if (scene === 3) {
    return (
      <>
        <div className={styles.comparisonCopy} data-beat-layout-item="true">
          {language === "zh" ? (
            <h1
              className={styles.semanticCjkTitle}
              data-cjk-line-break="semantic"
              data-title-line-count="2"
            >
              <span data-title-line="1">放行一个方向。</span>
              <span data-title-line="2">写清其余方向。</span>
            </h1>
          ) : (
            <h1>{COPY.en[3].title}</h1>
          )}
          <p>{COPY[language][3].subtitle}</p>
        </div>
        <div className={styles.directionComparison} data-beat-layout-item="true">
          <DirectionConstraint kind="guided" language={language} visible />
          <DirectionConstraint kind="hinge" language={language} visible={beat >= 1} />
        </div>
      </>
    );
  }

  if (scene === 4) {
    return (
      <>
        <div className={styles.forceCopy} data-beat-layout-item="true">
          <h1>{COPY[language][4].title}</h1>
          <p>{COPY[language][4].subtitle}</p>
        </div>
        <ForceTable language={language} />
      </>
    );
  }

  return (
    <>
      <div className={styles.resolvedCopy} data-beat-layout-item="true">
        <h1>{COPY[language][5].title}</h1>
        <p>{COPY[language][5].subtitle}</p>
      </div>
      <ResolvedBridge language={language} />
      <ClaimLine
        claimId="resolved-synthesis"
        label={language === "zh" ? "工程归纳" : "ENGINEERING SYNTHESIS"}
        language={language}
        visible
      />
    </>
  );
}

function ScenePanel({
  scene,
  beat,
  language,
  active,
}: {
  scene: SceneId;
  beat: number;
  language: Language;
  active: boolean;
}) {
  const copy = COPY[language][scene];
  const multiBeat = BEAT_COUNTS[scene] > 1;
  return (
    <section
      className={[styles.scene, styles[`scene${scene}`], active ? styles.activeScene : ""]
        .filter(Boolean)
        .join(" ")}
      data-active-panel={active ? "true" : "false"}
      data-beat-layout-container={multiBeat ? "true" : undefined}
      data-beat-layout-mode={multiBeat ? "reserved" : undefined}
      data-composition={COMPOSITIONS[scene - 1]}
      data-scene-root="true"
      data-scene={scene}
    >
      <GridField />
      <header className={styles.sceneChrome} data-beat-layout-item="true">
        <span>{copy.code}</span>
        <span>{language === "zh" ? "桥梁位移 / 图解" : "BRIDGE MOVEMENT / DIAGRAM"}</span>
      </header>
      <SceneBody active={active} beat={beat} language={language} scene={scene} />
      <BeatLedger beat={beat} language={language} scene={scene} />
      <SourceStamp language={language} sourceIds={copy.sourceIds} />
    </section>
  );
}

function BearingRulerNavigation({
  activeScene,
  language,
  onNavigate,
}: {
  activeScene: SceneId;
  language: Language;
  onNavigate?: (scene: number, beat: number) => void;
}) {
  const touchHandledAt = useRef(0);
  const navigate = useCallback(
    (target: number) => {
      const safeTarget = Math.max(1, Math.min(5, target));
      onNavigate?.(safeTarget, 0);
    },
    [onNavigate],
  );
  const handleNativeTouchEnd = useCallback(
    (event: Event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const button = target.closest<HTMLButtonElement>(
        "button[data-navigation-scene]",
      );
      if (!button) return;
      const targetScene = Number(button.dataset.navigationScene);
      if (!Number.isInteger(targetScene)) return;
      event.preventDefault();
      touchHandledAt.current = Date.now();
      navigate(targetScene);
    },
    [navigate],
  );
  const touchIsolationRef = useNativeTouchIsolation(handleNativeTouchEnd);
  const isolate = (event: React.SyntheticEvent) => event.stopPropagation();
  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLButtonElement>,
    scene: SceneId,
  ) => {
    event.stopPropagation();
    if (event.repeat) return;
    const numberTarget = Number(event.key);
    const targets: Partial<Record<string, number>> = {
      ArrowRight: scene + 1,
      ArrowDown: scene + 1,
      ArrowLeft: scene - 1,
      ArrowUp: scene - 1,
      Home: 1,
      End: 5,
      " ": scene,
      Space: scene,
      Spacebar: scene,
    };
    const target = numberTarget >= 1 && numberTarget <= 5 ? numberTarget : targets[event.key];
    if (target === undefined) return;
    event.preventDefault();
    navigate(target);
  };

  return (
    <nav
      aria-label={language === "zh" ? "支座尺导航" : "Bearing ruler navigation"}
      className={styles.bearingRuler}
      data-native-touch-isolation="capture"
      data-navigation-carrier="bearing-ruler"
      data-navigation-feedback="history-trail"
      data-navigation-geometry="edge-scale"
      data-navigation-invocation="persistent"
      data-topic-navigation="true"
      onClick={isolate}
      onPointerDown={isolate}
      ref={touchIsolationRef}
    >
      <span className={styles.rulerSpine} aria-hidden="true" />
      {SCENE_IDS.map((scene) => {
        const active = scene === activeScene;
        const history = scene < activeScene;
        const label = NAV_LABELS[language][scene - 1];
        return (
          <button
            aria-current={active ? "step" : undefined}
            aria-label={language === "zh" ? `场景 ${scene}：${label}` : `Scene ${scene}: ${label}`}
            className={styles.rulerButton}
            data-active={active ? "true" : "false"}
            data-history-trail={history ? "true" : undefined}
            data-navigation-scene={scene}
            key={scene}
            onClick={(event) => {
              event.stopPropagation();
              if (Date.now() - touchHandledAt.current < 700) return;
              navigate(scene);
            }}
            onKeyDown={(event) => handleKeyDown(event, scene)}
            onPointerDown={isolate}
            type="button"
          >
            <span className={styles.rulerTick} aria-hidden="true" />
            <span className={styles.rulerMark}>{NAV_MARKS[scene - 1]}</span>
          </button>
        );
      })}
    </nav>
  );
}

function buildMetadata(language: Language): TopicMetadata {
  return {
    theme: language === "zh" ? "桥的位移" : "Bridge Movement",
    densityLabel: language === "zh" ? "图解 · 精确" : "Diagram Explainer · Precise",
    heroScene: 3,
    colors: {
      bg: "#f5f3ed",
      ink: "#101010",
      panel: "#e5e2da",
    },
    typography: {
      header: "Helvetica Neue 700",
      body: "Helvetica Neue 400",
    },
    tags: [
      "swiss",
      "grid",
      "bridge",
      "bearings",
      "structural-engineering",
      "diagram-explainer",
      "objective",
      "precise",
    ],
    fonts: ["Helvetica Neue", "cjk:PingFang SC"],
    scenes: SCENE_IDS.map((scene) => {
      const copy = COPY[language][scene];
      return {
        id: scene,
        title: copy.code,
        beats: copy.beats.map((beat, id) => ({
          id,
          action: beat.action,
          title: beat.title,
          body: beat.body,
        })),
      };
    }),
  };
}

const metadata = {
  en: buildMetadata("en"),
  zh: buildMetadata("zh"),
};

function TopicStage({
  scene,
  beat,
  language,
  isThumbnail,
  reducedMotion,
  onNavigate,
}: TopicStageProps) {
  const activeScene = clampScene(scene);
  const motionOff = reducedMotion || isThumbnail;
  const activeBeat = clampBeat(activeScene, beat, isThumbnail);
  const transitionMap = motionOff
    ? REDUCED_TRANSITION_SCORE
    : BRIDGE_MOVEMENT_TRANSITION_SCORE;

  return (
    <main
      className={[styles.root, motionOff ? styles.motionOff : ""].filter(Boolean).join(" ")}
      data-current-scene={activeScene}
      data-frozen={motionOff ? "true" : undefined}
      data-motion-state={motionOff ? "settled" : "measured"}
      data-style-id="objective-swiss-grid"
      data-topic-id="bridge-movement"
      lang={language}
    >
      <SpatialSceneTrack
        beat={activeBeat}
        beatLayoutModes={BEAT_LAYOUT_MODES}
        className={styles.sceneTrack}
        reducedMotion={motionOff}
        scene={activeScene}
        sceneIds={[...SCENE_IDS]}
        transitionDurationMs={680}
        transitionKind="dip-to-color"
        transitionMap={transitionMap}
        renderScene={(trackScene, trackBeat, isActive) => {
          const sceneId = clampScene(trackScene);
          return (
            <ScenePanel
              active={isActive}
              beat={clampBeat(sceneId, trackBeat, isThumbnail)}
              language={language}
              scene={sceneId}
            />
          );
        }}
      />
      {!isThumbnail && (
        <BearingRulerNavigation
          activeScene={activeScene}
          language={language}
          onNavigate={onNavigate}
        />
      )}
    </main>
  );
}

export default defineTopic({
  id: "bridge-movement",
  styleId: "objective-swiss-grid",
  title: {
    en: "Bridge Movement",
    zh: "桥的位移",
  },
  modelId: "GPT 5.6 Sol",
  Stage: TopicStage,
  metadata,
  navigation: {
    geometry: "edge-scale",
    carrier: "bearing-ruler",
    invocation: "persistent",
    feedback: "history-trail",
  },
  transitionScore: BRIDGE_MOVEMENT_TRANSITION_SCORE,
  evidence: {
    kind: "facts",
    sources: BRIDGE_MOVEMENT_SOURCES,
  },
});

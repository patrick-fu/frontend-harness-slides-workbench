import type React from "react";
import type {
  BespokeStyleProps,
  StyleMetadata,
  TopicSource,
  TopicTransitionScore,
} from "../types";
import SpatialSceneTrack from "./SpatialSceneTrack";
import type { BeatLayoutMode, SceneTransitionMap } from "./SpatialSceneTrack";
import { defineStyleTopic } from "./topic";
import styles from "./debug-reaction-board-acoustic-crack.module.css";

type Lang = "en" | "zh";
type SceneId = 1 | 2 | 3 | 4 | 5;

const ACOUSTIC_CRACK_CLAIM_IDS = [
  "baseline-window",
  "sensor-baseline",
  "active-energy-release",
  "arrival-time-location",
  "waveform-context",
  "localization-uncertainty",
  "noise-discrimination",
  "inspection-handoff",
] as const;
type AcousticCrackClaimId = (typeof ACOUSTIC_CRACK_CLAIM_IDS)[number];

const ACOUSTIC_CRACK_SOURCE_IDS = [
  "fhwa-ae",
  "fhwa-nde",
  "iso-12714",
  "nist-waveform",
  "tudelft-localization",
] as const;
type AcousticCrackSourceId = (typeof ACOUSTIC_CRACK_SOURCE_IDS)[number];
type ClaimIdList = readonly [
  AcousticCrackClaimId,
  ...AcousticCrackClaimId[],
];

interface AcousticCrackSource extends TopicSource {
  id: AcousticCrackSourceId;
  stamp: string;
  claimIds: readonly AcousticCrackClaimId[];
}

interface AcousticCrackClaim {
  id: AcousticCrackClaimId;
  statement: string;
  sourceIds: readonly AcousticCrackSourceId[];
}

interface SceneClaimMap {
  heading: ClaimIdList;
  state: ClaimIdList;
  visual: ClaimIdList;
  body: ClaimIdList;
  readout: ClaimIdList;
  boundary: ClaimIdList;
  beats: readonly ClaimIdList[];
}

interface BeatCopy {
  action: string;
  title: string;
  body: string;
}

interface SceneCopy {
  navLabel: string;
  code: string;
  state: string;
  stateTone: "clear" | "watch" | "review";
  title: string;
  subtitle: string;
  body: string;
  readoutLabel: string;
  readoutValue: string;
  boundary: string;
  beats: BeatCopy[];
}

const SCENE_IDS: SceneId[] = [1, 2, 3, 4, 5];

const BEAT_LAYOUT_MODES: Record<number, BeatLayoutMode> = {
  1: "reserved",
  2: "reserved",
  4: "reserved",
};

export const ACOUSTIC_CRACK_TRANSITION_SCORE = {
  "1->2": "scanline",
  "2->3": "focus-swap",
  "3->4": "dip-to-color",
  "4->5": "scanline",
} as const satisfies TopicTransitionScore;

export const ACOUSTIC_CRACK_SOURCES = [
  {
    id: "fhwa-ae",
    stamp: "FHWA/AE",
    claimIds: [
      "baseline-window",
      "sensor-baseline",
      "active-energy-release",
      "arrival-time-location",
      "localization-uncertainty",
      "noise-discrimination",
    ],
    authority: "Federal Highway Administration",
    title: "Bridge — Acoustic Emission (AE)",
    citation:
      "FHWA InfoTechnology, Bridge — Acoustic Emission (AE), accessed 10 July 2026",
    url: "https://infotechnology.fhwa.dot.gov/acoustic-emission-ae/",
    supports:
      "Supports the bridge application, transient elastic waves from evolving damage, surface-mounted sensors, arrival-time and wave-velocity source location, guard sensors, active-versus-arrested crack boundary, and the need to discriminate ambient noise.",
  },
  {
    id: "fhwa-nde",
    stamp: "FHWA/NDE",
    claimIds: [
      "baseline-window",
      "sensor-baseline",
      "active-energy-release",
      "localization-uncertainty",
      "noise-discrimination",
      "inspection-handoff",
    ],
    authority: "Federal Highway Administration",
    title:
      "Feasibility of Nondestructive Crack Detection and Monitoring for Steel Bridges",
    citation:
      "FHWA-HRT-12-060 (2012), Feasibility of Nondestructive Crack Detection and Monitoring for Steel Bridges",
    url: "https://www.fhwa.dot.gov/publications/research/nde/12060/index.cfm",
    supports:
      "Supports acoustic emission as rapid energy release in a transient elastic stress wave, the distinction between crack-growth monitoring and crack sizing, the requirement to combine AE with other NDE for quantitative defect information, and the field importance of signal discrimination and noise reduction.",
  },
  {
    id: "iso-12714",
    stamp: "ISO",
    claimIds: ["sensor-baseline", "waveform-context"],
    authority: "International Organization for Standardization",
    title:
      "ISO 12714:1999 — Secondary calibration of acoustic emission sensors",
    citation:
      "ISO 12714:1999, Non-destructive testing — Acoustic emission inspection — Secondary calibration of acoustic emission sensors",
    url: "https://www.iso.org/standard/2343.html",
    supports:
      "Supports treating acoustic-emission sensors as calibrated receivers of elastic waves at a solid surface and treating frequency response as an instrument property that must be established rather than assumed from a generic waveform icon.",
  },
  {
    id: "nist-waveform",
    stamp: "NIST",
    claimIds: ["active-energy-release", "waveform-context"],
    authority: "National Institute of Standards and Technology",
    title:
      "Using Acoustic Emission Waveform Characterization to Ascertain Where Cracks Originate in Concrete",
    citation:
      "Farnam, Geiker, Bentz & Weiss (2015), Cement and Concrete Composites 60, 135–145, doi:10.1016/j.cemconcomp.2015.04.008",
    url: "https://www.nist.gov/publications/using-acoustic-emission-waveform-characterization-ascertain-where-cracks-originate",
    supports:
      "Supports passive AE from cracking and microcracking while documenting that waveform properties depend on released energy, distance, source, orientation, and transfer medium; this bounds frequency display as contextual evidence, not a universal crack-type classifier.",
  },
  {
    id: "tudelft-localization",
    stamp: "TU/D",
    claimIds: [
      "arrival-time-location",
      "localization-uncertainty",
      "noise-discrimination",
    ],
    authority: "Delft University of Technology",
    title:
      "Evaluation of acoustic emission source localization accuracy in concrete structures",
    citation:
      "Zhang, Pahlavan & Yang (2020), Structural Health Monitoring 19(6), 2063–2074, doi:10.1177/1475921720915625",
    url: "https://repository.tudelft.nl/record/uuid:3f16f4bd-2c5f-4f12-ae5d-ad3c928b4e67",
    supports:
      "Supports the localization uncertainty boundary: cracks in the propagation path, arrival-time picking error, sensor layout, attenuation, material wave speed, and noise can all move an estimated source location and require calibration.",
  },
] as const satisfies readonly AcousticCrackSource[];

export const ACOUSTIC_CRACK_CLAIMS = {
  "baseline-window": {
    id: "baseline-window",
    statement:
      "A silent capture window reports no qualifying event, not proof that dormant damage is absent.",
    sourceIds: ["fhwa-ae", "fhwa-nde"],
  },
  "sensor-baseline": {
    id: "sensor-baseline",
    statement:
      "Sensor coupling, response calibration, and ambient-noise baselines bound whether a hit can be interpreted.",
    sourceIds: ["fhwa-ae", "fhwa-nde", "iso-12714"],
  },
  "active-energy-release": {
    id: "active-energy-release",
    statement:
      "Active cracking or microcracking can release a transient elastic wave recorded as one acoustic-emission event.",
    sourceIds: ["fhwa-ae", "fhwa-nde", "nist-waveform"],
  },
  "arrival-time-location": {
    id: "arrival-time-location",
    statement:
      "Relative arrival times, calibrated wave speed, and sensor geometry can estimate an event source location.",
    sourceIds: ["fhwa-ae", "tudelft-localization"],
  },
  "waveform-context": {
    id: "waveform-context",
    statement:
      "Waveform and frequency evidence depends on the source, path, material, coupling, and calibrated sensor response.",
    sourceIds: ["iso-12714", "nist-waveform"],
  },
  "localization-uncertainty": {
    id: "localization-uncertainty",
    statement:
      "Arrival picking, propagation paths, attenuation, layout, wave speed, and noise can move a location estimate.",
    sourceIds: ["fhwa-ae", "fhwa-nde", "tudelft-localization"],
  },
  "noise-discrimination": {
    id: "noise-discrimination",
    statement:
      "Ambient and guard-channel noise must remain distinguishable from event candidates during review.",
    sourceIds: ["fhwa-ae", "fhwa-nde", "tudelft-localization"],
  },
  "inspection-handoff": {
    id: "inspection-handoff",
    statement:
      "Acoustic-emission monitoring can prioritize inspection but does not by itself size or classify a defect.",
    sourceIds: ["fhwa-nde"],
  },
} as const satisfies Record<AcousticCrackClaimId, AcousticCrackClaim>;

export const ACOUSTIC_CRACK_SCENE_CLAIMS = {
  1: {
    heading: ["baseline-window"],
    state: ["baseline-window"],
    visual: ["sensor-baseline", "baseline-window"],
    body: ["baseline-window", "sensor-baseline"],
    readout: ["baseline-window"],
    boundary: ["baseline-window"],
    beats: [["baseline-window"], ["sensor-baseline"]],
  },
  2: {
    heading: ["active-energy-release"],
    state: ["active-energy-release"],
    visual: ["active-energy-release", "arrival-time-location"],
    body: ["active-energy-release", "arrival-time-location"],
    readout: ["active-energy-release"],
    boundary: ["active-energy-release", "inspection-handoff"],
    beats: [
      ["active-energy-release"],
      ["arrival-time-location"],
      ["arrival-time-location"],
      ["active-energy-release", "arrival-time-location"],
    ],
  },
  3: {
    heading: ["arrival-time-location", "waveform-context"],
    state: ["waveform-context"],
    visual: ["arrival-time-location", "waveform-context"],
    body: ["waveform-context"],
    readout: ["arrival-time-location"],
    boundary: ["waveform-context"],
    beats: [["arrival-time-location", "waveform-context"]],
  },
  4: {
    heading: ["arrival-time-location"],
    state: ["localization-uncertainty"],
    visual: [
      "arrival-time-location",
      "localization-uncertainty",
      "noise-discrimination",
    ],
    body: [
      "arrival-time-location",
      "localization-uncertainty",
      "noise-discrimination",
    ],
    readout: ["localization-uncertainty"],
    boundary: ["localization-uncertainty"],
    beats: [
      ["arrival-time-location"],
      ["arrival-time-location", "localization-uncertainty"],
      ["noise-discrimination"],
    ],
  },
  5: {
    heading: ["inspection-handoff"],
    state: ["inspection-handoff"],
    visual: ["inspection-handoff"],
    body: ["inspection-handoff"],
    readout: ["inspection-handoff"],
    boundary: [
      "baseline-window",
      "waveform-context",
      "inspection-handoff",
    ],
    beats: [["inspection-handoff"]],
  },
} as const satisfies Record<SceneId, SceneClaimMap>;

const SCENES: Record<SceneId, Record<Lang, SceneCopy>> = {
  1: {
    en: {
      navLabel: "Baseline",
      code: "AE.BASELINE",
      state: "CLEAR · NO HIT",
      stateTone: "clear",
      title: "Silent baseline, alarm stays off",
      subtitle: "A quiet window establishes noise before any event is interpreted.",
      body: "Three coupled sensors watch one loaded bridge member. No transient has crossed the event gate; that is a baseline observation, not proof that the member is undamaged.",
      readoutLabel: "capture window",
      readoutValue: "quiet · threshold not crossed",
      boundary:
        "A silent baseline means no qualifying event was captured in this window. Dormant damage can remain silent when it is not growing under load.",
      beats: [
        {
          action: "Establish the complete member and its ambient trace",
          title: "The member is quiet",
          body: "The trace records ambient structure-borne noise without declaring damage.",
        },
        {
          action: "Arm sensors A, B, and C while keeping the alert off",
          title: "The array is ready; the alarm stays off",
          body: "Coupling and baseline checks pass before an event is allowed onto the board.",
        },
      ],
    },
    zh: {
      navLabel: "基线",
      code: "AE.基线",
      state: "正常 · 无事件",
      stateTone: "clear",
      title: "静默基线，警报保持关闭",
      subtitle: "先建立噪声底，才谈事件解释。",
      body: "三个耦合传感器监测一段受载桥梁构件。当前没有瞬态信号越过事件门限；这只是基线观察，不等于构件无损伤。",
      readoutLabel: "采集窗口",
      readoutValue: "安静 · 未越过门限",
      boundary: "静默只表示当前窗口没有捕获合格事件。若损伤没有在受载时继续发展，休止裂纹可能保持无声。",
      beats: [
        {
          action: "呈现完整构件与环境基线",
          title: "构件处于安静状态",
          body: "轨迹先记录结构传播的环境噪声，不直接宣判损伤。",
        },
        {
          action: "开启 A、B、C 传感器，警报继续关闭",
          title: "阵列就绪，警报保持关闭",
          body: "耦合与基线检查通过后，事件才有资格进入诊断面板。",
        },
      ],
    },
  },
  2: {
    en: {
      navLabel: "Event",
      code: "AE.EVENT",
      state: "WATCH · ONE HIT",
      stateTone: "watch",
      title: "One transient event—not a continuous sound",
      subtitle: "A small active crack increment releases stored strain energy once.",
      body: "A short elastic wave packet leaves the source and reaches the surface sensors at different times. The board synchronizes the structural position and the captured pulse without turning it into a looping alarm.",
      readoutLabel: "event record",
      readoutValue: "single hit · time-stamped",
      boundary:
        "AE responds to active energy release. A recorded hit is evidence to review; it is not yet a crack-size or severity measurement.",
      beats: [
        {
          action: "Mark one active microcrack increment under load",
          title: "Stored energy releases",
          body: "The source is brief and local; no continuous audible tone is implied.",
        },
        {
          action: "Register the earliest arrival at sensor A",
          title: "Sensor A receives first",
          body: "The nearest usable path crosses its event gate before the others.",
        },
        {
          action: "Add the delayed arrival at sensor B",
          title: "The same event crosses a second gate",
          body: "The A-to-B delay begins the location evidence while sensor C remains pending.",
        },
        {
          action: "Register sensor C, then freeze the synchronized pulse and structure marker",
          title: "The full array captures one transient event",
          body: "After the latest arrival, the trace settles following one 150 ms capture accent; no alert loop remains active.",
        },
      ],
    },
    zh: {
      navLabel: "事件",
      code: "AE.事件",
      state: "关注 · 单次命中",
      stateTone: "watch",
      title: "一次瞬态事件，不是连续声音",
      subtitle: "一个活跃微裂纹增量短暂释放储存的应变能。",
      body: "短促弹性波包从源点出发，以不同时间抵达表面传感器。面板把构件位置与脉冲同步，但不会把它做成循环警报。",
      readoutLabel: "事件记录",
      readoutValue: "单次命中 · 已加时间戳",
      boundary: "声发射响应的是活跃能量释放。一次命中值得复核，但还不是裂纹尺寸或严重度测量。",
      beats: [
        {
          action: "标记受载时一次活跃微裂纹增量",
          title: "储存能量被释放",
          body: "源点短暂且局部，不代表持续可听声。",
        },
        {
          action: "记录传感器 A 的最早到时",
          title: "传感器 A 先接收",
          body: "最近的可用路径先越过事件门限。",
        },
        {
          action: "加入传感器 B 的延迟到时",
          title: "同一事件越过第二个门限",
          body: "A 到 B 的延迟开始形成定位证据，传感器 C 此时仍在等待。",
        },
        {
          action: "记录传感器 C，再冻结同步脉冲与结构标记",
          title: "整个阵列捕获一次瞬态事件",
          body: "最晚到时出现后，150 毫秒捕获强调结束，轨迹稳定且不保留循环警报。",
        },
      ],
    },
  },
  3: {
    en: {
      navLabel: "Arrivals",
      code: "AE.TOA",
      state: "REVIEW · TIMING",
      stateTone: "review",
      title: "Read arrival order before waveform character",
      subtitle: "A, B, and C describe one event—not continuous audio.",
      body: "The static traces preserve relative onset times. Frequency content can help inside a calibrated material-and-sensor setup, but there is no fixed crack-type lookup that transfers safely to every structure.",
      readoutLabel: "arrival order",
      readoutValue: "tA < tB < tC · illustrative",
      boundary:
        "Coupling, path length, attenuation, orientation, material heterogeneity, and sensor response all shape the recorded signal.",
      beats: [
        {
          action: "Compare the three settled onset markers",
          title: "Arrival time is evidence with calibration attached",
          body: "Keep timing, frequency context, and uncertainty visible as separate fields.",
        },
      ],
    },
    zh: {
      navLabel: "到时",
      code: "AE.到时",
      state: "复核 · 时序",
      stateTone: "review",
      title: "先读到达顺序，再看波形特征",
      subtitle: "A、B、C 描述同一次事件，而非连续音频。",
      body: "静态轨迹保留相对起始时刻。频率内容只能在已校准的材料与传感器设置内辅助解释；不存在可以安全套用到所有结构的固定裂纹类型查表。",
      readoutLabel: "到达顺序",
      readoutValue: "tA < tB < tC · 示意",
      boundary: "耦合、路径长度、衰减、源方向、材料非均质性与传感器响应都会改变记录到的信号。",
      beats: [
        {
          action: "比较三条稳定轨迹的起始标记",
          title: "到时证据必须附带校准条件",
          body: "把时序、频率语境与不确定性拆成独立字段。",
        },
      ],
    },
  },
  4: {
    en: {
      navLabel: "Locate",
      code: "AE.LOCATE",
      state: "REVIEW · CANDIDATE ZONE",
      stateTone: "review",
      title: "Triangulation narrows a candidate source zone",
      subtitle: "An event cluster can prioritize a place without erasing competing signals.",
      body: "Arrival-time differences and an assumed, calibrated wave speed produce a location estimate. Repeated nearby events form a cluster; a guard-channel noise candidate stays attached to the record instead of disappearing.",
      readoutLabel: "location output",
      readoutValue: "candidate zone · uncertainty retained",
      boundary:
        "Cracks in the propagation path, onset picking, sensor layout, attenuation, and noise can move the estimate. The overlay is not a severity map.",
      beats: [
        {
          action: "Draw arrival-distance constraints from sensors A, B, and C",
          title: "Three timing constraints enter",
          body: "The model uses calibrated wave speed and relative onset time.",
        },
        {
          action: "Resolve the overlap into a bounded source estimate",
          title: "A candidate source zone appears",
          body: "The zone is intentionally wider than a perfect mathematical point.",
        },
        {
          action: "Overlay repeated events and retain the guard-channel outlier",
          title: "Cluster kept; noise candidate retained",
          body: "Uncertain signals remain visible for review instead of being silently deleted.",
        },
      ],
    },
    zh: {
      navLabel: "定位",
      code: "AE.定位",
      state: "复核 · 候选区域",
      stateTone: "review",
      title: "三角定位缩小候选源区",
      subtitle: "事件簇可以提高某处的检查优先级，但不能抹掉竞争信号。",
      body: "到时差与经过校准的假设波速共同给出位置估计。多次邻近事件形成事件簇；守卫通道上的噪声候选仍附在记录中，不会凭空消失。",
      readoutLabel: "定位输出",
      readoutValue: "候选区域 · 保留不确定性",
      boundary: "传播路径中的裂纹、起始点拾取、传感器布局、衰减与噪声都会移动估计。覆盖图不是严重度地图。",
      beats: [
        {
          action: "从 A、B、C 传感器绘制到时距离约束",
          title: "三个时序约束进入模型",
          body: "模型使用经校准的波速与相对起始时刻。",
        },
        {
          action: "把重叠约束解析为有边界的源区估计",
          title: "候选源区出现",
          body: "区域故意比理想数学点更宽，承认定位误差。",
        },
        {
          action: "叠加重复事件，并保留守卫通道异常值",
          title: "保留事件簇，也保留噪声候选",
          body: "不确定信号继续可见，供人工复核，而不是被静默删除。",
        },
      ],
    },
  },
  5: {
    en: {
      navLabel: "Inspect",
      code: "AE.HANDOFF",
      state: "HANDOFF · VERIFY",
      stateTone: "watch",
      title: "Where to inspect next—not a severity verdict",
      subtitle: "Acoustic evidence routes attention; engineering inspection closes the loop.",
      body: "Review the candidate zone under a known load window, inspect the physical member, and verify with another NDE method before sizing or classifying a defect.",
      readoutLabel: "diagnostic outcome",
      readoutValue: "inspection priority · no auto diagnosis",
      boundary:
        "Dormant cracks may stay silent. Event count, amplitude, frequency, or waveform shape alone does not establish crack type, size, or structural severity.",
      beats: [
        {
          action: "Handoff a bounded inspection target with its uncertainty",
          title: "Verify with another NDE method",
          body: "Keep the load history, raw traces, excluded noise candidates, and calibration record with the inspection request.",
        },
      ],
    },
    zh: {
      navLabel: "检查",
      code: "AE.交接",
      state: "交接 · 需验证",
      stateTone: "watch",
      title: "下一步去哪里检查，而非自动判定严重度",
      subtitle: "声学证据负责引导注意力，工程检查负责闭环。",
      body: "在已知受载窗口下复核候选区域，检查实体构件，并用另一种无损检测方法验证后，才能给缺陷定尺寸或分类。",
      readoutLabel: "诊断输出",
      readoutValue: "检查优先级 · 不自动诊断",
      boundary: "休止裂纹可能保持无声。事件数、幅值、频率或波形形状本身都不能确定裂纹类型、尺寸或结构严重度。",
      beats: [
        {
          action: "把带有不确定性的检查目标交给工程复核",
          title: "使用另一种无损检测方法验证",
          body: "检查请求应同时保留荷载历史、原始轨迹、噪声候选与校准记录。",
        },
      ],
    },
  },
};

function normalizeScene(scene: number): SceneId {
  return SCENE_IDS.includes(scene as SceneId) ? (scene as SceneId) : 1;
}

function clampBeat(beat: number, lastBeat: number): number {
  if (!Number.isFinite(beat)) return 0;
  return Math.max(0, Math.min(Math.floor(beat), lastBeat));
}

function getCopy(scene: SceneId, language: Lang): SceneCopy {
  return SCENES[scene][language];
}

function getVisibleClaimIds(scene: SceneId): AcousticCrackClaimId[] {
  const claims = ACOUSTIC_CRACK_SCENE_CLAIMS[scene];
  return [
    ...new Set<AcousticCrackClaimId>([
      ...claims.heading,
      ...claims.state,
      ...claims.visual,
      ...claims.body,
      ...claims.readout,
      ...claims.boundary,
      ...claims.beats.flat(),
    ]),
  ];
}

function getSourceIds(
  claimIds: readonly AcousticCrackClaimId[],
): AcousticCrackSourceId[] {
  const requiredSourceIds = new Set<AcousticCrackSourceId>();
  for (const claimId of claimIds) {
    for (const sourceId of ACOUSTIC_CRACK_CLAIMS[claimId].sourceIds) {
      requiredSourceIds.add(sourceId);
    }
  }
  return ACOUSTIC_CRACK_SOURCES.filter((source) =>
    requiredSourceIds.has(source.id),
  ).map((source) => source.id);
}

function getSourceStamp(sourceIds: readonly AcousticCrackSourceId[]): string {
  return sourceIds
    .map(
      (sourceId) =>
        ACOUSTIC_CRACK_SOURCES.find((source) => source.id === sourceId)?.stamp ??
        sourceId,
    )
    .join(" · ");
}

export function getMetadata(language: Lang): StyleMetadata {
  return {
    id: "debug-reaction-board",
    band: "balanced-hybrid",
    name:
      language === "zh" ? "调试反应面板" : "Debug Reaction Board",
    theme:
      language === "zh"
        ? "听裂缝——把声发射事件定位为检查线索，而非自动诊断"
        : "Listening for a Crack — acoustic-emission location as an inspection lead, not an automatic diagnosis",
    densityLabel: language === "zh" ? "诊断图解" : "Diagnostic Diagram",
    heroScene: 4,
    colors: {
      bg: "#071015",
      ink: "#dff8f4",
      panel: "#0c1b22",
    },
    typography: {
      header: "JetBrains Mono 700",
      body: "Noto Sans SC 400",
    },
    tags: [
      "debug",
      "acoustic-emission",
      "bridge",
      "nondestructive-testing",
      "evidence",
      "localization",
      "dark",
      "technical",
    ],
    fonts: ["JetBrains Mono", "cjk:Noto Sans SC"],
    scenes: SCENE_IDS.map((scene) => {
      const copy = getCopy(scene, language);
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

export const ACOUSTIC_SENSOR_POSITIONS = [
  { id: "A", x: 245, y: 188 },
  { id: "B", x: 520, y: 188 },
  { id: "C", x: 790, y: 188 },
] as const;

export const ACOUSTIC_EVENT_SOURCE_POSITION = { x: 304, y: 288 } as const;

export const ACOUSTIC_ARRIVAL_ORDER = [...ACOUSTIC_SENSOR_POSITIONS]
  .sort((left, right) => {
    const leftDistance =
      (left.x - ACOUSTIC_EVENT_SOURCE_POSITION.x) ** 2 +
      (left.y - ACOUSTIC_EVENT_SOURCE_POSITION.y) ** 2;
    const rightDistance =
      (right.x - ACOUSTIC_EVENT_SOURCE_POSITION.x) ** 2 +
      (right.y - ACOUSTIC_EVENT_SOURCE_POSITION.y) ** 2;
    return leftDistance - rightDistance;
  })
  .map((sensor) => sensor.id);

function BridgeMember({
  language,
  sensorsArmed,
}: {
  language: Lang;
  sensorsArmed: boolean;
}) {
  return (
    <g className={styles.memberAssembly} data-sensors-armed={sensorsArmed ? "true" : "false"}>
      <path className={styles.deckSlab} d="M82 112 H918 V172 H82 Z" />
      <path className={styles.girder} d="M128 172 H872 V398 H128 Z" />
      <path className={styles.girderVoid} d="M178 226 H822 V344 H178 Z" />
      <path className={styles.stiffener} d="M224 172 V398 M500 172 V398 M776 172 V398" />
      <path className={styles.bearing} d="M148 398 H248 L226 442 H170 Z M752 398 H852 L830 442 H774 Z" />
      {ACOUSTIC_SENSOR_POSITIONS.map((sensor) => (
        <g
          key={sensor.id}
          className={styles.sensor}
          data-sensor-id={sensor.id}
          transform={`translate(${sensor.x} ${sensor.y})`}
        >
          <path className={styles.sensorLead} d="M0 0 V-52" />
          <rect className={styles.sensorBody} x="-26" y="-8" width="52" height="28" rx="7" />
          <circle className={styles.sensorLamp} cx="0" cy="6" r="7" />
          <text className={styles.sensorLabel} x="0" y="-64" textAnchor="middle">
            {language === "zh" ? `传感器 ${sensor.id}` : `SENSOR ${sensor.id}`}
          </text>
        </g>
      ))}
      <text className={styles.memberLabel} x="500" y="492" textAnchor="middle">
        {language === "zh" ? "受载桥梁构件 · 原创结构示意" : "LOADED BRIDGE MEMBER · ORIGINAL STRUCTURAL SCHEMATIC"}
      </text>
    </g>
  );
}

function BaselineDiagram({
  beat,
  language,
}: {
  beat: number;
  language: Lang;
}) {
  return (
    <svg
      className={styles.diagram}
      viewBox="0 0 1000 560"
      role="img"
      aria-label={
        language === "zh"
          ? "三个声发射传感器监测桥梁构件的静默基线"
          : "Three acoustic-emission sensors monitoring a silent bridge-member baseline"
      }
    >
      <BridgeMember language={language} sensorsArmed={beat >= 1} />
      <g className={styles.baselineTrace} data-baseline-state={beat >= 1 ? "armed" : "sampling"}>
        <path className={styles.traceRail} d="M104 518 H896" />
        <path
          className={styles.quietTrace}
          d="M104 518 L146 516 L188 520 L230 517 L272 519 L314 516 L356 521 L398 518 L440 517 L482 520 L524 516 L566 519 L608 518 L650 521 L692 516 L734 519 L776 517 L818 520 L860 517 L896 518"
        />
        <text className={styles.traceLabel} x="104" y="548">
          {language === "zh" ? "环境基线 / 未越门限" : "AMBIENT BASELINE / BELOW EVENT GATE"}
        </text>
      </g>
      <g className={styles.alertOff} data-alert-state="off" transform="translate(858 58)">
        <circle cx="0" cy="0" r="20" />
        <path d="M-9 -9 L9 9 M9 -9 L-9 9" />
        <text x="-34" y="5" textAnchor="end">
          {language === "zh" ? "红色警报关闭" : "RED ALARM OFF"}
        </text>
      </g>
    </svg>
  );
}

function EventDiagram({
  beat,
  language,
}: {
  beat: number;
  language: Lang;
}) {
  const eventState =
    beat >= 3
      ? "captured-once"
      : beat >= 1
        ? "propagating"
        : "energy-release";

  return (
    <svg
      className={styles.diagram}
      viewBox="0 0 1000 560"
      role="img"
      aria-label={
        language === "zh"
          ? "一次微裂纹事件的弹性波依次抵达三个传感器"
          : "One microcrack event sending an elastic wave to three sensors in sequence"
      }
      data-event-state={eventState}
    >
      <BridgeMember language={language} sensorsArmed />
      <g
        className={styles.crackSource}
        data-source-state="active"
        transform={`translate(${ACOUSTIC_EVENT_SOURCE_POSITION.x - 4} ${ACOUSTIC_EVENT_SOURCE_POSITION.y - 2})`}
      >
        <path d="M0 -30 L-12 -6 L6 8 L-8 36 L18 12 L8 -2 L22 -24" />
        <circle
          className={styles.eventFlash}
          data-active={beat >= 1 ? "true" : "false"}
          cx="4"
          cy="2"
          r="38"
        />
        <text x="4" y="74" textAnchor="middle">
          {language === "zh" ? "单次能量释放" : "ONE ENERGY RELEASE"}
        </text>
      </g>
      {[82, 146, 214].map((radius, index) => (
        <circle
          key={radius}
          className={styles.waveRing}
          data-wave-visible={beat >= index + 1 ? "true" : "false"}
          cx={ACOUSTIC_EVENT_SOURCE_POSITION.x}
          cy={ACOUSTIC_EVENT_SOURCE_POSITION.y}
          r={radius}
        />
      ))}
      {ACOUSTIC_SENSOR_POSITIONS.map((sensor) => {
        const arrivalIndex = ACOUSTIC_ARRIVAL_ORDER.indexOf(sensor.id);
        const arrived = beat >= arrivalIndex + 1;
        return (
          <g
            key={sensor.id}
            className={styles.arrivalMarker}
            data-sensor-arrival="true"
            data-sensor-id={sensor.id}
            data-arrived={arrived ? "true" : "false"}
            transform={`translate(${sensor.x} 132)`}
          >
            <path d="M0 0 V28" />
            <circle cx="0" cy="0" r="12" />
            <text x="0" y="-20" textAnchor="middle">
              {arrived ? `t${sensor.id}` : "—"}
            </text>
          </g>
        );
      })}
      <g className={styles.eventTrace} data-trace-captured={beat >= 3 ? "true" : "false"}>
        <path className={styles.traceRail} d="M96 512 H904" />
        <path
          className={styles.eventWaveform}
          d="M96 512 H302 L314 508 L324 520 L334 486 L346 544 L358 470 L370 536 L382 494 L394 520 L406 506 L422 512 H904"
        />
        <path className={styles.captureCursor} d="M346 466 V550" />
        <text className={styles.traceLabel} x="96" y="548">
          {language === "zh" ? "一次瞬态事件 / 时间戳已冻结" : "ONE TRANSIENT EVENT / TIMESTAMP FROZEN"}
        </text>
      </g>
    </svg>
  );
}

const TRACE_PATHS = [
  "M0 34 H188 L198 32 L208 40 L220 18 L232 52 L244 12 L256 46 L268 24 L282 38 L296 34 H720",
  "M0 34 H280 L290 31 L300 43 L312 16 L324 54 L336 13 L348 47 L360 26 L374 39 L388 34 H720",
  "M0 34 H392 L402 31 L412 42 L424 18 L436 52 L448 14 L460 46 L472 25 L486 39 L500 34 H720",
] as const;

function ArrivalBoard({ language }: { language: Lang }) {
  const contexts =
    language === "zh"
      ? ["最早到时", "中间到时", "最晚到时"]
      : ["earliest onset", "middle onset", "latest onset"];
  const rows = ACOUSTIC_ARRIVAL_ORDER.map((sensor, index) => ({
    sensor,
    time: `t${sensor}`,
    context: contexts[index],
  }));

  return (
    <div
      className={styles.arrivalBoard}
      data-arrival-order={ACOUSTIC_ARRIVAL_ORDER.join("-")}
    >
      <div className={styles.arrivalHeader}>
        <span>{language === "zh" ? "静态事件轨迹" : "STATIC EVENT TRACES"}</span>
        <b>{language === "zh" ? "同一事件 · 三个接收位置" : "ONE EVENT · THREE RECEIVERS"}</b>
      </div>
      <div className={styles.arrivalRows}>
        {rows.map((row, index) => (
          <div key={row.sensor} className={styles.arrivalRow} data-arrival-trace="true">
            <div className={styles.arrivalIdentity}>
              <strong>{row.sensor}</strong>
              <span>{row.context}</span>
            </div>
            <svg viewBox="0 0 720 68" aria-hidden="true">
              <path className={styles.arrivalRail} d="M0 34 H720" />
              <path className={styles.arrivalWave} d={TRACE_PATHS[index]} />
              <path
                className={styles.onsetCursor}
                d={`M${[198, 290, 402][index]} 4 V64`}
              />
            </svg>
            <div className={styles.arrivalTime}>
              <strong>{row.time}</strong>
              <span>{language === "zh" ? "相对时刻" : "relative time"}</span>
            </div>
          </div>
        ))}
      </div>
      <div className={styles.frequencyBoundary}>
        <span>{language === "zh" ? "频率字段" : "FREQUENCY FIELD"}</span>
        <p>
          {language === "zh"
            ? "只在已校准的材料、路径、耦合与传感器响应内比较；不做固定裂纹类型查表。"
            : "Compare only inside a calibrated material, path, coupling, and sensor response; no fixed crack-type lookup."}
        </p>
      </div>
    </div>
  );
}

const EVENT_CLUSTERS = [
  { x: 474, y: 284, tone: "primary" },
  { x: 490, y: 300, tone: "primary" },
  { x: 456, y: 312, tone: "primary" },
  { x: 512, y: 274, tone: "primary" },
] as const;

function LocalizationBoard({
  beat,
  language,
}: {
  beat: number;
  language: Lang;
}) {
  return (
    <svg
      className={styles.diagram}
      viewBox="0 0 1000 560"
      role="img"
      aria-label={
        language === "zh"
          ? "三个传感器的到时约束形成候选源区，并保留噪声候选"
          : "Three sensor timing constraints forming a candidate source zone while retaining a noise candidate"
      }
    >
      <path className={styles.mapMember} d="M92 84 H908 V468 H92 Z" />
      <path className={styles.mapVoid} d="M144 142 H856 V410 H144 Z" />
      <path className={styles.mapGrid} d="M144 208 H856 M144 274 H856 M144 340 H856 M286 142 V410 M428 142 V410 M570 142 V410 M712 142 V410" />
      {[
        { id: "A", x: 204, y: 178, radius: 304 },
        { id: "B", x: 790, y: 184, radius: 334 },
        { id: "C", x: 500, y: 392, radius: 128 },
      ].map((sensor) => (
        <g key={sensor.id} className={styles.mapSensor} data-constraint-active={beat >= 0 ? "true" : "false"}>
          <circle cx={sensor.x} cy={sensor.y} r="22" />
          <text x={sensor.x} y={sensor.y + 7} textAnchor="middle">
            {sensor.id}
          </text>
          <circle
            className={styles.locationConstraint}
            data-constraint-visible={beat >= 0 ? "true" : "false"}
            cx={sensor.x}
            cy={sensor.y}
            r={sensor.radius}
          />
        </g>
      ))}
      <ellipse
        className={styles.candidateZone}
        data-zone-visible={beat >= 1 ? "true" : "false"}
        cx="486"
        cy="294"
        rx="84"
        ry="62"
      />
      {EVENT_CLUSTERS.map((point, index) => (
        <circle
          key={`${point.x}-${point.y}`}
          className={styles.clusterPoint}
          data-event-cluster="true"
          data-cluster-visible={beat >= 2 ? "true" : "false"}
          data-cluster-tone={point.tone}
          cx={point.x}
          cy={point.y}
          r={index === 0 ? 13 : 9}
        />
      ))}
      <g
        className={styles.noiseCandidate}
        data-noise-candidate="retained"
        data-noise-visible={beat >= 2 ? "true" : "false"}
        transform="translate(812 356)"
      >
        <path d="M-18 -18 L18 18 M18 -18 L-18 18" />
        <circle cx="0" cy="0" r="28" />
        <text x="-38" y="6" textAnchor="end">
          {language === "zh" ? "噪声候选 · 保留" : "NOISE CANDIDATE · RETAINED"}
        </text>
      </g>
      <g className={styles.zoneLabel} data-zone-visible={beat >= 1 ? "true" : "false"}>
        <path d="M548 250 L636 196 H812" />
        <text x="812" y="184" textAnchor="end">
          {language === "zh" ? "候选源区 · 非严重度地图" : "CANDIDATE SOURCE ZONE · NOT A SEVERITY MAP"}
        </text>
      </g>
      <text className={styles.mapCaption} x="116" y="520">
        {language === "zh" ? "到时差 + 校准波速 + 传感器几何" : "ARRIVAL DIFFERENCES + CALIBRATED WAVE SPEED + SENSOR GEOMETRY"}
      </text>
    </svg>
  );
}

function HandoffBoard({ language }: { language: Lang }) {
  const checks =
    language === "zh"
      ? [
          {
            state: "优先",
            title: "去候选区域检查",
            body: "把事件簇与构件位置、荷载窗口对齐。",
          },
          {
            state: "验证",
            title: "使用另一种无损检测方法验证",
            body: "裂纹尺寸与类型需要独立方法补证。",
          },
          {
            state: "边界",
            title: "休止裂纹可能保持无声",
            body: "没有事件不等于没有既有损伤。",
          },
        ]
      : [
          {
            state: "PRIORITIZE",
            title: "Inspect the candidate zone",
            body: "Align the event cluster with member position and load window.",
          },
          {
            state: "VERIFY",
            title: "Verify with another NDE method",
            body: "Defect size and type need independent evidence.",
          },
          {
            state: "BOUNDARY",
            title: "Dormant cracks may stay silent",
            body: "No event does not mean no pre-existing damage.",
          },
        ];

  return (
    <div className={styles.handoffBoard} data-handoff-state="inspection-only">
      <div className={styles.handoffMap} aria-hidden="true">
        <svg viewBox="0 0 560 420">
          <path className={styles.handoffMember} d="M54 82 H506 V338 H54 Z" />
          <path className={styles.handoffVoid} d="M96 132 H464 V292 H96 Z" />
          <ellipse className={styles.handoffZone} cx="274" cy="220" rx="74" ry="58" />
          <path className={styles.handoffPointer} d="M326 178 L422 104" />
          <path className={styles.handoffBracket} d="M396 90 H492 V160" />
          <text className={styles.handoffLabel} x="492" y="78" textAnchor="end">
            {language === "zh" ? "检查区域" : "INSPECTION ZONE"}
          </text>
          <text className={styles.handoffSubLabel} x="492" y="102" textAnchor="end">
            {language === "zh" ? "不是严重度判定" : "NOT A SEVERITY VERDICT"}
          </text>
        </svg>
      </div>
      <div className={styles.handoffChecks}>
        {checks.map((check, index) => (
          <div key={check.state} className={styles.handoffCheck} data-check-index={index}>
            <span>{check.state}</span>
            <div>
              <strong>{check.title}</strong>
              <p>{check.body}</p>
            </div>
          </div>
        ))}
      </div>
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
  language: Lang;
}) {
  switch (scene) {
    case 1:
      return <BaselineDiagram beat={beat} language={language} />;
    case 2:
      return <EventDiagram beat={beat} language={language} />;
    case 3:
      return <ArrivalBoard language={language} />;
    case 4:
      return <LocalizationBoard beat={beat} language={language} />;
    case 5:
      return <HandoffBoard language={language} />;
  }
}

function ScenePanel({
  scene,
  beat,
  language,
  isThumbnail,
  isActive,
}: {
  scene: SceneId;
  beat: number;
  language: Lang;
  isThumbnail: boolean;
  isActive: boolean;
}) {
  const copy = getCopy(scene, language);
  const activeBeat = isThumbnail
    ? copy.beats.length - 1
    : clampBeat(beat, copy.beats.length - 1);
  const beatCopy = copy.beats[activeBeat];
  const claimMap = ACOUSTIC_CRACK_SCENE_CLAIMS[scene];
  const beatClaimIds = claimMap.beats[activeBeat] ?? claimMap.beats[0];
  const visibleClaimIds = getVisibleClaimIds(scene);
  const sourceIds = getSourceIds(visibleClaimIds);

  return (
    <section
      className={styles.scene}
      data-scene={scene}
      data-active-beat={activeBeat}
      data-panel-active={isActive ? "true" : "false"}
      data-reading-state="settled"
      data-visible-claim-ids={visibleClaimIds.join(" ")}
      data-source-ids={sourceIds.join(" ")}
    >
      <div className={styles.sceneShell}>
        <header className={styles.sceneHeader} data-beat-layout-item="true">
          <div className={styles.commandPath}>
            <span>{copy.code}</span>
            <b>{language === "zh" ? "结构声发射 / 证据板" : "STRUCTURAL AE / EVIDENCE BOARD"}</b>
          </div>
          <div
            className={styles.headingBlock}
            data-claim-field="heading"
            data-claim-ids={claimMap.heading.join(" ")}
          >
            <p>{copy.subtitle}</p>
            <h1>{copy.title}</h1>
          </div>
          <div
            className={styles.stateBadge}
            data-state-tone={copy.stateTone}
            data-claim-field="state"
            data-claim-ids={claimMap.state.join(" ")}
          >
            <span>{language === "zh" ? "诊断状态" : "DIAGNOSTIC STATE"}</span>
            <strong>{copy.state}</strong>
          </div>
        </header>

        <main className={styles.workspace} data-beat-layout-item="true">
          <div
            className={styles.visualPanel}
            data-beat-layout-item="true"
            data-claim-field="visual"
            data-claim-ids={claimMap.visual.join(" ")}
          >
            <div className={styles.panelChrome} aria-hidden="true">
              <span />
              <span />
              <span />
              <b>{language === "zh" ? "结构 / 波形同步视图" : "STRUCTURE / TRACE SYNC"}</b>
            </div>
            <SceneVisual scene={scene} beat={activeBeat} language={language} />
          </div>

          <aside className={styles.diagnosticPanel} data-beat-layout-item="true">
            <div
              className={styles.explanation}
              data-claim-field="body"
              data-claim-ids={claimMap.body.join(" ")}
            >
              <span>{language === "zh" ? "解释" : "INTERPRETATION"}</span>
              <p>{copy.body}</p>
            </div>
            <div
              className={styles.readout}
              data-claim-field="readout"
              data-claim-ids={claimMap.readout.join(" ")}
            >
              <span>{copy.readoutLabel}</span>
              <strong>{copy.readoutValue}</strong>
            </div>
            <div className={styles.beatLedger} data-beat-layout-item="true">
              {copy.beats.map((item, index) => (
                <span
                  key={item.title}
                  data-ledger-state={
                    index === activeBeat
                      ? "active"
                      : index < activeBeat
                        ? "logged"
                        : "queued"
                  }
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
              ))}
            </div>
            <div
              className={styles.beatReadout}
              data-beat-layout-item="true"
              data-claim-field="beat"
              data-claim-ids={beatClaimIds.join(" ")}
            >
              <span>{beatCopy.action}</span>
              <strong>{beatCopy.title}</strong>
              <p>{beatCopy.body}</p>
            </div>
          </aside>
        </main>

        <footer
          className={styles.evidenceBoundary}
          data-beat-layout-item="true"
          data-claim-field="boundary"
          data-claim-ids={claimMap.boundary.join(" ")}
        >
          <div>
            <span>{language === "zh" ? "解释边界" : "INTERPRETATION BOUNDARY"}</span>
            <b data-source-stamp="true" data-source-ids={sourceIds.join(" ")}>
              {getSourceStamp(sourceIds)}
            </b>
          </div>
          <p>{copy.boundary}</p>
        </footer>
      </div>
    </section>
  );
}

function AcousticTraceRuler({
  scene,
  language,
  onNavigate,
}: {
  scene: SceneId;
  language: Lang;
  onNavigate?: (scene: number, beat: number) => void;
}) {
  const navigate = (target: number) => {
    onNavigate?.(Math.max(1, Math.min(5, target)), 0);
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLButtonElement>,
    current: number,
  ) => {
    event.stopPropagation();
    if (event.repeat) return;

    let target: number | null = null;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      target = Math.min(5, current + 1);
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      target = Math.max(1, current - 1);
    } else if (event.key === "Home") {
      target = 1;
    } else if (event.key === "End") {
      target = 5;
    }

    if (target !== null) {
      event.preventDefault();
      navigate(target);
    }
  };

  const stop = (event: React.SyntheticEvent) => event.stopPropagation();

  return (
    <nav
      className={styles.traceRuler}
      aria-label={
        language === "zh" ? "声发射轨迹标尺导航" : "Acoustic trace ruler navigation"
      }
      data-topic-navigation="true"
      data-navigation-geometry="edge-scale"
      data-navigation-carrier="acoustic-trace-ruler"
      data-navigation-invocation="proximity-reveal"
      data-navigation-feedback="mechanical-displacement"
      style={{ ["--trace-index" as string]: scene - 1 }}
      onTouchStartCapture={stop}
      onTouchEndCapture={stop}
      onPointerDown={stop}
      onPointerUp={stop}
      onTouchStart={stop}
      onTouchEnd={stop}
      onClick={stop}
      onKeyDown={stop}
      onKeyUp={stop}
    >
      <div className={styles.rulerRail} aria-hidden="true">
        <span className={styles.rulerCursor} />
      </div>
      <div className={styles.rulerButtons}>
        {SCENE_IDS.map((target) => {
          const copy = getCopy(target, language);
          const active = target === scene;
          return (
            <button
              key={target}
              type="button"
              data-nav-state={active ? "active" : target < scene ? "logged" : "queued"}
              aria-current={active ? "step" : undefined}
              aria-label={`Open acoustic trace scene ${target}`}
              onPointerDown={stop}
              onClick={(event) => {
                event.stopPropagation();
                navigate(target);
              }}
              onKeyDown={(event) => handleKeyDown(event, target)}
              onKeyUp={stop}
            >
              <span aria-hidden="true" />
              <b>{copy.navLabel}</b>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

export default function AcousticCrack({
  scene,
  beat,
  language,
  isThumbnail,
  reducedMotion,
  onNavigate,
}: BespokeStyleProps) {
  const activeScene = normalizeScene(scene);
  const motionDisabled = reducedMotion || isThumbnail;

  return (
    <div
      className={styles.root}
      data-topic-id="acoustic-crack"
      data-language={language}
      data-thumbnail={isThumbnail ? "true" : "false"}
      data-motion={motionDisabled ? "off" : "on"}
      data-frame-state="settled"
    >
      <div className={styles.envelopeMark} aria-hidden="true">
        <span>AE_MONITOR::BRIDGE_MEMBER</span>
        <b>EVENT ≠ VERDICT</b>
      </div>
      <SpatialSceneTrack
        scene={activeScene}
        beat={beat}
        sceneIds={[...SCENE_IDS]}
        transitionKind="scanline"
        transitionMap={ACOUSTIC_CRACK_TRANSITION_SCORE as SceneTransitionMap}
        transitionDurationMs={680}
        reducedMotion={motionDisabled}
        beatLayoutModes={BEAT_LAYOUT_MODES}
        className={styles.track}
        renderScene={(sceneId, sceneBeat, isActive) => (
          <ScenePanel
            scene={normalizeScene(sceneId)}
            beat={sceneBeat}
            language={language}
            isThumbnail={isThumbnail}
            isActive={isActive}
          />
        )}
      />
      {!isThumbnail ? (
        <AcousticTraceRuler
          scene={activeScene}
          language={language}
          onNavigate={onNavigate}
        />
      ) : null}
    </div>
  );
}

export const acousticCrackTopic = defineStyleTopic({
  id: "acoustic-crack",
  topic: {
    en: "Acoustic Crack",
    zh: "听裂缝",
  },
  model: "GPT-5.5",
  component: AcousticCrack,
  getMetadata,
  navigation: {
    geometry: "edge-scale",
    carrier: "acoustic-trace-ruler",
    invocation: "proximity-reveal",
    feedback: "mechanical-displacement",
  },
  sources: ACOUSTIC_CRACK_SOURCES,
  transitionScore: ACOUSTIC_CRACK_TRANSITION_SCORE,
});

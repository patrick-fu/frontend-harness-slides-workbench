import { useEffect } from "react";
import type {
  CSSProperties,
  KeyboardEvent,
  MouseEvent,
  PointerEvent,
} from "react";
import type {
  BespokeStyleProps,
  SceneMetadata,
  StyleMetadata,
  TopicSource,
  TopicTransitionScore,
} from "../types";
import SpatialSceneTrack, {
  type BeatLayoutMode,
  type SceneTransitionMap,
  type SceneTransitionModifierMap,
} from "./SpatialSceneTrack";
import { defineStyleTopic } from "./topic";
import styles from "./35-voyager-boundary.module.css";

type Language = "en" | "zh";
type SceneId = 1 | 2 | 3 | 4 | 5;
type CssVars = CSSProperties & Record<`--${string}`, string | number>;

interface SceneCopy {
  eyebrow: string;
  title: string;
  body: string;
  note: string;
  source: string;
  beats: SceneMetadata["beats"];
}

const SCENE_IDS: SceneId[] = [1, 2, 3, 4, 5];

export const VOYAGER_BOUNDARY_TRANSITION_SCORE = {
  "1->2": "hard-cut",
  "2->3": "scanline",
  "3->4": "glitch",
  "4->5": "push-x",
} as const satisfies Readonly<TopicTransitionScore>;

const TRANSITION_MAP: SceneTransitionMap =
  VOYAGER_BOUNDARY_TRANSITION_SCORE;

const TRANSITION_MODIFIER_MAP: SceneTransitionModifierMap = {
  "3->4": "voyager-boundary",
};

const BEAT_LAYOUT_MODES: Record<SceneId, BeatLayoutMode> = {
  1: "reserved",
  2: "reserved",
  3: "reserved",
  4: "reserved",
  5: "reserved",
};

export const VOYAGER_BOUNDARY_SOURCES = [
  {
    authority: "NASA Science / Jet Propulsion Laboratory",
    title: "Voyager Interstellar Mission",
    url: "https://science.nasa.gov/mission/voyager/interstellar-mission/",
    supports:
      "Termination-shock and heliopause crossing dates, the heliosheath sequence, Voyager 1's missing direct plasma measurement, and Voyager 2's direct plasma confirmation.",
  },
  {
    authority: "NASA Science / Jet Propulsion Laboratory",
    title: "Where Are Voyager 1 and Voyager 2 Now?",
    url: "https://science.nasa.gov/mission/voyager/where-are-voyager-1-and-voyager-2-now/",
    supports:
      "The instrument roster shown in Scene 5, explicitly timestamped to NASA's April 17, 2026 status update.",
  },
  {
    authority: "NASA Science / Jet Propulsion Laboratory",
    title: "Oort Cloud and Scale of the Solar System",
    url: "https://science.nasa.gov/resource/oort-cloud-and-scale-of-the-solar-system-infographic/",
    supports:
      "The heliopause marks the outer solar-wind boundary, while a common Solar System definition extends to the much more distant Oort Cloud; crossing the heliopause does not mean solar gravity has a finite endpoint there.",
  },
  {
    authority: "NASA Science / Jet Propulsion Laboratory",
    title: "Voyager 1 Mission",
    url: "https://science.nasa.gov/mission/voyager/voyager-1/",
    supports:
      "Voyager 1's launch, Jupiter and Saturn route, termination-shock passage, and 2012 entry into interstellar space.",
  },
  {
    authority: "NASA Science / Jet Propulsion Laboratory",
    title: "Voyager 2 Mission",
    url: "https://science.nasa.gov/mission/voyager/voyager-2/",
    supports:
      "Voyager 2's distinct route past all four giant planets before its later interstellar mission.",
  },
] as const satisfies readonly TopicSource[];

const COPY: Record<Language, Record<SceneId, SceneCopy>> = {
  en: {
    1: {
      eyebrow: "VOYAGER INTERSTELLAR MISSION / BOOT",
      title: "Two probes. One moving boundary.",
      body:
        "Launched in 1977, Voyager 1 and 2 now report from beyond the heliosphere—the bubble made by the solar wind.",
      note: "MISSION CLOCK · 1977 → INTERSTELLAR",
      source: "NASA/JPL · Voyager Interstellar Mission",
      beats: [
        {
          id: 0,
          action: "Open the mission clock and a minimal heliosphere map",
          title: "The desktop wakes at the edge",
          body: "Two trajectories leave the planetary plane on different headings.",
        },
      ],
    },
    2: {
      eyebrow: "TRAJECTORY WINDOW / TWO FLIGHT PATHS",
      title: "The twins did not take the same road.",
      body:
        "Voyager 1 turned outward after Saturn. Voyager 2 continued past Uranus and Neptune before heading below the planetary plane.",
      note: "WINDOW POSITION FOLLOWS FLIGHT DIRECTION",
      source: "NASA/JPL · Voyager 1 + Voyager 2 mission histories",
      beats: [
        {
          id: 0,
          action: "Trace launch, Jupiter, and Saturn encounters",
          title: "Both cross the giant-planet corridor",
          body: "The routes share Jupiter and Saturn, then diverge.",
        },
        {
          id: 1,
          action: "Extend Voyager 2 to Uranus and Neptune",
          title: "Voyager 2 completes the Grand Tour",
          body: "Its route bends through Uranus in 1986 and Neptune in 1989.",
        },
        {
          id: 2,
          action: "Mark the two heliopause crossings",
          title: "Different directions, different crossing years",
          body: "Voyager 1 crossed in 2012; Voyager 2 crossed in 2018.",
        },
      ],
    },
    3: {
      eyebrow: "EVIDENCE DESKTOP / INSTRUMENT AGREEMENT",
      title: "A boundary is a pattern across instruments.",
      body:
        "Particles, magnetic field, plasma waves, and direct plasma measurements did not supply identical evidence on both spacecraft.",
      note: "MISSING DATA IS PART OF THE RESULT",
      source: "NASA/JPL · Interstellar Mission · Instruments",
      beats: [
        {
          id: 0,
          action: "Inspect Voyager 1's indirect plasma confirmation",
          title: "Voyager 1 · 2012-08-25",
          body: "Particle changes came first; plasma-wave density later confirmed the crossing without a working PLS measurement.",
        },
        {
          id: 1,
          action: "Inspect Voyager 2's direct plasma confirmation",
          title: "Voyager 2 · 2018-11-05",
          body: "Its particle instruments and Plasma Science instrument observed the boundary directly.",
        },
      ],
    },
    4: {
      eyebrow: "BOUNDARY EVENT / SIGNATURE TELEMETRY",
      title: "The solar-wind bubble ends here.",
      body:
        "At the heliopause, heliospheric particle counts fall while galactic cosmic rays and denser interstellar plasma identify a new environment.",
      note: "HELIOPAUSE ≠ THE SUN'S GRAVITATIONAL LIMIT",
      source: "NASA/JPL · Voyager Interstellar Mission",
      beats: [
        {
          id: 0,
          action: "Hold the spacecraft inside the heliosheath",
          title: "HELIOSHEATH",
          body: "The slowed solar wind still occupies the outer heliosphere.",
        },
        {
          id: 1,
          action: "Approach the heliopause and turn over particle signals",
          title: "BOUNDARY APPROACH",
          body: "Heliospheric particles decrease while galactic cosmic rays increase.",
        },
        {
          id: 2,
          action: "Sweep the CRT once across the highlighted heliopause",
          title: "HELIOPAUSE CROSSING",
          body: "The instrument pattern changes sides of the solar-wind boundary.",
        },
        {
          id: 3,
          action: "Settle on interstellar telemetry",
          title: "INTERSTELLAR MEDIUM",
          body: "The probes continue through interstellar plasma while the Sun's gravity reaches much farther.",
        },
      ],
    },
    5: {
      eyebrow: "QUIET DESKTOP / DATED STATUS",
      title: "Interstellar space ≠ beyond the Sun’s gravity",
      body:
        "The heliopause ends the solar-wind bubble. A broader Solar System definition reaches to the distant Oort Cloud.",
      note: "STATUS SNAPSHOT · 2026-04-17",
      source: "NASA/JPL · Mission status + Oort Cloud scale",
      beats: [
        {
          id: 0,
          action: "Leave only the boundary definition and current instrument roster",
          title: "Two definitions, one ongoing mission",
          body: "Both Voyagers still communicate from interstellar space with a shrinking set of powered instruments.",
        },
      ],
    },
  },
  zh: {
    1: {
      eyebrow: "旅行者号星际任务 / 启动",
      title: "两艘探测器，一道不断变化的边界",
      body: "旅行者 1 号与 2 号于 1977 年发射，如今都在日球层之外回传数据。日球层是太阳风塑造的气泡。",
      note: "任务时钟 · 1977 → 星际空间",
      source: "NASA/JPL · 旅行者号星际任务",
      beats: [
        {
          id: 0,
          action: "打开任务时钟与极简日球层地图",
          title: "桌面在边界处唤醒",
          body: "两条轨迹沿不同方向离开行星平面。",
        },
      ],
    },
    2: {
      eyebrow: "轨迹窗口 / 两条飞行路径",
      title: "这对孪生探测器没有走同一条路",
      body: "旅行者 1 号飞掠土星后转向外侧；旅行者 2 号继续飞掠天王星与海王星，再向行星平面下方远去。",
      note: "窗口位置跟随空间方向",
      source: "NASA/JPL · 旅行者 1 号与 2 号任务史",
      beats: [
        {
          id: 0,
          action: "绘制发射、木星与土星飞掠",
          title: "两者都穿过巨行星走廊",
          body: "它们共享木星和土星路段，之后分岔。",
        },
        {
          id: 1,
          action: "将旅行者 2 号轨迹延伸至天王星与海王星",
          title: "旅行者 2 号完成大巡游",
          body: "轨迹依次经过 1986 年的天王星与 1989 年的海王星。",
        },
        {
          id: 2,
          action: "标出两次日球层顶穿越",
          title: "方向不同，穿越年份也不同",
          body: "旅行者 1 号于 2012 年穿越；旅行者 2 号于 2018 年穿越。",
        },
      ],
    },
    3: {
      eyebrow: "证据桌面 / 仪器交叉判断",
      title: "边界是一组跨仪器出现的模式",
      body: "粒子、磁场、等离子体波，以及直接等离子体测量，在两艘探测器上提供的证据并不完全相同。",
      note: "缺测状态也是结论的一部分",
      source: "NASA/JPL · 星际任务 · 仪器状态",
      beats: [
        {
          id: 0,
          action: "检查旅行者 1 号的间接等离子体确认",
          title: "旅行者 1 号 · 2012-08-25",
          body: "粒子信号先改变；在没有可用 PLS 测量时，等离子体波推得的密度随后确认穿越。",
        },
        {
          id: 1,
          action: "检查旅行者 2 号的直接等离子体确认",
          title: "旅行者 2 号 · 2018-11-05",
          body: "粒子仪器与等离子体科学仪器直接记录了这道边界。",
        },
      ],
    },
    4: {
      eyebrow: "边界事件 / 标志性遥测",
      title: "太阳风气泡在这里结束",
      body: "在日球层顶，日球层粒子计数下降；银河宇宙线与更高密度的星际等离子体标识出新的环境。",
      note: "日球层顶 ≠ 太阳引力的终点",
      source: "NASA/JPL · 旅行者号星际任务",
      beats: [
        {
          id: 0,
          action: "让探测器停在日鞘内",
          title: "日鞘",
          body: "减速后的太阳风仍位于日球层外部。",
        },
        {
          id: 1,
          action: "接近日球层顶并翻转粒子信号",
          title: "接近边界",
          body: "日球层粒子减少，银河宇宙线增加。",
        },
        {
          id: 2,
          action: "让 CRT 扫描线只越过高亮边界一次",
          title: "穿越日球层顶",
          body: "仪器组合信号切换到太阳风边界的另一侧。",
        },
        {
          id: 3,
          action: "稳定在星际遥测终态",
          title: "星际介质",
          body: "探测器继续穿行于星际等离子体，而太阳引力的范围远得多。",
        },
      ],
    },
    5: {
      eyebrow: "安静桌面 / 带日期的状态",
      title: "进入星际空间 ≠ 飞出太阳引力范围",
      body: "日球层顶终结太阳风气泡；更广义的太阳系定义会延伸到遥远的奥尔特云。",
      note: "状态快照 · 2026-04-17",
      source: "NASA/JPL · 任务状态 + 奥尔特云尺度",
      beats: [
        {
          id: 0,
          action: "仅保留边界定义与当前仪器清单",
          title: "两种定义，一项仍在继续的任务",
          body: "两艘旅行者号都在星际空间保持通信，但仍供电的仪器正在减少。",
        },
      ],
    },
  },
};

const UI = {
  en: {
    task: "VOYAGER TELEMETRY",
    clock: "MISSION CLOCK",
    clockValue: "ELAPSED · 48+ YEARS",
    map: "HELIOPAUSE MAP",
    solarWind: "SOLAR WIND",
    interstellar: "INTERSTELLAR",
    v1: "VOYAGER 1",
    v2: "VOYAGER 2",
    giantPlanets: ["JUPITER · 1979", "SATURN · 1980/81", "URANUS · 1986", "NEPTUNE · 1989"],
    routeState: ["GIANT PLANETS", "GRAND TOUR", "INTERSTELLAR CROSSINGS"],
    before: "BEFORE · HELIOSHEATH",
    after: "AFTER · INTERSTELLAR",
    boundary: "HELIOPAUSE",
    nav: ["boot", "trajectory", "evidence", "heliopause", "status"],
    definition: "BOUNDARY DEFINITION",
    status: "MISSION STATUS",
    oort: "Oort Cloud · commonly treated as the Solar System’s distant reservoir",
  },
  zh: {
    task: "旅行者号遥测",
    clock: "任务时钟",
    clockValue: "已飞行 · 48+ 年",
    map: "日球层顶地图",
    solarWind: "太阳风",
    interstellar: "星际空间",
    v1: "旅行者 1 号",
    v2: "旅行者 2 号",
    giantPlanets: ["木星 · 1979", "土星 · 1980/81", "天王星 · 1986", "海王星 · 1989"],
    routeState: ["巨行星走廊", "大巡游", "星际空间穿越"],
    before: "之前 · 日鞘",
    after: "之后 · 星际空间",
    boundary: "日球层顶",
    nav: ["启动", "轨迹", "证据", "日球层顶", "状态"],
    definition: "边界定义",
    status: "任务状态",
    oort: "奥尔特云 · 通常被视为太阳系遥远的天体储库",
  },
} as const;

function useFonts() {
  useEffect(() => {
    const id = "voyager-boundary-fonts";
    if (document.getElementById(id)) return;

    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600;700&family=Noto+Sans+SC:wght@400;500;600;700&display=swap";
    document.head.appendChild(link);
  }, []);
}

function toSceneId(scene: number): SceneId {
  return SCENE_IDS.includes(scene as SceneId) ? (scene as SceneId) : 1;
}

function clampBeat(scene: SceneId, beat: number, language: Language): number {
  const lastBeat = COPY[language][scene].beats.length - 1;
  return Math.max(0, Math.min(Math.trunc(beat), lastBeat));
}

function WindowFrame({
  title,
  className = "",
  children,
  active = true,
}: {
  title: string;
  className?: string;
  children: React.ReactNode;
  active?: boolean;
}) {
  return (
    <section
      className={[styles.window, className, active ? styles.windowActive : ""]
        .filter(Boolean)
        .join(" ")}
      data-window-active={active ? "true" : "false"}
      data-beat-layout-item="true"
    >
      <div className={styles.titlebar}>
        <span>{title}</span>
        <span className={styles.windowControls} aria-hidden="true">
          <i>_</i><i>□</i><i>×</i>
        </span>
      </div>
      <div className={styles.windowBody}>{children}</div>
    </section>
  );
}

function ProbeGlyph({ label, compact = false }: { label: string; compact?: boolean }) {
  return (
    <span className={[styles.probe, compact ? styles.probeCompact : ""].join(" ")}>
      <span className={styles.probeDish} aria-hidden="true" />
      <span className={styles.probeBus} aria-hidden="true" />
      <span className={styles.probeBoom} aria-hidden="true" />
      <b>{label}</b>
    </span>
  );
}

function Header({ copy, beat }: { copy: SceneCopy; beat: number }) {
  return (
    <header className={styles.header} data-beat-layout-item="true">
      <p className={styles.eyebrow}>{copy.eyebrow}</p>
      <h1>{copy.title}</h1>
      <p className={styles.body}>{copy.body}</p>
      <div className={styles.beatReadout}>
        <span>{String(beat + 1).padStart(2, "0")}</span>
        <strong>{copy.beats[beat].title}</strong>
      </div>
    </header>
  );
}

function BootScene({ language, copy }: { language: Language; copy: SceneCopy }) {
  const ui = UI[language];
  return (
    <>
      <Header copy={copy} beat={0} />
      <div className={styles.bootDesktop} data-beat-layout-item="true">
        <WindowFrame title={ui.clock} className={styles.clockWindow}>
          <div className={styles.clockValue}>1977</div>
          <div className={styles.clockTrack}><span /></div>
          <div className={styles.clockValue}>2026</div>
          <p>{ui.clockValue}</p>
        </WindowFrame>
        <WindowFrame title={ui.map} className={styles.bootMapWindow}>
          <div className={styles.miniHeliosphere} role="img" aria-label={ui.map}>
            <span className={styles.sun} />
            <span className={styles.helioBubble} />
            <span className={styles.boundaryArc} />
            <span className={styles.bootRouteOne} />
            <span className={styles.bootRouteTwo} />
            <ProbeGlyph label="V1" compact />
            <ProbeGlyph label="V2" compact />
            <small className={styles.solarLabel}>{ui.solarWind}</small>
            <small className={styles.interstellarLabel}>{ui.interstellar}</small>
          </div>
        </WindowFrame>
      </div>
    </>
  );
}

function TrajectoryScene({
  language,
  copy,
  beat,
}: {
  language: Language;
  copy: SceneCopy;
  beat: number;
}) {
  const ui = UI[language];
  const progress = [34, 70, 100][beat];
  const routeStyle = { "--route-progress": `${100 - progress}` } as CssVars;
  const planets = [
    { x: 21, y: 29, labelX: 17, labelY: 25, visibleAt: 0 },
    { x: 31, y: 32, labelX: 27, labelY: 38, visibleAt: 0 },
    { x: 42, y: 41, labelX: 37, labelY: 47, visibleAt: 1 },
    { x: 55, y: 39, labelX: 50, labelY: 35, visibleAt: 1 },
  ];

  return (
    <>
      <Header copy={copy} beat={beat} />
      <WindowFrame title="TRAJECTORY.MAP" className={styles.trajectoryWindow}>
        <div className={styles.routeLegend}>
          <b>{ui.routeState[beat]}</b>
          <span>V1 ━</span>
          <span>V2 ━</span>
        </div>
        <svg
          className={styles.trajectoryMap}
          viewBox="0 0 100 64"
          role="img"
          aria-label={copy.beats[beat].body}
        >
          <circle className={styles.mapSun} cx="13" cy="31" r="4" />
          {planets.map((planet, index) => (
            <g key={planet.x} data-visible={beat >= planet.visibleAt ? "true" : "false"}>
              <circle className={styles.planetOrbit} cx="13" cy="31" r={8 + index * 5} />
              <circle className={styles.planetDot} cx={planet.x} cy={planet.y} r="1.3" />
              <text className={styles.planetLabel} fontSize="1.55" x={planet.labelX} y={planet.labelY}>
                {ui.giantPlanets[index]}
              </text>
            </g>
          ))}
          <path className={styles.routeBase} d="M13 31 C20 29 25 30 31 32 C46 24 54 17 65 20 C74 22 81 14 91 8" />
          <path
            className={styles.routeV1}
            style={routeStyle}
            pathLength="100"
            d="M13 31 C20 29 25 30 31 32 C46 24 54 17 65 20 C74 22 81 14 91 8"
          />
          <path className={styles.routeBase} d="M13 31 C20 29 25 30 31 32 C38 39 46 43 56 39 C72 32 79 43 91 55" />
          <path
            className={styles.routeV2}
            style={routeStyle}
            pathLength="100"
            d="M13 31 C20 29 25 30 31 32 C38 39 46 43 56 39 C72 32 79 43 91 55"
          />
          <line className={styles.mapBoundary} x1="83" y1="2" x2="83" y2="62" />
          <text className={styles.boundaryLabel} fontSize="1.35" x="75" y="61">HELIOPAUSE</text>
          <g data-visible={beat >= 2 ? "true" : "false"}>
            <circle className={styles.crossingDot} cx="84" cy="13" r="2" />
            <text className={styles.crossingLabel} fontSize="1.6" x="76" y="7">V1 · 2012</text>
            <circle className={styles.crossingDot} cx="85" cy="49" r="2" />
            <text className={styles.crossingLabel} fontSize="1.6" x="76" y="57">V2 · 2018</text>
          </g>
        </svg>
      </WindowFrame>
    </>
  );
}

const EVIDENCE = {
  en: {
    v1: {
      title: "Voyager 1 · 2012-08-25",
      rows: [
        ["PARTICLES", "HELIOSPHERIC ↓ / COSMIC ↑", "ok"],
        ["MAG", "FIELD · ON", "info"],
        ["PLS", "NO DIRECT PLASMA", "missing"],
        ["PWS", "DENSITY INFERENCE", "ok"],
      ],
      foot: "PWS plasma-density oscillations supplied the later confirmation.",
    },
    v2: {
      title: "Voyager 2 · 2018-11-05",
      rows: [
        ["PARTICLES", "HELIOSPHERIC ↓ / COSMIC ↑", "ok"],
        ["MAG", "FIELD · ON", "info"],
        ["PLS", "DIRECT PLASMA", "ok"],
        ["PWS", "PLASMA WAVES · ON", "info"],
      ],
      foot: "Particle instruments and PLS directly confirmed the crossing.",
    },
  },
  zh: {
    v1: {
      title: "Voyager 1 · 2012-08-25",
      rows: [
        ["粒子", "日球层粒子 ↓ / 宇宙线 ↑", "ok"],
        ["磁强计", "磁场 · 工作中", "info"],
        ["PLS", "无直接等离子体数据", "missing"],
        ["PWS", "密度间接推断", "ok"],
      ],
      foot: "PWS 测得的等离子体密度振荡随后提供确认。",
    },
    v2: {
      title: "Voyager 2 · 2018-11-05",
      rows: [
        ["粒子", "日球层粒子 ↓ / 宇宙线 ↑", "ok"],
        ["磁强计", "磁场 · 工作中", "info"],
        ["PLS", "直接等离子体数据", "ok"],
        ["PWS", "等离子体波 · 工作中", "info"],
      ],
      foot: "粒子仪器与 PLS 直接确认穿越。",
    },
  },
} as const;

function EvidenceWindow({
  title,
  rows,
  foot,
  active,
}: {
  title: string;
  rows: readonly (readonly string[])[];
  foot: string;
  active: boolean;
}) {
  return (
    <WindowFrame title={title} className={styles.evidenceWindow} active={active}>
      <div className={styles.telemetryRows}>
        {rows.map(([instrument, value, tone]) => (
          <div key={instrument} className={styles.telemetryRow} data-tone={tone}>
            <b>{instrument}</b>
            <span>{value}</span>
          </div>
        ))}
      </div>
      <p className={styles.evidenceFoot}>{foot}</p>
    </WindowFrame>
  );
}

function EvidenceScene({
  language,
  copy,
  beat,
}: {
  language: Language;
  copy: SceneCopy;
  beat: number;
}) {
  const evidence = EVIDENCE[language];
  return (
    <>
      <Header copy={copy} beat={beat} />
      <div className={styles.evidenceDesktop} data-beat-layout-item="true">
        <EvidenceWindow {...evidence.v1} active={beat === 0} />
        <div className={styles.evidenceLink} aria-hidden="true">
          <span>PARTICLES</span><i /><span>PLASMA</span>
        </div>
        <EvidenceWindow {...evidence.v2} active={beat === 1} />
      </div>
    </>
  );
}

function SignalReadout({ beat, language }: { beat: number; language: Language }) {
  const states = [
    ["HIGH", "LOW", "SOLAR-WIND PLASMA"],
    ["FALLING", "RISING", "BOUNDARY MIX"],
    ["LOW", "HIGH", "DENSITY JUMP"],
    ["LOW", "HIGH", "INTERSTELLAR PLASMA"],
  ] as const;
  const state = states[beat];
  const labels = language === "zh"
    ? ["日球层粒子", "银河宇宙线", "等离子体环境"]
    : ["heliospheric particles", "galactic cosmic rays", "plasma environment"];

  return (
    <div className={styles.signalReadout} data-beat-layout-item="true">
      {labels.map((label, index) => (
        <div className={styles.signalLine} key={label} data-signal-index={index}>
          <span>{label}{index === 0 ? " ↓" : index === 1 ? " ↑" : ""}</span>
          <i><b style={{ width: `${index === 0 ? 84 - beat * 20 : index === 1 ? 24 + beat * 20 : 40 + beat * 14}%` }} /></i>
          <strong>{state[index]}</strong>
        </div>
      ))}
    </div>
  );
}

function BoundaryMap({
  language,
  beat,
  motionOff,
}: {
  language: Language;
  beat: number;
  motionOff: boolean;
}) {
  const ui = UI[language];

  if (motionOff) {
    return (
      <div className={styles.reducedBoundary} data-beat-layout-item="true">
        <div className={styles.reducedFrame} data-reduced-boundary-frame="true">
          <span>{ui.before}</span>
          <ProbeGlyph label="V" compact />
          <div className={styles.reducedSignal}>{language === "zh" ? "太阳风粒子 · 高" : "solar-wind particles · HIGH"}</div>
        </div>
        <div className={styles.reducedDivider} data-boundary-highlight="true">
          <b>{ui.boundary}</b>
        </div>
        <div className={styles.reducedFrame} data-reduced-boundary-frame="true">
          <span>{ui.after}</span>
          <ProbeGlyph label="V" compact />
          <div className={styles.reducedSignal}>{language === "zh" ? "银河宇宙线 · 高" : "galactic cosmic rays · HIGH"}</div>
        </div>
      </div>
    );
  }

  const probePositions = ["27%", "43%", "58%", "74%"];
  const mapStyle = { "--probe-x": probePositions[beat] } as CssVars;

  return (
    <div className={styles.boundaryMap} style={mapStyle} data-beat-layout-item="true">
      <div className={styles.heliosheathField}>
        <span>{language === "zh" ? "日鞘 / 减速太阳风" : "HELIOSHEATH / SLOWED SOLAR WIND"}</span>
      </div>
      <div className={styles.interstellarField}>
        <span>{language === "zh" ? "星际介质" : "INTERSTELLAR MEDIUM"}</span>
      </div>
      <div
        className={styles.heliopauseLine}
        data-boundary-highlight={beat >= 2 ? "true" : "false"}
      >
        <b>{ui.boundary}</b>
      </div>
      <div className={styles.starField} aria-hidden="true">
        {Array.from({ length: 28 }, (_, index) => (
          <i
            key={index}
            style={{
              left: `${6 + ((index * 17) % 89)}%`,
              top: `${7 + ((index * 29) % 83)}%`,
            }}
          />
        ))}
      </div>
      <div className={styles.movingProbe}>
        <ProbeGlyph label={beat < 2 ? "V1" : "V"} />
      </div>
      {beat >= 2 && <span className={styles.crtScan} data-crt-scan="once" />}
      <SignalReadout beat={beat} language={language} />
    </div>
  );
}

function BoundaryScene({
  language,
  copy,
  beat,
  motionOff,
}: {
  language: Language;
  copy: SceneCopy;
  beat: number;
  motionOff: boolean;
}) {
  return (
    <>
      <Header copy={copy} beat={beat} />
      <WindowFrame title="BOUNDARY.CRT" className={styles.boundaryWindow}>
        <BoundaryMap language={language} beat={beat} motionOff={motionOff} />
      </WindowFrame>
    </>
  );
}

function StatusScene({ language, copy }: { language: Language; copy: SceneCopy }) {
  const ui = UI[language];
  return (
    <>
      <Header copy={copy} beat={0} />
      <div className={styles.statusDesktop} data-beat-layout-item="true">
        <WindowFrame title={ui.definition} className={styles.definitionWindow}>
          <div className={styles.definitionDiagram}>
            <small>{language === "zh" ? "定义示意 · 非距离比例" : "DEFINITION VIEW · NOT TO SCALE"}</small>
            <span className={styles.definitionSun}>{language === "zh" ? "太阳" : "SUN"}</span>
            <span className={styles.definitionHelio}>{language === "zh" ? "日球层顶" : "HELIOPAUSE"}</span>
            <span className={styles.definitionOort}>{language === "zh" ? "奥尔特云" : "OORT CLOUD"}</span>
          </div>
          <strong>{copy.title}</strong>
          <p>{ui.oort}</p>
        </WindowFrame>
        <WindowFrame title={ui.status} className={styles.statusWindow}>
          <div className={styles.snapshot}>STATUS SNAPSHOT · 2026-04-17</div>
          <div className={styles.probeStatus}>
            <b>V1 · MAG + PWS ON</b>
            <span>CRS OFF · LECP OFF · PLS OFF</span>
          </div>
          <div className={styles.probeStatus}>
            <b>V2 · CRS + MAG + PWS ON</b>
            <span>LECP OFF · PLS OFF</span>
          </div>
          <small>{language === "zh" ? "状态随电力管理变化；此处固定标注日期。" : "Power management changes the roster; this view is explicitly dated."}</small>
        </WindowFrame>
      </div>
    </>
  );
}

function ScenePanel({
  scene,
  beat,
  language,
  motionOff,
}: {
  scene: SceneId;
  beat: number;
  language: Language;
  motionOff: boolean;
}) {
  const safeBeat = clampBeat(scene, beat, language);
  const copy = COPY[language][scene];

  return (
    <article
      className={[styles.scene, styles[`scene${scene}`]].join(" ")}
      data-scene-content={scene}
      data-beat={safeBeat}
      data-beat-layout-container="true"
      data-beat-layout-mode="reserved"
    >
      {scene === 1 && <BootScene language={language} copy={copy} />}
      {scene === 2 && (
        <TrajectoryScene language={language} copy={copy} beat={safeBeat} />
      )}
      {scene === 3 && (
        <EvidenceScene language={language} copy={copy} beat={safeBeat} />
      )}
      {scene === 4 && (
        <BoundaryScene
          language={language}
          copy={copy}
          beat={safeBeat}
          motionOff={motionOff}
        />
      )}
      {scene === 5 && <StatusScene language={language} copy={copy} />}
      <footer className={styles.sceneFooter} data-beat-layout-item="true">
        <span>{copy.note}</span>
        <span>{copy.source}</span>
      </footer>
    </article>
  );
}

function TelemetryNav({
  scene,
  language,
  onNavigate,
}: {
  scene: SceneId;
  language: Language;
  onNavigate?: (scene: number, beat: number) => void;
}) {
  const labels = UI[language].nav;

  const navigateFromKey = (event: KeyboardEvent<HTMLButtonElement>) => {
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
      event.stopPropagation();
      onNavigate?.(target, 0);
    }
  };

  const stopPointer = (event: PointerEvent<HTMLButtonElement>) => {
    event.stopPropagation();
  };

  const navigateFromClick = (
    event: MouseEvent<HTMLButtonElement>,
    target: SceneId,
  ) => {
    event.stopPropagation();
    onNavigate?.(target, 0);
  };

  return (
    <nav
      className={styles.telemetryNav}
      data-topic-navigation="true"
      data-navigation-geometry="path"
      data-navigation-carrier="telemetry-trail"
      data-navigation-invocation="keyboard-focus"
      data-navigation-feedback="active-glow"
      aria-label={language === "zh" ? "旅行者号五段遥测路径" : "Five-stop Voyager telemetry trail"}
    >
      <svg className={styles.navTrail} viewBox="0 0 100 12" preserveAspectRatio="none" aria-hidden="true">
        <path d="M3 8 C18 8 20 3 35 3 S53 9 67 7 S83 2 97 4" />
      </svg>
      {SCENE_IDS.map((target, index) => {
        const active = target === scene;
        return (
          <button
            key={target}
            type="button"
            className={active ? styles.navActive : ""}
            data-nav-scene={target}
            aria-current={active ? "step" : undefined}
            aria-label={language === "zh" ? `跳转到场景 ${target}：${labels[index]}` : `Jump to scene ${target}: ${labels[index]}`}
            onPointerDown={stopPointer}
            onClick={(event) => navigateFromClick(event, target)}
            onKeyDown={navigateFromKey}
          >
            <span>{String(target).padStart(2, "0")}</span>
            <b>{labels[index]}</b>
          </button>
        );
      })}
    </nav>
  );
}

export function getMetadata(language: Language): StyleMetadata {
  const scenes = SCENE_IDS.map((scene) => {
    const copy = COPY[language][scene];
    return {
      id: scene,
      title: copy.beats[0].title,
      beats: copy.beats.map((beat) => ({ ...beat })),
    };
  });

  return {
    id: "retro-windows",
    band: "contemporary-digital",
    name: language === "zh" ? "复古 Windows" : "Retro Windows",
    theme: language === "zh" ? "旅行者号穿越日球层边界" : "Voyager at the Heliopause",
    densityLabel: language === "zh" ? "视觉叙事" : "Visual Narrative",
    heroScene: 4,
    colors: {
      bg: "#123f47",
      ink: "#10151c",
      panel: "#c7c8c3",
    },
    typography: {
      header: "IBM Plex Mono 700",
      body: "IBM Plex Mono 500",
    },
    tags: [
      "retro-windows",
      "telemetry",
      "voyager",
      "space-science",
      "crt",
      "path",
      "visual-narrative",
      "instrument-data",
      "high-motion",
      "bilingual",
    ],
    fonts: ["IBM Plex Mono", "cjk:Noto Sans SC"],
    scenes,
  };
}

export default function VoyagerBoundary({
  scene,
  beat,
  language,
  isThumbnail,
  reducedMotion,
  onNavigate,
}: BespokeStyleProps) {
  useFonts();
  const safeScene = toSceneId(scene);
  const motionOff = reducedMotion || isThumbnail;

  return (
    <div
      className={[styles.root, motionOff ? styles.motionOff : ""]
        .filter(Boolean)
        .join(" ")}
      lang={language === "zh" ? "zh-CN" : "en"}
      data-topic-id="voyager-boundary"
      data-motion={motionOff ? "off" : "on"}
    >
      <div className={styles.desktopNoise} aria-hidden="true" />
      <SpatialSceneTrack
        className={styles.sceneTrack}
        scene={safeScene}
        beat={beat}
        transitionKind="hard-cut"
        transitionMap={TRANSITION_MAP}
        transitionModifierMap={TRANSITION_MODIFIER_MAP}
        transitionDurationMs={650}
        reducedMotion={motionOff}
        beatLayoutModes={BEAT_LAYOUT_MODES}
        renderScene={(sceneId, sceneBeat) => (
          <ScenePanel
            scene={toSceneId(sceneId)}
            beat={sceneBeat}
            language={language}
            motionOff={motionOff}
          />
        )}
      />
      {!isThumbnail && (
        <TelemetryNav
          scene={safeScene}
          language={language}
          onNavigate={onNavigate}
        />
      )}
      <div className={styles.taskbar} aria-hidden="true">
        <b>▣</b><span>{UI[language].task}</span><i>DSN · LINK</i>
      </div>
    </div>
  );
}

export const voyagerBoundaryTopic = defineStyleTopic({
  id: "voyager-boundary",
  topic: { en: "Voyager Boundary", zh: "日球层边界" },
  model: "GPT 5.6 Sol",
  component: VoyagerBoundary,
  getMetadata,
  navigation: {
    geometry: "path",
    carrier: "telemetry-trail",
    invocation: "keyboard-focus",
    feedback: "active-glow",
  },
  sources: VOYAGER_BOUNDARY_SOURCES,
  transitionScore: VOYAGER_BOUNDARY_TRANSITION_SCORE,
});

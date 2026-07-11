import type React from "react";
import {
  defineTopic,
  type TopicMetadata,
  type TopicStageProps,
  type TopicTransitionScore,
} from "../domain/topic";
import type { Source } from "../domain/evidence";
import SpatialSceneTrack from "../components/stage/SpatialSceneTrack";
import type {
  BeatLayoutMode,
  SceneTransitionMap,
} from "../components/stage/SpatialSceneTrack";
import styles from "./district-heat.module.css";

type Lang = "en" | "zh";
type SceneId = 1 | 2 | 3 | 4 | 5;

interface BeatCopy {
  action: string;
  title: string;
  body: string;
}

interface SceneCopy {
  navLabel: string;
  kicker: string;
  title: string;
  subtitle: string;
  body: string;
  metricLabel: string;
  metricValue: string;
  statusLabel: string;
  statusValue: string;
  boundary: string;
  beats: BeatCopy[];
}

const SCENE_IDS: SceneId[] = [1, 2, 3, 4, 5];

const BEAT_LAYOUT_MODES: Record<number, BeatLayoutMode> = {
  1: "reserved",
  2: "reserved",
  3: "reserved",
  4: "reserved",
};

export const DISTRICT_HEAT_TRANSITION_SCORE = {
  "1->2": "push-x",
  "2->3": "grid-reveal",
  "3->4": "scanline",
  "4->5": "push-y",
} as const satisfies TopicTransitionScore;

export const DISTRICT_HEAT_SOURCES = [
  {
    authority: "International Energy Agency",
    title: "Renewables in District Energy — Executive summary",
    citation: "IEA (2026), Renewables in District Energy, Executive summary",
    url: "https://www.iea.org/reports/renewables-in-district-energy/executive-summary",
    supports:
      "Supports the system boundary that waste-heat deployment depends on proximity, temperature compatibility, and connection cost; also supports thermal storage shifting heat across hours, days, or seasons and the need to reduce network losses.",
  },
  {
    authority: "International Energy Agency",
    title: "How a heat pump works",
    citation: "IEA (2022), The Future of Heat Pumps",
    url: "https://www.iea.org/reports/the-future-of-heat-pumps/how-a-heat-pump-works",
    supports:
      "Supports that a heat pump extracts, amplifies, and transfers heat while requiring external power, normally electricity, and that large-scale systems can use waste heat from data centres and industrial processes.",
  },
  {
    authority: "International Energy Agency",
    title: "Heat pumps in district heating and cooling systems",
    citation: "IEA (2020), Heat pumps in district heating and cooling systems",
    url: "https://www.iea.org/articles/heat-pumps-in-district-heating-and-cooling-systems",
    supports:
      "Supports using large heat pumps with low-temperature waste-heat sources below 45 degrees Celsius in district heating, which anchors the schematic source-band label without asserting a project-specific temperature.",
  },
  {
    authority: "Stockholm Exergi",
    title: "Heat recovery — Open District Heating",
    citation: "Stockholm Exergi, Heat recovery — Open District Heating",
    url: "https://www.stockholmexergi.se/en/heat-recovery/",
    supports:
      "Provides the real-world anchor: Stockholm businesses including data centres can deliver excess heat through Open District Heating, with heat pumps used to make that heat available to the district network.",
  },
  {
    authority: "LUT Energy / U.S. Department of Energy OSTI",
    title: "Heat exchanger thermal design guide",
    citation: "J. Saari (2010), Heat exchanger thermal design guide",
    url: "https://www.osti.gov/etdeweb/biblio/993238",
    supports:
      "Supports the exchanger principle shown in Scene 2: in recuperative heat exchangers, two fluids remain separated by the heat-transfer surface while thermal energy crosses that surface.",
  },
  {
    authority: "UK Department of Energy and Climate Change / DNV GL",
    title: "Energy Storage Use Cases",
    citation: "Energy Storage Use Cases (2016), seasonal thermal storage use case",
    url: "https://assets.publishing.service.gov.uk/government/uploads/system/uploads/attachment_data/file/554467/Energy_Storage_Use_Cases.pdf",
    supports:
      "Supports seasonal thermal storage as long-term heat storage that can shift heat availability, improve use of waste heat, and serve district-heating demand while remaining size-, cost-, and application-dependent.",
  },
] as const satisfies readonly Source[];

const SCENES: Record<SceneId, Record<Lang, SceneCopy>> = {
  1: {
    en: {
      navLabel: "Source",
      kicker: "01 / excess source",
      title: "Heat reaches the edge",
      subtitle: "Waste heat is available before it is useful.",
      body: "A data hall can reject low-grade heat continuously. Recovery starts only when a designed route intercepts that flow before it reaches the environment.",
      metricLabel: "illustrative source band",
      metricValue: "below 45 °C · site-dependent",
      statusLabel: "route state",
      statusValue: "venting → recoverable",
      boundary: "Composite technical schematic · Stockholm Exergi Open District Heating is the reference anchor.",
      beats: [
        {
          action: "Trace rejected heat toward the environment",
          title: "Heat is being rejected",
          body: "The source exists, but no district connection exists yet.",
        },
        {
          action: "Stop the flow at the recovery boundary",
          title: "Recovery begins at the edge",
          body: "A valve redirects heat toward a designed transfer path.",
        },
      ],
    },
    zh: {
      navLabel: "热源",
      kicker: "01 / 余热源",
      title: "热量来到系统边缘",
      subtitle: "余热存在，不等于余热已经可用。",
      body: "数据机房可以持续排出低品位热。只有设计好的路径在热量进入环境前截住它，回收才真正开始。",
      metricLabel: "示意热源区间",
      metricValue: "低于 45 °C · 现场决定",
      statusLabel: "路径状态",
      statusValue: "排散 → 可回收",
      boundary: "综合技术示意 · 真实案例锚点为 Stockholm Exergi Open District Heating。",
      beats: [
        {
          action: "追踪排向环境的热量",
          title: "热量正在被排散",
          body: "热源已经存在，但区域热网连接尚未建立。",
        },
        {
          action: "在回收边界截住热流",
          title: "回收从系统边缘开始",
          body: "阀门把热量转向设计好的传递路径。",
        },
      ],
    },
  },
  2: {
    en: {
      navLabel: "Exchange",
      kicker: "02 / isolated exchange",
      title: "Transfer heat, not fluid",
      subtitle: "Two circuits approach one surface and stay hydraulically separate.",
      body: "The source loop releases heat across exchanger plates. The district return loop receives that heat without mixing with the source fluid.",
      metricLabel: "circuit state",
      metricValue: "two fluids · one thermal bridge",
      statusLabel: "transfer mode",
      statusValue: "thermal only",
      boundary: "The plate wall is a separation boundary, not a mixing chamber.",
      beats: [
        {
          action: "Bring the source and network circuits to the exchanger",
          title: "Two circuits arrive",
          body: "Each fluid keeps its own pressure and chemistry.",
        },
        {
          action: "Load heat onto the source side of the plates",
          title: "The hot side releases energy",
          body: "Temperature difference drives transfer across the surface.",
        },
        {
          action: "Complete transfer into the network return",
          title: "Heat crosses; fluids stay separate",
          body: "The district loop leaves warmer without material crossing the wall.",
        },
      ],
    },
    zh: {
      navLabel: "换热",
      kicker: "02 / 隔离换热",
      title: "传热，不混合流体",
      subtitle: "两套回路靠近同一传热面，并保持水力隔离。",
      body: "热源回路通过换热板释放热量；区域热网回水接收热量，却不与热源流体混合。",
      metricLabel: "回路状态",
      metricValue: "两种流体 · 一座热桥",
      statusLabel: "传递方式",
      statusValue: "只传热",
      boundary: "换热板是隔离边界，不是混合腔。",
      beats: [
        {
          action: "让热源与热网回路靠近换热器",
          title: "两套回路抵达",
          body: "两侧流体各自保持压力与化学条件。",
        },
        {
          action: "让热源侧向换热板释放热量",
          title: "热侧释放能量",
          body: "温差推动热量穿过传热面。",
        },
        {
          action: "把热量传入热网回水",
          title: "热量跨越，流体分隔",
          body: "区域回路升温，但没有物质穿过隔离面。",
        },
      ],
    },
  },
  3: {
    en: {
      navLabel: "Lift",
      kicker: "03 / temperature lift",
      title: "Lift temperature with power",
      subtitle: "Low-grade heat needs an energy input before it can match the network.",
      body: "A heat pump moves and upgrades the recovered heat. Electricity drives the compressor; peak or backup plant enters only when demand outruns the recovered stream.",
      metricLabel: "external input",
      metricValue: "electricity required",
      statusLabel: "plant stack",
      statusValue: "heat pump + peak backup",
      boundary: "Transferred heat can exceed electrical input, but the input never disappears.",
      beats: [
        {
          action: "Connect compressor power to the recovered stream",
          title: "The heat pump enters",
          body: "Electricity enables the refrigeration cycle to move heat uphill.",
        },
        {
          action: "Raise the recovered stream toward network temperature",
          title: "Temperature is lifted",
          body: "The upgraded stream can now match a suitable district loop.",
        },
        {
          action: "Add peak and backup capacity as a separate layer",
          title: "Peak plant covers the gap",
          body: "Backup supports exceptional demand; it is not hidden inside the recovery claim.",
        },
      ],
    },
    zh: {
      navLabel: "升温",
      kicker: "03 / 温度提升",
      title: "用外部能量提升温度",
      subtitle: "低品位热需要能量输入，才能与热网温度匹配。",
      body: "热泵搬运并升级回收热；电力驱动压缩机。只有需求超过回收热流时，峰值或备用热源才作为独立层进入。",
      metricLabel: "外部输入",
      metricValue: "需要电力",
      statusLabel: "热源组合",
      statusValue: "热泵 + 峰值备用",
      boundary: "传出的热量可以高于电力输入，但电力输入不会消失。",
      beats: [
        {
          action: "把压缩机电力接入回收热流",
          title: "热泵进入系统",
          body: "电力让制冷循环可以把热量向高温侧搬运。",
        },
        {
          action: "把回收热提升到热网可用温度",
          title: "温度被提升",
          body: "升级后的热流可以匹配合适的区域热网。",
        },
        {
          action: "把峰值与备用容量作为独立层加入",
          title: "峰值热源补足缺口",
          body: "备用应对异常需求，不应被藏进余热回收的功劳里。",
        },
      ],
    },
  },
  4: {
    en: {
      navLabel: "Loop",
      kicker: "04 / district loop",
      title: "Demand reshapes the loop",
      subtitle: "Buildings draw unevenly; the return line records what they used.",
      body: "Branches open by demand rather than glowing together. Every active building cools the supply stream and changes the temperature arriving back at the plant.",
      metricLabel: "network state",
      metricValue: "variable demand",
      statusLabel: "return line",
      statusValue: "cooler · load-dependent",
      boundary: "Useful operation depends on both supply temperature and a disciplined return.",
      beats: [
        {
          action: "Establish supply and return around the district loop",
          title: "The loop begins circulating",
          body: "Supply and return carry different temperature states.",
        },
        {
          action: "Open building branches according to demand",
          title: "Demand opens uneven branches",
          body: "Occupied blocks draw heat while quieter branches remain dim.",
        },
        {
          action: "Feed the cooler return back into plant control",
          title: "Return temperature changes the plant",
          body: "The loop becomes feedback, not a one-way glowing pipe.",
        },
      ],
    },
    zh: {
      navLabel: "热网",
      kicker: "04 / 区域环网",
      title: "需求重新塑造环路",
      subtitle: "建筑用热并不均匀；回水记录了实际取走的热量。",
      body: "建筑支路按需求开启，而不是整条管线同时发光。每座活跃建筑都会冷却供水，并改变返回热源站的温度。",
      metricLabel: "热网状态",
      metricValue: "需求变化中",
      statusLabel: "回水管线",
      statusValue: "更冷 · 随负荷变化",
      boundary: "有效运行既依赖供水温度，也依赖受控的低温回水。",
      beats: [
        {
          action: "建立区域供水与回水环路",
          title: "环路开始循环",
          body: "供水与回水承载不同的温度状态。",
        },
        {
          action: "根据建筑需求打开支路",
          title: "需求开启不同支路",
          body: "活跃街区取热，低需求支路保持低亮。",
        },
        {
          action: "把更冷的回水反馈给热源控制",
          title: "回水温度改变热源运行",
          body: "环路成为反馈系统，而不是单向发光管道。",
        },
      ],
    },
  },
  5: {
    en: {
      navLabel: "Balance",
      kicker: "05 / seasonal balance",
      title: "Useful heat is bounded",
      subtitle: "Distance, temperature match, storage, and season decide how much can serve demand.",
      body: "Thermal storage can shift heat through time. It cannot erase pipe loss, remove connection cost, or create winter demand beside a distant summer source.",
      metricLabel: "network state",
      metricValue: "settled · low output",
      statusLabel: "binding limits",
      statusValue: "distance · loss · season",
      boundary: "Real anchor: Stockholm Exergi Open District Heating. No project-specific values are reproduced here.",
      beats: [
        {
          action: "Settle the network on its practical boundaries",
          title: "Second heat is a systems match",
          body: "Recoverable heat and usable heat are not the same quantity.",
        },
      ],
    },
    zh: {
      navLabel: "平衡",
      kicker: "05 / 季节平衡",
      title: "可用余热受到边界约束",
      subtitle: "距离、温度匹配、储能与季节共同决定余热能服务多少需求。",
      body: "热储能可以把热量移到另一个时间使用，却不能消除管损、连接成本，也不能在遥远夏季热源旁凭空创造冬季需求。",
      metricLabel: "热网状态",
      metricValue: "低亮 · 静态",
      statusLabel: "约束边界",
      statusValue: "距离 · 损耗 · 季节",
      boundary: "真实案例锚点：Stockholm Exergi Open District Heating；本图不复刻项目参数。",
      beats: [
        {
          action: "让热网停在实际约束上",
          title: "第二次用途来自系统匹配",
          body: "可回收热量与最终可用热量不是同一个数。",
        },
      ],
    },
  },
};

function getCopy(scene: SceneId, lang: Lang): SceneCopy {
  return SCENES[scene][lang];
}

function normalizeScene(scene: number): SceneId {
  return SCENE_IDS.includes(scene as SceneId) ? (scene as SceneId) : 1;
}

function clampBeat(beat: number, maxBeat: number): number {
  if (!Number.isFinite(beat)) return 0;
  return Math.max(0, Math.min(Math.floor(beat), maxBeat));
}

function buildMetadata(lang: Lang): TopicMetadata {
  return {
    theme:
      lang === "zh"
        ? "城市余热——区域热回收综合技术示意"
        : "Second Heat — a composite district heat recovery schematic",
    densityLabel: lang === "zh" ? "技术图解" : "Technical Diagram",
    heroScene: 4,
    colors: {
      bg: "#061319",
      ink: "#eafcff",
      panel: "#0b2228",
    },
    typography: {
      header: "JetBrains Mono 700",
      body: "Noto Sans SC 400",
    },
    tags: [
      "pipeline",
      "district-heating",
      "waste-heat",
      "technical",
      "dark",
      "infrastructure",
      "diagram",
    ],
    fonts: ["JetBrains Mono", "cjk:Noto Sans SC"],
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

const DIAGRAM_LABELS = {
  en: {
    dataHall: "DATA HALL",
    ambient: "AMBIENT",
    recoveryGate: "RECOVERY GATE",
    sourceBand: "LOW-GRADE HEAT / <45 °C",
    sourceLoop: "SOURCE FLUID",
    networkReturn: "NETWORK RETURN",
    heatOnly: "HEAT CROSSES",
    noMix: "NO FLUID MIXING",
    electricity: "ELECTRICITY",
    heatPump: "HEAT PUMP",
    networkSupply: "NETWORK SUPPLY",
    peakBackup: "PEAK / BACKUP",
    supply: "SUPPLY",
    return: "RETURN",
    demandOpen: "DEMAND OPEN",
    demandClosed: "LOW DEMAND",
    store: "SEASONAL STORE",
    distance: "DISTANCE",
    pipeLoss: "PIPE LOSS",
    seasonalFit: "SEASONAL FIT",
  },
  zh: {
    dataHall: "数据机房",
    ambient: "环境",
    recoveryGate: "回收边界",
    sourceBand: "低品位热 / <45 °C",
    sourceLoop: "热源流体",
    networkReturn: "热网回水",
    heatOnly: "热量跨越",
    noMix: "流体不混合",
    electricity: "电力输入",
    heatPump: "热泵",
    networkSupply: "热网供水",
    peakBackup: "峰值 / 备用",
    supply: "供水",
    return: "回水",
    demandOpen: "需求开启",
    demandClosed: "低需求",
    store: "季节储能",
    distance: "距离",
    pipeLoss: "管损",
    seasonalFit: "季节匹配",
  },
} as const;

function SourceDiagram({ beat, language }: { beat: number; language: Lang }) {
  const labels = DIAGRAM_LABELS[language];
  const recovering = beat >= 1;

  return (
    <svg
      className={styles.diagram}
      viewBox="0 0 1000 560"
      role="img"
      aria-label={
        language === "zh"
          ? "数据机房余热在排散与回收路径之间切换"
          : "Data hall waste heat switching from rejection to recovery"
      }
    >
      <g className={styles.sourceMachine} data-heat-source="true">
        <path className={styles.machineBody} d="M72 128 H322 V432 H72 Z" />
        {[0, 1, 2, 3].map((rack) => (
          <g key={rack} transform={`translate(0 ${rack * 64})`}>
            <rect className={styles.rackBay} x="108" y="165" width="148" height="38" rx="8" />
            <circle className={styles.rackLamp} cx="132" cy="184" r="6" />
            <path className={styles.rackLine} d="M154 184 H230" />
          </g>
        ))}
        <text className={styles.svgLabelStrong} x="197" y="102" textAnchor="middle">
          {labels.dataHall}
        </text>
        <text className={styles.svgLabelMuted} x="197" y="468" textAnchor="middle">
          {labels.sourceBand}
        </text>
      </g>

      <path className={styles.pipeSleeve} d="M322 280 H474" />
      <path
        className={`${styles.pipeFlow} ${styles.flowWarm}`}
        data-active="true"
        d="M322 280 H474"
      />

      <g
        className={styles.routeGate}
        data-route-state={recovering ? "recover" : "vent"}
        transform="translate(500 280)"
      >
        <circle className={styles.valveBody} r="42" />
        <path
          className={styles.valveHandle}
          data-open={recovering ? "true" : "false"}
          d="M-30 0 H30 M0 -30 V30"
        />
        <text className={styles.svgLabelMuted} x="0" y="78" textAnchor="middle">
          {labels.recoveryGate}
        </text>
      </g>

      <path className={styles.pipeSleeve} d="M526 264 C650 232 760 150 920 112" />
      <path
        className={`${styles.pipeFlow} ${styles.flowWarm}`}
        data-active={recovering ? "false" : "true"}
        d="M526 264 C650 232 760 150 920 112"
      />
      <g className={styles.ambientVent} data-active={recovering ? "false" : "true"}>
        <path d="M918 80 V160 M890 94 L918 68 L946 94" />
        <text className={styles.svgLabelMuted} x="878" y="194">
          {labels.ambient}
        </text>
      </g>

      <path className={styles.pipeSleeve} d="M526 296 C650 338 744 420 922 444" />
      <path
        className={`${styles.pipeFlow} ${styles.flowWarm}`}
        data-active={recovering ? "true" : "false"}
        d="M526 296 C650 338 744 420 922 444"
      />
      <g className={styles.recoveryBoundary} data-active={recovering ? "true" : "false"}>
        <path d="M900 382 V500 M932 382 V500" />
        <path d="M886 410 H946 M886 472 H946" />
      </g>
    </svg>
  );
}

function ExchangerDiagram({ beat, language }: { beat: number; language: Lang }) {
  const labels = DIAGRAM_LABELS[language];

  return (
    <svg
      className={styles.diagram}
      viewBox="0 0 1000 560"
      role="img"
      aria-label={
        language === "zh"
          ? "换热器分隔热源流体与区域热网回水"
          : "Heat exchanger separating source fluid from district return water"
      }
    >
      <path
        className={`${styles.exchangerCircuit} ${styles.sourceCircuit}`}
        data-fluid-circuit="true"
        data-active={beat >= 0 ? "true" : "false"}
        d="M70 126 H304 C342 126 360 156 360 194 V366 C360 404 342 434 304 434 H70"
      />
      <path
        className={`${styles.exchangerCircuit} ${styles.returnCircuit}`}
        data-fluid-circuit="true"
        data-active={beat >= 1 ? "true" : "false"}
        d="M930 434 H696 C658 434 640 404 640 366 V194 C640 156 658 126 696 126 H930"
      />
      <text className={styles.svgLabelStrong} x="190" y="88" textAnchor="middle">
        {labels.sourceLoop}
      </text>
      <text className={styles.svgLabelStrong} x="810" y="474" textAnchor="middle">
        {labels.networkReturn}
      </text>

      <g className={styles.exchangerStack} data-exchanger-wall="true">
        {[0, 1, 2, 3, 4, 5].map((plate) => (
          <path
            key={plate}
            className={styles.exchangerPlate}
            data-active={beat >= 1 ? "true" : "false"}
            d={`M${430 + plate * 28} 126 V434`}
          />
        ))}
        <rect className={styles.exchangerFrame} x="410" y="98" width="180" height="364" rx="18" />
      </g>

      <g className={styles.heatCrossing} data-active={beat >= 2 ? "true" : "false"}>
        {[0, 1, 2].map((arrow) => (
          <g key={arrow} transform={`translate(0 ${arrow * 88})`}>
            <path d="M382 194 H618" />
            <path d="M590 174 L620 194 L590 214" />
          </g>
        ))}
        <text className={styles.svgLabelStrong} x="500" y="512" textAnchor="middle">
          {labels.heatOnly}
        </text>
        <text className={styles.svgLabelMuted} x="500" y="540" textAnchor="middle">
          {labels.noMix}
        </text>
      </g>
    </svg>
  );
}

function LiftDiagram({ beat, language }: { beat: number; language: Lang }) {
  const labels = DIAGRAM_LABELS[language];
  const peakActive = beat >= 2;

  return (
    <svg
      className={styles.diagram}
      viewBox="0 0 1000 560"
      role="img"
      aria-label={
        language === "zh"
          ? "电力驱动热泵提升余热温度并由峰值热源补充"
          : "Electricity driving a heat pump temperature lift with peak backup"
      }
    >
      <path className={styles.pipeSleeve} d="M52 366 H300" />
      <path
        className={`${styles.pipeFlow} ${styles.flowCool}`}
        data-active="true"
        d="M52 366 H300"
      />
      <text className={styles.svgLabelMuted} x="166" y="404" textAnchor="middle">
        {labels.sourceLoop}
      </text>

      <g className={styles.heatPump} data-heat-pump="true">
        <path className={styles.machineBody} d="M300 170 H620 V438 H300 Z" />
        <circle className={styles.compressorRing} cx="460" cy="304" r="92" />
        <path className={styles.compressorBlade} d="M460 224 C524 258 528 340 460 384 C392 350 392 258 460 224 Z" />
        <circle className={styles.compressorHub} cx="460" cy="304" r="24" />
        <text className={styles.svgLabelStrong} x="460" y="474" textAnchor="middle">
          {labels.heatPump}
        </text>
      </g>

      <g className={styles.powerFeed} data-active={beat >= 0 ? "true" : "false"}>
        <path className={styles.powerCable} d="M460 40 V154" />
        <path className={styles.powerBolt} d="M430 48 H480 L452 94 H492 L442 154 L456 108 H418 Z" />
        <text className={styles.svgLabelStrong} x="520" y="76">
          {labels.electricity}
        </text>
      </g>

      <path className={styles.pipeSleeve} d="M620 250 H926" />
      <path
        className={`${styles.pipeFlow} ${styles.flowWarm}`}
        data-active={beat >= 1 ? "true" : "false"}
        d="M620 250 H926"
      />
      <text className={styles.svgLabelStrong} x="770" y="218" textAnchor="middle">
        {labels.networkSupply}
      </text>

      <g
        className={styles.peakPlant}
        data-peak-backup={peakActive ? "active" : "standby"}
      >
        <path className={styles.peakBody} d="M704 344 H886 V486 H704 Z" />
        <path className={styles.peakFlame} d="M794 456 C748 426 772 384 812 354 C806 398 852 408 836 446 C826 470 808 476 794 456 Z" />
        <path className={styles.peakLink} d="M794 344 V250" />
        <text className={styles.svgLabelMuted} x="795" y="522" textAnchor="middle">
          {labels.peakBackup}
        </text>
      </g>
    </svg>
  );
}

const BUILDINGS = [
  { x: 146, y: 148, h: 118 },
  { x: 354, y: 102, h: 164 },
  { x: 596, y: 142, h: 124 },
  { x: 794, y: 82, h: 184 },
] as const;

function LoopDiagram({ beat, language }: { beat: number; language: Lang }) {
  const labels = DIAGRAM_LABELS[language];
  const demandStates = beat >= 1
    ? (["open", "open", "closed", "open"] as const)
    : (["closed", "closed", "closed", "closed"] as const);

  return (
    <svg
      className={styles.diagram}
      viewBox="0 0 1000 560"
      role="img"
      aria-label={
        language === "zh"
          ? "供热建筑按需求开启支路并改变区域热网回水"
          : "Buildings opening heat branches by demand and changing district return temperature"
      }
    >
      <path className={styles.loopSleeve} d="M70 338 C198 298 312 318 438 336 C578 356 704 332 930 292" />
      <path
        className={`${styles.loopFlow} ${styles.flowWarm}`}
        data-active="true"
        d="M70 338 C198 298 312 318 438 336 C578 356 704 332 930 292"
      />
      <path className={styles.loopSleeve} d="M930 462 C746 500 628 474 470 454 C318 434 210 454 70 492" />
      <path
        className={`${styles.loopFlow} ${styles.flowCool}`}
        data-active={beat >= 2 ? "true" : "false"}
        data-return-state={beat >= 2 ? "cooler" : "baseline"}
        d="M930 462 C746 500 628 474 470 454 C318 434 210 454 70 492"
      />
      <text className={styles.svgLabelStrong} x="82" y="312">{labels.supply}</text>
      <text className={styles.svgLabelStrong} x="78" y="538">{labels.return}</text>

      {BUILDINGS.map((building, index) => {
        const demand = demandStates[index];
        const branchX = building.x + 46;
        return (
          <g
            key={building.x}
            className={styles.buildingBranch}
            data-building-branch="true"
            data-demand={demand}
          >
            <path className={styles.branchPipe} d={`M${branchX} 320 V${building.y + building.h}`} />
            <path className={styles.branchReturn} d={`M${branchX + 28} ${building.y + building.h} V448`} />
            <path
              className={styles.buildingBody}
              d={`M${building.x} ${building.y + building.h} V${building.y + 24} L${building.x + 46} ${building.y} L${building.x + 92} ${building.y + 24} V${building.y + building.h} Z`}
            />
            {[0, 1].map((floor) => (
              <g key={floor} transform={`translate(0 ${floor * 42})`}>
                <rect className={styles.window} x={building.x + 20} y={building.y + 44} width="18" height="22" rx="3" />
                <rect className={styles.window} x={building.x + 54} y={building.y + 44} width="18" height="22" rx="3" />
              </g>
            ))}
            <text className={styles.svgLabelMuted} x={branchX} y={building.y - 18} textAnchor="middle">
              {demand === "open" ? labels.demandOpen : labels.demandClosed}
            </text>
          </g>
        );
      })}

      <g className={styles.plantBlock}>
        <path d="M32 334 H92 V498 H32 Z" />
        <path d="M48 312 H76 V334 H48 Z" />
      </g>
    </svg>
  );
}

function BalanceDiagram({ language }: { language: Lang }) {
  const labels = DIAGRAM_LABELS[language];

  return (
    <svg
      className={styles.diagram}
      viewBox="0 0 1000 560"
      role="img"
      aria-label={
        language === "zh"
          ? "季节储能、输送距离与管网损耗限制可用余热"
          : "Seasonal storage, transport distance, and network loss bounding usable waste heat"
      }
    >
      <g className={styles.balanceSource}>
        <path className={styles.machineBody} d="M54 214 H226 V376 H54 Z" />
        <path className={styles.rackLine} d="M86 256 H194 M86 296 H194 M86 336 H194" />
      </g>
      <path className={styles.boundaryPipe} d="M226 294 C344 258 402 258 488 294 C578 332 646 334 754 292 C826 264 882 262 946 280" />
      <path className={styles.lossOverlay} d="M226 294 C344 258 402 258 488 294 C578 332 646 334 754 292 C826 264 882 262 946 280" />

      <g className={styles.seasonalStore} data-seasonal-store="true">
        <path className={styles.storeBody} d="M394 152 C394 118 606 118 606 152 V398 C606 434 394 434 394 398 Z" />
        <ellipse className={styles.storeTop} cx="500" cy="152" rx="106" ry="30" />
        <path className={styles.storeLevel} d="M420 294 C458 272 542 318 580 294 V394 C580 414 420 414 420 394 Z" />
        <text className={styles.svgLabelStrong} x="500" y="100" textAnchor="middle">
          {labels.store}
        </text>
      </g>

      <g className={styles.boundaryGauge} transform="translate(288 428)">
        <path d="M0 0 H154" />
        <path d="M0 -12 V12 M154 -12 V12" />
        <text className={styles.svgLabelMuted} x="77" y="38" textAnchor="middle">
          {labels.distance}
        </text>
      </g>
      <g className={styles.boundaryGauge} transform="translate(578 454)">
        <path d="M0 0 H138" />
        <path d="M0 -12 V12 M138 -12 V12" />
        <text className={styles.svgLabelMuted} x="69" y="38" textAnchor="middle">
          {labels.pipeLoss}
        </text>
      </g>
      <g className={styles.seasonIcons}>
        <circle cx="748" cy="112" r="34" />
        <path d="M748 54 V32 M748 192 V170 M690 112 H668 M828 112 H806 M708 72 L692 56 M788 152 L804 168 M788 72 L804 56 M708 152 L692 168" />
        <path d="M892 80 V170 M852 102 L932 148 M852 148 L932 102" />
        <text className={styles.svgLabelMuted} x="820" y="218" textAnchor="middle">
          {labels.seasonalFit}
        </text>
      </g>
      <g className={styles.balanceBuildings}>
        <path d="M824 282 H900 V392 H824 Z M906 248 H964 V392 H906 Z" />
        <path d="M842 308 H858 V330 M872 308 H888 V330 M922 276 H938 V300" />
      </g>
    </svg>
  );
}

function SceneDiagram({ scene, beat, language }: { scene: SceneId; beat: number; language: Lang }) {
  switch (scene) {
    case 1:
      return <SourceDiagram beat={beat} language={language} />;
    case 2:
      return <ExchangerDiagram beat={beat} language={language} />;
    case 3:
      return <LiftDiagram beat={beat} language={language} />;
    case 4:
      return <LoopDiagram beat={beat} language={language} />;
    case 5:
      return <BalanceDiagram language={language} />;
  }
}

function getFlowRate(scene: SceneId, beat: number): string {
  if (scene === 1) return beat >= 1 ? "capture" : "slow";
  if (scene === 2) return "exchange";
  if (scene === 3) return beat >= 1 ? "boost" : "idle";
  if (scene === 4) return beat >= 1 ? "demand" : "circulate";
  return "settled";
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

  return (
    <section
      className={styles.scene}
      data-scene={scene}
      data-active-beat={activeBeat}
      data-flow-rate={getFlowRate(scene, activeBeat)}
      data-panel-active={isActive ? "true" : "false"}
    >
      <div className={styles.sceneShell}>
        <header className={styles.header} data-beat-layout-item="true">
          <div className={styles.sceneCode}>
            <span>{String(scene).padStart(2, "0")}</span>
            <b>{copy.kicker}</b>
          </div>
          <div className={styles.titleBlock}>
            <p>{copy.subtitle}</p>
            <h1>{copy.title}</h1>
          </div>
          <div className={styles.metricBlock}>
            <span>{copy.metricLabel}</span>
            <strong>{copy.metricValue}</strong>
          </div>
        </header>

        <main className={styles.mainGrid} data-beat-layout-item="true">
          <div className={styles.visualShell} data-beat-layout-item="true">
            <div className={styles.visualPlate} aria-hidden="true" />
            <SceneDiagram scene={scene} beat={activeBeat} language={language} />
            <div className={styles.visualLegend}>
              <span className={styles.warmKey} />
              <b>{language === "zh" ? "高温侧" : "WARM SIDE"}</b>
              <span className={styles.coolKey} />
              <b>{language === "zh" ? "低温 / 回水侧" : "COOL / RETURN SIDE"}</b>
            </div>
          </div>

          <aside className={styles.readout} data-beat-layout-item="true">
            <p className={styles.bodyCopy}>{copy.body}</p>
            <div className={styles.statusPanel}>
              <span>{copy.statusLabel}</span>
              <strong>{copy.statusValue}</strong>
            </div>
            <div className={styles.beatRail}>
              {copy.beats.map((item, index) => (
                <span
                  key={item.title}
                  data-beat-state={
                    index === activeBeat
                      ? "active"
                      : index < activeBeat
                        ? "complete"
                        : "future"
                  }
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
              ))}
            </div>
            <div className={styles.beatReadout} data-beat-layout-item="true">
              <span>{beatCopy.action}</span>
              <strong>{beatCopy.title}</strong>
              <p>{beatCopy.body}</p>
            </div>
          </aside>
        </main>

        <footer className={styles.boundaryNote} data-beat-layout-item="true">
          <span>{language === "zh" ? "综合技术示意" : "COMPOSITE TECHNICAL SCHEMATIC"}</span>
          <p>{copy.boundary}</p>
        </footer>
      </div>
    </section>
  );
}

function ValveNavigator({
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

  return (
    <nav
      className={styles.valveNav}
      aria-label={language === "zh" ? "热力管环阀门导航" : "Heat-pipe loop valve navigation"}
      data-topic-navigation="true"
      data-navigation-geometry="path"
      data-navigation-carrier="heat-pipe-loop"
      data-navigation-invocation="auto-hide"
      data-navigation-feedback="mechanical-displacement"
      onPointerDown={(event) => event.stopPropagation()}
      onClick={(event) => event.stopPropagation()}
    >
      <div className={styles.navPipe} aria-hidden="true">
        <span />
      </div>
      {SCENE_IDS.map((target) => {
        const copy = getCopy(target, language);
        const active = target === scene;
        const state = active ? "active" : target < scene ? "past" : "future";
        return (
          <button
            key={target}
            type="button"
            className={styles.navValve}
            data-nav-state={state}
            aria-current={active ? "step" : undefined}
            aria-label={
              language === "zh"
                ? `场景 ${target}：${copy.navLabel}`
                : `Scene ${target}: ${copy.navLabel.toLowerCase()}`
            }
            onPointerDown={(event) => event.stopPropagation()}
            onClick={(event) => {
              event.stopPropagation();
              navigate(target);
            }}
            onKeyDown={(event) => handleKeyDown(event, target)}
          >
            <span className={styles.valveWheel} aria-hidden="true">
              <i />
              <i />
            </span>
            <span className={styles.valveLabel}>
              <b>{String(target).padStart(2, "0")}</b>
              <small>{copy.navLabel}</small>
            </span>
          </button>
        );
      })}
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
  const activeScene = normalizeScene(scene);
  const motionDisabled = reducedMotion || isThumbnail;

  return (
    <div
      className={styles.root}
      data-topic-id="district-heat"
      data-language={language}
      data-thumbnail={isThumbnail ? "true" : "false"}
      data-motion={motionDisabled ? "off" : "on"}
    >
      <div className={styles.instrumentChrome} aria-hidden="true">
        <span>SECOND HEAT / THERMAL ROUTING</span>
        <b>{language === "zh" ? "综合技术示意" : "COMPOSITE TECHNICAL SCHEMATIC"}</b>
      </div>
      <SpatialSceneTrack
        scene={activeScene}
        beat={beat}
        sceneIds={[...SCENE_IDS]}
        transitionKind="push-x"
        transitionMap={DISTRICT_HEAT_TRANSITION_SCORE as SceneTransitionMap}
        transitionDurationMs={760}
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
        <ValveNavigator
          scene={activeScene}
          language={language}
          onNavigate={onNavigate}
        />
      ) : null}
    </div>
  );
}

const metadata = {
  en: buildMetadata("en"),
  zh: buildMetadata("zh"),
};

export default defineTopic({
  id: "district-heat",
  styleId: "signal-pipeline-flow",
  title: {
    en: "Second Heat",
    zh: "城市余热",
  },
  modelId: "GPT 5.6 Sol",
  Stage: TopicStage,
  metadata,
  navigation: {
    geometry: "path",
    carrier: "heat-pipe-loop",
    invocation: "auto-hide",
    feedback: "mechanical-displacement",
  },
  transitionScore: DISTRICT_HEAT_TRANSITION_SCORE,
  evidence: {
    kind: "facts",
    sources: DISTRICT_HEAT_SOURCES,
  },
});

import type React from "react";
import type {
  BespokeStyleProps,
  StyleMetadata,
  TopicSource,
  TopicTransitionScore,
} from "../types";
import SpatialSceneTrack, {
  type BeatLayoutMode,
  type SceneTransitionMap,
} from "./SpatialSceneTrack";
import { defineStyleTopic } from "./topic";
import styles from "./studio-mixing-console-tidal-time.module.css";

type Language = "en" | "zh";
type SceneId = 1 | 2 | 3 | 4 | 5;
type CSSVariables = React.CSSProperties &
  Record<`--${string}`, string | number>;

interface BeatCopy {
  action: string;
  title: string;
  body: string;
}

interface SceneCopy {
  kicker: string;
  title: string;
  subtitle: string;
  evidence: string;
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

export const TIDAL_TIME_TRANSITION_SCORE = {
  "1->2": "push-y",
  "2->3": "push-x",
  "3->4": "afterimage",
  "4->5": "focus-swap",
} as const satisfies Readonly<TopicTransitionScore>;

const TRANSITION_MAP: SceneTransitionMap = {
  ...TIDAL_TIME_TRANSITION_SCORE,
  "2->1": "push-y",
  "3->2": "push-x",
  "4->3": "afterimage",
  "5->4": "focus-swap",
};

export const TIDAL_TIME_SOURCES = [
  {
    authority: "NASA Jet Propulsion Laboratory",
    title: "The Apollo Experiment That Keeps on Giving",
    citation: "NASA/JPL News, 24 July 2019",
    url: "https://www.jpl.nasa.gov/news/the-apollo-experiment-that-keeps-on-giving/",
    supports:
      "Lunar laser ranging uses Apollo retroreflectors to measure Earth–Moon distance to millimeter scale, finds about 3.8 centimeters of present recession per year, and links the offset ocean tide to slower Earth rotation and a wider lunar orbit.",
  },
  {
    authority: "NASA Science",
    title: "Tidal Locking",
    citation: "NASA Science Moon, updated 12 February 2026",
    url: "https://science.nasa.gov/moon/tidal-locking/",
    supports:
      "Earth's ocean bulges are out of phase with the Moon; the interaction dissipates energy, slows Earth's rotation, alters the Moon's orbital motion, and carries the Moon outward at roughly four centimeters per year today.",
  },
  {
    authority: "International Laser Ranging Service",
    title: "SLR Measures the Tides — Earth/Moon Evolution",
    citation: "ILRS Science Contributions, NASA Goddard Space Flight Center",
    url: "https://ilrs.gsfc.nasa.gov/science/scienceContributions/tides.html",
    supports:
      "Laser ranging identifies tidal dissipation and momentum/energy exchange as the dominant explanation for the expanding lunar orbit, and explicitly warns that the current expansion rate cannot be projected unchanged into deep time.",
  },
  {
    authority: "Nature / Oregon State University / NASA Goddard",
    title:
      "Significant dissipation of tidal energy in the deep ocean inferred from satellite altimeter data",
    citation:
      "Egbert, G. D. & Ray, R. D. (2000), Nature 405, 775–778. doi:10.1038/35015531",
    url: "https://www.nature.com/articles/35015531",
    supports:
      "Satellite altimetry maps substantial deep-ocean tidal dissipation near rough ocean-bottom topography; the study frames shallow-sea bottom friction and scattering of surface tides into internal waves as distinct candidate pathways.",
  },
] as const satisfies readonly TopicSource[];

const COPY: Record<SceneId, Record<Language, SceneCopy>> = {
  1: {
    en: {
      kicker: "COUPLED CHANNELS / 01",
      title: "One tide moves two clocks.",
      subtitle:
        "Earth's spin slows as the Moon's orbital angular momentum rises.",
      evidence: "Direction of change: NASA / JPL",
      beats: [
        {
          action: "READ",
          title: "Two linked channels",
          body: "The faders begin at a schematic reference, not a measured scale.",
        },
        {
          action: "BRAKE",
          title: "Earth spin edges down",
          body: "Tidal torque draws angular momentum from Earth's rotation.",
        },
        {
          action: "LIFT",
          title: "Moon orbit edges up",
          body: "The lunar orbit receives angular momentum and expands.",
        },
        {
          action: "COUPLE",
          title: "Slower spin. Wider orbit.",
          body: "Both secular changes come from one tidal interaction.",
        },
      ],
    },
    zh: {
      kicker: "耦合通道 / 01",
      title: "一次潮汐，拨动两座时钟。",
      subtitle: "地球自转变慢，月球轨道角动量增加。",
      evidence: "变化方向：NASA / JPL",
      beats: [
        {
          action: "读取",
          title: "两条联动通道",
          body: "推子从示意基准开始，并非测量刻度。",
        },
        {
          action: "制动",
          title: "地球自转向下",
          body: "潮汐扭矩从地球自转中带走角动量。",
        },
        {
          action: "抬升",
          title: "月球轨道向上",
          body: "月球轨道获得角动量并向外扩展。",
        },
        {
          action: "耦合",
          title: "自转更慢，轨道更宽。",
          body: "两种长期变化来自同一次潮汐相互作用。",
        },
      ],
    },
  },
  2: {
    en: {
      kicker: "TIDAL INPUT / 02",
      title: "Gravity raises the tide. Friction sets the loss.",
      subtitle:
        "Ocean flow meets basins, shelves, seafloor and a deformable Earth.",
      evidence: "Dissipation pathways: Egbert & Ray / Nature",
      beats: [
        {
          action: "ADD",
          title: "Build from the zero-loss reference",
          body: "The ideal meter starts at zero; ocean and terrain channels add real dissipation.",
        },
      ],
    },
    zh: {
      kicker: "潮汐输入 / 02",
      title: "引力抬起潮汐，摩擦决定损耗。",
      subtitle: "海水流动遇到海盆、陆架、海床，以及可形变的地球。",
      evidence: "耗散路径：Egbert & Ray / Nature",
      beats: [
        {
          action: "加入",
          title: "从零损耗参考线开始",
          body: "理想仪表先归零；海洋与地形通道再加入真实耗散。",
        },
      ],
    },
  },
  3: {
    en: {
      kicker: "PHASE + TORQUE / 03",
      title: "The bulge is carried ahead.",
      subtitle:
        "Earth rotates beneath the tide, so the bulge leads the Earth–Moon line.",
      evidence: "Phase and torque direction: NASA / JPL",
      beats: [
        {
          action: "OFFSET",
          title: "Read the phase lead",
          body: "The drawn angle is schematic; the offset is the important relationship.",
        },
        {
          action: "TORQUE",
          title: "Read both reactions",
          body: "The Moon pulls back on Earth's spin while the leading bulge pulls the Moon forward.",
        },
      ],
    },
    zh: {
      kicker: "相位与扭矩 / 03",
      title: "潮峰被自转带到前方。",
      subtitle: "地球在潮汐下方自转，因此潮峰领先地月连线。",
      evidence: "相位与扭矩方向：NASA / JPL",
      beats: [
        {
          action: "错位",
          title: "读取相位领先",
          body: "图中角度仅为示意；关键是潮峰与连线并不重合。",
        },
        {
          action: "扭矩",
          title: "读取两侧反应",
          body: "月球拖慢地球自转；领先的潮峰则沿轨道方向拉动月球。",
        },
      ],
    },
  },
  4: {
    en: {
      kicker: "TWO LEDGERS / 04",
      title: "Do not mix the ledgers.",
      subtitle:
        "Mechanical energy is dissipated; angular momentum is redistributed.",
      evidence: "Energy + momentum accounting: NASA / ILRS",
      beats: [
        {
          action: "SEPARATE",
          title: "Name the two accounts",
          body: "Heat belongs to the energy ledger; orbit belongs to the angular-momentum ledger.",
        },
        {
          action: "TRANSFER",
          title: "Follow each output",
          body: "Different ledgers. Same tide. Neither is an audio metaphor pretending to be a force.",
        },
      ],
    },
    zh: {
      kicker: "两本账 / 04",
      title: "不要把两本账混在一起。",
      subtitle: "机械能被耗散；角动量被重新分配。",
      evidence: "能量与动量核算：NASA / ILRS",
      beats: [
        {
          action: "分开",
          title: "先给两本账命名",
          body: "热量属于能量账；轨道变化属于角动量账。",
        },
        {
          action: "转移",
          title: "分别追踪输出",
          body: "两本不同的账，同一次潮汐；混音台只负责把关系显形。",
        },
      ],
    },
  },
  5: {
    en: {
      kicker: "LASER RANGING / 05",
      title: "The evidence returns as light.",
      subtitle:
        "A laser pulse goes to a lunar retroreflector and returns with distance encoded in travel time.",
      evidence: "Apollo reflectors + measured recession: NASA / JPL / ILRS",
      beats: [
        {
          action: "MEASURE",
          title: "Today's slope is observed",
          body: "The present recession is about 3.8 cm per year—not a linear ruler for deep time.",
        },
      ],
    },
    zh: {
      kicker: "激光测距 / 05",
      title: "证据以光的形式返回。",
      subtitle: "激光脉冲抵达月面反射器，再把传播时间编码成距离返回。",
      evidence: "阿波罗反射器与实测速率：NASA / JPL / ILRS",
      beats: [
        {
          action: "测量",
          title: "今天的斜率来自观测",
          body: "当前退行速率约为每年 3.8 厘米，不能线性外推到深时。",
        },
      ],
    },
  },
};

const NAV_LABELS: Record<Language, string[]> = {
  en: [
    "coupled faders",
    "tidal friction",
    "phase & torque",
    "two ledgers",
    "laser ranging",
  ],
  zh: ["耦合推子", "潮汐摩擦", "相位与扭矩", "两本账", "激光测距"],
};

const NAV_LEVELS = [72, 46, 63, 34, 82];

function toVars(values: Record<string, string | number>): CSSVariables {
  return values as CSSVariables;
}

function toSceneId(scene: number): SceneId {
  return SCENE_IDS.includes(scene as SceneId) ? (scene as SceneId) : 1;
}

function clampBeat(scene: SceneId, beat: number): number {
  return Math.max(0, Math.min(Math.trunc(beat), BEAT_COUNTS[scene] - 1));
}

function getCopy(scene: SceneId, language: Language): SceneCopy {
  return COPY[scene][language];
}

export function getMetadata(lang: Language): StyleMetadata {
  return {
    id: "studio-mixing-console",
    band: "balanced-hybrid",
    name: lang === "zh" ? "工作室调音台" : "Studio Mixing Console",
    theme: lang === "zh" ? "潮汐时差" : "Tidal Time",
    densityLabel:
      lang === "zh" ? "图解说明 · 仪表化" : "Diagram Explainer · Instrumented",
    heroScene: 4,
    colors: {
      bg: "#070b10",
      ink: "#e7f5f4",
      panel: "#151d23",
    },
    typography: {
      header: "SFMono-Regular 700",
      body: "Avenir Next 500",
    },
    tags: [
      "studio-console",
      "tidal-dynamics",
      "instrumented",
      "orbital-diagram",
      "technical",
      "dark",
      "tactile",
    ],
    fonts: [
      "SFMono-Regular",
      "Avenir Next",
      "cjk:PingFang SC",
      "cjk:Microsoft YaHei",
    ],
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

function RatioWarning({ language }: { language: Language }) {
  return (
    <div className={styles.ratioWarning} data-ratio-warning="true">
      <span aria-hidden="true">△</span>
      {language === "zh"
        ? "示意图 · 运动 / 距离 / 速率比例均极度夸张"
        : "SCHEMATIC · MOTION / DISTANCE / RATE RATIOS EXTREMELY EXAGGERATED"}
    </div>
  );
}

function ConsoleHeader({
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
        <span className={styles.kicker}>{copy.kicker}</span>
        <h1>{copy.title}</h1>
        <p>{copy.subtitle}</p>
      </div>
      <RatioWarning language={language} />
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
  const active = copy.beats[beat];

  return (
    <div className={styles.beatReadout} data-beat-layout-item="true">
      <div className={styles.beatLeds} aria-hidden="true">
        {copy.beats.map((item, index) => (
          <span key={item.title} data-active={index <= beat ? "true" : "false"} />
        ))}
      </div>
      <span className={styles.beatAction}>{active.action}</span>
      <strong>{active.title}</strong>
      <p>{active.body}</p>
    </div>
  );
}

function SourceReadout({
  scene,
  language,
}: {
  scene: SceneId;
  language: Language;
}) {
  return (
    <div className={styles.sourceReadout} data-beat-layout-item="true">
      <span>{language === "zh" ? "证据通道" : "EVIDENCE BUS"}</span>
      <strong>{getCopy(scene, language).evidence}</strong>
    </div>
  );
}

function FaderStrip({
  label,
  sublabel,
  level,
  direction,
  active,
  accent,
}: {
  label: string;
  sublabel: string;
  level: number;
  direction: "up" | "down";
  active: boolean;
  accent: string;
}) {
  return (
    <div
      className={styles.heroFader}
      data-fader-direction={direction}
      data-active={active ? "true" : "false"}
      style={toVars({ "--level": `${level}%`, "--fader-accent": accent })}
    >
      <div className={styles.faderScale} aria-hidden="true">
        {Array.from({ length: 9 }, (_, index) => (
          <i key={index} />
        ))}
      </div>
      <div className={styles.heroFaderTrack} aria-hidden="true">
        <span className={styles.heroFaderFill} />
        <span className={styles.heroFaderCap} />
      </div>
      <div className={styles.faderLabel}>
        <strong>{label}</strong>
        <span>{sublabel}</span>
      </div>
    </div>
  );
}

function OrbitMiniature({ beat }: { beat: number }) {
  return (
    <svg
      className={styles.orbitMiniature}
      viewBox="0 0 520 360"
      role="img"
      aria-label="Schematic coupled Earth spin and Moon orbit"
    >
      <defs>
        <radialGradient id="tidal-earth" cx="36%" cy="30%">
          <stop offset="0%" stopColor="#4eddd0" />
          <stop offset="100%" stopColor="#123746" />
        </radialGradient>
      </defs>
      <ellipse className={styles.orbitGhost} cx="260" cy="180" rx="182" ry="118" />
      <path className={styles.orbitArrow} d="M126 258 C188 318 326 324 406 246" />
      <circle cx="260" cy="180" r="72" fill="url(#tidal-earth)" />
      <path className={styles.spinArrow} d="M222 121 C172 142 166 208 210 239" />
      <circle
        className={styles.miniMoon}
        data-lifted={beat >= 2 ? "true" : "false"}
        cx="430"
        cy="116"
        r="31"
      />
      <text x="260" y="186" textAnchor="middle">EARTH</text>
      <text x="430" y="121" textAnchor="middle">MOON</text>
    </svg>
  );
}

function CoupledFaderDesk({
  beat,
  language,
}: {
  beat: number;
  language: Language;
}) {
  const earthLevel = [78, 62, 62, 62][beat];
  const moonLevel = [28, 28, 43, 43][beat];

  return (
    <div
      className={styles.coupledDesk}
      data-mixing-console="true"
      data-beat-layout-item="true"
    >
      <FaderStrip
        label="EARTH SPIN"
        sublabel={language === "zh" ? "自转通道 · 向下" : "ROTATION BUS · DOWN"}
        level={earthLevel}
        direction="down"
        active={beat >= 1}
        accent="#ff8a62"
      />
      <div className={styles.couplingCore}>
        <span className={styles.couplingLabel}>
          {language === "zh" ? "潮汐耦合" : "TIDAL COUPLING"}
        </span>
        <OrbitMiniature beat={beat} />
        <div className={styles.transferBridge} data-active={beat >= 3 ? "true" : "false"}>
          <span>SPIN</span>
          <i aria-hidden="true" />
          <span>ORBIT</span>
        </div>
      </div>
      <FaderStrip
        label="MOON ORBIT"
        sublabel={language === "zh" ? "轨道通道 · 向上" : "ORBITAL BUS · UP"}
        level={moonLevel}
        direction="up"
        active={beat >= 2}
        accent="#62dfd2"
      />
    </div>
  );
}

function FrictionChannel({
  label,
  value,
  level,
  tone,
}: {
  label: string;
  value: string;
  level: number;
  tone: "zero" | "ocean" | "terrain";
}) {
  return (
    <div
      className={styles.frictionChannel}
      data-tone={tone}
      style={toVars({ "--friction-level": `${level}%` })}
    >
      <span>{label}</span>
      <div aria-hidden="true">
        <i />
      </div>
      <strong>{value}</strong>
    </div>
  );
}

function TideFrictionDesk({ language }: { language: Language }) {
  return (
    <div className={styles.frictionDesk} data-beat-layout-item="true">
      <div className={styles.tideViewport}>
        <svg
          viewBox="0 0 820 430"
          role="img"
          aria-label={
            language === "zh"
              ? "月球引力、海洋潮汐与地形耗散示意图"
              : "Schematic Moon gravity, ocean tide, and terrain dissipation"
          }
        >
          <defs>
            <radialGradient id="friction-earth" cx="38%" cy="30%">
              <stop offset="0%" stopColor="#59e4d8" />
              <stop offset="100%" stopColor="#163242" />
            </radialGradient>
          </defs>
          <path className={styles.gravityLine} d="M445 213 L690 213" />
          <ellipse className={styles.tidalOcean} cx="328" cy="214" rx="190" ry="122" />
          <circle cx="328" cy="214" r="116" fill="url(#friction-earth)" />
          <path className={styles.coastline} d="M272 125 C315 148 342 133 370 166 C402 202 379 251 420 286 C368 315 302 317 254 286 C218 255 220 166 272 125Z" />
          <circle className={styles.frictionMoon} cx="704" cy="213" r="46" />
          <path className={styles.flowArrow} d="M190 158 C130 210 143 288 220 322" />
          <path className={styles.flowArrow} d="M466 291 C533 246 534 176 473 133" />
          <text x="328" y="220" textAnchor="middle">EARTH</text>
          <text x="704" y="220" textAnchor="middle">MOON</text>
          <text x="538" y="195" textAnchor="middle">GRAVITY</text>
        </svg>
        <div className={styles.frictionCallout}>
          <span>{language === "zh" ? "海水流动" : "OCEAN FLOW"}</span>
          <strong>
            {language === "zh"
              ? "经过海盆与海床"
              : "MEETS BASINS + SEAFLOOR"}
          </strong>
        </div>
      </div>
      <div className={styles.frictionRack}>
        <div className={styles.zeroHeader}>
          <span>{language === "zh" ? "耗散表" : "DISSIPATION METER"}</span>
          <strong>{language === "zh" ? "先归零，再加通道" : "ZERO, THEN ADD CHANNELS"}</strong>
        </div>
        <FrictionChannel
          label={language === "zh" ? "理想参考" : "IDEAL REFERENCE"}
          value={language === "zh" ? "零损耗" : "ZERO LOSS"}
          level={3}
          tone="zero"
        />
        <FrictionChannel
          label={language === "zh" ? "海洋流动" : "OCEAN FLOW"}
          value={language === "zh" ? "耗散" : "DISSIPATES"}
          level={66}
          tone="ocean"
        />
        <FrictionChannel
          label={language === "zh" ? "海盆 / 海床" : "BASIN / SEAFLOOR"}
          value={language === "zh" ? "重塑响应" : "RESHAPES RESPONSE"}
          level={48}
          tone="terrain"
        />
      </div>
    </div>
  );
}

function PhaseTorqueDesk({
  beat,
  language,
}: {
  beat: number;
  language: Language;
}) {
  return (
    <div className={styles.phaseDesk} data-beat-layout-item="true">
      <div className={styles.phaseViewport}>
        <svg
          data-orbit-diagram="true"
          viewBox="0 0 920 520"
          role="img"
          aria-label={
            language === "zh"
              ? "领先潮峰与地月扭矩方向示意图"
              : "Schematic leading tidal bulge and Earth–Moon torque directions"
          }
        >
          <defs>
            <radialGradient id="phase-earth" cx="36%" cy="30%">
              <stop offset="0%" stopColor="#62dfd2" />
              <stop offset="100%" stopColor="#142e3c" />
            </radialGradient>
            <marker id="phase-arrow" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto">
              <path d="M0 0 L10 5 L0 10 Z" fill="#f6c960" />
            </marker>
          </defs>
          <line className={styles.earthMoonLine} x1="322" y1="268" x2="760" y2="268" />
          <ellipse
            className={styles.leadingBulge}
            data-tidal-phase="ahead"
            cx="322"
            cy="268"
            rx="184"
            ry="127"
            transform="rotate(-14 322 268)"
          />
          <circle cx="322" cy="268" r="116" fill="url(#phase-earth)" />
          <path className={styles.rotationArrow} d="M236 183 C174 236 184 336 260 371" />
          <circle className={styles.phaseMoon} cx="760" cy="268" r="55" />
          <path
            className={styles.forwardTorque}
            data-torque-direction="forward"
            data-active={beat >= 1 ? "true" : "false"}
            d="M756 208 C832 164 844 105 822 60"
            markerEnd="url(#phase-arrow)"
          />
          <path
            className={styles.brakingTorque}
            data-active={beat >= 1 ? "true" : "false"}
            d="M268 371 C206 345 174 296 176 247"
            markerEnd="url(#phase-arrow)"
          />
          <text x="322" y="274" textAnchor="middle">EARTH</text>
          <text x="760" y="275" textAnchor="middle">MOON</text>
          <text className={styles.phaseLabel} x="495" y="222">EARTH–MOON LINE</text>
          <text className={styles.bulgeLabel} x="430" y="119">LEADING BULGE</text>
          <text
            className={styles.torqueLabel}
            data-active={beat >= 1 ? "true" : "false"}
            x="680"
            y="78"
            textAnchor="end"
          >
            FORWARD ORBITAL TORQUE
          </text>
        </svg>
      </div>
      <div className={styles.phaseRack}>
        <div className={styles.phaseDial} style={toVars({ "--needle-turn": beat >= 1 ? "34deg" : "18deg" })}>
          <span>{language === "zh" ? "相位表" : "PHASE"}</span>
          <div aria-hidden="true">
            <i />
          </div>
          <strong>{language === "zh" ? "领先" : "LEADS"}</strong>
        </div>
        <div className={styles.phaseStatement}>
          <span>{language === "zh" ? "关键关系" : "KEY RELATION"}</span>
          <strong>
            {language === "zh"
              ? "潮峰领先地月连线"
              : "bulge leads the Earth–Moon line"}
          </strong>
          <p>
            {language === "zh"
              ? "角度与距离均为示意，并非测量值。"
              : "Angle and distance are schematic, not measured values."}
          </p>
        </div>
      </div>
    </div>
  );
}

function LedgerMeter({
  label,
  from,
  to,
  level,
  active,
  kind,
}: {
  label: string;
  from: string;
  to: string;
  level: number;
  active: boolean;
  kind: "energy" | "angular";
}) {
  return (
    <div
      className={styles.ledger}
      data-energy-ledger={kind === "energy" ? "true" : undefined}
      data-angular-momentum-ledger={kind === "angular" ? "true" : undefined}
      data-active={active ? "true" : "false"}
      style={toVars({ "--ledger-level": `${level}%` })}
    >
      <div className={styles.ledgerHeader}>
        <span>{label}</span>
        <i aria-hidden="true" />
      </div>
      <div className={styles.ledgerRoute}>
        <strong>{from}</strong>
        <div aria-hidden="true">
          <span />
        </div>
        <strong>{to}</strong>
      </div>
      <div className={styles.ledgerMeter} aria-hidden="true">
        <i />
      </div>
    </div>
  );
}

function TransferDesk({
  beat,
  language,
}: {
  beat: number;
  language: Language;
}) {
  return (
    <div className={styles.transferDesk} data-beat-layout-item="true">
      <div className={styles.ledgerPair}>
        <LedgerMeter
          label={language === "zh" ? "能量账" : "ENERGY LEDGER"}
          from={language === "zh" ? "机械能" : "MECHANICAL ENERGY"}
          to={language === "zh" ? "热量" : "HEAT"}
          level={72}
          active={beat >= 1}
          kind="energy"
        />
        <LedgerMeter
          label={language === "zh" ? "角动量账" : "ANGULAR MOMENTUM LEDGER"}
          from={language === "zh" ? "地球自转" : "EARTH SPIN"}
          to={language === "zh" ? "月球轨道" : "LUNAR ORBIT"}
          level={86}
          active={beat >= 1}
          kind="angular"
        />
      </div>
      <div className={styles.ledgerRule} data-active={beat >= 1 ? "true" : "false"}>
        <span>{language === "zh" ? "两本不同的账" : "Different ledgers"}</span>
        <i aria-hidden="true" />
        <strong>{language === "zh" ? "同一次潮汐" : "Same tide"}</strong>
      </div>
    </div>
  );
}

function LaserEvidenceDesk({ language }: { language: Language }) {
  return (
    <div
      className={styles.laserDesk}
      data-laser-ranging="true"
      data-beat-layout-item="true"
    >
      <div className={styles.laserViewport}>
        <svg
          viewBox="0 0 920 480"
          role="img"
          aria-label={
            language === "zh"
              ? "地面激光到月面反射器的往返测距示意图"
              : "Schematic round-trip ranging laser to a lunar retroreflector"
          }
        >
          <defs>
            <linearGradient id="laser-beam" x1="0" x2="1">
              <stop offset="0%" stopColor="#62dfd2" stopOpacity="0.25" />
              <stop offset="50%" stopColor="#62dfd2" />
              <stop offset="100%" stopColor="#f6c960" />
            </linearGradient>
          </defs>
          <path className={styles.earthHorizon} d="M36 422 C166 332 304 344 392 448" />
          <path className={styles.telescopeBase} d="M146 387 L188 331 L232 386 Z" />
          <path className={styles.telescopeTube} d="M176 340 L242 270 L264 291 L198 361 Z" />
          <path className={styles.outboundLaser} d="M249 280 L758 108" />
          <path className={styles.returnLaser} d="M758 116 L254 294" />
          <circle className={styles.laserMoon} cx="790" cy="102" r="78" />
          <g data-retroreflector="true" transform="translate(736 77)">
            {Array.from({ length: 4 }, (_, row) =>
              Array.from({ length: 5 }, (_, column) => (
                <rect
                  key={`${row}-${column}`}
                  className={styles.reflectorCell}
                  x={column * 16}
                  y={row * 16}
                  width="10"
                  height="10"
                />
              )),
            )}
          </g>
          <text x="152" y="452">EARTH STATION</text>
          <text x="694" y="210">APOLLO RETROREFLECTOR</text>
          <text x="454" y="196">ROUND TRIP</text>
        </svg>
      </div>
      <div className={styles.measurementRack}>
        <span>{language === "zh" ? "当前实测退行" : "CURRENT MEASURED RECESSION"}</span>
        <strong>{language === "zh" ? "3.8 厘米 / 年" : "3.8 cm / year"}</strong>
        <p>{language === "zh" ? "激光脉冲往返时间 → 距离" : "laser round-trip time → distance"}</p>
        <div className={styles.deepTimeWarning} data-deep-time-warning="true">
          <i aria-hidden="true">!</i>
          {language === "zh"
            ? "当前速率不能作为深时的线性标尺"
            : "Today's rate is not a linear ruler for deep time"}
        </div>
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
  language: Language;
}) {
  if (scene === 1) {
    return <CoupledFaderDesk beat={beat} language={language} />;
  }
  if (scene === 2) {
    return <TideFrictionDesk language={language} />;
  }
  if (scene === 3) {
    return <PhaseTorqueDesk beat={beat} language={language} />;
  }
  if (scene === 4) {
    return <TransferDesk beat={beat} language={language} />;
  }
  return <LaserEvidenceDesk language={language} />;
}

function ScenePanel({
  scene,
  beat,
  language,
  isActive,
}: {
  scene: SceneId;
  beat: number;
  language: Language;
  isActive: boolean;
}) {
  return (
    <section
      className={styles.scene}
      data-local-scene={scene}
      data-local-beat={beat}
      data-active={isActive ? "true" : "false"}
    >
      <ConsoleHeader scene={scene} language={language} />
      <SceneVisual scene={scene} beat={beat} language={language} />
      <div className={styles.bottomRail} data-beat-layout-item="true">
        <BeatReadout scene={scene} beat={beat} language={language} />
        <SourceReadout scene={scene} language={language} />
      </div>
    </section>
  );
}

function TidalFaderNavigation({
  scene,
  language,
  onNavigate,
}: {
  scene: SceneId;
  language: Language;
  onNavigate?: (scene: number, beat: number) => void;
}) {
  const navigate = (target: SceneId) => onNavigate?.(target, 0);

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLButtonElement>,
    target: SceneId,
  ) => {
    if (event.key === "Enter" || event.key === " ") {
      event.stopPropagation();
      return;
    }

    let next: SceneId | null = null;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      next = Math.min(5, target + 1) as SceneId;
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      next = Math.max(1, target - 1) as SceneId;
    } else if (event.key === "Home") {
      next = 1;
    } else if (event.key === "End") {
      next = 5;
    }

    if (next !== null) {
      event.preventDefault();
      event.stopPropagation();
      navigate(next);
    }
  };

  return (
    <nav
      className={styles.tidalNavigation}
      data-topic-navigation="true"
      data-navigation-geometry="object-controller"
      data-navigation-carrier="tidal-fader-bank"
      data-navigation-invocation="proximity-reveal"
      data-navigation-feedback="material-color-change"
      aria-label={language === "zh" ? "潮汐推子场景导航" : "Tidal fader scene navigation"}
      onClick={(event) => event.stopPropagation()}
      onPointerDown={(event) => event.stopPropagation()}
      onTouchStart={(event) => event.stopPropagation()}
    >
      <span className={styles.navLegend}>
        {language === "zh" ? "场景推子" : "SCENE FADERS"}
      </span>
      <div className={styles.navBank}>
        {SCENE_IDS.map((target, index) => {
          const active = target === scene;
          return (
            <button
              key={target}
              type="button"
              className={styles.navFader}
              data-active={active ? "true" : "false"}
              style={toVars({ "--nav-level": `${NAV_LEVELS[index]}%` })}
              aria-label={`Scene ${target}: ${NAV_LABELS[language][index]}`}
              aria-current={active ? "step" : undefined}
              onClick={(event) => {
                event.stopPropagation();
                navigate(target);
              }}
              onPointerDown={(event) => event.stopPropagation()}
              onKeyDown={(event) => handleKeyDown(event, target)}
            >
              <span className={styles.navTrack} aria-hidden="true">
                <i />
              </span>
              <strong>{String(target).padStart(2, "0")}</strong>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

export default function TidalTime({
  scene,
  beat,
  language,
  isThumbnail,
  reducedMotion,
  onNavigate,
}: BespokeStyleProps) {
  const safeScene = toSceneId(scene);
  const safeBeat = clampBeat(safeScene, beat);
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
      data-topic-id="tidal-time"
      data-language={language}
      data-motion={motionFrozen ? "off" : "on"}
    >
      <div className={styles.hardwareFrame} aria-hidden="true" />
      <SpatialSceneTrack
        scene={safeScene}
        beat={safeBeat}
        sceneIds={SCENE_IDS}
        transitionKind="push-y"
        transitionMap={TRANSITION_MAP}
        transitionDurationMs={500}
        reducedMotion={motionFrozen}
        beatLayoutModes={BEAT_LAYOUT_MODES}
        className={styles.sceneTrack}
        renderScene={(trackScene, trackBeat, isActive) => {
          const panelScene = toSceneId(trackScene);
          return (
            <ScenePanel
              scene={panelScene}
              beat={clampBeat(panelScene, trackBeat)}
              language={language}
              isActive={isActive}
            />
          );
        }}
      />
      {!isThumbnail ? (
        <TidalFaderNavigation
          scene={safeScene}
          language={language}
          onNavigate={onNavigate}
        />
      ) : null}
    </div>
  );
}

export const tidalTimeTopic = defineStyleTopic({
  id: "tidal-time",
  topic: {
    en: "Tidal Time",
    zh: "潮汐时差",
  },
  model: "GPT-5.5",
  component: TidalTime,
  getMetadata,
  navigation: {
    geometry: "object-controller",
    carrier: "tidal-fader-bank",
    invocation: "proximity-reveal",
    feedback: "material-color-change",
  },
  sources: TIDAL_TIME_SOURCES,
  transitionScore: TIDAL_TIME_TRANSITION_SCORE,
});

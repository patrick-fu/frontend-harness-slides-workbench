import type React from "react";
import type { Source } from "../domain/evidence";
import {
  defineTopic,
  type TopicMetadata,
  type TopicStageProps,
  type TopicTransitionScore,
} from "../domain/topic";
import SpatialSceneTrack, {
  type BeatLayoutMode,
  type SceneTransitionMap,
} from "../components/stage/SpatialSceneTrack";
import styles from "./snowflake-branches.module.css";

type Lang = "en" | "zh";

type BeatCopy = {
  action: string;
  title: string;
  body: string;
};

type SceneCopy = {
  kicker: string;
  title: string;
  body: string;
  note: string;
  beats: BeatCopy[];
};

const SCENES: Record<number, Record<Lang, SceneCopy>> = {
  1: {
    en: {
      kicker: "01 / MOLECULE HOPPER",
      title: "One molecule enters a cold field",
      body: "Water vapor joins a growing ice crystal. The morphology machine is still at rest.",
      note: "DEPOSITION, NOT A FROZEN RAINDROP",
      beats: [
        {
          action: "Admit one water molecule",
          title: "Vapor reaches the seed",
          body: "A molecule crosses the cold boundary and approaches the ice surface.",
        },
      ],
    },
    zh: {
      kicker: "01 / 分子进料斗",
      title: "一个水分子进入冷场",
      body: "水汽加入正在生长的冰晶，形态机器还没有启动。",
      note: "凝华生长，不是雨滴直接冻结",
      beats: [
        {
          action: "放入一个水分子",
          title: "水汽抵达晶核",
          body: "一个分子穿过低温边界，靠近冰晶表面。",
        },
      ],
    },
  },
  2: {
    en: {
      kicker: "02 / HEX LATTICE",
      title: "The lattice sets six directions",
      body: "Hexagonal ice supplies the molecular-scale origin of a crystal's sixfold symmetry.",
      note: "ONE LATTICE · SIX EQUIVALENT DIRECTIONS",
      beats: [
        {
          action: "Engage the hexagonal lattice",
          title: "Sixfold order appears",
          body: "Seven linked cells reveal a center and six neighboring directions.",
        },
      ],
    },
    zh: {
      kicker: "02 / 六角晶格",
      title: "晶格给出六个方向",
      body: "六方冰的分子排列，提供了雪晶六重对称的微观来源。",
      note: "一个晶格 · 六个等价方向",
      beats: [
        {
          action: "咬合六角晶格",
          title: "六重秩序出现",
          body: "七个相连晶胞显出一个中心和六个相邻方向。",
        },
      ],
    },
  },
  3: {
    en: {
      kicker: "03 / CONDITION GATES",
      title: "Conditions route form, not rank",
      body: "Temperature shifts the plate–column habit; supersaturation helps set how simple or branched growth becomes.",
      note: "SCHEMATIC GATES · NOT A PREDICTIVE LOOKUP",
      beats: [
        {
          action: "Open the temperature gate",
          title: "Habit gate",
          body: "Different temperature ranges favor plate-like or column-like growth.",
        },
        {
          action: "Open the supersaturation gate",
          title: "Complexity gate",
          body: "More available vapor can drive stronger morphological instability and branching.",
        },
      ],
    },
    zh: {
      kicker: "03 / 条件闸门",
      title: "条件导向形态，不做排名",
      body: "温度改变板状—柱状习性；过饱和度影响生长是简单还是更易分枝。",
      note: "条件闸门为示意图 · 不是预测查询表",
      beats: [
        {
          action: "开启温度闸门",
          title: "晶体习性闸门",
          body: "不同温区会偏向板状或柱状生长。",
        },
        {
          action: "开启过饱和闸门",
          title: "复杂度闸门",
          body: "可用水汽增多时，形态不稳定性与分枝可以更强。",
        },
      ],
    },
  },
  4: {
    en: {
      kicker: "04 / BRANCH GROWTH",
      title: "Six arms share a field—not a stencil",
      body: "Nearby tips experience similar conditions, while tiny differences in arrival and surface shape diverge as growth continues.",
      note: "RELATED ARMS · DELIBERATELY NON-IDENTICAL",
      beats: [
        {
          action: "Start six growth fronts",
          title: "Six tips enter one local field",
          body: "The lattice directions organize six simultaneous growth fronts.",
        },
        {
          action: "Introduce microscopic variation",
          title: "One tip catches vapor first",
          body: "A small protrusion intercepts more diffusing vapor than the surface behind it.",
        },
        {
          action: "Amplify the variations",
          title: "Small perturbations grow",
          body: "Branching magnifies small differences, so the arms stay related without becoming copies.",
        },
      ],
    },
    zh: {
      kicker: "04 / 分枝生长",
      title: "六条晶臂共享环境，不共用模板",
      body: "相邻尖端经历相近条件，但分子到达与表面形状的微小差异会随生长逐渐拉开。",
      note: "晶臂彼此相关 · 刻意不做完全复制",
      beats: [
        {
          action: "启动六个生长前沿",
          title: "六个尖端进入同一局部场",
          body: "晶格方向组织出六个同时推进的生长前沿。",
        },
        {
          action: "加入微观扰动",
          title: "一个尖端先截获水汽",
          body: "细小凸起比后方表面更早遇到扩散来的水汽。",
        },
        {
          action: "放大这些差异",
          title: "微小扰动被放大",
          body: "分枝会放大细微差别，因此晶臂相似，却不会成为复制品。",
        },
      ],
    },
  },
  5: {
    en: {
      kicker: "05 / SPECIMEN TRAY",
      title: "The cloud produces a family, not an icon",
      body: "Plates, columns, branched crystals, and damaged forms record different conditions and growth histories.",
      note: "GENERATED MORPHOLOGY · NOT AN OBSERVATION",
      beats: [
        {
          action: "Load plate-like forms",
          title: "Plates enter the tray",
          body: "Thin, faceted forms establish the first morphology family.",
        },
        {
          action: "Add column-like forms",
          title: "Columns join the tray",
          body: "Growth along the crystal axis adds a different habit.",
        },
        {
          action: "Add branching forms",
          title: "Instability leaves branches",
          body: "Complex outlines appear without erasing their sixfold origin.",
        },
        {
          action: "Settle the irregular collection",
          title: "History leaves imperfect specimens",
          body: "The complete tray is diverse, asymmetric, and presented without a preferred form.",
        },
      ],
    },
    zh: {
      kicker: "05 / 标本盘",
      title: "云中生成的是家族，不是图标",
      body: "板状、柱状、分枝与受损形态，记录了不同条件和生长历史。",
      note: "生成式形态示意 · 不是真实观测",
      beats: [
        {
          action: "装入板状形态",
          title: "薄板进入标本盘",
          body: "薄而有晶面的形态建立第一组形态家族。",
        },
        {
          action: "加入柱状形态",
          title: "柱体加入标本盘",
          body: "沿晶轴方向的生长带来另一种晶体习性。",
        },
        {
          action: "加入分枝形态",
          title: "不稳定性留下分枝",
          body: "复杂轮廓出现，但仍保留六重来源。",
        },
        {
          action: "让不规则集合就位",
          title: "生长历史留下不完美标本",
          body: "完整标本盘多样、不对称，也不偏好其中任何一种形态。",
        },
      ],
    },
  },
};

const NAV_LABELS: Record<Lang, string[]> = {
  en: [
    "molecule hopper",
    "hex lattice",
    "condition gates",
    "branch growth",
    "specimen tray",
  ],
  zh: ["分子进料斗", "六角晶格", "条件闸门", "分枝生长", "标本盘"],
};

const BEAT_LAYOUT_MODES: Record<number, BeatLayoutMode> = {
  1: "reserved",
  2: "reserved",
  3: "reserved",
  4: "reserved",
  5: "reserved",
};

export const SNOWFLAKE_BRANCHES_TRANSITION_SCORE = {
  "1->2": "grid-reveal",
  "2->3": "push-y",
  "3->4": "afterimage",
  "4->5": "push-y",
} as const satisfies TopicTransitionScore;

const TRANSITION_MAP: SceneTransitionMap =
  SNOWFLAKE_BRANCHES_TRANSITION_SCORE;

export const SNOWFLAKE_BRANCHES_SOURCES = [
  {
    authority: "NOAA National Environmental Satellite, Data, and Information Service",
    title: "How Do Snowflakes Form?",
    url: "https://www.nesdis.noaa.gov/about/k-12-education/ice-snow/how-do-snowflakes-form",
    supports:
      "Supports vapor deposition, the six-sided ice structure, branch-tip growth, and the role of changing temperature and moisture through a crystal's history.",
  },
  {
    authority: "California Institute of Technology — CaltechAUTHORS",
    citation: "Libbrecht, K. G. (2005), The physics of snow crystals, Reports on Progress in Physics 68",
    url: "https://authors.library.caltech.edu/records/70qmc-09861",
    supports:
      "Peer-reviewed review supporting vapor-phase crystal growth, temperature-dependent morphology, diffusion, surface attachment kinetics, and growth instabilities.",
  },
  {
    authority: "Hokkaido University Institute of Low Temperature Science",
    title: "Fundamental patterns of snow crystals",
    url: "https://www2.lowtem.hokudai.ac.jp/ptdice/english/ss2.html",
    supports:
      "Supports the Nakaya morphology axes: habit changes with temperature and increasing morphological instability with supersaturation.",
  },
  {
    citation: "Libbrecht, K. G. (2023), A Taxonomy of Snow Crystal Growth Behaviors: 2. Quantifying the Nakaya Diagram",
    url: "https://arxiv.org/abs/2306.13087",
    supports:
      "Original controlled-growth dataset supporting a range of crystal morphologies produced under known temperature and supersaturation conditions.",
  },
] as const satisfies readonly Source[];

function clampScene(scene: number): number {
  return Math.max(1, Math.min(5, scene));
}

function clampBeat(scene: number, beat: number): number {
  const lastBeat = SCENES[scene].en.beats.length - 1;
  return Math.max(0, Math.min(lastBeat, beat));
}

function getCopy(scene: number, lang: Lang): SceneCopy {
  return SCENES[scene]?.[lang] ?? SCENES[1][lang];
}

function buildMetadata(lang: Lang): TopicMetadata {
  const isZh = lang === "zh";
  return {
    theme: isZh ? "雪花如何长出分支" : "How a Snowflake Chooses Its Branches",
    densityLabel: isZh ? "图解型 · 中等密度" : "Diagram explainer · Medium",
    heroScene: 4,
    colors: {
      bg: "#050b16",
      ink: "#eefaff",
      panel: "#0b1930",
    },
    typography: {
      header: "Arial Black 800",
      body: "Arial 500",
    },
    tags: [
      "diagram-explainer",
      "snow-crystal",
      "morphology",
      "physics",
      "mechanical",
      "dark",
      "medium-density",
      "shape-morph",
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

function MoleculeHopper({ lang }: { lang: Lang }) {
  return (
    <div
      className={styles.hopperAssembly}
      data-molecule-hopper="true"
      data-beat-layout-item="true"
    >
      <div className={styles.coldGauge}>
        <span>{lang === "zh" ? "冷场" : "COLD FIELD"}</span>
        <i />
      </div>
      <svg
        className={styles.hopperSvg}
        viewBox="0 0 920 620"
        role="img"
        aria-label={lang === "zh" ? "水分子进入冷场的示意图" : "Diagram of a water molecule entering a cold field"}
      >
        <defs>
          <linearGradient id="snow-hopper" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#122f52" />
            <stop offset="1" stopColor="#071225" />
          </linearGradient>
          <filter id="snow-glow">
            <feGaussianBlur stdDeviation="12" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <path
          d="M90 70 H830 L650 330 V510 H270 V330 Z"
          fill="url(#snow-hopper)"
          stroke="#31d7ff"
          strokeWidth="8"
        />
        <path
          d="M122 104 H798 L620 350 V470 H300 V350 Z"
          fill="none"
          stroke="#506783"
          strokeWidth="3"
          strokeDasharray="14 18"
        />
        <path d="M460 20 V178" stroke="#9cecff" strokeWidth="6" />
        <g className={styles.molecule} filter="url(#snow-glow)">
          <line x1="460" y1="182" x2="404" y2="228" stroke="#d7f6ff" strokeWidth="12" />
          <line x1="460" y1="182" x2="516" y2="228" stroke="#d7f6ff" strokeWidth="12" />
          <circle cx="460" cy="182" r="42" fill="#31d7ff" />
          <circle cx="397" cy="236" r="25" fill="#f8fdff" />
          <circle cx="523" cy="236" r="25" fill="#f8fdff" />
          <text x="460" y="194" textAnchor="middle" fill="#05101d" fontSize="30" fontWeight="900">O</text>
          <text x="397" y="246" textAnchor="middle" fill="#05101d" fontSize="22" fontWeight="900">H</text>
          <text x="523" y="246" textAnchor="middle" fill="#05101d" fontSize="22" fontWeight="900">H</text>
        </g>
        <path d="M326 530 H594" stroke="#31d7ff" strokeWidth="8" strokeLinecap="round" />
        <path d="M360 556 H560" stroke="#6b84a0" strokeWidth="3" strokeLinecap="round" />
      </svg>
      <div className={styles.machineReadout}>
        <span>{lang === "zh" ? "状态" : "STATE"}</span>
        <strong>{lang === "zh" ? "晶核等待" : "SEED WAITING"}</strong>
      </div>
    </div>
  );
}

const LATTICE_CELLS = [
  [460, 310],
  [460, 158],
  [592, 234],
  [592, 386],
  [460, 462],
  [328, 386],
  [328, 234],
] as const;

function HexLattice({ lang }: { lang: Lang }) {
  return (
    <div className={styles.latticeAssembly} data-beat-layout-item="true">
      <svg
        className={styles.latticeSvg}
        viewBox="0 0 920 620"
        role="img"
        aria-label={lang === "zh" ? "七个六角晶胞相连的示意图" : "Diagram of seven connected hexagonal lattice cells"}
      >
        <g className={styles.latticeLinks}>
          {LATTICE_CELLS.slice(1).map(([x, y], index) => (
            <line key={index} x1="460" y1="310" x2={x} y2={y} />
          ))}
        </g>
        {LATTICE_CELLS.map(([x, y], index) => (
          <g
            key={`${x}-${y}`}
            data-lattice-cell="true"
            className={index === 0 ? styles.latticeCenter : styles.latticeCell}
            transform={`translate(${x} ${y})`}
          >
            <polygon points="0,-73 63,-36 63,36 0,73 -63,36 -63,-36" />
            <circle r="13" />
            {index > 0 ? <text y="6" textAnchor="middle">{index}</text> : null}
          </g>
        ))}
      </svg>
      <div className={styles.directionRing} aria-hidden="true">
        {[0, 1, 2, 3, 4, 5].map((index) => (
          <i key={index} style={{ transform: `rotate(${index * 60}deg)` }} />
        ))}
        <span>6×</span>
      </div>
      <div className={styles.machineReadout}>
        <span>{lang === "zh" ? "晶格输出" : "LATTICE OUTPUT"}</span>
        <strong>{lang === "zh" ? "六重对称" : "SIXFOLD ORDER"}</strong>
      </div>
    </div>
  );
}

function ConditionGates({ lang, beat }: { lang: Lang; beat: number }) {
  const temperatureActive = beat >= 0;
  const saturationActive = beat >= 1;
  return (
    <div className={styles.gateAssembly} data-beat-layout-item="true">
      <div className={styles.inputCrystal} aria-hidden="true">
        <span />
        <i />
      </div>
      <div
        className={`${styles.conditionGate} ${temperatureActive ? styles.gateActive : ""}`}
        data-condition-gate="true"
        data-gate-state={temperatureActive ? "open" : "waiting"}
      >
        <div className={styles.gateHeader}>
          <span>GATE A</span>
          <strong>{lang === "zh" ? "温度" : "Temperature"}</strong>
        </div>
        <div className={styles.gateScale}>
          <i />
          <i />
          <i />
          <i />
          <i />
        </div>
        <div className={styles.habitOutput}>
          <span>PLATE</span>
          <b>↔</b>
          <span>COLUMN</span>
        </div>
      </div>
      <div className={styles.routeTube} aria-hidden="true"><i /></div>
      <div
        className={`${styles.conditionGate} ${styles.saturationGate} ${saturationActive ? styles.gateActive : ""}`}
        data-condition-gate="true"
        data-gate-state={saturationActive ? "open" : "waiting"}
      >
        <div className={styles.gateHeader}>
          <span>GATE B</span>
          <strong>{lang === "zh" ? "过饱和度" : "Supersaturation"}</strong>
        </div>
        <div className={styles.vaporBars}>
          {[1, 2, 3, 4, 5, 6].map((value) => <i key={value} />)}
        </div>
        <div className={styles.habitOutput}>
          <span>{lang === "zh" ? "简单" : "SIMPLE"}</span>
          <b>→</b>
          <span>{lang === "zh" ? "分枝" : "BRANCHED"}</span>
        </div>
      </div>
    </div>
  );
}

const ARM_PATHS = [
  "M0 0 H214 M80 0 L116 -42 M102 0 L142 47 M150 0 L180 -34",
  "M0 0 H205 M66 0 L96 -35 M116 0 L151 43 M158 0 L188 -26",
  "M0 0 H220 M76 0 L110 -46 M128 0 L165 38 M174 0 L202 -39",
  "M0 0 H198 M58 0 L88 -30 M106 0 L139 49 M148 0 L178 -32",
  "M0 0 H216 M72 0 L107 -41 M120 0 L157 35 M166 0 L194 -45",
  "M0 0 H208 M64 0 L99 -38 M110 0 L146 45 M160 0 L190 -30",
] as const;

function BranchCrystal({ lang, beat }: { lang: Lang; beat: number }) {
  return (
    <div className={styles.branchAssembly} data-beat-layout-item="true">
      <div className={styles.vaporField} aria-hidden="true">
        {Array.from({ length: 18 }, (_, index) => <i key={index} />)}
      </div>
      <svg
        className={`${styles.branchSvg} ${styles[`branchBeat${beat}`]}`}
        viewBox="0 0 720 720"
        role="img"
        aria-label={lang === "zh" ? "六条不完全相同晶臂的生长示意图" : "Growth diagram of six non-identical crystal arms"}
      >
        <circle className={styles.fieldRing} cx="360" cy="360" r="286" />
        <circle className={styles.fieldRingInner} cx="360" cy="360" r="190" />
        <g transform="translate(360 360)">
          {ARM_PATHS.map((path, index) => (
            <g
              key={path}
              data-crystal-arm="true"
              data-arm-variant={`v${index + 1}`}
              className={styles.crystalArm}
              transform={`rotate(${index * 60})`}
            >
              <path d={path} />
              {beat >= 1 && index === 1 ? (
                <circle className={styles.perturbation} cx="205" cy="0" r="11" />
              ) : null}
            </g>
          ))}
          <polygon className={styles.crystalCore} points="0,-34 30,-17 30,17 0,34 -30,17 -30,-17" />
        </g>
      </svg>
      <div className={styles.branchTelemetry}>
        <span className={beat >= 0 ? styles.telemetryOn : ""}>6 {lang === "zh" ? "方向" : "DIRECTIONS"}</span>
        <span className={beat >= 1 ? styles.telemetryOn : ""}>+ {lang === "zh" ? "扰动" : "PERTURBATION"}</span>
        <span className={beat >= 2 ? styles.telemetryOn : ""}>× {lang === "zh" ? "放大" : "AMPLIFICATION"}</span>
      </div>
    </div>
  );
}

function SpecimenGlyph({ variant }: { variant: number }) {
  if (variant === 0) {
    return (
      <svg viewBox="0 0 220 160" aria-hidden="true">
        <polygon points="110,20 178,53 165,120 102,141 39,111 48,48" />
        <path d="M110 20 L102 141 M39 111 L178 53 M48 48 L165 120" />
      </svg>
    );
  }
  if (variant === 1) {
    return (
      <svg viewBox="0 0 220 160" aria-hidden="true">
        <path d="M71 40 L109 20 L151 42 V120 L111 142 L68 118 Z" />
        <path d="M71 40 L111 62 L151 42 M111 62 V142" />
      </svg>
    );
  }
  if (variant === 2) {
    return (
      <svg viewBox="0 0 220 160" aria-hidden="true">
        <path d="M110 80 L110 18 M110 80 L169 45 M110 80 L171 116 M110 80 L109 144 M110 80 L49 119 M110 80 L45 47" />
        <path d="M110 42 L128 31 M145 59 L163 65 M144 101 L158 89 M109 119 L92 129 M76 100 L58 91 M76 60 L64 76" />
      </svg>
    );
  }
  if (variant === 3) {
    return (
      <svg viewBox="0 0 220 160" aria-hidden="true">
        <path d="M110 80 L112 23 M110 80 L164 48 M110 80 L170 112 M110 80 L106 139 M110 80 L53 116 M110 80 L48 49" />
        <path d="M111 48 L128 38 M143 61 L158 67 M145 100 L160 88 M107 115 L91 125 M78 100 L62 92 M76 62 L63 76" />
      </svg>
    );
  }
  if (variant === 4) {
    return (
      <svg viewBox="0 0 220 160" aria-hidden="true">
        <path d="M109 78 L106 20 M109 78 L170 46 M109 78 L165 118 M109 78 L110 143 M109 78 L45 114 M109 78 L51 49" />
        <path d="M106 48 L124 36 M145 59 L163 69 M143 104 L156 91 M110 117 L94 129 M76 97 L59 88" />
        <path className={styles.brokenEdge} d="M51 49 L69 58" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 220 160" aria-hidden="true">
      <path d="M69 61 L110 38 L151 60 V99 L109 124 L68 100 Z" />
      <path d="M69 61 L110 83 L151 60 M110 83 L109 124" />
      <path d="M74 47 L108 27 L146 48 M72 112 L109 134 L148 110" />
    </svg>
  );
}

const SPECIMEN_REVEAL = [2, 3, 5, 6] as const;

function SpecimenTray({ lang, beat }: { lang: Lang; beat: number }) {
  const visibleCount = SPECIMEN_REVEAL[beat] ?? 6;
  const labels = lang === "zh"
    ? ["不齐整薄板", "短柱", "分区薄板", "偏枝晶", "受损枝晶", "帽柱"]
    : ["uneven plate", "short column", "sectored plate", "biased dendrite", "damaged branch", "capped column"];
  return (
    <div className={styles.trayAssembly} data-beat-layout-item="true">
      <div className={styles.trayRail} aria-hidden="true"><i /><i /><i /></div>
      <div className={styles.specimenGrid}>
        {labels.map((label, index) => (
          <figure
            key={label}
            data-imperfect-specimen="true"
            data-specimen-state={index < visibleCount ? "loaded" : "queued"}
            className={index < visibleCount ? styles.specimenLoaded : styles.specimenQueued}
          >
            <div className={styles.specimenWindow}><SpecimenGlyph variant={index} /></div>
            <figcaption>
              <span>0{index + 1}</span>
              <strong>{label}</strong>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}

function MorphologyDial({
  scene,
  lang,
  onNavigate,
}: {
  scene: number;
  lang: Lang;
  onNavigate?: (scene: number, beat: number) => void;
}) {
  const navigate = (target: number) => {
    onNavigate?.(Math.max(1, Math.min(5, target)), 0);
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLButtonElement>,
    current: number,
  ) => {
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
      event.stopPropagation();
      navigate(target);
    }
  };

  return (
    <nav
      className={styles.morphologyDial}
      aria-label={lang === "zh" ? "晶体形态旋钮导航" : "Crystal morphology dial navigation"}
      data-topic-navigation="true"
      data-navigation-geometry="object-controller"
      data-navigation-carrier="crystal-morphology-dial"
      data-navigation-invocation="keyboard-focus"
      data-navigation-feedback="history-trail"
    >
      <div className={styles.dialCrown} aria-hidden="true"><i /><span>◇</span><i /></div>
      <div className={styles.dialTrack} aria-hidden="true" />
      {NAV_LABELS[lang].map((label, index) => {
        const target = index + 1;
        const isCurrent = target === scene;
        const isSeen = target <= scene;
        return (
          <button
            key={label}
            type="button"
            className={`${styles.dialStop} ${isCurrent ? styles.dialStopCurrent : ""}`}
            aria-label={`Scene ${target}: ${label}`}
            aria-current={isCurrent ? "step" : undefined}
            data-history-mark={isSeen ? "seen" : "unseen"}
            onPointerDown={(event) => event.stopPropagation()}
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              navigate(target);
            }}
            onKeyDown={(event) => handleKeyDown(event, target)}
          >
            <span>{target}</span>
            <i />
          </button>
        );
      })}
      <div className={styles.dialLabel} aria-hidden="true">
        <span>MORPH</span>
        <b>{String(scene).padStart(2, "0")}</b>
      </div>
    </nav>
  );
}

function ScenePanel({
  scene,
  beat,
  lang,
}: {
  scene: number;
  beat: number;
  lang: Lang;
}) {
  const safeBeat = clampBeat(scene, beat);
  const copy = getCopy(scene, lang);
  const beatCopy = copy.beats[safeBeat];

  return (
    <section
      className={`${styles.scene} ${styles[`scene${scene}`]}`}
      data-scene-content={scene}
      data-beat={safeBeat}
      aria-label={copy.title}
    >
      <header className={styles.sceneHeader} data-beat-layout-item="true">
        <span className={styles.kicker}>{copy.kicker}</span>
        <h1>{copy.title}</h1>
        <p>{copy.body}</p>
      </header>

      <div className={styles.sceneVisual} data-beat-layout-item="true">
        {scene === 1 ? <MoleculeHopper lang={lang} /> : null}
        {scene === 2 ? <HexLattice lang={lang} /> : null}
        {scene === 3 ? <ConditionGates lang={lang} beat={safeBeat} /> : null}
        {scene === 4 ? <BranchCrystal lang={lang} beat={safeBeat} /> : null}
        {scene === 5 ? <SpecimenTray lang={lang} beat={safeBeat} /> : null}
      </div>

      <aside className={styles.beatReadout} data-beat-layout-item="true">
        <span>{String(safeBeat + 1).padStart(2, "0")} / {String(copy.beats.length).padStart(2, "0")}</span>
        <div>
          <strong>{beatCopy.title}</strong>
          <p>{beatCopy.body}</p>
        </div>
      </aside>

      <footer className={styles.sceneNote} data-beat-layout-item="true">
        <span>{copy.note}</span>
        <i />
        <b>SCHEMATIC</b>
      </footer>
    </section>
  );
}

const METADATA = {
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
  const safeScene = clampScene(scene);
  const motionOff = reducedMotion || isThumbnail;

  return (
    <div
      className={`${styles.root} ${motionOff ? styles.motionOff : ""} ${isThumbnail ? styles.thumbnail : ""}`}
      data-topic-id="snowflake-branches"
      data-language={language}
      data-motion={motionOff ? "off" : "on"}
    >
      <div className={styles.machineFrame} aria-hidden="true">
        <span /><span /><span /><span />
      </div>
      <SpatialSceneTrack
        scene={safeScene}
        beat={beat}
        transitionKind="grid-reveal"
        transitionMap={TRANSITION_MAP}
        transitionDurationMs={720}
        reducedMotion={motionOff}
        beatLayoutModes={BEAT_LAYOUT_MODES}
        renderScene={(sceneId, sceneBeat) => (
          <ScenePanel scene={sceneId} beat={sceneBeat} lang={language} />
        )}
      />
      {!isThumbnail ? (
        <MorphologyDial
          scene={safeScene}
          lang={language}
          onNavigate={onNavigate}
        />
      ) : null}
    </div>
  );
}

export default defineTopic({
  id: "snowflake-branches",
  styleId: "mechanical-scoring-funnel",
  title: { en: "Snowflake Branches", zh: "雪花分支" },
  modelId: "GPT 5.6 Sol",
  Stage: TopicStage,
  metadata: METADATA,
  navigation: {
    geometry: "object-controller",
    carrier: "crystal-morphology-dial",
    invocation: "keyboard-focus",
    feedback: "history-trail",
  },
  transitionScore: SNOWFLAKE_BRANCHES_TRANSITION_SCORE,
  evidence: {
    kind: "facts",
    sources: SNOWFLAKE_BRANCHES_SOURCES,
  },
});

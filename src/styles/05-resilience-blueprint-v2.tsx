import type { BespokeStyleProps, StyleMetadata } from "../types";
import SpatialSceneTrack from "./SpatialSceneTrack";
import { defineStyleVersion } from "./version";
import styles from "./05-resilience-blueprint-v2.module.css";

type Lang = "en" | "zh";
type SceneId = 1 | 2 | 3 | 4 | 5;

interface BeatCopy {
  id: number;
  action: string;
  title: string;
  body: string;
}

interface SceneCopy {
  tab: string;
  title: string;
  shortTitle: string;
  kicker: string;
  titleBlock: string[];
  legend: string[];
  callouts: string[];
  beats: BeatCopy[];
}

const SCENE_IDS: SceneId[] = [1, 2, 3, 4, 5];

const TRANSITION_MAP = {
  "1->2": "wipe",
  "2->3": "slide-x",
  "3->4": "scale-fade",
  "4->5": "hard-cut",
} as const;

const BEAT_LAYOUT_MODES = {
  1: "reserved",
  2: "reserved",
  3: "reserved",
  4: "reserved",
  5: "reserved",
} as const;

const COPY: Record<SceneId, Record<Lang, SceneCopy>> = {
  1: {
    en: {
      tab: "SHEET 01",
      title: "Resilience Blueprint",
      shortTitle: "Title",
      kicker: "A system drawn to bend before it breaks.",
      titleBlock: ["REV V2", "SCALE 1:5", "BASELINE LOAD", "RECOVERY GRID"],
      legend: ["Frame", "Reserve", "Route"],
      callouts: ["Define the safe boundary", "Mark spare capacity", "Keep recovery paths visible"],
      beats: [
        {
          id: 0,
          action: "Place the title sheet and baseline frame.",
          title: "Title sheet",
          body: "The resilience plan starts with a bounded drawing surface.",
        },
        {
          id: 1,
          action: "Reveal capacity margins around the core frame.",
          title: "Safe margins",
          body: "Reserve zones are named before stress arrives.",
        },
        {
          id: 2,
          action: "Add the recovery legend and revision block.",
          title: "Recovery legend",
          body: "Every later sheet reuses the same drawing key.",
        },
      ],
    },
    zh: {
      tab: "图纸 01",
      title: "韧性蓝图",
      shortTitle: "标题",
      kicker: "先画出可弯曲的系统，再讨论如何避免断裂。",
      titleBlock: ["修订 V2", "比例 1:5", "基准负载", "恢复网格"],
      legend: ["边界", "余量", "路径"],
      callouts: ["先定义安全边界", "提前标出备用容量", "让恢复路径始终可见"],
      beats: [
        {
          id: 0,
          action: "放置标题图纸和基准框架。",
          title: "标题图纸",
          body: "韧性计划从一个有边界的绘图面开始。",
        },
        {
          id: 1,
          action: "揭示核心框架外的容量余量。",
          title: "安全余量",
          body: "压力到来前，备用区域已经被命名。",
        },
        {
          id: 2,
          action: "加入恢复图例和修订栏。",
          title: "恢复图例",
          body: "后续图纸共用同一套绘图键。",
        },
      ],
    },
  },
  2: {
    en: {
      tab: "SHEET 02",
      title: "System Layers",
      shortTitle: "Layers",
      kicker: "Resilience is easier to inspect when every layer has a job.",
      titleBlock: ["LAYER STACK", "CAPACITY BAND", "SERVICE JOINTS", "OPERATOR LOOP"],
      legend: ["Ingress", "Services", "Data", "Operators"],
      callouts: ["Ingress absorbs noise", "Services isolate change", "Data keeps a clean ledger"],
      beats: [
        {
          id: 0,
          action: "Draw the substrate and ingress plane.",
          title: "Ingress plane",
          body: "External load first meets a controlled entry layer.",
        },
        {
          id: 1,
          action: "Reveal service and data planes.",
          title: "Service stack",
          body: "Core services and state are separated for inspection.",
        },
        {
          id: 2,
          action: "Add the operator feedback layer.",
          title: "Operator loop",
          body: "Human review is drawn as part of the system, not outside it.",
        },
      ],
    },
    zh: {
      tab: "图纸 02",
      title: "系统分层",
      shortTitle: "分层",
      kicker: "每一层都有职责，韧性才容易被检查。",
      titleBlock: ["层级堆栈", "容量带", "服务连接", "人工回路"],
      legend: ["入口", "服务", "数据", "人工"],
      callouts: ["入口吸收噪声", "服务隔离变化", "数据保留清洁账本"],
      beats: [
        {
          id: 0,
          action: "画出基底和入口平面。",
          title: "入口平面",
          body: "外部负载先进入受控入口层。",
        },
        {
          id: 1,
          action: "揭示服务层和数据层。",
          title: "服务堆栈",
          body: "核心服务和状态分离，便于检查。",
        },
        {
          id: 2,
          action: "加入人工反馈层。",
          title: "人工回路",
          body: "人工复核属于系统内部，而不是外部附属物。",
        },
      ],
    },
  },
  3: {
    en: {
      tab: "SHEET 03",
      title: "Stress Path",
      shortTitle: "Stress",
      kicker: "The warm line marks where pressure should travel under load.",
      titleBlock: ["LOAD VECTOR", "QUEUE BEND", "ISOLATION JOINT", "RECOVERY LANE"],
      legend: ["Spike", "Buffer", "Isolate", "Recover"],
      callouts: ["Absorb the spike", "Bend through queue", "Exit through recovery lane"],
      beats: [
        {
          id: 0,
          action: "Place stress nodes and capacity gates.",
          title: "Stress nodes",
          body: "Each node has a measurable load role.",
        },
        {
          id: 1,
          action: "Trace the warm stress route through the gates.",
          title: "Routed pressure",
          body: "Stress moves through named bends instead of breaking the core.",
        },
        {
          id: 2,
          action: "Mark the recovery lane and exit check.",
          title: "Recovery lane",
          body: "A safe exit is part of the original drawing.",
        },
      ],
    },
    zh: {
      tab: "图纸 03",
      title: "压力路径",
      shortTitle: "压力",
      kicker: "暖色线只标出一件事：压力在负载下应该走哪里。",
      titleBlock: ["负载向量", "队列弯折", "隔离连接", "恢复通道"],
      legend: ["尖峰", "缓冲", "隔离", "恢复"],
      callouts: ["吸收尖峰", "通过队列弯折", "从恢复通道退出"],
      beats: [
        {
          id: 0,
          action: "放置压力节点和容量闸口。",
          title: "压力节点",
          body: "每个节点都有可测量的负载职责。",
        },
        {
          id: 1,
          action: "用暖色线追踪压力经过闸口的路径。",
          title: "压力路由",
          body: "压力通过命名弯折移动，而不是击穿核心。",
        },
        {
          id: 2,
          action: "标出恢复通道和出口检查。",
          title: "恢复通道",
          body: "安全出口是原始图纸的一部分。",
        },
      ],
    },
  },
  4: {
    en: {
      tab: "SHEET 04",
      title: "Inspection Notes",
      shortTitle: "Inspect",
      kicker: "A resilient plan stays useful because every check has a mark.",
      titleBlock: ["INSPECTION SET", "CHECKPOINTS", "MEASURED DRIFT", "NEXT REVIEW"],
      legend: ["Probe", "Measure", "Note", "Resolve"],
      callouts: ["Checkpoint holds", "Latency drift measured", "Owner note attached"],
      beats: [
        {
          id: 0,
          action: "Show the inspection frame and probe marks.",
          title: "Probe marks",
          body: "Inspection starts where the drawing says risk accumulates.",
        },
        {
          id: 1,
          action: "Reveal measured drift and owner notes.",
          title: "Measured drift",
          body: "Small deviations become visible before they become incidents.",
        },
        {
          id: 2,
          action: "Resolve the review line and note cadence.",
          title: "Review cadence",
          body: "The plan is inspected on a schedule, not only after failure.",
        },
      ],
    },
    zh: {
      tab: "图纸 04",
      title: "巡检注记",
      shortTitle: "巡检",
      kicker: "每个检查点都有标记，计划才会持续可用。",
      titleBlock: ["巡检集合", "检查点", "漂移测量", "下次复核"],
      legend: ["探测", "测量", "注记", "处理"],
      callouts: ["检查点稳定", "已测量延迟漂移", "已附负责人注记"],
      beats: [
        {
          id: 0,
          action: "显示巡检框架和探测标记。",
          title: "探测标记",
          body: "巡检从图纸标出的风险累积处开始。",
        },
        {
          id: 1,
          action: "揭示测量漂移和负责人注记。",
          title: "漂移测量",
          body: "小偏差先被看见，才不会变成事故。",
        },
        {
          id: 2,
          action: "补全复核线和巡检节奏。",
          title: "复核节奏",
          body: "计划按节奏被检查，而不是只在失败后被翻开。",
        },
      ],
    },
  },
  5: {
    en: {
      tab: "SHEET 05",
      title: "Approved Plan",
      shortTitle: "Approve",
      kicker: "The final sheet turns resilience from intent into operating geometry.",
      titleBlock: ["APPROVED", "REVISION LOCK", "RUNBOOK LINK", "OWNER SIGNED"],
      legend: ["Plan", "Verify", "Operate", "Review"],
      callouts: ["Capacity drawn", "Stress route accepted", "Inspection cadence signed"],
      beats: [
        {
          id: 0,
          action: "Cut to the approved drawing with final geometry.",
          title: "Approved geometry",
          body: "The plan is complete enough to operate.",
        },
        {
          id: 1,
          action: "Reveal the signature block and approval stamp.",
          title: "Signed plan",
          body: "Ownership is part of the blueprint.",
        },
        {
          id: 2,
          action: "Hold the finished recovery system.",
          title: "Ready to operate",
          body: "The drawing now tells teams where to absorb, inspect, and recover.",
        },
      ],
    },
    zh: {
      tab: "图纸 05",
      title: "批准方案",
      shortTitle: "批准",
      kicker: "最后一张图纸把韧性从意图变成可运行的几何关系。",
      titleBlock: ["已批准", "修订锁定", "运行手册", "负责人签署"],
      legend: ["计划", "验证", "运行", "复核"],
      callouts: ["容量已绘制", "压力路径已接受", "巡检节奏已签署"],
      beats: [
        {
          id: 0,
          action: "硬切到带有最终几何关系的批准图纸。",
          title: "批准几何",
          body: "方案已经足够清晰，可以进入运行。",
        },
        {
          id: 1,
          action: "揭示签署栏和批准章。",
          title: "签署方案",
          body: "负责人归属是蓝图的一部分。",
        },
        {
          id: 2,
          action: "停留在完成的恢复系统上。",
          title: "准备运行",
          body: "图纸说明团队在哪里吸收、检查和恢复。",
        },
      ],
    },
  },
};

function clampScene(scene: number): SceneId {
  return SCENE_IDS.includes(scene as SceneId) ? (scene as SceneId) : 1;
}

function clampBeat(scene: SceneId, beat: number, isThumbnail: boolean): number {
  const maxBeat = COPY[scene].en.beats.length - 1;
  if (isThumbnail) return maxBeat;
  return Math.max(0, Math.min(beat, maxBeat));
}

function getSceneCopy(scene: SceneId, language: Lang): SceneCopy {
  return COPY[scene][language] ?? COPY[scene].en;
}

function revealAt(beat: number, threshold: number): "true" | "false" {
  return beat >= threshold ? "true" : "false";
}

function BlueprintTitleBlock({
  scene,
  copy,
}: {
  scene: SceneId;
  copy: SceneCopy;
}) {
  return (
    <aside className={styles.titleBlock} data-beat-layout-item="true">
      <div className={styles.titleBlockTop}>
        <span>{copy.tab}</span>
        <span>RB-0{scene}</span>
      </div>
      <div className={styles.titleBlockName}>{copy.title}</div>
      <div className={styles.titleBlockGrid}>
        {copy.titleBlock.map((item) => (
          <span key={item}>{item}</span>
        ))}
      </div>
    </aside>
  );
}

function LegendRail({
  copy,
  beat,
}: {
  copy: SceneCopy;
  beat: number;
}) {
  return (
    <div className={styles.legendRail} data-beat-layout-item="true">
      {copy.legend.map((item, index) => (
        <span
          key={item}
          className={styles.legendItem}
          data-visible={revealAt(beat, Math.min(index, 2))}
        >
          {item}
        </span>
      ))}
    </div>
  );
}

function CalloutRail({
  copy,
  beat,
}: {
  copy: SceneCopy;
  beat: number;
}) {
  return (
    <div className={styles.calloutRail} data-beat-layout-item="true">
      {copy.callouts.map((item, index) => (
        <div
          key={item}
          className={styles.callout}
          data-visible={revealAt(beat, index)}
        >
          <span className={styles.calloutIndex}>C0{index + 1}</span>
          <span>{item}</span>
        </div>
      ))}
    </div>
  );
}

function SceneHeader({
  copy,
  beat,
}: {
  copy: SceneCopy;
  beat: number;
}) {
  const activeBeat = copy.beats[Math.min(beat, copy.beats.length - 1)];
  return (
    <header className={styles.sceneHeader} data-beat-layout-item="true">
      <p className={styles.eyebrow}>{copy.tab}</p>
      <h1>{copy.title}</h1>
      <p className={styles.kicker}>{copy.kicker}</p>
      <p className={styles.beatNote}>{activeBeat.body}</p>
    </header>
  );
}

function TitleSheetDiagram({
  beat,
  language,
}: {
  beat: number;
  language: Lang;
}) {
  const labels =
    language === "zh"
      ? ["安全框架", "容量舱", "恢复图例", "吸收 / 检查 / 恢复"]
      : ["SAFE FRAME", "CAPACITY BAY", "RECOVERY LEGEND", "ABSORB / INSPECT / RECOVER"];
  return (
    <svg className={styles.diagramSvg} viewBox="0 0 1000 620" aria-hidden="true">
      <path className={styles.constructionLine} d="M88 94H920M88 510H920M150 56V552M858 56V552" />
      <path className={styles.dimensionLine} d="M178 128H826V432H178Z" />
      <path className={styles.dimensionLine} d="M286 128V432M502 128V432M718 128V432M178 230H826M178 332H826" />
      <path
        className={styles.drawLine}
        data-visible={revealAt(beat, 1)}
        pathLength={1}
        d="M118 88L178 128M886 88L826 128M118 472L178 432M886 472L826 432"
      />
      <path
        className={styles.warmLine}
        data-visible={revealAt(beat, 2)}
        pathLength={1}
        d="M248 484H752"
      />
      <g className={styles.svgLabel} data-visible={revealAt(beat, 0)}>
        <text x="218" y="206">{labels[0]}</text>
        <text x="530" y="206">{labels[1]}</text>
        <text x="318" y="372">{labels[2]}</text>
      </g>
      <g className={styles.svgLabel} data-visible={revealAt(beat, 2)}>
        <text x="292" y="536">{labels[3]}</text>
      </g>
    </svg>
  );
}

function LayerDiagram({
  beat,
  language,
}: {
  beat: number;
  language: Lang;
}) {
  const labels =
    language === "zh"
      ? ["入口", "服务", "数据", "人工回路"]
      : ["INGRESS", "SERVICES", "DATA", "OPERATOR LOOP"];
  return (
    <svg className={styles.diagramSvg} viewBox="0 0 1000 620" aria-hidden="true">
      <path className={styles.constructionLine} d="M100 112H890M100 498H890M172 76V536M820 76V536" />
      <g data-visible={revealAt(beat, 0)}>
        <path className={styles.layerFace} d="M262 118H708L812 178H158Z" />
        <text className={styles.svgText} x="420" y="162">{labels[0]}</text>
      </g>
      <g data-visible={revealAt(beat, 1)}>
        <path className={styles.layerFace} d="M204 254H768L704 318H268Z" />
        <text className={styles.svgText} x="420" y="294">{labels[1]}</text>
      </g>
      <g data-visible={revealAt(beat, 1)}>
        <path className={styles.layerFace} d="M276 396H696L650 466H322Z" />
        <text className={styles.svgText} x="438" y="438">{labels[2]}</text>
      </g>
      <path
        className={styles.drawLine}
        data-visible={revealAt(beat, 2)}
        pathLength={1}
        d="M820 104V492M820 492H706M820 252H770M820 404H696"
      />
      <text className={styles.svgText} data-visible={revealAt(beat, 2)} x="706" y="548">
        {labels[3]}
      </text>
    </svg>
  );
}

function StressDiagram({
  beat,
  language,
}: {
  beat: number;
  language: Lang;
}) {
  const labels =
    language === "zh"
      ? ["负载", "队列", "隔离", "通道", "恢复出口"]
      : ["LOAD", "QUEUE", "JOINT", "LANE", "RECOVERY EXIT"];
  return (
    <svg className={styles.diagramSvg} viewBox="0 0 1000 620" aria-hidden="true">
      <path className={styles.constructionLine} d="M90 132H922M90 488H922M128 92V530M880 92V530" />
      <g className={styles.nodeGroup}>
        {[
          [150, 162, labels[0]],
          [356, 246, labels[1]],
          [572, 190, labels[2]],
          [760, 350, labels[3]],
        ].map(([x, y, label], index) => (
          <g key={label} data-visible={revealAt(beat, index === 0 ? 0 : 1)}>
            <rect className={styles.nodeBox} x={x} y={y} width="138" height="92" />
            <text className={styles.svgText} x={Number(x) + 28} y={Number(y) + 54}>
              {label}
            </text>
          </g>
        ))}
      </g>
      <path
        className={styles.warmLine}
        data-visible={revealAt(beat, 1)}
        pathLength={1}
        d="M86 208H218V292H424V236H640V396H922"
      />
      <path
        className={styles.drawLine}
        data-visible={revealAt(beat, 2)}
        pathLength={1}
        d="M760 466H922M922 466V396M724 466H760"
      />
      <text className={styles.svgText} data-visible={revealAt(beat, 2)} x="678" y="516">
        {labels[4]}
      </text>
    </svg>
  );
}

function InspectionDiagram({
  beat,
  language,
}: {
  beat: number;
  language: Lang;
}) {
  const labels =
    language === "zh"
      ? ["检查 01", "漂移 +3", "负责人确认"]
      : ["CHECK 01", "DRIFT +3", "OWNER OK"];
  return (
    <svg className={styles.diagramSvg} viewBox="0 0 1000 620" aria-hidden="true">
      <path className={styles.constructionLine} d="M86 96H914M86 520H914M150 56V552M850 56V552" />
      <path className={styles.dimensionLine} d="M168 122H596V430H168Z" />
      <path className={styles.dimensionLine} d="M224 190H540M224 278H540M224 366H540" />
      <g data-visible={revealAt(beat, 0)}>
        <path className={styles.drawLine} pathLength={1} d="M596 154H806V214H596Z" />
        <text className={styles.svgText} x="630" y="192">{labels[0]}</text>
      </g>
      <g data-visible={revealAt(beat, 1)}>
        <path className={styles.drawLine} pathLength={1} d="M596 276H824V338H596Z" />
        <text className={styles.svgText} x="628" y="314">{labels[1]}</text>
      </g>
      <g data-visible={revealAt(beat, 2)}>
        <path className={styles.drawLine} pathLength={1} d="M596 398H790V462H596Z" />
        <text className={styles.svgText} x="628" y="436">{labels[2]}</text>
      </g>
      <path
        className={styles.warmLine}
        data-visible={revealAt(beat, 2)}
        pathLength={1}
        d="M126 496L154 524L220 456"
      />
    </svg>
  );
}

function ApprovedDiagram({
  beat,
  language,
}: {
  beat: number;
  language: Lang;
}) {
  const labels =
    language === "zh"
      ? ["已签署", "按此图运行"]
      : ["SIGNED", "OPERATE FROM THIS DRAWING"];
  return (
    <svg className={styles.diagramSvg} viewBox="0 0 1000 620" aria-hidden="true">
      <path className={styles.constructionLine} d="M86 80H914M86 520H914M128 44V556M872 44V556" />
      <path className={styles.dimensionLine} d="M178 150H336V318H178Z" />
      <path className={styles.dimensionLine} d="M414 108H742V386H414Z" />
      <path className={styles.dimensionLine} d="M258 430H790" />
      <path className={styles.drawLine} data-visible={revealAt(beat, 0)} pathLength={1} d="M336 234H414M742 248H824M258 318V430M742 386V430" />
      <g data-visible={revealAt(beat, 1)}>
        <rect className={styles.stampBox} x="642" y="418" width="210" height="88" />
        <path className={styles.warmLine} pathLength={1} d="M690 462H810M726 432L778 492" />
        <text className={styles.svgText} x="676" y="542">{labels[0]}</text>
      </g>
      <text className={styles.svgText} data-visible={revealAt(beat, 2)} x="214" y="536">
        {labels[1]}
      </text>
    </svg>
  );
}

function SceneDiagram({
  scene,
  beat,
  language,
}: {
  scene: SceneId;
  beat: number;
  language: Lang;
}) {
  if (scene === 1) return <TitleSheetDiagram beat={beat} language={language} />;
  if (scene === 2) return <LayerDiagram beat={beat} language={language} />;
  if (scene === 3) return <StressDiagram beat={beat} language={language} />;
  if (scene === 4) return <InspectionDiagram beat={beat} language={language} />;
  return <ApprovedDiagram beat={beat} language={language} />;
}

function ScenePanel({
  scene,
  beat,
  language,
}: {
  scene: SceneId;
  beat: number;
  language: Lang;
}) {
  const copy = getSceneCopy(scene, language);
  return (
    <section
      className={styles.scene}
      data-scene={scene}
      data-beat-layout-container="true"
      data-beat-layout-mode="reserved"
    >
      <div className={styles.sheetChrome} aria-hidden="true" />
      <SceneHeader copy={copy} beat={beat} />
      <main className={styles.diagramFrame} data-beat-layout-item="true">
        <SceneDiagram scene={scene} beat={beat} language={language} />
      </main>
      <LegendRail copy={copy} beat={beat} />
      <CalloutRail copy={copy} beat={beat} />
      <BlueprintTitleBlock scene={scene} copy={copy} />
    </section>
  );
}

function SheetTabs({
  scene,
  language,
  onNavigate,
}: {
  scene: SceneId;
  language: Lang;
  onNavigate?: (scene: number, beat: number) => void;
}) {
  return (
    <nav className={styles.sheetTabs} aria-label={language === "zh" ? "图纸导航" : "Sheet navigation"}>
      {SCENE_IDS.map((sceneId) => {
        const copy = getSceneCopy(sceneId, language);
        const isActive = sceneId === scene;
        return (
          <button
            key={sceneId}
            type="button"
            className={styles.sheetTab}
            data-active={isActive ? "true" : "false"}
            onClick={(event) => {
              event.stopPropagation();
              onNavigate?.(sceneId, 0);
            }}
          >
            <span>{copy.tab}</span>
            <small>{copy.shortTitle}</small>
          </button>
        );
      })}
    </nav>
  );
}

export function getMetadata(lang: Lang): StyleMetadata {
  return {
    id: "05",
    band: "minimal-keynote",
    name: lang === "zh" ? "蓝晒制图台" : "Cyanotype Drafting Table",
    theme: lang === "zh" ? "韧性蓝图" : "Resilience Blueprint",
    densityLabel: lang === "zh" ? "中高密度" : "Medium-high",
    heroScene: 5,
    colors: {
      bg: "#092b48",
      ink: "#e8f8ff",
      panel: "#0d3556",
    },
    typography: {
      header: "SF Mono 600",
      body: "SF Mono 400",
    },
    tags: ["cyanotype", "blueprint", "technical", "architectural", "reserved"],
    fonts: ["SF Mono", "Menlo", "cjk:PingFang SC", "cjk:Microsoft YaHei"],
    scenes: SCENE_IDS.map((sceneId) => {
      const copy = getSceneCopy(sceneId, lang);
      return {
        id: sceneId,
        title: copy.title,
        beats: copy.beats,
      };
    }),
  };
}

export default function ResilienceBlueprintV2({
  scene,
  beat,
  language,
  isThumbnail,
  reducedMotion,
  onNavigate,
}: BespokeStyleProps) {
  const activeScene = clampScene(scene);
  const activeBeat = clampBeat(activeScene, beat, isThumbnail);
  const motionDisabled = reducedMotion || isThumbnail;

  return (
    <div
      className={styles.root}
      data-reduced-motion={motionDisabled ? "true" : "false"}
      data-thumbnail={isThumbnail ? "true" : "false"}
    >
      <SpatialSceneTrack
        scene={activeScene}
        beat={activeBeat}
        transitionKind="wipe"
        transitionMap={TRANSITION_MAP}
        reducedMotion={motionDisabled}
        transitionDurationMs={760}
        beatLayoutModes={BEAT_LAYOUT_MODES}
        className={styles.track}
        renderScene={(sceneId, sceneBeat) => (
          <ScenePanel
            scene={clampScene(sceneId)}
            beat={clampBeat(clampScene(sceneId), sceneBeat, false)}
            language={language}
          />
        )}
      />
      {!isThumbnail && (
        <SheetTabs scene={activeScene} language={language} onNavigate={onNavigate} />
      )}
    </div>
  );
}

export const resilienceBlueprintV2Version = defineStyleVersion({
  id: "v2",
  topic: {
    en: "Resilience Plan",
    zh: "韧性方案",
  },
  model: "GPT-5.5",
  component: ResilienceBlueprintV2,
  getMetadata,
});

import React from "react";
import {
  defineTopic,
  type TopicMetadata,
  type TopicStageProps,
  type TopicTransitionScore,
} from "../domain/topic";
import SpatialSceneTrack from "../components/stage/SpatialSceneTrack";
import styles from "./release-tracks.module.css";

type Lang = "en" | "zh";
type TrackKey = "product" | "build" | "gtm";
type RouteKey = TrackKey | "release";

type CSSVars = React.CSSProperties & Record<`--${string}`, string | number>;

interface BeatCopy {
  action: string;
  title: string;
  body: string;
}

interface SceneCopy {
  eyebrow: string;
  title: string;
  body: string;
  mapLabel: string;
  boardTitle: string;
  navLabel: string;
  arrival: string;
  beats: BeatCopy[];
}

interface RouteLine {
  id: string;
  route: RouteKey;
  d: string;
  beat: number;
  focusBeat?: number;
}

interface Station {
  id: string;
  route: RouteKey;
  label: Record<Lang, string>;
  x: number;
  y: number;
  beat: number;
  transfer?: boolean;
  anchor?: "left" | "right" | "top" | "bottom";
}

interface SceneMap {
  variant: string;
  lines: RouteLine[];
  stations: Station[];
}

interface SceneDefinition {
  id: number;
  layout: string;
  map: SceneMap;
}

const SCENE_IDS = [1, 2, 3, 4, 5];

const TRACKS: Array<{
  key: TrackKey;
  color: string;
  label: Record<Lang, string>;
  short: Record<Lang, string>;
}> = [
  {
    key: "product",
    color: "#e85d3f",
    label: { en: "Product", zh: "产品" },
    short: { en: "P", zh: "产" },
  },
  {
    key: "build",
    color: "#2378d4",
    label: { en: "Build", zh: "研发" },
    short: { en: "B", zh: "研" },
  },
  {
    key: "gtm",
    color: "#159a65",
    label: { en: "GTM", zh: "上市" },
    short: { en: "G", zh: "市" },
  },
];

const RELEASE_ROUTE = {
  color: "#1f2933",
  label: { en: "Release", zh: "发布" },
  short: { en: "R", zh: "发" },
};

const TRACK_BY_KEY = TRACKS.reduce<Record<TrackKey, (typeof TRACKS)[number]>>(
  (acc, track) => {
    acc[track.key] = track;
    return acc;
  },
  {} as Record<TrackKey, (typeof TRACKS)[number]>,
);

const COPY: Record<Lang, Record<number, SceneCopy>> = {
  en: {
    1: {
      eyebrow: "Route map",
      title: "Three tracks, one release line",
      body: "Product, Build, and GTM stay legible as separate routes before they enter the shared release spine.",
      mapLabel: "System route",
      boardTitle: "Map legend",
      navLabel: "Route",
      arrival: "Release spine",
      beats: [
        {
          action: "Open route system",
          title: "Name the network",
          body: "The release is treated as a transit system, not a loose checklist.",
        },
        {
          action: "Separate tracks",
          title: "Keep ownership visible",
          body: "Each color owns a stream and keeps its own station names.",
        },
        {
          action: "Mark release spine",
          title: "Show the shared line",
          body: "The common path is visible before the team reaches it.",
        },
      ],
    },
    2: {
      eyebrow: "Parallel work",
      title: "Parallel tracks move without pretending to merge",
      body: "The map keeps lanes separate while exposing the checkpoints that need cross-track awareness.",
      mapLabel: "Parallel service",
      boardTitle: "Lane status",
      navLabel: "Parallel",
      arrival: "Readiness in sight",
      beats: [
        {
          action: "Product lane advances",
          title: "Scope locks first",
          body: "Product closes the destination and trims the optional stops.",
        },
        {
          action: "Build lane advances",
          title: "Risk burns down",
          body: "Build clears integration, performance, and rollback stations.",
        },
        {
          action: "GTM lane advances",
          title: "Launch motion warms up",
          body: "GTM prepares enablement and customer-facing signals.",
        },
      ],
    },
    3: {
      eyebrow: "Transfer station",
      title: "Readiness is the transfer, not the end",
      body: "A shared station lets scope, quality, and launch constraints exchange before final assembly.",
      mapLabel: "Central transfer",
      boardTitle: "Transfer checks",
      navLabel: "Transfer",
      arrival: "Release control",
      beats: [
        {
          action: "Scope transfer",
          title: "Scope meets quality",
          body: "Cuts and must-haves are exchanged while the route is still editable.",
        },
        {
          action: "Quality transfer",
          title: "Quality meets launch",
          body: "Risk notes become launch constraints instead of late surprises.",
        },
        {
          action: "Launch transfer",
          title: "Launch meets release control",
          body: "The station produces one decision surface for the next line.",
        },
      ],
    },
    4: {
      eyebrow: "Convergence",
      title: "The tracks converge after local proof",
      body: "Convergence is earned: each route reaches its final station before entering the release trunk.",
      mapLabel: "Convergence throat",
      boardTitle: "Merge order",
      navLabel: "Merge",
      arrival: "Release trunk",
      beats: [
        {
          action: "Product proof arrives",
          title: "Value proof boards",
          body: "The product route enters with a crisp customer promise.",
        },
        {
          action: "Build proof arrives",
          title: "Operational proof boards",
          body: "The build route enters with rollback and monitor coverage.",
        },
        {
          action: "GTM proof arrives",
          title: "Market proof boards",
          body: "The GTM route enters with launch owners and timing locked.",
        },
      ],
    },
    5: {
      eyebrow: "Arrival",
      title: "Arrival is a single release with three proofs attached",
      body: "The final station preserves the three colored proofs so the release reads as one decision, not a blur.",
      mapLabel: "Arrival platform",
      boardTitle: "Arrival board",
      navLabel: "Arrival",
      arrival: "Released",
      beats: [
        {
          action: "Value proof",
          title: "Customer value clear",
          body: "The release explains who benefits and why now.",
        },
        {
          action: "Operational proof",
          title: "Operations ready",
          body: "The release has recovery paths and owner visibility.",
        },
        {
          action: "Market proof",
          title: "Launch signal ready",
          body: "The release reaches the platform with message and timing aligned.",
        },
      ],
    },
  },
  zh: {
    1: {
      eyebrow: "路线图",
      title: "三条轨道，一条发布线",
      body: "产品、研发、上市保持各自可追踪的线路，再进入共享发布主线。",
      mapLabel: "系统路线",
      boardTitle: "地图图例",
      navLabel: "路线",
      arrival: "发布主线",
      beats: [
        {
          action: "打开路线系统",
          title: "命名网络",
          body: "把发布当成交通系统，而不是松散清单。",
        },
        {
          action: "分出三条轨道",
          title: "保留归属",
          body: "每种颜色代表一条真实工作流，并保留自己的站名。",
        },
        {
          action: "标出发布主线",
          title: "提前看到共享线路",
          body: "团队抵达前，共同路径已经清晰可见。",
        },
      ],
    },
    2: {
      eyebrow: "并行推进",
      title: "并行轨道不假装已经合并",
      body: "地图保留各自车道，同时暴露需要跨轨关注的检查站。",
      mapLabel: "并行服务",
      boardTitle: "车道状态",
      navLabel: "并行",
      arrival: "就绪在望",
      beats: [
        {
          action: "产品线前进",
          title: "先锁范围",
          body: "产品确认目的地，并削减可选停靠点。",
        },
        {
          action: "研发线前进",
          title: "风险下降",
          body: "研发清理集成、性能和回滚站点。",
        },
        {
          action: "上市线前进",
          title: "启动上市动作",
          body: "上市准备赋能材料和面向客户的信号。",
        },
      ],
    },
    3: {
      eyebrow: "换乘站",
      title: "就绪是换乘点，不是终点",
      body: "共享站点让范围、质量和上市约束在最终组装前完成交换。",
      mapLabel: "中心换乘",
      boardTitle: "换乘检查",
      navLabel: "换乘",
      arrival: "发布控制",
      beats: [
        {
          action: "范围换乘",
          title: "范围遇到质量",
          body: "取舍和必选项在路线仍可编辑时完成交换。",
        },
        {
          action: "质量换乘",
          title: "质量遇到上市",
          body: "风险记录变成上市约束，而不是临门意外。",
        },
        {
          action: "上市换乘",
          title: "上市遇到发布控制",
          body: "换乘站产出下一条线路共用的决策面。",
        },
      ],
    },
    4: {
      eyebrow: "汇合",
      title: "本地证明完成后再汇合",
      body: "汇合是被证明出来的：每条线路先抵达自己的最终站，再进入发布主干。",
      mapLabel: "汇合口",
      boardTitle: "合流顺序",
      navLabel: "汇合",
      arrival: "发布主干",
      beats: [
        {
          action: "产品证明抵达",
          title: "价值证明上车",
          body: "产品线带着清晰客户承诺进入主干。",
        },
        {
          action: "研发证明抵达",
          title: "运行证明上车",
          body: "研发线带着回滚和监控覆盖进入主干。",
        },
        {
          action: "上市证明抵达",
          title: "市场证明上车",
          body: "上市线带着负责人和节奏锁定进入主干。",
        },
      ],
    },
    5: {
      eyebrow: "到站",
      title: "一次发布，附带三份证明",
      body: "终点站保留三种颜色的证明，让发布像一个决策，而不是一团混合色。",
      mapLabel: "到站站台",
      boardTitle: "到站牌",
      navLabel: "到站",
      arrival: "已发布",
      beats: [
        {
          action: "价值证明",
          title: "客户价值清楚",
          body: "发布讲清谁受益，以及为什么是现在。",
        },
        {
          action: "运行证明",
          title: "运行准备完成",
          body: "发布具备恢复路径和负责人可见性。",
        },
        {
          action: "市场证明",
          title: "上市信号就绪",
          body: "信息、节奏和窗口一起抵达站台。",
        },
      ],
    },
  },
};

const SCENES: SceneDefinition[] = [
  {
    id: 1,
    layout: "routeMap",
    map: {
      variant: "route",
      lines: [
        { id: "s1-product", route: "product", d: "M 8 24 H 35 C 46 24 49 38 61 38 H 92", beat: 0 },
        { id: "s1-build", route: "build", d: "M 8 48 H 36 C 46 48 50 42 61 42 H 92", beat: 1 },
        { id: "s1-gtm", route: "gtm", d: "M 8 72 H 34 C 47 72 49 46 61 46 H 92", beat: 1 },
        { id: "s1-release", route: "release", d: "M 61 42 H 94", beat: 2, focusBeat: 2 },
      ],
      stations: [
        { id: "s1-p1", route: "product", label: { en: "Intent", zh: "意图" }, x: 5, y: 17, beat: 0 },
        { id: "s1-p2", route: "product", label: { en: "Scope", zh: "范围" }, x: 22, y: 17, beat: 0 },
        { id: "s1-b1", route: "build", label: { en: "Base", zh: "基线" }, x: 5, y: 34, beat: 1 },
        { id: "s1-b2", route: "build", label: { en: "Risk", zh: "风险" }, x: 23, y: 34, beat: 1 },
        { id: "s1-g1", route: "gtm", label: { en: "Signal", zh: "信号" }, x: 5, y: 51, beat: 1 },
        { id: "s1-g2", route: "gtm", label: { en: "Launch", zh: "上市" }, x: 22, y: 51, beat: 1 },
        { id: "s1-xfer", route: "release", label: { en: "Merge", zh: "合流" }, x: 36, y: 30, beat: 2, transfer: true },
        { id: "s1-arrival", route: "release", label: { en: "Release", zh: "发布" }, x: 54, y: 30, beat: 2, anchor: "left" },
      ],
    },
  },
  {
    id: 2,
    layout: "parallelWork",
    map: {
      variant: "parallel",
      lines: [
        { id: "s2-product", route: "product", d: "M 8 24 H 91", beat: 0, focusBeat: 0 },
        { id: "s2-build", route: "build", d: "M 8 50 H 91", beat: 1, focusBeat: 1 },
        { id: "s2-gtm", route: "gtm", d: "M 8 76 H 91", beat: 2, focusBeat: 2 },
      ],
      stations: [
        { id: "s2-p1", route: "product", label: { en: "Scope", zh: "范围" }, x: 8, y: 17, beat: 0 },
        { id: "s2-p2", route: "product", label: { en: "Cut", zh: "取舍" }, x: 27, y: 17, beat: 0 },
        { id: "s2-p3", route: "product", label: { en: "Promise", zh: "承诺" }, x: 47, y: 17, beat: 0, anchor: "left" },
        { id: "s2-b1", route: "build", label: { en: "Integrate", zh: "集成" }, x: 8, y: 35, beat: 1 },
        { id: "s2-b2", route: "build", label: { en: "Recover", zh: "恢复" }, x: 28, y: 35, beat: 1 },
        { id: "s2-b3", route: "build", label: { en: "Monitor", zh: "监控" }, x: 47, y: 35, beat: 1, anchor: "left" },
        { id: "s2-g1", route: "gtm", label: { en: "Enable", zh: "赋能" }, x: 8, y: 54, beat: 2 },
        { id: "s2-g2", route: "gtm", label: { en: "Message", zh: "信息" }, x: 28, y: 54, beat: 2 },
        { id: "s2-g3", route: "gtm", label: { en: "Window", zh: "窗口" }, x: 47, y: 54, beat: 2, anchor: "left" },
      ],
    },
  },
  {
    id: 3,
    layout: "transferStation",
    map: {
      variant: "transfer",
      lines: [
        { id: "s3-product", route: "product", d: "M 9 27 H 36 C 46 27 45 47 53 47", beat: 0, focusBeat: 0 },
        { id: "s3-build", route: "build", d: "M 9 50 H 53", beat: 1, focusBeat: 1 },
        { id: "s3-gtm", route: "gtm", d: "M 9 73 H 36 C 46 73 45 53 53 53", beat: 2, focusBeat: 2 },
        { id: "s3-release", route: "release", d: "M 53 50 H 92", beat: 2, focusBeat: 2 },
      ],
      stations: [
        { id: "s3-p", route: "product", label: { en: "Scope", zh: "范围" }, x: 8, y: 19, beat: 0 },
        { id: "s3-b", route: "build", label: { en: "Quality", zh: "质量" }, x: 8, y: 36, beat: 1 },
        { id: "s3-g", route: "gtm", label: { en: "Launch", zh: "上市" }, x: 8, y: 53, beat: 2 },
        { id: "s3-transfer", route: "release", label: { en: "Readiness", zh: "就绪" }, x: 31, y: 36, beat: 0, transfer: true },
        { id: "s3-control", route: "release", label: { en: "Control", zh: "控制" }, x: 53, y: 36, beat: 2, anchor: "left" },
      ],
    },
  },
  {
    id: 4,
    layout: "convergence",
    map: {
      variant: "converge",
      lines: [
        { id: "s4-product", route: "product", d: "M 8 22 C 35 22 42 45 62 47", beat: 0, focusBeat: 0 },
        { id: "s4-build", route: "build", d: "M 8 48 H 62", beat: 1, focusBeat: 1 },
        { id: "s4-gtm", route: "gtm", d: "M 8 74 C 35 74 42 51 62 49", beat: 2, focusBeat: 2 },
        { id: "s4-release", route: "release", d: "M 62 48 H 93", beat: 2, focusBeat: 2 },
      ],
      stations: [
        { id: "s4-value", route: "product", label: { en: "Value proof", zh: "价值证明" }, x: 6, y: 16, beat: 0 },
        { id: "s4-ops", route: "build", label: { en: "Ops proof", zh: "运行证明" }, x: 6, y: 34, beat: 1 },
        { id: "s4-market", route: "gtm", label: { en: "Market proof", zh: "市场证明" }, x: 6, y: 53, beat: 2 },
        { id: "s4-merge", route: "release", label: { en: "Trunk", zh: "主干" }, x: 37, y: 35, beat: 2, transfer: true },
        { id: "s4-ship", route: "release", label: { en: "Shiproom", zh: "发布室" }, x: 54, y: 35, beat: 2, anchor: "left" },
      ],
    },
  },
  {
    id: 5,
    layout: "arrival",
    map: {
      variant: "arrival",
      lines: [
        { id: "s5-product", route: "product", d: "M 8 31 C 26 31 31 45 43 45", beat: 0, focusBeat: 0 },
        { id: "s5-build", route: "build", d: "M 8 50 H 43", beat: 1, focusBeat: 1 },
        { id: "s5-gtm", route: "gtm", d: "M 8 69 C 26 69 31 55 43 55", beat: 2, focusBeat: 2 },
        { id: "s5-release", route: "release", d: "M 43 50 H 94", beat: 0, focusBeat: 2 },
      ],
      stations: [
        { id: "s5-value", route: "product", label: { en: "Value", zh: "价值" }, x: 7, y: 22, beat: 0 },
        { id: "s5-ops", route: "build", label: { en: "Ops", zh: "运行" }, x: 7, y: 36, beat: 1 },
        { id: "s5-market", route: "gtm", label: { en: "Market", zh: "市场" }, x: 7, y: 50, beat: 2 },
        { id: "s5-gate", route: "release", label: { en: "Gate", zh: "闸口" }, x: 25, y: 36, beat: 0, transfer: true },
        { id: "s5-platform", route: "release", label: { en: "Arrival", zh: "到站" }, x: 54, y: 36, beat: 2, anchor: "left" },
      ],
    },
  },
];

const TRANSITION_SCORE = {
  "1->2": "slide-x",
  "2->3": "wipe",
  "3->4": "slide-x",
  "4->5": "fade",
} as const satisfies TopicTransitionScore;

const TRANSITION_MAP = TRANSITION_SCORE;

const BEAT_LAYOUT_MODES = {
  1: "reserved",
  2: "reserved",
  3: "reserved",
  4: "reserved",
  5: "reserved",
} as const;

function getRoute(route: RouteKey) {
  return route === "release" ? RELEASE_ROUTE : TRACK_BY_KEY[route];
}

function getScene(sceneId: number): SceneDefinition {
  return SCENES.find((scene) => scene.id === sceneId) ?? SCENES[0];
}

function clampBeat(sceneId: number, beat: number, isThumbnail: boolean): number {
  const sceneCopy = COPY.en[sceneId] ?? COPY.en[1];
  const maxBeat = sceneCopy.beats.length - 1;
  if (isThumbnail) return maxBeat;
  return Math.min(Math.max(beat, 0), maxBeat);
}

function stationStyle(station: Station): CSSVars {
  const route = getRoute(station.route);
  return {
    "--station-x": `${station.x}cqw`,
    "--station-y": `${station.y}cqh`,
    "--station-color": route.color,
  } as CSSVars;
}

function lineStyle(route: RouteKey): CSSVars {
  return {
    "--route-color": getRoute(route).color,
  } as CSSVars;
}

function buildMetadata(lang: Lang): TopicMetadata {
  return {
    theme: lang === "zh" ? "三轨合一发布" : "Three Tracks to One Release",
    densityLabel: lang === "zh" ? "结构化" : "Structured",
    heroScene: 3,
    colors: { bg: "#f7f5ef", ink: "#1f2933", panel: "#ffffff" },
    typography: {
      header: "Inter 700",
      body: "Inter 450",
    },
    tags: ["transit", "workflow", "release", "map", "balanced"],
    fonts: ["Inter", "cjk:Noto Sans SC"],
    scenes: SCENE_IDS.map((sceneId) => {
      const sceneCopy = COPY[lang][sceneId];
      return {
        id: sceneId,
        title: sceneCopy.navLabel,
        beats: sceneCopy.beats.map((beatCopy, beatId) => ({
          id: beatId,
          action: beatCopy.action,
          title: beatCopy.title,
          body: beatCopy.body,
        })),
      };
    }),
  };
}

function TransitMap({
  scene,
  activeBeat,
  language,
}: {
  scene: SceneDefinition;
  activeBeat: number;
  language: Lang;
}) {
  const copy = COPY[language][scene.id];

  return (
    <div className={styles.mapStage} data-map-variant={scene.map.variant}>
      <div className={styles.mapHeading}>
        <span>{copy.mapLabel}</span>
        <span>{copy.arrival}</span>
      </div>
      <svg
        className={styles.routeSvg}
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <g className={styles.routeGrid}>
          <path d="M 8 14 H 92" />
          <path d="M 8 86 H 92" />
          <path d="M 8 14 V 86" />
          <path d="M 92 14 V 86" />
        </g>
        {scene.map.lines.map((line) => (
          <path
            key={line.id}
            className={styles.routeLine}
            d={line.d}
            style={lineStyle(line.route)}
            data-revealed={activeBeat >= line.beat ? "true" : "false"}
            data-focus={line.focusBeat === activeBeat ? "true" : "false"}
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </svg>
      {scene.map.stations.map((station) => (
        <div
          key={station.id}
          className={styles.station}
          style={stationStyle(station)}
          data-revealed={activeBeat >= station.beat ? "true" : "false"}
          data-transfer={station.transfer ? "true" : "false"}
          data-anchor={station.anchor}
        >
          <span className={styles.stationDot} />
          <span className={styles.stationName}>{station.label[language]}</span>
        </div>
      ))}
      <div className={styles.platformSign} data-revealed={activeBeat >= 2 ? "true" : "false"}>
        <span>{language === "zh" ? "终点" : "Terminus"}</span>
        <strong>{copy.arrival}</strong>
      </div>
    </div>
  );
}

function TrackLegend({ language }: { language: Lang }) {
  return (
    <div className={styles.legend} data-beat-layout-item="true">
      {TRACKS.map((track) => (
        <div
          key={track.key}
          className={styles.legendItem}
          style={{ "--route-color": track.color } as CSSVars}
        >
          <span className={styles.legendSwatch}>{track.short[language]}</span>
          <span>{track.label[language]}</span>
        </div>
      ))}
    </div>
  );
}

function ScenePanel({
  sceneId,
  beat,
  language,
  isThumbnail,
  isActive,
}: {
  sceneId: number;
  beat: number;
  language: Lang;
  isThumbnail: boolean;
  isActive: boolean;
}) {
  const scene = getScene(sceneId);
  const copy = COPY[language][scene.id];
  const activeBeat = clampBeat(scene.id, beat, isThumbnail);
  const currentBeat = copy.beats[activeBeat] ?? copy.beats[0];

  return (
    <section
      className={[styles.scene, styles[scene.layout], isActive ? styles.activeScene : styles.idleScene]
        .filter(Boolean)
        .join(" ")}
      data-scene={scene.id}
      data-active={isActive ? "true" : "false"}
      data-beat-layout-container="true"
      data-beat-layout-mode="reserved"
    >
      <header className={styles.sceneHeader} data-beat-layout-item="true">
        <div className={styles.eyebrow}>
          <span>{`0${scene.id}`}</span>
          <span>{copy.eyebrow}</span>
        </div>
        <h1 className={styles.title}>{copy.title}</h1>
        <p className={styles.body}>{copy.body}</p>
      </header>

      <div className={styles.mapShell} data-beat-layout-item="true">
        <TransitMap scene={scene} activeBeat={activeBeat} language={language} />
      </div>

      <aside className={styles.controlBoard} data-beat-layout-item="true">
        <div className={styles.boardTopline}>
          <span>{copy.boardTitle}</span>
          <span>{`${activeBeat + 1}/${copy.beats.length}`}</span>
        </div>
        <div className={styles.currentBeat}>
          <span>{currentBeat.action}</span>
          <strong>{currentBeat.title}</strong>
          <p>{currentBeat.body}</p>
        </div>
        <div className={styles.beatStack}>
          {copy.beats.map((beatCopy, index) => (
            <article
              key={beatCopy.action}
              className={styles.beatCard}
              data-beat-layout-item="true"
              data-revealed={index <= activeBeat ? "true" : "false"}
              data-current={index === activeBeat ? "true" : "false"}
            >
              <span>{`0${index + 1}`}</span>
              <div>
                <strong>{beatCopy.title}</strong>
                <p>{beatCopy.body}</p>
              </div>
            </article>
          ))}
        </div>
        <TrackLegend language={language} />
      </aside>
    </section>
  );
}

function TransitStopPicker({
  scene,
  language,
  onNavigate,
}: {
  scene: number;
  language: Lang;
  onNavigate?: (scene: number, beat: number) => void;
}) {
  return (
    <nav
      className={styles.stopPicker}
      aria-label={language === "zh" ? "场景换乘选择器" : "Transit stop scene picker"}
      data-topic-navigation="true"
      data-navigation-geometry="path"
      data-navigation-carrier="release-track-stop-rail"
      data-navigation-invocation="persistent"
      data-navigation-feedback="mechanical-displacement"
    >
      <div className={styles.stopRail} aria-hidden="true" />
      {SCENE_IDS.map((sceneId) => {
        const copy = COPY[language][sceneId];
        return (
          <button
            key={sceneId}
            className={styles.stopButton}
            type="button"
            data-active={sceneId === scene ? "true" : "false"}
            onClick={() => onNavigate?.(sceneId, 0)}
            aria-current={sceneId === scene ? "step" : undefined}
          >
            <span className={styles.stopDot}>{`0${sceneId}`}</span>
            <span className={styles.stopText}>{copy.navLabel}</span>
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
  const activeScene = SCENE_IDS.includes(scene) ? scene : 1;
  const motionDisabled = reducedMotion || isThumbnail;

  return (
    <div
      className={styles.root}
      data-language={language}
      data-thumbnail={isThumbnail ? "true" : "false"}
      data-reduced-motion={motionDisabled ? "true" : "false"}
    >
      <div className={styles.chrome} aria-hidden="true">
        <span>09</span>
        <span>{language === "zh" ? "三轨合一发布" : "Three Tracks to One Release"}</span>
      </div>
      <SpatialSceneTrack
        scene={activeScene}
        beat={beat}
        sceneIds={SCENE_IDS}
        transitionKind="slide-x"
        transitionMap={TRANSITION_MAP}
        transitionDurationMs={680}
        reducedMotion={motionDisabled}
        beatLayoutModes={BEAT_LAYOUT_MODES}
        className={styles.track}
        renderScene={(sceneId, sceneBeat, isActive) => (
          <ScenePanel
            sceneId={sceneId}
            beat={sceneBeat}
            language={language}
            isThumbnail={isThumbnail}
            isActive={isActive}
          />
        )}
      />
      {!isThumbnail && (
        <TransitStopPicker scene={activeScene} language={language} onNavigate={onNavigate} />
      )}
    </div>
  );
}

const metadata = {
  en: buildMetadata("en"),
  zh: buildMetadata("zh"),
};

export default defineTopic({
  id: "release-tracks",
  styleId: "subway-map-of-intent",
  title: {
    en: "Release Tracks",
    zh: "发布轨道",
  },
  modelId: "GPT 5.5",
  Stage: TopicStage,
  metadata,
  navigation: {
    geometry: "path",
    carrier: "release-track-stop-rail",
    invocation: "persistent",
    feedback: "mechanical-displacement",
  },
  transitionScore: TRANSITION_SCORE,
  evidence: {
    kind: "illustrative",
    boundary: {
      en: "Illustrative release-planning scenario: teams, checkpoints, and outcomes are presentation examples, not reported delivery results.",
      zh: "示例发布规划场景：团队、检查点与结果均为演示示例，并非已报告的交付结果。",
    },
    display: "envelope",
  },
});

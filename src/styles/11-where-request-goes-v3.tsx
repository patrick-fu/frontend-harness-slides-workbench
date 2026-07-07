import { useEffect } from "react";
import type { BespokeStyleProps, StyleMetadata } from "../types";
import { defineStyleVersion } from "./version";
import SpatialSceneTrack from "./SpatialSceneTrack";
import type { SceneTransitionMap } from "./SpatialSceneTrack";
import { useFLIP } from "../hooks/useFLIP";
import styles from "./11-where-request-goes-v3.module.css";

/* ── Fonts ──────────────────────────────────────────────── */
const FONT_ID = "font-signal-pipeline-flow-v3";
function useFonts() {
  useEffect(() => {
    if (document.getElementById(FONT_ID)) return;
    const link = document.createElement("link");
    link.id = FONT_ID;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=JetBrains+Mono:wght@400;600;700&display=swap";
    document.head.appendChild(link);
  }, []);
}

/* ── Pipeline topology (cqw/cqh coordinate space, 0..100) ── */
type Lang = "en" | "zh";
interface NodeDef {
  id: string;
  x: number;
  y: number;
  kind: Record<Lang, string>;
  label: Record<Lang, string>;
  sub: Record<Lang, string>;
}

const NODES: NodeDef[] = [
  { id: "client", x: 38, y: 50, kind: { en: "INGRESS", zh: "入口" }, label: { en: "Client", zh: "客户端" }, sub: { en: "GET /order/42", zh: "GET /order/42" } },
  { id: "gateway", x: 51, y: 50, kind: { en: "EDGE", zh: "边缘" }, label: { en: "Gateway", zh: "网关" }, sub: { en: "TLS · rate-limit", zh: "TLS · 限流" } },
  { id: "router", x: 64, y: 50, kind: { en: "ROUTE", zh: "路由" }, label: { en: "Router", zh: "路由器" }, sub: { en: "match /order/*", zh: "匹配 /order/*" } },
  { id: "auth", x: 80, y: 22, kind: { en: "SERVICE", zh: "服务" }, label: { en: "Auth", zh: "鉴权" }, sub: { en: "verify token", zh: "校验令牌" } },
  { id: "orders", x: 80, y: 50, kind: { en: "SERVICE", zh: "服务" }, label: { en: "Orders", zh: "订单" }, sub: { en: "query db", zh: "查询数据库" } },
  { id: "cache", x: 80, y: 78, kind: { en: "SERVICE", zh: "服务" }, label: { en: "Cache", zh: "缓存" }, sub: { en: "read-through", zh: "读穿透" } },
  { id: "egress", x: 93, y: 50, kind: { en: "EGRESS", zh: "出口" }, label: { en: "Response", zh: "响应" }, sub: { en: "200 · 41ms", zh: "200 · 41ms" } },
];

const EDGES: Array<[string, string]> = [
  ["client", "gateway"],
  ["gateway", "router"],
  ["router", "auth"],
  ["router", "orders"],
  ["router", "cache"],
  ["auth", "egress"],
  ["orders", "egress"],
  ["cache", "egress"],
];

const CORE = ["client", "gateway", "router"];
const SERVICES = ["auth", "orders", "cache"];

type NodeState = "dormant" | "live" | "warn";
type EdgeState = "idle" | "active" | "warn";

function nodeStatus(id: string, scene: number, beat: number): NodeState {
  if (scene <= 1) return "dormant";
  if (scene === 2) {
    if (id === "client") return "live";
    if (id === "gateway") return beat >= 1 ? "live" : "dormant";
    if (id === "router") return beat >= 2 ? "live" : "dormant";
    return "dormant";
  }
  if (scene === 3) {
    if (CORE.includes(id)) return "live";
    if (SERVICES.includes(id)) return beat >= 1 ? "live" : "dormant";
    return "dormant";
  }
  if (scene === 4) {
    if (id === "orders") return beat === 0 ? "warn" : "live";
    if (id === "egress") return "dormant";
    return "live";
  }
  return "live"; // scene 5
}

function edgeStatus(from: string, to: string, scene: number, beat: number): EdgeState {
  if (scene <= 1) return "idle";
  const isFan = from === "router";
  if (scene === 2) {
    if (from === "client") return "active";
    if (from === "gateway") return beat >= 1 ? "active" : "idle";
    return "idle";
  }
  if (scene === 3) {
    if (from === "client" || from === "gateway") return "active";
    if (isFan) return "active";
    return "idle";
  }
  if (scene === 4) {
    if (from === "client" || from === "gateway") return "active";
    if (isFan) return to === "orders" && beat === 0 ? "warn" : "active";
    return "idle";
  }
  return "active"; // scene 5
}

/* ── Diagram (nodes + directional connectors) ───────────── */
function Diagram({ scene, beat, language }: { scene: number; beat: number; language: Lang }) {
  const nodeById = (id: string) => NODES.find((n) => n.id === id)!;
  return (
    <div className={styles.diagram}>
      <svg className={styles.wires} viewBox="0 0 100 100" preserveAspectRatio="none">
        {EDGES.map(([from, to]) => {
          const a = nodeById(from);
          const b = nodeById(to);
          const st = edgeStatus(from, to, scene, beat);
          const cls =
            st === "active"
              ? `${styles.edge} ${styles.edgeActive}`
              : st === "warn"
              ? `${styles.edge} ${styles.edgeWarn}`
              : styles.edge;
          return (
            <line
              key={`${from}-${to}`}
              className={cls}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              vectorEffect="non-scaling-stroke"
            />
          );
        })}
      </svg>
      {NODES.map((n) => {
        const st = nodeStatus(n.id, scene, beat);
        const nodeCls =
          st === "live"
            ? `${styles.node} ${styles.nodeLive}`
            : st === "warn"
            ? `${styles.node} ${styles.nodeWarn}`
            : `${styles.node} ${styles.nodeDormant}`;
        const dotCls =
          st === "live"
            ? `${styles.nodeDot} ${styles.dotLive}`
            : st === "warn"
            ? `${styles.nodeDot} ${styles.dotWarn}`
            : styles.nodeDot;
        return (
          <div key={n.id} className={nodeCls} style={{ left: `${n.x}cqw`, top: `${n.y}cqh` }}>
            {st === "warn" && (
              <span className={styles.warnBadge}>{language === "en" ? "SLOW 812ms" : "延迟 812ms"}</span>
            )}
            {scene === 5 && n.id === "egress" && (
              <span className={styles.okBadge}>{language === "en" ? "200 OK · 41ms" : "200 OK · 41ms"}</span>
            )}
            <div className={styles.nodeHead}>
              <span className={dotCls} />
              <span className={styles.nodeKind}>{n.kind[language]}</span>
            </div>
            <div className={styles.nodeLabel}>{n.label[language]}</div>
            <div className={styles.nodeSub}>{n.sub[language]}</div>
          </div>
        );
      })}
    </div>
  );
}

/* ── Sidebar readout ────────────────────────────────────── */
function Sidebar({
  scene,
  beat,
  meta,
  language,
  flipRef,
}: {
  scene: number;
  beat: number;
  meta: StyleMetadata;
  language: Lang;
  flipRef: React.RefObject<HTMLDivElement>;
}) {
  const sc = meta.scenes[scene - 1];

  if (scene === 1) {
    const b = sc.beats[0];
    return (
      <div className={styles.side}>
        <div className={styles.lead}>
          <span className={styles.logAction}>{b.action}</span>
          <h1 className={styles.leadTitle}>{sc.title}</h1>
          <p className={styles.logBody}>{b.body}</p>
        </div>
      </div>
    );
  }

  const header = (
    <div className={styles.head}>
      <span className={styles.sceneNo}>{String(scene).padStart(2, "0")}</span>
      <span className={styles.sceneName}>{sc.title}</span>
    </div>
  );

  if (scene === 2) {
    // motion: log accumulates, existing items reflow via FLIP
    return (
      <div className={styles.side}>
        {header}
        <div
          ref={flipRef}
          className={styles.readout}
          data-beat-layout-container="true"
          data-beat-layout-mode="motion"
        >
          <span className={styles.readoutPill} data-beat-layout-item="true">
            <span className={styles.pillDot} />
            {language === "en" ? "SIGNAL STREAM" : "信号流"}
          </span>
          {sc.beats.slice(0, beat + 1).map((b) => (
            <div key={b.id} className={styles.logItem} data-beat-layout-item="true">
              <span className={styles.logAction}>{b.action}</span>
              <div className={styles.logTitle}>{b.title}</div>
              <p className={styles.logBody}>{b.body}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (scene === 3 || scene === 4) {
    // reserved: both slots present from beat 0, emphasis toggles
    return (
      <div className={styles.side}>
        {header}
        <div className={styles.readout} data-beat-layout-container="true" data-beat-layout-mode="reserved">
          {sc.beats.map((b, i) => (
            <div
              key={b.id}
              className={`${styles.slot} ${i <= beat ? styles.slotOn : styles.slotOff}`}
              data-beat-layout-item="true"
            >
              <span className={styles.logAction}>{b.action}</span>
              <div className={styles.logTitle}>{b.title}</div>
              <p className={styles.logBody}>{b.body}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // scene 5 (single beat)
  const b = sc.beats[0];
  return (
    <div className={styles.side}>
      {header}
      <div className={styles.readout}>
        <span className={styles.readoutPill}>
          <span className={styles.pillDot} />
          {language === "en" ? "PATH COMPLETE" : "链路完成"}
        </span>
        <div className={styles.logItem}>
          <span className={styles.logAction}>{b.action}</span>
          <div className={styles.logTitle}>{b.title}</div>
          <p className={styles.logBody}>{b.body}</p>
        </div>
      </div>
    </div>
  );
}

/* ── One scene panel ────────────────────────────────────── */
function PipelineScene({
  scene,
  beat,
  isActive,
  language,
  reducedMotion,
  isThumbnail,
}: {
  scene: number;
  beat: number;
  isActive: boolean;
  language: Lang;
  reducedMotion: boolean;
  isThumbnail: boolean;
}) {
  const still = reducedMotion || isThumbnail;
  const { ref } = useFLIP<HTMLDivElement>({
    watch: [beat],
    disabled: still || !isActive || scene !== 2,
    duration: 480,
    easing: "cubic-bezier(0.34, 1.56, 0.64, 1)",
    selector: '[data-beat-layout-item="true"]',
  });
  const meta = getMetadata(language);
  return (
    <div className={`${styles.scene} ${still ? styles.reduced : ""}`}>
      <Sidebar scene={scene} beat={beat} meta={meta} language={language} flipRef={ref} />
      <Diagram scene={scene} beat={beat} language={language} />
    </div>
  );
}

/* ── N6 stage stepper (ingress → egress) ────────────────── */
function StageStepper({
  scene,
  language,
  onNavigate,
  isThumbnail,
}: {
  scene: number;
  language: Lang;
  onNavigate?: (scene: number, beat: number) => void;
  isThumbnail: boolean;
}) {
  if (isThumbnail) return null;
  const labels: Record<Lang, string[]> = {
    en: ["INGRESS", "ROUTE", "FAN-OUT", "INSPECT", "EGRESS"],
    zh: ["入口", "路由", "扇出", "巡检", "出口"],
  };
  const fill = `${((scene - 1) / 4) * 80}%`;
  return (
    <div className={styles.stepper} onClick={(e) => e.stopPropagation()}>
      <div className={styles.stepTrack}>
        <div className={styles.stepFill} style={{ width: fill }} />
        {labels[language].map((label, i) => {
          const idx = i + 1;
          const cls =
            idx === scene
              ? `${styles.step} ${styles.stepOn}`
              : idx < scene
              ? `${styles.step} ${styles.stepDone}`
              : styles.step;
          return (
            <button
              key={label}
              className={cls}
              onClick={(e) => {
                e.stopPropagation();
                onNavigate?.(idx, 0);
              }}
            >
              <span className={styles.stepDotNode} />
              <span className={styles.stepLabel}>{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ── Transitions ────────────────────────────────────────── */
const TRANSITIONS: SceneTransitionMap = {
  "1->2": "slide-x",
  "2->3": "slide-x",
  "3->4": "glitch",
  "4->5": "fade",
};

/* ── Root component ─────────────────────────────────────── */
function WhereRequestGoesV3({
  scene,
  beat,
  language,
  isThumbnail,
  reducedMotion,
  onNavigate,
}: BespokeStyleProps) {
  useFonts();
  return (
    <div className={styles.root}>
      <div className={styles.grid} />
      <SpatialSceneTrack
        scene={scene}
        beat={beat}
        transitionKind="slide-x"
        transitionMap={TRANSITIONS}
        reducedMotion={reducedMotion || isThumbnail}
        beatLayoutModes={{ 2: "motion", 3: "reserved", 4: "reserved" }}
        renderScene={(sceneId, sceneBeat, isActive) => (
          <PipelineScene
            scene={sceneId}
            beat={sceneBeat}
            isActive={isActive}
            language={language}
            reducedMotion={reducedMotion}
            isThumbnail={isThumbnail}
          />
        )}
      />
      <StageStepper scene={scene} language={language} onNavigate={onNavigate} isThumbnail={isThumbnail} />
    </div>
  );
}

/* ── Metadata ───────────────────────────────────────────── */
export function getMetadata(lang: Lang): StyleMetadata {
  const en: StyleMetadata = {
    id: "11",
    band: "balanced-hybrid",
    name: "Signal Pipeline Flow",
    theme: "Where the Request Goes",
    densityLabel: "System diagram · routed flow",
    heroScene: 3,
    colors: { bg: "#070b12", ink: "#e3eef7", panel: "#101d2b" },
    typography: { header: "JetBrains Mono", body: "IBM Plex Mono" },
    tags: ["technical", "dark", "instrument", "directional-flow", "monospace"],
    fonts: ["JetBrains Mono", "IBM Plex Mono"],
    scenes: [
      {
        id: 1,
        title: "Where the Request Goes",
        beats: [
          { id: 0, action: "BOOT", title: "Where the Request Goes", body: "A single HTTP request, traced across a routed backend — ingress to egress." },
        ],
      },
      {
        id: 2,
        title: "Ingress",
        beats: [
          { id: 0, action: "INGRESS", title: "Request enters", body: "GET /order/42 hits the client edge; the first hop lights up." },
          { id: 1, action: "EDGE", title: "Through the gateway", body: "TLS terminates and the rate-limit passes; signal travels to the router." },
          { id: 2, action: "ROUTE", title: "Reaches the router", body: "Path /order/* is matched; the router is armed to dispatch." },
        ],
      },
      {
        id: 3,
        title: "The Fan-Out",
        beats: [
          { id: 0, action: "BRANCH", title: "Router fans out", body: "One request splits into three parallel dependency calls." },
          { id: 1, action: "DISPATCH", title: "Services engage", body: "Auth, Orders and Cache each pick up their slice of the work." },
        ],
      },
      {
        id: 4,
        title: "The Slow Node",
        beats: [
          { id: 0, action: "WARN", title: "Orders stalls", body: "The Orders service crosses its latency budget; flow slows to amber." },
          { id: 1, action: "RECOVER", title: "Signal clears", body: "The query returns; Orders drops back to healthy and flow resumes." },
        ],
      },
      {
        id: 5,
        title: "Response",
        beats: [
          { id: 0, action: "EGRESS", title: "Response returns", body: "Every stage lit, the path completes — 200 in 41ms back to the client." },
        ],
      },
    ],
  };

  const zh: StyleMetadata = {
    id: "11",
    band: "balanced-hybrid",
    name: "Signal Pipeline Flow",
    theme: "请求去哪了",
    densityLabel: "系统图 · 路由流",
    heroScene: 3,
    colors: { bg: "#070b12", ink: "#e3eef7", panel: "#101d2b" },
    typography: { header: "JetBrains Mono", body: "IBM Plex Mono" },
    tags: ["technical", "dark", "instrument", "directional-flow", "monospace"],
    fonts: ["JetBrains Mono", "IBM Plex Mono"],
    scenes: [
      {
        id: 1,
        title: "请求去哪了",
        beats: [
          { id: 0, action: "启动", title: "请求去哪了", body: "一条 HTTP 请求，沿着路由后端一路追踪——从入口到出口。" },
        ],
      },
      {
        id: 2,
        title: "入口",
        beats: [
          { id: 0, action: "入口", title: "请求进入", body: "GET /order/42 抵达客户端边缘，第一跳被点亮。" },
          { id: 1, action: "边缘", title: "穿过网关", body: "TLS 终结、限流放行，信号沿边继续前往路由器。" },
          { id: 2, action: "路由", title: "到达路由器", body: "命中路径 /order/*，路由器已就绪准备分发。" },
        ],
      },
      {
        id: 3,
        title: "扇出",
        beats: [
          { id: 0, action: "分支", title: "路由器扇出", body: "一条请求拆分为三路并行的依赖调用。" },
          { id: 1, action: "分发", title: "服务启动", body: "鉴权、订单与缓存各自承接自己那一份工作。" },
        ],
      },
      {
        id: 4,
        title: "慢节点",
        beats: [
          { id: 0, action: "告警", title: "订单卡顿", body: "订单服务越过延迟预算，流转转为琥珀色放缓。" },
          { id: 1, action: "恢复", title: "信号恢复", body: "查询返回，订单退回健康状态，流转随之恢复。" },
        ],
      },
      {
        id: 5,
        title: "响应",
        beats: [
          { id: 0, action: "出口", title: "响应返回", body: "所有节点点亮、链路闭合——41ms 内 200 返回客户端。" },
        ],
      },
    ],
  };

  return lang === "en" ? en : zh;
}

export const whereRequestGoesV3Version = defineStyleVersion({
  id: "v3",
  topic: { en: "Where the Request Goes", zh: "请求去哪了" },
  model: "Claude-Opus-4.8",
  component: WhereRequestGoesV3,
  getMetadata,
});

export default WhereRequestGoesV3;

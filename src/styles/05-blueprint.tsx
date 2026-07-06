import React, { useEffect, useCallback } from "react";
import type { BespokeStyleProps, StyleMetadata } from "../types";
import SpatialSceneTrack from "./SpatialSceneTrack";
import { useFLIP } from "../hooks/useFLIP";
import styles from "./05-blueprint.module.css";

// ─── Font Injection ────────────────────────────────────────────────────────

function useFonts() {
  useEffect(() => {
    const id = "style-05-fonts";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Inter:wght@200;300;400;500&family=JetBrains+Mono:wght@300;400;500&display=swap";
    document.head.appendChild(link);
  }, []);
}

// ─── Content ────────────────────────────────────────────────────────────────

interface SceneContent {
  en: {
    drawingNo?: string;
    title?: string;
    titleAccent?: string;
    subtitle?: string;
    meta?: Array<{ label: string; value: string }>;
    label?: string;
    heading?: string;
    layers?: Array<{ id: string; name: string; desc: string }>;
    flowNodes?: Array<{ label: string; name: string }>;
    specTitle?: string;
    specRev?: string;
    specBlocks?: Array<{ label: string; title: string; desc: string }>;
    closingDrawing?: string;
    closingStatement?: string;
    closingAccent?: string;
    closingSig?: string;
  };
  zh: {
    drawingNo?: string;
    title?: string;
    titleAccent?: string;
    subtitle?: string;
    meta?: Array<{ label: string; value: string }>;
    label?: string;
    heading?: string;
    layers?: Array<{ id: string; name: string; desc: string }>;
    flowNodes?: Array<{ label: string; name: string }>;
    specTitle?: string;
    specRev?: string;
    specBlocks?: Array<{ label: string; title: string; desc: string }>;
    closingDrawing?: string;
    closingStatement?: string;
    closingAccent?: string;
    closingSig?: string;
  };
}

const SCENES: Record<number, SceneContent> = {
  1: {
    en: {
      drawingNo: "DWG-2026-0042",
      title: "System",
      titleAccent: "Architecture",
      subtitle: "A technical blueprint for scalable, resilient infrastructure design",
      meta: [
        { label: "Scale", value: "1:100" },
        { label: "Sheet", value: "01/05" },
        { label: "Rev", value: "C" },
      ],
    },
    zh: {
      drawingNo: "DWG-2026-0042",
      title: "系统",
      titleAccent: "架构",
      subtitle: "可扩展、高弹性基础设施设计的技术蓝图",
      meta: [
        { label: "比例", value: "1:100" },
        { label: "图号", value: "01/05" },
        { label: "版本", value: "C" },
      ],
    },
  },
  2: {
    en: {
      label: "Section A-A",
      heading: "Four-layer system topology",
      layers: [
        { id: "L01", name: "Edge & CDN", desc: "Global anycast routing + static asset caching at 280+ PoPs" },
        { id: "L02", name: "API Gateway", desc: "Rate limiting, auth validation, request routing, protocol translation" },
        { id: "L03", name: "Service Mesh", desc: "mTLS inter-service comms, circuit breaking, distributed tracing" },
        { id: "L04", name: "Data Plane", desc: "Sharded PostgreSQL + Redis cluster + event-sourced write log" },
      ],
    },
    zh: {
      label: "A-A 剖面",
      heading: "四层系统拓扑结构",
      layers: [
        { id: "L01", name: "边缘与 CDN", desc: "全球任播路由 + 280+ 节点静态资源缓存" },
        { id: "L02", name: "API 网关", desc: "限流、鉴权、请求路由、协议转换" },
        { id: "L03", name: "服务网格", desc: "mTLS 服务间通信、熔断、分布式追踪" },
        { id: "L04", name: "数据平面", desc: "分片 PostgreSQL + Redis 集群 + 事件溯源写入日志" },
      ],
    },
  },
  3: {
    en: {
      label: "Data Flow Diagram",
      heading: "Request lifecycle end-to-end",
      flowNodes: [
        { label: "CLIENT", name: "Browser / SDK" },
        { label: "INGRESS", name: "Load Balancer" },
        { label: "COMPUTE", name: "Service Pods" },
        { label: "CACHE", name: "Redis Lookup" },
        { label: "PERSIST", name: "Primary DB" },
      ],
    },
    zh: {
      label: "数据流图",
      heading: "请求生命周期全链路",
      flowNodes: [
        { label: "客户端", name: "浏览器 / SDK" },
        { label: "入口", name: "负载均衡" },
        { label: "计算", name: "服务 Pod" },
        { label: "缓存", name: "Redis 查询" },
        { label: "持久化", name: "主数据库" },
      ],
    },
  },
  4: {
    en: {
      label: "Architecture Specification",
      specTitle: "Platform v3.0 — Core Systems",
      specRev: "REV. C / 2026.07",
      specBlocks: [
        {
          label: "Availability",
          title: "99.99% SLA target",
          desc: "Multi-AZ failover with automated health checks and 30-second RTO.",
        },
        {
          label: "Scalability",
          title: "Horizontal pod autoscaling",
          desc: "Custom metrics-driven scaling to 10x baseline load within 90 seconds.",
        },
        {
          label: "Security",
          title: "Zero-trust perimeter",
          desc: "Workload identity, mTLS everywhere, secrets rotation every 15 minutes.",
        },
        {
          label: "Observability",
          title: "Full-stack telemetry",
          desc: "OpenTelemetry traces, structured logs, and SLO-based alerting pipeline.",
        },
      ],
    },
    zh: {
      label: "架构规格书",
      specTitle: "平台 v3.0 — 核心系统",
      specRev: "版本 C / 2026.07",
      specBlocks: [
        {
          label: "可用性",
          title: "99.99% SLA 目标",
          desc: "多可用区故障转移，自动健康检查，30 秒恢复时间目标。",
        },
        {
          label: "可扩展性",
          title: "水平 Pod 自动伸缩",
          desc: "基于自定义指标的伸缩，90 秒内扩展至基准负载的 10 倍。",
        },
        {
          label: "安全性",
          title: "零信任边界",
          desc: "工作负载身份、全链路 mTLS、每 15 分钟密钥轮换。",
        },
        {
          label: "可观测性",
          title: "全栈遥测",
          desc: "OpenTelemetry 追踪、结构化日志、基于 SLO 的告警管道。",
        },
      ],
    },
  },
  5: {
    en: {
      closingDrawing: "END OF DRAWING",
      closingStatement: "Built to ",
      closingAccent: "scale.",
      closingSig: "Engineering Team  ·  Approved  ·  2026",
    },
    zh: {
      closingDrawing: "图纸结束",
      closingStatement: "为",
      closingAccent: "规模而建。",
      closingSig: "工程团队  ·  已批准  ·  2026",
    },
  },
};

// ─── Registration Mark SVG ─────────────────────────────────────────────────

function RegMark({ className }: { className: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="20" cy="20" r="12" stroke="#8ecae6" strokeWidth="1" opacity="0.3" />
      <line x1="20" y1="4" x2="20" y2="36" stroke="#8ecae6" strokeWidth="1" opacity="0.3" />
      <line x1="4" y1="20" x2="36" y2="20" stroke="#8ecae6" strokeWidth="1" opacity="0.3" />
    </svg>
  );
}

// ─── Ruler Nav SVG tick ────────────────────────────────────────────────────

// ─── Architecture Diagram SVG (Scene 4) ────────────────────────────────────

function ArchDiagram() {
  return (
    <svg viewBox="0 0 800 200" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {/* Grid lines */}
      {[...Array(16)].map((_, i) => (
        <line
          key={`gv${i}`}
          x1={(i + 1) * 50}
          y1="0"
          x2={(i + 1) * 50}
          y2="200"
          stroke="#8ecae6"
          strokeWidth="0.5"
          opacity="0.1"
        />
      ))}
      {[...Array(3)].map((_, i) => (
        <line
          key={`gh${i}`}
          x1="0"
          y1={(i + 1) * 50}
          x2="800"
          y2={(i + 1) * 50}
          stroke="#8ecae6"
          strokeWidth="0.5"
          opacity="0.1"
        />
      ))}
      {/* Main system box */}
      <rect x="40" y="30" width="720" height="140" stroke="#8ecae6" strokeWidth="1" opacity="0.4" fill="none" />
      {/* Inner boxes */}
      <rect x="60" y="50" width="160" height="100" stroke="#8ecae6" strokeWidth="1" opacity="0.6" fill="rgba(79,195,247,0.05)" />
      <text x="140" y="105" textAnchor="middle" fill="#8ecae6" fontSize="14" fontFamily="JetBrains Mono, monospace" opacity="0.8">GATEWAY</text>
      <rect x="250" y="50" width="160" height="100" stroke="#8ecae6" strokeWidth="1" opacity="0.6" fill="rgba(79,195,247,0.05)" />
      <text x="330" y="105" textAnchor="middle" fill="#8ecae6" fontSize="14" fontFamily="JetBrains Mono, monospace" opacity="0.8">SERVICES</text>
      <rect x="440" y="50" width="140" height="100" stroke="#8ecae6" strokeWidth="1" opacity="0.6" fill="rgba(79,195,247,0.05)" />
      <text x="510" y="105" textAnchor="middle" fill="#8ecae6" fontSize="14" fontFamily="JetBrains Mono, monospace" opacity="0.8">CACHE</text>
      <rect x="610" y="50" width="130" height="100" stroke="#8ecae6" strokeWidth="1" opacity="0.6" fill="rgba(79,195,247,0.05)" />
      <text x="675" y="105" textAnchor="middle" fill="#8ecae6" fontSize="14" fontFamily="JetBrains Mono, monospace" opacity="0.8">DATA</text>
      {/* Connectors */}
      <line x1="220" y1="100" x2="250" y2="100" stroke="#8ecae6" strokeWidth="1" opacity="0.4" />
      <line x1="410" y1="100" x2="440" y2="100" stroke="#8ecae6" strokeWidth="1" opacity="0.4" />
      <line x1="580" y1="100" x2="610" y2="100" stroke="#8ecae6" strokeWidth="1" opacity="0.4" />
      {/* Dimension lines */}
      <line x1="40" y1="185" x2="760" y2="185" stroke="#8ecae6" strokeWidth="0.5" opacity="0.25" />
      <line x1="40" y1="180" x2="40" y2="190" stroke="#8ecae6" strokeWidth="0.5" opacity="0.25" />
      <line x1="760" y1="180" x2="760" y2="190" stroke="#8ecae6" strokeWidth="0.5" opacity="0.25" />
      <text x="400" y="196" textAnchor="middle" fill="#8ecae6" fontSize="10" fontFamily="JetBrains Mono, monospace" opacity="0.4">720 UNITS</text>
    </svg>
  );
}

// ─── Metadata ───────────────────────────────────────────────────────────────

export function getMetadata(lang: "en" | "zh"): StyleMetadata {
  const nameMap = { en: "Cyanotype Drafting Table", zh: "蓝图制图台" };
  const themeMap = {
    en: "Blueprint paper laid flat on a drafting table — deep Prussian-blue ground, chalk-white linework, pale cyan construction guides, and one scarce warm annotation for system schematics and architectural diagrams",
    zh: "平铺在制图台上的蓝图纸张——深普鲁士蓝底色、粉笔白线条、浅蓝构造辅助线、一抹稀缺的暖色标注，适用于系统原理图和架构图",
  };
  const densityLabelMap = { en: "Technical", zh: "技术型" };

  const sceneTitles = {
    en: ["Title Sheet", "System Topology", "Data Flow", "Architecture Spec", "Closing"],
    zh: ["标题页", "系统拓扑", "数据流", "架构规格", "结语"],
  };

  const beatActions = {
    en: {
      1: ["Title and metadata appear"],
      2: ["Heading appears", "Layers 1-2 populate", "Layers 3-4 populate"],
      3: ["Heading appears", "Flow nodes connect"],
      4: ["Spec header appears", "Blocks 1-2 appear", "Blocks 3-4 appear"],
      5: ["Closing statement revealed"],
    },
    zh: {
      1: ["标题和元数据呈现"],
      2: ["标题呈现", "第 1-2 层填充", "第 3-4 层填充"],
      3: ["标题呈现", "流程节点连接"],
      4: ["规格标题呈现", "第 1-2 块呈现", "第 3-4 块呈现"],
      5: ["结语揭示"],
    },
  };

  const BEAT_COUNTS: Record<number, number> = {
    1: 1,
    2: 3,
    3: 2,
    4: 3,
    5: 1,
  };

  const scenes = [1, 2, 3, 4, 5].map((id) => {
    const beatCount = BEAT_COUNTS[id];
    const actions = beatActions[lang][id as keyof (typeof beatActions)["en"]];
    const c = SCENES[id][lang];

    const beats = Array.from({ length: beatCount }, (_, beatIdx) => {
      let beatTitle = "";
      let beatBody = "";

      if (id === 1) {
        beatTitle = `${c.title || ""} ${c.titleAccent || ""}`;
        beatBody = c.subtitle || "";
      } else if (id === 2) {
        beatTitle = c.heading || "";
        const visibleLayers = (c.layers || []).slice(0, Math.min(beatIdx * 2, 4));
        beatBody = visibleLayers.map((l) => `${l.id} ${l.name}`).join(" / ");
      } else if (id === 3) {
        beatTitle = c.heading || "";
        if (beatIdx >= 1) {
          beatBody = (c.flowNodes || []).map((n) => n.name).join(" -> ");
        }
      } else if (id === 4) {
        beatTitle = c.specTitle || "";
        const visibleBlocks = (c.specBlocks || []).slice(0, Math.min(beatIdx * 2, 4));
        beatBody = beatIdx >= 1 ? visibleBlocks.map((b) => b.title).join(" / ") : "";
      } else if (id === 5) {
        beatTitle = `${c.closingStatement || ""}${c.closingAccent || ""}`;
        beatBody = c.closingSig || "";
      }

      return { id: beatIdx, action: actions[beatIdx], title: beatTitle, body: beatBody };
    });

    return { id, title: sceneTitles[lang][id - 1], beats };
  });

  return {
    id: "05",
    band: "minimal-keynote",
    name: nameMap[lang],
    theme: themeMap[lang],
    densityLabel: densityLabelMap[lang],
    heroScene: 4,
    colors: {
      bg: "#0a1929",
      ink: "#f0ede6",
      panel: "#132f4c",
    },
    typography: {
      header: "JetBrains Mono 400",
      body: "JetBrains Mono 300",
    },
    tags: [
      "cyanotype",
      "blueprint",
      "drafting",
      "prussian-blue",
      "chalk-white",
      "construction-lines",
      "technical",
      "diagram",
      "stencil",
    ],
    fonts: ["Inter", "JetBrains Mono"],
    scenes,
  };
}

// ─── Transition constants ───────────────────────────────────────────────────

// ─── Component ──────────────────────────────────────────────────────────────

const BEAT_LAYOUT_MODES = {
  2: "motion",
  3: "motion",
  4: "motion",
} satisfies Record<number, "motion" | "reserved">;

export default function Blueprint({
  scene,
  beat,
  language,
  isThumbnail,
  reducedMotion,
  onNavigate,
}: BespokeStyleProps) {
  useFonts();

  // ── Transition state ────────────────────────────────────────────────────

  // ── FLIP for list reflows ───────────────────────────────────────────────
  const { ref: layersFlipRef } = useFLIP<HTMLDivElement>({
    watch: [beat],
    duration: 400,
    easing: "cubic-bezier(0.16, 1, 0.3, 1)",
  });
  const { ref: specFlipRef } = useFLIP<HTMLDivElement>({
    watch: [beat],
    duration: 400,
    easing: "cubic-bezier(0.16, 1, 0.3, 1)",
  });

  const handleNavClick = useCallback(
    (e: React.MouseEvent, targetScene: number) => {
      e.stopPropagation();
      onNavigate?.(targetScene, 0);
    },
    [onNavigate],
  );

  const rootClasses = [
    styles.root,
    reducedMotion ? styles.reducedMotion : "",
    isThumbnail ? styles.thumbnail : "",
  ]
    .filter(Boolean)
    .join(" ");

  // ── Scene renderers ─────────────────────────────────────────────────────

  const renderScene1 = () => {
    const c = SCENES[1][language];
    return (
      <div className={styles.scene1}>
        <span className={styles.drawingNo}>{c.drawingNo}</span>
        <h1 className={styles.archTitle}>
          {c.title} <em>{c.titleAccent}</em>
        </h1>
        <div className={styles.titleRule} />
        <p className={styles.titleSub}>{c.subtitle}</p>
        <div className={styles.titleMeta}>
          {(c.meta || []).map((m, i) => (
            <span key={i}>
              {m.label}: {m.value}
            </span>
          ))}
        </div>
      </div>
    );
  };

  const renderScene2 = (beatNum: number) => {
    const c = SCENES[2][language];
    const layers = c.layers || [];
    const visibleCount = Math.min(beatNum * 2, 4);
    return (
      <div className={styles.scene2}>
        <span className={styles.sceneLabel}>{c.label}</span>
        <h2 className={styles.sceneHeading}>{c.heading}</h2>
        <div className={styles.systemLayers} ref={layersFlipRef}>
          {layers.map((layer, i) => {
            const visible = i < visibleCount;
            const layerClasses = [
              styles.sysLayer,
              visible ? styles.sysLayerVisible : "",
            ]
              .filter(Boolean)
              .join(" ");
            return (
              <div
                key={i}
                className={layerClasses}
                style={
                  reducedMotion
                    ? { opacity: visible ? 1 : 0, transform: "none" }
                    : { transitionDelay: `${i * 0.1}s` }
                }
              >
                <span className={styles.layerId}>{layer.id}</span>
                <span className={styles.layerName}>{layer.name}</span>
                <span className={styles.layerDesc}>{layer.desc}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderScene3 = (beatNum: number) => {
    const c = SCENES[3][language];
    const nodes = c.flowNodes || [];
    return (
      <div className={styles.scene3}>
        <span className={styles.sceneLabel}>{c.label}</span>
        <h2 className={styles.sceneHeading}>{c.heading}</h2>
        <div className={styles.flowDiagram}>
          {nodes.map((node, i) => {
            const visible = beatNum >= 1;
            const nodeClasses = [
              styles.flowNode,
              visible ? styles.flowNodeVisible : "",
            ]
              .filter(Boolean)
              .join(" ");
            return (
              <React.Fragment key={i}>
                <div
                  className={nodeClasses}
                  style={
                    reducedMotion
                      ? { opacity: visible ? 1 : 0, transform: "none" }
                      : { transitionDelay: `${i * 0.12}s` }
                  }
                >
                  <div className={styles.nodeBox}>
                    <span className={styles.nodeLabel}>{node.label}</span>
                  </div>
                  <span className={styles.nodeName}>{node.name}</span>
                </div>
                {i < nodes.length - 1 && (
                  <div className={styles.flowArrow} aria-hidden="true">
                    <svg viewBox="0 0 40 16" width="100%" height="3cqh">
                      <line
                        x1="0"
                        y1="8"
                        x2="34"
                        y2="8"
                        stroke="#8ecae6"
                        strokeWidth="1"
                        opacity="0.3"
                      />
                      <polygon points="34,4 40,8 34,12" fill="#8ecae6" opacity="0.3" />
                    </svg>
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    );
  };

  const renderScene4 = (beatNum: number) => {
    const c = SCENES[4][language];
    const blocks = c.specBlocks || [];
    const visibleCount = Math.min(beatNum * 2, 4);
    return (
      <div className={styles.scene4}>
        <span className={styles.sceneLabel}>{c.label}</span>
        <div className={styles.specHeader}>
          <h2 className={styles.specTitle}>{c.specTitle}</h2>
          <span className={styles.specRev}>{c.specRev}</span>
        </div>
        <div className={styles.specGrid} ref={specFlipRef}>
          {blocks.map((block, i) => {
            const visible = i < visibleCount;
            const blockClasses = [
              styles.specBlock,
              visible ? styles.specBlockVisible : "",
            ]
              .filter(Boolean)
              .join(" ");
            return (
              <div
                key={i}
                className={blockClasses}
                style={
                  reducedMotion
                    ? { opacity: visible ? 1 : 0, transform: "none" }
                    : { transitionDelay: `${i * 0.1}s` }
                }
              >
                <div className={styles.specBlockLabel}>{block.label}</div>
                <h3 className={styles.specBlockTitle}>{block.title}</h3>
                <p className={styles.specBlockDesc}>{block.desc}</p>
              </div>
            );
          })}
          <div className={styles.specDiagram}>
            <ArchDiagram />
          </div>
        </div>
      </div>
    );
  };

  const renderScene5 = () => {
    const c = SCENES[5][language];
    return (
      <div className={styles.scene5}>
        <span className={styles.closingDrawing}>{c.closingDrawing}</span>
        <h2 className={styles.closingStatement}>
          {c.closingStatement}
          <span>{c.closingAccent}</span>
        </h2>
        <p className={styles.closingSig}>{c.closingSig}</p>
      </div>
    );
  };

  const renderSceneFor = (sceneNum: number, beatNum: number) => {
    switch (sceneNum) {
      case 1:
        return renderScene1();
      case 2:
        return renderScene2(beatNum);
      case 3:
        return renderScene3(beatNum);
      case 4:
        return renderScene4(beatNum);
      case 5:
        return renderScene5();
      default:
        return null;
    }
  };

  // ── Navigation ──────────────────────────────────────────────────────────

  const renderNav = () => {
    if (isThumbnail) return null;

    return (
      <nav className={styles.rulerNav} aria-label="Scene navigation">
        <div className={styles.rulerTrack} aria-hidden="true" />
        {[1, 2, 3, 4, 5].map((s) => {
          const isActive = s === scene;
          const itemClasses = [
            styles.rulerMarker,
            isActive ? styles.rulerMarkerActive : "",
          ]
            .filter(Boolean)
            .join(" ");
          return (
            <button
              key={s}
              type="button"
              className={itemClasses}
              aria-label={`Jump to scene ${s}`}
              onClick={(e) => handleNavClick(e, s)}
            >
              <span className={styles.rulerNumber}>
                {String(s).padStart(2, "0")}
              </span>
              <span className={styles.rulerTick} aria-hidden="true" />
            </button>
          );
        })}
      </nav>
    );
  };

  return (
    <div className={rootClasses}>
      {/* Blueprint grid background */}
      <div className={styles.gridBg} aria-hidden="true">
        <div className={styles.gridMajor} />
        <div className={styles.gridMinor} />
      </div>

      {/* Registration marks */}
      <RegMark className={`${styles.regMark} ${styles.regMarkTL}`} />
      <RegMark className={`${styles.regMark} ${styles.regMarkTR}`} />
      <RegMark className={`${styles.regMark} ${styles.regMarkBL}`} />
      <RegMark className={`${styles.regMark} ${styles.regMarkBR}`} />

            <SpatialSceneTrack
        scene={scene}
        beat={beat}
        axis="x"
        reducedMotion={reducedMotion || isThumbnail}
        beatLayoutModes={BEAT_LAYOUT_MODES}
        renderScene={(sceneId, sceneBeat) => (
          <div className={styles.sceneLayer}>
            <div className={styles.track}>
              {renderSceneFor(sceneId, sceneBeat)}
            </div>
          </div>
        )}
      />

      {renderNav()}
    </div>
  );
}

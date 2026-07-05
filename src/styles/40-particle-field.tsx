import React, { useEffect, useState, useCallback, useMemo, useRef } from "react";
import type { BespokeStyleProps, StyleMetadata } from "../types";
import styles from "./40-particle-field.module.css";
import { useFLIP } from "../hooks/useFLIP";

// ─── Content ────────────────────────────────────────────────────────────────

interface SceneContent {
  en: {
    title: string;
    subtitle?: string;
    nodeLabels?: string[];
    beatSubtitles?: string[];
    clusterData?: Array<{ name: string; count: number; color: string }>;
    stats?: Array<{ label: string; value: string }>;
  };
  zh: {
    title: string;
    subtitle?: string;
    nodeLabels?: string[];
    beatSubtitles?: string[];
    clusterData?: Array<{ name: string; count: number; color: string }>;
    stats?: Array<{ label: string; value: string }>;
  };
}

const SCENES: Record<number, SceneContent> = {
  1: {
    en: {
      title: "Network Analysis",
      subtitle: "Understanding connection patterns in complex systems",
    },
    zh: {
      title: "网络分析",
      subtitle: "理解复杂系统中的连接模式",
    },
  },
  2: {
    en: {
      title: "Node Topology",
      subtitle: "64 nodes · 128 edges · 4 communities detected",
      nodeLabels: ["Gateway", "Auth", "API", "DB", "Cache", "CDN"],
    },
    zh: {
      title: "节点拓扑",
      subtitle: "64 节点 · 128 边 · 检测到 4 个社区",
      nodeLabels: ["网关", "认证", "API", "数据库", "缓存", "CDN"],
    },
  },
  3: {
    en: {
      title: "Force-Directed Layout",
      beatSubtitles: [
        "Initial random placement",
        "Repulsion forces applied",
        "Communities stabilized",
      ],
    },
    zh: {
      title: "力导向布局",
      beatSubtitles: ["初始随机分布", "斥力作用中", "社区稳定"],
    },
  },
  4: {
    en: {
      title: "Cluster Analysis",
      subtitle: "Four distinct communities identified by modularity optimization",
      clusterData: [
        { name: "Core Services", count: 18, color: "#818cf8" },
        { name: "Data Layer", count: 15, color: "#34d399" },
        { name: "Edge Nodes", count: 22, color: "#f472b6" },
        { name: "Monitoring", count: 9, color: "#fbbf24" },
      ],
    },
    zh: {
      title: "聚类分析",
      subtitle: "通过模块度优化识别出四个不同社区",
      clusterData: [
        { name: "核心服务", count: 18, color: "#818cf8" },
        { name: "数据层", count: 15, color: "#34d399" },
        { name: "边缘节点", count: 22, color: "#f472b6" },
        { name: "监控", count: 9, color: "#fbbf24" },
      ],
    },
  },
  5: {
    en: {
      title: "Network Summary",
      stats: [
        { label: "Total Nodes", value: "64" },
        { label: "Connections", value: "128" },
        { label: "Communities", value: "4" },
        { label: "Avg Degree", value: "4.0" },
      ],
    },
    zh: {
      title: "网络概览",
      stats: [
        { label: "节点总数", value: "64" },
        { label: "连接数", value: "128" },
        { label: "社区数", value: "4" },
        { label: "平均度", value: "4.0" },
      ],
    },
  },
};

// ─── Particle Generation ────────────────────────────────────────────────────

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

interface Particle {
  x: number;
  y: number;
  size: number;
  cluster: number;
}

function generateParticles(
  count: number,
  seed: number,
  layout: "scatter" | "network" | "clusters",
): Particle[] {
  const rand = seededRandom(seed);
  const particles: Particle[] = [];

  if (layout === "scatter") {
    for (let i = 0; i < count; i++) {
      particles.push({
        x: 8 + rand() * 84,
        y: 10 + rand() * 75,
        size: 0.6 + rand() * 0.8,
        cluster: 0,
      });
    }
  } else if (layout === "network") {
    const cx = 50,
      cy = 50;
    for (let i = 0; i < count; i++) {
      const angle = rand() * Math.PI * 2;
      const radius = 5 + rand() * 38;
      particles.push({
        x: cx + Math.cos(angle) * radius,
        y: cy + Math.sin(angle) * radius,
        size: 0.7 + rand() * 0.9,
        cluster: Math.floor(rand() * 4),
      });
    }
  } else {
    // clusters
    const centers = [
      { x: 25, y: 30 },
      { x: 72, y: 28 },
      { x: 28, y: 72 },
      { x: 70, y: 68 },
    ];
    const perCluster = Math.ceil(count / 4);
    for (let c = 0; c < 4; c++) {
      for (let i = 0; i < perCluster && particles.length < count; i++) {
        const angle = rand() * Math.PI * 2;
        const radius = rand() * 12;
        particles.push({
          x: centers[c].x + Math.cos(angle) * radius,
          y: centers[c].y + Math.sin(angle) * radius,
          size: 0.7 + rand() * 0.9,
          cluster: c,
        });
      }
    }
  }

  return particles;
}

function generateConnections(
  particles: Particle[],
  maxDist: number,
  seed: number,
): Array<[number, number]> {
  const rand = seededRandom(seed + 999);
  const conns: Array<[number, number]> = [];
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < maxDist && rand() > 0.3) {
        conns.push([i, j]);
      }
    }
  }
  return conns;
}

// ─── Metadata ───────────────────────────────────────────────────────────────

export function getMetadata(lang: "en" | "zh"): StyleMetadata {
  const nameMap = { en: "Particle Field", zh: "粒子场" };
  const themeMap = {
    en: "Network Analysis — particle systems and force-directed graph visualization of complex networks",
    zh: "网络分析——粒子系统和力导向图可视化复杂网络",
  };
  const densityLabelMap = { en: "Visual-Intensive", zh: "视觉密集" };

  const sceneTitles = {
    en: ["Particle Cloud", "Node Topology", "Force Layout", "Clusters", "Summary"],
    zh: ["粒子云", "节点拓扑", "力导向布局", "聚类分析", "网络概览"],
  };

  const beatActions = {
    en: {
      1: ["Particles appear"],
      2: ["Network lines form", "Node labels appear"],
      3: ["Random placement", "Repulsion phase", "Communities settle"],
      4: ["Clusters revealed", "Stats overlay"],
      5: ["Summary stats shown"],
    },
    zh: {
      1: ["粒子呈现"],
      2: ["网络连线形成", "节点标签出现"],
      3: ["随机分布", "斥力阶段", "社区稳定"],
      4: ["聚类揭示", "统计叠加"],
      5: ["摘要数据展示"],
    },
  };

  const BEAT_COUNTS: Record<number, number> = {
    1: 1,
    2: 2,
    3: 3,
    4: 2,
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
        beatTitle = c.title;
        beatBody = c.subtitle || "";
      } else if (id === 2) {
        beatTitle = c.title;
        beatBody =
          beatIdx >= 1
            ? (c.nodeLabels || []).join(" / ")
            : c.subtitle || "";
      } else if (id === 3) {
        beatTitle = c.title;
        beatBody = c.beatSubtitles?.[beatIdx] || "";
      } else if (id === 4) {
        beatTitle = c.title;
        const visible = (c.clusterData || []).slice(0, beatIdx + 2);
        beatBody = visible.map((d) => `${d.name}: ${d.count}`).join(" / ");
      } else if (id === 5) {
        beatTitle = c.title;
        beatBody = (c.stats || []).map((s) => `${s.label}: ${s.value}`).join(" / ");
      }

      return {
        id: beatIdx,
        action: actions[beatIdx],
        title: beatTitle,
        body: beatBody,
      };
    });

    return { id, title: sceneTitles[lang][id - 1], beats };
  });

  return {
    id: "40",
    band: "contemporary-digital",
    name: nameMap[lang],
    theme: themeMap[lang],
    densityLabel: densityLabelMap[lang],
    heroScene: 3,
    colors: { bg: "#050510", ink: "#e0e0ff", panel: "#0a0a20" },
    typography: { header: "Inter 600", body: "Inter 400" },
    tags: [
      "particles",
      "network",
      "data-viz",
      "graph",
      "nodes",
      "scientific",
      "animation",
      "dark",
    ],
    fonts: ["Inter"],
    scenes,
  };
}

// ─── Component ──────────────────────────────────────────────────────────────

const CLUSTER_COLORS = ["#818cf8", "#34d399", "#f472b6", "#fbbf24"];
const TRANSITION_DURATION = 800; // ms — outgoing 500ms + incoming 500ms w/ 200ms delay

function computeParticles(sceneNum: number, beatNum: number) {
  if (sceneNum === 1) {
    const p = generateParticles(65, 42, "scatter");
    return { particles: p, connections: [] as Array<[number, number]> };
  }
  if (sceneNum === 2) {
    const p = generateParticles(55, 77, "network");
    const c = generateConnections(p, 18, 77);
    return { particles: p, connections: c };
  }
  if (sceneNum === 3) {
    const seeds = [11, 22, 33];
    const layouts: Array<"scatter" | "network" | "clusters"> = [
      "scatter",
      "network",
      "clusters",
    ];
    const idx = Math.min(beatNum, 2);
    const p = generateParticles(60, seeds[idx], layouts[idx]);
    const c = generateConnections(p, 16, seeds[idx]);
    return { particles: p, connections: c };
  }
  if (sceneNum === 4) {
    const p = generateParticles(64, 55, "clusters");
    const c = generateConnections(p, 14, 55);
    return { particles: p, connections: c };
  }
  return { particles: [] as Particle[], connections: [] as Array<[number, number]> };
}

export default function ParticleField({
  scene,
  beat,
  language,
  isThumbnail,
  reducedMotion,
  onNavigate,
  isTransitionClone,
}: BespokeStyleProps) {
  const [entered, setEntered] = useState(false);
  const [outgoingScene, setOutgoingScene] = useState<number | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const prevSceneRef = useRef<number>(scene);

  // Detect scene changes and manage transition lifecycle
  useEffect(() => {
    const prev = prevSceneRef.current;
    if (prev !== scene && !reducedMotion) {
      setOutgoingScene(prev);
      setIsTransitioning(true);
      const timer = setTimeout(() => {
        setOutgoingScene(null);
        setIsTransitioning(false);
      }, TRANSITION_DURATION);
      prevSceneRef.current = scene;
      return () => clearTimeout(timer);
    }
    prevSceneRef.current = scene;
  }, [scene, reducedMotion]);

  // FLIP for particle container — particles animate between positions on beat changes
  const { ref: particleFieldRef } = useFLIP<HTMLDivElement>({
    watch: [beat],
    duration: 500,
    easing: "cubic-bezier(0.16, 1, 0.3, 1)",
    selector: ".particle",
  });

  useEffect(() => {
    const FONT_ID = "style-40-fonts-inter";
    if (!document.getElementById(FONT_ID)) {
      const link = document.createElement("link");
      link.id = FONT_ID;
      link.rel = "stylesheet";
      link.href =
        "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap";
      document.head.appendChild(link);
    }
  }, []);

  useEffect(() => {
    setEntered(false);
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => setEntered(true));
    });
    return () => cancelAnimationFrame(id);
  }, [scene]);

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
  ]
    .filter(Boolean)
    .join(" ");

  // Generate particles based on scene
  const { particles, connections } = useMemo(() => {
    return computeParticles(scene, beat);
  }, [scene, beat]);

  // Generate particles for outgoing scene (always at max beat state)
  const outgoingParticles = useMemo(() => {
    if (outgoingScene === null) return { particles: [] as Particle[], connections: [] as Array<[number, number]> };
    const maxBeat = ({ 1: 0, 2: 1, 3: 2, 4: 1, 5: 0 } as Record<number, number>)[outgoingScene] ?? 0;
    return computeParticles(outgoingScene, maxBeat);
  }, [outgoingScene]);

  // ── Render scene content ────────────────────────────────────────────────

  const renderParticleField = (
    showConnections: boolean,
    showLabels: boolean,
    forceEntered = false,
    overrideScene?: number,
    overrideBeat?: number,
  ) => {
    const effScene = overrideScene ?? scene;
    const effBeat = overrideBeat ?? beat;
    const effEntered = forceEntered || entered;
    const c = SCENES[effScene][language];
    const labels = c.nodeLabels || [];
    const useParticles = overrideScene !== undefined ? outgoingParticles.particles : particles;
    const useConnections = overrideScene !== undefined ? outgoingParticles.connections : connections;

    return (
      <div ref={overrideScene === undefined ? particleFieldRef : undefined} className={styles.particleContainer}>
        {showConnections && useConnections.length > 0 && (
          <svg
            className={styles.connectionSvg}
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            {useConnections.map(([i, j], idx) => {
              const p1 = useParticles[i];
              const p2 = useParticles[j];
              if (!p1 || !p2) return null;
              const color =
                effScene === 4
                  ? CLUSTER_COLORS[p1.cluster] + "40"
                  : "rgba(99, 102, 241, 0.15)";
              return (
                <line
                  key={idx}
                  x1={p1.x}
                  y1={p1.y}
                  x2={p2.x}
                  y2={p2.y}
                  stroke={color}
                  strokeWidth="0.15"
                  vectorEffect="non-scaling-stroke"
                  style={{
                    opacity: effEntered ? 1 : 0,
                    transition: reducedMotion
                      ? "none"
                      : `opacity 0.6s ease ${idx * 0.005}s`,
                  }}
                />
              );
            })}
          </svg>
        )}
        {useParticles.map((p, i) => {
          const color =
            effScene === 4 || effScene === 3
              ? CLUSTER_COLORS[p.cluster]
              : "#6366f1";
          return (
            <div
              key={i}
              className={`${styles.particle} particle`}
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                width: `${p.size}cqh`,
                height: `${p.size}cqh`,
                background: color,
                boxShadow: `0 0 ${p.size * 2}cqh ${color}80`,
                opacity: effEntered ? 1 : 0,
                transform: effEntered ? "scale(1)" : "scale(0)",
                transition: reducedMotion
                  ? "none"
                  : `opacity 0.5s ease ${i * 0.01}s, transform 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.01}s`,
              }}
            />
          );
        })}
        {showLabels &&
          labels.slice(0, 6).map((label, i) => {
            const positions = [
              { x: 50, y: 15 },
              { x: 82, y: 35 },
              { x: 75, y: 72 },
              { x: 45, y: 85 },
              { x: 15, y: 65 },
              { x: 18, y: 28 },
            ];
            const pos = positions[i];
            return (
              <div
                key={i}
                className={styles.nodeLabel}
                style={{
                  left: `${pos.x}%`,
                  top: `${pos.y}%`,
                  opacity: effEntered && effBeat >= 1 ? 1 : 0,
                  transition: reducedMotion
                    ? "none"
                    : `opacity 0.4s ease ${0.4 + i * 0.1}s`,
                }}
              >
                {label}
              </div>
            );
          })}
      </div>
    );
  };

  const renderScene1 = (forceEntered = false, overrideScene?: number, overrideBeat?: number) => {
    const effScene = overrideScene ?? scene;
    const effEntered = forceEntered || entered;
    const c = SCENES[effScene][language];
    return (
      <div className={styles.scene}>
        {renderParticleField(false, false, forceEntered, overrideScene, overrideBeat)}
        <div className={styles.titleOverlay}>
          <h1
            className={styles.mainTitle}
            style={{
              opacity: effEntered ? 1 : 0,
              transform: effEntered ? "none" : "translateY(2cqh)",
              transition: reducedMotion
                ? "none"
                : "opacity 0.8s ease 0.3s, transform 0.8s ease 0.3s",
            }}
          >
            {c.title}
          </h1>
          <p
            className={styles.mainSubtitle}
            style={{
              opacity: effEntered ? 1 : 0,
              transition: reducedMotion
                ? "none"
                : "opacity 0.8s ease 0.6s",
            }}
          >
            {c.subtitle}
          </p>
        </div>
      </div>
    );
  };

  const renderScene2 = (forceEntered = false, overrideScene?: number, overrideBeat?: number) => {
    const effScene = overrideScene ?? scene;
    const effBeat = overrideBeat ?? beat;
    const effEntered = forceEntered || entered;
    const c = SCENES[effScene][language];
    return (
      <div className={styles.scene}>
        {renderParticleField(true, effBeat >= 1, forceEntered, overrideScene, overrideBeat)}
        <div className={styles.sceneHeader}>
          <h2
            className={styles.sceneTitle}
            style={{
              opacity: effEntered ? 1 : 0,
              transition: reducedMotion ? "none" : "opacity 0.6s ease",
            }}
          >
            {c.title}
          </h2>
          <p className={styles.sceneSubtitle}>{c.subtitle}</p>
        </div>
      </div>
    );
  };

  const renderScene3 = (forceEntered = false, overrideScene?: number, overrideBeat?: number) => {
    const effScene = overrideScene ?? scene;
    const effBeat = overrideBeat ?? beat;
    const effEntered = forceEntered || entered;
    const c = SCENES[effScene][language];
    return (
      <div className={styles.scene}>
        {renderParticleField(true, false, forceEntered, overrideScene, overrideBeat)}
        <div className={styles.sceneHeader}>
          <h2 className={styles.sceneTitle}>{c.title}</h2>
          <p
            className={styles.sceneSubtitle}
            style={{
              opacity: effEntered ? 1 : 0,
              transition: reducedMotion ? "none" : "opacity 0.5s ease",
            }}
          >
            {c.beatSubtitles?.[effBeat]}
          </p>
        </div>
        <div className={styles.phaseIndicator}>
          {[0, 1, 2].map((p) => (
            <div
              key={p}
              className={[
                styles.phaseDot,
                p <= effBeat ? styles.phaseDotActive : "",
              ]
                .filter(Boolean)
                .join(" ")}
            />
          ))}
        </div>
      </div>
    );
  };

  const renderScene4 = (forceEntered = false, overrideScene?: number, overrideBeat?: number) => {
    const effScene = overrideScene ?? scene;
    const effBeat = overrideBeat ?? beat;
    const effEntered = forceEntered || entered;
    const c = SCENES[effScene][language];
    const clusters = c.clusterData || [];
    return (
      <div className={styles.scene}>
        {renderParticleField(true, false, forceEntered, overrideScene, overrideBeat)}
        <div className={styles.sceneHeader}>
          <h2 className={styles.sceneTitle}>{c.title}</h2>
          <p className={styles.sceneSubtitle}>{c.subtitle}</p>
        </div>
        {effBeat >= 1 && (
          <div className={styles.clusterLegend}>
            {clusters.map((cl, i) => (
              <div
                key={i}
                className={styles.clusterItem}
                style={{
                  opacity: effEntered ? 1 : 0,
                  transform: effEntered ? "none" : "translateX(-2cqw)",
                  transition: reducedMotion
                    ? "none"
                    : `opacity 0.4s ease ${i * 0.1}s, transform 0.4s ease ${i * 0.1}s`,
                }}
              >
                <div
                  className={styles.clusterSwatch}
                  style={{ background: cl.color }}
                />
                <span className={styles.clusterName}>{cl.name}</span>
                <span className={styles.clusterCount}>{cl.count}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderScene5 = (forceEntered = false, overrideScene?: number) => {
    const effScene = overrideScene ?? scene;
    const effEntered = forceEntered || entered;
    const c = SCENES[effScene][language];
    const stats = c.stats || [];
    return (
      <div className={styles.summaryScene}>
        <h2
          className={styles.summaryTitle}
          style={{
            opacity: effEntered ? 1 : 0,
            transform: effEntered ? "none" : "translateY(-1cqh)",
            transition: reducedMotion
              ? "none"
              : "opacity 0.6s ease, transform 0.6s ease",
          }}
        >
          {c.title}
        </h2>
        <div className={styles.statsGrid}>
          {stats.map((s, i) => (
            <div
              key={i}
              className={styles.statCard}
              style={{
                opacity: effEntered ? 1 : 0,
                transform: effEntered ? "none" : "translateY(1.5cqh)",
                transition: reducedMotion
                  ? "none"
                  : `opacity 0.5s ease ${0.2 + i * 0.1}s, transform 0.5s ease ${0.2 + i * 0.1}s`,
              }}
            >
              <span className={styles.statValue}>{s.value}</span>
              <span className={styles.statLabel}>{s.label}</span>
            </div>
          ))}
        </div>
        {/* Decorative particles in background */}
        <div className={styles.bgParticles}>
          {Array.from({ length: 30 }).map((_, i) => {
            const rand = seededRandom(i + 200);
            return (
              <div
                key={i}
                className={styles.bgParticle}
                style={{
                  left: `${rand() * 100}%`,
                  top: `${rand() * 100}%`,
                  width: "0.8cqh",
                  height: "0.8cqh",
                  opacity: effEntered ? 0.3 : 0,
                  transition: reducedMotion
                    ? "none"
                    : `opacity 1s ease ${i * 0.03}s`,
                }}
              />
            );
          })}
        </div>
      </div>
    );
  };

  const renderSceneFor = (
    sceneNum: number,
    beatNum: number,
    forceEntered = false,
  ) => {
    switch (sceneNum) {
      case 1:
        return renderScene1(forceEntered, sceneNum, beatNum);
      case 2:
        return renderScene2(forceEntered, sceneNum, beatNum);
      case 3:
        return renderScene3(forceEntered, sceneNum, beatNum);
      case 4:
        return renderScene4(forceEntered, sceneNum, beatNum);
      case 5:
        return renderScene5(forceEntered, sceneNum);
      default:
        return null;
    }
  };

  const renderSceneContent = () => renderSceneFor(scene, beat);

  // ── Navigation Dots ─────────────────────────────────────────────────────

  const renderNavDots = () => {
    if (isThumbnail) return null;
    return (
      <nav className={styles.navDots} aria-label="Scene navigation">
        {[1, 2, 3, 4, 5].map((s) => {
          const isActive = s === scene;
          return (
            <button
              key={s}
              type="button"
              className={[
                styles.navDot,
                isActive ? styles.navDotActive : "",
              ]
                .filter(Boolean)
                .join(" ")}
              aria-label={`Jump to scene ${s}`}
              onClick={(e) => handleNavClick(e, s)}
              style={reducedMotion ? { transitionDuration: "0s" } : undefined}
            />
          );
        })}
      </nav>
    );
  };

  // ── Layer classes ────────────────────────────────────────────────────────

  const outgoingLayerClasses = [
    styles.sceneLayer,
    styles.exitAnim,
  ].filter(Boolean).join(" ");

  const incomingLayerClasses = [
    styles.sceneLayer,
    isTransitioning && !isTransitionClone ? styles.enterAnim : "",
  ].filter(Boolean).join(" ");

  const OUTGOING_MAX_BEAT: Record<number, number> = {
    1: 0, 2: 1, 3: 2, 4: 1, 5: 0,
  };

  return (
    <div data-testid="style-40-root" className={rootClasses}>
      {/* Outgoing scene (particle scatter exit) */}
      {outgoingScene !== null && (
        <div className={outgoingLayerClasses}>
          {renderSceneFor(
            outgoingScene,
            OUTGOING_MAX_BEAT[outgoingScene] ?? 0,
            true,
          )}
        </div>
      )}

      {/* Incoming / current scene (particle coalesce enter) */}
      <div className={incomingLayerClasses}>
        {renderSceneContent()}
      </div>

      {renderNavDots()}
    </div>
  );
}

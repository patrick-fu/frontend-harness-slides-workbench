import React, { useEffect, useState, useCallback } from "react";
import type { BespokeStyleProps, StyleMetadata } from "../types";
import SpatialSceneTrack from "./SpatialSceneTrack";
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
      title: "BOSS RUSH",
      subtitle: "Defeat the legacy monolith before time runs out",
    },
    zh: {
      title: "BOSS 冲锋",
      subtitle: "在时间耗尽之前击败遗留巨石",
    },
  },
  2: {
    en: {
      title: "ENCOUNTER: LegacySys-9000",
      subtitle: "HP 100%  ·  ATK 85  ·  DEF 60  ·  Weakness: Documentation",
      nodeLabels: ["BOSS", "PLAYER", "HP_BAR", "ATK", "DEF", "SPD"],
    },
    zh: {
      title: "遭遇战：LegacySys-9000",
      subtitle: "HP 100%  ·  攻击 85  ·  防御 60  ·  弱点：文档",
      nodeLabels: ["BOSS", "玩家", "血条", "攻击", "防御", "速度"],
    },
  },
  3: {
    en: {
      title: "POWER-UP COLLECTION",
      beatSubtitles: [
        "Phase 1: Gathered unit tests +20 ATK",
        "Phase 2: Found CI pipeline +15 DEF",
        "Phase 3: Unlocked observability +30 SPD",
      ],
    },
    zh: {
      title: "道具收集",
      beatSubtitles: [
        "阶段 1：收集单元测试 +20 攻击",
        "阶段 2：找到 CI 流水线 +15 防御",
        "阶段 3：解锁可观测性 +30 速度",
      ],
    },
  },
  4: {
    en: {
      title: "BATTLE STATUS",
      subtitle: "Boss HP draining fast — inventory fully stocked",
      clusterData: [
        { name: "Player HP", count: 78, color: "#39ff14" },
        { name: "Boss HP", count: 34, color: "#ff3030" },
        { name: "Power-Ups", count: 12, color: "#ffd700" },
        { name: "Combo x", count: 5, color: "#00e5ff" },
      ],
    },
    zh: {
      title: "战斗状态",
      subtitle: "Boss 血量快速流失——道具栏已满",
      clusterData: [
        { name: "玩家 HP", count: 78, color: "#39ff14" },
        { name: "Boss HP", count: 34, color: "#ff3030" },
        { name: "道具数", count: 12, color: "#ffd700" },
        { name: "连击 x", count: 5, color: "#00e5ff" },
      ],
    },
  },
  5: {
    en: {
      title: "VICTORY!",
      stats: [
        { label: "Damage Dealt", value: "9.2K" },
        { label: "Items Used", value: "12" },
        { label: "Turns", value: "47" },
        { label: "Rank", value: "S" },
      ],
    },
    zh: {
      title: "胜利！",
      stats: [
        { label: "造成伤害", value: "9.2K" },
        { label: "使用道具", value: "12" },
        { label: "回合数", value: "47" },
        { label: "评级", value: "S" },
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
  const nameMap = { en: "Arcade Boss Fight", zh: "街机 Boss 战" };
  const themeMap = {
    en: "Risk Framing — retro arcade screen reframing technical challenge as boss battle, power-ups as goals, HUD-style status readouts with pixel neon colors",
    zh: "风险框架——复古街机屏幕将技术挑战重新演绎为 Boss 战，道具即目标，HUD 风格状态读数配像素霓虹色彩",
  };
  const densityLabelMap = { en: "Visual-Intensive", zh: "视觉密集" };

  const sceneTitles = {
    en: ["Title Screen", "Boss Encounter", "Power-Up Phases", "Battle HUD", "Victory Screen"],
    zh: ["标题画面", "Boss 遭遇", "道具阶段", "战斗 HUD", "胜利画面"],
  };

  const beatActions = {
    en: {
      1: ["Game title appears"],
      2: ["Boss sprite and stats", "Player HUD overlays"],
      3: ["First power-up collected", "Second power-up collected", "All power-ups gathered"],
      4: ["Battle status revealed", "Inventory panel shows"],
      5: ["Victory stats displayed"],
    },
    zh: {
      1: ["游戏标题出现"],
      2: ["Boss 精灵和属性", "玩家 HUD 叠加"],
      3: ["收集第一个道具", "收集第二个道具", "全部道具收集完毕"],
      4: ["战斗状态揭示", "道具栏显示"],
      5: ["胜利数据展示"],
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
    id: "arcade-boss-fight",
    band: "contemporary-digital",
    name: nameMap[lang],
    theme: themeMap[lang],
    densityLabel: densityLabelMap[lang],
    heroScene: 3,
    colors: { bg: "#0a0a0f", ink: "#e8e8e8", panel: "#12121a" },
    typography: { header: "Press Start 2P", body: "VT323" },
    tags: [
      "arcade",
      "retro-game",
      "pixel",
      "boss-fight",
      "HUD",
      "neon",
      "8-bit",
      "game-ui",
      "playful",
      "energizing",
    ],
    fonts: ["Press Start 2P", "VT323"],
    scenes,
  };
}

// ─── Component ──────────────────────────────────────────────────────────────

const CLUSTER_COLORS = ["#39ff14", "#ff3030", "#ffd700", "#00e5ff"];

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

const BEAT_LAYOUT_MODES = {
  2: "motion",
  3: "motion",
  4: "motion",
} satisfies Record<number, "motion" | "reserved">;

export default function ParticleField({
  scene,
  beat,
  language,
  isThumbnail,
  reducedMotion,
  onNavigate,
}: BespokeStyleProps) {
  const [entered, setEntered] = useState(false);

  // FLIP for particle container — particles animate between positions on beat changes
  const { ref: particleFieldRef } = useFLIP<HTMLDivElement>({
    watch: [beat],
    duration: 500,
    easing: "cubic-bezier(0.16, 1, 0.3, 1)",
    selector: ".particle",
  });

  useEffect(() => {
    const FONT_ID = "style-40-fonts-arcade";
    if (!document.getElementById(FONT_ID)) {
      const link = document.createElement("link");
      link.id = FONT_ID;
      link.rel = "stylesheet";
      link.href =
        "https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323&display=swap";
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
    const {
      particles: useParticles,
      connections: useConnections,
    } = computeParticles(effScene, effBeat);

    return (
      <div ref={particleFieldRef} className={styles.particleContainer}>
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
                  : "rgba(57, 255, 20, 0.12)";
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
              : "#39ff14";
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

  return (
    <div data-testid="style-40-root" className={rootClasses}>
            <SpatialSceneTrack
        scene={scene}
        beat={beat}
        transitionKind="glitch"
        reducedMotion={reducedMotion || isThumbnail}
        beatLayoutModes={BEAT_LAYOUT_MODES}
        renderScene={(sceneId, sceneBeat, isActive) => (
          <div className={styles.sceneLayer}>
            {renderSceneFor(sceneId, sceneBeat, isActive ? entered : true)}
          </div>
        )}
      />

      {renderNavDots()}
    </div>
  );
}

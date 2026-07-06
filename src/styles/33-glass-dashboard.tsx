import React, { useEffect, useState, useCallback, useRef } from "react";
import type { BespokeStyleProps, StyleMetadata } from "../types";
import styles from "./33-glass-dashboard.module.css";
import { useFLIP } from "../hooks/useFLIP";

// ─── Font Injection ────────────────────────────────────────────────────────

function useFonts() {
  useEffect(() => {
    const id = "style-33-fonts";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap";
    document.head.appendChild(link);
  }, []);
}

// ─── Content ────────────────────────────────────────────────────────────────

interface SceneContent {
  en: {
    title: string;
    subtitle?: string;
    kpis?: Array<{ label: string; value: string; delta: string; up: boolean }>;
    chartBars?: number[];
    chartLabels?: string[];
    activities?: Array<{ text: string; time: string; color: string }>;
    detailTitle?: string;
    detailMeta?: string;
    metrics?: Array<{ label: string; value: string; trend: string }>;
    gridTitle?: string;
    cards?: Array<{ icon: string; title: string; desc: string; value: string; color: string }>;
    bigLabel?: string;
    bigValue?: string;
    bigUnit?: string;
    bigCaption?: string;
    summaryHeadline?: string;
    summarySub?: string;
    summaryStats?: Array<{ value: string; label: string }>;
  };
  zh: {
    title: string;
    subtitle?: string;
    kpis?: Array<{ label: string; value: string; delta: string; up: boolean }>;
    chartBars?: number[];
    chartLabels?: string[];
    activities?: Array<{ text: string; time: string; color: string }>;
    detailTitle?: string;
    detailMeta?: string;
    metrics?: Array<{ label: string; value: string; trend: string }>;
    gridTitle?: string;
    cards?: Array<{ icon: string; title: string; desc: string; value: string; color: string }>;
    bigLabel?: string;
    bigValue?: string;
    bigUnit?: string;
    bigCaption?: string;
    summaryHeadline?: string;
    summarySub?: string;
    summaryStats?: Array<{ value: string; label: string }>;
  };
}

const SCENES: Record<number, SceneContent> = {
  1: {
    en: {
      title: "The Collection",
      subtitle: "Curated artifacts revealed through layered glass",
      kpis: [
        { label: "Artifacts", value: "47", delta: "+3 this month", up: true },
        { label: "Collections", value: "12", delta: "+2 new", up: true },
        { label: "Acquisitions", value: "8", delta: "Q2 intake", up: true },
        { label: "On Display", value: "35", delta: "74% of total", up: false },
      ],
      chartBars: [45, 62, 38, 78, 55, 90, 72, 68, 85, 95, 70, 88],
      chartLabels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      activities: [
        { text: "New acquisition: Murano vase", time: "2 days ago", color: "#c9a96e" },
        { text: "Collection rotation: Modernism wing", time: "5 days ago", color: "#8b9d8b" },
        { text: "Conservation report filed", time: "1 week ago", color: "#b8a088" },
        { text: "Donor visit scheduled", time: "2 weeks ago", color: "#a0b0a0" },
        { text: "Spring catalog published", time: "3 weeks ago", color: "#c9a96e" },
        { text: "Gallery lighting upgraded", time: "1 month ago", color: "#8b9d8b" },
      ],
    },
    zh: {
      title: "藏品展示",
      subtitle: "透过分层玻璃揭示精选展品",
      kpis: [
        { label: "展品数", value: "47", delta: "本月 +3", up: true },
        { label: "系列数", value: "12", delta: "+2 新系列", up: true },
        { label: "新入藏", value: "8", delta: "Q2 入藏", up: true },
        { label: "在展数", value: "35", delta: "占总量 74%", up: false },
      ],
      chartBars: [45, 62, 38, 78, 55, 90, 72, 68, 85, 95, 70, 88],
      chartLabels: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
      activities: [
        { text: "新入藏：Murano 玻璃花瓶", time: "2 天前", color: "#c9a96e" },
        { text: "展品轮换：现代主义展厅", time: "5 天前", color: "#8b9d8b" },
        { text: "保护报告已归档", time: "1 周前", color: "#b8a088" },
        { text: "捐赠者参观已安排", time: "2 周前", color: "#a0b0a0" },
        { text: "春季图录已发布", time: "3 周前", color: "#c9a96e" },
        { text: "展厅照明系统升级", time: "1 个月前", color: "#8b9d8b" },
      ],
    },
  },
  2: {
    en: {
      title: "Artifact Detail",
      detailTitle: "Hand-Blown Glass Vessel",
      detailMeta: "Murano, Italy · circa 1962 · Accession #A-2047",
      metrics: [
        { label: "Height", value: "32 cm", trend: "Display case: North Gallery" },
        { label: "Weight", value: "1.8 kg", trend: "Lead crystal, hand-formed" },
        { label: "Condition", value: "Excellent", trend: "Last conservation: Mar 2026" },
        { label: "Value", value: "Est. $4,200", trend: "Appraised by Sotheby's" },
      ],
    },
    zh: {
      title: "展品详情",
      detailTitle: "手工吹制玻璃容器",
      detailMeta: "意大利 Murano · 约 1962 年 · 入藏号 #A-2047",
      metrics: [
        { label: "高度", value: "32 cm", trend: "展柜：北展厅" },
        { label: "重量", value: "1.8 kg", trend: "铅水晶，手工成型" },
        { label: "品相", value: "极佳", trend: "上次维护：2026 年 3 月" },
        { label: "估值", value: "约 ¥30,000", trend: "苏富比鉴定" },
      ],
    },
  },
  3: {
    en: {
      title: "Layered Vessels",
      gridTitle: "Featured Collections",
      cards: [
        { icon: "🏺", title: "Ancient Pottery", desc: "Neolithic to Han dynasty ceramic vessels from the Liangzhu collection", value: "14 pieces", color: "#c9a96e" },
        { icon: "💎", title: "Crystal Artifacts", desc: "Hand-cut crystal and glass objects from the Art Nouveau period", value: "9 pieces", color: "#8b9d8b" },
        { icon: "🪞", title: "Enamel & Silver", desc: "Guilloche enamel and sterling silver decorative arts", value: "11 pieces", color: "#b8a088" },
        { icon: "📜", title: "Illuminated Manuscripts", desc: "Medieval European and Persian manuscript pages on vellum", value: "7 pieces", color: "#a0b0a0" },
        { icon: "🗿", title: "Stone Carvings", desc: "Soapstone and alabaster carvings from the Arts and Crafts movement", value: "6 pieces", color: "#d4c5a9" },
      ],
    },
    zh: {
      title: "分层容器",
      gridTitle: "精选系列",
      cards: [
        { icon: "🏺", title: "古代陶器", desc: "良渚文化新石器时代至汉代陶瓷器", value: "14 件", color: "#c9a96e" },
        { icon: "💎", title: "水晶制品", desc: "新艺术运动时期手工切割水晶及玻璃器物", value: "9 件", color: "#8b9d8b" },
        { icon: "🪞", title: "珐琅银器", desc: "扭索纹珐琅与纯银装饰艺术品", value: "11 件", color: "#b8a088" },
        { icon: "📜", title: "泥金手抄本", desc: "中世纪欧洲与波斯羊皮纸手稿页", value: "7 件", color: "#a0b0a0" },
        { icon: "🗿", title: "石雕作品", desc: "工艺美术运动时期皂石与雪花石膏雕刻", value: "6 件", color: "#d4c5a9" },
      ],
    },
  },
  4: {
    en: {
      title: "Featured Piece",
      bigLabel: "Acquisition of the Quarter",
      bigValue: "A-2047",
      bigUnit: "Murano Glass",
      bigCaption: "A masterwork of mid-century Venetian glassblowing, acquired through the generous support of the Patrons' Circle. On view in the North Gallery from July 14.",
    },
    zh: {
      title: "焦点展品",
      bigLabel: "本季入藏精品",
      bigValue: "A-2047",
      bigUnit: "Murano 玻璃",
      bigCaption: "一件中世纪威尼斯玻璃吹制杰作，由赞助人协会慷慨支持获得。7 月 14 日起在北展厅展出。",
    },
  },
  5: {
    en: {
      title: "Summary",
      summaryHeadline: "Every artifact tells a story.",
      summarySub: "Our collection bridges centuries of craftsmanship, preserved and presented with the clarity it deserves.",
      summaryStats: [
        { value: "47", label: "Artifacts" },
        { value: "12", label: "Collections" },
        { value: "3", label: "Galleries" },
      ],
    },
    zh: {
      title: "总结",
      summaryHeadline: "每件展品都讲述一个故事。",
      summarySub: "我们的藏品跨越数百年的工艺传承，以其应有的清晰度被保存和呈现。",
      summaryStats: [
        { value: "47", label: "展品" },
        { value: "12", label: "系列" },
        { value: "3", label: "展厅" },
      ],
    },
  },
};

// ─── Metadata ───────────────────────────────────────────────────────────────

export function getMetadata(lang: "en" | "zh"): StyleMetadata {
  const nameMap = { en: "Liquid Glass", zh: "液态玻璃" };
  const themeMap = {
    en: "Product Showcase — museum vitrine glass panels revealing layered content with spatial depth and refined confidence",
    zh: "产品展示——博物馆展柜玻璃面板，以空间深度和精致质感揭示分层内容",
  };
  const densityLabelMap = { en: "Layered Spatial", zh: "分层空间" };

  const sceneTitles = {
    en: ["Collection", "Artifact Detail", "Layered Vessels", "Featured Piece", "Summary"],
    zh: ["藏品展示", "展品详情", "分层容器", "焦点展品", "总结"],
  };

  const beatActions = {
    en: {
      1: ["Dashboard loads"],
      2: ["KPIs appear", "Chart and activity panel fill"],
      3: ["Cards animate in sequentially"],
      4: ["Big metric revealed"],
      5: ["Closing summary"],
    },
    zh: {
      1: ["仪表盘加载"],
      2: ["KPI 呈现", "图表和活动面板填充"],
      3: ["卡片依次动画呈现"],
      4: ["大指标揭示"],
      5: ["结语总结"],
    },
  };

  const BEAT_COUNTS: Record<number, number> = {
    1: 1,
    2: 2,
    3: 3,
    4: 1,
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
        beatTitle = c.detailTitle || c.title || "";
        beatBody = beatIdx >= 1 ? (c.metrics?.map((m) => `${m.label}: ${m.value}`).join(" / ") || "") : "";
      } else if (id === 3) {
        beatTitle = c.gridTitle || c.title || "";
        const visibleCards = (c.cards || []).slice(0, beatIdx + 1);
        beatBody = visibleCards.map((card) => card.title).join(" / ");
      } else if (id === 4) {
        beatTitle = `${c.bigLabel}: ${c.bigValue} ${c.bigUnit}`;
        beatBody = c.bigCaption || "";
      } else if (id === 5) {
        beatTitle = c.summaryHeadline || "";
        beatBody = c.summarySub || "";
      }

      return {
        id: beatIdx,
        action: actions[beatIdx],
        title: beatTitle,
        body: beatBody,
      };
    });

    return {
      id,
      title: sceneTitles[lang][id - 1],
      beats,
    };
  });

  return {
    id: "33",
    band: "contemporary-digital",
    name: nameMap[lang],
    theme: themeMap[lang],
    densityLabel: densityLabelMap[lang],
    heroScene: 1,
    colors: {
      bg: "#e8e4df",
      ink: "#2a2520",
      panel: "rgba(255,255,255,0.6)",
    },
    typography: {
      header: "Display Serif 600 (behind-glass) / Inter 500 (on-glass)",
      body: "Inter 400",
    },
    tags: [
      "glass",
      "liquid",
      "vitrine",
      "layered",
      "spatial",
      "museum",
      "translucent",
      "depth",
      "refined",
      "showcase",
    ],
    fonts: ["Inter", "Playfair Display"],
    scenes,
  };
}

// ─── Transition constants ──────────────────────────────────────────────────

const TRANSITION_DURATION = 450;
const BEAT_COUNTS: Record<number, number> = { 1: 1, 2: 2, 3: 3, 4: 1, 5: 1 };

// ─── Component ──────────────────────────────────────────────────────────────

export default function GlassDashboard({
  scene,
  beat,
  language,
  isThumbnail,
  reducedMotion,
  onNavigate,
  isTransitionClone,
}: BespokeStyleProps) {
  useFonts();

  const [entered, setEntered] = useState(false);

  const transitionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [transitionInfo, setTransitionInfo] = useState({
    outgoingScene: null as number | null,
    isTransitioning: false,
    lastScene: scene,
  });

  // Synchronous derivation — sets transition state in the SAME render cycle
  // as the scene prop change. Eliminates the 1-frame gap where the incoming
  // scene is visible without its enter animation class.
  if (transitionInfo.lastScene !== scene) {
    if (transitionTimerRef.current) {
      clearTimeout(transitionTimerRef.current);
    }

    if (!reducedMotion) {
      transitionTimerRef.current = setTimeout(() => {
        setTransitionInfo(function(prev) {
          return { outgoingScene: null, isTransitioning: false, lastScene: prev.lastScene };
        });
      }, TRANSITION_DURATION);

      setTransitionInfo({
        outgoingScene: transitionInfo.lastScene,
        isTransitioning: true,
        lastScene: scene,
      });
    } else {
      setTransitionInfo({
        outgoingScene: null,
        isTransitioning: false,
        lastScene: scene,
      });
    }
  }

  var outgoingScene = transitionInfo.outgoingScene;
  var isTransitioning = transitionInfo.isTransitioning;

  // Beat-level entered animation (for internal element reveals)
  useEffect(() => {
    setEntered(false);
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setEntered(true);
      });
    });
    return () => cancelAnimationFrame(id);
  }, [scene]);

  // FLIP for scene 3 card grid
  const { ref: cardGridRef } = useFLIP<HTMLDivElement>({
    watch: [beat],
    duration: 450,
    selector: `.${styles.glassCard}`,
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
  ]
    .filter(Boolean)
    .join(" ");

  // ── Render scene content for a given scene number ────────────────────────

  const renderSceneFor = (
    sceneNum: number,
    beatNum: number,
    effectiveEntered: boolean,
  ) => {
    const c = SCENES[sceneNum]?.[language] || SCENES[1][language];

    if (sceneNum === 1) {
      return (
        <div className={styles.dashboard}>
          <div className={styles.dashboardHeader}>
            <div>
              <h1 className={styles.dashboardTitle}>{c.title}</h1>
              <p className={styles.dashboardSubtitle}>{c.subtitle}</p>
            </div>
            <span className={styles.dashboardBadge}>
              {language === "zh" ? "实时" : "Live"}
            </span>
          </div>

          <div className={styles.kpiRow}>
            {(c.kpis || []).map((kpi, i) => (
              <div
                key={i}
                className={styles.kpiCard}
                style={{
                  opacity: effectiveEntered ? 1 : 0,
                  transform: effectiveEntered ? "none" : "translateY(1cqh)",
                  transition: reducedMotion
                    ? "none"
                    : `opacity 0.4s ease ${i * 0.08}s, transform 0.4s ease ${i * 0.08}s`,
                }}
              >
                <span className={styles.kpiLabel}>{kpi.label}</span>
                <span className={styles.kpiValue}>{kpi.value}</span>
                <span
                  className={[
                    styles.kpiDelta,
                    kpi.up ? styles.kpiDeltaUp : styles.kpiDeltaDown,
                  ].join(" ")}
                >
                  {kpi.delta}
                </span>
              </div>
            ))}
          </div>

          <div className={styles.mainGrid}>
            <div className={styles.chartPanel}>
              <div className={styles.panelHeader}>
                <h3 className={styles.panelTitle}>
                  {language === "zh" ? "请求量趋势" : "Request Volume Trend"}
                </h3>
              </div>
              <div className={styles.chartArea}>
                {(c.chartBars || []).map((h, i) => (
                  <div
                    key={i}
                    className={styles.chartBar}
                    data-label={(c.chartLabels || [])[i]}
                    style={{
                      height: effectiveEntered ? `${h}%` : "0%",
                      transition: reducedMotion
                        ? "none"
                        : `height 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.04}s`,
                    }}
                  />
                ))}
              </div>
            </div>

            <div className={styles.sidePanel}>
              <div className={styles.activityPanel}>
                <div className={styles.panelHeader}>
                  <h3 className={styles.panelTitle}>
                    {language === "zh" ? "最近活动" : "Recent Activity"}
                  </h3>
                </div>
                <div className={styles.activityList}>
                  {(c.activities || []).slice(0, 4).map((act, i) => (
                    <div
                      key={i}
                      className={styles.activityItem}
                      style={{
                        opacity: effectiveEntered ? 1 : 0,
                        transition: reducedMotion
                          ? "none"
                          : `opacity 0.3s ease ${0.3 + i * 0.08}s`,
                      }}
                    >
                      <div
                        className={styles.activityDot}
                        style={{ background: act.color }}
                      />
                      <span className={styles.activityText}>{act.text}</span>
                      <span className={styles.activityTime}>{act.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (sceneNum === 2) {
      return (
        <div className={styles.detailView}>
          <div className={styles.detailHeader}>
            <h1 className={styles.detailTitle}>{c.detailTitle}</h1>
          </div>
          <div className={styles.detailMeta}>
            <span>{c.detailMeta}</span>
          </div>
          <div className={styles.detailBody}>
            {(c.metrics || []).map((m, i) => (
              <div
                key={i}
                className={styles.metricCard}
                style={{
                  opacity: effectiveEntered && beatNum >= 1 ? 1 : 0,
                  transform:
                    effectiveEntered && beatNum >= 1
                      ? "none"
                      : "translateY(1cqh)",
                  transition: reducedMotion
                    ? "none"
                    : `opacity 0.4s ease ${i * 0.1}s, transform 0.4s ease ${i * 0.1}s`,
                }}
              >
                <span className={styles.metricLabel}>{m.label}</span>
                <span className={styles.metricBig}>{m.value}</span>
                <span className={styles.metricTrend}>{m.trend}</span>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (sceneNum === 3) {
      return (
        <div className={styles.gridScene}>
          <h1 className={styles.gridTitle}>{c.gridTitle}</h1>
          <div
            ref={sceneNum === scene ? cardGridRef : undefined}
            className={styles.cardGrid}
          >
            {(c.cards || []).map((card, i) => {
              const visible = i < (beatNum + 1) * 2;
              return (
                <div
                  key={i}
                  className={styles.glassCard}
                  style={{
                    opacity: visible && effectiveEntered ? 1 : 0,
                    transform:
                      visible && effectiveEntered
                        ? "none"
                        : "translateY(1.5cqh)",
                    transition: reducedMotion
                      ? "none"
                      : `opacity 0.4s ease ${i * 0.08}s, transform 0.4s ease ${i * 0.08}s`,
                  }}
                >
                  <div
                    className={styles.cardIcon}
                    style={{ background: `${card.color}22` }}
                  >
                    {card.icon}
                  </div>
                  <h3 className={styles.cardTitle}>{card.title}</h3>
                  <p className={styles.cardDesc}>{card.desc}</p>
                  <span className={styles.cardValue}>{card.value}</span>
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    if (sceneNum === 4) {
      return (
        <div className={styles.metricScene}>
          <span className={styles.metricSceneLabel}>{c.bigLabel}</span>
          <h2
            className={styles.metricSceneValue}
            style={{
              opacity: effectiveEntered ? 1 : 0,
              transform: effectiveEntered ? "none" : "scale(0.9)",
              transition: reducedMotion
                ? "none"
                : "opacity 0.6s ease, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            {c.bigValue}
          </h2>
          <span className={styles.metricSceneUnit}>{c.bigUnit}</span>
          <p className={styles.metricSceneCaption}>{c.bigCaption}</p>
        </div>
      );
    }

    if (sceneNum === 5) {
      return (
        <div className={styles.summaryScene}>
          <h1
            className={styles.summaryHeadline}
            style={{
              opacity: effectiveEntered ? 1 : 0,
              transform: effectiveEntered ? "none" : "translateY(1cqh)",
              transition: reducedMotion
                ? "none"
                : "opacity 0.5s ease, transform 0.5s ease",
            }}
          >
            {c.summaryHeadline}
          </h1>
          <p className={styles.summarySub}>{c.summarySub}</p>
          <div className={styles.summaryStats}>
            {(c.summaryStats || []).map((s, i) => (
              <div key={i} className={styles.summaryStat}>
                <span className={styles.summaryStatValue}>{s.value}</span>
                <span className={styles.summaryStatLabel}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return null;
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

  // ── Build layer classes ─────────────────────────────────────────────────

  const outgoingLayerClasses = [
    styles.sceneLayer,
    styles.exitAnim,
  ]
    .filter(Boolean)
    .join(" ");

  const incomingLayerClasses = [
    styles.sceneLayer,
    isTransitioning && !isTransitionClone ? styles.enterAnim : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      data-testid="style-33-root"
      className={rootClasses}
    >
      {/* Outgoing scene (exit animation) */}
      {outgoingScene !== null && (
        <div className={outgoingLayerClasses}>
          {renderSceneFor(outgoingScene, BEAT_COUNTS[outgoingScene] - 1, true)}
        </div>
      )}

      {/* Incoming / current scene */}
      <div className={incomingLayerClasses}>
        {renderSceneFor(scene, beat, entered)}
      </div>

      {renderNavDots()}
    </div>
  );
}

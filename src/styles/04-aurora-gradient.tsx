import React, { useEffect, useState, useRef, useCallback } from "react";
import type { BespokeStyleProps, StyleMetadata } from "../types";
import styles from "./04-aurora-gradient.module.css";

// ─── Content ────────────────────────────────────────────────────────────────

interface SceneContent {
  en: {
    title?: string;
    subtitle?: string;
    headline?: string;
    dataPoints?: Array<{ label: string; value: string; trend: string; color: string }>;
    chartTitle?: string;
    chartData?: number[];
    chartLabels?: string[];
    regionTitle?: string;
    regions?: Array<{ name: string; temp: string; co2: string; status: string }>;
    forecast?: string;
    forecastSub?: string;
    forecastMetrics?: Array<{ label: string; value: string; icon: string }>;
    callToAction?: string;
    callSub?: string;
  };
  zh: {
    title?: string;
    subtitle?: string;
    headline?: string;
    dataPoints?: Array<{ label: string; value: string; trend: string; color: string }>;
    chartTitle?: string;
    chartData?: number[];
    chartLabels?: string[];
    regionTitle?: string;
    regions?: Array<{ name: string; temp: string; co2: string; status: string }>;
    forecast?: string;
    forecastSub?: string;
    forecastMetrics?: Array<{ label: string; value: string; icon: string }>;
    callToAction?: string;
    callSub?: string;
  };
}

const SCENES: Record<number, SceneContent> = {
  1: {
    en: {
      title: "Climate Pulse",
      subtitle: "Real-time Environmental Data Visualization",
    },
    zh: {
      title: "气候脉搏",
      subtitle: "实时环境数据可视化",
    },
  },
  2: {
    en: {
      headline: "The atmosphere is telling us something.",
      dataPoints: [
        { label: "Global Avg Temp", value: "+1.52°C", trend: "↑ 0.18°C/decade", color: "#ff6b6b" },
        { label: "CO₂ Concentration", value: "424 ppm", trend: "↑ 2.4 ppm/year", color: "#a78bfa" },
        { label: "Arctic Ice Extent", value: "4.2M km²", trend: "↓ -13.1%/decade", color: "#38bdf8" },
        { label: "Sea Level Rise", value: "+3.6 mm/yr", trend: "Accelerating", color: "#4ade80" },
      ],
    },
    zh: {
      headline: "大气正在向我们传递信息。",
      dataPoints: [
        { label: "全球平均温度", value: "+1.52°C", trend: "↑ 0.18°C/十年", color: "#ff6b6b" },
        { label: "CO₂ 浓度", value: "424 ppm", trend: "↑ 2.4 ppm/年", color: "#a78bfa" },
        { label: "北极冰盖面积", value: "420万 km²", trend: "↓ -13.1%/十年", color: "#38bdf8" },
        { label: "海平面上升", value: "+3.6 毫米/年", trend: "加速中", color: "#4ade80" },
      ],
    },
  },
  3: {
    en: {
      chartTitle: "Global Temperature Anomaly (vs 1850-1900 baseline)",
      chartData: [0.2, 0.3, 0.25, 0.4, 0.5, 0.6, 0.8, 0.95, 1.1, 1.2, 1.35, 1.52],
      chartLabels: ["1920", "1940", "1960", "1980", "1990", "2000", "2005", "2010", "2015", "2018", "2021", "2024"],
    },
    zh: {
      chartTitle: "全球温度异常（相对于 1850-1900 基准）",
      chartData: [0.2, 0.3, 0.25, 0.4, 0.5, 0.6, 0.8, 0.95, 1.1, 1.2, 1.35, 1.52],
      chartLabels: ["1920", "1940", "1960", "1980", "1990", "2000", "2005", "2010", "2015", "2018", "2021", "2024"],
    },
  },
  4: {
    en: {
      regionTitle: "Regional Impact Snapshot",
      regions: [
        { name: "Arctic Circle", temp: "+3.8°C", co2: "418 ppm", status: "Critical" },
        { name: "Amazon Basin", temp: "+1.2°C", co2: "422 ppm", status: "Warning" },
        { name: "Sahara Desert", temp: "+2.1°C", co2: "425 ppm", status: "Severe" },
        { name: "Great Barrier Reef", temp: "+1.8°C", co2: "421 ppm", status: "Critical" },
      ],
    },
    zh: {
      regionTitle: "区域影响快照",
      regions: [
        { name: "北极圈", temp: "+3.8°C", co2: "418 ppm", status: "危急" },
        { name: "亚马逊盆地", temp: "+1.2°C", co2: "422 ppm", status: "警告" },
        { name: "撒哈拉沙漠", temp: "+2.1°C", co2: "425 ppm", status: "严重" },
        { name: "大堡礁", temp: "+1.8°C", co2: "421 ppm", status: "危急" },
      ],
    },
  },
  5: {
    en: {
      forecast: "The next decade is decisive.",
      forecastSub: "Projected 2030-2040 trajectory under current policies",
      forecastMetrics: [
        { label: "Warming Limit", value: "1.5°C", icon: "🌡" },
        { label: "Renewable Share", value: "47%", icon: "⚡" },
        { label: "Reforestation", value: "1.2B ha", icon: "🌳" },
      ],
      callToAction: "Every fraction of a degree matters.",
      callSub: "Data source: IPCC AR6 · NOAA · NASA GISS",
    },
    zh: {
      forecast: "未来十年是决定性的。",
      forecastSub: "当前政策下 2030-2040 年预测轨迹",
      forecastMetrics: [
        { label: "升温上限", value: "1.5°C", icon: "🌡" },
        { label: "可再生能源占比", value: "47%", icon: "⚡" },
        { label: "再造林面积", value: "12亿公顷", icon: "🌳" },
      ],
      callToAction: "每一分之一度都至关重要。",
      callSub: "数据来源：IPCC AR6 · NOAA · NASA GISS",
    },
  },
};

// ─── Metadata ───────────────────────────────────────────────────────────────

export function getMetadata(lang: "en" | "zh"): StyleMetadata {
  const nameMap = { en: "Aurora Gradient", zh: "极光渐变" };
  const themeMap = {
    en: "Climate Data Visualization — dark background with aurora gradients and glowing data elements",
    zh: "气候数据可视化——深色背景配极光渐变和发光数据元素",
  };
  const densityLabelMap = { en: "Atmospheric", zh: "大气感" };

  const sceneTitles = {
    en: ["Title", "Key Indicators", "Temperature Chart", "Regional Impact", "Forecast"],
    zh: ["标题", "核心指标", "温度图表", "区域影响", "预测"],
  };

  const beatActions = {
    en: {
      1: ["Title with aurora glow"],
      2: ["Headline appears", "Data cards illuminate"],
      3: ["Chart axes appear", "Data line draws across"],
      4: ["Region cards appear sequentially"],
      5: ["Forecast statement", "Metrics reveal"],
    },
    zh: {
      1: ["标题配极光光晕"],
      2: ["标题呈现", "数据卡片点亮"],
      3: ["图表坐标轴呈现", "数据线绘制"],
      4: ["区域卡片依次呈现"],
      5: ["预测陈述", "指标揭示"],
    },
  };

  const BEAT_COUNTS: Record<number, number> = {
    1: 1,
    2: 2,
    3: 2,
    4: 3,
    5: 2,
  };

  const scenes = [1, 2, 3, 4, 5].map((id) => {
    const beatCount = BEAT_COUNTS[id];
    const actions = beatActions[lang][id as keyof (typeof beatActions)["en"]];
    const c = SCENES[id][lang];

    const beats = Array.from({ length: beatCount }, (_, beatIdx) => {
      let beatTitle = "";
      let beatBody = "";

      if (id === 1) {
        beatTitle = c.title || "";
        beatBody = c.subtitle || "";
      } else if (id === 2) {
        beatTitle = c.headline || "";
        beatBody = beatIdx >= 1 ? (c.dataPoints || []).map((d) => `${d.label}: ${d.value}`).join(" / ") : "";
      } else if (id === 3) {
        beatTitle = c.chartTitle || "";
        beatBody = beatIdx >= 1 ? `Latest: +${(c.chartData || [])[(c.chartData || []).length - 1]}°C` : "";
      } else if (id === 4) {
        beatTitle = c.regionTitle || "";
        const visibleRegions = (c.regions || []).slice(0, beatIdx + 1);
        beatBody = visibleRegions.map((r) => `${r.name}: ${r.temp}`).join(" / ");
      } else if (id === 5) {
        beatTitle = c.forecast || "";
        beatBody = beatIdx >= 1 ? (c.forecastMetrics || []).map((m) => `${m.label}: ${m.value}`).join(" / ") : c.forecastSub || "";
      }

      return { id: beatIdx, action: actions[beatIdx], title: beatTitle, body: beatBody };
    });

    return { id, title: sceneTitles[lang][id - 1], beats };
  });

  return {
    id: "04",
    band: "minimal-keynote",
    name: nameMap[lang],
    theme: themeMap[lang],
    densityLabel: densityLabelMap[lang],
    heroScene: 3,
    colors: { bg: "#0c0a1a", ink: "#e8e4f0", panel: "#161228" },
    typography: { header: "Inter 600", body: "Inter 300" },
    tags: ["aurora", "gradient", "dark", "glow", "climate", "data-viz", "atmospheric", "cosmic", "environmental"],
    fonts: ["Inter"],
    scenes,
  };
}

// ─── Component ──────────────────────────────────────────────────────────────

export default function AuroraGradient({
  scene,
  beat,
  language,
  isThumbnail,
  reducedMotion,
  onNavigate,
}: BespokeStyleProps) {
  const [entered, setEntered] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

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
    isThumbnail ? styles.thumbnail : "",
  ].filter(Boolean).join(" ");

  const renderAuroraBg = () => (
    <div className={styles.auroraBg} aria-hidden="true">
      <div className={`${styles.auroraBlob} ${styles.auroraBlob1}`} />
      <div className={`${styles.auroraBlob} ${styles.auroraBlob2}`} />
      <div className={`${styles.auroraBlob} ${styles.auroraBlob3}`} />
    </div>
  );

  const renderScene1 = () => {
    const c = SCENES[1][language];
    return (
      <div className={styles.scene1}>
        <div className={styles.titleGlow} aria-hidden="true" />
        <h1 className={styles.heroTitle}>{c.title}</h1>
        <p className={styles.heroSubtitle}>{c.subtitle}</p>
        <div className={styles.pulseDot} aria-hidden="true">
          <span className={styles.pulseDotInner} />
          <span className={styles.pulseRing} />
        </div>
      </div>
    );
  };

  const renderScene2 = () => {
    const c = SCENES[2][language];
    return (
      <div className={styles.scene2}>
        <h2
          className={styles.headline}
          style={{
            opacity: entered ? 1 : 0,
            transform: entered ? "none" : "translateY(1cqh)",
            transition: reducedMotion ? "none" : "opacity 0.8s ease, transform 0.8s ease",
          }}
        >
          {c.headline}
        </h2>
        <div className={styles.dataGrid}>
          {(c.dataPoints || []).map((d, i) => (
            <div
              key={i}
              className={styles.dataCard}
              style={{
                opacity: entered && beat >= 1 ? 1 : 0,
                transform: entered && beat >= 1 ? "none" : "translateY(2cqh)",
                transition: reducedMotion ? "none" : `opacity 0.6s ease ${0.1 + i * 0.1}s, transform 0.6s ease ${0.1 + i * 0.1}s`,
                boxShadow: entered && beat >= 1 ? `0 0 30cqw ${d.color}15, inset 0 1px 0 rgba(255,255,255,0.05)` : "none",
              }}
            >
              <span className={styles.dataLabel}>{d.label}</span>
              <span className={styles.dataValue} style={{ color: d.color, textShadow: `0 0 20cqw ${d.color}60` }}>
                {d.value}
              </span>
              <span className={styles.dataTrend}>{d.trend}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderScene3 = () => {
    const c = SCENES[3][language];
    const data = c.chartData || [];
    const labels = c.chartLabels || [];
    const maxVal = Math.max(...data);
    const chartW = 70;
    const chartH = 30;

    const points = data.map((v, i) => {
      const x = (i / (data.length - 1)) * chartW;
      const y = chartH - (v / maxVal) * chartH;
      return `${x},${y}`;
    }).join(" ");

    const areaPoints = `0,${chartH} ${points} ${chartW},${chartH}`;

    return (
      <div className={styles.scene3}>
        <h3 className={styles.chartTitle}>{c.chartTitle}</h3>
        <div className={styles.chartContainer}>
          <svg
            viewBox={`0 0 ${chartW} ${chartH + 5}`}
            className={styles.chartSvg}
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="auroraGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="auroraLine" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="50%" stopColor="#a78bfa" />
                <stop offset="100%" stopColor="#ff6b6b" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="0.8" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            {/* Grid lines */}
            {[0.25, 0.5, 0.75].map((frac, i) => (
              <line
                key={i}
                x1="0" y1={chartH * frac} x2={chartW} y2={chartH * frac}
                stroke="rgba(255,255,255,0.06)"
                strokeWidth="0.15"
              />
            ))}
            {/* Area fill */}
            {beat >= 1 && (
              <polygon
                points={areaPoints}
                fill="url(#auroraGrad)"
                style={{
                  opacity: entered ? 1 : 0,
                  transition: reducedMotion ? "none" : "opacity 1s ease 0.3s",
                }}
              />
            )}
            {/* Line */}
            {beat >= 1 && (
              <polyline
                points={points}
                fill="none"
                stroke="url(#auroraLine)"
                strokeWidth="0.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#glow)"
                style={{
                  strokeDasharray: 200,
                  strokeDashoffset: entered ? 0 : 200,
                  transition: reducedMotion ? "none" : "stroke-dashoffset 1.5s cubic-bezier(0.16, 1, 0.3, 1) 0.2s",
                }}
              />
            )}
            {/* Data points */}
            {beat >= 1 && data.map((v, i) => {
              const cx = (i / (data.length - 1)) * chartW;
              const cy = chartH - (v / maxVal) * chartH;
              return (
                <circle
                  key={i}
                  cx={cx} cy={cy} r="0.4"
                  fill="#e8e4f0"
                  style={{
                    opacity: entered ? 0.8 : 0,
                    transition: reducedMotion ? "none" : `opacity 0.4s ease ${0.5 + i * 0.08}s`,
                  }}
                />
              );
            })}
            {/* X-axis labels */}
            {labels.map((l, i) => {
              if (i % 3 !== 0 && i !== labels.length - 1) return null;
              const x = (i / (labels.length - 1)) * chartW;
              return (
                <text
                  key={i}
                  x={x} y={chartH + 3}
                  fill="rgba(232,228,240,0.4)"
                  fontSize="2"
                  textAnchor="middle"
                  fontFamily="Inter, sans-serif"
                >
                  {l}
                </text>
              );
            })}
          </svg>
        </div>
        <div className={styles.chartLegend}>
          <span className={styles.legendItem}>
            <span className={styles.legendDot} style={{ background: "#ff6b6b" }} />
            {language === "zh" ? "当前值" : "Current"}
          </span>
          <span className={styles.legendItem}>
            <span className={styles.legendDot} style={{ background: "#38bdf8" }} />
            {language === "zh" ? "历史基线" : "Historical"}
          </span>
        </div>
      </div>
    );
  };

  const renderScene4 = () => {
    const c = SCENES[4][language];
    const regions = c.regions || [];
    return (
      <div className={styles.scene4}>
        <h3 className={styles.regionTitle}>{c.regionTitle}</h3>
        <div className={styles.regionGrid}>
          {regions.map((r, i) => {
            const visible = i <= beat;
            const statusColor = r.status === "Critical" || r.status === "危急" ? "#ff6b6b"
              : r.status === "Severe" || r.status === "严重" ? "#fbbf24"
              : "#a78bfa";
            return (
              <div
                key={i}
                className={styles.regionCard}
                style={{
                  opacity: visible && entered ? 1 : 0,
                  transform: visible && entered ? "none" : "scale(0.95)",
                  transition: reducedMotion ? "none" : `opacity 0.5s ease ${i * 0.15}s, transform 0.5s ease ${i * 0.15}s`,
                  borderColor: `${statusColor}30`,
                }}
              >
                <div className={styles.regionHeader}>
                  <span className={styles.regionName}>{r.name}</span>
                  <span
                    className={styles.regionStatus}
                    style={{
                      background: `${statusColor}20`,
                      color: statusColor,
                    }}
                  >
                    {r.status}
                  </span>
                </div>
                <div className={styles.regionMetrics}>
                  <div className={styles.regionMetric}>
                    <span className={styles.regionMetricLabel}>{language === "zh" ? "温度异常" : "Temp Δ"}</span>
                    <span className={styles.regionMetricValue} style={{ color: "#ff6b6b" }}>{r.temp}</span>
                  </div>
                  <div className={styles.regionMetric}>
                    <span className={styles.regionMetricLabel}>CO₂</span>
                    <span className={styles.regionMetricValue} style={{ color: "#a78bfa" }}>{r.co2}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderScene5 = () => {
    const c = SCENES[5][language];
    return (
      <div className={styles.scene5}>
        <h2
          className={styles.forecast}
          style={{
            opacity: entered ? 1 : 0,
            transform: entered ? "none" : "translateY(1cqh)",
            transition: reducedMotion ? "none" : "opacity 0.8s ease, transform 0.8s ease",
          }}
        >
          {c.forecast}
        </h2>
        <p className={styles.forecastSub}>{c.forecastSub}</p>
        <div className={styles.forecastMetrics}>
          {(c.forecastMetrics || []).map((m, i) => (
            <div
              key={i}
              className={styles.forecastMetric}
              style={{
                opacity: entered && beat >= 1 ? 1 : 0,
                transform: entered && beat >= 1 ? "none" : "translateY(1cqh)",
                transition: reducedMotion ? "none" : `opacity 0.5s ease ${0.1 + i * 0.12}s, transform 0.5s ease ${0.1 + i * 0.12}s`,
              }}
            >
              <span className={styles.forecastIcon}>{m.icon}</span>
              <span className={styles.forecastValue}>{m.value}</span>
              <span className={styles.forecastLabel}>{m.label}</span>
            </div>
          ))}
        </div>
        <p className={styles.callToAction}>{c.callToAction}</p>
        <p className={styles.callSub}>{c.callSub}</p>
      </div>
    );
  };

  const renderSceneContent = () => {
    switch (scene) {
      case 1: return renderScene1();
      case 2: return renderScene2();
      case 3: return renderScene3();
      case 4: return renderScene4();
      case 5: return renderScene5();
      default: return null;
    }
  };

  const renderNav = () => {
    if (isThumbnail) return null;
    return (
      <nav className={styles.nav} aria-label="Scene navigation">
        {[1, 2, 3, 4, 5].map((s) => {
          const isActive = s === scene;
          return (
            <button
              key={s}
              type="button"
              className={[styles.navDot, isActive ? styles.navDotActive : ""].filter(Boolean).join(" ")}
              aria-label={`Jump to scene ${s}`}
              onClick={(e) => handleNavClick(e, s)}
            />
          );
        })}
      </nav>
    );
  };

  return (
    <div className={rootClasses}>
      {renderAuroraBg()}
      <div
        ref={trackRef}
        key={`04-${scene}`}
        className={[styles.track, entered ? styles.trackActive : styles.trackEnter].filter(Boolean).join(" ")}
        style={reducedMotion ? { transitionDuration: "0s" } : undefined}
      >
        {renderSceneContent()}
      </div>
      {renderNav()}
    </div>
  );
}

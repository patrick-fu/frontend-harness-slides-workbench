import React, { useEffect, useState, useRef, useCallback } from "react";
import type { BespokeStyleProps, StyleMetadata } from "../types";
import styles from "./33-glass-dashboard.module.css";

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
      title: "Operations Dashboard",
      subtitle: "Real-time system health overview",
      kpis: [
        { label: "Active Users", value: "24.8K", delta: "+12.4%", up: true },
        { label: "Requests/s", value: "1.2M", delta: "+8.2%", up: true },
        { label: "Error Rate", value: "0.03%", delta: "-0.01%", up: true },
        { label: "Latency p99", value: "42ms", delta: "+3ms", up: false },
      ],
      chartBars: [45, 62, 38, 78, 55, 90, 72, 68, 85, 95, 70, 88],
      chartLabels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      activities: [
        { text: "Deploy v2.14.0 completed", time: "2m ago", color: "#4ade80" },
        { text: "Auto-scaling triggered: +3 nodes", time: "8m ago", color: "#38bdf8" },
        { text: "Cache hit ratio dropped to 94%", time: "15m ago", color: "#fbbf24" },
        { text: "New API key created: prod-***", time: "1h ago", color: "#a78bfa" },
        { text: "Database backup completed", time: "2h ago", color: "#4ade80" },
        { text: "SSL certificate renewed", time: "5h ago", color: "#38bdf8" },
      ],
    },
    zh: {
      title: "运营仪表盘",
      subtitle: "实时系统健康概览",
      kpis: [
        { label: "活跃用户", value: "24.8K", delta: "+12.4%", up: true },
        { label: "请求/秒", value: "1.2M", delta: "+8.2%", up: true },
        { label: "错误率", value: "0.03%", delta: "-0.01%", up: true },
        { label: "延迟 p99", value: "42ms", delta: "+3ms", up: false },
      ],
      chartBars: [45, 62, 38, 78, 55, 90, 72, 68, 85, 95, 70, 88],
      chartLabels: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
      activities: [
        { text: "部署 v2.14.0 完成", time: "2分钟前", color: "#4ade80" },
        { text: "自动扩缩容触发：+3 节点", time: "8分钟前", color: "#38bdf8" },
        { text: "缓存命中率降至 94%", time: "15分钟前", color: "#fbbf24" },
        { text: "新 API 密钥已创建：prod-***", time: "1小时前", color: "#a78bfa" },
        { text: "数据库备份完成", time: "2小时前", color: "#4ade80" },
        { text: "SSL 证书已续期", time: "5小时前", color: "#38bdf8" },
      ],
    },
  },
  2: {
    en: {
      title: "Performance Detail",
      detailTitle: "API Gateway Throughput",
      detailMeta: "Last 24 hours · Region: us-east-1",
      metrics: [
        { label: "Requests", value: "28.4M", trend: "+18% vs yesterday" },
        { label: "Avg Response", value: "23ms", trend: "-12% faster" },
        { label: "Success Rate", value: "99.97%", trend: "Stable" },
        { label: "Bandwidth", value: "142 GB", trend: "+5% vs yesterday" },
      ],
    },
    zh: {
      title: "性能详情",
      detailTitle: "API 网关吞吐量",
      detailMeta: "过去 24 小时 · 区域：us-east-1",
      metrics: [
        { label: "请求数", value: "28.4M", trend: "较昨日 +18%" },
        { label: "平均响应", value: "23ms", trend: "快 12%" },
        { label: "成功率", value: "99.97%", trend: "稳定" },
        { label: "带宽", value: "142 GB", trend: "较昨日 +5%" },
      ],
    },
  },
  3: {
    en: {
      title: "Service Overview",
      gridTitle: "All Systems Operational",
      cards: [
        { icon: "⚡", title: "API Gateway", desc: "Handles all inbound traffic with rate limiting", value: "99.97%", color: "#38bdf8" },
        { icon: "🗄️", title: "Database", desc: "Primary PostgreSQL cluster with read replicas", value: "99.99%", color: "#a78bfa" },
        { icon: "🔍", title: "Search", desc: "Elasticsearch cluster powering full-text queries", value: "99.95%", color: "#4ade80" },
        { icon: "📨", title: "Message Queue", desc: "Async job processing and event streaming", value: "100%", color: "#fbbf24" },
        { icon: "🖼️", title: "CDN", desc: "Edge caching across 42 global PoPs", value: "99.98%", color: "#f472b6" },
        { icon: "🔒", title: "Auth Service", desc: "OAuth2 / OIDC identity and session management", value: "99.99%", color: "#34d399" },
      ],
    },
    zh: {
      title: "服务概览",
      gridTitle: "所有系统运行正常",
      cards: [
        { icon: "⚡", title: "API 网关", desc: "处理所有入站流量并限速", value: "99.97%", color: "#38bdf8" },
        { icon: "🗄️", title: "数据库", desc: "主 PostgreSQL 集群和只读副本", value: "99.99%", color: "#a78bfa" },
        { icon: "🔍", title: "搜索", desc: "Elasticsearch 集群驱动全文搜索", value: "99.95%", color: "#4ade80" },
        { icon: "📨", title: "消息队列", desc: "异步任务处理和事件流", value: "100%", color: "#fbbf24" },
        { icon: "🖼️", title: "CDN", desc: "覆盖 42 个全球节点的边缘缓存", value: "99.98%", color: "#f472b6" },
        { icon: "🔒", title: "认证服务", desc: "OAuth2 / OIDC 身份和会话管理", value: "99.99%", color: "#34d399" },
      ],
    },
  },
  4: {
    en: {
      title: "The Big Number",
      bigLabel: "Total Requests Today",
      bigValue: "1.2",
      bigUnit: "Million",
      bigCaption: "Served across 142 edge locations with sub-50ms median response time worldwide.",
    },
    zh: {
      title: "核心指标",
      bigLabel: "今日总请求数",
      bigValue: "120",
      bigUnit: "万",
      bigCaption: "在 142 个边缘节点提供服务，全球中位响应时间低于 50 毫秒。",
    },
  },
  5: {
    en: {
      title: "Summary",
      summaryHeadline: "Everything is under control.",
      summarySub: "Your infrastructure is healthy, responsive, and scaling efficiently.",
      summaryStats: [
        { value: "99.97%", label: "Uptime" },
        { value: "23ms", label: "Avg Latency" },
        { value: "1.2M/s", label: "Peak RPS" },
      ],
    },
    zh: {
      title: "总结",
      summaryHeadline: "一切尽在掌控。",
      summarySub: "您的基础设施健康、响应迅速，并且高效扩展。",
      summaryStats: [
        { value: "99.97%", label: "可用性" },
        { value: "23ms", label: "平均延迟" },
        { value: "120万/秒", label: "峰值 RPS" },
      ],
    },
  },
};

// ─── Metadata ───────────────────────────────────────────────────────────────

export function getMetadata(lang: "en" | "zh"): StyleMetadata {
  const nameMap = { en: "Glass Dashboard", zh: "玻璃仪表盘" };
  const themeMap = {
    en: "Operations Dashboard — real-time system health with glassmorphism panels and live data",
    zh: "运营仪表盘——实时系统健康状态，玻璃拟态面板和实时数据",
  };
  const densityLabelMap = { en: "Information-Dense", zh: "信息密集" };

  const sceneTitles = {
    en: ["Overview", "Detail View", "Service Grid", "Key Metric", "Summary"],
    zh: ["总览", "详情视图", "服务网格", "关键指标", "总结"],
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
      bg: "#0f172a",
      ink: "#f1f5f9",
      panel: "#1e293b",
    },
    typography: {
      header: "Inter 700",
      body: "Inter 400",
    },
    tags: [
      "dashboard",
      "glass",
      "digital",
      "modern",
      "data",
      "dark",
      "kpi",
      "monitoring",
      "tech",
      "grid",
    ],
    fonts: ["Inter"],
    scenes,
  };
}

// ─── Component ──────────────────────────────────────────────────────────────

export default function GlassDashboard({
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
      requestAnimationFrame(() => {
        setEntered(true);
      });
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

  const renderScene1 = () => {
    const c = SCENES[1][language];
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
                opacity: entered ? 1 : 0,
                transform: entered ? "none" : "translateY(1cqh)",
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
                    height: entered ? `${h}%` : "0%",
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
                      opacity: entered ? 1 : 0,
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
  };

  const renderScene2 = () => {
    const c = SCENES[2][language];
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
                opacity: entered && beat >= 1 ? 1 : 0,
                transform: entered && beat >= 1 ? "none" : "translateY(1cqh)",
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
  };

  const renderScene3 = () => {
    const c = SCENES[3][language];
    return (
      <div className={styles.gridScene}>
        <h1 className={styles.gridTitle}>{c.gridTitle}</h1>
        <div className={styles.cardGrid}>
          {(c.cards || []).map((card, i) => {
            const visible = i <= beat;
            return (
              <div
                key={i}
                className={styles.glassCard}
                style={{
                  opacity: visible && entered ? 1 : 0,
                  transform: visible && entered ? "none" : "translateY(1.5cqh)",
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
  };

  const renderScene4 = () => {
    const c = SCENES[4][language];
    return (
      <div className={styles.metricScene}>
        <span className={styles.metricSceneLabel}>{c.bigLabel}</span>
        <h2
          className={styles.metricSceneValue}
          style={{
            opacity: entered ? 1 : 0,
            transform: entered ? "none" : "scale(0.9)",
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
  };

  const renderScene5 = () => {
    const c = SCENES[5][language];
    return (
      <div className={styles.summaryScene}>
        <h1
          className={styles.summaryHeadline}
          style={{
            opacity: entered ? 1 : 0,
            transform: entered ? "none" : "translateY(1cqh)",
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
  };

  const renderSceneContent = () => {
    switch (scene) {
      case 1:
        return renderScene1();
      case 2:
        return renderScene2();
      case 3:
        return renderScene3();
      case 4:
        return renderScene4();
      case 5:
        return renderScene5();
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

  return (
    <div
      data-testid="style-33-root"
      className={rootClasses}
    >
      <div
        ref={trackRef}
        key={`33-${scene}`}
        className={styles.transitionTrack}
        style={reducedMotion ? { transitionDuration: "0s" } : undefined}
      >
        {renderSceneContent()}
      </div>
      {renderNavDots()}
    </div>
  );
}

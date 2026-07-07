import React, { useEffect, useCallback } from "react";
import type { BespokeStyleProps, StyleMetadata } from "../types";
import SpatialSceneTrack from "./SpatialSceneTrack";
import styles from "./11-timeline-spiral.module.css";

// ─── Transition constants ─────────────────────────────────────────────────

// ─── Font Injection ────────────────────────────────────────────────────────

function useFonts() {
  useEffect(() => {
    const id = "style-11-fonts";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap";
    document.head.appendChild(link);
  }, []);
}

// ─── Content ────────────────────────────────────────────────────────────────

const SCENES = {
  1: {
    en: {
      brand: "Data Platform",
      title: "Signal",
      titleAccent: "Pipeline",
      subtitle: "Trace exactly how raw events become clean, actionable insight — from ingestion to activation",
      years: [
        { num: "6", lbl: "Pipeline Stages" },
        { num: "12M+", lbl: "Events / Day" },
        { num: "99.7%", lbl: "Delivery Rate" },
      ],
    },
    zh: {
      brand: "数据平台",
      title: "信号",
      titleAccent: "管道",
      subtitle: "精确追踪原始事件如何从摄取到激活，变成干净、可操作的洞察",
      years: [
        { num: "6", lbl: "管道阶段" },
        { num: "1200万+", lbl: "事件 / 天" },
        { num: "99.7%", lbl: "交付率" },
      ],
    },
  },
  2: {
    en: {
      label: "Pipeline Stages",
      title: "From raw to ready",
      nodes: [
        { year: "01", event: "Ingestion", desc: "Raw events from all sources" },
        { year: "02", event: "Validation", desc: "Schema checks and dedup" },
        { year: "03", event: "Enrichment", desc: "User context and metadata" },
        { year: "04", event: "Transformation", desc: "Normalize and aggregate" },
        { year: "05", event: "Activation", desc: "Push to downstream tools" },
      ],
    },
    zh: {
      label: "管道阶段",
      title: "从原始到就绪",
      nodes: [
        { year: "01", event: "摄取", desc: "来自所有来源的原始事件" },
        { year: "02", event: "验证", desc: "模式检查和去重" },
        { year: "03", event: "丰富", desc: "用户上下文和元数据" },
        { year: "04", event: "转换", desc: "规范化和聚合" },
        { year: "05", event: "激活", desc: "推送到下游工具" },
      ],
    },
  },
  3: {
    en: {
      label: "Stage Detail",
      title: "Transformation Engine",
      eventTitle: "Where raw data becomes structured signal",
      desc: "Our transformation engine applies 47 normalization rules, resolves identity across sessions, and aggregates events into user-level timelines — all under 200ms per event.",
      stats: [
        { val: "47", lbl: "Rules Applied" },
        { val: "200ms", lbl: "Avg. Latency" },
        { val: "100%", lbl: "Idempotent" },
      ],
    },
    zh: {
      label: "阶段详情",
      title: "转换引擎",
      eventTitle: "原始数据变为结构化信号之处",
      desc: "我们的转换引擎应用 47 条规范化规则，跨会话解析身份，并将事件聚合为用户级时间线——每个事件均在 200 毫秒内完成。",
      stats: [
        { val: "47", lbl: "规则数" },
        { val: "200ms", lbl: "平均延迟" },
        { val: "100%", lbl: "幂等性" },
      ],
    },
  },
  4: {
    en: {
      label: "Pipeline Health",
      title: "System status at a glance",
      metrics: [
        { value: "99.7", unit: "%", desc: "Event delivery success rate" },
        { value: "180", unit: "ms", desc: "P95 end-to-end latency" },
        { value: "12.4", unit: "M", desc: "Events processed daily" },
        { value: "0", unit: "hrs", desc: "Data loss this quarter" },
      ],
    },
    zh: {
      label: "管道健康",
      title: "系统状态一览",
      metrics: [
        { value: "99.7", unit: "%", desc: "事件交付成功率" },
        { value: "180", unit: "ms", desc: "P95 端到端延迟" },
        { value: "1240", unit: "万", desc: "每日处理事件数" },
        { value: "0", unit: "小时", desc: "本季度数据丢失" },
      ],
    },
  },
  5: {
    en: {
      quote: "A pipeline is only as good as its <em>weakest stage</em>.",
      author: "— Platform Engineering Team",
      vision: "Every signal traced, every stage observable, every output trusted.",
    },
    zh: {
      quote: "管道的好坏取决于它<em>最薄弱的阶段</em>。",
      author: "——平台工程团队",
      vision: "每个信号都可追踪，每个阶段都可观测，每个输出都可信。",
    },
  },
};

// ─── Metadata ───────────────────────────────────────────────────────────────

export function getMetadata(lang: "en" | "zh"): StyleMetadata {
  const nameMap = { en: "Signal Pipeline Flow", zh: "信号管道流" };
  const themeMap = {
    en: "Dark Technical Pipeline Map — precise system diagram with near-black slate ground, luminous signal colors, and routed node-to-connector flow. Best for architecture, data flow, and process mapping where showing the routing is the explanation.",
    zh: "深色技术管道图——近黑色板岩底色上的精确系统图，发光信号色彩，路由节点到连接器的流动。最适合架构、数据流和流程映射，展示路由即解释。",
  };
  const densityLabelMap = { en: "Technical", zh: "技术型" };

  const sceneTitles = {
    en: ["Title", "Pipeline Stages", "Stage Detail", "Health Metrics", "Vision"],
    zh: ["标题", "管道阶段", "阶段详情", "健康指标", "愿景"],
  };

  const beatActions = {
    en: {
      1: ["Title and stats appear"],
      2: ["Header appears", "Nodes 1-3 populate", "Nodes 4-5 populate"],
      3: ["Year and title appear", "Description and stats reveal"],
      4: ["Title appears", "Metrics cards populate"],
      5: ["Quote and vision revealed"],
    },
    zh: {
      1: ["标题和数据呈现"],
      2: ["标题呈现", "第 1-3 节点填充", "第 4-5 节点填充"],
      3: ["年份和标题呈现", "描述和统计揭示"],
      4: ["标题呈现", "指标卡片填充"],
      5: ["引言和愿景揭示"],
    },
  };

  const BEAT_COUNTS: Record<number, number> = { 1: 1, 2: 3, 3: 2, 4: 2, 5: 1 };

  const scenes = [1, 2, 3, 4, 5].map((id) => {
    const beatCount = BEAT_COUNTS[id];
    const actions = beatActions[lang][id as keyof (typeof beatActions)["en"]];
    const c = SCENES[id as keyof typeof SCENES][lang] as any;

    const beats = Array.from({ length: beatCount }, (_, beatIdx) => {
      let beatTitle = "";
      let beatBody = "";

      if (id === 1) {
        beatTitle = `${c.title} ${c.titleAccent}`;
        const years = (c.years as Array<{ num: string; lbl: string }>) || [];
        beatBody = years.map((y) => `${y.num} ${y.lbl}`).join(" / ");
      } else if (id === 2) {
        beatTitle = c.title;
        const nodes = (c.nodes as Array<{ year: string; event: string }>) || [];
        const visible = beatIdx === 0 ? 0 : beatIdx === 1 ? 3 : 5;
        beatBody = nodes.slice(0, visible).map((n) => `${n.year}: ${n.event}`).join(" / ");
      } else if (id === 3) {
        beatTitle = c.eventTitle;
        beatBody = beatIdx >= 1 ? `${(c.stats as Array<{ val: string; lbl: string }>).map((s) => `${s.val} ${s.lbl}`).join(" / ")}` : "";
      } else if (id === 4) {
        beatTitle = c.title;
        if (beatIdx >= 1) {
          const metrics = (c.metrics as Array<{ value: string; unit: string }>) || [];
          beatBody = metrics.map((m) => `${m.value} ${m.unit}`).join(" / ");
        }
      } else if (id === 5) {
        beatTitle = c.quote.replace(/<[^>]+>/g, "");
        beatBody = c.author;
      }

      return { id: beatIdx, action: actions[beatIdx], title: beatTitle, body: beatBody };
    });

    return { id, title: sceneTitles[lang][id - 1], beats };
  });

  return {
    id: "signal-pipeline-flow",
    band: "balanced-hybrid",
    name: nameMap[lang],
    theme: themeMap[lang],
    densityLabel: densityLabelMap[lang],
    heroScene: 2,
    colors: { bg: "#0d1117", ink: "#e6edf3", panel: "#161b22" },
    typography: { header: "JetBrains Mono 500", body: "Inter 400" },
    tags: ["pipeline", "signal-flow", "technical", "dark", "system-diagram", "nodes", "routing", "instrument-panel", "glow"],
    fonts: ["Inter", "JetBrains Mono"],
    scenes,
  };
}

// ─── Component ──────────────────────────────────────────────────────────────

const BEAT_LAYOUT_MODES = {
  2: "motion",
  3: "motion",
  4: "motion",
} satisfies Record<number, "motion" | "reserved">;

export default function TimelineSpiral({
  scene, beat, language, isThumbnail, reducedMotion, onNavigate, }: BespokeStyleProps) {
  useFonts();

  const handleNavClick = useCallback(
    (e: React.MouseEvent, targetScene: number) => {
      e.stopPropagation();
      onNavigate?.(targetScene, 0);
    },
    [onNavigate],
  );

  const rootClasses = [styles.root, reducedMotion ? styles.reducedMotion : "", isThumbnail ? styles.thumbnail : ""].filter(Boolean).join(" ");

  const renderScene1 = () => {
    const c = SCENES[1][language as keyof typeof SCENES[1]];
    return (
      <div className={styles.scene1}>
        <div className={styles.brandMark}>
          <div className={styles.brandDot} />
          <span className={styles.brandName}>{c.brand}</span>
        </div>
        <h1 className={styles.heroTitle}>
          {c.title}<br /><span>{c.titleAccent}</span>
        </h1>
        <p className={styles.heroSub}>{c.subtitle}</p>
        <div className={styles.heroYears}>
          {(c.years as Array<{ num: string; lbl: string }>).map((y, i) => (
            <div key={i} className={styles.heroYearItem}>
              <span className={styles.heroYearNum}>{y.num}</span>
              <span className={styles.heroYearLbl}>{y.lbl}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderScene2 = (beatNum: number) => {
    const c = SCENES[2][language as keyof typeof SCENES[2]];
    const nodes = c.nodes as Array<{ year: string; event: string; desc: string }>;
    const visibleCount = beatNum === 0 ? 0 : beatNum === 1 ? 3 : 5;
    return (
      <div className={styles.scene2}>
        <div className={styles.timelineHeader}>
          <span className={styles.timelineLabel}>{c.label}</span>
          <h2 className={styles.timelineTitle}>{c.title}</h2>
        </div>
        <div className={styles.timelineContainer}>
          <div className={styles.timelineLine} aria-hidden="true" />
          <div className={styles.timelineNodes}>
            {nodes.map((node, i) => {
              const visible = i < visibleCount;
              const cls = [styles.tlNode, visible ? styles.tlNodeVisible : ""].filter(Boolean).join(" ");
              return (
                <div
                  key={i}
                  className={cls}
                  style={reducedMotion ? { opacity: visible ? 1 : 0, transform: "none" } : { transitionDelay: `${i * 0.12}s` }}
                >
                  <span className={styles.tlNodeYear}>{node.year}</span>
                  <div className={styles.tlNodeDot} aria-hidden="true" />
                  <span className={styles.tlNodeEvent}>{node.event}</span>
                  <span className={styles.tlNodeDesc}>{node.desc}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const renderScene3 = (beatNum: number) => {
    const c = SCENES[3][language as keyof typeof SCENES[3]];
    const stats = c.stats as Array<{ val: string; lbl: string }>;
    return (
      <div className={styles.scene3}>
        <span className={styles.timelineLabel}>{c.label}</span>
        <div className={styles.milestoneDetail}>
          <div className={styles.milestoneYearBlock}>
            <span className={styles.milestoneYearBig}>2020</span>
            <span className={styles.milestoneYearLabel}>{language === "zh" ? "关键年" : "Pivotal Year"}</span>
          </div>
          <div className={styles.milestoneInfo}>
            <h2 className={styles.milestoneEventTitle}>{c.eventTitle}</h2>
            {beatNum >= 1 && (
              <>
                <p className={styles.milestoneDesc}>{c.desc}</p>
                <div className={styles.milestoneStats}>
                  {stats.map((s, i) => (
                    <div key={i} className={styles.milestoneStat}>
                      <span className={styles.milestoneStatVal}>{s.val}</span>
                      <span className={styles.milestoneStatLbl}>{s.lbl}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderScene4 = (beatNum: number) => {
    const c = SCENES[4][language as keyof typeof SCENES[4]];
    const metrics = c.metrics as Array<{ value: string; unit: string; desc: string }>;
    return (
      <div className={styles.scene4}>
        <span className={styles.timelineLabel}>{c.label}</span>
        <h2 className={styles.timelineTitle}>{c.title}</h2>
        <div className={styles.growthGrid}>
          {metrics.map((m, i) => {
            const visible = beatNum >= 1;
            const cls = [styles.growthCard, visible ? styles.growthCardVisible : ""].filter(Boolean).join(" ");
            return (
              <div
                key={i}
                className={cls}
                style={reducedMotion ? { opacity: visible ? 1 : 0, transform: "none" } : { transitionDelay: `${i * 0.1}s` }}
              >
                <span className={styles.growthCardLabel}>{language === "zh" ? "指标" : "Metric"} {String(i + 1).padStart(2, "0")}</span>
                <div>
                  <span className={styles.growthCardValue}>{m.value}</span>
                  <span className={styles.growthCardUnit}>{m.unit}</span>
                </div>
                <span className={styles.growthCardDesc}>{m.desc}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderScene5 = () => {
    const c = SCENES[5][language as keyof typeof SCENES[5]];
    return (
      <div className={styles.scene5}>
        <h2 className={styles.closingQuote} dangerouslySetInnerHTML={{ __html: c.quote }} />
        <p className={styles.closingAuthor}>{c.author}</p>
        <p className={styles.closingVision}>{c.vision}</p>
      </div>
    );
  };

  const renderSceneFor = (sceneNum: number, beatNum: number) => {
    switch (sceneNum) {
      case 1: return renderScene1();
      case 2: return renderScene2(beatNum);
      case 3: return renderScene3(beatNum);
      case 4: return renderScene4(beatNum);
      case 5: return renderScene5();
      default: return null;
    }
  };

  const renderNav = () => {
    if (isThumbnail) return null;
    return (
      <nav className={styles.navTimeline} aria-label="Scene navigation">
        <div className={styles.navBaseline} aria-hidden="true" />
        {[1, 2, 3, 4, 5].map((s) => {
          const isActive = s === scene;
          return (
            <button
              key={s}
              type="button"
              className={[styles.navTick, isActive ? styles.navTickActive : ""].filter(Boolean).join(" ")}
              aria-label={`Jump to scene ${s}`}
              onClick={(e) => handleNavClick(e, s)}
            >
              <span className={styles.navTickMark} />
              <span className={styles.navTickNum}>{s}</span>
            </button>
          );
        })}
      </nav>
    );
  };

  return (
    <div className={rootClasses}>
            <SpatialSceneTrack
        scene={scene}
        beat={beat}
        transitionKind="slide-x"
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

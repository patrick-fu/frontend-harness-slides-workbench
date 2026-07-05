import React, { useEffect, useCallback } from "react";
import type { BespokeStyleProps, StyleMetadata } from "../types";
import styles from "./11-timeline-spiral.module.css";

// ─── Font Injection ────────────────────────────────────────────────────────

function useFonts() {
  useEffect(() => {
    const id = "style-11-fonts";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap";
    document.head.appendChild(link);
  }, []);
}

// ─── Content ────────────────────────────────────────────────────────────────

const SCENES = {
  1: {
    en: {
      brand: "Acme Corp",
      title: "A Decade of",
      titleAccent: "Innovation",
      subtitle: "From a three-person startup to a global platform serving millions",
      years: [
        { num: "2016", lbl: "Founded" },
        { num: "50M+", lbl: "Users Worldwide" },
        { num: "12", lbl: "Global Offices" },
      ],
    },
    zh: {
      brand: "Acme 公司",
      title: "十年",
      titleAccent: "创新之路",
      subtitle: "从三人创业团队到服务数百万用户的全球平台",
      years: [
        { num: "2016", lbl: "成立" },
        { num: "5000万+", lbl: "全球用户" },
        { num: "12", lbl: "全球办公室" },
      ],
    },
  },
  2: {
    en: {
      label: "Our Journey",
      title: "Key milestones along the way",
      nodes: [
        { year: "2016", event: "Company Founded", desc: "Three co-founders in a garage" },
        { year: "2018", event: "Series A", desc: "$12M raised from Sequoia" },
        { year: "2020", event: "Global Expansion", desc: "Launched in 15 countries" },
        { year: "2023", event: "Platform v3", desc: "Complete architecture rebuild" },
        { year: "2026", event: "Industry Leader", desc: "#1 in market share" },
      ],
    },
    zh: {
      label: "我们的旅程",
      title: "关键里程碑",
      nodes: [
        { year: "2016", event: "公司成立", desc: "三位联合创始人在车库创业" },
        { year: "2018", event: "A 轮融资", desc: "红杉资本领投 1200 万美元" },
        { year: "2020", event: "全球扩张", desc: "进入 15 个国家市场" },
        { year: "2023", event: "平台 v3", desc: "全面架构重构" },
        { year: "2026", event: "行业领先", desc: "市场份额第一" },
      ],
    },
  },
  3: {
    en: {
      label: "Pivotal Moment",
      title: "2020: Global Expansion",
      eventTitle: "Breaking through international markets",
      desc: "We localized our platform for 12 languages, established regional hubs, and tripled our user base in 18 months. This was the inflection point that defined our trajectory.",
      stats: [
        { val: "3x", lbl: "User Growth" },
        { val: "15", lbl: "New Markets" },
        { val: "12", lbl: "Languages" },
      ],
    },
    zh: {
      label: "关键时刻",
      title: "2020：全球扩张",
      eventTitle: "突破国际市场",
      desc: "我们将平台本地化为 12 种语言，建立区域中心，在 18 个月内将用户群扩大了两倍。这是定义我们发展轨迹的转折点。",
      stats: [
        { val: "3倍", lbl: "用户增长" },
        { val: "15", lbl: "新市场" },
        { val: "12", lbl: "语言版本" },
      ],
    },
  },
  4: {
    en: {
      label: "By the Numbers",
      title: "A decade of growth",
      metrics: [
        { value: "50M+", unit: "users", desc: "Active across 80+ countries" },
        { value: "$1.2B", unit: "revenue", desc: "Annual recurring revenue (ARR)" },
        { value: "4,200", unit: "employees", desc: "Team members worldwide" },
        { value: "99.99%", unit: "uptime", desc: "Platform reliability SLA" },
      ],
    },
    zh: {
      label: "数据说话",
      title: "十年增长",
      metrics: [
        { value: "5000万+", unit: "用户", desc: "覆盖 80+ 个国家和地区" },
        { value: "12亿$", unit: "营收", desc: "年度经常性收入 (ARR)" },
        { value: "4,200", unit: "员工", desc: "遍布全球的团队成员" },
        { value: "99.99%", unit: "可用性", desc: "平台可靠性 SLA" },
      ],
    },
  },
  5: {
    en: {
      quote: "The best way to <em>predict the future</em> is to build it.",
      author: "— Jane Chen, CEO & Co-Founder",
      vision: "Looking ahead to the next decade of building, learning, and growing together.",
    },
    zh: {
      quote: "<em>预测未来</em>最好的方式就是去创造它。",
      author: "—— 陈珍，CEO 兼联合创始人",
      vision: "展望下一个十年，共同建设、学习和成长。",
    },
  },
};

// ─── Metadata ───────────────────────────────────────────────────────────────

export function getMetadata(lang: "en" | "zh"): StyleMetadata {
  const nameMap = { en: "Timeline Spiral", zh: "时间线螺旋" };
  const themeMap = {
    en: "Company Evolution History — horizontal timeline with milestone markers, connecting lines, and progress visualization",
    zh: "公司发展历程——水平时间线，里程碑标记、连接线和进度可视化",
  };
  const densityLabelMap = { en: "Medium", zh: "中等" };

  const sceneTitles = {
    en: ["Title", "Milestone Timeline", "Pivotal Moment", "By the Numbers", "Vision"],
    zh: ["标题", "里程碑时间线", "关键时刻", "数据说话", "愿景"],
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
    id: "11",
    band: "balanced-hybrid",
    name: nameMap[lang],
    theme: themeMap[lang],
    densityLabel: densityLabelMap[lang],
    heroScene: 2,
    colors: { bg: "#fafbfc", ink: "#24292e", panel: "#ffffff" },
    typography: { header: "Inter 700", body: "Inter 400" },
    tags: ["timeline", "history", "milestone", "evolution", "journey", "progress", "chronological", "company", "growth"],
    fonts: ["Inter"],
    scenes,
  };
}

// ─── Component ──────────────────────────────────────────────────────────────

export default function TimelineSpiral({
  scene, beat, language, isThumbnail, reducedMotion, onNavigate, isTransitionClone,
}: BespokeStyleProps) {
  useFonts();

  const handleNavClick = useCallback(
    (e: React.MouseEvent, targetScene: number) => {
      e.stopPropagation();
      onNavigate?.(targetScene, 0);
    },
    [onNavigate],
  );

  const rootClasses = [styles.root, reducedMotion ? styles.reducedMotion : "", isThumbnail ? styles.thumbnail : ""].filter(Boolean).join(" ");
  const trackClasses = [styles.track, !isTransitionClone && styles.animateSceneEnter].filter(Boolean).join(" ");

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

  const renderScene2 = () => {
    const c = SCENES[2][language as keyof typeof SCENES[2]];
    const nodes = c.nodes as Array<{ year: string; event: string; desc: string }>;
    const visibleCount = beat === 0 ? 0 : beat === 1 ? 3 : 5;
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

  const renderScene3 = () => {
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
            {beat >= 1 && (
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

  const renderScene4 = () => {
    const c = SCENES[4][language as keyof typeof SCENES[4]];
    const metrics = c.metrics as Array<{ value: string; unit: string; desc: string }>;
    return (
      <div className={styles.scene4}>
        <span className={styles.timelineLabel}>{c.label}</span>
        <h2 className={styles.timelineTitle}>{c.title}</h2>
        <div className={styles.growthGrid}>
          {metrics.map((m, i) => {
            const visible = beat >= 1;
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
      <div
        key={`11-${scene}`}
        className={trackClasses}
        style={reducedMotion ? { animationDuration: "0s" } : undefined}
      >
        {renderSceneContent()}
      </div>
      {renderNav()}
    </div>
  );
}

import React, { useEffect, useState, useRef, useCallback } from "react";
import type { BespokeStyleProps, StyleMetadata } from "../types";
import styles from "./15-roadmap.module.css";

// ─── Font Injection ────────────────────────────────────────────────────────

function useFonts() {
  useEffect(() => {
    const id = "style-15-fonts";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap";
    document.head.appendChild(link);
  }, []);
}

// ─── Content ────────────────────────────────────────────────────────────────

const SCENES = {
  1: {
    en: {
      label: "Product Roadmap",
      title: "The Year",
      titleAccent: "Ahead",
      sub: "A 12-month journey from vision to shipped value across four focused quarters",
      meta: [
        { val: "12", lbl: "Months" },
        { val: "4", lbl: "Quarters" },
        { val: "24", lbl: "Milestones" },
      ],
    },
    zh: {
      label: "产品路线图",
      title: "未来",
      titleAccent: "一年",
      sub: "12 个月的旅程，从愿景到交付价值，跨越四个聚焦季度",
      meta: [
        { val: "12", lbl: "个月" },
        { val: "4", lbl: "季度" },
        { val: "24", lbl: "里程碑" },
      ],
    },
  },
  2: {
    en: {
      label: "Timeline",
      title: "Gantt Overview",
      months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      currentMonth: 3,
      tasks: [
        { name: "Platform Foundation", start: 0, width: 25, phase: "Q1", label: "Q1" },
        { name: "Core Features", start: 15, width: 30, phase: "Q2", label: "Q2" },
        { name: "Integration Layer", start: 35, width: 25, phase: "Q2", label: "Q2" },
        { name: "Scale & Perf", start: 55, width: 25, phase: "Q3", label: "Q3" },
        { name: "AI Capabilities", start: 65, width: 20, phase: "Q3", label: "Q3" },
        { name: "Launch Prep", start: 80, width: 20, phase: "Q4", label: "Q4" },
      ],
    },
    zh: {
      label: "时间线",
      title: "甘特总览",
      months: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
      currentMonth: 3,
      tasks: [
        { name: "平台基础", start: 0, width: 25, phase: "Q1", label: "Q1" },
        { name: "核心功能", start: 15, width: 30, phase: "Q2", label: "Q2" },
        { name: "集成层", start: 35, width: 25, phase: "Q2", label: "Q2" },
        { name: "扩展与性能", start: 55, width: 25, phase: "Q3", label: "Q3" },
        { name: "AI 能力", start: 65, width: 20, phase: "Q3", label: "Q3" },
        { name: "发布准备", start: 80, width: 20, phase: "Q4", label: "Q4" },
      ],
    },
  },
  3: {
    en: {
      label: "Phase Detail",
      title: "Quarter Breakdown",
      phases: [
        {
          q: "Q1",
          name: "Foundation",
          period: "January — March",
          items: [
            { icon: "🏗️", title: "Architecture Setup", desc: "Microservices, CI/CD pipelines, infra-as-code" },
            { icon: "🔐", title: "Auth & Security", desc: "OAuth2, RBAC, audit logging, data encryption" },
            { icon: "📊", title: "Observability", desc: "Metrics, tracing, alerting, dashboards" },
          ],
        },
        {
          q: "Q2",
          name: "Core Build",
          period: "April — June",
          items: [
            { icon: "⚡", title: "API Gateway", desc: "Rate limiting, caching, request routing" },
            { icon: "💾", title: "Data Layer", desc: "PostgreSQL, Redis, event streaming" },
            { icon: "🎨", title: "Design System", desc: "Component library, tokens, documentation" },
          ],
        },
        {
          q: "Q3",
          name: "Scale & Intelligence",
          period: "July — September",
          items: [
            { icon: "🚀", title: "Performance", desc: "Query optimization, CDN, lazy loading" },
            { icon: "🤖", title: "ML Pipeline", desc: "Model training, inference endpoints, A/B testing" },
            { icon: "📈", title: "Analytics", desc: "Funnel analysis, cohort tracking, retention" },
          ],
        },
        {
          q: "Q4",
          name: "Launch",
          period: "October — December",
          items: [
            { icon: "🎯", title: "Beta Program", desc: "Closed beta, feedback loops, bug fixes" },
            { icon: "📣", title: "Go-to-Market", desc: "Landing page, docs, tutorials, press kit" },
            { icon: "🏁", title: "GA Release", desc: "Full launch, monitoring, on-call rotation" },
          ],
        },
      ],
    },
    zh: {
      label: "阶段详情",
      title: "季度分解",
      phases: [
        {
          q: "Q1",
          name: "基础建设",
          period: "1月 — 3月",
          items: [
            { icon: "🏗️", title: "架构搭建", desc: "微服务、CI/CD 流水线、基础设施即代码" },
            { icon: "🔐", title: "认证与安全", desc: "OAuth2、RBAC、审计日志、数据加密" },
            { icon: "📊", title: "可观测性", desc: "指标、链路追踪、告警、仪表盘" },
          ],
        },
        {
          q: "Q2",
          name: "核心构建",
          period: "4月 — 6月",
          items: [
            { icon: "⚡", title: "API 网关", desc: "限流、缓存、请求路由" },
            { icon: "💾", title: "数据层", desc: "PostgreSQL、Redis、事件流" },
            { icon: "🎨", title: "设计系统", desc: "组件库、设计令牌、文档" },
          ],
        },
        {
          q: "Q3",
          name: "扩展与智能",
          period: "7月 — 9月",
          items: [
            { icon: "🚀", title: "性能优化", desc: "查询优化、CDN、懒加载" },
            { icon: "🤖", title: "ML 流水线", desc: "模型训练、推理端点、A/B 测试" },
            { icon: "📈", title: "数据分析", desc: "漏斗分析、队列追踪、留存" },
          ],
        },
        {
          q: "Q4",
          name: "发布",
          period: "10月 — 12月",
          items: [
            { icon: "🎯", title: "Beta 计划", desc: "封闭测试、反馈循环、Bug 修复" },
            { icon: "📣", title: "市场推广", desc: "落地页、文档、教程、新闻资料" },
            { icon: "🏁", title: "正式发布", desc: "全面上线、监控、值班轮换" },
          ],
        },
      ],
    },
  },
  4: {
    en: {
      label: "Dependencies",
      title: "Critical Path",
      chains: [
        { nodes: [
          { key: "Q1", name: "Platform Ready" },
          { key: "Q2", name: "API Gateway" },
          { key: "Q2", name: "Data Layer" },
          { key: "Q3", name: "ML Pipeline" },
        ]},
        { nodes: [
          { key: "Q2", name: "Design System" },
          { key: "Q3", name: "UI Components" },
          { key: "Q4", name: "Beta Program" },
          { key: "Q4", name: "GA Launch" },
        ]},
      ],
    },
    zh: {
      label: "依赖关系",
      title: "关键路径",
      chains: [
        { nodes: [
          { key: "Q1", name: "平台就绪" },
          { key: "Q2", name: "API 网关" },
          { key: "Q2", name: "数据层" },
          { key: "Q3", name: "ML 流水线" },
        ]},
        { nodes: [
          { key: "Q2", name: "设计系统" },
          { key: "Q3", name: "UI 组件" },
          { key: "Q4", name: "Beta 计划" },
          { key: "Q4", name: "正式发布" },
        ]},
      ],
    },
  },
  5: {
    en: {
      text: "Ship value, <em>quarter by quarter</em>.",
      sub: "Every milestone builds on the last. Steady progress compounds into breakthrough results.",
      progress: [
        { val: "Q1", lbl: "Foundation" },
        { val: "Q2", lbl: "Core Build" },
        { val: "Q3", lbl: "Intelligence" },
        { val: "Q4", lbl: "Launch" },
      ],
    },
    zh: {
      text: "<em>逐季</em>交付价值。",
      sub: "每个里程碑都在前一个基础上构建。稳步前进，终获突破。",
      progress: [
        { val: "Q1", lbl: "基础建设" },
        { val: "Q2", lbl: "核心构建" },
        { val: "Q3", lbl: "智能化" },
        { val: "Q4", lbl: "发布" },
      ],
    },
  },
};

// ─── Helpers ────────────────────────────────────────────────────────────────

function phaseBarClass(phase: string) {
  const map: Record<string, string> = {
    Q1: styles.barQ1,
    Q2: styles.barQ2,
    Q3: styles.barQ3,
    Q4: styles.barQ4,
  };
  return map[phase] || styles.barQ1;
}

// ─── Metadata ───────────────────────────────────────────────────────────────

export function getMetadata(lang: "en" | "zh"): StyleMetadata {
  const nameMap = { en: "Roadmap", zh: "路线图" };
  const themeMap = {
    en: "12-month product roadmap — Gantt-style timeline with Q1-Q4 color-coded phases, dependency chains, and progress tracking on dark navy",
    zh: "12 个月产品路线图——甘特式时间线，Q1-Q4 彩色阶段、依赖链和进度追踪，深海军蓝背景",
  };
  const densityLabelMap = { en: "Technical", zh: "技术型" };

  const sceneTitles = {
    en: ["Title", "Gantt Overview", "Phase Detail", "Dependencies", "Closing"],
    zh: ["标题", "甘特总览", "阶段详情", "依赖关系", "结语"],
  };

  const beatActions = {
    en: {
      1: ["Title and meta appear"],
      2: ["Header appears", "Rows 1-3 animate in", "Rows 4-6 animate in"],
      3: ["Phase tabs appear", "Items reveal for active phase"],
      4: ["Title appears", "Dependency chains reveal"],
      5: ["Closing statement and progress appear"],
    },
    zh: {
      1: ["标题和元数据呈现"],
      2: ["标题呈现", "第 1-3 行动画进入", "第 4-6 行动画进入"],
      3: ["阶段标签呈现", "当前阶段项目揭示"],
      4: ["标题呈现", "依赖链揭示"],
      5: ["结语和进度呈现"],
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
        beatBody = c.sub;
      } else if (id === 2) {
        beatTitle = c.title;
        if (beatIdx >= 1) {
          const tasks = (c.tasks as Array<{ name: string }>) || [];
          const visible = Math.min(beatIdx * 3, 6);
          beatBody = tasks.slice(0, visible).map((t) => t.name).join(" / ");
        }
      } else if (id === 3) {
        beatTitle = c.title;
        if (beatIdx >= 1) {
          const phases = (c.phases as Array<{ name: string }>) || [];
          beatBody = phases.map((p) => p.name).join(" / ");
        }
      } else if (id === 4) {
        beatTitle = c.title;
        if (beatIdx >= 1) {
          beatBody = lang === "en" ? "Platform → API → Data → ML pipeline chain" : "平台 → API → 数据 → ML 流水线链";
        }
      } else if (id === 5) {
        beatTitle = c.text.replace(/<[^>]+>/g, "");
        beatBody = c.sub;
      }

      return { id: beatIdx, action: actions[beatIdx], title: beatTitle, body: beatBody };
    });

    return { id, title: sceneTitles[lang][id - 1], beats };
  });

  return {
    id: "15",
    band: "balanced-hybrid",
    name: nameMap[lang],
    theme: themeMap[lang],
    densityLabel: densityLabelMap[lang],
    heroScene: 4,
    colors: { bg: "#1a2332", ink: "#e2e8f0", panel: "#2d3748" },
    typography: { header: "Inter 800", body: "Inter 400" },
    tags: ["roadmap", "gantt", "timeline", "phases", "dark", "technical", "planning", "quarters", "dependencies", "product"],
    fonts: ["Inter", "JetBrains Mono"],
    scenes,
  };
}

// ─── Component ──────────────────────────────────────────────────────────────

export default function Roadmap({
  scene, beat, language, isThumbnail, reducedMotion, onNavigate,
}: BespokeStyleProps) {
  useFonts();
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

  const rootClasses = [styles.root, reducedMotion ? styles.reducedMotion : "", isThumbnail ? styles.thumbnail : ""].filter(Boolean).join(" ");
  const trackClasses = [styles.track, entered ? styles.trackActive : styles.trackEnter].filter(Boolean).join(" ");

  const renderScene1 = () => {
    const c = SCENES[1][language as keyof typeof SCENES[1]];
    return (
      <div className={styles.scene1}>
        <span className={styles.roadmapLabel}>{c.label}</span>
        <h1 className={styles.roadmapTitle}>
          {c.title} <em>{c.titleAccent}</em>
        </h1>
        <p className={styles.roadmapSub}>{c.sub}</p>
        <div className={styles.roadmapMeta}>
          {c.meta.map((m, i) => (
            <div key={i} className={styles.roadmapMetaItem}>
              <span className={styles.roadmapMetaVal}>{m.val}</span>
              <span className={styles.roadmapMetaLbl}>{m.lbl}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderScene2 = () => {
    const c = SCENES[2][language as keyof typeof SCENES[2]];
    const tasks = c.tasks as Array<{ name: string; start: number; width: number; phase: string; label: string }>;
    const visibleCount = beat === 0 ? 0 : beat === 1 ? 3 : 6;
    return (
      <div className={styles.scene2}>
        <div className={styles.ganttHeader}>
          <span className={styles.ganttLabel}>{c.label}</span>
          <h2 className={styles.ganttTitle}>{c.title}</h2>
        </div>
        <div className={styles.ganttChart}>
          <div className={styles.ganttMonths}>
            {c.months.map((m, i) => (
              <span key={i} className={[styles.ganttMonth, i === c.currentMonth ? styles.current : ""].filter(Boolean).join(" ")}>{m}</span>
            ))}
          </div>
          <div className={styles.ganttRows}>
            {tasks.map((task, i) => {
              const visible = i < visibleCount;
              const cls = [styles.ganttRow, visible && entered ? styles.ganttRowVisible : ""].filter(Boolean).join(" ");
              return (
                <div
                  key={i}
                  className={cls}
                  style={reducedMotion ? { opacity: visible ? 1 : 0, transform: "none" } : { transitionDelay: `${i * 0.08}s` }}
                >
                  <span className={styles.ganttTaskName}>{task.name}</span>
                  <div className={styles.ganttTrack}>
                    <div
                      className={[styles.ganttBar, phaseBarClass(task.phase)].join(" ")}
                      style={{
                        left: `${task.start}%`,
                        width: `${task.width}%`,
                      }}
                    >
                      <span className={styles.ganttBarLabel}>{task.label}</span>
                    </div>
                  </div>
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
    const phases = c.phases as Array<{ q: string; name: string; period: string; items: Array<{ icon: string; title: string; desc: string }> }>;
    const activePhase = Math.min(beat, phases.length - 1);
    const active = phases[activePhase];
    return (
      <div className={styles.scene3}>
        <div className={styles.ganttHeader}>
          <span className={styles.ganttLabel}>{c.label}</span>
          <h2 className={styles.ganttTitle}>{c.title}</h2>
        </div>
        <div className={styles.phaseDetail}>
          <div className={styles.phaseSidebar}>
            {phases.map((p, i) => (
              <button
                key={i}
                type="button"
                className={[styles.phaseTab, i === activePhase ? styles.active : ""].filter(Boolean).join(" ")}
              >
                <span className={styles.phaseTabQ}>{p.q}</span>
                {p.name}
              </button>
            ))}
          </div>
          <div className={styles.phaseContent}>
            <div className={styles.phaseHeader}>
              <h3 className={styles.phaseName}>{active.name}</h3>
              <span className={styles.phasePeriod}>{active.period}</span>
            </div>
            <div className={styles.phaseItems}>
              {active.items.map((item, ii) => {
                const visible = true;
                const cls = [styles.phaseItem, visible && entered ? styles.phaseItemVisible : ""].filter(Boolean).join(" ");
                return (
                  <div
                    key={ii}
                    className={cls}
                    style={reducedMotion ? { opacity: visible ? 1 : 0, transform: "none" } : { transitionDelay: `${ii * 0.12}s` }}
                  >
                    <div className={styles.phaseItemIcon}>{item.icon}</div>
                    <div className={styles.phaseItemText}>
                      <span className={styles.phaseItemTitle}>{item.title}</span>
                      <span className={styles.phaseItemDesc}>{item.desc}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderScene4 = () => {
    const c = SCENES[4][language as keyof typeof SCENES[4]];
    const chains = c.chains as Array<{ nodes: Array<{ key: string; name: string }> }>;
    return (
      <div className={styles.scene4}>
        <div className={styles.ganttHeader}>
          <span className={styles.ganttLabel}>{c.label}</span>
          <h2 className={styles.ganttTitle}>{c.title}</h2>
        </div>
        <div className={styles.depArea}>
          {chains.map((chain, ci) => {
            const visible = true;
            const cls = [styles.depChain, visible && entered ? styles.depChainVisible : ""].filter(Boolean).join(" ");
            return (
              <div
                key={ci}
                className={cls}
                style={reducedMotion ? { opacity: visible ? 1 : 0, transform: "none" } : { transitionDelay: `${ci * 0.2}s` }}
              >
                {chain.nodes.map((node, ni) => (
                  <React.Fragment key={ni}>
                    <div className={styles.depNode}>
                      <span className={styles.depNodeKey}>{node.key}</span>
                      <span className={styles.depNodeName}>{node.name}</span>
                    </div>
                    {ni < chain.nodes.length - 1 && (
                      <svg className={styles.depArrow} viewBox="0 0 24 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path d="M2 8h18M16 3l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </React.Fragment>
                ))}
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
        <h2 className={styles.closingRoadmap} dangerouslySetInnerHTML={{ __html: c.text }} />
        <p className={styles.closingRoadmapSub}>{c.sub}</p>
        <div className={styles.closingProgress}>
          {c.progress.map((p, i) => (
            <div key={i} className={styles.closingProgItem}>
              <span className={styles.closingProgVal}>{p.val}</span>
              <span className={styles.closingProgLbl}>{p.lbl}</span>
            </div>
          ))}
        </div>
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
      <nav className={styles.navDots} aria-label="Scene navigation">
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
      <div
        ref={trackRef}
        key={`15-${scene}`}
        className={trackClasses}
        style={reducedMotion ? { transitionDuration: "0s" } : undefined}
      >
        {renderSceneContent()}
      </div>
      {renderNav()}
    </div>
  );
}

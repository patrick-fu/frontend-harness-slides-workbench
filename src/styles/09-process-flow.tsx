import React, { useEffect, useCallback } from "react";
import type { BespokeStyleProps, StyleMetadata } from "../types";
import styles from "./09-process-flow.module.css";

// ─── Font Injection ────────────────────────────────────────────────────────

function useFonts() {
  useEffect(() => {
    const id = "style-09-fonts";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap";
    document.head.appendChild(link);
  }, []);
}

// ─── Content ────────────────────────────────────────────────────────────────

interface SceneContent {
  en: Record<string, unknown>;
  zh: Record<string, unknown>;
}

const SCENES: Record<number, SceneContent> = {
  1: {
    en: {
      eyebrow: "Agile Methodology",
      title: "Ship",
      titleAccent: "Faster.",
      titleAccent2: "Learn Continuously.",
      subtitle: "A modern approach to iterative delivery and continuous improvement",
    },
    zh: {
      eyebrow: "敏捷方法论",
      title: "快速",
      titleAccent: "交付，",
      titleAccent2: "持续学习。",
      subtitle: "迭代交付与持续改进的现代方法",
    },
  },
  2: {
    en: {
      heading: "The Sprint Cycle",
      title: "Plan. Build. Review. Retrospect.",
      steps: [
        { icon: "plan", label: "Plan", desc: "Backlog grooming & sprint planning" },
        { icon: "build", label: "Build", desc: "Daily standups & development" },
        { icon: "review", label: "Review", desc: "Demo & stakeholder feedback" },
        { icon: "retro", label: "Retro", desc: "Team reflection & improvements" },
      ],
    },
    zh: {
      heading: "冲刺循环",
      title: "计划、构建、评审、回顾。",
      steps: [
        { icon: "plan", label: "计划", desc: "需求梳理与冲刺规划" },
        { icon: "build", label: "构建", desc: "每日站会与开发" },
        { icon: "review", label: "评审", desc: "演示与利益相关者反馈" },
        { icon: "retro", label: "回顾", desc: "团队反思与改进" },
      ],
    },
  },
  3: {
    en: {
      heading: "Implementation Workflow",
      title: "Five steps to delivery",
      steps: [
        { num: "01", title: "Discovery", body: "Stakeholder interviews, user research, and problem framing", badge: "Week 1" },
        { num: "02", title: "Design", body: "Wireframes, prototypes, and design system alignment", badge: "Week 2" },
        { num: "03", title: "Development", body: "Feature implementation with TDD and code review", badge: "Weeks 3-4" },
        { num: "04", title: "Testing", body: "QA validation, performance audits, accessibility checks", badge: "Week 5" },
        { num: "05", title: "Launch", body: "Phased rollout, monitoring, and feedback collection", badge: "Week 6" },
      ],
    },
    zh: {
      heading: "实施流程",
      title: "交付的五个步骤",
      steps: [
        { num: "01", title: "调研", body: "利益相关者访谈、用户研究、问题定义", badge: "第 1 周" },
        { num: "02", title: "设计", body: "线框图、原型、设计系统对齐", badge: "第 2 周" },
        { num: "03", title: "开发", body: "功能实现，配合 TDD 和代码审查", badge: "第 3-4 周" },
        { num: "04", title: "测试", body: "QA 验证、性能审计、无障碍检查", badge: "第 5 周" },
        { num: "05", title: "发布", body: "分阶段上线、监控、反馈收集", badge: "第 6 周" },
      ],
    },
  },
  4: {
    en: {
      heading: "Measurable Outcomes",
      title: "Results that matter",
      metrics: [
        { value: "47%", label: "Faster Delivery", desc: "Average cycle time reduction" },
        { value: "3.2x", label: "Team Velocity", desc: "Story points per sprint" },
        { value: "94%", label: "Stakeholder Sat.", desc: "Quarterly satisfaction score" },
      ],
    },
    zh: {
      heading: "可衡量的成果",
      title: "有意义的结果",
      metrics: [
        { value: "47%", label: "交付提速", desc: "平均周期时间缩短" },
        { value: "3.2x", label: "团队速率", desc: "每冲刺故事点数" },
        { value: "94%", label: "相关方满意度", desc: "季度满意度评分" },
      ],
    },
  },
  5: {
    en: {
      big: "Iterate. ",
      bigAccent: "Improve. ",
      big2: "Repeat.",
      sub: "Continuous improvement is not a destination — it is a discipline.",
      tag: "Start Your Next Sprint",
    },
    zh: {
      big: "迭代，",
      bigAccent: "改进，",
      big2: "重复。",
      sub: "持续改进不是终点，而是一种纪律。",
      tag: "开始你的下一个冲刺",
    },
  },
};

// ─── SVG Icons ──────────────────────────────────────────────────────────────

function StepIcon({ type }: { type: string }) {
  const color = "#4a90d9";
  switch (type) {
    case "plan":
      return (
        <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <rect x="8" y="6" width="32" height="36" rx="4" stroke={color} strokeWidth="2.5" />
          <line x1="8" y1="16" x2="40" y2="16" stroke={color} strokeWidth="2.5" />
          <circle cx="16" cy="11" r="2" fill={color} />
          <circle cx="24" cy="11" r="2" fill={color} />
          <line x1="14" y1="24" x2="34" y2="24" stroke={color} strokeWidth="2" strokeLinecap="round" />
          <line x1="14" y1="30" x2="30" y2="30" stroke={color} strokeWidth="2" strokeLinecap="round" />
          <line x1="14" y1="36" x2="26" y2="36" stroke={color} strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case "build":
      return (
        <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M14 38L24 12L34 38" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <line x1="18" y1="30" x2="30" y2="30" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="24" cy="38" r="3" fill={color} />
        </svg>
      );
    case "review":
      return (
        <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M10 12C10 9.8 11.8 8 14 8H34C36.2 8 38 9.8 38 12V30C38 32.2 36.2 34 34 34H22L14 42V34H14C11.8 34 10 32.2 10 30V12Z" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <line x1="16" y1="17" x2="32" y2="17" stroke={color} strokeWidth="2" strokeLinecap="round" />
          <line x1="16" y1="23" x2="28" y2="23" stroke={color} strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case "retro":
      return (
        <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <circle cx="24" cy="24" r="16" stroke={color} strokeWidth="2.5" />
          <path d="M24 16V24L30 28" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <line x1="24" y1="4" x2="24" y2="8" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
          <line x1="24" y1="40" x2="24" y2="44" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
          <line x1="4" y1="24" x2="8" y2="24" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
          <line x1="40" y1="24" x2="44" y2="24" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );
    default:
      return null;
  }
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 40 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className={styles.cycleArrow}>
      <line x1="0" y1="8" x2="34" y2="8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <polyline points="28,3 34,8 28,13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

// ─── Metadata ───────────────────────────────────────────────────────────────

export function getMetadata(lang: "en" | "zh"): StyleMetadata {
  const nameMap = { en: "Process Flow", zh: "流程步骤" };
  const themeMap = {
    en: "Agile Methodology Walkthrough — step-by-step visual flow with icon + text pairs and clear section dividers",
    zh: "敏捷方法论演练——图标加文本配对的逐步视觉流程，清晰的分区结构",
  };
  const densityLabelMap = { en: "Medium", zh: "中等" };

  const sceneTitles = {
    en: ["Title", "Sprint Cycle", "Delivery Steps", "Outcomes", "Closing"],
    zh: ["标题", "冲刺循环", "交付步骤", "成果指标", "结语"],
  };

  const beatActions = {
    en: {
      1: ["Title and subtitle appear"],
      2: ["Heading and title appear", "Steps 1-2 populate", "Steps 3-4 populate"],
      3: ["Heading appears", "Steps 1-3 appear", "Steps 4-5 appear"],
      4: ["Title appears", "Metrics populate"],
      5: ["Closing statement revealed"],
    },
    zh: {
      1: ["标题和副标题呈现"],
      2: ["标题呈现", "第 1-2 步填充", "第 3-4 步填充"],
      3: ["标题呈现", "第 1-3 步呈现", "第 4-5 步呈现"],
      4: ["标题呈现", "指标填充"],
      5: ["结语揭示"],
    },
  };

  const BEAT_COUNTS: Record<number, number> = {
    1: 1,
    2: 3,
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
        beatTitle = `${c.title}${c.titleAccent}${c.titleAccent2 || ""}`;
        beatBody = (c.subtitle as string) || "";
      } else if (id === 2) {
        beatTitle = (c.title as string) || "";
        const steps = (c.steps as Array<{ label: string }>) || [];
        const visibleCount = Math.min((beatIdx + 1) * 2, 4);
        beatBody = steps.slice(0, visibleCount).map((s) => s.label).join(" -> ");
      } else if (id === 3) {
        beatTitle = (c.title as string) || "";
        const steps = (c.steps as Array<{ title: string }>) || [];
        const visibleCount = Math.min((beatIdx + 1) * 2 + (beatIdx === 0 ? 1 : 0), 5);
        beatBody = steps.slice(0, visibleCount).map((s) => s.title).join(" / ");
      } else if (id === 4) {
        beatTitle = (c.title as string) || "";
        if (beatIdx >= 1) {
          const metrics = (c.metrics as Array<{ value: string; label: string }>) || [];
          beatBody = metrics.map((m) => `${m.value} ${m.label}`).join(" / ");
        }
      } else if (id === 5) {
        beatTitle = `${c.big}${c.bigAccent}${c.big2}`;
        beatBody = (c.sub as string) || "";
      }

      return { id: beatIdx, action: actions[beatIdx], title: beatTitle, body: beatBody };
    });

    return { id, title: sceneTitles[lang][id - 1], beats };
  });

  return {
    id: "09",
    band: "balanced-hybrid",
    name: nameMap[lang],
    theme: themeMap[lang],
    densityLabel: densityLabelMap[lang],
    heroScene: 3,
    colors: {
      bg: "#f8f9fa",
      ink: "#212529",
      panel: "#ffffff",
    },
    typography: {
      header: "Inter 700",
      body: "Inter 400",
    },
    tags: [
      "process",
      "flow",
      "agile",
      "methodology",
      "steps",
      "workflow",
      "structured",
      "medium-density",
      "clean",
    ],
    fonts: ["Inter"],
    scenes,
  };
}

// ─── Component ──────────────────────────────────────────────────────────────

export default function ProcessFlow({
  scene,
  beat,
  language,
  isThumbnail,
  reducedMotion,
  onNavigate,
}: BespokeStyleProps) {
  useFonts();

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

  const trackClasses = [
    styles.track,
    styles.animateSceneEnter,
  ]
    .filter(Boolean)
    .join(" ");

  // ── Scene renderers ─────────────────────────────────────────────────────

  const renderScene1 = () => {
    const c = SCENES[1][language];
    return (
      <div className={styles.scene1}>
        <span className={styles.eyebrow}>{c.eyebrow as string}</span>
        <h1 className={styles.titleMain}>
          {c.title as string}
          <span className={styles.titleAccent}>{c.titleAccent as string}</span>
          {(c.titleAccent2 as string) && <><br />{c.titleAccent2 as string}</>}
        </h1>
        <p className={styles.titleSub}>{c.subtitle as string}</p>
      </div>
    );
  };

  const renderScene2 = () => {
    const c = SCENES[2][language];
    const steps = (c.steps as Array<{ icon: string; label: string; desc: string }>) || [];
    const visibleCount = Math.min(beat * 2, 4);
    return (
      <div className={styles.scene2}>
        <span className={styles.sceneHeading}>{c.heading as string}</span>
        <h2 className={styles.sceneTitle}>{c.title as string}</h2>
        <div className={styles.cycleRow}>
          {steps.map((step, i) => {
            const visible = i < visibleCount;
            const cls = [
              styles.cycleStep,
              visible ? styles.cycleStepVisible : "",
            ].filter(Boolean).join(" ");
            return (
              <React.Fragment key={i}>
                <div
                  className={cls}
                  style={
                    reducedMotion
                      ? { opacity: visible ? 1 : 0, transform: "none" }
                      : { transitionDelay: `${i * 0.12}s` }
                  }
                >
                  <div className={styles.stepIcon}>
                    <StepIcon type={step.icon} />
                  </div>
                  <span className={styles.stepLabel}>{step.label}</span>
                  <span className={styles.stepDesc}>{step.desc}</span>
                </div>
                {i < steps.length - 1 && <ArrowIcon />}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    );
  };

  const renderScene3 = () => {
    const c = SCENES[3][language];
    const steps = (c.steps as Array<{ num: string; title: string; body: string; badge: string }>) || [];
    const visibleCount = Math.min(beat * 3, steps.length);
    return (
      <div className={styles.scene3}>
        <span className={styles.sceneHeading}>{c.heading as string}</span>
        <h2 className={styles.sceneTitle}>{c.title as string}</h2>
        <div className={styles.stepsContainer}>
          {steps.map((step, i) => {
            const visible = i < visibleCount;
            const cls = [
              styles.stepRow,
              visible ? styles.stepRowVisible : "",
            ].filter(Boolean).join(" ");
            return (
              <div
                key={i}
                className={cls}
                style={
                  reducedMotion
                    ? { opacity: visible ? 1 : 0, transform: "none" }
                    : { transitionDelay: `${i * 0.08}s` }
                }
              >
                <span className={styles.stepNumber}>{step.num}</span>
                <div className={styles.stepContent}>
                  <h3 className={styles.stepTitle}>{step.title}</h3>
                  <p className={styles.stepBody}>{step.body}</p>
                  <span className={styles.stepBadge}>{step.badge}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderScene4 = () => {
    const c = SCENES[4][language];
    const metrics = (c.metrics as Array<{ value: string; label: string; desc: string }>) || [];
    return (
      <div className={styles.scene4}>
        <span className={styles.sceneHeading}>{c.heading as string}</span>
        <h2 className={styles.sceneTitle}>{c.title as string}</h2>
        <div className={styles.metricsGrid}>
          {metrics.map((m, i) => {
            const visible = beat >= 1;
            const cls = [
              styles.metricCard,
              visible ? styles.metricCardVisible : "",
            ].filter(Boolean).join(" ");
            return (
              <div
                key={i}
                className={cls}
                style={
                  reducedMotion
                    ? { opacity: visible ? 1 : 0, transform: "none" }
                    : { transitionDelay: `${i * 0.12}s` }
                }
              >
                <span className={styles.metricValue}>{m.value}</span>
                <span className={styles.metricLabel}>{m.label}</span>
                <span className={styles.metricDesc}>{m.desc}</span>
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
        <h2 className={styles.closingBig}>
          {c.big as string}
          <span>{c.bigAccent as string}</span>
          {c.big2 as string}
        </h2>
        <p className={styles.closingSub}>{c.sub as string}</p>
        <span className={styles.closingTag}>{c.tag as string}</span>
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

  // ── Navigation ──────────────────────────────────────────────────────────

  const renderNav = () => {
    if (isThumbnail) return null;
    return (
      <nav className={styles.navFlow} aria-label="Scene navigation">
        {[1, 2, 3, 4, 5].map((s, i) => {
          const isActive = s === scene;
          const isCompleted = s < scene;
          const nodeClass = [
            styles.navNode,
            isActive ? styles.navNodeActive : "",
            isCompleted ? styles.navNodeCompleted : "",
          ].filter(Boolean).join(" ");
          return (
            <React.Fragment key={s}>
              <button
                type="button"
                className={nodeClass}
                aria-label={`Jump to scene ${s}`}
                onClick={(e) => handleNavClick(e, s)}
              >
                <span className={styles.navNodeDot} />
                <span className={styles.navNodeLabel}>{s}</span>
              </button>
              {i < 4 && (
                <span
                  className={[
                    styles.navConnector,
                    s < scene ? styles.navConnectorActive : "",
                  ].filter(Boolean).join(" ")}
                />
              )}
            </React.Fragment>
          );
        })}
      </nav>
    );
  };

  return (
    <div className={rootClasses}>
      <div
        key={`09-${scene}`}
        className={trackClasses}
        style={reducedMotion ? { animationDuration: "0s" } : undefined}
      >
        {renderSceneContent()}
      </div>
      {renderNav()}
    </div>
  );
}

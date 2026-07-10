import React, { useEffect, useCallback } from "react";
import type { BespokeStyleProps, StyleMetadata } from "../types";
import SpatialSceneTrack from "./SpatialSceneTrack";
import styles from "./09-process-flow.module.css";

// ─── Transition constants ─────────────────────────────────────────────────

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
      eyebrow: "Product Strategy",
      title: "Parallel",
      titleAccent: "Tracks.",
      titleAccent2: "One Destination.",
      subtitle: "How engineering, design, and product streams converge at key milestones to ship value together",
    },
    zh: {
      eyebrow: "产品策略",
      title: "多条轨道，",
      titleAccent: "一个终点。",
      titleAccent2: "",
      subtitle: "工程、设计和产品三条线如何在关键里程碑交汇，共同交付价值",
    },
  },
  2: {
    en: {
      heading: "Transit Lines",
      title: "Four tracks running in parallel",
      steps: [
        { icon: "plan", label: "Engineering", desc: "Core platform, API, infrastructure" },
        { icon: "build", label: "Design", desc: "Design system, UX research, prototyping" },
        { icon: "review", label: "Product", desc: "Roadmap, prioritization, go-to-market" },
        { icon: "retro", label: "Operations", desc: "DevOps, security, compliance" },
      ],
    },
    zh: {
      heading: "地铁线路",
      title: "四条并行轨道",
      steps: [
        { icon: "plan", label: "工程", desc: "核心平台、API、基础设施" },
        { icon: "build", label: "设计", desc: "设计系统、用户研究、原型" },
        { icon: "review", label: "产品", desc: "路线图、优先级、市场推广" },
        { icon: "retro", label: "运营", desc: "DevOps、安全、合规" },
      ],
    },
  },
  3: {
    en: {
      heading: "Transfer Stations",
      title: "Where tracks converge",
      steps: [
        { num: "01", title: "Discovery Sync", body: "All three tracks align on user problems and success metrics before any code is written", badge: "Milestone" },
        { num: "02", title: "Design Handoff", body: "Design system components are production-ready and engineering integrates them", badge: "Milestone" },
        { num: "03", title: "Beta Gate", body: "Product validates market fit, engineering confirms scalability, design polishes UX", badge: "Milestone" },
        { num: "04", title: "Launch Readiness", body: "Operations signs off on reliability, security, and monitoring before GA", badge: "Milestone" },
        { num: "05", title: "Post-Launch Review", body: "All tracks converge to measure outcomes and plan the next iteration cycle", badge: "Milestone" },
      ],
    },
    zh: {
      heading: "换乘站点",
      title: "轨道交汇之处",
      steps: [
        { num: "01", title: "调研同步", body: "三条线在写代码前就用户问题和成功指标达成一致", badge: "里程碑" },
        { num: "02", title: "设计交接", body: "设计系统组件达到生产就绪，工程团队开始集成", badge: "里程碑" },
        { num: "03", title: "Beta 关卡", body: "产品验证市场适配，工程确认可扩展性，设计打磨体验", badge: "里程碑" },
        { num: "04", title: "发布就绪", body: "运营团队在正式发布前确认可靠性、安全性和监控", badge: "里程碑" },
        { num: "05", title: "上线复盘", body: "所有轨道汇聚，衡量成果并规划下一轮迭代", badge: "里程碑" },
      ],
    },
  },
  4: {
    en: {
      heading: "Convergence Metrics",
      title: "Alignment across tracks",
      metrics: [
        { value: "94%", label: "Milestone On-Time", desc: "Transfer stations hit on schedule" },
        { value: "3.1d", label: "Avg. Handoff Time", desc: "Design-to-engineering transfer speed" },
        { value: "87%", label: "Cross-Track Sync", desc: "Teams aligned at each checkpoint" },
      ],
    },
    zh: {
      heading: "汇聚指标",
      title: "跨轨道对齐度",
      metrics: [
        { value: "94%", label: "里程碑准时率", desc: "换乘站按时到达" },
        { value: "3.1天", label: "平均交接时间", desc: "设计到工程的传递速度" },
        { value: "87%", label: "跨轨同步率", desc: "团队在每个检查点保持对齐" },
      ],
    },
  },
  5: {
    en: {
      big: "Converge. ",
      bigAccent: "Align. ",
      big2: "Deliver.",
      sub: "Parallel tracks only work when everyone knows the transfer stations.",
      tag: "Map Your Convergence Points",
    },
    zh: {
      big: "汇聚，",
      bigAccent: "对齐，",
      big2: "交付。",
      sub: "只有当每个人都知道换乘站在哪里，并行轨道才能发挥作用。",
      tag: "绘制你的汇聚点",
    },
  },
};

// ─── SVG Icons ──────────────────────────────────────────────────────────────

function StepIcon({ type }: { type: string }) {
  const color = "#e63946";
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
  const nameMap = { en: "Subway Map of Intent", zh: "意图地铁图" };
  const themeMap = {
    en: "Multi-track Convergence Map — independent streams of intent shown as transit lines that meet at deliberate transfer stations. Best for converging workflows, milestone mapping, and showing how parallel tracks join.",
    zh: "多轨汇聚地图——将独立的意图流展示为在刻意换乘站交汇的地铁线路。最适合展示收敛型工作流、里程碑映射，以及平行轨道如何汇合。",
  };
  const densityLabelMap = { en: "Systematic", zh: "系统化" };

  const sceneTitles = {
    en: ["Title", "Transit Lines", "Transfer Stations", "Milestone Map", "Closing"],
    zh: ["标题", "地铁线路", "换乘站点", "里程碑地图", "结语"],
  };

  const beatActions = {
    en: {
      1: ["Title and subtitle appear"],
      2: ["Heading and title appear", "Lines 1-2 populate", "Lines 3-4 populate"],
      3: ["Heading appears", "Stations 1-3 appear", "Stations 4-5 appear"],
      4: ["Title appears", "Milestones populate"],
      5: ["Closing statement revealed"],
    },
    zh: {
      1: ["标题和副标题呈现"],
      2: ["标题呈现", "第 1-2 条线路填充", "第 3-4 条线路填充"],
      3: ["标题呈现", "第 1-3 站点呈现", "第 4-5 站点呈现"],
      4: ["标题呈现", "里程碑填充"],
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
        beatBody = steps.slice(0, visibleCount).map((s) => s.label).join(" | ");
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
    id: "subway-map-of-intent",
    band: "balanced-hybrid",
    name: nameMap[lang],
    theme: themeMap[lang],
    densityLabel: densityLabelMap[lang],
    heroScene: 3,
    colors: {
      bg: "#f5f5f0",
      ink: "#1a1a1a",
      panel: "#ffffff",
    },
    typography: {
      header: "Inter 600",
      body: "Inter 400",
    },
    tags: [
      "transit-map",
      "subway",
      "multi-track",
      "convergence",
      "systematic",
      "milestone",
      "route",
      "junction",
      "signage",
    ],
    fonts: ["Inter"],
    scenes,
  };
}

// ─── Component ──────────────────────────────────────────────────────────────

const BEAT_LAYOUT_MODES = {
  2: "motion",
  3: "motion",
  4: "motion",
} satisfies Record<number, "motion" | "reserved">;

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

  const renderScene2 = (beatNum: number) => {
    const c = SCENES[2][language];
    const steps = (c.steps as Array<{ icon: string; label: string; desc: string }>) || [];
    const visibleCount = Math.min(beatNum * 2, 4);
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

  const renderScene3 = (beatNum: number) => {
    const c = SCENES[3][language];
    const steps = (c.steps as Array<{ num: string; title: string; body: string; badge: string }>) || [];
    const visibleCount = Math.min(beatNum * 3, steps.length);
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

  const renderScene4 = (beatNum: number) => {
    const c = SCENES[4][language];
    const metrics = (c.metrics as Array<{ value: string; label: string; desc: string }>) || [];
    return (
      <div className={styles.scene4}>
        <span className={styles.sceneHeading}>{c.heading as string}</span>
        <h2 className={styles.sceneTitle}>{c.title as string}</h2>
        <div className={styles.metricsGrid}>
          {metrics.map((m, i) => {
            const visible = beatNum >= 1;
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
            <SpatialSceneTrack
        scene={scene}
        beat={beat}
        transitionKind="slide-y"
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

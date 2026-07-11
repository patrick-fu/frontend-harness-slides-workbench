import React, { useEffect, useCallback } from "react";
import {
  defineTopic,
  type TopicMetadata,
  type TopicStageProps,
} from "../domain/topic";
import SpatialSceneTrack from "../styles/SpatialSceneTrack";
import styles from "./swiss-grid.module.css";
import { useFLIP } from "../hooks/useFLIP";

// ─── Font Injection ────────────────────────────────────────────────────────

function useFonts() {
  useEffect(() => {
    const id = "swiss-grid-fonts";
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
    title?: string;
    subtitle?: string;
    label?: string;
    statement?: string;
    metrics?: Array<{ value: string; unit: string; label: string }>;
    processSteps?: Array<{ id: string; title: string; desc: string }>;
    qualityLabel?: string;
    qualityTitle?: string;
    criteria?: Array<{ name: string; score: number; threshold: number }>;
    closing?: string;
    closingSub?: string;
  };
  zh: {
    title?: string;
    subtitle?: string;
    label?: string;
    statement?: string;
    metrics?: Array<{ value: string; unit: string; label: string }>;
    processSteps?: Array<{ id: string; title: string; desc: string }>;
    qualityLabel?: string;
    qualityTitle?: string;
    criteria?: Array<{ name: string; score: number; threshold: number }>;
    closing?: string;
    closingSub?: string;
  };
}

const SCENES: Record<number, SceneContent> = {
  1: {
    en: {
      title: "Systematic",
      subtitle: "Technical Roadmap & Comparative Analysis Framework",
      label: "GRID SYSTEM / 2026",
    },
    zh: {
      title: "系统化",
      subtitle: "技术路线图与比较分析框架",
      label: "网格系统 / 2026",
    },
  },
  2: {
    en: {
      label: "KEY METRICS",
      statement: "Every variable accounted for.",
      metrics: [
        { value: "0.003", unit: "ms", label: "Latency p99" },
        { value: "99.97", unit: "%", label: "Uptime SLA" },
        { value: "2.4", unit: "M", label: "Requests/sec" },
      ],
    },
    zh: {
      label: "核心指标",
      statement: "每个变量都已计入。",
      metrics: [
        { value: "0.003", unit: "毫秒", label: "p99 延迟" },
        { value: "99.97", unit: "%", label: "可用性 SLA" },
        { value: "2.4", unit: "M", label: "请求/秒" },
      ],
    },
  },
  3: {
    en: {
      label: "MIGRATION SEQUENCE",
      statement: "Five-phase rollout plan",
      processSteps: [
        { id: "minimal-product-keynote", title: "Baseline Capture", desc: "Full system snapshot + dependency graph + traffic baseline" },
        { id: "objective-swiss-grid", title: "Dual-Write Phase", desc: "Shadow traffic to new stack; validate parity across 47 endpoints" },
        { id: "wabi-sabi-ceramic", title: "Canary Release", desc: "5% traffic shift with automated rollback on 1% error threshold" },
        { id: "interactive-dialogue-stage", title: "Progressive Ramp", desc: "25% → 50% → 75% over 14 days; SLO gates at each step" },
        { id: "cyanotype-drafting-table", title: "Cutover & Decommission", desc: "DNS flip + old stack drain + 30-day observability watch" },
      ],
    },
    zh: {
      label: "迁移序列",
      statement: "五阶段上线计划",
      processSteps: [
        { id: "minimal-product-keynote", title: "基线捕获", desc: "完整系统快照 + 依赖图 + 流量基线" },
        { id: "objective-swiss-grid", title: "双写阶段", desc: "影子流量导入新栈；47 个端点逐一验证一致性" },
        { id: "wabi-sabi-ceramic", title: "金丝雀发布", desc: "5% 流量切换，错误率超 1% 自动回滚" },
        { id: "interactive-dialogue-stage", title: "渐进放量", desc: "14 天内 25% → 50% → 75%；每步设 SLO 闸门" },
        { id: "cyanotype-drafting-table", title: "切换与下线", desc: "DNS 翻转 + 旧栈排空 + 30 天可观测性值守" },
      ],
    },
  },
  4: {
    en: {
      qualityLabel: "COMPARATIVE ANALYSIS",
      qualityTitle: "Architecture Options — Evaluation Matrix",
      criteria: [
        { name: "Maintainability", score: 94, threshold: 85 },
        { name: "Performance", score: 97, threshold: 90 },
        { name: "Cost Efficiency", score: 89, threshold: 80 },
        { name: "Team Velocity", score: 92, threshold: 85 },
      ],
    },
    zh: {
      qualityLabel: "比较分析",
      qualityTitle: "架构方案——评估矩阵",
      criteria: [
        { name: "可维护性", score: 94, threshold: 85 },
        { name: "性能表现", score: 97, threshold: 90 },
        { name: "成本效率", score: 89, threshold: 80 },
        { name: "团队速度", score: 92, threshold: 85 },
      ],
    },
  },
  5: {
    en: {
      closing: "Clarity is a system.",
      closingSub: "Grid-aligned · Data-grounded · Since 2019",
    },
    zh: {
      closing: "清晰，是一种系统。",
      closingSub: "网格对齐 · 数据为据 · 始于 2019",
    },
  },
};

// ─── Metadata ───────────────────────────────────────────────────────────────

function buildMetadata(lang: "en" | "zh"): TopicMetadata {
  const themeMap = {
    en: "A precision instrument — every element locked to a visible mathematical grid; for data-dense decks, technical roadmaps, and comparative analyses where systematic clarity matters",
    zh: "精密仪器——每个元素锁定于可见的数学网格；适用于数据密集型演示、技术路线图和比较分析",
  };
  const densityLabelMap = { en: "Structured", zh: "结构化" };

  const sceneTitles = {
    en: ["Title", "Key Metrics", "Inspection Protocol", "Quality Dashboard", "Closing"],
    zh: ["标题", "核心指标", "检验流程", "质量仪表", "结语"],
  };

  const beatActions = {
    en: {
      1: ["Title and subtitle appear"],
      2: ["Statement appears", "Metrics populate"],
      3: ["Steps 1-2 appear", "Steps 3-4 appear", "Step 5 appears"],
      4: ["Dashboard header", "Quality bars animate in"],
      5: ["Closing statement"],
    },
    zh: {
      1: ["标题和副标题呈现"],
      2: ["陈述呈现", "指标填充"],
      3: ["步骤 1-2 呈现", "步骤 3-4 呈现", "步骤 5 呈现"],
      4: ["仪表标题", "质量条动画呈现"],
      5: ["结语陈述"],
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
        beatTitle = c.title || "";
        beatBody = c.subtitle || "";
      } else if (id === 2) {
        beatTitle = c.statement || "";
        beatBody = beatIdx >= 1 ? (c.metrics || []).map((m) => `${m.value}${m.unit} ${m.label}`).join(" / ") : "";
      } else if (id === 3) {
        const visibleSteps = (c.processSteps || []).slice(0, Math.min((beatIdx + 1) * 2, 5));
        beatTitle = c.statement || "";
        beatBody = visibleSteps.map((s) => `${s.id} ${s.title}`).join(" / ");
      } else if (id === 4) {
        beatTitle = c.qualityTitle || "";
        beatBody = beatIdx >= 1 ? (c.criteria || []).map((cr) => `${cr.name}: ${cr.score}%`).join(" / ") : "";
      } else if (id === 5) {
        beatTitle = c.closing || "";
        beatBody = c.closingSub || "";
      }

      return { id: beatIdx, action: actions[beatIdx], title: beatTitle, body: beatBody };
    });

    return { id, title: sceneTitles[lang][id - 1], beats };
  });

  return {
    theme: themeMap[lang],
    densityLabel: densityLabelMap[lang],
    heroScene: 3,
    colors: { bg: "#fafafa", ink: "#111111", panel: "#eeeeee" },
    typography: { header: "Inter 700", body: "Inter 400" },
    tags: ["swiss", "grid", "achromatic", "objective", "systematic", "data-dense", "technical", "flush-left", "grotesque"],
    fonts: ["Inter"],
    scenes,
  };
}

const metadata = {
  en: buildMetadata("en"),
  zh: buildMetadata("zh"),
};

// ─── Transition constants ─────────────────────────────────────────────────

// ─── Component ──────────────────────────────────────────────────────────────

const BEAT_LAYOUT_MODES = {
  2: "motion",
  3: "motion",
  4: "motion",
} satisfies Record<number, "motion" | "reserved">;

function TopicStage({
  scene,
  beat,
  language,
  isThumbnail,
  reducedMotion,
  onNavigate,
}: TopicStageProps) {
  useFonts();

  // FLIP for scene 3 process step list
  const { ref: processListRef } = useFLIP<HTMLDivElement>({
    watch: [beat],
    duration: 400,
    easing: "cubic-bezier(0.16, 1, 0.3, 1)",
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
    isThumbnail ? styles.thumbnail : "",
  ].filter(Boolean).join(" ");

  const renderScene1 = (_beatNum: number) => {
    const c = SCENES[1][language];
    return (
      <div className={styles.scene1}>
        <div className={styles.gridLines}>
          {[...Array(12)].map((_, i) => (
            <div key={i} className={styles.gridLineV} style={{ left: `${(i + 1) * 8.33}%` }} />
          ))}
          {[...Array(6)].map((_, i) => (
            <div key={i} className={styles.gridLineH} style={{ top: `${(i + 1) * 16.67}%` }} />
          ))}
        </div>
        <span className={styles.cornerMark} style={{ top: "3cqh", left: "3cqw" }}>+</span>
        <span className={styles.cornerMark} style={{ top: "3cqh", right: "3cqw" }}>+</span>
        <span className={styles.cornerMark} style={{ bottom: "3cqh", left: "3cqw" }}>+</span>
        <span className={styles.cornerMark} style={{ bottom: "3cqh", right: "3cqw" }}>+</span>
        <div className={styles.titleBlock}>
          <span className={styles.label}>{c.label}</span>
          <h1 className={styles.heroTitle}>{c.title}</h1>
          <div className={styles.redRule} />
          <p className={styles.subtitle}>{c.subtitle}</p>
        </div>
      </div>
    );
  };

  const renderScene2 = (beatNum: number) => {
    const c = SCENES[2][language];
    return (
      <div className={styles.scene2}>
        <span className={styles.sectionLabel}>{c.label}</span>
        <h2 className={styles.metricStatement}>{c.statement}</h2>
        <div className={styles.metricRow}>
          {(c.metrics || []).map((m, i) => (
            <div
              key={i}
              className={styles.metricBlock}
              style={{
                opacity: beatNum >= 1 ? 1 : 0,
                transform: beatNum >= 1 ? "none" : "translateX(-2cqw)",
                transition: reducedMotion ? "none" : `opacity 0.4s ease ${i * 0.12}s, transform 0.4s ease ${i * 0.12}s`,
              }}
            >
              <span className={styles.metricValue}>
                {m.value}<span className={styles.metricUnit}>{m.unit}</span>
              </span>
              <span className={styles.metricLabel}>{m.label}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderScene3 = (beatNum: number, applyFlip: boolean) => {
    const c = SCENES[3][language];
    const steps = c.processSteps || [];
    const visibleCount = Math.min((beatNum + 1) * 2, 5);
    return (
      <div className={styles.scene3}>
        <span className={styles.sectionLabel}>{c.label}</span>
        <h2 className={styles.processTitle}>{c.statement}</h2>
        <div ref={applyFlip ? processListRef : undefined} className={styles.processList}>
          {steps.map((step, i) => {
            const visible = i < visibleCount;
            return (
              <div
                key={i}
                className={styles.processStep}
                style={{
                  opacity: visible ? 1 : 0,
                  transform: visible ? "none" : "translateX(-2cqw)",
                  transition: reducedMotion ? "none" : `opacity 0.4s ease ${i * 0.08}s, transform 0.4s ease ${i * 0.08}s`,
                }}
              >
                <span className={styles.stepId}>{step.id}</span>
                <div className={styles.stepContent}>
                  <h3 className={styles.stepTitle}>{step.title}</h3>
                  <p className={styles.stepDesc}>{step.desc}</p>
                </div>
                <div className={styles.stepConnector} />
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderScene4 = (beatNum: number) => {
    const c = SCENES[4][language];
    const criteria = c.criteria || [];
    return (
      <div className={styles.scene4}>
        <span className={styles.sectionLabel}>{c.qualityLabel}</span>
        <h2 className={styles.dashboardTitle}>{c.qualityTitle}</h2>
        <div className={styles.qualityBars}>
          {criteria.map((cr, i) => {
            const visible = beatNum >= 1;
            const barWidth = visible ? (cr.score / 100) * 100 : 0;
            return (
              <div
                key={i}
                className={styles.qualityRow}
                style={{
                  transition: reducedMotion ? "none" : `opacity 0.4s ease ${i * 0.1}s`,
                }}
              >
                <span className={styles.qualityName}>{cr.name}</span>
                <div className={styles.qualityBarTrack}>
                  <div
                    className={styles.qualityBarFill}
                    style={{
                      width: reducedMotion ? `${barWidth}%` : `${barWidth}%`,
                      transition: reducedMotion ? "none" : `width 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${0.2 + i * 0.1}s`,
                      background: cr.score >= cr.threshold ? "var(--style-02-accent, #d32f2f)" : "var(--style-02-ink, #1a1a1a)",
                    }}
                  />
                  <div
                    className={styles.qualityThreshold}
                    style={{ left: `${cr.threshold}%` }}
                  />
                </div>
                <span className={styles.qualityScore}>{cr.score}%</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderScene5 = (_beatNum: number) => {
    const c = SCENES[5][language];
    return (
      <div className={styles.scene5}>
        <div className={styles.closingBlock}>
          <div className={styles.redRuleLarge} />
          <h2 className={styles.closingText}>{c.closing}</h2>
          <p className={styles.closingSub}>{c.closingSub}</p>
        </div>
      </div>
    );
  };

  const renderSceneFor = (sceneNum: number, beatNum: number, applyFlip: boolean = false) => {
    switch (sceneNum) {
      case 1: return renderScene1(beatNum);
      case 2: return renderScene2(beatNum);
      case 3: return renderScene3(beatNum, applyFlip);
      case 4: return renderScene4(beatNum);
      case 5: return renderScene5(beatNum);
      default: return null;
    }
  };

  const renderNav = () => {
    if (isThumbnail) return null;
    return (
      <nav
        className={styles.nav}
        aria-label="Scene navigation"
        data-topic-navigation="true"
        data-navigation-geometry="edge-scale"
        data-navigation-carrier="grid-axis"
        data-navigation-invocation="persistent"
        data-navigation-feedback="material-color-change"
      >
        <span className={styles.navTrack} />
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

  // ── Build layer classes ─────────────────────────────────────────────────

  return (
    <div className={rootClasses}>
            <SpatialSceneTrack
        scene={scene}
        beat={beat}
        transitionKind="wipe"
        reducedMotion={reducedMotion || isThumbnail}
        beatLayoutModes={BEAT_LAYOUT_MODES}
        renderScene={(sceneId, sceneBeat, isActive) => (
          <div className={styles.sceneLayer}>
            <div className={styles.track}>
              {renderSceneFor(sceneId, sceneBeat, isActive)}
            </div>
          </div>
        )}
      />

      {/* Sweep rule: 2px red horizontal line that travels top→bottom */}

      {renderNav()}
    </div>
  );
}

export default defineTopic({
  id: "swiss-grid",
  styleId: "objective-swiss-grid",
  title: { en: "Swiss Grid", zh: "瑞士网格" },
  modelId: "Doubao-Seed-Evolving",
  Stage: TopicStage,
  metadata,
  navigation: {
    geometry: "edge-scale",
    carrier: "grid-axis",
    invocation: "persistent",
    feedback: "material-color-change",
  },
  transitionScore: {
    "1->2": "wipe",
    "2->3": "wipe",
    "3->4": "wipe",
    "4->5": "wipe",
  },
  evidence: {
    kind: "illustrative",
    boundary: {
      en: "Illustrative quality dashboard: the metrics, thresholds, and workflow are presentation examples, not measured operational results.",
      zh: "示例质量仪表盘：指标、阈值与流程均为演示示例，并非实测运营结果。",
    },
    display: "envelope",
  },
});

import React, { useEffect, useState, useCallback } from "react";
import {
  defineTopic,
  type TopicMetadata,
  type TopicNavigation,
  type TopicStageProps,
  type TopicTransitionScore,
} from "../domain/topic";
import SpatialSceneTrack from "../components/stage/SpatialSceneTrack";
import styles from "./debug-board.module.css";
import { useFLIP } from "../hooks/useFLIP";

// ─── Font Injection ────────────────────────────────────────────────────────

function useFonts() {
  useEffect(() => {
    const id = "debug-board-fonts";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&display=swap";
    document.head.appendChild(link);
  }, []);
}

// ─── Content ────────────────────────────────────────────────────────────────

const SCENES = {
  1: {
    en: {
      industry: "SYS-0x4F2A",
      customer: "frontend-harness",
      logo: ">_",
      eyebrow: "Diagnostic Report",
      title: "Debug Reaction",
      titleAccent: "Board",
      title2: "Status Overview",
      sub: "Real-time diagnostic dashboard tracking system health, open incidents, and remediation progress. Every signal color-coded for instant triage.",
    },
    zh: {
      industry: "系统 SYS-0x4F2A",
      customer: "frontend-harness",
      logo: ">_",
      eyebrow: "诊断报告",
      title: "调试反应",
      titleAccent: "面板",
      title2: "状态总览",
      sub: "实时诊断仪表板，追踪系统健康度、未解决事件和修复进度。每个信号按颜色编码，可即时分类处理。",
    },
  },
  2: {
    en: {
      label: "Active Signals",
      title: "Diagnostic Items",
      quote: "[WARN] cpu_spike detected on render-worker-3 — sustained 94% for 120s, threshold 75%. Investigating root cause.",
      authorName: "system.log",
      authorRole: "diagnostic daemon v2.4.1",
      authorInitials: "$_",
      points: [
        { status: "critical", title: "Render Worker Crash", desc: "worker-3 OOM at 94% CPU, 120s sustained — auto-restart triggered" },
        { status: "warning", title: "Bundle Size Regressions", desc: "main.js +18% above baseline, tree-shaking audit pending" },
        { status: "info", title: "Accessibility Score", desc: "Lighthouse a11y: 92/100, 3 contrast issues flagged" },
      ],
    },
    zh: {
      label: "活跃信号",
      title: "诊断项",
      quote: "[警告] render-worker-3 检测到 CPU 飙升——持续 94% 达 120 秒，阈值 75%。正在调查根本原因。",
      authorName: "system.log",
      authorRole: "诊断守护进程 v2.4.1",
      authorInitials: "$_",
      points: [
        { status: "critical", title: "渲染进程崩溃", desc: "worker-3 内存溢出 94% CPU，持续 120 秒——已触发自动重启" },
        { status: "warning", title: "包体积回归", desc: "main.js 超出基线 +18%，tree-shaking 审计待处理" },
        { status: "info", title: "无障碍评分", desc: "Lighthouse 无障碍: 92/100，标记 3 个对比度问题" },
      ],
    },
  },
  3: {
    en: {
      label: "Remediation",
      title: "Before / After",
      before: [
        { icon: "✕", text: "Uncaught promise rejections" },
        { icon: "✕", text: "Memory leak in list virtualization" },
        { icon: "✕", text: "Race condition on theme toggle" },
        { icon: "✕", text: "Missing error boundaries" },
      ],
      after: [
        { icon: "✓", text: "Global unhandled rejection handler" },
        { icon: "✓", text: "IntersectionObserver unmount fix" },
        { icon: "✓", text: "Atomic CSS-in-JS theme swap" },
        { icon: "✓", text: "Route-level error fallback UI" },
      ],
    },
    zh: {
      label: "修复方案",
      title: "之前 / 之后",
      before: [
        { icon: "✕", text: "未捕获的 Promise 拒绝" },
        { icon: "✕", text: "列表虚拟化内存泄漏" },
        { icon: "✕", text: "主题切换竞态条件" },
        { icon: "✕", text: "缺少错误边界" },
      ],
      after: [
        { icon: "✓", text: "全局未处理拒绝处理器" },
        { icon: "✓", text: "IntersectionObserver 卸载修复" },
        { icon: "✓", text: "原子化 CSS-in-JS 主题切换" },
        { icon: "✓", text: "路由级错误回退界面" },
      ],
    },
  },
  4: {
    en: {
      label: "Resolution Summary",
      title: "System Health",
      metrics: [
        { value: "47", unit: "", label: "Issues Resolved", desc: "this sprint, 12 critical" },
        { value: "2.4", unit: "m", label: "Avg Response", desc: "MTTR from alert to fix" },
        { value: "98.7", unit: "%", label: "Uptime SLA", desc: "30-day rolling window" },
      ],
      quote: "[INFO] All diagnostic checks passed. 0 blocking issues. System health indicator: GREEN. Next scheduled scan in 06:00:00.",
      quoteAttr: "— diagnostic-daemon, auto-generated",
    },
    zh: {
      label: "解决摘要",
      title: "系统健康度",
      metrics: [
        { value: "47", unit: "", label: "已解决问题", desc: "本迭代，含 12 个严重项" },
        { value: "2.4", unit: "分", label: "平均响应", desc: "从告警到修复的 MTTR" },
        { value: "98.7", unit: "%", label: "可用性 SLA", desc: "30 天滚动窗口" },
      ],
      quote: "[信息] 所有诊断检查通过。0 个阻塞问题。系统健康指标：绿色。下次计划扫描在 06:00:00。",
      quoteAttr: "—— diagnostic-daemon，自动生成",
    },
  },
  5: {
    en: {
      text: "All systems <em>nominal</em>.",
      sub: "Diagnostic cycle complete. Run another check anytime to verify current state.",
      cta: "Run Diagnostic",
    },
    zh: {
      text: "所有系统<em>正常</em>。",
      sub: "诊断周期完成。随时运行另一次检查以验证当前状态。",
      cta: "运行诊断",
    },
  },
};

// ─── Metadata ───────────────────────────────────────────────────────────────

function buildMetadata(lang: "en" | "zh"): TopicMetadata {
  const themeMap = {
    en: "Dark IDE diagnostic dashboard — traffic-light status vocabulary, monospaced throughout, color-coded diagnostic items with explicit state indicators",
    zh: "深色 IDE 诊断仪表板——红绿灯状态词汇、全程等宽字体、带明确状态指示的彩色诊断项",
  };
  const densityLabelMap = { en: "Diagnostic", zh: "诊断型" };

  const sceneTitles = {
    en: ["Status", "Signals", "Remediation", "Health", "Nominal"],
    zh: ["状态", "信号", "修复", "健康度", "正常"],
  };

  const beatActions = {
    en: {
      1: ["System ID and diagnostic title appear"],
      2: ["Log excerpt and daemon appear", "Critical + warning signals reveal", "Info signal reveals"],
      3: ["Title appears", "Before/after remediation panels reveal"],
      4: ["Title appears", "Health metric cards animate in", "System log confirmation fades in"],
      5: ["All-systems-nominal statement and run-diagnostic CTA appear"],
    },
    zh: {
      1: ["系统 ID 和诊断标题呈现"],
      2: ["日志摘要和守护进程呈现", "严重 + 警告信号揭示", "信息信号揭示"],
      3: ["标题呈现", "前后修复对比面板揭示"],
      4: ["标题呈现", "健康指标卡片动画进入", "系统日志确认淡入"],
      5: ["全部系统正常声明和运行诊断 CTA 呈现"],
    },
  };

  const BEAT_COUNTS: Record<number, number> = { 1: 1, 2: 3, 3: 2, 4: 3, 5: 1 };

  const scenes = [1, 2, 3, 4, 5].map((id) => {
    const beatCount = BEAT_COUNTS[id];
    const actions = beatActions[lang][id as keyof (typeof beatActions)["en"]];
    const c = SCENES[id as keyof typeof SCENES][lang] as any;

    const beats = Array.from({ length: beatCount }, (_, beatIdx) => {
      let beatTitle = "";
      let beatBody = "";

      if (id === 1) {
        beatTitle = `${c.title} ${c.titleAccent} ${c.title2}`;
        beatBody = c.sub;
      } else if (id === 2) {
        beatTitle = c.title;
        if (beatIdx === 0) beatBody = c.quote.slice(0, 60) + "...";
        else if (beatIdx >= 1) {
          const pts = (c.points as Array<{ title: string }>) || [];
          const visible = Math.min(beatIdx + 1, 3);
          beatBody = pts.slice(0, visible).map((p) => p.title).join(" / ");
        }
      } else if (id === 3) {
        beatTitle = c.title;
        if (beatIdx >= 1) {
          beatBody = lang === "en" ? "Before vs After remediation shown" : "展示修复前后对比";
        }
      } else if (id === 4) {
        beatTitle = c.title;
        if (beatIdx >= 1) {
          const metrics = (c.metrics as Array<{ value: string; unit: string; label: string }>) || [];
          const visible = Math.min(beatIdx, 3);
          beatBody = metrics.slice(0, visible).map((m) => `${m.value}${m.unit} ${m.label}`).join(" / ");
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
    theme: themeMap[lang],
    densityLabel: densityLabelMap[lang],
    heroScene: 4,
    colors: { bg: "#0d1117", ink: "#c9d1d9", panel: "#161b22" },
    typography: { header: "JetBrains Mono 500", body: "JetBrains Mono 400" },
    tags: ["debug", "diagnostic", "status-board", "risk-assessment", "self-check", "developer"],
    fonts: ["JetBrains Mono"],
    scenes,
  };
}

// ─── Transition constants ─────────────────────────────────────────────────

const metadata = {
  en: buildMetadata("en"),
  zh: buildMetadata("zh"),
} satisfies { en: TopicMetadata; zh: TopicMetadata };

const NAVIGATION = {
  geometry: "edge-scale",
  carrier: "debug-board-scene-dots",
  invocation: "persistent",
  feedback: "active-glow",
} as const satisfies TopicNavigation;

const TRANSITION_SCORE = {
  "1->2": "hard-cut",
  "2->3": "hard-cut",
  "3->4": "hard-cut",
  "4->5": "hard-cut",
} as const satisfies TopicTransitionScore;

// ─── Component ──────────────────────────────────────────────────────────────

const BEAT_LAYOUT_MODES = {
  2: "motion",
  3: "motion",
  4: "motion",
} satisfies Record<number, "motion" | "reserved">;

function TopicStage({
  scene, beat, language, isThumbnail, reducedMotion, onNavigate, }: TopicStageProps) {
  useFonts();

    const [entered, setEntered] = useState(false);

  // Beat-level "entered" state for current scene — triggers CSS reveals
  useEffect(() => {
    setEntered(false);
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => setEntered(true));
    });
    return () => cancelAnimationFrame(id);
  }, [scene]);

  // FLIP for problem points list (scene 2) — when new points push layout
  const { ref: problemPointsRef } = useFLIP<HTMLDivElement>({
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

  const rootClasses = [styles.root, reducedMotion ? styles.reducedMotion : "", isThumbnail ? styles.thumbnail : ""].filter(Boolean).join(" ");

  // ── Render scene content for a given scene number ────────────────────────

  const renderSceneFor = (sceneNum: number, beatNum: number, isEntered: boolean) => {
    const langKey = language as keyof typeof SCENES[1];

    if (sceneNum === 1) {
      const c = SCENES[1][langKey];
      return (
        <div className={styles.scene1}>
          <div className={styles.caseCustomer}>
            <div className={styles.customerLogo}>{c.logo}</div>
            <div className={styles.customerInfo}>
              <span className={styles.customerIndustry}>{c.industry}</span>
              <span className={styles.customerName}>{c.customer}</span>
            </div>
          </div>
          <span className={styles.caseEyebrow}>{c.eyebrow}</span>
          <h1 className={styles.caseTitle}>
            {c.title} <em>{c.titleAccent}</em> {c.title2}
          </h1>
          <p className={styles.caseSub}>{c.sub}</p>
        </div>
      );
    }

    if (sceneNum === 2) {
      const c = SCENES[2][langKey];
      const points = c.points as Array<{ status: string; title: string; desc: string }>;
      return (
        <div className={styles.scene2}>
          <span className={styles.sectionLabel}>{c.label}</span>
          <h2 className={styles.sectionTitle}>{c.title}</h2>
          <div className={styles.problemArea}>
            <div className={styles.problemQuote}>
              <p className={styles.quoteText}>{c.quote}</p>
              <div className={styles.quoteAuthor}>
                <div className={styles.quoteAvatar}>{c.authorInitials}</div>
                <div className={styles.quoteAuthorInfo}>
                  <span className={styles.quoteAuthorName}>{c.authorName}</span>
                  <span className={styles.quoteAuthorRole}>{c.authorRole}</span>
                </div>
              </div>
            </div>
            <div ref={sceneNum === scene ? problemPointsRef : undefined} className={styles.problemPoints}>
              {points.map((p, i) => {
                const visible = beatNum >= i;
                const cls = [styles.problemPoint, visible && isEntered ? styles.problemPointVisible : ""].filter(Boolean).join(" ");
                const statusCls = p.status === "critical" ? styles.statusCritical : p.status === "warning" ? styles.statusWarning : styles.statusInfo;
                return (
                  <div
                    key={i}
                    className={cls}
                    style={reducedMotion ? { opacity: visible ? 1 : 0, transform: "none" } : { transitionDelay: `${i * 0.12}s` }}
                  >
                    <div className={[styles.problemIcon, statusCls].filter(Boolean).join(" ")}>
                      <span className={styles.statusDot} />
                    </div>
                    <div className={styles.problemText}>
                      <span className={styles.problemPointTitle}>{p.title}</span>
                      <span className={styles.problemPointDesc}>{p.desc}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      );
    }

    if (sceneNum === 3) {
      const c = SCENES[3][langKey];
      const before = c.before as Array<{ icon: string; text: string }>;
      const after = c.after as Array<{ icon: string; text: string }>;
      const panelsVisible = beatNum >= 1;
      return (
        <div className={styles.scene3}>
          <span className={styles.sectionLabel}>{c.label}</span>
          <h2 className={styles.sectionTitle}>{c.title}</h2>
          <div className={styles.solutionArea}>
            <div
              className={[styles.solutionBefore, panelsVisible && isEntered ? styles.solutionBeforeVisible : ""].filter(Boolean).join(" ")}
              style={reducedMotion ? { opacity: panelsVisible ? 1 : 0, transform: "none" } : undefined}
            >
              <div className={styles.solutionPanelHeader}>
                {language === "zh" ? "之前" : "Before"}
              </div>
              <div className={styles.solutionPanelBody}>
                {before.map((item, i) => (
                  <div key={i} className={styles.solutionItem}>
                    <span className={styles.solutionItemIcon}>{item.icon}</span>
                    {item.text}
                  </div>
                ))}
              </div>
            </div>
            <div
              className={[styles.solutionAfter, panelsVisible && isEntered ? styles.solutionAfterVisible : ""].filter(Boolean).join(" ")}
              style={reducedMotion ? { opacity: panelsVisible ? 1 : 0, transform: "none" } : { transitionDelay: "0.15s" }}
            >
              <div className={styles.solutionPanelHeader}>
                {language === "zh" ? "之后" : "After"}
              </div>
              <div className={styles.solutionPanelBody}>
                {after.map((item, i) => (
                  <div key={i} className={styles.solutionItem}>
                    <span className={styles.solutionItemIcon}>{item.icon}</span>
                    {item.text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (sceneNum === 4) {
      const c = SCENES[4][langKey];
      const metrics = c.metrics as Array<{ value: string; unit: string; label: string; desc: string }>;
      const quoteVisible = beatNum >= 2;
      return (
        <div className={styles.scene4}>
          <span className={styles.sectionLabel}>{c.label}</span>
          <h2 className={styles.sectionTitle}>{c.title}</h2>
          <div className={styles.resultsArea}>
            <div className={styles.metricsRow}>
              {metrics.map((m, i) => {
                const visible = beatNum >= 1;
                const cls = [styles.metricCard, visible && isEntered ? styles.metricCardVisible : ""].filter(Boolean).join(" ");
                return (
                  <div
                    key={i}
                    className={cls}
                    style={reducedMotion ? { opacity: visible ? 1 : 0, transform: "none" } : { transitionDelay: `${i * 0.15}s` }}
                  >
                    <span className={styles.metricValue}>
                      {m.value}
                      <span className={styles.metricUnit}>{m.unit}</span>
                    </span>
                    <span className={styles.metricLabel}>{m.label}</span>
                    <span className={styles.metricDesc}>{m.desc}</span>
                  </div>
                );
              })}
            </div>
            <div
              className={[styles.resultsQuote, quoteVisible && isEntered ? styles.resultsQuoteVisible : ""].filter(Boolean).join(" ")}
              style={reducedMotion ? { opacity: quoteVisible ? 1 : 0, transform: "none" } : undefined}
            >
              <p className={styles.resultsQuoteText}>{c.quote}</p>
              <span className={styles.resultsQuoteAttr}>{c.quoteAttr}</span>
            </div>
          </div>
        </div>
      );
    }

    if (sceneNum === 5) {
      const c = SCENES[5][langKey];
      return (
        <div className={styles.scene5}>
          <h2 className={styles.closingCase} dangerouslySetInnerHTML={{ __html: c.text }} />
          <p className={styles.closingCaseSub}>{c.sub}</p>
          <button type="button" className={styles.closingCTA} onClick={(e) => { if (!isThumbnail) e.stopPropagation(); }}>
            {c.cta}
            <svg width="1.5cqw" height="1.5cqh" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      );
    }

    return null;
  };

  const renderNav = () => {
    if (isThumbnail) return null;
    return (
      <nav
        className={styles.navDots}
        aria-label="Scene navigation"
        data-topic-navigation="true"
        data-navigation-geometry={NAVIGATION.geometry}
        data-navigation-carrier={NAVIGATION.carrier}
        data-navigation-invocation={NAVIGATION.invocation}
        data-navigation-feedback={NAVIGATION.feedback}
      >
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
        transitionKind="hard-cut"
        reducedMotion={reducedMotion || isThumbnail}
        beatLayoutModes={BEAT_LAYOUT_MODES}
        renderScene={(sceneId, sceneBeat, isActive) => (
          <div className={styles.sceneLayer}>
            <div className={styles.track}>
              {renderSceneFor(sceneId, sceneBeat, isActive ? entered : true)}
            </div>
          </div>
        )}
      />

      {renderNav()}
    </div>
  );
}

export default defineTopic({
  id: "debug-board",
  styleId: "debug-reaction-board",
  title: { en: "Debug Board", zh: "调试面板" },
  modelId: "Doubao-Seed-Evolving",
  Stage: TopicStage,
  metadata,
  navigation: NAVIGATION,
  transitionScore: TRANSITION_SCORE,
  evidence: {
    kind: "illustrative",
    boundary: {
      en: "Illustrative diagnostic dashboard: incidents, metrics, logs, identifiers, and remediation outcomes are presentation examples, not live system status.",
      zh: "示例诊断仪表板：事故、指标、日志、标识符和修复结果均为演示内容，并非实时系统状态。",
    },
    display: "envelope",
  },
});

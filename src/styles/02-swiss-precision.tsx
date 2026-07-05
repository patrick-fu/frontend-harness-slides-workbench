import React, { useLayoutEffect, useEffect, useCallback, useState, useRef } from "react";
import type { BespokeStyleProps, StyleMetadata } from "../types";
import styles from "./02-swiss-precision.module.css";
import { useFLIP } from "../hooks/useFLIP";

// ─── Font Injection ────────────────────────────────────────────────────────

function useFonts() {
  useEffect(() => {
    const id = "style-02-fonts";
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
      title: "Precision",
      subtitle: "Manufacturing Quality Control System",
      label: "SWISS MADE / 2026",
    },
    zh: {
      title: "精密",
      subtitle: "制造质量控制系统",
      label: "瑞士制造 / 2026",
    },
  },
  2: {
    en: {
      label: "KEY METRICS",
      statement: "Every micron counts.",
      metrics: [
        { value: "0.003", unit: "mm", label: "Tolerance" },
        { value: "99.97", unit: "%", label: "First-pass yield" },
        { value: "2.4", unit: "σ", label: "Process capability" },
      ],
    },
    zh: {
      label: "核心指标",
      statement: "每一微米都至关重要。",
      metrics: [
        { value: "0.003", unit: "毫米", label: "公差" },
        { value: "99.97", unit: "%", label: "一次通过率" },
        { value: "2.4", unit: "σ", label: "过程能力" },
      ],
    },
  },
  3: {
    en: {
      label: "INSPECTION PROTOCOL",
      statement: "Five-gate verification process",
      processSteps: [
        { id: "01", title: "Incoming Material", desc: "Spectrometer alloy verification + dimensional sampling" },
        { id: "02", title: "In-Process CMM", desc: "Coordinate measuring machine probes 47 reference points" },
        { id: "03", title: "Surface Finish", desc: "Ra < 0.4 μm verified via white-light interferometry" },
        { id: "04", title: "Functional Test", desc: "Full load-cycle simulation at 150% rated capacity" },
        { id: "05", title: "Final Audit", desc: "ISO 9001:2015 compliance documentation review" },
      ],
    },
    zh: {
      label: "检验流程",
      statement: "五关验证流程",
      processSteps: [
        { id: "01", title: "来料检验", desc: "光谱仪合金验证 + 尺寸抽样" },
        { id: "02", title: "过程三坐标", desc: "三坐标测量机探测 47 个基准点" },
        { id: "03", title: "表面光洁度", desc: "白光干涉仪验证 Ra < 0.4 μm" },
        { id: "04", title: "功能测试", desc: "150% 额定负载全循环模拟" },
        { id: "05", title: "最终审核", desc: "ISO 9001:2015 合规文件审查" },
      ],
    },
  },
  4: {
    en: {
      qualityLabel: "LIVE QUALITY DASHBOARD",
      qualityTitle: "Shift Report — Line A",
      criteria: [
        { name: "Dimensional Accuracy", score: 99.8, threshold: 99.5 },
        { name: "Surface Integrity", score: 99.4, threshold: 99.0 },
        { name: "Assembly Tolerance", score: 99.9, threshold: 99.5 },
        { name: "Material Hardness", score: 98.7, threshold: 98.0 },
      ],
    },
    zh: {
      qualityLabel: "实时质量仪表",
      qualityTitle: "班次报告 — A 线",
      criteria: [
        { name: "尺寸精度", score: 99.8, threshold: 99.5 },
        { name: "表面完整性", score: 99.4, threshold: 99.0 },
        { name: "装配公差", score: 99.9, threshold: 99.5 },
        { name: "材料硬度", score: 98.7, threshold: 98.0 },
      ],
    },
  },
  5: {
    en: {
      closing: "Perfection is not optional.",
      closingSub: "ISO 9001:2015 Certified · Since 1962",
    },
    zh: {
      closing: "完美，不容妥协。",
      closingSub: "ISO 9001:2015 认证 · 始于 1962",
    },
  },
};

// ─── Metadata ───────────────────────────────────────────────────────────────

export function getMetadata(lang: "en" | "zh"): StyleMetadata {
  const nameMap = { en: "Swiss Precision", zh: "瑞士精密" };
  const themeMap = {
    en: "Manufacturing Quality Control — Swiss International Style grid system with monochrome discipline",
    zh: "制造质量控制——瑞士国际风格网格系统，单色纪律",
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
    id: "02",
    band: "minimal-keynote",
    name: nameMap[lang],
    theme: themeMap[lang],
    densityLabel: densityLabelMap[lang],
    heroScene: 3,
    colors: { bg: "#f5f5f5", ink: "#1a1a1a", panel: "#e8e8e8" },
    typography: { header: "Helvetica Neue 75", body: "Inter 400" },
    tags: ["swiss", "grid", "monochrome", "red-accent", "manufacturing", "precise", "structured", "technical", "helvetica"],
    fonts: ["Inter"],
    scenes,
  };
}

// ─── Transition constants ─────────────────────────────────────────────────

const TRANSITION_DURATION = 700; // ms — rule-draw sweep
const BEAT_COUNTS: Record<number, number> = { 1: 1, 2: 2, 3: 3, 4: 2, 5: 1 };

// ─── Component ──────────────────────────────────────────────────────────────

export default function SwissPrecision({
  scene,
  beat,
  language,
  isThumbnail,
  reducedMotion,
  onNavigate,
  isTransitionClone,
}: BespokeStyleProps) {
  useFonts();

  const [outgoingScene, setOutgoingScene] = useState<number | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const prevSceneRef = useRef<number>(scene);

  // Detect scene changes and manage transition lifecycle
  useLayoutEffect(() => {
    const prev = prevSceneRef.current;
    if (prev !== scene && !reducedMotion) {
      setOutgoingScene(prev);
      setIsTransitioning(true);
      const timer = setTimeout(() => {
        setOutgoingScene(null);
        setIsTransitioning(false);
      }, TRANSITION_DURATION);
      prevSceneRef.current = scene;
      return () => clearTimeout(timer);
    }
    prevSceneRef.current = scene;
  }, [scene, reducedMotion]);

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
      <nav className={styles.nav} aria-label="Scene navigation">
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

  const outgoingLayerClasses = [
    styles.sceneLayer,
    styles.exitAnim,
  ].filter(Boolean).join(" ");

  const incomingLayerClasses = [
    styles.sceneLayer,
    isTransitioning && !isTransitionClone ? styles.enterAnim : "",
  ].filter(Boolean).join(" ");

  return (
    <div className={rootClasses}>
      {/* Outgoing scene (exit: stays visible then fades in last 200ms) */}
      {outgoingScene !== null && (
        <div className={outgoingLayerClasses}>
          <div className={styles.track}>
            {renderSceneFor(outgoingScene, BEAT_COUNTS[outgoingScene] - 1)}
          </div>
        </div>
      )}

      {/* Incoming / current scene (enter: clip-path reveal from top) */}
      <div className={incomingLayerClasses}>
        <div key={`02-${scene}`} className={styles.track}>
          {renderSceneFor(scene, beat, true)}
        </div>
      </div>

      {/* Sweep rule: 2px red horizontal line that travels top→bottom */}
      {isTransitioning && !reducedMotion && (
        <div className={styles.sweepRule} />
      )}

      {renderNav()}
    </div>
  );
}

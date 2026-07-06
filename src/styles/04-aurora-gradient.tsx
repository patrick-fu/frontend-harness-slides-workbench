import React, { useEffect, useCallback } from "react";
import type { BespokeStyleProps, StyleMetadata } from "../types";
import SpatialSceneTrack from "./SpatialSceneTrack";
import { useFLIP } from "../hooks/useFLIP";
import styles from "./04-aurora-gradient.module.css";

// ─── Font Injection ────────────────────────────────────────────────────────

function useFonts() {
  useEffect(() => {
    const id = "style-04-fonts";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@300;400;500&display=swap";
    document.head.appendChild(link);
  }, []);
}

// ─── Content ────────────────────────────────────────────────────────────────

interface SceneContent {
  en: {
    title?: string;
    subtitle?: string;
    question?: string;
    response?: string;
    reasoningTitle?: string;
    reasoningSteps?: string[];
    dialogueLabel?: string;
    exchanges?: Array<{ speaker: string; role: string; text: string; warm: boolean }>;
    closing?: string;
    closingSub?: string;
    principles?: Array<{ label: string; value: string; icon: string }>;
  };
  zh: {
    title?: string;
    subtitle?: string;
    question?: string;
    response?: string;
    reasoningTitle?: string;
    reasoningSteps?: string[];
    dialogueLabel?: string;
    exchanges?: Array<{ speaker: string; role: string; text: string; warm: boolean }>;
    closing?: string;
    closingSub?: string;
    principles?: Array<{ label: string; value: string; icon: string }>;
  };
}

const SCENES: Record<number, SceneContent> = {
  1: {
    en: {
      title: "Dialogue",
      subtitle: "Human & Machine, Thinking Together",
    },
    zh: {
      title: "对话",
      subtitle: "人与机器，共同思考",
    },
  },
  2: {
    en: {
      question: "How do we decide when data runs out?",
      response:
        "I surface what the data says. You bring judgment and context. The gap between us is where the best decisions live.",
    },
    zh: {
      question: "当数据不足时，我们如何做决策？",
      response: "我呈现数据所说的。你带来判断和上下文。我们之间的间隙，正是最佳决策诞生之处。",
    },
  },
  3: {
    en: {
      reasoningTitle: "Clarifying before acting",
      reasoningSteps: [
        "Frame the question precisely — what are we actually deciding?",
        "Surface relevant patterns and constraints from available data",
        "Identify what the data cannot answer — where judgment is needed",
      ],
    },
    zh: {
      reasoningTitle: "先澄清，再行动",
      reasoningSteps: [
        "精确框定问题——我们究竟在决定什么？",
        "从可用数据中呈现相关模式和约束",
        "识别数据无法回答的部分——哪里需要判断",
      ],
    },
  },
  4: {
    en: {
      dialogueLabel: "A Working Exchange",
      exchanges: [
        {
          speaker: "Human",
          role: "Product Lead",
          text: "The model is confident but the edge cases concern me.",
          warm: true,
        },
        {
          speaker: "AI",
          role: "Assistant",
          text: "Three edge cases account for 12% of failures. Want me to surface them?",
          warm: false,
        },
        {
          speaker: "Human",
          role: "Product Lead",
          text: "Yes, and flag which ones need domain expertise to resolve.",
          warm: true,
        },
        {
          speaker: "AI",
          role: "Assistant",
          text: "Marked. Two need regulatory context I don't have. Over to you.",
          warm: false,
        },
      ],
    },
    zh: {
      dialogueLabel: "一次工作对话",
      exchanges: [
        { speaker: "人", role: "产品负责人", text: "模型很自信，但边缘案例让我担心。", warm: true },
        { speaker: "AI", role: "助手", text: "三个边缘案例占失败的 12%。要我呈现它们吗？", warm: false },
        { speaker: "人", role: "产品负责人", text: "好的，标出哪些需要领域专长才能解决。", warm: true },
        { speaker: "AI", role: "助手", text: "已标记。两个需要我没有的监管上下文。交给你了。", warm: false },
      ],
    },
  },
  5: {
    en: {
      closing: "Better together than either alone.",
      closingSub: "A dialogue, not a monologue.",
      principles: [
        { label: "Clarity First", value: "Ask before answer", icon: "◇" },
        { label: "Human Judgment", value: "Context matters most", icon: "◈" },
        { label: "Machine Speed", value: "Patterns at scale", icon: "◆" },
      ],
    },
    zh: {
      closing: "同行，胜于独行。",
      closingSub: "是对话，不是独白。",
      principles: [
        { label: "清晰为先", value: "先提问，再回答", icon: "◇" },
        { label: "人类判断", value: "上下文最重要", icon: "◈" },
        { label: "机器速度", value: "规模化发现模式", icon: "◆" },
      ],
    },
  },
};

// ─── Metadata ───────────────────────────────────────────────────────────────

export function getMetadata(lang: "en" | "zh"): StyleMetadata {
  const nameMap = { en: "Interactive Dialogue Stage", zh: "互动对话舞台" };
  const themeMap = {
    en: "A small dim theater where two voices take turns — human-AI collaboration, Q&A exchanges, and conversational storytelling where the back-and-forth itself is the point",
    zh: "一座小型昏暗剧场，两个声音轮流登场——人机协作、问答交流、对话式叙事，来回本身即是意义",
  };
  const densityLabelMap = { en: "Conversational", zh: "对话式" };

  const sceneTitles = {
    en: ["Title", "Opening Exchange", "Reasoning Steps", "Working Dialogue", "Closing"],
    zh: ["标题", "开场对话", "推理步骤", "工作对话", "结语"],
  };

  const beatActions = {
    en: {
      1: ["Title with stage glow"],
      2: ["Human question posed", "AI response illuminates"],
      3: ["Reasoning title appears", "Steps reveal sequentially"],
      4: ["Exchange label + first two turns", "Third turn appears", "Fourth turn appears"],
      5: ["Closing statement", "Principles reveal"],
    },
    zh: {
      1: ["标题配舞台光晕"],
      2: ["人类提出问题", "AI 回应点亮"],
      3: ["推理标题呈现", "步骤依次揭示"],
      4: ["对话标签 + 前两轮", "第三轮呈现", "第四轮呈现"],
      5: ["结语陈述", "原则揭示"],
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
        beatTitle = beatIdx >= 1 ? c.response || "" : c.question || "";
        beatBody = "";
      } else if (id === 3) {
        beatTitle = c.reasoningTitle || "";
        const visibleSteps = (c.reasoningSteps || []).slice(0, Math.min((beatIdx + 1) * 2, 3));
        beatBody = visibleSteps.join(" / ");
      } else if (id === 4) {
        beatTitle = c.dialogueLabel || "";
        const visibleCount = Math.min(beatIdx + 2, 4);
        const visibleEx = (c.exchanges || []).slice(0, visibleCount);
        beatBody = visibleEx.map((e) => `${e.speaker}: ${e.text.slice(0, 30)}`).join(" / ");
      } else if (id === 5) {
        beatTitle = c.closing || "";
        beatBody = beatIdx >= 1 ? (c.principles || []).map((p) => p.label).join(" / ") : c.closingSub || "";
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
    heroScene: 4,
    colors: { bg: "#0e1116", ink: "#e4e8ed", panel: "#161b22" },
    typography: { header: "JetBrains Mono 500", body: "Inter 400" },
    tags: ["dialogue", "conversational", "turn-taking", "two-voice", "stage", "console", "human-AI", "interactive", "exchange"],
    fonts: ["Inter", "JetBrains Mono"],
    scenes,
  };
}

// ─── Component ──────────────────────────────────────────────────────────────

const BEAT_LAYOUT_MODES = {
  2: "motion",
  3: "motion",
  4: "motion",
  5: "motion",
} satisfies Record<number, "motion" | "reserved">;

export default function AuroraGradient({
  scene,
  beat,
  language,
  isThumbnail,
  reducedMotion,
  onNavigate,
}: BespokeStyleProps) {
  useFonts();

  // ── Transition state ────────────────────────────────────────────────────

  // ── FLIP for scene 4 exchange list ──────────────────────────────────────
  const { ref: exchangeFlipRef } = useFLIP<HTMLDivElement>({
    watch: [beat],
    duration: 450,
    easing: "cubic-bezier(0.16, 1, 0.3, 1)",
    selector: `.${styles.exchangeCard}`,
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

  // ── Persistent stage lighting background (shared across all scenes) ─────
  const renderStageBg = () => (
    <div className={styles.auroraBg} aria-hidden="true">
      <div className={`${styles.auroraBlob} ${styles.auroraBlob1}`} />
      <div className={`${styles.auroraBlob} ${styles.auroraBlob2}`} />
      <div className={`${styles.auroraBlob} ${styles.auroraBlob3}`} />
    </div>
  );

  // ── Scene renderers (parameterized) ─────────────────────────────────────

  const renderScene1 = (sceneNum: number) => {
    const c = SCENES[sceneNum][language];
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

  const renderScene2 = (beatNum: number) => {
    const c = SCENES[2][language];
    const humanLabel = language === "zh" ? "人类" : "HUMAN";
    const aiLabel = language === "zh" ? "机器" : "AI";
    return (
      <div className={styles.scene2}>
        <div className={styles.exchangePair}>
          {/* Human question — warm side */}
          <div className={styles.turnBlock} style={{ opacity: 1 }}>
            <span className={`${styles.turnLabel} ${styles.turnWarm}`}>{humanLabel}</span>
            <p className={styles.turnText}>{c.question}</p>
          </div>
          {/* AI response — cool side */}
          <div
            className={`${styles.turnBlock} ${styles.turnResponse}`}
            style={{
              opacity: beatNum >= 1 ? 1 : 0,
              transform: beatNum >= 1 ? "none" : "translateY(2cqh)",
              transition: reducedMotion ? "none" : "opacity 0.6s ease 0.2s, transform 0.6s ease 0.2s",
            }}
          >
            <span className={`${styles.turnLabel} ${styles.turnCool}`}>{aiLabel}</span>
            <p className={styles.turnText}>{c.response}</p>
          </div>
        </div>
      </div>
    );
  };

  const renderScene3 = (beatNum: number) => {
    const c = SCENES[3][language];
    const steps = c.reasoningSteps || [];
    return (
      <div className={styles.scene3}>
        <h3 className={styles.chartTitle}>{c.reasoningTitle}</h3>
        <div className={styles.reasoningContainer}>
          {steps.map((step, i) => {
            const visible = i < Math.min((beatNum + 1) * 2, 3);
            return (
              <div
                key={i}
                className={styles.reasoningStep}
                style={{
                  opacity: visible ? 1 : 0,
                  transform: visible ? "none" : "translateX(-2cqw)",
                  transition: reducedMotion ? "none" : `opacity 0.5s ease ${0.1 + i * 0.12}s, transform 0.5s ease ${0.1 + i * 0.12}s`,
                }}
              >
                <span className={styles.stepNumber}>{String(i + 1).padStart(2, "0")}</span>
                <p className={styles.stepText}>{step}</p>
              </div>
            );
          })}
        </div>
        <div className={styles.chartLegend}>
          <span className={styles.legendItem}>
            <span className={styles.legendDot} style={{ background: "var(--style-04-warm, #d4a574)" }} />
            {language === "zh" ? "人类判断" : "Human judgment"}
          </span>
          <span className={styles.legendItem}>
            <span className={styles.legendDot} style={{ background: "var(--style-04-cool, #58a6ff)" }} />
            {language === "zh" ? "机器推理" : "Machine reasoning"}
          </span>
        </div>
      </div>
    );
  };

  const renderScene4 = (beatNum: number, applyFlip: boolean) => {
    const c = SCENES[4][language];
    const exchanges = c.exchanges || [];
    const visibleCount = Math.min(beatNum + 2, 4);
    return (
      <div className={styles.scene4}>
        <h3 className={styles.regionTitle}>{c.dialogueLabel}</h3>
        <div
          ref={applyFlip ? exchangeFlipRef : undefined}
          className={styles.regionGrid}
        >
          {exchanges.map((ex, i) => {
            const visible = i < visibleCount;
            return (
              <div
                key={i}
                className={`${styles.regionCard} ${styles.exchangeCard} ${ex.warm ? styles.exchangeWarm : styles.exchangeCool}`}
                style={{
                  opacity: visible ? 1 : 0,
                  transform: visible ? "none" : "scale(0.95)",
                  transition: reducedMotion ? "none" : `opacity 0.5s ease ${i * 0.15}s, transform 0.5s ease ${i * 0.15}s`,
                }}
              >
                <div className={styles.regionHeader}>
                  <span className={styles.regionName}>{ex.speaker}</span>
                  <span className={styles.regionStatus}>{ex.role}</span>
                </div>
                <p className={styles.exchangeText}>{ex.text}</p>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderScene5 = (beatNum: number) => {
    const c = SCENES[5][language];
    return (
      <div className={styles.scene5}>
        <h2 className={styles.forecast}>{c.closing}</h2>
        <p className={styles.forecastSub}>{c.closingSub}</p>
        <div className={styles.forecastMetrics}>
          {(c.principles || []).map((p, i) => (
            <div
              key={i}
              className={styles.forecastMetric}
              style={{
                opacity: beatNum >= 1 ? 1 : 0,
                transform: beatNum >= 1 ? "none" : "translateY(1cqh)",
                transition: reducedMotion ? "none" : `opacity 0.5s ease ${0.1 + i * 0.12}s, transform 0.5s ease ${0.1 + i * 0.12}s`,
              }}
            >
              <span className={styles.forecastIcon}>{p.icon}</span>
              <span className={styles.forecastValue}>{p.value}</span>
              <span className={styles.forecastLabel}>{p.label}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderSceneFor = (sceneNum: number, beatNum: number, applyFlip: boolean) => {
    switch (sceneNum) {
      case 1: return renderScene1(sceneNum);
      case 2: return renderScene2(beatNum);
      case 3: return renderScene3(beatNum);
      case 4: return renderScene4(beatNum, applyFlip);
      case 5: return renderScene5(beatNum);
      default: return null;
    }
  };

  const renderNav = () => {
    if (isThumbnail) return null;

    // Dialogue palette: warm amber, cool blue, muted slate, soft teal, pale rose
    const sceneColors = ["#d4a574", "#58a6ff", "#8b949e", "#7dc4a8", "#c9a0c4"];
    const radius = 3.5;
    const total = 5;

    return (
      <nav className={styles.nav} aria-label="Scene navigation">
        <div className={styles.colorWheel}>
          {[1, 2, 3, 4, 5].map((s, i) => {
            const isActive = s === scene;
            const angle = (i / total) * 2 * Math.PI - Math.PI / 2;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            const color = sceneColors[i];
            return (
              <button
                key={s}
                type="button"
                className={[
                  styles.wheelSegment,
                  isActive ? styles.wheelSegmentActive : "",
                ].filter(Boolean).join(" ")}
                aria-label={`Jump to scene ${s}`}
                onClick={(e) => handleNavClick(e, s)}
                style={{
                  left: `calc(50% + ${x}cqw)`,
                  top: `calc(50% + ${y}cqw)`,
                  background: color,
                  boxShadow: isActive
                    ? `0 0 1.5cqw ${color}, 0 0 3cqw ${color}80`
                    : `0 0 0.5cqw ${color}40`,
                }}
              />
            );
          })}
          <div className={styles.wheelHub} aria-hidden="true" />
        </div>
      </nav>
    );
  };

  // ── Build layer classes ─────────────────────────────────────────────────

  return (
    <div className={rootClasses}>
      {/* Persistent stage lighting background (shared, not part of transition) */}
      {renderStageBg()}

            <SpatialSceneTrack
        scene={scene}
        beat={beat}
        axis="x"
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

      {renderNav()}
    </div>
  );
}

import React, { useEffect, useState, useRef, useCallback } from "react";
import type { BespokeStyleProps, StyleMetadata } from "../types";
import styles from "./03-zen-void.module.css";

// ─── Content ────────────────────────────────────────────────────────────────

interface SceneContent {
  en: {
    kanji?: string;
    word?: string;
    subtitle?: string;
    concept?: string;
    body?: string;
    practice?: string;
    practiceSteps?: string[];
    closing?: string;
    seal?: string;
  };
  zh: {
    kanji?: string;
    word?: string;
    subtitle?: string;
    concept?: string;
    body?: string;
    practice?: string;
    practiceSteps?: string[];
    closing?: string;
    seal?: string;
  };
}

const SCENES: Record<number, SceneContent> = {
  1: {
    en: {
      kanji: "禅",
      word: "Zen",
      subtitle: "Technology & Mindfulness",
    },
    zh: {
      kanji: "禅",
      word: "Zen",
      subtitle: "科技与正念",
    },
  },
  2: {
    en: {
      kanji: "間",
      word: "Ma — The Space Between",
      concept: "Silence is not empty. It is full of meaning.",
      body: "In the pause between notifications, in the breath between responses, lies the quality of attention that defines great work.",
    },
    zh: {
      kanji: "間",
      word: "間——之间的空间",
      concept: "静默并非空洞，而是充满意义。",
      body: "在通知的间隙，在回应之间的呼吸里，蕴藏着定义卓越工作的专注品质。",
    },
  },
  3: {
    en: {
      kanji: "侘",
      word: "Wabi — Humble Simplicity",
      concept: "Beauty in imperfection, grace in restraint.",
      body: "The most elegant solutions are rarely the loudest. They emerge from deep understanding and disciplined omission.",
    },
    zh: {
      kanji: "侘",
      word: "侘——谦逊的简朴",
      concept: "不完美中的美，克制中的优雅。",
      body: "最优雅的解决方案往往不是最张扬的。它们源于深刻的理解和有纪律的取舍。",
    },
  },
  4: {
    en: {
      practice: "Daily Practice",
      practiceSteps: [
        "Begin each session with three conscious breaths",
        "Close one tab before opening another",
        "Schedule 25 minutes of uninterrupted focus",
        "End the day by writing one thing you learned",
      ],
    },
    zh: {
      practice: "日常修习",
      practiceSteps: [
        "每次开始前做三次有意识的呼吸",
        "关闭一个标签页再打开另一个",
        "安排 25 分钟的不间断专注",
        "每天结束写下一件学到的事",
      ],
    },
  },
  5: {
    en: {
      kanji: "和",
      closing: "Harmony begins within.",
      seal: "印",
    },
    zh: {
      kanji: "和",
      closing: "和谐始于内心。",
      seal: "印",
    },
  },
};

// ─── Metadata ───────────────────────────────────────────────────────────────

export function getMetadata(lang: "en" | "zh"): StyleMetadata {
  const nameMap = { en: "Zen Void", zh: "禅空" };
  const themeMap = {
    en: "Tech Mindfulness — Japanese wabi-sabi aesthetics with massive negative space and brush stroke accents",
    zh: "科技正念——日本侘寂美学，大量留白与笔触点缀",
  };
  const densityLabelMap = { en: "Ultra-Sparse", zh: "极疏" };

  const sceneTitles = {
    en: ["Title", "Ma — Space", "Wabi — Simplicity", "Daily Practice", "Closing"],
    zh: ["标题", "間——空间", "侘——简朴", "日常修习", "结语"],
  };

  const beatActions = {
    en: {
      1: ["Kanji and title fade in"],
      2: ["Kanji and concept appear", "Body text reveals"],
      3: ["Kanji and concept appear", "Body text reveals"],
      4: ["Title appears", "Steps 1-2 appear", "Steps 3-4 appear"],
      5: ["Closing kanji and statement"],
    },
    zh: {
      1: ["汉字和标题淡入"],
      2: ["汉字和概念呈现", "正文揭示"],
      3: ["汉字和概念呈现", "正文揭示"],
      4: ["标题呈现", "步骤 1-2 呈现", "步骤 3-4 呈现"],
      5: ["结语汉字和陈述"],
    },
  };

  const BEAT_COUNTS: Record<number, number> = {
    1: 1,
    2: 2,
    3: 2,
    4: 3,
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
        beatTitle = `${c.kanji} ${c.word}`;
        beatBody = c.subtitle || "";
      } else if (id === 2 || id === 3) {
        beatTitle = `${c.kanji} ${c.word}`;
        beatBody = beatIdx >= 1 ? c.body || "" : c.concept || "";
      } else if (id === 4) {
        beatTitle = c.practice || "";
        const visibleSteps = (c.practiceSteps || []).slice(0, Math.min((beatIdx + 1) * 2, 4));
        beatBody = visibleSteps.join(" / ");
      } else if (id === 5) {
        beatTitle = `${c.kanji} ${c.closing}`;
        beatBody = "";
      }

      return { id: beatIdx, action: actions[beatIdx], title: beatTitle, body: beatBody };
    });

    return { id, title: sceneTitles[lang][id - 1], beats };
  });

  return {
    id: "03",
    band: "minimal-keynote",
    name: nameMap[lang],
    theme: themeMap[lang],
    densityLabel: densityLabelMap[lang],
    heroScene: 2,
    colors: { bg: "#1a1a1a", ink: "#f0ece4", panel: "#242424" },
    typography: { header: "Noto Serif JP 400", body: "Inter 300" },
    tags: ["zen", "wabi-sabi", "japanese", "minimal", "sparse", "dark", "mindfulness", "brush-stroke", "serene"],
    fonts: ["Inter", "cjk:Noto Serif SC", "cjk:Noto Serif JP"],
    scenes,
  };
}

// ─── Component ──────────────────────────────────────────────────────────────

export default function ZenVoid({
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
      requestAnimationFrame(() => setEntered(true));
    });
    return () => cancelAnimationFrame(id);
  }, [scene]);

  // Font loading
  useEffect(() => {
    if (document.getElementById("style-03-fonts")) return;
    const link = document.createElement("link");
    link.id = "style-03-fonts";
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@400;700&family=Noto+Serif+SC:wght@400;700&display=swap";
    document.head.appendChild(link);
  }, []);

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

  const renderScene1 = () => {
    const c = SCENES[1][language];
    return (
      <div className={styles.sceneCenter}>
        <svg className={styles.brushStroke} viewBox="0 0 200 60" preserveAspectRatio="xMidYMid meet">
          <path
            d="M10,30 Q30,10 60,25 T110,28 T170,22 T195,30"
            fill="none"
            stroke="var(--style-03-ink, #f0ece4)"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.3"
          />
        </svg>
        <span className={styles.kanji} style={{ opacity: entered ? 1 : 0, transition: reducedMotion ? "none" : "opacity 2s ease" }}>
          {c.kanji}
        </span>
        <span className={styles.word}>{c.word}</span>
        <div className={styles.verticalLine} />
        <p className={styles.subtitle}>{c.subtitle}</p>
      </div>
    );
  };

  const renderConceptScene = (sceneNum: number) => {
    const c = SCENES[sceneNum][language];
    return (
      <div className={styles.sceneConcept}>
        <div className={styles.kanjiColumn}>
          <span
            className={styles.kanjiLarge}
            style={{
              opacity: entered ? 1 : 0,
              transform: entered ? "none" : "translateY(2cqh)",
              transition: reducedMotion ? "none" : "opacity 1.5s ease, transform 1.5s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            {c.kanji}
          </span>
          <svg className={styles.brushVertical} viewBox="0 0 20 200" preserveAspectRatio="xMidYMid meet">
            <line x1="10" y1="10" x2="10" y2="190" stroke="var(--style-03-ink, #f0ece4)" strokeWidth="0.5" opacity="0.2" strokeDasharray="4 6" />
          </svg>
        </div>
        <div className={styles.textContent}>
          <h2 className={styles.conceptWord}>{c.word}</h2>
          <p className={styles.conceptText}>{c.concept}</p>
          {beat >= 1 && (
            <p
              className={styles.bodyText}
              style={{
                opacity: entered ? 0.6 : 0,
                transform: entered ? "none" : "translateY(1cqh)",
                transition: reducedMotion ? "none" : "opacity 1s ease 0.3s, transform 1s ease 0.3s",
              }}
            >
              {c.body}
            </p>
          )}
        </div>
      </div>
    );
  };

  const renderScene4 = () => {
    const c = SCENES[4][language];
    const steps = c.practiceSteps || [];
    return (
      <div className={styles.scenePractice}>
        <div className={styles.ensoCircle}>
          <svg viewBox="0 0 100 100" className={styles.ensoSvg}>
            <circle
              cx="50" cy="50" r="38"
              fill="none"
              stroke="var(--style-03-ink, #f0ece4)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="200 40"
              opacity="0.25"
              style={{
                strokeDashoffset: entered ? 0 : 240,
                transition: reducedMotion ? "none" : "stroke-dashoffset 2s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            />
          </svg>
        </div>
        <h2 className={styles.practiceTitle}>{c.practice}</h2>
        <ul className={styles.practiceList}>
          {steps.map((step, i) => {
            const visible = i < Math.min((beat + 1) * 2, 4);
            return (
              <li
                key={i}
                className={styles.practiceItem}
                style={{
                  opacity: visible && entered ? 1 : 0,
                  transform: visible && entered ? "none" : "translateX(-1cqw)",
                  transition: reducedMotion ? "none" : `opacity 0.8s ease ${i * 0.15}s, transform 0.8s ease ${i * 0.15}s`,
                }}
              >
                <span className={styles.practiceDot}>·</span>
                {step}
              </li>
            );
          })}
        </ul>
      </div>
    );
  };

  const renderScene5 = () => {
    const c = SCENES[5][language];
    return (
      <div className={styles.sceneClosing}>
        <span
          className={styles.kanjiClosing}
          style={{
            opacity: entered ? 1 : 0,
            transition: reducedMotion ? "none" : "opacity 2s ease",
          }}
        >
          {c.kanji}
        </span>
        <h2 className={styles.closingStatement}>{c.closing}</h2>
        <span className={styles.seal}>{c.seal}</span>
      </div>
    );
  };

  const renderSceneContent = () => {
    switch (scene) {
      case 1: return renderScene1();
      case 2: return renderConceptScene(2);
      case 3: return renderConceptScene(3);
      case 4: return renderScene4();
      case 5: return renderScene5();
      default: return null;
    }
  };

  const renderNav = () => {
    if (isThumbnail) return null;
    return (
      <nav className={styles.nav} aria-label="Scene navigation">
        {[1, 2, 3, 4, 5].map((s) => {
          const isActive = s === scene;
          return (
            <button
              key={s}
              type="button"
              className={[styles.navDot, isActive ? styles.navDotActive : ""].filter(Boolean).join(" ")}
              aria-label={`Jump to scene ${s}`}
              onClick={(e) => handleNavClick(e, s)}
            >
              <span className={styles.navDotInner} />
            </button>
          );
        })}
      </nav>
    );
  };

  return (
    <div className={rootClasses}>
      <div
        ref={trackRef}
        key={`03-${scene}`}
        className={[styles.track, entered ? styles.trackActive : styles.trackEnter].filter(Boolean).join(" ")}
        style={reducedMotion ? { transitionDuration: "0s" } : undefined}
      >
        {renderSceneContent()}
      </div>
      {renderNav()}
    </div>
  );
}

import React, { useLayoutEffect, useCallback, useRef, useState } from "react";
import type { BespokeStyleProps, StyleMetadata } from "../types";
import { useFLIP } from "../hooks/useFLIP";
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
      kanji: "器",
      word: "Vessel",
      subtitle: "Craft & Contemplation",
    },
    zh: {
      kanji: "器",
      word: "器",
      subtitle: "工艺与沉思",
    },
  },
  2: {
    en: {
      kanji: "間",
      word: "Ma — The Space Between",
      concept: "Silence is not empty. It is full of meaning.",
      body: "In the pause between making and using, in the breath between response and reaction, lies the quality of attention that defines great craft.",
    },
    zh: {
      kanji: "間",
      word: "間——之间的空间",
      concept: "静默并非空洞，而是充满意义。",
      body: "在制作与使用之间的停顿，在回应与反应之间的呼吸，蕴藏着定义卓越工艺的专注品质。",
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
      practice: "The Craft Practice",
      practiceSteps: [
        "Begin each session with three conscious breaths",
        "Make one thing at a time, with full attention",
        "Leave space for the work to reveal itself",
        "End by cleaning your tools and your space",
      ],
    },
    zh: {
      practice: "工艺修习",
      practiceSteps: [
        "每次开始前做三次有意识的呼吸",
        "一次只做一件事，全神贯注",
        "留出空间，让作品自己显现",
        "结束时清洁工具和空间",
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

const MAX_BEAT: Record<number, number> = {
  1: 0,
  2: 1,
  3: 1,
  4: 2,
  5: 0,
};

const TRANSITION_DURATION = 900;

// ─── Metadata ───────────────────────────────────────────────────────────────

export function getMetadata(lang: "en" | "zh"): StyleMetadata {
  const nameMap = { en: "Wabi-Sabi Ceramic", zh: "侘寂陶器" };
  const themeMap = {
    en: "An unglazed ceramic bowl on a worn wooden table — reflective openings, philosophical framing, and craft-led storytelling where silence is honored",
    zh: "磨损木桌上的一只素陶碗——反思性开场、哲学性叙事、工艺导向的故事讲述，静默被尊崇",
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
        const visibleSteps = (c.practiceSteps || []).slice(0, Math.min(beatIdx * 2, 4));
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
    colors: { bg: "#f5f0e8", ink: "#3d3529", panel: "#ebe5d8" },
    typography: { header: "Noto Serif JP 400", body: "Inter 300" },
    tags: ["wabi-sabi", "earthen", "ceramic", "handmade", "contemplative", "warm", "asymmetric", "ma", "craft"],
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
  isTransitionClone,
}: BespokeStyleProps) {
  // Font loading
  useLayoutEffect(() => {
    if (document.getElementById("style-03-fonts")) return;
    const link = document.createElement("link");
    link.id = "style-03-fonts";
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@400;700&family=Noto+Serif+SC:wght@400;700&display=swap";
    document.head.appendChild(link);
  }, []);

  // ── Transition state ────────────────────────────────────────────────────
  const transitionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [transitionInfo, setTransitionInfo] = useState({
    outgoingScene: null as number | null,
    isTransitioning: false,
    lastScene: scene,
  });

  // Synchronous derivation — sets transition state in the SAME render cycle
  // as the scene prop change. Eliminates the 1-frame gap where the incoming
  // scene is visible without its enter animation class.
  if (transitionInfo.lastScene !== scene) {
    if (transitionTimerRef.current) {
      clearTimeout(transitionTimerRef.current);
    }

    if (!reducedMotion) {
      transitionTimerRef.current = setTimeout(() => {
        setTransitionInfo(function(prev) {
          return { outgoingScene: null, isTransitioning: false, lastScene: prev.lastScene };
        });
      }, TRANSITION_DURATION);

      setTransitionInfo({
        outgoingScene: transitionInfo.lastScene,
        isTransitioning: true,
        lastScene: scene,
      });
    } else {
      setTransitionInfo({
        outgoingScene: null,
        isTransitioning: false,
        lastScene: scene,
      });
    }
  }

  const outgoingScene = transitionInfo.outgoingScene;
  const isTransitioning = transitionInfo.isTransitioning;

  // ── FLIP for scene 4 practice list ──────────────────────────────────────
  const { ref: practiceFlipRef } = useFLIP<HTMLUListElement>({
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

  // ── Scene renderers (parameterized by sceneNum / beatNum) ───────────────

  const renderScene1 = (sceneNum: number) => {
    const c = SCENES[sceneNum][language];
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
        <span className={styles.kanji}>
          {c.kanji}
        </span>
        <span className={styles.word}>{c.word}</span>
        <div className={styles.verticalLine} />
        <p className={styles.subtitle}>{c.subtitle}</p>
      </div>
    );
  };

  const renderConceptScene = (sceneNum: number, beatNum: number) => {
    const c = SCENES[sceneNum][language];
    return (
      <div className={styles.sceneConcept}>
        <div className={styles.kanjiColumn}>
          <span className={styles.kanjiLarge}>
            {c.kanji}
          </span>
          <svg className={styles.brushVertical} viewBox="0 0 20 200" preserveAspectRatio="xMidYMid meet">
            <line x1="10" y1="10" x2="10" y2="190" stroke="var(--style-03-ink, #f0ece4)" strokeWidth="0.5" opacity="0.2" strokeDasharray="4 6" />
          </svg>
        </div>
        <div className={styles.textContent}>
          <h2 className={styles.conceptWord}>{c.word}</h2>
          <p className={styles.conceptText}>{c.concept}</p>
          {beatNum >= 1 && (
            <p className={[styles.bodyText, reducedMotion ? "" : styles.beatReveal].filter(Boolean).join(" ")}>
              {c.body}
            </p>
          )}
        </div>
      </div>
    );
  };

  const renderScene4 = (beatNum: number, applyFlip: boolean) => {
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
                strokeDashoffset: 0,
                transition: reducedMotion ? "none" : "stroke-dashoffset 2s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            />
          </svg>
        </div>
        <h2 className={styles.practiceTitle}>{c.practice}</h2>
        <ul
          ref={applyFlip ? practiceFlipRef : undefined}
          className={styles.practiceList}
        >
          {steps.map((step, i) => {
            const visible = i < Math.min(beatNum * 2, 4);
            return (
              <li
                key={i}
                className={styles.practiceItem}
                style={{
                  opacity: visible ? 1 : 0,
                  transform: visible ? "none" : "translateX(-1cqw)",
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

  const renderScene5 = (sceneNum: number) => {
    const c = SCENES[sceneNum][language];
    return (
      <div className={styles.sceneClosing}>
        <span className={styles.kanjiClosing}>
          {c.kanji}
        </span>
        <h2 className={styles.closingStatement}>{c.closing}</h2>
        <span className={styles.seal}>{c.seal}</span>
      </div>
    );
  };

  const renderSceneFor = (sceneNum: number, beatNum: number, applyFlip: boolean) => {
    switch (sceneNum) {
      case 1: return renderScene1(sceneNum);
      case 2: return renderConceptScene(sceneNum, beatNum);
      case 3: return renderConceptScene(sceneNum, beatNum);
      case 4: return renderScene4(beatNum, applyFlip);
      case 5: return renderScene5(sceneNum);
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

  // ── Build layer classes ─────────────────────────────────────────────────
  const outgoingLayerClasses = [
    styles.sceneLayer,
    styles.exitAnim,
  ].filter(Boolean).join(" ");

  const incomingLayerClasses = [
    styles.sceneLayer,
    isTransitioning && !isTransitionClone && !reducedMotion ? styles.enterAnim : "",
  ].filter(Boolean).join(" ");

  return (
    <div className={rootClasses}>
      {/* Outgoing scene (transitioning out) */}
      {outgoingScene !== null && !reducedMotion && (
        <div className={outgoingLayerClasses} aria-hidden="true">
          <div className={styles.track}>
            {renderSceneFor(outgoingScene, MAX_BEAT[outgoingScene] ?? 0, false)}
          </div>
        </div>
      )}

      {/* Incoming / current scene */}
      <div className={incomingLayerClasses}>
        <div
          className={[
            styles.track,
            !isTransitionClone && !reducedMotion && !isTransitioning ? styles.animateSceneEnter : "",
          ].filter(Boolean).join(" ")}
          style={reducedMotion ? { animationDuration: "0s" } : undefined}
        >
          {renderSceneFor(scene, beat, true)}
        </div>
      </div>

      {renderNav()}
    </div>
  );
}

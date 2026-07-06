import React, { useEffect, useCallback, useState, useRef } from "react";
import type { BespokeStyleProps, StyleMetadata } from "../types";
import styles from "./08-terminal-glow.module.css";

// ─── Transition constants ─────────────────────────────────────────────────

const TRANSITION_DURATION = 1400; // ms — slow atmospheric fade
const BEAT_COUNTS: Record<number, number> = { 1: 2, 2: 2, 3: 2, 4: 3, 5: 1 };

// ─── Font Injection ────────────────────────────────────────────────────────

function useFonts() {
  useEffect(() => {
    const id = "style-08-fonts";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&family=Inter:wght@300;400;500&display=swap";
    document.head.appendChild(link);
  }, []);
}

// ─── Content ────────────────────────────────────────────────────────────────

interface SceneContent {
  en: {
    label?: string;
    title?: string;
    subtitle?: string;
    chapter?: string;
    statement?: string;
    statementEm?: string;
    quoteLine1?: string;
    quoteLine2?: string;
    attribution?: string;
    attributionRole?: string;
    closing?: string;
    closingEm?: string;
  };
  zh: {
    label?: string;
    title?: string;
    subtitle?: string;
    chapter?: string;
    statement?: string;
    statementEm?: string;
    quoteLine1?: string;
    quoteLine2?: string;
    attribution?: string;
    attributionRole?: string;
    closing?: string;
    closingEm?: string;
  };
}

const SCENES: Record<number, SceneContent> = {
  1: {
    en: {
      label: "Spotlight Series",
      title: "Words That Linger",
      subtitle: "Pause. Breathe. Let them land.",
    },
    zh: {
      label: "聚光系列",
      title: "余韵悠长的话",
      subtitle: "停顿。呼吸。让它们落地。",
    },
  },
  2: {
    en: {
      chapter: "Mission",
      statement: "Build tools that respect",
      statementEm: "people's time and attention.",
    },
    zh: {
      chapter: "使命",
      statement: "打造尊重人们",
      statementEm: "时间和注意力的工具。",
    },
  },
  3: {
    en: {
      chapter: "Philosophy",
      statement: "The best interface is the one",
      statementEm: "that gets out of the way.",
    },
    zh: {
      chapter: "理念",
      statement: "最好的界面",
      statementEm: "是不挡路的界面。",
    },
  },
  4: {
    en: {
      quoteLine1: "We do not remember days.",
      quoteLine2: "We remember moments.",
      attribution: "Cesare Pavese",
      attributionRole: "Italian Poet, 1908-1950",
    },
    zh: {
      quoteLine1: "我们不记得日子。",
      quoteLine2: "我们记得的是时刻。",
      attribution: "切萨雷·帕韦塞",
      attributionRole: "意大利诗人，1908-1950",
    },
  },
  5: {
    en: {
      closing: "Stay curious.",
      closingEm: "Stay kind. Ship with intention.",
    },
    zh: {
      closing: "保持好奇。",
      closingEm: "保持善良。用心交付。",
    },
  },
};

// ─── Metadata ───────────────────────────────────────────────────────────────

export function getMetadata(lang: "en" | "zh"): StyleMetadata {
  const nameMap = { en: "Spotlight Quote Poster", zh: "聚光引言海报" };
  const themeMap = {
    en: "A darkened stage where a single spotlight falls on a few powerful words - held, reflective, meant to be sat with",
    zh: "黑暗舞台上一束聚光照在几句有力的话上——凝固、沉思、值得品味",
  };
  const densityLabelMap = { en: "Sparse", zh: "留白" };

  const sceneTitles = {
    en: ["Opening", "Mission", "Philosophy", "The Quote", "Closing"],
    zh: ["开场", "使命", "理念", "引言", "结语"],
  };

  const beatActions = {
    en: {
      1: ["Series label settles", "Title and subtitle emerge"],
      2: ["Chapter marker appears", "Mission statement rises"],
      3: ["Chapter marker appears", "Philosophy statement rises"],
      4: ["First line of quote", "Second line completes it", "Attribution fades in"],
      5: ["Closing statement held"],
    },
    zh: {
      1: ["系列标签落定", "标题和副标题浮现"],
      2: ["章节标记出现", "使命陈述升起"],
      3: ["章节标记出现", "理念陈述升起"],
      4: ["引言第一行", "第二行完成它", "署名淡入"],
      5: ["结语凝固"],
    },
  };

  const BEAT_COUNTS_LOCAL: Record<number, number> = {
    1: 2,
    2: 2,
    3: 2,
    4: 3,
    5: 1,
  };

  const scenes = [1, 2, 3, 4, 5].map((id) => {
    const beatCount = BEAT_COUNTS_LOCAL[id];
    const actions = beatActions[lang][id as keyof (typeof beatActions)["en"]];
    const c = SCENES[id][lang];

    const beats = Array.from({ length: beatCount }, (_, beatIdx) => {
      let beatTitle = "";
      let beatBody = "";

      if (id === 1) {
        beatTitle = c.title || "";
        beatBody = beatIdx >= 1 ? c.subtitle || "" : c.label || "";
      } else if (id === 2 || id === 3) {
        beatTitle = `${c.statement || ""}${c.statementEm ? " " + c.statementEm : ""}`;
        beatBody = c.chapter || "";
      } else if (id === 4) {
        if (beatIdx === 0) {
          beatTitle = c.quoteLine1 || "";
        } else if (beatIdx === 1) {
          beatTitle = `${c.quoteLine1 || ""} ${c.quoteLine2 || ""}`;
        } else {
          beatTitle = `${c.quoteLine1 || ""} ${c.quoteLine2 || ""}`;
          beatBody = c.attribution || "";
        }
      } else if (id === 5) {
        beatTitle = `${c.closing || ""}${c.closingEm ? " " + c.closingEm : ""}`;
      }

      return { id: beatIdx, action: actions[beatIdx], title: beatTitle, body: beatBody };
    });

    return { id, title: sceneTitles[lang][id - 1], beats };
  });

  return {
    id: "08",
    band: "minimal-keynote",
    name: nameMap[lang],
    theme: themeMap[lang],
    densityLabel: densityLabelMap[lang],
    heroScene: 4,
    colors: {
      bg: "#121212",
      ink: "#f0ebe3",
      panel: "#1a1a1a",
    },
    typography: {
      header: "Playfair Display Italic 400",
      body: "Inter 300",
    },
    tags: [
      "spotlight",
      "quote",
      "theatrical",
      "dark-stage",
      "literary-serif",
      "italic",
      "reflective",
      "dramatic-pause",
      "mission-statement",
    ],
    fonts: ["Playfair Display", "Inter"],
    scenes,
  };
}

// ─── Component ──────────────────────────────────────────────────────────────

export default function TerminalGlow({
  scene,
  beat,
  language,
  isThumbnail,
  reducedMotion,
  onNavigate,
  isTransitionClone,
}: BespokeStyleProps) {
  useFonts();

  const transitionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [transitionInfo, setTransitionInfo] = useState({
    outgoingScene: null as number | null,
    isTransitioning: false,
    lastScene: scene,
  });

  // Synchronous derivation - sets transition state in the SAME render cycle
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

  // ── Scene renderers (parameterized by beatNum) ──────────────────────────

  const renderScene1 = (beatNum: number) => {
    const c = SCENES[1][language];
    return (
      <div className={styles.scene1}>
        <div className={styles.spotlightPool} aria-hidden="true" />
        {beatNum >= 0 && (
          <span className={styles.seriesLabel}>{c.label}</span>
        )}
        {beatNum >= 1 && (
          <>
            <h1 className={styles.heroTitle}>
              <em>{c.title}</em>
            </h1>
            <p className={styles.heroSubtitle}>{c.subtitle}</p>
          </>
        )}
      </div>
    );
  };

  const renderScene2 = (beatNum: number) => {
    const c = SCENES[2][language];
    return (
      <div className={styles.sceneStatement}>
        <div className={styles.spotlightPool} aria-hidden="true" />
        {beatNum >= 0 && (
          <span className={styles.chapterLabel}>{c.chapter}</span>
        )}
        {beatNum >= 1 && (
          <blockquote className={styles.statementBlock}>
            <p className={styles.statementText}>
              {c.statement}{" "}
              <em className={styles.statementEm}>{c.statementEm}</em>
            </p>
          </blockquote>
        )}
      </div>
    );
  };

  const renderScene3 = (beatNum: number) => {
    const c = SCENES[3][language];
    return (
      <div className={styles.sceneStatement}>
        <div className={styles.spotlightPool} aria-hidden="true" />
        {beatNum >= 0 && (
          <span className={styles.chapterLabel}>{c.chapter}</span>
        )}
        {beatNum >= 1 && (
          <blockquote className={styles.statementBlock}>
            <p className={styles.statementText}>
              {c.statement}{" "}
              <em className={styles.statementEm}>{c.statementEm}</em>
            </p>
          </blockquote>
        )}
      </div>
    );
  };

  const renderScene4 = (beatNum: number) => {
    const c = SCENES[4][language];
    return (
      <div className={styles.sceneQuote}>
        <div className={`${styles.spotlightPool} ${styles.spotlightQuote}`} aria-hidden="true" />
        <blockquote className={styles.quoteBlock}>
          {beatNum >= 0 && (
            <p className={`${styles.quoteLine} ${styles.quoteLineVisible}`}>
              <em>{c.quoteLine1}</em>
            </p>
          )}
          {beatNum >= 1 && (
            <p className={`${styles.quoteLine} ${styles.quoteLineVisible}`}>
              <em>{c.quoteLine2}</em>
            </p>
          )}
        </blockquote>
        {beatNum >= 2 && (
          <div className={styles.attributionBlock}>
            <span className={styles.attributionName}>{c.attribution}</span>
            <span className={styles.attributionRole}>{c.attributionRole}</span>
          </div>
        )}
      </div>
    );
  };

  const renderScene5 = (_beatNum: number) => {
    const c = SCENES[5][language];
    return (
      <div className={styles.sceneClosing}>
        <div className={`${styles.spotlightPool} ${styles.spotlightClosing}`} aria-hidden="true" />
        <h2 className={styles.closingText}>
          <em>{c.closing}</em>{" "}
          <span className={styles.closingEm}>{c.closingEm}</span>
        </h2>
      </div>
    );
  };

  const renderSceneFor = (sceneNum: number, beatNum: number) => {
    switch (sceneNum) {
      case 1:
        return renderScene1(beatNum);
      case 2:
        return renderScene2(beatNum);
      case 3:
        return renderScene3(beatNum);
      case 4:
        return renderScene4(beatNum);
      case 5:
        return renderScene5(beatNum);
      default:
        return null;
    }
  };

  // ── Navigation ──────────────────────────────────────────────────────────

  const renderNav = () => {
    if (isThumbnail) return null;

    return (
      <nav className={styles.quietNav} aria-label="Scene navigation">
        {[1, 2, 3, 4, 5].map((s) => {
          const isActive = s === scene;
          const itemClasses = [
            styles.quietNavItem,
            isActive ? styles.quietNavItemActive : "",
          ]
            .filter(Boolean)
            .join(" ");
          return (
            <button
              key={s}
              type="button"
              className={itemClasses}
              aria-label={`Jump to scene ${s}`}
              onClick={(e) => handleNavClick(e, s)}
            >
              <span className={styles.quietNavDot} />
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
    isTransitioning && !isTransitionClone ? styles.enterAnim : "",
  ].filter(Boolean).join(" ");

  return (
    <div className={rootClasses}>
      {/* Stage vignette (persistent across transitions) */}
      <div className={styles.stageVignette} aria-hidden="true" />

      {/* Outgoing scene (fade-out animation) */}
      {outgoingScene !== null && (
        <div className={outgoingLayerClasses}>
          <div className={styles.track}>
            {renderSceneFor(outgoingScene, BEAT_COUNTS[outgoingScene] - 1)}
          </div>
        </div>
      )}

      {/* Incoming / current scene (fade-in animation) */}
      <div className={incomingLayerClasses}>
        <div
          key={`08-${scene}`}
          className={styles.track}
        >
          {renderSceneFor(scene, beat)}
        </div>
      </div>

      {renderNav()}
    </div>
  );
}

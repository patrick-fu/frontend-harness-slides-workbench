import React, { useEffect, useCallback, useState, useRef } from "react";
import type { BespokeStyleProps, StyleMetadata } from "../types";
import styles from "./06-monochrome-study.module.css";

// ─── Font Injection ────────────────────────────────────────────────────────

function useFonts() {
  useEffect(() => {
    const id = "style-06-fonts";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Inter:wght@300;400;500;700;900&display=swap";
    document.head.appendChild(link);
  }, []);
}

// ─── Content ────────────────────────────────────────────────────────────────

interface SceneContent {
  en: {
    label?: string;
    title?: string;
    titleOutline?: string;
    subtitle?: string;
    statement?: string;
    statementHighlight?: string;
    statementTail?: string;
    statementSub?: string;
    sectionLabel?: string;
    contrast?: Array<{ label: string; text: string; desc: string }>;
    scaleItems?: Array<{ num: string; text: string; note: string }>;
    closingMark?: string;
    closing?: string;
    closingSub?: string;
  };
  zh: {
    label?: string;
    title?: string;
    titleOutline?: string;
    subtitle?: string;
    statement?: string;
    statementHighlight?: string;
    statementTail?: string;
    statementSub?: string;
    sectionLabel?: string;
    contrast?: Array<{ label: string; text: string; desc: string }>;
    scaleItems?: Array<{ num: string; text: string; note: string }>;
    closingMark?: string;
    closing?: string;
    closingSub?: string;
  };
}

const SCENES: Record<number, SceneContent> = {
  1: {
    en: {
      label: "Punchline Series / 2026",
      title: "PUNCH",
      titleOutline: "LINE",
      subtitle: "One idea. Hit hard. No explanation needed.",
    },
    zh: {
      label: "金句系列 / 2026",
      title: "金",
      titleOutline: "句",
      subtitle: "一个想法。重重一击。无需解释。",
    },
  },
  2: {
    en: {
      statement: "MOVE FAST",
      statementHighlight: "AND BREAK",
      statementTail: "THINGS",
      statementSub: "The cost of inaction exceeds the cost of mistakes.",
    },
    zh: {
      statement: "快速行动，",
      statementHighlight: "打破常规",
      statementTail: "",
      statementSub: "不作为的代价超过犯错的代价。",
    },
  },
  3: {
    en: {
      sectionLabel: "Before / After",
      contrast: [
        {
          label: "Before",
          text: "Comfortable",
          desc: "Safe. Predictable. Forgotten by Tuesday.",
        },
        {
          label: "After",
          text: "Unforgettable",
          desc: "Bold. Disruptive. Still talked about Friday.",
        },
      ],
    },
    zh: {
      sectionLabel: "之前 / 之后",
      contrast: [
        {
          label: "之前",
          text: "舒适",
          desc: "安全。可预测。周二就被遗忘。",
        },
        {
          label: "之后",
          text: "难忘",
          desc: "大胆。颠覆性。周五还在被讨论。",
        },
      ],
    },
  },
  4: {
    en: {
      sectionLabel: "Punchline Rules",
      scaleItems: [
        { num: "01", text: "Say it loud", note: "Volume" },
        { num: "02", text: "Say it once", note: "Restraint" },
        { num: "03", text: "Leave no room", note: "Density" },
        { num: "04", text: "Walk off stage", note: "Exit" },
      ],
    },
    zh: {
      sectionLabel: "金句法则",
      scaleItems: [
        { num: "01", text: "大声说", note: "音量" },
        { num: "02", text: "只说一次", note: "克制" },
        { num: "03", text: "不留余地", note: "密度" },
        { num: "04", text: "转身下台", note: "退场" },
      ],
    },
  },
  5: {
    en: {
      closingMark: "Mic Drop",
      closing: "NO EXPLANATION.",
      closingSub: "Kinetic Type Punchline Series  ·  2026",
    },
    zh: {
      closingMark: "扔麦结束",
      closing: "无需解释。",
      closingSub: "动感字体金句系列  ·  2026",
    },
  },
};

// ─── Metadata ───────────────────────────────────────────────────────────────

export function getMetadata(lang: "en" | "zh"): StyleMetadata {
  const nameMap = { en: "Kinetic Type Punchline", zh: "动感字体金句" };
  const themeMap = {
    en: "A loud graphic poster where words are the image — massive stacked phrases hit like a mic-drop, delivering one punch the audience cannot miss",
    zh: "一张响亮的图形海报，文字即是图像——巨大的堆叠短语如扔麦般击中观众，传递一个无法忽视的重击",
  };
  const densityLabelMap = { en: "Impact", zh: "冲击" };

  const sceneTitles = {
    en: ["Title", "The Punch", "Before / After", "Rules of Impact", "Mic Drop"],
    zh: ["标题", "重击", "之前 / 之后", "冲击法则", "扔麦结束"],
  };

  const beatActions = {
    en: {
      1: ["Title slams in"],
      2: ["Statement hits", "Highlight word strikes through"],
      3: ["Section label", "Both panels slam in"],
      4: ["Rules 1-2 hit", "Rules 3-4 hit"],
      5: ["Closing punchline"],
    },
    zh: {
      1: ["标题砸入"],
      2: ["陈述击中", "高亮词穿透"],
      3: ["分组标签", "两个面板砸入"],
      4: ["法则 1-2 击中", "法则 3-4 击中"],
      5: ["结语金句"],
    },
  };

  const BEAT_COUNTS: Record<number, number> = {
    1: 1,
    2: 2,
    3: 2,
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
        beatTitle = `${c.title || ""} ${c.titleOutline || ""}`;
        beatBody = c.subtitle || "";
      } else if (id === 2) {
        beatTitle = `${c.statement || ""}${c.statementHighlight || ""}${c.statementTail || ""}`;
        beatBody = beatIdx >= 1 ? c.statementSub || "" : "";
      } else if (id === 3) {
        beatTitle = c.sectionLabel || "";
        if (beatIdx >= 1) {
          beatBody = (c.contrast || []).map((p) => p.text).join(" / ");
        }
      } else if (id === 4) {
        beatTitle = c.sectionLabel || "";
        const visible = (c.scaleItems || []).slice(0, Math.min((beatIdx + 1) * 2, 4));
        beatBody = visible.map((s) => `${s.num} ${s.text}`).join(" / ");
      } else if (id === 5) {
        beatTitle = c.closing || "";
        beatBody = c.closingSub || "";
      }

      return { id: beatIdx, action: actions[beatIdx], title: beatTitle, body: beatBody };
    });

    return { id, title: sceneTitles[lang][id - 1], beats };
  });

  return {
    id: "06",
    band: "minimal-keynote",
    name: nameMap[lang],
    theme: themeMap[lang],
    densityLabel: densityLabelMap[lang],
    heroScene: 2,
    colors: {
      bg: "#000000",
      ink: "#ffffff",
      panel: "#1a1a1a",
    },
    typography: {
      header: "Oswald 700",
      body: "Inter 300",
    },
    tags: [
      "kinetic-type",
      "punchline",
      "mic-drop",
      "poster",
      "condensed",
      "ultra-bold",
      "percussive",
      "strike-replace",
      "high-impact",
    ],
    fonts: ["Oswald", "Inter"],
    scenes,
  };
}

// ─── Transition constants ───────────────────────────────────────────────────

const TRANSITION_DURATION = 200;
const FLASH_DURATION = 150;
const BEAT_COUNTS_FOR_SCENE: Record<number, number> = { 1: 1, 2: 2, 3: 2, 4: 2, 5: 1 };
const getMaxBeat = (sceneNum: number): number => (BEAT_COUNTS_FOR_SCENE[sceneNum] || 1) - 1;

// ─── Component ──────────────────────────────────────────────────────────────

export default function MonochromeStudy({
  scene,
  beat,
  language,
  isThumbnail,
  reducedMotion,
  onNavigate,
  isTransitionClone,
}: BespokeStyleProps) {
  useFonts();

  // ── Transition state ────────────────────────────────────────────────────
  const transitionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const flashTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [transitionInfo, setTransitionInfo] = useState({
    outgoingScene: null as number | null,
    isTransitioning: false,
    showFlash: false,
    lastScene: scene,
  });

  // Synchronous derivation — sets transition state in the SAME render cycle
  // as the scene prop change.
  if (transitionInfo.lastScene !== scene) {
    if (transitionTimerRef.current) {
      clearTimeout(transitionTimerRef.current);
    }
    if (flashTimerRef.current) {
      clearTimeout(flashTimerRef.current);
    }

    if (!reducedMotion && !isThumbnail) {
      transitionTimerRef.current = setTimeout(() => {
        setTransitionInfo(function(prev) {
          return { outgoingScene: null, isTransitioning: false, showFlash: false, lastScene: prev.lastScene };
        });
      }, TRANSITION_DURATION);

      flashTimerRef.current = setTimeout(() => {
        setTransitionInfo(function(prev) {
          return { ...prev, showFlash: false };
        });
      }, FLASH_DURATION);

      setTransitionInfo({
        outgoingScene: transitionInfo.lastScene,
        isTransitioning: true,
        showFlash: true,
        lastScene: scene,
      });
    } else {
      setTransitionInfo({
        outgoingScene: null,
        isTransitioning: false,
        showFlash: false,
        lastScene: scene,
      });
    }
  }

  const outgoingScene = transitionInfo.outgoingScene;
  const isTransitioning = transitionInfo.isTransitioning;
  const showFlash = transitionInfo.showFlash;

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
        <span className={styles.bwLabel}>{c.label}</span>
        <h1 className={styles.bwHero}>{c.title}</h1>
        <h1 className={styles.bwHeroOutline}>{c.titleOutline}</h1>
        <div className={styles.bwRule} />
        <p className={styles.bwSub}>{c.subtitle}</p>
      </div>
    );
  };

  const renderScene2 = (beatNum: number) => {
    const c = SCENES[2][language];
    return (
      <div className={styles.scene2}>
        <div className={styles.bwStatementWrap}>
          <h2 className={styles.bwStatement}>
            {c.statement}
            {beatNum >= 1 && <em>{c.statementHighlight}</em>}
            {c.statementTail}
          </h2>
          {beatNum >= 1 && (
            <p className={styles.bwStatementSubVisible}>
              {c.statementSub}
            </p>
          )}
        </div>
      </div>
    );
  };

  const renderScene3 = (beatNum: number) => {
    const c = SCENES[3][language];
    const items = c.contrast || [];
    return (
      <div className={styles.scene3}>
        <span className={styles.bwSectionLabel}>{c.sectionLabel}</span>
        <div className={styles.bwContrast}>
          {items.map((item, i) => {
            const visible = beatNum >= 1;
            const itemClasses = [
              styles.bwContrastItem,
              visible ? styles.bwContrastItemVisible : "",
            ]
              .filter(Boolean)
              .join(" ");
            return (
              <div
                key={i}
                className={itemClasses}
                style={
                  reducedMotion
                    ? { animationDuration: "0s" }
                    : { animationDelay: `${i * 0.1}s` }
                }
              >
                <div className={styles.bwContrastLabel}>{item.label}</div>
                <p className={styles.bwContrastText}>{item.text}</p>
                <p className={styles.bwContrastDesc}>{item.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderScene4 = (beatNum: number) => {
    const c = SCENES[4][language];
    const items = c.scaleItems || [];
    const visibleCount = Math.min((beatNum + 1) * 2, 4);
    return (
      <div className={styles.scene4}>
        <span className={styles.bwSectionLabel}>{c.sectionLabel}</span>
        <div className={styles.bwScaleList}>
          {items.map((item, i) => {
            const visible = i < visibleCount;
            const itemClasses = [
              styles.bwScaleItem,
              visible ? styles.bwScaleItemVisible : "",
            ]
              .filter(Boolean)
              .join(" ");
            return (
              <div
                key={i}
                className={itemClasses}
                style={
                  reducedMotion
                    ? { animationDuration: "0s" }
                    : { animationDelay: `${i * 0.06}s` }
                }
              >
                <span className={styles.bwScaleNum}>{item.num}</span>
                <p className={styles.bwScaleText}>{item.text}</p>
                <span className={styles.bwScaleNote}>{item.note}</span>
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
        <span className={styles.bwClosingMark}>{c.closingMark}</span>
        <h2 className={styles.bwClosing}>{c.closing}</h2>
        <div className={styles.bwClosingLine} />
        <p className={styles.bwClosingSub}>{c.closingSub}</p>
      </div>
    );
  };

  const renderSceneFor = (sceneNum: number, beatNum: number) => {
    switch (sceneNum) {
      case 1:
        return renderScene1();
      case 2:
        return renderScene2(beatNum);
      case 3:
        return renderScene3(beatNum);
      case 4:
        return renderScene4(beatNum);
      case 5:
        return renderScene5();
      default:
        return null;
    }
  };

  // ── Navigation ──────────────────────────────────────────────────────────

  const renderNav = () => {
    if (isThumbnail) return null;

    return (
      <nav className={styles.nav} aria-label="Scene navigation">
        {[1, 2, 3, 4, 5].map((s) => {
          const isActive = s === scene;
          const itemClasses = [
            styles.navItem,
            isActive ? styles.navItemActive : "",
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
              <span className={styles.navDot} />
            </button>
          );
        })}
      </nav>
    );
  };

  return (
    <div className={rootClasses}>
      {/* Outgoing scene (during transition) */}
      {outgoingScene !== null && (
        <div
          className={styles.sceneLayer}
          style={{ zIndex: 2, pointerEvents: "none" }}
        >
          <div className={styles.track}>
            {renderSceneFor(outgoingScene, getMaxBeat(outgoingScene))}
          </div>
        </div>
      )}

      {/* Current/incoming scene */}
      <div
        className={[
          styles.sceneLayer,
          !isTransitioning && !isTransitionClone ? styles.animateSceneEnter : "",
        ]
          .filter(Boolean)
          .join(" ")}
        style={{ zIndex: isTransitioning ? 1 : 1 }}
      >
        <div className={styles.track}>
          {renderSceneFor(scene, beat)}
        </div>
      </div>

      {/* Flash overlay (during transition) */}
      {showFlash && (
        <div
          className={`${styles.flashOverlay} ${styles.flashFadeOut}`}
          style={{ zIndex: 10 }}
          aria-hidden="true"
        />
      )}

      {renderNav()}
    </div>
  );
}

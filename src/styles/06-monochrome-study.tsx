import React, { useEffect, useCallback } from "react";
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
      "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;700;900&display=swap";
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
      label: "Monochrome Study / 2026",
      title: "BLACK",
      titleOutline: "WHITE",
      subtitle: "Visual storytelling through pure contrast — where every frame is a study in tension and restraint",
    },
    zh: {
      label: "单色研究 / 2026",
      title: "黑",
      titleOutline: "白",
      subtitle: "通过纯粹对比的视觉叙事——每一帧都是张力与克制的研究",
    },
  },
  2: {
    en: {
      statement: "SEE IN",
      statementHighlight: "BLACK",
      statementTail: "& WHITE",
      statementSub: "The world is not gray. It is decisive.",
    },
    zh: {
      statement: "用",
      statementHighlight: "黑与白",
      statementTail: "去看",
      statementSub: "世界不是灰色的，它是果断的。",
    },
  },
  3: {
    en: {
      sectionLabel: "Study in Contrast",
      contrast: [
        {
          label: "Light",
          text: "Clarity",
          desc: "Every element earns its place through purpose and precision.",
        },
        {
          label: "Shadow",
          text: "Depth",
          desc: "Absence creates form. Silence speaks louder than noise.",
        },
      ],
    },
    zh: {
      sectionLabel: "对比研究",
      contrast: [
        {
          label: "明",
          text: "清晰",
          desc: "每个元素都通过目的和精确赢得它的位置。",
        },
        {
          label: "暗",
          text: "深度",
          desc: "缺席创造形式。沉默比喧嚣更有力量。",
        },
      ],
    },
  },
  4: {
    en: {
      sectionLabel: "Visual Grammar",
      scaleItems: [
        { num: "01", text: "Scale dominates attention", note: "Hierarchy" },
        { num: "02", text: "Space breathes meaning", note: "Rhythm" },
        { num: "03", text: "Weight creates tension", note: "Balance" },
        { num: "04", text: "Silence amplifies voice", note: "Restraint" },
      ],
    },
    zh: {
      sectionLabel: "视觉语法",
      scaleItems: [
        { num: "01", text: "尺度主导注意力", note: "层级" },
        { num: "02", text: "空间赋予意义呼吸", note: "节奏" },
        { num: "03", text: "重量创造张力", note: "平衡" },
        { num: "04", text: "沉默放大声音", note: "克制" },
      ],
    },
  },
  5: {
    en: {
      closingMark: "End of Study",
      closing: "SEE CLEARLY.",
      closingSub: "Monochrome Study Series  ·  2026",
    },
    zh: {
      closingMark: "研究结束",
      closing: "看得清楚。",
      closingSub: "单色研究系列  ·  2026",
    },
  },
};

// ─── Metadata ───────────────────────────────────────────────────────────────

export function getMetadata(lang: "en" | "zh"): StyleMetadata {
  const nameMap = { en: "Monochrome Study", zh: "单色研究" };
  const themeMap = {
    en: "Visual Storytelling in B&W — pure black and white with dramatic high-contrast typography",
    zh: "黑白视觉叙事——纯黑白高对比度戏剧性排版",
  };
  const densityLabelMap = { en: "Bold", zh: "强烈" };

  const sceneTitles = {
    en: ["Title", "Bold Statement", "Contrast Study", "Visual Grammar", "Closing"],
    zh: ["标题", "强烈陈述", "对比研究", "视觉语法", "结语"],
  };

  const beatActions = {
    en: {
      1: ["Title and subtitle appear"],
      2: ["Statement revealed", "Highlight word inverts"],
      3: ["Section label", "Both contrast panels appear"],
      4: ["Items 1-2 appear", "Items 3-4 appear"],
      5: ["Closing statement"],
    },
    zh: {
      1: ["标题和副标题呈现"],
      2: ["陈述揭示", "高亮词反色"],
      3: ["分组标签", "两个对比面板呈现"],
      4: ["第 1-2 项呈现", "第 3-4 项呈现"],
      5: ["结语陈述"],
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
      header: "Inter 900",
      body: "Inter 300",
    },
    tags: [
      "monochrome",
      "black-white",
      "high-contrast",
      "dramatic",
      "bold",
      "typographic",
      "minimal",
      "stark",
      "editorial",
    ],
    fonts: ["Inter"],
    scenes,
  };
}

// ─── Component ──────────────────────────────────────────────────────────────

export default function MonochromeStudy({
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
        <span className={styles.bwLabel}>{c.label}</span>
        <h1 className={styles.bwHero}>{c.title}</h1>
        <h1 className={styles.bwHeroOutline}>{c.titleOutline}</h1>
        <div className={styles.bwRule} />
        <p className={styles.bwSub}>{c.subtitle}</p>
      </div>
    );
  };

  const renderScene2 = () => {
    const c = SCENES[2][language];
    return (
      <div className={styles.scene2}>
        <div className={styles.bwStatementWrap}>
          <h2 className={styles.bwStatement}>
            {c.statement}
            {beat >= 1 && <em>{c.statementHighlight}</em>}
            {c.statementTail}
          </h2>
          {beat >= 1 && (
            <p className={styles.bwStatementSubVisible}>
              {c.statementSub}
            </p>
          )}
        </div>
      </div>
    );
  };

  const renderScene3 = () => {
    const c = SCENES[3][language];
    const items = c.contrast || [];
    return (
      <div className={styles.scene3}>
        <span className={styles.bwSectionLabel}>{c.sectionLabel}</span>
        <div className={styles.bwContrast}>
          {items.map((item, i) => {
            const visible = beat >= 1;
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
                    : { animationDelay: `${i * 0.15}s` }
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

  const renderScene4 = () => {
    const c = SCENES[4][language];
    const items = c.scaleItems || [];
    const visibleCount = Math.min((beat + 1) * 2, 4);
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
                    : { animationDelay: `${i * 0.08}s` }
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

  const renderSceneContent = () => {
    switch (scene) {
      case 1:
        return renderScene1();
      case 2:
        return renderScene2();
      case 3:
        return renderScene3();
      case 4:
        return renderScene4();
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
      <div
        key={scene}
        className={trackClasses}
        style={reducedMotion ? { animationDuration: "0s" } : undefined}
      >
        {renderSceneContent()}
      </div>
      {renderNav()}
    </div>
  );
}

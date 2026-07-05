import React, { useEffect, useCallback } from "react";
import type { BespokeStyleProps, StyleMetadata } from "../types";
import styles from "./01-executive-silence.module.css";

// ─── Font Injection ────────────────────────────────────────────────────────

function useFonts() {
  useEffect(() => {
    const id = "style-01-fonts";
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
    title: string;
    statement?: string;
    attribution?: string;
    heading?: string;
    questions?: string[];
    dataPoint?: string;
    closing?: string;
    closingAccent?: string;
  };
  zh: {
    title: string;
    statement?: string;
    attribution?: string;
    heading?: string;
    questions?: string[];
    dataPoint?: string;
    closing?: string;
    closingAccent?: string;
  };
}

const SCENES: Record<number, SceneContent> = {
  1: {
    en: {
      title: "The Art of Decision",
    },
    zh: {
      title: "决策的艺术",
    },
  },
  2: {
    en: {
      title: "",
      statement: "Not choosing is also a choice",
      attribution: "— Executive proverb",
    },
    zh: {
      title: "",
      statement: "不选择本身就是一种选择",
      attribution: "—— 管理者箴言",
    },
  },
  3: {
    en: {
      title: "",
      heading: "Before every decision",
      questions: [
        "What happens if we do this?",
        "What happens if we don't?",
        "What does our intuition say?",
      ],
    },
    zh: {
      title: "",
      heading: "每个决策之前",
      questions: [
        "做了会怎样？",
        "不做会怎样？",
        "直觉怎么说？",
      ],
    },
  },
  4: {
    en: {
      title: "",
      statement: "Speed of decision matters more than perfection",
      dataPoint: "78% of successful executives cite decisiveness as their top strength",
    },
    zh: {
      title: "",
      statement: "决策速度比完美更重要",
      dataPoint: "78% 的成功高管将决断力列为首要优势",
    },
  },
  5: {
    en: {
      title: "",
      closing: "Decide.",
      closingAccent: "Then make it right.",
    },
    zh: {
      title: "",
      closing: "做决定，",
      closingAccent: "然后使之正确。",
    },
  },
};

// ─── Metadata ───────────────────────────────────────────────────────────────

export function getMetadata(lang: "en" | "zh"): StyleMetadata {
  const nameMap = {
    en: "Executive Silence",
    zh: "高管静默",
  };
  const themeMap = {
    en: "The Art of Decision — executive leadership wisdom in sparse, premium typography",
    zh: "决策的艺术——以极简、高端的排版呈现高管领导智慧",
  };
  const densityLabelMap = {
    en: "Sparse",
    zh: "稀疏",
  };

  const sceneTitles = {
    en: ["Title", "A Choice", "Three Questions", "Speed Over Perfection", "Closing"],
    zh: ["标题", "一种选择", "三个问题", "速度优于完美", "结语"],
  };

  const beatActions = {
    en: {
      1: ["Title appears"],
      2: ["Statement appears", "Attribution fades in"],
      3: ["Question 1 appears", "Question 2 appears", "Question 3 appears"],
      4: ["Statement appears", "Data point fades in"],
      5: ["Closing statement"],
    },
    zh: {
      1: ["标题呈现"],
      2: ["陈述呈现", "署名淡入"],
      3: ["问题一呈现", "问题二呈现", "问题三呈现"],
      4: ["陈述呈现", "数据淡入"],
      5: ["结语呈现"],
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
    const content = SCENES[id][lang];
    const beatCount = BEAT_COUNTS[id];
    const actions =
      beatActions[lang][id as keyof (typeof beatActions)["en"]];

    const beats: Array<{
      id: number;
      action: string;
      title: string;
      body: string;
    }> = Array.from({ length: beatCount }, (_, beatIdx) => {
      let beatTitle = "";
      let beatBody = "";

      if (id === 1) {
        beatTitle = content.title;
        beatBody = "";
      } else if (id === 2) {
        beatTitle = content.statement || "";
        beatBody = beatIdx >= 1 ? content.attribution || "" : "";
      } else if (id === 3) {
        beatTitle = content.heading || "";
        const visibleQuestions = (content.questions || []).slice(0, beatIdx + 1);
        beatBody = visibleQuestions.join(" / ");
      } else if (id === 4) {
        beatTitle = content.statement || "";
        beatBody = beatIdx >= 1 ? content.dataPoint || "" : "";
      } else if (id === 5) {
        beatTitle = `${content.closing || ""}${content.closingAccent || ""}`;
        beatBody = "";
      }

      return {
        id: beatIdx,
        action: actions[beatIdx],
        title: beatTitle,
        body: beatBody,
      };
    });

    return {
      id,
      title: sceneTitles[lang][id - 1],
      beats,
    };
  });

  return {
    id: "01",
    band: "minimal-keynote",
    name: nameMap[lang],
    theme: themeMap[lang],
    densityLabel: densityLabelMap[lang],
    heroScene: 1,
    colors: {
      bg: "#0a0a0a",
      ink: "#f5f5f0",
      panel: "#141414",
    },
    typography: {
      header: "Inter 500",
      body: "Inter 300",
    },
    tags: [
      "minimal",
      "premium",
      "executive",
      "sparse",
      "dark",
      "serene",
      "corporate",
      "decision",
      "leadership",
    ],
    fonts: ["Inter"],
    scenes,
  };
}

// ─── Component ──────────────────────────────────────────────────────────────

export default function ExecutiveSilence({
  scene,
  beat,
  language,
  isThumbnail,
  reducedMotion,
  onNavigate,
  isTransitionClone,
}: BespokeStyleProps) {
  useFonts();
  const content = SCENES[scene]?.[language] || SCENES[1][language];

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
    !isTransitionClone && styles.animateSceneEnter,
  ]
    .filter(Boolean)
    .join(" ");

  // ── Render scene content ────────────────────────────────────────────────

  const renderSceneContent = () => {
    if (scene === 1) {
      return <h1 className={styles.title}>{content.title}</h1>;
    }

    if (scene === 2) {
      return (
        <>
          <p className={styles.statement}>{content.statement}</p>
          {beat >= 1 && (
            <p className={styles.attribution}>
              {content.attribution}
            </p>
          )}
        </>
      );
    }

    if (scene === 3) {
      const questions = content.questions || [];
      return (
        <>
          {content.heading && (
            <p className={styles.sceneHeading}>{content.heading}</p>
          )}
          <ul className={styles.questionList}>
            {questions.map((q, i) => {
              const visible = i <= beat;
              return (
                <li
                  key={i}
                  className={[
                    styles.questionItem,
                    visible ? styles.questionItemVisible : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  <span className={styles.questionNumber}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {q}
                </li>
              );
            })}
          </ul>
        </>
      );
    }

    if (scene === 4) {
      return (
        <>
          <p className={styles.statement}>{content.statement}</p>
          {beat >= 1 && (
            <p className={styles.dataPoint}>
              {content.dataPoint}
            </p>
          )}
        </>
      );
    }

    if (scene === 5) {
      return (
        <h2 className={styles.closing}>
          {content.closing}{" "}
          <span className={styles.closingAccent}>
            {content.closingAccent}
          </span>
        </h2>
      );
    }

    return null;
  };

  // ── Ruler navigation ────────────────────────────────────────────────────

  const renderRulerNav = () => {
    if (isThumbnail) return null;

    return (
      <nav className={styles.rulerNav} aria-label="Scene navigation">
        <div className={styles.rulerTrack} />
        {[1, 2, 3, 4, 5].map((s) => {
          const isActive = s === scene;
          return (
            <button
              key={s}
              type="button"
              className={[
                styles.rulerMarker,
                isActive ? styles.rulerMarkerActive : "",
              ]
                .filter(Boolean)
                .join(" ")}
              aria-label={`Jump to scene ${s}`}
              onClick={(e) => handleNavClick(e, s)}
            >
              <span className={styles.rulerNumber}>
                {String(s).padStart(2, "0")}
              </span>
              <span className={styles.rulerTick} />
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
      {renderRulerNav()}
    </div>
  );
}

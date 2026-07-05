import React, { useEffect, useCallback, useState, useRef } from "react";
import type { BespokeStyleProps, StyleMetadata } from "../types";
import styles from "./01-executive-silence.module.css";
import { useFLIP } from "../hooks/useFLIP";

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

// ─── Transition constants ─────────────────────────────────────────────────

const TRANSITION_DURATION = 650; // ms — outgoing 500ms + incoming 600ms w/ 50ms delay
const BEAT_COUNTS: Record<number, number> = { 1: 1, 2: 2, 3: 3, 4: 2, 5: 1 };

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

  const [outgoingScene, setOutgoingScene] = useState<number | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const prevSceneRef = useRef<number>(scene);

  // Detect scene changes and manage transition lifecycle
  useEffect(() => {
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

  // FLIP for scene 3 question list
  const { ref: questionListRef } = useFLIP<HTMLUListElement>({
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
  ]
    .filter(Boolean)
    .join(" ");

  // ── Render scene content for a given scene number ────────────────────────

  const renderSceneFor = (sceneNum: number, beatNum: number) => {
    const content = SCENES[sceneNum]?.[language] || SCENES[1][language];

    if (sceneNum === 1) {
      return <h1 className={styles.title}>{content.title}</h1>;
    }

    if (sceneNum === 2) {
      return (
        <>
          <p className={styles.statement}>{content.statement}</p>
          {beatNum >= 1 && (
            <p className={styles.attribution}>
              {content.attribution}
            </p>
          )}
        </>
      );
    }

    if (sceneNum === 3) {
      const questions = content.questions || [];
      return (
        <>
          {content.heading && (
            <p className={styles.sceneHeading}>{content.heading}</p>
          )}
          <ul
            ref={sceneNum === scene ? questionListRef : undefined}
            className={styles.questionList}
          >
            {questions.map((q, i) => {
              const visible = i <= beatNum;
              return (
                <li
                  key={i}
                  className={[
                    styles.questionItem,
                    visible ? styles.questionItemVisible : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  style={{
                    transitionDelay: visible ? `${i * 0.15}s` : undefined,
                  }}
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

    if (sceneNum === 4) {
      return (
        <>
          <p className={styles.statement}>{content.statement}</p>
          {beatNum >= 1 && (
            <p className={styles.dataPoint}>
              {content.dataPoint}
            </p>
          )}
        </>
      );
    }

    if (sceneNum === 5) {
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
      {/* Outgoing scene (exit animation) */}
      {outgoingScene !== null && (
        <div className={outgoingLayerClasses}>
          <div className={styles.track}>
            {renderSceneFor(outgoingScene, BEAT_COUNTS[outgoingScene] - 1)}
          </div>
        </div>
      )}

      {/* Incoming / current scene */}
      <div className={incomingLayerClasses}>
        <div
          key={scene}
          className={styles.track}
        >
          {renderSceneFor(scene, beat)}
        </div>
      </div>

      {renderRulerNav()}
    </div>
  );
}

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
    link.href = "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400&display=swap";
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
      title: "Introducing Nova",
    },
    zh: {
      title: "Nova 全新登场",
    },
  },
  2: {
    en: {
      title: "",
      statement: "Less, but better.",
      attribution: "— Dieter Rams",
    },
    zh: {
      title: "",
      statement: "更少，却更好。",
      attribution: "—— 迪特·拉姆斯",
    },
  },
  3: {
    en: {
      title: "",
      heading: "Three principles guide us",
      questions: [
        "Does it serve the user?",
        "Does it remove friction?",
        "Does it endure?",
      ],
    },
    zh: {
      title: "",
      heading: "我们遵循的三条原则",
      questions: [
        "它是否服务于用户？",
        "它是否消除了摩擦？",
        "它是否经得起时间？",
      ],
    },
  },
  4: {
    en: {
      title: "",
      statement: "Crafted down to the last detail",
      dataPoint: "Every element considered. Nothing included by default.",
    },
    zh: {
      title: "",
      statement: "精雕细琢至最后一个细节",
      dataPoint: "每个元素都经过深思熟虑。没有任何东西是默认加入的。",
    },
  },
  5: {
    en: {
      title: "",
      closing: "Nova.",
      closingAccent: "Quietly extraordinary.",
    },
    zh: {
      title: "",
      closing: "Nova。",
      closingAccent: "于无声处听惊雷。",
    },
  },
};

// ─── Metadata ───────────────────────────────────────────────────────────────

export function getMetadata(lang: "en" | "zh"): StyleMetadata {
  const nameMap = {
    en: "Minimal Product Keynote",
    zh: "极简产品主题演讲",
  };
  const themeMap = {
    en: "One idea, enormous, alone in emptiness — premium product reveals, opening theses, and single big claims where restraint is the luxury",
    zh: "一个想法，巨大，独处于虚空——高端产品发布、开篇主题、单一重大主张，克制即是奢华",
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
      bg: "#0d0d0c",
      ink: "#f2efe9",
      panel: "#161614",
    },
    typography: {
      header: "Playfair Display 500",
      body: "Inter 300",
    },
    tags: [
      "minimal",
      "premium",
      "product",
      "keynote",
      "sparse",
      "restrained",
      "luxury",
      "emptiness",
      "composed",
    ],
    fonts: ["Playfair Display", "Inter"],
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

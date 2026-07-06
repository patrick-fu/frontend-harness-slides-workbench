import React, { useLayoutEffect, useEffect, useState, useCallback } from "react";
import type { BespokeStyleProps, StyleMetadata } from "../types";
import SpatialSceneTrack from "./SpatialSceneTrack";
import styles from "./18-literary-review.module.css";

// ─── Content ────────────────────────────────────────────────────────────────

interface SceneContent {
  en: {
    title?: string;
    subtitle?: string;
    label?: string;
    text?: string;
    attribution?: string;
    poemTitle?: string;
    poemAuthor?: string;
    stanzas?: string[];
    kicker?: string;
    headline?: string;
    body?: string[];
    closing?: string;
    note?: string;
  };
  zh: {
    title?: string;
    subtitle?: string;
    label?: string;
    text?: string;
    attribution?: string;
    poemTitle?: string;
    poemAuthor?: string;
    stanzas?: string[];
    kicker?: string;
    headline?: string;
    body?: string[];
    closing?: string;
    note?: string;
  };
}

const SCENES: Record<number, SceneContent> = {
  1: {
    en: {
      title: "MERIDIAN",
      subtitle: "The Quarterly Review of Culture & Ideas",
    },
    zh: {
      title: "MERIDIAN 子午线",
      subtitle: "文化与思想季评",
    },
  },
  2: {
    en: {
      label: "Cover Story",
      text: "After the Algorithm",
      attribution: "How creative intelligence survives in an age of synthetic everything",
    },
    zh: {
      label: "封面故事",
      text: "算法之后",
      attribution: "在合成一切的时代，创造智能如何存续",
    },
  },
  3: {
    en: {
      poemTitle: "Manifesto",
      poemAuthor: "From the Editor",
      stanzas: [
        "We publish not to inform but to provoke. Not to fill space but to claim it. Every issue is a position taken, a line drawn, a flag planted in the shifting soil of contemporary thought.",
      ],
    },
    zh: {
      poemTitle: "宣言",
      poemAuthor: "来自主编",
      stanzas: [
        "我们出版不是为了告知，而是为了激发。不是为了填充空间，而是为了占据它。每一期都是一次立场的宣示，一条划定的界线，一面插在当代思想变迁土壤中的旗帜。",
      ],
    },
  },
  4: {
    en: {
      kicker: "Profile",
      headline: "The Quiet Revolutionary",
      body: [
        "In a studio overlooking the harbour, an architect is rebuilding the way we think about public space — not through grand gestures but through patient, persistent attention to the places where people actually gather.",
      ],
    },
    zh: {
      kicker: "人物",
      headline: "安静的革命者",
      body: [
        "在一间俯瞰港口的工作室里，一位建筑师正在重建我们思考公共空间的方式——不是通过宏大的姿态，而是通过对人们真正聚集之地的耐心、持久的关注。",
      ],
    },
  },
  5: {
    en: {
      closing: "Published quarterly.\nRead deliberately.",
      note: "Meridian — Vol. XXIV — Summer 2026",
    },
    zh: {
      closing: "每季出版。\n用心阅读。",
      note: "子午线 — 第二十四卷 — 2026年夏",
    },
  },
};

// ─── Metadata ───────────────────────────────────────────────────────────────

export function getMetadata(lang: "en" | "zh"): StyleMetadata {
  const nameMap = { en: "Magazine Masthead", zh: "杂志刊头" };
  const themeMap = {
    en: "Deck covers and section thresholds with editorial gravitas — saturated color field, theatrical serif, and masthead authority",
    zh: "封面与章节门槛——饱和色域、戏剧化衬线字体与刊头式出版权威感",
  };
  const densityLabelMap = { en: "Reading-First", zh: "阅读优先" };

  const sceneTitles = {
    en: ["Masthead", "Fiction Excerpt", "Poetry", "Critical Essay", "Colophon"],
    zh: ["刊头", "小说节选", "诗歌", "评论随笔", "刊尾"],
  };

  const beatActions = {
    en: {
      1: ["Title and ornament appear"],
      2: ["Excerpt with drop cap", "Attribution fades in"],
      3: ["Poem title and author", "First stanza", "Second stanza"],
      4: ["Essay headline", "Body columns appear"],
      5: ["Closing statement"],
    },
    zh: {
      1: ["刊名与装饰呈现"],
      2: ["节选带首字下沉", "署名淡入"],
      3: ["诗题与作者", "第一节", "第二节"],
      4: ["评论标题", "正文栏呈现"],
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
    const content = SCENES[id][lang];
    const beatCount = BEAT_COUNTS[id];
    const actions = beatActions[lang][id as keyof (typeof beatActions)["en"]];

    const beats = Array.from({ length: beatCount }, (_, beatIdx) => {
      let beatTitle = "";
      let beatBody = "";

      if (id === 1) {
        beatTitle = content.title || "";
        beatBody = content.subtitle || "";
      } else if (id === 2) {
        beatTitle = content.label || "";
        beatBody = beatIdx >= 1 ? content.attribution || "" : content.text || "";
      } else if (id === 3) {
        beatTitle = content.poemTitle || "";
        beatBody = (content.stanzas || []).slice(0, beatIdx).join(" / ");
      } else if (id === 4) {
        beatTitle = content.headline || "";
        beatBody = beatIdx >= 1 ? (content.body?.[0] || "") : "";
      } else if (id === 5) {
        beatTitle = content.closing || "";
        beatBody = content.note || "";
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
    id: "18",
    band: "editorial-print",
    name: nameMap[lang],
    theme: themeMap[lang],
    densityLabel: densityLabelMap[lang],
    heroScene: 2,
    colors: {
      bg: "#1a3a2a",
      ink: "#f5f0e6",
      panel: "#2d5a3d",
    },
    typography: {
      header: "Playfair Display 900",
      body: "Inter 400",
    },
    tags: [
      "magazine",
      "masthead",
      "editorial",
      "fashion-serif",
      "saturated-field",
      "cover-page",
      "theatrical",
      "uppercase-chrome",
      "print-authority",
    ],
    fonts: ["Playfair Display", "Inter", "cjk:Noto Serif SC"],
    scenes,
  };
}

// ─── Transition constants ──────────────────────────────────────────────────

// ─── Component ──────────────────────────────────────────────────────────────

const BEAT_LAYOUT_MODES = {
  2: "motion",
  3: "motion",
  4: "motion",
} satisfies Record<number, "motion" | "reserved">;

export default function LiteraryReview({
  scene,
  beat,
  language,
  isThumbnail,
  reducedMotion,
  onNavigate,
}: BespokeStyleProps) {
  const [entered, setEntered] = useState(false);

  // Font injection
  useLayoutEffect(() => {
    const id = "style-18-fonts";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=Inter:wght@400;500;600&family=Noto+Serif+SC:wght@400;700&display=swap";
    document.head.appendChild(link);
  }, []);

  // Beat-level enter animation
  useEffect(() => {
    setEntered(false);
    const raf = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setEntered(true);
      });
    });
    return () => cancelAnimationFrame(raf);
  }, [scene]);

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
    const c = SCENES[sceneNum]?.[language] || SCENES[1][language];

    if (sceneNum === 1) {
      return (
        <div className={styles.journalMasthead}>
          <div className={styles.journalOrnament}>
            <span className={styles.journalOrnamentLine} />
            <span className={styles.journalOrnamentSymbol}>&#10086;</span>
            <span className={styles.journalOrnamentLine} />
          </div>
          <h1 className={styles.journalTitle}>{c.title}</h1>
          <p className={styles.journalSubtitle}>{c.subtitle}</p>
          <p className={styles.journalVolume}>
            {language === "zh" ? "第十八卷 · 2026年夏" : "Vol. XVIII · Summer 2026"}
          </p>
        </div>
      );
    }

    if (sceneNum === 2) {
      return (
        <div className={styles.excerptContainer}>
          <p className={styles.excerptLabel}>{c.label}</p>
          <div className={styles.excerptDividerTop}>
            <span className={styles.excerptDividerDiamond} />
          </div>
          <p className={styles.excerptText}>{c.text}</p>
          {beatNum >= 1 && (
            <p
              className={styles.excerptAttribution}
              style={{
                opacity: entered ? 0.6 : 0,
                transition: reducedMotion
                  ? "none"
                  : "opacity 0.8s ease 0.3s",
              }}
            >
              {c.attribution}
            </p>
          )}
          <div className={styles.excerptDividerBottom} />
        </div>
      );
    }

    if (sceneNum === 3) {
      const stanzas = c.stanzas || [];
      return (
        <div className={styles.poemContainer}>
          <h2 className={styles.poemTitle}>{c.poemTitle}</h2>
          <p className={styles.poemAuthor}>{c.poemAuthor}</p>
          {stanzas.slice(0, beatNum).map((stanza, i) => (
            <p
              key={i}
              className={styles.poemStanza}
              style={{
                opacity: entered ? 1 : 0,
                transform: entered ? "none" : "translateY(1cqh)",
                transition: reducedMotion
                  ? "none"
                  : `opacity 0.6s ease ${i * 0.2}s, transform 0.6s ease ${i * 0.2}s`,
              }}
            >
              {stanza.split("\n").map((line, j) => (
                <React.Fragment key={j}>
                  {line}
                  {j < stanza.split("\n").length - 1 && <br />}
                </React.Fragment>
              ))}
            </p>
          ))}
        </div>
      );
    }

    if (sceneNum === 4) {
      return (
        <div className={styles.essayContainer}>
          <div className={styles.essayHeader}>
            <p className={styles.essayKicker}>{c.kicker}</p>
            <h2 className={styles.essayHeadline}>{c.headline}</h2>
          </div>
          {beatNum >= 1 && (
            <div
              className={styles.essayBody}
              style={{
                opacity: entered ? 1 : 0,
                transition: reducedMotion
                  ? "none"
                  : "opacity 0.6s ease 0.2s",
              }}
            >
              {(c.body || []).map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          )}
        </div>
      );
    }

    if (sceneNum === 5) {
      return (
        <div className={styles.colophonContainer}>
          <div className={styles.colophonOrnament}>
            <span className={styles.colophonSymbol}>&#10086;</span>
          </div>
          <p className={styles.colophonText}>
            {(c.closing || "").split("\n").map((line, i) => (
              <React.Fragment key={i}>
                {line}
                {i < (c.closing || "").split("\n").length - 1 && <br />}
              </React.Fragment>
            ))}
          </p>
          <p className={styles.colophonNote}>{c.note}</p>
        </div>
      );
    }

    return null;
  };

  const renderNavIndicators = () => {
    if (isThumbnail) return null;

    return (
      <div className={styles.navIndicators} aria-label="Scene navigation">
        {[1, 2, 3, 4, 5].map((s) => {
          const isActive = s === scene;
          const classes = [
            styles.navIndicator,
            isActive ? styles.navIndicatorActive : "",
          ]
            .filter(Boolean)
            .join(" ");
          return (
            <button
              key={s}
              type="button"
              className={classes}
              aria-label={`Jump to scene ${s}`}
              onClick={(e) => handleNavClick(e, s)}
            >
              <span className={styles.navIndicatorDot} />
            </button>
          );
        })}
      </div>
    );
  };

  // ── Build layer classes ─────────────────────────────────────────────────

  return (
    <div className={rootClasses}>
            <SpatialSceneTrack
        scene={scene}
        beat={beat}
        transitionKind="fade"
        reducedMotion={reducedMotion || isThumbnail}
        beatLayoutModes={BEAT_LAYOUT_MODES}
        renderScene={(sceneId, sceneBeat) => (
          <div className={styles.sceneLayer}>
            <div className={styles.track}>
              {renderSceneFor(sceneId, sceneBeat)}
            </div>
          </div>
        )}
      />

      {renderNavIndicators()}
    </div>
  );
}

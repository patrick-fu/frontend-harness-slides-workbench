import React, { useLayoutEffect, useEffect, useState, useCallback } from "react";
import type { BespokeStyleProps, StyleMetadata } from "../types";
import SpatialSceneTrack from "./SpatialSceneTrack";
import styles from "./20-national-geographic.module.css";
import { useFLIP } from "../hooks/useFLIP";

// ─── Content ────────────────────────────────────────────────────────────────

interface SceneContent {
  en: {
    label?: string;
    title?: string;
    subtitle?: string;
    kicker?: string;
    deck?: string;
    caption?: string;
    credit?: string;
    galleryTitle?: string;
    galleryCards?: Array<{ title: string; caption: string }>;
    mapTitle?: string;
    stats?: Array<{ number: string; label: string }>;
    quote?: string;
    attribution?: string;
    org?: string;
  };
  zh: {
    label?: string;
    title?: string;
    subtitle?: string;
    kicker?: string;
    deck?: string;
    caption?: string;
    credit?: string;
    galleryTitle?: string;
    galleryCards?: Array<{ title: string; caption: string }>;
    mapTitle?: string;
    stats?: Array<{ number: string; label: string }>;
    quote?: string;
    attribution?: string;
    org?: string;
  };
}

const SCENES: Record<number, SceneContent> = {
  1: {
    en: {
      label: "Essay No. 14",
      title: "On the Nature of Knowing",
      subtitle: "Reflections on understanding in an age of information",
    },
    zh: {
      label: "第十四篇随笔",
      title: "论认知的本质",
      subtitle: "关于信息时代理解的反思",
    },
  },
  2: {
    en: {
      kicker: "Opening",
      title: "The Quiet Work of Attention",
      deck: "Before we can know anything deeply, we must first learn to pay attention — and attention, it turns out, is less a skill than a discipline of being present.",
      caption: "Every act of seeing is also an act of choosing what not to see.",
      credit: "— pinned to the wall, 3:47 am",
    },
    zh: {
      kicker: "开篇",
      title: "注意力的静默劳作",
      deck: "在我们能够深入认识任何事物之前，我们必须首先学会专注——而专注，与其说是一种技能，不如说是一种在场的修炼。",
      caption: "每一次看见的行为，也是一次选择不去看什么的行为。",
      credit: "—— 钉在墙上，凌晨3:47",
    },
  },
  3: {
    en: {
      label: "Three Propositions",
      galleryTitle: "What We Carry Forward",
      galleryCards: [
        {
          title: "I. Memory is not storage",
          caption: "It is reconstruction. Every recall rebuilds the past from fragments of the present, which is why remembering changes us.",
        },
        {
          title: "II. Understanding is embodied",
          caption: "We do not think with our brains alone but with our hands, our environments, and the people around us. Knowledge is distributed.",
        },
        {
          title: "III. Wisdom requires slowness",
          caption: "The pace of insight cannot be accelerated. What arrives quickly is information; what settles slowly is understanding.",
        },
      ],
    },
    zh: {
      label: "三个命题",
      galleryTitle: "我们传承的东西",
      galleryCards: [
        {
          title: "一、记忆不是存储",
          caption: "它是重建。每一次回忆都从当下的碎片中重建过去，这就是为什么记忆改变着我们。",
        },
        {
          title: "二、理解是具身的",
          caption: "我们不仅仅用大脑思考，还用双手、环境和周围的人思考。知识是分布式的。",
        },
        {
          title: "三、智慧需要缓慢",
          caption: "洞见的节奏无法加速。快速到达的是信息；缓慢沉淀的是理解。",
        },
      ],
    },
  },
  4: {
    en: {
      label: "By the Numbers",
      mapTitle: "The Architecture of Thought",
      stats: [
        { number: "01", label: "The mind needs silence to think" },
        { number: "07", label: "Years to master a domain, not days" },
        { number: "40%", label: "Of what we 'know' is actually inference" },
      ],
    },
    zh: {
      label: "数据佐证",
      mapTitle: "思想的建筑",
      stats: [
        { number: "01", label: "心灵需要沉默才能思考" },
        { number: "07", label: "掌握一个领域需要年，不是天" },
        { number: "40%", label: "我们'知道'的东西其实是推断" },
      ],
    },
  },
  5: {
    en: {
      quote: "The most important thing we can learn in this century is not what to think, but how to be with what we do not yet understand.",
      attribution: "— From the Margins",
      org: "Scholar's Vellum — Essay XIV — 2026",
    },
    zh: {
      quote: "在这个世纪，我们能学到的最重要的东西，不是该想什么，而是如何与我们尚未理解的事物共处。",
      attribution: "—— 摘自页边笔记",
      org: "学者羊皮卷 — 第十四篇 — 2026",
    },
  },
};

// ─── Metadata ───────────────────────────────────────────────────────────────

export function getMetadata(lang: "en" | "zh"): StyleMetadata {
  const nameMap = { en: "Scholar's Vellum", zh: "学者羊皮卷" };
  const themeMap = {
    en: "Research essays and reflective decks — warm-dark library wall with candlelit amber-cream italic serif and dusty teal annotations",
    zh: "研究随笔与反思型演示——暖色深色图书馆墙配以烛光琥珀米色斜体衬线与灰青色注解",
  };
  const densityLabelMap = { en: "Reading-First", zh: "阅读优先" };

  const sceneTitles = {
    en: ["Title Page", "Opening Essay", "Three Propositions", "Architecture of Thought", "Marginalia"],
    zh: ["扉页", "开篇随笔", "三个命题", "思想的建筑", "页边笔记"],
  };

  const beatActions = {
    en: {
      1: ["Manuscript title appears"],
      2: ["Essay opening with caption", "Deck text reveals"],
      3: ["Proposition I", "Proposition II", "Proposition III"],
      4: ["Thought architecture visual", "Stats column reveals"],
      5: ["Marginalia quote with attribution"],
    },
    zh: {
      1: ["手稿标题呈现"],
      2: ["随笔开篇配注解", "正文段落揭示"],
      3: ["命题一", "命题二", "命题三"],
      4: ["思想建筑视觉", "数据栏揭示"],
      5: ["页边引语配署名"],
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
        beatTitle = content.title || "";
        beatBody = beatIdx >= 1 ? content.deck || "" : content.caption || "";
      } else if (id === 3) {
        beatTitle = content.galleryTitle || "";
        const visible = (content.galleryCards || []).slice(0, beatIdx + 1);
        beatBody = visible.map((c) => c.title).join(" / ");
      } else if (id === 4) {
        beatTitle = content.mapTitle || "";
        beatBody = beatIdx >= 1 ? (content.stats?.map((s) => `${s.number} ${s.label}`).join(" / ") || "") : "";
      } else if (id === 5) {
        beatTitle = content.quote || "";
        beatBody = content.attribution || "";
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
    id: "scholars-vellum",
    band: "editorial-print",
    name: nameMap[lang],
    theme: themeMap[lang],
    densityLabel: densityLabelMap[lang],
    heroScene: 3,
    colors: {
      bg: "#1c1f2e",
      ink: "#f0e6c8",
      panel: "#252838",
    },
    typography: {
      header: "Source Serif Pro Italic",
      body: "Inter 300",
    },
    tags: [
      "scholarly",
      "vellum",
      "warm-dark",
      "italic-serif",
      "candlelight",
      "manuscript",
      "contemplative",
      "mono-annotation",
      "library-quiet",
    ],
    fonts: ["Source Serif Pro", "Inter", "IBM Plex Mono", "cjk:Noto Serif SC"],
    scenes,
  };
}

// ─── Transition constants ─────────────────────────────────────────────────

// ─── Component ──────────────────────────────────────────────────────────────

const BEAT_LAYOUT_MODES = {
  2: "motion",
  3: "motion",
  4: "motion",
} satisfies Record<number, "motion" | "reserved">;

export default function NationalGeographic({
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
    const id = "style-20-fonts";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Source+Serif+Pro:ital,wght@0,400;0,600;0,700;1,400;1,600;1,700&family=Inter:wght@300;400;500&family=IBM+Plex+Mono:wght@400;500&family=Noto+Serif+SC:wght@400;700&display=swap";
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
  }, [scene, beat]);

  // FLIP for scene 3 gallery grid
  const { ref: galleryGridRef } = useFLIP<HTMLDivElement>({
    watch: [beat],
    duration: 400,
    easing: "cubic-bezier(0.16, 1, 0.3, 1)",
    selector: `.${styles.galleryCard}`,
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

  const renderSceneFor = (sceneNum: number, beatNum: number) => {
    const sc = SCENES[sceneNum]?.[language] || SCENES[1][language];

    if (sceneNum === 1) {
      return (
        <div className={styles.coverScene}>
          <div className={styles.coverPhoto} />
          <div className={styles.coverContent}>
            <div className={styles.coverYellowBar} />
            <p className={styles.coverLabel}>{sc.label}</p>
            <h1 className={styles.coverTitle}>{sc.title}</h1>
            <p className={styles.coverSubtitle}>{sc.subtitle}</p>
          </div>
        </div>
      );
    }

    if (sceneNum === 2) {
      return (
        <div className={styles.featureScene}>
          <div className={styles.featurePhoto}>
            <div className={styles.featurePhotoGradient} />
            {beatNum >= 0 && (
              <div
                className={styles.featurePhotoCaption}
                style={{
                  opacity: entered ? 1 : 0,
                  transition: reducedMotion
                    ? "none"
                    : "opacity 0.6s ease 0.2s",
                }}
              >
                <p className={styles.featurePhotoCaptionText}>
                  {sc.caption}
                </p>
                <p className={styles.featurePhotoCaptionCredit}>
                  {sc.credit}
                </p>
              </div>
            )}
          </div>
          <div
            className={styles.featureText}
            style={{
              opacity: entered ? 1 : 0,
              transform: entered ? "none" : "translateX(2cqw)",
              transition: reducedMotion
                ? "none"
                : "opacity 0.6s ease 0.1s, transform 0.6s ease 0.1s",
            }}
          >
            <p className={styles.featureKicker}>{sc.kicker}</p>
            <h2 className={styles.featureHeadline}>{sc.title}</h2>
            {beatNum >= 1 && (
              <p
                className={styles.featureDeck}
                style={{
                  opacity: entered ? 0.75 : 0,
                  transition: reducedMotion
                    ? "none"
                    : "opacity 0.5s ease 0.3s",
                }}
              >
                {sc.deck}
              </p>
            )}
          </div>
        </div>
      );
    }

    if (sceneNum === 3) {
      const cards = sc.galleryCards || [];
      return (
        <div className={styles.galleryScene}>
          <div className={styles.galleryHeader}>
            <div className={styles.galleryYellowAccent} />
            <div>
              <p className={styles.galleryLabel}>{sc.label}</p>
              <h2 className={styles.galleryTitle}>{sc.galleryTitle}</h2>
            </div>
          </div>
          <div
            className={styles.galleryGrid}
            ref={sceneNum === scene ? galleryGridRef : undefined}
          >
            {cards.map((card, i) => {
              const visible = i <= beatNum;
              return (
                <div
                  key={i}
                  className={styles.galleryCard}
                  style={{
                    opacity: visible && entered ? 1 : 0,
                    transform:
                      visible && entered ? "none" : "translateY(2cqh)",
                    transition: reducedMotion
                      ? "none"
                      : `opacity 0.5s ease ${i * 0.15}s, transform 0.5s ease ${i * 0.15}s`,
                  }}
                >
                  <div className={styles.galleryCardPhoto}>
                    <span className={styles.galleryCardNumber}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <p className={styles.galleryCardCaption}>
                    <strong>{card.title}</strong>
                    {card.caption}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    if (sceneNum === 4) {
      const stats = sc.stats || [];
      return (
        <div className={styles.mapScene}>
          <div className={styles.mapHeader}>
            <div className={styles.mapYellowBar} />
            <div>
              <p className={styles.mapLabel}>{sc.label}</p>
              <h2 className={styles.mapTitle}>{sc.mapTitle}</h2>
            </div>
          </div>
          <div className={styles.mapBody}>
            <div
              className={styles.mapVisual}
              style={{
                opacity: entered ? 1 : 0,
                transition: reducedMotion
                  ? "none"
                  : "opacity 0.5s ease",
              }}
            >
              <span className={styles.mapVisualLabel}>
                {language === "zh" ? "地图区域" : "Map Area"}
              </span>
            </div>
            {beatNum >= 1 && (
              <div
                className={styles.mapStats}
                style={{
                  opacity: entered ? 1 : 0,
                  transform: entered ? "none" : "translateX(2cqw)",
                  transition: reducedMotion
                    ? "none"
                    : "opacity 0.5s ease 0.15s, transform 0.5s ease 0.15s",
                }}
              >
                {stats.map((stat, i) => (
                  <div key={i} className={styles.mapStat}>
                    <div className={styles.mapStatNumber}>
                      {stat.number}
                    </div>
                    <div className={styles.mapStatLabel}>
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      );
    }

    if (sceneNum === 5) {
      return (
        <div className={styles.closingScene}>
          <div className={styles.closingBg} />
          <div className={styles.closingContent}>
            <div className={styles.closingYellowBar} />
            <blockquote className={styles.closingQuote}>
              "{sc.quote}"
            </blockquote>
            <p className={styles.closingAttribution}>
              {sc.attribution}
            </p>
            <p className={styles.closingOrg}>{sc.org}</p>
          </div>
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
      {/* Persistent yellow frame border (Nat Geo brand anchor) */}
      <div className={styles.yellowFrame} aria-hidden="true" />

            <SpatialSceneTrack
        scene={scene}
        beat={beat}
        transitionKind="scale-fade"
        reducedMotion={reducedMotion || isThumbnail}
        beatLayoutModes={BEAT_LAYOUT_MODES}
        renderScene={(sceneId, sceneBeat) => (
          <div className={styles.sceneLayer}>
            {renderSceneFor(sceneId, sceneBeat)}
          </div>
        )}
      />

      {/* Yellow frame reveal overlay (animated during transition) */}

      {renderNavIndicators()}
    </div>
  );
}

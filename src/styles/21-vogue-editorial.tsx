import React, { useEffect, useState, useRef, useCallback } from "react";
import type { BespokeStyleProps, StyleMetadata } from "../types";
import styles from "./21-vogue-editorial.module.css";

// ─── Content ────────────────────────────────────────────────────────────────

interface SceneContent {
  en: {
    logo?: string;
    issue?: string;
    title?: string;
    subtitle?: string;
    kicker?: string;
    headline?: string;
    body?: string;
    galleryLabel?: string;
    galleryTitle?: string;
    portraits?: Array<{ name: string; role: string }>;
    trendLabel?: string;
    trendTitle?: string;
    trends?: Array<{ name: string; desc: string }>;
    closing?: string;
    sig?: string;
  };
  zh: {
    logo?: string;
    issue?: string;
    title?: string;
    subtitle?: string;
    kicker?: string;
    headline?: string;
    body?: string;
    galleryLabel?: string;
    galleryTitle?: string;
    portraits?: Array<{ name: string; role: string }>;
    trendLabel?: string;
    trendTitle?: string;
    trends?: Array<{ name: string; desc: string }>;
    closing?: string;
    sig?: string;
  };
}

const SCENES: Record<number, SceneContent> = {
  1: {
    en: {
      logo: "Vogue",
      issue: "The Culture Issue — July 2026",
      title: "The New Silhouette",
      subtitle: "How cultural currents are reshaping the way we present ourselves",
    },
    zh: {
      logo: "Vogue",
      issue: "文化特刊 — 2026年7月",
      title: "新轮廓",
      subtitle: "文化潮流如何重塑我们展现自我的方式",
    },
  },
  2: {
    en: {
      kicker: "Fashion & Identity",
      headline: "The Unraveling of Uniform",
      body: "In an era defined by fluidity and self-invention, the very notion of a signature look is being re-examined. Designers are moving away from the tyranny of the seasonal silhouette, embracing instead a more personal, idiosyncratic approach to dressing that speaks to the complexity of modern identity.",
    },
    zh: {
      kicker: "时尚与身份",
      headline: "制服的消解",
      body: "在一个以流动性和自我重塑为特征的时代，标志性造型这一概念本身正在被重新审视。设计师们正在摆脱季节性轮廓的束缚，转而拥抱一种更加个人化、不拘一格的着装方式，它诉说着现代身份的复杂性。",
    },
  },
  3: {
    en: {
      galleryLabel: "Voices",
      galleryTitle: "Three Women\nRedefining the Frame",
      portraits: [
        { name: "Amara Okafor", role: "Designer" },
        { name: "Lin Mei", role: "Photographer" },
        { name: "Sofia Rivera", role: "Curator" },
      ],
    },
    zh: {
      galleryLabel: "声音",
      galleryTitle: "三位女性\n正在重新定义框架",
      portraits: [
        { name: "阿玛拉·奥卡福", role: "设计师" },
        { name: "林梅", role: "摄影师" },
        { name: "索菲娅·里维拉", role: "策展人" },
      ],
    },
  },
  4: {
    en: {
      trendLabel: "The Agenda",
      trendTitle: "Three Shifts\nDefining the Season",
      trends: [
        {
          name: "Quiet Luxury 2.0",
          desc: "Understatement evolves — it is no longer about invisibility, but about the confidence of restraint.",
        },
        {
          name: "Digital Couture",
          desc: "Virtual garments move from novelty to necessity as digital spaces become primary social venues.",
        },
        {
          name: "Sustainable Craft",
          desc: "Artisanal techniques meet environmental consciousness in a new wave of material honesty.",
        },
      ],
    },
    zh: {
      trendLabel: "议题",
      trendTitle: "定义本季的\n三个转变",
      trends: [
        {
          name: "静谧奢华 2.0",
          desc: "低调在演变——它不再关于隐形，而是关于克制的自信。",
        },
        {
          name: "数字高定",
          desc: "随着数字空间成为主要社交场所，虚拟服装从新奇走向必需。",
        },
        {
          name: "可持续工艺",
          desc: "在新一轮材料诚实性浪潮中，手工技艺与环保意识相遇。",
        },
      ],
    },
  },
  5: {
    en: {
      closing: "Style is a way\nto say who you are\nwithout speaking.",
      sig: "— Vogue Editorial",
    },
    zh: {
      closing: "风格是一种\n无需开口\n就能说明你是谁的方式。",
      sig: "—— Vogue 编辑部",
    },
  },
};

// ─── Metadata ───────────────────────────────────────────────────────────────

export function getMetadata(lang: "en" | "zh"): StyleMetadata {
  const nameMap = { en: "Vogue Editorial", zh: "Vogue 编辑" };
  const themeMap = {
    en: "Cultural trends analysis — high fashion magazine aesthetic with elegant serif italics and generous white space",
    zh: "文化趋势分析——高级时尚杂志美学，优雅衬线斜体与充裕留白",
  };
  const densityLabelMap = { en: "Airy", zh: "疏朗" };

  const sceneTitles = {
    en: ["Cover", "Editorial Spread", "Voices", "Trend Agenda", "Closing"],
    zh: ["封面", "编辑跨页", "声音", "趋势议题", "结语"],
  };

  const beatActions = {
    en: {
      1: ["Logo and cover title appear"],
      2: ["Headline reveals", "Body text fades in"],
      3: ["Portrait 1", "Portrait 2", "Portrait 3"],
      4: ["Trend title appears", "Trend items reveal"],
      5: ["Closing statement"],
    },
    zh: {
      1: ["刊名与封面标题呈现"],
      2: ["标题呈现", "正文淡入"],
      3: ["肖像一", "肖像二", "肖像三"],
      4: ["趋势标题呈现", "趋势条目呈现"],
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
        beatTitle = content.headline || "";
        beatBody = beatIdx >= 1 ? content.body || "" : "";
      } else if (id === 3) {
        beatTitle = content.galleryTitle || "";
        const visible = (content.portraits || []).slice(0, beatIdx + 1);
        beatBody = visible.map((p) => p.name).join(" / ");
      } else if (id === 4) {
        beatTitle = content.trendTitle || "";
        beatBody = beatIdx >= 1 ? (content.trends?.map((t) => t.name).join(" / ") || "") : "";
      } else if (id === 5) {
        beatTitle = content.closing || "";
        beatBody = content.sig || "";
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
    id: "21",
    band: "editorial-print",
    name: nameMap[lang],
    theme: themeMap[lang],
    densityLabel: densityLabelMap[lang],
    heroScene: 2,
    colors: {
      bg: "#fefefe",
      ink: "#1a1a1a",
      panel: "#f5f5f5",
    },
    typography: {
      header: "Playfair Display Italic",
      body: "Inter 300",
    },
    tags: [
      "fashion",
      "vogue",
      "elegant",
      "serif-italic",
      "airy",
      "white-space",
      "editorial",
      "culture",
      "minimal",
    ],
    fonts: ["Playfair Display", "Inter", "cjk:Noto Serif SC"],
    scenes,
  };
}

// ─── Component ──────────────────────────────────────────────────────────────

export default function VogueEditorial({
  scene,
  beat,
  language,
  isThumbnail,
  reducedMotion,
  onNavigate,
}: BespokeStyleProps) {
  const content = SCENES[scene]?.[language] || SCENES[1][language];
  const [entered, setEntered] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

  // Font injection
  useEffect(() => {
    const id = "style-21-fonts";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=Inter:wght@300;400;500&family=Noto+Serif+SC:wght@400;700&display=swap";
    document.head.appendChild(link);
  }, []);

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

  const trackClasses = [
    styles.track,
    entered ? styles.trackActive : styles.trackEnter,
  ]
    .filter(Boolean)
    .join(" ");

  const renderSceneContent = () => {
    if (scene === 1) {
      return (
        <div className={styles.vogueCover}>
          <div className={styles.vogueCoverImage} />
          <div className={styles.vogueCoverContent}>
            <div className={styles.vogueMasthead}>
              <h1 className={styles.vogueLogo}>{content.logo}</h1>
              <p className={styles.vogueIssue}>{content.issue}</p>
            </div>
            <div className={styles.vogueCoverBottom}>
              <h2 className={styles.vogueCoverTitle}>{content.title}</h2>
              <p className={styles.vogueCoverSub}>{content.subtitle}</p>
            </div>
          </div>
        </div>
      );
    }

    if (scene === 2) {
      return (
        <div className={styles.vogueSpread}>
          <div className={styles.vogueSpreadImage}>
            <span className={styles.vogueSpreadImageLabel}>
              {language === "zh" ? "摄影" : "Photograph"}
            </span>
          </div>
          <div className={styles.vogueSpreadText}>
            <p className={styles.vogueSpreadKicker}>{content.kicker}</p>
            <h2 className={styles.vogueSpreadHeadline}>
              {content.headline}
            </h2>
            <div className={styles.vogueHairline} />
            {beat >= 1 && (
              <p
                className={styles.vogueSpreadBody}
                style={{
                  opacity: entered ? 0.75 : 0,
                  transition: reducedMotion
                    ? "none"
                    : "opacity 0.6s ease 0.2s",
                }}
              >
                {content.body}
              </p>
            )}
          </div>
        </div>
      );
    }

    if (scene === 3) {
      const portraits = content.portraits || [];
      return (
        <div className={styles.vogueGallery}>
          <div className={styles.vogueGalleryHeader}>
            <p className={styles.vogueGalleryLabel}>
              {content.galleryLabel}
            </p>
            <h2 className={styles.vogueGalleryTitle}>
              {(content.galleryTitle || "").split("\n").map((line, i) => (
                <React.Fragment key={i}>
                  {line}
                  {i < (content.galleryTitle || "").split("\n").length - 1 && <br />}
                </React.Fragment>
              ))}
            </h2>
          </div>
          <div className={styles.vogueGalleryGrid}>
            {portraits.map((p, i) => {
              const visible = i <= beat;
              return (
                <div
                  key={i}
                  className={styles.voguePortrait}
                  style={{
                    opacity: visible && entered ? 1 : 0,
                    transform:
                      visible && entered ? "none" : "translateY(1.5cqh)",
                    transition: reducedMotion
                      ? "none"
                      : `opacity 0.5s ease ${i * 0.15}s, transform 0.5s ease ${i * 0.15}s`,
                  }}
                >
                  <div className={styles.voguePortraitFrame} />
                  <h3 className={styles.voguePortraitName}>{p.name}</h3>
                  <p className={styles.voguePortraitRole}>{p.role}</p>
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    if (scene === 4) {
      const trends = content.trends || [];
      return (
        <div className={styles.vogueTrend}>
          <div className={styles.vogueTrendHeader}>
            <p className={styles.vogueTrendLabel}>{content.trendLabel}</p>
            <h2 className={styles.vogueTrendTitle}>
              {(content.trendTitle || "").split("\n").map((line, i) => (
                <React.Fragment key={i}>
                  {line}
                  {i < (content.trendTitle || "").split("\n").length - 1 && <br />}
                </React.Fragment>
              ))}
            </h2>
          </div>
          {beat >= 1 && (
            <div
              className={styles.vogueTrendItems}
              style={{
                opacity: entered ? 1 : 0,
                transition: reducedMotion
                  ? "none"
                  : "opacity 0.5s ease 0.15s",
              }}
            >
              {trends.map((t, i) => (
                <div key={i} className={styles.vogueTrendItem}>
                  <span className={styles.vogueTrendNumber}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className={styles.vogueTrendText}>
                    <h3 className={styles.vogueTrendName}>{t.name}</h3>
                    <p className={styles.vogueTrendDesc}>{t.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    if (scene === 5) {
      return (
        <div className={styles.vogueClosing}>
          <div className={styles.vogueClosingHairline} />
          <p className={styles.vogueClosingText}>
            {(content.closing || "").split("\n").map((line, i) => (
              <React.Fragment key={i}>
                {line}
                {i < (content.closing || "").split("\n").length - 1 && <br />}
              </React.Fragment>
            ))}
          </p>
          <p className={styles.vogueClosingSig}>{content.sig}</p>
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
              <span className={styles.navIndicatorLine} />
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <div className={rootClasses}>
      <div
        ref={trackRef}
        key={`21-${scene}`}
        className={trackClasses}
        style={reducedMotion ? { transitionDuration: "0s" } : undefined}
      >
        {renderSceneContent()}
      </div>
      {renderNavIndicators()}
    </div>
  );
}

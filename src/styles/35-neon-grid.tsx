import React, { useEffect, useState, useCallback } from "react";
import type { BespokeStyleProps, StyleMetadata } from "../types";
import SpatialSceneTrack from "./SpatialSceneTrack";
import styles from "./35-neon-grid.module.css";

// ─── Font Injection ────────────────────────────────────────────────────────

function useFonts() {
  useEffect(() => {
    const id = "style-35-fonts";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Inter:wght@300;400;500;600&display=swap";
    document.head.appendChild(link);
  }, []);
}

// ─── Content ────────────────────────────────────────────────────────────────

const SCENES = {
  1: {
    en: {
      title: "The Grove",
      subtitle: "A brand retrospective rooted in organic craft",
    },
    zh: {
      title: "林间",
      subtitle: "植根于有机工艺的品牌回顾",
    },
  },
  2: {
    en: {
      label: "Chapter I",
      heading: "Foundations",
      cards: [
        {
          icon: "🌿",
          title: "Botanical Identity",
          desc: "Our visual language draws from the quiet geometry of fern fronds, leaf venation, and the slow unfurling of new growth.",
          tag: "Origins",
        },
        {
          icon: "🪵",
          title: "Material Honesty",
          desc: "Solid walnut, hand-thrown ceramic, and unbleached linen — chosen for the way they age and patina with use.",
          tag: "Craft",
        },
        {
          icon: "🍂",
          title: "Seasonal Rhythm",
          desc: "We design for the long arc: collections that shift with the seasons rather than chasing every trend.",
          tag: "Philosophy",
        },
      ],
    },
    zh: {
      label: "第一章",
      heading: "根基",
      cards: [
        {
          icon: "🌿",
          title: "植物身份",
          desc: "我们的视觉语言取自蕨类叶片的静谧几何、叶脉纹理，以及新芽舒展的缓慢节奏。",
          tag: "起源",
        },
        {
          icon: "🪵",
          title: "材料真诚",
          desc: "实心胡桃木、手工拉坯陶瓷、未漂白亚麻——因岁月沉淀和使用痕迹而被选择。",
          tag: "工艺",
        },
        {
          icon: "🍂",
          title: "季节节律",
          desc: "我们为长远而设计：系列随四季更迭，而非追逐每一个潮流。",
          tag: "理念",
        },
      ],
    },
  },
  3: {
    en: {
      label: "Timeline",
      heading: "Through the Years",
      nodes: [
        { year: "2011", label: "Studio founded in a converted greenhouse" },
        { year: "2014", label: "First furniture collection: Canopy series" },
        { year: "2017", label: "Textile line launched with natural dyes" },
        { year: "2020", label: "Expanded to ceramics and tableware" },
        { year: "2024", label: "Flagship gallery opens in the Grove District" },
      ],
    },
    zh: {
      label: "年表",
      heading: "岁月流转",
      nodes: [
        { year: "2011", label: "工作室成立于一间改造的花房" },
        { year: "2014", label: "首个家具系列：Canopy 系列" },
        { year: "2017", label: "天然染料纺织线发布" },
        { year: "2020", label: "扩展至陶瓷和餐具" },
        { year: "2024", label: "旗舰展厅在林间区开业" },
      ],
    },
  },
  4: {
    en: {
      quote: "We make things that grow more beautiful with every year of use.",
      author: "— Founders' Letter, 2011",
      stats: [
        { value: "14", label: "Years of Craft" },
        { value: "47", label: "Artisans" },
        { value: "100%", label: "Natural Materials" },
      ],
    },
    zh: {
      quote: "我们创造的事物，每使用一年便愈加美丽。",
      author: "——创始人寄语，2011",
      stats: [
        { value: "14", label: "年工艺传承" },
        { value: "47", label: "位匠人" },
        { value: "100%", label: "天然材料" },
      ],
    },
  },
  5: {
    en: {
      big: "Stay Rooted",
      sub: "The grove grows slowly, and so do we.",
    },
    zh: {
      big: "保持根基",
      sub: "林间生长缓慢，我们亦是如此。",
    },
  },
};

// ─── Metadata ───────────────────────────────────────────────────────────────

export function getMetadata(lang: "en" | "zh"): StyleMetadata {
  const nameMap = { en: "Mid-Century Grove", zh: "中世纪林间" };
  const themeMap = {
    en: "Brand Storytelling — botanical specimen card aesthetic with deep forest ground, warm cream text, rust-orange accent and classical serif",
    zh: "品牌叙事——植物标本卡美学，深森林底色、温暖奶油文字、铁锈橙点缀和古典衬线体",
  };
  const densityLabelMap = { en: "Editorial-Organic", zh: "编辑有机" };

  const sceneTitles = {
    en: ["Title", "Foundations", "Timeline", "Hero Quote", "Closing"],
    zh: ["标题", "根基", "年表", "核心引语", "结语"],
  };

  const beatActions = {
    en: {
      1: ["Title ignites"],
      2: ["Cards appear one by one"],
      3: ["Timeline nodes illuminate"],
      4: ["Quote fades in", "Stats appear"],
      5: ["Closing message"],
    },
    zh: {
      1: ["标题点亮"],
      2: ["卡片依次呈现"],
      3: ["时间节点点亮"],
      4: ["引语淡入", "数据呈现"],
      5: ["结语呈现"],
    },
  };

  const BEAT_COUNTS: Record<number, number> = {
    1: 1,
    2: 3,
    3: 2,
    4: 2,
    5: 1,
  };

  const scenes = [1, 2, 3, 4, 5].map((id) => {
    const beatCount = BEAT_COUNTS[id];
    const actions = beatActions[lang][id as keyof (typeof beatActions)["en"]];
    const c = SCENES[id as keyof typeof SCENES][lang];

    const beats = Array.from({ length: beatCount }, (_, beatIdx) => {
      let beatTitle = "";
      let beatBody = "";

      if (id === 1) {
        const c1 = c as unknown as { title: string; subtitle: string };
        beatTitle = c1.title;
        beatBody = c1.subtitle;
      } else if (id === 2) {
        const c2 = c as unknown as { heading: string; cards: Array<{ title: string }> };
        beatTitle = c2.heading;
        const visible = c2.cards.slice(0, beatIdx + 1);
        beatBody = visible.map((card) => card.title).join(" / ");
      } else if (id === 3) {
        const c3 = c as unknown as { heading: string; nodes: Array<{ year: string; label: string }> };
        beatTitle = c3.heading;
        const visible = c3.nodes.slice(0, (beatIdx + 1) * 3);
        beatBody = visible.map((n) => `${n.year}: ${n.label}`).join(" / ");
      } else if (id === 4) {
        const c4 = c as unknown as { quote: string; author: string; stats: Array<{ value: string; label: string }> };
        beatTitle = c4.quote;
        beatBody = beatIdx >= 1 ? c4.stats.map((s) => `${s.value} ${s.label}`).join(" / ") : c4.author;
      } else if (id === 5) {
        const c5 = c as unknown as { big: string; sub: string };
        beatTitle = c5.big;
        beatBody = c5.sub;
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
    id: "35",
    band: "contemporary-digital",
    name: nameMap[lang],
    theme: themeMap[lang],
    densityLabel: densityLabelMap[lang],
    heroScene: 4,
    colors: {
      bg: "#1a2e1f",
      ink: "#f5efe0",
      panel: "#243828",
    },
    typography: {
      header: "Playfair Display 600",
      body: "Inter 400",
    },
    tags: [
      "botanical",
      "organic",
      "mid-century",
      "forest",
      "cream",
      "rust",
      "serif",
      "linen",
      "craft",
      "editorial",
    ],
    fonts: ["Playfair Display", "Inter"],
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

export default function NeonGrid({
  scene,
  beat,
  language,
  isThumbnail,
  reducedMotion,
  onNavigate,
}: BespokeStyleProps) {
  useFonts();

  // ── Dual-scene transition state ────────────────────────────────────────

  // Per-scene element enter animation
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    setEntered(false);
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setEntered(true);
      });
    });
    return () => cancelAnimationFrame(id);
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
  ]
    .filter(Boolean)
    .join(" ");

  // Shared background layers
  const renderBackground = () => (
    <>
      <div className={styles.sunsetBg} />
      <div className={styles.retroSun} />
      <div className={styles.gridFloor}>
        <div className={styles.gridFloorInner} />
      </div>
    </>
  );

  // ── Scene 1: Title ──────────────────────────────────────────────────────

  const renderScene1 = (isEntered: boolean) => {
    const c = SCENES[1][language];
    return (
      <>
        {renderBackground()}
        <div className={styles.titleScene}>
          <h1
            className={styles.neonTitle}
            style={{
              opacity: isEntered ? 1 : 0,
              transform: isEntered ? "scale(1)" : "scale(0.9)",
              transition: reducedMotion
                ? "none"
                : "opacity 0.8s ease, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            {c.title}
          </h1>
          <p
            className={styles.neonSubtitle}
            style={{
              opacity: isEntered ? 1 : 0,
              transition: reducedMotion
                ? "none"
                : "opacity 0.8s ease 0.3s",
            }}
          >
            {c.subtitle}
          </p>
        </div>
      </>
    );
  };

  // ── Scene 2: Culture Cards ──────────────────────────────────────────────

  const renderScene2 = (beatNum: number, isEntered: boolean) => {
    const c = SCENES[2][language];
    return (
      <>
        {renderBackground()}
        <div className={styles.cultureScene}>
          <span className={styles.sceneLabel}>{c.label}</span>
          <h2
            className={styles.sceneHeading}
            style={{
              opacity: isEntered ? 1 : 0,
              transform: isEntered ? "translateX(0)" : "translateX(-2cqw)",
              transition: reducedMotion
                ? "none"
                : "opacity 0.5s ease, transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            {c.heading}
          </h2>
          <div className={styles.cultureGrid}>
            {c.cards.map((card, i) => {
              const visible = isEntered && i <= beatNum;
              return (
                <div
                  key={i}
                  className={`${styles.cultureCard} ${visible ? styles.cultureCardVisible : ""}`}
                  style={{
                    transitionDelay: reducedMotion ? "0s" : `${i * 0.15}s`,
                  }}
                >
                  <div className={styles.cultureCardIcon}>{card.icon}</div>
                  <h3 className={styles.cultureCardTitle}>{card.title}</h3>
                  <p className={styles.cultureCardDesc}>{card.desc}</p>
                  <span className={styles.cultureCardTag}>{card.tag}</span>
                </div>
              );
            })}
          </div>
        </div>
      </>
    );
  };

  // ── Scene 3: Timeline ───────────────────────────────────────────────────

  const renderScene3 = (beatNum: number, isEntered: boolean) => {
    const c = SCENES[3][language];
    return (
      <>
        {renderBackground()}
        <div className={styles.timelineScene}>
          <span className={styles.sceneLabel}>{c.label}</span>
          <h2
            className={styles.sceneHeading}
            style={{
              opacity: isEntered ? 1 : 0,
              transition: reducedMotion ? "none" : "opacity 0.5s ease",
            }}
          >
            {c.heading}
          </h2>
          <div className={styles.timelineTrack}>
            <div
              className={styles.timelineLine}
              style={{
                opacity: isEntered ? 1 : 0,
                transform: isEntered ? "translateY(-50%) scaleX(1)" : "translateY(-50%) scaleX(0)",
                transition: reducedMotion
                  ? "none"
                  : "opacity 0.5s ease, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            />
            <div className={styles.timelineNodes}>
              {c.nodes.map((node, i) => {
                const visible = isEntered && beatNum >= (i < 3 ? 0 : 1);
                return (
                  <div
                    key={i}
                    className={`${styles.timelineNode} ${visible ? styles.timelineNodeVisible : ""}`}
                    style={{
                      transitionDelay: reducedMotion ? "0s" : `${i * 0.12}s`,
                    }}
                  >
                    <span className={styles.timelineYear}>{node.year}</span>
                    <div className={styles.timelineDot} />
                    <span className={styles.timelineLabel}>{node.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </>
    );
  };

  // ── Scene 4: Hero Quote ─────────────────────────────────────────────────

  const renderScene4 = (beatNum: number, isEntered: boolean) => {
    const c = SCENES[4][language];
    return (
      <>
        {renderBackground()}
        <div className={styles.heroScene}>
          <div
            className={styles.heroQuoteMark}
            style={{
              opacity: isEntered ? 0.6 : 0,
              transition: reducedMotion ? "none" : "opacity 0.6s ease",
            }}
          >
            &ldquo;
          </div>
          <blockquote
            className={styles.heroQuote}
            style={{
              opacity: isEntered ? 1 : 0,
              transform: isEntered ? "translateY(0)" : "translateY(1.5cqh)",
              transition: reducedMotion
                ? "none"
                : "opacity 0.7s ease 0.1s, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.1s",
            }}
          >
            {c.quote}
          </blockquote>
          <cite
            className={styles.heroAuthor}
            style={{
              opacity: isEntered ? 1 : 0,
              transition: reducedMotion ? "none" : "opacity 0.5s ease 0.4s",
              fontStyle: "normal",
            }}
          >
            {c.author}
          </cite>
          {beatNum >= 1 && (
            <div
              className={styles.heroStats}
              style={{
                opacity: isEntered ? 1 : 0,
                transition: reducedMotion ? "none" : "opacity 0.5s ease 0.5s",
              }}
            >
              {c.stats.map((stat, i) => (
                <div key={i} className={styles.heroStat}>
                  <span className={styles.heroStatValue}>{stat.value}</span>
                  <span className={styles.heroStatLabel}>{stat.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </>
    );
  };

  // ── Scene 5: Closing ────────────────────────────────────────────────────

  const renderScene5 = (isEntered: boolean) => {
    const c = SCENES[5][language];
    return (
      <>
        {renderBackground()}
        <div className={styles.closingScene}>
          <h1
            className={styles.closingBig}
            style={{
              opacity: isEntered ? 1 : 0,
              transform: isEntered ? "scale(1)" : "scale(0.85)",
              transition: reducedMotion
                ? "none"
                : "opacity 0.8s ease, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            {c.big}
          </h1>
          <p
            className={styles.closingSub}
            style={{
              opacity: isEntered ? 1 : 0,
              transition: reducedMotion ? "none" : "opacity 0.6s ease 0.3s",
            }}
          >
            {c.sub}
          </p>
        </div>
      </>
    );
  };

  // ── Render scene content for a given scene number ────────────────────────

  const renderSceneFor = (sceneNum: number, beatNum: number, isEntered: boolean) => {
    switch (sceneNum) {
      case 1:
        return renderScene1(isEntered);
      case 2:
        return renderScene2(beatNum, isEntered);
      case 3:
        return renderScene3(beatNum, isEntered);
      case 4:
        return renderScene4(beatNum, isEntered);
      case 5:
        return renderScene5(isEntered);
      default:
        return null;
    }
  };

  // ── Navigation Indicators ───────────────────────────────────────────────

  const renderNavIndicators = () => {
    if (isThumbnail) return null;
    return (
      <div className={styles.navIndicators} aria-label="Scene navigation">
        {[1, 2, 3, 4, 5].map((s) => {
          const isActive = s === scene;
          return (
            <button
              key={s}
              type="button"
              className={`${styles.navIndicator} ${isActive ? styles.navIndicatorActive : ""}`}
              aria-label={`Jump to scene ${s}`}
              onClick={(e) => handleNavClick(e, s)}
            />
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
        axis="x"
        reducedMotion={reducedMotion || isThumbnail}
        beatLayoutModes={BEAT_LAYOUT_MODES}
        renderScene={(sceneId, sceneBeat, isActive) => (
          <div className={styles.sceneLayer}>
            {renderSceneFor(sceneId, sceneBeat, isActive ? entered : true)}
          </div>
        )}
      />

      {renderNavIndicators()}
    </div>
  );
}

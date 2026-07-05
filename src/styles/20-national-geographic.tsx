import React, { useEffect, useState, useCallback } from "react";
import type { BespokeStyleProps, StyleMetadata } from "../types";
import styles from "./20-national-geographic.module.css";

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
      label: "Wildlife Conservation",
      title: "Vanishing Worlds",
      subtitle: "The race to save Earth's most vulnerable ecosystems",
    },
    zh: {
      label: "野生动物保护",
      title: "消逝的世界",
      subtitle: "拯救地球最脆弱生态系统的竞赛",
    },
  },
  2: {
    en: {
      kicker: "Cover Story",
      title: "The Last Great Forests",
      deck: "Deep in the Amazon basin, indigenous communities and scientists are joining forces to protect what remains of the world's largest tropical rainforest — and discovering that its survival may be inseparable from our own.",
      caption: "Dawn light filters through the canopy in the Peruvian Amazon. Old-growth rainforests support more species per hectare than any other terrestrial ecosystem on Earth.",
      credit: "Photograph by Carlos Rivas / National Geographic",
    },
    zh: {
      kicker: "封面故事",
      title: "最后的大森林",
      deck: "在亚马逊盆地深处，原住民社区和科学家正在联手保护世界上最大热带雨林的残存部分——并发现它的生存可能与我们自身的生存密不可分。",
      caption: "秘鲁亚马逊地区，晨光透过树冠洒落。原始雨林每公顷支持的物种数量超过地球上任何其他陆地生态系统。",
      credit: "摄影：卡洛斯·里瓦斯 / 国家地理",
    },
  },
  3: {
    en: {
      label: "Species at Risk",
      galleryTitle: "Three Icons, Three Stories",
      galleryCards: [
        {
          title: "The Amur Leopard",
          caption: "Fewer than 120 remain in the wild. Habitat loss and poaching have pushed this solitary hunter to the brink of extinction.",
        },
        {
          title: "The Vaquita",
          caption: "The world's rarest marine mammal. Illegal gillnets in the Gulf of California threaten to silence this tiny porpoise forever.",
        },
        {
          title: "The Sumatran Orangutan",
          caption: "Palm oil expansion has destroyed 80% of its habitat in two decades. Conservation corridors offer a fragile lifeline.",
        },
      ],
    },
    zh: {
      label: "濒危物种",
      galleryTitle: "三个标志，三个故事",
      galleryCards: [
        {
          title: "远东豹",
          caption: "野生个体不足120只。栖息地丧失和偷猎将这种独居猎手推向了灭绝的边缘。",
        },
        {
          title: "小头鼠海豚",
          caption: "世界上最稀有的海洋哺乳动物。加利福尼亚湾的非法刺网威胁着这种小型鼠海豚的永久沉默。",
        },
        {
          title: "苏门答腊猩猩",
          caption: "棕榈油扩张在二十年内摧毁了其80%的栖息地。保护走廊提供了一条脆弱的生命线。",
        },
      ],
    },
  },
  4: {
    en: {
      label: "By the Numbers",
      mapTitle: "The Global Picture",
      stats: [
        { number: "1M+", label: "Species threatened with extinction" },
        { number: "60%", label: "Wildlife populations lost since 1970" },
        { number: "30%", label: "Global land under protection" },
      ],
    },
    zh: {
      label: "数据说话",
      mapTitle: "全球图景",
      stats: [
        { number: "100万+", label: "濒临灭绝的物种" },
        { number: "60%", label: "自1970年以来消失的野生动物种群" },
        { number: "30%", label: "受保护的全球陆地面积" },
      ],
    },
  },
  5: {
    en: {
      quote: "We are the first generation to feel the impact of climate change, and the last generation that can do something about it.",
      attribution: "Dr. Jane Goodall",
      org: "National Geographic Explorer at Large",
    },
    zh: {
      quote: "我们是感受到气候变化影响的第一代，也是能够为此做些什么的最后一代。",
      attribution: "珍·古道尔博士",
      org: "国家地理常驻探险家",
    },
  },
};

// ─── Metadata ───────────────────────────────────────────────────────────────

export function getMetadata(lang: "en" | "zh"): StyleMetadata {
  const nameMap = { en: "National Geographic", zh: "国家地理" };
  const themeMap = {
    en: "Wildlife conservation report — large photo areas with yellow accent borders and bold serif headlines",
    zh: "野生动物保护报道——大图片区域配黄色边框与粗体衬线标题",
  };
  const densityLabelMap = { en: "Visual-First", zh: "视觉优先" };

  const sceneTitles = {
    en: ["Cover", "Feature Story", "Species Gallery", "Data Map", "Closing Quote"],
    zh: ["封面", "专题报道", "物种图鉴", "数据地图", "结语引述"],
  };

  const beatActions = {
    en: {
      1: ["Cover photo and title reveal"],
      2: ["Feature photo with caption", "Story text appears"],
      3: ["Card 1 appears", "Card 2 appears", "Card 3 appears"],
      4: ["Map visual", "Stats column reveals"],
      5: ["Quote with attribution"],
    },
    zh: {
      1: ["封面图片与标题呈现"],
      2: ["专题图配说明", "报道文字呈现"],
      3: ["卡片一呈现", "卡片二呈现", "卡片三呈现"],
      4: ["地图视觉", "数据栏呈现"],
      5: ["引语配署名"],
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
    id: "20",
    band: "editorial-print",
    name: nameMap[lang],
    theme: themeMap[lang],
    densityLabel: densityLabelMap[lang],
    heroScene: 3,
    colors: {
      bg: "#f5f5f0",
      ink: "#1a1a1a",
      panel: "#ffffff",
    },
    typography: {
      header: "Georgia 900",
      body: "Inter 300",
    },
    tags: [
      "photography",
      "nature",
      "documentary",
      "yellow-accent",
      "exploration",
      "serif",
      "conservation",
      "visual",
      "geographic",
    ],
    fonts: ["Georgia", "Inter", "cjk:Noto Serif SC"],
    scenes,
  };
}

// ─── Component ──────────────────────────────────────────────────────────────

export default function NationalGeographic({
  scene,
  beat,
  language,
  isThumbnail,
  reducedMotion,
  onNavigate,
  isTransitionClone,
}: BespokeStyleProps) {
  const content = SCENES[scene]?.[language] || SCENES[1][language];
  const [entered, setEntered] = useState(false);

  // Font injection
  useEffect(() => {
    const id = "style-20-fonts";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;700&family=Noto+Serif+SC:wght@400;700;900&display=swap";
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
    !isTransitionClone && styles.animateSceneEnter,
  ]
    .filter(Boolean)
    .join(" ");

  const renderSceneContent = () => {
    if (scene === 1) {
      return (
        <div className={styles.coverScene}>
          <div className={styles.coverPhoto} />
          <div className={styles.coverContent}>
            <div className={styles.coverYellowBar} />
            <p className={styles.coverLabel}>{content.label}</p>
            <h1 className={styles.coverTitle}>{content.title}</h1>
            <p className={styles.coverSubtitle}>{content.subtitle}</p>
          </div>
        </div>
      );
    }

    if (scene === 2) {
      return (
        <div className={styles.featureScene}>
          <div className={styles.featurePhoto}>
            <div className={styles.featurePhotoGradient} />
            {beat >= 0 && (
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
                  {content.caption}
                </p>
                <p className={styles.featurePhotoCaptionCredit}>
                  {content.credit}
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
            <p className={styles.featureKicker}>{content.kicker}</p>
            <h2 className={styles.featureHeadline}>{content.title}</h2>
            {beat >= 1 && (
              <p
                className={styles.featureDeck}
                style={{
                  opacity: entered ? 0.75 : 0,
                  transition: reducedMotion
                    ? "none"
                    : "opacity 0.5s ease 0.3s",
                }}
              >
                {content.deck}
              </p>
            )}
          </div>
        </div>
      );
    }

    if (scene === 3) {
      const cards = content.galleryCards || [];
      return (
        <div className={styles.galleryScene}>
          <div className={styles.galleryHeader}>
            <div className={styles.galleryYellowAccent} />
            <div>
              <p className={styles.galleryLabel}>{content.label}</p>
              <h2 className={styles.galleryTitle}>{content.galleryTitle}</h2>
            </div>
          </div>
          <div className={styles.galleryGrid}>
            {cards.map((card, i) => {
              const visible = i <= beat;
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

    if (scene === 4) {
      const stats = content.stats || [];
      return (
        <div className={styles.mapScene}>
          <div className={styles.mapHeader}>
            <div className={styles.mapYellowBar} />
            <div>
              <p className={styles.mapLabel}>{content.label}</p>
              <h2 className={styles.mapTitle}>{content.mapTitle}</h2>
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
            {beat >= 1 && (
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

    if (scene === 5) {
      return (
        <div className={styles.closingScene}>
          <div className={styles.closingBg} />
          <div className={styles.closingContent}>
            <div className={styles.closingYellowBar} />
            <blockquote className={styles.closingQuote}>
              "{content.quote}"
            </blockquote>
            <p className={styles.closingAttribution}>
              {content.attribution}
            </p>
            <p className={styles.closingOrg}>{content.org}</p>
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

  return (
    <div className={rootClasses}>
      <div
        key={`20-${scene}`}
        className={trackClasses}
        style={reducedMotion ? { animationDuration: "0s" } : undefined}
      >
        {renderSceneContent()}
      </div>
      {renderNavIndicators()}
    </div>
  );
}

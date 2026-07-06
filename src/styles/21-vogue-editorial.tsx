import React, { useLayoutEffect, useEffect, useState, useCallback, useRef } from "react";
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
      logo: "SOLAR",
      issue: "Biennale 2026 — Programme Announcement",
      title: "The Return of Slow Light",
      subtitle: "On attention, duration, and the art of being present",
    },
    zh: {
      logo: "日光",
      issue: "双年展 2026 — 项目公告",
      title: "慢光的回归",
      subtitle: "论注意力、持续性与在场的艺术",
    },
  },
  2: {
    en: {
      kicker: "Curatorial Statement",
      headline: "Against the Speed of Everything",
      body: "This biennale gathers artists, architects, and thinkers who refuse the acceleration of contemporary life. Their work asks: what forms of knowledge can only emerge when we slow down? What beauty is lost to the tempo of the feed?",
    },
    zh: {
      kicker: "策展宣言",
      headline: "对抗一切的速度",
      body: "本届双年展聚集了拒绝当代生活加速的艺术家、建筑师和思想者。他们的作品追问：什么样的知识只有在我们放慢时才能浮现？什么样的美在信息流的节奏中遗失？",
    },
  },
  3: {
    en: {
      galleryLabel: "Positions",
      galleryTitle: "Three Voices\nin the Discourse",
      portraits: [
        { name: "Elena Vasquez", role: "Installation Artist" },
        { name: "Kenji Tanaka", role: "Architectural Theorist" },
        { name: "Amara Diallo", role: "Environmental Filmmaker" },
      ],
    },
    zh: {
      galleryLabel: "立场",
      galleryTitle: "话语中的\n三个声音",
      portraits: [
        { name: "埃莱娜·巴斯克斯", role: "装置艺术家" },
        { name: "田中健二", role: "建筑理论家" },
        { name: "阿玛拉·迪亚洛", role: "环境电影人" },
      ],
    },
  },
  4: {
    en: {
      trendLabel: "Programme",
      trendTitle: "Three Threads\nRunning Through",
      trends: [
        {
          name: "Duration as Material",
          desc: "Works that unfold over hours, days, or seasons — refusing the compression of experience into the instant.",
        },
        {
          name: "The Weather of Attention",
          desc: "Examining how ambient conditions — light, temperature, silence — shape what we are able to notice.",
        },
        {
          name: "Slow Institutions",
          desc: "Cultural organisations rethinking their tempo: longer residencies, deeper commissions, fewer but better.",
        },
      ],
    },
    zh: {
      trendLabel: "项目",
      trendTitle: "贯穿的\n三条线索",
      trends: [
        {
          name: "作为材料的时长",
          desc: "在数小时、数天或数季中展开的作品——拒绝将体验压缩为瞬间。",
        },
        {
          name: "注意力的气候",
          desc: "审视环境条件——光线、温度、沉默——如何塑造我们能够注意到的东西。",
        },
        {
          name: "缓慢的机构",
          desc: "文化机构重新思考节奏：更长的驻留，更深的委托，少而精。",
        },
      ],
    },
  },
  5: {
    en: {
      closing: "The only way out\nis through the door\nthat takes the longest to open.",
      sig: "— Solar Biennale 2026",
    },
    zh: {
      closing: "唯一的出路\n是那扇\n需要最久才能打开的门。",
      sig: "—— 日光双年展 2026",
    },
  },
};

// ─── Metadata ───────────────────────────────────────────────────────────────

export function getMetadata(lang: "en" | "zh"): StyleMetadata {
  const nameMap = { en: "Solar Biennale Poster", zh: "日光双年展海报" };
  const themeMap = {
    en: "Cultural programme decks and manifesto statements — warm parchment flooded with solar glow, deep indigo ink, and three-voice typographic discipline",
    zh: "文化项目演示与宣言陈述——暖色羊皮纸浸润日光辉光，深靛蓝墨水，三声部字体纪律",
  };
  const densityLabelMap = { en: "Airy", zh: "疏朗" };

  const sceneTitles = {
    en: ["Poster Title", "Curatorial Statement", "Positions", "Programme Threads", "Manifesto"],
    zh: ["海报标题", "策展宣言", "立场", "项目线索", "结语宣言"],
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
      bg: "#f5ede0",
      ink: "#1a1f3a",
      panel: "#ebe2d2",
    },
    typography: {
      header: "Playfair Display 400",
      body: "Inter 300",
    },
    tags: [
      "solar",
      "biennale",
      "poster",
      "parchment",
      "indigo-ink",
      "sun-bloom",
      "hairline-rule",
      "three-voice",
      "contemplative",
    ],
    fonts: ["Playfair Display", "Inter", "IBM Plex Mono", "cjk:Noto Serif SC"],
    scenes,
  };
}

// ─── Transition constants ──────────────────────────────────────────────────

const TRANSITION_DURATION = 650;
const BEAT_COUNTS: Record<number, number> = { 1: 1, 2: 2, 3: 3, 4: 2, 5: 1 };

// ─── Component ──────────────────────────────────────────────────────────────

export default function VogueEditorial({
  scene,
  beat,
  language,
  isThumbnail,
  reducedMotion,
  onNavigate,
  isTransitionClone,
}: BespokeStyleProps) {
  const [entered, setEntered] = useState(false);

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

  var outgoingScene = transitionInfo.outgoingScene;
  var isTransitioning = transitionInfo.isTransitioning;

  // Font injection
  useEffect(() => {
    const id = "style-21-fonts";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=Inter:wght@300;400;500&family=IBM+Plex+Mono:wght@400;500&family=Noto+Serif+SC:wght@400;700&display=swap";
    document.head.appendChild(link);
  }, []);

  // Beat-level entered state — triggers reveal animations within current scene
  useLayoutEffect(() => {
    setEntered(false);
    const raf = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setEntered(true);
      });
    });
    return () => cancelAnimationFrame(raf);
  }, [scene, beat]);

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

  const renderSceneFor = (
    sceneNum: number,
    beatNum: number,
    isOutgoing: boolean,
  ) => {
    const content = SCENES[sceneNum]?.[language] || SCENES[1][language];
    // Outgoing scene always shows its final state
    const effectiveBeat = isOutgoing ? BEAT_COUNTS[sceneNum] - 1 : beatNum;
    // Outgoing scene is always "entered" (no beat-level animations playing)
    const effectiveEntered = isOutgoing ? true : entered;
    // Headline tracking class — only for incoming scene
    const headlineClass = !isOutgoing && effectiveEntered && !reducedMotion
      ? styles.headlineTrackIn
      : "";

    if (sceneNum === 1) {
      return (
        <div className={styles.vogueCover}>
          <div className={styles.vogueCoverImage} />
          <div className={styles.vogueCoverContent}>
            <div className={styles.vogueMasthead}>
              <h1 className={`${styles.vogueLogo} ${headlineClass}`}>
                {content.logo}
              </h1>
              <p className={styles.vogueIssue}>{content.issue}</p>
            </div>
            <div className={styles.vogueCoverBottom}>
              <h2 className={`${styles.vogueCoverTitle} ${headlineClass}`}>
                {content.title}
              </h2>
              <p className={styles.vogueCoverSub}>{content.subtitle}</p>
            </div>
          </div>
        </div>
      );
    }

    if (sceneNum === 2) {
      return (
        <div className={styles.vogueSpread}>
          <div className={styles.vogueSpreadImage}>
            <span className={styles.vogueSpreadImageLabel}>
              {language === "zh" ? "摄影" : "Photograph"}
            </span>
          </div>
          <div className={styles.vogueSpreadText}>
            <p className={styles.vogueSpreadKicker}>{content.kicker}</p>
            <h2 className={`${styles.vogueSpreadHeadline} ${headlineClass}`}>
              {content.headline}
            </h2>
            <div className={styles.vogueHairline} />
            {effectiveBeat >= 1 && (
              <p
                className={styles.vogueSpreadBody}
                style={{
                  opacity: effectiveEntered ? 0.75 : 0,
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

    if (sceneNum === 3) {
      const portraits = content.portraits || [];
      return (
        <div className={styles.vogueGallery}>
          <div className={styles.vogueGalleryHeader}>
            <p className={styles.vogueGalleryLabel}>
              {content.galleryLabel}
            </p>
            <h2 className={`${styles.vogueGalleryTitle} ${headlineClass}`}>
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
              const visible = i <= effectiveBeat;
              return (
                <div
                  key={i}
                  className={styles.voguePortrait}
                  style={{
                    opacity: visible && effectiveEntered ? 1 : 0,
                    transform:
                      visible && effectiveEntered
                        ? "none"
                        : "translateY(1.5cqh)",
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

    if (sceneNum === 4) {
      const trends = content.trends || [];
      return (
        <div className={styles.vogueTrend}>
          <div className={styles.vogueTrendHeader}>
            <p className={styles.vogueTrendLabel}>{content.trendLabel}</p>
            <h2 className={`${styles.vogueTrendTitle} ${headlineClass}`}>
              {(content.trendTitle || "").split("\n").map((line, i) => (
                <React.Fragment key={i}>
                  {line}
                  {i < (content.trendTitle || "").split("\n").length - 1 && <br />}
                </React.Fragment>
              ))}
            </h2>
          </div>
          {effectiveBeat >= 1 && (
            <div
              className={styles.vogueTrendItems}
              style={{
                opacity: effectiveEntered ? 1 : 0,
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

    if (sceneNum === 5) {
      return (
        <div className={styles.vogueClosing}>
          <div className={styles.vogueClosingHairline} />
          <p className={`${styles.vogueClosingText} ${headlineClass}`}>
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
            {renderSceneFor(outgoingScene, BEAT_COUNTS[outgoingScene] - 1, true)}
          </div>
        </div>
      )}

      {/* Incoming / current scene */}
      <div className={incomingLayerClasses}>
        <div className={styles.track}>
          {renderSceneFor(scene, beat, false)}
        </div>
      </div>

      {renderNavIndicators()}

      {/* Mono folio — persistent page number bottom-right */}
      {!isThumbnail && (
        <span className={styles.folio}>
          {String(scene).padStart(2, "0")} / 05
        </span>
      )}
    </div>
  );
}

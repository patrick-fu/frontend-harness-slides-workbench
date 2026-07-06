import React, { useLayoutEffect, useState, useCallback, useRef } from "react";
import type { BespokeStyleProps, StyleMetadata } from "../types";
import styles from "./24-manuscript-scroll.module.css";

// ─── Content ────────────────────────────────────────────────────────────────

interface SceneContent {
  en: {
    title?: string;
    subtitle?: string;
    source?: string;
    annotation?: string;
    fragmentTitle?: string;
    fragmentBody?: string;
    marginNote?: string;
    scraps?: Array<{ text: string; note: string; color: string }>;
    clippingsLabel?: string;
    clippings?: Array<{ headline: string; source: string }>;
    closing?: string;
    closingNote?: string;
    arrowLabel?: string;
  };
  zh: {
    title?: string;
    subtitle?: string;
    source?: string;
    annotation?: string;
    fragmentTitle?: string;
    fragmentBody?: string;
    marginNote?: string;
    scraps?: Array<{ text: string; note: string; color: string }>;
    clippingsLabel?: string;
    clippings?: Array<{ headline: string; source: string }>;
    closing?: string;
    closingNote?: string;
    arrowLabel?: string;
  };
}

const SCENES: Record<number, SceneContent> = {
  1: {
    en: {
      title: "Things I\nFound on\nthe Desk",
      subtitle: "A collage of fragments, half-formed thoughts, and things worth keeping",
      source: "Assembled over three mornings",
      annotation: "start here →",
    },
    zh: {
      title: "桌上\n找到的\n东西",
      subtitle: "碎片、半成品想法和值得保留的事物的拼贴",
      source: "三个早晨组装而成",
      annotation: "从这里开始 →",
    },
  },
  2: {
    en: {
      fragmentTitle: "On Keeping a Notebook",
      fragmentBody:
        "The point is not to write well. The point is to keep writing, even when it feels like nothing is happening. The notebook does not judge. It simply holds what you give it, and in that holding, something quietly accumulates.",
      marginNote: "remember this part ↑",
    },
    zh: {
      fragmentTitle: "论记笔记",
      fragmentBody:
        "重点不是写得好。重点是坚持写，即使感觉什么都没发生。笔记本不评判。它只是容纳你给它的东西，在这种容纳中，某种东西在悄然积累。",
      marginNote: "记住这部分 ↑",
    },
  },
  3: {
    en: {
      scraps: [
        {
          text: "A train ticket from a city I can no longer name",
          note: "was it 2019?",
          color: "rust",
        },
        {
          text: "The way light hits the kitchen wall at 4pm in winter",
          note: "paint this",
          color: "indigo",
        },
        {
          text: "A conversation I keep replaying, trying to get right",
          note: "you won't",
          color: "mustard",
        },
      ],
    },
    zh: {
      scraps: [
        {
          text: "一张我已记不起名字的城市的火车票",
          note: "是2019年吗？",
          color: "rust",
        },
        {
          text: "冬天下午4点光线打在厨房墙上的样子",
          note: "画下来",
          color: "indigo",
        },
        {
          text: "一段我不断回放、试图理解的对话",
          note: "你不会的",
          color: "mustard",
        },
      ],
    },
  },
  4: {
    en: {
      clippingsLabel: "Clippings",
      clippings: [
        {
          headline: "The Quiet Rebellion of Doing Nothing",
          source: "New York Times, 2024",
        },
        {
          headline: "Why We Collect Things We Cannot Use",
          source: "Atlantic Monthly, 2023",
        },
        {
          headline: "On the Value of Unfinished Work",
          source: "Paris Review, 2025",
        },
      ],
    },
    zh: {
      clippingsLabel: "剪报",
      clippings: [
        {
          headline: "什么都不做的安静反叛",
          source: "《纽约时报》，2024",
        },
        {
          headline: "为什么我们收集用不上的东西",
          source: "《大西洋月刊》，2023",
        },
        {
          headline: "论未完成作品的价值",
          source: "《巴黎评论》，2025",
        },
      ],
    },
  },
  5: {
    en: {
      closing: "Everything is\nmaterial, if\nyou are paying\nattention.",
      closingNote: "— pinned to the board, Tuesday",
      arrowLabel: "↑ this one",
    },
    zh: {
      closing: "一切都是\n素材，如果你\n在注意的话。",
      closingNote: "—— 钉在板上，星期二",
      arrowLabel: "↑ 这个",
    },
  },
};

// ─── Metadata ───────────────────────────────────────────────────────────────

export function getMetadata(lang: "en" | "zh"): StyleMetadata {
  const nameMap = { en: "Analog Cutout Collage", zh: "模拟剪纸拼贴" };
  const themeMap = {
    en: "Cultural essays and personal narratives — scissor-cut paper fragments pinned and taped, handwritten annotations, paper-stacking shadows",
    zh: "文化随笔与个人叙事——剪刀剪纸碎片钉贴固定、手写注解、纸张堆叠阴影",
  };
  const densityLabelMap = { en: "Fragmentary", zh: "碎片" };

  const sceneTitles = {
    en: ["Title Fragment", "Notebook Page", "Scraps", "Clippings", "Pinned Closing"],
    zh: ["标题碎片", "笔记本页", "纸条", "剪报", "钉住结语"],
  };

  const beatActions = {
    en: {
      1: ["Title and annotation appear"],
      2: ["Fragment text reveals", "Margin note added"],
      3: ["Scrap 1-2 placed", "Scrap 3 placed"],
      4: ["Clippings header", "Articles populate"],
      5: ["Closing statement with arrow"],
    },
    zh: {
      1: ["标题与注解呈现"],
      2: ["碎片文本揭示", "页边笔记加入"],
      3: ["纸条1-2放置", "纸条3放置"],
      4: ["剪报标题", "文章填充"],
      5: ["结语配箭头"],
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
    const content = SCENES[id][lang];
    const beatCount = BEAT_COUNTS[id];
    const actions = beatActions[lang][id as keyof (typeof beatActions)["en"]];

    const beats = Array.from({ length: beatCount }, (_, beatIdx) => {
      let beatTitle = "";
      let beatBody = "";

      if (id === 1) {
        beatTitle = content.title || "";
        beatBody = content.annotation || "";
      } else if (id === 2) {
        beatTitle = content.fragmentTitle || "";
        beatBody = beatIdx >= 1 ? content.marginNote || "" : content.fragmentBody || "";
      } else if (id === 3) {
        const scraps = content.scraps || [];
        const endIdx = Math.min((beatIdx + 1) * 2, scraps.length);
        beatTitle = scraps[0]?.text || "";
        beatBody = scraps.slice(0, endIdx).map((s) => s.note).join(" / ");
      } else if (id === 4) {
        beatTitle = content.clippingsLabel || "";
        beatBody = beatIdx >= 1 ? (content.clippings || []).map((c) => c.headline).join(" / ") : "";
      } else if (id === 5) {
        beatTitle = content.closing || "";
        beatBody = content.arrowLabel || "";
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
    id: "24",
    band: "editorial-print",
    name: nameMap[lang],
    theme: themeMap[lang],
    densityLabel: densityLabelMap[lang],
    heroScene: 3,
    colors: {
      bg: "#f2ead8",
      ink: "#2c2418",
      panel: "#e8dfc8",
    },
    typography: {
      header: "Caveat 700",
      body: "Source Serif Pro 400",
    },
    tags: [
      "collage",
      "cutout",
      "paper-stack",
      "tape",
      "pin",
      "hand-annotated",
      "scissor-edge",
      "fragmentary",
      "tactile",
    ],
    fonts: ["Caveat", "Permanent Marker", "Source Serif Pro", "cjk:Noto Serif SC"],
    scenes,
  };
}

// ─── Transition constants ─────────────────────────────────────────────────

const TRANSITION_DURATION = 600;
const BEAT_COUNTS: Record<number, number> = { 1: 1, 2: 2, 3: 2, 4: 2, 5: 1 };

// ─── Component ──────────────────────────────────────────────────────────────

export default function ManuscriptScroll({
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
  useLayoutEffect(() => {
    const id = "style-24-fonts";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Caveat:wght@400;700&family=Permanent+Marker&family=Source+Serif+Pro:ital,wght@0,400;0,600;1,400&family=Noto+Serif+SC:wght@400;700&display=swap";
    document.head.appendChild(link);
  }, []);

  // Beat-level entered state
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

  const renderSceneFor = (sceneNum: number, beatNum: number) => {
    const sc = SCENES[sceneNum]?.[language] || SCENES[1][language];

    if (sceneNum === 1) {
      return (
        <div className={styles.scrollTitle}>
          {/* Tape strip at top */}
          <div className={styles.tapeStrip} style={{ top: "4cqh", left: "30%", transform: "rotate(-3deg)" }} />

          {/* Title fragment — large cutout paper */}
          <div className={styles.titleFragment}>
            <h1 className={styles.collageTitle}>
              {(sc.title || "").split("\n").map((line, i) => (
                <React.Fragment key={i}>
                  {line}
                  {i < (sc.title || "").split("\n").length - 1 && <br />}
                </React.Fragment>
              ))}
            </h1>
            <p className={styles.collageSubtitle}>{sc.subtitle}</p>
            <p className={styles.collageSource}>{sc.source}</p>
          </div>

          {/* Handwritten annotation arrow */}
          <span className={styles.handAnnotation} style={{ bottom: "15cqh", right: "15cqw", transform: "rotate(8deg)" }}>
            {sc.annotation}
          </span>

          {/* Pin dot */}
          <span className={styles.pinDot} style={{ top: "8cqh", left: "45%" }} />
        </div>
      );
    }

    if (sceneNum === 2) {
      return (
        <div className={styles.scrollPage}>
          {/* Clipped text fragment */}
          <div className={styles.textFragment}>
            <div className={styles.tapeStrip} style={{ top: "-1.5cqh", left: "20%", transform: "rotate(2deg)" }} />
            <h2 className={styles.fragmentHeading}>{sc.fragmentTitle}</h2>
            <p className={styles.fragmentBody}>{sc.fragmentBody}</p>
          </div>

          {/* Margin note — handwritten, off to the side */}
          {beatNum >= 1 && (
            <span
              className={styles.marginNote}
              style={{
                opacity: entered ? 1 : 0,
                transform: entered ? "rotate(-5deg)" : "rotate(-5deg) translateY(1cqh)",
                transition: reducedMotion ? "none" : "opacity 0.4s ease 0.2s, transform 0.4s ease 0.2s",
              }}
            >
              {sc.marginNote}
            </span>
          )}

          {/* Pin dot */}
          <span className={styles.pinDot} style={{ top: "6cqh", right: "12cqw" }} />
        </div>
      );
    }

    if (sceneNum === 3) {
      const scraps = sc.scraps || [];
      const colorMap: Record<string, string> = {
        rust: "#b85c3c",
        indigo: "#3d4f6f",
        mustard: "#c4a040",
      };

      return (
        <div className={styles.collageDesk}>
          {scraps.map((scrap, i) => {
            const visible = i <= beatNum * 2;
            if (!visible) return null;
            const rotations = [-4, 3, -2];
            const leftPositions = ["8%", "35%", "62%"];
            const topPositions = ["15%", "25%", "18%"];
            return (
              <div
                key={i}
                className={styles.paperScrap}
                style={{
                  left: leftPositions[i],
                  top: topPositions[i],
                  transform: `rotate(${rotations[i]}deg)`,
                  borderLeft: `0.8cqh solid ${colorMap[scrap.color] || "#b85c3c"}`,
                  opacity: entered ? 1 : 0,
                  transition: reducedMotion ? "none" : `opacity 0.4s ease ${i * 0.15}s`,
                }}
              >
                <p className={styles.scrapText}>{scrap.text}</p>
                <span className={styles.scrapAnnotation}>{scrap.note}</span>
                <span className={styles.pinDot} style={{ top: "-0.5cqh", right: "1cqw", position: "absolute" }} />
              </div>
            );
          })}
        </div>
      );
    }

    if (sceneNum === 4) {
      const clippings = sc.clippings || [];
      return (
        <div className={styles.scrollCommentary}>
          <div className={styles.clippingsHeader}>
            <p className={styles.clippingsLabel}>{sc.clippingsLabel}</p>
            <div className={styles.tapeStrip} style={{ top: "-1cqh", right: "5cqw", transform: "rotate(4deg)" }} />
          </div>
          {beatNum >= 1 && (
            <div
              className={styles.clippingsList}
              style={{
                opacity: entered ? 1 : 0,
                transition: reducedMotion ? "none" : "opacity 0.4s ease 0.1s",
              }}
            >
              {clippings.map((clip, i) => (
                <div
                  key={i}
                  className={styles.clippingItem}
                  style={{ transform: `rotate(${(i - 1) * 1.5}deg)` }}
                >
                  <p className={styles.clippingHeadline}>{clip.headline}</p>
                  <p className={styles.clippingSource}>{clip.source}</p>
                  <span className={styles.pinDot} style={{ top: "0.5cqh", right: "1cqw" }} />
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    if (sceneNum === 5) {
      return (
        <div className={styles.scrollClosing}>
          {/* Large closing fragment */}
          <div className={styles.closingFragment}>
            <div className={styles.tapeStrip} style={{ top: "-1.5cqh", left: "40%", transform: "rotate(-2deg)" }} />
            <p className={styles.closingStatement}>
              {(sc.closing || "").split("\n").map((line, i) => (
                <React.Fragment key={i}>
                  {line}
                  {i < (sc.closing || "").split("\n").length - 1 && <br />}
                </React.Fragment>
              ))}
            </p>
            <p className={styles.closingAttribution}>{sc.closingNote}</p>
          </div>

          {/* Arrow annotation */}
          <span
            className={styles.arrowAnnotation}
            style={{
              opacity: entered ? 1 : 0,
              transition: reducedMotion ? "none" : "opacity 0.5s ease 0.3s",
            }}
          >
            {sc.arrowLabel}
          </span>

          {/* Pin dots */}
          <span className={styles.pinDot} style={{ top: "12cqh", left: "25%" }} />
          <span className={styles.pinDot} style={{ bottom: "15cqh", right: "30%" }} />
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
              <span className={styles.navIndicatorNum}>{s}</span>
            </button>
          );
        })}
      </div>
    );
  };

  // ── Build layer classes ─────────────────────────────────────────────────

  const outgoingLayerClasses = [
    styles.sceneLayer,
    styles.exitFade,
  ].filter(Boolean).join(" ");

  const incomingLayerClasses = [
    styles.sceneLayer,
    isTransitioning && !isTransitionClone ? styles.scrollReveal : "",
  ].filter(Boolean).join(" ");

  return (
    <div className={rootClasses}>
      {/* Outgoing scene */}
      {outgoingScene !== null && (
        <div className={outgoingLayerClasses}>
          <div className={styles.sceneContent}>
            {renderSceneFor(outgoingScene, BEAT_COUNTS[outgoingScene] - 1)}
          </div>
        </div>
      )}

      {/* Incoming / current scene */}
      <div className={incomingLayerClasses}>
        <div className={styles.sceneContent}>
          {renderSceneFor(scene, beat)}
        </div>
      </div>

      {renderNavIndicators()}
    </div>
  );
}

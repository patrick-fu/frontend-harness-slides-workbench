import React, { useEffect, useState, useRef, useCallback } from "react";
import type { BespokeStyleProps, StyleMetadata } from "../types";
import styles from "./35-neon-grid.module.css";

// ─── Content ────────────────────────────────────────────────────────────────

const SCENES = {
  1: {
    en: {
      title: "Neon Dreams",
      subtitle: "Retro-Futurism Revived",
    },
    zh: {
      title: "霓虹之梦",
      subtitle: "复古未来主义的复兴",
    },
  },
  2: {
    en: {
      label: "Chapter 01",
      heading: "The Culture",
      cards: [
        {
          icon: "🎵",
          title: "Synthwave Music",
          desc: "Daft Punk, Kavinsky, and The Midnight define the sound of a generation that never was.",
          tag: "Audio",
        },
        {
          icon: "🎮",
          title: "Arcade Gaming",
          desc: "Pixel art and chiptune soundtracks. Street Fighter, Out Run, and the golden age of arcades.",
          tag: "Gaming",
        },
        {
          icon: "🎬",
          title: "Cinema Aesthetic",
          desc: "Blade Runner, Drive, and Stranger Things brought neon-noir into the mainstream.",
          tag: "Visual",
        },
      ],
    },
    zh: {
      label: "第一章",
      heading: "文化浪潮",
      cards: [
        {
          icon: "🎵",
          title: "合成波音乐",
          desc: "Daft Punk、Kavinsky 和 The Midnight 定义了一个从未存在的时代之声。",
          tag: "音乐",
        },
        {
          icon: "🎮",
          title: "街机游戏",
          desc: "像素艺术和芯片音乐。街头霸王、Out Run 和街机的黄金时代。",
          tag: "游戏",
        },
        {
          icon: "🎬",
          title: "电影美学",
          desc: "银翼杀手、亡命驾驶和怪奇物语将霓虹黑色带入主流。",
          tag: "视觉",
        },
      ],
    },
  },
  3: {
    en: {
      label: "Timeline",
      heading: "Through the Decades",
      nodes: [
        { year: "1982", label: "Tron releases, defining the grid aesthetic" },
        { year: "1984", label: "Neon signs dominate city skylines" },
        { year: "1989", label: "Game Boy launches portable gaming" },
        { year: "1995", label: "Windows 95 ships with cloud wallpaper" },
        { year: "2011", label: "Drive soundtrack ignites synthwave revival" },
      ],
    },
    zh: {
      label: "时间线",
      heading: "穿越年代",
      nodes: [
        { year: "1982", label: "《电子世界争霸战》定义网格美学" },
        { year: "1984", label: "霓虹灯主导城市天际线" },
        { year: "1989", label: "Game Boy 开启掌机游戏时代" },
        { year: "1995", label: "Windows 95 发布蓝天白云壁纸" },
        { year: "2011", label: "《亡命驾驶》原声点燃合成波复兴" },
      ],
    },
  },
  4: {
    en: {
      quote: "The future we were promised, delivered in neon.",
      author: "— Retro-Futurist Manifesto",
      stats: [
        { value: "80s", label: "Inspiration Era" },
        { value: "∞", label: "Nostalgia Index" },
        { value: "24/7", label: "Neon Always On" },
      ],
    },
    zh: {
      quote: "我们被承诺的未来，以霓虹交付。",
      author: "—— 复古未来主义宣言",
      stats: [
        { value: "80年代", label: "灵感时代" },
        { value: "∞", label: "怀旧指数" },
        { value: "24/7", label: "霓虹常亮" },
      ],
    },
  },
  5: {
    en: {
      big: "Stay Retro",
      sub: "The future looks bright in pink and cyan",
    },
    zh: {
      big: "保持复古",
      sub: "粉色与青色中的未来一片光明",
    },
  },
};

// ─── Metadata ───────────────────────────────────────────────────────────────

export function getMetadata(lang: "en" | "zh"): StyleMetadata {
  const nameMap = { en: "Neon Grid", zh: "霓虹网格" };
  const themeMap = {
    en: "Retro-Futurism Culture — 80s synthwave aesthetic with neon pink and cyan on a perspective grid",
    zh: "复古未来主义文化——80 年代合成波美学，霓虹粉和青色透视网格",
  };
  const densityLabelMap = { en: "Visual-Immersive", zh: "视觉沉浸" };

  const sceneTitles = {
    en: ["Title", "Culture", "Timeline", "Hero Quote", "Closing"],
    zh: ["标题", "文化", "时间线", "核心引语", "结语"],
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
      bg: "#0a0a0f",
      ink: "#ffffff",
      panel: "#1a1a2e",
    },
    typography: {
      header: "Inter 900",
      body: "Inter 400",
    },
    tags: [
      "neon",
      "synthwave",
      "retro",
      "80s",
      "futuristic",
      "pink",
      "cyan",
      "grid",
      "immersive",
      "culture",
    ],
    fonts: ["Inter", "JetBrains Mono"],
    scenes,
  };
}

// ─── Component ──────────────────────────────────────────────────────────────

export default function NeonGrid({
  scene,
  beat,
  language,
  isThumbnail,
  reducedMotion,
  onNavigate,
}: BespokeStyleProps) {
  const [entered, setEntered] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

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

  const renderScene1 = () => {
    const c = SCENES[1][language];
    return (
      <>
        {renderBackground()}
        <div className={styles.titleScene}>
          <h1
            className={styles.neonTitle}
            style={{
              opacity: entered ? 1 : 0,
              transform: entered ? "scale(1)" : "scale(0.9)",
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
              opacity: entered ? 1 : 0,
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

  const renderScene2 = () => {
    const c = SCENES[2][language];
    return (
      <>
        {renderBackground()}
        <div className={styles.cultureScene}>
          <span className={styles.sceneLabel}>{c.label}</span>
          <h2
            className={styles.sceneHeading}
            style={{
              opacity: entered ? 1 : 0,
              transform: entered ? "translateX(0)" : "translateX(-2cqw)",
              transition: reducedMotion
                ? "none"
                : "opacity 0.5s ease, transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            {c.heading}
          </h2>
          <div className={styles.cultureGrid}>
            {c.cards.map((card, i) => {
              const visible = entered && i <= beat;
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

  const renderScene3 = () => {
    const c = SCENES[3][language];
    return (
      <>
        {renderBackground()}
        <div className={styles.timelineScene}>
          <span className={styles.sceneLabel}>{c.label}</span>
          <h2
            className={styles.sceneHeading}
            style={{
              opacity: entered ? 1 : 0,
              transition: reducedMotion ? "none" : "opacity 0.5s ease",
            }}
          >
            {c.heading}
          </h2>
          <div className={styles.timelineTrack}>
            <div
              className={styles.timelineLine}
              style={{
                opacity: entered ? 1 : 0,
                transform: entered ? "translateY(-50%) scaleX(1)" : "translateY(-50%) scaleX(0)",
                transition: reducedMotion
                  ? "none"
                  : "opacity 0.5s ease, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            />
            <div className={styles.timelineNodes}>
              {c.nodes.map((node, i) => {
                const visible = entered && beat >= (i < 3 ? 0 : 1);
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

  const renderScene4 = () => {
    const c = SCENES[4][language];
    return (
      <>
        {renderBackground()}
        <div className={styles.heroScene}>
          <div
            className={styles.heroQuoteMark}
            style={{
              opacity: entered ? 0.6 : 0,
              transition: reducedMotion ? "none" : "opacity 0.6s ease",
            }}
          >
            &ldquo;
          </div>
          <blockquote
            className={styles.heroQuote}
            style={{
              opacity: entered ? 1 : 0,
              transform: entered ? "translateY(0)" : "translateY(1.5cqh)",
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
              opacity: entered ? 1 : 0,
              transition: reducedMotion ? "none" : "opacity 0.5s ease 0.4s",
              fontStyle: "normal",
            }}
          >
            {c.author}
          </cite>
          {beat >= 1 && (
            <div
              className={styles.heroStats}
              style={{
                opacity: entered ? 1 : 0,
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

  const renderScene5 = () => {
    const c = SCENES[5][language];
    return (
      <>
        {renderBackground()}
        <div className={styles.closingScene}>
          <h1
            className={styles.closingBig}
            style={{
              opacity: entered ? 1 : 0,
              transform: entered ? "scale(1)" : "scale(0.85)",
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
              opacity: entered ? 1 : 0,
              transition: reducedMotion ? "none" : "opacity 0.6s ease 0.3s",
            }}
          >
            {c.sub}
          </p>
        </div>
      </>
    );
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

  const renderSceneContent = () => {
    switch (scene) {
      case 1:
        return renderScene1();
      case 2:
        return renderScene2();
      case 3:
        return renderScene3();
      case 4:
        return renderScene4();
      case 5:
        return renderScene5();
      default:
        return null;
    }
  };

  return (
    <div className={rootClasses}>
      <div
        ref={trackRef}
        key={`35-${scene}`}
        className={styles.transitionTrack}
      >
        {renderSceneContent()}
      </div>
      {renderNavIndicators()}
    </div>
  );
}

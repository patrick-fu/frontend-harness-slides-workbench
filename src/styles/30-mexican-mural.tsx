import React, { useLayoutEffect, useEffect, useState, useCallback, useRef } from "react";
import type { BespokeStyleProps, StyleMetadata } from "../types";
import styles from "./30-mexican-mural.module.css";

function useFonts() {
  useEffect(() => {
    const id = "style-30-fonts";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap";
    document.head.appendChild(link);
  }, []);
}

const SCENES = {
  1: {
    en: { title: "BULLETIN", sub: "Q3 Product Launch — Sequence & Status Report" },
    zh: { title: "公告", sub: "第三季度产品发布——进度与状态报告" },
  },
  2: {
    en: {
      label: "Rollout",
      heading: "Four-step launch sequence",
      steps: [
        { num: "01", name: "Announce", desc: "Press + community reveal" },
        { num: "02", name: "Pre-order", desc: "Waitlist opens, tiers lock" },
        { num: "03", name: "Ship", desc: "Batch fulfillment begins" },
        { num: "04", name: "Scale", desc: "General availability" },
      ],
    },
    zh: {
      label: "发布流程",
      heading: "四步发布序列",
      steps: [
        { num: "01", name: "官宣", desc: "媒体与社区发布" },
        { num: "02", name: "预售", desc: "候补开放，档位锁定" },
        { num: "03", name: "发货", desc: "分批履约开始" },
        { num: "04", name: "放量", desc: "全面公开发售" },
      ],
    },
  },
  3: {
    en: {
      label: "Comparison",
      heading: "How we stack up",
      features: [
        { name: "Latency", us: "12ms", them: "45ms", status: "WIN" },
        { name: "Uptime SLA", us: "99.99%", them: "99.9%", status: "WIN" },
        { name: "Integrations", us: "84", them: "31", status: "WIN" },
        { name: "Price / seat", us: "$29", them: "$49", status: "WIN" },
      ],
    },
    zh: {
      label: "对比",
      heading: "我们的优势",
      features: [
        { name: "延迟", us: "12ms", them: "45ms", status: "胜" },
        { name: "可用性 SLA", us: "99.99%", them: "99.9%", status: "胜" },
        { name: "集成数", us: "84", them: "31", status: "胜" },
        { name: "单价/席位", us: "$29", them: "$49", status: "胜" },
      ],
    },
  },
  4: {
    en: {
      label: "Numbers",
      heading: "Pre-launch momentum",
      stats: [
        { value: "12,847", label: "Waitlist signups" },
        { value: "34", label: "Countries covered" },
        { value: "$2.1M", label: "Pipeline ARR" },
      ],
    },
    zh: {
      label: "数据",
      heading: "发布前势头",
      stats: [
        { value: "12,847", label: "候补注册" },
        { value: "34", label: "覆盖国家" },
        { value: "$210万", label: "管线 ARR" },
      ],
    },
  },
  5: {
    en: { closing: "Ship it", accent: "on schedule", sub: "— Launch date: July 15, 2026. All systems go." },
    zh: { closing: "按时", accent: "发布", sub: "—— 上线日期：2026 年 7 月 15 日。全部就绪。" },
  },
};

const TRANSITION_DURATION = 400;
const BEAT_COUNTS: Record<number, number> = { 1: 1, 2: 3, 3: 3, 4: 1, 5: 1 };

function BulletinStampSVG({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="8" y="8" width="104" height="104" stroke="currentColor" strokeWidth="6" fill="none" />
      <rect x="18" y="18" width="84" height="84" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.4" />
      <text x="60" y="58" textAnchor="middle" fill="currentColor" fontFamily="Bebas Neue, sans-serif" fontSize="28" fontWeight="400">BULL</text>
      <text x="60" y="88" textAnchor="middle" fill="currentColor" fontFamily="Bebas Neue, sans-serif" fontSize="28" fontWeight="400">ETIN</text>
      <line x1="28" y1="62" x2="92" y2="62" stroke="currentColor" strokeWidth="2" opacity="0.5" />
    </svg>
  );
}

export function getMetadata(lang: "en" | "zh"): StyleMetadata {
  const nameMap = { en: "Neo-Brutalist Bulletin", zh: "新粗野公告" };
  const themeMap = {
    en: "Protest poster taped to concrete — thick black rules, hard offset shadows, one electric accent. Best for product launches, process overviews, comparison decks, and dense stats that need to feel bold and human.",
    zh: "贴在混凝土墙上的抗议海报——粗黑线条、硬边投影、一道电光强调色。最适合产品发布、流程概览、对比表格，以及需要大胆人性化呈现的密集数据。",
  };
  const densityLabelMap = { en: "Dense", zh: "密集" };

  const sceneTitles = {
    en: ["Title", "Rollout", "Comparison", "Numbers", "Closing"],
    zh: ["标题", "发布流程", "对比", "数据", "结语"],
  };

  const beatActions = {
    en: {
      1: ["Title and stamp appear"],
      2: ["Heading appears", "Steps 1-2 snap in", "Steps 3-4 snap in"],
      3: ["Heading appears", "Rows 1-2 pop in", "Rows 3-4 pop in"],
      4: ["Stats populate"],
      5: ["Closing statement"],
    },
    zh: {
      1: ["标题和印章呈现"],
      2: ["标题呈现", "第 1-2 步卡入", "第 3-4 步卡入"],
      3: ["标题呈现", "第 1-2 行弹入", "第 3-4 行弹入"],
      4: ["数据填充"],
      5: ["结语呈现"],
    },
  };

  const scenes = [1, 2, 3, 4, 5].map((id) => {
    const beatCount = BEAT_COUNTS[id];
    const actions = beatActions[lang][id as keyof (typeof beatActions)["en"]];
    const c = SCENES[id as keyof typeof SCENES][lang] as any;

    const beats = Array.from({ length: beatCount }, (_, beatIdx) => {
      let beatTitle = "";
      let beatBody = "";

      if (id === 1) {
        beatTitle = c.title;
        beatBody = c.sub;
      } else if (id === 2) {
        beatTitle = c.heading;
        const steps = (c.steps as Array<{ name: string }>) || [];
        const visible = Math.min(beatIdx * 2, 4);
        beatBody = steps.slice(0, visible).map((s) => s.name).join(" / ");
      } else if (id === 3) {
        beatTitle = c.heading;
        const features = (c.features as Array<{ name: string }>) || [];
        const visible = Math.min(beatIdx * 2, 4);
        beatBody = features.slice(0, visible).map((f) => f.name).join(" / ");
      } else if (id === 4) {
        beatTitle = c.heading;
        beatBody = beatIdx === 0 ? c.heading : "Stats visible";
      } else if (id === 5) {
        beatTitle = `${c.closing} ${c.accent}`;
        beatBody = c.sub;
      }

      return { id: beatIdx, action: actions[beatIdx], title: beatTitle, body: beatBody };
    });

    return { id, title: sceneTitles[lang][id - 1], beats };
  });

  return {
    id: "30",
    band: "craft-cultural",
    name: nameMap[lang],
    theme: themeMap[lang],
    densityLabel: densityLabelMap[lang],
    heroScene: 2,
    colors: { bg: "#f5f0e8", ink: "#1a1a1a", panel: "#ebe5da" },
    typography: { header: "Bebas Neue 400", body: "Inter 400" },
    tags: ["neo-brutalist", "bulletin", "protest-poster", "thick-borders", "offset-shadow", "electric-accent", "grotesque", "dense-info", "zine", "concrete"],
    fonts: ["Bebas Neue", "Inter", "JetBrains Mono"],
    scenes,
  };
}

export default function MexicanMural({
  scene, beat, language, isThumbnail, reducedMotion, onNavigate, isTransitionClone,
}: BespokeStyleProps) {
  useFonts();
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

  useLayoutEffect(() => {
    setEntered(false);
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => setEntered(true));
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

  const rootClasses = [styles.root, reducedMotion ? styles.reducedMotion : "", isThumbnail ? styles.thumbnail : ""].filter(Boolean).join(" ");

  const renderScene1 = (_forceEntered = false) => {
    const c = SCENES[1][language as keyof typeof SCENES[1]];
    return (
      <div className={styles.scene1}>
        <BulletinStampSVG className={styles.sunBg} />
        <div className={styles.scene1Content}>
          <h1 className={styles.titleText}>{c.title}</h1>
          <div className={styles.titleBar} />
          <p className={styles.titleSub}>{c.sub}</p>
        </div>
      </div>
    );
  };

  const renderScene2 = (beatNum: number, forceEntered = false) => {
    const c = SCENES[2][language as keyof typeof SCENES[2]];
    const steps = c.steps as Array<{ num: string; name: string; desc: string }>;
    const visibleCount = beatNum === 0 ? 0 : beatNum === 1 ? 2 : 4;
    const showEntered = forceEntered || entered;
    return (
      <div className={styles.scene2}>
        <span className={styles.sceneLabel}>{c.label}</span>
        <h2 className={styles.sceneHeading}>{c.heading}</h2>
        <div className={styles.artistList}>
          {steps.map((s, i) => {
            const visible = i < visibleCount;
            const cls = [styles.artistRow, visible && showEntered ? styles.artistVisible : ""].filter(Boolean).join(" ");
            return (
              <div key={i} className={cls} style={reducedMotion || forceEntered ? { opacity: visible ? 1 : 0 } : { transitionDelay: `${i * 0.08}s` }}>
                <span className={styles.artistPortrait}>{s.num}</span>
                <div className={styles.artistInfo}>
                  <span className={styles.artistName}>{s.name}</span>
                  <span className={styles.artistYears}>{s.desc}</span>
                </div>
                <span className={styles.artistStyle}>STEP</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderScene3 = (beatNum: number, forceEntered = false) => {
    const c = SCENES[3][language as keyof typeof SCENES[3]];
    const features = c.features as Array<{ name: string; us: string; them: string; status: string }>;
    const visibleCount = beatNum === 0 ? 0 : beatNum === 1 ? 2 : 4;
    const showEntered = forceEntered || entered;
    return (
      <div className={styles.scene3}>
        <span className={styles.sceneLabel}>{c.label}</span>
        <h2 className={styles.sceneHeading}>{c.heading}</h2>
        <div className={styles.themeGrid}>
          {features.map((f, i) => {
            const visible = i < visibleCount;
            const cls = [styles.themeCard, visible && showEntered ? styles.themeVisible : ""].filter(Boolean).join(" ");
            return (
              <div key={i} className={cls} style={reducedMotion || forceEntered ? { opacity: visible ? 1 : 0 } : { transitionDelay: `${i * 0.08}s` }}>
                <span className={styles.themeTitle}>{f.name}</span>
                <div className={styles.comparisonRow}>
                  <span className={styles.compUs}>{f.us}</span>
                  <span className={styles.compThem}>{f.them}</span>
                </div>
                <span className={styles.comparisonPill}>{f.status}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderScene4 = (beatNum: number, forceEntered = false) => {
    const c = SCENES[4][language as keyof typeof SCENES[4]];
    const stats = c.stats as Array<{ value: string; label: string }>;
    const showStats = beatNum >= 1;
    return (
      <div className={styles.scene4}>
        <span className={styles.sceneLabel}>{c.label}</span>
        <h2 className={styles.sceneHeading}>{c.heading}</h2>
        {showStats && (
          <div className={styles.statsRow}>
            {stats.map((s, i) => {
              const cls = [styles.statBlock, forceEntered || entered ? styles.statVisible : ""].filter(Boolean).join(" ");
              return (
                <div key={i} className={cls} style={reducedMotion || forceEntered ? { opacity: 1 } : { transitionDelay: `${i * 0.1}s` }}>
                  <span className={styles.statValue}>{s.value}</span>
                  <span className={styles.statLabel}>{s.label}</span>
                </div>
              );
            })}
          </div>
        )}
        <div className={styles.wallTexture} aria-hidden="true" />
      </div>
    );
  };

  const renderScene5 = (_forceEntered = false) => {
    const c = SCENES[5][language as keyof typeof SCENES[5]];
    return (
      <div className={styles.scene5}>
        <BulletinStampSVG className={styles.sunSmall} />
        <h2 className={styles.closingText}>
          {c.closing} <span className={styles.closingAccent}>{c.accent}</span>
        </h2>
        <p className={styles.closingSub}>{c.sub}</p>
      </div>
    );
  };

  const renderSceneFor = (sceneNum: number, beatNum: number, forceEntered = false) => {
    switch (sceneNum) {
      case 1: return renderScene1(forceEntered);
      case 2: return renderScene2(beatNum, forceEntered);
      case 3: return renderScene3(beatNum, forceEntered);
      case 4: return renderScene4(beatNum, forceEntered);
      case 5: return renderScene5(forceEntered);
      default: return null;
    }
  };

  const renderNav = () => {
    if (isThumbnail) return null;
    return (
      <div className={styles.nav} aria-label="Scene navigation">
        {[1, 2, 3, 4, 5].map((s) => {
          const isActive = s === scene;
          const itemClasses = [styles.navItem, isActive ? styles.navItemActive : ""].filter(Boolean).join(" ");
          return (
            <button
              key={s}
              type="button"
              className={itemClasses}
              aria-label={`Jump to scene ${s}`}
              onClick={(e) => handleNavClick(e, s)}
            >
              <span className={styles.navBar}>{s}</span>
            </button>
          );
        })}
      </div>
    );
  };

  const outgoingLayerClasses = [styles.sceneLayer, styles.exitAnim].filter(Boolean).join(" ");
  const incomingLayerClasses = [styles.sceneLayer, isTransitioning && !isTransitionClone ? styles.enterAnim : ""].filter(Boolean).join(" ");

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

      {/* Tape strip during brutalist transition */}
      {isTransitioning && !reducedMotion && (
        <div className={styles.plasterOverlay} aria-hidden="true" />
      )}

      {/* Incoming / current scene */}
      <div className={incomingLayerClasses}>
        <div key={`30-${scene}`} className={styles.track}>
          {renderSceneFor(scene, beat, isTransitioning)}
        </div>
      </div>

      {renderNav()}
    </div>
  );
}

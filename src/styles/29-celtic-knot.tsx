import React, { useLayoutEffect, useEffect, useState, useCallback, useRef } from "react";
import type { BespokeStyleProps, StyleMetadata } from "../types";
import styles from "./29-celtic-knot.module.css";

function useFonts() {
  useEffect(() => {
    const id = "style-29-fonts";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap";
    document.head.appendChild(link);
  }, []);
}

const SCENES = {
  1: {
    en: { title: "CASSETTE", titleEn: "SYSTEM 77", sub: "Audio Products Catalogue — Model No. CR-7700" },
    zh: { title: "卡带", titleEn: "系统 77", sub: "音响产品目录——型号 CR-7700" },
  },
  2: {
    en: {
      label: "Specifications",
      heading: "Technical parameters",
      motifs: [
        { name: "Frequency", meaning: "20 Hz – 20 kHz ± 1 dB" },
        { name: "Wow & Flutter", meaning: "Below 0.04% WRMS" },
        { name: "Signal/Noise", meaning: "62 dB Dolby NR" },
        { name: "Tape Speed", meaning: "4.76 cm/s (1⅞ ips)" },
      ],
    },
    zh: {
      label: "规格",
      heading: "技术参数",
      motifs: [
        { name: "频率响应", meaning: "20 Hz – 20 kHz ± 1 dB" },
        { name: "抖晃率", meaning: "低于 0.04% WRMS" },
        { name: "信噪比", meaning: "62 dB 杜比降噪" },
        { name: "走带速度", meaning: "4.76 厘米/秒" },
      ],
    },
  },
  3: {
    en: {
      label: "Features",
      heading: "Built for fidelity",
      manuscripts: [
        { name: "Auto Reverse", year: "SYSTEM", origin: "Continuous play" },
        { name: "Dolby B/C", year: "NOISE", origin: "Dual NR system" },
        { name: "Metal Tape", year: "COMPAT", origin: "Type IV ready" },
      ],
    },
    zh: {
      label: "特性",
      heading: "为保真而生",
      manuscripts: [
        { name: "自动翻面", year: "系统", origin: "连续播放" },
        { name: "杜比 B/C", year: "降噪", origin: "双降噪系统" },
        { name: "金属带", year: "兼容", origin: "支持四类磁带" },
      ],
    },
  },
  4: {
    en: {
      label: "Controls",
      heading: "Interface layout",
      materials: [
        { name: "Transport", desc: "Soft-touch logic keys" },
        { name: "VU Meters", desc: "Analog peak display" },
        { name: "Tuning", desc: "Flywheel dial control" },
        { name: "Output", desc: "RCA + headphone amp" },
      ],
    },
    zh: {
      label: "控制",
      heading: "界面布局",
      materials: [
        { name: "走带机构", desc: "轻触逻辑按键" },
        { name: "VU 电平表", desc: "模拟峰值显示" },
        { name: "调谐", desc: "飞轮旋钮控制" },
        { name: "输出", desc: "RCA + 耳放" },
      ],
    },
  },
  5: {
    en: { closing: "Press", accent: "play", sub: "— Model CR-7700, serial no. 004271" },
    zh: { closing: "按下", accent: "播放", sub: "—— 型号 CR-7700，序列号 004271" },
  },
};

const TRANSITION_DURATION = 650;
const BEAT_COUNTS: Record<number, number> = { 1: 1, 2: 3, 3: 3, 4: 3, 5: 1 };

function RainbowRibbonSVG({ className }: { className?: string }) {
  const colors = ["#d4692a", "#d4a02a", "#5a8a3a", "#3a6a8a", "#6a4a8a", "#d4692a"];
  return (
    <svg className={className} viewBox="0 0 400 200" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {colors.map((c, i) => (
        <path
          key={i}
          d={`M-20 ${30 + i * 28} Q100 ${10 + i * 28} 200 ${40 + i * 28} Q300 ${70 + i * 28} 420 ${40 + i * 28}`}
          stroke={c}
          strokeWidth="22"
          fill="none"
          strokeLinecap="round"
          opacity="0.85"
        />
      ))}
    </svg>
  );
}

function CassetteIconSVG({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="4" y="8" width="92" height="48" rx="4" stroke="currentColor" strokeWidth="2.5" fill="none" />
      <rect x="12" y="16" width="30" height="22" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.6" />
      <rect x="58" y="16" width="30" height="22" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.6" />
      <circle cx="27" cy="27" r="6" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.5" />
      <circle cx="73" cy="27" r="6" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.5" />
      <line x1="42" y1="44" x2="58" y2="44" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
      <rect x="20" y="48" width="60" height="4" rx="1" fill="currentColor" opacity="0.3" />
    </svg>
  );
}

export function getMetadata(lang: "en" | "zh"): StyleMetadata {
  const nameMap = { en: "Cassette-Era Packaging", zh: "卡带时代包装" };
  const themeMap = {
    en: "1970s Japanese audio catalogue — warm cream paper, diagonal rainbow ribbon, dense spec-sheet. Best for product launches with retro-tech nostalgia and indie tool releases.",
    zh: "1970 年代日本音响产品目录——暖奶油纸、对角彩虹带、密集规格表。最适合复古科技怀旧的产品发布和独立工具发布。",
  };
  const densityLabelMap = { en: "Dense", zh: "密集" };

  const sceneTitles = {
    en: ["Title", "Specifications", "Features", "Controls", "Closing"],
    zh: ["标题", "规格", "特性", "控制", "结语"],
  };

  const beatActions = {
    en: {
      1: ["Title and ribbon appear"],
      2: ["Heading appears", "Specs 1-2 reveal", "Specs 3-4 reveal"],
      3: ["Heading appears", "Features 1-2 appear", "Feature 3 appears"],
      4: ["Heading appears", "Controls 1-2 reveal", "Controls 3-4 reveal"],
      5: ["Closing statement"],
    },
    zh: {
      1: ["标题和彩虹带呈现"],
      2: ["标题呈现", "第 1-2 规格揭示", "第 3-4 规格揭示"],
      3: ["标题呈现", "第 1-2 特性呈现", "第 3 特性呈现"],
      4: ["标题呈现", "第 1-2 控制揭示", "第 3-4 控制揭示"],
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
        beatTitle = `${c.title} ${c.titleEn}`;
        beatBody = c.sub;
      } else if (id === 2) {
        beatTitle = c.heading;
        const motifs = (c.motifs as Array<{ name: string }>) || [];
        const visible = Math.min(beatIdx * 2, 4);
        beatBody = motifs.slice(0, visible).map((m) => m.name).join(" / ");
      } else if (id === 3) {
        beatTitle = c.heading;
        const mss = (c.manuscripts as Array<{ name: string }>) || [];
        const visible = Math.min(beatIdx * 2, 3);
        beatBody = mss.slice(0, visible).map((m) => m.name).join(" / ");
      } else if (id === 4) {
        beatTitle = c.heading;
        const mats = (c.materials as Array<{ name: string }>) || [];
        const visible = Math.min(beatIdx * 2, 4);
        beatBody = mats.slice(0, visible).map((m) => m.name).join(" / ");
      } else if (id === 5) {
        beatTitle = `${c.closing} ${c.accent}`;
        beatBody = c.sub;
      }

      return { id: beatIdx, action: actions[beatIdx], title: beatTitle, body: beatBody };
    });

    return { id, title: sceneTitles[lang][id - 1], beats };
  });

  return {
    id: "29",
    band: "craft-cultural",
    name: nameMap[lang],
    theme: themeMap[lang],
    densityLabel: densityLabelMap[lang],
    heroScene: 1,
    colors: { bg: "#f5ead0", ink: "#3d2b1f", panel: "#ede0c4" },
    typography: { header: "Oswald 700", body: "Inter 400" },
    tags: ["cassette", "retro-tech", "j-cards", "spec-sheet", "warm-cream", "rainbow-ribbon", "1970s", "product-catalogue", "industrial-sans", "halftone"],
    fonts: ["Oswald", "Inter", "JetBrains Mono"],
    scenes,
  };
}

export default function CelticKnot({
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
        <RainbowRibbonSVG className={styles.knotCenter} />
        <div className={styles.scene1Content}>
          <h1 className={styles.titleMain}>{c.title}</h1>
          <p className={styles.titleEn}>{c.titleEn}</p>
          <div className={styles.titleDivider} />
          <p className={styles.titleSub}>{c.sub}</p>
        </div>
      </div>
    );
  };

  const renderScene2 = (beatNum: number, forceEntered = false) => {
    const c = SCENES[2][language as keyof typeof SCENES[2]];
    const motifs = c.motifs as Array<{ name: string; meaning: string }>;
    const visibleCount = beatNum === 0 ? 0 : beatNum === 1 ? 2 : 4;
    const showEntered = forceEntered || entered;
    return (
      <div className={styles.scene2}>
        <span className={styles.sceneLabel}>{c.label}</span>
        <h2 className={styles.sceneHeading}>{c.heading}</h2>
        <div className={styles.motifGrid}>
          {motifs.map((m, i) => {
            const visible = i < visibleCount;
            const cls = [styles.motifCard, visible && showEntered ? styles.motifVisible : ""].filter(Boolean).join(" ");
            return (
              <div key={i} className={cls} style={reducedMotion || forceEntered ? { opacity: visible ? 1 : 0 } : { transitionDelay: `${i * 0.15}s` }}>
                <CassetteIconSVG className={styles.motifIcon} />
                <span className={styles.motifName}>{m.name}</span>
                <p className={styles.motifMeaning}>{m.meaning}</p>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderScene3 = (beatNum: number, forceEntered = false) => {
    const c = SCENES[3][language as keyof typeof SCENES[3]];
    const manuscripts = c.manuscripts as Array<{ name: string; year: string; origin: string }>;
    const visibleCount = beatNum === 0 ? 0 : beatNum === 1 ? 2 : 3;
    const showEntered = forceEntered || entered;
    return (
      <div className={styles.scene3}>
        <span className={styles.sceneLabel}>{c.label}</span>
        <h2 className={styles.sceneHeading}>{c.heading}</h2>
        <div className={styles.manuscriptList}>
          {manuscripts.map((m, i) => {
            const visible = i < visibleCount;
            const cls = [styles.manuscriptRow, visible && showEntered ? styles.manuscriptVisible : ""].filter(Boolean).join(" ");
            return (
              <div key={i} className={cls} style={reducedMotion || forceEntered ? { opacity: visible ? 1 : 0 } : { transitionDelay: `${i * 0.2}s` }}>
                <div className={styles.manuscriptIcon} aria-hidden="true">
                  <svg viewBox="0 0 40 50" fill="none">
                    <rect x="5" y="3" width="30" height="44" rx="2" fill="currentColor" opacity="0.2" />
                    <rect x="8" y="6" width="24" height="38" rx="1" fill="currentColor" opacity="0.1" />
                    <line x1="12" y1="14" x2="28" y2="14" stroke="currentColor" strokeWidth="1" opacity="0.4" />
                    <line x1="12" y1="20" x2="28" y2="20" stroke="currentColor" strokeWidth="1" opacity="0.3" />
                    <line x1="12" y1="26" x2="25" y2="26" stroke="currentColor" strokeWidth="1" opacity="0.3" />
                    <circle cx="20" cy="36" r="4" fill="currentColor" opacity="0.3" />
                  </svg>
                </div>
                <span className={styles.manuscriptName}>{m.name}</span>
                <span className={styles.manuscriptYear}>{m.year}</span>
                <span className={styles.manuscriptOrigin}>{m.origin}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderScene4 = (beatNum: number, forceEntered = false) => {
    const c = SCENES[4][language as keyof typeof SCENES[4]];
    const materials = c.materials as Array<{ name: string; desc: string }>;
    const visibleCount = beatNum === 0 ? 0 : beatNum === 1 ? 2 : 4;
    const showEntered = forceEntered || entered;
    return (
      <div className={styles.scene4}>
        <span className={styles.sceneLabel}>{c.label}</span>
        <h2 className={styles.sceneHeading}>{c.heading}</h2>
        <div className={styles.materialGrid}>
          {materials.map((m, i) => {
            const visible = i < visibleCount;
            const cls = [styles.materialCard, visible && showEntered ? styles.materialVisible : ""].filter(Boolean).join(" ");
            return (
              <div key={i} className={cls} style={reducedMotion || forceEntered ? { opacity: visible ? 1 : 0 } : { transitionDelay: `${i * 0.15}s` }}>
                <span className={styles.materialName}>{m.name}</span>
                <p className={styles.materialDesc}>{m.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderScene5 = (_forceEntered = false) => {
    const c = SCENES[5][language as keyof typeof SCENES[5]];
    return (
      <div className={styles.scene5}>
        <CassetteIconSVG className={styles.knotLarge} />
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
              <CassetteIconSVG className={styles.navIcon} />
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

      {/* Rainbow ribbon strands overlay during transition */}
      {isTransitioning && !reducedMotion && (
        <div className={styles.strandOverlay} aria-hidden="true">
          <div className={`${styles.strand} ${styles.strand1}`} />
          <div className={`${styles.strand} ${styles.strand2}`} />
          <div className={`${styles.strand} ${styles.strand3}`} />
          <div className={`${styles.strand} ${styles.strand4}`} />
        </div>
      )}

      {/* Incoming / current scene */}
      <div className={incomingLayerClasses}>
        <div key={`29-${scene}`} className={styles.track}>
          {renderSceneFor(scene, beat, isTransitioning)}
        </div>
      </div>

      {renderNav()}
    </div>
  );
}

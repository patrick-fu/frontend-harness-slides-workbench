import React, { useEffect, useState, useCallback, useRef } from "react";
import type { BespokeStyleProps, StyleMetadata } from "../types";
import styles from "./32-nordic-rosemaling.module.css";

function useFonts() {
  useEffect(() => {
    const id = "style-32-fonts";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Inter:wght@300;400;500;600&display=swap";
    document.head.appendChild(link);
  }, []);
}

const SCENES = {
  1: {
    en: { title: "Rosemaling", sub: "Norwegian Folk Painting — Flowers, Scrolls, and Stories" },
    zh: { title: "玫瑰彩绘", sub: "挪威民间绘画——花卉、卷草与故事" },
  },
  2: {
    en: {
      label: "Styles",
      heading: "Regional traditions",
      items: [
        { name: "Telemark", desc: "Bold, symmetrical, large flowers" },
        { name: "Rogaland", desc: "Delicate, flowing, soft colors" },
        { name: "Hallingdal", desc: "Geometric, dark backgrounds" },
        { name: "Valdres", desc: "Rich detail, warm palette" },
      ],
    },
    zh: {
      label: "流派",
      heading: "地域传统",
      items: [
        { name: "泰勒马克", desc: "大胆、对称、大花" },
        { name: "罗加兰", desc: "精致、流畅、柔和色彩" },
        { name: "哈灵达尔", desc: "几何、深色背景" },
        { name: "瓦尔德雷斯", desc: "细节丰富、暖色调" },
      ],
    },
  },
  3: {
    en: {
      label: "Motifs",
      heading: "Nature in paint",
      items: [
        { name: "Lotus", meaning: "Purity and beauty" },
        { name: "Scroll vine", meaning: "Growth and continuity" },
        { name: "Bird", meaning: "Freedom and spirit" },
        { name: "Heart", meaning: "Love and home" },
      ],
    },
    zh: {
      label: "图案",
      heading: "画中的自然",
      items: [
        { name: "莲花", meaning: "纯洁与美丽" },
        { name: "卷草藤", meaning: "生长与延续" },
        { name: "鸟", meaning: "自由与灵魂" },
        { name: "心", meaning: "爱与家园" },
      ],
    },
  },
  4: {
    en: {
      label: "Colors",
      heading: "The painter's palette",
      items: [
        { name: "Cobalt Blue", hex: "#2c5aa0" },
        { name: "Rose Pink", hex: "#d4667a" },
        { name: "Leaf Green", hex: "#4a8c3f" },
        { name: "Cream", hex: "#f5e6c8" },
      ],
    },
    zh: {
      label: "色彩",
      heading: "画家的调色板",
      items: [
        { name: "钴蓝", hex: "#2c5aa0" },
        { name: "玫瑰粉", hex: "#d4667a" },
        { name: "叶绿", hex: "#4a8c3f" },
        { name: "奶油", hex: "#f5e6c8" },
      ],
    },
  },
  5: {
    en: { closing: "Every stroke", accent: "tells a story", sub: "— Painted with love, passed through generations" },
    zh: { closing: "每一笔", accent: "都讲述故事", sub: "—— 以爱绘制，代代相传" },
  },
};

const BEAT_COUNTS: Record<number, number> = { 1: 1, 2: 3, 3: 3, 4: 3, 5: 1 };
const TRANSITION_DURATION = 900; // 600ms vine-draw + 300ms fade

function RosemalingFlower({ className, color = "#d4667a" }: { className?: string; color?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {[0, 60, 120, 180, 240, 300].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const cx = 50 + 18 * Math.cos(rad);
        const cy = 50 + 18 * Math.sin(rad);
        return <ellipse key={i} cx={cx} cy={cy} rx="14" ry="20" fill={color} opacity="0.85" transform={`rotate(${angle} ${cx} ${cy})`} />;
      })}
      <circle cx="50" cy="50" r="10" fill="#f5e6c8" />
      <circle cx="50" cy="50" r="5" fill="#d4a843" />
    </svg>
  );
}

function ScrollVine({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 200 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M5 20 Q 30 5, 55 20 Q 80 35, 105 20 Q 130 5, 155 20 Q 180 35, 195 20" stroke="#4a8c3f" strokeWidth="2.5" fill="none" opacity="0.7" />
      {[25, 65, 105, 145, 180].map((x, i) => (
        <circle key={i} cx={x} cy={i % 2 === 0 ? 12 : 28} r="4" fill="#d4667a" opacity="0.6" />
      ))}
    </svg>
  );
}

/**
 * Full-screen overlay with SVG vines that "draw" across the stage
 * during scene transitions, then fade out to reveal the incoming scene.
 */
function VineOverlay({ phase }: { phase: "draw" | "fade" }) {
  const overlayClass = [
    styles.vineOverlay,
    phase === "fade" ? styles.vineOverlayFade : "",
  ].filter(Boolean).join(" ");

  return (
    <div className={overlayClass} aria-hidden="true">
      <svg className={styles.vineSvg} viewBox="0 0 1920 1080" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
        {/* Main curling vine from top-left */}
        <path
          className={styles.vinePath}
          d="M-50 80 Q 200 200, 400 120 Q 600 40, 800 180 Q 1000 320, 1200 200 Q 1400 80, 1600 220 Q 1800 360, 1970 280"
          stroke="#4a8c3f"
          strokeWidth="4"
          fill="none"
        />
        {/* Secondary vine from bottom-right */}
        <path
          className={`${styles.vinePath} ${styles.vinePath2}`}
          d="M1970 1000 Q 1750 880, 1550 960 Q 1350 1040, 1150 900 Q 950 760, 750 880 Q 550 1000, 350 860 Q 150 720, -50 820"
          stroke="#4a8c3f"
          strokeWidth="3.5"
          fill="none"
        />
        {/* Third vine from top-right */}
        <path
          className={`${styles.vinePath} ${styles.vinePath3}`}
          d="M1970 60 Q 1700 180, 1500 100 Q 1300 20, 1100 160 Q 900 300, 700 180 Q 500 60, 300 160"
          stroke="#d4667a"
          strokeWidth="3"
          fill="none"
          opacity="0.7"
        />
        {/* Flower accents along vine 1 */}
        {[300, 700, 1100, 1500].map((cx, i) => (
          <circle
            key={`f1-${i}`}
            className={`${styles.vineFlower} ${styles[`vineFlowerDelay${i}`]}`}
            cx={cx}
            cy={i % 2 === 0 ? 140 : 240}
            r="12"
            fill="#d4667a"
            opacity="0.8"
          />
        ))}
        {/* Flower accents along vine 2 */}
        {[400, 800, 1200, 1600].map((cx, i) => (
          <circle
            key={`f2-${i}`}
            className={`${styles.vineFlower} ${styles[`vineFlowerDelay${i + 1}`]}`}
            cx={cx}
            cy={i % 2 === 0 ? 920 : 840}
            r="10"
            fill="#d4a843"
            opacity="0.7"
          />
        ))}
        {/* Leaf shapes */}
        {[500, 900, 1300].map((cx, i) => (
          <ellipse
            key={`l-${i}`}
            className={`${styles.vineLeaf} ${styles[`vineLeafDelay${i}`]}`}
            cx={cx}
            cy={160 + i * 30}
            rx="20"
            ry="8"
            fill="#4a8c3f"
            opacity="0.6"
            transform={`rotate(${i * 25 - 20} ${cx} ${160 + i * 30})`}
          />
        ))}
      </svg>
    </div>
  );
}

export function getMetadata(lang: "en" | "zh"): StyleMetadata {
  const nameMap = { en: "Nordic Rosemaling", zh: "北欧玫瑰彩绘" };
  const themeMap = {
    en: "Norwegian rosemaling folk art — floral scrolls, cobalt blue and rose pink, warm Scandinavian craft heritage",
    zh: "挪威玫瑰彩绘民间艺术——花卉卷草、钴蓝与玫瑰粉、温暖的斯堪的纳维亚工艺遗产",
  };
  const densityLabelMap = { en: "Ornate", zh: "华丽" };
  const sceneTitles = { en: ["Title", "Styles", "Motifs", "Colors", "Closing"], zh: ["标题", "流派", "图案", "色彩", "结语"] };
  const beatActions = {
    en: {
      1: ["Title and flowers appear"],
      2: ["Heading appears", "Styles 1-2 reveal", "Styles 3-4 reveal"],
      3: ["Heading appears", "Motifs 1-2 appear", "Motifs 3-4 appear"],
      4: ["Heading appears", "Colors 1-2 reveal", "Colors 3-4 reveal"],
      5: ["Closing statement"],
    },
    zh: {
      1: ["标题和花朵呈现"],
      2: ["标题呈现", "第 1-2 流派揭示", "第 3-4 流派揭示"],
      3: ["标题呈现", "第 1-2 图案呈现", "第 3-4 图案呈现"],
      4: ["标题呈现", "第 1-2 色揭示", "第 3-4 色揭示"],
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
      if (id === 1) { beatTitle = c.title; beatBody = c.sub; }
      else if (id === 2 || id === 3 || id === 4) {
        beatTitle = c.heading;
        const items = (c.items as Array<{ name: string }>) || [];
        const visible = Math.min(beatIdx * 2, 4);
        beatBody = items.slice(0, visible).map((x) => x.name).join(" / ");
      } else if (id === 5) { beatTitle = `${c.closing} ${c.accent}`; beatBody = c.sub; }
      return { id: beatIdx, action: actions[beatIdx], title: beatTitle, body: beatBody };
    });
    return { id, title: sceneTitles[lang][id - 1], beats };
  });
  return {
    id: "32", band: "craft-cultural", name: nameMap[lang], theme: themeMap[lang],
    densityLabel: densityLabelMap[lang], heroScene: 3,
    colors: { bg: "#1e3a5f", ink: "#f5e6c8", panel: "#2c5aa0" },
    typography: { header: "Playfair Display 700", body: "Inter 400" },
    tags: ["rosemaling", "nordic", "norwegian", "folk-art", "floral", "scandinavian", "traditional", "craft", "painting"],
    fonts: ["Playfair Display", "Inter"], scenes,
  };
}

export default function NordicRosemaling({ scene, beat, language, isThumbnail, reducedMotion, onNavigate, isTransitionClone }: BespokeStyleProps) {
  useFonts();

  const [outgoingScene, setOutgoingScene] = useState<number | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [vinePhase, setVinePhase] = useState<"draw" | "fade" | null>(null);
  const prevSceneRef = useRef<number>(scene);

  useEffect(() => {
    const prev = prevSceneRef.current;
    if (prev !== scene && !reducedMotion) {
      setOutgoingScene(prev);
      setIsTransitioning(true);
      setVinePhase("draw");

      const fadeTimer = setTimeout(() => {
        setVinePhase("fade");
      }, 600);

      const doneTimer = setTimeout(() => {
        setOutgoingScene(null);
        setIsTransitioning(false);
        setVinePhase(null);
      }, TRANSITION_DURATION);

      prevSceneRef.current = scene;
      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(doneTimer);
      };
    }
    prevSceneRef.current = scene;
  }, [scene, reducedMotion]);

  const [entered, setEntered] = useState(false);
  useEffect(() => {
    setEntered(false);
    const id = requestAnimationFrame(() => { requestAnimationFrame(() => setEntered(true)); });
    return () => cancelAnimationFrame(id);
  }, [scene]);

  const handleNavClick = useCallback((e: React.MouseEvent, targetScene: number) => { e.stopPropagation(); onNavigate?.(targetScene, 0); }, [onNavigate]);
  const rootClasses = [styles.root, reducedMotion ? styles.reducedMotion : "", isThumbnail ? styles.thumbnail : ""].filter(Boolean).join(" ");

  const renderScene1 = () => {
    const c = SCENES[1][language as keyof typeof SCENES[1]];
    return (
      <div className={styles.scene1}>
        <RosemalingFlower className={styles.flowerTL} color="#d4667a" />
        <RosemalingFlower className={styles.flowerBR} color="#d4a843" />
        <div className={styles.scene1Content}>
          <ScrollVine className={styles.vineTop} />
          <h1 className={styles.titleText}>{c.title}</h1>
          <div className={styles.titleBar} />
          <p className={styles.titleSub}>{c.sub}</p>
          <ScrollVine className={styles.vineBottom} />
        </div>
      </div>
    );
  };

  const renderScene2 = (currentBeat: number) => {
    const c = SCENES[2][language as keyof typeof SCENES[2]];
    const items = c.items as Array<{ name: string; desc: string }>;
    const visibleCount = currentBeat === 0 ? 0 : currentBeat === 1 ? 2 : 4;
    return (
      <div className={styles.scene2}>
        <span className={styles.sceneLabel}>{c.label}</span>
        <h2 className={styles.sceneHeading}>{c.heading}</h2>
        <div className={styles.grid4}>
          {items.map((item, i) => {
            const visible = i < visibleCount;
            const cls = [styles.card, visible && entered ? styles.cardVisible : ""].filter(Boolean).join(" ");
            return (
              <div key={i} className={cls} style={reducedMotion ? { opacity: visible ? 1 : 0 } : { transitionDelay: `${i * 0.15}s` }}>
                <RosemalingFlower className={styles.cardFlower} color={i % 2 === 0 ? "#d4667a" : "#d4a843"} />
                <span className={styles.cardName}>{item.name}</span>
                <p className={styles.cardDesc}>{item.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderScene3 = (currentBeat: number) => {
    const c = SCENES[3][language as keyof typeof SCENES[3]];
    const items = c.items as Array<{ name: string; meaning: string }>;
    const visibleCount = currentBeat === 0 ? 0 : currentBeat === 1 ? 2 : 4;
    const icons = ["✿", "❦", "♪", "♥"];
    return (
      <div className={styles.scene3}>
        <span className={styles.sceneLabel}>{c.label}</span>
        <h2 className={styles.sceneHeading}>{c.heading}</h2>
        <div className={styles.grid4}>
          {items.map((item, i) => {
            const visible = i < visibleCount;
            const cls = [styles.motifCard, visible && entered ? styles.cardVisible : ""].filter(Boolean).join(" ");
            return (
              <div key={i} className={cls} style={reducedMotion ? { opacity: visible ? 1 : 0 } : { transitionDelay: `${i * 0.15}s` }}>
                <span className={styles.motifIcon}>{icons[i]}</span>
                <span className={styles.motifName}>{item.name}</span>
                <p className={styles.motifMeaning}>{item.meaning}</p>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderScene4 = (currentBeat: number) => {
    const c = SCENES[4][language as keyof typeof SCENES[4]];
    const items = c.items as Array<{ name: string; hex: string }>;
    const visibleCount = currentBeat === 0 ? 0 : currentBeat === 1 ? 2 : 4;
    return (
      <div className={styles.scene4}>
        <span className={styles.sceneLabel}>{c.label}</span>
        <h2 className={styles.sceneHeading}>{c.heading}</h2>
        <div className={styles.paletteRow}>
          {items.map((item, i) => {
            const visible = i < visibleCount;
            const cls = [styles.swatchCard, visible && entered ? styles.cardVisible : ""].filter(Boolean).join(" ");
            return (
              <div key={i} className={cls} style={reducedMotion ? { opacity: visible ? 1 : 0 } : { transitionDelay: `${i * 0.2}s` }}>
                <div className={styles.swatchCircle} style={{ background: item.hex }} />
                <span className={styles.swatchName}>{item.name}</span>
                <span className={styles.swatchHex}>{item.hex}</span>
              </div>
            );
          })}
        </div>
        <ScrollVine className={styles.vineDecor} />
      </div>
    );
  };

  const renderScene5 = () => {
    const c = SCENES[5][language as keyof typeof SCENES[5]];
    return (
      <div className={styles.scene5}>
        <RosemalingFlower className={styles.flowerCenter} color="#d4667a" />
        <h2 className={styles.closingText}>{c.closing} <span className={styles.closingAccent}>{c.accent}</span></h2>
        <p className={styles.closingSub}>{c.sub}</p>
      </div>
    );
  };

  const renderSceneFor = (sceneNum: number, beatNum: number) => {
    switch (sceneNum) {
      case 1: return renderScene1();
      case 2: return renderScene2(beatNum);
      case 3: return renderScene3(beatNum);
      case 4: return renderScene4(beatNum);
      case 5: return renderScene5();
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
            <button key={s} type="button" className={itemClasses} aria-label={`Jump to scene ${s}`} onClick={(e) => handleNavClick(e, s)}>
              <span className={styles.navDot} />
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
            {renderSceneFor(outgoingScene, BEAT_COUNTS[outgoingScene] - 1)}
          </div>
        </div>
      )}

      {/* Incoming / current scene */}
      <div className={incomingLayerClasses}>
        <div className={styles.track}>
          {renderSceneFor(scene, beat)}
        </div>
      </div>

      {/* Vine overlay during transition */}
      {vinePhase && <VineOverlay phase={vinePhase} />}

      {renderNav()}
    </div>
  );
}

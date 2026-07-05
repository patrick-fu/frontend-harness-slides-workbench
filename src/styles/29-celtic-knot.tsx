import React, { useEffect, useState, useCallback } from "react";
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
      "https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&family=Inter:wght@300;400;500;600&display=swap";
    document.head.appendChild(link);
  }, []);
}

const SCENES = {
  1: {
    en: { title: "CELTIC", titleEn: "Knotwork", sub: "Eternal Interlace — The Book of Kells Tradition" },
    zh: { title: "凯尔特", titleEn: "结饰", sub: "永恒交织——凯尔经传统" },
  },
  2: {
    en: {
      label: "Motifs",
      heading: "Sacred patterns of the Celts",
      motifs: [
        { name: "Triskele", meaning: "Three realms — land, sea, sky" },
        { name: "Dara Knot", meaning: "Strength of the oak tree" },
        { name: "Celtic Cross", meaning: "Four directions, infinite cycle" },
        { name: "Shamrock", meaning: "Holy trinity in nature" },
      ],
    },
    zh: {
      label: "纹样",
      heading: "凯尔特的神圣图案",
      motifs: [
        { name: "三螺旋", meaning: "三界——陆、海、天" },
        { name: "达拉结", meaning: "橡树的力量" },
        { name: "凯尔特十字", meaning: "四方与无限循环" },
        { name: "三叶草", meaning: "自然中的三位一体" },
      ],
    },
  },
  3: {
    en: {
      label: "Manuscripts",
      heading: "Illuminated treasures",
      manuscripts: [
        { name: "Book of Kells", year: "c. 800", origin: "Iona / Kells" },
        { name: "Book of Durrow", year: "c. 700", origin: "Durrow Abbey" },
        { name: "Lindisfarne Gospels", year: "c. 700", origin: "Holy Island" },
      ],
    },
    zh: {
      label: "手抄本",
      heading: "泥金装饰珍宝",
      manuscripts: [
        { name: "凯尔经", year: "约 800", origin: "艾奥纳 / 凯尔" },
        { name: "达罗书", year: "约 700", origin: "达罗修道院" },
        { name: "林迪斯法恩福音书", year: "约 700", origin: "圣岛" },
      ],
    },
  },
  4: {
    en: {
      label: "Materials",
      heading: "Tools of the illuminator",
      materials: [
        { name: "Vellum", desc: "Calfskin parchment" },
        { name: "Iron Gall Ink", desc: "Oak gall + iron sulfate" },
        { name: "Gold Leaf", desc: "24k gold on gesso" },
        { name: "Mineral Pigments", desc: "Azurite, malachite, vermilion" },
      ],
    },
    zh: {
      label: "材料",
      heading: "泥金装饰师的工具",
      materials: [
        { name: "犊皮纸", desc: "小牛皮羊皮纸" },
        { name: "铁胆墨水", desc: "橡果瘿 + 硫酸铁" },
        { name: "金箔", desc: "24K 金贴于石膏底" },
        { name: "矿物颜料", desc: "石青、孔雀石、朱砂" },
      ],
    },
  },
  5: {
    en: { closing: "The thread", accent: "never breaks", sub: "— Eternal interlace" },
    zh: { closing: "线", accent: "永不断裂", sub: "—— 永恒的交织" },
  },
};

function CelticKnotSVG({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <g stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round">
        {/* Central interlace */}
        <path d="M100 30 Q60 30 60 70 Q60 100 100 100 Q140 100 140 70 Q140 30 100 30" />
        <path d="M100 170 Q60 170 60 130 Q60 100 100 100 Q140 100 140 130 Q140 170 100 170" />
        <path d="M30 100 Q30 60 70 60 Q100 60 100 100 Q100 140 70 140 Q30 140 30 100" />
        <path d="M170 100 Q170 60 130 60 Q100 60 100 100 Q100 140 130 140 Q170 140 170 100" />
        {/* Corner flourishes */}
        <path d="M40 40 Q55 55 70 40" opacity="0.5" />
        <path d="M160 40 Q145 55 130 40" opacity="0.5" />
        <path d="M40 160 Q55 145 70 160" opacity="0.5" />
        <path d="M160 160 Q145 145 130 160" opacity="0.5" />
      </g>
      <circle cx="100" cy="100" r="8" fill="currentColor" opacity="0.3" />
    </svg>
  );
}

function TriskeleSVG({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <g stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round">
        <path d="M50 50 Q50 20 70 15 Q85 12 80 30 Q75 45 50 50" />
        <path d="M50 50 Q76 65 85 80 Q90 92 72 88 Q55 82 50 50" />
        <path d="M50 50 Q24 65 15 80 Q10 92 28 88 Q45 82 50 50" />
        <path d="M50 50 Q50 20 30 15 Q15 12 20 30 Q25 45 50 50" />
      </g>
      <circle cx="50" cy="50" r="5" fill="currentColor" />
    </svg>
  );
}

export function getMetadata(lang: "en" | "zh"): StyleMetadata {
  const nameMap = { en: "Celtic Knot", zh: "凯尔特结" };
  const themeMap = {
    en: "Celtic knotwork — eternal interlace patterns, illuminated manuscript colors, and spiral motifs",
    zh: "凯尔特结饰——永恒交织图案、泥金手抄本色彩与螺旋纹样",
  };
  const densityLabelMap = { en: "Intricate", zh: "繁复" };

  const sceneTitles = {
    en: ["Title", "Motifs", "Manuscripts", "Materials", "Closing"],
    zh: ["标题", "纹样", "手抄本", "材料", "结语"],
  };

  const beatActions = {
    en: {
      1: ["Title and knot appear"],
      2: ["Heading appears", "Motifs 1-2 reveal", "Motifs 3-4 reveal"],
      3: ["Heading appears", "Manuscripts 1-2 appear", "Manuscript 3 appears"],
      4: ["Heading appears", "Materials 1-2 reveal", "Materials 3-4 reveal"],
      5: ["Closing statement"],
    },
    zh: {
      1: ["标题和结饰呈现"],
      2: ["标题呈现", "第 1-2 纹样揭示", "第 3-4 纹样揭示"],
      3: ["标题呈现", "第 1-2 本手抄本呈现", "第 3 本呈现"],
      4: ["标题呈现", "第 1-2 种材料揭示", "第 3-4 种揭示"],
      5: ["结语呈现"],
    },
  };

  const BEAT_COUNTS: Record<number, number> = { 1: 1, 2: 3, 3: 3, 4: 3, 5: 1 };

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
    colors: { bg: "#1a3a2a", ink: "#d4a843", panel: "#0f2818" },
    typography: { header: "Cinzel 700", body: "Inter 400" },
    tags: ["celtic", "knotwork", "irish", "illuminated", "manuscript", "interlace", "triskele", "medieval", "traditional"],
    fonts: ["Cinzel", "Inter"],
    scenes,
  };
}

export default function CelticKnot({
  scene, beat, language, isThumbnail, reducedMotion, onNavigate,
}: BespokeStyleProps) {
  useFonts();
  const [entered, setEntered] = useState(false);

  useEffect(() => {
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
  const trackClasses = [styles.track, styles.animateSceneEnter].filter(Boolean).join(" ");

  const renderScene1 = () => {
    const c = SCENES[1][language as keyof typeof SCENES[1]];
    return (
      <div className={styles.scene1}>
        <CelticKnotSVG className={styles.knotCenter} />
        <div className={styles.scene1Content}>
          <h1 className={styles.titleMain}>{c.title}</h1>
          <p className={styles.titleEn}>{c.titleEn}</p>
          <div className={styles.titleDivider} />
          <p className={styles.titleSub}>{c.sub}</p>
        </div>
      </div>
    );
  };

  const renderScene2 = () => {
    const c = SCENES[2][language as keyof typeof SCENES[2]];
    const motifs = c.motifs as Array<{ name: string; meaning: string }>;
    const visibleCount = beat === 0 ? 0 : beat === 1 ? 2 : 4;
    return (
      <div className={styles.scene2}>
        <span className={styles.sceneLabel}>{c.label}</span>
        <h2 className={styles.sceneHeading}>{c.heading}</h2>
        <div className={styles.motifGrid}>
          {motifs.map((m, i) => {
            const visible = i < visibleCount;
            const cls = [styles.motifCard, visible && entered ? styles.motifVisible : ""].filter(Boolean).join(" ");
            return (
              <div key={i} className={cls} style={reducedMotion ? { opacity: visible ? 1 : 0 } : { transitionDelay: `${i * 0.15}s` }}>
                <TriskeleSVG className={styles.motifIcon} />
                <span className={styles.motifName}>{m.name}</span>
                <p className={styles.motifMeaning}>{m.meaning}</p>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderScene3 = () => {
    const c = SCENES[3][language as keyof typeof SCENES[3]];
    const manuscripts = c.manuscripts as Array<{ name: string; year: string; origin: string }>;
    const visibleCount = beat === 0 ? 0 : beat === 1 ? 2 : 3;
    return (
      <div className={styles.scene3}>
        <span className={styles.sceneLabel}>{c.label}</span>
        <h2 className={styles.sceneHeading}>{c.heading}</h2>
        <div className={styles.manuscriptList}>
          {manuscripts.map((m, i) => {
            const visible = i < visibleCount;
            const cls = [styles.manuscriptRow, visible && entered ? styles.manuscriptVisible : ""].filter(Boolean).join(" ");
            return (
              <div key={i} className={cls} style={reducedMotion ? { opacity: visible ? 1 : 0 } : { transitionDelay: `${i * 0.2}s` }}>
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

  const renderScene4 = () => {
    const c = SCENES[4][language as keyof typeof SCENES[4]];
    const materials = c.materials as Array<{ name: string; desc: string }>;
    const visibleCount = beat === 0 ? 0 : beat === 1 ? 2 : 4;
    return (
      <div className={styles.scene4}>
        <span className={styles.sceneLabel}>{c.label}</span>
        <h2 className={styles.sceneHeading}>{c.heading}</h2>
        <div className={styles.materialGrid}>
          {materials.map((m, i) => {
            const visible = i < visibleCount;
            const cls = [styles.materialCard, visible && entered ? styles.materialVisible : ""].filter(Boolean).join(" ");
            return (
              <div key={i} className={cls} style={reducedMotion ? { opacity: visible ? 1 : 0 } : { transitionDelay: `${i * 0.15}s` }}>
                <span className={styles.materialName}>{m.name}</span>
                <p className={styles.materialDesc}>{m.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderScene5 = () => {
    const c = SCENES[5][language as keyof typeof SCENES[5]];
    return (
      <div className={styles.scene5}>
        <CelticKnotSVG className={styles.knotLarge} />
        <h2 className={styles.closingText}>
          {c.closing} <span className={styles.closingAccent}>{c.accent}</span>
        </h2>
        <p className={styles.closingSub}>{c.sub}</p>
      </div>
    );
  };

  const renderSceneContent = () => {
    switch (scene) {
      case 1: return renderScene1();
      case 2: return renderScene2();
      case 3: return renderScene3();
      case 4: return renderScene4();
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
            <button
              key={s}
              type="button"
              className={itemClasses}
              aria-label={`Jump to scene ${s}`}
              onClick={(e) => handleNavClick(e, s)}
            >
              <TriskeleSVG className={styles.navIcon} />
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <div className={rootClasses}>
      <div
        key={`29-${scene}`}
        className={trackClasses}
        style={reducedMotion ? { animationDuration: "0s" } : undefined}
      >
        {renderSceneContent()}
      </div>
      {renderNav()}
    </div>
  );
}

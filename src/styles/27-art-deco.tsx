import React, { useEffect, useState, useCallback } from "react";
import type { BespokeStyleProps, StyleMetadata } from "../types";
import styles from "./27-art-deco.module.css";

function useFonts() {
  useEffect(() => {
    const id = "style-27-fonts";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Inter:wght@300;400;500;600&display=swap";
    document.head.appendChild(link);
  }, []);
}

const SCENES = {
  1: {
    en: { title: "ART", titleSub: "DECO", sub: "The Jazz Age Elegance — 1920s Modernism" },
    zh: { title: "装饰", titleSub: "艺术", sub: "爵士时代的优雅——1920 年代现代主义" },
  },
  2: {
    en: {
      label: "Design Language",
      heading: "Geometry of luxury",
      elements: [
        { icon: "◆", name: "Chevrons", desc: "Sharp zigzag patterns" },
        { icon: "◈", name: "Sunbursts", desc: "Radiating symmetry" },
        { icon: "◇", name: "Fountains", desc: "Stepped setbacks" },
        { icon: "◊", name: "Floral", desc: "Stylized botanical" },
      ],
    },
    zh: {
      label: "设计语言",
      heading: "奢华的几何",
      elements: [
        { icon: "◆", name: "锯齿纹", desc: "锐利的之字图案" },
        { icon: "◈", name: "旭日纹", desc: "放射状对称" },
        { icon: "◇", name: "阶梯纹", desc: "退台式造型" },
        { icon: "◊", name: "花卉纹", desc: "风格化植物" },
      ],
    },
  },
  3: {
    en: {
      label: "Iconic Buildings",
      heading: "Temples to progress",
      buildings: [
        { name: "Chrysler Building", year: "1930", city: "New York", height: "319m" },
        { name: "Empire State Building", year: "1931", city: "New York", height: "381m" },
        { name: "Radio City Music Hall", year: "1932", city: "New York", height: "—" },
      ],
    },
    zh: {
      label: "标志性建筑",
      heading: "进步的殿堂",
      buildings: [
        { name: "克莱斯勒大厦", year: "1930", city: "纽约", height: "319m" },
        { name: "帝国大厦", year: "1931", city: "纽约", height: "381m" },
        { name: "无线电城音乐厅", year: "1932", city: "纽约", height: "—" },
      ],
    },
  },
  4: {
    en: {
      label: "Materials",
      heading: "Chrome, marble, and lacquer",
      materials: [
        { name: "Stainless Steel", use: "Cladding & ornament" },
        { name: "Ebony", use: "Furniture inlay" },
        { name: "Ivory", use: "Decorative accents" },
        { name: "Shagreen", use: "Luxury surfaces" },
      ],
    },
    zh: {
      label: "材料",
      heading: "铬合金、大理石与漆",
      materials: [
        { name: "不锈钢", use: "外立面与装饰" },
        { name: "乌木", use: "家具镶嵌" },
        { name: "象牙", use: "装饰点缀" },
        { name: "鲨鱼皮", use: "奢华表面" },
      ],
    },
  },
  5: {
    en: { closing: "Elegance", accent: "is eternal", sub: "— Modernism's golden age" },
    zh: { closing: "优雅", accent: "永恒", sub: "—— 现代主义的黄金时代" },
  },
};

function DecoFanSVG({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <linearGradient id="decoGold27" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#d4a843" />
          <stop offset="50%" stopColor="#f0d060" />
          <stop offset="100%" stopColor="#b8860b" />
        </linearGradient>
      </defs>
      {[...Array(9)].map((_, i) => {
        const angle = -60 + i * 15;
        const rad = (angle * Math.PI) / 180;
        const x2 = 100 + 85 * Math.cos(rad);
        const y2 = 180 - 85 * Math.sin(rad);
        return (
          <line key={i} x1="100" y1="180" x2={x2} y2={y2}
            stroke="url(#decoGold27)" strokeWidth={i === 4 ? "3" : "1.5"} opacity={0.6 + i * 0.04} />
        );
      })}
      <path d="M100 180 Q100 100 100 80" stroke="url(#decoGold27)" strokeWidth="2" fill="none" />
      <circle cx="100" cy="180" r="8" fill="url(#decoGold27)" />
    </svg>
  );
}

function DecoBorderSVG({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 600 30" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <linearGradient id="decoGoldBorder27" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#d4a843" stopOpacity="0" />
          <stop offset="50%" stopColor="#f0d060" />
          <stop offset="100%" stopColor="#d4a843" stopOpacity="0" />
        </linearGradient>
      </defs>
      <line x1="0" y1="15" x2="600" y2="15" stroke="url(#decoGoldBorder27)" strokeWidth="1" />
      {[...Array(11)].map((_, i) => (
        <polygon key={i} points={`${50 + i * 50},8 ${55 + i * 50},15 ${50 + i * 50},22 ${45 + i * 50},15`}
          fill="#d4a843" opacity="0.7" />
      ))}
    </svg>
  );
}

export function getMetadata(lang: "en" | "zh"): StyleMetadata {
  const nameMap = { en: "Art Deco", zh: "装饰艺术" };
  const themeMap = {
    en: "1920s Art Deco — geometric luxury, gold on midnight blue, sunburst motifs, and stepped forms",
    zh: "1920 年代装饰艺术——几何奢华，金色配午夜蓝，旭日纹样与阶梯造型",
  };
  const densityLabelMap = { en: "Ornate", zh: "华丽" };

  const sceneTitles = {
    en: ["Title", "Design Language", "Buildings", "Materials", "Closing"],
    zh: ["标题", "设计语言", "建筑", "材料", "结语"],
  };

  const beatActions = {
    en: {
      1: ["Title and subtitle appear"],
      2: ["Heading appears", "Elements 1-2 reveal", "Elements 3-4 reveal"],
      3: ["Heading appears", "Buildings 1-2 appear", "Building 3 appears"],
      4: ["Heading appears", "Materials 1-2 reveal", "Materials 3-4 reveal"],
      5: ["Closing statement"],
    },
    zh: {
      1: ["标题和副标题呈现"],
      2: ["标题呈现", "第 1-2 元素揭示", "第 3-4 元素揭示"],
      3: ["标题呈现", "第 1-2 栋建筑呈现", "第 3 栋建筑呈现"],
      4: ["标题呈现", "第 1-2 种材料揭示", "第 3-4 种材料揭示"],
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
        beatTitle = `${c.title} ${c.titleSub}`;
        beatBody = c.sub;
      } else if (id === 2) {
        beatTitle = c.heading;
        const items = (c.elements as Array<{ name: string }>) || [];
        const visible = Math.min(beatIdx * 2, 4);
        beatBody = items.slice(0, visible).map((s) => s.name).join(" / ");
      } else if (id === 3) {
        beatTitle = c.heading;
        const buildings = (c.buildings as Array<{ name: string }>) || [];
        const visible = Math.min(beatIdx * 2, 3);
        beatBody = buildings.slice(0, visible).map((b) => b.name).join(" / ");
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
    id: "27",
    band: "craft-cultural",
    name: nameMap[lang],
    theme: themeMap[lang],
    densityLabel: densityLabelMap[lang],
    heroScene: 3,
    colors: { bg: "#0a1628", ink: "#d4a843", panel: "#122040" },
    typography: { header: "Playfair Display 700", body: "Inter 400" },
    tags: ["art-deco", "1920s", "geometric", "gold", "luxury", "jazz-age", "modernism", "ornate", "symmetrical"],
    fonts: ["Playfair Display", "Inter"],
    scenes,
  };
}

export default function ArtDeco({
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
        <DecoFanSVG className={styles.fanLeft} />
        <DecoFanSVG className={styles.fanRight} />
        <DecoBorderSVG className={styles.borderTop} />
        <div className={styles.scene1Content}>
          <h1 className={styles.titleMain}>{c.title}</h1>
          <div className={styles.titleDivider}>
            <span className={styles.dividerDiamond}>◆</span>
          </div>
          <h1 className={styles.titleSub}>{c.titleSub}</h1>
          <p className={styles.titleTag}>{c.sub}</p>
        </div>
        <DecoBorderSVG className={styles.borderBottom} />
      </div>
    );
  };

  const renderScene2 = () => {
    const c = SCENES[2][language as keyof typeof SCENES[2]];
    const elements = c.elements as Array<{ icon: string; name: string; desc: string }>;
    const visibleCount = beat === 0 ? 0 : beat === 1 ? 2 : 4;
    return (
      <div className={styles.scene2}>
        <span className={styles.sceneLabel}>{c.label}</span>
        <h2 className={styles.sceneHeading}>{c.heading}</h2>
        <div className={styles.decoGrid}>
          {elements.map((el, i) => {
            const visible = i < visibleCount;
            const cls = [styles.decoCard, visible && entered ? styles.decoCardVisible : ""].filter(Boolean).join(" ");
            return (
              <div key={i} className={cls} style={reducedMotion ? { opacity: visible ? 1 : 0 } : { transitionDelay: `${i * 0.15}s` }}>
                <span className={styles.decoIcon}>{el.icon}</span>
                <span className={styles.decoName}>{el.name}</span>
                <p className={styles.decoDesc}>{el.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderScene3 = () => {
    const c = SCENES[3][language as keyof typeof SCENES[3]];
    const buildings = c.buildings as Array<{ name: string; year: string; city: string; height: string }>;
    const visibleCount = beat === 0 ? 0 : beat === 1 ? 2 : 3;
    return (
      <div className={styles.scene3}>
        <span className={styles.sceneLabel}>{c.label}</span>
        <h2 className={styles.sceneHeading}>{c.heading}</h2>
        <div className={styles.buildingList}>
          {buildings.map((b, i) => {
            const visible = i < visibleCount;
            const cls = [styles.buildingRow, visible && entered ? styles.buildingVisible : ""].filter(Boolean).join(" ");
            return (
              <div key={i} className={cls} style={reducedMotion ? { opacity: visible ? 1 : 0 } : { transitionDelay: `${i * 0.2}s` }}>
                <div className={styles.buildingSpire} aria-hidden="true">
                  <svg viewBox="0 0 20 60" fill="none"><path d="M10 0 L15 20 L15 55 L10 60 L5 55 L5 20Z" fill="currentColor" opacity="0.3" /></svg>
                </div>
                <span className={styles.buildingName}>{b.name}</span>
                <span className={styles.buildingYear}>{b.year}</span>
                <span className={styles.buildingCity}>{b.city}</span>
                <span className={styles.buildingHeight}>{b.height}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderScene4 = () => {
    const c = SCENES[4][language as keyof typeof SCENES[4]];
    const materials = c.materials as Array<{ name: string; use: string }>;
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
                <p className={styles.materialUse}>{m.use}</p>
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
        <DecoFanSVG className={styles.fanCenter} />
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
              <span className={styles.navDiamond}>◆</span>
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <div className={rootClasses}>
      <div
        key={`27-${scene}`}
        className={trackClasses}
        style={reducedMotion ? { animationDuration: "0s" } : undefined}
      >
        {renderSceneContent()}
      </div>
      {renderNav()}
    </div>
  );
}

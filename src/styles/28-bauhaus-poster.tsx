import React, { useEffect, useState, useRef, useCallback } from "react";
import type { BespokeStyleProps, StyleMetadata } from "../types";
import styles from "./28-bauhaus-poster.module.css";

function useFonts() {
  useEffect(() => {
    const id = "style-28-fonts";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Archivo+Black&family=Inter:wght@300;400;500;600;700&display=swap";
    document.head.appendChild(link);
  }, []);
}

const SCENES = {
  1: {
    en: { title: "BAUHAUS", sub: "Form Follows Function — Dessau 1919" },
    zh: { title: "包豪斯", sub: "形式追随功能——德绍 1919" },
  },
  2: {
    en: {
      label: "Principles",
      heading: "Three pillars of modern design",
      pillars: [
        { shape: "circle", color: "#e63946", title: "Red", desc: "Primary emotion" },
        { shape: "square", color: "#1d3557", title: "Blue", desc: "Spiritual depth" },
        { shape: "triangle", color: "#f4a261", title: "Yellow", desc: "Intellectual clarity" },
      ],
    },
    zh: {
      label: "原则",
      heading: "现代设计三大支柱",
      pillars: [
        { shape: "circle", color: "#e63946", title: "红", desc: "原始情感" },
        { shape: "square", color: "#1d3557", title: "蓝", desc: "精神深度" },
        { shape: "triangle", color: "#f4a261", title: "黄", desc: "智性清晰" },
      ],
    },
  },
  3: {
    en: {
      label: "Masters",
      heading: "Teachers of the Bauhaus",
      masters: [
        { name: "Walter Gropius", role: "Founder", years: "1919–1928" },
        { name: "Wassily Kandinsky", role: "Painter", years: "1922–1933" },
        { name: "Paul Klee", role: "Painter", years: "1921–1931" },
        { name: "László Moholy-Nagy", role: "Typography", years: "1923–1928" },
      ],
    },
    zh: {
      label: "大师",
      heading: "包豪斯的教师们",
      masters: [
        { name: "瓦尔特·格罗皮乌斯", role: "创始人", years: "1919–1928" },
        { name: "瓦西里·康定斯基", role: "画家", years: "1922–1933" },
        { name: "保罗·克利", role: "画家", years: "1921–1931" },
        { name: "莫霍利-纳吉", role: "字体设计", years: "1923–1928" },
      ],
    },
  },
  4: {
    en: {
      label: "Legacy",
      heading: "Design for the machine age",
      stats: [
        { value: "14", label: "Years active" },
        { value: "3", label: "Cities" },
        { value: "1250+", label: "Students" },
      ],
    },
    zh: {
      label: "遗产",
      heading: "为机器时代而设计",
      stats: [
        { value: "14", label: "活跃年份" },
        { value: "3", label: "座城市" },
        { value: "1250+", label: "名学生" },
      ],
    },
  },
  5: {
    en: { closing: "Form", accent: "follows function", sub: "— The Bauhaus manifesto" },
    zh: { closing: "形式", accent: "追随功能", sub: "—— 包豪斯宣言" },
  },
};

function BauhausShape({ type, color, size, className }: { type: string; color: string; size: number; className?: string }) {
  if (type === "circle") {
    return (
      <svg className={className} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
        <circle cx={size / 2} cy={size / 2} r={size / 2 - 2} fill={color} />
      </svg>
    );
  }
  if (type === "square") {
    return (
      <svg className={className} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
        <rect x="2" y="2" width={size - 4} height={size - 4} fill={color} />
      </svg>
    );
  }
  return (
    <svg className={className} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
      <polygon points={`${size / 2},2 ${size - 2},${size - 2} 2,${size - 2}`} fill={color} />
    </svg>
  );
}

export function getMetadata(lang: "en" | "zh"): StyleMetadata {
  const nameMap = { en: "Bauhaus Poster", zh: "包豪斯海报" };
  const themeMap = {
    en: "Bauhaus 1919 — primary colors, geometric shapes, bold typography, and grid-based composition",
    zh: "1919 包豪斯——原色、几何形状、粗体字体与网格构图",
  };
  const densityLabelMap = { en: "Graphic", zh: "图形化" };

  const sceneTitles = {
    en: ["Title", "Principles", "Masters", "Legacy", "Closing"],
    zh: ["标题", "原则", "大师", "遗产", "结语"],
  };

  const beatActions = {
    en: {
      1: ["Title and shapes appear"],
      2: ["Heading appears", "Pillars 1-2 reveal", "Pillar 3 reveals"],
      3: ["Heading appears", "Masters 1-2 appear", "Masters 3-4 appear"],
      4: ["Stats populate"],
      5: ["Closing statement"],
    },
    zh: {
      1: ["标题和形状呈现"],
      2: ["标题呈现", "第 1-2 支柱揭示", "第 3 支柱揭示"],
      3: ["标题呈现", "第 1-2 位大师呈现", "第 3-4 位大师呈现"],
      4: ["数据填充"],
      5: ["结语呈现"],
    },
  };

  const BEAT_COUNTS: Record<number, number> = { 1: 1, 2: 3, 3: 3, 4: 1, 5: 1 };

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
        const pillars = (c.pillars as Array<{ title: string }>) || [];
        const visible = Math.min(beatIdx * 2, 3);
        beatBody = pillars.slice(0, visible).map((p) => p.title).join(" / ");
      } else if (id === 3) {
        beatTitle = c.heading;
        const masters = (c.masters as Array<{ name: string }>) || [];
        const visible = Math.min(beatIdx * 2, 4);
        beatBody = masters.slice(0, visible).map((m) => m.name).join(" / ");
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
    id: "28",
    band: "craft-cultural",
    name: nameMap[lang],
    theme: themeMap[lang],
    densityLabel: densityLabelMap[lang],
    heroScene: 2,
    colors: { bg: "#f0e6d2", ink: "#1a1a1a", panel: "#e6d9c0" },
    typography: { header: "Archivo Black 400", body: "Inter 400" },
    tags: ["bauhaus", "geometric", "primary-colors", "grid", "modernism", "typography", "1919", "dessau", "poster"],
    fonts: ["Archivo Black", "Inter"],
    scenes,
  };
}

export default function BauhausPoster({
  scene, beat, language, isThumbnail, reducedMotion, onNavigate,
}: BespokeStyleProps) {
  useFonts();
  const [entered, setEntered] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

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
  const trackClasses = [styles.track, entered ? styles.trackActive : styles.trackEnter].filter(Boolean).join(" ");

  const renderScene1 = () => {
    const c = SCENES[1][language as keyof typeof SCENES[1]];
    return (
      <div className={styles.scene1}>
        <div className={styles.shapesArea}>
          <BauhausShape type="circle" color="#e63946" size={120} className={styles.shapeCircle} />
          <BauhausShape type="square" color="#1d3557" size={100} className={styles.shapeSquare} />
          <BauhausShape type="triangle" color="#f4a261" size={110} className={styles.shapeTriangle} />
        </div>
        <div className={styles.scene1Content}>
          <h1 className={styles.titleText}>{c.title}</h1>
          <div className={styles.titleBar} />
          <p className={styles.titleSub}>{c.sub}</p>
        </div>
      </div>
    );
  };

  const renderScene2 = () => {
    const c = SCENES[2][language as keyof typeof SCENES[2]];
    const pillars = c.pillars as Array<{ shape: string; color: string; title: string; desc: string }>;
    const visibleCount = beat === 0 ? 0 : beat === 1 ? 2 : 3;
    return (
      <div className={styles.scene2}>
        <span className={styles.sceneLabel}>{c.label}</span>
        <h2 className={styles.sceneHeading}>{c.heading}</h2>
        <div className={styles.pillarsRow}>
          {pillars.map((p, i) => {
            const visible = i < visibleCount;
            const cls = [styles.pillarCard, visible && entered ? styles.pillarVisible : ""].filter(Boolean).join(" ");
            return (
              <div key={i} className={cls} style={reducedMotion ? { opacity: visible ? 1 : 0 } : { transitionDelay: `${i * 0.2}s` }}>
                <BauhausShape type={p.shape} color={p.color} size={80} className={styles.pillarShape} />
                <span className={styles.pillarTitle}>{p.title}</span>
                <p className={styles.pillarDesc}>{p.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderScene3 = () => {
    const c = SCENES[3][language as keyof typeof SCENES[3]];
    const masters = c.masters as Array<{ name: string; role: string; years: string }>;
    const visibleCount = beat === 0 ? 0 : beat === 1 ? 2 : 4;
    return (
      <div className={styles.scene3}>
        <span className={styles.sceneLabel}>{c.label}</span>
        <h2 className={styles.sceneHeading}>{c.heading}</h2>
        <div className={styles.mastersGrid}>
          {masters.map((m, i) => {
            const visible = i < visibleCount;
            const cls = [styles.masterCard, visible && entered ? styles.masterVisible : ""].filter(Boolean).join(" ");
            return (
              <div key={i} className={cls} style={reducedMotion ? { opacity: visible ? 1 : 0 } : { transitionDelay: `${i * 0.15}s` }}>
                <div className={styles.masterNum}>{String(i + 1).padStart(2, "0")}</div>
                <span className={styles.masterName}>{m.name}</span>
                <span className={styles.masterRole}>{m.role}</span>
                <span className={styles.masterYears}>{m.years}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderScene4 = () => {
    const c = SCENES[4][language as keyof typeof SCENES[4]];
    const stats = c.stats as Array<{ value: string; label: string }>;
    return (
      <div className={styles.scene4}>
        <span className={styles.sceneLabel}>{c.label}</span>
        <h2 className={styles.sceneHeading}>{c.heading}</h2>
        {beat >= 1 && (
          <div className={styles.statsRow}>
            {stats.map((s, i) => (
              <div key={i} className={styles.statBlock} style={reducedMotion ? { opacity: 1 } : { transitionDelay: `${i * 0.15}s` }}>
                <span className={styles.statValue}>{s.value}</span>
                <span className={styles.statLabel}>{s.label}</span>
              </div>
            ))}
          </div>
        )}
        <div className={styles.compositionArea}>
          <BauhausShape type="circle" color="#e63946" size={60} className={styles.compCircle} />
          <BauhausShape type="square" color="#1d3557" size={50} className={styles.compSquare} />
          <BauhausShape type="triangle" color="#f4a261" size={55} className={styles.compTriangle} />
        </div>
      </div>
    );
  };

  const renderScene5 = () => {
    const c = SCENES[5][language as keyof typeof SCENES[5]];
    return (
      <div className={styles.scene5}>
        <div className={styles.gridLines} aria-hidden="true">
          <div className={styles.gridH1} />
          <div className={styles.gridH2} />
          <div className={styles.gridV1} />
          <div className={styles.gridV2} />
        </div>
        <h2 className={styles.closingText}>
          {c.closing} <span className={styles.closingAccent}>{c.accent}</span>
        </h2>
        <p className={styles.closingSub}>{c.sub}</p>
        <BauhausShape type="circle" color="#e63946" size={30} className={styles.closingDot} />
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
              <span className={styles.navNum}>{s}</span>
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <div className={rootClasses}>
      <div
        ref={trackRef}
        key={`28-${scene}`}
        className={trackClasses}
        style={reducedMotion ? { transitionDuration: "0s" } : undefined}
      >
        {renderSceneContent()}
      </div>
      {renderNav()}
    </div>
  );
}

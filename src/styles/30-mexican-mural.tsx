import React, { useEffect, useState, useRef, useCallback } from "react";
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
      "https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@300;400;500;600;700&display=swap";
    document.head.appendChild(link);
  }, []);
}

const SCENES = {
  1: {
    en: { title: "MURALISMO", sub: "The Mexican Muralist Movement — Art for the People" },
    zh: { title: "壁画运动", sub: "墨西哥壁画运动——为人民的艺术" },
  },
  2: {
    en: {
      label: "Los Tres Grandes",
      heading: "The three great ones",
      artists: [
        { name: "Diego Rivera", years: "1886–1957", style: "Social realist fresco" },
        { name: "José Clemente Orozco", years: "1883–1949", style: "Expressionist fire" },
        { name: "David Alfaro Siqueiros", years: "1896–1974", style: "Experimental mural" },
      ],
    },
    zh: {
      label: "三巨头",
      heading: "三位伟大的艺术家",
      artists: [
        { name: "迭戈·里维拉", years: "1886–1957", style: "社会现实主义湿壁画" },
        { name: "何塞·克莱门特·奥罗斯科", years: "1883–1949", style: "表现主义火焰" },
        { name: "大卫·阿尔法罗·西凯罗斯", years: "1896–1974", style: "实验性壁画" },
      ],
    },
  },
  3: {
    en: {
      label: "Themes",
      heading: "Revolution on the walls",
      themes: [
        { icon: "⚒", title: "Labor", desc: "The dignity of work" },
        { icon: "🌽", title: "Earth", desc: "Roots in the soil" },
        { icon: "✦", title: "Revolution", desc: "Struggle and liberation" },
        { icon: "☀", title: "Sun", desc: "Indigenous heritage" },
      ],
    },
    zh: {
      label: "主题",
      heading: "墙上的革命",
      themes: [
        { icon: "⚒", title: "劳动", desc: "工作的尊严" },
        { icon: "🌽", title: "大地", desc: "扎根于土壤" },
        { icon: "✦", title: "革命", desc: "斗争与解放" },
        { icon: "☀", title: "太阳", desc: "原住民遗产" },
      ],
    },
  },
  4: {
    en: {
      label: "Legacy",
      heading: "Wall as a political canvas",
      stats: [
        { value: "1920", label: "Movement begins" },
        { value: "1000+", label: "Murals painted" },
        { value: "50", label: "Years of influence" },
      ],
    },
    zh: {
      label: "遗产",
      heading: "墙作为政治画布",
      stats: [
        { value: "1920", label: "运动开始" },
        { value: "1000+", label: "壁画作品" },
        { value: "50", label: "年影响力" },
      ],
    },
  },
  5: {
    en: { closing: "El arte", accent: "es un arma", sub: "— Art is a weapon" },
    zh: { closing: "艺术", accent: "即武器", sub: "—— 迭戈·里维拉" },
  },
};

function MuralSunSVG({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <radialGradient id="sunGrad30" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#f4a261" />
          <stop offset="60%" stopColor="#e76f51" />
          <stop offset="100%" stopColor="#c0392b" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="100" cy="100" r="50" fill="url(#sunGrad30)" />
      {[...Array(12)].map((_, i) => {
        const angle = (i * 30 * Math.PI) / 180;
        const x1 = 100 + 55 * Math.cos(angle);
        const y1 = 100 + 55 * Math.sin(angle);
        const x2 = 100 + 85 * Math.cos(angle);
        const y2 = 100 + 85 * Math.sin(angle);
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#e76f51" strokeWidth="3" opacity="0.7" />;
      })}
      <circle cx="100" cy="100" r="35" fill="#f4a261" opacity="0.9" />
    </svg>
  );
}

export function getMetadata(lang: "en" | "zh"): StyleMetadata {
  const nameMap = { en: "Mexican Mural", zh: "墨西哥壁画" };
  const themeMap = {
    en: "Mexican Muralist Movement — bold earth tones, revolutionary themes, and monumental fresco aesthetics",
    zh: "墨西哥壁画运动——大胆的大地色调、革命主题与巨型湿壁画美学",
  };
  const densityLabelMap = { en: "Monumental", zh: "宏大" };

  const sceneTitles = {
    en: ["Title", "Los Tres Grandes", "Themes", "Legacy", "Closing"],
    zh: ["标题", "三巨头", "主题", "遗产", "结语"],
  };

  const beatActions = {
    en: {
      1: ["Title and sun appear"],
      2: ["Heading appears", "Artists 1-2 appear", "Artist 3 appears"],
      3: ["Heading appears", "Themes 1-2 reveal", "Themes 3-4 reveal"],
      4: ["Stats populate"],
      5: ["Closing statement"],
    },
    zh: {
      1: ["标题和太阳呈现"],
      2: ["标题呈现", "第 1-2 位艺术家呈现", "第 3 位呈现"],
      3: ["标题呈现", "第 1-2 主题揭示", "第 3-4 主题揭示"],
      4: ["数据填充"],
      5: ["结语呈现"],
    },
  };

  const BEAT_COUNTS: Record<number, number> = { 1: 1, 2: 3, 3: 3, 4: 2, 5: 1 };

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
        const artists = (c.artists as Array<{ name: string }>) || [];
        const visible = Math.min((beatIdx + 1) * 2, 3);
        beatBody = artists.slice(0, visible).map((a) => a.name).join(" / ");
      } else if (id === 3) {
        beatTitle = c.heading;
        const themes = (c.themes as Array<{ title: string }>) || [];
        const visible = Math.min((beatIdx + 1) * 2, 4);
        beatBody = themes.slice(0, visible).map((t) => t.title).join(" / ");
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
    colors: { bg: "#2d1810", ink: "#f4a261", panel: "#3d2418" },
    typography: { header: "Bebas Neue 400", body: "Inter 400" },
    tags: ["mural", "mexican", "revolution", "fresco", "rivera", "social-realism", "earth-tones", "monumental", "political"],
    fonts: ["Bebas Neue", "Inter"],
    scenes,
  };
}

export default function MexicanMural({
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
        <MuralSunSVG className={styles.sunBg} />
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
    const artists = c.artists as Array<{ name: string; years: string; style: string }>;
    const visibleCount = beat === 0 ? 0 : beat === 1 ? 2 : 3;
    return (
      <div className={styles.scene2}>
        <span className={styles.sceneLabel}>{c.label}</span>
        <h2 className={styles.sceneHeading}>{c.heading}</h2>
        <div className={styles.artistList}>
          {artists.map((a, i) => {
            const visible = i < visibleCount;
            const cls = [styles.artistRow, visible && entered ? styles.artistVisible : ""].filter(Boolean).join(" ");
            return (
              <div key={i} className={cls} style={reducedMotion ? { opacity: visible ? 1 : 0 } : { transitionDelay: `${i * 0.2}s` }}>
                <div className={styles.artistPortrait} aria-hidden="true">
                  <svg viewBox="0 0 60 60" fill="none">
                    <circle cx="30" cy="30" r="28" fill="currentColor" opacity="0.2" />
                    <circle cx="30" cy="24" r="10" fill="currentColor" opacity="0.4" />
                    <ellipse cx="30" cy="48" rx="16" ry="10" fill="currentColor" opacity="0.3" />
                  </svg>
                </div>
                <div className={styles.artistInfo}>
                  <span className={styles.artistName}>{a.name}</span>
                  <span className={styles.artistYears}>{a.years}</span>
                </div>
                <span className={styles.artistStyle}>{a.style}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderScene3 = () => {
    const c = SCENES[3][language as keyof typeof SCENES[3]];
    const themes = c.themes as Array<{ icon: string; title: string; desc: string }>;
    const visibleCount = beat === 0 ? 0 : beat === 1 ? 2 : 4;
    return (
      <div className={styles.scene3}>
        <span className={styles.sceneLabel}>{c.label}</span>
        <h2 className={styles.sceneHeading}>{c.heading}</h2>
        <div className={styles.themeGrid}>
          {themes.map((t, i) => {
            const visible = i < visibleCount;
            const cls = [styles.themeCard, visible && entered ? styles.themeVisible : ""].filter(Boolean).join(" ");
            return (
              <div key={i} className={cls} style={reducedMotion ? { opacity: visible ? 1 : 0 } : { transitionDelay: `${i * 0.15}s` }}>
                <span className={styles.themeIcon}>{t.icon}</span>
                <span className={styles.themeTitle}>{t.title}</span>
                <p className={styles.themeDesc}>{t.desc}</p>
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
              <div key={i} className={styles.statBlock}>
                <span className={styles.statValue}>{s.value}</span>
                <span className={styles.statLabel}>{s.label}</span>
              </div>
            ))}
          </div>
        )}
        <div className={styles.wallTexture} aria-hidden="true" />
      </div>
    );
  };

  const renderScene5 = () => {
    const c = SCENES[5][language as keyof typeof SCENES[5]];
    return (
      <div className={styles.scene5}>
        <MuralSunSVG className={styles.sunSmall} />
        <h2 className={styles.closingText}>
          {c.closing} <span className={styles.closingAccent}>{c.accent}</span>
        </h2>
        <p className={styles.closingSub}>{c.sub}</p>
        <div className={styles.fistIcon} aria-hidden="true">✊</div>
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
              <span className={styles.navBar} />
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
        key={`30-${scene}`}
        className={trackClasses}
        style={reducedMotion ? { transitionDuration: "0s" } : undefined}
      >
        {renderSceneContent()}
      </div>
      {renderNav()}
    </div>
  );
}

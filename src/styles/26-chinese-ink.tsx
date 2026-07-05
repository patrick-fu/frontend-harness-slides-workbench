import React, { useEffect, useState, useCallback, useRef } from "react";
import type { BespokeStyleProps, StyleMetadata } from "../types";
import styles from "./26-chinese-ink.module.css";

function useFonts() {
  useEffect(() => {
    const id = "style-26-fonts";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;700;900&family=Inter:wght@300;400;500;600&display=swap";
    document.head.appendChild(link);
  }, []);
}

const SCENES = {
  1: {
    en: { title: "水墨", titleEn: "Ink Wash", sub: "Chinese Literati Painting Aesthetic" },
    zh: { title: "水墨", titleEn: "Ink Wash", sub: "中国文人画美学" },
  },
  2: {
    en: {
      label: "Four Treasures",
      heading: "Tools of the scholar",
      items: [
        { char: "筆", name: "Brush", desc: "Wolf or goat hair, bamboo handle" },
        { char: "墨", name: "Ink", desc: "Pine soot or oil soot cake" },
        { char: "紙", name: "Paper", desc: "Xuan rice paper, aged for decades" },
        { char: "硯", name: "Inkstone", desc: "Duan or She stone, carved reservoir" },
      ],
    },
    zh: {
      label: "文房四宝",
      heading: "文人之器",
      items: [
        { char: "筆", name: "笔", desc: "狼毫或羊毫，竹制笔杆" },
        { char: "墨", name: "墨", desc: "松烟或油烟墨锭" },
        { char: "紙", name: "纸", desc: "宣纸，陈年为佳" },
        { char: "硯", name: "砚", desc: "端砚或歙砚，雕刻砚池" },
      ],
    },
  },
  3: {
    en: {
      label: "Mountains",
      heading: "Distant peaks emerge from mist",
      poem: "千山鸟飞绝，万径人踪灭",
      poemEn: "A thousand mountains, no bird in flight. Ten thousand paths, no human trace.",
    },
    zh: {
      label: "山水",
      heading: "远山从雾中浮现",
      poem: "千山鸟飞绝，万径人踪灭",
      poemEn: "千山鸟飞绝，万径人踪灭",
    },
  },
  4: {
    en: {
      label: "Masters",
      heading: "Great ink painters",
      masters: [
        { name: "Fan Kuan", era: "c. 990–1030", work: "Travelers Among Mountains and Streams" },
        { name: "Ni Zan", era: "1301–1374", work: "Six Gentlemen" },
        { name: "Bada Shanren", era: "1626–1705", work: "Lotus and Birds" },
      ],
    },
    zh: {
      label: "大家",
      heading: "水墨大家",
      masters: [
        { name: "范宽", era: "约 990–1030", work: "溪山行旅图" },
        { name: "倪瓒", era: "1301–1374", work: "六君子图" },
        { name: "八大山人", era: "1626–1705", work: "荷鸟图" },
      ],
    },
  },
  5: {
    en: { closing: "留白", accent: "处皆有天地", sub: "— Empty space holds infinite meaning" },
    zh: { closing: "留白", accent: "处皆有天地", sub: "—— 空白处蕴含无限" },
  },
};

function InkMountainSVG({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 800 300" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <linearGradient id="inkGrad26" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1a1a1a" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#1a1a1a" stopOpacity="0.05" />
        </linearGradient>
      </defs>
      {/* Far mountains */}
      <path d="M0 200 Q80 140 160 170 Q240 120 320 155 Q400 100 480 145 Q560 110 640 140 Q720 120 800 160 L800 300 L0 300Z" fill="url(#inkGrad26)" opacity="0.3" />
      {/* Mid mountains */}
      <path d="M0 230 Q100 180 200 210 Q300 160 400 200 Q500 170 600 195 Q700 175 800 210 L800 300 L0 300Z" fill="url(#inkGrad26)" opacity="0.5" />
      {/* Near mountain */}
      <path d="M100 280 Q200 200 280 240 Q340 180 420 230 Q500 190 580 250 Q650 220 720 260 L720 300 L100 300Z" fill="#1a1a1a" opacity="0.7" />
      {/* Ink splatters */}
      <circle cx="150" cy="260" r="8" fill="#1a1a1a" opacity="0.4" />
      <circle cx="450" cy="270" r="5" fill="#1a1a1a" opacity="0.3" />
      <circle cx="650" cy="255" r="10" fill="#1a1a1a" opacity="0.25" />
    </svg>
  );
}

function BambooSVG({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 120 400" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <line x1="60" y1="20" x2="60" y2="380" stroke="#1a1a1a" strokeWidth="4" opacity="0.7" />
      {[60, 120, 180, 240, 300, 360].map((y, i) => (
        <ellipse key={i} cx="60" cy={y} rx="8" ry="3" stroke="#1a1a1a" strokeWidth="2" fill="none" opacity="0.6" />
      ))}
      {/* Leaves */}
      <path d="M60 80 Q30 60 10 70 Q35 75 60 85" fill="#1a1a1a" opacity="0.6" />
      <path d="M60 140 Q90 115 110 125 Q85 135 60 145" fill="#1a1a1a" opacity="0.5" />
      <path d="M60 200 Q25 175 5 190 Q30 195 60 205" fill="#1a1a1a" opacity="0.55" />
      <path d="M60 260 Q95 240 115 250 Q88 258 60 265" fill="#1a1a1a" opacity="0.5" />
    </svg>
  );
}

export function getMetadata(lang: "en" | "zh"): StyleMetadata {
  const nameMap = { en: "Chinese Ink", zh: "水墨画" };
  const themeMap = {
    en: "Chinese literati painting — ink wash on rice paper, misty mountains, bamboo, and calligraphic brushwork",
    zh: "中国文人画——宣纸水墨，烟雨山水，竹影与书法笔意",
  };
  const densityLabelMap = { en: "Sparse", zh: "留白" };

  const sceneTitles = {
    en: ["Title", "Four Treasures", "Mountains", "Masters", "Closing"],
    zh: ["标题", "文房四宝", "山水", "大家", "结语"],
  };

  const beatActions = {
    en: {
      1: ["Title and subtitle appear"],
      2: ["Heading appears", "Treasures 1-2 reveal", "Treasures 3-4 reveal"],
      3: ["Mountains emerge from mist", "Poem calligraphy appears"],
      4: ["Heading appears", "Masters 1-2 appear", "Master 3 appears"],
      5: ["Closing statement"],
    },
    zh: {
      1: ["标题和副标题呈现"],
      2: ["标题呈现", "第 1-2 宝揭示", "第 3-4 宝揭示"],
      3: ["山水从雾中浮现", "诗句书法呈现"],
      4: ["标题呈现", "第 1-2 位大家呈现", "第 3 位大家呈现"],
      5: ["结语呈现"],
    },
  };

  const BEAT_COUNTS: Record<number, number> = { 1: 1, 2: 3, 3: 2, 4: 3, 5: 1 };

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
        const items = (c.items as Array<{ name: string }>) || [];
        const visible = Math.min(beatIdx * 2, 4);
        beatBody = items.slice(0, visible).map((s) => s.name).join(" / ");
      } else if (id === 3) {
        beatTitle = c.heading;
        beatBody = beatIdx === 0 ? c.heading : c.poem;
      } else if (id === 4) {
        beatTitle = c.heading;
        const masters = (c.masters as Array<{ name: string }>) || [];
        const visible = Math.min(beatIdx * 2, 3);
        beatBody = masters.slice(0, visible).map((m) => m.name).join(" / ");
      } else if (id === 5) {
        beatTitle = `${c.closing}${c.accent}`;
        beatBody = c.sub;
      }

      return { id: beatIdx, action: actions[beatIdx], title: beatTitle, body: beatBody };
    });

    return { id, title: sceneTitles[lang][id - 1], beats };
  });

  return {
    id: "26",
    band: "craft-cultural",
    name: nameMap[lang],
    theme: themeMap[lang],
    densityLabel: densityLabelMap[lang],
    heroScene: 3,
    colors: { bg: "#f5f0e8", ink: "#1a1a1a", panel: "#ebe5d9" },
    typography: { header: "Noto Serif SC 700", body: "Inter 400" },
    tags: ["ink", "chinese", "shan-shui", "literati", "bamboo", "calligraphy", "xuan-paper", "traditional", "minimal"],
    fonts: ["cjk:Noto Serif SC", "Inter"],
    scenes,
  };
}

// ─── Transition constants ─────────────────────────────────────────────────

const TRANSITION_DURATION = 950; // ms — enter 900ms, exit 600ms
const BEAT_COUNTS: Record<number, number> = { 1: 1, 2: 3, 3: 2, 4: 3, 5: 1 };

// ─── Component ──────────────────────────────────────────────────────────────

export default function ChineseInk({
  scene, beat, language, isThumbnail, reducedMotion, onNavigate, isTransitionClone,
}: BespokeStyleProps) {
  useFonts();
  const [entered, setEntered] = useState(false);
  const [outgoingScene, setOutgoingScene] = useState<number | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const prevSceneRef = useRef<number>(scene);

  // Detect scene changes and manage transition lifecycle
  useEffect(() => {
    const prev = prevSceneRef.current;
    if (prev !== scene && !reducedMotion) {
      setOutgoingScene(prev);
      setIsTransitioning(true);
      const timer = setTimeout(() => {
        setOutgoingScene(null);
        setIsTransitioning(false);
      }, TRANSITION_DURATION);
      prevSceneRef.current = scene;
      return () => clearTimeout(timer);
    }
    prevSceneRef.current = scene;
  }, [scene, reducedMotion]);

  // Beat-level entered animation trigger
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

  const renderScene1 = (c: any) => {
    return (
      <div className={styles.scene1}>
        <InkMountainSVG className={styles.mountainBg} />
        <div className={styles.scene1Content}>
          <h1 className={styles.titleChar}>{c.title}</h1>
          <p className={styles.titleEn}>{c.titleEn}</p>
          <div className={styles.inkDrop} />
          <p className={styles.titleSub}>{c.sub}</p>
        </div>
      </div>
    );
  };

  const renderScene2 = (c: any, beatNum: number, forceEntered: boolean) => {
    const items = c.items as Array<{ char: string; name: string; desc: string }>;
    const visibleCount = beatNum === 0 ? 0 : beatNum === 1 ? 2 : 4;
    const isEntered = forceEntered || entered;
    return (
      <div className={styles.scene2}>
        <span className={styles.sceneLabel}>{c.label}</span>
        <h2 className={styles.sceneHeading}>{c.heading}</h2>
        <div className={styles.treasuresGrid}>
          {items.map((item, i) => {
            const visible = i < visibleCount;
            const cls = [styles.treasureCard, visible && isEntered ? styles.treasureVisible : ""].filter(Boolean).join(" ");
            return (
              <div key={i} className={cls} style={reducedMotion ? { opacity: visible ? 1 : 0 } : { transitionDelay: `${i * 0.2}s` }}>
                <span className={styles.treasureChar}>{item.char}</span>
                <span className={styles.treasureName}>{item.name}</span>
                <p className={styles.treasureDesc}>{item.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderScene3 = (c: any, beatNum: number) => {
    return (
      <div className={styles.scene3}>
        <span className={styles.sceneLabel}>{c.label}</span>
        <h2 className={styles.sceneHeading}>{c.heading}</h2>
        <div className={styles.mountainScene}>
          <InkMountainSVG className={styles.mountainLarge} />
          <div className={styles.mistOverlay} />
          {beatNum >= 1 && (
            <div className={styles.poemBox}>
              <p className={styles.poemText}>{c.poem}</p>
              <p className={styles.poemEn}>{c.poemEn}</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderScene4 = (c: any, beatNum: number, forceEntered: boolean) => {
    const masters = c.masters as Array<{ name: string; era: string; work: string }>;
    const visibleCount = beatNum === 0 ? 0 : beatNum === 1 ? 2 : 3;
    const isEntered = forceEntered || entered;
    return (
      <div className={styles.scene4}>
        <span className={styles.sceneLabel}>{c.label}</span>
        <h2 className={styles.sceneHeading}>{c.heading}</h2>
        <BambooSVG className={styles.bambooLeft} />
        <div className={styles.mastersList}>
          {masters.map((m, i) => {
            const visible = i < visibleCount;
            const cls = [styles.masterRow, visible && isEntered ? styles.masterVisible : ""].filter(Boolean).join(" ");
            return (
              <div key={i} className={cls} style={reducedMotion ? { opacity: visible ? 1 : 0 } : { transitionDelay: `${i * 0.2}s` }}>
                <span className={styles.masterName}>{m.name}</span>
                <span className={styles.masterEra}>{m.era}</span>
                <span className={styles.masterWork}>{m.work}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderScene5 = (c: any) => {
    return (
      <div className={styles.scene5}>
        <div className={styles.blankSpace} />
        <h2 className={styles.closingText}>
          {c.closing}<span className={styles.closingAccent}>{c.accent}</span>
        </h2>
        <p className={styles.closingSub}>{c.sub}</p>
        <div className={styles.sealStamp} aria-hidden="true">印</div>
      </div>
    );
  };

  const renderSceneFor = (sceneNum: number, beatNum: number, forceEntered: boolean) => {
    const c = SCENES[sceneNum as keyof typeof SCENES]?.[language as keyof typeof SCENES[1]];
    if (!c) return null;
    switch (sceneNum) {
      case 1: return renderScene1(c);
      case 2: return renderScene2(c, beatNum, forceEntered);
      case 3: return renderScene3(c, beatNum);
      case 4: return renderScene4(c, beatNum, forceEntered);
      case 5: return renderScene5(c);
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
            {renderSceneFor(outgoingScene, BEAT_COUNTS[outgoingScene] - 1, true)}
          </div>
        </div>
      )}

      {/* Incoming / current scene */}
      <div className={incomingLayerClasses}>
        <div key={`26-${scene}`} className={styles.track}>
          {renderSceneFor(scene, beat, false)}
        </div>
      </div>

      {renderNav()}
    </div>
  );
}

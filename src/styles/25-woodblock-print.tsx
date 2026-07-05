import React, { useLayoutEffect, useEffect, useState, useCallback, useRef } from "react";
import type { BespokeStyleProps, StyleMetadata } from "../types";
import styles from "./25-woodblock-print.module.css";
import { useFLIP } from "../hooks/useFLIP";

// ─── Font Injection ────────────────────────────────────────────────────────

function useFonts() {
  useEffect(() => {
    const id = "style-25-fonts";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@400;700;900&family=Inter:wght@300;400;500;600&display=swap";
    document.head.appendChild(link);
  }, []);
}

// ─── Content ────────────────────────────────────────────────────────────────

const SCENES = {
  1: {
    en: { title: "浮世絵", titleEn: "Ukiyo-e", sub: "Floating World — Art of the Edo Period" },
    zh: { title: "浮世絵", titleEn: "Ukiyo-e", sub: "浮世绘——江户时代的艺术" },
  },
  2: {
    en: {
      label: "Woodblock Process",
      heading: "The artisan's hand",
      steps: [
        { kanji: "絵", label: "Drawing", desc: "Artist sketches the design on washi paper" },
        { kanji: "彫", label: "Carving", desc: "Woodblock carver cuts relief into cherry wood" },
        { kanji: "摺", label: "Printing", desc: "Printer applies pigment and presses hand-made paper" },
      ],
    },
    zh: {
      label: "木刻流程",
      heading: "匠人之手",
      steps: [
        { kanji: "絵", label: "绘画", desc: "画师在和纸上勾勒图案" },
        { kanji: "彫", label: "雕刻", desc: "刻工在樱木上雕刻凸版" },
        { kanji: "摺", label: "印刷", desc: "刷工施色后压印手工纸" },
      ],
    },
  },
  3: {
    en: {
      label: "Great Wave",
      heading: "Thirty-Six Views of Mt. Fuji",
      printTitle: "The Great Wave off Kanagawa",
      artist: "Katsushika Hokusai, 1831",
      stats: [
        { value: "36", label: "Views of Fuji" },
        { value: "1831", label: "Year published" },
        { value: "25cm", label: "Nishiki-e format" },
      ],
    },
    zh: {
      label: "巨浪",
      heading: "富岳三十六景",
      printTitle: "神奈川冲浪里",
      artist: "葛饰北斋, 1831",
      stats: [
        { value: "36", label: "富士景数" },
        { value: "1831", label: "出版年份" },
        { value: "25cm", label: "锦绘尺寸" },
      ],
    },
  },
  4: {
    en: {
      label: "Masters",
      heading: "Three great ukiyo-e artists",
      masters: [
        { name: "Hokusai", years: "1760–1849", work: "Thirty-Six Views of Fuji" },
        { name: "Hiroshige", years: "1797–1858", work: "Fifty-Three Stations of Tokaido" },
        { name: "Utamaro", years: "1753–1806", work: "Ten Studies in Female Physiognomy" },
      ],
    },
    zh: {
      label: "巨匠",
      heading: "浮世绘三大家",
      masters: [
        { name: "北斋", years: "1760–1849", work: "富岳三十六景" },
        { name: "广重", years: "1797–1858", work: "东海道五十三次" },
        { name: "歌麿", years: "1753–1806", work: "妇人相学十体" },
      ],
    },
  },
  5: {
    en: { closing: "The wave", accent: "endures.", sub: "— Edo to the world" },
    zh: { closing: "巨浪", accent: "永恒。", sub: "—— 从江户到世界" },
  },
};

// ─── SVG: Mt. Fuji Silhouette ───────────────────────────────────────────────

function MtFujiSVG({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 200 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Mountain body */}
      <path
        d="M10 110 L60 45 L75 55 L85 35 L100 15 L115 35 L125 55 L140 45 L190 110 Z"
        fill="var(--style-25-ink, #1a3a5c)"
        opacity="0.15"
      />
      {/* Snow cap */}
      <path
        d="M75 55 L85 35 L100 15 L115 35 L125 55 L120 50 L115 42 L108 48 L100 30 L92 48 L85 42 L80 50 Z"
        fill="var(--style-25-bg, #e8dcc8)"
        opacity="0.9"
      />
    </svg>
  );
}

// ─── SVG: Great Wave ────────────────────────────────────────────────────────

function GreatWaveSVG({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 400 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Main wave curve */}
      <path
        d="M20 180 Q60 160 80 140 Q100 110 140 100 Q180 90 220 95 Q260 100 280 120 Q300 140 320 155 Q340 165 380 170"
        stroke="var(--style-25-ink, #1a3a5c)"
        strokeWidth="3"
        fill="none"
      />
      {/* Wave body fill */}
      <path
        d="M20 180 Q60 160 80 140 Q100 110 140 100 Q180 90 220 95 Q260 100 280 120 Q300 140 320 155 Q340 165 380 170 L380 200 L20 200 Z"
        fill="var(--style-25-ink, #1a3a5c)"
        opacity="0.12"
      />
      {/* Inner wave detail */}
      <path
        d="M100 130 Q130 115 160 110 Q190 105 220 108"
        stroke="var(--style-25-ink, #1a3a5c)"
        strokeWidth="1.5"
        fill="none"
        opacity="0.4"
      />
      {/* Foam lines */}
      {[...Array(8)].map((_, i) => (
        <path
          key={i}
          d={`M${60 + i * 35} ${155 - i * 3} q8 -5 16 0`}
          stroke="var(--style-25-ink, #1a3a5c)"
          strokeWidth="1"
          fill="none"
          opacity={0.2 + i * 0.04}
        />
      ))}
      {/* Wave crest curl */}
      <path
        d="M260 110 Q270 95 285 90 Q300 85 310 95 Q315 100 310 108"
        stroke="var(--style-25-ink, #1a3a5c)"
        strokeWidth="2"
        fill="none"
      />
      {/* Fuji in background */}
      <path
        d="M330 130 L345 105 L355 115 L365 100 L375 115 L385 105 L400 130"
        stroke="var(--style-25-ink, #1a3a5c)"
        strokeWidth="1.5"
        fill="none"
        opacity="0.3"
      />
    </svg>
  );
}

// ─── SVG: Wave Pattern (decorative border) ──────────────────────────────────

function WavePatternSVG({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 600 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {[...Array(10)].map((_, i) => (
        <path
          key={i}
          d={`M${i * 60} 20 Q${i * 60 + 15} 5 ${i * 60 + 30} 20 Q${i * 60 + 45} 35 ${i * 60 + 60} 20`}
          stroke="var(--style-25-ink, #1a3a5c)"
          strokeWidth="1.5"
          fill="none"
          opacity="0.25"
        />
      ))}
    </svg>
  );
}

// ─── Metadata ───────────────────────────────────────────────────────────────

export function getMetadata(lang: "en" | "zh"): StyleMetadata {
  const nameMap = { en: "Woodblock Print", zh: "浮世绘" };
  const themeMap = {
    en: "Traditional Japanese Arts — ukiyo-e woodblock aesthetic with indigo on beige, wave motifs, and Mt. Fuji silhouettes",
    zh: "日本传统艺术——浮世绘木刻美学，靛蓝色配米色，波浪纹样与富士山剪影",
  };
  const densityLabelMap = { en: "Graphic", zh: "图形化" };

  const sceneTitles = {
    en: ["Title", "Process", "Great Wave", "Masters", "Closing"],
    zh: ["标题", "工艺流程", "巨浪", "巨匠", "结语"],
  };

  const beatActions = {
    en: {
      1: ["Title and subtitle appear"],
      2: ["Heading appears", "Steps 1-2 reveal", "Step 3 reveals"],
      3: ["Print title appears", "Stats populate", "Wave illustration draws in"],
      4: ["Heading appears", "Masters 1-2 appear", "Master 3 appears"],
      5: ["Closing statement"],
    },
    zh: {
      1: ["标题和副标题呈现"],
      2: ["标题呈现", "第 1-2 步揭示", "第 3 步揭示"],
      3: ["作品标题呈现", "数据填充", "波浪插画绘入"],
      4: ["标题呈现", "第 1-2 位大师呈现", "第 3 位大师呈现"],
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
        const steps = (c.steps as Array<{ label: string }>) || [];
        const visible = Math.min((beatIdx + 1) * 2, 3);
        beatBody = steps.slice(0, visible).map((s) => s.label).join(" / ");
      } else if (id === 3) {
        beatTitle = c.printTitle;
        if (beatIdx === 0) beatBody = c.artist;
        else if (beatIdx >= 1) {
          const stats = (c.stats as Array<{ value: string; label: string }>) || [];
          beatBody = stats.map((s) => `${s.value} ${s.label}`).join(" / ");
        }
      } else if (id === 4) {
        beatTitle = c.heading;
        const masters = (c.masters as Array<{ name: string }>) || [];
        const visible = Math.min((beatIdx + 1) * 2, 3);
        beatBody = masters.slice(0, visible).map((m) => m.name).join(" / ");
      } else if (id === 5) {
        beatTitle = `${c.closing} ${c.accent}`;
        beatBody = c.sub;
      }

      return { id: beatIdx, action: actions[beatIdx], title: beatTitle, body: beatBody };
    });

    return { id, title: sceneTitles[lang][id - 1], beats };
  });

  return {
    id: "25",
    band: "craft-cultural",
    name: nameMap[lang],
    theme: themeMap[lang],
    densityLabel: densityLabelMap[lang],
    heroScene: 3,
    colors: { bg: "#e8dcc8", ink: "#1a3a5c", panel: "#f0e8d8" },
    typography: { header: "Noto Serif JP 700", body: "Inter 400" },
    tags: ["ukiyo-e", "woodblock", "japanese", "indigo", "wave", "fuji", "edo", "traditional", "printmaking"],
    fonts: ["cjk:Noto Serif JP", "Inter"],
    scenes,
  };
}

// ─── Transition constants ─────────────────────────────────────────────────

const TRANSITION_DURATION = 400; // ms — enter 350ms, exit 300ms
const BEAT_COUNTS: Record<number, number> = { 1: 1, 2: 3, 3: 3, 4: 3, 5: 1 };

// ─── Component ──────────────────────────────────────────────────────────────

export default function WoodblockPrint({
  scene, beat, language, isThumbnail, reducedMotion, onNavigate, isTransitionClone,
}: BespokeStyleProps) {
  useFonts();
  const [entered, setEntered] = useState(false);
  const [outgoingScene, setOutgoingScene] = useState<number | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const prevSceneRef = useRef<number>(scene);

  // Detect scene changes and manage transition lifecycle
  useLayoutEffect(() => {
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

  // FLIP for scene 2 steps grid
  const { ref: stepsRef } = useFLIP<HTMLDivElement>({
    watch: [beat],
    duration: 400,
    easing: "cubic-bezier(0.16, 1, 0.3, 1)",
  });

  // FLIP for scene 4 masters list
  const { ref: mastersRef } = useFLIP<HTMLDivElement>({
    watch: [beat],
    duration: 400,
    easing: "cubic-bezier(0.16, 1, 0.3, 1)",
  });

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
        <MtFujiSVG className={styles.fujiBg} />
        <WavePatternSVG className={styles.waveBorder} />
        <div className={styles.scene1Content}>
          <h1 className={styles.titleKanji}>{c.title}</h1>
          <p className={styles.titleEn}>{c.titleEn}</p>
          <div className={styles.titleDivider} />
          <p className={styles.titleSub}>{c.sub}</p>
        </div>
      </div>
    );
  };

  const renderScene2 = (c: any, beatNum: number, forceEntered: boolean) => {
    const steps = c.steps as Array<{ kanji: string; label: string; desc: string }>;
    const visibleCount = beatNum === 0 ? 0 : beatNum === 1 ? 2 : 3;
    const isEntered = forceEntered || entered;
    return (
      <div className={styles.scene2}>
        <span className={styles.sceneLabel}>{c.label}</span>
        <h2 className={styles.sceneHeading}>{c.heading}</h2>
        <div ref={stepsRef} className={styles.stepsGrid}>
          {steps.map((step, i) => {
            const visible = i < visibleCount;
            const cls = [styles.stepCard, visible && isEntered ? styles.stepCardVisible : ""].filter(Boolean).join(" ");
            return (
              <div
                key={i}
                className={cls}
                style={reducedMotion ? { opacity: visible ? 1 : 0, transform: "none" } : { transitionDelay: `${i * 0.15}s` }}
              >
                <span className={styles.stepKanji}>{step.kanji}</span>
                <span className={styles.stepLabel}>{step.label}</span>
                <p className={styles.stepDesc}>{step.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderScene3 = (c: any, beatNum: number, forceEntered: boolean) => {
    const stats = c.stats as Array<{ value: string; label: string }>;
    const isEntered = forceEntered || entered;
    return (
      <div className={styles.scene3}>
        <span className={styles.sceneLabel}>{c.label}</span>
        <h2 className={styles.sceneHeading}>{c.heading}</h2>
        <div className={styles.printArea}>
          {beatNum >= 2 && <GreatWaveSVG className={styles.greatWave} />}
          <div className={styles.printInfo}>
            <h3 className={styles.printTitle}>{c.printTitle}</h3>
            <p className={styles.printArtist}>{c.artist}</p>
          </div>
        </div>
        {beatNum >= 1 && (
          <div className={styles.statsRow}>
            {stats.map((s, i) => (
              <div
                key={i}
                className={[styles.statItem, isEntered ? styles.statItemVisible : ""].filter(Boolean).join(" ")}
                style={reducedMotion ? { opacity: 1 } : { transitionDelay: `${i * 0.12}s` }}
              >
                <span className={styles.statValue}>{s.value}</span>
                <span className={styles.statLabel}>{s.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderScene4 = (c: any, beatNum: number, forceEntered: boolean) => {
    const masters = c.masters as Array<{ name: string; years: string; work: string }>;
    const visibleCount = beatNum === 0 ? 0 : beatNum === 1 ? 2 : 3;
    const isEntered = forceEntered || entered;
    return (
      <div className={styles.scene4}>
        <span className={styles.sceneLabel}>{c.label}</span>
        <h2 className={styles.sceneHeading}>{c.heading}</h2>
        <div ref={mastersRef} className={styles.mastersList}>
          {masters.map((m, i) => {
            const visible = i < visibleCount;
            const cls = [styles.masterRow, visible && isEntered ? styles.masterRowVisible : ""].filter(Boolean).join(" ");
            return (
              <div
                key={i}
                className={cls}
                style={reducedMotion ? { opacity: visible ? 1 : 0, transform: "none" } : { transitionDelay: `${i * 0.15}s` }}
              >
                <span className={styles.masterName}>{m.name}</span>
                <span className={styles.masterYears}>{m.years}</span>
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
        <WavePatternSVG className={styles.waveBorderTop} />
        <h2 className={styles.closingText}>
          {c.closing} <span className={styles.closingAccent}>{c.accent}</span>
        </h2>
        <p className={styles.closingSub}>{c.sub}</p>
        <MtFujiSVG className={styles.fujiBottom} />
      </div>
    );
  };

  const renderSceneFor = (sceneNum: number, beatNum: number, forceEntered: boolean) => {
    const c = SCENES[sceneNum as keyof typeof SCENES]?.[language as keyof typeof SCENES[1]];
    if (!c) return null;
    switch (sceneNum) {
      case 1: return renderScene1(c);
      case 2: return renderScene2(c, beatNum, forceEntered);
      case 3: return renderScene3(c, beatNum, forceEntered);
      case 4: return renderScene4(c, beatNum, forceEntered);
      case 5: return renderScene5(c);
      default: return null;
    }
  };

  const renderNav = () => {
    if (isThumbnail) return null;
    const positions = [styles.navPos1, styles.navPos2, styles.navPos3, styles.navPos4, styles.navPos5];
    return (
      <div className={styles.nav} aria-label="Scene navigation">
        {[1, 2, 3, 4, 5].map((s, i) => {
          const isActive = s === scene;
          const itemClasses = [styles.navItem, positions[i], isActive ? styles.navItemActive : ""].filter(Boolean).join(" ");
          return (
            <button
              key={s}
              type="button"
              className={itemClasses}
              aria-label={`Jump to scene ${s}`}
              onClick={(e) => handleNavClick(e, s)}
            >
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <circle cx="12" cy="12" r="5" className={styles.navCircle} />
                <path d="M4 12 Q8 6 12 12 Q16 18 20 12" className={styles.navWave} fill="none" />
              </svg>
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
        <div key={`25-${scene}`} className={styles.track}>
          {renderSceneFor(scene, beat, false)}
        </div>
      </div>

      {renderNav()}
    </div>
  );
}

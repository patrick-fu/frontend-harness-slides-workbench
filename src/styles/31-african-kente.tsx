import React, { useLayoutEffect, useEffect, useState, useCallback, useRef } from "react";
import type { BespokeStyleProps, StyleMetadata } from "../types";
import styles from "./31-african-kente.module.css";
import { useFLIP } from "../hooks/useFLIP";

function useFonts() {
  useEffect(() => {
    const id = "style-31-fonts";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Oswald:wght@400;700&family=Inter:wght@300;400;500;600;700&display=swap";
    document.head.appendChild(link);
  }, []);
}

const SCENES = {
  1: {
    en: { title: "KENTE", sub: "Cloth of Kings — Asante Weaving Tradition" },
    zh: { title: "肯特布", sub: "王者之布——阿散蒂编织传统" },
  },
  2: {
    en: {
      label: "Symbolism",
      heading: "Colors that speak",
      items: [
        { name: "Gold", meaning: "Royalty, wealth, glory", color: "#d4a843" },
        { name: "Green", meaning: "Growth, harvest, renewal", color: "#2d7a3a" },
        { name: "Red", meaning: "Sacrifice, blood, courage", color: "#c0392b" },
        { name: "Black", meaning: "Ancestors, spirit, maturity", color: "#1a1a1a" },
      ],
    },
    zh: {
      label: "象征",
      heading: "会说话的颜色",
      items: [
        { name: "金", meaning: "王权、财富、荣耀", color: "#d4a843" },
        { name: "绿", meaning: "生长、丰收、新生", color: "#2d7a3a" },
        { name: "红", meaning: "牺牲、血脉、勇气", color: "#c0392b" },
        { name: "黑", meaning: "祖先、灵魂、成熟", color: "#1a1a1a" },
      ],
    },
  },
  3: {
    en: {
      label: "Patterns",
      heading: "Weaves with meaning",
      items: [
        { name: "Adwinasa", meaning: "Excellence of craftsmanship" },
        { name: "Nkate Nkwan", meaning: "Path of the spider — wisdom" },
        { name: "Emaa Da", meaning: "Knowledge of the community" },
      ],
    },
    zh: {
      label: "图案",
      heading: "有意义的编织",
      items: [
        { name: "阿德维纳萨", meaning: "工艺之卓越" },
        { name: "恩卡特恩宽", meaning: "蜘蛛之路——智慧" },
        { name: "埃玛达", meaning: "社群之知识" },
      ],
    },
  },
  4: {
    en: {
      label: "Process",
      heading: "From thread to throne",
      items: [
        { num: "01", title: "Spinning", desc: "Cotton thread spun by hand" },
        { num: "02", title: "Dyeing", desc: "Natural indigo and bark dyes" },
        { num: "03", title: "Weaving", desc: "Loom strips, 10cm wide" },
        { num: "04", title: "Assembly", desc: "Strips sewn into full cloth" },
      ],
    },
    zh: {
      label: "工艺",
      heading: "从线到王座",
      items: [
        { num: "01", title: "纺线", desc: "手工纺制棉线" },
        { num: "02", title: "染色", desc: "天然靛蓝与树皮染料" },
        { num: "03", title: "编织", desc: "织机条带，宽 10 厘米" },
        { num: "04", title: "拼接", desc: "条带缝合成整布" },
      ],
    },
  },
  5: {
    en: { closing: "The cloth", accent: "tells the story", sub: "— Woven into every thread" },
    zh: { closing: "布", accent: "讲述故事", sub: "—— 织入每根线中" },
  },
};

const BEAT_COUNTS: Record<number, number> = { 1: 1, 2: 3, 3: 3, 4: 3, 5: 1 };
const TRANSITION_DURATION = 700;

const WEFT_COLORS = ["#d4a843", "#2d7a3a", "#c0392b", "#1a1a1a", "#003DA5", "#d4a843", "#2d7a3a", "#c0392b"];

function KenteStrip({ className }: { className?: string }) {
  const colors = ["#d4a843", "#2d7a3a", "#c0392b", "#1a1a1a", "#d4a843", "#2d7a3a", "#c0392b", "#1a1a1a"];
  return (
    <svg className={className} viewBox="0 0 400 30" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {colors.map((c, i) => (
        <rect key={i} x={i * 50} y="0" width="50" height="30" fill={c} opacity="0.9" />
      ))}
      {[...Array(15)].map((_, i) => (
        <line key={i} x1={i * 27} y1="0" x2={i * 27} y2="30" stroke="#1a1a1a" strokeWidth="0.5" opacity="0.3" />
      ))}
    </svg>
  );
}

function WeftBars({ phase }: { phase: "enter" | "fade" }) {
  const barPositions = [8, 20, 33, 46, 58, 71, 84, 94];
  return (
    <div className={`${styles.weftOverlay} ${phase === "fade" ? styles.weftOverlayFade : ""}`} aria-hidden="true">
      {barPositions.map((top, i) => {
        const fromLeft = i % 2 === 0;
        const color = WEFT_COLORS[i % WEFT_COLORS.length];
        const delay = fromLeft ? i * 50 : i * 50 + 25;
        const barClass = [
          styles.weftBar,
          fromLeft ? styles.weftBarLeft : styles.weftBarRight,
          phase === "fade" ? styles.weftBarRetract : "",
        ].filter(Boolean).join(" ");
        return (
          <div
            key={i}
            className={barClass}
            style={{
              top: `${top}%`,
              background: color,
              animationDelay: `${delay}ms`,
            }}
          />
        );
      })}
    </div>
  );
}

export function getMetadata(lang: "en" | "zh"): StyleMetadata {
  const nameMap = { en: "African Kente", zh: "肯特布" };
  const themeMap = {
    en: "Asante Kente cloth — vibrant woven stripes, symbolic colors, and West African textile heritage",
    zh: "阿散蒂肯特布——鲜艳编织条纹、象征色彩与西非纺织遗产",
  };
  const densityLabelMap = { en: "Vibrant", zh: "鲜艳" };
  const sceneTitles = { en: ["Title", "Symbolism", "Patterns", "Process", "Closing"], zh: ["标题", "象征", "图案", "工艺", "结语"] };
  const beatActions = {
    en: {
      1: ["Title and pattern appear"],
      2: ["Heading appears", "Colors 1-2 reveal", "Colors 3-4 reveal"],
      3: ["Heading appears", "Patterns 1-2 appear", "Pattern 3 appears"],
      4: ["Heading appears", "Steps 1-2 reveal", "Steps 3-4 reveal"],
      5: ["Closing statement"],
    },
    zh: {
      1: ["标题和图案呈现"],
      2: ["标题呈现", "第 1-2 色揭示", "第 3-4 色揭示"],
      3: ["标题呈现", "第 1-2 图案呈现", "第 3 图案呈现"],
      4: ["标题呈现", "第 1-2 步揭示", "第 3-4 步揭示"],
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
      else if (id === 2) {
        beatTitle = c.heading;
        const items = (c.items as Array<{ name: string }>) || [];
        const visible = Math.min(beatIdx * 2, 4);
        beatBody = items.slice(0, visible).map((x) => x.name).join(" / ");
      } else if (id === 3) {
        beatTitle = c.heading;
        const items = (c.items as Array<{ name: string }>) || [];
        const visible = Math.min(beatIdx * 2, 3);
        beatBody = items.slice(0, visible).map((p) => p.name).join(" / ");
      } else if (id === 4) {
        beatTitle = c.heading;
        const items = (c.items as Array<{ title: string }>) || [];
        const visible = Math.min(beatIdx * 2, 4);
        beatBody = items.slice(0, visible).map((s) => s.title).join(" / ");
      } else if (id === 5) { beatTitle = `${c.closing} ${c.accent}`; beatBody = c.sub; }
      return { id: beatIdx, action: actions[beatIdx], title: beatTitle, body: beatBody };
    });
    return { id, title: sceneTitles[lang][id - 1], beats };
  });
  return {
    id: "31", band: "craft-cultural", name: nameMap[lang], theme: themeMap[lang],
    densityLabel: densityLabelMap[lang], heroScene: 2,
    colors: { bg: "#1a1a1a", ink: "#d4a843", panel: "#2a2a2a" },
    typography: { header: "Oswald 700", body: "Inter 400" },
    tags: ["kente", "african", "weaving", "asante", "textile", "symbolic", "west-africa", "royal", "traditional"],
    fonts: ["Oswald", "Inter"], scenes,
  };
}

export default function AfricanKente({ scene, beat, language, isThumbnail, reducedMotion, onNavigate, isTransitionClone }: BespokeStyleProps) {
  useFonts();

  const [outgoingScene, setOutgoingScene] = useState<number | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [weftPhase, setWeftPhase] = useState<"enter" | "fade" | null>(null);
  const prevSceneRef = useRef<number>(scene);

  useLayoutEffect(() => {
    const prev = prevSceneRef.current;
    if (prev !== scene && !reducedMotion) {
      setOutgoingScene(prev);
      setIsTransitioning(true);
      setWeftPhase("enter");

      const fadeTimer = setTimeout(() => {
        setWeftPhase("fade");
      }, 420);

      const doneTimer = setTimeout(() => {
        setOutgoingScene(null);
        setIsTransitioning(false);
        setWeftPhase(null);
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

  // FLIP for scene 3 pattern list
  const { ref: patternListRef } = useFLIP<HTMLDivElement>({
    watch: [beat],
    duration: 400,
    easing: "cubic-bezier(0.16, 1, 0.3, 1)",
  });

  // FLIP for scene 2 color grid and scene 4 process grid
  const { ref: grid2Ref } = useFLIP<HTMLDivElement>({
    watch: [beat],
    duration: 400,
  });
  const { ref: grid4Ref } = useFLIP<HTMLDivElement>({
    watch: [beat],
    duration: 400,
  });

  const handleNavClick = useCallback((e: React.MouseEvent, targetScene: number) => { e.stopPropagation(); onNavigate?.(targetScene, 0); }, [onNavigate]);
  const rootClasses = [styles.root, reducedMotion ? styles.reducedMotion : "", isThumbnail ? styles.thumbnail : ""].filter(Boolean).join(" ");

  const renderScene1 = () => {
    const c = SCENES[1][language as keyof typeof SCENES[1]];
    return (
      <div className={styles.scene1}>
        <KenteStrip className={styles.stripTop} />
        <div className={styles.scene1Content}>
          <h1 className={styles.titleText}>{c.title}</h1>
          <div className={styles.titleDivider}>
            <span className={styles.dGold} /><span className={styles.dGreen} /><span className={styles.dRed} />
          </div>
          <p className={styles.titleSub}>{c.sub}</p>
        </div>
        <KenteStrip className={styles.stripBottom} />
      </div>
    );
  };

  const renderScene2 = (currentBeat: number) => {
    const c = SCENES[2][language as keyof typeof SCENES[2]];
    const items = c.items as Array<{ name: string; meaning: string; color: string }>;
    const visibleCount = currentBeat === 0 ? 0 : currentBeat === 1 ? 2 : 4;
    return (
      <div className={styles.scene2}>
        <span className={styles.sceneLabel}>{c.label}</span>
        <h2 className={styles.sceneHeading}>{c.heading}</h2>
        <div ref={grid2Ref} className={styles.grid4}>
          {items.map((item, i) => {
            const visible = i < visibleCount;
            const cls = [styles.card, visible && entered ? styles.cardVisible : ""].filter(Boolean).join(" ");
            return (
              <div key={i} className={cls} style={reducedMotion ? { opacity: visible ? 1 : 0 } : { transitionDelay: `${i * 0.15}s` }}>
                <div className={styles.swatch} style={{ background: item.color }} />
                <span className={styles.cardName}>{item.name}</span>
                <p className={styles.cardDesc}>{item.meaning}</p>
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
    const visibleCount = currentBeat === 0 ? 0 : currentBeat === 1 ? 2 : 3;
    return (
      <div className={styles.scene3}>
        <span className={styles.sceneLabel}>{c.label}</span>
        <h2 className={styles.sceneHeading}>{c.heading}</h2>
        <div ref={patternListRef} className={styles.list}>
          {items.map((item, i) => {
            const visible = i < visibleCount;
            const cls = [styles.listRow, visible && entered ? styles.listVisible : ""].filter(Boolean).join(" ");
            return (
              <div key={i} className={cls} style={reducedMotion ? { opacity: visible ? 1 : 0 } : { transitionDelay: `${i * 0.2}s` }}>
                <KenteStrip className={styles.stripMini} />
                <span className={styles.listName}>{item.name}</span>
                <span className={styles.listMeaning}>{item.meaning}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderScene4 = (currentBeat: number) => {
    const c = SCENES[4][language as keyof typeof SCENES[4]];
    const items = c.items as Array<{ num: string; title: string; desc: string }>;
    const visibleCount = currentBeat === 0 ? 0 : currentBeat === 1 ? 2 : 4;
    return (
      <div className={styles.scene4}>
        <span className={styles.sceneLabel}>{c.label}</span>
        <h2 className={styles.sceneHeading}>{c.heading}</h2>
        <div ref={grid4Ref} className={styles.grid4}>
          {items.map((item, i) => {
            const visible = i < visibleCount;
            const cls = [styles.stepCard, visible && entered ? styles.cardVisible : ""].filter(Boolean).join(" ");
            return (
              <div key={i} className={cls} style={reducedMotion ? { opacity: visible ? 1 : 0 } : { transitionDelay: `${i * 0.15}s` }}>
                <span className={styles.stepNum}>{item.num}</span>
                <span className={styles.stepTitle}>{item.title}</span>
                <p className={styles.stepDesc}>{item.desc}</p>
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
        <KenteStrip className={styles.stripCenter} />
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

      {/* Weft bars overlay during transition */}
      {weftPhase && <WeftBars phase={weftPhase} />}

      {renderNav()}
    </div>
  );
}

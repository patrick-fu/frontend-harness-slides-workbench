import React, { useEffect, useState, useCallback, useRef } from "react";
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
    link.href = "https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap";
    document.head.appendChild(link);
  }, []);
}

const SCENES = {
  1: {
    en: { title: "RALLY", sub: "A Call to Action — Movement Building for 2026" },
    zh: { title: "集结", sub: "行动号召——2026 年运动建设" },
  },
  2: {
    en: {
      label: "Demands",
      heading: "What we stand for",
      items: [
        { name: "Access", meaning: "Open to all, barriers removed", color: "#d42a2a" },
        { name: "Justice", meaning: "Fair process, clear rules", color: "#111111" },
        { name: "Velocity", meaning: "Move fast, ship faster", color: "#d42a2a" },
        { name: "Solidarity", meaning: "No one left behind", color: "#111111" },
      ],
    },
    zh: {
      label: "主张",
      heading: "我们的立场",
      items: [
        { name: "开放", meaning: "面向所有人，移除障碍", color: "#d42a2a" },
        { name: "公正", meaning: "公平流程，清晰规则", color: "#111111" },
        { name: "速度", meaning: "快速行动，更快交付", color: "#d42a2a" },
        { name: "团结", meaning: "不让任何人掉队", color: "#111111" },
      ],
    },
  },
  3: {
    en: {
      label: "Voices",
      heading: "Who is with us",
      items: [
        { name: "Builders", meaning: "4,200+ active contributors" },
        { name: "Organizations", meaning: "180+ groups aligned" },
        { name: "Cities", meaning: "34 countries represented" },
      ],
    },
    zh: {
      label: "声音",
      heading: "谁与我们同行",
      items: [
        { name: "建设者", meaning: "4200+ 活跃贡献者" },
        { name: "组织", meaning: "180+ 团体结盟" },
        { name: "城市", meaning: "覆盖 34 个国家" },
      ],
    },
  },
  4: {
    en: {
      label: "Momentum",
      heading: "The timeline of action",
      items: [
        { num: "01", title: "Signal", desc: "First call goes out" },
        { num: "02", title: "Gather", desc: "Coalition forms" },
        { num: "03", title: "Mobilize", desc: "Resources deployed" },
        { num: "04", title: "Deliver", desc: "Results made public" },
      ],
    },
    zh: {
      label: "势头",
      heading: "行动时间表",
      items: [
        { num: "01", title: "信号", desc: "发出第一声号召" },
        { num: "02", title: "集结", desc: "联盟形成" },
        { num: "03", title: "动员", desc: "资源部署" },
        { num: "04", title: "交付", desc: "成果公开" },
      ],
    },
  },
  5: {
    en: { closing: "Rise", accent: "together", sub: "— The movement starts now" },
    zh: { closing: "共同", accent: "崛起", sub: "—— 运动从现在开始" },
  },
};

const BEAT_COUNTS: Record<number, number> = { 1: 1, 2: 3, 3: 3, 4: 3, 5: 1 };
const TRANSITION_DURATION = 500;

const WEDGE_COLORS = ["#d42a2a", "#111111", "#d42a2a", "#111111", "#f0e8d8", "#d42a2a", "#111111", "#d42a2a"];

function RedWedgeSVG({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {/* Main red wedge driving diagonally */}
      <polygon points="0,280 400,20 400,80 60,300" fill="#d42a2a" opacity="0.9" />
      {/* Black counter-wedge */}
      <polygon points="0,200 350,0 400,0 400,40 50,240" fill="#111111" opacity="0.15" />
      {/* Fragment rectangles suggesting photomontage */}
      <rect x="280" y="180" width="80" height="60" fill="#111111" opacity="0.7" transform="rotate(-15 320 210)" />
      <rect x="60" y="60" width="50" height="70" fill="#d42a2a" opacity="0.5" transform="rotate(10 85 95)" />
      <line x1="0" y1="150" x2="400" y2="50" stroke="#111111" strokeWidth="3" opacity="0.3" />
    </svg>
  );
}

function WedgeBars({ phase }: { phase: "enter" | "fade" }) {
  const barPositions = [10, 22, 35, 48, 60, 72, 84, 92];
  return (
    <div className={`${styles.weftOverlay} ${phase === "fade" ? styles.weftOverlayFade : ""}`} aria-hidden="true">
      {barPositions.map((top, i) => {
        const fromLeft = i % 2 === 0;
        const color = WEDGE_COLORS[i % WEDGE_COLORS.length];
        const delay = fromLeft ? i * 40 : i * 40 + 20;
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
              transform: `rotate(${-3 + (i % 3)}deg)`,
            }}
          />
        );
      })}
    </div>
  );
}

export function getMetadata(lang: "en" | "zh"): StyleMetadata {
  const nameMap = { en: "Red-Wedge Agitprop", zh: "红楔宣传画" };
  const themeMap = {
    en: "Political poster at dawn — red wedge driving into black, type as structural beams, diagonal thrust. Best for launches, calls to action, movement-building, and content that needs to galvanize rather than persuade.",
    zh: "黎明时分的政治海报——红楔切入黑暗、字体即结构梁、对角线冲击力。最适合发布、行动号召、运动建设，以及需要激励而非说服的内容。",
  };
  const densityLabelMap = { en: "Urgent", zh: "紧迫" };
  const sceneTitles = { en: ["Title", "Demands", "Voices", "Momentum", "Closing"], zh: ["标题", "主张", "声音", "势头", "结语"] };
  const beatActions = {
    en: {
      1: ["Title and wedge appear"],
      2: ["Heading appears", "Demands 1-2 slam in", "Demands 3-4 slam in"],
      3: ["Heading appears", "Voices 1-2 assemble", "Voice 3 joins"],
      4: ["Heading appears", "Steps 1-2 lock in", "Steps 3-4 lock in"],
      5: ["Closing manifesto"],
    },
    zh: {
      1: ["标题和红楔呈现"],
      2: ["标题呈现", "第 1-2 主张砸入", "第 3-4 主张砸入"],
      3: ["标题呈现", "第 1-2 声音集结", "第 3 声音加入"],
      4: ["标题呈现", "第 1-2 步锁定", "第 3-4 步锁定"],
      5: ["结语宣言"],
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
    colors: { bg: "#f0e8d8", ink: "#111111", panel: "#e8dfc8" },
    typography: { header: "Oswald 700", body: "Inter 400" },
    tags: ["agitprop", "red-wedge", "political-poster", "diagonal", "manifesto", "raw-paper", "type-as-structure", "photomontage", "rally", "urgent"],
    fonts: ["Oswald", "Inter"], scenes,
  };
}

export default function AfricanKente({ scene, beat, language, isThumbnail, reducedMotion, onNavigate, isTransitionClone }: BespokeStyleProps) {
  useFonts();

  const transitionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fadeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [transitionInfo, setTransitionInfo] = useState({
    outgoingScene: null as number | null,
    isTransitioning: false,
    weftPhase: null as "enter" | "fade" | null,
    lastScene: scene,
  });

  // Synchronous derivation — sets transition state in the SAME render cycle
  // as the scene prop change.
  if (transitionInfo.lastScene !== scene) {
    if (transitionTimerRef.current) {
      clearTimeout(transitionTimerRef.current);
    }
    if (fadeTimerRef.current) {
      clearTimeout(fadeTimerRef.current);
    }

    if (!reducedMotion) {
      fadeTimerRef.current = setTimeout(() => {
        setTransitionInfo(function(prev) {
          return { ...prev, weftPhase: "fade" };
        });
      }, 300);

      transitionTimerRef.current = setTimeout(() => {
        setTransitionInfo(function(prev) {
          return { outgoingScene: null, isTransitioning: false, weftPhase: null, lastScene: prev.lastScene };
        });
      }, TRANSITION_DURATION);

      setTransitionInfo({
        outgoingScene: transitionInfo.lastScene,
        isTransitioning: true,
        weftPhase: "enter",
        lastScene: scene,
      });
    } else {
      setTransitionInfo({
        outgoingScene: null,
        isTransitioning: false,
        weftPhase: null,
        lastScene: scene,
      });
    }
  }

  var outgoingScene = transitionInfo.outgoingScene;
  var isTransitioning = transitionInfo.isTransitioning;
  var weftPhase = transitionInfo.weftPhase;

  const [entered, setEntered] = useState(false);
  useEffect(() => {
    setEntered(false);
    const id = requestAnimationFrame(() => { requestAnimationFrame(() => setEntered(true)); });
    return () => cancelAnimationFrame(id);
  }, [scene]);

  // FLIP for scene 3 list
  const { ref: patternListRef } = useFLIP<HTMLDivElement>({
    watch: [beat],
    duration: 350,
    easing: "cubic-bezier(0.16, 1, 0.3, 1)",
  });

  // FLIP for scene 2 and scene 4 grids
  const { ref: grid2Ref } = useFLIP<HTMLDivElement>({
    watch: [beat],
    duration: 350,
  });
  const { ref: grid4Ref } = useFLIP<HTMLDivElement>({
    watch: [beat],
    duration: 350,
  });

  const handleNavClick = useCallback((e: React.MouseEvent, targetScene: number) => { e.stopPropagation(); onNavigate?.(targetScene, 0); }, [onNavigate]);
  const rootClasses = [styles.root, reducedMotion ? styles.reducedMotion : "", isThumbnail ? styles.thumbnail : ""].filter(Boolean).join(" ");

  const renderScene1 = () => {
    const c = SCENES[1][language as keyof typeof SCENES[1]];
    return (
      <div className={styles.scene1}>
        <RedWedgeSVG className={styles.stripTop} />
        <div className={styles.scene1Content}>
          <h1 className={styles.titleText}>{c.title}</h1>
          <div className={styles.titleDivider}>
            <span className={styles.dGold} /><span className={styles.dGreen} /><span className={styles.dRed} />
          </div>
          <p className={styles.titleSub}>{c.sub}</p>
        </div>
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
              <div key={i} className={cls} style={reducedMotion ? { opacity: visible ? 1 : 0 } : { transitionDelay: `${i * 0.1}s` }}>
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
              <div key={i} className={cls} style={reducedMotion ? { opacity: visible ? 1 : 0 } : { transitionDelay: `${i * 0.15}s` }}>
                <div className={styles.stripMiniWrap}>
                  <div className={styles.stripMini} />
                </div>
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
              <div key={i} className={cls} style={reducedMotion ? { opacity: visible ? 1 : 0 } : { transitionDelay: `${i * 0.1}s` }}>
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
        <RedWedgeSVG className={styles.stripCenter} />
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

      {/* Wedge bars overlay during transition */}
      {weftPhase && <WedgeBars phase={weftPhase} />}

      {renderNav()}
    </div>
  );
}

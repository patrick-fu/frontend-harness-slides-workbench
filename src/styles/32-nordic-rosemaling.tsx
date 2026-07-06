import React, { useEffect, useState, useCallback } from "react";
import type { BespokeStyleProps, StyleMetadata } from "../types";
import SpatialSceneTrack from "./SpatialSceneTrack";
import styles from "./32-nordic-rosemaling.module.css";

function useFonts() {
  useEffect(() => {
    const id = "style-32-fonts";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&family=Inter:wght@300;400;500;600&display=swap";
    document.head.appendChild(link);
  }, []);
}

const SCENES = {
  1: {
    en: { title: "SCORE", sub: "Multi-Stage Evaluation Funnel — Inputs, Lanes, Results" },
    zh: { title: "评分", sub: "多阶段评估漏斗——输入、通道、结果" },
  },
  2: {
    en: {
      label: "Inputs",
      heading: "Candidates entering the funnel",
      items: [
        { name: "Alpha", desc: "High signal, low noise", color: "#4ade80" },
        { name: "Beta", desc: "Medium signal, steady", color: "#60a5fa" },
        { name: "Gamma", desc: "Variable, needs review", color: "#fbbf24" },
        { name: "Delta", desc: "Low signal, high noise", color: "#f472b6" },
      ],
    },
    zh: {
      label: "输入",
      heading: "进入漏斗的候选",
      items: [
        { name: "阿尔法", desc: "高信号，低噪声", color: "#4ade80" },
        { name: "贝塔", desc: "中等信号，稳定", color: "#60a5fa" },
        { name: "伽马", desc: "波动大，需审查", color: "#fbbf24" },
        { name: "德尔塔", desc: "低信号，高噪声", color: "#f472b6" },
      ],
    },
  },
  3: {
    en: {
      label: "Lanes",
      heading: "Filter categories at work",
      items: [
        { name: "Quality", meaning: "Signal-to-noise ratio", color: "#4ade80" },
        { name: "Velocity", meaning: "Response time under load", color: "#60a5fa" },
        { name: "Impact", meaning: "Expected outcome weight", color: "#fbbf24" },
        { name: "Risk", meaning: "Failure probability", color: "#f472b6" },
      ],
    },
    zh: {
      label: "通道",
      heading: "运行中的过滤类别",
      items: [
        { name: "质量", meaning: "信噪比评估", color: "#4ade80" },
        { name: "速度", meaning: "负载下响应时间", color: "#60a5fa" },
        { name: "影响", meaning: "预期结果权重", color: "#fbbf24" },
        { name: "风险", meaning: "失败概率", color: "#f472b6" },
      ],
    },
  },
  4: {
    en: {
      label: "Scores",
      heading: "Weighted results",
      items: [
        { name: "Alpha", score: "94", tier: "S" },
        { name: "Beta", score: "78", tier: "A" },
        { name: "Gamma", score: "61", tier: "B" },
        { name: "Delta", score: "33", tier: "C" },
      ],
    },
    zh: {
      label: "得分",
      heading: "加权结果",
      items: [
        { name: "阿尔法", score: "94", tier: "S" },
        { name: "贝塔", score: "78", tier: "A" },
        { name: "伽马", score: "61", tier: "B" },
        { name: "德尔塔", score: "33", tier: "C" },
      ],
    },
  },
  5: {
    en: { closing: "Top pick", accent: "confirmed", sub: "— Alpha leads with 94 composite score" },
    zh: { closing: "首选", accent: "已确认", sub: "—— 阿尔法以 94 综合分领先" },
  },
};

function FunnelMachineSVG({ className }: { className?: string }) {
  const laneColors = ["#4ade80", "#60a5fa", "#fbbf24", "#f472b6"];
  return (
    <svg className={className} viewBox="0 0 300 200" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {/* Funnel outline */}
      <path d="M20 10 L280 10 L220 100 L80 100 Z" stroke="rgba(226,232,240,0.3)" strokeWidth="2" fill="rgba(226,232,240,0.05)" />
      {/* Lanes inside funnel */}
      {laneColors.map((c, i) => (
        <line key={i} x1={30 + i * 60} y1="10" x2={85 + i * 35} y2="100" stroke={c} strokeWidth="3" opacity="0.6" />
      ))}
      {/* Output slots */}
      {laneColors.map((c, i) => (
        <rect key={`slot-${i}`} x={50 + i * 50} y="120" width="35" height="50" rx="4" stroke={c} strokeWidth="2" fill={`${c}15`} opacity="0.8" />
      ))}
      {/* Pin dots */}
      {[...Array(8)].map((_, i) => (
        <circle key={`pin-${i}`} cx={40 + i * 30} cy={55 + (i % 3) * 12} r="3" fill="rgba(226,232,240,0.4)" />
      ))}
      {/* Score display */}
      <rect x="110" y="175" width="80" height="20" rx="3" fill="rgba(226,232,240,0.1)" stroke="rgba(226,232,240,0.3)" strokeWidth="1" />
      <text x="150" y="189" textAnchor="middle" fill="#4ade80" fontFamily="JetBrains Mono, monospace" fontSize="12" fontWeight="600">SCORE</text>
    </svg>
  );
}

export function getMetadata(lang: "en" | "zh"): StyleMetadata {
  const nameMap = { en: "Mechanical Scoring Funnel", zh: "机械评分漏斗" };
  const themeMap = {
    en: "Colorful pinball machine — dark playfield, saturated coded lanes, scoreboard numbers ticking. Best for categorization, multi-stage filtering, scoring, and prioritization where making the sorting feel active beats a static list.",
    zh: "彩色弹球机——深色赛场、饱和编码通道、记分牌数字跳动。最适合分类、多阶段过滤、评分和优先级排序，让排序过程动起来胜过静态列表。",
  };
  const densityLabelMap = { en: "Playful", zh: "趣味" };
  const sceneTitles = { en: ["Title", "Inputs", "Lanes", "Scores", "Closing"], zh: ["标题", "输入", "通道", "得分", "结语"] };
  const beatActions = {
    en: {
      1: ["Title and machine appear"],
      2: ["Heading appears", "Candidates 1-2 drop in", "Candidates 3-4 drop in"],
      3: ["Heading appears", "Lanes 1-2 activate", "Lanes 3-4 activate"],
      4: ["Heading appears", "Scores 1-2 tick up", "Scores 3-4 tick up"],
      5: ["Top pick confirmed"],
    },
    zh: {
      1: ["标题和机器呈现"],
      2: ["标题呈现", "第 1-2 候选落入", "第 3-4 候选落入"],
      3: ["标题呈现", "第 1-2 通道激活", "第 3-4 通道激活"],
      4: ["标题呈现", "第 1-2 分数跳动", "第 3-4 分数跳动"],
      5: ["首选确认"],
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
    colors: { bg: "#0d1117", ink: "#e2e8f0", panel: "#161b22" },
    typography: { header: "Oswald 700", body: "Inter 400" },
    tags: ["mechanical", "scoring-funnel", "pinball", "playfield", "scoreboard", "monospace", "filtering", "categorization", "arcade", "kinetic"],
    fonts: ["Oswald", "JetBrains Mono", "Inter"], scenes,
  };
}

const BEAT_COUNTS: Record<number, number> = { 1: 1, 2: 3, 3: 3, 4: 3, 5: 1 };

const BEAT_LAYOUT_MODES = {
  2: "motion",
  3: "motion",
  4: "motion",
} satisfies Record<number, "motion" | "reserved">;

export default function NordicRosemaling({ scene, beat, language, isThumbnail, reducedMotion, onNavigate }: BespokeStyleProps) {
  useFonts();

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
        <FunnelMachineSVG className={styles.flowerTL} />
        <div className={styles.scene1Content}>
          <h1 className={styles.titleText}>{c.title}</h1>
          <div className={styles.titleBar} />
          <p className={styles.titleSub}>{c.sub}</p>
        </div>
        <FunnelMachineSVG className={styles.flowerBR} />
      </div>
    );
  };

  const renderScene2 = (currentBeat: number) => {
    const c = SCENES[2][language as keyof typeof SCENES[2]];
    const items = c.items as Array<{ name: string; desc: string; color: string }>;
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
              <div key={i} className={cls} style={reducedMotion ? { opacity: visible ? 1 : 0 } : { transitionDelay: `${i * 0.12}s`, borderColor: item.color }}>
                <div className={styles.cardFlower} style={{ background: item.color, boxShadow: `0 0 2cqh ${item.color}40` }} />
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
    const items = c.items as Array<{ name: string; meaning: string; color: string }>;
    const visibleCount = currentBeat === 0 ? 0 : currentBeat === 1 ? 2 : 4;
    return (
      <div className={styles.scene3}>
        <span className={styles.sceneLabel}>{c.label}</span>
        <h2 className={styles.sceneHeading}>{c.heading}</h2>
        <div className={styles.grid4}>
          {items.map((item, i) => {
            const visible = i < visibleCount;
            const cls = [styles.motifCard, visible && entered ? styles.cardVisible : ""].filter(Boolean).join(" ");
            return (
              <div key={i} className={cls} style={reducedMotion ? { opacity: visible ? 1 : 0 } : { transitionDelay: `${i * 0.12}s`, borderColor: item.color }}>
                <div className={styles.motifIcon} style={{ background: `${item.color}20`, borderColor: item.color, color: item.color }}>
                  <svg viewBox="0 0 24 24" fill="none" width="100%" height="100%">
                    <path d="M12 2 L12 22 M4 12 L20 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                    <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" fill="none" />
                  </svg>
                </div>
                <span className={styles.motifName} style={{ color: item.color }}>{item.name}</span>
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
    const items = c.items as Array<{ name: string; score: string; tier: string }>;
    const visibleCount = currentBeat === 0 ? 0 : currentBeat === 1 ? 2 : 4;
    const tierColors: Record<string, string> = { S: "#4ade80", A: "#60a5fa", B: "#fbbf24", C: "#f472b6" };
    return (
      <div className={styles.scene4}>
        <span className={styles.sceneLabel}>{c.label}</span>
        <h2 className={styles.sceneHeading}>{c.heading}</h2>
        <div className={styles.paletteRow}>
          {items.map((item, i) => {
            const visible = i < visibleCount;
            const cls = [styles.swatchCard, visible && entered ? styles.cardVisible : ""].filter(Boolean).join(" ");
            const tierColor = tierColors[item.tier] || "#e2e8f0";
            return (
              <div key={i} className={cls} style={reducedMotion ? { opacity: visible ? 1 : 0 } : { transitionDelay: `${i * 0.15}s`, borderColor: tierColor }}>
                <div className={styles.swatchCircle} style={{ background: `${tierColor}15`, borderColor: tierColor, color: tierColor, boxShadow: `0 0 3cqh ${tierColor}30` }}>
                  <span className={styles.scoreValue}>{item.score}</span>
                </div>
                <span className={styles.swatchName}>{item.name}</span>
                <span className={styles.swatchHex} style={{ color: tierColor }}>TIER {item.tier}</span>
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
        <FunnelMachineSVG className={styles.flowerCenter} />
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
              <span className={styles.navDot}>{s}</span>
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <div className={rootClasses}>
            <SpatialSceneTrack
        scene={scene}
        beat={beat}
        axis="x"
        reducedMotion={reducedMotion || isThumbnail}
        beatLayoutModes={BEAT_LAYOUT_MODES}
        renderScene={(sceneId, sceneBeat) => (
          <div className={styles.sceneLayer}>
            <div className={styles.track}>
              {renderSceneFor(sceneId, sceneBeat)}
            </div>
          </div>
        )}
      />

      {/* Gear spin overlay during transition */}

      {renderNav()}
    </div>
  );
}

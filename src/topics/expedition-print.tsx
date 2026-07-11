import React, { useLayoutEffect, useEffect, useState, useCallback } from "react";
import {
  defineTopic,
  type TopicMetadata,
  type TopicNavigation,
  type TopicStageProps,
  type TopicTransitionScore,
} from "../domain/topic";
import SpatialSceneTrack from "../styles/SpatialSceneTrack";
import styles from "./expedition-print.module.css";

function useFonts() {
  useEffect(() => {
    const id = "expedition-print-fonts";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap";
    document.head.appendChild(link);
  }, []);
}

const SCENES = {
  1: {
    en: { title: "EXPEDITION", sub: "Public Lands Initiative — Explore, Protect, Restore" },
    zh: { title: "探险", sub: "公共土地倡议——探索、保护、修复" },
  },
  2: {
    en: {
      label: "Landscapes",
      heading: "Three regions to protect",
      pillars: [
        { shape: "circle", color: "#d4692a", title: "Desert", desc: "Arid lands and canyon country" },
        { shape: "square", color: "#2a5a4a", title: "Forest", desc: "Old growth and watershed" },
        { shape: "triangle", color: "#3a6a8a", title: "Coast", desc: "Tidal zones and headlands" },
      ],
    },
    zh: {
      label: "地貌",
      heading: "三个待保护的区域",
      pillars: [
        { shape: "circle", color: "#d4692a", title: "沙漠", desc: "干旱土地与峡谷" },
        { shape: "square", color: "#2a5a4a", title: "森林", desc: "原始林与水源地" },
        { shape: "triangle", color: "#3a6a8a", title: "海岸", desc: "潮间带与海岬" },
      ],
    },
  },
  3: {
    en: {
      label: "Rangers",
      heading: "Voices of the land",
      masters: [
        { name: "Elena Marquez", role: "Field Lead", years: "12 seasons" },
        { name: "Thomas Chen", role: "Botanist", years: "8 seasons" },
        { name: "Sarah Whitfield", role: "Geologist", years: "15 seasons" },
        { name: "Marcus Okafor", role: "Wildlife", years: "6 seasons" },
      ],
    },
    zh: {
      label: "护林员",
      heading: "土地的声音",
      masters: [
        { name: "埃莱娜·马尔克斯", role: "野外领队", years: "12 季" },
        { name: "陈托马斯", role: "植物学家", years: "8 季" },
        { name: "莎拉·惠特菲尔德", role: "地质学家", years: "15 季" },
        { name: "马库斯·奥卡福", role: "野生动物", years: "6 季" },
      ],
    },
  },
  4: {
    en: {
      label: "Impact",
      heading: "What we've protected together",
      stats: [
        { value: "2.4M", label: "Acres preserved" },
        { value: "184", label: "Species recorded" },
        { value: "36K", label: "Volunteer hours" },
      ],
    },
    zh: {
      label: "影响",
      heading: "我们共同保护的成果",
      stats: [
        { value: "240万", label: "英亩受保护" },
        { value: "184", label: "记录物种" },
        { value: "3.6万", label: "志愿小时" },
      ],
    },
  },
  5: {
    en: { closing: "The land", accent: "needs us", sub: "— A public invitation to explore and protect" },
    zh: { closing: "土地", accent: "需要我们", sub: "—— 探索与保护的公共邀请" },
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

function buildMetadata(lang: "en" | "zh"): TopicMetadata {
  const themeMap = {
    en: "WPA poster fresh off the silkscreen — flat warm ink planes, visible grain, a horizon you can feel. Best for product launches with public-good angle, geographic themes, and community initiatives.",
    zh: "刚从丝网印机取下的 WPA 海报——温暖平面墨色、可见油墨颗粒、可感知的地平线。最适合公益角度的产品发布、地理主题和社区倡议。",
  };
  const densityLabelMap = { en: "Civic", zh: "公共" };

  const sceneTitles = {
    en: ["Title", "Landscapes", "Rangers", "Impact", "Closing"],
    zh: ["标题", "地貌", "护林员", "影响", "结语"],
  };

  const beatActions = {
    en: {
      1: ["Title and horizon appear"],
      2: ["Heading appears", "Regions 1-2 reveal", "Region 3 reveals"],
      3: ["Heading appears", "Rangers 1-2 appear", "Rangers 3-4 appear"],
      4: ["Stats populate"],
      5: ["Closing statement"],
    },
    zh: {
      1: ["标题和地平线呈现"],
      2: ["标题呈现", "第 1-2 区域揭示", "第 3 区域揭示"],
      3: ["标题呈现", "第 1-2 位护林员呈现", "第 3-4 位呈现"],
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
    theme: themeMap[lang],
    densityLabel: densityLabelMap[lang],
    heroScene: 2,
    colors: { bg: "#ede0cc", ink: "#2a3a2a", panel: "#e0d4bc" },
    typography: { header: "Oswald 700", body: "Inter 400" },
    tags: ["screenprint", "wpa", "civic", "landscape", "warm-ink", "horizon", "grain", "public-good", "exploratory", "poster"],
    fonts: ["Oswald", "Inter"],
    scenes,
  };
}

const BEAT_LAYOUT_MODES = {
  2: "motion",
  3: "motion",
  4: "motion",
} satisfies Record<number, "motion" | "reserved">;

const TRANSITION_SCORE = {
  "1->2": "wipe",
  "2->3": "wipe",
  "3->4": "wipe",
  "4->5": "wipe",
} as const satisfies TopicTransitionScore;

const NAVIGATION = {
  geometry: "typographic-index",
  carrier: "expedition-print-scene-index",
  invocation: "persistent",
  feedback: "active-glow",
} as const satisfies TopicNavigation;

const metadata = {
  en: buildMetadata("en"),
  zh: buildMetadata("zh"),
};

function TopicStage({
  scene, beat, language, isThumbnail, reducedMotion, onNavigate, }: TopicStageProps) {
  useFonts();
  const [entered, setEntered] = useState(false);

  useLayoutEffect(() => {
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

  const renderScene1 = () => {
    const c = SCENES[1][language as keyof typeof SCENES[1]];
    return (
      <div className={styles.scene1}>
        <div className={styles.shapesArea}>
          <BauhausShape type="circle" color="#d4692a" size={120} className={styles.shapeCircle} />
          <BauhausShape type="square" color="#2a5a4a" size={100} className={styles.shapeSquare} />
          <BauhausShape type="triangle" color="#3a6a8a" size={110} className={styles.shapeTriangle} />
        </div>
        <div className={styles.scene1Content}>
          <h1 className={styles.titleText}>{c.title}</h1>
          <div className={styles.titleBar} />
          <p className={styles.titleSub}>{c.sub}</p>
        </div>
      </div>
    );
  };

  const renderScene2 = (beatNum: number, effectiveEntered: boolean) => {
    const c = SCENES[2][language as keyof typeof SCENES[2]];
    const pillars = c.pillars as Array<{ shape: string; color: string; title: string; desc: string }>;
    const visibleCount = beatNum === 0 ? 0 : beatNum === 1 ? 2 : 3;
    return (
      <div className={styles.scene2}>
        <span className={styles.sceneLabel}>{c.label}</span>
        <h2 className={styles.sceneHeading}>{c.heading}</h2>
        <div className={styles.pillarsRow}>
          {pillars.map((p, i) => {
            const visible = i < visibleCount;
            const cls = [styles.pillarCard, visible && effectiveEntered ? styles.pillarVisible : ""].filter(Boolean).join(" ");
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

  const renderScene3 = (beatNum: number, effectiveEntered: boolean) => {
    const c = SCENES[3][language as keyof typeof SCENES[3]];
    const masters = c.masters as Array<{ name: string; role: string; years: string }>;
    const visibleCount = beatNum === 0 ? 0 : beatNum === 1 ? 2 : 4;
    return (
      <div className={styles.scene3}>
        <span className={styles.sceneLabel}>{c.label}</span>
        <h2 className={styles.sceneHeading}>{c.heading}</h2>
        <div className={styles.mastersGrid}>
          {masters.map((m, i) => {
            const visible = i < visibleCount;
            const cls = [styles.masterCard, visible && effectiveEntered ? styles.masterVisible : ""].filter(Boolean).join(" ");
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

  const renderScene4 = (beatNum: number, _effectiveEntered: boolean) => {
    const c = SCENES[4][language as keyof typeof SCENES[4]];
    const stats = c.stats as Array<{ value: string; label: string }>;
    return (
      <div className={styles.scene4}>
        <span className={styles.sceneLabel}>{c.label}</span>
        <h2 className={styles.sceneHeading}>{c.heading}</h2>
        {beatNum >= 1 && (
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
          <BauhausShape type="circle" color="#d4692a" size={60} className={styles.compCircle} />
          <BauhausShape type="square" color="#2a5a4a" size={50} className={styles.compSquare} />
          <BauhausShape type="triangle" color="#3a6a8a" size={55} className={styles.compTriangle} />
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
        <BauhausShape type="circle" color="#d4692a" size={30} className={styles.closingDot} />
      </div>
    );
  };

  const renderSceneFor = (sceneNum: number, beatNum: number, isOutgoing: boolean) => {
    const effectiveEntered = isOutgoing ? true : entered;
    switch (sceneNum) {
      case 1: return renderScene1();
      case 2: return renderScene2(beatNum, effectiveEntered);
      case 3: return renderScene3(beatNum, effectiveEntered);
      case 4: return renderScene4(beatNum, effectiveEntered);
      case 5: return renderScene5();
      default: return null;
    }
  };

  const renderNav = () => {
    if (isThumbnail) return null;
    return (
      <div
        className={styles.nav}
        aria-label="Scene navigation"
        data-topic-navigation="true"
        data-navigation-geometry="typographic-index"
        data-navigation-carrier="expedition-print-scene-index"
        data-navigation-invocation="persistent"
        data-navigation-feedback="active-glow"
        onPointerDown={(event) => event.stopPropagation()}
        onClick={(event) => event.stopPropagation()}
        onKeyDown={(event) => event.stopPropagation()}
      >
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
    <div className={rootClasses} data-topic-id="expedition-print">
            <SpatialSceneTrack
        scene={scene}
        beat={beat}
        transitionKind="wipe"
        transitionMap={TRANSITION_SCORE}
        reducedMotion={reducedMotion || isThumbnail}
        beatLayoutModes={BEAT_LAYOUT_MODES}
        renderScene={(sceneId, sceneBeat) => (
          <div className={styles.sceneLayer}>
            <div className={styles.track}>
              {renderSceneFor(sceneId, sceneBeat, false)}
            </div>
          </div>
        )}
      />

      {/* Shape wipe overlay */}

      {renderNav()}
    </div>
  );
}

export default defineTopic({
  id: "expedition-print",
  styleId: "expedition-screenprint",
  title: { en: "Expedition Print", zh: "探险海报" },
  modelId: "Doubao-Seed-Evolving",
  Stage: TopicStage,
  metadata,
  navigation: NAVIGATION,
  transitionScore: TRANSITION_SCORE,
  evidence: {
    kind: "illustrative",
    boundary: {
      en: "Illustrative public-lands campaign: regions, people, counts, and protection outcomes are presentation examples, not external factual claims.",
      zh: "示例公共土地倡议：其中地区、人物、数量和保护成果均为演示内容，并非外部事实主张。",
    },
    display: "envelope",
  },
});

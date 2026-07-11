import React, { useLayoutEffect, useEffect, useState, useCallback } from "react";
import {
  defineTopic,
  type TopicMetadata,
  type TopicNavigation,
  type TopicStageProps,
  type TopicTransitionScore,
} from "../domain/topic";
import SpatialSceneTrack from "../styles/SpatialSceneTrack";
import styles from "./deco-gala.module.css";

function useFonts() {
  useEffect(() => {
    const id = "deco-gala-fonts";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Inter:wght@300;400;500;600&display=swap";
    document.head.appendChild(link);
  }, []);
}

const SCENES = {
  1: {
    en: { title: "FLAGSHIP", titleSub: "LAUNCH", sub: "A New Era of Engineered Excellence — 2026 Collection" },
    zh: { title: "旗舰", titleSub: "发布", sub: "工程卓越的新纪元——2026 系列" },
  },
  2: {
    en: {
      label: "Design Pillars",
      heading: "Geometry of excellence",
      elements: [
        { icon: "◆", name: "Symmetry", desc: "Engineered bilateral balance" },
        { icon: "◈", name: "Radiance", desc: "Stepped geometric frames" },
        { icon: "◇", name: "Structure", desc: "Every line a load-bearing beam" },
        { icon: "◊", name: "Finish", desc: "Polished lacquer depth" },
      ],
    },
    zh: {
      label: "设计支柱",
      heading: "卓越的几何",
      elements: [
        { icon: "◆", name: "对称", desc: "工程级双侧平衡" },
        { icon: "◈", name: "辐射", desc: "阶梯式几何框架" },
        { icon: "◇", name: "结构", desc: "每根线条都是承重梁" },
        { icon: "◊", name: "漆面", desc: "抛光深邃质感" },
      ],
    },
  },
  3: {
    en: {
      label: "Collection",
      heading: "Flagship products",
      buildings: [
        { name: "Aurora Series", year: "2026", city: "Premiere", height: "Gen 3" },
        { name: "Meridian Line", year: "2026", city: "Flagship", height: "Gen 2" },
        { name: "Zenith Pro", year: "2026", city: "Signature", height: "Gen 1" },
      ],
    },
    zh: {
      label: "产品系列",
      heading: "旗舰产品",
      buildings: [
        { name: "极光系列", year: "2026", city: "首发", height: "第三代" },
        { name: "子午线", year: "2026", city: "旗舰", height: "第二代" },
        { name: "天顶 Pro", year: "2026", city: "签名", height: "第一代" },
      ],
    },
  },
  4: {
    en: {
      label: "Materials",
      heading: "Crafted to endure",
      materials: [
        { name: "Brushed Aluminum", use: "Chassis & frame" },
        { name: "Obsidian Glass", use: "Display surface" },
        { name: "Brass Inlay", use: "Accent detailing" },
        { name: "Ceramic Composite", use: "Heat dissipation" },
      ],
    },
    zh: {
      label: "材料",
      heading: "经久之选",
      materials: [
        { name: "拉丝铝", use: "机身与框架" },
        { name: "曜石玻璃", use: "显示表面" },
        { name: "黄铜镶嵌", use: "点缀装饰" },
        { name: "陶瓷复合", use: "散热系统" },
      ],
    },
  },
  5: {
    en: { closing: "Built for", accent: "the ages", sub: "— Engineered elegance, timeless performance" },
    zh: { closing: "为时代", accent: "而生", sub: "—— 工程之优雅，永恒之性能" },
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

function buildMetadata(lang: "en" | "zh"): TopicMetadata {
  const themeMap = {
    en: "Ocean liner dining saloon — engineered symmetry, lacquered depth, metallic precision. Best for flagship product launches, brand manifestos, award ceremonies, and moments demanding ceremony and scale.",
    zh: "远洋邮轮餐厅——工程对称、漆面深邃、金属精密。最适合旗舰产品发布、品牌宣言、颁奖典礼，以及需要仪式感与宏大尺度的时刻。",
  };
  const densityLabelMap = { en: "Monumental", zh: "纪念性" };

  const sceneTitles = {
    en: ["Title", "Design Pillars", "Collection", "Materials", "Closing"],
    zh: ["标题", "设计支柱", "产品系列", "材料", "结语"],
  };

  const beatActions = {
    en: {
      1: ["Title and subtitle appear"],
      2: ["Heading appears", "Pillars 1-2 reveal", "Pillars 3-4 reveal"],
      3: ["Heading appears", "Products 1-2 appear", "Product 3 appears"],
      4: ["Heading appears", "Materials 1-2 reveal", "Materials 3-4 reveal"],
      5: ["Closing statement"],
    },
    zh: {
      1: ["标题和副标题呈现"],
      2: ["标题呈现", "第 1-2 支柱揭示", "第 3-4 支柱揭示"],
      3: ["标题呈现", "第 1-2 产品呈现", "第 3 产品呈现"],
      4: ["标题呈现", "第 1-2 材料揭示", "第 3-4 材料揭示"],
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
    theme: themeMap[lang],
    densityLabel: densityLabelMap[lang],
    heroScene: 3,
    colors: { bg: "#0a1628", ink: "#d4a843", panel: "#122040" },
    typography: { header: "Oswald 700", body: "Inter 400" },
    tags: ["machine-age", "deco", "geometric", "lacquer", "gold", "symmetrical", "monumental", "ocean-liner", "ceremonial", "flagship"],
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
  carrier: "deco-gala-diamond-index",
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

  const renderScene2 = (beatNum: number, effectiveEntered: boolean) => {
    const c = SCENES[2][language as keyof typeof SCENES[2]];
    const elements = c.elements as Array<{ icon: string; name: string; desc: string }>;
    const visibleCount = beatNum === 0 ? 0 : beatNum === 1 ? 2 : 4;
    return (
      <div className={styles.scene2}>
        <span className={styles.sceneLabel}>{c.label}</span>
        <h2 className={styles.sceneHeading}>{c.heading}</h2>
        <div className={styles.decoGrid}>
          {elements.map((el, i) => {
            const visible = i < visibleCount;
            const cls = [styles.decoCard, visible && effectiveEntered ? styles.decoCardVisible : ""].filter(Boolean).join(" ");
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

  const renderScene3 = (beatNum: number, effectiveEntered: boolean) => {
    const c = SCENES[3][language as keyof typeof SCENES[3]];
    const buildings = c.buildings as Array<{ name: string; year: string; city: string; height: string }>;
    const visibleCount = beatNum === 0 ? 0 : beatNum === 1 ? 2 : 3;
    return (
      <div className={styles.scene3}>
        <span className={styles.sceneLabel}>{c.label}</span>
        <h2 className={styles.sceneHeading}>{c.heading}</h2>
        <div className={styles.buildingList}>
          {buildings.map((b, i) => {
            const visible = i < visibleCount;
            const cls = [styles.buildingRow, visible && effectiveEntered ? styles.buildingVisible : ""].filter(Boolean).join(" ");
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

  const renderScene4 = (beatNum: number, effectiveEntered: boolean) => {
    const c = SCENES[4][language as keyof typeof SCENES[4]];
    const materials = c.materials as Array<{ name: string; use: string }>;
    const visibleCount = beatNum === 0 ? 0 : beatNum === 1 ? 2 : 4;
    return (
      <div className={styles.scene4}>
        <span className={styles.sceneLabel}>{c.label}</span>
        <h2 className={styles.sceneHeading}>{c.heading}</h2>
        <div className={styles.materialGrid}>
          {materials.map((m, i) => {
            const visible = i < visibleCount;
            const cls = [styles.materialCard, visible && effectiveEntered ? styles.materialVisible : ""].filter(Boolean).join(" ");
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
        data-navigation-carrier="deco-gala-diamond-index"
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
              <span className={styles.navDiamond}>◆</span>
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <div className={rootClasses} data-topic-id="deco-gala">
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

      {renderNav()}
    </div>
  );
}

export default defineTopic({
  id: "deco-gala",
  styleId: "machine-age-deco",
  title: { en: "Deco Gala", zh: "装饰仪式" },
  modelId: "Doubao-Seed-Evolving",
  Stage: TopicStage,
  metadata,
  navigation: NAVIGATION,
  transitionScore: TRANSITION_SCORE,
  evidence: {
    kind: "illustrative",
    boundary: {
      en: "Illustrative product collection: product names, generations, materials use, and performance framing are presentation examples, not external factual claims.",
      zh: "示例产品系列：其中产品名称、代际、材料用途和性能表述均为演示内容，并非外部事实主张。",
    },
    display: "envelope",
  },
});

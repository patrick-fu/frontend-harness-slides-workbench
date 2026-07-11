import React, { useEffect, useState, useCallback } from "react";
import type { Source } from "../domain/evidence";
import {
  defineTopic,
  type TopicMetadata,
  type TopicStageProps,
  type TopicTransitionScore,
} from "../domain/topic";
import SpatialSceneTrack from "../styles/SpatialSceneTrack";
import styles from "./specimen-plate.module.css";

function useFonts() {
  useEffect(() => {
    const id = "style-26-fonts";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Noto+Serif+SC:wght@400;600;700&family=Inter:wght@300;400;500&display=swap";
    document.head.appendChild(link);
  }, []);
}

const SCENES = {
  1: {
    en: { title: "Specimen", titleEn: "Plate", sub: "Herbarium Sheet — Botanical Observation Under Glass" },
    zh: { title: "标本", titleEn: "板", sub: "植物标本室——玻璃下的植物观察" },
  },
  2: {
    en: {
      label: "Anatomy",
      heading: "Parts of the specimen",
      items: [
        { char: "R", name: "Radix", desc: "Root system — anchorage and nutrient uptake" },
        { char: "S", name: "Caulis", desc: "Stem — vascular transport and support" },
        { char: "L", name: "Folium", desc: "Leaf — photosynthesis and transpiration" },
        { char: "F", name: "Flos", desc: "Flower — reproductive structure" },
      ],
    },
    zh: {
      label: "解剖",
      heading: "标本的结构",
      items: [
        { char: "根", name: "Radix", desc: "根系——固定与养分吸收" },
        { char: "茎", name: "Caulis", desc: "茎——维管输导与支撑" },
        { char: "叶", name: "Folium", desc: "叶——光合作用与蒸腾" },
        { char: "花", name: "Flos", desc: "花——生殖结构" },
      ],
    },
  },
  3: {
    en: {
      label: "Catalog",
      heading: "Three species from the collection",
      poem: "Quercus robur",
      poemEn: "Pedunculate Oak — collected by J. Banks, 1771",
    },
    zh: {
      label: "目录",
      heading: "馆藏三种",
      poem: "Quercus robur",
      poemEn: "夏栎——J. 班克斯采集，1771",
    },
  },
  4: {
    en: {
      label: "Collectors",
      heading: "Those who recorded nature",
      masters: [
        { name: "Carl Linnaeus", era: "1707–1778", work: "Species Plantarum, 1753" },
        { name: "Joseph Banks", era: "1743–1820", work: "Florilegium, Endeavour voyage" },
        { name: "Maria Sibylla Merian", era: "1647–1717", work: "Metamorphosis insectorum" },
      ],
    },
    zh: {
      label: "采集者",
      heading: "记录自然的人们",
      masters: [
        { name: "卡尔·林奈", era: "1707–1778", work: "《植物种志》，1753" },
        { name: "约瑟夫·班克斯", era: "1743–1820", work: "《植物图谱》，奋进号航行" },
        { name: "玛丽亚·西比拉·梅里安", era: "1647–1717", work: "《昆虫变态》" },
      ],
    },
  },
  5: {
    en: { closing: "Patient", accent: "observation", sub: "— Every vein recorded, every contour traced" },
    zh: { closing: "耐心", accent: "观察", sub: "—— 每道叶脉都被记录，每条轮廓都被描绘" },
  },
};

const SPECIMEN_PLATE_SOURCES = [
  {
    authority: "Biodiversity Heritage Library",
    title: "Caroli Linnaei Species plantarum",
    citation:
      "Biodiversity Heritage Library bibliography 669, Carl von Linné, Species plantarum, 1753.",
    url: "https://www.biodiversitylibrary.org/bibliography/669",
    supports:
      "Supports the Carl Linnaeus (1707–1778) and Species Plantarum (1753) reference in the historical collectors list.",
  },
  {
    authority: "Natural History Museum, London",
    title: "Daniel Solander: a Linnaean disciple on HMS Endeavour",
    citation:
      "Natural History Museum, Daniel Solander: a Linnaean disciple on HMS Endeavour.",
    url: "https://www.nhm.ac.uk/discover/daniel-solander-a-linnaean-disciple-on-hms-endeavour.html",
    supports:
      "Supports the Joseph Banks and Daniel Solander Endeavour collecting context and the later Banks' Florilegium publication history referenced by the collectors scene.",
  },
  {
    authority: "The Metropolitan Museum of Art",
    title: "Study of Capers, Gorse, and a Beetle",
    citation:
      "The Metropolitan Museum of Art collection object 2012.83, Maria Sibylla Merian (1647–1717).",
    url: "https://www.metmuseum.org/art/collection/search/399922",
    supports:
      "Supports the Maria Sibylla Merian (1647–1717) reference and her documented observational studies of plants and insect metamorphosis.",
  },
] as const satisfies readonly Source[];

function BotanicalSpecimenSVG({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 800 400" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {/* Main stem */}
      <path d="M400 380 Q395 280 400 180 Q405 100 398 40" stroke="#3d2b1f" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      {/* Left leaves */}
      <path d="M400 300 Q320 270 280 220 Q260 190 280 170 Q310 180 340 210 Q370 240 400 260" fill="#5a7a4a" opacity="0.7" stroke="#3d2b1f" strokeWidth="1" />
      <path d="M400 220 Q340 200 310 160 Q295 135 310 120 Q335 130 360 155 Q385 180 400 195" fill="#5a7a4a" opacity="0.6" stroke="#3d2b1f" strokeWidth="1" />
      {/* Right leaves */}
      <path d="M400 280 Q480 250 520 200 Q540 170 520 150 Q490 160 460 190 Q430 220 400 240" fill="#5a7a4a" opacity="0.65" stroke="#3d2b1f" strokeWidth="1" />
      <path d="M400 200 Q460 180 490 140 Q505 115 490 100 Q465 110 440 135 Q415 160 400 175" fill="#5a7a4a" opacity="0.55" stroke="#3d2b1f" strokeWidth="1" />
      {/* Flower at top */}
      <ellipse cx="398" cy="38" rx="18" ry="22" fill="#8a6a5a" opacity="0.4" stroke="#3d2b1f" strokeWidth="1.5" />
      <ellipse cx="385" cy="32" rx="10" ry="14" fill="#8a6a5a" opacity="0.35" stroke="#3d2b1f" strokeWidth="1" transform="rotate(-25 385 32)" />
      <ellipse cx="412" cy="32" rx="10" ry="14" fill="#8a6a5a" opacity="0.35" stroke="#3d2b1f" strokeWidth="1" transform="rotate(25 412 32)" />
      {/* Leaf veins */}
      <path d="M340 210 Q370 230 400 260" stroke="#3d2b1f" strokeWidth="0.8" fill="none" opacity="0.5" />
      <path d="M460 190 Q430 215 400 240" stroke="#3d2b1f" strokeWidth="0.8" fill="none" opacity="0.5" />
      {/* Collector label area */}
      <rect x="580" y="320" width="180" height="60" rx="2" fill="none" stroke="#3d2b1f" strokeWidth="1" opacity="0.4" strokeDasharray="4 2" />
    </svg>
  );
}

function SpecimenBorderSVG({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 120 400" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {/* Plate number circle */}
      <circle cx="60" cy="30" r="20" fill="none" stroke="#3d2b1f" strokeWidth="1.5" opacity="0.4" />
      <text x="60" y="35" textAnchor="middle" fontSize="14" fill="#3d2b1f" opacity="0.5" fontFamily="serif">III</text>
      {/* Decorative botanical line */}
      <line x1="60" y1="55" x2="60" y2="380" stroke="#3d2b1f" strokeWidth="1" opacity="0.25" />
      {/* Small leaf motifs */}
      {[80, 160, 240, 320].map((y, i) => (
        <g key={i} transform={`translate(60, ${y})`} opacity="0.3">
          <ellipse cx="0" cy="0" rx="12" ry="6" fill="#5a7a4a" opacity="0.5" transform="rotate(-20)" />
          <ellipse cx="0" cy="0" rx="12" ry="6" fill="#5a7a4a" opacity="0.4" transform="rotate(20)" />
          <line x1="-15" y1="0" x2="15" y2="0" stroke="#3d2b1f" strokeWidth="0.8" />
        </g>
      ))}
    </svg>
  );
}

function buildMetadata(lang: "en" | "zh"): TopicMetadata {
  const themeMap = {
    en: "Pressed herbarium sheet under north light — aged paper, iron-gall ink, muted naturalist palette. Best for taxonomy, classification, species catalogs, and systematic comparison.",
    zh: "北窗下的压制植物标本——陈年纸张、铁胆墨水、柔和自然色。最适合分类学、物种编目和系统比较。",
  };
  const densityLabelMap = { en: "Scholarly", zh: "学术" };

  const sceneTitles = {
    en: ["Title", "Anatomy", "Catalog", "Collectors", "Closing"],
    zh: ["标题", "解剖", "目录", "采集者", "结语"],
  };

  const beatActions = {
    en: {
      1: ["Title and subtitle appear"],
      2: ["Heading appears", "Parts 1-2 reveal", "Parts 3-4 reveal"],
      3: ["Specimen appears", "Species label appears"],
      4: ["Heading appears", "Collectors 1-2 appear", "Collector 3 appears"],
      5: ["Closing statement"],
    },
    zh: {
      1: ["标题和副标题呈现"],
      2: ["标题呈现", "第 1-2 部分揭示", "第 3-4 部分揭示"],
      3: ["标本呈现", "物种标签呈现"],
      4: ["标题呈现", "第 1-2 位采集者呈现", "第 3 位呈现"],
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
    theme: themeMap[lang],
    densityLabel: densityLabelMap[lang],
    heroScene: 3,
    colors: { bg: "#f0e6d2", ink: "#3d2b1f", panel: "#e8dcc4" },
    typography: { header: "Cormorant Garamond 700", body: "Noto Serif SC 400" },
    tags: ["botanical", "specimen", "herbarium", "scientific-illustration", "aged-paper", "sepia", "taxonomy", "naturalist", "plate", "observational"],
    fonts: ["Cormorant Garamond", "Noto Serif SC", "Inter"],
    scenes,
  };
}

const METADATA = {
  en: buildMetadata("en"),
  zh: buildMetadata("zh"),
};

// ─── Transition constants ─────────────────────────────────────────────────

// ─── Component ──────────────────────────────────────────────────────────────

const BEAT_LAYOUT_MODES = {
  2: "motion",
  3: "motion",
  4: "motion",
} satisfies Record<number, "motion" | "reserved">;

const SPECIMEN_PLATE_TRANSITION_SCORE = {
  "1->2": "fade",
  "2->3": "fade",
  "3->4": "fade",
  "4->5": "fade",
} as const satisfies TopicTransitionScore;

function TopicStage({
  scene, beat, language, isThumbnail, reducedMotion, onNavigate, }: TopicStageProps) {
  useFonts();
  const [entered, setEntered] = useState(false);

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
        <BotanicalSpecimenSVG className={styles.mountainBg} />
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
          <BotanicalSpecimenSVG className={styles.mountainLarge} />
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
        <SpecimenBorderSVG className={styles.bambooLeft} />
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
        <div className={styles.sealStamp} aria-hidden="true">Pl. VII</div>
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
      <div
        className={styles.nav}
        aria-label="Scene navigation"
        data-topic-navigation="true"
        data-navigation-geometry="edge-scale"
        data-navigation-carrier="specimen-plate-dot-index"
        data-navigation-invocation="persistent"
        data-navigation-feedback="active-glow"
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
              <span className={styles.navDot} />
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
        transitionKind="fade"
        reducedMotion={reducedMotion || isThumbnail}
        beatLayoutModes={BEAT_LAYOUT_MODES}
        renderScene={(sceneId, sceneBeat, isActive) => (
          <div className={styles.sceneLayer}>
            <div className={styles.track}>
              {renderSceneFor(sceneId, sceneBeat, isActive ? entered : true)}
            </div>
          </div>
        )}
      />

      {renderNav()}
    </div>
  );
}

export default defineTopic({
  id: "specimen-plate",
  styleId: "botanical-specimen-plate",
  title: { en: "Specimen Plate", zh: "标本板" },
  modelId: "Doubao-Seed-Evolving",
  Stage: TopicStage,
  metadata: METADATA,
  navigation: {
    geometry: "edge-scale",
    carrier: "specimen-plate-dot-index",
    invocation: "persistent",
    feedback: "active-glow",
  },
  transitionScore: SPECIMEN_PLATE_TRANSITION_SCORE,
  evidence: {
    kind: "mixed",
    sources: SPECIMEN_PLATE_SOURCES,
    boundary: {
      en: "Botanical forms, labels, and collection scenes are visual teaching material rather than documented specimens or a scientific catalog; the named plate labels are simplified overview cues.",
      zh: "植物形态、标签与采集场景均为视觉教学材料，并非有据可查的标本或科学目录；图版中的命名标签仅为简化概览提示。",
    },
    display: "envelope",
  },
});

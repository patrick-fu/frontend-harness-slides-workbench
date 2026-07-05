import React, { useEffect, useState, useRef, useCallback } from "react";
import type { BespokeStyleProps, StyleMetadata } from "../types";
import styles from "./17-editorial-broadsheet.module.css";

// ─── Content ────────────────────────────────────────────────────────────────

interface SceneContent {
  en: {
    headline?: string;
    deck?: string;
    kicker?: string;
    storyHeadline?: string;
    storyDeck?: string;
    byline?: string;
    body?: string[];
    dataLabel?: string;
    dataTitle?: string;
    stats?: Array<{ number: string; title: string; desc: string }>;
    essayLabel?: string;
    essayTitle?: string;
    captions?: Array<{ label: string; text: string }>;
    editorialLabel?: string;
    editorialHeadline?: string;
    editorialBody?: string;
    editorialSignature?: string;
  };
  zh: {
    headline?: string;
    deck?: string;
    kicker?: string;
    storyHeadline?: string;
    storyDeck?: string;
    byline?: string;
    body?: string[];
    dataLabel?: string;
    dataTitle?: string;
    stats?: Array<{ number: string; title: string; desc: string }>;
    essayLabel?: string;
    essayTitle?: string;
    captions?: Array<{ label: string; text: string }>;
    editorialLabel?: string;
    editorialHeadline?: string;
    editorialBody?: string;
    editorialSignature?: string;
  };
}

const SCENES: Record<number, SceneContent> = {
  1: {
    en: {
      headline: "The Transforming City",
      deck: "How urban landscapes evolve in the 21st century",
    },
    zh: {
      headline: "变迁中的城市",
      deck: "21世纪城市景观如何演变",
    },
  },
  2: {
    en: {
      kicker: "Urban Development",
      storyHeadline: "Cities Reinvent Themselves",
      storyDeck: "A new wave of urban renewal reshapes how we live and work",
      byline: "By the Editorial Board",
      body: [
        "In cities across the globe, a quiet transformation is underway. Old industrial districts give way to mixed-use developments, while historic buildings find new purpose as cultural hubs and creative spaces.",
        "The shift reflects changing priorities: density over sprawl, walkability over automobile dependence, and community character over generic uniformity. Planners increasingly recognize that the most vibrant cities are those that preserve their identity while embracing change.",
        "Technology accelerates this transition. Smart infrastructure, real-time transit data, and adaptive energy systems are becoming standard features of the modern urban fabric. Yet the most successful interventions remain those that prioritize the human scale.",
      ],
    },
    zh: {
      kicker: "城市发展",
      storyHeadline: "城市重塑自我",
      storyDeck: "新一轮城市更新重塑我们的生活和工作方式",
      byline: "编辑部",
      body: [
        "在全球各地的城市中，一场悄然的变革正在进行。旧工业区让位于综合开发项目，历史建筑则找到了作为文化中心和创意空间的新用途。",
        "这一转变反映了不断变化的优先事项：密度优先于扩张，步行性优先于汽车依赖，社区特色优先于千篇一律。规划者越来越认识到，最具活力的城市是那些在拥抱变革的同时保持自身特色的城市。",
        "技术加速了这一转变。智能基础设施、实时交通数据和自适应能源系统正在成为现代城市结构的标准特征。然而，最成功的干预措施仍然是那些优先考虑人类尺度的措施。",
      ],
    },
  },
  3: {
    en: {
      dataLabel: "By the Numbers",
      dataTitle: "The Urban Shift in Data",
      stats: [
        {
          number: "68%",
          title: "Urban Population by 2050",
          desc: "UN projections show nearly 7 of 10 people will live in cities within three decades.",
        },
        {
          number: "2.5B",
          title: "New Urban Dwellers",
          desc: "The number of people moving to cities between now and mid-century, equivalent to building a new city of 1.5 million every week.",
        },
        {
          number: "$57T",
          title: "Infrastructure Investment Needed",
          desc: "Global estimate for urban infrastructure upgrades to accommodate growth sustainably and equitably.",
        },
      ],
    },
    zh: {
      dataLabel: "数据说话",
      dataTitle: "数据中的城市变迁",
      stats: [
        {
          number: "68%",
          title: "到2050年城市人口比例",
          desc: "联合国预测显示，三十年内将有近十分之七的人口居住在城市。",
        },
        {
          number: "25亿",
          title: "新增城市居民",
          desc: "从现在到本世纪中叶，迁往城市的人口数量相当于每周新建一座150万人口的城市。",
        },
        {
          number: "57万亿",
          title: "所需基础设施投资",
          desc: "全球城市基础设施升级估算，以可持续和公平的方式适应增长。",
        },
      ],
    },
  },
  4: {
    en: {
      essayLabel: "Photo Essay",
      essayTitle: "Faces of the Changing City",
      captions: [
        {
          label: "Morning",
          text: "Commuters stream through a newly renovated transit hub, where historic arches meet modern glass.",
        },
        {
          label: "Afternoon",
          text: "A former factory district now hosts galleries, cafes, and co-working spaces that draw a new generation.",
        },
      ],
    },
    zh: {
      essayLabel: "图片故事",
      essayTitle: "城市变迁的面孔",
      captions: [
        {
          label: "清晨",
          text: "通勤者涌入新装修的交通枢纽，历史拱门与现代玻璃交相辉映。",
        },
        {
          label: "午后",
          text: "昔日的工厂区如今拥有画廊、咖啡馆和共享办公空间，吸引着新一代。",
        },
      ],
    },
  },
  5: {
    en: {
      editorialLabel: "Editorial",
      editorialHeadline: "What we lose, what we gain",
      editorialBody:
        "Every city that reinvents itself makes choices. Some neighborhoods are preserved; others are transformed. The question is not whether change happens, but who gets a voice in shaping it.",
      editorialSignature: "— The Editorial Board",
    },
    zh: {
      editorialLabel: "社论",
      editorialHeadline: "我们失去什么，获得什么",
      editorialBody:
        "每一个重塑自我的城市都在做出选择。有些社区被保留，有些被改变。问题不在于变化是否发生，而在于谁在塑造变化的过程中拥有发言权。",
      editorialSignature: "—— 编辑部",
    },
  },
};

// ─── Metadata ───────────────────────────────────────────────────────────────

export function getMetadata(lang: "en" | "zh"): StyleMetadata {
  const nameMap = { en: "Editorial Broadsheet", zh: "编辑大报" };
  const themeMap = {
    en: "The Transforming City — urban evolution told through newspaper typography and data journalism",
    zh: "变迁中的城市——通过报纸排版和数据新闻讲述城市演变",
  };
  const densityLabelMap = { en: "Reading-First", zh: "阅读优先" };

  const sceneTitles = {
    en: ["Front Page", "Lead Story", "Data Sidebar", "Photo Essay", "Editorial"],
    zh: ["头版", "头条报道", "数据侧栏", "图片故事", "社论"],
  };

  const beatActions = {
    en: {
      1: ["Masthead revealed"],
      2: ["Headline and kicker appear", "Body text with drop cap"],
      3: ["Stat 1 appears", "Stat 2 appears", "Stat 3 appears"],
      4: ["Photo 1 with caption", "Photo 2 with caption"],
      5: ["Editorial statement"],
    },
    zh: {
      1: ["报头呈现"],
      2: ["标题和肩题呈现", "正文带首字下沉"],
      3: ["数据一呈现", "数据二呈现", "数据三呈现"],
      4: ["图片一配说明", "图片二配说明"],
      5: ["社论陈述"],
    },
  };

  const BEAT_COUNTS: Record<number, number> = {
    1: 1,
    2: 2,
    3: 3,
    4: 2,
    5: 1,
  };

  const scenes = [1, 2, 3, 4, 5].map((id) => {
    const beatCount = BEAT_COUNTS[id];
    const actions = beatActions[lang][id as keyof (typeof beatActions)["en"]];

    const beats = Array.from({ length: beatCount }, (_, beatIdx) => {
      let beatTitle = "";
      let beatBody = "";

      if (id === 1) {
        beatTitle = SCENES[id][lang].headline || "";
        beatBody = SCENES[id][lang].deck || "";
      } else if (id === 2) {
        beatTitle = SCENES[id][lang].storyHeadline || "";
        beatBody = beatIdx >= 1 ? (SCENES[id][lang].body?.[0] || "") : "";
      } else if (id === 3) {
        const visibleStats = (SCENES[id][lang].stats || []).slice(0, beatIdx + 1);
        beatTitle = SCENES[id][lang].dataTitle || "";
        beatBody = visibleStats.map((s) => `${s.number} ${s.title}`).join(" / ");
      } else if (id === 4) {
        const visibleCaptions = (SCENES[id][lang].captions || []).slice(0, beatIdx + 1);
        beatTitle = SCENES[id][lang].essayTitle || "";
        beatBody = visibleCaptions.map((c) => c.text).join(" / ");
      } else if (id === 5) {
        beatTitle = SCENES[id][lang].editorialHeadline || "";
        beatBody = SCENES[id][lang].editorialBody || "";
      }

      return {
        id: beatIdx,
        action: actions[beatIdx],
        title: beatTitle,
        body: beatBody,
      };
    });

    return {
      id,
      title: sceneTitles[lang][id - 1],
      beats,
    };
  });

  return {
    id: "17",
    band: "editorial-print",
    name: nameMap[lang],
    theme: themeMap[lang],
    densityLabel: densityLabelMap[lang],
    heroScene: 3,
    colors: {
      bg: "#faf8f3",
      ink: "#1a1a1a",
      panel: "#f0ede4",
    },
    typography: {
      header: "Playfair Display 900",
      body: "Source Serif Pro 400",
    },
    tags: [
      "editorial",
      "newspaper",
      "serif",
      "dense",
      "academic",
      "light",
      "journalism",
      "urban",
      "multicolumn",
    ],
    fonts: ["Playfair Display", "Source Serif Pro", "cjk:Noto Serif SC"],
    scenes,
  };
}

// ─── Component ──────────────────────────────────────────────────────────────

export default function EditorialBroadsheet({
  scene,
  beat,
  language,
  isThumbnail,
  reducedMotion,
  onNavigate,
}: BespokeStyleProps) {
  const [entered, setEntered] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setEntered(false);
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setEntered(true);
      });
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

  const handleNavLeft = useCallback(
    (e: React.MouseEvent) => {
      const prev = scene > 1 ? scene - 1 : 5;
      handleNavClick(e, prev);
    },
    [scene, handleNavClick],
  );

  const handleNavRight = useCallback(
    (e: React.MouseEvent) => {
      const next = scene < 5 ? scene + 1 : 1;
      handleNavClick(e, next);
    },
    [scene, handleNavClick],
  );

  const rootClasses = [
    styles.root,
    reducedMotion ? `${styles.reducedMotion} reducedMotion` : "",
  ]
    .filter(Boolean)
    .join(" ");

  // ── Render scene content ────────────────────────────────────────────────

  const renderScene1 = () => {
    const c = SCENES[1][language];
    const headlineClasses = [
      styles.headline,
      language === "zh" ? `${styles.verticalZh} verticalZh` : "",
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div className={styles.masthead}>
        <div className={styles.mastheadTop}>
          <span className={styles.edition}>Vol. XVII</span>
          <span className={styles.dateLine}>
            {language === "zh" ? "2026年7月" : "July 2026"}
          </span>
          <span className={styles.paperName}>
            {language === "zh" ? "城市观察" : "The Urban Observer"}
          </span>
        </div>
        <div className={styles.headlineArea}>
          <div style={{ textAlign: "center" }}>
            <span className={styles.sectionMarker}>
              {language === "zh" ? "特别报道" : "Special Report"}
            </span>
            <h1
              data-testid="style-17-headline"
              className={headlineClasses}
            >
              {c.headline}
            </h1>
            <p className={styles.deck}>{c.deck}</p>
          </div>
        </div>
      </div>
    );
  };

  const renderScene2 = () => {
    const c = SCENES[2][language];
    return (
      <div className={styles.leadStory}>
        <div className={styles.storyHeader}>
          <p className={styles.storyKicker}>{c.kicker}</p>
          <h2 className={styles.storyHeadline}>{c.storyHeadline}</h2>
          <p className={styles.storyDeck}>{c.storyDeck}</p>
        </div>
        <p className={styles.byline}>{c.byline}</p>
        {beat >= 1 && (
          <div className={styles.storyBody}>
            {(c.body || []).map((para, i) => (
              <p
                key={i}
                className={i === 0 ? styles.dropCap : ""}
                style={{
                  opacity: entered ? 1 : 0,
                  transform: entered ? "none" : "translateY(1cqh)",
                  transition: reducedMotion
                    ? "none"
                    : `opacity 0.6s ease ${i * 0.1}s, transform 0.6s ease ${i * 0.1}s`,
                }}
              >
                {para}
              </p>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderScene3 = () => {
    const c = SCENES[3][language];
    const stats = c.stats || [];
    return (
      <div className={styles.dataScene}>
        <div className={styles.dataHeader}>
          <span className={styles.dataHeaderLabel}>{c.dataLabel}</span>
          <h2 className={styles.dataHeaderTitle}>{c.dataTitle}</h2>
        </div>
        <div className={styles.statBlocks}>
          {stats.map((stat, i) => {
            const visible = i <= beat;
            return (
              <div
                key={i}
                className={styles.statBlock}
                style={{
                  opacity: visible && entered ? 1 : 0,
                  transform:
                    visible && entered ? "none" : "translateX(-2cqw)",
                  transition: reducedMotion
                    ? "none"
                    : `opacity 0.5s ease ${i * 0.15}s, transform 0.5s ease ${i * 0.15}s`,
                }}
              >
                <span className={styles.statNumber}>{stat.number}</span>
                <div className={styles.statLabel}>
                  <h3 className={styles.statTitle}>{stat.title}</h3>
                  <p className={styles.statDesc}>{stat.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderScene4 = () => {
    const c = SCENES[4][language];
    const captions = c.captions || [];
    return (
      <div className={styles.photoEssay}>
        <div className={styles.essayHeader}>
          <span className={styles.essayLabel}>{c.essayLabel}</span>
          <h2 className={styles.essayTitle}>{c.essayTitle}</h2>
        </div>
        <div className={styles.photoGrid}>
          {captions.map((cap, i) => {
            const visible = i <= beat;
            return (
              <div
                key={i}
                className={styles.photoPanel}
                style={{
                  opacity: visible && entered ? 1 : 0,
                  transition: reducedMotion
                    ? "none"
                    : `opacity 0.5s ease ${i * 0.2}s`,
                }}
              >
                <div className={styles.photoPlaceholder}>
                  <span className={styles.photoPlaceholderLabel}>
                    {cap.label}
                  </span>
                </div>
                <p className={styles.photoCaption}>
                  <strong>{cap.label}</strong>
                  {cap.text}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderScene5 = () => {
    const c = SCENES[5][language];
    return (
      <div className={styles.editorial}>
        <div className={styles.editorialRule} />
        <span className={styles.editorialLabel}>{c.editorialLabel}</span>
        <h2
          data-testid="style-17-headline"
          className={styles.editorialHeadline}
        >
          {c.editorialHeadline}
        </h2>
        <p className={styles.editorialBody}>{c.editorialBody}</p>
        <span className={styles.editorialSignature}>
          {c.editorialSignature}
        </span>
      </div>
    );
  };

  const renderSceneContent = () => {
    switch (scene) {
      case 1:
        return renderScene1();
      case 2:
        return renderScene2();
      case 3:
        return renderScene3();
      case 4:
        return renderScene4();
      case 5:
        return renderScene5();
      default:
        return null;
    }
  };

  // ── Navigation ──────────────────────────────────────────────────────────

  const renderNav = () => {
    if (isThumbnail) return null;

    return (
      <nav
        data-testid="style-17-nav"
        className={styles.nav}
        aria-label="Scene navigation"
      >
        <div className={styles.navRule} />
        <div className={styles.navButtons}>
          <button
            type="button"
            data-testid="style-17-nav-left"
            className={styles.navBtn}
            onClick={handleNavLeft}
            aria-label="Previous scene"
          >
            {language === "zh" ? "上一页" : "Prev"}
          </button>
          <span className={styles.pageIndicator}>
            {scene} / 5
          </span>
          <button
            type="button"
            data-testid="style-17-nav-right"
            className={styles.navBtn}
            onClick={handleNavRight}
            aria-label="Next scene"
          >
            {language === "zh" ? "下一页" : "Next"}
          </button>
        </div>
      </nav>
    );
  };

  return (
    <div
      data-testid="style-17-root"
      className={rootClasses}
      style={reducedMotion ? { transitionDuration: "0s" } : undefined}
    >
      <div
        ref={trackRef}
        key={`17-${scene}`}
        className={styles.transitionTrack}
        style={{
          transform: `translateY(-${(scene - 1) * 20}%)`,
          ...(reducedMotion ? { transitionDuration: "0s" } : {}),
        }}
      >
        {[1, 2, 3, 4, 5].map((s) => (
          <div key={s} className={styles.scene}>
            {s === scene && renderSceneContent()}
          </div>
        ))}
      </div>
      {renderNav()}
    </div>
  );
}

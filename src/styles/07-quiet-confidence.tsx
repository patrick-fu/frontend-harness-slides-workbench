import React, { useLayoutEffect, useEffect, useCallback, useState, useRef } from "react";
import type { BespokeStyleProps, StyleMetadata } from "../types";
import styles from "./07-quiet-confidence.module.css";

// ─── Transition constants ─────────────────────────────────────────────────

const TRANSITION_DURATION = 800; // ms — breath-pause dissolve total
const BEAT_COUNTS: Record<number, number> = { 1: 1, 2: 2, 3: 2, 4: 2, 5: 1 };

// ─── Font Injection ────────────────────────────────────────────────────────

function useFonts() {
  useEffect(() => {
    const id = "style-07-fonts";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&family=Playfair+Display:ital,wght@0,400;0,500;1,400&display=swap";
    document.head.appendChild(link);
  }, []);
}

// ─── Content ────────────────────────────────────────────────────────────────

interface SceneContent {
  en: {
    eyebrow?: string;
    title?: string;
    titleItalic?: string;
    subtitle?: string;
    meta?: Array<{ label: string; value: string }>;
    chapter?: string;
    thesis?: string;
    thesisItalic?: string;
    thesisNote?: string;
    principlesTitle?: string;
    principlesYear?: string;
    principles?: Array<{ num: string; title: string; desc: string }>;
    dataLabel?: string;
    dataPoints?: Array<{ value: string; sup?: string; label: string }>;
    dataFootnote?: string;
    closingMark?: string;
    closing?: string;
    closingItalic?: string;
    closingSig?: string;
  };
  zh: {
    eyebrow?: string;
    title?: string;
    titleItalic?: string;
    subtitle?: string;
    meta?: Array<{ label: string; value: string }>;
    chapter?: string;
    thesis?: string;
    thesisItalic?: string;
    thesisNote?: string;
    principlesTitle?: string;
    principlesYear?: string;
    principles?: Array<{ num: string; title: string; desc: string }>;
    dataLabel?: string;
    dataPoints?: Array<{ value: string; sup?: string; label: string }>;
    dataFootnote?: string;
    closingMark?: string;
    closing?: string;
    closingItalic?: string;
    closingSig?: string;
  };
}

const SCENES: Record<number, SceneContent> = {
  1: {
    en: {
      eyebrow: "Investment Strategy Report / Q3 2026",
      title: "Quiet",
      titleItalic: "Confidence",
      subtitle:
        "A disciplined approach to capital allocation in uncertain markets — where patience compounds and conviction rewards",
      meta: [
        { label: "Fund", value: "Meridian Capital" },
        { label: "AUM", value: "$4.2B" },
        { label: "Vintage", value: "2026" },
      ],
    },
    zh: {
      eyebrow: "投资策略报告 / 2026 年第三季度",
      title: "沉静的",
      titleItalic: "信心",
      subtitle:
        "在不确定市场中进行资本配置的纪律性方法——耐心产生复利，信念获得回报",
      meta: [
        { label: "基金", value: "Meridian Capital" },
        { label: "管理规模", value: "$42亿" },
        { label: "年份", value: "2026" },
      ],
    },
  },
  2: {
    en: {
      chapter: "Chapter I",
      thesis: "The best returns are born not from noise,",
      thesisItalic: "but from patience.",
      thesisNote:
        "Over a twenty-year study, conviction-weighted positions outperformed benchmark rebalancing by 340 basis points annually.",
    },
    zh: {
      chapter: "第一章",
      thesis: "最好的回报不来自喧嚣，",
      thesisItalic: "而来自耐心。",
      thesisNote:
        "一项为期二十年的研究表明，信念加权的持仓每年比基准再平衡高出 340 个基点。",
    },
  },
  3: {
    en: {
      principlesTitle: "Four Principles of Enduring Capital",
      principlesYear: "Est. 2014",
      principles: [
        {
          num: "I",
          title: "Margin of Safety",
          desc: "We require a minimum 30% discount to intrinsic value before initiating any position. This discipline has protected capital through three market corrections.",
        },
        {
          num: "II",
          title: "Concentration, Not Diversification",
          desc: "Our highest conviction ideas receive meaningful allocation. We would rather own five excellent businesses than twenty adequate ones.",
        },
        {
          num: "III",
          title: "Time as an Ally",
          desc: "We measure holding periods in years, not quarters. Compounding requires time, and turnover destroys more value than it creates.",
        },
        {
          num: "IV",
          title: "Intellectual Honesty",
          desc: "We write down our thesis before we invest. When the facts change, we change our mind — without ego, without delay.",
        },
      ],
    },
    zh: {
      principlesTitle: "持久资本的四项原则",
      principlesYear: "创立于 2014",
      principles: [
        {
          num: "一",
          title: "安全边际",
          desc: "我们要求在内在价值至少 30% 的折扣时才建仓。这一纪律在三次市场调整中保护了资本。",
        },
        {
          num: "二",
          title: "集中，而非分散",
          desc: "我们最有信心的想法获得有意义的配置。我们宁愿拥有五家优秀的企业，也不愿拥有二十家尚可的企业。",
        },
        {
          num: "三",
          title: "时间即盟友",
          desc: "我们以年而非季度衡量持有期。复利需要时间，换手摧毁的价值多于它创造的。",
        },
        {
          num: "四",
          title: "理智诚实",
          desc: "我们在投资前写下论点。当事实改变时，我们改变主意——不带自我，不拖延。",
        },
      ],
    },
  },
  4: {
    en: {
      dataLabel: "Performance Summary",
      dataPoints: [
        { value: "17.3", sup: "%", label: "Annualized Return (10yr)" },
        { value: "1.42", label: "Sharpe Ratio" },
        { value: "0.68", label: "Max Drawdown Recovery" },
      ],
      dataFootnote:
        "Net of fees. Past performance is not indicative of future results.",
    },
    zh: {
      dataLabel: "业绩摘要",
      dataPoints: [
        { value: "17.3", sup: "%", label: "年化收益率（10年）" },
        { value: "1.42", label: "夏普比率" },
        { value: "0.68", label: "最大回撤恢复系数" },
      ],
      dataFootnote: "已扣除费用。过往业绩不代表未来表现。",
    },
  },
  5: {
    en: {
      closingMark: "Meridian Capital Partners",
      closing: "In the end,",
      closingItalic: "character is the only alpha.",
      closingSig: "Investment Strategy Report  ·  Q3 2026  ·  Confidential",
    },
    zh: {
      closingMark: "Meridian Capital Partners",
      closing: "归根结底，",
      closingItalic: "品格是唯一的阿尔法。",
      closingSig: "投资策略报告  ·  2026 年第三季度  ·  机密",
    },
  },
};

// ─── Metadata ───────────────────────────────────────────────────────────────

export function getMetadata(lang: "en" | "zh"): StyleMetadata {
  const nameMap = { en: "Quiet Confidence", zh: "沉静信心" };
  const themeMap = {
    en: "Investment Strategy Thesis — muted earth tones, serif headlines, premium financial report aesthetic",
    zh: "投资策略论点——柔和大地色调、衬线标题、高端财经报告美学",
  };
  const densityLabelMap = { en: "Spacious", zh: "宽松" };

  const sceneTitles = {
    en: ["Cover", "Thesis", "Principles", "Performance", "Closing"],
    zh: ["封面", "论点", "原则", "业绩", "结语"],
  };

  const beatActions = {
    en: {
      1: ["Title and metadata appear"],
      2: ["Thesis statement", "Supporting note fades in"],
      3: ["Principles I-II appear", "Principles III-IV appear"],
      4: ["Data label appears", "Performance metrics populate"],
      5: ["Closing statement revealed"],
    },
    zh: {
      1: ["标题和元数据呈现"],
      2: ["论点陈述", "支撑说明淡入"],
      3: ["原则一至二呈现", "原则三至四呈现"],
      4: ["数据标签呈现", "业绩指标填充"],
      5: ["结语揭示"],
    },
  };

  const BEAT_COUNTS: Record<number, number> = {
    1: 1,
    2: 2,
    3: 2,
    4: 2,
    5: 1,
  };

  const scenes = [1, 2, 3, 4, 5].map((id) => {
    const beatCount = BEAT_COUNTS[id];
    const actions = beatActions[lang][id as keyof (typeof beatActions)["en"]];
    const c = SCENES[id][lang];

    const beats = Array.from({ length: beatCount }, (_, beatIdx) => {
      let beatTitle = "";
      let beatBody = "";

      if (id === 1) {
        beatTitle = `${c.title || ""} ${c.titleItalic || ""}`;
        beatBody = c.subtitle || "";
      } else if (id === 2) {
        beatTitle = `${c.thesis || ""}${c.thesisItalic || ""}`;
        beatBody = beatIdx >= 1 ? c.thesisNote || "" : "";
      } else if (id === 3) {
        beatTitle = c.principlesTitle || "";
        const visible = (c.principles || []).slice(0, Math.min((beatIdx + 1) * 2, 4));
        beatBody = visible.map((p) => p.title).join(" / ");
      } else if (id === 4) {
        beatTitle = c.dataLabel || "";
        if (beatIdx >= 1) {
          beatBody = (c.dataPoints || []).map((d) => `${d.value} ${d.label}`).join(" / ");
        }
      } else if (id === 5) {
        beatTitle = `${c.closing || ""}${c.closingItalic || ""}`;
        beatBody = c.closingSig || "";
      }

      return { id: beatIdx, action: actions[beatIdx], title: beatTitle, body: beatBody };
    });

    return { id, title: sceneTitles[lang][id - 1], beats };
  });

  return {
    id: "07",
    band: "minimal-keynote",
    name: nameMap[lang],
    theme: themeMap[lang],
    densityLabel: densityLabelMap[lang],
    heroScene: 3,
    colors: {
      bg: "#f5f0e8",
      ink: "#3d3529",
      panel: "#ebe5d8",
    },
    typography: {
      header: "Playfair Display 400",
      body: "Inter 300",
    },
    tags: [
      "earthy",
      "cream",
      "serif",
      "premium",
      "financial",
      "spacious",
      "elegant",
      "investment",
      "editorial",
    ],
    fonts: ["Playfair Display", "Inter"],
    scenes,
  };
}

// ─── Component ──────────────────────────────────────────────────────────────

export default function QuietConfidence({
  scene,
  beat,
  language,
  isThumbnail,
  reducedMotion,
  onNavigate,
  isTransitionClone,
}: BespokeStyleProps) {
  useFonts();

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

  const handleNavClick = useCallback(
    (e: React.MouseEvent, targetScene: number) => {
      e.stopPropagation();
      onNavigate?.(targetScene, 0);
    },
    [onNavigate],
  );

  const rootClasses = [
    styles.root,
    reducedMotion ? styles.reducedMotion : "",
    isThumbnail ? styles.thumbnail : "",
  ]
    .filter(Boolean)
    .join(" ");

  // ── Scene renderers (parameterized by beatNum) ──────────────────────────

  const renderScene1 = (_beatNum: number) => {
    const c = SCENES[1][language];
    return (
      <div className={styles.scene1}>
        <span className={styles.qcEyebrow}>{c.eyebrow}</span>
        <h1 className={styles.qcTitle}>
          {c.title} <em>{c.titleItalic}</em>
        </h1>
        <div className={styles.qcTitleRule} />
        <p className={styles.qcSubtitle}>{c.subtitle}</p>
        <div className={styles.qcMeta}>
          {(c.meta || []).map((m, i) => (
            <span key={i}>
              {m.label} &mdash; {m.value}
            </span>
          ))}
        </div>
      </div>
    );
  };

  const renderScene2 = (beatNum: number) => {
    const c = SCENES[2][language];
    return (
      <div className={styles.scene2}>
        <span className={styles.qcChapter}>{c.chapter}</span>
        <h2 className={styles.qcThesis}>
          {c.thesis}
          <em>{c.thesisItalic}</em>
        </h2>
        {beatNum >= 1 && (
          <p className={styles.qcThesisNote}>
            {c.thesisNote}
          </p>
        )}
      </div>
    );
  };

  const renderScene3 = (beatNum: number) => {
    const c = SCENES[3][language];
    const principles = c.principles || [];
    const visibleCount = Math.min((beatNum + 1) * 2, 4);
    return (
      <div className={styles.scene3}>
        <div className={styles.qcPrinciplesHeader}>
          <h2 className={styles.qcPrinciplesTitle}>{c.principlesTitle}</h2>
          <span className={styles.qcPrinciplesYear}>{c.principlesYear}</span>
        </div>
        <div className={styles.hairline} />
        <div className={styles.qcPrinciples}>
          {principles.map((p, i) => {
            const visible = i < visibleCount;
            const pClasses = [
              styles.qcPrinciple,
              visible ? styles.qcPrincipleVisible : "",
            ]
              .filter(Boolean)
              .join(" ");
            return (
              <div
                key={i}
                className={pClasses}
                style={
                  reducedMotion
                    ? { opacity: visible ? 1 : 0, transform: "none" }
                    : { transitionDelay: `${i * 0.12}s` }
                }
              >
                <span className={styles.qcPrincipleNum}>{p.num}</span>
                <div className={styles.qcPrincipleBody}>
                  <h3 className={styles.qcPrincipleTitle}>{p.title}</h3>
                  <p className={styles.qcPrincipleDesc}>{p.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderScene4 = (beatNum: number) => {
    const c = SCENES[4][language];
    const points = c.dataPoints || [];
    return (
      <div className={styles.scene4}>
        <span className={styles.qcDataLabel}>{c.dataLabel}</span>
        <div className={styles.qcDataRow}>
          {points.map((dp, i) => {
            const visible = beatNum >= 1;
            const dpClasses = [
              styles.qcDataPoint,
              visible ? styles.qcDataPointVisible : "",
            ]
              .filter(Boolean)
              .join(" ");
            return (
              <React.Fragment key={i}>
                <div
                  className={dpClasses}
                  style={
                    reducedMotion
                      ? { opacity: visible ? 1 : 0, transform: "none" }
                      : { transitionDelay: `${i * 0.15}s` }
                  }
                >
                  <div className={styles.qcDataValue}>
                    {dp.value}
                    {dp.sup && <sup>{dp.sup}</sup>}
                  </div>
                  <div className={styles.qcDataLabel2}>{dp.label}</div>
                </div>
                {i < points.length - 1 && (
                  <div className={styles.qcDataDivider} aria-hidden="true" />
                )}
              </React.Fragment>
            );
          })}
        </div>
        {beatNum >= 1 && (
          <p className={styles.qcDataFootnote}>
            {c.dataFootnote}
          </p>
        )}
      </div>
    );
  };

  const renderScene5 = (_beatNum: number) => {
    const c = SCENES[5][language];
    return (
      <div className={styles.scene5}>
        <span className={styles.qcClosingMark}>{c.closingMark}</span>
        <h2 className={styles.qcClosing}>
          {c.closing}
          <em>{c.closingItalic}</em>
        </h2>
        <div className={styles.qcClosingRule} />
        <p className={styles.qcClosingSig}>{c.closingSig}</p>
      </div>
    );
  };

  const renderSceneFor = (sceneNum: number, beatNum: number) => {
    switch (sceneNum) {
      case 1:
        return renderScene1(beatNum);
      case 2:
        return renderScene2(beatNum);
      case 3:
        return renderScene3(beatNum);
      case 4:
        return renderScene4(beatNum);
      case 5:
        return renderScene5(beatNum);
      default:
        return null;
    }
  };

  // ── Navigation ──────────────────────────────────────────────────────────

  const renderNav = () => {
    if (isThumbnail) return null;

    return (
      <nav className={styles.sideNav} aria-label="Scene navigation">
        {[1, 2, 3, 4, 5].map((s) => {
          const isActive = s === scene;
          const itemClasses = [
            styles.sideNavItem,
            isActive ? styles.sideNavItemActive : "",
          ]
            .filter(Boolean)
            .join(" ");
          return (
            <button
              key={s}
              type="button"
              className={itemClasses}
              aria-label={`Jump to scene ${s}`}
              onClick={(e) => handleNavClick(e, s)}
            >
              <span className={styles.sideNavTick} aria-hidden="true" />
              <span className={styles.sideNavNum}>{s}</span>
            </button>
          );
        })}
      </nav>
    );
  };

  // ── Build layer classes ─────────────────────────────────────────────────

  const outgoingLayerClasses = [
    styles.sceneLayer,
    styles.exitAnim,
  ].filter(Boolean).join(" ");

  const incomingLayerClasses = [
    styles.sceneLayer,
    isTransitioning && !isTransitionClone ? styles.enterAnim : "",
  ].filter(Boolean).join(" ");

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
        <div
          key={`07-${scene}`}
          className={styles.track}
        >
          {renderSceneFor(scene, beat)}
        </div>
      </div>

      {renderNav()}
    </div>
  );
}

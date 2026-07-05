import React, { useEffect, useCallback, useState, useRef } from "react";
import type { BespokeStyleProps, StyleMetadata } from "../types";
import styles from "./19-financial-times.module.css";
import { useFLIP } from "../hooks/useFLIP";

// ─── Content ────────────────────────────────────────────────────────────────

interface MarketRow {
  name: string;
  value: string;
  change: string;
  up: boolean;
}

interface SceneContent {
  en: {
    headline?: string;
    tagline?: string;
    kicker?: string;
    deck?: string;
    markets?: MarketRow[];
    earningsLabel?: string;
    earningsTitle?: string;
    revenueItems?: Array<{ label: string; value: string; hl?: "up" | "down" }>;
    marginItems?: Array<{ label: string; value: string; hl?: "up" | "down" }>;
    analysisLabel?: string;
    analysisHeadline?: string;
    analysisBody?: string;
    analysisByline?: string;
    closing?: string;
    closingSub?: string;
  };
  zh: {
    headline?: string;
    tagline?: string;
    kicker?: string;
    deck?: string;
    markets?: MarketRow[];
    earningsLabel?: string;
    earningsTitle?: string;
    revenueItems?: Array<{ label: string; value: string; hl?: "up" | "down" }>;
    marginItems?: Array<{ label: string; value: string; hl?: "up" | "down" }>;
    analysisLabel?: string;
    analysisHeadline?: string;
    analysisBody?: string;
    analysisByline?: string;
    closing?: string;
    closingSub?: string;
  };
}

const SCENES: Record<number, SceneContent> = {
  1: {
    en: {
      headline: "Financial Times",
      tagline: "Quarterly Earnings Review — Q2 2026",
    },
    zh: {
      headline: "金融时报",
      tagline: "2026年第二季度财报回顾",
    },
  },
  2: {
    en: {
      kicker: "Markets",
      headline: "Global Indices Mixed as Tech Rally Fades",
      deck: "Investors weigh earnings surprises against inflation concerns amid shifting rate expectations",
      markets: [
        { name: "S&P 500", value: "5,847.21", change: "+0.82%", up: true },
        { name: "NASDAQ", value: "18,392.45", change: "+1.24%", up: true },
        { name: "FTSE 100", value: "8,271.33", change: "−0.31%", up: false },
        { name: "Nikkei 225", value: "39,128.70", change: "−0.56%", up: false },
        { name: "DAX", value: "18,534.12", change: "+0.18%", up: true },
        { name: "Hang Seng", value: "17,842.55", change: "−1.12%", up: false },
      ],
    },
    zh: {
      kicker: "市场",
      headline: "科技股涨势消退 全球指数涨跌互现",
      deck: "投资者在利率预期转变之际权衡财报惊喜与通胀担忧",
      markets: [
        { name: "标普500", value: "5,847.21", change: "+0.82%", up: true },
        { name: "纳斯达克", value: "18,392.45", change: "+1.24%", up: true },
        { name: "富时100", value: "8,271.33", change: "−0.31%", up: false },
        { name: "日经225", value: "39,128.70", change: "−0.56%", up: false },
        { name: "德国DAX", value: "18,534.12", change: "+0.18%", up: true },
        { name: "恒生指数", value: "17,842.55", change: "−1.12%", up: false },
      ],
    },
  },
  3: {
    en: {
      earningsLabel: "Earnings Analysis",
      earningsTitle: "Q2 Results: Margins Expand Despite Revenue Headwinds",
      revenueItems: [
        { label: "Total Revenue", value: "$84.2B" },
        { label: "YoY Growth", value: "+7.3%", hl: "up" },
        { label: "Operating Income", value: "$22.1B" },
        { label: "Operating Margin", value: "26.2%", hl: "up" },
      ],
      marginItems: [
        { label: "Net Income", value: "$18.7B" },
        { label: "EPS", value: "$2.94" },
        { label: "Free Cash Flow", value: "$19.3B", hl: "up" },
        { label: "Guidance (Q3)", value: "$86–89B" },
      ],
    },
    zh: {
      earningsLabel: "盈利分析",
      earningsTitle: "二季度业绩：尽管收入承压 利润率仍在扩大",
      revenueItems: [
        { label: "总营收", value: "$842亿" },
        { label: "同比增长", value: "+7.3%", hl: "up" },
        { label: "营业利润", value: "$221亿" },
        { label: "营业利润率", value: "26.2%", hl: "up" },
      ],
      marginItems: [
        { label: "净利润", value: "$187亿" },
        { label: "每股收益", value: "$2.94" },
        { label: "自由现金流", value: "$193亿", hl: "up" },
        { label: "三季度指引", value: "$860–890亿" },
      ],
    },
  },
  4: {
    en: {
      analysisLabel: "Lex Column",
      analysisHeadline: "The Margin Mirage",
      analysisBody:
        "Beneath the headline numbers lies a more nuanced story. Companies have proven remarkably adept at protecting profitability through cost discipline and pricing power, but the quality of earnings deserves scrutiny. Revenue growth is increasingly driven by price rather than volume, a pattern that historically precedes margin compression when demand softens. Investors should distinguish between operational efficiency and financial engineering.",
      analysisByline: "— FT Lex Team",
    },
    zh: {
      analysisLabel: "Lex专栏",
      analysisHeadline: "利润率的幻象",
      analysisBody:
        "在头条数字之下隐藏着一个更为微妙的故事。企业通过成本管控和定价权在保护盈利能力方面表现得出奇地娴熟，但盈利质量值得审视。收入增长越来越多地由价格而非数量驱动，从历史经验看，当需求走软时，这种模式往往先于利润率压缩。投资者应区分运营效率和财务工程。",
      analysisByline: "—— FT Lex团队",
    },
  },
  5: {
    en: {
      closing: "Markets close.\nAnalysis continues.",
      closingSub: "Financial Times — Markets Edition — Q2 2026",
    },
    zh: {
      closing: "市场已收盘。\n分析仍在继续。",
      closingSub: "金融时报 — 市场版 — 2026年第二季度",
    },
  },
};

// ─── Metadata ───────────────────────────────────────────────────────────────

export function getMetadata(lang: "en" | "zh"): StyleMetadata {
  const nameMap = { en: "Financial Times", zh: "金融时报" };
  const themeMap = {
    en: "Quarterly earnings analysis — salmon-pink paper with financial tables and serif headlines",
    zh: "季度财报分析——鲑鱼粉纸张配财务数据表与衬线标题",
  };
  const densityLabelMap = { en: "Data-Dense", zh: "数据密集" };

  const sceneTitles = {
    en: ["Front Page", "Market Report", "Earnings Data", "Lex Column", "Closing"],
    zh: ["头版", "市场报道", "盈利数据", "Lex专栏", "收盘"],
  };

  const beatActions = {
    en: {
      1: ["Masthead revealed"],
      2: ["Headline and deck", "Market data table"],
      3: ["Revenue column", "Margin column"],
      4: ["Analysis headline", "Body columns appear"],
      5: ["Closing statement"],
    },
    zh: {
      1: ["报头呈现"],
      2: ["标题与副题", "市场数据表"],
      3: ["收入栏", "利润率栏"],
      4: ["分析标题", "正文栏呈现"],
      5: ["结语陈述"],
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
    const content = SCENES[id][lang];
    const beatCount = BEAT_COUNTS[id];
    const actions = beatActions[lang][id as keyof (typeof beatActions)["en"]];

    const beats = Array.from({ length: beatCount }, (_, beatIdx) => {
      let beatTitle = "";
      let beatBody = "";

      if (id === 1) {
        beatTitle = content.headline || "";
        beatBody = content.tagline || "";
      } else if (id === 2) {
        beatTitle = content.headline || "";
        beatBody = beatIdx >= 1 ? (content.markets?.map((m) => `${m.name} ${m.change}`).join(" / ") || "") : content.deck || "";
      } else if (id === 3) {
        beatTitle = content.earningsTitle || "";
        beatBody = beatIdx >= 1
          ? (content.marginItems?.map((m) => `${m.label}: ${m.value}`).join(" / ") || "")
          : (content.revenueItems?.map((m) => `${m.label}: ${m.value}`).join(" / ") || "");
      } else if (id === 4) {
        beatTitle = content.analysisHeadline || "";
        beatBody = beatIdx >= 1 ? content.analysisBody || "" : "";
      } else if (id === 5) {
        beatTitle = content.closing || "";
        beatBody = content.closingSub || "";
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
    id: "19",
    band: "editorial-print",
    name: nameMap[lang],
    theme: themeMap[lang],
    densityLabel: densityLabelMap[lang],
    heroScene: 3,
    colors: {
      bg: "#fff1e5",
      ink: "#1a1a1a",
      panel: "#ffe4cc",
    },
    typography: {
      header: "Georgia Bold Italic",
      body: "Source Serif Pro 400",
    },
    tags: [
      "financial",
      "newspaper",
      "salmon",
      "data",
      "serif",
      "earnings",
      "markets",
      "tabular",
      "small-caps",
    ],
    fonts: ["Georgia", "Source Serif Pro"],
    scenes,
  };
}

// ─── Transition constants ─────────────────────────────────────────────────

const TRANSITION_DURATION = 700; // ms — outgoing 400ms + incoming 600ms w/ overlap
const BEAT_COUNTS: Record<number, number> = { 1: 1, 2: 2, 3: 2, 4: 2, 5: 1 };

// ─── Component ──────────────────────────────────────────────────────────────

export default function FinancialTimes({
  scene,
  beat,
  language,
  isThumbnail,
  reducedMotion,
  onNavigate,
  isTransitionClone,
}: BespokeStyleProps) {
  const [outgoingScene, setOutgoingScene] = useState<number | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const prevSceneRef = useRef<number>(scene);

  // Font injection
  useEffect(() => {
    const id = "style-19-fonts";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Source+Serif+Pro:ital,wght@0,400;0,600;0,700;1,400&display=swap";
    document.head.appendChild(link);
  }, []);

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

  // FLIP for scene 2 market table rows
  const { ref: marketTableRef } = useFLIP<HTMLTableSectionElement>({
    watch: [beat],
    duration: 400,
    easing: "cubic-bezier(0.16, 1, 0.3, 1)",
  });

  // FLIP for scene 3 earnings grid columns
  const { ref: earningsGridRef } = useFLIP<HTMLDivElement>({
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

  const rootClasses = [
    styles.root,
    reducedMotion ? styles.reducedMotion : "",
    isThumbnail ? styles.thumbnail : "",
  ]
    .filter(Boolean)
    .join(" ");

  const renderSceneFor = (sceneNum: number, beatNum: number) => {
    const sc = SCENES[sceneNum]?.[language] || SCENES[1][language];

    if (sceneNum === 1) {
      return (
        <div className={styles.ftMasthead}>
          <div className={styles.ftTopBar}>
            <span className={styles.ftEdition}>
              {language === "zh" ? "市场版" : "Markets Edition"}
            </span>
            <span className={styles.ftDate}>
              {language === "zh" ? "2026年7月" : "July 2026"}
            </span>
            <span className={styles.ftPrice}>$3.50</span>
          </div>
          <div className={styles.ftTitleBlock}>
            <h1 className={styles.ftLogo}>{sc.headline}</h1>
            <p className={styles.ftTagline}>{sc.tagline}</p>
          </div>
          <div className={styles.ftBottomRule}>
            <span className={styles.ftSectionLabel}>
              {language === "zh" ? "全球市场" : "World Markets"}
            </span>
            <span className={styles.ftSectionLabel}>
              {language === "zh" ? "公司业绩" : "Company Results"}
            </span>
            <span className={styles.ftSectionLabel}>
              {language === "zh" ? "经济分析" : "Economics"}
            </span>
            <span className={styles.ftSectionLabel}>Lex</span>
            <span className={styles.ftSectionLabel}>
              {language === "zh" ? "观点" : "Opinion"}
            </span>
          </div>
        </div>
      );
    }

    if (sceneNum === 2) {
      return (
        <div className={styles.marketReport}>
          <div className={styles.reportHeader}>
            <p className={styles.reportKicker}>{sc.kicker}</p>
            <h2 className={styles.reportHeadline}>{sc.headline}</h2>
            <p className={styles.reportDeck}>{sc.deck}</p>
          </div>
          {beatNum >= 1 && (
            <table
              className={styles.marketTable}
              style={{
                opacity: 1,
                transition: reducedMotion
                  ? "none"
                  : "opacity 0.5s ease 0.1s",
              }}
            >
              <thead>
                <tr>
                  <th>{language === "zh" ? "指数" : "Index"}</th>
                  <th>{language === "zh" ? "收盘" : "Close"}</th>
                  <th>{language === "zh" ? "涨跌幅" : "Change"}</th>
                </tr>
              </thead>
              <tbody ref={sceneNum === scene ? marketTableRef : undefined}>
                {(sc.markets || []).map((m, i) => (
                  <tr key={i}>
                    <td className={styles.indexName}>{m.name}</td>
                    <td className={styles.indexValue}>{m.value}</td>
                    <td
                      className={`${styles.indexChange} ${m.up ? styles.indexUp : styles.indexDown}`}
                    >
                      {m.change}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      );
    }

    if (sceneNum === 3) {
      return (
        <div className={styles.earningsScene}>
          <div className={styles.earningsHeader}>
            <p className={styles.earningsLabel}>{sc.earningsLabel}</p>
            <h2 className={styles.earningsTitle}>{sc.earningsTitle}</h2>
          </div>
          <div
            className={styles.earningsGrid}
            ref={sceneNum === scene ? earningsGridRef : undefined}
          >
            <div
              className={styles.earningsColumn}
              style={{
                opacity: 1,
                transform: "none",
                transition: reducedMotion
                  ? "none"
                  : "opacity 0.5s ease, transform 0.5s ease",
              }}
            >
              <div className={styles.earningsColumnTitle}>
                {language === "zh" ? "收入" : "Revenue"}
              </div>
              {(sc.revenueItems || []).map((item, i) => (
                <div key={i} className={styles.earningsItem}>
                  <span className={styles.earningsItemLabel}>
                    {item.label}
                  </span>
                  <span
                    className={`${styles.earningsItemValue} ${item.hl === "up" ? styles.highlight : item.hl === "down" ? styles.warn : ""}`}
                  >
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
            {beatNum >= 1 && (
              <div
                className={styles.earningsColumn}
                style={{
                  opacity: 1,
                  transform: "none",
                  transition: reducedMotion
                    ? "none"
                    : "opacity 0.5s ease 0.15s, transform 0.5s ease 0.15s",
                }}
              >
                <div className={styles.earningsColumnTitle}>
                  {language === "zh" ? "利润" : "Profitability"}
                </div>
                {(sc.marginItems || []).map((item, i) => (
                  <div key={i} className={styles.earningsItem}>
                    <span className={styles.earningsItemLabel}>
                      {item.label}
                    </span>
                    <span
                      className={`${styles.earningsItemValue} ${item.hl === "up" ? styles.highlight : item.hl === "down" ? styles.warn : ""}`}
                    >
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      );
    }

    if (sceneNum === 4) {
      return (
        <div className={styles.analysisScene}>
          <div className={styles.analysisRule} />
          <p className={styles.analysisLabel}>{sc.analysisLabel}</p>
          <h2 className={styles.analysisHeadline}>
            {sc.analysisHeadline}
          </h2>
          {beatNum >= 1 && (
            <>
              <p
                className={styles.analysisBody}
                style={{
                  opacity: 0.85,
                  transition: reducedMotion
                    ? "none"
                    : "opacity 0.6s ease 0.2s",
                }}
              >
                {sc.analysisBody}
              </p>
              <p className={styles.analysisByline}>
                {sc.analysisByline}
              </p>
            </>
          )}
        </div>
      );
    }

    if (sceneNum === 5) {
      return (
        <div className={styles.tickerScene}>
          <div className={styles.tickerOrnament}>
            <span className={styles.tickerOrnamentLine} />
            <span className={styles.tickerOrnamentLine} />
          </div>
          <h2 className={styles.tickerClosing}>
            {(sc.closing || "").split("\n").map((line, i) => (
              <React.Fragment key={i}>
                {line}
                {i < (sc.closing || "").split("\n").length - 1 && <br />}
              </React.Fragment>
            ))}
          </h2>
          <p className={styles.tickerSub}>{sc.closingSub}</p>
        </div>
      );
    }

    return null;
  };

  const renderNavIndicators = () => {
    if (isThumbnail) return null;

    return (
      <div className={styles.navIndicators} aria-label="Scene navigation">
        {[1, 2, 3, 4, 5].map((s) => {
          const isActive = s === scene;
          const classes = [
            styles.navIndicator,
            isActive ? styles.navIndicatorActive : "",
          ]
            .filter(Boolean)
            .join(" ");
          return (
            <button
              key={s}
              type="button"
              className={classes}
              aria-label={`Jump to scene ${s}`}
              onClick={(e) => handleNavClick(e, s)}
            >
              <span className={styles.navIndicatorMark} />
            </button>
          );
        })}
      </div>
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
          {renderSceneFor(outgoingScene, BEAT_COUNTS[outgoingScene] - 1)}
        </div>
      )}

      {/* Incoming / current scene */}
      <div className={incomingLayerClasses}>
        {renderSceneFor(scene, beat)}
      </div>

      {renderNavIndicators()}
    </div>
  );
}

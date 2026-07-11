import React, { useLayoutEffect, useCallback } from "react";
import {
  defineTopic,
  type TopicDefinition,
  type TopicMetadata,
  type TopicStageProps,
  type TopicTransitionScore,
} from "../domain/topic";
import SpatialSceneTrack from "../components/stage/SpatialSceneTrack";
import styles from "./editorial-feature.module.css";
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
      headline: "The Quiet Rebellion",
      tagline: "Reclaiming attention in an age of distraction",
    },
    zh: {
      headline: "安静的反叛",
      tagline: "在分心的时代重新夺回注意力",
    },
  },
  2: {
    en: {
      kicker: "Cover Essay",
      headline: "The Depth Deficit",
      deck: "Why shallow thinking has become the defining condition of our time — and what we can do about it",
      markets: [
        { name: "Deep work hours/day", value: "1.2", change: "avg.", up: true },
        { name: "Attention span (sec)", value: "47", change: "−25%", up: false },
        { name: "Context switching", value: "every 3m", change: "freq.", up: false },
      ],
    },
    zh: {
      kicker: "封面特稿",
      headline: "深度赤字",
      deck: "为什么浅层思考已成为我们这个时代的决定性状况——以及我们能做些什么",
      markets: [
        { name: "每日深度工作时长", value: "1.2", change: "小时", up: true },
        { name: "注意力跨度（秒）", value: "47", change: "−25%", up: false },
        { name: "上下文切换", value: "每3分钟", change: "频率", up: false },
      ],
    },
  },
  3: {
    en: {
      earningsLabel: "The Practice",
      earningsTitle: "Three Disciplines for Rebuilding Focus",
      revenueItems: [
        { label: "Temporal Boundaries", value: "Set hard stops", hl: "up" },
        { label: "Sensory Simplicity", value: "Reduce input noise" },
        { label: "Cognitive Rituals", value: "Warm-up routines", hl: "up" },
      ],
      marginItems: [
        { label: "Single-Tasking", value: "One thing at a time" },
        { label: "Boredom Tolerance", value: "Let the mind wander" },
        { label: "Analog Hours", value: "Screens off, 90 min", hl: "up" },
      ],
    },
    zh: {
      earningsLabel: "修炼方法",
      earningsTitle: "重建专注力的三项修炼",
      revenueItems: [
        { label: "时间边界", value: "设定硬性停止点", hl: "up" },
        { label: "感官简约", value: "减少输入噪音" },
        { label: "认知仪式", value: "预热惯例", hl: "up" },
      ],
      marginItems: [
        { label: "单任务", value: "一次只做一件事" },
        { label: "无聊耐受", value: "让思绪漫游" },
        { label: "模拟时段", value: "断网90分钟", hl: "up" },
      ],
    },
  },
  4: {
    en: {
      analysisLabel: "Reflection",
      analysisHeadline: "On Slowness as a Moral Act",
      analysisBody:
        "There is something quietly radical about choosing to read a single long article instead of scrolling forty short ones. About giving one idea your full attention for an hour rather than grazing a hundred. This is not nostalgia for a slower time — it is a practical recognition that depth, not speed, is where meaning lives. The most important things we make — relationships, understanding, craft — all require the one commodity we have stopped protecting: uninterrupted time.",
      analysisByline: "— From the Essay Series",
    },
    zh: {
      analysisLabel: "沉思",
      analysisHeadline: "论缓慢作为一种道德行为",
      analysisBody:
        "选择读一篇长文而不是刷四十篇短文，这其中蕴含着一种安静的激进。把一个小时的全部注意力给予一个想法而不是浅尝一百个。这不是对慢时代的怀旧——而是一种实际的认知，即深度而非速度，才是意义所在。我们所创造的最重要的东西——关系、理解、技艺——都需要一种我们已经停止保护的商品：不被打断的时间。",
      analysisByline: "—— 摘自随笔系列",
    },
  },
  5: {
    en: {
      closing: "Read deeply.\nThink slowly.",
      closingSub: "The Quiet Rebellion — Summer Feature — 2026",
    },
    zh: {
      closing: "深度阅读。\n缓慢思考。",
      closingSub: "安静的反叛 — 夏季特稿 — 2026",
    },
  },
};

// ─── Metadata ───────────────────────────────────────────────────────────────

function buildMetadata(lang: "en" | "zh"): TopicMetadata {
  const themeMap = {
    en: "Narrative-driven thought-leadership and personal essays — warm cream paper with literary serif voice and generous margins",
    zh: "叙事型思想领导力与个人随笔——暖色奶油纸配以文学衬线字体与充裕留白",
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
    theme: themeMap[lang],
    densityLabel: densityLabelMap[lang],
    heroScene: 3,
    colors: {
      bg: "#faf3e6",
      ink: "#2c2416",
      panel: "#f0e8d4",
    },
    typography: {
      header: "Source Serif Pro Italic",
      body: "Inter 400",
    },
    tags: [
      "editorial",
      "warm-paper",
      "literary",
      "feature-spread",
      "serif",
      "unhurried",
      "cream",
      "pull-quote",
      "narrative",
    ],
    fonts: ["Source Serif Pro", "Inter"],
    scenes,
  };
}

const metadata = {
  en: buildMetadata("en"),
  zh: buildMetadata("zh"),
} satisfies TopicDefinition["metadata"];

// ─── Component ──────────────────────────────────────────────────────────────

const TRANSITION_SCORE = {
  "1->2": "slide-x",
  "2->3": "slide-x",
  "3->4": "slide-x",
  "4->5": "slide-x",
} as const satisfies TopicTransitionScore;

const BEAT_LAYOUT_MODES = {
  2: "motion",
  3: "motion",
  4: "motion",
} satisfies Record<number, "motion" | "reserved">;

function TopicStage({
  scene,
  beat,
  language,
  isThumbnail,
  reducedMotion,
  onNavigate,
}: TopicStageProps) {

  // Font injection
  useLayoutEffect(() => {
    const id = "editorial-feature-fonts";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Source+Serif+Pro:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Inter:wght@400;500&display=swap";
    document.head.appendChild(link);
  }, []);

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
      <div
        className={styles.navIndicators}
        aria-label="Scene navigation"
        data-topic-navigation="true"
        data-navigation-geometry="spatial-node"
        data-navigation-carrier="editorial-feature-perimeter-marks"
        data-navigation-invocation="persistent"
        data-navigation-feedback="material-color-change"
      >
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

  return (
    <div className={rootClasses}>
            <SpatialSceneTrack
        scene={scene}
        beat={beat}
        transitionKind="slide-x"
        transitionMap={TRANSITION_SCORE}
        reducedMotion={reducedMotion || isThumbnail}
        beatLayoutModes={BEAT_LAYOUT_MODES}
        renderScene={(sceneId, sceneBeat) => (
          <div className={styles.sceneLayer}>
            {renderSceneFor(sceneId, sceneBeat)}
          </div>
        )}
      />

      {renderNavIndicators()}
    </div>
  );
}

export default defineTopic({
  id: "editorial-feature",
  styleId: "warm-editorial-feature",
  title: { en: "Editorial Feature", zh: "专题特稿" },
  modelId: "Doubao-Seed-Evolving",
  Stage: TopicStage,
  metadata,
  navigation: {
    geometry: "spatial-node",
    carrier: "editorial-feature-perimeter-marks",
    invocation: "persistent",
    feedback: "material-color-change",
  },
  transitionScore: TRANSITION_SCORE,
  evidence: {
    kind: "illustrative",
    boundary: {
      en: "Illustrative editorial feature: market figures, earnings rows, and analysis outcomes are presentation examples, not measured reporting.",
      zh: "示例专题特稿：市场数字、收益条目与分析结论均为演示内容，并非实测报道。",
    },
    display: "envelope",
  },
});

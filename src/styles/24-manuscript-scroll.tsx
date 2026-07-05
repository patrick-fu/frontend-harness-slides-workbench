import React, { useEffect, useCallback } from "react";
import type { BespokeStyleProps, StyleMetadata } from "../types";
import styles from "./24-manuscript-scroll.module.css";

// ─── Content ────────────────────────────────────────────────────────────────

interface SceneContent {
  en: {
    title?: string;
    subtitle?: string;
    dynasty?: string;
    seals?: string[];
    pageTitle?: string;
    pageOrnament?: string;
    paras?: string[];
    verse?: string;
    verseAttribution?: string;
    verseSeal?: string;
    commentaryLabel?: string;
    commentaryTitle?: string;
    commentaryNote?: string;
    commentaryParas?: string[];
    closingText?: string;
    closingNote?: string;
    closingSeals?: string[];
    closingOrnament?: string;
  };
  zh: {
    title?: string;
    subtitle?: string;
    dynasty?: string;
    seals?: string[];
    pageTitle?: string;
    pageOrnament?: string;
    paras?: string[];
    verse?: string;
    verseAttribution?: string;
    verseSeal?: string;
    commentaryLabel?: string;
    commentaryTitle?: string;
    commentaryNote?: string;
    commentaryParas?: string[];
    closingText?: string;
    closingNote?: string;
    closingSeals?: string[];
    closingOrnament?: string;
  };
}

const SCENES: Record<number, SceneContent> = {
  1: {
    en: {
      title: "The Way of Harmony",
      subtitle: "Classical Chinese Philosophy for the Modern Mind",
      dynasty: "From the Annals of Ancient Wisdom",
      seals: ["道", "和"],
    },
    zh: {
      title: "和之道",
      subtitle: "面向现代心灵的中国古典哲学",
      dynasty: "摘自古籍智慧录",
      seals: ["道", "和"],
    },
  },
  2: {
    en: {
      pageOrnament: "❖",
      pageTitle: "On the Nature of Balance",
      paras: [
        "The sage does not strive for extremes, but finds wisdom in the middle way. Like the bamboo that bends but does not break, true strength lies in adaptability, not rigidity. The river carves the stone not through force, but through persistence and flow.",
        "When we understand that all things are interconnected, our actions become more deliberate and our judgments more compassionate. The wise person sees themselves in others, and others in themselves. This recognition is the foundation of ethical living.",
      ],
    },
    zh: {
      pageOrnament: "❖",
      pageTitle: "论平衡之道",
      paras: [
        "圣人不求极端，而于中道中觅得智慧。如竹之弯而不折，真正的力量在于适应，而非刚硬。江河之能穿石，非以力也，乃以恒与流也。",
        "当我们明了万物相连，我们的行为便更为审慎，判断便更为慈悲。智者见己于人，见人于己。此认知乃伦理生活之根基。",
      ],
    },
  },
  3: {
    en: {
      verse:
        "The journey of a thousand miles\nbegins beneath one's feet.\nIn stillness, find movement;\nin movement, find stillness.",
      verseAttribution: "— Attributed to Laozi, 6th century BCE",
      verseSeal: "老",
    },
    zh: {
      verse: "千里之行\n始于足下\n静中求动\n动中求静",
      verseAttribution: "—— 传为老子语，公元前六世纪",
      verseSeal: "老",
    },
  },
  4: {
    en: {
      commentaryLabel: "Modern Commentary",
      commentaryTitle: "Ancient Wisdom\nin a Digital Age",
      commentaryNote:
        "How do classical teachings resonate with contemporary challenges?",
      commentaryParas: [
        "The principles articulated two and a half millennia ago speak to us with surprising urgency today. In an age of information overload and constant distraction, the call for inner stillness is not merely nostalgic — it is a practical necessity for mental and spiritual well-being.",
        "The concept of wu wei, often misunderstood as passivity, actually describes a state of optimal action: doing without forcing, achieving without striving. This is precisely the flow state that modern productivity science seeks to cultivate.",
      ],
    },
    zh: {
      commentaryLabel: "当代解读",
      commentaryTitle: "数字时代的\n古老智慧",
      commentaryNote: "古典教诲如何与当代挑战共鸣？",
      commentaryParas: [
        "两千五百年前阐述的原则在今天以惊人的紧迫性向我们诉说。在一个信息过载、持续分心的时代，对内心宁静的呼唤不仅是怀旧——它是精神与心灵健康的实际必需。",
        "常被误解为消极的「无为」概念，实际上描述了一种最佳行动状态：做而不强求，成而不力争。这正是现代生产力科学所寻求培养的心流状态。",
      ],
    },
  },
  5: {
    en: {
      closingOrnament: "❖",
      closingText: "Seek harmony.\nWalk gently.\nLive fully.",
      closingNote: "— Transmitted from the ancients to the present day",
      closingSeals: ["真", "善", "美"],
    },
    zh: {
      closingOrnament: "❖",
      closingText: "求和谐\n缓步前行\n尽兴生活",
      closingNote: "—— 传自古人，至于今日",
      closingSeals: ["真", "善", "美"],
    },
  },
};

// ─── Metadata ───────────────────────────────────────────────────────────────

export function getMetadata(lang: "en" | "zh"): StyleMetadata {
  const nameMap = { en: "Manuscript Scroll", zh: "手卷" };
  const themeMap = {
    en: "Classical Chinese philosophy — aged parchment aesthetic with calligraphic titles and red seal stamps",
    zh: "中国古典哲学——古卷美学，书法标题与红色印章",
  };
  const densityLabelMap = { en: "Reading-First", zh: "阅读优先" };

  const sceneTitles = {
    en: ["Title Scroll", "Text Page", "Verse", "Commentary", "Colophon"],
    zh: ["卷首", "正文", "韵语", "解读", "卷尾"],
  };

  const beatActions = {
    en: {
      1: ["Title and seals appear"],
      2: ["Page heading and ornament", "Body text columns"],
      3: ["Verse calligraphy", "Attribution and seal"],
      4: ["Commentary title", "Analysis body text"],
      5: ["Closing with seals"],
    },
    zh: {
      1: ["标题与印章呈现"],
      2: ["页面标题与装饰", "正文栏"],
      3: ["韵语书法", "署名与印章"],
      4: ["解读标题", "分析正文"],
      5: ["结语配印章"],
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
        beatTitle = content.title || "";
        beatBody = content.subtitle || "";
      } else if (id === 2) {
        beatTitle = content.pageTitle || "";
        beatBody = beatIdx >= 1 ? (content.paras?.[0] || "") : "";
      } else if (id === 3) {
        beatTitle = content.verse || "";
        beatBody = beatIdx >= 1 ? content.verseAttribution || "" : "";
      } else if (id === 4) {
        beatTitle = content.commentaryTitle || "";
        beatBody = beatIdx >= 1 ? (content.commentaryParas?.[0] || "") : content.commentaryNote || "";
      } else if (id === 5) {
        beatTitle = content.closingText || "";
        beatBody = content.closingNote || "";
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
    id: "24",
    band: "editorial-print",
    name: nameMap[lang],
    theme: themeMap[lang],
    densityLabel: densityLabelMap[lang],
    heroScene: 3,
    colors: {
      bg: "#f5ecd7",
      ink: "#2c1810",
      panel: "#ede0c4",
    },
    typography: {
      header: "Ma Shan Zheng / Noto Serif SC",
      body: "Noto Serif SC / Playfair Display",
    },
    tags: [
      "manuscript",
      "scroll",
      "chinese",
      "calligraphy",
      "parchment",
      "seal",
      "philosophy",
      "classical",
      "vertical",
    ],
    fonts: ["cjk:Noto Serif SC", "cjk:Ma Shan Zheng", "Playfair Display"],
    scenes,
  };
}

// ─── Component ──────────────────────────────────────────────────────────────

export default function ManuscriptScroll({
  scene,
  beat,
  language,
  isThumbnail,
  reducedMotion,
  onNavigate,
  isTransitionClone,
}: BespokeStyleProps) {
  const content = SCENES[scene]?.[language] || SCENES[1][language];
  void isTransitionClone;

  // Font injection
  useEffect(() => {
    const id = "style-24-fonts";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;700&family=Ma+Shan+Zheng&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap";
    document.head.appendChild(link);
  }, []);

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

  const isZh = language === "zh";

  const renderSceneContent = () => {
    if (scene === 1) {
      const titleClasses = [
        styles.scrollMainTitle,
        isZh ? styles.vertical : "",
      ]
        .filter(Boolean)
        .join(" ");

      return (
        <div className={styles.scrollTitle}>
          <div className={styles.scrollSeals}>
            {(content.seals || []).map((seal, i) => (
              <div key={i} className={styles.scrollSeal}>
                {seal}
              </div>
            ))}
          </div>
          <h1 className={titleClasses}>{content.title}</h1>
          <p className={styles.scrollSubtitle}>{content.subtitle}</p>
          <p className={styles.scrollDynasty}>{content.dynasty}</p>
        </div>
      );
    }

    if (scene === 2) {
      return (
        <div className={styles.scrollPage}>
          <div className={styles.scrollPageHeader}>
            <span className={styles.scrollPageHeaderOrnament}>
              {content.pageOrnament}
            </span>
            <h2 className={styles.scrollPageTitle}>
              {content.pageTitle}
            </h2>
            <span className={styles.scrollPageHeaderOrnament}>
              {content.pageOrnament}
            </span>
          </div>
          {beat >= 1 && (
            <div
              className={styles.scrollPageBody}
              style={{
                opacity: 1,
                transition: reducedMotion
                  ? "none"
                  : "opacity 0.6s ease 0.15s",
              }}
            >
              {(content.paras || []).map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          )}
        </div>
      );
    }

    if (scene === 3) {
      const verseClasses = [
        styles.scrollVerseText,
        isZh ? styles.vertical : "",
      ]
        .filter(Boolean)
        .join(" ");

      return (
        <div className={styles.scrollVerse}>
          <div className={styles.scrollVerseOrnamentTop}>
            <span className={styles.scrollVerseOrnamentSymbol}>
              {isZh ? "卷" : "❦"}
            </span>
          </div>
          <p className={verseClasses}>
            {(content.verse || "").split("\n").map((line, i) => (
              <React.Fragment key={i}>
                {line}
                {i < (content.verse || "").split("\n").length - 1 && <br />}
              </React.Fragment>
            ))}
          </p>
          {beat >= 1 && (
            <>
              <p
                className={styles.scrollVerseAttribution}
                style={{
                  opacity: 0.55,
                  transition: reducedMotion
                    ? "none"
                    : "opacity 0.6s ease 0.2s",
                }}
              >
                {content.verseAttribution}
              </p>
              <div className={styles.scrollVerseSeal}>
                {content.verseSeal}
              </div>
            </>
          )}
        </div>
      );
    }

    if (scene === 4) {
      return (
        <div className={styles.scrollCommentary}>
          <div className={styles.scrollCommentaryLeft}>
            <p className={styles.scrollCommentaryLabel}>
              {content.commentaryLabel}
            </p>
            <h2 className={styles.scrollCommentaryTitle}>
              {(content.commentaryTitle || "").split("\n").map((line, i) => (
                <React.Fragment key={i}>
                  {line}
                  {i < (content.commentaryTitle || "").split("\n").length - 1 && <br />}
                </React.Fragment>
              ))}
            </h2>
            <p className={styles.scrollCommentaryNote}>
              {content.commentaryNote}
            </p>
          </div>
          {beat >= 1 && (
            <div
              className={styles.scrollCommentaryRight}
              style={{
                opacity: 1,
                transition: reducedMotion
                  ? "none"
                  : "opacity 0.5s ease 0.15s",
              }}
            >
              {(content.commentaryParas || []).map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          )}
        </div>
      );
    }

    if (scene === 5) {
      return (
        <div className={styles.scrollClosing}>
          <div className={styles.scrollClosingOrnament}>
            <span className={styles.scrollClosingOrnamentChar}>
              {content.closingOrnament}
            </span>
          </div>
          <p className={styles.scrollClosingText}>
            {(content.closingText || "").split("\n").map((line, i) => (
              <React.Fragment key={i}>
                {line}
                {i < (content.closingText || "").split("\n").length - 1 && <br />}
              </React.Fragment>
            ))}
          </p>
          <p className={styles.scrollClosingNote}>{content.closingNote}</p>
          <div className={styles.scrollClosingSeals}>
            {(content.closingSeals || []).map((seal, i) => (
              <div key={i} className={styles.scrollClosingSeal}>
                {seal}
              </div>
            ))}
          </div>
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

  return (
    <div className={rootClasses}>
      <div
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
      {renderNavIndicators()}
    </div>
  );
}

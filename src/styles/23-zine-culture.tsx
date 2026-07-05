import React, { useEffect, useState, useRef, useCallback } from "react";
import type { BespokeStyleProps, StyleMetadata } from "../types";
import styles from "./23-zine-culture.module.css";

// ─── Content ────────────────────────────────────────────────────────────────

interface SceneContent {
  en: {
    title?: string;
    subtitle?: string;
    issue?: string;
    stamp?: string;
    collageTitle?: string;
    collageHighlight?: string;
    handwritten?: string;
    listLabel?: string;
    listTitle?: string;
    bands?: Array<{ name: string; genre: string }>;
    interviewLabel?: string;
    q1?: string;
    a1?: string;
    q2?: string;
    a2?: string;
    backText?: string;
    backEm?: string;
    backSub?: string;
    doodle?: string;
  };
  zh: {
    title?: string;
    subtitle?: string;
    issue?: string;
    stamp?: string;
    collageTitle?: string;
    collageHighlight?: string;
    handwritten?: string;
    listLabel?: string;
    listTitle?: string;
    bands?: Array<{ name: string; genre: string }>;
    interviewLabel?: string;
    q1?: string;
    a1?: string;
    q2?: string;
    a2?: string;
    backText?: string;
    backEm?: string;
    backSub?: string;
    doodle?: string;
  };
}

const SCENES: Record<number, SceneContent> = {
  1: {
    en: {
      title: "STATIC\nZINE",
      subtitle: "Sounds from the underground",
      issue: "Issue #7 — Summer 2026",
      stamp: "FRESH",
    },
    zh: {
      title: "静电\n杂志",
      subtitle: "来自地下的声音",
      issue: "第7期 — 2026年夏",
      stamp: "新鲜",
    },
  },
  2: {
    en: {
      collageTitle: "This is NOT\na phase, mom",
      collageHighlight: "NOT",
      handwritten: "the kids are alright",
    },
    zh: {
      collageTitle: "这不是\n一时兴起，妈",
      collageHighlight: "不是",
      handwritten: "孩子们都还好",
    },
  },
  3: {
    en: {
      listLabel: "On rotation:",
      listTitle: "5 bands you\nneed to hear",
      bands: [
        { name: "Velvet Static", genre: "shoegaze" },
        { name: "Neon Rats", genre: "post-punk" },
        { name: "Paper Tigers", genre: "indie folk" },
        { name: "Glass Lung", genre: "noise rock" },
        { name: "Sundial", genre: "dream pop" },
      ],
    },
    zh: {
      listLabel: "循环播放中：",
      listTitle: "你需要听的\n5支乐队",
      bands: [
        { name: "天鹅绒静电", genre: "自赏" },
        { name: "霓虹老鼠", genre: "后朋克" },
        { name: "纸老虎", genre: "独立民谣" },
        { name: "玻璃肺", genre: "噪音摇滚" },
        { name: "日晷", genre: "梦幻流行" },
      ],
    },
  },
  4: {
    en: {
      interviewLabel: "Interview:",
      q1: "WHAT KEEPS YOU MAKING MUSIC WHEN NO ONE IS LISTENING?",
      a1: "Because the alternative is worse. We play for the same reason anyone does anything — because not doing it would feel like dying a little.",
      q2: "ADVICE FOR KIDS STARTING OUT?",
      a2: "Don't wait for permission. Make the thing. Put it out there. The worst that happens is you learn something.",
    },
    zh: {
      interviewLabel: "采访：",
      q1: "当没人在听的时候，是什么让你继续做音乐？",
      a1: "因为不做更糟。我们做音乐的原因和任何人做任何事一样——因为不做就像死了一点点。",
      q2: "对刚开始的孩子有什么建议？",
      a2: "别等许可。做出来。发出去。最糟的结果是你学到了东西。",
    },
  },
  5: {
    en: {
      backText: "Stay\ncurious.",
      backEm: "curious",
      backSub: "— xoxo Static Zine",
      doodle: "★",
    },
    zh: {
      backText: "保持\n好奇。",
      backEm: "好奇",
      backSub: "—— 亲亲 静电杂志",
      doodle: "★",
    },
  },
};

// ─── Metadata ───────────────────────────────────────────────────────────────

export function getMetadata(lang: "en" | "zh"): StyleMetadata {
  const nameMap = { en: "Zine Culture", zh: "杂志文化" };
  const themeMap = {
    en: "Indie music scene report — DIY cut-and-paste collage aesthetic with mixed typography and photocopied texture",
    zh: "独立音乐场景报告——DIY拼贴美学，混合字体与影印质感",
  };
  const densityLabelMap = { en: "Chaotic", zh: "混搭" };

  const sceneTitles = {
    en: ["Cover", "Collage", "Band List", "Interview", "Back Cover"],
    zh: ["封面", "拼贴", "乐队名单", "采访", "封底"],
  };

  const beatActions = {
    en: {
      1: ["Zine title slams down"],
      2: ["Collage elements appear", "Handwritten note added"],
      3: ["Band 1-2", "Band 3-4", "Band 5"],
      4: ["First Q&A", "Second Q&A"],
      5: ["Manifesto statement"],
    },
    zh: {
      1: ["杂志标题砸下"],
      2: ["拼贴元素呈现", "手写便签加入"],
      3: ["乐队1-2", "乐队3-4", "乐队5"],
      4: ["第一组问答", "第二组问答"],
      5: ["宣言陈述"],
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
        beatTitle = content.collageTitle || "";
        beatBody = beatIdx >= 1 ? content.handwritten || "" : "";
      } else if (id === 3) {
        beatTitle = content.listTitle || "";
        const bands = content.bands || [];
        const endIdx = Math.min((beatIdx + 1) * 2, bands.length);
        beatBody = bands.slice(0, endIdx).map((b) => b.name).join(" / ");
      } else if (id === 4) {
        beatTitle = content.q1 || "";
        beatBody = beatIdx >= 1 ? content.a2 || "" : content.a1 || "";
      } else if (id === 5) {
        beatTitle = content.backText || "";
        beatBody = content.backSub || "";
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
    id: "23",
    band: "editorial-print",
    name: nameMap[lang],
    theme: themeMap[lang],
    densityLabel: densityLabelMap[lang],
    heroScene: 2,
    colors: {
      bg: "#f0ebe0",
      ink: "#1a1a1a",
      panel: "#e8e0d0",
    },
    typography: {
      header: "Permanent Marker",
      body: "Caveat / Inter",
    },
    tags: [
      "zine",
      "diy",
      "collage",
      "handwritten",
      "indie",
      "punk",
      "mixed-fonts",
      "texture",
      "off-kilter",
    ],
    fonts: ["Caveat", "Permanent Marker", "Inter", "cjk:Noto Serif SC"],
    scenes,
  };
}

// ─── Component ──────────────────────────────────────────────────────────────

export default function ZineCulture({
  scene,
  beat,
  language,
  isThumbnail,
  reducedMotion,
  onNavigate,
}: BespokeStyleProps) {
  const content = SCENES[scene]?.[language] || SCENES[1][language];
  const [entered, setEntered] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

  // Font injection
  useEffect(() => {
    const id = "style-23-fonts";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Caveat:wght@400;700&family=Permanent+Marker&family=Inter:wght@400;700&family=Noto+Serif+SC:wght@400;700&display=swap";
    document.head.appendChild(link);
  }, []);

  useEffect(() => {
    setEntered(false);
    const raf = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setEntered(true);
      });
    });
    return () => cancelAnimationFrame(raf);
  }, [scene]);

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

  const trackClasses = [
    styles.track,
    entered ? styles.trackActive : styles.trackEnter,
  ]
    .filter(Boolean)
    .join(" ");

  const renderSceneContent = () => {
    if (scene === 1) {
      return (
        <div className={styles.zineCover}>
          <div className={styles.zineStamp}>{content.stamp}</div>
          <h1 className={styles.zineCoverTitle}>
            {(content.title || "").split("\n").map((line, i) => (
              <React.Fragment key={i}>
                {line}
                {i < (content.title || "").split("\n").length - 1 && <br />}
              </React.Fragment>
            ))}
          </h1>
          <p className={styles.zineCoverSub}>{content.subtitle}</p>
          <p className={styles.zineCoverIssue}>{content.issue}</p>
        </div>
      );
    }

    if (scene === 2) {
      return (
        <div className={styles.zineCollage}>
          <h2 className={styles.zineCollageTitle}>
            {(content.collageTitle || "").split("\n").map((line, i) => (
              <React.Fragment key={i}>
                {line.split(content.collageHighlight || "").map((part, j, arr) => (
                  <React.Fragment key={j}>
                    {part}
                    {j < arr.length - 1 && <span>{content.collageHighlight}</span>}
                  </React.Fragment>
                ))}
                {i < (content.collageTitle || "").split("\n").length - 1 && <br />}
              </React.Fragment>
            ))}
          </h2>
          <div className={styles.zineCutout1} />
          {beat >= 0 && <div className={styles.zineCutout2} />}
          {beat >= 1 && (
            <>
              <div className={styles.zineCutout3} />
              <p className={styles.zineHandwritten}>
                {content.handwritten}
              </p>
              <span className={styles.zineArrow}>&#8599;</span>
            </>
          )}
        </div>
      );
    }

    if (scene === 3) {
      const bands = content.bands || [];
      const visibleCount = Math.min((beat + 1) * 2, bands.length);
      return (
        <div className={styles.zineList}>
          <p className={styles.zineListLabel}>{content.listLabel}</p>
          <h2 className={styles.zineListTitle}>
            {(content.listTitle || "").split("\n").map((line, i) => (
              <React.Fragment key={i}>
                {line}
                {i < (content.listTitle || "").split("\n").length - 1 && <br />}
              </React.Fragment>
            ))}
          </h2>
          <div className={styles.zineBandItems}>
            {bands.slice(0, visibleCount).map((band, i) => (
              <div
                key={i}
                className={styles.zineBandItem}
                style={{
                  opacity: entered ? 1 : 0,
                  transition: reducedMotion
                    ? "none"
                    : `opacity 0.3s ease ${i * 0.08}s`,
                }}
              >
                <span className={styles.zineBandNum}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className={styles.zineBandName}>{band.name}</span>
                <span className={styles.zineBandGenre}>{band.genre}</span>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (scene === 4) {
      return (
        <div className={styles.zineInterview}>
          <p className={styles.zineInterviewLabel}>
            {content.interviewLabel}
          </p>
          <p className={styles.zineInterviewQ}>{content.q1}</p>
          <p className={styles.zineInterviewA}>{content.a1}</p>
          {beat >= 1 && (
            <div
              style={{
                opacity: entered ? 1 : 0,
                transition: reducedMotion
                  ? "none"
                  : "opacity 0.4s ease 0.1s",
              }}
            >
              <p className={styles.zineInterviewQ}>{content.q2}</p>
              <p className={styles.zineInterviewA}>{content.a2}</p>
            </div>
          )}
        </div>
      );
    }

    if (scene === 5) {
      return (
        <div className={styles.zineBack}>
          <div className={styles.zineBackBox}>
            <p className={styles.zineBackText}>
              {(content.backText || "").split("\n").map((line, i) => (
                <React.Fragment key={i}>
                  {line.split(content.backEm || "").map((part, j) =>
                    part === content.backEm ? (
                      <em key={j}>{part}</em>
                    ) : (
                      <React.Fragment key={j}>{part}</React.Fragment>
                    ),
                  )}
                  {i < (content.backText || "").split("\n").length - 1 && <br />}
                </React.Fragment>
              ))}
            </p>
            <p className={styles.zineBackSub}>{content.backSub}</p>
          </div>
          <span className={styles.zineDoodle}>{content.doodle}</span>
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
              <span className={styles.navIndicatorStar}>
                {isActive ? "★" : "☆"}
              </span>
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <div className={rootClasses}>
      <div
        ref={trackRef}
        key={`23-${scene}`}
        className={trackClasses}
        style={reducedMotion ? { transitionDuration: "0s" } : undefined}
      >
        {renderSceneContent()}
      </div>
      {renderNavIndicators()}
    </div>
  );
}

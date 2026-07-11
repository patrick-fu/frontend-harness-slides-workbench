import React, { useLayoutEffect, useEffect, useState, useCallback } from "react";
import {
  defineTopic,
  type TopicDefinition,
  type TopicMetadata,
  type TopicStageProps,
} from "../domain/topic";
import SpatialSceneTrack from "../styles/SpatialSceneTrack";
import styles from "./riso-zine.module.css";
import { useFLIP } from "../hooks/useFLIP";

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

function buildMetadata(lang: "en" | "zh"): TopicMetadata {
  const themeMap = {
    en: "Manifestos and workshop decks — risograph print with 2-3 spot inks, paper grain, misregistration, and three-voice typography: condensed display, quiet body, hand-script",
    zh: "宣言与工作坊演示——孔版印刷，2-3种专色油墨，纸张纹理，套印偏移，三声部字体：浓缩展示、安静正文、手写注记",
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
    theme: themeMap[lang],
    densityLabel: densityLabelMap[lang],
    heroScene: 2,
    colors: {
      bg: "#f2ead8",
      ink: "#1a1a2e",
      panel: "#e8dfc8",
    },
    typography: {
      header: "Oswald 700",
      body: "Inter 400",
    },
    tags: [
      "riso",
      "zine",
      "risograph",
      "spot-ink",
      "paper-grain",
      "misregistration",
      "condensed-display",
      "hand-script",
      "diy",
    ],
    fonts: ["Oswald", "Caveat", "Inter", "cjk:Noto Serif SC"],
    scenes,
  };
}

// ─── Transition constants ─────────────────────────────────────────────────

// ─── Component ──────────────────────────────────────────────────────────────

const BEAT_LAYOUT_MODES = {
  2: "motion",
  3: "motion",
  4: "motion",
} satisfies Record<number, "motion" | "reserved">;

const metadata = {
  en: buildMetadata("en"),
  zh: buildMetadata("zh"),
} satisfies TopicDefinition["metadata"];

const NAVIGATION = {
  geometry: "ambient",
  carrier: "zine-star-index",
  invocation: "persistent",
  feedback: "active-glow",
} as const satisfies TopicDefinition["navigation"];

const TRANSITION_SCORE = {
  "1->2": "glitch",
  "2->3": "glitch",
  "3->4": "glitch",
  "4->5": "glitch",
} as const satisfies TopicDefinition["transitionScore"];

const EVIDENCE = {
  kind: "illustrative",
  boundary: {
    en: "Illustrative zine: its issue, band names, interview, and manifesto are authored presentation content, not reporting on actual artists or events.",
    zh: "示例杂志：其中期号、乐队名称、采访和宣言均为创作展示内容，并非对真实艺人或事件的报道。",
  },
  display: "envelope",
} as const satisfies TopicDefinition["evidence"];

function TopicStage({
  scene,
  beat,
  language,
  isThumbnail,
  reducedMotion,
  onNavigate,
}: TopicStageProps) {
  const [entered, setEntered] = useState(false);

  // Font injection
  useLayoutEffect(() => {
    const id = "riso-zine-fonts";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Caveat:wght@400;700&family=Inter:wght@400;500;700&family=Noto+Serif+SC:wght@400;700&display=swap";
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

  // FLIP for collage elements and band list
  const { ref: collageRef } = useFLIP<HTMLDivElement>({
    watch: [beat],
    duration: 500,
    selector: ".zineElement",
    easing: "cubic-bezier(0.16, 1, 0.3, 1)",
  });

  const { ref: bandListRef } = useFLIP<HTMLDivElement>({
    watch: [beat],
    duration: 500,
    selector: ".zineElement",
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

  // ── Render scene content for a given scene number ────────────────────────

  const renderSceneFor = (sceneNum: number, beatNum: number) => {
    const sc = SCENES[sceneNum]?.[language] || SCENES[1][language];
    const isCurrent = sceneNum === scene;

    if (sceneNum === 1) {
      return (
        <div className={styles.zineCover}>
          <div className={`${styles.zineStamp} zineElement`}>{sc.stamp}</div>
          <h1 className={styles.zineCoverTitle}>
            {(sc.title || "").split("\n").map((line, i) => (
              <React.Fragment key={i}>
                {line}
                {i < (sc.title || "").split("\n").length - 1 && <br />}
              </React.Fragment>
            ))}
          </h1>
          <p className={styles.zineCoverSub}>{sc.subtitle}</p>
          <p className={styles.zineCoverIssue}>{sc.issue}</p>
        </div>
      );
    }

    if (sceneNum === 2) {
      return (
        <div
          className={styles.zineCollage}
          ref={isCurrent ? collageRef : undefined}
        >
          <h2 className={styles.zineCollageTitle}>
            {(sc.collageTitle || "").split("\n").map((line, i) => (
              <React.Fragment key={i}>
                {line.split(sc.collageHighlight || "").map((part, j, arr) => (
                  <React.Fragment key={j}>
                    {part}
                    {j < arr.length - 1 && <span>{sc.collageHighlight}</span>}
                  </React.Fragment>
                ))}
                {i < (sc.collageTitle || "").split("\n").length - 1 && <br />}
              </React.Fragment>
            ))}
          </h2>
          <div className={`${styles.zineCutout1} zineElement`} />
          {beatNum >= 0 && <div className={`${styles.zineCutout2} zineElement`} />}
          {beatNum >= 1 && (
            <>
              <div className={`${styles.zineCutout3} zineElement`} />
              <p className={`${styles.zineHandwritten} zineElement`}>
                {sc.handwritten}
              </p>
              <span className={`${styles.zineArrow} zineElement`}>&#8599;</span>
            </>
          )}
        </div>
      );
    }

    if (sceneNum === 3) {
      const bands = sc.bands || [];
      const visibleCount = Math.min((beatNum + 1) * 2, bands.length);
      return (
        <div className={styles.zineList}>
          <p className={styles.zineListLabel}>{sc.listLabel}</p>
          <h2 className={styles.zineListTitle}>
            {(sc.listTitle || "").split("\n").map((line, i) => (
              <React.Fragment key={i}>
                {line}
                {i < (sc.listTitle || "").split("\n").length - 1 && <br />}
              </React.Fragment>
            ))}
          </h2>
          <div
            className={styles.zineBandItems}
            ref={isCurrent ? bandListRef : undefined}
          >
            {bands.slice(0, visibleCount).map((band, i) => (
              <div
                key={i}
                className={`${styles.zineBandItem} zineElement`}
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

    if (sceneNum === 4) {
      return (
        <div className={styles.zineInterview}>
          <p className={styles.zineInterviewLabel}>
            {sc.interviewLabel}
          </p>
          <p className={styles.zineInterviewQ}>{sc.q1}</p>
          <p className={styles.zineInterviewA}>{sc.a1}</p>
          {beatNum >= 1 && (
            <div
              className="zineElement"
              style={{
                opacity: entered ? 1 : 0,
                transition: reducedMotion
                  ? "none"
                  : "opacity 0.4s ease 0.1s",
              }}
            >
              <p className={styles.zineInterviewQ}>{sc.q2}</p>
              <p className={styles.zineInterviewA}>{sc.a2}</p>
            </div>
          )}
        </div>
      );
    }

    if (sceneNum === 5) {
      return (
        <div className={styles.zineBack}>
          <div className={styles.zineBackBox}>
            <p className={styles.zineBackText}>
              {(sc.backText || "").split("\n").map((line, i) => (
                <React.Fragment key={i}>
                  {line.split(sc.backEm || "").map((part, j) =>
                    part === sc.backEm ? (
                      <em key={j}>{part}</em>
                    ) : (
                      <React.Fragment key={j}>{part}</React.Fragment>
                    ),
                  )}
                  {i < (sc.backText || "").split("\n").length - 1 && <br />}
                </React.Fragment>
              ))}
            </p>
            <p className={styles.zineBackSub}>{sc.backSub}</p>
          </div>
          <span className={`${styles.zineDoodle} zineElement`}>{sc.doodle}</span>
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
        data-navigation-geometry={NAVIGATION.geometry}
        data-navigation-carrier={NAVIGATION.carrier}
        data-navigation-invocation={NAVIGATION.invocation}
        data-navigation-feedback={NAVIGATION.feedback}
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
              <span className={styles.navIndicatorStar}>
                {isActive ? "★" : "☆"}
              </span>
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
        transitionKind="glitch"
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

      {renderNavIndicators()}
    </div>
  );
}

export default defineTopic({
  id: "riso-zine",
  styleId: "riso-print-zine",
  title: { en: "Riso Zine", zh: "孔版杂志" },
  modelId: "Doubao-Seed-Evolving",
  Stage: TopicStage,
  metadata,
  navigation: NAVIGATION,
  transitionScore: TRANSITION_SCORE,
  evidence: EVIDENCE,
});

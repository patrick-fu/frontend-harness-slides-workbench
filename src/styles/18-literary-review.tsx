import React, { useEffect, useState, useRef, useCallback } from "react";
import type { BespokeStyleProps, StyleMetadata } from "../types";
import styles from "./18-literary-review.module.css";

// ─── Content ────────────────────────────────────────────────────────────────

interface SceneContent {
  en: {
    title?: string;
    subtitle?: string;
    label?: string;
    text?: string;
    attribution?: string;
    poemTitle?: string;
    poemAuthor?: string;
    stanzas?: string[];
    kicker?: string;
    headline?: string;
    body?: string[];
    closing?: string;
    note?: string;
  };
  zh: {
    title?: string;
    subtitle?: string;
    label?: string;
    text?: string;
    attribution?: string;
    poemTitle?: string;
    poemAuthor?: string;
    stanzas?: string[];
    kicker?: string;
    headline?: string;
    body?: string[];
    closing?: string;
    note?: string;
  };
}

const SCENES: Record<number, SceneContent> = {
  1: {
    en: {
      title: "The Reading Room",
      subtitle: "A Quarterly Review of Contemporary Literature",
    },
    zh: {
      title: "阅读之室",
      subtitle: "当代文学季评",
    },
  },
  2: {
    en: {
      label: "Fiction Excerpt",
      text: "The city had not changed so much as it had learned to keep its secrets better. Every morning she walked the same route past the same buildings, yet each day they seemed to reveal a different face — a window newly opened, a door painted a colour she could not name.",
      attribution: "— from 'The Cartographer's Dream' by Elena Vasquez",
    },
    zh: {
      label: "小说节选",
      text: "这座城市并没有太大变化，只是更善于保守自己的秘密了。每天早晨她走过同样的路线，经过同样的建筑，然而每一天它们似乎都展现出不同的面孔——一扇新打开的窗户，一扇漆成她说不出名字的颜色的门。",
      attribution: "—— 摘自埃莱娜·巴斯克斯《制图师之梦》",
    },
  },
  3: {
    en: {
      poemTitle: "Urban Elegy",
      poemAuthor: "Marcus Chen",
      stanzas: [
        "Between the glass and steel we walk,\nour shadows stretched like thread.\nThe city hums its ancient song,\nof lives already led.",
        "And in the quiet hours between,\nwhen neon starts to fade,\nwe find the spaces we have lost,\nin every choice we made.",
      ],
    },
    zh: {
      poemTitle: "城市挽歌",
      poemAuthor: "马库斯·陈",
      stanzas: [
        "在玻璃与钢铁之间我们行走，\n影子如线般延展。\n城市低吟它古老的歌，\n关于那些已经走过的人生。",
        "而在那些静谧的间隙，\n当霓虹开始褪色，\n我们找回了失去的空间，\n在每一个我们做出的选择中。",
      ],
    },
  },
  4: {
    en: {
      kicker: "Critical Essay",
      headline: "The Return of the Unreliable Narrator",
      body: [
        "In recent fiction, we witness a striking resurgence of the unreliable narrator — a device once thought exhausted by postmodern playfulness. Today's writers deploy it not as a formal experiment but as an ethical instrument: to question how memory constructs identity, and how storytelling itself becomes a mode of survival.",
        "The shift reflects a broader cultural anxiety about truth and authenticity in an age of algorithmic mediation. When every narrative can be synthesized, the unreliable narrator ceases to be a literary gimmick and becomes instead a mirror held up to the reader's own complicity in constructing meaning.",
      ],
    },
    zh: {
      kicker: "评论随笔",
      headline: "不可靠叙述者的回归",
      body: [
        "在近期小说中，我们目睹了不可靠叙述者的惊人复兴——这种手法曾被认为已被后现代的戏谑所耗尽。今天的作家不再将其作为形式实验，而是作为一种伦理工具：质疑记忆如何建构身份，以及叙事本身如何成为一种生存方式。",
        "这一转变反映了在算法中介时代，人们对真实与本真的更广泛文化焦虑。当每一种叙事都可以被合成时，不可靠叙述者不再是文学噱头，而是一面镜子，映照出读者自身在意义建构中的共谋。",
      ],
    },
  },
  5: {
    en: {
      closing: "Read slowly.\nRead again.",
      note: "The Reading Room — Vol. XVIII — Summer 2026",
    },
    zh: {
      closing: "慢慢读。\n再读一遍。",
      note: "阅读之室 — 第十八卷 — 2026年夏",
    },
  },
};

// ─── Metadata ───────────────────────────────────────────────────────────────

export function getMetadata(lang: "en" | "zh"): StyleMetadata {
  const nameMap = { en: "Literary Review", zh: "文学评论" };
  const themeMap = {
    en: "Contemporary literature excerpts — journal typography with ornamental dividers and drop caps",
    zh: "当代文学节选——期刊排版风格，装饰分隔线与首字下沉",
  };
  const densityLabelMap = { en: "Reading-First", zh: "阅读优先" };

  const sceneTitles = {
    en: ["Masthead", "Fiction Excerpt", "Poetry", "Critical Essay", "Colophon"],
    zh: ["刊头", "小说节选", "诗歌", "评论随笔", "刊尾"],
  };

  const beatActions = {
    en: {
      1: ["Title and ornament appear"],
      2: ["Excerpt with drop cap", "Attribution fades in"],
      3: ["Poem title and author", "First stanza", "Second stanza"],
      4: ["Essay headline", "Body columns appear"],
      5: ["Closing statement"],
    },
    zh: {
      1: ["刊名与装饰呈现"],
      2: ["节选带首字下沉", "署名淡入"],
      3: ["诗题与作者", "第一节", "第二节"],
      4: ["评论标题", "正文栏呈现"],
      5: ["结语陈述"],
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
        beatTitle = content.label || "";
        beatBody = beatIdx >= 1 ? content.attribution || "" : content.text || "";
      } else if (id === 3) {
        beatTitle = content.poemTitle || "";
        beatBody = (content.stanzas || []).slice(0, beatIdx).join(" / ");
      } else if (id === 4) {
        beatTitle = content.headline || "";
        beatBody = beatIdx >= 1 ? (content.body?.[0] || "") : "";
      } else if (id === 5) {
        beatTitle = content.closing || "";
        beatBody = content.note || "";
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
    id: "18",
    band: "editorial-print",
    name: nameMap[lang],
    theme: themeMap[lang],
    densityLabel: densityLabelMap[lang],
    heroScene: 2,
    colors: {
      bg: "#faf6ee",
      ink: "#1a1a1a",
      panel: "#f0ead6",
    },
    typography: {
      header: "Playfair Display Italic",
      body: "Lora 400",
    },
    tags: [
      "literary",
      "journal",
      "serif",
      "ornamental",
      "cream",
      "poetry",
      "drop-cap",
      "editorial",
      "belles-lettres",
    ],
    fonts: ["Playfair Display", "Lora", "cjk:Noto Serif SC"],
    scenes,
  };
}

// ─── Transition constants ──────────────────────────────────────────────────

const TRANSITION_DURATION = 850; // ms — book spread turn 800ms + buffer
const BEAT_COUNTS: Record<number, number> = { 1: 1, 2: 2, 3: 3, 4: 2, 5: 1 };

// ─── Component ──────────────────────────────────────────────────────────────

export default function LiteraryReview({
  scene,
  beat,
  language,
  isThumbnail,
  reducedMotion,
  onNavigate,
  isTransitionClone,
}: BespokeStyleProps) {
  const [entered, setEntered] = useState(false);

  const [outgoingScene, setOutgoingScene] = useState<number | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const prevSceneRef = useRef<number>(scene);

  // Font injection
  useEffect(() => {
    const id = "style-18-fonts";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&family=Lora:ital,wght@0,400;0,600;1,400&family=Noto+Serif+SC:wght@400;700&display=swap";
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

  // Beat-level enter animation
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

  // ── Render scene content for a given scene number ────────────────────────

  const renderSceneFor = (sceneNum: number, beatNum: number) => {
    const c = SCENES[sceneNum]?.[language] || SCENES[1][language];

    if (sceneNum === 1) {
      return (
        <div className={styles.journalMasthead}>
          <div className={styles.journalOrnament}>
            <span className={styles.journalOrnamentLine} />
            <span className={styles.journalOrnamentSymbol}>&#10086;</span>
            <span className={styles.journalOrnamentLine} />
          </div>
          <h1 className={styles.journalTitle}>{c.title}</h1>
          <p className={styles.journalSubtitle}>{c.subtitle}</p>
          <p className={styles.journalVolume}>
            {language === "zh" ? "第十八卷 · 2026年夏" : "Vol. XVIII · Summer 2026"}
          </p>
        </div>
      );
    }

    if (sceneNum === 2) {
      return (
        <div className={styles.excerptContainer}>
          <p className={styles.excerptLabel}>{c.label}</p>
          <div className={styles.excerptDividerTop}>
            <span className={styles.excerptDividerDiamond} />
          </div>
          <p className={styles.excerptText}>{c.text}</p>
          {beatNum >= 1 && (
            <p
              className={styles.excerptAttribution}
              style={{
                opacity: entered ? 0.6 : 0,
                transition: reducedMotion
                  ? "none"
                  : "opacity 0.8s ease 0.3s",
              }}
            >
              {c.attribution}
            </p>
          )}
          <div className={styles.excerptDividerBottom} />
        </div>
      );
    }

    if (sceneNum === 3) {
      const stanzas = c.stanzas || [];
      return (
        <div className={styles.poemContainer}>
          <h2 className={styles.poemTitle}>{c.poemTitle}</h2>
          <p className={styles.poemAuthor}>{c.poemAuthor}</p>
          {stanzas.slice(0, beatNum).map((stanza, i) => (
            <p
              key={i}
              className={styles.poemStanza}
              style={{
                opacity: entered ? 1 : 0,
                transform: entered ? "none" : "translateY(1cqh)",
                transition: reducedMotion
                  ? "none"
                  : `opacity 0.6s ease ${i * 0.2}s, transform 0.6s ease ${i * 0.2}s`,
              }}
            >
              {stanza.split("\n").map((line, j) => (
                <React.Fragment key={j}>
                  {line}
                  {j < stanza.split("\n").length - 1 && <br />}
                </React.Fragment>
              ))}
            </p>
          ))}
        </div>
      );
    }

    if (sceneNum === 4) {
      return (
        <div className={styles.essayContainer}>
          <div className={styles.essayHeader}>
            <p className={styles.essayKicker}>{c.kicker}</p>
            <h2 className={styles.essayHeadline}>{c.headline}</h2>
          </div>
          {beatNum >= 1 && (
            <div
              className={styles.essayBody}
              style={{
                opacity: entered ? 1 : 0,
                transition: reducedMotion
                  ? "none"
                  : "opacity 0.6s ease 0.2s",
              }}
            >
              {(c.body || []).map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          )}
        </div>
      );
    }

    if (sceneNum === 5) {
      return (
        <div className={styles.colophonContainer}>
          <div className={styles.colophonOrnament}>
            <span className={styles.colophonSymbol}>&#10086;</span>
          </div>
          <p className={styles.colophonText}>
            {(c.closing || "").split("\n").map((line, i) => (
              <React.Fragment key={i}>
                {line}
                {i < (c.closing || "").split("\n").length - 1 && <br />}
              </React.Fragment>
            ))}
          </p>
          <p className={styles.colophonNote}>{c.note}</p>
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
              <span className={styles.navIndicatorDot} />
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
      {/* Outgoing scene (book spread turn exit) */}
      {outgoingScene !== null && (
        <div className={outgoingLayerClasses}>
          <div className={styles.track}>
            {renderSceneFor(outgoingScene, BEAT_COUNTS[outgoingScene] - 1)}
          </div>
        </div>
      )}

      {/* Incoming / current scene (book spread turn enter) */}
      <div className={incomingLayerClasses}>
        <div
          key={`18-${scene}`}
          className={styles.track}
          style={reducedMotion ? { animationDuration: "0s" } : undefined}
        >
          {renderSceneFor(scene, beat)}
        </div>
      </div>

      {renderNavIndicators()}
    </div>
  );
}

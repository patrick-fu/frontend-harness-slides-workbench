import React, { useLayoutEffect, useEffect, useCallback, useState, useRef } from "react";
import type { BespokeStyleProps, StyleMetadata } from "../types";
import styles from "./13-sticky-board.module.css";
import { useFLIP } from "../hooks/useFLIP";

// ─── Font Injection ────────────────────────────────────────────────────────

function useFonts() {
  useEffect(() => {
    const id = "style-13-fonts";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Caveat:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap";
    document.head.appendChild(link);
  }, []);
}

// ─── Content ────────────────────────────────────────────────────────────────

const SCENES = {
  1: {
    en: {
      title: "Design",
      titleAccent: "Thinking",
      title2: "Workshop",
      sub: "Where great ideas take shape through collaboration and empathy",
      tag: "Workshop in Progress",
    },
    zh: {
      title: "设计",
      titleAccent: "思维",
      title2: "工作坊",
      sub: "通过协作和共情，伟大创意在此成型",
      tag: "工作坊进行中",
    },
  },
  2: {
    en: {
      label: "Brainstorm",
      heading: "Ideas on the wall",
      notes: [
        { text: "Mobile-first onboarding", sub: "Reduce friction", color: "yellow" },
        { text: "AI-powered search", sub: "Natural language", color: "blue" },
        { text: "Gamification", sub: "Achievement badges", color: "pink" },
        { text: "Dark mode", sub: "User requested", color: "green" },
        { text: "Offline support", sub: "PWA capabilities", color: "orange" },
        { text: "Voice commands", sub: "Accessibility win", color: "purple" },
      ],
    },
    zh: {
      label: "头脑风暴",
      heading: "墙上的创意",
      notes: [
        { text: "移动优先引导", sub: "减少摩擦", color: "yellow" },
        { text: "AI 驱动搜索", sub: "自然语言", color: "blue" },
        { text: "游戏化", sub: "成就徽章", color: "pink" },
        { text: "深色模式", sub: "用户呼声", color: "green" },
        { text: "离线支持", sub: "PWA 能力", color: "orange" },
        { text: "语音指令", sub: "无障碍增强", color: "purple" },
      ],
    },
  },
  3: {
    en: {
      label: "Process",
      heading: "Three pillars of discovery",
      columns: [
        {
          phase: "Phase 01",
          title: "Empathize",
          color: "empathize",
          notes: [
            { text: "User interviews", color: "miniBlue" },
            { text: "Journey mapping", color: "miniYellow" },
            { text: "Persona building", color: "miniPink" },
          ],
        },
        {
          phase: "Phase 02",
          title: "Define",
          color: "define",
          notes: [
            { text: "Problem statement", color: "miniGreen" },
            { text: "How might we...", color: "miniOrange" },
            { text: "Insight synthesis", color: "miniPurple" },
          ],
        },
        {
          phase: "Phase 03",
          title: "Ideate",
          color: "ideate",
          notes: [
            { text: "Crazy 8s", color: "miniYellow" },
            { text: "Dot voting", color: "miniBlue" },
            { text: "Storyboarding", color: "miniGreen" },
          ],
        },
      ],
    },
    zh: {
      label: "流程",
      heading: "探索的三大支柱",
      columns: [
        {
          phase: "第一阶段",
          title: "共情",
          color: "empathize",
          notes: [
            { text: "用户访谈", color: "miniBlue" },
            { text: "旅程地图", color: "miniYellow" },
            { text: "人物画像", color: "miniPink" },
          ],
        },
        {
          phase: "第二阶段",
          title: "定义",
          color: "define",
          notes: [
            { text: "问题陈述", color: "miniGreen" },
            { text: "我们如何...", color: "miniOrange" },
            { text: "洞察综合", color: "miniPurple" },
          ],
        },
        {
          phase: "第三阶段",
          title: "构思",
          color: "ideate",
          notes: [
            { text: "疯狂 8 分钟", color: "miniYellow" },
            { text: "圆点投票", color: "miniBlue" },
            { text: "故事板", color: "miniGreen" },
          ],
        },
      ],
    },
  },
  4: {
    en: {
      label: "Prioritize",
      heading: "Team voting results",
      votes: [
        { text: "AI-powered search", votes: 12, color: "yellow" },
        { text: "Mobile-first onboarding", votes: 9, color: "blue" },
        { text: "Offline support", votes: 7, color: "orange" },
        { text: "Dark mode", votes: 5, color: "green" },
      ],
    },
    zh: {
      label: "优先级",
      heading: "团队投票结果",
      votes: [
        { text: "AI 驱动搜索", votes: 12, color: "yellow" },
        { text: "移动优先引导", votes: 9, color: "blue" },
        { text: "离线支持", votes: 7, color: "orange" },
        { text: "深色模式", votes: 5, color: "green" },
      ],
    },
  },
  5: {
    en: {
      text: "Great ideas <em>deserve</em> great execution.",
      sub: "From whiteboard to production — let's build.",
    },
    zh: {
      text: "好创意<em>值得</em>好执行。",
      sub: "从白板到产品——让我们开始构建。",
    },
  },
};

// ─── Helpers ────────────────────────────────────────────────────────────────

function noteColorClass(color: string) {
  const map: Record<string, string> = {
    yellow: styles.noteYellow,
    pink: styles.notePink,
    blue: styles.noteBlue,
    green: styles.noteGreen,
    orange: styles.noteOrange,
    purple: styles.notePurple,
  };
  return map[color] || styles.noteYellow;
}

function miniColorClass(color: string) {
  const map: Record<string, string> = {
    miniYellow: styles.miniYellow,
    miniPink: styles.miniPink,
    miniBlue: styles.miniBlue,
    miniGreen: styles.miniGreen,
    miniOrange: styles.miniOrange,
    miniPurple: styles.miniPurple,
  };
  return map[color] || styles.miniYellow;
}

// ─── Metadata ───────────────────────────────────────────────────────────────

export function getMetadata(lang: "en" | "zh"): StyleMetadata {
  const nameMap = { en: "Sticky Board", zh: "便签板" };
  const themeMap = {
    en: "Design Thinking Workshop — sticky note aesthetic on cork board with handwritten font, slight rotations, and pin dots",
    zh: "设计思维工作坊——软木板上的便签美学，手写字体、轻微旋转和图钉点缀",
  };
  const densityLabelMap = { en: "Playful", zh: "趣味型" };

  const sceneTitles = {
    en: ["Title", "Brainstorm", "Process Pillars", "Voting", "Closing"],
    zh: ["标题", "头脑风暴", "流程支柱", "投票", "结语"],
  };

  const beatActions = {
    en: {
      1: ["Title and tag appear"],
      2: ["Heading appears", "Notes 1-3 stick on", "Notes 4-6 stick on"],
      3: ["Column headers appear", "Column notes populate"],
      4: ["Title appears", "Vote rows reveal with dots"],
      5: ["Closing note pinned"],
    },
    zh: {
      1: ["标题和标签呈现"],
      2: ["标题呈现", "第 1-3 张便签贴上", "第 4-6 张便签贴上"],
      3: ["列标题呈现", "列便签填充"],
      4: ["标题呈现", "投票行和圆点揭示"],
      5: ["结语便签钉上"],
    },
  };

  const BEAT_COUNTS: Record<number, number> = { 1: 1, 2: 3, 3: 2, 4: 2, 5: 1 };

  const scenes = [1, 2, 3, 4, 5].map((id) => {
    const beatCount = BEAT_COUNTS[id];
    const actions = beatActions[lang][id as keyof (typeof beatActions)["en"]];
    const c = SCENES[id as keyof typeof SCENES][lang] as any;

    const beats = Array.from({ length: beatCount }, (_, beatIdx) => {
      let beatTitle = "";
      let beatBody = "";

      if (id === 1) {
        beatTitle = `${c.title} ${c.titleAccent} ${c.title2}`;
        beatBody = c.sub;
      } else if (id === 2) {
        beatTitle = c.heading;
        const notes = (c.notes as Array<{ text: string }>) || [];
        const visible = Math.min(beatIdx * 3, 6);
        beatBody = notes.slice(0, visible).map((n) => n.text).join(" / ");
      } else if (id === 3) {
        beatTitle = c.heading;
        if (beatIdx >= 1) {
          const cols = (c.columns as Array<{ title: string }>) || [];
          beatBody = cols.map((col) => col.title).join(" / ");
        }
      } else if (id === 4) {
        beatTitle = c.heading;
        if (beatIdx >= 1) {
          const votes = (c.votes as Array<{ text: string; votes: number }>) || [];
          beatBody = votes.map((v) => `${v.text} (${v.votes})`).join(" / ");
        }
      } else if (id === 5) {
        beatTitle = c.text.replace(/<[^>]+>/g, "");
        beatBody = c.sub;
      }

      return { id: beatIdx, action: actions[beatIdx], title: beatTitle, body: beatBody };
    });

    return { id, title: sceneTitles[lang][id - 1], beats };
  });

  return {
    id: "13",
    band: "balanced-hybrid",
    name: nameMap[lang],
    theme: themeMap[lang],
    densityLabel: densityLabelMap[lang],
    heroScene: 2,
    colors: { bg: "#d4a574", ink: "#2d2d2d", panel: "#fff9c4" },
    typography: { header: "Caveat 700", body: "Inter 400" },
    tags: ["sticky", "workshop", "brainstorm", "design-thinking", "playful", "handwritten", "cork", "collaborative", "creative"],
    fonts: ["Caveat", "Inter"],
    scenes,
  };
}

// ─── Transition constants ─────────────────────────────────────────────────

const TRANSITION_DURATION = 500; // ms — peel 400ms + slap 350ms with overlap
const BEAT_COUNTS: Record<number, number> = { 1: 1, 2: 3, 3: 2, 4: 2, 5: 1 };

// ─── Component ──────────────────────────────────────────────────────────────

export default function StickyBoard({
  scene, beat, language, isThumbnail, reducedMotion, onNavigate, isTransitionClone,
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

  // FLIP for sticky notes board (scene 2) — notes reposition as new ones appear
  const { ref: notesBoardRef } = useFLIP<HTMLDivElement>({
    watch: [beat],
    duration: 400,
    easing: "cubic-bezier(0.34, 1.56, 0.64, 1)",
    selector: ".stickyNote",
  });

  // FLIP for columns area (scene 3) — mini notes push layout
  const { ref: columnsBoardRef } = useFLIP<HTMLDivElement>({
    watch: [beat],
    duration: 400,
    easing: "cubic-bezier(0.34, 1.56, 0.64, 1)",
    selector: ".dtMiniNote",
  });

  const handleNavClick = useCallback(
    (e: React.MouseEvent, targetScene: number) => {
      e.stopPropagation();
      onNavigate?.(targetScene, 0);
    },
    [onNavigate],
  );

  const rootClasses = [styles.root, reducedMotion ? styles.reducedMotion : "", isThumbnail ? styles.thumbnail : ""].filter(Boolean).join(" ");

  const renderSceneFor = (sceneNum: number, beatNum: number, isCurrent: boolean) => {
    const c = SCENES[sceneNum as keyof typeof SCENES]?.[language as "en" | "zh"];
    if (!c) return null;

    if (sceneNum === 1) {
      const data = c as typeof SCENES[1]["en"];
      return (
        <div className={styles.scene1}>
          <h1 className={styles.boardTitle}>
            {data.title} <em>{data.titleAccent}</em><br />{data.title2}
          </h1>
          <p className={styles.boardSub}>{data.sub}</p>
          <span className={styles.boardTag}>{data.tag}</span>
        </div>
      );
    }

    if (sceneNum === 2) {
      const data = c as typeof SCENES[2]["en"];
      const notes = data.notes as Array<{ text: string; sub: string; color: string }>;
      const visibleCount = beatNum === 0 ? 0 : beatNum === 1 ? 3 : 6;
      return (
        <div className={styles.scene2}>
          <div className={styles.boardHeader}>
            <span className={styles.boardLabel}>{data.label}</span>
            <h2 className={styles.boardHeading}>{data.heading}</h2>
          </div>
          <div
            ref={isCurrent ? notesBoardRef : undefined}
            className={styles.notesArea}
          >
            {notes.map((note, i) => {
              const visible = i < visibleCount;
              const cls = [
                styles.stickyNote,
                noteColorClass(note.color),
                visible ? styles.stickyNoteVisible : "",
              ].filter(Boolean).join(" ");
              return (
                <div
                  key={i}
                  className={cls}
                  style={reducedMotion ? { opacity: visible ? 1 : 0, transform: visible ? undefined : "scale(0.7)" } : { transitionDelay: `${i * 0.1}s` }}
                >
                  <div className={styles.pinDot} />
                  <span className={styles.noteText}>{note.text}</span>
                  <span className={styles.noteSub}>{note.sub}</span>
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    if (sceneNum === 3) {
      const data = c as typeof SCENES[3]["en"];
      const columns = data.columns as Array<{ phase: string; title: string; color: string; notes: Array<{ text: string; color: string }> }>;
      return (
        <div className={styles.scene3}>
          <div className={styles.boardHeader}>
            <span className={styles.boardLabel}>{data.label}</span>
            <h2 className={styles.boardHeading}>{data.heading}</h2>
          </div>
          <div
            ref={isCurrent ? columnsBoardRef : undefined}
            className={styles.columnsArea}
          >
            {columns.map((col, ci) => (
              <div key={ci} className={styles.dtColumn}>
                <div className={[styles.dtColHeader, styles[col.color]].join(" ")}>
                  <span className={styles.dtColNum}>{col.phase}</span>
                  <span className={styles.dtColTitle}>{col.title}</span>
                </div>
                {col.notes.map((note, ni) => {
                  const visible = beatNum >= 1;
                  const cls = [
                    styles.dtMiniNote,
                    miniColorClass(note.color),
                    visible ? styles.dtMiniNoteVisible : "",
                  ].filter(Boolean).join(" ");
                  return (
                    <div
                      key={ni}
                      className={cls}
                      style={reducedMotion ? { opacity: visible ? 1 : 0, transform: "none" } : { transitionDelay: `${ci * 0.15 + ni * 0.1}s` }}
                    >
                      {note.text}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (sceneNum === 4) {
      const data = c as typeof SCENES[4]["en"];
      const votes = data.votes as Array<{ text: string; votes: number; color: string }>;
      return (
        <div className={styles.scene4}>
          <div className={styles.boardHeader}>
            <span className={styles.boardLabel}>{data.label}</span>
            <h2 className={styles.boardHeading}>{data.heading}</h2>
          </div>
          <div className={styles.voteArea}>
            {votes.map((v, i) => {
              const visible = beatNum >= 1;
              const cls = [styles.voteRow, visible ? styles.voteRowVisible : ""].filter(Boolean).join(" ");
              return (
                <div
                  key={i}
                  className={cls}
                  style={reducedMotion ? { opacity: visible ? 1 : 0, transform: "none" } : { transitionDelay: `${i * 0.12}s` }}
                >
                  <div className={[styles.voteNote, noteColorClass(v.color)].join(" ")} style={{ transform: `rotate(${(i % 2 === 0 ? -1 : 1) * 1.5}deg)` }}>
                    <div className={styles.pinDot} />
                    {v.text}
                  </div>
                  <div className={styles.voteDots}>
                    {Array.from({ length: Math.min(v.votes, 8) }, (_, di) => (
                      <div key={di} className={styles.voteDot}>{di === 0 ? v.votes : ""}</div>
                    ))}
                  </div>
                  <span className={styles.voteCount}>{v.votes} {language === "zh" ? "票" : "votes"}</span>
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    if (sceneNum === 5) {
      const data = c as typeof SCENES[5]["en"];
      return (
        <div className={styles.scene5}>
          <div className={styles.closingNote}>
            <div className={styles.closingPin} />
            <h2 className={styles.closingNoteText} dangerouslySetInnerHTML={{ __html: data.text }} />
            <p className={styles.closingNoteSub}>{data.sub}</p>
          </div>
        </div>
      );
    }

    return null;
  };

  const renderNav = () => {
    if (isThumbnail) return null;
    const tabColors = ["yellow", "pink", "blue", "green", "orange"];
    const rotations = [-2, 1.5, -1, 2, -1.5];
    return (
      <nav className={styles.sideNav} aria-label="Scene navigation">
        {[1, 2, 3, 4, 5].map((s, i) => {
          const isActive = s === scene;
          return (
            <button
              key={s}
              type="button"
              className={[
                styles.sideNavTab,
                noteColorClass(tabColors[i]),
                isActive ? styles.sideNavTabActive : "",
              ].filter(Boolean).join(" ")}
              style={{
                transform: `rotate(${rotations[i]}deg)`,
                ...(reducedMotion ? { transitionDuration: "0s" } : {}),
              }}
              aria-label={`Jump to scene ${s}`}
              onClick={(e) => handleNavClick(e, s)}
            >
              <div className={styles.sideNavPin} />
              <span className={styles.sideNavNum}>{s}</span>
            </button>
          );
        })}
      </nav>
    );
  };

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
      {/* Outgoing scene (peel-off exit animation) */}
      {outgoingScene !== null && (
        <div className={outgoingLayerClasses}>
          <div className={styles.track}>
            {renderSceneFor(outgoingScene, BEAT_COUNTS[outgoingScene] - 1, false)}
          </div>
        </div>
      )}

      {/* Incoming / current scene (slap-down enter animation) */}
      <div className={incomingLayerClasses}>
        <div className={styles.track}>
          {renderSceneFor(scene, beat, true)}
        </div>
      </div>

      {renderNav()}
    </div>
  );
}

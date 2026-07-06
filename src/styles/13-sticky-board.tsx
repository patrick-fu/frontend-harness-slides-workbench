import React, { useEffect, useCallback } from "react";
import type { BespokeStyleProps, StyleMetadata } from "../types";
import SpatialSceneTrack from "./SpatialSceneTrack";
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
      "https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap";
    document.head.appendChild(link);
  }, []);
}

// ─── Content ────────────────────────────────────────────────────────────────

const SCENES = {
  1: {
    en: {
      title: "Kitchen",
      titleAccent: "Prep",
      title2: "Station",
      sub: "Where raw ingredients become something delicious — organized, hands-on, and ready to go",
      tag: "Prep in Progress",
    },
    zh: {
      title: "厨房",
      titleAccent: "备料",
      title2: "工作台",
      sub: "原始食材在此变成美味——有条理、亲自动手、随时就绪",
      tag: "备料进行中",
    },
  },
  2: {
    en: {
      label: "Ingredients",
      heading: "Everything laid out",
      notes: [
        { text: "Fresh Vegetables", sub: "Washed and trimmed", color: "yellow" },
        { text: "Quality Proteins", sub: "Sourced this morning", color: "terracotta" },
        { text: "Aromatic Herbs", sub: "Basil, thyme, rosemary", color: "green" },
        { text: "Rich Spices", sub: "Ground to order", color: "orange" },
        { text: "Creamy Dairy", sub: "From local farms", color: "cream" },
        { text: "Citrus Zest", sub: "Bright finishing touch", color: "pink" },
      ],
    },
    zh: {
      label: "食材",
      heading: "一切就绪",
      notes: [
        { text: "新鲜蔬菜", sub: "清洗并修剪", color: "yellow" },
        { text: "优质蛋白", sub: "今早采购", color: "terracotta" },
        { text: "芳香香草", sub: "罗勒、百里香、迷迭香", color: "green" },
        { text: "浓郁香料", sub: "现磨现用", color: "orange" },
        { text: "醇厚乳品", sub: "来自本地农场", color: "cream" },
        { text: "柑橘皮屑", sub: "明亮的收尾", color: "pink" },
      ],
    },
  },
  3: {
    en: {
      label: "Prep Stations",
      heading: "Three stages of readiness",
      columns: [
        {
          phase: "Station 01",
          title: "Wash & Sort",
          color: "empathize",
          notes: [
            { text: "Rinse greens", color: "miniGreen" },
            { text: "Sort by ripeness", color: "miniYellow" },
            { text: "Pat dry", color: "miniCream" },
          ],
        },
        {
          phase: "Station 02",
          title: "Chop & Measure",
          color: "define",
          notes: [
            { text: "Uniform dice", color: "miniTerracotta" },
            { text: "Weigh portions", color: "miniOrange" },
            { text: "Mise en place", color: "miniPink" },
          ],
        },
        {
          phase: "Station 03",
          title: "Cook & Finish",
          color: "ideate",
          notes: [
            { text: "Heat to temp", color: "miniOrange" },
            { text: "Layer flavors", color: "miniGreen" },
            { text: "Plate with care", color: "miniYellow" },
          ],
        },
      ],
    },
    zh: {
      label: "备料台",
      heading: "就绪的三个阶段",
      columns: [
        {
          phase: "一号台",
          title: "清洗与分类",
          color: "empathize",
          notes: [
            { text: "冲洗绿叶菜", color: "miniGreen" },
            { text: "按成熟度分类", color: "miniYellow" },
            { text: "轻轻拍干", color: "miniCream" },
          ],
        },
        {
          phase: "二号台",
          title: "切配与称量",
          color: "define",
          notes: [
            { text: "均匀切丁", color: "miniTerracotta" },
            { text: "称量分量", color: "miniOrange" },
            { text: "备料就位", color: "miniPink" },
          ],
        },
        {
          phase: "三号台",
          title: "烹饪与装盘",
          color: "ideate",
          notes: [
            { text: "加热至适宜温度", color: "miniOrange" },
            { text: "分层调味", color: "miniGreen" },
            { text: "用心装盘", color: "miniYellow" },
          ],
        },
      ],
    },
  },
  4: {
    en: {
      label: "Taste Test",
      heading: "Quality check results",
      votes: [
        { text: "Flavor Balance", votes: 12, color: "terracotta" },
        { text: "Texture & Mouthfeel", votes: 9, color: "green" },
        { text: "Presentation", votes: 7, color: "cream" },
        { text: "Aroma", votes: 5, color: "orange" },
      ],
    },
    zh: {
      label: "品鉴",
      heading: "质量检查结果",
      votes: [
        { text: "风味平衡", votes: 12, color: "terracotta" },
        { text: "口感质地", votes: 9, color: "green" },
        { text: "呈现摆盘", votes: 7, color: "cream" },
        { text: "香气", votes: 5, color: "orange" },
      ],
    },
  },
  5: {
    en: {
      text: "Good ingredients <em>deserve</em> good preparation.",
      sub: "From raw to ready — let's serve.",
    },
    zh: {
      text: "好食材<em>值得</em>好备料。",
      sub: "从原始到就绪——让我们上菜。",
    },
  },
};

// ─── Helpers ────────────────────────────────────────────────────────────────

function noteColorClass(color: string) {
  const map: Record<string, string> = {
    yellow: styles.noteYellow,
    pink: styles.notePink,
    terracotta: styles.noteTerracotta,
    green: styles.noteGreen,
    orange: styles.noteOrange,
    cream: styles.noteCream,
  };
  return map[color] || styles.noteYellow;
}

function miniColorClass(color: string) {
  const map: Record<string, string> = {
    miniYellow: styles.miniYellow,
    miniPink: styles.miniPink,
    miniTerracotta: styles.miniTerracotta,
    miniGreen: styles.miniGreen,
    miniOrange: styles.miniOrange,
    miniCream: styles.miniCream,
  };
  return map[color] || styles.miniYellow;
}

// ─── Metadata ───────────────────────────────────────────────────────────────

export function getMetadata(lang: "en" | "zh"): StyleMetadata {
  const nameMap = { en: "Kitchen Prep Station", zh: "厨房备料台" };
  const themeMap = {
    en: "Warm orange-tinted cream counter with earthy kitchen accents — terracotta, wood browns, and herb greens. Shows raw-to-clean transformation through hands-on prep stations. Best for process, ingredient-to-outcome, and craft narratives.",
    zh: "暖橙色奶油台面配大地色厨房点缀——陶土红、木棕色和香草绿。通过亲自动手的备料台展示从原始到精致的转变。最适合流程、食材到成品和工艺叙事。",
  };
  const densityLabelMap = { en: "Hands-on", zh: "动手型" };

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
    colors: { bg: "#fdf2e5", ink: "#3d2b1f", panel: "#fff8ee" },
    typography: { header: "Nunito 700", body: "Nunito 400" },
    tags: ["kitchen", "prep", "transformation", "raw-to-clean", "warm", "hands-on", "ingredients", "process", "craft"],
    fonts: ["Nunito"],
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

export default function StickyBoard({
  scene, beat, language, isThumbnail, reducedMotion, onNavigate, }: BespokeStyleProps) {
  useFonts();

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
    const tabColors = ["yellow", "terracotta", "cream", "green", "orange"];
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

  return (
    <div className={rootClasses}>
            <SpatialSceneTrack
        scene={scene}
        beat={beat}
        axis="x"
        reducedMotion={reducedMotion || isThumbnail}
        beatLayoutModes={BEAT_LAYOUT_MODES}
        renderScene={(sceneId, sceneBeat, isActive) => (
          <div className={styles.sceneLayer}>
            <div className={styles.track}>
              {renderSceneFor(sceneId, sceneBeat, isActive)}
            </div>
          </div>
        )}
      />

      {renderNav()}
    </div>
  );
}

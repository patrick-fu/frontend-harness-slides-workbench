import React, { useEffect, useCallback } from "react";
import {
  defineTopic,
  type TopicDefinition,
  type TopicMetadata,
  type TopicStageProps,
} from "../domain/topic";
import SpatialSceneTrack from "../styles/SpatialSceneTrack";
import styles from "./workshop-board.module.css";

// ─── Transition constants ─────────────────────────────────────────────────

// ─── Font Injection ────────────────────────────────────────────────────────

function useFonts() {
  useEffect(() => {
    const id = "workshop-board-fonts";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Caveat:wght@400;500;600;700&family=Inter:wght@300;400;500;600&display=swap";
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
    principles?: Array<{ num: string; title: string; desc: string; emoji: string; color: string }>;
    dataLabel?: string;
    dataPoints?: Array<{ value: string; sup?: string; label: string; emoji: string }>;
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
    principles?: Array<{ num: string; title: string; desc: string; emoji: string; color: string }>;
    dataLabel?: string;
    dataPoints?: Array<{ value: string; sup?: string; label: string; emoji: string }>;
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
      eyebrow: "Workshop Session  /  Sprint 14",
      title: "Let’s",
      titleItalic: "Figure This Out",
      subtitle:
        "A collaborative whiteboard session — where messy ideas become clear plans and everyone gets a marker",
      meta: [
        { label: "Room", value: "Studio B" },
        { label: "People", value: "7" },
        { label: "Time", value: "90 min" },
      ],
    },
    zh: {
      eyebrow: "工作坊  /  第 14 次冲刺",
      title: "一起",
      titleItalic: "想清楚",
      subtitle:
        "一次协作白板会议——混乱的想法如何变成清晰的计划，每个人都有一支笔",
      meta: [
        { label: "房间", value: "B 工作室" },
        { label: "人数", value: "7" },
        { label: "时长", value: "90 分钟" },
      ],
    },
  },
  2: {
    en: {
      chapter: "Question",
      thesis: "What if we stopped planning,",
      thesisItalic: "and started making?",
      thesisNote:
        "The best solutions emerge from doing, not from debating. Every sketch on this board is a hypothesis waiting to be tested.",
    },
    zh: {
      chapter: "问题",
      thesis: "如果我们停止计划，",
      thesisItalic: "开始动手呢？",
      thesisNote:
        "最好的解决方案来自行动，而非辩论。这块板上的每一张草图都是等待检验的假设。",
    },
  },
  3: {
    en: {
      principlesTitle: "How We Work Together",
      principlesYear: "Sprint 14",
      principles: [
        {
          num: "01",
          title: "Build Out Loud",
          desc: "Think by sketching. Say it, draw it, pin it up. If it’s not on the board, it doesn’t exist yet.",
          emoji: "✍️",
          color: "yellow",
        },
        {
          num: "02",
          title: "Embrace Mess",
          desc: "The first idea is rarely the best. Fill the board before editing. Quantity reveals quality.",
          emoji: "🧪",
          color: "blue",
        },
        {
          num: "03",
          title: "Connect, Don’t Collect",
          desc: "Draw lines between ideas. The space between notes is where insight lives.",
          emoji: "🔗",
          color: "red",
        },
        {
          num: "04",
          title: "Everyone Writes",
          desc: "Hierarchy has no place at the whiteboard. The best idea can come from anywhere.",
          emoji: "👥",
          color: "yellow",
        },
      ],
    },
    zh: {
      principlesTitle: "我们如何协作",
      principlesYear: "第 14 次冲刺",
      principles: [
        {
          num: "01",
          title: "大声构建",
          desc: "通过草图思考。说出来，画出来，贴上去。不在板上的东西就不存在。",
          emoji: "✍️",
          color: "yellow",
        },
        {
          num: "02",
          title: "拥抱混乱",
          desc: "第一个想法很少是最好的。先填满板子再编辑。数量揭示质量。",
          emoji: "🧪",
          color: "blue",
        },
        {
          num: "03",
          title: "连接，而非收集",
          desc: "在想法之间画线。笔记之间的空间是洞察所在。",
          emoji: "🔗",
          color: "red",
        },
        {
          num: "04",
          title: "人人动笔",
          desc: "白板面前没有层级。最好的想法可以来自任何地方。",
          emoji: "👥",
          color: "yellow",
        },
      ],
    },
  },
  4: {
    en: {
      dataLabel: "Session Output",
      dataPoints: [
        { value: "47", label: "Ideas Generated", emoji: "💡" },
        { value: "23", label: "Connections Made", emoji: "🔗" },
        { value: "8", label: "Action Items", emoji: "✅" },
      ],
      dataFootnote: "Not bad for 90 minutes.",
    },
    zh: {
      dataLabel: "会议产出",
      dataPoints: [
        { value: "47", label: "产生的想法", emoji: "💡" },
        { value: "23", label: "建立的连接", emoji: "🔗" },
        { value: "8", label: "行动项", emoji: "✅" },
      ],
      dataFootnote: "90 分钟，还不错。",
    },
  },
  5: {
    en: {
      closingMark: "End of Session",
      closing: "The board doesn’t lie.",
      closingItalic: "It just shows what we’re thinking.",
      closingSig: "Workshop Series  ·  Sprint 14  ·  Open",
    },
    zh: {
      closingMark: "会议结束",
      closing: "白板不会说谎。",
      closingItalic: "它只是展示我们在想什么。",
      closingSig: "工作坊系列  ·  第 14 次冲刺  ·  开放",
    },
  },
};

// ─── Metadata ───────────────────────────────────────────────────────────────

function buildMetadata(lang: "en" | "zh"): TopicMetadata {
  const themeMap = {
    en: "A warm in-progress workshop whiteboard — hand-drawn marks, sticky notes, and emoji actors making collaboration feel human and unfinished in the best way",
    zh: "一块温暖的进行中工作坊白板——手绘标记、便利贴和表情角色，让协作以最好的方式感觉人性化和未完成",
  };
  const densityLabelMap = { en: "Workshop", zh: "工作坊" };

  const sceneTitles = {
    en: ["Title", "Framing Question", "Collab Principles", "Session Output", "Closing"],
    zh: ["标题", "框架问题", "协作原则", "会议产出", "结语"],
  };

  const beatActions = {
    en: {
      1: ["Title and session meta appear"],
      2: ["Question posed", "Supporting note sketches in"],
      3: ["Principles 1-2 pinned up", "Principles 3-4 pinned up"],
      4: ["Label appears", "Output metrics stick on"],
      5: ["Closing takeaway"],
    },
    zh: {
      1: ["标题和会议元数据呈现"],
      2: ["问题提出", "支撑说明手绘入"],
      3: ["原则 1-2 贴上", "原则 3-4 贴上"],
      4: ["标签呈现", "产出指标贴上"],
      5: ["结语收获"],
    },
  };

  const BEAT_COUNTS_META: Record<number, number> = {
    1: 1,
    2: 2,
    3: 2,
    4: 2,
    5: 1,
  };

  const scenes = [1, 2, 3, 4, 5].map((id) => {
    const beatCount = BEAT_COUNTS_META[id];
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
        beatBody = visible.map((p) => `${p.emoji} ${p.title}`).join(" / ");
      } else if (id === 4) {
        beatTitle = c.dataLabel || "";
        if (beatIdx >= 1) {
          beatBody = (c.dataPoints || []).map((d) => `${d.emoji} ${d.value} ${d.label}`).join(" / ");
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
    theme: themeMap[lang],
    densityLabel: densityLabelMap[lang],
    heroScene: 3,
    colors: {
      bg: "#f7f2e8",
      ink: "#4a4540",
      panel: "#ede7d9",
    },
    typography: {
      header: "Caveat 600",
      body: "Inter 400",
    },
    tags: [
      "sketch-board",
      "whiteboard",
      "workshop",
      "hand-drawn",
      "sticky-notes",
      "collaborative",
      "emoji",
      "warm-paper",
      "informal",
    ],
    fonts: ["Caveat", "Inter"],
    scenes,
  };
}

const METADATA = {
  en: buildMetadata("en"),
  zh: buildMetadata("zh"),
} satisfies TopicDefinition["metadata"];

const TRANSITION_SCORE = {
  "1->2": "scale-fade",
  "2->3": "scale-fade",
  "3->4": "scale-fade",
  "4->5": "scale-fade",
} as const satisfies TopicDefinition["transitionScore"];

const NAVIGATION = {
  geometry: "edge-scale",
  carrier: "workshop-scene-ticks",
  invocation: "persistent",
  feedback: "mechanical-displacement",
} as const satisfies TopicDefinition["navigation"];

const EVIDENCE = {
  kind: "illustrative",
  boundary: {
    en: "Illustrative workshop scenario: the participants, session figures, and outcomes are presentation examples rather than externally measured results.",
    zh: "示例工作坊场景：参与者、会议数字与产出均为演示内容，并非外部实测结果。",
  },
  display: "envelope",
} as const satisfies TopicDefinition["evidence"];

// ─── Component ──────────────────────────────────────────────────────────────

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
  useFonts();

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

  // ── Scene renderers ─────────────────────────────────────────────────────

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
              styles[`sticky${p.color.charAt(0).toUpperCase() + p.color.slice(1)}`],
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
                <span className={styles.stickyEmoji}>{p.emoji}</span>
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
              styles.stickyYellow,
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
                  <span className={styles.dataEmoji}>{dp.emoji}</span>
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
      <nav
        className={styles.sideNav}
        aria-label="Scene navigation"
        data-topic-navigation="true"
        data-navigation-geometry={NAVIGATION.geometry}
        data-navigation-carrier={NAVIGATION.carrier}
        data-navigation-invocation={NAVIGATION.invocation}
        data-navigation-feedback={NAVIGATION.feedback}
      >
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

  return (
    <div
      className={rootClasses}
      lang={language}
      data-style-id="sketch-board-emoji"
      data-topic-id="workshop-board"
      data-motion={reducedMotion || isThumbnail ? "off" : "on"}
    >
      {/* Paper texture overlay */}
      <div className={styles.paperTexture} aria-hidden="true" />

            <SpatialSceneTrack
        scene={scene}
        beat={beat}
        transitionKind="scale-fade"
        transitionMap={TRANSITION_SCORE}
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

      {renderNav()}
    </div>
  );
}

export default defineTopic({
  id: "workshop-board",
  styleId: "sketch-board-emoji",
  title: { en: "Workshop Board", zh: "工作坊" },
  modelId: "Doubao-Seed-Evolving",
  Stage: TopicStage,
  metadata: METADATA,
  navigation: NAVIGATION,
  transitionScore: TRANSITION_SCORE,
  evidence: EVIDENCE,
});

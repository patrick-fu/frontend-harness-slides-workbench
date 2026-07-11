import React, { useEffect } from "react";
import {
  defineTopic,
  type TopicDefinition,
  type TopicMetadata,
  type TopicStageProps,
  type TopicTransitionScore,
} from "../domain/topic";
import SpatialSceneTrack, {
  type BeatLayoutMode,
} from "../components/stage/SpatialSceneTrack";

type Lang = "en" | "zh";
type SceneId = 1 | 2 | 3 | 4 | 5;

interface BeatCopy {
  id: number;
  action: string;
  title: string;
  body: string;
}

interface FeatureSceneCopy {
  nav: string;
  chapter: string;
  kicker: string;
  title: string;
  dek: string;
  pullQuote: string;
  sidebarTitle: string;
  sidebar: string[];
  notes: string[];
  beats: BeatCopy[];
}

const SCENE_IDS: SceneId[] = [1, 2, 3, 4, 5];

const TRANSITION_MAP = {
  "1->2": "fade",
  "2->3": "slide-y",
  "3->4": "scale-fade",
  "4->5": "page-flip",
} as const satisfies TopicTransitionScore;

const BEAT_LAYOUT_MODES: Partial<Record<number, BeatLayoutMode>> = {
  1: "reserved",
  2: "reserved",
  3: "reserved",
  4: "reserved",
  5: "reserved",
};

const ACCENTS: Record<SceneId, string> = {
  1: "#9aa67b",
  2: "#b9ad82",
  3: "#d5bd58",
  4: "#d7a999",
  5: "#8f9b72",
};

const PAPER = "#f7f0df";
const PANEL = "#fbf6e8";
const INK = "#3d3027";
const MUTED_INK = "#7b6f61";
const RULE = "rgba(61, 48, 39, 0.26)";

const SCENES: Record<SceneId, Record<Lang, FeatureSceneCopy>> = {
  1: {
    en: {
      nav: "Opener",
      chapter: "Opening page",
      kicker: "Monday, after the first repair",
      title: "Notes from a Useful Week",
      dek: "The useful part was not the filled calendar. It was the small choice that left Friday lighter than Monday.",
      pullQuote: "A week becomes useful when it leaves one fewer loose end.",
      sidebarTitle: "Margin notes",
      sidebar: ["one repair", "one clear refusal", "one sentence kept"],
      notes: [
        "A quiet opening",
        "The calendar thins",
        "The page finds its line",
      ],
      beats: [
        {
          id: 0,
          action: "Open the feature spread",
          title: "Notes from a Useful Week",
          body: "A warm editorial opener sets the reading pace.",
        },
        {
          id: 1,
          action: "Reveal the margin notes",
          title: "Three small repairs",
          body: "Reserved slots disclose what made the week useful.",
        },
        {
          id: 2,
          action: "Hold the first pull quote",
          title: "One fewer loose end",
          body: "The opening claim settles into a quiet pull quote.",
        },
      ],
    },
    zh: {
      nav: "开篇",
      chapter: "开篇页",
      kicker: "周一，第一处修补之后",
      title: "有用一周的札记",
      dek: "真正有用的，不是被填满的日程。是那个让周五比周一更轻的小选择。",
      pullQuote: "一周之所以有用，是因为它少留下了一个未了结的尾巴。",
      sidebarTitle: "页边札记",
      sidebar: ["一次修补", "一次清楚拒绝", "一句留下的话"],
      notes: ["安静开场", "日程变薄", "页面找到主线"],
      beats: [
        {
          id: 0,
          action: "打开特写版面",
          title: "有用一周的札记",
          body: "暖调编辑页建立缓慢阅读节奏。",
        },
        {
          id: 1,
          action: "显露页边札记",
          title: "三个小修补",
          body: "预留槽位依次说明这一周为何有用。",
        },
        {
          id: 2,
          action: "停在第一句引文",
          title: "少一个尾巴",
          body: "开场判断落成安静的引句。",
        },
      ],
    },
  },
  2: {
    en: {
      nav: "Interview",
      chapter: "Interview",
      kicker: "Wednesday, a second question",
      title: "The answer improved when the question got smaller",
      dek: "The interview did not need a louder opinion. It needed a narrower doorway.",
      pullQuote:
        "What would be different by Friday if this were already working?",
      sidebarTitle: "Transcript cuts",
      sidebar: ["kept the pause", "cut the defense", "asked for evidence"],
      notes: [
        "Q: What changed?",
        "A: The room stopped performing.",
        "Q: What stayed?",
      ],
      beats: [
        {
          id: 0,
          action: "Set up the interview spread",
          title: "The second question",
          body: "A portrait and interview column establish the feature rhythm.",
        },
        {
          id: 1,
          action: "Reveal transcript cuts",
          title: "Transcript cuts",
          body: "Three edited notes appear without shifting the page.",
        },
        {
          id: 2,
          action: "Surface the interview question",
          title: "The useful question",
          body: "The pull quote becomes the interview hinge.",
        },
      ],
    },
    zh: {
      nav: "访谈",
      chapter: "访谈",
      kicker: "周三，第二个问题",
      title: "问题变小之后，答案才变好",
      dek: "这场访谈不需要更响亮的意见。它只需要一扇更窄的门。",
      pullQuote: "如果它已经开始奏效，周五会有什么不同？",
      sidebarTitle: "访谈删节",
      sidebar: ["留下停顿", "剪掉辩解", "追问证据"],
      notes: ["问：什么变了？", "答：房间不再表演。", "问：什么留下了？"],
      beats: [
        {
          id: 0,
          action: "建立访谈版面",
          title: "第二个问题",
          body: "肖像与访谈栏建立特写节奏。",
        },
        {
          id: 1,
          action: "显露访谈删节",
          title: "访谈删节",
          body: "三条编辑札记出现，但不推动版面。",
        },
        {
          id: 2,
          action: "浮出关键问题",
          title: "有用的问题",
          body: "引句成为访谈的转轴。",
        },
      ],
    },
  },
  3: {
    en: {
      nav: "Detail",
      chapter: "Scene detail",
      kicker: "Thursday, 4:17 in the quiet room",
      title: "The useful moment looked almost too small to keep",
      dek: "A cup cooled, a notebook stayed open, and the room finally stopped trying to win the paragraph.",
      pullQuote: "The detail mattered because nobody rushed to explain it.",
      sidebarTitle: "Objects on the table",
      sidebar: ["cooled tea", "open notebook", "one copied line"],
      notes: [
        "The table went quiet",
        "The note kept its rough edge",
        "A small arrow changed the plan",
      ],
      beats: [
        {
          id: 0,
          action: "Place the scene detail",
          title: "A quiet room",
          body: "The layout shifts to an object-led magazine detail.",
        },
        {
          id: 1,
          action: "Reveal table objects",
          title: "Objects on the table",
          body: "Reserved object captions build the scene without crowding it.",
        },
        {
          id: 2,
          action: "Add the observation",
          title: "No rush to explain",
          body: "The detail resolves into the feature observation.",
        },
      ],
    },
    zh: {
      nav: "现场",
      chapter: "现场细节",
      kicker: "周四，安静房间里的 4:17",
      title: "那个有用的瞬间，小到几乎会被删掉",
      dek: "茶杯变凉，笔记本摊开，房间终于不再急着赢下那一段话。",
      pullQuote: "这个细节之所以重要，是因为没人急着解释它。",
      sidebarTitle: "桌上的物件",
      sidebar: ["变凉的茶", "摊开的本子", "抄下的一行"],
      notes: ["桌面安静下来", "笔记保留毛边", "一个小箭头改了计划"],
      beats: [
        {
          id: 0,
          action: "放置现场细节",
          title: "安静房间",
          body: "版面转向由物件引出的杂志细节。",
        },
        {
          id: 1,
          action: "显露桌面物件",
          title: "桌上的物件",
          body: "预留物件说明建立现场，但不挤压页面。",
        },
        {
          id: 2,
          action: "加入观察",
          title: "不急着解释",
          body: "细节落成这篇特写的观察。",
        },
      ],
    },
  },
  4: {
    en: {
      nav: "Lesson",
      chapter: "Lesson",
      kicker: "Friday, the edit that held",
      title: "Usefulness arrived as an edit, not a breakthrough",
      dek: "Nothing dramatic happened. Three sentences moved, one meeting disappeared, and the week made room for its own evidence.",
      pullQuote:
        "A lighter week is made by subtracting the thing that keeps asking to be justified.",
      sidebarTitle: "The lesson",
      sidebar: [
        "remove the proving ritual",
        "keep the useful friction",
        "write the next first line",
      ],
      notes: [
        "Subtract before improving",
        "Let evidence stay small",
        "End with one next action",
      ],
      beats: [
        {
          id: 0,
          action: "State the lesson",
          title: "Usefulness as edit",
          body: "The lesson scene uses a calm editorial lesson stack.",
        },
        {
          id: 1,
          action: "Reveal three editorial lessons",
          title: "Three edits",
          body: "Each lesson appears in an already reserved row.",
        },
        {
          id: 2,
          action: "Anchor the subtraction quote",
          title: "Subtract the ritual",
          body: "A pull quote frames the practical lesson.",
        },
      ],
    },
    zh: {
      nav: "一课",
      chapter: "一课",
      kicker: "周五，留下来的那次编辑",
      title: "有用不是突破，而是一次编辑",
      dek: "没有戏剧性的事情发生。三句话换了位置，一场会消失了，这一周终于给证据留出空间。",
      pullQuote: "更轻的一周，来自删掉那个一直要求自证的东西。",
      sidebarTitle: "留下的一课",
      sidebar: ["移除证明仪式", "保留有用摩擦", "写下下一句开头"],
      notes: ["先删减，再改进", "让证据保持小", "以一个动作收尾"],
      beats: [
        {
          id: 0,
          action: "说出这一课",
          title: "有用是一种编辑",
          body: "这一页用安静的编辑式课程堆叠。",
        },
        {
          id: 1,
          action: "显露三条编辑课",
          title: "三次编辑",
          body: "每条经验都出现在预留好的行里。",
        },
        {
          id: 2,
          action: "锚定删减引句",
          title: "删掉仪式",
          body: "引句框住可执行的一课。",
        },
      ],
    },
  },
  5: {
    en: {
      nav: "Quote",
      chapter: "Closing pull quote",
      kicker: "End note",
      title: "Keep the part of the week that made the next one lighter.",
      dek: "The archive does not need every hour. It needs the sentence that can be carried forward.",
      pullQuote: "Keep the part of the week that made the next one lighter.",
      sidebarTitle: "Carry forward",
      sidebar: ["one sentence", "one lighter meeting", "one next repair"],
      notes: [
        "Filed on Friday",
        "Reopened on Monday",
        "Useful because it travels",
      ],
      beats: [
        {
          id: 0,
          action: "Show the closing pull quote",
          title: "Keep the useful part",
          body: "The final scene becomes a generous editorial pull quote.",
        },
        {
          id: 1,
          action: "Reveal the carry-forward note",
          title: "Carry forward",
          body: "A small side note explains what remains portable.",
        },
        {
          id: 2,
          action: "Close with the folio line",
          title: "Useful because it travels",
          body: "The closing marker completes the feature arc.",
        },
      ],
    },
    zh: {
      nav: "引句",
      chapter: "收束引句",
      kicker: "尾注",
      title: "留下让下一周更轻的那一部分。",
      dek: "存档不需要每一个小时。它只需要那句可以带到下一周的话。",
      pullQuote: "留下让下一周更轻的那一部分。",
      sidebarTitle: "带到下周",
      sidebar: ["一句话", "一场更轻的会", "下一次修补"],
      notes: ["周五归档", "周一重启", "有用，因为能被带走"],
      beats: [
        {
          id: 0,
          action: "显示收束引句",
          title: "留下有用部分",
          body: "最后一页成为留白充分的编辑引句。",
        },
        {
          id: 1,
          action: "显露可带走的注释",
          title: "带到下周",
          body: "小侧注解释什么仍可携带。",
        },
        {
          id: 2,
          action: "以页码线收束",
          title: "有用，因为能被带走",
          body: "收束标记完成整篇特写的弧线。",
        },
      ],
    },
  },
};

function useFonts() {
  useEffect(() => {
    if (typeof document === "undefined") return;
    const id = "useful-week-fonts";
    if (document.getElementById(id)) return;

    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Literata:opsz,wght@7..72,400;7..72,500;7..72,600&family=Noto+Serif+SC:wght@400;600;700&family=Noto+Sans+SC:wght@400;500;600&family=Source+Sans+3:wght@400;500;600&display=swap";
    document.head.appendChild(link);
  }, []);
}

function serifFont(language: Lang) {
  return language === "zh"
    ? '"Noto Serif SC", "Songti SC", serif'
    : '"Literata", Georgia, serif';
}

function sansFont(language: Lang) {
  return language === "zh"
    ? '"Noto Sans SC", "PingFang SC", sans-serif'
    : '"Source Sans 3", "Gill Sans", sans-serif';
}

function clampScene(scene: number): SceneId {
  return Math.min(5, Math.max(1, Math.round(scene))) as SceneId;
}

function clampBeat(scene: SceneId, beat: number, language: Lang): number {
  const maxBeat = SCENES[scene][language].beats.length - 1;
  return Math.min(maxBeat, Math.max(0, Math.round(beat)));
}

function revealStyle(
  isRevealed: boolean,
  order: number,
  motionDisabled: boolean,
): React.CSSProperties {
  const delay = `${order * 90}ms`;
  return {
    opacity: isRevealed ? 1 : 0,
    visibility: isRevealed ? "visible" : "hidden",
    transform:
      motionDisabled || isRevealed ? "translateY(0)" : "translateY(1.2cqh)",
    transition: motionDisabled
      ? "none"
      : `opacity 680ms ease ${delay}, transform 680ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}, visibility 0ms linear ${
          isRevealed ? "0ms" : "680ms"
        }`,
  };
}

function Rule({ accent }: { accent: string }) {
  return (
    <div
      aria-hidden="true"
      style={{
        width: "100%",
        height: "0.08cqh",
        background: accent,
        opacity: 0.76,
      }}
    />
  );
}

function BotanicalLine({ accent }: { accent: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 160 520"
      style={{
        width: "19cqw",
        height: "66cqh",
        display: "block",
      }}
    >
      <path
        d="M72 494 C54 398 60 304 86 218 C103 160 104 96 86 26"
        fill="none"
        stroke={accent}
        strokeLinecap="round"
        strokeWidth="4"
      />
      <path
        d="M71 344 C31 330 18 302 18 302 C54 298 68 318 71 344Z"
        fill={accent}
        opacity="0.72"
      />
      <path
        d="M79 274 C122 260 139 228 139 228 C96 229 78 249 79 274Z"
        fill={accent}
        opacity="0.56"
      />
      <path
        d="M86 190 C53 174 45 142 45 142 C78 143 92 162 86 190Z"
        fill={accent}
        opacity="0.48"
      />
      <path
        d="M93 113 C123 94 124 66 124 66 C96 73 86 91 93 113Z"
        fill={accent}
        opacity="0.4"
      />
    </svg>
  );
}

function BeatMarkers({
  count,
  beat,
  accent,
}: {
  count: number;
  beat: number;
  accent: string;
}) {
  return (
    <div
      aria-hidden="true"
      data-beat-layout-item="true"
      style={{
        position: "absolute",
        left: "9cqw",
        bottom: "5.2cqh",
        display: "flex",
        alignItems: "center",
        gap: "0.72cqw",
      }}
    >
      {Array.from({ length: count }).map((_, index) => (
        <span
          key={index}
          data-beat-marker="true"
          data-active={index === beat ? "true" : undefined}
          style={{
            width: index === beat ? "2.8cqw" : "0.58cqw",
            height: "0.58cqw",
            borderRadius: "999cqw",
            border: `0.08cqw solid ${index <= beat ? accent : RULE}`,
            background: index <= beat ? accent : "transparent",
            transition: "inherit",
          }}
        />
      ))}
    </div>
  );
}

function ChapterTabs({
  scene,
  language,
  isThumbnail,
  onNavigate,
}: {
  scene: SceneId;
  language: Lang;
  isThumbnail: boolean;
  onNavigate?: (scene: number, beat: number) => void;
}) {
  if (isThumbnail) return null;

  return (
    <nav
      aria-label={language === "zh" ? "章节导航" : "Chapter navigation"}
      data-topic-navigation="true"
      data-navigation-geometry="typographic-index"
      data-navigation-carrier="useful-week-chapter-tabs"
      data-navigation-invocation="persistent"
      data-navigation-feedback="material-color-change"
      style={{
        position: "absolute",
        right: "2.1cqw",
        top: "16cqh",
        zIndex: 5,
        display: "flex",
        flexDirection: "column",
        gap: "1.1cqh",
      }}
    >
      {SCENE_IDS.map((id) => {
        const copy = SCENES[id][language];
        const isActive = id === scene;
        return (
          <button
            key={id}
            type="button"
            aria-current={isActive ? "step" : undefined}
            aria-label={`${id}. ${copy.nav}`}
            onClick={() => onNavigate?.(id, 0)}
            style={{
              appearance: "none",
              width: "4.2cqw",
              minHeight: "11cqh",
              border: `0.08cqw solid ${isActive ? ACCENTS[id] : RULE}`,
              borderRadius: "0.5cqw 0 0 0.5cqw",
              background: isActive ? ACCENTS[id] : PANEL,
              color: isActive ? PAPER : MUTED_INK,
              fontFamily: sansFont(language),
              fontSize: "0.82cqw",
              lineHeight: "1.1",
              letterSpacing: "0",
              writingMode: "vertical-rl",
              textOrientation: "mixed",
              cursor: "pointer",
              padding: "1.2cqh 0.62cqw",
            }}
          >
            {copy.nav}
          </button>
        );
      })}
    </nav>
  );
}

function PageChrome({
  scene,
  beat,
  language,
  motionDisabled,
  children,
}: {
  scene: SceneId;
  beat: number;
  language: Lang;
  motionDisabled: boolean;
  children: React.ReactNode;
}) {
  const copy = SCENES[scene][language];
  const accent = ACCENTS[scene];

  return (
    <article
      data-beat-layout-container="true"
      data-beat-layout-mode="reserved"
      style={{
        position: "absolute",
        inset: "0",
        width: "100cqw",
        height: "100cqh",
        boxSizing: "border-box",
        padding: "8cqh 8.2cqw 7cqh 9cqw",
        background: PAPER,
        color: INK,
        fontFamily: sansFont(language),
        overflow: "hidden",
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: "4.8cqh 5.6cqw",
          border: `0.07cqw solid ${RULE}`,
          pointerEvents: "none",
        }}
      />
      <header
        data-beat-layout-item="true"
        style={{
          position: "absolute",
          left: "9cqw",
          top: "4.9cqh",
          right: "8cqw",
          display: "grid",
          gridTemplateColumns: "1fr 19cqw",
          alignItems: "end",
          gap: "2.8cqw",
        }}
      >
        <div>
          <p
            style={{
              margin: "0",
              color: MUTED_INK,
              fontFamily: sansFont(language),
              fontSize: "1.06cqw",
              lineHeight: "1.2",
              letterSpacing: "0",
              textTransform: language === "zh" ? "none" : "uppercase",
            }}
          >
            {copy.chapter}
          </p>
          <div style={{ marginTop: "1.2cqh" }}>
            <Rule accent={accent} />
          </div>
        </div>
        <p
          style={{
            margin: "0",
            color: MUTED_INK,
            fontFamily: serifFont(language),
            fontSize: "1.18cqw",
            lineHeight: "1.2",
            textAlign: "right",
            letterSpacing: "0",
          }}
        >
          {String(scene).padStart(2, "0")} / 05
        </p>
      </header>
      {children}
      <BeatMarkers count={copy.beats.length} beat={beat} accent={accent} />
      <p
        data-beat-layout-item="true"
        style={{
          position: "absolute",
          right: "8.2cqw",
          bottom: "4.8cqh",
          margin: "0",
          color: MUTED_INK,
          fontFamily: serifFont(language),
          fontSize: "1.05cqw",
          lineHeight: "1.2",
          letterSpacing: "0",
          ...revealStyle(beat >= 2, 4, motionDisabled),
        }}
      >
        {copy.notes[2]}
      </p>
    </article>
  );
}

function MarginList({
  title,
  items,
  beat,
  language,
  accent,
  motionDisabled,
  startBeat = 1,
}: {
  title: string;
  items: string[];
  beat: number;
  language: Lang;
  accent: string;
  motionDisabled: boolean;
  startBeat?: number;
}) {
  return (
    <aside
      data-beat-layout-item="true"
      style={{
        borderLeft: `0.08cqw solid ${accent}`,
        paddingLeft: "1.4cqw",
        minHeight: "24cqh",
      }}
    >
      <p
        style={{
          margin: "0 0 2cqh",
          color: MUTED_INK,
          fontFamily: sansFont(language),
          fontSize: "0.98cqw",
          lineHeight: "1.2",
          letterSpacing: "0",
          textTransform: language === "zh" ? "none" : "uppercase",
        }}
      >
        {title}
      </p>
      <div style={{ display: "grid", gap: "1.7cqh" }}>
        {items.map((item, index) => (
          <p
            key={item}
            data-beat-layout-item="true"
            style={{
              margin: "0",
              color: INK,
              fontFamily: serifFont(language),
              fontSize: "1.42cqw",
              lineHeight: "1.25",
              letterSpacing: "0",
              ...revealStyle(beat >= startBeat, index, motionDisabled),
            }}
          >
            {item}
          </p>
        ))}
      </div>
    </aside>
  );
}

function SceneOne({
  copy,
  beat,
  language,
  motionDisabled,
}: {
  copy: FeatureSceneCopy;
  beat: number;
  language: Lang;
  motionDisabled: boolean;
}) {
  const accent = ACCENTS[1];

  return (
    <div
      style={{
        position: "absolute",
        left: "9cqw",
        top: "17cqh",
        right: "9cqw",
        bottom: "13cqh",
        display: "grid",
        gridTemplateColumns: "53cqw 23cqw",
        gap: "6cqw",
        alignItems: "center",
      }}
    >
      <section data-beat-layout-item="true">
        <p
          style={{
            margin: "0 0 3cqh",
            color: accent,
            fontFamily: serifFont(language),
            fontSize: "1.65cqw",
            lineHeight: "1.2",
            fontStyle: "italic",
            letterSpacing: "0",
          }}
        >
          {copy.kicker}
        </p>
        <h1
          style={{
            margin: "0",
            color: INK,
            fontFamily: serifFont(language),
            fontSize: language === "zh" ? "5.8cqw" : "6.6cqw",
            lineHeight: "0.98",
            fontWeight: 500,
            letterSpacing: "0",
          }}
        >
          {copy.title}
        </h1>
        <p
          style={{
            width: "42cqw",
            margin: "4.2cqh 0 0",
            color: MUTED_INK,
            fontFamily: sansFont(language),
            fontSize: "1.42cqw",
            lineHeight: "1.42",
            letterSpacing: "0",
          }}
        >
          {copy.dek}
        </p>
        <blockquote
          data-beat-layout-item="true"
          style={{
            width: "35cqw",
            margin: "6cqh 0 0",
            padding: "2.4cqh 0 0",
            borderTop: `0.08cqw solid ${RULE}`,
            color: INK,
            fontFamily: serifFont(language),
            fontSize: "2cqw",
            lineHeight: "1.24",
            fontStyle: "italic",
            letterSpacing: "0",
            ...revealStyle(beat >= 2, 2, motionDisabled),
          }}
        >
          {copy.pullQuote}
        </blockquote>
      </section>
      <section
        data-beat-layout-item="true"
        style={{
          display: "grid",
          gridTemplateRows: "1fr 26cqh",
          gap: "3cqh",
        }}
      >
        <div
          style={{
            justifySelf: "center",
            alignSelf: "center",
            ...revealStyle(beat >= 0, 0, motionDisabled),
          }}
        >
          <BotanicalLine accent={accent} />
        </div>
        <MarginList
          title={copy.sidebarTitle}
          items={copy.sidebar}
          beat={beat}
          language={language}
          accent={accent}
          motionDisabled={motionDisabled}
        />
      </section>
    </div>
  );
}

function SceneTwo({
  copy,
  beat,
  language,
  motionDisabled,
}: {
  copy: FeatureSceneCopy;
  beat: number;
  language: Lang;
  motionDisabled: boolean;
}) {
  const accent = ACCENTS[2];

  return (
    <div
      style={{
        position: "absolute",
        left: "9cqw",
        top: "18cqh",
        right: "9cqw",
        bottom: "12cqh",
        display: "grid",
        gridTemplateColumns: "25cqw 34cqw 19cqw",
        gap: "4.2cqw",
        alignItems: "start",
      }}
    >
      <section
        data-beat-layout-item="true"
        style={{
          minHeight: "58cqh",
          border: `0.08cqw solid ${RULE}`,
          background: "rgba(185, 173, 130, 0.12)",
          display: "grid",
          alignContent: "center",
          justifyItems: "center",
          padding: "4cqh 2.5cqw",
        }}
      >
        <div
          aria-hidden="true"
          style={{
            width: "13cqw",
            height: "22cqh",
            borderRadius: "50% 50% 44% 44%",
            background: accent,
            opacity: 0.58,
          }}
        />
        <div
          aria-hidden="true"
          style={{
            width: "11cqw",
            height: "14cqh",
            marginTop: "-2cqh",
            borderRadius: "40% 40% 45% 45%",
            background: accent,
            opacity: 0.36,
          }}
        />
      </section>
      <section data-beat-layout-item="true">
        <p
          style={{
            margin: "0 0 2.4cqh",
            color: accent,
            fontFamily: serifFont(language),
            fontSize: "1.5cqw",
            lineHeight: "1.2",
            fontStyle: "italic",
            letterSpacing: "0",
          }}
        >
          {copy.kicker}
        </p>
        <h2
          style={{
            margin: "0",
            color: INK,
            fontFamily: serifFont(language),
            fontSize: language === "zh" ? "4.1cqw" : "4.7cqw",
            lineHeight: "1.02",
            fontWeight: 500,
            letterSpacing: "0",
          }}
        >
          {copy.title}
        </h2>
        <p
          style={{
            margin: "3.4cqh 0 0",
            color: MUTED_INK,
            fontFamily: sansFont(language),
            fontSize: "1.36cqw",
            lineHeight: "1.44",
            letterSpacing: "0",
          }}
        >
          {copy.dek}
        </p>
        <blockquote
          data-beat-layout-item="true"
          style={{
            margin: "5cqh 0 0",
            padding: "2.8cqh 0 0",
            borderTop: `0.08cqw solid ${accent}`,
            color: INK,
            fontFamily: serifFont(language),
            fontSize: "2.15cqw",
            lineHeight: "1.18",
            fontStyle: "italic",
            letterSpacing: "0",
            ...revealStyle(beat >= 2, 2, motionDisabled),
          }}
        >
          {copy.pullQuote}
        </blockquote>
      </section>
      <section
        data-beat-layout-item="true"
        style={{
          display: "grid",
          gap: "2.1cqh",
          minHeight: "58cqh",
        }}
      >
        {copy.notes.map((note, index) => (
          <div
            key={note}
            data-beat-layout-item="true"
            style={{
              minHeight: "13.5cqh",
              borderTop: `0.08cqw solid ${index === 0 ? accent : RULE}`,
              paddingTop: "1.8cqh",
              color: index === 1 ? INK : MUTED_INK,
              fontFamily:
                index === 1 ? serifFont(language) : sansFont(language),
              fontSize: index === 1 ? "1.72cqw" : "1.08cqw",
              lineHeight: "1.32",
              fontStyle: index === 1 ? "italic" : "normal",
              letterSpacing: "0",
              ...revealStyle(
                beat >= (index === 1 ? 1 : 0),
                index,
                motionDisabled,
              ),
            }}
          >
            {note}
          </div>
        ))}
      </section>
    </div>
  );
}

function SceneThree({
  copy,
  beat,
  language,
  motionDisabled,
}: {
  copy: FeatureSceneCopy;
  beat: number;
  language: Lang;
  motionDisabled: boolean;
}) {
  const accent = ACCENTS[3];

  return (
    <div
      style={{
        position: "absolute",
        left: "9cqw",
        top: "17cqh",
        right: "9cqw",
        bottom: "13cqh",
        display: "grid",
        gridTemplateColumns: "35cqw 35cqw",
        gap: "7cqw",
        alignItems: "center",
      }}
    >
      <section
        data-beat-layout-item="true"
        style={{
          position: "relative",
          minHeight: "58cqh",
          border: `0.08cqw solid ${RULE}`,
          background: PANEL,
          padding: "5cqh 3.6cqw",
        }}
      >
        <p
          style={{
            margin: "0",
            color: accent,
            fontFamily: serifFont(language),
            fontSize: "5.4cqw",
            lineHeight: "1",
            fontWeight: 500,
            letterSpacing: "0",
          }}
        >
          4:17
        </p>
        <p
          style={{
            margin: "2cqh 0 0",
            width: "22cqw",
            color: MUTED_INK,
            fontFamily: sansFont(language),
            fontSize: "1.18cqw",
            lineHeight: "1.42",
            letterSpacing: "0",
          }}
        >
          {copy.kicker}
        </p>
        <div
          data-beat-layout-item="true"
          style={{
            position: "absolute",
            right: "3.2cqw",
            bottom: "6cqh",
            width: "13cqw",
            height: "17cqh",
            border: `0.08cqw solid ${accent}`,
            borderTop: "0",
            borderRadius: "0 0 5cqw 5cqw",
            ...revealStyle(beat >= 1, 1, motionDisabled),
          }}
        />
        <div
          data-beat-layout-item="true"
          style={{
            position: "absolute",
            left: "4cqw",
            bottom: "5.2cqh",
            width: "15cqw",
            minHeight: "17cqh",
            background: "rgba(213, 189, 88, 0.18)",
            border: `0.08cqw solid rgba(61, 48, 39, 0.18)`,
            padding: "2cqh 1.6cqw",
            color: INK,
            fontFamily: serifFont(language),
            fontSize: "1.34cqw",
            lineHeight: "1.28",
            fontStyle: "italic",
            letterSpacing: "0",
            ...revealStyle(beat >= 1, 2, motionDisabled),
          }}
        >
          {copy.notes[1]}
        </div>
      </section>
      <section data-beat-layout-item="true">
        <p
          style={{
            margin: "0 0 2.2cqh",
            color: accent,
            fontFamily: serifFont(language),
            fontSize: "1.5cqw",
            lineHeight: "1.2",
            fontStyle: "italic",
            letterSpacing: "0",
          }}
        >
          {copy.chapter}
        </p>
        <h2
          style={{
            margin: "0",
            color: INK,
            fontFamily: serifFont(language),
            fontSize: language === "zh" ? "3.9cqw" : "4.35cqw",
            lineHeight: "1.04",
            fontWeight: 500,
            letterSpacing: "0",
          }}
        >
          {copy.title}
        </h2>
        <p
          style={{
            margin: "3cqh 0 0",
            color: MUTED_INK,
            fontFamily: sansFont(language),
            fontSize: "1.34cqw",
            lineHeight: "1.46",
            letterSpacing: "0",
          }}
        >
          {copy.dek}
        </p>
        <MarginList
          title={copy.sidebarTitle}
          items={copy.sidebar}
          beat={beat}
          language={language}
          accent={accent}
          motionDisabled={motionDisabled}
        />
        <blockquote
          data-beat-layout-item="true"
          style={{
            margin: "4cqh 0 0",
            color: INK,
            fontFamily: serifFont(language),
            fontSize: "1.9cqw",
            lineHeight: "1.22",
            fontStyle: "italic",
            letterSpacing: "0",
            ...revealStyle(beat >= 2, 3, motionDisabled),
          }}
        >
          {copy.pullQuote}
        </blockquote>
      </section>
    </div>
  );
}

function SceneFour({
  copy,
  beat,
  language,
  motionDisabled,
}: {
  copy: FeatureSceneCopy;
  beat: number;
  language: Lang;
  motionDisabled: boolean;
}) {
  const accent = ACCENTS[4];

  return (
    <div
      style={{
        position: "absolute",
        left: "12cqw",
        top: "17cqh",
        right: "12cqw",
        bottom: "12cqh",
        display: "grid",
        gridTemplateColumns: "38cqw 28cqw",
        gap: "7cqw",
        alignItems: "start",
      }}
    >
      <section data-beat-layout-item="true">
        <p
          style={{
            margin: "0 0 2.5cqh",
            color: accent,
            fontFamily: serifFont(language),
            fontSize: "1.5cqw",
            lineHeight: "1.2",
            fontStyle: "italic",
            letterSpacing: "0",
          }}
        >
          {copy.kicker}
        </p>
        <h2
          style={{
            margin: "0",
            color: INK,
            fontFamily: serifFont(language),
            fontSize: language === "zh" ? "4.2cqw" : "4.7cqw",
            lineHeight: "1.03",
            fontWeight: 500,
            letterSpacing: "0",
          }}
        >
          {copy.title}
        </h2>
        <p
          style={{
            margin: "3.4cqh 0 0",
            color: MUTED_INK,
            fontFamily: sansFont(language),
            fontSize: "1.34cqw",
            lineHeight: "1.46",
            letterSpacing: "0",
          }}
        >
          {copy.dek}
        </p>
        <blockquote
          data-beat-layout-item="true"
          style={{
            margin: "6cqh 0 0",
            paddingLeft: "1.8cqw",
            borderLeft: `0.14cqw solid ${accent}`,
            color: INK,
            fontFamily: serifFont(language),
            fontSize: "2.05cqw",
            lineHeight: "1.2",
            fontStyle: "italic",
            letterSpacing: "0",
            ...revealStyle(beat >= 2, 4, motionDisabled),
          }}
        >
          {copy.pullQuote}
        </blockquote>
      </section>
      <section
        data-beat-layout-item="true"
        style={{
          display: "grid",
          gap: "2.4cqh",
          paddingTop: "4.5cqh",
        }}
      >
        {copy.sidebar.map((item, index) => (
          <div
            key={item}
            data-beat-layout-item="true"
            style={{
              minHeight: "13.6cqh",
              borderTop: `0.08cqw solid ${index === 0 ? accent : RULE}`,
              paddingTop: "1.9cqh",
              display: "grid",
              gridTemplateColumns: "4.5cqw 1fr",
              gap: "1.5cqw",
              color: INK,
              ...revealStyle(beat >= 1, index, motionDisabled),
            }}
          >
            <span
              style={{
                color: accent,
                fontFamily: serifFont(language),
                fontSize: "2.8cqw",
                lineHeight: "1",
                letterSpacing: "0",
              }}
            >
              {index + 1}
            </span>
            <span
              style={{
                fontFamily: sansFont(language),
                fontSize: "1.28cqw",
                lineHeight: "1.35",
                letterSpacing: "0",
              }}
            >
              {item}
            </span>
          </div>
        ))}
      </section>
    </div>
  );
}

function SceneFive({
  copy,
  beat,
  language,
  motionDisabled,
}: {
  copy: FeatureSceneCopy;
  beat: number;
  language: Lang;
  motionDisabled: boolean;
}) {
  const accent = ACCENTS[5];

  return (
    <div
      style={{
        position: "absolute",
        left: "15cqw",
        top: "17cqh",
        right: "15cqw",
        bottom: "13cqh",
        display: "grid",
        gridTemplateColumns: "1fr",
        placeItems: "center",
      }}
    >
      <section
        data-beat-layout-item="true"
        style={{
          width: "62cqw",
          minHeight: "52cqh",
          display: "grid",
          alignContent: "center",
          justifyItems: "center",
          textAlign: "center",
          border: `0.08cqw solid ${accent}`,
          padding: "7cqh 6cqw",
          background: PANEL,
        }}
      >
        <p
          style={{
            margin: "0 0 3cqh",
            color: accent,
            fontFamily: serifFont(language),
            fontSize: "5.4cqw",
            lineHeight: "0.8",
            letterSpacing: "0",
          }}
        >
          “
        </p>
        <h2
          style={{
            margin: "0",
            color: INK,
            fontFamily: serifFont(language),
            fontSize: language === "zh" ? "4.6cqw" : "4.2cqw",
            lineHeight: "1.12",
            fontWeight: 500,
            letterSpacing: "0",
          }}
        >
          {copy.pullQuote}
        </h2>
        <p
          data-beat-layout-item="true"
          style={{
            width: "42cqw",
            margin: "4cqh 0 0",
            color: MUTED_INK,
            fontFamily: sansFont(language),
            fontSize: "1.3cqw",
            lineHeight: "1.42",
            letterSpacing: "0",
            ...revealStyle(beat >= 1, 1, motionDisabled),
          }}
        >
          {copy.dek}
        </p>
        <div
          data-beat-layout-item="true"
          style={{
            marginTop: "4cqh",
            display: "flex",
            gap: "1.2cqw",
            justifyContent: "center",
            ...revealStyle(beat >= 2, 2, motionDisabled),
          }}
        >
          {copy.sidebar.map((item) => (
            <span
              key={item}
              style={{
                borderTop: `0.08cqw solid ${RULE}`,
                paddingTop: "1.1cqh",
                color: MUTED_INK,
                fontFamily: sansFont(language),
                fontSize: "0.96cqw",
                lineHeight: "1.2",
                letterSpacing: "0",
                textTransform: language === "zh" ? "none" : "uppercase",
              }}
            >
              {item}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
}

function FeatureScene({
  scene,
  beat,
  language,
  motionDisabled,
}: {
  scene: SceneId;
  beat: number;
  language: Lang;
  motionDisabled: boolean;
}) {
  const copy = SCENES[scene][language];

  return (
    <PageChrome
      scene={scene}
      beat={beat}
      language={language}
      motionDisabled={motionDisabled}
    >
      {scene === 1 && (
        <SceneOne
          copy={copy}
          beat={beat}
          language={language}
          motionDisabled={motionDisabled}
        />
      )}
      {scene === 2 && (
        <SceneTwo
          copy={copy}
          beat={beat}
          language={language}
          motionDisabled={motionDisabled}
        />
      )}
      {scene === 3 && (
        <SceneThree
          copy={copy}
          beat={beat}
          language={language}
          motionDisabled={motionDisabled}
        />
      )}
      {scene === 4 && (
        <SceneFour
          copy={copy}
          beat={beat}
          language={language}
          motionDisabled={motionDisabled}
        />
      )}
      {scene === 5 && (
        <SceneFive
          copy={copy}
          beat={beat}
          language={language}
          motionDisabled={motionDisabled}
        />
      )}
    </PageChrome>
  );
}

function buildMetadata(lang: Lang): TopicMetadata {
  return {
    theme: lang === "zh" ? "有用一周的札记" : "Notes from a Useful Week",
    densityLabel: lang === "zh" ? "阅读优先" : "Reading-first",
    heroScene: 1,
    colors: {
      bg: PAPER,
      ink: INK,
      panel: PANEL,
    },
    typography: {
      header: lang === "zh" ? "Noto Serif SC 600" : "Literata 500",
      body: lang === "zh" ? "Noto Sans SC 400" : "Source Sans 3 400",
    },
    tags: [
      "editorial",
      "warm",
      "feature",
      "literary",
      "reserved-beats",
      "page-flip",
    ],
    fonts: [
      "Literata",
      "Source Sans 3",
      "cjk:Noto Serif SC",
      "cjk:Noto Sans SC",
    ],
    scenes: SCENE_IDS.map((id) => {
      const scene = SCENES[id][lang];
      return {
        id,
        title: scene.nav,
        beats: scene.beats.map((beat, index) => ({
          id: index,
          action: beat.action,
          title: beat.title,
          body: beat.body,
        })),
      };
    }),
  };
}

const metadata = {
  en: buildMetadata("en"),
  zh: buildMetadata("zh"),
} satisfies TopicDefinition["metadata"];

function TopicStage({
  scene,
  beat,
  language,
  isThumbnail,
  reducedMotion,
  onNavigate,
}: TopicStageProps) {
  useFonts();

  const activeScene = clampScene(scene);
  const activeBeat = clampBeat(activeScene, beat, language);
  const motionDisabled = reducedMotion || isThumbnail;

  return (
    <section
      aria-label={SCENES[activeScene][language].chapter}
      style={{
        position: "relative",
        width: "100cqw",
        height: "100cqh",
        overflow: "hidden",
        containerType: "size",
        background: PAPER,
        color: INK,
      }}
    >
      <SpatialSceneTrack
        scene={activeScene}
        beat={activeBeat}
        sceneIds={SCENE_IDS}
        transitionKind="fade"
        transitionMap={TRANSITION_MAP}
        transitionDurationMs={780}
        reducedMotion={motionDisabled}
        beatLayoutModes={BEAT_LAYOUT_MODES}
        renderScene={(sceneId, sceneBeat, isActive) => {
          const typedScene = clampScene(sceneId);
          const typedBeat = clampBeat(typedScene, sceneBeat, language);
          return (
            <FeatureScene
              scene={typedScene}
              beat={typedBeat}
              language={language}
              motionDisabled={motionDisabled || !isActive}
            />
          );
        }}
      />
      <ChapterTabs
        scene={activeScene}
        language={language}
        isThumbnail={isThumbnail}
        onNavigate={onNavigate}
      />
    </section>
  );
}

export default defineTopic({
  id: "useful-week",
  styleId: "warm-editorial-feature",
  title: {
    en: "Useful Week",
    zh: "有用一周",
  },
  modelId: "GPT 5.5",
  Stage: TopicStage,
  metadata,
  navigation: {
    geometry: "typographic-index",
    carrier: "useful-week-chapter-tabs",
    invocation: "persistent",
    feedback: "material-color-change",
  },
  transitionScore: TRANSITION_MAP,
  evidence: {
    kind: "illustrative",
    boundary: {
      en: "Illustrative personal essay: the week, scenes, and outcomes are presentation examples, not an account of a documented person or event.",
      zh: "示例个人随笔：这一周、场景与结果均为演示内容，并非对已记录人物或事件的叙述。",
    },
    display: "envelope",
  },
});

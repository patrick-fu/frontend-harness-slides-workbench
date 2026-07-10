import { useEffect } from "react";
import type { BespokeStyleProps, StyleMetadata } from "../types";
import { defineStyleTopic } from "./topic";
import SpatialSceneTrack from "./SpatialSceneTrack";
import type {
  BeatLayoutMode,
  SceneTransitionMap,
} from "./SpatialSceneTrack";
import styles from "./anatomy-timetable.module.css";

/* ────────────────────────────────────────────────────────────────────────
   02 · Objective Swiss Grid · v3 — "Anatomy of a Timetable"
   Achromatic paper/ink system. Strict visible column grid, hairline rules.
   EXACTLY ONE signal hue (vermilion) for functional wayfinding only:
   the "now" marker, the delayed exception row, and the nav datum.
   Flush-left ragged-right. Flat surface. cqw/cqh units only.
   ──────────────────────────────────────────────────────────────────────── */

const MODEL = "Claude-Opus-4.8";
const STYLE_ID = "objective-swiss-grid";

// Grid module: 8 columns × 8 baselines. Column letters A–H.
const COLS = 8;
const ROWS = 8;
const COL_LETTERS = ["A", "B", "C", "D", "E", "F", "G", "H"];
const ROW_NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8];

// Beat counts per scene (1-indexed scene → count).
const BEAT_COUNTS: Record<number, number> = { 1: 1, 2: 2, 3: 3, 4: 2, 5: 1 };

// Per-edge transitions (exact from assignment); base is hard-cut.
const TRANSITIONS: SceneTransitionMap = {
  "1->2": "hard-cut",
  "2->3": "slide-y",
  "3->4": "hard-cut",
  "4->5": "slide-y",
};

// Reserved layout for every multi-beat scene.
const BEAT_LAYOUT_MODES: Partial<Record<number, BeatLayoutMode>> = {
  2: "reserved",
  3: "reserved",
  4: "reserved",
};

type Lang = "en" | "zh";

/* ── Fonts: single neutral grotesque (Archivo) + CJK grotesque (Noto Sans SC) ── */
function useFonts() {
  useEffect(() => {
    const id = "font-objective-swiss-grid-v3";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700&family=Noto+Sans+SC:wght@400;500;700&display=swap";
    document.head.appendChild(link);
  }, []);
}

const pad2 = (n: number) => n.toString().padStart(2, "0");

/* ── Bilingual copy ── */
const COPY = {
  en: {
    headLead: "Anatomy of a Timetable",
    fig: (s: number) => `FIG. ${pad2(s)}`,
    footCredit: "OBJECTIVE SWISS GRID — 8 × 8 MODULE",
    page: (s: number) => `${pad2(s)} / 05`,
    navHere: "YOU ARE HERE",
    s1: {
      eyebrow: "FIELD STUDY 02 · DEPARTURES",
      title: "Anatomy of a\nTimetable",
      subtitle: "How a system turns time into columns.",
      meta: "OBJECTIVE SWISS GRID",
    },
    s2: {
      eyebrow: "02 · THE GRID EXPOSED",
      title: "The grid, worn with pride",
      lead: "Hairline columns and baselines — the scaffold every element answers to.",
      caption: "COLUMNS A–H · BASELINES 1–8",
    },
    s3: {
      eyebrow: "03 · READING THE DATA",
      title: "The board fills, cell by cell",
      lead: "Tabular figures snap to the grid; one signal line marks now.",
      now: "NOW · 07:16",
    },
    s4: {
      eyebrow: "04 · THE EXCEPTION",
      title: "One row breaks the pattern",
      lead: "A single signal hue carries the only delay — nothing else colored.",
    },
    s5: {
      eyebrow: "05 · ORDER RESTORED",
      title: "The system reads clean",
      lead: "The grid was here the whole time.",
      credit:
        "Composed on an 8 × 8 modular grid · Type: Archivo · One signal: departure status",
    },
    table: {
      head: ["Time", "Line", "Track", "Destination", "Status"],
      rows: [
        ["07:02", "S1", "4", "Central Interchange", "On time"],
        ["07:09", "R4", "2", "Harbour North", "On time"],
        ["07:15", "S1", "4", "Airport Terminal", "On time"],
        ["07:24", "M2", "1", "Museum Quarter", "Boarding"],
        ["07:31", "R4", "2", "Harbour North", "Delayed"],
        ["07:38", "S1", "4", "Central Interchange", "On time"],
      ],
    },
  },
  zh: {
    headLead: "时刻表解剖",
    fig: (s: number) => `图 ${pad2(s)}`,
    footCredit: "客观瑞士网格 — 8 × 8 模块",
    page: (s: number) => `${pad2(s)} / 05`,
    navHere: "当前坐标",
    s1: {
      eyebrow: "田野研究 02 · 发车",
      title: "时刻表\n解剖",
      subtitle: "系统如何把时间排进一列列。",
      meta: "客观瑞士网格",
    },
    s2: {
      eyebrow: "02 · 暴露的网格",
      title: "被公开示人的网格",
      lead: "细线列与基线——每个元素都要向这套骨架交代位置。",
      caption: "列 A–H · 基线 1–8",
    },
    s3: {
      eyebrow: "03 · 读取数据",
      title: "发车牌逐格填满",
      lead: "等宽数字对齐网格；一条信号线标出此刻。",
      now: "此刻 · 07:16",
    },
    s4: {
      eyebrow: "04 · 例外一行",
      title: "一行打破了规律",
      lead: "唯一的信号色只承载这一处晚点——别处不着色。",
    },
    s5: {
      eyebrow: "05 · 秩序复位",
      title: "系统读起来干净利落",
      lead: "网格自始至终都在。",
      credit: "基于 8 × 8 模块网格 · 字体 Archivo · 唯一信号：发车状态",
    },
    table: {
      head: ["时刻", "线路", "站台", "目的地", "状态"],
      rows: [
        ["07:02", "S1", "4", "中央换乘站", "准点"],
        ["07:09", "R4", "2", "海港北", "准点"],
        ["07:15", "S1", "4", "机场航站楼", "准点"],
        ["07:24", "M2", "1", "博物馆区", "检票中"],
        ["07:31", "R4", "2", "海港北", "晚点"],
        ["07:38", "S1", "4", "中央换乘站", "准点"],
      ],
    },
  },
} as const;

const EXCEPTION_ROW = 4; // 0-based index of the delayed row
const HEAD_H = 5; // cqh — timetable header row height
const ROW_H = 7; // cqh — timetable data row height
const NOW_AFTER = 3; // signal "now" line drawn after this many rows

/* ── Persistent running head (technical-journal chrome) ── */
function RunningHead({ scene, language }: { scene: number; language: Lang }) {
  const c = COPY[language];
  return (
    <div className={styles.head}>
      <span className={styles.metaLabel}>
        <b>{c.headLead}</b>
      </span>
      <span className={styles.metaLabel}>{c.fig(scene)}</span>
    </div>
  );
}

function RunningFoot({ scene, language }: { scene: number; language: Lang }) {
  const c = COPY[language];
  return (
    <div className={styles.foot}>
      <span className={styles.metaLabel}>{c.footCredit}</span>
      <span className={styles.metaLabel}>{c.page(scene)}</span>
    </div>
  );
}

/* ── Structural grid scaffold — the signature gesture ── */
function Scaffold({ play, dim }: { play: boolean; dim: boolean }) {
  const cols = Array.from({ length: COLS + 1 }, (_, i) => i);
  const rows = Array.from({ length: ROWS + 1 }, (_, j) => j);
  return (
    <div
      className={[
        styles.scaffold,
        dim ? styles.scaffoldDim : "",
        play ? styles.play : "",
      ]
        .filter(Boolean)
        .join(" ")}
      aria-hidden="true"
    >
      {cols.map((i) => (
        <span
          key={`c${i}`}
          className={styles.col}
          style={{ left: `${(i / COLS) * 100}%`, animationDelay: `${i * 38}ms` }}
        />
      ))}
      {rows.map((j) => (
        <span
          key={`r${j}`}
          className={styles.baseline}
          style={{
            top: `${(j / ROWS) * 100}%`,
            animationDelay: `${120 + j * 34}ms`,
          }}
        />
      ))}
    </div>
  );
}

/* ── Navigation prototype (N1 Bespoke metaphor):
   a grid-coordinate "you are here" datum — column-letter × row-number,
   e.g. C·3 — rendered in the single signal hue. Null in thumbnails. ── */
function GridDatumNav({
  scene,
  beat,
  isThumbnail,
  language,
  onNavigate,
}: {
  scene: number;
  beat: number;
  isThumbnail: boolean;
  language: Lang;
  onNavigate?: (scene: number, beat: number) => void;
}) {
  if (isThumbnail) return null;
  const letter = COL_LETTERS[(scene - 1) % COL_LETTERS.length];
  const row = beat + 1;
  return (
    <div className={styles.nav} aria-label={COPY[language].navHere}>
      <span className={styles.navLabel}>{COPY[language].navHere}</span>
      <span className={styles.navCoord}>
        {letter}
        <span className={styles.navDot}>·</span>
        {row}
      </span>
      <div className={styles.navTicks}>
        {[1, 2, 3, 4, 5].map((s) => (
          <button
            key={s}
            type="button"
            className={[styles.tick, s === scene ? styles.tickCurrent : ""]
              .filter(Boolean)
              .join(" ")}
            aria-current={s === scene ? "true" : undefined}
            onClick={(e) => {
              e.stopPropagation();
              onNavigate?.(s, 0);
            }}
          >
            {COL_LETTERS[(s - 1) % COL_LETTERS.length]}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ── The timetable (scenes 3–5) ── */
function Timetable({
  language,
  visibleRows,
  showNow,
  flagException,
}: {
  language: Lang;
  visibleRows: number;
  showNow: boolean;
  flagException: boolean;
}) {
  const c = COPY[language];
  const nowTop = HEAD_H + NOW_AFTER * ROW_H;
  return (
    <div
      className={styles.tableWrap}
      data-beat-layout-container="true"
      data-beat-layout-mode="reserved"
    >
      <div className={styles.thead}>
        {c.table.head.map((h, i) => (
          <span key={i} className={styles.th}>
            {h}
          </span>
        ))}
      </div>

      {c.table.rows.map((r, i) => {
        const isException = flagException && i === EXCEPTION_ROW;
        const on = i < visibleRows;
        return (
          <div
            key={i}
            className={[
              styles.row,
              isException ? styles.rowException : "",
            ]
              .filter(Boolean)
              .join(" ")}
            data-beat-layout-item="true"
            data-on={on ? "true" : "false"}
          >
            <span className={styles.rowIndexTag}>{ROW_NUMBERS[i]}</span>
            {isException && <span className={styles.delayTick} />}
            <span className={[styles.cell, styles.cellNum].join(" ")}>{r[0]}</span>
            <span className={[styles.cell, styles.cellNum].join(" ")}>{r[1]}</span>
            <span className={[styles.cell, styles.cellNum].join(" ")}>{r[2]}</span>
            <span className={[styles.cell, styles.dest].join(" ")}>{r[3]}</span>
            <span
              className={[
                styles.status,
                isException ? styles.statusDelayed : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              {r[4]}
            </span>
          </div>
        );
      })}

      <div
        className={[styles.nowMarker, styles.reveal].join(" ")}
        style={{ top: `${nowTop}cqh`, opacity: showNow ? 1 : 0 }}
        aria-hidden={showNow ? undefined : true}
      >
        <span className={styles.nowTag}>{c.s3.now}</span>
        <span className={styles.nowLine} />
      </div>
    </div>
  );
}

/* ── Per-scene body content ── */
function SceneBody({
  scene,
  beat,
  isActive,
  isThumbnail,
  reducedMotion,
  language,
}: {
  scene: number;
  beat: number;
  isActive: boolean;
  isThumbnail: boolean;
  reducedMotion: boolean;
  language: Lang;
}) {
  const still = reducedMotion || isThumbnail;
  // Thumbnails settle to the final beat so the card shows full content.
  const b = isThumbnail ? BEAT_COUNTS[scene] - 1 : beat;
  const c = COPY[language];

  if (scene === 1) {
    return (
      <div className={styles.body}>
        <Scaffold play={!still && isActive} dim={false} />
        <div className={styles.titleWrap}>
          <p className={styles.eyebrow}>{c.s1.eyebrow}</p>
          <h1 className={styles.title}>{c.s1.title}</h1>
          <p className={styles.subtitle}>{c.s1.subtitle}</p>
          <p className={styles.titleMeta}>{c.s1.meta}</p>
        </div>
      </div>
    );
  }

  if (scene === 2) {
    const showLabels = b >= 1;
    return (
      <div className={styles.body}>
        <Scaffold play={false} dim={false} />
        <div className={styles.sceneHead}>
          <p className={styles.eyebrow}>{c.s2.eyebrow}</p>
          <h2 className={styles.h2}>{c.s2.title}</h2>
          <p className={styles.lead}>{c.s2.lead}</p>
        </div>
        <div
          className={styles.gridLabels}
          data-beat-layout-container="true"
          data-beat-layout-mode="reserved"
        >
          <div
            className={[styles.colLetters, styles.reveal].join(" ")}
            data-beat-layout-item="true"
            style={{ opacity: showLabels ? 1 : 0 }}
            aria-hidden={showLabels ? undefined : true}
          >
            {COL_LETTERS.map((L, i) => (
              <span
                key={L}
                className={styles.colLetter}
                style={{ left: `${((i + 0.5) / COLS) * 100}%` }}
              >
                {L}
              </span>
            ))}
          </div>
          <div
            className={[styles.rowNums, styles.reveal].join(" ")}
            data-beat-layout-item="true"
            style={{ opacity: showLabels ? 1 : 0 }}
            aria-hidden={showLabels ? undefined : true}
          >
            {ROW_NUMBERS.map((n, j) => (
              <span
                key={n}
                className={styles.rowNum}
                style={{ top: `${((j + 0.5) / ROWS) * 100}%` }}
              >
                {n}
              </span>
            ))}
          </div>
          <span
            className={[styles.gridCaption, styles.reveal].join(" ")}
            data-beat-layout-item="true"
            style={{ opacity: showLabels ? 1 : 0 }}
            aria-hidden={showLabels ? undefined : true}
          >
            {c.s2.caption}
          </span>
        </div>
      </div>
    );
  }

  if (scene === 3) {
    // Populate cell by cell: 2 rows, 4 rows, all 6 rows + now marker.
    const visibleRows = b >= 2 ? 6 : b >= 1 ? 4 : 2;
    const showNow = b >= 2;
    return (
      <div className={styles.body}>
        <Scaffold play={false} dim />
        <div className={styles.sceneHead}>
          <p className={styles.eyebrow}>{c.s3.eyebrow}</p>
          <h2 className={styles.h2}>{c.s3.title}</h2>
          <p className={styles.lead}>{c.s3.lead}</p>
        </div>
        <Timetable
          language={language}
          visibleRows={visibleRows}
          showNow={showNow}
          flagException={false}
        />
      </div>
    );
  }

  if (scene === 4) {
    const flag = b >= 1;
    return (
      <div className={styles.body}>
        <Scaffold play={false} dim />
        <div className={styles.sceneHead}>
          <p className={styles.eyebrow}>{c.s4.eyebrow}</p>
          <h2 className={styles.h2}>{c.s4.title}</h2>
          <p className={styles.lead}>{c.s4.lead}</p>
        </div>
        <Timetable
          language={language}
          visibleRows={6}
          showNow={false}
          flagException={flag}
        />
      </div>
    );
  }

  // scene === 5
  return (
    <div className={styles.body}>
      <Scaffold play={false} dim />
      <div className={styles.sceneHead}>
        <p className={styles.eyebrow}>{c.s5.eyebrow}</p>
        <h2 className={styles.h2}>{c.s5.title}</h2>
        <p className={styles.lead}>{c.s5.lead}</p>
      </div>
      <Timetable
        language={language}
        visibleRows={6}
        showNow={false}
        flagException={false}
      />
      <p className={styles.credit}>{c.s5.credit}</p>
    </div>
  );
}

/* ── Root component ── */
function ObjectiveSwissGridV3({
  scene,
  beat,
  language,
  isThumbnail,
  reducedMotion,
  onNavigate,
}: BespokeStyleProps) {
  useFonts();
  const still = reducedMotion || isThumbnail;
  const lang: Lang = language === "zh" ? "zh" : "en";

  return (
    <div
      className={[styles.root, lang === "zh" ? styles.rootZh : ""]
        .filter(Boolean)
        .join(" ")}
      data-reduced={still ? "true" : undefined}
    >
      <div className={styles.frame}>
        <RunningHead scene={scene} language={lang} />

        <SpatialSceneTrack
          scene={scene}
          beat={beat}
          transitionKind="hard-cut"
          transitionMap={TRANSITIONS}
          reducedMotion={still}
          beatLayoutModes={BEAT_LAYOUT_MODES}
          className={styles.track}
          renderScene={(sceneId, sceneBeat, isActive) => (
            <SceneBody
              scene={sceneId}
              beat={sceneBeat}
              isActive={isActive}
              isThumbnail={isThumbnail}
              reducedMotion={reducedMotion}
              language={lang}
            />
          )}
        />

        <RunningFoot scene={scene} language={lang} />
        <GridDatumNav
          scene={scene}
          beat={beat}
          isThumbnail={isThumbnail}
          language={lang}
          onNavigate={onNavigate}
        />
      </div>
    </div>
  );
}

/* ── Metadata (structurally aligned across en/zh) ── */
export function getMetadata(lang: "en" | "zh"): StyleMetadata {
  const en: StyleMetadata = {
    id: STYLE_ID,
    band: "minimal-keynote",
    name: "Objective Swiss Grid",
    theme: "Anatomy of a Timetable",
    densityLabel: "Data-dense",
    heroScene: 3,
    colors: { bg: "#F5F3EE", ink: "#17171B", panel: "#ECEAE3" },
    typography: { header: "Archivo", body: "Archivo" },
    tags: [
      "systematic",
      "objective",
      "rigorous",
      "swiss",
      "international-typographic",
      "grid",
      "hairline",
      "achromatic",
      "signal-color",
      "tabular",
      "information-design",
      "precise",
      "flush-left",
    ],
    fonts: ["Archivo", "cjk:Noto Sans SC"],
    scenes: [
      {
        id: 1,
        title: "Anatomy of a Timetable",
        beats: [
          {
            id: 0,
            action: "Grid rules draw in",
            title: "Anatomy of a Timetable",
            body: "A departure board, dismantled to the grid beneath it.",
          },
        ],
      },
      {
        id: 2,
        title: "The grid exposed",
        beats: [
          {
            id: 0,
            action: "Rules appear",
            title: "The grid, worn with pride",
            body: "Hairline columns and baselines surface as structure.",
          },
          {
            id: 1,
            action: "Labels appear",
            title: "Columns × baselines",
            body: "Every placement now answers to a coordinate.",
          },
        ],
      },
      {
        id: 3,
        title: "Reading the data",
        beats: [
          {
            id: 0,
            action: "First departures",
            title: "Reading the data",
            body: "The board begins to fill, cell by cell.",
          },
          {
            id: 1,
            action: "The board fills",
            title: "Reading the data",
            body: "Tabular figures snap to the grid.",
          },
          {
            id: 2,
            action: "Now marker set",
            title: "Reading the data",
            body: "One signal line marks the current moment.",
          },
        ],
      },
      {
        id: 4,
        title: "The exception",
        beats: [
          {
            id: 0,
            action: "The clean read",
            title: "The exception",
            body: "Five services hold the timetable exactly.",
          },
          {
            id: 1,
            action: "One row flagged",
            title: "The exception",
            body: "A single signal hue carries the only delay.",
          },
        ],
      },
      {
        id: 5,
        title: "Order restored",
        beats: [
          {
            id: 0,
            action: "System resolves",
            title: "Order restored",
            body: "The system reads clean; the grid takes the credit.",
          },
        ],
      },
    ],
  };

  const zh: StyleMetadata = {
    id: STYLE_ID,
    band: "minimal-keynote",
    name: "客观瑞士网格",
    theme: "时刻表解剖",
    densityLabel: "高密度",
    heroScene: 3,
    colors: { bg: "#F5F3EE", ink: "#17171B", panel: "#ECEAE3" },
    typography: { header: "Archivo", body: "Archivo" },
    tags: [
      "系统化",
      "客观",
      "严谨",
      "瑞士风格",
      "国际主义排版",
      "网格",
      "细线",
      "无彩色",
      "信号色",
      "等宽数字",
      "信息设计",
      "精确",
      "左对齐",
    ],
    fonts: ["Archivo", "cjk:Noto Sans SC"],
    scenes: [
      {
        id: 1,
        title: "时刻表解剖",
        beats: [
          {
            id: 0,
            action: "网格线绘入",
            title: "时刻表解剖",
            body: "一块发车牌，拆解回它底下的网格。",
          },
        ],
      },
      {
        id: 2,
        title: "暴露网格",
        beats: [
          {
            id: 0,
            action: "线条出现",
            title: "被公开示人的网格",
            body: "细线列与基线作为结构浮现出来。",
          },
          {
            id: 1,
            action: "标注出现",
            title: "列 × 基线",
            body: "此刻每一处落位都对应一个坐标。",
          },
        ],
      },
      {
        id: 3,
        title: "读取数据",
        beats: [
          {
            id: 0,
            action: "首班发车",
            title: "读取数据",
            body: "发车牌开始逐格填入。",
          },
          {
            id: 1,
            action: "填满表格",
            title: "读取数据",
            body: "等宽数字对齐到网格。",
          },
          {
            id: 2,
            action: "标出此刻",
            title: "读取数据",
            body: "一条信号线标出当前时刻。",
          },
        ],
      },
      {
        id: 4,
        title: "例外一行",
        beats: [
          {
            id: 0,
            action: "干净的读取",
            title: "例外一行",
            body: "五趟车都精准贴合时刻表。",
          },
          {
            id: 1,
            action: "标记一行",
            title: "例外一行",
            body: "唯一的信号色只承载这一处晚点。",
          },
        ],
      },
      {
        id: 5,
        title: "秩序复位",
        beats: [
          {
            id: 0,
            action: "系统复位",
            title: "秩序复位",
            body: "系统读起来干净利落；功劳归于网格。",
          },
        ],
      },
    ],
  };

  return lang === "zh" ? zh : en;
}

export const objectiveSwissGridTopic = defineStyleTopic({
  id: "anatomy-timetable",
  topic: { en: "Anatomy of a Timetable", zh: "时刻表解剖" },
  model: MODEL,
  component: ObjectiveSwissGridV3,
  getMetadata,
});

export default ObjectiveSwissGridV3;

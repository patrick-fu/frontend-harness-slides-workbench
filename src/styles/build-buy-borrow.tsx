import type { BespokeStyleProps, StyleMetadata } from "../types";
import { defineStyleTopic } from "./topic";
import { curatedNavigationAttributes } from "./curated-topic-contract";
import SpatialSceneTrack from "./SpatialSceneTrack";
import type { SceneTransitionMap } from "./SpatialSceneTrack";

/* ────────────────────────────────────────────────────────────────────────
 * Benchmark Matrix — v3 · "Build vs Buy vs Borrow"
 * A fair, like-against-like evaluation matrix. Judgment moves from surface
 * metrics (speed, upfront cost) toward structural capability (control,
 * differentiation, long-run cost). Motion is clarifying only.
 * ──────────────────────────────────────────────────────────────────────── */

type Loc = { en: string; zh: string };
type Lang = "en" | "zh";
type OptKey = "build" | "buy" | "borrow";
type Tone = "pos" | "neg" | "neutral";

/* Palette — bright neutral ground, reserved positive/negative result tones. */
const C = {
  bg: "#F4F6F8",
  ink: "#151A22",
  inkSoft: "#5B6473",
  panel: "#FFFFFF",
  tint: "#FAFBFC",
  rowHead: "#EFF2F5",
  headFill: "#E9EDF2",
  line: "#D7DCE3",
  pos: "#12805C",
  posBg: "#E3F2EB",
  neg: "#BE2C33",
  negBg: "#FBE9EA",
};

const FONT = '"Inter","Noto Sans SC",system-ui,-apple-system,sans-serif';

const TRANSITIONS: SceneTransitionMap = {
  "1->2": "slide-y",
  "2->3": "slide-y",
  "3->4": "fade",
  "4->5": "scale-fade",
};

const AXIS = {
  row: { en: "Criteria", zh: "评估维度" } as Loc,
  col: { en: "Options", zh: "候选方案" } as Loc,
  brand: { en: "Benchmark Matrix", zh: "基准矩阵" } as Loc,
  legendPos: { en: "Meets the bar", zh: "达标" } as Loc,
  legendNeg: { en: "Falls short", zh: "不足" } as Loc,
  callTag: { en: "The call", zh: "最终选择" } as Loc,
};

const OPTIONS: { key: OptKey; label: Loc; sub: Loc }[] = [
  { key: "build", label: { en: "Build", zh: "自建" }, sub: { en: "In-house", zh: "内部自研" } },
  { key: "buy", label: { en: "Buy", zh: "采购" }, sub: { en: "Vendor SaaS", zh: "供应商 SaaS" } },
  { key: "borrow", label: { en: "Borrow", zh: "借用" }, sub: { en: "Open source", zh: "开源集成" } },
];

const ROWS: {
  label: Loc;
  winner: OptKey;
  cells: { key: OptKey; v: Loc; tone: Tone; standout?: boolean }[];
}[] = [
  {
    label: { en: "Time to value", zh: "上线周期" },
    winner: "buy",
    cells: [
      { key: "build", v: { en: "24 wks", zh: "24 周" }, tone: "neg" },
      { key: "buy", v: { en: "2 wks", zh: "2 周" }, tone: "pos", standout: true },
      { key: "borrow", v: { en: "6 wks", zh: "6 周" }, tone: "neutral" },
    ],
  },
  {
    label: { en: "Upfront cost", zh: "前期成本" },
    winner: "buy",
    cells: [
      { key: "build", v: { en: "$480K", zh: "48 万" }, tone: "neg" },
      { key: "buy", v: { en: "$60K", zh: "6 万" }, tone: "pos" },
      { key: "borrow", v: { en: "$150K", zh: "15 万" }, tone: "neutral" },
    ],
  },
  {
    label: { en: "3-yr TCO", zh: "三年总成本" },
    winner: "build",
    cells: [
      { key: "build", v: { en: "$1.1M", zh: "110 万" }, tone: "pos" },
      { key: "buy", v: { en: "$2.6M", zh: "260 万" }, tone: "neg", standout: true },
      { key: "borrow", v: { en: "$1.4M", zh: "140 万" }, tone: "neutral" },
    ],
  },
  {
    label: { en: "Control & fit", zh: "可控与契合" },
    winner: "build",
    cells: [
      { key: "build", v: { en: "Full", zh: "完全" }, tone: "pos", standout: true },
      { key: "buy", v: { en: "Limited", zh: "受限" }, tone: "neg" },
      { key: "borrow", v: { en: "Partial", zh: "部分" }, tone: "neutral" },
    ],
  },
  {
    label: { en: "Differentiation", zh: "差异化能力" },
    winner: "build",
    cells: [
      { key: "build", v: { en: "High", zh: "高" }, tone: "pos", standout: true },
      { key: "buy", v: { en: "None", zh: "无" }, tone: "neg" },
      { key: "borrow", v: { en: "Low", zh: "低" }, tone: "neutral" },
    ],
  },
];

/* Metadata scenes — 5 scenes, beats 1 / 3 / 3 / 2 / 1. */
const META_SCENES: {
  id: number;
  title: Loc;
  beats: { action: Loc; title: Loc; body: Loc }[];
}[] = [
  {
    id: 1,
    title: { en: "The comparison frame", zh: "对比框架" },
    beats: [
      {
        action: { en: "frame", zh: "立框" },
        title: { en: "One matrix, three options", zh: "一张矩阵，三种选择" },
        body: { en: "Judge build, buy and borrow like against like.", zh: "把自建、采购、借用放在同一标尺上比较。" },
      },
    ],
  },
  {
    id: 2,
    title: { en: "Three ways to get there", zh: "三条路径" },
    beats: [
      {
        action: { en: "reveal-build", zh: "展开自建" },
        title: { en: "Build in-house", zh: "内部自建" },
        body: { en: "Own the code and the roadmap.", zh: "掌握代码与路线图。" },
      },
      {
        action: { en: "reveal-buy", zh: "展开采购" },
        title: { en: "Buy a vendor", zh: "采购供应商" },
        body: { en: "Rent a finished SaaS product.", zh: "租用成熟的 SaaS 产品。" },
      },
      {
        action: { en: "reveal-borrow", zh: "展开借用" },
        title: { en: "Borrow open source", zh: "借用开源" },
        body: { en: "Adopt and integrate a community core.", zh: "集成社区开源内核。" },
      },
    ],
  },
  {
    id: 3,
    title: { en: "What we actually measure", zh: "真正要衡量的" },
    beats: [
      {
        action: { en: "rows-cost", zh: "填成本行" },
        title: { en: "Speed and cost first", zh: "先看速度与成本" },
        body: { en: "Time to value and upfront spend fill in.", zh: "上线周期与前期投入先落格。" },
      },
      {
        action: { en: "rows-run", zh: "填运营行" },
        title: { en: "Then the running truth", zh: "再看长期真相" },
        body: { en: "Three-year TCO and fit reveal down the column.", zh: "三年总成本与契合度逐行揭示。" },
      },
      {
        action: { en: "emphasize", zh: "强调关键" },
        title: { en: "Standout figures", zh: "关键数字" },
        body: { en: "The numbers that move the decision are lifted.", zh: "真正左右决策的数字被抬升。" },
      },
    ],
  },
  {
    id: 4,
    title: { en: "Where each option wins", zh: "各自赢在哪" },
    beats: [
      {
        action: { en: "promote", zh: "抬升优胜" },
        title: { en: "Winners promoted", zh: "抬升胜出格" },
        body: { en: "The best cell in every row lights up.", zh: "每一行最优格被点亮。" },
      },
      {
        action: { en: "dim", zh: "压暗落败" },
        title: { en: "Losers recede", zh: "落败者退场" },
        body: { en: "Surface wins fade; structural strength stays.", zh: "表面优势淡出，结构优势留存。" },
      },
    ],
  },
  {
    id: 5,
    title: { en: "The call", zh: "最终选择" },
    beats: [
      {
        action: { en: "box-choice", zh: "框定选择" },
        title: { en: "Build takes it", zh: "自建胜出" },
        body: {
          en: "Surface metrics favor Buy; structural capability favors Build.",
          zh: "表面指标偏向采购，结构能力偏向自建。",
        },
      },
    ],
  },
];

const p = (l: Loc, lang: Lang) => l[lang];
const toneColor = (t: Tone) => (t === "pos" ? C.pos : t === "neg" ? C.neg : C.inkSoft);

/* ── Scene content ───────────────────────────────────────────────────────── */
function MatrixScene(props: {
  scene: number;
  beat: number;
  isActive: boolean;
  language: Lang;
  isThumbnail: boolean;
  reducedMotion: boolean;
  onNavigate?: (scene: number, beat: number) => void;
}) {
  const { scene, beat, isActive, language, isThumbnail, reducedMotion, onNavigate } = props;
  const lang = language;

  const motion = !(reducedMotion || isThumbnail);
  const dur = motion ? "520ms" : "0s";
  const easeReveal = motion ? "cubic-bezier(0.22, 0.61, 0.36, 1)" : "linear";

  // Progressive state derived from scene + beat (reserved layout, opacity toggles).
  const columnsFilled = scene <= 1 ? 0 : scene === 2 ? beat + 1 : 3;
  const rowsFilled = scene <= 2 ? 0 : scene === 3 ? (beat === 0 ? 2 : beat === 1 ? 4 : 5) : 5;
  const emphasize = (scene === 3 && beat >= 2) || scene >= 4;
  const verdict = scene >= 4;
  const dimLosers = (scene === 4 && beat >= 1) || scene === 5;
  const boxed = scene === 5;

  const sceneRoot: React.CSSProperties = {
    position: "relative",
    width: "100%",
    height: "100%",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    padding: "5cqh 4.5cqw 8.5cqh",
    background: C.bg,
    color: C.ink,
    fontFamily: FONT,
    overflow: "hidden",
  };

  const grid: React.CSSProperties = {
    position: "relative",
    flex: 1,
    display: "grid",
    gridTemplateColumns: "20cqw 1fr 1fr 1fr",
    gridTemplateRows: "12cqh repeat(5, 1fr)",
    gap: "0.12cqw",
    background: C.line,
    border: `0.12cqw solid ${C.line}`,
    fontVariantNumeric: "tabular-nums lining-nums",
    fontFeatureSettings: '"tnum" 1, "lnum" 1',
  };

  const baseCell: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    boxSizing: "border-box",
    transition: `opacity ${dur} ${easeReveal}, background ${dur} ${easeReveal}, box-shadow ${dur} ${easeReveal}`,
  };

  return (
    <div style={sceneRoot}>
      {/* Header: brand eyebrow, scene title, result legend */}
      <header style={{ marginBottom: "2.4cqh", flex: "0 0 auto" }}>
        <div
          style={{
            fontSize: "1.3cqw",
            letterSpacing: "0.4cqw",
            textTransform: "uppercase",
            color: C.inkSoft,
            fontWeight: 600,
          }}
        >
          {p(AXIS.brand, lang)} · 0{scene}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            marginTop: "0.9cqh",
            gap: "2cqw",
          }}
        >
          <h2 style={{ margin: 0, fontSize: "3.2cqw", fontWeight: 700, lineHeight: 1.02, letterSpacing: "-0.03cqw" }}>
            {p(META_SCENES[scene - 1].title, lang)}
          </h2>
          <div style={{ display: "flex", gap: "1.8cqw", flex: "0 0 auto", paddingBottom: "0.4cqh" }}>
            <LegendChip color={C.pos} bg={C.posBg} label={p(AXIS.legendPos, lang)} />
            <LegendChip color={C.neg} bg={C.negBg} label={p(AXIS.legendNeg, lang)} />
          </div>
        </div>
      </header>

      {/* The matrix — reserved layout marked for the beat protocol */}
      <div style={grid} data-beat-layout-container="true" data-beat-layout-mode="reserved">
        {/* corner axis cell */}
        <div
          style={{
            ...baseCell,
            background: C.headFill,
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "flex-start",
            padding: "0 1.4cqw",
            gap: "0.4cqh",
          }}
        >
          <span style={{ fontSize: "1.2cqw", color: C.inkSoft, letterSpacing: "0.12cqw" }}>
            {p(AXIS.col, lang)} →
          </span>
          <span style={{ fontSize: "1.35cqw", color: C.ink, fontWeight: 600 }}>{p(AXIS.row, lang)} ↓</span>
        </div>

        {/* option header cells */}
        {OPTIONS.map((opt, i) => {
          const filled = i < columnsFilled;
          const isBuild = opt.key === "build";
          const columnDim = dimLosers && !isBuild;
          const headerWin = boxed && isBuild;
          return (
            <div
              key={opt.key}
              data-beat-layout-item="true"
              style={{
                ...baseCell,
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
                background: C.headFill,
                opacity: columnDim ? 0.34 : 1,
                padding: "0 1cqw",
              }}
            >
              <span
                style={{
                  position: "relative",
                  fontSize: "2.4cqw",
                  fontWeight: headerWin ? 800 : 700,
                  color: headerWin ? C.pos : C.ink,
                  opacity: filled ? 1 : 0,
                  transition: `opacity ${dur} ${easeReveal}, color ${dur} ${easeReveal}`,
                  letterSpacing: "-0.02cqw",
                }}
              >
                {p(opt.label, lang)}
              </span>
              <span
                style={{
                  fontSize: "1.35cqw",
                  color: C.inkSoft,
                  marginTop: "0.5cqh",
                  opacity: filled ? 1 : 0,
                  transition: `opacity ${dur} ${easeReveal}`,
                }}
              >
                {p(opt.sub, lang)}
              </span>
              {!filled && (
                <span style={{ position: "absolute", fontSize: "2.2cqw", color: C.line, fontWeight: 600 }}>—</span>
              )}
            </div>
          );
        })}

        {/* criteria rows */}
        {ROWS.map((row, r) => {
          const rowFilled = r < rowsFilled;
          const rowBg = r % 2 === 0 ? C.panel : C.tint;
          return (
            <FragmentRow
              key={r}
              rowIndex={r}
              rowLabel={p(row.label, lang)}
            >
              {row.cells.map((cell) => {
                const isBuild = cell.key === "build";
                const columnDim = dimLosers && !isBuild;
                const isWinner = verdict && row.winner === cell.key;
                const cellVis: React.CSSProperties = {
                  ...baseCell,
                  justifyContent: "center",
                  background: isWinner ? C.posBg : rowBg,
                  boxShadow: isWinner ? `inset 0 0 0 0.24cqw ${C.pos}` : "inset 0 0 0 0 transparent",
                  opacity: columnDim ? 0.3 : 1,
                  padding: "0 1cqw",
                };
                return (
                  <div key={cell.key} data-beat-layout-item="true" style={cellVis}>
                    {rowFilled ? (
                      <span
                        style={{
                          fontSize: cell.standout ? "2.7cqw" : "2.15cqw",
                          fontWeight: cell.standout ? 700 : 600,
                          color: toneColor(cell.tone),
                          transform: emphasize && cell.standout ? "scale(1.07)" : "scale(1)",
                          transition: `transform ${dur} ${easeReveal}, opacity ${dur} ${easeReveal}, color ${dur} ${easeReveal}`,
                          opacity: 1,
                          letterSpacing: "-0.02cqw",
                        }}
                      >
                        {p(cell.v, lang)}
                      </span>
                    ) : (
                      <span style={{ fontSize: "2cqw", color: C.line, fontWeight: 600 }}>·</span>
                    )}
                  </div>
                );
              })}
            </FragmentRow>
          );
        })}

        {/* the call — box the chosen (Build) column, spanning header + all rows */}
        {boxed && (
          <div
            aria-hidden
            style={{
              gridColumn: "2",
              gridRow: "1 / -1",
              pointerEvents: "none",
              margin: "0.35cqw",
              border: `0.42cqw solid ${C.pos}`,
              borderRadius: "0.9cqw",
              boxShadow: motion ? `0 0 0 0.9cqw ${C.posBg}` : "none",
              zIndex: 4,
              position: "relative",
            }}
          >
            <span
              style={{
                position: "absolute",
                top: "-1.6cqh",
                left: "50%",
                transform: "translateX(-50%)",
                background: C.pos,
                color: "#FFFFFF",
                fontSize: "1.25cqw",
                fontWeight: 700,
                letterSpacing: "0.14cqw",
                padding: "0.4cqh 1.1cqw",
                borderRadius: "0.6cqw",
                whiteSpace: "nowrap",
              }}
            >
              {p(AXIS.callTag, lang)}
            </span>
          </div>
        )}
      </div>

      {/* N2 — bottom progress dots (nav prototype). Hidden in thumbnails. */}
      {isActive && !isThumbnail && (
        <nav
          {...curatedNavigationAttributes("benchmark-matrix", "build-buy-borrow")}
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: "2.8cqh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "1.3cqw",
          }}
        >
          {[1, 2, 3, 4, 5].map((n) => {
            const on = n === scene;
            return (
              <button
                key={n}
                aria-label={`Scene ${n}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigate?.(n, 0);
                }}
                style={{
                  border: "none",
                  padding: 0,
                  cursor: "pointer",
                  height: "1cqh",
                  width: on ? "3.4cqw" : "1cqh",
                  borderRadius: "0.6cqh",
                  background: on ? C.ink : "#C5CBD3",
                  transition: `width ${dur} ${easeReveal}, background ${dur} ${easeReveal}`,
                }}
              />
            );
          })}
        </nav>
      )}
    </div>
  );
}

function LegendChip({ color, bg, label }: { color: string; bg: string; label: string }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: "0.6cqw", fontSize: "1.35cqw", color: C.inkSoft }}>
      <span
        style={{
          width: "1.5cqw",
          height: "1.5cqw",
          borderRadius: "0.35cqw",
          background: bg,
          boxShadow: `inset 0 0 0 0.2cqw ${color}`,
        }}
      />
      {label}
    </span>
  );
}

function FragmentRow({
  rowIndex,
  rowLabel,
  children,
}: {
  rowIndex: number;
  rowLabel: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          background: C.rowHead,
          padding: "0 1.4cqw",
          fontSize: "1.85cqw",
          fontWeight: 600,
          color: C.ink,
          gridColumn: "1",
          gridRow: String(rowIndex + 2),
        }}
      >
        {rowLabel}
      </div>
      {children}
    </>
  );
}

/* ── Root component ──────────────────────────────────────────────────────── */
function BenchmarkMatrixV3(props: BespokeStyleProps) {
  const { scene, beat, language, isThumbnail, reducedMotion, onNavigate } = props;

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        background: C.bg,
        color: C.ink,
        fontFamily: FONT,
        overflow: "hidden",
      }}
    >
      <SpatialSceneTrack
        scene={scene}
        beat={beat}
        transitionKind="slide-y"
        transitionMap={TRANSITIONS}
        reducedMotion={reducedMotion || isThumbnail}
        beatLayoutModes={{ 2: "reserved", 3: "reserved", 4: "reserved" }}
        renderScene={(sceneId: number, sceneBeat: number, isActive: boolean) => (
          <MatrixScene
            scene={sceneId}
            beat={sceneBeat}
            isActive={isActive}
            language={language}
            isThumbnail={isThumbnail}
            reducedMotion={reducedMotion}
            onNavigate={onNavigate}
          />
        )}
      />
    </div>
  );
}

/* ── Metadata (en / zh structurally identical) ───────────────────────────── */
export function getMetadata(lang: Lang): StyleMetadata {
  return {
    id: "benchmark-matrix",
    band: "balanced-hybrid",
    name: lang === "en" ? "Benchmark Matrix" : "基准矩阵",
    theme: lang === "en" ? "Build vs Buy vs Borrow" : "自建还是买",
    densityLabel: lang === "en" ? "Dense comparison" : "密集对比",
    heroScene: 3,
    colors: { bg: C.bg, ink: C.ink, panel: C.panel },
    typography: { header: "Inter", body: "Inter" },
    tags:
      lang === "en"
        ? ["analytical", "even-handed", "dense", "tabular figures", "clarifying motion"]
        : ["分析式", "公允", "高密度", "表格数字", "澄清式动效"],
    fonts: ["Inter:wght@400;500;600;700", "cjk:Noto Sans SC:wght@400;500;700"],
    scenes: META_SCENES.map((s) => ({
      id: s.id,
      title: p(s.title, lang),
      beats: s.beats.map((b, i) => ({
        id: i,
        action: p(b.action, lang),
        title: p(b.title, lang),
        body: p(b.body, lang),
      })),
    })),
  } as StyleMetadata;
}

export const benchmarkMatrixTopic = defineStyleTopic({
  id: "build-buy-borrow",
  topic: { en: "Build vs Buy vs Borrow", zh: "自建还是买" },
  model: "Claude Opus 4.8",
  component: BenchmarkMatrixV3,
  getMetadata,
});

export default BenchmarkMatrixV3;

import SpatialSceneTrack from "./SpatialSceneTrack";
import type { SceneTransitionMap } from "./SpatialSceneTrack";
import { useFLIP } from "../hooks/useFLIP";
import { defineStyleTopic } from "./topic";
import { curatedNavigationAttributes } from "./curated-topic-contract";
import type { BespokeStyleProps, StyleMetadata } from "../types";
import styles from "./drawing-a-bridge.module.css";

/* ───────────────────────── palette (real hex) ───────────────────────── */
const C = {
  bg: "#0b2e4f",
  ink: "#eaf1f7",
  panel: "#0a2a48",
  construct: "#4a86b8",
  keyline: "#eef4f9",
  cable: "#cfe0ee",
  warm: "#e4632b",
};

/* ───────────────────────── bilingual content pack ───────────────────────── */
type Beat = { action: string; title: string; body: string };
type ScenePack = { title: string; beats: Beat[] };
interface Pack {
  scenes: ScenePack[];
  kicker: string;
  sheetTitle: string[];
  subtitle: string;
  tbHead: string;
  navTitle: string;
  stamp: string;
  spanDim: string;
  heightDim: string;
  tolText: string;
  tbRows: { k: string; v: string }[];
  revDraft: string;
  revApproved: string;
}

const EN: Pack = {
  kicker: "DRAWING OFFICE · SHEET 05",
  sheetTitle: ["BRIDGE", "GENERAL ARRANGEMENT"],
  subtitle: "Cable-stayed crossing · scale 1:2000 · drawn by hand, not generated",
  tbHead: "TITLE BLOCK",
  navTitle: "SHEET",
  stamp: "APPROVED",
  spanDim: "420 M",
  heightDim: "84 M",
  tolText: "±2 MM TOL",
  revDraft: "—",
  revApproved: "C",
  tbRows: [
    { k: "DRAWING", v: "BR-05" },
    { k: "SCALE", v: "1:2000" },
    { k: "DATE", v: "2026-07" },
    { k: "DRAWN", v: "C.OPUS" },
  ],
  scenes: [
    {
      title: "TITLE BLOCK",
      beats: [
        { action: "LOAD SHEET", title: "Bridge — General Arrangement", body: "Sheet title and drawing-office metadata draw onto Prussian-blue stock." },
      ],
    },
    {
      title: "THE SPAN",
      beats: [
        { action: "SET OUT", title: "Construction lines", body: "Center lines and datum guides laid down in pale cyan before any structure." },
        { action: "DRAW DECK", title: "Deck & pylons", body: "Deck girder and twin pylons inked as chalk-white key-lines." },
        { action: "RIG CABLES", title: "Stay cables", body: "The fan of stay cables completes the cable-stayed span." },
      ],
    },
    {
      title: "THE LOADS",
      beats: [
        { action: "DIMENSION", title: "Span & height", body: "Uppercase callouts fix the 420 m span and 84 m pylon height." },
        { action: "APPLY FORCE", title: "Load arrows", body: "Dead and live loads annotated as downward force arrows with pier reactions." },
      ],
    },
    {
      title: "THE TOLERANCE",
      beats: [
        { action: "LOCATE JOINT", title: "Critical joint", body: "The deck-to-pylon anchorage is ringed as the governing detail." },
        { action: "FLAG", title: "Warm annotation", body: "A single drafting-red leader points to the anchorage." },
        { action: "NOTE TOL", title: "Hold to ±2 mm", body: "Fabrication tolerance called out by hand: hold the anchorage to ±2 mm." },
      ],
    },
    {
      title: "APPROVED",
      beats: [
        { action: "STAMP", title: "Approved for construction", body: "The revision stamp hard-cuts into the title block: REV C, approved." },
      ],
    },
  ],
};

const ZH: Pack = {
  kicker: "制图室 · 图页 05",
  sheetTitle: ["桥梁", "总布置图"],
  subtitle: "斜拉桥跨 · 比例 1:2000 · 手绘落线，非生成",
  tbHead: "标题栏",
  navTitle: "图页",
  stamp: "批准",
  spanDim: "420 米",
  heightDim: "84 米",
  tolText: "±2 毫米",
  revDraft: "—",
  revApproved: "C",
  tbRows: [
    { k: "图号", v: "BR-05" },
    { k: "比例", v: "1:2000" },
    { k: "日期", v: "2026-07" },
    { k: "制图", v: "C.OPUS" },
  ],
  scenes: [
    {
      title: "标题栏",
      beats: [
        { action: "载入图纸", title: "桥梁 — 总布置图", body: "图名与制图室信息在普鲁士蓝底纹上逐行绘出。" },
      ],
    },
    {
      title: "跨度",
      beats: [
        { action: "放样", title: "构造线", body: "先用浅青色画出中心线与基准导线，再落任何结构。" },
        { action: "绘制桥面", title: "桥面与桥塔", body: "以粉白主线勾出桥面梁与双塔。" },
        { action: "张拉拉索", title: "斜拉索", body: "扇形斜拉索完成整座斜拉桥跨。" },
      ],
    },
    {
      title: "荷载",
      beats: [
        { action: "标注尺寸", title: "跨度与塔高", body: "大写标注锁定 420 米跨度与 84 米塔高。" },
        { action: "施加力", title: "荷载箭头", body: "恒载与活载以向下力箭头标注，并给出桥墩反力。" },
      ],
    },
    {
      title: "公差",
      beats: [
        { action: "定位节点", title: "关键节点", body: "桥面与桥塔锚固处被圈定为控制性细部。" },
        { action: "标记", title: "暖色批注", body: "一根制图红引线指向该锚固节点。" },
        { action: "标注公差", title: "控制在 ±2 毫米", body: "手写标注加工公差：锚固处控制在 ±2 毫米。" },
      ],
    },
    {
      title: "批准",
      beats: [
        { action: "盖章", title: "批准施工", body: "修订章硬切落入标题栏：REV C，已批准。" },
      ],
    },
  ],
};

const PACKS: Record<"en" | "zh", Pack> = { en: EN, zh: ZH };

/* ───────────────────────── diagram primitives ───────────────────────── */
function DLine(props: {
  x1: number; y1: number; x2: number; y2: number;
  shown: boolean; stroke: string; width: number; opacity?: number;
}) {
  const { x1, y1, x2, y2, shown, stroke, width, opacity = 1 } = props;
  const len = Math.hypot(x2 - x1, y2 - y1);
  return (
    <line
      className={styles.line}
      x1={x1} y1={y1} x2={x2} y2={y2}
      stroke={stroke} strokeWidth={width} opacity={opacity}
      style={{ strokeDasharray: len, strokeDashoffset: shown ? 0 : len }}
    />
  );
}

const LEFT_CABLES = [110, 180, 250, 420, 490];
const RIGHT_CABLES = [510, 580, 750, 820, 890];
const FORCE_XS = [200, 340, 500, 660, 800];

/* orthographic cable-stayed bridge, coordinate space 1000 x 560 */
function Diagram({ scene, beat }: { scene: number; beat: number }) {
  const construct = true; // always laid first
  const deck = scene === 2 ? beat >= 1 : true;
  const cables = scene === 2 ? beat >= 2 : true;
  const dims = scene === 3;
  const forces = scene === 3 && beat >= 1;
  const ring = scene === 4;
  const leader = scene === 4 && beat >= 1;
  const tol = scene === 4 && beat >= 2;
  const faint = scene === 1;

  return (
    <div className={styles.diagram} aria-hidden style={{ opacity: faint ? 0.28 : 1 }}>
      <svg viewBox="0 0 1000 560" preserveAspectRatio="xMidYMid meet">
        {/* construction lines — pale cyan geometry */}
        <g>
          <DLine x1={500} y1={40} x2={500} y2={470} shown={construct} stroke={C.construct} width={0.8} opacity={0.55} />
          <DLine x1={40} y1={250} x2={960} y2={250} shown={construct} stroke={C.construct} width={0.8} opacity={0.5} />
          <DLine x1={40} y1={430} x2={960} y2={430} shown={construct} stroke={C.construct} width={1} opacity={0.6} />
          <DLine x1={340} y1={40} x2={340} y2={470} shown={construct} stroke={C.construct} width={0.6} opacity={0.4} />
          <DLine x1={660} y1={40} x2={660} y2={470} shown={construct} stroke={C.construct} width={0.6} opacity={0.4} />
        </g>

        {/* stay cables — chalk, drawn at beat 2 */}
        <g>
          {LEFT_CABLES.map((x) => (
            <DLine key={`l${x}`} x1={340} y1={70} x2={x} y2={250} shown={cables} stroke={C.cable} width={1} />
          ))}
          {RIGHT_CABLES.map((x) => (
            <DLine key={`r${x}`} x1={660} y1={70} x2={x} y2={250} shown={cables} stroke={C.cable} width={1} />
          ))}
        </g>

        {/* deck + pylons — chalk key-lines, drawn at beat 1 */}
        <g>
          <DLine x1={40} y1={248} x2={960} y2={248} shown={deck} stroke={C.keyline} width={2} />
          <DLine x1={40} y1={253} x2={960} y2={253} shown={deck} stroke={C.keyline} width={2} />
          <DLine x1={340} y1={70} x2={340} y2={430} shown={deck} stroke={C.keyline} width={2.4} />
          <DLine x1={660} y1={70} x2={660} y2={430} shown={deck} stroke={C.keyline} width={2.4} />
          {/* deck end piers */}
          <DLine x1={60} y1={253} x2={60} y2={430} shown={deck} stroke={C.keyline} width={1.6} />
          <DLine x1={940} y1={253} x2={940} y2={430} shown={deck} stroke={C.keyline} width={1.6} />
        </g>

        {/* dimensions — scene 3 */}
        {dims && (
          <g stroke={C.construct} strokeWidth={0.8} opacity={0.85}>
            <line x1={340} y1={470} x2={660} y2={470} />
            <line x1={340} y1={462} x2={340} y2={478} />
            <line x1={660} y1={462} x2={660} y2={478} />
            <line x1={300} y1={70} x2={300} y2={250} />
            <line x1={292} y1={70} x2={308} y2={70} />
            <line x1={292} y1={250} x2={308} y2={250} />
          </g>
        )}

        {/* force arrows — scene 3 beat 1 (reserved slot: opacity) */}
        <g className={styles.fx} style={{ opacity: forces ? 1 : 0 }} stroke={C.keyline} strokeWidth={1.4}>
          {FORCE_XS.map((x) => (
            <g key={`f${x}`}>
              <line x1={x} y1={205} x2={x} y2={243} />
              <line x1={x - 6} y1={233} x2={x} y2={243} />
              <line x1={x + 6} y1={233} x2={x} y2={243} />
            </g>
          ))}
          {[340, 660].map((x) => (
            <g key={`rx${x}`} opacity={0.8}>
              <line x1={x} y1={430} x2={x} y2={392} />
              <line x1={x - 6} y1={402} x2={x} y2={392} />
              <line x1={x + 6} y1={402} x2={x} y2={392} />
            </g>
          ))}
        </g>

        {/* warm annotation — scene 4, the single scarce accent */}
        <g>
          <circle
            cx={660} cy={250} r={26} fill="none"
            className={styles.fx}
            stroke={leader ? C.warm : C.construct}
            strokeWidth={leader ? 2 : 1}
            opacity={ring ? (leader ? 1 : 0.7) : 0}
          />
          <g className={styles.fx} style={{ opacity: leader ? 1 : 0 }} stroke={C.warm} strokeWidth={2}>
            <line x1={686} y1={236} x2={800} y2={150} />
            <line x1={800} y1={150} x2={900} y2={150} />
          </g>
          <text
            className={styles.fx}
            x={806} y={140} fill={C.warm}
            fontSize={20} letterSpacing={2}
            style={{ opacity: tol ? 1 : 0, fontFamily: '"Space Mono", monospace', fontWeight: 700 }}
          >
            ±2 MM
          </text>
        </g>
      </svg>
    </div>
  );
}

/* ───────────────────────── scene content ───────────────────────── */
function BridgeScene({
  scene, beat, isActive, language, reducedMotion, isThumbnail,
}: {
  scene: number; beat: number; isActive: boolean;
  language: "en" | "zh"; reducedMotion: boolean; isThumbnail: boolean;
}) {
  const pack = PACKS[language];
  const still = reducedMotion || isThumbnail;
  const mode = scene === 2 ? "motion" : "reserved";
  const rows = pack.scenes[scene - 1].beats;

  const { ref } = useFLIP<HTMLDivElement>({
    watch: [beat],
    disabled: still || !isActive || scene !== 2,
    duration: 480,
    easing: "cubic-bezier(0.34, 1.56, 0.64, 1)",
    selector: '[data-beat-layout-item="true"]',
  });

  return (
    <div className={styles.sceneFill}>
      <div className={styles.grid} />
      <div className={styles.frame} />

      <Diagram scene={scene} beat={beat} />

      {/* scene 1 — sheet title draws in */}
      {scene === 1 && (
        <div className={styles.titleWrap}>
          <div className={isActive ? styles.animIn : undefined}>
            <div className={styles.kicker}>{pack.kicker}</div>
          </div>
          <div className={styles.bigTitle}>
            {pack.sheetTitle.map((l, i) => (
              <div key={i} className={isActive ? (i === 0 ? styles.animIn : styles.animIn2) : undefined}>
                {l}
              </div>
            ))}
          </div>
          <div className={isActive ? styles.animIn2 : undefined}>
            <div className={styles.subtitle}>{pack.subtitle}</div>
          </div>
        </div>
      )}

      {/* scenes 2–4 — callout column (beat-layout container) */}
      {(scene === 2 || scene === 3 || scene === 4) && (
        <div
          ref={ref}
          className={styles.callouts}
          data-beat-layout-container="true"
          data-beat-layout-mode={mode}
        >
          <div className={styles.calloutHeader}>{pack.scenes[scene - 1].title}</div>
          {rows.map((r, i) => {
            const reached = i <= beat;
            const rowStyle =
              mode === "motion"
                ? {
                    maxHeight: reached ? "18cqh" : "0",
                    opacity: reached ? 1 : 0,
                    marginTop: reached && i > 0 ? "2.4cqh" : "0",
                    overflow: "hidden",
                  }
                : {
                    opacity: reached ? 1 : 0.16,
                  };
            return (
              <div
                key={i}
                data-beat-layout-item="true"
                className={styles.calloutRow}
                style={rowStyle}
              >
                <span className={styles.calloutIndex}>{`${scene}.${i + 1}`}</span>
                <span
                  className={styles.calloutAction}
                  style={mode === "reserved" && reached ? { color: C.ink } : undefined}
                >
                  {r.action}
                </span>
                <span className={styles.calloutBody}>{r.title} — {r.body}</span>
              </div>
            );
          })}
        </div>
      )}

      {/* dimension text labels — scene 3 */}
      {scene === 3 && (
        <>
          <div style={{ position: "absolute", left: "58cqw", top: "78cqh", color: C.construct, fontSize: "1.6cqh", letterSpacing: "0.2cqw" }}>
            {pack.spanDim}
          </div>
          <div style={{ position: "absolute", left: "48.5cqw", top: "22cqh", color: C.construct, fontSize: "1.6cqh", letterSpacing: "0.2cqw" }}>
            {pack.heightDim}
          </div>
        </>
      )}

      {/* warm tolerance label — scene 4 beat 2 */}
      {scene === 4 && (
        <div
          className={styles.fx}
          style={{
            position: "absolute", left: "63cqw", top: "18cqh",
            color: C.warm, fontSize: "1.7cqh", fontWeight: 700, letterSpacing: "0.2cqw",
            opacity: beat >= 2 ? 1 : 0,
          }}
        >
          {pack.tolText}
        </div>
      )}

      {/* scene 5 — revision stamp hard-cuts in */}
      {scene === 5 && <div className={styles.stamp}>{pack.stamp}</div>}
    </div>
  );
}

/* ───────────────────────── transitions ───────────────────────── */
const TRANSITIONS: SceneTransitionMap = {
  "1->2": "wipe",
  "2->3": "wipe",
  "3->4": "slide-x",
  "4->5": "hard-cut",
};

/* ───────────────────────── root component ───────────────────────── */
function CyanotypeDraftingTableV3({
  scene, beat, language, isThumbnail, reducedMotion, onNavigate,
}: BespokeStyleProps) {
  const pack = PACKS[language];
  const still = reducedMotion || isThumbnail;

  return (
    <div className={styles.root} data-still={still ? "true" : "false"}>
      <SpatialSceneTrack
        scene={scene}
        beat={beat}
        transitionKind="wipe"
        transitionMap={TRANSITIONS}
        reducedMotion={reducedMotion || isThumbnail}
        beatLayoutModes={{ 2: "motion", 3: "reserved", 4: "reserved" }}
        renderScene={(sceneId, sceneBeat, isActive) => (
          <BridgeScene
            scene={sceneId}
            beat={sceneBeat}
            isActive={isActive}
            language={language}
            reducedMotion={reducedMotion}
            isThumbnail={isThumbnail}
          />
        )}
      />

      {/* title-block furniture (persistent, decorative) */}
      <div className={styles.titleBlock}>
        <div className={styles.tbHead}>{pack.tbHead}</div>
        {pack.tbRows.map((r) => (
          <div key={r.k} className={styles.tbRow}>
            <div className={styles.tbKey}>{r.k}</div>
            <div className={styles.tbVal}>{r.v}</div>
          </div>
        ))}
        <div className={styles.tbRow}>
          <div className={styles.tbKey}>REV</div>
          <div className={styles.tbVal} style={{ color: scene === 5 ? C.warm : C.ink }}>
            {scene === 5 ? pack.revApproved : pack.revDraft}
          </div>
        </div>
      </div>

      {/* revision-index navigation prototype */}
      {!isThumbnail && (
        <nav
          {...curatedNavigationAttributes("cyanotype-drafting-table", "drawing-a-bridge")}
          className={styles.revIndex}
          aria-label={pack.navTitle}
        >
          <div className={styles.revTitle}>{pack.navTitle}</div>
          <div className={styles.revRow}>
            {[1, 2, 3, 4, 5].map((s) => (
              <button
                key={s}
                type="button"
                className={styles.revCell}
                data-active={s === scene ? "true" : "false"}
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigate?.(s, 0);
                }}
              >
                {s}/5
              </button>
            ))}
          </div>
        </nav>
      )}
    </div>
  );
}

/* ───────────────────────── metadata ───────────────────────── */
export function getMetadata(lang: "en" | "zh"): StyleMetadata {
  const pack = PACKS[lang];
  return {
    id: "cyanotype-drafting-table",
    band: "minimal-keynote",
    name: lang === "en" ? "Cyanotype Drafting Table" : "蓝图制图台",
    theme: lang === "en" ? "Drawing a Bridge" : "桥的设计",
    densityLabel: lang === "en" ? "Moderate–high" : "中高密度",
    heroScene: 2,
    colors: { bg: C.bg, ink: C.ink, panel: C.panel },
    typography: { header: "Space Mono", body: "Space Mono" },
    tags:
      lang === "en"
        ? ["serene", "meticulous", "high-density", "prussian-monochrome", "mechanical-motion", "blueprint"]
        : ["沉静", "精细", "高密度", "普鲁士蓝单色", "机械式动效", "蓝图"],
    fonts: ["Space Mono:wght@400;700", "cjk:Noto Sans SC:wght@400;700"],
    scenes: pack.scenes.map((s, si) => ({
      id: si + 1,
      title: s.title,
      beats: s.beats.map((b, bi) => ({
        id: bi,
        action: b.action,
        title: b.title,
        body: b.body,
      })),
    })),
  };
}

export const drawingABridgeTopic = defineStyleTopic({
  id: "drawing-a-bridge",
  topic: { en: "Drawing a Bridge", zh: "桥的设计" },
  model: "Claude Opus 4.8",
  component: CyanotypeDraftingTableV3,
  getMetadata,
});

export default CyanotypeDraftingTableV3;

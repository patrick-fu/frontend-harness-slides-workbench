import { useEffect } from "react";
import type { CSSProperties, ReactNode } from "react";
import SpatialSceneTrack from "./SpatialSceneTrack";
import type { SceneTransitionMap } from "./SpatialSceneTrack";
import { useFLIP } from "../hooks/useFLIP";
import { defineStyleTopic } from "./topic";
import type { StyleMetadata } from "../types";
import styles from "./everything-the-intern-needs.module.css";

/* ── Fonts ─────────────────────────────────────────────────────────── */
const FONT_ID = "font-context-bento-box-v3";
const FONT_HREF =
  "https://fonts.googleapis.com/css2?family=Source+Serif+4:ital,wght@0,400;0,500;1,400&family=Source+Sans+3:wght@400;600&family=IBM+Plex+Mono:wght@400&family=Noto+Serif+SC:wght@400;500&family=Noto+Sans+SC:wght@400;600&display=swap";

function useFonts(): void {
  useEffect(() => {
    if (document.getElementById(FONT_ID)) return;
    const link = document.createElement("link");
    link.id = FONT_ID;
    link.rel = "stylesheet";
    link.href = FONT_HREF;
    document.head.appendChild(link);
  }, []);
}

/* ── Category accents (one role per compartment, stable across langs) ── */
const ACCENTS = [
  { dot: "#e7b84e", border: "rgba(231,184,78,0.46)" }, // goal / primary
  { dot: "#8fae7d", border: "rgba(143,174,125,0.44)" }, // constraints / bounds
  { dot: "#d1795a", border: "rgba(209,121,90,0.46)" }, // risks / caution
  { dot: "#7fa6b8", border: "rgba(127,166,184,0.44)" }, // tests / verify
];
const FAINT_BORDER = "rgba(236,225,210,0.10)";

/* ── Bilingual content ─────────────────────────────────────────────── */
const COPY = {
  en: {
    kicker: "HANDOFF PACKAGE",
    title: "Everything the Intern Needs",
    index: "STYLE 47 · CONTEXT BENTO BOX",
    dial: ["The box", "Portions", "Detail", "Balance", "Packed"],
    compartments: [
      {
        label: "GOAL",
        role: "PRIMARY",
        title: "What you're actually shipping",
        items: [
          "Own the onboarding checklist end to end",
          "One channel, one doc, one reviewer",
          "Done means merged, not drafted",
        ],
        detail: [
          "Week-one win: a real PR that lands",
          "Scope is the checklist only — park extras",
          "Ask before the goal grows",
        ],
      },
      {
        label: "CONSTRAINTS",
        role: "BOUNDS",
        title: "Where the edges are",
        items: [
          "Node 22 and the repo toolchain only",
          "No new dependency without a reason",
          "Touch only files the task needs",
        ],
        detail: [
          "Match the existing style, not your own",
          "Public repo — no local paths or secrets",
          "Keep the branch small and rebased",
        ],
      },
      {
        label: "RISKS",
        role: "CAUTION",
        title: "What tends to bite",
        items: [
          "Silent scope creep mid-task",
          "Copy-paste from stale examples",
          "Assuming green means shipped",
        ],
        detail: [
          "Same error twice → stop and read docs",
          "Flag ambiguity early, don't guess",
          "Never fake success — say what failed",
        ],
      },
      {
        label: "TESTS",
        role: "VERIFY",
        title: "How we know it's right",
        items: [
          "Run the CI script before every push",
          "Audit run for any visual change",
          "Read the diff before you commit",
        ],
        detail: [
          "Tests encode intent, not just output",
          "Both languages must fit the stage",
          "Green CI is the floor, not the ceiling",
        ],
      },
    ],
    scenes: {
      s1: { heading: "The box", note: "Four compartments, outlined and waiting.", hint: "AWAITING CONTENTS" },
      s2: {
        heading: "The portions",
        notes: [
          "Goal first — everything else hangs off it.",
          "Constraints and risks bound the work.",
          "Tests close the box: four portions set.",
        ],
      },
      s3: {
        heading: "The detail",
        notes: [
          "Every compartment holds more than its label.",
          "Lift the goal — here is the depth beneath it.",
        ],
      },
      s4: {
        heading: "The balance",
        notes: ["Four portions, each in its own space.", "Together they balance into one handoff."],
        balance: "GOAL · CONSTRAINTS · RISKS · TESTS — ONE BALANCED WHOLE",
      },
      s5: {
        heading: "Packed",
        lid: "HANDOFF · SEALED",
        notes: ["The box, packed and labeled for pickup.", "Everything the intern needs, in one place."],
        stamp: "PACKED",
        stampNote: "Ready for pickup.",
      },
    },
  },
  zh: {
    kicker: "交接包",
    title: "新人须知",
    index: "第 47 号 · 上下文便当盒",
    dial: ["便当盒", "分装", "细节", "平衡", "封盒"],
    compartments: [
      {
        label: "目标",
        role: "核心",
        title: "你真正要交付的",
        items: ["独立负责新人上手清单", "一个频道、一份文档、一位评审", "完成指已合入，而非草稿"],
        detail: ["第一周成果：一个真正合入的 PR", "范围只限清单，额外需求先搁置", "目标要扩大前先问一句"],
      },
      {
        label: "约束",
        role: "边界",
        title: "边界在哪里",
        items: ["只用 Node 22 与仓库工具链", "没有理由就不加新依赖", "只改任务需要的文件"],
        detail: ["沿用现有风格，别自创一套", "公开仓库：不留本地路径与密钥", "分支保持小而干净"],
      },
      {
        label: "风险",
        role: "警示",
        title: "常见的坑",
        items: ["任务中途悄悄扩范围", "照抄过期的示例代码", "以为绿了就等于交付"],
        detail: ["同一错误两次就停下查文档", "有歧义尽早提，别靠猜", "绝不假装成功，要说清失败"],
      },
      {
        label: "验证",
        role: "核对",
        title: "怎么确认没问题",
        items: ["每次推送前跑一遍 CI", "任何视觉改动都跑 audit", "提交前先读一遍 diff"],
        detail: ["测试编码意图，而非只测输出", "中英文都要放得进舞台", "CI 变绿是底线，不是终点"],
      },
    ],
    scenes: {
      s1: { heading: "便当盒", note: "四个格子，勾好轮廓，等待装填。", hint: "待装填" },
      s2: {
        heading: "分装",
        notes: ["先放目标——其余都挂在它上面。", "约束与风险圈定工作边界。", "验证封盒：四份分装到位。"],
      },
      s3: {
        heading: "细节",
        notes: ["每个格子装的都比标签更多。", "掀开目标——看看下面的深度。"],
      },
      s4: {
        heading: "平衡",
        notes: ["四份分装，各占其位。", "合在一起，平衡成一次交接。"],
        balance: "目标 · 约束 · 风险 · 验证 —— 平衡为一个整体",
      },
      s5: {
        heading: "封盒",
        lid: "交接 · 已封",
        notes: ["盒子装好、贴好标签，等待取走。", "新人所需，尽在一处。"],
        stamp: "已封",
        stampNote: "可以取走了。",
      },
    },
  },
};

type Copy = typeof COPY.en;
type Compartment = Copy["compartments"][number];

const TRANSITIONS: SceneTransitionMap = {
  "1->2": "scale-fade",
  "2->3": "scale-fade",
  "3->4": "fade",
  "4->5": "scale-fade",
};

const cx = (...c: Array<string | false | undefined>): string => c.filter(Boolean).join(" ");

/* ── Header ────────────────────────────────────────────────────────── */
function Header({
  copy,
  heading,
  note,
  big,
}: {
  copy: Copy;
  heading: string;
  note: string;
  big?: boolean;
}): ReactNode {
  return (
    <header className={styles.header}>
      <div className={styles.headLeft}>
        <span className={styles.kicker}>{copy.kicker}</span>
        {big ? (
          <h1 className={styles.title}>{heading}</h1>
        ) : (
          <h2 className={styles.heading}>{heading}</h2>
        )}
      </div>
      <div className={styles.headRight}>
        <span className={styles.index}>{copy.index}</span>
        <p className={styles.note}>{note}</p>
      </div>
    </header>
  );
}

/* ── One compartment cell ──────────────────────────────────────────── */
function Cell({
  cat,
  idx,
  filled = true,
  lifted = false,
  showItems = true,
  showDetail = false,
  outline = false,
  outlineHint,
  cellStyle,
}: {
  cat: Compartment;
  idx: number;
  filled?: boolean;
  lifted?: boolean;
  showItems?: boolean;
  showDetail?: boolean;
  outline?: boolean;
  outlineHint?: string;
  cellStyle?: CSSProperties;
}): ReactNode {
  const accent = ACCENTS[idx];
  return (
    <div
      className={cx(styles.cell, lifted && styles.cellLifted)}
      data-beat-layout-item="true"
      style={{ borderColor: filled ? accent.border : FAINT_BORDER, ...cellStyle }}
    >
      <div className={styles.label} style={{ color: filled ? accent.dot : "#6f6252" }}>
        <span className={styles.labelDot} style={{ background: filled ? accent.dot : "#4a4136" }} />
        {cat.label}
        <span className={styles.role}>{cat.role}</span>
      </div>
      <div className={styles.cellTitle} style={{ opacity: filled ? 1 : 0.4 }}>
        {cat.title}
      </div>
      {outline ? (
        <div className={styles.outlineHint}>{outlineHint}</div>
      ) : (
        <>
          {showItems && (
            <div className={styles.items} style={{ opacity: filled ? 1 : 0.14 }}>
              {cat.items.map((it, i) => (
                <div key={i} className={styles.item}>
                  <span className={styles.itemMark} style={{ color: accent.dot }}>
                    —
                  </span>
                  <span>{it}</span>
                </div>
              ))}
            </div>
          )}
          {showDetail && (
            <div className={styles.detail}>
              {cat.detail.map((d, i) => (
                <div key={i} className={styles.detailItem}>
                  <span className={styles.detailIdx} style={{ color: accent.dot }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>{d}</span>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

/* ── Scene content ─────────────────────────────────────────────────── */
function Scene({
  sceneId,
  beat,
  isActive,
  copy,
  reduce,
}: {
  sceneId: number;
  beat: number;
  isActive: boolean;
  copy: Copy;
  reduce: boolean;
}): ReactNode {
  const { ref } = useFLIP<HTMLDivElement>({
    watch: [beat],
    disabled: reduce || !isActive || sceneId !== 3,
    duration: 480,
    easing: "cubic-bezier(0.34, 1.56, 0.64, 1)",
    selector: '[data-beat-layout-item="true"]',
  });
  const cats = copy.compartments;

  if (sceneId === 1) {
    const s = copy.scenes.s1;
    return (
      <div className={styles.stage}>
        <Header copy={copy} heading={copy.title} note={s.note} big />
        <div className={styles.bento} style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
          {cats.map((cat, i) => (
            <Cell key={i} cat={cat} idx={i} filled outline outlineHint={s.hint} />
          ))}
        </div>
      </div>
    );
  }

  if (sceneId === 2) {
    const s = copy.scenes.s2;
    const revealed = beat === 0 ? 1 : beat === 1 ? 3 : 4;
    return (
      <div className={styles.stage}>
        <Header copy={copy} heading={s.heading} note={s.notes[beat] ?? s.notes[0]} />
        <div
          className={styles.bento}
          data-beat-layout-container="true"
          data-beat-layout-mode="reserved"
          style={{ gridTemplateColumns: "repeat(4, 1fr)" }}
        >
          {cats.map((cat, i) => (
            <Cell key={i} cat={cat} idx={i} filled={i < revealed} />
          ))}
        </div>
      </div>
    );
  }

  if (sceneId === 3) {
    const s = copy.scenes.s3;
    const lift = beat === 1;
    return (
      <div className={styles.stage}>
        <Header copy={copy} heading={s.heading} note={s.notes[beat] ?? s.notes[0]} />
        <div
          ref={ref}
          className={styles.bento}
          data-beat-layout-container="true"
          data-beat-layout-mode="motion"
          style={{ gridTemplateColumns: lift ? "repeat(6, 1fr)" : "repeat(4, 1fr)" }}
        >
          {cats.map((cat, i) => {
            const isGoal = i === 0;
            return (
              <Cell
                key={i}
                cat={cat}
                idx={i}
                filled
                lifted={lift && isGoal}
                showItems={!lift || isGoal}
                showDetail={lift && isGoal}
                cellStyle={{
                  gridColumn: lift && isGoal ? "span 3" : "span 1",
                  opacity: lift && !isGoal ? 0.5 : 1,
                }}
              />
            );
          })}
        </div>
      </div>
    );
  }

  if (sceneId === 4) {
    const s = copy.scenes.s4;
    return (
      <div className={styles.stage}>
        <Header copy={copy} heading={s.heading} note={s.notes[beat] ?? s.notes[0]} />
        <div
          className={styles.bento}
          data-beat-layout-container="true"
          data-beat-layout-mode="reserved"
          style={{ gridTemplateColumns: "repeat(4, 1fr)" }}
        >
          {cats.map((cat, i) => (
            <Cell key={i} cat={cat} idx={i} filled />
          ))}
        </div>
        <div className={styles.balance} style={{ opacity: beat >= 1 ? 1 : 0 }}>
          {s.balance}
        </div>
      </div>
    );
  }

  // sceneId === 5
  const s = copy.scenes.s5;
  return (
    <div className={styles.stage}>
      <Header copy={copy} heading={s.heading} note={s.notes[beat] ?? s.notes[0]} />
      <div
        className={styles.packed}
        data-beat-layout-container="true"
        data-beat-layout-mode="reserved"
      >
        <div className={styles.packedLid}>
          <span>{s.lid}</span>
          <span>{copy.index}</span>
        </div>
        <div className={styles.manifest}>
          {cats.map((cat, i) => (
            <div key={i} className={styles.mRow} data-beat-layout-item="true">
              <span className={styles.mLabel} style={{ color: ACCENTS[i].dot }}>
                <span className={styles.labelDot} style={{ background: ACCENTS[i].dot }} />
                {cat.label}
              </span>
              <span className={styles.mText}>{cat.title}</span>
            </div>
          ))}
        </div>
        <div className={styles.stamp} data-beat-layout-item="true" style={{ opacity: beat >= 1 ? 1 : 0 }}>
          <span className={styles.stampMark} style={{ color: ACCENTS[0].dot, borderColor: ACCENTS[0].border }}>
            {s.stamp}
          </span>
          <span className={styles.stampNote}>{s.stampNote}</span>
        </div>
      </div>
    </div>
  );
}

/* ── Nav: compartment-index dial (N10 object dial) ─────────────────── */
function Dial({
  copy,
  scene,
  onNavigate,
}: {
  copy: Copy;
  scene: number;
  onNavigate?: (scene: number, beat: number) => void;
}): ReactNode {
  return (
    <nav className={styles.dial} aria-label="scene index">
      {copy.dial.map((name, i) => {
        const target = i + 1;
        const active = target === scene;
        return (
          <button
            key={target}
            type="button"
            className={cx(styles.chip, active && styles.chipActive)}
            style={{ borderColor: active ? ACCENTS[Math.min(i, 3)].dot : undefined }}
            onClick={(e) => {
              e.stopPropagation();
              onNavigate?.(target, 0);
            }}
          >
            <span className={styles.chipIdx}>{String(target).padStart(2, "0")}</span>
            <span className={styles.chipName}>{name}</span>
          </button>
        );
      })}
    </nav>
  );
}

/* ── Root component ────────────────────────────────────────────────── */
function EverythingTheInternNeedsV3({
  scene,
  beat,
  language,
  isThumbnail,
  reducedMotion,
  onNavigate,
}: {
  scene: number;
  beat: number;
  language: "en" | "zh";
  isThumbnail: boolean;
  reducedMotion: boolean;
  onNavigate?: (scene: number, beat: number) => void;
}): ReactNode {
  useFonts();
  const copy = COPY[language];
  const reduce = reducedMotion || isThumbnail;

  return (
    <div className={styles.root} data-reduced={reduce ? "true" : undefined}>
      <SpatialSceneTrack
        scene={scene}
        beat={beat}
        transitionKind="scale-fade"
        transitionMap={TRANSITIONS}
        reducedMotion={reduce}
        beatLayoutModes={{ 2: "reserved", 3: "motion", 4: "reserved", 5: "reserved" }}
        renderScene={(sceneId, sceneBeat, isActive) => (
          <Scene
            sceneId={sceneId}
            beat={sceneBeat}
            isActive={isActive}
            copy={copy}
            reduce={reduce}
          />
        )}
      />
      {!isThumbnail && <Dial copy={copy} scene={scene} onNavigate={onNavigate} />}
    </div>
  );
}

/* ── Metadata ──────────────────────────────────────────────────────── */
export function getMetadata(lang: "en" | "zh"): StyleMetadata {
  const copy = COPY[lang];
  const c = copy.compartments;
  return {
    id: "context-bento-box",
    band: "text-report",
    name: lang === "en" ? "Context Bento Box" : "上下文便当盒",
    theme: copy.title,
    densityLabel: lang === "en" ? "Reading-First" : "阅读优先",
    heroScene: 4,
    colors: { bg: "#1a1410", ink: "#ece1d2", panel: "#241c15" },
    typography: { header: "Source Serif 4", body: "Source Sans 3" },
    tags:
      lang === "en"
        ? ["organized", "considered", "warm-dark", "compartmented", "calm-motion", "handoff", "bento"]
        : ["有条理", "考究", "暖调深色", "分格", "沉稳动效", "交接", "便当盒"],
    fonts: ["Source Serif 4", "Source Sans 3", "IBM Plex Mono", "cjk:Noto Serif SC", "cjk:Noto Sans SC"],
    scenes: [
      {
        id: 1,
        title: copy.scenes.s1.heading,
        beats: [
          {
            id: 0,
            action: lang === "en" ? "Outline the box" : "勾出便当盒",
            title: copy.scenes.s1.heading,
            body: copy.scenes.s1.note,
          },
        ],
      },
      {
        id: 2,
        title: copy.scenes.s2.heading,
        beats: [0, 1, 2].map((b) => ({
          id: b,
          action: lang === "en" ? "Fill a portion" : "装入分装",
          title: c[Math.min(b === 2 ? 3 : b, 3)].label,
          body: copy.scenes.s2.notes[b],
        })),
      },
      {
        id: 3,
        title: copy.scenes.s3.heading,
        beats: [
          {
            id: 0,
            action: lang === "en" ? "Survey the box" : "通览便当盒",
            title: copy.scenes.s3.heading,
            body: copy.scenes.s3.notes[0],
          },
          {
            id: 1,
            action: lang === "en" ? "Lift a compartment" : "掀开一格",
            title: c[0].label,
            body: copy.scenes.s3.notes[1],
          },
        ],
      },
      {
        id: 4,
        title: copy.scenes.s4.heading,
        beats: [
          {
            id: 0,
            action: lang === "en" ? "Arrange portions" : "摆好分装",
            title: copy.scenes.s4.heading,
            body: copy.scenes.s4.notes[0],
          },
          {
            id: 1,
            action: lang === "en" ? "Show the balance" : "呈现平衡",
            title: lang === "en" ? "Balanced whole" : "平衡整体",
            body: copy.scenes.s4.notes[1],
          },
        ],
      },
      {
        id: 5,
        title: copy.scenes.s5.heading,
        beats: [
          {
            id: 0,
            action: lang === "en" ? "Pack the box" : "装好盒子",
            title: copy.scenes.s5.heading,
            body: copy.scenes.s5.notes[0],
          },
          {
            id: 1,
            action: lang === "en" ? "Seal the box" : "封上盒子",
            title: copy.scenes.s5.stamp,
            body: copy.scenes.s5.notes[1],
          },
        ],
      },
    ],
  };
}

export const EverythingTheInternNeedsTopic = defineStyleTopic({
  id: "everything-the-intern-needs",
  topic: { en: "Everything the Intern Needs", zh: "新人须知" },
  model: "Claude Opus 4.8",
  component: EverythingTheInternNeedsV3,
  getMetadata,
});

export default EverythingTheInternNeedsV3;

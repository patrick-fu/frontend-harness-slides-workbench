import {
  defineTopic,
  type TopicMetadata,
  type TopicNavigation,
  type TopicStageProps,
  type TopicTransitionScore,
} from "../domain/topic";
import SpatialSceneTrack from "../styles/SpatialSceneTrack";
import type { SceneTransitionMap } from "../styles/SpatialSceneTrack";
import { useFLIP } from "../hooks/useFLIP";
import styles from "./safe-to-deploy.module.css";

/* ────────────────────────────────────────────────────────────────────────
   Debug Reaction Board — "Is It Safe to Deploy?"
   Deep dark IDE ground · strict traffic-light STATUS vocabulary · monospaced
   terminal voice. A pre-deploy readiness self-check that surfaces color-coded
   risk and makes uncertainty explicit before acting.
   ──────────────────────────────────────────────────────────────────────── */

type Lang = "en" | "zh";
type Status = "pending" | "healthy" | "attention" | "risk";

const NAVIGATION = {
  geometry: "typographic-index",
  carrier: "deploy-status-ticks",
  invocation: "auto-hide",
  feedback: "typographic-emphasis",
} as const satisfies TopicNavigation;

/* Traffic-light status vocabulary — STATUS ONLY, never decoration. */
const STATUS_COLOR: Record<Status, { hex: string; bg: string; glow: string }> = {
  pending: { hex: "#6e7b8a", bg: "rgba(110,123,138,0.10)", glow: "none" },
  healthy: { hex: "#3fb950", bg: "rgba(63,185,80,0.12)", glow: "0 0 2.2cqh rgba(63,185,80,0.35)" },
  attention: { hex: "#d29922", bg: "rgba(210,153,34,0.14)", glow: "0 0 2.4cqh rgba(210,153,34,0.42)" },
  risk: { hex: "#f85149", bg: "rgba(248,81,73,0.16)", glow: "0 0 2.8cqh rgba(248,81,73,0.5)" },
};

const FINAL: Status[] = ["healthy", "healthy", "healthy", "attention", "risk"];

/* Resolved state of check row `i` at a given scene/beat. */
function rowState(i: number, scene: number, beat: number): { status: Status; shown: boolean } {
  if (scene === 2) {
    const shown = beat >= 2 ? 5 : beat === 1 ? 4 : 2;
    return { status: "pending", shown: i < shown };
  }
  if (scene === 3) {
    if (beat <= 0) return { status: i < 2 ? "healthy" : "pending", shown: true };
    return { status: FINAL[i], shown: true };
  }
  return { status: FINAL[i], shown: true };
}

/* ── bilingual copy ─────────────────────────────────────────────────────── */
const COPY = {
  en: {
    hud: "readiness-check",
    hudRight: "pre-deploy · main",
    statusLabel: { pending: "PENDING", healthy: "PASS", attention: "VERIFY", risk: "HIGH RISK" } as Record<Status, string>,
    checks: [
      { cmd: "test:suite", note: "unit + integration" },
      { cmd: "typecheck + lint", note: "static analysis" },
      { cmd: "env:parity", note: "staging vs prod" },
      { cmd: "db:migrate --check", note: "reversible?" },
      { cmd: "audit:deps", note: "CVE scan" },
    ],
    s1: {
      kicker: "DEPLOY READINESS",
      title: "Is It Safe to Deploy?",
      sub: "A pre-deploy self-check that surfaces risk in color and makes uncertainty explicit — before you act.",
      term: ["$ deploy --preflight", "> initializing reaction board...", "> status panel: [ empty ]"],
    },
    s2: { kicker: "SELF-CHECK", head: "Enumerating checks", note: "Items register with pending badges — nothing resolved yet." },
    s3: { kicker: "RISK STATES", head: "Badges resolve", note: "Each check flips to its color-coded state as it completes." },
    s4: {
      kicker: "THE BLOCKER", head: "One card moves to blocked", note: "The high-risk check leaves staging.",
      staged: "STAGED", blocked: "BLOCKED",
      cards: { tests: "test:suite", migration: "db:migrate", audit: "audit:deps" },
      cardNotes: { tests: "passed", migration: "verify manually", audit: "CVE-2026-1180" },
    },
    s5: {
      kicker: "VERDICT", word: "NOT YET",
      summary: [
        { status: "healthy" as Status, label: "3 pass" },
        { status: "attention" as Status, label: "1 verify" },
        { status: "risk" as Status, label: "1 blocked" },
      ],
      term: "$ deploy --confirm  →  aborted (1 blocker)",
    },
  },
  zh: {
    hud: "readiness-check",
    hudRight: "pre-deploy · main",
    statusLabel: { pending: "待定", healthy: "通过", attention: "待验证", risk: "高风险" } as Record<Status, string>,
    checks: [
      { cmd: "test:suite", note: "单元 + 集成" },
      { cmd: "typecheck + lint", note: "静态分析" },
      { cmd: "env:parity", note: "预发 vs 生产" },
      { cmd: "db:migrate --check", note: "可回滚？" },
      { cmd: "audit:deps", note: "CVE 扫描" },
    ],
    s1: {
      kicker: "发布就绪检查",
      title: "能发布吗？",
      sub: "发布前的自检：用颜色暴露风险，在动手之前把不确定性讲清楚。",
      term: ["$ deploy --preflight", "> 正在初始化反应面板...", "> 状态面板：[ 空 ]"],
    },
    s2: { kicker: "自检", head: "登记检查项", note: "各项注册，徽章标记待定 —— 尚无结论。" },
    s3: { kicker: "风险状态", head: "徽章求解", note: "每项检查完成后翻转到其色标状态。" },
    s4: {
      kicker: "阻断项", head: "一张卡移入阻断列", note: "高风险检查离开暂存区。",
      staged: "暂存", blocked: "阻断",
      cards: { tests: "test:suite", migration: "db:migrate", audit: "audit:deps" },
      cardNotes: { tests: "已通过", migration: "需手动验证", audit: "CVE-2026-1180" },
    },
    s5: {
      kicker: "结论", word: "还不行",
      summary: [
        { status: "healthy" as Status, label: "3 通过" },
        { status: "attention" as Status, label: "1 待验证" },
        { status: "risk" as Status, label: "1 阻断" },
      ],
      term: "$ deploy --confirm  →  已中止（1 个阻断项）",
    },
  },
} as const;

/* ── status badge ───────────────────────────────────────────────────────── */
function Badge({ status, lang }: { status: Status; lang: Lang }) {
  const c = STATUS_COLOR[status];
  return (
    <span className={styles.badge} style={{ color: c.hex, backgroundColor: c.bg, boxShadow: c.glow }}>
      {COPY[lang].statusLabel[status]}
    </span>
  );
}

/* ── shared check-row list (scenes 2 & 3, reserved layout) ─────────────────── */
function CheckList({ scene, beat, lang }: { scene: number; beat: number; lang: Lang }) {
  const t = COPY[lang];
  return (
    <div
      className={`${styles.panel} ${styles.checkList}`}
      data-beat-layout-container="true"
      data-beat-layout-mode="reserved"
    >
      {t.checks.map((chk, i) => {
        const { status, shown } = rowState(i, scene, beat);
        return (
          <div
            key={chk.cmd}
            data-beat-layout-item="true"
            className={styles.checkRow}
            style={{ opacity: shown ? 1 : 0.16, borderColor: status === "pending" ? undefined : STATUS_COLOR[status].hex }}
          >
            <span className={styles.checkGutter}>{String(i + 1).padStart(2, "0")}</span>
            <span className={styles.checkCmd}>
              $ {chk.cmd}
              <b>{chk.note}</b>
            </span>
            <Badge status={status} lang={lang} />
          </div>
        );
      })}
    </div>
  );
}

/* ── scene 4: kanban blocker (motion, FLIP) ───────────────────────────────── */
function BlockerScene({
  beat,
  lang,
  isActive,
  reducedMotion,
  isThumbnail,
}: {
  beat: number;
  lang: Lang;
  isActive: boolean;
  reducedMotion: boolean;
  isThumbnail: boolean;
}) {
  const t = COPY[lang].s4;
  const { ref } = useFLIP<HTMLDivElement>({
    watch: [beat],
    disabled: reducedMotion || isThumbnail || !isActive,
    duration: 480,
    easing: "cubic-bezier(0.34, 1.56, 0.64, 1)",
    selector: '[data-beat-layout-item="true"]',
  });

  // grid placement per beat — the red "audit" card leaves staging on beat 1.
  const place = {
    tests: { col: 1, row: 2, status: "healthy" as Status, cmd: t.cards.tests, note: t.cardNotes.tests },
    migration: { col: 1, row: 3, status: "attention" as Status, cmd: t.cards.migration, note: t.cardNotes.migration },
    audit:
      beat <= 0
        ? { col: 1, row: 4, status: "risk" as Status, cmd: t.cards.audit, note: t.cardNotes.audit }
        : { col: 2, row: 2, status: "risk" as Status, cmd: t.cards.audit, note: t.cardNotes.audit },
  };

  return (
    <div className={styles.scene}>
      <p className={styles.kicker}>{t.kicker}</p>
      <h2 className={styles.sceneHead}>{t.head}</h2>
      <p className={styles.sceneNote}>{t.note}</p>
      <div ref={ref} className={styles.board} data-beat-layout-container="true" data-beat-layout-mode="motion">
        {/* column shells + headers (reserved chrome, not layout items) */}
        <div className={styles.colPanel} style={{ gridColumn: 1, gridRow: "1 / 5" }} aria-hidden />
        <div
          className={`${styles.colPanel} ${styles.colPanelBlocked}`}
          style={{ gridColumn: 2, gridRow: "1 / 5" }}
          aria-hidden
        />
        <div className={styles.colHead} style={{ gridColumn: 1, gridRow: 1 }}>
          {t.staged}
        </div>
        <div className={styles.colHead} style={{ gridColumn: 2, gridRow: 1, color: "#f85149" }}>
          {t.blocked}
        </div>

        {(["tests", "migration", "audit"] as const).map((k) => {
          const p = place[k];
          return (
            <div
              key={k}
              data-beat-layout-item="true"
              className={styles.card}
              style={{ gridColumn: p.col, gridRow: p.row, color: STATUS_COLOR[p.status].hex }}
            >
              <span className={styles.cardBody}>
                <span className={styles.cardCmd}>$ {p.cmd}</span>
                <span className={styles.cardLabel}>{p.note}</span>
              </span>
              <Badge status={p.status} lang={lang} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── scene renderer ────────────────────────────────────────────────────────── */
function renderSceneContent(
  scene: number,
  beat: number,
  isActive: boolean,
  lang: Lang,
  reducedMotion: boolean,
  isThumbnail: boolean,
) {
  const t = COPY[lang];
  switch (scene) {
    case 1:
      return (
        <div className={styles.scene}>
          <p className={styles.kicker}>{t.s1.kicker}</p>
          <h1 className={styles.title}>{t.s1.title}</h1>
          <p className={styles.subtitle}>{t.s1.sub}</p>
          <div className={`${styles.panel} ${styles.terminal}`}>
            {t.s1.term.map((line, i) => (
              <div key={i} className={styles.termLine}>
                {i === 0 ? <span className={styles.termPrompt}>{line}</span> : <span className={styles.termDim}>{line}</span>}
                {i === t.s1.term.length - 1 && <span className={styles.caret} />}
              </div>
            ))}
          </div>
        </div>
      );
    case 2:
      return (
        <div className={styles.scene}>
          <p className={styles.kicker}>{t.s2.kicker}</p>
          <h2 className={styles.sceneHead}>{t.s2.head}</h2>
          <p className={styles.sceneNote}>{t.s2.note}</p>
          <CheckList scene={2} beat={beat} lang={lang} />
        </div>
      );
    case 3:
      return (
        <div className={styles.scene}>
          <p className={styles.kicker}>{t.s3.kicker}</p>
          <h2 className={styles.sceneHead}>{t.s3.head}</h2>
          <p className={styles.sceneNote}>{t.s3.note}</p>
          <CheckList scene={3} beat={beat} lang={lang} />
        </div>
      );
    case 4:
      return (
        <BlockerScene beat={beat} lang={lang} isActive={isActive} reducedMotion={reducedMotion} isThumbnail={isThumbnail} />
      );
    case 5:
      return (
        <div className={styles.scene}>
          <div className={styles.verdictWrap}>
            <p className={styles.verdictKicker}>{t.s5.kicker}</p>
            <h1 className={styles.verdictWord}>{t.s5.word}</h1>
            <div className={styles.verdictSummary}>
              {t.s5.summary.map((s) => (
                <span key={s.label} className={styles.verdictStat}>
                  <span className={styles.verdictSwatch} style={{ background: STATUS_COLOR[s.status].hex, color: STATUS_COLOR[s.status].hex }} />
                  {s.label}
                </span>
              ))}
            </div>
            <div className={styles.verdictTerm}>{t.s5.term}</div>
          </div>
        </div>
      );
    default:
      return null;
  }
}

/* ── bottom nav: terminal-styled square status ticks (N2) ──────────────────── */
function StatusTicks({
  scene,
  isThumbnail,
  onNavigate,
}: {
  scene: number;
  isThumbnail: boolean;
  onNavigate?: (scene: number, beat: number) => void;
}) {
  if (isThumbnail) return null;
  return (
    <div
      className={styles.nav}
      data-topic-navigation="true"
      data-navigation-geometry={NAVIGATION.geometry}
      data-navigation-carrier={NAVIGATION.carrier}
      data-navigation-invocation={NAVIGATION.invocation}
      data-navigation-feedback={NAVIGATION.feedback}
    >
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          className={`${styles.tick} ${n === scene ? styles.tickActive : ""}`}
          onClick={(e) => {
            e.stopPropagation();
            onNavigate?.(n, 0);
          }}
        >
          <span className={styles.tickMark} />
          <span className={styles.tickIndex}>{String(n).padStart(2, "0")}</span>
        </button>
      ))}
    </div>
  );
}

/* ── transitions (EXACT per assignment) ────────────────────────────────────── */
const TRANSITION_SCORE = {
  "1->2": "hard-cut",
  "2->3": "hard-cut",
  "3->4": "slide-x",
  "4->5": "glitch",
} as const satisfies TopicTransitionScore;

const TRANSITIONS: SceneTransitionMap = TRANSITION_SCORE;

/* ── component ─────────────────────────────────────────────────────────────── */
function TopicStage({ scene, beat, language, isThumbnail, reducedMotion, onNavigate }: TopicStageProps) {
  const lang: Lang = language === "zh" ? "zh" : "en";
  const t = COPY[lang];
  const noMotion = reducedMotion || isThumbnail;

  return (
    <div className={styles.root} data-reduced={noMotion ? "true" : "false"}>
      <div className={styles.hud}>
        <span className={styles.hudDot} />
        <span className={styles.hudLabel}>{t.hud}</span>
        <span className={styles.hudRight}>{t.hudRight}</span>
      </div>

      <SpatialSceneTrack
        scene={scene}
        beat={beat}
        transitionKind="hard-cut"
        transitionMap={TRANSITIONS}
        reducedMotion={noMotion}
        beatLayoutModes={{ 2: "reserved", 3: "reserved", 4: "motion" }}
        renderScene={(sceneId, sceneBeat, isActive) =>
          renderSceneContent(sceneId, sceneBeat, isActive, lang, reducedMotion, isThumbnail)
        }
      />

      <StatusTicks scene={scene} isThumbnail={isThumbnail} onNavigate={onNavigate} />
    </div>
  );
}

/* ── metadata (en & zh structurally identical: 5 scenes · beats 1/3/2/2/1) ──── */
function buildMetadata(lang: Lang): TopicMetadata {
  const metadataByLanguage: Record<Lang, TopicMetadata> = {
    en: {
      theme: "Is It Safe to Deploy?",
      densityLabel: "Balanced diagnostic",
      heroScene: 4,
      colors: { bg: "#0a0d12", ink: "#c9d1d9", panel: "#12181f" },
      typography: { header: "JetBrains Mono", body: "JetBrains Mono" },
      tags: ["developer", "diagnostic", "dark", "traffic-light", "state-driven"],
      fonts: ["JetBrains Mono:wght@400;500;700", "cjk:Noto Sans SC:wght@400;500;700"],
      scenes: [
        {
          id: 1,
          title: "Boot",
          beats: [{ id: 0, action: "boot", title: "Board powers on", body: "The diagnostic board boots. Status panel: empty." }],
        },
        {
          id: 2,
          title: "Self-Check",
          beats: [
            { id: 0, action: "scan", title: "Enumerate checks", body: "First self-check items register with pending badges." },
            { id: 1, action: "queue", title: "More checks join", body: "Migration and dependency checks queue up." },
            { id: 2, action: "pending", title: "All queued", body: "Five checks pending. Nothing resolved yet." },
          ],
        },
        {
          id: 3,
          title: "Risk States",
          beats: [
            { id: 0, action: "resolve", title: "First results", body: "Tests and types resolve green." },
            { id: 1, action: "flip", title: "Risk surfaces", body: "Migration flags amber; the dependency audit flips red." },
          ],
        },
        {
          id: 4,
          title: "The Blocker",
          beats: [
            { id: 0, action: "stage", title: "Cards on the board", body: "The high-risk card sits in the staged column." },
            { id: 1, action: "block", title: "Move to blocked", body: "The red card moves into the blocked column." },
          ],
        },
        {
          id: 5,
          title: "Verdict",
          beats: [{ id: 0, action: "verdict", title: "Not yet", body: "Board reads: not yet. One blocker remains." }],
        },
      ],
    },
    zh: {
      theme: "能发布吗",
      densityLabel: "均衡诊断",
      heroScene: 4,
      colors: { bg: "#0a0d12", ink: "#c9d1d9", panel: "#12181f" },
      typography: { header: "JetBrains Mono", body: "JetBrains Mono" },
      tags: ["开发者", "诊断", "深色", "红绿灯", "状态驱动"],
      fonts: ["JetBrains Mono", "cjk:Noto Sans SC"],
      scenes: [
        {
          id: 1,
          title: "启动",
          beats: [{ id: 0, action: "启动", title: "面板通电", body: "诊断面板启动。状态面板：空白。" }],
        },
        {
          id: 2,
          title: "自检",
          beats: [
            { id: 0, action: "扫描", title: "登记检查项", body: "首批自检项注册，徽章标记待定。" },
            { id: 1, action: "排队", title: "更多检查加入", body: "迁移与依赖检查排队等待。" },
            { id: 2, action: "待定", title: "全部就绪", body: "五项检查待定。尚无结论。" },
          ],
        },
        {
          id: 3,
          title: "风险状态",
          beats: [
            { id: 0, action: "求解", title: "首批结果", body: "测试与类型检查转绿。" },
            { id: 1, action: "翻转", title: "风险浮现", body: "迁移标记为黄；依赖审计翻红。" },
          ],
        },
        {
          id: 4,
          title: "阻断项",
          beats: [
            { id: 0, action: "暂存", title: "看板就位", body: "高风险卡片停在暂存列。" },
            { id: 1, action: "阻断", title: "移入阻断", body: "红色卡片移入阻断列。" },
          ],
        },
        {
          id: 5,
          title: "结论",
          beats: [{ id: 0, action: "结论", title: "还不行", body: "面板结论：还不行。仍有一个阻断项。" }],
        },
      ],
    },
  };
  return metadataByLanguage[lang];
}

const metadata = {
  en: buildMetadata("en"),
  zh: buildMetadata("zh"),
} satisfies { en: TopicMetadata; zh: TopicMetadata };

export default defineTopic({
  id: "safe-to-deploy",
  styleId: "debug-reaction-board",
  title: { en: "Is It Safe to Deploy?", zh: "能发布吗" },
  modelId: "Claude Opus 4.8",
  Stage: TopicStage,
  metadata,
  navigation: NAVIGATION,
  transitionScore: TRANSITION_SCORE,
  evidence: {
    kind: "illustrative",
    boundary: {
      en: "Illustrative scenario: names, figures, and outcomes are presentation examples, not external factual claims.",
      zh: "示例场景：其中名称、数字和结果均为演示内容，并非外部事实主张。",
    },
    display: "envelope",
  },
});

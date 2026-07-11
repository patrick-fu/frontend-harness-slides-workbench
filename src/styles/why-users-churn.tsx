import { useEffect } from "react";
import type { CSSProperties, ReactNode } from "react";
import SpatialSceneTrack from "./SpatialSceneTrack";
import type { SceneTransitionMap } from "./SpatialSceneTrack";
import { defineStyleTopic } from "./topic";
import type { BespokeStyleProps, StyleMetadata } from "../types";
import styles from "./why-users-churn.module.css";

/* ── Palette: bright paper, near-flat depth, one serious accent ───────────── */
const PAPER = "#f6f4ee";
const PANEL = "#fbfaf6";
const INK = "#201e1a";
const INK_SOFT = "#5d574d";
const INK_FAINT = "#8c857a";
const RULE = "#d8d3c6";
const ACCENT = "#8f2c1e";

const FONT_LINK_ID = "memo-fonts-why-users-churn-v3";
const FONT_HREF =
  "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600&family=Noto+Serif+SC:wght@500;600&family=Noto+Sans+SC:wght@400;500&display=swap";

function useFonts() {
  useEffect(() => {
    if (document.getElementById(FONT_LINK_ID)) return;
    const link = document.createElement("link");
    link.id = FONT_LINK_ID;
    link.rel = "stylesheet";
    link.href = FONT_HREF;
    document.head.appendChild(link);
  }, []);
}

const serif = (lang: Lang): string =>
  lang === "zh"
    ? '"Noto Serif SC", "Fraunces", Georgia, serif'
    : '"Fraunces", "Noto Serif SC", Georgia, serif';
const sans = (lang: Lang): string =>
  lang === "zh"
    ? '"Noto Sans SC", "Inter", system-ui, sans-serif'
    : '"Inter", "Noto Sans SC", system-ui, sans-serif';

type Lang = "en" | "zh";

/* ── Bilingual content (NO `as const`) ────────────────────────────────────── */
const COPY = {
  en: {
    sections: [
      "Masthead",
      "The finding",
      "The evidence",
      "The interpretation",
      "The recommendation",
    ],
    runningHead: "Why Users Churn",
    masthead: {
      kicker: "Research Memo",
      meta: "Q3 2026 · Cohort Retention",
      subject: "Why Users Churn",
      abstract:
        "A retention study of 48,210 users across three cohorts, examining when and why users leave — and where early intervention actually pays.",
      preparedLabel: "Prepared by",
      author: "Growth & Insights",
    },
    finding: {
      label: "Finding 01 · Principal",
      statement:
        "Churn is not spread evenly across the lifecycle. It concentrates violently in the opening weeks, before any habit has formed.",
      metricValue: "72%",
      metricCaption: "of all churn occurs within the first 14 days after signup.",
      note: "The remaining loss trails off slowly — meaning the fight is decided early, not at renewal.",
    },
    evidence: {
      intro: "Three cohorts, one shape. The signal appears before value is ever felt.",
      columns: [
        {
          tag: "Onboarding",
          value: "41%",
          label: "abandon before completing the first core action.",
        },
        {
          tag: "Activation",
          value: "2.3×",
          label: "slower to reach first value among the churned cohort.",
        },
        {
          tag: "Signals",
          value: "9/10",
          label: "showed a dormancy signal we recorded but never acted on.",
        },
      ],
    },
    interpretation: {
      figureValue: "3.4×",
      figureCaption:
        "Users who reach first value in week one retain 3.4× better at 90 days.",
      reasons: [
        {
          title: "Churn is front-loaded.",
          body: "Most loss is decided in the first two weeks, before a habit forms. Late-stage retention work aims at the wrong window.",
        },
        {
          title: "It is a value problem, not a price problem.",
          body: "Churned users rarely cite cost. They simply never reached a first meaningful outcome, so nothing held them.",
        },
      ],
    },
    recommendation: {
      kicker: "Recommendation",
      heading: "Concentrate the work on the first fourteen days.",
      directives: [
        "Design one guided path to a single first value.",
        "Act on dormancy signals within 72 hours, automatically.",
        "Measure activation, not sign-ups.",
      ],
      closing: "Retention is won early, or it is not won at all.",
      signoff: "Growth & Insights · Q3 2026",
    },
    sourceMark: "Source: cohort analysis, n = 48,210",
  },
  zh: {
    sections: ["报头", "核心结论", "支撑证据", "原因解读", "行动建议"],
    runningHead: "用户流失",
    masthead: {
      kicker: "研究备忘录",
      meta: "2026 年第三季度 · 群组留存",
      subject: "用户流失",
      abstract:
        "针对三个群组、48,210 名用户的留存研究：分析用户在何时、因何离开，以及早期干预究竟在何处最有回报。",
      preparedLabel: "撰写",
      author: "增长与洞察团队",
    },
    finding: {
      label: "结论一 · 核心",
      statement:
        "流失并非均匀分布在生命周期中，而是剧烈地集中在最初几周——在任何使用习惯形成之前。",
      metricValue: "72%",
      metricCaption: "的流失，发生在注册后的前 14 天之内。",
      note: "其余流失则缓慢拖尾——这意味着胜负在早期就已注定，而非在续费时刻。",
    },
    evidence: {
      intro: "三个群组，同一形状。信号在用户感受到价值之前就已出现。",
      columns: [
        {
          tag: "上手引导",
          value: "41%",
          label: "在完成首个核心动作之前就已放弃。",
        },
        {
          tag: "激活",
          value: "2.3×",
          label: "流失群组抵达首次价值的速度更慢。",
        },
        {
          tag: "信号",
          value: "9/10",
          label: "曾出现我们记录在案、却从未处理的沉默信号。",
        },
      ],
    },
    interpretation: {
      figureValue: "3.4×",
      figureCaption: "在第一周抵达首次价值的用户，第 90 天留存高出 3.4 倍。",
      reasons: [
        {
          title: "流失高度前置。",
          body: "多数流失在前两周就已注定，早于习惯形成。后期留存投入瞄准的是错误的时间窗。",
        },
        {
          title: "这是价值问题，而非价格问题。",
          body: "流失用户很少提及成本，他们只是从未抵达首个有意义的结果，因而没有任何东西留住他们。",
        },
      ],
    },
    recommendation: {
      kicker: "行动建议",
      heading: "把力量集中在最初的十四天。",
      directives: [
        "设计一条通向单一首次价值的引导路径。",
        "在 72 小时内自动响应沉默信号。",
        "衡量激活，而非注册。",
      ],
      closing: "留存要么赢在早期，要么根本赢不了。",
      signoff: "增长与洞察团队 · 2026 Q3",
    },
    sourceMark: "来源：群组分析，n = 48,210",
  },
};

type Copy = typeof COPY.en;

/* ── Transitions: quiet document fades; sections scroll vertically ────────── */
const TRANSITIONS: SceneTransitionMap = {
  "1->2": "fade",
  "2->3": "slide-y",
  "3->4": "slide-y",
  "4->5": "fade",
};

const shell: CSSProperties = {
  position: "absolute",
  inset: 0,
  padding: "7.5cqh 7cqw 12cqh",
  display: "flex",
  flexDirection: "column",
  boxSizing: "border-box",
};

const kickerStyle = (lang: Lang): CSSProperties => ({
  fontFamily: sans(lang),
  fontSize: "1.35cqh",
  fontWeight: 600,
  letterSpacing: lang === "zh" ? "0.28cqw" : "0.5cqw",
  textTransform: lang === "zh" ? "none" : "uppercase",
  color: INK_FAINT,
});

/* Running head shared by scenes 2–5 for document continuity. */
function RunningHead({ copy, lang, index }: { copy: Copy; lang: Lang; index: number }): ReactNode {
  return (
    <div style={{ flex: "0 0 auto", marginBottom: "3.4cqh" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
        }}
      >
        <span style={kickerStyle(lang)}>{copy.runningHead}</span>
        <span style={{ ...kickerStyle(lang), color: INK_SOFT }}>
          {copy.sections[index]}
        </span>
      </div>
      <div style={{ height: "0.14cqh", background: RULE, marginTop: "1.5cqh" }} />
    </div>
  );
}

/* ── Scene 1 — Masthead (1 beat · motion) ─────────────────────────────────── */
function Masthead({ copy, lang, active }: { copy: Copy; lang: Lang; active: boolean }): ReactNode {
  const m = copy.masthead;
  return (
    <div style={{ ...shell, justifyContent: "center", gap: "0cqh" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
        }}
      >
        <span style={kickerStyle(lang)}>{m.kicker}</span>
        <span style={{ ...kickerStyle(lang), color: INK_SOFT }}>{m.meta}</span>
      </div>
      <div
        className={active ? styles.ruleDraw : undefined}
        style={{ height: "0.3cqh", background: ACCENT, margin: "2.2cqh 0 4cqh" }}
      />
      <h1
        className={active ? styles.enter : undefined}
        style={{
          fontFamily: serif(lang),
          fontSize: lang === "zh" ? "10.5cqh" : "9.5cqh",
          fontWeight: 500,
          lineHeight: 0.98,
          letterSpacing: lang === "zh" ? "0.4cqw" : "-0.06cqw",
          color: INK,
          margin: 0,
          maxWidth: "74cqw",
        }}
      >
        {m.subject}
      </h1>
      <p
        style={{
          fontFamily: sans(lang),
          fontSize: "2.2cqh",
          lineHeight: 1.5,
          color: INK_SOFT,
          maxWidth: lang === "zh" ? "54cqw" : "50cqw",
          margin: "4cqh 0 0",
        }}
      >
        {m.abstract}
      </p>
      <div
        style={{
          marginTop: "5.5cqh",
          paddingTop: "2.4cqh",
          borderTop: `0.14cqh solid ${RULE}`,
          display: "flex",
          gap: "1.2cqw",
          alignItems: "baseline",
        }}
      >
        <span style={kickerStyle(lang)}>{m.preparedLabel}</span>
        <span
          style={{
            fontFamily: serif(lang),
            fontSize: "2.4cqh",
            fontWeight: 500,
            color: INK,
          }}
        >
          {m.author}
        </span>
      </div>
    </div>
  );
}

/* ── Scene 2 — The finding (2 beats · reserved) ───────────────────────────── */
function Finding({ copy, lang, beat }: { copy: Copy; lang: Lang; beat: number }): ReactNode {
  const f = copy.finding;
  return (
    <div style={shell}>
      <RunningHead copy={copy} lang={lang} index={1} />
      <div
        data-beat-layout-container="true"
        data-beat-layout-mode="reserved"
        style={{
          flex: "1 1 auto",
          display: "grid",
          gridTemplateColumns: "1.05fr 0.95fr",
          columnGap: "6cqw",
          alignItems: "center",
        }}
      >
        <div data-beat-layout-item="true">
          <div style={{ ...kickerStyle(lang), color: ACCENT, marginBottom: "2.4cqh" }}>
            {f.label}
          </div>
          <p
            style={{
              fontFamily: serif(lang),
              fontSize: lang === "zh" ? "4.1cqh" : "4cqh",
              fontWeight: 400,
              lineHeight: 1.28,
              color: INK,
              margin: 0,
            }}
          >
            {f.statement}
          </p>
          <p
            data-beat-layout-item="true"
            className={styles.reveal}
            style={{
              fontFamily: sans(lang),
              fontSize: "1.95cqh",
              lineHeight: 1.5,
              color: INK_SOFT,
              margin: "3.4cqh 0 0",
              maxWidth: "38cqw",
              opacity: beat >= 1 ? 1 : 0,
              transform: beat >= 1 ? "none" : "translateY(0.8cqh)",
            }}
          >
            {f.note}
          </p>
        </div>
        <div
          data-beat-layout-item="true"
          className={styles.reveal}
          style={{
            borderLeft: `0.14cqh solid ${RULE}`,
            paddingLeft: "4cqw",
          }}
        >
          <div
            className={styles.reveal}
            style={{
              fontFamily: serif(lang),
              fontSize: "15cqh",
              fontWeight: 600,
              lineHeight: 0.9,
              letterSpacing: "-0.1cqw",
              color: beat >= 1 ? ACCENT : INK,
            }}
          >
            {f.metricValue}
          </div>
          <p
            style={{
              fontFamily: sans(lang),
              fontSize: "2cqh",
              lineHeight: 1.45,
              color: INK_SOFT,
              margin: "2.4cqh 0 0",
              maxWidth: "30cqw",
            }}
          >
            {f.metricCaption}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ── Scene 3 — The evidence (3 beats · reserved) ──────────────────────────── */
function Evidence({ copy, lang, beat }: { copy: Copy; lang: Lang; beat: number }): ReactNode {
  const e = copy.evidence;
  return (
    <div style={shell}>
      <RunningHead copy={copy} lang={lang} index={2} />
      <p
        style={{
          flex: "0 0 auto",
          fontFamily: serif(lang),
          fontSize: lang === "zh" ? "3.1cqh" : "3cqh",
          fontWeight: 400,
          lineHeight: 1.3,
          color: INK,
          margin: "0 0 5cqh",
          maxWidth: "64cqw",
        }}
      >
        {e.intro}
      </p>
      <div
        data-beat-layout-container="true"
        data-beat-layout-mode="reserved"
        style={{
          flex: "1 1 auto",
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          columnGap: "5cqw",
          alignContent: "center",
        }}
      >
        {e.columns.map((col, i) => {
          const on = beat >= i;
          return (
            <div
              key={col.tag}
              data-beat-layout-item="true"
              className={styles.reveal}
              style={{
                borderTop: `0.28cqh solid ${on ? ACCENT : RULE}`,
                paddingTop: "2.4cqh",
                opacity: on ? 1 : 0.42,
              }}
            >
              <div style={{ ...kickerStyle(lang), color: on ? ACCENT : INK_FAINT }}>
                {col.tag}
              </div>
              <div
                className={styles.reveal}
                style={{
                  fontFamily: serif(lang),
                  fontSize: "8.5cqh",
                  fontWeight: 600,
                  lineHeight: 0.95,
                  letterSpacing: "-0.08cqw",
                  color: beat === i ? ACCENT : INK,
                  margin: "1.8cqh 0",
                }}
              >
                {col.value}
              </div>
              <p
                style={{
                  fontFamily: sans(lang),
                  fontSize: "1.85cqh",
                  lineHeight: 1.45,
                  color: INK_SOFT,
                  margin: 0,
                }}
              >
                {col.label}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Scene 4 — The interpretation (2 beats · reserved) ────────────────────── */
function Interpretation({ copy, lang, beat }: { copy: Copy; lang: Lang; beat: number }): ReactNode {
  const it = copy.interpretation;
  return (
    <div style={shell}>
      <RunningHead copy={copy} lang={lang} index={3} />
      <div
        data-beat-layout-container="true"
        data-beat-layout-mode="reserved"
        style={{
          flex: "1 1 auto",
          display: "grid",
          gridTemplateColumns: "1.1fr 0.9fr",
          columnGap: "6cqw",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "3.6cqh" }}>
          {it.reasons.map((r, i) => {
            const on = beat >= i;
            return (
              <div
                key={r.title}
                data-beat-layout-item="true"
                className={styles.reveal}
                style={{
                  opacity: on ? 1 : 0.32,
                  transform: on ? "none" : "translateY(0.6cqh)",
                }}
              >
                <h3
                  style={{
                    fontFamily: serif(lang),
                    fontSize: lang === "zh" ? "3.3cqh" : "3.2cqh",
                    fontWeight: 500,
                    lineHeight: 1.15,
                    color: on ? INK : INK_SOFT,
                    margin: "0 0 1.4cqh",
                  }}
                >
                  {r.title}
                </h3>
                <p
                  style={{
                    fontFamily: sans(lang),
                    fontSize: "1.95cqh",
                    lineHeight: 1.5,
                    color: INK_SOFT,
                    margin: 0,
                    maxWidth: "42cqw",
                  }}
                >
                  {r.body}
                </p>
              </div>
            );
          })}
        </div>
        <div
          data-beat-layout-item="true"
          className={styles.reveal}
          style={{
            borderLeft: `0.14cqh solid ${RULE}`,
            paddingLeft: "4cqw",
          }}
        >
          <div
            style={{
              fontFamily: serif(lang),
              fontSize: "14cqh",
              fontWeight: 600,
              lineHeight: 0.9,
              letterSpacing: "-0.1cqw",
              color: ACCENT,
            }}
          >
            {it.figureValue}
          </div>
          <p
            className={styles.reveal}
            style={{
              fontFamily: sans(lang),
              fontSize: "2cqh",
              lineHeight: 1.5,
              color: INK_SOFT,
              margin: "2.6cqh 0 0",
              maxWidth: "30cqw",
              opacity: beat >= 1 ? 1 : 0.5,
            }}
          >
            {it.figureCaption}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ── Scene 5 — The recommendation (1 beat · motion) ───────────────────────── */
function Recommendation({ copy, lang, active }: { copy: Copy; lang: Lang; active: boolean }): ReactNode {
  const r = copy.recommendation;
  return (
    <div style={{ ...shell, justifyContent: "center" }}>
      <div
        className={active ? styles.enter : undefined}
        style={{ ...kickerStyle(lang), color: ACCENT, marginBottom: "2.6cqh" }}
      >
        {r.kicker}
      </div>
      <h2
        className={active ? styles.enter : undefined}
        style={{
          fontFamily: serif(lang),
          fontSize: lang === "zh" ? "7cqh" : "6.4cqh",
          fontWeight: 500,
          lineHeight: 1.08,
          letterSpacing: lang === "zh" ? "0.2cqw" : "-0.06cqw",
          color: INK,
          margin: 0,
          maxWidth: "68cqw",
        }}
      >
        {r.heading}
      </h2>
      <ol
        style={{
          listStyle: "none",
          margin: "5cqh 0 0",
          padding: 0,
          display: "flex",
          flexDirection: "column",
          gap: "2.4cqh",
          maxWidth: "62cqw",
        }}
      >
        {r.directives.map((d, i) => (
          <li
            key={d}
            className={active ? styles.enter : undefined}
            style={{
              display: "flex",
              gap: "1.6cqw",
              alignItems: "baseline",
              animationDelay: active ? `${120 + i * 90}ms` : undefined,
            }}
          >
            <span
              style={{
                fontFamily: serif(lang),
                fontSize: "2.2cqh",
                fontWeight: 600,
                color: ACCENT,
                minWidth: "2.4cqw",
              }}
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <span
              style={{
                fontFamily: sans(lang),
                fontSize: "2.3cqh",
                lineHeight: 1.4,
                color: INK,
              }}
            >
              {d}
            </span>
          </li>
        ))}
      </ol>
      <div
        style={{
          marginTop: "5.5cqh",
          paddingTop: "2.6cqh",
          borderTop: `0.14cqh solid ${RULE}`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
        }}
      >
        <span
          style={{
            fontFamily: serif(lang),
            fontSize: "2.4cqh",
            fontStyle: "italic",
            color: INK,
          }}
        >
          {r.closing}
        </span>
        <span style={kickerStyle(lang)}>{r.signoff}</span>
      </div>
    </div>
  );
}

/* ── Nav (N5) — document section spine (§1–§5) + footnote source mark ─────── */
function NavSpine({
  copy,
  lang,
  scene,
  isThumbnail,
  onNavigate,
}: {
  copy: Copy;
  lang: Lang;
  scene: number;
  isThumbnail: boolean;
  onNavigate?: (scene: number, beat: number) => void;
}): ReactNode {
  if (isThumbnail) return null;
  return (
    <footer
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        height: "7.2cqh",
        padding: "0 7cqw",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderTop: `0.14cqh solid ${RULE}`,
      }}
    >
      <span
        style={{
          fontFamily: sans(lang),
          fontSize: "1.35cqh",
          color: INK_FAINT,
          letterSpacing: "0.05cqw",
        }}
      >
        {copy.sourceMark}
      </span>
      <nav style={{ display: "flex", gap: "1.4cqw", alignItems: "center" }}>
        {[1, 2, 3, 4, 5].map((n) => {
          const current = n === scene;
          return (
            <button
              key={n}
              type="button"
              title={copy.sections[n - 1]}
              onClick={(ev) => {
                ev.stopPropagation();
                onNavigate?.(n, 0);
              }}
              style={{
                appearance: "none",
                background: "transparent",
                border: "none",
                padding: "0.6cqh 0.2cqw",
                cursor: "pointer",
                fontFamily: serif(lang),
                fontSize: "1.7cqh",
                fontWeight: current ? 600 : 400,
                color: current ? ACCENT : INK_FAINT,
                borderBottom: `0.2cqh solid ${current ? ACCENT : "transparent"}`,
                lineHeight: 1,
              }}
            >
              §{n}
            </button>
          );
        })}
      </nav>
    </footer>
  );
}

/* ── Root component ───────────────────────────────────────────────────────── */
function WhyUsersChurnV3({
  scene,
  beat,
  language,
  isThumbnail,
  reducedMotion,
  onNavigate,
}: BespokeStyleProps) {
  useFonts();
  const lang: Lang = language;
  const copy: Copy = COPY[lang];
  const rm = reducedMotion || isThumbnail;

  return (
    <div className={styles.root} data-rm={rm ? "true" : "false"} style={{ background: PAPER }}>
      <SpatialSceneTrack
        scene={scene}
        beat={beat}
        transitionKind="fade"
        transitionMap={TRANSITIONS}
        reducedMotion={rm}
        beatLayoutModes={{ 2: "reserved", 3: "reserved", 4: "reserved" }}
        renderScene={(sceneId, sceneBeat, isActive) => {
          if (sceneId === 1) return <Masthead copy={copy} lang={lang} active={isActive} />;
          if (sceneId === 2) return <Finding copy={copy} lang={lang} beat={sceneBeat} />;
          if (sceneId === 3) return <Evidence copy={copy} lang={lang} beat={sceneBeat} />;
          if (sceneId === 4) return <Interpretation copy={copy} lang={lang} beat={sceneBeat} />;
          return <Recommendation copy={copy} lang={lang} active={isActive} />;
        }}
      />
      <NavSpine
        copy={copy}
        lang={lang}
        scene={scene}
        isThumbnail={isThumbnail}
        onNavigate={onNavigate}
      />
    </div>
  );
}

/* ── Metadata ─────────────────────────────────────────────────────────────── */
export function getMetadata(lang: Lang): StyleMetadata {
  const c = COPY[lang];
  return {
    id: "research-memo",
    band: "text-report",
    name: lang === "zh" ? "研究备忘录" : "Research Memo",
    theme: lang === "zh" ? "用户流失" : "Why Users Churn",
    densityLabel: lang === "zh" ? "阅读优先" : "Reading-First",
    heroScene: 2,
    colors: { bg: PAPER, ink: INK, panel: PANEL },
    typography: {
      header: lang === "zh" ? "Noto Serif SC" : "Fraunces",
      body: lang === "zh" ? "Noto Sans SC" : "Inter",
    },
    tags:
      lang === "zh"
        ? ["冷静", "权威", "证据优先", "克制", "近乎无深度", "安静动效", "研究备忘"]
        : ["calm", "authoritative", "evidence-first", "restrained", "near-flat", "quiet-motion", "memo"],
    fonts: ["Fraunces", "Inter", "cjk:Noto Serif SC", "cjk:Noto Sans SC"],
    scenes: [
      {
        id: 1,
        title: c.sections[0],
        beats: [
          {
            id: 0,
            action: lang === "zh" ? "确立报头" : "Set the record",
            title: c.masthead.subject,
            body: c.masthead.abstract,
          },
        ],
      },
      {
        id: 2,
        title: c.sections[1],
        beats: [
          {
            id: 0,
            action: lang === "zh" ? "陈述结论" : "State the finding",
            title: c.finding.label,
            body: c.finding.statement,
          },
          {
            id: 1,
            action: lang === "zh" ? "补充语境" : "Add context",
            title: c.finding.metricValue,
            body: c.finding.note,
          },
        ],
      },
      {
        id: 3,
        title: c.sections[2],
        beats: c.evidence.columns.map((col, i) => ({
          id: i,
          action: col.tag,
          title: col.value,
          body: col.label,
        })),
      },
      {
        id: 4,
        title: c.sections[3],
        beats: c.interpretation.reasons.map((r, i) => ({
          id: i,
          action: lang === "zh" ? (i === 0 ? "读出规律" : "指明成因") : i === 0 ? "Read the pattern" : "Name the cause",
          title: r.title,
          body: r.body,
        })),
      },
      {
        id: 5,
        title: c.sections[4],
        beats: [
          {
            id: 0,
            action: lang === "zh" ? "给出方向" : "Direct the work",
            title: c.recommendation.heading,
            body: c.recommendation.closing,
          },
        ],
      },
    ],
  };
}

export default WhyUsersChurnV3;

export const WhyUsersChurnTopic = defineStyleTopic({
  id: "why-users-churn",
  topic: { en: "Why Users Churn", zh: "用户流失" },
  model: "Claude Opus 4.8",
  component: WhyUsersChurnV3,
  getMetadata,
});

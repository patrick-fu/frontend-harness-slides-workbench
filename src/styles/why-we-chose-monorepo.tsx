import type { CSSProperties, ReactNode } from "react";
import SpatialSceneTrack from "./SpatialSceneTrack";
import type { SceneTransitionMap } from "./SpatialSceneTrack";
import { defineStyleTopic } from "./topic";
import { curatedNavigationAttributes } from "./curated-topic-contract";
import type { BespokeStyleProps, StyleMetadata } from "../types";
import styles from "./why-we-chose-monorepo.module.css";

/* ── Design DNA: Decision Record ──────────────────────────────────────────
   Structured light cool ground, thin sharp rules, near-flat spec-sheet depth.
   One procedural accent (serious blue → considered green on approval).
   Clean technical/mono documentation voice; explicit labeled reasoning that
   leads to a stated, verifiable decision. Restrained, orderly motion. */

const INK = "#182430";
const SUBINK = "#5c6b78";
const BG = "#e8eef3";
const PANEL = "#fdfefe";
const RULE = "#d2dce3";
const RULE_STRONG = "#a4b4c0";
const BLUE = "#1f5fd6";
const BLUE_SOFT = "#dde9fb";
const GREEN = "#1f8a5b";
const GREEN_SOFT = "#dcefe5";

const MONO = '"IBM Plex Mono", "JetBrains Mono", "Noto Sans SC", ui-monospace, monospace';
const SANS = '"IBM Plex Sans", "Noto Sans SC", system-ui, sans-serif';
const EASE = "cubic-bezier(0.16, 1, 0.3, 1)";

const TRANSITIONS: SceneTransitionMap = {
  "1->2": "slide-x",
  "2->3": "slide-x",
  "3->4": "fade",
  "4->5": "scale-fade",
};

const ROW_REVEAL = [0, 1, 2, 2];

type Lang = "en" | "zh";

const COPY = {
  en: {
    adr: "ADR-042",
    category: "Architecture / Platform",
    date: "2026-07-08",
    deciders: "Deciders: Platform · DX · 6 product leads",
    statusProposed: "PROPOSED",
    statusAccepted: "ACCEPTED",
    stampLabel: "STATUS",
    title: "Why We Chose Monorepo",
    subtitle: "Consolidating three repositories into one workspace.",
    s1kicker: "Record opened",
    s1note:
      "This record captures the context, trade-offs, and decision behind repository consolidation. It is binding once accepted.",
    s2label: "CONTEXT",
    s2aLabel: "SITUATION",
    s2aBody:
      "Six product teams ship from three separate repositories. Shared UI, types, and API clients are copied between them and steadily drift out of sync.",
    s2bLabel: "FORCES",
    s2bBody:
      "A cross-cutting change needs coordinated releases across repos; tooling is duplicated three times; ownership at the seams is unclear.",
    s3label: "TRADE-OFFS",
    colCriterion: "Criterion",
    colMono: "Monorepo",
    colMulti: "Multi-repo",
    rows: [
      { c: "Shared code", mono: "One source, atomic refactors", multi: "Publish or copy; drifts" },
      { c: "Dependency bumps", mono: "Single lockfile, one PR", multi: "N repos, N pull requests" },
      { c: "CI at scale", mono: "Needs affected-graph builds", multi: "Naturally scoped per repo" },
      { c: "Ownership", mono: "Coarse; via CODEOWNERS", multi: "Repo-level, simple" },
    ],
    s4label: "DECISION",
    s4chooseLabel: "CHOSEN",
    s4statement:
      "Adopt a single monorepo with an affected-graph build system — workspaces plus a remote build cache.",
    s4rlabel: "RATIONALE",
    s4rationale: [
      "Atomic cross-cutting changes outweigh CI complexity, which tooling already solves.",
      "Shared types and clients stay consistent by construction, not by discipline.",
      "CODEOWNERS restores ownership boundaries without splitting history.",
    ],
    s4vlabel: "VERIFICATION",
    s4verify:
      "Accept if PR CI stays under 12 min at p50 and cross-repo release tickets reach zero within one quarter.",
    s5kicker: "Decision resolved",
    s5note:
      "Recorded and in effect. Revisit only if CI p50 exceeds 20 min or the team count doubles.",
    s5sign: "Signed: Platform + DX + product leads · 2026-07-08",
    steps: ["Record", "Context", "Trade-offs", "Decision", "Status"],
    sceneMeta: [
      { title: "Record", beats: [{ action: "Open record", title: "Why We Chose Monorepo", body: "Title and PROPOSED status." }] },
      { title: "Context", beats: [
        { action: "State situation", title: "Context", body: "Three repos, drifting shared code." },
        { action: "Add forces", title: "Context", body: "Coordinated releases, duplicated tooling." },
      ] },
      { title: "Trade-offs", beats: [
        { action: "Reveal shared code", title: "Trade-offs", body: "Monorepo vs multi-repo." },
        { action: "Add deps & CI", title: "Trade-offs", body: "Dependency and CI costs." },
        { action: "Complete matrix", title: "Trade-offs", body: "Ownership row completes." },
      ] },
      { title: "Decision", beats: [
        { action: "State the choice", title: "Decision", body: "Single monorepo, affected-graph builds." },
        { action: "List rationale", title: "Decision", body: "Rationale and verification criteria." },
      ] },
      { title: "Approved", beats: [{ action: "Resolve to accepted", title: "Approved", body: "Status settles to ACCEPTED." }] },
    ],
  },
  zh: {
    adr: "ADR-042",
    category: "架构 / 平台",
    date: "2026-07-08",
    deciders: "决策者：平台 · DX · 六位产品负责人",
    statusProposed: "提议中",
    statusAccepted: "已通过",
    stampLabel: "状态",
    title: "为什么选择单一代码仓库",
    subtitle: "将三个代码仓库合并为一个工作区。",
    s1kicker: "记录已建立",
    s1note:
      "本记录说明仓库合并的背景、权衡与决策；一经通过即具约束力。",
    s2label: "背景",
    s2aLabel: "现状",
    s2aBody:
      "六个产品团队分散在三个独立仓库交付。共享的 UI、类型与 API 客户端被相互复制，逐渐不再同步。",
    s2bLabel: "约束",
    s2bBody:
      "一次跨模块改动需要多个仓库协调发布；工具链重复建设三份；接缝处的归属并不清晰。",
    s3label: "权衡",
    colCriterion: "维度",
    colMono: "单一仓库",
    colMulti: "多仓库",
    rows: [
      { c: "共享代码", mono: "单一来源，原子重构", multi: "发布或复制，易漂移" },
      { c: "依赖升级", mono: "单一锁文件，一个 PR", multi: "N 个仓库，N 个 PR" },
      { c: "规模化 CI", mono: "需受影响图构建", multi: "天然按仓库隔离" },
      { c: "归属边界", mono: "较粗，靠 CODEOWNERS", multi: "仓库级，简单直接" },
    ],
    s4label: "决策",
    s4chooseLabel: "选择",
    s4statement:
      "采用单一代码仓库，并引入受影响图构建系统——工作区加远程构建缓存。",
    s4rlabel: "理由",
    s4rationale: [
      "原子化的跨模块改动，其价值高于 CI 复杂度，而后者已有工具解决。",
      "共享类型与客户端由结构保证一致，而非依赖人为纪律。",
      "CODEOWNERS 在不切分历史的前提下重建归属边界。",
    ],
    s4vlabel: "验证",
    s4verify:
      "若 PR CI 的 p50 保持在 12 分钟内，且一个季度内跨仓库发布工单归零，则接受。",
    s5kicker: "决策已定",
    s5note:
      "已记录并生效。仅当 CI 的 p50 超过 20 分钟，或团队数量翻倍时才重新评估。",
    s5sign: "签署：平台 + DX + 产品负责人 · 2026-07-08",
    steps: ["记录", "背景", "权衡", "决策", "状态"],
    sceneMeta: [
      { title: "记录", beats: [{ action: "建立记录", title: "为什么选择单一代码仓库", body: "标题与「提议中」状态。" }] },
      { title: "背景", beats: [
        { action: "陈述现状", title: "背景", body: "三个仓库，共享代码漂移。" },
        { action: "补充约束", title: "背景", body: "协调发布、重复工具链。" },
      ] },
      { title: "权衡", beats: [
        { action: "展示共享代码", title: "权衡", body: "单一仓库对比多仓库。" },
        { action: "加入依赖与 CI", title: "权衡", body: "依赖与 CI 成本。" },
        { action: "补全矩阵", title: "权衡", body: "补全归属边界一行。" },
      ] },
      { title: "决策", beats: [
        { action: "陈述选择", title: "决策", body: "单一仓库，受影响图构建。" },
        { action: "列出理由", title: "决策", body: "理由与验证标准。" },
      ] },
      { title: "通过", beats: [{ action: "解析为通过", title: "通过", body: "状态落定为「已通过」。" }] },
    ],
  },
};

type Copy = typeof COPY.en;

const scenePad: CSSProperties = {
  position: "absolute",
  inset: 0,
  boxSizing: "border-box",
  padding: "3.4cqh 3.6cqw",
  display: "flex",
  flexDirection: "column",
  fontFamily: SANS,
  color: INK,
};

const sectionLabel: CSSProperties = {
  fontFamily: MONO,
  fontSize: "1.45cqh",
  fontWeight: 600,
  letterSpacing: "0.16em",
  color: BLUE,
};

function kicker(color: string): CSSProperties {
  return {
    fontFamily: MONO,
    fontSize: "1.35cqh",
    fontWeight: 600,
    letterSpacing: "0.22em",
    color,
  };
}

function StatusStamp({
  label,
  text,
  color,
  soft,
  big,
  animate,
}: {
  label: string;
  text: string;
  color: string;
  soft: string;
  big?: boolean;
  animate: boolean;
}): ReactNode {
  return (
    <div
      className={animate ? styles.stamp : undefined}
      style={{
        display: "inline-flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "0.7cqh",
        padding: big ? "2.6cqh 4.4cqw" : "1.6cqh 3cqw",
        border: `0.28cqh solid ${color}`,
        background: soft,
        borderRadius: "0.5cqh",
        color,
        fontFamily: MONO,
      }}
    >
      <span style={{ fontSize: "1.1cqh", letterSpacing: "0.24em", color: SUBINK }}>{label}</span>
      <span
        style={{
          fontSize: big ? "5.4cqh" : "3.2cqh",
          fontWeight: 600,
          letterSpacing: "0.12em",
          lineHeight: 1,
        }}
      >
        {text}
      </span>
    </div>
  );
}

function LabeledBlock({
  label,
  active,
  motionOn,
  children,
}: {
  label: string;
  active: boolean;
  motionOn: boolean;
  children: ReactNode;
}): ReactNode {
  return (
    <div
      data-beat-layout-item="true"
      style={{
        borderLeft: `0.26cqw solid ${active ? BLUE : RULE_STRONG}`,
        padding: "0.6cqh 0 0.6cqh 2cqw",
        opacity: active ? 1 : 0.26,
        transition: motionOn
          ? `opacity 460ms ${EASE}, border-color 460ms ${EASE}`
          : "none",
      }}
    >
      <div
        style={{
          fontFamily: MONO,
          fontSize: "1.32cqh",
          fontWeight: 600,
          letterSpacing: "0.16em",
          color: active ? BLUE : SUBINK,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: "1.85cqh",
          lineHeight: 1.62,
          color: INK,
          marginTop: "1cqh",
          maxWidth: "72cqw",
        }}
      >
        {children}
      </div>
    </div>
  );
}

function Stepper({
  scene,
  steps,
  isThumbnail,
  motionOn,
  onNavigate,
}: {
  scene: number;
  steps: string[];
  isThumbnail: boolean;
  motionOn: boolean;
  onNavigate?: (scene: number, beat: number) => void;
}): ReactNode {
  if (isThumbnail) return null;
  const total = steps.length;
  const fill = total > 1 ? (scene - 1) / (total - 1) : 0;
  return (
    <nav
      {...curatedNavigationAttributes("decision-record", "why-we-chose-monorepo")}
      style={{ padding: "1.9cqh 3.6cqw 2.2cqh" }}
    >
      <div style={{ position: "relative", display: "flex", justifyContent: "space-between" }}>
        <div
          style={{
            position: "absolute",
            top: "1.2cqw",
            left: "10%",
            right: "10%",
            height: "0.2cqh",
            background: RULE,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "1.2cqw",
            left: "10%",
            width: `calc(80% * ${fill})`,
            height: "0.2cqh",
            background: BLUE,
            transition: motionOn ? `width 480ms ${EASE}` : "none",
          }}
        />
        {steps.map((label, i) => {
          const n = i + 1;
          const done = n <= scene;
          const current = n === scene;
          return (
            <button
              key={label}
              onClick={(e) => {
                e.stopPropagation();
                onNavigate?.(n, 0);
              }}
              style={{
                position: "relative",
                width: `${100 / total}%`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "0.9cqh",
                background: "transparent",
                border: "none",
                padding: 0,
                cursor: "pointer",
              }}
            >
              <span
                style={{
                  width: "2.4cqw",
                  height: "2.4cqw",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxSizing: "border-box",
                  fontFamily: MONO,
                  fontSize: "1.3cqh",
                  fontWeight: 600,
                  border: `0.15cqw solid ${done ? BLUE : RULE_STRONG}`,
                  background: current ? BLUE : done ? BLUE_SOFT : PANEL,
                  color: current ? "#fff" : done ? BLUE : SUBINK,
                  transition: motionOn ? `all 320ms ${EASE}` : "none",
                }}
              >
                {n}
              </span>
              <span
                style={{
                  fontFamily: MONO,
                  fontSize: "1.24cqh",
                  letterSpacing: "0.04em",
                  whiteSpace: "nowrap",
                  color: current ? INK : SUBINK,
                  fontWeight: current ? 600 : 400,
                }}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

function Scene({
  s,
  beat,
  isActive,
  t,
  motionOn,
}: {
  s: number;
  beat: number;
  isActive: boolean;
  t: Copy;
  motionOn: boolean;
}): ReactNode {
  const revealClass = motionOn && isActive ? styles.reveal : undefined;
  const opTransition = motionOn ? `opacity 460ms ${EASE}` : "none";

  if (s === 1) {
    return (
      <div style={scenePad}>
        <div className={revealClass} style={{ display: "flex", flexDirection: "column", height: "100%" }}>
          <div style={kicker(BLUE)}>{t.s1kicker}</div>
          <div
            style={{
              fontFamily: MONO,
              fontWeight: 600,
              fontSize: "5.2cqh",
              lineHeight: 1.04,
              letterSpacing: "-0.01em",
              marginTop: "1.6cqh",
              maxWidth: "72cqw",
            }}
          >
            {t.title}
          </div>
          <div style={{ fontSize: "2.1cqh", color: SUBINK, marginTop: "1.6cqh", maxWidth: "62cqw" }}>
            {t.subtitle}
          </div>
          <div style={{ height: 0, borderTop: `0.1cqw solid ${RULE}`, margin: "2.8cqh 0" }} />
          <p style={{ fontSize: "1.8cqh", lineHeight: 1.62, color: INK, maxWidth: "60cqw", margin: 0 }}>
            {t.s1note}
          </p>
          <div style={{ marginTop: "auto", display: "flex", justifyContent: "flex-end" }}>
            <StatusStamp
              label={t.stampLabel}
              text={t.statusProposed}
              color={BLUE}
              soft={BLUE_SOFT}
              animate={motionOn && isActive}
            />
          </div>
        </div>
      </div>
    );
  }

  if (s === 2) {
    return (
      <div style={scenePad}>
        <div style={sectionLabel}>{t.s2label}</div>
        <div
          data-beat-layout-container="true"
          data-beat-layout-mode="reserved"
          style={{ display: "flex", flexDirection: "column", gap: "3cqh", marginTop: "2.4cqh", flex: 1 }}
        >
          <LabeledBlock label={t.s2aLabel} active={true} motionOn={motionOn}>
            {t.s2aBody}
          </LabeledBlock>
          <LabeledBlock label={t.s2bLabel} active={beat >= 1} motionOn={motionOn}>
            {t.s2bBody}
          </LabeledBlock>
        </div>
      </div>
    );
  }

  if (s === 3) {
    return (
      <div style={scenePad}>
        <div style={sectionLabel}>{t.s3label}</div>
        <div
          data-beat-layout-container="true"
          data-beat-layout-mode="reserved"
          style={{
            marginTop: "2.4cqh",
            flex: 1,
            display: "flex",
            flexDirection: "column",
            border: `0.1cqw solid ${RULE_STRONG}`,
            borderRadius: "0.4cqh",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "20cqw 1fr 1fr",
              background: "#eef3f7",
              borderBottom: `0.1cqw solid ${RULE_STRONG}`,
            }}
          >
            <div style={matrixHead(SUBINK)}>{t.colCriterion}</div>
            <div style={{ ...matrixHead(BLUE), borderLeft: `0.1cqw solid ${RULE}`, background: BLUE_SOFT }}>
              {t.colMono}
            </div>
            <div style={{ ...matrixHead(SUBINK), borderLeft: `0.1cqw solid ${RULE}` }}>{t.colMulti}</div>
          </div>
          {t.rows.map((r, i) => {
            const active = beat >= ROW_REVEAL[i];
            return (
              <div
                key={r.c}
                data-beat-layout-item="true"
                style={{
                  display: "grid",
                  gridTemplateColumns: "20cqw 1fr 1fr",
                  flex: 1,
                  borderTop: i === 0 ? "none" : `0.1cqw solid ${RULE}`,
                  opacity: active ? 1 : 0.22,
                  transition: opTransition,
                }}
              >
                <div style={{ ...matrixCell, fontFamily: MONO, fontWeight: 600, color: INK }}>{r.c}</div>
                <div
                  style={{
                    ...matrixCell,
                    borderLeft: `0.1cqw solid ${RULE}`,
                    background: "rgba(31,95,214,0.05)",
                    color: INK,
                  }}
                >
                  {r.mono}
                </div>
                <div style={{ ...matrixCell, borderLeft: `0.1cqw solid ${RULE}`, color: SUBINK }}>
                  {r.multi}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  if (s === 4) {
    return (
      <div style={scenePad}>
        <div style={sectionLabel}>{t.s4label}</div>
        <div
          data-beat-layout-container="true"
          data-beat-layout-mode="reserved"
          style={{ display: "flex", flexDirection: "column", gap: "2.6cqh", marginTop: "2.4cqh", flex: 1 }}
        >
          <div data-beat-layout-item="true">
            <div style={{ ...sectionLabel, color: GREEN, fontSize: "1.32cqh" }}>{t.s4chooseLabel}</div>
            <div
              style={{
                fontFamily: MONO,
                fontSize: "2.5cqh",
                lineHeight: 1.42,
                fontWeight: 500,
                color: INK,
                borderLeft: `0.3cqw solid ${GREEN}`,
                padding: "0.4cqh 0 0.4cqh 2cqw",
                marginTop: "1.1cqh",
                maxWidth: "74cqw",
              }}
            >
              {t.s4statement}
            </div>
          </div>
          <div
            data-beat-layout-item="true"
            style={{ opacity: beat >= 1 ? 1 : 0.24, transition: opTransition }}
          >
            <div style={{ ...sectionLabel, fontSize: "1.32cqh" }}>{t.s4rlabel}</div>
            <ul style={{ listStyle: "none", margin: "1.1cqh 0 0", padding: 0, display: "flex", flexDirection: "column", gap: "1cqh" }}>
              {t.s4rationale.map((r, i) => (
                <li key={i} style={{ display: "flex", gap: "1.2cqw", fontSize: "1.72cqh", lineHeight: 1.5, color: INK, maxWidth: "74cqw" }}>
                  <span style={{ fontFamily: MONO, color: BLUE, fontWeight: 600 }}>{String(i + 1).padStart(2, "0")}</span>
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>
          <div
            data-beat-layout-item="true"
            style={{ opacity: beat >= 1 ? 1 : 0.24, transition: opTransition }}
          >
            <div style={{ ...sectionLabel, fontSize: "1.32cqh", color: SUBINK }}>{t.s4vlabel}</div>
            <p style={{ fontSize: "1.68cqh", lineHeight: 1.5, color: SUBINK, margin: "0.9cqh 0 0", maxWidth: "74cqw" }}>
              {t.s4verify}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={scenePad}>
      <div className={revealClass} style={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <div style={kicker(GREEN)}>{t.s5kicker}</div>
        <div style={{ marginTop: "3.4cqh", display: "flex", justifyContent: "flex-start" }}>
          <StatusStamp
            label={t.stampLabel}
            text={t.statusAccepted}
            color={GREEN}
            soft={GREEN_SOFT}
            big
            animate={motionOn && isActive}
          />
        </div>
        <p style={{ fontSize: "1.9cqh", lineHeight: 1.62, color: INK, maxWidth: "58cqw", marginTop: "3.4cqh" }}>
          {t.s5note}
        </p>
        <div style={{ marginTop: "auto", fontFamily: MONO, fontSize: "1.35cqh", letterSpacing: "0.04em", color: SUBINK }}>
          {t.s5sign}
        </div>
      </div>
    </div>
  );
}

const matrixCell: CSSProperties = {
  padding: "1.3cqh 1.6cqw",
  fontSize: "1.55cqh",
  lineHeight: 1.4,
  display: "flex",
  alignItems: "center",
};

function matrixHead(color: string): CSSProperties {
  return {
    padding: "1.2cqh 1.6cqw",
    fontFamily: MONO,
    fontSize: "1.4cqh",
    fontWeight: 600,
    letterSpacing: "0.1em",
    color,
  };
}

export default function WhyWeChoseMonorepo({
  scene,
  beat,
  language,
  isThumbnail,
  reducedMotion,
  onNavigate,
}: BespokeStyleProps): ReactNode {
  const t = COPY[language];
  const motionOn = !(reducedMotion || isThumbnail);
  const status = scene >= 5 ? { text: t.statusAccepted, color: GREEN } : { text: t.statusProposed, color: BLUE };

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        boxSizing: "border-box",
        background: BG,
        padding: "4.2cqh 4.4cqw",
        display: "flex",
        fontFamily: SANS,
        color: INK,
      }}
    >
      <div
        style={{
          flex: 1,
          minHeight: 0,
          display: "flex",
          flexDirection: "column",
          background: PANEL,
          border: `0.1cqw solid ${RULE_STRONG}`,
          borderLeft: `0.4cqw solid ${status.color}`,
          borderRadius: "0.3cqh",
          overflow: "hidden",
          transition: motionOn ? `border-left-color 620ms ${EASE}` : "none",
        }}
      >
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            gap: "2cqw",
            padding: "2.5cqh 3.6cqw 2.1cqh",
          }}
        >
          <div>
            <div style={{ fontFamily: MONO, fontSize: "1.2cqh", letterSpacing: "0.06em", color: SUBINK }}>
              {t.adr} · {t.category} · {t.date}
            </div>
            <div
              style={{
                fontFamily: MONO,
                fontSize: "2.4cqh",
                fontWeight: 600,
                marginTop: "0.9cqh",
                letterSpacing: "-0.005em",
                color: INK,
              }}
            >
              {t.title}
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "1cqh" }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.7cqw",
                padding: "0.7cqh 1.4cqw",
                borderRadius: "0.4cqh",
                border: `0.1cqw solid ${status.color}`,
                background: scene >= 5 ? GREEN_SOFT : BLUE_SOFT,
                fontFamily: MONO,
                fontSize: "1.4cqh",
                fontWeight: 600,
                letterSpacing: "0.14em",
                color: status.color,
                transition: motionOn ? `all 620ms ${EASE}` : "none",
              }}
            >
              <span
                style={{
                  width: "0.9cqw",
                  height: "0.9cqw",
                  borderRadius: "50%",
                  background: status.color,
                }}
              />
              {status.text}
            </span>
            <div style={{ fontFamily: MONO, fontSize: "1.12cqh", letterSpacing: "0.04em", color: SUBINK }}>
              {t.deciders}
            </div>
          </div>
        </header>

        <div style={{ height: 0, borderTop: `0.1cqw solid ${RULE}` }} />

        <div style={{ flex: 1, minHeight: 0, position: "relative" }}>
          <SpatialSceneTrack
            scene={scene}
            beat={beat}
            transitionKind="slide-x"
            transitionMap={TRANSITIONS}
            reducedMotion={reducedMotion || isThumbnail}
            beatLayoutModes={{ 2: "reserved", 3: "reserved", 4: "reserved" }}
            renderScene={(sceneId, sceneBeat, isActive) => (
              <Scene s={sceneId} beat={sceneBeat} isActive={isActive} t={t} motionOn={motionOn} />
            )}
          />
        </div>

        <div style={{ height: 0, borderTop: `0.1cqw solid ${RULE}` }} />

        <Stepper
          scene={scene}
          steps={t.steps}
          isThumbnail={isThumbnail}
          motionOn={motionOn}
          onNavigate={onNavigate}
        />
      </div>
    </div>
  );
}

export function getMetadata(lang: Lang): StyleMetadata {
  const c = COPY[lang];
  return {
    id: "decision-record",
    band: "text-report",
    name: lang === "en" ? "Decision Record" : "决策记录",
    theme: c.title,
    densityLabel: lang === "en" ? "Reading-First" : "阅读优先",
    heroScene: 1,
    colors: { bg: BG, ink: INK, panel: PANEL },
    typography: { header: "IBM Plex Mono", body: "IBM Plex Sans" },
    tags: [
      "rigorous",
      "architectural",
      "deliberate",
      "technical",
      "monospace",
      "reading-first",
      "cool",
      "procedural-accent",
      "near-flat",
      "orderly-motion",
      "decision-record",
      "adr",
      "trade-off-matrix",
    ],
    fonts: [
      "IBM Plex Mono:wght@400;500;600",
      "IBM Plex Sans:wght@400;500;600;700",
      "cjk:Noto Sans SC:wght@400;500;700",
    ],
    scenes: c.sceneMeta.map((sc, i) => ({
      id: i + 1,
      title: sc.title,
      beats: sc.beats.map((b, j) => ({ id: j, action: b.action, title: b.title, body: b.body })),
    })),
  };
}

export const WhyWeChoseMonorepoTopic = defineStyleTopic({
  id: "why-we-chose-monorepo",
  topic: { en: "Why We Chose Monorepo", zh: "选单仓库" },
  model: "GPT 5.6 Sol",
  component: WhyWeChoseMonorepo,
  getMetadata,
});

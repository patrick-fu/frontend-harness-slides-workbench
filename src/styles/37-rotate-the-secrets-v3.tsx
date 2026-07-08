import { useEffect } from "react";
import type { CSSProperties } from "react";
import SpatialSceneTrack from "./SpatialSceneTrack";
import type { SceneTransitionMap } from "./SpatialSceneTrack";
import { defineStyleVersion } from "./version";
import type { BespokeStyleProps, StyleMetadata } from "../types";
import styles from "./37-rotate-the-secrets-v3.module.css";

/* ─── fonts ─────────────────────────────────────────────────────── */
const FONT_ID = "font-op-manual-v3";
const FONT_HREF =
  "https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;600;700&family=JetBrains+Mono:wght@700;800&family=Noto+Sans+SC:wght@400;700&display=swap";

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

/* ─── theme tokens ──────────────────────────────────────────────── */
type CssVars = CSSProperties & Record<`--${string}`, string>;
const ROOT_VARS: CssVars = {
  "--bg": "#0a0c10",
  "--ink": "#f2f4f7",
  "--panel": "#141821",
  "--warn": "#ffb000",
  "--warn-ink": "#0a0c10",
  "--dim": "#7d8794",
  "--line": "#2a3040",
};

/* ─── bilingual content ─────────────────────────────────────────── */
const COPY = {
  en: {
    tag: "PROCEDURE",
    priority: "PRIORITY · HIGH",
    title: "Rotate the Secrets",
    sub: "Runbook · secret/app/prod",
    banner: "⚠ ZERO-DOWNTIME ROTATION — FOLLOW EVERY STEP IN ORDER",
    stepsTitle: "THE STEPS",
    steps: [
      { n: "01", t: "Drain writes to the credential cache", f: "PRE-FLIGHT" },
      { n: "02", t: "Generate a fresh key version in the vault", f: "GENERATE" },
      { n: "03", t: "Propagate the new key to every replica", f: "PROPAGATE" },
      { n: "04", t: "Revoke the previous key version", f: "REVOKE" },
    ],
    execTitle: "EXECUTION",
    term: {
      path: "ops@runbook — vault",
      prompt: "$ vault kv rotate secret/app/prod",
      run: "⟳ rotating key material …",
      out1: "→ new version    v41 → v42",
      out2: "→ propagate      6 / 6 replicas ok",
      out3: "→ revoke         v41 disabled",
      exit: "✔ rotation complete · exit 0",
    },
    verifyTitle: "VERIFICATION",
    checks: [
      { k: "active version", v: "v42" },
      { k: "replica sync", v: "6 / 6" },
      { k: "legacy key", v: "revoked" },
    ],
    verifying: "VERIFYING …",
    verified: "ALL CHECKS PASSED",
    stamp: "DONE",
    doneTitle: "Rotation complete",
    doneMeta: "secret/app/prod · v42 · exit 0",
    doneNote: "Old credentials are revoked and the service kept serving. Log the run.",
    step: (s: number) => `STEP ${s}/5 · OK`,
  },
  zh: {
    tag: "操作流程",
    priority: "优先级 · 高",
    title: "轮换密钥",
    sub: "运行手册 · secret/app/prod",
    banner: "⚠ 零停机轮换 — 严格按顺序执行每一步",
    stepsTitle: "操作步骤",
    steps: [
      { n: "01", t: "排空对凭据缓存的写入", f: "预检" },
      { n: "02", t: "在保险库生成新密钥版本", f: "生成" },
      { n: "03", t: "将新密钥同步到所有副本", f: "同步" },
      { n: "04", t: "吊销上一版本密钥", f: "吊销" },
    ],
    execTitle: "执行",
    term: {
      path: "ops@runbook — vault",
      prompt: "$ vault kv rotate secret/app/prod",
      run: "⟳ 正在轮换密钥材料 …",
      out1: "→ 新版本      v41 → v42",
      out2: "→ 同步        6 / 6 副本正常",
      out3: "→ 吊销        v41 已停用",
      exit: "✔ 轮换完成 · 退出码 0",
    },
    verifyTitle: "校验",
    checks: [
      { k: "生效版本", v: "v42" },
      { k: "副本同步", v: "6 / 6" },
      { k: "旧密钥", v: "已吊销" },
    ],
    verifying: "校验中 …",
    verified: "全部校验通过",
    stamp: "完成",
    doneTitle: "轮换完成",
    doneMeta: "secret/app/prod · v42 · 退出码 0",
    doneNote: "旧凭据已吊销，服务全程在线。记得记录本次运行。",
    step: (s: number) => `步骤 ${s}/5 · OK`,
  },
};

type Copy = typeof COPY.en;

/* ─── transitions ───────────────────────────────────────────────── */
const TRANSITIONS: SceneTransitionMap = {
  "1->2": "hard-cut",
  "2->3": "slide-y",
  "3->4": "slide-y",
  "4->5": "hard-cut",
};

/* ─── nav: N9 command / status bar ──────────────────────────────── */
function StatusBar({
  scene,
  language,
  isThumbnail,
  onNavigate,
}: {
  scene: number;
  language: "en" | "zh";
  isThumbnail: boolean;
  onNavigate?: (scene: number, beat: number) => void;
}) {
  if (isThumbnail) return null;
  const c = COPY[language];
  return (
    <div className={styles.statusBar} onClick={(e) => e.stopPropagation()}>
      <span className={styles.prompt}>ops@runbook:~$</span>
      <span className={styles.stepTag}>{c.step(scene)}</span>
      <span className={styles.blink}>▋</span>
      <div className={styles.ticks}>
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            className={styles.tick}
            data-cur={n === scene ? "true" : "false"}
            onClick={(e) => {
              e.stopPropagation();
              onNavigate?.(n, 0);
            }}
          >
            {n}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ─── scenes ────────────────────────────────────────────────────── */
function Scene({
  scene,
  beat,
  c,
  motion,
}: {
  scene: number;
  beat: number;
  c: Copy;
  motion: boolean;
}) {
  const enter = motion ? styles.enter : "";

  if (scene === 1) {
    return (
      <div className={`${styles.page} ${styles.center} ${enter}`}>
        <div className={`${styles.stripe} ${styles.a1}`} />
        <div className={`${styles.hdrMeta} ${styles.a1}`}>
          <span>{c.tag}</span>
          <span className={styles.warnPill}>{c.priority}</span>
        </div>
        <h1 className={`${styles.title1} ${styles.a2}`}>{c.title}</h1>
        <div className={`${styles.sub1} ${styles.a2}`}>{c.sub}</div>
        <div className={`${styles.warnBanner} ${styles.a3}`}>{c.banner}</div>
        <div className={`${styles.stripe} ${styles.a3}`} />
      </div>
    );
  }

  if (scene === 2) {
    const activeCount = beat >= 1 ? 4 : 2;
    return (
      <div className={styles.page}>
        <div className={styles.crumb}>{c.stepsTitle}</div>
        <ol
          className={styles.stepList}
          data-beat-layout-container="true"
          data-beat-layout-mode="reserved"
        >
          {c.steps.map((s, i) => (
            <li
              key={s.n}
              className={styles.stepRow}
              data-beat-layout-item="true"
              data-active={i < activeCount ? "true" : "false"}
            >
              <span className={styles.stepNum}>{s.n}</span>
              <span className={styles.stepText}>{s.t}</span>
              <span className={styles.stepFlag}>{s.f}</span>
            </li>
          ))}
        </ol>
      </div>
    );
  }

  if (scene === 3) {
    const t = c.term;
    return (
      <div className={styles.page}>
        <div className={styles.crumb}>{c.execTitle}</div>
        <div className={styles.terminal}>
          <div className={styles.termBar}>
            <span className={styles.dot} style={{ background: "#ff5f56" }} />
            <span className={styles.dot} style={{ background: "#ffbd2e" }} />
            <span className={styles.dot} style={{ background: "#27c93f" }} />
            <span className={styles.termPath}>{t.path}</span>
          </div>
          <div
            className={styles.termBody}
            data-beat-layout-container="true"
            data-beat-layout-mode="reserved"
          >
            <div className={styles.line} data-beat-layout-item="true" data-show="true">
              <span className={styles.sign}>ops@runbook</span> {t.prompt}
              <span className={styles.cursor} style={{ opacity: beat === 0 ? 1 : 0 }} />
            </div>
            <div
              className={`${styles.line} ${styles.lineRun}`}
              data-beat-layout-item="true"
              data-show={beat >= 1 ? "true" : "false"}
            >
              {t.run}
            </div>
            <div
              className={`${styles.line} ${styles.lineOut}`}
              data-beat-layout-item="true"
              data-show={beat >= 1 ? "true" : "false"}
            >
              {t.out1}
            </div>
            <div
              className={`${styles.line} ${styles.lineOut}`}
              data-beat-layout-item="true"
              data-show={beat >= 2 ? "true" : "false"}
            >
              {t.out2}
            </div>
            <div
              className={`${styles.line} ${styles.lineOut}`}
              data-beat-layout-item="true"
              data-show={beat >= 2 ? "true" : "false"}
            >
              {t.out3}
            </div>
            <div
              className={`${styles.line} ${styles.lineExit}`}
              data-beat-layout-item="true"
              data-show={beat >= 2 ? "true" : "false"}
            >
              {t.exit}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (scene === 4) {
    const ok = beat >= 1;
    return (
      <div className={styles.page}>
        <div className={styles.crumb}>{c.verifyTitle}</div>
        <div
          className={styles.checkGrid}
          data-beat-layout-container="true"
          data-beat-layout-mode="reserved"
        >
          {c.checks.map((chk) => (
            <div
              key={chk.k}
              className={styles.checkRow}
              data-beat-layout-item="true"
              data-ok={ok ? "true" : "false"}
            >
              <span className={styles.checkState} data-ok={ok ? "true" : "false"}>
                {ok ? "[  OK  ]" : "[ WAIT ]"}
              </span>
              <span className={styles.checkKey}>{chk.k}</span>
              <span className={styles.checkVal}>{chk.v}</span>
            </div>
          ))}
        </div>
        <div className={styles.statusLine} data-ok={ok ? "true" : "false"}>
          {ok ? c.verified : c.verifying}
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.page} ${styles.center} ${enter}`}>
      <div className={styles.stripe} />
      <div className={styles.stamp}>{c.stamp}</div>
      <h2 className={styles.title5}>{c.doneTitle}</h2>
      <div className={styles.meta5}>{c.doneMeta}</div>
      <div className={styles.note5}>{c.doneNote}</div>
      <div className={styles.stripe} />
    </div>
  );
}

/* ─── root component ────────────────────────────────────────────── */
function RotateTheSecretsV3({
  scene,
  beat,
  language,
  isThumbnail,
  reducedMotion,
  onNavigate,
}: BespokeStyleProps) {
  useFonts();
  const c = COPY[language];
  const still = reducedMotion || isThumbnail;

  return (
    <div
      className={styles.root}
      style={ROOT_VARS}
      data-reduced={still ? "true" : undefined}
    >
      <SpatialSceneTrack
        scene={scene}
        beat={beat}
        transitionKind="hard-cut"
        transitionMap={TRANSITIONS}
        reducedMotion={still}
        beatLayoutModes={{ 2: "reserved", 3: "reserved", 4: "reserved" }}
        renderScene={(sceneId, sceneBeat, isActive) => (
          <Scene
            scene={sceneId}
            beat={sceneBeat}
            c={c}
            motion={isActive && !still}
          />
        )}
      />
      <StatusBar
        scene={scene}
        language={language}
        isThumbnail={isThumbnail}
        onNavigate={onNavigate}
      />
    </div>
  );
}

/* ─── metadata ──────────────────────────────────────────────────── */
export function getMetadata(lang: "en" | "zh"): StyleMetadata {
  const c = COPY[lang];
  const isEn = lang === "en";
  return {
    id: "37",
    band: "contemporary-digital",
    name: isEn ? "Operating Manual" : "操作手册",
    theme: c.title,
    densityLabel: isEn ? "Reading-First" : "阅读优先",
    heroScene: 3,
    colors: { bg: "#0a0c10", ink: "#f2f4f7", panel: "#141821" },
    typography: { header: "JetBrains Mono", body: "IBM Plex Mono" },
    tags: [
      "industrial",
      "procedural",
      "terminal",
      "runbook",
      "high-contrast",
      "warning-amber",
      "monospace",
      "dark",
      "crisp-motion",
      "command",
    ],
    fonts: ["JetBrains Mono", "IBM Plex Mono", "cjk:Noto Sans SC"],
    scenes: [
      {
        id: 1,
        title: isEn ? "The procedure" : "操作流程",
        beats: [
          {
            id: 0,
            action: isEn ? "Post the header" : "亮出操作头",
            title: c.title,
            body: c.banner,
          },
        ],
      },
      {
        id: 2,
        title: isEn ? "The steps" : "操作步骤",
        beats: [
          {
            id: 0,
            action: isEn ? "Pre-flight" : "预检",
            title: isEn ? "Steps 01 – 02" : "步骤 01 – 02",
            body: c.steps[0].t,
          },
          {
            id: 1,
            action: isEn ? "Rotate" : "轮换",
            title: isEn ? "Steps 03 – 04" : "步骤 03 – 04",
            body: c.steps[3].t,
          },
        ],
      },
      {
        id: 3,
        title: isEn ? "Execution" : "执行",
        beats: [
          {
            id: 0,
            action: isEn ? "Type command" : "输入命令",
            title: c.term.prompt,
            body: isEn ? "Command staged." : "命令已就绪。",
          },
          {
            id: 1,
            action: isEn ? "Run" : "运行",
            title: c.term.run,
            body: c.term.out1,
          },
          {
            id: 2,
            action: isEn ? "Reveal output" : "输出结果",
            title: c.term.exit,
            body: c.term.out3,
          },
        ],
      },
      {
        id: 4,
        title: isEn ? "Verification" : "校验",
        beats: [
          {
            id: 0,
            action: isEn ? "Run checks" : "执行检查",
            title: c.verifying,
            body: c.checks[0].k,
          },
          {
            id: 1,
            action: isEn ? "Confirm" : "确认",
            title: c.verified,
            body: c.checks[2].k,
          },
        ],
      },
      {
        id: 5,
        title: isEn ? "Complete" : "完成",
        beats: [
          {
            id: 0,
            action: isEn ? "Sign off" : "收尾",
            title: c.doneTitle,
            body: c.doneNote,
          },
        ],
      },
    ],
  };
}

export default RotateTheSecretsV3;

export const RotateTheSecretsV3Version = defineStyleVersion({
  id: "v3",
  topic: { en: "Rotate the Secrets", zh: "轮换密钥" },
  model: "Claude-Opus-4.8",
  component: RotateTheSecretsV3,
  getMetadata,
});

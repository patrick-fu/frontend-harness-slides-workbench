import type { ReactNode } from "react";
import SpatialSceneTrack from "./SpatialSceneTrack";
import type { SceneTransitionMap } from "./SpatialSceneTrack";
import { defineStyleTopic } from "./topic";
import { curatedNavigationAttributes } from "./curated-topic-contract";
import type { BespokeStyleProps, StyleMetadata } from "../types";

/* ─────────────────────────────────────────────────────────────
   Style 43 · "Maintainer Issue Brief" · v3
   Topic: Flaky Test, Root Cause
   DNA: clean light developer-gray tracker; quiet borders; status
   colors (merge-ready green + informational blue) on badges only;
   sharp neutral headings (Inter) + monospaced code voice
   (JetBrains Mono). Tidy low-chrome depth; crisp functional motion.
   ───────────────────────────────────────────────────────────── */

const SANS = "'Inter', 'Noto Sans SC', system-ui, -apple-system, sans-serif";
const MONO =
  "'JetBrains Mono', 'Noto Sans SC', ui-monospace, SFMono-Regular, monospace";

const C = {
  bg: "#eef0f3",
  surface: "#ffffff",
  ink: "#1f2328",
  sub: "#59636e",
  faint: "#8b939d",
  border: "#d5d9de",
  borderSoft: "#e7eaee",
  blue: "#0969da",
  blueBg: "#ddf4ff",
  green: "#1a7f37",
  greenBg: "#dafbe1",
  delBg: "#ffebe9",
  delInk: "#a4232d",
  addBg: "#e6ffec",
  addInk: "#116329",
  codeBg: "#f6f8fa",
};

const TRANSITIONS: SceneTransitionMap = {
  "1->2": "hard-cut",
  "2->3": "slide-y",
  "3->4": "slide-x",
  "4->5": "hard-cut",
};

/* ── bilingual content (no `as const` — breaks build) ───────────── */

const LOG_LINES = [
  { mark: "✓", text: "renders cart summary", tail: "12 ms", fail: false },
  { mark: "✓", text: "validates card number", tail: "8 ms", fail: false },
  { mark: "✗", text: "applies promo code", tail: "timeout", fail: true },
  { mark: " ", text: "  expected   \"$18.00\"", tail: "", fail: true },
  { mark: " ", text: "  received   \"$20.00\"", tail: "", fail: true },
];

const COPY = {
  en: {
    repo: "acme/web-platform",
    issue: "#1428",
    open: "OPEN",
    resolved: "RESOLVED",
    stages: ["TICKET", "SYMPTOM", "INVESTIGATION", "FIX", "MERGED"],
    s1: {
      title: "Checkout suite fails intermittently in CI",
      desc: "The end-to-end checkout tests are flaky on CI and keep blocking merges to main.",
      labels: ["flaky-test", "ci", "priority: high", "tests"],
      meta: "opened by @dai · 3 days ago · 12 comments",
    },
    s2: {
      label: "OBSERVED",
      summary:
        "checkout.spec.ts › applies promo code — green locally, red on roughly 1 in 6 CI runs.",
      logCaption: "ci run #4821 — failing shard",
      calloutTitle: "Non-deterministic",
      callout:
        "Same commit, same command — the result flips between runs. Nothing in the diff explains it.",
    },
    s3: {
      label: "INVESTIGATION",
      rows: [
        "Reproduced locally with vitest --repeat=50 → 3 / 50 failed",
        "Bisected: only fails when it runs after date.spec.ts",
        "Root cause: a global Date.now mock is never restored",
      ],
      rootTag: "ROOT CAUSE",
    },
    s4: {
      label: "THE FIX",
      file: "tests/setup/date.spec.ts",
      diff: [
        { sign: " ", kind: "ctx", text: "beforeEach(() => {" },
        { sign: "-", kind: "del", text: "  vi.spyOn(Date, 'now').mockReturnValue(0)" },
        { sign: "+", kind: "add", text: "  vi.useFakeTimers({ toFake: ['Date'] })" },
        { sign: " ", kind: "ctx", text: "})" },
        { sign: "+", kind: "add", text: "" },
        { sign: "+", kind: "add", text: "afterEach(() => {" },
        { sign: "+", kind: "add", text: "  vi.useRealTimers()  // restore the global clock" },
        { sign: "+", kind: "add", text: "})" },
      ],
      note: "Fake timers are now torn down after every test, so state can't leak into the next file.",
    },
    s5: {
      heading: "Merged",
      merge: "Merged #1431 · squash-merged into main · by @dai",
      note: "Restored the global clock in afterEach. The checkout suite has been green for 200+ consecutive CI runs.",
      stat: "0 flakes / 200 runs",
    },
  },
  zh: {
    repo: "acme/web-platform",
    issue: "#1428",
    open: "OPEN",
    resolved: "RESOLVED",
    stages: ["工单", "现象", "排查", "修复", "合并"],
    s1: {
      title: "结算测试套件在 CI 中偶发失败",
      desc: "端到端结算测试在 CI 上不稳定，持续阻塞向 main 的合并。",
      labels: ["不稳定测试", "ci", "优先级：高", "测试"],
      meta: "由 @dai 创建 · 3 天前 · 12 条评论",
    },
    s2: {
      label: "观察到的现象",
      summary:
        "checkout.spec.ts › applies promo code —— 本地通过，CI 中约每 6 次失败 1 次。",
      logCaption: "CI 运行 #4821 —— 失败分片",
      calloutTitle: "无法复现的随机性",
      callout:
        "同一次提交、同一条命令，结果在多次运行间反复横跳；diff 里没有任何改动能解释它。",
    },
    s3: {
      label: "排查过程",
      rows: [
        "本地用 vitest --repeat=50 复现 → 50 次中 3 次失败",
        "二分定位：仅在 date.spec.ts 之后运行时失败",
        "根因：全局 Date.now mock 从未被恢复",
      ],
      rootTag: "根因",
    },
    s4: {
      label: "修复方案",
      file: "tests/setup/date.spec.ts",
      diff: [
        { sign: " ", kind: "ctx", text: "beforeEach(() => {" },
        { sign: "-", kind: "del", text: "  vi.spyOn(Date, 'now').mockReturnValue(0)" },
        { sign: "+", kind: "add", text: "  vi.useFakeTimers({ toFake: ['Date'] })" },
        { sign: " ", kind: "ctx", text: "})" },
        { sign: "+", kind: "add", text: "" },
        { sign: "+", kind: "add", text: "afterEach(() => {" },
        { sign: "+", kind: "add", text: "  vi.useRealTimers()  // 恢复全局时钟" },
        { sign: "+", kind: "add", text: "})" },
      ],
      note: "假计时器现在会在每个测试后销毁，状态不会再泄漏到下一个测试文件。",
    },
    s5: {
      heading: "已合并",
      merge: "合并 #1431 · squash 合并入 main · 由 @dai",
      note: "在 afterEach 中恢复了全局时钟。结算套件已连续 200+ 次 CI 全绿。",
      stat: "200 次运行 / 0 次抖动",
    },
  },
};

type Copy = typeof COPY.en;

/* ── shared pieces ──────────────────────────────────────────────── */

function Badge({ resolved, label }: { resolved: boolean; label: ReactNode }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.7cqw",
        padding: "0.85cqh 1.5cqw",
        borderRadius: "4cqw",
        fontFamily: SANS,
        fontWeight: 700,
        fontSize: "1.55cqh",
        letterSpacing: "0.09em",
        color: "#ffffff",
        background: resolved ? C.green : C.blue,
        whiteSpace: "nowrap",
      }}
    >
      <span
        style={{
          width: "1.15cqh",
          height: "1.15cqh",
          borderRadius: "50%",
          background: "#ffffff",
          opacity: 0.92,
        }}
      />
      {label}
    </span>
  );
}

function SectionLabel({ text }: { text: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "1cqw",
        fontFamily: MONO,
        fontSize: "1.55cqh",
        fontWeight: 600,
        letterSpacing: "0.12em",
        color: C.faint,
      }}
    >
      <span
        style={{
          width: "1.1cqh",
          height: "1.1cqh",
          background: C.faint,
          borderRadius: "0.2cqw",
        }}
      />
      {text}
    </div>
  );
}

function CardShell({
  sceneId,
  t,
  children,
}: {
  sceneId: number;
  t: Copy;
  children: ReactNode;
}) {
  const resolved = sceneId >= 5;
  return (
    <div
      style={{
        flex: 1,
        minHeight: 0,
        background: C.surface,
        border: `0.1cqw solid ${C.border}`,
        borderRadius: "1.1cqw",
        boxShadow: "0 0.4cqh 1.6cqh rgba(31,35,40,0.06)",
        padding: "3.6cqh 3.4cqw",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "2cqw",
        }}
      >
        <span
          style={{
            fontFamily: MONO,
            fontSize: "1.7cqh",
            color: C.sub,
            letterSpacing: "0.01em",
          }}
        >
          {t.repo}
          <span style={{ color: C.ink, fontWeight: 700 }}> {t.issue}</span>
        </span>
        <Badge resolved={resolved} label={resolved ? t.resolved : t.open} />
      </div>
      <div
        style={{
          height: "0.1cqw",
          background: C.borderSoft,
          margin: "2.4cqh 0 2.8cqh",
          flex: "0 0 auto",
        }}
      />
      <div
        style={{
          flex: 1,
          minHeight: 0,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {children}
      </div>
    </div>
  );
}

function Chip({ text }: { text: string }) {
  return (
    <span
      style={{
        fontFamily: MONO,
        fontSize: "1.5cqh",
        color: C.sub,
        background: C.codeBg,
        border: `0.1cqw solid ${C.borderSoft}`,
        borderRadius: "3cqw",
        padding: "0.7cqh 1.4cqw",
        whiteSpace: "nowrap",
      }}
    >
      {text}
    </span>
  );
}

/* ── scenes ─────────────────────────────────────────────────────── */

function Scene1({ t }: { t: Copy }) {
  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: "3.2cqh",
      }}
    >
      <h1
        style={{
          margin: 0,
          fontFamily: SANS,
          fontWeight: 800,
          fontSize: "4cqh",
          lineHeight: 1.14,
          letterSpacing: "-0.01em",
          color: C.ink,
          maxWidth: "76cqw",
        }}
      >
        {t.s1.title}
      </h1>
      <p
        style={{
          margin: 0,
          fontFamily: SANS,
          fontSize: "2.05cqh",
          lineHeight: 1.5,
          color: C.sub,
          maxWidth: "72cqw",
        }}
      >
        {t.s1.desc}
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "1cqw" }}>
        {t.s1.labels.map((l) => (
          <Chip key={l} text={l} />
        ))}
      </div>
      <div
        style={{
          fontFamily: MONO,
          fontSize: "1.6cqh",
          color: C.faint,
          marginTop: "0.4cqh",
        }}
      >
        {t.s1.meta}
      </div>
    </div>
  );
}

function Scene2({ t, beat, still }: { t: Copy; beat: number; still: boolean }) {
  const revealed = beat >= 1;
  const trans = still ? "none" : "opacity 380ms ease, color 380ms ease";
  return (
    <div
      data-beat-layout-container="true"
      data-beat-layout-mode="reserved"
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        gap: "2.4cqh",
        minHeight: 0,
      }}
    >
      <SectionLabel text={t.s2.label} />
      <p
        data-beat-layout-item="true"
        style={{
          margin: 0,
          fontFamily: SANS,
          fontSize: "2.05cqh",
          lineHeight: 1.5,
          color: C.ink,
          maxWidth: "78cqw",
        }}
      >
        {t.s2.summary}
      </p>
      <div
        data-beat-layout-item="true"
        style={{
          background: C.codeBg,
          border: `0.1cqw solid ${C.borderSoft}`,
          borderRadius: "0.8cqw",
          padding: "1.8cqh 2.2cqw",
          fontFamily: MONO,
          fontSize: "1.7cqh",
          lineHeight: 1.75,
        }}
      >
        <div style={{ color: C.faint, fontSize: "1.45cqh", marginBottom: "0.9cqh" }}>
          {t.s2.logCaption}
        </div>
        {LOG_LINES.map((line, i) => {
          const active = line.fail && revealed;
          return (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent: "space-between",
                color: line.fail ? (active ? C.delInk : C.sub) : C.sub,
                fontWeight: active ? 600 : 400,
                transition: trans,
              }}
            >
              <span>
                <span style={{ color: line.mark === "✗" ? C.delInk : C.green }}>
                  {line.mark}
                </span>{" "}
                {line.text}
              </span>
              {line.tail ? <span style={{ color: C.faint }}>{line.tail}</span> : null}
            </div>
          );
        })}
      </div>
      <div
        data-beat-layout-item="true"
        style={{
          borderLeft: `0.35cqw solid ${C.blue}`,
          background: C.blueBg,
          borderRadius: "0.6cqw",
          padding: "1.6cqh 2cqw",
          opacity: revealed ? 1 : 0,
          transition: trans,
        }}
      >
        <div
          style={{
            fontFamily: MONO,
            fontSize: "1.5cqh",
            fontWeight: 600,
            letterSpacing: "0.06em",
            color: C.blue,
            marginBottom: "0.5cqh",
          }}
        >
          {t.s2.calloutTitle}
        </div>
        <div style={{ fontFamily: SANS, fontSize: "1.85cqh", lineHeight: 1.45, color: C.ink }}>
          {t.s2.callout}
        </div>
      </div>
    </div>
  );
}

function Scene3({ t, beat, still }: { t: Copy; beat: number; still: boolean }) {
  const trans = still ? "none" : "all 320ms cubic-bezier(0.4,0,0.2,1)";
  return (
    <div
      data-beat-layout-container="true"
      data-beat-layout-mode="reserved"
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        gap: "2.4cqh",
        minHeight: 0,
        justifyContent: "center",
      }}
    >
      <SectionLabel text={t.s3.label} />
      <div style={{ display: "flex", flexDirection: "column", gap: "1.8cqh" }}>
        {t.s3.rows.map((row, i) => {
          const checked = beat >= i;
          const isRoot = i === t.s3.rows.length - 1;
          const rootOn = isRoot && checked;
          return (
            <div
              key={i}
              data-beat-layout-item="true"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1.4cqw",
                padding: "1.5cqh 1.8cqw",
                borderRadius: "0.7cqw",
                border: `0.1cqw solid ${rootOn ? C.blue : C.borderSoft}`,
                background: rootOn ? C.blueBg : C.surface,
                transition: trans,
              }}
            >
              <span
                style={{
                  flex: "0 0 auto",
                  width: "2.4cqh",
                  height: "2.4cqh",
                  borderRadius: "0.4cqw",
                  border: `0.14cqw solid ${checked ? C.green : C.border}`,
                  background: checked ? C.green : "transparent",
                  color: "#ffffff",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.6cqh",
                  transition: trans,
                }}
              >
                {checked ? "✓" : ""}
              </span>
              <span
                style={{
                  flex: 1,
                  fontFamily: MONO,
                  fontSize: "1.85cqh",
                  lineHeight: 1.35,
                  color: checked ? C.ink : C.faint,
                  fontWeight: rootOn ? 600 : 400,
                  transition: trans,
                }}
              >
                {row}
              </span>
              <span
                style={{
                  flex: "0 0 auto",
                  fontFamily: MONO,
                  fontSize: "1.4cqh",
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  color: "#ffffff",
                  background: C.blue,
                  borderRadius: "3cqw",
                  padding: "0.5cqh 1.2cqw",
                  opacity: rootOn ? 1 : 0,
                  transition: trans,
                  whiteSpace: "nowrap",
                }}
              >
                {t.s3.rootTag}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Scene4({ t, beat, still }: { t: Copy; beat: number; still: boolean }) {
  const after = beat >= 1;
  const trans = still ? "none" : "opacity 380ms ease, background 380ms ease";
  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        gap: "2.2cqh",
        minHeight: 0,
      }}
    >
      <SectionLabel text={t.s4.label} />
      <div
        style={{
          fontFamily: MONO,
          fontSize: "1.6cqh",
          color: C.sub,
          background: C.codeBg,
          border: `0.1cqw solid ${C.borderSoft}`,
          borderRadius: "0.6cqw 0.6cqw 0 0",
          borderBottom: "none",
          padding: "1cqh 1.8cqw",
        }}
      >
        {t.s4.file}
      </div>
      <div
        data-beat-layout-container="true"
        data-beat-layout-mode="reserved"
        style={{
          marginTop: "-2.2cqh",
          border: `0.1cqw solid ${C.borderSoft}`,
          borderRadius: "0 0 0.6cqw 0.6cqw",
          overflow: "hidden",
          fontFamily: MONO,
          fontSize: "1.75cqh",
          lineHeight: 1,
        }}
      >
        {t.s4.diff.map((line, i) => {
          const isAdd = line.kind === "add";
          const isDel = line.kind === "del";
          let bg = "transparent";
          let ink = C.ink;
          let opacity = 1;
          if (isDel) {
            bg = C.delBg;
            ink = C.delInk;
            opacity = after ? 0.55 : 1;
          } else if (isAdd) {
            bg = after ? C.addBg : "transparent";
            ink = after ? C.addInk : C.faint;
            opacity = after ? 1 : 0.4;
          } else {
            ink = C.sub;
          }
          return (
            <div
              key={i}
              data-beat-layout-item="true"
              style={{
                display: "flex",
                background: bg,
                opacity,
                transition: trans,
                padding: "0.9cqh 0",
              }}
            >
              <span
                style={{
                  flex: "0 0 auto",
                  width: "2.6cqw",
                  textAlign: "center",
                  color: isDel ? C.delInk : isAdd ? C.addInk : C.faint,
                  fontWeight: 700,
                }}
              >
                {line.sign}
              </span>
              <span style={{ color: ink, whiteSpace: "pre" }}>{line.text || " "}</span>
            </div>
          );
        })}
      </div>
      <p
        style={{
          margin: 0,
          fontFamily: SANS,
          fontSize: "1.85cqh",
          lineHeight: 1.45,
          color: C.sub,
          opacity: after ? 1 : 0.35,
          transition: still ? "none" : "opacity 380ms ease",
          maxWidth: "80cqw",
        }}
      >
        {t.s4.note}
      </p>
    </div>
  );
}

function Scene5({ t }: { t: Copy }) {
  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: "3cqh",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "1.6cqw" }}>
        <span
          style={{
            width: "5cqh",
            height: "5cqh",
            borderRadius: "50%",
            background: C.green,
            color: "#ffffff",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "2.8cqh",
            fontWeight: 700,
          }}
        >
          ✓
        </span>
        <h1
          style={{
            margin: 0,
            fontFamily: SANS,
            fontWeight: 800,
            fontSize: "4.2cqh",
            letterSpacing: "-0.01em",
            color: C.ink,
          }}
        >
          {t.s5.heading}
        </h1>
      </div>
      <div
        style={{
          fontFamily: MONO,
          fontSize: "1.85cqh",
          color: C.sub,
        }}
      >
        {t.s5.merge}
      </div>
      <p
        style={{
          margin: 0,
          fontFamily: SANS,
          fontSize: "2.05cqh",
          lineHeight: 1.5,
          color: C.ink,
          maxWidth: "74cqw",
        }}
      >
        {t.s5.note}
      </p>
      <span
        style={{
          alignSelf: "flex-start",
          fontFamily: MONO,
          fontSize: "1.6cqh",
          fontWeight: 700,
          letterSpacing: "0.05em",
          color: C.green,
          background: C.greenBg,
          border: `0.1cqw solid ${C.green}`,
          borderRadius: "3cqw",
          padding: "0.8cqh 1.6cqw",
        }}
      >
        {t.s5.stat}
      </span>
    </div>
  );
}

function SceneContent({
  sceneId,
  beat,
  t,
  still,
}: {
  sceneId: number;
  beat: number;
  t: Copy;
  still: boolean;
}) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        padding: "6cqh 6cqw 11cqh",
        display: "flex",
        flexDirection: "column",
        boxSizing: "border-box",
        fontFamily: SANS,
        color: C.ink,
      }}
    >
      <CardShell sceneId={sceneId} t={t}>
        {sceneId === 1 ? <Scene1 t={t} /> : null}
        {sceneId === 2 ? <Scene2 t={t} beat={beat} still={still} /> : null}
        {sceneId === 3 ? <Scene3 t={t} beat={beat} still={still} /> : null}
        {sceneId === 4 ? <Scene4 t={t} beat={beat} still={still} /> : null}
        {sceneId === 5 ? <Scene5 t={t} /> : null}
      </CardShell>
    </div>
  );
}

function StatusBar({
  scene,
  t,
  isThumbnail,
  onNavigate,
}: {
  scene: number;
  t: Copy;
  isThumbnail: boolean;
  onNavigate?: (scene: number, beat: number) => void;
}) {
  if (isThumbnail) return null;
  const resolved = scene >= 5;
  return (
    <div
      {...curatedNavigationAttributes("maintainer-issue-brief", "flaky-test-root-cause")}
      style={{
        position: "absolute",
        left: "6cqw",
        right: "6cqw",
        bottom: "3cqh",
        height: "5.4cqh",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "2cqw",
        padding: "0 2.2cqw",
        background: C.surface,
        border: `0.1cqw solid ${C.border}`,
        borderRadius: "0.9cqw",
        boxShadow: "0 0.3cqh 1.2cqh rgba(31,35,40,0.05)",
        fontFamily: MONO,
        zIndex: 5,
      }}
    >
      <span style={{ fontSize: "1.6cqh", fontWeight: 700, color: C.ink }}>
        {t.issue}
      </span>
      <div style={{ display: "flex", alignItems: "center", gap: "0.6cqw" }}>
        {t.stages.map((label, i) => {
          const active = scene === i + 1;
          const done = scene > i + 1;
          return (
            <span key={label} style={{ display: "flex", alignItems: "center", gap: "0.6cqw" }}>
              {i > 0 ? <span style={{ color: C.faint, fontSize: "1.4cqh" }}>›</span> : null}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigate?.(i + 1, 0);
                }}
                style={{
                  border: "none",
                  background: active ? C.codeBg : "transparent",
                  borderRadius: "0.5cqw",
                  padding: "0.6cqh 1cqw",
                  cursor: "pointer",
                  fontFamily: MONO,
                  fontSize: "1.4cqh",
                  fontWeight: active ? 700 : 500,
                  letterSpacing: "0.06em",
                  color: active ? C.ink : done ? C.sub : C.faint,
                }}
              >
                {label}
              </button>
            </span>
          );
        })}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "0.9cqw", fontSize: "1.55cqh" }}>
        <span style={{ color: resolved ? C.faint : C.blue, fontWeight: resolved ? 500 : 700 }}>
          {t.open}
        </span>
        <span style={{ color: C.faint }}>→</span>
        <span style={{ color: resolved ? C.green : C.faint, fontWeight: resolved ? 700 : 500 }}>
          {t.resolved}
        </span>
      </div>
    </div>
  );
}

function FlakyTestRootCause({
  scene,
  beat,
  language,
  isThumbnail,
  reducedMotion,
  onNavigate,
}: BespokeStyleProps) {
  const t = COPY[language];
  const still = reducedMotion || isThumbnail;
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        background: `linear-gradient(180deg, #f2f3f5 0%, ${C.bg} 100%)`,
        fontFamily: SANS,
        color: C.ink,
      }}
    >
      <SpatialSceneTrack
        scene={scene}
        beat={beat}
        transitionKind="hard-cut"
        transitionMap={TRANSITIONS}
        reducedMotion={still}
        beatLayoutModes={{ 2: "reserved", 3: "reserved", 4: "reserved" }}
        renderScene={(sceneId, sceneBeat) => (
          <SceneContent sceneId={sceneId} beat={sceneBeat} t={t} still={still} />
        )}
      />
      <StatusBar scene={scene} t={t} isThumbnail={isThumbnail} onNavigate={onNavigate} />
    </div>
  );
}

/* ── metadata ───────────────────────────────────────────────────── */

const EN_SCENES: StyleMetadata["scenes"] = [
  {
    id: 1,
    title: "The ticket",
    beats: [
      {
        id: 0,
        action: "Open the issue",
        title: "Checkout suite fails intermittently in CI",
        body: "A flaky end-to-end suite is blocking merges to main; status OPEN.",
      },
    ],
  },
  {
    id: 2,
    title: "The symptom",
    beats: [
      {
        id: 0,
        action: "Log what's observed",
        title: "Observed",
        body: "Green locally, red on roughly 1 in 6 CI runs for one promo-code test.",
      },
      {
        id: 1,
        action: "Emphasize the tell",
        title: "Non-deterministic",
        body: "Same commit and command flip between pass and fail with no diff to explain it.",
      },
    ],
  },
  {
    id: 3,
    title: "The investigation",
    beats: [
      {
        id: 0,
        action: "Reproduce",
        title: "Repeat run",
        body: "vitest --repeat=50 fails 3 of 50 times.",
      },
      {
        id: 1,
        action: "Bisect",
        title: "Order dependence",
        body: "It only fails when it runs after date.spec.ts.",
      },
      {
        id: 2,
        action: "Name the cause",
        title: "Root cause",
        body: "A global Date.now mock is never restored.",
      },
    ],
  },
  {
    id: 4,
    title: "The fix",
    beats: [
      {
        id: 0,
        action: "Show before",
        title: "Before",
        body: "An unrestored Date.now mock leaks into later test files.",
      },
      {
        id: 1,
        action: "Show after",
        title: "After",
        body: "Fake timers are torn down in afterEach, so no state leaks.",
      },
    ],
  },
  {
    id: 5,
    title: "Merged",
    beats: [
      {
        id: 0,
        action: "Flip to resolved",
        title: "Merged",
        body: "Squash-merged into main; the suite is green for 200+ CI runs. Status RESOLVED.",
      },
    ],
  },
];

const ZH_SCENES: StyleMetadata["scenes"] = [
  {
    id: 1,
    title: "工单",
    beats: [
      {
        id: 0,
        action: "创建 issue",
        title: "结算测试套件在 CI 中偶发失败",
        body: "不稳定的端到端套件持续阻塞向 main 的合并；状态为 OPEN。",
      },
    ],
  },
  {
    id: 2,
    title: "现象",
    beats: [
      {
        id: 0,
        action: "记录观察结果",
        title: "观察到的现象",
        body: "某个 promo-code 测试本地通过，CI 中约每 6 次失败 1 次。",
      },
      {
        id: 1,
        action: "点出关键线索",
        title: "无法复现的随机性",
        body: "同一次提交与命令在通过与失败间反复横跳，diff 无法解释。",
      },
    ],
  },
  {
    id: 3,
    title: "排查",
    beats: [
      {
        id: 0,
        action: "复现",
        title: "重复运行",
        body: "vitest --repeat=50 在 50 次中失败 3 次。",
      },
      {
        id: 1,
        action: "二分定位",
        title: "顺序依赖",
        body: "仅在 date.spec.ts 之后运行时才会失败。",
      },
      {
        id: 2,
        action: "指明根因",
        title: "根因",
        body: "全局 Date.now mock 从未被恢复。",
      },
    ],
  },
  {
    id: 4,
    title: "修复",
    beats: [
      {
        id: 0,
        action: "展示修复前",
        title: "修复前",
        body: "未被恢复的 Date.now mock 会泄漏到后续测试文件。",
      },
      {
        id: 1,
        action: "展示修复后",
        title: "修复后",
        body: "假计时器在 afterEach 中销毁，状态不再泄漏。",
      },
    ],
  },
  {
    id: 5,
    title: "合并",
    beats: [
      {
        id: 0,
        action: "翻转为已解决",
        title: "已合并",
        body: "squash 合并入 main；套件连续 200+ 次 CI 全绿。状态为 RESOLVED。",
      },
    ],
  },
];

export function getMetadata(lang: "en" | "zh"): StyleMetadata {
  const en = lang === "en";
  return {
    id: "maintainer-issue-brief",
    band: "text-report",
    name: en ? "Maintainer Issue Brief" : "维护者问题简报",
    theme: en ? "Flaky Test, Root Cause" : "不稳定测试",
    densityLabel: en ? "Reading-First" : "阅读优先",
    heroScene: 1,
    colors: { bg: C.bg, ink: C.ink, panel: C.surface },
    typography: { header: "Inter", body: "JetBrains Mono" },
    tags: en
      ? [
          "engineering",
          "tracker",
          "issue-brief",
          "actionable",
          "reading-first",
          "monospace",
          "light",
          "status-driven",
          "diff",
          "crisp-motion",
        ]
      : [
          "工程",
          "问题追踪",
          "可执行",
          "阅读优先",
          "等宽",
          "浅色",
          "状态驱动",
          "差异对比",
          "干脆利落",
          "维护者",
        ],
    fonts: [
      "Inter:wght@400;500;600;700;800",
      "JetBrains Mono:wght@400;500;600;700",
      "cjk:Noto Sans SC:wght@400;500;700",
    ],
    scenes: en ? EN_SCENES : ZH_SCENES,
  };
}

export default FlakyTestRootCause;

export const FlakyTestRootCauseTopic = defineStyleTopic({
  id: "flaky-test-root-cause",
  topic: { en: "Flaky Test, Root Cause", zh: "不稳定测试" },
  model: "Claude Opus 4.8",
  component: FlakyTestRootCause,
  getMetadata,
});

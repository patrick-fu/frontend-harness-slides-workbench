import type { BespokeStyleProps, StyleMetadata } from "../types";
import { defineStyleTopic } from "./topic";
import { curatedNavigationAttributes } from "./curated-topic-contract";
import SpatialSceneTrack from "./SpatialSceneTrack";
import type { SceneTransitionMap } from "./SpatialSceneTrack";
import { useFLIP } from "../hooks/useFLIP";
import styles from "./raw-logs-to-report.module.css";

const TRANSITIONS: SceneTransitionMap = {
  "1->2": "wipe",
  "2->3": "wipe",
  "3->4": "slide-x",
  "4->5": "scale-fade",
};

const BEAT_LAYOUT_MODES: Record<number, "motion" | "reserved"> = {
  2: "motion",
  3: "motion",
  4: "reserved",
};

/* ------------------------------------------------------------------ */
/* Localized copy                                                       */
/* ------------------------------------------------------------------ */

type Copy = {
  kicker: string;
  title: string;
  subtitle: string;
  boardLabel: string;
  rawStamp: string;
  servedBadge: string;
  reportTitle: string;
  reportSummary: string;
  rail: { raw: string; prep: string; plated: string };
  /* scene 2 — raw log lines, grows with beat */
  rawLines: { text: string; noise: boolean; cut?: string }[];
  /* scene 3 — prep step captions */
  prepHead: { tag: string; title: string; body: string }[];
  /* scene 4 — plated metrics */
  metrics: { label: string; value: string }[];
  metricGhost: string;
  /* served report metrics */
  reportMetrics: { val: string; lab: string }[];
};

const EN: Copy = {
  kicker: "From Raw Logs to Report",
  title: "Kitchen Prep Station",
  subtitle:
    "Raw, noisy log lines go in. A clean, plated report comes out — filler trimmed, results served.",
  boardLabel: "Prep board · ready",
  rawStamp: "RAW",
  servedBadge: "Served",
  reportTitle: "Nightly Run Report",
  reportSummary:
    "Everything reduced to what matters: uptime held, errors trimmed, latency plated clean.",
  rail: { raw: "Raw", prep: "Prep", plated: "Plated" },
  rawLines: [
    { text: "INFO  heartbeat ok · retry · retry · noop", noise: true, cut: "cut" },
    { text: "ERROR 503 upstream timeout ×14", noise: false },
    { text: "DEBUG cache warm · trace · verbose dump", noise: true, cut: "cut" },
    { text: "WARN  p95 latency 812ms rising", noise: false },
    { text: "INFO  gc pause · gc pause · gc pause", noise: true, cut: "cut" },
    { text: "INFO  200 checkout completed ×9,204", noise: false },
  ],
  prepHead: [
    {
      tag: "Trim the filler",
      title: "Cross out the noise",
      body: "Heartbeats, verbose dumps, and repeated no-ops get lined through — the filler nobody eats.",
    },
    {
      tag: "Sweep it away",
      title: "Only the signal remains",
      body: "What's left is the good stock: real errors, rising latency, the counts that tell the story.",
    },
  ],
  metrics: [
    { label: "Uptime", value: "99.94%" },
    { label: "Errors", value: "-38%" },
    { label: "p95 latency", value: "812ms" },
    { label: "Throughput", value: "9,204" },
  ],
  metricGhost: "plating…",
  reportMetrics: [
    { val: "99.94%", lab: "Uptime" },
    { val: "-38%", lab: "Errors" },
    { val: "812ms", lab: "p95" },
    { val: "9,204", lab: "Orders" },
  ],
};

const ZH: Copy = {
  kicker: "日志到报告",
  title: "厨房备料台",
  subtitle:
    "杂乱的原始日志倒进来，端出一份干净装盘的报告——切掉填料，只上结果。",
  boardLabel: "备料台 · 就绪",
  rawStamp: "生料",
  servedBadge: "上菜",
  reportTitle: "夜间运行报告",
  reportSummary:
    "全部收拢为要点：可用率稳住，错误削减，延迟装盘上桌。",
  rail: { raw: "生料", prep: "备料", plated: "装盘" },
  rawLines: [
    { text: "INFO  心跳正常 · 重试 · 重试 · 空操作", noise: true, cut: "切" },
    { text: "ERROR 503 上游超时 ×14", noise: false },
    { text: "DEBUG 缓存预热 · 追踪 · 冗余转储", noise: true, cut: "切" },
    { text: "WARN  p95 延迟 812ms 上升", noise: false },
    { text: "INFO  GC 停顿 · GC 停顿 · GC 停顿", noise: true, cut: "切" },
    { text: "INFO  200 下单完成 ×9,204", noise: false },
  ],
  prepHead: [
    {
      tag: "切掉填料",
      title: "划掉噪声",
      body: "心跳、冗余转储、重复空操作被逐条划掉——没人会吃的填料。",
    },
    {
      tag: "扫到一边",
      title: "只剩信号",
      body: "留下的是好高汤：真实错误、上升的延迟、能讲清故事的数字。",
    },
  ],
  metrics: [
    { label: "可用率", value: "99.94%" },
    { label: "错误数", value: "-38%" },
    { label: "p95 延迟", value: "812ms" },
    { label: "吞吐量", value: "9,204" },
  ],
  metricGhost: "装盘中…",
  reportMetrics: [
    { val: "99.94%", lab: "可用率" },
    { val: "-38%", lab: "错误" },
    { val: "812ms", lab: "p95" },
    { val: "9,204", lab: "订单" },
  ],
};

const copyFor = (lang: "en" | "zh"): Copy => (lang === "zh" ? ZH : EN);

/* ------------------------------------------------------------------ */
/* Small utensil icons                                                 */
/* ------------------------------------------------------------------ */

function KnifeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M3 17c4-1 8-4 12-8l4-4-2 6c-2 5-6 8-11 9l-3-3z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
        fill="rgba(193,91,46,0.12)"
      />
      <path d="M4 20l3-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function BroomIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M14 3l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path
        d="M5 12l7 7 5-5c-1-3-4-6-7-7l-5 5z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
        fill="rgba(107,142,74,0.14)"
      />
      <path d="M12 19l-3 3M15 16l-2 2M18 13l-2 2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

function PlateIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="1.4" fill="rgba(193,91,46,0.1)" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Recipe-step rail navigation                                         */
/* ------------------------------------------------------------------ */

const RAIL_STEPS: { scene: number; key: keyof Copy["rail"]; Icon: typeof KnifeIcon }[] = [
  { scene: 2, key: "raw", Icon: KnifeIcon },
  { scene: 3, key: "prep", Icon: BroomIcon },
  { scene: 4, key: "plated", Icon: PlateIcon },
];

function RecipeRail({
  scene,
  copy,
  isThumbnail,
  onNavigate,
}: {
  scene: number;
  copy: Copy;
  isThumbnail: boolean;
  onNavigate?: (scene: number, beat: number) => void;
}) {
  if (isThumbnail) return null;
  return (
    <nav
      {...curatedNavigationAttributes("kitchen-prep-station", "raw-logs-to-report")}
      className={styles.rail}
      aria-label="Recipe steps"
    >
      {RAIL_STEPS.map((step, i) => {
        const active =
          scene === step.scene ||
          (step.scene === 2 && scene === 1) ||
          (step.scene === 4 && scene === 5);
        return (
          <div key={step.key} style={{ display: "flex", alignItems: "flex-start" }}>
            {i > 0 && <span className={styles.railConnector} aria-hidden="true" />}
            <button
              type="button"
              className={`${styles.railStep} ${active ? styles.active : ""}`}
              aria-current={active ? "step" : undefined}
              onClick={(e) => {
                e.stopPropagation();
                onNavigate?.(step.scene, 0);
              }}
            >
              <span className={styles.railIcon}>
                <step.Icon />
              </span>
              <span className={styles.railLabel}>{copy.rail[step.key]}</span>
            </button>
          </div>
        );
      })}
    </nav>
  );
}

/* ------------------------------------------------------------------ */
/* Scenes                                                              */
/* ------------------------------------------------------------------ */

function SceneTitle({ copy }: { copy: Copy }) {
  return (
    <div className={`${styles.scene} ${styles.sceneCenter}`}>
      <span className={styles.kicker}>{copy.kicker}</span>
      <h1 className={styles.title}>{copy.title}</h1>
      <p className={styles.subtitle}>{copy.subtitle}</p>
      <div className={styles.prepBoard} aria-hidden="true">
        <KnifeIcon className={styles.prepKnife} />
        <span className={styles.boardLabel}>{copy.boardLabel}</span>
      </div>
    </div>
  );
}

function SceneRaw({
  copy,
  beat,
  isActive,
  reducedMotion,
  isThumbnail,
}: {
  copy: Copy;
  beat: number;
  isActive: boolean;
  reducedMotion: boolean;
  isThumbnail: boolean;
}) {
  const { ref } = useFLIP<HTMLDivElement>({
    watch: [beat],
    disabled: reducedMotion || isThumbnail || !isActive,
    duration: 480,
    easing: "cubic-bezier(0.34, 1.56, 0.64, 1)",
    selector: '[data-beat-layout-item="true"]',
  });
  // beat 0: first dump (top half); beat 1: rest of the mess piled on
  const count = beat >= 1 ? copy.rawLines.length : 3;
  const lines = copy.rawLines.slice(0, count);
  return (
    <div className={styles.scene}>
      <div className={styles.sceneHead}>
        <span className={styles.stepTag}>{copy.rail.raw}</span>
      </div>
      <div className={styles.board}>
        <span className={styles.rawStamp} aria-hidden="true">
          {copy.rawStamp}
        </span>
        <div
          ref={ref}
          className={styles.logStrip}
          data-beat-layout-container="true"
          data-beat-layout-mode="motion"
        >
          {lines.map((ln, i) => (
            <div
              key={i}
              data-beat-layout-item="true"
              className={`${styles.logLine} ${ln.noise ? styles.noise : ""}`}
            >
              <span className={styles.logDot} aria-hidden="true" />
              <span>{ln.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ScenePrep({
  copy,
  beat,
  isActive,
  reducedMotion,
  isThumbnail,
}: {
  copy: Copy;
  beat: number;
  isActive: boolean;
  reducedMotion: boolean;
  isThumbnail: boolean;
}) {
  const { ref } = useFLIP<HTMLDivElement>({
    watch: [beat],
    disabled: reducedMotion || isThumbnail || !isActive,
    duration: 480,
    easing: "cubic-bezier(0.34, 1.56, 0.64, 1)",
    selector: '[data-beat-layout-item="true"]',
  });
  const head = copy.prepHead[Math.min(beat, copy.prepHead.length - 1)];
  // beat 0: noise still shown, crossed out. beat 1: swept away — only signal remains.
  const lines = beat >= 1 ? copy.rawLines.filter((l) => !l.noise) : copy.rawLines;
  return (
    <div className={styles.scene}>
      <div className={styles.sceneHead}>
        <span className={styles.stepTag}>{head.tag}</span>
        <h2 className={styles.sceneTitle}>{head.title}</h2>
        <p className={styles.sceneBody}>{head.body}</p>
      </div>
      <div className={styles.board}>
        <div
          ref={ref}
          className={styles.logStrip}
          data-beat-layout-container="true"
          data-beat-layout-mode="motion"
        >
          {lines.map((ln) => (
            <div
              key={ln.text}
              data-beat-layout-item="true"
              className={`${styles.logLine} ${ln.noise ? styles.noise : ""}`}
            >
              <span className={styles.logDot} aria-hidden="true" />
              <span>{ln.text}</span>
              {ln.noise && ln.cut && <span className={styles.cutTag}>{ln.cut}</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ScenePlating({ copy, beat }: { copy: Copy; beat: number }) {
  // reserved mode: all 4 slots reserved from beat 0; beats plate them in pairs.
  const onCount = beat >= 1 ? copy.metrics.length : 2;
  return (
    <div className={styles.scene}>
      <div className={styles.sceneHead}>
        <span className={styles.stepTag}>{copy.rail.plated}</span>
      </div>
      <div className={styles.plateWrap}>
        <div className={styles.plate}>
          <div
            className={styles.metricGrid}
            data-beat-layout-container="true"
            data-beat-layout-mode="reserved"
          >
            {copy.metrics.map((m, i) => (
              <div
                key={m.label}
                data-beat-layout-item="true"
                className={styles.metric}
                data-on={i < onCount ? "true" : "false"}
              >
                <span className={styles.metricLabel}>{m.label}</span>
                <div className={styles.metricSlot}>
                  <span className={styles.metricGhost} aria-hidden="true" />
                  <span className={styles.metricValue}>{m.value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function SceneServed({ copy }: { copy: Copy }) {
  return (
    <div className={styles.scene}>
      <span className={styles.plateUnder} aria-hidden="true" />
      <div className={styles.served}>
        <div className={styles.report}>
          <div className={styles.steam} aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <div className={styles.reportHead}>
            <h2 className={styles.reportTitle}>{copy.reportTitle}</h2>
            <span className={styles.reportBadge}>{copy.servedBadge}</span>
          </div>
          <div className={styles.reportMetrics}>
            {copy.reportMetrics.map((m) => (
              <div key={m.lab} className={styles.rMetric}>
                <span className={styles.rVal}>{m.val}</span>
                <span className={styles.rLab}>{m.lab}</span>
              </div>
            ))}
          </div>
          <p className={styles.reportSummary}>{copy.reportSummary}</p>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Root component                                                      */
/* ------------------------------------------------------------------ */

function KitchenPrepStationV3(props: BespokeStyleProps) {
  const { scene, beat, language, isThumbnail, reducedMotion, onNavigate } = props;
  const copy = copyFor(language);
  const staticMode = reducedMotion || isThumbnail;

  return (
    <div
      className={styles.root}
      data-static={staticMode ? "true" : "false"}
      style={
        {
          "--ink": "#3B2318",
          "--wood": "#8A5A34",
          "--terracotta": "#C15B2E",
          "--herb": "#6B8E4A",
          "--cream": "#FBF3E4",
          "--edge": "rgba(138,90,52,0.28)",
          "--font-head": '"Fraunces", "Noto Serif SC", Georgia, serif',
          "--font-body": '"Baloo 2", "Noto Serif SC", system-ui, sans-serif',
        } as React.CSSProperties
      }
    >
      <SpatialSceneTrack
        scene={scene}
        beat={beat}
        transitionKind="wipe"
        transitionMap={TRANSITIONS}
        reducedMotion={staticMode}
        beatLayoutModes={BEAT_LAYOUT_MODES}
        renderScene={(sceneId, sceneBeat, isActive) => {
          switch (sceneId) {
            case 1:
              return <SceneTitle copy={copy} />;
            case 2:
              return (
                <SceneRaw
                  copy={copy}
                  beat={sceneBeat}
                  isActive={isActive}
                  reducedMotion={reducedMotion}
                  isThumbnail={isThumbnail}
                />
              );
            case 3:
              return (
                <ScenePrep
                  copy={copy}
                  beat={sceneBeat}
                  isActive={isActive}
                  reducedMotion={reducedMotion}
                  isThumbnail={isThumbnail}
                />
              );
            case 4:
              return <ScenePlating copy={copy} beat={sceneBeat} />;
            case 5:
              return <SceneServed copy={copy} />;
            default:
              return null;
          }
        }}
      />
      <RecipeRail
        scene={scene}
        copy={copy}
        isThumbnail={isThumbnail}
        onNavigate={onNavigate}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Metadata — EN and ZH structurally identical                         */
/* ------------------------------------------------------------------ */

export function getMetadata(lang: "en" | "zh"): StyleMetadata {
  const t = lang === "zh";
  return {
    id: "kitchen-prep-station",
    band: "balanced-hybrid",
    name: t ? "厨房备料台" : "Kitchen Prep Station",
    theme: t ? "日志到报告" : "From Raw Logs to Report",
    densityLabel: t ? "备料台 · 五步" : "Prep station · five steps",
    heroScene: 4,
    colors: { bg: "#F1E0C2", ink: "#3B2318", panel: "#FBF3E4" },
    typography: {
      header: '"Fraunces", "Noto Serif SC", serif',
      body: '"Baloo 2", "Noto Serif SC", sans-serif',
    },
    tags: t
      ? ["温暖", "手作", "厨房", "从生到熟", "适中密度", "暖色"]
      : ["warm", "hands-on", "kitchen", "raw-to-refined", "balanced", "cozy"],
    fonts: [
      "Fraunces:opsz,wght@9..144,500;9..144,700",
      "Baloo 2:wght@500;600;700",
      "cjk:Noto Serif SC:wght@500;700",
    ],
    scenes: [
      {
        id: 1,
        title: t ? "备料台" : "The prep board",
        beats: [
          {
            id: 0,
            action: t ? "亮出空板" : "Show the empty board",
            title: t ? "厨房备料台" : "Kitchen Prep Station",
            body: t
              ? "一块空备料台，刀已备好，等着把生料变成能上桌的东西。"
              : "An empty prep board, knife ready, waiting to turn raw input into something you can serve.",
          },
        ],
      },
      {
        id: 2,
        title: t ? "生料" : "The raw",
        beats: [
          {
            id: 0,
            action: t ? "倒出第一批日志" : "Dump the first logs",
            title: t ? "杂乱倒上板" : "Mess hits the board",
            body: t
              ? "原始日志一股脑倒上来——心跳、重试、真实错误混作一团。"
              : "Raw logs land in a heap — heartbeats, retries, and real errors all mixed together.",
          },
          {
            id: 1,
            action: t ? "堆满整块板" : "Pile on the rest",
            title: t ? "全是噪声与信号" : "Noise and signal, piled",
            body: t
              ? "剩下的日志继续堆上，板面塞满，好料被填料埋住。"
              : "The rest piles on until the board is full, the good stuff buried under filler.",
          },
        ],
      },
      {
        id: 3,
        title: t ? "备料" : "The prep",
        beats: [
          {
            id: 0,
            action: t ? "划掉填料" : "Cross out the filler",
            title: t ? "划掉噪声" : "Cross out the noise",
            body: t
              ? "心跳、冗余转储、重复空操作被逐条划掉——没人会吃的填料。"
              : "Heartbeats, verbose dumps, and repeated no-ops get lined through — the filler nobody eats.",
          },
          {
            id: 1,
            action: t ? "扫到一边" : "Sweep it away",
            title: t ? "只剩信号" : "Only the signal remains",
            body: t
              ? "划掉的都扫走，留下真实错误、上升的延迟和关键数字。"
              : "The crossed-out lines are swept off, leaving real errors, rising latency, and the key counts.",
          },
        ],
      },
      {
        id: 4,
        title: t ? "装盘" : "The plating",
        beats: [
          {
            id: 0,
            action: t ? "摆上头两项" : "Plate the first two",
            title: t ? "干净指标上盘" : "Clean metrics onto the plate",
            body: t
              ? "可用率与错误数先摆上盘，位置早已留好。"
              : "Uptime and errors are arranged onto the plate first, their slots already reserved.",
          },
          {
            id: 1,
            action: t ? "补齐余下两项" : "Plate the rest",
            title: t ? "四项装盘完成" : "All four, plated",
            body: t
              ? "延迟与吞吐补上，四项指标整齐落在预留位置。"
              : "Latency and throughput fill in, four metrics settling neatly into their reserved spots.",
          },
        ],
      },
      {
        id: 5,
        title: t ? "上菜" : "Served",
        beats: [
          {
            id: 0,
            action: t ? "端出成品" : "Serve the finished plate",
            title: t ? "报告上桌" : "The report is served",
            body: t
              ? "杂乱日志端成一份干净装盘的报告——切掉填料，只上结果。"
              : "The messy logs are served as one clean, plated report — filler trimmed, results on the table.",
          },
        ],
      },
    ],
  };
}

export const kitchenPrepStationTopic = defineStyleTopic({
  id: "raw-logs-to-report",
  topic: { en: "From Raw Logs to Report", zh: "日志到报告" },
  model: "GPT 5.6 Sol",
  component: KitchenPrepStationV3,
  getMetadata,
});

export default KitchenPrepStationV3;

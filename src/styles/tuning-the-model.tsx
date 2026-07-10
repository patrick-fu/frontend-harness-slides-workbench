import { useEffect } from "react";
import type { CSSProperties } from "react";
import type { BespokeStyleProps, StyleMetadata } from "../types";
import { defineStyleTopic } from "./topic";
import SpatialSceneTrack from "./SpatialSceneTrack";
import type { SceneTransitionMap } from "./SpatialSceneTrack";
import { useFLIP } from "../hooks/useFLIP";
import styles from "./tuning-the-model.module.css";

/* ────────────────────────────────────────────────────────────────────────
   Studio Mixing Console — v3 "Tuning the Model"
   Balancing model hyperparameters (speed / cost / quality / safety) as
   physical faders, knobs, and level meters at real values.
   ──────────────────────────────────────────────────────────────────────── */

type Lang = "en" | "zh";

const TRANSITIONS: SceneTransitionMap = {
  "1->2": "slide-y",
  "2->3": "slide-y",
  "3->4": "hard-cut",
  "4->5": "fade",
};

/* vivid meter colors — confined to faders & meters */
const HOT = "#ff5a4d"; // hot level
const HEALTHY = "#3ce88a"; // healthy level
const ATTN = "#ffb43a"; // attention level

function bandColor(v: number): string {
  if (v >= 85) return HOT;
  if (v >= 50) return HEALTHY;
  return ATTN;
}

function segColor(frac: number): string {
  if (frac >= 0.85) return HOT;
  if (frac >= 0.6) return ATTN;
  return HEALTHY;
}

/* the four tunable channels (registry display order) */
const CH = [
  { id: "speed", tag: "CH-01", en: "Speed", zh: "速度" },
  { id: "cost", tag: "CH-02", en: "Cost", zh: "成本" },
  { id: "quality", tag: "CH-03", en: "Quality", zh: "质量" },
  { id: "safety", tag: "CH-04", en: "Safety", zh: "安全" },
] as const;

type Channel = (typeof CH)[number];
const chName = (c: Channel, lang: Lang) => (lang === "en" ? c.en : c.zh);

/* real per-beat levels (0..100) */
const S2_FILL: Record<string, number>[] = [
  { speed: 70, cost: 55, quality: 12, safety: 12 },
  { speed: 70, cost: 55, quality: 60, safety: 12 },
  { speed: 70, cost: 55, quality: 60, safety: 45 },
];
const S3_VALS: Record<string, number>[] = [
  { speed: 70, cost: 55, quality: 60, safety: 45 },
  { speed: 40, cost: 72, quality: 90, safety: 45 },
];
const S4_VALS: Record<string, number>[] = [
  { speed: 40, cost: 72, quality: 90, safety: 45 },
  { speed: 62, cost: 58, quality: 74, safety: 68 },
];
const S4_BAL = [38, 82];
const S5_FINAL: Record<string, number> = {
  speed: 62,
  cost: 58,
  quality: 74,
  safety: 68,
};

const S4_STATE = { en: ["UNBALANCED", "BALANCED"], zh: ["失衡", "已平衡"] };
const MASTER_STATE = { en: "HEALTHY · IN THE GREEN", zh: "健康 · 处于绿区" };
const NAV_LABELS = {
  en: ["PWR", "CH", "TRD", "MIX", "OUT"],
  zh: ["电源", "通道", "取舍", "混音", "输出"],
};

/* ── copy (structurally identical EN/ZH) ─────────────────────────────────── */
type Beat = { action: string; title: string; body: string };
type SceneCopy = { title: string; beats: Beat[] };
type Copy = { theme: string; density: string; kicker: string; scenes: SceneCopy[] };

const COPY: Record<Lang, Copy> = {
  en: {
    theme: "Tuning the Model",
    density: "Dense control surface",
    kicker: "SESSION · MODEL TUNING",
    scenes: [
      {
        title: "Power On",
        beats: [
          {
            action: "BOOT",
            title: "Tuning the Model",
            body: "The console powers on. Four channels, every meter resting at zero, before we set a single level.",
          },
        ],
      },
      {
        title: "The Channels",
        beats: [
          {
            action: "CH-01 / 02",
            title: "Speed & Cost",
            body: "Throughput faders slide up first — how fast each token lands and how cheaply it is produced.",
          },
          {
            action: "CH-03",
            title: "Quality",
            body: "The quality fader climbs to its starting level: answer accuracy, reasoning depth, faithfulness.",
          },
          {
            action: "CH-04",
            title: "Safety",
            body: "The safety fader sets last, guarding refusals and harmful output at its opening level.",
          },
        ],
      },
      {
        title: "The Trade-off",
        beats: [
          {
            action: "LEVELS",
            title: "Starting Levels",
            body: "The four channels sit at their opening balance, ranked by current level.",
          },
          {
            action: "PUSH",
            title: "Push Quality, Speed Drops",
            body: "Drive quality to the top and speed falls back — the desk always trades one level for another.",
          },
        ],
      },
      {
        title: "The Mix",
        beats: [
          {
            action: "PRE-MIX",
            title: "Off Balance",
            body: "Straight off the trade-off the knobs are skewed — one channel loud, another starved.",
          },
          {
            action: "SETTLE",
            title: "Settle the Mix",
            body: "Turn each knob until the balance meter reads even — a mix that holds all four at once.",
          },
        ],
      },
      {
        title: "Master Out",
        beats: [
          {
            action: "MASTER",
            title: "Master Out",
            body: "The output meter reads healthy in the green — the tuned model, balanced and shipped.",
          },
        ],
      },
    ],
  },
  zh: {
    theme: "调模型",
    density: "高密度控制面",
    kicker: "会话 · 模型调参",
    scenes: [
      {
        title: "上电开机",
        beats: [
          {
            action: "启动",
            title: "调模型",
            body: "控制台上电。四路通道，所有电平表停在零位，随后才开始设定第一个电平。",
          },
        ],
      },
      {
        title: "四路通道",
        beats: [
          {
            action: "第 1 / 2 路",
            title: "速度与成本",
            body: "先推吞吐类推子——每个 token 出得多快，又生成得多便宜。",
          },
          {
            action: "第 3 路",
            title: "质量",
            body: "质量推子升到起始电平：回答准确度、推理深度与忠实度。",
          },
          {
            action: "第 4 路",
            title: "安全",
            body: "安全推子最后设定，在起始电平上把守拒答与有害输出。",
          },
        ],
      },
      {
        title: "此消彼长",
        beats: [
          {
            action: "当前电平",
            title: "起始电平",
            body: "四路通道处于初始平衡，按当前电平高低排列。",
          },
          {
            action: "推高",
            title: "推高质量，速度下降",
            body: "把质量推到顶，速度随之回落——调音台永远是此消彼长。",
          },
        ],
      },
      {
        title: "调和混音",
        beats: [
          {
            action: "混音前",
            title: "失衡",
            body: "刚经历取舍，旋钮偏斜——一路过响，一路过弱。",
          },
          {
            action: "调平",
            title: "调和平衡",
            body: "逐一旋动旋钮，直到平衡表读数居中——四路兼顾的配比。",
          },
        ],
      },
      {
        title: "总输出",
        beats: [
          {
            action: "总线",
            title: "总输出",
            body: "输出表读数落在绿色健康区——调好的模型，均衡上线。",
          },
        ],
      },
    ],
  },
};

/* ── fonts ───────────────────────────────────────────────────────────────── */
function useFonts() {
  useEffect(() => {
    const id = "font-studio-mixing-console-v3";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Noto+Sans+SC:wght@400;700&display=swap";
    document.head.appendChild(link);
  }, []);
}

/* ── shared meter ──────────────────────────────────────────────────────────── */
function Meter({
  value,
  orient,
  segs,
}: {
  value: number;
  orient: "v" | "h";
  segs: number;
}) {
  const lit = Math.round((value / 100) * segs);
  return (
    <div className={styles.meter} data-orient={orient}>
      {Array.from({ length: segs }).map((_, i) => (
        <span
          key={i}
          className={styles.meterSeg}
          data-on={i < lit}
          style={{ ["--seg" as string]: segColor(i / (segs - 1)) } as React.CSSProperties}
        />
      ))}
    </div>
  );
}

function Fader({
  ch,
  value,
  active,
  lang,
}: {
  ch: Channel;
  value: number;
  active: boolean;
  lang: Lang;
}) {
  const col = bandColor(value);
  return (
    <div className={styles.fader} data-active={active}>
      <span className={styles.faderValue} style={{ color: col }}>
        {value.toFixed(0)}
      </span>
      <div className={styles.faderBody}>
        <div
          className={styles.faderTrack}
          style={{ ["--fill" as string]: value, ["--col" as string]: col } as CSSProperties}
        >
          <div className={styles.faderFill} />
          <div className={styles.faderCap} />
        </div>
        <Meter value={value} orient="v" segs={12} />
      </div>
      <div className={styles.faderMeta}>
        <span className={styles.faderName}>{chName(ch, lang)}</span>
        <span className={styles.faderTag}>{ch.tag}</span>
      </div>
    </div>
  );
}

/* ── scenes ─────────────────────────────────────────────────────────────────── */
function TitleScene({ lang }: { lang: Lang }) {
  const c = COPY[lang];
  const b = c.scenes[0].beats[0];
  return (
    <div className={`${styles.panel} ${styles.panelCenter}`}>
      <div className={styles.titleTop}>
        <span className={styles.powerLed} />
        <span className={styles.kicker}>{c.kicker}</span>
        <span className={styles.modelBadge}>Claude-Opus-4.8</span>
      </div>
      <h1 className={styles.title}>{b.title}</h1>
      <p className={styles.subtitle}>{b.body}</p>
      <div className={styles.zeroBank}>
        {CH.map((ch) => (
          <div key={ch.id} className={styles.zeroCell}>
            <Meter value={0} orient="v" segs={10} />
            <span className={styles.zeroLabel}>{chName(ch, lang)}</span>
            <span className={styles.zeroVal}>0.0</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ChannelsScene({ beat, lang }: { beat: number; lang: Lang }) {
  const c = COPY[lang];
  const i = Math.min(beat, 2);
  const fills = S2_FILL[i];
  const b = c.scenes[1].beats[i];
  return (
    <div className={styles.panel}>
      <div className={styles.sceneHead}>
        <span className={styles.sceneTag}>{b.action}</span>
        <span className={styles.sceneTitle}>{b.title}</span>
      </div>
      <div
        className={styles.faderBank}
        data-beat-layout-container="true"
        data-beat-layout-mode="reserved"
      >
        {CH.map((ch) => {
          const v = fills[ch.id];
          return (
            <div key={ch.id} className={styles.faderCell} data-beat-layout-item="true">
              <Fader ch={ch} value={v} active={v > 12} lang={lang} />
            </div>
          );
        })}
      </div>
      <div className={styles.readStrip}>{b.body}</div>
    </div>
  );
}

function TradeoffScene({
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
  const c = COPY[lang];
  const i = Math.min(beat, 1);
  const vals = S3_VALS[i];
  const b = c.scenes[2].beats[i];
  const ordered = [...CH].sort((a, z) => vals[z.id] - vals[a.id]);
  const { ref } = useFLIP<HTMLDivElement>({
    watch: [beat],
    disabled: reducedMotion || isThumbnail || !isActive,
    duration: 520,
    easing: "cubic-bezier(0.34, 1.56, 0.64, 1)",
    selector: '[data-beat-layout-item="true"]',
  });
  return (
    <div className={styles.panel}>
      <div className={styles.sceneHead}>
        <span className={styles.sceneTag}>{b.action}</span>
        <span className={styles.sceneTitle}>{b.title}</span>
      </div>
      <div
        ref={ref}
        className={styles.ledger}
        data-beat-layout-container="true"
        data-beat-layout-mode="motion"
      >
        {ordered.map((ch) => {
          const v = vals[ch.id];
          return (
            <div key={ch.id} className={styles.ledgerRow} data-beat-layout-item="true">
              <span className={styles.ledgerTag}>{ch.tag}</span>
              <span className={styles.ledgerName}>{chName(ch, lang)}</span>
              <div className={styles.ledgerMeter}>
                <Meter value={v} orient="h" segs={20} />
              </div>
              <span className={styles.ledgerVal} style={{ color: bandColor(v) }}>
                {v.toFixed(0)}
              </span>
            </div>
          );
        })}
      </div>
      <div className={styles.readStrip}>{b.body}</div>
    </div>
  );
}

function MixScene({ beat, lang }: { beat: number; lang: Lang }) {
  const c = COPY[lang];
  const i = Math.min(beat, 1);
  const vals = S4_VALS[i];
  const bal = S4_BAL[i];
  const b = c.scenes[3].beats[i];
  const balanced = i >= 1;
  return (
    <div className={styles.panel}>
      <div className={styles.sceneHead}>
        <span className={styles.sceneTag}>{b.action}</span>
        <span className={styles.sceneTitle}>{b.title}</span>
      </div>
      <div
        className={styles.knobBank}
        data-beat-layout-container="true"
        data-beat-layout-mode="reserved"
      >
        {CH.map((ch) => {
          const v = vals[ch.id];
          const rot = -135 + (v / 100) * 270;
          const col = bandColor(v);
          return (
            <div key={ch.id} className={styles.knobCell} data-beat-layout-item="true">
              <div className={styles.knob}>
                <div
                  className={styles.knobDial}
                  style={{ ["--rot" as string]: `${rot}deg` } as React.CSSProperties}
                >
                  <span
                    className={styles.knobTick}
                    style={{ ["--col" as string]: col } as React.CSSProperties}
                  />
                </div>
                <span className={styles.knobName}>{chName(ch, lang)}</span>
                <span className={styles.knobVal} style={{ color: col }}>
                  {v.toFixed(0)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
      <div className={styles.balanceRow}>
        <div className={styles.balanceMeter}>
          <Meter value={bal} orient="h" segs={24} />
        </div>
        <span
          className={styles.balanceState}
          style={{ color: balanced ? HEALTHY : ATTN }}
        >
          {S4_STATE[lang][i]}
        </span>
      </div>
      <div className={styles.readStrip}>{b.body}</div>
    </div>
  );
}

function MasterScene({ lang }: { lang: Lang }) {
  const c = COPY[lang];
  const b = c.scenes[4].beats[0];
  return (
    <div className={styles.panel}>
      <div className={styles.sceneHead}>
        <span className={styles.sceneTag}>{b.action}</span>
        <span className={styles.sceneTitle}>{b.title}</span>
      </div>
      <div className={styles.masterWrap}>
        <div className={styles.masterMeterBox}>
          <Meter value={76} orient="v" segs={16} />
          <Meter value={72} orient="v" segs={16} />
        </div>
        <div className={styles.masterReadout}>
          <span className={styles.masterDb} style={{ color: HEALTHY }}>
            -6 dB
          </span>
          <span className={styles.masterState}>{MASTER_STATE[lang]}</span>
        </div>
      </div>
      <div className={styles.miniBank}>
        {CH.map((ch) => {
          const v = S5_FINAL[ch.id];
          return (
            <div key={ch.id} className={styles.miniCell}>
              <span className={styles.miniName}>{chName(ch, lang)}</span>
              <div className={styles.miniMeter}>
                <Meter value={v} orient="h" segs={16} />
              </div>
              <span className={styles.miniVal} style={{ color: bandColor(v) }}>
                {v.toFixed(0)}
              </span>
            </div>
          );
        })}
      </div>
      <div className={styles.readStrip}>{b.body}</div>
    </div>
  );
}

/* ── bespoke nav: a channel selector (fader-cap markers, active fader raised) ── */
function ChannelNav({
  scene,
  lang,
  isThumbnail,
  onNavigate,
}: {
  scene: number;
  lang: Lang;
  isThumbnail: boolean;
  onNavigate?: (scene: number, beat: number) => void;
}) {
  if (isThumbnail) return null;
  return (
    <div className={styles.nav}>
      {NAV_LABELS[lang].map((label, i) => {
        const sc = i + 1;
        const active = sc === scene;
        return (
          <button
            key={sc}
            type="button"
            className={styles.navCap}
            data-active={active}
            aria-label={label}
            onClick={(e) => {
              e.stopPropagation();
              onNavigate?.(sc, 0);
            }}
          >
            <div className={styles.navFader}>
              <span className={styles.navCapKnob} data-active={active} />
            </div>
            <span className={styles.navLabel}>{label}</span>
          </button>
        );
      })}
    </div>
  );
}

/* ── root ────────────────────────────────────────────────────────────────────── */
function StudioMixingConsoleV3({
  scene,
  beat,
  language,
  isThumbnail,
  reducedMotion,
  onNavigate,
}: BespokeStyleProps) {
  useFonts();
  const reduced = reducedMotion || isThumbnail;
  return (
    <div className={styles.root} data-reduced={reduced}>
      <SpatialSceneTrack
        scene={scene}
        beat={beat}
        transitionKind="slide-y"
        transitionMap={TRANSITIONS}
        reducedMotion={reduced}
        beatLayoutModes={{ 2: "reserved", 3: "motion", 4: "reserved" }}
        renderScene={(sceneId, sceneBeat, isActive) => {
          switch (sceneId) {
            case 1:
              return <TitleScene lang={language} />;
            case 2:
              return <ChannelsScene beat={sceneBeat} lang={language} />;
            case 3:
              return (
                <TradeoffScene
                  beat={sceneBeat}
                  lang={language}
                  isActive={isActive}
                  reducedMotion={reducedMotion}
                  isThumbnail={isThumbnail}
                />
              );
            case 4:
              return <MixScene beat={sceneBeat} lang={language} />;
            case 5:
              return <MasterScene lang={language} />;
            default:
              return null;
          }
        }}
      />
      <ChannelNav
        scene={scene}
        lang={language}
        isThumbnail={isThumbnail}
        onNavigate={onNavigate}
      />
    </div>
  );
}

export function getMetadata(lang: Lang): StyleMetadata {
  const c = COPY[lang];
  return {
    id: "studio-mixing-console",
    band: "balanced-hybrid",
    name: lang === "en" ? "Studio Mixing Console" : "录音混音控制台",
    theme: c.theme,
    densityLabel: c.density,
    heroScene: 2,
    colors: { bg: "#0c0e11", ink: "#e8ece9", panel: "#171b20" },
    typography: { header: "Space Mono", body: "Space Mono" },
    tags:
      lang === "en"
        ? ["professional", "tactile", "precise", "studio-dark", "mechanical"]
        : ["专业", "硬件质感", "精确", "录音棚暗色", "机械"],
    fonts: ["Space Mono", "cjk:Noto Sans SC"],
    scenes: c.scenes.map((s, si) => ({
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

export const tuningTheModelTopic = defineStyleTopic({
  id: "tuning-the-model",
  topic: { en: "Tuning the Model", zh: "调模型" },
  model: "Claude-Opus-4.8",
  component: StudioMixingConsoleV3,
  getMetadata,
});

export default StudioMixingConsoleV3;

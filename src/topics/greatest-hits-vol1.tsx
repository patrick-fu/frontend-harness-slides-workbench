import type { ReactNode } from "react";
import {
  defineTopic,
  type TopicMetadata,
  type TopicStageProps,
  type TopicTransitionScore,
} from "../domain/topic";
import SpatialSceneTrack from "../components/stage/SpatialSceneTrack";
import type { SceneTransitionMap } from "../components/stage/SpatialSceneTrack";
import { useFLIP } from "../hooks/useFLIP";
import styles from "./greatest-hits-vol1.module.css";

type Lang = "en" | "zh";

/* ── palette (real hex; cream + warm brown ink + one rainbow ribbon) ── */
const BG = "#f0e4cc";
const INK = "#3f2f1c";
const PANEL = "#e7d7b7";
const CREAM = "#f6efdd";
const STAMP = "#bf3b2e";
const RIBBON = ["#d0473a", "#e0872f", "#e6c23c", "#4f9a5b", "#3f6ea6"];

/* ── font stacks (declared in metadata.fonts) ── */
const F_HERO = '"Anton", "Noto Sans SC", sans-serif';
const F_COND = '"Oswald", "Noto Sans SC", sans-serif';
const F_BODY = '"Work Sans", "Noto Sans SC", sans-serif';
const F_MONO = '"IBM Plex Mono", "Noto Sans SC", monospace';

/* ── bilingual content (NOT `as const`) ── */
interface Row {
  no: string;
  title: string;
  time: string;
  side: string;
}
interface Feature {
  label: string;
  val: string;
}
interface Content {
  brand: string;
  s1: {
    kicker: string;
    title1: string;
    title2: string;
    vol: string;
    sub: string;
    specs: string[];
  };
  s2: {
    heading: string;
    note: string;
    cols: { no: string; title: string; time: string; side: string };
    rows: Row[];
    beatNotes: string[];
  };
  s3: { heading: string; note: string; features: Feature[]; beatNotes: string[] };
  s4: { heading: string; note: string; tracks: string[]; beatNotes: string[] };
  s5: { stamp: string; title: string; line: string; foot: string };
  nav: { counterLabel: string; pagePrefix: string; pageSuffix: string };
}

const CONTENT: Record<Lang, Content> = {
  en: {
    brand: "STEREO · TYPE II",
    s1: {
      kicker: "COMPILATION SERIES / NO. 001",
      title1: "GREATEST",
      title2: "HITS",
      vol: "VOL. 1",
      sub: "A curated program, dubbed to high-bias tape and sleeved for keeping.",
      specs: ["C-60 · 30 MIN/SIDE", "DOLBY B NR", "MADE FOR REPEAT PLAY"],
    },
    s2: {
      heading: "PROGRAM / TRACKLIST",
      note: "SIDE A + SIDE B · 6 SELECTIONS",
      cols: { no: "NO.", title: "SELECTION", time: "TIME", side: "SIDE" },
      rows: [
        { no: "01", title: "Opening Theme", time: "3:12", side: "A" },
        { no: "02", title: "Signal Chain", time: "4:05", side: "A" },
        { no: "03", title: "Warm Bias", time: "2:58", side: "A" },
        { no: "04", title: "Flip Side", time: "3:41", side: "B" },
        { no: "05", title: "Rewind", time: "4:20", side: "B" },
        { no: "06", title: "End Leader", time: "2:15", side: "B" },
      ],
      beatNotes: ["CUEING SIDE A…", "SIDE A LOCKED", "FULL PROGRAM LOADED"],
    },
    s3: {
      heading: "CASSETTE SPECIFICATION",
      note: "FEATURE CHECKLIST · JIS STYLE",
      features: [
        { label: "High-bias Type II shell", val: "IEC II" },
        { label: "Hard offset print inlay", val: "OFFSET" },
        { label: "Dolby B noise reduction", val: "NR-B" },
        { label: "Anti-jam roller guides", val: "×2" },
        { label: "Archival cream J-card", val: "120GSM" },
      ],
      beatNotes: ["TICKING SPEC 01", "THREE VERIFIED", "ALL SPECS MARKED"],
    },
    s4: {
      heading: "LEVEL / EQUALIZER",
      note: "PEAK METER · PER SELECTION",
      tracks: ["01", "02", "03", "04", "05", "06"],
      beatNotes: ["PLAYBACK · 0 dB", "GAIN RISING", "PEAK HOLD"],
    },
    s5: {
      stamp: "SIDE B",
      title: "PLAY IT AGAIN",
      line: "Rewind, press play, and let the program run one more time.",
      foot: "GREATEST HITS · VOL. 1 · END OF INLAY",
    },
    nav: { counterLabel: "TAPE COUNTER", pagePrefix: "P.", pageSuffix: "/ 05" },
  },
  zh: {
    brand: "立体声 · II 型",
    s1: {
      kicker: "精选系列 / 第 001 号",
      title1: "精选",
      title2: "金曲",
      vol: "第一辑",
      sub: "精心编排的曲目，转录至高偏磁带，装入卡套长久收藏。",
      specs: ["C-60 · 每面 30 分钟", "杜比 B 降噪", "为反复播放而制"],
    },
    s2: {
      heading: "节目 / 曲目单",
      note: "A 面 + B 面 · 共 6 首",
      cols: { no: "序号", title: "曲目", time: "时长", side: "面" },
      rows: [
        { no: "01", title: "开场主题", time: "3:12", side: "A" },
        { no: "02", title: "信号链路", time: "4:05", side: "A" },
        { no: "03", title: "暖磁偏压", time: "2:58", side: "A" },
        { no: "04", title: "翻面时刻", time: "3:41", side: "B" },
        { no: "05", title: "倒带回放", time: "4:20", side: "B" },
        { no: "06", title: "末端引带", time: "2:15", side: "B" },
      ],
      beatNotes: ["正在预备 A 面…", "A 面已锁定", "整段节目就绪"],
    },
    s3: {
      heading: "卡带规格",
      note: "功能清单 · JIS 制式",
      features: [
        { label: "高偏磁 II 型外壳", val: "IEC II" },
        { label: "硬质胶印卡纸", val: "胶印" },
        { label: "杜比 B 降噪", val: "NR-B" },
        { label: "防卡带导轮", val: "×2" },
        { label: "存档级米色卡套", val: "120 克" },
      ],
      beatNotes: ["勾选规格 01", "已核验三项", "全部规格标记完毕"],
    },
    s4: {
      heading: "电平 / 均衡器",
      note: "峰值表 · 逐曲显示",
      tracks: ["01", "02", "03", "04", "05", "06"],
      beatNotes: ["播放 · 0 dB", "增益上升", "峰值保持"],
    },
    s5: {
      stamp: "B 面",
      title: "再听一遍",
      line: "倒带，按下播放，让整段节目再走一次。",
      foot: "精选金曲 · 第一辑 · 卡套终",
    },
    nav: { counterLabel: "计数器", pagePrefix: "第", pageSuffix: "/ 05 页" },
  },
};

/* per-beat equalizer levels (0..1) for 6 tracks */
const EQ_LEVELS = [
  [0.4, 0.72, 0.3, 0.55, 0.62, 0.35],
  [0.85, 0.5, 0.66, 0.42, 0.78, 0.6],
  [0.6, 0.95, 0.52, 0.82, 0.46, 0.92],
];

/* ── bespoke nav prototype: a 4-digit mechanical tape counter + page no. ── */
function TapeCounter({
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
  const c = CONTENT[lang].nav;
  const count = String((scene - 1) * 148).padStart(4, "0").split("");
  const jump = (target: number) => (e: React.MouseEvent) => {
    e.stopPropagation();
    onNavigate?.(target, 0);
  };
  return (
    <>
      <div
        data-topic-navigation="true"
        data-navigation-geometry="typographic-index"
        data-navigation-carrier="cassette-tape-counter"
        data-navigation-invocation="click-expand"
        data-navigation-feedback="material-color-change"
        style={{
          position: "absolute",
          top: "5cqh",
          left: "5cqw",
          zIndex: 7,
          display: "flex",
          flexDirection: "column",
          gap: "0.9cqh",
        }}
      >
        <span
          style={{
            font: `600 1.1cqh/1 ${F_MONO}`,
            letterSpacing: "0.25cqw",
            color: INK,
            opacity: 0.7,
          }}
        >
          {c.counterLabel}
        </span>
        <button
          className={styles.navBtn}
          onClick={jump(scene < 5 ? scene + 1 : 1)}
          style={{ display: "flex", gap: "0.4cqw", alignItems: "center" }}
          aria-label="advance tape counter"
        >
          {count.map((d, i) => (
            <span
              key={i}
              style={{
                width: "2.6cqw",
                height: "4cqh",
                display: "grid",
                placeItems: "center",
                background: INK,
                color: CREAM,
                font: `2.6cqh/1 ${F_HERO}`,
                borderTop: `0.16cqw solid ${INK}`,
                boxShadow: `inset 0 -0.5cqh 0 rgba(0,0,0,0.28), inset 0 0.4cqh 0 rgba(255,255,255,0.1)`,
              }}
            >
              {d}
            </span>
          ))}
        </button>
        <div style={{ display: "flex", gap: "0.5cqw", marginTop: "0.3cqh" }}>
          {[1, 2, 3, 4, 5].map((s) => (
            <button
              key={s}
              className={styles.navBtn}
              onClick={jump(s)}
              aria-label={`scene ${s}`}
              style={{
                width: "1.7cqw",
                height: s === scene ? "1.6cqh" : "1cqh",
                background: s === scene ? RIBBON[(s - 1) % 5] : "transparent",
                border: `0.14cqw solid ${INK}`,
                alignSelf: "flex-end",
              }}
            />
          ))}
        </div>
      </div>
      <button
        className={styles.navBtn}
        onClick={jump(scene < 5 ? scene + 1 : 1)}
        style={{
          position: "absolute",
          bottom: "5cqh",
          right: "5cqw",
          zIndex: 7,
          font: `600 1.5cqh/1 ${F_MONO}`,
          letterSpacing: "0.15cqw",
          color: INK,
        }}
        aria-label="page number"
      >
        {`${c.pagePrefix} 0${scene} ${c.pageSuffix}`}
      </button>
    </>
  );
}

/* diagonal five-bar rainbow ribbon (the sole chroma — used sparingly) */
function Ribbon({ small }: { small?: boolean }) {
  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        left: "-20cqw",
        right: "-20cqw",
        top: small ? "8cqh" : "34cqh",
        transform: `rotate(-17deg)`,
        display: "flex",
        flexDirection: "column",
        filter: `drop-shadow(0.5cqw 0.7cqh 0 rgba(63,47,28,0.28))`,
        zIndex: 0,
      }}
    >
      {RIBBON.map((c, i) => (
        <div key={i} style={{ height: small ? "1.7cqh" : "3.3cqh", background: c }} />
      ))}
    </div>
  );
}

/* ── scenes ── */
function SceneFrame({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        padding: "8cqh 8cqw 7cqh",
        boxSizing: "border-box",
        color: INK,
      }}
    >
      {children}
    </div>
  );
}

function SectionHead({ heading, note }: { heading: string; note: string }) {
  return (
    <div style={{ marginBottom: "3.2cqh" }}>
      <div style={{ display: "flex", alignItems: "flex-end", gap: "1cqw" }}>
        <span
          style={{
            font: `5cqh/0.9 ${F_COND}`,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "-0.12cqw",
          }}
        >
          {heading}
        </span>
      </div>
      <div
        style={{
          marginTop: "1cqh",
          height: "0.24cqw",
          background: INK,
          width: "100%",
        }}
      />
      <span
        style={{
          display: "block",
          marginTop: "1cqh",
          font: `1.5cqh/1 ${F_MONO}`,
          letterSpacing: "0.12cqw",
          opacity: 0.75,
        }}
      >
        {note}
      </span>
    </div>
  );
}

function Scene1({ lang }: { lang: Lang }) {
  const c = CONTENT[lang].s1;
  return (
    <SceneFrame>
      <Ribbon />
      <div
        style={{
          position: "relative",
          zIndex: 2,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <span
          style={{
            font: `1.6cqh/1 ${F_MONO}`,
            letterSpacing: "0.3cqw",
            background: BG,
            padding: "0.6cqh 0.8cqw",
            border: `0.16cqw solid ${INK}`,
            alignSelf: "flex-start",
          }}
        >
          {c.kicker}
        </span>
        <div style={{ display: "flex", alignItems: "flex-end", gap: "2cqw" }}>
          <h1
            style={{
              margin: 0,
              font: `20cqh/0.82 ${F_HERO}`,
              letterSpacing: "-0.4cqw",
              textTransform: "uppercase",
              background: BG,
              boxShadow: `0.9cqw 1.1cqh 0 ${INK}`,
              padding: "0.5cqh 1.2cqw",
            }}
          >
            {c.title1}
            <br />
            {c.title2}
          </h1>
          <span
            style={{
              font: `3.4cqh/0.9 ${F_COND}`,
              fontWeight: 700,
              color: CREAM,
              background: STAMP,
              padding: "1cqh 1.2cqw",
              transform: "rotate(-4deg)",
              boxShadow: `0.5cqw 0.6cqh 0 ${INK}`,
              letterSpacing: "0.1cqw",
              marginBottom: "3cqh",
            }}
          >
            {c.vol}
          </span>
        </div>
        <div>
          <p
            style={{
              margin: "0 0 2cqh",
              font: `2.3cqh/1.35 ${F_BODY}`,
              maxWidth: "60cqw",
              background: BG,
            }}
          >
            {c.sub}
          </p>
          <div style={{ display: "flex", gap: "1cqw", flexWrap: "wrap" }}>
            {c.specs.map((s, i) => (
              <span
                key={i}
                style={{
                  font: `1.4cqh/1 ${F_MONO}`,
                  letterSpacing: "0.1cqw",
                  border: `0.14cqw solid ${INK}`,
                  padding: "0.7cqh 0.9cqw",
                  background: PANEL,
                }}
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>
    </SceneFrame>
  );
}

function Scene2({ lang, beat }: { lang: Lang; beat: number }) {
  const c = CONTENT[lang].s2;
  const activeCount = beat === 0 ? 2 : beat === 1 ? 4 : 6;
  return (
    <SceneFrame>
      <SectionHead heading={c.heading} note={c.note} />
      <div
        data-beat-layout-container="true"
        data-beat-layout-mode="reserved"
        style={{ position: "relative" }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "8cqw 1fr 10cqw 8cqw",
            font: `1.5cqh/1 ${F_MONO}`,
            letterSpacing: "0.12cqw",
            padding: "1.1cqh 1cqw",
            background: INK,
            color: CREAM,
          }}
        >
          <span>{c.cols.no}</span>
          <span>{c.cols.title}</span>
          <span style={{ textAlign: "right" }}>{c.cols.time}</span>
          <span style={{ textAlign: "right" }}>{c.cols.side}</span>
        </div>
        {c.rows.map((r, i) => {
          const on = i < activeCount;
          return (
            <div
              key={r.no}
              data-beat-layout-item="true"
              className={styles.reveal}
              style={{
                display: "grid",
                gridTemplateColumns: "8cqw 1fr 10cqw 8cqw",
                alignItems: "center",
                padding: "1.35cqh 1cqw",
                borderBottom: `0.14cqw solid ${INK}`,
                borderLeft: `0.5cqw solid ${on ? RIBBON[i % 5] : "transparent"}`,
                background: on ? CREAM : "transparent",
                opacity: on ? 1 : 0.36,
              }}
            >
              <span style={{ font: `700 2cqh/1 ${F_COND}` }}>{r.no}</span>
              <span style={{ font: `2.2cqh/1.1 ${F_BODY}` }}>{r.title}</span>
              <span style={{ font: `1.7cqh/1 ${F_MONO}`, textAlign: "right" }}>
                {r.time}
              </span>
              <span
                style={{
                  font: `700 1.7cqh/1 ${F_COND}`,
                  textAlign: "right",
                }}
              >
                {r.side}
              </span>
            </div>
          );
        })}
      </div>
      <span
        style={{
          display: "block",
          marginTop: "2.2cqh",
          font: `1.5cqh/1 ${F_MONO}`,
          letterSpacing: "0.15cqw",
        }}
      >
        &gt; {c.beatNotes[beat]}
      </span>
    </SceneFrame>
  );
}

function Scene3({ lang, beat }: { lang: Lang; beat: number }) {
  const c = CONTENT[lang].s3;
  const checked = beat === 0 ? 1 : beat === 1 ? 3 : 5;
  return (
    <SceneFrame>
      <SectionHead heading={c.heading} note={c.note} />
      <div
        data-beat-layout-container="true"
        data-beat-layout-mode="reserved"
        style={{ display: "flex", flexDirection: "column", gap: "1.6cqh" }}
      >
        {c.features.map((f, i) => {
          const on = i < checked;
          return (
            <div
              key={f.label}
              data-beat-layout-item="true"
              className={styles.reveal}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1.4cqw",
                padding: "1.4cqh 1.4cqw",
                border: `0.16cqw solid ${INK}`,
                background: on ? CREAM : PANEL,
                opacity: on ? 1 : 0.5,
              }}
            >
              <span
                style={{
                  width: "4cqh",
                  height: "4cqh",
                  flex: "0 0 auto",
                  display: "grid",
                  placeItems: "center",
                  border: `0.2cqw solid ${INK}`,
                  background: on ? INK : "transparent",
                  color: CREAM,
                  font: `3cqh/1 ${F_HERO}`,
                }}
              >
                {on ? "\u00d7" : ""}
              </span>
              <span style={{ font: `2.4cqh/1.1 ${F_BODY}`, flex: 1 }}>
                {f.label}
              </span>
              <span
                style={{
                  font: `1.7cqh/1 ${F_MONO}`,
                  letterSpacing: "0.1cqw",
                  padding: "0.5cqh 0.8cqw",
                  border: `0.14cqw solid ${INK}`,
                }}
              >
                {f.val}
              </span>
            </div>
          );
        })}
      </div>
      <span
        style={{
          display: "block",
          marginTop: "2.4cqh",
          font: `1.5cqh/1 ${F_MONO}`,
          letterSpacing: "0.15cqw",
        }}
      >
        &gt; {c.beatNotes[beat]}
      </span>
    </SceneFrame>
  );
}

function Scene4({
  lang,
  beat,
  isActive,
  motionOff,
}: {
  lang: Lang;
  beat: number;
  isActive: boolean;
  motionOff: boolean;
}) {
  const c = CONTENT[lang].s4;
  const levels = EQ_LEVELS[Math.min(beat, 2)];
  const order = levels
    .map((v, i) => ({ v, i }))
    .sort((a, b) => b.v - a.v)
    .map((o) => o.i);
  const { ref } = useFLIP<HTMLDivElement>({
    watch: [beat],
    disabled: motionOff || !isActive,
    duration: 420,
    easing: "cubic-bezier(0.2, 0.9, 0.2, 1)",
    selector: '[data-beat-layout-item="true"]',
  });
  return (
    <SceneFrame>
      <SectionHead heading={c.heading} note={c.note} />
      <div
        ref={ref}
        data-beat-layout-container="true"
        data-beat-layout-mode="motion"
        style={{
          display: "flex",
          gap: "2cqw",
          alignItems: "flex-end",
          height: "44cqh",
          padding: "0 1cqw",
          borderBottom: `0.2cqw solid ${INK}`,
        }}
      >
        {order.map((idx) => {
          const level = levels[idx];
          return (
            <div
              key={c.tracks[idx]}
              data-beat-layout-item="true"
              style={{
                flex: 1,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
                alignItems: "center",
              }}
            >
              <span style={{ font: `700 1.7cqh/1 ${F_COND}`, marginBottom: "0.8cqh" }}>
                {Math.round(level * 100)}
              </span>
              <div
                className={styles.barFill}
                style={{
                  width: "100%",
                  height: `calc(${level * 100}% )`,
                  background: RIBBON[idx % 5],
                  border: `0.16cqw solid ${INK}`,
                  boxShadow: `0.35cqw 0 0 rgba(63,47,28,0.25)`,
                }}
              />
              <span
                style={{
                  marginTop: "1cqh",
                  font: `1.5cqh/1 ${F_MONO}`,
                  letterSpacing: "0.1cqw",
                }}
              >
                {c.tracks[idx]}
              </span>
            </div>
          );
        })}
      </div>
      <span
        style={{
          display: "block",
          marginTop: "2.4cqh",
          font: `1.5cqh/1 ${F_MONO}`,
          letterSpacing: "0.15cqw",
        }}
      >
        &gt; {c.beatNotes[beat]}
      </span>
    </SceneFrame>
  );
}

function Scene5({ lang }: { lang: Lang }) {
  const c = CONTENT[lang].s5;
  return (
    <SceneFrame>
      <Ribbon small />
      <div
        style={{
          position: "relative",
          zIndex: 2,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          gap: "3cqh",
        }}
      >
        <span
          style={{
            font: `7cqh/0.9 ${F_HERO}`,
            letterSpacing: "0.3cqw",
            color: CREAM,
            background: STAMP,
            padding: "1.6cqh 3cqw",
            transform: "rotate(-3deg)",
            border: `0.3cqw solid ${INK}`,
            boxShadow: `0.9cqw 1.1cqh 0 ${INK}`,
          }}
        >
          {c.stamp}
        </span>
        <h2
          style={{
            margin: 0,
            font: `700 6cqh/0.95 ${F_COND}`,
            textTransform: "uppercase",
            letterSpacing: "-0.1cqw",
            background: BG,
          }}
        >
          {c.title}
        </h2>
        <p style={{ margin: 0, font: `2.4cqh/1.4 ${F_BODY}`, maxWidth: "58cqw" }}>
          {c.line}
        </p>
        <span
          style={{
            font: `1.5cqh/1 ${F_MONO}`,
            letterSpacing: "0.2cqw",
            opacity: 0.75,
          }}
        >
          {c.foot}
        </span>
      </div>
    </SceneFrame>
  );
}

/* ── transitions ── */
const TRANSITION_SCORE = {
  "1->2": "hard-cut",
  "2->3": "slide-y",
  "3->4": "slide-y",
  "4->5": "hard-cut",
} as const satisfies TopicTransitionScore;

const TRANSITION_MAP: SceneTransitionMap = TRANSITION_SCORE;

function TopicStage(props: TopicStageProps) {
  const { scene, beat, language, isThumbnail, reducedMotion, onNavigate } = props;
  const motionOff = reducedMotion || isThumbnail;
  const lang: Lang = language === "zh" ? "zh" : "en";

  return (
    <div
      className={`${styles.root}${motionOff ? " " + styles.static : ""}`}
      style={{ background: BG, fontFamily: F_BODY }}
    >
      <div className={styles.grain} />
      <div className={styles.frame} />
      <span
        style={{
          position: "absolute",
          top: "5cqh",
          right: "5cqw",
          zIndex: 7,
          font: `1.2cqh/1 ${F_MONO}`,
          letterSpacing: "0.2cqw",
          color: INK,
          opacity: 0.7,
        }}
      >
        {CONTENT[lang].brand}
      </span>

      <SpatialSceneTrack
        scene={scene}
        beat={beat}
        transitionKind="hard-cut"
        transitionMap={TRANSITION_MAP}
        reducedMotion={motionOff}
        beatLayoutModes={{ 2: "reserved", 3: "reserved", 4: "motion" }}
        renderScene={(sceneId, sceneBeat, isActive) => {
          if (sceneId === 1) return <Scene1 lang={lang} />;
          if (sceneId === 2) return <Scene2 lang={lang} beat={sceneBeat} />;
          if (sceneId === 3) return <Scene3 lang={lang} beat={sceneBeat} />;
          if (sceneId === 4)
            return (
              <Scene4
                lang={lang}
                beat={sceneBeat}
                isActive={isActive}
                motionOff={motionOff}
              />
            );
          return <Scene5 lang={lang} />;
        }}
      />

      <TapeCounter
        scene={scene}
        lang={lang}
        isThumbnail={isThumbnail}
        onNavigate={onNavigate}
      />
    </div>
  );
}

/* ── metadata (en + zh structurally identical) ── */
function buildMetadata(lang: Lang): TopicMetadata {
  const en = lang === "en";
  return {
    theme: en ? "Greatest Hits, Vol. 1" : "精选辑一",
    densityLabel: en ? "Medium-high catalogue" : "中高目录密度",
    heroScene: 1,
    colors: { bg: BG, ink: INK, panel: PANEL },
    typography: {
      header: en ? "Anton / Oswald condensed" : "Anton / Oswald 压缩体",
      body: en ? "Work Sans + IBM Plex Mono" : "Work Sans + IBM Plex Mono",
    },
    tags: en
      ? ["nostalgic", "precise", "catalogue-dense", "cream-and-ink", "mechanical"]
      : ["怀旧", "精确", "目录高密度", "米色与棕墨", "机械感"],
    fonts: [
      "Anton:wght@400",
      "Oswald:wght@500;600;700",
      "Work Sans:wght@400;500;600",
      "IBM Plex Mono:wght@400;500;600",
      "cjk:Noto Sans SC:wght@500;700;900",
    ],
    scenes: [
      {
        id: 1,
        title: en ? "The J-card" : "J 卡封面",
        beats: [
          {
            id: 0,
            action: en ? "Present the cover" : "呈现封面",
            title: en ? "The J-card" : "J 卡封面",
            body: en
              ? "Cream stock with a diagonal rainbow ribbon behind the title."
              : "米色卡纸，标题背后是一道斜向彩虹缎带。",
          },
        ],
      },
      {
        id: 2,
        title: en ? "The tracklist" : "曲目单",
        beats: [
          {
            id: 0,
            action: en ? "Cue side A" : "预备 A 面",
            title: en ? "Load program" : "载入节目",
            body: en
              ? "A tabular spec-sheet of hits in monospaced type."
              : "以等宽字体排布的曲目规格表。",
          },
          {
            id: 1,
            action: en ? "Lock side A" : "锁定 A 面",
            title: en ? "Side A" : "A 面",
            body: en
              ? "The first selections lock into fixed rows."
              : "前几首曲目锁入固定行位。",
          },
          {
            id: 2,
            action: en ? "Load full" : "载入全部",
            title: en ? "Both sides" : "两面齐备",
            body: en
              ? "The whole program fills the tracklist."
              : "整段节目填满曲目单。",
          },
        ],
      },
      {
        id: 3,
        title: en ? "The specs" : "规格清单",
        beats: [
          {
            id: 0,
            action: en ? "Tick first" : "勾选首项",
            title: en ? "Checklist" : "功能清单",
            body: en
              ? "Square checkboxes marked with an x-mark, never a check."
              : "方形复选框以叉号标记，绝不用对勾。",
          },
          {
            id: 1,
            action: en ? "Verify three" : "核验三项",
            title: en ? "Verified" : "已核验",
            body: en
              ? "More features tick through in fixed slots."
              : "更多功能在固定槽位中被勾选。",
          },
          {
            id: 2,
            action: en ? "Mark all" : "全部标记",
            title: en ? "Complete" : "标记完成",
            body: en ? "Every spec carries its x-mark." : "每项规格都打上叉号。",
          },
        ],
      },
      {
        id: 4,
        title: en ? "The equalizer" : "均衡器",
        beats: [
          {
            id: 0,
            action: en ? "Start playback" : "开始播放",
            title: en ? "Levels" : "电平",
            body: en
              ? "Colored EQ bars rise per selection."
              : "彩色均衡条随每首曲目升起。",
          },
          {
            id: 1,
            action: en ? "Raise gain" : "提升增益",
            title: en ? "Rising" : "上升",
            body: en
              ? "Bars reflow and re-sort by peak level."
              : "条形按峰值重新排序并流动。",
          },
          {
            id: 2,
            action: en ? "Hold peak" : "峰值保持",
            title: en ? "Peak" : "峰值",
            body: en
              ? "The loudest tracks hold at the top."
              : "最响的曲目稳居顶部。",
          },
        ],
      },
      {
        id: 5,
        title: en ? "Side B" : "B 面",
        beats: [
          {
            id: 0,
            action: en ? "Stamp the close" : "盖章收尾",
            title: en ? "Flip to side B" : "翻到 B 面",
            body: en
              ? "A red status stamp closes the inlay."
              : "一枚红色状态印章为卡套收尾。",
          },
        ],
      },
    ],
  };
}

const metadata = {
  en: buildMetadata("en"),
  zh: buildMetadata("zh"),
};

export default defineTopic({
  id: "greatest-hits-vol1",
  styleId: "cassette-era-packaging",
  title: { en: "Greatest Hits, Vol. 1", zh: "精选辑一" },
  modelId: "Claude Opus 4.8",
  Stage: TopicStage,
  metadata,
  navigation: {
    geometry: "typographic-index",
    carrier: "cassette-tape-counter",
    invocation: "click-expand",
    feedback: "material-color-change",
  },
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

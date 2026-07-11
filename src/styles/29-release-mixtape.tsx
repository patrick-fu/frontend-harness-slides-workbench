import { useEffect } from "react";
import type { CSSProperties } from "react";
import type { BespokeStyleProps, StyleMetadata } from "../types";
import SpatialSceneTrack, {
  type BeatLayoutMode,
  type SceneTransitionMap,
} from "./SpatialSceneTrack";
import { defineStyleTopic } from "./topic";
import styles from "./29-release-mixtape.module.css";

type Lang = "en" | "zh";
type SceneId = 1 | 2 | 3 | 4 | 5;

interface SceneCopy {
  label: string;
  title: string;
  kicker: string;
  body: string;
}

interface TrackLine {
  no: string;
  title: string;
  time: string;
  beat: number;
}

interface SpecLine {
  label: string;
  value: string;
  beat: number;
}

const SCENE_IDS: SceneId[] = [1, 2, 3, 4, 5];
const BEAT_COUNTS: Record<SceneId, number> = {
  1: 3,
  2: 3,
  3: 3,
  4: 3,
  5: 2,
};

const BEAT_LAYOUT_MODES: Record<number, BeatLayoutMode> = {
  1: "reserved",
  2: "reserved",
  3: "reserved",
  4: "reserved",
  5: "reserved",
};

const TRANSITION_MAP: SceneTransitionMap = {
  "1->2": "slide-x",
  "2->3": "glitch",
  "3->4": "slide-y",
  "4->5": "hard-cut",
};

const SCENES: Record<SceneId, Record<Lang, SceneCopy>> = {
  1: {
    en: {
      label: "J-CARD",
      title: "The Release Mixtape",
      kicker: "C-90 launch master",
      body: "A folded promise: five cues, one object, no loose tape.",
    },
    zh: {
      label: "J 卡封面",
      title: "发行混音带",
      kicker: "C-90 发布母带",
      body: "折页先定调：五个提示，一个实物，没有松散磁带。",
    },
  },
  2: {
    en: {
      label: "SIDE A",
      title: "First play is the offer",
      kicker: "Program side / public mix",
      body: "Side A names what ships, why it matters, and when the listener should lean in.",
    },
    zh: {
      label: "A 面",
      title: "首放就是提案",
      kicker: "公开节目 / 发布混音",
      body: "A 面写清交付物、价值和听众该靠近的时刻。",
    },
  },
  3: {
    en: {
      label: "SIDE B",
      title: "B-side carries the proof",
      kicker: "Deep cuts / evidence mix",
      body: "The second side keeps the pivots, signal notes, and exact bias settings.",
    },
    zh: {
      label: "B 面",
      title: "B 面承载证据",
      kicker: "隐藏曲目 / 证据混音",
      body: "第二面保存转向、信号记录和精确偏磁设置。",
    },
  },
  4: {
    en: {
      label: "LEVELS",
      title: "Set the meters before release",
      kicker: "Output check / mono table",
      body: "A launch is ready when the useful signal stays above the noise floor.",
    },
    zh: {
      label: "电平",
      title: "发布前先校电平",
      kicker: "输出检查 / 单声道表",
      body: "有效信号稳定高于噪声底，才算准备好发布。",
    },
  },
  5: {
    en: {
      label: "REWIND",
      title: "End of tape, start again",
      kicker: "Counter reset / final hold",
      body: "The package closes with a rewind point: learn it, label it, replay it.",
    },
    zh: {
      label: "倒带",
      title: "磁带到底，重新开始",
      kicker: "计数归零 / 最终停留",
      body: "包装以倒带点收束：学到、贴标、重放。",
    },
  },
};

const SIDE_A_TRACKS: Record<Lang, TrackLine[]> = {
  en: [
    { no: "01", title: "OPEN THE CASE", time: "1:18", beat: 0 },
    { no: "02", title: "NAME THE OFFER", time: "2:45", beat: 0 },
    { no: "03", title: "BUILD THE HOOK", time: "3:21", beat: 1 },
    { no: "04", title: "PRESS RELEASE", time: "2:58", beat: 1 },
    { no: "05", title: "MOMENTUM TAKE", time: "3:07", beat: 2 },
    { no: "06", title: "NIGHT DRIVE", time: "4:12", beat: 2 },
  ],
  zh: [
    { no: "01", title: "打开外盒", time: "1:18", beat: 0 },
    { no: "02", title: "命名提案", time: "2:45", beat: 0 },
    { no: "03", title: "建立钩子", time: "3:21", beat: 1 },
    { no: "04", title: "按下发布", time: "2:58", beat: 1 },
    { no: "05", title: "动量采样", time: "3:07", beat: 2 },
    { no: "06", title: "夜驶版本", time: "4:12", beat: 2 },
  ],
};

const SIDE_B_TRACKS: Record<Lang, TrackLine[]> = {
  en: [
    { no: "01", title: "PIVOT TAKE", time: "2:46", beat: 0 },
    { no: "02", title: "SIGNAL ONLY", time: "3:10", beat: 0 },
    { no: "03", title: "FOCUS PATCH", time: "3:02", beat: 1 },
    { no: "04", title: "BREAKTHROUGH", time: "3:48", beat: 1 },
    { no: "05", title: "AFTERGLOW", time: "2:59", beat: 2 },
    { no: "06", title: "OUTRO NOTE", time: "2:03", beat: 2 },
  ],
  zh: [
    { no: "01", title: "转向采样", time: "2:46", beat: 0 },
    { no: "02", title: "只留信号", time: "3:10", beat: 0 },
    { no: "03", title: "聚焦补丁", time: "3:02", beat: 1 },
    { no: "04", title: "突破段落", time: "3:48", beat: 1 },
    { no: "05", title: "余温记录", time: "2:59", beat: 2 },
    { no: "06", title: "尾声注释", time: "2:03", beat: 2 },
  ],
};

const SIDE_B_SPECS: Record<Lang, SpecLine[]> = {
  en: [
    { label: "TAPE", value: "TYPE I NORMAL", beat: 0 },
    { label: "BIAS", value: "120us EQ", beat: 1 },
    { label: "NOISE RED.", value: "OFF", beat: 1 },
    { label: "DOLBY", value: "NR", beat: 2 },
  ],
  zh: [
    { label: "磁带", value: "I 型普通", beat: 0 },
    { label: "偏磁", value: "120us EQ", beat: 1 },
    { label: "降噪", value: "关闭", beat: 1 },
    { label: "杜比", value: "NR", beat: 2 },
  ],
};

const LEVEL_SPECS: Record<Lang, SpecLine[]> = {
  en: [
    { label: "SYSTEM", value: "MONO RELEASE", beat: 0 },
    { label: "FREQ. RESPONSE", value: "20Hz-18kHz", beat: 0 },
    { label: "DYNAMIC RANGE", value: ">= 60dB", beat: 1 },
    { label: "T.H.D.", value: "< 1.0%", beat: 1 },
    { label: "S/N RATIO", value: ">= 55dB", beat: 2 },
  ],
  zh: [
    { label: "系统", value: "单声道发布", beat: 0 },
    { label: "频响", value: "20Hz-18kHz", beat: 0 },
    { label: "动态范围", value: ">= 60dB", beat: 1 },
    { label: "总谐波失真", value: "< 1.0%", beat: 1 },
    { label: "信噪比", value: ">= 55dB", beat: 2 },
  ],
};

const LEVEL_BARS = [11, 7, 12, 8, 6, 10, 5];

const METADATA_SCENES: Record<Lang, StyleMetadata["scenes"]> = {
  en: [
    {
      id: 1,
      title: "J-card",
      beats: [
        {
          id: 0,
          action: "Show the folded cassette J-card cover.",
          title: "The Release Mixtape",
          body: "Cover promise and product frame appear.",
        },
        {
          id: 1,
          action: "Reveal the sparse diagonal ribbon.",
          title: "Rainbow cue enters",
          body: "A single color event marks the release object.",
        },
        {
          id: 2,
          action: "Stamp the master details.",
          title: "C-90 certified",
          body: "The cover locks into catalogue-spec language.",
        },
      ],
    },
    {
      id: 2,
      title: "Side A",
      beats: [
        {
          id: 0,
          action: "List the opening tracks.",
          title: "Public mix",
          body: "The first two tracks name the release.",
        },
        {
          id: 1,
          action: "Add build and release tracks.",
          title: "Hook and launch",
          body: "Middle tracks explain the offer.",
        },
        {
          id: 2,
          action: "Complete the side and total time.",
          title: "Side A locked",
          body: "The first side becomes a complete program.",
        },
      ],
    },
    {
      id: 3,
      title: "Side B",
      beats: [
        {
          id: 0,
          action: "Show the proof side.",
          title: "Evidence mix",
          body: "B-side tracks hold proof and pivot notes.",
        },
        {
          id: 1,
          action: "Introduce dropout marks.",
          title: "Tape glitch",
          body: "Brief degradation exposes the hidden proof.",
        },
        {
          id: 2,
          action: "Fill in cassette specifications.",
          title: "Bias settings",
          body: "The side closes with exact technical settings.",
        },
      ],
    },
    {
      id: 4,
      title: "Levels",
      beats: [
        {
          id: 0,
          action: "Render the meter columns.",
          title: "Signal appears",
          body: "The launch is treated as an audio output check.",
        },
        {
          id: 1,
          action: "Add calibration rows.",
          title: "Noise floor",
          body: "Useful signal is separated from noise.",
        },
        {
          id: 2,
          action: "Confirm release range.",
          title: "Ready level",
          body: "The final meter state is publishable.",
        },
      ],
    },
    {
      id: 5,
      title: "Rewind",
      beats: [
        {
          id: 0,
          action: "Reset the counter.",
          title: "End of tape",
          body: "The package reaches its stop point.",
        },
        {
          id: 1,
          action: "Reveal the replay instruction.",
          title: "Start again",
          body: "The release becomes a loop for learning.",
        },
      ],
    },
  ],
  zh: [
    {
      id: 1,
      title: "J 卡封面",
      beats: [
        {
          id: 0,
          action: "展示折页式卡带封面。",
          title: "发行混音带",
          body: "先出现封面承诺和产品框架。",
        },
        {
          id: 1,
          action: "露出克制的斜向彩带。",
          title: "彩虹提示入场",
          body: "唯一彩色事件标记发布物。",
        },
        {
          id: 2,
          action: "盖上母带规格信息。",
          title: "C-90 认证",
          body: "封面进入目录式规格语言。",
        },
      ],
    },
    {
      id: 2,
      title: "A 面",
      beats: [
        {
          id: 0,
          action: "列出开场曲目。",
          title: "公开混音",
          body: "前两轨命名这次发布。",
        },
        {
          id: 1,
          action: "加入构建和发布曲目。",
          title: "钩子与发布",
          body: "中段曲目解释提案价值。",
        },
        {
          id: 2,
          action: "补齐整面和总时长。",
          title: "A 面锁定",
          body: "第一面成为完整节目。",
        },
      ],
    },
    {
      id: 3,
      title: "B 面",
      beats: [
        {
          id: 0,
          action: "展示证据侧。",
          title: "证据混音",
          body: "B 面保存证明和转向记录。",
        },
        {
          id: 1,
          action: "引入掉磁划痕。",
          title: "磁带故障",
          body: "短暂劣化露出隐藏证据。",
        },
        {
          id: 2,
          action: "填入卡带规格。",
          title: "偏磁设置",
          body: "用精确技术设置收束。",
        },
      ],
    },
    {
      id: 4,
      title: "电平",
      beats: [
        {
          id: 0,
          action: "渲染电平柱。",
          title: "信号出现",
          body: "把发布当成一次音频输出检查。",
        },
        {
          id: 1,
          action: "加入校准行。",
          title: "噪声底",
          body: "把有效信号和噪声分开。",
        },
        {
          id: 2,
          action: "确认发布范围。",
          title: "可发布电平",
          body: "最终电平状态可以公开。",
        },
      ],
    },
    {
      id: 5,
      title: "倒带",
      beats: [
        {
          id: 0,
          action: "重置计数器。",
          title: "磁带到底",
          body: "包装到达停止点。",
        },
        {
          id: 1,
          action: "显示重放指令。",
          title: "重新开始",
          body: "发布成为可复盘的循环。",
        },
      ],
    },
  ],
};

function useFonts() {
  useEffect(() => {
    const id = "style-29-release-mixtape-v2-fonts";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@500;600&family=Noto+Sans+SC:wght@500;700;900&family=Roboto+Condensed:wght@700;900&display=swap";
    document.head.appendChild(link);
  }, []);
}

function asSceneId(scene: number): SceneId {
  return SCENE_IDS.includes(scene as SceneId) ? (scene as SceneId) : 1;
}

function clampBeat(sceneId: SceneId, beat: number): number {
  return Math.max(0, Math.min(beat, BEAT_COUNTS[sceneId] - 1));
}

function visibleClass(beat: number, threshold: number): string {
  return beat >= threshold ? styles.visible : styles.pending;
}

function SceneHeader({
  sceneId,
  beat,
  copy,
}: {
  sceneId: SceneId;
  beat: number;
  copy: SceneCopy;
}) {
  return (
    <header className={styles.sceneHeader} data-beat-layout-item="true">
      <div className={styles.sceneNumber}>
        {String(sceneId).padStart(2, "0")}
      </div>
      <div>
        <p className={styles.sceneLabel}>{copy.label}</p>
        <p className={styles.sceneKicker}>{copy.kicker}</p>
      </div>
      <BeatMarkers sceneId={sceneId} beat={beat} />
    </header>
  );
}

function BeatMarkers({ sceneId, beat }: { sceneId: SceneId; beat: number }) {
  return (
    <div className={styles.beatMarkers} aria-label="beat markers">
      {Array.from({ length: BEAT_COUNTS[sceneId] }, (_, index) => (
        <span
          key={index}
          className={[
            styles.beatMarker,
            index <= beat ? styles.beatMarkerActive : "",
          ]
            .filter(Boolean)
            .join(" ")}
          data-beat-layout-item="true"
        />
      ))}
    </div>
  );
}

function PageMark({ sceneId }: { sceneId: SceneId }) {
  return (
    <div className={styles.pageMark} data-beat-layout-item="true">
      <span>C-90</span>
      <span>{String(sceneId).padStart(3, "0")}</span>
    </div>
  );
}

function RainbowRibbon({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={[styles.ribbon, compact ? styles.ribbonCompact : ""]
        .filter(Boolean)
        .join(" ")}
      aria-hidden="true"
    >
      <span className={styles.ribbonRed} />
      <span className={styles.ribbonOrange} />
      <span className={styles.ribbonYellow} />
      <span className={styles.ribbonGreen} />
      <span className={styles.ribbonBlue} />
    </div>
  );
}

function JCardScene({
  sceneId,
  beat,
  copy,
}: {
  sceneId: SceneId;
  beat: number;
  copy: SceneCopy;
}) {
  return (
    <section className={styles.scene}>
      <SceneHeader sceneId={sceneId} beat={beat} copy={copy} />
      <div className={styles.jCardGrid}>
        <aside
          className={[styles.spine, visibleClass(beat, 0)].join(" ")}
          data-beat-layout-item="true"
        >
          <span>{copy.title}</span>
          <small>TYPE I NORMAL</small>
        </aside>
        <main className={styles.coverPanel} data-beat-layout-item="true">
          <RainbowRibbon />
          <div className={styles.coverTitleBlock}>
            <p className={styles.coverEdition}>STEREO / RELEASE SERIES</p>
            <h1 className={styles.coverTitle}>{copy.title}</h1>
            <p className={styles.coverBody}>{copy.body}</p>
          </div>
          <div
            className={[styles.coverStamp, visibleClass(beat, 2)].join(" ")}
            data-beat-layout-item="true"
          >
            C-90
          </div>
          <div
            className={[styles.starSeal, visibleClass(beat, 2)].join(" ")}
            data-beat-layout-item="true"
          >
            MIX
          </div>
        </main>
        <aside
          className={[styles.coverSpec, visibleClass(beat, 1)].join(" ")}
          data-beat-layout-item="true"
        >
          <span>J-CARD</span>
          <span>FOLD A</span>
          <span>BIAS NORMAL</span>
          <span>NO. 29</span>
        </aside>
      </div>
      <PageMark sceneId={sceneId} />
    </section>
  );
}

function TrackList({ tracks, beat }: { tracks: TrackLine[]; beat: number }) {
  return (
    <div className={styles.trackList} data-beat-layout-item="true">
      {tracks.map((track) => (
        <div
          key={`${track.no}-${track.title}`}
          className={[styles.trackRow, visibleClass(beat, track.beat)].join(
            " ",
          )}
          data-beat-layout-item="true"
        >
          <span>{track.no}</span>
          <span>{track.title}</span>
          <span>{track.time}</span>
        </div>
      ))}
    </div>
  );
}

function SideAScene({
  sceneId,
  beat,
  copy,
  language,
}: {
  sceneId: SceneId;
  beat: number;
  copy: SceneCopy;
  language: Lang;
}) {
  return (
    <section className={styles.scene}>
      <SceneHeader sceneId={sceneId} beat={beat} copy={copy} />
      <div className={styles.sideGrid}>
        <div className={styles.sidePanel} data-beat-layout-item="true">
          <div className={styles.sideTitleBar}>SIDE A</div>
          <TrackList tracks={SIDE_A_TRACKS[language]} beat={beat} />
          <div
            className={[styles.totalTime, visibleClass(beat, 2)].join(" ")}
            data-beat-layout-item="true"
          >
            <span>TOTAL TIME</span>
            <strong>17:41</strong>
          </div>
        </div>
        <div className={styles.notePanel} data-beat-layout-item="true">
          <h2>{copy.title}</h2>
          <p>{copy.body}</p>
          <div className={styles.checkboxGrid}>
            {["DUB", "EQ", "MASTER", "READY"].map((item, index) => (
              <span
                key={item}
                className={[
                  styles.checkboxItem,
                  visibleClass(beat, Math.min(index, 2)),
                ].join(" ")}
                data-beat-layout-item="true"
              >
                <i>×</i>
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
      <PageMark sceneId={sceneId} />
    </section>
  );
}

function SideBScene({
  sceneId,
  beat,
  copy,
  language,
}: {
  sceneId: SceneId;
  beat: number;
  copy: SceneCopy;
  language: Lang;
}) {
  return (
    <section className={styles.scene}>
      <SceneHeader sceneId={sceneId} beat={beat} copy={copy} />
      <div className={styles.sideBGrid}>
        <div className={styles.sidePanel} data-beat-layout-item="true">
          <div className={styles.sideTitleBar}>SIDE B</div>
          <TrackList tracks={SIDE_B_TRACKS[language]} beat={beat} />
          <div
            className={[styles.glitchStrips, visibleClass(beat, 1)].join(" ")}
            data-beat-layout-item="true"
            aria-hidden="true"
          >
            <span />
            <span />
            <span />
          </div>
        </div>
        <div className={styles.specPanel} data-beat-layout-item="true">
          <h2>{copy.title}</h2>
          <SpecTable rows={SIDE_B_SPECS[language]} beat={beat} />
          <div
            className={[styles.redStamp, visibleClass(beat, 2)].join(" ")}
            data-beat-layout-item="true"
          >
            SIGNAL OK
          </div>
        </div>
      </div>
      <PageMark sceneId={sceneId} />
    </section>
  );
}

function SpecTable({ rows, beat }: { rows: SpecLine[]; beat: number }) {
  return (
    <div className={styles.specTable} data-beat-layout-item="true">
      {rows.map((row) => (
        <div
          key={`${row.label}-${row.value}`}
          className={[styles.specRow, visibleClass(beat, row.beat)].join(" ")}
          data-beat-layout-item="true"
        >
          <span>{row.label}</span>
          <strong>{row.value}</strong>
        </div>
      ))}
    </div>
  );
}

function LevelsScene({
  sceneId,
  beat,
  copy,
  language,
}: {
  sceneId: SceneId;
  beat: number;
  copy: SceneCopy;
  language: Lang;
}) {
  return (
    <section className={styles.scene}>
      <SceneHeader sceneId={sceneId} beat={beat} copy={copy} />
      <div className={styles.levelsGrid}>
        <div className={styles.levelsPanel} data-beat-layout-item="true">
          <div className={styles.dbScale}>
            {["+8", "+4", "0", "-4", "-8", "-12"].map((tick) => (
              <span key={tick}>{tick}</span>
            ))}
          </div>
          <div className={styles.meterBank}>
            {LEVEL_BARS.map((bar, index) => (
              <span
                key={index}
                className={[
                  styles.levelBar,
                  visibleClass(beat, index < 2 ? 0 : index < 5 ? 1 : 2),
                ].join(" ")}
                style={{ "--bar-height": `${bar}cqh` } as CSSProperties}
                data-beat-layout-item="true"
              />
            ))}
          </div>
          <div className={styles.frequencyLabels}>
            {["60", "250", "1K", "4K", "16K"].map((label) => (
              <span key={label}>{label}</span>
            ))}
          </div>
        </div>
        <div className={styles.specPanel} data-beat-layout-item="true">
          <h2>{copy.title}</h2>
          <p className={styles.panelBody}>{copy.body}</p>
          <SpecTable rows={LEVEL_SPECS[language]} beat={beat} />
        </div>
      </div>
      <PageMark sceneId={sceneId} />
    </section>
  );
}

function RewindScene({
  sceneId,
  beat,
  copy,
}: {
  sceneId: SceneId;
  beat: number;
  copy: SceneCopy;
}) {
  return (
    <section className={styles.scene}>
      <SceneHeader sceneId={sceneId} beat={beat} copy={copy} />
      <div className={styles.rewindGrid}>
        <div className={styles.rewindPanel} data-beat-layout-item="true">
          <RainbowRibbon compact />
          <p className={styles.endTape}>END OF TAPE</p>
          <div className={styles.rewindArrows} aria-hidden="true">
            ◀ ◀ ◀
          </div>
          <div className={styles.bigCounter}>
            <span>0</span>
            <span>0</span>
            <span>0</span>
          </div>
          <p
            className={[styles.replayLine, visibleClass(beat, 1)].join(" ")}
            data-beat-layout-item="true"
          >
            {copy.body}
          </p>
        </div>
        <div className={styles.finalCard} data-beat-layout-item="true">
          <h2>{copy.title}</h2>
          <p>{copy.kicker}</p>
          <div
            className={[styles.coverStamp, visibleClass(beat, 1)].join(" ")}
            data-beat-layout-item="true"
          >
            REPLAY
          </div>
        </div>
      </div>
      <PageMark sceneId={sceneId} />
    </section>
  );
}

function ScenePanel({
  scene,
  beat,
  language,
  isActive,
}: {
  scene: number;
  beat: number;
  language: Lang;
  isActive: boolean;
}) {
  const sceneId = asSceneId(scene);
  const safeBeat = clampBeat(sceneId, beat);
  const copy = SCENES[sceneId][language];

  return (
    <div
      className={styles.scenePanel}
      data-active-panel={isActive ? "true" : "false"}
      data-scene={sceneId}
    >
      {sceneId === 1 ? (
        <JCardScene sceneId={sceneId} beat={safeBeat} copy={copy} />
      ) : sceneId === 2 ? (
        <SideAScene
          sceneId={sceneId}
          beat={safeBeat}
          copy={copy}
          language={language}
        />
      ) : sceneId === 3 ? (
        <SideBScene
          sceneId={sceneId}
          beat={safeBeat}
          copy={copy}
          language={language}
        />
      ) : sceneId === 4 ? (
        <LevelsScene
          sceneId={sceneId}
          beat={safeBeat}
          copy={copy}
          language={language}
        />
      ) : (
        <RewindScene sceneId={sceneId} beat={safeBeat} copy={copy} />
      )}
    </div>
  );
}

function CassetteCounterNav({
  scene,
  onNavigate,
}: {
  scene: SceneId;
  onNavigate?: (scene: number, beat: number) => void;
}) {
  return (
    <nav className={styles.counterNav} aria-label="cassette window counter">
      <span className={styles.reel} aria-hidden="true" />
      <div className={styles.counterWindow}>
        {SCENE_IDS.map((targetScene) => (
          <button
            key={targetScene}
            type="button"
            className={[
              styles.counterButton,
              targetScene === scene ? styles.counterButtonActive : "",
            ]
              .filter(Boolean)
              .join(" ")}
            aria-label={`Go to scene ${targetScene}`}
            aria-current={targetScene === scene ? "step" : undefined}
            onClick={() => onNavigate?.(targetScene, 0)}
          >
            {String(targetScene).padStart(3, "0")}
          </button>
        ))}
      </div>
      <span className={styles.reel} aria-hidden="true" />
    </nav>
  );
}

export function getMetadata(lang: Lang): StyleMetadata {
  return {
    id: "cassette-era-packaging",
    band: "craft-cultural",
    name: lang === "zh" ? "卡带时代包装" : "Cassette-Era Packaging",
    theme: lang === "zh" ? "发行混音带" : "The Release Mixtape",
    densityLabel: lang === "zh" ? "中高密度" : "Medium-high density",
    heroScene: 1,
    colors: {
      bg: "#f0d9ad",
      ink: "#3f2516",
      panel: "#ead0a0",
    },
    typography: {
      header: "Roboto Condensed 900",
      body: "Noto Sans SC 500 / IBM Plex Mono 500",
    },
    tags: [
      "cassette",
      "retro",
      "packaging",
      "catalogue",
      "craft-cultural",
      "spec-sheet",
    ],
    fonts: ["Roboto Condensed", "IBM Plex Mono", "cjk:Noto Sans SC"],
    scenes: METADATA_SCENES[lang],
  };
}

export default function ReleaseMixtapeV2({
  scene,
  beat,
  language,
  isThumbnail,
  reducedMotion,
  onNavigate,
}: BespokeStyleProps) {
  useFonts();
  const sceneId = asSceneId(scene);
  const safeBeat = clampBeat(sceneId, beat);
  const motionOff = reducedMotion || isThumbnail;

  return (
    <div
      className={styles.root}
      data-lang={language}
      data-reduced-motion={motionOff ? "true" : "false"}
      data-thumbnail={isThumbnail ? "true" : "false"}
    >
      <div className={styles.paperFrame}>
        <SpatialSceneTrack
          scene={sceneId}
          beat={safeBeat}
          transitionKind="slide-x"
          transitionMap={TRANSITION_MAP}
          transitionDurationMs={620}
          reducedMotion={motionOff}
          beatLayoutModes={BEAT_LAYOUT_MODES}
          className={styles.sceneTrack}
          renderScene={(trackScene, trackBeat, isActive) => (
            <ScenePanel
              scene={trackScene}
              beat={trackBeat}
              language={language}
              isActive={isActive}
            />
          )}
        />
        {!isThumbnail && (
          <CassetteCounterNav scene={sceneId} onNavigate={onNavigate} />
        )}
      </div>
    </div>
  );
}

export const releaseMixtapeTopic = defineStyleTopic({
  id: "release-mixtape",
  topic: {
    en: "Release Mixtape",
    zh: "发布混音",
  },
  model: "GPT 5.5",
  component: ReleaseMixtapeV2,
  getMetadata,
});

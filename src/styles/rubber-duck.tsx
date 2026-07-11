import type { BespokeStyleProps, StyleMetadata } from "../types";
import { defineStyleTopic } from "./topic";
import { curatedNavigationAttributes } from "./curated-topic-contract";
import SpatialSceneTrack from "./SpatialSceneTrack";
import type { SceneTransitionMap } from "./SpatialSceneTrack";
import { useFLIP } from "../hooks/useFLIP";
import styles from "./rubber-duck.module.css";

/* ── beat counts ───────────────────────────────────────────────────────── */
const BEATS = [1, 2, 2, 3, 2] as const; // scenes 1..5

/* ── transitions ───────────────────────────────────────────────────────── */
const TRANSITIONS: SceneTransitionMap = {
  "1->2": "slide-y",
  "2->3": "slide-y",
  "3->4": "fade",
  "4->5": "scale-fade",
};

/* ── copy ──────────────────────────────────────────────────────────────── */
type Lang = "en" | "zh";

const COPY = {
  en: {
    kicker: "RUBBER-DUCK DEBUGGING",
    title: "The Rubber Duck",
    sub: "Explain the bug aloud. Solve it by saying it.",
    engineer: "ENGINEER",
    duck: "RUBBER DUCK",
    engineerRole: "speaks",
    duckRole: "listens",
    s2: [
      "So… this function returns undefined — but only sometimes.",
      "The tests pass locally. In CI it just — breaks.",
    ],
    s3eng: "I map each item, filter it, then reduce it into the cache.",
    s3duck: "( listens )",
    s4: ["…and the cache key is built from the object, so—", "—", "Oh. The key isn't stable. That's the bug."],
    s5: [
      "Hash the fields, not the reference. One line.",
      "The duck said nothing. The duck was right.",
    ],
    duckStill: "the duck, unchanged",
    stepEng: "engineer",
    stepDuck: "duck",
    stepHint: "next turn →",
  },
  zh: {
    kicker: "橡皮鸭调试法",
    title: "橡皮鸭",
    sub: "把 bug 讲出来，说着说着就解决了。",
    engineer: "工程师",
    duck: "橡皮鸭",
    engineerRole: "开口",
    duckRole: "倾听",
    s2: [
      "所以……这个函数会返回 undefined——但只是偶尔。",
      "本地测试全过。一到 CI 就……崩。",
    ],
    s3eng: "我映射每一项，过滤，再 reduce 进缓存。",
    s3duck: "（ 倾听 ）",
    s4: ["……缓存 key 是用对象拼出来的，所以——", "——", "啊。这个 key 不稳定。就是它。"],
    s5: ["对字段做哈希，别用引用。一行搞定。", "橡皮鸭什么都没说。橡皮鸭说得对。"],
    duckStill: "橡皮鸭，没变",
    stepEng: "工程师",
    stepDuck: "橡皮鸭",
    stepHint: "下一轮 →",
  },
} satisfies Record<Lang, Record<string, unknown>>;

/* active speaker per (scene, beat) — drives the stepper + dot glow */
function activeSpeaker(scene: number, beat: number): "eng" | "duck" {
  if (scene === 3 && beat === 1) return "duck";
  return "eng";
}

/* ── scene 1: title, both markers glow up ──────────────────────────────── */
function TitleScene({ c }: { c: (typeof COPY)[Lang] }) {
  return (
    <div className={`${styles.scene} ${styles.title}`}>
      <span className={styles.kicker}>{c.kicker}</span>
      <h1 className={styles.titleH}>{c.title}</h1>
      <p className={styles.titleSub}>{c.sub}</p>
      <div className={styles.markers}>
        <div className={styles.marker}>
          <span className={`${styles.dot} ${styles.dotEng}`} data-active="true" />
          <span className={styles.markerText}>
            <span className={styles.markerLabel}>{c.engineer}</span>
            <span className={styles.markerRole}>{c.engineerRole}</span>
          </span>
        </div>
        <div className={styles.marker}>
          <span className={`${styles.dot} ${styles.dotDuck}`} data-active="true" />
          <span className={styles.markerText}>
            <span className={styles.markerLabel}>{c.duck}</span>
            <span className={styles.markerRole}>{c.duckRole}</span>
          </span>
        </div>
      </div>
    </div>
  );
}

/* ── scene 2: stuck engineer — motion (FLIP reflow) ────────────────────── */
function StuckScene({
  c,
  beat,
  isActive,
  staticMode,
}: {
  c: (typeof COPY)[Lang];
  beat: number;
  isActive: boolean;
  staticMode: boolean;
}) {
  const { ref } = useFLIP<HTMLDivElement>({
    watch: [beat],
    disabled: staticMode || !isActive,
    duration: 480,
    easing: "cubic-bezier(0.34, 1.56, 0.64, 1)",
    selector: '[data-beat-layout-item="true"]',
  });
  return (
    <div className={`${styles.scene} ${styles.transcript}`}>
      <div
        ref={ref}
        className={styles.stack}
        data-beat-layout-container="true"
        data-beat-layout-mode="motion"
      >
        <span className={styles.speakerTag} data-beat-layout-item="true">
          <span className={`${styles.dot} ${styles.dotEng}`} data-active="true" />
          {c.engineer}
        </span>
        <p className={`${styles.line} ${styles.lineEng}`} data-beat-layout-item="true">
          {c.s2[0]}
        </p>
        {beat >= 1 && (
          <p className={`${styles.line} ${styles.lineEng}`} data-beat-layout-item="true">
            {c.s2[1]}
          </p>
        )}
      </div>
    </div>
  );
}

/* ── scene 3: turns alternate — reserved (glow moves) ──────────────────── */
function ExplainScene({ c, beat }: { c: (typeof COPY)[Lang]; beat: number }) {
  const engActive = beat === 0;
  const duckActive = beat === 1;
  return (
    <div className={`${styles.scene} ${styles.turns}`}>
      <div
        className={styles.turnStack}
        data-beat-layout-container="true"
        data-beat-layout-mode="reserved"
      >
        <div className={styles.turnRow} data-active={engActive} data-beat-layout-item="true">
          <span className={`${styles.dot} ${styles.dotEng}`} data-active={engActive} />
          <p className={`${styles.turnLine} ${styles.turnEng}`}>{c.s3eng}</p>
        </div>
        <div className={styles.turnRow} data-active={duckActive} data-beat-layout-item="true">
          <span className={`${styles.dot} ${styles.dotDuck}`} data-active={duckActive} />
          <p className={`${styles.turnLine} ${styles.turnDuck}`}>{c.s3duck}</p>
        </div>
      </div>
    </div>
  );
}

/* ── scene 4: the realization — reserved (glow snaps to engineer) ──────── */
function RealizeScene({ c, beat }: { c: (typeof COPY)[Lang]; beat: number }) {
  return (
    <div className={`${styles.scene} ${styles.reveal}`}>
      <div
        className={styles.revealStack}
        data-beat-layout-container="true"
        data-beat-layout-mode="reserved"
      >
        <div className={styles.revealRow} data-active={beat <= 1} data-beat-layout-item="true">
          <span className={`${styles.dot} ${styles.dotEng}`} data-active={beat <= 1} />
          <p className={styles.revealLine}>{c.s4[0]}</p>
        </div>
        <div
          className={styles.revealRow}
          data-active={beat === 1}
          data-beat-layout-item="true"
          style={{ visibility: beat >= 1 ? "visible" : "hidden" }}
        >
          <span className={`${styles.dot} ${styles.dotEng}`} data-active={beat === 1} />
          <p className={`${styles.revealLine} ${styles.revealPause}`}>{c.s4[1]}</p>
        </div>
        <div
          className={`${styles.revealRow} ${styles.realizeRow}`}
          data-active={beat === 2}
          data-beat-layout-item="true"
          style={{ visibility: beat >= 2 ? "visible" : "hidden" }}
        >
          <span className={`${styles.dot} ${styles.dotEng}`} data-active={beat === 2} />
          <p className={`${styles.revealLine} ${styles.realizeLine}`}>{c.s4[2]}</p>
        </div>
      </div>
    </div>
  );
}

/* ── scene 5: resolved — motion (FLIP reflow) ──────────────────────────── */
function ResolvedScene({
  c,
  beat,
  isActive,
  staticMode,
}: {
  c: (typeof COPY)[Lang];
  beat: number;
  isActive: boolean;
  staticMode: boolean;
}) {
  const { ref } = useFLIP<HTMLDivElement>({
    watch: [beat],
    disabled: staticMode || !isActive,
    duration: 480,
    easing: "cubic-bezier(0.34, 1.56, 0.64, 1)",
    selector: '[data-beat-layout-item="true"]',
  });
  return (
    <div className={`${styles.scene} ${styles.transcript}`}>
      <div
        ref={ref}
        className={styles.stack}
        data-beat-layout-container="true"
        data-beat-layout-mode="motion"
      >
        <span className={styles.speakerTag} data-beat-layout-item="true">
          <span className={`${styles.dot} ${styles.dotEng}`} data-active="true" />
          {c.engineer}
        </span>
        <p className={`${styles.line} ${styles.lineResolve}`} data-beat-layout-item="true">
          {c.s5[0]}
        </p>
        {beat >= 1 && (
          <p className={`${styles.line} ${styles.lineEng}`} data-beat-layout-item="true">
            {c.s5[1]}
          </p>
        )}
      </div>
      <div className={styles.duckStill}>
        <span className={`${styles.dot} ${styles.dotDuck}`} data-active="true" />
        <span className={styles.duckStillLabel}>{c.duckStill}</span>
      </div>
    </div>
  );
}

/* ── nav: conversation stepper (bespoke) ───────────────────────────────── */
function ConversationStepper({
  scene,
  beat,
  c,
  isThumbnail,
  onNavigate,
}: {
  scene: number;
  beat: number;
  c: (typeof COPY)[Lang];
  isThumbnail: boolean;
  onNavigate?: (scene: number, beat: number) => void;
}) {
  if (isThumbnail) return null;

  const speaker = activeSpeaker(scene, beat);

  const advance = (e: React.MouseEvent) => {
    e.stopPropagation();
    // advance to the next turn (next beat, wrapping to the next scene)
    if (beat + 1 < BEATS[scene - 1]) {
      onNavigate?.(scene, beat + 1);
    } else {
      const nextScene = scene < 5 ? scene + 1 : 1;
      onNavigate?.(nextScene, 0);
    }
  };

  return (
    <div
      {...curatedNavigationAttributes("interactive-dialogue-stage", "rubber-duck")}
      className={styles.stepper}
      onClick={advance}
      role="button"
      aria-label="next turn"
    >
      <span className={styles.stepDotWrap}>
        <span className={`${styles.dot} ${styles.dotEng}`} data-active={speaker === "eng"} />
        <span className={styles.stepLabel} data-on={speaker === "eng"}>
          {c.stepEng}
        </span>
      </span>
      <span className={styles.stepConnector} />
      <span className={styles.stepDotWrap}>
        <span className={`${styles.dot} ${styles.dotDuck}`} data-active={speaker === "duck"} />
        <span className={styles.stepLabel} data-on={speaker === "duck"}>
          {c.stepDuck}
        </span>
      </span>
      <span className={styles.stepHint}>{c.stepHint}</span>
    </div>
  );
}

/* ── component ─────────────────────────────────────────────────────────── */
function RubberDuckV3({
  scene,
  beat,
  language,
  isThumbnail,
  reducedMotion,
  onNavigate,
}: BespokeStyleProps) {
  const c = COPY[language];
  const staticMode = reducedMotion || isThumbnail;

  return (
    <div className={styles.root} data-static={staticMode}>
      <div className={styles.vignette} />
      <SpatialSceneTrack
        scene={scene}
        beat={beat}
        transitionKind="slide-y"
        transitionMap={TRANSITIONS}
        reducedMotion={reducedMotion || isThumbnail}
        beatLayoutModes={{ 2: "motion", 3: "reserved", 4: "reserved", 5: "motion" }}
        renderScene={(sceneId, sceneBeat, isActive) => {
          if (sceneId === 1) return <TitleScene c={c} />;
          if (sceneId === 2)
            return <StuckScene c={c} beat={sceneBeat} isActive={isActive} staticMode={staticMode} />;
          if (sceneId === 3) return <ExplainScene c={c} beat={sceneBeat} />;
          if (sceneId === 4) return <RealizeScene c={c} beat={sceneBeat} />;
          return <ResolvedScene c={c} beat={sceneBeat} isActive={isActive} staticMode={staticMode} />;
        }}
      />
      <ConversationStepper
        scene={scene}
        beat={beat}
        c={c}
        isThumbnail={isThumbnail}
        onNavigate={onNavigate}
      />
    </div>
  );
}

/* ── metadata ──────────────────────────────────────────────────────────── */
export function getMetadata(lang: Lang): StyleMetadata {
  const t = {
    en: {
      theme: "The Rubber Duck",
      density: "Sparse",
      s: [
        { title: "Title", beats: [
          { action: "Stage dims up", title: "The Rubber Duck", body: "Two voices take the stage: one speaks, one listens." },
        ]},
        { title: "The Stuck Engineer", beats: [
          { action: "First turn", title: "A bug in the dark", body: "This function returns undefined — but only sometimes." },
          { action: "The complaint", title: "Passes here, breaks there", body: "Green locally. In CI it just breaks." },
        ]},
        { title: "Explaining Aloud", beats: [
          { action: "Engineer speaks", title: "Walking the code", body: "Map each item, filter it, reduce it into the cache." },
          { action: "Duck listens", title: "Silence", body: "The duck says nothing. Attention holds on the words." },
        ]},
        { title: "The Realization", beats: [
          { action: "Mid-sentence", title: "The cache key", body: "The key is built from the object, so—" },
          { action: "The pause", title: "A trailing off", body: "The sentence stops halfway." },
          { action: "Glow snaps", title: "That's the bug", body: "The key isn't stable. There it is." },
        ]},
        { title: "Resolved", beats: [
          { action: "The fix", title: "One line", body: "Hash the fields, not the reference." },
          { action: "Duck unchanged", title: "The duck was right", body: "It said nothing — and it was right." },
        ]},
      ],
    },
    zh: {
      theme: "橡皮鸭",
      density: "疏朗",
      s: [
        { title: "标题", beats: [
          { action: "舞台亮起", title: "橡皮鸭", body: "两个声音登台：一个开口，一个倾听。" },
        ]},
        { title: "卡住的工程师", beats: [
          { action: "第一轮", title: "黑暗里的 bug", body: "这个函数会返回 undefined——但只是偶尔。" },
          { action: "抱怨", title: "这里过，那里崩", body: "本地全绿。一到 CI 就崩。" },
        ]},
        { title: "把它讲出来", beats: [
          { action: "工程师开口", title: "顺着代码走", body: "映射每一项，过滤，再 reduce 进缓存。" },
          { action: "橡皮鸭倾听", title: "沉默", body: "橡皮鸭什么都没说。注意力停在话上。" },
        ]},
        { title: "顿悟", beats: [
          { action: "说到一半", title: "那个缓存 key", body: "key 是用对象拼出来的，所以——" },
          { action: "停顿", title: "话说了一半", body: "话说到一半停住了。" },
          { action: "光骤然聚焦", title: "就是它", body: "这个 key 不稳定。原来在这。" },
        ]},
        { title: "解决", beats: [
          { action: "修复", title: "一行", body: "对字段做哈希，别用引用。" },
          { action: "橡皮鸭没变", title: "橡皮鸭说得对", body: "它什么都没说——但它对了。" },
        ]},
      ],
    },
  }[lang];

  return {
    id: "interactive-dialogue-stage",
    band: "minimal-keynote",
    name: lang === "en" ? "Interactive Dialogue Stage" : "互动对话舞台",
    theme: t.theme,
    densityLabel: t.density,
    heroScene: 4,
    colors: { bg: "#080b14", ink: "#e9eef7", panel: "#141b28" },
    typography: { header: "JetBrains Mono", body: "JetBrains Mono" },
    tags: ["conversational", "cinematic", "dark", "monospace", "turn-based", "sparse"],
    fonts: ["JetBrains Mono:wght@400;500;700", "cjk:Noto Sans SC:wght@400;500;700"],
    scenes: t.s.map((sc, i) => ({
      id: i + 1,
      title: sc.title,
      beats: sc.beats.map((b, j) => ({ id: j, action: b.action, title: b.title, body: b.body })),
    })),
  };
}

export const rubberDuckTopic = defineStyleTopic({
  id: "rubber-duck",
  topic: { en: "The Rubber Duck", zh: "橡皮鸭" },
  model: "Claude Opus 4.8",
  component: RubberDuckV3,
  getMetadata,
});

export default RubberDuckV3;

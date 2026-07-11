/**
 * "Ship It"
 *
 * A loud graphic poster where words ARE the image. Two-tone figure/ground:
 * a deep-black hard field carries off-white condensed uppercase display type,
 * with one electric-yellow accent reserved for the struck/swapped word and the
 * final field flip. Flat surfaces, no texture/depth. Motion is percussive:
 * words slam in, "later" gets struck and swapped for "NOW", phrases hit one
 * after another. Fast and hard is correct here.
 *
 * Isolation: written from the DNA + shared brief only. No other style read.
 */

import { useEffect, useState } from "react";
import {
  defineTopic,
  type TopicDefinition,
  type TopicStageProps,
} from "../domain/topic";
import SpatialSceneTrack from "../components/stage/SpatialSceneTrack";
import type { SceneTransitionMap } from "../components/stage/SpatialSceneTrack";
import { useFLIP } from "../hooks/useFLIP";
import styles from "./ship-it.module.css";

/* ------------------------------------------------------------- content --- */

type Lang = "en" | "zh";

const COPY = {
  en: {
    hero: "SHIP",
    excusesLabel: "THE EXCUSES",
    excuses: ["NOT READY", "ONE MORE BUG", "NEEDS POLISH", "WHAT IF IT BREAKS"],
    strikeLabel: "THE STRIKE",
    strikeWord: "LATER",
    strikeWhisper: "THE SAFE ANSWER",
    strikeSwap: "NOW",
    countLabel: "THE COUNTDOWN",
    phrases: ["NO MORE WAITING", "PUSH THE BRANCH", "SHIP TODAY"],
    finalLines: ["SHIP", "IT"],
  },
  zh: {
    hero: "发布",
    excusesLabel: "借口",
    excuses: ["还没准备好", "还有个 BUG", "需要打磨", "万一崩了呢"],
    strikeLabel: "划掉",
    strikeWord: "以后",
    strikeWhisper: "最稳的答案",
    strikeSwap: "现在",
    countLabel: "倒数",
    phrases: ["别再等了", "推上分支", "今天就发"],
    finalLines: ["发布", "吧"],
  },
} satisfies Record<Lang, unknown>;

/* --------------------------------------------------------------- utils --- */

function cx(...parts: (string | false | undefined)[]) {
  return parts.filter(Boolean).join(" ");
}

/** Re-triggers a transform "slam" each time the scene becomes active. */
function useSlamIn(isActive: boolean, off: boolean) {
  const [entered, setEntered] = useState(off);
  useEffect(() => {
    if (off) {
      setEntered(true);
      return;
    }
    if (!isActive) {
      setEntered(false);
      return;
    }
    const raf = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(raf);
  }, [isActive, off]);
  return entered;
}

interface SceneProps {
  beat: number;
  isActive: boolean;
  language: Lang;
  off: boolean;
}

/* ---------------------------------------------------------- scene 1: title */

function TitleScene({ isActive, language, off }: SceneProps) {
  const entered = useSlamIn(isActive, off);
  return (
    <div className={styles.center}>
      <h1 className={cx(styles.hero, !entered && styles.slamPre)}>
        {COPY[language].hero}
      </h1>
    </div>
  );
}

/* ------------------------------------------------------- scene 2: excuses */
/* motion mode: new beats reflow existing items; movers animate via FLIP.     */

function ExcusesScene({ beat, isActive, language, off }: SceneProps) {
  const copy = COPY[language];
  const shown = beat >= 1 ? copy.excuses.length : 2;
  const items = copy.excuses.slice(0, shown);

  const { ref } = useFLIP<HTMLDivElement>({
    watch: [beat],
    disabled: off || !isActive,
    duration: 460,
    easing: "cubic-bezier(0.2, 1.4, 0.35, 1)",
    selector: '[data-beat-layout-item="true"]',
  });

  return (
    <div className={styles.stack}>
      <span className={styles.label}>{copy.excusesLabel}</span>
      <div
        ref={ref}
        className={styles.stack}
        style={{ position: "static", padding: 0, gap: "0.6cqh" }}
        data-beat-layout-container="true"
        data-beat-layout-mode="motion"
      >
        {items.map((text, i) => (
          <div
            key={i}
            className={cx(styles.excuse, !off && styles.slamItem)}
            data-beat-layout-item="true"
          >
            {text}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ----------------------------------------------------- scene 3: the strike */
/* motion mode: two stacked items reflow. Beat 1 strikes "later" and swaps    */
/* the whisper line into a huge accent "NOW".                                 */

function StrikeScene({ beat, isActive, language, off }: SceneProps) {
  const copy = COPY[language];
  const struck = beat >= 1;

  const { ref } = useFLIP<HTMLDivElement>({
    watch: [beat],
    disabled: off || !isActive,
    duration: 440,
    easing: "cubic-bezier(0.2, 1.4, 0.35, 1)",
    selector: '[data-beat-layout-item="true"]',
  });

  return (
    <div className={styles.stack}>
      <span className={styles.label}>{copy.strikeLabel}</span>
      <div
        ref={ref}
        className={styles.stack}
        style={{ position: "static", padding: 0, gap: "1.4cqh" }}
        data-beat-layout-container="true"
        data-beat-layout-mode="motion"
      >
        <div
          className={cx(styles.s3word, styles.strikeWord, struck && styles.struck)}
          data-beat-layout-item="true"
        >
          {copy.strikeWord}
        </div>
        <div
          className={cx(struck ? styles.s3word : styles.label, struck && styles.accentWord)}
          data-beat-layout-item="true"
        >
          {struck ? copy.strikeSwap : copy.strikeWhisper}
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------- scene 4: the countdown */
/* reserved mode: three fixed slots reserved from beat 0; later beats only     */
/* toggle opacity/emphasis. Slots keep their space (never display:none).       */

function CountdownScene({ beat, language }: SceneProps) {
  const copy = COPY[language];
  const shown = beat >= 1 ? 3 : 2;

  return (
    <div className={styles.stack}>
      <span className={styles.label}>{copy.countLabel}</span>
      <div
        className={styles.stack}
        style={{ position: "static", padding: 0, gap: "1cqh" }}
        data-beat-layout-container="true"
        data-beat-layout-mode="reserved"
      >
        {copy.phrases.map((text, i) => {
          const visible = i < shown;
          const isAccent = i === copy.phrases.length - 1;
          return (
            <div
              key={i}
              className={cx(styles.count, visible && styles.countShown, isAccent && styles.accentWord)}
              data-beat-layout-item="true"
              style={{ opacity: visible ? 1 : 0 }}
            >
              {text}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* --------------------------------------------------------- scene 5: ship it */

function ShipScene({ isActive, language, off }: SceneProps) {
  const entered = useSlamIn(isActive, off);
  const [a, b] = COPY[language].finalLines;
  return (
    <>
      <div className={styles.fieldAccent} />
      <div className={styles.center} style={{ gap: "0cqh" }}>
        <h1 className={cx(styles.finalWord, !entered && styles.slamPre)}>{a}</h1>
        <h1 className={cx(styles.finalWord, !entered && styles.slamPre)}>{b}</h1>
      </div>
    </>
  );
}

/* ---------------------------------------------------------------- shell --- */

const TRANSITION_SCORE = {
  "1->2": "hard-cut",
  "2->3": "glitch",
  "3->4": "hard-cut",
  "4->5": "glitch",
} as const satisfies TopicDefinition["transitionScore"];

const TRANSITIONS: SceneTransitionMap = TRANSITION_SCORE;

function TopicStage({
  scene,
  beat,
  language,
  isThumbnail,
  reducedMotion,
}: TopicStageProps) {
  const off = reducedMotion || isThumbnail;

  return (
    <div
      className={styles.root}
      data-motion={off ? "off" : "on"}
      data-lang={language}
    >
      <SpatialSceneTrack
        scene={scene}
        beat={beat}
        transitionKind="hard-cut"
        transitionMap={TRANSITIONS}
        reducedMotion={off}
        beatLayoutModes={{ 2: "motion", 3: "motion", 4: "reserved" }}
        renderScene={(sceneId, sceneBeat, isActive) => {
          const p: SceneProps = { beat: sceneBeat, isActive, language, off };
          switch (sceneId) {
            case 1:
              return <TitleScene {...p} />;
            case 2:
              return <ExcusesScene {...p} />;
            case 3:
              return <StrikeScene {...p} />;
            case 4:
              return <CountdownScene {...p} />;
            case 5:
              return <ShipScene {...p} />;
            default:
              return null;
          }
        }}
      />
    </div>
  );
}

/* ------------------------------------------------------------- metadata --- */

const metadata = {
  en: {
    theme: "Ship It",
    densityLabel: "Poster punch",
    heroScene: 5,
    colors: { bg: "#0b0b0b", ink: "#f4f1e8", panel: "#ffe800" },
    typography: { header: "Anton", body: "Anton" },
    tags: ["confrontational", "kinetic", "high-contrast", "two-tone", "percussive"],
    fonts: ["Anton:wght@400", "cjk:Noto Sans SC:wght@900"],
    scenes: [
      {
        id: 1,
        title: "Title",
        beats: [
          { id: 0, action: "Slam the word in", title: "SHIP", body: "One word. Full stop." },
        ],
      },
      {
        id: 2,
        title: "The Excuses",
        beats: [
          { id: 0, action: "Stack the first excuses", title: "Not Ready", body: "The reasons start to pile up." },
          { id: 1, action: "Pile on the rest", title: "One More Bug", body: "Every excuse to wait a little longer." },
        ],
      },
      {
        id: 3,
        title: "The Strike",
        beats: [
          { id: 0, action: "Show the default word", title: "Later", body: "The word we always reach for." },
          { id: 1, action: "Strike it, swap it", title: "Now", body: "Cross out later. Say now." },
        ],
      },
      {
        id: 4,
        title: "The Countdown",
        beats: [
          { id: 0, action: "First hits land", title: "No More Waiting", body: "Phrases fire in sequence." },
          { id: 1, action: "Final hit lands", title: "Ship Today", body: "The last line hits hardest." },
        ],
      },
      {
        id: 5,
        title: "Ship It",
        beats: [
          { id: 0, action: "Fill the field", title: "SHIP IT", body: "Two words own the frame." },
        ],
      },
    ],
  },
  zh: {
    theme: "发布",
    densityLabel: "海报重击",
    heroScene: 5,
    colors: { bg: "#0b0b0b", ink: "#f4f1e8", panel: "#ffe800" },
    typography: { header: "Noto Sans SC", body: "Noto Sans SC" },
    tags: ["对抗感", "动感", "强对比", "双色", "打击感"],
    fonts: ["Anton", "cjk:Noto Sans SC"],
    scenes: [
      {
        id: 1,
        title: "标题",
        beats: [
          { id: 0, action: "字词砸入", title: "发布", body: "一个词，句号。" },
        ],
      },
      {
        id: 2,
        title: "借口",
        beats: [
          { id: 0, action: "堆起头几个借口", title: "还没准备好", body: "理由开始不断堆积。" },
          { id: 1, action: "把其余的堆上", title: "还有个 BUG", body: "每一个再拖一会儿的借口。" },
        ],
      },
      {
        id: 3,
        title: "划掉",
        beats: [
          { id: 0, action: "亮出惯用词", title: "以后", body: "我们总爱说的那个词。" },
          { id: 1, action: "划掉它，换掉它", title: "现在", body: "划掉以后，说现在。" },
        ],
      },
      {
        id: 4,
        title: "倒数",
        beats: [
          { id: 0, action: "前几击落地", title: "别再等了", body: "短句依次击出。" },
          { id: 1, action: "最后一击落地", title: "今天就发", body: "最后一行最重。" },
        ],
      },
      {
        id: 5,
        title: "发布吧",
        beats: [
          { id: 0, action: "铺满整个画面", title: "发布 吧", body: "两个词占满画面。" },
        ],
      },
    ],
  },
} satisfies TopicDefinition["metadata"];

export default defineTopic({
  id: "ship-it",
  styleId: "kinetic-type-punchline",
  title: { en: "Ship It", zh: "发布" },
  modelId: "Claude Opus 4.8",
  Stage: TopicStage,
  metadata,
  navigation: { mode: "none" },
  transitionScore: TRANSITION_SCORE,
  evidence: {
    kind: "illustrative",
    boundary: {
      en: "Illustrative release prompt: the excuses, countdown, and outcome are poster rhetoric, not a record of a product release.",
      zh: "示例发布提示：其中借口、倒数和结果均为海报修辞，并非一次产品发布的记录。",
    },
    display: "envelope",
  },
});

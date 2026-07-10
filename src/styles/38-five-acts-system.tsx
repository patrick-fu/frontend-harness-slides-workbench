import { useEffect } from "react";
import type { BespokeStyleProps, StyleMetadata } from "../types";
import SpatialSceneTrack from "./SpatialSceneTrack";
import type { BeatLayoutMode, SceneTransitionMap } from "./SpatialSceneTrack";
import { defineStyleTopic } from "./topic";
import styles from "./38-five-acts-system.module.css";

type Language = BespokeStyleProps["language"];
type SceneId = 1 | 2 | 3 | 4 | 5;

interface BeatCopy {
  action: string;
  title: string;
  body: string;
}

interface SceneCopy {
  act: string;
  kicker: string;
  title: string;
  subtitle: string;
  credit: string;
  metadataTitle: string;
  beats: BeatCopy[];
}

const SCENE_IDS: SceneId[] = [1, 2, 3, 4, 5];

const TRANSITION_MAP: SceneTransitionMap = {
  "1->2": "fade",
  "2->3": "slide-x",
  "3->4": "scale-fade",
  "4->5": "hard-cut",
};

const BEAT_LAYOUT_MODES: Record<SceneId, BeatLayoutMode> = {
  1: "reserved",
  2: "reserved",
  3: "reserved",
  4: "reserved",
  5: "reserved",
};

const SCENES: Record<SceneId, Record<Language, SceneCopy>> = {
  1: {
    en: {
      act: "Act I",
      kicker: "Opening Credit",
      title: "Five Acts of a System",
      subtitle: "A quiet machine learns its shape in public light.",
      credit: "System Study / Frame 01",
      metadataTitle: "Title",
      beats: [
        {
          action: "Hold the title in a dark letterbox frame",
          title: "The title arrives",
          body: "A system is introduced as a film, not a diagram.",
        },
        {
          action: "Reveal the subject as a five-act structure",
          title: "Five acts are named",
          body: "Input, tension, midpoint, reveal, memory.",
        },
        {
          action: "Set the cinematic rule for the sequence",
          title: "The frame becomes the rule",
          body: "Every later scene stays sparse, wide, and deliberate.",
        },
      ],
    },
    zh: {
      act: "第一幕",
      kicker: "开场字幕",
      title: "系统五幕",
      subtitle: "一台安静的机器，在光里显出自己的形状。",
      credit: "系统研究 / 画面 01",
      metadataTitle: "标题",
      beats: [
        {
          action: "在深色宽银幕中停住标题",
          title: "标题入场",
          body: "系统先像电影被介绍，而不是像图表被解释。",
        },
        {
          action: "揭示五幕结构",
          title: "五幕被命名",
          body: "输入、张力、中点、显影、记忆。",
        },
        {
          action: "建立整组画面的电影规则",
          title: "画幅成为规则",
          body: "之后每一幕都保持稀疏、宽阔、克制。",
        },
      ],
    },
  },
  2: {
    en: {
      act: "Act II",
      kicker: "Inciting Input",
      title: "A Signal Enters",
      subtitle: "The smallest outside event disturbs the whole field.",
      credit: "Input Path / Frame 02",
      metadataTitle: "Inciting Input",
      beats: [
        {
          action: "Introduce the outside signal",
          title: "One signal crosses the edge",
          body: "The system does not move until something asks it to answer.",
        },
        {
          action: "Show the first internal response",
          title: "The surface wakes",
          body: "A thin path brightens before the machinery is visible.",
        },
        {
          action: "Frame the input as dramatic tension",
          title: "Tension begins",
          body: "The question is small; the consequences are not.",
        },
      ],
    },
    zh: {
      act: "第二幕",
      kicker: "触发输入",
      title: "信号进入",
      subtitle: "最小的外部事件，扰动了整个场。",
      credit: "输入路径 / 画面 02",
      metadataTitle: "触发输入",
      beats: [
        {
          action: "引入外部信号",
          title: "一个信号越过边界",
          body: "系统不会移动，直到某件事要求它回应。",
        },
        {
          action: "展示第一层内部响应",
          title: "表面被点亮",
          body: "机械结构尚未显形，先亮起一条细线。",
        },
        {
          action: "把输入转为叙事张力",
          title: "张力开始",
          body: "问题很小，后果不是。",
        },
      ],
    },
  },
  3: {
    en: {
      act: "Act III",
      kicker: "Midpoint",
      title: "Feedback Bends the Path",
      subtitle: "The system stops behaving like a line and starts remembering.",
      credit: "Feedback Loop / Frame 03",
      metadataTitle: "Midpoint",
      beats: [
        {
          action: "Turn the path into a loop",
          title: "The line curves back",
          body: "Output returns as input before the audience sees why.",
        },
        {
          action: "Expose the midpoint reversal",
          title: "The midpoint changes direction",
          body: "A clean sequence becomes a living loop.",
        },
        {
          action: "Hold the feedback as the new center",
          title: "Memory enters the frame",
          body: "The system has a past now, and the past changes the next move.",
        },
      ],
    },
    zh: {
      act: "第三幕",
      kicker: "中点回环",
      title: "反馈改变路径",
      subtitle: "系统不再像直线，而开始记住自己。",
      credit: "反馈回路 / 画面 03",
      metadataTitle: "中点",
      beats: [
        {
          action: "把路径转为回环",
          title: "线条折返",
          body: "输出在原因显明之前，先作为输入回到系统。",
        },
        {
          action: "揭示中点反转",
          title: "中点改变方向",
          body: "干净的顺序，变成有生命的循环。",
        },
        {
          action: "把反馈固定为新的中心",
          title: "记忆进入画面",
          body: "系统拥有过去，过去改变下一步。",
        },
      ],
    },
  },
  4: {
    en: {
      act: "Act IV",
      kicker: "Reveal",
      title: "The Rule Shows Itself",
      subtitle: "Patterns stop looking accidental once the hidden rule appears.",
      credit: "Rule Exposure / Frame 04",
      metadataTitle: "Reveal",
      beats: [
        {
          action: "Let repeated motion reveal structure",
          title: "The pattern holds",
          body: "What looked like noise now repeats with intention.",
        },
        {
          action: "Name the hidden rule",
          title: "The rule is visible",
          body: "The system has been editing the input the whole time.",
        },
        {
          action: "Show the rule controlling the next scene",
          title: "The reveal points forward",
          body: "Once seen, the rule becomes impossible to unsee.",
        },
      ],
    },
    zh: {
      act: "第四幕",
      kicker: "规则显影",
      title: "规则现身",
      subtitle: "隐藏规则出现之后，模式不再像偶然。",
      credit: "规则曝光 / 画面 04",
      metadataTitle: "揭示",
      beats: [
        {
          action: "让重复运动显出结构",
          title: "模式稳定下来",
          body: "之前像噪声的东西，现在带着意图重复。",
        },
        {
          action: "命名隐藏规则",
          title: "规则可见",
          body: "系统一直在改写输入，只是刚刚被看见。",
        },
        {
          action: "展示规则控制下一幕",
          title: "揭示指向后方",
          body: "一旦看见，就无法再假装没看见。",
        },
      ],
    },
  },
  5: {
    en: {
      act: "Act V",
      kicker: "End Card",
      title: "The Loop Keeps Memory",
      subtitle: "The system exits changed, carrying the trace of every act.",
      credit: "End State / Frame 05",
      metadataTitle: "End Card",
      beats: [
        {
          action: "Resolve the loop without closing it",
          title: "The loop remains open",
          body: "Endings in systems are checkpoints, not curtains.",
        },
        {
          action: "Show memory as the final artifact",
          title: "The trace is stored",
          body: "The next input will meet a system that has already learned.",
        },
        {
          action: "Hold the final title card",
          title: "The end card holds",
          body: "Five acts later, the machine is quieter and less innocent.",
        },
      ],
    },
    zh: {
      act: "第五幕",
      kicker: "终幕卡",
      title: "循环留下记忆",
      subtitle: "系统带着每一幕的痕迹离场。",
      credit: "结束状态 / 画面 05",
      metadataTitle: "终幕",
      beats: [
        {
          action: "解决回环但不关闭它",
          title: "循环仍然打开",
          body: "系统里的结束是检查点，不是落幕。",
        },
        {
          action: "把记忆展示为最终产物",
          title: "痕迹被存下",
          body: "下一次输入，会遇到已经学过一次的系统。",
        },
        {
          action: "停住最后的标题卡",
          title: "终幕卡停住",
          body: "五幕之后，机器更安静，也不再天真。",
        },
      ],
    },
  },
};

const TONE_CLASS_BY_SCENE: Record<SceneId, string> = {
  1: styles.toneOne,
  2: styles.toneTwo,
  3: styles.toneThree,
  4: styles.toneFour,
  5: styles.toneFive,
};

const ALIGN_CLASS_BY_SCENE: Record<SceneId, string> = {
  1: styles.alignCenter,
  2: styles.alignLeft,
  3: styles.alignLeft,
  4: styles.alignRight,
  5: styles.alignCenter,
};

function useFonts() {
  useEffect(() => {
    const id = "style-38-five-acts-system-v2-fonts";
    if (document.getElementById(id)) return;

    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Inter+Tight:wght@400;500;600;700&family=Noto+Serif+SC:wght@500;700&display=swap";
    document.head.appendChild(link);
  }, []);
}

function clampBeat(beat: number, max: number) {
  return Math.max(0, Math.min(beat, max));
}

function getSceneCopy(sceneId: number, language: Language) {
  const safeScene = SCENE_IDS.includes(sceneId as SceneId)
    ? (sceneId as SceneId)
    : 1;
  return SCENES[safeScene][language];
}

function getMetadata(lang: Language): StyleMetadata {
  return {
    id: "widescreen-title-card",
    band: "contemporary-digital",
    name: lang === "zh" ? "宽银幕标题卡" : "Widescreen Title Card",
    theme: lang === "zh" ? "系统五幕" : "Five Acts of a System",
    densityLabel: lang === "zh" ? "稀疏电影感" : "Sparse Cinematic",
    heroScene: 1,
    colors: {
      bg: "#050403",
      ink: "#f6ead8",
      panel: "#17100b",
    },
    typography: {
      header: "Cormorant Garamond 600",
      body: "Inter Tight 500",
    },
    tags: [
      "cinematic",
      "letterbox",
      "title-card",
      "sparse",
      "warm-black",
      "contemporary-digital",
    ],
    fonts: ["Cormorant Garamond", "Inter Tight", "cjk:Noto Serif SC"],
    scenes: SCENE_IDS.map((id) => {
      const copy = SCENES[id][lang];
      return {
        id,
        title: copy.metadataTitle,
        beats: copy.beats.map((beatCopy, beatId) => ({
          id: beatId,
          action: beatCopy.action,
          title: beatCopy.title,
          body: beatCopy.body,
        })),
      };
    }),
  };
}

function renderMotif(sceneId: SceneId) {
  if (sceneId === 1) {
    return (
      <svg className={styles.motif} viewBox="0 0 100 60" aria-hidden="true">
        <path className={styles.motifSoft} d="M8 43 C24 13 52 11 90 31" />
        <path className={styles.motifFine} d="M15 38 C35 30 55 30 79 21" />
        <circle className={styles.motifPoint} cx="51" cy="26" r="3" />
      </svg>
    );
  }

  if (sceneId === 2) {
    return (
      <svg className={styles.motif} viewBox="0 0 100 60" aria-hidden="true">
        <path className={styles.motifSoft} d="M7 36 L88 21" />
        <path className={styles.motifFine} d="M73 13 L88 21 L76 34" />
        <circle className={styles.motifPoint} cx="20" cy="34" r="3" />
      </svg>
    );
  }

  if (sceneId === 3) {
    return (
      <svg className={styles.motif} viewBox="0 0 100 60" aria-hidden="true">
        <path
          className={styles.motifSoft}
          d="M30 31 C30 13 69 13 69 31 C69 49 30 49 30 31"
        />
        <path className={styles.motifFine} d="M65 24 L72 31 L65 38" />
        <circle className={styles.motifPoint} cx="50" cy="31" r="3" />
      </svg>
    );
  }

  if (sceneId === 4) {
    return (
      <svg className={styles.motif} viewBox="0 0 100 60" aria-hidden="true">
        <path className={styles.motifSoft} d="M17 45 L50 12 L83 45" />
        <path className={styles.motifFine} d="M50 12 L50 47" />
        <circle className={styles.motifPoint} cx="50" cy="12" r="3" />
      </svg>
    );
  }

  return (
    <svg className={styles.motif} viewBox="0 0 100 60" aria-hidden="true">
      <path
        className={styles.motifSoft}
        d="M23 31 C30 13 70 13 77 31 C70 49 30 49 23 31"
      />
      <path className={styles.motifFine} d="M39 31 C43 23 57 23 61 31" />
      <circle className={styles.motifPoint} cx="50" cy="31" r="3" />
    </svg>
  );
}

function BeatMarkers({
  activeBeat,
  beats,
  language,
}: {
  activeBeat: number;
  beats: BeatCopy[];
  language: Language;
}) {
  return (
    <div
      className={styles.beatMarkers}
      aria-label={language === "zh" ? "节拍进度" : "Beat progress"}
      data-beat-layout-item="true"
    >
      {beats.map((beat, index) => (
        <span
          key={beat.title}
          className={[
            styles.beatMark,
            index <= activeBeat ? styles.beatMarkLit : "",
            index === activeBeat ? styles.beatMarkActive : "",
          ]
            .filter(Boolean)
            .join(" ")}
          aria-current={index === activeBeat ? "step" : undefined}
        />
      ))}
    </div>
  );
}

function ScenePanel({
  sceneId,
  beat,
  language,
  isActive,
}: {
  sceneId: SceneId;
  beat: number;
  language: Language;
  isActive: boolean;
}) {
  const content = SCENES[sceneId][language];
  const activeBeat = clampBeat(beat, content.beats.length - 1);

  return (
    <section
      className={[
        styles.scene,
        TONE_CLASS_BY_SCENE[sceneId],
        ALIGN_CLASS_BY_SCENE[sceneId],
        isActive ? styles.activeScene : "",
      ]
        .filter(Boolean)
        .join(" ")}
      data-scene={sceneId}
      data-active-scene-content={isActive ? "true" : "false"}
    >
      <div className={styles.screen} data-beat-layout-item="true">
        <div className={styles.still} />
        <div className={styles.vignette} />
        {renderMotif(sceneId)}
        <div
          className={styles.copy}
          data-beat-layout-container="true"
          data-beat-layout-mode="reserved"
        >
          <p className={styles.kicker} data-beat-layout-item="true">
            {content.act} / {content.kicker}
          </p>
          <div className={styles.titleBlock} data-beat-layout-item="true">
            <h1>{content.title}</h1>
            <p>{content.subtitle}</p>
          </div>
          <div className={styles.beatSlots} data-beat-layout-item="true">
            {content.beats.map((beatCopy, index) => (
              <article
                key={beatCopy.title}
                className={[
                  styles.beatSlot,
                  index <= activeBeat ? styles.beatVisible : styles.beatHidden,
                ]
                  .filter(Boolean)
                  .join(" ")}
                aria-hidden={index <= activeBeat ? undefined : true}
                data-beat-layout-item="true"
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{beatCopy.title}</strong>
                <p>{beatCopy.body}</p>
              </article>
            ))}
          </div>
          <div className={styles.creditLine} data-beat-layout-item="true">
            <span>{content.credit}</span>
            <BeatMarkers
              activeBeat={activeBeat}
              beats={content.beats}
              language={language}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function LetterboxCueMarks({
  scene,
  language,
  onNavigate,
}: {
  scene: number;
  language: Language;
  onNavigate?: (scene: number, beat: number) => void;
}) {
  return (
    <nav
      className={styles.cueNav}
      aria-label={language === "zh" ? "宽银幕场景导航" : "Letterbox scene navigation"}
    >
      {SCENE_IDS.map((sceneId) => {
        const copy = SCENES[sceneId][language];
        const isCurrent = sceneId === scene;

        return (
          <button
            key={sceneId}
            type="button"
            className={[styles.cueButton, isCurrent ? styles.cueButtonActive : ""]
              .filter(Boolean)
              .join(" ")}
            aria-current={isCurrent ? "step" : undefined}
            aria-label={
              language === "zh"
                ? `跳转到${copy.metadataTitle}`
                : `Go to ${copy.metadataTitle}`
            }
            onClick={() => onNavigate?.(sceneId, 0)}
          >
            <span className={styles.cueStem} />
            <span className={styles.cueLabel}>{sceneId}</span>
          </button>
        );
      })}
    </nav>
  );
}

export default function FiveActsSystemV2({
  scene,
  beat,
  language,
  isThumbnail,
  reducedMotion,
  onNavigate,
}: BespokeStyleProps) {
  useFonts();
  const motionOff = reducedMotion || isThumbnail;
  const safeScene = SCENE_IDS.includes(scene as SceneId) ? scene : 1;
  const copy = getSceneCopy(safeScene, language);

  return (
    <main
      className={[
        styles.root,
        motionOff ? styles.motionOff : "",
        isThumbnail ? styles.thumbnail : "",
      ]
        .filter(Boolean)
        .join(" ")}
      data-style-id="38"
      data-topic-origin="curated"
      data-current-scene={safeScene}
      aria-label={copy.title}
    >
      <SpatialSceneTrack
        scene={safeScene}
        beat={beat}
        transitionKind="fade"
        transitionMap={TRANSITION_MAP}
        transitionDurationMs={760}
        reducedMotion={motionOff}
        beatLayoutModes={BEAT_LAYOUT_MODES}
        className={styles.track}
        renderScene={(trackScene, trackBeat, isActive) => (
          <ScenePanel
            sceneId={trackScene as SceneId}
            beat={trackBeat}
            language={language}
            isActive={isActive}
          />
        )}
      />
      <div className={styles.topLetterbox} aria-hidden="true" />
      <div className={styles.bottomLetterbox} aria-hidden="true" />
      {!isThumbnail && (
        <LetterboxCueMarks
          scene={safeScene}
          language={language}
          onNavigate={onNavigate}
        />
      )}
    </main>
  );
}

export { getMetadata };

export const fiveActsSystemTopic = defineStyleTopic({
  id: "system-acts",
  topic: {
    en: "System Acts",
    zh: "系统五幕",
  },
  model: "GPT-5.5",
  component: FiveActsSystemV2,
  getMetadata,
});

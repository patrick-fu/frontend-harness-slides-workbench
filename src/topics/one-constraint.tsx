import { useEffect } from "react";
import type { CSSProperties } from "react";
import {
  defineTopic,
  type TopicDefinition,
  type TopicStageProps,
} from "../domain/topic";
import { useFLIP } from "../hooks/useFLIP";
import SpatialSceneTrack from "../styles/SpatialSceneTrack";
import type { SceneTransitionMap } from "../styles/SpatialSceneTrack";
import styles from "./one-constraint.module.css";

type Lang = TopicStageProps["language"];
type SceneId = 1 | 2 | 3 | 4 | 5;

interface BeatCopy {
  action: string;
  title: string;
  body: string;
}

interface SceneCopy {
  title: string;
  kicker: string;
  support: string;
  words: string[];
  beats: BeatCopy[];
}

const SCENE_IDS: SceneId[] = [1, 2, 3, 4, 5];
const BEAT_LAYOUT_MODES = {
  1: "motion",
  2: "motion",
  3: "motion",
  4: "motion",
  5: "motion",
} as const;

const TRANSITION_SCORE = {
  "1->2": "glitch",
  "2->3": "slide-y",
  "3->4": "scale-fade",
  "4->5": "hard-cut",
} as const satisfies TopicDefinition["transitionScore"];

const TRANSITION_MAP: SceneTransitionMap = TRANSITION_SCORE;

const SCENES: Record<SceneId, Record<Lang, SceneCopy>> = {
  1: {
    en: {
      title: "Loud Constraint",
      kicker: "Constraint first",
      support: "Stop optimizing the room. Name the wall.",
      words: ["ONE", "CONSTRAINT", "WINS"],
      beats: [
        {
          action: "One fixed wall enters",
          title: "ONE",
          body: "A single boundary owns the decision.",
        },
        {
          action: "Constraint stacks into the field",
          title: "CONSTRAINT",
          body: "The boundary becomes louder than the options.",
        },
        {
          action: "The winning word lands",
          title: "WINS",
          body: "Everything else moves around it.",
        },
      ],
    },
    zh: {
      title: "响亮约束",
      kicker: "先定约束",
      support: "别优化全局。先说墙在哪。",
      words: ["一个", "约束", "赢"],
      beats: [
        {
          action: "唯一边界入场",
          title: "一个",
          body: "一个边界先拥有决策权。",
        },
        {
          action: "约束压满画面",
          title: "约束",
          body: "边界比所有选项更响。",
        },
        {
          action: "胜出词落下",
          title: "赢",
          body: "其他动作都围着它调整。",
        },
      ],
    },
  },
  2: {
    en: {
      title: "False Options",
      kicker: "Not a menu",
      support: "More choices can still be avoidance.",
      words: ["FASTER", "BIGGER", "LOUDER", "CHEAPER"],
      beats: [
        {
          action: "Speed option appears",
          title: "FASTER",
          body: "Speed sounds decisive until the wall is unnamed.",
        },
        {
          action: "Scale option appears",
          title: "BIGGER",
          body: "Scale is not a decision by itself.",
        },
        {
          action: "Volume option appears",
          title: "LOUDER",
          body: "Noise does not choose the path.",
        },
        {
          action: "False menu is crossed out",
          title: "CHEAPER",
          body: "The menu loses to the constraint.",
        },
      ],
    },
    zh: {
      title: "假选项",
      kicker: "不是菜单",
      support: "选项更多，也可能只是在躲。",
      words: ["更快", "更大", "更响", "更省"],
      beats: [
        {
          action: "速度选项出现",
          title: "更快",
          body: "没说边界时，速度只是姿态。",
        },
        {
          action: "规模选项出现",
          title: "更大",
          body: "规模本身不是决策。",
        },
        {
          action: "音量选项出现",
          title: "更响",
          body: "噪声不会替你选路。",
        },
        {
          action: "假菜单被划掉",
          title: "更省",
          body: "菜单输给约束。",
        },
      ],
    },
  },
  3: {
    en: {
      title: "Compressed Proof",
      kicker: "Proof in one breath",
      support: "Fix the wall. The plan compresses.",
      words: ["SCOPE", "TIME", "QUALITY", "WALL"],
      beats: [
        {
          action: "Scope enters the proof",
          title: "SCOPE",
          body: "Scope cannot float alone.",
        },
        {
          action: "Time squeezes the equation",
          title: "TIME",
          body: "Time applies pressure.",
        },
        {
          action: "Quality meets the fixed wall",
          title: "QUALITY",
          body: "Quality survives when the wall is explicit.",
        },
        {
          action: "The equation collapses to one wall",
          title: "WALL",
          body: "The proof has only one winner.",
        },
      ],
    },
    zh: {
      title: "压缩证明",
      kicker: "一口气证明",
      support: "墙一固定，计划自动收缩。",
      words: ["范围", "时间", "质量", "墙"],
      beats: [
        {
          action: "范围进入证明",
          title: "范围",
          body: "范围不能独自悬空。",
        },
        {
          action: "时间挤压等式",
          title: "时间",
          body: "时间开始施压。",
        },
        {
          action: "质量遇到固定墙",
          title: "质量",
          body: "边界说清，质量才守得住。",
        },
        {
          action: "等式坍缩成一堵墙",
          title: "墙",
          body: "证明只剩一个赢家。",
        },
      ],
    },
  },
  4: {
    en: {
      title: "Punchline",
      kicker: "Mic drop",
      support: "Pick the wall. Then move.",
      words: ["THE WALL", "CHOOSES", "THE PLAN"],
      beats: [
        {
          action: "Wall line slams in",
          title: "THE WALL",
          body: "The fixed constraint becomes the subject.",
        },
        {
          action: "Choice line replaces debate",
          title: "CHOOSES",
          body: "The room stops ranking every option.",
        },
        {
          action: "Plan line lands",
          title: "THE PLAN",
          body: "Execution gets its shape.",
        },
      ],
    },
    zh: {
      title: "落点金句",
      kicker: "一句落地",
      support: "选那堵墙。然后开动。",
      words: ["墙", "替你", "选计划"],
      beats: [
        {
          action: "墙这一行砸入",
          title: "墙",
          body: "固定约束成为主语。",
        },
        {
          action: "选择行替换争论",
          title: "替你",
          body: "会议停止给所有选项排序。",
        },
        {
          action: "计划行落地",
          title: "选计划",
          body: "执行终于有了形状。",
        },
      ],
    },
  },
  5: {
    en: {
      title: "Afterimage",
      kicker: "Leave the mark",
      support: "One constraint keeps echoing after the noise cuts.",
      words: ["CONSTRAINT", "WINS"],
      beats: [
        {
          action: "Afterimage holds",
          title: "CONSTRAINT",
          body: "The loud field cuts to a retained mark.",
        },
        {
          action: "Final echo burns in",
          title: "WINS",
          body: "The audience leaves with one rule.",
        },
      ],
    },
    zh: {
      title: "残影",
      kicker: "留下印记",
      support: "噪声切断后，一个约束继续回响。",
      words: ["约束", "赢"],
      beats: [
        {
          action: "残影保持",
          title: "约束",
          body: "响亮画面切成保留印记。",
        },
        {
          action: "最终回声烙住",
          title: "赢",
          body: "观众只带走一条规则。",
        },
      ],
    },
  },
};

const sceneThemes: Record<SceneId, string> = {
  1: styles.themeBlack,
  2: styles.themeCream,
  3: styles.themeRed,
  4: styles.themeBlack,
  5: styles.themeCream,
};

function useFonts() {
  useEffect(() => {
    const id = "one-constraint-fonts";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Anton&family=Noto+Sans+SC:wght@700;900&display=swap";
    document.head.appendChild(link);
  }, []);
}

function clampScene(scene: number): SceneId {
  return SCENE_IDS.includes(scene as SceneId) ? (scene as SceneId) : 1;
}

function clampBeat(sceneId: SceneId, beat: number, language: Lang): number {
  const max = SCENES[sceneId][language].beats.length - 1;
  return Math.min(Math.max(beat, 0), max);
}

function visibleStyle(index: number): CSSProperties {
  return { "--delay": `${index * 0.06}s` } as CSSProperties;
}

function joinClasses(...classes: Array<string | false | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

function WordHit({
  children,
  visible,
  accent,
  ghost,
  struck,
  index,
}: {
  children: string;
  visible: boolean;
  accent?: boolean;
  ghost?: boolean;
  struck?: boolean;
  index: number;
}) {
  return (
    <div
      className={joinClasses(
        styles.wordHit,
        visible ? styles.visibleWord : styles.hiddenWord,
        accent && styles.accentWord,
        ghost && styles.ghostWord,
        struck && styles.struckWord,
      )}
      style={visibleStyle(index)}
      data-beat-layout-item="true"
      data-visible={visible ? "true" : "false"}
    >
      {children}
    </div>
  );
}

function BeatNav({
  activeScene,
  activeBeat,
  language,
  isThumbnail,
  onNavigate,
}: {
  activeScene: SceneId;
  activeBeat: number;
  language: Lang;
  isThumbnail: boolean;
  onNavigate?: (scene: number, beat: number) => void;
}) {
  if (isThumbnail) return null;

  return (
    <nav
      className={styles.beatNav}
      aria-label={language === "zh" ? "场景导航" : "Scene navigation"}
      data-topic-navigation="true"
      data-navigation-geometry="card-miniature"
      data-navigation-carrier="constraint-beat-stamps"
      data-navigation-invocation="persistent"
      data-navigation-feedback="material-color-change"
      onPointerDown={(event) => event.stopPropagation()}
    >
      {SCENE_IDS.map((sceneId) => {
        const beatCount = SCENES[sceneId][language].beats.length;
        const isActive = sceneId === activeScene;
        return (
          <button
            key={sceneId}
            type="button"
            className={joinClasses(styles.navStamp, isActive && styles.navActive)}
            onClick={(event) => {
              event.stopPropagation();
              onNavigate?.(sceneId, 0);
            }}
            aria-current={isActive ? "step" : undefined}
          >
            <span className={styles.navScene}>
              {language === "zh" ? `拍${sceneId}` : `B${sceneId}`}
            </span>
            <span className={styles.navBeat}>
              {isActive ? `${activeBeat + 1}/${beatCount}` : `${beatCount}`}
            </span>
          </button>
        );
      })}
    </nav>
  );
}

function ScenePanel({
  sceneId,
  beat,
  language,
  isActive,
  shouldReduceMotion,
}: {
  sceneId: SceneId;
  beat: number;
  language: Lang;
  isActive: boolean;
  shouldReduceMotion: boolean;
}) {
  const safeBeat = clampBeat(sceneId, beat, language);
  const content = SCENES[sceneId][language];
  const { ref } = useFLIP<HTMLDivElement>({
    watch: [sceneId, safeBeat, language],
    disabled: shouldReduceMotion || !isActive,
    duration: 460,
    easing: "cubic-bezier(0.2, 0.9, 0.12, 1)",
    selector: '[data-beat-layout-item="true"]',
  });

  return (
    <section
      className={joinClasses(styles.scene, sceneThemes[sceneId])}
      data-scene={sceneId}
      aria-label={content.title}
    >
      <div
        ref={ref}
        className={joinClasses(styles.sceneInner, styles[`scene${sceneId}`])}
        data-beat-layout-container="true"
        data-beat-layout-mode="motion"
      >
        <div className={styles.kicker} data-beat-layout-item="true">
          {content.kicker}
        </div>
        {sceneId === 1 && <LoudConstraint content={content} beat={safeBeat} />}
        {sceneId === 2 && <FalseOptions content={content} beat={safeBeat} />}
        {sceneId === 3 && <CompressedProof content={content} beat={safeBeat} />}
        {sceneId === 4 && <Punchline content={content} beat={safeBeat} />}
        {sceneId === 5 && <Afterimage content={content} beat={safeBeat} />}
        <div className={styles.support} data-beat-layout-item="true">
          {content.support}
        </div>
        <BeatMeter count={content.beats.length} activeBeat={safeBeat} />
      </div>
    </section>
  );
}

function LoudConstraint({
  content,
  beat,
}: {
  content: SceneCopy;
  beat: number;
}) {
  return (
    <div className={styles.loudStack}>
      {content.words.map((word, index) => (
        <WordHit
          key={word}
          index={index}
          visible={beat >= index}
          accent={index === 2}
        >
          {word}
        </WordHit>
      ))}
    </div>
  );
}

function FalseOptions({
  content,
  beat,
}: {
  content: SceneCopy;
  beat: number;
}) {
  return (
    <div className={styles.optionGrid}>
      {content.words.map((word, index) => (
        <WordHit
          key={word}
          index={index}
          visible={beat >= index}
          struck={beat >= 3}
          ghost={index !== 3 && beat >= 3}
        >
          {word}
        </WordHit>
      ))}
      <div
        className={joinClasses(
          styles.replaceStamp,
          beat >= 3 ? styles.visibleWord : styles.hiddenWord,
        )}
        style={visibleStyle(4)}
        data-beat-layout-item="true"
      >
        {content.beats[3].body}
      </div>
    </div>
  );
}

function CompressedProof({
  content,
  beat,
}: {
  content: SceneCopy;
  beat: number;
}) {
  return (
    <div className={styles.proofStrip}>
      {content.words.map((word, index) => (
        <div
          key={word}
          className={joinClasses(
            styles.proofToken,
            beat >= index ? styles.visibleWord : styles.hiddenWord,
            index === 3 && styles.proofWinner,
          )}
          style={visibleStyle(index)}
          data-beat-layout-item="true"
        >
          <span>{word}</span>
        </div>
      ))}
    </div>
  );
}

function Punchline({
  content,
  beat,
}: {
  content: SceneCopy;
  beat: number;
}) {
  return (
    <div className={styles.punchBlock}>
      {content.words.map((word, index) => (
        <WordHit
          key={word}
          index={index}
          visible={beat >= index}
          accent={index === 1}
        >
          {word}
        </WordHit>
      ))}
    </div>
  );
}

function Afterimage({
  content,
  beat,
}: {
  content: SceneCopy;
  beat: number;
}) {
  const echoes = [0, 1, 2, 3];
  return (
    <div className={styles.afterField}>
      {echoes.map((echo) => (
        <div
          key={echo}
          className={joinClasses(
            styles.afterEcho,
            beat >= 0 ? styles.visibleWord : styles.hiddenWord,
          )}
          style={{ "--echo": echo, "--delay": `${echo * 0.05}s` } as CSSProperties}
          data-beat-layout-item="true"
          aria-hidden="true"
        >
          {content.words[0]}
        </div>
      ))}
      <WordHit index={4} visible={beat >= 1} accent>
        {content.words[1]}
      </WordHit>
    </div>
  );
}

function BeatMeter({
  count,
  activeBeat,
}: {
  count: number;
  activeBeat: number;
}) {
  return (
    <div className={styles.beatMeter} aria-hidden="true" data-beat-layout-item="true">
      {Array.from({ length: count }, (_, index) => (
        <span
          key={index}
          className={joinClasses(
            styles.beatStamp,
            index <= activeBeat && styles.beatStampActive,
          )}
        >
          {`0${index + 1}`}
        </span>
      ))}
    </div>
  );
}

function createMetadata(lang: Lang): TopicDefinition["metadata"]["en"] {
  return {
    theme: lang === "zh" ? "一个约束赢" : "One Constraint Wins",
    densityLabel: lang === "zh" ? "海报冲击" : "Poster Punch",
    heroScene: 4,
    colors: {
      bg: "#080706",
      ink: "#fff4dc",
      panel: "#f0441b",
    },
    typography: {
      header: "Anton 900",
      body: "Noto Sans SC 700",
    },
    tags: ["kinetic", "typographic", "poster", "high-contrast", "motion"],
    fonts: ["Anton", "cjk:Noto Sans SC"],
    scenes: SCENE_IDS.map((sceneId) => {
      const scene = SCENES[sceneId][lang];
      return {
        id: sceneId,
        title: scene.title,
        beats: scene.beats.map((beat, index) => ({
          id: index,
          action: beat.action,
          title: beat.title,
          body: beat.body,
        })),
      };
    }),
  };
}

const metadata = {
  en: createMetadata("en"),
  zh: createMetadata("zh"),
} satisfies TopicDefinition["metadata"];

function TopicStage({
  scene,
  beat,
  language,
  isThumbnail,
  reducedMotion,
  onNavigate,
}: TopicStageProps) {
  useFonts();
  const safeScene = clampScene(scene);
  const safeBeat = clampBeat(safeScene, beat, language);
  const shouldReduceMotion = reducedMotion || isThumbnail;

  return (
    <div
      className={joinClasses(
        styles.root,
        shouldReduceMotion && styles.reducedMotion,
        isThumbnail && styles.thumbnail,
      )}
    >
      <SpatialSceneTrack
        scene={safeScene}
        beat={safeBeat}
        sceneIds={SCENE_IDS}
        transitionKind="scale-fade"
        transitionMap={TRANSITION_MAP}
        transitionDurationMs={560}
        reducedMotion={shouldReduceMotion}
        beatLayoutModes={BEAT_LAYOUT_MODES}
        className={styles.track}
        renderScene={(sceneId, sceneBeat, isActive) => (
          <ScenePanel
            sceneId={clampScene(sceneId)}
            beat={sceneBeat}
            language={language}
            isActive={isActive}
            shouldReduceMotion={shouldReduceMotion}
          />
        )}
      />
      <BeatNav
        activeScene={safeScene}
        activeBeat={safeBeat}
        language={language}
        isThumbnail={isThumbnail}
        onNavigate={onNavigate}
      />
    </div>
  );
}

export default defineTopic({
  id: "one-constraint",
  styleId: "kinetic-type-punchline",
  title: {
    en: "One Constraint",
    zh: "一个约束",
  },
  modelId: "GPT 5.5",
  Stage: TopicStage,
  metadata,
  navigation: {
    geometry: "card-miniature",
    carrier: "constraint-beat-stamps",
    invocation: "persistent",
    feedback: "material-color-change",
  },
  transitionScore: TRANSITION_SCORE,
  evidence: {
    kind: "illustrative",
    boundary: {
      en: "Illustrative decision scenario: options, trade-offs, and punchlines are presentation devices, not measured findings.",
      zh: "示例决策场景：其中选项、权衡和金句均为演示手法，并非实测发现。",
    },
    display: "envelope",
  },
});

import { useEffect } from "react";
import type { CSSProperties } from "react";
import { useFLIP } from "../hooks/useFLIP";
import type { BespokeStyleProps, StyleMetadata } from "../types";
import SpatialSceneTrack from "./SpatialSceneTrack";
import type {
  BeatLayoutMode,
  SceneTransitionMap,
} from "./SpatialSceneTrack";
import { defineStyleVersion } from "./version";
import styles from "./39-derive-shortcut-v2.module.css";

type Language = "en" | "zh";
type SceneId = 1 | 2 | 3 | 4 | 5;
type StepVariant = "formula" | "note" | "answer" | "question";
type ChalkTone = "white" | "yellow" | "mint";

interface ChalkStep {
  id: string;
  showFrom: number;
  text: string;
  detail: string;
  variant: StepVariant;
  tone: ChalkTone;
}

interface SceneCopy {
  title: string;
  subtitle: string;
  label: string;
  symbol: string;
  marginNote: string;
  steps: ChalkStep[];
}

type ChalkStyle = CSSProperties & {
  "--chalk-delay"?: string;
};

const SCENE_IDS: SceneId[] = [1, 2, 3, 4, 5];
const TRANSITION_MAP: SceneTransitionMap = {
  "1->2": "wipe",
  "2->3": "slide-y",
  "3->4": "fade",
  "4->5": "hard-cut",
};
const BEAT_LAYOUT_MODES: Record<SceneId, BeatLayoutMode> = {
  1: "motion",
  2: "motion",
  3: "motion",
  4: "motion",
  5: "motion",
};

const COPY: Record<SceneId, Record<Language, SceneCopy>> = {
  1: {
    en: {
      title: "What are we really adding?",
      subtitle: "The long route shows the work. It also repeats one move.",
      label: "question",
      symbol: "?",
      marginNote: "Find the invariant first.",
      steps: [
        {
          id: "sum",
          showFrom: 0,
          text: "8 + 8 + 8 + 8",
          detail: "four identical addends",
          variant: "formula",
          tone: "white",
        },
        {
          id: "repeat",
          showFrom: 1,
          text: "Nothing new happens after the first +8.",
          detail: "same value, same operation",
          variant: "note",
          tone: "yellow",
        },
        {
          id: "target",
          showFrom: 2,
          text: "A shortcut must keep count × value.",
          detail: "compress the route, not the meaning",
          variant: "answer",
          tone: "mint",
        },
      ],
    },
    zh: {
      title: "我们到底在加什么？",
      subtitle: "长做法能展示过程，也暴露了同一个动作在重复。",
      label: "问题",
      symbol: "?",
      marginNote: "先找不变的东西。",
      steps: [
        {
          id: "sum",
          showFrom: 0,
          text: "8 + 8 + 8 + 8",
          detail: "四个完全相同的加数",
          variant: "formula",
          tone: "white",
        },
        {
          id: "repeat",
          showFrom: 1,
          text: "第一个 +8 之后，没有新动作。",
          detail: "数值相同，操作相同",
          variant: "note",
          tone: "yellow",
        },
        {
          id: "target",
          showFrom: 2,
          text: "捷径必须保留：次数 × 数值。",
          detail: "缩短路径，不改变含义",
          variant: "answer",
          tone: "mint",
        },
      ],
    },
  },
  2: {
    en: {
      title: "Name the pattern before shrinking it",
      subtitle: "A symbol is allowed only after the repeated part is visible.",
      label: "formula",
      symbol: "n·a",
      marginNote: "Count the marks, then replace them.",
      steps: [
        {
          id: "long",
          showFrom: 0,
          text: "a + a + ... + a",
          detail: "the same addend appears again",
          variant: "formula",
          tone: "white",
        },
        {
          id: "count",
          showFrom: 1,
          text: "n copies of a",
          detail: "the dots hide repetition, not uncertainty",
          variant: "note",
          tone: "yellow",
        },
        {
          id: "product",
          showFrom: 2,
          text: "n · a",
          detail: "same total, fewer written steps",
          variant: "formula",
          tone: "mint",
        },
        {
          id: "rule",
          showFrom: 3,
          text: "repeated addition = count × addend",
          detail: "the shortcut is just named repetition",
          variant: "answer",
          tone: "mint",
        },
      ],
    },
    zh: {
      title: "先命名模式，再把它缩短",
      subtitle: "只有重复部分已经看清楚，符号才有资格出现。",
      label: "公式",
      symbol: "n·a",
      marginNote: "先数记号，再替换记号。",
      steps: [
        {
          id: "long",
          showFrom: 0,
          text: "a + a + ... + a",
          detail: "同一个加数反复出现",
          variant: "formula",
          tone: "white",
        },
        {
          id: "count",
          showFrom: 1,
          text: "n 个 a",
          detail: "省略号藏住的是重复，不是不确定",
          variant: "note",
          tone: "yellow",
        },
        {
          id: "product",
          showFrom: 2,
          text: "n · a",
          detail: "总量相同，书写更短",
          variant: "formula",
          tone: "mint",
        },
        {
          id: "rule",
          showFrom: 3,
          text: "重复加法 = 次数 × 加数",
          detail: "捷径只是给重复起了名字",
          variant: "answer",
          tone: "mint",
        },
      ],
    },
  },
  3: {
    en: {
      title: "Work one example out loud",
      subtitle: "The shortcut earns trust only when it lands on the same number.",
      label: "worked example",
      symbol: "32",
      marginNote: "Check it once by hand.",
      steps: [
        {
          id: "example",
          showFrom: 0,
          text: "8 + 8 + 8 + 8",
          detail: "write the long route",
          variant: "formula",
          tone: "white",
        },
        {
          id: "count",
          showFrom: 1,
          text: "4 copies",
          detail: "count the repeated marks",
          variant: "note",
          tone: "yellow",
        },
        {
          id: "multiply",
          showFrom: 2,
          text: "4 · 8",
          detail: "replace repeated addition",
          variant: "formula",
          tone: "mint",
        },
        {
          id: "result",
          showFrom: 3,
          text: "= 32",
          detail: "same answer, shorter route",
          variant: "answer",
          tone: "mint",
        },
      ],
    },
    zh: {
      title: "把一个例子算出来",
      subtitle: "捷径只有抵达同一个数字，才值得相信。",
      label: "例题",
      symbol: "32",
      marginNote: "先手算验一次。",
      steps: [
        {
          id: "example",
          showFrom: 0,
          text: "8 + 8 + 8 + 8",
          detail: "写出完整路径",
          variant: "formula",
          tone: "white",
        },
        {
          id: "count",
          showFrom: 1,
          text: "4 份",
          detail: "数重复出现的记号",
          variant: "note",
          tone: "yellow",
        },
        {
          id: "multiply",
          showFrom: 2,
          text: "4 · 8",
          detail: "用乘法替换重复加法",
          variant: "formula",
          tone: "mint",
        },
        {
          id: "result",
          showFrom: 3,
          text: "= 32",
          detail: "答案相同，路线更短",
          variant: "answer",
          tone: "mint",
        },
      ],
    },
  },
  4: {
    en: {
      title: "Simplify the work, not the idea",
      subtitle: "Cross out repeated writing only after the repeated meaning is safe.",
      label: "simplification",
      symbol: "4a",
      marginNote: "Erase labor, not logic.",
      steps: [
        {
          id: "expanded",
          showFrom: 0,
          text: "a + a + a + a",
          detail: "the board is doing the same job four times",
          variant: "formula",
          tone: "white",
        },
        {
          id: "compress",
          showFrom: 1,
          text: "4 copies → 4a",
          detail: "the count moves in front",
          variant: "formula",
          tone: "yellow",
        },
        {
          id: "unchanged",
          showFrom: 2,
          text: "No value changed; only the route got shorter.",
          detail: "this is the whole shortcut",
          variant: "answer",
          tone: "mint",
        },
      ],
    },
    zh: {
      title: "简化的是工作量，不是想法",
      subtitle: "只有含义已经安全，才能擦掉重复书写。",
      label: "化简",
      symbol: "4a",
      marginNote: "擦掉劳动，不擦逻辑。",
      steps: [
        {
          id: "expanded",
          showFrom: 0,
          text: "a + a + a + a",
          detail: "黑板在做四次同样的事",
          variant: "formula",
          tone: "white",
        },
        {
          id: "compress",
          showFrom: 1,
          text: "4 份 → 4a",
          detail: "次数移到前面",
          variant: "formula",
          tone: "yellow",
        },
        {
          id: "unchanged",
          showFrom: 2,
          text: "数值没有变；只是路径变短。",
          detail: "这就是整个捷径",
          variant: "answer",
          tone: "mint",
        },
      ],
    },
  },
  5: {
    en: {
      title: "Box the answer",
      subtitle: "Use the shortcut only when the addend stays unchanged.",
      label: "boxed answer",
      symbol: "□",
      marginNote: "The box is a promise: same total.",
      steps: [
        {
          id: "condition",
          showFrom: 0,
          text: "If the addend is unchanged",
          detail: "one value repeats",
          variant: "note",
          tone: "yellow",
        },
        {
          id: "count",
          showFrom: 1,
          text: "and it appears n times",
          detail: "one count explains the whole row",
          variant: "note",
          tone: "white",
        },
        {
          id: "box",
          showFrom: 2,
          text: "a + a + ... + a = n · a",
          detail: "shortcut = count × addend",
          variant: "answer",
          tone: "mint",
        },
      ],
    },
    zh: {
      title: "把答案框起来",
      subtitle: "只有加数保持不变时，才使用这个捷径。",
      label: "框出答案",
      symbol: "□",
      marginNote: "这个框承诺：总量不变。",
      steps: [
        {
          id: "condition",
          showFrom: 0,
          text: "如果加数不变",
          detail: "同一个数在重复",
          variant: "note",
          tone: "yellow",
        },
        {
          id: "count",
          showFrom: 1,
          text: "并且出现 n 次",
          detail: "一个次数解释整行",
          variant: "note",
          tone: "white",
        },
        {
          id: "box",
          showFrom: 2,
          text: "a + a + ... + a = n · a",
          detail: "捷径 = 次数 × 加数",
          variant: "answer",
          tone: "mint",
        },
      ],
    },
  },
};

const META: Record<Language, StyleMetadata["scenes"]> = {
  en: [
    {
      id: 1,
      title: "Question",
      beats: [
        {
          id: 0,
          action: "Put the repeated addition on the board.",
          title: "What are we really adding?",
          body: "The long route shows repeated identical addends.",
        },
        {
          id: 1,
          action: "Mark the repeated operation.",
          title: "The operation repeats",
          body: "Nothing new happens after the first addend.",
        },
        {
          id: 2,
          action: "State the shortcut target.",
          title: "Keep count times value",
          body: "A shortcut must preserve both count and addend.",
        },
      ],
    },
    {
      id: 2,
      title: "Formula",
      beats: [
        {
          id: 0,
          action: "Write the repeated-addition pattern.",
          title: "a plus a",
          body: "The same addend appears again and again.",
        },
        {
          id: 1,
          action: "Count the repeated addends.",
          title: "n copies",
          body: "The ellipsis hides repetition, not uncertainty.",
        },
        {
          id: 2,
          action: "Replace the row with multiplication.",
          title: "n times a",
          body: "The total is preserved in a shorter notation.",
        },
        {
          id: 3,
          action: "Name the rule.",
          title: "Repeated addition rule",
          body: "Repeated addition is count times addend.",
        },
      ],
    },
    {
      id: 3,
      title: "Worked Example",
      beats: [
        {
          id: 0,
          action: "Write the full example.",
          title: "Four eights",
          body: "The example starts as repeated addition.",
        },
        {
          id: 1,
          action: "Count the copies.",
          title: "Four copies",
          body: "The addend appears four times.",
        },
        {
          id: 2,
          action: "Compress to multiplication.",
          title: "Four times eight",
          body: "The repeated row becomes a product.",
        },
        {
          id: 3,
          action: "Show the matching result.",
          title: "Thirty-two",
          body: "The shortcut lands on the same answer.",
        },
      ],
    },
    {
      id: 4,
      title: "Simplification",
      beats: [
        {
          id: 0,
          action: "Expand the repeated row.",
          title: "Four a terms",
          body: "The long expression repeats the same work.",
        },
        {
          id: 1,
          action: "Move the count in front.",
          title: "Four copies become four a",
          body: "The count moves into coefficient position.",
        },
        {
          id: 2,
          action: "Explain what changed.",
          title: "Only the route changed",
          body: "The value is unchanged; the writing is shorter.",
        },
      ],
    },
    {
      id: 5,
      title: "Boxed Answer",
      beats: [
        {
          id: 0,
          action: "State the condition.",
          title: "Unchanged addend",
          body: "The shortcut is valid when one value repeats.",
        },
        {
          id: 1,
          action: "State the count.",
          title: "n times",
          body: "The addend appears n times.",
        },
        {
          id: 2,
          action: "Box the final identity.",
          title: "Repeated addition shortcut",
          body: "a plus a through n copies equals n times a.",
        },
      ],
    },
  ],
  zh: [
    {
      id: 1,
      title: "问题",
      beats: [
        {
          id: 0,
          action: "把重复加法写上黑板。",
          title: "我们到底在加什么？",
          body: "长路径展示了完全相同的加数在重复。",
        },
        {
          id: 1,
          action: "标出重复操作。",
          title: "操作在重复",
          body: "第一个加数之后没有新动作。",
        },
        {
          id: 2,
          action: "说明捷径目标。",
          title: "保留次数乘数值",
          body: "捷径必须同时保留次数和加数。",
        },
      ],
    },
    {
      id: 2,
      title: "公式",
      beats: [
        {
          id: 0,
          action: "写出重复加法模式。",
          title: "a 加 a",
          body: "同一个加数反复出现。",
        },
        {
          id: 1,
          action: "数出重复加数。",
          title: "n 个副本",
          body: "省略号藏住的是重复，不是不确定。",
        },
        {
          id: 2,
          action: "用乘法替换整行。",
          title: "n 乘 a",
          body: "总量保留在更短的记法里。",
        },
        {
          id: 3,
          action: "命名规则。",
          title: "重复加法规则",
          body: "重复加法就是次数乘加数。",
        },
      ],
    },
    {
      id: 3,
      title: "例题",
      beats: [
        {
          id: 0,
          action: "写出完整例子。",
          title: "四个 8",
          body: "例子从重复加法开始。",
        },
        {
          id: 1,
          action: "数副本。",
          title: "四份",
          body: "加数出现了四次。",
        },
        {
          id: 2,
          action: "压缩成乘法。",
          title: "四乘八",
          body: "重复的一行变成一个乘积。",
        },
        {
          id: 3,
          action: "展示相同结果。",
          title: "三十二",
          body: "捷径抵达同一个答案。",
        },
      ],
    },
    {
      id: 4,
      title: "化简",
      beats: [
        {
          id: 0,
          action: "展开重复的一行。",
          title: "四个 a 项",
          body: "长表达式重复同一份工作。",
        },
        {
          id: 1,
          action: "把次数移到前面。",
          title: "四份变成 4a",
          body: "次数进入系数位置。",
        },
        {
          id: 2,
          action: "解释改变了什么。",
          title: "只有路径改变",
          body: "数值没有变化，书写更短。",
        },
      ],
    },
    {
      id: 5,
      title: "框出答案",
      beats: [
        {
          id: 0,
          action: "写出使用条件。",
          title: "加数不变",
          body: "只有同一个值重复时，捷径才成立。",
        },
        {
          id: 1,
          action: "写出次数。",
          title: "n 次",
          body: "这个加数出现 n 次。",
        },
        {
          id: 2,
          action: "框出最终恒等式。",
          title: "重复加法捷径",
          body: "n 个 a 相加等于 n 乘 a。",
        },
      ],
    },
  ],
};

function useFonts() {
  useEffect(() => {
    const id = "style-39-derive-shortcut-v2-fonts";
    if (document.getElementById(id)) return;

    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=Noto+Sans+SC:wght@400;500;700&family=Patrick+Hand&display=swap";
    document.head.appendChild(link);
  }, []);
}

function isSceneId(value: number): value is SceneId {
  return SCENE_IDS.includes(value as SceneId);
}

function cx(...classNames: Array<string | false | undefined>): string {
  return classNames.filter(Boolean).join(" ");
}

function clampBeat(sceneId: SceneId, beat: number): number {
  const maxBeat = COPY[sceneId].en.steps.length - 1;
  return Math.max(0, Math.min(beat, maxBeat));
}

function getStepStyle(index: number, motionDisabled: boolean): ChalkStyle {
  return {
    "--chalk-delay": motionDisabled ? "0s" : `${index * 0.08}s`,
  };
}

function BeatMarks({
  currentBeat,
  total,
}: {
  currentBeat: number;
  total: number;
}) {
  return (
    <div className={styles.beatMarks} aria-hidden="true">
      {Array.from({ length: total }, (_, index) => (
        <span
          key={index}
          className={cx(
            styles.beatMark,
            index <= currentBeat && styles.beatMarkActive,
          )}
        />
      ))}
    </div>
  );
}

function ChalkTickNav({
  scene,
  language,
  onNavigate,
}: {
  scene: SceneId;
  language: Language;
  onNavigate?: (scene: number, beat: number) => void;
}) {
  return (
    <nav className={styles.nav} aria-label={language === "zh" ? "场景导航" : "Scene navigation"}>
      {SCENE_IDS.map((sceneId) => (
        <button
          key={sceneId}
          type="button"
          className={cx(styles.navTick, sceneId === scene && styles.navTickActive)}
          aria-label={
            language === "zh" ? `跳转到场景 ${sceneId}` : `Go to scene ${sceneId}`
          }
          aria-current={sceneId === scene ? "step" : undefined}
          onClick={() => onNavigate?.(sceneId, 0)}
        >
          <span>{sceneId}</span>
        </button>
      ))}
    </nav>
  );
}

function SketchLayer({
  sceneId,
  beat,
}: {
  sceneId: SceneId;
  beat: number;
}) {
  if (sceneId === 1) {
    return (
      <svg className={styles.sketchLayer} viewBox="0 0 100 100" aria-hidden="true">
        {beat >= 1 && (
          <path
            className={cx(styles.sketchPath, styles.sketchYellow)}
            d="M18 55 C 30 61, 46 61, 58 55"
            pathLength={1}
          />
        )}
        {beat >= 2 && (
          <path
            className={cx(styles.sketchPath, styles.sketchMint)}
            d="M64 60 C 74 55, 82 47, 86 35 M86 35 L82 40 M86 35 L89 42"
            pathLength={1}
          />
        )}
      </svg>
    );
  }

  if (sceneId === 2) {
    return (
      <svg className={styles.sketchLayer} viewBox="0 0 100 100" aria-hidden="true">
        {beat >= 1 && (
          <path
            className={cx(styles.sketchPath, styles.sketchYellow)}
            d="M23 45 C 34 35, 54 35, 65 45"
            pathLength={1}
          />
        )}
        {beat >= 2 && (
          <path
            className={cx(styles.sketchPath, styles.sketchMint)}
            d="M57 61 C 66 65, 75 65, 83 60"
            pathLength={1}
          />
        )}
      </svg>
    );
  }

  if (sceneId === 3) {
    return (
      <svg className={styles.sketchLayer} viewBox="0 0 100 100" aria-hidden="true">
        {beat >= 1 && (
          <path
            className={cx(styles.sketchPath, styles.sketchYellow)}
            d="M21 39 L21 49 M35 39 L35 49 M49 39 L49 49 M63 39 L63 49"
            pathLength={1}
          />
        )}
        {beat >= 2 && (
          <path
            className={cx(styles.sketchPath, styles.sketchMint)}
            d="M33 61 C 45 70, 61 70, 73 61 M73 61 L69 66 M73 61 L66 59"
            pathLength={1}
          />
        )}
      </svg>
    );
  }

  if (sceneId === 4) {
    return (
      <svg className={styles.sketchLayer} viewBox="0 0 100 100" aria-hidden="true">
        {beat >= 1 && (
          <path
            className={cx(styles.sketchPath, styles.sketchYellow)}
            d="M33 38 L54 55 M55 38 L33 55"
            pathLength={1}
          />
        )}
        {beat >= 2 && (
          <path
            className={cx(styles.sketchPath, styles.sketchMint)}
            d="M62 63 C 70 60, 77 55, 83 48 M83 48 L78 50 M83 48 L81 54"
            pathLength={1}
          />
        )}
      </svg>
    );
  }

  return (
    <svg className={styles.sketchLayer} viewBox="0 0 100 100" aria-hidden="true">
      {beat >= 2 && (
        <path
          className={cx(styles.sketchPath, styles.sketchMint, styles.boxPath)}
          d="M16 28 H84 V72 H16 Z"
          pathLength={1}
        />
      )}
      {beat >= 2 && (
        <path
          className={cx(styles.sketchPath, styles.sketchYellow)}
          d="M27 80 C 43 85, 61 85, 76 80"
          pathLength={1}
        />
      )}
    </svg>
  );
}

function ScenePanel({
  sceneId,
  beat,
  language,
  isActive,
  motionDisabled,
}: {
  sceneId: SceneId;
  beat: number;
  language: Language;
  isActive: boolean;
  motionDisabled: boolean;
}) {
  const currentBeat = clampBeat(sceneId, beat);
  const content = COPY[sceneId][language];
  const visibleSteps = content.steps.filter((step) => currentBeat >= step.showFrom);
  const { ref } = useFLIP<HTMLDivElement>({
    watch: [sceneId, currentBeat, language],
    selector: '[data-beat-layout-item="true"]',
    disabled: motionDisabled || !isActive,
    duration: 430,
    easing: "cubic-bezier(0.2, 0.8, 0.2, 1)",
  });

  return (
    <section className={cx(styles.scene, styles[`scene${sceneId}`])}>
      <SketchLayer sceneId={sceneId} beat={currentBeat} />
      <div
        ref={ref}
        className={styles.sceneLayout}
        data-beat-layout-container="true"
        data-beat-layout-mode="motion"
      >
        <header className={styles.header} data-beat-layout-item="true">
          <p className={styles.sceneLabel}>{content.label}</p>
          <h2>{content.title}</h2>
          <p className={styles.subtitle}>{content.subtitle}</p>
        </header>

        <aside className={styles.symbolBox} data-beat-layout-item="true">
          <span className={styles.symbol}>{content.symbol}</span>
          <span className={styles.marginNote}>{content.marginNote}</span>
        </aside>

        <div className={styles.work} data-beat-layout-item="true">
          {visibleSteps.map((step, index) => (
            <div
              key={step.id}
              className={cx(
                styles.step,
                styles[step.variant],
                styles[step.tone],
              )}
              style={getStepStyle(index, motionDisabled)}
              data-beat-layout-item="true"
            >
              <span className={styles.stepText}>{step.text}</span>
              <span className={styles.stepDetail}>{step.detail}</span>
            </div>
          ))}
        </div>

        <BeatMarks currentBeat={currentBeat} total={content.steps.length} />
      </div>
    </section>
  );
}

export function getMetadata(lang: Language): StyleMetadata {
  return {
    id: "39",
    band: "contemporary-digital",
    name: lang === "zh" ? "黑板推导" : "Blackboard Chalk Talk",
    theme: lang === "zh" ? "推导捷径" : "Derive the Shortcut",
    densityLabel: lang === "zh" ? "逐步推导" : "Worked Derivation",
    heroScene: 5,
    colors: {
      bg: "#102f27",
      ink: "#edf4df",
      panel: "#173b31",
    },
    typography: {
      header: "Patrick Hand 400",
      body: "IBM Plex Mono 400",
    },
    tags: ["chalk", "blackboard", "teaching", "derivation", "motion"],
    fonts: ["Patrick Hand", "IBM Plex Mono", "cjk:Noto Sans SC"],
    scenes: META[lang],
  };
}

export default function DeriveShortcutV2({
  scene,
  beat,
  language,
  isThumbnail,
  reducedMotion,
  onNavigate,
}: BespokeStyleProps) {
  useFonts();

  const activeScene = isSceneId(scene) ? scene : 1;
  const motionDisabled = reducedMotion || isThumbnail;

  return (
    <div
      className={styles.root}
      data-motion-disabled={motionDisabled ? "true" : undefined}
      data-thumbnail={isThumbnail ? "true" : undefined}
    >
      <SpatialSceneTrack
        scene={activeScene}
        beat={clampBeat(activeScene, beat)}
        sceneIds={SCENE_IDS}
        transitionKind="wipe"
        transitionMap={TRANSITION_MAP}
        reducedMotion={motionDisabled}
        beatLayoutModes={BEAT_LAYOUT_MODES}
        className={styles.track}
        renderScene={(sceneId, sceneBeat, isActive) => (
          <ScenePanel
            sceneId={sceneId as SceneId}
            beat={sceneBeat}
            language={language}
            isActive={isActive}
            motionDisabled={motionDisabled}
          />
        )}
      />
      {!isThumbnail && (
        <ChalkTickNav
          scene={activeScene}
          language={language}
          onNavigate={onNavigate}
        />
      )}
    </div>
  );
}

export const deriveShortcutV2Version = defineStyleVersion({
  id: "v2",
  topic: "Derive the Shortcut",
  model: "GPT-5",
  component: DeriveShortcutV2,
  getMetadata,
});

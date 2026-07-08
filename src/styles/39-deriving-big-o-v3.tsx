import { useEffect } from "react";
import type { CSSProperties, ReactNode } from "react";
import type { BespokeStyleProps, StyleMetadata } from "../types";
import { defineStyleVersion } from "./version";
import SpatialSceneTrack from "./SpatialSceneTrack";
import type { SceneTransitionMap } from "./SpatialSceneTrack";
import { useFLIP } from "../hooks/useFLIP";
import styles from "./39-deriving-big-o-v3.module.css";

/* ------------------------------------------------------------------ */
/* Fonts                                                              */
/* ------------------------------------------------------------------ */

function useFonts(): void {
  useEffect(() => {
    const id = "font-blackboard-chalk-v3";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Caveat:wght@400;700&family=Gochi+Hand&family=Azeret+Mono:wght@300;400;500&family=Zhi+Mang+Xing&family=Long+Cang&display=swap";
    document.head.appendChild(link);
  }, []);
}

function fontVars(language: "en" | "zh"): CSSProperties {
  if (language === "zh") {
    return {
      "--hand": "'Zhi Mang Xing', 'Caveat', cursive",
      "--marker": "'Long Cang', 'Gochi Hand', cursive",
      "--mono": "'Azeret Mono', ui-monospace, monospace",
    } as CSSProperties;
  }
  return {
    "--hand": "'Caveat', cursive",
    "--marker": "'Gochi Hand', cursive",
    "--mono": "'Azeret Mono', ui-monospace, monospace",
  } as CSSProperties;
}

/* ------------------------------------------------------------------ */
/* Content (no `as const` — keep strings widened for build safety)    */
/* ------------------------------------------------------------------ */

const COPY = {
  en: {
    s1: {
      eyebrow: "The question",
      title: "How does\ncost grow?",
      subtitle: "Deriving Big-O from first principles.",
    },
    s2: {
      eyebrow: "The setup",
      caption: "A nested loop touches every pair.",
      node1: "outer loop · n times",
      node2: "inner loop · n times",
    },
    s3: {
      eyebrow: "The derivation",
      rows: [
        { lhs: "T(n) =", rhs: "n · n", annot: "n rows, each does n work" },
        { lhs: "=", rhs: "n²", annot: "multiply the two counts" },
        { lhs: "O(T) =", rhs: "O(n²)", annot: "drop constants & lower terms" },
      ],
    },
    s4: {
      eyebrow: "The insight",
      label: "So the bound is",
      result: "O(n²)",
      noteTag: "note",
      noteBody: "Double the input → quadruple the work.",
    },
    s5: {
      result: "O(n²)",
      caption: "Quadratic time.",
      qed: "Q.E.D.",
    },
  },
  zh: {
    s1: {
      eyebrow: "提出问题",
      title: "成本\n如何增长？",
      subtitle: "从头推导大 O 复杂度。",
    },
    s2: {
      eyebrow: "搭建场景",
      caption: "嵌套循环会遍历每一对。",
      node1: "外层循环 · n 次",
      node2: "内层循环 · n 次",
    },
    s3: {
      eyebrow: "逐步推导",
      rows: [
        { lhs: "T(n) =", rhs: "n · n", annot: "n 行，每行做 n 次" },
        { lhs: "=", rhs: "n²", annot: "把两个次数相乘" },
        { lhs: "O(T) =", rhs: "O(n²)", annot: "略去常数与低阶项" },
      ],
    },
    s4: {
      eyebrow: "得到结论",
      label: "于是上界为",
      result: "O(n²)",
      noteTag: "旁注",
      noteBody: "输入翻倍 → 工作量翻四倍。",
    },
    s5: {
      result: "O(n²)",
      caption: "平方时间。",
      qed: "证毕",
    },
  },
};

type Copy = typeof COPY.en;

const TRANSITIONS: SceneTransitionMap = {
  "1->2": "wipe",
  "2->3": "wipe",
  "3->4": "wipe",
  "4->5": "fade",
};

/* ------------------------------------------------------------------ */
/* Chalk artifacts (hand-drawn SVG, stroke-by-stroke via pathLength)  */
/* ------------------------------------------------------------------ */

function ChalkDefs() {
  return (
    <svg className={styles.defs} aria-hidden="true">
      <defs>
        <filter id="chalkRough">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.9"
            numOctaves={2}
            result="noise"
          />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale={2.4} />
        </filter>
      </defs>
    </svg>
  );
}

function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <div className={styles.sceneHead}>
      <span className={styles.eyebrow}>{children}</span>
    </div>
  );
}

function ChalkUnderline() {
  return (
    <svg
      className={styles.underlineSvg}
      viewBox="0 0 600 40"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        className={styles.stroke}
        pathLength={1}
        d="M6 24 C 120 10, 300 32, 470 18 S 560 28, 594 20"
      />
    </svg>
  );
}

function ChalkArrow() {
  return (
    <svg
      className={styles.arrowSvg}
      viewBox="0 0 120 40"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        className={`${styles.stroke} ${styles.strokeYellow}`}
        pathLength={1}
        d="M4 22 C 40 14, 78 28, 108 20"
      />
      <path
        className={`${styles.stroke} ${styles.strokeYellow}`}
        pathLength={1}
        d="M95 9 L113 20 L95 31"
      />
    </svg>
  );
}

function ChalkBox() {
  return (
    <svg
      className={styles.boxSvg}
      viewBox="0 0 200 120"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        className={`${styles.stroke} ${styles.strokeYellow}`}
        pathLength={1}
        d="M8 14 C 60 6, 150 6, 192 12 C 197 42, 196 84, 190 108 C 130 116, 60 116, 10 106 C 4 70, 6 40, 8 14 Z"
      />
    </svg>
  );
}

function ChalkBracket() {
  return (
    <svg
      className={styles.bracketSvg}
      viewBox="0 0 20 100"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        className={`${styles.stroke} ${styles.strokeMint}`}
        pathLength={1}
        d="M16 5 C 6 7, 6 7, 5 20 L5 44 C 5 48, 3 50, 1 50 C 3 50, 5 52, 5 56 L5 80 C 6 93, 6 93, 16 95"
      />
    </svg>
  );
}

function ChalkCircle() {
  return (
    <svg
      className={styles.circleSvg}
      viewBox="0 0 400 200"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        className={`${styles.stroke} ${styles.strokeYellow}`}
        pathLength={1}
        d="M62 40 C 182 12, 330 20, 372 70 C 392 122, 300 172, 180 176 C 70 180, 8 140, 22 92 C 30 60, 44 46, 70 38"
      />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Scenes                                                             */
/* ------------------------------------------------------------------ */

interface SceneProps {
  beat: number;
  isActive: boolean;
  reduced: boolean;
  copy: Copy;
}

function sceneFlags(isActive: boolean, reduced: boolean) {
  return {
    "data-animate": isActive && !reduced ? "true" : "false",
    "data-reduced": reduced ? "true" : "false",
  };
}

/* Scene 1 — The question. Hand-drawn title, underlined. 1 beat. */
function Scene1({ isActive, reduced, copy }: SceneProps) {
  return (
    <div className={styles.scene} {...sceneFlags(isActive, reduced)}>
      <div className={styles.titleWrap}>
        <span className={styles.eyebrow}>{copy.s1.eyebrow}</span>
        <h1 className={`${styles.title} ${styles.writeIn}`}>{copy.s1.title}</h1>
        <ChalkUnderline />
        <p className={styles.subtitle}>{copy.s1.subtitle}</p>
      </div>
    </div>
  );
}

/* Scene 2 — The setup. Diagram sketches itself, arrow extends. 2 beats · motion. */
function Scene2({ beat, isActive, reduced, copy }: SceneProps) {
  const { ref } = useFLIP<HTMLDivElement>({
    watch: [beat],
    disabled: reduced || !isActive,
    duration: 480,
    easing: "cubic-bezier(0.34, 1.56, 0.64, 1)",
    selector: '[data-beat-layout-item="true"]',
  });
  return (
    <div className={styles.scene} {...sceneFlags(isActive, reduced)}>
      <Eyebrow>{copy.s2.eyebrow}</Eyebrow>
      <p className={styles.sceneCaption}>{copy.s2.caption}</p>
      <div
        ref={ref}
        className={styles.diagram}
        data-beat-layout-container="true"
        data-beat-layout-mode="motion"
      >
        <div className={styles.node} data-beat-layout-item="true">
          {copy.s2.node1}
        </div>
        <div className={styles.connector} data-beat-layout-item="true">
          <ChalkArrow />
        </div>
        {beat >= 1 && (
          <div
            className={`${styles.node} ${styles.nodeWork} ${styles.chalkIn}`}
            data-beat-layout-item="true"
          >
            {copy.s2.node2}
          </div>
        )}
      </div>
    </div>
  );
}

/* Scene 3 — The derivation. Formula appears term by term. 3 beats · reserved. */
function Scene3({ beat, isActive, reduced, copy }: SceneProps) {
  return (
    <div className={styles.scene} {...sceneFlags(isActive, reduced)}>
      <Eyebrow>{copy.s3.eyebrow}</Eyebrow>
      <div
        className={styles.derivation}
        data-beat-layout-container="true"
        data-beat-layout-mode="reserved"
      >
        {copy.s3.rows.map((row, i) => (
          <div
            key={row.lhs + i}
            className={`${styles.formulaRow} ${styles.reveal}`}
            data-beat-layout-item="true"
            style={{ opacity: beat >= i ? 1 : 0 }}
          >
            <span className={styles.flhs}>{row.lhs}</span>
            <span className={styles.frhs}>{row.rhs}</span>
            <span className={styles.annot}>{row.annot}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* Scene 4 — The insight. Result boxed, margin note added. 2 beats · motion. */
function Scene4({ beat, isActive, reduced, copy }: SceneProps) {
  const { ref } = useFLIP<HTMLDivElement>({
    watch: [beat],
    disabled: reduced || !isActive,
    duration: 480,
    easing: "cubic-bezier(0.34, 1.56, 0.64, 1)",
    selector: '[data-beat-layout-item="true"]',
  });
  return (
    <div className={styles.scene} {...sceneFlags(isActive, reduced)}>
      <Eyebrow>{copy.s4.eyebrow}</Eyebrow>
      <div
        ref={ref}
        className={styles.insightRow}
        data-beat-layout-container="true"
        data-beat-layout-mode="motion"
      >
        <span className={styles.labelChalk} data-beat-layout-item="true">
          {copy.s4.label}
        </span>
        <div className={styles.resultBox} data-beat-layout-item="true">
          <ChalkBox />
          <span className={styles.resultText}>{copy.s4.result}</span>
        </div>
        {beat >= 1 && (
          <div
            className={`${styles.marginNote} ${styles.chalkIn}`}
            data-beat-layout-item="true"
          >
            <ChalkBracket />
            <span className={styles.noteTag}>{copy.s4.noteTag}</span>
            <span className={styles.noteBody}>{copy.s4.noteBody}</span>
          </div>
        )}
      </div>
    </div>
  );
}

/* Scene 5 — Q.E.D. Final bound chalk-circled. 1 beat. */
function Scene5({ isActive, reduced, copy }: SceneProps) {
  return (
    <div className={styles.scene} {...sceneFlags(isActive, reduced)}>
      <div className={styles.qedWrap}>
        <div className={styles.bigOWrap}>
          <ChalkCircle />
          <span className={styles.bigO}>{copy.s5.result}</span>
        </div>
        <p className={styles.caption}>{copy.s5.caption}</p>
        <span className={styles.qed}>{copy.s5.qed}</span>
      </div>
    </div>
  );
}

/* Nav — N9 chalk step line at the board's edge. */
function StepNav({
  scene,
  isThumbnail,
  reduced,
  onNavigate,
}: {
  scene: number;
  isThumbnail: boolean;
  reduced: boolean;
  onNavigate?: (scene: number, beat: number) => void;
}) {
  if (isThumbnail) return null;
  const steps = ["①", "②", "③", "④", "⑤"];
  return (
    <nav className={styles.nav} data-reduced={reduced ? "true" : "false"}>
      {steps.map((glyph, i) => {
        const n = i + 1;
        const current = n === scene;
        return (
          <button
            key={n}
            type="button"
            className={`${styles.navItem} ${current ? styles.current : ""}`}
            aria-current={current ? "step" : undefined}
            onClick={(e) => {
              e.stopPropagation();
              onNavigate?.(n, 0);
            }}
          >
            {glyph}
          </button>
        );
      })}
    </nav>
  );
}

/* ------------------------------------------------------------------ */
/* Root component                                                     */
/* ------------------------------------------------------------------ */

function BlackboardChalkTalkV3({
  scene,
  beat,
  language,
  isThumbnail,
  reducedMotion,
  onNavigate,
}: BespokeStyleProps) {
  useFonts();
  const reduced = reducedMotion || isThumbnail;
  const copy = COPY[language];

  return (
    <div className={styles.root} style={fontVars(language)}>
      <ChalkDefs />
      <SpatialSceneTrack
        scene={scene}
        beat={beat}
        transitionKind="wipe"
        transitionMap={TRANSITIONS}
        reducedMotion={reduced}
        beatLayoutModes={{ 2: "motion", 3: "reserved", 4: "motion" }}
        renderScene={(sceneId, sceneBeat, isActive) => {
          const shared: SceneProps = {
            beat: sceneBeat,
            isActive,
            reduced,
            copy,
          };
          switch (sceneId) {
            case 1:
              return <Scene1 {...shared} />;
            case 2:
              return <Scene2 {...shared} />;
            case 3:
              return <Scene3 {...shared} />;
            case 4:
              return <Scene4 {...shared} />;
            default:
              return <Scene5 {...shared} />;
          }
        }}
      />
      <StepNav
        scene={scene}
        isThumbnail={isThumbnail}
        reduced={reduced}
        onNavigate={onNavigate}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Metadata                                                           */
/* ------------------------------------------------------------------ */

export function getMetadata(lang: "en" | "zh"): StyleMetadata {
  const isZh = lang === "zh";
  const scenes = isZh
    ? [
        {
          id: 1,
          title: "提出问题",
          beats: [
            {
              id: 0,
              action: "写下标题并画上下划线",
              title: "成本如何增长？",
              body: "从头推导大 O 复杂度。",
            },
          ],
        },
        {
          id: 2,
          title: "搭建场景",
          beats: [
            {
              id: 0,
              action: "画出外层循环",
              title: "外层循环",
              body: "它会运行 n 次。",
            },
            {
              id: 1,
              action: "延伸箭头连到内层循环",
              title: "嵌套循环",
              body: "每一次都再跑 n 次。",
            },
          ],
        },
        {
          id: 3,
          title: "逐步推导",
          beats: [
            {
              id: 0,
              action: "写下第一项",
              title: "T(n) = n · n",
              body: "n 行，每行做 n 次工作。",
            },
            {
              id: 1,
              action: "把次数相乘",
              title: "= n²",
              body: "两个次数合并起来。",
            },
            {
              id: 2,
              action: "化简为大 O",
              title: "O(T) = O(n²)",
              body: "略去常数与低阶项。",
            },
          ],
        },
        {
          id: 4,
          title: "得到结论",
          beats: [
            {
              id: 0,
              action: "把结果框起来",
              title: "O(n²)",
              body: "紧致的上界。",
            },
            {
              id: 1,
              action: "补上一条旁注",
              title: "平方级增长",
              body: "输入翻倍，工作量翻四倍。",
            },
          ],
        },
        {
          id: 5,
          title: "证毕",
          beats: [
            {
              id: 0,
              action: "用粉笔圈出最终上界",
              title: "O(n²)",
              body: "平方时间。证毕。",
            },
          ],
        },
      ]
    : [
        {
          id: 1,
          title: "The question",
          beats: [
            {
              id: 0,
              action: "Chalk the title, underline it",
              title: "How does cost grow?",
              body: "Deriving Big-O from first principles.",
            },
          ],
        },
        {
          id: 2,
          title: "The setup",
          beats: [
            {
              id: 0,
              action: "Sketch the outer loop",
              title: "Outer loop",
              body: "It runs n times.",
            },
            {
              id: 1,
              action: "Extend an arrow to the inner loop",
              title: "Nested loop",
              body: "Each pass runs n more times.",
            },
          ],
        },
        {
          id: 3,
          title: "The derivation",
          beats: [
            {
              id: 0,
              action: "Write the first term",
              title: "T(n) = n · n",
              body: "Each of n rows does n work.",
            },
            {
              id: 1,
              action: "Multiply the counts",
              title: "= n²",
              body: "The two counts combine.",
            },
            {
              id: 2,
              action: "Reduce to Big-O",
              title: "O(T) = O(n²)",
              body: "Drop constants and lower terms.",
            },
          ],
        },
        {
          id: 4,
          title: "The insight",
          beats: [
            {
              id: 0,
              action: "Box the result",
              title: "O(n²)",
              body: "The tight upper bound.",
            },
            {
              id: 1,
              action: "Add a margin note",
              title: "Quadratic scaling",
              body: "Double the input, quadruple the work.",
            },
          ],
        },
        {
          id: 5,
          title: "Q.E.D.",
          beats: [
            {
              id: 0,
              action: "Circle the final bound",
              title: "O(n²)",
              body: "Quadratic time. Q.E.D.",
            },
          ],
        },
      ];

  return {
    id: "39",
    band: "contemporary-digital",
    name: isZh ? "粉笔推导" : "Blackboard Chalk Talk",
    theme: isZh ? "推导复杂度" : "Deriving Big-O",
    densityLabel: isZh ? "逐步推导" : "Worked derivation",
    heroScene: 3,
    colors: { bg: "#213730", ink: "#f4f1e8", panel: "#2a463a" },
    typography: { header: "Caveat", body: "Azeret Mono" },
    tags: [
      "educational",
      "handmade",
      "chalk",
      "reasoning",
      "dark",
      "cool",
      "medium-density",
      "sequential-motion",
      "blackboard",
      "derivation",
    ],
    fonts: [
      "Caveat",
      "Gochi Hand",
      "Azeret Mono",
      "cjk:Zhi Mang Xing",
      "cjk:Long Cang",
    ],
    scenes,
  };
}

export default BlackboardChalkTalkV3;

export const DerivingBigOV3Version = defineStyleVersion({
  id: "v3",
  topic: { en: "Deriving Big-O", zh: "推导复杂度" },
  model: "Claude-Opus-4.8",
  component: BlackboardChalkTalkV3,
  getMetadata,
});

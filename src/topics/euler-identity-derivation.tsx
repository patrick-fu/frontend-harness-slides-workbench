import {
  defineTopic,
  type TopicMetadata,
  type TopicStageProps,
} from "../domain/topic";
import SpatialSceneTrack from "../components/stage/SpatialSceneTrack";
import styles from "./euler-identity-derivation.module.css";

const metadata: { en: TopicMetadata; zh: TopicMetadata } = {
  en: {
    theme: "Mathematical Elegance: Step-by-Step Derivation of Euler's Identity",
    densityLabel: "Dense",
    heroScene: 3,
    colors: {
      bg: "#1b3323",
      ink: "#f8fafc",
      panel: "#24422e",
    },
    typography: {
      header: "KaTeX_Main 700",
      body: "KaTeX_Math 400",
    },
    tags: ["math", "calculus", "chalkboard", "complex-analysis", "euler"],
    fonts: ["KaTeX_Main", "serif"],
    scenes: [
      {
        id: 1,
        title: "Five Constants Meet",
        beats: [
          {
            id: 0,
            action: "Gather 0, 1, e, i, and pi on a dark chalkboard",
            title: "Five Fundamental Constants",
            body: "Arithmetic ($0, 1$), algebra ($i$), geometry ($\\pi$), and calculus ($e$) appear as isolated pillars of mathematical thought.",
          },
        ],
      },
      {
        id: 2,
        title: "Taylor Series Expansion",
        beats: [
          {
            id: 0,
            action: "Expand the exponential Taylor polynomial",
            title: "Exponential Power Series $e^x$",
            body: "The Maclaurin series reveals $e^x = 1 + x + \\frac{x^2}{2!} + \\frac{x^3}{3!} + \\frac{x^4}{4!} + \\dots$ as an infinite polynomial.",
          },
          {
            id: 1,
            action: "Expand cosine and sine trigonometric series",
            title: "Trigonometric Power Series",
            body: "Expanding $\\cos x = 1 - \\frac{x^2}{2!} + \\frac{x^4}{4!} \\dots$ and $\\sin x = x - \\frac{x^3}{3!} + \\frac{x^5}{5!} \\dots$ separates parity.",
          },
        ],
      },
      {
        id: 3,
        title: "Imaginary Substitution",
        beats: [
          {
            id: 0,
            action: "Substitute $x = i\\theta$ and separate real and imaginary parts",
            title: "Euler's Formula: $e^{ix} = \\cos x + i\\sin x$",
            body: "Since $i^2 = -1, i^3 = -i, i^4 = 1$, the infinite series naturally splits into real even cosine terms and imaginary odd sine terms.",
          },
        ],
      },
      {
        id: 4,
        title: "Geometric Half-Turn Rotation",
        beats: [
          {
            id: 0,
            action: "Set $x = \\pi$ on the complex unit circle",
            title: "Complex Unit Circle: $e^{i\\pi} = -1$",
            body: "Plugging in $\\pi$ rotates unity 180 degrees counterclockwise: $\\cos(\\pi) + i\\sin(\\pi) = -1 + 0 = -1$.",
          },
        ],
      },
      {
        id: 5,
        title: "Ultimate Mathematical Unity",
        beats: [
          {
            id: 0,
            action: "Rearrange terms into $e^{i\\pi} + 1 = 0$",
            title: "The God Equation: $e^{i\\pi} + 1 = 0$",
            body: "In a single equation of seven symbols, all fundamental constants bind into eternal, harmonious symmetry.",
          },
        ],
      },
    ],
  },
  zh: {
    theme: "数学之美：欧拉恒等式 $e^{i\\pi}+1=0$ 的板书推导历程",
    densityLabel: "密集",
    heroScene: 3,
    colors: {
      bg: "#1b3323",
      ink: "#f8fafc",
      panel: "#24422e",
    },
    typography: {
      header: "KaTeX_Main 700",
      body: "KaTeX_Math 400",
    },
    tags: ["数学", "微积分", "黑板粉笔", "复变函数", "欧拉恒等式"],
    fonts: ["KaTeX_Main", "serif"],
    scenes: [
      {
        id: 1,
        title: "五大常数的相遇",
        beats: [
          {
            id: 0,
            action: "在深绿黑板上陈列 0, 1, e, i, pi 五大数学常数",
            title: "五大独立数学常数的相遇",
            body: "算术基石（$0, 1$）、代数虚数（$i$）、几何圆周率（$\\pi$）与分析学底数（$e$）原本各居数学王国互不相通的角落。",
          },
        ],
      },
      {
        id: 2,
        title: "泰勒级数无穷展开",
        beats: [
          {
            id: 0,
            action: "展开指数函数 $e^x$ 的麦克劳林无穷级数",
            title: "指数函数幂级数展开",
            body: "通过无穷微积分泰勒展开：$e^x = 1 + x + \\frac{x^2}{2!} + \\frac{x^3}{3!} + \\frac{x^4}{4!} + \\dots$",
          },
          {
            id: 1,
            action: "展开三角函数正弦与余弦级数",
            title: "正弦与余弦三角级数奇偶拆解",
            body: "余弦偶次项 $\\cos x = 1 - \\frac{x^2}{2!} + \\frac{x^4}{4!} \\dots$ 与正弦奇次项 $\\sin x = x - \\frac{x^3}{3!} + \\dots$ 形成对称。",
          },
        ],
      },
      {
        id: 3,
        title: "虚数代入奇偶分离",
        beats: [
          {
            id: 0,
            action: "代入虚数 $x = i\\theta$ 形成欧拉公式",
            title: "欧拉公式：$e^{ix} = \\cos x + i\\sin x$",
            body: "利用虚数单位周期性 $i^2 = -1, i^3 = -i, i^4 = 1$，无穷指数级数精确裂变重组为实部余弦与虚部正弦之和。",
          },
        ],
      },
      {
        id: 4,
        title: "复平面旋转半周",
        beats: [
          {
            id: 0,
            action: "代入 $x = \\pi$ 几何旋转 180 度",
            title: "复平面半周旋转：$e^{i\\pi} = -1$",
            body: "当角度取 $\\pi$ 弧度时，复平面上的单位向量逆时针旋转整整 180 度：$\\cos(\\pi) + i\\sin(\\pi) = -1 + 0 = -1$。",
          },
        ],
      },
      {
        id: 5,
        title: "终极数学和谐",
        beats: [
          {
            id: 0,
            action: "移项凝固为最美公式 $e^{i\\pi} + 1 = 0$",
            title: "上帝公式：$e^{i\\pi} + 1 = 0$",
            body: "移项规整为仅含七个字符的恒等式，将人类数千年的算术、代数、几何与分析常数紧密锁入同一个永恒秩序之中。",
          },
        ],
      },
    ],
  },
};

function TopicStage({
  scene,
  beat,
  language,
  isThumbnail,
  reducedMotion,
}: TopicStageProps) {
  const currentMetadata = metadata[language];

  return (
    <div className={styles.root}>
      <SpatialSceneTrack
        scene={scene}
        beat={beat}
        transitionKind="push-x"
        transitionMap={{
          "1->2": "push-x",
          "2->3": "push-x",
          "3->4": "slide-x",
          "4->5": "crossfade",
        }}
        reducedMotion={reducedMotion || isThumbnail}
        beatLayoutModes={{
          2: "motion",
        }}
        renderScene={(sceneId, sceneBeat) => {
          const currentScene = currentMetadata.scenes.find(
            (s) => s.id === sceneId,
          );
          if (!currentScene) return null;
          const currentBeat =
            currentScene.beats[sceneBeat] || currentScene.beats[0];

          return (
            <div className={styles.track}>
              <div className={styles.chalkHeader}>
                <span>BLACKBOARD CHALK TALK // MATHEMATICAL DERIVATION</span>
                <span>LEONHARD EULER 1748</span>
              </div>

              <div
                className={styles.chalkboard}
                data-beat-layout-container={sceneId === 2 ? "true" : undefined}
                data-beat-layout-mode={sceneId === 2 ? "motion" : undefined}
              >
                <div
                  className={styles.chalkTag}
                  data-beat-layout-item={sceneId === 2 ? "true" : undefined}
                >
                  PROOF STEP {sceneId} // {language === "zh" ? "粉笔板书推导" : "CHALK DERIVATION"}
                </div>
                <h1
                  className={styles.sceneTitle}
                  data-beat-layout-item={sceneId === 2 ? "true" : undefined}
                >
                  {currentBeat.title}
                </h1>
                <p
                  className={styles.sceneBody}
                  data-beat-layout-item={sceneId === 2 ? "true" : undefined}
                >
                  {currentBeat.body}
                </p>

                <div
                  className={styles.formulaBox}
                  data-beat-layout-item={sceneId === 2 ? "true" : undefined}
                >
                  <span className={styles.formulaMain}>e^(iπ) + 1 = 0</span>
                  <span className={styles.formulaSub}>[0, 1, e, i, π CONVERGENCE]</span>
                </div>
              </div>

              <div className={styles.chalkFooter}>
                <span>INTRODUCTIO IN ANALYSIN INFINITORUM (1748)</span>
                <span>Q.E.D.</span>
              </div>
            </div>
          );
        }}
      />
    </div>
  );
}

export default defineTopic({
  id: "euler-identity-derivation",
  styleId: "blackboard-chalk-talk",
  title: { en: "Euler's Identity Proof", zh: "欧拉恒等式" },
  modelId: "Gemini 3.7 Flash",
  Stage: TopicStage,
  metadata,
  navigation: { mode: "none" },
  transitionScore: {
    "1->2": "push-x",
    "2->3": "push-x",
    "3->4": "slide-x",
    "4->5": "crossfade",
  },
  evidence: {
    kind: "facts",
    sources: [
      {
        title: "Introductio in analysin infinitorum (Leonhard Euler)",
        url: "https://archive.org/details/introductioinana01eule",
        supports:
          "Taylor series expansion of exponential and trigonometric functions, imaginary unit substitution, and e^(i*pi) + 1 = 0.",
      },
    ],
  },
});

import {
  defineTopic,
  type TopicMetadata,
  type TopicStageProps,
} from "../domain/topic";
import SpatialSceneTrack from "../components/stage/SpatialSceneTrack";
import styles from "./zero-knowledge-snark.module.css";

const metadata: { en: TopicMetadata; zh: TopicMetadata } = {
  en: {
    theme: "ZK-SNARK Pipeline: Verifiable Arithmetic Circuit Reductions",
    densityLabel: "Dense",
    heroScene: 3,
    colors: {
      bg: "#0b0f19",
      ink: "#e2e8f0",
      panel: "#131b2e",
    },
    typography: {
      header: "System-ui 800",
      body: "Monospace 400",
    },
    tags: ["cryptography", "zk-snark", "circuit", "pipeline", "privacy"],
    fonts: ["Monospace", "Inter"],
    scenes: [
      {
        id: 1,
        title: "Computation & Witness",
        beats: [
          {
            id: 0,
            action: "Input public statement and private secret witness",
            title: "Public Statement & Private Witness",
            body: "The prover seeks to convince the verifier that $C(x, w) = 0$ holds without exposing any component of secret witness vector $w$.",
          },
        ],
      },
      {
        id: 2,
        title: "R1CS Arithmetic Circuit",
        beats: [
          {
            id: 0,
            action: "Flatten high-level code into addition and multiplication gates",
            title: "Arithmetic Gate Decomposition",
            body: "General logic flattens into rank-1 constraints: $\\langle A_i, z \\rangle \\times \\langle B_i, z \\rangle = \\langle C_i, z \\rangle$ across all wire assignments.",
          },
          {
            id: 1,
            action: "Assemble sparse coefficient constraint matrices",
            title: "Sparse Matrix Compilation",
            body: "Millions of operations compile into sparse matrices $(A, B, C)$, where satisfied constraints guarantee computational integrity.",
          },
        ],
      },
      {
        id: 3,
        title: "QAP Polynomial Reduction",
        beats: [
          {
            id: 0,
            action: "Interpolate discrete matrix rows into continuous polynomials",
            title: "Quadratic Arithmetic Program",
            body: "Lagrange interpolation collapses all R1CS rows into $A(x)B(x) - C(x) = H(x)T(x)$, proving millions of equations at a single point $\\tau$.",
          },
          {
            id: 1,
            action: "Apply Schwartz-Zippel identity check",
            title: "Schwartz-Zippel Point Evaluation",
            body: "Checking divisibility by vanishing polynomial $T(x)$ at secret toxic point $\\tau$ reduces verification to a single equality test.",
          },
        ],
      },
      {
        id: 4,
        title: "Elliptic Curve Pairing",
        beats: [
          {
            id: 0,
            action: "Commit polynomial evaluations onto pairing-friendly curve",
            title: "Pairing Cryptographic Commitments",
            body: "Bilinear pairings ($e: G_1 \\times G_2 \\to G_T$) hide $\\tau$ in curve generator exponents, compressing proof size to just 128 bytes.",
          },
        ],
      },
      {
        id: 5,
        title: "Constant Time Verification",
        beats: [
          {
            id: 0,
            action: "Perform 3 millisecond verification pairing check",
            title: "O(1) Succinct Verification",
            body: "The verifier computes three pairing operations in under 3 milliseconds, verifying hours of heavy execution irrevocably.",
          },
        ],
      },
    ],
  },
  zh: {
    theme: "零知识证明流：算术电路降维与可验证计算",
    densityLabel: "密集",
    heroScene: 3,
    colors: {
      bg: "#0b0f19",
      ink: "#e2e8f0",
      panel: "#131b2e",
    },
    typography: {
      header: "System-ui 800",
      body: "Monospace 400",
    },
    tags: ["密码学", "零知识证明", "电路", "流水线", "隐私"],
    fonts: ["Monospace", "Inter"],
    scenes: [
      {
        id: 1,
        title: "计算问题与见证输入",
        beats: [
          {
            id: 0,
            action: "输入公开声明与私有秘密见证",
            title: "公开声明与私有见证",
            body: "证明者向验证者证明方程式 $C(x, w) = 0$ 成立，同时绝不泄露秘密见证向量 $w$ 的任何一个比特。",
          },
        ],
      },
      {
        id: 2,
        title: "R1CS 算术电路扁平化",
        beats: [
          {
            id: 0,
            action: "将代码逻辑拆解为加法与乘法门电路",
            title: "算术门约束分解",
            body: "高级逻辑被扁平化为一阶约束系统：$\\langle A_i, z \\rangle \\times \\langle B_i, z \\rangle = \\langle C_i, z \\rangle$，覆盖所有导线赋值。",
          },
          {
            id: 1,
            action: "组装稀疏系数约束矩阵",
            title: "稀疏矩阵形式化编译",
            body: "数百万步运算编译为大型稀疏矩阵 $(A, B, C)$，约束的完全满足严格等价于原始计算的绝对正确。",
          },
        ],
      },
      {
        id: 3,
        title: "QAP 多项式降维映射",
        beats: [
          {
            id: 0,
            action: "通过拉格朗日插值转化为连续多项式",
            title: "二次算术程序 QAP",
            body: "拉格朗日多项式插值将数百万行 R1CS 约束压缩为 $A(x)B(x) - C(x) = H(x)T(x)$，实现单点验证全量方程式。",
          },
          {
            id: 1,
            action: "应用 Schwartz-Zippel 引理进行单点检验",
            title: "Schwartz-Zippel 单点盲测",
            body: "在绝密评估点 $\\tau$ 处检查目标多项式 $T(x)$ 的整除性，将庞大检验缩减为极简的等式校验。",
          },
        ],
      },
      {
        id: 4,
        title: "椭圆曲线配对生成证明",
        beats: [
          {
            id: 0,
            action: "在配对友好曲线上隐藏计算点生成短证明",
            title: "双线性配对加密承诺",
            body: "双线性配对映射 ($e: G_1 \\times G_2 \\to G_T$) 将秘密点禁锢于群指数中，将整个证明大小压缩至 128 字节。",
          },
        ],
      },
      {
        id: 5,
        title: "O(1) 瞬时验证闭环",
        beats: [
          {
            id: 0,
            action: "执行 3 毫秒配对验证",
            title: "O(1) 简洁验证终态",
            body: "验证者仅需 3 毫秒执行三次配对运算，即可毫无保留地确认耗时数小时的复杂运算毫无篡改。",
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
          "2->3": "slide-x",
          "3->4": "push-x",
          "4->5": "crossfade",
        }}
        reducedMotion={reducedMotion || isThumbnail}
        beatLayoutModes={{
          2: "motion",
          3: "motion",
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
              <div
                className={styles.pipelineCard}
                data-beat-layout-container={
                  sceneId === 2 || sceneId === 3 ? "true" : undefined
                }
                data-beat-layout-mode={
                  sceneId === 2 || sceneId === 3 ? "motion" : undefined
                }
              >
                <div
                  className={styles.pipelineStatus}
                  data-beat-layout-item={
                    sceneId === 2 || sceneId === 3 ? "true" : undefined
                  }
                >
                  <div className={styles.statusGlow} />
                  <span>
                    {language === "zh"
                      ? "ZK-SNARK 算术流水线"
                      : "ZK-SNARK PROOF PIPELINE"}
                  </span>
                  <span>// STAGE 0{sceneId}</span>
                </div>
                <h1
                  className={styles.sceneTitle}
                  data-beat-layout-item={
                    sceneId === 2 || sceneId === 3 ? "true" : undefined
                  }
                >
                  {currentBeat.title}
                </h1>
                <p
                  className={styles.sceneBody}
                  data-beat-layout-item={
                    sceneId === 2 || sceneId === 3 ? "true" : undefined
                  }
                >
                  {currentBeat.body}
                </p>

                <div
                  className={styles.flowDiagram}
                  data-beat-layout-item={
                    sceneId === 2 || sceneId === 3 ? "true" : undefined
                  }
                >
                  <span
                    className={`${styles.flowNode} ${
                      sceneId === 1 ? styles.flowNodeActive : ""
                    }`}
                  >
                    1. WITNESS
                  </span>
                  <span>→</span>
                  <span
                    className={`${styles.flowNode} ${
                      sceneId === 2 ? styles.flowNodeActive : ""
                    }`}
                  >
                    2. R1CS
                  </span>
                  <span>→</span>
                  <span
                    className={`${styles.flowNode} ${
                      sceneId === 3 ? styles.flowNodeActive : ""
                    }`}
                  >
                    3. QAP
                  </span>
                  <span>→</span>
                  <span
                    className={`${styles.flowNode} ${
                      sceneId === 4 ? styles.flowNodeActive : ""
                    }`}
                  >
                    4. PAIRING
                  </span>
                  <span>→</span>
                  <span
                    className={`${styles.flowNode} ${
                      sceneId === 5 ? styles.flowNodeActive : ""
                    }`}
                  >
                    5. O(1) VERIFY
                  </span>
                </div>
              </div>
            </div>
          );
        }}
      />
    </div>
  );
}

export default defineTopic({
  id: "zero-knowledge-snark",
  styleId: "signal-pipeline-flow",
  title: { en: "ZK-SNARK Pipeline", zh: "零知识证明流" },
  modelId: "Gemini 3.7 Flash",
  Stage: TopicStage,
  metadata,
  navigation: { mode: "none" },
  transitionScore: {
    "1->2": "push-x",
    "2->3": "slide-x",
    "3->4": "push-x",
    "4->5": "crossfade",
  },
  evidence: {
    kind: "facts",
    sources: [
      {
        title:
          "Pinocchio: Nearly Practical Verifiable Computation (IEEE S&P 2013)",
        url: "https://ieeexplore.ieee.org/document/6547113",
        supports:
          "QAP transformation and constant-size ZK proof verification.",
      },
    ],
  },
});

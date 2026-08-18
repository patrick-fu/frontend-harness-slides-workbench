import {
  defineTopic,
  type TopicMetadata,
  type TopicStageProps,
} from "../domain/topic";
import SpatialSceneTrack from "../components/stage/SpatialSceneTrack";
import styles from "./compiler-front-back-end.module.css";

const metadata: { en: TopicMetadata; zh: TopicMetadata } = {
  en: {
    theme: "Frontend & Backend Split: Decoupling M Languages from N Targets",
    densityLabel: "Balanced",
    heroScene: 3,
    colors: {
      bg: "#f8fafc",
      ink: "#0f172a",
      panel: "#ffffff",
    },
    typography: {
      header: "System-ui 800",
      body: "System-ui 400",
    },
    tags: ["compilers", "llvm", "ssa", "architecture", "pairing"],
    fonts: ["System-ui"],
    scenes: [
      {
        id: 1,
        title: "M x N Combinatorial Wall",
        beats: [
          {
            id: 0,
            action: "Demonstrate M languages targeting N machine architectures",
            title: "M x N Monolithic Combinatorics",
            body: "Connecting M source languages directly to N hardware architectures requires M x N independent compiler translations.",
          },
        ],
      },
      {
        id: 2,
        title: "Frontend AST Parsing",
        beats: [
          {
            id: 0,
            action: "Lex source tokens into Abstract Syntax Tree",
            title: "Grammar Lexing & AST Construction",
            body: "The frontend enforces language syntax and type safety, emitting an Abstract Syntax Tree agnostic of CPU registers.",
          },
          {
            id: 1,
            action: "Lower AST to Static Single Assignment form",
            title: "SSA Intermediate Representation",
            body: "Lowering AST into Static Single Assignment (SSA) form assigns every variable exactly once, exposing dataflow dependencies.",
          },
        ],
      },
      {
        id: 3,
        title: "The SSA IR Contract",
        beats: [
          {
            id: 0,
            action: "Establish shared intermediate representation contract",
            title: "Universal IR Synchronization Seam",
            body: "Frontend and backend synchronize across a shared SSA IR contract: frontends emit IR, middle-end passes optimize IR.",
          },
          {
            id: 1,
            action: "Apply target-independent optimizations",
            title: "Dead Code & Inlining Passes",
            body: "Common subexpression elimination and loop unrolling run directly on SSA IR, benefiting all targets simultaneously.",
          },
        ],
      },
      {
        id: 4,
        title: "Backend Instruction Pipeline",
        beats: [
          {
            id: 0,
            action: "Perform target instruction selection and register allocation",
            title: "Instruction Selection & Graph Coloring",
            body: "The backend maps SSA virtual registers onto physical CPU registers via Chaitin's graph coloring algorithm.",
          },
        ],
      },
      {
        id: 5,
        title: "M + N Modular Triumph",
        beats: [
          {
            id: 0,
            action: "Celebrate M + N modular linear scaling",
            title: "M + N Architecture Victory",
            body: "A new language requires 1 new frontend; a new chip requires 1 new backend. Modularity conquers combinatorial explosion.",
          },
        ],
      },
    ],
  },
  zh: {
    theme: "编译器前后端：通过中间表示解耦 M 语言与 N 硬件",
    densityLabel: "均衡",
    heroScene: 3,
    colors: {
      bg: "#f8fafc",
      ink: "#0f172a",
      panel: "#ffffff",
    },
    typography: {
      header: "System-ui 800",
      body: "System-ui 400",
    },
    tags: ["编译器", "LLVM", "SSA", "架构", "协作看板"],
    fonts: ["System-ui"],
    scenes: [
      {
        id: 1,
        title: "MxN 组合爆炸危机",
        beats: [
          {
            id: 0,
            action: "展示 M 种语言对接 N 种芯片的组合困局",
            title: "M × N 组合爆炸壁垒",
            body: "若将 M 种源码语言直接编译为 N 种硬件指令，必须开发并维护 M × N 套完全独立的编译器实现。",
          },
        ],
      },
      {
        id: 2,
        title: "前端 AST 语法解析",
        beats: [
          {
            id: 0,
            action: "词法与语法分析构建抽象语法树",
            title: "语法分析与 AST 构建",
            body: "编译器前端负责语法检查与类型推导，生成完全独立于底层硬件寄存器的抽象语法树（AST）。",
          },
          {
            id: 1,
            action: "将 AST 降维为静态单赋值 SSA IR",
            title: "SSA 静态单赋值降维",
            body: "将语法树转换为静态单赋值形式，确保每个变量仅赋值一次，显式暴露数据流依赖关系。",
          },
        ],
      },
      {
        id: 3,
        title: "SSA IR 契约桥梁",
        beats: [
          {
            id: 0,
            action: "确立前后端唯一的共享产物契约",
            title: "通用 IR 共享同步中缝",
            body: "前后端通过唯一一份 SSA IR 契约解耦协作：前端负责生成标准化 IR，中端 Pass 负责优化 IR。",
          },
          {
            id: 1,
            action: "执行与芯片无关的通用死代码消除",
            title: "死代码消除与内联优化",
            body: "常量折叠与公共子表达式消除直接在中端 IR 上并发执行，让所有语言与芯片无差别受益。",
          },
        ],
      },
      {
        id: 4,
        title: "后端指令流水分配",
        beats: [
          {
            id: 0,
            action: "执行指令选择与图着色寄存器分配",
            title: "指令选择与图着色分配",
            body: "后端通过图着色算法将虚拟寄存器映射至物理 CPU 硬件寄存器，生成机器码二进制。",
          },
        ],
      },
      {
        id: 5,
        title: "M+N 模块化胜利",
        beats: [
          {
            id: 0,
            action: "总结 M + N 模块化工程胜利",
            title: "M + N 模块化终极胜利",
            body: "新增一门语言只需写 1 个前端，新增一款芯片只需写 1 个后端。模块化彻底终结了组合爆炸。",
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
              <div className={styles.boardHeader}>
                <span className={styles.syncTag}>
                  {language === "zh"
                    ? "编译器前后端协作看板"
                    : "COMPILER PAIRING BOARD"}
                </span>
                <span>SYNC POINT: SSA_IR_V1</span>
              </div>

              <div
                data-beat-layout-container={
                  sceneId === 2 || sceneId === 3 ? "true" : undefined
                }
                data-beat-layout-mode={
                  sceneId === 2 || sceneId === 3 ? "motion" : undefined
                }
              >
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
                  className={styles.pairingStations}
                  data-beat-layout-item={
                    sceneId === 2 || sceneId === 3 ? "true" : undefined
                  }
                >
                  <div className={styles.stationBox}>
                    <div className={styles.stationRole}>
                      FRONTEND (LEX/PARSE)
                    </div>
                    <div className={styles.stationContent}>
                      Source Code → AST
                    </div>
                  </div>
                  <div className={styles.syncBridge}>⇄ SSA IR ⇄</div>
                  <div className={styles.stationBox}>
                    <div className={styles.stationRole}>BACKEND (CODEGEN)</div>
                    <div className={styles.stationContent}>
                      SSA IR → Machine Code
                    </div>
                  </div>
                </div>
              </div>

              <div />
            </div>
          );
        }}
      />
    </div>
  );
}

export default defineTopic({
  id: "compiler-front-back-end",
  styleId: "collaborative-pairing-board",
  title: { en: "Frontend & Backend Split", zh: "编译器前后端" },
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
        title: "Engineering a Compiler (Cooper & Torczon)",
        url: "https://www.elsevier.com/books/engineering-a-compiler/cooper/978-0-12-815412-0",
        supports:
          "Decoupling language frontend and architecture backend via Intermediate Representation.",
      },
    ],
  },
});

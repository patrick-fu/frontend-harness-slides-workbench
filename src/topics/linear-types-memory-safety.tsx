import {
  defineTopic,
  type TopicMetadata,
  type TopicStageProps,
} from "../domain/topic";
import SpatialSceneTrack from "../components/stage/SpatialSceneTrack";
import styles from "./linear-types-memory-safety.module.css";

const metadata: { en: TopicMetadata; zh: TopicMetadata } = {
  en: {
    theme: "Linear Types Smash Bugs: Compile-Time Annihilation of Dangling Pointers",
    densityLabel: "Sparse",
    heroScene: 3,
    colors: {
      bg: "#fdfbf7",
      ink: "#000000",
      panel: "#fee2e2",
    },
    typography: {
      header: "Arial Black 900",
      body: "System-ui 600",
    },
    tags: ["types", "rust", "memory-safety", "agitprop", "constructivism"],
    fonts: ["Arial Black", "Impact"],
    scenes: [
      {
        id: 1,
        title: "The Manual Memory Trap",
        beats: [
          {
            id: 0,
            action: "Confront 50 years of C/C++ memory corruption vulnerabilities",
            title: "70% OF ALL CVES: MEMORY CORRUPTION",
            body: "Manual pointer arithmetic and garbage collection trade-offs have plagued computer systems with use-after-free and double-free exploits.",
          },
        ],
      },
      {
        id: 2,
        title: "The Law of Exact-Once Use",
        beats: [
          {
            id: 0,
            action: "State Girard's linear logic consumption rule",
            title: "LINEAR LOGIC: EXACTLY-ONCE CONSUMPTION",
            body: "A linear resource cannot be duplicated, shared, or silently dropped—every allocated value must be moved or consumed once.",
          },
          {
            id: 1,
            action: "Enforce borrow checker affine ownership",
            title: "AFFINE TYPES & BORROWING",
            body: "Exclusive mutable references ($\x26\\text{mut } T$) forbid aliased mutation, abolishing data races at compile time.",
          },
        ],
      },
      {
        id: 3,
        title: "Red Wedge Smashes Dangling Pointers",
        beats: [
          {
            id: 0,
            action: "Drive compile-time wedge into runtime vulnerabilities",
            title: "SMASH DANGLING POINTERS AT COMPILE TIME",
            body: "The compiler rejects spatial and temporal invalidations before machine code is ever emitted: zero runtime garbage collector pause.",
          },
        ],
      },
      {
        id: 4,
        title: "Zero-Cost Mechanical Sympathy",
        beats: [
          {
            id: 0,
            action: "Demonstrate compile-time static memory layout",
            title: "ZERO RUNTIME TAX / MAXIMUM VELOCITY",
            body: "RAII deterministic stack deallocation matches manual C velocity without sacrificing a single memory safety guarantee.",
          },
        ],
      },
      {
        id: 5,
        title: "The Type-Driven Revolution",
        beats: [
          {
            id: 0,
            action: "Declare victory of type theory over runtime bugs",
            title: "PROOF AS CODE: THE FINAL VERDICT",
            body: "Memory safety is not an operational policy—it is a mathematical theorem enforced by the type checker.",
          },
        ],
      },
    ],
  },
  zh: {
    theme: "线性类型除漏洞：编译期彻底击碎悬垂指针与内存破坏",
    densityLabel: "稀疏",
    heroScene: 3,
    colors: {
      bg: "#fdfbf7",
      ink: "#000000",
      panel: "#fee2e2",
    },
    typography: {
      header: "Arial Black 900",
      body: "System-ui 600",
    },
    tags: ["类型系统", "Rust", "内存安全", "红楔海报", "构成主义"],
    fonts: ["Arial Black", "Impact"],
    scenes: [
      {
        id: 1,
        title: "手动内存管理泥潭",
        beats: [
          {
            id: 0,
            action: "揭露五十年 C/C++ 内存破坏漏洞根源",
            title: "70% 高危漏洞源自内存破坏",
            body: "手动释放（free）与自动垃圾回收的妥协，使得野指针、释放后使用（UAF）与双重释放长期肆虐计算世界。",
          },
        ],
      },
      {
        id: 2,
        title: "有且仅消费一次法则",
        beats: [
          {
            id: 0,
            action: "引入吉拉德线性逻辑资源消费法则",
            title: "线性逻辑：有且仅消费一次",
            body: "线性资源不可被静默丢弃、不可随意复制；每一个分配的资源必须且仅能被转移消费一次。",
          },
          {
            id: 1,
            action: "借用检查器确立独占可变引用契约",
            title: "仿射所有权与排他借用",
            body: "独占可变引用（$\\&\\text{mut } T$）从根本上禁止可变别名，在编译期粉碎所有多线程数据竞争。",
          },
        ],
      },
      {
        id: 3,
        title: "红楔击碎悬垂指针",
        beats: [
          {
            id: 0,
            action: "红楔如利刃在编译期刺破运行时漏洞",
            title: "编译期彻底粉碎悬垂指针",
            body: "类型检查器在代码生成前直接拒绝所有悬垂指针与越界访问，达成零运行时垃圾回收停顿的绝对安全。",
          },
        ],
      },
      {
        id: 4,
        title: "零成本抽象物理速度",
        beats: [
          {
            id: 0,
            action: "确定性栈展开媲美纯 C 极致速度",
            title: "零运行时损耗 / 极致物理速度",
            body: "RAII 确定性析构在编译期静态求解生命周期，兼具纯 C 的极致运行吞吐与绝对的内存安全保证。",
          },
        ],
      },
      {
        id: 5,
        title: "类型驱动代码革命",
        beats: [
          {
            id: 0,
            action: "宣告类型论对运行时缺陷的终极胜利",
            title: "代码即证明：类型论终极审判",
            body: "内存安全绝非运维规章；它是类型检查器通过数学构造法严格证毕的不可动摇的形式化定理。",
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
          "3->4": "push-x",
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
              <header className={styles.agitpropHeader}>
                <span>
                  {language === "zh"
                    ? "红楔宣传画 · 类型论宣言"
                    : "RED WEDGE AGITPROP // TYPE THEORY"}
                </span>
                <span>MANIFESTO 0{sceneId} // AFFINE SAFETY</span>
              </header>

              <div
                className={styles.wedgeBody}
                data-beat-layout-container={sceneId === 2 ? "true" : undefined}
                data-beat-layout-mode={sceneId === 2 ? "motion" : undefined}
              >
                <div
                  className={styles.wedgeBadge}
                  data-beat-layout-item={sceneId === 2 ? "true" : undefined}
                >
                  ▲ LINEAR LOGIC REVOLUTION
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
              </div>

              <footer className={styles.agitpropFooter}>
                <span>CONSTRUCTIVIST TYPE SAFETY TRIBUNAL</span>
                <span>PROOF BY COMPILER // ZERO DANGEROUS OPERATIONS</span>
              </footer>
            </div>
          );
        }}
      />
    </div>
  );
}

export default defineTopic({
  id: "linear-types-memory-safety",
  styleId: "red-wedge-agitprop",
  title: { en: "Linear Types Smash Bugs", zh: "线性类型除漏洞" },
  modelId: "Gemini 3.7 Flash",
  Stage: TopicStage,
  metadata,
  navigation: { mode: "none" },
  transitionScore: {
    "1->2": "push-x",
    "2->3": "push-x",
    "3->4": "push-x",
    "4->5": "crossfade",
  },
  evidence: {
    kind: "facts",
    sources: [
      {
        title: "Linear Logic (Jean-Yves Girard, Theoretical Computer Science)",
        url: "https://www.sciencedirect.com/science/article/pii/0304397587900454",
        supports:
          "Linear resource consumption logic, affine ownership systems, and borrow checker safety.",
      },
    ],
  },
});

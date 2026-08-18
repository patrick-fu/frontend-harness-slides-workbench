import {
  defineTopic,
  type TopicMetadata,
  type TopicStageProps,
} from "../domain/topic";
import SpatialSceneTrack from "../components/stage/SpatialSceneTrack";
import styles from "./kintsugi-entropy.module.css";

const metadata: { en: TopicMetadata; zh: TopicMetadata } = {
  en: {
    theme: "Kintsugi & Entropy: Imperfect Permanence in Broken Forms",
    densityLabel: "Sparse",
    heroScene: 3,
    colors: {
      bg: "#f4efe6",
      ink: "#3c3836",
      panel: "#ebe4d8",
    },
    typography: {
      header: "Georgia 400 italic",
      body: "Georgia 300",
    },
    tags: ["craft", "philosophy", "wabi-sabi", "physics", "entropy"],
    fonts: ["Georgia"],
    scenes: [
      {
        id: 1,
        title: "The Fragile Whole",
        beats: [
          {
            id: 0,
            action: "Observe unbroken porcelain under silent tension",
            title: "Fragility of Pristine Order",
            body: "A pristine ceramic bowl embodies low thermodynamic entropy, yet its perfection conceals brittle crystalline strain.",
          },
        ],
      },
      {
        id: 2,
        title: "Fracture and Stress",
        beats: [
          {
            id: 0,
            action: "Demonstrate stress dissipation through fracture",
            title: "The Sudden Dissipation",
            body: "Mechanical impact shatters the vessel into discrete shards, releasing stored strain energy into irreversible disorder.",
          },
          {
            id: 1,
            action: "Contemplate irreparable thermodynamic dispersion",
            title: "Irreversible Trajectory",
            body: "Entropy forbids the spontaneous reassembly of shards; time flows strictly forward along the arrow of fracture.",
          },
        ],
      },
      {
        id: 3,
        title: "Urushi & Gold Binding",
        beats: [
          {
            id: 0,
            action: "Introduce raw lacquer and powdered gold joinery",
            title: "Urushi Lacquer & Gold Dust",
            body: "Natural tree resin polymerizes over weeks in high humidity, joining fissures with veins of 24-karat gold.",
          },
        ],
      },
      {
        id: 4,
        title: "Scars as Memory",
        beats: [
          {
            id: 0,
            action: "Highlight fault lines as historical topography",
            title: "Topography of Incident",
            body: "The golden seam does not conceal the fracture—it illuminates the exact geometry of the collision as historical narrative.",
          },
          {
            id: 1,
            action: "Affirm higher structural resilience",
            title: "Elastic Resilience",
            body: "Polymerized urushi confers superior tensile flexure than the original unyielding ceramic body.",
          },
        ],
      },
      {
        id: 5,
        title: "Imperfect Permanence",
        beats: [
          {
            id: 0,
            action: "Synthesize wabi-sabi aesthetics and second law",
            title: "Order Born of Decay",
            body: "Perfection is static and brittle; beauty endures only in structures that metabolize entropy into meaningful form.",
          },
        ],
      },
    ],
  },
  zh: {
    theme: "金缮与熵增：破碎之形中的不对称永恒",
    densityLabel: "稀疏",
    heroScene: 3,
    colors: {
      bg: "#f4efe6",
      ink: "#3c3836",
      panel: "#ebe4d8",
    },
    typography: {
      header: "Georgia 400 italic",
      body: "Georgia 300",
    },
    tags: ["工艺", "哲学", "侘寂", "物理", "熵增"],
    fonts: ["Georgia"],
    scenes: [
      {
        id: 1,
        title: "完整之脆",
        beats: [
          {
            id: 0,
            action: "观察完好瓷器在静默中的张力",
            title: "完好秩序的脆弱",
            body: "未经破损的陶碗看似处于极低热力学熵态，其完美形体却暗藏脆性晶格的断裂应力。",
          },
        ],
      },
      {
        id: 2,
        title: "应力与断裂",
        beats: [
          {
            id: 0,
            action: "展示应力释放与形体碎裂",
            title: "不可逆的能量释放",
            body: "外部冲击将器物崩解为独立碎片，积蓄的应变能瞬时释放为不可逆的混乱。",
          },
          {
            id: 1,
            action: "沉思热力学发散的时间之矢",
            title: "单向的时间之矢",
            body: "热力学第二定律禁止碎片自发复原；时间沿断裂痕迹单向流淌，不可逆转。",
          },
        ],
      },
      {
        id: 3,
        title: "生漆与金粉",
        beats: [
          {
            id: 0,
            action: "引入天然生漆与金粉粘结工艺",
            title: "生漆聚合与金线粘结",
            body: "天然大漆在湿润环境中缓慢氧化聚合，以纯金粉末将裂痕勾勒为发光的金色脉络。",
          },
        ],
      },
      {
        id: 4,
        title: "伤痕即记忆",
        beats: [
          {
            id: 0,
            action: "将断裂面作为历史地形展现",
            title: "事故的历史地形",
            body: "金缮从不掩饰破碎，而是以醒目的金色将撞击的几何轨迹升华为不可复制的岁月叙事。",
          },
          {
            id: 1,
            action: "肯定修复后的柔韧韧性",
            title: "漆体赋予的柔韧",
            body: "高分子聚合漆膜相比原本脆弱的无机瓷胎，反而具备更优异的抗弯延展性。",
          },
        ],
      },
      {
        id: 5,
        title: "不对称永恒",
        beats: [
          {
            id: 0,
            action: "总结侘寂美学与热力学秩序",
            title: "衰变中重生的秩序",
            body: "无瑕的完美静止且易碎；唯有能将熵增与伤痕内化为意义的形态，方得真正的永恒。",
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
        transitionKind="fade"
        transitionMap={{
          "1->2": "fade",
          "2->3": "crossfade",
          "3->4": "fade",
          "4->5": "scale-fade",
        }}
        reducedMotion={reducedMotion || isThumbnail}
        beatLayoutModes={{
          2: "motion",
          4: "motion",
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
                className={styles.contentBlock}
                data-beat-layout-container={
                  sceneId === 2 || sceneId === 4 ? "true" : undefined
                }
                data-beat-layout-mode={
                  sceneId === 2 || sceneId === 4 ? "motion" : undefined
                }
              >
                <div
                  className={styles.sealStamp}
                  data-beat-layout-item={
                    sceneId === 2 || sceneId === 4 ? "true" : undefined
                  }
                >
                  {language === "zh" ? "金缮 · 侘寂" : "KINTSUGI / ENTROPY"}
                </div>
                <h1
                  className={styles.sceneTitle}
                  data-beat-layout-item={
                    sceneId === 2 || sceneId === 4 ? "true" : undefined
                  }
                >
                  {currentBeat.title}
                </h1>
                <p
                  className={styles.sceneBody}
                  data-beat-layout-item={
                    sceneId === 2 || sceneId === 4 ? "true" : undefined
                  }
                >
                  {currentBeat.body}
                </p>
                <div
                  className={styles.goldVeinLine}
                  data-beat-layout-item={
                    sceneId === 2 || sceneId === 4 ? "true" : undefined
                  }
                />
              </div>
            </div>
          );
        }}
      />
    </div>
  );
}

export default defineTopic({
  id: "kintsugi-entropy",
  styleId: "wabi-sabi-ceramic",
  title: { en: "Kintsugi & Entropy", zh: "金缮与熵增" },
  modelId: "Gemini 3.7 Flash",
  Stage: TopicStage,
  metadata,
  navigation: { mode: "none" },
  transitionScore: {
    "1->2": "fade",
    "2->3": "crossfade",
    "3->4": "fade",
    "4->5": "scale-fade",
  },
  evidence: {
    kind: "illustrative",
    boundary: {
      en: "Conceptual physics and Japanese craft metaphor illustrating entropy and restorative order.",
      zh: "概念物理学与传统金缮工艺隐喻，展示熵增与修复秩序。",
    },
    display: "envelope",
  },
});

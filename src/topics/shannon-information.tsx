import {
  defineTopic,
  type TopicMetadata,
  type TopicStageProps,
} from "../domain/topic";
import SpatialSceneTrack from "../components/stage/SpatialSceneTrack";
import styles from "./shannon-information.module.css";

const metadata: { en: TopicMetadata; zh: TopicMetadata } = {
  en: {
    theme: "Shannon's Measure: Information as the Annihilation of Uncertainty",
    densityLabel: "Sparse",
    heroScene: 3,
    colors: {
      bg: "#090a0f",
      ink: "#f8fafc",
      panel: "#131620",
    },
    typography: {
      header: "Playfair Display 500 italic",
      body: "System-ui 300",
    },
    tags: ["information", "entropy", "shannon", "mathematics", "spotlight"],
    fonts: ["Playfair Display", "Georgia"],
    scenes: [
      {
        id: 1,
        title: "The Uncertainty Riddle",
        beats: [
          {
            id: 0,
            action: "Pose the fundamental question of communication",
            title: "“What is a message before it is sent?”",
            body: "A message is not substance or electricity—it is a choice made from a set of possible alternatives held in doubt.",
          },
        ],
      },
      {
        id: 2,
        title: "One Bit of Coin Flip",
        beats: [
          {
            id: 0,
            action: "Quantify the unbiased binary trial",
            title: "“One coin toss holds exactly one bit of surprise.”",
            body: "When probability is split 50/50, uncertainty is at its maximum. The answer resolves exactly one binary unit of freedom.",
          },
          {
            id: 1,
            action: "Demonstrate zero information in certainty",
            title: "“A predictable event communicates nothing.”",
            body: "If an outcome is guaranteed ($p = 1$), receipt of the symbol conveys zero bits: $\\log_2(1) = 0$.",
          },
        ],
      },
      {
        id: 3,
        title: "Entropy Formula",
        beats: [
          {
            id: 0,
            action: "Cast the spotlight on the master equation",
            title: "“H = -\\sum p_i \\log_2 p_i”",
            body: "Information entropy measures the average surprise of a source, unifying thermodynamics with telegraph wires.",
          },
        ],
      },
      {
        id: 4,
        title: "Redundancy & Channel",
        beats: [
          {
            id: 0,
            action: "Introduce noise immunity through redundancy",
            title: "“Redundancy is the armor against noise.”",
            body: "Natural language repeats letters to ensure meaning survives atmospheric static and copper distortion.",
          },
          {
            id: 1,
            action: "State the noisy channel capacity theorem",
            title: "“Error-free transmission exists below capacity C.”",
            body: "As long as information rate $R < C$, mathematics guarantees arbitrary error correction without slowing throughput.",
          },
        ],
      },
      {
        id: 5,
        title: "The Verdict on Chaos",
        beats: [
          {
            id: 0,
            action: "Deliver the closing philosophical attribution",
            title: "“Information is the resolution of uncertainty.”",
            body: "Claude Shannon turned abstract doubt into a measurable physical currency, building the silent foundation of our digital century.",
          },
        ],
      },
    ],
  },
  zh: {
    theme: "香农不确定性：信息即不确定性的湮灭",
    densityLabel: "稀疏",
    heroScene: 3,
    colors: {
      bg: "#090a0f",
      ink: "#f8fafc",
      panel: "#131620",
    },
    typography: {
      header: "Playfair Display 500 italic",
      body: "System-ui 300",
    },
    tags: ["信息论", "熵", "香农", "数学", "聚光灯"],
    fonts: ["Playfair Display", "Georgia"],
    scenes: [
      {
        id: 1,
        title: "不确定性之谜",
        beats: [
          {
            id: 0,
            action: "提出通信的根本哲学问题",
            title: "“一条信息在发出之前究竟是什么？”",
            body: "信息既非实体，亦非电流——它是从一组充满悬念的可能选项中做出的确凿选择。",
          },
        ],
      },
      {
        id: 2,
        title: "硬币的一比特",
        beats: [
          {
            id: 0,
            action: "量化均等二元试验的惊奇度",
            title: "“一次掷硬币蕴含恰好一比特的惊奇。”",
            body: "当概率对半分裂时，不确定性达到峰值；答案的揭晓刚好消解了一单位的自由度。",
          },
          {
            id: 1,
            action: "展示确定性事件的信息量为零",
            title: "“注定的结果不传递任何信息。”",
            body: "如果结果早已百分之百确定 ($p = 1$)，接收到该符号带来的信息量严格为零：$\\log_2(1) = 0$。",
          },
        ],
      },
      {
        id: 3,
        title: "信息熵度量",
        beats: [
          {
            id: 0,
            action: "聚光灯照亮香农信息熵主公式",
            title: "“H = -\\sum p_i \\log_2 p_i”",
            body: "信息熵度量了信源的平均惊奇度，将热力学分子运动论与电报铜线在数学上彻底统一。",
          },
        ],
      },
      {
        id: 4,
        title: "冗余与信道极限",
        beats: [
          {
            id: 0,
            action: "阐述冗余度对抗噪声的机制",
            title: "“冗余是抵御噪声的坚固盔甲。”",
            body: "自然语言反复重复字母与词根，正是为了确保核心意义能在穿过静电杂音后完好幸存。",
          },
          {
            id: 1,
            action: "陈述有噪信道编码定理",
            title: "“在容量 C 之下，零错误传输真实存在。”",
            body: "只要传输速率 $R < C$，数学就能保证通过纠错编码实现任意高精度的无损通信。",
          },
        ],
      },
      {
        id: 5,
        title: "对混乱的裁决",
        beats: [
          {
            id: 0,
            action: "给出结语与历史致敬",
            title: "“信息，即是对不确定性的消除。”",
            body: "克劳德·香农将虚无缥缈的疑惑铸造成可度量的物理通货，悄然奠定了数字文明的整座大厦。",
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
                className={styles.spotlightCard}
                data-beat-layout-container={
                  sceneId === 2 || sceneId === 4 ? "true" : undefined
                }
                data-beat-layout-mode={
                  sceneId === 2 || sceneId === 4 ? "motion" : undefined
                }
              >
                <h1
                  className={styles.quoteTitle}
                  data-beat-layout-item={
                    sceneId === 2 || sceneId === 4 ? "true" : undefined
                  }
                >
                  {currentBeat.title}
                </h1>
                <p
                  className={styles.quoteBody}
                  data-beat-layout-item={
                    sceneId === 2 || sceneId === 4 ? "true" : undefined
                  }
                >
                  {currentBeat.body}
                </p>
                <div
                  className={styles.attribution}
                  data-beat-layout-item={
                    sceneId === 2 || sceneId === 4 ? "true" : undefined
                  }
                >
                  — CLAUDE E. SHANNON, 1948
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
  id: "shannon-information",
  styleId: "spotlight-quote-poster",
  title: { en: "Shannon's Measure", zh: "香农不确定性" },
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
    kind: "facts",
    sources: [
      {
        title:
          "Bell System Technical Journal: A Mathematical Theory of Communication (1948)",
        url: "https://ieeexplore.ieee.org/document/6773024",
        supports:
          "Definition of information entropy H = -sum(p log p) and channel capacity.",
      },
    ],
  },
});

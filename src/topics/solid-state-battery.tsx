import {
  defineTopic,
  type TopicMetadata,
  type TopicStageProps,
} from "../domain/topic";
import SpatialSceneTrack from "../components/stage/SpatialSceneTrack";
import styles from "./solid-state-battery.module.css";

const metadata: { en: TopicMetadata; zh: TopicMetadata } = {
  en: {
    theme: "Solid-State Battery: 800 Wh/L Volumetric Energy Density",
    densityLabel: "Sparse",
    heroScene: 3,
    colors: {
      bg: "#0a0a0b",
      ink: "#fafafa",
      panel: "#18181b",
    },
    typography: {
      header: "Inter 700",
      body: "Inter 300",
    },
    tags: ["energy", "battery", "solid-state", "chemistry", "hardware"],
    fonts: ["Inter"],
    scenes: [
      {
        id: 1,
        title: "The Dendrite Dilemma",
        beats: [
          {
            id: 0,
            action: "Show the fundamental barrier in liquid electrolytes",
            title: "Liquid Electrolyte Limit",
            body: "Liquid electrolytes fail at high voltages due to lithium dendrite penetration and catastrophic thermal runaway.",
          },
        ],
      },
      {
        id: 2,
        title: "Solid Electrolyte Interface",
        beats: [
          {
            id: 0,
            action: "Introduce sulfide solid electrolyte separator",
            title: "Sulfide Solid Separator",
            body: "Sulfide ceramics deliver 10 mS/cm ionic conductivity at room temperature, suppressing dendrite puncture.",
          },
          {
            id: 1,
            action: "Demonstrate lithium metal anode stabilization",
            title: "Lithium Metal Anode",
            body: "Direct plating on a pure lithium metal anode eliminates heavy graphite hosts entirely.",
          },
        ],
      },
      {
        id: 3,
        title: "800 Wh/L Density Leap",
        beats: [
          {
            id: 0,
            action: "Present volumetric energy leap",
            title: "800 Wh/L Volumetric Jump",
            body: "Doubling volumetric density unlocks 1,000 km automotive range without increasing pack volume.",
          },
        ],
      },
      {
        id: 4,
        title: "Roll-to-Roll Stacking",
        beats: [
          {
            id: 0,
            action: "Explain dry electrode coating",
            title: "Dry Electrode Coating",
            body: "Solvent-free extrusion reduces manufacturing footprint and preserves ceramic interface integrity.",
          },
          {
            id: 1,
            action: "Demonstrate isostatic roll pressing",
            title: "Isostatic Roll Pressing",
            body: "Gigapascal stack pressure eliminates interfacial voids, enabling sub-15 minute fast charging.",
          },
        ],
      },
      {
        id: 5,
        title: "The Solid-State Horizon",
        beats: [
          {
            id: 0,
            action: "Declare the new energy baseline",
            title: "The Solid Baseline",
            body: "Solid-state is no longer a chemistry trade-off—it is the non-combustible foundation of electric aviation and transit.",
          },
        ],
      },
    ],
  },
  zh: {
    theme: "全固态电池：800 Wh/L 体积能量密度跨越",
    densityLabel: "稀疏",
    heroScene: 3,
    colors: {
      bg: "#0a0a0b",
      ink: "#fafafa",
      panel: "#18181b",
    },
    typography: {
      header: "Inter 700",
      body: "Inter 300",
    },
    tags: ["能源", "电池", "固态", "化学", "硬件"],
    fonts: ["Inter"],
    scenes: [
      {
        id: 1,
        title: "枝晶困局",
        beats: [
          {
            id: 0,
            action: "揭示液态电解质的物理极限",
            title: "液态电解质极限",
            body: "传统液态电解液在高压下易析出锂枝晶刺穿隔膜，引发热失控风险。",
          },
        ],
      },
      {
        id: 2,
        title: "固态界面",
        beats: [
          {
            id: 0,
            action: "引入硫化物固态电解质隔膜",
            title: "硫化物固态隔膜",
            body: "硫化物陶瓷在室温下具备 10 mS/cm 的高离子电导率，彻底物理阻断枝晶生长。",
          },
          {
            id: 1,
            action: "展示纯锂金属负极的高效嵌锂",
            title: "纯锂金属负极",
            body: "直接在锂金属上实现致密沉积，彻底省去笨重的石墨负极骨架。",
          },
        ],
      },
      {
        id: 3,
        title: "能量跃迁",
        beats: [
          {
            id: 0,
            action: "呈现体积能量密度的跨越式突破",
            title: "800 Wh/L 跃迁",
            body: "体积能量密度翻倍，在同等电池包尺寸下实现 1000 公里续航突破。",
          },
        ],
      },
      {
        id: 4,
        title: "叠片工艺",
        beats: [
          {
            id: 0,
            action: "解析干法电极涂布工艺",
            title: "干法电极涂布",
            body: "无溶剂干法挤出成膜，减少工序能耗并保护陶瓷固态电解质界面完整性。",
          },
          {
            id: 1,
            action: "展示等静压连续辊压技术",
            title: "等静压致密辊压",
            body: "吉帕级均质压力消除固固界面接触微孔，实现 15 分钟极速快充。",
          },
        ],
      },
      {
        id: 5,
        title: "能源基石",
        beats: [
          {
            id: 0,
            action: "宣告全固态电池构建的新能源基线",
            title: "固态能源基石",
            body: "全固态不仅是化学体系的升级，更是电动航空与地面交通不可燃的物理基石。",
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
        transitionKind="scale-fade"
        transitionMap={{
          "1->2": "scale-fade",
          "2->3": "crossfade",
          "3->4": "slide-x",
          "4->5": "wipe",
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
          const currentBeat = currentScene.beats[sceneBeat] || currentScene.beats[0];

          if (sceneId === 1) {
            return (
              <div className={styles.track}>
                <div className={styles.sceneContainer}>
                  <div className={styles.eyebrow}>
                    {language === "zh" ? "固态电池化学" : "Solid-State Chemistry"}
                  </div>
                  <h1 className={styles.heroTitle}>{currentBeat.title}</h1>
                  <p className={styles.heroSubtitle}>{currentBeat.body}</p>
                </div>
              </div>
            );
          }

          if (sceneId === 2) {
            return (
              <div className={styles.track}>
                <div
                  className={styles.sceneContainer}
                  data-beat-layout-container="true"
                  data-beat-layout-mode="motion"
                >
                  <div className={styles.eyebrow} data-beat-layout-item="true">
                    {language === "zh" ? "陶瓷界面突破" : "Ceramic Interface"}
                  </div>
                  <h2 className={styles.statement} data-beat-layout-item="true">
                    {currentBeat.title}
                  </h2>
                  <p className={styles.subtext} data-beat-layout-item="true">
                    {currentBeat.body}
                  </p>
                </div>
              </div>
            );
          }

          if (sceneId === 3) {
            return (
              <div className={styles.track}>
                <div className={styles.sceneContainer}>
                  <div className={styles.metricValue}>800 Wh/L</div>
                  <div className={styles.metricLabel}>
                    {language === "zh"
                      ? "体积能量密度 (Volumetric Density)"
                      : "Volumetric Energy Density"}
                  </div>
                  <p className={styles.metricDetail}>{currentBeat.body}</p>
                </div>
              </div>
            );
          }

          if (sceneId === 4) {
            return (
              <div className={styles.track}>
                <div
                  className={styles.sceneContainer}
                  data-beat-layout-container="true"
                  data-beat-layout-mode="motion"
                >
                  <div className={styles.eyebrow} data-beat-layout-item="true">
                    {language === "zh" ? "量产叠片制造" : "Manufacturing Scalability"}
                  </div>
                  <h2 className={styles.statement} data-beat-layout-item="true">
                    {currentBeat.title}
                  </h2>
                  <p className={styles.subtext} data-beat-layout-item="true">
                    {currentBeat.body}
                  </p>
                </div>
              </div>
            );
          }

          return (
            <div className={styles.track}>
              <div className={styles.sceneContainer}>
                <div className={styles.eyebrow}>
                  {language === "zh" ? "终极展望" : "The Horizon"}
                </div>
                <h1 className={styles.heroTitle}>
                  {currentBeat.title}{" "}
                  <span className={styles.closingAccent}>.</span>
                </h1>
                <p className={styles.heroSubtitle}>{currentBeat.body}</p>
              </div>
            </div>
          );
        }}
      />
    </div>
  );
}

export default defineTopic({
  id: "solid-state-battery",
  styleId: "minimal-product-keynote",
  title: { en: "Solid-State Battery", zh: "固态电池" },
  modelId: "Gemini 3.7 Flash",
  Stage: TopicStage,
  metadata,
  navigation: { mode: "none" },
  transitionScore: {
    "1->2": "scale-fade",
    "2->3": "crossfade",
    "3->4": "slide-x",
    "4->5": "wipe",
  },
  evidence: {
    kind: "facts",
    sources: [
      {
        title: "Nature Energy: Sulfide Solid-State Batteries",
        url: "https://www.nature.com/articles/s41560-021-00833-2",
        supports:
          "800 Wh/L volumetric energy density and dendrite suppression mechanisms.",
      },
    ],
  },
});

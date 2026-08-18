import {
  defineTopic,
  type TopicMetadata,
  type TopicStageProps,
} from "../domain/topic";
import SpatialSceneTrack from "../components/stage/SpatialSceneTrack";
import styles from "./continental-drift-pangaea.module.css";

const metadata: { en: TopicMetadata; zh: TopicMetadata } = {
  en: {
    theme: "Pangaea Continental Drift: Wegener's Jigsaw Puzzle of the Earth",
    densityLabel: "Balanced",
    heroScene: 3,
    colors: {
      bg: "#f4ede2",
      ink: "#292524",
      panel: "#ffffff",
    },
    typography: {
      header: "System-ui 800",
      body: "System-ui 400",
    },
    tags: ["geology", "pangaea", "tectonics", "collage", "wegener"],
    fonts: ["System-ui"],
    scenes: [
      {
        id: 1,
        title: "The Jigsaw Coastlines",
        beats: [
          {
            id: 0,
            action: "Align South American and African continental shelves",
            title: "South America & Africa Interlocking",
            body: "Alfred Wegener noticed that the Atlantic coastlines of South America and Africa fit together like torn pieces of paper.",
          },
        ],
      },
      {
        id: 2,
        title: "Transoceanic Fossil Bands",
        beats: [
          {
            id: 0,
            action: "Trace continuous Glossopteris fern fossil belts",
            title: "Glossopteris Plant Fossil Band",
            body: "Identical heavy fern seeds and Mesosaurus reptile skeletons span oceans, proving landmasses once formed an unbroken plain.",
          },
          {
            id: 1,
            action: "Correlate Paleozoic glacial striation grooves",
            title: "Concentric Glacial Striations",
            body: "Ancient glacial scratch marks point away from a single Antarctic epicenter when the southern continents are reassembled.",
          },
        ],
      },
      {
        id: 3,
        title: "Pangaea Supercontinent",
        beats: [
          {
            id: 0,
            action: "Reconstruct 250-million-year-old Pangaea supercontinent",
            title: "250 Million Years Ago: Pangaea",
            body: "All landmasses united into a single crescent continent surrounded by the Panthalassa ocean before the Triassic breakup.",
          },
        ],
      },
      {
        id: 4,
        title: "Mid-Atlantic Ridge Seafloor Spreading",
        beats: [
          {
            id: 0,
            action: "Reveal paleomagnetic zebra stripe reversals",
            title: "Paleomagnetic Zebra Stripes",
            body: "Sonar mapping revealed magma welling at the Mid-Atlantic Ridge, recording geomagnetic polarity flips as the ocean floor expanded.",
          },
        ],
      },
      {
        id: 5,
        title: "The Restless Crust",
        beats: [
          {
            id: 0,
            action: "Summarize dynamic mantle convection",
            title: "Plates Drifting on Mantle Magma",
            body: "Continents are not static anchors—they are floating puzzle pieces driven across the molten asthenosphere by deep thermal currents.",
          },
        ],
      },
    ],
  },
  zh: {
    theme: "大陆漂移拼图：魏格纳拼合盘古超大陆的地质史诗",
    densityLabel: "均衡",
    heroScene: 3,
    colors: {
      bg: "#f4ede2",
      ink: "#292524",
      panel: "#ffffff",
    },
    typography: {
      header: "System-ui 800",
      body: "System-ui 400",
    },
    tags: ["地质学", "盘古大陆", "板块构造", "剪纸拼贴", "魏格纳"],
    fonts: ["System-ui"],
    scenes: [
      {
        id: 1,
        title: "海岸线咬合拼图",
        beats: [
          {
            id: 0,
            action: "对比南美洲东岸与非洲西岸大陆架轮廓",
            title: "南美与非洲大陆边缘咬合",
            body: "气象学家魏格纳凝视地图，发现大西洋两岸的大陆架边缘严丝合缝，宛如被利刃撕裂的纸片。",
          },
        ],
      },
      {
        id: 2,
        title: "跨洋化石连续带",
        beats: [
          {
            id: 0,
            action: "连接跨越大洋的舌羊齿植物化石带",
            title: "舌羊齿跨洋化石带",
            body: "不会游泳的中龙化石与笨重的舌羊齿植物孢子跨洋分布在两大洲，证明陆地曾是同一片广袤平原。",
          },
          {
            id: 1,
            action: "比对古冰川同心放射状擦痕",
            title: "古冰川同心放射擦痕",
            body: "将南半球各大陆重新拼合后，二叠纪古冰川的冰蚀刮痕整齐指向同一个南极中心，谜团迎刃而解。",
          },
        ],
      },
      {
        id: 3,
        title: "盘古超大陆复原",
        beats: [
          {
            id: 0,
            action: "复原 2.5 亿年前盘古超大陆完整地貌",
            title: "2.5 亿年前盘古超大陆",
            body: "在三叠纪裂解之前，地球所有陆地完整拼合为巨大的新月形泛大陆，被唯一的泛大洋温柔环抱。",
          },
        ],
      },
      {
        id: 4,
        title: "大西洋中脊海底扩张",
        beats: [
          {
            id: 0,
            action: "揭示大西洋中脊古地磁斑马斑纹对称",
            title: "大洋中脊磁异常斑马纹",
            body: "深海声呐测绘揭示大洋中脊不断涌出岩浆，海底如传送带向两侧扩张，地磁倒转在海床岩石上刻下对称条纹。",
          },
        ],
      },
      {
        id: 5,
        title: "永不停歇的地壳",
        beats: [
          {
            id: 0,
            action: "总结地幔对流驱动的动态地球系统",
            title: "在炽热地幔上漂移的陆块",
            body: "大陆绝非永恒静止的基岩——它们是漂浮在炽热软流圈上的拼图片段，在深部地幔对流中奔流不息。",
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
          "3->4": "slide-x",
          "4->5": "fade",
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
              <div
                className={styles.cutoutCard}
                data-beat-layout-container={sceneId === 2 ? "true" : undefined}
                data-beat-layout-mode={sceneId === 2 ? "motion" : undefined}
              >
                <div className={styles.pinAnchor} />
                <div
                  className={styles.cutoutTag}
                  data-beat-layout-item={sceneId === 2 ? "true" : undefined}
                >
                  GEOLOGICAL COLLAGE // FIG. 0{sceneId}
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
            </div>
          );
        }}
      />
    </div>
  );
}

export default defineTopic({
  id: "continental-drift-pangaea",
  styleId: "analog-cutout-collage",
  title: { en: "Pangaea Continental Drift", zh: "大陆漂移拼图" },
  modelId: "Gemini 3.7 Flash",
  Stage: TopicStage,
  metadata,
  navigation: { mode: "none" },
  transitionScore: {
    "1->2": "fade",
    "2->3": "crossfade",
    "3->4": "slide-x",
    "4->5": "fade",
  },
  evidence: {
    kind: "facts",
    sources: [
      {
        title:
          "The Origin of Continents and Oceans (Die Entstehung der Kontinente und Ozeane, Alfred Wegener)",
        url: "https://www.nature.com/articles/116262a0",
        supports:
          "Continental jigsaw fitting, Glossopteris paleontology, and paleomagnetic seafloor spreading.",
      },
    ],
  },
});

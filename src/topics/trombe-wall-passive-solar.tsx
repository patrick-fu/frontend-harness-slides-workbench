import {
  defineTopic,
  type TopicMetadata,
  type TopicStageProps,
} from "../domain/topic";
import SpatialSceneTrack from "../components/stage/SpatialSceneTrack";
import styles from "./trombe-wall-passive-solar.module.css";

const metadata: { en: TopicMetadata; zh: TopicMetadata } = {
  en: {
    theme: "The Trombe Wall: Passive Solar Architecture and Natural Thermosiphons",
    densityLabel: "Balanced",
    heroScene: 3,
    colors: {
      bg: "#fdfbf7",
      ink: "#1e1b4b",
      panel: "#fef3c7",
    },
    typography: {
      header: "Bodoni 700",
      body: "System-ui 400",
    },
    tags: ["architecture", "solar", "energy", "thermodynamics", "biennale"],
    fonts: ["Bodoni MT", "Cinzel"],
    scenes: [
      {
        id: 1,
        title: "Light on the Southern Facade",
        beats: [
          {
            id: 0,
            action: "Illuminate dark masonry wall behind glazing",
            title: "The South-Facing Glazed Mass",
            body: "Winter sunlight penetrates a double-pane glass curtain, striking a 40-centimeter dark high-density concrete thermal wall.",
          },
        ],
      },
      {
        id: 2,
        title: "Dark Mass and Thermal Lag",
        beats: [
          {
            id: 0,
            action: "Absorb solar radiation into high specific heat capacity",
            title: "8-Hour Conductive Thermal Lag",
            body: "The thick concrete absorbs shortwave radiation; conductive heat takes 8 hours to migrate across the mass to the inner room.",
          },
          {
            id: 1,
            action: "Radiate warmth into evening living spaces",
            title: "Midnight Radiant Release",
            body: "As outdoor temperatures plummet after sunset, the indoor wall surface radiates gentle longwave infrared into the building.",
          },
        ],
      },
      {
        id: 3,
        title: "The Thermosiphon Loop",
        beats: [
          {
            id: 0,
            action: "Circulate air through buoyant convection channels",
            title: "Buoyancy-Driven Thermosiphon",
            body: "Sun-heated air between glass and wall expands, rising through upper vents to draw cold room air through bottom dampers.",
          },
        ],
      },
      {
        id: 4,
        title: "Seasonal Reversal",
        beats: [
          {
            id: 0,
            action: "Toggle exterior dampers for summer chimney exhaust",
            title: "Solar Chimney Cooling Exhaust",
            body: "In summer, upper exterior exhaust dampers open, transforming solar buoyancy into a natural exhaust draft that cools the house.",
          },
        ],
      },
      {
        id: 5,
        title: "Architecture as an Engine",
        beats: [
          {
            id: 0,
            action: "Proclaim zero-energy thermodynamic building manifesto",
            title: "The Zero-Watt Thermodynamic Engine",
            body: "Without a single motor or circuit, geometry and sunlight convert static brick and glass into a self-regulating thermal engine.",
          },
        ],
      },
    ],
  },
  zh: {
    theme: "特朗布墙：被动式太阳能建筑与热虹吸自发循环",
    densityLabel: "均衡",
    heroScene: 3,
    colors: {
      bg: "#fdfbf7",
      ink: "#1e1b4b",
      panel: "#fef3c7",
    },
    typography: {
      header: "Bodoni 700",
      body: "System-ui 400",
    },
    tags: ["建筑", "太阳能", "能源", "热力学", "双年展海报"],
    fonts: ["Bodoni MT", "Cinzel"],
    scenes: [
      {
        id: 1,
        title: "南向阳光倾泻",
        beats: [
          {
            id: 0,
            action: "冬日阳光穿透双层玻璃照射重质蓄热墙",
            title: "南向玻璃幕墙与集热暗面",
            body: "冬日低角度太阳光穿透外层双层玻璃，直射在 40 厘米厚的深色高密度重质混凝土蓄热墙上。",
          },
        ],
      },
      {
        id: 2,
        title: "重质蓄热与热延迟",
        beats: [
          {
            id: 0,
            action: "高比热容混凝土吸收短波辐射并缓慢导热",
            title: "8 小时导热延迟效应",
            body: "厚重混凝土吸收大量太阳短波辐射，热量在实体材料中缓慢传导，耗时 8 小时方才穿透至室内墙面。",
          },
          {
            id: 1,
            action: "午夜向室内释放舒适的长波红外辐射热",
            title: "午夜长波红外辐射供暖",
            body: "日落后室外气温骤降，室内墙面开始源源不断向房间辐射温和的长波红外热量，实现零能耗夜间恒温。",
          },
        ],
      },
      {
        id: 3,
        title: "热虹吸自发对流",
        beats: [
          {
            id: 0,
            action: "空气受热浮力上升形成自发热对流闭环",
            title: "浮力驱动热虹吸循环",
            body: "玻璃与墙体间空气受热膨胀密度降低，从上部通风口涌入室内，同时从下部抽吸冷空气，形成无动力自发循环。",
          },
        ],
      },
      {
        id: 4,
        title: "夏冬两季阀门智慧",
        beats: [
          {
            id: 0,
            action: "夏季开启外侧排风口转化为太阳能拔风烟囱",
            title: "太阳能拔风烟囱自发制冷",
            body: "夏季关闭室内通道、开启外侧排风口，太阳热浮力将室内闷热空气自发抽吸排出，实现零能耗自然通风降温。",
          },
        ],
      },
      {
        id: 5,
        title: "建筑即热力学引擎",
        beats: [
          {
            id: 0,
            action: "总结建筑与自然和谐共生的热力学宣言",
            title: "零电耗的热力学建筑引擎",
            body: "无需一台风机，亦无一度电能；重质砖墙与玻璃利用纯粹的热力学规律，构筑起与太阳同频呼吸的永恒建筑。",
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
          "2->3": "scale-fade",
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
              <header className={styles.posterHeader}>
                <span className={styles.posterTag}>
                  {language === "zh"
                    ? "日光双年展建筑特展"
                    : "SOLAR BIENNALE ARCHITECTURE EXHIBIT"}
                </span>
                <span style={{ fontFamily: "monospace", fontSize: "0.85cqw" }}>
                  TROMBE-1964 // ACT 0{sceneId}
                </span>
              </header>

              <div
                className={styles.posterBody}
                data-beat-layout-container={sceneId === 2 ? "true" : undefined}
                data-beat-layout-mode={sceneId === 2 ? "motion" : undefined}
              >
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

              <footer className={styles.posterFooter}>
                <span>THERMAL CAPACITY: 40CM CONCRETE MASS</span>
                <span>PASSIVE SOLAR HARVESTING MANIFESTO</span>
              </footer>
            </div>
          );
        }}
      />
    </div>
  );
}

export default defineTopic({
  id: "trombe-wall-passive-solar",
  styleId: "solar-biennale-poster",
  title: { en: "The Trombe Wall", zh: "特朗布墙" },
  modelId: "Gemini 3.7 Flash",
  Stage: TopicStage,
  metadata,
  navigation: { mode: "none" },
  transitionScore: {
    "1->2": "scale-fade",
    "2->3": "scale-fade",
    "3->4": "slide-x",
    "4->5": "crossfade",
  },
  evidence: {
    kind: "facts",
    sources: [
      {
        title: "Passive Solar Building Design & Trombe Wall Systems (ASHRAE)",
        url: "https://www.ashrae.org/technical-resources/standards-and-guidelines",
        supports:
          "Thermal lag calculations and thermosiphon convection airflow dynamics.",
      },
    ],
  },
});

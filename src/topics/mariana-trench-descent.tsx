import {
  defineTopic,
  type TopicMetadata,
  type TopicStageProps,
} from "../domain/topic";
import SpatialSceneTrack from "../components/stage/SpatialSceneTrack";
import styles from "./mariana-trench-descent.module.css";

const metadata: { en: TopicMetadata; zh: TopicMetadata } = {
  en: {
    theme: "Mariana Trench Descent: Extreme Hydrostatic Engineering at 10,994M",
    densityLabel: "Dense",
    heroScene: 3,
    colors: {
      bg: "#0f2b38",
      ink: "#f1f5f9",
      panel: "#020617",
    },
    typography: {
      header: "Impact 900",
      body: "System-ui 400",
    },
    tags: ["ocean", "deep-sea", "expedition", "screenprint", "hydrostatic"],
    fonts: ["Impact", "Arial Black"],
    scenes: [
      {
        id: 1,
        title: "Abyssal Midnight Descent",
        beats: [
          {
            id: 0,
            action: "Plunge into Challenger Deep bathyal zone",
            title: "Descent Past the Hadal Threshold",
            body: "The submersible drops through sunlight, twilight, and midnight zones into the hadal trench—10,994 meters beneath the surface.",
          },
        ],
      },
      {
        id: 2,
        title: "1,100 Atmosphere Titanium Sphere",
        beats: [
          {
            id: 0,
            action: "Resist crushing 110 MPa hydrostatic pressure",
            title: "Forged Titanium Pressure Sphere",
            body: "A 90mm-thick forged titanium sphere compresses by several millimeters under 1,100 atmospheres without buckling.",
          },
          {
            id: 1,
            action: "Balance syntactic foam syntactic buoyancy",
            title: "Syntactic Glass Microsphere Foam",
            body: "Millions of hollow glass microspheres embedded in epoxy provide non-compressible buoyancy in near-freezing 1°C water.",
          },
        ],
      },
      {
        id: 3,
        title: "Challenger Deep Touchdown",
        beats: [
          {
            id: 0,
            action: "Touch down on diatomaceous abyssal silt bed",
            title: "Touchdown at 10,994 Meters",
            body: "Floodlights illuminate pale diatomaceous ooze silt; endemic amphipods and translucent snailfish thrive under impossible pressure.",
          },
        ],
      },
      {
        id: 4,
        title: "Subduction Silt Core Sampling",
        beats: [
          {
            id: 0,
            action: "Retrieve robotic sediment core from Pacific subduction plate",
            title: "Pacific Plate Subduction Core",
            body: "Hydraulic manipulators drive titanium core tubes into benthic sediment, capturing mantle volatiles and ancient microbial DNA.",
          },
        ],
      },
      {
        id: 5,
        title: "The Oceanic Abyss Conquered",
        beats: [
          {
            id: 0,
            action: "Drop steel ascent weights and ascend to sunlight",
            title: "Ascent from the Deepest Abyss",
            body: "Electromagnetic release locks drop 500kg of ballast iron, propelling the vessel upward through six miles of silent water to the sun.",
          },
        ],
      },
    ],
  },
  zh: {
    theme: "马里亚纳深潜：挑战者深渊万米极限流体静压工程",
    densityLabel: "密集",
    heroScene: 3,
    colors: {
      bg: "#0f2b38",
      ink: "#f1f5f9",
      panel: "#020617",
    },
    typography: {
      header: "Impact 900",
      body: "System-ui 400",
    },
    tags: ["海洋", "深潜", "探险", "丝网印", "深渊工程"],
    fonts: ["Impact", "Arial Black"],
    scenes: [
      {
        id: 1,
        title: "超深渊带暗夜下潜",
        beats: [
          {
            id: 0,
            action: "潜航器穿透透光层直坠挑战者深渊",
            title: "穿透万米深渊带边界",
            body: "载人潜水器穿越透光层、弱光层与无光黑夜层，向地球最深的挑战者深渊 10,994 米洋底孤独坠落。",
          },
        ],
      },
      {
        id: 2,
        title: "千个大气压钛球舱",
        beats: [
          {
            id: 0,
            action: "90mm 厚锻造钛合金载人球舱抵御超高静压",
            title: "90mm 锻造钛合金载人球",
            body: "在 1100 个标准大气压（110兆帕）的毁灭性流体静压下，载人钛合金球舱整体微缩数毫米而不发生屈曲失稳。",
          },
          {
            id: 1,
            action: "微珠固体浮力材料提供不可压缩浮力",
            title: "空心玻璃微珠固体浮力材",
            body: "数以亿计的高强空心玻璃微珠环氧树脂块，在 1°C 冰点深海中提供恒定不可压缩的绝对浮力储备。",
          },
        ],
      },
      {
        id: 3,
        title: "万米深渊触底探索",
        beats: [
          {
            id: 0,
            action: "探照灯照亮万米海底硅藻泥与特有端足类生物",
            title: "10,994 米洋底触底着陆",
            body: "高功率探照灯划破永恒黑暗，照亮白色的硅藻软泥海床；特有的白色狮子鱼与端足类生物在不可思议的超高压下从容游弋。",
          },
        ],
      },
      {
        id: 4,
        title: "板块俯冲带取样",
        beats: [
          {
            id: 0,
            action: "液压机械臂钻取太平洋板块俯冲带沉积柱状样",
            title: "太平洋板块俯冲带取样",
            body: "液压机械臂将钛合金取样管深深打入俯冲带海沟沉积层，捕获深部地幔气体挥发物与古老的深渊嗜极微生物。",
          },
        ],
      },
      {
        id: 5,
        title: "深渊归来重见天日",
        beats: [
          {
            id: 0,
            action: "电磁抛载数百公斤铸铁压载铁浮升重见阳光",
            title: "抛载重返万米阳光海面",
            body: "电磁锁断电抛弃 500 公斤压载铁，潜水器化作水下火箭穿透六英里厚的静默深海，破浪而出重见万丈霞光。",
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
              <header className={styles.expeditionHeader}>
                <span>
                  {language === "zh"
                    ? "深海深潜探险海报"
                    : "HADAL EXPEDITION // CHALLENGER DEEP"}
                </span>
                <span className={styles.depthIndicator}>
                  {sceneId === 3 ? "DEPTH: 10,994 M" : `STAGE 0${sceneId}`}
                </span>
              </header>

              <div
                className={styles.expeditionBody}
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

              <footer className={styles.expeditionFooter}>
                <span>HYDROSTATIC PRESSURE: 110 MPA (1,100 ATM)</span>
                <span>BATHYSCAPHE RECORD OF SCIENTIFIC DESCENT</span>
              </footer>
            </div>
          );
        }}
      />
    </div>
  );
}

export default defineTopic({
  id: "mariana-trench-descent",
  styleId: "expedition-screenprint",
  title: { en: "Mariana Trench Descent", zh: "马里亚纳深潜" },
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
        title: "NOAA Ocean Exploration: Challenger Deep Expedition Data",
        url: "https://oceanexplorer.noaa.gov/explorations/explorations.html",
        supports:
          "10,994m maximum depth soundings, 110 MPa hydrostatic pressure, and titanium sphere compression.",
      },
    ],
  },
});

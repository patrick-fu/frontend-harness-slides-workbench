import {
  defineTopic,
  type TopicMetadata,
  type TopicStageProps,
} from "../domain/topic";
import SpatialSceneTrack from "../components/stage/SpatialSceneTrack";
import styles from "./eames-lounge-chair-molding.module.css";

const metadata: { en: TopicMetadata; zh: TopicMetadata } = {
  en: {
    theme: "Molded Plywood: Charles and Ray Eames Organic Shell Revolution",
    densityLabel: "Balanced",
    heroScene: 3,
    colors: {
      bg: "#2b3a2f",
      ink: "#f4f1ea",
      panel: "#d4a373",
    },
    typography: {
      header: "Futura 700",
      body: "Georgia 400",
    },
    tags: ["design", "mid-century", "eames", "furniture", "architecture"],
    fonts: ["Futura", "Georgia", "serif"],
    scenes: [
      {
        id: 1,
        title: "Solid Wood Stagnation",
        beats: [
          {
            id: 0,
            action: "Identify the weight and structural limitations of solid timber",
            title: "Rigid Timber Limitations",
            body: "Heavy Victorian furniture relied on solid hand-carved wood that cracked under tension and resisted ergonomic body curves.",
          },
        ],
      },
      {
        id: 2,
        title: "The Kazam Machine",
        beats: [
          {
            id: 0,
            action: "Invent steam-heated hydraulic press for compound curvature",
            title: "Hydraulic Heat & Compound Curves",
            body: "Charles and Ray built the homemade 'Kazam!' press in their apartment, curing thin veneer sandwiches under continuous steam pressure.",
          },
          {
            id: 1,
            action: "Compound 3D organic wood warping",
            title: "Bending Wood in Two Directions",
            body: "Compound molding forced perpendicular grain sheets into saddle-like double curves without splitting wood fibers.",
          },
        ],
      },
      {
        id: 3,
        title: "5-Ply Molded Shell & Mounts",
        beats: [
          {
            id: 0,
            action: "Assemble five layers of Brazilian rosewood with vulcanized rubber shock mounts",
            title: "5-Ply Veneer & Shock Mounts",
            body: "Five precision-sliced veneer plies bonded with synthetic resin and anchored by vulcanized rubber mounts absorbed dynamic sitting energy.",
          },
        ],
      },
      {
        id: 4,
        title: "Organic Spine Contouring",
        beats: [
          {
            id: 0,
            action: "Fit the natural curvature of the lumbar and thoracic spine",
            title: "Welcoming Glove of Comfort",
            body: "The sculpted backrest tilted at 15 degrees, transferring seated load away from the lumbar spine into organic continuous support.",
          },
        ],
      },
      {
        id: 5,
        title: "Democratic Design Legacy",
        beats: [
          {
            id: 0,
            action: "Establish the gold standard for mass-produced modernist furniture",
            title: "Timeless Modernist Icon",
            body: "From wartime splints to iconic museum lounges, molded plywood transformed cold industrial materials into warm human sanctuaries.",
          },
        ],
      },
    ],
  },
  zh: {
    theme: "曲木成型工艺：伊姆斯夫妇的有机胶合板设计革命",
    densityLabel: "均衡",
    heroScene: 3,
    colors: {
      bg: "#2b3a2f",
      ink: "#f4f1ea",
      panel: "#d4a373",
    },
    typography: {
      header: "Futura 700",
      body: "Georgia 400",
    },
    tags: ["设计", "中世纪现代", "伊姆斯", "家具", "人体工学"],
    fonts: ["Futura", "Georgia", "serif"],
    scenes: [
      {
        id: 1,
        title: "传统实木笨重困局",
        beats: [
          {
            id: 0,
            action: "指出传统实木雕刻笨重且抗拉伸裂变的天然缺陷",
            title: "传统实木的刚性局限",
            body: "维多利亚时代的厚重实木家具不仅自重大、容易受潮开裂，且极难雕琢出完全贴合人体脊柱的有机连续曲面。",
          },
        ],
      },
      {
        id: 2,
        title: "自制卡赞模具机",
        beats: [
          {
            id: 0,
            action: "发明蒸汽加压液压装置 Kazam Machine",
            title: "蒸汽加压与双向复合弯曲",
            body: "伊姆斯夫妇在公寓自制了名为 Kazam 的蒸汽模具机，将多层薄木单板在恒温高压下热压弯曲。",
          },
          {
            id: 1,
            action: "实现薄木板三维双向曲面拉伸",
            title: "薄木纤维的三维有机延展",
            body: "正交交错的木纹单板在热压模具中顺从拉伸，首次在木材上实现了如马鞍般坚韧且不开裂的连续双向复合曲面。",
          },
        ],
      },
      {
        id: 3,
        title: "五层胶合与橡胶缓冲",
        beats: [
          {
            id: 0,
            action: "合成五层巴西红木薄板与硫化橡胶减震缓冲件",
            title: "五层薄板与天然橡胶缓冲件",
            body: "五层精密切割的单板与合成树脂在高压下凝固，并通过硫化天然橡胶减震件与金属底座软性连接，动态化解坐姿重力。",
          },
        ],
      },
      {
        id: 4,
        title: "贴合脊柱有机雕塑",
        beats: [
          {
            id: 0,
            action: "精准贴合腰椎与胸椎的人体工学曲率",
            title: "棒球手套般的温暖承托",
            body: "后倾 15 度的三段式外壳如同一只用旧的棒球手套，将人体重心自然卸至靠背，成为工业与人体解剖学的完美共鸣。",
          },
        ],
      },
      {
        id: 5,
        title: "现代工业设计丰碑",
        beats: [
          {
            id: 0,
            action: "确立现代主义工业家具与大众审美的永恒典范",
            title: "温暖的工业现代主义典范",
            body: "从二战伤员战地夹板到纽约现代艺术博物馆永久馆藏，曲木工艺将冰冷的工业批量生产淬炼为了温暖的人类庇护所。",
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
        transitionKind="crossfade"
        transitionMap={{
          "1->2": "crossfade",
          "2->3": "crossfade",
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
              <div className={styles.topRibbon}>
                <span className={styles.badge}>MID-CENTURY GROVE</span>
                <span className={styles.serial}>HERMAN MILLER // EAMES 1956</span>
              </div>

              <div
                className={styles.woodPanel}
                data-beat-layout-container={sceneId === 2 ? "true" : undefined}
                data-beat-layout-mode={sceneId === 2 ? "motion" : undefined}
              >
                <div
                  className={styles.organicTag}
                  data-beat-layout-item={sceneId === 2 ? "true" : undefined}
                >
                  {language === "zh" ? "伊姆斯曲木成型工艺" : "MOLDED PLYWOOD SCULPTURE"}
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
                  className={styles.specGrid}
                  data-beat-layout-item={sceneId === 2 ? "true" : undefined}
                >
                  <div className={styles.specItem}>
                    <span className={styles.specLabel}>PLY COUNT</span>
                    <span className={styles.specValue}>5-Ply Hardwood Veneer</span>
                  </div>
                  <div className={styles.specItem}>
                    <span className={styles.specLabel}>RECLINE ANGLE</span>
                    <span className={styles.specValue}>15.0° Ergonomic Tilt</span>
                  </div>
                  <div className={styles.specItem}>
                    <span className={styles.specLabel}>CONNECTOR</span>
                    <span className={styles.specValue}>Vulcanized Shock Mounts</span>
                  </div>
                </div>
              </div>

              <div className={styles.footNote}>
                CHARLES & RAY EAMES // ORGANIC DESIGN IN HOME FURNISHINGS
              </div>
            </div>
          );
        }}
      />
    </div>
  );
}

export default defineTopic({
  id: "eames-lounge-chair-molding",
  styleId: "mid-century-grove",
  title: { en: "Eames Plywood Molding", zh: "伊姆斯曲木" },
  modelId: "Gemini 3.7 Flash",
  Stage: TopicStage,
  metadata,
  navigation: { mode: "none" },
  transitionScore: {
    "1->2": "crossfade",
    "2->3": "crossfade",
    "3->4": "slide-x",
    "4->5": "crossfade",
  },
  evidence: {
    kind: "facts",
    sources: [
      {
        title: "Eames Design: The Work of the Office of Charles and Ray Eames",
        url: "https://www.eamesoffice.com/the-work/eames-lounge-chair-and-ottoman/",
        supports:
          "5-ply molded plywood process, Kazam machine steam press, and vulcanized rubber shock mounts.",
      },
    ],
  },
});

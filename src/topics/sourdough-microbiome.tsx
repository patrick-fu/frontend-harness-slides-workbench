import {
  defineTopic,
  type TopicMetadata,
  type TopicStageProps,
} from "../domain/topic";
import SpatialSceneTrack from "../components/stage/SpatialSceneTrack";
import styles from "./sourdough-microbiome.module.css";

const metadata: { en: TopicMetadata; zh: TopicMetadata } = {
  en: {
    theme: "Sourdough Fermentation: Wild Yeast and Lactic Acid Symbiosis",
    densityLabel: "Dense",
    heroScene: 3,
    colors: {
      bg: "#fdf8f0",
      ink: "#3e2723",
      panel: "#fffbeb",
    },
    typography: {
      header: "System-ui 800",
      body: "System-ui 400",
    },
    tags: ["culinary", "microbiology", "fermentation", "kitchen", "bread"],
    fonts: ["System-ui"],
    scenes: [
      {
        id: 1,
        title: "Flour Water and Microbes",
        beats: [
          {
            id: 0,
            action: "Blend raw flour and ambient microbial inoculants",
            title: "Hydration and Native Inoculants",
            body: "Mixing equal weights of whole grain rye and water awakens wild Saccharomyces cerevisiae yeasts and Fructilactobacillus sanfranciscensis.",
          },
        ],
      },
      {
        id: 2,
        title: "Lactic Acid Acidification",
        beats: [
          {
            id: 0,
            action: "Produce lactic and acetic acid to drop pH below 4.0",
            title: "pH Cascade Suppression",
            body: "Lactic acid bacteria convert maltose into lactic acid, driving pH below 3.8 to eliminate pathogenetic molds and putrefactive bacteria.",
          },
          {
            id: 1,
            action: "Activate native phytase enzymes",
            title: "Phytase Mineral Release",
            body: "Acidification activates cereal phytase, breaking down phytates to liberate bioavailable magnesium, iron, and zinc.",
          },
        ],
      },
      {
        id: 3,
        title: "Gluten Gas Retention",
        beats: [
          {
            id: 0,
            action: "Develop elastic gluten matrix holding CO2 alveoli",
            title: "Viscoelastic Gluten Matrix",
            body: "Glutenin and gliadin cross-link under mechanical autolysis, trapping millions of microscopic carbon dioxide bubbles in an open crumb.",
          },
          {
            id: 1,
            action: "Showcase alveolar cell expansion",
            title: "Alveolar Gas Cell Expansion",
            body: "Gas pressure expands gluten pockets by 300% without tearing, building the signature airy, custard-like sourdough crumb.",
          },
        ],
      },
      {
        id: 4,
        title: "Flavor Ester Maturation",
        beats: [
          {
            id: 0,
            action: "Synthesize aromatic aldehydes and fruity esters",
            title: "Cold Retardation Esters",
            body: "A 24-hour cold proof at 4°C slows gas production while enzymes generate complex lactic esters, giving rich tangy aromas.",
          },
        ],
      },
      {
        id: 5,
        title: "The Maillard Crust",
        beats: [
          {
            id: 0,
            action: "Bake under steam for blistered caramelization",
            title: "Blistered Caramelized Crust",
            body: "Oven steam gelatinizes surface starches at 240°C, producing a blistered, golden-amber crust through deep Maillard reactions.",
          },
        ],
      },
    ],
  },
  zh: {
    theme: "酸种酵母发酵：野生酵母与乳酸菌共生转化",
    densityLabel: "密集",
    heroScene: 3,
    colors: {
      bg: "#fdf8f0",
      ink: "#3e2723",
      panel: "#fffbeb",
    },
    typography: {
      header: "System-ui 800",
      body: "System-ui 400",
    },
    tags: ["烹饪", "微生物", "发酵", "厨房", "面包"],
    fonts: ["System-ui"],
    scenes: [
      {
        id: 1,
        title: "面粉水与初始菌群",
        beats: [
          {
            id: 0,
            action: "水合唤醒野生酵母与杂菌群落",
            title: "水合作用与野生菌种",
            body: "黑麦面粉与等重水混合后，麦粒表皮自带的野生酵母菌与旧金山乳酸杆菌被水合激活。",
          },
        ],
      },
      {
        id: 2,
        title: "产酸降 pH 压制杂菌",
        beats: [
          {
            id: 0,
            action: "乳酸菌产酸压低 pH 至 3.8 灭菌",
            title: "pH 酸降与微生态垄断",
            body: "乳酸菌消耗麦芽糖生成大量乳酸与乙酸，将 pH 骤降至 3.8 以下，自然灭杀所有有害腐败杂菌。",
          },
          {
            id: 1,
            action: "激活植酸酶释放矿物质",
            title: "植酸降解释放矿质",
            body: "酸性环境激活谷物自身植酸酶，分解阻碍吸收的植酸盐，释放出游离态的铁、锌与镁元素。",
          },
        ],
      },
      {
        id: 3,
        title: "面筋网络滞留气体",
        beats: [
          {
            id: 0,
            action: "水解生成粘弹性面筋网络",
            title: "粘弹性面筋骨架形成",
            body: "麦谷蛋白与醇溶蛋白在自解水合下交织成致密三维网状薄膜，牢牢捕获酵母释放的二氧化碳微气泡。",
          },
          {
            id: 1,
            action: "展示开放性气孔蜂窝结构",
            title: "气孔蜂窝状三倍膨胀",
            body: "发酵气体将面筋薄壁均匀撑大 300% 且保持不破裂，构筑起酸面包标志性的多孔水润内部组织。",
          },
        ],
      },
      {
        id: 4,
        title: "复杂风味酯类熟成",
        beats: [
          {
            id: 0,
            action: "低温冷藏延时熟成芳香物质",
            title: "低温冷藏生成芳香酯",
            body: "4°C 低温冷藏延缓产气速度，使水解酶充分积累芳香酯与前驱氨基酸，赋予面包丰富微酸甘甜层次。",
          },
        ],
      },
      {
        id: 5,
        title: "美拉德焦香烘烤",
        beats: [
          {
            id: 0,
            action: "高温蒸汽烘烤完成焦糖化脆壳",
            title: "金黄酥脆焦香外壳",
            body: "240°C 高温蒸汽使表面淀粉糊化，深层美拉德反应爆发出琥珀色脆壳与诱人焦香麦香。",
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
                className={styles.prepBoard}
                data-beat-layout-container={
                  sceneId === 2 || sceneId === 3 ? "true" : undefined
                }
                data-beat-layout-mode={
                  sceneId === 2 || sceneId === 3 ? "motion" : undefined
                }
              >
                <div
                  className={styles.prepStepBadge}
                  data-beat-layout-item={
                    sceneId === 2 || sceneId === 3 ? "true" : undefined
                  }
                >
                  🥖 {language === "zh" ? "酸种备料台" : "SOURDOUGH PREP"} //
                  STEP 0{sceneId}
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
                  className={styles.ingredientsGrid}
                  data-beat-layout-item={
                    sceneId === 2 || sceneId === 3 ? "true" : undefined
                  }
                >
                  <div className={styles.ingredientItem}>
                    <div className={styles.ingredientName}>🌾 FLOUR + WATER</div>
                    <p className={styles.ingredientDesc}>
                      100% hydration whole rye base
                    </p>
                  </div>
                  <div className={styles.ingredientItem}>
                    <div className={styles.ingredientName}>🦠 LAB BACTERIA</div>
                    <p className={styles.ingredientDesc}>
                      pH 3.8 acid barrier against mold
                    </p>
                  </div>
                  <div className={styles.ingredientItem}>
                    <div className={styles.ingredientName}>🫧 WILD YEAST</div>
                    <p className={styles.ingredientDesc}>
                      CO2 gas pockets inside gluten
                    </p>
                  </div>
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
  id: "sourdough-microbiome",
  styleId: "kitchen-prep-station",
  title: { en: "Sourdough Fermentation", zh: "酸种酵母发酵" },
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
    kind: "mixed",
    sources: [
      {
        title: "Nature Microbiology: Sourdough Microbiome Diversity",
        url: "https://www.nature.com/articles/s41564-020-00849-0",
        supports:
          "Lactic acid bacteria and yeast symbiotic ecology in sourdough.",
      },
    ],
    boundary: {
      en: "Culinary biochemistry illustrated as kitchen prep steps.",
      zh: "烹饪生物化学原理解析，以厨房备料步骤生动展示。",
    },
    display: "envelope",
  },
});

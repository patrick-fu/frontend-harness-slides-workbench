import {
  defineTopic,
  type TopicMetadata,
  type TopicStageProps,
} from "../domain/topic";
import SpatialSceneTrack from "../components/stage/SpatialSceneTrack";
import styles from "./ginkgo-biloba-living-fossil.module.css";

const metadata: { en: TopicMetadata; zh: TopicMetadata } = {
  en: {
    theme: "Ginkgo Biloba Plate: Anatomy of a 270-Million-Year Living Fossil",
    densityLabel: "Dense",
    heroScene: 3,
    colors: {
      bg: "#fbf7ee",
      ink: "#382e25",
      panel: "#f2ece0",
    },
    typography: {
      header: "Garamond 700",
      body: "Garamond 400",
    },
    tags: ["botany", "evolution", "herbarium", "ginkgo", "specimen"],
    fonts: ["Garamond", "Georgia"],
    scenes: [
      {
        id: 1,
        title: "Dichotomous Fan Venation",
        beats: [
          {
            id: 0,
            action: "Examine primitive bifurcating fan leaf structure",
            title: "Dichotomous Vein Architecture",
            body: "Ginkgo leaves feature archaic dichotomous venation—veins fork repeatedly in pairs without the cross-reticulation of modern flowering plants.",
          },
        ],
      },
      {
        id: 2,
        title: "Motile Flagellated Sperm",
        beats: [
          {
            id: 0,
            action: "Observe ancient motile swimming spermatozoids",
            title: "Pre-Cycad Motile Swimming Sperm",
            body: "Along with cycads, Ginkgo is the only seed plant whose fertilization relies on thousands of spiraling flagella swimming in ovular fluid.",
          },
          {
            id: 1,
            action: "Trace gymnosperm evolutionary divergence",
            title: "270 Million Year Lineage",
            body: "Fossil specimens from the Permian era show identical leaf morphology, surviving four global mass extinctions unscathed.",
          },
        ],
      },
      {
        id: 3,
        title: "Ginkgolide Terpene Shield",
        beats: [
          {
            id: 0,
            action: "Isolate unique bioactive diterpene ginkgolides",
            title: "Ginkgolide Biochemical Armor",
            body: "Unique trilactonic diterpenes (ginkgolides A, B, C) repel herbivorous insects, wood-decay fungi, and environmental bacterial pathogens.",
          },
        ],
      },
      {
        id: 4,
        title: "Radiation & Fire Resilience",
        beats: [
          {
            id: 0,
            action: "Observe post-atomic dormant subterranean bud reactivation",
            title: "Subterranean Dormant Bud Sprouting",
            body: "Six trees survived within 1.5 km of the 1945 Hiroshima blast epicenter, their lignotubers sprouting new trunks within months.",
          },
        ],
      },
      {
        id: 5,
        title: "The Solitary Survivor",
        beats: [
          {
            id: 0,
            action: "Complete scientific herbarium specimen inscription",
            title: "A Single Branch Across Deep Time",
            body: "Sole survivor of an entire botanical division (Ginkgophyta), Ginkgo biloba stands as an unyielding monument to evolutionary endurance.",
          },
        ],
      },
    ],
  },
  zh: {
    theme: "银杏活化石：二亿七千万年裸子植物的植物标本板",
    densityLabel: "密集",
    heroScene: 3,
    colors: {
      bg: "#fbf7ee",
      ink: "#382e25",
      panel: "#f2ece0",
    },
    typography: {
      header: "Garamond 700",
      body: "Garamond 400",
    },
    tags: ["植物学", "演化", "标本板", "银杏", "活化石"],
    fonts: ["Garamond", "Georgia"],
    scenes: [
      {
        id: 1,
        title: "扇形二叉叶脉",
        beats: [
          {
            id: 0,
            action: "观察原始二叉分叉扇形叶脉",
            title: "原始二叉分叉叶脉",
            body: "银杏扇形叶片保留着古老的二叉分歧脉序——叶脉成对反复二歧分叉，完全没有现代被子植物的交织网状侧脉。",
          },
        ],
      },
      {
        id: 2,
        title: "游动精子古老生殖",
        beats: [
          {
            id: 0,
            action: "观察微观螺旋鞭毛游动精子",
            title: "具数千根鞭毛的游动精子",
            body: "银杏与苏铁是种子植物中唯二依赖多鞭毛游动精子受精的活化石，精子依靠纤毛在胚珠液体中自发游泳结合。",
          },
          {
            id: 1,
            action: "比对二叠纪化石的形态一致性",
            title: "二亿七千万年谱系传承",
            body: "二叠纪地层中出土的银杏叶片化石与现生种解剖形态惊人一致，安然度过了地球四次全球生物大灭绝浩劫。",
          },
        ],
      },
      {
        id: 3,
        title: "银杏内酯化学盾牌",
        beats: [
          {
            id: 0,
            action: "提纯独特的银杏三内酯萜类化合物",
            title: "银杏内酯特种生化防线",
            body: "特有的银杏二萜内酯（Ginkgolide A, B, C）具备极强抗虫与抗木腐菌活性，使整株树木免遭绝大多数病虫害侵袭。",
          },
        ],
      },
      {
        id: 4,
        title: "辐射与火灾再生力",
        beats: [
          {
            id: 0,
            action: "见证地下休眠隐芽在极端废墟中重生",
            title: "地下休眠树瘤隐芽萌发",
            body: "在 1945 年广岛核爆爆心 1.5 公里范围内的六株银杏遭受严重烧灼，其地下根瘤隐芽数月内便破土抽出嫩绿新枝。",
          },
        ],
      },
      {
        id: 5,
        title: "孑遗独苗的史诗",
        beats: [
          {
            id: 0,
            action: "题写植物标本馆最终学术签条",
            title: "跨越地质深时的孑遗史诗",
            body: "作为银杏门（Ginkgophyta）下仅存的唯一孑遗物种，银杏以一树之躯，独自扛起了跨越近三亿年地质深时的生命传奇。",
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
              <header className={styles.plateHeader}>
                <span>
                  {language === "zh"
                    ? "植物标本板 · 裸子植物门"
                    : "HERBARIUM SPECIMEN PLATE // GINKGOPHYTA"}
                </span>
                <span>TABULA 0{sceneId}</span>
              </header>

              <div
                className={styles.specimenBody}
                data-beat-layout-container={sceneId === 2 ? "true" : undefined}
                data-beat-layout-mode={sceneId === 2 ? "motion" : undefined}
              >
                <div
                  className={styles.taxonomicBinomial}
                  data-beat-layout-item={sceneId === 2 ? "true" : undefined}
                >
                  Ginkgo biloba L. // Fam. Ginkgoaceae (1771)
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

              <footer className={styles.plateFooter}>
                <span>LOCALITY: EASTERN CHINA // RETICULATE REFUGE</span>
                <span>ROYAL BOTANICAL ARCHIVE // SPECIMEN NO. 4096</span>
              </footer>
            </div>
          );
        }}
      />
    </div>
  );
}

export default defineTopic({
  id: "ginkgo-biloba-living-fossil",
  styleId: "botanical-specimen-plate",
  title: { en: "Ginkgo Biloba Plate", zh: "银杏活化石" },
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
        title: "Ginkgo: The Tree That Time Forgot (Peter Crane, Yale Univ Press)",
        url: "https://yalebooks.yale.edu/book/9780300213836/ginkgo/",
        supports:
          "270-million-year fossil record, flagellated swimming sperm, and ginkgolide defense chemistry.",
      },
    ],
  },
});

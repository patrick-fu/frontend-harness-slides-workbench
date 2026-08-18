import {
  defineTopic,
  type TopicMetadata,
  type TopicStageProps,
} from "../domain/topic";
import SpatialSceneTrack from "../components/stage/SpatialSceneTrack";
import styles from "./lost-library-alexandria.module.css";

const metadata: { en: TopicMetadata; zh: TopicMetadata } = {
  en: {
    theme: "Alexandria's Lost Scrolls: The Anatomy of Knowledge Dispersion",
    densityLabel: "Balanced",
    heroScene: 3,
    colors: {
      bg: "#fcf9f2",
      ink: "#2c2523",
      panel: "#f5eee1",
    },
    typography: {
      header: "Garamond 400 italic",
      body: "Garamond 300",
    },
    tags: ["history", "literature", "alexandria", "editorial", "scrolls"],
    fonts: ["Garamond", "Georgia"],
    scenes: [
      {
        id: 1,
        title: "City of Papyrus",
        beats: [
          {
            id: 0,
            action: "Establish the Mouseion intellectual sanctuary",
            title: "The Universal Scroll Mandate",
            body: "Ptolemaic decree ordered royal scribes to seize every book arriving by harbor ship, transcribing copies while holding originals.",
          },
        ],
      },
      {
        id: 2,
        title: "Mandatory Scribe Seizure",
        beats: [
          {
            id: 0,
            action: "Catalog 500,000 papyrus rolls across Greek civilization",
            title: "Pinakes Subject Classification",
            body: "Callimachus authored the Pinakes, creating the world's first 120-volume bibliographic subject catalog across all known sciences.",
          },
          {
            id: 1,
            action: "Preserve lost works of geometry and astronomy",
            title: "Euclidean & Aristarchan Zenith",
            body: "Within its sunlit colonnades, Eratosthenes calculated Earth's circumference and Aristarchus hypothesized heliocentric orbits.",
          },
        ],
      },
      {
        id: 3,
        title: "The Slow Erasure",
        beats: [
          {
            id: 0,
            action: "Trace centuries of neglect, budget cuts, and fire",
            title: "Not One Fire, But Centuries of Neglect",
            body: "Popular myth blames a single inferno; historical truth reveals a tragic, four-century decay of municipal funding and political purge.",
          },
        ],
      },
      {
        id: 4,
        title: "Seeds in Arabic Translation",
        beats: [
          {
            id: 0,
            action: "Trace surviving texts into Baghdad's House of Wisdom",
            title: "The Great Translation Migration",
            body: "Fragments smuggled across desert caravans were translated into Syriac and Arabic, sparking the Islamic Golden Age in Baghdad.",
          },
          {
            id: 1,
            action: "Return to Renaissance Europe via Toledo",
            title: "Renaissance Transmission Circuit",
            body: "Centuries later, Latin scholars in Toledo and Florence re-translated Arabic commentaries, igniting modern European science.",
          },
        ],
      },
      {
        id: 5,
        title: "The Fireproof Idea",
        beats: [
          {
            id: 0,
            action: "Reflect on distributed archival resilience",
            title: "Ideas Outlive Their Palaces",
            body: "A central archive is fragile and mortal; human thought survives only when decentralized, translated, and dispersed to the winds.",
          },
        ],
      },
    ],
  },
  zh: {
    theme: "亚历山大书藏：古典知识的湮灭与跨文明流散史诗",
    densityLabel: "均衡",
    heroScene: 3,
    colors: {
      bg: "#fcf9f2",
      ink: "#2c2523",
      panel: "#f5eee1",
    },
    typography: {
      header: "Garamond 400 italic",
      body: "Garamond 300",
    },
    tags: ["历史", "文献", "亚历山大", "特稿", "古籍"],
    fonts: ["Garamond", "Georgia"],
    scenes: [
      {
        id: 1,
        title: "纸草纸之城",
        beats: [
          {
            id: 0,
            action: "确立缪斯神庙学术圣殿的全书搜罗令",
            title: "托勒密全书搜罗法令",
            body: "托勒密王朝颁布铁律，扣留所有靠港商船上的典籍原件，抄录副本归还，原稿永久入藏皇家大图书馆。",
          },
        ],
      },
      {
        id: 2,
        title: "抄录与分类总目",
        beats: [
          {
            id: 0,
            action: "卡利马科斯编制世界首部学科图书总目",
            title: "百卷学科分类大系",
            body: "学者卡利马科斯编纂了一百二十卷《书目表》，首次将五十万卷莎草纸按哲学、天文与数学建立严密索引。",
          },
          {
            id: 1,
            action: "见证古典几何与日心说的最初闪光",
            title: "欧几里得与阿里斯塔克斯",
            body: "在阳光倾泻的柱廊下，埃拉托色尼测算出地球周长，阿里斯塔克斯首次构想出太阳位于宇宙中心的图景。",
          },
        ],
      },
      {
        id: 3,
        title: "缓慢的消亡",
        beats: [
          {
            id: 0,
            action: "揭示四个世纪官僚削减与政治清洗真相",
            title: "并非单次战火，而是数百年消磨",
            body: "后世神话将其归咎于单次大火；真实历史却是四个世纪连续的经费削减、教派清洗与潮湿风化的悲剧衰亡。",
          },
        ],
      },
      {
        id: 4,
        title: "巴格达译本火种",
        beats: [
          {
            id: 0,
            action: "流散残卷在巴格达智慧宫被译为阿拉伯语",
            title: "大翻译运动跨漠迁徙",
            body: "幸存的学者携带残卷穿越沙漠商道，在巴格达智慧宫被系统翻译为叙利亚语与阿拉伯语，引爆伊斯兰黄金时代。",
          },
          {
            id: 1,
            action: "经由托莱多重返欧洲文艺复兴",
            title: "重返欧洲启蒙回路",
            body: "数百年后，托莱多与佛罗伦萨的拉丁学者重新翻译阿拉伯文评注，将古典火种重新注入近代科学革命。",
          },
        ],
      },
      {
        id: 5,
        title: "不灭的思想火种",
        beats: [
          {
            id: 0,
            action: "总结去中心化知识留存的终极意义",
            title: "思想终将超越宫殿与城池",
            body: "单一的实体宝库脆弱易逝；人类真正的思想唯有在不断被抄录、翻译并散落于四方时，方能历经浩劫而不朽。",
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
                className={styles.essayContainer}
                data-beat-layout-container={
                  sceneId === 2 || sceneId === 4 ? "true" : undefined
                }
                data-beat-layout-mode={
                  sceneId === 2 || sceneId === 4 ? "motion" : undefined
                }
              >
                <div
                  className={styles.essayKicker}
                  data-beat-layout-item={
                    sceneId === 2 || sceneId === 4 ? "true" : undefined
                  }
                >
                  {language === "zh"
                    ? "古典思想史专稿 // 第三卷"
                    : "ESSAY ON CLASSICAL HISTORIOGRAPHY // VOL. III"}
                </div>
                <h1
                  className={styles.essayTitle}
                  data-beat-layout-item={
                    sceneId === 2 || sceneId === 4 ? "true" : undefined
                  }
                >
                  {currentBeat.title}
                </h1>
                <p
                  className={styles.essayBody}
                  data-beat-layout-item={
                    sceneId === 2 || sceneId === 4 ? "true" : undefined
                  }
                >
                  {currentBeat.body}
                </p>
                <div
                  className={styles.dividingRule}
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
  id: "lost-library-alexandria",
  styleId: "warm-editorial-feature",
  title: { en: "Alexandria's Lost Scrolls", zh: "亚历山大书藏" },
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
          "The Vanished Library: A Wonder of the Ancient World (Luciano Canfora)",
        url: "https://www.ucpress.edu/book/9780520072558/the-vanished-library",
        supports:
          "Historical documentation of scroll collection mandates and translation dispersion.",
      },
    ],
  },
});

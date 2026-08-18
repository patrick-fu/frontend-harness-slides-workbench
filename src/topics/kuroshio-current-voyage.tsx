import {
  defineTopic,
  type TopicMetadata,
  type TopicStageProps,
} from "../domain/topic";
import SpatialSceneTrack from "../components/stage/SpatialSceneTrack";
import styles from "./kuroshio-current-voyage.module.css";

const metadata: { en: TopicMetadata; zh: TopicMetadata } = {
  en: {
    theme: "Kuroshio Current Voyage: Maritime Navigation and Pacific Swells",
    densityLabel: "Balanced",
    heroScene: 3,
    colors: {
      bg: "#fbf5e6",
      ink: "#1e293b",
      panel: "#e0f2fe",
    },
    typography: {
      header: "Serif 800",
      body: "System-ui 400",
    },
    tags: ["ocean", "japan", "woodblock", "kuroshio", "craft"],
    fonts: ["Georgia", "serif"],
    scenes: [
      {
        id: 1,
        title: "Equatorial Deep Blue Surge",
        beats: [
          {
            id: 0,
            action: "Map the warm dark blue oceanic stream from the tropics",
            title: "The Deep Black Stream (Kuroshio)",
            body: "A warm, high-salinity oceanic current flows northward from the Philippines, pushing 50 million cubic meters per second along Pacific shores.",
          },
        ],
      },
      {
        id: 2,
        title: "Wooden Merchant Vessels",
        beats: [
          {
            id: 0,
            action: "Chart traditional wooden Bezaisen cargo navigation",
            title: "Bezaisen Hull Hydrodynamics",
            body: "Traditional wooden ships hoisted square cotton sails, riding the 4-knot northward current to transport rice, cedar, and dried fish.",
          },
          {
            id: 1,
            action: "Steer past hidden reef vortexes",
            title: "Navigating Reef Vortexes",
            body: "Where coastal shoals collide with deep ocean swells, roaring tidal whirlpools demand expert rudder leverage from seasoned helmsmen.",
          },
        ],
      },
      {
        id: 3,
        title: "Monsoon and Breaker Crests",
        beats: [
          {
            id: 0,
            action: "Engrave towering foam crests against stormy horizons",
            title: "Great Winter Swells & Foam Claws",
            body: "Winter monsoons blow opposing winds against the northward current, rearing up 10-meter steep breaker waves with Prussian blue claws.",
          },
        ],
      },
      {
        id: 4,
        title: "Bountiful Coastal Fisheries",
        beats: [
          {
            id: 0,
            action: "Follow migratory bonito and tuna along warm thermal fronts",
            title: "The Bonito Upwelling Highway",
            body: "Nutrient upwelling at current convergence zones attracts vast schools of tuna and Pacific saury, nourishing vibrant coastal villages.",
          },
        ],
      },
      {
        id: 5,
        title: "The Floating World's Horizon",
        beats: [
          {
            id: 0,
            action: "Seal print with red vermilion stamp of eternity",
            title: "Harmony with Pacific Tides",
            body: "Seafarers of the floating world conquered no oceans—they yielded to the eternal rhythm of the black current, carving life along its wake.",
          },
        ],
      },
    ],
  },
  zh: {
    theme: "黑潮暖流航路：太平洋巨浪与江户木版航海图",
    densityLabel: "均衡",
    heroScene: 3,
    colors: {
      bg: "#fbf5e6",
      ink: "#1e293b",
      panel: "#e0f2fe",
    },
    typography: {
      header: "Serif 800",
      body: "System-ui 400",
    },
    tags: ["海洋", "日本", "浮世绘", "黑潮", "传统工艺"],
    fonts: ["Georgia", "serif"],
    scenes: [
      {
        id: 1,
        title: "赤道深蓝暖流",
        beats: [
          {
            id: 0,
            action: "绘制从赤道北上的深蓝色大洋主干洋流",
            title: "深蓝黑水暖流涌动",
            body: "赤道高盐高温海水汇聚成深蓝色的太平洋第一大洋流，以每秒五千万立方米巨力沿东亚岛弧浩荡北上。",
          },
        ],
      },
      {
        id: 2,
        title: "顺流木造商船",
        beats: [
          {
            id: 0,
            action: "卞才船顺流满帆运输大米与木材",
            title: "卞才千石船顺流扬帆",
            body: "江户时代的千石卞才船升起单幅大布帆，借由每小时 4 节的强劲顺洋流，高速转运大米、雪松木与干鱼海味。",
          },
          {
            id: 1,
            action: "老舵手驾船避开暗礁鸣门漩涡",
            title: "避让暗礁漩涡险境",
            body: "深海涌浪与海岸浅滩激烈对撞，在海峡激荡起轰鸣的巨型漩涡，全赖老舵手凭借经验扳动巨舵死里逃生。",
          },
        ],
      },
      {
        id: 3,
        title: "季风潮汐巨浪",
        beats: [
          {
            id: 0,
            action: "冬日季风迎头痛击暖流掀起滔天巨浪",
            title: "冬日逆风与普鲁士蓝巨浪",
            body: "强烈的西北冬季季风逆向撞击北上洋流，海面上瞬间拔起十米高的陡峭折角巨浪，鹰爪般的水沫撕裂长空。",
          },
        ],
      },
      {
        id: 4,
        title: "鱼群回游繁华",
        beats: [
          {
            id: 0,
            action: "鲣鱼与金枪鱼沿暖流冷水交界锋面回游",
            title: "暖冷交汇涌升渔场",
            body: "暖流与亲潮冷水在东北海域交汇，涌升流泛起丰沛营养盐，吸引千万尾金枪鱼与秋刀鱼群，催生繁荣渔港。",
          },
        ],
      },
      {
        id: 5,
        title: "浮世舟人敬畏",
        beats: [
          {
            id: 0,
            action: "盖下朱红印章，寄托对自然的终极敬畏",
            title: "顺应天道黑潮之水",
            body: "浮世绘中的舟人从未妄言征服自然；他们敬畏并顺应黑潮的万古律动，在波涛间安顿凡世的悲喜与舟楫。",
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
              <header className={styles.woodcutHeader}>
                <span style={{ fontWeight: 800, fontSize: "1.1cqw" }}>
                  {language === "zh"
                    ? "富岳波涛图绘 · 黑潮志"
                    : "KUROSHIO VOYAGE // UKIYO-E 04"}
                </span>
                <span className={styles.sealStamp}>
                  {language === "zh" ? "黑潮" : "SEAL"}
                </span>
              </header>

              <div
                className={styles.woodcutBody}
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

              <footer className={styles.wavePatternFooter}>
                <span>WOODBLOCK PRINT NO. 1831 // PRUSSIAN BLUE</span>
                <span>PACIFIC OCEAN SWELL NAVIGATION ARCHIVE</span>
              </footer>
            </div>
          );
        }}
      />
    </div>
  );
}

export default defineTopic({
  id: "kuroshio-current-voyage",
  styleId: "woodblock-floating-world",
  title: { en: "Kuroshio Current Voyage", zh: "黑潮暖流航路" },
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
        title: "Ocean Circulation and Kuroshio Current Dynamics (NOAA)",
        url: "https://www.noaa.gov/ocean",
        supports:
          "50 Sv volume transport, 4-knot velocity, and winter monsoon wave height data.",
      },
    ],
  },
});

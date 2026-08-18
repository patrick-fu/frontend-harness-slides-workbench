import {
  defineTopic,
  type TopicMetadata,
  type TopicStageProps,
} from "../domain/topic";
import SpatialSceneTrack from "../components/stage/SpatialSceneTrack";
import styles from "./air-traffic-separation.module.css";

const metadata: { en: TopicMetadata; zh: TopicMetadata } = {
  en: {
    theme: "Air Traffic Separation: Mathematical Safety Grids",
    densityLabel: "Dense",
    heroScene: 3,
    colors: {
      bg: "#fbfbfb",
      ink: "#111111",
      panel: "#ffffff",
    },
    typography: {
      header: "Helvetica Neue 800",
      body: "Helvetica Neue 400",
    },
    tags: ["aviation", "safety", "swiss-grid", "air-traffic", "radar"],
    fonts: ["Helvetica Neue", "Arial"],
    scenes: [
      {
        id: 1,
        title: "Controlled Airspace Grid",
        beats: [
          {
            id: 0,
            action: "Establish 3D orthogonal flight corridors",
            title: "Orthogonal Air Corridor",
            body: "Global airspace is partitioned into rigid 3D volumetric sectors governed by deterministic standard instrument departures and arrivals.",
          },
        ],
      },
      {
        id: 2,
        title: "1,000 ft Vertical RVSM",
        beats: [
          {
            id: 0,
            action: "Define 2000ft pre-RVSM ceiling",
            title: "Conventional 2,000 ft Layer",
            body: "Legacy barometric altimeters required 2,000 ft vertical buffer above FL290 to prevent altimetry drift collisions.",
          },
          {
            id: 1,
            action: "Demonstrate 1,000 ft RVSM compression",
            title: "Precision RVSM 1,000 ft",
            body: "Digital air data computers halved vertical separation to 1,000 ft, doubling upper airspace corridor capacity safely.",
          },
        ],
      },
      {
        id: 3,
        title: "Radar Surveillance Matrix",
        beats: [
          {
            id: 0,
            action: "Display secondary radar transponder stream",
            title: "Mode-S Transponder Matrix",
            body: "Interrogator beams track horizontal separation at 3 to 5 nautical miles with sub-second position updates.",
          },
          {
            id: 1,
            action: "Project ADS-B satellite telemetry vectors",
            title: "ADS-B Telemetry Vectors",
            body: "GNSS broadcast positioning maintains 1 Hz trajectory broadcast across oceanic and polar non-radar sectors.",
          },
        ],
      },
      {
        id: 4,
        title: "Conflict Resolution Vectors",
        beats: [
          {
            id: 0,
            action: "Demonstrate tactical vector offsets",
            title: "Tactical Heading Offsets",
            body: "Short-term conflict alerts trigger algorithmic 30-degree heading divergences and step climbs before threshold breach.",
          },
        ],
      },
      {
        id: 5,
        title: "Zero Collision Guarantee",
        beats: [
          {
            id: 0,
            action: "State target level of safety standard",
            title: "Target Level of Safety",
            body: "Mathematical Target Level of Safety achieves fewer than 5 fatal mid-air collisions per billion flight hours globally.",
          },
        ],
      },
    ],
  },
  zh: {
    theme: "空域间隔标准：数学正交安全网格",
    densityLabel: "密集",
    heroScene: 3,
    colors: {
      bg: "#fbfbfb",
      ink: "#111111",
      panel: "#ffffff",
    },
    typography: {
      header: "Helvetica Neue 800",
      body: "Helvetica Neue 400",
    },
    tags: ["航空", "安全", "瑞士网格", "空中交通", "雷达"],
    fonts: ["Helvetica Neue", "Arial"],
    scenes: [
      {
        id: 1,
        title: "空域正交网格",
        beats: [
          {
            id: 0,
            action: "建立三维正交航路走廊",
            title: "三维正交空域走廊",
            body: "全球民航空域被划分为刚性三维扇区，由确定性的标准进离场航线严格约束。",
          },
        ],
      },
      {
        id: 2,
        title: "千英尺垂直高度",
        beats: [
          {
            id: 0,
            action: "解析传统 2000 英尺垂直间隔",
            title: "传统 2000 英尺层",
            body: "早期气压高度表精度有限，在 FL290 以上必须保持 2000 英尺缓冲以防漂移。",
          },
          {
            id: 1,
            action: "展示 RVSM 1000 英尺安全压缩",
            title: "RVSM 缩小垂直间隔",
            body: "高精度大气数据计算机将垂直间隔压缩至 1000 英尺，实现高空走廊容量翻倍。",
          },
        ],
      },
      {
        id: 3,
        title: "雷达监视矩阵",
        beats: [
          {
            id: 0,
            action: "呈现二次雷达应答机数据流",
            title: "S 模式应答机矩阵",
            body: "地面雷达以 3 至 5 海里水平间隔持续跟踪，保持亚秒级航迹刷新。",
          },
          {
            id: 1,
            action: "投影 ADS-B 卫星监视矢量",
            title: "ADS-B 卫星监视矢量",
            body: "基于卫星导航广播定位，在洋区与极地无雷达覆盖区实现 1 Hz 航迹广播。",
          },
        ],
      },
      {
        id: 4,
        title: "冲突解脱矢量",
        beats: [
          {
            id: 0,
            action: "演示战术偏置航向解脱",
            title: "战术航向偏置解脱",
            body: "短期冲突告警触发 30 度预先航向分离与阶梯爬升，将风险化解于临界之前。",
          },
        ],
      },
      {
        id: 5,
        title: "零碰撞运行保证",
        beats: [
          {
            id: 0,
            action: "阐述十亿飞行小时安全极限",
            title: "目标安全水平 TLS",
            body: "数学目标安全水平将空中相撞风险严格压制在每十亿飞行小时 5 次致命事件以内。",
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
          "3->4": "hard-cut",
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
              <header className={styles.gridHeader}>
                <span className={styles.systemLabel}>
                  {language === "zh"
                    ? "ICAO 空管正交网格"
                    : "ICAO SEPARATION SPEC"}
                </span>
                <span className={styles.systemCode}>
                  SEC-{sceneId}.0{sceneBeat} / FL370
                </span>
              </header>

              <div
                className={styles.mainColumn}
                data-beat-layout-container={
                  sceneId === 2 || sceneId === 3 ? "true" : undefined
                }
                data-beat-layout-mode={
                  sceneId === 2 || sceneId === 3 ? "motion" : undefined
                }
              >
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
              </div>

              <div className={styles.sideColumn}>
                <table className={styles.matrixTable}>
                  <tbody>
                    <tr className={styles.matrixRow}>
                      <td className={styles.matrixKey}>VERTICAL SEP</td>
                      <td className={styles.matrixVal}>1,000 FT (RVSM)</td>
                    </tr>
                    <tr className={styles.matrixRow}>
                      <td className={styles.matrixKey}>LATERAL MINIMA</td>
                      <td className={styles.matrixVal}>3.0 - 5.0 NM</td>
                    </tr>
                    <tr className={styles.matrixRow}>
                      <td className={styles.matrixKey}>TELEMETRY RATE</td>
                      <td className={styles.matrixVal}>1.0 HZ (ADS-B)</td>
                    </tr>
                    <tr className={styles.matrixRow}>
                      <td className={styles.matrixKey}>STATUS</td>
                      <td className={`${styles.matrixVal} ${styles.signalTag}`}>
                        CONVERGED
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <footer className={styles.gridFooter}>
                <span>GRID: SWISS OBJECTIVE R-12</span>
                <span>TARGET LEVEL OF SAFETY: 5.0e-9</span>
              </footer>
            </div>
          );
        }}
      />
    </div>
  );
}

export default defineTopic({
  id: "air-traffic-separation",
  styleId: "objective-swiss-grid",
  title: { en: "Air Traffic Separation", zh: "空域间隔标准" },
  modelId: "Gemini 3.7 Flash",
  Stage: TopicStage,
  metadata,
  navigation: { mode: "none" },
  transitionScore: {
    "1->2": "push-x",
    "2->3": "slide-x",
    "3->4": "hard-cut",
    "4->5": "crossfade",
  },
  evidence: {
    kind: "facts",
    sources: [
      {
        title: "ICAO Doc 9574: Manual on Implementation of RVSM",
        url: "https://www.icao.int/safety/airnavigation/Pages/rvsm.aspx",
        supports:
          "1000 ft vertical separation minima and collision risk modeling.",
      },
    ],
  },
});

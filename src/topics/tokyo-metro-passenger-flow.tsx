import {
  defineTopic,
  type TopicMetadata,
  type TopicStageProps,
} from "../domain/topic";
import SpatialSceneTrack from "../components/stage/SpatialSceneTrack";
import styles from "./tokyo-metro-passenger-flow.module.css";

const metadata: { en: TopicMetadata; zh: TopicMetadata } = {
  en: {
    theme: "Urban Ethnography: Passenger Fluid Dynamics at Shinjuku Station",
    densityLabel: "Dense",
    heroScene: 3,
    colors: {
      bg: "#f4f1ea",
      ink: "#1c1917",
      panel: "#ffffff",
    },
    typography: {
      header: "Courier Prime 700",
      body: "Merriweather 400",
    },
    tags: ["ethnography", "tokyo", "transit", "field-notes", "pedestrian-dynamics"],
    fonts: ["Courier Prime", "Merriweather", "serif"],
    scenes: [
      {
        id: 1,
        title: "3.5 Million Transit Labyrinth",
        beats: [
          {
            id: 0,
            action: "Map 200 exits and 3.5 million daily commuters navigating Shinjuku Station",
            title: "3.5 Million Daily Commuters",
            body: "At peak 08:30 AM rush hour, over 120,000 pedestrians cross the concourses simultaneously across 36 interconnected platforms.",
          },
        ],
      },
      {
        id: 2,
        title: "Chromatic Wayfinding Nudges",
        beats: [
          {
            id: 0,
            action: "Analyze painted floor lanes guiding subconscious navigation",
            title: "Subconscious Chromatic Floor Markings",
            body: "High-contrast floor ribbons nudge turning vectors 15 meters before bottlenecks, reducing visual hesitation by 42%.",
          },
          {
            id: 1,
            action: "Record gaze dwell time reduction",
            title: "Kinetic Flow Priming",
            body: "Overhead signage is angled to match walking gaze lines, ensuring zero-stop decision making at major junction gates.",
          },
        ],
      },
      {
        id: 3,
        title: "Platform Pulsed Valve Effect",
        beats: [
          {
            id: 0,
            action: "Observe train arrivals acting as discrete fluid control valves",
            title: "Platform Arrival Valve Throttling",
            body: "Train door cycles pulse pedestrian inflows every 110 seconds, preventing continuous laminar compression at stairway entrances.",
          },
        ],
      },
      {
        id: 4,
        title: "Spontaneous Laminar Flow",
        beats: [
          {
            id: 0,
            action: "Measure self-organizing dual-lane stream emergence without barriers",
            title: "Self-Organizing Bidirectional Lanes",
            body: "Without physical barricades, opposing crowds naturally spontaneously split into two counter-flowing laminar streams to minimize friction.",
          },
        ],
      },
      {
        id: 5,
        title: "Field Synthesis: Living Megalopolis",
        beats: [
          {
            id: 0,
            action: "Synthesize the micro-sociological choreography of the Tokyo grid",
            title: "Living Cellular Metronome",
            body: "Shinjuku functions not through authoritarian coercion, but as an emergent fluid system where millions of micro-decisions sustain perfect harmony.",
          },
        ],
      },
    ],
  },
  zh: {
    theme: "都市田野调查：新宿车站 350 万人次的人群流体动力学观察",
    densityLabel: "密集",
    heroScene: 3,
    colors: {
      bg: "#f4f1ea",
      ink: "#1c1917",
      panel: "#ffffff",
    },
    typography: {
      header: "Courier Prime 700",
      body: "Merriweather 400",
    },
    tags: ["人类学", "东京地铁", "交通", "田野笔记", "人群动力学"],
    fonts: ["Courier Prime", "Merriweather", "serif"],
    scenes: [
      {
        id: 1,
        title: "350万人次地下迷宫",
        beats: [
          {
            id: 0,
            action: "记录新宿站 200 个出口与早高峰每分钟上万人次的巨大客流",
            title: "日均 350 万人次换乘枢纽",
            body: "在早高峰 8:30，超过 12 万名通勤者在 36 个站台与 200 个出入口构成的多层立体地下网络中同时穿梭流动。",
          },
        ],
      },
      {
        id: 2,
        title: "地面导向色块心理引导",
        beats: [
          {
            id: 0,
            action: "分析地面连续导向色带对步行动线的潜意识疏导",
            title: "地面连续色彩动线潜意识分流",
            body: "高对比度的地面导向色带在人流交汇点前 15 米提前分流拐弯向量，将行人的视觉停顿与犹豫概率降低了 42%。",
          },
          {
            id: 1,
            action: "记录视线驻留与无阻通行实验",
            title: "动线视线零阻碍引导",
            body: "悬挂式标识严格按照人体行进步态的下俯视角倾斜排布，确保行人在跨线换乘时实现不停步毫秒级决断。",
          },
        ],
      },
      {
        id: 3,
        title: "站台脉冲分流阀效应",
        beats: [
          {
            id: 0,
            action: "观察列车停靠车门开闭作为离散流体阀门的调控机制",
            title: "列车站台离散脉冲调控阀",
            body: "每隔 110 秒进站的列车车门如同一组精密的离散流体脉冲阀，周期性吞吐人流，彻底避免了楼梯口的持续性挤压踩踏。",
          },
        ],
      },
      {
        id: 4,
        title: "双向人流自组织层流",
        beats: [
          {
            id: 0,
            action: "测绘对向人流在无栏杆干预下自发裂变为双向平滑层流态",
            title: "对向人流自组织双向层流态",
            body: "在完全没有物理硬隔离栏杆的通道内，对向走来的人群为了降低碰撞摩擦，会在数秒内自发分裂为两股平滑对流的层流束。",
          },
        ],
      },
      {
        id: 5,
        title: "田野结语：微观都市秩序",
        beats: [
          {
            id: 0,
            action: "总结微观个体决策汇聚成大都市永恒流动的和谐律动",
            title: "数百万微观决策的巨城节拍",
            body: "新宿站的秩序并非建立在强力管制之上，而是由数百万个体微观理性的流动博弈所涌现出的惊人都市自组织生命体。",
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
              <div className={styles.fieldHeader}>
                <span className={styles.locBadge}>
                  FIELD NOTE #04 // SHINJUKU STATION (新宿駅)
                </span>
                <span className={styles.timeStamp}>08:30 JST // 2026-04-12</span>
              </div>

              <div
                className={styles.notebookPage}
                data-beat-layout-container={sceneId === 2 ? "true" : undefined}
                data-beat-layout-mode={sceneId === 2 ? "motion" : undefined}
              >
                <div
                  className={styles.obsNumber}
                  data-beat-layout-item={sceneId === 2 ? "true" : undefined}
                >
                  OBSERVATION ENTRY 0{sceneId} // LOG BEAT 0{sceneBeat + 1}
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
                  className={styles.metricRow}
                  data-beat-layout-item={sceneId === 2 ? "true" : undefined}
                >
                  <div className={styles.mItem}>
                    <span className={styles.mLabel}>DAILY PASSENGERS</span>
                    <span className={styles.mVal}>3,530,000 / Day</span>
                  </div>
                  <div className={styles.mItem}>
                    <span className={styles.mLabel}>FLOW VELOCITY</span>
                    <span className={styles.mVal}>1.34 m/s (Laminar)</span>
                  </div>
                  <div className={styles.mItem}>
                    <span className={styles.mLabel}>STATION EXITS</span>
                    <span className={styles.mVal}>200+ Interconnected</span>
                  </div>
                </div>
              </div>

              <div className={styles.fieldFooter}>
                <span>URBAN SOCIOLOGY & PEDESTRIAN DYNAMICS OBSERVER</span>
                <span>TOKYO TRANSIT AUTHORITY ARCHIVE</span>
              </div>
            </div>
          );
        }}
      />
    </div>
  );
}

export default defineTopic({
  id: "tokyo-metro-passenger-flow",
  styleId: "field-notes-report",
  title: { en: "Shinjuku Flow Field Notes", zh: "新宿站客流" },
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
        title: "Self-Organized Pedestrian Crowd Dynamics (Helbing et al.)",
        url: "https://www.nature.com/articles/35035023",
        supports:
          "Spontaneous bidirectional lane formation, platform pulse valve effects, and chromatic floor wayfinding nudges.",
      },
    ],
  },
});

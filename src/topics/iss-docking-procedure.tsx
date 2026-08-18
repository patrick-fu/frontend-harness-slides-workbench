import {
  defineTopic,
  type TopicMetadata,
  type TopicStageProps,
} from "../domain/topic";
import SpatialSceneTrack from "../components/stage/SpatialSceneTrack";
import styles from "./iss-docking-procedure.module.css";

const metadata: { en: TopicMetadata; zh: TopicMetadata } = {
  en: {
    theme: "Autonomous Spacecraft Docking: Standard Operating Procedure at 28,000 km/h",
    densityLabel: "Dense",
    heroScene: 3,
    colors: {
      bg: "#070c14",
      ink: "#f1f5f9",
      panel: "#0f172a",
    },
    typography: {
      header: "JetBrains Mono 700",
      body: "JetBrains Mono 400",
    },
    tags: ["space", "nasa", "operating-manual", "aerospace", "engineering"],
    fonts: ["JetBrains Mono", "monospace"],
    scenes: [
      {
        id: 1,
        title: "200m Hold Point",
        beats: [
          {
            id: 0,
            action: "Establish coplanar orbit and enter the 200-meter hold box",
            title: "Coplanar Orbital Hold Point",
            body: "At 28,000 km/h orbital velocity, the automated capsule enters the 200-meter keep-out sphere along the V-bar velocity vector.",
          },
        ],
      },
      {
        id: 2,
        title: "LiDAR & Target Acquisition",
        beats: [
          {
            id: 0,
            action: "Lock pulsed LiDAR sensors onto retroreflectors",
            title: "Pulsed LiDAR Retroreflection",
            body: "Dragon and Soyuz guidance computers sweep the docking port with eye-safe pulsed lasers, calculating millimetric range and tilt angles.",
          },
          {
            id: 1,
            action: "Cross-check optical crosshair camera alignment",
            title: "Optical Crosshair Telemetry Alignment",
            body: "Optical cameras triangulate target crosshairs to ensure yaw, pitch, and roll deviation remain under 0.5 degrees.",
          },
        ],
      },
      {
        id: 3,
        title: "0.1 m/s Final Approach",
        beats: [
          {
            id: 0,
            action: "Throttle cold-gas Draco thrusters down to 0.10 m/s closing rate",
            title: "0.10 m/s Micro-Impulse Descent",
            body: "Hypergolic thrusters pulse in 10-millisecond bursts, slowing relative velocity to 10 cm/s to avoid structural shock on contact.",
          },
        ],
      },
      {
        id: 4,
        title: "Probe Capture & Rigid Lock",
        beats: [
          {
            id: 0,
            action: "Engage soft capture hooks followed by 12 motorized rigidizing latches",
            title: "Soft Capture to 12-Latch Rigid Lock",
            body: "Soft capture petals dampen kinetic rebound before 12 motorized titanium latches pull mating collars together with 10 tons of force.",
          },
        ],
      },
      {
        id: 5,
        title: "Vestibule Pressurization",
        beats: [
          {
            id: 0,
            action: "Equalize vestibule atmospheric pressure to 101.3 kPa and open hatch",
            title: "Standard Cabin Equalization & Hatch Ingress",
            body: "Flight controllers perform a 60-minute leak check; air valves equalize pressure between spacecraft and station before crew ingress.",
          },
        ],
      },
    ],
  },
  zh: {
    theme: "航天器全自主对接：时速 28,000 公里下的毫米级交会操作规程",
    densityLabel: "密集",
    heroScene: 3,
    colors: {
      bg: "#070c14",
      ink: "#f1f5f9",
      panel: "#0f172a",
    },
    typography: {
      header: "JetBrains Mono 700",
      body: "JetBrains Mono 400",
    },
    tags: ["航天", "空间站", "操作手册", "航空航天", "控制工程"],
    fonts: ["JetBrains Mono", "monospace"],
    scenes: [
      {
        id: 1,
        title: "200米沿轨保持点",
        beats: [
          {
            id: 0,
            action: "飞船在轨道速度 28000km/h 下进入 200 米安全停泊区",
            title: "共面轨道 200 米停泊保持",
            body: "在每秒 7.8 公里的轨道极速下，自动飞船切入空间站 V-Bar 速度矢量走廊，并在 200 米安全距离悬停自检。",
          },
        ],
      },
      {
        id: 2,
        title: "激光雷达靶标锁定",
        beats: [
          {
            id: 0,
            action: "脉冲激光雷达打向对接机构角反射器阵列",
            title: "脉冲激光雷达毫米级测距",
            body: "导航制导计算机向对接端口发射多频脉冲激光，通过反射波相位差实时解算毫米级距离、相对速度及倾角。",
          },
          {
            id: 1,
            action: "光学摄像机十字准星姿态对正",
            title: "光学十字准星姿态纠偏",
            body: "高清红外摄像机捕获十字靶标，确保偏航、俯仰与滚转姿态角偏差严格小于 0.5 度允许公差。",
          },
        ],
      },
      {
        id: 3,
        title: "0.1米每秒进近节流",
        beats: [
          {
            id: 0,
            action: "姿控发动机微脉冲将相对速度压制在 0.10 m/s 以内",
            title: "0.10 m/s 极低速最后进近",
            body: "姿控发动机输出 10 毫秒级极微脉冲，将相对交会速度精确压制在 0.10 米/秒，防止碰撞产生破坏性动能载荷。",
          },
        ],
      },
      {
        id: 4,
        title: "探针软捕获与刚性锁紧",
        beats: [
          {
            id: 0,
            action: "软捕获环阻尼吸收动能，12 组电动锁钩刚性锁死",
            title: "软捕获阻尼到 12 组刚性锁死",
            body: "软捕获机构阻尼吸收残余冲击动能，随后 12 组高强度钛合金电动锁钩以 10 吨拉力将对接双环压合密封。",
          },
        ],
      },
      {
        id: 5,
        title: "通道气压平衡与开门",
        beats: [
          {
            id: 0,
            action: "前庭隔离舱气压平衡至 101.3 kPa 并开启双向舱门",
            title: "隔离前庭气密自检与舱门开启",
            body: "地面飞控执行 60 分钟严苛气密性自检，均压阀注入空气平衡至 101.3 kPa 标准大气压，宇航员开启舱门进站。",
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
              <div className={styles.manualHeader}>
                <span className={styles.opCode}>
                  OPERATING MANUAL // SOP-ISS-DOCK-04
                </span>
                <span className={styles.cautionBadge}>CRITICAL PHASE</span>
              </div>

              <div
                className={styles.manualBody}
                data-beat-layout-container={sceneId === 2 ? "true" : undefined}
                data-beat-layout-mode={sceneId === 2 ? "motion" : undefined}
              >
                <div
                  className={styles.stepNumber}
                  data-beat-layout-item={sceneId === 2 ? "true" : undefined}
                >
                  PROCEDURE STEP 0{sceneId} // SUB-BEAT 0{sceneBeat + 1}
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
                  className={styles.telemetryBox}
                  data-beat-layout-item={sceneId === 2 ? "true" : undefined}
                >
                  <div className={styles.telemetryItem}>
                    <span className={styles.telKey}>APPROACH VELOCITY</span>
                    <span className={styles.telVal}>+0.098 m/s (TARGET: ≤0.10)</span>
                  </div>
                  <div className={styles.telemetryItem}>
                    <span className={styles.telKey}>ANGULAR TOLERANCE</span>
                    <span className={styles.telVal}>±0.12° (MAX: ±0.50°)</span>
                  </div>
                  <div className={styles.telemetryItem}>
                    <span className={styles.telKey}>LATCH STATUS</span>
                    <span className={styles.telVal}>12 / 12 READY</span>
                  </div>
                </div>
              </div>

              <div className={styles.manualFooter}>
                <span>NASA / ROSCOSMOS / ESA JOINT DOCKING MECHANISM (IDSS)</span>
                <span>FAIL-OPERATIONAL / FAIL-SAFE</span>
              </div>
            </div>
          );
        }}
      />
    </div>
  );
}

export default defineTopic({
  id: "iss-docking-procedure",
  styleId: "operating-manual",
  title: { en: "Space Station Docking", zh: "空间站对接" },
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
        title: "International Docking System Standard (IDSS) Interface Definition Document",
        url: "https://www.internationaldockingstandard.com/",
        supports:
          "200m hold point, 0.10 m/s contact velocity, 12 rigidizing latches, and vestibule pressurization.",
      },
    ],
  },
});

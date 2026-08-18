import {
  defineTopic,
  type TopicMetadata,
  type TopicStageProps,
} from "../domain/topic";
import SpatialSceneTrack from "../components/stage/SpatialSceneTrack";
import styles from "./falcon9-preflight-checklist.module.css";

const metadata: { en: TopicMetadata; zh: TopicMetadata } = {
  en: {
    theme: "Launch Ledger: Terminal Countdown Checklist for Falcon 9 Heavy Lift",
    densityLabel: "Dense",
    heroScene: 3,
    colors: {
      bg: "#080e18",
      ink: "#f8fafc",
      panel: "#0f1a2e",
    },
    typography: {
      header: "Space Grotesk 700",
      body: "Space Grotesk 400",
    },
    tags: ["spacex", "falcon9", "aerospace", "checklist", "countdown"],
    fonts: ["Space Grotesk", "sans-serif"],
    scenes: [
      {
        id: 1,
        title: "T-45:00 Propellant Load",
        beats: [
          {
            id: 0,
            action: "Verify Launch Director GO poll for densified RP-1 and LOX loading",
            title: "T-45:00 Propellant Loading GO",
            body: "Launch Director polls all engineering consoles; automated ground systems begin pumping densified RP-1 kerosene and subcooled liquid oxygen.",
          },
        ],
      },
      {
        id: 2,
        title: "T-20:00 Subcooled LOX Purge",
        beats: [
          {
            id: 0,
            action: "Chill composite overwrapped pressure vessels (COPV) with cryogenic helium",
            title: "T-20:00 Cryogenic Helium & LOX Purge",
            body: "Second stage LOX load completes while super-chilled helium pressurization systems purge tanks to prevent thermal cavitation.",
          },
          {
            id: 1,
            action: "Arm flight termination system",
            title: "T-15:00 Autonomous FTS Armed",
            body: "Range Safety confirms the Autonomous Flight Termination System (AFTS) is armed and synced with Cape Canaveral tracking radar.",
          },
        ],
      },
      {
        id: 3,
        title: "T-07:00 Merlin Chilldown",
        beats: [
          {
            id: 0,
            action: "Bleed liquid oxygen through nine Merlin 1D turbopumps for thermal conditioning",
            title: "T-07:00 9x Merlin 1D Engine Chill",
            body: "Cryogenic liquid oxygen bleeds through nine Merlin turbopumps, conditioning metal chambers to prevent thermal shock upon hypergolic TEA-TEB ignition.",
          },
        ],
      },
      {
        id: 4,
        title: "T-00:45 Autonomous Handover",
        beats: [
          {
            id: 0,
            action: "Autonomous launch controller takes exclusive command; strongback retracts",
            title: "T-00:45 Autonomous Flight Handover",
            body: "The onboard flight computers take terminal control of countdown sequencing; the hydraulic transporter erector strongback retracts to 1.5 degrees.",
          },
        ],
      },
      {
        id: 5,
        title: "T-00:00 Ignition & Liftoff",
        beats: [
          {
            id: 0,
            action: "Ignite TEA-TEB pyrophoric fluid and release hydraulic hold-down clamps",
            title: "T-00:00 Full Thrust Liftoff",
            body: "Nine Merlin 1D engines ignite in pairs, generating 1.7 million pounds of thrust. Ground telemetry confirms hold-down clamp release for nominal ascent.",
          },
        ],
      },
    ],
  },
  zh: {
    theme: "发射台账：猎鹰9号运载火箭发射倒计时自动化检查清单",
    densityLabel: "密集",
    heroScene: 3,
    colors: {
      bg: "#080e18",
      ink: "#f8fafc",
      panel: "#0f1a2e",
    },
    typography: {
      header: "Space Grotesk 700",
      body: "Space Grotesk 400",
    },
    tags: ["航天", "猎鹰9号", "倒计时", "检查清单", "火箭发射"],
    fonts: ["Space Grotesk", "sans-serif"],
    scenes: [
      {
        id: 1,
        title: "T-45分推进剂加注",
        beats: [
          {
            id: 0,
            action: "发射指挥官进行全控制台 GO/NO-GO 轮询，启动过冷煤油与液氧加注",
            title: "T-45:00 推进剂加注全席就绪",
            body: "发射总指挥执行全席轮询确认 GO；自动化地面系统开始向一级箭体泵入高密度过冷 RP-1 航空煤油与零下 207 度液氧。",
          },
        ],
      },
      {
        id: 2,
        title: "T-20分氦气增压自检",
        beats: [
          {
            id: 0,
            action: "超低温气氦加压系统吹除并预冷复合材料缠绕压力容器（COPV）",
            title: "T-20:00 二级液氧与气氦增压自检",
            body: "二级液氧加注进入终段，超低温气氦对储箱进行深度吹扫增压，防止推进剂在微重力环境下发生气蚀空泡。",
          },
          {
            id: 1,
            action: "自毁安全系统上线",
            title: "T-15:00 自主飞行终止系统上电",
            body: "靶场安全官确认自动飞行终止系统（AFTS）完成双向雷达握手并进入自主待命状态。",
          },
        ],
      },
      {
        id: 3,
        title: "T-07分梅林预冷排气",
        beats: [
          {
            id: 0,
            action: "液氧旁路流经 9 台梅林 1D 发动机涡轮泵进行热力学预冷",
            title: "T-07:00 9 台梅林发动机热力预冷",
            body: "超低温液氧旁路泄放流经 9 台梅林涡轮泵本体，使金属燃烧室提前适应极端温差，防范 TEA-TEB 自燃引发热应力破裂裂纹。",
          },
        ],
      },
      {
        id: 4,
        title: "T-45秒自控接管退回",
        beats: [
          {
            id: 0,
            action: "箭载飞行计算机全面接管终端时序，发射架强力后撤",
            title: "T-00:45 箭载飞控接管与支架退开",
            body: "三台冗余箭载计算机接管终端发射时序控制权；液压起竖支撑臂快速后撤 1.5 度，箭地脐带电缆瞬间脱开并锁死保护门。",
          },
        ],
      },
      {
        id: 5,
        title: "T-00秒点火全推力起飞",
        beats: [
          {
            id: 0,
            action: "TEA-TEB 引燃剂注入，9 台发动机并联爆发出 7600 千牛起飞推力",
            title: "T-00:00 全推力释放点火升空",
            body: "9 台梅林发动机成对以绿色火焰点火并达到 100% 额定推力，地面气动锁紧爪释放，猎鹰 9 号拔地而起冲向星空！",
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
              <div className={styles.ledgerHeader}>
                <span className={styles.launchTag}>
                  SPACEX TERMINAL COUNTDOWN // FALCON 9 BLOCK 5
                </span>
                <span className={styles.tMinus}>
                  {sceneId === 1
                    ? "T-45:00"
                    : sceneId === 2
                      ? "T-20:00"
                      : sceneId === 3
                        ? "T-07:00"
                        : sceneId === 4
                          ? "T-00:45"
                          : "T-00:00 [LIFTOFF]"}
                </span>
              </div>

              <div
                className={styles.ledgerCard}
                data-beat-layout-container={sceneId === 2 ? "true" : undefined}
                data-beat-layout-mode={sceneId === 2 ? "motion" : undefined}
              >
                <div
                  className={styles.checklistStatus}
                  data-beat-layout-item={sceneId === 2 ? "true" : undefined}
                >
                  ✓ STEP 0{sceneId} // CHECKLIST ITEM GO FOR FLIGHT
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
                  className={styles.telemetryGrid}
                  data-beat-layout-item={sceneId === 2 ? "true" : undefined}
                >
                  <div className={styles.telBox}>
                    <span className={styles.telLabel}>STAGE 1 LOX</span>
                    <span className={styles.telValueGreen}>100% SUBCOOLED</span>
                  </div>
                  <div className={styles.telBox}>
                    <span className={styles.telLabel}>MERLIN CHILL</span>
                    <span className={styles.telValueGreen}>-183°C NOMINAL</span>
                  </div>
                  <div className={styles.telBox}>
                    <span className={styles.telLabel}>AFTS STATE</span>
                    <span className={styles.telValueGreen}>ARMED // GO</span>
                  </div>
                </div>
              </div>

              <div className={styles.ledgerFooter}>
                <span>CAPE CANAVERAL SPACE FORCE STATION // SLC-40</span>
                <span>AUTONOMOUS FLIGHT DIRECTOR</span>
              </div>
            </div>
          );
        }}
      />
    </div>
  );
}

export default defineTopic({
  id: "falcon9-preflight-checklist",
  styleId: "checklist-ledger",
  title: { en: "Falcon 9 Preflight Checklist", zh: "猎鹰9号检查" },
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
        title: "SpaceX Falcon 9 Launch Vehicle Payload User's Guide",
        url: "https://www.spacex.com/media/falcon-users-guide-2021-09.pdf",
        supports:
          "Terminal countdown sequence, RP-1/subcooled LOX propellant loading, Merlin chilldown, and AFTS arming.",
      },
    ],
  },
});

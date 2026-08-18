import {
  defineTopic,
  type TopicMetadata,
  type TopicStageProps,
} from "../domain/topic";
import SpatialSceneTrack from "../components/stage/SpatialSceneTrack";
import styles from "./power-grid-dispatch-console.module.css";

const metadata: { en: TopicMetadata; zh: TopicMetadata } = {
  en: {
    theme: "50 Hz Grid Dispatch: Millisecond Frequency and Generation Balance",
    densityLabel: "Dense",
    heroScene: 3,
    colors: {
      bg: "#0f172a",
      ink: "#f1f5f9",
      panel: "#1e293b",
    },
    typography: {
      header: "System-ui 800",
      body: "Monospace 400",
    },
    tags: ["energy", "power-grid", "dispatch", "console", "frequency"],
    fonts: ["Monospace", "Inter"],
    scenes: [
      {
        id: 1,
        title: "The 50.00 Hz Baseline",
        beats: [
          {
            id: 0,
            action: "Monitor 50.00 Hz nominal electrical frequency tolerance",
            title: "50.00 Hz Grid Equilibrium",
            body: "Grid frequency acts as a giant scale: generation matching load holds the synchronous generator rotor speed at exact 50.00 Hz.",
          },
        ],
      },
      {
        id: 2,
        title: "Channel Strips Generation Mix",
        beats: [
          {
            id: 0,
            action: "Lock baseload thermal and nuclear channel faders",
            title: "Baseload Thermal & Nuclear Faders",
            body: "Heavy thermal turbines provide massive rotational kinetic inertia, locking base faders against rapid transients.",
          },
          {
            id: 1,
            action: "Monitor renewable solar and wind fluctuating channels",
            title: "Intermittent Solar & Wind Faders",
            body: "Variable solar photovoltaic output swings channel meters, demanding continuous real-time AGC governor compensation.",
          },
        ],
      },
      {
        id: 3,
        title: "The Sudden Load Drop",
        beats: [
          {
            id: 0,
            action: "Simulate sudden 800MW regional industrial load surge",
            title: "800 MW Load Shock / 49.82 Hz Dip",
            body: "Sudden heavy load pulls generator rotors down; frequency dips to 49.82 Hz, triggering yellow alarm threshold.",
          },
          {
            id: 1,
            action: "Release primary turbine inertial governor response",
            title: "Primary Inertial Response (2s)",
            body: "Within 2 seconds, mechanical turbine governor valves open automatically, arresting frequency decline via kinetic inertia.",
          },
        ],
      },
      {
        id: 4,
        title: "Secondary AGC Faders Up",
        beats: [
          {
            id: 0,
            action: "Ramp hydro and battery energy storage AGC channels",
            title: "Hydro & Battery Secondary AGC",
            body: "Hydroelectric turbines open wicket gates in 15 seconds while lithium BESS units inject instantaneous active power.",
          },
        ],
      },
      {
        id: 5,
        title: "Dynamic Equilibrium",
        beats: [
          {
            id: 0,
            action: "Restore 50.00 Hz green nominal steady state",
            title: "Continuous Dynamic Equilibrium",
            body: "Stability is never static—it is the ceaseless, millisecond-by-millisecond modulation of ten thousand coordinated generators.",
          },
        ],
      },
    ],
  },
  zh: {
    theme: "电网调度台：50Hz 频率控制与毫秒级负荷平衡",
    densityLabel: "密集",
    heroScene: 3,
    colors: {
      bg: "#0f172a",
      ink: "#f1f5f9",
      panel: "#1e293b",
    },
    typography: {
      header: "System-ui 800",
      body: "Monospace 400",
    },
    tags: ["能源", "电网", "调度", "控制台", "频率"],
    fonts: ["Monospace", "Inter"],
    scenes: [
      {
        id: 1,
        title: "50.00 Hz 动态生命线",
        beats: [
          {
            id: 0,
            action: "监控 50.00 Hz 额定系统频率平衡基线",
            title: "50.00 Hz 动态平衡生命线",
            body: "系统频率是电网唯一的天平：发电出力与用电负荷完全一致时，同步发电机转子转速牢牢锁定在 50.00 Hz。",
          },
        ],
      },
      {
        id: 2,
        title: "发电机组出力推子群",
        beats: [
          {
            id: 0,
            action: "锁定火电与核电基荷稳态推子",
            title: "火电与核电基荷推子",
            body: "重型汽轮发电机提供庞大的物理转动惯量，基荷推子沉稳锁死，筑牢电网抗扰动底座。",
          },
          {
            id: 1,
            action: "监控风电与光伏新能源通道波动",
            title: "风电与光伏波动通道",
            body: "风光新能源出力随天气剧烈起伏，电平指示灯快速跳动，倒逼 AGC 自动发电控制系统实时补偿。",
          },
        ],
      },
      {
        id: 3,
        title: "负荷突增与一次调频",
        beats: [
          {
            id: 0,
            action: "模拟 800MW 工业突加负荷冲击",
            title: "800MW 负荷冲击 / 49.82Hz 跌落",
            body: "区域突加 800 兆瓦负荷导致发电机转子减速，电网频率跌落至 49.82 Hz，触发黄色告警阈值。",
          },
          {
            id: 1,
            action: "释放汽轮机转子一次调频惯量",
            title: "2 秒转子惯量一次调频",
            body: "发电机调速器在 2 秒内自发开大汽阀，直接释放转子动能，瞬时止住频率下坠趋势。",
          },
        ],
      },
      {
        id: 4,
        title: "二次 AGC 调度拉升",
        beats: [
          {
            id: 0,
            action: "拉升水电与电池储能 AGC 快速调节通道",
            title: "水电与电化学储能二次调频",
            body: "水电机组导叶 15 秒内全开，电化学储能电池毫秒级注入有功功率，将频率平滑拉回 50.00 Hz 绿线。",
          },
        ],
      },
      {
        id: 5,
        title: "动态稳态平衡",
        beats: [
          {
            id: 0,
            action: "总结电网动态平衡的工业美学",
            title: "永不停歇的动态稳态",
            body: "所谓的电网稳定从来不是静止，而是成千上万台机组推子在毫秒维度上永不间断的协同微调。",
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
              <div className={styles.consoleHeader}>
                <div>
                  <span style={{ color: "#38bdf8", fontWeight: 700 }}>
                    {language === "zh"
                      ? "国家电网调度台"
                      : "GRID DISPATCH CONSOLE // EMS-5000"}
                  </span>
                </div>
                <div className={styles.frequencyMeter}>
                  <span>GRID FREQ:</span>
                  <span className={styles.hzValue}>
                    {sceneId === 3 && sceneBeat === 0
                      ? "49.82 Hz (WARN)"
                      : "50.00 Hz (SYNC)"}
                  </span>
                </div>
              </div>

              <div
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

                <div
                  className={styles.faderRacks}
                  data-beat-layout-item={
                    sceneId === 2 || sceneId === 3 ? "true" : undefined
                  }
                >
                  <div className={styles.faderChannel}>
                    <span className={styles.channelLabel}>THERMAL BASE</span>
                    <div className={styles.faderTrack}>
                      <div className={styles.faderKnob} style={{ top: "30%" }} />
                    </div>
                    <span>85%</span>
                  </div>
                  <div className={styles.faderChannel}>
                    <span className={styles.channelLabel}>HYDRO AGC</span>
                    <div className={styles.faderTrack}>
                      <div className={styles.faderKnob} style={{ top: "45%" }} />
                    </div>
                    <span>60%</span>
                  </div>
                  <div className={styles.faderChannel}>
                    <span className={styles.channelLabel}>BESS FAST</span>
                    <div className={styles.faderTrack}>
                      <div className={styles.faderKnob} style={{ top: "20%" }} />
                    </div>
                    <span>90%</span>
                  </div>
                  <div className={styles.faderChannel}>
                    <span className={styles.channelLabel}>WIND/SOLAR</span>
                    <div className={styles.faderTrack}>
                      <div className={styles.faderKnob} style={{ top: "55%" }} />
                    </div>
                    <span>50%</span>
                  </div>
                </div>
              </div>

              <div />
            </div>
          );
        }}
      />
    </div>
  );
}

export default defineTopic({
  id: "power-grid-dispatch-console",
  styleId: "studio-mixing-console",
  title: { en: "50 Hz Grid Dispatch", zh: "电网调度台" },
  modelId: "Gemini 3.7 Flash",
  Stage: TopicStage,
  metadata,
  navigation: { mode: "none" },
  transitionScore: {
    "1->2": "push-x",
    "2->3": "push-x",
    "3->4": "push-x",
    "4->5": "crossfade",
  },
  evidence: {
    kind: "facts",
    sources: [
      {
        title: "IEEE Power & Energy: Grid Frequency Control",
        url: "https://ieeexplore.ieee.org/document/7517395",
        supports:
          "Primary inertial response and secondary AGC frequency regulation.",
      },
    ],
  },
});

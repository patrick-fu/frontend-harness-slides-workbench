import {
  defineTopic,
  type TopicMetadata,
  type TopicStageProps,
} from "../domain/topic";
import SpatialSceneTrack from "../components/stage/SpatialSceneTrack";
import styles from "./solid-state-drive-nand.module.css";

const metadata: { en: TopicMetadata; zh: TopicMetadata } = {
  en: {
    theme: "NAND Flash Benchmarks: SLC, MLC, TLC, and QLC Matrix",
    densityLabel: "Dense",
    heroScene: 3,
    colors: {
      bg: "#f8fafc",
      ink: "#0f172a",
      panel: "#ffffff",
    },
    typography: {
      header: "System-ui 800",
      body: "System-ui 400",
    },
    tags: ["storage", "flash", "ssd", "benchmark", "matrix"],
    fonts: ["System-ui"],
    scenes: [
      {
        id: 1,
        title: "Floating Gate to 3D Charge",
        beats: [
          {
            id: 0,
            action: "Inspect charge trap tunneling physics",
            title: "Charge Trap Physics",
            body: "NAND flash traps electrons in silicon nitride layers, reading threshold voltage distributions across bit states.",
          },
        ],
      },
      {
        id: 2,
        title: "P/E Endurance Ladder",
        beats: [
          {
            id: 0,
            action: "Display SLC 100,000 cycle endurance",
            title: "SLC: 100,000 P/E Cycles",
            body: "Single-Level Cell stores 1 bit with extreme 100k cycle endurance and sub-25µs read latency.",
          },
          {
            id: 1,
            action: "Compare degradation down to QLC 1,000 cycles",
            title: "QLC: 1,000 P/E Cycles",
            body: "Quad-Level Cell holds 16 voltage levels, trading write endurance down to 1k cycles for 4x bit density.",
          },
        ],
      },
      {
        id: 3,
        title: "4K Random IOPS Matrix",
        beats: [
          {
            id: 0,
            action: "Present comparative 4K random write benchmark",
            title: "4K Random Read/Write IOPS",
            body: "SLC sustains 800k IOPS at QD32, while QLC drops to 80k IOPS once pseudo-SLC write cache exhausts.",
          },
          {
            id: 1,
            action: "Highlight latency tail distribution",
            title: "P99.99 Latency Tail",
            body: "Multi-state programming induces read-disturb retry loops, stretching QLC P99.99 tail to milliseconds.",
          },
        ],
      },
      {
        id: 4,
        title: "Write Amplification Factor",
        beats: [
          {
            id: 0,
            action: "Analyze garbage collection block recycling",
            title: "Garbage Collection & WAF",
            body: "Random write fragmentation drives Write Amplification Factor from 1.1x to 4.5x on full drive states.",
          },
        ],
      },
      {
        id: 5,
        title: "Storage Hierarchy Matrix",
        beats: [
          {
            id: 0,
            action: "Deliver tiered storage architectural conclusion",
            title: "Tiered Flash Architecture",
            body: "Optimal datacenter architecture pairs small SLC write buffers with high-density QLC cold block stores.",
          },
        ],
      },
    ],
  },
  zh: {
    theme: "闪存介质评测：SLC、MLC、TLC 与 QLC 基准矩阵",
    densityLabel: "密集",
    heroScene: 3,
    colors: {
      bg: "#f8fafc",
      ink: "#0f172a",
      panel: "#ffffff",
    },
    typography: {
      header: "System-ui 800",
      body: "System-ui 400",
    },
    tags: ["存储", "闪存", "SSD", "基准评测", "矩阵"],
    fonts: ["System-ui"],
    scenes: [
      {
        id: 1,
        title: "浮栅到3D电荷阱",
        beats: [
          {
            id: 0,
            action: "探究电荷陷阱隧穿物理原理",
            title: "电荷阱存储物理机制",
            body: "NAND 闪存将电子禁锢在氮化硅绝缘层中，通过测量阈值电压分布判定多位比特状态。",
          },
        ],
      },
      {
        id: 2,
        title: "P/E 擦写寿命阶梯",
        beats: [
          {
            id: 0,
            action: "呈现 SLC 十万次工业级擦写寿命",
            title: "SLC: 100,000 次 P/E 寿命",
            body: "单层单元每单元存储 1 比特，具备 10 万次极高擦写寿命与 25 微秒超低读取延迟。",
          },
          {
            id: 1,
            action: "对比 QLC 千次寿命的密度妥协",
            title: "QLC: 1,000 次 P/E 寿命",
            body: "四层单元每单元划分 16 档精细电压，以寿命降至千次的代价换取 4 倍存储容量跃迁。",
          },
        ],
      },
      {
        id: 3,
        title: "4K 随机 IOPS 矩阵",
        beats: [
          {
            id: 0,
            action: "对比 4K 随机读写核心吞吐性能",
            title: "4K 随机读写性能矩阵",
            body: "SLC 在 QD32 队列下稳定输出 80 万 IOPS，而 QLC 在缓外写入时骤降至 8 万 IOPS。",
          },
          {
            id: 1,
            action: "剖析 P99.99 尾部延迟劣化",
            title: "P99.99 尾部延迟劣化",
            body: "多电平反复重试读取使得 QLC 的 P99.99 尾部延迟恶化至数毫秒，影响实时事务。",
          },
        ],
      },
      {
        id: 4,
        title: "写放大系数与磨损",
        beats: [
          {
            id: 0,
            action: "分析垃圾回收与写放大系数",
            title: "垃圾回收与写放大 (WAF)",
            body: "随机小文件碎片导致脏块搬迁，满盘状态下的写放大系数从 1.1 飙升至 4.5 倍以上。",
          },
        ],
      },
      {
        id: 5,
        title: "存储金字塔基线",
        beats: [
          {
            id: 0,
            action: "总结现代分层固态存储架构",
            title: "分层闪存黄金架构",
            body: "现代数据中心的最佳方案是以极小容量的 SLC 作写前日志缓冲，配合海量 QLC 冷块归档。",
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
          "2->3": "hard-cut",
          "3->4": "slide-x",
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
                className={styles.matrixCard}
                data-beat-layout-container={
                  sceneId === 2 || sceneId === 3 ? "true" : undefined
                }
                data-beat-layout-mode={
                  sceneId === 2 || sceneId === 3 ? "motion" : undefined
                }
              >
                <div
                  className={styles.headerRow}
                  data-beat-layout-item={
                    sceneId === 2 || sceneId === 3 ? "true" : undefined
                  }
                >
                  <span className={styles.benchmarkTitle}>
                    {language === "zh"
                      ? "NAND 介质评估矩阵"
                      : "NAND EVALUATION MATRIX"}
                  </span>
                  <span>CATEGORY 0{sceneId} // BENCHMARK</span>
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

                <table className={styles.tableGrid}>
                  <thead>
                    <tr className={styles.tableHeader}>
                      <th>TIER</th>
                      <th>BITS/CELL</th>
                      <th>ENDURANCE (P/E)</th>
                      <th>READ LATENCY</th>
                      <th>RANDOM IOPS</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className={styles.winCell}>SLC</td>
                      <td>1</td>
                      <td className={styles.winCell}>100,000</td>
                      <td className={styles.winCell}>25 µs</td>
                      <td className={styles.winCell}>800K</td>
                    </tr>
                    <tr>
                      <td>TLC</td>
                      <td>3</td>
                      <td>3,000</td>
                      <td>60 µs</td>
                      <td>450K</td>
                    </tr>
                    <tr>
                      <td className={styles.lossCell}>QLC</td>
                      <td>4</td>
                      <td className={styles.lossCell}>1,000</td>
                      <td className={styles.lossCell}>120 µs</td>
                      <td className={styles.lossCell}>80K</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          );
        }}
      />
    </div>
  );
}

export default defineTopic({
  id: "solid-state-drive-nand",
  styleId: "benchmark-matrix",
  title: { en: "NAND Flash Benchmarks", zh: "闪存介质评测" },
  modelId: "Gemini 3.7 Flash",
  Stage: TopicStage,
  metadata,
  navigation: { mode: "none" },
  transitionScore: {
    "1->2": "push-x",
    "2->3": "hard-cut",
    "3->4": "slide-x",
    "4->5": "crossfade",
  },
  evidence: {
    kind: "facts",
    sources: [
      {
        title: "IEEE Transactions on Electron Devices: 3D NAND Flash Memory",
        url: "https://ieeexplore.ieee.org/document/8338121",
        supports:
          "P/E cycle degradation and latency trade-offs across SLC, MLC, TLC, and QLC.",
      },
    ],
  },
});

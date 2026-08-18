import {
  defineTopic,
  type TopicMetadata,
  type TopicStageProps,
} from "../domain/topic";
import SpatialSceneTrack from "../components/stage/SpatialSceneTrack";
import styles from "./floppy-disk-interleaving.module.css";

const metadata: { en: TopicMetadata; zh: TopicMetadata } = {
  en: {
    theme: "Floppy Interleaving: Mechanical RPM and Sector Timing Optimization",
    densityLabel: "Dense",
    heroScene: 3,
    colors: {
      bg: "#fdfbf7",
      ink: "#3e2723",
      panel: "#fef3c7",
    },
    typography: {
      header: "System-ui 800",
      body: "System-ui 400",
    },
    tags: ["hardware", "retro", "floppy", "interleaving", "packaging"],
    fonts: ["System-ui"],
    scenes: [
      {
        id: 1,
        title: "Inside the 3.5-Inch Shell",
        beats: [
          {
            id: 0,
            action: "Inspect 3.5-inch microfloppy shell and 300 RPM spindle",
            title: "3.5-Inch Shell & 300 RPM Drive",
            body: "A flexible mylar disk coated with magnetic iron oxide spins at a constant 300 RPM—exactly 200 milliseconds per full revolution.",
          },
        ],
      },
      {
        id: 2,
        title: "Concentric Tracks & Sectors",
        beats: [
          {
            id: 0,
            action: "Partition 80 concentric tracks into 18 physical sectors",
            title: "80 Concentric Tracks & Sectors",
            body: "The stepper motor positions the read/write head across 80 tracks; each track is formatted into eighteen 512-byte sectors.",
          },
          {
            id: 1,
            action: "Index hole synchronization pulse",
            title: "Index Mark Zero Point",
            body: "An optical sensor detects the physical index hole, providing a hardware reference pulse for sector zero on each rotation.",
          },
        ],
      },
      {
        id: 3,
        title: "The 1:1 Sequential Bottleneck",
        beats: [
          {
            id: 0,
            action: "Reveal DMA latency causing full revolution misses",
            title: "The 200ms Full Revolution Penalty",
            body: "After reading Sector 1, the CPU requires 2ms to process data. By then, Sector 2 has flown past, forcing a full 200ms wait.",
          },
        ],
      },
      {
        id: 4,
        title: "The 1:3 Interleave Solution",
        beats: [
          {
            id: 0,
            action: "Rearrange sector sequence to 1-4-7-2-5-8",
            title: "1:3 Interleave Staggering",
            body: "Formatting sectors with a 1:3 stagger places Sector 2 three slots away; by the time the CPU resets, Sector 2 arrives perfectly.",
          },
        ],
      },
      {
        id: 5,
        title: "Engineering Under Physical Limits",
        beats: [
          {
            id: 0,
            action: "Celebrate retro computing algorithmic elegance",
            title: "Algorithmic Triumph over Physics",
            body: "Without faster motors or expensive RAM, thoughtful mathematical layout accelerated disk throughput by 600%.",
          },
        ],
      },
    ],
  },
  zh: {
    theme: "软盘磁道交织：3.5寸软盘物理扇区交错排布提速纪律",
    densityLabel: "密集",
    heroScene: 3,
    colors: {
      bg: "#fdfbf7",
      ink: "#3e2723",
      panel: "#fef3c7",
    },
    typography: {
      header: "System-ui 800",
      body: "System-ui 400",
    },
    tags: ["硬件", "复古计算", "软盘", "扇区交织", "卡带包装"],
    fonts: ["System-ui"],
    scenes: [
      {
        id: 1,
        title: "塑料外壳下的磁介质",
        beats: [
          {
            id: 0,
            action: "剖析 3.5 英寸微型软盘与 300 RPM 恒速主轴",
            title: "3.5寸软盘与 300 RPM 恒速",
            body: "聚酯薄膜圆盘涂覆磁性氧化铁，在驱动器内以 300 RPM 恒速旋转——每转一圈耗时恰好为 200 毫秒。",
          },
        ],
      },
      {
        id: 2,
        title: "磁道与扇区同心圆",
        beats: [
          {
            id: 0,
            action: "步进电机将磁道划分为 18 个物理扇区",
            title: "80 同心磁道与 18 物理扇区",
            body: "磁头步进电机在 80 根同心磁道间机械寻道，每条磁道格式化为 18 个 512 字节的数据扇区。",
          },
          {
            id: 1,
            action: "物理索引孔同步磁道原点",
            title: "索引孔物理绝对原点",
            body: "光电传感器捕捉软盘上的物理索引小孔，为每一圈旋转提供确定性的零号扇区起始基准脉冲。",
          },
        ],
      },
      {
        id: 3,
        title: "连续读取的性能陷阱",
        beats: [
          {
            id: 0,
            action: "DMA 处理延迟导致错失扇区空转整圈",
            title: "200 毫秒旋转整圈惩罚",
            body: "读完 1 号扇区后，早期 CPU 需耗时 2 毫秒传输数据。此时 2 号扇区早已转过磁头，驱动器被迫空等整整一圈（200ms）。",
          },
        ],
      },
      {
        id: 4,
        title: "1:3 扇区交织解法",
        beats: [
          {
            id: 0,
            action: "跳跃式排列扇区为 1-4-7-2-5-8 实现提速",
            title: "1:3 扇区跳跃交织重排",
            body: "将物理扇区按 1:3 比例交错排布；当 CPU 处理完毕重置控制器时，2 号扇区恰好准时转到磁头下方，读取速度暴增 6 倍。",
          },
        ],
      },
      {
        id: 5,
        title: "物理极限下的妥协",
        beats: [
          {
            id: 0,
            action: "总结复古计算硬件受限下的极致算法智慧",
            title: "受限硬件下的极致算法智慧",
            body: "无需升级更昂贵的电机，亦无需大容量缓存；精妙的数学排布让古老的软盘突破了物理旋转的枷锁。",
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
              <header className={styles.jcardHeader}>
                <span className={styles.brandPill}>
                  {language === "zh"
                    ? "3.5寸软盘包装规格"
                    : "MF-2DD // FLOPPY SPEC"}
                </span>
                <span style={{ fontFamily: "monospace", fontSize: "0.85cqw" }}>
                  FORMAT 1:3 // SECTOR 0{sceneId}
                </span>
              </header>

              <div
                className={styles.specBody}
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

                <div
                  className={styles.specRow}
                  data-beat-layout-item={sceneId === 2 ? "true" : undefined}
                >
                  <div className={styles.specItem}>
                    <div className={styles.specKey}>ROTATION SPEED</div>
                    <div className={styles.specVal}>300 RPM (200ms)</div>
                  </div>
                  <div className={styles.specItem}>
                    <div className={styles.specKey}>INTERLEAVE FACTOR</div>
                    <div className={styles.specVal}>1:3 (STAGGERED)</div>
                  </div>
                  <div className={styles.specItem}>
                    <div className={styles.specKey}>CAPACITY</div>
                    <div className={styles.specVal}>720 KB / 1.44 MB</div>
                  </div>
                </div>
              </div>

              <footer className={styles.jcardFooter}>
                <span>JIS C 6282 STANDARDIZED MAGNETIC MEDIA</span>
                <span>TOKYO HARDWARE ENGINEERING SPECIFICATION</span>
              </footer>
            </div>
          );
        }}
      />
    </div>
  );
}

export default defineTopic({
  id: "floppy-disk-interleaving",
  styleId: "cassette-era-packaging",
  title: { en: "Floppy Interleaving", zh: "软盘磁道交织" },
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
        title: "Floppy Disk Controller Architecture & Sector Interleaving",
        url: "https://www.retrotechnology.com/herbs_stuff/drive.html",
        supports:
          "300 RPM rotation timing, 1:3 sector interleave factors, and DMA latency bypass.",
      },
    ],
  },
});

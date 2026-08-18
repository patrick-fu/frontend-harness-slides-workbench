import {
  defineTopic,
  type TopicMetadata,
  type TopicStageProps,
} from "../domain/topic";
import SpatialSceneTrack from "../components/stage/SpatialSceneTrack";
import styles from "./amdahls-law.module.css";

const metadata: { en: TopicMetadata; zh: TopicMetadata } = {
  en: {
    theme: "Amdahl's Law: The Tyranny of the Serial Fraction",
    densityLabel: "Sparse",
    heroScene: 3,
    colors: {
      bg: "#080808",
      ink: "#ffffff",
      panel: "#121212",
    },
    typography: {
      header: "Impact 900",
      body: "System-ui 500",
    },
    tags: ["systems", "concurrency", "performance", "punchline", "amdahl"],
    fonts: ["Impact", "Arial Black"],
    scenes: [
      {
        id: 1,
        title: "Compute Hallucination",
        beats: [
          {
            id: 0,
            action: "Slam the infinite core myth",
            title: "MORE CORES ≠ FASTER CODE",
            body: "Doubling processor count does not halve execution time when synchronization forces threads into single-file queues.",
          },
        ],
      },
      {
        id: 2,
        title: "The 5% Serial Ceiling",
        beats: [
          {
            id: 0,
            action: "Strike 95% parallelizable claim",
            title: "95% PARALLEL IS NOT ENOUGH",
            body: "Even if 95% of work scales across 10,000 threads, the remaining 5% non-parallelizable fraction dictates runtime.",
          },
          {
            id: 1,
            action: "Reveal the serial bottleneck",
            title: "THE 5% INESCAPABLE DEADLOCK",
            body: "Mutex contention, disk serialization, and thread handshakes form an immovable execution barrier.",
          },
        ],
      },
      {
        id: 3,
        title: "20x Speedup Hard Cap",
        beats: [
          {
            id: 0,
            action: "Drop the 20x maximum speedup verdict",
            title: "MAXIMUM SPEEDUP: 20X FOREVER",
            body: "As N approaches infinity, Speedup = 1 / 0.05 = 20. 100,000 cores deliver the exact same wall-clock as 64 cores.",
          },
        ],
      },
      {
        id: 4,
        title: "Coordination Tax Bites",
        beats: [
          {
            id: 0,
            action: "Introduce inter-core communication overhead",
            title: "COORDINATION TAX SLAMS THE BRAKES",
            body: "Cross-socket cache snooping and memory bus saturation turn parallel scaling into negative speedup.",
          },
          {
            id: 1,
            action: "Demonstrate negative return curve",
            title: "SPENDING WATTS TO WAIT",
            body: "At extreme core counts, processors spend 90% of cycles idling on cache line invalidation storms.",
          },
        ],
      },
      {
        id: 5,
        title: "Fix the Bottleneck",
        beats: [
          {
            id: 0,
            action: "Deliver final punchline command",
            title: "OPTIMIZE THE SERIAL FRACTION",
            body: "Stop buying more compute. Shrink the serial lock, or watch billions of transistors burn in silence.",
          },
        ],
      },
    ],
  },
  zh: {
    theme: "阿姆达尔定律：串行部分的绝对支配",
    densityLabel: "稀疏",
    heroScene: 3,
    colors: {
      bg: "#080808",
      ink: "#ffffff",
      panel: "#121212",
    },
    typography: {
      header: "Impact 900",
      body: "System-ui 500",
    },
    tags: ["系统", "并发", "性能", "金句", "阿姆达尔"],
    fonts: ["Impact", "Arial Black"],
    scenes: [
      {
        id: 1,
        title: "算力幻觉",
        beats: [
          {
            id: 0,
            action: "击碎无限核心神话",
            title: "堆核心 ≠ 提速度",
            body: "只要存在不可并行的串行临界区，盲目翻倍核心数量绝不会让程序运行时间等比减半。",
          },
        ],
      },
      {
        id: 2,
        title: "5%串行死穴",
        beats: [
          {
            id: 0,
            action: "击穿95%并行度的虚妄安全感",
            title: "95% 并行度远远不够",
            body: "即便 95% 的代码能在万核上并发，剩下的 5% 串行段依然会单枪匹马锁死整体耗时。",
          },
          {
            id: 1,
            action: "揭露串行瓶颈死锁",
            title: "5% 串行构筑的铜墙铁壁",
            body: "互斥锁排队、I/O 顺序写入和跨线程同步，成为无论多少算力都无法跨越的硬性瓶颈。",
          },
        ],
      },
      {
        id: 3,
        title: "20倍加速硬顶",
        beats: [
          {
            id: 0,
            action: "宣告20倍极限加速比死线",
            title: "理论加速比上限：20倍锁死",
            body: "当核心数趋于无穷大，加速比等于 1 / 0.05 = 20 倍。十万个核心与 64 核心的物理耗时毫无区别。",
          },
        ],
      },
      {
        id: 4,
        title: "通信开销反噬",
        beats: [
          {
            id: 0,
            action: "引入跨核通信开销惩罚",
            title: "通信税全面反噬算力",
            body: "跨插槽缓存一致性探测与总线拥塞，会让过度的并发由加速彻底演变为减速。",
          },
          {
            id: 1,
            action: "展示负收益曲线",
            title: "烧着电费原地空转",
            body: "在极端核心数下，90% 的 CPU 周期都白白浪费在等待缓存行失效风暴的自旋上。",
          },
        ],
      },
      {
        id: 5,
        title: "优化瓶颈非核心",
        beats: [
          {
            id: 0,
            action: "给出最终金句结论",
            title: "砍掉串行段才是正解",
            body: "别再盲目购买算力。重构算法消除串行锁，否则千万亿晶体管只是在为你静默空转。",
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
        transitionKind="hard-cut"
        transitionMap={{
          "1->2": "hard-cut",
          "2->3": "scale-fade",
          "3->4": "push-x",
          "4->5": "hard-cut",
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
                className={styles.punchBlock}
                data-beat-layout-container={
                  sceneId === 2 || sceneId === 4 ? "true" : undefined
                }
                data-beat-layout-mode={
                  sceneId === 2 || sceneId === 4 ? "motion" : undefined
                }
              >
                {sceneId === 2 && (
                  <div
                    className={styles.struckPhrase}
                    data-beat-layout-item="true"
                  >
                    {language === "zh"
                      ? "✖ “只要核心够多，就能无限加速”"
                      : "✖ 'MORE HARDWARE FIXES EVERYTHING'"}
                  </div>
                )}
                <h1
                  className={styles.punchTitle}
                  data-beat-layout-item={
                    sceneId === 2 || sceneId === 4 ? "true" : undefined
                  }
                >
                  {currentBeat.title}
                </h1>
                <p
                  className={styles.punchBody}
                  data-beat-layout-item={
                    sceneId === 2 || sceneId === 4 ? "true" : undefined
                  }
                >
                  {currentBeat.body}
                </p>
              </div>
            </div>
          );
        }}
      />
    </div>
  );
}

export default defineTopic({
  id: "amdahls-law",
  styleId: "kinetic-type-punchline",
  title: { en: "Amdahl's Law", zh: "阿姆达尔定律" },
  modelId: "Gemini 3.7 Flash",
  Stage: TopicStage,
  metadata,
  navigation: { mode: "none" },
  transitionScore: {
    "1->2": "hard-cut",
    "2->3": "scale-fade",
    "3->4": "push-x",
    "4->5": "hard-cut",
  },
  evidence: {
    kind: "facts",
    sources: [
      {
        title:
          "AFIPS 1967: Validity of the single processor approach to achieving large scale computing capabilities",
        url: "https://dl.acm.org/doi/10.1145/1465482.1465560",
        supports:
          "Mathematical derivation of parallel speedup bounded by serial fraction.",
      },
    ],
  },
});

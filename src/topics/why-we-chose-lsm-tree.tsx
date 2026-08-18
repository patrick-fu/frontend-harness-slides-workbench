import {
  defineTopic,
  type TopicMetadata,
  type TopicStageProps,
} from "../domain/topic";
import SpatialSceneTrack from "../components/stage/SpatialSceneTrack";
import styles from "./why-we-chose-lsm-tree.module.css";

const metadata: { en: TopicMetadata; zh: TopicMetadata } = {
  en: {
    theme: "Architecture Decision Record: Migrating to Log-Structured Merge Trees",
    densityLabel: "Dense",
    heroScene: 3,
    colors: {
      bg: "#0b1120",
      ink: "#f8fafc",
      panel: "#1e293b",
    },
    typography: {
      header: "Inter 700",
      body: "Inter 400",
    },
    tags: ["architecture", "adr", "database", "lsm-tree", "decision-record"],
    fonts: ["Inter", "sans-serif"],
    scenes: [
      {
        id: 1,
        title: "Write Amplification Wall",
        beats: [
          {
            id: 0,
            action: "Identify random I/O write bottlenecks in traditional in-place B-Trees",
            title: "B-Tree Random I/O Bottleneck",
            body: "At 1,000,000 writes per second, page splits and random disk seeks in B+Trees caused 40x write amplification and SSD wear.",
          },
        ],
      },
      {
        id: 2,
        title: "Trade-off Evaluation Matrix",
        beats: [
          {
            id: 0,
            action: "Benchmark append-only sequential writes versus read latencies",
            title: "Append-Only vs In-Place Updates",
            body: "LSM-Trees convert random writes into sequential disk flushes at the cost of background compaction I/O and multi-file read amplification.",
          },
          {
            id: 1,
            action: "Formalize the RUM conjecture trade-offs",
            title: "Read/Update/Memory (RUM) Frontier",
            body: "We chose to optimize update cost ($U$) and space overhead ($M$) while mitigating read overhead ($R$) with specialized memory caches.",
          },
        ],
      },
      {
        id: 3,
        title: "Decision: Levelled Compaction",
        beats: [
          {
            id: 0,
            action: "Adopt MemTable in RAM and multi-tier SSTable levelled compaction",
            title: "DECISION: MemTable + Leveled SSTable",
            body: "Writes append to WAL and in-memory SkipList MemTable; background threads compact immutable SSTables across 7 geometric disk levels.",
          },
        ],
      },
      {
        id: 4,
        title: "Bloom Filter Read Shield",
        beats: [
          {
            id: 0,
            action: "Deploy 10-bit per key Bloom filters to eliminate 99% of negative disk reads",
            title: "1% False-Positive Bloom Filter Shield",
            body: "In-memory Bloom filters intercept key lookups, guaranteeing that non-existent reads touch zero disk SSTables with 99% certainty.",
          },
        ],
      },
      {
        id: 5,
        title: "ADR Status: ACCEPTED",
        beats: [
          {
            id: 0,
            action: "Verify 10x write throughput gains and establish system baseline",
            title: "Accepted: 10x Write Throughput Jump",
            body: "Architecture Decision Record #0042 marked as ACCEPTED. Production write latency dropped from 14ms to 0.8ms under peak load.",
          },
        ],
      },
    ],
  },
  zh: {
    theme: "架构决策记录（ADR）：存储引擎全面选型 LSM 树架构",
    densityLabel: "密集",
    heroScene: 3,
    colors: {
      bg: "#0b1120",
      ink: "#f8fafc",
      panel: "#1e293b",
    },
    typography: {
      header: "Inter 700",
      body: "Inter 400",
    },
    tags: ["架构", "决策记录", "数据库", "LSM树", "存储引擎"],
    fonts: ["Inter", "sans-serif"],
    scenes: [
      {
        id: 1,
        title: "随机写入放大瓶颈",
        beats: [
          {
            id: 0,
            action: "分析传统 B+ 树就地修改在百万级并发写入下的随机寻道死结",
            title: "B+ 树就地写入放大瓶颈",
            body: "在每秒百万级突发写入场景下，B+ 树就地更新（In-Place）引发频繁页分裂与随机 I/O，写入放大系数高达 40 倍。",
          },
        ],
      },
      {
        id: 2,
        title: "核心权衡评估矩阵",
        beats: [
          {
            id: 0,
            action: "对比纯追加顺序写入与读放大之间的 RUM 权衡边界",
            title: "追加顺序写与读放大的核心权衡",
            body: "LSM-Tree 将离散随机写入转换为纯顺序追加，代价是引入后台 Compaction 压缩负载与跨层多文件点查读放大。",
          },
          {
            id: 1,
            action: "确立 RUM 权衡取舍优先级",
            title: "RUM 空间：优先保证极速更新",
            body: "架构委员会明确优先压榨更新性能（Update）与内存开销（Memory），读放大（Read）则由专用硬件加速与内存层化解。",
          },
        ],
      },
      {
        id: 3,
        title: "决策选型分层压缩",
        beats: [
          {
            id: 0,
            action: "正式裁定采用内存 MemTable 与磁盘 7 层 Leveled Compaction",
            title: "正式决议：MemTable + 分层 SSTable",
            body: "全量写入打入 WAL 日志与内存跳表 MemTable；后台线程按几何倍数在 7 级磁盘 SSTable 之间执行有序归并压缩。",
          },
        ],
      },
      {
        id: 4,
        title: "布隆过滤器化解读放大",
        beats: [
          {
            id: 0,
            action: "为每个 SSTable 挂载 10-bit 布隆过滤器，拦截 99% 的无效磁盘读取",
            title: "1% 误判率布隆过滤器防线",
            body: "每个 SSTable 挂载内存布隆过滤器，在内存中以 99% 的确定性阻断不存在 Key 的磁盘下潜，将读放大压制在常数级别。",
          },
        ],
      },
      {
        id: 5,
        title: "决策状态正式生效",
        beats: [
          {
            id: 0,
            action: "ADR-0042 标记为 ACCEPTED，写入吞吐跃升 10 倍基线",
            title: "决议生效：写入吞吐实现 10 倍跃升",
            body: "架构决策记录 ADR-0042 标记为 ACCEPTED。生产环境峰值写入延迟从 14ms 断崖式骤降至 0.8ms，写入吞吐提升 10 倍。",
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
              <div className={styles.adrHeader}>
                <span className={styles.adrId}>ADR-0042 // STORAGE ENGINE SELECTION</span>
                <span className={sceneId === 5 ? styles.statusBadgeGreen : styles.statusBadgeAmber}>
                  STATUS: {sceneId === 5 ? "ACCEPTED" : "PROPOSED"}
                </span>
              </div>

              <div
                className={styles.adrCard}
                data-beat-layout-container={sceneId === 2 ? "true" : undefined}
                data-beat-layout-mode={sceneId === 2 ? "motion" : undefined}
              >
                <div
                  className={styles.sectionLabel}
                  data-beat-layout-item={sceneId === 2 ? "true" : undefined}
                >
                  SECTION 0{sceneId}: {sceneId === 1 ? "CONTEXT & PROBLEM" : sceneId === 2 ? "CONSIDERED OPTIONS" : sceneId === 3 ? "DECISION OUTCOME" : sceneId === 4 ? "MITIGATION STRATEGY" : "CONSEQUENCES & METRICS"}
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
                  className={styles.adrSummary}
                  data-beat-layout-item={sceneId === 2 ? "true" : undefined}
                >
                  <div className={styles.summaryItem}>
                    <span className={styles.sumKey}>WRITE PATTERN</span>
                    <span className={styles.sumVal}>Sequential WAL + MemTable</span>
                  </div>
                  <div className={styles.summaryItem}>
                    <span className={styles.sumKey}>COMPACTION</span>
                    <span className={styles.sumVal}>Levelled (7 Disks)</span>
                  </div>
                  <div className={styles.summaryItem}>
                    <span className={styles.sumKey}>READ SHIELD</span>
                    <span className={styles.sumVal}>10-bit Bloom Filters</span>
                  </div>
                </div>
              </div>

              <div className={styles.adrFooter}>
                <span>ARCHITECTURE REVIEW BOARD // SIGNED OFF</span>
                <span>EFFECTIVE: IMMEDIATE</span>
              </div>
            </div>
          );
        }}
      />
    </div>
  );
}

export default defineTopic({
  id: "why-we-chose-lsm-tree",
  styleId: "decision-record",
  title: { en: "ADR: Chose LSM-Tree", zh: "选型LSM树" },
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
        title: "The Log-Structured Merge-Tree (LSM-Tree) (O'Neil et al.)",
        url: "https://www.cs.umb.edu/~poneil/lsmtree.pdf",
        supports:
          "Sequential append-only writes, multi-tier SSTable levelled compaction, and Bloom filter read acceleration.",
      },
    ],
  },
});

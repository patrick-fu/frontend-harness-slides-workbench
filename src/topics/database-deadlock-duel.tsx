import {
  defineTopic,
  type TopicMetadata,
  type TopicStageProps,
} from "../domain/topic";
import SpatialSceneTrack from "../components/stage/SpatialSceneTrack";
import styles from "./database-deadlock-duel.module.css";

const metadata: { en: TopicMetadata; zh: TopicMetadata } = {
  en: {
    theme: "Database Internals: Smashing Circular Waits in the Lock Manager",
    densityLabel: "Dense",
    heroScene: 3,
    colors: {
      bg: "#0d0221",
      ink: "#fdf4ff",
      panel: "#1e0b36",
    },
    typography: {
      header: "Press Start 2P 400",
      body: "Courier New 700",
    },
    tags: ["database", "deadlock", "arcade", "concurrency", "innodb"],
    fonts: ["Press Start 2P", "Courier New", "monospace"],
    scenes: [
      {
        id: 1,
        title: "Mutual Lock Grip",
        beats: [
          {
            id: 0,
            action: "Transaction 1 holds Row A and requests Row B, while Tx 2 holds B requesting A",
            title: "PLAYER 1 vs PLAYER 2 LOCK HOLD",
            body: "Tx1 grabs exclusive Lock X on Row A. Tx2 grabs Lock X on Row B. Both send concurrent cross-row update requests.",
          },
        ],
      },
      {
        id: 2,
        title: "BOSS: Circular Wait Cycle",
        beats: [
          {
            id: 0,
            action: "Form directed cycle in the lock dependency graph",
            title: "STAGE 2: DIRECTED CYCLE BOSS SPAWNED",
            body: "A circular dependency arrow forms: $Tx_1 \\rightarrow Row_B \\rightarrow Tx_2 \\rightarrow Row_A \\rightarrow Tx_1$. Latency spikes and worker threads freeze.",
          },
          {
            id: 1,
            action: "CPU saturation and thread starvation",
            title: "SYSTEM ALERT: THREAD STARVATION",
            body: "Active connection pool exhausts 100% of worker threads, threatening database cascading timeout failure.",
          },
        ],
      },
      {
        id: 3,
        title: "DFS Waits-For Cycle Scan",
        beats: [
          {
            id: 0,
            action: "Engine runs depth-first search on lock graph to detect directed loop",
            title: "SPECIAL MOVE: DFS GRAPH CYCLE SCAN",
            body: "InnoDB Lock Manager triggers depth-first search across the lock wait graph, pinpointing the exact closed loop in under 1 millisecond.",
          },
        ],
      },
      {
        id: 4,
        title: "Victim Sacrifice & Rollback",
        beats: [
          {
            id: 0,
            action: "Identify lower-cost transaction and issue 1213 deadlock rollback error",
            title: "FATALITY: SACRIFICE MIN-WEIGHT VICTIM",
            body: "The engine picks Tx2 (smallest undo log weight) as the sacrificial victim, rolling back its mutations with Error 1213.",
          },
        ],
      },
      {
        id: 5,
        title: "VICTORY: Unlocked & Flowing",
        beats: [
          {
            id: 0,
            action: "Release locks and resume high-throughput commits",
            title: "STAGE CLEARED: COMMIT QUEUE FLOWING",
            body: "Tx1 smoothly acquires Row B, commits successfully, and application backoff retries Tx2 without further collisions.",
          },
        ],
      },
    ],
  },
  zh: {
    theme: "数据库内核对决：击溃锁管理器中的循环等待死锁 Boss",
    densityLabel: "密集",
    heroScene: 3,
    colors: {
      bg: "#0d0221",
      ink: "#fdf4ff",
      panel: "#1e0b36",
    },
    typography: {
      header: "Press Start 2P 400",
      body: "Courier New 700",
    },
    tags: ["数据库", "死锁", "街机游戏", "高并发", "InnoDB"],
    fonts: ["Press Start 2P", "Courier New", "monospace"],
    scenes: [
      {
        id: 1,
        title: "并发互锁锁定行",
        beats: [
          {
            id: 0,
            action: "事务 1 持有行 A 等待行 B，事务 2 持有行 B 等待行 A",
            title: "1P 与 2P 互锁僵局触发",
            body: "事务 Tx1 持有行 A 的排他 X 锁并请求行 B；事务 Tx2 持有行 B 的排他 X 锁并请求行 A，两股力量瞬间锁死。",
          },
        ],
      },
      {
        id: 2,
        title: "Boss降临：有向环形成",
        beats: [
          {
            id: 0,
            action: "依赖图形成闭合有向环，吞吐量骤降",
            title: "第二关：有向依赖环 BOSS 降临",
            body: "锁依赖图生成闭合死锁环：$Tx_1 \\rightarrow B \\rightarrow Tx_2 \\rightarrow A \\rightarrow Tx_1$。连接池线程全部悬挂阻塞。",
          },
          {
            id: 1,
            action: "CPU 告警与工作线程耗尽",
            title: "系统警报：连接池雪崩预警",
            body: "等待队列迅速积压，事务积压量突破阈值，若不及时干预将引发全库级雪崩超时。",
          },
        ],
      },
      {
        id: 3,
        title: "Waits-For 深度优先大招",
        beats: [
          {
            id: 0,
            action: "锁管理器执行 DFS 拓扑环路检测大招",
            title: "必杀技：DFS 拓扑环路秒级检测",
            body: "InnoDB 锁管理器祭出 Waits-For Graph 深度优先搜索大招，在 1 毫秒内精准定位闭合拓扑死锁环。",
          },
        ],
      },
      {
        id: 4,
        title: "牺牲低成本事务回滚",
        beats: [
          {
            id: 0,
            action: "选中 Undo 权重最小的事务作为牺牲品回滚并抛出 1213 错误",
            title: "终结裁决：献祭最小权重事务",
            body: "裁决算法选定修改代价最小的 Tx2 作为牺牲品（Victim），强制回滚并向客户端抛出 1213 Deadlock 错误。",
          },
        ],
      },
      {
        id: 5,
        title: "通关：锁释放吞吐恢复",
        beats: [
          {
            id: 0,
            action: "行锁释放，Tx1 顺畅提交，Tx2 幂等重试成功",
            title: "通关大捷：锁队列恢复狂飙",
            body: "死锁彻底化解，Tx1 顺利夺取行 B 提交成功；应用端指数退避重试 Tx2，数据库吞吐重新拉满！",
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
              <div className={styles.arcadeHeader}>
                <div className={styles.scoreBoard}>
                  <span>1P SCORE: 089200</span>
                  <span>DEADLOCK BOSS HP: {sceneId >= 4 ? "0%" : sceneId === 3 ? "25%" : "100%"}</span>
                </div>
                <div className={styles.stageTag}>STAGE 0{sceneId} // ROUND 0{sceneBeat + 1}</div>
              </div>

              <div
                className={styles.arcadeCabinet}
                data-beat-layout-container={sceneId === 2 ? "true" : undefined}
                data-beat-layout-mode={sceneId === 2 ? "motion" : undefined}
              >
                <div
                  className={styles.bossWarning}
                  data-beat-layout-item={sceneId === 2 ? "true" : undefined}
                >
                  {sceneId === 5 ? "★ VICTORY! LOCK ENGINE ONLINE ★" : "⚠ BOSS BATTLE: INNODB LOCK MANAGER ⚠"}
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
                  className={styles.pixelHud}
                  data-beat-layout-item={sceneId === 2 ? "true" : undefined}
                >
                  <div className={styles.hudStat}>
                    <span className={styles.hudLabel}>TX1 STATE:</span>
                    <span className={styles.hudValGreen}>LOCK_X (ROW_A)</span>
                  </div>
                  <div className={styles.hudStat}>
                    <span className={styles.hudLabel}>TX2 STATE:</span>
                    <span className={sceneId >= 4 ? styles.hudValRed : styles.hudValYellow}>
                      {sceneId >= 4 ? "ERROR 1213 (VICTIM)" : "LOCK_X (ROW_B)"}
                    </span>
                  </div>
                  <div className={styles.hudStat}>
                    <span className={styles.hudLabel}>ALGO:</span>
                    <span className={styles.hudValCyan}>DFS WAITS-FOR</span>
                  </div>
                </div>
              </div>

              <div className={styles.arcadeFooter}>
                <span>INSERT COIN TO RETRY // INNODB DEADLOCK DETECTION</span>
                <span>PUSH ANY BUTTON</span>
              </div>
            </div>
          );
        }}
      />
    </div>
  );
}

export default defineTopic({
  id: "database-deadlock-duel",
  styleId: "arcade-boss-fight",
  title: { en: "Defeating DB Deadlock", zh: "数据库死锁" },
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
        title: "MySQL 8.0 Reference Manual: InnoDB Deadlock Detection",
        url: "https://dev.mysql.com/doc/refman/8.0/en/innodb-deadlocks.html",
        supports:
          "Waits-for graph deadlock detection algorithm, victim selection by undo log weight, and error 1213.",
      },
    ],
  },
});

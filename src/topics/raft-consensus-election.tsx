import {
  defineTopic,
  type TopicMetadata,
  type TopicStageProps,
} from "../domain/topic";
import SpatialSceneTrack from "../components/stage/SpatialSceneTrack";
import styles from "./raft-consensus-election.module.css";

const metadata: { en: TopicMetadata; zh: TopicMetadata } = {
  en: {
    theme: "Raft Leader Election: Quorum Safety and Randomized Heartbeats",
    densityLabel: "Balanced",
    heroScene: 3,
    colors: {
      bg: "#ffffff",
      ink: "#1e293b",
      panel: "#f8fafc",
    },
    typography: {
      header: "System-ui 800",
      body: "System-ui 400",
    },
    tags: ["distributed-systems", "raft", "consensus", "whiteboard", "election"],
    fonts: ["System-ui"],
    scenes: [
      {
        id: 1,
        title: "Three Node Roles",
        beats: [
          {
            id: 0,
            action: "Define Follower, Candidate, and Leader states",
            title: "Follower, Candidate & Leader",
            body: "Every cluster node starts as a passive Follower; absent heartbeats, it increments its term and transitions to Candidate.",
          },
        ],
      },
      {
        id: 2,
        title: "Heartbeat & Randomized Timer",
        beats: [
          {
            id: 0,
            action: "Demonstrate randomized election timeout interval",
            title: "150ms - 300ms Randomized Timer",
            body: "Randomized timers (150-300ms) stagger election timeouts, drastically reducing split-vote ties.",
          },
          {
            id: 1,
            action: "Send RequestVote RPCs across the cluster",
            title: "RequestVote Broadcast",
            body: "A Candidate votes for itself and broadcasts RequestVote RPCs to all peers in the current term.",
          },
        ],
      },
      {
        id: 3,
        title: "Majority Quorum Voting",
        beats: [
          {
            id: 0,
            action: "Achieve majority quorum grant",
            title: "Majority Quorum (N/2 + 1) Reached",
            body: "Upon receiving votes from a strict majority ($\\lfloor N/2 \\rfloor + 1$), the candidate instantly ascends to Leader.",
          },
          {
            id: 1,
            action: "Send periodic AppendEntries heartbeats",
            title: "AppendEntries Heartbeat Pulse",
            body: "The new Leader immediately broadcasts empty AppendEntries heartbeats to suppress further elections.",
          },
        ],
      },
      {
        id: 4,
        title: "Split Brain Partition Shield",
        beats: [
          {
            id: 0,
            action: "Isolate minority partition from state commit",
            title: "Minority Partition Quenched",
            body: "A partitioned minority of 2 nodes in a 5-node cluster cannot gather 3 votes, preventing dual-leader brain split.",
          },
        ],
      },
      {
        id: 5,
        title: "Replicated State Machine",
        beats: [
          {
            id: 0,
            action: "Deliver deterministic state machine conclusion",
            title: "Deterministic Linearizable Log",
            body: "By enforcing leader-only writes and term epochs, Raft guarantees safe, understandable state replication.",
          },
        ],
      },
    ],
  },
  zh: {
    theme: "Raft 领袖选举：法定多数派与随机心跳安全机制",
    densityLabel: "均衡",
    heroScene: 3,
    colors: {
      bg: "#ffffff",
      ink: "#1e293b",
      panel: "#f8fafc",
    },
    typography: {
      header: "System-ui 800",
      body: "System-ui 400",
    },
    tags: ["分布式系统", "Raft", "一致性", "工程白板", "选主"],
    fonts: ["System-ui"],
    scenes: [
      {
        id: 1,
        title: "三种节点角色",
        beats: [
          {
            id: 0,
            action: "定义跟随者、候选人与领袖三态转换",
            title: "跟随者、候选人与领袖",
            body: "所有节点初始均为跟随者（Follower）；一旦心跳超时，即自增任期（Term）并转换为候选人（Candidate）。",
          },
        ],
      },
      {
        id: 2,
        title: "心跳与随机计时器",
        beats: [
          {
            id: 0,
            action: "展示 150-300ms 随机化选举超时",
            title: "150ms - 300ms 随机超时",
            body: "随机化选举计时器（150-300ms）错开各节点的超时触发时刻，从根本上杜绝平票瓜分风险。",
          },
          {
            id: 1,
            action: "向全集群广播 RequestVote 请求投票 RPC",
            title: "广播 RequestVote 投票请求",
            body: "候选人先投自己一票，并向集群内所有其他对等节点并发广播请求投票 RPC。",
          },
        ],
      },
      {
        id: 3,
        title: "多数派投票通过",
        beats: [
          {
            id: 0,
            action: "达成严格多数派法定选票",
            title: "达成多数派 (N/2 + 1) 选票",
            body: "一旦获得超过半数（$\\lfloor N/2 \\rfloor + 1$）节点的同意票，该候选人立即登基为唯一合法领袖（Leader）。",
          },
          {
            id: 1,
            action: "周期性发送 AppendEntries 空心跳维持权威",
            title: "周期性 AppendEntries 广播",
            body: "新领袖立即向全集群发送空的 AppendEntries 心跳包，重置其他节点的计时器以压制新的选举。",
          },
        ],
      },
      {
        id: 4,
        title: "网络分区脑裂防护",
        beats: [
          {
            id: 0,
            action: "隔离少数派分区，禁止双主脑裂",
            title: "少数派分区自动压制",
            body: "在 5 节点集群中被隔离的 2 节点少数派无论如何无法凑齐 3 张选票，绝对无法产生第二领袖。",
          },
        ],
      },
      {
        id: 5,
        title: "确定性状态机复制",
        beats: [
          {
            id: 0,
            action: "总结 Raft 一致性复制状态机的确定性保证",
            title: "线性一致性确定性日志",
            body: "通过严格的强领袖写与任期纪元约束，Raft 以最高可理解性实现了绝对安全的分布式状态机复制。",
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
              <div className={styles.boardHeader}>
                <span className={styles.boardTag}>
                  {language === "zh"
                    ? "RAFT 分布式白板"
                    : "RAFT CONSENSUS EXPLAINER"}
                </span>
                <span>TERM 104 // EPOCH OK</span>
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
                  className={styles.nodesRow}
                  data-beat-layout-item={
                    sceneId === 2 || sceneId === 3 ? "true" : undefined
                  }
                >
                  <div
                    className={`${styles.nodeCard} ${
                      sceneId >= 3 ? styles.nodeCardLeader : ""
                    }`}
                  >
                    <span className={styles.nodeRole}>
                      {sceneId >= 3 ? "👑 LEADER" : "CANDIDATE"}
                    </span>
                    <span className={styles.nodeName}>Node A (10.0.0.1)</span>
                  </div>
                  <div className={styles.nodeCard}>
                    <span className={styles.nodeRole}>FOLLOWER (VOTED)</span>
                    <span className={styles.nodeName}>Node B (10.0.0.2)</span>
                  </div>
                  <div className={styles.nodeCard}>
                    <span className={styles.nodeRole}>FOLLOWER (VOTED)</span>
                    <span className={styles.nodeName}>Node C (10.0.0.3)</span>
                  </div>
                </div>
              </div>

              <div className={styles.bottomTakeaway}>
                💡{" "}
                {language === "zh"
                  ? "核心原则：严格多数派 Quorum 保证任何两个法定集合必有交集。"
                  : "KEY TAKEAWAY: Any two majorities in a cluster must overlap by at least one node."}
              </div>
            </div>
          );
        }}
      />
    </div>
  );
}

export default defineTopic({
  id: "raft-consensus-election",
  styleId: "engineering-whiteboard-explainer",
  title: { en: "Raft Leader Election", zh: "Raft选主" },
  modelId: "Gemini 3.7 Flash",
  Stage: TopicStage,
  metadata,
  navigation: { mode: "none" },
  transitionScore: {
    "1->2": "push-x",
    "2->3": "slide-x",
    "3->4": "push-x",
    "4->5": "crossfade",
  },
  evidence: {
    kind: "facts",
    sources: [
      {
        title:
          "In Search of an Understandable Consensus Algorithm (USENIX ATC 2014)",
        url: "https://www.usenix.org/conference/atc14/technical-sessions/presentation/ongaro",
        supports:
          "Leader election safety and randomized timer state machine proof.",
      },
    ],
  },
});

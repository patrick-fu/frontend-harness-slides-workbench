import {
  defineTopic,
  type TopicMetadata,
  type TopicStageProps,
} from "../domain/topic";
import SpatialSceneTrack from "../components/stage/SpatialSceneTrack";
import styles from "./agentic-memory-hierarchy.module.css";

const metadata: { en: TopicMetadata; zh: TopicMetadata } = {
  en: {
    theme: "Autonomous Systems: The Three-Tier Memory Architecture for LLM Agents",
    densityLabel: "Dense",
    heroScene: 3,
    colors: {
      bg: "#0f172a",
      ink: "#f8fafc",
      panel: "#1e293b",
    },
    typography: {
      header: "Inter 700",
      body: "Inter 400",
    },
    tags: ["ai", "agents", "memory", "research-memo", "llm"],
    fonts: ["Inter", "sans-serif"],
    scenes: [
      {
        id: 1,
        title: "Context Window Amnesia",
        beats: [
          {
            id: 0,
            action: "Highlight context compaction degradation and multi-turn forgetting",
            title: "The Transient Context Dilemma",
            body: "Raw LLM context windows suffer quadratic attention costs and prompt dilution over hundred-turn autonomous execution loops.",
          },
        ],
      },
      {
        id: 2,
        title: "Tier 1: Working Memory",
        beats: [
          {
            id: 0,
            action: "Maintain dynamic scratchpad and live tool execution stacks",
            title: "Live Execution Scratchpad",
            body: "Working memory captures transient tool outputs, intermediate variable bindings, and sub-goal checklists within the immediate token budget.",
          },
          {
            id: 1,
            action: "Prune intermediate trace noise",
            title: "Active State Compaction",
            body: "Deterministic heuristics prune completed bash streams while preserving key outcome assertions for the current operational step.",
          },
        ],
      },
      {
        id: 3,
        title: "Tier 2: Episodic Memory",
        beats: [
          {
            id: 0,
            action: "Vectorize past session trajectories and reflection lessons",
            title: "Vectorized Episodic Retrieval",
            body: "Dense embedding indexes store past trajectories, reflection post-mortems, and error recoveries, queried via cosine similarity at $k=5$.",
          },
        ],
      },
      {
        id: 4,
        title: "Tier 3: Semantic Wiki",
        beats: [
          {
            id: 0,
            action: "Extract durable facts into linked Markdown concepts and knowledge graphs",
            title: "Curated Semantic Graph",
            body: "Agents distill verified invariant facts into linked Markdown nodes, maintaining single-source-of-truth knowledge across runs.",
          },
        ],
      },
      {
        id: 5,
        title: "Lifelong Agent Synthesis",
        beats: [
          {
            id: 0,
            action: "Close the loop for perpetual multi-session mastery",
            title: "Self-Evolving Cognitive Flywheel",
            body: "By routing queries across all three tiers, autonomous agents execute unbounded multi-day tasks without catastrophic forgetting.",
          },
        ],
      },
    ],
  },
  zh: {
    theme: "自主智能体：突破大模型上下文瓶颈的三层记忆架构",
    densityLabel: "密集",
    heroScene: 3,
    colors: {
      bg: "#0f172a",
      ink: "#f8fafc",
      panel: "#1e293b",
    },
    typography: {
      header: "Inter 700",
      body: "Inter 400",
    },
    tags: ["人工智能", "智能体", "记忆系统", "研究备忘录", "大模型"],
    fonts: ["Inter", "sans-serif"],
    scenes: [
      {
        id: 1,
        title: "上下文窗口遗忘困局",
        beats: [
          {
            id: 0,
            action: "指出百轮长交互下上下文二次方注意力膨胀与遗忘痛点",
            title: "瞬态上下文的衰减困局",
            body: "随着自主多轮任务演进，大模型受限于上下文窗口长度与二次方注意力开销，极易发生灾难性关键事实遗忘与注意力稀释。",
          },
        ],
      },
      {
        id: 2,
        title: "一阶工作记忆暂存",
        beats: [
          {
            id: 0,
            action: "维护即时草稿本与工具链执行堆栈",
            title: "即时执行草稿工作台",
            body: "工作记忆（Working Memory）在当前 Token 预算内精准暂存活跃子目标、变量绑定及工具输出的中间产物。",
          },
          {
            id: 1,
            action: "修剪执行冗余噪声",
            title: "活跃状态动态压缩",
            body: "基于规则过滤已完成任务的冗长终端日志，仅保留与下一步决策强相关的结果断言与退出状态码。",
          },
        ],
      },
      {
        id: 3,
        title: "二阶情景矢量归档",
        beats: [
          {
            id: 0,
            action: "将历史执行轨迹与复盘反思存入高维矢量索引",
            title: "情景记忆高维矢量检索",
            body: "情景记忆（Episodic Memory）将跨会话的历史轨迹、失败复盘与成功经验转化为向量嵌入，按语义相似度 Top-5 动态召回。",
          },
        ],
      },
      {
        id: 4,
        title: "三阶语义图谱知识库",
        beats: [
          {
            id: 0,
            action: "沉淀确定性知识至结构化双向链接 Wiki 节点",
            title: "结构化语义 Wiki 知识图谱",
            body: "语义记忆（Semantic Memory）将核验后的不变事实与领域模型固化为双向链接的 Markdown 知识库，实现跨任务确定性查阅。",
          },
        ],
      },
      {
        id: 5,
        title: "终身自主进化闭环",
        beats: [
          {
            id: 0,
            action: "三层协同驱动智能体无限跨轮次终身进化",
            title: "三层协同的认知进化飞轮",
            body: "通过在工作记忆、情景检索与语义知识库之间自动路由，智能体彻底摆脱单次会话束缚，迈入自进化的长程智能时代。",
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
              <div className={styles.memoHeader}>
                <span className={styles.labTag}>AI SYSTEMS RESEARCH LAB // MEMO #88</span>
                <span className={styles.confidential}>INTERNAL ARCHITECTURE</span>
              </div>

              <div
                className={styles.memoCard}
                data-beat-layout-container={sceneId === 2 ? "true" : undefined}
                data-beat-layout-mode={sceneId === 2 ? "motion" : undefined}
              >
                <div
                  className={styles.tierIndicator}
                  data-beat-layout-item={sceneId === 2 ? "true" : undefined}
                >
                  {sceneId === 1
                    ? "OVERVIEW: CONTEXT BOTTLENECK"
                    : sceneId === 2
                      ? "TIER 1: WORKING MEMORY (0-1K TOKENS)"
                      : sceneId === 3
                        ? "TIER 2: EPISODIC EMBEDDINGS (K=5 VECTOR)"
                        : sceneId === 4
                          ? "TIER 3: SEMANTIC WIKI (DURABLE GRAPH)"
                          : "SYNTHESIS: PERPETUAL FLYWHEEL"}
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
                  className={styles.hierarchyGrid}
                  data-beat-layout-item={sceneId === 2 ? "true" : undefined}
                >
                  <div className={styles.hCell}>
                    <span className={styles.hTitle}>WORKING</span>
                    <span className={styles.hDetail}>Scratchpad / RAM</span>
                  </div>
                  <div className={styles.hCell}>
                    <span className={styles.hTitle}>EPISODIC</span>
                    <span className={styles.hDetail}>Vector Embeddings</span>
                  </div>
                  <div className={styles.hCell}>
                    <span className={styles.hTitle}>SEMANTIC</span>
                    <span className={styles.hDetail}>Linked Markdown</span>
                  </div>
                </div>
              </div>

              <div className={styles.memoFooter}>
                <span>COGNITIVE ARCHITECTURE SPECIFICATION</span>
                <span>DISTRIBUTED AGENT RUNTIME</span>
              </div>
            </div>
          );
        }}
      />
    </div>
  );
}

export default defineTopic({
  id: "agentic-memory-hierarchy",
  styleId: "research-memo",
  title: { en: "Agent Memory Hierarchy", zh: "智能体记忆" },
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
        title: "Generative Agents: Interactive Simulacra of Human Behavior (Park et al.)",
        url: "https://arxiv.org/abs/2304.03442",
        supports:
          "Working scratchpad, episodic reflection retrieval, and semantic knowledge synthesis.",
      },
    ],
  },
});

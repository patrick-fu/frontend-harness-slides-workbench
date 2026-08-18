import {
  defineTopic,
  type TopicMetadata,
  type TopicStageProps,
} from "../domain/topic";
import SpatialSceneTrack from "../components/stage/SpatialSceneTrack";
import styles from "./venture-capital-deal-funnel.module.css";

const metadata: { en: TopicMetadata; zh: TopicMetadata } = {
  en: {
    theme: "Venture Deal Screening: The Mechanical Funnel from 3,000 to 5 Investments",
    densityLabel: "Dense",
    heroScene: 3,
    colors: {
      bg: "#0f172a",
      ink: "#f8fafc",
      panel: "#1e293b",
    },
    typography: {
      header: "System-ui 800",
      body: "Monospace 400",
    },
    tags: ["finance", "venture-capital", "funnel", "scoring", "startups"],
    fonts: ["Monospace", "Inter"],
    scenes: [
      {
        id: 1,
        title: "Top-of-Funnel Inbound Triage",
        beats: [
          {
            id: 0,
            action: "Scan 3,000 inbound pitch decks annually",
            title: "3,000 Inbound Pitch Decks",
            body: "Associates scan 3,000 proprietary and cold inbound pitch decks per year, applying aggressive 30-second thesis filters.",
          },
        ],
      },
      {
        id: 2,
        title: "TAM & Unit Economics Gate",
        beats: [
          {
            id: 0,
            action: "Filter down to 300 initial founder calls",
            title: "300 Founder Initial Screens",
            body: "90% of deals fail quantitative TAM thresholds ($10B+ market size) or exhibit broken unit economics (LTV/CAC < 3x).",
          },
          {
            id: 1,
            action: "Evaluate cohort retention decay curves",
            title: "Cohort Retention Smile Curve",
            body: "SaaS and consumer retention curves must flatten into a stable baseline to advance past the initial partner filter.",
          },
        ],
      },
      {
        id: 3,
        title: "Technical & Customer Diligence",
        beats: [
          {
            id: 0,
            action: "Select 30 companies for full diligence deep-dive",
            title: "30 Full Diligence Deep-Dives",
            body: "Partners conduct 20+ blind customer reference calls, code audits, and cap-table forensics, scoring risk across five vectors.",
          },
        ],
      },
      {
        id: 4,
        title: "Partner Meeting Defense",
        beats: [
          {
            id: 0,
            action: "Subject 12 finalists to full investment committee debate",
            title: "12 Partner Pitch Defenses",
            body: "Founders defend valuation, moat durability, and key hire strategy in high-stakes 60-minute partner meetings.",
          },
        ],
      },
      {
        id: 5,
        title: "5 Winning Term Sheets",
        beats: [
          {
            id: 0,
            action: "Issue 5 wired term sheets yielding 0.16% conversion",
            title: "5 Wired Lead Term Sheets",
            body: "From 3,000 top-of-funnel prospects, exactly 5 investments receive lead term sheets, driving power-law fund returns.",
          },
        ],
      },
    ],
  },
  zh: {
    theme: "风投项目分拣：从三千个商业计划书到五张投资意向书",
    densityLabel: "密集",
    heroScene: 3,
    colors: {
      bg: "#0f172a",
      ink: "#f8fafc",
      panel: "#1e293b",
    },
    typography: {
      header: "System-ui 800",
      body: "Monospace 400",
    },
    tags: ["金融", "风险投资", "分拣漏斗", "评分", "创业"],
    fonts: ["Monospace", "Inter"],
    scenes: [
      {
        id: 1,
        title: "漏斗顶端海量初筛",
        beats: [
          {
            id: 0,
            action: "年均扫描 3000 份商业计划书与项目线索",
            title: "3000 份初始商业计划书",
            body: "投资经理每年通过人脉推荐与公开渠道扫描 3000 份项目，以 30 秒硬性赛道标准快速粗筛。",
          },
        ],
      },
      {
        id: 2,
        title: "市场规模与单体经济",
        beats: [
          {
            id: 0,
            action: "筛选出 300 家创始人初聊会面",
            title: "300 场创始人初聊会面",
            body: "90% 的项目因潜在市场规模（TAM < 100亿美元）不足或单客经济模型（LTV/CAC < 3）缺陷被无情淘汰。",
          },
          {
            id: 1,
            action: "深度分析用户群组留存微笑曲线",
            title: "群组留存微笑曲线验证",
            body: "核心业务指标必须展现出平缓触底回升的留存微笑曲线，方能进入下一轮合伙人评审阶段。",
          },
        ],
      },
      {
        id: 3,
        title: "客户访谈与代码尽调",
        beats: [
          {
            id: 0,
            action: "精选 30 家进入深度尽职调查流程",
            title: "30 家进入深度尽职调查",
            body: "合伙人执行 20 场以上匿名客户背调访谈、架构代码审计与股权穿透，在五大维度进行机械打分。",
          },
        ],
      },
      {
        id: 4,
        title: "合伙人过会答辩",
        beats: [
          {
            id: 0,
            action: "12 家决赛团队参加合伙人正式过会",
            title: "12 家合伙人全员过会答辩",
            body: "创始人参加 60 分钟高压合伙人会议，就估值对赌、护城河壁垒与核心高管招募展开终极辩论。",
          },
        ],
      },
      {
        id: 5,
        title: "五份领投意向书",
        beats: [
          {
            id: 0,
            action: "最终签发 5 份 Term Sheet 达成 0.16% 转化",
            title: "最终签署 5 份领投 Term Sheet",
            body: "从 3000 份初始漏斗中沉淀出最终 5 张领投投资意向书，以 0.16% 的严苛转化率博取幂律回报。",
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
              <header className={styles.funnelHeader}>
                <div>
                  <span style={{ fontWeight: 800, color: "#38bdf8" }}>
                    {language === "zh"
                      ? "风投漏斗分拣机"
                      : "VENTURE DEAL SCREENING FUNNEL"}
                  </span>
                </div>
                <div className={styles.scoreBadge}>
                  {sceneId === 1 && "3,000 DEALS"}
                  {sceneId === 2 && "300 SCREENED"}
                  {sceneId === 3 && "30 DILIGENCE"}
                  {sceneId === 4 && "12 IC PITCH"}
                  {sceneId === 5 && "5 FUNDED"}
                </div>
              </header>

              <div
                className={styles.funnelCard}
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
                  className={styles.funnelLanes}
                  data-beat-layout-item={sceneId === 2 ? "true" : undefined}
                >
                  <div
                    className={`${styles.funnelLane} ${
                      sceneId === 1 ? styles.laneActive : ""
                    }`}
                  >
                    <div className={styles.laneCount}>3,000</div>
                    <div className={styles.laneName}>INBOUND</div>
                  </div>
                  <div
                    className={`${styles.funnelLane} ${
                      sceneId === 2 ? styles.laneActive : ""
                    }`}
                  >
                    <div className={styles.laneCount}>300</div>
                    <div className={styles.laneName}>SCREEN</div>
                  </div>
                  <div
                    className={`${styles.funnelLane} ${
                      sceneId === 3 ? styles.laneActive : ""
                    }`}
                  >
                    <div className={styles.laneCount}>30</div>
                    <div className={styles.laneName}>DILIGENCE</div>
                  </div>
                  <div
                    className={`${styles.funnelLane} ${
                      sceneId === 4 ? styles.laneActive : ""
                    }`}
                  >
                    <div className={styles.laneCount}>12</div>
                    <div className={styles.laneName}>IC VOTE</div>
                  </div>
                  <div
                    className={`${styles.funnelLane} ${
                      sceneId === 5 ? styles.laneActive : ""
                    }`}
                  >
                    <div className={styles.laneCount}>5</div>
                    <div className={styles.laneName}>FUNDED</div>
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
  id: "venture-capital-deal-funnel",
  styleId: "mechanical-scoring-funnel",
  title: { en: "Venture Deal Screening", zh: "风投项目分拣" },
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
    kind: "mixed",
    sources: [
      {
        title: "Venture Capital Deal Funnel Statistics (National Venture Capital Association)",
        url: "https://nvca.org/research/research-resources/",
        supports:
          "Statistical conversion rates from 3,000 pitch decks to 5 closed investments.",
      },
    ],
    boundary: {
      en: "Illustrative investment pipeline model representing venture capital power-law distributions.",
      zh: "风险投资漏斗模型展示，代表风投机构幂律收益下的分拣流程。",
    },
    display: "envelope",
  },
});

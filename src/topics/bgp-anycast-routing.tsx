import {
  defineTopic,
  type TopicMetadata,
  type TopicStageProps,
} from "../domain/topic";
import SpatialSceneTrack from "../components/stage/SpatialSceneTrack";
import styles from "./bgp-anycast-routing.module.css";

const metadata: { en: TopicMetadata; zh: TopicMetadata } = {
  en: {
    theme: "BGP Anycast Routing: Global Autonomous Convergence Map",
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
    tags: ["networking", "bgp", "routing", "transit", "anycast"],
    fonts: ["System-ui"],
    scenes: [
      {
        id: 1,
        title: "Global Autonomous Network",
        beats: [
          {
            id: 0,
            action: "Map global Autonomous System peering mesh",
            title: "Peering Mesh (AS Graph)",
            body: "Over 70,000 Autonomous Systems announce IP prefixes across Tier-1 transit backbones and public Internet Exchanges.",
          },
        ],
      },
      {
        id: 2,
        title: "Route Hijacking Defense",
        beats: [
          {
            id: 0,
            action: "Demonstrate unauthorized prefix announcement",
            title: "Prefix Hijacking Threat",
            body: "Rogue AS announcements can misroute global traffic unless cryptographic RPKI validation filters invalid origin paths.",
          },
          {
            id: 1,
            action: "Validate origin authorization via RPKI ROA",
            title: "Cryptographic RPKI Shield",
            body: "Cryptographic Route Origin Authorizations reject illegitimate advertisements at edge border routers in real time.",
          },
        ],
      },
      {
        id: 3,
        title: "Anycast Convergence",
        beats: [
          {
            id: 0,
            action: "Broadcast single IP address from 300 global PoPs",
            title: "Single IP, 300 Global PoPs",
            body: "The same /24 IPv4 prefix is announced simultaneously worldwide; shortest AS-path metric steers clients to local PoPs.",
          },
          {
            id: 1,
            action: "Measure sub-10ms edge latency drop",
            title: "Sub-10ms Regional Ingress",
            body: "Clients converge on the geographically nearest data center, absorbing massive DDoS volumetric floods locally.",
          },
        ],
      },
      {
        id: 4,
        title: "Undersea Cable Failover",
        beats: [
          {
            id: 0,
            action: "Simulate trans-Pacific fiber cut withdrawal",
            title: "Subsea Fiber Failover",
            body: "When subsea fiber severs, BGP WITHDRAW messages propagate in milliseconds, re-routing packets through redundant paths.",
          },
        ],
      },
      {
        id: 5,
        title: "Global Digital Arteries",
        beats: [
          {
            id: 0,
            action: "Synthesize distributed routing resilience",
            title: "Resilient Global Spine",
            body: "BGP Anycast transforms brittle point-to-point connections into an elastic, self-healing planetary nervous system.",
          },
        ],
      },
    ],
  },
  zh: {
    theme: "BGP 选路中继：全球自治系统收敛图谱",
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
    tags: ["网络", "BGP", "路由", "中继", "Anycast"],
    fonts: ["System-ui"],
    scenes: [
      {
        id: 1,
        title: "全球自治系统拓扑",
        beats: [
          {
            id: 0,
            action: "绘制全球 AS 自治系统互联网络",
            title: "自治系统互联拓扑",
            body: "全球超过 70,000 个自治系统通过一级骨干网与公用交换中心广播 IP 地址前缀。",
          },
        ],
      },
      {
        id: 2,
        title: "路径宣告防劫持",
        beats: [
          {
            id: 0,
            action: "呈现未经授权的非法前缀宣告",
            title: "BGP 前缀劫持威胁",
            body: "恶意或错误的 AS 宣告会导致全球流量被错误牵引，引发大面积服务瘫痪。",
          },
          {
            id: 1,
            action: "通过 RPKI 签名校验宣告起源",
            title: "RPKI 密码学安全护盾",
            body: "边缘路由器实时校验路由源授权 ROA，自动丢弃伪造前缀，确保路径宣告真实可信。",
          },
        ],
      },
      {
        id: 3,
        title: "同地址最近汇聚",
        beats: [
          {
            id: 0,
            action: "全球 300 节点广播同一 IP 地址",
            title: "同 IP 全球 300 节点广播",
            body: "全球数百个边缘节点广播完全相同的 IP 段，BGP 最短 AS-Path 规则引导用户直达最近机房。",
          },
          {
            id: 1,
            action: "达成低于 10ms 的就近接入",
            title: "亚 10ms 极速本地收敛",
            body: "流量被彻底就近清洗与分流，TB 级 DDoS 洪水攻击被分散至全球边缘就地化解。",
          },
        ],
      },
      {
        id: 4,
        title: "海缆故障毫秒自愈",
        beats: [
          {
            id: 0,
            action: "模拟跨洋海缆物理中断撤销路由",
            title: "跨洋海缆毫秒级逃生",
            body: "当跨洋光缆发生物理断裂，BGP 撤销报文在数百毫秒内完成全网扩散并切换备用路径。",
          },
        ],
      },
      {
        id: 5,
        title: "数字文明血管",
        beats: [
          {
            id: 0,
            action: "总结去中心化分布式路由网络",
            title: "自愈的行星级网络",
            body: "BGP Anycast 将脆弱的单点连接重塑为具备自愈弹性的全球数字脉络，支撑起现代互联网。",
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
          "3->4": "wipe",
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
                className={styles.subwayContainer}
                data-beat-layout-container={
                  sceneId === 2 || sceneId === 3 ? "true" : undefined
                }
                data-beat-layout-mode={
                  sceneId === 2 || sceneId === 3 ? "motion" : undefined
                }
              >
                <div
                  className={styles.routeBadge}
                  data-beat-layout-item={
                    sceneId === 2 || sceneId === 3 ? "true" : undefined
                  }
                >
                  <span>ROUTE 179</span>
                  <span>//</span>
                  <span>
                    {language === "zh" ? "BGP 选路中继" : "BGP TRANSIT MAP"}
                  </span>
                </div>
                <h1
                  className={styles.stationTitle}
                  data-beat-layout-item={
                    sceneId === 2 || sceneId === 3 ? "true" : undefined
                  }
                >
                  {currentBeat.title}
                </h1>
                <p
                  className={styles.stationBody}
                  data-beat-layout-item={
                    sceneId === 2 || sceneId === 3 ? "true" : undefined
                  }
                >
                  {currentBeat.body}
                </p>
                <div
                  className={styles.transitLine}
                  data-beat-layout-item={
                    sceneId === 2 || sceneId === 3 ? "true" : undefined
                  }
                >
                  <div className={styles.lineDot} />
                  <span className={styles.lineMeta}>
                    STATION 0{sceneId} // CONVERGENCE POINT // AS13335
                  </span>
                </div>
              </div>
            </div>
          );
        }}
      />
    </div>
  );
}

export default defineTopic({
  id: "bgp-anycast-routing",
  styleId: "subway-map-of-intent",
  title: { en: "BGP Anycast Routing", zh: "BGP 选路中继" },
  modelId: "Gemini 3.7 Flash",
  Stage: TopicStage,
  metadata,
  navigation: { mode: "none" },
  transitionScore: {
    "1->2": "push-x",
    "2->3": "slide-x",
    "3->4": "wipe",
    "4->5": "crossfade",
  },
  evidence: {
    kind: "facts",
    sources: [
      {
        title: "RFC 4786: Operation of Anycast Services",
        url: "https://datatracker.ietf.org/doc/html/rfc4786",
        supports:
          "BGP anycast route propagation and shortest-AS-path convergence.",
      },
    ],
  },
});

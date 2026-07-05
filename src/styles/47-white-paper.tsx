import { useState, useEffect, useCallback, useRef } from "react";
import type { BespokeStyleProps, StyleMetadata } from "../types";
import styles from "./47-white-paper.module.css";

/* ── Transition constants ──────────────────────────────────────────────── */

const TRANSITION_DURATION = 600; // ms — page edge peel
const BEAT_COUNTS: Record<number, number> = { 1: 1, 2: 2, 3: 3, 4: 3, 5: 2 };

/* ── Content ─────────────────────────────────────────────────────────────── */

const SCENES = {
  en: {
    scenes: [
      {
        id: "cover",
        label: "Cover",
        icon: "📄",
        series: "Technical White Paper · WP-2025-014",
        title: "Distributed Systems",
        titleEm: "Architecture",
        titleSuffix: "at Scale",
        subtitle:
          "Design Patterns, Performance Trade-offs, and Production Lessons from Operating a Global Consensus Platform",
        authors: "Dr. Marcus Chen, Sarah Okonkwo, James Whitfield, PhD",
        affil: "Nexus Labs · Distributed Systems Research Group",
        abstractLabel: "Abstract",
        abstract:
          "This white paper presents the architecture of Nexus Consensus Platform (NCP), a distributed coordination engine designed for sub-100ms global replication. We describe the system's layered architecture, consensus algorithm (Raft++), and performance characteristics across 14 regional deployments. Benchmark results demonstrate 2.4M ops/sec throughput with p99 latency of 47ms under sustained load.",
      },
      {
        id: "overview",
        label: "Overview",
        icon: "🔍",
        title: "System Overview",
        subtitle: "Design goals and architectural principles",
        paras: [
          "The Nexus Consensus Platform was designed to address the fundamental tension between consistency guarantees and operational latency in globally distributed systems. Traditional consensus protocols like Paxos and Raft provide strong guarantees but impose significant coordination overhead at scale.",
          "Our approach introduces three key innovations: (1) hierarchical consensus zones that reduce cross-region coordination by 73%, (2) adaptive quorum selection that responds to network conditions in real-time, and (3) speculative execution with rollback for non-conflicting operations.",
          "The system serves as the coordination backbone for Nexus's entire product suite, handling 40 billion consensus decisions per day across 14 availability zones with a measured SLO of 99.997% over 18 months of production operation.",
        ],
        terms: [
          "Consensus",
          "Raft++",
          "Quorum",
          "Sharding",
          "Vector Clocks",
          "CRDT",
          "Byzantine Fault Tolerance",
        ],
      },
      {
        id: "architecture",
        label: "Architecture",
        icon: "🏗️",
        title: "System Architecture",
        subtitle: "Layered component diagram and data flow",
        nodes: [
          {
            id: "client",
            label: "Client Gateway",
            sub: "gRPC · REST",
            icon: "🌐",
            x: 5,
            y: 40,
            w: 14,
            h: 18,
            highlight: false,
          },
          {
            id: "router",
            label: "Request Router",
            sub: "Consistent Hash",
            icon: "🔀",
            x: 24,
            y: 40,
            w: 14,
            h: 18,
            highlight: false,
          },
          {
            id: "coordinator",
            label: "Coordinator",
            sub: "Raft++ Leader",
            icon: "⚡",
            x: 43,
            y: 15,
            w: 14,
            h: 18,
            highlight: true,
          },
          {
            id: "log",
            label: "Replicated Log",
            sub: "Segmented · WAL",
            icon: "📋",
            x: 43,
            y: 65,
            w: 14,
            h: 18,
            highlight: false,
          },
          {
            id: "storage",
            label: "Storage Engine",
            sub: "LSM-Tree · SSTable",
            icon: "💾",
            x: 62,
            y: 40,
            w: 14,
            h: 18,
            highlight: false,
          },
          {
            id: "observer",
            label: "Observer Nodes",
            sub: "Read Replicas ×42",
            icon: "👁️",
            x: 81,
            y: 40,
            w: 14,
            h: 18,
            highlight: false,
          },
        ],
        connections: [
          { from: "client", to: "router", label: "requests" },
          { from: "router", to: "coordinator", label: "writes" },
          { from: "router", to: "observer", label: "reads" },
          { from: "coordinator", to: "log", label: "append" },
          { from: "log", to: "storage", label: "commit" },
          { from: "storage", to: "observer", label: "replicate" },
        ],
        legend: [
          { label: "Data Flow", color: "#0369a1" },
          { label: "Replication", color: "#7c3aed" },
          { label: "Read Path", color: "#64748b" },
        ],
      },
      {
        id: "benchmarks",
        label: "Benchmarks",
        icon: "📈",
        title: "Performance Benchmarks",
        subtitle: "Comparative analysis across consensus implementations",
        rows: [
          {
            system: "Nexus NCP",
            sub: "Raft++ · Hierarchical",
            throughput: 2400,
            pct: 100,
            latency: "47ms",
            best: true,
          },
          {
            system: "Apache ZooKeeper",
            sub: "ZAB · Single Leader",
            throughput: 890,
            pct: 37,
            latency: "124ms",
            best: false,
          },
          {
            system: "etcd",
            sub: "Raft · Standard",
            throughput: 1340,
            pct: 56,
            latency: "89ms",
            best: false,
          },
          {
            system: "Consul",
            sub: "Raft · Gossip",
            throughput: 1050,
            pct: 44,
            latency: "103ms",
            best: false,
          },
          {
            system: "CockroachDB",
            sub: "Multi-Raft",
            throughput: 1780,
            pct: 74,
            latency: "68ms",
            best: false,
          },
          {
            system: "Spanner (est.)",
            sub: "TrueTime · Paxos",
            throughput: 2100,
            pct: 88,
            latency: "54ms",
            best: false,
          },
        ],
      },
      {
        id: "conclusion",
        label: "Conclusion",
        icon: "🎯",
        title: "Conclusion & Future Work",
        subtitle: "Key findings and research roadmap",
        paras: [
          "The Nexus Consensus Platform demonstrates that strong consistency guarantees need not come at the cost of operational latency. Through hierarchical consensus zones, adaptive quorum selection, and speculative execution, we achieve throughput levels previously associated only with eventually consistent systems.",
          "Production deployment across 14 regions over 18 months validates the architecture's resilience. The system survived three regional network partitions without data loss or SLO violation, confirming the correctness of our Raft++ implementation.",
        ],
        contribLabel: "Key Contributions",
        contributions: [
          "Hierarchical consensus zones reduce cross-region traffic by 73%",
          "Adaptive quorum selection improves tail latency by 41% under degraded network",
          "Speculative execution achieves 1.8x throughput for read-heavy workloads",
          "Open-source benchmark suite released for reproducible consensus comparison",
        ],
        refsLabel: "Selected References",
        refs: [
          "[1] Ongaro, D. & Ousterhout, J. \"In Search of an Understandable Consensus Algorithm.\" USENIX ATC, 2014.",
          "[2] Corbett, J. et al. \"Spanner: Google's Globally-Distributed Database.\" OSDI, 2012.",
          "[3] Chen, M. et al. \"Raft++: Adaptive Quorum for Geo-Distributed Consensus.\" SOSP, 2024.",
        ],
      },
    ],
  },
  zh: {
    scenes: [
      {
        id: "cover",
        label: "封面",
        icon: "📄",
        series: "技术白皮书 · WP-2025-014",
        title: "大规模分布式系统",
        titleEm: "架构",
        titleSuffix: "设计",
        subtitle: "全球共识平台的设计模式、性能权衡与生产实践经验",
        authors: "陈马可博士、奥孔科沃、惠特菲尔德博士",
        affil: "Nexus实验室 · 分布式系统研究组",
        abstractLabel: "摘要",
        abstract:
          "本白皮书介绍Nexus共识平台（NCP）的架构，这是一个为亚100毫秒全球复制设计的分布式协调引擎。我们描述了系统的分层架构、共识算法（Raft++）和14个区域部署的性能特征。基准测试结果显示，在持续负载下吞吐量达240万操作/秒，p99延迟为47毫秒。",
      },
      {
        id: "overview",
        label: "概述",
        icon: "🔍",
        title: "系统概述",
        subtitle: "设计目标和架构原则",
        paras: [
          "Nexus共识平台旨在解决全球分布式系统中一致性保证与操作延迟之间的根本矛盾。传统的Paxos和Raft等共识协议提供强保证，但在大规模下施加显著的协调开销。",
          "我们的方案引入三项关键创新：（1）分层共识区域将跨区域协调减少73%；（2）自适应仲裁选择实时响应网络状况；（3）非冲突操作的推测执行与回滚。",
          "该系统作为Nexus整个产品套件的协调骨干，每天处理400亿次共识决策，覆盖14个可用区，18个月生产运行的SLO为99.997%。",
        ],
        terms: [
          "共识",
          "Raft++",
          "仲裁",
          "分片",
          "向量时钟",
          "CRDT",
          "拜占庭容错",
        ],
      },
      {
        id: "architecture",
        label: "架构",
        icon: "🏗️",
        title: "系统架构",
        subtitle: "分层组件图和数据流",
        nodes: [
          {
            id: "client",
            label: "客户端网关",
            sub: "gRPC · REST",
            icon: "🌐",
            x: 5,
            y: 40,
            w: 14,
            h: 18,
            highlight: false,
          },
          {
            id: "router",
            label: "请求路由器",
            sub: "一致性哈希",
            icon: "🔀",
            x: 24,
            y: 40,
            w: 14,
            h: 18,
            highlight: false,
          },
          {
            id: "coordinator",
            label: "协调器",
            sub: "Raft++ 领导者",
            icon: "⚡",
            x: 43,
            y: 15,
            w: 14,
            h: 18,
            highlight: true,
          },
          {
            id: "log",
            label: "复制日志",
            sub: "分段 · WAL",
            icon: "📋",
            x: 43,
            y: 65,
            w: 14,
            h: 18,
            highlight: false,
          },
          {
            id: "storage",
            label: "存储引擎",
            sub: "LSM-Tree · SSTable",
            icon: "💾",
            x: 62,
            y: 40,
            w: 14,
            h: 18,
            highlight: false,
          },
          {
            id: "observer",
            label: "观察者节点",
            sub: "读副本 ×42",
            icon: "👁️",
            x: 81,
            y: 40,
            w: 14,
            h: 18,
            highlight: false,
          },
        ],
        connections: [
          { from: "client", to: "router", label: "请求" },
          { from: "router", to: "coordinator", label: "写入" },
          { from: "router", to: "observer", label: "读取" },
          { from: "coordinator", to: "log", label: "追加" },
          { from: "log", to: "storage", label: "提交" },
          { from: "storage", to: "observer", label: "复制" },
        ],
        legend: [
          { label: "数据流", color: "#0369a1" },
          { label: "复制流", color: "#7c3aed" },
          { label: "读取路径", color: "#64748b" },
        ],
      },
      {
        id: "benchmarks",
        label: "基准",
        icon: "📈",
        title: "性能基准测试",
        subtitle: "共识实现的对比分析",
        rows: [
          {
            system: "Nexus NCP",
            sub: "Raft++ · 分层",
            throughput: 2400,
            pct: 100,
            latency: "47ms",
            best: true,
          },
          {
            system: "Apache ZooKeeper",
            sub: "ZAB · 单领导者",
            throughput: 890,
            pct: 37,
            latency: "124ms",
            best: false,
          },
          {
            system: "etcd",
            sub: "Raft · 标准",
            throughput: 1340,
            pct: 56,
            latency: "89ms",
            best: false,
          },
          {
            system: "Consul",
            sub: "Raft · Gossip",
            throughput: 1050,
            pct: 44,
            latency: "103ms",
            best: false,
          },
          {
            system: "CockroachDB",
            sub: "Multi-Raft",
            throughput: 1780,
            pct: 74,
            latency: "68ms",
            best: false,
          },
          {
            system: "Spanner (估)",
            sub: "TrueTime · Paxos",
            throughput: 2100,
            pct: 88,
            latency: "54ms",
            best: false,
          },
        ],
      },
      {
        id: "conclusion",
        label: "结论",
        icon: "🎯",
        title: "结论与未来工作",
        subtitle: "关键发现和研究路线图",
        paras: [
          "Nexus共识平台证明强一致性保证不必以操作延迟为代价。通过分层共识区域、自适应仲裁选择和推测执行，我们实现了此前仅与最终一致性系统关联的吞吐量水平。",
          "14个区域18个月的生产部署验证了架构的韧性。系统在三次区域网络分区中幸存，无数据丢失或SLO违规，确认了Raft++实现的正确性。",
        ],
        contribLabel: "核心贡献",
        contributions: [
          "分层共识区域将跨区域流量减少73%",
          "自适应仲裁选择在网络降级时将尾部延迟改善41%",
          "推测执行在读密集工作负载下实现1.8倍吞吐量",
          "发布开源基准测试套件用于可复现的共识比较",
        ],
        refsLabel: "参考文献",
        refs: [
          "[1] Ongaro, D. & Ousterhout, J.《寻求可理解的共识算法》USENIX ATC, 2014.",
          "[2] Corbett, J. 等《Spanner: Google的全球分布式数据库》OSDI, 2012.",
          "[3] Chen, M. 等《Raft++: 地理分布式共识的自适应仲裁》SOSP, 2024.",
        ],
      },
    ],
  },
} as const;

/* ── Component ───────────────────────────────────────────────────────────── */

export default function WhitePaper({
  scene,
  beat,
  language,
  isThumbnail,
  reducedMotion,
  onNavigate,
  isTransitionClone,
}: BespokeStyleProps) {
  const [entered, setEntered] = useState(false);
  const [outgoingScene, setOutgoingScene] = useState<number | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const prevSceneRef = useRef<number>(scene);

  // Detect scene changes and manage transition lifecycle
  useEffect(() => {
    const prev = prevSceneRef.current;
    if (prev !== scene && !reducedMotion) {
      setOutgoingScene(prev);
      setIsTransitioning(true);
      const timer = setTimeout(() => {
        setOutgoingScene(null);
        setIsTransitioning(false);
      }, TRANSITION_DURATION);
      prevSceneRef.current = scene;
      return () => clearTimeout(timer);
    }
    prevSceneRef.current = scene;
  }, [scene, reducedMotion]);

  useEffect(() => {
    const id = "style-47-fonts";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Noto+Sans+SC:wght@400;500;700&family=JetBrains+Mono:wght@400;500&display=swap";
    document.head.appendChild(link);
  }, []);

  useEffect(() => {
    setEntered(false);
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => setEntered(true));
    });
    return () => cancelAnimationFrame(id);
  }, [scene]);

  const handleNavClick = useCallback(
    (e: React.MouseEvent, target: number) => {
      e.stopPropagation();
      onNavigate?.(target, 0);
    },
    [onNavigate],
  );

  const data = SCENES[language];
  const rootClasses = [styles.root, reducedMotion ? styles.reducedMotion : ""]
    .filter(Boolean)
    .join(" ");

  /* Scene 1: Cover */
  const renderCover = (sceneNum: number, _beatNum: number, isEntered: boolean) => {
    const s = data.scenes[sceneNum - 1] as (typeof data.scenes)[0];
    return (
      <div className={styles.cover}>
        <div className={styles.coverSeries}>{s.series}</div>
        <h1 className={styles.coverTitle}>
          {s.title} <em>{s.titleEm}</em>
          <br />
          {s.titleSuffix}
        </h1>
        <p className={styles.coverSubtitle}>{s.subtitle}</p>
        <div className={styles.coverRule} />
        <p className={styles.coverAuthors}>{s.authors}</p>
        <p className={styles.coverAffil}>{s.affil}</p>
        <div className={styles.coverAbstract}>
          <div className={styles.coverAbstractLabel}>{s.abstractLabel}</div>
          <p className={styles.coverAbstractText}>{s.abstract}</p>
        </div>
      </div>
    );
  };

  /* Scene 2: Overview */
  const renderOverview = (sceneNum: number, beatNum: number, isEntered: boolean) => {
    const s = data.scenes[sceneNum - 1] as (typeof data.scenes)[1];
    return (
      <div className={styles.overview}>
        <div className={styles.overviewHeader}>
          <h2 className={styles.overviewTitle}>{s.title}</h2>
          <p className={styles.overviewSubtitle}>{s.subtitle}</p>
        </div>
        <div className={styles.overviewBody}>
          {s.paras.map((p, i) => (
            <p
              key={i}
              className={styles.overviewPara}
              style={{
                opacity: isEntered && i <= beatNum ? 1 : 0,
                transform:
                  isEntered && i <= beatNum
                    ? "translateY(0)"
                    : "translateY(0.8cqh)",
                transition: "opacity 0.4s ease, transform 0.4s ease",
                transitionDelay: `${i * 0.15}s`,
              }}
            >
              {p}
            </p>
          ))}
          <div className={styles.overviewKeyTerms}>
            {s.terms.map((term, i) => (
              <span
                key={i}
                className={styles.overviewTerm}
                style={{
                  opacity: isEntered && beatNum >= 1 ? 1 : 0,
                  transition: "opacity 0.3s ease",
                  transitionDelay: `${i * 0.05}s`,
                }}
              >
                {term}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  };

  /* Scene 3: Architecture Diagram (HERO) */
  const renderArchitecture = (sceneNum: number, beatNum: number, isEntered: boolean) => {
    const s = data.scenes[sceneNum - 1] as (typeof data.scenes)[2];
    const visibleNodes = Math.min(beatNum * 2 + 3, s.nodes.length);
    return (
      <div className={styles.architecture}>
        <div className={styles.archHeader}>
          <h2 className={styles.archTitle}>{s.title}</h2>
          <p className={styles.archSubtitle}>{s.subtitle}</p>
        </div>
        <div className={styles.archDiagram}>
          {/* SVG connection lines */}
          <svg className={styles.archSvg} viewBox="0 0 100 100" preserveAspectRatio="none">
            {s.connections.slice(0, Math.max(0, visibleNodes - 1)).map((conn, i) => {
              const fromNode = s.nodes.find((n) => n.id === conn.from);
              const toNode = s.nodes.find((n) => n.id === conn.to);
              if (!fromNode || !toNode) return null;
              const x1 = fromNode.x + fromNode.w / 2;
              const y1 = fromNode.y + fromNode.h / 2;
              const x2 = toNode.x + toNode.w / 2;
              const y2 = toNode.y + toNode.h / 2;
              const isReplication =
                conn.label === "replicate" || conn.label === "复制";
              const isRead = conn.label === "reads" || conn.label === "读取";
              const stroke = isReplication
                ? "#7c3aed"
                : isRead
                  ? "#64748b"
                  : "#0369a1";
              return (
                <line
                  key={i}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={stroke}
                  strokeWidth="0.3"
                  strokeDasharray={isRead ? "1.5,0.8" : "none"}
                  markerEnd={`url(#arrow-${stroke.replace("#", "")})`}
                />
              );
            })}
            <defs>
              {["#0369a1", "#7c3aed", "#64748b"].map((c) => (
                <marker
                  key={c}
                  id={`arrow-${c.replace("#", "")}`}
                  viewBox="0 0 10 10"
                  refX="9"
                  refY="5"
                  markerWidth="3"
                  markerHeight="3"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 0 L 10 5 L 0 10 z" fill={c} />
                </marker>
              ))}
            </defs>
          </svg>
          {/* Nodes */}
          {s.nodes.slice(0, visibleNodes).map((node) => (
            <div
              key={node.id}
              className={`${styles.archNode} ${
                node.highlight ? styles.archNodeHighlight : ""
              }`}
              style={{
                left: `${node.x}cqw`,
                top: `${node.y}cqh`,
                width: `${node.w}cqw`,
                height: `${node.h}cqh`,
                opacity: isEntered ? 1 : 0,
                transform: isEntered ? "scale(1)" : "scale(0.9)",
                transition:
                  "opacity 0.4s ease, transform 0.4s ease",
              }}
            >
              <div className={styles.archNodeIcon}>{node.icon}</div>
              <div className={styles.archNodeLabel}>{node.label}</div>
              <div className={styles.archNodeSub}>{node.sub}</div>
            </div>
          ))}
        </div>
        <div className={styles.archLegend}>
          {s.legend.map((item, i) => (
            <div key={i} className={styles.archLegendItem}>
              <div
                className={styles.archLegendLine}
                style={{ background: item.color }}
              />
              {item.label}
            </div>
          ))}
        </div>
      </div>
    );
  };

  /* Scene 4: Benchmarks */
  const renderBenchmarks = (sceneNum: number, beatNum: number, isEntered: boolean) => {
    const s = data.scenes[sceneNum - 1] as (typeof data.scenes)[3];
    const visibleCount = Math.min(beatNum * 2 + 3, s.rows.length);
    return (
      <div className={styles.benchmarks}>
        <div className={styles.benchHeader}>
          <h2 className={styles.benchTitle}>{s.title}</h2>
          <p className={styles.benchSubtitle}>{s.subtitle}</p>
        </div>
        <div className={styles.benchTableWrap}>
          <table className={styles.benchTable}>
            <thead>
              <tr>
                <th>{language === "zh" ? "系统" : "System"}</th>
                <th>{language === "zh" ? "吞吐量" : "Throughput"}</th>
                <th>{language === "zh" ? "相对性能" : "Relative"}</th>
                <th>p99 {language === "zh" ? "延迟" : "Latency"}</th>
              </tr>
            </thead>
            <tbody>
              {s.rows.slice(0, visibleCount).map((row, i) => (
                <tr
                  key={row.system}
                  style={{
                    opacity: isEntered ? 1 : 0,
                    transition: "opacity 0.3s ease",
                    transitionDelay: `${i * 0.07}s`,
                  }}
                >
                  <td>
                    <span
                      className={`${styles.benchSystem} ${
                        row.best ? styles.benchBest : ""
                      }`}
                    >
                      {row.system}
                    </span>
                    <span className={styles.benchSystemSub}>{row.sub}</span>
                  </td>
                  <td
                    style={{
                      fontFamily: '"SF Mono", "Fira Code", monospace',
                      fontWeight: 600,
                    }}
                  >
                    {row.throughput.toLocaleString()}{" "}
                    <span style={{ color: "var(--style-47-muted)", fontSize: "0.8em" }}>
                      ops/s
                    </span>
                  </td>
                  <td className={styles.benchBarCell}>
                    <div className={styles.benchBarWrap}>
                      <div
                        className={styles.benchBarFill}
                        style={{ width: isEntered ? `${row.pct}%` : "0%" }}
                      />
                    </div>
                  </td>
                  <td
                    className={row.best ? styles.benchBest : ""}
                    style={{ textAlign: "right" }}
                  >
                    {row.latency}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  /* Scene 5: Conclusion */
  const renderConclusion = (sceneNum: number, beatNum: number, isEntered: boolean) => {
    const s = data.scenes[sceneNum - 1] as (typeof data.scenes)[4];
    return (
      <div className={styles.conclusion}>
        <div className={styles.concHeader}>
          <h2 className={styles.concTitle}>{s.title}</h2>
          <p className={styles.concSubtitle}>{s.subtitle}</p>
        </div>
        <div className={styles.concBody}>
          {s.paras.map((p, i) => (
            <p
              key={i}
              className={styles.concPara}
              style={{
                opacity: isEntered && i <= beatNum ? 1 : 0,
                transform:
                  isEntered && i <= beatNum
                    ? "translateY(0)"
                    : "translateY(0.6cqh)",
                transition: "opacity 0.4s ease, transform 0.4s ease",
                transitionDelay: `${i * 0.15}s`,
              }}
            >
              {p}
            </p>
          ))}
          <div className={styles.concContributions}>
            <div className={styles.concContribLabel}>{s.contribLabel}</div>
            {s.contributions.map((c, i) => (
              <div
                key={i}
                className={styles.concContribItem}
                style={{
                  opacity: isEntered && beatNum >= 1 ? 1 : 0,
                  transition: "opacity 0.3s ease",
                  transitionDelay: `${i * 0.08}s`,
                }}
              >
                {c}
              </div>
            ))}
          </div>
          <div className={styles.concRefs}>
            <div className={styles.concRefsLabel}>{s.refsLabel}</div>
            {s.refs.map((r, i) => (
              <div key={i} className={styles.concRefItem}>
                {r}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  /* Navigation */
  const renderNav = () => {
    if (isThumbnail) return null;
    return (
      <nav className={styles.nav}>
        <div className={styles.navItems}>
          {data.scenes.map((s, i) => (
            <button
              key={s.id}
              className={`${styles.navItem} ${
                i + 1 === scene ? styles.navItemActive : ""
              }`}
              onClick={(e) => handleNavClick(e, i + 1)}
              aria-label={`Jump to scene ${i + 1}`}
            >
              <span className={styles.navIcon}>{s.icon}</span>
              <span className={styles.navLabel}>{s.label}</span>
            </button>
          ))}
        </div>
      </nav>
    );
  };

  const renderSceneFor = (sceneNum: number, beatNum: number, isEntered: boolean) => {
    switch (sceneNum) {
      case 1:
        return renderCover(sceneNum, beatNum, isEntered);
      case 2:
        return renderOverview(sceneNum, beatNum, isEntered);
      case 3:
        return renderArchitecture(sceneNum, beatNum, isEntered);
      case 4:
        return renderBenchmarks(sceneNum, beatNum, isEntered);
      case 5:
        return renderConclusion(sceneNum, beatNum, isEntered);
      default:
        return null;
    }
  };

  /* Layer classes */
  const outgoingLayerClasses = [styles.sceneLayer, styles.exitAnim]
    .filter(Boolean)
    .join(" ");

  const incomingLayerClasses = [
    styles.sceneLayer,
    isTransitioning && !isTransitionClone ? styles.enterAnim : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={rootClasses}>
      {/* Outgoing scene (page edge peel exit) */}
      {outgoingScene !== null && (
        <div className={outgoingLayerClasses}>
          {renderSceneFor(outgoingScene, BEAT_COUNTS[outgoingScene] - 1, true)}
        </div>
      )}

      {/* Incoming / current scene */}
      <div className={incomingLayerClasses}>
        {renderSceneFor(scene, beat, entered)}
      </div>

      {renderNav()}
    </div>
  );
}

/* ── Metadata ────────────────────────────────────────────────────────────── */

export function getMetadata(lang: "en" | "zh"): StyleMetadata {
  const t = lang === "zh" ? zhMeta : enMeta;
  return {
    id: "47",
    band: "text-report",
    name: t.name,
    theme: t.theme,
    densityLabel: t.densityLabel,
    heroScene: 3,
    colors: {
      bg: "#fafbfc",
      ink: "#1e293b",
      panel: "#ffffff",
    },
    typography: {
      header: "Inter, system-ui, sans-serif",
      body: "Inter, system-ui, sans-serif",
    },
    tags: lang === "zh"
      ? ["白皮书", "分布式系统", "架构", "技术"]
      : ["white-paper", "distributed-systems", "architecture", "technical"],
    fonts: ["Inter", "JetBrains Mono", "cjk:Noto Sans SC"],
    scenes: [
      {
        id: 1,
        title: lang === "zh" ? "封面与摘要" : "Cover & Abstract",
        beats: [
          { id: 0, action: "beat-0", title: lang === "zh" ? "完整封面" : "Full cover page" , body: "" },
        ],
      },
      {
        id: 2,
        title: lang === "zh" ? "系统概述" : "System Overview",
        beats: [
          { id: 0, action: "beat-0", title: lang === "zh" ? "首段" : "First paragraph" , body: "" },
          { id: 1, action: "beat-1", title: lang === "zh" ? "全部段落和术语" : "All paragraphs and terms" , body: "" },
        ],
      },
      {
        id: 3,
        title: lang === "zh" ? "架构图" : "Architecture Diagram",
        beats: [
          { id: 0, action: "beat-0", title: lang === "zh" ? "前三个组件" : "First three components" , body: "" },
          { id: 1, action: "beat-1", title: lang === "zh" ? "前五个组件" : "First five components" , body: "" },
          { id: 2, action: "beat-2", title: lang === "zh" ? "全部组件和连接" : "All components and connections" , body: "" },
        ],
      },
      {
        id: 4,
        title: lang === "zh" ? "性能基准" : "Benchmarks",
        beats: [
          { id: 0, action: "beat-0", title: lang === "zh" ? "前三行" : "First three rows" , body: "" },
          { id: 1, action: "beat-1", title: lang === "zh" ? "前五行" : "First five rows" , body: "" },
          { id: 2, action: "beat-2", title: lang === "zh" ? "全部系统" : "All systems" , body: "" },
        ],
      },
      {
        id: 5,
        title: lang === "zh" ? "结论" : "Conclusion",
        beats: [
          { id: 0, action: "beat-0", title: lang === "zh" ? "首段" : "First paragraph" , body: "" },
          { id: 1, action: "beat-1", title: lang === "zh" ? "全部内容和参考文献" : "All content and references" , body: "" },
        ],
      },
    ],
  };
}

const enMeta = {
  name: "White Paper",
  theme: "Technical white paper with architecture diagrams and benchmarks",
  densityLabel: "Technical",
};

const zhMeta = {
  name: "技术白皮书",
  theme: "含架构图和基准测试的技术白皮书",
  densityLabel: "技术性",
};

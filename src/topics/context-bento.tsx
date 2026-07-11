import { useState, useEffect, useCallback } from "react";
import {
  defineTopic,
  type TopicMetadata,
  type TopicStageProps,
  type TopicTransitionScore,
} from "../domain/topic";
import SpatialSceneTrack from "../styles/SpatialSceneTrack";
import styles from "./context-bento.module.css";

/* ── Transition constants ──────────────────────────────────────────────── */

/* ── Content ─────────────────────────────────────────────────────────────── */

const SCENES = {
  en: {
    scenes: [
      {
        id: "cover",
        label: "Context",
        icon: "📦",
        series: "Context Bento · Project Handoff Spec",
        title: "Auth Token",
        titleEm: "Refresh",
        titleSuffix: "Refactor",
        subtitle:
          "Structured context for v2.14.0 deployment — goals, constraints, risks, and verification in one view",
        authors: "Prepared by: Jordan Lee · Platform Architecture",
        affil: "For: Deployment Review Board · July 6, 2026",
        abstractLabel: "One-line Summary",
        abstract:
          "Resolve race condition in concurrent token refresh by adding distributed lock, token versioning, and client request coalescing. Target: 0 token conflicts under 3x peak load.",
      },
      {
        id: "goals",
        label: "Goals",
        icon: "🎯",
        title: "Goals & Constraints",
        subtitle: "What we're trying to achieve and what limits us",
        paras: [
          "Primary goal: Eliminate the 60% failure rate in concurrent token refresh when 3+ browser tabs are open. Current behavior forces user logout due to token invalidation cascade.",
          "Secondary goal: Reduce p99 refresh latency from 840ms to under 300ms through request coalescing and lock optimization. This directly improves perceived app responsiveness.",
        ],
        terms: [
          "Zero Logouts",
          "<300ms p99",
          "Idempotent",
          "Backward Compatible",
          "No New Infra",
          "Feature Flag",
          "Rollback Ready",
        ],
      },
      {
        id: "risks",
        label: "Risks",
        icon: "⚠️",
        title: "Risk Compartments",
        subtitle: "Identified risks and mitigation strategies",
        nodes: [
          {
            id: "r1",
            label: "Lock Contention",
            sub: "Redis mutex under load",
            icon: "🔒",
            x: 5,
            y: 15,
            w: 20,
            h: 28,
            highlight: false,
          },
          {
            id: "r2",
            label: "Redis Unavailable",
            sub: "Failover path needed",
            icon: "🔴",
            x: 28,
            y: 15,
            w: 20,
            h: 28,
            highlight: true,
          },
          {
            id: "r3",
            label: "Version Skew",
            sub: "Stale token writes",
            icon: "🔢",
            x: 51,
            y: 15,
            w: 20,
            h: 28,
            highlight: false,
          },
          {
            id: "r4",
            label: "Client Memory",
            sub: "Promise leak risk",
            icon: "💧",
            x: 74,
            y: 15,
            w: 20,
            h: 28,
            highlight: false,
          },
        ],
        connections: [
          { from: "r1", to: "r2", label: "triggers" },
          { from: "r3", to: "r1", label: "detected by" },
          { from: "r4", to: "r1", label: "mitigated by" },
        ],
        legend: [
          { label: "Goal", color: "#d4a853" },
          { label: "Constraint", color: "#8b6f4e" },
          { label: "Risk", color: "#b85c38" },
          { label: "Test", color: "#6b8e5a" },
        ],
      },
      {
        id: "tests",
        label: "Tests",
        icon: "🧪",
        title: "Test Coverage Matrix",
        subtitle: "Verification compartments — what's tested and how",
        rows: [
          {
            system: "Concurrent Refresh",
            sub: "10 parallel requests",
            throughput: 10,
            pct: 100,
            latency: "All pass",
            best: true,
          },
          {
            system: "Lock Acquisition",
            sub: "p99 under 50ms",
            throughput: 12,
            pct: 100,
            latency: "12ms p99",
            best: true,
          },
          {
            system: "Redis Failover",
            sub: "Graceful fallback",
            throughput: 8,
            pct: 80,
            latency: "200ms",
            best: false,
          },
          {
            system: "Token Version CAS",
            sub: "Stale write rejected",
            throughput: 15,
            pct: 100,
            latency: "All pass",
            best: true,
          },
          {
            system: "Client Coalescing",
            sub: "1 request per batch",
            throughput: 10,
            pct: 100,
            latency: "1 req/10 tabs",
            best: true,
          },
          {
            system: "Load 3x Peak",
            sub: "0 token conflicts",
            throughput: 6,
            pct: 100,
            latency: "0 conflicts",
            best: true,
          },
        ],
      },
      {
        id: "summary",
        label: "Summary",
        icon: "✅",
        title: "Readiness Summary",
        subtitle: "Overall assessment and next steps",
        paras: [
          "All critical acceptance criteria met. Token refresh race condition resolved with distributed lock, versioning CAS, and client coalescing. Load testing shows 0 conflicts at 3x peak traffic. p99 latency reduced from 840ms to 268ms.",
          "Two items remain at partial status: integration test coverage (82% vs 90% target) and monitoring runbook review. Both are non-blocking for deployment with 48-hour post-deployment remediation commitment.",
        ],
        contribLabel: "Key Decisions",
        contributions: [
          "Redis SETNX lock chosen over DB row lock for O(1) performance",
          "Token versioning over timestamp to avoid clock skew",
          "Client-side coalescing eliminates 90%+ redundant calls",
          "Feature flag auth.refresh.v2 enables instant rollback",
        ],
        refsLabel: "References",
        refs: [
          "[1] ISS-4827: Token refresh race condition — full issue brief",
          "[2] ADR-2026-007: Event-driven architecture decision record",
          "[3] Redis SETNX pattern — distributed lock best practices",
        ],
      },
    ],
  },
  zh: {
    scenes: [
      {
        id: "cover",
        label: "上下文",
        icon: "📦",
        series: "上下文便当盒 · 项目交接规格",
        title: "认证令牌",
        titleEm: "刷新",
        titleSuffix: "重构",
        subtitle:
          "v2.14.0 部署结构化上下文——目标、约束、风险和验证一览",
        authors: "编制人：李乔丹 · 平台架构组",
        affil: "呈交：部署评审委员会 · 2026年7月6日",
        abstractLabel: "一句话摘要",
        abstract:
          "通过添加分布式锁、令牌版本控制和客户端请求合并解决并发令牌刷新中的竞态条件。目标：3 倍峰值负载下 0 令牌冲突。",
      },
      {
        id: "goals",
        label: "目标",
        icon: "🎯",
        title: "目标与约束",
        subtitle: "我们要实现什么以及什么限制了我们",
        paras: [
          "主要目标：消除打开 3 个以上浏览器标签页时并发令牌刷新 60% 的失败率。当前行为因令牌失效级联导致用户登出。",
          "次要目标：通过请求合并和锁优化将 p99 刷新延迟从 840ms 降至 300ms 以下。这直接提升应用感知响应速度。",
        ],
        terms: [
          "零登出",
          "<300ms p99",
          "幂等",
          "向后兼容",
          "无新基础设施",
          "功能开关",
          "回滚就绪",
        ],
      },
      {
        id: "risks",
        label: "风险",
        icon: "⚠️",
        title: "风险隔间",
        subtitle: "已识别风险和缓解策略",
        nodes: [
          {
            id: "r1",
            label: "锁竞争",
            sub: "负载下 Redis 互斥",
            icon: "🔒",
            x: 5,
            y: 15,
            w: 20,
            h: 28,
            highlight: false,
          },
          {
            id: "r2",
            label: "Redis 不可用",
            sub: "需要故障转移路径",
            icon: "🔴",
            x: 28,
            y: 15,
            w: 20,
            h: 28,
            highlight: true,
          },
          {
            id: "r3",
            label: "版本偏差",
            sub: "过期令牌写入",
            icon: "🔢",
            x: 51,
            y: 15,
            w: 20,
            h: 28,
            highlight: false,
          },
          {
            id: "r4",
            label: "客户端内存",
            sub: "Promise 泄漏风险",
            icon: "💧",
            x: 74,
            y: 15,
            w: 20,
            h: 28,
            highlight: false,
          },
        ],
        connections: [
          { from: "r1", to: "r2", label: "触发" },
          { from: "r3", to: "r1", label: "被检测" },
          { from: "r4", to: "r1", label: "被缓解" },
        ],
        legend: [
          { label: "目标", color: "#d4a853" },
          { label: "约束", color: "#8b6f4e" },
          { label: "风险", color: "#b85c38" },
          { label: "测试", color: "#6b8e5a" },
        ],
      },
      {
        id: "tests",
        label: "测试",
        icon: "🧪",
        title: "测试覆盖矩阵",
        subtitle: "验证隔间——测试了什么和如何测试",
        rows: [
          {
            system: "并发刷新",
            sub: "10 个并行请求",
            throughput: 10,
            pct: 100,
            latency: "全部通过",
            best: true,
          },
          {
            system: "锁获取",
            sub: "p99 低于 50ms",
            throughput: 12,
            pct: 100,
            latency: "12ms p99",
            best: true,
          },
          {
            system: "Redis 故障转移",
            sub: "优雅降级",
            throughput: 8,
            pct: 80,
            latency: "200ms",
            best: false,
          },
          {
            system: "令牌版本 CAS",
            sub: "过期写入被拒绝",
            throughput: 15,
            pct: 100,
            latency: "全部通过",
            best: true,
          },
          {
            system: "客户端合并",
            sub: "每批 1 次请求",
            throughput: 10,
            pct: 100,
            latency: "10标签页/1请求",
            best: true,
          },
          {
            system: "3 倍峰值负载",
            sub: "0 令牌冲突",
            throughput: 6,
            pct: 100,
            latency: "0 冲突",
            best: true,
          },
        ],
      },
      {
        id: "summary",
        label: "总结",
        icon: "✅",
        title: "就绪总结",
        subtitle: "总体评估和后续步骤",
        paras: [
          "所有关键验收标准已满足。令牌刷新竞态条件通过分布式锁、版本控制 CAS 和客户端合并解决。负载测试显示 3 倍峰值流量下 0 冲突。p99 延迟从 840ms 降至 268ms。",
          "两项仍为部分状态：集成测试覆盖率（82% vs 90% 目标）和监控运行手册审查。两者均不阻塞部署，承诺部署后 48 小时内整改。",
        ],
        contribLabel: "关键决策",
        contributions: [
          "选择 Redis SETNX 锁而非数据库行锁以获得 O(1) 性能",
          "令牌版本控制优于时间戳以避免时钟偏差",
          "客户端合并消除 90%+ 冗余调用",
          "功能开关 auth.refresh.v2 支持即时回滚",
        ],
        refsLabel: "参考文献",
        refs: [
          "[1] ISS-4827：令牌刷新竞态条件——完整问题简报",
          "[2] ADR-2026-007：事件驱动架构决策记录",
          "[3] Redis SETNX 模式——分布式锁最佳实践",
        ],
      },
    ],
  },
} as const;

/* ── Component ───────────────────────────────────────────────────────────── */

const BEAT_LAYOUT_MODES = {
  2: "motion",
  3: "motion",
  4: "motion",
  5: "motion",
} satisfies Record<number, "motion" | "reserved">;

const TRANSITION_SCORE = {
  "1->2": "wipe",
  "2->3": "wipe",
  "3->4": "wipe",
  "4->5": "wipe",
} as const satisfies TopicTransitionScore;

function TopicStage({
  scene,
  beat,
  language,
  isThumbnail,
  reducedMotion,
  onNavigate,
}: TopicStageProps) {
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const id = "context-bento-fonts";
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
  const renderCover = (sceneNum: number, _beatNum: number, _isEntered: boolean) => {
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
              const isMitigated =
                conn.label === "mitigated by" || conn.label === "被缓解";
              const isDetected =
                conn.label === "detected by" || conn.label === "被检测";
              const stroke = isMitigated
                ? "#d4a853"
                : isDetected
                  ? "#5a8a6a"
                  : "#b85c38";
              return (
                <line
                  key={i}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={stroke}
                  strokeWidth="0.3"
                  strokeDasharray={isDetected ? "1.5,0.8" : "none"}
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
                    <span style={{ color: "var(--context-bento-muted)", fontSize: "0.8em" }}>
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
      <nav
        className={styles.nav}
        data-topic-navigation="true"
        data-navigation-geometry="card-miniature"
        data-navigation-carrier="context-bento-scene-index"
        data-navigation-invocation="persistent"
        data-navigation-feedback="active-glow"
      >
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

  return (
    <div className={rootClasses}>
            <SpatialSceneTrack
        scene={scene}
        beat={beat}
        transitionKind="wipe"
        transitionMap={TRANSITION_SCORE}
        reducedMotion={reducedMotion || isThumbnail}
        beatLayoutModes={BEAT_LAYOUT_MODES}
        renderScene={(sceneId, sceneBeat, isActive) => (
          <div className={styles.sceneLayer}>
            {renderSceneFor(sceneId, sceneBeat, isActive ? entered : true)}
          </div>
        )}
      />

      {renderNav()}
    </div>
  );
}

/* ── Metadata ────────────────────────────────────────────────────────────── */

function getMetadata(lang: "en" | "zh"): TopicMetadata {
  const t = lang === "zh" ? zhMeta : enMeta;
  return {
    theme: t.theme,
    densityLabel: t.densityLabel,
    heroScene: 3,
    colors: {
      bg: "#1a1410",
      ink: "#f5f0eb",
      panel: "#2a221c",
    },
    typography: {
      header: "Georgia 700",
      body: "Inter 400",
    },
    tags: lang === "zh"
      ? ["便当盒", "上下文", "概览", "交接", "深色"]
      : ["bento", "context", "overview", "handoff", "specification", "compartments", "structured", "dark"],
    fonts: ["Georgia", "Inter", "JetBrains Mono", "cjk:Noto Serif SC"],
    scenes: [
      {
        id: 1,
        title: lang === "zh" ? "上下文" : "Context",
        beats: [
          { id: 0, action: "beat-0", title: lang === "zh" ? "完整上下文" : "Full context" , body: "" },
        ],
      },
      {
        id: 2,
        title: lang === "zh" ? "目标与约束" : "Goals & Constraints",
        beats: [
          { id: 0, action: "beat-0", title: lang === "zh" ? "首段" : "First paragraph" , body: "" },
          { id: 1, action: "beat-1", title: lang === "zh" ? "全部段落和条件" : "All paragraphs and constraints" , body: "" },
        ],
      },
      {
        id: 3,
        title: lang === "zh" ? "风险隔间" : "Risk Compartments",
        beats: [
          { id: 0, action: "beat-0", title: lang === "zh" ? "前两个隔间" : "First two compartments" , body: "" },
          { id: 1, action: "beat-1", title: lang === "zh" ? "前四个隔间" : "First four compartments" , body: "" },
          { id: 2, action: "beat-2", title: lang === "zh" ? "全部隔间和连接" : "All compartments and connections" , body: "" },
        ],
      },
      {
        id: 4,
        title: lang === "zh" ? "测试矩阵" : "Test Matrix",
        beats: [
          { id: 0, action: "beat-0", title: lang === "zh" ? "前三行" : "First three rows" , body: "" },
          { id: 1, action: "beat-1", title: lang === "zh" ? "前五行" : "First five rows" , body: "" },
          { id: 2, action: "beat-2", title: lang === "zh" ? "全部测试" : "All tests" , body: "" },
        ],
      },
      {
        id: 5,
        title: lang === "zh" ? "总结" : "Summary",
        beats: [
          { id: 0, action: "beat-0", title: lang === "zh" ? "首段" : "First paragraph" , body: "" },
          { id: 1, action: "beat-1", title: lang === "zh" ? "全部内容和参考" : "All content and references" , body: "" },
        ],
      },
    ],
  };
}

const enMeta = {
  name: "Context Bento Box",
  theme: "Structured context with distinct compartments — goals, constraints, risks, and tests on deep warm lacquer-black ground",
  densityLabel: "Technical",
};

const zhMeta = {
  name: "上下文便当盒",
  theme: "独立隔间的结构化上下文——深暖漆黑色调上的目标、约束、风险和测试",
  densityLabel: "技术性",
};

const METADATA = {
  en: getMetadata("en"),
  zh: getMetadata("zh"),
};

export default defineTopic({
  id: "context-bento",
  styleId: "context-bento-box",
  title: { en: "Context Bento", zh: "上下文盒" },
  modelId: "Doubao-Seed-Evolving",
  Stage: TopicStage,
  metadata: METADATA,
  navigation: {
    geometry: "card-miniature",
    carrier: "context-bento-scene-index",
    invocation: "persistent",
    feedback: "active-glow",
  },
  transitionScore: TRANSITION_SCORE,
  evidence: {
    kind: "illustrative",
    boundary: {
      en: "Illustrative scenario: names, figures, and outcomes are presentation examples, not external factual claims.",
      zh: "示例场景：其中名称、数字和结果均为演示内容，并非外部事实主张。",
    },
    display: "envelope",
  },
});

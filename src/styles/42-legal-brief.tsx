import React, { useLayoutEffect, useEffect, useState, useCallback, useRef } from "react";
import type { BespokeStyleProps, StyleMetadata } from "../types";
import styles from "./42-legal-brief.module.css";

// ─── Content ────────────────────────────────────────────────────────────────

interface SceneContent {
  en: Record<string, any>;
  zh: Record<string, any>;
}

const SCENES: Record<number, SceneContent> = {
  1: {
    en: {
      court: "ARCHITECTURAL DECISION RECORD\nADR-2026-007",
      caseName: "Decision: Adopt Event-Driven\nArchitecture for Order Processing\n\nreplacing\nsynchronous request-response pipeline",
      docket: "Status: Accepted · July 2026",
      dateSubmitted: "Context: Platform scalability initiative",
      dateArgued: "Decision Date: July 3, 2026",
      counselTitle: "Decision Lead:",
      counselName: "Alex Rivera, Staff Engineer",
      counselFirm: "Platform Architecture Team",
      counselAddr: "Reviewers: 8 engineers across 4 teams\nImpact scope: Order service, Payment, Inventory",
    },
    zh: {
      court: "架构决策记录\nADR-2026-007",
      caseName: "决策：订单处理采用事件驱动架构\n\n替代\n同步请求-响应管道",
      docket: "状态：已采纳 · 2026年7月",
      dateSubmitted: "背景：平台可扩展性计划",
      dateArgued: "决策日期：2026年7月3日",
      counselTitle: "决策负责人：",
      counselName: "亚历克斯·里维拉，资深工程师",
      counselFirm: "平台架构组",
      counselAddr: "审阅人：跨4个团队的8名工程师\n影响范围：订单服务、支付、库存",
    },
  },
  2: {
    en: {
      title: "Context",
      paragraphs: [
        {
          num: "1.",
          text: "The current synchronous order processing pipeline handles 12,000 orders/day with p99 latency of 840ms. During peak hours (10am-2pm), latency degrades to 2.4s and we observe a 3.2% timeout rate exceeding our SLO of <1%. The pipeline couples order validation, payment processing, inventory reservation, and notification dispatch into a single blocking call chain.",
        },
        {
          num: "2.",
          text: "Business growth projections indicate a 3x increase in order volume over the next 18 months following the launch of mobile ordering and expansion into three new geographic regions. The current architecture cannot scale horizontally without full database sharding, estimated at 6 months of engineering effort.",
        },
        {
          num: "3.",
          text: "Three prior attempts to optimize the synchronous pipeline (connection pooling, read replicas, query optimization) yielded combined latency improvements of only 12%, insufficient to meet projected demand. Fundamental architectural change is required.",
        },
        {
          num: "4.",
          text: "The platform team evaluated three candidate architectures over a 4-week spike: (a) optimized synchronous with circuit breakers, (b) event-driven with Apache Kafka, (c) hybrid approach with async only for non-critical paths. Each was prototyped against production traffic patterns.",
        },
        {
          num: "5.",
          text: "Stakeholder alignment was achieved through two architecture review boards and a production risk assessment. The security team flagged event schema evolution as requiring governance, and the data team requested idempotency guarantees for downstream analytics.",
        },
      ],
    },
    zh: {
      title: "背景",
      paragraphs: [
        {
          num: "一、",
          text: "当前同步订单处理管道日均处理 12,000 单，p99 延迟 840ms。高峰时段（上午10点-下午2点）延迟降至 2.4s，观察到 3.2% 的超时率，超出我们 <1% 的 SLO。该管道将订单验证、支付处理、库存预留和通知分发耦合为单一阻塞调用链。",
        },
        {
          num: "二、",
          text: "业务增长预测显示，随着移动点餐上线和三个新地区扩张，未来 18 个月订单量将增长 3 倍。当前架构无法水平扩展，除非进行完整的数据库分片，预计需要 6 个月工程投入。",
        },
        {
          num: "三、",
          text: "此前三次优化同步管道的尝试（连接池、读副本、查询优化）合计仅带来 12% 的延迟改善，不足以满足预期需求。需要进行根本性架构变更。",
        },
        {
          num: "四、",
          text: "平台团队在为期 4 周的技术预研中评估了三种候选架构：(a) 带熔断器的优化同步方案，(b) 基于 Apache Kafka 的事件驱动方案，(c) 仅非关键路径异步的混合方案。每种均基于生产流量模式进行了原型验证。",
        },
        {
          num: "五、",
          text: "通过两次架构评审会和一次生产风险评估，达成了利益相关者对齐。安全团队指出事件模式演进需要治理机制，数据团队要求下游分析具备幂等性保证。",
        },
      ],
    },
  },
  3: {
    en: {
      title: "The Decision",
      sectionHeading: "DECISION",
      sectionTitle:
        "Adopt event-driven architecture for all order processing workflows",
      argument:
        "We will migrate the order processing pipeline to an event-driven architecture using Apache Kafka as the event backbone. Each domain (orders, payments, inventory, notifications) will become an independent service emitting and consuming domain events. The initial implementation will use choreography rather than orchestration, with a saga pattern for distributed transaction management across payment and inventory services.",
      argument2:
        "This decision is supported by evidence from the spike: event-driven approach reduced p99 latency by 68% (840ms to 268ms) under simulated 3x load, while improving system availability from 99.7% to 99.95% through decoupled failure domains. The team's existing familiarity with Kafka (used in 3 production pipelines) reduces adoption risk.",
      citations: [
        {
          text: "Spike Report PLT-2026-042: Event-Driven Architecture Prototype Results",
          relevance: "Latency and throughput benchmarks under 3x load simulation",
        },
        {
          text: "Architecture Review Board Minutes, June 14 2026",
          relevance: "Stakeholder alignment and risk assessment",
        },
        {
          text: "AWS Well-Architected Framework — Reliability Pillar",
          relevance: "Decoupled failure domains and horizontal scaling best practices",
        },
      ],
    },
    zh: {
      title: "决策内容",
      sectionHeading: "决策",
      sectionTitle: "所有订单处理工作流采用事件驱动架构",
      argument:
        "我们将把订单处理管道迁移至事件驱动架构，使用 Apache Kafka 作为事件骨干。每个领域（订单、支付、库存、通知）将成为独立服务，发出和消费领域事件。初期实现将使用编排模式而非集中协调，通过 saga 模式管理支付和库存服务之间的分布式事务。",
      argument2:
        "这一决策得到技术预研证据的支持：在模拟 3 倍负载下，事件驱动方案将 p99 延迟降低 68%（从 840ms 降至 268ms），同时通过解耦故障域将系统可用性从 99.7% 提升至 99.95%。团队对 Kafka 的现有使用经验（已用于 3 条生产管道）降低了采用风险。",
      citations: [
        {
          text: "预研报告 PLT-2026-042：事件驱动架构原型测试结果",
          relevance: "3 倍负载模拟下的延迟和吞吐量基准",
        },
        {
          text: "架构评审会议纪要，2026年6月14日",
          relevance: "利益相关者对齐与风险评估",
        },
        {
          text: "AWS 架构完善框架——可靠性支柱",
          relevance: "解耦故障域和水平扩展最佳实践",
        },
      ],
    },
  },
  4: {
    en: {
      title: "Trade-offs Evaluated",
      wherefore: "Alternatives considered and reasons for rejection:",
      remedies: [
        "Optimized Synchronous Pipeline — Rejected: Only 12% latency improvement, does not address the fundamental coupling that prevents independent scaling of domain services. Estimated 4 months of work for insufficient gain.",
        "Hybrid Approach (async non-critical only) — Rejected: Maintains the core coupling problem, creates two architectural paradigms to maintain, and only partially solves the scalability constraint. Complexity without proportional benefit.",
        "Event-Driven with Orchestration (Zeebe/Camunda) — Deferred: While orchestration provides better observability for complex workflows, it introduces a new infrastructure dependency and a single point of failure. We will revisit this if choreography proves insufficient for 5+ service sagas.",
        "Full Microservices Refactor — Rejected: Scope too large for the immediate problem. Event-driven migration provides 80% of the benefit at 30% of the cost, with a clear path to full microservices if needed.",
      ],
    },
    zh: {
      title: "权衡分析",
      wherefore: "已考虑的替代方案及拒绝理由：",
      remedies: [
        "优化同步管道——拒绝：仅 12% 延迟改善，未解决阻碍领域服务独立扩展的根本性耦合问题。预计 4 个月工作量，收益不足。",
        "混合方案（仅非关键路径异步）——拒绝：维持了核心耦合问题，需要维护两套架构范式，且仅部分解决可扩展性约束。复杂度与收益不成比例。",
        "带编排的事件驱动（Zeebe/Camunda）——暂缓：虽然编排为复杂工作流提供更好的可观测性，但引入了新的基础设施依赖和单点故障。如果编排模式在 5+ 服务 saga 中证明不足，我们将重新评估。",
        "完整微服务重构——拒绝：对当前问题范围过大。事件驱动迁移以 30% 的成本提供 80% 的收益，且如有需要有通往完整微服务的清晰路径。",
      ],
    },
  },
  5: {
    en: {
      title: "Verification & Status",
      closing:
        "The decision will be validated through a phased rollout: Phase 1 (Weeks 1-4) — Shadow mode deployment with dual-write to validate event schema correctness. Phase 2 (Weeks 5-8) — 10% traffic cutover with automated rollback on error rate >0.5%. Phase 3 (Weeks 9-12) — Full traffic cutover with 2-week observation period. Success criteria: p99 latency <300ms, availability >99.9%, zero data consistency incidents.",
      dateLine: "Last Updated: July 6, 2026",
      respectSubmitted: "Status:",
      sigName: "ACCEPTED — Implementation in progress",
      sigBar: "Phase 1 target: Complete by Aug 1, 2026",
      sigFirm: "Owner: Alex Rivera, Staff Engineer",
      sigAddr: "Next review: Architecture Board, Aug 15 2026",
      sigContact: "Escalation: VP Engineering within 24h on SLO breach",
    },
    zh: {
      title: "验证与状态",
      closing:
        "该决策将通过分阶段上线进行验证：第一阶段（第1-4周）——影子模式部署，双写验证事件模式正确性。第二阶段（第5-8周）——10%流量切换，错误率 >0.5% 时自动回滚。第三阶段（第9-12周）——全量切换，为期 2 周观察期。成功标准：p99 延迟 <300ms，可用性 >99.9%，零数据一致性事故。",
      dateLine: "最后更新：2026年7月6日",
      respectSubmitted: "状态：",
      sigName: "已采纳——实施进行中",
      sigBar: "第一阶段目标：2026年8月1日前完成",
      sigFirm: "负责人：亚历克斯·里维拉，资深工程师",
      sigAddr: "下次评审：架构委员会，2026年8月15日",
      sigContact: "升级路径：SLO 违规时 24 小时内上报工程副总裁",
    },
  },
};

// ─── Metadata ───────────────────────────────────────────────────────────────

export function getMetadata(lang: "en" | "zh"): StyleMetadata {
  const nameMap = { en: "Decision Record", zh: "决策记录" };
  const themeMap = {
    en: "Technical decisions, trade-offs, and architectural boundaries — structured reasoning blocks with procedural formality",
    zh: "技术决策、权衡分析与架构边界——结构化推理块，程序化工整风格",
  };
  const densityLabelMap = { en: "Document-Dense", zh: "文档密集" };

  const sceneTitles = {
    en: ["Header", "Context", "Decision", "Trade-offs", "Verification"],
    zh: ["标题", "背景", "决策", "权衡", "验证"],
  };

  const beatActions = {
    en: {
      1: ["Decision record header"],
      2: ["Context paragraphs 1-3", "Context paragraphs 4-5"],
      3: ["Decision statement", "Supporting citations", "Full reasoning"],
      4: ["Alternatives 1-2 evaluated", "Alternatives 3-4 evaluated"],
      5: ["Verification plan and status"],
    },
    zh: {
      1: ["决策记录标题"],
      2: ["背景第 1-3 段", "背景第 4-5 段"],
      3: ["决策声明", "支撑引用", "完整推理"],
      4: ["替代方案 1-2 评估", "替代方案 3-4 评估"],
      5: ["验证计划与状态"],
    },
  };

  const BEAT_COUNTS: Record<number, number> = {
    1: 1,
    2: 2,
    3: 3,
    4: 2,
    5: 1,
  };

  const scenes = [1, 2, 3, 4, 5].map((id) => {
    const beatCount = BEAT_COUNTS[id];
    const actions = beatActions[lang][id as keyof (typeof beatActions)["en"]];
    const c = SCENES[id][lang];

    const beats = Array.from({ length: beatCount }, (_, beatIdx) => {
      let beatTitle = "";
      let beatBody = "";

      if (id === 1) {
        beatTitle = c.caseName ? (c.caseName as string).split("\n")[0] : "";
        beatBody = c.docket as string;
      } else if (id === 2) {
        beatTitle = c.title as string;
        const paras = c.paragraphs as Array<{ num: string; text: string }>;
        const visible = paras.slice(0, (beatIdx + 1) * 3);
        beatBody = visible.map((p) => p.num + p.text.slice(0, 60)).join(" / ");
      } else if (id === 3) {
        beatTitle = (c.sectionTitle as string) || (c.title as string);
        if (beatIdx === 0) beatBody = (c.argument as string).slice(0, 100);
        else if (beatIdx === 1) {
          const cites = c.citations as Array<{ text: string }>;
          beatBody = cites.map((c) => c.text).join(" / ");
        } else beatBody = (c.argument2 as string).slice(0, 100);
      } else if (id === 4) {
        beatTitle = c.title as string;
        const remedies = c.remedies as string[];
        const start = beatIdx * 3;
        beatBody = remedies.slice(start, start + 3).join(" / ");
      } else if (id === 5) {
        beatTitle = c.title as string;
        beatBody = (c.closing as string).slice(0, 120);
      }

      return { id: beatIdx, action: actions[beatIdx], title: beatTitle, body: beatBody };
    });

    return { id, title: sceneTitles[lang][id - 1], beats };
  });

  return {
    id: "42",
    band: "text-report",
    name: nameMap[lang],
    theme: themeMap[lang],
    densityLabel: densityLabelMap[lang],
    heroScene: 3,
    colors: { bg: "#f4f6f8", ink: "#1a1a2e", panel: "#e8ecf0" },
    typography: { header: "Inter 700", body: "Inter 400" },
    tags: ["decision", "record", "technical", "trade-offs", "architectural", "procedural", "documentation"],
    fonts: ["Inter"],
    scenes,
  };
}

// ─── Transition constants ─────────────────────────────────────────────────

const TRANSITION_DURATION = 350; // ms — 250ms rule draw + 100ms outgoing fade
const BEAT_COUNTS: Record<number, number> = { 1: 1, 2: 2, 3: 3, 4: 2, 5: 1 };

// ─── Component ──────────────────────────────────────────────────────────────

export default function LegalBrief({
  scene,
  beat,
  language,
  isThumbnail,
  reducedMotion,
  onNavigate,
  isTransitionClone,
}: BespokeStyleProps) {
  const [entered, setEntered] = useState(false);

  const transitionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [transitionInfo, setTransitionInfo] = useState({
    outgoingScene: null as number | null,
    isTransitioning: false,
    showDivider: false,
    lastScene: scene,
  });

  // Synchronous derivation — sets transition state in the SAME render cycle
  // as the scene prop change. Eliminates the 1-frame gap where the incoming
  // scene is visible without its enter animation class.
  if (transitionInfo.lastScene !== scene) {
    if (transitionTimerRef.current) {
      clearTimeout(transitionTimerRef.current);
    }

    if (!reducedMotion) {
      transitionTimerRef.current = setTimeout(() => {
        setTransitionInfo(function(prev) {
          return {
            outgoingScene: null,
            isTransitioning: false,
            showDivider: false,
            lastScene: prev.lastScene,
          };
        });
      }, TRANSITION_DURATION);

      setTransitionInfo({
        outgoingScene: transitionInfo.lastScene,
        isTransitioning: true,
        showDivider: true,
        lastScene: scene,
      });
    } else {
      setTransitionInfo({
        outgoingScene: null,
        isTransitioning: false,
        showDivider: false,
        lastScene: scene,
      });
    }
  }

  var outgoingScene = transitionInfo.outgoingScene;
  var isTransitioning = transitionInfo.isTransitioning;
  var showDivider = transitionInfo.showDivider;

  useLayoutEffect(() => {
    const inject = (id: string, href: string) => {
      if (document.getElementById(id)) return;
      const link = document.createElement("link");
      link.id = id;
      link.rel = "stylesheet";
      link.href = href;
      document.head.appendChild(link);
    };
    inject(
      "style-42-fonts-source-serif",
      "https://fonts.googleapis.com/css2?family=Source+Serif+Pro:wght@400;600;700&display=swap",
    );
    inject(
      "style-42-fonts-noto-serif-sc",
      "https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;600;700&display=swap",
    );
  }, []);

  // Beat-level entered animation (for incoming scene reveals)
  useEffect(() => {
    setEntered(false);
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => setEntered(true));
    });
    return () => cancelAnimationFrame(id);
  }, [scene]);

  const handleNavClick = useCallback(
    (e: React.MouseEvent, targetScene: number) => {
      e.stopPropagation();
      onNavigate?.(targetScene, 0);
    },
    [onNavigate],
  );

  const rootClasses = [
    styles.root,
    reducedMotion ? styles.reducedMotion : "",
  ]
    .filter(Boolean)
    .join(" ");

  // ── Scene 1: Caption ───────────────────────────────────────────────────

  const renderScene1 = (isEntered: boolean) => {
    const c = SCENES[1][language];
    return (
      <div className={styles.caption}>
        <div
          className={styles.captionCourt}
          style={{
            opacity: isEntered ? 1 : 0,
            transition: reducedMotion ? "none" : "opacity 0.6s ease 0.2s",
          }}
        >
          {(c.court as string).split("\n").map((line, i) => (
            <div key={i} className={i === 1 ? styles.captionCourtSub : ""}>
              {line}
            </div>
          ))}
        </div>
        <div className={styles.captionRule} />
        <div
          className={styles.captionCase}
          style={{
            opacity: isEntered ? 1 : 0,
            transition: reducedMotion ? "none" : "opacity 0.8s ease 0.5s",
          }}
        >
          {(c.caseName as string).split("\n").map((line, i) => (
            <div
              key={i}
              className={[
                line === "v." || line === "诉"
                  ? styles.captionVersus
                  : line.includes("Plaintiff") || line.includes("原告")
                    ? styles.captionParty
                    : line.includes("Defendant") || line.includes("被告")
                      ? styles.captionParty
                      : styles.captionPartyName,
              ].join(" ")}
            >
              {line}
            </div>
          ))}
        </div>
        <div className={styles.captionRule} />
        <div
          className={styles.captionMeta}
          style={{
            opacity: isEntered ? 1 : 0,
            transition: reducedMotion ? "none" : "opacity 0.6s ease 0.9s",
          }}
        >
          <span className={styles.captionDocket}>{c.docket}</span>
          <div className={styles.captionDates}>
            <span>{c.dateSubmitted}</span>
            <span>{c.dateArgued}</span>
          </div>
        </div>
        <div
          className={styles.captionCounsel}
          style={{
            opacity: isEntered ? 1 : 0,
            transition: reducedMotion ? "none" : "opacity 0.6s ease 1.2s",
          }}
        >
          <p className={styles.captionCounselTitle}>{c.counselTitle}</p>
          <p className={styles.captionCounselName}>{c.counselName}</p>
          <p className={styles.captionCounselFirm}>{c.counselFirm}</p>
          <p className={styles.captionCounselAddr}>
            {(c.counselAddr as string).split("\n").map((line, i) => (
              <span key={i}>
                {line}
                {i < (c.counselAddr as string).split("\n").length - 1 && <br />}
              </span>
            ))}
          </p>
        </div>
      </div>
    );
  };

  // ── Scene 2: Statement of Facts ───────────────────────────────────────

  const renderScene2 = (beatNum: number, isEntered: boolean) => {
    const c = SCENES[2][language];
    const paragraphs = c.paragraphs as Array<{ num: string; text: string }>;
    const visibleCount = beatNum === 0 ? 3 : 5;
    const visible = paragraphs.slice(0, visibleCount);

    return (
      <div className={styles.facts}>
        <div className={styles.factsHeader}>
          <h2 className={styles.factsTitle}>{c.title}</h2>
          <div className={styles.factsRule} />
        </div>
        <div className={styles.factsBody}>
          {visible.map((para, i) => (
            <div
              key={i}
              className={styles.factPara}
              style={{
                opacity: isEntered ? 1 : 0,
                transform: isEntered ? "none" : "translateX(-1cqw)",
                transition: reducedMotion
                  ? "none"
                  : `opacity 0.5s ease ${i * 0.1}s, transform 0.5s ease ${i * 0.1}s`,
              }}
            >
              <span className={styles.factNum}>{para.num}</span>
              <p className={styles.factText}>{para.text}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // ── Scene 3: Legal Argument ───────────────────────────────────────────

  const renderScene3 = (beatNum: number, isEntered: boolean) => {
    const c = SCENES[3][language];
    const citations = c.citations as Array<{ text: string; relevance: string }>;
    return (
      <div className={styles.argument}>
        <div className={styles.argHeader}>
          <h2 className={styles.argTitle}>{c.title}</h2>
          <div className={styles.argRule} />
        </div>
        <div className={styles.argSection}>
          <span className={styles.argSectionNum}>{c.sectionHeading}</span>
          <h3 className={styles.argSectionTitle}>{c.sectionTitle}</h3>
        </div>
        {beatNum >= 0 && (
          <p
            className={styles.argText}
            style={{
              opacity: isEntered ? 1 : 0,
              transition: reducedMotion ? "none" : "opacity 0.6s ease 0.2s",
            }}
          >
            {c.argument}
          </p>
        )}
        {beatNum >= 1 && (
          <div className={styles.argCitations}>
            <p className={styles.argCitationsLabel}>
              {language === "zh" ? "引用判例：" : "Authorities Cited:"}
            </p>
            {citations.map((cite, i) => (
              <div
                key={i}
                className={styles.argCite}
                style={{
                  opacity: isEntered ? 1 : 0,
                  transition: reducedMotion
                    ? "none"
                    : `opacity 0.4s ease ${0.4 + i * 0.12}s`,
                }}
              >
                <span className={styles.argCiteText}>{cite.text}</span>
                <span className={styles.argCiteRel}>— {cite.relevance}</span>
              </div>
            ))}
          </div>
        )}
        {beatNum >= 2 && (
          <p
            className={styles.argText}
            style={{
              opacity: isEntered ? 1 : 0,
              transition: reducedMotion ? "none" : "opacity 0.6s ease 0.8s",
            }}
          >
            {c.argument2}
          </p>
        )}
      </div>
    );
  };

  // ── Scene 4: Prayer for Relief ────────────────────────────────────────

  const renderScene4 = (beatNum: number, isEntered: boolean) => {
    const c = SCENES[4][language];
    const remedies = c.remedies as string[];
    const visibleCount = beatNum === 0 ? 3 : 5;
    const visible = remedies.slice(0, visibleCount);

    return (
      <div className={styles.relief}>
        <div className={styles.reliefHeader}>
          <h2 className={styles.reliefTitle}>{c.title}</h2>
          <div className={styles.reliefRule} />
        </div>
        <p
          className={styles.reliefWherefore}
          style={{
            opacity: isEntered ? 1 : 0,
            transition: reducedMotion ? "none" : "opacity 0.5s ease 0.2s",
          }}
        >
          {c.wherefore}
        </p>
        <ol className={styles.reliefList}>
          {visible.map((remedy, i) => (
            <li
              key={i}
              className={styles.reliefItem}
              style={{
                opacity: isEntered ? 1 : 0,
                transform: isEntered ? "none" : "translateX(-1cqw)",
                transition: reducedMotion
                  ? "none"
                  : `opacity 0.5s ease ${0.3 + i * 0.12}s, transform 0.5s ease ${0.3 + i * 0.12}s`,
              }}
            >
              {remedy}
            </li>
          ))}
        </ol>
      </div>
    );
  };

  // ── Scene 5: Conclusion ───────────────────────────────────────────────

  const renderScene5 = (isEntered: boolean) => {
    const c = SCENES[5][language];
    return (
      <div className={styles.conclusion}>
        <div className={styles.concHeader}>
          <h2 className={styles.concTitle}>{c.title}</h2>
          <div className={styles.concRule} />
        </div>
        <p
          className={styles.concText}
          style={{
            opacity: isEntered ? 1 : 0,
            transition: reducedMotion ? "none" : "opacity 0.6s ease 0.2s",
          }}
        >
          {c.closing}
        </p>
        <p
          className={styles.concDate}
          style={{
            opacity: isEntered ? 1 : 0,
            transition: reducedMotion ? "none" : "opacity 0.5s ease 0.6s",
          }}
        >
          {c.dateLine}
        </p>
        <div
          className={styles.concSigBlock}
          style={{
            opacity: isEntered ? 1 : 0,
            transition: reducedMotion ? "none" : "opacity 0.6s ease 0.9s",
          }}
        >
          <p className={styles.concSigRespect}>{c.respectSubmitted}</p>
          <p className={styles.concSigName}>{c.sigName}</p>
          <p className={styles.concSigBar}>{c.sigBar}</p>
          <p className={styles.concSigFirm}>{c.sigFirm}</p>
          <p className={styles.concSigAddr}>
            {(c.sigAddr as string).split("\n").map((line, i) => (
              <span key={i}>
                {line}
                {i < (c.sigAddr as string).split("\n").length - 1 && <br />}
              </span>
            ))}
          </p>
          <p className={styles.concSigContact}>
            {(c.sigContact as string).split("\n").map((line, i) => (
              <span key={i}>
                {line}
                {i < (c.sigContact as string).split("\n").length - 1 && <br />}
              </span>
            ))}
          </p>
        </div>
      </div>
    );
  };

  // ── Render scene content for a given scene number ────────────────────────

  const renderSceneFor = (
    sceneNum: number,
    beatNum: number,
    isEntered: boolean,
  ) => {
    switch (sceneNum) {
      case 1:
        return renderScene1(isEntered);
      case 2:
        return renderScene2(beatNum, isEntered);
      case 3:
        return renderScene3(beatNum, isEntered);
      case 4:
        return renderScene4(beatNum, isEntered);
      case 5:
        return renderScene5(isEntered);
      default:
        return null;
    }
  };

  // ── Navigation (Section Numbers) ──────────────────────────────────────

  const renderNav = () => {
    if (isThumbnail) return null;
    const sectionLabels = {
      en: ["Header", "Context", "Decision", "Trade-offs", "Verification"],
      zh: ["标题", "背景", "决策", "权衡", "验证"],
    };
    const romanNumerals = ["I", "II", "III", "IV", "V"];
    return (
      <nav className={styles.nav} aria-label="Section navigation">
        <div className={styles.navItems}>
          {[1, 2, 3, 4, 5].map((s) => {
            const isActive = s === scene;
            return (
              <button
                key={s}
                type="button"
                className={[
                  styles.navItem,
                  isActive ? styles.navItemActive : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                onClick={(e) => handleNavClick(e, s)}
                aria-label={`Jump to scene ${s}`}
                style={reducedMotion ? { transitionDuration: "0s" } : undefined}
              >
                <span className={styles.navRoman}>{romanNumerals[s - 1]}</span>
                <span className={styles.navLabel}>
                  {sectionLabels[language][s - 1]}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    );
  };

  // ── Build layer classes ─────────────────────────────────────────────────

  const outgoingLayerClasses = [
    styles.sceneLayer,
    styles.exitAnim,
  ].filter(Boolean).join(" ");

  const incomingLayerClasses = [
    styles.sceneLayer,
    isTransitioning && !isTransitionClone ? styles.enterAnim : "",
  ].filter(Boolean).join(" ");

  return (
    <div data-testid="style-42-root" className={rootClasses}>
      {/* Outgoing scene (section divider exit: above-rule clip + fade) */}
      {outgoingScene !== null && (
        <div className={outgoingLayerClasses}>
          {renderSceneFor(outgoingScene, BEAT_COUNTS[outgoingScene] - 1, true)}
        </div>
      )}

      {/* Incoming / current scene (section divider enter) */}
      <div className={incomingLayerClasses}>
        {renderSceneFor(scene, beat, entered)}
      </div>

      {/* Section divider rule */}
      {showDivider && !reducedMotion && (
        <div className={styles.dividerRule} />
      )}

      {renderNav()}
    </div>
  );
}

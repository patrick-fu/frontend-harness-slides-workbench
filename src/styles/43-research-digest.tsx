import React, { useLayoutEffect, useEffect, useState, useCallback, useRef } from "react";
import type { BespokeStyleProps, StyleMetadata } from "../types";
import styles from "./43-research-digest.module.css";

const TRANSITION_DURATION = 500;

// ─── Content ────────────────────────────────────────────────────────────────

interface SceneContent {
  en: Record<string, any>;
  zh: Record<string, any>;
}

const SCENES: Record<number, SceneContent> = {
  1: {
    en: {
      digestTitle: "Maintainer Issue Brief",
      subtitle: "Fix: Auth Token Refresh Race Condition Causes Intermittent 401",
      edition: "ISS-4827 · Priority: High",
      scope: "platform/auth-service · Type: Bug · Component: token-refresh",
      compiledBy: "Assignee: Jordan Lee · Reported by: QA Automation",
      topics: ["bug", "auth", "race-condition", "high-priority", "needs-review"],
    },
    zh: {
      digestTitle: "维护者问题简报",
      subtitle: "修复：认证令牌刷新竞态条件导致间歇性 401 错误",
      edition: "ISS-4827 · 优先级：高",
      scope: "platform/auth-service · 类型：缺陷 · 组件：token-refresh",
      compiledBy: "负责人：李乔丹 · 报告方：QA 自动化",
      topics: ["缺陷", "认证", "竞态条件", "高优先级", "待评审"],
    },
  },
  2: {
    en: {
      title: "Problem Description",
      paper: {
        title:
          "Concurrent token refresh requests from multiple browser tabs cause invalid token cascade",
        authors: "Reported by: QA Automation Suite",
        affiliation: "End-to-end test regression — Auth flow E2E-034",
        venue: "Affected Component: auth-service v2.14.3",
        track: "Severity: High — blocks 3 downstream services",
        citations: 12,
        tags: ["race-condition", "token-refresh", "concurrent-requests", "401-error"],
        abstract:
          "When a user has multiple browser tabs open and the auth token expires, each tab independently detects the 401 and triggers a refresh request. The refresh endpoint issues a new token and invalidates the previous one. Tab A's refresh succeeds, but Tab B's in-flight refresh arrives after the token rotation, causing the refresh handler to reject with 'token_not_found'. This cascades into a full logout for the user session. Reproduction: open 3+ tabs, wait for token expiry (15min TTL), observe 60% failure rate on at least one tab. Expected: first refresh succeeds, subsequent refresh requests return the same new token idempotently. Actual: only the first refresh succeeds, others trigger logout.",
        pages: "Est. effort: 2-3 days",
        references: 7,
      },
    },
    zh: {
      title: "问题描述",
      paper: {
        title: "多个浏览器标签页的并发令牌刷新请求导致无效令牌级联",
        authors: "报告方：QA 自动化测试套件",
        affiliation: "端到端测试回归——认证流程 E2E-034",
        venue: "受影响组件：auth-service v2.14.3",
        track: "严重程度：高——阻塞 3 个下游服务",
        citations: 12,
        tags: ["竞态条件", "令牌刷新", "并发请求", "401错误"],
        abstract:
          "当用户打开多个浏览器标签页且认证令牌过期时，每个标签页独立检测到 401 并触发刷新请求。刷新端点颁发新令牌并使前一个令牌失效。标签页 A 的刷新成功，但标签页 B 的在途刷新在令牌轮换后到达，导致刷新处理器以 'token_not_found' 拒绝。这级联为用户会话的完全登出。复现步骤：打开 3 个以上标签页，等待令牌过期（15 分钟 TTL），观察至少一个标签页 60% 的失败率。预期：第一次刷新成功，后续刷新请求幂等地返回相同的新令牌。实际：只有第一次刷新成功，其余触发登出。",
        pages: "预计工作量：2-3 天",
        references: 7,
      },
    },
  },
  3: {
    en: {
      title: "Proposed Solution",
      subtitle: "Idempotent refresh with request deduplication and token versioning",
      papers: [
        {
          id: 1,
          short: "refresh.ts",
          title: "Add distributed lock on refresh endpoint",
          year: 2026,
          citations: 45,
          cluster: "Core",
          x: 30,
          y: 35,
        },
        {
          id: 2,
          short: "tokenStore.ts",
          title: "Token versioning with atomic compare-and-swap",
          year: 2026,
          citations: 38,
          cluster: "Core",
          x: 55,
          y: 28,
        },
        {
          id: 3,
          short: "redis.lock",
          title: "SETNX-based refresh mutex (5s TTL)",
          year: 2026,
          citations: 22,
          cluster: "Infra",
          x: 25,
          y: 58,
        },
        {
          id: 4,
          short: "client.ts",
          title: "Client-side request coalescing per tab",
          year: 2026,
          citations: 31,
          cluster: "Client",
          x: 70,
          y: 45,
        },
        {
          id: 5,
          short: "tests/",
          title: "Concurrent refresh integration test suite",
          year: 2026,
          citations: 18,
          cluster: "Tests",
          x: 48,
          y: 65,
        },
        {
          id: 6,
          short: "docs/",
          title: "Refresh protocol specification update",
          year: 2026,
          citations: 8,
          cluster: "Docs",
          x: 78,
          y: 62,
        },
      ],
      connections: [
        [1, 2],
        [1, 3],
        [2, 3],
        [4, 1],
        [5, 1],
        [5, 2],
        [6, 1],
        [6, 2],
      ],
    },
    zh: {
      title: "提议方案",
      subtitle: "基于请求去重和令牌版本控制的幂等刷新",
      papers: [
        {
          id: 1,
          short: "refresh.ts",
          title: "在刷新端点添加分布式锁",
          year: 2026,
          citations: 45,
          cluster: "核心",
          x: 30,
          y: 35,
        },
        {
          id: 2,
          short: "tokenStore.ts",
          title: "基于原子比较交换的令牌版本控制",
          year: 2026,
          citations: 38,
          cluster: "核心",
          x: 55,
          y: 28,
        },
        {
          id: 3,
          short: "redis.lock",
          title: "基于 SETNX 的刷新互斥锁（5 秒 TTL）",
          year: 2026,
          citations: 22,
          cluster: "基础设施",
          x: 25,
          y: 58,
        },
        {
          id: 4,
          short: "client.ts",
          title: "客户端按标签页合并请求",
          year: 2026,
          citations: 31,
          cluster: "客户端",
          x: 70,
          y: 45,
        },
        {
          id: 5,
          short: "tests/",
          title: "并发刷新集成测试套件",
          year: 2026,
          citations: 18,
          cluster: "测试",
          x: 48,
          y: 65,
        },
        {
          id: 6,
          short: "docs/",
          title: "刷新协议规范更新",
          year: 2026,
          citations: 8,
          cluster: "文档",
          x: 78,
          y: 62,
        },
      ],
      connections: [
        [1, 2],
        [1, 3],
        [2, 3],
        [4, 1],
        [5, 1],
        [5, 2],
        [6, 1],
        [6, 2],
      ],
    },
  },
  4: {
    en: {
      title: "Impact Analysis",
      subtitle: "Risk assessment across affected systems",
      keywords: [
        { term: "Auth Service", count: 23, size: "xl" },
        { term: "API Gateway", count: 19, size: "xl" },
        { term: "User Sessions", count: 15, size: "lg" },
        { term: "Downstream APIs", count: 12, size: "lg" },
        { term: "Mobile Clients", count: 11, size: "lg" },
        { term: "Web Dashboard", count: 9, size: "md" },
        { term: "Admin Panel", count: 8, size: "md" },
        { term: "Analytics", count: 7, size: "md" },
        { term: "Billing", count: 6, size: "sm" },
        { term: "Notifications", count: 6, size: "sm" },
        { term: "Search Index", count: 5, size: "sm" },
        { term: "CDN Cache", count: 4, size: "sm" },
        { term: "Audit Log", count: 3, size: "xs" },
        { term: "Rate Limiter", count: 2, size: "xs" },
      ],
    },
    zh: {
      title: "影响分析",
      subtitle: "跨受影响系统的风险评估",
      keywords: [
        { term: "认证服务", count: 23, size: "xl" },
        { term: "API 网关", count: 19, size: "xl" },
        { term: "用户会话", count: 15, size: "lg" },
        { term: "下游 API", count: 12, size: "lg" },
        { term: "移动客户端", count: 11, size: "lg" },
        { term: "Web 仪表板", count: 9, size: "md" },
        { term: "管理面板", count: 8, size: "md" },
        { term: "数据分析", count: 7, size: "md" },
        { term: "计费", count: 6, size: "sm" },
        { term: "通知", count: 6, size: "sm" },
        { term: "搜索索引", count: 5, size: "sm" },
        { term: "CDN 缓存", count: 4, size: "sm" },
        { term: "审计日志", count: 3, size: "xs" },
        { term: "限流器", count: 2, size: "xs" },
      ],
    },
  },
  5: {
    en: {
      title: "Action Items & Status",
      subtitle: "Implementation checklist and timeline",
      stats: [
        { label: "Status", value: "In Progress", sub: "PR #4831 opened" },
        { label: "Tests Passing", value: "18/22", sub: "4 integration tests pending" },
        { label: "Code Review", value: "2/3", sub: "1 reviewer pending" },
        { label: "Affected Files", value: "8", sub: "across 3 packages" },
        { label: "Target Merge", value: "Jul 10", sub: "before sprint close" },
        {
          label: "Rollback Plan",
          value: "Ready",
          sub: "feature flag: auth.refresh.v2",
        },
      ],
    },
    zh: {
      title: "行动项与状态",
      subtitle: "实施清单和时间线",
      stats: [
        { label: "状态", value: "进行中", sub: "PR #4831 已创建" },
        { label: "测试通过", value: "18/22", sub: "4 个集成测试待完成" },
        { label: "代码评审", value: "2/3", sub: "1 名评审人待确认" },
        { label: "受影响文件", value: "8", sub: "跨 3 个包" },
        { label: "目标合并", value: "7月10日", sub: "冲刺结束前" },
        { label: "回滚方案", value: "就绪", sub: "功能开关: auth.refresh.v2" },
      ],
    },
  },
};

// ─── Metadata ───────────────────────────────────────────────────────────────

export function getMetadata(lang: "en" | "zh"): StyleMetadata {
  const nameMap = { en: "Maintainer Issue Brief", zh: "维护者问题简报" };
  const themeMap = {
    en: "Engineering task handoff — developer ticket sensibility with status colors, sharp headings, and action-oriented structure",
    zh: "工程任务交接——开发者工单风格，状态色彩、清晰标题、行动导向结构",
  };
  const densityLabelMap = { en: "Reading-First", zh: "阅读优先" };

  const sceneTitles = {
    en: ["Issue", "Problem", "Solution", "Impact", "Checklist"],
    zh: ["工单", "问题", "方案", "影响", "清单"],
  };

  const beatActions = {
    en: {
      1: ["Issue header revealed"],
      2: ["Problem metadata appears", "Full description revealed"],
      3: ["Solution components appear", "Dependencies drawn", "Labels and details"],
      4: ["Impact areas form", "Risk levels differentiated"],
      5: ["Checklist status panel"],
    },
    zh: {
      1: ["问题标题呈现"],
      2: ["问题元数据出现", "完整描述揭示"],
      3: ["方案组件出现", "依赖关系绘制", "标签和详情"],
      4: ["影响区域形成", "风险等级区分"],
      5: ["清单状态面板"],
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
        beatTitle = c.digestTitle as string;
        beatBody = c.subtitle as string;
      } else if (id === 2) {
        const paper = c.paper as Record<string, any>;
        beatTitle = paper.title as string;
        beatBody =
          beatIdx >= 1
            ? ((paper.abstract as string) || "").slice(0, 120) + "..."
            : `${paper.venue} · ${paper.citations} citations`;
      } else if (id === 3) {
        beatTitle = c.title as string;
        beatBody = c.subtitle as string;
      } else if (id === 4) {
        beatTitle = c.title as string;
        const kws = c.keywords as Array<{ term: string; count: number }>;
        beatBody = kws
          .slice(0, (beatIdx + 1) * 5)
          .map((k) => `${k.term}(${k.count})`)
          .join(" / ");
      } else if (id === 5) {
        beatTitle = c.title as string;
        const sts = c.stats as Array<{ label: string; value: string }>;
        beatBody = sts.map((s) => `${s.label}: ${s.value}`).join(" / ");
      }

      return { id: beatIdx, action: actions[beatIdx], title: beatTitle, body: beatBody };
    });

    return { id, title: sceneTitles[lang][id - 1], beats };
  });

  return {
    id: "43",
    band: "text-report",
    name: nameMap[lang],
    theme: themeMap[lang],
    densityLabel: densityLabelMap[lang],
    heroScene: 3,
    colors: { bg: "#f6f8fa", ink: "#24292f", panel: "#eef1f4" },
    typography: { header: "Inter 700", body: "JetBrains Mono 400" },
    tags: [
      "issue",
      "brief",
      "maintainer",
      "developer",
      "ticket",
      "technical",
      "action-items",
      "handoff",
    ],
    fonts: ["Inter", "JetBrains Mono"],
    scenes,
  };
}

// ─── Component ──────────────────────────────────────────────────────────────

const CLUSTER_COLORS: Record<string, string> = {
  Core: "#0969da",
  Infra: "#1a7f37",
  Client: "#8250df",
  Tests: "#bf3989",
  Docs: "#6e7781",
};

export default function ResearchDigest({
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
          return { outgoingScene: null, isTransitioning: false, lastScene: prev.lastScene };
        });
      }, TRANSITION_DURATION);

      setTransitionInfo({
        outgoingScene: transitionInfo.lastScene,
        isTransitioning: true,
        lastScene: scene,
      });
    } else {
      setTransitionInfo({
        outgoingScene: null,
        isTransitioning: false,
        lastScene: scene,
      });
    }
  }

  var outgoingScene = transitionInfo.outgoingScene;
  var isTransitioning = transitionInfo.isTransitioning;

  useEffect(() => {
    const inject = (id: string, href: string) => {
      if (document.getElementById(id)) return;
      const link = document.createElement("link");
      link.id = id;
      link.rel = "stylesheet";
      link.href = href;
      document.head.appendChild(link);
    };
    inject(
      "style-43-fonts-inter",
      "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap",
    );
    inject(
      "style-43-fonts-noto-serif-sc",
      "https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;600;700&display=swap",
    );
  }, []);

  useLayoutEffect(() => {
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

  // ── Scene 1: Cover ─────────────────────────────────────────────────────

  const renderScene1 = (opts: { entered: boolean; reducedMotion: boolean }) => {
    const c = SCENES[1][language];
    const topics = c.topics as string[];
    const e = opts.entered;
    const rm = opts.reducedMotion;
    return (
      <div className={styles.cover}>
        <div className={styles.coverInner}>
          <div
            className={styles.coverEdition}
            style={{
              opacity: e ? 1 : 0,
              transition: rm ? "none" : "opacity 0.6s ease 0.2s",
            }}
          >
            {c.edition}
          </div>
          <h1
            className={styles.coverTitle}
            style={{
              opacity: e ? 1 : 0,
              transform: e ? "none" : "translateY(1.5cqh)",
              transition: rm
                ? "none"
                : "opacity 0.8s ease 0.4s, transform 0.8s ease 0.4s",
            }}
          >
            {c.digestTitle}
          </h1>
          <div className={styles.coverRule} />
          <p
            className={styles.coverSubtitle}
            style={{
              opacity: e ? 1 : 0,
              transition: rm ? "none" : "opacity 0.8s ease 0.7s",
            }}
          >
            {c.subtitle}
          </p>
          <div
            className={styles.coverTopics}
            style={{
              opacity: e ? 1 : 0,
              transition: rm ? "none" : "opacity 0.6s ease 1s",
            }}
          >
            {topics.map((topic, i) => (
              <span key={i} className={styles.coverTopicTag}>
                {topic}
              </span>
            ))}
          </div>
          <div className={styles.coverSpacer} />
          <div
            className={styles.coverFooter}
            style={{
              opacity: e ? 0.7 : 0,
              transition: rm ? "none" : "opacity 0.6s ease 1.3s",
            }}
          >
            <p>{c.scope}</p>
            <p className={styles.coverCompiled}>{c.compiledBy}</p>
          </div>
        </div>
      </div>
    );
  };

  // ── Scene 2: Featured Paper ────────────────────────────────────────────

  const renderScene2 = (opts: { entered: boolean; beat: number; reducedMotion: boolean }) => {
    const c = SCENES[2][language];
    const paper = c.paper as Record<string, any>;
    const tags = paper.tags as string[];
    const e = opts.entered;
    const b = opts.beat;
    const rm = opts.reducedMotion;
    return (
      <div className={styles.featured}>
        <div className={styles.featuredLabel}>
          {language === "zh" ? "★ 精选论文" : "★ Featured Paper"}
        </div>
        <div
          className={styles.paperCard}
          style={{
            opacity: e ? 1 : 0,
            transform: e ? "none" : "translateY(1cqh)",
            transition: rm
              ? "none"
              : "opacity 0.6s ease, transform 0.6s ease",
          }}
        >
          <div className={styles.paperMetaRow}>
            <span className={styles.paperVenueBadge}>{paper.venue}</span>
            <span className={styles.paperTrack}>{paper.track}</span>
            <span className={styles.paperCiteCount}>
              📊 {paper.citations} {language === "zh" ? "引用" : "citations"}
            </span>
          </div>
          <h2 className={styles.paperTitle}>{paper.title}</h2>
          <p className={styles.paperAuthors}>
            {paper.authors}
            <span className={styles.paperAffil}> · {paper.affiliation}</span>
          </p>
          {b >= 0 && (
            <div className={styles.paperTags}>
              {tags.map((tag, i) => (
                <span key={i} className={styles.paperTag}>
                  {tag}
                </span>
              ))}
            </div>
          )}
          {b >= 1 && (
            <div
              className={styles.paperAbstract}
              style={{
                opacity: e ? 1 : 0,
                transition: rm
                  ? "none"
                  : "opacity 0.6s ease 0.2s",
              }}
            >
              <p className={styles.paperAbstractLabel}>
                {language === "zh" ? "摘要" : "Abstract"}
              </p>
              <p className={styles.paperAbstractText}>{paper.abstract}</p>
            </div>
          )}
          <div className={styles.paperFooter}>
            <span className={styles.paperPages}>{paper.pages}</span>
            <span className={styles.paperRefs}>
              {paper.references} {language === "zh" ? "篇参考文献" : "references"}
            </span>
          </div>
        </div>
      </div>
    );
  };

  // ── Scene 3: Citation Network ──────────────────────────────────────────

  const renderScene3 = (opts: { entered: boolean; beat: number; reducedMotion: boolean }) => {
    const c = SCENES[3][language];
    const papers = c.papers as Array<{
      id: number;
      short: string;
      title: string;
      year: number;
      citations: number;
      cluster: string;
      x: number;
      y: number;
    }>;
    const connections = c.connections as Array<[number, number]>;
    const e = opts.entered;
    const b = opts.beat;
    const rm = opts.reducedMotion;

    const paperMap: Record<number, (typeof papers)[0]> = {};
    papers.forEach((p) => (paperMap[p.id] = p));

    return (
      <div className={styles.network}>
        <div className={styles.networkHeader}>
          <h2 className={styles.networkTitle}>{c.title}</h2>
          <p className={styles.networkSubtitle}>{c.subtitle}</p>
        </div>
        <div className={styles.networkViz}>
          {/* Connection lines */}
          {b >= 1 && (
            <svg
              className={styles.networkSvg}
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              {connections.map(([from, to], i) => {
                const p1 = paperMap[from];
                const p2 = paperMap[to];
                if (!p1 || !p2) return null;
                return (
                  <line
                    key={i}
                    x1={p1.x}
                    y1={p1.y}
                    x2={p2.x}
                    y2={p2.y}
                    stroke="rgba(100, 100, 140, 0.25)"
                    strokeWidth="0.2"
                    vectorEffect="non-scaling-stroke"
                    style={{
                      opacity: e ? 1 : 0,
                      transition: rm
                        ? "none"
                        : `opacity 0.5s ease ${i * 0.04}s`,
                    }}
                  />
                );
              })}
            </svg>
          )}
          {/* Paper nodes */}
          {papers.map((p, i) => {
            const color = CLUSTER_COLORS[p.cluster] || "#6366f1";
            const size = 1.5 + Math.log2(p.citations) * 0.4;
            const showLabels = b >= 2;
            return (
              <div
                key={p.id}
                className={styles.networkNode}
                style={{
                  left: `${p.x}%`,
                  top: `${p.y}%`,
                  opacity: e && b >= 0 ? 1 : 0,
                  transform: e
                    ? "translate(-50%, -50%) scale(1)"
                    : "translate(-50%, -50%) scale(0)",
                  transition: rm
                    ? "none"
                    : `opacity 0.5s ease ${i * 0.08}s, transform 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.08}s`,
                }}
              >
                <div
                  className={styles.networkNodeDot}
                  style={{
                    width: `${size}cqh`,
                    height: `${size}cqh`,
                    background: color,
                    boxShadow: `0 0 ${size}cqh ${color}60`,
                  }}
                />
                {showLabels && (
                  <div
                    className={styles.networkNodeLabel}
                    style={{
                      opacity: e ? 1 : 0,
                      transition: rm
                        ? "none"
                        : `opacity 0.4s ease ${0.5 + i * 0.06}s`,
                    }}
                  >
                    <span className={styles.networkNodeName}>{p.short}</span>
                    <span className={styles.networkNodeCites}>
                      {p.citations}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        {/* Legend */}
        {b >= 2 && (
          <div className={styles.networkLegend}>
            {Object.entries(CLUSTER_COLORS).map(([name, color]) => (
              <div key={name} className={styles.networkLegendItem}>
                <div
                  className={styles.networkLegendDot}
                  style={{ background: color }}
                />
                <span>{name}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  // ── Scene 4: Keyword Cloud ─────────────────────────────────────────────

  const renderScene4 = (opts: { entered: boolean; beat: number; reducedMotion: boolean }) => {
    const c = SCENES[4][language];
    const keywords = c.keywords as Array<{
      term: string;
      count: number;
      size: string;
    }>;
    const e = opts.entered;
    const b = opts.beat;
    const rm = opts.reducedMotion;
    const visibleCount = b === 0 ? Math.ceil(keywords.length / 2) : keywords.length;
    const visible = keywords.slice(0, visibleCount);

    return (
      <div className={styles.keywords}>
        <div className={styles.kwHeader}>
          <h2 className={styles.kwTitle}>{c.title}</h2>
          <p className={styles.kwSubtitle}>{c.subtitle}</p>
        </div>
        <div className={styles.kwCloud}>
          {visible.map((kw, i) => (
            <span
              key={i}
              className={[
                styles.kwTag,
                styles[`kwSize${kw.size.toUpperCase()}`],
              ].join(" ")}
              style={{
                opacity: e ? 1 : 0,
                transform: e ? "none" : "translateY(0.5cqh)",
                transition: rm
                  ? "none"
                  : `opacity 0.4s ease ${i * 0.04}s, transform 0.4s ease ${i * 0.04}s`,
              }}
            >
              {kw.term}
              <span className={styles.kwCount}>{kw.count}</span>
            </span>
          ))}
        </div>
      </div>
    );
  };

  // ── Scene 5: Statistics ────────────────────────────────────────────────

  const renderScene5 = (opts: { entered: boolean; reducedMotion: boolean }) => {
    const c = SCENES[5][language];
    const stats = c.stats as Array<{ label: string; value: string; sub: string }>;
    const e = opts.entered;
    const rm = opts.reducedMotion;
    return (
      <div className={styles.stats}>
        <div className={styles.statsHeader}>
          <h2 className={styles.statsTitle}>{c.title}</h2>
          <p className={styles.statsSubtitle}>{c.subtitle}</p>
        </div>
        <div className={styles.statsGrid}>
          {stats.map((s, i) => (
            <div
              key={i}
              className={styles.statCard}
              style={{
                opacity: e ? 1 : 0,
                transform: e ? "none" : "translateY(1cqh)",
                transition: rm
                  ? "none"
                  : `opacity 0.5s ease ${0.1 + i * 0.08}s, transform 0.5s ease ${0.1 + i * 0.08}s`,
              }}
            >
              <span className={styles.statValue}>{s.value}</span>
              <span className={styles.statLabel}>{s.label}</span>
              <span className={styles.statSub}>{s.sub}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderSceneByNumber = (
    num: number,
    opts: { entered: boolean; beat: number; reducedMotion: boolean },
  ) => {
    switch (num) {
      case 1:
        return renderScene1(opts);
      case 2:
        return renderScene2(opts);
      case 3:
        return renderScene3(opts);
      case 4:
        return renderScene4(opts);
      case 5:
        return renderScene5(opts);
      default:
        return null;
    }
  };

  const currentOpts = { entered, beat, reducedMotion };
  const outgoingOpts = { entered: true, beat: 99, reducedMotion };

  // ── Navigation (Filter Tabs) ──────────────────────────────────────────

  const renderNav = () => {
    if (isThumbnail) return null;
    const tabLabels = {
      en: ["Issue", "Problem", "Solution", "Impact", "Checklist"],
      zh: ["工单", "问题", "方案", "影响", "清单"],
    };
    return (
      <nav className={styles.nav} aria-label="Section navigation">
        <div className={styles.navTabs}>
          {[1, 2, 3, 4, 5].map((s) => {
            const isActive = s === scene;
            return (
              <button
                key={s}
                type="button"
                className={[
                  styles.navTab,
                  isActive ? styles.navTabActive : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                onClick={(e) => handleNavClick(e, s)}
                aria-label={`Jump to scene ${s}`}
                style={reducedMotion ? { transitionDuration: "0s" } : undefined}
              >
                {tabLabels[language][s - 1]}
              </button>
            );
          })}
        </div>
      </nav>
    );
  };

  return (
    <div data-testid="style-43-root" className={rootClasses}>
      {/* Outgoing scene (exit animation) */}
      {outgoingScene !== null && !reducedMotion && (
        <div className={`${styles.sceneLayer} ${styles.exitAnim}`}>
          {renderSceneByNumber(outgoingScene, outgoingOpts)}
        </div>
      )}

      {/* Incoming / current scene (enter animation) */}
      <div
        className={`${styles.sceneLayer} ${
          isTransitioning && !isTransitionClone ? styles.enterAnim : ""
        }`}
      >
        {renderSceneByNumber(scene, currentOpts)}
      </div>

      {renderNav()}
    </div>
  );
}

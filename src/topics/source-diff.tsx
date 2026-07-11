import { useState, useLayoutEffect, useEffect, useCallback } from "react";
import {
  defineTopic,
  type TopicDefinition,
  type TopicMetadata,
  type TopicStageProps,
} from "../domain/topic";
import SpatialSceneTrack, {
  type SceneTransitionMap,
} from "../styles/SpatialSceneTrack";
import styles from "./source-diff.module.css";
import { useFLIP } from "../hooks/useFLIP";

/* ── Content ─────────────────────────────────────────────────────────────── */

const SCENES = {
  en: {
    scenes: [
      {
        id: "title",
        label: "Header",
        icon: "📝",
        series: "Code Review Annotation · CR-2026-142",
        title: "Authentication",
        titleEm: "Token Refresh",
        titleSuffix: "Refactor",
        subtitle:
          "Before/after annotated diff — resolving race condition in concurrent token refresh",
        meta: [
          { label: "File", value: "auth/tokenRefresh.ts" },
          { label: "Author", value: "Jordan Lee" },
          { label: "Date", value: "July 6, 2026" },
          { label: "Reviewers", value: "3 assigned" },
        ],
      },
      {
        id: "before",
        label: "Before",
        icon: "◀",
        execLabel: "Original Implementation",
        title: "Before: Race Condition on Concurrent Refresh",
        paras: [
          "The original token refresh handler issues a new token on every 401 response without checking if a refresh is already in flight. When multiple browser tabs trigger refresh simultaneously, each request invalidates the previous token, causing a cascade of failed requests and forced user logout.",
          "The function lacks idempotency guarantees and does not coordinate between concurrent callers. The token store uses simple overwrite semantics, meaning the last write wins regardless of whether an earlier refresh has already been acknowledged by downstream services.",
        ],
        keyPointsLabel: "Problems Identified",
        keyPoints: [
          "No distributed lock — concurrent refresh requests race",
          "Token overwrite without version check — lost updates",
          "No request coalescing — each tab fires independently",
          "Logout cascade — 60% failure rate with 3+ tabs open",
        ],
      },
      {
        id: "after",
        label: "After",
        icon: "▶",
        title: "After: Idempotent Refresh with Deduplication",
        subtitle: "Annotated changes — 4 key modifications",
        recs: [
          {
            num: "1",
            heading: "Distributed Lock on Refresh Endpoint",
            text: "Added Redis SETNX-based mutex with 5-second TTL before token rotation. Only one request can enter the critical section at a time. Subsequent requests wait for the lock and return the same token if refresh already completed.",
            priority: "Critical fix",
            priorityClass: "high",
          },
          {
            num: "2",
            heading: "Token Versioning with CAS",
            text: "Token store now uses compare-and-swap semantics. Each refresh increments a version counter. Stale refresh requests are rejected with 'token_version_mismatch' instead of silently overwriting.",
            priority: "Critical fix",
            priorityClass: "high",
          },
          {
            num: "3",
            heading: "Client-Side Request Coalescing",
            text: "Client SDK now buffers all 401-triggered refreshes into a single shared promise. First caller initiates refresh; subsequent callers await the same promise. Eliminates redundant network calls entirely.",
            priority: "Performance",
            priorityClass: "medium",
          },
          {
            num: "4",
            heading: "Graceful Degradation on Lock Timeout",
            text: "If Redis is unavailable, falls back to in-memory lock with exponential backoff. System remains operational with degraded protection rather than hard failure.",
            priority: "Resilience",
            priorityClass: "medium",
          },
          {
            num: "5",
            heading: "Integration Test for Concurrent Refresh",
            text: "New test suite spawns 10 concurrent refresh requests against a test server. Validates that only one token rotation occurs and all callers receive the same valid token.",
            priority: "Coverage",
            priorityClass: "medium",
          },
        ],
      },
      {
        id: "diff",
        label: "Diff",
        icon: "⇄",
        title: "Line-by-Line Diff Summary",
        subtitle: "42 lines added, 18 removed across 3 files",
        paras: [
          "tokenRefresh.ts: Added acquireLock() call at line 47 before token rotation. Wrapped refresh logic in try/finally to ensure lock release. Added version parameter to store.update() call at line 89. Total: +24 lines, -6 lines.",
          "tokenStore.ts: Refactored update() to accept expectedVersion parameter. Implements atomic compare-and-swap using Redis WATCH/MULTI. Returns { success, newToken, version } tuple. Total: +14 lines, -8 lines.",
          "client.ts: Added refreshPromise singleton at module scope. All 401 handlers check and share this promise. Clears on successful refresh or after 30s timeout. Total: +4 lines, -4 lines.",
        ],
        footnotesLabel: "Test Results",
        footnotes: [
          {
            mark: "✓",
            text: "Concurrent refresh test: 10/10 requests receive same valid token (previously 4/10 success)",
          },
          {
            mark: "✓",
            text: "Load test: 3x peak traffic, 0 token conflicts (previously 180/day at this station)",
          },
          {
            mark: "✓",
            text: "Redis failover test: graceful fallback to in-memory lock within 200ms",
          },
        ],
      },
      {
        id: "rationale",
        label: "Rationale",
        icon: "💭",
        title: "Why This Approach",
        subtitle: "Design decisions and trade-offs",
        phases: [
          {
            label: "Why Redis Lock",
            title: "Distributed coordination requirement",
            timeline: "vs. in-memory only",
            items: [
              "Service runs on 4 instances — in-memory lock insufficient",
              "SETNX provides O(1) atomic acquire with TTL safety",
              "Alternative: database row lock — 10x higher latency",
            ],
          },
          {
            label: "Why Versioning",
            title: "Detecting stale writes",
            timeline: "vs. timestamp comparison",
            items: [
              "Monotonic version avoids clock skew issues",
              "CAS pattern familiar to all team members",
              "Enables idempotent retry on version mismatch",
            ],
          },
          {
            label: "Why Client Coalescing",
            title: "Reducing redundant work",
            timeline: "vs. server-side dedup only",
            items: [
              "Eliminates 90%+ of redundant refresh calls",
              "Reduces server load during token expiry windows",
              "Zero additional server infrastructure required",
            ],
          },
        ],
      },
    ],
  },
  zh: {
    scenes: [
      {
        id: "title",
        label: "标题",
        icon: "📝",
        series: "代码评审注解 · CR-2026-142",
        title: "认证令牌刷新",
        titleEm: "重构",
        titleSuffix: "注解",
        subtitle: "前后对比注解差异——解决并发令牌刷新中的竞态条件",
        meta: [
          { label: "文件", value: "auth/tokenRefresh.ts" },
          { label: "作者", value: "李乔丹" },
          { label: "日期", value: "2026年7月6日" },
          { label: "评审人", value: "已指派 3 人" },
        ],
      },
      {
        id: "before",
        label: "之前",
        icon: "◀",
        execLabel: "原始实现",
        title: "之前：并发刷新竞态条件",
        paras: [
          "原始令牌刷新处理器在每次 401 响应时颁发新令牌，不检查是否已有刷新正在进行。当多个浏览器标签页同时触发刷新时，每个请求都会使前一个令牌失效，导致一连串失败请求和强制用户登出。",
          "该函数缺乏幂等性保证，不在并发调用者之间进行协调。令牌存储使用简单的覆盖语义，意味着最后一次写入获胜，无论早期刷新是否已被下游服务确认。",
        ],
        keyPointsLabel: "已识别问题",
        keyPoints: [
          "无分布式锁——并发刷新请求竞态",
          "无版本检查的令牌覆盖——丢失更新",
          "无请求合并——每个标签页独立触发",
          "登出级联——3 个以上标签页打开时 60% 失败率",
        ],
      },
      {
        id: "after",
        label: "之后",
        icon: "▶",
        title: "之后：带去重的幂等刷新",
        subtitle: "注解变更——4 项关键修改",
        recs: [
          {
            num: "1",
            heading: "刷新端点分布式锁",
            text: "在令牌轮换前添加基于 Redis SETNX 的互斥锁，TTL 为 5 秒。一次只有一个请求可以进入临界区。后续请求等待锁，如果刷新已完成则返回相同令牌。",
            priority: "关键修复",
            priorityClass: "high",
          },
          {
            num: "2",
            heading: "带 CAS 的令牌版本控制",
            text: "令牌存储现使用比较交换语义。每次刷新递增版本计数器。过期的刷新请求被以 'token_version_mismatch' 拒绝，而非静默覆盖。",
            priority: "关键修复",
            priorityClass: "high",
          },
          {
            num: "3",
            heading: "客户端请求合并",
            text: "客户端 SDK 现将所有 401 触发的刷新缓冲到单个共享 Promise。第一个调用者发起刷新；后续调用者等待同一 Promise。完全消除冗余网络调用。",
            priority: "性能",
            priorityClass: "medium",
          },
          {
            num: "4",
            heading: "锁超时时优雅降级",
            text: "如果 Redis 不可用，回退到内存锁并使用指数退避。系统在保护降级的情况下仍可运行，而非硬故障。",
            priority: "弹性",
            priorityClass: "medium",
          },
          {
            num: "5",
            heading: "并发刷新集成测试",
            text: "新测试套件针对测试服务器生成 10 个并发刷新请求。验证只发生一次令牌轮换且所有调用者接收相同的有效令牌。",
            priority: "覆盖",
            priorityClass: "medium",
          },
        ],
      },
      {
        id: "diff",
        label: "差异",
        icon: "⇄",
        title: "逐行差异摘要",
        subtitle: "跨 3 个文件，新增 42 行，删除 18 行",
        paras: [
          "tokenRefresh.ts：在第 47 行令牌轮换前添加 acquireLock() 调用。将刷新逻辑包装在 try/finally 中以确保锁释放。在第 89 行向 store.update() 调用添加 version 参数。合计：+24 行，-6 行。",
          "tokenStore.ts：重构 update() 以接受 expectedVersion 参数。使用 Redis WATCH/MULTI 实现原子比较交换。返回 { success, newToken, version } 元组。合计：+14 行，-8 行。",
          "client.ts：在模块作用域添加 refreshPromise 单例。所有 401 处理器检查并共享此 Promise。在成功刷新或 30 秒超时后清除。合计：+4 行，-4 行。",
        ],
        footnotesLabel: "测试结果",
        footnotes: [
          {
            mark: "✓",
            text: "并发刷新测试：10/10 请求接收相同有效令牌（此前为 4/10 成功率）",
          },
          {
            mark: "✓",
            text: "负载测试：3 倍峰值流量，0 令牌冲突（此前此站每天 180 次）",
          },
          {
            mark: "✓",
            text: "Redis 故障转移测试：200ms 内优雅回退到内存锁",
          },
        ],
      },
      {
        id: "rationale",
        label: "理由",
        icon: "💭",
        title: "为何选择此方案",
        subtitle: "设计决策和权衡",
        phases: [
          {
            label: "为何用 Redis 锁",
            title: "分布式协调需求",
            timeline: "对比仅内存锁",
            items: [
              "服务运行在 4 个实例上——内存锁不足",
              "SETNX 提供 O(1) 原子获取和 TTL 安全",
              "替代方案：数据库行锁——延迟高 10 倍",
            ],
          },
          {
            label: "为何用版本控制",
            title: "检测过期写入",
            timeline: "对比时间戳比较",
            items: [
              "单调版本避免时钟偏差问题",
              "CAS 模式为所有团队成员熟悉",
              "支持版本不匹配时的幂等重试",
            ],
          },
          {
            label: "为何用客户端合并",
            title: "减少冗余工作",
            timeline: "对比仅服务端去重",
            items: [
              "消除 90%+ 的冗余刷新调用",
              "降低令牌过期窗口期的服务器负载",
              "无需额外服务器基础设施",
            ],
          },
        ],
      },
    ],
  },
} as const;

/* ── Transition constants ────────────────────────────────────────────────── */

/* ── Component ───────────────────────────────────────────────────────────── */

const BEAT_LAYOUT_MODES = {
  2: "motion",
  3: "motion",
  4: "motion",
  5: "motion",
} satisfies Record<number, "motion" | "reserved">;

const TRANSITION_SCORE = {
  "1->2": "slide-y",
  "2->3": "slide-y",
  "3->4": "slide-y",
  "4->5": "slide-y",
} as const satisfies TopicDefinition["transitionScore"];

const TRANSITION_MAP: SceneTransitionMap = TRANSITION_SCORE;

const NAVIGATION = {
  geometry: "card-miniature",
  carrier: "source-diff-bottom-nav",
  invocation: "persistent",
  feedback: "active-glow",
} as const satisfies TopicDefinition["navigation"];

function TopicStage({
  scene,
  beat,
  language,
  isThumbnail,
  reducedMotion,
  onNavigate,
}: TopicStageProps) {
  const [entered, setEntered] = useState(false);

  useLayoutEffect(() => {
    const id = "source-diff-fonts";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Noto+Serif+SC:wght@400;600;700&display=swap";
    document.head.appendChild(link);
  }, []);

  useEffect(() => {
    setEntered(false);
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => setEntered(true));
    });
    return () => cancelAnimationFrame(id);
  }, [scene]);

  // FLIP for recommendation list (scene 3)
  const { ref: recListRef } = useFLIP<HTMLDivElement>({
    watch: [beat],
    duration: 400,
    easing: "cubic-bezier(0.16, 1, 0.3, 1)",
  });

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

  /* ── Render scene content for a given scene number ─────────────────────── */

  const renderSceneFor = (
    sceneNum: number,
    beatNum: number,
    isCurrent: boolean,
  ) => {
    const s = data.scenes[sceneNum - 1];
    if (!s) return null;

    const showEntered = isCurrent ? entered : true;

    switch (sceneNum) {
      case 1: {
        const sd = s as (typeof data.scenes)[0];
        return (
          <div className={styles.titlePage}>
            <div className={styles.titleSeries}>{sd.series}</div>
            <h1 className={styles.titleMain}>
              {sd.title} <em>{sd.titleEm}</em>
              <br />
              {sd.titleSuffix}
            </h1>
            <p className={styles.titleSubtitle}>{sd.subtitle}</p>
            <div className={styles.titleRule} />
            <div className={styles.titleMeta}>
              {sd.meta.map((m, i) => (
                <div key={i} className={styles.titleMetaItem}>
                  <span className={styles.titleMetaLabel}>{m.label}</span>
                  <span className={styles.titleMetaValue}>{m.value}</span>
                </div>
              ))}
            </div>
          </div>
        );
      }

      case 2: {
        const sd = s as (typeof data.scenes)[1];
        return (
          <div className={styles.execSummary}>
            <div className={styles.execLabel}>{sd.execLabel}</div>
            <div className={styles.execBox}>
              <h2 className={styles.execTitle}>{sd.title}</h2>
              <div className={styles.execBody}>
                {sd.paras.map((p, i) => (
                  <p
                    key={i}
                    className={styles.execPara}
                    style={{
                      opacity: showEntered && i <= beatNum ? 1 : 0,
                      transform:
                        showEntered && i <= beatNum
                          ? "translateY(0)"
                          : "translateY(0.8cqh)",
                      transition: "opacity 0.4s ease, transform 0.4s ease",
                      transitionDelay: `${i * 0.15}s`,
                    }}
                  >
                    {p}
                  </p>
                ))}
                <div className={styles.execKeyPoints}>
                  <div className={styles.execKeyPointsLabel}>
                    {sd.keyPointsLabel}
                  </div>
                  {sd.keyPoints.map((kp, i) => (
                    <div
                      key={i}
                      className={styles.execKeyPoint}
                      style={{
                        opacity: showEntered && beatNum >= 1 ? 1 : 0,
                        transition: "opacity 0.3s ease",
                        transitionDelay: `${i * 0.08}s`,
                      }}
                    >
                      {kp}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      }

      case 3: {
        const sd = s as (typeof data.scenes)[2];
        const visibleCount = Math.min(beatNum * 2 + 2, sd.recs.length);
        return (
          <div className={styles.recommendations}>
            <div className={styles.recHeader}>
              <h2 className={styles.recTitle}>{sd.title}</h2>
              <p className={styles.recSubtitle}>{sd.subtitle}</p>
            </div>
            <div
              ref={isCurrent ? recListRef : undefined}
              className={styles.recList}
            >
              {sd.recs.slice(0, visibleCount).map((r, i) => (
                <div
                  key={r.num}
                  className={styles.recItem}
                  style={{
                    opacity: showEntered ? 1 : 0,
                    transform: showEntered
                      ? "translateX(0)"
                      : "translateX(-1cqw)",
                    transition: "opacity 0.4s ease, transform 0.4s ease",
                    transitionDelay: `${i * 0.1}s`,
                  }}
                >
                  <div className={styles.recNumber}>{r.num}</div>
                  <div className={styles.recContent}>
                    <h3 className={styles.recHeading}>{r.heading}</h3>
                    <p className={styles.recText}>{r.text}</p>
                    <span
                      className={`${styles.recPriority} ${
                        r.priorityClass === "high"
                          ? styles.recPriorityHigh
                          : r.priorityClass === "medium"
                            ? styles.recPriorityMedium
                            : styles.recPriorityLow
                      }`}
                    >
                      {r.priority}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      }

      case 4: {
        const sd = s as (typeof data.scenes)[3];
        return (
          <div className={styles.evidence}>
            <div className={styles.evidenceHeader}>
              <h2 className={styles.evidenceTitle}>{sd.title}</h2>
              <p className={styles.evidenceSubtitle}>{sd.subtitle}</p>
            </div>
            <div className={styles.evidenceBody}>
              {sd.paras.map((p, i) => (
                <p
                  key={i}
                  className={styles.evidencePara}
                  style={{
                    opacity: showEntered && i <= beatNum ? 1 : 0,
                    transform:
                      showEntered && i <= beatNum
                        ? "translateY(0)"
                        : "translateY(0.6cqh)",
                    transition: "opacity 0.4s ease, transform 0.4s ease",
                    transitionDelay: `${i * 0.12}s`,
                  }}
                  dangerouslySetInnerHTML={{
                    __html: p.replace(
                      /(\d+)/g,
                      (_, n) =>
                        /[¹²³⁴⁵⁶⁷⁸⁹]/.test(
                          String.fromCharCode(0x00b0 + parseInt(n)),
                        )
                          ? `<span class="${styles.evidenceFootnote}">${n}</span>`
                          : `<span class="${styles.evidenceFootnote}">${n}</span>`,
                    ),
                  }}
                />
              ))}
              <div className={styles.evidenceFootnotes}>
                <div className={styles.evidenceFootnotesLabel}>
                  {sd.footnotesLabel}
                </div>
                {sd.footnotes.map((fn, i) => (
                  <div key={i} className={styles.evidenceFootnoteItem}>
                    <span className={styles.evidenceFootnoteMark}>
                      {fn.mark}.
                    </span>
                    {fn.text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      }

      case 5: {
        const sd = s as (typeof data.scenes)[4];
        return (
          <div className={styles.roadmap}>
            <div className={styles.roadmapHeader}>
              <h2 className={styles.roadmapTitle}>{sd.title}</h2>
              <p className={styles.roadmapSubtitle}>{sd.subtitle}</p>
            </div>
            <div className={styles.roadmapPhases}>
              {sd.phases.map((phase, i) => (
                <div
                  key={i}
                  className={styles.roadmapPhase}
                  style={{
                    opacity: showEntered && i <= beatNum ? 1 : 0,
                    transform:
                      showEntered && i <= beatNum
                        ? "translateY(0)"
                        : "translateY(1cqh)",
                    transition: "opacity 0.4s ease, transform 0.4s ease",
                    transitionDelay: `${i * 0.15}s`,
                  }}
                >
                  <div className={styles.roadmapPhaseLabel}>{phase.label}</div>
                  <h3 className={styles.roadmapPhaseTitle}>{phase.title}</h3>
                  <div className={styles.roadmapPhaseTimeline}>
                    {phase.timeline}
                  </div>
                  <ul className={styles.roadmapPhaseItems}>
                    {phase.items.map((item, j) => (
                      <li key={j} className={styles.roadmapPhaseItem}>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        );
      }

      default:
        return null;
    }
  };

  /* Navigation */
  const renderNav = () => {
    if (isThumbnail) return null;
    return (
      <nav
        className={styles.nav}
        data-topic-navigation="true"
        data-navigation-geometry={NAVIGATION.geometry}
        data-navigation-carrier={NAVIGATION.carrier}
        data-navigation-invocation={NAVIGATION.invocation}
        data-navigation-feedback={NAVIGATION.feedback}
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

  // ── Build layer classes ─────────────────────────────────────────────────

  return (
    <div className={rootClasses}>
            <SpatialSceneTrack
        scene={scene}
        beat={beat}
        transitionKind="slide-y"
        transitionMap={TRANSITION_MAP}
        reducedMotion={reducedMotion || isThumbnail}
        beatLayoutModes={BEAT_LAYOUT_MODES}
        renderScene={(sceneId, sceneBeat, isActive) => (
          <div className={styles.sceneLayer}>
            {renderSceneFor(sceneId, sceneBeat, isActive)}
          </div>
        )}
      />

      {renderNav()}
    </div>
  );
}

/* ── Metadata ────────────────────────────────────────────────────────────── */

function buildMetadata(lang: "en" | "zh"): TopicMetadata {
  const t = lang === "zh" ? zhMeta : enMeta;
  return {
    theme: t.theme,
    densityLabel: t.densityLabel,
    heroScene: 3,
    colors: {
      bg: "#f8f9fa",
      ink: "#1a1a2e",
      panel: "#ffffff",
    },
    typography: {
      header: "Inter 700",
      body: "JetBrains Mono 400",
    },
    tags: lang === "zh"
      ? ["注解", "差异", "源码", "前后对比", "代码"]
      : ["annotated", "diff", "source", "before-after", "comparison", "code", "annotation"],
    fonts: ["Inter", "JetBrains Mono", "cjk:Noto Sans SC"],
    scenes: [
      {
        id: 1,
        title: lang === "zh" ? "标题" : "Header",
        beats: [
          { id: 0, action: "beat-0", title: lang === "zh" ? "完整标题" : "Full header" , body: "" },
        ],
      },
      {
        id: 2,
        title: lang === "zh" ? "之前" : "Before",
        beats: [
          { id: 0, action: "beat-0", title: lang === "zh" ? "首段代码" : "First code block" , body: "" },
          { id: 1, action: "beat-1", title: lang === "zh" ? "全部问题" : "All problems" , body: "" },
        ],
      },
      {
        id: 3,
        title: lang === "zh" ? "之后" : "After",
        beats: [
          { id: 0, action: "beat-0", title: lang === "zh" ? "前两项变更" : "First two changes" , body: "" },
          { id: 1, action: "beat-1", title: lang === "zh" ? "前四项变更" : "First four changes" , body: "" },
          { id: 2, action: "beat-2", title: lang === "zh" ? "全部五项变更" : "All five changes" , body: "" },
        ],
      },
      {
        id: 4,
        title: lang === "zh" ? "差异" : "Diff",
        beats: [
          { id: 0, action: "beat-0", title: lang === "zh" ? "首段差异" : "First diff section" , body: "" },
          { id: 1, action: "beat-1", title: lang === "zh" ? "全部差异和测试" : "All diffs and tests" , body: "" },
        ],
      },
      {
        id: 5,
        title: lang === "zh" ? "理由" : "Rationale",
        beats: [
          { id: 0, action: "beat-0", title: lang === "zh" ? "第一个理由" : "First rationale" , body: "" },
          { id: 1, action: "beat-1", title: lang === "zh" ? "前两个理由" : "First two rationales" , body: "" },
          { id: 2, action: "beat-2", title: lang === "zh" ? "全部三个理由" : "All three rationales" , body: "" },
        ],
      },
    ],
  };
}

const enMeta = {
  theme: "Before/after code transformations with annotated explanations and line-by-line diff",
  densityLabel: "Dense",
};

const zhMeta = {
  theme: "前后代码变换，含注解说明和逐行差异对比",
  densityLabel: "密集",
};

const METADATA = {
  en: buildMetadata("en"),
  zh: buildMetadata("zh"),
} satisfies TopicDefinition["metadata"];

export default defineTopic({
  id: "source-diff",
  styleId: "annotated-source-diff",
  title: { en: "Source Diff", zh: "源码差异" },
  modelId: "Doubao-Seed-Evolving",
  Stage: TopicStage,
  metadata: METADATA,
  navigation: NAVIGATION,
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

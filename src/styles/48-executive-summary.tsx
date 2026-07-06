import { useState, useEffect, useCallback } from "react";
import type { BespokeStyleProps, StyleMetadata } from "../types";
import SpatialSceneTrack from "./SpatialSceneTrack";
import styles from "./48-executive-summary.module.css";

/* ── Transition constants ──────────────────────────────────────────────── */

/* ── Content ─────────────────────────────────────────────────────────────── */

const SCENES = {
  en: {
    scenes: [
      {
        id: "header",
        label: "Hero",
        icon: "🔑",
        company: "The Key Cutting Shop",
        companySub: "A Physical Metaphor for Token Refresh",
        date: "Object Metaphor\nHero Display",
        type: "Concept Visualization · v2.14.0",
        title: "Auth Token",
        titleEm: "Refresh",
        tagline: "Understanding distributed lock, versioning, and request coalescing through a tangible analogy",
        prepared: "Auth tokens are like physical keys",
        author: "— when they wear out, you need a new one cut",
      },
      {
        id: "metrics",
        label: "Components",
        icon: "🔧",
        title: "The Key Cutting Station",
        subtitle: "Each component maps to a real system part",
        metrics: [
          {
            label: "Key Blanks",
            value: "Raw",
            unit: "Tokens",
            change: "Uncut",
            changeDir: "up",
            sub: "Fresh token templates",
          },
          {
            label: "Cutting Machine",
            value: "Redis",
            unit: "Lock",
            change: "1 at a time",
            changeDir: "up",
            sub: "SETNX mutex — one customer",
          },
          {
            label: "Serial Stamper",
            value: "v2.14",
            unit: "",
            change: "CAS",
            changeDir: "up",
            sub: "Token versioning — no duplicates",
          },
          {
            label: "Queue Board",
            value: "Shared",
            unit: "Promise",
            change: "Coalesced",
            changeDir: "up",
            sub: "Client request merging",
          },
          {
            label: "Workbench",
            value: "268",
            unit: "ms",
            change: "−68%",
            changeDir: "up",
            sub: "p99 refresh latency",
          },
          {
            label: "Success Rate",
            value: "100",
            unit: "%",
            change: "0 conflicts",
            changeDir: "up",
            sub: "at 3x peak load",
          },
        ],
      },
      {
        id: "priorities",
        label: "How It Works",
        icon: "⚙️",
        title: "The Refresh Process",
        subtitle: "Step by step, like getting a key cut",
        items: [
          {
            icon: "🚶",
            title: "1. Customer Arrives",
            desc: "A browser tab detects its key (token) is worn out (401 response). It heads to the key shop (refresh endpoint) to get a new one cut.",
            owner: "Analogy: Tab detects expired token",
          },
          {
            icon: "🔒",
            title: "2. Take a Number",
            desc: "The shop has one cutting station. First customer takes the lock (SETNX). Others wait — no two keys get cut simultaneously.",
            owner: "Analogy: Distributed mutex ensures one refresher",
          },
          {
            icon: "✂️",
            title: "3. Key Gets Cut",
            desc: "The locksmith cuts a new key and stamps it with a serial number (version increment). Old keys are now invalid — they don't fit the new lock.",
            owner: "Analogy: Token rotation with versioning",
          },
          {
            icon: "📋",
            title: "4. Everyone Gets a Copy",
            desc: "Waiting customers see the new key on display and take a copy instead of waiting for their own cut. Everyone leaves with the same working key.",
            owner: "Analogy: Client coalescing — shared promise",
          },
        ],
      },
      {
        id: "risks",
        label: "Mapping",
        icon: "🗺️",
        title: "System Mapping",
        subtitle: "Physical metaphor to actual implementation",
        risks: [
          {
            name: "Key Cutting Machine",
            level: "Redis Lock",
            levelClass: "high",
            desc: "The single cutting station represents our Redis SETNX mutex with 5-second TTL. It ensures only one refresh happens at a time, preventing the race condition where multiple tabs invalidate each other's tokens.",
            mitigation: "Implementation: acquireLock() before token rotation, release in finally block",
          },
          {
            name: "Serial Number Stamper",
            level: "Token Versioning",
            levelClass: "medium",
            desc: "Each new key gets a unique serial. If someone tries to use an old stamp (stale write), it's rejected. This is our compare-and-swap pattern.",
            mitigation: "Implementation: tokenStore.update() with expectedVersion, returns version_mismatch on stale",
          },
          {
            name: "Queue Board",
            level: "Client Coalescing",
            levelClass: "medium",
            desc: "Instead of each customer demanding their own key, they check the board first. If a key is being cut, they wait for it rather than starting a new order.",
            mitigation: "Implementation: module-scope refreshPromise, all 401 handlers share same promise",
          },
          {
            name: "Backup Workbench",
            level: "Graceful Fallback",
            levelClass: "low",
            desc: "If the main cutting machine breaks (Redis down), there's a manual workbench. Slower but keeps the shop open. Exponential backoff prevents thrashing.",
            mitigation: "Implementation: in-memory lock fallback with jittered retry on Redis unavailability",
          },
        ],
      },
      {
        id: "next",
        label: "Takeaways",
        icon: "💡",
        title: "Key Takeaways",
        subtitle: "What the metaphor teaches us about distributed systems",
        items: [
          {
            num: "1",
            action: "One at a Time is Simple",
            detail: "A single lock is easy to reason about. The complexity isn't in the lock itself — it's in what happens when the lock holder fails, or when the lock service itself is unavailable.",
            meta: [
              { label: "Pattern", value: "Mutual Exclusion" },
              { label: "Tool", value: "Redis SETNX" },
            ],
          },
          {
            num: "2",
            action: "Versioning Prevents Stale Writes",
            detail: "Without version numbers, two concurrent refreshers could each cut a valid key, and neither would know the other exists. The last write would silently win.",
            meta: [
              { label: "Pattern", value: "Compare-and-Swap" },
              { label: "Tool", value: "Redis WATCH/MULTI" },
            ],
          },
          {
            num: "3",
            action: "Coalescing Saves Work",
            detail: "9 out of 10 tabs don't need to make the trip to the shop. They just wait for the first one's result. This eliminates 90%+ of redundant network calls.",
            meta: [
              { label: "Pattern", value: "Promise Sharing" },
              { label: "Tool", value: "Module Singleton" },
            ],
          },
        ],
        footerText: "The best distributed systems are the ones you can hold in your hand.",
        footerContact: "v2.14.0 — Ready for canary deployment",
      },
    ],
  },
  zh: {
    scenes: [
      {
        id: "header",
        label: "主视觉",
        icon: "🔑",
        company: "配钥匙铺",
        companySub: "令牌刷新的物理隐喻",
        date: "物体隐喻\n主视觉展示",
        type: "概念可视化 · v2.14.0",
        title: "认证令牌",
        titleEm: "刷新",
        tagline: "通过有形类比理解分布式锁、版本控制和请求合并",
        prepared: "认证令牌就像物理钥匙",
        author: "—— 用旧了，你需要配一把新的",
      },
      {
        id: "metrics",
        label: "组件",
        icon: "🔧",
        title: "配钥匙工作台",
        subtitle: "每个组件对应一个真实系统部分",
        metrics: [
          {
            label: "钥匙坯",
            value: "原始",
            unit: "令牌",
            change: "未切割",
            changeDir: "up",
            sub: "新鲜令牌模板",
          },
          {
            label: "配钥机",
            value: "Redis",
            unit: "锁",
            change: "一次一人",
            changeDir: "up",
            sub: "SETNX 互斥锁——一位顾客",
          },
          {
            label: "序列号章",
            value: "v2.14",
            unit: "",
            change: "CAS",
            changeDir: "up",
            sub: "令牌版本控制——无重复",
          },
          {
            label: "排队板",
            value: "共享",
            unit: "Promise",
            change: "合并",
            changeDir: "up",
            sub: "客户端请求合并",
          },
          {
            label: "工作台",
            value: "268",
            unit: "ms",
            change: "−68%",
            changeDir: "up",
            sub: "p99 刷新延迟",
          },
          {
            label: "成功率",
            value: "100",
            unit: "%",
            change: "0 冲突",
            changeDir: "up",
            sub: "在 3 倍峰值负载下",
          },
        ],
      },
      {
        id: "priorities",
        label: "流程",
        icon: "⚙️",
        title: "刷新流程",
        subtitle: "一步步来，就像配钥匙",
        items: [
          {
            icon: "🚶",
            title: "1. 顾客到来",
            desc: "一个浏览器标签页发现它的钥匙（令牌）用旧了（401 响应）。它前往配钥匙铺（刷新端点）配一把新的。",
            owner: "类比：标签页检测到过期令牌",
          },
          {
            icon: "🔒",
            title: "2. 取号排队",
            desc: "店铺只有一个配钥台。第一位顾客取锁（SETNX）。其他人等待——不会同时配两把钥匙。",
            owner: "类比：分布式互斥确保唯一刷新者",
          },
          {
            icon: "✂️",
            title: "3. 配出新钥匙",
            desc: "锁匠配出新钥匙并盖上序列号（版本递增）。旧钥匙现在无效——它们插不进新锁。",
            owner: "类比：带版本控制的令牌轮换",
          },
          {
            icon: "📋",
            title: "4. 每人拿一把",
            desc: "等待的顾客看到展示台上的新钥匙，直接拿一把而不是等自己的。每个人都带着相同的有效钥匙离开。",
            owner: "类比：客户端合并——共享 Promise",
          },
        ],
      },
      {
        id: "risks",
        label: "映射",
        icon: "🗺️",
        title: "系统映射",
        subtitle: "物理隐喻到实际实现",
        risks: [
          {
            name: "配钥机",
            level: "Redis 锁",
            levelClass: "high",
            desc: "单一配钥台代表我们 5 秒 TTL 的 Redis SETNX 互斥锁。它确保一次只发生一次刷新，防止多个标签页互相使对方令牌失效的竞态条件。",
            mitigation: "实现：令牌轮换前 acquireLock()，finally 块中释放",
          },
          {
            name: "序列号章",
            level: "令牌版本控制",
            levelClass: "medium",
            desc: "每把新钥匙获得唯一序列号。如果有人试图使用旧印章（过期写入），会被拒绝。这就是我们的比较交换模式。",
            mitigation: "实现：tokenStore.update() 带 expectedVersion，过期时返回 version_mismatch",
          },
          {
            name: "排队板",
            level: "客户端合并",
            levelClass: "medium",
            desc: "顾客不是各自要求配自己的钥匙，而是先看板子。如果有钥匙正在配制，他们等待而不是发起新订单。",
            mitigation: "实现：模块作用域 refreshPromise，所有 401 处理器共享同一 Promise",
          },
          {
            name: "备用工作台",
            level: "优雅降级",
            levelClass: "low",
            desc: "如果主配钥机坏了（Redis 宕机），还有一个手动工作台。慢一点但店铺照常营业。指数退避防止抖动。",
            mitigation: "实现：Redis 不可用时回退到内存锁，带抖动重试",
          },
        ],
      },
      {
        id: "next",
        label: "要点",
        icon: "💡",
        title: "关键要点",
        subtitle: "这个隐喻教会我们关于分布式系统的什么",
        items: [
          {
            num: "1",
            action: "一次一个很简单",
            detail: "单一锁很容易理解。复杂性不在于锁本身——而在于当锁持有者失败时，或当锁服务本身不可用时会发生什么。",
            meta: [
              { label: "模式", value: "互斥" },
              { label: "工具", value: "Redis SETNX" },
            ],
          },
          {
            num: "2",
            action: "版本防止过期写入",
            detail: "没有版本号，两个并发刷新者各配一把有效钥匙，谁也不知道对方的存在。最后一次写入会静默获胜。",
            meta: [
              { label: "模式", value: "比较交换" },
              { label: "工具", value: "Redis WATCH/MULTI" },
            ],
          },
          {
            num: "3",
            action: "合并节省工作量",
            detail: "10 个标签页中有 9 个不需要跑一趟店铺。它们只等第一个的结果。这消除了 90%+ 的冗余网络调用。",
            meta: [
              { label: "模式", value: "Promise 共享" },
              { label: "工具", value: "模块单例" },
            ],
          },
        ],
        footerText: "最好的分布式系统是你能握在手里的那些。",
        footerContact: "v2.14.0 — 金丝雀部署就绪",
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

export default function ExecutiveSummary({
  scene,
  beat,
  language,
  isThumbnail,
  reducedMotion,
  onNavigate,
}: BespokeStyleProps) {
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const id = "style-48-fonts";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Noto+Sans+SC:wght@400;500;700&display=swap";
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

  /* Scene 1: Header */
  const renderHeader = (sceneNum: number, _beatNum: number, _isEntered: boolean) => {
    const s = data.scenes[sceneNum - 1] as (typeof data.scenes)[0];
    return (
      <div className={styles.pageHeader}>
        <div className={styles.pageHeaderTop}>
          <div className={styles.pageHeaderCompany}>
            <div className={styles.pageHeaderLogo}>N</div>
            <div>
              <div className={styles.pageHeaderCompanyName}>{s.company}</div>
              <div className={styles.pageHeaderCompanySub}>{s.companySub}</div>
            </div>
          </div>
          <div
            className={styles.pageHeaderDate}
            style={{ whiteSpace: "pre-line" }}
          >
            {s.date}
          </div>
        </div>
        <div className={styles.pageHeaderType}>{s.type}</div>
        <h1 className={styles.pageHeaderTitle}>
          {s.title} <em>{s.titleEm}</em>
        </h1>
        <p className={styles.pageHeaderTagline}>{s.tagline}</p>
        <div className={styles.pageHeaderRule} />
        <p className={styles.pageHeaderPrepared}>
          <strong>{s.prepared}</strong> {s.author}
        </p>
      </div>
    );
  };

  /* Scene 2: Key Metrics (HERO) */
  const renderMetrics = (sceneNum: number, beatNum: number, isEntered: boolean) => {
    const s = data.scenes[sceneNum - 1] as (typeof data.scenes)[1];
    const visibleCount = Math.min(beatNum * 2 + 2, s.metrics.length);
    return (
      <div className={styles.metrics}>
        <div className={styles.metricsHeader}>
          <h2 className={styles.metricsTitle}>{s.title}</h2>
          <p className={styles.metricsSubtitle}>{s.subtitle}</p>
        </div>
        <div className={styles.metricsGrid}>
          {s.metrics.slice(0, visibleCount).map((m, i) => (
            <div
              key={m.label}
              className={styles.metricCard}
              style={{
                opacity: isEntered ? 1 : 0,
                transform: isEntered ? "translateY(0)" : "translateY(0.8cqh)",
                transition: "opacity 0.4s ease, transform 0.4s ease",
                transitionDelay: `${i * 0.08}s`,
              }}
            >
              <div className={styles.metricLabel}>{m.label}</div>
              <div className={styles.metricValue}>
                {m.value}
                {m.unit && (
                  <span className={styles.metricValueUnit}>{m.unit}</span>
                )}
              </div>
              <div
                className={`${styles.metricChange} ${
                  m.changeDir === "up"
                    ? styles.metricChangeUp
                    : styles.metricChangeDown
                }`}
              >
                {m.changeDir === "up" ? "▲" : "▼"} {m.change}
              </div>
              <div className={styles.metricSub}>{m.sub}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  /* Scene 3: Priorities */
  const renderPriorities = (sceneNum: number, beatNum: number, isEntered: boolean) => {
    const s = data.scenes[sceneNum - 1] as (typeof data.scenes)[2];
    const visibleCount = Math.min(beatNum * 2 + 2, s.items.length);
    return (
      <div className={styles.priorities}>
        <div className={styles.prioritiesHeader}>
          <h2 className={styles.prioritiesTitle}>{s.title}</h2>
          <p className={styles.prioritiesSubtitle}>{s.subtitle}</p>
        </div>
        <div className={styles.prioritiesList}>
          {s.items.slice(0, visibleCount).map((item, i) => (
            <div
              key={i}
              className={styles.priorityItem}
              style={{
                opacity: isEntered ? 1 : 0,
                transform: isEntered ? "translateX(0)" : "translateX(-0.8cqh)",
                transition: "opacity 0.4s ease, transform 0.4s ease",
                transitionDelay: `${i * 0.1}s`,
              }}
            >
              <div className={styles.priorityIcon}>{item.icon}</div>
              <div className={styles.priorityBody}>
                <h3 className={styles.priorityTitle}>{item.title}</h3>
                <p className={styles.priorityDesc}>{item.desc}</p>
                <div className={styles.priorityOwner}>{item.owner}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  /* Scene 4: Risks */
  const renderRisks = (sceneNum: number, beatNum: number, isEntered: boolean) => {
    const s = data.scenes[sceneNum - 1] as (typeof data.scenes)[3];
    const visibleCount = Math.min(beatNum * 2 + 2, s.risks.length);
    return (
      <div className={styles.risks}>
        <div className={styles.risksHeader}>
          <h2 className={styles.risksTitle}>{s.title}</h2>
          <p className={styles.risksSubtitle}>{s.subtitle}</p>
        </div>
        <div className={styles.risksGrid}>
          {s.risks.slice(0, visibleCount).map((risk, i) => (
            <div
              key={i}
              className={styles.riskCard}
              style={{
                opacity: isEntered ? 1 : 0,
                transform: isEntered ? "scale(1)" : "scale(0.97)",
                transition: "opacity 0.4s ease, transform 0.4s ease",
                transitionDelay: `${i * 0.1}s`,
              }}
            >
              <div className={styles.riskCardHeader}>
                <h3 className={styles.riskName}>{risk.name}</h3>
                <span
                  className={`${styles.riskLevel} ${
                    risk.levelClass === "high"
                      ? styles.riskLevelHigh
                      : risk.levelClass === "medium"
                        ? styles.riskLevelMedium
                        : styles.riskLevelLow
                  }`}
                >
                  {risk.level}
                </span>
              </div>
              <p className={styles.riskDesc}>{risk.desc}</p>
              <p className={styles.riskMitigation}>
                <strong>{language === "zh" ? "缓解措施" : "Mitigation"}:</strong>{" "}
                {risk.mitigation}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  /* Scene 5: Next Steps */
  const renderNext = (sceneNum: number, beatNum: number, isEntered: boolean) => {
    const s = data.scenes[sceneNum - 1] as (typeof data.scenes)[4];
    return (
      <div className={styles.nextSteps}>
        <div className={styles.nextHeader}>
          <h2 className={styles.nextTitle}>{s.title}</h2>
          <p className={styles.nextSubtitle}>{s.subtitle}</p>
        </div>
        <div className={styles.nextItems}>
          {s.items.map((item, i) => (
            <div
              key={i}
              className={styles.nextItem}
              style={{
                opacity: isEntered && (beatNum >= 1 || i === 0) ? 1 : 0,
                transform:
                  isEntered && (beatNum >= 1 || i === 0)
                    ? "translateX(0)"
                    : "translateX(-0.8cqh)",
                transition: "opacity 0.4s ease, transform 0.4s ease",
                transitionDelay: `${i * 0.15}s`,
              }}
            >
              <div className={styles.nextNumber}>{item.num}</div>
              <div className={styles.nextContent}>
                <h3 className={styles.nextAction}>{item.action}</h3>
                <p className={styles.nextDetail}>{item.detail}</p>
                <div className={styles.nextMeta}>
                  {item.meta.map((meta, j) => (
                    <span key={j} className={styles.nextMetaItem}>
                      {meta.label}: <span>{meta.value}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className={styles.nextFooter}>
          <p className={styles.nextFooterText}>{s.footerText}</p>
          <span className={styles.nextFooterContact}>{s.footerContact}</span>
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
        return renderHeader(sceneNum, beatNum, isEntered);
      case 2:
        return renderMetrics(sceneNum, beatNum, isEntered);
      case 3:
        return renderPriorities(sceneNum, beatNum, isEntered);
      case 4:
        return renderRisks(sceneNum, beatNum, isEntered);
      case 5:
        return renderNext(sceneNum, beatNum, isEntered);
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
        axis="x"
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

export function getMetadata(lang: "en" | "zh"): StyleMetadata {
  const t = lang === "zh" ? zhMeta : enMeta;
  return {
    id: "48",
    band: "text-report",
    name: t.name,
    theme: t.theme,
    densityLabel: t.densityLabel,
    heroScene: 2,
    colors: {
      bg: "#f5ede0",
      ink: "#3d2b1a",
      panel: "#ebe0cc",
    },
    typography: {
      header: "Georgia, 'Times New Roman', serif",
      body: "Inter, system-ui, sans-serif",
    },
    tags: lang === "zh"
      ? ["物体隐喻", "主视觉", "类比", "分布式系统", "温暖材质"]
      : ["object-metaphor", "hero", "analogy", "distributed-systems", "warm-materials"],
    fonts: ["Inter", "Georgia", "cjk:Noto Sans SC"],
    scenes: [
      {
        id: 1,
        title: lang === "zh" ? "主视觉展示" : "Hero Display",
        beats: [
          { id: 0, action: "beat-0", title: lang === "zh" ? "完整主视觉" : "Full hero display" , body: "" },
        ],
      },
      {
        id: 2,
        title: lang === "zh" ? "组件拆解" : "Component Breakdown",
        beats: [
          { id: 0, action: "beat-0", title: lang === "zh" ? "前两项组件" : "First two components" , body: "" },
          { id: 1, action: "beat-1", title: lang === "zh" ? "前四项组件" : "First four components" , body: "" },
          { id: 2, action: "beat-2", title: lang === "zh" ? "全部六项组件" : "All six components" , body: "" },
        ],
      },
      {
        id: 3,
        title: lang === "zh" ? "工作流程" : "How It Works",
        beats: [
          { id: 0, action: "beat-0", title: lang === "zh" ? "前两步" : "First two steps" , body: "" },
          { id: 1, action: "beat-1", title: lang === "zh" ? "全部四步" : "All four steps" , body: "" },
        ],
      },
      {
        id: 4,
        title: lang === "zh" ? "系统映射" : "System Mapping",
        beats: [
          { id: 0, action: "beat-0", title: lang === "zh" ? "前两项映射" : "First two mappings" , body: "" },
          { id: 1, action: "beat-1", title: lang === "zh" ? "全部四项映射" : "All four mappings" , body: "" },
        ],
      },
      {
        id: 5,
        title: lang === "zh" ? "关键要点" : "Key Takeaways",
        beats: [
          { id: 0, action: "beat-0", title: lang === "zh" ? "首项要点" : "First takeaway" , body: "" },
          { id: 1, action: "beat-1", title: lang === "zh" ? "全部行动项" : "All action items" , body: "" },
        ],
      },
    ],
  };
}

const enMeta = {
  name: "Object Metaphor Hero",
  theme: "Tangible physical object as anchor for abstract system concept",
  densityLabel: "Visual",
};

const zhMeta = {
  name: "物体隐喻主视觉",
  theme: "以有形物理物体为锚点呈现抽象系统概念",
  densityLabel: "视觉",
};

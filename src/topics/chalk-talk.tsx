import React, { useEffect, useState, useCallback } from "react";
import {
  defineTopic,
  type TopicMetadata,
  type TopicStageProps,
  type TopicTransitionScore,
} from "../domain/topic";
import SpatialSceneTrack from "../components/stage/SpatialSceneTrack";
import styles from "./chalk-talk.module.css";
import { useFLIP } from "../hooks/useFLIP";

// ─── Content ────────────────────────────────────────────────────────────────

interface TodoItem {
  checked: boolean;
  text: string;
}

interface ToggleBlock {
  title: string;
  body: string;
}

interface SceneContent {
  en: {
    pageTitle?: string;
    title?: string;
    subtitle?: string;
    icon?: string;
    coverGradient?: string;
    h2?: string;
    paragraph?: string;
    h3?: string;
    bullets?: string[];
    numbered?: string[];
    codeBlock?: string;
    toggles?: ToggleBlock[];
    callout?: string;
    todos?: TodoItem[];
    tableColumns?: string[];
    tableRows?: string[][];
  };
  zh: {
    pageTitle?: string;
    title?: string;
    subtitle?: string;
    icon?: string;
    coverGradient?: string;
    h2?: string;
    paragraph?: string;
    h3?: string;
    bullets?: string[];
    numbered?: string[];
    codeBlock?: string;
    toggles?: ToggleBlock[];
    callout?: string;
    todos?: TodoItem[];
    tableColumns?: string[];
    tableRows?: string[][];
  };
}

const SCENES: Record<number, SceneContent> = {
  1: {
    en: {
      title: "The Caching Principle",
      subtitle: "Why remembering faster changes everything",
      icon: "📐",
      coverGradient: "linear-gradient(135deg, #1e3328 0%, #24382d 40%, #1a2d23 100%)",
    },
    zh: {
      title: "缓存原理",
      subtitle: "为什么更快的记忆改变一切",
      icon: "📐",
      coverGradient: "linear-gradient(135deg, #1e3328 0%, #24382d 40%, #1a2d23 100%)",
    },
  },
  2: {
    en: {
      pageTitle: "Cache Hit Rate",
      h2: "The Fundamental Formula",
      paragraph:
        "Every caching decision boils down to one number: the hit rate. It tells us what fraction of requests find the data already in memory, versus the fraction that must travel to the source. Deriving this live on the board reveals why small improvements compound dramatically.",
      h3: "Key Variables",
      bullets: [
        "hits — requests served from the cache layer",
        "misses — requests that fall through to origin",
        "total = hits + misses — the denominator",
        "latency_delta = origin_latency − cache_latency",
      ],
      numbered: [
        "Measure baseline requests per second at origin",
        "Introduce cache and instrument hit/miss counters",
        "Compute hit_rate = hits / total over a window",
        "Multiply by latency_delta to get time saved",
      ],
      codeBlock: "hit_rate = hits / (hits + misses)\ntime_saved = hit_rate * latency_delta",
    },
    zh: {
      pageTitle: "缓存命中率",
      h2: "基本公式",
      paragraph:
        "每一个缓存决策最终都归结为一个数字：命中率。它告诉我们有多少比例的请求在内存中找到了数据，而有多少比例必须回源获取。在黑板上实时推导这个公式，可以揭示为什么微小的改进会产生巨大的复合效应。",
      h3: "关键变量",
      bullets: [
        "命中次数 — 从缓存层提供服务的请求",
        "未命中次数 — 穿透到源站的请求",
        "总量 = 命中 + 未命中 — 分母",
        "延迟差 = 源站延迟 − 缓存延迟",
      ],
      numbered: [
        "测量源站的基准每秒请求数",
        "引入缓存并埋点命中/未命中计数器",
        "在时间窗口内计算 命中率 = 命中 / 总量",
        "乘以延迟差得到节省的时间",
      ],
      codeBlock: "命中率 = 命中 / (命中 + 未命中)\n节省时间 = 命中率 × 延迟差",
    },
  },
  3: {
    en: {
      pageTitle: "Eviction Strategies",
      toggles: [
        {
          title: "LRU: Least Recently Used",
          body: "When the cache fills, evict the entry that has gone untouched the longest. Intuition: if you have not looked at it recently, you probably will not need it soon. Works well for temporal locality workloads — think user sessions, recently viewed items. Cost: O(1) lookup with a doubly-linked list plus hash map.",
        },
        {
          title: "When to use what",
          body: "LRU shines when access patterns have recency bias. LFU (Least Frequently Used) wins when popularity matters more than recency — a trending article, for example. FIFO is simplest but ignores access history entirely. Choose by your dominant access pattern, not by what is easiest to implement.",
        },
      ],
    },
    zh: {
      pageTitle: "驱逐策略",
      toggles: [
        {
          title: "LRU：最近最少使用",
          body: "当缓存满时，驱逐最久未被访问的条目。直觉：如果你最近没看过它，你可能也不会很快需要它。对时间局部性工作负载效果很好——比如用户会话、最近查看的项目。成本：通过双向链表加哈希表实现 O(1) 查找。",
        },
        {
          title: "何时使用何种策略",
          body: "当访问模式存在近因偏差时，LRU 表现出色。当流行度比近因更重要时——例如热门文章——LFU（最不经常使用）胜出。FIFO 最简单但完全忽略访问历史。根据你的主导访问模式选择，而不是根据什么最容易实现。",
        },
      ],
    },
  },
  4: {
    en: {
      pageTitle: "Key Insight",
      callout:
        "Caching trades memory for latency. The hit rate is your leverage ratio — at 95% hits, you only pay origin cost for 1 request in 20.",
      todos: [
        { checked: true, text: "Define what counts as a 'hit' in your system" },
        { checked: true, text: "Instrument hit/miss counters at the cache layer" },
        { checked: false, text: "Measure latency_delta between cache and origin" },
        { checked: false, text: "Plot hit rate over time to detect drift" },
        { checked: false, text: "Choose eviction strategy matching access pattern" },
      ],
    },
    zh: {
      pageTitle: "核心洞察",
      callout: "缓存用内存换取延迟。命中率就是你的杠杆率——在 95% 命中率下，每 20 个请求中只有 1 个需要支付源站成本。",
      todos: [
        { checked: true, text: "定义系统中什么算作'命中'" },
        { checked: true, text: "在缓存层埋点命中/未命中计数器" },
        { checked: false, text: "测量缓存和源站之间的延迟差" },
        { checked: false, text: "绘制命中率随时间变化曲线以检测漂移" },
        { checked: false, text: "选择匹配访问模式的驱逐策略" },
      ],
    },
  },
  5: {
    en: {
      pageTitle: "Strategy Comparison",
      tableColumns: ["Strategy", "Best For", "Hit Rate", "Complexity"],
      tableRows: [
        ["LRU", "Temporal locality", "High", "O(1)"],
        ["LFU", "Popularity-driven", "Very High", "O(log n)"],
        ["FIFO", "Simple queues", "Medium", "O(1)"],
        ["Random", "No pattern", "Low", "O(1)"],
        ["ARC", "Mixed patterns", "Adaptive", "O(1)"],
        ["TTL-based", "Time-sensitive", "Medium", "O(1)"],
      ],
    },
    zh: {
      pageTitle: "策略对比",
      tableColumns: ["策略", "适用场景", "命中率", "复杂度"],
      tableRows: [
        ["LRU", "时间局部性", "高", "O(1)"],
        ["LFU", "流行度驱动", "极高", "O(log n)"],
        ["FIFO", "简单队列", "中等", "O(1)"],
        ["随机", "无规律", "低", "O(1)"],
        ["ARC", "混合模式", "自适应", "O(1)"],
        ["TTL 过期", "时间敏感", "中等", "O(1)"],
      ],
    },
  },
};

// ─── Sidebar Nav ────────────────────────────────────────────────────────────

interface SidebarItem {
  icon: string;
  label: { en: string; zh: string };
  scene: number | null;
  indent: number;
  isFolder?: boolean;
}

const SIDEBAR_ITEMS: SidebarItem[] = [
  { icon: "📐", label: { en: "Caching Principle", zh: "缓存原理" }, scene: 1, indent: 0 },
  { icon: "📄", label: { en: "Hit Rate Formula", zh: "命中率公式" }, scene: 2, indent: 1 },
  { icon: "📄", label: { en: "Eviction Strategies", zh: "驱逐策略" }, scene: 3, indent: 1 },
  { icon: "📄", label: { en: "Key Insight", zh: "核心洞察" }, scene: 4, indent: 1 },
  { icon: "📄", label: { en: "Strategy Comparison", zh: "策略对比" }, scene: 5, indent: 1 },
  { icon: "📂", label: { en: "Data Structures", zh: "数据结构" }, scene: null, indent: 0, isFolder: true },
  { icon: "📂", label: { en: "Distributed Systems", zh: "分布式系统" }, scene: null, indent: 0, isFolder: true },
];

// ─── Metadata ───────────────────────────────────────────────────────────────

function buildMetadata(lang: "en" | "zh"): TopicMetadata {
  const themeMap = {
    en: "Live Derivation — dark matte chalkboard with soft off-white marks, hand-drawn diagrams and worked formulas, reasoning built up stroke by stroke",
    zh: "实时推导——深色哑光黑板配柔和粉白粉笔痕迹，手绘图表和推导公式，逐笔构建推理过程",
  };
  const densityLabelMap = { en: "Reading-First", zh: "阅读优先" };

  const sceneTitles = {
    en: ["Title Board", "Formula Derivation", "Strategy Expansions", "Key Insight", "Comparison Table"],
    zh: ["标题板", "公式推导", "策略展开", "核心洞察", "对比表格"],
  };

  const beatActions = {
    en: {
      1: ["Board title appears"],
      2: ["Formula heading and setup", "Variables and steps fill in"],
      3: ["First strategy expands", "Second strategy expands"],
      4: ["Insight and checklist render"],
      5: ["Table header and first rows", "More rows appear", "Full table visible"],
    },
    zh: {
      1: ["板书标题出现"],
      2: ["公式标题和设定", "变量和步骤填充"],
      3: ["第一个策略展开", "第二个策略展开"],
      4: ["洞察和清单渲染"],
      5: ["表头和首行出现", "更多行出现", "完整表格显示"],
    },
  };

  const BEAT_COUNTS: Record<number, number> = {
    1: 1,
    2: 2,
    3: 2,
    4: 1,
    5: 3,
  };

  const scenes = [1, 2, 3, 4, 5].map((id) => {
    const beatCount = BEAT_COUNTS[id];
    const actions = beatActions[lang][id as keyof (typeof beatActions)["en"]];
    const c = SCENES[id][lang];

    const beats = Array.from({ length: beatCount }, (_, beatIdx) => {
      let beatTitle = "";
      let beatBody = "";

      if (id === 1) {
        beatTitle = c.title || "";
        beatBody = c.subtitle || "";
      } else if (id === 2) {
        beatTitle = c.pageTitle || "";
        if (beatIdx === 0) {
          beatBody = `${c.h2}: ${(c.paragraph || "").slice(0, 80)}...`;
        } else {
          beatBody = (c.bullets || []).slice(0, 2).map((b) => b.slice(0, 40)).join(" / ");
        }
      } else if (id === 3) {
        beatTitle = c.pageTitle || "";
        const visibleToggles = (c.toggles || []).slice(0, beatIdx + 1);
        beatBody = visibleToggles.map((t) => t.title).join(" / ");
      } else if (id === 4) {
        beatTitle = c.pageTitle || "";
        beatBody = (c.callout || "").slice(0, 80);
      } else if (id === 5) {
        beatTitle = c.pageTitle || "";
        const visibleRows = (c.tableRows || []).slice(0, (beatIdx + 1) * 2);
        beatBody = visibleRows.map((r) => r[0]).join(" / ");
      }

      return {
        id: beatIdx,
        action: actions[beatIdx],
        title: beatTitle,
        body: beatBody,
      };
    });

    return {
      id,
      title: sceneTitles[lang][id - 1],
      beats,
    };
  });

  return {
    theme: themeMap[lang],
    densityLabel: densityLabelMap[lang],
    heroScene: 2,
    colors: {
      bg: "#1e3328",
      ink: "#f0ebe0",
      panel: "#24382d",
    },
    typography: {
      header: "Caveat 400 (hand) / Inter 300 (notation)",
      body: "Inter 300",
    },
    tags: ["chalk", "blackboard", "hand-drawn", "teaching", "derivation", "formula", "educational", "matte", "live-reasoning", "chalk-dust"],
    fonts: ["Inter", "Caveat"],
    scenes,
  };
}

// ─── Transition constants ─────────────────────────────────────────────────

// ─── Component ──────────────────────────────────────────────────────────────

const BEAT_LAYOUT_MODES = {
  2: "motion",
  3: "motion",
  5: "motion",
} satisfies Record<number, "motion" | "reserved">;

const TRANSITION_SCORE = {
  "1->2": "hard-cut",
  "2->3": "hard-cut",
  "3->4": "hard-cut",
  "4->5": "hard-cut",
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

  // FLIP for blocks container — when new blocks appear, existing ones shift
  const { ref: blocksRef } = useFLIP<HTMLDivElement>({
    watch: [beat],
    duration: 350,
    easing: "cubic-bezier(0.16, 1, 0.3, 1)",
    selector: ".notionBlock",
  });

  // Font injection
  useEffect(() => {
    const FONT_ID = "chalk-talk-fonts-inter-caveat";
    if (document.getElementById(FONT_ID)) return;
    const link = document.createElement("link");
    link.id = FONT_ID;
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Caveat:wght@400;500;600&display=swap";
    document.head.appendChild(link);
  }, []);

  useEffect(() => {
    setEntered(false);
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setEntered(true);
      });
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

  // ── Sidebar ──────────────────────────────────────────────────────────────

  const renderSidebar = (isTransitioning: boolean) => {
    return (
      <aside
        className={[
          styles.sidebar,
          isTransitioning && !reducedMotion ? styles.sidebarPulse : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <div className={styles.sidebarHeader}>
          <span className={styles.sidebarWorkspaceIcon}>⬡</span>
          <span className={styles.sidebarWorkspaceName}>
            {language === "zh" ? "板书讲堂" : "Board Sessions"}
          </span>
        </div>
        <div className={styles.sidebarSearch}>
          <span className={styles.sidebarSearchIcon}>🔍</span>
          <span className={styles.sidebarSearchPlaceholder}>
            {language === "zh" ? "搜索..." : "Search..."}
          </span>
        </div>
        <nav className={styles.sidebarNav} aria-label="Page navigation">
          {SIDEBAR_ITEMS.map((item, i) => {
            const isActive = item.scene === scene;
            const clickable = item.scene !== null && !isThumbnail;
            return (
              <div
                key={i}
                className={[
                  styles.sidebarItem,
                  isActive ? styles.sidebarItemActive : "",
                  item.indent > 0 ? styles.sidebarItemIndented : "",
                  item.isFolder ? styles.sidebarItemFolder : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                style={{
                  opacity: entered ? 1 : 0,
                  transform: entered ? "none" : "translateX(-1cqw)",
                  transition: reducedMotion
                    ? "none"
                    : `opacity 0.3s ease ${i * 0.05}s, transform 0.3s ease ${i * 0.05}s`,
                  cursor: clickable ? "pointer" : "default",
                }}
                onClick={clickable ? (e) => handleNavClick(e, item.scene!) : undefined}
                role={clickable ? "button" : undefined}
                tabIndex={clickable ? 0 : undefined}
              >
                <span className={styles.sidebarItemIcon}>{item.icon}</span>
                <span className={styles.sidebarItemLabel}>{item.label[language]}</span>
              </div>
            );
          })}
        </nav>
      </aside>
    );
  };

  // ── Scene 1: Cover Page ──────────────────────────────────────────────────

  const renderScene1 = (forceEntered = false) => {
    const c = SCENES[1][language];
    const effEntered = forceEntered || entered;
    return (
      <div className={styles.coverPage}>
        <div
          className={styles.coverImage}
          style={{ background: c.coverGradient }}
        >
          <div className={styles.coverPattern} />
        </div>
        <div className={styles.coverContent}>
          <div
            className={`${styles.coverIcon} notionBlock`}
            style={{
              opacity: effEntered ? 1 : 0,
              transform: effEntered ? "translateY(0)" : "translateY(1cqh)",
              transition: reducedMotion ? "none" : "opacity 0.5s ease 0.2s, transform 0.5s ease 0.2s",
            }}
          >
            {c.icon}
          </div>
          <h1
            className={`${styles.coverTitle} notionBlock`}
            style={{
              opacity: effEntered ? 1 : 0,
              transform: effEntered ? "translateY(0)" : "translateY(1cqh)",
              transition: reducedMotion ? "none" : "opacity 0.5s ease 0.35s, transform 0.5s ease 0.35s",
            }}
          >
            {c.title}
          </h1>
          <p
            className={`${styles.coverSubtitle} notionBlock`}
            style={{
              opacity: effEntered ? 1 : 0,
              transition: reducedMotion ? "none" : "opacity 0.5s ease 0.5s",
            }}
          >
            {c.subtitle}
          </p>
          <div
            className={`${styles.coverMeta} notionBlock`}
            style={{
              opacity: effEntered ? 1 : 0,
              transition: reducedMotion ? "none" : "opacity 0.5s ease 0.65s",
            }}
          >
            <span className={styles.coverMetaItem}>
              <span className={styles.coverMetaIcon}>📝</span>
              {language === "zh" ? "5 个推导" : "5 derivations"}
            </span>
            <span className={styles.coverMetaItem}>
              <span className={styles.coverMetaIcon}>📐</span>
              {language === "zh" ? "12 个公式" : "12 formulas"}
            </span>
            <span className={styles.coverMetaItem}>
              <span className={styles.coverMetaIcon}>🕐</span>
              {language === "zh" ? "最近更新 今天" : "Last updated today"}
            </span>
          </div>
        </div>
      </div>
    );
  };

  // ── Scene 2: Content Blocks ──────────────────────────────────────────────

  const renderScene2 = (forceEntered = false, overrideBeat?: number) => {
    const c = SCENES[2][language];
    const effEntered = forceEntered || entered;
    const effBeat = overrideBeat !== undefined ? overrideBeat : beat;
    const showLists = effBeat >= 1;

    return (
      <div className={styles.docPage}>
        <div className={styles.pageHeader}>
          <span className={styles.pageIcon}>📄</span>
          <h1 className={styles.pageTitle}>{c.pageTitle}</h1>
        </div>

        <div ref={blocksRef} className={styles.blocksContainer}>
          {/* H2 */}
          <h2
            className={`${styles.blockH2} notionBlock`}
            style={{
              opacity: effEntered ? 1 : 0,
              transform: effEntered ? "none" : "translateY(0.8cqh)",
              transition: reducedMotion ? "none" : "opacity 0.4s ease 0.1s, transform 0.4s ease 0.1s",
            }}
          >
            {c.h2}
          </h2>

          {/* Paragraph */}
          <p
            className={`${styles.blockParagraph} notionBlock`}
            style={{
              opacity: effEntered ? 1 : 0,
              transform: effEntered ? "none" : "translateY(0.8cqh)",
              transition: reducedMotion ? "none" : "opacity 0.4s ease 0.2s, transform 0.4s ease 0.2s",
            }}
          >
            {c.paragraph}
          </p>

          {/* H3 */}
          <h3
            className={`${styles.blockH3} notionBlock`}
            style={{
              opacity: effEntered ? 1 : 0,
              transform: effEntered ? "none" : "translateY(0.8cqh)",
              transition: reducedMotion ? "none" : "opacity 0.4s ease 0.3s, transform 0.4s ease 0.3s",
            }}
          >
            {c.h3}
          </h3>

          {/* Bullet List */}
          {showLists && (
            <ul
              className={`${styles.blockBulletList} notionBlock`}
              style={{
                opacity: effEntered ? 1 : 0,
                transition: reducedMotion ? "none" : "opacity 0.4s ease 0.1s",
              }}
            >
              {(c.bullets || []).map((item, i) => (
                <li
                  key={i}
                  className={styles.blockBulletItem}
                  style={{
                    opacity: effEntered ? 1 : 0,
                    transform: effEntered ? "none" : "translateX(-0.5cqw)",
                    transition: reducedMotion
                      ? "none"
                      : `opacity 0.3s ease ${0.15 + i * 0.06}s, transform 0.3s ease ${0.15 + i * 0.06}s`,
                  }}
                >
                  <span className={styles.bulletDot}>•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          )}

          {/* Numbered List */}
          {showLists && (
            <ol
              className={`${styles.blockNumberedList} notionBlock`}
              style={{
                opacity: effEntered ? 1 : 0,
                transition: reducedMotion ? "none" : "opacity 0.4s ease 0.3s",
              }}
            >
              {(c.numbered || []).map((item, i) => (
                <li
                  key={i}
                  className={styles.blockNumberedItem}
                  style={{
                    opacity: effEntered ? 1 : 0,
                    transform: effEntered ? "none" : "translateX(-0.5cqw)",
                    transition: reducedMotion
                      ? "none"
                      : `opacity 0.3s ease ${0.35 + i * 0.06}s, transform 0.3s ease ${0.35 + i * 0.06}s`,
                  }}
                >
                  <span className={styles.numberedIndex}>{i + 1}.</span>
                  <span>{item}</span>
                </li>
              ))}
            </ol>
          )}

          {/* Code Block */}
          {showLists && (
            <div
              className={`${styles.blockCode} notionBlock`}
              style={{
                opacity: effEntered ? 1 : 0,
                transform: effEntered ? "none" : "translateY(0.8cqh)",
                transition: reducedMotion ? "none" : "opacity 0.4s ease 0.6s, transform 0.4s ease 0.6s",
              }}
            >
              <div className={styles.codeHeader}>
                <span className={styles.codeLang}>
                  {language === "zh" ? "公式" : "formula"}
                </span>
                <span className={styles.codeCopy}>
                  {language === "zh" ? "复制" : "Copy"}
                </span>
              </div>
              <pre className={styles.codeBody}>
                <code>{c.codeBlock}</code>
              </pre>
            </div>
          )}
        </div>
      </div>
    );
  };

  // ── Scene 3: Toggle Sections ─────────────────────────────────────────────

  const renderScene3 = (forceEntered = false, overrideBeat?: number) => {
    const c = SCENES[3][language];
    const toggles = c.toggles || [];
    const effEntered = forceEntered || entered;
    const effBeat = overrideBeat !== undefined ? overrideBeat : beat;

    return (
      <div className={styles.docPage}>
        <div className={styles.pageHeader}>
          <span className={styles.pageIcon}>🏗️</span>
          <h1 className={styles.pageTitle}>{c.pageTitle}</h1>
        </div>

        <div ref={blocksRef} className={styles.blocksContainer}>
          {toggles.map((toggle, i) => {
            const isOpen = effBeat >= i;
            return (
              <div
                key={i}
                className={`${styles.toggleBlock} notionBlock`}
                style={{
                  opacity: effEntered ? 1 : 0,
                  transition: reducedMotion ? "none" : `opacity 0.4s ease ${i * 0.15}s`,
                }}
              >
                <div
                  className={styles.toggleHeader}
                  onClick={!isThumbnail ? (e) => e.stopPropagation() : undefined}
                  style={{ cursor: isThumbnail ? "default" : "pointer" }}
                >
                  <span
                    className={styles.toggleArrow}
                    style={{
                      transform: isOpen ? "rotate(90deg)" : "rotate(0deg)",
                      transition: reducedMotion ? "none" : "transform 0.25s ease",
                    }}
                  >
                    ▶
                  </span>
                  <span className={styles.toggleTitle}>{toggle.title}</span>
                </div>
                <div
                  className={styles.toggleBody}
                  style={{
                    maxHeight: isOpen ? "30cqh" : "0",
                    opacity: isOpen ? 1 : 0,
                    transition: reducedMotion
                      ? "none"
                      : "max-height 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease",
                  }}
                >
                  <p className={styles.toggleBodyText}>{toggle.body}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // ── Scene 4: Callout & Todo ──────────────────────────────────────────────

  const renderScene4 = (forceEntered = false) => {
    const c = SCENES[4][language];
    const effEntered = forceEntered || entered;

    return (
      <div className={styles.docPage}>
        <div className={styles.pageHeader}>
          <span className={styles.pageIcon}>🎯</span>
          <h1 className={styles.pageTitle}>{c.pageTitle}</h1>
        </div>

        <div ref={blocksRef} className={styles.blocksContainer}>
          {/* Callout */}
          <div
            className={`${styles.calloutBlock} notionBlock`}
            style={{
              opacity: effEntered ? 1 : 0,
              transform: effEntered ? "none" : "translateY(0.8cqh)",
              transition: reducedMotion ? "none" : "opacity 0.4s ease 0.1s, transform 0.4s ease 0.1s",
            }}
          >
            <span className={styles.calloutIcon}>💡</span>
            <p className={styles.calloutText}>{c.callout}</p>
          </div>

          {/* Divider */}
          <div
            className={`${styles.blockDivider} notionBlock`}
            style={{
              opacity: effEntered ? 1 : 0,
              transition: reducedMotion ? "none" : "opacity 0.4s ease 0.25s",
            }}
          />

          {/* Todo List */}
          <div className={styles.todoList}>
            <h3
              className={`${styles.todoHeading} notionBlock`}
              style={{
                opacity: effEntered ? 1 : 0,
                transition: reducedMotion ? "none" : "opacity 0.4s ease 0.3s",
              }}
            >
              {language === "zh" ? "理解清单" : "Checklist"}
            </h3>
            {(c.todos || []).map((todo, i) => (
              <div
                key={i}
                className={`${styles.todoItem} notionBlock`}
                style={{
                  opacity: effEntered ? 1 : 0,
                  transform: effEntered ? "none" : "translateX(-0.5cqw)",
                  transition: reducedMotion
                    ? "none"
                    : `opacity 0.3s ease ${0.35 + i * 0.07}s, transform 0.3s ease ${0.35 + i * 0.07}s`,
                }}
              >
                <div
                  className={[
                    styles.todoCheckbox,
                    todo.checked ? styles.todoChecked : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  onClick={!isThumbnail ? (e) => e.stopPropagation() : undefined}
                >
                  {todo.checked && <span className={styles.todoCheckmark}>✓</span>}
                </div>
                <span
                  className={[
                    styles.todoText,
                    todo.checked ? styles.todoTextDone : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  {todo.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // ── Scene 5: Table View ──────────────────────────────────────────────────

  const renderScene5 = (forceEntered = false, overrideBeat?: number) => {
    const c = SCENES[5][language];
    const columns = c.tableColumns || [];
    const rows = c.tableRows || [];
    const effEntered = forceEntered || entered;
    const effBeat = overrideBeat !== undefined ? overrideBeat : beat;
    const visibleCount = Math.min(rows.length, (effBeat + 1) * 2);

    return (
      <div className={styles.docPage}>
        <div className={styles.pageHeader}>
          <span className={styles.pageIcon}>👥</span>
          <h1 className={styles.pageTitle}>{c.pageTitle}</h1>
        </div>

        <div ref={blocksRef} className={styles.blocksContainer}>
          <div
            className={`${styles.tableWrapper} notionBlock`}
            style={{
              opacity: effEntered ? 1 : 0,
              transition: reducedMotion ? "none" : "opacity 0.4s ease 0.1s",
            }}
          >
            <div className={styles.tableToolbar}>
              <span className={styles.tableCount}>
                {rows.length} {language === "zh" ? "种策略" : "strategies"}
              </span>
              <div className={styles.tableActions}>
                <span className={styles.tableActionBtn}>🔍</span>
                <span className={styles.tableActionBtn}>⚙️</span>
              </div>
            </div>
            <table className={styles.notionTable}>
              <thead>
                <tr>
                  {columns.map((col, i) => (
                    <th
                      key={i}
                      className={styles.tableHeader}
                      style={{
                        opacity: effEntered ? 1 : 0,
                        transition: reducedMotion
                          ? "none"
                          : `opacity 0.3s ease ${0.15 + i * 0.05}s`,
                      }}
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.slice(0, visibleCount).map((row, ri) => (
                  <tr
                    key={ri}
                    className={ri % 2 === 1 ? styles.tableRowAlt : ""}
                    style={{
                      opacity: effEntered ? 1 : 0,
                      transform: effEntered ? "none" : "translateY(0.5cqh)",
                      transition: reducedMotion
                        ? "none"
                        : `opacity 0.3s ease ${0.2 + ri * 0.06}s, transform 0.3s ease ${0.2 + ri * 0.06}s`,
                    }}
                  >
                    {row.map((cell, ci) => (
                      <td key={ci} className={styles.tableCell}>
                        {ci === 3 ? (
                          <span
                            className={[
                              styles.statusBadge,
                              cell === "Active" || cell === "在职"
                                ? styles.statusActive
                                : styles.statusOoo,
                            ]
                              .filter(Boolean)
                              .join(" ")}
                          >
                            {cell}
                          </span>
                        ) : ci === 0 ? (
                          <span className={styles.tableName}>
                            <span className={styles.tableAvatar}>
                              {cell.charAt(0)}
                            </span>
                            {cell}
                          </span>
                        ) : (
                          cell
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // ── Scene Router ─────────────────────────────────────────────────────────

  const renderSceneFor = (
    sceneNum: number,
    beatNum: number,
    forceEntered = false,
  ) => {
    switch (sceneNum) {
      case 1:
        return renderScene1(forceEntered);
      case 2:
        return renderScene2(forceEntered, beatNum);
      case 3:
        return renderScene3(forceEntered, beatNum);
      case 4:
        return renderScene4(forceEntered);
      case 5:
        return renderScene5(forceEntered, beatNum);
      default:
        return null;
    }
  };

  // ── Navigation Dots ──────────────────────────────────────────────────────

  const renderNavDots = () => {
    if (isThumbnail) return null;

    return (
      <nav
        className={styles.navDots}
        aria-label="Scene navigation"
        data-topic-navigation="true"
        data-navigation-geometry="spatial-node"
        data-navigation-carrier="chalk-talk-scene-dots"
        data-navigation-invocation="persistent"
        data-navigation-feedback="active-glow"
      >
        {[1, 2, 3, 4, 5].map((s) => {
          const isActive = s === scene;
          return (
            <button
              key={s}
              type="button"
              className={[
                styles.navDot,
                isActive ? styles.navDotActive : "",
              ]
                .filter(Boolean)
                .join(" ")}
              aria-label={`Jump to scene ${s}`}
              onClick={(e) => handleNavClick(e, s)}
              style={reducedMotion ? { transitionDuration: "0s" } : undefined}
            />
          );
        })}
      </nav>
    );
  };

  // ── Layer classes ────────────────────────────────────────────────────────

  return (
    <div
      data-testid="chalk-talk-root"
      className={rootClasses}
    >
      <div className={styles.layout}>
        {renderSidebar(false)}

        <div className={styles.contentWrapper}>
                <SpatialSceneTrack
        scene={scene}
        beat={beat}
        transitionKind="hard-cut"
        transitionMap={TRANSITION_SCORE}
        reducedMotion={reducedMotion || isThumbnail}
        beatLayoutModes={BEAT_LAYOUT_MODES}
        renderScene={(sceneId, sceneBeat, isActive) => (
          <div className={styles.sceneLayer}>
            {renderSceneFor(sceneId, sceneBeat, isActive ? entered : true)}
          </div>
        )}
      />
        </div>
      </div>
      {renderNavDots()}
    </div>
  );
}

const metadata = {
  en: buildMetadata("en"),
  zh: buildMetadata("zh"),
};

export default defineTopic({
  id: "chalk-talk",
  styleId: "blackboard-chalk-talk",
  title: { en: "Chalk Talk", zh: "粉笔推导" },
  modelId: "Doubao-Seed-Evolving",
  Stage: TopicStage,
  metadata,
  navigation: {
    geometry: "spatial-node",
    carrier: "chalk-talk-scene-dots",
    invocation: "persistent",
    feedback: "active-glow",
  },
  transitionScore: TRANSITION_SCORE,
  evidence: {
    kind: "illustrative",
    boundary: {
      en: "Illustrative caching walkthrough: cache behavior, hit rates, and strategy comparisons are presentation examples rather than production measurements.",
      zh: "示例缓存讲解：缓存行为、命中率和策略比较均为演示内容，并非生产环境测量结果。",
    },
    display: "envelope",
  },
});

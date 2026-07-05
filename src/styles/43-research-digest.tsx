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
      digestTitle: "AI Research Survey",
      subtitle: "Quarterly Digest of Key Advances in Artificial Intelligence",
      edition: "Vol. 3, No. 2 — Q2 2026",
      scope: "Covering 47 papers from NeurIPS, ICML, ICLR, and ACL",
      compiledBy: "Compiled by the Research Intelligence Team",
      topics: ["Language Models", "Computer Vision", "Robotics", "Theory"],
    },
    zh: {
      digestTitle: "人工智能研究综述",
      subtitle: "人工智能关键进展季度文摘",
      edition: "第3卷 第2期 — 2026年第二季度",
      scope: "涵盖 NeurIPS、ICML、ICLR 和 ACL 的 47 篇论文",
      compiledBy: "研究情报团队 编制",
      topics: ["语言模型", "计算机视觉", "机器人学", "理论"],
    },
  },
  2: {
    en: {
      title: "Featured Paper",
      paper: {
        title:
          "Scaling Laws for Neural Language Models: A Comprehensive Empirical Study",
        authors: "Zhang, L., Chen, H., Park, J., & Williams, R.T.",
        affiliation: "Stanford University / DeepMind",
        venue: "NeurIPS 2025",
        track: "Oral Presentation",
        citations: 847,
        tags: ["LLMs", "Scaling Laws", "Empirical Study", "Transformers"],
        abstract:
          "We present a comprehensive empirical study of scaling laws across 200+ language model configurations ranging from 10M to 500B parameters, trained on a curated corpus of 15 trillion tokens. Our findings challenge several prevailing assumptions in the field: (1) the relationship between compute and performance is sublinear beyond 100B parameters, with diminishing returns setting in at approximately 70B; (2) data quality, measured by perplexity on a held-out evaluation suite, exhibits a stronger correlation with downstream performance than data quantity for models above 10B parameters; and (3) architectural choices, particularly attention mechanism design and positional encoding schemes, account for 15-20% of performance variance at equivalent compute budgets. We introduce a revised scaling law formulation that incorporates data quality metrics and architectural factors, achieving R²=0.94 on held-out configurations.",
        pages: "pp. 1–18",
        references: 67,
      },
    },
    zh: {
      title: "精选论文",
      paper: {
        title: "神经语言模型的缩放定律：综合实证研究",
        authors: "张丽、陈浩、朴俊浩、R.T. 威廉姆斯",
        affiliation: "斯坦福大学 / DeepMind",
        venue: "NeurIPS 2025",
        track: "口头报告",
        citations: 847,
        tags: ["大语言模型", "缩放定律", "实证研究", "Transformer"],
        abstract:
          "我们对 200 多种语言模型配置（从 10M 到 500B 参数，在 15 万亿 token 的精选语料库上训练）进行了缩放定律的综合实证研究。我们的发现挑战了该领域几个普遍假设：(1) 在超过 100B 参数后，计算量与性能之间的关系呈次线性，收益递减大约始于 70B；(2) 对于超过 10B 参数的模型，以留出评估套件上的困惑度衡量的数据质量与下游性能的相关性强于数据数量；(3) 架构选择，特别是注意力机制设计和位置编码方案，在等效计算预算下占性能方差的 15-20%。我们引入了一个修订的缩放定律公式，纳入数据质量指标和架构因素，在留出配置上达到 R²=0.94。",
        pages: "第1-18页",
        references: 67,
      },
    },
  },
  3: {
    en: {
      title: "Citation Network",
      subtitle: "Interconnected research landscape across 47 surveyed papers",
      papers: [
        {
          id: 1,
          short: "Zhang et al.",
          title: "Scaling Laws for Neural LMs",
          year: 2025,
          citations: 847,
          cluster: "LLM",
          x: 35,
          y: 30,
        },
        {
          id: 2,
          short: "Park & Kim",
          title: "Efficient Attention Mechanisms",
          year: 2025,
          citations: 412,
          cluster: "LLM",
          x: 22,
          y: 52,
        },
        {
          id: 3,
          short: "Liu et al.",
          title: "Vision-Language Pretraining",
          year: 2025,
          citations: 623,
          cluster: "Vision",
          x: 65,
          y: 25,
        },
        {
          id: 4,
          short: "Garcia et al.",
          title: "Robotic Manipulation Benchmarks",
          year: 2024,
          citations: 298,
          cluster: "Robotics",
          x: 75,
          y: 60,
        },
        {
          id: 5,
          short: "Wang & Jordan",
          title: "Theoretical Limits of SGD",
          year: 2025,
          citations: 156,
          cluster: "Theory",
          x: 50,
          y: 72,
        },
        {
          id: 6,
          short: "Chen et al.",
          title: "Retrieval-Augmented Generation",
          year: 2024,
          citations: 1089,
          cluster: "LLM",
          x: 45,
          y: 45,
        },
        {
          id: 7,
          short: "Nakamura et al.",
          title: "Diffusion Model Analysis",
          year: 2025,
          citations: 534,
          cluster: "Vision",
          x: 78,
          y: 38,
        },
      ],
      connections: [
        [1, 2],
        [1, 6],
        [2, 6],
        [3, 7],
        [3, 1],
        [4, 2],
        [5, 1],
        [5, 6],
        [7, 6],
        [3, 6],
      ],
    },
    zh: {
      title: "引用网络",
      subtitle: "47 篇调研论文的互联研究图谱",
      papers: [
        {
          id: 1,
          short: "张等",
          title: "神经语言模型缩放定律",
          year: 2025,
          citations: 847,
          cluster: "LLM",
          x: 35,
          y: 30,
        },
        {
          id: 2,
          short: "朴、金",
          title: "高效注意力机制",
          year: 2025,
          citations: 412,
          cluster: "LLM",
          x: 22,
          y: 52,
        },
        {
          id: 3,
          short: "刘等",
          title: "视觉-语言预训练",
          year: 2025,
          citations: 623,
          cluster: "Vision",
          x: 65,
          y: 25,
        },
        {
          id: 4,
          short: "加西亚等",
          title: "机器人操作基准测试",
          year: 2024,
          citations: 298,
          cluster: "Robotics",
          x: 75,
          y: 60,
        },
        {
          id: 5,
          short: "王、乔丹",
          title: "SGD 的理论极限",
          year: 2025,
          citations: 156,
          cluster: "Theory",
          x: 50,
          y: 72,
        },
        {
          id: 6,
          short: "陈等",
          title: "检索增强生成",
          year: 2024,
          citations: 1089,
          cluster: "LLM",
          x: 45,
          y: 45,
        },
        {
          id: 7,
          short: "中村等",
          title: "扩散模型分析",
          year: 2025,
          citations: 534,
          cluster: "Vision",
          x: 78,
          y: 38,
        },
      ],
      connections: [
        [1, 2],
        [1, 6],
        [2, 6],
        [3, 7],
        [3, 1],
        [4, 2],
        [5, 1],
        [5, 6],
        [7, 6],
        [3, 6],
      ],
    },
  },
  4: {
    en: {
      title: "Keyword Analysis",
      subtitle: "Most frequent research topics across the survey",
      keywords: [
        { term: "Large Language Models", count: 23, size: "xl" },
        { term: "Transformers", count: 19, size: "xl" },
        { term: "Reinforcement Learning", count: 15, size: "lg" },
        { term: "Diffusion Models", count: 12, size: "lg" },
        { term: "Vision-Language", count: 11, size: "lg" },
        { term: "Scaling Laws", count: 9, size: "md" },
        { term: "Robotics", count: 8, size: "md" },
        { term: "Optimization", count: 7, size: "md" },
        { term: "Retrieval", count: 6, size: "sm" },
        { term: "Alignment", count: 6, size: "sm" },
        { term: "Few-shot Learning", count: 5, size: "sm" },
        { term: "Graph Neural Networks", count: 4, size: "sm" },
        { term: "Causality", count: 3, size: "xs" },
        { term: "Neuro-Symbolic", count: 2, size: "xs" },
      ],
    },
    zh: {
      title: "关键词分析",
      subtitle: "调研中最频繁的研究主题",
      keywords: [
        { term: "大语言模型", count: 23, size: "xl" },
        { term: "Transformer", count: 19, size: "xl" },
        { term: "强化学习", count: 15, size: "lg" },
        { term: "扩散模型", count: 12, size: "lg" },
        { term: "视觉-语言", count: 11, size: "lg" },
        { term: "缩放定律", count: 9, size: "md" },
        { term: "机器人学", count: 8, size: "md" },
        { term: "优化", count: 7, size: "md" },
        { term: "检索", count: 6, size: "sm" },
        { term: "对齐", count: 6, size: "sm" },
        { term: "少样本学习", count: 5, size: "sm" },
        { term: "图神经网络", count: 4, size: "sm" },
        { term: "因果推断", count: 3, size: "xs" },
        { term: "神经符号", count: 2, size: "xs" },
      ],
    },
  },
  5: {
    en: {
      title: "Survey Statistics",
      subtitle: "Q2 2026 Research Landscape at a Glance",
      stats: [
        { label: "Papers Surveyed", value: "47", sub: "across 4 major venues" },
        { label: "Total Citations", value: "12,847", sub: "cumulative impact" },
        {
          label: "Avg. Citations/Paper",
          value: "273",
          sub: "weighted by recency",
        },
        { label: "Institutions", value: "89", sub: "from 24 countries" },
        { label: "Top Venue", value: "NeurIPS", sub: "18 papers (38%)" },
        {
          label: "Emerging Topic",
          value: "Alignment",
          sub: "+340% YoY growth",
        },
      ],
    },
    zh: {
      title: "综述统计",
      subtitle: "2026年第二季度研究格局一览",
      stats: [
        { label: "调研论文", value: "47", sub: "覆盖 4 大会议" },
        { label: "总引用数", value: "12,847", sub: "累计影响力" },
        { label: "篇均引用", value: "273", sub: "按时间加权" },
        { label: "参与机构", value: "89", sub: "来自 24 个国家" },
        { label: "最多会议", value: "NeurIPS", sub: "18 篇 (38%)" },
        { label: "新兴方向", value: "对齐", sub: "同比增长 +340%" },
      ],
    },
  },
};

// ─── Metadata ───────────────────────────────────────────────────────────────

export function getMetadata(lang: "en" | "zh"): StyleMetadata {
  const nameMap = { en: "Research Digest", zh: "研究文摘" };
  const themeMap = {
    en: "AI Research Survey — academic abstract compilation with citation network and keyword analysis",
    zh: "AI 研究综述——学术文摘汇编，含引用网络和关键词分析",
  };
  const densityLabelMap = { en: "Reading-First", zh: "阅读优先" };

  const sceneTitles = {
    en: ["Cover", "Featured Paper", "Citation Network", "Keywords", "Statistics"],
    zh: ["封面", "精选论文", "引用网络", "关键词", "统计"],
  };

  const beatActions = {
    en: {
      1: ["Digest cover revealed"],
      2: ["Paper metadata appears", "Full abstract revealed"],
      3: ["Network nodes appear", "Connections drawn", "Labels and details"],
      4: ["Keyword cloud forms", "Tag sizes differentiated"],
      5: ["Statistics panel"],
    },
    zh: {
      1: ["文摘封面呈现"],
      2: ["论文元数据出现", "完整摘要揭示"],
      3: ["网络节点出现", "连线绘制", "标签和详情"],
      4: ["关键词云形成", "标签大小区分"],
      5: ["统计面板"],
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
    colors: { bg: "#fafaf7", ink: "#2d2d2d", panel: "#f0ede8" },
    typography: { header: "Georgia 700", body: "Inter 400" },
    tags: [
      "research",
      "academic",
      "digest",
      "abstract",
      "citations",
      "ai",
      "survey",
      "scholarly",
    ],
    fonts: ["Georgia", "Inter"],
    scenes,
  };
}

// ─── Component ──────────────────────────────────────────────────────────────

const CLUSTER_COLORS: Record<string, string> = {
  LLM: "#6366f1",
  Vision: "#10b981",
  Robotics: "#f59e0b",
  Theory: "#ef4444",
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
  const [outgoingScene, setOutgoingScene] = useState<number | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const prevSceneRef = useRef(scene);

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

  /* Scene-to-scene transition detection */
  useLayoutEffect(() => {
    if (reducedMotion) {
      prevSceneRef.current = scene;
      return;
    }
    if (prevSceneRef.current !== scene) {
      const prev = prevSceneRef.current;
      setOutgoingScene(prev);
      setIsTransitioning(true);
      const timer = setTimeout(() => {
        setOutgoingScene(null);
        setIsTransitioning(false);
      }, TRANSITION_DURATION);
      prevSceneRef.current = scene;
      return () => clearTimeout(timer);
    }
  }, [scene, reducedMotion]);

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
      en: ["Cover", "Paper", "Network", "Keywords", "Stats"],
      zh: ["封面", "论文", "网络", "关键词", "统计"],
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

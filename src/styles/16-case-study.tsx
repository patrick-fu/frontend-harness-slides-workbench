import React, { useLayoutEffect, useEffect, useState, useCallback, useRef } from "react";
import type { BespokeStyleProps, StyleMetadata } from "../types";
import styles from "./16-case-study.module.css";
import { useFLIP } from "../hooks/useFLIP";

// ─── Font Injection ────────────────────────────────────────────────────────

function useFonts() {
  useEffect(() => {
    const id = "style-16-fonts";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&display=swap";
    document.head.appendChild(link);
  }, []);
}

// ─── Content ────────────────────────────────────────────────────────────────

const SCENES = {
  1: {
    en: {
      industry: "E-commerce / Retail",
      customer: "Globex Corporation",
      logo: "G",
      eyebrow: "Case Study",
      title: "How Globex",
      titleAccent: "tripled",
      title2: "conversion in 90 days",
      sub: "A deep dive into the challenges, solutions, and measurable outcomes of our partnership with one of the fastest-growing retailers in APAC.",
    },
    zh: {
      industry: "电商 / 零售",
      customer: "Globex 公司",
      logo: "G",
      eyebrow: "案例研究",
      title: "Globex 如何在",
      titleAccent: "90 天内",
      title2: "转化率翻三倍",
      sub: "深入探讨我们与亚太地区增长最快零售商之一合作中面临的挑战、解决方案和可衡量成果。",
    },
  },
  2: {
    en: {
      label: "The Challenge",
      title: "The Problem",
      quote: "Our checkout was losing us millions. Every extra second cost us customers, and we couldn't figure out why.",
      authorName: "Sarah Chen",
      authorRole: "VP of Engineering, Globex",
      authorInitials: "SC",
      points: [
        { icon: "⚠️", title: "Slow Checkout", desc: "Average 8.2s load time on mobile, 43% abandonment rate" },
        { icon: "🔍", title: "Poor Discoverability", desc: "Users couldn't find products — search returned irrelevant results" },
        { icon: "📱", title: "Fragmented Experience", desc: "Desktop and mobile felt like completely different products" },
      ],
    },
    zh: {
      label: "挑战",
      title: "问题所在",
      quote: "我们的结账流程让我们损失了数百万。每多一秒都在流失客户，而我们找不到原因。",
      authorName: "陈莎拉",
      authorRole: "Globex 工程副总裁",
      authorInitials: "SC",
      points: [
        { icon: "⚠️", title: "结账缓慢", desc: "移动端平均加载 8.2 秒，放弃率 43%" },
        { icon: "🔍", title: "可发现性差", desc: "用户找不到产品——搜索返回不相关结果" },
        { icon: "📱", title: "体验碎片化", desc: "桌面端和移动端感觉像完全不同的产品" },
      ],
    },
  },
  3: {
    en: {
      label: "Our Approach",
      title: "The Solution",
      before: [
        { icon: "✕", text: "Monolithic checkout flow" },
        { icon: "✕", text: "Keyword-only search" },
        { icon: "✕", text: "Separate codebases per platform" },
        { icon: "✕", text: "No personalization" },
      ],
      after: [
        { icon: "✓", text: "Headless commerce with edge rendering" },
        { icon: "✓", text: "Semantic search with AI embeddings" },
        { icon: "✓", text: "Unified design system, responsive" },
        { icon: "✓", text: "Real-time personalization engine" },
      ],
    },
    zh: {
      label: "我们的方案",
      title: "解决方案",
      before: [
        { icon: "✕", text: "单体式结账流程" },
        { icon: "✕", text: "仅关键词搜索" },
        { icon: "✕", text: "每个平台独立代码库" },
        { icon: "✕", text: "无个性化" },
      ],
      after: [
        { icon: "✓", text: "边缘渲染的无头商务" },
        { icon: "✓", text: "AI 嵌入语义搜索" },
        { icon: "✓", text: "统一设计系统，响应式" },
        { icon: "✓", text: "实时个性化引擎" },
      ],
    },
  },
  4: {
    en: {
      label: "Measurable Impact",
      title: "The Results",
      metrics: [
        { value: "312", unit: "%", label: "Conversion Lift", desc: "from 1.8% to 7.4%" },
        { value: "68", unit: "%", label: "Faster Checkout", desc: "8.2s → 2.6s average" },
        { value: "2.4", unit: "M", label: "Revenue Added", desc: "in first 90 days post-launch" },
      ],
      quote: "The team didn't just deliver features — they fundamentally changed how our customers experience our brand.",
      quoteAttr: "— Sarah Chen, VP of Engineering",
    },
    zh: {
      label: "可衡量的影响",
      title: "成果",
      metrics: [
        { value: "312", unit: "%", label: "转化率提升", desc: "从 1.8% 到 7.4%" },
        { value: "68", unit: "%", label: "结账提速", desc: "平均 8.2s → 2.6s" },
        { value: "240", unit: "万", label: "新增收入", desc: "上线后前 90 天" },
      ],
      quote: "团队不只是交付功能——他们从根本上改变了客户体验我们品牌的方式。",
      quoteAttr: "——陈莎拉，工程副总裁",
    },
  },
  5: {
    en: {
      text: "Results that <em>speak</em> for themselves.",
      sub: "Ready to write your own success story? Let's talk about what's possible.",
      cta: "Start a Conversation",
    },
    zh: {
      text: "成果<em>不言自明</em>。",
      sub: "准备好书写你自己的成功故事了吗？让我们聊聊可能性。",
      cta: "开启对话",
    },
  },
};

// ─── Metadata ───────────────────────────────────────────────────────────────

export function getMetadata(lang: "en" | "zh"): StyleMetadata {
  const nameMap = { en: "Case Study", zh: "案例研究" };
  const themeMap = {
    en: "Customer success story — Problem → Solution → Results with before/after panels, big metric callouts, and Playfair Display quote blocks",
    zh: "客户成功案例——问题 → 解决方案 → 成果，前后对比面板、大数字指标和 Playfair Display 引言块",
  };
  const densityLabelMap = { en: "Narrative", zh: "叙事型" };

  const sceneTitles = {
    en: ["Title", "Problem", "Solution", "Results", "Closing"],
    zh: ["标题", "问题", "解决方案", "成果", "结语"],
  };

  const beatActions = {
    en: {
      1: ["Customer logo and title appear"],
      2: ["Quote and author appear", "Problem points 1-2 reveal", "Problem point 3 reveals"],
      3: ["Title appears", "Before/after panels reveal"],
      4: ["Title appears", "Metric cards animate in", "Quote fades in"],
      5: ["Closing statement and CTA appear"],
    },
    zh: {
      1: ["客户 Logo 和标题呈现"],
      2: ["引言和作者呈现", "问题点 1-2 揭示", "问题点 3 揭示"],
      3: ["标题呈现", "前后对比面板揭示"],
      4: ["标题呈现", "指标卡片动画进入", "引言淡入"],
      5: ["结语和 CTA 呈现"],
    },
  };

  const BEAT_COUNTS: Record<number, number> = { 1: 1, 2: 3, 3: 2, 4: 3, 5: 1 };

  const scenes = [1, 2, 3, 4, 5].map((id) => {
    const beatCount = BEAT_COUNTS[id];
    const actions = beatActions[lang][id as keyof (typeof beatActions)["en"]];
    const c = SCENES[id as keyof typeof SCENES][lang] as any;

    const beats = Array.from({ length: beatCount }, (_, beatIdx) => {
      let beatTitle = "";
      let beatBody = "";

      if (id === 1) {
        beatTitle = `${c.title} ${c.titleAccent} ${c.title2}`;
        beatBody = c.sub;
      } else if (id === 2) {
        beatTitle = c.title;
        if (beatIdx === 0) beatBody = c.quote.slice(0, 60) + "...";
        else if (beatIdx >= 1) {
          const pts = (c.points as Array<{ title: string }>) || [];
          const visible = Math.min(beatIdx + 1, 3);
          beatBody = pts.slice(0, visible).map((p) => p.title).join(" / ");
        }
      } else if (id === 3) {
        beatTitle = c.title;
        if (beatIdx >= 1) {
          beatBody = lang === "en" ? "Before vs After comparison shown" : "展示前后对比";
        }
      } else if (id === 4) {
        beatTitle = c.title;
        if (beatIdx >= 1) {
          const metrics = (c.metrics as Array<{ value: string; unit: string; label: string }>) || [];
          const visible = Math.min(beatIdx, 3);
          beatBody = metrics.slice(0, visible).map((m) => `${m.value}${m.unit} ${m.label}`).join(" / ");
        }
      } else if (id === 5) {
        beatTitle = c.text.replace(/<[^>]+>/g, "");
        beatBody = c.sub;
      }

      return { id: beatIdx, action: actions[beatIdx], title: beatTitle, body: beatBody };
    });

    return { id, title: sceneTitles[lang][id - 1], beats };
  });

  return {
    id: "16",
    band: "balanced-hybrid",
    name: nameMap[lang],
    theme: themeMap[lang],
    densityLabel: densityLabelMap[lang],
    heroScene: 4,
    colors: { bg: "#ffffff", ink: "#1a202c", panel: "#f7fafc" },
    typography: { header: "Playfair Display 700", body: "Inter 400" },
    tags: ["case-study", "customer", "results", "before-after", "metrics", "quote", "narrative", "serif", "testimonial", "success"],
    fonts: ["Inter", "Playfair Display"],
    scenes,
  };
}

// ─── Transition constants ─────────────────────────────────────────────────

const TRANSITION_DURATION = 500; // 450ms animation + buffer
const BEAT_COUNTS: Record<number, number> = { 1: 1, 2: 3, 3: 2, 4: 3, 5: 1 };

// ─── Component ──────────────────────────────────────────────────────────────

export default function CaseStudy({
  scene, beat, language, isThumbnail, reducedMotion, onNavigate, isTransitionClone,
}: BespokeStyleProps) {
  useFonts();

  const [outgoingScene, setOutgoingScene] = useState<number | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const prevSceneRef = useRef<number>(scene);
  const [entered, setEntered] = useState(false);

  // Detect scene changes and manage transition lifecycle
  useLayoutEffect(() => {
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

  // Beat-level "entered" state for current scene — triggers CSS reveals
  useEffect(() => {
    setEntered(false);
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => setEntered(true));
    });
    return () => cancelAnimationFrame(id);
  }, [scene]);

  // FLIP for problem points list (scene 2) — when new points push layout
  const { ref: problemPointsRef } = useFLIP<HTMLDivElement>({
    watch: [beat],
    duration: 400,
    easing: "cubic-bezier(0.16, 1, 0.3, 1)",
  });

  const handleNavClick = useCallback(
    (e: React.MouseEvent, targetScene: number) => {
      e.stopPropagation();
      onNavigate?.(targetScene, 0);
    },
    [onNavigate],
  );

  const rootClasses = [styles.root, reducedMotion ? styles.reducedMotion : "", isThumbnail ? styles.thumbnail : ""].filter(Boolean).join(" ");

  // ── Render scene content for a given scene number ────────────────────────

  const renderSceneFor = (sceneNum: number, beatNum: number, isEntered: boolean) => {
    const langKey = language as keyof typeof SCENES[1];

    if (sceneNum === 1) {
      const c = SCENES[1][langKey];
      return (
        <div className={styles.scene1}>
          <div className={styles.caseCustomer}>
            <div className={styles.customerLogo}>{c.logo}</div>
            <div className={styles.customerInfo}>
              <span className={styles.customerIndustry}>{c.industry}</span>
              <span className={styles.customerName}>{c.customer}</span>
            </div>
          </div>
          <span className={styles.caseEyebrow}>{c.eyebrow}</span>
          <h1 className={styles.caseTitle}>
            {c.title} <em>{c.titleAccent}</em> {c.title2}
          </h1>
          <p className={styles.caseSub}>{c.sub}</p>
        </div>
      );
    }

    if (sceneNum === 2) {
      const c = SCENES[2][langKey];
      const points = c.points as Array<{ icon: string; title: string; desc: string }>;
      return (
        <div className={styles.scene2}>
          <span className={styles.sectionLabel}>{c.label}</span>
          <h2 className={styles.sectionTitle}>{c.title}</h2>
          <div className={styles.problemArea}>
            <div className={styles.problemQuote}>
              <p className={styles.quoteText}>{c.quote}</p>
              <div className={styles.quoteAuthor}>
                <div className={styles.quoteAvatar}>{c.authorInitials}</div>
                <div className={styles.quoteAuthorInfo}>
                  <span className={styles.quoteAuthorName}>{c.authorName}</span>
                  <span className={styles.quoteAuthorRole}>{c.authorRole}</span>
                </div>
              </div>
            </div>
            <div ref={sceneNum === scene ? problemPointsRef : undefined} className={styles.problemPoints}>
              {points.map((p, i) => {
                const visible = beatNum >= i;
                const cls = [styles.problemPoint, visible && isEntered ? styles.problemPointVisible : ""].filter(Boolean).join(" ");
                return (
                  <div
                    key={i}
                    className={cls}
                    style={reducedMotion ? { opacity: visible ? 1 : 0, transform: "none" } : { transitionDelay: `${i * 0.12}s` }}
                  >
                    <div className={styles.problemIcon}>{p.icon}</div>
                    <div className={styles.problemText}>
                      <span className={styles.problemPointTitle}>{p.title}</span>
                      <span className={styles.problemPointDesc}>{p.desc}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      );
    }

    if (sceneNum === 3) {
      const c = SCENES[3][langKey];
      const before = c.before as Array<{ icon: string; text: string }>;
      const after = c.after as Array<{ icon: string; text: string }>;
      const panelsVisible = beatNum >= 1;
      return (
        <div className={styles.scene3}>
          <span className={styles.sectionLabel}>{c.label}</span>
          <h2 className={styles.sectionTitle}>{c.title}</h2>
          <div className={styles.solutionArea}>
            <div
              className={[styles.solutionBefore, panelsVisible && isEntered ? styles.solutionBeforeVisible : ""].filter(Boolean).join(" ")}
              style={reducedMotion ? { opacity: panelsVisible ? 1 : 0, transform: "none" } : undefined}
            >
              <div className={styles.solutionPanelHeader}>
                {language === "zh" ? "之前" : "Before"}
              </div>
              <div className={styles.solutionPanelBody}>
                {before.map((item, i) => (
                  <div key={i} className={styles.solutionItem}>
                    <span className={styles.solutionItemIcon}>{item.icon}</span>
                    {item.text}
                  </div>
                ))}
              </div>
            </div>
            <div
              className={[styles.solutionAfter, panelsVisible && isEntered ? styles.solutionAfterVisible : ""].filter(Boolean).join(" ")}
              style={reducedMotion ? { opacity: panelsVisible ? 1 : 0, transform: "none" } : { transitionDelay: "0.15s" }}
            >
              <div className={styles.solutionPanelHeader}>
                {language === "zh" ? "之后" : "After"}
              </div>
              <div className={styles.solutionPanelBody}>
                {after.map((item, i) => (
                  <div key={i} className={styles.solutionItem}>
                    <span className={styles.solutionItemIcon}>{item.icon}</span>
                    {item.text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (sceneNum === 4) {
      const c = SCENES[4][langKey];
      const metrics = c.metrics as Array<{ value: string; unit: string; label: string; desc: string }>;
      const quoteVisible = beatNum >= 2;
      return (
        <div className={styles.scene4}>
          <span className={styles.sectionLabel}>{c.label}</span>
          <h2 className={styles.sectionTitle}>{c.title}</h2>
          <div className={styles.resultsArea}>
            <div className={styles.metricsRow}>
              {metrics.map((m, i) => {
                const visible = beatNum >= 1;
                const cls = [styles.metricCard, visible && isEntered ? styles.metricCardVisible : ""].filter(Boolean).join(" ");
                return (
                  <div
                    key={i}
                    className={cls}
                    style={reducedMotion ? { opacity: visible ? 1 : 0, transform: "none" } : { transitionDelay: `${i * 0.15}s` }}
                  >
                    <span className={styles.metricValue}>
                      {m.value}
                      <span className={styles.metricUnit}>{m.unit}</span>
                    </span>
                    <span className={styles.metricLabel}>{m.label}</span>
                    <span className={styles.metricDesc}>{m.desc}</span>
                  </div>
                );
              })}
            </div>
            <div
              className={[styles.resultsQuote, quoteVisible && isEntered ? styles.resultsQuoteVisible : ""].filter(Boolean).join(" ")}
              style={reducedMotion ? { opacity: quoteVisible ? 1 : 0, transform: "none" } : undefined}
            >
              <p className={styles.resultsQuoteText}>{c.quote}</p>
              <span className={styles.resultsQuoteAttr}>{c.quoteAttr}</span>
            </div>
          </div>
        </div>
      );
    }

    if (sceneNum === 5) {
      const c = SCENES[5][langKey];
      return (
        <div className={styles.scene5}>
          <h2 className={styles.closingCase} dangerouslySetInnerHTML={{ __html: c.text }} />
          <p className={styles.closingCaseSub}>{c.sub}</p>
          <button type="button" className={styles.closingCTA} onClick={(e) => { if (!isThumbnail) e.stopPropagation(); }}>
            {c.cta}
            <svg width="1.5cqw" height="1.5cqh" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      );
    }

    return null;
  };

  const renderNav = () => {
    if (isThumbnail) return null;
    return (
      <nav className={styles.navDots} aria-label="Scene navigation">
        {[1, 2, 3, 4, 5].map((s) => {
          const isActive = s === scene;
          return (
            <button
              key={s}
              type="button"
              className={[styles.navDot, isActive ? styles.navDotActive : ""].filter(Boolean).join(" ")}
              aria-label={`Jump to scene ${s}`}
              onClick={(e) => handleNavClick(e, s)}
            />
          );
        })}
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
    <div className={rootClasses}>
      {/* Outgoing scene (exit animation) */}
      {outgoingScene !== null && (
        <div className={outgoingLayerClasses}>
          <div className={styles.track}>
            {renderSceneFor(outgoingScene, BEAT_COUNTS[outgoingScene] - 1, true)}
          </div>
        </div>
      )}

      {/* Incoming / current scene */}
      <div className={incomingLayerClasses}>
        <div className={styles.track}>
          {renderSceneFor(scene, beat, entered)}
        </div>
      </div>

      {renderNav()}
    </div>
  );
}

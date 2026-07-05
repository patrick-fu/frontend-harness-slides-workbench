import { useState, useLayoutEffect, useEffect, useCallback, useRef } from "react";
import type { BespokeStyleProps, StyleMetadata } from "../types";
import styles from "./48-executive-summary.module.css";

/* ── Transition constants ──────────────────────────────────────────────── */

const TRANSITION_DURATION = 850; // ms — outgoing 250ms + incoming 600ms
const BEAT_COUNTS: Record<number, number> = { 1: 1, 2: 3, 3: 2, 4: 2, 5: 2 };

/* ── Content ─────────────────────────────────────────────────────────────── */

const SCENES = {
  en: {
    scenes: [
      {
        id: "header",
        label: "Header",
        icon: "📋",
        company: "Nexus Technologies Inc.",
        companySub: "NASDAQ: NEXS",
        date: "Q3 FY2025\nBusiness Review",
        type: "Executive Summary · One-Pager",
        title: "Q3 Business",
        titleEm: "Review",
        tagline: "Accelerated growth, disciplined execution, and strategic clarity",
        prepared: "Prepared for the Board of Directors",
        author: "by the Office of the CEO",
      },
      {
        id: "metrics",
        label: "Metrics",
        icon: "📊",
        title: "Key Performance Metrics",
        subtitle: "Q3 FY2025 vs. Q3 FY2024",
        metrics: [
          {
            label: "Revenue",
            value: "$842",
            unit: "M",
            change: "+18.4%",
            changeDir: "up",
            sub: "YoY growth",
          },
          {
            label: "Operating Margin",
            value: "23.4",
            unit: "%",
            change: "+2.1pp",
            changeDir: "up",
            sub: "vs. 21.3% prior year",
          },
          {
            label: "ARR",
            value: "$3.42",
            unit: "B",
            change: "+27%",
            changeDir: "up",
            sub: "Annual Recurring Revenue",
          },
          {
            label: "Customers",
            value: "14,800",
            unit: "",
            change: "+1,240",
            changeDir: "up",
            sub: "net new in Q3",
          },
          {
            label: "NDR",
            value: "118",
            unit: "%",
            change: "+3pp",
            changeDir: "up",
            sub: "Net Dollar Retention",
          },
          {
            label: "Headcount",
            value: "3,842",
            unit: "",
            change: "+218",
            changeDir: "up",
            sub: "Q3 net additions",
          },
        ],
      },
      {
        id: "priorities",
        label: "Priorities",
        icon: "🎯",
        title: "Strategic Priorities",
        subtitle: "Four pillars driving Q4 and FY2026 planning",
        items: [
          {
            icon: "🤖",
            title: "AI Platform Leadership",
            desc: "Launch Nexus AI Platform v2.0 with multi-modal support. Target 50,000 enterprise developers by end of FY26. $45M incremental R&D investment approved.",
            owner: "Owner: P. Raman, CTO",
          },
          {
            icon: "🌍",
            title: "International Expansion",
            desc: "Enter 3 new markets (Japan, Brazil, UAE) with localized product offerings. Establish regional HQ in Tokyo. Target 35% international revenue mix by FY26.",
            owner: "Owner: M. Alvarez, COO",
          },
          {
            icon: "🔒",
            title: "Security & Trust",
            desc: "Achieve SOC 2 Type II and ISO 27001 certification. Complete zero-trust architecture rollout. Security investment increased 40% YoY.",
            owner: "Owner: CISO Office",
          },
          {
            icon: "💎",
            title: "Customer Experience",
            desc: "Reduce onboarding time by 60% through self-service automation. Launch customer success program for top 200 accounts. CSAT target: 4.6/5.0.",
            owner: "Owner: J. Thornton, CEO",
          },
        ],
      },
      {
        id: "risks",
        label: "Risks",
        icon: "⚠️",
        title: "Risk Overview",
        subtitle: "Key risks and mitigation status",
        risks: [
          {
            name: "Competitive Pressure",
            level: "High",
            levelClass: "high",
            desc: "Major cloud providers accelerating AI platform investments. Pricing pressure in mid-market segment observed since Q2.",
            mitigation: "Differentiation via developer experience and open ecosystem. Enterprise security features.",
          },
          {
            name: "Talent Retention",
            level: "Medium",
            levelClass: "medium",
            desc: "AI/ML engineering talent market remains highly competitive. Attrition in research team reached 12% annualized in Q3.",
            mitigation: "Enhanced equity refresh program. Research sabbatical policy. Internal mobility framework.",
          },
          {
            name: "Regulatory Uncertainty",
            level: "Medium",
            levelClass: "medium",
            desc: "Evolving AI regulation across US, EU, and APAC. Data sovereignty requirements expanding in key markets.",
            mitigation: "Regulatory affairs team expanded. Active engagement in standards bodies. Modular architecture for compliance.",
          },
          {
            name: "Supply Chain",
            level: "Low",
            levelClass: "low",
            desc: "GPU availability improving but lead times remain extended. Diversification across three chip vendors in progress.",
            mitigation: "Multi-vendor strategy. Reserved capacity agreements. Software optimization for heterogeneous compute.",
          },
        ],
      },
      {
        id: "next",
        label: "Next Steps",
        icon: "🚀",
        title: "Next Steps & Milestones",
        subtitle: "Immediate actions for Q4 FY2025",
        items: [
          {
            num: "1",
            action: "Launch AI Platform v2.0",
            detail: "GA release scheduled for October 15 with multi-modal inference, fine-tuning API, and enterprise SLA guarantees. Marketing campaign budget: $8M.",
            meta: [
              { label: "Owner", value: "P. Raman" },
              { label: "Date", value: "Oct 15" },
            ],
          },
          {
            num: "2",
            action: "Close FY2025 Budget Planning",
            detail: "Finalize departmental budgets and headcount plans. Board approval targeted for October 30 meeting. Revenue guidance: $3.8B (+22%).",
            meta: [
              { label: "Owner", value: "D. Chen" },
              { label: "Date", value: "Oct 30" },
            ],
          },
          {
            num: "3",
            action: "Tokyo Office Opening",
            detail: "Ribbon-cutting ceremony November 5. Initial team of 45 across engineering, sales, and customer success. Japan market entry plan approved.",
            meta: [
              { label: "Owner", value: "M. Alvarez" },
              { label: "Date", value: "Nov 5" },
            ],
          },
        ],
        footerText: "Full Q3 report and data room available on request.",
        footerContact: "Questions? ir@nexustech.com",
      },
    ],
  },
  zh: {
    scenes: [
      {
        id: "header",
        label: "标题",
        icon: "📋",
        company: "联科科技股份有限公司",
        companySub: "纳斯达克: NEXS",
        date: "2025财年Q3\n业务回顾",
        type: "执行摘要 · 单页概览",
        title: "Q3业务",
        titleEm: "回顾",
        tagline: "加速增长、精准执行、战略清晰",
        prepared: "呈交董事会",
        author: "CEO办公室编制",
      },
      {
        id: "metrics",
        label: "指标",
        icon: "📊",
        title: "关键绩效指标",
        subtitle: "FY2025 Q3 对比 FY2024 Q3",
        metrics: [
          {
            label: "营收",
            value: "$8.42",
            unit: "亿",
            change: "+18.4%",
            changeDir: "up",
            sub: "同比增长",
          },
          {
            label: "营业利润率",
            value: "23.4",
            unit: "%",
            change: "+2.1pp",
            changeDir: "up",
            sub: "去年同期21.3%",
          },
          {
            label: "ARR",
            value: "$34.2",
            unit: "亿",
            change: "+27%",
            changeDir: "up",
            sub: "年度经常性收入",
          },
          {
            label: "客户数",
            value: "14,800",
            unit: "",
            change: "+1,240",
            changeDir: "up",
            sub: "Q3净增",
          },
          {
            label: "NDR",
            value: "118",
            unit: "%",
            change: "+3pp",
            changeDir: "up",
            sub: "净美元留存率",
          },
          {
            label: "员工数",
            value: "3,842",
            unit: "",
            change: "+218",
            changeDir: "up",
            sub: "Q3净增",
          },
        ],
      },
      {
        id: "priorities",
        label: "战略",
        icon: "🎯",
        title: "战略重点",
        subtitle: "驱动Q4和FY2026规划的四大支柱",
        items: [
          {
            icon: "🤖",
            title: "AI平台领先",
            desc: "推出Nexus AI Platform v2.0，支持多模态。目标FY26年底企业开发者达5万。已批准4500万美元增量研发投资。",
            owner: "负责人：CTO 普里亚·拉曼",
          },
          {
            icon: "🌍",
            title: "国际扩张",
            desc: "进入3个新市场（日本、巴西、阿联酋），推出本地化产品。在东京设立区域总部。目标FY26国际收入占比35%。",
            owner: "负责人：COO 玛丽亚·阿尔瓦雷斯",
          },
          {
            icon: "🔒",
            title: "安全与信任",
            desc: "获得SOC 2 Type II和ISO 27001认证。完成零信任架构部署。安全投资同比增长40%。",
            owner: "负责人：CISO办公室",
          },
          {
            icon: "💎",
            title: "客户体验",
            desc: "通过自助服务自动化将上线时间减少60%。为前200大客户推出客户成功计划。CSAT目标：4.6/5.0。",
            owner: "负责人：CEO 詹姆斯·桑顿",
          },
        ],
      },
      {
        id: "risks",
        label: "风险",
        icon: "⚠️",
        title: "风险概览",
        subtitle: "关键风险和缓解状态",
        risks: [
          {
            name: "竞争压力",
            level: "高",
            levelClass: "high",
            desc: "主要云厂商加速AI平台投资。自Q2以来中端市场定价压力显现。",
            mitigation: "通过开发者体验和开放生态差异化。企业级安全功能。",
          },
          {
            name: "人才保留",
            level: "中",
            levelClass: "medium",
            desc: "AI/ML工程人才市场竞争激烈。Q3研究团队年化流失率达12%。",
            mitigation: "增强股权刷新计划。研究学术休假政策。内部流动框架。",
          },
          {
            name: "监管不确定性",
            level: "中",
            levelClass: "medium",
            desc: "美国、欧盟和亚太AI法规持续演变。主要市场数据主权要求不断扩展。",
            mitigation: "扩大监管事务团队。积极参与标准制定。合规模块化架构。",
          },
          {
            name: "供应链",
            level: "低",
            levelClass: "low",
            desc: "GPU供应改善但交付周期仍较长。三家芯片厂商多元化进行中。",
            mitigation: "多厂商策略。预留产能协议。异构计算软件优化。",
          },
        ],
      },
      {
        id: "next",
        label: "行动",
        icon: "🚀",
        title: "下一步与里程碑",
        subtitle: "FY2025 Q4立即行动",
        items: [
          {
            num: "1",
            action: "发布AI Platform v2.0",
            detail: "GA发布定于10月15日，含多模态推理、微调API和企业SLA保障。营销预算：800万美元。",
            meta: [
              { label: "负责人", value: "拉曼" },
              { label: "日期", value: "10月15日" },
            ],
          },
          {
            num: "2",
            action: "完成FY2025预算规划",
            detail: "最终确定部门预算和人员计划。目标10月30日董事会批准。营收指引：38亿美元（+22%）。",
            meta: [
              { label: "负责人", value: "陈大伟" },
              { label: "日期", value: "10月30日" },
            ],
          },
          {
            num: "3",
            action: "东京办公室开业",
            detail: "11月5日剪彩仪式。初期45人团队，涵盖工程、销售和客户成功。日本市场进入计划已批准。",
            meta: [
              { label: "负责人", value: "阿尔瓦雷斯" },
              { label: "日期", value: "11月5日" },
            ],
          },
        ],
        footerText: "完整Q3报告和数据室备索。",
        footerContact: "垂询请至：ir@nexustech.com",
      },
    ],
  },
} as const;

/* ── Component ───────────────────────────────────────────────────────────── */

export default function ExecutiveSummary({
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
      {/* Outgoing scene (typewriter exit) */}
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
    id: "48",
    band: "text-report",
    name: t.name,
    theme: t.theme,
    densityLabel: t.densityLabel,
    heroScene: 2,
    colors: {
      bg: "#ffffff",
      ink: "#0f172a",
      panel: "#f8fafc",
    },
    typography: {
      header: "Inter, system-ui, sans-serif",
      body: "Inter, system-ui, sans-serif",
    },
    tags: lang === "zh"
      ? ["执行摘要", "KPI", "业务回顾", "一页纸"]
      : ["executive-summary", "KPI", "business-review", "one-pager"],
    fonts: ["Inter", "cjk:Noto Sans SC"],
    scenes: [
      {
        id: 1,
        title: lang === "zh" ? "标题页" : "Title Page",
        beats: [
          { id: 0, action: "beat-0", title: lang === "zh" ? "完整标题" : "Full title page" , body: "" },
        ],
      },
      {
        id: 2,
        title: lang === "zh" ? "关键指标" : "Key Metrics",
        beats: [
          { id: 0, action: "beat-0", title: lang === "zh" ? "前两项指标" : "First two metrics" , body: "" },
          { id: 1, action: "beat-1", title: lang === "zh" ? "前四项指标" : "First four metrics" , body: "" },
          { id: 2, action: "beat-2", title: lang === "zh" ? "全部六项指标" : "All six metrics" , body: "" },
        ],
      },
      {
        id: 3,
        title: lang === "zh" ? "战略重点" : "Strategic Priorities",
        beats: [
          { id: 0, action: "beat-0", title: lang === "zh" ? "前两项" : "First two priorities" , body: "" },
          { id: 1, action: "beat-1", title: lang === "zh" ? "全部四项" : "All four priorities" , body: "" },
        ],
      },
      {
        id: 4,
        title: lang === "zh" ? "风险概览" : "Risk Overview",
        beats: [
          { id: 0, action: "beat-0", title: lang === "zh" ? "前两项风险" : "First two risks" , body: "" },
          { id: 1, action: "beat-1", title: lang === "zh" ? "全部四项风险" : "All four risks" , body: "" },
        ],
      },
      {
        id: 5,
        title: lang === "zh" ? "下一步" : "Next Steps",
        beats: [
          { id: 0, action: "beat-0", title: lang === "zh" ? "首项行动" : "First action item" , body: "" },
          { id: 1, action: "beat-1", title: lang === "zh" ? "全部行动项" : "All action items" , body: "" },
        ],
      },
    ],
  };
}

const enMeta = {
  name: "Executive Summary",
  theme: "One-pager business review with KPIs and strategic priorities",
  densityLabel: "Scannable",
};

const zhMeta = {
  name: "执行摘要",
  theme: "含KPI和战略重点的单页业务回顾",
  densityLabel: "易读",
};

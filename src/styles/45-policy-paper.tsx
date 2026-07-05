import { useState, useEffect, useCallback } from "react";
import type { BespokeStyleProps, StyleMetadata } from "../types";
import styles from "./45-policy-paper.module.css";

/* ── Content ─────────────────────────────────────────────────────────────── */

const SCENES = {
  en: {
    scenes: [
      {
        id: "title",
        label: "Title",
        icon: "📄",
        series: "Policy Research Series · No. 2025-03",
        title: "Data Privacy",
        titleEm: "in the Age of",
        titleSuffix: "Generative AI",
        subtitle:
          "A Regulatory Framework Proposal for Balancing Innovation and Consumer Protection",
        meta: [
          { label: "Author", value: "Dr. Eleanor Whitfield" },
          { label: "Affiliation", value: "Center for Digital Governance" },
          { label: "Date", value: "March 2025" },
          { label: "Classification", value: "Public Discussion Draft" },
        ],
      },
      {
        id: "summary",
        label: "Summary",
        icon: "📊",
        execLabel: "Executive Summary",
        title: "Why We Need a New Approach to Data Privacy",
        paras: [
          "The rapid proliferation of generative AI systems has fundamentally altered the data privacy landscape. Traditional regulatory frameworks, designed for an era of structured databases and explicit consent mechanisms, are increasingly inadequate to address the challenges posed by foundation models trained on vast, unstructured corpora of personal data.",
          "This paper proposes a tiered regulatory architecture that distinguishes between general-purpose AI systems and domain-specific applications, establishing proportional obligations calibrated to risk level. Drawing on comparative analysis of GDPR, CCPA, and emerging AI-specific regulations in the EU and China, we identify critical regulatory gaps and propose targeted interventions.",
        ],
        keyPointsLabel: "Key Takeaways",
        keyPoints: [
          "Current consent mechanisms fail in the context of foundation model training",
          "Risk-tiered regulation outperforms blanket approaches in effectiveness",
          "Data minimization principles require redefinition for AI training pipelines",
          "Cross-border data governance demands new multilateral coordination frameworks",
        ],
      },
      {
        id: "recommendations",
        label: "Recommendations",
        icon: "🎯",
        title: "Policy Recommendations",
        subtitle: "Five actionable proposals for legislative reform",
        recs: [
          {
            num: "1",
            heading: "Establish a Data Training Registry",
            text: "Mandate that developers of general-purpose AI systems above a compute threshold maintain a publicly accessible registry of training data sources, with particular attention to personally identifiable information. The registry should include data provenance, collection methods, and opt-out mechanisms.",
            priority: "Critical",
            priorityClass: "high",
          },
          {
            num: "2",
            heading: "Create Algorithmic Impact Assessments",
            text: "Require organizations deploying high-risk AI systems to conduct and publish algorithmic impact assessments before deployment, evaluating privacy risks, bias potential, and societal impact. Assessments must be independently audited every 24 months.",
            priority: "High",
            priorityClass: "high",
          },
          {
            num: "3",
            heading: "Implement Data Portability 2.0",
            text: "Extend existing data portability rights to include AI-generated inferences and profiles about individuals. Users should be able to export, correct, or delete not just their raw data but also the derived representations that AI systems maintain about them.",
            priority: "High",
            priorityClass: "high",
          },
          {
            num: "4",
            heading: "Fund Privacy-Preserving Research",
            text: "Allocate 3% of federal AI research funding to privacy-preserving computation techniques, including federated learning, differential privacy, and secure multi-party computation. Establish a national center of excellence for privacy technology.",
            priority: "Medium",
            priorityClass: "medium",
          },
          {
            num: "5",
            heading: "Harmonize International Standards",
            text: "Pursue bilateral and multilateral agreements on AI data governance to prevent regulatory arbitrage. Prioritize alignment with the EU AI Act and UK AI Regulation, while advocating for developing-nation inclusion in standard-setting bodies.",
            priority: "Medium",
            priorityClass: "medium",
          },
        ],
      },
      {
        id: "evidence",
        label: "Evidence",
        icon: "🔬",
        title: "Evidence Base",
        subtitle: "Research foundations and supporting analysis",
        paras: [
          'Our analysis draws on a comprehensive review of 147 regulatory filings, 42 academic studies, and interviews with 23 privacy professionals across 11 jurisdictions. The empirical foundation is anchored in the FTC\'s 2024 Privacy Report¹, which documented a 340% increase in consumer complaints related to AI-driven data practices since 2021.',
          "Econometric modeling² indicates that risk-tiered regulation could reduce compliance costs for small and medium enterprises by an estimated 42% compared to a uniform framework, while maintaining equivalent consumer protection outcomes. This finding is robust across three regulatory cost scenarios.",
          "Comparative analysis of the EU AI Act³ and sector-specific approaches in financial services and healthcare reveals that horizontal frameworks with vertical carve-outs achieve the best balance of regulatory clarity and adaptive capacity. Our proposed architecture synthesizes insights from both paradigms.",
        ],
        footnotesLabel: "References",
        footnotes: [
          {
            mark: "1",
            text: "Federal Trade Commission, \"Annual Privacy Report 2024,\" FTC Bureau of Consumer Protection, Washington DC, 2024.",
          },
          {
            mark: "2",
            text: "Chen, L. & Whitfield, E., \"The Cost of Privacy Regulation: A Heterogeneous Analysis,\" Journal of Law and Economics, vol. 67, no. 1, 2025.",
          },
          {
            mark: "3",
            text: "European Commission, \"Regulation on Artificial Intelligence (AI Act),\" COM(2024) 265 final, Brussels, 2024.",
          },
        ],
      },
      {
        id: "roadmap",
        label: "Roadmap",
        icon: "🗺️",
        title: "Implementation Roadmap",
        subtitle: "Phased approach over 36 months",
        phases: [
          {
            label: "Phase 1",
            title: "Foundation & Consultation",
            timeline: "Months 1–12",
            items: [
              "Establish inter-agency working group",
              "Public consultation on white paper",
              "Draft regulatory framework v1.0",
              "Pilot registry with 5 major AI labs",
            ],
          },
          {
            label: "Phase 2",
            title: "Legislation & Pilots",
            timeline: "Months 13–24",
            items: [
              "Introduce legislation in Congress",
              "Launch full data training registry",
              "Pilot impact assessment program",
              "Fund privacy research centers",
            ],
          },
          {
            label: "Phase 3",
            title: "Full Implementation",
            timeline: "Months 25–36",
            items: [
              "Enforcement authority activated",
              "International agreements in force",
              "First compliance cycle complete",
              "Post-implementation review",
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
        icon: "📄",
        series: "政策研究系列 · 第2025-03号",
        title: "生成式AI时代的",
        titleEm: "数据隐私",
        titleSuffix: "监管框架",
        subtitle: "平衡创新与消费者保护的监管框架提案",
        meta: [
          { label: "作者", value: "埃莉诺·惠特菲尔德博士" },
          { label: "机构", value: "数字治理研究中心" },
          { label: "日期", value: "2025年3月" },
          { label: "分类", value: "公开讨论稿" },
        ],
      },
      {
        id: "summary",
        label: "摘要",
        icon: "📊",
        execLabel: "执行摘要",
        title: "为何我们需要新的数据隐私方案",
        paras: [
          "生成式AI系统的快速普及从根本上改变了数据隐私格局。为结构化数据库和明确同意机制设计的传统监管框架，越来越难以应对基于海量非结构化个人数据训练的基础模型所带来的挑战。",
          "本文提出一种分层监管架构，区分通用AI系统和特定领域应用，建立与风险水平相匹配的比例义务。通过对GDPR、CCPA以及欧盟和中国新兴AI专项法规的比较分析，我们识别出关键监管缺口并提出针对性干预措施。",
        ],
        keyPointsLabel: "核心要点",
        keyPoints: [
          "当前同意机制在基础模型训练场景下失效",
          "风险分层监管优于一刀切方案",
          "数据最小化原则需针对AI训练重新定义",
          "跨境数据治理需要新的多边协调框架",
        ],
      },
      {
        id: "recommendations",
        label: "建议",
        icon: "🎯",
        title: "政策建议",
        subtitle: "五项立法改革行动方案",
        recs: [
          {
            num: "1",
            heading: "建立数据训练登记制度",
            text: "要求超过计算阈值的通用AI系统开发者维护公开可查的训练数据来源登记册，特别关注个人可识别信息。登记册应包括数据来源、收集方式和选择退出机制。",
            priority: "关键",
            priorityClass: "high",
          },
          {
            num: "2",
            heading: "推行算法影响评估",
            text: "要求部署高风险AI系统的组织在部署前完成并公开算法影响评估，评估隐私风险、偏见可能性和社会影响。评估必须每24个月独立审计一次。",
            priority: "高",
            priorityClass: "high",
          },
          {
            num: "3",
            heading: "实施数据可携带权2.0",
            text: "将现有数据可携带权扩展至包括AI生成的关于个人的推断和画像。用户应能够导出、更正或删除的不仅是原始数据，还包括AI系统维护的关于他们的衍生表征。",
            priority: "高",
            priorityClass: "high",
          },
          {
            num: "4",
            heading: "资助隐私保护研究",
            text: "将联邦AI研究经费的3%分配给隐私保护计算技术，包括联邦学习、差分隐私和安全多方计算。建立国家隐私技术卓越中心。",
            priority: "中",
            priorityClass: "medium",
          },
          {
            num: "5",
            heading: "协调国际标准",
            text: "推动AI数据治理的双边和多边协议，防止监管套利。优先与欧盟AI法案和英国AI法规对齐，同时倡导发展中国家参与标准制定。",
            priority: "中",
            priorityClass: "medium",
          },
        ],
      },
      {
        id: "evidence",
        label: "依据",
        icon: "🔬",
        title: "证据基础",
        subtitle: "研究基础和支撑分析",
        paras: [
          "我们的分析基于对147份监管文件、42项学术研究的全面审查，以及对11个司法管辖区23位隐私专业人士的访谈。实证基础锚定FTC 2024年隐私报告¹，该报告记录了自2021年以来与AI驱动数据实践相关的消费者投诉增长340%。",
          "计量经济学建模²表明，与统一框架相比，风险分层监管可将中小企业合规成本降低约42%，同时保持等效的消费者保护效果。这一发现在三种监管成本情景下均稳健。",
          "对欧盟AI法案³和金融服务、医疗行业特定方法的比较分析表明，含纵向豁免的横向框架在监管清晰度和适应能力之间取得最佳平衡。",
        ],
        footnotesLabel: "参考文献",
        footnotes: [
          {
            mark: "1",
            text: "联邦贸易委员会，《2024年度隐私报告》，FTC消费者保护局，华盛顿，2024年。",
          },
          {
            mark: "2",
            text: "陈立、惠特菲尔德，《隐私监管的成本：异质性分析》，《法与经济学杂志》第67卷第1期，2025年。",
          },
          {
            mark: "3",
            text: "欧盟委员会，《人工智能法规（AI法案）》，COM(2024)265终稿，布鲁塞尔，2024年。",
          },
        ],
      },
      {
        id: "roadmap",
        label: "路线图",
        icon: "🗺️",
        title: "实施路线图",
        subtitle: "36个月分阶段方案",
        phases: [
          {
            label: "第一阶段",
            title: "基础与咨询",
            timeline: "第1–12个月",
            items: [
              "成立跨部门工作组",
              "白皮书公开咨询",
              "起草监管框架v1.0",
              "5家主要AI实验室试点登记",
            ],
          },
          {
            label: "第二阶段",
            title: "立法与试点",
            timeline: "第13–24个月",
            items: [
              "向国会提交立法",
              "全面启动数据训练登记",
              "试点影响评估项目",
              "资助隐私研究中心",
            ],
          },
          {
            label: "第三阶段",
            title: "全面实施",
            timeline: "第25–36个月",
            items: [
              "执法权启动",
              "国际协议生效",
              "首个合规周期完成",
              "实施后审查",
            ],
          },
        ],
      },
    ],
  },
} as const;

/* ── Component ───────────────────────────────────────────────────────────── */

export default function PolicyPaper({
  scene,
  beat,
  language,
  isThumbnail,
  reducedMotion,
  onNavigate,
  isTransitionClone,
}: BespokeStyleProps) {
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const id = "style-45-fonts";
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

  const handleNavClick = useCallback(
    (e: React.MouseEvent, target: number) => {
      e.stopPropagation();
      onNavigate?.(target, 0);
    },
    [onNavigate],
  );

  const data = SCENES[language];
  const sceneData = data.scenes[scene - 1];
  const rootClasses = [styles.root, reducedMotion ? styles.reducedMotion : ""]
    .filter(Boolean)
    .join(" ");

  /* Scene 1: Title */
  const renderTitle = () => {
    const s = sceneData as (typeof data.scenes)[0];
    return (
      <div className={styles.titlePage}>
        <div className={styles.titleSeries}>{s.series}</div>
        <h1 className={styles.titleMain}>
          {s.title} <em>{s.titleEm}</em>
          <br />
          {s.titleSuffix}
        </h1>
        <p className={styles.titleSubtitle}>{s.subtitle}</p>
        <div className={styles.titleRule} />
        <div className={styles.titleMeta}>
          {s.meta.map((m, i) => (
            <div key={i} className={styles.titleMetaItem}>
              <span className={styles.titleMetaLabel}>{m.label}</span>
              <span className={styles.titleMetaValue}>{m.value}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  /* Scene 2: Executive Summary */
  const renderSummary = () => {
    const s = sceneData as (typeof data.scenes)[1];
    return (
      <div className={styles.execSummary}>
        <div className={styles.execLabel}>{s.execLabel}</div>
        <div className={styles.execBox}>
          <h2 className={styles.execTitle}>{s.title}</h2>
          <div className={styles.execBody}>
            {s.paras.map((p, i) => (
              <p
                key={i}
                className={styles.execPara}
                style={{
                  opacity: entered && i <= beat ? 1 : 0,
                  transform:
                    entered && i <= beat
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
                {s.keyPointsLabel}
              </div>
              {s.keyPoints.map((kp, i) => (
                <div
                  key={i}
                  className={styles.execKeyPoint}
                  style={{
                    opacity: entered && beat >= 1 ? 1 : 0,
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
  };

  /* Scene 3: Recommendations (HERO) */
  const renderRecommendations = () => {
    const s = sceneData as (typeof data.scenes)[2];
    const visibleCount = Math.min(beat * 2 + 2, s.recs.length);
    return (
      <div className={styles.recommendations}>
        <div className={styles.recHeader}>
          <h2 className={styles.recTitle}>{s.title}</h2>
          <p className={styles.recSubtitle}>{s.subtitle}</p>
        </div>
        <div className={styles.recList}>
          {s.recs.slice(0, visibleCount).map((r, i) => (
            <div
              key={r.num}
              className={styles.recItem}
              style={{
                opacity: entered ? 1 : 0,
                transform: entered ? "translateX(0)" : "translateX(-1cqw)",
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
  };

  /* Scene 4: Evidence */
  const renderEvidence = () => {
    const s = sceneData as (typeof data.scenes)[3];
    return (
      <div className={styles.evidence}>
        <div className={styles.evidenceHeader}>
          <h2 className={styles.evidenceTitle}>{s.title}</h2>
          <p className={styles.evidenceSubtitle}>{s.subtitle}</p>
        </div>
        <div className={styles.evidenceBody}>
          {s.paras.map((p, i) => (
            <p
              key={i}
              className={styles.evidencePara}
              style={{
                opacity: entered && i <= beat ? 1 : 0,
                transform:
                  entered && i <= beat
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
              {s.footnotesLabel}
            </div>
            {s.footnotes.map((fn, i) => (
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
  };

  /* Scene 5: Roadmap */
  const renderRoadmap = () => {
    const s = sceneData as (typeof data.scenes)[4];
    return (
      <div className={styles.roadmap}>
        <div className={styles.roadmapHeader}>
          <h2 className={styles.roadmapTitle}>{s.title}</h2>
          <p className={styles.roadmapSubtitle}>{s.subtitle}</p>
        </div>
        <div className={styles.roadmapPhases}>
          {s.phases.map((phase, i) => (
            <div
              key={i}
              className={styles.roadmapPhase}
              style={{
                opacity: entered && i <= beat ? 1 : 0,
                transform:
                  entered && i <= beat
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

  const renderScene = () => {
    switch (scene) {
      case 1:
        return renderTitle();
      case 2:
        return renderSummary();
      case 3:
        return renderRecommendations();
      case 4:
        return renderEvidence();
      case 5:
        return renderRoadmap();
      default:
        return null;
    }
  };

  return (
    <div className={rootClasses}>
      <div key={`45-${scene}`} className={`${styles.transitionTrack} ${!isTransitionClone ? styles.animateSceneEnter : ""}`}>
        {renderScene()}
      </div>
      {renderNav()}
    </div>
  );
}

/* ── Metadata ────────────────────────────────────────────────────────────── */

export function getMetadata(lang: "en" | "zh"): StyleMetadata {
  const t = lang === "zh" ? zhMeta : enMeta;
  return {
    id: "45",
    band: "text-report",
    name: t.name,
    theme: t.theme,
    densityLabel: t.densityLabel,
    heroScene: 3,
    colors: {
      bg: "#f8f9fa",
      ink: "#1a1a2e",
      panel: "#ffffff",
    },
    typography: {
      header: "Inter, sans-serif",
      body: "Inter, Georgia, serif",
    },
    tags: lang === "zh"
      ? ["政策文件", "数据隐私", "监管", "AI治理"]
      : ["policy-paper", "data-privacy", "regulation", "AI-governance"],
    fonts: ["Inter", "cjk:Noto Serif SC"],
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
        title: lang === "zh" ? "执行摘要" : "Executive Summary",
        beats: [
          { id: 0, action: "beat-0", title: lang === "zh" ? "首段正文" : "First paragraph" , body: "" },
          { id: 1, action: "beat-1", title: lang === "zh" ? "全部要点" : "All key points" , body: "" },
        ],
      },
      {
        id: 3,
        title: lang === "zh" ? "政策建议" : "Recommendations",
        beats: [
          { id: 0, action: "beat-0", title: lang === "zh" ? "前两项建议" : "First two recommendations" , body: "" },
          { id: 1, action: "beat-1", title: lang === "zh" ? "前四项建议" : "First four recommendations" , body: "" },
          { id: 2, action: "beat-2", title: lang === "zh" ? "全部五项建议" : "All five recommendations" , body: "" },
        ],
      },
      {
        id: 4,
        title: lang === "zh" ? "证据基础" : "Evidence Base",
        beats: [
          { id: 0, action: "beat-0", title: lang === "zh" ? "首段分析" : "First analysis paragraph" , body: "" },
          { id: 1, action: "beat-1", title: lang === "zh" ? "全部段落和脚注" : "All paragraphs and footnotes" , body: "" },
        ],
      },
      {
        id: 5,
        title: lang === "zh" ? "实施路线图" : "Implementation Roadmap",
        beats: [
          { id: 0, action: "beat-0", title: lang === "zh" ? "第一阶段" : "Phase 1" , body: "" },
          { id: 1, action: "beat-1", title: lang === "zh" ? "前两阶段" : "Phases 1-2" , body: "" },
          { id: 2, action: "beat-2", title: lang === "zh" ? "全部三阶段" : "All three phases" , body: "" },
        ],
      },
    ],
  };
}

const enMeta = {
  name: "Policy Paper",
  theme: "Formal policy proposal with recommendations and evidence base",
  densityLabel: "Dense",
};

const zhMeta = {
  name: "政策文件",
  theme: "含建议和证据基础的正式政策提案",
  densityLabel: "密集",
};

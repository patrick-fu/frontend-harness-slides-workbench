import { useState, useEffect, useCallback } from "react";
import type { BespokeStyleProps, StyleMetadata } from "../types";
import styles from "./46-audit-report.module.css";

/* ── Content ─────────────────────────────────────────────────────────────── */

const SCENES = {
  en: {
    scenes: [
      {
        id: "header",
        label: "Header",
        icon: "🔒",
        firm: "Meridian Assurance Group",
        tagline: "Independent Security Auditors",
        type: "SOC 2 Type II · Security Audit Report",
        title: "Information Security",
        titleAccent: "Audit Report",
        subtitle: "Comprehensive Assessment of Security Controls and Risk Posture",
        meta: [
          { label: "Client", value: "Nexus Technologies Inc." },
          { label: "Period", value: "Jan 1 – Dec 31, 2024" },
          { label: "Report Date", value: "February 28, 2025" },
          { label: "Engagement #", value: "MAG-2025-00347" },
        ],
      },
      {
        id: "scope",
        label: "Scope",
        icon: "📐",
        title: "Scope & Methodology",
        subtitle: "Audit framework and assessment approach",
        sections: [
          {
            label: "Audit Scope",
            title: "In-Scope Systems",
            text: "This engagement assessed the design and operating effectiveness of security controls across the following in-scope systems and processes:",
            items: [
              "Cloud infrastructure (AWS us-east-1, us-west-2)",
              "Production application environment (3 services)",
              "Data processing pipelines (ETL, ML training)",
              "Identity and access management systems",
              "Network security and perimeter defenses",
              "Security incident response procedures",
            ],
          },
          {
            label: "Methodology",
            title: "Assessment Approach",
            text: "Our audit methodology combines automated tooling with manual verification, aligned with AICPA TSC 2017 trust services criteria:",
            items: [
              "Automated vulnerability scanning (weekly cadence)",
              "Penetration testing (quarterly, 4 engagements)",
              "Control design documentation review",
              "Sample-based operating effectiveness testing",
              "Interviews with 18 key personnel across 6 teams",
              "Compliance gap analysis against SOC 2 criteria",
            ],
          },
        ],
      },
      {
        id: "findings",
        label: "Findings",
        icon: "⚠️",
        title: "Findings Summary",
        subtitle: "Identified control deficiencies and observations",
        countLabel: "8 Findings",
        stats: [
          { value: "1", label: "Critical", color: "var(--style-46-critical)" },
          { value: "2", label: "High", color: "var(--style-46-high)" },
          { value: "3", label: "Medium", color: "var(--style-46-medium)" },
          { value: "2", label: "Low", color: "var(--style-46-low)" },
        ],
        findings: [
          {
            severity: "Crit",
            severityClass: "critical",
            title: "Unpatched Critical Vulnerability in Production",
            desc: "CVE-2024-3988 (CVSS 9.8) present in production API gateway for 47 days beyond SLA. Patch management process lacks automated critical vulnerability escalation.",
            category: "Vulnerability Mgmt",
            ref: "F-001",
          },
          {
            severity: "High",
            severityClass: "high",
            title: "Overprivileged Service Accounts",
            desc: "Three service accounts possess administrative-level IAM permissions exceeding least-privilege principle. Accounts used by CI/CD pipeline have write access to production database.",
            category: "Access Control",
            ref: "F-002",
          },
          {
            severity: "High",
            severityClass: "high",
            title: "Inadequate Data Encryption at Rest",
            desc: "S3 bucket containing PII data lacks server-side encryption configuration. Approximately 2.3TB of customer data stored without encryption since Q2 2024.",
            category: "Data Protection",
            ref: "F-003",
          },
          {
            severity: "Med",
            severityClass: "medium",
            title: "Security Log Retention Below Policy",
            desc: "CloudTrail logs retained for 60 days vs. 365-day policy requirement. Historical security event investigation capability limited.",
            category: "Monitoring",
            ref: "F-004",
          },
          {
            severity: "Med",
            severityClass: "medium",
            title: "MFA Not Enforced for All Users",
            desc: "12 contractor accounts lack MFA enforcement. Contractor onboarding workflow bypasses MFA requirement in identity provider configuration.",
            category: "Access Control",
            ref: "F-005",
          },
          {
            severity: "Med",
            severityClass: "medium",
            title: "Incident Response Plan Not Tested",
            desc: "Incident response plan last tabletop-tested 18 months ago. Annual testing requirement not met. Plan lacks updated contact information for key roles.",
            category: "Incident Response",
            ref: "F-006",
          },
        ],
      },
      {
        id: "risk",
        label: "Risk Matrix",
        icon: "📊",
        title: "Risk Assessment Matrix",
        subtitle: "Control effectiveness and residual risk ratings",
        rows: [
          {
            id: "CC-1",
            control: "Logical Access Security",
            desc: "IAM policies, MFA, privilege management",
            level: "High",
            levelClass: "high",
            status: "Open",
            statusClass: "open",
          },
          {
            id: "CC-2",
            control: "System Operations",
            desc: "Monitoring, alerting, incident response",
            level: "Medium",
            levelClass: "medium",
            status: "Open",
            statusClass: "open",
          },
          {
            id: "CC-3",
            control: "Change Management",
            desc: "Deployment pipelines, change approval",
            level: "Low",
            levelClass: "low",
            status: "Remediated",
            statusClass: "remediated",
          },
          {
            id: "CC-4",
            control: "Risk Assessment",
            desc: "Annual risk identification and treatment",
            level: "Low",
            levelClass: "low",
            status: "Remediated",
            statusClass: "remediated",
          },
          {
            id: "CC-5",
            control: "Data Management",
            desc: "Classification, encryption, retention",
            level: "High",
            levelClass: "high",
            status: "Open",
            statusClass: "open",
          },
          {
            id: "CC-6",
            control: "Physical Security",
            desc: "Data center access, environmental controls",
            level: "Low",
            levelClass: "low",
            status: "Accepted",
            statusClass: "accepted",
          },
          {
            id: "CC-7",
            control: "Availability & Resilience",
            desc: "Backup, DR, business continuity",
            level: "Medium",
            levelClass: "medium",
            status: "Open",
            statusClass: "open",
          },
          {
            id: "CC-8",
            control: "System Monitoring",
            desc: "Log analysis, anomaly detection",
            level: "Medium",
            levelClass: "medium",
            status: "Open",
            statusClass: "open",
          },
        ],
      },
      {
        id: "compliance",
        label: "Compliance",
        icon: "✅",
        title: "SOC 2 Compliance Checklist",
        subtitle: "Trust Services Criteria assessment results",
        scoreLabel: "Overall Readiness",
        scoreTitle: "SOC 2 Type II — Qualified Opinion",
        scoreText:
          "89% of controls assessed as operating effectively. Three controls require remediation before clean opinion can be issued. Estimated remediation timeline: 90 days.",
        items: [
          {
            text: "Logical and physical access controls are designed and implemented",
            ref: "CC6.1",
            status: "pass",
          },
          {
            text: "System operations are monitored and anomalies detected",
            ref: "CC7.2",
            status: "pass",
          },
          {
            text: "System modifications are authorized, documented, and approved",
            ref: "CC8.1",
            status: "pass",
          },
          {
            text: "Data is classified and protected according to sensitivity",
            ref: "A1.2",
            status: "fail",
          },
          {
            text: "Encryption is applied for data at rest and in transit",
            ref: "CC6.7",
            status: "partial",
          },
          {
            text: "Incident response procedures exist and are periodically tested",
            ref: "CC7.3",
            status: "partial",
          },
          {
            text: "Availability commitments are met through redundancy and DR",
            ref: "A1.3",
            status: "pass",
          },
          {
            text: "Processing integrity controls ensure accurate system output",
            ref: "PI1.4",
            status: "pass",
          },
          {
            text: "Confidential information is protected from unauthorized disclosure",
            ref: "C1.1",
            status: "pass",
          },
        ],
      },
    ],
  },
  zh: {
    scenes: [
      {
        id: "header",
        label: "标题",
        icon: "🔒",
        firm: "子午线鉴证集团",
        tagline: "独立安全审计师",
        type: "SOC 2 Type II · 安全审计报告",
        title: "信息安全",
        titleAccent: "审计报告",
        subtitle: "安全控制与风险态势综合评估",
        meta: [
          { label: "客户", value: "联科科技股份有限公司" },
          { label: "审计期间", value: "2024年1月1日 – 12月31日" },
          { label: "报告日期", value: "2025年2月28日" },
          { label: "业务编号", value: "MAG-2025-00347" },
        ],
      },
      {
        id: "scope",
        label: "范围",
        icon: "📐",
        title: "审计范围与方法",
        subtitle: "审计框架和评估方法",
        sections: [
          {
            label: "审计范围",
            title: "纳入评估的系统",
            text: "本次业务评估了以下范围内系统和流程的安全控制设计和运行有效性：",
            items: [
              "云基础设施（AWS us-east-1, us-west-2）",
              "生产应用环境（3个服务）",
              "数据处理管道（ETL、机器学习训练）",
              "身份与访问管理系统",
              "网络安全与边界防御",
              "安全事件响应程序",
            ],
          },
          {
            label: "评估方法",
            title: "审计方法论",
            text: "我们的审计方法结合自动化工具与人工验证，与AICPA TSC 2017信任服务准则对齐：",
            items: [
              "自动化漏洞扫描（每周节奏）",
              "渗透测试（每季度，4次业务）",
              "控制设计文档审查",
              "基于抽样的运行有效性测试",
              "访谈6个团队18名关键人员",
              "SOC 2准则合规差距分析",
            ],
          },
        ],
      },
      {
        id: "findings",
        label: "发现",
        icon: "⚠️",
        title: "审计发现汇总",
        subtitle: "已识别的控制缺陷和观察事项",
        countLabel: "8项发现",
        stats: [
          { value: "1", label: "严重", color: "var(--style-46-critical)" },
          { value: "2", label: "高", color: "var(--style-46-high)" },
          { value: "3", label: "中", color: "var(--style-46-medium)" },
          { value: "2", label: "低", color: "var(--style-46-low)" },
        ],
        findings: [
          {
            severity: "严重",
            severityClass: "critical",
            title: "生产环境未修补关键漏洞",
            desc: "CVE-2024-3988（CVSS 9.8）在生产API网关上超出SLA 47天。补丁管理流程缺乏自动化关键漏洞升级机制。",
            category: "漏洞管理",
            ref: "F-001",
          },
          {
            severity: "高",
            severityClass: "high",
            title: "服务账户权限过大",
            desc: "三个服务账户拥有超出最小权限原则的管理员级IAM权限。CI/CD管道使用的账户拥有生产数据库写入权限。",
            category: "访问控制",
            ref: "F-002",
          },
          {
            severity: "高",
            severityClass: "high",
            title: "静态数据加密不足",
            desc: "包含PII数据的S3存储桶缺少服务端加密配置。约2.3TB客户数据自2024年Q2起未经加密存储。",
            category: "数据保护",
            ref: "F-003",
          },
          {
            severity: "中",
            severityClass: "medium",
            title: "安全日志保留低于政策要求",
            desc: "CloudTrail日志保留60天，低于政策要求的365天。历史安全事件调查能力受限。",
            category: "监控",
            ref: "F-004",
          },
          {
            severity: "中",
            severityClass: "medium",
            title: "MFA未对所有用户强制执行",
            desc: "12个承包商账户缺少MFA强制执行。承包商入职流程绕过了身份提供商配置中的MFA要求。",
            category: "访问控制",
            ref: "F-005",
          },
          {
            severity: "中",
            severityClass: "medium",
            title: "事件响应计划未经测试",
            desc: "事件响应计划上次桌面演练在18个月前。年度测试要求未满足。计划缺少关键角色更新的联系信息。",
            category: "事件响应",
            ref: "F-006",
          },
        ],
      },
      {
        id: "risk",
        label: "风险矩阵",
        icon: "📊",
        title: "风险评估矩阵",
        subtitle: "控制有效性和剩余风险评级",
        rows: [
          {
            id: "CC-1",
            control: "逻辑访问安全",
            desc: "IAM策略、MFA、权限管理",
            level: "高",
            levelClass: "high",
            status: "待整改",
            statusClass: "open",
          },
          {
            id: "CC-2",
            control: "系统运维",
            desc: "监控、告警、事件响应",
            level: "中",
            levelClass: "medium",
            status: "待整改",
            statusClass: "open",
          },
          {
            id: "CC-3",
            control: "变更管理",
            desc: "部署管道、变更审批",
            level: "低",
            levelClass: "low",
            status: "已整改",
            statusClass: "remediated",
          },
          {
            id: "CC-4",
            control: "风险评估",
            desc: "年度风险识别和处置",
            level: "低",
            levelClass: "low",
            status: "已整改",
            statusClass: "remediated",
          },
          {
            id: "CC-5",
            control: "数据管理",
            desc: "分类、加密、保留",
            level: "高",
            levelClass: "high",
            status: "待整改",
            statusClass: "open",
          },
          {
            id: "CC-6",
            control: "物理安全",
            desc: "数据中心访问、环境控制",
            level: "低",
            levelClass: "low",
            status: "已接受",
            statusClass: "accepted",
          },
          {
            id: "CC-7",
            control: "可用性与韧性",
            desc: "备份、灾备、业务连续性",
            level: "中",
            levelClass: "medium",
            status: "待整改",
            statusClass: "open",
          },
          {
            id: "CC-8",
            control: "系统监控",
            desc: "日志分析、异常检测",
            level: "中",
            levelClass: "medium",
            status: "待整改",
            statusClass: "open",
          },
        ],
      },
      {
        id: "compliance",
        label: "合规",
        icon: "✅",
        title: "SOC 2合规清单",
        subtitle: "信任服务准则评估结果",
        scoreLabel: "整体就绪度",
        scoreTitle: "SOC 2 Type II — 保留意见",
        scoreText:
          "89%的控制评估为有效运行。三项控制需整改后方可出具无保留意见。预计整改时间：90天。",
        items: [
          {
            text: "逻辑和物理访问控制已设计并实施",
            ref: "CC6.1",
            status: "pass",
          },
          {
            text: "系统运维受到监控，异常得到检测",
            ref: "CC7.2",
            status: "pass",
          },
          {
            text: "系统变更已授权、记录和审批",
            ref: "CC8.1",
            status: "pass",
          },
          {
            text: "数据按敏感度分类和保护",
            ref: "A1.2",
            status: "fail",
          },
          {
            text: "静态和传输中数据应用加密",
            ref: "CC6.7",
            status: "partial",
          },
          {
            text: "事件响应程序存在并定期测试",
            ref: "CC7.3",
            status: "partial",
          },
          {
            text: "通过冗余和灾备满足可用性承诺",
            ref: "A1.3",
            status: "pass",
          },
          {
            text: "处理完整性控制确保准确的系统输出",
            ref: "PI1.4",
            status: "pass",
          },
          {
            text: "机密信息受保护，防止未授权披露",
            ref: "C1.1",
            status: "pass",
          },
        ],
      },
    ],
  },
} as const;

/* ── Component ───────────────────────────────────────────────────────────── */

export default function AuditReport({
  scene,
  beat,
  language,
  isThumbnail,
  reducedMotion,
  onNavigate,
}: BespokeStyleProps) {
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const id = "style-46-fonts";
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
  const sceneData = data.scenes[scene - 1];
  const rootClasses = [styles.root, reducedMotion ? styles.reducedMotion : ""]
    .filter(Boolean)
    .join(" ");

  /* Scene 1: Header */
  const renderHeader = () => {
    const s = sceneData as (typeof data.scenes)[0];
    return (
      <div className={styles.reportHeader}>
        <div className={styles.reportHeaderTop}>
          <div className={styles.reportFirmLogo}>M</div>
          <div className={styles.reportFirmInfo}>
            <div className={styles.reportFirmName}>{s.firm}</div>
            <div className={styles.reportFirmTagline}>{s.tagline}</div>
          </div>
        </div>
        <div className={styles.reportType}>{s.type}</div>
        <h1 className={styles.reportTitle}>
          {s.title}{" "}
          <span className={styles.reportTitleAccent}>{s.titleAccent}</span>
        </h1>
        <p className={styles.reportSubtitle}>{s.subtitle}</p>
        <div className={styles.reportMeta}>
          {s.meta.map((m, i) => (
            <div key={i} className={styles.reportMetaItem}>
              <span className={styles.reportMetaLabel}>{m.label}</span>
              <span className={styles.reportMetaValue}>{m.value}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  /* Scene 2: Scope */
  const renderScope = () => {
    const s = sceneData as (typeof data.scenes)[1];
    return (
      <div className={styles.scope}>
        <div className={styles.scopeHeader}>
          <h2 className={styles.scopeTitle}>{s.title}</h2>
          <p className={styles.scopeSubtitle}>{s.subtitle}</p>
        </div>
        <div className={styles.scopeBody}>
          {s.sections.map((sec, i) => (
            <div
              key={i}
              className={styles.scopeSection}
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
              <div className={styles.scopeSectionLabel}>{sec.label}</div>
              <h3 className={styles.scopeSectionTitle}>{sec.title}</h3>
              <p className={styles.scopeSectionText}>{sec.text}</p>
              <ul className={styles.scopeList}>
                {sec.items.map((item, j) => (
                  <li key={j} className={styles.scopeListItem}>
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

  /* Scene 3: Findings */
  const renderFindings = () => {
    const s = sceneData as (typeof data.scenes)[2];
    const visibleCount = Math.min(beat * 2 + 2, s.findings.length);
    return (
      <div className={styles.findings}>
        <div className={styles.findingsHeader}>
          <h2 className={styles.findingsTitle}>{s.title}</h2>
          <span className={styles.findingsCount}>{s.countLabel}</span>
        </div>
        <div className={styles.findingsSummary}>
          {s.stats.map((stat, i) => (
            <div key={i} className={styles.findingsStat}>
              <span
                className={styles.findingsStatValue}
                style={{ color: stat.color }}
              >
                {stat.value}
              </span>
              <div className={styles.findingsStatLabel}>{stat.label}</div>
            </div>
          ))}
        </div>
        <div className={styles.findingsList}>
          {s.findings.slice(0, visibleCount).map((f, i) => (
            <div
              key={f.ref}
              className={styles.findingItem}
              style={{
                opacity: entered ? 1 : 0,
                transform: entered ? "translateX(0)" : "translateX(-0.8cqh)",
                transition: "opacity 0.35s ease, transform 0.35s ease",
                transitionDelay: `${i * 0.08}s`,
              }}
            >
              <div
                className={`${styles.findingSeverity} ${
                  f.severityClass === "critical"
                    ? styles.findingSeverityCritical
                    : f.severityClass === "high"
                      ? styles.findingSeverityHigh
                      : f.severityClass === "medium"
                        ? styles.findingSeverityMedium
                        : styles.findingSeverityLow
                }`}
              >
                {f.severity}
              </div>
              <div className={styles.findingContent}>
                <h3 className={styles.findingTitle}>{f.title}</h3>
                <p className={styles.findingDesc}>{f.desc}</p>
                <div className={styles.findingMeta}>
                  <span className={styles.findingMetaItem}>
                    {language === "zh" ? "类别" : "Category"}:{" "}
                    <span>{f.category}</span>
                  </span>
                  <span className={styles.findingMetaItem}>
                    {language === "zh" ? "编号" : "Ref"}:{" "}
                    <span>{f.ref}</span>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  /* Scene 4: Risk Matrix (HERO) */
  const renderRisk = () => {
    const s = sceneData as (typeof data.scenes)[3];
    const visibleCount = Math.min(beat * 3 + 3, s.rows.length);
    return (
      <div className={styles.riskMatrix}>
        <div className={styles.riskHeader}>
          <h2 className={styles.riskTitle}>{s.title}</h2>
          <p className={styles.riskSubtitle}>{s.subtitle}</p>
        </div>
        <div className={styles.riskTableWrap}>
          <table className={styles.riskTable}>
            <thead>
              <tr>
                <th>ID</th>
                <th>{language === "zh" ? "控制领域" : "Control Domain"}</th>
                <th>{language === "zh" ? "风险等级" : "Risk Level"}</th>
                <th>{language === "zh" ? "状态" : "Status"}</th>
              </tr>
            </thead>
            <tbody>
              {s.rows.slice(0, visibleCount).map((row, i) => (
                <tr
                  key={row.id}
                  style={{
                    opacity: entered ? 1 : 0,
                    transition: "opacity 0.3s ease",
                    transitionDelay: `${i * 0.06}s`,
                  }}
                >
                  <td className={styles.riskId}>{row.id}</td>
                  <td>
                    <span className={styles.riskControl}>{row.control}</span>
                    <span className={styles.riskControlDesc}>
                      {row.desc}
                    </span>
                  </td>
                  <td className={styles.riskLevelCell}>
                    <span
                      className={`${styles.riskLevelBadge} ${
                        row.levelClass === "high"
                          ? styles.riskLevelHigh
                          : row.levelClass === "medium"
                            ? styles.riskLevelMedium
                            : styles.riskLevelLow
                      }`}
                    >
                      {row.level}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`${styles.riskStatus} ${
                        row.statusClass === "open"
                          ? styles.riskStatusOpen
                          : row.statusClass === "remediated"
                            ? styles.riskStatusRemediated
                            : styles.riskStatusAccepted
                      }`}
                    >
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  /* Scene 5: Compliance */
  const renderCompliance = () => {
    const s = sceneData as (typeof data.scenes)[4];
    return (
      <div className={styles.compliance}>
        <div className={styles.complianceHeader}>
          <h2 className={styles.complianceTitle}>{s.title}</h2>
          <p className={styles.complianceSubtitle}>{s.subtitle}</p>
        </div>
        <div className={styles.complianceSummary}>
          <div className={styles.complianceScore}>
            <div className={styles.complianceScoreCircle}>
              <div className={styles.complianceScoreInner}>
                <span className={styles.complianceScoreValue}>89</span>
                <span className={styles.complianceScorePct}>%</span>
              </div>
            </div>
            <div className={styles.complianceScoreInfo}>
              <div className={styles.complianceScoreLabel}>
                {s.scoreLabel}
              </div>
              <h3 className={styles.complianceScoreTitle}>{s.scoreTitle}</h3>
              <p className={styles.complianceScoreText}>{s.scoreText}</p>
            </div>
          </div>
        </div>
        <div className={styles.complianceItems}>
          {s.items.map((item, i) => (
            <div
              key={i}
              className={styles.complianceItem}
              style={{
                opacity: entered && (beat >= 1 || i < 4) ? 1 : 0,
                transform:
                  entered && (beat >= 1 || i < 4)
                    ? "translateX(0)"
                    : "translateX(-0.5cqh)",
                transition: "opacity 0.3s ease, transform 0.3s ease",
                transitionDelay: `${i * 0.05}s`,
              }}
            >
              <div
                className={`${styles.complianceCheck} ${
                  item.status === "pass"
                    ? styles.complianceCheckPass
                    : item.status === "fail"
                      ? styles.complianceCheckFail
                      : styles.complianceCheckPartial
                }`}
              >
                {item.status === "pass"
                  ? "✓"
                  : item.status === "fail"
                    ? "✕"
                    : "◐"}
              </div>
              <span className={styles.complianceItemText}>{item.text}</span>
              <span className={styles.complianceItemRef}>{item.ref}</span>
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
        return renderHeader();
      case 2:
        return renderScope();
      case 3:
        return renderFindings();
      case 4:
        return renderRisk();
      case 5:
        return renderCompliance();
      default:
        return null;
    }
  };

  return (
    <div className={rootClasses}>
      <div key={`46-${scene}`} className={styles.transitionTrack}>
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
    id: "46",
    band: "text-report",
    name: t.name,
    theme: t.theme,
    densityLabel: t.densityLabel,
    heroScene: 4,
    colors: {
      bg: "#ffffff",
      ink: "#111827",
      panel: "#f9fafb",
    },
    typography: {
      header: "Inter, system-ui, sans-serif",
      body: "Inter, system-ui, sans-serif",
    },
    tags: lang === "zh"
      ? ["审计报告", "安全", "SOC2", "合规"]
      : ["audit-report", "security", "SOC2", "compliance"],
    fonts: ["Inter", "cjk:Noto Sans SC"],
    scenes: [
      {
        id: 1,
        title: lang === "zh" ? "报告标题" : "Report Header",
        beats: [
          { id: 0, action: "beat-0", title: lang === "zh" ? "完整标题页" : "Full report header" , body: "" },
        ],
      },
      {
        id: 2,
        title: lang === "zh" ? "范围与方法" : "Scope & Methodology",
        beats: [
          { id: 0, action: "beat-0", title: lang === "zh" ? "审计范围" : "Audit scope" , body: "" },
          { id: 1, action: "beat-1", title: lang === "zh" ? "方法论" : "Methodology" , body: "" },
        ],
      },
      {
        id: 3,
        title: lang === "zh" ? "审计发现" : "Findings",
        beats: [
          { id: 0, action: "beat-0", title: lang === "zh" ? "前两项发现" : "First two findings" , body: "" },
          { id: 1, action: "beat-1", title: lang === "zh" ? "前四项发现" : "First four findings" , body: "" },
          { id: 2, action: "beat-2", title: lang === "zh" ? "全部发现" : "All findings" , body: "" },
        ],
      },
      {
        id: 4,
        title: lang === "zh" ? "风险矩阵" : "Risk Matrix",
        beats: [
          { id: 0, action: "beat-0", title: lang === "zh" ? "前三项控制" : "First three controls" , body: "" },
          { id: 1, action: "beat-1", title: lang === "zh" ? "前六项控制" : "First six controls" , body: "" },
          { id: 2, action: "beat-2", title: lang === "zh" ? "全部控制" : "All controls" , body: "" },
        ],
      },
      {
        id: 5,
        title: lang === "zh" ? "合规清单" : "Compliance Checklist",
        beats: [
          { id: 0, action: "beat-0", title: lang === "zh" ? "评分和前四项" : "Score and first 4 items" , body: "" },
          { id: 1, action: "beat-1", title: lang === "zh" ? "全部清单项" : "All checklist items" , body: "" },
        ],
      },
    ],
  };
}

const enMeta = {
  name: "Audit Report",
  theme: "Security audit with risk matrix and compliance checklist",
  densityLabel: "Comprehensive",
};

const zhMeta = {
  name: "审计报告",
  theme: "含风险矩阵和合规清单的安全审计",
  densityLabel: "全面",
};

import { useState, useLayoutEffect, useEffect, useCallback } from "react";
import type { BespokeStyleProps, StyleMetadata } from "../types";
import SpatialSceneTrack from "./SpatialSceneTrack";
import styles from "./46-audit-report.module.css";
import { useFLIP } from "../hooks/useFLIP";

/* ── Content ─────────────────────────────────────────────────────────────── */

const SCENES = {
  en: {
    scenes: [
      {
        id: "header",
        label: "Header",
        icon: "✓",
        firm: "Quality Assurance Division",
        tagline: "Release Readiness Checklist",
        type: "Pre-Deployment Acceptance Ledger",
        title: "v2.14.0",
        titleAccent: "Release Checklist",
        subtitle: "Comprehensive readiness verification across all deployment criteria",
        meta: [
          { label: "Project", value: "Platform Auth Service" },
          { label: "Version", value: "v2.14.0" },
          { label: "Check Date", value: "July 6, 2026" },
          { label: "Ledger #", value: "QA-2026-0714" },
        ],
      },
      {
        id: "readiness",
        label: "Readiness",
        icon: "📋",
        title: "Pre-Flight Readiness",
        subtitle: "Gate checks before deployment pipeline",
        sections: [
          {
            label: "Build",
            title: "Build & Packaging",
            text: "All build artifacts pass validation and are ready for deployment:",
            items: [
              "CI pipeline green — all 247 tests passing",
              "Docker image built and pushed to registry",
              "Semantic version tag applied (v2.14.0)",
              "Changelog generated and reviewed",
              "Migration scripts validated against staging DB",
              "Rollback package prepared and tested",
            ],
          },
          {
            label: "Review",
            title: "Code Review & Approvals",
            text: "All required reviews and sign-offs obtained:",
            items: [
              "PR #4831 approved by 2 senior engineers",
              "Security review completed — no blocking issues",
              "Architecture review passed — ADR updated",
              "Accessibility audit — WCAG 2.1 AA compliant",
              "Performance regression within 2% threshold",
              "Legal/compliance sign-off obtained",
            ],
          },
        ],
      },
      {
        id: "criteria",
        label: "Criteria",
        icon: "✓",
        title: "Acceptance Criteria",
        subtitle: "Detailed verification of all requirements",
        countLabel: "24 Criteria",
        stats: [
          { value: "20", label: "Passed", color: "var(--style-46-critical)" },
          { value: "2", label: "Partial", color: "var(--style-46-high)" },
          { value: "1", label: "Failed", color: "var(--style-46-medium)" },
          { value: "1", label: "N/A", color: "var(--style-46-low)" },
        ],
        findings: [
          {
            severity: "Pass",
            severityClass: "critical",
            title: "Token refresh race condition resolved",
            desc: "Concurrent refresh test: 10/10 requests receive same valid token. Previously 4/10. Verified in staging with 3x load simulation.",
            category: "Functional",
            ref: "AC-001",
          },
          {
            severity: "Pass",
            severityClass: "critical",
            title: "Distributed lock acquired within 50ms",
            desc: "Redis SETNX mutex p99 acquisition latency 12ms under load. Well within 50ms SLA. Failover to in-memory lock tested.",
            category: "Performance",
            ref: "AC-002",
          },
          {
            severity: "Pass",
            severityClass: "critical",
            title: "Client request coalescing active",
            desc: "Module-scope shared promise confirmed. 10 concurrent 401s produce exactly 1 refresh request. Network trace verified.",
            category: "Efficiency",
            ref: "AC-003",
          },
          {
            severity: "Pass",
            severityClass: "critical",
            title: "Token versioning CAS working",
            desc: "Compare-and-swap rejects stale writes with version_mismatch error. Idempotent retry succeeds on second attempt.",
            category: "Correctness",
            ref: "AC-004",
          },
          {
            severity: "Partial",
            severityClass: "high",
            title: "Integration test coverage at 82%",
            desc: "Target: 90%. Missing: Redis failover scenario (in progress, ETA Jul 8). Graceful degradation path manually verified.",
            category: "Testing",
            ref: "AC-005",
          },
          {
            severity: "Partial",
            severityClass: "high",
            title: "Monitoring dashboards updated",
            desc: "New metrics: refresh_lock_wait_ms, token_version_conflicts. Alert thresholds configured. Runbook needs final review.",
            category: "Observability",
            ref: "AC-006",
          },
          {
            severity: "Fail",
            severityClass: "medium",
            title: "E2E race condition test flaky",
            desc: "Playwright test for concurrent tab refresh intermittently times out at 30s. Root cause: test harness doesn't properly simulate shared module scope across tabs.",
            category: "Testing",
            ref: "AC-007",
          },
          {
            severity: "N/A",
            severityClass: "low",
            title: "Mobile-specific refresh path",
            desc: "Not assessed this cycle. Mobile WebView token handling scheduled for v2.15.0 review. No known issues reported from field.",
            category: "Coverage",
            ref: "AC-008",
          },
        ],
      },
      {
        id: "quality",
        label: "Quality",
        icon: "📊",
        title: "Quality Verification Matrix",
        subtitle: "Testing results and coverage assessment",
        rows: [
          {
            id: "QT-1",
            control: "Unit Tests",
            desc: "247 tests, 98% coverage of changed code",
            level: "Pass",
            levelClass: "low",
            status: "Complete",
            statusClass: "remediated",
          },
          {
            id: "QT-2",
            control: "Integration Tests",
            desc: "42 tests including concurrent refresh scenario",
            level: "Pass",
            levelClass: "low",
            status: "Complete",
            statusClass: "remediated",
          },
          {
            id: "QT-3",
            control: "End-to-End Tests",
            desc: "18 browser tests across 3 flows — 1 flaky race test",
            level: "Partial",
            levelClass: "high",
            status: "In Progress",
            statusClass: "open",
          },
          {
            id: "QT-4",
            control: "Load Tests",
            desc: "3x peak traffic, 0 token conflicts",
            level: "Pass",
            levelClass: "low",
            status: "Complete",
            statusClass: "remediated",
          },
          {
            id: "QT-5",
            control: "Security Scan",
            desc: "Trivy + Snyk — 0 critical, 2 low (accepted)",
            level: "Pass",
            levelClass: "low",
            status: "Complete",
            statusClass: "accepted",
          },
          {
            id: "QT-6",
            control: "Accessibility",
            desc: "axe-core scan — WCAG 2.1 AA, 0 violations",
            level: "Pass",
            levelClass: "low",
            status: "Complete",
            statusClass: "remediated",
          },
          {
            id: "QT-7",
            control: "Performance",
            desc: "p99 refresh latency 268ms (was 840ms)",
            level: "Pass",
            levelClass: "low",
            status: "Complete",
            statusClass: "remediated",
          },
          {
            id: "QT-8",
            control: "Chaos / Resilience",
            desc: "Redis failover: 200ms fallback, but retry storm risk identified",
            level: "Fail",
            levelClass: "medium",
            status: "Action Required",
            statusClass: "open",
          },
        ],
      },
      {
        id: "signoff",
        label: "Sign-off",
        icon: "✅",
        title: "Final Sign-off Ledger",
        subtitle: "Overall readiness determination",
        scoreLabel: "Overall Readiness",
        scoreTitle: "GO for Deployment — with conditions",
        scoreText:
          "89% of acceptance criteria met. Two partial items (integration test coverage and monitoring runbook) must be completed within 48 hours post-deployment. One failed item (documentation update) is non-blocking and scheduled for v2.14.1. Recommend: proceed with canary deployment at 10% traffic.",
        items: [
          {
            text: "All functional acceptance criteria verified in staging environment",
            ref: "AC-001–004",
            status: "pass",
          },
          {
            text: "Performance benchmarks exceed target thresholds",
            ref: "QT-7",
            status: "pass",
          },
          {
            text: "Security and accessibility audits passed with no blockers",
            ref: "QT-5, QT-6",
            status: "pass",
          },
          {
            text: "Integration test coverage below 90% target (currently 82%)",
            ref: "AC-005",
            status: "fail",
          },
          {
            text: "Monitoring runbook pending final review by SRE team",
            ref: "AC-006",
            status: "partial",
          },
          {
            text: "Rollback procedure documented and dry-run tested",
            ref: "Build-06",
            status: "pass",
          },
          {
            text: "Feature flag auth.refresh.v2 configured for instant rollback",
            ref: "Build-06",
            status: "pass",
          },
          {
            text: "Documentation update deferred to v2.14.1 patch release",
            ref: "Docs-01",
            status: "partial",
          },
          {
            text: "Deployment communication sent to all stakeholders",
            ref: "Comms",
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
        icon: "✓",
        firm: "质量保证部",
        tagline: "发布就绪检查清单",
        type: "部署前验收台账",
        title: "v2.14.0",
        titleAccent: "发布检查清单",
        subtitle: "跨所有部署标准的综合就绪验证",
        meta: [
          { label: "项目", value: "平台认证服务" },
          { label: "版本", value: "v2.14.0" },
          { label: "检查日期", value: "2026年7月6日" },
          { label: "台账编号", value: "QA-2026-0714" },
        ],
      },
      {
        id: "readiness",
        label: "就绪",
        icon: "📋",
        title: "飞行前就绪检查",
        subtitle: "部署管道前的门控检查",
        sections: [
          {
            label: "构建",
            title: "构建与打包",
            text: "所有构建构件通过验证，准备部署：",
            items: [
              "CI 管道全绿——全部 247 个测试通过",
              "Docker 镜像构建并推送到仓库",
              "语义版本标签已应用（v2.14.0）",
              "变更日志已生成并审查",
              "迁移脚本已在暂存数据库验证",
              "回滚包已准备并测试",
            ],
          },
          {
            label: "评审",
            title: "代码评审与批准",
            text: "所有必需评审和签署已获得：",
            items: [
              "PR #4831 获 2 名高级工程师批准",
              "安全评审完成——无阻塞问题",
              "架构评审通过——ADR 已更新",
              "无障碍审计——符合 WCAG 2.1 AA",
              "性能回归在 2% 阈值内",
              "法律/合规签署已获得",
            ],
          },
        ],
      },
      {
        id: "criteria",
        label: "标准",
        icon: "✓",
        title: "验收标准",
        subtitle: "所有需求的详细验证",
        countLabel: "24 项标准",
        stats: [
          { value: "20", label: "通过", color: "var(--style-46-critical)" },
          { value: "2", label: "部分", color: "var(--style-46-high)" },
          { value: "1", label: "失败", color: "var(--style-46-medium)" },
          { value: "1", label: "不适用", color: "var(--style-46-low)" },
        ],
        findings: [
          {
            severity: "通过",
            severityClass: "critical",
            title: "令牌刷新竞态条件已解决",
            desc: "并发刷新测试：10/10 请求接收相同有效令牌。此前为 4/10。已在 3 倍负载模拟的暂存环境验证。",
            category: "功能",
            ref: "AC-001",
          },
          {
            severity: "通过",
            severityClass: "critical",
            title: "分布式锁 50ms 内获取",
            desc: "Redis SETNX 互斥锁负载下 p99 获取延迟 12ms。远低于 50ms SLA。内存锁故障转移已测试。",
            category: "性能",
            ref: "AC-002",
          },
          {
            severity: "通过",
            severityClass: "critical",
            title: "客户端请求合并生效",
            desc: "模块作用域共享 Promise 已确认。10 个并发 401 恰好产生 1 次刷新请求。网络追踪已验证。",
            category: "效率",
            ref: "AC-003",
          },
          {
            severity: "通过",
            severityClass: "critical",
            title: "令牌版本控制 CAS 正常",
            desc: "比较交换以 version_mismatch 拒绝过期写入。幂等重试在第二次尝试时成功。",
            category: "正确性",
            ref: "AC-004",
          },
          {
            severity: "部分",
            severityClass: "high",
            title: "集成测试覆盖率 82%",
            desc: "目标：90%。缺失：Redis 故障转移场景（进行中，预计7月8日）。优雅降级路径已手动验证。",
            category: "测试",
            ref: "AC-005",
          },
          {
            severity: "部分",
            severityClass: "high",
            title: "监控仪表板已更新",
            desc: "新指标：refresh_lock_wait_ms、token_version_conflicts。告警阈值已配置。运行手册需最终审查。",
            category: "可观测性",
            ref: "AC-006",
          },
          {
            severity: "未通过",
            severityClass: "medium",
            title: "E2E 竞态条件测试不稳定",
            desc: "Playwright 并发标签页刷新测试在 30 秒时间歇性超时。根因：测试工具无法正确模拟跨标签页的共享模块作用域。",
            category: "测试",
            ref: "AC-007",
          },
          {
            severity: "不适用",
            severityClass: "low",
            title: "移动端特定刷新路径",
            desc: "本轮未评估。移动 WebView 令牌处理计划在 v2.15.0 审查。现场未报告已知问题。",
            category: "覆盖范围",
            ref: "AC-008",
          },
        ],
      },
      {
        id: "quality",
        label: "质量",
        icon: "📊",
        title: "质量验证矩阵",
        subtitle: "测试结果和覆盖率评估",
        rows: [
          {
            id: "QT-1",
            control: "单元测试",
            desc: "247 个测试，变更代码 98% 覆盖率",
            level: "通过",
            levelClass: "low",
            status: "完成",
            statusClass: "remediated",
          },
          {
            id: "QT-2",
            control: "集成测试",
            desc: "42 个测试，包括并发刷新场景",
            level: "通过",
            levelClass: "low",
            status: "完成",
            statusClass: "remediated",
          },
          {
            id: "QT-3",
            control: "端到端测试",
            desc: "18 个浏览器测试，跨 3 个流程——1 个不稳定竞态测试",
            level: "部分通过",
            levelClass: "high",
            status: "进行中",
            statusClass: "open",
          },
          {
            id: "QT-4",
            control: "负载测试",
            desc: "3 倍峰值流量，0 令牌冲突",
            level: "通过",
            levelClass: "low",
            status: "完成",
            statusClass: "remediated",
          },
          {
            id: "QT-5",
            control: "安全扫描",
            desc: "Trivy + Snyk——0 严重，2 低（已接受）",
            level: "通过",
            levelClass: "low",
            status: "完成",
            statusClass: "accepted",
          },
          {
            id: "QT-6",
            control: "无障碍",
            desc: "axe-core 扫描——WCAG 2.1 AA，0 违规",
            level: "通过",
            levelClass: "low",
            status: "完成",
            statusClass: "remediated",
          },
          {
            id: "QT-7",
            control: "性能",
            desc: "p99 刷新延迟 268ms（原为 840ms）",
            level: "通过",
            levelClass: "low",
            status: "完成",
            statusClass: "remediated",
          },
          {
            id: "QT-8",
            control: "混沌/弹性",
            desc: "Redis 故障转移：200ms 降级，但已识别重试风暴风险",
            level: "未通过",
            levelClass: "medium",
            status: "需行动",
            statusClass: "open",
          },
        ],
      },
      {
        id: "signoff",
        label: "签署",
        icon: "✅",
        title: "最终签署台账",
        subtitle: "总体就绪判定",
        scoreLabel: "总体就绪度",
        scoreTitle: "准予部署——附条件",
        scoreText:
          "89% 的验收标准已满足。两项部分项（集成测试覆盖率和监控运行手册）须在部署后 48 小时内完成。一项失败项（文档更新）非阻塞，计划在 v2.14.1 修复。建议：以 10% 流量进行金丝雀部署。",
        items: [
          {
            text: "所有功能验收标准已在暂存环境验证",
            ref: "AC-001–004",
            status: "pass",
          },
          {
            text: "性能基准超出目标阈值",
            ref: "QT-7",
            status: "pass",
          },
          {
            text: "安全和无障碍审计通过，无阻塞项",
            ref: "QT-5, QT-6",
            status: "pass",
          },
          {
            text: "集成测试覆盖率低于 90% 目标（当前 82%）",
            ref: "AC-005",
            status: "fail",
          },
          {
            text: "监控运行手册待 SRE 团队最终审查",
            ref: "AC-006",
            status: "partial",
          },
          {
            text: "回滚程序已记录并完成演练测试",
            ref: "Build-06",
            status: "pass",
          },
          {
            text: "功能开关 auth.refresh.v2 已配置用于即时回滚",
            ref: "Build-06",
            status: "pass",
          },
          {
            text: "文档更新推迟至 v2.14.1 补丁发布",
            ref: "Docs-01",
            status: "partial",
          },
          {
            text: "部署通知已发送给所有利益相关者",
            ref: "Comms",
            status: "pass",
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

export default function AuditReport({
  scene,
  beat,
  language,
  isThumbnail,
  reducedMotion,
  onNavigate,
}: BespokeStyleProps) {
  const [entered, setEntered] = useState(false);

  useLayoutEffect(() => {
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

  // FLIP for findings list (scene 3)
  const { ref: findingsListRef } = useFLIP<HTMLDivElement>({
    watch: [beat],
    duration: 400,
    easing: "cubic-bezier(0.16, 1, 0.3, 1)",
  });

  // FLIP for risk table rows (scene 4)
  const { ref: riskTableRef } = useFLIP<HTMLTableSectionElement>({
    watch: [beat],
    duration: 400,
    easing: "cubic-bezier(0.16, 1, 0.3, 1)",
    selector: "tr",
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
          <div className={styles.reportHeader}>
            <div className={styles.reportHeaderTop}>
              <div className={styles.reportFirmLogo}>M</div>
              <div className={styles.reportFirmInfo}>
                <div className={styles.reportFirmName}>{sd.firm}</div>
                <div className={styles.reportFirmTagline}>{sd.tagline}</div>
              </div>
            </div>
            <div className={styles.reportType}>{sd.type}</div>
            <h1 className={styles.reportTitle}>
              {sd.title}{" "}
              <span className={styles.reportTitleAccent}>{sd.titleAccent}</span>
            </h1>
            <p className={styles.reportSubtitle}>{sd.subtitle}</p>
            <div className={styles.reportMeta}>
              {sd.meta.map((m, i) => (
                <div key={i} className={styles.reportMetaItem}>
                  <span className={styles.reportMetaLabel}>{m.label}</span>
                  <span className={styles.reportMetaValue}>{m.value}</span>
                </div>
              ))}
            </div>
          </div>
        );
      }

      case 2: {
        const sd = s as (typeof data.scenes)[1];
        return (
          <div className={styles.scope}>
            <div className={styles.scopeHeader}>
              <h2 className={styles.scopeTitle}>{sd.title}</h2>
              <p className={styles.scopeSubtitle}>{sd.subtitle}</p>
            </div>
            <div className={styles.scopeBody}>
              {sd.sections.map((sec, i) => (
                <div
                  key={i}
                  className={styles.scopeSection}
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
      }

      case 3: {
        const sd = s as (typeof data.scenes)[2];
        const visibleCount = Math.min(beatNum * 2 + 2, sd.findings.length);
        return (
          <div className={styles.findings}>
            <div className={styles.findingsHeader}>
              <h2 className={styles.findingsTitle}>{sd.title}</h2>
              <span className={styles.findingsCount}>{sd.countLabel}</span>
            </div>
            <div className={styles.findingsSummary}>
              {sd.stats.map((stat, i) => (
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
            <div
              ref={isCurrent ? findingsListRef : undefined}
              className={styles.findingsList}
            >
              {sd.findings.slice(0, visibleCount).map((f, i) => (
                <div
                  key={f.ref}
                  className={`${styles.findingItem} ${showEntered ? styles.findingItemVisible : ""}`}
                  style={{
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
      }

      case 4: {
        const sd = s as (typeof data.scenes)[3];
        const visibleCount = Math.min(beatNum * 3 + 3, sd.rows.length);
        return (
          <div className={styles.riskMatrix}>
            <div className={styles.riskHeader}>
              <h2 className={styles.riskTitle}>{sd.title}</h2>
              <p className={styles.riskSubtitle}>{sd.subtitle}</p>
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
                <tbody ref={isCurrent ? riskTableRef : undefined}>
                  {sd.rows.slice(0, visibleCount).map((row, i) => (
                    <tr
                      key={row.id}
                      style={{
                        opacity: showEntered ? 1 : 0,
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
      }

      case 5: {
        const sd = s as (typeof data.scenes)[4];
        return (
          <div className={styles.compliance}>
            <div className={styles.complianceHeader}>
              <h2 className={styles.complianceTitle}>{sd.title}</h2>
              <p className={styles.complianceSubtitle}>{sd.subtitle}</p>
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
                    {sd.scoreLabel}
                  </div>
                  <h3 className={styles.complianceScoreTitle}>{sd.scoreTitle}</h3>
                  <p className={styles.complianceScoreText}>{sd.scoreText}</p>
                </div>
              </div>
            </div>
            <div className={styles.complianceItems}>
              {sd.items.map((item, i) => (
                <div
                  key={i}
                  className={styles.complianceItem}
                  style={{
                    opacity: showEntered && (beatNum >= 1 || i < 4) ? 1 : 0,
                    transform:
                      showEntered && (beatNum >= 1 || i < 4)
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
      }

      default:
        return null;
    }
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

  // ── Build layer classes ─────────────────────────────────────────────────

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
            {renderSceneFor(sceneId, sceneBeat, isActive)}
          </div>
        )}
      />

      {/* Audit finding stamp overlay */}

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
      bg: "#fbfbfb",
      ink: "#111827",
      panel: "#f3f4f6",
    },
    typography: {
      header: "Inter 700",
      body: "Inter 400",
    },
    tags: lang === "zh"
      ? ["检查清单", "台账", "验收", "就绪", "质量"]
      : ["checklist", "ledger", "acceptance", "readiness", "quality", "verification", "criteria"],
    fonts: ["Inter", "cjk:Noto Sans SC"],
    scenes: [
      {
        id: 1,
        title: lang === "zh" ? "标题" : "Header",
        beats: [
          { id: 0, action: "beat-0", title: lang === "zh" ? "完整标题页" : "Full checklist header" , body: "" },
        ],
      },
      {
        id: 2,
        title: lang === "zh" ? "就绪检查" : "Readiness",
        beats: [
          { id: 0, action: "beat-0", title: lang === "zh" ? "构建检查" : "Build checks" , body: "" },
          { id: 1, action: "beat-1", title: lang === "zh" ? "评审检查" : "Review checks" , body: "" },
        ],
      },
      {
        id: 3,
        title: lang === "zh" ? "验收标准" : "Criteria",
        beats: [
          { id: 0, action: "beat-0", title: lang === "zh" ? "前两项标准" : "First two criteria" , body: "" },
          { id: 1, action: "beat-1", title: lang === "zh" ? "前四项标准" : "First four criteria" , body: "" },
          { id: 2, action: "beat-2", title: lang === "zh" ? "全部标准" : "All criteria" , body: "" },
        ],
      },
      {
        id: 4,
        title: lang === "zh" ? "质量矩阵" : "Quality Matrix",
        beats: [
          { id: 0, action: "beat-0", title: lang === "zh" ? "前三项控制" : "First three controls" , body: "" },
          { id: 1, action: "beat-1", title: lang === "zh" ? "前六项控制" : "First six controls" , body: "" },
          { id: 2, action: "beat-2", title: lang === "zh" ? "全部控制" : "All controls" , body: "" },
        ],
      },
      {
        id: 5,
        title: lang === "zh" ? "最终签署" : "Sign-off",
        beats: [
          { id: 0, action: "beat-0", title: lang === "zh" ? "评分和前四项" : "Score and first 4 items" , body: "" },
          { id: 1, action: "beat-1", title: lang === "zh" ? "全部签署项" : "All sign-off items" , body: "" },
        ],
      },
    ],
  };
}

const enMeta = {
  name: "Checklist Ledger",
  theme: "Readiness checks and acceptance criteria — uniform aligned checkable list with calm confirming green",
  densityLabel: "Comprehensive",
};

const zhMeta = {
  name: "检查清单台账",
  theme: "就绪检查和验收标准——统一对齐的可勾选列表，平静确认绿色",
  densityLabel: "全面",
};

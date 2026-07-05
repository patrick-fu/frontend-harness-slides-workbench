import { useState, useEffect, useCallback } from "react";
import type { BespokeStyleProps, StyleMetadata } from "../types";
import styles from "./44-meeting-minutes.module.css";

/* ── Content ─────────────────────────────────────────────────────────────── */

const SCENES = {
  en: {
    scenes: [
      {
        id: "header",
        label: "Header",
        icon: "📋",
        org: "Nexus Technologies Inc.",
        orgSub: "Board of Directors",
        title: "Quarterly Board",
        titleAccent: "Meeting",
        titleSuffix: "Minutes",
        meta: [
          { label: "Date", value: "March 14, 2025" },
          { label: "Time", value: "10:00 AM – 12:30 PM EST" },
          { label: "Location", value: "HQ Boardroom / Hybrid" },
          { label: "Minutes By", value: "S. Chen, Corp. Sec." },
        ],
      },
      {
        id: "attendance",
        label: "Attendance",
        icon: "👥",
        title: "Attendance",
        subtitle: "Roll call and quorum verification",
        present: [
          { name: "James R. Thornton", role: "Chairman & CEO" },
          { name: "Maria S. Alvarez", role: "Lead Independent Director" },
          { name: "David K. Chen", role: "CFO" },
          { name: "Priya N. Raman", role: "CTO" },
          { name: "Robert T. Hayes", role: "Director, Audit Chair" },
          { name: "Linda M. Okafor", role: "Director, Comp. Chair" },
        ],
        absent: [
          { name: "Thomas W. Park", role: "Director, Governance Chair" },
        ],
        guests: [
          { name: "External Auditor (PwC)", role: "Invited" },
          { name: "General Counsel", role: "Advisory" },
        ],
        quorum: "Quorum confirmed: 6 of 7 directors present.",
      },
      {
        id: "discussion",
        label: "Discussion",
        icon: "💬",
        title: "Discussion Items",
        subtitle: "Key topics from the agenda",
        items: [
          {
            num: "Agenda Item 4.1",
            topic: "Q4 Financial Results Review",
            notes:
              "CFO presented Q4 results: revenue $842M (+18% YoY), operating margin 23.4%. Board discussed margin compression in EMEA segment. Management to present cost optimization plan at next meeting.",
          },
          {
            num: "Agenda Item 4.2",
            topic: "AI Product Strategy Update",
            notes:
              "CTO demonstrated new AI assistant platform. Beta adoption exceeded projections at 34K enterprise users. Board questioned go-to-market timeline and competitive positioning vs. major cloud providers.",
          },
          {
            num: "Agenda Item 4.3",
            topic: "Cybersecurity Posture",
            notes:
              "CISO presented SOC 2 Type II results. Three findings identified, all rated Low. Remediation plan approved. Board requested quarterly security briefings going forward.",
          },
          {
            num: "Agenda Item 4.4",
            topic: "Executive Compensation Review",
            notes:
              "Compensation Committee recommended 8% base salary adjustment for named executives. Performance equity pool set at $45M. Shareholder advisory vote scheduled for AGM.",
          },
        ],
      },
      {
        id: "actions",
        label: "Action Items",
        icon: "✅",
        title: "Action Items",
        badge: "6 Open",
        actions: [
          {
            id: "A-01",
            desc: "Prepare EMEA cost optimization analysis with 3 scenarios",
            owner: "D. Chen",
            dept: "Finance",
            deadline: "Apr 11, 2025",
            status: "Open",
            urgent: false,
          },
          {
            id: "A-02",
            desc: "Draft AI platform competitive positioning whitepaper for board review",
            owner: "P. Raman",
            dept: "Engineering",
            deadline: "Apr 4, 2025",
            status: "In Progress",
            urgent: true,
          },
          {
            id: "A-03",
            desc: "Implement quarterly cybersecurity briefing cadence",
            owner: "CISO Office",
            dept: "Security",
            deadline: "Apr 30, 2025",
            status: "Open",
            urgent: false,
          },
          {
            id: "A-04",
            desc: "File executive compensation proxy statement with SEC",
            owner: "S. Chen",
            dept: "Legal",
            deadline: "Mar 28, 2025",
            status: "In Progress",
            urgent: true,
          },
          {
            id: "A-05",
            desc: "Schedule governance committee meeting to fill Park's absence",
            owner: "M. Alvarez",
            dept: "Board",
            deadline: "Mar 21, 2025",
            status: "Open",
            urgent: true,
          },
          {
            id: "A-06",
            desc: "Distribute updated board materials calendar for Q2",
            owner: "S. Chen",
            dept: "Corp. Sec.",
            deadline: "Apr 1, 2025",
            status: "Open",
            urgent: false,
          },
        ],
      },
      {
        id: "decisions",
        label: "Decisions",
        icon: "📌",
        title: "Decisions & Next Steps",
        subtitle: "Formal resolutions and upcoming schedule",
        decisions: [
          {
            num: "1",
            topic: "Q4 Financial Results",
            text: "RESOLVED: The Board accepts the Q4 2024 financial statements as presented by the CFO. Management directed to address EMEA margin trends.",
            vote: "Unanimous (6-0, 1 absent)",
          },
          {
            num: "2",
            topic: "AI Platform Investment",
            text: "RESOLVED: The Board approves additional $25M investment in AI platform development, contingent on revised go-to-market plan review.",
            vote: "Passed (5-1, Thornton abstained)",
          },
          {
            num: "3",
            topic: "Executive Compensation",
            text: "RESOLVED: The Board approves the 2025 executive compensation program as recommended by the Compensation Committee.",
            vote: "Unanimous (6-0, 1 absent)",
          },
        ],
        nextLabel: "Next Meeting",
        nextDate: "June 13, 2025",
        nextTime: "10:00 AM EST",
      },
    ],
  },
  zh: {
    scenes: [
      {
        id: "header",
        label: "标题",
        icon: "📋",
        org: "联科科技股份有限公司",
        orgSub: "董事会",
        title: "季度董事会议",
        titleAccent: "纪要",
        titleSuffix: "",
        meta: [
          { label: "日期", value: "2025年3月14日" },
          { label: "时间", value: "上午10:00 – 12:30" },
          { label: "地点", value: "总部会议室 / 线上" },
          { label: "记录人", value: "陈思明 董事会秘书" },
        ],
      },
      {
        id: "attendance",
        label: "出席",
        icon: "👥",
        title: "出席情况",
        subtitle: "点名与法定人数确认",
        present: [
          { name: "詹姆斯·桑顿", role: "董事长兼CEO" },
          { name: "玛丽亚·阿尔瓦雷斯", role: "首席独立董事" },
          { name: "陈大伟", role: "首席财务官" },
          { name: "普里亚·拉曼", role: "首席技术官" },
          { name: "罗伯特·海斯", role: "董事、审计委员会主席" },
          { name: "琳达·奥卡福", role: "董事、薪酬委员会主席" },
        ],
        absent: [
          { name: "托马斯·朴", role: "董事、治理委员会主席" },
        ],
        guests: [
          { name: "外部审计师（普华永道）", role: "受邀" },
          { name: "法务总监", role: "顾问" },
        ],
        quorum: "法定人数确认：7名董事中6名出席。",
      },
      {
        id: "discussion",
        label: "讨论",
        icon: "💬",
        title: "讨论事项",
        subtitle: "议程中的关键议题",
        items: [
          {
            num: "议程 4.1",
            topic: "第四季度财务业绩审查",
            notes:
              "CFO汇报Q4业绩：营收8.42亿美元（同比+18%），营业利润率23.4%。董事会讨论了EMEA地区利润率压缩问题。管理层将在下次会议提交成本优化方案。",
          },
          {
            num: "议程 4.2",
            topic: "AI产品战略更新",
            notes:
              "CTO演示了新AI助手平台。Beta版采用率超出预期，达3.4万企业用户。董事会质疑了上市时间表和与主要云厂商的竞争定位。",
          },
          {
            num: "议程 4.3",
            topic: "网络安全态势",
            notes:
              "CISO汇报SOC 2 Type II审计结果。发现三项问题，均为低风险。整改方案已批准。董事会要求今后每季度进行安全简报。",
          },
          {
            num: "议程 4.4",
            topic: "高管薪酬审查",
            notes:
              "薪酬委员会建议高管基本工资调整8%。绩效股权激励池设定为4500万美元。股东咨询投票定于年度股东大会进行。",
          },
        ],
      },
      {
        id: "actions",
        label: "行动项",
        icon: "✅",
        title: "行动项",
        badge: "6 项待办",
        actions: [
          {
            id: "A-01",
            desc: "准备EMEA成本优化分析，含3种情景",
            owner: "陈大伟",
            dept: "财务部",
            deadline: "2025-04-11",
            status: "待办",
            urgent: false,
          },
          {
            id: "A-02",
            desc: "起草AI平台竞争定位白皮书供董事会审阅",
            owner: "普里亚·拉曼",
            dept: "工程部",
            deadline: "2025-04-04",
            status: "进行中",
            urgent: true,
          },
          {
            id: "A-03",
            desc: "落实季度网络安全简报机制",
            owner: "CISO办公室",
            dept: "安全部",
            deadline: "2025-04-30",
            status: "待办",
            urgent: false,
          },
          {
            id: "A-04",
            desc: "向SEC提交高管薪酬代理声明",
            owner: "陈思明",
            dept: "法务部",
            deadline: "2025-03-28",
            status: "进行中",
            urgent: true,
          },
          {
            id: "A-05",
            desc: "安排治理委员会会议以补朴董事缺席",
            owner: "玛丽亚·阿尔瓦雷斯",
            dept: "董事会",
            deadline: "2025-03-21",
            status: "待办",
            urgent: true,
          },
          {
            id: "A-06",
            desc: "分发Q2更新后的董事会议程日历",
            owner: "陈思明",
            dept: "董秘办",
            deadline: "2025-04-01",
            status: "待办",
            urgent: false,
          },
        ],
      },
      {
        id: "decisions",
        label: "决议",
        icon: "📌",
        title: "决议与后续安排",
        subtitle: "正式决议和即将到来的日程",
        decisions: [
          {
            num: "1",
            topic: "Q4财务业绩",
            text: "决议：董事会接受CFO提交的2024年Q4财务报表。指示管理层关注EMEA利润率趋势。",
            vote: "一致通过（6-0，1人缺席）",
          },
          {
            num: "2",
            topic: "AI平台投资",
            text: "决议：董事会批准追加2500万美元投资AI平台开发，以修订后的上市计划审查为条件。",
            vote: "通过（5-1，桑顿弃权）",
          },
          {
            num: "3",
            topic: "高管薪酬",
            text: "决议：董事会批准薪酬委员会建议的2025年高管薪酬方案。",
            vote: "一致通过（6-0，1人缺席）",
          },
        ],
        nextLabel: "下次会议",
        nextDate: "2025年6月13日",
        nextTime: "上午10:00",
      },
    ],
  },
} as const;

/* ── Component ───────────────────────────────────────────────────────────── */

export default function MeetingMinutes({
  scene,
  beat,
  language,
  isThumbnail,
  reducedMotion,
  onNavigate,
}: BespokeStyleProps) {
  const [entered, setEntered] = useState(false);

  /* Font injection */
  useEffect(() => {
    const id = "style-44-fonts";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Noto+Sans+SC:wght@400;500;700&display=swap";
    document.head.appendChild(link);
  }, []);

  /* Enter animation on scene change */
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

  /* ── Scene 1: Header ─────────────────────────────────────────────────── */
  const renderHeader = () => {
    const s = sceneData as (typeof data.scenes)[0];
    return (
      <div className={styles.header}>
        <div className={styles.headerTop}>
          <div className={styles.headerLogo}>N</div>
          <div>
            <div className={styles.headerOrg}>{s.org}</div>
            <div className={styles.headerOrgSub}>{s.orgSub}</div>
          </div>
        </div>
        <h1 className={styles.headerTitle}>
          {s.title}{" "}
          <span className={styles.headerTitleAccent}>{s.titleAccent}</span>{" "}
          {s.titleSuffix}
        </h1>
        <div className={styles.headerMeta}>
          {s.meta.map((m, i) => (
            <div key={i} className={styles.headerMetaItem}>
              <span className={styles.headerMetaLabel}>{m.label}</span>
              <span className={styles.headerMetaValue}>{m.value}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  /* ── Scene 2: Attendance ─────────────────────────────────────────────── */
  const renderAttendance = () => {
    const s = sceneData as (typeof data.scenes)[1];
    return (
      <div className={styles.attendance}>
        <div className={styles.attendanceHeader}>
          <h2 className={styles.attendanceTitle}>{s.title}</h2>
          <p className={styles.attendanceSubtitle}>{s.subtitle}</p>
        </div>
        <div className={styles.attendanceGrid}>
          <div className={styles.attendanceGroup}>
            <div className={styles.attendanceGroupLabel}>
              {language === "zh" ? "出席" : "Present"}
              <span className={styles.attendanceCount}>{s.present.length}</span>
            </div>
            <ul className={styles.attendeeList}>
              {s.present.map((p, i) => (
                <li
                  key={i}
                  className={styles.attendeeItem}
                  style={{
                    opacity: entered && beat >= 0 && i <= beat ? 1 : 0,
                    transform:
                      entered && beat >= 0 && i <= beat
                        ? "translateX(0)"
                        : "translateX(-1cqw)",
                    transition: "opacity 0.35s ease, transform 0.35s ease",
                    transitionDelay: `${i * 0.06}s`,
                  }}
                >
                  <div
                    className={`${styles.attendeeCheckbox} ${styles.attendeeCheckboxChecked}`}
                  >
                    <span className={styles.attendeeCheck}>✓</span>
                  </div>
                  <span className={styles.attendeeName}>{p.name}</span>
                  <span className={styles.attendeeRole}>— {p.role}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div
              className={styles.attendanceGroup}
              style={{ marginBottom: "1.5cqh" }}
            >
              <div className={styles.attendanceGroupLabel}>
                {language === "zh" ? "缺席" : "Absent"}
                <span className={styles.attendanceCount}>
                  {s.absent.length}
                </span>
              </div>
              <ul className={styles.attendeeList}>
                {s.absent.map((p, i) => (
                  <li key={i} className={styles.attendeeItem}>
                    <div
                      className={`${styles.attendeeCheckbox} ${styles.attendeeCheckboxAbsent}`}
                    >
                      <span style={{ fontSize: "1.2cqh", color: "#fca5a5" }}>
                        ✕
                      </span>
                    </div>
                    <span
                      className={`${styles.attendeeName} ${styles.attendeeAbsentText}`}
                    >
                      {p.name}
                    </span>
                    <span className={styles.attendeeRole}>— {p.role}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className={styles.attendanceGroup}>
              <div className={styles.attendanceGroupLabel}>
                {language === "zh" ? "列席" : "Guests"}
                <span className={styles.attendanceCount}>
                  {s.guests.length}
                </span>
              </div>
              <ul className={styles.attendeeList}>
                {s.guests.map((p, i) => (
                  <li key={i} className={styles.attendeeItem}>
                    <div
                      className={styles.attendeeCheckbox}
                      style={{ background: "#fef3c7", borderColor: "#fcd34d" }}
                    >
                      <span style={{ fontSize: "1.2cqh", color: "#d97706" }}>
                        ○
                      </span>
                    </div>
                    <span className={styles.attendeeName}>{p.name}</span>
                    <span className={styles.attendeeRole}>— {p.role}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  };

  /* ── Scene 3: Discussion ─────────────────────────────────────────────── */
  const renderDiscussion = () => {
    const s = sceneData as (typeof data.scenes)[2];
    return (
      <div className={styles.discussion}>
        <div className={styles.discussionHeader}>
          <h2 className={styles.discussionTitle}>{s.title}</h2>
          <p className={styles.discussionSubtitle}>{s.subtitle}</p>
        </div>
        <div className={styles.discussionItems}>
          {s.items.map((item, i) => (
            <div
              key={i}
              className={styles.discussionItem}
              style={{
                opacity: entered && i <= beat ? 1 : 0,
                transform:
                  entered && i <= beat
                    ? "translateY(0)"
                    : "translateY(0.8cqh)",
                transition: "opacity 0.4s ease, transform 0.4s ease",
                transitionDelay: `${i * 0.1}s`,
              }}
            >
              <div className={styles.discussionItemNum}>{item.num}</div>
              <h3 className={styles.discussionItemTopic}>{item.topic}</h3>
              <p className={styles.discussionItemNotes}>{item.notes}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  /* ── Scene 4: Action Items (HERO) ────────────────────────────────────── */
  const renderActions = () => {
    const s = sceneData as (typeof data.scenes)[3];
    const visibleCount = Math.min(beat * 3 + 3, s.actions.length);
    return (
      <div className={styles.actions}>
        <div className={styles.actionsHeader}>
          <h2 className={styles.actionsTitle}>{s.title}</h2>
          <span className={styles.actionsBadge}>{s.badge}</span>
        </div>
        <table className={styles.actionTable}>
          <thead>
            <tr>
              <th>{language === "zh" ? "编号" : "ID"}</th>
              <th>{language === "zh" ? "描述" : "Description"}</th>
              <th>{language === "zh" ? "负责人" : "Owner"}</th>
              <th>{language === "zh" ? "截止" : "Deadline"}</th>
              <th>{language === "zh" ? "状态" : "Status"}</th>
            </tr>
          </thead>
          <tbody>
            {s.actions.slice(0, visibleCount).map((a, i) => (
              <tr
                key={a.id}
                style={{
                  opacity: entered ? 1 : 0,
                  transform: entered ? "translateY(0)" : "translateY(0.5cqh)",
                  transition: "opacity 0.3s ease, transform 0.3s ease",
                  transitionDelay: `${i * 0.07}s`,
                }}
              >
                <td className={styles.actionId}>{a.id}</td>
                <td className={styles.actionDesc}>{a.desc}</td>
                <td>
                  <span className={styles.actionOwner}>{a.owner}</span>
                  <span className={styles.actionOwnerDept}>{a.dept}</span>
                </td>
                <td
                  className={`${styles.actionDeadline} ${
                    a.urgent ? styles.actionDeadlineUrgent : ""
                  }`}
                >
                  {a.deadline}
                </td>
                <td>
                  <span
                    className={`${styles.actionStatus} ${
                      a.status === "In Progress" || a.status === "进行中"
                        ? styles.actionStatusInProgress
                        : styles.actionStatusOpen
                    }`}
                  >
                    <span
                      className={styles.actionStatusDot}
                      style={{
                        background:
                          a.status === "In Progress" || a.status === "进行中"
                            ? "#2563eb"
                            : "#d97706",
                      }}
                    />
                    {a.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  /* ── Scene 5: Decisions ──────────────────────────────────────────────── */
  const renderDecisions = () => {
    const s = sceneData as (typeof data.scenes)[4];
    return (
      <div className={styles.decisions}>
        <div className={styles.decisionsHeader}>
          <h2 className={styles.decisionsTitle}>{s.title}</h2>
          <p className={styles.decisionsSubtitle}>{s.subtitle}</p>
        </div>
        <div className={styles.decisionList}>
          {s.decisions.map((d, i) => (
            <div
              key={i}
              className={styles.decisionItem}
              style={{
                opacity: entered && i <= beat ? 1 : 0,
                transform:
                  entered && i <= beat
                    ? "translateX(0)"
                    : "translateX(-0.8cqh)",
                transition: "opacity 0.4s ease, transform 0.4s ease",
                transitionDelay: `${i * 0.12}s`,
              }}
            >
              <div className={styles.decisionNum}>{d.num}</div>
              <div className={styles.decisionContent}>
                <h3 className={styles.decisionTopic}>{d.topic}</h3>
                <p className={styles.decisionText}>{d.text}</p>
                <div className={styles.decisionVote}>{d.vote}</div>
              </div>
            </div>
          ))}
        </div>
        <div className={styles.nextMeeting}>
          <span className={styles.nextMeetingLabel}>{s.nextLabel}</span>
          <span className={styles.nextMeetingValue}>
            {s.nextDate} <span>· {s.nextTime}</span>
          </span>
        </div>
      </div>
    );
  };

  /* ── Navigation ──────────────────────────────────────────────────────── */
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

  /* ── Render ──────────────────────────────────────────────────────────── */
  const renderScene = () => {
    switch (scene) {
      case 1:
        return renderHeader();
      case 2:
        return renderAttendance();
      case 3:
        return renderDiscussion();
      case 4:
        return renderActions();
      case 5:
        return renderDecisions();
      default:
        return null;
    }
  };

  return (
    <div className={rootClasses}>
      <div key={`44-${scene}`} className={`${styles.transitionTrack} ${styles.animateSceneEnter}`}>
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
    id: "44",
    band: "text-report",
    name: t.name,
    theme: t.theme,
    densityLabel: t.densityLabel,
    heroScene: 4,
    colors: {
      bg: "#ffffff",
      ink: "#1f2937",
      panel: "#f3f4f6",
    },
    typography: {
      header: "Inter, system-ui, sans-serif",
      body: "Inter, system-ui, sans-serif",
    },
    tags: lang === "zh"
      ? ["会议纪要", "行动项", "董事会", "企业"]
      : ["meeting-minutes", "action-items", "board", "corporate"],
    fonts: ["Inter", "cjk:Noto Sans SC"],
    scenes: [
      {
        id: 1,
        title: lang === "zh" ? "会议标题" : "Meeting Header",
        beats: [
          { id: 0, action: "beat-0", title: lang === "zh" ? "完整标题页" : "Full header page", body: "" },
        ],
      },
      {
        id: 2,
        title: lang === "zh" ? "出席情况" : "Attendance",
        beats: [
          { id: 0, action: "beat-0", title: lang === "zh" ? "第一批出席者" : "First batch of attendees", body: "" },
          { id: 1, action: "beat-1", title: lang === "zh" ? "全部出席者显示" : "All attendees shown", body: "" },
        ],
      },
      {
        id: 3,
        title: lang === "zh" ? "讨论事项" : "Discussion Items",
        beats: [
          { id: 0, action: "beat-0", title: lang === "zh" ? "前两项议题" : "First two topics", body: "" },
          { id: 1, action: "beat-1", title: lang === "zh" ? "全部议题" : "All topics", body: "" },
        ],
      },
      {
        id: 4,
        title: lang === "zh" ? "行动项" : "Action Items",
        beats: [
          { id: 0, action: "beat-0", title: lang === "zh" ? "前三项行动" : "First three actions", body: "" },
          { id: 1, action: "beat-1", title: lang === "zh" ? "全部行动项" : "All action items", body: "" },
        ],
      },
      {
        id: 5,
        title: lang === "zh" ? "决议" : "Decisions",
        beats: [
          { id: 0, action: "beat-0", title: lang === "zh" ? "决议与下次会议" : "Decisions and next meeting", body: "" },
        ],
      },
    ],
  };
}

const enMeta = {
  name: "Meeting Minutes",
  theme: "Board meeting minutes with action items and attendance tracking",
  densityLabel: "Structured",
};

const zhMeta = {
  name: "会议纪要",
  theme: "董事会议纪要，含行动项和出席追踪",
  densityLabel: "结构化",
};

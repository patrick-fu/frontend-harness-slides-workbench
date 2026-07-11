import {
  useState,
  useLayoutEffect,
  useEffect,
  useCallback,
  type MouseEvent,
} from "react";
import {
  defineTopic,
  type TopicDefinition,
  type TopicMetadata,
  type TopicNavigation,
  type TopicStageProps,
} from "../domain/topic";
import SpatialSceneTrack, {
  type SceneTransitionMap,
} from "../styles/SpatialSceneTrack";
import { useFLIP } from "../hooks/useFLIP";
import styles from "./field-notes.module.css";

/* ── Content ─────────────────────────────────────────────────────────────── */

const SCENES = {
  en: {
    scenes: [
      {
        id: "header",
        label: "Cover",
        icon: "📓",
        org: "Field Research Division",
        orgSub: "Urban Mobility Study",
        title: "Field Notes",
        titleAccent: "Volume",
        titleSuffix: "III",
        meta: [
          { label: "Date", value: "July 2–4, 2026" },
          { label: "Location", value: "Downtown Transit Hub, Sector 7" },
          { label: "Researcher", value: "Dr. Elena Vasquez" },
          { label: "Notebook", value: "FN-2026-041" },
        ],
      },
      {
        id: "observations",
        label: "Observations",
        icon: "👁",
        title: "Field Observations",
        subtitle: "Timestamped entries from three days in the field",
        present: [
          { name: "09:14 — Morning rush", role: "Commuter flow peaks at 2,400/hr. 68% use mobile payment at turnstiles." },
          { name: "10:47 — Platform B", role: "Elderly passenger struggles with ticket machine. 3min assistance required." },
          { name: "12:30 — Concourse", role: "Wayfinding signage partially obscured by construction hoarding." },
          { name: "14:05 — Exit C", role: "Ride-share pickup zone overcrowded. No designated waiting area." },
          { name: "16:22 — Platform A", role: "Peak reverse commute observed. 40% of passengers traveling outbound." },
          { name: "18:50 — Evening", role: "Security presence increases. Passenger behavior shifts noticeably." },
        ],
        absent: [
          { name: "Staffed info desk", role: "Unmanned during observed hours" },
        ],
        guests: [
          { name: "Transit Police patrol", role: "Every 45 min" },
          { name: "Cleaning crew", role: "11:00 and 15:30" },
        ],
        quorum: "Total observation time: 14 hours across 3 days. 47 discrete events logged.",
      },
      {
        id: "findings",
        label: "Findings",
        icon: "💡",
        title: "Key Findings",
        subtitle: "Patterns identified across observation sessions",
        items: [
          {
            num: "Finding 1",
            topic: "Payment Friction at Peak Hours",
            notes:
              "Mobile payment success rate drops to 71% during morning rush (vs 94% off-peak). NFC reader latency increases 3x under load. Several passengers observed abandoning attempt and using cash lane instead. Estimated 180 passengers/day affected at this station alone.",
          },
          {
            num: "Finding 2",
            topic: "Accessibility Gaps",
            notes:
              "Ticket machine interface requires 20/40 vision to read at 40cm. No audio guidance available. Elevator to Platform B is out of service 12% of observed time. Ramp at Exit C has 8-degree slope exceeding ADA guidelines.",
          },
          {
            num: "Finding 3",
            topic: "Wayfinding Breakdown",
            notes:
              "Construction hoarding blocks 3 of 7 directional signs. 22% of observed passengers paused or backtracked at the concourse level. Temporary signage exists but is 40% smaller than permanent signs and placed 1.5m lower.",
          },
          {
            num: "Finding 4",
            topic: "Intermodal Connection Pain",
            notes:
              "Average walk time from train platform to ride-share pickup: 7.2 minutes. No shelter or seating at pickup zone. 34% of passengers observed using rideshare during rain events despite 2x surge pricing.",
          },
        ],
      },
      {
        id: "setup",
        label: "Setup",
        icon: "🎒",
        title: "Research Setup",
        badge: "Equipment Log",
        actions: [
          {
            id: "EQ-01",
            desc: "Sony A7 IV with 24-70mm lens — environmental documentation",
            owner: "E. Vasquez",
            dept: "Field Research",
            deadline: "Day 1–3",
            status: "Used",
            urgent: false,
          },
          {
            id: "EQ-02",
            desc: "Audio recorder (Zoom H6) — ambient sound and interview capture",
            owner: "E. Vasquez",
            dept: "Field Research",
            deadline: "Day 1–3",
            status: "Used",
            urgent: false,
          },
          {
            id: "EQ-03",
            desc: "Tally counter — passenger flow counting at 5-min intervals",
            owner: "E. Vasquez",
            dept: "Field Research",
            deadline: "Peak hours only",
            status: "Used",
            urgent: false,
          },
          {
            id: "EQ-04",
            desc: "Laser distance meter — wayfinding and accessibility measurements",
            owner: "E. Vasquez",
            dept: "Field Research",
            deadline: "Day 2 afternoon",
            status: "Used",
            urgent: false,
          },
          {
            id: "EQ-05",
            desc: "Field notebook (Moleskine A4) — handwritten observation entries",
            owner: "E. Vasquez",
            dept: "Field Research",
            deadline: "Continuous",
            status: "Used",
            urgent: false,
          },
          {
            id: "EQ-06",
            desc: "GoPro Hero 12 — time-lapse of concourse flow patterns",
            owner: "E. Vasquez",
            dept: "Field Research",
            deadline: "Day 1 full day",
            status: "Used",
            urgent: false,
          },
        ],
      },
      {
        id: "reflections",
        label: "Reflections",
        icon: "📝",
        title: "Reflections & Next Steps",
        subtitle: "Synthesis and follow-up questions",
        decisions: [
          {
            num: "1",
            topic: "Payment Infrastructure",
            text: "RECOMMENDED: Deploy additional NFC readers during peak hours and conduct load testing with 3x baseline traffic. Coordinate with payment processor to identify latency bottleneck.",
            vote: "Priority: High — Impact: 180+ passengers/day",
          },
          {
            num: "2",
            topic: "Accessibility Remediation",
            text: "RECOMMENDED: Install audio guidance on all ticket machines within 30 days. Commission engineering review of Exit C ramp. Schedule elevator reliability audit.",
            vote: "Priority: High — Regulatory: ADA compliance",
          },
          {
            num: "3",
            topic: "Intermodal Zone Redesign",
            text: "RECOMMENDED: Propose covered waiting area at ride-share pickup zone. Explore partnership with transit authority for dedicated micro-transit shuttle between station and business district.",
            vote: "Priority: Medium — Timeline: Q4 2026",
          },
        ],
        nextLabel: "Next Site Visit",
        nextDate: "August 12, 2026",
        nextTime: "Full day, Sector 12 Hub",
      },
    ],
  },
  zh: {
    scenes: [
      {
        id: "header",
        label: "封面",
        icon: "📓",
        org: "田野研究部",
        orgSub: "城市出行研究",
        title: "田野笔记",
        titleAccent: "第",
        titleSuffix: "三卷",
        meta: [
          { label: "日期", value: "2026年7月2—4日" },
          { label: "地点", value: "市中心交通枢纽，第7区" },
          { label: "研究员", value: "埃琳娜·瓦斯奎兹博士" },
          { label: "笔记编号", value: "FN-2026-041" },
        ],
      },
      {
        id: "observations",
        label: "观察",
        icon: "👁",
        title: "田野观察",
        subtitle: "三天田野调查的时间戳记录",
        present: [
          { name: "09:14 — 早高峰", role: "通勤客流峰值 2,400人/小时。68%在闸机使用移动支付。" },
          { name: "10:47 — B站台", role: "老年乘客操作售票机困难。需要3分钟协助。" },
          { name: "12:30 — 中央大厅", role: "导视牌被施工围挡部分遮挡。" },
          { name: "14:05 — C出口", role: "网约车接客区过度拥挤。无指定等候区。" },
          { name: "16:22 — A站台", role: "观察到反向通勤高峰。40%乘客出站方向。" },
          { name: "18:50 — 晚间", role: "安保力量增加。乘客行为明显变化。" },
        ],
        absent: [
          { name: "人工咨询台", role: "观察时段无人值守" },
        ],
        guests: [
          { name: "交通警察巡逻", role: "每45分钟一次" },
          { name: "清洁人员", role: "11:00 和 15:30" },
        ],
        quorum: "总观察时长：14小时，跨3天。记录47个独立事件。",
      },
      {
        id: "findings",
        label: "发现",
        icon: "💡",
        title: "关键发现",
        subtitle: "跨观察会话识别的模式",
        items: [
          {
            num: "发现 1",
            topic: "高峰时段支付摩擦",
            notes:
              "早高峰期间移动支付成功率降至 71%（非高峰为 94%）。NFC 读卡器延迟在负载下增加 3 倍。观察到数名乘客放弃尝试改用现金通道。估计仅此站每天影响 180 名乘客。",
          },
          {
            num: "发现 2",
            topic: "无障碍设施缺口",
            notes:
              "售票机界面需要 20/40 视力在 40 厘米处阅读。无音频引导。B 站台电梯在观察时间内有 12% 的时间停用。C 出口坡道坡度 8 度，超出 ADA 准则。",
          },
          {
            num: "发现 3",
            topic: "导视系统故障",
            notes:
              "施工围挡遮挡了 7 个方向标志中的 3 个。观察到 22% 的乘客在中央大厅层暂停或折返。临时标志存在但比永久标志小 40%，放置位置低 1.5 米。",
          },
          {
            num: "发现 4",
            topic: "多式联运连接痛点",
            notes:
              "从火车站台到网约车接客区平均步行时间：7.2 分钟。接客区无遮蔽或座椅。尽管有 2 倍动态加价，34% 的乘客在雨天使用网约车。",
          },
        ],
      },
      {
        id: "setup",
        label: "设备",
        icon: "🎒",
        title: "研究设备",
        badge: "设备日志",
        actions: [
          {
            id: "EQ-01",
            desc: "Sony A7 IV 配 24-70mm 镜头——环境记录",
            owner: "瓦斯奎兹",
            dept: "田野研究",
            deadline: "第1—3天",
            status: "已使用",
            urgent: false,
          },
          {
            id: "EQ-02",
            desc: "录音笔（Zoom H6）——环境音和访谈采集",
            owner: "瓦斯奎兹",
            dept: "田野研究",
            deadline: "第1—3天",
            status: "已使用",
            urgent: false,
          },
          {
            id: "EQ-03",
            desc: "计数器——每5分钟间隔客流计数",
            owner: "瓦斯奎兹",
            dept: "田野研究",
            deadline: "仅高峰时段",
            status: "已使用",
            urgent: false,
          },
          {
            id: "EQ-04",
            desc: "激光测距仪——导视和无障碍测量",
            owner: "瓦斯奎兹",
            dept: "田野研究",
            deadline: "第2天下午",
            status: "已使用",
            urgent: false,
          },
          {
            id: "EQ-05",
            desc: "田野笔记本（Moleskine A4）——手写观察记录",
            owner: "瓦斯奎兹",
            dept: "田野研究",
            deadline: "持续",
            status: "已使用",
            urgent: false,
          },
          {
            id: "EQ-06",
            desc: "GoPro Hero 12——中央大厅客流延时摄影",
            owner: "瓦斯奎兹",
            dept: "田野研究",
            deadline: "第1天全天",
            status: "已使用",
            urgent: false,
          },
        ],
      },
      {
        id: "reflections",
        label: "反思",
        icon: "📝",
        title: "反思与后续",
        subtitle: "综合分析和后续问题",
        decisions: [
          {
            num: "1",
            topic: "支付基础设施",
            text: "建议：高峰时段部署额外 NFC 读卡器，并以 3 倍基准流量进行负载测试。与支付处理商协调识别延迟瓶颈。",
            vote: "优先级：高——影响：每天 180+ 乘客",
          },
          {
            num: "2",
            topic: "无障碍整改",
            text: "建议：30 天内为所有售票机安装音频引导。委托工程部门审查 C 出口坡道。安排电梯可靠性审计。",
            vote: "优先级：高——合规：ADA 法规",
          },
          {
            num: "3",
            topic: "多式联运区重新设计",
            text: "建议：提议在网约车接客区设置有遮蔽等候区。探索与交通管理局合作，在车站和商业区之间开通专线微循环公交。",
            vote: "优先级：中——时间线：2026年第四季度",
          },
        ],
        nextLabel: "下次实地考察",
        nextDate: "2026年8月12日",
        nextTime: "全天，第12区枢纽",
      },
    ],
  },
} as const;

/* ── Component ───────────────────────────────────────────────────────────── */

const BEAT_LAYOUT_MODES = {
  2: "motion",
  3: "motion",
  4: "motion",
} satisfies Record<number, "motion" | "reserved">;

const TRANSITION_SCORE = {
  "1->2": "fade",
  "2->3": "fade",
  "3->4": "fade",
  "4->5": "fade",
} as const satisfies TopicDefinition["transitionScore"];

const TRANSITION_MAP: SceneTransitionMap = TRANSITION_SCORE;

const NAVIGATION = {
  geometry: "typographic-index",
  carrier: "field-notes-page-tabs",
  invocation: "persistent",
  feedback: "material-color-change",
} as const satisfies TopicNavigation;

function TopicStage({
  scene,
  beat,
  language,
  isThumbnail,
  reducedMotion,
  onNavigate,
}: TopicStageProps) {
  const [entered, setEntered] = useState(false);

  /* Font injection */
  useEffect(() => {
    const id = "field-notes-fonts";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Noto+Sans+SC:wght@400;500;700&display=swap";
    document.head.appendChild(link);
  }, []);

  /* Enter animation on scene change */
  useLayoutEffect(() => {
    setEntered(false);
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => setEntered(true));
    });
    return () => cancelAnimationFrame(id);
  }, [scene]);

  const handleNavClick = useCallback(
    (e: MouseEvent, target: number) => {
      e.stopPropagation();
      onNavigate?.(target, 0);
    },
    [onNavigate],
  );

  /* FLIP for action item list growth (Scene 4) */
  const { ref: flipRef } = useFLIP<HTMLTableSectionElement>({
    watch: [beat, scene],
    duration: 350,
    easing: "cubic-bezier(0.16, 1, 0.3, 1)",
  });

  const data = SCENES[language];
  const rootClasses = [styles.root, reducedMotion ? styles.reducedMotion : ""]
    .filter(Boolean)
    .join(" ");

  /* ── Scene 1: Header ─────────────────────────────────────────────────── */
  const renderHeader = (s: (typeof data.scenes)[0]) => {
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
  const renderAttendance = (
    s: (typeof data.scenes)[1],
    opts: { entered: boolean; beat: number },
  ) => {
    const e = opts.entered;
    const b = opts.beat;
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
                    opacity: e && b >= 0 && i <= b ? 1 : 0,
                    transform:
                      e && b >= 0 && i <= b
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
  const renderDiscussion = (
    s: (typeof data.scenes)[2],
    opts: { entered: boolean; beat: number },
  ) => {
    const e = opts.entered;
    const b = opts.beat;
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
                opacity: e && i <= b ? 1 : 0,
                transform:
                  e && i <= b
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
  const renderActions = (
    s: (typeof data.scenes)[3],
    opts: { entered: boolean; beat: number },
  ) => {
    const e = opts.entered;
    const b = opts.beat;
    const visibleCount = Math.min(b * 3 + 3, s.actions.length);
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
          <tbody ref={flipRef}>
            {s.actions.slice(0, visibleCount).map((a, i) => (
              <tr
                key={a.id}
                style={{
                  opacity: e ? 1 : 0,
                  transform: e ? "translateY(0)" : "translateY(0.5cqh)",
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
                      a.status === "Used" || a.status === "已使用"
                        ? styles.actionStatusInProgress
                        : styles.actionStatusOpen
                    }`}
                  >
                    <span
                      className={styles.actionStatusDot}
                      style={{
                        background:
                          a.status === "Used" || a.status === "已使用"
                            ? "#5a7a3a"
                            : "#b85c38",
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
  const renderDecisions = (
    s: (typeof data.scenes)[4],
    opts: { entered: boolean; beat: number },
  ) => {
    const e = opts.entered;
    const b = opts.beat;
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
                opacity: e && i <= b ? 1 : 0,
                transform:
                  e && i <= b
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

  /* ── Render ──────────────────────────────────────────────────────────── */
  const renderSceneByNumber = (
    num: number,
    opts: { entered: boolean; beat: number },
  ) => {
    const s = data.scenes[num - 1];
    if (!s) return null;
    switch (num) {
      case 1:
        return renderHeader(s as (typeof data.scenes)[0]);
      case 2:
        return renderAttendance(s as (typeof data.scenes)[1], opts);
      case 3:
        return renderDiscussion(s as (typeof data.scenes)[2], opts);
      case 4:
        return renderActions(s as (typeof data.scenes)[3], opts);
      case 5:
        return renderDecisions(s as (typeof data.scenes)[4], opts);
      default:
        return null;
    }
  };

  return (
    <div className={rootClasses}>
            <SpatialSceneTrack
        scene={scene}
        beat={beat}
        transitionKind="fade"
        transitionMap={TRANSITION_MAP}
        reducedMotion={reducedMotion || isThumbnail}
        beatLayoutModes={BEAT_LAYOUT_MODES}
        renderScene={(sceneId, sceneBeat, isActive) => (
          <div className={styles.sceneLayer}>
            {renderSceneByNumber(sceneId, { entered: isActive ? entered : true, beat: sceneBeat })}
          </div>
        )}
      />

      {/* Timestamp banner overlay */}

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
    heroScene: 4,
    colors: {
      bg: "#faf5eb",
      ink: "#2c2416",
      panel: "#f0e8d8",
    },
    typography: {
      header: "Georgia 700",
      body: "Source Serif Pro 400",
    },
    tags: lang === "zh"
      ? ["田野笔记", "观察", "用户研究", "笔记本"]
      : ["field-notes", "observations", "user-research", "notebook", "qualitative", "case-study"],
    fonts: ["Georgia", "Source Serif Pro", "cjk:Noto Serif SC"],
    scenes: [
      {
        id: 1,
        title: lang === "zh" ? "封面" : "Cover",
        beats: [
          { id: 0, action: "beat-0", title: lang === "zh" ? "完整封面页" : "Full cover page", body: "" },
        ],
      },
      {
        id: 2,
        title: lang === "zh" ? "观察" : "Observations",
        beats: [
          { id: 0, action: "beat-0", title: lang === "zh" ? "第一批观察记录" : "First batch of observations", body: "" },
          { id: 1, action: "beat-1", title: lang === "zh" ? "全部观察显示" : "All observations shown", body: "" },
        ],
      },
      {
        id: 3,
        title: lang === "zh" ? "发现" : "Findings",
        beats: [
          { id: 0, action: "beat-0", title: lang === "zh" ? "前两项发现" : "First two findings", body: "" },
          { id: 1, action: "beat-1", title: lang === "zh" ? "全部发现" : "All findings", body: "" },
        ],
      },
      {
        id: 4,
        title: lang === "zh" ? "设备" : "Setup",
        beats: [
          { id: 0, action: "beat-0", title: lang === "zh" ? "前三项设备" : "First three equipment", body: "" },
          { id: 1, action: "beat-1", title: lang === "zh" ? "全部设备清单" : "All equipment listed", body: "" },
        ],
      },
      {
        id: 5,
        title: lang === "zh" ? "反思" : "Reflections",
        beats: [
          { id: 0, action: "beat-0", title: lang === "zh" ? "反思与下次考察" : "Reflections and next visit", body: "" },
        ],
      },
    ],
  };
}

const enMeta = {
  theme: "User-research observations and physical setup notes — notebook sensibility with warm aged-paper tone",
  densityLabel: "Structured",
};

const zhMeta = {
  theme: "用户研究观察和物理环境记录——温暖陈年纸张色调的笔记本风格",
  densityLabel: "结构化",
};

const metadata = {
  en: buildMetadata("en"),
  zh: buildMetadata("zh"),
} satisfies TopicDefinition["metadata"];

export default defineTopic({
  id: "field-notes",
  styleId: "field-notes-report",
  title: { en: "Field Notes", zh: "田野笔记" },
  modelId: "Doubao-Seed-Evolving",
  Stage: TopicStage,
  metadata,
  navigation: NAVIGATION,
  transitionScore: TRANSITION_SCORE,
  evidence: { kind: "none" },
});

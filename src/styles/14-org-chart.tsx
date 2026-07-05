import React, { useEffect, useState, useRef, useCallback } from "react";
import type { BespokeStyleProps, StyleMetadata } from "../types";
import styles from "./14-org-chart.module.css";

// ─── Font Injection ────────────────────────────────────────────────────────

function useFonts() {
  useEffect(() => {
    const id = "style-14-fonts";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap";
    document.head.appendChild(link);
  }, []);
}

// ─── Content ────────────────────────────────────────────────────────────────

const SCENES = {
  1: {
    en: {
      eyebrow: "Organization",
      title: "Scaling",
      titleAccent: "with purpose",
      sub: "How we structure teams for velocity, ownership, and cross-functional collaboration",
      stats: [
        { val: "420", lbl: "Team Members" },
        { val: "12", lbl: "Departments" },
        { val: "6", lbl: "Countries" },
      ],
    },
    zh: {
      eyebrow: "组织架构",
      title: "有目标地",
      titleAccent: "规模化",
      sub: "我们如何构建团队以实现速度、归属感和跨职能协作",
      stats: [
        { val: "420", lbl: "团队成员" },
        { val: "12", lbl: "部门" },
        { val: "6", lbl: "国家" },
      ],
    },
  },
  2: {
    en: {
      label: "Leadership Structure",
      title: "Our organization at a glance",
      ceo: { name: "Sarah Chen", role: "Chief Executive Officer", initials: "SC", count: "420 total" },
      vps: [
        { name: "James Park", role: "VP of Engineering", initials: "JP", count: "180", color: "Blue" },
        { name: "Maria Lopez", role: "VP of Product", initials: "ML", count: "65", color: "Green" },
        { name: "David Kim", role: "VP of Design", initials: "DK", count: "45", color: "Purple" },
        { name: "Anna Wu", role: "VP of Operations", initials: "AW", count: "80", color: "Orange" },
        { name: "Tom Baker", role: "VP of Sales", initials: "TB", count: "50", color: "Pink" },
      ],
    },
    zh: {
      label: "领导架构",
      title: "组织一览",
      ceo: { name: "陈莎拉", role: "首席执行官", initials: "SC", count: "共 420 人" },
      vps: [
        { name: "朴詹姆斯", role: "工程副总裁", initials: "JP", count: "180", color: "Blue" },
        { name: "洛佩兹玛丽亚", role: "产品副总裁", initials: "ML", count: "65", color: "Green" },
        { name: "金大卫", role: "设计副总裁", initials: "DK", count: "45", color: "Purple" },
        { name: "吴安娜", role: "运营副总裁", initials: "AW", count: "80", color: "Orange" },
        { name: "贝克汤姆", role: "销售副总裁", initials: "TB", count: "50", color: "Pink" },
      ],
    },
  },
  3: {
    en: {
      label: "Team Spotlight",
      lead: { name: "James Park", role: "VP of Engineering", initials: "JP", color: "Blue" },
      membersLabel: "Direct Reports",
      members: [
        { name: "Alex Rivera", role: "Platform Lead", initials: "AR", color: "Blue" },
        { name: "Priya Shah", role: "Infra Lead", initials: "PS", color: "Teal" },
        { name: "Mike Chen", role: "Mobile Lead", initials: "MC", color: "Green" },
        { name: "Lisa Wang", role: "Data Lead", initials: "LW", color: "Purple" },
        { name: "Ryan Lee", role: "Security Lead", initials: "RL", color: "Orange" },
        { name: "Emma Davis", role: "QA Lead", initials: "ED", color: "Pink" },
      ],
    },
    zh: {
      label: "团队聚焦",
      lead: { name: "朴詹姆斯", role: "工程副总裁", initials: "JP", color: "Blue" },
      membersLabel: "直接下属",
      members: [
        { name: "里维拉亚历克斯", role: "平台负责人", initials: "AR", color: "Blue" },
        { name: "沙普里亚", role: "基建负责人", initials: "PS", color: "Teal" },
        { name: "陈迈克", role: "移动端负责人", initials: "MC", color: "Green" },
        { name: "王丽莎", role: "数据负责人", initials: "LW", color: "Purple" },
        { name: "李瑞安", role: "安全负责人", initials: "RL", color: "Orange" },
        { name: "戴维斯艾玛", role: "测试负责人", initials: "ED", color: "Pink" },
      ],
    },
  },
  4: {
    en: {
      label: "Growth Trajectory",
      title: "Team expansion over time",
      growth: [
        { year: "2022", count: "85 people", desc: "Seed stage, core team" },
        { year: "2023", count: "180 people", desc: "Series A, first hires" },
        { year: "2024", count: "290 people", desc: "Series B, international" },
        { year: "2025", count: "380 people", desc: "Series C, scale phase" },
        { year: "2026", count: "420 people", desc: "Current headcount" },
      ],
    },
    zh: {
      label: "增长轨迹",
      title: "团队扩张历程",
      growth: [
        { year: "2022", count: "85 人", desc: "种子阶段，核心团队" },
        { year: "2023", count: "180 人", desc: "A 轮融资，首批招聘" },
        { year: "2024", count: "290 人", desc: "B 轮融资，国际化" },
        { year: "2025", count: "380 人", desc: "C 轮融资，规模化" },
        { year: "2026", count: "420 人", desc: "当前人数" },
      ],
    },
  },
  5: {
    en: {
      headline: "Great teams build <em>great products</em>",
      sub: "We invest in people because they are our greatest competitive advantage.",
      values: [
        { icon: "🎯", text: "Ownership" },
        { icon: "🤝", text: "Collaboration" },
        { icon: "📈", text: "Growth" },
      ],
    },
    zh: {
      headline: "优秀的团队打造<em>优秀的产品</em>",
      sub: "我们投资于人，因为人是最大的竞争优势。",
      values: [
        { icon: "🎯", text: "主人翁精神" },
        { icon: "🤝", text: "协作" },
        { icon: "📈", text: "成长" },
      ],
    },
  },
};

// ─── Helpers ────────────────────────────────────────────────────────────────

function avatarColorClass(color: string) {
  const map: Record<string, string> = {
    Blue: styles.avatarBlue,
    Green: styles.avatarGreen,
    Purple: styles.avatarPurple,
    Orange: styles.avatarOrange,
    Pink: styles.avatarPink,
    Teal: styles.avatarTeal,
  };
  return map[color] || styles.avatarBlue;
}

// ─── Metadata ───────────────────────────────────────────────────────────────

export function getMetadata(lang: "en" | "zh"): StyleMetadata {
  const nameMap = { en: "Org Chart", zh: "组织架构图" };
  const themeMap = {
    en: "Team Scaling Structure — organizational diagram with node-based layouts, SVG connection lines, hierarchy visualization, and team cards with avatar circles",
    zh: "团队规模化结构——节点式布局的组织图、SVG 连接线、层级可视化和带头像圆圈的团队卡片",
  };
  const densityLabelMap = { en: "Structured", zh: "结构化" };

  const sceneTitles = {
    en: ["Title", "Org Tree", "Team Detail", "Growth", "Values"],
    zh: ["标题", "组织树", "团队详情", "增长", "价值观"],
  };

  const beatActions = {
    en: {
      1: ["Title and stats appear"],
      2: ["CEO node appears", "VP nodes connect below"],
      3: ["Lead card appears", "Member cards populate"],
      4: ["Title appears", "Growth bars animate in"],
      5: ["Headline and values revealed"],
    },
    zh: {
      1: ["标题和数据呈现"],
      2: ["CEO 节点呈现", "VP 节点在下方连接"],
      3: ["领导卡片呈现", "成员卡片填充"],
      4: ["标题呈现", "增长条动画进入"],
      5: ["标题和价值观揭示"],
    },
  };

  const BEAT_COUNTS: Record<number, number> = { 1: 1, 2: 2, 3: 2, 4: 2, 5: 1 };

  const scenes = [1, 2, 3, 4, 5].map((id) => {
    const beatCount = BEAT_COUNTS[id];
    const actions = beatActions[lang][id as keyof (typeof beatActions)["en"]];
    const c = SCENES[id as keyof typeof SCENES][lang] as any;

    const beats = Array.from({ length: beatCount }, (_, beatIdx) => {
      let beatTitle = "";
      let beatBody = "";

      if (id === 1) {
        beatTitle = `${c.title} ${c.titleAccent}`;
        const stats = (c.stats as Array<{ val: string; lbl: string }>) || [];
        beatBody = stats.map((s) => `${s.val} ${s.lbl}`).join(" / ");
      } else if (id === 2) {
        beatTitle = c.title;
        if (beatIdx === 0) {
          const ceo = c.ceo as { name: string; role: string };
          beatBody = `${ceo.name} — ${ceo.role}`;
        } else {
          const vps = (c.vps as Array<{ name: string; role: string }>) || [];
          beatBody = vps.map((v) => v.name).join(" / ");
        }
      } else if (id === 3) {
        const lead = c.lead as { name: string; role: string };
        beatTitle = `${lead.name} — ${lead.role}`;
        if (beatIdx >= 1) {
          const members = (c.members as Array<{ name: string }>) || [];
          beatBody = members.map((m) => m.name).join(" / ");
        }
      } else if (id === 4) {
        beatTitle = c.title;
        if (beatIdx >= 1) {
          const growth = (c.growth as Array<{ year: string; count: string }>) || [];
          beatBody = growth.map((g) => `${g.year}: ${g.count}`).join(" / ");
        }
      } else if (id === 5) {
        beatTitle = c.headline.replace(/<[^>]+>/g, "");
        const values = (c.values as Array<{ text: string }>) || [];
        beatBody = values.map((v) => v.text).join(" / ");
      }

      return { id: beatIdx, action: actions[beatIdx], title: beatTitle, body: beatBody };
    });

    return { id, title: sceneTitles[lang][id - 1], beats };
  });

  return {
    id: "14",
    band: "balanced-hybrid",
    name: nameMap[lang],
    theme: themeMap[lang],
    densityLabel: densityLabelMap[lang],
    heroScene: 3,
    colors: { bg: "#f7fafc", ink: "#2d3748", panel: "#ffffff" },
    typography: { header: "Inter 700", body: "Inter 400" },
    tags: ["org-chart", "organization", "team", "hierarchy", "structure", "diagram", "nodes", "corporate", "scaling"],
    fonts: ["Inter"],
    scenes,
  };
}

// ─── Component ──────────────────────────────────────────────────────────────

export default function OrgChart({
  scene, beat, language, isThumbnail, reducedMotion, onNavigate,
}: BespokeStyleProps) {
  useFonts();
  const [entered, setEntered] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setEntered(false);
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => setEntered(true));
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

  const rootClasses = [styles.root, reducedMotion ? styles.reducedMotion : "", isThumbnail ? styles.thumbnail : ""].filter(Boolean).join(" ");
  const trackClasses = [styles.track, entered ? styles.trackActive : styles.trackEnter].filter(Boolean).join(" ");

  const renderScene1 = () => {
    const c = SCENES[1][language as keyof typeof SCENES[1]];
    return (
      <div className={styles.scene1}>
        <span className={styles.orgEyebrow}>{c.eyebrow}</span>
        <h1 className={styles.orgTitle}>
          {c.title}<br /><em>{c.titleAccent}</em>
        </h1>
        <p className={styles.orgSub}>{c.sub}</p>
        <div className={styles.orgStats}>
          {(c.stats as Array<{ val: string; lbl: string }>).map((s, i) => (
            <div key={i} className={styles.orgStatItem}>
              <span className={styles.orgStatVal}>{s.val}</span>
              <span className={styles.orgStatLbl}>{s.lbl}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderScene2 = () => {
    const c = SCENES[2][language as keyof typeof SCENES[2]];
    const ceo = c.ceo as { name: string; role: string; initials: string; count: string };
    const vps = c.vps as Array<{ name: string; role: string; initials: string; count: string; color: string }>;
    const ceoVisible = entered;
    const vpsVisible = beat >= 1 && entered;
    return (
      <div className={styles.scene2}>
        <div className={styles.chartHeader}>
          <span className={styles.chartLabel}>{c.label}</span>
          <h2 className={styles.chartTitle}>{c.title}</h2>
        </div>
        <div className={styles.chartArea}>
          {/* SVG connector lines */}
          <svg className={styles.chartLines} viewBox="0 0 100 60" preserveAspectRatio="none" aria-hidden="true">
            {vpsVisible && (
              <>
                <line x1="50" y1="18" x2="50" y2="28" stroke="#cbd5e0" strokeWidth="0.3" />
                <line x1="15" y1="28" x2="85" y2="28" stroke="#cbd5e0" strokeWidth="0.3" />
                {[15, 32, 50, 68, 85].map((x, i) => (
                  <line key={i} x1={x} y1="28" x2={x} y2="38" stroke="#cbd5e0" strokeWidth="0.3" />
                ))}
              </>
            )}
          </svg>
          <div className={styles.chartLevels}>
            {/* CEO level */}
            <div className={styles.chartLevel}>
              <div
                className={[styles.teamCard, styles.ceo, ceoVisible ? styles.teamCardVisible : ""].filter(Boolean).join(" ")}
                style={reducedMotion ? { opacity: ceoVisible ? 1 : 0, transform: "none" } : undefined}
              >
                <div className={[styles.avatar, styles.avatarBlue].join(" ")}>{ceo.initials}</div>
                <span className={styles.teamName}>{ceo.name}</span>
                <span className={styles.teamRole}>{ceo.role}</span>
                <span className={styles.teamCount}>{ceo.count}</span>
              </div>
            </div>
            {/* VP level */}
            <div className={styles.chartLevel} style={{ flexWrap: "wrap", maxWidth: "90%" }}>
              {vps.map((vp, i) => (
                <div
                  key={i}
                  className={[styles.teamCard, vpsVisible ? styles.teamCardVisible : ""].filter(Boolean).join(" ")}
                  style={reducedMotion ? { opacity: vpsVisible ? 1 : 0, transform: "none" } : { transitionDelay: `${i * 0.08}s` }}
                >
                  <div className={[styles.avatar, avatarColorClass(vp.color)].join(" ")}>{vp.initials}</div>
                  <span className={styles.teamName}>{vp.name}</span>
                  <span className={styles.teamRole}>{vp.role}</span>
                  <span className={styles.teamCount}>{vp.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderScene3 = () => {
    const c = SCENES[3][language as keyof typeof SCENES[3]];
    const lead = c.lead as { name: string; role: string; initials: string; color: string };
    const members = c.members as Array<{ name: string; role: string; initials: string; color: string }>;
    return (
      <div className={styles.scene3}>
        <span className={styles.chartLabel}>{c.label}</span>
        <div className={styles.teamDetail}>
          <div className={styles.teamLead}>
            <div className={[styles.leadAvatar, avatarColorClass(lead.color)].join(" ")}>{lead.initials}</div>
            <span className={styles.leadName}>{lead.name}</span>
            <span className={styles.leadTitle}>{lead.role}</span>
          </div>
          <div className={styles.teamMembers}>
            <span className={styles.membersLabel}>{c.membersLabel}</span>
            <div className={styles.membersGrid}>
              {members.map((m, i) => {
                const visible = beat >= 1 && entered;
                const cls = [styles.memberCard, visible ? styles.memberCardVisible : ""].filter(Boolean).join(" ");
                return (
                  <div
                    key={i}
                    className={cls}
                    style={reducedMotion ? { opacity: visible ? 1 : 0, transform: "none" } : { transitionDelay: `${i * 0.07}s` }}
                  >
                    <div className={[styles.memberAvatar, avatarColorClass(m.color)].join(" ")}>{m.initials}</div>
                    <div className={styles.memberInfo}>
                      <span className={styles.memberName}>{m.name}</span>
                      <span className={styles.memberRole}>{m.role}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderScene4 = () => {
    const c = SCENES[4][language as keyof typeof SCENES[4]];
    const growth = c.growth as Array<{ year: string; count: string; desc: string }>;
    const maxCount = 420;
    return (
      <div className={styles.scene4}>
        <span className={styles.chartLabel}>{c.label}</span>
        <h2 className={styles.chartTitle}>{c.title}</h2>
        <div className={styles.growthTimeline}>
          {growth.map((g, i) => {
            const visible = beat >= 1 && entered;
            const cls = [styles.growthRow, visible ? styles.growthRowVisible : ""].filter(Boolean).join(" ");
            const countNum = parseInt(g.count.replace(/\D/g, ""));
            const pct = (countNum / maxCount) * 100;
            return (
              <div
                key={i}
                className={cls}
                style={reducedMotion ? { opacity: visible ? 1 : 0, transform: "none" } : { transitionDelay: `${i * 0.1}s` }}
              >
                <span className={styles.growthYear}>{g.year}</span>
                <div className={styles.growthBarWrap}>
                  <div
                    className={styles.growthBar}
                    style={{ width: visible ? `${pct}%` : "0%" }}
                  >
                    <span className={styles.growthBarLabel}>{g.count}</span>
                  </div>
                </div>
                <span className={styles.growthDesc}>{g.desc}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderScene5 = () => {
    const c = SCENES[5][language as keyof typeof SCENES[5]];
    return (
      <div className={styles.scene5}>
        <h2 className={styles.closingBig} dangerouslySetInnerHTML={{ __html: c.headline }} />
        <p className={styles.closingSub}>{c.sub}</p>
        <div className={styles.closingValues}>
          {(c.values as Array<{ icon: string; text: string }>).map((v, i) => (
            <div key={i} className={styles.closingValue}>
              <div className={styles.closingValIcon}>{v.icon}</div>
              <span className={styles.closingValText}>{v.text}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderSceneContent = () => {
    switch (scene) {
      case 1: return renderScene1();
      case 2: return renderScene2();
      case 3: return renderScene3();
      case 4: return renderScene4();
      case 5: return renderScene5();
      default: return null;
    }
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

  return (
    <div className={rootClasses}>
      <div
        ref={trackRef}
        key={`14-${scene}`}
        className={trackClasses}
        style={reducedMotion ? { transitionDuration: "0s" } : undefined}
      >
        {renderSceneContent()}
      </div>
      {renderNav()}
    </div>
  );
}

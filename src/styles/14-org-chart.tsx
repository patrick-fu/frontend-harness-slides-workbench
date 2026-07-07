import React, { useEffect, useCallback } from "react";
import type { BespokeStyleProps, StyleMetadata } from "../types";
import SpatialSceneTrack from "./SpatialSceneTrack";
import styles from "./14-org-chart.module.css";
import { useFLIP } from "../hooks/useFLIP";

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
      eyebrow: "Collaboration",
      title: "Better",
      titleAccent: "together",
      sub: "How pairing across disciplines creates better outcomes than any single team alone",
      stats: [
        { val: "2.4x", lbl: "Faster Handoffs" },
        { val: "67%", lbl: "Fewer Reworks" },
        { val: "12", lbl: "Active Pairs" },
      ],
    },
    zh: {
      eyebrow: "协作",
      title: "一起",
      titleAccent: "更出色",
      sub: "跨学科配对如何创造比任何单一团队更好的成果",
      stats: [
        { val: "2.4倍", lbl: "更快的交接" },
        { val: "67%", lbl: "更少返工" },
        { val: "12", lbl: "活跃配对" },
      ],
    },
  },
  2: {
    en: {
      label: "Pairing Structure",
      title: "Who works with whom",
      ceo: { name: "Product Council", role: "Steering & Alignment", initials: "PC", count: "12 pairs" },
      vps: [
        { name: "Design ↔ Eng", role: "Feature Delivery", initials: "DE", count: "5 pairs", color: "Blue" },
        { name: "PM ↔ Research", role: "Discovery & Validation", initials: "PR", count: "3 pairs", color: "Green" },
        { name: "Eng ↔ QA", role: "Quality & Release", initials: "EQ", count: "2 pairs", color: "Purple" },
        { name: "Ops ↔ Eng", role: "Reliability & Scale", initials: "OE", count: "1 pair", color: "Orange" },
        { name: "Marketing ↔ PM", role: "Go-to-Market", initials: "MP", count: "1 pair", color: "Pink" },
      ],
    },
    zh: {
      label: "配对结构",
      title: "谁和谁合作",
      ceo: { name: "产品委员会", role: "指导与对齐", initials: "PC", count: "12 对" },
      vps: [
        { name: "设计 ↔ 工程", role: "功能交付", initials: "DE", count: "5 对", color: "Blue" },
        { name: "产品 ↔ 研究", role: "探索与验证", initials: "PR", count: "3 对", color: "Green" },
        { name: "工程 ↔ 测试", role: "质量与发布", initials: "EQ", count: "2 对", color: "Purple" },
        { name: "运营 ↔ 工程", role: "可靠性与扩展", initials: "OE", count: "1 对", color: "Orange" },
        { name: "市场 ↔ 产品", role: "市场进入", initials: "MP", count: "1 对", color: "Pink" },
      ],
    },
  },
  3: {
    en: {
      label: "Pair Spotlight",
      lead: { name: "Design ↔ Engineering", role: "Core Delivery Pair", initials: "DE", color: "Blue" },
      membersLabel: "How They Work",
      members: [
        { name: "Daily Sync", role: "15 min standup", initials: "DS", color: "Blue" },
        { name: "Figma ↔ PR", role: "Design to code", initials: "FP", color: "Teal" },
        { name: "Shared Spec", role: "Living document", initials: "SS", color: "Green" },
        { name: "Joint Review", role: "Weekly demo", initials: "JR", color: "Purple" },
        { name: "Pair Rotation", role: "Monthly swap", initials: "PR", color: "Orange" },
        { name: "Retro Together", role: "Bi-weekly", initials: "RT", color: "Pink" },
      ],
    },
    zh: {
      label: "配对聚焦",
      lead: { name: "设计 ↔ 工程", role: "核心交付配对", initials: "DE", color: "Blue" },
      membersLabel: "他们如何合作",
      members: [
        { name: "每日同步", role: "15 分钟站会", initials: "DS", color: "Blue" },
        { name: "Figma ↔ PR", role: "设计到代码", initials: "FP", color: "Teal" },
        { name: "共享规格", role: "活文档", initials: "SS", color: "Green" },
        { name: "联合评审", role: "每周演示", initials: "JR", color: "Purple" },
        { name: "配对轮换", role: "每月交换", initials: "PR", color: "Orange" },
        { name: "一起复盘", role: "双周一次", initials: "RT", color: "Pink" },
      ],
    },
  },
  4: {
    en: {
      label: "Handoff Flow",
      title: "Smooth collaboration over time",
      growth: [
        { year: "Q1", count: "42 handoffs", desc: "Manual, slow, errors" },
        { year: "Q2", count: "68 handoffs", desc: "Shared templates" },
        { year: "Q3", count: "95 handoffs", desc: "Automated checks" },
        { year: "Q4", count: "120 handoffs", desc: "Pairing protocol" },
        { year: "Now", count: "156 handoffs", desc: "Seamless, trusted" },
      ],
    },
    zh: {
      label: "交接流程",
      title: "随时间推移的顺畅协作",
      growth: [
        { year: "Q1", count: "42 次交接", desc: "手动、缓慢、易出错" },
        { year: "Q2", count: "68 次交接", desc: "共享模板" },
        { year: "Q3", count: "95 次交接", desc: "自动化检查" },
        { year: "Q4", count: "120 次交接", desc: "配对协议" },
        { year: "现在", count: "156 次交接", desc: "无缝、可信" },
      ],
    },
  },
  5: {
    en: {
      headline: "Aligned pairs build <em>aligned products</em>",
      sub: "When disciplines pair well, the result speaks for itself.",
      values: [
        { icon: "🔄", text: "Shared Context" },
        { icon: "🤝", text: "Mutual Respect" },
        { icon: "⚡", text: "Fast Feedback" },
      ],
    },
    zh: {
      headline: "对齐的配对打造<em>对齐的产品</em>",
      sub: "当各学科配合默契时，结果不言自明。",
      values: [
        { icon: "🔄", text: "共享上下文" },
        { icon: "🤝", text: "相互尊重" },
        { icon: "⚡", text: "快速反馈" },
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
  const nameMap = { en: "Collaborative Pairing Board", zh: "协作配对板" };
  const themeMap = {
    en: "Clean light neutral ground with calm professional accent. Shows two-party collaboration structures, cross-discipline pairing, and handoff workflows. Even-handed neutral typography lets the partnerships be the message.",
    zh: "干净的浅中性底色配冷静专业的点缀。展示双方协作结构、跨学科配对和交接工作流。公正的中性字体让伙伴关系成为信息本身。",
  };
  const densityLabelMap = { en: "Balanced", zh: "均衡" };

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
    id: "collaborative-pairing-board",
    band: "balanced-hybrid",
    name: nameMap[lang],
    theme: themeMap[lang],
    densityLabel: densityLabelMap[lang],
    heroScene: 3,
    colors: { bg: "#f8f9fa", ink: "#212529", panel: "#ffffff" },
    typography: { header: "Inter 600", body: "Inter 400" },
    tags: ["pairing", "collaboration", "two-party", "workflow", "handoff", "sync", "cross-discipline", "partnership", "alignment"],
    fonts: ["Inter"],
    scenes,
  };
}

// ─── Transition constants ─────────────────────────────────────────────────

// ─── Component ──────────────────────────────────────────────────────────────

const BEAT_LAYOUT_MODES = {
  2: "motion",
  3: "motion",
  4: "motion",
} satisfies Record<number, "motion" | "reserved">;

export default function OrgChart({
  scene, beat, language, isThumbnail, reducedMotion, onNavigate, }: BespokeStyleProps) {
  useFonts();

  // FLIP for org chart nodes (scene 2) — nodes reposition when new members appear
  const { ref: orgChartRef } = useFLIP<HTMLDivElement>({
    watch: [beat],
    duration: 400,
    easing: "cubic-bezier(0.16, 1, 0.3, 1)",
    selector: ".teamCard",
  });

  // FLIP for members grid (scene 3) — member cards push siblings
  const { ref: membersGridRef } = useFLIP<HTMLDivElement>({
    watch: [beat],
    duration: 400,
    easing: "cubic-bezier(0.16, 1, 0.3, 1)",
    selector: ".memberCard",
  });

  const handleNavClick = useCallback(
    (e: React.MouseEvent, targetScene: number) => {
      e.stopPropagation();
      onNavigate?.(targetScene, 0);
    },
    [onNavigate],
  );

  const rootClasses = [styles.root, reducedMotion ? styles.reducedMotion : "", isThumbnail ? styles.thumbnail : ""].filter(Boolean).join(" ");

  const renderSceneFor = (sceneNum: number, beatNum: number, isCurrent: boolean) => {
    const c = SCENES[sceneNum as keyof typeof SCENES]?.[language as "en" | "zh"];
    if (!c) return null;

    if (sceneNum === 1) {
      const data = c as typeof SCENES[1]["en"];
      return (
        <div className={styles.scene1}>
          <span className={styles.orgEyebrow}>{data.eyebrow}</span>
          <h1 className={styles.orgTitle}>
            {data.title}<br /><em>{data.titleAccent}</em>
          </h1>
          <p className={styles.orgSub}>{data.sub}</p>
          <div className={styles.orgStats}>
            {(data.stats as Array<{ val: string; lbl: string }>).map((s, i) => (
              <div key={i} className={styles.orgStatItem}>
                <span className={styles.orgStatVal}>{s.val}</span>
                <span className={styles.orgStatLbl}>{s.lbl}</span>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (sceneNum === 2) {
      const data = c as typeof SCENES[2]["en"];
      const ceo = data.ceo as { name: string; role: string; initials: string; count: string };
      const vps = data.vps as Array<{ name: string; role: string; initials: string; count: string; color: string }>;
      const ceoVisible = true;
      const vpsVisible = beatNum >= 1;
      return (
        <div className={styles.scene2}>
          <div className={styles.chartHeader}>
            <span className={styles.chartLabel}>{data.label}</span>
            <h2 className={styles.chartTitle}>{data.title}</h2>
          </div>
          <div
            ref={isCurrent ? orgChartRef : undefined}
            className={styles.chartArea}
          >
            {/* SVG connector lines */}
            <svg className={styles.chartLines} viewBox="0 0 100 60" preserveAspectRatio="none" aria-hidden="true">
              {vpsVisible && (
                <>
                  <line x1="50" y1="18" x2="50" y2="28" stroke="#cbd5e0" strokeWidth="0.3" className={styles.chartLineDraw} />
                  <line x1="15" y1="28" x2="85" y2="28" stroke="#cbd5e0" strokeWidth="0.3" className={styles.chartLineDraw} />
                  {[15, 32, 50, 68, 85].map((x, i) => (
                    <line key={i} x1={x} y1="28" x2={x} y2="38" stroke="#cbd5e0" strokeWidth="0.3" className={styles.chartLineDraw} style={{ transitionDelay: `${i * 0.05}s` }} />
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
    }

    if (sceneNum === 3) {
      const data = c as typeof SCENES[3]["en"];
      const lead = data.lead as { name: string; role: string; initials: string; color: string };
      const members = data.members as Array<{ name: string; role: string; initials: string; color: string }>;
      return (
        <div className={styles.scene3}>
          <span className={styles.chartLabel}>{data.label}</span>
          <div className={styles.teamDetail}>
            <div className={styles.teamLead}>
              <div className={[styles.leadAvatar, avatarColorClass(lead.color)].join(" ")}>{lead.initials}</div>
              <span className={styles.leadName}>{lead.name}</span>
              <span className={styles.leadTitle}>{lead.role}</span>
            </div>
            <div className={styles.teamMembers}>
              <span className={styles.membersLabel}>{data.membersLabel}</span>
              <div
                ref={isCurrent ? membersGridRef : undefined}
                className={styles.membersGrid}
              >
                {members.map((m, i) => {
                  const visible = beatNum >= 1;
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
    }

    if (sceneNum === 4) {
      const data = c as typeof SCENES[4]["en"];
      const growth = data.growth as Array<{ year: string; count: string; desc: string }>;
      const maxCount = 420;
      return (
        <div className={styles.scene4}>
          <span className={styles.chartLabel}>{data.label}</span>
          <h2 className={styles.chartTitle}>{data.title}</h2>
          <div className={styles.growthTimeline}>
            {growth.map((g, i) => {
              const visible = beatNum >= 1;
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
    }

    if (sceneNum === 5) {
      const data = c as typeof SCENES[5]["en"];
      return (
        <div className={styles.scene5}>
          <h2 className={styles.closingBig} dangerouslySetInnerHTML={{ __html: data.headline }} />
          <p className={styles.closingSub}>{data.sub}</p>
          <div className={styles.closingValues}>
            {(data.values as Array<{ icon: string; text: string }>).map((v, i) => (
              <div key={i} className={styles.closingValue}>
                <div className={styles.closingValIcon}>{v.icon}</div>
                <span className={styles.closingValText}>{v.text}</span>
              </div>
            ))}
          </div>
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

  return (
    <div className={rootClasses}>
            <SpatialSceneTrack
        scene={scene}
        beat={beat}
        transitionKind="scale-fade"
        reducedMotion={reducedMotion || isThumbnail}
        beatLayoutModes={BEAT_LAYOUT_MODES}
        renderScene={(sceneId, sceneBeat, isActive) => (
          <div className={styles.sceneLayer}>
            <div className={styles.track}>
              {renderSceneFor(sceneId, sceneBeat, isActive)}
            </div>
          </div>
        )}
      />

      {renderNav()}
    </div>
  );
}

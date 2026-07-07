import React, { useEffect, useState, useCallback } from "react";
import type { BespokeStyleProps, StyleMetadata } from "../types";
import SpatialSceneTrack from "./SpatialSceneTrack";
import styles from "./36-glass-morph.module.css";

// ─── Font Injection ────────────────────────────────────────────────────────

function useFonts() {
  useEffect(() => {
    const id = "style-36-fonts";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Inter:wght@200;300;400;500&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=JetBrains+Mono:wght@400;500&display=swap";
    document.head.appendChild(link);
  }, []);
}

// ─── Content ────────────────────────────────────────────────────────────────

const SCENES = {
  1: {
    en: {
      kicker: "EST. 2024  —  PRIVATE REVEAL",
      hello: "After Hours",
      userName: "Maison Lune",
      userInitial: "ML",
      searchPlaceholder: "Explore the collection...",
      quickActions: [
        { icon: "◈", label: "Archive", color: "rgba(255, 82, 140, 0.12)" },
        { icon: "◇", label: "Reserve", color: "rgba(255, 82, 140, 0.08)" },
        { icon: "◉", label: "Atelier", color: "rgba(255, 82, 140, 0.08)" },
        { icon: "◎", label: "Concierge", color: "rgba(255, 82, 140, 0.08)" },
      ],
    },
    zh: {
      kicker: "创立于 2024  —  私人鉴赏",
      hello: "深夜时分",
      userName: "月舍",
      userInitial: "月",
      searchPlaceholder: "探索典藏系列...",
      quickActions: [
        { icon: "◈", label: "档案", color: "rgba(255, 82, 140, 0.12)" },
        { icon: "◇", label: "预约", color: "rgba(255, 82, 140, 0.08)" },
        { icon: "◉", label: "工坊", color: "rgba(255, 82, 140, 0.08)" },
        { icon: "◎", label: "礼宾", color: "rgba(255, 82, 140, 0.08)" },
      ],
    },
  },
  2: {
    en: {
      kicker: "THE COLLECTION",
      title: "Quiet Luxury,",
      subtitle: "crafted for those who notice the details.",
      features: [
        {
          icon: "◈",
          title: "Nocturne Series",
          desc: "Hand-finished in our atelier. Each piece bears the mark of the artisan who shaped it.",
          badge: "Limited",
          badgeColor: "#ff528c",
          iconBg: "rgba(255, 82, 140, 0.1)",
        },
        {
          icon: "◇",
          title: "Velvet Hours",
          desc: "Materials sourced from the last remaining mills in Como and Lyon.",
          badge: "New",
          badgeColor: "#ff528c",
          iconBg: "rgba(255, 82, 140, 0.08)",
        },
        {
          icon: "◉",
          title: "Private Reserve",
          desc: "Available only to members of our inner circle. By invitation.",
          badge: "Exclusive",
          badgeColor: "#ff528c",
          iconBg: "rgba(255, 82, 140, 0.08)",
        },
        {
          icon: "◎",
          title: "Midnight Edit",
          desc: "A capsule released once per season. Never reissued.",
          badge: "Rare",
          badgeColor: "#ff528c",
          iconBg: "rgba(255, 82, 140, 0.08)",
        },
      ],
    },
    zh: {
      kicker: "典藏系列",
      title: "静谧奢华，",
      subtitle: "为懂得细节的人而造。",
      features: [
        {
          icon: "◈",
          title: "夜曲系列",
          desc: "工坊手工打磨，每件都承载着匠人的印记。",
          badge: "限量",
          badgeColor: "#ff528c",
          iconBg: "rgba(255, 82, 140, 0.1)",
        },
        {
          icon: "◇",
          title: "丝绒时光",
          desc: "面料来自科莫和里昂仅存的古老织坊。",
          badge: "新品",
          badgeColor: "#ff528c",
          iconBg: "rgba(255, 82, 140, 0.08)",
        },
        {
          icon: "◉",
          title: "私人珍藏",
          desc: "仅限核心圈层会员，邀请制获取。",
          badge: "专属",
          badgeColor: "#ff528c",
          iconBg: "rgba(255, 82, 140, 0.08)",
        },
        {
          icon: "◎",
          title: "午夜精选",
          desc: "每季发布一次，永不再版。",
          badge: "稀有",
          badgeColor: "#ff528c",
          iconBg: "rgba(255, 82, 140, 0.08)",
        },
      ],
    },
  },
  3: {
    en: {
      kicker: "THIS EVENING",
      title: "Tonight's Selection",
      dateLabel: "Private Viewing",
      panels: [
        {
          title: "Pieces Viewed",
          bigNumber: "248",
          trend: "+32",
          trendUp: true,
          bars: [25, 40, 35, 58, 50, 72, 80],
        },
        {
          title: "Reservations",
          bigNumber: "47",
          trend: "+18%",
          trendUp: true,
          bars: [35, 48, 42, 65, 60, 78, 88],
        },
      ],
      activity: [
        { dot: "#ff528c", text: "Nocturne Cufflinks — reserved by Member 0412", value: "Hold" },
        { dot: "#f5efe0", text: "Private viewing request confirmed", value: "21:00" },
        { dot: "#ff528c", text: "Velvet Hours trunk show — Milan", value: "Invite" },
        { dot: "#f5efe0", text: "New piece added to Midnight Edit", value: "New" },
        { dot: "#ff528c", text: "Atelier availability — Friday evening", value: "Open" },
      ],
    },
    zh: {
      kicker: "今夜精选",
      title: "今晚的选择",
      dateLabel: "私人鉴赏",
      panels: [
        {
          title: "浏览作品",
          bigNumber: "248",
          trend: "+32",
          trendUp: true,
          bars: [25, 40, 35, 58, 50, 72, 80],
        },
        {
          title: "预约数量",
          bigNumber: "47",
          trend: "+18%",
          trendUp: true,
          bars: [35, 48, 42, 65, 60, 78, 88],
        },
      ],
      activity: [
        { dot: "#ff528c", text: "夜曲袖扣 — 会员 0412 已预留", value: "保留" },
        { dot: "#f5efe0", text: "私人鉴赏请求已确认", value: "21:00" },
        { dot: "#ff528c", text: "丝绒时光 trunk show — 米兰", value: "邀请" },
        { dot: "#f5efe0", text: "午夜精选新增作品", value: "新" },
        { dot: "#ff528c", text: "工坊可用时段 — 周五晚", value: "开放" },
      ],
    },
  },
  4: {
    en: {
      kicker: "FEATURED PIECE",
      name: "Nocturne No. 7",
      role: "Hand-crafted in our atelier",
      initial: "N7",
      stats: [
        { value: "1 of 12", label: "Edition" },
        { value: "18K", label: "Gold Weight" },
        { value: "42", label: "Components" },
      ],
      settings: [
        { icon: "◈", label: "Private Viewing", desc: "Schedule an in-person viewing", on: true },
        { icon: "◇", label: "Digital Certificate", desc: "Blockchain-authenticated provenance", on: true },
        { icon: "◉", label: "Atelier Visit", desc: "Meet the artisan behind the piece", on: false },
        { icon: "◎", label: "Insurance Included", desc: "Complimentary first-year coverage", on: true },
      ],
    },
    zh: {
      kicker: "精选作品",
      name: "夜曲 第七号",
      role: "工坊手工打造",
      initial: "夜7",
      stats: [
        { value: "12 之 1", label: "限量编号" },
        { value: "18K", label: "金重" },
        { value: "42", label: "组件数" },
      ],
      settings: [
        { icon: "◈", label: "私人鉴赏", desc: "预约亲身体验", on: true },
        { icon: "◇", label: "数字证书", desc: "区块链认证来源", on: true },
        { icon: "◉", label: "工坊参观", desc: "与匠人面对面", on: false },
        { icon: "◎", label: "附赠保险", desc: "首年保障免费", on: true },
      ],
    },
  },
  5: {
    en: {
      kicker: "BY INVITATION",
      badge: "Members Only",
      headline: "The door is always open.",
      sub: "Join our inner circle. Private previews, atelier access, and pieces that never reach the public.",
      cta: "Request Invitation",
    },
    zh: {
      kicker: "邀请制",
      badge: "仅限会员",
      headline: "门，永远为你敞开。",
      sub: "加入我们的核心圈层。私人预览、工坊探访，以及从未公开发布的作品。",
      cta: "申请邀请",
    },
  },
};

// ─── Metadata ───────────────────────────────────────────────────────────────

export function getMetadata(lang: "en" | "zh"): StyleMetadata {
  const nameMap = { en: "After-Hours Luxe", zh: "深夜奢华" };
  const themeMap = {
    en: "Brand Reveal & Premium Launch — late-night hotel bar atmosphere with warm black ground, pearl-cream insets and single hot-magenta accent",
    zh: "品牌发布与高端揭幕——深夜酒店酒吧氛围，暖黑底色、珍珠奶油内嵌、单一热洋红点缀",
  };
  const densityLabelMap = { en: "Editorial-Sparse", zh: "编辑留白" };

  const sceneTitles = {
    en: ["Brand Title", "Collection", "Tonight's Selection", "Featured Piece", "Invitation"],
    zh: ["品牌标题", "典藏系列", "今夜精选", "精选作品", "邀请加入"],
  };

  const beatActions = {
    en: {
      1: ["Brand identity settles"],
      2: ["Collection headline appears", "Cards reveal in sequence"],
      3: ["Metric panels populate", "Activity list fills"],
      4: ["Featured piece reveals", "Details appear"],
      5: ["Invitation CTA appears"],
    },
    zh: {
      1: ["品牌身份落定"],
      2: ["系列标题呈现", "卡片依次揭示"],
      3: ["指标面板填充", "活动列表出现"],
      4: ["精选作品揭示", "细节呈现"],
      5: ["邀请 CTA 出现"],
    },
  };

  const BEAT_COUNTS: Record<number, number> = {
    1: 1,
    2: 2,
    3: 2,
    4: 2,
    5: 1,
  };

  const scenes = [1, 2, 3, 4, 5].map((id) => {
    const beatCount = BEAT_COUNTS[id];
    const actions = beatActions[lang][id as keyof (typeof beatActions)["en"]];
    const c = SCENES[id as keyof typeof SCENES][lang];

    const beats = Array.from({ length: beatCount }, (_, beatIdx) => {
      let beatTitle = "";
      let beatBody = "";

      if (id === 1) {
        const c1 = c as unknown as { userName: string; hello: string };
        beatTitle = `${c1.hello} — ${c1.userName}`;
        beatBody = "Brand identity with private collection access";
      } else if (id === 2) {
        const c2 = c as unknown as { title: string; subtitle: string; features: Array<{ title: string }> };
        beatTitle = c2.title;
        if (beatIdx === 0) {
          beatBody = c2.subtitle;
        } else {
          beatBody = c2.features.map((f) => f.title).join(" / ");
        }
      } else if (id === 3) {
        const c3 = c as unknown as { title: string; panels: Array<{ title: string; bigNumber: string }>; activity: Array<{ text: string }> };
        beatTitle = c3.title;
        if (beatIdx === 0) {
          beatBody = c3.panels.map((p) => `${p.title}: ${p.bigNumber}`).join(" / ");
        } else {
          beatBody = c3.activity.map((a) => a.text).join(" / ");
        }
      } else if (id === 4) {
        const c4 = c as unknown as { name: string; role: string; settings: Array<{ label: string }> };
        beatTitle = `${c4.name} — ${c4.role}`;
        if (beatIdx >= 1) {
          beatBody = c4.settings.map((s) => s.label).join(" / ");
        }
      } else if (id === 5) {
        const c5 = c as unknown as { headline: string; sub: string };
        beatTitle = c5.headline;
        beatBody = c5.sub;
      }

      return {
        id: beatIdx,
        action: actions[beatIdx],
        title: beatTitle,
        body: beatBody,
      };
    });

    return {
      id,
      title: sceneTitles[lang][id - 1],
      beats,
    };
  });

  return {
    id: "after-hours-luxe",
    band: "contemporary-digital",
    name: nameMap[lang],
    theme: themeMap[lang],
    densityLabel: densityLabelMap[lang],
    heroScene: 3,
    colors: {
      bg: "#0d0a0a",
      ink: "#f5efe0",
      panel: "rgba(245, 239, 224, 0.06)",
    },
    typography: {
      header: "Playfair Display 600",
      body: "Inter 300",
    },
    tags: [
      "luxe",
      "editorial",
      "warm-black",
      "pearl-cream",
      "magenta",
      "serif",
      "asymmetric",
      "film-grain",
      "premium",
      "reveal",
    ],
    fonts: ["Playfair Display", "Inter", "JetBrains Mono"],
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

export default function GlassMorph({
  scene,
  beat,
  language,
  isThumbnail,
  reducedMotion,
  onNavigate,
}: BespokeStyleProps) {
  useFonts();

  // ── Dual-scene transition state ────────────────────────────────────────

  // Per-scene element enter animation
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    setEntered(false);
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setEntered(true);
      });
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

  const rootClasses = [
    styles.root,
    reducedMotion ? styles.reducedMotion : "",
  ]
    .filter(Boolean)
    .join(" ");

  // ── Scene 1: App Home ───────────────────────────────────────────────────

  const renderScene1 = (isEntered: boolean) => {
    const c = SCENES[1][language];
    return (
      <div className={styles.appHome}>
        <p
          className={styles.kicker}
          style={{
            opacity: isEntered ? 1 : 0,
            transition: reducedMotion ? "none" : "opacity 0.5s ease",
          }}
        >
          {c.kicker}
        </p>
        <div className={styles.appHeader}>
          <div className={styles.appGreeting}>
            <p className={styles.appHello}>{c.hello}</p>
            <h1 className={styles.appUserName}>{c.userName}</h1>
          </div>
          <div
            className={styles.appAvatar}
            style={{
              opacity: isEntered ? 1 : 0,
              transform: isEntered ? "scale(1)" : "scale(0.8)",
              transition: reducedMotion
                ? "none"
                : "opacity 0.5s ease, transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            {c.userInitial}
          </div>
        </div>

        <div
          className={styles.appSearch}
          style={{
            opacity: isEntered ? 1 : 0,
            transform: isEntered ? "translateY(0)" : "translateY(1cqh)",
            transition: reducedMotion
              ? "none"
              : "opacity 0.5s ease 0.1s, transform 0.5s ease 0.1s",
          }}
        >
          <span className={styles.searchIcon}>◇</span>
          <span className={styles.searchInput}>{c.searchPlaceholder}</span>
        </div>

        <div className={styles.appQuickActions}>
          {c.quickActions.map((action, i) => (
            <div
              key={i}
              className={styles.quickAction}
              style={{
                opacity: isEntered ? 1 : 0,
                transform: isEntered ? "translateY(0)" : "translateY(1.5cqh)",
                transition: reducedMotion
                  ? "none"
                  : `opacity 0.4s ease ${0.2 + i * 0.08}s, transform 0.4s ease ${0.2 + i * 0.08}s`,
              }}
            >
              <div
                className={styles.quickActionIcon}
                style={{ background: action.color }}
              >
                {action.icon}
              </div>
              <span className={styles.quickActionLabel}>{action.label}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // ── Scene 2: Feature Cards ──────────────────────────────────────────────

  const renderScene2 = (beatNum: number, isEntered: boolean) => {
    const c = SCENES[2][language];
    return (
      <div className={styles.featureScene}>
        <p
          className={styles.kicker}
          style={{
            opacity: isEntered ? 1 : 0,
            transition: reducedMotion ? "none" : "opacity 0.5s ease",
          }}
        >
          {c.kicker}
        </p>
        <h2
          className={`${styles.featureTitle} ${styles.haloHeadline}`}
          style={{
            opacity: isEntered ? 1 : 0,
            transition: reducedMotion ? "none" : "opacity 0.5s ease 0.05s",
          }}
        >
          {c.title}
        </h2>
        <p
          className={styles.featureSubtitle}
          style={{
            opacity: isEntered ? 0.5 : 0,
            transition: reducedMotion ? "none" : "opacity 0.5s ease 0.1s",
          }}
        >
          {c.subtitle}
        </p>
        <div className={styles.featureStack}>
          {c.features.map((feature, i) => {
            const visible = isEntered && beatNum >= 1;
            return (
              <div
                key={i}
                className={`${styles.featureCard} ${visible ? styles.featureCardVisible : ""}`}
                style={{
                  transitionDelay: reducedMotion ? "0s" : `${i * 0.12}s`,
                }}
              >
                <div
                  className={styles.featureCardIcon}
                  style={{ background: feature.iconBg }}
                >
                  {feature.icon}
                </div>
                <div className={styles.featureCardContent}>
                  <h3 className={styles.featureCardTitle}>{feature.title}</h3>
                  <p className={styles.featureCardDesc}>{feature.desc}</p>
                </div>
                <span
                  className={styles.featureCardBadge}
                  style={{
                    background: `${feature.badgeColor}22`,
                    color: feature.badgeColor,
                  }}
                >
                  {feature.badge}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // ── Scene 3: Dashboard ──────────────────────────────────────────────────

  const renderScene3 = (beatNum: number, isEntered: boolean) => {
    const c = SCENES[3][language];
    return (
      <div className={styles.dashboardScene}>
        <p
          className={styles.kicker}
          style={{
            opacity: isEntered ? 1 : 0,
            transition: reducedMotion ? "none" : "opacity 0.5s ease",
            gridColumn: "1 / -1",
            marginBottom: "-1cqh",
          }}
        >
          {c.kicker}
        </p>
        <div className={styles.dashHeader}>
          <h2
            className={styles.dashTitle}
            style={{
              opacity: isEntered ? 1 : 0,
              transition: reducedMotion ? "none" : "opacity 0.5s ease",
            }}
          >
            {c.title}
          </h2>
          <span className={styles.dashDate}>{c.dateLabel}</span>
        </div>

        {c.panels.map((panel, i) => (
          <div
            key={i}
            className={styles.dashPanel}
            style={{
              opacity: isEntered ? 1 : 0,
              transform: isEntered ? "translateY(0)" : "translateY(1.5cqh)",
              transition: reducedMotion
                ? "none"
                : `opacity 0.5s ease ${i * 0.1}s, transform 0.5s ease ${i * 0.1}s`,
            }}
          >
            <div className={styles.dashPanelHeader}>
              <h3 className={styles.dashPanelTitle}>{panel.title}</h3>
              <span
                className={`${styles.dashTrend} ${panel.trendUp ? styles.dashTrendUp : styles.dashTrendDown}`}
              >
                {panel.trendUp ? "↑" : "↓"} {panel.trend}
              </span>
            </div>
            <div className={styles.dashBigNumber}>{panel.bigNumber}</div>
            <div className={styles.dashChart}>
              {panel.bars.map((h, j) => (
                <div
                  key={j}
                  className={styles.dashBar}
                  style={{
                    height: isEntered ? `${h}%` : "0%",
                    transitionDelay: reducedMotion ? "0s" : `${j * 0.05}s`,
                  }}
                />
              ))}
            </div>
          </div>
        ))}

        <div
          className={styles.dashPanel}
          style={{
            gridColumn: "1 / -1",
            opacity: isEntered && beatNum >= 1 ? 1 : 0,
            transform: isEntered && beatNum >= 1 ? "translateY(0)" : "translateY(1cqh)",
            transition: reducedMotion
              ? "none"
              : "opacity 0.5s ease 0.2s, transform 0.5s ease 0.2s",
          }}
        >
          <div className={styles.dashPanelHeader}>
            <h3 className={styles.dashPanelTitle}>
              {language === "zh" ? "最近活动" : "Recent Activity"}
            </h3>
            <span className={styles.dashPanelMore}>•••</span>
          </div>
          <div className={styles.dashList}>
            {c.activity.map((item, i) => (
              <div key={i} className={styles.dashListItem}>
                <div
                  className={styles.dashListDot}
                  style={{ background: item.dot }}
                />
                <span className={styles.dashListText}>{item.text}</span>
                <span className={styles.dashListValue}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // ── Scene 4: Profile / Settings ─────────────────────────────────────────

  const renderScene4 = (beatNum: number, isEntered: boolean) => {
    const c = SCENES[4][language];
    return (
      <div className={styles.profileScene}>
        <p
          className={styles.kicker}
          style={{
            opacity: isEntered ? 1 : 0,
            transition: reducedMotion ? "none" : "opacity 0.5s ease",
          }}
        >
          {c.kicker}
        </p>
        <div
          className={`${styles.glass} ${styles.profileCard}`}
          style={{
            opacity: isEntered ? 1 : 0,
            transform: isEntered ? "translateY(0)" : "translateY(2cqh)",
            transition: reducedMotion
              ? "none"
              : "opacity 0.6s ease, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          <div className={styles.profileAvatar}>{c.initial}</div>
          <h2 className={styles.profileName}>{c.name}</h2>
          <p className={styles.profileRole}>{c.role}</p>
          <div className={styles.profileStats}>
            {c.stats.map((stat, i) => (
              <div key={i} className={styles.profileStat}>
                <span className={styles.profileStatValue}>{stat.value}</span>
                <span className={styles.profileStatLabel}>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        {beatNum >= 1 && (
          <div
            className={styles.profileSettings}
            style={{
              opacity: isEntered ? 1 : 0,
              transition: reducedMotion ? "none" : "opacity 0.5s ease 0.2s",
            }}
          >
            {c.settings.map((setting, i) => (
              <div
                key={i}
                className={styles.settingRow}
                style={{
                  opacity: isEntered ? 1 : 0,
                  transform: isEntered ? "translateX(0)" : "translateX(2cqw)",
                  transition: reducedMotion
                    ? "none"
                    : `opacity 0.4s ease ${0.3 + i * 0.08}s, transform 0.4s ease ${0.3 + i * 0.08}s`,
                }}
              >
                <div className={styles.settingInfo}>
                  <div className={styles.settingIcon}>{setting.icon}</div>
                  <div className={styles.settingText}>
                    <span className={styles.settingLabel}>{setting.label}</span>
                    <span className={styles.settingDesc}>{setting.desc}</span>
                  </div>
                </div>
                <div
                  className={`${styles.settingToggle} ${setting.on ? styles.settingToggleOn : ""}`}
                >
                  <div className={styles.settingToggleKnob} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  // ── Scene 5: CTA ────────────────────────────────────────────────────────

  const renderScene5 = (isEntered: boolean) => {
    const c = SCENES[5][language];
    return (
      <div className={styles.ctaScene}>
        <p
          className={styles.kicker}
          style={{
            opacity: isEntered ? 1 : 0,
            transition: reducedMotion ? "none" : "opacity 0.5s ease",
          }}
        >
          {c.kicker}
        </p>
        <span
          className={styles.ctaBadge}
          style={{
            opacity: isEntered ? 1 : 0,
            transform: isEntered ? "translateY(0)" : "translateY(1cqh)",
            transition: reducedMotion
              ? "none"
              : "opacity 0.5s ease, transform 0.5s ease",
          }}
        >
          {c.badge}
        </span>
        <h1
          className={styles.ctaHeadline}
          style={{
            opacity: isEntered ? 1 : 0,
            transform: isEntered ? "translateY(0)" : "translateY(1.5cqh)",
            transition: reducedMotion
              ? "none"
              : "opacity 0.6s ease 0.1s, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.1s",
          }}
        >
          {c.headline}
        </h1>
        <p
          className={styles.ctaSub}
          style={{
            opacity: isEntered ? 1 : 0,
            transition: reducedMotion ? "none" : "opacity 0.5s ease 0.3s",
          }}
        >
          {c.sub}
        </p>
        <button
          className={styles.ctaButton}
          style={{
            opacity: isEntered ? 1 : 0,
            transform: isEntered ? "translateY(0) scale(1)" : "translateY(1cqh) scale(0.95)",
            transition: reducedMotion
              ? "none"
              : "opacity 0.5s ease 0.4s, transform 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.4s",
          }}
        >
          {c.cta}
        </button>
      </div>
    );
  };

  // ── Render scene content for a given scene number ────────────────────────

  const renderSceneFor = (sceneNum: number, beatNum: number, isEntered: boolean) => {
    switch (sceneNum) {
      case 1:
        return renderScene1(isEntered);
      case 2:
        return renderScene2(beatNum, isEntered);
      case 3:
        return renderScene3(beatNum, isEntered);
      case 4:
        return renderScene4(beatNum, isEntered);
      case 5:
        return renderScene5(isEntered);
      default:
        return null;
    }
  };

  // ── Navigation Indicators ───────────────────────────────────────────────

  const renderNavIndicators = () => {
    if (isThumbnail) return null;
    return (
      <div className={styles.navIndicators} aria-label="Scene navigation">
        {[1, 2, 3, 4, 5].map((s) => {
          const isActive = s === scene;
          return (
            <button
              key={s}
              type="button"
              className={`${styles.navIndicator} ${isActive ? styles.navIndicatorActive : ""}`}
              aria-label={`Jump to scene ${s}`}
              onClick={(e) => handleNavClick(e, s)}
            />
          );
        })}
      </div>
    );
  };

  // ── Build layer classes ─────────────────────────────────────────────────

  return (
    <div className={rootClasses}>
            <SpatialSceneTrack
        scene={scene}
        beat={beat}
        transitionKind="fade"
        reducedMotion={reducedMotion || isThumbnail}
        beatLayoutModes={BEAT_LAYOUT_MODES}
        renderScene={(sceneId, sceneBeat, isActive) => (
          <div className={styles.sceneLayer}>
            {renderSceneFor(sceneId, sceneBeat, isActive ? entered : true)}
          </div>
        )}
      />

      {renderNavIndicators()}
    </div>
  );
}

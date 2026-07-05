import React, { useEffect, useState, useRef, useCallback } from "react";
import type { BespokeStyleProps, StyleMetadata } from "../types";
import styles from "./36-glass-morph.module.css";

// ─── Content ────────────────────────────────────────────────────────────────

const SCENES = {
  1: {
    en: {
      hello: "Good morning",
      userName: "Alex Chen",
      userInitial: "A",
      searchPlaceholder: "Search apps, contacts, files...",
      quickActions: [
        { icon: "📷", label: "Camera", color: "rgba(244, 114, 182, 0.2)" },
        { icon: "🎵", label: "Music", color: "rgba(167, 139, 250, 0.2)" },
        { icon: "📝", label: "Notes", color: "rgba(56, 189, 248, 0.2)" },
        { icon: "⚙️", label: "Settings", color: "rgba(74, 222, 128, 0.2)" },
      ],
    },
    zh: {
      hello: "早上好",
      userName: "陈亚历",
      userInitial: "陈",
      searchPlaceholder: "搜索应用、联系人、文件...",
      quickActions: [
        { icon: "📷", label: "相机", color: "rgba(244, 114, 182, 0.2)" },
        { icon: "🎵", label: "音乐", color: "rgba(167, 139, 250, 0.2)" },
        { icon: "📝", label: "备忘录", color: "rgba(56, 189, 248, 0.2)" },
        { icon: "⚙️", label: "设置", color: "rgba(74, 222, 128, 0.2)" },
      ],
    },
  },
  2: {
    en: {
      title: "What's New",
      subtitle: "Fresh features just landed",
      features: [
        {
          icon: "✨",
          title: "Smart Suggestions",
          desc: "AI-powered recommendations that learn from your usage patterns",
          badge: "New",
          badgeColor: "#a78bfa",
          iconBg: "rgba(167, 139, 250, 0.2)",
        },
        {
          icon: "🔒",
          title: "Enhanced Privacy",
          desc: "End-to-end encryption for all your personal data and messages",
          badge: "Security",
          badgeColor: "#38bdf8",
          iconBg: "rgba(56, 189, 248, 0.2)",
        },
        {
          icon: "🎨",
          title: "Custom Themes",
          desc: "Personalize your interface with dynamic glassmorphism effects",
          badge: "Beta",
          badgeColor: "#f472b6",
          iconBg: "rgba(244, 114, 182, 0.2)",
        },
        {
          icon: "⚡",
          title: "Instant Sync",
          desc: "Real-time collaboration across all your devices, zero latency",
          badge: "Pro",
          badgeColor: "#4ade80",
          iconBg: "rgba(74, 222, 128, 0.2)",
        },
      ],
    },
    zh: {
      title: "新功能速递",
      subtitle: "全新功能刚刚上线",
      features: [
        {
          icon: "✨",
          title: "智能推荐",
          desc: "基于使用习惯学习的 AI 驱动推荐系统",
          badge: "新功能",
          badgeColor: "#a78bfa",
          iconBg: "rgba(167, 139, 250, 0.2)",
        },
        {
          icon: "🔒",
          title: "增强隐私",
          desc: "所有个人数据和消息均采用端到端加密",
          badge: "安全",
          badgeColor: "#38bdf8",
          iconBg: "rgba(56, 189, 248, 0.2)",
        },
        {
          icon: "🎨",
          title: "自定义主题",
          desc: "通过动态玻璃拟态效果个性化您的界面",
          badge: "测试版",
          badgeColor: "#f472b6",
          iconBg: "rgba(244, 114, 182, 0.2)",
        },
        {
          icon: "⚡",
          title: "即时同步",
          desc: "所有设备实时协作，零延迟",
          badge: "专业版",
          badgeColor: "#4ade80",
          iconBg: "rgba(74, 222, 128, 0.2)",
        },
      ],
    },
  },
  3: {
    en: {
      title: "Today's Overview",
      dateLabel: "Mon, Jun 30",
      panels: [
        {
          title: "Active Users",
          bigNumber: "24.8K",
          trend: "+12.4%",
          trendUp: true,
          bars: [30, 45, 38, 62, 55, 78, 85],
        },
        {
          title: "Revenue",
          bigNumber: "$184K",
          trend: "+8.2%",
          trendUp: true,
          bars: [40, 52, 48, 70, 65, 82, 90],
        },
      ],
      activity: [
        { dot: "#a78bfa", text: "New user signup from Tokyo", value: "+1" },
        { dot: "#38bdf8", text: "Payment received: Enterprise plan", value: "$4.2K" },
        { dot: "#4ade80", text: "Server deployment completed", value: "OK" },
        { dot: "#f472b6", text: "Feature request: Dark mode", value: "New" },
        { dot: "#fbbf24", text: "API rate limit warning", value: "85%" },
      ],
    },
    zh: {
      title: "今日概览",
      dateLabel: "6月30日 周一",
      panels: [
        {
          title: "活跃用户",
          bigNumber: "2.48万",
          trend: "+12.4%",
          trendUp: true,
          bars: [30, 45, 38, 62, 55, 78, 85],
        },
        {
          title: "营收",
          bigNumber: "¥128万",
          trend: "+8.2%",
          trendUp: true,
          bars: [40, 52, 48, 70, 65, 82, 90],
        },
      ],
      activity: [
        { dot: "#a78bfa", text: "新用户注册：东京", value: "+1" },
        { dot: "#38bdf8", text: "收款到账：企业版", value: "¥2.9万" },
        { dot: "#4ade80", text: "服务器部署完成", value: "正常" },
        { dot: "#f472b6", text: "功能建议：深色模式", value: "新" },
        { dot: "#fbbf24", text: "API 速率限制预警", value: "85%" },
      ],
    },
  },
  4: {
    en: {
      name: "Alex Chen",
      role: "Product Designer",
      initial: "A",
      stats: [
        { value: "142", label: "Projects" },
        { value: "8.9K", label: "Followers" },
        { value: "36", label: "Awards" },
      ],
      settings: [
        { icon: "🔔", label: "Notifications", desc: "Push, email, in-app", on: true },
        { icon: "🌙", label: "Dark Mode", desc: "Auto from sunset to sunrise", on: true },
        { icon: "📍", label: "Location", desc: "Used for weather and maps", on: false },
        { icon: "🔐", label: "Biometric Lock", desc: "Face ID / Touch ID", on: true },
      ],
    },
    zh: {
      name: "陈亚历",
      role: "产品设计师",
      initial: "陈",
      stats: [
        { value: "142", label: "项目" },
        { value: "8.9K", label: "关注者" },
        { value: "36", label: "获奖" },
      ],
      settings: [
        { icon: "🔔", label: "通知", desc: "推送、邮件、应用内", on: true },
        { icon: "🌙", label: "深色模式", desc: "日落到日出自动切换", on: true },
        { icon: "📍", label: "定位服务", desc: "用于天气和地图", on: false },
        { icon: "🔐", label: "生物识别锁", desc: "面容 ID / 触控 ID", on: true },
      ],
    },
  },
  5: {
    en: {
      badge: "Available Now",
      headline: "Designed for the way you work.",
      sub: "Experience the future of mobile interfaces with fluid glass panels and intuitive interactions.",
      cta: "Get Started Free",
    },
    zh: {
      badge: "现已上线",
      headline: "为你的工作方式而生。",
      sub: "体验流动玻璃面板和直觉交互带来的移动界面未来。",
      cta: "免费开始",
    },
  },
};

// ─── Metadata ───────────────────────────────────────────────────────────────

export function getMetadata(lang: "en" | "zh"): StyleMetadata {
  const nameMap = { en: "Glass Morph", zh: "玻璃拟态" };
  const themeMap = {
    en: "Mobile App UI Design — advanced glassmorphism with layered blur panels on a dark gradient",
    zh: "移动应用 UI 设计——深色渐变上的分层模糊面板高级玻璃拟态",
  };
  const densityLabelMap = { en: "Layered Visual", zh: "分层视觉" };

  const sceneTitles = {
    en: ["Home Screen", "Features", "Dashboard", "Profile", "CTA"],
    zh: ["主屏幕", "功能特性", "仪表盘", "个人资料", "行动号召"],
  };

  const beatActions = {
    en: {
      1: ["Home screen loads"],
      2: ["Feature cards appear"],
      3: ["Panels populate", "Activity list fills"],
      4: ["Profile reveals", "Settings appear"],
      5: ["CTA appears"],
    },
    zh: {
      1: ["主屏幕加载"],
      2: ["功能卡片呈现"],
      3: ["面板填充", "活动列表填充"],
      4: ["资料揭示", "设置出现"],
      5: ["CTA 呈现"],
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
        beatTitle = `${c1.hello}, ${c1.userName}`;
        beatBody = "Home screen with quick actions";
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
    id: "36",
    band: "contemporary-digital",
    name: nameMap[lang],
    theme: themeMap[lang],
    densityLabel: densityLabelMap[lang],
    heroScene: 3,
    colors: {
      bg: "#0f0c29",
      ink: "#ffffff",
      panel: "rgba(255,255,255,0.08)",
    },
    typography: {
      header: "Inter 700",
      body: "Inter 400",
    },
    tags: [
      "glassmorphism",
      "mobile",
      "modern",
      "blur",
      "dark",
      "gradient",
      "app",
      "ui",
      "layered",
      "premium",
    ],
    fonts: ["Inter"],
    scenes,
  };
}

// ─── Component ──────────────────────────────────────────────────────────────

export default function GlassMorph({
  scene,
  beat,
  language,
  isThumbnail,
  reducedMotion,
  onNavigate,
}: BespokeStyleProps) {
  const [entered, setEntered] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

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

  const renderScene1 = () => {
    const c = SCENES[1][language];
    return (
      <div className={styles.appHome}>
        <div className={styles.appHeader}>
          <div className={styles.appGreeting}>
            <p className={styles.appHello}>{c.hello}</p>
            <h1 className={styles.appUserName}>{c.userName}</h1>
          </div>
          <div
            className={styles.appAvatar}
            style={{
              opacity: entered ? 1 : 0,
              transform: entered ? "scale(1)" : "scale(0.8)",
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
            opacity: entered ? 1 : 0,
            transform: entered ? "translateY(0)" : "translateY(1cqh)",
            transition: reducedMotion
              ? "none"
              : "opacity 0.5s ease 0.1s, transform 0.5s ease 0.1s",
          }}
        >
          <span className={styles.searchIcon}>🔍</span>
          <span className={styles.searchInput}>{c.searchPlaceholder}</span>
        </div>

        <div className={styles.appQuickActions}>
          {c.quickActions.map((action, i) => (
            <div
              key={i}
              className={styles.quickAction}
              style={{
                opacity: entered ? 1 : 0,
                transform: entered ? "translateY(0)" : "translateY(1.5cqh)",
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

  const renderScene2 = () => {
    const c = SCENES[2][language];
    return (
      <div className={styles.featureScene}>
        <h2
          className={styles.featureTitle}
          style={{
            opacity: entered ? 1 : 0,
            transition: reducedMotion ? "none" : "opacity 0.5s ease",
          }}
        >
          {c.title}
        </h2>
        <p
          className={styles.featureSubtitle}
          style={{
            opacity: entered ? 0.5 : 0,
            transition: reducedMotion ? "none" : "opacity 0.5s ease 0.1s",
          }}
        >
          {c.subtitle}
        </p>
        <div className={styles.featureStack}>
          {c.features.map((feature, i) => {
            const visible = entered && beat >= 1;
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

  const renderScene3 = () => {
    const c = SCENES[3][language];
    return (
      <div className={styles.dashboardScene}>
        <div className={styles.dashHeader}>
          <h2
            className={styles.dashTitle}
            style={{
              opacity: entered ? 1 : 0,
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
              opacity: entered ? 1 : 0,
              transform: entered ? "translateY(0)" : "translateY(1.5cqh)",
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
                    height: entered ? `${h}%` : "0%",
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
            opacity: entered && beat >= 1 ? 1 : 0,
            transform: entered && beat >= 1 ? "translateY(0)" : "translateY(1cqh)",
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

  const renderScene4 = () => {
    const c = SCENES[4][language];
    return (
      <div className={styles.profileScene}>
        <div
          className={`${styles.glass} ${styles.profileCard}`}
          style={{
            opacity: entered ? 1 : 0,
            transform: entered ? "translateY(0)" : "translateY(2cqh)",
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

        {beat >= 1 && (
          <div
            className={styles.profileSettings}
            style={{
              opacity: entered ? 1 : 0,
              transition: reducedMotion ? "none" : "opacity 0.5s ease 0.2s",
            }}
          >
            {c.settings.map((setting, i) => (
              <div
                key={i}
                className={styles.settingRow}
                style={{
                  opacity: entered ? 1 : 0,
                  transform: entered ? "translateX(0)" : "translateX(2cqw)",
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

  const renderScene5 = () => {
    const c = SCENES[5][language];
    return (
      <div className={styles.ctaScene}>
        <span
          className={styles.ctaBadge}
          style={{
            opacity: entered ? 1 : 0,
            transform: entered ? "translateY(0)" : "translateY(1cqh)",
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
            opacity: entered ? 1 : 0,
            transform: entered ? "translateY(0)" : "translateY(1.5cqh)",
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
            opacity: entered ? 1 : 0,
            transition: reducedMotion ? "none" : "opacity 0.5s ease 0.3s",
          }}
        >
          {c.sub}
        </p>
        <button
          className={styles.ctaButton}
          style={{
            opacity: entered ? 1 : 0,
            transform: entered ? "translateY(0) scale(1)" : "translateY(1cqh) scale(0.95)",
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

  const renderSceneContent = () => {
    switch (scene) {
      case 1:
        return renderScene1();
      case 2:
        return renderScene2();
      case 3:
        return renderScene3();
      case 4:
        return renderScene4();
      case 5:
        return renderScene5();
      default:
        return null;
    }
  };

  return (
    <div className={rootClasses}>
      <div
        ref={trackRef}
        key={`36-${scene}`}
        className={styles.transitionTrack}
      >
        {renderSceneContent()}
      </div>
      {renderNavIndicators()}
    </div>
  );
}

import React, { useEffect, useCallback } from "react";
import type { BespokeStyleProps, StyleMetadata } from "../types";
import SpatialSceneTrack from "./SpatialSceneTrack";
import styles from "./12-iconography.module.css";
import { useFLIP } from "../hooks/useFLIP";

// ─── Transition constants ─────────────────────────────────────────────────

// ─── Font Injection ────────────────────────────────────────────────────────

function useFonts() {
  useEffect(() => {
    const id = "style-12-fonts";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap";
    document.head.appendChild(link);
  }, []);
}

// ─── SVG Icons ──────────────────────────────────────────────────────────────

const ACCENT = "#b8a4d4";

function IconRocket() {
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M24 4C24 4 14 14 14 28C14 34 18 40 24 44C30 40 34 34 34 28C34 14 24 4 24 4Z" stroke={ACCENT} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="24" cy="24" r="5" stroke={ACCENT} strokeWidth="2.5" />
      <path d="M14 30L8 36" stroke={ACCENT} strokeWidth="2.5" strokeLinecap="round" />
      <path d="M34 30L40 36" stroke={ACCENT} strokeWidth="2.5" strokeLinecap="round" />
      <path d="M20 42L18 46" stroke={ACCENT} strokeWidth="2.5" strokeLinecap="round" />
      <path d="M28 42L30 46" stroke={ACCENT} strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

function IconShield() {
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M24 4L6 12V24C6 34 14 42 24 44C34 42 42 34 42 24V12L24 4Z" stroke={ACCENT} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16 24L22 30L32 18" stroke={ACCENT} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconChart() {
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="6" y="28" width="8" height="16" rx="2" stroke={ACCENT} strokeWidth="2.5" />
      <rect x="20" y="18" width="8" height="26" rx="2" stroke={ACCENT} strokeWidth="2.5" />
      <rect x="34" y="8" width="8" height="36" rx="2" stroke={ACCENT} strokeWidth="2.5" />
      <line x1="4" y1="44" x2="44" y2="44" stroke={ACCENT} strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

function IconUsers() {
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="18" cy="16" r="7" stroke={ACCENT} strokeWidth="2.5" />
      <circle cx="34" cy="18" r="5" stroke={ACCENT} strokeWidth="2.5" />
      <path d="M6 40C6 33 11 28 18 28C25 28 30 33 30 40" stroke={ACCENT} strokeWidth="2.5" strokeLinecap="round" />
      <path d="M30 38C30 34 33 31 37 31C41 31 44 34 44 38" stroke={ACCENT} strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

function IconPuzzle() {
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M8 14C8 10.7 10.7 8 14 8H20V12C20 14.2 21.8 16 24 16C26.2 16 28 14.2 28 12V8H34C37.3 8 40 10.7 40 14V20H36C33.8 20 32 21.8 32 24C32 26.2 33.8 28 36 28H40V34C40 37.3 37.3 40 34 40H28V36C28 33.8 26.2 32 24 32C21.8 32 20 33.8 20 36V40H14C10.7 40 8 37.3 8 34V28H12C14.2 28 16 26.2 16 24C16 21.8 14.2 20 12 20H8V14Z" stroke={ACCENT} strokeWidth="2.5" strokeLinejoin="round" />
    </svg>
  );
}

function IconBolt() {
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M26 4L10 28H22L18 44L38 20H26L30 4H26Z" stroke={ACCENT} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconGlobe() {
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="24" cy="24" r="18" stroke={ACCENT} strokeWidth="2.5" />
      <ellipse cx="24" cy="24" rx="8" ry="18" stroke={ACCENT} strokeWidth="2.5" />
      <line x1="6" y1="24" x2="42" y2="24" stroke={ACCENT} strokeWidth="2.5" />
      <path d="M10 14C14 16 20 17 24 17C28 17 34 16 38 14" stroke={ACCENT} strokeWidth="2.5" strokeLinecap="round" />
      <path d="M10 34C14 32 20 31 24 31C28 31 34 32 38 34" stroke={ACCENT} strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

function IconCode() {
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <polyline points="16,14 6,24 16,34" stroke={ACCENT} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points="32,14 42,24 32,34" stroke={ACCENT} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="28" y1="10" x2="20" y2="38" stroke={ACCENT} strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

function IconCloud() {
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M14 36C9 36 5 32 5 27C5 22 9 18 14 18C15 13 19 10 24 10C30 10 35 14 36 20C41 20 44 24 44 29C44 33 41 36 37 36H14Z" stroke={ACCENT} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconMobile() {
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="14" y="4" width="20" height="40" rx="4" stroke={ACCENT} strokeWidth="2.5" />
      <line x1="14" y1="12" x2="34" y2="12" stroke={ACCENT} strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="24" cy="40" r="1.5" fill={ACCENT} />
    </svg>
  );
}

// ─── Content ────────────────────────────────────────────────────────────────

const SCENES = {
  1: {
    en: {
      title: "Welcome to",
      titleAccent: "your new workspace",
      subtitle: "Everything you need to feel at home — friendly, simple, and built for real people",
    },
    zh: {
      title: "欢迎来到",
      titleAccent: "你的新工作空间",
      subtitle: "让你感到宾至如归的一切——友好、简单，为真实的人而构建",
    },
  },
  2: {
    en: {
      label: "Getting Started",
      title: "Simple as one, two, three",
      features: [
        { icon: "bolt", name: "Quick Setup", desc: "Be up and running in under five minutes" },
        { icon: "shield", name: "Safe & Secure", desc: "Your data is always protected and private" },
        { icon: "chart", name: "Gentle Learning", desc: "Helpful tips appear when you need them" },
        { icon: "users", name: "Team Friendly", desc: "Invite colleagues with a single link" },
        { icon: "puzzle", name: "Fits Your Flow", desc: "Works with tools you already love" },
        { icon: "globe", name: "Always Available", desc: "On any device, anywhere you are" },
      ],
    },
    zh: {
      label: "入门指南",
      title: "就像一、二、三一样简单",
      features: [
        { icon: "bolt", name: "快速设置", desc: "五分钟内即可开始使用" },
        { icon: "shield", name: "安全可靠", desc: "你的数据始终受保护和保密" },
        { icon: "chart", name: "轻松学习", desc: "在你需要时出现有用提示" },
        { icon: "users", name: "团队友好", desc: "一个链接就能邀请同事" },
        { icon: "puzzle", name: "适配你的流程", desc: "与你已在使用的工具配合" },
        { icon: "globe", name: "随时可用", desc: "在任何设备上，无论你在哪里" },
      ],
    },
  },
  3: {
    en: {
      label: "Spotlight",
      badge: "Loved by teams",
      name: "Smart Daily Briefing",
      desc: "Every morning, your dashboard greets you with what matters most — today's priorities, pending approvals, and team updates — organized gently so nothing feels overwhelming.",
      bullets: [
        "Wake up to a calm, prioritized view",
        "Gentle nudges, not urgent pings",
        "Celebrate small wins together",
        "End-of-day summary that feels good",
      ],
    },
    zh: {
      label: "焦点功能",
      badge: "团队最爱",
      name: "智能每日简报",
      desc: "每天早上，你的仪表盘向你展示最重要的事情——今天的优先事项、待审批和团队更新——温和地组织好，不让任何事情感到压力。",
      bullets: [
        "醒来看到平静的优先级视图",
        "温柔的提醒，而非紧急催促",
        "一起庆祝小小的胜利",
        "让人愉悦的每日总结",
      ],
    },
  },
  4: {
    en: {
      label: "Plays Well With",
      title: "Friends with your favorite tools",
      integrations: [
        { icon: "code", label: "GitHub" },
        { icon: "cloud", label: "Drive" },
        { icon: "mobile", label: "Slack" },
        { icon: "chart", label: "Notion" },
        { icon: "users", label: "Teams" },
        { icon: "globe", label: "Figma" },
        { icon: "shield", label: "Calendar" },
        { icon: "puzzle", label: "Zapier" },
      ],
    },
    zh: {
      label: "好伙伴",
      title: "和你喜爱的工具做朋友",
      integrations: [
        { icon: "code", label: "GitHub" },
        { icon: "cloud", label: "云盘" },
        { icon: "mobile", label: "Slack" },
        { icon: "chart", label: "Notion" },
        { icon: "users", label: "Teams" },
        { icon: "globe", label: "Figma" },
        { icon: "shield", label: "日历" },
        { icon: "puzzle", label: "Zapier" },
      ],
    },
  },
  5: {
    en: {
      headline: "Start your <em>happier</em> workday, today.",
      cta: "Try It Free — No Credit Card",
    },
    zh: {
      headline: "从今天开始，<em>更愉快地</em>工作。",
      cta: "免费试用 — 无需信用卡",
    },
  },
};

// ─── Icon Renderer ──────────────────────────────────────────────────────────

function renderIcon(type: string) {
  switch (type) {
    case "rocket": return <IconRocket />;
    case "shield": return <IconShield />;
    case "chart": return <IconChart />;
    case "users": return <IconUsers />;
    case "puzzle": return <IconPuzzle />;
    case "bolt": return <IconBolt />;
    case "globe": return <IconGlobe />;
    case "code": return <IconCode />;
    case "cloud": return <IconCloud />;
    case "mobile": return <IconMobile />;
    default: return <IconBolt />;
  }
}

// ─── Metadata ───────────────────────────────────────────────────────────────

export function getMetadata(lang: "en" | "zh"): StyleMetadata {
  const nameMap = { en: "Soft Pastel Friendly", zh: "柔和粉彩友好" };
  const themeMap = {
    en: "Warm bone-and-peach ground with low-saturation pastels, rounded pill and squircle geometry, and a rounded display voice. Best for onboarding, community, and educational content where approachability is the message.",
    zh: "温暖的骨色和桃色底色，低饱和度粉彩，圆润的药丸和圆角矩形几何，圆润的展示字体。最适合入门、社区和教育内容，亲和力即信息。",
  };
  const densityLabelMap = { en: "Approachable", zh: "亲和" };

  const sceneTitles = {
    en: ["Title", "Feature Grid", "Spotlight Feature", "Integrations", "CTA"],
    zh: ["标题", "功能网格", "焦点功能", "集成生态", "行动号召"],
  };

  const beatActions = {
    en: {
      1: ["Hero icon and title appear"],
      2: ["Title appears", "Features 1-3 populate", "Features 4-6 populate"],
      3: ["Spotlight icon and title appear", "Bullets reveal sequentially"],
      4: ["Title appears", "Integration icons populate"],
      5: ["Closing headline and CTA revealed"],
    },
    zh: {
      1: ["主图标和标题呈现"],
      2: ["标题呈现", "第 1-3 个功能填充", "第 4-6 个功能填充"],
      3: ["焦点图标和标题呈现", "要点依次揭示"],
      4: ["标题呈现", "集成图标填充"],
      5: ["结语和行动号召揭示"],
    },
  };

  const BEAT_COUNTS: Record<number, number> = { 1: 1, 2: 3, 3: 2, 4: 2, 5: 1 };

  const scenes = [1, 2, 3, 4, 5].map((id) => {
    const beatCount = BEAT_COUNTS[id];
    const actions = beatActions[lang][id as keyof (typeof beatActions)["en"]];
    const c = SCENES[id as keyof typeof SCENES][lang] as any;

    const beats = Array.from({ length: beatCount }, (_, beatIdx) => {
      let beatTitle = "";
      let beatBody = "";

      if (id === 1) {
        beatTitle = `${c.title} ${c.titleAccent}`;
        beatBody = c.subtitle;
      } else if (id === 2) {
        beatTitle = c.title;
        const features = (c.features as Array<{ name: string }>) || [];
        const visible = Math.min(beatIdx * 3, 6);
        beatBody = features.slice(0, visible).map((f) => f.name).join(" / ");
      } else if (id === 3) {
        beatTitle = c.name;
        if (beatIdx >= 1) {
          const bullets = (c.bullets as string[]) || [];
          beatBody = bullets.join(" / ");
        }
      } else if (id === 4) {
        beatTitle = c.title;
        if (beatIdx >= 1) {
          const ints = (c.integrations as Array<{ label: string }>) || [];
          beatBody = ints.map((i) => i.label).join(" / ");
        }
      } else if (id === 5) {
        beatTitle = c.headline.replace(/<[^>]+>/g, "");
        beatBody = c.cta;
      }

      return { id: beatIdx, action: actions[beatIdx], title: beatTitle, body: beatBody };
    });

    return { id, title: sceneTitles[lang][id - 1], beats };
  });

  return {
    id: "12",
    band: "balanced-hybrid",
    name: nameMap[lang],
    theme: themeMap[lang],
    densityLabel: densityLabelMap[lang],
    heroScene: 3,
    colors: { bg: "#fef7f0", ink: "#4a3f35", panel: "#fff5eb" },
    typography: { header: "Nunito 700", body: "Nunito 400" },
    tags: ["pastel", "friendly", "warm", "approachable", "rounded", "soft", "onboarding", "community", "educational"],
    fonts: ["Nunito"],
    scenes,
  };
}

// ─── Component ──────────────────────────────────────────────────────────────

const BEAT_LAYOUT_MODES = {
  2: "motion",
  3: "motion",
  4: "motion",
} satisfies Record<number, "motion" | "reserved">;

export default function Iconography({
  scene, beat, language, isThumbnail, reducedMotion, onNavigate, }: BespokeStyleProps) {
  useFonts();

  // FLIP for icon grids where new icons push the layout
  const { ref: featureGridRef } = useFLIP<HTMLDivElement>({
    watch: [beat],
    duration: 400,
    easing: "cubic-bezier(0.16, 1, 0.3, 1)",
    selector: ".featureCard",
  });

  const { ref: integrationRowRef } = useFLIP<HTMLDivElement>({
    watch: [beat],
    duration: 400,
    easing: "cubic-bezier(0.16, 1, 0.3, 1)",
    selector: ".intItem",
  });

  const handleNavClick = useCallback(
    (e: React.MouseEvent, targetScene: number) => {
      e.stopPropagation();
      onNavigate?.(targetScene, 0);
    },
    [onNavigate],
  );

  const rootClasses = [styles.root, reducedMotion ? styles.reducedMotion : "", isThumbnail ? styles.thumbnail : ""].filter(Boolean).join(" ");

  const renderScene1 = () => {
    const c = SCENES[1][language as keyof typeof SCENES[1]];
    return (
      <div className={styles.scene1}>
        <div className={[styles.heroIcon, styles.heroIconVisible].filter(Boolean).join(" ")}>
          <IconRocket />
        </div>
        <h1 className={styles.heroTitle}>
          {c.title}<br /><em>{c.titleAccent}</em>
        </h1>
        <p className={styles.heroSub}>{c.subtitle}</p>
      </div>
    );
  };

  const renderScene2 = (beatNum: number, isCurrent: boolean) => {
    const c = SCENES[2][language as keyof typeof SCENES[2]];
    const features = c.features as Array<{ icon: string; name: string; desc: string }>;
    const visibleCount = beatNum === 0 ? 0 : beatNum === 1 ? 3 : 6;
    return (
      <div className={styles.scene2}>
        <span className={styles.secLabel}>{c.label}</span>
        <h2 className={styles.secTitle}>{c.title}</h2>
        <div ref={isCurrent ? featureGridRef : undefined} className={styles.featureGrid}>
          {features.map((f, i) => {
            const visible = i < visibleCount;
            const cls = [styles.featureCard, visible ? styles.featureCardVisible : ""].filter(Boolean).join(" ");
            return (
              <div
                key={i}
                className={cls}
                style={reducedMotion ? { opacity: visible ? 1 : 0, transform: "none" } : { transitionDelay: `${i * 0.08}s` }}
              >
                <div className={styles.featureIcon}>{renderIcon(f.icon)}</div>
                <span className={styles.featureName}>{f.name}</span>
                <span className={styles.featureDesc}>{f.desc}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderScene3 = (beatNum: number) => {
    const c = SCENES[3][language as keyof typeof SCENES[3]];
    const bullets = c.bullets as string[];
    return (
      <div className={styles.scene3}>
        <span className={styles.secLabel}>{c.label}</span>
        <div className={styles.spotlight}>
          <div className={[styles.spotlightIconArea, styles.spotlightIconAreaVisible].filter(Boolean).join(" ")}>
            <IconBolt />
          </div>
          <div className={styles.spotlightInfo}>
            <span className={styles.spotlightBadge}>{c.badge}</span>
            <h2 className={styles.spotlightName}>{c.name}</h2>
            <p className={styles.spotlightDesc}>{c.desc}</p>
            {beatNum >= 1 && (
              <div className={styles.spotlightBullets}>
                {bullets.map((b, i) => (
                  <div
                    key={i}
                    className={[styles.spotlightBullet, styles.spotlightBulletVisible].filter(Boolean).join(" ")}
                    style={reducedMotion ? { opacity: 1, transform: "none" } : { transitionDelay: `${i * 0.1}s` }}
                  >
                    <span className={styles.bulletCheck}>✓</span>
                    {b}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderScene4 = (beatNum: number, isCurrent: boolean) => {
    const c = SCENES[4][language as keyof typeof SCENES[4]];
    const integrations = c.integrations as Array<{ icon: string; label: string }>;
    return (
      <div className={styles.scene4}>
        <span className={styles.secLabel}>{c.label}</span>
        <h2 className={styles.secTitle}>{c.title}</h2>
        <div ref={isCurrent ? integrationRowRef : undefined} className={styles.integrationRow}>
          {integrations.map((item, i) => {
            const visible = beatNum >= 1;
            const cls = [styles.intItem, visible ? styles.intItemVisible : ""].filter(Boolean).join(" ");
            return (
              <div
                key={i}
                className={cls}
                style={reducedMotion ? { opacity: visible ? 1 : 0, transform: "none" } : { transitionDelay: `${i * 0.07}s` }}
              >
                <div className={styles.intIcon}>{renderIcon(item.icon)}</div>
                <span className={styles.intLabel}>{item.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderScene5 = () => {
    const c = SCENES[5][language as keyof typeof SCENES[5]];
    const iconTypes = ["bolt", "shield", "chart", "users", "puzzle"];
    return (
      <div className={styles.scene5}>
        <div className={styles.closingIconRow}>
          {iconTypes.map((type, i) => (
            <React.Fragment key={i}>{React.cloneElement(renderIcon(type) as React.ReactElement<{ className?: string; style?: React.CSSProperties }>, {
              className: styles.visible,
              style: reducedMotion ? undefined : { transitionDelay: `${i * 0.1}s` },
            })}</React.Fragment>
          ))}
        </div>
        <h2 className={styles.closingHeadline} dangerouslySetInnerHTML={{ __html: c.headline }} />
        <span className={styles.closingCta}>{c.cta}</span>
      </div>
    );
  };

  const renderSceneFor = (sceneNum: number, beatNum: number, isCurrent: boolean) => {
    switch (sceneNum) {
      case 1: return renderScene1();
      case 2: return renderScene2(beatNum, isCurrent);
      case 3: return renderScene3(beatNum);
      case 4: return renderScene4(beatNum, isCurrent);
      case 5: return renderScene5();
      default: return null;
    }
  };

  const renderNav = () => {
    if (isThumbnail) return null;
    const sceneIcons: Record<number, string> = { 1: "rocket", 2: "chart", 3: "bolt", 4: "puzzle", 5: "globe" };
    return (
      <nav className={styles.navIcons} aria-label="Scene navigation">
        {[1, 2, 3, 4, 5].map((s) => {
          const isActive = s === scene;
          return (
            <button
              key={s}
              type="button"
              className={[styles.navIcon, isActive ? styles.navIconActive : ""].filter(Boolean).join(" ")}
              aria-label={`Jump to scene ${s}`}
              onClick={(e) => handleNavClick(e, s)}
            >
              {renderIcon(sceneIcons[s])}
            </button>
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

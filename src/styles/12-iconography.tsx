import React, { useLayoutEffect, useEffect, useRef, useCallback, useState } from "react";
import type { BespokeStyleProps, StyleMetadata } from "../types";
import styles from "./12-iconography.module.css";
import { useFLIP } from "../hooks/useFLIP";

// ─── Transition constants ─────────────────────────────────────────────────

const TRANSITION_DURATION = 530; // 500ms animation + 30ms enter delay
const BEAT_COUNTS: Record<number, number> = { 1: 1, 2: 3, 3: 2, 4: 2, 5: 1 };

// ─── Font Injection ────────────────────────────────────────────────────────

function useFonts() {
  useEffect(() => {
    const id = "style-12-fonts";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap";
    document.head.appendChild(link);
  }, []);
}

// ─── SVG Icons ──────────────────────────────────────────────────────────────

const ACCENT = "#4299e1";

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
      title: "Built for",
      titleAccent: "teams that ship",
      subtitle: "Discover the powerful features that make your workflow effortless",
    },
    zh: {
      title: "为高效团队",
      titleAccent: "而生",
      subtitle: "探索让工作流程变得轻松的强大功能",
    },
  },
  2: {
    en: {
      label: "Core Features",
      title: "Everything you need",
      features: [
        { icon: "bolt", name: "Lightning Fast", desc: "Sub-50ms response times across all operations" },
        { icon: "shield", name: "Enterprise Secure", desc: "SOC 2 Type II certified with end-to-end encryption" },
        { icon: "chart", name: "Smart Analytics", desc: "Real-time insights with customizable dashboards" },
        { icon: "users", name: "Team Collaboration", desc: "Work together seamlessly with real-time co-editing" },
        { icon: "puzzle", name: "Extensible Platform", desc: "200+ integrations and open API for custom workflows" },
        { icon: "globe", name: "Global Scale", desc: "Deployed in 14 regions with 99.99% uptime SLA" },
      ],
    },
    zh: {
      label: "核心功能",
      title: "你需要的一切",
      features: [
        { icon: "bolt", name: "极速体验", desc: "所有操作响应时间低于 50 毫秒" },
        { icon: "shield", name: "企业级安全", desc: "SOC 2 Type II 认证，端到端加密" },
        { icon: "chart", name: "智能分析", desc: "实时洞察，可自定义仪表盘" },
        { icon: "users", name: "团队协作", desc: "实时协同编辑，无缝团队合作" },
        { icon: "puzzle", name: "可扩展平台", desc: "200+ 集成和开放 API 支持自定义工作流" },
        { icon: "globe", name: "全球部署", desc: "14 个区域部署，99.99% 可用性 SLA" },
      ],
    },
  },
  3: {
    en: {
      label: "Spotlight",
      badge: "Featured",
      name: "Smart Workflow Engine",
      desc: "Our AI-powered workflow engine learns from your team's patterns to automate repetitive tasks and surface the right information at the right time.",
      bullets: [
        "Automated task routing based on team capacity",
        "Smart suggestions for next-best actions",
        "Custom rule builder with visual editor",
        "Natural language command interface",
      ],
    },
    zh: {
      label: "焦点功能",
      badge: "推荐",
      name: "智能工作流引擎",
      desc: "我们的 AI 驱动工作流引擎从团队模式中学习，自动执行重复性任务，在正确的时间呈现正确的信息。",
      bullets: [
        "基于团队容量的自动任务分配",
        "智能建议下一步最佳操作",
        "可视化编辑器构建自定义规则",
        "自然语言命令界面",
      ],
    },
  },
  4: {
    en: {
      label: "Integrations",
      title: "Plays well with others",
      integrations: [
        { icon: "code", label: "GitHub" },
        { icon: "cloud", label: "AWS" },
        { icon: "mobile", label: "Slack" },
        { icon: "chart", label: "Jira" },
        { icon: "users", label: "Notion" },
        { icon: "globe", label: "Figma" },
        { icon: "shield", label: "Okta" },
        { icon: "puzzle", label: "Zapier" },
      ],
    },
    zh: {
      label: "集成生态",
      title: "与你喜爱的工具无缝配合",
      integrations: [
        { icon: "code", label: "GitHub" },
        { icon: "cloud", label: "AWS" },
        { icon: "mobile", label: "Slack" },
        { icon: "chart", label: "Jira" },
        { icon: "users", label: "Notion" },
        { icon: "globe", label: "Figma" },
        { icon: "shield", label: "Okta" },
        { icon: "puzzle", label: "Zapier" },
      ],
    },
  },
  5: {
    en: {
      headline: "Start building <em>better</em>, today.",
      cta: "Try Free for 30 Days",
    },
    zh: {
      headline: "从今天开始，<em>更好地</em>构建。",
      cta: "免费试用 30 天",
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
  const nameMap = { en: "Iconography", zh: "图标展示" };
  const themeMap = {
    en: "Product Feature Tour — icon-driven showcase with clean icon + label + description pattern and light airy feel",
    zh: "产品功能导览——图标驱动的展示，简洁的图标加标签加描述模式，轻盈通透的感觉",
  };
  const densityLabelMap = { en: "Light", zh: "轻盈" };

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
    colors: { bg: "#f0f4f8", ink: "#1a202c", panel: "#ffffff" },
    typography: { header: "Inter 700", body: "Inter 400" },
    tags: ["iconography", "icons", "product", "features", "showcase", "light", "airy", "clean", "tour"],
    fonts: ["Inter"],
    scenes,
  };
}

// ─── Component ──────────────────────────────────────────────────────────────

export default function Iconography({
  scene, beat, language, isThumbnail, reducedMotion, onNavigate, isTransitionClone,
}: BespokeStyleProps) {
  useFonts();
  const trackRef = useRef<HTMLDivElement>(null);

  const [outgoingScene, setOutgoingScene] = useState<number | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const prevSceneRef = useRef<number>(scene);

  // Detect scene changes and manage transition lifecycle
  useLayoutEffect(() => {
    const prev = prevSceneRef.current;
    if (prev !== scene && !reducedMotion) {
      setOutgoingScene(prev);
      setIsTransitioning(true);
      const timer = setTimeout(() => {
        setOutgoingScene(null);
        setIsTransitioning(false);
      }, TRANSITION_DURATION);
      prevSceneRef.current = scene;
      return () => clearTimeout(timer);
    }
    prevSceneRef.current = scene;
  }, [scene, reducedMotion]);

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

  const outgoingLayerClasses = [styles.sceneLayer, styles.exitAnim].filter(Boolean).join(" ");
  const incomingLayerClasses = [styles.sceneLayer, isTransitioning && !isTransitionClone ? styles.enterAnim : ""].filter(Boolean).join(" ");

  return (
    <div className={rootClasses}>
      {/* Outgoing scene (icon scale-down + fade) */}
      {outgoingScene !== null && (
        <div className={outgoingLayerClasses}>
          <div className={styles.track}>
            {renderSceneFor(outgoingScene, BEAT_COUNTS[outgoingScene] - 1, false)}
          </div>
        </div>
      )}

      {/* Incoming / current scene (icon scale-up + fade-in) */}
      <div className={incomingLayerClasses}>
        <div ref={trackRef} key={scene} className={styles.track}>
          {renderSceneFor(scene, beat, true)}
        </div>
      </div>

      {renderNav()}
    </div>
  );
}

import React, { useEffect, useState, useCallback } from "react";
import type { BespokeStyleProps, StyleMetadata } from "../types";
import styles from "./39-notion-doc.module.css";

// ─── Content ────────────────────────────────────────────────────────────────

interface TodoItem {
  checked: boolean;
  text: string;
}

interface ToggleBlock {
  title: string;
  body: string;
}

interface SceneContent {
  en: {
    pageTitle?: string;
    title?: string;
    subtitle?: string;
    icon?: string;
    coverGradient?: string;
    h2?: string;
    paragraph?: string;
    h3?: string;
    bullets?: string[];
    numbered?: string[];
    codeBlock?: string;
    toggles?: ToggleBlock[];
    callout?: string;
    todos?: TodoItem[];
    tableColumns?: string[];
    tableRows?: string[][];
  };
  zh: {
    pageTitle?: string;
    title?: string;
    subtitle?: string;
    icon?: string;
    coverGradient?: string;
    h2?: string;
    paragraph?: string;
    h3?: string;
    bullets?: string[];
    numbered?: string[];
    codeBlock?: string;
    toggles?: ToggleBlock[];
    callout?: string;
    todos?: TodoItem[];
    tableColumns?: string[];
    tableRows?: string[][];
  };
}

const SCENES: Record<number, SceneContent> = {
  1: {
    en: {
      title: "Engineering Team Wiki",
      subtitle: "Central knowledge hub for our team",
      icon: "📚",
      coverGradient: "linear-gradient(135deg, #e8e4df 0%, #d4cfc7 40%, #c9c4bb 100%)",
    },
    zh: {
      title: "工程团队知识库",
      subtitle: "团队核心知识中心",
      icon: "📚",
      coverGradient: "linear-gradient(135deg, #e8e4df 0%, #d4cfc7 40%, #c9c4bb 100%)",
    },
  },
  2: {
    en: {
      pageTitle: "Onboarding Guide",
      h2: "Getting Started",
      paragraph:
        "Welcome to the engineering team. This guide walks you through setting up your development environment, understanding our codebase conventions, and getting your first PR merged. We follow a trunk-based development workflow with short-lived feature branches and mandatory code review.",
      h3: "Development Environment",
      bullets: [
        "Node.js 18+ and pnpm 8 required for all services",
        "Clone the monorepo and run `pnpm install` at root",
        "Configure your .env.local from the .env.template file",
        "Run `pnpm dev` to start the local development server on port 3000",
      ],
      numbered: [
        "Set up SSH keys and add them to your GitHub account",
        "Install the recommended VS Code extensions listed in .vscode/extensions.json",
        "Request access to staging and production environments via IT",
        "Complete the mandatory security training module in Lattice",
      ],
      codeBlock: "pnpm install && pnpm dev",
    },
    zh: {
      pageTitle: "入职指南",
      h2: "快速开始",
      paragraph:
        "欢迎加入工程团队。本指南将帮助你配置开发环境、了解代码库规范，并完成你的第一个 PR 合并。我们采用基于主干的开发工作流，使用短生命周期特性分支和强制代码审查制度。",
      h3: "开发环境",
      bullets: [
        "所有服务需要 Node.js 18+ 和 pnpm 8",
        "克隆 monorepo 并在根目录运行 `pnpm install`",
        "从 .env.template 配置你的 .env.local 文件",
        "运行 `pnpm dev` 在 3000 端口启动本地开发服务器",
      ],
      numbered: [
        "配置 SSH 密钥并添加到 GitHub 账户",
        "安装 .vscode/extensions.json 中列出的推荐 VS Code 扩展",
        "通过 IT 部门申请预发布和生产环境访问权限",
        "在 Lattice 系统完成必修的安全培训模块",
      ],
      codeBlock: "pnpm install && pnpm dev",
    },
  },
  3: {
    en: {
      pageTitle: "Architecture Decisions",
      toggles: [
        {
          title: "Why we chose PostgreSQL",
          body: "After evaluating MySQL, PostgreSQL, and CockroachDB over a six-week spike, we settled on PostgreSQL for its superior JSONB support, strong consistency guarantees, and mature extension ecosystem. Our workload benefits from Postgres' advanced indexing capabilities (GIN, GiST) and the ability to run complex analytical queries alongside transactional workloads. The managed RDS offering also integrates well with our AWS infrastructure.",
        },
        {
          title: "API Design Principles",
          body: "Our APIs follow REST conventions for resource-oriented endpoints, with GraphQL available for complex query scenarios. Versioning is handled through URL prefixes (/v1/, /v2/). All responses use camelCase JSON with a consistent envelope format: { data, error, meta }. Rate limiting is enforced at 1000 req/min per API key. Webhooks use HMAC-SHA256 signatures for payload verification.",
        },
      ],
    },
    zh: {
      pageTitle: "架构决策",
      toggles: [
        {
          title: "为什么选择 PostgreSQL",
          body: "经过六周的技术调研，我们评估了 MySQL、PostgreSQL 和 CockroachDB，最终选择了 PostgreSQL，因为它出色的 JSONB 支持、强一致性保证以及成熟的扩展生态。我们的业务场景受益于 Postgres 高级索引能力（GIN、GiST）以及在事务负载上运行复杂分析查询的能力。托管 RDS 服务也与我们的 AWS 基础设施良好集成。",
        },
        {
          title: "API 设计原则",
          body: "我们的 API 遵循 REST 规范设计面向资源的端点，同时提供 GraphQL 以支持复杂查询场景。版本控制通过 URL 前缀（/v1/、/v2/）管理。所有响应使用 camelCase JSON 和统一的信封格式：{ data, error, meta }。速率限制为每个 API 密钥 1000 次请求/分钟。Webhook 使用 HMAC-SHA256 签名进行载荷验证。",
        },
      ],
    },
  },
  4: {
    en: {
      pageTitle: "Sprint Planning",
      callout:
        "Reminder: All PRs need 2 approvals before merge. Use the 'ready-for-review' label to signal your PR is ready for the team to look at.",
      todos: [
        { checked: true, text: "Complete authentication service refactor (JWT rotation)" },
        { checked: true, text: "Write migration scripts for user preferences table" },
        { checked: false, text: "Implement webhook retry mechanism with exponential backoff" },
        { checked: false, text: "Update API documentation for v2 endpoints in ReadMe" },
        { checked: false, text: "Load testing for the new Elasticsearch index (target 5k QPS)" },
      ],
    },
    zh: {
      pageTitle: "迭代规划",
      callout: "提醒：所有 PR 需要 2 人审批才能合并。使用 'ready-for-review' 标签标记你的 PR 已就绪，等待团队审查。",
      todos: [
        { checked: true, text: "完成认证服务重构（JWT 轮换）" },
        { checked: true, text: "编写用户偏好表的迁移脚本" },
        { checked: false, text: "实现带指数退避的 webhook 重试机制" },
        { checked: false, text: "在 ReadMe 中更新 v2 端点的 API 文档" },
        { checked: false, text: "新 Elasticsearch 索引的负载测试（目标 5k QPS）" },
      ],
    },
  },
  5: {
    en: {
      pageTitle: "Team Roster",
      tableColumns: ["Name", "Role", "Team", "Status"],
      tableRows: [
        ["Sarah Chen", "Staff Engineer", "Platform", "Active"],
        ["Marcus Johnson", "Senior Engineer", "Backend", "Active"],
        ["Yuki Tanaka", "Engineering Manager", "Platform", "Active"],
        ["Alex Rivera", "Frontend Engineer", "Growth", "OOO"],
        ["Priya Patel", "Data Engineer", "Analytics", "Active"],
        ["James Wilson", "DevOps Engineer", "Infrastructure", "Active"],
      ],
    },
    zh: {
      pageTitle: "团队名册",
      tableColumns: ["姓名", "角色", "团队", "状态"],
      tableRows: [
        ["陈思远", "资深工程师", "平台组", "在职"],
        ["马库斯·约翰逊", "高级工程师", "后端组", "在职"],
        ["田中由纪", "工程经理", "平台组", "在职"],
        ["亚历克斯·里维拉", "前端工程师", "增长组", "休假"],
        ["普里亚·帕特尔", "数据工程师", "分析组", "在职"],
        ["詹姆斯·威尔逊", "运维工程师", "基础架构组", "在职"],
      ],
    },
  },
};

// ─── Sidebar Nav ────────────────────────────────────────────────────────────

interface SidebarItem {
  icon: string;
  label: { en: string; zh: string };
  scene: number | null;
  indent: number;
  isFolder?: boolean;
}

const SIDEBAR_ITEMS: SidebarItem[] = [
  { icon: "📚", label: { en: "Engineering Wiki", zh: "工程知识库" }, scene: 1, indent: 0 },
  { icon: "📄", label: { en: "Onboarding Guide", zh: "入职指南" }, scene: 2, indent: 1 },
  { icon: "📄", label: { en: "Architecture Decisions", zh: "架构决策" }, scene: 3, indent: 1 },
  { icon: "📄", label: { en: "Sprint Planning", zh: "迭代规划" }, scene: 4, indent: 1 },
  { icon: "📄", label: { en: "Team Roster", zh: "团队名册" }, scene: 5, indent: 1 },
  { icon: "📂", label: { en: "Product Team", zh: "产品团队" }, scene: null, indent: 0, isFolder: true },
  { icon: "📂", label: { en: "Design Team", zh: "设计团队" }, scene: null, indent: 0, isFolder: true },
];

// ─── Metadata ───────────────────────────────────────────────────────────────

export function getMetadata(lang: "en" | "zh"): StyleMetadata {
  const nameMap = { en: "Notion Doc", zh: "Notion 文档" };
  const themeMap = {
    en: "Team Wiki — Notion-style document viewer with block-level content, toggles, callouts, and table views",
    zh: "团队知识库——Notion 风格文档查看器，支持块级内容、折叠块、标注框和表格视图",
  };
  const densityLabelMap = { en: "Reading-First", zh: "阅读优先" };

  const sceneTitles = {
    en: ["Cover Page", "Content Blocks", "Toggle Sections", "Callout & Todo", "Table View"],
    zh: ["封面页", "内容块", "折叠区块", "标注与待办", "表格视图"],
  };

  const beatActions = {
    en: {
      1: ["Page loads with cover"],
      2: ["Headings and paragraph appear", "Lists and code block fill in"],
      3: ["First toggle expands", "Second toggle expands"],
      4: ["Callout and todos render"],
      5: ["Table header and first rows", "More rows appear", "Full table visible"],
    },
    zh: {
      1: ["页面加载封面"],
      2: ["标题和段落出现", "列表和代码块填充"],
      3: ["第一个折叠展开", "第二个折叠展开"],
      4: ["标注和待办渲染"],
      5: ["表头和首行出现", "更多行出现", "完整表格显示"],
    },
  };

  const BEAT_COUNTS: Record<number, number> = {
    1: 1,
    2: 2,
    3: 2,
    4: 1,
    5: 3,
  };

  const scenes = [1, 2, 3, 4, 5].map((id) => {
    const beatCount = BEAT_COUNTS[id];
    const actions = beatActions[lang][id as keyof (typeof beatActions)["en"]];
    const c = SCENES[id][lang];

    const beats = Array.from({ length: beatCount }, (_, beatIdx) => {
      let beatTitle = "";
      let beatBody = "";

      if (id === 1) {
        beatTitle = c.title || "";
        beatBody = c.subtitle || "";
      } else if (id === 2) {
        beatTitle = c.pageTitle || "";
        if (beatIdx === 0) {
          beatBody = `${c.h2}: ${(c.paragraph || "").slice(0, 80)}...`;
        } else {
          beatBody = (c.bullets || []).slice(0, 2).map((b) => b.slice(0, 40)).join(" / ");
        }
      } else if (id === 3) {
        beatTitle = c.pageTitle || "";
        const visibleToggles = (c.toggles || []).slice(0, beatIdx + 1);
        beatBody = visibleToggles.map((t) => t.title).join(" / ");
      } else if (id === 4) {
        beatTitle = c.pageTitle || "";
        beatBody = (c.callout || "").slice(0, 80);
      } else if (id === 5) {
        beatTitle = c.pageTitle || "";
        const visibleRows = (c.tableRows || []).slice(0, (beatIdx + 1) * 2);
        beatBody = visibleRows.map((r) => r[0]).join(" / ");
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
    id: "39",
    band: "contemporary-digital",
    name: nameMap[lang],
    theme: themeMap[lang],
    densityLabel: densityLabelMap[lang],
    heroScene: 2,
    colors: {
      bg: "#ffffff",
      ink: "#37352f",
      panel: "#f7f6f3",
    },
    typography: {
      header: "Inter 600",
      body: "Inter 400",
    },
    tags: ["notion", "document", "wiki", "blocks", "collaborative", "clean", "minimal", "productivity"],
    fonts: ["Inter"],
    scenes,
  };
}

// ─── Component ──────────────────────────────────────────────────────────────

export default function NotionDoc({
  scene,
  beat,
  language,
  isThumbnail,
  reducedMotion,
  onNavigate,
  isTransitionClone,
}: BespokeStyleProps) {
  const [entered, setEntered] = useState(false);

  // Font injection
  useEffect(() => {
    const FONT_ID = "style-39-fonts-inter";
    if (document.getElementById(FONT_ID)) return;
    const link = document.createElement("link");
    link.id = FONT_ID;
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap";
    document.head.appendChild(link);
  }, []);

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

  // ── Sidebar ──────────────────────────────────────────────────────────────

  const renderSidebar = () => {
    return (
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <span className={styles.sidebarWorkspaceIcon}>⬡</span>
          <span className={styles.sidebarWorkspaceName}>
            {language === "zh" ? "团队工作区" : "Team Workspace"}
          </span>
        </div>
        <div className={styles.sidebarSearch}>
          <span className={styles.sidebarSearchIcon}>🔍</span>
          <span className={styles.sidebarSearchPlaceholder}>
            {language === "zh" ? "搜索..." : "Search..."}
          </span>
        </div>
        <nav className={styles.sidebarNav} aria-label="Page navigation">
          {SIDEBAR_ITEMS.map((item, i) => {
            const isActive = item.scene === scene;
            const clickable = item.scene !== null && !isThumbnail;
            return (
              <div
                key={i}
                className={[
                  styles.sidebarItem,
                  isActive ? styles.sidebarItemActive : "",
                  item.indent > 0 ? styles.sidebarItemIndented : "",
                  item.isFolder ? styles.sidebarItemFolder : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                style={{
                  opacity: entered ? 1 : 0,
                  transform: entered ? "none" : "translateX(-1cqw)",
                  transition: reducedMotion
                    ? "none"
                    : `opacity 0.3s ease ${i * 0.05}s, transform 0.3s ease ${i * 0.05}s`,
                  cursor: clickable ? "pointer" : "default",
                }}
                onClick={clickable ? (e) => handleNavClick(e, item.scene!) : undefined}
                role={clickable ? "button" : undefined}
                tabIndex={clickable ? 0 : undefined}
              >
                <span className={styles.sidebarItemIcon}>{item.icon}</span>
                <span className={styles.sidebarItemLabel}>{item.label[language]}</span>
              </div>
            );
          })}
        </nav>
      </aside>
    );
  };

  // ── Scene 1: Cover Page ──────────────────────────────────────────────────

  const renderScene1 = () => {
    const c = SCENES[1][language];
    return (
      <div className={styles.coverPage}>
        <div
          className={styles.coverImage}
          style={{ background: c.coverGradient }}
        >
          <div className={styles.coverPattern} />
        </div>
        <div className={styles.coverContent}>
          <div
            className={styles.coverIcon}
            style={{
              opacity: entered ? 1 : 0,
              transform: entered ? "translateY(0)" : "translateY(1cqh)",
              transition: reducedMotion ? "none" : "opacity 0.5s ease 0.2s, transform 0.5s ease 0.2s",
            }}
          >
            {c.icon}
          </div>
          <h1
            className={styles.coverTitle}
            style={{
              opacity: entered ? 1 : 0,
              transform: entered ? "translateY(0)" : "translateY(1cqh)",
              transition: reducedMotion ? "none" : "opacity 0.5s ease 0.35s, transform 0.5s ease 0.35s",
            }}
          >
            {c.title}
          </h1>
          <p
            className={styles.coverSubtitle}
            style={{
              opacity: entered ? 1 : 0,
              transition: reducedMotion ? "none" : "opacity 0.5s ease 0.5s",
            }}
          >
            {c.subtitle}
          </p>
          <div
            className={styles.coverMeta}
            style={{
              opacity: entered ? 1 : 0,
              transition: reducedMotion ? "none" : "opacity 0.5s ease 0.65s",
            }}
          >
            <span className={styles.coverMetaItem}>
              <span className={styles.coverMetaIcon}>👥</span>
              {language === "zh" ? "12 位成员" : "12 members"}
            </span>
            <span className={styles.coverMetaItem}>
              <span className={styles.coverMetaIcon}>📄</span>
              {language === "zh" ? "47 个页面" : "47 pages"}
            </span>
            <span className={styles.coverMetaItem}>
              <span className={styles.coverMetaIcon}>🕐</span>
              {language === "zh" ? "最近编辑 2 小时前" : "Last edited 2h ago"}
            </span>
          </div>
        </div>
      </div>
    );
  };

  // ── Scene 2: Content Blocks ──────────────────────────────────────────────

  const renderScene2 = () => {
    const c = SCENES[2][language];
    const showLists = beat >= 1;

    return (
      <div className={styles.docPage}>
        <div className={styles.pageHeader}>
          <span className={styles.pageIcon}>📄</span>
          <h1 className={styles.pageTitle}>{c.pageTitle}</h1>
        </div>

        <div className={styles.blocksContainer}>
          {/* H2 */}
          <h2
            className={styles.blockH2}
            style={{
              opacity: entered ? 1 : 0,
              transform: entered ? "none" : "translateY(0.8cqh)",
              transition: reducedMotion ? "none" : "opacity 0.4s ease 0.1s, transform 0.4s ease 0.1s",
            }}
          >
            {c.h2}
          </h2>

          {/* Paragraph */}
          <p
            className={styles.blockParagraph}
            style={{
              opacity: entered ? 1 : 0,
              transform: entered ? "none" : "translateY(0.8cqh)",
              transition: reducedMotion ? "none" : "opacity 0.4s ease 0.2s, transform 0.4s ease 0.2s",
            }}
          >
            {c.paragraph}
          </p>

          {/* H3 */}
          <h3
            className={styles.blockH3}
            style={{
              opacity: entered ? 1 : 0,
              transform: entered ? "none" : "translateY(0.8cqh)",
              transition: reducedMotion ? "none" : "opacity 0.4s ease 0.3s, transform 0.4s ease 0.3s",
            }}
          >
            {c.h3}
          </h3>

          {/* Bullet List */}
          {showLists && (
            <ul
              className={styles.blockBulletList}
              style={{
                opacity: entered ? 1 : 0,
                transition: reducedMotion ? "none" : "opacity 0.4s ease 0.1s",
              }}
            >
              {(c.bullets || []).map((item, i) => (
                <li
                  key={i}
                  className={styles.blockBulletItem}
                  style={{
                    opacity: entered ? 1 : 0,
                    transform: entered ? "none" : "translateX(-0.5cqw)",
                    transition: reducedMotion
                      ? "none"
                      : `opacity 0.3s ease ${0.15 + i * 0.06}s, transform 0.3s ease ${0.15 + i * 0.06}s`,
                  }}
                >
                  <span className={styles.bulletDot}>•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          )}

          {/* Numbered List */}
          {showLists && (
            <ol
              className={styles.blockNumberedList}
              style={{
                opacity: entered ? 1 : 0,
                transition: reducedMotion ? "none" : "opacity 0.4s ease 0.3s",
              }}
            >
              {(c.numbered || []).map((item, i) => (
                <li
                  key={i}
                  className={styles.blockNumberedItem}
                  style={{
                    opacity: entered ? 1 : 0,
                    transform: entered ? "none" : "translateX(-0.5cqw)",
                    transition: reducedMotion
                      ? "none"
                      : `opacity 0.3s ease ${0.35 + i * 0.06}s, transform 0.3s ease ${0.35 + i * 0.06}s`,
                  }}
                >
                  <span className={styles.numberedIndex}>{i + 1}.</span>
                  <span>{item}</span>
                </li>
              ))}
            </ol>
          )}

          {/* Code Block */}
          {showLists && (
            <div
              className={styles.blockCode}
              style={{
                opacity: entered ? 1 : 0,
                transform: entered ? "none" : "translateY(0.8cqh)",
                transition: reducedMotion ? "none" : "opacity 0.4s ease 0.6s, transform 0.4s ease 0.6s",
              }}
            >
              <div className={styles.codeHeader}>
                <span className={styles.codeLang}>bash</span>
                <span className={styles.codeCopy}>
                  {language === "zh" ? "复制" : "Copy"}
                </span>
              </div>
              <pre className={styles.codeBody}>
                <code>{c.codeBlock}</code>
              </pre>
            </div>
          )}
        </div>
      </div>
    );
  };

  // ── Scene 3: Toggle Sections ─────────────────────────────────────────────

  const renderScene3 = () => {
    const c = SCENES[3][language];
    const toggles = c.toggles || [];

    return (
      <div className={styles.docPage}>
        <div className={styles.pageHeader}>
          <span className={styles.pageIcon}>🏗️</span>
          <h1 className={styles.pageTitle}>{c.pageTitle}</h1>
        </div>

        <div className={styles.blocksContainer}>
          {toggles.map((toggle, i) => {
            const isOpen = beat >= i;
            return (
              <div
                key={i}
                className={styles.toggleBlock}
                style={{
                  opacity: entered ? 1 : 0,
                  transition: reducedMotion ? "none" : `opacity 0.4s ease ${i * 0.15}s`,
                }}
              >
                <div
                  className={styles.toggleHeader}
                  onClick={!isThumbnail ? (e) => e.stopPropagation() : undefined}
                  style={{ cursor: isThumbnail ? "default" : "pointer" }}
                >
                  <span
                    className={styles.toggleArrow}
                    style={{
                      transform: isOpen ? "rotate(90deg)" : "rotate(0deg)",
                      transition: reducedMotion ? "none" : "transform 0.25s ease",
                    }}
                  >
                    ▶
                  </span>
                  <span className={styles.toggleTitle}>{toggle.title}</span>
                </div>
                <div
                  className={styles.toggleBody}
                  style={{
                    maxHeight: isOpen ? "30cqh" : "0",
                    opacity: isOpen ? 1 : 0,
                    transition: reducedMotion
                      ? "none"
                      : "max-height 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease",
                  }}
                >
                  <p className={styles.toggleBodyText}>{toggle.body}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // ── Scene 4: Callout & Todo ──────────────────────────────────────────────

  const renderScene4 = () => {
    const c = SCENES[4][language];

    return (
      <div className={styles.docPage}>
        <div className={styles.pageHeader}>
          <span className={styles.pageIcon}>🎯</span>
          <h1 className={styles.pageTitle}>{c.pageTitle}</h1>
        </div>

        <div className={styles.blocksContainer}>
          {/* Callout */}
          <div
            className={styles.calloutBlock}
            style={{
              opacity: entered ? 1 : 0,
              transform: entered ? "none" : "translateY(0.8cqh)",
              transition: reducedMotion ? "none" : "opacity 0.4s ease 0.1s, transform 0.4s ease 0.1s",
            }}
          >
            <span className={styles.calloutIcon}>💡</span>
            <p className={styles.calloutText}>{c.callout}</p>
          </div>

          {/* Divider */}
          <div
            className={styles.blockDivider}
            style={{
              opacity: entered ? 1 : 0,
              transition: reducedMotion ? "none" : "opacity 0.4s ease 0.25s",
            }}
          />

          {/* Todo List */}
          <div className={styles.todoList}>
            <h3
              className={styles.todoHeading}
              style={{
                opacity: entered ? 1 : 0,
                transition: reducedMotion ? "none" : "opacity 0.4s ease 0.3s",
              }}
            >
              {language === "zh" ? "待办事项" : "Tasks"}
            </h3>
            {(c.todos || []).map((todo, i) => (
              <div
                key={i}
                className={styles.todoItem}
                style={{
                  opacity: entered ? 1 : 0,
                  transform: entered ? "none" : "translateX(-0.5cqw)",
                  transition: reducedMotion
                    ? "none"
                    : `opacity 0.3s ease ${0.35 + i * 0.07}s, transform 0.3s ease ${0.35 + i * 0.07}s`,
                }}
              >
                <div
                  className={[
                    styles.todoCheckbox,
                    todo.checked ? styles.todoChecked : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  onClick={!isThumbnail ? (e) => e.stopPropagation() : undefined}
                >
                  {todo.checked && <span className={styles.todoCheckmark}>✓</span>}
                </div>
                <span
                  className={[
                    styles.todoText,
                    todo.checked ? styles.todoTextDone : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  {todo.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // ── Scene 5: Table View ──────────────────────────────────────────────────

  const renderScene5 = () => {
    const c = SCENES[5][language];
    const columns = c.tableColumns || [];
    const rows = c.tableRows || [];
    const visibleCount = Math.min(rows.length, (beat + 1) * 2);

    return (
      <div className={styles.docPage}>
        <div className={styles.pageHeader}>
          <span className={styles.pageIcon}>👥</span>
          <h1 className={styles.pageTitle}>{c.pageTitle}</h1>
        </div>

        <div className={styles.blocksContainer}>
          <div
            className={styles.tableWrapper}
            style={{
              opacity: entered ? 1 : 0,
              transition: reducedMotion ? "none" : "opacity 0.4s ease 0.1s",
            }}
          >
            <div className={styles.tableToolbar}>
              <span className={styles.tableCount}>
                {rows.length} {language === "zh" ? "条记录" : "records"}
              </span>
              <div className={styles.tableActions}>
                <span className={styles.tableActionBtn}>🔍</span>
                <span className={styles.tableActionBtn}>⚙️</span>
              </div>
            </div>
            <table className={styles.notionTable}>
              <thead>
                <tr>
                  {columns.map((col, i) => (
                    <th
                      key={i}
                      className={styles.tableHeader}
                      style={{
                        opacity: entered ? 1 : 0,
                        transition: reducedMotion
                          ? "none"
                          : `opacity 0.3s ease ${0.15 + i * 0.05}s`,
                      }}
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.slice(0, visibleCount).map((row, ri) => (
                  <tr
                    key={ri}
                    className={ri % 2 === 1 ? styles.tableRowAlt : ""}
                    style={{
                      opacity: entered ? 1 : 0,
                      transform: entered ? "none" : "translateY(0.5cqh)",
                      transition: reducedMotion
                        ? "none"
                        : `opacity 0.3s ease ${0.2 + ri * 0.06}s, transform 0.3s ease ${0.2 + ri * 0.06}s`,
                    }}
                  >
                    {row.map((cell, ci) => (
                      <td key={ci} className={styles.tableCell}>
                        {ci === 3 ? (
                          <span
                            className={[
                              styles.statusBadge,
                              cell === "Active" || cell === "在职"
                                ? styles.statusActive
                                : styles.statusOoo,
                            ]
                              .filter(Boolean)
                              .join(" ")}
                          >
                            {cell}
                          </span>
                        ) : ci === 0 ? (
                          <span className={styles.tableName}>
                            <span className={styles.tableAvatar}>
                              {cell.charAt(0)}
                            </span>
                            {cell}
                          </span>
                        ) : (
                          cell
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // ── Scene Router ─────────────────────────────────────────────────────────

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

  // ── Navigation Dots ──────────────────────────────────────────────────────

  const renderNavDots = () => {
    if (isThumbnail) return null;

    return (
      <nav className={styles.navDots} aria-label="Scene navigation">
        {[1, 2, 3, 4, 5].map((s) => {
          const isActive = s === scene;
          return (
            <button
              key={s}
              type="button"
              className={[
                styles.navDot,
                isActive ? styles.navDotActive : "",
              ]
                .filter(Boolean)
                .join(" ")}
              aria-label={`Jump to scene ${s}`}
              onClick={(e) => handleNavClick(e, s)}
              style={reducedMotion ? { transitionDuration: "0s" } : undefined}
            />
          );
        })}
      </nav>
    );
  };

  return (
    <div
      data-testid="style-39-root"
      className={rootClasses}
    >
      <div
        key={`39-${scene}`}
        className={`${styles.transitionTrack} ${!isTransitionClone ? styles.animateSceneEnter : ""}`}
        style={reducedMotion ? { animationDuration: "0s" } : undefined}
      >
        <div className={styles.layout}>
          {renderSidebar()}
          <main className={styles.contentArea}>
            {renderSceneContent()}
          </main>
        </div>
      </div>
      {renderNavDots()}
    </div>
  );
}

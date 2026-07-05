import React, { useEffect, useState, useRef, useCallback } from "react";
import type { BespokeStyleProps, StyleMetadata } from "../types";
import styles from "./41-annual-report.module.css";

// ─── Content ────────────────────────────────────────────────────────────────

interface SceneContent {
  en: Record<string, any>;
  zh: Record<string, any>;
}

const SCENES: Record<number, SceneContent> = {
  1: {
    en: {
      companyName: "ACME Corporation",
      reportYear: "Annual Report 2025",
      tagline: "Building Tomorrow, Today",
      fiscalNote: "Fiscal Year Ended December 31, 2025",
      established: "Est. 1987",
      employees: "12,400 employees worldwide",
    },
    zh: {
      companyName: "ACME 集团",
      reportYear: "2025 年度报告",
      tagline: "铸就未来，始于今日",
      fiscalNote: "财年截至 2025 年 12 月 31 日",
      established: "创立于 1987",
      employees: "全球 12,400 名员工",
    },
  },
  2: {
    en: {
      title: "Letter from the Chairman",
      salutation: "Dear Shareholders,",
      paragraphs: [
        "As we close another transformative year, I am pleased to report that ACME Corporation delivered strong financial performance across all business segments. Our consolidated revenue reached $4.2 billion, representing a 23% increase over the prior year, driven by robust demand in our technology solutions and sustainable energy divisions.",
        "Throughout the year, we made significant strategic investments in research and development, allocating $680 million to innovation initiatives that position us for long-term growth. Our expansion into emerging markets yielded particularly encouraging results, with Asia-Pacific revenue growing 41% year-over-year.",
        "None of this would be possible without the dedication of our 12,400 employees worldwide. Their commitment to excellence and our customers' success remains our greatest competitive advantage. We remain focused on delivering sustainable value to all stakeholders while maintaining the highest standards of corporate governance.",
        "As we look ahead, the board and management team are confident in our strategic direction. The global transition to clean energy, digital transformation across industries, and the growing demand for intelligent infrastructure present unprecedented opportunities for ACME.",
      ],
      signatureName: "James R. Harrington",
      signatureTitle: "Chairman of the Board",
    },
    zh: {
      title: "董事长致辞",
      salutation: "尊敬的股东：",
      paragraphs: [
        "在又一个变革之年结束之际，我很高兴地向大家报告，ACME 集团在所有业务板块均取得了强劲的财务业绩。我们的综合收入达到 42 亿美元，同比增长 23%，这得益于技术解决方案和可持续能源部门的强劲需求。",
        "全年，我们在研发方面进行了重大战略投资，投入 6.8 亿美元用于创新项目，为我们的长期增长奠定基础。我们在新兴市场的扩张取得了特别令人鼓舞的成果，亚太地区收入同比增长 41%。",
        "这一切成就的取得，离不开我们全球 12,400 名员工的奉献。他们对卓越的追求和对客户成功的承诺，始终是我们最大的竞争优势。我们将继续专注于为所有利益相关者创造可持续价值，同时保持最高标准的公司治理。",
        "展望未来，董事会和管理团队对我们的战略方向充满信心。全球清洁能源转型、各行业的数字化变革以及对智能基础设施日益增长的需求，为 ACME 带来了前所未有的机遇。",
      ],
      signatureName: "詹姆斯·R·哈灵顿",
      signatureTitle: "董事长",
    },
  },
  3: {
    en: {
      title: "Financial Highlights",
      subtitle: "Consolidated Results for Fiscal Year 2025",
      note: "(In millions of US dollars, except per share amounts)",
      tableHeaders: ["Metric", "2025", "2024", "Change"],
      tableRows: [
        ["Revenue", "$4,200", "$3,414", "+23.0%"],
        ["Gross Profit", "$1,890", "$1,502", "+25.8%"],
        ["Operating Income", "$840", "$672", "+25.0%"],
        ["Net Income", "$630", "$504", "+25.0%"],
        ["EPS (Diluted)", "$4.82", "$3.86", "+24.9%"],
        ["Free Cash Flow", "$720", "$580", "+24.1%"],
        ["Total Assets", "$8,900", "$7,200", "+23.6%"],
        ["Shareholders' Equity", "$3,400", "$2,850", "+19.3%"],
      ],
      footnote:
        "Note: Financial statements prepared in accordance with IFRS. Comparative figures have been restated for the adoption of new accounting standards effective January 1, 2024.",
    },
    zh: {
      title: "财务摘要",
      subtitle: "2025 财年综合业绩",
      note: "（除每股金额外，单位为百万美元）",
      tableHeaders: ["指标", "2025", "2024", "变动"],
      tableRows: [
        ["营业收入", "4,200", "3,414", "+23.0%"],
        ["毛利润", "1,890", "1,502", "+25.8%"],
        ["营业利润", "840", "672", "+25.0%"],
        ["净利润", "630", "504", "+25.0%"],
        ["每股收益（稀释）", "$4.82", "$3.86", "+24.9%"],
        ["自由现金流", "720", "580", "+24.1%"],
        ["总资产", "8,900", "7,200", "+23.6%"],
        ["股东权益", "3,400", "2,850", "+19.3%"],
      ],
      footnote:
        "注：财务报表按照国际财务报告准则编制。比较数字已因 2024 年 1 月 1 日生效的新会计准则采用而重述。",
    },
  },
  4: {
    en: {
      title: "Segment Performance",
      intro:
        "Our four business segments each delivered year-over-year growth, reflecting the strength of our diversified portfolio and the successful execution of our multi-year strategy.",
      segments: [
        {
          name: "Technology Solutions",
          revenue: "$1,680M",
          pct: 40,
          growth: "+28%",
          detail:
            "Cloud infrastructure and enterprise software led growth, with new contract value up 35% driven by AI platform adoption.",
        },
        {
          name: "Sustainable Energy",
          revenue: "$1,260M",
          pct: 30,
          growth: "+31%",
          detail:
            "Solar and wind project deployments accelerated. Battery storage division achieved profitability for the first time.",
        },
        {
          name: "Industrial Products",
          revenue: "$840M",
          pct: 20,
          growth: "+15%",
          detail:
            "Steady demand from manufacturing clients. New smart sensor product line contributed 8% of segment revenue.",
        },
        {
          name: "Services & Consulting",
          revenue: "$420M",
          pct: 10,
          growth: "+18%",
          detail:
            "Digital transformation consulting engagements grew 22%. Expansion into sustainability advisory services.",
        },
      ],
    },
    zh: {
      title: "板块业绩",
      intro:
        "我们四大业务板块均实现同比增长，彰显了我们多元化投资组合的实力和多年战略的成功执行。",
      segments: [
        {
          name: "技术解决方案",
          revenue: "16.8亿",
          pct: 40,
          growth: "+28%",
          detail:
            "云基础设施和企业软件引领增长，AI 平台应用推动新合同价值增长 35%。",
        },
        {
          name: "可持续能源",
          revenue: "12.6亿",
          pct: 30,
          growth: "+31%",
          detail:
            "太阳能和风能项目部署加速。电池储能部门首次实现盈利。",
        },
        {
          name: "工业产品",
          revenue: "8.4亿",
          pct: 20,
          growth: "+15%",
          detail:
            "制造业客户需求稳定。新型智能传感器产品线贡献板块收入的 8%。",
        },
        {
          name: "服务与咨询",
          revenue: "4.2亿",
          pct: 10,
          growth: "+18%",
          detail:
            "数字化转型咨询业务增长 22%。拓展至可持续发展咨询服务。",
        },
      ],
    },
  },
  5: {
    en: {
      title: "Independent Auditor's Report",
      toTheBoard: "To the Board of Directors and Shareholders of ACME Corporation:",
      body: "We have audited the accompanying consolidated financial statements of ACME Corporation and its subsidiaries (the \"Company\") for the year ended December 31, 2025, comprising the consolidated statement of financial position, the consolidated statement of comprehensive income, the consolidated statement of changes in equity, and the consolidated statement of cash flows.",
      opinion:
        "In our opinion, the financial statements present fairly, in all material respects, the financial position of the Company as at December 31, 2025, and its financial performance and its cash flows for the year then ended in accordance with International Financial Reporting Standards. Our audit was conducted in accordance with International Standards on Auditing (ISAs).",
      emphasis:
        "Emphasis of Matter — Without modifying our opinion, we draw attention to Note 14 of the financial statements, which describes the uncertainty related to the outcome of the ongoing regulatory review in the European Union regarding data localization requirements.",
      firm: "PricewaterhouseCoopers LLP",
      location: "New York, NY",
      date: "February 14, 2026",
      partner: "Michael Torres, CPA — Lead Engagement Partner",
    },
    zh: {
      title: "独立审计师报告",
      toTheBoard: "致 ACME 集团董事会及全体股东：",
      body: "我们已审计了 ACME 集团及其子公司（以下简称「公司」）截至 2025 年 12 月 31 日的合并财务报表，包括合并财务状况表、合并综合收益表、合并权益变动表和合并现金流量表。",
      opinion:
        "我们认为，上述财务报表在所有重大方面均按照国际财务报告准则的规定，公允反映了公司截至 2025 年 12 月 31 日的财务状况以及该年度的经营成果和现金流量。我们的审计是按照国际审计准则（ISAs）执行的。",
      emphasis:
        "强调事项——在不修改审计意见的前提下，我们提请关注财务报表附注 14，其中描述了与欧盟正在进行的关于数据本地化要求的监管审查结果相关的不确定性。",
      firm: "普华永道会计师事务所",
      location: "纽约",
      date: "2026 年 2 月 14 日",
      partner: "迈克尔·托雷斯，注册会计师——首席审计合伙人",
    },
  },
};

// ─── Metadata ───────────────────────────────────────────────────────────────

export function getMetadata(lang: "en" | "zh"): StyleMetadata {
  const nameMap = { en: "Annual Report", zh: "年度报告" };
  const themeMap = {
    en: "Fiscal Year Summary — corporate annual report with financial tables and chairman's letter",
    zh: "财年摘要——企业年度报告，含财务表格和董事长致辞",
  };
  const densityLabelMap = { en: "Document-Dense", zh: "文档密集" };

  const sceneTitles = {
    en: ["Cover", "Chairman's Letter", "Financials", "Segments", "Auditor's Report"],
    zh: ["封面", "董事长致辞", "财务摘要", "板块业绩", "审计报告"],
  };

  const beatActions = {
    en: {
      1: ["Cover page revealed"],
      2: ["Letter header and salutation", "Body paragraphs appear"],
      3: ["Table header and first 4 rows", "Rows 5-8 appear", "Footnote revealed"],
      4: ["Segment bars animate in", "Detail text appears"],
      5: ["Auditor statement"],
    },
    zh: {
      1: ["封面呈现"],
      2: ["信头和称呼", "正文段落出现"],
      3: ["表头和前 4 行", "第 5-8 行出现", "脚注揭示"],
      4: ["板块条形图动画", "详情文字出现"],
      5: ["审计师陈述"],
    },
  };

  const BEAT_COUNTS: Record<number, number> = {
    1: 1,
    2: 2,
    3: 3,
    4: 2,
    5: 1,
  };

  const scenes = [1, 2, 3, 4, 5].map((id) => {
    const beatCount = BEAT_COUNTS[id];
    const actions = beatActions[lang][id as keyof (typeof beatActions)["en"]];
    const c = SCENES[id][lang];

    const beats = Array.from({ length: beatCount }, (_, beatIdx) => {
      let beatTitle = "";
      let beatBody = "";

      if (id === 1) {
        beatTitle = `${c.companyName} — ${c.reportYear}`;
        beatBody = c.tagline as string;
      } else if (id === 2) {
        beatTitle = c.title as string;
        beatBody =
          beatIdx >= 1
            ? ((c.paragraphs as string[])[0] || "").slice(0, 120) + "..."
            : c.salutation as string;
      } else if (id === 3) {
        beatTitle = c.title as string;
        const rows = (c.tableRows as string[][]) || [];
        const visible = rows.slice(0, (beatIdx + 1) * 3);
        beatBody = visible.map((r) => `${r[0]}: ${r[1]}`).join(" / ");
      } else if (id === 4) {
        beatTitle = c.title as string;
        const segs = (c.segments as Array<{ name: string; revenue: string }>) || [];
        beatBody =
          beatIdx >= 1
            ? segs.map((s) => `${s.name}: ${s.revenue}`).join(" / ")
            : (c.intro as string).slice(0, 100);
      } else if (id === 5) {
        beatTitle = c.title as string;
        beatBody = (c.firm as string) + " — " + (c.date as string);
      }

      return { id: beatIdx, action: actions[beatIdx], title: beatTitle, body: beatBody };
    });

    return { id, title: sceneTitles[lang][id - 1], beats };
  });

  return {
    id: "41",
    band: "text-report",
    name: nameMap[lang],
    theme: themeMap[lang],
    densityLabel: densityLabelMap[lang],
    heroScene: 3,
    colors: { bg: "#ffffff", ink: "#1a1a1a", panel: "#f5f5f5" },
    typography: { header: "Georgia 700", body: "Source Serif Pro 400" },
    tags: ["annual", "report", "corporate", "financial", "formal", "dense", "table", "serif"],
    fonts: ["Georgia", "Source Serif Pro"],
    scenes,
  };
}

// ─── Component ──────────────────────────────────────────────────────────────

export default function AnnualReport({
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
    const inject = (id: string, href: string) => {
      if (document.getElementById(id)) return;
      const link = document.createElement("link");
      link.id = id;
      link.rel = "stylesheet";
      link.href = href;
      document.head.appendChild(link);
    };
    inject(
      "style-41-fonts-source-serif",
      "https://fonts.googleapis.com/css2?family=Source+Serif+Pro:wght@400;600;700&display=swap",
    );
    inject(
      "style-41-fonts-noto-serif-sc",
      "https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;600;700&display=swap",
    );
  }, []);

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

  const rootClasses = [
    styles.root,
    reducedMotion ? styles.reducedMotion : "",
  ]
    .filter(Boolean)
    .join(" ");

  // ── Scene 1: Cover ──────────────────────────────────────────────────────

  const renderScene1 = () => {
    const c = SCENES[1][language];
    return (
      <div className={styles.cover}>
        <div className={styles.coverTopRule} />
        <div className={styles.coverInner}>
          <div
            className={styles.coverMeta}
            style={{
              opacity: entered ? 1 : 0,
              transition: reducedMotion ? "none" : "opacity 0.6s ease 0.2s",
            }}
          >
            <span>{c.established}</span>
            <span className={styles.coverMetaDot}>•</span>
            <span>{c.employees}</span>
          </div>
          <h1
            className={styles.coverCompany}
            style={{
              opacity: entered ? 1 : 0,
              transform: entered ? "none" : "translateY(1cqh)",
              transition: reducedMotion
                ? "none"
                : "opacity 0.8s ease 0.4s, transform 0.8s ease 0.4s",
            }}
          >
            {c.companyName}
          </h1>
          <div className={styles.coverRule} />
          <h2
            className={styles.coverYear}
            style={{
              opacity: entered ? 1 : 0,
              transition: reducedMotion ? "none" : "opacity 0.8s ease 0.7s",
            }}
          >
            {c.reportYear}
          </h2>
          <p
            className={styles.coverTagline}
            style={{
              opacity: entered ? 1 : 0,
              transition: reducedMotion ? "none" : "opacity 0.8s ease 1s",
            }}
          >
            {c.tagline}
          </p>
          <div className={styles.coverSpacer} />
          <p
            className={styles.coverFiscal}
            style={{
              opacity: entered ? 0.6 : 0,
              transition: reducedMotion ? "none" : "opacity 0.8s ease 1.3s",
            }}
          >
            {c.fiscalNote}
          </p>
        </div>
        <div className={styles.coverBottomRule} />
      </div>
    );
  };

  // ── Scene 2: Chairman's Letter ─────────────────────────────────────────

  const renderScene2 = () => {
    const c = SCENES[2][language];
    const paragraphs = c.paragraphs as string[];
    return (
      <div className={styles.letter}>
        <div className={styles.letterHeader}>
          <h2 className={styles.letterTitle}>{c.title}</h2>
          <div className={styles.letterRule} />
        </div>
        <p
          className={styles.letterSalutation}
          style={{
            opacity: entered ? 1 : 0,
            transition: reducedMotion ? "none" : "opacity 0.5s ease 0.2s",
          }}
        >
          {c.salutation}
        </p>
        {beat >= 1 && (
          <div className={styles.letterBody}>
            {paragraphs.map((para, i) => (
              <p
                key={i}
                className={i === 0 ? styles.letterDropCap : ""}
                style={{
                  opacity: entered ? 1 : 0,
                  transform: entered ? "none" : "translateY(0.8cqh)",
                  transition: reducedMotion
                    ? "none"
                    : `opacity 0.6s ease ${0.3 + i * 0.15}s, transform 0.6s ease ${0.3 + i * 0.15}s`,
                }}
              >
                {para}
              </p>
            ))}
          </div>
        )}
        {beat >= 1 && (
          <div
            className={styles.letterSignature}
            style={{
              opacity: entered ? 1 : 0,
              transition: reducedMotion
                ? "none"
                : `opacity 0.6s ease ${0.3 + paragraphs.length * 0.15}s`,
            }}
          >
            <p className={styles.letterSigName}>{c.signatureName}</p>
            <p className={styles.letterSigTitle}>{c.signatureTitle}</p>
          </div>
        )}
      </div>
    );
  };

  // ── Scene 3: Financial Highlights ──────────────────────────────────────

  const renderScene3 = () => {
    const c = SCENES[3][language];
    const headers = c.tableHeaders as string[];
    const rows = c.tableRows as string[][];
    const visibleRows = rows.slice(0, Math.min(rows.length, (beat + 1) * 3 + 1));

    return (
      <div className={styles.financials}>
        <div className={styles.finHeader}>
          <h2 className={styles.finTitle}>{c.title}</h2>
          <p className={styles.finSubtitle}>{c.subtitle}</p>
          <p className={styles.finNote}>{c.note}</p>
        </div>
        <div className={styles.finTableWrap}>
          <table className={styles.finTable}>
            <thead>
              <tr>
                {headers.map((h, i) => (
                  <th
                    key={i}
                    className={i > 0 ? styles.finThRight : ""}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visibleRows.map((row, i) => (
                <tr
                  key={i}
                  style={{
                    opacity: entered ? 1 : 0,
                    transition: reducedMotion
                      ? "none"
                      : `opacity 0.3s ease ${i * 0.05}s`,
                  }}
                >
                  {row.map((cell, j) => (
                    <td
                      key={j}
                      className={[
                        j > 0 ? styles.finTdRight : "",
                        j === 3 ? styles.finTdChange : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {beat >= 2 && (
          <p
            className={styles.finFootnote}
            style={{
              opacity: entered ? 1 : 0,
              transition: reducedMotion ? "none" : "opacity 0.5s ease 0.3s",
            }}
          >
            {c.footnote}
          </p>
        )}
      </div>
    );
  };

  // ── Scene 4: Segment Performance ───────────────────────────────────────

  const renderScene4 = () => {
    const c = SCENES[4][language];
    const segments = c.segments as Array<{
      name: string;
      revenue: string;
      pct: number;
      growth: string;
      detail: string;
    }>;

    return (
      <div className={styles.segments}>
        <div className={styles.segHeader}>
          <h2 className={styles.segTitle}>{c.title}</h2>
          <p className={styles.segIntro}>{c.intro}</p>
        </div>
        <div className={styles.segBars}>
          {segments.map((seg, i) => (
            <div
              key={i}
              className={styles.segBarRow}
              style={{
                opacity: entered ? 1 : 0,
                transform: entered ? "none" : "translateX(-2cqw)",
                transition: reducedMotion
                  ? "none"
                  : `opacity 0.5s ease ${i * 0.12}s, transform 0.5s ease ${i * 0.12}s`,
              }}
            >
              <div className={styles.segBarLabel}>
                <span className={styles.segBarName}>{seg.name}</span>
                <span className={styles.segBarGrowth}>{seg.growth}</span>
              </div>
              <div className={styles.segBarTrack}>
                <div
                  className={styles.segBarFill}
                  style={{
                    width: entered ? `${seg.pct}%` : "0%",
                    transition: reducedMotion
                      ? "none"
                      : `width 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${0.2 + i * 0.12}s`,
                  }}
                />
              </div>
              <div className={styles.segBarRevenue}>{seg.revenue}</div>
            </div>
          ))}
        </div>
        {beat >= 1 && (
          <div className={styles.segDetails}>
            {segments.slice(0, 2).map((seg, i) => (
              <p
                key={i}
                className={styles.segDetail}
                style={{
                  opacity: entered ? 1 : 0,
                  transition: reducedMotion
                    ? "none"
                    : `opacity 0.5s ease ${0.6 + i * 0.15}s`,
                }}
              >
                <strong>{seg.name}:</strong> {seg.detail}
              </p>
            ))}
          </div>
        )}
      </div>
    );
  };

  // ── Scene 5: Auditor's Report ──────────────────────────────────────────

  const renderScene5 = () => {
    const c = SCENES[5][language];
    return (
      <div className={styles.auditor}>
        <div className={styles.auditorHeader}>
          <h2 className={styles.auditorTitle}>{c.title}</h2>
          <div className={styles.auditorRule} />
        </div>
        <p className={styles.auditorTo}>{c.toTheBoard}</p>
        <div className={styles.auditorBody}>
          <p
            style={{
              opacity: entered ? 1 : 0,
              transition: reducedMotion ? "none" : "opacity 0.6s ease 0.2s",
            }}
          >
            {c.body}
          </p>
          <p
            style={{
              opacity: entered ? 1 : 0,
              transition: reducedMotion ? "none" : "opacity 0.6s ease 0.5s",
            }}
          >
            {c.opinion}
          </p>
          <p
            className={styles.auditorEmphasis}
            style={{
              opacity: entered ? 1 : 0,
              transition: reducedMotion ? "none" : "opacity 0.6s ease 0.8s",
            }}
          >
            {c.emphasis}
          </p>
        </div>
        <div className={styles.auditorSigBlock}>
          <p className={styles.auditorFirm}>{c.firm}</p>
          <p className={styles.auditorPartner}>{c.partner}</p>
          <p className={styles.auditorLocation}>
            {c.location} &nbsp;|&nbsp; {c.date}
          </p>
        </div>
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

  // ── Navigation (Page Numbers) ──────────────────────────────────────────

  const renderNav = () => {
    if (isThumbnail) return null;
    const pageLabels = {
      en: ["Cover", "Letter", "Financials", "Segments", "Auditor"],
      zh: ["封面", "致辞", "财务", "板块", "审计"],
    };
    return (
      <nav className={styles.nav} aria-label="Page navigation">
        <div className={styles.navRule} />
        <div className={styles.navItems}>
          {[1, 2, 3, 4, 5].map((s) => {
            const isActive = s === scene;
            return (
              <button
                key={s}
                type="button"
                className={[
                  styles.navItem,
                  isActive ? styles.navItemActive : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                onClick={(e) => handleNavClick(e, s)}
                aria-label={`Jump to scene ${s}`}
                style={reducedMotion ? { transitionDuration: "0s" } : undefined}
              >
                <span className={styles.navNum}>{s}</span>
                <span className={styles.navLabel}>
                  {pageLabels[language][s - 1]}
                </span>
              </button>
            );
          })}
        </div>
        <div className={styles.navPageIndicator}>
          {language === "zh" ? `第 ${scene} 页，共 5 页` : `Page ${scene} of 5`}
        </div>
      </nav>
    );
  };

  return (
    <div data-testid="style-41-root" className={rootClasses}>
      <div
        ref={trackRef}
        key={`41-${scene}`}
        className={styles.transitionTrack}
        style={reducedMotion ? { transitionDuration: "0s" } : undefined}
      >
        {renderSceneContent()}
      </div>
      {renderNav()}
    </div>
  );
}

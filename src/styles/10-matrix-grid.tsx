import React, { useEffect, useCallback } from "react";
import type { BespokeStyleProps, StyleMetadata } from "../types";
import SpatialSceneTrack from "./SpatialSceneTrack";
import styles from "./10-matrix-grid.module.css";

// ─── Transition constants ─────────────────────────────────────────────────

// ─── Font Injection ────────────────────────────────────────────────────────

function useFonts() {
  useEffect(() => {
    const id = "style-10-fonts";
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
      tag: "Market Analysis 2026",
      title: "Competitive",
      titleHighlight: "Landscape",
      subtitle: "A systematic analysis of market positioning, feature parity, and strategic differentiation",
    },
    zh: {
      tag: "2026 市场分析",
      title: "竞争",
      titleHighlight: "格局",
      subtitle: "对市场定位、功能对等性和战略差异化的系统分析",
    },
  },
  2: {
    en: {
      header: "Market Quadrant",
      title: "Where we stand",
      quads: [
        { label: "Leaders", name: "High Capability", desc: "Established players with broad feature sets and strong market share", count: "3" },
        { label: "Challengers", name: "High Growth", desc: "Fast-moving competitors gaining traction in niche segments", count: "5" },
        { label: "Niche", name: "Specialized", desc: "Focused solutions targeting specific verticals or use cases", count: "8" },
        { label: "Us", name: "Differentiated", desc: "Unique positioning at the intersection of depth and usability", count: "1", highlight: true },
      ],
    },
    zh: {
      header: "市场象限",
      title: "我们的位置",
      quads: [
        { label: "领导者", name: "高能力", desc: "功能广泛、市场份额稳固的老牌玩家", count: "3" },
        { label: "挑战者", name: "高增长", desc: "在细分领域快速崛起的竞争者", count: "5" },
        { label: "利基", name: "专业化", desc: "针对特定垂直领域或用例的聚焦方案", count: "8" },
        { label: "我们", name: "差异化", desc: "在深度和可用性交叉点上的独特定位", count: "1", highlight: true },
      ],
    },
  },
  3: {
    en: {
      header: "Feature Comparison",
      title: "Head-to-head analysis",
      headers: ["Feature", "Us", "Competitor A", "Competitor B"],
      rows: [
        { feature: "Real-time Collaboration", vals: ["yes", "yes", "partial"], our: true },
        { feature: "Offline Mode", vals: ["yes", "no", "no"], our: true },
        { feature: "API Access", vals: ["yes", "yes", "yes"], our: false },
        { feature: "Custom Workflows", vals: ["yes", "partial", "no"], our: true },
        { feature: "Mobile App", vals: ["yes", "yes", "partial"], our: false },
        { feature: "SSO / SAML", vals: ["yes", "yes", "no"], our: true },
        { feature: "Audit Logs", vals: ["yes", "yes", "no"], our: true },
      ],
    },
    zh: {
      header: "功能对比",
      title: "正面对比分析",
      headers: ["功能", "我们", "竞品 A", "竞品 B"],
      rows: [
        { feature: "实时协作", vals: ["yes", "yes", "partial"], our: true },
        { feature: "离线模式", vals: ["yes", "no", "no"], our: true },
        { feature: "API 接入", vals: ["yes", "yes", "yes"], our: false },
        { feature: "自定义工作流", vals: ["yes", "partial", "no"], our: true },
        { feature: "移动应用", vals: ["yes", "yes", "partial"], our: false },
        { feature: "SSO / SAML", vals: ["yes", "yes", "no"], our: true },
        { feature: "审计日志", vals: ["yes", "yes", "no"], our: true },
      ],
    },
  },
  4: {
    en: {
      header: "Capability Matrix",
      title: "Depth across dimensions",
      categories: ["Core", "Integration", "Security", "Scale"],
      features: [
        { name: "Workflow Engine", vals: ["9.2", "8.5", "7.0", "6.8"] },
        { name: "Data Pipeline", vals: ["8.8", "9.0", "6.5", "7.2"] },
        { name: "Access Control", vals: ["9.5", "8.0", "9.2", "5.5"] },
        { name: "Performance", vals: ["8.5", "7.8", "7.5", "9.0"] },
      ],
    },
    zh: {
      header: "能力矩阵",
      title: "各维度深度",
      categories: ["核心", "集成", "安全", "规模"],
      features: [
        { name: "工作流引擎", vals: ["9.2", "8.5", "7.0", "6.8"] },
        { name: "数据管道", vals: ["8.8", "9.0", "6.5", "7.2"] },
        { name: "访问控制", vals: ["9.5", "8.0", "9.2", "5.5"] },
        { name: "性能表现", vals: ["8.5", "7.8", "7.5", "9.0"] },
      ],
    },
  },
  5: {
    en: {
      statement: "Data-driven clarity for <em>strategic advantage</em>",
      data: [
        { val: "14", lbl: "Competitors Tracked" },
        { val: "47", lbl: "Features Compared" },
        { val: "9.2", lbl: "Our Capability Score" },
      ],
    },
    zh: {
      statement: "以数据驱动的清晰洞察获取<em>战略优势</em>",
      data: [
        { val: "14", lbl: "追踪竞品数" },
        { val: "47", lbl: "对比功能数" },
        { val: "9.2", lbl: "我们的能力评分" },
      ],
    },
  },
};

// ─── Helpers ────────────────────────────────────────────────────────────────

function renderMark(val: string, lang: "en" | "zh") {
  if (val === "yes") return <span className={styles.checkMark}>{lang === "zh" ? "✓" : "✓"}</span>;
  if (val === "no") return <span className={styles.crossMark}>{lang === "zh" ? "—" : "—"}</span>;
  return <span className={styles.partialMark}>{lang === "zh" ? "部分" : "Partial"}</span>;
}

// ─── Metadata ───────────────────────────────────────────────────────────────

export function getMetadata(lang: "en" | "zh"): StyleMetadata {
  const nameMap = { en: "Benchmark Matrix", zh: "基准矩阵" };
  const themeMap = {
    en: "Analytical Evaluation Matrix — clean comparative evidence with bright neutral ground, positive/negative result marks, and scannable like-against-like comparison. Best for tool comparisons, evaluation criteria, and data-heavy benchmarks.",
    zh: "分析评估矩阵——明亮中性底色、正负结果标记、可扫描的同类对比。最适合工具比较、评估标准和数据密集型基准测试。",
  };
  const densityLabelMap = { en: "Analytical", zh: "分析型" };

  const sceneTitles = {
    en: ["Title", "Market Quadrant", "Comparison Table", "Capability Matrix", "Closing"],
    zh: ["标题", "市场象限", "对比表格", "能力矩阵", "结语"],
  };

  const beatActions = {
    en: {
      1: ["Title and subtitle appear"],
      2: ["Header and title appear", "Quadrants 1-2 populate", "Quadrants 3-4 populate"],
      3: ["Table header appears", "Rows 1-4 populate", "Rows 5-7 populate"],
      4: ["Title appears", "Matrix cells fill in"],
      5: ["Closing statement and data revealed"],
    },
    zh: {
      1: ["标题和副标题呈现"],
      2: ["标题呈现", "第 1-2 象限填充", "第 3-4 象限填充"],
      3: ["表头呈现", "第 1-4 行填充", "第 5-7 行填充"],
      4: ["标题呈现", "矩阵单元格填充"],
      5: ["结语和数据揭示"],
    },
  };

  const BEAT_COUNTS: Record<number, number> = { 1: 1, 2: 3, 3: 3, 4: 2, 5: 1 };

  const scenes = [1, 2, 3, 4, 5].map((id) => {
    const beatCount = BEAT_COUNTS[id];
    const actions = beatActions[lang][id as keyof (typeof beatActions)["en"]];
    const c = SCENES[id as keyof typeof SCENES][lang] as any;

    const beats = Array.from({ length: beatCount }, (_, beatIdx) => {
      let beatTitle = "";
      let beatBody = "";

      if (id === 1) {
        beatTitle = `${c.title} ${c.titleHighlight}`;
        beatBody = c.subtitle;
      } else if (id === 2) {
        beatTitle = c.title;
        const quads = (c.quads as Array<{ name: string }>) || [];
        const visible = Math.min(beatIdx * 2, 4);
        beatBody = quads.slice(0, visible).map((q) => q.name).join(" / ");
      } else if (id === 3) {
        beatTitle = c.title;
        const rows = (c.rows as Array<{ feature: string }>) || [];
        const visible = beatIdx === 0 ? 0 : beatIdx === 1 ? 4 : 7;
        beatBody = rows.slice(0, visible).map((r) => r.feature).join(" / ");
      } else if (id === 4) {
        beatTitle = c.title;
        if (beatIdx >= 1) {
          const features = (c.features as Array<{ name: string }>) || [];
          beatBody = features.map((f) => f.name).join(" / ");
        }
      } else if (id === 5) {
        beatTitle = c.statement.replace(/<[^>]+>/g, "");
        const data = (c.data as Array<{ val: string; lbl: string }>) || [];
        beatBody = data.map((d) => `${d.val} ${d.lbl}`).join(" / ");
      }

      return { id: beatIdx, action: actions[beatIdx], title: beatTitle, body: beatBody };
    });

    return { id, title: sceneTitles[lang][id - 1], beats };
  });

  return {
    id: "10",
    band: "balanced-hybrid",
    name: nameMap[lang],
    theme: themeMap[lang],
    densityLabel: densityLabelMap[lang],
    heroScene: 3,
    colors: { bg: "#fafbfc", ink: "#1a1a2e", panel: "#f0f2f5" },
    typography: { header: "Inter 600", body: "Inter 400" },
    tags: ["benchmark", "matrix", "comparison", "evaluation", "analytical", "scannable", "criteria", "evidence", "structured"],
    fonts: ["Inter"],
    scenes,
  };
}

// ─── Component ──────────────────────────────────────────────────────────────

const BEAT_LAYOUT_MODES = {
  2: "motion",
  3: "motion",
  4: "motion",
} satisfies Record<number, "motion" | "reserved">;

export default function MatrixGrid({
  scene, beat, language, isThumbnail, reducedMotion, onNavigate, }: BespokeStyleProps) {
  useFonts();

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
        <span className={styles.labelTag}>{c.tag}</span>
        <h1 className={styles.title}>
          {c.title}<span className={styles.titleHighlight}>{c.titleHighlight}</span>
        </h1>
        <p className={styles.subtitle}>{c.subtitle}</p>
      </div>
    );
  };

  const renderScene2 = (beatNum: number) => {
    const c = SCENES[2][language as keyof typeof SCENES[2]];
    const quads = c.quads as Array<{ label: string; name: string; desc: string; count: string; highlight?: boolean }>;
    const visibleCount = Math.min(beatNum * 2, 4);
    return (
      <div className={styles.scene2}>
        <span className={styles.secHeader}>{c.header}</span>
        <h2 className={styles.secTitle}>{c.title}</h2>
        <div className={styles.quadrant}>
          {quads.map((q, i) => {
            const visible = i < visibleCount;
            const cls = [
              styles.quadCell,
              visible ? styles.quadCellVisible : "",
              q.highlight ? styles.quadCellHighlight : "",
            ].filter(Boolean).join(" ");
            return (
              <div
                key={i}
                className={cls}
                style={reducedMotion ? { opacity: visible ? 1 : 0, transform: "none" } : { transitionDelay: `${i * 0.1}s` }}
              >
                <span className={styles.quadLabel}>{q.label}</span>
                <span className={styles.quadName}>{q.name}</span>
                <span className={styles.quadDesc}>{q.desc}</span>
                <span className={styles.quadCount}>{q.count}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderScene3 = (beatNum: number) => {
    const c = SCENES[3][language as keyof typeof SCENES[3]];
    const headers = c.headers as string[];
    const rows = c.rows as Array<{ feature: string; vals: string[]; our: boolean }>;
    const visibleCount = beatNum === 0 ? 0 : beatNum === 1 ? 4 : 7;
    return (
      <div className={styles.scene3}>
        <span className={styles.secHeader}>{c.header}</span>
        <h2 className={styles.secTitle}>{c.title}</h2>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                {headers.map((h, i) => (
                  <th key={i} className={i === 1 ? styles.ourCol : ""} style={i === 0 ? { width: "25%" } : undefined}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => {
                const visible = i < visibleCount;
                const cls = [
                  styles.tableRow,
                  visible ? styles.tableRowVisible : "",
                ].filter(Boolean).join(" ");
                return (
                  <tr
                    key={i}
                    className={cls}
                    style={reducedMotion ? { opacity: visible ? 1 : 0, transform: "none" } : { transitionDelay: `${i * 0.06}s` }}
                  >
                    <td style={{ fontWeight: 500 }}>{row.feature}</td>
                    <td className={styles.ourCell}>{renderMark(row.vals[0], language)}</td>
                    <td>{renderMark(row.vals[1], language)}</td>
                    <td>{renderMark(row.vals[2], language)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderScene4 = (beatNum: number) => {
    const c = SCENES[4][language as keyof typeof SCENES[4]];
    const categories = c.categories as string[];
    const features = c.features as Array<{ name: string; vals: string[] }>;
    return (
      <div className={styles.scene4}>
        <span className={styles.secHeader}>{c.header}</span>
        <h2 className={styles.secTitle}>{c.title}</h2>
        <div className={styles.matrixGrid}>
          {/* Header row */}
          <div className={[styles.matrixCell, styles.matrixCellVisible].join(" ")} style={{ opacity: 1, transform: "none" }}>
            <span className={[styles.matrixCellHeader, styles.matrixCellHeader].join(" ")}>&nbsp;</span>
            <span className={styles.matrixFeature}>&nbsp;</span>
          </div>
          {categories.map((cat, ci) => {
            const visible = beatNum >= 1;
            const cls = [
              styles.matrixCell,
              visible ? styles.matrixCellVisible : "",
            ].filter(Boolean).join(" ");
            return (
              <div
                key={`cat-${ci}`}
                className={cls}
                style={reducedMotion ? { opacity: visible ? 1 : 0, transform: "none" } : { transitionDelay: `${ci * 0.08}s` }}
              >
                <span className={[styles.matrixCellHeader, ci === 0 ? styles.matrixCellHeader + " " + styles.highlight : ""].join(" ")}>{cat}</span>
                <span className={styles.matrixFeature}>&nbsp;</span>
              </div>
            );
          })}
          {/* Feature rows */}
          {features.map((feat, fi) => (
            <React.Fragment key={`feat-${fi}`}>
              <div
                className={[styles.matrixCell, styles.matrixCellVisible].join(" ")}
                style={{ opacity: beatNum >= 1 ? 1 : 0, transition: reducedMotion ? "none" : `opacity 0.4s ease ${fi * 0.1}s` }}
              >
                <span className={styles.matrixFeature} style={{ fontWeight: 600, textAlign: "left", width: "100%" }}>{feat.name}</span>
              </div>
              {feat.vals.map((val, vi) => {
                const numVal = parseFloat(val);
                const valCls = numVal >= 9 ? styles.good : numVal >= 7.5 ? styles.mid : styles.bad;
                const visible = beatNum >= 1;
                return (
                  <div
                    key={`val-${fi}-${vi}`}
                    className={[styles.matrixCell, visible ? styles.matrixCellVisible : ""].filter(Boolean).join(" ")}
                    style={reducedMotion ? { opacity: visible ? 1 : 0, transform: "none" } : { transitionDelay: `${(fi * 4 + vi) * 0.04 + 0.2}s` }}
                  >
                    <span className={[styles.matrixVal, valCls].join(" ")}>{val}</span>
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  };

  const renderScene5 = () => {
    const c = SCENES[5][language as keyof typeof SCENES[5]];
    const data = c.data as Array<{ val: string; lbl: string }>;
    return (
      <div className={styles.scene5}>
        <h2 className={styles.closingStatement} dangerouslySetInnerHTML={{ __html: c.statement }} />
        <div className={styles.closingData}>
          {data.map((d, i) => (
            <div key={i} className={styles.closingDataItem}>
              <span className={styles.closingDataVal}>{d.val}</span>
              <span className={styles.closingDataLbl}>{d.lbl}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderSceneFor = (sceneNum: number, beatNum: number) => {
    switch (sceneNum) {
      case 1: return renderScene1();
      case 2: return renderScene2(beatNum);
      case 3: return renderScene3(beatNum);
      case 4: return renderScene4(beatNum);
      case 5: return renderScene5();
      default: return null;
    }
  };

  const renderNav = () => {
    if (isThumbnail) return null;
    return (
      <nav className={styles.navGrid} aria-label="Scene navigation">
        {[1, 2, 3, 4, 5].map((s) => {
          const isActive = s === scene;
          return (
            <button
              key={s}
              type="button"
              className={[styles.navGridCell, isActive ? styles.navGridCellActive : ""].filter(Boolean).join(" ")}
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
        renderScene={(sceneId, sceneBeat) => (
          <div className={styles.sceneLayer}>
            <div className={styles.track}>
              {renderSceneFor(sceneId, sceneBeat)}
            </div>
          </div>
        )}
      />

      {renderNav()}
    </div>
  );
}

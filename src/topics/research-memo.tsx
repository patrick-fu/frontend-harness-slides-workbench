import React, { useLayoutEffect, useEffect, useState, useCallback } from "react";
import {
  defineTopic,
  type TopicMetadata,
  type TopicStageProps,
  type TopicTransitionScore,
} from "../domain/topic";
import SpatialSceneTrack from "../components/stage/SpatialSceneTrack";
import styles from "./research-memo.module.css";
import { useFLIP } from "../hooks/useFLIP";

// ─── Content ────────────────────────────────────────────────────────────────

interface SceneContent {
  en: Record<string, any>;
  zh: Record<string, any>;
}

const SCENES: Record<number, SceneContent> = {
  1: {
    en: {
      companyName: "Cognitive Systems Lab",
      reportYear: "Research Memo — RM-2026-014",
      tagline: "Evidence-first findings for decision support",
      fiscalNote: "Distributed: July 6, 2026",
      established: "Principal Investigator: Dr. Sarah Chen",
      employees: "12 researchers · 3 institutions",
    },
    zh: {
      companyName: "认知系统实验室",
      reportYear: "研究备忘录 — RM-2026-014",
      tagline: "以证据为先的决策支持研究成果",
      fiscalNote: "分发日期：2026 年 7 月 6 日",
      established: "首席研究员：陈莎拉博士",
      employees: "12 名研究员 · 3 所机构",
    },
  },
  2: {
    en: {
      title: "Executive Summary",
      salutation: "Key Takeaways",
      paragraphs: [
        "This memo presents evidence from a six-month controlled study on model performance degradation under distribution shift. Our primary finding: fine-tuned models exhibit 38% greater robustness to out-of-distribution inputs compared to zero-shot baselines, with statistical significance at p < 0.01 across all three evaluation domains.",
        "Calibration error analysis reveals that temperature scaling alone is insufficient for maintaining reliable uncertainty estimates in production. We recommend combining temperature scaling with Monte Carlo dropout to achieve expected calibration error below 2% across the full operating range.",
        "Data quality proved to be the dominant factor in downstream performance. Models trained on de-duplicated, quality-filtered corpora consistently outperformed those trained on raw web-scale data by 11-17% on held-out evaluation suites, even at equivalent parameter counts.",
        "Based on these findings, we recommend immediate adoption of the proposed quality-filtering pipeline for all production deployments, with phased rollout of Monte Carlo dropout calibration over the next quarter.",
      ],
      signatureName: "Dr. Sarah Chen",
      signatureTitle: "Lead Researcher",
    },
    zh: {
      title: "执行摘要",
      salutation: "核心结论",
      paragraphs: [
        "本备忘录呈现了一项为期六个月的关于分布偏移下模型性能退化的对照研究证据。我们的主要发现：与零样本基线相比，微调模型对分布外输入表现出 38% 更强的鲁棒性，在所有三个评估领域均达到 p < 0.01 的统计显著性。",
        "校准误差分析表明，仅靠温度缩放不足以在生产环境中维持可靠的不确定性估计。我们建议将温度缩放与蒙特卡洛 dropout 结合使用，以在整个运行范围内实现低于 2% 的预期校准误差。",
        "数据质量被证明是下游性能的主导因素。在去重、质量过滤的语料库上训练的模型，在留出评估套件上始终优于在原始网络规模数据上训练的模型 11-17%，即使在相同参数数量下也是如此。",
        "基于这些发现，我们建议立即在所有生产部署中采用所提议的质量过滤管道，并在下一季度分阶段推出蒙特卡洛 dropout 校准。",
      ],
      signatureName: "陈莎拉博士",
      signatureTitle: "首席研究员",
    },
  },
  3: {
    en: {
      title: "Key Findings",
      subtitle: "Quantitative Results Across Evaluation Domains",
      note: "(Mean scores across 5 runs · 95% confidence intervals)",
      tableHeaders: ["Metric", "Fine-tuned", "Zero-shot", "Delta"],
      tableRows: [
        ["OOD Robustness", "84.2%", "61.0%", "+23.2pp"],
        ["Calibration Error", "1.8%", "5.4%", "-3.6pp"],
        ["F1 (Domain A)", "91.3", "78.6", "+12.7"],
        ["F1 (Domain B)", "87.9", "72.1", "+15.8"],
        ["F1 (Domain C)", "89.5", "75.3", "+14.2"],
        ["Latency p99", "42ms", "38ms", "+4ms"],
        ["Throughput", "2.4k/s", "2.6k/s", "-0.2k/s"],
        ["Training Cost", "$18.4k", "$0", "—"],
      ],
      footnote:
        "Note: OOD = Out-of-Distribution. Fine-tuned models evaluated at checkpoint step 42,000. Zero-shot baselines use the base 70B model with task-specific prompting.",
    },
    zh: {
      title: "核心研究成果",
      subtitle: "各评估领域的量化结果",
      note: "（5 次运行均值 · 95% 置信区间）",
      tableHeaders: ["指标", "微调模型", "零样本", "差值"],
      tableRows: [
        ["分布外鲁棒性", "84.2%", "61.0%", "+23.2pp"],
        ["校准误差", "1.8%", "5.4%", "-3.6pp"],
        ["F1（领域 A）", "91.3", "78.6", "+12.7"],
        ["F1（领域 B）", "87.9", "72.1", "+15.8"],
        ["F1（领域 C）", "89.5", "75.3", "+14.2"],
        ["延迟 p99", "42ms", "38ms", "+4ms"],
        ["吞吐量", "2.4k/s", "2.6k/s", "-0.2k/s"],
        ["训练成本", "$18.4k", "$0", "—"],
      ],
      footnote:
        "注：OOD = 分布外。微调模型在检查点步骤 42,000 处评估。零样本基线使用基础 70B 模型配合任务特定提示。",
    },
  },
  4: {
    en: {
      title: "Methodology",
      intro:
        "Three complementary evaluation approaches were employed to triangulate findings, each designed to isolate a specific dimension of model behavior under distributional stress.",
      segments: [
        {
          name: "Controlled Benchmark Suite",
          revenue: "n=2,400",
          pct: 40,
          growth: "3 domains",
          detail:
            "Standardized evaluation across three domains with controlled distribution shift intensity. Each domain contains 800 test examples stratified by shift magnitude.",
        },
        {
          name: "Production Shadow Traffic",
          revenue: "n=18.2k",
          pct: 30,
          growth: "14 days",
          detail:
            "Real-world evaluation via shadow deployment alongside production system. Collected 18,247 labeled queries over a 14-day window with ground truth from human review.",
        },
        {
          name: "Calibration Analysis",
          revenue: "ECE 1.8%",
          pct: 20,
          growth: "p < 0.01",
          detail:
            "Expected Calibration Error measured across confidence deciles. Statistical significance verified via paired bootstrap resampling (10,000 iterations).",
        },
        {
          name: "Ablation Studies",
          revenue: "7 variants",
          pct: 10,
          growth: "controlled",
          detail:
            "Systematic ablation of data quality filters, calibration methods, and fine-tuning hyperparameters to isolate individual contribution factors.",
        },
      ],
    },
    zh: {
      title: "研究方法",
      intro:
        "采用三种互补的评估方法对研究结果进行三角验证，每种方法旨在隔离分布压力下模型行为的特定维度。",
      segments: [
        {
          name: "受控基准测试套件",
          revenue: "n=2,400",
          pct: 40,
          growth: "3 个领域",
          detail:
            "跨三个领域的标准化评估，含受控分布偏移强度。每个领域包含 800 个测试样本，按偏移幅度分层。",
        },
        {
          name: "生产影子流量",
          revenue: "n=18.2k",
          pct: 30,
          growth: "14 天",
          detail:
            "通过与生产系统并行的影子部署进行真实评估。在 14 天窗口内收集了 18,247 条带人工审核真值的标注查询。",
        },
        {
          name: "校准分析",
          revenue: "ECE 1.8%",
          pct: 20,
          growth: "p < 0.01",
          detail:
            "跨置信度十分位测量预期校准误差。通过配对自助重采样（10,000 次迭代）验证统计显著性。",
        },
        {
          name: "消融研究",
          revenue: "7 种变体",
          pct: 10,
          growth: "受控",
          detail:
            "系统性消融数据质量过滤器、校准方法和微调超参数，以隔离各贡献因素。",
        },
      ],
    },
  },
  5: {
    en: {
      title: "Conclusions & Recommendations",
      toTheBoard: "Summary for Stakeholders",
      body: "The evidence strongly supports adoption of fine-tuned models with quality-filtered training data for production deployment. The robustness gains (38% improvement in OOD performance) and calibration improvements (ECE reduced from 5.4% to 1.8%) represent material enhancements in both reliability and trustworthiness.",
      opinion:
        "Recommendation 1: Deploy fine-tuned model variant to all production traffic within 30 days. Recommendation 2: Implement Monte Carlo dropout calibration pipeline as a post-processing step. Recommendation 3: Establish ongoing model monitoring with weekly OOD drift detection. All three recommendations are supported by statistically significant evidence with clear cost-benefit justification.",
      emphasis:
        "Caveat: Fine-tuning adds approximately $18.4k in training cost per iteration and 4ms to p99 latency. These trade-offs were deemed acceptable given the 23 percentage-point improvement in OOD robustness and the reduction in calibration-related error incidents.",
      firm: "Reviewed by: Dr. Marcus Webb",
      location: "Independent Statistical Reviewer",
      date: "Approved: July 6, 2026",
      partner: "Distribution: Engineering Leadership, Product, ML Platform",
    },
    zh: {
      title: "结论与建议",
      toTheBoard: "致相关方摘要",
      body: "证据强有力地支持在生产部署中采用经过质量过滤数据训练的微调模型。鲁棒性提升（分布外性能改善 38%）和校准改进（ECE 从 5.4% 降至 1.8%）代表了可靠性和可信度的实质性增强。",
      opinion:
        "建议一：在 30 天内将微调模型变体部署到所有生产流量。建议二：实施蒙特卡洛 dropout 校准管道作为后处理步骤。建议三：建立持续模型监控机制，每周进行分布外漂移检测。三项建议均有统计显著证据支持，且成本效益论证清晰。",
      emphasis:
        "注意事项：微调每次迭代增加约 18.4k 美元训练成本和 4ms p99 延迟。鉴于分布外鲁棒性提升 23 个百分点以及校准相关错误事件的减少，这些权衡被认为是可接受的。",
      firm: "审阅人：马库斯·韦伯博士",
      location: "独立统计审阅人",
      date: "批准日期：2026 年 7 月 6 日",
      partner: "分发范围：工程领导层、产品部、ML 平台团队",
    },
  },
};

// ─── Metadata ───────────────────────────────────────────────────────────────

function buildMetadata(lang: "en" | "zh"): TopicMetadata {
  const themeMap = {
    en: "Research findings, executive summaries, evidence-led readouts — calm authoritative evidence-first",
    zh: "研究成果、执行摘要、证据导向的汇报——冷静权威、证据为先",
  };
  const densityLabelMap = { en: "Document-Dense", zh: "文档密集" };

  const sceneTitles = {
    en: ["Cover", "Executive Summary", "Findings", "Methodology", "Conclusions"],
    zh: ["封面", "执行摘要", "研究成果", "研究方法", "结论建议"],
  };

  const beatActions = {
    en: {
      1: ["Cover page revealed"],
      2: ["Summary header", "Key findings appear"],
      3: ["Table header and first 4 rows", "Rows 5-8 appear", "Footnote revealed"],
      4: ["Methodology bars animate in", "Detail text appears"],
      5: ["Conclusions and recommendations"],
    },
    zh: {
      1: ["封面呈现"],
      2: ["摘要标题", "核心结论出现"],
      3: ["表头和前 4 行", "第 5-8 行出现", "脚注揭示"],
      4: ["方法条形图动画", "详情文字出现"],
      5: ["结论与建议"],
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
        const visible = rows.slice(0, (beatIdx + 1) * 4);
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
    theme: themeMap[lang],
    densityLabel: densityLabelMap[lang],
    heroScene: 3,
    colors: { bg: "#fafaf7", ink: "#1a1a1a", panel: "#f0ede8" },
    typography: { header: "Georgia 700", body: "Source Serif Pro 400" },
    tags: ["research", "memo", "evidence", "editorial", "authoritative", "clean", "serif", "findings"],
    fonts: ["Georgia", "Source Serif Pro"],
    scenes,
  };
}

// ─── Transition constants ─────────────────────────────────────────────────

const TRANSITION_SCORE = {
  "1->2": "hard-cut",
  "2->3": "hard-cut",
  "3->4": "hard-cut",
  "4->5": "hard-cut",
} as const satisfies TopicTransitionScore;

const METADATA = {
  en: buildMetadata("en"),
  zh: buildMetadata("zh"),
} satisfies { en: TopicMetadata; zh: TopicMetadata };

// ─── Component ──────────────────────────────────────────────────────────────

const BEAT_LAYOUT_MODES = {
  2: "motion",
  3: "motion",
  4: "motion",
} satisfies Record<number, "motion" | "reserved">;

function TopicStage({
  scene,
  beat,
  language,
  isThumbnail,
  reducedMotion,
  onNavigate,
}: TopicStageProps) {
  const [entered, setEntered] = useState(false);

  useLayoutEffect(() => {
    const inject = (id: string, href: string) => {
      if (document.getElementById(id)) return;
      const link = document.createElement("link");
      link.id = id;
      link.rel = "stylesheet";
      link.href = href;
      document.head.appendChild(link);
    };
    inject(
      "research-memo-fonts-source-serif",
      "https://fonts.googleapis.com/css2?family=Source+Serif+Pro:wght@400;600;700&display=swap",
    );
    inject(
      "research-memo-fonts-noto-serif-sc",
      "https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;600;700&display=swap",
    );
  }, []);

  // Beat-level entered animation (for incoming scene reveals)
  useEffect(() => {
    setEntered(false);
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => setEntered(true));
    });
    return () => cancelAnimationFrame(id);
  }, [scene]);

  // FLIP for scene 3 financial table
  const { ref: finTableRef } = useFLIP<HTMLTableElement>({
    watch: [beat],
    duration: 350,
    easing: "cubic-bezier(0.16, 1, 0.3, 1)",
  });

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

  const renderScene1 = (isEntered: boolean) => {
    const c = SCENES[1][language];
    return (
      <div className={styles.cover}>
        <div className={styles.coverTopRule} />
        <div className={styles.coverInner}>
          <div
            className={styles.coverMeta}
            style={{
              opacity: isEntered ? 1 : 0,
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
              opacity: isEntered ? 1 : 0,
              transform: isEntered ? "none" : "translateY(1cqh)",
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
              opacity: isEntered ? 1 : 0,
              transition: reducedMotion ? "none" : "opacity 0.8s ease 0.7s",
            }}
          >
            {c.reportYear}
          </h2>
          <p
            className={styles.coverTagline}
            style={{
              opacity: isEntered ? 1 : 0,
              transition: reducedMotion ? "none" : "opacity 0.8s ease 1s",
            }}
          >
            {c.tagline}
          </p>
          <div className={styles.coverSpacer} />
          <p
            className={styles.coverFiscal}
            style={{
              opacity: isEntered ? 0.6 : 0,
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

  const renderScene2 = (beatNum: number, isEntered: boolean) => {
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
            opacity: isEntered ? 1 : 0,
            transition: reducedMotion ? "none" : "opacity 0.5s ease 0.2s",
          }}
        >
          {c.salutation}
        </p>
        {beatNum >= 1 && (
          <div className={styles.letterBody}>
            {paragraphs.map((para, i) => (
              <p
                key={i}
                className={i === 0 ? styles.letterDropCap : ""}
                style={{
                  opacity: isEntered ? 1 : 0,
                  transform: isEntered ? "none" : "translateY(0.8cqh)",
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
        {beatNum >= 1 && (
          <div
            className={styles.letterSignature}
            style={{
              opacity: isEntered ? 1 : 0,
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

  const renderScene3 = (beatNum: number, isEntered: boolean, isCurrent: boolean) => {
    const c = SCENES[3][language];
    const headers = c.tableHeaders as string[];
    const rows = c.tableRows as string[][];
    const visibleRows = rows.slice(0, Math.min(rows.length, (beatNum + 1) * 4));

    return (
      <div className={styles.financials}>
        <div className={styles.finHeader}>
          <h2 className={styles.finTitle}>{c.title}</h2>
          <p className={styles.finSubtitle}>{c.subtitle}</p>
          <p className={styles.finNote}>{c.note}</p>
        </div>
        <div className={styles.finTableWrap}>
          <table
            ref={isCurrent ? finTableRef : undefined}
            className={styles.finTable}
          >
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
                    opacity: isEntered ? 1 : 0,
                    transition: reducedMotion
                      ? "none"
                      : `opacity 0.15s ease ${i * 0.03}s`,
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
        {beatNum >= 2 && (
          <p
            className={styles.finFootnote}
            style={{
              opacity: isEntered ? 1 : 0,
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

  const renderScene4 = (beatNum: number, isEntered: boolean) => {
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
                opacity: isEntered ? 1 : 0,
                transform: isEntered ? "none" : "translateX(-2cqw)",
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
                    width: isEntered ? `${seg.pct}%` : "0%",
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
        {beatNum >= 1 && (
          <div className={styles.segDetails}>
            {segments.slice(0, 2).map((seg, i) => (
              <p
                key={i}
                className={styles.segDetail}
                style={{
                  opacity: isEntered ? 1 : 0,
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

  const renderScene5 = (isEntered: boolean) => {
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
              opacity: isEntered ? 1 : 0,
              transition: reducedMotion ? "none" : "opacity 0.6s ease 0.2s",
            }}
          >
            {c.body}
          </p>
          <p
            style={{
              opacity: isEntered ? 1 : 0,
              transition: reducedMotion ? "none" : "opacity 0.6s ease 0.5s",
            }}
          >
            {c.opinion}
          </p>
          <p
            className={styles.auditorEmphasis}
            style={{
              opacity: isEntered ? 1 : 0,
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

  // ── Render scene content for a given scene number ────────────────────────

  const renderSceneFor = (
    sceneNum: number,
    beatNum: number,
    isEntered: boolean,
    isCurrent: boolean = false,
  ) => {
    switch (sceneNum) {
      case 1:
        return renderScene1(isEntered);
      case 2:
        return renderScene2(beatNum, isEntered);
      case 3:
        return renderScene3(beatNum, isEntered, isCurrent);
      case 4:
        return renderScene4(beatNum, isEntered);
      case 5:
        return renderScene5(isEntered);
      default:
        return null;
    }
  };

  // ── Navigation (Page Numbers) ──────────────────────────────────────────

  const renderNav = () => {
    if (isThumbnail) return null;
    const pageLabels = {
      en: ["Cover", "Summary", "Findings", "Methodology", "Conclusions"],
      zh: ["封面", "摘要", "成果", "方法", "结论"],
    };
    return (
      <nav
        className={styles.nav}
        aria-label="Page navigation"
        data-topic-navigation="true"
        data-navigation-geometry="typographic-index"
        data-navigation-carrier="research-memo-page-index"
        data-navigation-invocation="persistent"
        data-navigation-feedback="typographic-emphasis"
      >
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

  // ── Build layer classes ─────────────────────────────────────────────────

  return (
    <div
      data-testid="research-memo-root"
      data-topic-id="research-memo"
      className={rootClasses}
    >
            <SpatialSceneTrack
        scene={scene}
        beat={beat}
        transitionKind="hard-cut"
        reducedMotion={reducedMotion || isThumbnail}
        beatLayoutModes={BEAT_LAYOUT_MODES}
        renderScene={(sceneId, sceneBeat, isActive) => (
          <div className={styles.sceneLayer}>
            {renderSceneFor(sceneId, sceneBeat, isActive ? entered : true, isActive)}
          </div>
        )}
      />

      {/* Page number flash overlay */}

      {renderNav()}
    </div>
  );
}

export default defineTopic({
  id: "research-memo",
  styleId: "research-memo",
  title: { en: "Research Memo", zh: "研究备忘" },
  modelId: "Doubao-Seed-Evolving",
  Stage: TopicStage,
  metadata: METADATA,
  navigation: {
    geometry: "typographic-index",
    carrier: "research-memo-page-index",
    invocation: "persistent",
    feedback: "typographic-emphasis",
  },
  transitionScore: TRANSITION_SCORE,
  evidence: {
    kind: "illustrative",
    boundary: {
      en: "Illustrative research memo: the lab, study design, findings, metrics, costs, and recommendations are presentation examples, not externally verified research results.",
      zh: "示例研究备忘录：实验室、研究设计、结论、指标、成本和建议均为演示内容，并非经外部核验的研究结果。",
    },
    display: "envelope",
  },
});

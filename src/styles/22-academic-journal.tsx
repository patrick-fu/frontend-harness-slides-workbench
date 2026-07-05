import React, { useEffect, useCallback } from "react";
import type { BespokeStyleProps, StyleMetadata } from "../types";
import styles from "./22-academic-journal.module.css";

// ─── Content ────────────────────────────────────────────────────────────────

interface TableRow {
  model: string;
  acc: string;
  f1: string;
  params: string;
  highlight?: boolean;
}

interface SceneContent {
  en: {
    journal?: string;
    title?: string;
    authors?: string;
    affiliation?: string;
    date?: string;
    abstract?: string;
    keywords?: string[];
    methodTitle?: string;
    methodParas?: string[];
    resultsTitle?: string;
    tableRows?: TableRow[];
    tableNote?: string;
    conclusionLabel?: string;
    conclusionTitle?: string;
    conclusionBody?: string;
    references?: string[];
  };
  zh: {
    journal?: string;
    title?: string;
    authors?: string;
    affiliation?: string;
    date?: string;
    abstract?: string;
    keywords?: string[];
    methodTitle?: string;
    methodParas?: string[];
    resultsTitle?: string;
    tableRows?: TableRow[];
    tableNote?: string;
    conclusionLabel?: string;
    conclusionTitle?: string;
    conclusionBody?: string;
    references?: string[];
  };
}

const SCENES: Record<number, SceneContent> = {
  1: {
    en: {
      journal: "Journal of Machine Learning Research",
      title: "Efficient Transformer Architectures\nfor Low-Resource Domains",
      authors: "Wei Chen, Yuki Tanaka, Marcus Rivera",
      affiliation: "Department of Computer Science, Stanford University",
      date: "July 2026 — Vol. 27, Issue 3",
    },
    zh: {
      journal: "机器学习研究期刊",
      title: "低资源领域的高效Transformer架构",
      authors: "陈伟、田中优希、马库斯·里维拉",
      affiliation: "斯坦福大学计算机科学系",
      date: "2026年7月 — 第27卷 第3期",
    },
  },
  2: {
    en: {
      abstract:
        "We present a novel approach to transformer architecture design that achieves competitive performance on low-resource NLP tasks while reducing computational requirements by 62%. Our method, termed Sparse Attention Routing (SAR), introduces dynamic attention head selection that adapts to input complexity, demonstrating significant improvements on cross-lingual transfer benchmarks [1][2]. We further show that SAR combined with parameter-efficient fine-tuning yields state-of-the-art results on five out of seven evaluation datasets.",
      keywords: [
        "Transformers",
        "Low-Resource NLP",
        "Efficient Inference",
        "Sparse Attention",
        "Cross-lingual Transfer",
      ],
    },
    zh: {
      abstract:
        "我们提出了一种新颖的Transformer架构设计方法，在低资源NLP任务上实现了有竞争力的性能，同时将计算需求降低了62%。我们的方法称为稀疏注意力路由（SAR），引入了适应输入复杂度的动态注意力头选择，在跨语言迁移基准测试中展现了显著改进[1][2]。我们进一步表明，SAR与参数高效微调相结合，在七个评估数据集中的五个上取得了最优结果。",
      keywords: [
        "Transformer",
        "低资源NLP",
        "高效推理",
        "稀疏注意力",
        "跨语言迁移",
      ],
    },
  },
  3: {
    en: {
      methodTitle: "Methodology",
      methodParas: [
        "Our experimental framework follows a three-stage pipeline: (1) architectural modification via sparse attention routing [3], (2) progressive layer freezing during intermediate pre-training, and (3) parameter-efficient fine-tuning using LoRA adapters with rank r = 8. We evaluate on a diverse suite of seven benchmarks spanning four language families.",
        "Training was conducted on 8x A100 GPUs with a total batch size of 512. Learning rate followed a cosine schedule with peak 2e-4 and 1000 warmup steps. All models were trained for 50K steps with gradient clipping at 1.0. We report mean and standard deviation across three independent runs [4].",
      ],
    },
    zh: {
      methodTitle: "方法论",
      methodParas: [
        "我们的实验框架遵循三阶段流程：（1）通过稀疏注意力路由进行架构修改[3]，（2）在中间预训练期间渐进式层冻结，以及（3）使用秩r=8的LoRA适配器进行参数高效微调。我们在跨越四个语系的七个多样化基准测试上进行了评估。",
        "训练在8块A100 GPU上进行，总批量大小为512。学习率采用余弦调度，峰值为2e-4，预热步数为1000步。所有模型训练了50K步，梯度裁剪为1.0。我们报告了三次独立运行的均值和标准差[4]。",
      ],
    },
  },
  4: {
    en: {
      resultsTitle: "Results",
      tableRows: [
        { model: "Baseline Transformer", acc: "71.3%", f1: "68.9%", params: "110M" },
        { model: "DistilBERT", acc: "74.1%", f1: "71.8%", params: "66M" },
        { model: "SAR (Ours)", acc: "78.4%", f1: "76.2%", params: "42M", highlight: true },
        { model: "SAR + LoRA", acc: "80.1%", f1: "78.5%", params: "42M*", highlight: true },
      ],
      tableNote: "* LoRA adds ~2M trainable parameters. Bold indicates best performance.",
    },
    zh: {
      resultsTitle: "实验结果",
      tableRows: [
        { model: "基线Transformer", acc: "71.3%", f1: "68.9%", params: "1.1亿" },
        { model: "DistilBERT", acc: "74.1%", f1: "71.8%", params: "6600万" },
        { model: "SAR（本文）", acc: "78.4%", f1: "76.2%", params: "4200万", highlight: true },
        { model: "SAR + LoRA", acc: "80.1%", f1: "78.5%", params: "4200万*", highlight: true },
      ],
      tableNote: "* LoRA增加约200万可训练参数。粗体表示最佳性能。",
    },
  },
  5: {
    en: {
      conclusionLabel: "5. Conclusion",
      conclusionTitle: "Toward Efficient Intelligence",
      conclusionBody:
        "Our findings demonstrate that architectural sparsity, when combined with targeted fine-tuning strategies, can bridge the performance gap between large and small models in low-resource settings. These results suggest a promising direction for democratizing advanced NLP capabilities.",
      references: [
        "[1] Chen et al. (2025). Sparse Attention Mechanisms. NeurIPS.",
        "[2] Tanaka et al. (2025). Cross-lingual Transfer Survey. ACL.",
        "[3] Rivera & Chen (2024). Dynamic Head Selection. ICML.",
        "[4] Devlin et al. (2023). Reproducibility in NLP. TACL.",
      ],
    },
    zh: {
      conclusionLabel: "5. 结论",
      conclusionTitle: "迈向高效智能",
      conclusionBody:
        "我们的研究结果表明，架构稀疏性与针对性微调策略相结合时，可以在低资源环境中缩小大模型与小模型之间的性能差距。这些结果为普及高级NLP能力指明了一个有前景的方向。",
      references: [
        "[1] 陈等人（2025）。稀疏注意力机制。NeurIPS。",
        "[2] 田中等人（2025）。跨语言迁移综述。ACL。",
        "[3] 里维拉与陈（2024）。动态头选择。ICML。",
        "[4] 德夫林等人（2023）。NLP中的可复现性。TACL。",
      ],
    },
  },
};

// ─── Metadata ───────────────────────────────────────────────────────────────

export function getMetadata(lang: "en" | "zh"): StyleMetadata {
  const nameMap = { en: "Academic Journal", zh: "学术期刊" };
  const themeMap = {
    en: "Machine learning research findings — two-column academic format with abstract, methodology, and data tables",
    zh: "机器学习研究成果——双栏学术格式，含摘要、方法论与数据表",
  };
  const densityLabelMap = { en: "Dense", zh: "密集" };

  const sceneTitles = {
    en: ["Title Page", "Abstract", "Methodology", "Results", "Conclusion"],
    zh: ["标题页", "摘要", "方法论", "结果", "结论"],
  };

  const beatActions = {
    en: {
      1: ["Paper title and authors appear"],
      2: ["Abstract box reveals", "Keywords appear"],
      3: ["Methodology heading", "Two-column body text"],
      4: ["Results table header", "Data rows populate"],
      5: ["Conclusion statement", "References appear"],
    },
    zh: {
      1: ["论文标题与作者呈现"],
      2: ["摘要框呈现", "关键词出现"],
      3: ["方法论标题", "双栏正文"],
      4: ["结果表头", "数据行填充"],
      5: ["结论陈述", "参考文献出现"],
    },
  };

  const BEAT_COUNTS: Record<number, number> = {
    1: 1,
    2: 2,
    3: 2,
    4: 2,
    5: 2,
  };

  const scenes = [1, 2, 3, 4, 5].map((id) => {
    const content = SCENES[id][lang];
    const beatCount = BEAT_COUNTS[id];
    const actions = beatActions[lang][id as keyof (typeof beatActions)["en"]];

    const beats = Array.from({ length: beatCount }, (_, beatIdx) => {
      let beatTitle = "";
      let beatBody = "";

      if (id === 1) {
        beatTitle = content.title || "";
        beatBody = content.authors || "";
      } else if (id === 2) {
        beatTitle = "Abstract";
        beatBody = beatIdx >= 1 ? (content.keywords || []).join(", ") : content.abstract || "";
      } else if (id === 3) {
        beatTitle = content.methodTitle || "";
        beatBody = beatIdx >= 1 ? (content.methodParas?.[0] || "") : "";
      } else if (id === 4) {
        beatTitle = content.resultsTitle || "";
        beatBody = beatIdx >= 1 ? (content.tableRows?.map((r) => `${r.model}: ${r.acc}`).join(" / ") || "") : "";
      } else if (id === 5) {
        beatTitle = content.conclusionTitle || "";
        beatBody = beatIdx >= 1 ? (content.references?.join(" / ") || "") : content.conclusionBody || "";
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
    id: "22",
    band: "editorial-print",
    name: nameMap[lang],
    theme: themeMap[lang],
    densityLabel: densityLabelMap[lang],
    heroScene: 3,
    colors: {
      bg: "#ffffff",
      ink: "#1a1a1a",
      panel: "#f5f5f5",
    },
    typography: {
      header: "Georgia 700",
      body: "Source Serif Pro 400",
    },
    tags: [
      "academic",
      "journal",
      "two-column",
      "serif",
      "research",
      "citations",
      "data-table",
      "formal",
      "dense",
    ],
    fonts: ["Georgia", "Source Serif Pro", "cjk:Noto Serif SC"],
    scenes,
  };
}

// ─── Component ──────────────────────────────────────────────────────────────

export default function AcademicJournal({
  scene,
  beat,
  language,
  isThumbnail,
  reducedMotion,
  onNavigate,
  isTransitionClone,
}: BespokeStyleProps) {
  const content = SCENES[scene]?.[language] || SCENES[1][language];
  void isTransitionClone;

  // Font injection
  useEffect(() => {
    const id = "style-22-fonts";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Source+Serif+Pro:ital,wght@0,400;0,600;0,700;1,400&family=Noto+Serif+SC:wght@400;700&display=swap";
    document.head.appendChild(link);
  }, []);

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
    isThumbnail ? styles.thumbnail : "",
  ]
    .filter(Boolean)
    .join(" ");

  const renderSceneContent = () => {
    if (scene === 1) {
      return (
        <div className={styles.journalTitlePage}>
          <p className={styles.journalHeader}>{content.journal}</p>
          <h1 className={styles.journalPaperTitle}>
            {(content.title || "").split("\n").map((line, i) => (
              <React.Fragment key={i}>
                {line}
                {i < (content.title || "").split("\n").length - 1 && <br />}
              </React.Fragment>
            ))}
          </h1>
          <p className={styles.journalAuthors}>{content.authors}</p>
          <p className={styles.journalAffiliation}>{content.affiliation}</p>
          <p className={styles.journalDateLine}>{content.date}</p>
        </div>
      );
    }

    if (scene === 2) {
      return (
        <div className={styles.abstractScene}>
          <div
            className={styles.abstractBox}
            style={{
              opacity: 1,
              transition: reducedMotion
                ? "none"
                : "opacity 0.5s ease",
            }}
          >
            <p className={styles.abstractLabel}>
              {language === "zh" ? "摘要" : "Abstract"}
            </p>
            <p className={styles.abstractText}>{content.abstract}</p>
          </div>
          {beat >= 1 && (
            <div
              className={styles.keywordsRow}
              style={{
                opacity: 1,
                transition: reducedMotion
                  ? "none"
                  : "opacity 0.5s ease 0.2s",
              }}
            >
              <span className={styles.keywordsLabel}>
                {language === "zh" ? "关键词：" : "Keywords:"}
              </span>
              {(content.keywords || []).map((kw, i) => (
                <span key={i} className={styles.keywordTag}>
                  {kw}
                  {i < (content.keywords || []).length - 1}
                </span>
              ))}
            </div>
          )}
        </div>
      );
    }

    if (scene === 3) {
      return (
        <div className={styles.methodScene}>
          <div className={styles.methodSectionHead}>
            <p className={styles.methodSectionNum}>
              {language === "zh" ? "3." : "3."}{" "}
              {language === "zh" ? "方法论" : "Methodology"}
            </p>
            <h2 className={styles.methodSectionTitle}>
              {content.methodTitle}
            </h2>
          </div>
          {beat >= 1 && (
            <div
              className={styles.methodBody}
              style={{
                opacity: 1,
                transition: reducedMotion
                  ? "none"
                  : "opacity 0.5s ease 0.15s",
              }}
            >
              {(content.methodParas || []).map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          )}
        </div>
      );
    }

    if (scene === 4) {
      const rows = content.tableRows || [];
      return (
        <div className={styles.resultsScene}>
          <div className={styles.resultsHeader}>
            <p className={styles.resultsLabel}>
              {language === "zh" ? "4. 实验结果" : "4. Results"}
            </p>
            <h2 className={styles.resultsTitle}>{content.resultsTitle}</h2>
          </div>
          {beat >= 1 && (
            <div
              style={{
                opacity: 1,
                transition: reducedMotion
                  ? "none"
                  : "opacity 0.5s ease 0.1s",
              }}
            >
              <table className={styles.resultsTable}>
                <thead>
                  <tr>
                    <th>{language === "zh" ? "模型" : "Model"}</th>
                    <th>{language === "zh" ? "准确率" : "Accuracy"}</th>
                    <th>F1</th>
                    <th>{language === "zh" ? "参数量" : "Params"}</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, i) => (
                    <tr key={i}>
                      <td>{row.model}</td>
                      <td
                        className={
                          row.highlight ? styles.tableHighlight : ""
                        }
                      >
                        {row.acc}
                      </td>
                      <td
                        className={
                          row.highlight ? styles.tableHighlight : ""
                        }
                      >
                        {row.f1}
                      </td>
                      <td>{row.params}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className={styles.tableNote}>{content.tableNote}</p>
            </div>
          )}
        </div>
      );
    }

    if (scene === 5) {
      return (
        <div className={styles.conclusionScene}>
          <p className={styles.conclusionHead}>
            {content.conclusionLabel}
          </p>
          <h2 className={styles.conclusionTitle}>
            {content.conclusionTitle}
          </h2>
          <p className={styles.conclusionBody}>{content.conclusionBody}</p>
          {beat >= 1 && (
            <div
              className={styles.referencesBox}
              style={{
                opacity: 1,
                transition: reducedMotion
                  ? "none"
                  : "opacity 0.5s ease 0.2s",
              }}
            >
              <p className={styles.referencesLabel}>
                {language === "zh" ? "参考文献" : "References"}
              </p>
              {(content.references || []).map((ref, i) => (
                <p key={i} className={styles.referenceItem}>
                  {ref}
                </p>
              ))}
            </div>
          )}
        </div>
      );
    }

    return null;
  };

  const renderNavIndicators = () => {
    if (isThumbnail) return null;

    return (
      <div className={styles.navIndicators} aria-label="Scene navigation">
        {[1, 2, 3, 4, 5].map((s) => {
          const isActive = s === scene;
          const classes = [
            styles.navIndicator,
            isActive ? styles.navIndicatorActive : "",
          ]
            .filter(Boolean)
            .join(" ");
          return (
            <button
              key={s}
              type="button"
              className={classes}
              aria-label={`Jump to scene ${s}`}
              onClick={(e) => handleNavClick(e, s)}
            >
              <span className={styles.navIndicatorNum}>{s}</span>
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <div className={rootClasses}>
      <div
        className={styles.transitionTrack}
        style={{
          transform: `translateY(-${(scene - 1) * 20}%)`,
          ...(reducedMotion ? { transitionDuration: "0s" } : {}),
        }}
      >
        {[1, 2, 3, 4, 5].map((s) => (
          <div key={s} className={styles.scene}>
            {s === scene && renderSceneContent()}
          </div>
        ))}
      </div>
      {renderNavIndicators()}
    </div>
  );
}

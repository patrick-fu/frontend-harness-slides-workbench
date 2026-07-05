import React, { useEffect, useState, useCallback } from "react";
import type { BespokeStyleProps, StyleMetadata } from "../types";
import styles from "./42-legal-brief.module.css";

// ─── Content ────────────────────────────────────────────────────────────────

interface SceneContent {
  en: Record<string, any>;
  zh: Record<string, any>;
}

const SCENES: Record<number, SceneContent> = {
  1: {
    en: {
      court: "United States Court of Appeals\nFOR THE FEDERAL CIRCUIT",
      caseName: "ACME TECHNOLOGIES, INC.,\nPlaintiff-Appellant,\n\nv.\n\nGLOBAL DISTRIBUTION CORP.,\nDefendant-Appellee.",
      docket: "No. 2024-1567",
      dateSubmitted: "Submitted: January 15, 2026",
      dateArgued: "Argued: March 8, 2026",
      counselTitle: "Counsel for Appellant:",
      counselName: "Michael Chen, Esq.",
      counselFirm: "Chen & Partners LLP",
      counselAddr: "450 Market Street, Suite 2200\nSan Francisco, CA 94105",
    },
    zh: {
      court: "美国联邦巡回上诉法院",
      caseName: "ACME 科技有限公司\n原告-上诉人\n\n诉\n\n全球分销集团\n被告-被上诉人",
      docket: "案号：2024-1567",
      dateSubmitted: "提交：2026年1月15日",
      dateArgued: "辩论：2026年3月8日",
      counselTitle: "上诉人律师：",
      counselName: "陈迈克 律师",
      counselFirm: "陈氏合伙律师事务所",
      counselAddr: "市场街450号2200室\n旧金山，CA 94105",
    },
  },
  2: {
    en: {
      title: "Statement of Facts",
      paragraphs: [
        {
          num: "1.",
          text: "This action arises from a dispute concerning the alleged infringement of U.S. Patent No. 9,847,231 (the \"'231 Patent\"), entitled \"Adaptive Data Compression System and Method,\" issued to ACME Technologies, Inc. (\"ACME\") on December 19, 2017. The '231 Patent claims 24 methods and 12 system claims directed to lossless compression of structured data streams.",
        },
        {
          num: "2.",
          text: "ACME is a Delaware corporation with its principal place of business in San Jose, California. Founded in 2008, ACME develops and licenses proprietary data compression technologies used in enterprise storage systems and cloud computing infrastructure. ACME holds a portfolio of 47 patents in the field of data encoding and transmission optimization.",
        },
        {
          num: "3.",
          text: "Global Distribution Corp. (\"Global\") is a New York corporation headquartered in New York City. Global operates a large-scale content delivery network that serves approximately 40% of all internet traffic in North America, with 214 edge locations across 38 countries. Global reported $8.7 billion in revenue for fiscal year 2024.",
        },
        {
          num: "4.",
          text: "On or about March 15, 2023, ACME's engineering team, led by Dr. Patricia Reeves, discovered that Global's CDN infrastructure was utilizing a compression algorithm substantially similar to the methods claimed in the '231 Patent. ACME subsequently commissioned an independent technical analysis by Dr. Sarah Williams of MIT, who confirmed the structural and functional similarities in a 47-page report dated May 28, 2023.",
        },
        {
          num: "5.",
          text: "ACME sent a formal cease-and-desist letter to Global on June 1, 2023, followed by a detailed infringement analysis on August 14, 2023. Global responded on September 30, 2023, denying infringement and asserting that the '231 Patent claims were invalid for indefiniteness and obviousness in view of U.S. Patent No. 8,234,102 (the \"'102 Patent\") and the textbook \"Data Compression: The Complete Reference\" (Salomon, 4th ed. 2009).",
        },
      ],
    },
    zh: {
      title: "事实陈述",
      paragraphs: [
        {
          num: "一、",
          text: "本诉讼源于关于美国专利号 9,847,231（以下简称\"'231 专利\"）的侵权争议。该专利题为\"自适应数据压缩系统及方法\"，于 2017 年 12 月 19 日授予 ACME 科技有限公司（以下简称\"ACME\"）。'231 专利包含 24 项方法权利要求和 12 项系统权利要求，涉及结构化数据流的无损压缩。",
        },
        {
          num: "二、",
          text: "ACME 是一家特拉华州公司，主要营业地位于加利福尼亚州圣何塞。ACME 成立于 2008 年，开发并授权专有的数据压缩技术，应用于企业存储系统和云计算基础设施。ACME 在数据编码和传输优化领域拥有 47 项专利组合。",
        },
        {
          num: "三、",
          text: "全球分销集团（以下简称\"全球\"）是一家纽约州公司，总部位于纽约市。全球运营着一个大规模的内容分发网络，服务于北美约 40% 的互联网流量，在 38 个国家设有 214 个边缘节点。全球 2024 财年报告收入为 87 亿美元。",
        },
        {
          num: "四、",
          text: "2023 年 3 月 15 日前后，由 Patricia Reeves 博士领导的 ACME 工程团队发现全球的 CDN 基础设施使用了一种与 '231 专利所主张方法实质相似的压缩算法。ACME 随后委托麻省理工学院 Sarah Williams 博士进行独立技术分析，后者在 2023 年 5 月 28 日的 47 页报告中确认了结构和功能上的相似性。",
        },
        {
          num: "五、",
          text: "ACME 于 2023 年 6 月 1 日向全球发出正式停止侵权函，并于 2023 年 8 月 14 日提供了详细的侵权分析。全球于 2023 年 9 月 30 日回复，否认侵权，并主张 '231 专利权利要求因不确定性以及相对于美国专利号 8,234,102（\"'102 专利\"）和教科书《数据压缩：完整参考》（Salomon，第4版，2009年）的显而易见性而无效。",
        },
      ],
    },
  },
  3: {
    en: {
      title: "Legal Argument",
      sectionHeading: "I.",
      sectionTitle:
        "The District Court Erred in Granting Summary Judgment of Non-Infringement",
      argument:
        "The district court's construction of claim 12 of the '231 Patent was unduly narrow. The court improperly imported limitations from the specification into the claims, contrary to the principles articulated in Phillips v. AWH Corp., 415 F.3d 1303 (Fed. Cir. 2005) (en banc). Specifically, the district court read the requirement that the compression engine operate \"in real-time\" into claim 12, when no such limitation appears in the claim language itself.",
      argument2:
        "Under the proper claim construction — one that gives full effect to the ordinary meaning of claim terms as understood by a person of ordinary skill in the art of data compression — the accused system meets every limitation of claim 12. Global's CDN employs an adaptive dictionary-based compression scheme that dynamically adjusts codeword lengths based on input statistics, precisely as claimed.",
      citations: [
        {
          text: "Phillips v. AWH Corp., 415 F.3d 1303 (Fed. Cir. 2005)",
          relevance: "Claim construction standard — intrinsic evidence priority",
        },
        {
          text: "Markman v. Westview Instruments, 517 U.S. 370 (1996)",
          relevance: "Judicial construction of patent claims",
        },
        {
          text: "Vitronics Corp. v. Conceptronic, 90 F.3d 1576 (Fed. Cir. 1996)",
          relevance: "Proper use of specification in claim construction",
        },
      ],
    },
    zh: {
      title: "法律论证",
      sectionHeading: "一、",
      sectionTitle: "地区法院在授予不侵权的简易判决方面存在错误",
      argument:
        "地区法院对 '231 专利第 12 项权利要求的解释过于狭窄。法院不当地将说明书中的限制条件引入权利要求，这与 Phillips v. AWH Corp., 415 F.3d 1303 (Fed. Cir. 2005)（全院庭审）所阐明的原则相悖。具体而言，地区法院将压缩引擎\"实时\"运行的要求写入第 12 项权利要求，而该权利要求语言本身并无此限制。",
      argument2:
        "根据正确的权利要求解释——即对数据压缩领域普通技术人员所理解的权利要求术语的通常含义给予充分效力——被诉系统满足第 12 项权利要求的每一项限制。全球的 CDN 采用了一种基于自适应字典的压缩方案，该方案根据输入统计动态调整码字长度，与权利要求所主张的完全一致。",
      citations: [
        {
          text: "Phillips v. AWH Corp., 415 F.3d 1303 (Fed. Cir. 2005)",
          relevance: "权利要求解释标准——内在证据优先",
        },
        {
          text: "Markman v. Westview Instruments, 517 U.S. 370 (1996)",
          relevance: "专利权利要求的司法解释",
        },
        {
          text: "Vitronics Corp. v. Conceptronic, 90 F.3d 1576 (Fed. Cir. 1996)",
          relevance: "说明书在权利要求解释中的适当使用",
        },
      ],
    },
  },
  4: {
    en: {
      title: "Prayer for Relief",
      wherefore: "WHEREFORE, Plaintiff-Appellant ACME Technologies, Inc. respectfully requests that this Court:",
      remedies: [
        "Reverse the district court's grant of summary judgment of non-infringement entered on November 15, 2024, in Case No. 23-cv-04172-WHO;",
        "Construe the claims of the '231 Patent in accordance with the principles set forth in Phillips v. AWH Corp. and consistent with the ordinary meaning of claim terms to a person of ordinary skill in the art;",
        "Remand this action to the United States District Court for the Northern District of California for further proceedings consistent with this Court's opinion, including a trial on the merits of ACME's infringement claims;",
        "Award ACME its reasonable attorneys' fees and costs pursuant to 35 U.S.C. § 285, on the grounds that this is an exceptional case given Global's continued willful infringement despite actual knowledge of the '231 Patent;",
        "Grant such other and further relief as the Court deems just and proper in the premises.",
      ],
    },
    zh: {
      title: "救济请求",
      wherefore: "据此，原告-上诉人 ACME 科技有限公司恭请本院：",
      remedies: [
        "撤销地区法院于 2024 年 11 月 15 日在案号 23-cv-04172-WHO 中作出的不侵权简易判决；",
        "按照 Phillips v. AWH Corp. 案所确立的原则，并以本领域普通技术人员对权利要求术语的通常理解为准，解释 '231 专利的权利要求；",
        "将本案发回美国加利福尼亚州北区地区法院，依照本院意见进行进一步程序，包括就 ACME 的侵权主张进行实体审理；",
        "鉴于全球在实际知悉 '231 专利的情况下持续故意侵权，本案属例外案件，依据《美国法典》第35编第285条，判令被告承担 ACME 合理的律师费和诉讼费用；",
        "授予本院认为在本案中公正适当的其他及进一步救济。",
      ],
    },
  },
  5: {
    en: {
      title: "Conclusion",
      closing:
        "For the foregoing reasons, ACME respectfully submits that the judgment of the United States District Court for the Northern District of California should be reversed and the case remanded for trial on the merits. ACME's patent claims are valid, enforceable, and infringed by Global's CDN infrastructure. The record contains substantial evidence of infringement, and the district court's claim construction constituted reversible error.",
      dateLine: "Dated: April 1, 2026",
      respectSubmitted: "Respectfully submitted,",
      sigName: "Michael Chen, Esq.",
      sigBar: "Bar No. 234567",
      sigFirm: "Chen & Partners LLP",
      sigAddr: "450 Market Street, Suite 2200\nSan Francisco, CA 94105",
      sigContact: "Tel: (415) 555-0192\nEmail: m.chen@chenpartners.com",
    },
    zh: {
      title: "结论",
      closing:
        "基于上述理由，ACME 恭请本院撤销美国加利福尼亚州北区地区法院的判决，并将本案发回就实体问题进行审理。ACME 的专利权利要求有效、可执行，且被全球的 CDN 基础设施所侵犯。案卷中包含大量侵权证据，地区法院的权利要求解释构成可撤销的错误。",
      dateLine: "日期：2026年4月1日",
      respectSubmitted: "此致",
      sigName: "陈迈克 律师",
      sigBar: "律师号：234567",
      sigFirm: "陈氏合伙律师事务所",
      sigAddr: "市场街450号2200室\n旧金山，CA 94105",
      sigContact: "电话：(415) 555-0192\n邮箱：m.chen@chenpartners.com",
    },
  },
};

// ─── Metadata ───────────────────────────────────────────────────────────────

export function getMetadata(lang: "en" | "zh"): StyleMetadata {
  const nameMap = { en: "Legal Brief", zh: "法律文书" };
  const themeMap = {
    en: "IP Case — legal brief with numbered paragraphs, citations, and formal court structure",
    zh: "知识产权案件——含编号段落、引用和正式法院结构的法律文书",
  };
  const densityLabelMap = { en: "Document-Dense", zh: "文档密集" };

  const sceneTitles = {
    en: ["Caption", "Facts", "Argument", "Relief", "Conclusion"],
    zh: ["案首", "事实", "论证", "救济", "结论"],
  };

  const beatActions = {
    en: {
      1: ["Caption page revealed"],
      2: ["Paragraphs 1-3 appear", "Paragraphs 4-5 appear"],
      3: ["Argument section I", "Case citations appear", "Full argument text"],
      4: ["Remedies 1-3 listed", "Remedies 4-5 listed"],
      5: ["Conclusion and signature"],
    },
    zh: {
      1: ["案首呈现"],
      2: ["第 1-3 段出现", "第 4-5 段出现"],
      3: ["论证第一节", "案例引用出现", "完整论证文本"],
      4: ["救济 1-3 列出", "救济 4-5 列出"],
      5: ["结论和签名"],
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
        beatTitle = c.caseName ? (c.caseName as string).split("\n")[0] : "";
        beatBody = c.docket as string;
      } else if (id === 2) {
        beatTitle = c.title as string;
        const paras = c.paragraphs as Array<{ num: string; text: string }>;
        const visible = paras.slice(0, (beatIdx + 1) * 3);
        beatBody = visible.map((p) => p.num + p.text.slice(0, 60)).join(" / ");
      } else if (id === 3) {
        beatTitle = (c.sectionTitle as string) || (c.title as string);
        if (beatIdx === 0) beatBody = (c.argument as string).slice(0, 100);
        else if (beatIdx === 1) {
          const cites = c.citations as Array<{ text: string }>;
          beatBody = cites.map((c) => c.text).join(" / ");
        } else beatBody = (c.argument2 as string).slice(0, 100);
      } else if (id === 4) {
        beatTitle = c.title as string;
        const remedies = c.remedies as string[];
        const start = beatIdx * 3;
        beatBody = remedies.slice(start, start + 3).join(" / ");
      } else if (id === 5) {
        beatTitle = c.title as string;
        beatBody = (c.closing as string).slice(0, 120);
      }

      return { id: beatIdx, action: actions[beatIdx], title: beatTitle, body: beatBody };
    });

    return { id, title: sceneTitles[lang][id - 1], beats };
  });

  return {
    id: "42",
    band: "text-report",
    name: nameMap[lang],
    theme: themeMap[lang],
    densityLabel: densityLabelMap[lang],
    heroScene: 3,
    colors: { bg: "#fdfdf8", ink: "#1a1a1a", panel: "#f0ede4" },
    typography: { header: "Georgia 700", body: "Source Serif Pro 400" },
    tags: ["legal", "brief", "formal", "citations", "numbered", "serif", "dense", "court"],
    fonts: ["Georgia", "Source Serif Pro"],
    scenes,
  };
}

// ─── Component ──────────────────────────────────────────────────────────────

export default function LegalBrief({
  scene,
  beat,
  language,
  isThumbnail,
  reducedMotion,
  onNavigate,
  isTransitionClone,
}: BespokeStyleProps) {
  const [entered, setEntered] = useState(false);

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
      "style-42-fonts-source-serif",
      "https://fonts.googleapis.com/css2?family=Source+Serif+Pro:wght@400;600;700&display=swap",
    );
    inject(
      "style-42-fonts-noto-serif-sc",
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

  // ── Scene 1: Caption ───────────────────────────────────────────────────

  const renderScene1 = () => {
    const c = SCENES[1][language];
    return (
      <div className={styles.caption}>
        <div
          className={styles.captionCourt}
          style={{
            opacity: entered ? 1 : 0,
            transition: reducedMotion ? "none" : "opacity 0.6s ease 0.2s",
          }}
        >
          {(c.court as string).split("\n").map((line, i) => (
            <div key={i} className={i === 1 ? styles.captionCourtSub : ""}>
              {line}
            </div>
          ))}
        </div>
        <div className={styles.captionRule} />
        <div
          className={styles.captionCase}
          style={{
            opacity: entered ? 1 : 0,
            transition: reducedMotion ? "none" : "opacity 0.8s ease 0.5s",
          }}
        >
          {(c.caseName as string).split("\n").map((line, i) => (
            <div
              key={i}
              className={[
                line === "v." || line === "诉"
                  ? styles.captionVersus
                  : line.includes("Plaintiff") || line.includes("原告")
                    ? styles.captionParty
                    : line.includes("Defendant") || line.includes("被告")
                      ? styles.captionParty
                      : styles.captionPartyName,
              ].join(" ")}
            >
              {line}
            </div>
          ))}
        </div>
        <div className={styles.captionRule} />
        <div
          className={styles.captionMeta}
          style={{
            opacity: entered ? 1 : 0,
            transition: reducedMotion ? "none" : "opacity 0.6s ease 0.9s",
          }}
        >
          <span className={styles.captionDocket}>{c.docket}</span>
          <div className={styles.captionDates}>
            <span>{c.dateSubmitted}</span>
            <span>{c.dateArgued}</span>
          </div>
        </div>
        <div
          className={styles.captionCounsel}
          style={{
            opacity: entered ? 1 : 0,
            transition: reducedMotion ? "none" : "opacity 0.6s ease 1.2s",
          }}
        >
          <p className={styles.captionCounselTitle}>{c.counselTitle}</p>
          <p className={styles.captionCounselName}>{c.counselName}</p>
          <p className={styles.captionCounselFirm}>{c.counselFirm}</p>
          <p className={styles.captionCounselAddr}>
            {(c.counselAddr as string).split("\n").map((line, i) => (
              <span key={i}>
                {line}
                {i < (c.counselAddr as string).split("\n").length - 1 && <br />}
              </span>
            ))}
          </p>
        </div>
      </div>
    );
  };

  // ── Scene 2: Statement of Facts ───────────────────────────────────────

  const renderScene2 = () => {
    const c = SCENES[2][language];
    const paragraphs = c.paragraphs as Array<{ num: string; text: string }>;
    const visibleCount = beat === 0 ? 3 : 5;
    const visible = paragraphs.slice(0, visibleCount);

    return (
      <div className={styles.facts}>
        <div className={styles.factsHeader}>
          <h2 className={styles.factsTitle}>{c.title}</h2>
          <div className={styles.factsRule} />
        </div>
        <div className={styles.factsBody}>
          {visible.map((para, i) => (
            <div
              key={i}
              className={styles.factPara}
              style={{
                opacity: entered ? 1 : 0,
                transform: entered ? "none" : "translateX(-1cqw)",
                transition: reducedMotion
                  ? "none"
                  : `opacity 0.5s ease ${i * 0.1}s, transform 0.5s ease ${i * 0.1}s`,
              }}
            >
              <span className={styles.factNum}>{para.num}</span>
              <p className={styles.factText}>{para.text}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // ── Scene 3: Legal Argument ───────────────────────────────────────────

  const renderScene3 = () => {
    const c = SCENES[3][language];
    const citations = c.citations as Array<{ text: string; relevance: string }>;
    return (
      <div className={styles.argument}>
        <div className={styles.argHeader}>
          <h2 className={styles.argTitle}>{c.title}</h2>
          <div className={styles.argRule} />
        </div>
        <div className={styles.argSection}>
          <span className={styles.argSectionNum}>{c.sectionHeading}</span>
          <h3 className={styles.argSectionTitle}>{c.sectionTitle}</h3>
        </div>
        {beat >= 0 && (
          <p
            className={styles.argText}
            style={{
              opacity: entered ? 1 : 0,
              transition: reducedMotion ? "none" : "opacity 0.6s ease 0.2s",
            }}
          >
            {c.argument}
          </p>
        )}
        {beat >= 1 && (
          <div className={styles.argCitations}>
            <p className={styles.argCitationsLabel}>
              {language === "zh" ? "引用判例：" : "Authorities Cited:"}
            </p>
            {citations.map((cite, i) => (
              <div
                key={i}
                className={styles.argCite}
                style={{
                  opacity: entered ? 1 : 0,
                  transition: reducedMotion
                    ? "none"
                    : `opacity 0.4s ease ${0.4 + i * 0.12}s`,
                }}
              >
                <span className={styles.argCiteText}>{cite.text}</span>
                <span className={styles.argCiteRel}>— {cite.relevance}</span>
              </div>
            ))}
          </div>
        )}
        {beat >= 2 && (
          <p
            className={styles.argText}
            style={{
              opacity: entered ? 1 : 0,
              transition: reducedMotion ? "none" : "opacity 0.6s ease 0.8s",
            }}
          >
            {c.argument2}
          </p>
        )}
      </div>
    );
  };

  // ── Scene 4: Prayer for Relief ────────────────────────────────────────

  const renderScene4 = () => {
    const c = SCENES[4][language];
    const remedies = c.remedies as string[];
    const visibleCount = beat === 0 ? 3 : 5;
    const visible = remedies.slice(0, visibleCount);

    return (
      <div className={styles.relief}>
        <div className={styles.reliefHeader}>
          <h2 className={styles.reliefTitle}>{c.title}</h2>
          <div className={styles.reliefRule} />
        </div>
        <p
          className={styles.reliefWherefore}
          style={{
            opacity: entered ? 1 : 0,
            transition: reducedMotion ? "none" : "opacity 0.5s ease 0.2s",
          }}
        >
          {c.wherefore}
        </p>
        <ol className={styles.reliefList}>
          {visible.map((remedy, i) => (
            <li
              key={i}
              className={styles.reliefItem}
              style={{
                opacity: entered ? 1 : 0,
                transform: entered ? "none" : "translateX(-1cqw)",
                transition: reducedMotion
                  ? "none"
                  : `opacity 0.5s ease ${0.3 + i * 0.12}s, transform 0.5s ease ${0.3 + i * 0.12}s`,
              }}
            >
              {remedy}
            </li>
          ))}
        </ol>
      </div>
    );
  };

  // ── Scene 5: Conclusion ───────────────────────────────────────────────

  const renderScene5 = () => {
    const c = SCENES[5][language];
    return (
      <div className={styles.conclusion}>
        <div className={styles.concHeader}>
          <h2 className={styles.concTitle}>{c.title}</h2>
          <div className={styles.concRule} />
        </div>
        <p
          className={styles.concText}
          style={{
            opacity: entered ? 1 : 0,
            transition: reducedMotion ? "none" : "opacity 0.6s ease 0.2s",
          }}
        >
          {c.closing}
        </p>
        <p
          className={styles.concDate}
          style={{
            opacity: entered ? 1 : 0,
            transition: reducedMotion ? "none" : "opacity 0.5s ease 0.6s",
          }}
        >
          {c.dateLine}
        </p>
        <div
          className={styles.concSigBlock}
          style={{
            opacity: entered ? 1 : 0,
            transition: reducedMotion ? "none" : "opacity 0.6s ease 0.9s",
          }}
        >
          <p className={styles.concSigRespect}>{c.respectSubmitted}</p>
          <p className={styles.concSigName}>{c.sigName}</p>
          <p className={styles.concSigBar}>{c.sigBar}</p>
          <p className={styles.concSigFirm}>{c.sigFirm}</p>
          <p className={styles.concSigAddr}>
            {(c.sigAddr as string).split("\n").map((line, i) => (
              <span key={i}>
                {line}
                {i < (c.sigAddr as string).split("\n").length - 1 && <br />}
              </span>
            ))}
          </p>
          <p className={styles.concSigContact}>
            {(c.sigContact as string).split("\n").map((line, i) => (
              <span key={i}>
                {line}
                {i < (c.sigContact as string).split("\n").length - 1 && <br />}
              </span>
            ))}
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

  // ── Navigation (Section Numbers) ──────────────────────────────────────

  const renderNav = () => {
    if (isThumbnail) return null;
    const sectionLabels = {
      en: ["Caption", "Facts", "Argument", "Relief", "Conclusion"],
      zh: ["案首", "事实", "论证", "救济", "结论"],
    };
    const romanNumerals = ["I", "II", "III", "IV", "V"];
    return (
      <nav className={styles.nav} aria-label="Section navigation">
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
                <span className={styles.navRoman}>{romanNumerals[s - 1]}</span>
                <span className={styles.navLabel}>
                  {sectionLabels[language][s - 1]}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    );
  };

  return (
    <div data-testid="style-42-root" className={rootClasses}>
      <div
        key={`42-${scene}`}
        className={`${styles.transitionTrack} ${!isTransitionClone ? styles.animateSceneEnter : ""}`}
        style={reducedMotion ? { animationDuration: "0s" } : undefined}
      >
        {renderSceneContent()}
      </div>
      {renderNav()}
    </div>
  );
}

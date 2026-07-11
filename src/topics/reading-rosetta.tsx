import { useCallback, useEffect, useRef, useState } from "react";
import type React from "react";
import type { Source } from "../domain/evidence";
import {
  defineTopic,
  type TopicDefinition,
  type TopicMetadata,
  type TopicStageProps,
  type TopicTransitionScore,
} from "../domain/topic";
import SpatialSceneTrack, {
  type BeatLayoutMode,
  type SceneTransitionKind,
  type SceneTransitionMap,
} from "../styles/SpatialSceneTrack";
import styles from "./reading-rosetta.module.css";

type Language = "en" | "zh";

interface BeatCopy {
  id: number;
  action: string;
  title: string;
  body: string;
}

interface SceneCopy {
  id: number;
  index: string;
  title: string;
  lede: string;
  sourceLine: string;
  sourceIds: string[];
  claimId: string;
  beats: BeatCopy[];
}

interface ClaimBoundary {
  id: string;
  sourceIds: string[];
  boundary: string;
}

const SCENE_IDS = [1, 2, 3, 4, 5] as const;

const SCENES: Record<Language, SceneCopy[]> = {
  en: [
    {
      id: 1,
      index: "01 / SOURCE",
      title: "The stone starts with a correction.",
      lede:
        "One decree is preserved in Ancient Egyptian and Ancient Greek, carried by three writing systems—not three separate languages.",
      sourceLine: "BM-01 + CGU-01 · inscription / custody record",
      sourceIds: ["british-museum-rosetta", "cultural-property-dispute"],
      claimId: "registers-and-provenance",
      beats: [
        {
          id: 0,
          action: "Separate languages from scripts",
          title: "Two languages",
          body: "Hieroglyphic, Demotic, and Greek are three scripts.",
        },
        {
          id: 1,
          action: "Add the contested custody record",
          title: "One object, contested custody",
          body: "The acquisition account and return claim stay visible together.",
        },
      ],
    },
    {
      id: 2,
      index: "02 / ALIGN",
      title: "Parallel passages create testable correspondences.",
      lede:
        "Greek supplies a readable decree structure. Egyptian versions can then be aligned by names, clauses, and repeated institutional language.",
      sourceLine: "DRS-01 + BM-01 · digital parallel text / inscription",
      sourceIds: ["digital-rosetta-stone", "british-museum-rosetta"],
      claimId: "parallel-sections",
      beats: [
        {
          id: 0,
          action: "Anchor the known Greek structure",
          title: "Known text",
          body: "Start from the readable Greek decree.",
        },
        {
          id: 1,
          action: "Align the Demotic register",
          title: "Cursive Egyptian",
          body: "Match recurring sections without forcing identical wording.",
        },
        {
          id: 2,
          action: "Align the surviving hieroglyphic register",
          title: "Monumental Egyptian",
          body: "Use the fragmentary top register as a constrained comparison.",
        },
        {
          id: 3,
          action: "Mark mismatch and damage",
          title: "Alignment limit",
          body: "Corresponding meaning is not character-for-character identity.",
        },
      ],
    },
    {
      id: 3,
      index: "03 / ANCHOR",
      title: "A name is an anchor, not a dictionary.",
      lede:
        "A cartouche isolates a royal name. Comparing Ptolemy with Greek and with names on other objects yields a small, checkable set of sound values.",
      sourceLine: "BM-01 + BM-02 · cartouche / phonetic-name evidence",
      sourceIds: ["british-museum-rosetta", "british-museum-eureka"],
      claimId: "cartouche-anchor",
      beats: [
        {
          id: 0,
          action: "Bound the cartouche evidence",
          title: "Ptolemy",
          body: "A royal name opens a narrow phonetic foothold.",
        },
      ],
    },
    {
      id: 4,
      index: "04 / REVISE",
      title: "Decipherment moves by hypothesis, revision, and test.",
      lede:
        "Åkerblad, Young, Champollion, language knowledge, copied inscriptions, and later publications form an overlapping contribution chain.",
      sourceLine: "BNF-02 + IA-01 + BNF-01 + BM-02 · contribution chain",
      sourceIds: [
        "bnf-decipherment-chain",
        "young-account",
        "champollion-dacier",
        "british-museum-eureka",
      ],
      claimId: "contribution-chain",
      beats: [
        {
          id: 0,
          action: "Show the Demotic foothold",
          title: "Hypothesis",
          body: "Proper names and Coptic comparisons narrow possibilities.",
        },
        {
          id: 1,
          action: "Add Young's cross-script evidence",
          title: "Revision",
          body: "Ptolemy links sound signs across scripts.",
        },
        {
          id: 2,
          action: "Test the broader phonetic system",
          title: "Validation",
          body: "Native names, grammar, and other inscriptions extend the reading.",
        },
      ],
    },
    {
      id: 5,
      index: "05 / VERIFY",
      title: "The result is a method, not a magic key.",
      lede:
        "Readings become durable when names, grammar, parallel passages, and new texts converge—and remain qualified where damage or context leaves choices open.",
      sourceLine: "BNF-01 + IA-01 + BM-02 + DRS-01 · verification / limits",
      sourceIds: [
        "champollion-dacier",
        "young-account",
        "british-museum-eureka",
        "digital-rosetta-stone",
      ],
      claimId: "verified-reading",
      beats: [
        {
          id: 0,
          action: "Close with evidence and limits",
          title: "Converging proof",
          body: "Keep readable groups and unresolved context in the same frame.",
        },
      ],
    },
  ],
  zh: [
    {
      id: 1,
      index: "01 / 原件",
      title: "先纠正一个常见说法。",
      lede: "同一份敕令使用古埃及语与古希腊语，以三种书写体保存；不是三种语言。",
      sourceLine: "BM-01 + CGU-01 · 铭文 / 保管权记录",
      sourceIds: ["british-museum-rosetta", "cultural-property-dispute"],
      claimId: "registers-and-provenance",
      beats: [
        {
          id: 0,
          action: "区分语言与书写体",
          title: "两种语言",
          body: "圣书体、世俗体与希腊字母是三种书写体。",
        },
        {
          id: 1,
          action: "加入有争议的保管记录",
          title: "一件文物，保管权有争议",
          body: "取得叙事与归还诉求同时可见。",
        },
      ],
    },
    {
      id: 2,
      index: "02 / 对齐",
      title: "平行段落把猜测变成可检验对应。",
      lede: "希腊文提供可读的敕令结构，再按人名、句法与重复的制度用语对齐埃及文字。",
      sourceLine: "DRS-01 + BM-01 · 数字平行文本 / 铭文结构",
      sourceIds: ["digital-rosetta-stone", "british-museum-rosetta"],
      claimId: "parallel-sections",
      beats: [
        {
          id: 0,
          action: "锁定可读的希腊文结构",
          title: "已知文本",
          body: "从可读的希腊文敕令开始。",
        },
        {
          id: 1,
          action: "对齐世俗体段落",
          title: "草写埃及文",
          body: "匹配重复段落，不强迫逐字一致。",
        },
        {
          id: 2,
          action: "对齐残存圣书体段落",
          title: "纪念碑埃及文",
          body: "把残缺的顶部段落作为受约束比较。",
        },
        {
          id: 3,
          action: "标出差异与缺损",
          title: "对齐边界",
          body: "意义对应不等于字符逐一相同。",
        },
      ],
    },
    {
      id: 3,
      index: "03 / 锚点",
      title: "人名是锚点，不是整本字典。",
      lede: "王名圈隔离出王室人名；把托勒密与希腊文及其他器物上的人名比较，只能得到一小组可复核音值。",
      sourceLine: "BM-01 + BM-02 · 王名圈 / 表音人名证据",
      sourceIds: ["british-museum-rosetta", "british-museum-eureka"],
      claimId: "cartouche-anchor",
      beats: [
        {
          id: 0,
          action: "限定王名圈证据",
          title: "托勒密",
          body: "王名只打开一处狭窄的表音立足点。",
        },
      ],
    },
    {
      id: 4,
      index: "04 / 修订",
      title: "破译靠假设、修订与检验推进。",
      lede: "奥克布拉德、杨、商博良、语言知识、拓本和后续出版物共同组成交叠的贡献链。",
      sourceLine: "BNF-02 + IA-01 + BNF-01 + BM-02 · 贡献链",
      sourceIds: [
        "bnf-decipherment-chain",
        "young-account",
        "champollion-dacier",
        "british-museum-eureka",
      ],
      claimId: "contribution-chain",
      beats: [
        {
          id: 0,
          action: "显示世俗体突破口",
          title: "假设",
          body: "专名与科普特语比较缩小可能范围。",
        },
        {
          id: 1,
          action: "加入杨的跨书写体证据",
          title: "修订",
          body: "托勒密把不同书写体中的音符联系起来。",
        },
        {
          id: 2,
          action: "检验更广的表音系统",
          title: "验证",
          body: "本土王名、语法与其他铭文扩展读法。",
        },
      ],
    },
    {
      id: 5,
      index: "05 / 验证",
      title: "最终得到的是方法，不是魔法钥匙。",
      lede: "人名、语法、平行段落与新文本相互收敛时，读法才站得住；遇到缺损或语境歧义时仍需保留限定。",
      sourceLine: "BNF-01 + IA-01 + BM-02 + DRS-01 · 验证 / 边界",
      sourceIds: [
        "champollion-dacier",
        "young-account",
        "british-museum-eureka",
        "digital-rosetta-stone",
      ],
      claimId: "verified-reading",
      beats: [
        {
          id: 0,
          action: "以证据与边界收束",
          title: "收敛证据",
          body: "把可读字组与未决语境放在同一画面。",
        },
      ],
    },
  ],
};

export const readingRosettaSources = [
  {
    id: "british-museum-rosetta",
    ref: "BM-01",
    claimIds: [
      "registers-and-provenance",
      "two-languages-three-scripts",
      "decree-and-fragment",
      "provenance-and-claim",
      "parallel-sections",
      "cartouche-anchor",
    ],
    authority: "British Museum",
    title: "The Rosetta Stone: everything you need to know",
    citation: "British Museum, collection research article, accessed 10 July 2026.",
    url: "https://www.britishmuseum.org/blog/everything-you-ever-wanted-know-about-rosetta-stone",
    supports:
      "The 196 BCE decree, two Egyptian scripts plus Greek, surviving line counts, Ptolemy cartouche, discovery, 1801 British acquisition account, and display since 1802.",
  },
  {
    id: "british-museum-eureka",
    ref: "BM-02",
    claimIds: [
      "cartouche-anchor",
      "contribution-chain",
      "coptic-and-grammar",
      "verification-beyond-1822",
      "verified-reading",
    ],
    authority: "British Museum",
    title: "Eureka! Finding the key to ancient Egypt",
    citation: "British Museum, decipherment research article, 2022.",
    url: "https://www.britishmuseum.org/blog/eureka-finding-key-ancient-egypt",
    supports:
      "Young and Champollion's overlapping phonetic work, the Ptolemy and Cleopatra name comparisons, Coptic evidence, determinatives, later tests, and the 1824 Précis.",
  },
  {
    id: "champollion-dacier",
    ref: "BNF-01",
    claimIds: ["contribution-chain", "verification-beyond-1822", "verified-reading"],
    authority: "Bibliothèque nationale de France",
    title: "Lettre à M. Dacier relative à l'alphabet des hiéroglyphes phonétiques",
    citation: "Jean-François Champollion, Paris: Firmin-Didot, 1822, 52 pages and 16 plates.",
    url: "https://gallica.bnf.fr/ark:/12148/bpt6k1040333p",
    supports:
      "Champollion's original published proposal for phonetic hieroglyphs used in Greek and Roman royal names and titles; evidence for an 1822 milestone rather than an instant total translation.",
  },
  {
    id: "young-account",
    ref: "IA-01",
    claimIds: ["contribution-chain", "verification-beyond-1822", "verified-reading"],
    authority: "Internet Archive / Harvard University scan",
    title: "Thomas Young, An Account of Some Recent Discoveries in Hieroglyphical Literature",
    citation: "Thomas Young, London: John Murray, 1823, public-domain library scan.",
    url: "https://archive.org/details/anaccountsomere00youngoog",
    supports:
      "Young's own account of his alphabet, the extension attributed to Champollion, and the priority dispute that documents overlapping rather than single-hero work.",
  },
  {
    id: "bnf-decipherment-chain",
    ref: "BNF-02",
    claimIds: ["contribution-chain"],
    authority: "Bibliothèque nationale de France · Gallica",
    title: "Hiéroglyphes et autres écritures égyptiennes",
    citation: "Gallica thematic research selection on Egyptian scripts and decipherment.",
    url: "https://gallica.bnf.fr/selections/fr/html/hieroglyphes-et-autres-ecritures-egyptiennes",
    supports:
      "The documented sequence involving David Åkerblad, Thomas Young, and the Champollion brothers, plus the relation between hieroglyphic, hieratic, and Demotic writing.",
  },
  {
    id: "digital-rosetta-stone",
    ref: "DRS-01",
    claimIds: ["two-languages-three-scripts", "parallel-sections", "verified-reading"],
    authority: "Leipzig University / British Museum / University of Florida",
    title: "The Digital Rosetta Stone",
    citation: "Digital Rosetta Stone project, Leipzig University, accessed 10 July 2026.",
    url: "https://www.digital-rosetta-stone.org/",
    supports:
      "Three versions of the same decree in Ancient Egyptian and Ancient Greek, plus current digital text, text-image and textual alignment, translations, and linguistic annotation for teaching and research.",
  },
  {
    id: "cultural-property-dispute",
    ref: "CGU-01",
    claimIds: ["registers-and-provenance", "provenance-and-claim"],
    authority: "Claremont Graduate University",
    title: "Cultural Property Disputes Resource: Egyptian Rosetta Stone",
    citation: "Cultural Property Disputes Resource, case record, accessed 10 July 2026.",
    url: "https://research.cgu.edu/cultural-property-disputes-resource/cpdr/rosetta-stone/",
    supports:
      "The 1801 handover after French surrender, current British Museum location, and the Egyptian government claim recorded as unresolved.",
  },
] as const satisfies readonly (Source & {
  id: string;
  ref: string;
  claimIds: readonly string[];
})[];

export const readingRosettaClaims: readonly ClaimBoundary[] = [
  {
    id: "registers-and-provenance",
    sourceIds: ["british-museum-rosetta", "cultural-property-dispute"],
    boundary:
      "Keep the two-language, three-script correction and the separately attributed custody dispute together without flattening either claim.",
  },
  {
    id: "two-languages-three-scripts",
    sourceIds: ["british-museum-rosetta", "digital-rosetta-stone"],
    boundary:
      "Use the audience-facing correction two languages and three scripts; Egyptian varieties need not be misrepresented as three unrelated languages.",
  },
  {
    id: "decree-and-fragment",
    sourceIds: ["british-museum-rosetta"],
    boundary:
      "The stone is an incomplete copy of a 196 BCE priestly decree for Ptolemy V, not the only surviving decree or a complete original monument.",
  },
  {
    id: "provenance-and-claim",
    sourceIds: ["british-museum-rosetta", "cultural-property-dispute"],
    boundary:
      "Attribute the acquisition narrative to the British Museum and separately state that the Egyptian ownership claim is recorded as unresolved.",
  },
  {
    id: "parallel-sections",
    sourceIds: ["british-museum-rosetta", "digital-rosetta-stone"],
    boundary:
      "Align meanings, names, clauses, and grammar across registers; do not imply a character-for-character substitution cipher.",
  },
  {
    id: "cartouche-anchor",
    sourceIds: ["british-museum-rosetta", "british-museum-eureka"],
    boundary:
      "A royal cartouche and known name provide a bounded phonetic anchor, not a complete dictionary or a one-step decipherment.",
  },
  {
    id: "contribution-chain",
    sourceIds: [
      "young-account",
      "champollion-dacier",
      "bnf-decipherment-chain",
      "british-museum-eureka",
    ],
    boundary:
      "Present an overlapping and simplified contribution chain without assigning the entire decipherment to a single hero or erasing later revision.",
  },
  {
    id: "coptic-and-grammar",
    sourceIds: ["british-museum-eureka"],
    boundary:
      "Coptic and grammatical analysis constrain readings, while Egyptian writing combines phonetic and non-phonetic functions rather than acting as a plain alphabet.",
  },
  {
    id: "verification-beyond-1822",
    sourceIds: ["champollion-dacier", "young-account", "british-museum-eureka"],
    boundary:
      "Treat 1822 as a landmark publication and 1824 plus new inscriptions as continued testing, extension, and correction—not an instantaneous final solution.",
  },
  {
    id: "verified-reading",
    sourceIds: [
      "champollion-dacier",
      "young-account",
      "british-museum-eureka",
      "digital-rosetta-stone",
    ],
    boundary:
      "Present decipherment as converging evidence from primary publications, names, grammar, parallel passages, and later texts while keeping damaged or context-dependent readings qualified.",
  },
];

export const readingRosettaTransitionScore = {
  "1->2": "hard-cut",
  "2->3": "focus-swap",
  "3->4": "crossfade",
  "4->5": "hard-cut",
} as const satisfies TopicTransitionScore;

const TOPIC_NAVIGATION = {
  geometry: "typographic-index",
  carrier: "rosetta-symbol-minimap",
  invocation: "gesture-hold",
  feedback: "geometry-reflow",
} as const satisfies TopicDefinition["navigation"];

const TRANSITION_MAP: SceneTransitionMap = readingRosettaTransitionScore;

const INCOMING_TRANSITION_KIND: Record<number, SceneTransitionKind> = {
  1: "hard-cut",
  2: "hard-cut",
  3: "focus-swap",
  4: "crossfade",
  5: "hard-cut",
};

const BEAT_LAYOUT_MODES: Partial<Record<number, BeatLayoutMode>> = {
  1: "reserved",
  2: "reserved",
  4: "reserved",
};

function getScene(language: Language, scene: number): SceneCopy {
  return SCENES[language][scene - 1] ?? SCENES[language][0];
}

function clampScene(scene: number): number {
  return Math.max(1, Math.min(5, scene));
}

function clampBeat(scene: SceneCopy, beat: number): number {
  return Math.max(0, Math.min(scene.beats.length - 1, beat));
}

function local(language: Language, en: string, zh: string): string {
  return language === "zh" ? zh : en;
}

function metadataScenes(language: Language): TopicMetadata["scenes"] {
  return SCENES[language].map((scene) => ({
    id: scene.id,
    title: scene.title,
    beats: scene.beats,
  }));
}

function buildMetadata(language: Language): TopicMetadata {
  return {
    theme: language === "zh" ? "破译罗塞塔" : "Reading Rosetta",
    densityLabel: language === "zh" ? "证据报告" : "Evidence report",
    heroScene: 4,
    colors: {
      bg: "#ede7da",
      ink: "#20282b",
      panel: "#fbf8ef",
    },
    typography: {
      header: "Charter 650",
      body: "SF Mono 400",
    },
    tags: [
      "text-report",
      "annotated-source",
      "parallel-text",
      "egyptology",
      "evidence",
      "reading-first",
    ],
    fonts: ["Charter", "SF Mono", "cjk:Songti SC", "cjk:PingFang SC"],
    scenes: metadataScenes(language),
  };
}

function ReportHeader({ scene }: { scene: SceneCopy }) {
  return (
    <header className={styles.reportHeader} data-beat-layout-item="true">
      <div className={styles.sceneIndex}>{scene.index}</div>
      <div className={styles.headingBlock}>
        <p className={styles.eyebrow}>READING ROSETTA · EVIDENCE FILE</p>
        <h1>{scene.title}</h1>
        <p className={styles.lede}>{scene.lede}</p>
      </div>
    </header>
  );
}

function ReportFooter({ scene }: { scene: SceneCopy }) {
  return (
    <footer className={styles.reportFooter} data-beat-layout-item="true">
      <span data-source-ref={scene.sourceIds.join(" ")}>{scene.sourceLine}</span>
      <span>CLAIM / {scene.claimId}</span>
    </footer>
  );
}

function RegisterBadge({
  script,
  language,
  note,
}: {
  script: string;
  language: string;
  note: string;
}) {
  return (
    <article className={styles.registerBadge} data-script-register={script}>
      <span className={styles.registerMark} aria-hidden="true" />
      <div>
        <strong>{script}</strong>
        <span>{language}</span>
        <small>{note}</small>
      </div>
    </article>
  );
}

function StoneDrawing() {
  const lines = [144, 166, 188, 270, 292, 314, 336, 430, 452, 474, 496, 518];
  return (
    <svg
      className={styles.stoneDrawing}
      viewBox="0 0 520 680"
      role="img"
      aria-label="Self-drawn schematic of the broken Rosetta Stone with three inscription registers"
    >
      <defs>
        <linearGradient id="rosetta-stone-fill" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#263238" />
          <stop offset="1" stopColor="#12191c" />
        </linearGradient>
        <pattern id="rosetta-stone-grain" width="26" height="26" patternUnits="userSpaceOnUse">
          <circle cx="5" cy="7" r="1.6" fill="#87969a" opacity="0.24" />
          <circle cx="19" cy="17" r="1.2" fill="#c3cdca" opacity="0.18" />
        </pattern>
      </defs>
      <path
        d="M96 626 L78 204 L118 160 L116 88 L164 78 L188 34 L260 56 L316 24 L372 58 L424 54 L442 124 L470 152 L452 626 Z"
        fill="url(#rosetta-stone-fill)"
        stroke="#6e7b7f"
        strokeWidth="5"
      />
      <path
        d="M96 626 L78 204 L118 160 L116 88 L164 78 L188 34 L260 56 L316 24 L372 58 L424 54 L442 124 L470 152 L452 626 Z"
        fill="url(#rosetta-stone-grain)"
      />
      <path d="M118 116 L438 116" stroke="#d6bf78" strokeWidth="3" opacity="0.8" />
      <path d="M92 236 L460 236" stroke="#9fb7c0" strokeWidth="3" opacity="0.7" />
      <path d="M88 386 L456 386" stroke="#d7d4c8" strokeWidth="3" opacity="0.65" />
      {lines.map((y, index) => (
        <path
          key={y}
          d={`M${index % 2 === 0 ? 120 : 142} ${y} H${index % 3 === 0 ? 410 : 438}`}
          stroke={y < 236 ? "#d6bf78" : y < 386 ? "#9fb7c0" : "#d7d4c8"}
          strokeWidth={y < 236 ? 6 : 4}
          strokeLinecap="round"
          opacity={0.62}
        />
      ))}
      <path d="M114 160 L170 78 L198 126 L238 88" fill="none" stroke="#0c1214" strokeWidth="13" />
      <circle cx="136" cy="118" r="7" fill="#d6bf78" />
      <circle cx="414" cy="278" r="6" fill="#9fb7c0" />
      <circle cx="128" cy="476" r="6" fill="#d7d4c8" />
    </svg>
  );
}

function SceneOne({ language, beat }: { language: Language; beat: number }) {
  const provenanceVisible = beat >= 1;
  return (
    <main className={styles.sceneOne} data-beat-layout-item="true">
      <section className={styles.stoneBoard} data-claim-id="two-languages-three-scripts">
        <StoneDrawing />
        <div className={styles.stoneCaption}>
          {local(language, "Schematic redraw · incomplete stela", "示意重绘 · 残缺石碑")}
        </div>
      </section>

      <section className={styles.registerColumn}>
        <div className={styles.correctionCard} data-claim-id="two-languages-three-scripts">
          <span>{local(language, "CORRECTION 01", "纠正 01")}</span>
          <strong>{local(language, "Two languages. Three scripts.", "两种语言，三种书写体。")}</strong>
          <p>
            {local(
              language,
              "Ancient Egyptian appears in hieroglyphic and Demotic scripts; Ancient Greek appears in Greek script.",
              "古埃及语分别用圣书体与世俗体书写；古希腊语使用希腊字母。",
            )}
          </p>
        </div>
        <div className={styles.registerStack}>
          <RegisterBadge
            script={local(language, "Hieroglyphic", "圣书体")}
            language={local(language, "Ancient Egyptian", "古埃及语")}
            note={local(language, "14 surviving lines · top fragment", "残存 14 行 · 顶部残片")}
          />
          <RegisterBadge
            script={local(language, "Demotic", "世俗体")}
            language={local(language, "Ancient Egyptian", "古埃及语")}
            note={local(language, "32 lines · cursive register", "32 行 · 草写段落")}
          />
          <RegisterBadge
            script={local(language, "Greek", "希腊字母")}
            language={local(language, "Ancient Greek", "古希腊语")}
            note={local(language, "54 lines · readable anchor", "54 行 · 可读锚点")}
          />
        </div>
        <aside
          className={styles.provenanceCard}
          data-provenance-context="contested"
          data-revealed={provenanceVisible ? "true" : "false"}
          aria-hidden={!provenanceVisible}
          data-claim-id="provenance-and-claim"
        >
          <strong>{local(language, "Custody is part of the evidence file", "保管史也是证据档案的一部分")}</strong>
          <p>
            {local(
              language,
              "The British Museum describes transfer after the 1801 Capitulation of Alexandria and display in London since 1802.",
              "大英博物馆将其描述为 1801 年《亚历山大投降协定》后移交，并自 1802 年起在伦敦展出。",
            )}
          </p>
          <p>
            {local(
              language,
              "Claremont's cultural-property record says the Egyptian ownership claim remains unresolved.",
              "克莱蒙特文化财产争议档案记录：埃及的所有权主张仍未解决。",
            )}
          </p>
        </aside>
      </section>
    </main>
  );
}

const ALIGNMENT_ROWS = [
  {
    en: "DATE · year 9 / 196 BCE",
    zh: "日期 · 在位第九年 / 公元前 196 年",
    greek: "readable date formula",
    demotic: "corresponding date clause",
    hiero: "surviving formula fragment",
  },
  {
    en: "ROYAL NAME · Ptolemy V",
    zh: "王名 · 托勒密五世",
    greek: "ΠΤΟΛΕΜΑΙΟΣ",
    demotic: "repeated royal-name cluster",
    hiero: "cartouche-bound name",
  },
  {
    en: "DECREE · priestly honours",
    zh: "敕令 · 祭司授予的荣誉",
    greek: "known institutional clauses",
    demotic: "Egyptian decree phrasing",
    hiero: "monumental register wording",
  },
  {
    en: "COPY ORDER · temple stelae",
    zh: "复制命令 · 神庙立碑",
    greek: "three-script publication order",
    demotic: "parallel publication clause",
    hiero: "damaged corresponding section",
  },
];

function SceneTwo({ language, beat }: { language: Language; beat: number }) {
  const registerNames = [
    {
      key: "greek",
      label: local(language, "Greek · known-language anchor", "希腊文 · 已知语言锚点"),
    },
    {
      key: "demotic",
      label: local(language, "Demotic Egyptian · compare", "世俗体埃及文 · 比较"),
    },
    {
      key: "hiero",
      label: local(language, "Hieroglyphic Egyptian · test", "圣书体埃及文 · 检验"),
    },
  ] as const;

  return (
    <main className={styles.sceneTwo} data-beat-layout-item="true" data-claim-id="parallel-sections">
      <div className={styles.alignmentLegend}>
        {registerNames.map((register, index) => (
          <section
            key={register.key}
            data-parallel-register={register.key}
            data-active={beat >= index ? "true" : "false"}
          >
            <span>{String(index + 1).padStart(2, "0")}</span>
            <strong>{register.label}</strong>
          </section>
        ))}
      </div>

      <section className={styles.alignmentGrid}>
        {ALIGNMENT_ROWS.map((row, index) => {
          const focused = index === beat;
          return (
            <article
              key={row.en}
              className={styles.alignmentRow}
              data-alignment-row={index + 1}
              data-focused={focused ? "true" : "false"}
            >
              <div className={styles.alignmentLabel}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{language === "zh" ? row.zh : row.en}</strong>
              </div>
              {registerNames.map((register) => (
                <div key={register.key} className={styles.alignmentCell}>
                  <span className={styles.lineSketch} aria-hidden="true" />
                  <p>{row[register.key]}</p>
                </div>
              ))}
            </article>
          );
        })}
      </section>

      <aside className={styles.alignmentBoundary} data-focused={beat === 3 ? "true" : "false"}>
        <strong>
          {local(
            language,
            "Greek gives readable decree structure; alignment follows semantic sections, not character-for-character substitution.",
            "希腊文给出可读的敕令结构；对齐的是意义段落，不是字符逐一替换。",
          )}
        </strong>
        <span>
          {local(
            language,
            "The versions are damaged and differently phrased; missing material and grammar still matter.",
            "各版本既有缺损，也有不同措辞；缺失内容与语法仍然关键。",
          )}
        </span>
      </aside>
    </main>
  );
}

function PhoneticCartouche() {
  const anchors = ["P", "T", "O", "L", "M", "S", "A"];
  return (
    <svg
      className={styles.cartoucheDrawing}
      viewBox="0 0 820 260"
      role="img"
      aria-label="Schematic cartouche with bounded phonetic anchors derived from name comparisons"
      data-cartouche-evidence="true"
    >
      <rect x="28" y="34" width="744" height="166" rx="82" fill="#f7f1df" stroke="#2b3538" strokeWidth="6" />
      <path d="M776 52 V220" stroke="#2b3538" strokeWidth="10" strokeLinecap="round" />
      {anchors.map((anchor, index) => {
        const x = 96 + index * 94;
        return (
          <g key={anchor} data-phonetic-anchor={anchor}>
            {index === 0 && <rect x={x} y="88" width="42" height="42" rx="4" fill="none" stroke="#a66f32" strokeWidth="6" />}
            {index === 1 && <path d={`M${x} 130 Q${x + 22} 82 ${x + 44} 130`} fill="none" stroke="#a66f32" strokeWidth="6" />}
            {index === 2 && <circle cx={x + 22} cy="108" r="22" fill="none" stroke="#a66f32" strokeWidth="6" />}
            {index === 3 && <path d={`M${x} 136 Q${x + 14} 70 ${x + 48} 92 Q${x + 30} 130 ${x} 136`} fill="none" stroke="#a66f32" strokeWidth="6" />}
            {index === 4 && <path d={`M${x} 132 V86 M${x + 14} 132 V78 M${x + 28} 132 V92 M${x + 42} 132 V82`} stroke="#a66f32" strokeWidth="6" />}
            {index === 5 && <path d={`M${x} 132 V84 M${x + 22} 132 V78 M${x + 44} 132 V88`} stroke="#a66f32" strokeWidth="5" />}
            {index === 6 && <path d={`M${x} 88 H${x + 46} M${x + 5} 108 H${x + 41} M${x + 10} 128 H${x + 36}`} stroke="#a66f32" strokeWidth="6" />}
            <text x={x + 22} y="174" textAnchor="middle" fill="#273235" fontSize="22" fontWeight="700">
              {anchor}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function SceneThree({ language }: { language: Language }) {
  return (
    <main className={styles.sceneThree} data-beat-layout-item="true" data-claim-id="cartouche-anchor">
      <section className={styles.knownNameCard}>
        <span>{local(language, "KNOWN GREEK NAME", "已知希腊文人名")}</span>
        <strong>ΠΤΟΛΕΜΑΙΟΣ</strong>
        <small>PTOLEMAIOS · PTOLEMY</small>
      </section>
      <section className={styles.cartoucheBoard}>
        <div className={styles.cartoucheHeader}>
          <span>{local(language, "ISOLATE", "隔离")}</span>
          <span>{local(language, "COMPARE", "比较")}</span>
          <span>{local(language, "RETEST", "复核")}</span>
        </div>
        <PhoneticCartouche />
        <p className={styles.cartoucheCaption}>
          {local(
            language,
            "Schematic redraw — phonetic anchors from historical name comparisons, not a facsimile or a complete spelling table.",
            "示意重绘——音值锚点来自历史人名比较，并非碑面摹本，也不是完整拼写表。",
          )}
        </p>
      </section>
      <aside className={styles.anchorLimit}>
        <strong>{local(language, "What the name can prove", "人名能够证明什么")}</strong>
        <p>
          {local(
            language,
            "The cartouche marks a royal name; Greek supplies Ptolemy; comparison with Cleopatra and other inscriptions expands a small sound set.",
            "王名圈标出王室人名；希腊文提供“托勒密”；再与“克娄巴特拉”等其他铭文比较，扩展一小组音值。",
          )}
        </p>
        <strong>{local(language, "What it cannot prove alone", "仅凭人名不能证明什么")}</strong>
        <p>
          {local(
            language,
            "It does not resolve grammar, determinatives, damaged clauses, or the full mixed writing system.",
            "它无法单独解决语法、限定符、残缺句子或整套混合书写系统。",
          )}
        </p>
      </aside>
    </main>
  );
}

const CONTRIBUTIONS = [
  {
    year: "1802",
    person: "Johan David Åkerblad",
    en: "Worked through repeated proper names in Demotic and compared Egyptian with Coptic, creating an early, partial phonetic foothold.",
    zh: "从世俗体中的重复专名入手，并把埃及语与科普特语比较，形成早期但不完整的表音立足点。",
    statusEn: "HYPOTHESIS · partial values",
    statusZh: "假设 · 局部音值",
  },
  {
    year: "1814–1819",
    person: "Thomas Young",
    en: "Linked Demotic and hieroglyphic signs and identified sound signs in Ptolemy's cartouche, while limiting phonetic use too narrowly.",
    zh: "联系世俗体与圣书体符号，并在托勒密王名圈中识别音符；但对表音用途的范围判断过窄。",
    statusEn: "REVISION · cross-script link",
    statusZh: "修订 · 跨书写体联系",
  },
  {
    year: "1822 → 1824",
    person: "Jean-François Champollion + other inscriptions",
    en: "Extended phonetic readings beyond foreign names, used Coptic and grammar, tested native royal names, then elaborated the system with new material.",
    zh: "把表音读法扩展到外来人名之外，使用科普特语与语法检验本土王名，再用新材料继续完善系统。",
    statusEn: "VALIDATION · broader system",
    statusZh: "验证 · 更广系统",
  },
];

function SceneFour({ language, beat }: { language: Language; beat: number }) {
  return (
    <main className={styles.sceneFour} data-beat-layout-item="true" data-claim-id="contribution-chain">
      <section className={styles.revisionBoard}>
        <div className={styles.revisionHeader}>
          <span>{local(language, "HYPOTHESIS", "假设")}</span>
          <span>→</span>
          <span>{local(language, "REVISION", "修订")}</span>
          <span>→</span>
          <span>{local(language, "TEST", "检验")}</span>
        </div>
        <div className={styles.contributionList}>
          {CONTRIBUTIONS.map((item, index) => (
            <article
              key={item.person}
              className={styles.contributionStep}
              data-contribution-step={index + 1}
              data-focused={beat === index ? "true" : "false"}
              data-reached={beat >= index ? "true" : "false"}
            >
              <div className={styles.contributionYear}>{item.year}</div>
              <div className={styles.contributionCopy}>
                <strong>{item.person}</strong>
                <p>{language === "zh" ? item.zh : item.en}</p>
              </div>
              <div className={styles.contributionStatus}>
                {language === "zh" ? item.statusZh : item.statusEn}
              </div>
            </article>
          ))}
        </div>
      </section>
      <aside className={styles.chainNotes}>
        <div>
          <span>{local(language, "ORIGINAL RECORD", "原始记录")}</span>
          <strong>Young · 1823</strong>
          <p>{local(language, "Claims his alphabet and names Champollion's extension.", "主张其字母表贡献，并记录商博良的扩展。")}</p>
        </div>
        <div>
          <span>{local(language, "ORIGINAL RECORD", "原始记录")}</span>
          <strong>Lettre à M. Dacier · 1822</strong>
          <p>{local(language, "Publishes a phonetic alphabet for Greek and Roman royal names.", "公布用于希腊、罗马王名的表音字母。")}</p>
        </div>
        <div className={styles.chainBoundary}>
          {local(
            language,
            "Simplified contribution chain — not an exhaustive allocation of priority. Other scholars, copyists, collectors, and texts also supplied evidence.",
            "简化的贡献链——并非完整的优先权分配。其他学者、拓印者、收藏者与文本同样提供了证据。",
          )}
        </div>
      </aside>
    </main>
  );
}

function SceneFive({ language }: { language: Language }) {
  return (
    <main className={styles.sceneFive} data-beat-layout-item="true" data-claim-id="verified-reading">
      <section className={styles.resolutionColumn} data-resolution-state="supported">
        <div className={styles.resolutionTag}>{local(language, "SUPPORTED", "证据收敛")}</div>
        <h2>{local(language, "Readable with converging evidence", "在多重证据收敛下可读")}</h2>
        <ul>
          <li>{local(language, "Royal names isolated by cartouches", "由王名圈隔离的王室人名")}</li>
          <li>{local(language, "Phonetic values repeated across names", "在人名之间重复出现的音值")}</li>
          <li>{local(language, "Parallel decree sections and grammar", "平行敕令段落与语法")}</li>
          <li>{local(language, "Coptic and later inscriptions as cross-checks", "科普特语与后续铭文交叉检验")}</li>
        </ul>
      </section>
      <section className={styles.resolutionColumn} data-resolution-state="contextual">
        <div className={styles.resolutionTag}>{local(language, "CONTEXT REQUIRED", "仍需语境")}</div>
        <h2>{local(language, "Still needs context", "仍需更多语境")}</h2>
        <ul>
          <li>{local(language, "Missing hieroglyphic passages", "缺失的圣书体段落")}</li>
          <li>{local(language, "Signs with phonetic and non-phonetic roles", "兼具表音与非表音作用的符号")}</li>
          <li>{local(language, "Different wording between versions", "不同版本之间的措辞差异")}</li>
          <li>{local(language, "Readings revised by new texts", "被新文本继续修订的读法")}</li>
        </ul>
      </section>
      <aside className={styles.finalMethod}>
        <strong>
          {local(
            language,
            "1822 was a milestone, not an instant total solution.",
            "1822 年是里程碑，不是瞬间完成的总解。",
          )}
        </strong>
        <p>
          {local(
            language,
            "The durable result was a repeatable practice: align, hypothesize, test on other inscriptions, revise, and keep uncertainty visible.",
            "真正持久的是可重复的方法：对齐、提出假设、用其他铭文检验、修订，并让不确定性保持可见。",
          )}
        </p>
      </aside>
    </main>
  );
}

function ScenePanel({
  sceneId,
  beat,
  language,
}: {
  sceneId: number;
  beat: number;
  language: Language;
}) {
  const scene = getScene(language, sceneId);
  const activeBeat = clampBeat(scene, beat);
  return (
    <section
      className={styles.scene}
      data-claim-id={scene.claimId}
      data-scene-claim-id={scene.claimId}
    >
      <ReportHeader scene={scene} />
      {sceneId === 1 && <SceneOne language={language} beat={activeBeat} />}
      {sceneId === 2 && <SceneTwo language={language} beat={activeBeat} />}
      {sceneId === 3 && <SceneThree language={language} />}
      {sceneId === 4 && <SceneFour language={language} beat={activeBeat} />}
      {sceneId === 5 && <SceneFive language={language} />}
      <ReportFooter scene={scene} />
    </section>
  );
}

const NAVIGATION = [
  { scene: 1, code: "01", en: "stone source", zh: "石碑原件", mark: "▰" },
  { scene: 2, code: "02", en: "align registers", zh: "段落对齐", mark: "≋" },
  { scene: 3, code: "03", en: "name anchor", zh: "人名锚点", mark: "◉" },
  { scene: 4, code: "04", en: "hypothesis", zh: "假设修订", mark: "∆" },
  { scene: 5, code: "05", en: "verified reading", zh: "验证读法", mark: "✓" },
];

const MINIMAP_HOLD_THRESHOLD_MS = 360;
const MINIMAP_TOUCH_EVENTS = ["touchstart", "touchmove", "touchend", "touchcancel"] as const;

function RosettaSymbolMinimap({
  language,
  scene,
  onNavigate,
}: {
  language: Language;
  scene: number;
  onNavigate?: (scene: number, beat: number) => void;
}) {
  const [revealed, setRevealed] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const holdTimerRef = useRef<number | null>(null);

  const clearHoldTimer = useCallback(() => {
    if (holdTimerRef.current === null) return;
    window.clearTimeout(holdTimerRef.current);
    holdTimerRef.current = null;
  }, []);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    // useTouchNav listens natively on the stage. Stop every touch phase at the
    // minimap itself, before it can reach either that listener or window.
    const isolateTouch = (event: TouchEvent) => event.stopPropagation();
    for (const type of MINIMAP_TOUCH_EVENTS) {
      nav.addEventListener(type, isolateTouch, { passive: true });
    }

    return () => {
      for (const type of MINIMAP_TOUCH_EVENTS) {
        nav.removeEventListener(type, isolateTouch);
      }
    };
  }, []);

  useEffect(() => clearHoldTimer, [clearHoldTimer]);

  const beginHold = (event: React.PointerEvent<HTMLElement>) => {
    event.stopPropagation();
    clearHoldTimer();
    setRevealed(false);
    holdTimerRef.current = window.setTimeout(() => {
      holdTimerRef.current = null;
      setRevealed(true);
    }, MINIMAP_HOLD_THRESHOLD_MS);
  };
  const endHold = (event: React.PointerEvent<HTMLElement>) => {
    event.stopPropagation();
    clearHoldTimer();
    setRevealed(false);
  };

  return (
    <nav
      ref={navRef}
      className={styles.symbolMinimap}
      data-topic-navigation="true"
      data-navigation-geometry={TOPIC_NAVIGATION.geometry}
      data-navigation-carrier={TOPIC_NAVIGATION.carrier}
      data-navigation-invocation={TOPIC_NAVIGATION.invocation}
      data-navigation-feedback={TOPIC_NAVIGATION.feedback}
      data-minimap-revealed={revealed ? "true" : "false"}
      aria-label={local(language, "Rosetta symbol minimap", "罗塞塔符号缩略导航")}
      onPointerDown={beginHold}
      onPointerUp={endHold}
      onPointerCancel={endHold}
      onPointerLeave={(event) => {
        event.stopPropagation();
        clearHoldTimer();
        setRevealed(false);
      }}
      onClick={(event) => event.stopPropagation()}
      onKeyDown={(event) => event.stopPropagation()}
    >
      <div className={styles.minimapHint}>
        <span>{local(language, "HOLD", "按住")}</span>
        <strong>{revealed ? local(language, "INDEX OPEN", "索引展开") : "RS"}</strong>
      </div>
      <div className={styles.minimapItems}>
        {NAVIGATION.map((item) => {
          const active = item.scene === scene;
          return (
            <button
              key={item.scene}
              type="button"
              className={styles.minimapButton}
              data-active={active ? "true" : "false"}
              aria-current={active ? "page" : undefined}
              aria-label={`${item.code} ${language === "zh" ? item.zh : item.en}`}
              onClick={(event) => {
                event.stopPropagation();
                onNavigate?.(item.scene, 0);
              }}
              onKeyDown={(event) => {
                event.stopPropagation();
                if (event.key === " " || event.key === "Enter") {
                  event.preventDefault();
                  if (event.repeat) return;
                  onNavigate?.(item.scene, 0);
                }
              }}
            >
              <span className={styles.minimapCode}>{item.code}</span>
              <span className={styles.minimapMark} aria-hidden="true">{item.mark}</span>
              {revealed && (
                <span className={styles.minimapLabel}>
                  {language === "zh" ? item.zh : item.en}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

function TopicStage({
  scene,
  beat,
  language,
  isThumbnail,
  reducedMotion,
  onNavigate,
}: TopicStageProps) {
  const activeScene = clampScene(scene);
  const motionOff = reducedMotion || isThumbnail;
  return (
    <div
      className={`${styles.root} ${motionOff ? styles.motionOff : ""}`}
      data-reading-rosetta-stage="true"
      data-reading-state={motionOff ? "settled" : "live"}
    >
      <SpatialSceneTrack
        scene={activeScene}
        beat={beat}
        sceneIds={[...SCENE_IDS]}
        transitionKind={INCOMING_TRANSITION_KIND[activeScene]}
        transitionMap={TRANSITION_MAP}
        reducedMotion={motionOff}
        beatLayoutModes={BEAT_LAYOUT_MODES}
        renderScene={(sceneId, sceneBeat) => (
          <ScenePanel sceneId={sceneId} beat={sceneBeat} language={language} />
        )}
      />
      {!isThumbnail && (
        <RosettaSymbolMinimap
          language={language}
          scene={activeScene}
          onNavigate={onNavigate}
        />
      )}
    </div>
  );
}

const METADATA = {
  en: buildMetadata("en"),
  zh: buildMetadata("zh"),
} satisfies TopicDefinition["metadata"];

export default defineTopic({
  id: "reading-rosetta",
  styleId: "annotated-source-diff",
  title: { en: "Reading Rosetta", zh: "破译罗塞塔" },
  modelId: "GPT 5.6 Sol",
  Stage: TopicStage,
  metadata: METADATA,
  navigation: TOPIC_NAVIGATION,
  transitionScore: readingRosettaTransitionScore,
  evidence: {
    kind: "facts",
    sources: readingRosettaSources,
  },
});

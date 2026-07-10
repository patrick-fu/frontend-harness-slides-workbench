import { useState } from "react";
import type React from "react";
import type {
  BespokeStyleProps,
  StyleMetadata,
  TopicSource,
  TopicTransitionScore,
} from "../types";
import SpatialSceneTrack from "./SpatialSceneTrack";
import { defineStyleTopic } from "./topic";
import styles from "./kitchen-prep-station-cocoa-fermentation.module.css";

type Lang = "en" | "zh";

interface BeatCopy {
  action: string;
  title: string;
  body: string;
}

interface SceneCopy {
  nav: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  sourceNote: string;
  beats: BeatCopy[];
}

const SCENE_IDS = [1, 2, 3, 4, 5] as const;

export const COCOA_FERMENTATION_TRANSITION_SCORE = {
  "1->2": "paper-fold",
  "2->3": "push-y",
  "3->4": "ink-spread",
  "4->5": "paper-fold",
} as const satisfies TopicTransitionScore;

export const COCOA_FERMENTATION_SOURCES = [
  {
    authority: "FEMS Microbiology Reviews / PubMed",
    title: "Functional role of yeasts, lactic acid bacteria and acetic acid bacteria in cocoa fermentation processes",
    citation: "De Vuyst L, Leroy F. FEMS Microbiol Rev. 2020;44(4):432–453. PMID 32420601.",
    url: "https://pubmed.ncbi.nlm.nih.gov/32420601/",
    supports:
      "Supports the typical yeast–LAB–AAB succession, yeast conversion of pulp glucose to ethanol, LAB production of lactic acid and other metabolites, AAB oxidation of ethanol to acetic acid, and formation of roast-ready precursors after seed structure is disrupted.",
    boundary:
      "A synthesis across cocoa fermentations; species, timing, metabolite balance, and sensory outcome still vary with process conditions.",
  },
  {
    authority: "Critical Reviews in Food Science and Nutrition / PubMed",
    title: "The microbiology of cocoa fermentation and its role in chocolate quality",
    citation: "Schwan RF, Wheals AE. Crit Rev Food Sci Nutr. 2004;44(4):205–221. PMID 15462126.",
    url: "https://pubmed.ncbi.nlm.nih.gov/15462126/",
    supports:
      "Supports the ordered microbial succession and the combined role of ethanol, lactic and acetic acids, and fermentation temperatures reaching roughly 50 °C in killing the seed and initiating flavor-precursor production.",
    boundary:
      "The reported upper temperature is not a universal target; actual peaks depend on heap or box design, mass, turning, variety, weather, and local practice.",
  },
  {
    authority: "International Cocoa Organization",
    title: "Harvesting & Post-harvest: Fermentation",
    citation: "ICCO. Harvesting & Post-harvest, Fermentation and Drying Cocoa Beans sections.",
    url: "https://www.icco.org/harvesting-post-harvest-new/",
    supports:
      "Supports that turning or mixing increases aeration and bacterial activity, that heat and acetic acid contribute to seed death and cellular mixing, and that early fermentation temperatures are often reported around 40–45 °C.",
    boundary:
      "ICCO presents a practical overview rather than one universal fermentation schedule; bean type and local method change duration and temperature.",
  },
  {
    authority: "International Cocoa Organization",
    title: "Processing Cocoa",
    citation: "ICCO. Processing Cocoa: summary of fermentation, drying, and roasting.",
    url: "https://www.icco.org/processing-cocoa/",
    supports:
      "Supports the two-stage flavor boundary used in the closing scene: correct wet-bean fermentation develops flavor on farm, while roasting continues flavor development in the factory.",
    boundary:
      "The page intentionally summarizes a complex process and does not prescribe one roast or fermentation profile for every origin or product.",
  },
  {
    authority: "Molecules / PubMed Central",
    title: "The Chemistry behind Chocolate Production",
    citation: "Barišić V et al. Molecules. 2019;24(17):3163. PMCID PMC6749277.",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC6749277/",
    supports:
      "Supports fermentation as a precursor-forming stage and roasting as a later aroma-forming stage in which Maillard reactions and other chemistry transform amino acids, peptides, and reducing sugars.",
    boundary:
      "This is a chemistry review; the aroma wheel is illustrative of flavor families, not a promise that every fermentation produces every note.",
  },
  {
    authority: "Frontiers in Microbiology",
    title: "A Combined Metagenomics and Metatranscriptomics Approach to Unravel Costa Rican Cocoa Box Fermentation Processes",
    citation: "Verce M et al. Front Microbiol. 2021;12:641185. doi:10.3389/fmicb.2021.641185.",
    url: "https://www.frontiersin.org/journals/microbiology/articles/10.3389/fmicb.2021.641185/full",
    supports:
      "Supports the condition-dependent relay shown in Scene 2: yeasts and LAB begin in a microaerobic pulp, then greater oxygen accessibility accompanies AAB oxidation of ethanol to acetic acid in measured Costa Rican box fermentations.",
    boundary:
      "The study covers three Costa Rican box fermentations; it substantiates a typical pathway but does not erase regional, species, or process variability.",
  },
] as const satisfies readonly (TopicSource & { boundary: string })[];

const CONTENT: Record<number, Record<Lang, SceneCopy>> = {
  1: {
    en: {
      nav: "Wet bean",
      eyebrow: "01 · INGREDIENT",
      title: "Chocolate does not begin chocolatey",
      subtitle:
        "Open cacao fruit reveals seeds wrapped in sweet, acidic pulp. Fermentation starts here, before drying or roasting.",
      sourceNote: "ICCO · De Vuyst & Leroy 2020",
      beats: [
        {
          action: "Open the pod and expose pulp-covered wet beans",
          title: "Wet beans, not chocolate aroma",
          body: "Fresh cacao seeds arrive wrapped in sugary pulp; the familiar roasted profile has not yet formed.",
        },
      ],
    },
    zh: {
      nav: "湿豆",
      eyebrow: "01 · 原料",
      title: "此刻，还没有“巧克力味”",
      subtitle: "打开可可果，种子裹着甜酸果肉。发酵从这里开始，远早于干燥和烘焙。",
      sourceNote: "ICCO · De Vuyst 与 Leroy，2020",
      beats: [
        {
          action: "打开果荚，露出裹着果肉的湿豆",
          title: "湿豆，还不是巧克力香气",
          body: "新鲜可可种子裹在含糖果肉里；熟悉的烘烤风味尚未形成。",
        },
      ],
    },
  },
  2: {
    en: {
      nav: "Relay",
      eyebrow: "02 · MICROBIAL ZONES",
      title: "A relay, under typical conditions",
      subtitle:
        "Timing and dominant species vary, but yeasts and lactic acid bacteria usually lead before acetic acid bacteria gain oxygen.",
      sourceNote: "De Vuyst & Leroy 2020 · Verce et al. 2021",
      beats: [
        {
          action: "Reserve the three fermentation zones around wet pulp",
          title: "Pulp begins oxygen-poor",
          body: "Sugars and citric acid sit around the wet beans in a largely microaerobic mass.",
        },
        {
          action: "Reveal the early yeast and LAB conversions",
          title: "Yeasts and LAB reshape the pulp",
          body: "Yeasts make ethanol; LAB make lactic acid and other metabolites from sugars and citrate.",
        },
        {
          action: "Open the oxygen zone and hand ethanol to AAB",
          title: "More oxygen shifts the relay",
          body: "As pulp drains and the mass is turned, AAB oxidize ethanol to acetic acid and release heat.",
        },
      ],
    },
    zh: {
      nav: "接力",
      eyebrow: "02 · 微生物分区",
      title: "典型条件下，一场接力发生",
      subtitle: "时间和优势种会变化；通常先是酵母与乳酸菌，随后醋酸菌在氧气增加时接棒。",
      sourceNote: "De Vuyst 与 Leroy，2020 · Verce 等，2021",
      beats: [
        {
          action: "在湿果肉周围预留三个发酵区",
          title: "果肉起初缺氧",
          body: "糖与柠檬酸包围湿豆，发酵堆整体处于微需氧环境。",
        },
        {
          action: "揭示早期酵母与乳酸菌转化",
          title: "酵母与乳酸菌先改造果肉",
          body: "酵母生成乙醇；乳酸菌从糖和柠檬酸生成乳酸等代谢物。",
        },
        {
          action: "打开氧气分区，让醋酸菌接过乙醇",
          title: "氧气增加，接力转向",
          body: "果肉排液并翻堆后，醋酸菌把乙醇氧化为醋酸，同时释放热量。",
        },
      ],
    },
  },
  3: {
    en: {
      nav: "Heat stack",
      eyebrow: "03 · TURN & HEAT",
      title: "Turning changes the stack",
      subtitle:
        "Aeration, acids, and heat move together. Temperature is a process signal—not a universal recipe.",
      sourceNote: "Schwan & Wheals 2004 · ICCO post-harvest",
      beats: [
        {
          action: "Raise the fermentation stack temperature",
          title: "Heat accumulates",
          body: "Fermentation masses can approach 45–50 °C, but the peak depends on process, batch, and practice.",
        },
        {
          action: "Turn the stack and reveal gas exchange",
          title: "Turning opens the mass",
          body: "Mixing raises oxygen access and supports later bacterial activity while acids and heat move into the beans.",
        },
      ],
    },
    zh: {
      nav: "热堆",
      eyebrow: "03 · 翻堆与升温",
      title: "一次翻堆，改变整个发酵堆",
      subtitle: "通气、酸与热同步变化。温度是工艺信号，不是一条通用配方。",
      sourceNote: "Schwan 与 Wheals，2004 · ICCO 采后处理",
      beats: [
        {
          action: "抬高发酵堆温度",
          title: "热量累积",
          body: "发酵堆可能接近 45–50°C，但峰值取决于工艺、批次与操作。",
        },
        {
          action: "翻动发酵堆并揭示气体交换",
          title: "翻堆打开内部",
          body: "混合提高氧气可达性，支持后期细菌活动；酸与热也向豆粒内部移动。",
        },
      ],
    },
  },
  4: {
    en: {
      nav: "Cut bean",
      eyebrow: "04 · BEAN CUTAWAY",
      title: "The bean changes from within",
      subtitle:
        "Acids and heat stop the embryo; lost cellular separation lets native enzymes and reactions build roast-ready precursors.",
      sourceNote: "De Vuyst & Leroy 2020 · Barišić et al. 2019",
      beats: [
        {
          action: "Open a living seed cutaway with intact compartments",
          title: "A living seed, compartmentalized",
          body: "Proteins, sugars, and polyphenols begin in separated cellular spaces.",
        },
        {
          action: "Drive acid and heat through the cotyledon",
          title: "Acid and heat cross inward",
          body: "Ethanol, acetic acid, and heat penetrate the bean and stop the embryo.",
        },
        {
          action: "Break cellular separation after embryo death",
          title: "Embryo death changes the cells",
          body: "Membranes and subcellular structure lose separation; enzymes meet new substrates.",
        },
        {
          action: "Plate the roast-ready precursor groups",
          title: "Precursors emerge",
          body: "Peptides, amino acids, and reducing sugars become material for later flavor-forming reactions.",
        },
      ],
    },
    zh: {
      nav: "剖豆",
      eyebrow: "04 · 豆粒剖面",
      title: "变化发生在豆粒内部",
      subtitle: "酸与热使胚死亡；细胞隔离被打破后，豆内酶和反应开始生成烘焙所需前体。",
      sourceNote: "De Vuyst 与 Leroy，2020 · Barišić 等，2019",
      beats: [
        {
          action: "打开细胞分区完整的活种子剖面",
          title: "活种子，彼此隔离的分区",
          body: "蛋白质、糖和多酚起初位于分隔的细胞空间中。",
        },
        {
          action: "让酸与热进入子叶",
          title: "酸与热向内穿透",
          body: "乙醇、醋酸和热量进入豆粒，使胚停止生命活动。",
        },
        {
          action: "胚死亡后打破细胞隔离",
          title: "胚死亡，细胞状态改变",
          body: "细胞膜和亚细胞结构失去隔离，酶开始接触新的底物。",
        },
        {
          action: "摆出可供烘焙反应使用的前体",
          title: "前体出现",
          body: "肽、氨基酸和还原糖，成为后续风味反应的原料。",
        },
      ],
    },
  },
  5: {
    en: {
      nav: "Aroma",
      eyebrow: "05 · DRY & ROAST",
      title: "Fermentation sets potential; roasting develops it",
      subtitle:
        "Drying stabilizes fermented beans. During roasting, Maillard and other reactions continue building aroma from those precursors.",
      sourceNote: "ICCO Processing Cocoa · Barišić et al. 2019",
      beats: [
        {
          action: "Place dried beans beside an aroma wheel and hand the process to roasting",
          title: "Not the finish line",
          body: "Final flavor reflects origin, fermentation, drying, and the chosen roast—not fermentation alone.",
        },
      ],
    },
    zh: {
      nav: "香气",
      eyebrow: "05 · 干燥与烘焙",
      title: "发酵建立潜力，烘焙继续发展",
      subtitle: "干燥让发酵豆稳定下来；烘焙时，Maillard 等反应继续把前体转化为香气。",
      sourceNote: "ICCO《可可加工》· Barišić 等，2019",
      beats: [
        {
          action: "把干豆与香气轮并置，并把过程交给烘焙",
          title: "发酵不是终点",
          body: "最终风味共同取决于产地、发酵、干燥和烘焙，而非只靠发酵。",
        },
      ],
    },
  },
};

function getSceneCopy(sceneId: number, language: Lang): SceneCopy {
  return CONTENT[sceneId]?.[language] ?? CONTENT[1][language];
}

const COMPOSITIONS = {
  1: "ingredient-stage",
  2: "microbial-zones",
  3: "heat-stack",
  4: "bean-cutaway",
  5: "aroma-plate",
} as const;

const LABELS = {
  en: {
    scene1: {
      board: "OPEN POD · WET BEANS",
      pulp: "sweet, acidic pulp",
      seed: "living seed",
      state: "AROMA STATE",
      stateValue: "not yet roasted",
    },
    scene2: {
      bed: "PULP-BEAN MASS",
      lowOxygen: "oxygen-poor start",
      yeast: "YEASTS",
      yeastFlow: "pulp sugars → ethanol",
      lab: "LAB",
      labFlow: "sugars + citrate → lactic acid + others",
      aab: "AAB",
      aabFlow: "ethanol + O₂ → acetic acid + heat",
      gate: "pulp drains · turning opens O₂",
      qualifier: "typical relay · exact timing varies",
    },
    scene3: {
      box: "FERMENTATION BOX",
      turn: "TURN",
      readings: "THREE READINGS",
      temperature: "TEMPERATURE",
      temperatureValue: "45–50 °C",
      temperatureNote: "process-dependent peak",
      oxygen: "OXYGEN ACCESS",
      oxygenValue: "↑ after turning",
      acids: "ACIDS",
      acidsValue: "moving inward",
      foot: "Box, heap, mass, variety, weather, and practice change the curve.",
    },
    scene4: {
      living: "living embryo",
      stopped: "embryo stopped",
      acid: "ACID",
      heat: "HEAT",
      death: "Embryo death → cellular separation breaks",
      enzymes: "native enzymes meet new substrates",
      precursorTitle: "ROAST-READY PRECURSORS",
      precursors: ["Peptides", "amino acids", "reducing sugars"],
      boundary: "precursors—not finished aroma",
    },
    scene5: {
      dry: "DRIED FERMENTED BEANS",
      handoff: "ROASTING",
      reaction: "Maillard + other roast reactions",
      wheel: "AROMA POTENTIAL",
      notes: ["cocoa", "roasted", "nutty", "fruity", "floral"],
      boundary: "Fermentation establishes the palette; roasting chooses how it develops.",
    },
  },
  zh: {
    scene1: {
      board: "打开果荚 · 湿豆",
      pulp: "甜酸果肉",
      seed: "活种子",
      state: "香气状态",
      stateValue: "尚未烘焙",
    },
    scene2: {
      bed: "果肉—豆粒发酵堆",
      lowOxygen: "起初缺氧",
      yeast: "酵母",
      yeastFlow: "果肉糖 → 乙醇",
      lab: "乳酸菌 LAB",
      labFlow: "糖 + 柠檬酸 → 乳酸等",
      aab: "醋酸菌 AAB",
      aabFlow: "乙醇 + O₂ → 醋酸 + 热",
      gate: "果肉排液 · 翻堆引入 O₂",
      qualifier: "典型接力 · 具体时序会变化",
    },
    scene3: {
      box: "发酵箱",
      turn: "翻堆",
      readings: "三项读数",
      temperature: "温度",
      temperatureValue: "45–50°C",
      temperatureNote: "工艺依赖峰值",
      oxygen: "氧气可达性",
      oxygenValue: "翻堆后 ↑",
      acids: "酸",
      acidsValue: "向内移动",
      foot: "发酵箱或堆、批量、品种、天气与操作都会改变曲线。",
    },
    scene4: {
      living: "活胚",
      stopped: "胚已停止",
      acid: "酸",
      heat: "热",
      death: "胚死亡 → 细胞隔离被打破",
      enzymes: "豆内酶接触新的底物",
      precursorTitle: "可供烘焙反应使用的前体",
      precursors: ["肽", "氨基酸", "还原糖"],
      boundary: "它们是前体，并非完成的香气",
    },
    scene5: {
      dry: "干燥发酵豆",
      handoff: "烘焙",
      reaction: "Maillard 与其他烘焙反应",
      wheel: "香气潜力",
      notes: ["可可", "烘烤", "坚果", "果香", "花香"],
      boundary: "发酵建立调色盘；烘焙决定它如何展开。",
    },
  },
} as const;

function clampScene(scene: number): number {
  return Math.min(5, Math.max(1, Math.trunc(scene)));
}

function clampBeat(beat: number, copy: SceneCopy): number {
  return Math.min(copy.beats.length - 1, Math.max(0, Math.trunc(beat)));
}

function cx(...classNames: Array<string | false | undefined>): string {
  return classNames.filter(Boolean).join(" ");
}

function CacaoPod({ language }: { language: Lang }) {
  const labels = LABELS[language].scene1;
  return (
    <div className={styles.podStage} data-beat-layout-item="true">
      <span className={styles.boardStamp}>{labels.board}</span>
      <svg className={styles.podDrawing} viewBox="0 0 760 430" aria-label={labels.board}>
        <defs>
          <linearGradient id="cocoa-pod-shell" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#c95f2d" />
            <stop offset="0.52" stopColor="#8e351f" />
            <stop offset="1" stopColor="#5f2419" />
          </linearGradient>
          <linearGradient id="cocoa-pulp" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fff8db" />
            <stop offset="1" stopColor="#e8cfa3" />
          </linearGradient>
        </defs>
        <path
          className={styles.podHalf}
          d="M70 228C92 105 222 43 358 91C312 191 222 267 93 303C74 283 65 257 70 228Z"
          fill="url(#cocoa-pod-shell)"
        />
        <path
          className={styles.podRidge}
          d="M90 247C181 213 258 163 330 101M91 274C203 242 277 190 344 112M87 218C164 186 237 143 309 96"
        />
        <path
          className={styles.pulpBed}
          d="M389 86C526 42 660 111 689 226C710 309 611 370 478 339C402 321 355 276 360 203C363 153 373 113 389 86Z"
          fill="url(#cocoa-pulp)"
        />
        {[
          [445, 135, -18],
          [527, 126, 12],
          [605, 157, 24],
          [419, 214, 8],
          [507, 207, -12],
          [602, 237, 18],
          [448, 292, -20],
          [545, 292, 10],
        ].map(([cxValue, cyValue, rotate], index) => (
          <g key={index} transform={`translate(${cxValue} ${cyValue}) rotate(${rotate})`}>
            <ellipse className={styles.pulpHalo} rx="42" ry="31" />
            <ellipse className={styles.wetBean} rx="27" ry="18" />
            <path className={styles.beanSeam} d="M-18 1Q0-10 18 1" />
          </g>
        ))}
      </svg>
      <span className={cx(styles.objectLabel, styles.pulpLabel)}>{labels.pulp}</span>
      <span className={cx(styles.objectLabel, styles.seedLabel)}>{labels.seed}</span>
      <div className={styles.aromaState} data-beat-layout-item="true">
        <span>{labels.state}</span>
        <strong>{labels.stateValue}</strong>
      </div>
    </div>
  );
}

function MicrobialZones({ language, beat }: { language: Lang; beat: number }) {
  const labels = LABELS[language].scene2;
  const zones = [
    { key: "yeast", name: labels.yeast, flow: labels.yeastFlow, visible: beat >= 1 },
    { key: "lab", name: labels.lab, flow: labels.labFlow, visible: beat >= 1 },
    { key: "aab", name: labels.aab, flow: labels.aabFlow, visible: beat >= 2 },
  ];
  return (
    <div className={styles.microbialBoard} data-beat-layout-item="true">
      <div className={styles.pulpMass} data-beat-layout-item="true">
        <span className={styles.stationStamp}>{labels.bed}</span>
        <div className={styles.massBeans} aria-hidden="true">
          {Array.from({ length: 14 }, (_, index) => (
            <span
              key={index}
              style={{ ["--bean-rotate" as string]: `${(index - 7) * 2.5}deg` }}
            />
          ))}
        </div>
        <span className={styles.lowOxygen}>{labels.lowOxygen}</span>
      </div>
      <div className={styles.zoneRail} data-beat-layout-item="true">
        {zones.map((zone, index) => (
          <div
            key={zone.key}
            className={cx(styles.microbialZone, styles[`zone${index + 1}`])}
            data-zone={zone.key}
            data-revealed={zone.visible ? "true" : "false"}
            data-beat-layout-item="true"
          >
            <span className={styles.zoneNumber}>0{index + 1}</span>
            <strong>{zone.name}</strong>
            <span className={styles.zoneFlow}>{zone.flow}</span>
          </div>
        ))}
      </div>
      <div
        className={styles.oxygenGate}
        data-revealed={beat >= 2 ? "true" : "false"}
        data-beat-layout-item="true"
      >
        <span className={styles.airArrow} aria-hidden="true">O₂</span>
        <span>{labels.gate}</span>
      </div>
      <span className={styles.relayQualifier}>{labels.qualifier}</span>
    </div>
  );
}

function HeatStack({ language, beat }: { language: Lang; beat: number }) {
  const labels = LABELS[language].scene3;
  return (
    <div className={styles.heatWorkbench} data-beat-layout-item="true">
      <div className={styles.fermentationBox} data-beat-layout-item="true">
        <span className={styles.stationStamp}>{labels.box}</span>
        <div className={styles.boxRim} />
        <div className={styles.beanStack} aria-hidden="true">
          {Array.from({ length: 24 }, (_, index) => (
            <span
              key={index}
              style={{ ["--bean-rotate" as string]: `${(index - 12) * 1.4}deg` }}
            />
          ))}
        </div>
        <div className={styles.heatCore} aria-hidden="true" />
        <div
          className={styles.turningPaddle}
          data-revealed={beat >= 1 ? "true" : "false"}
        >
          <span>{labels.turn}</span>
        </div>
        <div
          className={styles.exchangeArrows}
          data-revealed={beat >= 1 ? "true" : "false"}
          aria-hidden="true"
        >
          <span>O₂</span>
          <span>CO₂</span>
          <span>H₂O</span>
        </div>
      </div>
      <div className={styles.readingPanel} data-beat-layout-item="true">
        <span className={styles.readingTitle}>{labels.readings}</span>
        <div className={styles.reading} data-beat-layout-item="true">
          <span>{labels.temperature}</span>
          <strong>{labels.temperatureValue}</strong>
          <small>{labels.temperatureNote}</small>
        </div>
        <div
          className={styles.reading}
          data-revealed={beat >= 1 ? "true" : "false"}
          data-beat-layout-item="true"
        >
          <span>{labels.oxygen}</span>
          <strong>{labels.oxygenValue}</strong>
        </div>
        <div
          className={styles.reading}
          data-revealed={beat >= 1 ? "true" : "false"}
          data-beat-layout-item="true"
        >
          <span>{labels.acids}</span>
          <strong>{labels.acidsValue}</strong>
        </div>
        <p className={styles.processFoot}>{labels.foot}</p>
      </div>
    </div>
  );
}

function BeanCutaway({ language, beat }: { language: Lang; beat: number }) {
  const labels = LABELS[language].scene4;
  return (
    <div
      className={styles.cutawayWorkbench}
      data-peak-cutaway="true"
      data-beat-layout-item="true"
    >
      <div className={styles.cutawayCanvas} data-beat-layout-item="true">
        <svg className={styles.beanCutaway} viewBox="0 0 760 610" aria-label={labels.death}>
          <defs>
            <radialGradient id="cocoa-cotyledon" cx="42%" cy="35%" r="68%">
              <stop offset="0" stopColor="#d89052" />
              <stop offset="0.7" stopColor="#a84e2f" />
              <stop offset="1" stopColor="#6b2c22" />
            </radialGradient>
          </defs>
          <path
            className={styles.beanShell}
            d="M384 52C549 56 677 189 663 363C650 521 520 582 370 558C207 533 86 422 102 266C118 115 233 47 384 52Z"
          />
          <path
            className={styles.cotyledon}
            d="M376 91C511 94 614 207 603 348C593 469 492 523 375 506C245 487 151 397 164 278C177 159 262 87 376 91Z"
            fill="url(#cocoa-cotyledon)"
          />
          <path className={styles.cotyledonSeam} d="M377 104C341 205 344 387 376 495" />
          <path
            className={styles.embryo}
            data-revealed={beat < 2 ? "true" : "false"}
            d="M352 291C372 260 407 253 427 278C402 290 389 318 382 350C364 336 346 320 352 291Z"
          />
          <g className={styles.cellGrid} data-revealed={beat < 2 ? "true" : "false"}>
            {[
              [250, 196], [337, 179], [437, 188], [513, 246], [244, 300],
              [462, 326], [267, 410], [365, 430], [477, 420],
            ].map(([x, y], index) => (
              <circle key={index} cx={x} cy={y} r="38" />
            ))}
          </g>
          <g className={styles.cellFragments} data-revealed={beat >= 2 ? "true" : "false"}>
            <path d="M218 181L279 148 309 213 252 239Z" />
            <path d="M326 143L409 158 391 238 319 220Z" />
            <path d="M426 168L520 210 475 271 411 228Z" />
            <path d="M205 283L297 259 321 345 227 366Z" />
            <path d="M419 283L527 307 494 391 407 362Z" />
            <path d="M255 381L356 352 389 451 292 475Z" />
            <path d="M385 379L505 397 455 478 369 451Z" />
          </g>
        </svg>
        <span className={styles.embryoLabel}>
          {beat < 2 ? labels.living : labels.stopped}
        </span>
        <div
          className={cx(styles.penetrationLabel, styles.acidLabel)}
          data-revealed={beat >= 1 ? "true" : "false"}
        >
          {labels.acid}
        </div>
        <div
          className={cx(styles.penetrationLabel, styles.heatLabel)}
          data-revealed={beat >= 1 ? "true" : "false"}
        >
          {labels.heat}
        </div>
        <div
          className={styles.cellChangeLabel}
          data-revealed={beat >= 2 ? "true" : "false"}
        >
          <strong>{labels.death}</strong>
          <span>{labels.enzymes}</span>
        </div>
      </div>
      <div
        className={styles.precursorTray}
        data-revealed={beat >= 3 ? "true" : "false"}
        data-beat-layout-item="true"
      >
        <span className={styles.precursorTitle}>{labels.precursorTitle}</span>
        <div className={styles.precursorCells}>
          {labels.precursors.map((precursor, index) => (
            <span key={precursor} data-precursor={index + 1}>{precursor}</span>
          ))}
        </div>
        <small>{labels.boundary}</small>
      </div>
    </div>
  );
}

function AromaPlate({ language }: { language: Lang }) {
  const labels = LABELS[language].scene5;
  return (
    <div className={styles.aromaWorkbench} data-beat-layout-item="true">
      <div className={styles.driedBeanPlate} data-beat-layout-item="true">
        <span className={styles.stationStamp}>{labels.dry}</span>
        <div className={styles.driedBeans} aria-hidden="true">
          {Array.from({ length: 9 }, (_, index) => (
            <span
              key={index}
              style={{ ["--bean-rotate" as string]: `${(index - 4) * 3.2}deg` }}
            />
          ))}
        </div>
      </div>
      <div className={styles.roastHandoff} data-beat-layout-item="true">
        <span>{labels.handoff}</span>
        <strong>{labels.reaction}</strong>
        <i aria-hidden="true">→</i>
      </div>
      <div className={styles.aromaWheel} data-beat-layout-item="true">
        <div className={styles.wheelCore}>{labels.wheel}</div>
        {labels.notes.map((note, index) => (
          <span key={note} style={{ ["--note-index" as string]: index }}>{note}</span>
        ))}
      </div>
      <p className={styles.aromaBoundary}>{labels.boundary}</p>
    </div>
  );
}

function SceneVisual({
  sceneId,
  language,
  beat,
}: {
  sceneId: number;
  language: Lang;
  beat: number;
}) {
  if (sceneId === 1) return <CacaoPod language={language} />;
  if (sceneId === 2) return <MicrobialZones language={language} beat={beat} />;
  if (sceneId === 3) return <HeatStack language={language} beat={beat} />;
  if (sceneId === 4) return <BeanCutaway language={language} beat={beat} />;
  return <AromaPlate language={language} />;
}

function ScenePanel({
  sceneId,
  beat,
  language,
  isActive,
}: {
  sceneId: number;
  beat: number;
  language: Lang;
  isActive: boolean;
}) {
  const copy = getSceneCopy(sceneId, language);
  const safeBeat = clampBeat(beat, copy);
  const currentBeat = copy.beats[safeBeat];
  return (
    <section
      className={styles.scene}
      lang={language === "zh" ? "zh-CN" : "en"}
      data-cocoa-scene={sceneId}
      data-composition={COMPOSITIONS[sceneId as keyof typeof COMPOSITIONS]}
      data-active={isActive ? "true" : "false"}
    >
      <header className={styles.sceneHeader} data-beat-layout-item="true">
        <div className={styles.eyebrowRow}>
          <span className={styles.eyebrow}>{copy.eyebrow}</span>
          <div className={styles.beatPips} aria-label={currentBeat.action}>
            {copy.beats.map((beatCopy, index) => (
              <span
                key={beatCopy.title}
                data-current={index === safeBeat ? "true" : "false"}
                data-complete={index <= safeBeat ? "true" : "false"}
              />
            ))}
          </div>
        </div>
        <h1>{copy.title}</h1>
        <p className={styles.subtitle}>{copy.subtitle}</p>
      </header>
      <div className={styles.visualArea} data-beat-layout-item="true">
        <SceneVisual sceneId={sceneId} language={language} beat={safeBeat} />
      </div>
      <div className={styles.beatCaption} data-beat-layout-item="true">
        <span>{String(safeBeat + 1).padStart(2, "0")}</span>
        <div>
          <strong>{currentBeat.title}</strong>
          <p>{currentBeat.body}</p>
        </div>
      </div>
      <p className={styles.sourceNote} data-beat-layout-item="true">{copy.sourceNote}</p>
    </section>
  );
}

function CocoaSampleTray({
  scene,
  language,
  onNavigate,
}: {
  scene: number;
  language: Lang;
  onNavigate?: BespokeStyleProps["onNavigate"];
}) {
  const [expanded, setExpanded] = useState(false);
  const [pinned, setPinned] = useState(false);

  const stopPointer = (event: React.PointerEvent<HTMLElement>) => {
    event.stopPropagation();
  };

  const handleToggle = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    const nextPinned = !pinned;
    setPinned(nextPinned);
    setExpanded(nextPinned);
  };

  const handleBlur = (event: React.FocusEvent<HTMLElement>) => {
    if (
      !pinned &&
      !event.currentTarget.contains(event.relatedTarget as Node | null)
    ) {
      setExpanded(false);
    }
  };

  const handleSampleKey = (
    event: React.KeyboardEvent<HTMLButtonElement>,
    sceneId: number,
  ) => {
    event.stopPropagation();
    let target: number | null = null;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      target = Math.min(5, sceneId + 1);
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      target = Math.max(1, sceneId - 1);
    } else if (event.key === "Home") {
      target = 1;
    } else if (event.key === "End") {
      target = 5;
    } else if (event.key === "Escape") {
      event.preventDefault();
      setPinned(false);
      setExpanded(false);
      return;
    }

    if (target !== null && target !== sceneId) {
      event.preventDefault();
      onNavigate?.(target, 0);
    }
  };

  return (
    <nav
      className={styles.sampleTray}
      aria-label={language === "zh" ? "可可样豆托盘场景导航" : "Cocoa sample tray scene navigation"}
      data-topic-navigation="true"
      data-navigation-geometry="object-controller"
      data-navigation-carrier="cocoa-sample-tray"
      data-navigation-invocation="auto-hide"
      data-navigation-feedback="geometry-reflow"
      data-expanded={expanded ? "true" : "false"}
      data-pinned={pinned ? "true" : "false"}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => {
        if (!pinned) setExpanded(false);
      }}
      onFocusCapture={() => setExpanded(true)}
      onBlurCapture={handleBlur}
      onClick={(event) => event.stopPropagation()}
      onPointerDown={stopPointer}
      onKeyDown={(event) => event.stopPropagation()}
    >
      <button
        className={styles.trayToggle}
        type="button"
        aria-expanded={expanded}
        aria-label={
          expanded
            ? language === "zh" ? "收起可可样豆托盘" : "Collapse cocoa sample tray"
            : language === "zh" ? "展开可可样豆托盘" : "Expand cocoa sample tray"
        }
        onClick={handleToggle}
      >
        <span className={styles.trayHandle} aria-hidden="true" />
        <span className={styles.toggleHint}>
          {language === "zh" ? "样豆" : "samples"}
        </span>
      </button>
      <div className={styles.sampleCells}>
        {SCENE_IDS.map((sceneId) => {
          const copy = getSceneCopy(sceneId, language);
          const active = sceneId === scene;
          return (
            <button
              key={sceneId}
              className={cx(styles.sampleCell, active && styles.sampleCellActive)}
              type="button"
              data-sample-scene={sceneId}
              data-active={active ? "true" : "false"}
              aria-current={active ? "step" : undefined}
              aria-label={
                language === "zh"
                  ? `样豆 ${sceneId}：${copy.nav}`
                  : `Sample ${sceneId}: ${copy.nav}`
              }
              onClick={() => onNavigate?.(sceneId, 0)}
              onKeyDown={(event) => handleSampleKey(event, sceneId)}
            >
              <span className={styles.sampleBean} aria-hidden="true">
                <i />
              </span>
              <span className={styles.sampleIndex}>0{sceneId}</span>
              <span className={styles.sampleLabel}>{copy.nav}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

export function getMetadata(language: Lang): StyleMetadata {
  return {
    id: "kitchen-prep-station",
    band: "balanced-hybrid",
    name: language === "zh" ? "厨房备料台" : "Kitchen Prep Station",
    theme: language === "zh" ? "巧克力之前的发酵" : "Fermentation Before Chocolate",
    densityLabel: language === "zh" ? "图解叙事" : "Diagram explainer",
    heroScene: 4,
    colors: { bg: "#f3d5a1", ink: "#3b2415", panel: "#fff1cf" },
    typography: { header: "Avenir Next 700", body: "Avenir Next 500" },
    tags: [
      "kitchen",
      "prep",
      "cocoa",
      "fermentation",
      "materials",
      "diagram",
      "warm",
      "tactile",
      "food-science",
      "path-tracing",
    ],
    fonts: ["Avenir Next", "cjk:PingFang SC"],
    scenes: SCENE_IDS.map((id) => {
      const copy = getSceneCopy(id, language);
      return {
        id,
        title: copy.nav,
        beats: copy.beats.map((beatCopy, beatId) => ({
          id: beatId,
          action: beatCopy.action,
          title: beatCopy.title,
          body: beatCopy.body,
        })),
      };
    }),
  };
}

export default function CocoaFermentation({
  scene,
  beat,
  language,
  isThumbnail,
  reducedMotion,
  onNavigate,
}: BespokeStyleProps) {
  const activeScene = clampScene(scene);
  const activeCopy = getSceneCopy(activeScene, language);
  const activeBeat = clampBeat(beat, activeCopy);
  const motionOff = reducedMotion || isThumbnail;
  return (
    <div
      className={styles.root}
      data-testid="cocoa-fermentation-root"
      data-language={language}
      data-motion-off={motionOff ? "true" : undefined}
      data-thumbnail={isThumbnail ? "true" : undefined}
    >
      <SpatialSceneTrack
        scene={activeScene}
        beat={activeBeat}
        transitionKind="paper-fold"
        transitionMap={COCOA_FERMENTATION_TRANSITION_SCORE}
        transitionDurationMs={760}
        reducedMotion={motionOff}
        beatLayoutModes={{ 2: "reserved", 3: "reserved", 4: "reserved" }}
        className={styles.track}
        renderScene={(sceneId, sceneBeat, isActive) => (
          <ScenePanel
            sceneId={sceneId}
            beat={sceneBeat}
            language={language}
            isActive={isActive}
          />
        )}
      />
      {!isThumbnail && (
        <CocoaSampleTray
          scene={activeScene}
          language={language}
          onNavigate={onNavigate}
        />
      )}
    </div>
  );
}

export const cocoaFermentationTopic = defineStyleTopic({
  id: "cocoa-fermentation",
  topic: { en: "Cocoa Fermentation", zh: "可可发酵" },
  model: "GPT-5.5",
  component: CocoaFermentation,
  getMetadata,
  navigation: {
    geometry: "object-controller",
    carrier: "cocoa-sample-tray",
    invocation: "auto-hide",
    feedback: "geometry-reflow",
  },
  sources: COCOA_FERMENTATION_SOURCES,
  transitionScore: COCOA_FERMENTATION_TRANSITION_SCORE,
});

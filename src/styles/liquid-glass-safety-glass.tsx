import { useCallback, useEffect, useRef, useState } from "react";
import type {
  CSSProperties,
  KeyboardEvent as ReactKeyboardEvent,
  PointerEvent as ReactPointerEvent,
} from "react";
import type {
  BespokeStyleProps,
  StyleMetadata,
  TopicSource,
  TopicTransitionScore,
} from "../types";
import SpatialSceneTrack, {
  type BeatLayoutMode,
  type SceneTransitionMap,
} from "./SpatialSceneTrack";
import { defineStyleTopic } from "./topic";
import styles from "./liquid-glass-safety-glass.module.css";

type Language = BespokeStyleProps["language"];
type SceneId = 1 | 2 | 3 | 4 | 5;

interface BeatCopy {
  action: string;
  title: string;
  body: string;
}

interface SceneCopy {
  register: string;
  nav: string;
  title: string;
  subtitle: string;
  evidence: string;
  note: string;
  beats: BeatCopy[];
}

interface SceneData {
  id: SceneId;
  composition: string;
  copy: Record<Language, SceneCopy>;
}

const SCENE_IDS: SceneId[] = [1, 2, 3, 4, 5];

const BEAT_LAYOUT_MODES: Partial<Record<number, BeatLayoutMode>> = {
  2: "reserved",
  3: "reserved",
  4: "reserved",
};

export const SAFETY_GLASS_TRANSITION_SCORE = {
  "1->2": "focus-swap",
  "2->3": "zoom-through",
  "3->4": "split-merge",
  "4->5": "focus-swap",
} as const satisfies Readonly<TopicTransitionScore>;

const TRANSITION_MAP: SceneTransitionMap = SAFETY_GLASS_TRANSITION_SCORE;

export const SAFETY_GLASS_SOURCES = [
  {
    authority: "U.S. National Highway Traffic Safety Administration",
    title: "FMVSS interpretation nht76-4.40 — tempered versus laminated windshields",
    citation: "NHTSA, interpretation nht76-4.40, March 10, 1976.",
    url: "https://www.nhtsa.gov/interpretations/nht76-440",
    supports:
      "Supports the automotive-windshield distinction: a cracked laminate retains material through its plastic interlayer and can deflect, while tempered windshield glass does not provide the same post-breakage retention.",
    boundary:
      "This is a historical U.S. automotive-windshield interpretation, not a universal product specification or a claim that every laminate, loading case, or modern interlayer performs identically.",
  },
  {
    authority: "Whole Building Design Guide / National Institute of Building Sciences",
    title: "Retrofitting Existing Buildings to Resist Explosive Threats",
    citation: "WBDG, section B: Laminated Glass.",
    url: "https://www.wbdg.org/resources/retrofitting-existing-buildings-resist-explosive-threats",
    supports:
      "Supports the common build-up of two or more glass pieces bonded by a tough polymer interlayer and the tendency of fractured pieces to adhere to that interlayer rather than fall freely.",
    boundary:
      "The cited page addresses blast-hazard mitigation in buildings; this Topic borrows only its material description and does not offer blast design, installation, framing, or sealant guidance.",
  },
  {
    authority: "U.S. Consumer Product Safety Commission",
    title: "Final Rule to Amend the Safety Standard for Architectural Glazing Materials",
    citation: "CPSC, 16 C.F.R. Part 1201 briefing package and final-rule draft, 2016.",
    url: "https://www.cpsc.gov/s3fs-public/FinalRuleAmendSafetyStandardArchitecturalGlazingMaterials.pdf",
    supports:
      "Supports that architectural safety glazing is performance-tested to reduce injury from failure or fracture and that laminating and tempering are distinct strengthening or safety-glazing processes.",
    boundary:
      "The rule covers specified architectural products and test methods; this explanatory artwork is not a compliance determination, code summary, product selection guide, or substitute for the applicable standard.",
  },
  {
    authority: "National Glass Association",
    title: "GANA Glazing Manual, 2022 edition",
    citation: "National Glass Association, GANA Glazing Manual, Laminated Glazing Materials, 2022.",
    url: "https://www.glass.org/sites/default/files/2023-01/GANA_Glazing_Manual_2022_pw.pdf",
    supports:
      "Supports the definition of laminated glass as two or more glass lites permanently bonded with one or more interlayers and identifies post-breakage support and fragment retention as a central characteristic.",
    boundary:
      "The manual describes several glass, plastic, resin, PVB, and ionomer combinations; the drawn three-layer PVB section is one conceptual example and is explicitly not to scale.",
  },
  {
    authority: "Kuraray Co., Ltd.",
    title: "Notice Concerning Start of Full Operations at Expanded PVB Film Facility in Europe",
    citation: "Kuraray, September 27, 2007.",
    url: "https://www.kuraray.com/global-en/news/2007/0927/",
    supports:
      "Supports PVB film as a transparent, adhesive, membrane-like interlayer used in laminated glass to reduce flying fragments under heavy impact in automotive and architectural applications.",
    boundary:
      "This manufacturer source supports the qualitative PVB mechanism only; no proprietary performance number, thickness, construction detail, or suitability recommendation is reproduced here.",
  },
] as const satisfies readonly (TopicSource & { boundary: string })[];

const SCENES: SceneData[] = [
  {
    id: 1,
    composition: "intact-pane",
    copy: {
      en: {
        register: "MATERIAL / 01",
        nav: "Intact pane",
        title: "Before the crack, read the edge.",
        subtitle:
          "A clear pane can conceal a bonded three-layer section: glass, polymer interlayer, glass.",
        evidence: "Conceptual PVB laminate section [S2 · S4]",
        note: "One common build-up; interlayers and assemblies vary.",
        beats: [
          {
            action: "Suspend one intact pane and expose its three-layer edge.",
            title: "The layer is the clue",
            body: "The safety mechanism is almost invisible before impact.",
          },
        ],
      },
      zh: {
        register: "材料 / 01",
        nav: "完整玻璃",
        title: "裂纹出现前，先看边缘。",
        subtitle: "透明玻璃可以隐藏三层粘结构造：玻璃、聚合物中间层、玻璃。",
        evidence: "PVB 夹层概念剖面 [S2 · S4]",
        note: "这是常见构造之一；中间层与组合方式并不唯一。",
        beats: [
          {
            action: "悬起一块完整玻璃，并显露三层边缘。",
            title: "层间才是线索",
            body: "冲击发生前，安全机制几乎看不见。",
          },
        ],
      },
    },
  },
  {
    id: 2,
    composition: "layer-explode",
    copy: {
      en: {
        register: "LAMINAE / 02",
        nav: "Layer stack",
        title: "Three layers behave as one.",
        subtitle:
          "Two glass plies are bonded to a polymer interlayer. PVB is common, but not the only interlayer family.",
        evidence: "Permanent bond; conceptual separation [S2 · S4]",
        note: "Exploded spacing is explanatory, not physical thickness.",
        beats: [
          {
            action: "Resolve the outer glass plies around the bonded core.",
            title: "Glass / interlayer / glass",
            body: "The section reads as a sandwich before it opens in space.",
          },
          {
            action: "Separate the three layers along the depth axis.",
            title: "The middle layer earns the depth",
            body: "Its bond supplies a post-breakage path between fragments.",
          },
        ],
      },
      zh: {
        register: "层片 / 02",
        nav: "分层构造",
        title: "三层，共同工作。",
        subtitle: "两片玻璃与聚合物中间层永久粘结。PVB 很常见，但不是唯一的中间层类型。",
        evidence: "永久粘结；概念性分离 [S2 · S4]",
        note: "分层间距只用于解释，不代表真实厚度。",
        beats: [
          {
            action: "解析包围粘结核心的两片外层玻璃。",
            title: "玻璃 / 中间层 / 玻璃",
            body: "沿空间展开前，剖面先读成一体。",
          },
          {
            action: "沿深度轴分开三层。",
            title: "中间层让深度具有意义",
            body: "粘结为破裂后的碎片建立连接路径。",
          },
        ],
      },
    },
  },
  {
    id: 3,
    composition: "impact-field",
    copy: {
      en: {
        register: "IMPACT / 03",
        nav: "Impact field",
        title: "The pane cracks. The laminate keeps a path.",
        subtitle:
          "Fracture can spread quickly through the brittle plies while the bonded interlayer continues to connect many pieces.",
        evidence: "Qualitative impact sequence [S1 · S2 · S5]",
        note: "Only this scene uses the high-speed fracture register.",
        beats: [
          {
            action: "Mark one impact contact on the intact field.",
            title: "Contact",
            body: "A concentrated load arrives at the glass surface.",
          },
          {
            action: "Release the first radial cracks from the contact point.",
            title: "Radial fracture",
            body: "Primary cracks race away from the impact center.",
          },
          {
            action: "Branch the fracture network across both brittle plies.",
            title: "Branching field",
            body: "The pane divides into many irregular pieces.",
          },
          {
            action: "Hold the completed fracture field against the interlayer.",
            title: "Retained field",
            body: "The bond keeps many fragments attached after cracking.",
          },
        ],
      },
      zh: {
        register: "冲击 / 03",
        nav: "冲击裂纹",
        title: "玻璃开裂，夹层仍保留连接。",
        subtitle: "裂纹会在脆性玻璃层中快速扩展，而粘结中间层继续连接许多碎片。",
        evidence: "定性冲击序列 [S1 · S2 · S5]",
        note: "只有这一幕采用高速破裂节奏。",
        beats: [
          {
            action: "在完整玻璃面上标记单一冲击点。",
            title: "接触",
            body: "集中载荷抵达玻璃表面。",
          },
          {
            action: "从冲击点释放第一组放射裂纹。",
            title: "放射裂纹",
            body: "主裂纹迅速离开冲击中心。",
          },
          {
            action: "让裂纹网络在脆性玻璃层中继续分支。",
            title: "分支裂纹场",
            body: "玻璃面被分割成许多不规则碎片。",
          },
          {
            action: "让完整裂纹场停留在中间层上。",
            title: "碎片被保持",
            body: "开裂后，粘结仍让许多碎片保持附着。",
          },
        ],
      },
    },
  },
  {
    id: 4,
    composition: "adhesion-closeup",
    copy: {
      en: {
        register: "INTERLAYER / 04",
        nav: "Bond close-up",
        title: "Bonded, then deflected.",
        subtitle:
          "The polymer layer deforms with the cracked plies, helping retain fragments and dissipate part of the impact energy.",
        evidence: "Qualitative membrane response [S1 · S5]",
        note: "It stays bonded; it does not heal the broken glass.",
        beats: [
          {
            action: "Magnify cracked glass pieces adhering to the polymer surface.",
            title: "Stays bonded",
            body: "Adhesion keeps fragments coupled to a continuous layer.",
          },
          {
            action: "Deflect the bonded layer and trace the load outward.",
            title: "Deforms; does not heal",
            body: "Deflection and material response help dissipate energy without reversing fracture.",
          },
        ],
      },
      zh: {
        register: "中间层 / 04",
        nav: "粘结近景",
        title: "先粘结，再挠曲。",
        subtitle: "聚合物层随开裂玻璃一起变形，帮助保持碎片，并耗散部分冲击能量。",
        evidence: "定性膜层响应 [S1 · S5]",
        note: "它保持粘结，但不会让破裂玻璃自我修复。",
        beats: [
          {
            action: "放大粘附在聚合物表面的破裂玻璃。",
            title: "保持粘结",
            body: "粘附让碎片继续耦合到连续中间层。",
          },
          {
            action: "让粘结层挠曲，并向外追踪载荷。",
            title: "发生变形，而非修复",
            body: "挠曲与材料响应帮助耗散能量，却不会逆转裂纹。",
          },
        ],
      },
    },
  },
  {
    id: 5,
    composition: "held-fragments",
    copy: {
      en: {
        register: "POST-BREAKAGE / 05",
        nav: "Held fragments",
        title: "Cracked. Still connected.",
        subtitle:
          "Post-breakage retention is the visible result of a layered material strategy—not unbroken glass.",
        evidence: "Material distinction, not a selection guide [S1 · S3 · S4]",
        note: "Performance depends on the whole tested assembly and loading context.",
        beats: [
          {
            action: "Suspend the fractured pane as one retained field and state the boundary.",
            title: "Laminated is not tempered",
            body: "Lamination adds a bonded retaining layer; tempering changes a glass lite’s fracture pattern.",
          },
        ],
      },
      zh: {
        register: "破裂后 / 05",
        nav: "保持碎片",
        title: "已经开裂，仍然连接。",
        subtitle: "破裂后的碎片保持，来自分层材料策略；它并不意味着玻璃没有破坏。",
        evidence: "材料差异说明，不是选型指南 [S1 · S3 · S4]",
        note: "实际表现取决于完整受测组件与载荷情境。",
        beats: [
          {
            action: "将破裂玻璃作为一个被保持的整体悬起，并标明边界。",
            title: "夹层玻璃不等于钢化玻璃",
            body: "夹层增加粘结保持层；钢化改变单片玻璃的破碎形态。",
          },
        ],
      },
    },
  },
];

const FRACTURE_RAYS = [
  "M50 49 L10 12",
  "M50 49 L28 5",
  "M50 49 L55 3",
  "M50 49 L81 8",
  "M50 49 L95 29",
  "M50 49 L96 59",
  "M50 49 L83 91",
  "M50 49 L58 96",
  "M50 49 L31 93",
  "M50 49 L7 76",
  "M50 49 L3 46",
  "M50 49 L15 27",
];

const FRACTURE_BRANCHES = [
  "M35 35 L18 38 L8 31",
  "M41 30 L43 14 L35 7",
  "M61 30 L70 20 L86 22",
  "M70 40 L82 37 L94 42",
  "M72 61 L87 68 L92 82",
  "M61 72 L66 87 L58 96",
  "M42 71 L32 82 L16 84",
  "M29 61 L17 58 L4 66",
  "M27 47 L15 43 L5 46",
  "M52 21 L59 10 L67 5",
  "M79 51 L91 55 L97 64",
  "M49 80 L43 91 L31 96",
];

function clampScene(scene: number): SceneId {
  if (scene <= 1) return 1;
  if (scene >= 5) return 5;
  return Math.round(scene) as SceneId;
}

function sceneData(sceneId: SceneId): SceneData {
  return SCENES[sceneId - 1];
}

function clampBeat(data: SceneData, language: Language, beat: number): number {
  return Math.max(
    0,
    Math.min(data.copy[language].beats.length - 1, Math.round(beat)),
  );
}

function cx(...classes: Array<string | false | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

function SceneCopyBlock({
  copy,
  activeBeat,
  light = false,
}: {
  copy: SceneCopy;
  activeBeat: number;
  light?: boolean;
}) {
  return (
    <div
      className={cx(styles.copyBlock, light && styles.copyBlockLight)}
      data-beat-layout-item="true"
    >
      <p className={styles.register}>{copy.register}</p>
      <h1>{copy.title}</h1>
      <p className={styles.subtitle}>{copy.subtitle}</p>
      <div className={styles.beatReadout}>
        <span>{String(activeBeat + 1).padStart(2, "0")}</span>
        <strong>{copy.beats[activeBeat].title}</strong>
        <p>{copy.beats[activeBeat].body}</p>
      </div>
    </div>
  );
}

function IntactPane({ copy }: { copy: SceneCopy }) {
  return (
    <div className={styles.intactLayout}>
      <SceneCopyBlock copy={copy} activeBeat={0} />
      <div className={styles.intactObject} data-beat-layout-item="true">
        <span className={styles.behindWord} aria-hidden="true">
          HOLD
        </span>
        <svg
          className={styles.intactSvg}
          viewBox="0 0 100 100"
          role="img"
          aria-label={copy.nav}
        >
          <polygon className={styles.paneBack} points="17,10 87,18 82,88 12,79" />
          <polygon className={styles.paneFace} points="13,7 84,15 79,85 8,76" />
          <polyline className={styles.paneHighlight} points="13,7 84,15 79,85" />
          <g className={styles.edgeSection}>
            <path d="M79 85 L82 88 L87 18 L84 15 Z" />
            <path d="M80 83 L81 81 L86 19 L85 21 Z" />
            <path d="M81.4 84.5 L82.4 82.5 L87 20 L86 22 Z" />
          </g>
        </svg>
        <div className={styles.edgeLabels} aria-hidden="true">
          <span>GLASS</span>
          <span>PVB</span>
          <span>GLASS</span>
        </div>
      </div>
      <p className={styles.objectCaption} data-beat-layout-item="true">
        {copy.evidence}
      </p>
    </div>
  );
}

function LayerExplode({
  copy,
  activeBeat,
  language,
}: {
  copy: SceneCopy;
  activeBeat: number;
  language: Language;
}) {
  const expanded = activeBeat >= 1;
  return (
    <div className={styles.explodeLayout} data-expanded={expanded ? "true" : "false"}>
      <SceneCopyBlock copy={copy} activeBeat={activeBeat} light />
      <div className={styles.depthAxis} data-beat-layout-item="true" aria-hidden="true">
        <span>Z</span>
        <i />
      </div>
      <div className={styles.laminaField} data-beat-layout-item="true">
        <div className={cx(styles.lamina, styles.laminaFront)} data-layer="glass-front">
          <span>{language === "zh" ? "外层玻璃" : "OUTER GLASS"}</span>
          <i />
        </div>
        <div className={cx(styles.lamina, styles.laminaCore)} data-layer="polymer-interlayer">
          <span>{language === "zh" ? "PVB 中间层 · 示例" : "PVB INTERLAYER · EXAMPLE"}</span>
          <i />
        </div>
        <div className={cx(styles.lamina, styles.laminaBack)} data-layer="glass-back">
          <span>{language === "zh" ? "内层玻璃" : "INNER GLASS"}</span>
          <i />
        </div>
      </div>
      <div className={styles.explodeFoot} data-beat-layout-item="true">
        <span>{copy.evidence}</span>
        <span>{copy.note}</span>
      </div>
    </div>
  );
}

function ImpactField({
  copy,
  activeBeat,
}: {
  copy: SceneCopy;
  activeBeat: number;
}) {
  const phase = ["contact", "radial", "branch", "retained"][activeBeat];
  return (
    <div className={styles.impactLayout}>
      <SceneCopyBlock copy={copy} activeBeat={activeBeat} />
      <div
        className={styles.impactField}
        data-impact-field="true"
        data-impact-phase={phase}
        data-beat-layout-item="true"
      >
        <svg viewBox="0 0 100 100" role="img" aria-label={copy.nav}>
          <rect className={styles.impactPane} x="3" y="3" width="94" height="94" />
          <rect className={styles.interlayerSignal} x="5" y="5" width="90" height="90" />
          {FRACTURE_RAYS.map((path, index) => (
            <path
              key={path}
              d={path}
              className={styles.fractureRay}
              data-fracture-ray="true"
              data-visible={
                activeBeat >= 2 || (activeBeat >= 1 && index % 2 === 0)
                  ? "true"
                  : "false"
              }
              style={{ "--ray-index": index } as CSSProperties}
            />
          ))}
          {FRACTURE_BRANCHES.map((path, index) => (
            <path
              key={path}
              d={path}
              className={styles.fractureBranch}
              data-visible={activeBeat >= 2 ? "true" : "false"}
              style={{ "--branch-index": index } as CSSProperties}
            />
          ))}
          {[9, 17, 27].map((radius, index) => (
            <circle
              key={radius}
              className={styles.fractureRing}
              data-fracture-ring="true"
              data-visible={activeBeat >= 2 ? "true" : "false"}
              cx="50"
              cy="49"
              r={radius}
              style={{ "--ring-index": index } as CSSProperties}
            />
          ))}
          <circle className={styles.contactHalo} cx="50" cy="49" r="5.5" />
          <circle className={styles.contactCore} cx="50" cy="49" r="1.7" />
        </svg>
        <div className={styles.retainedStamp} data-visible={activeBeat >= 3 ? "true" : "false"}>
          <span>INTERLAYER</span>
          <strong>HOLDS THE FIELD</strong>
        </div>
      </div>
      <div className={styles.impactLegend} data-beat-layout-item="true">
        <span>{copy.evidence}</span>
        <span>{copy.note}</span>
      </div>
    </div>
  );
}

function AdhesionCloseup({
  copy,
  activeBeat,
  language,
}: {
  copy: SceneCopy;
  activeBeat: number;
  language: Language;
}) {
  return (
    <div className={styles.closeupLayout} data-deflected={activeBeat >= 1 ? "true" : "false"}>
      <SceneCopyBlock copy={copy} activeBeat={activeBeat} light />
      <div className={styles.closeupFigure} data-beat-layout-item="true">
        <svg viewBox="0 0 120 100" role="img" aria-label={copy.nav}>
          <g className={styles.upperFragments}>
            <polygon points="5,24 21,8 31,25 18,42" />
            <polygon points="23,8 43,6 45,31 31,25" />
            <polygon points="45,6 62,11 58,34 45,31" />
            <polygon points="62,11 80,5 87,29 58,34" />
            <polygon points="80,5 105,12 114,30 87,29" />
          </g>
          <path
            className={styles.membrane}
            data-interlayer-deflection="true"
            d={activeBeat >= 1 ? "M5 46 C33 42 44 75 62 78 C81 80 92 45 115 47" : "M5 45 C38 43 80 47 115 45"}
          />
          <path
            className={styles.membraneEdge}
            d={activeBeat >= 1 ? "M5 50 C33 46 44 79 62 82 C81 84 92 49 115 51" : "M5 49 C38 47 80 51 115 49"}
          />
          <g className={styles.lowerFragments}>
            <polygon points="6,54 21,53 29,75 12,89" />
            <polygon points="21,53 43,57 42,89 29,75" />
            <polygon points="43,57 61,83 55,96 42,89" />
            <polygon points="61,83 82,58 89,86 74,97" />
            <polygon points="82,58 112,54 108,88 89,86" />
          </g>
          <g className={styles.energyArrows} data-visible={activeBeat >= 1 ? "true" : "false"}>
            <path d="M59 39 L59 24" />
            <path d="M49 37 L40 24" />
            <path d="M70 38 L79 25" />
          </g>
        </svg>
        <div className={styles.closeupLabels}>
          <span>{language === "zh" ? "玻璃碎片" : "GLASS FRAGMENTS"}</span>
          <strong>{language === "zh" ? "连续聚合物层" : "CONTINUOUS POLYMER LAYER"}</strong>
          <span>{language === "zh" ? "玻璃碎片" : "GLASS FRAGMENTS"}</span>
        </div>
      </div>
      <div className={styles.responseStrip} data-beat-layout-item="true">
        <strong>{language === "zh" ? "保持粘结" : "STAYS BONDED"}</strong>
        <i />
        <strong>{language === "zh" ? "发生挠曲" : "DEFLECTS"}</strong>
        <i />
        <strong>{language === "zh" ? "耗散部分能量" : "DISSIPATES PART OF THE ENERGY"}</strong>
      </div>
      <p className={styles.closeupNote} data-beat-layout-item="true">
        {copy.note}
      </p>
    </div>
  );
}

function HeldFragments({
  copy,
  language,
}: {
  copy: SceneCopy;
  language: Language;
}) {
  return (
    <div className={styles.heldLayout}>
      <div className={styles.heldHeadline} data-beat-layout-item="true">
        <p>{copy.register}</p>
        <h1>{language === "zh" ? "裂了，仍然连在一起。" : "CRACKED.\nSTILL CONNECTED."}</h1>
        <span>{copy.subtitle}</span>
      </div>
      <div className={styles.heldPane} data-beat-layout-item="true">
        <svg viewBox="0 0 100 100" role="img" aria-label={copy.nav}>
          <polygon className={styles.heldBack} points="8,9 91,7 94,92 10,95" />
          <polygon className={styles.heldFace} points="6,7 89,5 92,90 8,93" />
          {FRACTURE_RAYS.map((path) => (
            <path key={path} className={styles.heldCrack} d={path} />
          ))}
          {FRACTURE_BRANCHES.map((path) => (
            <path key={path} className={styles.heldCrackSoft} d={path} />
          ))}
          <circle className={styles.heldCore} cx="50" cy="49" r="2.2" />
        </svg>
        <span className={styles.holdMark}>HELD</span>
      </div>
      <div className={styles.materialBoundary} data-beat-layout-item="true">
        <h2>{language === "zh" ? "夹层 ≠ 钢化" : "LAMINATED ≠ TEMPERED"}</h2>
        <div>
          <p>
            <strong>{language === "zh" ? "夹层" : "LAMINATED"}</strong>
            {language === "zh"
              ? "粘结中间层可在开裂后保持许多碎片。"
              : "A bonded interlayer can retain many fractured pieces."}
          </p>
          <p>
            <strong>{language === "zh" ? "钢化" : "TEMPERED"}</strong>
            {language === "zh"
              ? "热处理改变破碎形态，常形成许多小碎片。钢化玻璃片也可再被夹层；仅靠钢化并不提供粘结保持层。"
              : "Heat treatment changes breakage into many small pieces. A tempered lite can also be laminated; tempering alone provides no bonded retaining layer."}
          </p>
        </div>
        <small>{copy.note}</small>
      </div>
    </div>
  );
}

function ScenePanel({
  sceneId,
  beat,
  language,
}: {
  sceneId: SceneId;
  beat: number;
  language: Language;
}) {
  const data = sceneData(sceneId);
  const copy = data.copy[language];
  const activeBeat = clampBeat(data, language, beat);

  let content;
  if (sceneId === 1) {
    content = <IntactPane copy={copy} />;
  } else if (sceneId === 2) {
    content = <LayerExplode copy={copy} activeBeat={activeBeat} language={language} />;
  } else if (sceneId === 3) {
    content = <ImpactField copy={copy} activeBeat={activeBeat} />;
  } else if (sceneId === 4) {
    content = <AdhesionCloseup copy={copy} activeBeat={activeBeat} language={language} />;
  } else {
    content = <HeldFragments copy={copy} language={language} />;
  }

  return (
    <section
      className={cx(styles.scene, styles[`scene${sceneId}`])}
      data-scene={sceneId}
      data-composition={data.composition}
      data-beat={activeBeat}
    >
      {content}
    </section>
  );
}

function MiniFracture({ sceneId }: { sceneId: SceneId }) {
  return (
    <span className={styles.miniature} aria-hidden="true" data-miniature={sceneId}>
      <span className={styles.miniBack} />
      <span className={styles.miniCore} />
      <span className={styles.miniFront}>
        <i />
        <i />
        <i />
      </span>
    </span>
  );
}

function LaminaNavigation({
  activeScene,
  language,
  onNavigate,
}: {
  activeScene: SceneId;
  language: Language;
  onNavigate?: (scene: number, beat: number) => void;
}) {
  const [dragging, setDragging] = useState(false);
  const [visited, setVisited] = useState<Set<SceneId>>(
    () => new Set<SceneId>([activeScene]),
  );
  const lastScene = useRef<SceneId>(activeScene);

  useEffect(() => {
    setVisited((current) => {
      if (current.has(activeScene)) return current;
      const next = new Set(current);
      next.add(activeScene);
      return next;
    });
    lastScene.current = activeScene;
  }, [activeScene]);

  const go = useCallback(
    (target: SceneId) => {
      lastScene.current = target;
      setVisited((current) => {
        if (current.has(target)) return current;
        const next = new Set(current);
        next.add(target);
        return next;
      });
      onNavigate?.(target, 0);
    },
    [onNavigate],
  );

  const sceneFromPointer = useCallback(
    (event: ReactPointerEvent<HTMLElement>): SceneId => {
      const rect = event.currentTarget.getBoundingClientRect();
      const fraction = Math.max(
        0,
        Math.min(1, (event.clientX - rect.left) / (rect.width || 1)),
      );
      return Math.min(5, Math.floor(fraction * 5) + 1) as SceneId;
    },
    [],
  );

  const handlePointerDown = useCallback(
    (event: ReactPointerEvent<HTMLElement>) => {
      event.stopPropagation();
      if ((event.target as Element).closest("button")) return;
      event.preventDefault();
      setDragging(true);
      go(sceneFromPointer(event));
    },
    [go, sceneFromPointer],
  );

  const handlePointerMove = useCallback(
    (event: ReactPointerEvent<HTMLElement>) => {
      if (!dragging) return;
      event.preventDefault();
      event.stopPropagation();
      const target = sceneFromPointer(event);
      if (target !== lastScene.current) go(target);
    },
    [dragging, go, sceneFromPointer],
  );

  const handlePointerUp = useCallback(
    (event: ReactPointerEvent<HTMLElement>) => {
      if (!dragging) return;
      event.preventDefault();
      event.stopPropagation();
      const target = sceneFromPointer(event);
      if (target !== lastScene.current) go(target);
      setDragging(false);
    },
    [dragging, go, sceneFromPointer],
  );

  const handleKeyDown = useCallback(
    (event: ReactKeyboardEvent<HTMLButtonElement>, sceneId: SceneId) => {
      if (event.repeat) return;
      const keyTarget: Partial<Record<string, number>> = {
        ArrowRight: sceneId + 1,
        ArrowDown: sceneId + 1,
        ArrowLeft: sceneId - 1,
        ArrowUp: sceneId - 1,
        Home: 1,
        End: 5,
      };
      const target = keyTarget[event.key];
      if (target === undefined) return;
      event.preventDefault();
      event.stopPropagation();
      go(Math.max(1, Math.min(5, target)) as SceneId);
    },
    [go],
  );

  return (
    <nav
      className={styles.laminaNav}
      aria-label={
        language === "zh" ? "玻璃层片场景导航" : "Glass lamina scene navigation"
      }
      data-topic-navigation="true"
      data-navigation-geometry="card-miniature"
      data-navigation-carrier="glass-lamina-stack"
      data-navigation-invocation="drag-scrub"
      data-navigation-feedback="history-trail"
      data-dragging={dragging ? "true" : "false"}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={() => setDragging(false)}
      onClick={(event) => event.stopPropagation()}
    >
      <span className={styles.scrubInstruction} aria-hidden="true">
        {language === "zh" ? "拖动层片" : "SCRUB THE LAMINAE"}
      </span>
      <span className={styles.historyLine} aria-hidden="true" />
      {SCENE_IDS.map((sceneId) => {
        const active = sceneId === activeScene;
        const label = sceneData(sceneId).copy[language].nav;
        return (
          <button
            key={sceneId}
            type="button"
            className={styles.laminaButton}
            aria-label={
              language === "zh"
                ? `场景 ${sceneId}：${label}`
                : `Scene ${sceneId}: ${label}`
            }
            aria-current={active ? "step" : undefined}
            data-active={active ? "true" : "false"}
            data-visited={visited.has(sceneId) ? "true" : "false"}
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              go(sceneId);
            }}
            onKeyDown={(event) => handleKeyDown(event, sceneId)}
          >
            <MiniFracture sceneId={sceneId} />
            <span className={styles.navNumber}>{String(sceneId).padStart(2, "0")}</span>
            <span className={styles.navLabel}>{label}</span>
          </button>
        );
      })}
    </nav>
  );
}

export function getMetadata(language: Language): StyleMetadata {
  return {
    id: "liquid-glass",
    band: "contemporary-digital",
    name: language === "zh" ? "液态玻璃" : "Liquid Glass",
    theme: language === "zh" ? "裂了，仍然连在一起" : "Cracked, Still Holding",
    densityLabel: language === "zh" ? "舞台冲击" : "Stage Impact",
    heroScene: 3,
    colors: {
      bg: "#06090d",
      ink: "#f3f8fb",
      panel: "#8be6ee",
    },
    typography: {
      header: "Avenir Next 700",
      body: "Avenir Next 500",
    },
    tags: [
      "liquid-glass",
      "material",
      "fracture",
      "laminated",
      "cutaway",
      "stage-impact",
      "spatial",
    ],
    fonts: ["Avenir Next", "cjk:PingFang SC"],
    scenes: SCENES.map((scene) => {
      const copy = scene.copy[language];
      return {
        id: scene.id,
        title: copy.nav,
        beats: copy.beats.map((beat, index) => ({
          id: index,
          action: beat.action,
          title: beat.title,
          body: beat.body,
        })),
      };
    }),
  };
}

export default function SafetyGlass({
  scene,
  beat,
  language,
  isThumbnail,
  reducedMotion,
  onNavigate,
}: BespokeStyleProps) {
  const activeScene = clampScene(scene);
  const motionOff = reducedMotion || isThumbnail;

  return (
    <main
      className={cx(styles.root, motionOff && styles.motionOff)}
      data-style-id="liquid-glass"
      data-topic-id="safety-glass"
      data-motion={motionOff ? "off" : "material"}
      data-current-scene={activeScene}
    >
      <div className={styles.envelopeTop} aria-hidden="true">
        <span>LSG / MATERIAL STUDY</span>
        <i />
        <span>34</span>
      </div>
      <SpatialSceneTrack
        scene={activeScene}
        beat={beat}
        sceneIds={SCENE_IDS}
        transitionKind="focus-swap"
        transitionMap={TRANSITION_MAP}
        transitionDurationMs={780}
        reducedMotion={motionOff}
        beatLayoutModes={BEAT_LAYOUT_MODES}
        className={styles.track}
        renderScene={(sceneId, sceneBeat) => (
          <ScenePanel
            sceneId={clampScene(sceneId)}
            beat={sceneBeat}
            language={language}
          />
        )}
      />
      <div className={styles.disclaimer}>
        <span>
          {language === "zh"
            ? "概念性材料图解 · 非选型或施工建议"
            : "CONCEPTUAL MATERIAL DIAGRAM · NOT A SELECTION OR INSTALLATION GUIDE"}
        </span>
        <strong>NOT TO SCALE</strong>
        <span>S1 NHTSA · S2 WBDG · S3 CPSC · S4 NGA · S5 KURARAY</span>
      </div>
      {!isThumbnail && (
        <LaminaNavigation
          activeScene={activeScene}
          language={language}
          onNavigate={onNavigate}
        />
      )}
    </main>
  );
}

export const safetyGlassTopic = defineStyleTopic({
  id: "safety-glass",
  topic: { en: "Safety Glass", zh: "夹层玻璃" },
  model: "GPT 5.6 Sol",
  component: SafetyGlass,
  getMetadata,
  navigation: {
    geometry: "card-miniature",
    carrier: "glass-lamina-stack",
    invocation: "drag-scrub",
    feedback: "history-trail",
  },
  sources: SAFETY_GLASS_SOURCES,
  transitionScore: SAFETY_GLASS_TRANSITION_SCORE,
});

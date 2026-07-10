import { useRef, useState } from "react";
import type {
  KeyboardEvent as ReactKeyboardEvent,
  PointerEvent as ReactPointerEvent,
  TouchEvent as ReactTouchEvent,
} from "react";
import type { BespokeStyleProps, StyleMetadata, TopicSource } from "../types";
import SpatialSceneTrack from "./SpatialSceneTrack";
import type { BeatLayoutMode, SceneTransitionMap } from "./SpatialSceneTrack";
import { defineStyleTopic } from "./topic";
import styles from "./machine-age-deco-reinforced-concrete.module.css";

type Lang = "en" | "zh";

type SceneCopy = {
  eyebrow: string;
  title: string;
  deck: string;
  principle: string;
  boundary: string;
  diagramLabel: string;
  beats: Array<{
    action: string;
    title: string;
    body: string;
  }>;
};

type SceneDefinition = {
  composition:
    | "monolith"
    | "compression-field"
    | "rebar-skeleton"
    | "bending-beam"
    | "deco-arch";
  en: SceneCopy;
  zh: SceneCopy;
};

const STYLE_ID = "machine-age-deco";
const TOPIC_ID = "reinforced-concrete";
const SCENE_IDS = [1, 2, 3, 4, 5] as const;

const REINFORCED_CONCRETE_SOURCE_IDS = [
  "nist-composite-beam-strain",
  "aci-e2-reinforcement",
  "fhwa-reinforcing-bar-practices",
  "asce-tension-member-cracks",
] as const;

const REINFORCED_CONCRETE_CLAIM_IDS = [
  "concrete-compression",
  "concrete-tension",
  "steel-concrete-bond",
  "compatible-thermal-movement",
  "crack-control",
  "safety-boundary",
] as const;

type ReinforcedConcreteSourceId =
  (typeof REINFORCED_CONCRETE_SOURCE_IDS)[number];
type ReinforcedConcreteClaimId =
  (typeof REINFORCED_CONCRETE_CLAIM_IDS)[number];

export const REINFORCED_CONCRETE_SCENE_CLAIMS = {
  1: [
    "concrete-compression",
    "concrete-tension",
    "crack-control",
    "safety-boundary",
  ],
  2: ["concrete-compression", "safety-boundary"],
  3: ["concrete-tension", "steel-concrete-bond", "safety-boundary"],
  4: [
    "concrete-compression",
    "concrete-tension",
    "crack-control",
    "safety-boundary",
  ],
  5: [
    "steel-concrete-bond",
    "compatible-thermal-movement",
    "safety-boundary",
  ],
} as const satisfies Record<(typeof SCENE_IDS)[number], readonly ReinforcedConcreteClaimId[]>;

const SCENES: Record<number, SceneDefinition> = {
  1: {
    composition: "monolith",
    en: {
      eyebrow: "ONE MATERIAL",
      title: "CONCRETE ALONE",
      deck: "In bending, the lower face is pulled apart.",
      principle: "Concrete carries compression well; tension is its weak side.",
      boundary: "The red trace is one schematic crack—not a failure prediction.",
      diagramLabel: "Plain beam under centered load",
      beats: [
        {
          action: "Set the plain beam",
          title: "A beam, no steel",
          body: "A thought experiment: concrete alone under a centered load.",
        },
        {
          action: "Apply the load",
          title: "Bending divides the beam",
          body: "The top is compressed while the lower face is pulled in tension.",
        },
        {
          action: "Expose the tension zone",
          title: "Tension finds a limit",
          body: "A plain concrete beam can crack where bending creates tension.",
        },
        {
          action: "Retain the crack",
          title: "One crack, one warning",
          body: "This diagram marks one crack event only; it does not predict a structure.",
        },
      ],
    },
    zh: {
      eyebrow: "一种材料",
      title: "只有混凝土",
      deck: "受弯时，梁的下缘会被拉开。",
      principle: "混凝土擅长承压；抗拉是它的弱项。",
      boundary: "红线只表示一次示意裂缝，不是失效预测。",
      diagramLabel: "中央荷载下的素混凝土梁",
      beats: [
        {
          action: "放置素混凝土梁",
          title: "一根没有钢筋的梁",
          body: "一个思想实验：中央荷载作用下，只有混凝土。",
        },
        {
          action: "施加荷载",
          title: "受弯把梁分成两侧",
          body: "上缘受压，下缘在拉力作用下被拉开。",
        },
        {
          action: "显出受拉区",
          title: "拉力碰到极限",
          body: "受弯产生拉力的位置，素混凝土梁可能开裂。",
        },
        {
          action: "保留裂缝",
          title: "一条裂缝，一次提醒",
          body: "此图只标记一次裂缝事件，不预测具体结构。",
        },
      ],
    },
  },
  2: {
    composition: "compression-field",
    en: {
      eyebrow: "THE COMPRESSION SIDE",
      title: "COMPRESSION HAS A HOME",
      deck: "Columns and arches organize load into compression.",
      principle: "Concrete performs strongly when the force closes in.",
      boundary: "A force diagram, not a member-size or load-capacity claim.",
      diagramLabel: "Compression field through a column and arch",
      beats: [
        {
          action: "Set the compression field",
          title: "Concrete takes the closing force",
          body: "The field is intentionally near-static: compression is the material's familiar work.",
        },
      ],
    },
    zh: {
      eyebrow: "受压的一侧",
      title: "压力有归处",
      deck: "柱和拱把荷载组织成压缩。",
      principle: "当力把材料压紧时，混凝土表现很强。",
      boundary: "这是受力示意，不是构件尺寸或承载力结论。",
      diagramLabel: "穿过柱与拱的压缩力场",
      beats: [
        {
          action: "建立压缩力场",
          title: "混凝土承受闭合的力",
          body: "画面刻意近乎静止：压缩是它熟悉的工作。",
        },
      ],
    },
  },
  3: {
    composition: "rebar-skeleton",
    en: {
      eyebrow: "THE TENSION ROUTE",
      title: "STEEL CROSSES THE GAP",
      deck: "After cracking, tensile force is transferred to reinforcement through bond.",
      principle: "Steel helps carry tension; concrete still shapes and protects the system.",
      boundary: "Rebar is not a stand-alone support; this is a composite-action diagram.",
      diagramLabel: "Reinforcement skeleton spanning a tension zone",
      beats: [
        {
          action: "Raise the reinforcement skeleton",
          title: "A continuous tension path",
          body: "Ribbed steel is embedded so force can move between steel and concrete.",
        },
        {
          action: "Trace tension through bond",
          title: "Connected, not substituted",
          body: "Bond transfers force; the two materials act together rather than replacing one another.",
        },
      ],
    },
    zh: {
      eyebrow: "拉力的路径",
      title: "钢筋跨过缺口",
      deck: "开裂后，拉力通过黏结传递给钢筋。",
      principle: "钢筋帮助承担拉力；混凝土仍在塑造和保护整体。",
      boundary: "钢筋不是独立支撑；这是复合作用示意。",
      diagramLabel: "跨越受拉区的钢筋骨架",
      beats: [
        {
          action: "升起钢筋骨架",
          title: "连续的受拉路径",
          body: "带肋钢筋埋入混凝土，力才能在两种材料之间传递。",
        },
        {
          action: "沿黏结描出拉力",
          title: "相连，而非替代",
          body: "黏结传递力；两种材料共同工作，而不是互相替代。",
        },
      ],
    },
  },
  4: {
    composition: "bending-beam",
    en: {
      eyebrow: "ONE SECTION, TWO JOBS",
      title: "BENDING DIVIDES THE WORK",
      deck: "One zone is compressed; another is pulled in tension.",
      principle: "Reinforcement helps distribute cracking. It does not erase cracking.",
      boundary: "No bar sizes, spacing, cover, or construction instruction is implied.",
      diagramLabel: "Schematic bending section with compression and tension zones",
      beats: [
        {
          action: "Split the section",
          title: "Compression above, tension below",
          body: "The neutral axis is a boundary in this simplified bending picture.",
        },
        {
          action: "Add the tension reinforcement",
          title: "Cracks can be distributed",
          body: "Where cracking occurs depends on a complete design and loading context.",
        },
      ],
    },
    zh: {
      eyebrow: "同一截面，两种工作",
      title: "受弯分开分工",
      deck: "一个区域受压；另一个区域承受拉力。",
      principle: "钢筋有助于分散裂缝，不会让裂缝消失。",
      boundary: "图中不暗示钢筋尺寸、间距、保护层或施工做法。",
      diagramLabel: "带受压区与受拉区的受弯示意截面",
      beats: [
        {
          action: "划分截面",
          title: "上压下拉",
          body: "在这张简化受弯图中，中性轴是一条分界。",
        },
        {
          action: "加入受拉钢筋",
          title: "裂缝可以被分散",
          body: "是否、何处开裂，取决于完整的设计和荷载语境。",
        },
      ],
    },
  },
  5: {
    composition: "deco-arch",
    en: {
      eyebrow: "THE ASSEMBLED MEMBER",
      title: "COMPOSITE, NOT ADDITIVE",
      deck: "Complementary roles become one member through bond, compatible thermal movement, and detailing.",
      principle: "Concrete + steel: division of work, held together by connection.",
      boundary: "Concept diagram only—not a rebar schedule or construction advice.",
      diagramLabel: "Completed Deco arch with concrete shell and steel path",
      beats: [
        {
          action: "Resolve the composite member",
          title: "Connection makes the whole",
          body: "The takeaway is a material relationship, not a construction prescription.",
        },
      ],
    },
    zh: {
      eyebrow: "组合后的构件",
      title: "复合，不是相加",
      deck: "互补分工通过黏结、相近热变形和构造细节成为一个构件。",
      principle: "混凝土 + 钢筋：分工，通过连接成为整体。",
      boundary: "仅为概念图，不是配筋表或施工建议。",
      diagramLabel: "带混凝土外壳与钢筋路径的 Deco 拱",
      beats: [
        {
          action: "收束为复合构件",
          title: "连接让整体成立",
          body: "结论讲的是材料关系，不是施工处方。",
        },
      ],
    },
  },
};

const BEAT_LAYOUT_MODES: Partial<Record<number, BeatLayoutMode>> = {
  1: "reserved",
  3: "reserved",
  4: "reserved",
};

export const REINFORCED_CONCRETE_TRANSITION_SCORE = {
  "1->2": "split-merge",
  "2->3": "dolly-pull",
  "3->4": "grid-reveal",
  "4->5": "focus-swap",
} as const;

const transitionMap: SceneTransitionMap = REINFORCED_CONCRETE_TRANSITION_SCORE;

export const REINFORCED_CONCRETE_CLAIMS = [
  {
    id: "concrete-compression",
    visibleClaim:
      "Concrete carries compression well and forms the compression side of the simplified force-path diagrams.",
    sceneIds: [1, 2, 4] as const,
    sourceIds: [
      "nist-composite-beam-strain",
      "aci-e2-reinforcement",
      "fhwa-reinforcing-bar-practices",
    ] as const,
  },
  {
    id: "concrete-tension",
    visibleClaim:
      "Concrete is comparatively weak in tension, while embedded reinforcement helps carry tensile force.",
    sceneIds: [1, 3, 4] as const,
    sourceIds: [
      "nist-composite-beam-strain",
      "aci-e2-reinforcement",
      "fhwa-reinforcing-bar-practices",
      "asce-tension-member-cracks",
    ] as const,
  },
  {
    id: "steel-concrete-bond",
    visibleClaim:
      "Bond transfers force between reinforcing steel and concrete so the materials can act together.",
    sceneIds: [3, 5] as const,
    sourceIds: [
      "nist-composite-beam-strain",
      "aci-e2-reinforcement",
      "asce-tension-member-cracks",
    ] as const,
  },
  {
    id: "compatible-thermal-movement",
    visibleClaim:
      "Similar thermal movement helps steel and concrete remain compatible as a composite material system.",
    sceneIds: [5] as const,
    sourceIds: [
      "nist-composite-beam-strain",
      "aci-e2-reinforcement",
    ] as const,
  },
  {
    id: "crack-control",
    visibleClaim:
      "Reinforcement can distribute cracking but does not erase cracking or predict a specific crack pattern.",
    sceneIds: [1, 4] as const,
    sourceIds: [
      "aci-e2-reinforcement",
      "fhwa-reinforcing-bar-practices",
      "asce-tension-member-cracks",
    ] as const,
  },
  {
    id: "safety-boundary",
    visibleClaim:
      "The force-path diagrams are conceptual, not member sizing, load-capacity, reinforcement detailing, crack prediction, or construction advice.",
    sceneIds: [1, 2, 3, 4, 5] as const,
    sourceIds: REINFORCED_CONCRETE_SOURCE_IDS,
  },
] as const satisfies readonly {
  id: ReinforcedConcreteClaimId;
  visibleClaim: string;
  sceneIds: readonly (typeof SCENE_IDS)[number][];
  sourceIds: readonly ReinforcedConcreteSourceId[];
}[];

export const REINFORCED_CONCRETE_SOURCES = [
  {
    id: "nist-composite-beam-strain",
    authority: "National Institute of Standards and Technology",
    title:
      "Monitoring early-age shrinkage strain and temperature distributions in full-scale steel-concrete composite beams with distributed fiber optic sensors",
    citation:
      "Bao, Y., Hoehler, M., Choe, L., Klegseth, M., & Chen, G. (2017). Monitoring early-age shrinkage strain and temperature distributions in full-scale steel-concrete composite beams with distributed fiber optic sensors. Proceedings of the 11th International Workshop on Structural Health Monitoring.",
    url: "https://tsapps.nist.gov/publication/get_pdf.cfm?pub_id=923619",
    supports:
      "Concrete is weak in tension relative to compression; steel can serve as tension reinforcement; chemical and mechanical bond transfer force; comparable thermal expansion supports the integrity of steel-reinforced concrete.",
    boundary:
      "The source discusses material and composite-action principles. It does not supply member dimensions, bar selection, spacing, cover, load capacity, or construction instructions for this diagram.",
    claimIds: [
      "concrete-compression",
      "concrete-tension",
      "steel-concrete-bond",
      "compatible-thermal-movement",
      "safety-boundary",
    ],
  },
  {
    id: "aci-e2-reinforcement",
    authority: "American Concrete Institute",
    title: "Reinforcement for Concrete, ACI Education Bulletin E2-00",
    citation:
      "ACI Committee E-701. (2000; reapproved 2006). Reinforcement for Concrete—Materials and Applications (ACI Education Bulletin E2-00).",
    url: "https://www.concrete.org/portals/0/files/pdf/fe2-00.pdf",
    supports:
      "Plain concrete has much lower tensile than compressive strength; in beam action reinforcement resists tension, while bond and similar thermal movement enable steel and concrete to act together.",
    boundary:
      "This educational bulletin explains principles and shows why placement matters. The slide deliberately omits its design-code context and must not be read as placement or detailing guidance.",
    claimIds: [...REINFORCED_CONCRETE_CLAIM_IDS],
  },
  {
    id: "fhwa-reinforcing-bar-practices",
    authority: "Federal Highway Administration",
    title:
      "FHWA-HRT-16-012: National Changes in Bridge Practices for Reinforcing Bars",
    citation:
      "Lane, S., & Kleinhans, D. (2016). FHWA LTBP Summary—National Changes in Bridge Practices for Reinforcing Bars (FHWA-HRT-16-012). Federal Highway Administration.",
    url: "https://www.fhwa.dot.gov/publications/research/infrastructure/structures/ltbp/16012/index.cfm",
    supports:
      "Where plain concrete is sufficiently tensioned it tends to crack, so reinforcing bars help carry tensile stress; flexure creates tension regions, while creep, shrinkage, and thermal effects can also matter.",
    boundary:
      "The FHWA material addresses bridge practice. It supports the conservative tension-and-cracking explanation, not a universal claim about the location, timing, or width of cracks in a specific member.",
    claimIds: [
      "concrete-compression",
      "concrete-tension",
      "crack-control",
      "safety-boundary",
    ],
  },
  {
    id: "asce-tension-member-cracks",
    authority: "ASCE Journal of Structural Engineering",
    title: "Crack Analysis of Reinforced Concrete Tension Members",
    citation:
      "Chan, H. C., Cheung, Y. K., & Huang, Y. P. (1992). Crack Analysis of Reinforced Concrete Tension Members. Journal of Structural Engineering, 118(8), 2118–2132. https://doi.org/10.1061/(ASCE)0733-9445(1992)118:8(2118).",
    url: "https://ascelibrary.org/doi/10.1061/%28ASCE%290733-9445%281992%29118%3A8%282118%29",
    supports:
      "Crack analysis for reinforced-concrete tension members treats tension stiffening and bond-stress distribution as consequential to crack strength and member elongation.",
    boundary:
      "This research article motivates the slide's bond-and-crack-control language. It is not used to infer a crack width, reinforcement amount, or a design outcome for a real structure.",
    claimIds: [
      "concrete-tension",
      "steel-concrete-bond",
      "crack-control",
      "safety-boundary",
    ],
  },
] as const satisfies readonly (TopicSource & {
  id: ReinforcedConcreteSourceId;
  authority: string;
  title: string;
  citation: string;
  boundary: string;
  claimIds: readonly ReinforcedConcreteClaimId[];
})[];

const MATERIAL_STATES = ["brass", "concrete", "steel", "graphite", "stone"] as const;

function materialName(material: (typeof MATERIAL_STATES)[number], language: Lang): string {
  const names =
    language === "zh"
      ? {
          brass: "黄铜",
          concrete: "混凝土灰",
          steel: "钢",
          graphite: "石墨",
          stone: "石材",
        }
      : {
          brass: "BRASS",
          concrete: "CONCRETE GREY",
          steel: "STEEL",
          graphite: "GRAPHITE",
          stone: "STONE",
        };
  return names[material];
}

function copyFor(scene: number, language: Lang): SceneCopy {
  return SCENES[scene]?.[language] ?? SCENES[1][language];
}

function sceneForPointer(track: HTMLElement, clientY: number): number {
  const rect = track.getBoundingClientRect();
  const height = rect.height || 1;
  const relative = Math.max(0, Math.min(0.999, (clientY - rect.top) / height));
  return Math.min(5, Math.max(1, Math.floor(relative * SCENE_IDS.length) + 1));
}

function clampScene(scene: number): number {
  return SCENES[scene] ? scene : 1;
}

function clampBeat(scene: number, beat: number): number {
  const count = SCENES[scene]?.en.beats.length ?? 1;
  return Math.max(0, Math.min(beat, count - 1));
}

function reveal(visible: boolean): "true" | "false" {
  return visible ? "true" : "false";
}

function PlainBeamDiagram({ beat }: { beat: number }) {
  const crackVisible = beat >= 2;
  return (
    <svg
      className={styles.forceSvg}
      data-force-diagram="plain-beam"
      viewBox="0 0 1000 520"
      aria-hidden="true"
    >
      <path className={styles.svgFrame} d="M90 474H910" />
      <path className={styles.svgSupport} d="M190 474L250 400L310 474Z" />
      <path className={styles.svgSupport} d="M690 474L750 400L810 474Z" />
      <path className={styles.concreteBody} d="M190 274H810V365H190Z" />
      <path
        className={styles.loadArrow}
        data-reveal={reveal(beat >= 1)}
        d="M500 86V230M462 182L500 230L538 182"
      />
      <path
        className={styles.sagLine}
        data-reveal={reveal(beat >= 1)}
        d="M210 360C390 390 610 390 790 360"
      />
      <path
        className={styles.tensionZone}
        data-reveal={reveal(beat >= 2)}
        d="M204 368H796V398H204Z"
      />
      <path
        className={styles.crackLine}
        data-crack-event="once"
        data-reveal={reveal(crackVisible)}
        d="M501 366L488 386L508 402L494 426"
      />
      <path
        className={styles.tensionArrow}
        data-reveal={reveal(beat >= 3)}
        d="M377 410H262M262 410L302 382M262 410L302 438M623 410H738M738 410L698 382M738 410L698 438"
      />
    </svg>
  );
}

function CompressionDiagram() {
  return (
    <svg
      className={styles.forceSvg}
      data-force-diagram="compression-field"
      viewBox="0 0 1000 520"
      aria-hidden="true"
    >
      <path className={styles.svgFrame} d="M112 470H888" />
      <path className={styles.compressionArch} d="M192 470V355C192 205 808 205 808 355V470" />
      <path className={styles.compressionColumn} d="M420 470V184H580V470Z" />
      <path className={styles.compressionCap} d="M350 184H650V146H350Z" />
      {[315, 385, 455, 545, 615, 685].map((x) => (
        <path
          key={x}
          className={styles.compressionArrow}
          d={`M${x} 96V158M${x - 17} 137L${x} 158L${x + 17} 137`}
        />
      ))}
      <path className={styles.compressionArrow} d="M236 306L312 355M280 332L312 355L267 357M764 306L688 355M720 332L688 355L733 357" />
    </svg>
  );
}

function RebarDiagram({ beat }: { beat: number }) {
  return (
    <svg
      className={styles.forceSvg}
      data-force-diagram="rebar-skeleton"
      viewBox="0 0 1000 520"
      aria-hidden="true"
    >
      <path className={styles.rebarOutline} d="M154 130H846V396H154Z" />
      {[236, 356, 476, 596, 716].map((x) => (
        <path key={x} className={styles.rebarTie} d={`M${x} 174V362`} />
      ))}
      <path className={styles.rebarMain} d="M194 326H806" />
      <path className={styles.rebarMain} d="M194 362H806" />
      <path className={styles.rebarHook} d="M194 326V362M806 326V362" />
      <path className={styles.concreteGhost} d="M154 130H846V396H154Z" />
      <path
        className={styles.bondPulse}
        data-reveal={reveal(beat >= 1)}
        d="M194 362H806M194 362L236 338M806 362L764 338"
      />
      {[286, 406, 526, 646, 756].map((x) => (
        <path
          key={x}
          className={styles.bondTick}
          data-reveal={reveal(beat >= 1)}
          d={`M${x} 342V382`}
        />
      ))}
    </svg>
  );
}

function BendingDiagram({ beat }: { beat: number }) {
  return (
    <svg
      className={styles.forceSvg}
      data-force-diagram="bending-section"
      viewBox="0 0 1000 520"
      aria-hidden="true"
    >
      <path className={styles.sectionShell} d="M176 124H824V410H176Z" />
      <path className={styles.compressionZone} d="M176 124H824V266H176Z" />
      <path className={styles.neutralAxis} d="M176 266H824" />
      <path className={styles.tensionField} d="M176 266H824V410H176Z" />
      <path className={styles.sectionLine} d="M282 196H718M282 222H718" />
      <path
        className={styles.sectionRebar}
        data-reveal={reveal(beat >= 1)}
        d="M270 358H730M270 388H730"
      />
      {[330, 430, 530, 630].map((x) => (
        <path
          key={x}
          className={styles.sectionCrack}
          data-reveal={reveal(beat >= 1)}
          d={`M${x} 410L${x - 11} 382L${x + 8} 356`}
        />
      ))}
    </svg>
  );
}

function CompositeArchDiagram() {
  return (
    <svg
      className={styles.forceSvg}
      data-force-diagram="composite-arch"
      viewBox="0 0 1000 520"
      aria-hidden="true"
    >
      <path className={styles.svgFrame} d="M118 470H882" />
      <path className={styles.compositeArch} d="M202 470V360C202 142 798 142 798 360V470" />
      <path className={styles.compositeInner} d="M264 470V370C264 218 736 218 736 370V470" />
      <path className={styles.compositeRebar} d="M286 470V380C286 246 714 246 714 380V470" />
      {[342, 412, 500, 588, 658].map((x) => (
        <path
          key={x}
          className={styles.compositeRib}
          d={`M${x} 278V330`}
        />
      ))}
      <path className={styles.compositeBase} d="M146 470H854" />
    </svg>
  );
}

function SceneDiagram({ scene, beat }: { scene: number; beat: number }) {
  switch (scene) {
    case 1:
      return <PlainBeamDiagram beat={beat} />;
    case 2:
      return <CompressionDiagram />;
    case 3:
      return <RebarDiagram beat={beat} />;
    case 4:
      return <BendingDiagram beat={beat} />;
    default:
      return <CompositeArchDiagram />;
  }
}

function DiagramAnnotations({
  scene,
  beat,
  language,
}: {
  scene: number;
  beat: number;
  language: Lang;
}) {
  if (scene !== 4) return null;

  const labels =
    language === "zh"
      ? {
          compression: "受压区",
          neutral: "中性轴",
          tension: "受拉区",
          cracks: "裂缝控制",
        }
      : {
          compression: "Compression zone",
          neutral: "Neutral axis",
          tension: "Tension zone",
          cracks: "Crack control",
        };

  return (
    <div className={styles.sectionLabels} data-section-annotations="true">
      <p className={styles.sectionLabel} data-zone="compression">
        {labels.compression}
      </p>
      <p className={styles.sectionLabel} data-zone="neutral">
        {labels.neutral}
      </p>
      <p className={styles.sectionLabel} data-zone="tension">
        {labels.tension}
      </p>
      <p
        className={styles.sectionLabel}
        data-zone="cracks"
        data-reveal={reveal(beat >= 1)}
      >
        {labels.cracks}
      </p>
    </div>
  );
}

function ScenePanel({
  scene,
  beat,
  language,
  isActive,
}: {
  scene: number;
  beat: number;
  language: Lang;
  isActive: boolean;
}) {
  const sceneData = SCENES[scene] ?? SCENES[1];
  const copy = copyFor(scene, language);
  const activeBeat = clampBeat(scene, beat);

  return (
    <section
      className={styles.scene}
      data-scene-id={scene}
      data-composition={sceneData.composition}
      data-claim-ids={REINFORCED_CONCRETE_SCENE_CLAIMS[
        scene as (typeof SCENE_IDS)[number]
      ]?.join(" ")}
      data-active-scene={isActive ? "true" : "false"}
      data-beat-layout-container="true"
      data-beat-layout-mode="reserved"
      aria-label={copy.title}
    >
      <div className={styles.sceneRail} aria-hidden="true" />
      <div className={styles.sceneCrown} aria-hidden="true" />
      <header className={styles.copyBlock} data-beat-layout-item="true">
        <p className={styles.eyebrow} data-reveal={reveal(true)}>
          {copy.eyebrow}
        </p>
        <h1 className={styles.title} data-reveal={reveal(true)}>
          {copy.title}
        </h1>
        <p className={styles.deck} data-reveal={reveal(activeBeat >= 1 || scene === 2 || scene === 5)}>
          {copy.deck}
        </p>
      </header>

      <div className={styles.diagramBlock} data-beat-layout-item="true">
        <SceneDiagram scene={scene} beat={activeBeat} />
        <DiagramAnnotations scene={scene} beat={activeBeat} language={language} />
      </div>

      <div className={styles.statementBlock} data-beat-layout-item="true">
        <p className={styles.diagramLabel}>{copy.diagramLabel}</p>
        <p className={styles.principle}>{copy.principle}</p>
        <p
          className={styles.boundary}
          data-reveal={reveal(activeBeat >= Math.max(0, copy.beats.length - 1))}
        >
          {copy.boundary}
        </p>
      </div>
    </section>
  );
}

function LoadRuler({
  scene,
  language,
  onNavigate,
}: {
  scene: number;
  language: Lang;
  onNavigate?: (scene: number, beat: number) => void;
}) {
  const [previewScene, setPreviewScene] = useState<number | null>(null);
  const isScrubbingRef = useRef(false);
  const startYRef = useRef(0);
  const displayedScene = previewScene ?? scene;
  const material = MATERIAL_STATES[displayedScene - 1] ?? "brass";

  const jump = (targetScene: number) => {
    onNavigate?.(targetScene, 0);
  };

  const handleKeyboard = (
    event: ReactKeyboardEvent<HTMLButtonElement>,
    targetScene: number,
  ) => {
    event.stopPropagation();
    let keyboardTarget: number | null = null;
    switch (event.key) {
      case "Enter":
      case " ":
      case "Spacebar":
        keyboardTarget = targetScene;
        break;
      case "ArrowLeft":
      case "ArrowUp":
        keyboardTarget = Math.max(SCENE_IDS[0], targetScene - 1);
        break;
      case "ArrowRight":
      case "ArrowDown":
        keyboardTarget = Math.min(SCENE_IDS[SCENE_IDS.length - 1], targetScene + 1);
        break;
      case "Home":
        keyboardTarget = SCENE_IDS[0];
        break;
      case "End":
        keyboardTarget = SCENE_IDS[SCENE_IDS.length - 1];
        break;
      default:
        return;
    }
    event.preventDefault();
    if (event.repeat) return;
    jump(keyboardTarget);
  };

  const handleKeyboardUp = (event: ReactKeyboardEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    if (
      event.key === "Enter" ||
      event.key === " " ||
      event.key === "Spacebar"
    ) {
      event.preventDefault();
    }
  };

  const isolateTouch = (event: ReactTouchEvent<HTMLElement>) => {
    event.stopPropagation();
  };

  const beginScrub = (event: ReactPointerEvent<HTMLElement>) => {
    event.stopPropagation();
    if (event.target instanceof Element && event.target.closest("button")) {
      return;
    }
    isScrubbingRef.current = true;
    startYRef.current = event.clientY;
    setPreviewScene(sceneForPointer(event.currentTarget, event.clientY));
    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      // Pointer capture is unavailable in a few test and legacy environments.
    }
  };

  const moveScrub = (event: ReactPointerEvent<HTMLElement>) => {
    if (!isScrubbingRef.current) return;
    event.stopPropagation();
    setPreviewScene(sceneForPointer(event.currentTarget, event.clientY));
  };

  const endScrub = (event: ReactPointerEvent<HTMLElement>) => {
    if (!isScrubbingRef.current) return;
    event.stopPropagation();
    const targetScene = sceneForPointer(event.currentTarget, event.clientY);
    const moved = Math.abs(event.clientY - startYRef.current) > 8;
    isScrubbingRef.current = false;
    setPreviewScene(null);
    try {
      event.currentTarget.releasePointerCapture(event.pointerId);
    } catch {
      // The click buttons below remain the accessible fallback.
    }
    if (moved) jump(targetScene);
  };

  return (
    <nav
      className={styles.loadRuler}
      aria-label={language === "zh" ? "荷载刻度导航" : "Load ruler navigation"}
      data-topic-navigation="true"
      data-navigation-geometry="edge-scale"
      data-navigation-carrier="load-ruler"
      data-navigation-invocation="drag-scrub"
      data-navigation-feedback="material-color-change"
      data-material-state={material}
      data-scrubbing={isScrubbingRef.current ? "true" : "false"}
      onClick={(event) => event.stopPropagation()}
      onTouchStartCapture={isolateTouch}
      onTouchMoveCapture={isolateTouch}
      onTouchEndCapture={isolateTouch}
      onTouchCancelCapture={isolateTouch}
      onPointerDown={beginScrub}
      onPointerMove={moveScrub}
      onPointerUp={endScrub}
      onPointerCancel={(event) => {
        event.stopPropagation();
        isScrubbingRef.current = false;
        setPreviewScene(null);
      }}
    >
      <span className={styles.rulerCaption} aria-hidden="true">
        {language === "zh" ? "荷载" : "LOAD"}
      </span>
      <div className={styles.rulerLine} aria-hidden="true" />
      <div className={styles.rulerStops}>
        {SCENE_IDS.map((sceneId) => {
          const active = sceneId === displayedScene;
          return (
            <button
              key={sceneId}
              className={styles.rulerStop}
              type="button"
              aria-label={
                language === "zh" ? `跳至场景 ${sceneId}` : `Jump to scene ${sceneId}`
              }
              data-ruler-stop="true"
              data-active={active ? "true" : "false"}
              onClick={(event) => {
                event.stopPropagation();
                jump(sceneId);
              }}
              onKeyDown={(event) => handleKeyboard(event, sceneId)}
              onKeyUp={handleKeyboardUp}
            >
              {String(sceneId).padStart(2, "0")}
            </button>
          );
        })}
      </div>
      <span className={styles.materialNote} aria-live="polite">
        {language === "zh"
          ? `材料：${materialName(material, language)}`
          : `MATERIAL: ${materialName(material, language)}`}
      </span>
      <span className={styles.dragNote} aria-hidden="true">
        {language === "zh" ? "拖动 · 点击 · 按键" : "DRAG · CLICK · KEY"}
      </span>
    </nav>
  );
}

export function getMetadata(language: Lang): StyleMetadata {
  const zh = language === "zh";
  return {
    id: STYLE_ID,
    band: "craft-cultural",
    name: zh ? "机器时代装饰派" : "Machine-Age Deco",
    theme: zh ? "混凝土的两种力量" : "Concrete's Two Strengths",
    densityLabel: zh ? "图解中密度" : "Diagram-led Medium",
    heroScene: 4,
    colors: {
      bg: "#0a1010",
      ink: "#eee6d5",
      panel: "#333a38",
    },
    typography: {
      header: "Impact 700",
      body: "Arial Narrow 400",
    },
    tags: ["deco", "structure", "concrete", "steel", "force-diagram"],
    fonts: ["Impact", "Arial Narrow", "cjk:PingFang SC", "cjk:Microsoft YaHei"],
    scenes: SCENE_IDS.map((sceneId) => {
      const copy = copyFor(sceneId, language);
      return {
        id: sceneId,
        title: copy.title,
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

export default function ReinforcedConcrete({
  scene,
  beat,
  language,
  isThumbnail,
  reducedMotion,
  onNavigate,
}: BespokeStyleProps) {
  const frozen =
    typeof document !== "undefined" &&
    document.documentElement.dataset.frozen === "true";
  const settled = reducedMotion || isThumbnail || frozen;
  const activeScene = clampScene(scene);
  const activeBeat = clampBeat(activeScene, beat);
  const material = MATERIAL_STATES[activeScene - 1] ?? "brass";

  return (
    <div
      className={[styles.root, settled ? styles.settled : ""].filter(Boolean).join(" ")}
      data-topic-id={TOPIC_ID}
      data-style-id={STYLE_ID}
      data-material-state={material}
      data-settled={settled ? "true" : "false"}
      data-frozen={frozen ? "true" : "false"}
      data-thumbnail={isThumbnail ? "true" : "false"}
    >
      <div className={styles.outerFrame} aria-hidden="true" />
      <div className={styles.centerAxis} aria-hidden="true" />
      <SpatialSceneTrack
        scene={activeScene}
        beat={activeBeat}
        sceneIds={[...SCENE_IDS]}
        transitionKind="split-merge"
        transitionMap={transitionMap}
        transitionDurationMs={680}
        reducedMotion={settled}
        beatLayoutModes={BEAT_LAYOUT_MODES}
        renderScene={(sceneId, sceneBeat, isActive) => (
          <ScenePanel
            scene={sceneId}
            beat={sceneBeat}
            language={language}
            isActive={isActive}
          />
        )}
      />
      {!isThumbnail && (
        <LoadRuler
          scene={activeScene}
          language={language}
          onNavigate={onNavigate}
        />
      )}
      <p className={styles.notToScale}>
        {language === "zh" ? "示意图 · 非按比例" : "SCHEMATIC · NOT TO SCALE"}
      </p>
    </div>
  );
}

export const reinforcedConcreteTopic = defineStyleTopic({
  id: TOPIC_ID,
  topic: {
    en: "Reinforced Concrete",
    zh: "钢筋混凝土",
  },
  model: "GPT 5.6 Sol",
  component: ReinforcedConcrete,
  getMetadata,
  navigation: {
    geometry: "edge-scale",
    carrier: "load-ruler",
    invocation: "drag-scrub",
    feedback: "material-color-change",
  },
  sources: REINFORCED_CONCRETE_SOURCES,
  transitionScore: REINFORCED_CONCRETE_TRANSITION_SCORE,
});

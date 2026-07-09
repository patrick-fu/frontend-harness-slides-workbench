import { useState } from "react";
import type {
  BespokeStyleProps,
  StyleMetadata,
  TopicSource,
  TopicTransitionScore,
} from "../types";
import SpatialSceneTrack, {
  type BeatLayoutMode,
  type SceneTransitionMap,
  type SceneTransitionModifierMap,
} from "./SpatialSceneTrack";
import { defineStyleTopic } from "./topic";
import styles from "./37-urushi-cure.module.css";

type Lang = "en" | "zh";
type SceneArt = "sap" | "layers" | "chamber" | "network" | "object";

interface LocalizedBeat {
  id: number;
  action: string;
  title: string;
  body: string;
}

interface LocalizedScene {
  kicker: string;
  headline: string;
  lead: string;
  details: [string, string, string];
  caveat: string;
  beats: LocalizedBeat[];
}

interface UrushiScene {
  id: number;
  art: SceneArt;
  copy: Record<Lang, LocalizedScene>;
}

const SCENE_IDS = [1, 2, 3, 4, 5] as const;

export const urushiCureTransitionScore = {
  "1->2": "focus-swap",
  "2->3": "ink-spread",
  "3->4": "iris-open",
  "4->5": "focus-swap",
} satisfies TopicTransitionScore;

const TRANSITION_MAP: SceneTransitionMap = urushiCureTransitionScore;

const TRANSITION_MODIFIER_MAP: SceneTransitionModifierMap = {
  "3->4": "urushi-sheen",
};

const BEAT_LAYOUT_MODES = {
  1: "reserved",
  2: "reserved",
  3: "reserved",
  4: "reserved",
  5: "reserved",
} satisfies Record<number, BeatLayoutMode>;

export const urushiCureSources = [
  {
    authority: "Getty Research Institute, Art & Architecture Thesaurus",
    title: "Urushi (lacquer material)",
    url: "https://www.getty.edu/vow/AATFullDisplay?find=urushi&logic=AND&note=&subjectid=300265172",
    supports:
      "Defines urushi as a specific tree-derived coating containing urushiol, laccase, polysaccharides and water that solidifies by oxidative polymerization in humid air; also notes that finishes may be polished or matte.",
  },
  {
    authority: "The Metropolitan Museum of Art",
    title: "Lacquerware of East Asia",
    url: "https://www.metmuseum.org/essays/lacquerware-of-east-asia",
    supports:
      "Documents purification, thin-coat application, warm humid draft-free curing cabinets, and the fact that some high-quality traditions build many coats.",
  },
  {
    authority: "Smithsonian Museum Conservation Institute",
    citation:
      "Weintraub, Tsujimoto & Walters, Urushi and conservation: the use of Japanese lacquer in the restoration of Japanese art, Ars Orientalis 11, 39–62.",
    url: "https://mci.si.edu/node/1276306",
    supports:
      "Supports the material-safety boundary that uncured urushi exposure can cause dermatitis and that urushi practice belongs to a specific conservation and craft tradition.",
  },
  {
    authority: "Tokyo National Research Institute for Cultural Properties / CiNii Research",
    citation:
      "Ogawa & Hayakawa (2016), Effects of K2[CuCl4]·2H2O on Urushi Polymerization under Low Temperature and Humidity Conditions, DOI 10.18953/00003904.",
    url: "https://cir.nii.ac.jp/crid/1390853649777156736",
    supports:
      "Reports 20–30 °C and 70–80% RH as a general reference for conventional urushi hardening, while experimentally studying altered formulations and lower-condition curing—evidence that the range is not a universal recipe.",
  },
  {
    authority: "Scientific Reports / National Library of Medicine",
    citation:
      "Polymerization mechanism of natural lacquer sap with special phase structure, Scientific Reports 10 (2020).",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC7393129/",
    supports:
      "Supports the laccase-catalyzed oxidation of urushiol under humid conditions and subsequent coupling and cross-linking that form a three-dimensional lacquer film.",
  },
] as const satisfies readonly TopicSource[];

const SCENES: Record<number, UrushiScene> = {
  1: {
    id: 1,
    art: "sap",
    copy: {
      en: {
        kicker: "01 / RAW SAP",
        headline: "A sap that cures in damp air.",
        lead:
          "Here, urushi means a tree-sap lacquer tradition—not every coating sold as “lacquer.”",
        details: ["URUSHIOL-RICH PHASE", "WATER + POLYSACCHARIDES", "LACCASE ENZYME"],
        caveat:
          "Safety: uncured urushi can cause contact dermatitis. Handling belongs in trained, controlled practice.",
        beats: [
          {
            id: 0,
            action: "Introduce raw urushi as a material system.",
            title: "Raw sap",
            body: "A water-in-oil emulsion carries urushiol and laccase.",
          },
          {
            id: 1,
            action: "Reveal the material and safety boundary.",
            title: "Specific material, real hazard",
            body: "Urushi is not a synonym for every lacquer, and uncured contact can cause dermatitis.",
          },
        ],
      },
      zh: {
        kicker: "01 / 生漆",
        headline: "一种在湿润空气中固化的树液。",
        lead: "这里的漆，指东亚漆树传统的天然涂层，不泛指所有名为“lacquer”的材料。",
        details: ["富含漆酚的相", "水与多糖", "漆酶"],
        caveat: "安全边界：未固化生漆可引发接触性皮炎，只应在受训且受控的条件下操作。",
        beats: [
          {
            id: 0,
            action: "把生漆作为一个材料系统引入。",
            title: "原始树液",
            body: "油包水乳液携带漆酚与漆酶。",
          },
          {
            id: 1,
            action: "揭示材料与安全边界。",
            title: "特定材料，真实风险",
            body: "漆不等于所有 lacquer，接触未固化生漆可引发皮炎。",
          },
        ],
      },
    },
  },
  2: {
    id: 2,
    art: "layers",
    copy: {
      en: {
        kicker: "02 / PREPARE + LAY",
        headline: "Refine it. Strain it. Lay it thin.",
        lead:
          "Workshops prepare sap for a desired finish, then build the surface through controlled coats.",
        details: ["FILTER IMPURITIES", "REFINE FOR THE FINISH", "APPLY A THIN COAT"],
        caveat:
          "The sequence, additives, pigments and tools vary by region, object and workshop.",
        beats: [
          {
            id: 0,
            action: "Show the raw stream entering preparation.",
            title: "Filter",
            body: "Remove particles before the finish is built.",
          },
          {
            id: 1,
            action: "Reveal refinement as a controlled material operation.",
            title: "Refine",
            body: "Water content and working properties are adjusted for a chosen practice.",
          },
          {
            id: 2,
            action: "Spread one thin coat across the sample.",
            title: "Lay thin",
            body: "The final surface is accumulated coat by coat.",
          },
        ],
      },
      zh: {
        kicker: "02 / 处理与涂布",
        headline: "精制、过滤，再薄薄涂下一层。",
        lead: "工坊按目标表面处理树液，再用受控的薄层逐步建立漆膜。",
        details: ["滤除杂质", "按目标表面精制", "薄层涂布"],
        caveat: "步骤、添加物、颜料与工具会随地区、器物和工坊而改变。",
        beats: [
          {
            id: 0,
            action: "展示原始漆液进入处理环节。",
            title: "过滤",
            body: "在建立表面之前先去除颗粒。",
          },
          {
            id: 1,
            action: "把精制表现为受控的材料操作。",
            title: "精制",
            body: "按具体工艺调整含水量与施工特性。",
          },
          {
            id: 2,
            action: "在样板上铺开一层薄漆。",
            title: "薄涂",
            body: "最终表面由一层层涂膜累积而成。",
          },
        ],
      },
    },
  },
  3: {
    id: 3,
    art: "chamber",
    copy: {
      en: {
        kicker: "03 / HUMID CURING",
        headline: "Damp air keeps the enzyme working.",
        lead:
          "20–30 °C and 70–80% RH is one published general reference—not a universal formula.",
        details: ["H₂O SUSTAINS LACCASE", "O₂ ACCEPTS ELECTRONS", "OXIDATION BEGINS"],
        caveat:
          "Formulation, coat thickness, desired finish and workshop method move the useful window.",
        beats: [
          {
            id: 0,
            action: "Place the sample inside a humid curing chamber.",
            title: "Condition",
            body: "Moist air supports the enzyme rather than merely slowing evaporation.",
          },
          {
            id: 1,
            action: "Reveal a published reference range.",
            title: "Reference, not recipe",
            body: "20–30 °C and 70–80% RH is a common general reference.",
          },
          {
            id: 2,
            action: "Connect water, oxygen and enzyme activity.",
            title: "The reaction starts",
            body: "Humidity supports laccase while oxygen participates in oxidation.",
          },
        ],
      },
      zh: {
        kicker: "03 / 湿润固化",
        headline: "湿润空气让酶继续工作。",
        lead: "20–30 °C、70–80% RH 是一项研究给出的常用参考，并非万能配方。",
        details: ["水分维持漆酶活性", "氧参与电子传递", "氧化由此启动"],
        caveat: "配方、涂层厚度、目标表面和工坊方法都会改变可用条件窗口。",
        beats: [
          {
            id: 0,
            action: "把样板放入湿润的固化环境。",
            title: "建立条件",
            body: "湿润空气支持酶活性，不只是拖慢溶剂挥发。",
          },
          {
            id: 1,
            action: "揭示文献中的参考范围。",
            title: "参考，不是配方",
            body: "20–30 °C、70–80% RH 是常见的一般参考。",
          },
          {
            id: 2,
            action: "连接水分、氧与酶活性。",
            title: "反应启动",
            body: "湿度支持漆酶，氧参与氧化过程。",
          },
        ],
      },
    },
  },
  4: {
    id: 4,
    art: "network",
    copy: {
      en: {
        kicker: "04 / BUILD THE FILM",
        headline: "Oxidize. Couple. Cross-link.",
        lead:
          "Laccase starts urushiol oxidation; coupling and later side-chain auto-oxidation continue the network.",
        details: ["BEFORE / DIFFUSE", "CURED FILM / COHERENT", "FINISH / GLOSS VARIES"],
        caveat:
          "Cure builds the film. Surface preparation and polishing—not cure alone—decide mirror gloss or matte depth.",
        beats: [
          {
            id: 0,
            action: "Compare uncured and coherent film samples.",
            title: "Before and after",
            body: "The material changes from a mobile coating to a connected film.",
          },
          {
            id: 1,
            action: "Reveal laccase-led oxidative coupling.",
            title: "Enzymatic start",
            body: "Laccase oxidizes urushiol and enables coupling reactions.",
          },
          {
            id: 2,
            action: "Complete the cross-linked network and one restrained sheen.",
            title: "Coherent network",
            body: "Further reactions continue cross-linking; the chosen finish controls the final sheen.",
          },
        ],
      },
      zh: {
        kicker: "04 / 漆膜成形",
        headline: "氧化、偶联，再交联。",
        lead: "漆酶启动漆酚氧化；偶联与后续侧链自氧化继续建立网络。",
        details: ["固化前 / 漫散", "固化膜 / 连续", "最终表面 / 光泽可变"],
        caveat: "固化建立漆膜；镜面或哑光还取决于表面处理与抛光，而不只是固化本身。",
        beats: [
          {
            id: 0,
            action: "并置固化前与连续漆膜样片。",
            title: "固化前后",
            body: "材料从可流动涂层变成相连的漆膜。",
          },
          {
            id: 1,
            action: "揭示由漆酶启动的氧化偶联。",
            title: "酶促起点",
            body: "漆酶氧化漆酚，并使偶联反应得以进行。",
          },
          {
            id: 2,
            action: "完成交联网络与唯一一次克制掠光。",
            title: "连续网络",
            body: "后续反应继续交联，所选表面工艺决定最终光泽。",
          },
        ],
      },
    },
  },
  5: {
    id: 5,
    art: "object",
    copy: {
      en: {
        kicker: "05 / MANY PRACTICES",
        headline: "One material. Many traditions.",
        lead:
          "Layer counts, curing routines, pigments, substrates and polishing differ across objects and workshops.",
        details: ["LAYERS VARY", "CONDITIONS VARY", "GLOSS MAY VARY"],
        caveat:
          "A museum account describes one practice, not a single recipe for every East Asian tree-sap lacquer.",
        beats: [
          {
            id: 0,
            action: "Settle on one abstract lacquer vessel.",
            title: "A finished object",
            body: "The film is the result of repeated material choices.",
          },
          {
            id: 1,
            action: "Close with the boundaries between traditions.",
            title: "No universal recipe",
            body: "Shared chemistry does not erase differences in place, object and craft.",
          },
        ],
      },
      zh: {
        kicker: "05 / 多种传统",
        headline: "一种材料，多种传统。",
        lead: "层数、固化方法、颜料、胎体与抛光，会随器物和工坊而变化。",
        details: ["层数会变", "条件会变", "光泽也会变"],
        caveat: "博物馆记录描述的是一种具体实践，不是所有东亚树液漆的统一配方。",
        beats: [
          {
            id: 0,
            action: "让一件抽象漆器静置收束。",
            title: "完成的器物",
            body: "漆膜来自一连串反复的材料选择。",
          },
          {
            id: 1,
            action: "用传统之间的边界结束叙事。",
            title: "没有万能配方",
            body: "相近化学过程不会抹平地域、器物与工艺差异。",
          },
        ],
      },
    },
  },
};

function getScene(sceneId: number): UrushiScene {
  return SCENES[sceneId] ?? SCENES[1];
}

function getCopy(sceneId: number, language: Lang): LocalizedScene {
  return getScene(sceneId).copy[language];
}

function clampBeat(sceneId: number, beat: number): number {
  const maxBeat = getScene(sceneId).copy.en.beats.length - 1;
  return Math.min(Math.max(beat, 0), maxBeat);
}

function SapStudy({ beat }: { beat: number }) {
  return (
    <div className={styles.sapStudy} aria-hidden="true" data-beat={beat}>
      <div className={styles.sapShadow} />
      <div className={styles.sapDrop}>
        <span className={styles.sapLight} />
        <span className={styles.sapCore} />
      </div>
      <div className={styles.sapRing} />
      <span className={styles.materialIndex}>T. vernicifluum / material study</span>
    </div>
  );
}

function LayerStudy({ beat }: { beat: number }) {
  return (
    <div className={styles.layerStudy} aria-hidden="true" data-beat={beat}>
      <div className={styles.filterFrame}>
        <div className={styles.filterMesh} />
        <div className={styles.rawStream} />
      </div>
      <div className={styles.scraper} />
      <div className={styles.layerBed}>
        <span />
        <span />
        <span />
        <span />
      </div>
      <div className={styles.coatRibbon} />
    </div>
  );
}

function ChamberStudy({ beat }: { beat: number }) {
  return (
    <div className={styles.chamberStudy} aria-hidden="true" data-beat={beat}>
      <div className={styles.chamberShell}>
        <div className={styles.chamberSample} />
        <div className={styles.chamberAtmosphere} />
      </div>
      <div className={styles.conditionDial} data-kind="temperature">
        <span className={styles.dialValue}>20–30</span>
        <span className={styles.dialUnit}>°C</span>
      </div>
      <div className={styles.conditionDial} data-kind="humidity">
        <span className={styles.dialValue}>70–80</span>
        <span className={styles.dialUnit}>% RH</span>
      </div>
      <div className={styles.oxygenMark}>O₂</div>
      <div className={styles.waterMark}>H₂O</div>
      <span className={styles.referenceLabel}>published general reference</span>
    </div>
  );
}

function NetworkStudy({ beat }: { beat: number }) {
  return (
    <div className={styles.networkStudy} data-beat={beat}>
      <div className={styles.samplePair} aria-label="Before and after lacquer samples">
        <div className={styles.sampleColumn}>
          <span className={styles.sampleLabel}>BEFORE</span>
          <div className={styles.beforeSample} data-testid="urushi-before-sample">
            <span />
            <span />
            <span />
          </div>
        </div>
        <div className={styles.sampleArrow} aria-hidden="true">→</div>
        <div className={styles.sampleColumn}>
          <span className={styles.sampleLabel}>CURED FILM</span>
          <div
            className={styles.afterSample}
            data-signature-sheen="true"
            data-testid="urushi-after-sample"
          >
            <span className={styles.afterDepth} />
          </div>
        </div>
      </div>
      <svg
        className={styles.networkDiagram}
        viewBox="0 0 620 170"
        role="img"
        aria-label="Simplified cross-link network diagram"
      >
        <g className={styles.networkLinks}>
          <path d="M46 86 C108 20 178 24 238 82 S364 144 426 82 S528 22 584 84" />
          <path d="M48 90 C124 154 176 144 238 88 S356 24 426 88 S516 150 582 88" />
          <path d="M124 50 L170 128 M264 48 L316 128 M448 48 L506 128" />
        </g>
        <g className={styles.networkNodes}>
          {[46, 124, 170, 238, 264, 316, 426, 448, 506, 584].map((x, index) => (
            <circle key={x} cx={x} cy={index % 2 === 0 ? 86 : 50 + (index % 3) * 39} r="8" />
          ))}
        </g>
      </svg>
    </div>
  );
}

function ObjectStudy({ beat }: { beat: number }) {
  return (
    <div className={styles.objectStudy} aria-hidden="true" data-beat={beat}>
      <div className={styles.vesselRim} />
      <div className={styles.vesselBody}>
        <span className={styles.vesselReflection} />
      </div>
      <div className={styles.vesselFoot} />
      <div className={styles.vesselShadow} />
      <span className={styles.objectNote}>abstract material study / not a reconstruction</span>
    </div>
  );
}

function MaterialArtifact({ art, beat }: { art: SceneArt; beat: number }) {
  switch (art) {
    case "sap":
      return <SapStudy beat={beat} />;
    case "layers":
      return <LayerStudy beat={beat} />;
    case "chamber":
      return <ChamberStudy beat={beat} />;
    case "network":
      return <NetworkStudy beat={beat} />;
    case "object":
      return <ObjectStudy beat={beat} />;
  }
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
  const scene = getScene(sceneId);
  const copy = getCopy(sceneId, language);
  const safeBeat = clampBeat(sceneId, beat);
  const finalBeat = copy.beats.length - 1;

  return (
    <article
      className={styles.scene}
      data-active={isActive ? "true" : "false"}
      data-beat={safeBeat}
      data-scene={sceneId}
      aria-label={copy.headline}
    >
      <p className={styles.kicker} data-beat-layout-item="true">
        {copy.kicker}
      </p>
      <div className={styles.headlineSlot} data-beat-layout-item="true">
        <h2 className={styles.headline}>{copy.headline}</h2>
      </div>
      <div
        className={styles.leadSlot}
        data-beat-layout-item="true"
        data-visible={safeBeat >= 0 ? "true" : "false"}
      >
        <p className={styles.lead}>{copy.lead}</p>
      </div>
      <div className={styles.artifactSlot} data-beat-layout-item="true">
        <MaterialArtifact art={scene.art} beat={safeBeat} />
      </div>
      <ol className={styles.detailRail} data-beat-layout-item="true">
        {copy.details.map((detail, index) => (
          <li
            data-visible={safeBeat >= Math.min(index, finalBeat) ? "true" : "false"}
            key={detail}
          >
            <span>{String(index + 1).padStart(2, "0")}</span>
            {detail}
          </li>
        ))}
      </ol>
      <p
        className={styles.caveat}
        data-beat-layout-item="true"
        data-visible={safeBeat >= finalBeat ? "true" : "false"}
      >
        {copy.caveat}
      </p>
    </article>
  );
}

function LacquerSheenNavigation({
  scene,
  language,
  onNavigate,
}: {
  scene: number;
  language: Lang;
  onNavigate?: (scene: number, beat: number) => void;
}) {
  const [held, setHeld] = useState(false);

  return (
    <nav
      className={styles.navigation}
      data-topic-navigation="true"
      data-navigation-geometry="ambient"
      data-navigation-carrier="lacquer-sheen-loci"
      data-navigation-invocation="gesture-hold"
      data-navigation-feedback="typographic-emphasis"
      data-revealed={held ? "true" : "false"}
      aria-label={language === "zh" ? "漆面光点场景导航" : "Lacquer sheen scene navigation"}
      onPointerCancel={(event) => {
        event.stopPropagation();
        setHeld(false);
      }}
      onPointerDown={(event) => {
        event.stopPropagation();
        setHeld(true);
      }}
      onPointerLeave={(event) => {
        event.stopPropagation();
        setHeld(false);
      }}
      onPointerUp={(event) => {
        event.stopPropagation();
        setHeld(false);
      }}
    >
      <span className={styles.navigationHint}>
        {language === "zh" ? "按住显露 · 点击跳转" : "hold to reveal · click to move"}
      </span>
      <div className={styles.navigationLoci}>
        {SCENE_IDS.map((sceneId) => {
          const active = sceneId === scene;
          const copy = getCopy(sceneId, language);
          return (
            <button
              type="button"
              className={styles.navigationButton}
              data-active={active ? "true" : "false"}
              aria-current={active ? "step" : undefined}
              aria-label={
                language === "zh"
                  ? `跳转到场景 ${sceneId}：${copy.kicker}`
                  : `Jump to scene ${sceneId}: ${copy.kicker}`
              }
              key={sceneId}
              onClick={(event) => {
                event.stopPropagation();
                onNavigate?.(sceneId, 0);
              }}
            >
              <span className={styles.navigationIndex}>{String(sceneId).padStart(2, "0")}</span>
              <span className={styles.navigationName}>{copy.kicker.replace(/^\d+\s*\/\s*/, "")}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

export function getMetadata(language: Lang): StyleMetadata {
  return {
    id: "after-hours-luxe",
    band: "contemporary-digital",
    name: language === "zh" ? "午夜奢华" : "After-Hours Luxe",
    theme: language === "zh" ? "漆的固化" : "Urushi Cure",
    densityLabel: language === "zh" ? "舞台冲击" : "Stage impact",
    heroScene: 4,
    colors: {
      bg: "#0b0807",
      ink: "#f1e4cf",
      panel: "#241310",
    },
    typography: {
      header: "Didot / Songti SC",
      body: "Avenir Next / PingFang SC",
    },
    tags: [
      "after-hours-luxe",
      "urushi",
      "material-transformation",
      "stage-impact",
      "single-accent",
      "motion-3-of-5",
      "lacquer-sheen",
    ],
    fonts: [
      "Didot",
      "Bodoni 72",
      "Avenir Next",
      "SF Mono",
      "cjk:Songti SC",
      "cjk:PingFang SC",
    ],
    scenes: SCENE_IDS.map((sceneId) => {
      const copy = getCopy(sceneId, language);
      return {
        id: sceneId,
        title: copy.kicker,
        beats: copy.beats,
      };
    }),
  };
}

export default function UrushiCure({
  scene,
  beat,
  language,
  isThumbnail,
  reducedMotion,
  onNavigate,
}: BespokeStyleProps) {
  const currentScene = SCENES[scene] ? scene : 1;
  const safeBeat = clampBeat(currentScene, beat);
  const motionOff = reducedMotion || isThumbnail;

  return (
    <div
      className={styles.root}
      data-motion={motionOff ? "off" : "on"}
      data-thumbnail={isThumbnail ? "true" : "false"}
    >
      <div className={styles.hairlineFrame} aria-hidden="true" />
      <div className={styles.materialGlow} aria-hidden="true" />
      <SpatialSceneTrack
        beat={safeBeat}
        beatLayoutModes={BEAT_LAYOUT_MODES}
        className={styles.track}
        reducedMotion={motionOff}
        renderScene={(sceneId, sceneBeat, isActive) => (
          <ScenePanel
            beat={sceneBeat}
            isActive={isActive}
            language={language}
            sceneId={sceneId}
          />
        )}
        scene={currentScene}
        sceneIds={SCENE_IDS.slice()}
        transitionDurationMs={1100}
        transitionKind="focus-swap"
        transitionMap={TRANSITION_MAP}
        transitionModifierMap={TRANSITION_MODIFIER_MAP}
      />
      {!isThumbnail && (
        <LacquerSheenNavigation
          language={language}
          onNavigate={onNavigate}
          scene={currentScene}
        />
      )}
    </div>
  );
}

export const urushiCureTopic = defineStyleTopic({
  id: "urushi-cure",
  topic: {
    en: "Urushi Cure",
    zh: "漆的固化",
  },
  model: "GPT-5.5",
  component: UrushiCure,
  getMetadata,
  navigation: {
    geometry: "ambient",
    carrier: "lacquer-sheen-loci",
    invocation: "gesture-hold",
    feedback: "typographic-emphasis",
  },
  sources: urushiCureSources,
  transitionScore: urushiCureTransitionScore,
});

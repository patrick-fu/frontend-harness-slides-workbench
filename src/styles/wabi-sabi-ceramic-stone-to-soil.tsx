import { useEffect } from "react";
import type React from "react";
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
import styles from "./wabi-sabi-ceramic-stone-to-soil.module.css";

type Language = BespokeStyleProps["language"];
type SceneId = 1 | 2 | 3 | 4 | 5;

interface BeatCopy {
  action: string;
  title: string;
  body: string;
}

interface SceneCopy {
  folio: string;
  sceneTitle: string;
  title: string;
  thesis: string;
  evidence: string;
  beats: BeatCopy[];
}

const SCENE_IDS: SceneId[] = [1, 2, 3, 4, 5];
const BEAT_COUNTS: Record<SceneId, number> = {
  1: 2,
  2: 3,
  3: 3,
  4: 3,
  5: 1,
};

const BEAT_LAYOUT_MODES: Partial<Record<number, BeatLayoutMode>> = {
  1: "reserved",
  2: "reserved",
  3: "reserved",
  4: "reserved",
};

export const STONE_TO_SOIL_TRANSITION_SCORE = {
  "1->2": "ink-spread",
  "2->3": "dolly-pull",
  "3->4": "ink-spread",
  "4->5": "iris-open",
} as const satisfies Readonly<TopicTransitionScore>;

const TRANSITION_MAP: SceneTransitionMap = STONE_TO_SOIL_TRANSITION_SCORE;

export const STONE_TO_SOIL_SOURCES = [
  {
    authority: "U.S. Geological Survey",
    title: "Environmental Characteristics of Clays and Clay Mineral Deposits",
    citation: "USGS Information Handout, “Environmental Characteristics of Clays and Clay Mineral Deposits,” accessed 2026.",
    url: "https://pubs.usgs.gov/info/clays/",
    supports:
      "Supports the opening mechanism: weathering combines physical disaggregation with chemical decomposition, proceeds unevenly, and is governed by parent rock, water-to-rock ratio, temperature, organisms, and time while forming new clay minerals.",
    boundary:
      "This is a general clay and weathering reference rather than a profile-specific basalt study; the Topic therefore uses it for process factors, not for the mineral proportions or field numbers shown later.",
  },
  {
    authority: "Food and Agriculture Organization of the United Nations",
    title: "Ferralsols — Diagnostic Properties and Modal Concept",
    citation: "FAO, World Soil Resources material, “Part 1 Ferralsols,” sections 1.1.1–1.1.2.",
    url: "https://www.fao.org/4/x5867e/x5867e03.htm",
    supports:
      "Supports the profile interpretation: strong tropical weathering decomposes most primary weatherable minerals; free drainage removes silica and bases; kaolinite and sesquioxides dominate, while oxidized iron stains small particles yellowish or reddish.",
    boundary:
      "Ferralsols are a broad soil group and do not describe every basalt-derived soil; parent material, drainage, landscape age, organic matter, and local moisture conditions can yield different horizons and colors.",
  },
  {
    authority: "The Clay Minerals Society",
    title: "Weathering of Basalt: Changes in Rock Chemistry and Mineralogy",
    citation: "Eggleton, R. A., Foudoulis, C., and Varkevisser, D. Clays and Clay Minerals 35 (1987): 161–169. doi:10.1346/CCMN.1987.0350301.",
    url: "https://doi.org/10.1346/CCMN.1987.0350301",
    supports:
      "Supports selective mineral change rather than uniform crumbling: glass and olivine weather more readily than plagioclase and pyroxene, and more altered basalt rinds contain secondary halloysite and goethite alongside changing smectite assemblages.",
    boundary:
      "The reported sequence belongs to the sampled basalt core-stones; the three evidence trays are a conceptual classification of loss, residual enrichment, and neoformation, not a universal reaction recipe.",
  },
  {
    authority: "University of the Philippines Los Baños Digital Repository",
    title: "Weathering of Basaltic Rock and Clay Mineral Formation in Leyte, Philippines",
    citation: "Asio, V. B., and John, R. F. The Philippine Agricultural Scientist 90, no. 3 (2007): 222–230.",
    url: "https://www.ukdr.uplb.edu.ph/journal-articles/6111/",
    supports:
      "Supports the field-case plate: a humid tropical Leyte site averaged about 2,700 millimetres of annual rainfall and 28 degrees Celsius, had a roughly four-metre yellowish-red weathering profile, lost Ca, Mg, K, Na and some Si, and accumulated Fe, Al, water, kaolinite, halloysite, and goethite.",
    boundary:
      "The numerical climate and depth values describe one Leyte study site and are explicitly labelled as a field case; they must not be read as thresholds or expected dimensions for all tropical basalt soils.",
  },
  {
    authority: "U.S. National Park Service",
    title: "Igneous Rocks — Basalt and Rock Descriptors",
    citation:
      "National Park Service, Geology, “Igneous Rocks,” Basalt and Rock Descriptors sections, updated November 8, 2023; accessed July 10, 2026.",
    url: "https://www.nps.gov/subjects/geology/igneous.htm",
    supports:
      "Supports the opening specimen description: basalt is typically dark, commonly vesicular, and may have an aphanitic (fine-grained) or porphyritic texture; vesicles are cavities formed by expanding gas in fluid lava.",
    boundary:
      "Basalt textures vary. The source says commonly rather than invariably vesicular and allows either aphanitic or porphyritic texture, so the drawing selects one fine-grained vesicular specimen instead of treating every basalt as identical.",
  },
] as const satisfies readonly (TopicSource & { boundary: string })[];

const COPY: Record<SceneId, Record<Language, SceneCopy>> = {
  1: {
    en: {
      folio: "MATERIAL SAMPLE · 01",
      sceneTitle: "Stone object",
      title: "STONE, BEFORE SOIL",
      thesis:
        "Basalt is typically dark and commonly vesicular; aphanitic basalt is fine-grained. This drawing selects one such specimen.",
      evidence: "NPS basalt lithology · selected texture, not universal [S5]",
      beats: [
        {
          action: "Set a fresh basalt specimen on the work surface.",
          title: "Fresh basalt",
          body: "A fine-grained volcanic rock is the parent material—not a bowl standing in for rock.",
        },
        {
          action: "Sweep grazing light across cavities and rough edges.",
          title: "A real texture, not a symbol",
          body: "Vesicles are gas-formed cavities; basalt can also be non-vesicular or porphyritic.",
        },
      ],
    },
    zh: {
      folio: "材料样片 · 01",
      sceneTitle: "岩石样本",
      title: "成土之前，先是一块石头",
      thesis: "玄武岩通常色暗，也常见气孔；隐晶质玄武岩颗粒细小。这幅图选取了其中一种样本。",
      evidence: "NPS 玄武岩岩性 · 选取纹理，不代表所有玄武岩 [S5]",
      beats: [
        {
          action: "把一块新鲜玄武岩置于工作台面。",
          title: "新鲜玄武岩",
          body: "细粒火山岩是母质；画面没有用陶碗假装岩石。",
        },
        {
          action: "用掠射光扫过空腔和粗糙边缘。",
          title: "真实纹理，不是符号",
          body: "气孔是流动熔岩中气体膨胀形成的空腔；玄武岩也可以无气孔或呈斑状结构。",
        },
      ],
    },
  },
  2: {
    en: {
      folio: "WET SURFACE · 02",
      sceneTitle: "Water enters",
      title: "WATER DOES NOT ERASE IT",
      thesis:
        "A film wets the surface. Water follows connected fractures; the outer rind changes before the core.",
      evidence: "Uneven weathering and water-to-rock contact [S1, S3]",
      beats: [
        {
          action: "Lay a thin water film across the upper face.",
          title: "Wet the surface",
          body: "The first change is contact, not disappearance.",
        },
        {
          action: "Trace water along connected pores and fractures.",
          title: "Enter by openings",
          body: "Fractures give water access to fresh mineral surfaces inside the stone.",
        },
        {
          action: "Differentiate the altered rind from the dark core.",
          title: "A rind records reaction",
          body: "Color and roughness can shift by zones while an intact core remains.",
        },
      ],
    },
    zh: {
      folio: "湿润表面 · 02",
      sceneTitle: "水进入",
      title: "水不是把石头抹掉",
      thesis: "薄薄水膜先润湿表面，再沿连通裂隙进入；外层先于岩芯改变。",
      evidence: "不均匀风化与水岩接触 [S1, S3]",
      beats: [
        {
          action: "让一层薄水膜覆盖岩石上表面。",
          title: "先润湿表面",
          body: "最初发生的是接触，而不是消失。",
        },
        {
          action: "沿连通孔隙和裂隙追踪水。",
          title: "从开口进入",
          body: "裂隙让水接触石头内部尚新的矿物表面。",
        },
        {
          action: "区分改变的风化壳和深色岩芯。",
          title: "风化壳记录反应",
          body: "颜色与粗糙度可以分区变化，内部岩芯仍然完整。",
        },
      ],
    },
  },
  3: {
    en: {
      folio: "EVIDENCE TRAYS · 03",
      sceneTitle: "Mineral sorting",
      title: "A ROCK SORTS ITSELF",
      thesis:
        "Weathering is selective: some elements leave in water, some become relatively concentrated, and new minerals assemble.",
      evidence: "Conceptual mass-balance trays · proportions are not literal [S3, S4]",
      beats: [
        {
          action: "Separate mobile cations into the leached evidence tray.",
          title: "LEACHED",
          body: "Ca · Mg · Na · K—and some Si—can leave with drainage water.",
        },
        {
          action: "Expose the relatively enriched residual material.",
          title: "RESIDUAL",
          body: "Fe and Al become more prominent as more mobile material is removed.",
        },
        {
          action: "Set newly formed clays and iron oxyhydroxides into a third tray.",
          title: "NEOFORMED",
          body: "Kaolinite, halloysite, and goethite can appear in strongly altered basalt profiles.",
        },
      ],
    },
    zh: {
      folio: "证据托盘 · 03",
      sceneTitle: "矿物分选",
      title: "岩石在风化中重新分配",
      thesis: "风化具有选择性：一部分随水离开，一部分相对富集，新的矿物重新生成。",
      evidence: "概念性质量平衡托盘 · 比例并非实测复刻 [S3, S4]",
      beats: [
        {
          action: "把易迁移阳离子分到淋溶证据层。",
          title: "淋溶 LEACHED",
          body: "Ca、Mg、Na、K 与部分 Si 可随排水离开。",
        },
        {
          action: "显露相对富集的残留材料。",
          title: "残留 RESIDUAL",
          body: "较易迁移的物质离开后，Fe 与 Al 在残留物中更突出。",
        },
        {
          action: "把新生黏土和铁氧羟化物放入第三层。",
          title: "新生 NEOFORMED",
          body: "高强度风化剖面中可出现高岭石、埃洛石与针铁矿。",
        },
      ],
    },
  },
  4: {
    en: {
      folio: "FIELD SECTION · 04",
      sceneTitle: "Soil profile",
      title: "THE PROFILE KEEPS THE HISTORY",
      thesis:
        "A soil profile is layered evidence: living surface, red weathered soil, soft saprolite, and basalt below.",
      evidence: "Leyte field case—not a universal profile [S2, S4]",
      beats: [
        {
          action: "Set fresh basalt beneath a softened saprolite boundary.",
          title: "Rock becomes regolith",
          body: "The boundary advances through altered mineral fabric, not a single clean break.",
        },
        {
          action: "Settle clay-rich material above the weathering front.",
          title: "Fine material gathers",
          body: "New clays and residual oxides form a porous, friable body above the rock.",
        },
        {
          action: "Tint the aerated soil with oxidized iron and attach the field note.",
          title: "Iron oxides tint the profile",
          body: "Red is evidence of iron mineral state and drainage—not proof that the soil is crushed rock powder.",
        },
      ],
    },
    zh: {
      folio: "田野剖面 · 04",
      sceneTitle: "土壤剖面",
      title: "剖面保存了风化历史",
      thesis: "土壤剖面是一组分层证据：表层生命、红色风化土、松软风化层，以及下方玄武岩。",
      evidence: "莱特岛田野案例，并非普遍剖面 [S2, S4]",
      beats: [
        {
          action: "把新鲜玄武岩置于松软风化层之下。",
          title: "岩石成为风化物",
          body: "界面沿被改变的矿物组织推进，不是一刀切开的边界。",
        },
        {
          action: "让富含黏土的细料沉积在风化前缘之上。",
          title: "细料聚集",
          body: "新生黏土与残留氧化物在岩石上方形成多孔、松散的材料体。",
        },
        {
          action: "以氧化铁给通气土层着色，并附上田野注记。",
          title: "铁氧化物给剖面着色",
          body: "红色说明铁矿物状态与排水条件，不证明土壤只是被磨碎的岩粉。",
        },
      ],
    },
  },
  5: {
    en: {
      folio: "HELD EARTH · 05",
      sceneTitle: "Bowl of earth",
      title: "STONE, REARRANGED",
      thesis:
        "This red earth is a residue remade by water, warmth, drainage, and time—not ground rock alone.",
      evidence: "Material conclusion · bowl holds soil; it does not impersonate the rock",
      beats: [
        {
          action: "Hold the transformed material without further motion.",
          title: "What remains has changed",
          body: "Loss, residual enrichment, and new minerals make soil a new material history.",
        },
      ],
    },
    zh: {
      folio: "捧起土壤 · 05",
      sceneTitle: "一碗红土",
      title: "石头，被重新组成",
      thesis: "这撮红土是水、热、排水与时间重塑的残留物，不只是被磨碎的岩石。",
      evidence: "材料结论 · 陶碗盛土，但不扮演岩石",
      beats: [
        {
          action: "让转化后的材料静止留在手边。",
          title: "留下来的已经不同",
          body: "流失、相对富集与新生矿物共同写成一种新的材料历史。",
        },
      ],
    },
  },
};

const NAV_LABELS: Record<Language, string[]> = {
  en: ["Basalt", "Water enters", "Mineral sorting", "Soil profile", "Earth held"],
  zh: ["玄武岩", "水进入", "矿物分选", "土壤剖面", "捧起红土"],
};

function useFonts() {
  useEffect(() => {
    if (typeof document === "undefined") return;
    const id = "wabi-sabi-stone-to-soil-fonts";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Alegreya+Sans:wght@400;500&family=Noto+Serif+SC:wght@400;500&display=swap";
    document.head.appendChild(link);
  }, []);
}

function clampScene(scene: number): SceneId {
  return Math.max(1, Math.min(5, Math.round(scene))) as SceneId;
}

function clampBeat(scene: SceneId, beat: number, isThumbnail = false): number {
  if (isThumbnail) return BEAT_COUNTS[scene] - 1;
  return Math.max(0, Math.min(BEAT_COUNTS[scene] - 1, Math.round(beat)));
}

function cx(...classes: Array<string | false | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

function MaterialHeader({
  copy,
  beat,
}: {
  copy: SceneCopy;
  beat: number;
}) {
  const current = copy.beats[beat] ?? copy.beats[0];
  return (
    <header className={styles.materialHeader} data-beat-layout-item="true">
      <div className={styles.folioRow}>
        <span>{copy.folio}</span>
        <span>{copy.sceneTitle}</span>
      </div>
      <h1>{copy.title}</h1>
      <p className={styles.thesis}>{copy.thesis}</p>
      <div
        className={styles.currentObservation}
        aria-live="polite"
        data-beat-layout-item="true"
      >
        <span>{String(beat + 1).padStart(2, "0")}</span>
        <div>
          <strong>{current.title}</strong>
          <p>{current.body}</p>
        </div>
      </div>
      <p className={styles.evidence} data-beat-layout-item="true">
        {copy.evidence}
      </p>
    </header>
  );
}

function BasaltSpecimen({ beat }: { beat: number }) {
  return (
    <div className={styles.specimenComposition} data-beat-layout-item="true">
      <svg
        className={styles.specimenSvg}
        viewBox="0 0 920 620"
        role="img"
        aria-label="Hand-drawn dark basalt specimen with vesicles and a grazing light path"
      >
        <ellipse className={styles.tableShadow} cx="446" cy="514" rx="298" ry="52" />
        <path
          className={styles.basaltBody}
          d="M188 428 C154 348 190 210 278 154 C358 102 514 86 632 148 C734 202 758 332 690 422 C630 500 264 520 188 428Z"
        />
        <path
          className={styles.basaltPlane}
          d="M226 350 C266 200 420 132 596 160 C676 174 708 244 696 316 C614 286 548 300 466 348 C376 398 294 406 226 350Z"
        />
        {[
          [300, 244, 18],
          [386, 184, 11],
          [512, 222, 24],
          [606, 280, 15],
          [352, 352, 14],
          [558, 390, 10],
          [244, 402, 8],
        ].map(([cxValue, cyValue, radius], index) => (
          <circle
            key={`${cxValue}-${cyValue}`}
            className={styles.vesicle}
            cx={cxValue}
            cy={cyValue}
            r={radius}
            data-index={index}
          />
        ))}
        <path
          className={styles.dryFracture}
          d="M648 190 L594 254 L610 322 L540 382 L518 452"
        />
        <path
          className={styles.grazingLight}
          data-visible={beat >= 1 ? "true" : "false"}
          d="M238 186 C346 116 558 110 680 204"
        />
      </svg>
      <div className={styles.specimenTag}>
        <span>B–01</span>
        <strong>BASALT SPECIMEN</strong>
        <small>NOT CERAMIC · ORIGINAL DRAWING</small>
      </div>
      <div
        className={styles.poreNote}
        data-visible={beat >= 1 ? "true" : "false"}
      >
        <span aria-hidden="true" />
        <p>VESICLE / FRACTURE / ROUGH FACE</p>
      </div>
    </div>
  );
}

function WetSurface({ beat, language }: { beat: number; language: Language }) {
  return (
    <div className={styles.wetComposition} data-beat-layout-item="true">
      <svg
        className={styles.wetSvg}
        viewBox="0 0 980 650"
        role="img"
        aria-label={
          language === "zh"
            ? "水膜沿玄武岩裂隙进入，并留下分区风化壳"
            : "Water film following basalt fractures and leaving a zoned weathering rind"
        }
      >
        <path
          className={styles.wetRockOuter}
          d="M144 474 C88 374 122 208 248 126 C360 54 568 54 744 128 C868 182 908 328 820 454 C736 570 230 592 144 474Z"
        />
        <path
          className={styles.weatheredRind}
          data-visible={beat >= 2 ? "true" : "false"}
          d="M164 442 C122 348 162 222 272 150 C382 78 566 82 724 146 C824 188 852 304 790 408 C724 514 250 542 164 442Z M248 400 C208 336 246 252 330 210 C422 166 564 170 676 214 C732 240 746 322 700 378 C642 446 314 466 248 400Z"
          fillRule="evenodd"
        />
        <path
          className={styles.wetCore}
          d="M248 400 C208 336 246 252 330 210 C422 166 564 170 676 214 C732 240 746 322 700 378 C642 446 314 466 248 400Z"
        />
        <path
          className={styles.surfaceWater}
          data-visible={beat >= 0 ? "true" : "false"}
          d="M168 206 C296 86 628 70 820 190"
        />
        <path
          className={styles.wetFracture}
          data-visible={beat >= 1 ? "true" : "false"}
          d="M510 116 L476 206 L522 276 L468 356 L492 468"
        />
        <path
          className={styles.wetFractureFine}
          data-visible={beat >= 1 ? "true" : "false"}
          d="M476 206 L378 174 M522 276 L642 226 M468 356 L338 418"
        />
        {[0, 1, 2, 3, 4].map((drop) => (
          <circle
            key={drop}
            className={styles.waterDrop}
            data-visible={beat >= 1 ? "true" : "false"}
            cx={480 + (drop % 2) * 34}
            cy={164 + drop * 58}
            r={8 - (drop % 3)}
          />
        ))}
      </svg>
      <div className={styles.wetLegend} data-beat-layout-item="true">
        <div data-visible={beat >= 0 ? "true" : "false"}>
          <span className={styles.legendWater} />
          {language === "zh" ? "表面水膜" : "surface film"}
        </div>
        <div data-visible={beat >= 1 ? "true" : "false"}>
          <span className={styles.legendFracture} />
          {language === "zh" ? "裂隙通道" : "fracture access"}
        </div>
        <div data-visible={beat >= 2 ? "true" : "false"}>
          <span className={styles.legendRind} />
          {language === "zh" ? "改变的风化壳" : "altered rind"}
        </div>
      </div>
      <p className={styles.noMagicNote}>
        {language === "zh"
          ? "不是溶解魔法：岩芯与风化壳可以同时存在。"
          : "NO DISSOLVE EFFECT · CORE AND RIND COEXIST"}
      </p>
    </div>
  );
}

interface EvidenceTrayProps {
  index: number;
  title: string;
  formula: string;
  note: string;
  visible: boolean;
}

function EvidenceTray({
  index,
  title,
  formula,
  note,
  visible,
}: EvidenceTrayProps) {
  return (
    <article
      className={styles.evidenceTray}
      data-visible={visible ? "true" : "false"}
      data-beat-layout-item="true"
    >
      <div className={styles.trayIndex}>{String(index + 1).padStart(2, "0")}</div>
      <div className={styles.trayShard} aria-hidden="true">
        <i />
        <i />
        <i />
        <i />
      </div>
      <div className={styles.trayCopy}>
        <h2>{title}</h2>
        <strong>{formula}</strong>
        <p>{note}</p>
      </div>
      <span className={styles.trayDirection} aria-hidden="true">
        {index === 0 ? "↗" : index === 1 ? "↓" : "✦"}
      </span>
    </article>
  );
}

function MineralFragments({ beat, language }: { beat: number; language: Language }) {
  const trays =
    language === "zh"
      ? [
          ["淋溶 LEACHED", "Ca · Mg · Na · K · 部分 Si", "随排水迁移；不是所有元素同速离开。"],
          ["残留 RESIDUAL", "Fe · Al 相对富集", "移动组分减少后，残留组分的比例上升。"],
          ["新生 NEOFORMED", "高岭石 · 埃洛石 · 针铁矿", "原生矿物被改变，新矿物在风化环境中形成。"],
        ]
      : [
          ["LEACHED", "Ca · Mg · Na · K · some Si", "Carried with drainage; elements do not leave at one rate."],
          ["RESIDUAL", "relative Fe · Al enrichment", "As mobile matter leaves, residual components become proportionally stronger."],
          ["NEOFORMED", "kaolinite · halloysite · goethite", "Primary minerals alter while new minerals assemble in the weathering environment."],
        ];

  return (
    <div className={styles.fragmentComposition} data-beat-layout-item="true">
      <div className={styles.trayStack}>
        {trays.map(([title, formula, note], index) => (
          <EvidenceTray
            key={title}
            index={index}
            title={title}
            formula={formula}
            note={note}
            visible={beat >= index}
          />
        ))}
      </div>
      <aside className={styles.massBalanceNote} data-beat-layout-item="true">
        <span>{language === "zh" ? "读法" : "HOW TO READ"}</span>
        <p>
          {language === "zh"
            ? "三层表示证据类别，不表示等量，也不是一块石头瞬间碎成三种材料。"
            : "Three evidence classes—not equal quantities, and not an instant split of one stone."}
        </p>
      </aside>
    </div>
  );
}

function SoilProfile({ beat, language }: { beat: number; language: Language }) {
  return (
    <div className={styles.profileComposition} data-beat-layout-item="true">
      <svg
        className={styles.profileSvg}
        viewBox="0 0 920 690"
        role="img"
        aria-label={
          language === "zh"
            ? "从新鲜玄武岩到红色风化土的手绘剖面"
            : "Hand-drawn profile from fresh basalt to red weathered soil"
        }
      >
        <path
          className={styles.profileSurface}
          d="M92 94 C220 72 342 112 462 88 C602 60 718 104 840 82 L840 154 C694 174 562 136 440 166 C306 194 204 150 92 170Z"
        />
        <path
          className={styles.profileTopsoil}
          data-visible={beat >= 1 ? "true" : "false"}
          d="M92 170 C210 150 310 196 440 166 C562 136 694 174 840 154 L840 252 C690 268 568 226 430 260 C306 292 198 244 92 266Z"
        />
        <path
          className={styles.profileRedSoil}
          data-visible={beat >= 1 ? "true" : "false"}
          d="M92 266 C198 244 306 292 430 260 C568 226 690 268 840 252 L840 446 C706 420 592 466 454 438 C320 410 210 454 92 426Z"
        />
        <path
          className={styles.profileSaprolite}
          data-visible={beat >= 0 ? "true" : "false"}
          d="M92 426 C210 454 320 410 454 438 C592 466 706 420 840 446 L840 572 C714 536 596 592 462 550 C326 510 222 574 92 542Z"
        />
        <path
          className={styles.profileBasalt}
          d="M92 542 C222 574 326 510 462 550 C596 592 714 536 840 572 L840 654 L92 654Z"
        />
        <path
          className={styles.profileWeatherFront}
          data-visible={beat >= 0 ? "true" : "false"}
          d="M102 548 C226 570 332 516 460 554 C590 590 714 542 830 578"
        />
        {[
          [184, 500, 28],
          [310, 534, 18],
          [540, 512, 22],
          [718, 528, 30],
        ].map(([cxValue, cyValue, radius]) => (
          <circle
            key={`${cxValue}-${cyValue}`}
            className={styles.coreStone}
            cx={cxValue}
            cy={cyValue}
            r={radius}
          />
        ))}
        <g className={styles.oxideMarks} data-visible={beat >= 2 ? "true" : "false"}>
          {Array.from({ length: 26 }, (_, index) => (
            <circle
              key={index}
              cx={132 + (index % 9) * 82 + (index % 2) * 12}
              cy={298 + Math.floor(index / 9) * 58 + (index % 3) * 8}
              r={4 + (index % 3)}
            />
          ))}
        </g>
        <g className={styles.profileLabels}>
          <text x="112" y="132">{language === "zh" ? "有机表层" : "LIVING SURFACE"}</text>
          <text x="112" y="228">{language === "zh" ? "表土" : "TOPSOIL"}</text>
          <text x="112" y="362">{language === "zh" ? "红色风化土" : "RED WEATHERED SOIL"}</text>
          <text x="112" y="500">{language === "zh" ? "风化岩层" : "SAPROLITE"}</text>
          <text x="112" y="626">{language === "zh" ? "玄武岩" : "BASALT"}</text>
        </g>
      </svg>
      <aside
        className={styles.fieldCase}
        data-visible={beat >= 2 ? "true" : "false"}
        data-beat-layout-item="true"
      >
        <span>{language === "zh" ? "莱特岛田野案例" : "Leyte field case"}</span>
        <dl>
          <div>
            <dt>{language === "zh" ? "年雨量" : "rainfall"}</dt>
            <dd>2,700 mm yr⁻¹</dd>
          </div>
          <div>
            <dt>{language === "zh" ? "年均温" : "mean temperature"}</dt>
            <dd>28 °C</dd>
          </div>
          <div>
            <dt>{language === "zh" ? "剖面深度" : "profile depth"}</dt>
            <dd>≈ 4 m</dd>
          </div>
        </dl>
        <p>
          {language === "zh"
            ? "一个地点的测量值，不是成土门槛。"
            : "Measured at one site—not soil-forming thresholds."}
        </p>
      </aside>
      <div
        className={styles.oxideCaption}
        data-visible={beat >= 2 ? "true" : "false"}
      >
        {language === "zh"
          ? "氧化铁给通气剖面染上红、黄颜色 [S2]"
          : "IRON OXIDES TINT AN AERATED PROFILE RED / YELLOW [S2]"}
      </div>
    </div>
  );
}

function BowlOfEarth({ language }: { language: Language }) {
  return (
    <div
      className={styles.bowlComposition}
      data-beat-layout-item="true"
      data-still="true"
    >
      <svg
        className={styles.bowlSvg}
        viewBox="0 0 960 690"
        role="img"
        aria-label={
          language === "zh"
            ? "一只不完美的哑光陶碗盛着红土"
            : "An imperfect matte ceramic bowl holding red earth"
        }
      >
        <ellipse className={styles.bowlShadow} cx="506" cy="566" rx="246" ry="40" />
        <path
          className={styles.bowlBody}
          d="M236 286 C322 244 706 250 782 296 C760 456 672 550 514 566 C354 550 262 454 236 286Z"
        />
        <path
          className={styles.bowlLip}
          d="M236 286 C326 344 704 346 782 296 C710 232 322 226 236 286Z"
        />
        <path
          className={styles.earthMound}
          d="M274 288 C354 206 674 206 748 292 C638 330 382 332 274 288Z"
        />
        <path
          className={styles.earthRidge}
          d="M340 272 C416 232 552 230 674 278"
        />
        {Array.from({ length: 34 }, (_, index) => (
          <circle
            key={index}
            className={styles.earthGrain}
            cx={332 + (index % 10) * 38 + (index % 3) * 7}
            cy={258 + Math.floor(index / 10) * 18 + (index % 4) * 4}
            r={3 + (index % 3)}
          />
        ))}
      </svg>
      <div className={styles.closingLine}>
        <span aria-hidden="true" />
        <p>
          {language === "zh"
            ? "不是碎石粉。是一段被水、热与时间重写的材料史。"
            : "NOT GROUND ROCK ALONE · A MATERIAL HISTORY REWRITTEN BY WATER, WARMTH, AND TIME"}
        </p>
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
  const copy = COPY[sceneId][language];
  const safeBeat = clampBeat(sceneId, beat);
  const compositions = {
    1: "stone-object",
    2: "wet-surface",
    3: "mineral-fragments",
    4: "soil-profile",
    5: "bowl-of-earth",
  } satisfies Record<SceneId, string>;

  return (
    <section
      className={cx(styles.scene, styles[`scene${sceneId}`])}
      data-composition={compositions[sceneId]}
      data-scene-id={sceneId}
    >
      <MaterialHeader copy={copy} beat={safeBeat} />
      {sceneId === 1 && <BasaltSpecimen beat={safeBeat} />}
      {sceneId === 2 && <WetSurface beat={safeBeat} language={language} />}
      {sceneId === 3 && <MineralFragments beat={safeBeat} language={language} />}
      {sceneId === 4 && <SoilProfile beat={safeBeat} language={language} />}
      {sceneId === 5 && <BowlOfEarth language={language} />}
    </section>
  );
}

const SHARD_POSITIONS = [
  { x: "5.4cqw", y: "0cqh", rotation: "-9deg", activeX: "0cqw", activeY: "-0.55cqh" },
  { x: "9.6cqw", y: "3.1cqh", rotation: "13deg", activeX: "0.5cqw", activeY: "-0.2cqh" },
  { x: "8.2cqw", y: "8.5cqh", rotation: "-17deg", activeX: "0.4cqw", activeY: "0.42cqh" },
  { x: "2.3cqw", y: "9.2cqh", rotation: "8deg", activeX: "-0.35cqw", activeY: "0.45cqh" },
  { x: "0cqw", y: "3.8cqh", rotation: "-15deg", activeX: "-0.55cqw", activeY: "0cqh" },
] as const;

function ShardNavigation({
  activeScene,
  language,
  onNavigate,
}: {
  activeScene: SceneId;
  language: Language;
  onNavigate?: (scene: number, beat: number) => void;
}) {
  const navigate = (target: number) => {
    onNavigate?.(Math.max(1, Math.min(5, target)), 0);
  };
  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLButtonElement>,
    sceneId: SceneId,
  ) => {
    event.stopPropagation();
    if (event.repeat) return;
    const targetByKey: Partial<Record<string, number>> = {
      ArrowRight: sceneId + 1,
      ArrowDown: sceneId + 1,
      ArrowLeft: sceneId - 1,
      ArrowUp: sceneId - 1,
      Home: 1,
      End: 5,
    };
    const target = targetByKey[event.key];
    if (target === undefined) return;
    event.preventDefault();
    navigate(target);
  };

  return (
    <nav
      className={styles.shardNavigation}
      aria-label={language === "zh" ? "陶片环场景导航" : "Ceramic shard scene navigation"}
      data-topic-navigation="true"
      data-navigation-geometry="object-controller"
      data-navigation-carrier="ceramic-shard-ring"
      data-navigation-invocation="persistent"
      data-navigation-feedback="mechanical-displacement"
      onPointerDown={(event) => event.stopPropagation()}
      onTouchStart={(event) => event.stopPropagation()}
      onClick={(event) => event.stopPropagation()}
    >
      <div className={styles.ringKernel} aria-hidden="true">
        <span />
      </div>
      {SCENE_IDS.map((sceneId, index) => {
        const position = SHARD_POSITIONS[index];
        const active = sceneId === activeScene;
        const label = NAV_LABELS[language][index];
        const shardStyle = {
          "--shard-x": position.x,
          "--shard-y": position.y,
          "--shard-rotation": position.rotation,
          "--active-shift-x": position.activeX,
          "--active-shift-y": position.activeY,
        } as React.CSSProperties;
        return (
          <button
            key={sceneId}
            type="button"
            className={styles.shardButton}
            style={shardStyle}
            aria-label={
              language === "zh"
                ? `陶片 ${sceneId}：${label}`
                : `Fragment ${sceneId}: ${label}`
            }
            aria-current={active ? "step" : undefined}
            data-active={active ? "true" : "false"}
            data-mechanical-offset={active ? "true" : undefined}
            onClick={(event) => {
              event.stopPropagation();
              navigate(sceneId);
            }}
            onKeyDown={(event) => handleKeyDown(event, sceneId)}
          >
            <span>{String(sceneId).padStart(2, "0")}</span>
          </button>
        );
      })}
    </nav>
  );
}

export function getMetadata(language: Language): StyleMetadata {
  return {
    id: "wabi-sabi-ceramic",
    band: "minimal-keynote",
    name: language === "zh" ? "侘寂陶器" : "Wabi-Sabi Ceramic",
    theme: language === "zh" ? "石头如何成为土壤" : "Stone Becoming Soil",
    densityLabel: language === "zh" ? "留白 / 材料叙事" : "Sparse / material-led",
    heroScene: 4,
    colors: {
      bg: "#e8dfcf",
      ink: "#39372f",
      panel: "#d7c9b5",
    },
    typography: {
      header: "Alegreya Sans 500",
      body: "Alegreya Sans 400 / Noto Serif SC 400",
    },
    tags: [
      "wabi-sabi",
      "earth-science",
      "basalt",
      "soil",
      "weathering",
      "material",
      "handmade",
      "stage-impact",
      "bilingual",
    ],
    fonts: ["Alegreya Sans", "cjk:Noto Serif SC"],
    scenes: SCENE_IDS.map((sceneId) => {
      const copy = COPY[sceneId][language];
      return {
        id: sceneId,
        title: copy.sceneTitle,
        beats: copy.beats.map((beatCopy, index) => ({
          id: index,
          action: beatCopy.action,
          title: beatCopy.title,
          body: beatCopy.body,
        })),
      };
    }),
  };
}

export default function StoneToSoil({
  scene,
  beat,
  language,
  isThumbnail,
  reducedMotion,
  onNavigate,
}: BespokeStyleProps) {
  useFonts();
  const activeScene = clampScene(scene);
  const motionOff = reducedMotion || isThumbnail;
  const activeBeat = clampBeat(activeScene, beat, isThumbnail);

  return (
    <main
      className={cx(
        styles.root,
        motionOff && styles.motionOff,
        isThumbnail && styles.thumbnail,
      )}
      data-style-id="wabi-sabi-ceramic"
      data-topic-id="stone-to-soil"
      data-current-scene={activeScene}
      data-motion-state={motionOff ? "settled" : "material"}
    >
      <SpatialSceneTrack
        scene={activeScene}
        beat={activeBeat}
        transitionKind="ink-spread"
        transitionMap={TRANSITION_MAP}
        transitionDurationMs={820}
        reducedMotion={motionOff}
        beatLayoutModes={BEAT_LAYOUT_MODES}
        className={styles.track}
        renderScene={(trackScene, trackBeat) => {
          const sceneId = clampScene(trackScene);
          return (
            <ScenePanel
              sceneId={sceneId}
              beat={clampBeat(sceneId, trackBeat, isThumbnail)}
              language={language}
            />
          );
        }}
      />
      {!isThumbnail && (
        <ShardNavigation
          activeScene={activeScene}
          language={language}
          onNavigate={onNavigate}
        />
      )}
    </main>
  );
}

export const stoneToSoilTopic = defineStyleTopic({
  id: "stone-to-soil",
  topic: {
    en: "Stone to Soil",
    zh: "石成土",
  },
  model: "GPT 5.6 Sol",
  component: StoneToSoil,
  getMetadata,
  navigation: {
    geometry: "object-controller",
    carrier: "ceramic-shard-ring",
    invocation: "persistent",
    feedback: "mechanical-displacement",
  },
  sources: STONE_TO_SOIL_SOURCES,
  transitionScore: STONE_TO_SOIL_TRANSITION_SCORE,
});

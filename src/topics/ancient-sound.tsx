import { useEffect, useRef, useState } from "react";
import type { KeyboardEvent, PointerEvent } from "react";
import {
  defineTopic,
  type TopicDefinition,
  type TopicMetadata,
  type TopicNavigation,
  type TopicStageProps,
} from "../domain/topic";
import type { Source } from "../domain/evidence";
import SpatialSceneTrack, {
  type BeatLayoutMode,
  type SceneTransitionKind,
} from "../components/stage/SpatialSceneTrack";
import styles from "./ancient-sound.module.css";

type Language = "en" | "zh";

interface InstrumentCardCopy {
  kicker: string;
  title: string;
  body: string;
  note: string;
}

interface GalleryCopy {
  name: string;
  finding: string;
  qualifier: string;
}

interface EvidenceItemCopy {
  label: string;
  body: string;
}

interface LocalizedCopy {
  fieldLabel: string;
  topic: string;
  nav: string[];
  scene1: {
    eyebrow: string;
    title: string;
    subtitle: string;
    questionLabel: string;
    question: string;
    siteLabel: string;
    siteBody: string;
    planLabel: string;
    planNote: string;
    scopeLabel: string;
    scope: string;
  };
  scene2: {
    eyebrow: string;
    title: string;
    subtitle: string;
    cards: InstrumentCardCopy[];
    boundaryLabel: string;
    boundary: string;
  };
  scene3: {
    eyebrow: string;
    title: string;
    subtitle: string;
    sourceLabel: string;
    sourceBody: string;
    receiverLabel: string;
    receiverBody: string;
    positionsLabel: string;
    positionsBody: string;
    alcoveLabel: string;
    alcoveBody: string;
    methodLabel: string;
    methodBody: string;
    scaleNote: string;
  };
  scene4: {
    eyebrow: string;
    title: string;
    subtitle: string;
    metricLabel: string;
    metric: string;
    metricNote: string;
    galleries: GalleryCopy[];
    uncertaintyLabel: string;
    uncertainty: string;
    legend: string;
  };
  scene5: {
    eyebrow: string;
    title: string;
    subtitle: string;
    observationLabel: string;
    inferenceLabel: string;
    observations: EvidenceItemCopy[];
    inferences: EvidenceItemCopy[];
    boundary: string;
    closing: string;
  };
}

const SCENE_IDS = [1, 2, 3, 4, 5];
const BEAT_COUNTS: Record<number, number> = {
  1: 2,
  2: 4,
  3: 1,
  4: 3,
  5: 1,
};
const BEAT_LAYOUT_MODES: Partial<Record<number, BeatLayoutMode>> = {
  1: "reserved",
  2: "reserved",
  4: "reserved",
};

export const ancientSoundTransitionScore = {
  "1->2": "page-turn",
  "2->3": "crossfade",
  "3->4": "page-turn",
  "4->5": "hard-cut",
} as const satisfies TopicDefinition["transitionScore"];

const INCOMING_TRANSITION_KIND: Record<number, SceneTransitionKind> = {
  1: "page-turn",
  2: ancientSoundTransitionScore["1->2"],
  3: ancientSoundTransitionScore["2->3"],
  4: ancientSoundTransitionScore["3->4"],
  5: ancientSoundTransitionScore["4->5"],
};

export const ancientSoundNavigation = {
  geometry: "card-miniature",
  carrier: "instrument-field-cards",
  invocation: "gesture-hold",
  feedback: "mechanical-displacement",
} as const satisfies TopicNavigation;

const ANCIENT_SOUND_CLAIM_IDS = [
  "site-complex",
  "pututu-count",
  "artifact-experiment",
  "measurement-layout",
  "ofrendas-dimensions",
  "impulse-findings",
  "possible-experience",
] as const;

type AncientSoundClaimId = (typeof ANCIENT_SOUND_CLAIM_IDS)[number];

type AncientSoundSource = Source & {
  id: string;
  claimIds: readonly AncientSoundClaimId[];
};

export const ancientSoundSources = [
  {
    id: "stanford-overview",
    claimIds: ["site-complex"],
    authority: "Stanford University CCRMA",
    title: "Chavín de Huántar Archaeological Acoustics Project",
    citation: "Stanford CCRMA and Archaeology/Anthropology project overview, initiated 2007.",
    url: "https://ccrma.stanford.edu/groups/chavin/",
    supports:
      "Identifies the authorized interdisciplinary field project and its study of Chavín architecture, sound-producing instruments, and setting.",
  },
  {
    id: "stanford-method",
    claimIds: ["artifact-experiment", "measurement-layout", "possible-experience"],
    authority: "Stanford University CCRMA",
    title: "Integrative Archaeoacoustics",
    citation: "Chavín de Huántar Archaeological Acoustics Project methods page.",
    url: "https://ccrma.stanford.edu/groups/chavin/project.html",
    supports:
      "Explains measurement of extant architecture and artifact instruments, comparison with replicas, psychoacoustic experiments, and auralization as exploratory methods.",
  },
  {
    id: "stanford-pututus",
    claimIds: ["pututu-count", "artifact-experiment"],
    authority: "Stanford University CCRMA",
    title: "Archaeomusicology of the Chavín Pututus",
    citation: "Chavín project instrument research page, updated with 2008 and 2019 work.",
    url: "https://ccrma.stanford.edu/groups/chavin/pututus.html",
    supports:
      "Documents 21 excavated Titanostrombus galeatus pututus, their archaeological contexts, artifact measurements, performance experiments, and replica comparisons.",
  },
  {
    id: "jasa-galleries",
    claimIds: ["measurement-layout", "ofrendas-dimensions", "impulse-findings"],
    authority: "The Journal of the Acoustical Society of America",
    title: "On the Acoustics of the Underground Galleries of Ancient Chavín de Huántar, Peru",
    citation: "Abel, Rick, Huang, Kolar, Smith, and Chowning. JASA 123(5), 3605 (2008). DOI 10.1121/1.2934780.",
    url: "https://doi.org/10.1121/1.2934780",
    supports:
      "Reports the three-gallery measurement setup, 10 source and 27 receiver positions, Ofrendas alcove dimensions, short reverberation, dense early reflections, and wide soundfields.",
  },
  {
    id: "time-and-mind",
    claimIds: ["possible-experience"],
    authority: "Time and Mind: The Journal of Archaeology, Consciousness and Culture",
    title: "Sensing sonically at Andean Formative Chavín de Huántar, Perú",
    citation: "Kolar, Miriam A. Time and Mind 10(1), 2017. DOI 10.1080/1751696X.2016.1272257.",
    url: "https://doi.org/10.1080/1751696X.2016.1272257",
    supports:
      "Frames acoustic and perceptual experiments as evidence for estimating possible ancient sonic experiences rather than direct recovery of a singular past event.",
  },
  {
    id: "yale-pututus",
    claimIds: ["pututu-count", "possible-experience"],
    authority: "Yale Journal of Music & Religion",
    title: "Conch Calls into the Anthropocene: Pututus as Instruments of Human-Environmental Relations at Monumental Chavín",
    citation: "Kolar, Miriam A. Yale Journal of Music & Religion 5(2), Article 4 (2019). DOI 10.17132/2377-231X.1151.",
    url: "https://doi.org/10.17132/2377-231X.1151",
    supports:
      "Reviews the material, acoustic, performative, and contextual evidence for Chavín pututus while explicitly acknowledging archaeological uncertainty.",
  },
  {
    id: "unesco-site",
    claimIds: ["site-complex"],
    authority: "UNESCO World Heritage Centre",
    title: "Chavin (Archaeological Site)",
    citation: "World Heritage List entry 330, inscribed 1985; official site synthesis and conservation record.",
    url: "https://whc.unesco.org/en/list/330/",
    supports:
      "Documents the site’s terraces, plazas, dressed-stone structures, complex internal galleries, vents, drains, chronology, and protected status.",
  },
] as const satisfies readonly AncientSoundSource[];

export const ancientSoundClaims = [
  {
    id: "site-complex",
    sourceIds: ["unesco-site", "stanford-overview"],
    boundary:
      "The drawn plan is an explanatory abstraction of documented architectural elements, not a surveyed archaeological plan.",
  },
  {
    id: "pututu-count",
    sourceIds: ["stanford-pututus", "yale-pututus"],
    boundary:
      "The count describes intact excavated instruments reported by the project; it does not represent every instrument once used at Chavín.",
  },
  {
    id: "artifact-experiment",
    sourceIds: ["stanford-method", "stanford-pututus"],
    boundary:
      "Modern measurements and performances document present acoustic capabilities; they do not reproduce one historically verified performance.",
  },
  {
    id: "measurement-layout",
    sourceIds: ["jasa-galleries", "stanford-method"],
    boundary:
      "The equipment drawing preserves the published method and relative roles but is diagrammatic and not a scale reconstruction of a gallery.",
  },
  {
    id: "ofrendas-dimensions",
    sourceIds: ["jasa-galleries"],
    boundary:
      "The published dimensions apply to the nine similar Ofrendas alcoves discussed in the 2008 study, not to every corridor at the site.",
  },
  {
    id: "impulse-findings",
    sourceIds: ["jasa-galleries"],
    boundary:
      "The displayed findings are preliminary measurements of three extant galleries and cannot alone demonstrate ancient design intention.",
  },
  {
    id: "possible-experience",
    sourceIds: ["stanford-method", "time-and-mind", "yale-pututus"],
    boundary:
      "Acoustic and psychoacoustic evidence can constrain plausible listening effects, but ritual meaning and a singular ancient sound remain inferential.",
  },
] as const satisfies readonly {
  id: AncientSoundClaimId;
  sourceIds: readonly (typeof ancientSoundSources)[number]["id"][];
  boundary: string;
}[];

const COPY: Record<Language, LocalizedCopy> = {
  en: {
    fieldLabel: "ARCHAEOACOUSTICS / EVIDENCE LOG",
    topic: "Ancient Sound",
    nav: ["Site", "Pututu", "Setup", "Response", "Boundary"],
    scene1: {
      eyebrow: "FIELD PAGE 01 · SITE COVER",
      title: "Listening below the stone",
      subtitle: "Chavín de Huántar · north-central Andes, Peru",
      questionLabel: "Research question",
      question:
        "What can surviving instruments, galleries, and measurements tell us about possible listening experiences?",
      siteLabel: "Documented place",
      siteBody:
        "A ceremonial and pilgrimage centre with terraces, plazas, dressed-stone buildings, and a complex internal gallery system.",
      planLabel: "Working plan",
      planNote: "Terraces · plaza · galleries · vents · drains",
      scopeLabel: "Scope boundary",
      scope:
        "Map the surviving evidence first. Treat purpose, performance, and ritual intention as questions—not recovered field notes.",
    },
    scene2: {
      eyebrow: "FIELD PAGE 02 · INSTRUMENT RECORD",
      title: "A shell horn is evidence in layers",
      subtitle: "Artifact, handling record, experiment, and inference stay distinct.",
      cards: [
        {
          kicker: "EXCAVATED RECORD",
          title: "21 intact shell horns",
          body:
            "The project reports Titanostrombus galeatus pututus excavated in 2001 and 2018 from Chavín contexts.",
          note: "Count ≠ complete ancient ensemble",
        },
        {
          kicker: "MATERIAL FORM",
          title: "Shell made playable",
          body:
            "Cut and worked mouth openings, use polish, notches, and surviving surfaces make each instrument a material record.",
          note: "Drawn profile · no copied artifact photo",
        },
        {
          kicker: "MEASURED ARTIFACT",
          title: "Capabilities tested",
          body:
            "Researchers measured response and documented varied sounding techniques with the excavated instruments.",
          note: "Present measurement of ancient material",
        },
        {
          kicker: "REPLICA EXPERIMENT",
          title: "Site tests use comparison",
          body:
            "Replicas let researchers test architecture and performance conditions without treating a simulation as the original event.",
          note: "A model, not a recording from antiquity",
        },
      ],
      boundaryLabel: "Interpretive limit",
      boundary:
        "The evidence constrains what the horns can do; it does not recover a single ancient performance.",
    },
    scene3: {
      eyebrow: "FIELD PAGE 03 · MEASUREMENT SETUP",
      title: "Send a known signal; record what the stone returns",
      subtitle: "A static diagram of the 2008 three-gallery measurement method.",
      sourceLabel: "SOURCE",
      sourceBody: "Repeated swept sine · 48 kHz · loudspeaker near period human head height",
      receiverLabel: "RECEIVERS",
      receiverBody: "In-ear omnidirectional microphones + portable recorder microphones",
      positionsLabel: "POSITION SAMPLE",
      positionsBody: "10 source and 27 receiver positions across representative gallery geometries",
      alcoveLabel: "OFRENDAS ALCOVE",
      alcoveBody: "Less than 1 m wide · approximately 3.5 m long",
      methodLabel: "OUTPUT",
      methodBody: "Impulse response: timing, energy, reverberation, and arrival direction",
      scaleNote: "diagrammatic · not to scale",
    },
    scene4: {
      eyebrow: "FIELD PAGE 04 · RESPONSE MAP",
      title: "Three galleries, three measurement contexts",
      subtitle: "Focus advances; the full evidence table stays fixed for comparison.",
      metricLabel: "REVERBERATION T60",
      metric: "generally below 0.5 s",
      metricNote: "Published measurements span roughly 150 ms to around 1 s across bands and galleries.",
      galleries: [
        {
          name: "Doble Ménsula",
          finding: "Energetic reflections become dense quickly; double corbels shape a wider cross-section.",
          qualifier: "Measured source–receiver pairs",
        },
        {
          name: "Laberintos",
          finding: "Short reverberation and narrow rectilinear turns complicate arrival-direction cues.",
          qualifier: "Extant gallery measurement",
        },
        {
          name: "Ofrendas",
          finding: "Nine parallel alcoves share dimensions; early arrivals support consistent resonances.",
          qualifier: "Alcove-specific result",
        },
      ],
      uncertaintyLabel: "UNCERTAINTY STAYS ON THE PAGE",
      uncertainty:
        "These are preliminary measurements of surviving spaces. Dense early reflections and wide soundfields are measured effects—not proof of intentional acoustic control.",
      legend: "highlight = current evidence card · lines = schematic paths",
    },
    scene5: {
      eyebrow: "FIELD PAGE 05 · INTERPRETATION NOTES",
      title: "Observation is not intention",
      subtitle: "Keep the material record on the left and bounded inference on the right.",
      observationLabel: "OBSERVATION",
      inferenceLabel: "INFERENCE",
      observations: [
        {
          label: "Objects",
          body: "Twenty-one intact pututus are documented from excavated Chavín contexts.",
        },
        {
          label: "Method",
          body: "Extant galleries and instruments can be measured, compared, and modeled.",
        },
        {
          label: "Response",
          body: "Three galleries show generally short reverberation, dense early reflections, and broad arrival fields.",
        },
      ],
      inferences: [
        {
          label: "Possible effect",
          body: "Architecture and horns could have shaped localization, resonance, and coordination for listeners.",
        },
        {
          label: "Useful model",
          body: "Replica tests and auralizations can explore perceptual possibilities under stated assumptions.",
        },
        {
          label: "Hard boundary",
          body: "This evidence does not establish a specific ritual script or intention.",
        },
      ],
      boundary:
        "No generated track here claims to be ‘the real ancient sound.’ A reconstruction is an argument with parameters, not an audio time machine.",
      closing: "We can model possibilities; we cannot replay certainty.",
    },
  },
  zh: {
    fieldLabel: "考古声学 / 证据记录",
    topic: "古代声音",
    nav: ["遗址", "海螺号", "测量", "响应", "边界"],
    scene1: {
      eyebrow: "田野页 01 · 遗址封面",
      title: "听见石墙之下",
      subtitle: "查文·德万塔尔 · 秘鲁安第斯山脉中北部",
      questionLabel: "研究问题",
      question: "留存的器物、廊道和测量，能把可能的听觉体验约束到什么范围？",
      siteLabel: "有文献支持的地点",
      siteBody: "一处仪式与朝圣中心，包含台地、广场、石砌建筑，以及复杂的内部廊道、通风与排水系统。",
      planLabel: "工作平面",
      planNote: "台地 · 广场 · 廊道 · 通风口 · 排水道",
      scopeLabel: "范围边界",
      scope: "先标出留存证据。用途、表演和仪式意图仍是问题，不能伪装成当年的田野笔记。",
    },
    scene2: {
      eyebrow: "田野页 02 · 乐器记录",
      title: "一支海螺号，分成四层证据",
      subtitle: "文物、接触记录、实验与解释必须分开。",
      cards: [
        {
          kicker: "出土记录",
          title: "21 支完整海螺号",
          body: "项目记录了 2001 与 2018 年从查文语境出土的 Titanostrombus galeatus pututu。",
          note: "数量不等于完整的古代乐队",
        },
        {
          kicker: "材料形制",
          title: "海螺被加工成乐器",
          body: "切磨的吹口、使用抛光痕迹、刻口和留存表面，让每件器物都成为材料记录。",
          note: "自绘剖面 · 未复制文物照片",
        },
        {
          kicker: "文物测量",
          title: "测试可实现的声学范围",
          body: "研究者测量响应，并用出土器物记录多种吹奏技巧。",
          note: "对古代材料进行当代测量",
        },
        {
          kicker: "复制品实验",
          title: "现场测试依赖比较",
          body: "复制品让研究者测试建筑与演奏条件，同时不把模拟当作原始事件。",
          note: "这是模型，不是古代录音",
        },
      ],
      boundaryLabel: "解释边界",
      boundary: "证据能约束海螺号可以做什么，但无法找回唯一的一次古代演奏。",
    },
    scene3: {
      eyebrow: "田野页 03 · 测量设置",
      title: "发出已知信号，记录石墙返回的响应",
      subtitle: "2008 年三处廊道测量方法的静态示意。",
      sourceLabel: "声源",
      sourceBody: "重复指数扫频 · 48 kHz · 扬声器接近查文时期人头高度",
      receiverLabel: "接收器",
      receiverBody: "入耳式全向麦克风 + 便携录音机麦克风",
      positionsLabel: "位置样本",
      positionsBody: "在代表性廊道几何中设置 10 个声源位置与 27 个接收位置",
      alcoveLabel: "Ofrendas 壁龛",
      alcoveBody: "宽度不足 1 米 · 长约 3.5 米",
      methodLabel: "输出",
      methodBody: "脉冲响应：时间、能量、混响和到达方向",
      scaleNote: "示意图 · 不按比例",
    },
    scene4: {
      eyebrow: "田野页 04 · 响应图",
      title: "三处廊道，三种测量语境",
      subtitle: "焦点逐项移动；完整证据表保持固定，便于比较。",
      metricLabel: "混响时间 T60",
      metric: "通常低于 0.5 秒",
      metricNote: "已发表测量按频带和廊道分布，约从 150 毫秒到 1 秒左右。",
      galleries: [
        {
          name: "Doble Ménsula",
          finding: "早期反射能量高且迅速变密；双层托臂形成更宽的横截面。",
          qualifier: "已测声源—接收点对",
        },
        {
          name: "Laberintos",
          finding: "混响较短，狭窄直角转折使到达方向更难判断。",
          qualifier: "现存廊道测量",
        },
        {
          name: "Ofrendas",
          finding: "九个平行壁龛尺寸相近；早期到达形成较一致的共振。",
          qualifier: "壁龛特定结果",
        },
      ],
      uncertaintyLabel: "不确定性留在同一页",
      uncertainty: "这些是对留存空间的初步测量。密集早期反射与宽广声场是测得的效应，不是刻意声学控制的证据。",
      legend: "高亮 = 当前证据卡 · 线条 = 示意路径",
    },
    scene5: {
      eyebrow: "田野页 05 · 解释记录",
      title: "观察不等于意图",
      subtitle: "左栏保留材料记录，右栏只写有边界的推断。",
      observationLabel: "观察",
      inferenceLabel: "推断",
      observations: [
        {
          label: "器物",
          body: "已有 21 支完整 pututu 被记录为出自查文的考古语境。",
        },
        {
          label: "方法",
          body: "现存廊道与乐器可以被测量、比较和建模。",
        },
        {
          label: "响应",
          body: "三处廊道总体呈较短混响、密集早期反射和较宽的到达方向分布。",
        },
      ],
      inferences: [
        {
          label: "可能效应",
          body: "建筑与海螺号可能影响听者的定位、共振感与协同演奏。",
        },
        {
          label: "模型用途",
          body: "复制品实验和可听化能在明确假设下探索感知可能性。",
        },
        {
          label: "硬边界",
          body: "这些证据不能确认某一套具体仪式脚本或建造意图。",
        },
      ],
      boundary: "这里没有任何生成音轨被称作“真实古声”。重建是带参数的论证，不是声音时光机。",
      closing: "我们能建立可能性模型，不能重放确定性。",
    },
  },
};

const METADATA_COPY: Record<Language, Array<{ title: string; beats: Array<{ action: string; title: string; body: string }> }>> = {
  en: [
    {
      title: "Site Cover",
      beats: [
        { action: "Place the site and question", title: "Listening below the stone", body: "Chavín, its galleries, and the research boundary." },
        { action: "Reveal the working plan", title: "Map surviving evidence first", body: "Terraces, plaza, internal galleries, vents, and drains." },
      ],
    },
    {
      title: "Pututu Record",
      beats: [
        { action: "Focus the excavation record", title: "Twenty-one intact pututus", body: "Documented objects and contexts." },
        { action: "Focus material form", title: "Shell made playable", body: "Worked openings, wear, and notches." },
        { action: "Focus artifact measurement", title: "Capabilities tested", body: "Present measurements of ancient material." },
        { action: "Focus replica comparison", title: "A model is not the event", body: "Replica experiment with an explicit boundary." },
      ],
    },
    {
      title: "Measurement Setup",
      beats: [
        { action: "Show the static measurement diagram", title: "Known signal, measured return", body: "Source, receivers, positions, and one published alcove dimension." },
      ],
    },
    {
      title: "Impulse Map",
      beats: [
        { action: "Focus Doble Ménsula", title: "Dense early reflections", body: "Measured paths in a wider corbelled section." },
        { action: "Focus Laberintos", title: "Direction cues blur", body: "Short reverberation through narrow turns." },
        { action: "Focus Ofrendas", title: "Repeated alcoves, repeated constraints", body: "Shared dimensions and resonant arrivals." },
      ],
    },
    {
      title: "Observation / Inference",
      beats: [
        { action: "Separate evidence from inference", title: "Observation is not intention", body: "Possible experience without a recovered ritual script." },
      ],
    },
  ],
  zh: [
    {
      title: "遗址封面",
      beats: [
        { action: "放置遗址与问题", title: "听见石墙之下", body: "查文、廊道与研究边界。" },
        { action: "揭示工作平面", title: "先标出留存证据", body: "台地、广场、内部廊道、通风口与排水道。" },
      ],
    },
    {
      title: "海螺号记录",
      beats: [
        { action: "聚焦出土记录", title: "二十一支完整 pututu", body: "器物与考古语境。" },
        { action: "聚焦材料形制", title: "海螺被加工成乐器", body: "吹口、磨损与刻口。" },
        { action: "聚焦文物测量", title: "测试可实现范围", body: "对古代材料进行当代测量。" },
        { action: "聚焦复制品比较", title: "模型不是事件", body: "带明确边界的复制品实验。" },
      ],
    },
    {
      title: "测量设置",
      beats: [
        { action: "展示静态测量图", title: "已知信号，测量返回", body: "声源、接收器、位置与一处已发表壁龛尺寸。" },
      ],
    },
    {
      title: "脉冲响应图",
      beats: [
        { action: "聚焦 Doble Ménsula", title: "密集早期反射", body: "更宽托臂横截面中的测量路径。" },
        { action: "聚焦 Laberintos", title: "方向线索变模糊", body: "短混响穿过狭窄转折。" },
        { action: "聚焦 Ofrendas", title: "重复壁龛，重复约束", body: "相近尺寸与共振到达。" },
      ],
    },
    {
      title: "观察 / 推断",
      beats: [
        { action: "分开证据与推断", title: "观察不等于意图", body: "讨论可能体验，不编造仪式脚本。" },
      ],
    },
  ],
};

function clampScene(scene: number): number {
  return SCENE_IDS.includes(scene) ? scene : 1;
}

function clampBeat(scene: number, beat: number): number {
  return Math.max(0, Math.min(beat, BEAT_COUNTS[scene] - 1));
}

function SceneHeader({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle: string }) {
  return (
    <header className={styles.sceneHeader} data-beat-layout-item="true">
      <p className={styles.eyebrow}>{eyebrow}</p>
      <h1 className={styles.sceneTitle}>{title}</h1>
      <p className={styles.sceneSubtitle}>{subtitle}</p>
    </header>
  );
}

function SiteCover({ copy, beat }: { copy: LocalizedCopy; beat: number }) {
  const detailsVisible = beat >= 1;
  return (
    <section
      className={styles.scenePage}
      data-reading-state="settled"
      data-claim-id="site-complex"
      data-beat-layout-container="true"
      data-beat-layout-mode="reserved"
    >
      <SceneHeader
        eyebrow={copy.scene1.eyebrow}
        title={copy.scene1.title}
        subtitle={copy.scene1.subtitle}
      />
      <div className={styles.siteGrid} data-beat-layout-item="true">
        <div className={styles.sitePlanWrap}>
          <div className={styles.paperTab}>{copy.scene1.planLabel}</div>
          <svg
            className={styles.sitePlan}
            viewBox="0 0 780 520"
            role="img"
            aria-label={copy.scene1.planNote}
          >
            <path className={styles.contour} d="M40 92 C160 22 286 62 350 32 C460 -12 602 32 742 112" />
            <path className={styles.contour} d="M24 154 C144 92 265 128 372 86 C506 34 626 94 760 162" />
            <rect className={styles.siteMass} x="116" y="166" width="486" height="270" rx="12" />
            <rect className={styles.plaza} x="270" y="264" width="174" height="118" rx="54" />
            <path className={styles.galleryLine} d="M145 204 H328 V236 H222 V328 H268" />
            <path className={styles.galleryLine} d="M570 208 H454 V250 H520 V338 H444" />
            <path className={styles.galleryLine} d="M176 400 V356 H222" />
            <path className={styles.drainLine} d="M336 382 V468 H648" />
            <circle className={styles.ventDot} cx="328" cy="236" r="9" />
            <circle className={styles.ventDot} cx="454" cy="250" r="9" />
            <circle className={styles.ventDot} cx="222" cy="328" r="9" />
            <path className={styles.routeLine} d="M74 454 C170 432 238 464 322 446 C430 422 546 466 710 428" />
            <text className={styles.svgLabel} x="304" y="332">PLAZA</text>
            <text className={styles.svgLabel} x="142" y="194">GALLERIES</text>
            <text className={styles.svgLabel} x="534" y="458">DRAIN</text>
          </svg>
          <p className={styles.sketchCaption}>{copy.scene1.planNote}</p>
        </div>
        <div className={styles.coverNotes}>
          <article className={styles.questionCard} data-beat-layout-item="true">
            <span className={styles.noteLabel}>{copy.scene1.questionLabel}</span>
            <p>{copy.scene1.question}</p>
          </article>
          <article
            className={`${styles.fieldNote} ${detailsVisible ? styles.slotVisible : styles.slotMuted}`}
            data-beat-layout-item="true"
          >
            <span className={styles.noteLabel}>{copy.scene1.siteLabel}</span>
            <p>{copy.scene1.siteBody}</p>
          </article>
          <article
            className={`${styles.boundaryNote} ${detailsVisible ? styles.slotVisible : styles.slotMuted}`}
            data-beat-layout-item="true"
          >
            <span className={styles.noteLabel}>{copy.scene1.scopeLabel}</span>
            <p>{copy.scene1.scope}</p>
          </article>
        </div>
      </div>
    </section>
  );
}

function PututuGlyph({ variant }: { variant: number }) {
  const rotate = variant % 2 === 0 ? 0 : 5;
  return (
    <svg className={styles.pututuGlyph} viewBox="0 0 180 130" aria-hidden="true">
      <g transform={`rotate(${rotate} 90 65)`}>
        <path
          className={styles.shellFill}
          d="M20 86 C38 38 88 18 132 32 C160 40 170 63 153 82 C139 98 111 95 96 82 C80 68 70 48 48 58 C35 64 31 79 39 92 C49 109 78 114 110 108"
        />
        <path className={styles.shellLine} d="M48 58 C77 50 102 61 112 83 C119 99 111 111 98 115" />
        <path className={styles.shellLine} d="M82 34 C110 42 134 57 142 80" />
        <circle className={styles.shellMouth} cx="22" cy="88" r="8" />
        <path className={styles.shellNotch} d="M141 79 l14 -5 l-8 13" />
      </g>
    </svg>
  );
}

function PututuRecord({ copy, beat }: { copy: LocalizedCopy; beat: number }) {
  const statuses = ["excavated", "material-record", "measured-artifact", "replica-experiment"];
  return (
    <section
      className={styles.scenePage}
      data-reading-state="settled"
      data-claim-id="pututu-count"
      data-beat-layout-container="true"
      data-beat-layout-mode="reserved"
    >
      <SceneHeader
        eyebrow={copy.scene2.eyebrow}
        title={copy.scene2.title}
        subtitle={copy.scene2.subtitle}
      />
      <div className={styles.instrumentGrid} data-beat-layout-item="true">
        {copy.scene2.cards.map((card, index) => {
          const focused = index === beat;
          return (
            <article
              key={card.title}
              className={styles.instrumentCard}
              data-instrument-card="true"
              data-artifact-status={statuses[index]}
              data-focused={focused ? "true" : undefined}
              data-claim-id={index < 2 ? "pututu-count" : "artifact-experiment"}
              data-beat-layout-item="true"
            >
              <div className={styles.cardClip} aria-hidden="true" />
              <span className={styles.cardIndex}>{String(index + 1).padStart(2, "0")}</span>
              <PututuGlyph variant={index} />
              <div className={styles.cardCopy}>
                <span className={styles.cardKicker}>{card.kicker}</span>
                <h2>{card.title}</h2>
                <p>{card.body}</p>
                <small>{card.note}</small>
              </div>
            </article>
          );
        })}
      </div>
      <aside className={styles.boundaryStrip} data-beat-layout-item="true">
        <span>{copy.scene2.boundaryLabel}</span>
        <p>{copy.scene2.boundary}</p>
      </aside>
    </section>
  );
}

function MeasurementSetup({ copy }: { copy: LocalizedCopy }) {
  return (
    <section
      className={styles.scenePage}
      data-reading-state="settled"
      data-claim-id="measurement-layout"
    >
      <SceneHeader
        eyebrow={copy.scene3.eyebrow}
        title={copy.scene3.title}
        subtitle={copy.scene3.subtitle}
      />
      <div className={styles.measurementGrid} data-measurement-plan="true">
        <div className={styles.corridorDiagram}>
          <div className={styles.dimensionTag} data-claim-id="ofrendas-dimensions">
            {copy.scene3.alcoveBody}
          </div>
          <svg
            className={styles.corridorSvg}
            viewBox="0 0 900 500"
            role="img"
            aria-label={copy.scene3.scaleNote}
          >
            <path className={styles.stoneWall} d="M80 82 H820 V410 H80 Z" />
            <path className={styles.stoneCourse} d="M80 150 H820 M80 228 H820 M80 306 H820" />
            <path className={styles.stoneJoint} d="M182 82 V410 M300 82 V410 M430 82 V410 M566 82 V410 M694 82 V410" />
            <path className={styles.signalPath} d="M204 266 C304 202 410 342 522 258 C620 184 682 252 756 232" />
            <path className={styles.signalPathSoft} d="M204 266 C350 382 560 130 756 232" />
            <g className={styles.sourceNode}>
              <rect x="154" y="214" width="72" height="102" rx="8" />
              <path d="M226 236 L270 214 V316 L226 294 Z" />
              <path d="M280 236 C302 250 302 278 280 292" />
            </g>
            <g className={styles.receiverNode}>
              <circle cx="756" cy="232" r="34" />
              <path d="M748 220 V276 M764 220 V276 M724 284 H790" />
              <circle cx="748" cy="212" r="6" />
              <circle cx="764" cy="212" r="6" />
            </g>
            <path className={styles.dimensionLine} d="M116 442 H784 M116 432 V452 M784 432 V452" />
            <path className={styles.dimensionLine} d="M46 100 V392 M36 100 H56 M36 392 H56" />
            <text className={styles.svgLabel} x="130" y="478">≈ 3.5 m</text>
            <text className={styles.svgLabel} x="14" y="270" transform="rotate(-90 14 270)">&lt; 1 m</text>
          </svg>
          <p className={styles.scaleNote}>{copy.scene3.scaleNote}</p>
        </div>
        <div className={styles.methodLedger}>
          {[
            [copy.scene3.sourceLabel, copy.scene3.sourceBody],
            [copy.scene3.receiverLabel, copy.scene3.receiverBody],
            [copy.scene3.positionsLabel, copy.scene3.positionsBody],
            [copy.scene3.alcoveLabel, copy.scene3.alcoveBody],
            [copy.scene3.methodLabel, copy.scene3.methodBody],
          ].map(([label, body], index) => (
            <article key={label} className={styles.methodRow}>
              <span className={styles.methodNumber}>{String(index + 1).padStart(2, "0")}</span>
              <div>
                <span className={styles.noteLabel}>{label}</span>
                <p>{body}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ImpulseMap({ copy, beat }: { copy: LocalizedCopy; beat: number }) {
  return (
    <section
      className={styles.scenePage}
      data-reading-state="settled"
      data-claim-id="impulse-findings"
      data-beat-layout-container="true"
      data-beat-layout-mode="reserved"
    >
      <SceneHeader
        eyebrow={copy.scene4.eyebrow}
        title={copy.scene4.title}
        subtitle={copy.scene4.subtitle}
      />
      <div className={styles.responseGrid} data-beat-layout-item="true">
        <div className={styles.responseMapWrap}>
          <svg
            className={styles.responseMap}
            viewBox="0 0 760 610"
            role="img"
            aria-label={copy.scene4.legend}
          >
            <path className={styles.mapShell} d="M58 74 H704 V536 H58 Z" />
            <path className={styles.mapPassage} d="M112 128 H372 V220 H246 V322 H402 V470" />
            <path className={styles.mapPassage} d="M650 132 H472 V260 H600 V470 H440" />
            <path className={styles.mapPassageThin} d="M130 420 H310 M518 100 V204 M540 334 H660" />
            {[0, 1, 2].map((index) => {
              const positions = [
                { x: 192, y: 170, r: 84 },
                { x: 516, y: 240, r: 92 },
                { x: 522, y: 430, r: 96 },
              ];
              const zone = positions[index];
              return (
                <g
                  key={copy.scene4.galleries[index].name}
                  data-gallery-zone={copy.scene4.galleries[index].name}
                  data-focused={index === beat ? "true" : undefined}
                  className={index === beat ? styles.mapZoneFocused : styles.mapZone}
                >
                  <circle cx={zone.x} cy={zone.y} r={zone.r} />
                  <circle cx={zone.x} cy={zone.y} r={zone.r * 0.62} />
                  <circle cx={zone.x} cy={zone.y} r={zone.r * 0.3} />
                  <text className={styles.zoneIndex} x={zone.x - 13} y={zone.y + 10}>{index + 1}</text>
                </g>
              );
            })}
            <path className={styles.echoPath} d="M164 172 C298 114 394 236 522 242" />
            <path className={styles.echoPath} d="M522 242 C630 310 586 388 522 430" />
            <path className={styles.echoPath} d="M522 430 C392 510 262 418 164 172" />
          </svg>
          <div className={styles.metricNote}>
            <span>{copy.scene4.metricLabel}</span>
            <strong>{copy.scene4.metric}</strong>
            <p>{copy.scene4.metricNote}</p>
          </div>
          <p className={styles.mapLegend}>{copy.scene4.legend}</p>
        </div>
        <div className={styles.galleryLedger}>
          {copy.scene4.galleries.map((gallery, index) => (
            <article
              key={gallery.name}
              className={styles.galleryCard}
              data-focused={index === beat ? "true" : undefined}
              data-beat-layout-item="true"
            >
              <span className={styles.galleryIndex}>{String(index + 1).padStart(2, "0")}</span>
              <div>
                <h2>{gallery.name}</h2>
                <p>{gallery.finding}</p>
                <small>{gallery.qualifier}</small>
              </div>
            </article>
          ))}
          <aside className={styles.uncertaintyCard} data-beat-layout-item="true">
            <span>{copy.scene4.uncertaintyLabel}</span>
            <p>{copy.scene4.uncertainty}</p>
          </aside>
        </div>
      </div>
    </section>
  );
}

function ObservationInference({ copy }: { copy: LocalizedCopy }) {
  return (
    <section
      className={styles.scenePage}
      data-reading-state="settled"
      data-claim-id="possible-experience"
    >
      <SceneHeader
        eyebrow={copy.scene5.eyebrow}
        title={copy.scene5.title}
        subtitle={copy.scene5.subtitle}
      />
      <div className={styles.evidenceColumns}>
        <div className={styles.evidenceColumn}>
          <div className={styles.columnHeader}>{copy.scene5.observationLabel}</div>
          {copy.scene5.observations.map((item, index) => (
            <article
              key={item.label}
              className={styles.evidenceRow}
              data-evidence-kind="observation"
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              <div>
                <h2>{item.label}</h2>
                <p>{item.body}</p>
              </div>
            </article>
          ))}
        </div>
        <div className={`${styles.evidenceColumn} ${styles.inferenceColumn}`}>
          <div className={styles.columnHeader}>{copy.scene5.inferenceLabel}</div>
          {copy.scene5.inferences.map((item, index) => (
            <article
              key={item.label}
              className={styles.evidenceRow}
              data-evidence-kind="inference"
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              <div>
                <h2>{item.label}</h2>
                <p>{item.body}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
      <div className={styles.finalBoundary}>
        <p>{copy.scene5.boundary}</p>
        <strong>{copy.scene5.closing}</strong>
      </div>
    </section>
  );
}

function ScenePanel({ scene, beat, language }: { scene: number; beat: number; language: Language }) {
  const copy = COPY[language];
  if (scene === 1) return <SiteCover copy={copy} beat={beat} />;
  if (scene === 2) return <PututuRecord copy={copy} beat={beat} />;
  if (scene === 3) return <MeasurementSetup copy={copy} />;
  if (scene === 4) return <ImpulseMap copy={copy} beat={beat} />;
  return <ObservationInference copy={copy} />;
}

function InstrumentFieldCards({
  scene,
  language,
  onNavigate,
}: {
  scene: number;
  language: Language;
  onNavigate?: (scene: number, beat: number) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const navRef = useRef<HTMLElement | null>(null);
  const holdTimer = useRef<number | null>(null);
  const copy = COPY[language];

  const clearHoldTimer = () => {
    if (holdTimer.current !== null) {
      window.clearTimeout(holdTimer.current);
      holdTimer.current = null;
    }
  };

  const beginHold = () => {
    clearHoldTimer();
    holdTimer.current = window.setTimeout(() => {
      setExpanded(true);
      holdTimer.current = null;
    }, 360);
  };

  const endHold = () => {
    clearHoldTimer();
    setExpanded(false);
  };

  useEffect(() => {
    const navigation = navRef.current;
    if (!navigation) return undefined;

    const handleTouchStart = (event: TouchEvent) => {
      event.stopPropagation();
      beginHold();
    };
    const handleTouchMove = (event: TouchEvent) => {
      event.stopPropagation();
    };
    const handleTouchEnd = (event: TouchEvent) => {
      event.stopPropagation();
      endHold();
    };

    navigation.addEventListener("touchstart", handleTouchStart, { passive: true });
    navigation.addEventListener("touchmove", handleTouchMove, { passive: true });
    navigation.addEventListener("touchend", handleTouchEnd, { passive: true });
    navigation.addEventListener("touchcancel", handleTouchEnd, { passive: true });

    return () => {
      navigation.removeEventListener("touchstart", handleTouchStart);
      navigation.removeEventListener("touchmove", handleTouchMove);
      navigation.removeEventListener("touchend", handleTouchEnd);
      navigation.removeEventListener("touchcancel", handleTouchEnd);
      clearHoldTimer();
    };
  }, []);

  const handlePointerDown = (event: PointerEvent<HTMLElement>) => {
    event.stopPropagation();
    beginHold();
  };

  const handlePointerEnd = (event: PointerEvent<HTMLElement>) => {
    event.stopPropagation();
    endHold();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    event.stopPropagation();
    if (event.repeat || event.currentTarget !== event.target) return;
    let target = scene;
    if (event.key === " " || event.key === "ArrowRight" || event.key === "ArrowDown") {
      target = Math.min(5, scene + 1);
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      target = Math.max(1, scene - 1);
    } else if (event.key === "Home") {
      target = 1;
    } else if (event.key === "End") {
      target = 5;
    } else {
      return;
    }
    event.preventDefault();
    if (target !== scene) onNavigate?.(target, 0);
  };

  return (
    <nav
      ref={navRef}
      className={styles.fieldCardNav}
      aria-label={language === "zh" ? "乐器田野卡片导航" : "Instrument field cards"}
      tabIndex={0}
      data-topic-navigation="true"
      data-navigation-geometry={ancientSoundNavigation.geometry}
      data-navigation-carrier={ancientSoundNavigation.carrier}
      data-navigation-invocation={ancientSoundNavigation.invocation}
      data-navigation-feedback={ancientSoundNavigation.feedback}
      data-expanded={expanded ? "true" : "false"}
      onClick={(event) => event.stopPropagation()}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerEnd}
      onPointerCancel={handlePointerEnd}
      onPointerLeave={handlePointerEnd}
      onKeyDown={handleKeyDown}
    >
      <span className={styles.navHint}>{language === "zh" ? "按住展开 · 点击或键盘跳转" : "hold to fan · click or keyboard to move"}</span>
      <div className={styles.cardStack}>
        {SCENE_IDS.map((id, index) => {
          const active = id === scene;
          return (
            <button
              key={id}
              type="button"
              className={styles.navCard}
              aria-label={language === "zh" ? `打开田野卡片 ${id}` : `Open field card ${id}`}
              aria-current={active ? "step" : undefined}
              data-active={active ? "true" : undefined}
              onPointerDown={(event) => event.stopPropagation()}
              onClick={(event) => {
                event.stopPropagation();
                onNavigate?.(id, 0);
              }}
            >
              <span className={styles.navCardNumber}>{String(id).padStart(2, "0")}</span>
              <span className={styles.navCardSketch} aria-hidden="true">
                <i />
                <i />
                <i />
              </span>
              <span className={styles.navCardLabel}>{copy.nav[index]}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

function buildMetadata(language: Language): TopicMetadata {
  return {
    theme: language === "zh" ? "古代声音" : "Ancient Sound",
    densityLabel: language === "zh" ? "阅读型证据笔记" : "Reading-first evidence notes",
    heroScene: 4,
    colors: {
      bg: "#ead8ad",
      ink: "#30291f",
      panel: "#f8edcf",
    },
    typography: {
      header: "Noteworthy / Kaiti SC",
      body: "Avenir Next / PingFang SC",
    },
    tags: [
      "field-notes",
      "archaeoacoustics",
      "observation",
      "evidence",
      "warm-paper",
      "reading-first",
      "minimal-motion",
    ],
    fonts: ["Noteworthy", "Avenir Next", "cjk:Kaiti SC", "cjk:PingFang SC"],
    scenes: METADATA_COPY[language].map((scene, sceneIndex) => ({
      id: sceneIndex + 1,
      title: scene.title,
      beats: scene.beats.map((beat, beatIndex) => ({
        id: beatIndex,
        action: beat.action,
        title: beat.title,
        body: beat.body,
      })),
    })),
  };
}

function TopicStage({
  scene,
  beat,
  language,
  isThumbnail,
  reducedMotion,
  onNavigate,
}: TopicStageProps) {
  const safeScene = clampScene(scene);
  const safeBeat = clampBeat(safeScene, beat);
  const motionOff = reducedMotion || isThumbnail;

  return (
    <div
      className={`${styles.root} ${motionOff ? styles.motionOff : ""}`}
      data-testid="ancient-sound-root"
      data-motion={motionOff ? "off" : "on"}
    >
      <div className={styles.paperGrain} aria-hidden="true" />
      <div className={styles.binding} aria-hidden="true" />
      <div className={styles.fieldMasthead} aria-hidden="true">
        <span>{COPY[language].fieldLabel}</span>
        <strong>{COPY[language].topic}</strong>
      </div>
      <SpatialSceneTrack
        scene={safeScene}
        beat={safeBeat}
        sceneIds={SCENE_IDS}
        transitionKind={INCOMING_TRANSITION_KIND[safeScene]}
        transitionMap={ancientSoundTransitionScore}
        transitionDurationMs={720}
        reducedMotion={motionOff}
        beatLayoutModes={BEAT_LAYOUT_MODES}
        className={styles.sceneTrack}
        renderScene={(sceneId, sceneBeat) => (
          <ScenePanel scene={sceneId} beat={sceneBeat} language={language} />
        )}
      />
      {!isThumbnail ? (
        <InstrumentFieldCards
          scene={safeScene}
          language={language}
          onNavigate={onNavigate}
        />
      ) : null}
    </div>
  );
}

const metadata = {
  en: buildMetadata("en"),
  zh: buildMetadata("zh"),
} satisfies TopicDefinition["metadata"];

export default defineTopic({
  id: "ancient-sound",
  styleId: "field-notes-report",
  title: {
    en: "Ancient Sound",
    zh: "古代声音",
  },
  modelId: "GPT 5.6 Sol",
  Stage: TopicStage,
  metadata,
  navigation: ancientSoundNavigation,
  transitionScore: ancientSoundTransitionScore,
  evidence: {
    kind: "mixed",
    sources: ancientSoundSources,
    boundary: {
      en: COPY.en.scene5.boundary,
      zh: COPY.zh.scene5.boundary,
    },
  display: "envelope",
  },
});

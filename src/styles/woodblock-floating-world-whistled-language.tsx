import { useEffect, useState } from "react";
import type {
  KeyboardEvent as ReactKeyboardEvent,
  PointerEvent as ReactPointerEvent,
  SyntheticEvent,
  TouchEvent as ReactTouchEvent,
} from "react";
import type { BespokeStyleProps, StyleMetadata, TopicSource } from "../types";
import SpatialSceneTrack from "./SpatialSceneTrack";
import type { BeatLayoutMode, SceneTransitionMap } from "./SpatialSceneTrack";
import { defineStyleTopic } from "./topic";
import styles from "./woodblock-floating-world-whistled-language.module.css";

type Language = "en" | "zh";
type SceneId = 1 | 2 | 3 | 4 | 5;

type WhistledLanguageSourceId =
  | "silbo-unesco"
  | "silbo-community"
  | "kus-unesco"
  | "kus-safeguarding"
  | "kuskoy-linguistics"
  | "mazatec-sil-archive"
  | "mazatec-cowan";

type WhistledLanguageClaimId =
  | "shared-medium-not-global-language"
  | "silbo-spanish-whistle-structure"
  | "silbo-local-transmission"
  | "kus-terrain-and-words"
  | "kus-contextual-safeguarding"
  | "mazatec-tone-field-record";

type SceneCopy = {
  composition:
    | "mountain-silence"
    | "canary-valley"
    | "black-sea-valley"
    | "mazatec-field"
    | "three-waveforms";
  eyebrow: string;
  title: string;
  deck: string;
  boundary: string;
  sourceIds: readonly WhistledLanguageSourceId[];
  sourceStamp: string;
  beats: ReadonlyArray<{
    action: string;
    title: string;
    body: string;
  }>;
};

const STYLE_ID = "woodblock-floating-world";
const TOPIC_ID = "whistled-language";
const SCENE_IDS = [1, 2, 3, 4, 5] as const satisfies readonly SceneId[];

const COPY: Record<SceneId, Record<Language, SceneCopy>> = {
  1: {
    en: {
      composition: "mountain-silence",
      eyebrow: "WHISTLED SPEECH · THREE LOCAL CASES",
      title: "A valley carries a voice.",
      deck: "The whistle is a medium—not one language shared by the world.",
      boundary:
        "Read each practice with its own spoken language, terrain, and transmission.",
      sourceIds: [
        "silbo-unesco",
        "kus-unesco",
        "kuskoy-linguistics",
        "mazatec-cowan",
      ],
      sourceStamp:
        "Sources · UNESCO Silbo / UNESCO Türkiye / Kusköy linguistics / Cowan 1948",
      beats: [
        {
          action: "Hold the silence",
          title: "A narrow sound line",
          body: "Two mountain faces leave a channel for a voice.",
        },
        {
          action: "Name the comparison",
          title: "Three local cases",
          body: "Silbo Gomero, Kuş dili, and Mazatec whistled speech are carried by different linguistic systems.",
        },
        {
          action: "Keep the difference",
          title: "Language stays local",
          body: "A shared acoustic medium does not erase what is spoken, learned, or carried locally.",
        },
        {
          action: "Set the frame",
          title: "No global whistle language",
          body: "This is a comparison of three cited practices, not a universal code.",
        },
      ],
    },
    zh: {
      composition: "mountain-silence",
      eyebrow: "口哨语音 · 三个在地案例",
      title: "山谷传递一段声音。",
      deck: "口哨是一种媒介，不是世界共享的一门语言。",
      boundary: "每种实践都要放回自己的口语、地形与传承里理解。",
      sourceIds: [
        "silbo-unesco",
        "kus-unesco",
        "kuskoy-linguistics",
        "mazatec-cowan",
      ],
      sourceStamp:
        "资料 · UNESCO Silbo / UNESCO Türkiye / Kuşköy 语言学研究 / Cowan 1948",
      beats: [
        {
          action: "停在寂静里",
          title: "一条细声线",
          body: "两面山体之间，留下声音通过的窄缝。",
        },
        {
          action: "说清比较对象",
          title: "三个在地案例",
          body: "Silbo Gomero、Kuş dili 与马萨特克口哨语音，依托的是不同语言系统。",
        },
        {
          action: "保留差异",
          title: "语言仍属在地",
          body: "同一种声学媒介，不会抹去被说出、被学习与被传承的在地条件。",
        },
        {
          action: "定下范围",
          title: "没有全球通用口哨语",
          body: "这里比较的是三种有据可查的实践，不是一套通用密码。",
        },
      ],
    },
  },
  2: {
    en: {
      composition: "canary-valley",
      eyebrow: "LA GOMERA · SILBO GOMERO",
      title: "Spanish, re-shaped as whistle.",
      deck: "UNESCO describes Silbo Gomero as islanders’ Spanish articulated through whistles.",
      boundary:
        "School teaching and community safeguarding keep this transmission tied to La Gomera.",
      sourceIds: ["silbo-unesco", "silbo-community"],
      sourceStamp: "Sources · UNESCO ICH / Cabildo Insular de La Gomera",
      beats: [
        {
          action: "Place the island case",
          title: "A whistled form of Spanish",
          body: "Silbo Gomero is not a separate global code; its structure is tied to the islanders’ spoken Spanish.",
        },
        {
          action: "Show the compression",
          title: "Two vowel paths · four consonant paths",
          body: "UNESCO’s description records two whistle distinctions for Spanish vowels and four for consonants.",
        },
        {
          action: "Return to transmission",
          title: "Practice stays in place",
          body: "Teaching and safeguarding are part of how the practice continues as local heritage.",
        },
      ],
    },
    zh: {
      composition: "canary-valley",
      eyebrow: "拉戈梅拉岛 · SILBO GOMERO",
      title: "西班牙语，被改写为口哨。",
      deck: "UNESCO 将 Silbo Gomero 描述为以口哨复现岛民所说的西班牙语。",
      boundary: "学校教学与社区守护，让这种传承仍与拉戈梅拉岛相连。",
      sourceIds: ["silbo-unesco", "silbo-community"],
      sourceStamp: "资料 · UNESCO ICH / Cabildo Insular de La Gomera",
      beats: [
        {
          action: "放进岛屿语境",
          title: "西班牙语的口哨形式",
          body: "Silbo Gomero 不是另一套全球密码；它的结构连着岛民所说的西班牙语。",
        },
        {
          action: "显出压缩方式",
          title: "两条元音路径 · 四条辅音路径",
          body: "UNESCO 的描述记载：两种口哨差别对应西班牙语元音，四种对应辅音。",
        },
        {
          action: "回到传承",
          title: "实践留在原处",
          body: "教学与守护，是这种实践以在地遗产形式延续的一部分。",
        },
      ],
    },
  },
  3: {
    en: {
      composition: "black-sea-valley",
      eyebrow: "BLACK SEA HIGHLANDS · KUŞ DİLİ",
      title: "A valley may ask for another carrier.",
      deck: "UNESCO links Türkiye’s whistled language to steep mountains, rugged terrain, and dispersed settlements.",
      boundary:
        "Safeguarding centers education, bearers, and community participation—not extraction from context.",
      sourceIds: ["kus-unesco", "kus-safeguarding", "kuskoy-linguistics"],
      sourceStamp: "Sources · UNESCO ICH / 17.COM / Kusköy linguistics",
      beats: [
        {
          action: "Read the settlement pattern",
          title: "Words across uneven ground",
          body: "Kuş dili is a whistled articulation of Turkish speech used in a landscape of steep, separated settlements.",
        },
        {
          action: "Keep the bearer in view",
          title: "Transmission is not extraction",
          body: "UNESCO’s safeguarding record stresses education and bearer participation, including protection against decontextualization.",
        },
      ],
    },
    zh: {
      composition: "black-sea-valley",
      eyebrow: "黑海高地 · KUŞ DİLİ",
      title: "一座山谷，可能需要另一种载体。",
      deck: "UNESCO 将土耳其的口哨语音与陡峭山地、崎岖地形和分散聚落相连。",
      boundary: "守护以教育、实践者和社区参与为中心，而不是把它从语境中抽离。",
      sourceIds: ["kus-unesco", "kus-safeguarding", "kuskoy-linguistics"],
      sourceStamp: "资料 · UNESCO ICH / 17.COM / Kuşköy 语言学研究",
      beats: [
        {
          action: "读出聚落形态",
          title: "声音越过不平的地面",
          body: "Kuş dili 是对土耳其语语音的口哨化表达，使用在陡峭、彼此分离的聚落地形中。",
        },
        {
          action: "让实践者留在画面里",
          title: "传承不是抽取",
          body: "UNESCO 的守护记录强调教育与实践者参与，并警惕脱离语境。",
        },
      ],
    },
  },
  4: {
    en: {
      composition: "mazatec-field",
      eyebrow: "RÍO SANTIAGO · NEAR HUAUTLA DE JIMÉNEZ",
      title: "In one field record, tone holds the line.",
      deck: "Cowan’s Mazatec whistle-speech texts foreground tone when ordinary spoken segments are absent.",
      boundary:
        "A documented local record—not a claim about every Mazatec community.",
      sourceIds: ["mazatec-sil-archive", "mazatec-cowan"],
      sourceStamp: "Sources · SIL Mexico archive / Cowan 1948",
      beats: [
        {
          action: "Keep the record bounded",
          title: "Conversation in a field record",
          body: "The Río Santiago record near Huautla de Jiménez documents conversational whistle speech; its texts show tone carrying a wide lexical range.",
        },
      ],
    },
    zh: {
      composition: "mazatec-field",
      eyebrow: "RÍO SANTIAGO · HUAUTLA DE JIMÉNEZ 附近",
      title: "一份田野记录里，声调留住了信息。",
      deck: "Cowan 记录的马萨特克口哨语音文本表明：常规语段缺席时，声调仍处于核心位置。",
      boundary: "这是一份有地点的在地记录，不代表每个马萨特克社群。",
      sourceIds: ["mazatec-sil-archive", "mazatec-cowan"],
      sourceStamp: "资料 · SIL Mexico 档案 / Cowan 1948",
      beats: [
        {
          action: "守住记录的边界",
          title: "田野记录中的对话",
          body: "Huautla de Jiménez 附近 Río Santiago 的记录呈现口哨对话；文本显示声调可承载宽广的词汇区分。",
        },
      ],
    },
  },
  5: {
    en: {
      composition: "three-waveforms",
      eyebrow: "THREE LINES · THREE SYSTEMS",
      title: "A shared whistle. Not a single language.",
      deck: "Silbo Gomero, Kuş dili, and Mazatec whistled speech differ in linguistic structure, use, and transmission context.",
      boundary:
        "The sources support comparison across three bounded practices—not acoustic equivalence or a universal code.",
      sourceIds: [
        "silbo-unesco",
        "kus-unesco",
        "kuskoy-linguistics",
        "mazatec-sil-archive",
        "mazatec-cowan",
      ],
      sourceStamp:
        "Sources · UNESCO Silbo / UNESCO Türkiye / Kusköy linguistics / SIL Mexico / Cowan 1948",
      beats: [
        {
          action: "Resolve the comparison",
          title: "Keep three systems distinct",
          body: "Silbo follows Spanish categories, Kuş dili whistles Turkish speech, and Cowan’s Mazatec record foregrounds tone.",
        },
      ],
    },
    zh: {
      composition: "three-waveforms",
      eyebrow: "三条线 · 三种系统",
      title: "共享口哨，不是一门语言。",
      deck: "Silbo Gomero、Kuş dili 与马萨特克口哨语音，在语言结构、使用语境与传承方式上都不相同。",
      boundary: "资料支持的是三个有边界案例的比较，不是声学等价或全球通用编码。",
      sourceIds: [
        "silbo-unesco",
        "kus-unesco",
        "kuskoy-linguistics",
        "mazatec-sil-archive",
        "mazatec-cowan",
      ],
      sourceStamp:
        "资料 · UNESCO Silbo / UNESCO Türkiye / Kuşköy 语言学研究 / SIL Mexico / Cowan 1948",
      beats: [
        {
          action: "收束比较",
          title: "让三种系统保持分明",
          body: "Silbo 对应西班牙语类别，Kuş dili 口哨化表达土耳其语，Cowan 的马萨特克记录突出声调。",
        },
      ],
    },
  },
};

const BEAT_LAYOUT_MODES: Partial<Record<SceneId, BeatLayoutMode>> = {
  1: "reserved",
  2: "reserved",
  3: "reserved",
};

export const WHISTLED_LANGUAGE_TRANSITION_SCORE = {
  "1->2": "ink-spread",
  "2->3": "crossfade",
  "3->4": "diagonal-pan",
  "4->5": "ink-spread",
} as const;

const TRANSITION_MAP: SceneTransitionMap = WHISTLED_LANGUAGE_TRANSITION_SCORE;

export const WHISTLED_LANGUAGE_SCENE_CLAIMS = {
  1: ["shared-medium-not-global-language"],
  2: ["silbo-spanish-whistle-structure", "silbo-local-transmission"],
  3: ["kus-terrain-and-words", "kus-contextual-safeguarding"],
  4: ["mazatec-tone-field-record"],
  5: [
    "shared-medium-not-global-language",
    "silbo-spanish-whistle-structure",
    "kus-terrain-and-words",
    "mazatec-tone-field-record",
  ],
} as const satisfies Record<SceneId, readonly WhistledLanguageClaimId[]>;

type SceneCopyClaimMap = {
  eyebrow: WhistledLanguageClaimId;
  title: WhistledLanguageClaimId;
  deck: WhistledLanguageClaimId;
  boundary: WhistledLanguageClaimId;
  beats: ReadonlyArray<{
    title: WhistledLanguageClaimId;
    body: WhistledLanguageClaimId;
  }>;
  supplemental: readonly WhistledLanguageClaimId[];
};

export const WHISTLED_LANGUAGE_COPY_CLAIMS = {
  1: {
    eyebrow: "shared-medium-not-global-language",
    title: "shared-medium-not-global-language",
    deck: "shared-medium-not-global-language",
    boundary: "shared-medium-not-global-language",
    beats: [
      {
        title: "shared-medium-not-global-language",
        body: "shared-medium-not-global-language",
      },
      {
        title: "shared-medium-not-global-language",
        body: "shared-medium-not-global-language",
      },
      {
        title: "shared-medium-not-global-language",
        body: "shared-medium-not-global-language",
      },
      {
        title: "shared-medium-not-global-language",
        body: "shared-medium-not-global-language",
      },
    ],
    supplemental: [],
  },
  2: {
    eyebrow: "silbo-spanish-whistle-structure",
    title: "silbo-spanish-whistle-structure",
    deck: "silbo-spanish-whistle-structure",
    boundary: "silbo-local-transmission",
    beats: [
      {
        title: "silbo-spanish-whistle-structure",
        body: "silbo-spanish-whistle-structure",
      },
      {
        title: "silbo-spanish-whistle-structure",
        body: "silbo-spanish-whistle-structure",
      },
      {
        title: "silbo-local-transmission",
        body: "silbo-local-transmission",
      },
    ],
    supplemental: [],
  },
  3: {
    eyebrow: "kus-terrain-and-words",
    title: "kus-terrain-and-words",
    deck: "kus-terrain-and-words",
    boundary: "kus-contextual-safeguarding",
    beats: [
      {
        title: "kus-terrain-and-words",
        body: "kus-terrain-and-words",
      },
      {
        title: "kus-contextual-safeguarding",
        body: "kus-contextual-safeguarding",
      },
    ],
    supplemental: [],
  },
  4: {
    eyebrow: "mazatec-tone-field-record",
    title: "mazatec-tone-field-record",
    deck: "mazatec-tone-field-record",
    boundary: "mazatec-tone-field-record",
    beats: [
      {
        title: "mazatec-tone-field-record",
        body: "mazatec-tone-field-record",
      },
    ],
    supplemental: [],
  },
  5: {
    eyebrow: "shared-medium-not-global-language",
    title: "shared-medium-not-global-language",
    deck: "shared-medium-not-global-language",
    boundary: "shared-medium-not-global-language",
    beats: [
      {
        title: "shared-medium-not-global-language",
        body: "shared-medium-not-global-language",
      },
    ],
    supplemental: [
      "silbo-spanish-whistle-structure",
      "kus-terrain-and-words",
      "mazatec-tone-field-record",
    ],
  },
} as const satisfies Record<SceneId, SceneCopyClaimMap>;

export const WHISTLED_LANGUAGE_CLAIMS = [
  {
    id: "shared-medium-not-global-language",
    visibleClaim:
      "Silbo Gomero, Kuş dili, and the documented Mazatec whistle-speech record share a whistled medium, but the comparison does not make them one global language.",
    sceneIds: [1, 5] as const,
    sourceIds: ["silbo-unesco", "kus-unesco", "kuskoy-linguistics", "mazatec-cowan"] as const,
  },
  {
    id: "silbo-spanish-whistle-structure",
    visibleClaim:
      "UNESCO describes Silbo Gomero as a whistled rendering of islanders’ Spanish, with two whistle distinctions for vowels and four for consonants.",
    sceneIds: [2, 5] as const,
    sourceIds: ["silbo-unesco"] as const,
  },
  {
    id: "silbo-local-transmission",
    visibleClaim:
      "Silbo Gomero’s current transmission is discussed through school teaching and community-led safeguarding in La Gomera rather than as a detached code.",
    sceneIds: [2] as const,
    sourceIds: ["silbo-unesco", "silbo-community"] as const,
  },
  {
    id: "kus-terrain-and-words",
    visibleClaim:
      "UNESCO connects Türkiye’s whistled language with steep mountains, rugged terrain, and dispersed settlements; Kusköy linguistic research treats it as whistled Turkish speech.",
    sceneIds: [3, 5] as const,
    sourceIds: ["kus-unesco", "kuskoy-linguistics"] as const,
  },
  {
    id: "kus-contextual-safeguarding",
    visibleClaim:
      "UNESCO’s safeguarding decision calls for education, participation by bearers, and protection from decontextualization when transmitting Türkiye’s whistled-language practice.",
    sceneIds: [3] as const,
    sourceIds: ["kus-unesco", "kus-safeguarding"] as const,
  },
  {
    id: "mazatec-tone-field-record",
    visibleClaim:
      "Cowan’s documented Río Santiago field texts near Huautla de Jiménez show tone carrying a wide lexical range in Mazatec whistle speech when normal spoken segments are absent.",
    sceneIds: [4, 5] as const,
    sourceIds: ["mazatec-sil-archive", "mazatec-cowan"] as const,
  },
] as const satisfies readonly {
  id: WhistledLanguageClaimId;
  visibleClaim: string;
  sceneIds: readonly SceneId[];
  sourceIds: readonly WhistledLanguageSourceId[];
}[];

export const WHISTLED_LANGUAGE_SOURCES = [
  {
    id: "silbo-unesco",
    authority: "UNESCO Intangible Cultural Heritage",
    title:
      "Whistled language of the island of La Gomera (Canary Islands), the Silbo Gomero",
    citation:
      "UNESCO Intangible Cultural Heritage. Whistled language of the island of La Gomera (Canary Islands), the Silbo Gomero (Representative List, 2009).",
    url: "https://ich.unesco.org/en/RL/whistled-language-of-the-island-of-la-gomera-the-canary-islands-silbo-gomero-00172",
    accessDate: "2026-07-10",
    supports:
      "UNESCO identifies Silbo Gomero as a whistled rendering of the islanders’ Spanish. Its description reports two whistled distinctions replacing Spanish vowels and four replacing consonants, and notes teaching in island schools.",
    boundary:
      "This source describes Silbo Gomero on La Gomera. It does not authorize treating all whistled practices as Spanish-derived, reducing the practice to a universal cipher, or inferring the experience of every individual islander.",
    claimIds: [
      "shared-medium-not-global-language",
      "silbo-spanish-whistle-structure",
      "silbo-local-transmission",
    ],
  },
  {
    id: "silbo-community",
    authority: "Cabildo Insular de La Gomera",
    title:
      "The Cabildo recognizes the work of the Asociación Cultural Silbo Gomero and the bearer community",
    citation:
      "Cabildo Insular de La Gomera. El Cabildo pone en valor la labor de la Asociación Cultural Silbo Gomero y la comunidad portadora (2025).",
    url: "https://www.lagomera.es/noticia/el-cabildo-pone-en-valor-la-labor-de-la-asociacion-cultural-silbo-gomero-y-la-co",
    accessDate: "2026-07-10",
    supports:
      "The island institution names the Asociación Cultural Silbo Gomero and the bearer community as essential to conservation, transmission, and diffusion, including work connected with teaching in classrooms.",
    boundary:
      "This institutional report supports the local transmission and safeguarding context. It does not quantify present speaker competence, prove uniform participation, or replace the community’s own voices with an administrative account.",
    claimIds: ["silbo-local-transmission"],
  },
  {
    id: "kus-unesco",
    authority: "UNESCO Intangible Cultural Heritage",
    title: "Whistled language (Türkiye)",
    citation:
      "UNESCO Intangible Cultural Heritage. Whistled language (Türkiye), nomination file No. 00658 (Urgent Safeguarding List, 2017).",
    url: "https://ich.unesco.org/en/USL/whistled-language-00658",
    accessDate: "2026-07-10",
    supports:
      "UNESCO describes the practice as using whistling to simulate and articulate words, developed in relation to steep mountains, rugged topography, and a need to communicate across a dispersed terrain.",
    boundary:
      "The UNESCO element is a specific safeguarding entry for Türkiye. It does not mean every community in the Black Sea region uses the practice, nor does it establish an interchangeable global model for whistled speech.",
    claimIds: [
      "shared-medium-not-global-language",
      "kus-terrain-and-words",
      "kus-contextual-safeguarding",
    ],
  },
  {
    id: "kus-safeguarding",
    authority: "UNESCO Intergovernmental Committee",
    title:
      "Decision 17.COM 6.A.6 on the status of Whistled language in Türkiye",
    citation:
      "UNESCO Intergovernmental Committee for the Safeguarding of the Intangible Cultural Heritage. Decision 17.COM 6.A.6 (2022).",
    url: "https://ich.unesco.org/en/decisions/17.COM/6.A.6",
    accessDate: "2026-07-10",
    supports:
      "The Committee records safeguarding through education, training with bearers and practitioners, and community participation; it explicitly warns against decontextualization and misappropriation in transmission beyond bearer communities.",
    boundary:
      "The decision concerns safeguarding measures and community participation. It does not authorize a slide to reproduce speech, claim a single standard practice, or imply that documentation substitutes for living transmission.",
    claimIds: ["kus-contextual-safeguarding"],
  },
  {
    id: "kuskoy-linguistics",
    authority: "De Gruyter Mouton / International Congress of Phonetic Sciences",
    title: "Phonetic and Linguistic Study of the Whistled Speech of Kuskoy, Turkey",
    citation:
      "Moles, A. A., & Busnel, R. G. (1972). Phonetic and Linguistic Study of the Whistled Speech of Kuskoy, Turkey. Proceedings of the Seventh International Congress of Phonetic Sciences, 737–742.",
    url: "https://www.degruyterbrill.com/document/doi/10.1515/9783110814750-092/html",
    accessDate: "2026-07-10",
    supports:
      "This phonetic-linguistic study identifies the Kuskoy practice as whistled speech in Turkey, providing a source-bound basis for distinguishing its speech relationship from Silbo Gomero and the Mazatec field record.",
    boundary:
      "This historical phonetic study concerns Kuskoy and its research setting. It does not describe every Turkish variety, establish a current community census, or replace UNESCO’s safeguarding record for the broader cultural context.",
    claimIds: [
      "shared-medium-not-global-language",
      "kus-terrain-and-words",
    ],
  },
  {
    id: "mazatec-sil-archive",
    authority: "SIL Mexico / Instituto Lingüístico de Verano",
    title: "Mazateco Whistle Speech",
    citation:
      "SIL Mexico Archives. Mazateco Whistle Speech, George M. Cowan, Language 24(3), 1948, pp. 280–286.",
    url: "https://mexico.sil.org/resources/archives/2247",
    accessDate: "2026-07-10",
    supports:
      "The SIL Mexico archive identifies Cowan’s 1948 article as a linguistic and sociolinguistic description of Huautla Mazatec whistle speech, including texts transcribed with tone notation and their translations.",
    boundary:
      "The archive catalog identifies one publication and language variety. It should not be expanded into an account of all Mazatec communities, a present-day prevalence estimate, or an invitation to reproduce community speech without permission.",
    claimIds: ["mazatec-tone-field-record"],
  },
  {
    id: "mazatec-cowan",
    authority: "Language / Linguistic Society of America",
    title: "Mazateco Whistle Speech",
    citation:
      "Cowan, G. M. (1948). Mazateco Whistle Speech. Language, 24(3), 280–286. https://doi.org/10.2307/410362.",
    url: "https://www.cambridge.org/core/journals/language/article/abs/mazateco-whistle-speech/E1596F4BB83751CF1C379C96E8583AB0",
    accessDate: "2026-07-10",
    supports:
      "Cowan’s article describes field texts gathered at Río Santiago near Huautla de Jiménez and reports that tone enables a wide lexical range in conversation without the segmental phonemes of ordinary spoken speech.",
    boundary:
      "This is a dated, local field record with named research conditions. The slide keeps its claim tied to that record and does not turn it into a timeless or universal description of Mazatec language, people, or cultural practice.",
    claimIds: [
      "shared-medium-not-global-language",
      "mazatec-tone-field-record",
    ],
  },
] as const satisfies readonly (TopicSource & {
  id: WhistledLanguageSourceId;
  authority: string;
  title: string;
  citation: string;
  accessDate: "2026-07-10";
  boundary: string;
  claimIds: readonly WhistledLanguageClaimId[];
})[];

function factualClaimAttributes(claimId: WhistledLanguageClaimId): {
  "data-factual-node": "true";
  "data-claim-id": WhistledLanguageClaimId;
  "data-claim-source": string;
} {
  const claim = WHISTLED_LANGUAGE_CLAIMS.find((entry) => entry.id === claimId);
  if (!claim) {
    throw new Error(`Missing whistled-language claim mapping for ${claimId}`);
  }
  return {
    "data-factual-node": "true",
    "data-claim-id": claimId,
    "data-claim-source": claim.sourceIds.join(" "),
  };
}

function copyFor(scene: SceneId, language: Language): SceneCopy {
  return COPY[scene][language];
}

function asSceneId(scene: number): SceneId {
  return SCENE_IDS.includes(scene as SceneId) ? (scene as SceneId) : 1;
}

function clampBeat(scene: SceneId, beat: number): number {
  const maxBeat = COPY[scene].en.beats.length - 1;
  return Math.max(0, Math.min(maxBeat, beat));
}

function reveal(isVisible: boolean): "true" | "false" {
  return isVisible ? "true" : "false";
}

function SceneArtwork({ scene, beat }: { scene: SceneId; beat: number }) {
  switch (scene) {
    case 1:
      return <MountainSilence beat={beat} />;
    case 2:
      return <CanaryValley beat={beat} />;
    case 3:
      return <BlackSeaValley beat={beat} />;
    case 4:
      return <MazatecField />;
    default:
      return <ThreeWaveforms />;
  }
}

function MountainSilence({ beat }: { beat: number }) {
  return (
    <svg
      className={styles.artwork}
      viewBox="0 0 1920 1080"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path className={styles.mountainFar} d="M0 610L392 300L780 630L1080 354L1496 630L1920 270V1080H0Z" />
      <path className={styles.mountainLeft} d="M0 522L480 188L828 744L0 926Z" />
      <path className={styles.mountainRight} d="M1920 414L1460 166L1080 774L1920 934Z" />
      <path className={styles.valleyPlane} d="M520 846C744 688 1030 668 1410 824L1592 1080H252Z" />
      <path className={styles.keyline} d="M0 522L480 188L828 744M1920 414L1460 166L1080 774M520 846C744 688 1030 668 1410 824" />
      <path className={styles.mistStroke} data-reveal={reveal(beat >= 1)} d="M526 634C742 580 1042 574 1368 640" />
      <path className={styles.soundLine} data-reveal={reveal(beat >= 1)} d="M544 700C728 634 1044 758 1376 652" />
      <g className={styles.svgReveal} data-reveal={reveal(beat >= 2)}>
        <circle className={styles.scalePoint} cx="724" cy="732" r="11" />
        <path className={styles.scaleStem} d="M724 744V782M704 776H744" />
        <circle className={styles.scalePoint} cx="1224" cy="690" r="11" />
        <path className={styles.scaleStem} d="M1224 702V740M1204 734H1244" />
      </g>
      <path className={styles.soundLineThin} data-reveal={reveal(beat >= 3)} d="M570 746C796 680 1018 792 1344 704" />
    </svg>
  );
}

function CanaryValley({ beat }: { beat: number }) {
  return (
    <svg
      className={styles.artwork}
      viewBox="0 0 1920 1080"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path className={styles.canaryDistant} d="M0 570L346 396L650 588L956 378L1326 598L1650 340L1920 516V1080H0Z" />
      <path className={styles.canaryLeft} d="M0 432L434 260L792 1022L0 1080Z" />
      <path className={styles.canaryRight} d="M1920 392L1512 214L1150 1018L1920 1080Z" />
      <path className={styles.canaryFloor} d="M448 890C728 704 1084 706 1490 902L1660 1080H298Z" />
      <path className={styles.keyline} d="M0 432L434 260L792 1022M1920 392L1512 214L1150 1018M448 890C728 704 1084 706 1490 902" />
      <path className={styles.soundLine} data-reveal={reveal(beat >= 0)} d="M506 606C716 520 1062 712 1418 540" />
      <path className={styles.soundLineThin} data-reveal={reveal(beat >= 1)} d="M514 658C776 556 1030 768 1404 594" />
      <path className={styles.soundLineThin} data-reveal={reveal(beat >= 1)} d="M520 710C742 628 1058 802 1396 650" />
      <g className={styles.svgReveal} data-reveal={reveal(beat >= 2)}>
        <path className={styles.terraceLine} d="M1264 748L1532 708M1302 796L1570 756M1336 844L1602 806" />
        <path className={styles.terraceLine} d="M322 786L536 746M350 838L564 798" />
      </g>
    </svg>
  );
}

function BlackSeaValley({ beat }: { beat: number }) {
  return (
    <svg
      className={styles.artwork}
      viewBox="0 0 1920 1080"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path className={styles.blackSeaBack} d="M0 484L248 304L534 498L806 250L1104 500L1432 224L1694 468L1920 306V1080H0Z" />
      <path className={styles.blackSeaLeft} d="M0 378L494 154L892 1068H0Z" />
      <path className={styles.blackSeaRight} d="M1920 276L1472 120L1046 1076H1920Z" />
      <path className={styles.blackSeaFloor} d="M604 928L978 448L1350 928L1540 1080H412Z" />
      <path className={styles.keyline} d="M0 378L494 154L892 1068M1920 276L1472 120L1046 1076M604 928L978 448L1350 928" />
      <g className={styles.settlementMarks} data-reveal={reveal(beat >= 0)}>
        <path d="M360 600H420V644H360ZM578 694H638V738H578ZM1352 596H1412V640H1352ZM1518 716H1578V760H1518Z" />
      </g>
      <path className={styles.soundLine} data-reveal={reveal(beat >= 0)} d="M384 752C660 610 1002 724 1514 438" />
      <path className={styles.soundLineThin} data-reveal={reveal(beat >= 1)} d="M426 804C716 654 1064 774 1488 510" />
    </svg>
  );
}

function MazatecField() {
  return (
    <svg
      className={styles.artwork}
      viewBox="0 0 1920 1080"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path className={styles.fieldBack} d="M0 620L318 412L694 654L1012 366L1428 646L1746 448L1920 574V1080H0Z" />
      <path className={styles.fieldPlaneOne} d="M0 808C304 664 600 698 910 818C1208 934 1574 854 1920 712V1080H0Z" />
      <path className={styles.fieldPlaneTwo} d="M0 938C328 784 654 838 1002 932C1354 1028 1658 936 1920 852V1080H0Z" />
      <path className={styles.keyline} d="M0 808C304 664 600 698 910 818C1208 934 1574 854 1920 712M0 938C328 784 654 838 1002 932C1354 1028 1658 936 1920 852" />
      <path className={styles.toneContour} d="M344 604C468 536 570 676 700 596S922 510 1054 594S1264 670 1412 534" />
      <path className={styles.toneContourThin} d="M392 656C520 604 612 730 740 648S964 560 1094 648S1296 718 1458 594" />
      <path className={styles.fieldMark} d="M142 834L436 746M694 888L1012 790M1248 864L1652 742" />
    </svg>
  );
}

function ThreeWaveforms() {
  return (
    <svg
      className={styles.artwork}
      viewBox="0 0 1920 1080"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path className={styles.waveHorizon} d="M0 786C324 724 604 760 924 724C1244 690 1586 730 1920 662V1080H0Z" />
      <path className={styles.keyline} d="M0 786C324 724 604 760 924 724C1244 690 1586 730 1920 662" />
      <path className={styles.waveOne} d="M360 322C472 258 558 386 666 324S862 250 974 324S1162 392 1276 306S1474 266 1586 328" />
      <path className={styles.waveTwo} d="M360 512C462 434 566 574 678 510S884 440 990 516S1194 590 1304 494S1492 446 1586 516" />
      <path className={styles.waveThree} d="M360 698C464 626 560 760 678 694S880 624 994 700S1190 776 1304 676S1494 632 1586 702" />
      <path className={styles.waveGuide} d="M324 322H1598M324 512H1598M324 698H1598" />
    </svg>
  );
}

function SceneCopyBlock({
  scene,
  beat,
  language,
}: {
  scene: SceneId;
  beat: number;
  language: Language;
}) {
  const copy = copyFor(scene, language);
  const copyClaims = WHISTLED_LANGUAGE_COPY_CLAIMS[scene];
  const sceneClass =
    scene === 1
      ? styles.copyMountain
      : scene === 2
        ? styles.copyCanary
        : scene === 3
          ? styles.copyBlackSea
          : scene === 4
            ? styles.copyMazatec
            : styles.copyWaveforms;

  return (
    <header className={[styles.copyBlock, sceneClass].join(" ")}>
      <p
        className={styles.eyebrow}
        data-beat-layout-item="true"
        {...factualClaimAttributes(copyClaims.eyebrow)}
      >
        {copy.eyebrow}
      </p>
      <h1
        className={styles.title}
        data-beat-layout-item="true"
        {...factualClaimAttributes(copyClaims.title)}
      >
        {copy.title}
      </h1>
      <p
        className={styles.deck}
        data-beat-layout-item="true"
        {...factualClaimAttributes(copyClaims.deck)}
      >
        {copy.deck}
      </p>
      <div
        className={styles.beatSlots}
        data-beat-layout-item="true"
        data-copy-layout="intrinsic-reserved-rows"
        data-copy-row-count={copy.beats.length}
      >
        {copy.beats.map((item, index) => {
          const beatClaims = copyClaims.beats[index];
          if (!beatClaims) {
            throw new Error(
              `Missing whistled-language beat claim mapping for scene ${scene}, beat ${index}`,
            );
          }
          return (
            <article
              className={styles.beatSlot}
              data-copy-row="true"
              data-reveal={reveal(index <= beat)}
              key={item.title}
            >
              <p className={styles.beatAction} data-copy-role="action">
                {item.action}
              </p>
              <h2
                data-copy-role="heading"
                {...factualClaimAttributes(beatClaims.title)}
              >
                {item.title}
              </h2>
              <p
                data-copy-role="body"
                {...factualClaimAttributes(beatClaims.body)}
              >
                {item.body}
              </p>
            </article>
          );
        })}
      </div>
      <p
        className={styles.boundary}
        data-beat-layout-item="true"
        {...factualClaimAttributes(copyClaims.boundary)}
      >
        {copy.boundary}
      </p>
    </header>
  );
}

function SourceStamp({ scene, language }: { scene: SceneId; language: Language }) {
  const copy = copyFor(scene, language);
  return (
    <p
      className={styles.sourceStamp}
      data-source-stamp="true"
      data-source-ids={copy.sourceIds.join(" ")}
    >
      {copy.sourceStamp}
    </p>
  );
}

function WaveformLegend({ language }: { language: Language }) {
  const labels: ReadonlyArray<{
    text: string;
    claimId: WhistledLanguageClaimId;
  }> =
    language === "zh"
      ? [
          {
            text: "Silbo Gomero · 西班牙语的口哨化压缩",
            claimId: "silbo-spanish-whistle-structure",
          },
          {
            text: "Kuş dili · 土耳其语语音的口哨化表达",
            claimId: "kus-terrain-and-words",
          },
          {
            text: "Mazatec 记录 · 声调被置于前景",
            claimId: "mazatec-tone-field-record",
          },
        ]
      : [
          {
            text: "Silbo Gomero · a whistled compression of Spanish",
            claimId: "silbo-spanish-whistle-structure",
          },
          {
            text: "Kuş dili · a whistled articulation of Turkish speech",
            claimId: "kus-terrain-and-words",
          },
          {
            text: "Mazatec record · tone held in the foreground",
            claimId: "mazatec-tone-field-record",
          },
        ];

  return (
    <div className={styles.waveformLegend} aria-label={language === "zh" ? "三种系统" : "Three systems"}>
      {labels.map((label) => (
        <p
          key={label.text}
          {...factualClaimAttributes(label.claimId)}
        >
          {label.text}
        </p>
      ))}
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
  language: Language;
  isActive: boolean;
}) {
  const sceneId = asSceneId(scene);
  const activeBeat = clampBeat(sceneId, beat);
  const copy = copyFor(sceneId, language);

  return (
    <section
      className={[styles.scene, styles[`scene${sceneId}`]].join(" ")}
      data-composition={copy.composition}
      data-claim-ids={WHISTLED_LANGUAGE_SCENE_CLAIMS[sceneId].join(" ")}
      data-active-scene={isActive ? "true" : "false"}
      data-beat-layout-container="true"
      data-beat-layout-mode="reserved"
      aria-label={copy.title}
    >
      <div className={styles.bokashiSky} aria-hidden="true" />
      <SceneArtwork scene={sceneId} beat={activeBeat} />
      <SceneCopyBlock scene={sceneId} beat={activeBeat} language={language} />
      {sceneId === 5 && <WaveformLegend language={language} />}
      {(sceneId === 4 || sceneId === 5) && (
        <p
          className={styles.audioBoundary}
          data-audio-boundary="true"
          data-implementation-note="true"
        >
          {language === "zh"
            ? "示意线条 · 未使用录音或生成式声音"
            : "Illustrative lines · no recorded or generated voice used"}
        </p>
      )}
      <SourceStamp scene={sceneId} language={language} />
    </section>
  );
}

function isolateStageEvent(event: SyntheticEvent) {
  event.stopPropagation();
}

function MountainPeakArray({
  scene,
  language,
  onNavigate,
}: {
  scene: SceneId;
  language: Language;
  onNavigate?: (scene: number, beat: number) => void;
}) {
  const [expandedScene, setExpandedScene] = useState<SceneId>(scene);

  useEffect(() => {
    setExpandedScene(scene);
  }, [scene]);

  const jump = (target: SceneId) => {
    setExpandedScene(target);
    onNavigate?.(target, 0);
  };

  const handleKeyboard = (
    event: ReactKeyboardEvent<HTMLButtonElement>,
    target: SceneId,
  ) => {
    event.stopPropagation();
    let destination: SceneId | null = null;

    switch (event.key) {
      case "Enter":
      case " ":
      case "Spacebar":
        destination = target;
        break;
      case "ArrowLeft":
      case "ArrowUp":
        destination = Math.max(1, target - 1) as SceneId;
        break;
      case "ArrowRight":
      case "ArrowDown":
        destination = Math.min(5, target + 1) as SceneId;
        break;
      case "Home":
        destination = 1;
        break;
      case "End":
        destination = 5;
        break;
      default:
        return;
    }

    event.preventDefault();
    if (event.repeat || destination === null) return;
    jump(destination);
  };

  const handleKeyboardUp = (event: ReactKeyboardEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    if (event.key === "Enter" || event.key === " " || event.key === "Spacebar") {
      event.preventDefault();
    }
  };

  const isolateTouch = (event: ReactTouchEvent<HTMLElement>) => {
    event.stopPropagation();
  };

  const isolatePointer = (event: ReactPointerEvent<HTMLElement>) => {
    event.stopPropagation();
  };

  return (
    <nav
      className={styles.mountainNav}
      aria-label={language === "zh" ? "山峰场景导航" : "Mountain peak scene navigation"}
      data-topic-navigation="true"
      data-navigation-geometry="spatial-node"
      data-navigation-carrier="mountain-peak-array"
      data-navigation-invocation="click-expand"
      data-navigation-feedback="next-state-preview"
      data-expanded-scene={expandedScene}
      data-next-state-preview={expandedScene === 5 ? 1 : expandedScene + 1}
      onClick={isolateStageEvent}
      onTouchStartCapture={isolateTouch}
      onTouchMoveCapture={isolateTouch}
      onTouchEndCapture={isolateTouch}
      onTouchCancelCapture={isolateTouch}
      onPointerDown={isolatePointer}
      onPointerMove={isolatePointer}
      onPointerUp={isolatePointer}
      onPointerCancel={isolatePointer}
    >
      <span className={styles.navCaption} aria-hidden="true">
        {language === "zh" ? "山脊" : "RIDGES"}
      </span>
      <div className={styles.peakRow}>
        {SCENE_IDS.map((target) => {
          const current = target === scene;
          const expanded = target === expandedScene;
          const next = target === 5 ? 1 : target + 1;
          return (
            <button
              className={styles.peakButton}
              type="button"
              key={target}
              aria-label={
                language === "zh"
                  ? `跳转至山峰场景 ${target}`
                  : `Jump to mountain scene ${target}`
              }
              aria-current={current ? "true" : undefined}
              data-active={current ? "true" : "false"}
              data-expanded={expanded ? "true" : "false"}
              data-next-state-preview={next}
              onClick={(event) => {
                event.stopPropagation();
                jump(target);
              }}
              onKeyDown={(event) => handleKeyboard(event, target)}
              onKeyUp={handleKeyboardUp}
            >
              <span className={styles.peakShape} aria-hidden="true" />
              <span className={styles.nextPeakShape} aria-hidden="true" />
            </button>
          );
        })}
      </div>
      <span className={styles.nextPreviewLabel} aria-live="polite">
        {language === "zh" ? "点击峰顶，预览下一道山脊" : "Click a peak to preview the next ridge"}
      </span>
    </nav>
  );
}

export function getMetadata(language: Language): StyleMetadata {
  const zh = language === "zh";
  return {
    id: STYLE_ID,
    band: "craft-cultural",
    name: zh ? "木版浮世" : "Woodblock Floating World",
    theme: zh ? "山谷传递的语言" : "A Language Carried by Mountains",
    densityLabel: zh ? "中密度叙事" : "Medium Narrative",
    heroScene: 5,
    colors: {
      bg: "#efddb0",
      ink: "#17394e",
      panel: "#e1c78f",
    },
    typography: {
      header: "Georgia 700",
      body: "Noto Sans SC 400",
    },
    tags: [
      "woodblock",
      "landscape",
      "whistled-speech",
      "language",
      "cultural-context",
      "source-led",
    ],
    fonts: ["Georgia", "cjk:Noto Serif SC", "cjk:Noto Sans SC"],
    scenes: SCENE_IDS.map((scene) => {
      const copy = copyFor(scene, language);
      return {
        id: scene,
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

export default function WhistledLanguage({
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
  const activeScene = asSceneId(scene);
  const activeBeat = clampBeat(activeScene, beat);

  return (
    <div
      className={styles.root}
      data-topic-id={TOPIC_ID}
      data-style-id={STYLE_ID}
      data-motion-ceiling="1"
      data-settled={settled ? "true" : "false"}
      data-frozen={frozen ? "true" : "false"}
      data-thumbnail={isThumbnail ? "true" : "false"}
      data-static={settled ? "true" : "false"}
    >
      <div className={styles.paperFrame} aria-hidden="true" />
      <SpatialSceneTrack
        scene={activeScene}
        beat={activeBeat}
        sceneIds={[...SCENE_IDS]}
        transitionKind="ink-spread"
        transitionMap={TRANSITION_MAP}
        transitionDurationMs={560}
        reducedMotion={settled}
        beatLayoutModes={BEAT_LAYOUT_MODES}
        className={styles.sceneTrack}
        renderScene={(renderedScene, renderedBeat, isActive) => (
          <ScenePanel
            scene={renderedScene}
            beat={renderedBeat}
            language={language}
            isActive={isActive}
          />
        )}
      />
      {!isThumbnail && (
        <MountainPeakArray
          scene={activeScene}
          language={language}
          onNavigate={onNavigate}
        />
      )}
    </div>
  );
}

export const whistledLanguageTopic = defineStyleTopic({
  id: TOPIC_ID,
  topic: {
    en: "Whistled Language",
    zh: "口哨语言",
  },
  model: "GPT-5.6 Terra/Max",
  component: WhistledLanguage,
  getMetadata,
  navigation: {
    geometry: "spatial-node",
    carrier: "mountain-peak-array",
    invocation: "click-expand",
    feedback: "next-state-preview",
  },
  sources: WHISTLED_LANGUAGE_SOURCES,
  transitionScore: WHISTLED_LANGUAGE_TRANSITION_SCORE,
});

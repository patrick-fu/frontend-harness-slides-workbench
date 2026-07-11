import { useCallback, useState } from "react";
import type { CSSProperties, KeyboardEvent, ReactNode } from "react";
import type {
  BespokeStyleProps,
  StyleMetadata,
  TopicSource,
  TopicTransitionScore,
} from "../types";
import SpatialSceneTrack, {
  type BeatLayoutMode,
  type SceneTransitionKind,
  type SceneTransitionMap,
} from "./SpatialSceneTrack";
import { defineStyleTopic } from "./topic";
import styles from "./warm-editorial-feature-oral-to-written.module.css";

type Lang = "en" | "zh";
type SceneId = 1 | 2 | 3 | 4 | 5;

interface BeatCopy {
  action: string;
  title: string;
  body: string;
}

interface LocaleCopy {
  rootLabel: string;
  chapters: readonly [string, string, string, string, string];
  chapterSlugs: readonly [string, string, string, string, string];
  indexOpen: string;
  indexClose: string;
  openChapter: (scene: SceneId, label: string) => string;
  scenes: {
    1: {
      eyebrow: string;
      title: string;
      epic: string;
      deck: string;
      date: string;
      place: string;
      returnLine: string;
      credits: readonly { label: string; value: string }[];
    };
    2: {
      eyebrow: string;
      title: string;
      deck: string;
      traceTitle: string;
      traceLabels: readonly string[];
      traceBoundary: string;
      transcriptTitle: string;
      transcript: readonly { cue: string; text: string }[];
      marginTitle: string;
      margin: readonly string[];
      takeaway: string;
    };
    3: {
      eyebrow: string;
      title: string;
      deck: string;
      layers: readonly {
        index: string;
        label: string;
        title: string;
        body: string;
        meta: string;
      }[];
      boundary: string;
    };
    4: {
      eyebrow: string;
      title: string;
      deck: string;
      versions: readonly {
        year: string;
        channel: string;
        title: string;
        count: string;
        body: string;
        credit: string;
      }[];
      takeaway: string;
      boundary: string;
    };
    5: {
      eyebrow: string;
      title: string;
      deck: string;
      voiceTitle: string;
      voiceBody: string;
      chainTitle: string;
      chain: readonly string[];
      rightsTitle: string;
      rightsBody: string;
      coda: string;
    };
  };
  beats: Record<SceneId, readonly BeatCopy[]>;
}

type BoundedSource = TopicSource & {
  id: string;
  authority: string;
  title: string;
  citation: string;
  boundary: string;
};

export const ORAL_TO_WRITTEN_SOURCES = [
  {
    id: "mpc-1935",
    authority: "Milman Parry Collection of Oral Literature, Harvard University",
    title: "The Milman Parry Collection, 1933–35",
    citation:
      "Milman Parry Collection of Oral Literature. ‘The Milman Parry Collection, 1933–35.’ Harvard University. Accessed 10 July 2026.",
    url: "https://mpc.chs.harvard.edu/milman-parry-collection-1933-35/",
    supports:
      "Identifies Milman Parry, Nikola Vujnović, and Albert Lord; distinguishes dictated texts, aluminum-disc sound recordings, and later notebook transcriptions; and describes the alternating-turntable recording method.",
    boundary:
      "This is collection-level workflow evidence. It does not make every item an open-licensed asset and does not by itself establish community consent for republication.",
  },
  {
    id: "mpc-lord-1950",
    authority: "Milman Parry Collection of Oral Literature, Harvard University",
    title: "The Lord Collection, 1950–51",
    citation:
      "Milman Parry Collection of Oral Literature. ‘The Lord Collection, 1950–51.’ Harvard University. Accessed 10 July 2026.",
    url: "https://mpc.chs.harvard.edu/lord-collection-1950-51/",
    supports:
      "Confirms that Albert B. Lord returned in 1950–51, recorded some of the same singers including Avdo Međedović, and preserved magnetic-wire recordings with transcriptions for studying change across performances.",
    boundary:
      "The collection page establishes archive custody and research access, not blanket permission to reproduce a particular wire recording or transcript.",
  },
  {
    id: "lord-avdo",
    authority: "Center for Hellenic Studies, Harvard University",
    title: "Avdo Međedović, Guslar",
    citation:
      "Albert B. Lord. ‘Avdo Međedović, Guslar.’ In Epic Singers and Oral Tradition. Cornell University Press; online edition, Center for Hellenic Studies. Accessed 10 July 2026.",
    url: "https://chs.harvard.edu/chapter/4-avdo-mededovic-guslar/",
    supports:
      "Documents Međedović as the performer, the 1935 oral-dictated Wedding text written down by Nikola Vujnović, and Lord’s 23 May 1950 Lord Text 35 performance of the same epic at 8,488 lines.",
    boundary:
      "Line counts identify documented tellings, not a quality ranking or proof that either performance is the single correct version of the epic.",
  },
  {
    id: "foley-paper-text",
    authority: "Oral Tradition journal",
    title: "From Oral Performance to Paper-Text to Cyber-Edition",
    citation:
      "John Miles Foley. ‘From Oral Performance to Paper-Text to Cyber-Edition.’ Oral Tradition 20.2 (2005): 233–263.",
    url: "https://journal.oraltradition.org/wp-content/uploads/files/articles/20ii/Foley.pdf",
    supports:
      "Describes the 12,311-line 1935 oral-dictated Wedding, Vujnović’s written record, Lord’s translation volume, David E. Bynum’s original-language volume, and how editorial apparatus reconfigures performance for a page.",
    boundary:
      "The article analyzes mediation and editorial conventions; it does not license reuse of the underlying epic text, recordings, photographs, or archival facsimiles.",
  },
  {
    id: "harvard-access",
    authority: "Harvard Library",
    title: "Milman Parry Collection of Oral Literature",
    citation:
      "Harvard Library. ‘Milman Parry Collection of Oral Literature.’ Collection access page. Accessed 10 July 2026.",
    url: "https://library.harvard.edu/collections/milman-parry-collection-oral-literature",
    supports:
      "Confirms that Harvard provides an online collection and appointment-based access to additional material in Widener Library, with curators as the contact for qualified research use.",
    boundary:
      "Public catalog access is evidence of archive stewardship and discoverability; it is not equivalent to permission to publish collection items.",
  },
  {
    id: "harvard-rights",
    authority: "Harvard Library",
    title: "Digitized Content Copyright and Viewer Terms of Use",
    citation:
      "Harvard Library. ‘Privacy, Terms of Use & Copyright Information,’ Digitized Content Copyright and Viewer Terms of Use. Updated 14 September 2022; accessed 10 July 2026.",
    url: "https://library.harvard.edu/about/policies/privacy-terms-use-copyright-information",
    supports:
      "States that some digitized content is copyrighted or otherwise restricted, that research access does not automatically authorize copying or publication, and that item-level permission may be required.",
    boundary:
      "Rights can differ by item and jurisdiction. This demo therefore paraphrases verified facts and reproduces no archive audio, transcript, photograph, or facsimile.",
  },
] as const satisfies readonly BoundedSource[];

export const ORAL_TO_WRITTEN_TRANSITION_SCORE = {
  "1->2": "linear-wipe",
  "2->3": "page-turn",
  "3->4": "hard-cut",
  "4->5": "page-turn",
} as const satisfies Readonly<TopicTransitionScore>;

const TRANSITION_MAP: SceneTransitionMap = ORAL_TO_WRITTEN_TRANSITION_SCORE;
const SCENE_IDS: SceneId[] = [1, 2, 3, 4, 5];
// SpatialSceneTrack clears the outgoing panel when the incoming edge is a
// hard cut. Preserve that edge as the active-scene fallback so the settled
// track still reports the authored score during continuous chapter navigation.
const INCOMING_TRANSITION_KIND = {
  1: ORAL_TO_WRITTEN_TRANSITION_SCORE["1->2"],
  2: ORAL_TO_WRITTEN_TRANSITION_SCORE["1->2"],
  3: ORAL_TO_WRITTEN_TRANSITION_SCORE["2->3"],
  4: ORAL_TO_WRITTEN_TRANSITION_SCORE["3->4"],
  5: ORAL_TO_WRITTEN_TRANSITION_SCORE["4->5"],
} as const satisfies Record<SceneId, SceneTransitionKind>;
const BEAT_LAYOUT_MODES = {
  1: "reserved",
  2: "reserved",
  3: "reserved",
  4: "reserved",
} satisfies Partial<Record<number, BeatLayoutMode>>;

const WAVEFORM_HEIGHTS = [
  2.2, 3.7, 5.8, 7.1, 4.6, 3.1, 6.4, 8.8, 5.3, 2.9, 4.1, 7.8, 9.6,
  6.2, 3.8, 2.4, 4.9, 7.3, 5.6, 3.4, 6.8, 10.2, 7.7, 4.1, 2.6, 5.2,
  8.1, 6.5, 3.6, 5.9, 7.2, 2.8,
];

const COPY: Record<Lang, LocaleCopy> = {
  en: {
    rootLabel:
      "Oral to Written: the archival life of The Wedding of Smailagić Meho",
    chapters: ["VOICE", "TRACE", "EDIT", "VERSIONS", "RETURN"],
    chapterSlugs: ["voice", "trace", "edit", "versions", "return"],
    indexOpen: "Open chapter index",
    indexClose: "Close chapter index",
    openChapter: (scene, label) => `Open chapter ${scene}: ${label}`,
    scenes: {
      1: {
        eyebrow: "A documented return · Lord Text 35",
        title: "A voice becomes a page",
        epic: "The Wedding of Smailagić Meho",
        deck: "On 23 May 1950, Avdo Međedović returned to an epic he had already given in a different form in 1935. Albert B. Lord recorded this telling on magnetic wire. The page begins later.",
        date: "23 MAY 1950",
        place: "OBROV / BIJELO POLJE",
        returnLine:
          "The archive preserves a performance event—not one final, authorless text.",
        credits: [
          { label: "PERFORMER", value: "Avdo Međedović" },
          { label: "RECORDER", value: "Albert B. Lord" },
          { label: "MEDIUM", value: "Magnetic wire" },
          { label: "ARCHIVE", value: "Milman Parry Collection" },
        ],
      },
      2: {
        eyebrow: "Listening desk · schematic study",
        title: "Rhythm arrives before lineation",
        deck: "A recording holds cadence, breath, bow pressure, and room sound together. A transcript must decide where one line ends and the next begins.",
        traceTitle: "AURAL TRACE / 1950 WIRE",
        traceLabels: ["breath", "bow", "voice", "room"],
        traceBoundary:
          "Schematic rhythm map — no archive audio reproduced.",
        transcriptTitle: "TRANSCRIPTION WINDOW",
        transcript: [
          { cue: "01", text: "voice enters before the written line" },
          { cue: "02", text: "ten-syllable measure receives a line break" },
          { cue: "03", text: "repetition becomes visible on the page" },
          { cue: "04", text: "pause is reduced to an editorial sign" },
        ],
        marginTitle: "WHAT THE PAGE CAN / CANNOT HOLD",
        margin: [
          "Lineation makes a long performance searchable.",
          "Punctuation interprets timing; it does not merely copy sound.",
          "Audience, room, and instrumental texture exceed the printed line.",
        ],
        takeaway:
          "Transcription is a listening decision made visible.",
      },
      3: {
        eyebrow: "From field notebook to two-volume edition",
        title: "Every readable page carries an editorial hand",
        deck: "The 1935 Wedding reached paper through oral dictation, handwritten capture, editorial lineation, notes, an original-language volume, and an English translation.",
        layers: [
          {
            index: "I",
            label: "FIELD RECORD",
            title: "Oral dictation, 5–12 July 1935",
            body: "Avdo Međedović dictated the epic; Nikola Vujnović wrote it down for Milman Parry’s project. The archive identifies the text as PN 6840.",
            meta: "voice → handwriting",
          },
          {
            index: "II",
            label: "EDITORIAL LAYER / SCHEMATIC",
            title: "Spelling · diacritics · lineation · apparatus",
            body: "An editor regularizes the reading path, divides poetic lines, and adds notes. These marks clarify the record while also exposing choices.",
            meta: "handwriting → edited text",
          },
          {
            index: "III",
            label: "PUBLICATION / 1974",
            title: "One epic, two coordinated books",
            body: "Albert B. Lord prepared the English translation and contextual materials; David E. Bynum prepared the original-language text. Harvard University Press published volumes III and IV.",
            meta: "edited text → published edition",
          },
        ],
        boundary:
          "The middle layer is an explanatory diagram, not a facsimile of Bynum’s exact marks. Consult the edition for its conventions.",
      },
      4: {
        eyebrow: "Parallel reading · the same story, newly composed",
        title: "Difference is evidence, not error",
        deck: "The documented tellings and the published edition share a story-world. They do not collapse into one master wording.",
        versions: [
          {
            year: "1935",
            channel: "ORAL DICTATION",
            title: "Avdo / Vujnović",
            count: "12,311 LINES",
            body: "A complete telling written down over several days. Its scale and phrasing belong to this act of dictation.",
            credit: "PN 6840 · 5–12 July",
          },
          {
            year: "1950",
            channel: "MAGNETIC WIRE",
            title: "Avdo / Lord",
            count: "8,488 LINES",
            body: "The same singer returned to the same epic fifteen years later. The performance is shorter, still complete, and differently shaped.",
            credit: "Lord Text 35 · 23 May",
          },
          {
            year: "1974",
            channel: "EDITED BOOKS",
            title: "Lord / Bynum / HUP",
            count: "VOLUMES III + IV",
            body: "Translation, conversations, contextual essays, poetic lineation, and textual notes make an archival pathway readable in print.",
            credit: "Serbocroatian Heroic Songs",
          },
        ],
        takeaway:
          "Two performances can both be whole. Their differences are not errors to be corrected away.",
        boundary:
          "Counts describe the documented versions; they do not measure artistic worth or prove a single original wording.",
      },
      5: {
        eyebrow: "Return to the source",
        title: "Listen before you cite the page.",
        deck: "A publication can carry an epic farther. It cannot replace the named performer, the recording situation, or the archive that keeps the route back to sound.",
        voiceTitle: "KEEP THE VOICE ATTACHED",
        voiceBody:
          "Avdo Međedović is the performer and oral poet at the center of this case—not an anonymous source behind an editor’s book.",
        chainTitle: "TRACEABLE CHAIN",
        chain: [
          "Performer · Avdo Međedović",
          "1935 field record · Nikola Vujnović / Milman Parry project",
          "1950 recorder · Albert B. Lord",
          "1974 editors · Albert B. Lord / David E. Bynum",
          "Custodian · Milman Parry Collection of Oral Literature",
        ],
        rightsTitle: "ACCESS / RIGHTS BOUNDARY",
        rightsBody:
          "Online access is not blanket reuse permission. Item rights and other restrictions must be checked with Harvard or the relevant holder. No audio, transcript, or archive image is reproduced in this demo.",
        coda: "The paper closes. The route back to the voice stays open.",
      },
    },
    beats: {
      1: [
        {
          action: "Open on Avdo Međedović and the 1950 return performance",
          title: "A voice becomes a page",
          body: "Name the epic, performer, place, date, recorder, medium, and archive.",
        },
        {
          action: "Reveal the attribution chain",
          title: "Keep the performer attached",
          body: "The opener distinguishes a performance event from a final text.",
        },
      ],
      2: [
        {
          action: "Place the schematic listening trace",
          title: "Rhythm before lineation",
          body: "Show cadence and room texture without reproducing archive media.",
        },
        {
          action: "Reveal the transcript window",
          title: "Sound receives line breaks",
          body: "The transcript turns timing into visible editorial decisions.",
        },
        {
          action: "Reveal the marginal limits",
          title: "What the page can and cannot hold",
          body: "Separate searchability from the performance texture that print cannot retain.",
        },
      ],
      3: [
        {
          action: "Place the 1935 oral-dictated field record",
          title: "Voice to handwriting",
          body: "Credit Avdo Međedović and Nikola Vujnović in the archival chain.",
        },
        {
          action: "Overlay the schematic editorial layer",
          title: "Handwriting to edited text",
          body: "Show spelling, diacritics, lineation, and apparatus as choices.",
        },
        {
          action: "Overlay the 1974 publication layer",
          title: "Edited text to books",
          body: "Credit Albert B. Lord, David E. Bynum, and Harvard University Press.",
        },
      ],
      4: [
        {
          action: "Place the 1935 dictated version",
          title: "12,311 lines",
          body: "Treat the documented dictation as one complete telling.",
        },
        {
          action: "Add the 1950 wire-recorded version",
          title: "8,488 lines",
          body: "Show a shorter but complete return by the same performer.",
        },
        {
          action: "Add the 1974 edited publication",
          title: "Difference is not error",
          body: "Keep performance versions distinct from the edition that represents them.",
        },
      ],
      5: [
        {
          action: "Return to voice, attribution, archive, and rights",
          title: "Listen before you cite the page",
          body: "Close with a traceable chain and an explicit no-reproduction boundary.",
        },
      ],
    },
  },
  zh: {
    rootLabel: "口述到书面：《斯迈拉吉奇·梅霍的婚礼》的档案生命",
    chapters: ["人声", "声迹", "编页", "异本", "归声"],
    chapterSlugs: ["voice", "trace", "edit", "versions", "return"],
    indexOpen: "展开章节索引",
    indexClose: "收起章节索引",
    openChapter: (scene, label) => `打开第 ${scene} 章：${label}`,
    scenes: {
      1: {
        eyebrow: "一次有档案可查的重唱 · Lord Text 35",
        title: "当人声成为纸页",
        epic: "《斯迈拉吉奇·梅霍的婚礼》",
        deck: "1950 年 5 月 23 日，Avdo Međedović 再次讲唱十五年前已经留下另一形态的史诗。Albert B. Lord 用磁线记录了这次表演；纸页是在那之后才出现的。",
        date: "1950 年 5 月 23 日",
        place: "OBROV / BIJELO POLJE",
        returnLine: "档案保存的是一次表演事件，不是一份无作者的终极文本。",
        credits: [
          { label: "表演者", value: "Avdo Međedović" },
          { label: "记录者", value: "Albert B. Lord" },
          { label: "载体", value: "磁线录音" },
          { label: "馆藏", value: "Milman Parry Collection" },
        ],
      },
      2: {
        eyebrow: "聆听台 · 示意研究",
        title: "先听到节奏，再看到分行",
        deck: "录音把语调、呼吸、弓弦力度与现场声放在一起；转写却必须决定一行从哪里结束，下一行从哪里开始。",
        traceTitle: "听觉声迹 / 1950 磁线",
        traceLabels: ["呼吸", "弓弦", "人声", "现场"],
        traceBoundary: "节奏示意图——未复制任何档案音频。",
        transcriptTitle: "转写窗口",
        transcript: [
          { cue: "01", text: "人声先于纸面行首进入" },
          { cue: "02", text: "十音节格律得到一个换行" },
          { cue: "03", text: "重复在纸上变得可见" },
          { cue: "04", text: "停顿被压缩成编辑符号" },
        ],
        marginTitle: "纸页能保留 / 不能保留",
        margin: [
          "分行让长篇表演可检索、可比对。",
          "标点是在解释时间，并非机械复制声音。",
          "听众、房间与乐器质感超出印刷行的容量。",
        ],
        takeaway: "转写，是一种被做成可见形态的聆听判断。",
      },
      3: {
        eyebrow: "从田野笔记到两卷本",
        title: "每一张可读纸页，都带着编辑之手",
        deck: "1935 年的这部史诗经过口述听写、手写记录、分行、注释、原文卷与英译卷，才成为出版物。",
        layers: [
          {
            index: "I",
            label: "田野记录",
            title: "1935 年 7 月 5—12 日口述听写",
            body: "Avdo Međedović 口述史诗；Nikola Vujnović 为 Milman Parry 的项目写下文本。档案编号为 PN 6840。",
            meta: "人声 → 手写",
          },
          {
            index: "II",
            label: "编辑层 / 示意",
            title: "拼写 · 附加符号 · 分行 · 评注",
            body: "编辑者整理阅读路径、划分诗行并加入注释。这些标记让记录更清楚，也把选择暴露出来。",
            meta: "手写 → 编辑文本",
          },
          {
            index: "III",
            label: "出版 / 1974",
            title: "一部史诗，两本协作完成的书",
            body: "Albert B. Lord 整理英译与背景材料；David E. Bynum 整理原语言文本；Harvard University Press 出版第三、四卷。",
            meta: "编辑文本 → 出版版本",
          },
        ],
        boundary: "中间一层是说明图，不是 Bynum 编辑标记的摹本；精确惯例应查原版。",
      },
      4: {
        eyebrow: "并读 · 同一故事，再次生成",
        title: "差异是证据，不是错误",
        deck: "两次有记录的讲唱与后来的出版版本共享一个故事世界，却不能被压成一份主文本。",
        versions: [
          {
            year: "1935",
            channel: "口述听写",
            title: "Avdo / Vujnović",
            count: "12,311 行",
            body: "数日完成的一次完整讲唱。它的篇幅和措辞属于这次特定的听写行为。",
            credit: "PN 6840 · 7 月 5—12 日",
          },
          {
            year: "1950",
            channel: "磁线录音",
            title: "Avdo / Lord",
            count: "8,488 行",
            body: "同一位表演者十五年后重返同一史诗。篇幅更短，仍然完整，结构也重新成形。",
            credit: "Lord Text 35 · 5 月 23 日",
          },
          {
            year: "1974",
            channel: "编辑出版",
            title: "Lord / Bynum / HUP",
            count: "第三卷 + 第四卷",
            body: "翻译、访谈、背景论文、诗行与文本注释，让一条档案路径可以在纸上阅读。",
            credit: "Serbocroatian Heroic Songs",
          },
        ],
        takeaway: "两次表演都可以完整；差异不是必须删掉的错误。",
        boundary: "行数只描述档案中的两个版本，不衡量艺术价值，也不证明唯一原文。",
      },
      5: {
        eyebrow: "回到来源",
        title: "引用纸页之前，先听见人声。",
        deck: "出版物能让史诗走得更远，却不能替代有姓名的表演者、记录现场，以及保存回听路径的档案。",
        voiceTitle: "让声音与姓名保持相连",
        voiceBody: "这个个案的中心是表演者与口头诗人 Avdo Međedović，不是躲在编辑著作背后的匿名“素材”。",
        chainTitle: "可追溯链条",
        chain: [
          "表演者 · Avdo Međedović",
          "1935 田野记录 · Nikola Vujnović / Milman Parry 项目",
          "1950 记录者 · Albert B. Lord",
          "1974 编辑者 · Albert B. Lord / David E. Bynum",
          "保管机构 · Milman Parry Collection of Oral Literature",
        ],
        rightsTitle: "访问 / 权利边界",
        rightsBody: "线上可访问不等于一揽子复用许可。具体条目的权利和其他限制须向 Harvard 或相应权利人核对。本演示未复制音频、转写文本或档案图像。",
        coda: "纸页合上，回到人声的路径仍然敞开。",
      },
    },
    beats: {
      1: [
        {
          action: "以 Avdo Međedović 与 1950 年重唱开篇",
          title: "当人声成为纸页",
          body: "写明史诗、表演者、地点、日期、记录者、载体与档案。",
        },
        {
          action: "显露署名链",
          title: "让表演者保持相连",
          body: "开篇把一次表演事件与所谓终极文本区分开。",
        },
      ],
      2: [
        {
          action: "放置示意聆听声迹",
          title: "节奏先于分行",
          body: "不复制档案媒体，只呈现语调与现场质感的结构。",
        },
        {
          action: "显露转写窗口",
          title: "声音得到换行",
          body: "转写把时间变成可见的编辑判断。",
        },
        {
          action: "显露页边边界",
          title: "纸页能保留与不能保留",
          body: "把可检索性与印刷无法保留的表演质感分开。",
        },
      ],
      3: [
        {
          action: "放置 1935 年口述听写记录",
          title: "人声到手写",
          body: "在档案链中署名 Avdo Međedović 与 Nikola Vujnović。",
        },
        {
          action: "覆盖示意编辑层",
          title: "手写到编辑文本",
          body: "把拼写、附加符号、分行与评注呈现为选择。",
        },
        {
          action: "覆盖 1974 年出版层",
          title: "编辑文本到书",
          body: "署名 Albert B. Lord、David E. Bynum 与 Harvard University Press。",
        },
      ],
      4: [
        {
          action: "放置 1935 年听写版本",
          title: "12,311 行",
          body: "把档案听写作为一次完整讲唱对待。",
        },
        {
          action: "加入 1950 年磁线录音版本",
          title: "8,488 行",
          body: "同一表演者更短但完整的一次重返。",
        },
        {
          action: "加入 1974 年编辑出版",
          title: "差异不是错误",
          body: "把表演异本与代表它们的编辑版本分开。",
        },
      ],
      5: [
        {
          action: "回到人声、署名、档案与权利",
          title: "引用纸页之前，先听见人声",
          body: "以可追溯链和明确的不复制边界收束。",
        },
      ],
    },
  },
};

function clampScene(scene: number): SceneId {
  return Math.min(5, Math.max(1, Math.round(scene))) as SceneId;
}

function clampBeat(scene: SceneId, beat: number, language: Lang): number {
  const maxBeat = COPY[language].beats[scene].length - 1;
  return Math.min(maxBeat, Math.max(0, Math.round(beat)));
}

function Reveal({
  show,
  motionDisabled,
  className,
  children,
  dataLayer,
}: {
  show: boolean;
  motionDisabled: boolean;
  className?: string;
  children: ReactNode;
  dataLayer?: string;
}) {
  return (
    <div
      data-beat-layout-item="true"
      data-revealed={show ? "true" : "false"}
      data-layer={dataLayer}
      aria-hidden={show ? undefined : true}
      className={[
        styles.reveal,
        show ? styles.revealed : styles.concealed,
        motionDisabled ? styles.settled : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </div>
  );
}

function SourceRef({ children }: { children: ReactNode }) {
  return (
    <span data-source-ref="true" className={styles.sourceRef}>
      {children}
    </span>
  );
}

function Page({
  scene,
  language,
  composition,
  source,
  children,
}: {
  scene: SceneId;
  language: Lang;
  composition: string;
  source: ReactNode;
  children: ReactNode;
}) {
  const copy = COPY[language];
  return (
    <article
      className={styles.page}
      data-composition={composition}
      data-language={language}
    >
      <div aria-hidden="true" className={styles.pageFrame} />
      <header className={styles.pageHeader} data-beat-layout-item="true">
        <span className={styles.chapterName}>{copy.chapters[scene - 1]}</span>
        <span aria-hidden="true" className={styles.headerRule} />
        <SourceRef>{source}</SourceRef>
      </header>
      {children}
    </article>
  );
}

function SceneOne({
  beat,
  language,
  motionDisabled,
}: {
  beat: number;
  language: Lang;
  motionDisabled: boolean;
}) {
  const scene = COPY[language].scenes[1];
  return (
    <Page
      scene={1}
      language={language}
      composition="performance-opener"
      source="MPCOL · Lord Text 35"
    >
      <div className={styles.openerLayout}>
        <section className={styles.openerCopy} data-beat-layout-item="true">
          <p className={styles.eyebrow}>{scene.eyebrow}</p>
          <h1 className={styles.heroTitle}>{scene.title}</h1>
          <p className={styles.epicTitle}>{scene.epic}</p>
          <p className={styles.heroDeck}>{scene.deck}</p>
        </section>

        <aside className={styles.voiceColumn} data-beat-layout-item="true">
          <div aria-hidden="true" className={styles.voiceFigure}>
            <span className={styles.voiceDate}>{scene.date}</span>
            <span className={styles.voiceString} />
            <span className={styles.voicePlace}>{scene.place}</span>
          </div>
          <Reveal
            show={beat >= 1}
            motionDisabled={motionDisabled}
            className={styles.creditGrid}
          >
            {scene.credits.map((credit) => (
              <div className={styles.creditRow} key={credit.label}>
                <span>{credit.label}</span>
                <strong>{credit.value}</strong>
              </div>
            ))}
          </Reveal>
        </aside>
      </div>
      <Reveal
        show={beat >= 1}
        motionDisabled={motionDisabled}
        className={styles.openerPullQuote}
      >
        {scene.returnLine}
      </Reveal>
    </Page>
  );
}

function Waveform({ labels }: { labels: readonly string[] }) {
  return (
    <div className={styles.waveform} data-audio-kind="schematic">
      <div aria-hidden="true" className={styles.waveBars}>
        {WAVEFORM_HEIGHTS.map((height, index) => (
          <span
            key={`${height}-${index}`}
            data-waveform-bar="true"
            className={styles.waveBar}
            style={{ height: `${height}cqh` } as CSSProperties}
          />
        ))}
      </div>
      <div className={styles.waveLabels}>
        {labels.map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>
    </div>
  );
}

function SceneTwo({
  beat,
  language,
  motionDisabled,
}: {
  beat: number;
  language: Lang;
  motionDisabled: boolean;
}) {
  const scene = COPY[language].scenes[2];
  return (
    <Page
      scene={2}
      language={language}
      composition="waveform-transcript-spread"
      source="MPCOL 1950–51 · magnetic wire"
    >
      <section className={styles.sceneIntro} data-beat-layout-item="true">
        <p className={styles.eyebrow}>{scene.eyebrow}</p>
        <h2 className={styles.sectionTitle}>{scene.title}</h2>
        <p className={styles.sectionDeck}>{scene.deck}</p>
      </section>

      <div className={styles.listeningGrid}>
        <section className={styles.tracePanel} data-beat-layout-item="true">
          <div className={styles.panelHeading}>{scene.traceTitle}</div>
          <Waveform labels={scene.traceLabels} />
          <p className={styles.mediaBoundary}>{scene.traceBoundary}</p>
        </section>

        <Reveal
          show={beat >= 1}
          motionDisabled={motionDisabled}
          className={styles.transcriptPanel}
        >
          <div className={styles.panelHeading}>{scene.transcriptTitle}</div>
          <div className={styles.transcriptRows}>
            {scene.transcript.map((row) => (
              <div className={styles.transcriptRow} key={row.cue}>
                <span>{row.cue}</span>
                <p>{row.text}</p>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal
          show={beat >= 2}
          motionDisabled={motionDisabled}
          className={styles.listeningMargin}
        >
          <div className={styles.panelHeading}>{scene.marginTitle}</div>
          <ol>
            {scene.margin.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ol>
        </Reveal>
      </div>

      <Reveal
        show={beat >= 2}
        motionDisabled={motionDisabled}
        className={styles.listeningTakeaway}
      >
        {scene.takeaway}
      </Reveal>
    </Page>
  );
}

function SceneThree({
  beat,
  language,
  motionDisabled,
}: {
  beat: number;
  language: Lang;
  motionDisabled: boolean;
}) {
  const scene = COPY[language].scenes[3];
  return (
    <Page
      scene={3}
      language={language}
      composition="editorial-layer-stack"
      source="Foley 2005 · SCHS III–IV"
    >
      <div className={styles.layerLayout}>
        <section className={styles.layerIntro} data-beat-layout-item="true">
          <p className={styles.eyebrow}>{scene.eyebrow}</p>
          <h2 className={styles.sectionTitle}>{scene.title}</h2>
          <p className={styles.sectionDeck}>{scene.deck}</p>
          <p className={styles.layerBoundary}>{scene.boundary}</p>
        </section>

        <div className={styles.layerStack} data-beat-layout-item="true">
          {scene.layers.map((layer, index) => (
            <Reveal
              key={layer.index}
              show={beat >= index}
              motionDisabled={motionDisabled}
              className={`${styles.editorialLayer} ${styles[`editorialLayer${index + 1}`]}`}
              dataLayer={`editorial-${index + 1}`}
            >
              <div className={styles.layerTopline}>
                <span>{layer.index}</span>
                <strong>{layer.label}</strong>
              </div>
              <h3>{layer.title}</h3>
              <p>{layer.body}</p>
              <div className={styles.layerMeta}>{layer.meta}</div>
            </Reveal>
          ))}
          <div aria-hidden="true" className={styles.editMarks}>
            <span>¶</span>
            <span>⌁</span>
            <span>﹟</span>
          </div>
        </div>
      </div>
    </Page>
  );
}

function SceneFour({
  beat,
  language,
  motionDisabled,
}: {
  beat: number;
  language: Lang;
  motionDisabled: boolean;
}) {
  const scene = COPY[language].scenes[4];
  return (
    <Page
      scene={4}
      language={language}
      composition="parallel-versions"
      source="Lord · Foley · MPCOL"
    >
      <section className={styles.versionIntro} data-beat-layout-item="true">
        <p className={styles.eyebrow}>{scene.eyebrow}</p>
        <div>
          <h2 className={styles.sectionTitle}>{scene.title}</h2>
          <p className={styles.sectionDeck}>{scene.deck}</p>
        </div>
      </section>

      <div className={styles.versionGrid} data-beat-layout-item="true">
        {scene.versions.map((version, index) => (
          <Reveal
            key={version.year}
            show={beat >= index}
            motionDisabled={motionDisabled}
            className={styles.versionCard}
          >
            <article data-version-card="true">
              <div className={styles.versionTopline}>
                <strong>{version.year}</strong>
                <span>{version.channel}</span>
              </div>
              <h3>{version.title}</h3>
              <div className={styles.versionCount}>{version.count}</div>
              <p>{version.body}</p>
              <footer>{version.credit}</footer>
            </article>
          </Reveal>
        ))}
      </div>

      <Reveal
        show={beat >= 2}
        motionDisabled={motionDisabled}
        className={styles.versionTakeaway}
      >
        <strong>{scene.takeaway}</strong>
        <span>{scene.boundary}</span>
      </Reveal>
    </Page>
  );
}

function SceneFive({ language }: { language: Lang }) {
  const scene = COPY[language].scenes[5];
  return (
    <Page
      scene={5}
      language={language}
      composition="listening-close"
      source="Harvard Library · item rights apply"
    >
      <div className={styles.closeLayout}>
        <section className={styles.closeStatement} data-beat-layout-item="true">
          <p className={styles.eyebrow}>{scene.eyebrow}</p>
          <h2>{scene.title}</h2>
          <p>{scene.deck}</p>
          <div aria-hidden="true" className={styles.returnMark}>
            <span />
            <span />
            <span />
          </div>
        </section>

        <aside className={styles.closeNotes} data-beat-layout-item="true">
          <section>
            <h3>{scene.voiceTitle}</h3>
            <p>{scene.voiceBody}</p>
          </section>
          <section>
            <h3>{scene.chainTitle}</h3>
            <ol>
              {scene.chain.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ol>
          </section>
          <section className={styles.rightsBoundary}>
            <h3>{scene.rightsTitle}</h3>
            <p>{scene.rightsBody}</p>
          </section>
        </aside>
      </div>
      <p className={styles.coda} data-beat-layout-item="true">
        {scene.coda}
      </p>
    </Page>
  );
}

function FeatureScene({
  scene,
  beat,
  language,
  motionDisabled,
}: {
  scene: SceneId;
  beat: number;
  language: Lang;
  motionDisabled: boolean;
}) {
  if (scene === 1) {
    return (
      <SceneOne
        beat={beat}
        language={language}
        motionDisabled={motionDisabled}
      />
    );
  }
  if (scene === 2) {
    return (
      <SceneTwo
        beat={beat}
        language={language}
        motionDisabled={motionDisabled}
      />
    );
  }
  if (scene === 3) {
    return (
      <SceneThree
        beat={beat}
        language={language}
        motionDisabled={motionDisabled}
      />
    );
  }
  if (scene === 4) {
    return (
      <SceneFour
        beat={beat}
        language={language}
        motionDisabled={motionDisabled}
      />
    );
  }
  return <SceneFive language={language} />;
}

function ChapterIndex({
  scene,
  language,
  onNavigate,
}: {
  scene: SceneId;
  language: Lang;
  onNavigate?: (scene: number, beat: number) => void;
}) {
  const copy = COPY[language];
  const [expanded, setExpanded] = useState(false);
  const [near, setNear] = useState(false);
  const open = expanded || near;

  const navigate = useCallback(
    (target: SceneId) => {
      onNavigate?.(target, 0);
    },
    [onNavigate],
  );

  const handleKey = useCallback(
    (event: KeyboardEvent<HTMLButtonElement>, current: SceneId) => {
      let target: SceneId | null = null;
      if (event.key === "ArrowRight" || event.key === "ArrowDown") {
        target = Math.min(5, current + 1) as SceneId;
      } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
        target = Math.max(1, current - 1) as SceneId;
      } else if (event.key === "Home") {
        target = 1;
      } else if (event.key === "End") {
        target = 5;
      }
      if (target === null) return;
      event.preventDefault();
      event.stopPropagation();
      navigate(target);
    },
    [navigate],
  );

  return (
    <nav
      className={styles.chapterIndex}
      aria-label={language === "zh" ? "史诗成文章节索引" : "Oral to written chapter index"}
      data-topic-navigation="true"
      data-navigation-geometry="typographic-index"
      data-navigation-carrier="oral-written-chapter-labels"
      data-navigation-invocation="proximity-reveal"
      data-navigation-feedback="active-glow"
      data-open={open ? "true" : "false"}
      onPointerEnter={() => setNear(true)}
      onPointerLeave={() => setNear(false)}
      onFocus={() => setNear(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setNear(false);
      }}
      onClick={(event) => event.stopPropagation()}
      onPointerDown={(event) => event.stopPropagation()}
      onWheel={(event) => event.stopPropagation()}
      onKeyDown={(event) => event.stopPropagation()}
    >
      <button
        type="button"
        className={styles.indexToggle}
        aria-label={open ? copy.indexClose : copy.indexOpen}
        aria-expanded={open}
        onClick={(event) => {
          event.stopPropagation();
          setExpanded((current) => !current);
        }}
      >
        <span aria-hidden="true">§</span>
        <span className={styles.indexToggleText}>INDEX</span>
      </button>
      <div className={styles.chapterLabels}>
        {SCENE_IDS.map((target) => {
          const active = target === scene;
          const label = copy.chapters[target - 1];
          const slug = copy.chapterSlugs[target - 1];
          return (
            <button
              type="button"
              key={target}
              className={`${styles.chapterButton} ${active ? styles.chapterButtonActive : ""}`}
              aria-current={active ? "page" : undefined}
              aria-label={copy.openChapter(target, slug)}
              onPointerDown={(event) => event.stopPropagation()}
              onClick={(event) => {
                event.stopPropagation();
                navigate(target);
              }}
              onKeyDown={(event) => handleKey(event, target)}
            >
              <span className={styles.chapterRoman}>{["I", "II", "III", "IV", "V"][target - 1]}</span>
              <span className={styles.chapterLabel}>{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

export function getMetadata(language: Lang): StyleMetadata {
  const copy = COPY[language];
  return {
    id: "warm-editorial-feature",
    band: "editorial-print",
    name: language === "zh" ? "暖调长篇特写" : "Warm Editorial Feature",
    theme: language === "zh" ? "史诗成文" : "Oral to Written",
    densityLabel: language === "zh" ? "编辑阅读" : "Editorial reading",
    heroScene: 3,
    colors: {
      bg: "#f5eedf",
      ink: "#312922",
      panel: "#fbf6ea",
    },
    typography: {
      header:
        language === "zh" ? "Songti SC 600" : "Iowan Old Style 600",
      body: language === "zh" ? "PingFang SC 400" : "Avenir Next 400",
    },
    tags: [
      "editorial",
      "longform",
      "oral-history",
      "archive",
      "waveform-marginalia",
      "cream-paper",
      "reading-first",
      "quiet-motion",
    ],
    fonts: [
      "Iowan Old Style",
      "Avenir Next",
      "cjk:Songti SC",
      "cjk:PingFang SC",
    ],
    scenes: SCENE_IDS.map((scene) => ({
      id: scene,
      title: copy.chapters[scene - 1],
      beats: copy.beats[scene].map((beat, index) => ({
        id: index,
        action: beat.action,
        title: beat.title,
        body: beat.body,
      })),
    })),
  };
}

export default function OralToWritten({
  scene,
  beat,
  language,
  isThumbnail,
  reducedMotion,
  onNavigate,
}: BespokeStyleProps) {
  const activeScene = clampScene(scene);
  const activeBeat = clampBeat(activeScene, beat, language);
  const motionDisabled = reducedMotion || isThumbnail;

  return (
    <section
      className={`${styles.root} ${motionDisabled ? styles.motionOff : ""} ${isThumbnail ? styles.thumbnail : ""}`}
      aria-label={COPY[language].rootLabel}
      data-topic-id="oral-to-written"
      data-language={language}
      data-motion={motionDisabled ? "off" : "on"}
      data-thumbnail={isThumbnail ? "true" : "false"}
      data-frozen={motionDisabled ? "true" : "false"}
      data-archive-media-reproduced="false"
    >
      <SpatialSceneTrack
        scene={activeScene}
        beat={activeBeat}
        sceneIds={SCENE_IDS}
        transitionKind={INCOMING_TRANSITION_KIND[activeScene]}
        transitionMap={TRANSITION_MAP}
        transitionDurationMs={760}
        reducedMotion={motionDisabled}
        beatLayoutModes={BEAT_LAYOUT_MODES}
        renderScene={(sceneId, sceneBeat, isActive) => {
          const typedScene = clampScene(sceneId);
          const typedBeat = clampBeat(typedScene, sceneBeat, language);
          return (
            <FeatureScene
              scene={typedScene}
              beat={typedBeat}
              language={language}
              motionDisabled={motionDisabled || !isActive}
            />
          );
        }}
      />
      {!isThumbnail && (
        <ChapterIndex
          scene={activeScene}
          language={language}
          onNavigate={onNavigate}
        />
      )}
    </section>
  );
}

export const oralToWrittenTopic = defineStyleTopic({
  id: "oral-to-written",
  topic: {
    en: "Oral to Written",
    zh: "史诗成文",
  },
  model: "GPT 5.6 Sol",
  component: OralToWritten,
  getMetadata,
  navigation: {
    geometry: "typographic-index",
    carrier: "oral-written-chapter-labels",
    invocation: "proximity-reveal",
    feedback: "active-glow",
  },
  sources: ORAL_TO_WRITTEN_SOURCES,
  transitionScore: ORAL_TO_WRITTEN_TRANSITION_SCORE,
});

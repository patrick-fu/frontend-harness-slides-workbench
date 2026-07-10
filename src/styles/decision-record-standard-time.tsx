import { useRef, useState } from "react";
import type {
  KeyboardEvent as ReactKeyboardEvent,
  MouseEvent as ReactMouseEvent,
  PointerEvent as ReactPointerEvent,
  ReactNode,
  TouchEvent as ReactTouchEvent,
} from "react";
import type {
  BespokeStyleProps,
  StyleMetadata,
  TopicSource,
  TopicTransitionScore,
} from "../types";
import SpatialSceneTrack from "./SpatialSceneTrack";
import type { BeatLayoutMode, SceneTransitionMap } from "./SpatialSceneTrack";
import { defineStyleTopic } from "./topic";
import styles from "./decision-record-standard-time.module.css";

type Language = "en" | "zh";

const SCENE_IDS = [1, 2, 3, 4, 5] as const;
type SceneId = (typeof SCENE_IDS)[number];

const STANDARD_TIME_SOURCE_IDS = [
  "S1",
  "S2",
  "S3",
  "S4",
] as const;
type StandardTimeSourceId = (typeof STANDARD_TIME_SOURCE_IDS)[number];

const STANDARD_TIME_CLAIM_IDS = [
  "local-solar-time",
  "railway-time-friction",
  "greenwich-telegraph",
  "adoption-process",
  "legal-meaning",
  "public-clock-consequence",
] as const;
type StandardTimeClaimId = (typeof STANDARD_TIME_CLAIM_IDS)[number];

interface MetadataBeat {
  id: number;
  action: string;
  title: string;
  body: string;
}

interface SceneCopy {
  nav: string;
  clause: string;
  title: string;
  deck: string;
  deckClaim: StandardTimeClaimId;
  beats: MetadataBeat[];
}

export const standardTimeTransitionScore = {
  "1->2": "hard-cut",
  "2->3": "crossfade",
  "3->4": "page-turn",
  "4->5": "crossfade",
} satisfies TopicTransitionScore;

const TRANSITION_MAP: SceneTransitionMap = standardTimeTransitionScore;

const BEAT_LAYOUT_MODES = {
  1: "reserved",
  3: "reserved",
  4: "reserved",
} satisfies Partial<Record<SceneId, BeatLayoutMode>>;

export const standardTimeSceneClaims = {
  1: ["local-solar-time"],
  2: ["local-solar-time", "railway-time-friction"],
  3: ["greenwich-telegraph"],
  4: ["adoption-process", "greenwich-telegraph", "legal-meaning"],
  5: ["public-clock-consequence", "adoption-process"],
} as const satisfies Record<SceneId, readonly StandardTimeClaimId[]>;

export const standardTimeSources = [
  {
    id: "S1",
    authority: "Royal Museums Greenwich",
    title: "A time before Greenwich Mean Time",
    citation:
      "Royal Museums Greenwich. A time before Greenwich Mean Time. Accessed 2026-07-10.",
    accessDate: "2026-07-10",
    url:
      "https://www.rmg.co.uk/stories/time/time-greenwich-mean-time-confusing-case-travellers-watch",
    supports:
      "Explains that early nineteenth-century Britain used local mean time regulated by the Sun; local time varied east to west. It records mixed railway times, the Railway Clearing House recommendation in 1847, Greenwich electrical signals to Lewisham from 1852, telegraphic distribution through railways, and the later legal status of Greenwich time in 1880.",
    boundary:
      "This museum history supports a bounded account of British railway and public-time practice. It does not make one company, one inventor, or one statute the sole cause of every clock change, and it is not evidence for a single global timetable story.",
    claimIds: [
      "local-solar-time",
      "railway-time-friction",
      "greenwich-telegraph",
      "adoption-process",
      "public-clock-consequence",
    ],
  },
  {
    id: "S2",
    authority: "Science Museum Group",
    title: "Standardising time: Railways and the electric telegraph",
    citation:
      "Science Museum Group. Standardising time: Railways and the electric telegraph. Accessed 2026-07-10.",
    accessDate: "2026-07-10",
    url:
      "https://www.sciencemuseum.org.uk/objects-and-stories/standardising-time-railways-and-electric-telegraph",
    supports:
      "Publishes the 1841 Great Western Railway timetable note: London time was 11 minutes before Bath and Bristol time. It describes local solar time, the 1852 national telegraph distribution of Greenwich time, and reports that by 1855 nearly all public authorities set clocks to railway time.",
    boundary:
      "The 1841 timetable is a precisely cited Great Western example, not a measurement of every railway or a claim that all travellers experienced the same difficulty. The 1855 statement concerns public authorities such as churches and town halls, not an instant uniform reset of every private clock.",
    claimIds: [
      "local-solar-time",
      "railway-time-friction",
      "greenwich-telegraph",
      "adoption-process",
      "public-clock-consequence",
    ],
  },
  {
    id: "S3",
    authority: "UK Government / legislation.gov.uk",
    title: "Statutes (Definition of Time) Act, 1880 (43 & 44 Vict. c. 9)",
    citation:
      "Statutes (Definition of Time) Act, 1880, 43 & 44 Vict. c. 9, 2 August 1880. Official historical PDF via legislation.gov.uk.",
    accessDate: "2026-07-10",
    url:
      "https://www.legislation.gov.uk/ukpga/Vict/43-44/9/pdfs/ukpga_18800009_en.pdf",
    supports:
      "The Act states that, unless specifically stated otherwise, expressions of time in Acts of Parliament, deeds, and other legal instruments mean Greenwich mean time in Great Britain; it is dated 2 August 1880.",
    boundary:
      "The statutory text governs the interpretation of time expressions in named legal instruments. It does not say that every physical clock changed on that date, so the Topic treats it as one legal record within a staged adoption process.",
    claimIds: ["adoption-process", "legal-meaning"],
  },
  {
    id: "S4",
    authority: "Royal Museums Greenwich",
    title: "History of Royal Observatory Greenwich | Home of GMT",
    citation:
      "Royal Museums Greenwich. History of Royal Observatory Greenwich | Home of GMT. Accessed 2026-07-10.",
    accessDate: "2026-07-10",
    url:
      "https://www.rmg.co.uk/stories/space-astronomy/history-royal-observatory?page=1",
    supports:
      "States that by the 1840s most railway companies had adopted Greenwich Mean Time, and that a new electrical clock system at the Observatory transmitted signals by telegraph in 1852. It places the British legal standard in 1880 and distinguishes the 1884 International Meridian Conference as a subsequent international development.",
    boundary:
      "This history supports a chronology of British adoption and a careful separation from later international arrangements. It does not justify presenting British railway time as a one-step creation of all modern time zones.",
    claimIds: [
      "greenwich-telegraph",
      "adoption-process",
      "public-clock-consequence",
    ],
  },
] as const satisfies readonly (TopicSource & {
  id: StandardTimeSourceId;
  authority: string;
  title: string;
  citation: string;
  accessDate: string;
  boundary: string;
  claimIds: readonly StandardTimeClaimId[];
})[];

export const standardTimeClaims = [
  {
    id: "local-solar-time",
    sceneIds: [1, 2] as const,
    sourceIds: ["S1", "S2"] as const,
    claim:
      "Nineteenth-century British local mean time followed the Sun and varied from east to west; an 1841 Great Western Railway timetable said London time was 11 minutes before Bath and Bristol time.",
    boundary:
      "The two-clock comparison is a documented timetable example. It describes a local-time difference, not a universal rule for every town, passenger, railway, or clock.",
  },
  {
    id: "railway-time-friction",
    sceneIds: [2] as const,
    sourceIds: ["S1", "S2"] as const,
    claim:
      "Fast railway connections made local-time differences operationally relevant, while some early railways and stations still used different time references.",
    boundary:
      "The report shows an administrative coordination problem without claiming that all railway travel was chaotic or that one timetable alone explains standard time.",
  },
  {
    id: "greenwich-telegraph",
    sceneIds: [3, 4] as const,
    sourceIds: ["S1", "S2", "S4"] as const,
    claim:
      "In 1852, a Royal Observatory electrical clock system sent Greenwich time by telegraph, making a shared station-time network practical.",
    boundary:
      "The network diagram is a schematic of the documented signal path. It does not map every wire, station, clock, operator, or local implementation.",
  },
  {
    id: "adoption-process",
    sceneIds: [4, 5] as const,
    sourceIds: ["S1", "S2", "S3", "S4"] as const,
    claim:
      "British adoption was staged: railway practice changed in the 1840s, the Railway Clearing House recommended Greenwich time in 1847, telegraphic distribution followed in 1852, and legal interpretation was recorded in 1880.",
    boundary:
      "The sequence is deliberately not a single-law or single-hero story. Adoption varied by institution and the legal record is one part of the process.",
  },
  {
    id: "legal-meaning",
    sceneIds: [4] as const,
    sourceIds: ["S3"] as const,
    claim:
      "The Statutes (Definition of Time) Act, dated 2 August 1880, defined unstated time expressions in Acts, deeds, and other legal instruments as Greenwich mean time in Great Britain.",
    boundary:
      "This is a legal-interpretation claim drawn from the statute's scope. It is not phrased as an order that every public or private clock immediately displayed Greenwich time.",
  },
  {
    id: "public-clock-consequence",
    sceneIds: [5] as const,
    sourceIds: ["S1", "S2", "S4"] as const,
    claim:
      "Railway and public-clock practice increasingly used Greenwich time, improving coordination while making local solar time less central to public timetable life.",
    boundary:
      "The consequence note keeps local time, institutional variation, and later international time-zone arrangements distinct; it does not collapse them into a global inevitability.",
  },
] as const satisfies readonly {
  id: StandardTimeClaimId;
  sceneIds: readonly SceneId[];
  sourceIds: readonly StandardTimeSourceId[];
  claim: string;
  boundary: string;
}[];

const SOURCE_STAMPS: Record<StandardTimeSourceId, string> = {
  S1: "S1 · Royal Museums Greenwich / local time & railways",
  S2: "S2 · Science Museum / GWR timetable & telegraph",
  S3: "S3 · legislation.gov.uk / 1880 Act",
  S4: "S4 · Royal Museums Greenwich / Observatory history",
};

const COPY: Record<Language, Record<SceneId, SceneCopy>> = {
  en: {
    1: {
      nav: "Local noon",
      clause: "CLAUSE 01 / LOCAL REFERENCE",
      title: "Noon was once a local reading.",
      deck:
        "An 1841 Great Western timetable printed the difference rather than pretending it did not exist.",
      deckClaim: "local-solar-time",
      beats: [
        {
          id: 0,
          action: "Place the paired clock faces.",
          title: "Two noon readings",
          body: "Start with the two public readings before asking for one standard.",
        },
        {
          id: 1,
          action: "Name the local solar references.",
          title: "The Sun set each locality's reference.",
          body: "East-west location changed the local mean-time reading.",
        },
        {
          id: 2,
          action: "Expose the timetable difference.",
          title: "Eleven minutes matter at a departure board.",
          body: "The documented GWR note distinguishes London from Bath and Bristol.",
        },
        {
          id: 3,
          action: "State the evidence boundary.",
          title: "A cited route example, not a universal table.",
          body: "The comparison is one printed timetable record.",
        },
      ],
    },
    2: {
      nav: "Connection",
      clause: "CLAUSE 02 / CONNECTION PROBLEM",
      title: "One timetable could still meet several local clocks.",
      deck:
        "The issue was coordination at connections—not a claim that every railway journey was confused.",
      deckClaim: "railway-time-friction",
      beats: [
        {
          id: 0,
          action: "Hold a single documented timetable record.",
          title: "A conversion burden",
          body: "The visible annotations are from one 1841 GWR timetable.",
        },
      ],
    },
    3: {
      nav: "Signal",
      clause: "CLAUSE 03 / SYNCHRONIZATION PATH",
      title: "A standard needs a way to travel.",
      deck:
        "In 1852, Royal Observatory time could move by telegraph from Greenwich into the railway network.",
      deckClaim: "greenwich-telegraph",
      beats: [
        {
          id: 0,
          action: "Draw the Observatory-to-railway path.",
          title: "Reference becomes signal",
          body: "A clock standard becomes usable only when a network carries it.",
        },
        {
          id: 1,
          action: "Correct the station clocks once.",
          title: "One correction, then a settled reading",
          body: "The diagram marks a discrete synchronization, never a looping pulse.",
        },
      ],
    },
    4: {
      nav: "Adoption",
      clause: "CLAUSE 04 / ADOPTION RECORD",
      title: "The record is a sequence, not a switch.",
      deck:
        "Railway practice, a recommendation, telegraphic distribution, and a legal definition occupy different lines in the file.",
      deckClaim: "adoption-process",
      beats: [
        {
          id: 0,
          action: "Enter railway practice and the 1847 recommendation.",
          title: "Institutions move first",
          body: "The ledger begins with railways, not a decree.",
        },
        {
          id: 1,
          action: "Add telegraph distribution and the legal record.",
          title: "Infrastructure and law add separate force",
          body: "The 1880 Act defines legal time expressions; it is not a one-day clock reset.",
        },
      ],
    },
    5: {
      nav: "Consequence",
      clause: "CLAUSE 05 / CONSEQUENCE NOTE",
      title: "Coordination gained a common reference—and changed what public time meant.",
      deck:
        "This closes a British nineteenth-century record without turning it into a global time-zone origin myth.",
      deckClaim: "public-clock-consequence",
      beats: [
        {
          id: 0,
          action: "State coordination, displacement, and scope together.",
          title: "A shared reference with a historical cost",
          body: "Railway time coordinated institutions while local solar time lost its public timetable role.",
        },
      ],
    },
  },
  zh: {
    1: {
      nav: "本地正午",
      clause: "条款 01 / 本地参照",
      title: "正午曾是本地读数。",
      deck: "1841 年大西部铁路时刻表把时间差印了出来，而没有假装它不存在。",
      deckClaim: "local-solar-time",
      beats: [
        {
          id: 0,
          action: "放置一对钟面。",
          title: "两个正午读数",
          body: "在讨论统一标准前，先看两种公共读数。",
        },
        {
          id: 1,
          action: "标出地方太阳时参照。",
          title: "太阳为各地设定参照。",
          body: "东西位置会改变地方平时读数。",
        },
        {
          id: 2,
          action: "显出时刻表时间差。",
          title: "十一分钟会影响发车牌。",
          body: "有据可查的 GWR 注记区分了伦敦与巴斯、布里斯托尔。",
        },
        {
          id: 3,
          action: "标明证据边界。",
          title: "一条例证，不是全国总表。",
          body: "此比较来自一份已印出的时刻表记录。",
        },
      ],
    },
    2: {
      nav: "接续",
      clause: "条款 02 / 接续问题",
      title: "一张时刻表仍可能遇上多只地方钟。",
      deck: "问题在于接续协调，并不等于每一次铁路旅行都一片混乱。",
      deckClaim: "railway-time-friction",
      beats: [
        {
          id: 0,
          action: "固定展示一份有据时刻表。",
          title: "换算负担",
          body: "画面中的注记来自 1841 年一份 GWR 时刻表。",
        },
      ],
    },
    3: {
      nav: "授时",
      clause: "条款 03 / 同步路径",
      title: "标准还需要一条传播路径。",
      deck: "1852 年，皇家天文台的时间可经电报从格林尼治进入铁路网络。",
      deckClaim: "greenwich-telegraph",
      beats: [
        {
          id: 0,
          action: "画出天文台到铁路的路径。",
          title: "参照变成信号",
          body: "标准时钟只有经网络传递，才能变得可用。",
        },
        {
          id: 1,
          action: "只校正一次车站钟。",
          title: "一次校正，然后稳定读数",
          body: "图中只标记一次同步，不做循环脉冲。",
        },
      ],
    },
    4: {
      nav: "采用",
      clause: "条款 04 / 采用记录",
      title: "这是一串记录，不是一道开关。",
      deck: "铁路实践、推荐、电报分发与法律定义在档案里各占一行。",
      deckClaim: "adoption-process",
      beats: [
        {
          id: 0,
          action: "录入铁路实践与 1847 年推荐。",
          title: "机构先行动",
          body: "这份记录从铁路开始，而不是从一道法令开始。",
        },
        {
          id: 1,
          action: "补入电报与法律记录。",
          title: "基础设施与法律分别增加作用力",
          body: "1880 年法案定义法律时间表述，不是一日内重置所有钟表。",
        },
      ],
    },
    5: {
      nav: "后果",
      clause: "条款 05 / 后果说明",
      title: "协调获得共同参照，也改变了公共时间的含义。",
      deck: "这份记录止于 19 世纪英国，不把它写成全球时区的起源神话。",
      deckClaim: "public-clock-consequence",
      beats: [
        {
          id: 0,
          action: "同时写下协调、取代与范围。",
          title: "共同参照也有历史代价",
          body: "铁路时间协调机构；地方太阳时失去公共时刻表的中心位置。",
        },
      ],
    },
  },
};

const UI = {
  en: {
    sources: "Sources",
    scope: "TIME STANDARD / GREAT BRITAIN",
    ribbon: [
      "HISTORICAL DECISION RECORD",
      "STANDARD TIME / 19TH-CENTURY GREAT BRITAIN",
      "DOCUMENT · CLOCK · NETWORK · LAW",
    ],
    clock: {
      london: "LONDON / RAILWAY TIME",
      bathBristol: "BATH + BRISTOL / LOCAL TIME",
      localMean: "LOCAL MEAN TIME",
      minutes: "11 MIN",
      routeBoundary: "route example · not a national table",
      ruling:
        "At the same railway reading, the printed 1841 note placed Bath and Bristol eleven minutes behind London time.",
    },
    conflict: {
      railway: "GREAT WESTERN RAILWAY",
      note: "TIMETABLE NOTE / 1841",
      passenger: "LOCAL-TIME DIFFERENCES PRINTED FOR PASSENGERS",
      headers: ["Station", "Difference", "Reading relation"],
      rows: [
        ["Reading", "4 min", "London time before local time"],
        ["Steventon", "5½ min", "London time before local time"],
        ["Chippenham", "8 min", "London time before local time"],
        ["Bath + Bristol", "11 min", "London time before local time"],
        ["Bridgewater", "14 min", "London time before local time"],
      ],
      marginLabel: "READING RULE",
      marginTitle: "One published departure time still needed local interpretation.",
      marginBody:
        "This document reports a coordination burden at an expanding railway network; it does not claim universal disorder.",
    },
    network: {
      observatory: "ROYAL OBSERVATORY",
      greenwich: "GREENWICH",
      reference: "reference clock",
      telegraph: "TELEGRAPH",
      signal: "signal path",
      stations: "RAILWAY STATIONS",
      aligned: "12:00 / ALIGNED",
      waiting: "CLOCKS / WAITING",
      correction: "one marked correction",
      endpoint: "network endpoint",
      publicClock: "public clock",
      stationClock: "station clock",
      caption:
        "The observable change is one 1852 signal path and one settled station correction—not a perpetual pulse.",
    },
    adoption: {
      legalScope: "LEGAL SCOPE",
      legalNote:
        "The 1880 line concerns time expressions in Acts, deeds, and other legal instruments. It is not a story of every clock changing on one morning.",
      records: [
        {
          date: "1840s",
          source: "S4",
          claim: "adoption-process" as const,
          title: "Railway companies adopt Greenwich Mean Time",
          text: "Royal Museums Greenwich describes most railway companies using GMT by the 1840s.",
        },
        {
          date: "1847",
          source: "S1",
          claim: "adoption-process" as const,
          title: "Railway Clearing House recommendation",
          text: "The Railway Clearing House recommended Greenwich time for all railway stations.",
        },
        {
          date: "1852",
          source: "S1 · S2",
          claim: "greenwich-telegraph" as const,
          title: "Electrical time moves by telegraph",
          text: "The Observatory system sent a signal to Lewisham and onward through railway networks.",
        },
        {
          date: "2 AUG 1880",
          source: "S3",
          claim: "legal-meaning" as const,
          title: "Legal interpretation is recorded",
          text: "The Act defines unstated times in specified legal instruments as Greenwich mean time in Great Britain.",
        },
      ],
    },
    consequence: {
      coordination: "COORDINATION",
      coordinationText:
        "A common railway and public-clock reference made timetables easier to coordinate across places.",
      displacement: "DISPLACEMENT",
      displacementText:
        "Local solar time did not become false; it became less central to public timetable life as GMT spread through institutions.",
      boundary: "RECORD BOUNDARY",
      boundaryText:
        "This is a nineteenth-century Great Britain record. It does not assign standard time to one hero, one law, or a ready-made global time-zone system.",
      finding: "Finding",
      findingText:
        "Standard time emerged through documents, railways, telegraphy, public clocks, and law—at different speeds.",
    },
  },
  zh: {
    sources: "来源",
    scope: "标准时 / 英国",
    ribbon: [
      "历史决策记录",
      "标准时 / 19 世纪英国",
      "文书 · 钟表 · 网络 · 法律",
    ],
    clock: {
      london: "伦敦 / 铁路时间",
      bathBristol: "巴斯＋布里斯托尔 / 地方时间",
      localMean: "地方平时",
      minutes: "11 分钟",
      routeBoundary: "线路例证 · 不是全国总表",
      ruling:
        "在同一铁路读数下，1841 年印出的注记把巴斯和布里斯托尔置于伦敦时间之后十一分钟。",
    },
    conflict: {
      railway: "大西部铁路",
      note: "时刻表注记 / 1841",
      passenger: "为乘客印出的地方时间差",
      headers: ["车站", "时间差", "读数关系"],
      rows: [
        ["Reading / 雷丁", "4 分钟", "伦敦时间早于地方时间"],
        ["Steventon / 斯泰文顿", "5½ 分钟", "伦敦时间早于地方时间"],
        ["Chippenham / 奇彭纳姆", "8 分钟", "伦敦时间早于地方时间"],
        ["Bath + Bristol / 巴斯＋布里斯托尔", "11 分钟", "伦敦时间早于地方时间"],
        ["Bridgewater / 布里奇沃特", "14 分钟", "伦敦时间早于地方时间"],
      ],
      marginLabel: "读表规则",
      marginTitle: "一个印出的发车时刻，仍需要按本地时间理解。",
      marginBody:
        "这份文件记录的是扩张中的铁路网络的协调负担，并不宣称全国交通都陷入混乱。",
    },
    network: {
      observatory: "皇家天文台",
      greenwich: "格林尼治",
      reference: "参照钟",
      telegraph: "电报",
      signal: "信号路径",
      stations: "铁路车站",
      aligned: "12:00 / 已对齐",
      waiting: "车站钟 / 待校正",
      correction: "一次标记校正",
      endpoint: "网络终点",
      publicClock: "公共钟",
      stationClock: "车站钟",
      caption:
        "可见的变化是一条 1852 年信号路径与一次稳定的车站校正，不是持续循环的脉冲。",
    },
    adoption: {
      legalScope: "法律范围",
      legalNote:
        "1880 年这一行涉及法案、契据和其他法律文书中的时间表述，不是所有钟表在同一早晨一起改变的故事。",
      records: [
        {
          date: "1840 年代",
          source: "S4",
          claim: "adoption-process" as const,
          title: "铁路公司采用格林尼治平时",
          text: "皇家博物馆格林尼治记载：到 1840 年代，多数铁路公司已使用 GMT。",
        },
        {
          date: "1847",
          source: "S1",
          claim: "adoption-process" as const,
          title: "铁路清算所提出建议",
          text: "铁路清算所建议所有铁路车站采用格林尼治时间。",
        },
        {
          date: "1852",
          source: "S1 · S2",
          claim: "greenwich-telegraph" as const,
          title: "电报传递时间",
          text: "天文台系统向 Lewisham 发出信号，并经铁路网络继续分发。",
        },
        {
          date: "1880 年 8 月 2 日",
          source: "S3",
          claim: "legal-meaning" as const,
          title: "法律解释被写入记录",
          text: "该法案把英国指定法律文书中未另行说明的时间定义为格林尼治平时。",
        },
      ],
    },
    consequence: {
      coordination: "协调",
      coordinationText:
        "铁路和公共钟拥有共同参照后，跨地点协调时刻表变得更容易。",
      displacement: "取代",
      displacementText:
        "地方太阳时没有变错；随着 GMT 进入机构，它在公共时刻表生活中变得不再居中。",
      boundary: "记录边界",
      boundaryText:
        "这是一份 19 世纪英国记录：它不把标准时归给单一英雄、单一道法令或现成的全球时区体系。",
      finding: "结论",
      findingText:
        "标准时由文书、铁路、电报、公共钟与法律在不同速度下共同形成。",
    },
  },
} as const;

function clampScene(scene: number): SceneId {
  if (scene < 1 || scene > 5) {
    return 1;
  }
  return scene as SceneId;
}

function clampBeat(scene: SceneId, beat: number): number {
  const count = COPY.en[scene].beats.length;
  return Math.max(0, Math.min(beat, count - 1));
}

function visibleAt(beat: number, threshold: number): "true" | "false" {
  return beat >= threshold ? "true" : "false";
}

function getStandardTimeClaim(claimId: StandardTimeClaimId) {
  const claim = standardTimeClaims.find((candidate) => candidate.id === claimId);
  if (!claim) {
    throw new Error("Missing Standard Time claim " + claimId);
  }
  return claim;
}

function getStandardTimeSource(sourceId: StandardTimeSourceId) {
  const source = standardTimeSources.find((candidate) => candidate.id === sourceId);
  if (!source) {
    throw new Error("Missing Standard Time source " + sourceId);
  }
  return source;
}

function getSceneSourceIds(sceneId: SceneId): StandardTimeSourceId[] {
  const sourceIds = new Set<StandardTimeSourceId>();
  for (const claimId of standardTimeSceneClaims[sceneId]) {
    for (const sourceId of getStandardTimeClaim(claimId).sourceIds) {
      sourceIds.add(sourceId);
    }
  }
  return Array.from(sourceIds);
}

function Claim({
  id,
  children,
  className,
}: {
  id: StandardTimeClaimId;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span className={className} data-claim-id={id}>
      {children}
    </span>
  );
}

function SourceStamp({
  sceneId,
  language,
}: {
  sceneId: SceneId;
  language: Language;
}) {
  const claimIds = standardTimeSceneClaims[sceneId];
  const sourceIds = getSceneSourceIds(sceneId);
  const claimSourceLinks = claimIds
    .map(
      (claimId) =>
        claimId + ":" + getStandardTimeClaim(claimId).sourceIds.join(","),
    )
    .join(";");

  return (
    <aside
      className={styles.sourceStamp}
      data-source-stamp="true"
      data-claim-source-map="true"
      data-scene-id={sceneId}
      data-claim-ids={claimIds.join(" ")}
      data-source-ids={sourceIds.join(" ")}
      data-claim-source-links={claimSourceLinks}
      aria-label={language === "zh" ? "本场事实来源" : "Sources for this scene"}
    >
      <span>{UI[language].sources}</span>
      <span className={styles.sourceLinks}>
        {sourceIds.map((sourceId) => {
          const source = getStandardTimeSource(sourceId);
          return (
            <a
              key={sourceId}
              data-source-id={sourceId}
              href={source.url}
              target="_blank"
              rel="noreferrer"
              aria-label={sourceId + ": " + source.title}
              onPointerDown={(event) => event.stopPropagation()}
              onTouchStart={(event) => event.stopPropagation()}
              onClick={(event) => event.stopPropagation()}
            >
              {SOURCE_STAMPS[sourceId]}
            </a>
          );
        })}
      </span>
    </aside>
  );
}

function SceneHeading({
  copy,
  sceneId,
  language,
}: {
  copy: SceneCopy;
  sceneId: SceneId;
  language: Language;
}) {
  return (
    <header className={styles.sceneHeading} data-beat-layout-item="true">
      <div className={styles.clauseLine}>
        <span>{copy.clause}</span>
        <span>{UI[language].scope}</span>
      </div>
      <h1>{copy.title}</h1>
      <p className={styles.sceneDeck}>
        <Claim id={copy.deckClaim}>{copy.deck}</Claim>
      </p>
      <SourceStamp sceneId={sceneId} language={language} />
    </header>
  );
}

function ClockFace({
  label,
  reading,
  minuteRotation,
  claimId,
  active,
}: {
  label: string;
  reading: string;
  minuteRotation: number;
  claimId: StandardTimeClaimId;
  active: boolean;
}) {
  return (
    <section
      className={styles.clockCase}
      data-claim-id={claimId}
      data-clock-active={active ? "true" : "false"}
      data-beat-layout-item="true"
    >
      <p>{label}</p>
      <svg className={styles.clockFace} viewBox="0 0 400 400" aria-hidden="true">
        <circle className={styles.clockRing} cx="200" cy="200" r="166" />
        <circle className={styles.clockInnerRing} cx="200" cy="200" r="132" />
        <path className={styles.clockTick} d="M200 42V72" />
        <path className={styles.clockTick} d="M358 200H328" />
        <path className={styles.clockTick} d="M200 358V328" />
        <path className={styles.clockTick} d="M42 200H72" />
        <text className={styles.clockNumber} x="200" y="102">
          12
        </text>
        <text className={styles.clockNumber} x="300" y="208">
          3
        </text>
        <text className={styles.clockNumber} x="195" y="316">
          6
        </text>
        <text className={styles.clockNumber} x="93" y="208">
          9
        </text>
        <g className={styles.clockHands}>
          <path className={styles.hourHand} d="M200 200V134" />
          <path
            className={styles.minuteHand}
            d="M200 200V88"
            transform={"rotate(" + minuteRotation + " 200 200)"}
          />
          <circle className={styles.clockPin} cx="200" cy="200" r="10" />
        </g>
      </svg>
      <strong>{reading}</strong>
    </section>
  );
}

function LocalClockPair({
  copy,
  beat,
  language,
}: {
  copy: SceneCopy;
  beat: number;
  language: Language;
}) {
  const ui = UI[language];

  return (
    <article
      className={[styles.scene, styles.localClockScene].join(" ")}
      data-composition="local-clock-pair"
      data-claim-ids={standardTimeSceneClaims[1].join(" ")}
      data-visible-claim-ids={standardTimeSceneClaims[1].join(" ")}
      data-reading-state="settled"
      data-beat-layout-container="true"
      data-beat-layout-mode="reserved"
    >
      <SceneHeading copy={copy} sceneId={1} language={language} />
      <div className={styles.clockPair} data-beat-layout-item="true">
        <ClockFace
          label={ui.clock.london}
          reading="12:00"
          minuteRotation={0}
          claimId="local-solar-time"
          active
        />
        <div
          className={styles.timeGap}
          data-beat-layout-item="true"
          data-claim-id="local-solar-time"
        >
          <span
            className={styles.localCue}
            data-reveal={visibleAt(beat, 1)}
          >
            {ui.clock.localMean}
          </span>
          <strong data-reveal={visibleAt(beat, 2)}>{ui.clock.minutes}</strong>
          <p data-reveal={visibleAt(beat, 2)}>GWR / 1841</p>
          <span
            className={styles.exampleBoundary}
            data-reveal={visibleAt(beat, 3)}
          >
            {ui.clock.routeBoundary}
          </span>
        </div>
        <ClockFace
          label={ui.clock.bathBristol}
          reading="11:49"
          minuteRotation={-66}
          claimId="local-solar-time"
          active={beat >= 1}
        />
      </div>
      <div className={styles.clockRuling} data-beat-layout-item="true">
        <Claim id="local-solar-time">{ui.clock.ruling}</Claim>
      </div>
    </article>
  );
}

function ConflictTable({
  copy,
  language,
}: {
  copy: SceneCopy;
  language: Language;
}) {
  const ui = UI[language];

  return (
    <article
      className={[styles.scene, styles.conflictScene].join(" ")}
      data-composition="conflict-table"
      data-claim-ids={standardTimeSceneClaims[2].join(" ")}
      data-visible-claim-ids={standardTimeSceneClaims[2].join(" ")}
      data-reading-state="settled"
    >
      <SceneHeading copy={copy} sceneId={2} language={language} />
      <div className={styles.timetableFrame} data-beat-layout-item="true">
        <div
          className={styles.timetableMasthead}
          data-claim-id="local-solar-time"
        >
          <span>{ui.conflict.railway}</span>
          <strong>
            <Claim id="local-solar-time">{ui.conflict.note}</Claim>
          </strong>
          <span>{ui.conflict.passenger}</span>
        </div>
        <table className={styles.timetable}>
          <thead>
            <tr>
              {ui.conflict.headers.map((header) => (
                <th key={header}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody data-claim-id="local-solar-time">
            {ui.conflict.rows.map(([station, difference, relation]) => (
              <tr key={station}>
                <td>{station}</td>
                <td>{difference}</td>
                <td>{relation}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <aside
        className={styles.connectionMargin}
        data-claim-id="railway-time-friction"
        data-beat-layout-item="true"
      >
        <span>{ui.conflict.marginLabel}</span>
        <strong>{ui.conflict.marginTitle}</strong>
        <p>{ui.conflict.marginBody}</p>
      </aside>
    </article>
  );
}

function SynchronizationNetwork({
  copy,
  beat,
  language,
}: {
  copy: SceneCopy;
  beat: number;
  language: Language;
}) {
  const corrected = beat >= 1;
  const ui = UI[language];

  return (
    <article
      className={[styles.scene, styles.networkScene].join(" ")}
      data-composition="synchronization-network"
      data-claim-ids={standardTimeSceneClaims[3].join(" ")}
      data-visible-claim-ids={standardTimeSceneClaims[3].join(" ")}
      data-reading-state="settled"
      data-beat-layout-container="true"
      data-beat-layout-mode="reserved"
    >
      <SceneHeading copy={copy} sceneId={3} language={language} />
      <div
        className={styles.networkDiagram}
        data-beat-layout-item="true"
        data-synchronised={corrected ? "true" : "false"}
        data-claim-id="greenwich-telegraph"
      >
        <svg viewBox="0 0 1500 540" aria-hidden="true">
          <path className={styles.networkWire} d="M300 278H725" />
          <path className={styles.networkWire} d="M770 278H1195" />
          <path className={styles.networkWire} d="M770 278L1100 110" />
          <path className={styles.networkWire} d="M770 278L1100 446" />
          <circle className={styles.networkNode} cx="250" cy="278" r="118" />
          <circle className={styles.networkRelay} cx="748" cy="278" r="48" />
          <circle className={styles.networkStation} cx="1245" cy="278" r="86" />
          <circle className={styles.networkStation} cx="1150" cy="100" r="62" />
          <circle className={styles.networkStation} cx="1150" cy="456" r="62" />
          <path className={styles.networkArrow} d="M660 258L700 278L660 298" />
          <path className={styles.networkArrow} d="M1132 258L1172 278L1132 298" />
        </svg>
        <div className={styles.networkLabel} data-claim-id="greenwich-telegraph">
          <span>{ui.network.observatory}</span>
          <strong>{ui.network.greenwich}</strong>
          <p>{ui.network.reference}</p>
        </div>
        <div className={styles.relayLabel} data-claim-id="greenwich-telegraph">
          <span>1852</span>
          <strong>{ui.network.telegraph}</strong>
          <p>{ui.network.signal}</p>
        </div>
        <div
          className={styles.stationLabel}
          data-claim-id="greenwich-telegraph"
          data-clock-corrected={corrected ? "true" : "false"}
        >
          <span>{ui.network.stations}</span>
          <strong>{corrected ? ui.network.aligned : ui.network.waiting}</strong>
          <p>{corrected ? ui.network.correction : ui.network.endpoint}</p>
        </div>
        <div className={styles.branchLabelTop} aria-hidden="true">
          {ui.network.publicClock}
        </div>
        <div className={styles.branchLabelBottom} aria-hidden="true">
          {ui.network.stationClock}
        </div>
      </div>
      <p className={styles.networkCaption} data-beat-layout-item="true">
        <Claim id="greenwich-telegraph">{ui.network.caption}</Claim>
      </p>
    </article>
  );
}

function AdoptionRecord({
  copy,
  beat,
  language,
}: {
  copy: SceneCopy;
  beat: number;
  language: Language;
}) {
  const ui = UI[language];

  return (
    <article
      className={[styles.scene, styles.adoptionScene].join(" ")}
      data-composition="adoption-record"
      data-claim-ids={standardTimeSceneClaims[4].join(" ")}
      data-visible-claim-ids={standardTimeSceneClaims[4].join(" ")}
      data-reading-state="settled"
      data-beat-layout-container="true"
      data-beat-layout-mode="reserved"
    >
      <SceneHeading copy={copy} sceneId={4} language={language} />
      <div className={styles.adoptionLedger} data-beat-layout-item="true">
        <div className={styles.ledgerSpine} aria-hidden="true" />
        {ui.adoption.records.map((record, index) => (
          <section
            key={record.date}
            className={styles.adoptionEntry}
            data-reveal={index < 2 || beat >= 1 ? "true" : "false"}
            data-claim-id={record.claim}
            data-beat-layout-item="true"
          >
            <div className={styles.recordDate}>{record.date}</div>
            <div className={styles.recordCopy}>
              <span>Source {record.source}</span>
              <h2>{record.title}</h2>
              <p>{record.text}</p>
            </div>
          </section>
        ))}
      </div>
      <aside className={styles.legalMargin} data-beat-layout-item="true">
        <span>{ui.adoption.legalScope}</span>
        <p data-claim-id="legal-meaning">{ui.adoption.legalNote}</p>
      </aside>
    </article>
  );
}

function ConsequenceNote({
  copy,
  language,
}: {
  copy: SceneCopy;
  language: Language;
}) {
  const ui = UI[language];

  return (
    <article
      className={[styles.scene, styles.consequenceScene].join(" ")}
      data-composition="consequence-note"
      data-claim-ids={standardTimeSceneClaims[5].join(" ")}
      data-visible-claim-ids={standardTimeSceneClaims[5].join(" ")}
      data-reading-state="settled"
    >
      <SceneHeading copy={copy} sceneId={5} language={language} />
      <div className={styles.consequenceBody} data-beat-layout-item="true">
        <section className={styles.consequenceLead} data-claim-id="public-clock-consequence">
          <span>{ui.consequence.coordination}</span>
          <p>{ui.consequence.coordinationText}</p>
        </section>
        <section className={styles.consequenceCost} data-claim-id="public-clock-consequence">
          <span>{ui.consequence.displacement}</span>
          <p>{ui.consequence.displacementText}</p>
        </section>
        <aside className={styles.consequenceBoundary} data-claim-id="adoption-process">
          <span>{ui.consequence.boundary}</span>
          <p>{ui.consequence.boundaryText}</p>
        </aside>
      </div>
      <footer
        className={styles.closingRule}
        data-beat-layout-item="true"
        data-claim-id="adoption-process"
      >
        <span>{ui.consequence.finding}</span>
        <strong>{ui.consequence.findingText}</strong>
      </footer>
    </article>
  );
}

function ScenePanel({
  scene,
  beat,
  language,
}: {
  scene: number;
  beat: number;
  language: Language;
}) {
  const sceneId = clampScene(scene);
  const copy = COPY[language][sceneId];
  const activeBeat = clampBeat(sceneId, beat);

  if (sceneId === 1) {
    return <LocalClockPair copy={copy} beat={activeBeat} language={language} />;
  }
  if (sceneId === 2) {
    return <ConflictTable copy={copy} language={language} />;
  }
  if (sceneId === 3) {
    return (
      <SynchronizationNetwork copy={copy} beat={activeBeat} language={language} />
    );
  }
  if (sceneId === 4) {
    return <AdoptionRecord copy={copy} beat={activeBeat} language={language} />;
  }
  return <ConsequenceNote copy={copy} language={language} />;
}

function sceneFromPointer(nav: HTMLElement, clientX: number): SceneId {
  const rect = nav.getBoundingClientRect();
  const width = rect.width || 1;
  const ratio = Math.max(0, Math.min(0.999, (clientX - rect.left) / width));
  return (Math.floor(ratio * SCENE_IDS.length) + 1) as SceneId;
}

function TimeStandardClauses({
  scene,
  language,
  onNavigate,
}: {
  scene: SceneId;
  language: Language;
  onNavigate?: (scene: number, beat: number) => void;
}) {
  const [previewScene, setPreviewScene] = useState<SceneId | null>(null);
  const isScrubbingRef = useRef(false);
  const startXRef = useRef(0);
  const displayedScene = previewScene ?? scene;
  const nextScene = displayedScene === 5 ? 1 : ((displayedScene + 1) as SceneId);
  const copy = COPY[language];

  const jump = (target: SceneId) => {
    onNavigate?.(target, 0);
  };

  const stopTouch = (event: ReactTouchEvent<HTMLElement>) => {
    event.stopPropagation();
  };

  const handleKeyDown = (
    event: ReactKeyboardEvent<HTMLButtonElement>,
    target: SceneId,
  ) => {
    event.stopPropagation();
    let next: SceneId | null = null;

    switch (event.key) {
      case "Enter":
      case " ":
      case "Spacebar":
        next = target;
        break;
      case "ArrowLeft":
      case "ArrowUp":
        next = Math.max(1, target - 1) as SceneId;
        break;
      case "ArrowRight":
      case "ArrowDown":
        next = Math.min(5, target + 1) as SceneId;
        break;
      case "Home":
        next = 1;
        break;
      case "End":
        next = 5;
        break;
      default:
        return;
    }

    event.preventDefault();
    if (event.repeat) {
      return;
    }
    jump(next);
  };

  const handleKeyUp = (event: ReactKeyboardEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    if (
      event.key === "Enter" ||
      event.key === " " ||
      event.key === "Spacebar"
    ) {
      event.preventDefault();
    }
  };

  const beginScrub = (event: ReactPointerEvent<HTMLElement>) => {
    event.stopPropagation();
    if (event.target instanceof Element && event.target.closest("button")) {
      return;
    }
    isScrubbingRef.current = true;
    startXRef.current = event.clientX;
    setPreviewScene(sceneFromPointer(event.currentTarget, event.clientX));
    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      // Buttons remain the semantic tap/click fallback.
    }
  };

  const moveScrub = (event: ReactPointerEvent<HTMLElement>) => {
    event.stopPropagation();
    if (!isScrubbingRef.current) {
      return;
    }
    setPreviewScene(sceneFromPointer(event.currentTarget, event.clientX));
  };

  const endScrub = (event: ReactPointerEvent<HTMLElement>) => {
    event.stopPropagation();
    if (!isScrubbingRef.current) {
      return;
    }
    const target = sceneFromPointer(event.currentTarget, event.clientX);
    const moved = Math.abs(event.clientX - startXRef.current) > 8;
    isScrubbingRef.current = false;
    setPreviewScene(null);
    try {
      event.currentTarget.releasePointerCapture(event.pointerId);
    } catch {
      // Pointer capture is optional for the drag enhancement.
    }
    if (moved) {
      jump(target);
    }
  };

  return (
    <nav
      className={styles.clauseNavigator}
      aria-label={language === "zh" ? "标准时条款导航" : "Standard time clause navigation"}
      data-topic-navigation="true"
      data-navigation-geometry="typographic-index"
      data-navigation-carrier="time-standard-clauses"
      data-navigation-invocation="drag-scrub"
      data-navigation-feedback="next-state-preview"
      data-preview-scene={displayedScene}
      data-scrubbing={isScrubbingRef.current ? "true" : "false"}
      onClick={(event) => event.stopPropagation()}
      onTouchStartCapture={stopTouch}
      onTouchMoveCapture={stopTouch}
      onTouchEndCapture={stopTouch}
      onTouchCancelCapture={stopTouch}
      onPointerDown={beginScrub}
      onPointerMove={moveScrub}
      onPointerUp={endScrub}
      onPointerCancel={(event) => {
        event.stopPropagation();
        isScrubbingRef.current = false;
        setPreviewScene(null);
      }}
    >
      <span className={styles.navigatorTitle}>
        {language === "zh" ? "标准时条款" : "TIME-STANDARD CLAUSES"}
      </span>
      <div className={styles.clauseStops}>
        {SCENE_IDS.map((sceneId) => (
          <button
            key={sceneId}
            type="button"
            className={styles.clauseStop}
            aria-label={
              language === "zh"
                ? "跳至条款 " + sceneId
                : "Jump to clause " + sceneId
            }
            aria-current={sceneId === scene ? "page" : undefined}
            data-active={sceneId === displayedScene ? "true" : "false"}
            onClick={(event: ReactMouseEvent<HTMLButtonElement>) => {
              event.stopPropagation();
              jump(sceneId);
            }}
            onKeyDown={(event) => handleKeyDown(event, sceneId)}
            onKeyUp={handleKeyUp}
          >
            <span>{String(sceneId).padStart(2, "0")}</span>
            <strong>{copy[sceneId].nav}</strong>
          </button>
        ))}
      </div>
      <div
        className={styles.nextStatePreview}
        data-next-state-preview="true"
        aria-live="polite"
      >
        <span>{language === "zh" ? "下一记录" : "NEXT RECORD"}</span>
        <strong>
          {String(nextScene).padStart(2, "0")} / {copy[nextScene].nav}
        </strong>
        <p>{language === "zh" ? "拖动 · 点击 · 按键" : "DRAG · CLICK · KEY"}</p>
      </div>
    </nav>
  );
}

export function getMetadata(language: Language): StyleMetadata {
  const copy = COPY[language];
  return {
    id: "decision-record",
    band: "text-report",
    name: language === "zh" ? "决策记录" : "Decision Record",
    theme:
      language === "zh"
        ? "标准时：19 世纪英国铁路时间的协商式采用"
        : "Standard Time: a staged British railway-time adoption",
    densityLabel: language === "zh" ? "证据报告 · 阅读优先" : "Evidence report · Reading-first",
    heroScene: 3,
    colors: {
      bg: "#e7e3d8",
      ink: "#152330",
      panel: "#f8f5ec",
    },
    typography: {
      header: language === "zh" ? "Songti SC 700" : "Georgia 700",
      body: language === "zh" ? "PingFang SC 500" : "Arial 500",
    },
    tags: [
      "decision-record",
      "standard-time",
      "railway-history",
      "evidence-report",
      "document-record",
      "clock-diagram",
      "low-motion",
    ],
    fonts: ["Georgia", "Arial", "cjk:Songti SC", "cjk:PingFang SC"],
    scenes: SCENE_IDS.map((sceneId) => ({
      id: sceneId,
      title: copy[sceneId].title,
      beats: copy[sceneId].beats,
    })),
  };
}

export default function StandardTimeDecisionRecord({
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
  const ribbon = UI[language].ribbon;

  return (
    <section
      className={[styles.root, settled ? styles.settled : ""]
        .filter(Boolean)
        .join(" ")}
      data-testid="standard-time-root"
      data-topic-id="standard-time"
      data-style-id="decision-record"
      data-language={language}
      data-stage-safe="true"
      data-settled={settled ? "true" : "false"}
      data-frozen={frozen ? "true" : "false"}
      data-thumbnail={isThumbnail ? "true" : "false"}
      data-motion={settled ? "off" : "restrained"}
    >
      <header className={styles.recordRibbon}>
        <span>{ribbon[0]}</span>
        <strong>{ribbon[1]}</strong>
        <span>{ribbon[2]}</span>
      </header>
      <main className={styles.trackShell} data-stage-safe-region="track">
        <SpatialSceneTrack
          scene={activeScene}
          beat={activeBeat}
          sceneIds={[...SCENE_IDS]}
          transitionKind="hard-cut"
          transitionMap={TRANSITION_MAP}
          transitionDurationMs={620}
          reducedMotion={settled}
          beatLayoutModes={BEAT_LAYOUT_MODES}
          className={styles.track}
          renderScene={(sceneId, sceneBeat) => (
            <ScenePanel scene={sceneId} beat={sceneBeat} language={language} />
          )}
        />
      </main>
      {!isThumbnail && (
        <TimeStandardClauses
          scene={activeScene}
          language={language}
          onNavigate={onNavigate}
        />
      )}
    </section>
  );
}

export const standardTimeTopic = defineStyleTopic({
  id: "standard-time",
  topic: {
    en: "Standard Time",
    zh: "标准时",
  },
  model: "GPT-5.6 Terra/Max",
  component: StandardTimeDecisionRecord,
  getMetadata,
  navigation: {
    geometry: "typographic-index",
    carrier: "time-standard-clauses",
    invocation: "drag-scrub",
    feedback: "next-state-preview",
  },
  sources: standardTimeSources,
  transitionScore: standardTimeTransitionScore,
});

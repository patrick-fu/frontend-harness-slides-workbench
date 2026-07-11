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
  type SceneTransitionMap,
} from "../styles/SpatialSceneTrack";
import styles from "./ozone-hole.module.css";

type Language = "en" | "zh";
type SceneId = 1 | 2 | 3 | 4 | 5;
type SourceId = "S1" | "S2" | "S3" | "S4" | "S5" | "S6" | "S7" | "S8";

interface BeatCopy {
  id: number;
  action: string;
  title: string;
  body: string;
}

interface SceneCopy {
  tab: string;
  eyebrow: string;
  status: string;
  title: string;
  summary: string;
  beats: BeatCopy[];
}

interface LocalizedCopy {
  caseLabel: string;
  casePath: string;
  reportType: string;
  fixedStatus: string;
  sourceLabel: string;
  currentLabel: string;
  boundaryLabel: string;
  scenes: Record<SceneId, SceneCopy>;
  definition: {
    misconception: string;
    correction: string;
    threshold: string;
    thresholdDetail: string;
    columnLabel: string;
    columnHeader: string;
    stratosphere: string;
    lowerAir: string;
    space: string;
    depletedRegion: string;
    antarctica: string;
    seasonalWindow: string;
    reading: string;
    boundary: string;
  };
  timeline: {
    chartTitle: string;
    chartNote: string;
    high: string;
    low: string;
    states: Array<{
      id: "record" | "baseline" | "decline" | "publish";
      date: string;
      label: string;
      detail: string;
      value: string;
      source: SourceId;
      level: number;
    }>;
    qcTitle: string;
    qc: Array<{ label: string; detail: string }>;
    boundary: string;
  };
  satellite: {
    title: string;
    groundTitle: string;
    groundBody: string;
    flagTitle: string;
    flagBody: string;
    reprocessTitle: string;
    reprocessBody: string;
    resultTitle: string;
    resultBody: string;
    mapLabel: string;
    mapDetail: string;
    higher: string;
    depleted: string;
    boundary: string;
  };
  chemistry: {
    title: string;
    sectionTitle: string;
    altitude: string;
    notScale: string;
    sun: string;
    psc: string;
    steps: Array<{
      index: string;
      label: string;
      detail: string;
      equation: string;
      source: SourceId;
    }>;
    layerLabels: [string, string, string];
    cycle: string;
    boundary: string;
  };
  recovery: {
    title: string;
    rows: Array<{
      status: string;
      label: string;
      detail: string;
      source: SourceId;
      tone: "done" | "progress" | "watch" | "forecast";
    }>;
    assessment: string;
    nextAssessment: string;
    assessmentClock: string;
    nextCheckpoint: string;
    takeaway: string;
    boundary: string;
  };
  nav: {
    aria: string;
    open: string;
    hint: string;
  };
}

const SCENE_IDS = [1, 2, 3, 4, 5] as const;

export const ozoneHoleTransitionScore = {
  "1->2": "linear-wipe",
  "2->3": "hard-cut",
  "3->4": "crossfade",
  "4->5": "linear-wipe",
} as const satisfies TopicDefinition["transitionScore"];

const TRANSITION_MAP: SceneTransitionMap = ozoneHoleTransitionScore;

// SpatialSceneTrack clears its outgoing panel after each edge. Keep the
// current scene's incoming edge as the fallback so settled and hard-cut frames
// continue to expose the authored transition score on later renders.
const INCOMING_TRANSITION_KIND = {
  1: "linear-wipe",
  2: ozoneHoleTransitionScore["1->2"],
  3: ozoneHoleTransitionScore["2->3"],
  4: ozoneHoleTransitionScore["3->4"],
  5: ozoneHoleTransitionScore["4->5"],
} as const satisfies Record<SceneId, SceneTransitionKind>;

const BEAT_LAYOUT_MODES = {
  1: "reserved",
  2: "reserved",
  4: "reserved",
} satisfies Partial<Record<SceneId, BeatLayoutMode>>;

export const ozoneHoleSources = [
  {
    id: "S1",
    authority: "British Antarctic Survey",
    title: "The ozone hole discovery",
    citation: "British Antarctic Survey. The ozone hole discovery. History feature, accessed 10 July 2026.",
    url: "https://www.bas.ac.uk/about/history/ozone-hole-discovery/",
    supports:
      "Documents the 1985 BAS discovery, recurring Antarctic spring depletion, Halley observations, subsequent NASA satellite confirmation, and the policy response.",
  },
  {
    id: "S2",
    authority: "British Antarctic Survey Polar Data Centre",
    title: "Provisional monthly mean ozone values for Halley between 1956 and 1985",
    citation:
      "Shanklin, J. (2017). Provisional monthly mean ozone values for Halley between 1956 and 1985, Version 1.0. DOI 10.5285/d16ac510-3b63-41c0-a6b6-a85bc2ca4d7e.",
    url: "https://data.bas.ac.uk/full-record.php?id=GB%2FNERC%2FBAS%2FPDC%2F00951",
    supports:
      "Provides the Halley monthly mean total-ozone record in Dobson Units and states observation-season, low-sun, coefficient-correction, and atmospheric-assumption quality limits.",
  },
  {
    id: "S3",
    authority: "NASA Goddard Space Flight Center, Ozone Watch",
    title: "History of the Ozone Hole",
    citation: "NASA Ozone Watch. History of the Ozone Hole. Page updated 23 September 2024.",
    url: "https://ozonewatch.gsfc.nasa.gov/facts/history_SH.html",
    supports:
      "Places the Halley record, the 1985 publication, the 1986 TOMS and SBUV regional confirmation, polar stratospheric clouds, and later aircraft chlorine observations in one evidence chronology.",
  },
  {
    id: "S4",
    authority: "NASA Technical Reports Server / Comptes Rendus Geoscience",
    title: "The discovery of the Antarctic Ozone Hole",
    citation:
      "Bhartia, P. K. & McPeters, R. D. (2018). The discovery of the Antarctic Ozone Hole. C. R. Geoscience 350, 335–340.",
    url: "https://ntrs.nasa.gov/api/citations/20190002263/downloads/20190002263.pdf",
    supports:
      "Explains why extreme 1983 Antarctic retrievals outside the original 200–650 DU standard-profile range were flagged and how low-ozone profiles enabled reprocessing and map comparison.",
  },
  {
    id: "S5",
    authority: "NASA Goddard Space Flight Center, Ozone Watch",
    title: "What is the Ozone Hole?",
    citation: "NASA Ozone Watch. What is the Ozone Hole? Page updated 23 September 2024.",
    url: "https://ozonewatch.gsfc.nasa.gov/facts/hole_SH.html",
    supports:
      "Defines the ozone hole as a seasonal Antarctic stratospheric region at or below 220 Dobson Units, not a zero-ozone opening, and summarizes chlorine- and bromine-catalyzed loss.",
  },
  {
    id: "S6",
    authority: "WMO, UNEP, NOAA, NASA, and the European Commission",
    title: "Scientific Assessment of Ozone Depletion: 2022 — Executive Summary",
    citation: "Scientific Assessment of Ozone Depletion: 2022 — Executive Summary.",
    url: "https://public.wmo.int/sites/default/files/2023-03/Scientific-Assessment-of-Ozone-Depletion-2022-Executive-Summary.pdf",
    supports:
      "Reports declining controlled ozone-depleting substances, Antarctic ozone recovery with substantial interannual variability, and conditional return to 1980 total-column values around 2066.",
  },
  {
    id: "S7",
    authority: "NASA and NOAA",
    title: "NASA, NOAA Rank 2025 Ozone Hole as 5th Smallest Since 1992",
    citation: "Younger, S. NASA Earth Science News Team, 24 November 2025; updated 18 March 2026.",
    url: "https://science.nasa.gov/earth/nasa-noaa-rank-2025-ozone-hole-as-5th-smallest-since-1992/",
    supports:
      "Provides the latest completed Antarctic season status available during authoring and explicitly separates gradual recovery from temperature, weather, and polar-vortex variability.",
  },
  {
    id: "S8",
    authority: "UNEP Ozone Secretariat",
    title: "Decision XXXV/3: Potential areas of focus for the 2026 quadrennial reports",
    citation: "Meeting of the Parties to the Montreal Protocol, Decision XXXV/3, 2023.",
    url: "https://ozone.unep.org/treaties/montreal-protocol/meetings/thirty-fifth-meeting-parties/decisions/decision-xxxv3-potential-areas-focus-2026-quadrennial-reports-environmental-effects-assessment-panel",
    supports:
      "Establishes that the 2026 quadrennial assessment reports are to be submitted by 31 December 2026, so the 2022 assessment remains the latest completed assessment during authoring.",
  },
] as const satisfies readonly (Source & { id: SourceId })[];

export const ozoneHoleClaims = [
  {
    id: "C1",
    sourceIds: ["S5"] as const,
    claim:
      "The Antarctic ozone hole is a seasonal region of exceptionally depleted total-column ozone, conventionally bounded at 220 DU or lower.",
    boundary:
      "The word hole is a metaphor: ozone remains present, is distributed through an atmospheric column, and the boundary is an observational convention tied to the Antarctic record.",
  },
  {
    id: "C2",
    sourceIds: ["S1", "S2"] as const,
    claim:
      "Long-running Dobson observations at Halley supplied the ground record that revealed systematic Antarctic spring ozone loss.",
    boundary:
      "Monthly means carry observation-count, low-sun, coefficient, and assumed-atmosphere limitations; the visual timeline is an evidence index, not a substitute for the dataset.",
  },
  {
    id: "C3",
    sourceIds: ["S1", "S3"] as const,
    claim:
      "The 1985 BAS publication made the recurring springtime decline visible as a scientific problem requiring regional and mechanistic tests.",
    boundary:
      "The publication did not by itself establish every spatial extent, reaction step, policy outcome, or recovery trajectory shown later in the evidence chain.",
  },
  {
    id: "C4",
    sourceIds: ["S3", "S4"] as const,
    claim:
      "Reprocessed TOMS and SBUV observations corroborated an Antarctic-scale low-ozone region after extreme values had challenged the retrieval profile set.",
    boundary:
      "Flagged retrievals were a quality-control problem, not evidence that satellites were intrinsically blind; ground and satellite systems had complementary roles.",
  },
  {
    id: "C5",
    sourceIds: ["S3", "S5", "S6"] as const,
    claim:
      "Very low temperatures, polar stratospheric cloud chemistry, chlorine and bromine from long-lived ODSs, and returning spring sunlight create rapid catalytic ozone loss.",
    boundary:
      "The displayed reaction chain is deliberately simplified and not to scale; atmospheric transport, bromine chemistry, denitrification, temperature, and vortex dynamics also matter.",
  },
  {
    id: "C6",
    sourceIds: ["S6"] as const,
    claim:
      "Montreal Protocol controls have reduced controlled ODS abundances and are advancing ozone recovery.",
    boundary:
      "Recovery is conditional on continued compliance and does not mean every latitude, altitude, or year shows the same trend or confidence.",
  },
  {
    id: "C7",
    sourceIds: ["S6", "S7"] as const,
    claim:
      "The 2025 Antarctic hole was relatively modest while annual size, depth, and longevity still vary substantially with meteorology.",
    boundary:
      "A rank or area from one season is a dated observation, not the long-term recovery conclusion and not a constant for future seasons.",
  },
  {
    id: "C8",
    sourceIds: ["S6", "S8"] as const,
    claim:
      "The latest completed quadrennial assessment during authoring projects Antarctic total-column ozone returning to 1980 values around the late 2060s; the 2026 assessment is still in preparation.",
    boundary:
      "The date is a model-based, policy-conditional projection from the 2022 assessment and should be revisited after the 2026 report is submitted.",
  },
] as const;

const COPY: Record<Language, LocalizedCopy> = {
  en: {
    caseLabel: "ATMOSPHERIC CASE / O₃-ANT",
    casePath: "evidence/antarctica/seasonal-depletion",
    reportType: "Scientific issue brief",
    fixedStatus: "Evidence closed · recovery open",
    sourceLabel: "claim sources",
    currentLabel: "active state",
    boundaryLabel: "BOUNDARY",
    scenes: {
      1: {
        tab: "Define",
        eyebrow: "01 / ISSUE DEFINITION",
        status: "Observed each spring",
        title: "The ozone “hole” is a low-value region, not an opening",
        summary:
          "Total-column ozone falls sharply over Antarctica when sunlight returns after polar winter. The term names a measured seasonal state.",
        beats: [
          {
            id: 0,
            action: "Locate the observation in place, season, and atmospheric column.",
            title: "Define the measured object",
            body: "Antarctica · Southern Hemisphere spring · total-column ozone in DU.",
          },
          {
            id: 1,
            action: "Replace the literal-hole misconception with the operational boundary.",
            title: "Apply the 220 DU boundary",
            body: "The region contains ozone; it is exceptionally depleted relative to the historic Antarctic record.",
          },
        ],
      },
      2: {
        tab: "Ground",
        eyebrow: "02 / REPRODUCTION RECORD",
        status: "Long series",
        title: "Halley’s record made a recurring anomaly reviewable",
        summary:
          "Year-after-year Dobson observations turned an unexpected reading into a time-resolved spring signal with visible quality limits.",
        beats: [
          {
            id: 0,
            action: "Open the continuous station record.",
            title: "Record",
            body: "Monthly means begin in the International Geophysical Year era.",
          },
          {
            id: 1,
            action: "Establish the historical October reference.",
            title: "Reference",
            body: "Pre-decline spring ozone was near 300 DU at Halley.",
          },
          {
            id: 2,
            action: "Focus the systematic 1980s fall.",
            title: "Signal",
            body: "The later spring values moved well outside the earlier range.",
          },
          {
            id: 3,
            action: "Close the station case with publication and explicit QC.",
            title: "Publish",
            body: "The 1985 paper exposed a testable anomaly, not a finished causal model.",
          },
        ],
      },
      3: {
        tab: "Orbit",
        eyebrow: "03 / SATELLITE RECHECK",
        status: "Region confirmed",
        title: "Orbit widened the ground record without replacing it",
        summary:
          "Extreme Antarctic values challenged the original retrieval profiles. Reprocessing and independent instruments preserved the pattern and mapped its scale.",
        beats: [
          {
            id: 0,
            action: "Reconcile flagged retrievals with the ground record.",
            title: "Ground + satellite cross-check",
            body: "TOMS and SBUV demonstrated an Antarctic-scale phenomenon in 1986.",
          },
        ],
      },
      4: {
        tab: "Cause",
        eyebrow: "04 / ROOT-CAUSE CHAIN",
        status: "Mechanism converged",
        title: "Cold clouds prepare chlorine; spring sunlight starts the loss cycle",
        summary:
          "The seasonal geometry matters: long-lived source gases, polar winter chemistry, and returning light must line up inside the vortex.",
        beats: [
          {
            id: 0,
            action: "Trace long-lived source gases to the stratosphere.",
            title: "Load",
            body: "CFC-derived chlorine accumulates in comparatively stable reservoir forms.",
          },
          {
            id: 1,
            action: "Activate chlorine on polar stratospheric cloud surfaces.",
            title: "Prime",
            body: "Very low temperatures enable heterogeneous reactions during polar winter.",
          },
          {
            id: 2,
            action: "Return sunlight and close the catalytic cycle.",
            title: "Destroy",
            body: "Reactive chlorine is recycled while ozone is converted to oxygen.",
          },
        ],
      },
      5: {
        tab: "Status",
        eyebrow: "05 / VERIFICATION STATUS",
        status: "Recovering · variable",
        title: "The control worked; the annual signal still needs context",
        summary:
          "Controlled ozone-depleting substances are declining. Antarctic recovery is detectable, slow, weather-sensitive, and conditional on continued compliance.",
        beats: [
          {
            id: 0,
            action: "Report policy control, observation, projection, and assessment freshness separately.",
            title: "Recovery status",
            body: "One season is not the trend; one projection is not a guarantee.",
          },
        ],
      },
    },
    definition: {
      misconception: "Literal reading",
      correction: "Not an opening in the sky",
      threshold: "≤ 220 Dobson units",
      thresholdDetail:
        "Operational boundary for the Antarctic depleted region; values below it were absent from the pre-1979 record.",
      columnLabel: "total atmospheric column",
      columnHeader: "ATMOSPHERIC COLUMN",
      stratosphere: "stratosphere · most ozone",
      lowerAir: "troposphere · weather",
      space: "SPACE",
      depletedRegion: "LOW-OZONE REGION",
      antarctica: "ANTARCTICA",
      seasonalWindow: "Antarctic spring · roughly Aug–Oct onset",
      reading: "Read the blue zone as less ozone in a column, not empty atmosphere.",
      boundary:
        "DU compresses all ozone in a vertical column to an equivalent thickness at standard conditions; it is not a layer height.",
    },
    timeline: {
      chartTitle: "HALLEY / OCTOBER SIGNAL INDEX",
      chartNote: "Evidence milestones · vertical position is schematic",
      high: "more total ozone",
      low: "less total ozone",
      states: [
        {
          id: "record",
          date: "1956–85",
          label: "1956–1985 monthly means",
          detail: "Dobson series preserved the same station and measurement vocabulary.",
          value: "record opened",
          source: "S2",
          level: 76,
        },
        {
          id: "baseline",
          date: "1957–73",
          label: "Historical October reference",
          detail: "Halley spring values were typically near 300 DU before the sustained decline.",
          value: "≈ 300 DU",
          source: "S2",
          level: 68,
        },
        {
          id: "decline",
          date: "1980–84",
          label: "Systematic spring decline",
          detail: "Later October values fell far below the earlier station range.",
          value: "well below reference",
          source: "S3",
          level: 35,
        },
        {
          id: "publish",
          date: "May 1985",
          label: "BAS publication",
          detail: "Farman, Gardiner, and Shanklin made the seasonal anomaly reviewable.",
          value: "case opened",
          source: "S1",
          level: 27,
        },
      ],
      qcTitle: "DATA QUALITY / ATTACHED",
      qc: [
        {
          label: "sun-angle limits",
          detail: "Early and late observing-season readings are less accurate at low solar elevation.",
        },
        {
          label: "coefficient history",
          detail: "Earlier values carry documented WMO-guided absorption-coefficient corrections.",
        },
        {
          label: "sampling note",
          detail: "Monthly means flatten available daily averages; observation counts can differ.",
        },
      ],
      boundary:
        "The plotted path indexes the evidence story. Use the BAS dataset—not this schematic—for quantitative analysis.",
    },
    satellite: {
      title: "TOMS / SBUV DATA REVIEW",
      groundTitle: "01 · Ground signal",
      groundBody: "Halley supplied an in-situ reference that could challenge model expectations.",
      flagTitle: "02 · Retrieval flag",
      flagBody:
        "Extreme 1983 values outside the original 200–650 DU profile set were flagged for reliability review.",
      reprocessTitle: "03 · Low-ozone profiles",
      reprocessBody:
        "Reprocessing extended the retrieval assumptions; later corrected maps retained the same large-scale pattern.",
      resultTitle: "04 · Regional result",
      resultBody:
        "In 1986, TOMS and SBUV demonstrated a regional-scale Antarctic phenomenon.",
      mapLabel: "ANTARCTIC TOTAL-OZONE FIELD",
      mapDetail: "contour logic · depleted centre · ground point at Halley",
      higher: "higher",
      depleted: "depleted",
      boundary:
        "Neither instrument class closes the case alone: station data constrain retrievals; satellites expand spatial reach.",
    },
    chemistry: {
      title: "SEASONAL ACTIVATION / SIMPLIFIED",
      sectionTitle: "ATMOSPHERIC SECTION",
      altitude: "about 12–25 km · polar lower stratosphere",
      notScale: "diagrammatic · not to scale",
      sun: "SUN",
      psc: "polar stratospheric clouds",
      steps: [
        {
          index: "01",
          label: "LOAD · long-lived source gases",
          detail: "CFCs survive the lower atmosphere; UV releases chlorine aloft, mostly stored as HCl and ClONO₂.",
          equation: "CFC + hν → chlorine reservoirs",
          source: "S6",
        },
        {
          index: "02",
          label: "PRIME · very cold cloud surfaces",
          detail:
            "Very low temperatures let polar stratospheric clouds enable reactions that convert reservoir chlorine toward photolabile Cl₂.",
          equation: "HCl + ClONO₂ —PSC→ Cl₂ + HNO₃",
          source: "S3",
        },
        {
          index: "03",
          label: "DESTROY · returning spring sunlight",
          detail:
            "Sunlight releases reactive chlorine. Catalytic cycles recycle it while rapidly converting ozone to oxygen.",
          equation: "net: 2 O₃ → 3 O₂",
          source: "S5",
        },
      ],
      layerLabels: ["polar night", "PSC reaction zone", "spring sunlight"],
      cycle: "chlorine catalyst recycled",
      boundary:
        "This issue view omits transport detail, bromine coupling, denitrification, and full reaction kinetics.",
    },
    recovery: {
      title: "RECOVERY / OPEN VERIFICATION",
      rows: [
        {
          status: "CONTROLLED",
          label: "Montreal Protocol response",
          detail: "Controlled ODS abundances are declining and ozone recovery is advancing.",
          source: "S6",
          tone: "done",
        },
        {
          status: "OBSERVED",
          label: "Latest completed season: 2025",
          detail: "Relatively modest in recent-decade context; one season is not the trend.",
          source: "S7",
          tone: "progress",
        },
        {
          status: "VARIABLE",
          label: "Weather remains in the signal",
          detail: "Temperature, vortex strength, size, depth, and longevity vary from year to year.",
          source: "S6",
          tone: "watch",
        },
        {
          status: "PROJECTED",
          label: "Antarctic return to 1980 values",
          detail: "Around the late 2060s if Montreal Protocol compliance continues.",
          source: "S6",
          tone: "forecast",
        },
      ],
      assessment: "Latest completed assessment: 2022",
      nextAssessment: "2026 assessment is due by year-end [S8]",
      assessmentClock: "ASSESSMENT CLOCK",
      nextCheckpoint: "NEXT CHECKPOINT",
      takeaway: "Status: recovering—not recovered.",
      boundary:
        "The recovery date is conditional and model-based. Recheck the projection after the 2026 assessment is published.",
    },
    nav: {
      aria: "Ozone issue-state navigation",
      open: "Open issue state",
      hint: "Focus · arrows · enter",
    },
  },
  zh: {
    caseLabel: "大气案件 / O₃-ANT",
    casePath: "evidence/antarctica/seasonal-depletion",
    reportType: "科学问题简报",
    fixedStatus: "证据闭环 · 恢复未完",
    sourceLabel: "论断来源",
    currentLabel: "当前状态",
    boundaryLabel: "事实边界",
    scenes: {
      1: {
        tab: "定义",
        eyebrow: "01 / 问题定义",
        status: "每年春季出现",
        title: "臭氧“洞”是低值区，不是天空开了口",
        summary: "南极极夜结束、阳光返回后，总柱臭氧会急剧下降。这个词描述的是可测量的季节状态。",
        beats: [
          {
            id: 0,
            action: "把观测锁定到地点、季节和大气柱。",
            title: "定义测量对象",
            body: "南极洲 · 南半球春季 · 以 DU 表示的总柱臭氧。",
          },
          {
            id: 1,
            action: "用操作边界替换“物理孔洞”的误解。",
            title: "应用 220 DU 边界",
            body: "该区域仍有臭氧，只是相对历史南极记录异常稀薄。",
          },
        ],
      },
      2: {
        tab: "地面",
        eyebrow: "02 / 复现记录",
        status: "长期序列",
        title: "哈雷站记录让反复出现的异常可审查",
        summary: "逐年的 Dobson 观测把一次意外读数变成有时间结构的春季信号，同时保留数据质量边界。",
        beats: [
          {
            id: 0,
            action: "打开连续站点记录。",
            title: "建档",
            body: "月均值记录始于国际地球物理年时期。",
          },
          {
            id: 1,
            action: "建立历史十月参考。",
            title: "基线",
            body: "持续下降前，哈雷站春季臭氧接近 300 DU。",
          },
          {
            id: 2,
            action: "聚焦 1980 年代的系统性下降。",
            title: "信号",
            body: "后期春季读数明显跌出早期站点区间。",
          },
          {
            id: 3,
            action: "以论文和显式 QC 关闭站点调查。",
            title: "发表",
            body: "1985 年论文提出可检验异常，并非完整因果模型。",
          },
        ],
      },
      3: {
        tab: "卫星",
        eyebrow: "03 / 卫星复核",
        status: "区域尺度确认",
        title: "轨道观测扩展地面记录，但没有取代它",
        summary: "南极极低值挑战了原始反演廓线；重处理和独立仪器保留了同一空间形态，并画出其尺度。",
        beats: [
          {
            id: 0,
            action: "让被标记的反演值与地面记录互相校验。",
            title: "地面 + 卫星交叉复核",
            body: "1986 年，TOMS 与 SBUV 证明这是南极区域尺度现象。",
          },
        ],
      },
      4: {
        tab: "机制",
        eyebrow: "04 / 根因链",
        status: "机制汇合",
        title: "低温云先准备氯，春季阳光再启动损耗循环",
        summary: "季节几何是关键：长寿命源气体、极地冬季化学与返回的阳光必须在极涡内同时到位。",
        beats: [
          {
            id: 0,
            action: "追踪长寿命源气体进入平流层。",
            title: "装载",
            body: "CFC 来源的氯主要累积在较稳定的储库形态中。",
          },
          {
            id: 1,
            action: "在极地平流层云表面活化氯。",
            title: "准备",
            body: "极低温让冬季异相反应得以发生。",
          },
          {
            id: 2,
            action: "阳光返回，闭合催化循环。",
            title: "破坏",
            body: "活性氯不断再生，臭氧则转化为氧气。",
          },
        ],
      },
      5: {
        tab: "状态",
        eyebrow: "05 / 验证状态",
        status: "恢复中 · 有波动",
        title: "控制措施有效；年度信号仍需上下文",
        summary: "受控消耗臭氧物质正在下降。南极恢复可检测，但缓慢、受天气影响，并取决于持续履约。",
        beats: [
          {
            id: 0,
            action: "分别报告政策控制、观测、预测和评估新鲜度。",
            title: "恢复状态",
            body: "单一年份不是趋势，单个预测也不是保证。",
          },
        ],
      },
    },
    definition: {
      misconception: "字面误读",
      correction: "不是天空中的物理孔洞",
      threshold: "≤ 220 多布森单位",
      thresholdDetail: "南极低值区的操作边界；1979 年以前的南极历史记录没有出现过更低值。",
      columnLabel: "整根大气柱",
      columnHeader: "大气柱",
      stratosphere: "平流层 · 臭氧主要分布区",
      lowerAir: "对流层 · 天气区",
      space: "太空",
      depletedRegion: "低臭氧区",
      antarctica: "南极洲",
      seasonalWindow: "南极春季 · 大致 8–10 月开始",
      reading: "蓝色区域表示大气柱中的臭氧更少，不是大气消失。",
      boundary: "DU 把垂直大气柱中的臭氧压缩成标准条件下的等效厚度，并不是臭氧层的几何高度。",
    },
    timeline: {
      chartTitle: "哈雷站 / 十月信号索引",
      chartNote: "证据里程碑 · 纵向位置为示意",
      high: "总柱臭氧较多",
      low: "总柱臭氧较少",
      states: [
        {
          id: "record",
          date: "1956–85",
          label: "1956–1985 月均值",
          detail: "Dobson 序列保留了同一站点和测量语言。",
          value: "记录启动",
          source: "S2",
          level: 76,
        },
        {
          id: "baseline",
          date: "1957–73",
          label: "历史十月参考",
          detail: "持续下降前，哈雷站春季读数通常接近 300 DU。",
          value: "≈ 300 DU",
          source: "S2",
          level: 68,
        },
        {
          id: "decline",
          date: "1980–84",
          label: "系统性春季下降",
          detail: "后期十月值远低于早期站点区间。",
          value: "显著低于参考",
          source: "S3",
          level: 35,
        },
        {
          id: "publish",
          date: "1985.05",
          label: "BAS 论文发表",
          detail: "Farman、Gardiner 与 Shanklin 让季节异常可审查。",
          value: "案件开启",
          source: "S1",
          level: 27,
        },
      ],
      qcTitle: "数据质量 / 已附",
      qc: [
        {
          label: "太阳高度限制",
          detail: "观测季早晚太阳高度较低，读数精度也较低。",
        },
        {
          label: "系数历史",
          detail: "早期数据附有按 WMO 指南所做的吸收系数修正。",
        },
        {
          label: "采样说明",
          detail: "月均值平权汇总现有日均值，各日观测次数可能不同。",
        },
      ],
      boundary: "图中的路径只索引证据故事。做定量分析时应使用 BAS 原始数据集，而不是这张示意图。",
    },
    satellite: {
      title: "TOMS / SBUV 数据复核",
      groundTitle: "01 · 地面信号",
      groundBody: "哈雷站提供可挑战模型预期的现场参考。",
      flagTitle: "02 · 反演标记",
      flagBody: "1983 年的极低值超出原始 200–650 DU 廓线集，因此被标记等待可靠性复核。",
      reprocessTitle: "03 · 低臭氧廓线",
      reprocessBody: "重处理扩展反演先验；后来的校正地图保留了相同的大尺度形态。",
      resultTitle: "04 · 区域结果",
      resultBody: "1986 年，TOMS 与 SBUV 证明这是南极区域尺度现象。",
      mapLabel: "南极总臭氧场",
      mapDetail: "等值线逻辑 · 中心低值 · 哈雷地面点",
      higher: "较高",
      depleted: "低值",
      boundary: "任何一类仪器都不能独自闭案：站点数据约束反演，卫星扩展空间覆盖。",
    },
    chemistry: {
      title: "季节性活化 / 简化图",
      sectionTitle: "大气剖面",
      altitude: "约 12–25 km · 极地下平流层",
      notScale: "示意图 · 不按比例",
      sun: "太阳",
      psc: "极地平流层云",
      steps: [
        {
          index: "01",
          label: "装载 · 长寿命源气体",
          detail: "CFC 穿过低层大气；紫外线在高空释放氯，主要储存在 HCl 和 ClONO₂ 中。",
          equation: "CFC + hν → 氯储库",
          source: "S6",
        },
        {
          index: "02",
          label: "准备 · 极低温云表面",
          detail: "极低温让极地平流层云促使储库氯向可光解的 Cl₂ 转化。",
          equation: "HCl + ClONO₂ —PSC→ Cl₂ + HNO₃",
          source: "S3",
        },
        {
          index: "03",
          label: "破坏 · 春季阳光返回",
          detail: "阳光释放活性氯；催化循环不断再生它，同时快速把臭氧转成氧气。",
          equation: "净反应：2 O₃ → 3 O₂",
          source: "S5",
        },
      ],
      layerLabels: ["极夜", "PSC 反应区", "春季阳光"],
      cycle: "氯催化剂循环再生",
      boundary: "这份 issue 视图省略了输送细节、溴耦合、反硝化与完整反应动力学。",
    },
    recovery: {
      title: "恢复 / 验证仍开放",
      rows: [
        {
          status: "已控制",
          label: "《蒙特利尔议定书》响应",
          detail: "受控 ODS 丰度正在下降，臭氧恢复正在推进。",
          source: "S6",
          tone: "done",
        },
        {
          status: "已观测",
          label: "最近完整季节：2025",
          detail: "在近几十年语境中相对较小；单一年份不是趋势。",
          source: "S7",
          tone: "progress",
        },
        {
          status: "有波动",
          label: "天气仍写在信号里",
          detail: "温度、极涡强度、面积、深度和持续时间都存在年际变化。",
          source: "S6",
          tone: "watch",
        },
        {
          status: "预测",
          label: "南极回到 1980 年值",
          detail: "若持续履约，预计在 2060 年代后期左右。",
          source: "S6",
          tone: "forecast",
        },
      ],
      assessment: "最近完成的评估：2022",
      nextAssessment: "2026 评估应于年底提交 [S8]",
      assessmentClock: "评估时钟",
      nextCheckpoint: "下一检查点",
      takeaway: "状态：正在恢复，尚未恢复完成。",
      boundary: "恢复时间是有条件的模型预测。2026 评估发布后应重新核对。",
    },
    nav: {
      aria: "臭氧案件状态导航",
      open: "打开案件状态",
      hint: "聚焦 · 方向键 · 回车",
    },
  },
};

function clampScene(scene: number): SceneId {
  return SCENE_IDS.includes(scene as SceneId) ? (scene as SceneId) : 1;
}

function clampBeat(scene: SceneId, beat: number): number {
  const count = COPY.en.scenes[scene].beats.length;
  return Math.min(Math.max(beat, 0), count - 1);
}

function sourceTag(source: SourceId) {
  return <span className={styles.sourceTag}>[{source}]</span>;
}

function SceneHeader({
  copy,
  sceneId,
}: {
  copy: LocalizedCopy;
  sceneId: SceneId;
}) {
  const sceneCopy = copy.scenes[sceneId];
  return (
    <header className={styles.sceneHeader} data-beat-layout-item="true">
      <div className={styles.headingCopy}>
        <div className={styles.eyebrowRow}>
          <span className={styles.eyebrow}>{sceneCopy.eyebrow}</span>
          <span className={styles.stateBadge}>{sceneCopy.status}</span>
        </div>
        <h1>{sceneCopy.title}</h1>
        <p>{sceneCopy.summary}</p>
      </div>
    </header>
  );
}

function BoundaryNote({ children, label }: { children: string; label: string }) {
  return (
    <div className={styles.boundaryNote} data-beat-layout-item="true">
      <span>{label}</span>
      <p>{children}</p>
    </div>
  );
}

function DefinitionScene({ copy, beat }: { copy: LocalizedCopy; beat: number }) {
  const b = clampBeat(1, beat);
  const c = copy.definition;
  return (
    <section
      className={styles.scene}
      data-reading-state="settled"
      data-claim-id="C1"
      data-beat-layout-container="true"
      data-beat-layout-mode="reserved"
    >
      <SceneHeader copy={copy} sceneId={1} />
      <div className={styles.definitionGrid} data-beat-layout-item="true">
        <div className={styles.definitionTicket}>
          <div className={styles.ticketLabelRow}>
            <span>{c.misconception}</span>
            {sourceTag("S5")}
          </div>
          <strong>{c.correction}</strong>
          <p>{c.reading}</p>
          <div className={styles.thresholdCard} data-focused={b === 1 ? "true" : "false"}>
            <code>{c.threshold}</code>
            <p>{c.thresholdDetail}</p>
          </div>
          <div className={styles.seasonRow}>
            <span>{c.seasonalWindow}</span>
            <span>{c.columnLabel}</span>
          </div>
        </div>
        <div className={styles.atmosphericCard} data-atmospheric-section="true">
          <div className={styles.atmosphereTopline}>
            <span>{c.columnHeader}</span>
            <code>O₃ / DU</code>
          </div>
          <div className={styles.columnGraphic}>
            <div className={styles.spaceBand}>{c.space}</div>
            <div className={styles.stratosphereBand}>
              <span>{c.stratosphere}</span>
              <div className={styles.ozoneField} data-focus={b === 1 ? "boundary" : "column"}>
                <i />
                <i />
                <i />
                <i />
                <i />
              </div>
              <strong>{c.depletedRegion}</strong>
            </div>
            <div className={styles.troposphereBand}>{c.lowerAir}</div>
            <div className={styles.iceBand}>{c.antarctica}</div>
          </div>
        </div>
      </div>
      <BoundaryNote label={copy.boundaryLabel}>{c.boundary}</BoundaryNote>
    </section>
  );
}

function TimelineScene({ copy, beat }: { copy: LocalizedCopy; beat: number }) {
  const b = clampBeat(2, beat);
  const c = copy.timeline;
  const pointPath = c.states
    .map((state, index) => `${index === 0 ? "M" : "L"} ${8 + index * 28} ${100 - state.level}`)
    .join(" ");

  return (
    <section
      className={styles.scene}
      data-reading-state="settled"
      data-claim-id="C2"
      data-beat-layout-container="true"
      data-beat-layout-mode="reserved"
    >
      <SceneHeader copy={copy} sceneId={2} />
      <div className={styles.timelineGrid} data-beat-layout-item="true">
        <div className={styles.timelinePanel}>
          <div className={styles.panelHeader}>
            <div>
              <strong>{c.chartTitle}</strong>
              <span>{c.chartNote}</span>
            </div>
            {sourceTag("S2")}
          </div>
          <div className={styles.timelinePlot}>
            <span className={styles.axisHigh}>{c.high}</span>
            <span className={styles.axisLow}>{c.low}</span>
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
              <path className={styles.baselinePath} d="M 0 25 L 100 25" />
              <path className={styles.signalPath} d={pointPath} />
            </svg>
            {c.states.map((state, index) => (
              <article
                className={styles.evidenceState}
                data-beat-layout-item="true"
                data-evidence-state={state.id}
                data-focused={index === b ? "true" : "false"}
                data-visited={index <= b ? "true" : "false"}
                key={state.id}
                style={{
                  ["--point-x" as string]: `${8 + index * 28}%`,
                  ["--point-y" as string]: `${100 - state.level}%`,
                }}
              >
                <span className={styles.pointDot} />
                <div className={styles.pointLabel}>
                  <code>{state.date}</code>
                  <strong>{state.label}</strong>
                  <span>{state.value}</span>
                </div>
              </article>
            ))}
          </div>
          <div className={styles.activeEvidence}>
            <code>{c.states[b].date} · [{c.states[b].source}]</code>
            <strong>{c.states[b].label}</strong>
            <p>{c.states[b].detail}</p>
          </div>
        </div>
        <aside className={styles.qcPanel}>
          <div className={styles.panelHeader}>
            <strong>{c.qcTitle}</strong>
            {sourceTag("S2")}
          </div>
          <div className={styles.qcRows}>
            {c.qc.map((item) => (
              <div className={styles.qcRow} key={item.label}>
                <span>[x]</span>
                <div>
                  <strong>{item.label}</strong>
                  <p>{item.detail}</p>
                </div>
              </div>
            ))}
          </div>
          <div className={styles.qcReceipt}>
            <span>REVIEW STATE</span>
            <strong>{copy.scenes[2].beats[b].title}</strong>
          </div>
        </aside>
      </div>
      <BoundaryNote label={copy.boundaryLabel}>{c.boundary}</BoundaryNote>
    </section>
  );
}

function SatelliteScene({ copy }: { copy: LocalizedCopy }) {
  const c = copy.satellite;
  const steps = [
    [c.groundTitle, c.groundBody, "S2"],
    [c.flagTitle, c.flagBody, "S4"],
    [c.reprocessTitle, c.reprocessBody, "S4"],
    [c.resultTitle, c.resultBody, "S3"],
  ] as const;

  return (
    <section className={styles.scene} data-reading-state="settled" data-claim-id="C4">
      <SceneHeader copy={copy} sceneId={3} />
      <div className={styles.satelliteGrid} data-satellite-recheck="true">
        <div className={styles.reviewRail}>
          <div className={styles.panelHeader}>
            <strong>{c.title}</strong>
            {sourceTag("S4")}
          </div>
          <div className={styles.reviewSteps}>
            {steps.map(([title, body, source], index) => (
              <article className={styles.reviewStep} key={title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <strong>{title}</strong>
                  <p>{body}</p>
                </div>
                <code>[{source}]</code>
              </article>
            ))}
          </div>
        </div>
        <div className={styles.orbitMap}>
          <div className={styles.mapHeader}>
            <strong>{c.mapLabel}</strong>
            <span>{c.mapDetail}</span>
          </div>
          <div className={styles.mapCanvas} aria-label={c.mapLabel}>
            <div className={styles.orbitRing} />
            <div className={styles.contourOuter} />
            <div className={styles.contourMiddle} />
            <div className={styles.contourInner} />
            <div className={styles.antarcticaShape}>
              <span className={styles.peninsula} />
            </div>
            <span className={styles.halleyMarker}>HALLEY</span>
            <span className={styles.satelliteMarker}>TOMS / SBUV</span>
            <div className={styles.mapLegend}>
              <span><i data-tone="normal" /> {c.higher}</span>
              <span><i data-tone="depleted" /> {c.depleted}</span>
            </div>
          </div>
        </div>
      </div>
      <BoundaryNote label={copy.boundaryLabel}>{c.boundary}</BoundaryNote>
    </section>
  );
}

function ChemistryScene({ copy, beat }: { copy: LocalizedCopy; beat: number }) {
  const b = clampBeat(4, beat);
  const c = copy.chemistry;
  return (
    <section
      className={styles.scene}
      data-reading-state="settled"
      data-claim-id="C5"
      data-beat-layout-container="true"
      data-beat-layout-mode="reserved"
    >
      <SceneHeader copy={copy} sceneId={4} />
      <div className={styles.chemistryGrid} data-beat-layout-item="true">
        <div className={styles.mechanismPanel}>
          <div className={styles.panelHeader}>
            <strong>{c.title}</strong>
            {sourceTag("S3")}
          </div>
          <div className={styles.mechanismSteps}>
            {c.steps.map((step, index) => (
              <article
                className={styles.mechanismStep}
                data-beat-layout-item="true"
                data-focused={index === b ? "true" : "false"}
                data-mechanism-step="true"
                data-visited={index <= b ? "true" : "false"}
                key={step.index}
              >
                <span>{step.index}</span>
                <div>
                  <strong>{step.label}</strong>
                  <p>{step.detail}</p>
                  <code>{step.equation}</code>
                </div>
                <i>[{step.source}]</i>
              </article>
            ))}
          </div>
          <div className={styles.cycleReceipt}>
            <span>{c.cycle}</span>
            <strong>2 O₃ → 3 O₂</strong>
          </div>
        </div>
        <div className={styles.sectionPanel} data-atmospheric-section="true">
          <div className={styles.mapHeader}>
            <strong>{c.sectionTitle}</strong>
            <span>{c.altitude}</span>
          </div>
          <div className={styles.sectionGraphic} data-step={b}>
            <div className={styles.sunDisc}>
              <span>{c.sun}</span>
            </div>
            <div className={styles.vortexWall} />
            <div className={styles.pscClouds}>
              <i />
              <i />
              <i />
              <i />
              <strong>{c.psc}</strong>
            </div>
            <div className={styles.chemicalField}>
              <span>HCl</span>
              <span>ClONO₂</span>
              <span>Cl₂</span>
              <span>ClO</span>
              <span>O₃</span>
            </div>
            <div className={styles.sectionLayers}>
              {c.layerLabels.map((label, index) => (
                <span data-active={index === b ? "true" : "false"} key={label}>
                  {label}
                </span>
              ))}
            </div>
            <code>{c.notScale}</code>
          </div>
        </div>
      </div>
      <BoundaryNote label={copy.boundaryLabel}>{c.boundary}</BoundaryNote>
    </section>
  );
}

function RecoveryScene({ copy }: { copy: LocalizedCopy }) {
  const c = copy.recovery;
  return (
    <section className={styles.scene} data-reading-state="settled" data-claim-id="C8">
      <SceneHeader copy={copy} sceneId={5} />
      <div className={styles.recoveryPanel}>
        <div className={styles.panelHeader}>
          <strong>{c.title}</strong>
          <span>{c.assessment}</span>
        </div>
        <div className={styles.statusRows}>
          {c.rows.map((row) => (
            <article className={styles.statusRow} data-tone={row.tone} key={row.status}>
              <span>{row.status}</span>
              <div>
                <strong>{row.label}</strong>
                <p>{row.detail}</p>
              </div>
              <code>[{row.source}]</code>
            </article>
          ))}
        </div>
        <div className={styles.assessmentBar}>
          <div>
            <span>{c.assessmentClock}</span>
            <strong>{c.assessment}</strong>
          </div>
          <div>
            <span>{c.nextCheckpoint}</span>
            <strong>{c.nextAssessment}</strong>
          </div>
          <p>{c.takeaway}</p>
        </div>
      </div>
      <BoundaryNote label={copy.boundaryLabel}>{c.boundary}</BoundaryNote>
    </section>
  );
}

function ScenePanel({
  sceneId,
  beat,
  copy,
}: {
  sceneId: SceneId;
  beat: number;
  copy: LocalizedCopy;
}) {
  switch (sceneId) {
    case 1:
      return <DefinitionScene beat={beat} copy={copy} />;
    case 2:
      return <TimelineScene beat={beat} copy={copy} />;
    case 3:
      return <SatelliteScene copy={copy} />;
    case 4:
      return <ChemistryScene beat={beat} copy={copy} />;
    case 5:
      return <RecoveryScene copy={copy} />;
  }
}

function IssueStateNavigation({
  activeScene,
  copy,
  onNavigate,
}: {
  activeScene: SceneId;
  copy: LocalizedCopy;
  onNavigate?: (scene: number, beat: number) => void;
}) {
  const navigate = (target: SceneId) => onNavigate?.(target, 0);
  const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    event.stopPropagation();
    let target: SceneId | undefined;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      target = Math.min(5, activeScene + 1) as SceneId;
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      target = Math.max(1, activeScene - 1) as SceneId;
    } else if (event.key === "Home") {
      target = 1;
    } else if (event.key === "End") {
      target = 5;
    }
    if (target) {
      event.preventDefault();
      navigate(target);
    }
  };

  return (
    <nav
      aria-label={copy.nav.aria}
      className={styles.issueNav}
      data-topic-navigation="true"
      data-navigation-geometry="typographic-index"
      data-navigation-carrier="ozone-issue-states"
      data-navigation-invocation="keyboard-focus"
      data-navigation-feedback="mechanical-displacement"
      onClick={(event) => event.stopPropagation()}
      onKeyDown={handleKeyDown}
      onPointerDown={(event) => event.stopPropagation()}
      tabIndex={0}
    >
      <span className={styles.navHint}>{copy.nav.hint}</span>
      <div className={styles.navIndex}>
        {SCENE_IDS.map((sceneId) => (
          <button
            aria-current={sceneId === activeScene ? "step" : undefined}
            aria-label={`${copy.nav.open} ${sceneId}`}
            className={styles.navButton}
            data-active={sceneId === activeScene ? "true" : "false"}
            key={sceneId}
            onClick={(event) => {
              event.stopPropagation();
              navigate(sceneId);
            }}
            type="button"
          >
            <span>{String(sceneId).padStart(2, "0")}</span>
            <strong>{copy.scenes[sceneId].tab}</strong>
          </button>
        ))}
      </div>
    </nav>
  );
}

function metadataScenes(language: Language): TopicMetadata["scenes"] {
  return SCENE_IDS.map((sceneId) => ({
    id: sceneId,
    title: COPY[language].scenes[sceneId].tab,
    beats: COPY[language].scenes[sceneId].beats,
  }));
}

function buildMetadata(language: Language): TopicMetadata {
  return {
    theme: language === "zh" ? "臭氧洞：证据闭环" : "Ozone Hole: Evidence Closed",
    densityLabel: language === "zh" ? "证据报告" : "Evidence report",
    heroScene: 2,
    colors: {
      bg: "#f6f8fa",
      ink: "#1f2328",
      panel: "#ffffff",
    },
    typography: {
      header: "Inter 700",
      body: "IBM Plex Mono 400",
    },
    tags: [
      "text-report",
      "issue-brief",
      "evidence",
      "atmospheric-science",
      "timeline",
      "reading-first",
    ],
    fonts: ["Inter", "IBM Plex Mono", "cjk:Noto Sans SC"],
    scenes: metadataScenes(language),
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
  const activeScene = clampScene(scene);
  const copy = COPY[language];
  const motionOff = reducedMotion || isThumbnail;

  return (
    <div
      className={styles.root}
      data-language={language}
      data-motion={motionOff ? "off" : "restrained"}
      data-testid="ozone-hole-root"
    >
      <div className={styles.shell}>
        <header className={styles.caseChrome}>
          <div className={styles.caseIdentity}>
            <div className={styles.caseLabelRow}>
              <span>{copy.caseLabel}</span>
              <code>{copy.reportType}</code>
            </div>
            <strong>{copy.casePath}</strong>
            <span>{copy.fixedStatus}</span>
          </div>
          {!isThumbnail ? (
            <IssueStateNavigation
              activeScene={activeScene}
              copy={copy}
              onNavigate={onNavigate}
            />
          ) : (
            <div className={styles.thumbnailStamp}>
              <span>{copy.currentLabel}</span>
              <strong>{copy.scenes[activeScene].tab}</strong>
            </div>
          )}
        </header>

        <SpatialSceneTrack
          beat={beat}
          beatLayoutModes={BEAT_LAYOUT_MODES}
          className={styles.track}
          reducedMotion={motionOff}
          renderScene={(sceneId, sceneBeat) => (
            <ScenePanel
              beat={sceneBeat}
              copy={copy}
              sceneId={clampScene(sceneId)}
            />
          )}
          scene={activeScene}
          sceneIds={[...SCENE_IDS]}
          transitionKind={INCOMING_TRANSITION_KIND[activeScene]}
          transitionMap={TRANSITION_MAP}
        />
      </div>
    </div>
  );
}

const metadata = {
  en: buildMetadata("en"),
  zh: buildMetadata("zh"),
} satisfies TopicDefinition["metadata"];

const NAVIGATION = {
  geometry: "typographic-index",
  carrier: "ozone-issue-states",
  invocation: "keyboard-focus",
  feedback: "mechanical-displacement",
} as const satisfies TopicNavigation;

export default defineTopic({
  id: "ozone-hole",
  styleId: "maintainer-issue-brief",
  title: {
    en: "Ozone Hole",
    zh: "臭氧洞",
  },
  modelId: "GPT 5.6 Sol",
  Stage: TopicStage,
  metadata,
  navigation: NAVIGATION,
  transitionScore: ozoneHoleTransitionScore,
  evidence: {
    kind: "mixed",
    sources: ozoneHoleSources,
    boundary: {
      en: COPY.en.chemistry.boundary,
      zh: COPY.zh.chemistry.boundary,
    },
    display: "stage",
  },
});

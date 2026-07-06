import { useEffect } from "react";
import type { CSSProperties } from "react";
import type { BespokeStyleProps, StyleMetadata } from "../types";
import SpatialSceneTrack from "./SpatialSceneTrack";
import type {
  BeatLayoutMode,
  SceneTransitionMap,
} from "./SpatialSceneTrack";
import { defineStyleVersion } from "./version";

type Lang = "en" | "zh";
type SceneId = 1 | 2 | 3 | 4 | 5;

interface MetricBlock {
  label: string;
  value: string;
  detail: string;
  score: string;
}

interface ComparisonRow {
  label: string;
  raw: string;
  clean: string;
  rule: string;
}

interface Clause {
  code: string;
  text: string;
  detail: string;
}

interface SceneCopy {
  eyebrow: string;
  title: string;
  subtitle: string;
  marginNote: string;
  footer: string;
  metrics: MetricBlock[];
  comparisons: ComparisonRow[];
  clauses: Clause[];
  stamp: string;
}

const SCENE_IDS: SceneId[] = [1, 2, 3, 4, 5];
const LAST_BEAT: Record<SceneId, number> = {
  1: 2,
  2: 3,
  3: 2,
  4: 3,
  5: 2,
};

const BEAT_LAYOUT_MODES: Record<SceneId, BeatLayoutMode> = {
  1: "reserved",
  2: "reserved",
  3: "reserved",
  4: "reserved",
  5: "reserved",
};

const TRANSITION_MAP: SceneTransitionMap = {
  "1->2": "wipe",
  "2->3": "slide-y",
  "3->4": "fade",
  "4->5": "hard-cut",
};

const EMPTY_SCENE_PARTS = {
  metrics: [],
  comparisons: [],
  clauses: [],
};

const COPY: Record<SceneId, Record<Lang, SceneCopy>> = {
  1: {
    en: {
      eyebrow: "Grid thesis",
      title: "Every metric earns a cell.",
      subtitle:
        "A dashboard is not a shelf. It is a measured surface for decisions.",
      marginNote: "One grid. One signal color. No ornamental data.",
      footer: "Noise is any number that cannot change the next action.",
      metrics: EMPTY_SCENE_PARTS.metrics,
      comparisons: EMPTY_SCENE_PARTS.comparisons,
      clauses: [
        {
          code: "G-01",
          text: "Lock the question before the chart.",
          detail: "Each row starts with the decision it supports.",
        },
        {
          code: "G-02",
          text: "Show variance, not volume.",
          detail: "More figures are allowed only when they remove doubt.",
        },
        {
          code: "G-03",
          text: "Reserve red for the current datum.",
          detail: "The accent marks where attention must land now.",
        },
      ],
      stamp: "Index",
    },
    zh: {
      eyebrow: "网格论点",
      title: "每个指标都必须占得住一格。",
      subtitle: "仪表盘不是货架，而是服务决策的测量平面。",
      marginNote: "一套网格。一种信号色。无装饰性数据。",
      footer: "不能改变下一步动作的数字，就是噪声。",
      metrics: EMPTY_SCENE_PARTS.metrics,
      comparisons: EMPTY_SCENE_PARTS.comparisons,
      clauses: [
        {
          code: "G-01",
          text: "先锁定问题，再画图表。",
          detail: "每一行先说明它支撑哪个决策。",
        },
        {
          code: "G-02",
          text: "展示差异，不堆数量。",
          detail: "只有能减少疑问的数字才允许增加。",
        },
        {
          code: "G-03",
          text: "红色只留给当前关键数据。",
          detail: "信号色只标记此刻必须看的位置。",
        },
      ],
      stamp: "索引",
    },
  },
  2: {
    en: {
      eyebrow: "Baseline",
      title: "Start with a stable reference line.",
      subtitle:
        "The baseline is a contract: same window, same denominator, same owner.",
      marginNote: "Baseline window: last 28 complete days",
      footer: "A metric without a baseline asks for interpretation twice.",
      metrics: [
        {
          label: "Activation",
          value: "42.8%",
          detail: "Users completing the first durable action",
          score: "68%",
        },
        {
          label: "Cycle time",
          value: "3.6 d",
          detail: "Median time from request to shipped answer",
          score: "54%",
        },
        {
          label: "Defect escape",
          value: "1.7%",
          detail: "Released work requiring correction",
          score: "31%",
        },
        {
          label: "Review load",
          value: "12.4 h",
          detail: "Human attention consumed per decision",
          score: "76%",
        },
      ],
      comparisons: EMPTY_SCENE_PARTS.comparisons,
      clauses: EMPTY_SCENE_PARTS.clauses,
      stamp: "Baseline",
    },
    zh: {
      eyebrow: "基线",
      title: "先建立稳定的参照线。",
      subtitle: "基线是一份契约：同一窗口、同一分母、同一负责人。",
      marginNote: "基线窗口：最近 28 个完整自然日",
      footer: "没有基线的指标，会让解释成本翻倍。",
      metrics: [
        {
          label: "激活率",
          value: "42.8%",
          detail: "完成第一个稳定动作的用户占比",
          score: "68%",
        },
        {
          label: "周期时间",
          value: "3.6 天",
          detail: "从请求到交付答案的中位时长",
          score: "54%",
        },
        {
          label: "缺陷逃逸",
          value: "1.7%",
          detail: "发布后仍需要修正的工作占比",
          score: "31%",
        },
        {
          label: "评审负载",
          value: "12.4 小时",
          detail: "每次决策消耗的人工注意力",
          score: "76%",
        },
      ],
      comparisons: EMPTY_SCENE_PARTS.comparisons,
      clauses: EMPTY_SCENE_PARTS.clauses,
      stamp: "基线",
    },
  },
  3: {
    en: {
      eyebrow: "Comparison",
      title: "Compare only what can move together.",
      subtitle:
        "Raw volume explains activity. Clean comparison explains whether the system improved.",
      marginNote: "Normalize before ranking",
      footer: "The table keeps scale honest before judgment begins.",
      metrics: EMPTY_SCENE_PARTS.metrics,
      comparisons: [
        {
          label: "Traffic",
          raw: "+18% sessions",
          clean: "+3% qualified starts",
          rule: "Keep only eligible demand.",
        },
        {
          label: "Speed",
          raw: "-11% average time",
          clean: "-22% p75 blocker time",
          rule: "Rank by blocked work, not all work.",
        },
        {
          label: "Quality",
          raw: "94% pass rate",
          clean: "2.1 fewer escapes",
          rule: "Prefer downstream correction avoided.",
        },
      ],
      clauses: EMPTY_SCENE_PARTS.clauses,
      stamp: "Clean",
    },
    zh: {
      eyebrow: "对比",
      title: "只比较能一起移动的对象。",
      subtitle: "原始量说明活动，清洗后的对比才说明系统是否变好。",
      marginNote: "排序前先归一化",
      footer: "表格先保证尺度诚实，再开始判断。",
      metrics: EMPTY_SCENE_PARTS.metrics,
      comparisons: [
        {
          label: "流量",
          raw: "会话 +18%",
          clean: "合格开始 +3%",
          rule: "只保留符合条件的需求。",
        },
        {
          label: "速度",
          raw: "平均时长 -11%",
          clean: "P75 阻塞时长 -22%",
          rule: "按阻塞工作排序，而非所有工作。",
        },
        {
          label: "质量",
          raw: "通过率 94%",
          clean: "逃逸缺陷少 2.1 个",
          rule: "优先看下游返工是否减少。",
        },
      ],
      clauses: EMPTY_SCENE_PARTS.clauses,
      stamp: "清洗",
    },
  },
  4: {
    en: {
      eyebrow: "Decision table",
      title: "The table decides what survives.",
      subtitle:
        "A metric stays only when it has a threshold, an owner, and a next action.",
      marginNote: "Decision gate: keep / watch / remove",
      footer: "The strongest dashboard is usually shorter after review.",
      metrics: EMPTY_SCENE_PARTS.metrics,
      comparisons: [
        {
          label: "Activation",
          raw: "Threshold 40%",
          clean: "Owner Growth",
          rule: "Keep",
        },
        {
          label: "Cycle time",
          raw: "Threshold 4 d",
          clean: "Owner Ops",
          rule: "Keep",
        },
        {
          label: "Review load",
          raw: "No agreed limit",
          clean: "Owner missing",
          rule: "Watch",
        },
        {
          label: "Page views",
          raw: "No decision link",
          clean: "No owner",
          rule: "Remove",
        },
      ],
      clauses: EMPTY_SCENE_PARTS.clauses,
      stamp: "Gate",
    },
    zh: {
      eyebrow: "决策表",
      title: "由表格决定哪些指标留下。",
      subtitle: "只有同时具备阈值、负责人和下一步动作的指标才能保留。",
      marginNote: "决策门：保留 / 观察 / 移除",
      footer: "最强的仪表盘，通常在评审后更短。",
      metrics: EMPTY_SCENE_PARTS.metrics,
      comparisons: [
        {
          label: "激活率",
          raw: "阈值 40%",
          clean: "负责人 增长",
          rule: "保留",
        },
        {
          label: "周期时间",
          raw: "阈值 4 天",
          clean: "负责人 运营",
          rule: "保留",
        },
        {
          label: "评审负载",
          raw: "未约定上限",
          clean: "负责人缺失",
          rule: "观察",
        },
        {
          label: "页面浏览",
          raw: "无决策关联",
          clean: "无负责人",
          rule: "移除",
        },
      ],
      clauses: EMPTY_SCENE_PARTS.clauses,
      stamp: "门禁",
    },
  },
  5: {
    en: {
      eyebrow: "Signed-off rule",
      title: "Ship the rule, not the dashboard.",
      subtitle:
        "The final artifact is a compact operating rule that tells the team when to act.",
      marginNote: "Signed off after noise removal",
      footer: "Metrics Without Noise / v2",
      metrics: EMPTY_SCENE_PARTS.metrics,
      comparisons: EMPTY_SCENE_PARTS.comparisons,
      clauses: [
        {
          code: "R-01",
          text: "Read the baseline before the current value.",
          detail: "Current values have no authority alone.",
        },
        {
          code: "R-02",
          text: "Escalate only when threshold and owner are present.",
          detail: "Attention follows accountability.",
        },
        {
          code: "R-03",
          text: "Delete any metric unused for two reviews.",
          detail: "Silence is a stronger signal than archive clutter.",
        },
      ],
      stamp: "Approved",
    },
    zh: {
      eyebrow: "签核规则",
      title: "交付规则，而不是仪表盘。",
      subtitle: "最终产物是一条紧凑的运行规则，说明团队何时行动。",
      marginNote: "噪声移除后签核",
      footer: "无噪声指标 / v2",
      metrics: EMPTY_SCENE_PARTS.metrics,
      comparisons: EMPTY_SCENE_PARTS.comparisons,
      clauses: [
        {
          code: "R-01",
          text: "先读基线，再读当前值。",
          detail: "当前值不能单独拥有解释权。",
        },
        {
          code: "R-02",
          text: "只有阈值和负责人齐备时才升级。",
          detail: "注意力必须跟随责任。",
        },
        {
          code: "R-03",
          text: "连续两次评审未使用的指标必须删除。",
          detail: "沉默比档案堆积更有信号价值。",
        },
      ],
      stamp: "已批准",
    },
  },
};

const METADATA_SCENES: Record<Lang, StyleMetadata["scenes"]> = {
  en: [
    {
      id: 1,
      title: "Grid thesis",
      beats: [
        {
          id: 0,
          action: "Place the core thesis on the visible grid",
          title: "Every metric earns a cell.",
          body: "The surface is designed for decisions, not display.",
        },
        {
          id: 1,
          action: "Reveal the three grid rules",
          title: "Question, variance, signal",
          body: "Each rule removes a common source of metric noise.",
        },
        {
          id: 2,
          action: "Mark the single signal-color wayfinding datum",
          title: "One accent, one function",
          body: "Red marks the current point of attention only.",
        },
      ],
    },
    {
      id: 2,
      title: "Baseline",
      beats: [
        {
          id: 0,
          action: "Reveal activation against the baseline",
          title: "Activation",
          body: "The first durable action defines the denominator.",
        },
        {
          id: 1,
          action: "Reveal cycle time as the second reference",
          title: "Cycle time",
          body: "The baseline turns movement into comparable work.",
        },
        {
          id: 2,
          action: "Reveal defect escape",
          title: "Defect escape",
          body: "Downstream corrections expose hidden quality cost.",
        },
        {
          id: 3,
          action: "Reveal review load and complete the baseline set",
          title: "Review load",
          body: "Attention consumed becomes a first-class metric.",
        },
      ],
    },
    {
      id: 3,
      title: "Comparison",
      beats: [
        {
          id: 0,
          action: "Compare raw and clean traffic measures",
          title: "Traffic",
          body: "Eligible demand replaces broad activity volume.",
        },
        {
          id: 1,
          action: "Compare speed measures",
          title: "Speed",
          body: "Blocked work is ranked ahead of average work.",
        },
        {
          id: 2,
          action: "Compare quality measures",
          title: "Quality",
          body: "Escaped corrections are more useful than pass-rate gloss.",
        },
      ],
    },
    {
      id: 4,
      title: "Decision table",
      beats: [
        {
          id: 0,
          action: "Keep activation because threshold and owner exist",
          title: "Keep activation",
          body: "The metric has a threshold, owner, and action.",
        },
        {
          id: 1,
          action: "Keep cycle time",
          title: "Keep cycle time",
          body: "The operating threshold is clear enough to act.",
        },
        {
          id: 2,
          action: "Place review load under watch",
          title: "Watch review load",
          body: "A missing limit prevents direct escalation.",
        },
        {
          id: 3,
          action: "Remove page views",
          title: "Remove page views",
          body: "No decision link means the number is noise.",
        },
      ],
    },
    {
      id: 5,
      title: "Signed-off rule",
      beats: [
        {
          id: 0,
          action: "State the operating rule",
          title: "Ship the rule",
          body: "The dashboard is secondary to the action rule.",
        },
        {
          id: 1,
          action: "Reveal the three signed clauses",
          title: "Three clauses",
          body: "Baseline, accountability, and deletion govern the metric set.",
        },
        {
          id: 2,
          action: "Apply the final sign-off mark",
          title: "Approved",
          body: "The rule is ready for recurring review.",
        },
      ],
    },
  ],
  zh: [
    {
      id: 1,
      title: "网格论点",
      beats: [
        {
          id: 0,
          action: "把核心论点放入可见网格",
          title: "每个指标都必须占得住一格。",
          body: "这个平面服务决策，而不是展示。",
        },
        {
          id: 1,
          action: "揭示三条网格规则",
          title: "问题、差异、信号",
          body: "每条规则都移除一类常见指标噪声。",
        },
        {
          id: 2,
          action: "标记唯一信号色的导向功能",
          title: "一种强调色，一个功能",
          body: "红色只标记当前注意力位置。",
        },
      ],
    },
    {
      id: 2,
      title: "基线",
      beats: [
        {
          id: 0,
          action: "揭示激活率与基线关系",
          title: "激活率",
          body: "第一个稳定动作定义分母。",
        },
        {
          id: 1,
          action: "揭示周期时间作为第二条参照",
          title: "周期时间",
          body: "基线把移动变成可比较的工作。",
        },
        {
          id: 2,
          action: "揭示缺陷逃逸",
          title: "缺陷逃逸",
          body: "下游修正暴露隐藏质量成本。",
        },
        {
          id: 3,
          action: "揭示评审负载并完成基线组",
          title: "评审负载",
          body: "被消耗的注意力成为一等指标。",
        },
      ],
    },
    {
      id: 3,
      title: "对比",
      beats: [
        {
          id: 0,
          action: "比较原始流量和清洗后的流量",
          title: "流量",
          body: "合格需求取代宽泛活动量。",
        },
        {
          id: 1,
          action: "比较速度指标",
          title: "速度",
          body: "阻塞工作优先于平均工作排序。",
        },
        {
          id: 2,
          action: "比较质量指标",
          title: "质量",
          body: "逃逸修正比通过率光泽更有用。",
        },
      ],
    },
    {
      id: 4,
      title: "决策表",
      beats: [
        {
          id: 0,
          action: "因为阈值和负责人齐备而保留激活率",
          title: "保留激活率",
          body: "该指标具备阈值、负责人和动作。",
        },
        {
          id: 1,
          action: "保留周期时间",
          title: "保留周期时间",
          body: "运行阈值足够清晰，可以采取动作。",
        },
        {
          id: 2,
          action: "把评审负载设为观察",
          title: "观察评审负载",
          body: "缺少上限会阻止直接升级。",
        },
        {
          id: 3,
          action: "移除页面浏览",
          title: "移除页面浏览",
          body: "没有决策关联，数字就是噪声。",
        },
      ],
    },
    {
      id: 5,
      title: "签核规则",
      beats: [
        {
          id: 0,
          action: "声明运行规则",
          title: "交付规则",
          body: "仪表盘从属于行动规则。",
        },
        {
          id: 1,
          action: "揭示三条签核条款",
          title: "三条规则",
          body: "基线、责任和删除共同治理指标集。",
        },
        {
          id: 2,
          action: "盖上最终签核标记",
          title: "已批准",
          body: "规则可以进入周期性评审。",
        },
      ],
    },
  ],
};

function useFonts() {
  useEffect(() => {
    if (typeof document === "undefined") return;
    const id = "style-02-metrics-without-noise-v2-fonts";
    if (document.getElementById(id)) return;

    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Noto+Sans+SC:wght@400;500;700;800&display=swap";
    document.head.appendChild(link);
  }, []);
}

function normalizeScene(scene: number): SceneId {
  return SCENE_IDS.includes(scene as SceneId) ? (scene as SceneId) : 1;
}

function normalizeBeat(scene: SceneId, beat: number): number {
  return Math.max(0, Math.min(beat, LAST_BEAT[scene]));
}

function revealFrom(beat: number, threshold: number) {
  return {
    "data-revealed": beat >= threshold ? "true" : "false",
    "aria-hidden": beat >= threshold ? undefined : true,
  };
}

function gridLineStyle(index: number, total: number): CSSProperties {
  return { "--grid-line-position": `${(index / total) * 100}%` } as CSSProperties;
}

function scoreStyle(score: string, delayStep: number): CSSProperties {
  return {
    "--metric-score": score,
    "--reveal-delay": `${delayStep * 0.04}s`,
  } as CSSProperties;
}

function GridChrome() {
  return (
    <div className="fhs02v2GridChrome" aria-hidden="true">
      {Array.from({ length: 13 }, (_, index) => (
        <i
          key={`v-${index}`}
          className="fhs02v2GridLine fhs02v2GridLineVertical"
          style={gridLineStyle(index, 12)}
        />
      ))}
      {Array.from({ length: 10 }, (_, index) => (
        <i
          key={`h-${index}`}
          className="fhs02v2GridLine fhs02v2GridLineHorizontal"
          style={gridLineStyle(index, 9)}
        />
      ))}
    </div>
  );
}

function GridIndexNav({
  activeScene,
  onNavigate,
}: {
  activeScene: SceneId;
  onNavigate?: (scene: number, beat: number) => void;
}) {
  return (
    <nav className="fhs02v2IndexNav" aria-label="Scene grid index">
      {SCENE_IDS.map((sceneId) => (
        <button
          key={sceneId}
          type="button"
          aria-label={`Scene ${sceneId}`}
          aria-current={activeScene === sceneId ? "step" : undefined}
          className="fhs02v2IndexButton"
          onClick={() => onNavigate?.(sceneId, 0)}
        >
          {String(sceneId).padStart(2, "0")}
        </button>
      ))}
    </nav>
  );
}

function ScenePanel({
  sceneId,
  beat,
  language,
  isActive,
}: {
  sceneId: SceneId;
  beat: number;
  language: Lang;
  isActive: boolean;
}) {
  const copy = COPY[sceneId][language];

  return (
    <section
      className={`fhs02v2Scene fhs02v2Scene${sceneId}`}
      data-scene={sceneId}
      data-panel-active={isActive ? "true" : "false"}
      data-beat-layout-container="true"
      data-beat-layout-mode="reserved"
      aria-label={copy.eyebrow}
    >
      <header className="fhs02v2Header" data-beat-layout-item="true">
        <p className="fhs02v2Eyebrow">{copy.eyebrow}</p>
        <p className="fhs02v2SceneNumber">0{sceneId}</p>
      </header>
      <aside className="fhs02v2MarginNote" data-beat-layout-item="true">
        <span>{copy.marginNote}</span>
      </aside>
      {sceneId === 1 && <ThesisScene copy={copy} beat={beat} />}
      {sceneId === 2 && <BaselineScene copy={copy} beat={beat} />}
      {sceneId === 3 && <ComparisonScene copy={copy} beat={beat} />}
      {sceneId === 4 && <DecisionScene copy={copy} beat={beat} />}
      {sceneId === 5 && <SignedRuleScene copy={copy} beat={beat} />}
      <footer className="fhs02v2Footer" data-beat-layout-item="true">
        {copy.footer}
      </footer>
    </section>
  );
}

function ThesisScene({ copy, beat }: { copy: SceneCopy; beat: number }) {
  return (
    <div className="fhs02v2Thesis fhs02v2ContentGrid">
      <div className="fhs02v2TitleBlock" data-beat-layout-item="true">
        <h1 className="fhs02v2Title">{copy.title}</h1>
        <p className="fhs02v2Subtitle">{copy.subtitle}</p>
      </div>
      <div
        className="fhs02v2RuleStack fhs02v2Reveal"
        data-beat-layout-item="true"
        {...revealFrom(beat, 1)}
      >
        {copy.clauses.map((clause) => (
          <article className="fhs02v2RuleRow" key={clause.code}>
            <strong>{clause.code}</strong>
            <span>{clause.text}</span>
            <small>{clause.detail}</small>
          </article>
        ))}
      </div>
      <div
        className="fhs02v2SignalPanel fhs02v2Reveal"
        data-beat-layout-item="true"
        {...revealFrom(beat, 2)}
      >
        <span>{copy.stamp}</span>
        <strong>02 / v2</strong>
      </div>
    </div>
  );
}

function BaselineScene({ copy, beat }: { copy: SceneCopy; beat: number }) {
  return (
    <div className="fhs02v2Baseline fhs02v2ContentGrid">
      <div className="fhs02v2TitleBlock" data-beat-layout-item="true">
        <h1 className="fhs02v2Title">{copy.title}</h1>
        <p className="fhs02v2Subtitle">{copy.subtitle}</p>
      </div>
      <div className="fhs02v2MetricGrid" data-beat-layout-item="true">
        {copy.metrics.map((metric, index) => (
          <article
            className="fhs02v2MetricCard fhs02v2Reveal"
            key={metric.label}
            data-beat-layout-item="true"
            style={scoreStyle(metric.score, index)}
            {...revealFrom(beat, index)}
          >
            <p>{metric.label}</p>
            <strong>{metric.value}</strong>
            <span>{metric.detail}</span>
            <i aria-hidden="true" />
          </article>
        ))}
      </div>
    </div>
  );
}

function ComparisonScene({ copy, beat }: { copy: SceneCopy; beat: number }) {
  return (
    <div className="fhs02v2Comparison fhs02v2ContentGrid">
      <div className="fhs02v2TitleBlock" data-beat-layout-item="true">
        <h1 className="fhs02v2Title">{copy.title}</h1>
        <p className="fhs02v2Subtitle">{copy.subtitle}</p>
      </div>
      <div className="fhs02v2CompareTable" data-beat-layout-item="true">
        <div className="fhs02v2CompareHeader" aria-hidden="true">
          <span>Raw</span>
          <span>Clean</span>
          <span>Rule</span>
        </div>
        {copy.comparisons.map((row, index) => (
          <article
            className="fhs02v2CompareRow fhs02v2Reveal"
            key={row.label}
            data-beat-layout-item="true"
            {...revealFrom(beat, index)}
          >
            <strong>{row.label}</strong>
            <span>{row.raw}</span>
            <span>{row.clean}</span>
            <span>{row.rule}</span>
          </article>
        ))}
      </div>
    </div>
  );
}

function DecisionScene({ copy, beat }: { copy: SceneCopy; beat: number }) {
  return (
    <div className="fhs02v2Decision fhs02v2ContentGrid">
      <div className="fhs02v2TitleBlock" data-beat-layout-item="true">
        <h1 className="fhs02v2Title">{copy.title}</h1>
        <p className="fhs02v2Subtitle">{copy.subtitle}</p>
      </div>
      <div
        className="fhs02v2DecisionTable"
        data-beat-layout-item="true"
        role="table"
        aria-label={copy.eyebrow}
      >
        {copy.comparisons.map((row, index) => (
          <article
            className="fhs02v2DecisionRow fhs02v2Reveal"
            key={row.label}
            data-beat-layout-item="true"
            role="row"
            {...revealFrom(beat, index)}
          >
            <strong role="cell">{row.label}</strong>
            <span role="cell">{row.raw}</span>
            <span role="cell">{row.clean}</span>
            <mark role="cell">{row.rule}</mark>
          </article>
        ))}
      </div>
    </div>
  );
}

function SignedRuleScene({ copy, beat }: { copy: SceneCopy; beat: number }) {
  return (
    <div className="fhs02v2Signed fhs02v2ContentGrid">
      <div className="fhs02v2TitleBlock" data-beat-layout-item="true">
        <h1 className="fhs02v2Title">{copy.title}</h1>
        <p className="fhs02v2Subtitle">{copy.subtitle}</p>
      </div>
      <div
        className="fhs02v2ClauseLedger fhs02v2Reveal"
        data-beat-layout-item="true"
        {...revealFrom(beat, 1)}
      >
        {copy.clauses.map((clause) => (
          <article className="fhs02v2Clause" key={clause.code}>
            <strong>{clause.code}</strong>
            <span>{clause.text}</span>
            <small>{clause.detail}</small>
          </article>
        ))}
      </div>
      <div
        className="fhs02v2Approval fhs02v2Reveal"
        data-beat-layout-item="true"
        {...revealFrom(beat, 2)}
      >
        {copy.stamp}
      </div>
    </div>
  );
}

export function getMetadata(lang: Lang): StyleMetadata {
  return {
    id: "02",
    band: "minimal-keynote",
    name: lang === "zh" ? "客观瑞士网格" : "Objective Swiss Grid",
    theme: lang === "zh" ? "无噪声指标" : "Metrics Without Noise",
    densityLabel: lang === "zh" ? "高密度 / 精准" : "Dense / Precise",
    heroScene: 1,
    colors: {
      bg: "#f6f5ef",
      ink: "#111111",
      panel: "#e5e1d8",
    },
    typography: {
      header: "Inter 800",
      body: "Inter 500",
    },
    tags: ["swiss", "grid", "metrics", "objective", "minimal"],
    fonts: ["Inter", "cjk:Noto Sans SC"],
    scenes: METADATA_SCENES[lang],
  };
}

export default function MetricsWithoutNoiseV2({
  scene,
  beat,
  language,
  isThumbnail,
  reducedMotion,
  onNavigate,
}: BespokeStyleProps) {
  useFonts();

  const activeScene = normalizeScene(scene);
  const motionOff = reducedMotion || isThumbnail;
  const activeBeat = isThumbnail
    ? LAST_BEAT[activeScene]
    : normalizeBeat(activeScene, beat);
  const rootClassName = `fhs02v2Root${motionOff ? " fhs02v2NoMotion" : ""}`;

  return (
    <div
      className={rootClassName}
      data-style-id="02"
      data-style-version="v2"
      data-thumbnail={isThumbnail ? "true" : undefined}
      lang={language}
    >
      <style>{SWISS_GRID_STYLES}</style>
      <GridChrome />
      <SpatialSceneTrack
        scene={activeScene}
        beat={activeBeat}
        sceneIds={SCENE_IDS}
        transitionKind="wipe"
        transitionMap={TRANSITION_MAP}
        transitionDurationMs={620}
        reducedMotion={motionOff}
        beatLayoutModes={BEAT_LAYOUT_MODES}
        className="fhs02v2Track"
        renderScene={(trackScene, trackBeat, isActive) => {
          const sceneId = normalizeScene(trackScene);
          const safeBeat = isThumbnail
            ? LAST_BEAT[sceneId]
            : normalizeBeat(sceneId, trackBeat);
          return (
            <ScenePanel
              sceneId={sceneId}
              beat={safeBeat}
              language={language}
              isActive={isActive}
            />
          );
        }}
      />
      {!isThumbnail && (
        <GridIndexNav activeScene={activeScene} onNavigate={onNavigate} />
      )}
    </div>
  );
}

export const metricsWithoutNoiseV2Version = defineStyleVersion({
  id: "v2",
  topic: "Metrics Without Noise",
  model: "GPT-5",
  component: MetricsWithoutNoiseV2,
  getMetadata,
});

const SWISS_GRID_STYLES = `
.fhs02v2Root {
  --style-02-bg: #f6f5ef;
  --style-02-ink: #111111;
  --style-02-muted: #6b6b66;
  --style-02-grid: rgba(17, 17, 17, 0.16);
  --style-02-rule: rgba(17, 17, 17, 0.34);
  --style-02-panel: rgba(17, 17, 17, 0.045);
  --style-02-signal: #d32f2f;
  container-type: size;
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: var(--style-02-bg);
  color: var(--style-02-ink);
  font-family: "Inter", "Noto Sans SC", "Helvetica Neue", Arial, sans-serif;
  letter-spacing: 0;
  isolation: isolate;
}

.fhs02v2Root * {
  box-sizing: border-box;
}

.fhs02v2Track {
  position: absolute;
  inset: 0;
  z-index: 2;
}

.fhs02v2GridChrome {
  position: absolute;
  inset: 6.2cqh 5.2cqw 6.2cqh 8.4cqw;
  z-index: 1;
  pointer-events: none;
}

.fhs02v2GridLine {
  position: absolute;
  display: block;
  background: transparent;
}

.fhs02v2GridLineVertical {
  top: 0;
  bottom: 0;
  left: var(--grid-line-position);
  border-left: 0.045cqw solid var(--style-02-grid);
}

.fhs02v2GridLineHorizontal {
  left: 0;
  right: 0;
  top: var(--grid-line-position);
  border-top: 0.07cqh solid var(--style-02-grid);
}

.fhs02v2Scene {
  position: absolute;
  inset: 0;
  display: grid;
  grid-template-columns: 8.4cqw repeat(12, 1fr) 5.2cqw;
  grid-template-rows: 6.2cqh 9.4cqh 1fr 6.2cqh;
  column-gap: 1.1cqw;
  color: var(--style-02-ink);
  background: var(--style-02-bg);
}

.fhs02v2Header {
  grid-column: 2 / 14;
  grid-row: 2;
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  column-gap: 1.1cqw;
  align-items: start;
  border-top: 0.11cqh solid var(--style-02-ink);
  padding-top: 1.1cqh;
}

.fhs02v2Eyebrow,
.fhs02v2SceneNumber,
.fhs02v2MarginNote,
.fhs02v2Footer {
  margin: 0;
  color: var(--style-02-muted);
  font-size: 0.96cqw;
  line-height: 1.15;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0;
}

.fhs02v2Eyebrow {
  grid-column: 1 / 5;
}

.fhs02v2SceneNumber {
  grid-column: 12 / 13;
  justify-self: end;
  color: var(--style-02-signal);
}

.fhs02v2MarginNote {
  grid-column: 2 / 4;
  grid-row: 3;
  align-self: start;
  display: flex;
  min-height: 12cqh;
  border-top: 0.11cqh solid var(--style-02-rule);
  padding-top: 1.2cqh;
}

.fhs02v2MarginNote span {
  max-width: 11cqw;
}

.fhs02v2Footer {
  grid-column: 2 / 14;
  grid-row: 4;
  align-self: start;
  border-top: 0.11cqh solid var(--style-02-rule);
  padding-top: 1cqh;
}

.fhs02v2ContentGrid {
  grid-column: 4 / 14;
  grid-row: 3;
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  grid-template-rows: repeat(8, 1fr);
  column-gap: 1.1cqw;
  row-gap: 1.35cqh;
  min-height: 64cqh;
}

.fhs02v2TitleBlock {
  grid-column: 1 / 7;
  grid-row: 1 / 4;
  align-self: start;
}

.fhs02v2Title {
  margin: 0;
  max-width: 58cqw;
  font-size: 5.35cqw;
  line-height: 0.94;
  font-weight: 800;
  letter-spacing: 0;
}

.fhs02v2Subtitle {
  margin: 2.1cqh 0 0;
  max-width: 42cqw;
  font-size: 1.32cqw;
  line-height: 1.28;
  font-weight: 500;
  color: var(--style-02-muted);
  letter-spacing: 0;
}

:lang(zh) .fhs02v2Title {
  font-size: 4.45cqw;
  line-height: 1.04;
  font-weight: 800;
}

:lang(zh) .fhs02v2Subtitle {
  font-size: 1.24cqw;
  line-height: 1.38;
}

.fhs02v2Reveal {
  opacity: 0;
  visibility: hidden;
  transform: translateY(0.8cqh);
  transition:
    opacity 220ms linear var(--reveal-delay, 0s),
    transform 220ms linear var(--reveal-delay, 0s),
    visibility 0s linear 220ms;
}

.fhs02v2Reveal[data-revealed="true"] {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
  transition:
    opacity 220ms linear var(--reveal-delay, 0s),
    transform 220ms linear var(--reveal-delay, 0s),
    visibility 0s linear 0s;
}

.fhs02v2NoMotion .fhs02v2Reveal,
.fhs02v2NoMotion .fhs02v2Reveal[data-revealed="true"] {
  transition-duration: 0s;
  animation-duration: 0s;
  transform: none;
}

.fhs02v2RuleStack {
  grid-column: 7 / 11;
  grid-row: 1 / 7;
  display: grid;
  grid-template-rows: repeat(3, 1fr);
  border-top: 0.18cqh solid var(--style-02-signal);
}

.fhs02v2RuleRow {
  display: grid;
  grid-template-columns: 4.8cqw 1fr;
  grid-template-rows: auto 1fr;
  column-gap: 1cqw;
  border-bottom: 0.11cqh solid var(--style-02-rule);
  padding: 1.5cqh 0 1.2cqh;
}

.fhs02v2RuleRow strong,
.fhs02v2Clause strong {
  color: var(--style-02-signal);
  font-size: 1.05cqw;
  line-height: 1.05;
  font-weight: 800;
  letter-spacing: 0;
}

.fhs02v2RuleRow span,
.fhs02v2Clause span {
  font-size: 1.35cqw;
  line-height: 1.12;
  font-weight: 700;
  letter-spacing: 0;
}

.fhs02v2RuleRow small,
.fhs02v2Clause small {
  grid-column: 2;
  margin-top: 0.75cqh;
  color: var(--style-02-muted);
  font-size: 0.98cqw;
  line-height: 1.22;
  font-weight: 500;
  letter-spacing: 0;
}

.fhs02v2SignalPanel {
  grid-column: 7 / 11;
  grid-row: 7 / 9;
  display: flex;
  align-items: end;
  justify-content: space-between;
  border-top: 0.4cqh solid var(--style-02-signal);
  color: var(--style-02-signal);
  padding-top: 1.3cqh;
}

.fhs02v2SignalPanel span,
.fhs02v2SignalPanel strong {
  font-size: 1.6cqw;
  line-height: 1;
  font-weight: 800;
  letter-spacing: 0;
}

.fhs02v2MetricGrid {
  grid-column: 1 / 11;
  grid-row: 4 / 9;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  column-gap: 1.1cqw;
  align-items: stretch;
}

.fhs02v2MetricCard {
  display: grid;
  grid-template-rows: 4.3cqh 9.6cqh 1fr 2cqh;
  min-height: 31cqh;
  border-top: 0.18cqh solid var(--style-02-ink);
  border-bottom: 0.11cqh solid var(--style-02-rule);
  background: var(--style-02-panel);
  padding: 1.5cqh 1.1cqw 1.25cqh;
}

.fhs02v2MetricCard p,
.fhs02v2MetricCard span {
  margin: 0;
  color: var(--style-02-muted);
  font-size: 0.98cqw;
  line-height: 1.18;
  font-weight: 600;
  letter-spacing: 0;
}

.fhs02v2MetricCard strong {
  display: block;
  margin: 0;
  font-size: 4.05cqw;
  line-height: 0.95;
  font-weight: 800;
  letter-spacing: 0;
}

:lang(zh) .fhs02v2MetricCard strong {
  font-size: 3.35cqw;
}

.fhs02v2MetricCard i {
  align-self: end;
  display: block;
  height: 0.62cqh;
  width: var(--metric-score);
  background: var(--style-02-signal);
}

.fhs02v2Comparison .fhs02v2TitleBlock {
  grid-column: 1 / 6;
}

.fhs02v2CompareTable {
  grid-column: 1 / 11;
  grid-row: 4 / 9;
  display: grid;
  grid-template-rows: 4.8cqh repeat(3, 1fr);
  border-top: 0.18cqh solid var(--style-02-ink);
}

.fhs02v2CompareHeader,
.fhs02v2CompareRow {
  display: grid;
  grid-template-columns: 2fr 2.2fr 2.2fr 3fr;
  column-gap: 1.1cqw;
  align-items: center;
}

.fhs02v2CompareHeader {
  grid-template-columns: 2fr 2.2fr 2.2fr 3fr;
  border-bottom: 0.11cqh solid var(--style-02-rule);
}

.fhs02v2CompareHeader span {
  color: var(--style-02-muted);
  font-size: 0.9cqw;
  line-height: 1;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0;
}

.fhs02v2CompareHeader span:first-child {
  grid-column: 2;
}

.fhs02v2CompareRow {
  border-bottom: 0.11cqh solid var(--style-02-rule);
}

.fhs02v2CompareRow strong,
.fhs02v2DecisionRow strong {
  color: var(--style-02-signal);
  font-size: 1.22cqw;
  line-height: 1.1;
  font-weight: 800;
  letter-spacing: 0;
}

.fhs02v2CompareRow span,
.fhs02v2DecisionRow span {
  color: var(--style-02-ink);
  font-size: 1.24cqw;
  line-height: 1.18;
  font-weight: 600;
  letter-spacing: 0;
}

.fhs02v2CompareRow span:last-child {
  color: var(--style-02-muted);
  font-size: 1.02cqw;
  font-weight: 600;
}

.fhs02v2Decision .fhs02v2TitleBlock {
  grid-column: 1 / 7;
  grid-row: 1 / 3;
}

.fhs02v2DecisionTable {
  grid-column: 1 / 11;
  grid-row: 3 / 9;
  display: grid;
  grid-template-rows: repeat(4, 1fr);
  border-top: 0.18cqh solid var(--style-02-ink);
}

.fhs02v2DecisionRow {
  display: grid;
  grid-template-columns: 2.2fr 2.5fr 2.5fr 1.2fr;
  column-gap: 1.1cqw;
  align-items: center;
  border-bottom: 0.11cqh solid var(--style-02-rule);
}

.fhs02v2DecisionRow mark {
  display: inline-flex;
  justify-self: start;
  min-width: 6cqw;
  border: 0.11cqh solid var(--style-02-signal);
  color: var(--style-02-signal);
  background: transparent;
  font-size: 1.05cqw;
  line-height: 1;
  font-weight: 800;
  letter-spacing: 0;
  padding: 0.86cqh 0.8cqw;
  text-transform: uppercase;
}

.fhs02v2Signed .fhs02v2TitleBlock {
  grid-column: 1 / 8;
  grid-row: 1 / 4;
}

.fhs02v2ClauseLedger {
  grid-column: 1 / 8;
  grid-row: 4 / 9;
  display: grid;
  grid-template-rows: repeat(3, 1fr);
  border-top: 0.18cqh solid var(--style-02-ink);
}

.fhs02v2Clause {
  display: grid;
  grid-template-columns: 5.2cqw 1fr;
  grid-template-rows: auto 1fr;
  column-gap: 1.1cqw;
  border-bottom: 0.11cqh solid var(--style-02-rule);
  padding: 1.6cqh 0 1.15cqh;
}

.fhs02v2Approval {
  grid-column: 8 / 11;
  grid-row: 5 / 8;
  align-self: stretch;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 0.18cqh solid var(--style-02-signal);
  color: var(--style-02-signal);
  font-size: 2.75cqw;
  line-height: 1;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0;
}

:lang(zh) .fhs02v2Approval {
  font-size: 2.25cqw;
}

.fhs02v2IndexNav {
  position: absolute;
  z-index: 4;
  left: 2.1cqw;
  top: 20cqh;
  width: 3.6cqw;
  display: grid;
  grid-template-rows: repeat(5, 6.8cqh);
  border-top: 0.11cqh solid var(--style-02-rule);
}

.fhs02v2IndexButton {
  appearance: none;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  height: 100%;
  border: 0;
  border-bottom: 0.11cqh solid var(--style-02-rule);
  border-left: 0.18cqw solid transparent;
  background: transparent;
  color: var(--style-02-muted);
  font: inherit;
  font-size: 0.96cqw;
  line-height: 1;
  font-weight: 800;
  letter-spacing: 0;
  cursor: pointer;
  padding: 0 0 0 0.68cqw;
  transition:
    color 160ms linear,
    border-color 160ms linear;
}

.fhs02v2IndexButton:hover,
.fhs02v2IndexButton[aria-current="step"] {
  color: var(--style-02-signal);
  border-left-color: var(--style-02-signal);
}

.fhs02v2IndexButton:focus-visible {
  outline: 0.16cqw solid var(--style-02-signal);
  outline-offset: 0.18cqw;
}

.fhs02v2Root[data-thumbnail="true"] .fhs02v2Scene {
  grid-template-columns: 5.8cqw repeat(12, 1fr) 3.8cqw;
  grid-template-rows: 5cqh 8.2cqh 1fr 5cqh;
}

.fhs02v2Root[data-thumbnail="true"] .fhs02v2GridChrome {
  inset: 5cqh 3.8cqw 5cqh 5.8cqw;
}

.fhs02v2Root[data-thumbnail="true"] .fhs02v2MarginNote {
  display: none;
}

.fhs02v2Root[data-thumbnail="true"] .fhs02v2ContentGrid {
  grid-column: 2 / 14;
}
`;

import type { CSSProperties, ReactNode } from "react";
import { useEffect } from "react";
import {
  defineTopic,
  type TopicMetadata,
  type TopicStageProps,
  type TopicTransitionScore,
} from "../domain/topic";
import SpatialSceneTrack from "../styles/SpatialSceneTrack";
import type {
  BeatLayoutMode,
  SceneTransitionMap,
} from "../styles/SpatialSceneTrack";
import styles from "./durable-tool.module.css";

type Lang = "en" | "zh";
type CellState = "win" | "warn" | "risk" | "neutral";
type ContenderId = "suite" | "core" | "plain";
type CSSVars = CSSProperties & Record<`--${string}`, string | number>;

interface Localized {
  en: string;
  zh: string;
}

interface SceneCopy {
  eyebrow: Localized;
  title: Localized;
  summary: Localized;
  thesis: Localized;
  badge: Localized;
  beats: Array<{
    action: Localized;
    title: Localized;
    body: Localized;
  }>;
}

interface Criterion {
  id: string;
  label: Localized;
  signal: Localized;
  weight: string;
  scores: Record<
    ContenderId,
    {
      value: number;
      state: CellState;
      note: Localized;
    }
  >;
}

interface Contender {
  id: ContenderId;
  name: Localized;
  kind: Localized;
  points: Localized[];
}

const TRANSITION_SCORE = {
  "1->2": "fade",
  "2->3": "wipe",
  "3->4": "scale-fade",
  "4->5": "hard-cut",
} as const satisfies TopicTransitionScore;

const TRANSITION_MAP: SceneTransitionMap = TRANSITION_SCORE;

const BEAT_LAYOUT_MODES: Record<number, BeatLayoutMode> = {
  1: "reserved",
  2: "reserved",
  3: "reserved",
  4: "reserved",
  5: "reserved",
};

const SCENES: Record<number, SceneCopy> = {
  1: {
    eyebrow: { en: "Criteria", zh: "标准" },
    title: { en: "Durable beats convenient", zh: "耐用优先于顺手" },
    summary: {
      en: "The tool is judged by what survives maintenance, growth, and change.",
      zh: "工具按维护、增长、变化之后还能留下什么来评估。",
    },
    thesis: {
      en: "Five criteria separate short-term speed from long-term fit.",
      zh: "五个标准把短期速度和长期适配拆开。",
    },
    badge: { en: "Weighted lens", zh: "加权视角" },
    beats: [
      {
        action: { en: "Name the evaluation lens", zh: "命名评估视角" },
        title: { en: "Durability first", zh: "耐用性优先" },
        body: {
          en: "Convenience counts only after the system can be owned.",
          zh: "只有系统可被团队掌控后，便利性才计分。",
        },
      },
      {
        action: { en: "Reveal weighted criteria", zh: "展示加权标准" },
        title: { en: "Weights before options", zh: "先权重，后选项" },
        body: {
          en: "Maintenance and exit cost get heavier weight than launch speed.",
          zh: "维护和退出成本权重高于上线速度。",
        },
      },
      {
        action: { en: "Mark the non-negotiables", zh: "标出不可妥协项" },
        title: { en: "No orphaned knowledge", zh: "不能留下孤岛知识" },
        body: {
          en: "A winning tool must be explainable by the team, not just its adopter.",
          zh: "胜出的工具必须能被团队解释，而不只是被引入者理解。",
        },
      },
    ],
  },
  2: {
    eyebrow: { en: "Contenders", zh: "候选" },
    title: { en: "Three ways to buy speed", zh: "三种购买速度的方式" },
    summary: {
      en: "Each option wins one easy argument and carries one structural debt.",
      zh: "每个候选都有一个明显优势，也带着一个结构性债务。",
    },
    thesis: {
      en: "The comparison stays generic: category against category, not vendor against vendor.",
      zh: "比较保持通用：类别对类别，而不是供应商对供应商。",
    },
    badge: { en: "Option frame", zh: "选项框架" },
    beats: [
      {
        action: { en: "Reveal the integrated suite", zh: "展示集成套件" },
        title: { en: "Suite buys coordination", zh: "套件购买协同" },
        body: {
          en: "Strong defaults and one control plane, with real switching cost.",
          zh: "默认配置强、控制面统一，但切换成本真实存在。",
        },
      },
      {
        action: { en: "Reveal the open core option", zh: "展示开放核心" },
        title: { en: "Open core buys leverage", zh: "开放核心购买杠杆" },
        body: {
          en: "A stable center with extension points the team can own.",
          zh: "稳定核心加可扩展边界，团队可以接手。",
        },
      },
      {
        action: { en: "Reveal the plain stack", zh: "展示基础栈" },
        title: { en: "Plain stack buys clarity", zh: "基础栈购买清晰" },
        body: {
          en: "Transparent pieces, slower assembly, fewer hidden contracts.",
          zh: "组件透明、组装较慢，但隐藏契约更少。",
        },
      },
    ],
  },
  3: {
    eyebrow: { en: "Matrix reveal", zh: "矩阵揭示" },
    title: { en: "The score is a map, not a vote", zh: "分数是地图，不是投票" },
    summary: {
      en: "The winner is visible only after weak cells and exit paths are shown.",
      zh: "只有弱项和退出路径都可见后，胜者才成立。",
    },
    thesis: {
      en: "Rows reveal in order so the reader sees where confidence comes from.",
      zh: "逐行揭示，让读者看到信心来自哪里。",
    },
    badge: { en: "Weighted matrix", zh: "加权矩阵" },
    beats: [
      {
        action: { en: "Reveal ownership and maintenance", zh: "展示掌控和维护" },
        title: { en: "Ownership first", zh: "掌控优先" },
        body: {
          en: "The first rows expose who can repair the tool after adoption.",
          zh: "前两行暴露采用之后谁能修复工具。",
        },
      },
      {
        action: { en: "Reveal ecosystem and portability", zh: "展示生态和可迁移性" },
        title: { en: "Durability needs exits", zh: "耐用需要退路" },
        body: {
          en: "A strong tool keeps paths open while the team grows.",
          zh: "强工具会在团队增长时保留路径。",
        },
      },
      {
        action: { en: "Reveal governance", zh: "展示治理" },
        title: { en: "Rules close the matrix", zh: "规则完成矩阵" },
        body: {
          en: "Governance decides whether the score can stay true later.",
          zh: "治理决定分数之后是否还能成立。",
        },
      },
      {
        action: { en: "Promote the leading column", zh: "突出领先列" },
        title: { en: "Open core leads by resilience", zh: "开放核心以韧性领先" },
        body: {
          en: "It is not best at everything, but it fails in the most manageable way.",
          zh: "它不是所有项第一，但失败方式最可管理。",
        },
      },
    ],
  },
  4: {
    eyebrow: { en: "Tie-break", zh: "决胜" },
    title: { en: "Break the tie with failure mode", zh: "用失败方式打破平局" },
    summary: {
      en: "When scores are close, choose the option whose worst day is easiest to recover.",
      zh: "分数接近时，选择最坏一天最容易恢复的选项。",
    },
    thesis: {
      en: "The tie-break is not a sixth criterion; it is a stress test on the top two.",
      zh: "决胜不是第六个标准，而是对前两名的压力测试。",
    },
    badge: { en: "Stress view", zh: "压力视图" },
    beats: [
      {
        action: { en: "Compare recovery path", zh: "比较恢复路径" },
        title: { en: "Recovery beats polish", zh: "恢复优先于精致" },
        body: {
          en: "A polished suite can still be brittle when the owner leaves.",
          zh: "负责人离开时，精致套件仍可能变脆。",
        },
      },
      {
        action: { en: "Compare governance burden", zh: "比较治理负担" },
        title: { en: "The team must hold the rules", zh: "规则必须由团队持有" },
        body: {
          en: "A durable choice moves judgment into shared operating rules.",
          zh: "耐用选择会把判断迁移到共享运行规则里。",
        },
      },
      {
        action: { en: "Resolve the tie", zh: "解决平局" },
        title: { en: "Choose the recoverable path", zh: "选择可恢复路径" },
        body: {
          en: "Open core wins because its liabilities can be isolated and repaired.",
          zh: "开放核心胜出，因为它的负担可隔离、可修复。",
        },
      },
    ],
  },
  5: {
    eyebrow: { en: "Verdict", zh: "结论" },
    title: { en: "Pick open core, constrain it", zh: "选择开放核心，并约束它" },
    summary: {
      en: "The durable tool is not the loosest choice; it is the one with explicit guardrails.",
      zh: "耐用工具不是最松的选择，而是带明确护栏的选择。",
    },
    thesis: {
      en: "Verdict: choose the tool the team can maintain without hiding the cost.",
      zh: "结论：选择团队能维护、且不隐藏成本的工具。",
    },
    badge: { en: "Decision record", zh: "决策记录" },
    beats: [
      {
        action: { en: "State the winner", zh: "给出胜者" },
        title: { en: "Open core", zh: "开放核心" },
        body: {
          en: "Best balance of ownership, ecosystem, and recoverability.",
          zh: "在掌控、生态、可恢复性之间取得最好平衡。",
        },
      },
      {
        action: { en: "Add operating guardrails", zh: "加入运行护栏" },
        title: { en: "Guard the extensions", zh: "约束扩展" },
        body: {
          en: "Approve extensions through documented criteria, not enthusiasm.",
          zh: "扩展按文档化标准批准，而不是按热情批准。",
        },
      },
      {
        action: { en: "Schedule the review", zh: "安排复审" },
        title: { en: "Review in two quarters", zh: "两个季度后复审" },
        body: {
          en: "A durable decision stays durable only when the matrix is revisited.",
          zh: "只有重新审视矩阵，耐用决策才能继续耐用。",
        },
      },
    ],
  },
};

const CRITERIA: Criterion[] = [
  {
    id: "ownership",
    label: { en: "Ownership", zh: "掌控权" },
    signal: {
      en: "Can the team explain and repair the core path?",
      zh: "团队能否解释并修复核心路径？",
    },
    weight: "25%",
    scores: {
      suite: {
        value: 3,
        state: "warn",
        note: { en: "Fast, opaque", zh: "快，但不透明" },
      },
      core: {
        value: 5,
        state: "win",
        note: { en: "Owned seams", zh: "边界可掌控" },
      },
      plain: {
        value: 4,
        state: "neutral",
        note: { en: "Clear pieces", zh: "组件清楚" },
      },
    },
  },
  {
    id: "maintenance",
    label: { en: "Maintenance", zh: "维护性" },
    signal: {
      en: "Does routine change stay cheap?",
      zh: "日常变化是否仍然便宜？",
    },
    weight: "22%",
    scores: {
      suite: {
        value: 4,
        state: "neutral",
        note: { en: "Smooth until edge cases", zh: "边界前顺滑" },
      },
      core: {
        value: 5,
        state: "win",
        note: { en: "Stable center", zh: "核心稳定" },
      },
      plain: {
        value: 3,
        state: "warn",
        note: { en: "Manual burden", zh: "手工负担" },
      },
    },
  },
  {
    id: "ecosystem",
    label: { en: "Ecosystem", zh: "生态" },
    signal: {
      en: "Are integrations active and replaceable?",
      zh: "集成是否活跃且可替换？",
    },
    weight: "18%",
    scores: {
      suite: {
        value: 5,
        state: "win",
        note: { en: "Broad catalog", zh: "目录丰富" },
      },
      core: {
        value: 4,
        state: "neutral",
        note: { en: "Useful surface", zh: "接口可用" },
      },
      plain: {
        value: 3,
        state: "warn",
        note: { en: "Build more", zh: "需自建更多" },
      },
    },
  },
  {
    id: "portability",
    label: { en: "Portability", zh: "可迁移性" },
    signal: {
      en: "Can data and workflow leave cleanly?",
      zh: "数据和流程能否干净迁出？",
    },
    weight: "20%",
    scores: {
      suite: {
        value: 2,
        state: "risk",
        note: { en: "Heavy exit", zh: "退出沉重" },
      },
      core: {
        value: 4,
        state: "win",
        note: { en: "Open paths", zh: "路径开放" },
      },
      plain: {
        value: 5,
        state: "win",
        note: { en: "Few locks", zh: "锁定少" },
      },
    },
  },
  {
    id: "governance",
    label: { en: "Governance", zh: "治理" },
    signal: {
      en: "Can rules prevent uncontrolled drift?",
      zh: "规则能否防止无序漂移？",
    },
    weight: "15%",
    scores: {
      suite: {
        value: 4,
        state: "neutral",
        note: { en: "Built-in controls", zh: "内置控制" },
      },
      core: {
        value: 5,
        state: "win",
        note: { en: "Explicit rules", zh: "规则明确" },
      },
      plain: {
        value: 2,
        state: "risk",
        note: { en: "Easy sprawl", zh: "容易扩散" },
      },
    },
  },
];

const CONTENDERS: Contender[] = [
  {
    id: "suite",
    name: { en: "Integrated Suite", zh: "集成套件" },
    kind: { en: "One control plane", zh: "统一控制面" },
    points: [
      { en: "Fastest adoption path", zh: "采用路径最快" },
      { en: "Broad default workflow", zh: "默认流程覆盖广" },
      { en: "Exit cost arrives late", zh: "退出成本后置" },
    ],
  },
  {
    id: "core",
    name: { en: "Open Core", zh: "开放核心" },
    kind: { en: "Stable center, owned edges", zh: "稳定核心，可控边界" },
    points: [
      { en: "Strong shared foundation", zh: "共享基础扎实" },
      { en: "Extensions stay inspectable", zh: "扩展可被检查" },
      { en: "Needs governance discipline", zh: "需要治理纪律" },
    ],
  },
  {
    id: "plain",
    name: { en: "Plain Stack", zh: "基础栈" },
    kind: { en: "Transparent parts", zh: "透明组件" },
    points: [
      { en: "Few hidden contracts", zh: "隐藏契约少" },
      { en: "Easy to replace pieces", zh: "组件容易替换" },
      { en: "Assembly slows teams", zh: "组装拖慢团队" },
    ],
  },
];

const TOTALS: Record<ContenderId, number> = {
  suite: 72,
  core: 91,
  plain: 76,
};

const TAB_POSITIONS = [
  { scene: 1, x: "9cqw", y: "5.4cqh" },
  { scene: 2, x: "91cqw", y: "5.4cqh" },
  { scene: 3, x: "91cqw", y: "50cqh" },
  { scene: 4, x: "91cqw", y: "94.6cqh" },
  { scene: 5, x: "9cqw", y: "94.6cqh" },
];

function useFonts() {
  useEffect(() => {
    const id = "durable-tool-fonts";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Noto+Sans+SC:wght@400;500;700;800&display=swap";
    document.head.appendChild(link);
  }, []);
}

function t(copy: Localized, language: Lang): string {
  return copy[language];
}

function cx(...classes: Array<string | false | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

function clampBeat(sceneId: number, beat: number): number {
  const maxBeat = SCENES[sceneId].beats.length - 1;
  return Math.min(Math.max(beat, 0), maxBeat);
}

function visible(beat: number, threshold: number): boolean {
  return beat >= threshold;
}

function stateMark(state: CellState): string {
  if (state === "win") return "✓";
  if (state === "risk") return "!";
  if (state === "warn") return "±";
  return "•";
}

function buildMetadata(lang: Lang): TopicMetadata {
  return {
    theme: t(
      {
        en: "Choosing the Durable Tool",
        zh: "选择耐用工具",
      },
      lang,
    ),
    densityLabel: lang === "zh" ? "高密度比较" : "Dense comparison",
    heroScene: 3,
    colors: {
      bg: "#f7f8f5",
      ink: "#15201b",
      panel: "#ffffff",
    },
    typography: {
      header: "Inter 800",
      body: "Inter 500",
    },
    tags: [
      "matrix",
      "benchmark",
      "comparison",
      "analytical",
      "balanced-hybrid",
    ],
    fonts: ["Inter", "cjk:Noto Sans SC"],
    scenes: [1, 2, 3, 4, 5].map((sceneId) => ({
      id: sceneId,
      title: t(SCENES[sceneId].title, lang),
      beats: SCENES[sceneId].beats.map((beat, index) => ({
        id: index,
        action: t(beat.action, lang),
        title: t(beat.title, lang),
        body: t(beat.body, lang),
      })),
    })),
  };
}

function CornerTabs({
  scene,
  language,
  isThumbnail,
  onNavigate,
}: {
  scene: number;
  language: Lang;
  isThumbnail: boolean;
  onNavigate?: (scene: number, beat: number) => void;
}) {
  if (isThumbnail) return null;

  return (
    <nav
      className={styles.cornerTabs}
      aria-label="Scene navigation"
      data-topic-navigation="true"
      data-navigation-geometry="edge-scale"
      data-navigation-carrier="durable-tool-corner-tabs"
      data-navigation-invocation="persistent"
      data-navigation-feedback="material-color-change"
    >
      {TAB_POSITIONS.map((tab) => {
        const label = t(SCENES[tab.scene].eyebrow, language);
        return (
          <button
            key={tab.scene}
            className={styles.cornerTab}
            style={
              {
                "--tab-x": tab.x,
                "--tab-y": tab.y,
              } as CSSVars
            }
            type="button"
            data-active={scene === tab.scene ? "true" : "false"}
            onClick={() => onNavigate?.(tab.scene, 0)}
          >
            {String(tab.scene).padStart(2, "0")} {label}
          </button>
        );
      })}
    </nav>
  );
}

function BeatRail({
  sceneId,
  beat,
  language,
}: {
  sceneId: number;
  beat: number;
  language: Lang;
}) {
  const beats = SCENES[sceneId].beats;
  return (
    <div className={styles.beatRail} aria-hidden="true">
      <span className={styles.beatLabel}>
        {language === "zh" ? "节拍" : "Beat"}
      </span>
      {beats.map((item, index) => (
        <span
          key={item.title.en}
          className={styles.beatDot}
          data-filled={index <= beat ? "true" : "false"}
        />
      ))}
    </div>
  );
}

function SceneFrame({
  sceneId,
  beat,
  language,
  children,
}: {
  sceneId: number;
  beat: number;
  language: Lang;
  children: ReactNode;
}) {
  const copy = SCENES[sceneId];
  const currentBeat = copy.beats[beat];

  return (
    <section
      className={cx(styles.scene, language === "zh" && styles.zh)}
      data-beat-layout-container="true"
      data-beat-layout-mode="reserved"
    >
      <aside className={styles.sceneMeta} data-beat-layout-item="true">
        <div>
          <p className={styles.eyebrow}>{t(copy.eyebrow, language)}</p>
          <h1 className={styles.title}>{t(copy.title, language)}</h1>
          <p className={styles.summary}>{t(copy.summary, language)}</p>
        </div>
        <div className={styles.sceneNumber}>
          {String(sceneId).padStart(2, "0")}
        </div>
      </aside>
      <main className={styles.content}>
        <div className={styles.topline} data-beat-layout-item="true">
          <p className={styles.thesis}>{t(copy.thesis, language)}</p>
          <div className={styles.scorePill}>
            <span>{t(copy.badge, language)}</span>
            <span>{beat + 1}/{copy.beats.length}</span>
          </div>
        </div>
        <div className={styles.stageBody} data-beat-layout-item="true">
          {children}
        </div>
        <div className={styles.topline} data-beat-layout-item="true">
          <BeatRail sceneId={sceneId} beat={beat} language={language} />
          <div className={styles.footerNote}>
            {t(currentBeat.title, language)} — {t(currentBeat.body, language)}
          </div>
        </div>
      </main>
    </section>
  );
}

function CriteriaScene({
  beat,
  language,
}: {
  beat: number;
  language: Lang;
}) {
  return (
    <div className={styles.criteriaGrid}>
      {CRITERIA.map((criterion, index) => (
        <article
          key={criterion.id}
          className={styles.criterionCard}
          data-beat-layout-item="true"
          data-visible={visible(beat, index < 2 ? 0 : index - 1) ? "true" : "false"}
          data-active={index === Math.min(beat + 1, CRITERIA.length - 1) ? "true" : "false"}
        >
          <span className={styles.cardIndex}>
            C{index + 1} · {criterion.weight}
          </span>
          <h2 className={styles.criterionName}>
            {t(criterion.label, language)}
          </h2>
          <p className={styles.criterionSignal}>
            {t(criterion.signal, language)}
          </p>
          <div className={styles.weight}>{criterion.weight}</div>
        </article>
      ))}
    </div>
  );
}

function ContendersScene({
  beat,
  language,
}: {
  beat: number;
  language: Lang;
}) {
  return (
    <div className={styles.contenderGrid}>
      {CONTENDERS.map((contender, index) => (
        <article
          key={contender.id}
          className={styles.contenderCard}
          data-beat-layout-item="true"
          data-visible={visible(beat, index) ? "true" : "false"}
          data-focus={beat === index ? "true" : "false"}
        >
          <div>
            <h2 className={styles.contenderName}>
              {t(contender.name, language)}
            </h2>
            <p className={styles.contenderKind}>
              {t(contender.kind, language)}
            </p>
          </div>
          <ul className={styles.contenderList}>
            {contender.points.map((point) => (
              <li key={point.en}>{t(point, language)}</li>
            ))}
          </ul>
          <div className={styles.weight}>
            {language === "zh" ? "候选类别" : "Contender class"}
          </div>
        </article>
      ))}
    </div>
  );
}

function MatrixScene({
  beat,
  language,
}: {
  beat: number;
  language: Lang;
}) {
  const headers = [
    language === "zh" ? "标准" : "Criterion",
    ...CONTENDERS.map((contender) => t(contender.name, language)),
  ];

  return (
    <div className={styles.matrixWrap}>
      <div className={styles.matrixHeader}>
        {headers.map((header) => (
          <div key={header}>{header}</div>
        ))}
      </div>
      <div className={styles.matrixRows}>
        {CRITERIA.map((criterion, index) => {
          const threshold = index < 2 ? 0 : index - 1;
          return (
            <div
              key={criterion.id}
              className={styles.matrixRow}
              data-beat-layout-item="true"
              data-visible={visible(beat, threshold) ? "true" : "false"}
            >
              <div className={styles.matrixCriterion}>
                <span className={styles.matrixCriterionName}>
                  {t(criterion.label, language)}
                </span>
                <span className={styles.matrixCriterionWeight}>
                  {criterion.weight}
                </span>
              </div>
              {CONTENDERS.map((contender) => {
                const score = criterion.scores[contender.id];
                return (
                  <div
                    key={contender.id}
                    className={styles.matrixCell}
                    data-state={score.state}
                  >
                    <span className={styles.mark}>{stateMark(score.state)}</span>
                    <span>
                      {score.value}/5 · {t(score.note, language)}
                    </span>
                  </div>
                );
              })}
            </div>
          );
        })}
        <div
          className={cx(styles.matrixRow, styles.totalRow)}
          data-beat-layout-item="true"
          data-visible={visible(beat, 3) ? "true" : "false"}
        >
          <div className={styles.matrixCriterion}>
            <span className={styles.matrixCriterionName}>
              {language === "zh" ? "加权总分" : "Weighted total"}
            </span>
            <span className={styles.matrixCriterionWeight}>
              {language === "zh" ? "越高越耐用" : "higher is more durable"}
            </span>
          </div>
          {CONTENDERS.map((contender) => (
            <div
              key={contender.id}
              className={cx(
                styles.matrixCell,
                contender.id === "core" && styles.leader,
              )}
              data-state={contender.id === "core" ? "win" : "neutral"}
            >
              <span className={styles.mark}>
                {contender.id === "core" ? "✓" : "•"}
              </span>
              <span>
                {TOTALS[contender.id]} · {t(contender.name, language)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TieBreakScene({
  beat,
  language,
}: {
  beat: number;
  language: Lang;
}) {
  const cards = [
    {
      score: "01",
      title: { en: "Worst day", zh: "最坏一天" },
      body: {
        en: "Suite failure concentrates knowledge outside the team.",
        zh: "套件失败会把知识集中到团队外部。",
      },
      threshold: 0,
    },
    {
      score: "02",
      title: { en: "Governance load", zh: "治理负载" },
      body: {
        en: "Open core asks for rules, but those rules are visible.",
        zh: "开放核心需要规则，但规则是可见的。",
      },
      threshold: 1,
    },
    {
      score: "03",
      title: { en: "Recoverable wins", zh: "可恢复者胜" },
      body: {
        en: "The decisive cell is not score; it is repair path under stress.",
        zh: "决胜格不是分数，而是压力下的修复路径。",
      },
      threshold: 2,
      decision: true,
    },
  ];

  return (
    <div className={styles.tieGrid}>
      {cards.map((card) => (
        <article
          key={card.score}
          className={styles.tieCard}
          data-beat-layout-item="true"
          data-visible={visible(beat, card.threshold) ? "true" : "false"}
          data-decision={card.decision ? "true" : "false"}
        >
          <div className={styles.tieScore}>{card.score}</div>
          <div>
            <h2 className={styles.tieTitle}>{t(card.title, language)}</h2>
            <p className={styles.tieBody}>{t(card.body, language)}</p>
          </div>
        </article>
      ))}
    </div>
  );
}

function VerdictScene({
  beat,
  language,
}: {
  beat: number;
  language: Lang;
}) {
  const items = [
    {
      kicker: { en: "Decision", zh: "决策" },
      text: {
        en: "Adopt open core as the durable default.",
        zh: "采用开放核心作为耐用默认项。",
      },
    },
    {
      kicker: { en: "Guardrail", zh: "护栏" },
      text: {
        en: "Extensions require owner, exit path, and review date.",
        zh: "扩展必须有负责人、退出路径和复审日期。",
      },
    },
    {
      kicker: { en: "Review", zh: "复审" },
      text: {
        en: "Re-run the matrix after two quarters of real use.",
        zh: "真实使用两个季度后重新跑矩阵。",
      },
    },
  ];

  return (
    <div className={styles.verdictGrid}>
      <section className={styles.winnerPanel} data-beat-layout-item="true">
        <p className={styles.winnerLabel}>
          {language === "zh" ? "胜出工具" : "Winning tool"}
        </p>
        <h2 className={styles.winnerName}>
          {language === "zh" ? "开放核心" : "Open Core"}
        </h2>
        <p className={styles.winnerReason}>
          {language === "zh"
            ? "不是最省事，而是最可被团队长期维护。"
            : "Not the easiest option, but the one the team can maintain longest."}
        </p>
      </section>
      <div className={styles.verdictList}>
        {items.map((item, index) => (
          <article
            key={item.kicker.en}
            className={styles.verdictItem}
            data-beat-layout-item="true"
            data-visible={visible(beat, index) ? "true" : "false"}
          >
            <span className={styles.verdictKicker}>
              {t(item.kicker, language)}
            </span>
            <span className={styles.verdictText}>
              {t(item.text, language)}
            </span>
          </article>
        ))}
      </div>
    </div>
  );
}

function RenderScene({
  sceneId,
  beat,
  language,
}: {
  sceneId: number;
  beat: number;
  language: Lang;
}) {
  const safeBeat = clampBeat(sceneId, beat);
  const body =
    sceneId === 1 ? (
      <CriteriaScene beat={safeBeat} language={language} />
    ) : sceneId === 2 ? (
      <ContendersScene beat={safeBeat} language={language} />
    ) : sceneId === 3 ? (
      <MatrixScene beat={safeBeat} language={language} />
    ) : sceneId === 4 ? (
      <TieBreakScene beat={safeBeat} language={language} />
    ) : (
      <VerdictScene beat={safeBeat} language={language} />
    );

  return (
    <SceneFrame sceneId={sceneId} beat={safeBeat} language={language}>
      {body}
    </SceneFrame>
  );
}

function TopicStage({
  scene,
  beat,
  language,
  isThumbnail,
  reducedMotion,
  onNavigate,
}: TopicStageProps) {
  useFonts();
  const safeScene = Math.min(Math.max(scene, 1), 5);
  const safeBeat = clampBeat(safeScene, beat);
  const motionOff = reducedMotion || isThumbnail;

  return (
    <div
      className={styles.root}
      data-reduced-motion={motionOff ? "true" : "false"}
      data-thumbnail={isThumbnail ? "true" : "false"}
    >
      <div className={styles.chrome} aria-hidden="true" />
      <SpatialSceneTrack
        scene={safeScene}
        beat={safeBeat}
        transitionKind="fade"
        transitionMap={TRANSITION_MAP}
        transitionDurationMs={680}
        reducedMotion={motionOff}
        beatLayoutModes={BEAT_LAYOUT_MODES}
        className={styles.track}
        renderScene={(sceneId, sceneBeat) => (
          <RenderScene
            sceneId={sceneId}
            beat={sceneBeat}
            language={language}
          />
        )}
      />
      <CornerTabs
        scene={safeScene}
        language={language}
        isThumbnail={isThumbnail}
        onNavigate={onNavigate}
      />
    </div>
  );
}

const metadata = {
  en: buildMetadata("en"),
  zh: buildMetadata("zh"),
};

export default defineTopic({
  id: "durable-tool",
  styleId: "benchmark-matrix",
  title: {
    en: "Durable Tool",
    zh: "耐用工具",
  },
  modelId: "GPT 5.5",
  Stage: TopicStage,
  metadata,
  navigation: {
    geometry: "edge-scale",
    carrier: "durable-tool-corner-tabs",
    invocation: "persistent",
    feedback: "material-color-change",
  },
  transitionScore: TRANSITION_SCORE,
  evidence: {
    kind: "illustrative",
    boundary: {
      en: "Illustrative tool evaluation: criteria, scores, and the verdict are presentation examples, not measured procurement results.",
      zh: "示例工具评估：标准、评分与结论均为演示示例，并非实测采购结果。",
    },
    display: "envelope",
  },
});

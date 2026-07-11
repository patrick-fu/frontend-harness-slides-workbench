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
import styles from "./boundary.module.css";

type Lang = "en" | "zh";
type SceneId = 1 | 2 | 3 | 4 | 5;

interface MetadataBeat {
  id: number;
  action: string;
  title: string;
  body: string;
}

interface RecordBlock {
  label: string;
  title: string;
  body: string;
  meta: string;
}

interface RecordRow {
  label: string;
  value: string;
  note: string;
  state: "neutral" | "selected" | "risk" | "verified";
}

interface SceneCopy {
  nav: string;
  eyebrow: string;
  title: string;
  status: string;
  summary: string;
  reference: string;
  blocks: RecordBlock[];
  rows: RecordRow[];
  footer: string;
  beats: MetadataBeat[];
}

const SCENE_IDS: SceneId[] = [1, 2, 3, 4, 5];

const TRANSITION_SCORE = {
  "1->2": "fade",
  "2->3": "slide-y",
  "3->4": "wipe",
  "4->5": "hard-cut",
} as const satisfies TopicTransitionScore;

const TRANSITION_MAP: SceneTransitionMap = TRANSITION_SCORE;

const BEAT_LAYOUT_MODES: Record<SceneId, BeatLayoutMode> = {
  1: "reserved",
  2: "reserved",
  3: "reserved",
  4: "reserved",
  5: "reserved",
};

const COPY: Record<Lang, Record<SceneId, SceneCopy>> = {
  en: {
    1: {
      nav: "Context",
      eyebrow: "ADR-042 / Context",
      title: "Choose the Boundary",
      status: "Status: Proposed",
      summary:
        "The current module owns policy, orchestration, and provider adapters. Every small change crosses the same review surface.",
      reference: "Drivers: release cadence, support ownership, audit trail",
      blocks: [
        {
          label: "Observed tension",
          title: "Three reasons to change",
          body: "Policy updates weekly, adapters change per vendor, and orchestration changes per product bet.",
          meta: "Mismatch",
        },
        {
          label: "Boundary smell",
          title: "One owner cannot reason locally",
          body: "A provider patch can force a policy review; a policy exception can leak into adapter code.",
          meta: "Coupling",
        },
      ],
      rows: [
        {
          label: "Scope",
          value: "Decision boundary, not feature scope",
          note: "The record decides where ownership stops.",
          state: "neutral",
        },
      ],
      footer: "Context establishes why the boundary is a product risk, not a code style preference.",
      beats: [
        {
          id: 0,
          action: "Show the record context",
          title: "The same boundary carries three change rates.",
          body: "Policy, adapters, and orchestration now move independently.",
        },
        {
          id: 1,
          action: "Reveal the coupling risk",
          title: "Local changes are no longer local.",
          body: "The record frames the ownership problem before listing options.",
        },
      ],
    },
    2: {
      nav: "Options",
      eyebrow: "ADR-042 / Options",
      title: "Options Considered",
      status: "Status: Comparing",
      summary:
        "The record compares boundaries by ownership clarity, reversibility, and audit cost.",
      reference: "Evaluation rule: choose the smallest boundary that preserves policy intent",
      blocks: [
        {
          label: "Option A",
          title: "Wide product boundary",
          body: "Keep one team responsible for policy, orchestration, and every adapter.",
          meta: "Simple now",
        },
        {
          label: "Option B",
          title: "Adapter boundary",
          body: "Move provider-specific code out, but let policy details continue crossing the seam.",
          meta: "Partial",
        },
        {
          label: "Option C",
          title: "Capability boundary",
          body: "Policy owns intent and invariants; adapters translate capabilities into provider calls.",
          meta: "Candidate",
        },
      ],
      rows: [
        {
          label: "A",
          value: "Low migration",
          note: "Keeps today's coupling.",
          state: "risk",
        },
        {
          label: "B",
          value: "Cleaner adapters",
          note: "Still leaks policy exceptions.",
          state: "neutral",
        },
        {
          label: "C",
          value: "Explicit capability contract",
          note: "More upfront modeling, lower audit cost.",
          state: "selected",
        },
      ],
      footer: "Rejected options stay visible so future readers can see what was not chosen.",
      beats: [
        {
          id: 0,
          action: "Reveal the comparison rule",
          title: "Compare boundaries by decision cost.",
          body: "The evaluation rule is made explicit before any winner appears.",
        },
        {
          id: 1,
          action: "Reveal the three options",
          title: "List viable ownership cuts.",
          body: "Each option is phrased as a real boundary, not a vague preference.",
        },
        {
          id: 2,
          action: "Mark the leading option",
          title: "Capability boundary has the best audit shape.",
          body: "The selected row is highlighted without hiding the rejected costs.",
        },
      ],
    },
    3: {
      nav: "Decision",
      eyebrow: "ADR-042 / Decision",
      title: "Decision",
      status: "Status: Accepted",
      summary:
        "Choose a capability boundary: policy states allowed intent, adapters expose provider capability, orchestration composes the two.",
      reference: "Decision date: 2026-07-07",
      blocks: [
        {
          label: "Decision clause",
          title: "Policy owns intent. Adapters own translation.",
          body: "No adapter may decide product policy; no policy rule may depend on a vendor-only field without a capability entry.",
          meta: "Accepted",
        },
        {
          label: "Non-goal",
          title: "Do not rebuild the orchestration layer",
          body: "The decision moves ownership boundaries first. Runtime sequencing remains unchanged until verified.",
          meta: "Guardrail",
        },
      ],
      rows: [
        {
          label: "Contract",
          value: "Capability map",
          note: "Every provider declares supported intent.",
          state: "selected",
        },
        {
          label: "Owner",
          value: "Policy reviewers approve invariants",
          note: "Adapter owners approve translations.",
          state: "verified",
        },
      ],
      footer: "A decision record is valuable only when the winning rule is short enough to enforce.",
      beats: [
        {
          id: 0,
          action: "State the accepted decision",
          title: "Choose the capability boundary.",
          body: "The page resolves from options to an enforceable ownership rule.",
        },
        {
          id: 1,
          action: "Reveal guardrails",
          title: "Name what the decision does not change.",
          body: "The non-goal prevents a boundary decision from becoming an unbounded rewrite.",
        },
      ],
    },
    4: {
      nav: "Consequences",
      eyebrow: "ADR-042 / Consequences",
      title: "Consequences",
      status: "Status: Costs Recorded",
      summary:
        "The selected boundary buys review clarity, but it adds a capability catalog and explicit exception handling.",
      reference: "Consequence type: accepted cost, protected behavior, migration risk",
      blocks: [
        {
          label: "Accepted cost",
          title: "Capability catalog must stay current",
          body: "Provider launches now require a capability declaration before integration can ship.",
          meta: "Cost",
        },
        {
          label: "Protected behavior",
          title: "Policy exceptions stop leaking downward",
          body: "A product exception is reviewed as policy, not smuggled into a provider adapter.",
          meta: "Benefit",
        },
        {
          label: "Migration risk",
          title: "Existing adapter assumptions need names",
          body: "Implicit vendor behavior must be converted into capability entries during migration.",
          meta: "Risk",
        },
      ],
      rows: [
        {
          label: "Review",
          value: "Smaller approval surface",
          note: "Policy and adapter reviews separate cleanly.",
          state: "verified",
        },
        {
          label: "Migration",
          value: "Two releases",
          note: "Shadow-read capabilities before enforcement.",
          state: "neutral",
        },
      ],
      footer: "Consequences make the trade honest: this is a boundary choice, not free simplification.",
      beats: [
        {
          id: 0,
          action: "Reveal the accepted cost",
          title: "The catalog is the price of clarity.",
          body: "The first consequence names new work created by the decision.",
        },
        {
          id: 1,
          action: "Reveal protected behavior",
          title: "The decision protects policy review.",
          body: "The benefit is stated as an operational behavior, not a slogan.",
        },
        {
          id: 2,
          action: "Reveal migration risk",
          title: "Implicit assumptions need explicit entries.",
          body: "The risk is visible before verification begins.",
        },
      ],
    },
    5: {
      nav: "Verification",
      eyebrow: "ADR-042 / Verification",
      title: "Verification Plan",
      status: "Status: Ready to Check",
      summary:
        "The boundary is accepted only when policy, adapter, and orchestration checks fail in the right place.",
      reference: "Exit rule: each layer can reject only the concerns it owns",
      blocks: [
        {
          label: "Check one",
          title: "Policy rejects disallowed intent",
          body: "A blocked product intent fails before provider selection.",
          meta: "Policy",
        },
        {
          label: "Check two",
          title: "Adapter rejects unsupported capability",
          body: "A provider lacking a declared capability fails without changing policy.",
          meta: "Adapter",
        },
        {
          label: "Check three",
          title: "Orchestration composes declared capability",
          body: "The flow reads policy intent and capability output without inspecting vendor details.",
          meta: "Flow",
        },
      ],
      rows: [
        {
          label: "Audit",
          value: "Boundary review can be sampled",
          note: "Every exception points to exactly one owner.",
          state: "verified",
        },
      ],
      footer: "If a failure needs two owners to explain it, the boundary is not verified.",
      beats: [
        {
          id: 0,
          action: "Show verification checks",
          title: "The decision is testable at ownership edges.",
          body: "Verification proves that each layer fails for its own concerns.",
        },
        {
          id: 1,
          action: "Reveal the exit rule",
          title: "One failure, one owner.",
          body: "The record ends with a rule a reviewer can apply later.",
        },
      ],
    },
  },
  zh: {
    1: {
      nav: "背景",
      eyebrow: "ADR-042 / 背景",
      title: "选择边界",
      status: "状态：提议中",
      summary: "当前模块同时负责策略、编排和供应商适配。任何小改动都会穿过同一片评审面。",
      reference: "驱动因素：发布节奏、支持归属、审计路径",
      blocks: [
        {
          label: "已观察到的张力",
          title: "三个变化理由",
          body: "策略每周更新，适配随供应商变化，编排跟随产品下注变化。",
          meta: "不匹配",
        },
        {
          label: "边界异味",
          title: "单一 owner 无法局部推理",
          body: "供应商补丁会触发策略评审；策略例外又会渗进适配代码。",
          meta: "耦合",
        },
      ],
      rows: [
        {
          label: "范围",
          value: "决策边界，不是功能范围",
          note: "这份记录决定所有权在哪里停止。",
          state: "neutral",
        },
      ],
      footer: "背景说明：边界问题是产品风险，不是代码风格偏好。",
      beats: [
        {
          id: 0,
          action: "展示决策背景",
          title: "同一条边界承载三种变化速度。",
          body: "策略、适配、编排已经独立变化。",
        },
        {
          id: 1,
          action: "揭示耦合风险",
          title: "局部改动不再局部。",
          body: "记录先界定所有权问题，再进入选项比较。",
        },
      ],
    },
    2: {
      nav: "选项",
      eyebrow: "ADR-042 / 选项",
      title: "备选方案",
      status: "状态：比较中",
      summary: "记录按所有权清晰度、可逆性和审计成本比较边界。",
      reference: "评估规则：选择能保留策略意图的最小边界",
      blocks: [
        {
          label: "选项 A",
          title: "宽产品边界",
          body: "仍由一个团队负责策略、编排和所有适配。",
          meta: "现在简单",
        },
        {
          label: "选项 B",
          title: "适配边界",
          body: "移出供应商相关代码，但策略细节仍跨过边界。",
          meta: "局部",
        },
        {
          label: "选项 C",
          title: "能力边界",
          body: "策略拥有意图和不变量；适配把能力翻译成供应商调用。",
          meta: "候选",
        },
      ],
      rows: [
        {
          label: "A",
          value: "迁移成本低",
          note: "保留今天的耦合。",
          state: "risk",
        },
        {
          label: "B",
          value: "适配更干净",
          note: "策略例外仍然泄漏。",
          state: "neutral",
        },
        {
          label: "C",
          value: "显式能力契约",
          note: "建模更早，审计成本更低。",
          state: "selected",
        },
      ],
      footer: "被拒方案仍保留在页面上，方便后来的读者看到没有选择什么。",
      beats: [
        {
          id: 0,
          action: "揭示比较规则",
          title: "用决策成本比较边界。",
          body: "在赢家出现前，先把评估规则写清楚。",
        },
        {
          id: 1,
          action: "揭示三个选项",
          title: "列出可行的所有权切法。",
          body: "每个选项都是真实边界，而不是模糊偏好。",
        },
        {
          id: 2,
          action: "标记领先选项",
          title: "能力边界的审计形状最好。",
          body: "高亮被选行，同时保留被拒成本。",
        },
      ],
    },
    3: {
      nav: "决策",
      eyebrow: "ADR-042 / 决策",
      title: "决策",
      status: "状态：已接受",
      summary: "选择能力边界：策略声明允许的意图，适配暴露供应商能力，编排组合两者。",
      reference: "决策日期：2026-07-07",
      blocks: [
        {
          label: "决策条款",
          title: "策略拥有意图。适配拥有翻译。",
          body: "适配不得决定产品策略；策略规则不得依赖没有能力条目的供应商字段。",
          meta: "接受",
        },
        {
          label: "非目标",
          title: "不重建编排层",
          body: "这次先移动所有权边界。运行时顺序保持不变，直到验证完成。",
          meta: "护栏",
        },
      ],
      rows: [
        {
          label: "契约",
          value: "能力映射",
          note: "每个供应商声明自己支持的意图。",
          state: "selected",
        },
        {
          label: "Owner",
          value: "策略评审批准不变量",
          note: "适配 owner 批准翻译。",
          state: "verified",
        },
      ],
      footer: "决策记录只有在胜出规则短到可执行时才有价值。",
      beats: [
        {
          id: 0,
          action: "声明已接受决策",
          title: "选择能力边界。",
          body: "页面从选项比较收束到可执行的所有权规则。",
        },
        {
          id: 1,
          action: "揭示护栏",
          title: "说明这次决策不改变什么。",
          body: "非目标防止边界决策变成无限重写。",
        },
      ],
    },
    4: {
      nav: "后果",
      eyebrow: "ADR-042 / 后果",
      title: "后果",
      status: "状态：成本已记录",
      summary: "被选边界换来评审清晰度，但也增加了能力目录和显式例外处理。",
      reference: "后果类型：接受成本、保护行为、迁移风险",
      blocks: [
        {
          label: "接受成本",
          title: "能力目录必须保持最新",
          body: "供应商发布现在必须先有能力声明，集成才能上线。",
          meta: "成本",
        },
        {
          label: "保护行为",
          title: "策略例外停止向下泄漏",
          body: "产品例外按策略评审，而不是塞进供应商适配。",
          meta: "收益",
        },
        {
          label: "迁移风险",
          title: "现有适配假设需要命名",
          body: "迁移时必须把隐式供应商行为转换成能力条目。",
          meta: "风险",
        },
      ],
      rows: [
        {
          label: "评审",
          value: "更小审批面",
          note: "策略评审和适配评审可以清楚分开。",
          state: "verified",
        },
        {
          label: "迁移",
          value: "两个发布周期",
          note: "先 shadow-read 能力，再启用强制约束。",
          state: "neutral",
        },
      ],
      footer: "后果让权衡保持诚实：这是边界选择，不是免费的简化。",
      beats: [
        {
          id: 0,
          action: "揭示接受成本",
          title: "目录是清晰度的代价。",
          body: "第一条后果命名这次决策创造的新工作。",
        },
        {
          id: 1,
          action: "揭示保护行为",
          title: "决策保护策略评审。",
          body: "收益被表述成操作行为，而不是口号。",
        },
        {
          id: 2,
          action: "揭示迁移风险",
          title: "隐式假设需要显式条目。",
          body: "风险在验证开始前可见。",
        },
      ],
    },
    5: {
      nav: "验证",
      eyebrow: "ADR-042 / 验证",
      title: "验证计划",
      status: "状态：待检查",
      summary: "只有当策略、适配和编排检查都在正确位置失败时，这条边界才算被接受。",
      reference: "退出规则：每层只能拒绝自己拥有的关注点",
      blocks: [
        {
          label: "检查一",
          title: "策略拒绝不允许的意图",
          body: "被禁止的产品意图在供应商选择前失败。",
          meta: "策略",
        },
        {
          label: "检查二",
          title: "适配拒绝不支持的能力",
          body: "缺少已声明能力的供应商失败，不需要改动策略。",
          meta: "适配",
        },
        {
          label: "检查三",
          title: "编排组合已声明能力",
          body: "流程读取策略意图和能力输出，不检查供应商细节。",
          meta: "流程",
        },
      ],
      rows: [
        {
          label: "审计",
          value: "边界评审可抽样",
          note: "每个例外都指向唯一 owner。",
          state: "verified",
        },
      ],
      footer: "如果一次失败需要两个 owner 解释，边界就还没有验证。",
      beats: [
        {
          id: 0,
          action: "展示验证检查",
          title: "决策可在所有权边缘测试。",
          body: "验证证明每层只为自己的关注点失败。",
        },
        {
          id: 1,
          action: "揭示退出规则",
          title: "一次失败，一个 owner。",
          body: "记录以一条评审者日后能复用的规则结束。",
        },
      ],
    },
  },
};

function useFonts() {
  useEffect(() => {
    const id = "style-42-choose-boundary-v2-fonts";
    if (document.getElementById(id)) {
      return;
    }
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=Inter:wght@500;600;700&family=Noto+Sans+SC:wght@400;500;700&display=swap";
    document.head.appendChild(link);
  }, []);
}

function clampScene(scene: number): SceneId {
  if (scene <= 1) {
    return 1;
  }
  if (scene >= 5) {
    return 5;
  }
  return scene as SceneId;
}

function clampBeat(beat: number, copy: SceneCopy, isThumbnail: boolean): number {
  if (isThumbnail) {
    return copy.beats.length - 1;
  }
  return Math.max(0, Math.min(beat, copy.beats.length - 1));
}

function isVisible(index: number, beat: number): boolean {
  return index <= beat;
}

function AdrSidebar({
  activeScene,
  language,
  onNavigate,
}: {
  activeScene: SceneId;
  language: Lang;
  onNavigate?: (scene: number, beat: number) => void;
}) {
  return (
    <nav
      className={styles.sidebar}
      aria-label="ADR scene index"
      data-topic-navigation="true"
      data-navigation-geometry="typographic-index"
      data-navigation-carrier="boundary-adr-sidebar"
      data-navigation-invocation="persistent"
      data-navigation-feedback="typographic-emphasis"
    >
      <div className={styles.sidebarHeader}>
        <span>ADR</span>
        <strong>042</strong>
      </div>
      <div className={styles.sidebarRule} />
      {SCENE_IDS.map((sceneId) => {
        const sceneCopy = COPY[language][sceneId];
        return (
          <button
            key={sceneId}
            type="button"
            className={styles.navButton}
            data-active={sceneId === activeScene ? "true" : "false"}
            onClick={() => onNavigate?.(sceneId, 0)}
          >
            <span className={styles.navNumber}>
              {String(sceneId).padStart(2, "0")}
            </span>
            <span className={styles.navLabel}>{sceneCopy.nav}</span>
          </button>
        );
      })}
    </nav>
  );
}

function ScenePanel({
  sceneId,
  beat,
  language,
  isThumbnail,
}: {
  sceneId: SceneId;
  beat: number;
  language: Lang;
  isThumbnail: boolean;
}) {
  const copy = COPY[language][sceneId];
  const effectiveBeat = clampBeat(beat, copy, isThumbnail);

  return (
    <article
      className={styles.scene}
      data-scene={sceneId}
      data-beat-layout-container="true"
      data-beat-layout-mode="reserved"
    >
      <header className={styles.recordHeader} data-beat-layout-item="true">
        <div>
          <p className={styles.eyebrow}>{copy.eyebrow}</p>
          <h1>{copy.title}</h1>
        </div>
        <div className={styles.statusBlock}>
          <span>{copy.status}</span>
          <strong>{copy.reference}</strong>
        </div>
      </header>

      <section className={styles.summaryStrip} data-beat-layout-item="true">
        <span>{COPY[language][sceneId].beats[effectiveBeat].title}</span>
        <p>{copy.summary}</p>
      </section>

      {sceneId === 2 ? (
        <OptionsScene copy={copy} beat={effectiveBeat} />
      ) : sceneId === 3 ? (
        <DecisionScene copy={copy} beat={effectiveBeat} />
      ) : sceneId === 4 ? (
        <ConsequencesScene copy={copy} beat={effectiveBeat} />
      ) : sceneId === 5 ? (
        <VerificationScene copy={copy} beat={effectiveBeat} />
      ) : (
        <ContextScene copy={copy} beat={effectiveBeat} />
      )}

      <footer className={styles.recordFooter} data-beat-layout-item="true">
        <span>{copy.footer}</span>
      </footer>
    </article>
  );
}

function ContextScene({ copy, beat }: { copy: SceneCopy; beat: number }) {
  return (
    <div className={styles.contextGrid} data-beat-layout-item="true">
      <div className={styles.blockStack}>
        {copy.blocks.map((block, index) => (
          <ReasonBlock
            key={block.label}
            block={block}
            visible={isVisible(index, beat)}
          />
        ))}
      </div>
      <div className={styles.sideRecord}>
        {copy.rows.map((row) => (
          <RecordRowView key={row.label} row={row} visible={beat >= 1} />
        ))}
      </div>
    </div>
  );
}

function OptionsScene({ copy, beat }: { copy: SceneCopy; beat: number }) {
  return (
    <div className={styles.optionsGrid} data-beat-layout-item="true">
      <div className={styles.optionBlocks}>
        {copy.blocks.map((block, index) => (
          <ReasonBlock
            key={block.label}
            block={block}
            visible={beat >= 1 || index === 0}
          />
        ))}
      </div>
      <div className={styles.optionTable}>
        {copy.rows.map((row, index) => (
          <RecordRowView
            key={row.label}
            row={row}
            visible={beat >= 2 || index < 2}
          />
        ))}
      </div>
    </div>
  );
}

function DecisionScene({ copy, beat }: { copy: SceneCopy; beat: number }) {
  return (
    <div className={styles.decisionGrid} data-beat-layout-item="true">
      <div className={styles.decisionClause}>
        <ReasonBlock block={copy.blocks[0]} visible />
      </div>
      <div className={styles.decisionRows}>
        {copy.rows.map((row) => (
          <RecordRowView key={row.label} row={row} visible />
        ))}
        <ReasonBlock block={copy.blocks[1]} visible={beat >= 1} />
      </div>
    </div>
  );
}

function ConsequencesScene({ copy, beat }: { copy: SceneCopy; beat: number }) {
  return (
    <div className={styles.consequenceGrid} data-beat-layout-item="true">
      {copy.blocks.map((block, index) => (
        <ReasonBlock
          key={block.label}
          block={block}
          visible={isVisible(index, beat)}
        />
      ))}
      <div className={styles.consequenceRows}>
        {copy.rows.map((row, index) => (
          <RecordRowView
            key={row.label}
            row={row}
            visible={beat >= index + 1}
          />
        ))}
      </div>
    </div>
  );
}

function VerificationScene({ copy, beat }: { copy: SceneCopy; beat: number }) {
  return (
    <div className={styles.verificationGrid} data-beat-layout-item="true">
      <div className={styles.checklist}>
        {copy.blocks.map((block) => (
          <ReasonBlock key={block.label} block={block} visible />
        ))}
      </div>
      <div className={styles.exitRule}>
        {copy.rows.map((row) => (
          <RecordRowView key={row.label} row={row} visible={beat >= 1} />
        ))}
      </div>
    </div>
  );
}

function ReasonBlock({
  block,
  visible,
}: {
  block: RecordBlock;
  visible: boolean;
}) {
  return (
    <section
      className={styles.reasonBlock}
      data-visible={visible ? "true" : "false"}
      data-beat-layout-item="true"
    >
      <div className={styles.blockMeta}>
        <span>{block.label}</span>
        <strong>{block.meta}</strong>
      </div>
      <h2>{block.title}</h2>
      <p>{block.body}</p>
    </section>
  );
}

function RecordRowView({
  row,
  visible,
}: {
  row: RecordRow;
  visible: boolean;
}) {
  return (
    <div
      className={styles.recordRow}
      data-state={row.state}
      data-visible={visible ? "true" : "false"}
      data-beat-layout-item="true"
    >
      <span>{row.label}</span>
      <strong>{row.value}</strong>
      <p>{row.note}</p>
    </div>
  );
}

function buildMetadata(lang: Lang): TopicMetadata {
  const localized = COPY[lang];
  return {
    theme: lang === "zh" ? "选择边界" : "Choose the Boundary",
    densityLabel: lang === "zh" ? "阅读优先" : "Reading-First",
    heroScene: 3,
    colors: {
      bg: "#f4f7fb",
      ink: "#17202a",
      panel: "#ffffff",
    },
    typography: {
      header: "IBM Plex Mono 600",
      body: "Inter 500",
    },
    tags: [
      "text-report",
      "adr",
      "technical",
      "decision",
      "reading-first",
      "cool-light",
      "reserved-motion",
    ],
    fonts: ["IBM Plex Mono", "Inter", "cjk:Noto Sans SC"],
    scenes: SCENE_IDS.map((sceneId) => ({
      id: sceneId,
      title: localized[sceneId].nav,
      beats: localized[sceneId].beats,
    })),
  };
}

const METADATA = {
  en: buildMetadata("en"),
  zh: buildMetadata("zh"),
} satisfies { en: TopicMetadata; zh: TopicMetadata };

function TopicStage({
  scene,
  beat,
  language,
  isThumbnail,
  reducedMotion,
  onNavigate,
}: TopicStageProps) {
  useFonts();
  const activeScene = clampScene(scene);

  return (
    <section
      className={styles.root}
      data-topic-id="boundary"
      data-style-id="decision-record"
      data-language={language}
      data-thumbnail={isThumbnail ? "true" : "false"}
      data-reduced-motion={reducedMotion || isThumbnail ? "true" : "false"}
    >
      {!isThumbnail && (
        <AdrSidebar
          activeScene={activeScene}
          language={language}
          onNavigate={onNavigate}
        />
      )}
      <main className={styles.trackShell}>
        <SpatialSceneTrack
          scene={activeScene}
          beat={beat}
          sceneIds={SCENE_IDS}
          transitionKind="fade"
          transitionMap={TRANSITION_MAP}
          reducedMotion={reducedMotion || isThumbnail}
          beatLayoutModes={BEAT_LAYOUT_MODES}
          className={styles.track}
          renderScene={(sceneId, sceneBeat) => (
            <ScenePanel
              sceneId={clampScene(sceneId)}
              beat={sceneBeat}
              language={language}
              isThumbnail={isThumbnail}
            />
          )}
        />
      </main>
    </section>
  );
}

export default defineTopic({
  id: "boundary",
  styleId: "decision-record",
  title: {
    en: "Boundary",
    zh: "边界选择",
  },
  modelId: "GPT 5.5",
  Stage: TopicStage,
  metadata: METADATA,
  navigation: {
    geometry: "typographic-index",
    carrier: "boundary-adr-sidebar",
    invocation: "persistent",
    feedback: "typographic-emphasis",
  },
  transitionScore: TRANSITION_SCORE,
  evidence: {
    kind: "illustrative",
    boundary: {
      en: "Illustrative architecture decision record: the teams, system boundary, options, consequences, and verification plan are presentation examples, not externally verified production facts.",
      zh: "示例架构决策记录：团队、系统边界、备选方案、后果和验证计划均为演示内容，并非经外部核验的生产事实。",
    },
    display: "envelope",
  },
});

import {
  defineTopic,
  type TopicDefinition,
  type TopicMetadata,
  type TopicNavigation,
  type TopicStageProps,
} from "../domain/topic";
import SpatialSceneTrack from "../components/stage/SpatialSceneTrack";
import type {
  BeatLayoutMode,
  SceneTransitionMap,
} from "../components/stage/SpatialSceneTrack";
import styles from "./agent-pickup.module.css";

type Language = "en" | "zh";
type SceneId = 1 | 2 | 3 | 4 | 5;

interface StepCopy {
  label: string;
  detail: string;
  code?: string;
}

interface SceneCopy {
  nav: string;
  eyebrow: string;
  status: string;
  title: string;
  summary: string;
  primaryLabel: string;
  secondaryLabel: string;
  steps: StepCopy[];
  side: StepCopy[];
}

const SCENE_IDS: SceneId[] = [1, 2, 3, 4, 5];
const BEAT_COUNTS: Record<SceneId, number> = {
  1: 1,
  2: 3,
  3: 2,
  4: 3,
  5: 2,
};

const BEAT_LAYOUT_MODES: Partial<Record<number, BeatLayoutMode>> = {
  2: "reserved",
  3: "reserved",
  4: "reserved",
  5: "reserved",
};

const TRANSITION_SCORE = {
  "1->2": "hard-cut",
  "2->3": "slide-y",
  "3->4": "wipe",
  "4->5": "hard-cut",
} as const satisfies TopicDefinition["transitionScore"];

const TRANSITION_MAP: SceneTransitionMap = TRANSITION_SCORE;

const NAVIGATION = {
  geometry: "typographic-index",
  carrier: "agent-pickup-status-chips",
  invocation: "persistent",
  feedback: "material-color-change",
} as const satisfies TopicNavigation;

const COPY: Record<Language, Record<SceneId, SceneCopy>> = {
  en: {
    1: {
      nav: "Open",
      eyebrow: "Issue",
      status: "Needs pickup",
      title: "Issue #43: ready for agent pickup",
      summary:
        "The ticket has enough context for an implementation agent to start without rediscovery.",
      primaryLabel: "Maintainer brief",
      secondaryLabel: "Pickup blockers",
      steps: [
        {
          label: "Problem",
          detail: "The previous handoff mixed task intent with unresolved research.",
          code: "topic: Ready for Agent Pickup",
        },
        {
          label: "Owner signal",
          detail: "A single agent can now take the change through verification.",
          code: "assignee: implementation-agent",
        },
        {
          label: "Exit target",
          detail: "A scoped fix plan plus acceptance checks replaces open-ended notes.",
          code: "state: actionable",
        },
      ],
      side: [
        { label: "Priority", detail: "P1 handoff clarity" },
        { label: "Surface", detail: "style 43 curated topic" },
        { label: "Mode", detail: "reading-first tracker" },
      ],
    },
    2: {
      nav: "Repro",
      eyebrow: "Reproduction",
      status: "Deterministic",
      title: "Repro path is attached, short, and repeatable",
      summary:
        "The agent should see exactly how the issue presents before touching code.",
      primaryLabel: "Repro script",
      secondaryLabel: "Observed evidence",
      steps: [
        {
          label: "Open the failing state",
          detail: "Load the assigned style and move through the five scene arc.",
          code: "scene=2&beat=0",
        },
        {
          label: "Confirm the gap",
          detail: "The handoff lacks stable scope and acceptance language.",
          code: "missing: scope, fix plan, acceptance",
        },
        {
          label: "Freeze the case",
          detail: "Thumbnail and reduced-motion paths must render the same readable ticket.",
          code: "mode: thumbnail | reduced-motion",
        },
      ],
      side: [
        { label: "Expected", detail: "Issue brief reads as pickup-ready" },
        { label: "Actual", detail: "Agent has to infer boundaries" },
        { label: "Signal", detail: "Tracker sections carry the narrative" },
      ],
    },
    3: {
      nav: "Scope",
      eyebrow: "Scope",
      status: "Bounded",
      title: "The working set is explicit",
      summary:
        "The fix is limited to the topic module and its optional CSS module.",
      primaryLabel: "In scope",
      secondaryLabel: "Out of scope",
      steps: [
        {
          label: "Create topic module",
          detail: "Export topic metadata, five scenes, beats, and the component.",
          code: "43-ready-agent-pickup.tsx",
        },
        {
          label: "Author tracker chrome",
          detail: "Use ticket status chips, status sections, and monospaced checks.",
          code: "nav: ticket status chips",
        },
        {
          label: "Wire scene lifecycle",
          detail: "Use SpatialSceneTrack with the assigned transition map.",
          code: "1->2 hard-cut | 2->3 slide-y | 3->4 wipe",
        },
      ],
      side: [
        { label: "Do not touch", detail: "registry, tests, docs, other styles" },
        { label: "Do not copy", detail: "existing style implementations" },
        { label: "Do not add", detail: "runtime shared visual helpers" },
      ],
    },
    4: {
      nav: "Plan",
      eyebrow: "Fix plan",
      status: "Patchable",
      title: "A maintainer can hand this directly to an agent",
      summary:
        "The plan moves from protocol compliance to visual clarity to verification.",
      primaryLabel: "Implementation checklist",
      secondaryLabel: "Patch notes",
      steps: [
        {
          label: "Protocol",
          detail: "Define topic, bilingual metadata, and reserved multi-beat containers.",
          code: "[x] defineStyleTopic({ id: \"ready-agent-pickup\" })",
        },
        {
          label: "Presentation",
          detail: "Make every scene read as a different section of one issue brief.",
          code: "[x] issue / repro / scope / fix plan / acceptance",
        },
        {
          label: "Motion",
          detail: "Keep scene transitions in the shared track with fallback hard cut.",
          code: "[x] transitionKind=\"hard-cut\"",
        },
      ],
      side: [
        { label: "+", detail: "Status chips become internal navigation" },
        { label: "+", detail: "Beat slots reserve final layout from beat zero" },
        { label: "-", detail: "No decorative dashboard cards or generic board" },
      ],
    },
    5: {
      nav: "Accept",
      eyebrow: "Acceptance",
      status: "Ready",
      title: "Pickup criteria are visible before merge",
      summary:
        "The issue closes when the work is scoped, bilingual, transition-safe, and typechecked.",
      primaryLabel: "Acceptance checks",
      secondaryLabel: "Handoff receipt",
      steps: [
        {
          label: "Five-scene arc",
          detail: "Issue, repro, scope, fix plan, and acceptance are all present.",
          code: "scenes.length === 5",
        },
        {
          label: "Beat contract",
          detail: "Multi-beat scenes use reserved layout and stable beat items.",
          code: "data-beat-layout-mode=\"reserved\"",
        },
        {
          label: "Verification",
          detail: "The minimal required check completes without type errors.",
          code: "npm run typecheck",
        },
      ],
      side: [
        { label: "Reviewer", detail: "Can scan status and boundaries first" },
        { label: "Agent", detail: "Can start implementation without rediscovery" },
        { label: "Maintainer", detail: "Can verify the exact handoff contract" },
      ],
    },
  },
  zh: {
    1: {
      nav: "开单",
      eyebrow: "Issue",
      status: "待接手",
      title: "Issue #43：可交给 Agent 接手",
      summary: "这个 ticket 已有足够上下文，实施 Agent 不需要重新做发现工作。",
      primaryLabel: "维护者简报",
      secondaryLabel: "接手阻塞",
      steps: [
        {
          label: "问题",
          detail: "上一版交接把任务意图和未决调研混在一起。",
          code: "topic: Ready for Agent Pickup",
        },
        {
          label: "负责人信号",
          detail: "单个 Agent 现在可以把改动推进到验证。",
          code: "assignee: implementation-agent",
        },
        {
          label: "退出目标",
          detail: "用明确范围、修复计划和验收项替代开放笔记。",
          code: "state: actionable",
        },
      ],
      side: [
        { label: "优先级", detail: "P1 交接清晰度" },
        { label: "范围", detail: "style 43 curated topic" },
        { label: "模式", detail: "阅读优先 tracker" },
      ],
    },
    2: {
      nav: "复现",
      eyebrow: "复现",
      status: "稳定复现",
      title: "复现路径短、明确、可重复",
      summary: "Agent 动代码前，应先看到问题如何出现。",
      primaryLabel: "复现脚本",
      secondaryLabel: "观测证据",
      steps: [
        {
          label: "打开失败状态",
          detail: "加载指定 style，并走完整五段场景弧线。",
          code: "scene=2&beat=0",
        },
        {
          label: "确认缺口",
          detail: "交接缺少稳定范围和验收语言。",
          code: "missing: scope, fix plan, acceptance",
        },
        {
          label: "冻结案例",
          detail: "缩略图和减少动画路径也必须是同一个可读 ticket。",
          code: "mode: thumbnail | reduced-motion",
        },
      ],
      side: [
        { label: "预期", detail: "Issue brief 读起来可接手" },
        { label: "实际", detail: "Agent 需要推断边界" },
        { label: "信号", detail: "Tracker 分区承载叙事" },
      ],
    },
    3: {
      nav: "范围",
      eyebrow: "范围",
      status: "已收束",
      title: "工作集是显性的",
      summary: "修复仅限 Topic 模块和可选 CSS module。",
      primaryLabel: "范围内",
      secondaryLabel: "范围外",
      steps: [
        {
          label: "创建 Topic 模块",
          detail: "导出 Topic metadata、五个场景、beats 和组件。",
          code: "43-ready-agent-pickup.tsx",
        },
        {
          label: "编写 tracker 视觉",
          detail: "使用 ticket 状态 chips、状态分区和等宽检查项。",
          code: "nav: ticket status chips",
        },
        {
          label: "接入场景生命周期",
          detail: "用 SpatialSceneTrack 和指定 transition map。",
          code: "1->2 hard-cut | 2->3 slide-y | 3->4 wipe",
        },
      ],
      side: [
        { label: "不触碰", detail: "registry、tests、docs、其它 styles" },
        { label: "不复制", detail: "现有 style 实现" },
        { label: "不新增", detail: "运行时共享视觉 helper" },
      ],
    },
    4: {
      nav: "计划",
      eyebrow: "修复计划",
      status: "可 patch",
      title: "维护者可以直接交给 Agent",
      summary: "计划从协议合规推进到视觉清晰，再到验证闭环。",
      primaryLabel: "实施 checklist",
      secondaryLabel: "Patch notes",
      steps: [
        {
          label: "协议",
          detail: "定义 Topic、双语 metadata、reserved multi-beat 容器。",
          code: "[x] defineStyleTopic({ id: \"ready-agent-pickup\" })",
        },
        {
          label: "表达",
          detail: "每个场景都是同一份 issue brief 的不同分区。",
          code: "[x] issue / repro / scope / fix plan / acceptance",
        },
        {
          label: "动效",
          detail: "场景转场交给共享 track，fallback 使用 hard cut。",
          code: "[x] transitionKind=\"hard-cut\"",
        },
      ],
      side: [
        { label: "+", detail: "状态 chips 成为内部导航" },
        { label: "+", detail: "Beat slots 从 beat zero 预留最终布局" },
        { label: "-", detail: "不做装饰 dashboard card 或 generic board" },
      ],
    },
    5: {
      nav: "验收",
      eyebrow: "验收",
      status: "可接手",
      title: "合并前能看到接手标准",
      summary: "Issue 在范围、双语、转场安全和 typecheck 都满足时关闭。",
      primaryLabel: "验收检查",
      secondaryLabel: "交接回执",
      steps: [
        {
          label: "五段弧线",
          detail: "Issue、复现、范围、修复计划、验收全部存在。",
          code: "scenes.length === 5",
        },
        {
          label: "Beat 合约",
          detail: "Multi-beat 场景使用 reserved layout 和稳定 beat item。",
          code: "data-beat-layout-mode=\"reserved\"",
        },
        {
          label: "验证",
          detail: "最小要求校验通过且没有类型错误。",
          code: "npm run typecheck",
        },
      ],
      side: [
        { label: "Reviewer", detail: "先扫状态和边界" },
        { label: "Agent", detail: "无需重新发现即可开始" },
        { label: "Maintainer", detail: "能验证精确交接合约" },
      ],
    },
  },
};

const metadataScenes: Record<Language, TopicMetadata["scenes"]> = {
  en: [
    {
      id: 1,
      title: "Issue",
      beats: [
        {
          id: 0,
          action: "Open the maintainer ticket",
          title: "Issue #43: ready for agent pickup",
          body: "The ticket has enough context for implementation.",
        },
      ],
    },
    {
      id: 2,
      title: "Repro",
      beats: [
        {
          id: 0,
          action: "Show the entry path",
          title: "Open the failing state",
          body: "Load the assigned style and scene arc.",
        },
        {
          id: 1,
          action: "Expose the observed gap",
          title: "Confirm the gap",
          body: "Scope and acceptance are missing.",
        },
        {
          id: 2,
          action: "Freeze the case",
          title: "Freeze the case",
          body: "Thumbnail and reduced-motion paths stay readable.",
        },
      ],
    },
    {
      id: 3,
      title: "Scope",
      beats: [
        {
          id: 0,
          action: "List the working set",
          title: "The working set is explicit",
          body: "Only the topic module and optional CSS module are in scope.",
        },
        {
          id: 1,
          action: "Fence off non-goals",
          title: "Do not touch unrelated files",
          body: "Registry, tests, docs, and other styles stay unchanged.",
        },
      ],
    },
    {
      id: 4,
      title: "Fix plan",
      beats: [
        {
          id: 0,
          action: "Start with protocol",
          title: "Protocol",
          body: "Define topic and complete bilingual metadata.",
        },
        {
          id: 1,
          action: "Add presentation structure",
          title: "Presentation",
          body: "Make each scene a ticket section.",
        },
        {
          id: 2,
          action: "Lock transition behavior",
          title: "Motion",
          body: "Use SpatialSceneTrack with the assigned transition map.",
        },
      ],
    },
    {
      id: 5,
      title: "Acceptance",
      beats: [
        {
          id: 0,
          action: "Show acceptance criteria",
          title: "Pickup criteria are visible",
          body: "The handoff has scene, beat, and transition contracts.",
        },
        {
          id: 1,
          action: "Close with verification",
          title: "Verification",
          body: "The minimal required typecheck passes.",
        },
      ],
    },
  ],
  zh: [
    {
      id: 1,
      title: "Issue",
      beats: [
        {
          id: 0,
          action: "打开维护者 ticket",
          title: "Issue #43：可交给 Agent 接手",
          body: "Ticket 已有足够实施上下文。",
        },
      ],
    },
    {
      id: 2,
      title: "复现",
      beats: [
        {
          id: 0,
          action: "展示进入路径",
          title: "打开失败状态",
          body: "加载指定 style 和场景弧线。",
        },
        {
          id: 1,
          action: "暴露观测缺口",
          title: "确认缺口",
          body: "范围和验收项缺失。",
        },
        {
          id: 2,
          action: "冻结案例",
          title: "冻结案例",
          body: "缩略图和减少动画路径保持可读。",
        },
      ],
    },
    {
      id: 3,
      title: "范围",
      beats: [
        {
          id: 0,
          action: "列出工作集",
          title: "工作集是显性的",
          body: "只有 Topic 模块和可选 CSS module 在范围内。",
        },
        {
          id: 1,
          action: "圈定非目标",
          title: "不触碰无关文件",
          body: "Registry、tests、docs 和其它 styles 保持不变。",
        },
      ],
    },
    {
      id: 4,
      title: "修复计划",
      beats: [
        {
          id: 0,
          action: "从协议开始",
          title: "协议",
          body: "定义 Topic 并补齐双语 metadata。",
        },
        {
          id: 1,
          action: "加入表达结构",
          title: "表达",
          body: "每个场景都是 ticket 分区。",
        },
        {
          id: 2,
          action: "锁定转场行为",
          title: "动效",
          body: "用 SpatialSceneTrack 和指定 transition map。",
        },
      ],
    },
    {
      id: 5,
      title: "验收",
      beats: [
        {
          id: 0,
          action: "展示验收标准",
          title: "接手标准可见",
          body: "交接包含 scene、beat 和 transition 合约。",
        },
        {
          id: 1,
          action: "以验证关闭",
          title: "验证",
          body: "最小要求 typecheck 通过。",
        },
      ],
    },
  ],
};

function getVisibleBeat(sceneId: SceneId, beat: number): number {
  return Math.min(Math.max(beat, 0), BEAT_COUNTS[sceneId] - 1);
}

function isMultiBeat(sceneId: SceneId): boolean {
  return BEAT_COUNTS[sceneId] > 1;
}

function getStepVisibility(index: number, beat: number): "visible" | "muted" {
  return index <= beat ? "visible" : "muted";
}

function ScenePanel({
  sceneId,
  beat,
  language,
  isActive,
}: {
  sceneId: SceneId;
  beat: number;
  language: Language;
  isActive: boolean;
}) {
  const copy = COPY[language][sceneId];
  const visibleBeat = getVisibleBeat(sceneId, beat);
  const multiBeat = isMultiBeat(sceneId);

  return (
    <section
      className={styles.scene}
      data-current={isActive ? "true" : "false"}
      data-beat-layout-container={multiBeat ? "true" : undefined}
      data-beat-layout-mode={multiBeat ? "reserved" : undefined}
    >
      <header className={styles.issueHeader} data-beat-layout-item="true">
        <div className={styles.issueKicker}>
          <span className={styles.issueId}>FHS-43</span>
          <span className={styles.pathText}>src/styles/43-ready-agent-pickup.tsx</span>
        </div>
        <span className={styles.statusBadge}>{copy.status}</span>
      </header>

      <div className={styles.sceneGrid}>
        <main className={styles.mainColumn}>
          <div className={styles.titleBlock} data-beat-layout-item="true">
            <span className={styles.eyebrow}>{copy.eyebrow}</span>
            <h1>{copy.title}</h1>
            <p>{copy.summary}</p>
          </div>

          <section className={styles.ticketSection} data-beat-layout-item="true">
            <div className={styles.sectionHeader}>
              <span>{copy.primaryLabel}</span>
              <code>beat {visibleBeat}</code>
            </div>
            <div className={styles.stepList}>
              {copy.steps.map((step, index) => (
                <article
                  className={styles.stepRow}
                  data-beat-layout-item="true"
                  data-visible={getStepVisibility(index, visibleBeat)}
                  key={step.label}
                >
                  <div className={styles.checkCell}>
                    <span>{index <= visibleBeat ? "[x]" : "[ ]"}</span>
                  </div>
                  <div className={styles.stepCopy}>
                    <strong>{step.label}</strong>
                    <p>{step.detail}</p>
                    {step.code ? <code>{step.code}</code> : null}
                  </div>
                </article>
              ))}
            </div>
          </section>
        </main>

        <aside className={styles.sideColumn} data-beat-layout-item="true">
          <div className={styles.sectionHeader}>
            <span>{copy.secondaryLabel}</span>
            <code>{copy.nav.toLowerCase()}</code>
          </div>
          <div className={styles.sideStack}>
            {copy.side.map((item, index) => (
              <div
                className={styles.sideItem}
                data-beat-layout-item="true"
                data-visible={getStepVisibility(index, visibleBeat)}
                key={`${item.label}-${index}`}
              >
                <span>{item.label}</span>
                <p>{item.detail}</p>
              </div>
            ))}
          </div>
          <div className={styles.receipt} data-beat-layout-item="true">
            <span>{language === "zh" ? "交接状态" : "Pickup state"}</span>
            <strong>{copy.status}</strong>
          </div>
        </aside>
      </div>
    </section>
  );
}

function TicketStatusNav({
  activeScene,
  language,
  onNavigate,
}: {
  activeScene: number;
  language: Language;
  onNavigate?: (scene: number, beat: number) => void;
}) {
  return (
    <nav
      className={styles.statusNav}
      aria-label="Ticket status navigation"
      data-topic-navigation="true"
      data-navigation-geometry={NAVIGATION.geometry}
      data-navigation-carrier={NAVIGATION.carrier}
      data-navigation-invocation={NAVIGATION.invocation}
      data-navigation-feedback={NAVIGATION.feedback}
    >
      {SCENE_IDS.map((sceneId) => {
        const copy = COPY[language][sceneId];
        const isActive = sceneId === activeScene;
        return (
          <button
            className={styles.statusChip}
            data-active={isActive ? "true" : "false"}
            key={sceneId}
            onClick={(event) => {
              event.stopPropagation();
              onNavigate?.(sceneId, 0);
            }}
            type="button"
          >
            <span>{sceneId}</span>
            <strong>{copy.nav}</strong>
          </button>
        );
      })}
    </nav>
  );
}

function buildMetadata(lang: Language): TopicMetadata {
  return {
    theme: lang === "zh" ? "可交给 Agent 接手" : "Ready for Agent Pickup",
    densityLabel: lang === "zh" ? "阅读优先" : "Reading-first",
    heroScene: 1,
    colors: {
      bg: "#f6f8fa",
      ink: "#24292f",
      panel: "#ffffff",
    },
    typography: {
      header: "Inter 650",
      body: "IBM Plex Mono 400",
    },
    tags: [
      "text-report",
      "issue",
      "handoff",
      "maintainer",
      "tracker",
      "bilingual",
    ],
    fonts: ["Inter", "IBM Plex Mono", "cjk:Noto Sans SC"],
    scenes: metadataScenes[lang],
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
  const activeScene = SCENE_IDS.includes(scene as SceneId)
    ? (scene as SceneId)
    : 1;
  const motionReduced = reducedMotion || isThumbnail;

  return (
    <div
      className={styles.root}
      data-language={language}
      data-reduced-motion={motionReduced ? "true" : "false"}
    >
      <div className={styles.ticketShell}>
        <div className={styles.chromeBar}>
          <div className={styles.repoMark}>
            <span>frontend-harness-slides</span>
            <strong>{language === "zh" ? "可接手 issue" : "pickup issue"}</strong>
          </div>
          {!isThumbnail ? (
            <TicketStatusNav
              activeScene={activeScene}
              language={language}
              onNavigate={onNavigate}
            />
          ) : null}
        </div>

        <SpatialSceneTrack
          beat={beat}
          beatLayoutModes={BEAT_LAYOUT_MODES}
          className={styles.track}
          reducedMotion={motionReduced}
          renderScene={(sceneId, sceneBeat, isActive) => (
            <ScenePanel
              beat={sceneBeat}
              isActive={isActive}
              language={language}
              sceneId={(SCENE_IDS.includes(sceneId as SceneId)
                ? sceneId
                : 1) as SceneId}
            />
          )}
          scene={activeScene}
          sceneIds={SCENE_IDS}
          transitionKind="hard-cut"
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

export default defineTopic({
  id: "agent-pickup",
  styleId: "maintainer-issue-brief",
  title: {
    en: "Agent Pickup",
    zh: "Agent 接手",
  },
  modelId: "GPT 5.5",
  Stage: TopicStage,
  metadata,
  navigation: NAVIGATION,
  transitionScore: TRANSITION_SCORE,
  evidence: { kind: "none" },
});

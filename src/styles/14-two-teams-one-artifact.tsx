import type { BespokeStyleProps, StyleMetadata } from "../types";
import SpatialSceneTrack, {
  type BeatLayoutMode,
  type SceneTransitionMap,
} from "./SpatialSceneTrack";
import { defineStyleTopic } from "./topic";
import styles from "./14-two-teams-one-artifact.module.css";

type Lang = "en" | "zh";
type Side = "left" | "right" | "shared" | "risk";

interface BeatCopy {
  action: string;
  title: string;
  body: string;
}

interface BoardCard {
  side: Side;
  label: string;
  detail: string;
}

interface SceneCopy {
  kicker: string;
  title: string;
  subtitle: string;
  nav: string;
  leftRole: string;
  rightRole: string;
  centerLabel: string;
  seamLabel: string;
  artifactTitle: string;
  artifactBody: string;
  metric: string;
  leftItems: string[];
  rightItems: string[];
  boardCards: BoardCard[];
  beats: BeatCopy[];
}

const SCENE_IDS = [1, 2, 3, 4, 5] as const;
const BEAT_LAYOUT_MODES: Partial<Record<number, BeatLayoutMode>> = {
  1: "reserved",
  2: "reserved",
  3: "reserved",
  4: "reserved",
  5: "reserved",
};

const TRANSITION_MAP: SceneTransitionMap = {
  "1->2": "fade",
  "2->3": "slide-x",
  "3->4": "wipe",
  "4->5": "scale-fade",
};

const CONTENT: Record<Lang, Record<number, SceneCopy>> = {
  en: {
    1: {
      kicker: "Pair setup",
      title: "Two teams enter with one shared brief.",
      subtitle:
        "Before work starts, each side names its lane and the board shows where the handoff must land.",
      nav: "Setup",
      leftRole: "Team A / discovery",
      rightRole: "Team B / build",
      centerLabel: "Shared artifact",
      seamLabel: "Boundary made visible",
      artifactTitle: "Working brief",
      artifactBody:
        "Problem frame, constraints, owner lane, shared definition of done.",
      metric: "1 artifact / 2 owners",
      leftItems: ["User signal", "Decision context", "Risk notes"],
      rightItems: ["System shape", "Delivery path", "Validation hook"],
      boardCards: [
        { side: "left", label: "Frame", detail: "what must be true" },
        { side: "right", label: "Build", detail: "what can ship" },
        { side: "shared", label: "Done", detail: "one acceptance line" },
      ],
      beats: [
        {
          action: "Left lane opens",
          title: "Discovery lane",
          body: "Team A pins the customer and decision frame.",
        },
        {
          action: "Right lane opens",
          title: "Build lane",
          body: "Team B pins the system path and validation hook.",
        },
        {
          action: "Shared brief locks",
          title: "One artifact",
          body: "The seam becomes a shared definition of done.",
        },
      ],
    },
    2: {
      kicker: "Handoff gap",
      title: "The artifact breaks when context crosses late.",
      subtitle:
        "A handoff that waits for completion creates a gap: assumptions move faster than the document.",
      nav: "Gap",
      leftRole: "Team A / notes",
      rightRole: "Team B / interpretation",
      centerLabel: "Gap zone",
      seamLabel: "Missing sync",
      artifactTitle: "Brief drift",
      artifactBody:
        "Intent is present on one side; implementation reads a thinner version.",
      metric: "3 unresolved seams",
      leftItems: ["Decision why", "Edge cases", "Open tradeoff"],
      rightItems: ["API shape", "Milestone plan", "QA scenario"],
      boardCards: [
        { side: "left", label: "Assumption", detail: "kept in notes" },
        { side: "risk", label: "Gap", detail: "not on the board" },
        { side: "right", label: "Rewrite", detail: "made too late" },
      ],
      beats: [
        {
          action: "Notes pile up",
          title: "Context waits",
          body: "The left lane has meaning that the artifact does not yet carry.",
        },
        {
          action: "Gap is marked",
          title: "Handoff split",
          body: "The seam turns red because the receiving lane must guess.",
        },
        {
          action: "Repair target appears",
          title: "Move sync earlier",
          body: "The board needs a shared checkpoint before the next pass.",
        },
      ],
    },
    3: {
      kicker: "Shared board",
      title: "Both teams edit the same surface.",
      subtitle:
        "The center expands from a handoff target into the place where evidence, constraints, and decisions converge.",
      nav: "Board",
      leftRole: "Team A / evidence",
      rightRole: "Team B / proof",
      centerLabel: "Live pairing board",
      seamLabel: "Co-edit seam",
      artifactTitle: "Shared board",
      artifactBody:
        "Claims, system choices, owner marks, and acceptance proof live together.",
      metric: "6 paired cards",
      leftItems: ["Customer quote", "Priority line", "Decision owner"],
      rightItems: ["Interface note", "Test hook", "Release guard"],
      boardCards: [
        { side: "left", label: "Evidence", detail: "why this matters" },
        { side: "right", label: "Proof", detail: "how we know" },
        { side: "shared", label: "Choice", detail: "what changes" },
      ],
      beats: [
        {
          action: "Evidence joins",
          title: "Left contribution",
          body: "Discovery moves from side notes into the shared surface.",
        },
        {
          action: "Proof joins",
          title: "Right contribution",
          body: "Build constraints and tests sit beside the evidence.",
        },
        {
          action: "Decision joins",
          title: "Shared choice",
          body: "The artifact becomes the meeting point, not a delivery receipt.",
        },
      ],
    },
    4: {
      kicker: "Sync cadence",
      title: "A small rhythm keeps the board honest.",
      subtitle:
        "Short paired checks replace the big late review: each turn asks whether the artifact still carries both sides.",
      nav: "Cadence",
      leftRole: "Team A / signal",
      rightRole: "Team B / delivery",
      centerLabel: "Cadence rail",
      seamLabel: "Every pass syncs",
      artifactTitle: "Check cycle",
      artifactBody:
        "Frame, add proof, reconcile, repeat before drift becomes rework.",
      metric: "15 min sync / 1 board",
      leftItems: ["Frame changed?", "User impact clear?", "Risk named?"],
      rightItems: ["Proof added?", "Path viable?", "Guard ready?"],
      boardCards: [
        { side: "shared", label: "Frame", detail: "start together" },
        { side: "shared", label: "Proof", detail: "check together" },
        { side: "shared", label: "Lock", detail: "ship together" },
      ],
      beats: [
        {
          action: "First sync lights",
          title: "Frame check",
          body: "Both teams confirm the board still says the same problem.",
        },
        {
          action: "Second sync lights",
          title: "Proof check",
          body: "Evidence and implementation proof are updated together.",
        },
        {
          action: "Third sync lights",
          title: "Lock check",
          body: "The final pass closes open seams before shipping.",
        },
      ],
    },
    5: {
      kicker: "Paired result",
      title: "The artifact leaves with both teams attached.",
      subtitle:
        "The final board is not a transcript. It is the smallest object that preserves intent, proof, and ownership.",
      nav: "Result",
      leftRole: "Team A / intent",
      rightRole: "Team B / proof",
      centerLabel: "Paired result",
      seamLabel: "Resolved seam",
      artifactTitle: "One artifact",
      artifactBody:
        "A durable brief with paired ownership and a visible acceptance trail.",
      metric: "0 silent handoffs",
      leftItems: ["Intent preserved", "Tradeoff named", "Owner clear"],
      rightItems: ["Proof attached", "Guard shipped", "Next signal set"],
      boardCards: [
        { side: "left", label: "Intent", detail: "still legible" },
        { side: "right", label: "Proof", detail: "still attached" },
        { side: "shared", label: "Artifact", detail: "ready to travel" },
      ],
      beats: [
        {
          action: "Intent resolves",
          title: "No lost why",
          body: "The final object keeps the decision frame visible.",
        },
        {
          action: "Proof resolves",
          title: "No loose how",
          body: "The delivery proof travels with the artifact.",
        },
        {
          action: "Pair closes",
          title: "One durable object",
          body: "The artifact can move without becoming a handoff gap.",
        },
      ],
    },
  },
  zh: {
    1: {
      kicker: "配对建立",
      title: "两个团队从同一份简报开始。",
      subtitle: "开工前，双方先标出自己的分工，也标出交接必须落到哪里。",
      nav: "建立",
      leftRole: "团队 A / 发现",
      rightRole: "团队 B / 构建",
      centerLabel: "共享产物",
      seamLabel: "边界先可见",
      artifactTitle: "工作简报",
      artifactBody: "问题框架、约束、负责人、共同的完成定义。",
      metric: "1 份产物 / 2 个 owner",
      leftItems: ["用户信号", "决策背景", "风险备注"],
      rightItems: ["系统形态", "交付路径", "验证钩子"],
      boardCards: [
        { side: "left", label: "框架", detail: "必须成立的条件" },
        { side: "right", label: "构建", detail: "可以交付的形态" },
        { side: "shared", label: "完成", detail: "一条验收线" },
      ],
      beats: [
        {
          action: "左侧分工出现",
          title: "发现分工",
          body: "团队 A 固定用户、背景和决策框架。",
        },
        {
          action: "右侧分工出现",
          title: "构建分工",
          body: "团队 B 固定系统路径和验证方式。",
        },
        {
          action: "共享简报锁定",
          title: "同一份产物",
          body: "中间边界变成共同的完成定义。",
        },
      ],
    },
    2: {
      kicker: "交接缺口",
      title: "上下文太晚交接，产物就会断裂。",
      subtitle: "等完成后再交接，会让假设比文档走得更快，接收方只能猜。",
      nav: "缺口",
      leftRole: "团队 A / 笔记",
      rightRole: "团队 B / 解读",
      centerLabel: "缺口区",
      seamLabel: "同步缺失",
      artifactTitle: "简报漂移",
      artifactBody: "意图停在一侧，另一侧只能读到变薄的版本。",
      metric: "3 个未闭合 seam",
      leftItems: ["为什么决策", "边界情况", "未定取舍"],
      rightItems: ["API 形态", "里程碑", "QA 场景"],
      boardCards: [
        { side: "left", label: "假设", detail: "留在笔记里" },
        { side: "risk", label: "缺口", detail: "没有上板" },
        { side: "right", label: "返工", detail: "出现得太晚" },
      ],
      beats: [
        {
          action: "笔记开始堆积",
          title: "上下文等待",
          body: "左侧有含义，但产物还没有承载。",
        },
        {
          action: "缺口被标记",
          title: "交接断开",
          body: "接收方开始猜，中间边界变红。",
        },
        {
          action: "修复目标出现",
          title: "提前同步",
          body: "下一轮之前，先把共享检查点放上板。",
        },
      ],
    },
    3: {
      kicker: "共享白板",
      title: "双方开始编辑同一个表面。",
      subtitle: "中心不再只是交接目标，而是证据、约束和决策汇合的位置。",
      nav: "白板",
      leftRole: "团队 A / 证据",
      rightRole: "团队 B / 证明",
      centerLabel: "实时配对白板",
      seamLabel: "共同编辑",
      artifactTitle: "共享白板",
      artifactBody: "论点、系统选择、owner 标记和验收证明放在一起。",
      metric: "6 张配对卡片",
      leftItems: ["用户原话", "优先级线", "决策 owner"],
      rightItems: ["接口备注", "测试钩子", "发布护栏"],
      boardCards: [
        { side: "left", label: "证据", detail: "为什么重要" },
        { side: "right", label: "证明", detail: "怎么知道" },
        { side: "shared", label: "选择", detail: "改变什么" },
      ],
      beats: [
        {
          action: "证据进入中心",
          title: "左侧贡献",
          body: "发现信息从旁注进入共享表面。",
        },
        {
          action: "证明进入中心",
          title: "右侧贡献",
          body: "构建约束和测试证明贴到证据旁边。",
        },
        {
          action: "决策进入中心",
          title: "共同选择",
          body: "产物变成会合点，而不是交付回执。",
        },
      ],
    },
    4: {
      kicker: "同步节奏",
      title: "一个小节奏，让白板保持诚实。",
      subtitle: "短配对检查取代大型晚评审：每一轮都确认产物仍承载双方信息。",
      nav: "节奏",
      leftRole: "团队 A / 信号",
      rightRole: "团队 B / 交付",
      centerLabel: "节奏轨道",
      seamLabel: "每轮都同步",
      artifactTitle: "检查循环",
      artifactBody: "定框、补证明、对齐、重复，在漂移变返工前处理。",
      metric: "15 分钟同步 / 1 块板",
      leftItems: ["框架变了吗", "用户影响清楚吗", "风险命名了吗"],
      rightItems: ["证明补了吗", "路径可行吗", "护栏准备了吗"],
      boardCards: [
        { side: "shared", label: "定框", detail: "一起开始" },
        { side: "shared", label: "证明", detail: "一起检查" },
        { side: "shared", label: "锁定", detail: "一起交付" },
      ],
      beats: [
        {
          action: "第一次同步点亮",
          title: "框架检查",
          body: "双方确认白板仍在描述同一个问题。",
        },
        {
          action: "第二次同步点亮",
          title: "证明检查",
          body: "证据和实现证明一起更新。",
        },
        {
          action: "第三次同步点亮",
          title: "锁定检查",
          body: "最终轮在交付前关闭未决 seam。",
        },
      ],
    },
    5: {
      kicker: "配对结果",
      title: "产物离开时，两个团队仍在上面。",
      subtitle: "最终白板不是会议记录，而是保留意图、证明和归属的最小对象。",
      nav: "结果",
      leftRole: "团队 A / 意图",
      rightRole: "团队 B / 证明",
      centerLabel: "配对结果",
      seamLabel: "边界闭合",
      artifactTitle: "同一份产物",
      artifactBody: "一份耐用简报，带着双 owner 和可见验收轨迹。",
      metric: "0 次静默交接",
      leftItems: ["意图保留", "取舍命名", "owner 清楚"],
      rightItems: ["证明附着", "护栏已交付", "下一信号设定"],
      boardCards: [
        { side: "left", label: "意图", detail: "仍然可读" },
        { side: "right", label: "证明", detail: "仍然附着" },
        { side: "shared", label: "产物", detail: "可以流转" },
      ],
      beats: [
        {
          action: "意图闭合",
          title: "不丢 why",
          body: "最终对象保留决策框架。",
        },
        {
          action: "证明闭合",
          title: "不散 how",
          body: "交付证明跟着产物一起走。",
        },
        {
          action: "配对结束",
          title: "一个耐用对象",
          body: "产物流转时，不再变成交接缺口。",
        },
      ],
    },
  },
};

const SCENE_CLASS: Record<number, string> = {
  1: styles.scenePairSetup,
  2: styles.sceneHandoffGap,
  3: styles.sceneSharedBoard,
  4: styles.sceneSyncCadence,
  5: styles.scenePairedResult,
};

function clampBeat(beat: number, maxBeat: number): number {
  if (!Number.isFinite(beat)) return 0;
  return Math.max(0, Math.min(Math.floor(beat), maxBeat));
}

function getSceneCopy(scene: number, language: Lang): SceneCopy {
  return CONTENT[language][scene] ?? CONTENT[language][1];
}

function isVisible(index: number, beat: number): boolean {
  return index <= beat;
}

function ScenePanel({
  sceneId,
  beat,
  language,
}: {
  sceneId: number;
  beat: number;
  language: Lang;
}) {
  const copy = getSceneCopy(sceneId, language);
  const activeBeat = clampBeat(beat, copy.beats.length - 1);

  return (
    <section
      className={[styles.scene, SCENE_CLASS[sceneId]].join(" ")}
      data-scene={sceneId}
      aria-label={copy.title}
    >
      <div className={styles.header} data-beat-layout-item="true">
        <div className={styles.sceneNumber}>0{sceneId}</div>
        <div className={styles.headerCopy}>
          <p className={styles.kicker}>{copy.kicker}</p>
          <h1>{copy.title}</h1>
          <p>{copy.subtitle}</p>
        </div>
        <div className={styles.metricPill}>{copy.metric}</div>
      </div>

      <div className={styles.workspace} data-beat-layout-item="true">
        <PartnerPane
          align="left"
          label={copy.leftRole}
          items={copy.leftItems}
          activeBeat={activeBeat}
        />
        <ArtifactBoard copy={copy} activeBeat={activeBeat} />
        <PartnerPane
          align="right"
          label={copy.rightRole}
          items={copy.rightItems}
          activeBeat={activeBeat}
        />
      </div>

      <div className={styles.beatRail} data-beat-layout-item="true">
        {copy.beats.map((item, index) => (
          <div
            className={styles.beatMarker}
            data-active={index === activeBeat ? "true" : "false"}
            data-complete={index <= activeBeat ? "true" : "false"}
            key={item.title}
          >
            <span className={styles.beatDot}>{index + 1}</span>
            <span className={styles.beatText}>
              <strong>{item.title}</strong>
              <span>{item.body}</span>
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

function PartnerPane({
  align,
  label,
  items,
  activeBeat,
}: {
  align: "left" | "right";
  label: string;
  items: string[];
  activeBeat: number;
}) {
  return (
    <aside className={styles.partnerPane} data-align={align}>
      <div className={styles.roleTag}>{label}</div>
      <div className={styles.partnerStack}>
        {items.map((item, index) => (
          <div
            className={styles.partnerItem}
            data-visible={isVisible(index, activeBeat) ? "true" : "false"}
            data-beat-layout-item="true"
            key={item}
          >
            <span className={styles.itemIndex}>0{index + 1}</span>
            <span>{item}</span>
          </div>
        ))}
      </div>
    </aside>
  );
}

function ArtifactBoard({
  copy,
  activeBeat,
}: {
  copy: SceneCopy;
  activeBeat: number;
}) {
  return (
    <main className={styles.artifactBoard}>
      <div className={styles.centerHeader}>
        <span>{copy.centerLabel}</span>
        <strong>{copy.seamLabel}</strong>
      </div>

      <div className={styles.seamLine} aria-hidden="true">
        <span />
        <span />
        <span />
      </div>

      <div className={styles.artifactCard} data-beat-layout-item="true">
        <p>{copy.artifactTitle}</p>
        <h2>{copy.artifactBody}</h2>
      </div>

      <div className={styles.cardGrid}>
        {copy.boardCards.map((card, index) => (
          <div
            className={styles.boardCard}
            data-side={card.side}
            data-visible={isVisible(index, activeBeat) ? "true" : "false"}
            data-beat-layout-item="true"
            key={`${card.side}-${card.label}`}
          >
            <span>{card.label}</span>
            <strong>{card.detail}</strong>
          </div>
        ))}
      </div>
    </main>
  );
}

function SceneLatchNav({
  scene,
  language,
  onNavigate,
}: {
  scene: number;
  language: Lang;
  onNavigate?: (scene: number, beat: number) => void;
}) {
  return (
    <nav className={styles.latchNav} aria-label="Scene navigation">
      <div className={styles.latchColumn} data-side="left">
        {SCENE_IDS.map((sceneId) => {
          const copy = getSceneCopy(sceneId, language);
          return (
            <button
              aria-label={`Scene ${sceneId}: ${copy.nav}`}
              className={styles.latchButton}
              data-active={sceneId === scene ? "true" : "false"}
              disabled={!onNavigate}
              key={`left-${sceneId}`}
              onClick={() => onNavigate?.(sceneId, 0)}
              type="button"
            >
              <span>0{sceneId}</span>
            </button>
          );
        })}
      </div>
      <div className={styles.latchColumn} data-side="right">
        {SCENE_IDS.map((sceneId) => {
          const copy = getSceneCopy(sceneId, language);
          return (
            <button
              aria-label={`Scene ${sceneId}: ${copy.nav}`}
              className={styles.latchLabel}
              data-active={sceneId === scene ? "true" : "false"}
              disabled={!onNavigate}
              key={`right-${sceneId}`}
              onClick={() => onNavigate?.(sceneId, 0)}
              type="button"
            >
              {copy.nav}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

export function getMetadata(lang: Lang): StyleMetadata {
  return {
    id: "collaborative-pairing-board",
    band: "balanced-hybrid",
    name: lang === "zh" ? "协作配对板" : "Collaborative Pairing Board",
    theme:
      lang === "zh"
        ? "Two Teams, One Artifact / 两个团队，一份产物"
        : "Two Teams, One Artifact",
    densityLabel: lang === "zh" ? "结构化配对" : "Structured Pairing",
    heroScene: 3,
    colors: {
      bg: "#f6f1e8",
      ink: "#27313a",
      panel: "#fffaf0",
    },
    typography: {
      header: "Inter 700",
      body: "Inter 400",
    },
    tags: ["collaboration", "pairing", "whiteboard", "bilingual", "structured"],
    fonts: ["Inter", "cjk:Noto Sans SC"],
    scenes: SCENE_IDS.map((sceneId) => {
      const copy = getSceneCopy(sceneId, lang);
      return {
        id: sceneId,
        title: copy.kicker,
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

export default function TwoTeamsOneArtifactV2({
  scene,
  beat,
  language,
  isThumbnail,
  reducedMotion,
  onNavigate,
}: BespokeStyleProps) {
  const safeScene = SCENE_IDS.includes(scene as (typeof SCENE_IDS)[number])
    ? scene
    : 1;
  const sceneCopy = getSceneCopy(safeScene, language);
  const noMotion = reducedMotion || isThumbnail;
  const safeBeat = isThumbnail
    ? sceneCopy.beats.length - 1
    : clampBeat(beat, sceneCopy.beats.length - 1);
  return (
    <div
      className={[styles.root, noMotion ? styles.reducedMotion : ""]
        .filter(Boolean)
        .join(" ")}
      data-style-id="14"
      data-topic-origin="curated"
    >
      <div className={styles.surfaceGrid} aria-hidden="true" />
      <SpatialSceneTrack
        beat={safeBeat}
        beatLayoutModes={BEAT_LAYOUT_MODES}
        className={styles.sceneTrack}
        reducedMotion={noMotion}
        renderScene={(sceneId, sceneBeat) => (
          <ScenePanel beat={sceneBeat} language={language} sceneId={sceneId} />
        )}
        scene={safeScene}
        sceneIds={[...SCENE_IDS]}
        transitionKind="fade"
        transitionMap={TRANSITION_MAP}
      />
      {!isThumbnail && (
        <SceneLatchNav
          language={language}
          onNavigate={onNavigate}
          scene={safeScene}
        />
      )}
    </div>
  );
}

export const twoTeamsOneArtifactTopic = defineStyleTopic({
  id: "shared-artifact",
  topic: {
    en: "Shared Artifact",
    zh: "共享产物",
  },
  model: "GPT-5.5",
  component: TwoTeamsOneArtifactV2,
  getMetadata,
});

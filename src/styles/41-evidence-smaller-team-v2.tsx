import type { CSSProperties, MouseEvent, ReactElement } from "react";
import type { BespokeStyleProps, StyleMetadata } from "../types";
import SpatialSceneTrack, {
  type BeatLayoutMode,
  type SceneTransitionMap,
} from "./SpatialSceneTrack";
import { defineStyleVersion } from "./version";

type Language = "en" | "zh";
type SceneId = 1 | 2 | 3 | 4 | 5;

interface BeatCopy {
  id: number;
  action: string;
  title: string;
  body: string;
}

interface EvidenceItem {
  label: string;
  value: string;
  detail: string;
  before?: string;
  after?: string;
  width: string;
}

interface SceneCopy {
  id: SceneId;
  tab: string;
  eyebrow: string;
  title: string;
  summary: string;
  note: string;
  beats: BeatCopy[];
  cards?: Array<{
    label: string;
    detail: string;
  }>;
  evidence?: EvidenceItem[];
  recommendations?: Array<{
    label: string;
    detail: string;
  }>;
  memoLine?: string;
}

interface DeckCopy {
  header: {
    label: string;
    subjectLabel: string;
    subject: string;
    dateLabel: string;
    date: string;
    confidenceLabel: string;
    confidence: string;
  };
  scenes: Record<SceneId, SceneCopy>;
}

const TRANSITION_MAP: SceneTransitionMap = {
  "1->2": "fade",
  "2->3": "wipe",
  "3->4": "scale-fade",
  "4->5": "hard-cut",
};

const BEAT_LAYOUT_MODES: Partial<Record<number, BeatLayoutMode>> = {
  2: "reserved",
  3: "reserved",
  4: "reserved",
};

const SCENE_IDS: SceneId[] = [1, 2, 3, 4, 5];

const COLORS = {
  paper: "#fbfaf6",
  ink: "#191613",
  muted: "#6e665f",
  faint: "#ddd7cf",
  hairline: "#cfc6bc",
  panel: "#f3f0ea",
  accent: "#5b2333",
  accentSoft: "#efe2e5",
};

const DECK_COPY: Record<Language, DeckCopy> = {
  en: {
    header: {
      label: "RESEARCH MEMO",
      subjectLabel: "Subject",
      subject: "Evidence for a Smaller Team",
      dateLabel: "Window",
      date: "12-week pilot",
      confidenceLabel: "Readout",
      confidence: "Evidence-led",
    },
    scenes: {
      1: {
        id: 1,
        tab: "Question",
        eyebrow: "Question",
        title: "Should the team get smaller?",
        summary:
          "Frame team size as a coordination hypothesis, not a cost target.",
        note:
          "Test whether fewer handoffs improve decisions while preserving scope and quality.",
        beats: [
          {
            id: 0,
            action: "Frame the staffing question",
            title: "Smaller team question",
            body: "Team size is evaluated through handoffs, review wait, shipped scope, and rework.",
          },
        ],
        cards: [
          {
            label: "Primary doubt",
            detail: "Will output drop when the pod loses three rotating owners?",
          },
          {
            label: "Working claim",
            detail: "Capacity risk is acceptable only if coordination load falls.",
          },
        ],
      },
      2: {
        id: 2,
        tab: "Method",
        eyebrow: "Method",
        title: "Keep the work lane constant",
        summary:
          "A 5-person pod was compared with the prior 8-person rotation on similar maintenance work.",
        note:
          "The comparison normalizes by scope class and excludes incident-heavy weeks.",
        beats: [
          {
            id: 0,
            action: "Define the matched work lane",
            title: "Matched lane",
            body: "Same service area, release gate, and incident mix.",
          },
          {
            id: 1,
            action: "Add the evidence sources",
            title: "Evidence sources",
            body: "Delivery logs, review timestamps, and owner notes.",
          },
          {
            id: 2,
            action: "Show the comparison controls",
            title: "Comparison controls",
            body: "Normalize by scope class and remove outage weeks.",
          },
        ],
        cards: [
          {
            label: "Matched lane",
            detail: "Same service area, release gate, and incident mix.",
          },
          {
            label: "Evidence sources",
            detail: "Delivery logs, review timestamps, and owner notes.",
          },
          {
            label: "Controls",
            detail: "Scope class normalized; outage weeks removed.",
          },
        ],
      },
      3: {
        id: 3,
        tab: "Findings",
        eyebrow: "Findings",
        title: "Fewer handoffs did not reduce output",
        summary:
          "The smaller pod kept throughput near baseline while decision wait moved materially.",
        note:
          "Quality did not show a meaningful regression during the pilot window.",
        beats: [
          {
            id: 0,
            action: "Show shipped scope",
            title: "Scope held",
            body: "The pod shipped 92% of the prior 8-person baseline.",
          },
          {
            id: 1,
            action: "Show decision latency",
            title: "Review wait fell",
            body: "Median queue time moved from 2.8 days to 1.4 days.",
          },
          {
            id: 2,
            action: "Show quality guardrail",
            title: "Rework stayed flat",
            body: "Follow-up patches moved from 6.1% to 6.4%.",
          },
        ],
        evidence: [
          {
            label: "Shipped scope",
            value: "92%",
            detail: "of prior 8-person baseline",
            width: "92%",
          },
          {
            label: "Review wait",
            value: "-50%",
            detail: "median queue time, 2.8d to 1.4d",
            before: "2.8d",
            after: "1.4d",
            width: "50%",
          },
          {
            label: "Rework",
            value: "Flat",
            detail: "6.1% to 6.4% follow-up patches",
            before: "6.1%",
            after: "6.4%",
            width: "64%",
          },
        ],
      },
      4: {
        id: 4,
        tab: "Recommendation",
        eyebrow: "Recommendation",
        title: "Make the smaller pod the default lane",
        summary:
          "Approve a time-boxed default: five accountable owners, explicit escalation, weekly evidence review.",
        note:
          "The recommendation is conditional; scope miss or rework drift should stop the pilot.",
        beats: [
          {
            id: 0,
            action: "State the operating recommendation",
            title: "Default lane",
            body: "Run the next maintenance cycle with five owners.",
          },
          {
            id: 1,
            action: "Add the guardrails",
            title: "Guardrails",
            body: "Escalate specialist review only by trigger; stop after two missed cycles.",
          },
        ],
        recommendations: [
          {
            label: "Default size",
            detail: "Five accountable owners for the maintenance lane.",
          },
          {
            label: "Escalation",
            detail: "Add specialists only for pre-declared review triggers.",
          },
          {
            label: "Stop rule",
            detail: "Pause if scope misses for two cycles or rework exceeds 9%.",
          },
        ],
      },
      5: {
        id: 5,
        tab: "Memo line",
        eyebrow: "Memo line",
        title: "The decision line",
        summary:
          "The team should be smaller only where coordination cost is the constraint.",
        note: "Final memo sentence for the readout.",
        memoLine:
          "Smaller is justified only when fewer handoffs improve decisions without hiding capacity loss.",
        beats: [
          {
            id: 0,
            action: "Hold the final memo line",
            title: "Memo line",
            body: "Smaller is justified only when fewer handoffs improve decisions without hiding capacity loss.",
          },
        ],
      },
    },
  },
  zh: {
    header: {
      label: "研究备忘录",
      subjectLabel: "主题",
      subject: "小团队证据",
      dateLabel: "窗口",
      date: "12 周试点",
      confidenceLabel: "读出",
      confidence: "证据优先",
    },
    scenes: {
      1: {
        id: 1,
        tab: "问题",
        eyebrow: "问题",
        title: "团队应该变小吗？",
        summary: "把团队规模当作协作假设验证，而不是成本目标。",
        note: "检验减少交接是否能改善决策，同时保住范围与质量。",
        beats: [
          {
            id: 0,
            action: "界定人员规模问题",
            title: "小团队问题",
            body: "用交接次数、评审等待、交付范围和返工率评估团队规模。",
          },
        ],
        cards: [
          {
            label: "主要疑问",
            detail: "减少三个轮值 owner 后，产出是否会下降？",
          },
          {
            label: "工作假设",
            detail: "只有协作负担下降时，容量风险才可接受。",
          },
        ],
      },
      2: {
        id: 2,
        tab: "方法",
        eyebrow: "方法",
        title: "保持工作泳道不变",
        summary: "将 5 人小组与原 8 人轮值小组在相似维护工作上比较。",
        note: "比较按范围类别归一，并排除事故高峰周。",
        beats: [
          {
            id: 0,
            action: "定义匹配工作泳道",
            title: "匹配泳道",
            body: "相同服务域、发布门禁和事故组合。",
          },
          {
            id: 1,
            action: "加入证据来源",
            title: "证据来源",
            body: "交付日志、评审时间戳和 owner 记录。",
          },
          {
            id: 2,
            action: "展示比较控制",
            title: "比较控制",
            body: "按范围类别归一，并移除故障周。",
          },
        ],
        cards: [
          {
            label: "匹配泳道",
            detail: "相同服务域、发布门禁和事故组合。",
          },
          {
            label: "证据来源",
            detail: "交付日志、评审时间戳和 owner 记录。",
          },
          {
            label: "控制项",
            detail: "范围类别归一，故障周移除。",
          },
        ],
      },
      3: {
        id: 3,
        tab: "发现",
        eyebrow: "发现",
        title: "交接更少，产出没有明显下降",
        summary: "小团队维持接近基线的吞吐，同时决策等待显著下降。",
        note: "试点窗口内质量没有出现有意义的回退。",
        beats: [
          {
            id: 0,
            action: "展示交付范围",
            title: "范围保持",
            body: "小组交付了原 8 人基线的 92%。",
          },
          {
            id: 1,
            action: "展示决策延迟",
            title: "评审等待下降",
            body: "中位排队时间从 2.8 天降至 1.4 天。",
          },
          {
            id: 2,
            action: "展示质量护栏",
            title: "返工持平",
            body: "后续补丁从 6.1% 到 6.4%。",
          },
        ],
        evidence: [
          {
            label: "交付范围",
            value: "92%",
            detail: "相对原 8 人基线",
            width: "92%",
          },
          {
            label: "评审等待",
            value: "-50%",
            detail: "中位排队时间，2.8 天到 1.4 天",
            before: "2.8天",
            after: "1.4天",
            width: "50%",
          },
          {
            label: "返工",
            value: "持平",
            detail: "后续补丁 6.1% 到 6.4%",
            before: "6.1%",
            after: "6.4%",
            width: "64%",
          },
        ],
      },
      4: {
        id: 4,
        tab: "建议",
        eyebrow: "建议",
        title: "将小团队设为默认泳道",
        summary: "批准一个有时限的默认方案：5 名 owner、明确升级、每周证据复盘。",
        note: "建议是有条件的；范围失守或返工漂移应停止试点。",
        beats: [
          {
            id: 0,
            action: "给出运行建议",
            title: "默认泳道",
            body: "下一轮维护周期使用 5 名 owner。",
          },
          {
            id: 1,
            action: "加入护栏",
            title: "护栏",
            body: "只按触发条件升级专家评审；连续两轮失守则停止。",
          },
        ],
        recommendations: [
          {
            label: "默认规模",
            detail: "维护泳道由 5 名明确 owner 负责。",
          },
          {
            label: "升级机制",
            detail: "只有命中预设评审触发条件时加入专家。",
          },
          {
            label: "停止规则",
            detail: "范围连续两轮失守，或返工超过 9%，暂停。",
          },
        ],
      },
      5: {
        id: 5,
        tab: "结论",
        eyebrow: "备忘录结论",
        title: "决策句",
        summary: "只有当协作成本才是约束时，团队才应该更小。",
        note: "读出的最后一句备忘录。",
        memoLine: "更小的团队，只有在减少交接能改善决策且不掩盖容量损失时，才有依据。",
        beats: [
          {
            id: 0,
            action: "停留在最终备忘录句",
            title: "备忘录结论",
            body: "更小的团队，只有在减少交接能改善决策且不掩盖容量损失时，才有依据。",
          },
        ],
      },
    },
  },
};

function clampBeat(scene: SceneCopy, beat: number): number {
  return Math.max(0, Math.min(beat, scene.beats.length - 1));
}

function getSceneCopy(language: Language, sceneId: number): SceneCopy {
  return DECK_COPY[language].scenes[(SCENE_IDS.includes(sceneId as SceneId) ? sceneId : 1) as SceneId];
}

function revealStyle(isVisible: boolean, reducedMotion: boolean): CSSProperties {
  return {
    opacity: isVisible ? 1 : 0.18,
    transform: isVisible ? "translateY(0)" : "translateY(0.7cqh)",
    transition: reducedMotion
      ? "none"
      : "opacity 420ms ease, transform 420ms ease, border-color 420ms ease",
  };
}

function mutedRevealStyle(isVisible: boolean, reducedMotion: boolean): CSSProperties {
  return {
    opacity: isVisible ? 1 : 0.28,
    transition: reducedMotion ? "none" : "opacity 360ms ease",
  };
}

function MetadataHeader({
  copy,
  language,
}: {
  copy: DeckCopy;
  language: Language;
}) {
  return (
    <header
      style={{
        position: "absolute",
        top: "4.4cqh",
        left: "5.2cqw",
        right: "5.2cqw",
        height: "9.6cqh",
        borderBottom: `0.07cqw solid ${COLORS.hairline}`,
        display: "grid",
        gridTemplateColumns: "1fr 1.6fr 1fr",
        alignItems: "start",
        gap: "2cqw",
        color: COLORS.ink,
        fontFamily:
          language === "zh"
            ? "'Songti SC', 'Noto Serif SC', serif"
            : "Georgia, 'Times New Roman', serif",
      }}
    >
      <div data-beat-layout-item="true">
        <div
          style={{
            fontSize: "1.02cqw",
            textTransform: "uppercase",
            color: COLORS.accent,
            fontWeight: 700,
          }}
        >
          {copy.header.label}
        </div>
        <div
          style={{
            marginTop: "1cqh",
            fontSize: "1.35cqw",
            color: COLORS.muted,
            fontFamily:
              language === "zh"
                ? "'PingFang SC', 'Noto Sans SC', sans-serif"
                : "Aptos, 'Segoe UI', sans-serif",
          }}
        >
          {copy.header.confidenceLabel}: {copy.header.confidence}
        </div>
      </div>
      <div data-beat-layout-item="true">
        <div
          style={{
            fontSize: "0.9cqw",
            textTransform: "uppercase",
            color: COLORS.muted,
            fontFamily:
              language === "zh"
                ? "'PingFang SC', 'Noto Sans SC', sans-serif"
                : "Aptos, 'Segoe UI', sans-serif",
          }}
        >
          {copy.header.subjectLabel}
        </div>
        <div
          style={{
            marginTop: "0.7cqh",
            fontSize: language === "zh" ? "2.1cqw" : "2.25cqw",
            lineHeight: 1.05,
            fontWeight: 700,
          }}
        >
          {copy.header.subject}
        </div>
      </div>
      <div
        data-beat-layout-item="true"
        style={{
          textAlign: "right",
          fontFamily:
            language === "zh"
              ? "'PingFang SC', 'Noto Sans SC', sans-serif"
              : "Aptos, 'Segoe UI', sans-serif",
        }}
      >
        <div
          style={{
            fontSize: "0.9cqw",
            textTransform: "uppercase",
            color: COLORS.muted,
          }}
        >
          {copy.header.dateLabel}
        </div>
        <div
          style={{
            marginTop: "0.7cqh",
            fontSize: "1.45cqw",
            color: COLORS.ink,
            fontWeight: 650,
          }}
        >
          {copy.header.date}
        </div>
      </div>
    </header>
  );
}

function MemoTabs({
  language,
  scene,
  onNavigate,
}: {
  language: Language;
  scene: number;
  onNavigate?: (scene: number, beat: number) => void;
}) {
  const scenes = DECK_COPY[language].scenes;

  return (
    <nav
      aria-label={language === "zh" ? "备忘录章节" : "Memo sections"}
      style={{
        position: "absolute",
        left: "5.2cqw",
        right: "5.2cqw",
        bottom: "3.2cqh",
        height: "5cqh",
        display: "grid",
        gridTemplateColumns: "repeat(5, 1fr)",
        borderTop: `0.07cqw solid ${COLORS.hairline}`,
        fontFamily:
          language === "zh"
            ? "'PingFang SC', 'Noto Sans SC', sans-serif"
            : "Aptos, 'Segoe UI', sans-serif",
      }}
    >
      {SCENE_IDS.map((sceneId) => {
        const isActive = sceneId === scene;

        return (
          <button
            key={sceneId}
            type="button"
            aria-current={isActive ? "page" : undefined}
            onClick={(event: MouseEvent<HTMLButtonElement>) => {
              event.stopPropagation();
              onNavigate?.(sceneId, 0);
            }}
            style={{
              appearance: "none",
              border: 0,
              borderRight:
                sceneId === 5 ? 0 : `0.07cqw solid ${COLORS.hairline}`,
              background: isActive ? COLORS.accentSoft : "transparent",
              color: isActive ? COLORS.accent : COLORS.muted,
              fontSize: language === "zh" ? "1.15cqw" : "1.05cqw",
              fontWeight: isActive ? 750 : 550,
              cursor: "pointer",
              padding: "0.7cqh 0.8cqw",
              textAlign: "left",
            }}
          >
            <span
              style={{
                display: "block",
                fontSize: "0.8cqw",
                color: isActive ? COLORS.accent : COLORS.hairline,
              }}
            >
              0{sceneId}
            </span>
            {scenes[sceneId].tab}
          </button>
        );
      })}
    </nav>
  );
}

function SceneShell({
  scene,
  beat,
  language,
  reducedMotion,
  children,
}: {
  scene: SceneCopy;
  beat: number;
  language: Language;
  reducedMotion: boolean;
  children: ReactElement;
}) {
  const isMultiBeat = scene.beats.length > 1;

  return (
    <article
      data-scene-id={scene.id}
      data-beat={beat}
      data-beat-layout-container={isMultiBeat ? "true" : undefined}
      data-beat-layout-mode={isMultiBeat ? "reserved" : undefined}
      style={{
        width: "100%",
        height: "100%",
        color: COLORS.ink,
        fontFamily:
          language === "zh"
            ? "'PingFang SC', 'Noto Sans SC', sans-serif"
            : "Aptos, 'Segoe UI', sans-serif",
        display: "grid",
        gridTemplateColumns: scene.id === 5 ? "1fr" : "35% 65%",
        gap: "3cqw",
      }}
    >
      <aside
        data-beat-layout-item="true"
        style={{
          borderRight:
            scene.id === 5 ? "0 solid transparent" : `0.07cqw solid ${COLORS.hairline}`,
          paddingRight: scene.id === 5 ? 0 : "2.4cqw",
          display: "flex",
          flexDirection: "column",
          justifyContent: scene.id === 5 ? "center" : "space-between",
          minHeight: "100%",
        }}
      >
        <div>
          <div
            style={{
              fontSize: "0.95cqw",
              color: COLORS.accent,
              textTransform: "uppercase",
              fontWeight: 800,
            }}
          >
            {scene.eyebrow}
          </div>
          <h1
            style={{
              margin: "2cqh 0 0",
              fontFamily:
                language === "zh"
                  ? "'Songti SC', 'Noto Serif SC', serif"
                  : "Georgia, 'Times New Roman', serif",
              fontSize:
                scene.id === 5
                  ? language === "zh"
                    ? "4.15cqw"
                    : "4.45cqw"
                  : language === "zh"
                    ? "3.2cqw"
                    : "3.45cqw",
              lineHeight: 1.03,
              fontWeight: 700,
            }}
          >
            {scene.title}
          </h1>
          <p
            style={{
              margin: "2.4cqh 0 0",
              fontSize: scene.id === 5 ? "1.7cqw" : "1.38cqw",
              lineHeight: 1.34,
              color: COLORS.muted,
              maxWidth: scene.id === 5 ? "62%" : "90%",
            }}
          >
            {scene.summary}
          </p>
        </div>
        {scene.id !== 5 && (
          <div
            style={{
              borderTop: `0.07cqw solid ${COLORS.hairline}`,
              paddingTop: "2cqh",
              fontSize: "1.05cqw",
              lineHeight: 1.38,
              color: COLORS.muted,
            }}
          >
            {scene.note}
          </div>
        )}
      </aside>
      <section
        data-beat-layout-item="true"
        style={{
          position: "relative",
          minHeight: "100%",
          transition: reducedMotion ? "none" : "opacity 420ms ease",
        }}
      >
        {children}
      </section>
    </article>
  );
}

function QuestionScene({
  scene,
  language,
}: {
  scene: SceneCopy;
  language: Language;
}) {
  return (
    <div
      style={{
        height: "100%",
        display: "grid",
        gridTemplateRows: "1fr 1fr",
        gap: "3cqh",
      }}
    >
      {(scene.cards ?? []).map((card, index) => (
        <div
          key={card.label}
          data-beat-layout-item="true"
          style={{
            borderTop: `0.1cqw solid ${index === 0 ? COLORS.accent : COLORS.hairline}`,
            paddingTop: "2.4cqh",
            display: "grid",
            gridTemplateColumns: "28% 1fr",
            gap: "2.4cqw",
            alignContent: "start",
          }}
        >
          <div
            style={{
              fontSize: "1.05cqw",
              color: index === 0 ? COLORS.accent : COLORS.muted,
              fontWeight: 800,
              textTransform: "uppercase",
            }}
          >
            {card.label}
          </div>
          <div
            style={{
              fontFamily:
                language === "zh"
                  ? "'Songti SC', 'Noto Serif SC', serif"
                  : "Georgia, 'Times New Roman', serif",
              fontSize: language === "zh" ? "2.55cqw" : "2.75cqw",
              lineHeight: 1.12,
            }}
          >
            {card.detail}
          </div>
        </div>
      ))}
    </div>
  );
}

function MethodScene({
  scene,
  beat,
  reducedMotion,
}: {
  scene: SceneCopy;
  beat: number;
  reducedMotion: boolean;
}) {
  return (
    <div
      style={{
        height: "100%",
        display: "grid",
        gridTemplateRows: "63% 1fr",
        gap: "3cqh",
      }}
    >
      <div
        data-beat-layout-item="true"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "1.6cqw",
        }}
      >
        {(scene.cards ?? []).map((card, index) => {
          const isVisible = beat >= index;

          return (
            <div
              key={card.label}
              data-beat-layout-item="true"
              style={{
                ...revealStyle(isVisible, reducedMotion),
                border: `0.07cqw solid ${isVisible ? COLORS.accent : COLORS.hairline}`,
                background: isVisible ? COLORS.paper : COLORS.panel,
                padding: "2.2cqh 1.35cqw",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div
                style={{
                  fontSize: "1.05cqw",
                  color: isVisible ? COLORS.accent : COLORS.muted,
                  fontWeight: 800,
                  textTransform: "uppercase",
                }}
              >
                0{index + 1}
              </div>
              <div>
                <h2
                  style={{
                    margin: 0,
                    fontSize: "1.75cqw",
                    lineHeight: 1.1,
                  }}
                >
                  {card.label}
                </h2>
                <p
                  style={{
                    margin: "1.4cqh 0 0",
                    fontSize: "1.05cqw",
                    lineHeight: 1.38,
                    color: COLORS.muted,
                  }}
                >
                  {card.detail}
                </p>
              </div>
            </div>
          );
        })}
      </div>
      <div
        data-beat-layout-item="true"
        style={{
          borderTop: `0.07cqw solid ${COLORS.hairline}`,
          display: "grid",
          gridTemplateColumns: "30% 1fr",
          gap: "2cqw",
          paddingTop: "2cqh",
          alignItems: "start",
        }}
      >
        <strong
          style={{
            fontSize: "1.08cqw",
            color: COLORS.accent,
            textTransform: "uppercase",
          }}
        >
          {scene.beats[beat].title}
        </strong>
        <p
          style={{
            margin: 0,
            fontSize: "1.25cqw",
            lineHeight: 1.38,
            color: COLORS.ink,
          }}
        >
          {scene.beats[beat].body}
        </p>
      </div>
    </div>
  );
}

function FindingsScene({
  scene,
  beat,
  language,
  reducedMotion,
}: {
  scene: SceneCopy;
  beat: number;
  language: Language;
  reducedMotion: boolean;
}) {
  return (
    <div
      style={{
        height: "100%",
        display: "grid",
        gridTemplateRows: "26% 1fr",
        gap: "2.6cqh",
      }}
    >
      <div
        data-beat-layout-item="true"
        style={{
          display: "grid",
          gridTemplateColumns: "32% 1fr",
          gap: "2.2cqw",
          borderBottom: `0.07cqw solid ${COLORS.hairline}`,
          paddingBottom: "2.2cqh",
        }}
      >
        <div
          style={{
            fontFamily:
              language === "zh"
                ? "'Songti SC', 'Noto Serif SC', serif"
                : "Georgia, 'Times New Roman', serif",
            fontSize: "5.2cqw",
            lineHeight: 0.9,
            color: COLORS.accent,
          }}
        >
          {scene.evidence?.[0]?.value}
        </div>
        <div
          style={{
            alignSelf: "end",
            fontSize: "1.35cqw",
            lineHeight: 1.32,
            color: COLORS.muted,
          }}
        >
          {scene.evidence?.[0]?.detail}
        </div>
      </div>
      <div
        data-beat-layout-item="true"
        style={{
          display: "grid",
          gridTemplateRows: "repeat(3, 1fr)",
          borderTop: `0.07cqw solid ${COLORS.hairline}`,
        }}
      >
        {(scene.evidence ?? []).map((item, index) => {
          const isVisible = beat >= index;

          return (
            <div
              key={item.label}
              data-beat-layout-item="true"
              style={{
                ...mutedRevealStyle(isVisible, reducedMotion),
                display: "grid",
                gridTemplateColumns: "24% 18% 1fr",
                gap: "1.5cqw",
                alignItems: "center",
                borderBottom: `0.07cqw solid ${COLORS.hairline}`,
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: "1.12cqw",
                    fontWeight: 800,
                    color: isVisible ? COLORS.ink : COLORS.muted,
                  }}
                >
                  {item.label}
                </div>
                <div
                  style={{
                    marginTop: "0.7cqh",
                    fontSize: "0.94cqw",
                    color: COLORS.muted,
                  }}
                >
                  {item.detail}
                </div>
              </div>
              <div
                style={{
                  fontFamily:
                    language === "zh"
                      ? "'Songti SC', 'Noto Serif SC', serif"
                      : "Georgia, 'Times New Roman', serif",
                  fontSize: item.value.length > 4 ? "2.05cqw" : "2.45cqw",
                  color: isVisible ? COLORS.accent : COLORS.muted,
                  fontWeight: 700,
                }}
              >
                {item.value}
              </div>
              <div>
                <div
                  style={{
                    width: "100%",
                    height: "1.3cqh",
                    background: COLORS.panel,
                    border: `0.07cqw solid ${COLORS.hairline}`,
                  }}
                >
                  <div
                    style={{
                      width: isVisible ? item.width : "12%",
                      height: "100%",
                      background: isVisible ? COLORS.accent : COLORS.hairline,
                      transition: reducedMotion ? "none" : "width 480ms ease",
                    }}
                  />
                </div>
                <div
                  style={{
                    marginTop: "1cqh",
                    display: "flex",
                    justifyContent: "space-between",
                    color: COLORS.muted,
                    fontSize: "0.9cqw",
                  }}
                >
                  <span>{item.before ?? "baseline"}</span>
                  <span>{item.after ?? item.value}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function RecommendationScene({
  scene,
  beat,
  reducedMotion,
}: {
  scene: SceneCopy;
  beat: number;
  reducedMotion: boolean;
}) {
  return (
    <div
      style={{
        height: "100%",
        display: "grid",
        gridTemplateColumns: "42% 1fr",
        gap: "2.4cqw",
      }}
    >
      <div
        data-beat-layout-item="true"
        style={{
          border: `0.12cqw solid ${COLORS.accent}`,
          background: COLORS.accentSoft,
          padding: "3cqh 2cqw",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div>
          <div
            style={{
              fontSize: "1cqw",
              color: COLORS.accent,
              textTransform: "uppercase",
              fontWeight: 800,
            }}
          >
            {scene.beats[beat].title}
          </div>
          <p
            style={{
              margin: "2cqh 0 0",
              fontSize: "2.05cqw",
              lineHeight: 1.16,
              color: COLORS.ink,
            }}
          >
            {scene.beats[beat].body}
          </p>
        </div>
        <div
          style={{
            borderTop: `0.07cqw solid ${COLORS.hairline}`,
            paddingTop: "1.6cqh",
            fontSize: "1.05cqw",
            lineHeight: 1.36,
            color: COLORS.muted,
          }}
        >
          {scene.note}
        </div>
      </div>
      <div
        data-beat-layout-item="true"
        style={{
          display: "grid",
          gridTemplateRows: "repeat(3, 1fr)",
          borderTop: `0.07cqw solid ${COLORS.hairline}`,
        }}
      >
        {(scene.recommendations ?? []).map((item, index) => {
          const isVisible = beat >= (index === 0 ? 0 : 1);

          return (
            <div
              key={item.label}
              data-beat-layout-item="true"
              style={{
                ...revealStyle(isVisible, reducedMotion),
                borderBottom: `0.07cqw solid ${COLORS.hairline}`,
                display: "grid",
                gridTemplateColumns: "28% 1fr",
                gap: "1.8cqw",
                alignItems: "center",
              }}
            >
              <strong
                style={{
                  fontSize: "1.18cqw",
                  color: isVisible ? COLORS.accent : COLORS.muted,
                }}
              >
                {item.label}
              </strong>
              <span
                style={{
                  fontSize: "1.3cqw",
                  lineHeight: 1.32,
                  color: COLORS.ink,
                }}
              >
                {item.detail}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MemoLineScene({
  scene,
  language,
}: {
  scene: SceneCopy;
  language: Language;
}) {
  return (
    <div
      data-beat-layout-item="true"
      style={{
        height: "100%",
        display: "flex",
        alignItems: "center",
        borderTop: `0.1cqw solid ${COLORS.accent}`,
        borderBottom: `0.1cqw solid ${COLORS.accent}`,
      }}
    >
      <p
        style={{
          margin: 0,
          maxWidth: "86%",
          fontFamily:
            language === "zh"
              ? "'Songti SC', 'Noto Serif SC', serif"
              : "Georgia, 'Times New Roman', serif",
          fontSize: language === "zh" ? "3.65cqw" : "3.85cqw",
          lineHeight: 1.12,
          color: COLORS.ink,
        }}
      >
        {scene.memoLine}
      </p>
    </div>
  );
}

function ScenePanel({
  sceneId,
  beat,
  language,
  reducedMotion,
}: {
  sceneId: number;
  beat: number;
  language: Language;
  reducedMotion: boolean;
}) {
  const scene = getSceneCopy(language, sceneId);
  const safeBeat = clampBeat(scene, beat);

  let content: ReactElement;
  if (scene.id === 1) {
    content = <QuestionScene scene={scene} language={language} />;
  } else if (scene.id === 2) {
    content = (
      <MethodScene scene={scene} beat={safeBeat} reducedMotion={reducedMotion} />
    );
  } else if (scene.id === 3) {
    content = (
      <FindingsScene
        scene={scene}
        beat={safeBeat}
        language={language}
        reducedMotion={reducedMotion}
      />
    );
  } else if (scene.id === 4) {
    content = (
      <RecommendationScene
        scene={scene}
        beat={safeBeat}
        reducedMotion={reducedMotion}
      />
    );
  } else {
    content = <MemoLineScene scene={scene} language={language} />;
  }

  return (
    <SceneShell
      scene={scene}
      beat={safeBeat}
      language={language}
      reducedMotion={reducedMotion}
    >
      {content}
    </SceneShell>
  );
}

export function getMetadata(lang: Language): StyleMetadata {
  const copy = DECK_COPY[lang];

  return {
    id: "41",
    band: "text-report",
    name: lang === "zh" ? "研究备忘录" : "Research Memo",
    theme:
      lang === "zh"
        ? "小团队证据：问题、方法、发现、建议、备忘录结论"
        : "Evidence for a Smaller Team: question, method, findings, recommendation, memo line",
    densityLabel: lang === "zh" ? "阅读优先" : "Reading-first",
    heroScene: 3,
    colors: {
      bg: COLORS.paper,
      ink: COLORS.ink,
      panel: COLORS.panel,
    },
    typography: {
      header:
        lang === "zh"
          ? "Songti SC 700"
          : "Georgia 700",
      body:
        lang === "zh"
          ? "PingFang SC 500"
          : "Aptos 500",
    },
    tags: [
      "research-memo",
      "evidence",
      "executive-summary",
      "reading-first",
      "text-report",
      "minimal-motion",
    ],
    fonts:
      lang === "zh"
        ? ["cjk:Songti SC", "cjk:PingFang SC"]
        : ["Georgia", "Aptos"],
    scenes: SCENE_IDS.map((id) => {
      const scene = copy.scenes[id];
      return {
        id,
        title: scene.title,
        beats: scene.beats,
      };
    }),
  };
}

export default function EvidenceSmallerTeamV2({
  scene,
  beat,
  language,
  isThumbnail,
  reducedMotion,
  onNavigate,
}: BespokeStyleProps) {
  const copy = DECK_COPY[language];
  const effectiveReducedMotion = reducedMotion || isThumbnail;

  return (
    <section
      data-style-id="41"
      data-style-version="v2"
      style={
        {
          containerType: "size",
          position: "relative",
          width: "100%",
          height: "100%",
          overflow: "hidden",
          background: COLORS.paper,
          color: COLORS.ink,
        } as CSSProperties
      }
    >
      <MetadataHeader copy={copy} language={language} />
      <main
        style={{
          position: "absolute",
          top: "17cqh",
          left: "5.2cqw",
          right: "5.2cqw",
          bottom: isThumbnail ? "5.2cqh" : "10.2cqh",
        }}
      >
        <SpatialSceneTrack
          scene={scene}
          beat={beat}
          sceneIds={SCENE_IDS}
          transitionKind="fade"
          transitionMap={TRANSITION_MAP}
          reducedMotion={effectiveReducedMotion}
          beatLayoutModes={BEAT_LAYOUT_MODES}
          renderScene={(sceneId, sceneBeat) => (
            <ScenePanel
              sceneId={sceneId}
              beat={sceneBeat}
              language={language}
              reducedMotion={effectiveReducedMotion}
            />
          )}
        />
      </main>
      {!isThumbnail && (
        <MemoTabs
          language={language}
          scene={scene}
          onNavigate={onNavigate}
        />
      )}
    </section>
  );
}

export const evidenceSmallerTeamV2Version = defineStyleVersion({
  id: "v2",
  topic: "Evidence for a Smaller Team",
  model: "GPT-5",
  component: EvidenceSmallerTeamV2,
  getMetadata,
});

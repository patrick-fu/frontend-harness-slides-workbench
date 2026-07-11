import React, { useEffect } from "react";
import type { BespokeStyleProps, StyleMetadata } from "../types";
import SpatialSceneTrack from "./SpatialSceneTrack";
import type {
  BeatLayoutMode,
  SceneTransitionMap,
} from "./SpatialSceneTrack";
import { defineStyleTopic } from "./topic";

type Lang = "en" | "zh";
type SceneId = (typeof SCENE_IDS)[number];

interface BeatCopy {
  action: string;
  title: string;
  body: string;
}

interface CardCopy {
  eyebrow: string;
  title: string;
  body: string;
}

interface SceneCopy {
  nav: string;
  eyebrow: string;
  title: string;
  body: string;
  stage: string;
  accent: string;
  wash: string;
  spot: string;
  beats: BeatCopy[];
  cards: CardCopy[];
}

const SCENE_IDS = [1, 2, 3, 4, 5] as const;

const PALETTE = {
  bg: "#f8eadf",
  ink: "#4b3d46",
  muted: "#7f6d76",
  mint: "#c9eadf",
  blush: "#f4c9d4",
  butter: "#f5e5a8",
  sky: "#cde7f7",
  lavender: "#dacff3",
  peach: "#f6d6bd",
  panel: "#fff7ee",
  line: "rgba(75, 61, 70, 0.18)",
};

const TRANSITION_MAP: SceneTransitionMap = {
  "1->2": "scale-fade",
  "2->3": "slide-y",
  "3->4": "fade",
  "4->5": "scale-fade",
};

const BEAT_LAYOUT_MODES: Partial<Record<number, BeatLayoutMode>> = {
  1: "reserved",
  2: "reserved",
  3: "reserved",
  4: "reserved",
  5: "reserved",
};

const SCENES: Record<SceneId, Record<Lang, SceneCopy>> = {
  1: {
    en: {
      nav: "Welcome",
      eyebrow: "Warm start",
      title: "Welcome in one calm breath",
      body: "The first screen lowers the room volume and offers one kind promise.",
      stage: "Begin with air",
      accent: PALETTE.blush,
      wash: PALETTE.mint,
      spot: PALETTE.butter,
      beats: [
        {
          action: "Open with a soft greeting",
          title: "A soft hello",
          body: "The product greets the learner before asking for anything.",
        },
        {
          action: "State the promise",
          title: "One promise",
          body: "The path feels short, useful, and safe to try.",
        },
        {
          action: "Point to the first step",
          title: "A place to begin",
          body: "One visible next action replaces setup anxiety.",
        },
      ],
      cards: [
        {
          eyebrow: "hello",
          title: "Name the room",
          body: "A welcome that sounds human.",
        },
        {
          eyebrow: "promise",
          title: "Keep it tiny",
          body: "No feature tour, no checklist wall.",
        },
        {
          eyebrow: "start",
          title: "Offer one doorway",
          body: "The first action is already waiting.",
        },
      ],
    },
    zh: {
      nav: "欢迎",
      eyebrow: "温柔开始",
      title: "欢迎页先让人喘口气",
      body: "第一屏先把压力降下来，只给一个清楚、友好的承诺。",
      stage: "先留出空气",
      accent: PALETTE.blush,
      wash: PALETTE.mint,
      spot: PALETTE.butter,
      beats: [
        {
          action: "用柔和问候开场",
          title: "先打个招呼",
          body: "产品先欢迎学习者，而不是马上索要信息。",
        },
        {
          action: "说明单一承诺",
          title: "只给一个承诺",
          body: "路径短、有用，而且可以放心试一下。",
        },
        {
          action: "指出第一步",
          title: "有地方开始",
          body: "一个可见动作，替代整片设置焦虑。",
        },
      ],
      cards: [
        {
          eyebrow: "你好",
          title: "先定义房间",
          body: "欢迎语要像真人在说话。",
        },
        {
          eyebrow: "承诺",
          title: "把范围做小",
          body: "不做功能巡游，不堆清单墙。",
        },
        {
          eyebrow: "开始",
          title: "留一个入口",
          body: "第一步已经在等用户。",
        },
      ],
    },
  },
  2: {
    en: {
      nav: "First task",
      eyebrow: "First task",
      title: "One first task, already framed",
      body: "The task is small enough to finish before doubt has time to arrive.",
      stage: "Make success close",
      accent: PALETTE.mint,
      wash: PALETTE.sky,
      spot: PALETTE.peach,
      beats: [
        {
          action: "Choose the task",
          title: "Pick one action",
          body: "The learner sees the smallest useful move.",
        },
        {
          action: "Show progress",
          title: "Progress is visible",
          body: "Each touch leaves a friendly trace.",
        },
        {
          action: "Finish the loop",
          title: "Done feels near",
          body: "The first win lands without a lecture.",
        },
      ],
      cards: [
        {
          eyebrow: "choose",
          title: "Start from a template",
          body: "No blank page at the door.",
        },
        {
          eyebrow: "try",
          title: "Add one detail",
          body: "The task is reversible and safe.",
        },
        {
          eyebrow: "finish",
          title: "Preview the result",
          body: "A small completion arrives fast.",
        },
      ],
    },
    zh: {
      nav: "第一步",
      eyebrow: "第一项任务",
      title: "第一步已经被框好了",
      body: "任务足够小，在怀疑出现之前就能完成。",
      stage: "让成功更近",
      accent: PALETTE.mint,
      wash: PALETTE.sky,
      spot: PALETTE.peach,
      beats: [
        {
          action: "选定任务",
          title: "只挑一个动作",
          body: "用户看到最小但真正有用的一步。",
        },
        {
          action: "显示进度",
          title: "进度看得见",
          body: "每次触碰都留下柔和反馈。",
        },
        {
          action: "闭合循环",
          title: "完成感很近",
          body: "第一次胜利不需要讲课。",
        },
      ],
      cards: [
        {
          eyebrow: "选择",
          title: "从模板开始",
          body: "入口处不放空白页。",
        },
        {
          eyebrow: "尝试",
          title: "只补一个细节",
          body: "这一步可撤回，也安全。",
        },
        {
          eyebrow: "完成",
          title: "马上看到预览",
          body: "小小的完成感很快出现。",
        },
      ],
    },
  },
  3: {
    en: {
      nav: "Nudge",
      eyebrow: "Helpful nudge",
      title: "A nudge arrives before friction grows",
      body: "Guidance feels like a friend leaning closer, not a modal blocking the path.",
      stage: "Help without interruption",
      accent: PALETTE.sky,
      wash: PALETTE.lavender,
      spot: PALETTE.butter,
      beats: [
        {
          action: "Detect hesitation",
          title: "Notice the pause",
          body: "Silence becomes a signal, not a failure.",
        },
        {
          action: "Offer a gentle hint",
          title: "Suggest one way",
          body: "The hint points, then gets out of the way.",
        },
        {
          action: "Keep control with the learner",
          title: "Leave the choice open",
          body: "Help supports momentum without taking over.",
        },
      ],
      cards: [
        {
          eyebrow: "pause",
          title: "The cursor rests",
          body: "Waiting is treated as useful context.",
        },
        {
          eyebrow: "hint",
          title: "Try this wording",
          body: "A light suggestion, not a command.",
        },
        {
          eyebrow: "choice",
          title: "Skip or accept",
          body: "Control stays with the learner.",
        },
      ],
    },
    zh: {
      nav: "提示",
      eyebrow: "适时提醒",
      title: "卡住之前，提示先轻轻出现",
      body: "引导像朋友靠近一点，而不是弹窗挡住去路。",
      stage: "帮助不打断",
      accent: PALETTE.sky,
      wash: PALETTE.lavender,
      spot: PALETTE.butter,
      beats: [
        {
          action: "识别犹豫",
          title: "看见停顿",
          body: "沉默是信号，不是失败。",
        },
        {
          action: "提供柔和提示",
          title: "给一个方向",
          body: "提示只指路，然后退开。",
        },
        {
          action: "保留用户控制",
          title: "选择仍然开放",
          body: "帮助维持节奏，但不接管。",
        },
      ],
      cards: [
        {
          eyebrow: "停顿",
          title: "光标停住了",
          body: "等待也被当成有用上下文。",
        },
        {
          eyebrow: "提示",
          title: "可以这样写",
          body: "轻轻建议，不下命令。",
        },
        {
          eyebrow: "选择",
          title: "跳过或采纳",
          body: "控制权还在用户手里。",
        },
      ],
    },
  },
  4: {
    en: {
      nav: "Confidence",
      eyebrow: "Confidence",
      title: "Small proof turns into confidence",
      body: "The learner sees evidence that the system understands, remembers, and helps.",
      stage: "Show the win",
      accent: PALETTE.butter,
      wash: PALETTE.blush,
      spot: PALETTE.mint,
      beats: [
        {
          action: "Confirm the completed task",
          title: "You did it",
          body: "Completion is stated plainly and warmly.",
        },
        {
          action: "Connect effort to outcome",
          title: "The work mattered",
          body: "The result shows why the task was useful.",
        },
        {
          action: "Preview the next safe step",
          title: "Next is clearer",
          body: "Confidence becomes permission to continue.",
        },
      ],
      cards: [
        {
          eyebrow: "done",
          title: "First task complete",
          body: "A visible check without noise.",
        },
        {
          eyebrow: "proof",
          title: "Result improved",
          body: "The product shows what changed.",
        },
        {
          eyebrow: "next",
          title: "Ready for one more",
          body: "The next step feels optional, not forced.",
        },
      ],
    },
    zh: {
      nav: "信心",
      eyebrow: "建立信心",
      title: "小证据会慢慢变成信心",
      body: "用户看见系统理解了、记住了，也真的帮上忙了。",
      stage: "把胜利显出来",
      accent: PALETTE.butter,
      wash: PALETTE.blush,
      spot: PALETTE.mint,
      beats: [
        {
          action: "确认任务完成",
          title: "你已经做到了",
          body: "完成被清楚、温和地说出来。",
        },
        {
          action: "连接努力和结果",
          title: "这一步有意义",
          body: "结果说明刚才的任务为什么有用。",
        },
        {
          action: "预告下一安全步骤",
          title: "下一步更清楚",
          body: "信心变成继续前进的许可。",
        },
      ],
      cards: [
        {
          eyebrow: "完成",
          title: "第一项完成",
          body: "有一个清楚但不吵的勾。",
        },
        {
          eyebrow: "证据",
          title: "结果变好了",
          body: "产品展示哪里发生了变化。",
        },
        {
          eyebrow: "继续",
          title: "可以再走一步",
          body: "下一步像邀请，不像强迫。",
        },
      ],
    },
  },
  5: {
    en: {
      nav: "Habit",
      eyebrow: "Habit loop",
      title: "A habit loop stays light",
      body: "The product returns tomorrow with the same calm cue and a smaller ask.",
      stage: "Return without pressure",
      accent: PALETTE.lavender,
      wash: PALETTE.peach,
      spot: PALETTE.sky,
      beats: [
        {
          action: "Keep a familiar cue",
          title: "Same gentle cue",
          body: "Recognition lowers the cost of returning.",
        },
        {
          action: "Reward the small repeat",
          title: "A tiny reward",
          body: "The loop celebrates consistency, not volume.",
        },
        {
          action: "Prepare tomorrow",
          title: "Tomorrow is ready",
          body: "The next visit is already softened.",
        },
      ],
      cards: [
        {
          eyebrow: "cue",
          title: "A familiar pill",
          body: "The same shape says where to resume.",
        },
        {
          eyebrow: "repeat",
          title: "Two calm minutes",
          body: "The habit stays small enough to keep.",
        },
        {
          eyebrow: "return",
          title: "Tomorrow waits",
          body: "The product closes without pressure.",
        },
      ],
    },
    zh: {
      nav: "习惯",
      eyebrow: "习惯循环",
      title: "习惯循环也要保持轻盈",
      body: "明天再回来时，产品用同一个温和提示，提出更小的请求。",
      stage: "回来也没有压力",
      accent: PALETTE.lavender,
      wash: PALETTE.peach,
      spot: PALETTE.sky,
      beats: [
        {
          action: "保留熟悉提示",
          title: "同一个柔和提示",
          body: "熟悉感降低再次进入的成本。",
        },
        {
          action: "奖励小幅重复",
          title: "一个很小的奖励",
          body: "循环庆祝持续，而不是数量。",
        },
        {
          action: "准备明天",
          title: "明天已经准备好",
          body: "下一次访问已经被提前软化。",
        },
      ],
      cards: [
        {
          eyebrow: "提示",
          title: "熟悉的胶囊",
          body: "同一种形状告诉用户从哪里继续。",
        },
        {
          eyebrow: "重复",
          title: "安静两分钟",
          body: "习惯小到可以被保留下来。",
        },
        {
          eyebrow: "回来",
          title: "明天在等",
          body: "产品结束时不施压。",
        },
      ],
    },
  },
};

function useFonts() {
  useEffect(() => {
    const id = "style-12-v2-fonts";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Nunito:wght@500;700;800&family=Noto+Sans+SC:wght@400;500;700&display=swap";
    document.head.appendChild(link);
  }, []);
}

function isSceneId(scene: number): scene is SceneId {
  return SCENE_IDS.includes(scene as SceneId);
}

function clampBeat(beat: number, total: number): number {
  return Math.min(Math.max(beat, 0), total - 1);
}

function getSceneCopy(scene: number, language: Lang): SceneCopy {
  const sceneId = isSceneId(scene) ? scene : 1;
  return SCENES[sceneId][language];
}

export function getMetadata(lang: Lang): StyleMetadata {
  return {
    id: "soft-pastel-friendly",
    band: "balanced-hybrid",
    name: lang === "zh" ? "柔和粉彩友好" : "Soft Pastel Friendly",
    theme: lang === "zh" ? "会呼吸的新手引导" : "Onboarding That Breathes",
    densityLabel: lang === "zh" ? "中等 / 留白" : "Medium / Breathable",
    heroScene: 1,
    colors: {
      bg: PALETTE.bg,
      ink: PALETTE.ink,
      panel: PALETTE.panel,
    },
    typography: {
      header: "Nunito 800",
      body: lang === "zh" ? "Noto Sans SC 400" : "Nunito 500",
    },
    tags: [
      "balanced-hybrid",
      "soft-pastel",
      "friendly",
      "onboarding",
      "reserved-beats",
    ],
    fonts: ["Nunito", "cjk:Noto Sans SC"],
    scenes: SCENE_IDS.map((id) => {
      const copy = SCENES[id][lang];
      return {
        id,
        title: copy.nav,
        beats: copy.beats.map((beat, beatId) => ({
          id: beatId,
          action: beat.action,
          title: beat.title,
          body: beat.body,
        })),
      };
    }),
  };
}

export default function OnboardingThatBreathesV2({
  scene,
  beat,
  language,
  isThumbnail,
  reducedMotion,
  onNavigate,
}: BespokeStyleProps) {
  useFonts();
  const activeScene = isSceneId(scene) ? scene : 1;
  const noMotion = reducedMotion || isThumbnail;
  const activeBeat = clampBeat(
    beat,
    getSceneCopy(activeScene, language).beats.length,
  );

  return (
    <div style={rootStyle}>
      <PastelAtmosphere />
      <SpatialSceneTrack
        scene={activeScene}
        beat={activeBeat}
        transitionKind="scale-fade"
        transitionMap={TRANSITION_MAP}
        transitionDurationMs={620}
        reducedMotion={noMotion}
        beatLayoutModes={BEAT_LAYOUT_MODES}
        renderScene={(sceneId, sceneBeat, isActive) => (
          <ScenePanel
            sceneId={sceneId as SceneId}
            beat={sceneBeat}
            language={language}
            motionSafe={!noMotion && isActive}
          />
        )}
      />
      {!isThumbnail && (
        <SoftPillCarousel
          scene={activeScene}
          language={language}
          motionSafe={!noMotion}
          onNavigate={onNavigate}
        />
      )}
    </div>
  );
}

function ScenePanel({
  sceneId,
  beat,
  language,
  motionSafe,
}: {
  sceneId: SceneId;
  beat: number;
  language: Lang;
  motionSafe: boolean;
}) {
  const copy = SCENES[sceneId][language];
  const safeBeat = clampBeat(beat, copy.beats.length);

  return (
    <section style={sceneStyle} aria-label={copy.title}>
      <div style={topLineStyle} data-beat-layout-item="true">
        <span style={eyebrowStyle}>{copy.eyebrow}</span>
        <BeatMarkers
          total={copy.beats.length}
          beat={safeBeat}
          copy={copy}
          motionSafe={motionSafe}
        />
      </div>
      {renderSceneLayout(sceneId, copy, safeBeat, motionSafe)}
    </section>
  );
}

function renderSceneLayout(
  sceneId: SceneId,
  copy: SceneCopy,
  beat: number,
  motionSafe: boolean,
) {
  if (sceneId === 1) {
    return <WelcomeLayout copy={copy} beat={beat} motionSafe={motionSafe} />;
  }
  if (sceneId === 2) {
    return <TaskLayout copy={copy} beat={beat} motionSafe={motionSafe} />;
  }
  if (sceneId === 3) {
    return <NudgeLayout copy={copy} beat={beat} motionSafe={motionSafe} />;
  }
  if (sceneId === 4) {
    return <ConfidenceLayout copy={copy} beat={beat} motionSafe={motionSafe} />;
  }
  return <HabitLayout copy={copy} beat={beat} motionSafe={motionSafe} />;
}

function WelcomeLayout({
  copy,
  beat,
  motionSafe,
}: {
  copy: SceneCopy;
  beat: number;
  motionSafe: boolean;
}) {
  return (
    <div style={welcomeGridStyle}>
      <div
        style={{
          ...heroCardStyle,
          background: `linear-gradient(135deg, ${copy.accent}, ${PALETTE.panel})`,
        }}
        data-beat-layout-item="true"
      >
        <p style={stageLabelStyle}>{copy.stage}</p>
        <h1 style={titleStyle}>{copy.title}</h1>
        <p style={bodyStyle}>{copy.body}</p>
      </div>
      <div style={iconGardenStyle} data-beat-layout-item="true">
        <SoftIcon sceneId={1} copy={copy} />
        <div style={breathHaloStyle} />
      </div>
      <CardRail copy={copy} beat={beat} motionSafe={motionSafe} />
    </div>
  );
}

function TaskLayout({
  copy,
  beat,
  motionSafe,
}: {
  copy: SceneCopy;
  beat: number;
  motionSafe: boolean;
}) {
  return (
    <div style={twoColumnStyle}>
      <div style={taskStackStyle} data-beat-layout-item="true">
        {copy.cards.map((card, index) => (
          <div
            key={card.eyebrow}
            style={{
              ...taskRowStyle,
              ...reservedRevealStyle(index <= beat, motionSafe, index),
              background: index === 1 ? copy.wash : PALETTE.panel,
            }}
            data-beat-layout-item="true"
          >
            <span style={checkBubbleStyle}>{index + 1}</span>
            <div>
              <p style={cardEyebrowStyle}>{card.eyebrow}</p>
              <h3 style={cardTitleStyle}>{card.title}</h3>
              <p style={cardBodyStyle}>{card.body}</p>
            </div>
          </div>
        ))}
      </div>
      <div style={focusPanelStyle} data-beat-layout-item="true">
        <SoftIcon sceneId={2} copy={copy} />
        <p style={stageLabelStyle}>{copy.stage}</p>
        <h1 style={titleStyle}>{copy.title}</h1>
        <p style={bodyStyle}>{copy.body}</p>
      </div>
    </div>
  );
}

function NudgeLayout({
  copy,
  beat,
  motionSafe,
}: {
  copy: SceneCopy;
  beat: number;
  motionSafe: boolean;
}) {
  return (
    <div style={twoColumnStyle}>
      <div style={messageStackStyle} data-beat-layout-item="true">
        {copy.cards.map((card, index) => (
          <div
            key={card.eyebrow}
            style={{
              ...messageBubbleStyle(index),
              ...reservedRevealStyle(index <= beat, motionSafe, index),
              background: index === 1 ? copy.wash : PALETTE.panel,
            }}
            data-beat-layout-item="true"
          >
            <p style={cardEyebrowStyle}>{card.eyebrow}</p>
            <h3 style={cardTitleStyle}>{card.title}</h3>
            <p style={cardBodyStyle}>{card.body}</p>
          </div>
        ))}
      </div>
      <div style={nudgePanelStyle} data-beat-layout-item="true">
        <SoftIcon sceneId={3} copy={copy} />
        <p style={stageLabelStyle}>{copy.stage}</p>
        <h1 style={titleStyle}>{copy.title}</h1>
        <p style={bodyStyle}>{copy.body}</p>
      </div>
    </div>
  );
}

function ConfidenceLayout({
  copy,
  beat,
  motionSafe,
}: {
  copy: SceneCopy;
  beat: number;
  motionSafe: boolean;
}) {
  return (
    <div style={twoColumnStyle}>
      <div style={badgeGridStyle} data-beat-layout-item="true">
        {copy.cards.map((card, index) => (
          <div
            key={card.eyebrow}
            style={{
              ...badgeCardStyle,
              ...reservedRevealStyle(index <= beat, motionSafe, index),
              background: index === 0 ? copy.spot : PALETTE.panel,
            }}
            data-beat-layout-item="true"
          >
            <span style={badgeMarkStyle}>✓</span>
            <p style={cardEyebrowStyle}>{card.eyebrow}</p>
            <h3 style={cardTitleStyle}>{card.title}</h3>
            <p style={cardBodyStyle}>{card.body}</p>
          </div>
        ))}
      </div>
      <div style={confidencePanelStyle} data-beat-layout-item="true">
        <SoftIcon sceneId={4} copy={copy} />
        <p style={stageLabelStyle}>{copy.stage}</p>
        <h1 style={titleStyle}>{copy.title}</h1>
        <p style={bodyStyle}>{copy.body}</p>
      </div>
    </div>
  );
}

function HabitLayout({
  copy,
  beat,
  motionSafe,
}: {
  copy: SceneCopy;
  beat: number;
  motionSafe: boolean;
}) {
  return (
    <div style={habitGridStyle}>
      <div style={habitLoopStyle} data-beat-layout-item="true">
        <SoftIcon sceneId={5} copy={copy} />
        <p style={stageLabelStyle}>{copy.stage}</p>
        <h1 style={titleStyle}>{copy.title}</h1>
        <p style={bodyStyle}>{copy.body}</p>
      </div>
      <div style={weekStackStyle} data-beat-layout-item="true">
        {copy.cards.map((card, index) => (
          <div
            key={card.eyebrow}
            style={{
              ...weekPillStyle,
              ...reservedRevealStyle(index <= beat, motionSafe, index),
              background: index === 2 ? copy.wash : PALETTE.panel,
            }}
            data-beat-layout-item="true"
          >
            <p style={cardEyebrowStyle}>{card.eyebrow}</p>
            <h3 style={cardTitleStyle}>{card.title}</h3>
            <p style={cardBodyStyle}>{card.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function CardRail({
  copy,
  beat,
  motionSafe,
}: {
  copy: SceneCopy;
  beat: number;
  motionSafe: boolean;
}) {
  return (
    <div style={cardRailStyle} data-beat-layout-item="true">
      {copy.cards.map((card, index) => (
        <article
          key={card.eyebrow}
          style={{
            ...miniCardStyle,
            ...reservedRevealStyle(index <= beat, motionSafe, index),
            background:
              index === 0 ? PALETTE.panel : index === 1 ? copy.wash : copy.spot,
          }}
          data-beat-layout-item="true"
        >
          <p style={cardEyebrowStyle}>{card.eyebrow}</p>
          <h3 style={cardTitleStyle}>{card.title}</h3>
          <p style={cardBodyStyle}>{card.body}</p>
        </article>
      ))}
    </div>
  );
}

function BeatMarkers({
  total,
  beat,
  copy,
  motionSafe,
}: {
  total: number;
  beat: number;
  copy: SceneCopy;
  motionSafe: boolean;
}) {
  return (
    <div style={beatMarkerWrapStyle} aria-label="beat markers">
      {Array.from({ length: total }).map((_, index) => (
        <span
          key={index}
          data-beat-marker="true"
          style={{
            ...beatMarkerStyle,
            width: index <= beat ? "3.2cqw" : "1.2cqw",
            background: index <= beat ? copy.accent : "rgba(75, 61, 70, 0.14)",
            transition: motionSafe
              ? "width 280ms ease, background 280ms ease"
              : "none",
          }}
        />
      ))}
    </div>
  );
}

function SoftPillCarousel({
  scene,
  language,
  motionSafe,
  onNavigate,
}: {
  scene: SceneId;
  language: Lang;
  motionSafe: boolean;
  onNavigate?: (scene: number, beat: number) => void;
}) {
  return (
    <nav style={carouselStyle} aria-label="Scene carousel">
      {SCENE_IDS.map((sceneId) => {
        const active = sceneId === scene;
        const copy = SCENES[sceneId][language];
        return (
          <button
            key={sceneId}
            type="button"
            onClick={() => onNavigate?.(sceneId, 0)}
            style={carouselButtonStyle(active, copy, motionSafe)}
            aria-current={active ? "step" : undefined}
          >
            <span style={carouselDotStyle(active, copy)} />
            {copy.nav}
          </button>
        );
      })}
    </nav>
  );
}

function SoftIcon({
  sceneId,
  copy,
}: {
  sceneId: SceneId;
  copy: SceneCopy;
}) {
  const common = {
    fill: "none",
    stroke: PALETTE.ink,
    strokeWidth: 7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  return (
    <svg
      viewBox="0 0 140 140"
      role="img"
      aria-hidden="true"
      style={iconStyle}
    >
      <rect x="16" y="18" width="108" height="104" rx="34" fill={copy.wash} />
      <circle cx="106" cy="34" r="17" fill={copy.spot} />
      {sceneId === 1 && (
        <>
          <path {...common} d="M46 78 C54 54 86 54 94 78" />
          <path {...common} d="M46 82 C55 96 85 96 94 82" />
          <circle cx="54" cy="67" r="5" fill={PALETTE.ink} />
          <circle cx="86" cy="67" r="5" fill={PALETTE.ink} />
        </>
      )}
      {sceneId === 2 && (
        <>
          <path {...common} d="M44 64 L61 81 L96 47" />
          <path {...common} d="M42 98 H98" />
          <path {...common} d="M42 110 H78" />
        </>
      )}
      {sceneId === 3 && (
        <>
          <path {...common} d="M40 54 H96 Q108 54 108 66 V84 Q108 96 96 96 H67 L52 109 V96 H40 Q28 96 28 84 V66 Q28 54 40 54 Z" />
          <path {...common} d="M50 74 H86" />
          <path {...common} d="M50 86 H72" />
        </>
      )}
      {sceneId === 4 && (
        <>
          <circle cx="70" cy="70" r="34" fill={copy.accent} />
          <path {...common} d="M52 72 L65 85 L91 55" />
          <path {...common} d="M42 110 C58 100 82 100 98 110" />
        </>
      )}
      {sceneId === 5 && (
        <>
          <path {...common} d="M46 70 C46 52 60 40 76 43 C91 46 100 59 96 75" />
          <path {...common} d="M94 55 L98 76 L78 72" />
          <path {...common} d="M94 82 C89 99 72 108 57 101 C43 94 37 78 44 63" />
          <path {...common} d="M46 94 L42 64 L65 70" />
        </>
      )}
    </svg>
  );
}

function PastelAtmosphere() {
  return (
    <div style={atmosphereStyle} aria-hidden="true">
      <div style={{ ...blobStyle, left: "4cqw", top: "5cqh", background: PALETTE.mint }} />
      <div style={{ ...blobStyle, right: "7cqw", top: "9cqh", background: PALETTE.blush }} />
      <div style={{ ...blobStyle, left: "11cqw", bottom: "9cqh", background: PALETTE.sky }} />
      <div style={{ ...tinyStarStyle, right: "18cqw", bottom: "17cqh" }} />
      <div style={{ ...tinyStarStyle, left: "44cqw", top: "13cqh" }} />
    </div>
  );
}

function reservedRevealStyle(
  revealed: boolean,
  motionSafe: boolean,
  index: number,
): React.CSSProperties {
  return {
    opacity: revealed ? 1 : 0.16,
    transform: revealed ? "translateY(0) scale(1)" : "translateY(1.2cqh) scale(0.98)",
    transition: motionSafe
      ? `opacity 420ms ease ${index * 70}ms, transform 520ms cubic-bezier(0.34, 1.56, 0.64, 1) ${index * 70}ms`
      : "none",
  };
}

const rootStyle = {
  "--style-12-bg": PALETTE.bg,
  "--style-12-ink": PALETTE.ink,
  "--style-12-accent": PALETTE.blush,
  containerType: "size",
  position: "relative",
  width: "100%",
  height: "100%",
  overflow: "hidden",
  background:
    "radial-gradient(circle at 20cqw 18cqh, rgba(255, 247, 238, 0.92), transparent 19cqw), radial-gradient(circle at 78cqw 26cqh, rgba(205, 231, 247, 0.58), transparent 18cqw), var(--style-12-bg)",
  color: "var(--style-12-ink)",
  fontFamily: "'Nunito', 'Noto Sans SC', system-ui, sans-serif",
  letterSpacing: "0",
} as React.CSSProperties;

const atmosphereStyle: React.CSSProperties = {
  position: "absolute",
  inset: "0",
  pointerEvents: "none",
  overflow: "hidden",
};

const blobStyle: React.CSSProperties = {
  position: "absolute",
  width: "16cqw",
  height: "16cqw",
  borderRadius: "999cqw",
  opacity: 0.42,
  filter: "blur(2.6cqw)",
};

const tinyStarStyle: React.CSSProperties = {
  position: "absolute",
  width: "3.2cqw",
  height: "3.2cqw",
  borderRadius: "999cqw",
  background: PALETTE.butter,
  boxShadow: "0 0 2.4cqw rgba(245, 229, 168, 0.82)",
};

const sceneStyle: React.CSSProperties = {
  position: "absolute",
  inset: "0",
  boxSizing: "border-box",
  padding: "7cqh 7cqw 12cqh",
  display: "grid",
  gridTemplateRows: "7cqh 1fr",
  gap: "2.2cqh",
};

const topLineStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  minHeight: "5cqh",
};

const eyebrowStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  minHeight: "4.8cqh",
  padding: "0 1.6cqw",
  borderRadius: "999cqw",
  background: "rgba(255, 247, 238, 0.76)",
  border: `0.12cqw solid ${PALETTE.line}`,
  color: PALETTE.muted,
  fontSize: "1.1cqw",
  fontWeight: 800,
};

const beatMarkerWrapStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "0.55cqw",
  padding: "0.8cqh 0.8cqw",
  borderRadius: "999cqw",
  background: "rgba(255, 247, 238, 0.62)",
  border: `0.12cqw solid ${PALETTE.line}`,
};

const beatMarkerStyle: React.CSSProperties = {
  display: "block",
  height: "1.1cqh",
  borderRadius: "999cqw",
};

const welcomeGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "52cqw 1fr",
  gridTemplateRows: "1fr 25cqh",
  gap: "2.4cqw",
  minHeight: "0",
};

const twoColumnStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "39cqw 1fr",
  gap: "3cqw",
  minHeight: "0",
};

const habitGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 39cqw",
  gap: "3cqw",
  minHeight: "0",
};

const heroCardStyle: React.CSSProperties = {
  borderRadius: "4.8cqw",
  padding: "6.2cqh 4.2cqw",
  border: `0.14cqw solid ${PALETTE.line}`,
  boxShadow: "0 2cqh 4.6cqw rgba(95, 73, 80, 0.12)",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
};

const stageLabelStyle: React.CSSProperties = {
  margin: "0 0 1.6cqh",
  color: PALETTE.muted,
  fontSize: "1.08cqw",
  fontWeight: 800,
  textTransform: "uppercase",
  letterSpacing: "0",
};

const titleStyle: React.CSSProperties = {
  margin: "0",
  maxWidth: "50cqw",
  color: PALETTE.ink,
  fontSize: "4.4cqw",
  lineHeight: 1.04,
  fontWeight: 800,
  letterSpacing: "0",
};

const bodyStyle: React.CSSProperties = {
  margin: "2.2cqh 0 0",
  maxWidth: "43cqw",
  color: PALETTE.muted,
  fontSize: "1.45cqw",
  lineHeight: 1.36,
  fontWeight: 500,
  letterSpacing: "0",
};

const iconGardenStyle: React.CSSProperties = {
  position: "relative",
  borderRadius: "5.4cqw",
  background: "rgba(255, 247, 238, 0.62)",
  border: `0.14cqw solid ${PALETTE.line}`,
  display: "grid",
  placeItems: "center",
  overflow: "hidden",
  boxShadow: "0 2cqh 4.4cqw rgba(95, 73, 80, 0.1)",
};

const breathHaloStyle: React.CSSProperties = {
  position: "absolute",
  width: "22cqw",
  height: "22cqw",
  borderRadius: "999cqw",
  border: `1cqw solid rgba(255, 247, 238, 0.62)`,
  boxShadow: "inset 0 0 3.6cqw rgba(244, 201, 212, 0.38)",
};

const cardRailStyle: React.CSSProperties = {
  gridColumn: "1 / 3",
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: "1.6cqw",
};

const miniCardStyle: React.CSSProperties = {
  borderRadius: "2.6cqw",
  padding: "2.4cqh 2cqw",
  border: `0.12cqw solid ${PALETTE.line}`,
  boxShadow: "0 1.4cqh 3cqw rgba(95, 73, 80, 0.09)",
};

const cardEyebrowStyle: React.CSSProperties = {
  margin: "0 0 0.8cqh",
  color: PALETTE.muted,
  fontSize: "0.9cqw",
  fontWeight: 800,
  textTransform: "uppercase",
  letterSpacing: "0",
};

const cardTitleStyle: React.CSSProperties = {
  margin: "0",
  color: PALETTE.ink,
  fontSize: "1.65cqw",
  lineHeight: 1.1,
  fontWeight: 800,
  letterSpacing: "0",
};

const cardBodyStyle: React.CSSProperties = {
  margin: "1.1cqh 0 0",
  color: PALETTE.muted,
  fontSize: "1.06cqw",
  lineHeight: 1.3,
  fontWeight: 500,
};

const taskStackStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateRows: "repeat(3, 1fr)",
  gap: "1.8cqh",
  minHeight: "0",
};

const taskRowStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "5.4cqw 1fr",
  alignItems: "center",
  gap: "1.2cqw",
  borderRadius: "3cqw",
  padding: "2cqh 1.8cqw",
  border: `0.12cqw solid ${PALETTE.line}`,
  boxShadow: "0 1.3cqh 2.6cqw rgba(95, 73, 80, 0.08)",
};

const checkBubbleStyle: React.CSSProperties = {
  display: "grid",
  placeItems: "center",
  width: "4.4cqw",
  height: "4.4cqw",
  borderRadius: "999cqw",
  background: PALETTE.butter,
  color: PALETTE.ink,
  fontSize: "1.45cqw",
  fontWeight: 800,
};

const focusPanelStyle: React.CSSProperties = {
  borderRadius: "5.4cqw",
  padding: "5.6cqh 4cqw",
  background: "rgba(255, 247, 238, 0.72)",
  border: `0.14cqw solid ${PALETTE.line}`,
  boxShadow: "0 2cqh 4.6cqw rgba(95, 73, 80, 0.11)",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
};

const messageStackStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateRows: "repeat(3, 1fr)",
  gap: "1.8cqh",
  minHeight: "0",
};

function messageBubbleStyle(index: number): React.CSSProperties {
  return {
    borderRadius:
      index === 1 ? "3.4cqw 3.4cqw 3.4cqw 1.2cqw" : "3.4cqw 3.4cqw 1.2cqw 3.4cqw",
    padding: "2.3cqh 2cqw",
    border: `0.12cqw solid ${PALETTE.line}`,
    boxShadow: "0 1.3cqh 2.6cqw rgba(95, 73, 80, 0.08)",
  };
}

const nudgePanelStyle: React.CSSProperties = {
  borderRadius: "5.2cqw",
  padding: "5.4cqh 4cqw",
  background:
    "linear-gradient(145deg, rgba(218, 207, 243, 0.74), rgba(255, 247, 238, 0.82))",
  border: `0.14cqw solid ${PALETTE.line}`,
  boxShadow: "0 2cqh 4.6cqw rgba(95, 73, 80, 0.1)",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
};

const badgeGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gridTemplateRows: "1fr 1fr",
  gap: "1.6cqw",
  minHeight: "0",
};

const badgeCardStyle: React.CSSProperties = {
  borderRadius: "3.4cqw",
  padding: "2.4cqh 2cqw",
  border: `0.12cqw solid ${PALETTE.line}`,
  boxShadow: "0 1.4cqh 2.8cqw rgba(95, 73, 80, 0.09)",
};

const badgeMarkStyle: React.CSSProperties = {
  display: "grid",
  placeItems: "center",
  width: "4.2cqw",
  height: "4.2cqw",
  marginBottom: "1.8cqh",
  borderRadius: "999cqw",
  background: PALETTE.mint,
  color: PALETTE.ink,
  fontSize: "1.8cqw",
  fontWeight: 800,
};

const confidencePanelStyle: React.CSSProperties = {
  borderRadius: "5.4cqw",
  padding: "5.6cqh 4cqw",
  background:
    "linear-gradient(145deg, rgba(245, 229, 168, 0.72), rgba(255, 247, 238, 0.86))",
  border: `0.14cqw solid ${PALETTE.line}`,
  boxShadow: "0 2cqh 4.6cqw rgba(95, 73, 80, 0.11)",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
};

const habitLoopStyle: React.CSSProperties = {
  borderRadius: "5.4cqw",
  padding: "5.6cqh 4cqw",
  background:
    "linear-gradient(145deg, rgba(246, 214, 189, 0.72), rgba(255, 247, 238, 0.84))",
  border: `0.14cqw solid ${PALETTE.line}`,
  boxShadow: "0 2cqh 4.6cqw rgba(95, 73, 80, 0.1)",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
};

const weekStackStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateRows: "repeat(3, 1fr)",
  gap: "1.8cqh",
  minHeight: "0",
};

const weekPillStyle: React.CSSProperties = {
  borderRadius: "999cqw",
  padding: "2cqh 2.4cqw",
  border: `0.12cqw solid ${PALETTE.line}`,
  boxShadow: "0 1.2cqh 2.4cqw rgba(95, 73, 80, 0.08)",
};

const iconStyle: React.CSSProperties = {
  width: "12cqw",
  height: "20cqh",
  overflow: "visible",
  marginBottom: "2.2cqh",
};

const carouselStyle: React.CSSProperties = {
  position: "absolute",
  left: "50%",
  bottom: "3.2cqh",
  transform: "translateX(-50%)",
  display: "flex",
  alignItems: "center",
  gap: "0.8cqw",
  padding: "0.8cqh 0.8cqw",
  borderRadius: "999cqw",
  background: "rgba(255, 247, 238, 0.74)",
  border: `0.12cqw solid ${PALETTE.line}`,
  boxShadow: "0 1.2cqh 3.2cqw rgba(95, 73, 80, 0.12)",
};

function carouselButtonStyle(
  active: boolean,
  copy: SceneCopy,
  motionSafe: boolean,
): React.CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.55cqw",
    minHeight: "4.6cqh",
    padding: "0 1.25cqw",
    borderRadius: "999cqw",
    border: `0.12cqw solid ${active ? "rgba(75, 61, 70, 0.22)" : "transparent"}`,
    background: active ? copy.accent : "transparent",
    color: active ? PALETTE.ink : PALETTE.muted,
    fontFamily: "inherit",
    fontSize: "1cqw",
    fontWeight: 800,
    cursor: "pointer",
    whiteSpace: "nowrap",
    transform: active ? "translateY(-0.25cqh)" : "translateY(0)",
    transition: motionSafe
      ? "background 240ms ease, color 240ms ease, transform 260ms ease"
      : "none",
  };
}

function carouselDotStyle(
  active: boolean,
  copy: SceneCopy,
): React.CSSProperties {
  return {
    width: active ? "1.25cqw" : "0.85cqw",
    height: active ? "1.25cqw" : "0.85cqw",
    borderRadius: "999cqw",
    background: active ? PALETTE.panel : copy.wash,
    border: `0.1cqw solid ${PALETTE.line}`,
  };
}

export const onboardingThatBreathesTopic = defineStyleTopic({
  id: "breathing-onboard",
  topic: {
    en: "Breathing Onboard",
    zh: "呼吸入门",
  },
  model: "GPT 5.5",
  component: OnboardingThatBreathesV2,
  getMetadata,
});

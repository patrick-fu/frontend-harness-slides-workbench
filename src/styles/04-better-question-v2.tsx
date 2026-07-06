import { useEffect, type CSSProperties } from "react";
import type { BespokeStyleProps, StyleMetadata } from "../types";
import { useFLIP } from "../hooks/useFLIP";
import SpatialSceneTrack, {
  type BeatLayoutMode,
  type SceneTransitionMap,
} from "./SpatialSceneTrack";
import { defineStyleVersion } from "./version";

type Language = BespokeStyleProps["language"];
type VoiceSide = "warm" | "cool" | "both";
type LayoutKind = "entrance" | "friction" | "loop" | "aligned" | "curtain";

interface LocalizedText {
  en: string;
  zh: string;
}

interface DialogueTurn {
  id: string;
  beat: number;
  side: VoiceSide;
  label: LocalizedText;
  line: LocalizedText;
  note: LocalizedText;
}

interface SceneBeatCopy {
  action: string;
  title: string;
  body: string;
}

interface SceneCopy {
  id: number;
  layout: LayoutKind;
  kicker: LocalizedText;
  title: LocalizedText;
  subtitle: LocalizedText;
  active: VoiceSide[];
  accent: string;
  turns: DialogueTurn[];
  artifacts: LocalizedText[];
  answer?: {
    label: LocalizedText;
    body: LocalizedText;
    chips: LocalizedText[];
  };
  beats: Record<Language, SceneBeatCopy[]>;
}

const SCENE_IDS = [1, 2, 3, 4, 5];

const TRANSITION_MAP: SceneTransitionMap = {
  "1->2": "fade",
  "2->3": "glitch",
  "3->4": "slide-x",
  "4->5": "scale-fade",
};

const BEAT_LAYOUT_MODES: Partial<Record<number, BeatLayoutMode>> = {
  1: "motion",
  2: "motion",
  3: "motion",
  4: "motion",
  5: "motion",
};

const SCENES: Record<number, SceneCopy> = {
  1: {
    id: 1,
    layout: "entrance",
    kicker: { en: "Scene 01 - Enter", zh: "第一幕 - 入场" },
    title: { en: "Two Voices Enter", zh: "两个声音入场" },
    subtitle: {
      en: "A better answer starts by staging the exchange.",
      zh: "更好的答案，先把对话摆上台面。",
    },
    active: ["warm", "cool", "both"],
    accent: "#ffb15f",
    artifacts: [
      { en: "request", zh: "请求" },
      { en: "pause", zh: "停顿" },
      { en: "response", zh: "回应" },
    ],
    turns: [
      {
        id: "request-enters",
        beat: 0,
        side: "warm",
        label: { en: "Voice A", zh: "声音 A" },
        line: {
          en: "What should we do next?",
          zh: "下一步我们该做什么？",
        },
        note: {
          en: "The first ask is broad, urgent, and underlit.",
          zh: "第一个问题很宽、很急，边界还没被照亮。",
        },
      },
      {
        id: "response-enters",
        beat: 1,
        side: "cool",
        label: { en: "Voice B", zh: "声音 B" },
        line: {
          en: "Before the answer, name the uncertainty.",
          zh: "回答之前，先说清不确定性。",
        },
        note: {
          en: "The second voice slows the room down.",
          zh: "第二个声音让现场慢下来。",
        },
      },
      {
        id: "stage-opens",
        beat: 2,
        side: "both",
        label: { en: "Stage", zh: "舞台" },
        line: {
          en: "The question becomes visible enough to work on.",
          zh: "问题变得可见，才可以被处理。",
        },
        note: {
          en: "Attention shifts from answer speed to question quality.",
          zh: "注意力从答得快，转向问得准。",
        },
      },
    ],
    beats: {
      en: [
        {
          action: "Voice A enters under the warm spotlight",
          title: "Two Voices Enter",
          body: "The room hears the first broad ask.",
        },
        {
          action: "Voice B enters under the cool spotlight",
          title: "Name the uncertainty",
          body: "The responder asks for the unknown before answering.",
        },
        {
          action: "Both voices share the stage",
          title: "Make the question visible",
          body: "The exchange becomes the object of work.",
        },
      ],
      zh: [
        {
          action: "声音 A 在暖色追光下入场",
          title: "两个声音入场",
          body: "现场听见第一个宽泛的请求。",
        },
        {
          action: "声音 B 在冷色追光下入场",
          title: "先说清不确定性",
          body: "回应方先追问未知，而不是立刻给答案。",
        },
        {
          action: "两个声音共享舞台",
          title: "让问题可见",
          body: "对话本身成为需要处理的对象。",
        },
      ],
    },
  },
  2: {
    id: 2,
    layout: "friction",
    kicker: { en: "Scene 02 - Friction", zh: "第二幕 - 摩擦" },
    title: { en: "The First Answer Scrapes", zh: "第一个答案开始摩擦" },
    subtitle: {
      en: "Speed produces heat when the ask is still blurry.",
      zh: "问题还模糊时，速度只会制造热量。",
    },
    active: ["warm", "cool", "warm"],
    accent: "#ff6f5f",
    artifacts: [
      { en: "too wide", zh: "太宽" },
      { en: "missing owner", zh: "缺少负责人" },
      { en: "hidden constraint", zh: "隐藏约束" },
    ],
    turns: [
      {
        id: "fast-answer",
        beat: 0,
        side: "warm",
        label: { en: "Voice A", zh: "声音 A" },
        line: {
          en: "Just give me the recommendation.",
          zh: "直接给我建议就行。",
        },
        note: {
          en: "The ask rewards speed over fit.",
          zh: "这个问法奖励速度，而不是适配度。",
        },
      },
      {
        id: "missing-fit",
        beat: 1,
        side: "cool",
        label: { en: "Voice B", zh: "声音 B" },
        line: {
          en: "For whom, under which constraint, by when?",
          zh: "给谁用？受什么约束？什么时候交付？",
        },
        note: {
          en: "The answer cannot land without a runway.",
          zh: "没有跑道，答案无法降落。",
        },
      },
      {
        id: "friction-named",
        beat: 2,
        side: "warm",
        label: { en: "Friction", zh: "摩擦点" },
        line: {
          en: "We are debating answers to different questions.",
          zh: "我们在回答不同的问题。",
        },
        note: {
          en: "The useful conflict is finally named.",
          zh: "真正有用的冲突终于被命名。",
        },
      },
    ],
    beats: {
      en: [
        {
          action: "A fast recommendation is requested",
          title: "The First Answer Scrapes",
          body: "The initial answer is too early.",
        },
        {
          action: "Missing context interrupts the answer",
          title: "Fit before speed",
          body: "Audience, constraint, and timing surface as blockers.",
        },
        {
          action: "The room names the real conflict",
          title: "Different questions",
          body: "Friction becomes usable once it is specific.",
        },
      ],
      zh: [
        {
          action: "请求一个快速建议",
          title: "第一个答案开始摩擦",
          body: "最初的回答来得太早。",
        },
        {
          action: "缺失上下文打断回答",
          title: "先适配，再提速",
          body: "对象、约束和时间成为阻塞点。",
        },
        {
          action: "现场命名真实冲突",
          title: "不同的问题",
          body: "摩擦具体之后才有用。",
        },
      ],
    },
  },
  3: {
    id: 3,
    layout: "loop",
    kicker: { en: "Scene 03 - Clarify", zh: "第三幕 - 澄清" },
    title: { en: "The Clarification Loop", zh: "澄清循环" },
    subtitle: {
      en: "A better question is built by passing the cue back.",
      zh: "更好的问题，是把提示权来回传递出来的。",
    },
    active: ["cool", "warm", "cool", "both"],
    accent: "#65dcff",
    artifacts: [
      { en: "What must be true?", zh: "什么必须成立？" },
      { en: "Who feels the cost?", zh: "谁承担代价？" },
      { en: "What would prove it?", zh: "什么能证明？" },
      { en: "What changes Monday?", zh: "周一会改变什么？" },
    ],
    turns: [
      {
        id: "must-be-true",
        beat: 0,
        side: "cool",
        label: { en: "Clarifier", zh: "澄清方" },
        line: {
          en: "What must be true for any answer to matter?",
          zh: "任何答案要有意义，什么必须成立？",
        },
        note: {
          en: "Start with the assumption that carries the most weight.",
          zh: "先找承重最大的假设。",
        },
      },
      {
        id: "cost-holder",
        beat: 1,
        side: "warm",
        label: { en: "Requester", zh: "请求方" },
        line: {
          en: "The support team pays first if we choose wrong.",
          zh: "如果选错，支持团队最先付出代价。",
        },
        note: {
          en: "A hidden stakeholder steps into the light.",
          zh: "隐藏的利益相关方被照亮。",
        },
      },
      {
        id: "proof-shape",
        beat: 2,
        side: "cool",
        label: { en: "Clarifier", zh: "澄清方" },
        line: {
          en: "Then proof is a shorter queue, not a prettier plan.",
          zh: "那证据就是队列变短，而不是方案更漂亮。",
        },
        note: {
          en: "The answer now has an observable target.",
          zh: "答案有了可观察的靶心。",
        },
      },
      {
        id: "loop-closes",
        beat: 3,
        side: "both",
        label: { en: "Loop", zh: "循环" },
        line: {
          en: "Question: what reduces support load by Monday?",
          zh: "问题：什么能在周一前降低支持负载？",
        },
        note: {
          en: "The broad ask becomes a testable question.",
          zh: "宽泛请求变成可测试的问题。",
        },
      },
    ],
    beats: {
      en: [
        {
          action: "The first clarifying question appears",
          title: "What must be true?",
          body: "The room locates the load-bearing assumption.",
        },
        {
          action: "The cost holder is named",
          title: "Who feels the cost?",
          body: "A missing stakeholder enters the dialogue.",
        },
        {
          action: "The proof target is narrowed",
          title: "What would prove it?",
          body: "A measurable signal replaces preference.",
        },
        {
          action: "The loop closes into one testable ask",
          title: "What changes Monday?",
          body: "The better question becomes answerable.",
        },
      ],
      zh: [
        {
          action: "第一个澄清问题出现",
          title: "什么必须成立？",
          body: "现场找到承重假设。",
        },
        {
          action: "代价承担者被命名",
          title: "谁承担代价？",
          body: "缺席的利益相关方进入对话。",
        },
        {
          action: "证据目标被收窄",
          title: "什么能证明？",
          body: "可度量信号取代偏好。",
        },
        {
          action: "循环收束成一个可测试请求",
          title: "周一会改变什么？",
          body: "更好的问题开始可回答。",
        },
      ],
    },
  },
  4: {
    id: 4,
    layout: "aligned",
    kicker: { en: "Scene 04 - Align", zh: "第四幕 - 对齐" },
    title: { en: "An Answer Can Land", zh: "答案终于可以落地" },
    subtitle: {
      en: "The answer is smaller because the question is sharper.",
      zh: "问题更锋利，答案就能更小、更准。",
    },
    active: ["both", "cool", "both"],
    accent: "#8cf2c2",
    artifacts: [
      { en: "scope", zh: "范围" },
      { en: "owner", zh: "负责人" },
      { en: "proof", zh: "证据" },
    ],
    answer: {
      label: { en: "Aligned Answer", zh: "对齐后的答案" },
      body: {
        en: "Ship the support triage shortcut first, measure queue age by Monday, then decide whether the larger workflow is worth building.",
        zh: "先发布支持分流捷径，周一看队列时长，再决定大流程是否值得继续做。",
      },
      chips: [
        { en: "first move", zh: "第一步" },
        { en: "visible metric", zh: "可见指标" },
        { en: "next gate", zh: "下一道门" },
      ],
    },
    turns: [
      {
        id: "aligned-question",
        beat: 0,
        side: "both",
        label: { en: "Shared Question", zh: "共享问题" },
        line: {
          en: "What reduces support load by Monday without hiding risk?",
          zh: "什么能在周一前降低支持负载，同时不掩盖风险？",
        },
        note: {
          en: "The room now shares one frame.",
          zh: "现场终于共享同一个框架。",
        },
      },
      {
        id: "answer-beam",
        beat: 1,
        side: "cool",
        label: { en: "Answer", zh: "答案" },
        line: {
          en: "Start with the reversible shortcut.",
          zh: "从可逆的捷径开始。",
        },
        note: {
          en: "The answer is scoped to the proof target.",
          zh: "答案被约束在证据目标之内。",
        },
      },
      {
        id: "decision-gate",
        beat: 2,
        side: "both",
        label: { en: "Gate", zh: "关口" },
        line: {
          en: "If queue age falls, expand. If not, stop.",
          zh: "队列时长下降就扩展；没有下降就停止。",
        },
        note: {
          en: "The next decision is already designed.",
          zh: "下一次决策已经被设计好。",
        },
      },
    ],
    beats: {
      en: [
        {
          action: "Both voices share one question",
          title: "One frame",
          body: "The question now includes outcome, timing, and risk.",
        },
        {
          action: "The answer narrows to a reversible first move",
          title: "First move",
          body: "A scoped action lands under the cool spotlight.",
        },
        {
          action: "The next gate is made explicit",
          title: "Expand or stop",
          body: "The metric decides what happens next.",
        },
      ],
      zh: [
        {
          action: "两个声音共享同一个问题",
          title: "同一个框架",
          body: "问题已经包含结果、时间和风险。",
        },
        {
          action: "答案收窄成可逆的第一步",
          title: "第一步",
          body: "一个有边界的动作在冷色追光下落地。",
        },
        {
          action: "下一道门被明确写出",
          title: "扩展或停止",
          body: "由指标决定下一步。",
        },
      ],
    },
  },
  5: {
    id: 5,
    layout: "curtain",
    kicker: { en: "Scene 05 - Curtain", zh: "第五幕 - 谢幕" },
    title: { en: "Curtain Call", zh: "谢幕" },
    subtitle: {
      en: "The lasting artifact is not the answer. It is the question that can keep working.",
      zh: "留下来的不只是答案，而是还能继续工作的那个问题。",
    },
    active: ["both", "warm", "cool"],
    accent: "#f5d37c",
    artifacts: [
      { en: "pause before answer", zh: "回答前停顿" },
      { en: "ask for missing frame", zh: "追问缺失框架" },
      { en: "land a testable next move", zh: "落到可测试下一步" },
    ],
    turns: [
      {
        id: "curtain-line",
        beat: 0,
        side: "both",
        label: { en: "Curtain Line", zh: "谢幕台词" },
        line: {
          en: "A better question makes the answer accountable.",
          zh: "更好的问题，让答案必须负责。",
        },
        note: {
          en: "The stage holds the final sentence.",
          zh: "舞台留住最后一句话。",
        },
      },
      {
        id: "warm-bow",
        beat: 1,
        side: "warm",
        label: { en: "Voice A", zh: "声音 A" },
        line: {
          en: "I know what I am asking for now.",
          zh: "现在我知道自己在问什么了。",
        },
        note: {
          en: "The requester leaves with a reusable frame.",
          zh: "请求方带着可复用框架退场。",
        },
      },
      {
        id: "cool-bow",
        beat: 2,
        side: "cool",
        label: { en: "Voice B", zh: "声音 B" },
        line: {
          en: "Then the answer can be honest about its limits.",
          zh: "于是答案也能诚实说明自己的边界。",
        },
        note: {
          en: "The responder leaves with permission to be precise.",
          zh: "回应方获得精确回答的许可。",
        },
      },
    ],
    beats: {
      en: [
        {
          action: "The final shared line appears",
          title: "Curtain Call",
          body: "The stage keeps the accountable question.",
        },
        {
          action: "Voice A bows with a clearer ask",
          title: "Requester exits",
          body: "The requester can reuse the frame.",
        },
        {
          action: "Voice B bows with a bounded answer",
          title: "Responder exits",
          body: "The answer is precise enough to trust.",
        },
      ],
      zh: [
        {
          action: "最终共享台词出现",
          title: "谢幕",
          body: "舞台留下能负责的问题。",
        },
        {
          action: "声音 A 带着更清楚的请求谢幕",
          title: "请求方退场",
          body: "请求方可以复用这个框架。",
        },
        {
          action: "声音 B 带着有边界的答案谢幕",
          title: "回应方退场",
          body: "答案足够精确，因此值得信任。",
        },
      ],
    },
  },
};

function text(value: LocalizedText, language: Language): string {
  return value[language];
}

function clampBeat(sceneId: number, beat: number): number {
  const maxBeat = SCENES[sceneId].beats.en.length - 1;
  return Math.max(0, Math.min(beat, maxBeat));
}

function sceneOrFallback(scene: number): number {
  return SCENE_IDS.includes(scene) ? scene : 1;
}

function cx(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

function useFonts(): void {
  useEffect(() => {
    const id = "style-04-better-question-v2-fonts";
    if (document.getElementById(id)) return;

    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600;700&family=Noto+Sans+SC:wght@400;500;700&display=swap";
    document.head.appendChild(link);
  }, []);
}

function SpeakerMarker({
  side,
  active,
  language,
}: {
  side: Exclude<VoiceSide, "both">;
  active: boolean;
  language: Language;
}) {
  const label =
    side === "warm"
      ? { en: "Voice A", zh: "声音 A" }
      : { en: "Voice B", zh: "声音 B" };
  const caption =
    side === "warm"
      ? { en: "asker", zh: "提问者" }
      : { en: "clarifier", zh: "澄清者" };

  return (
    <div
      className={cx("bq04-speaker", `bq04-speaker-${side}`)}
      data-active={active ? "true" : "false"}
      data-beat-layout-item="true"
    >
      <span className="bq04-speaker-light" />
      <span className="bq04-speaker-label">{text(label, language)}</span>
      <span className="bq04-speaker-caption">{text(caption, language)}</span>
    </div>
  );
}

function DialogueTurns({
  scene,
  beat,
  language,
}: {
  scene: SceneCopy;
  beat: number;
  language: Language;
}) {
  const visibleTurns = scene.turns.filter((turn) => turn.beat <= beat);

  return (
    <div className="bq04-turn-stack" data-beat-layout-item="true">
      {visibleTurns.map((turn, index) => (
        <div
          key={turn.id}
          className={cx("bq04-turn", `bq04-turn-${turn.side}`)}
          data-side={turn.side}
          data-beat-layout-item="true"
          style={{ "--turn-index": String(index) } as CSSProperties}
        >
          <div className="bq04-turn-label">{text(turn.label, language)}</div>
          <div className="bq04-turn-line">{text(turn.line, language)}</div>
          <div className="bq04-turn-note">{text(turn.note, language)}</div>
        </div>
      ))}
    </div>
  );
}

function SceneArtifact({
  scene,
  beat,
  language,
}: {
  scene: SceneCopy;
  beat: number;
  language: Language;
}) {
  if (scene.layout === "aligned" && scene.answer) {
    return (
      <div className="bq04-artifact bq04-answer" data-beat-layout-item="true">
        <div className="bq04-answer-label">{text(scene.answer.label, language)}</div>
        {beat >= 1 ? (
          <p className="bq04-answer-body">{text(scene.answer.body, language)}</p>
        ) : null}
        {beat >= 2 ? (
          <div className="bq04-chip-row">
            {scene.answer.chips.map((chip) => (
              <span key={chip.en} className="bq04-chip" data-beat-layout-item="true">
                {text(chip, language)}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div
      className={cx("bq04-artifact", `bq04-artifact-${scene.layout}`)}
      data-beat-layout-item="true"
    >
      {scene.artifacts.slice(0, beat + 1).map((item, index) => (
        <span
          key={item.en}
          className="bq04-artifact-token"
          data-beat-layout-item="true"
          style={{ "--token-index": String(index) } as CSSProperties}
        >
          {text(item, language)}
        </span>
      ))}
    </div>
  );
}

function ScenePanel({
  sceneId,
  beat,
  language,
  isActive,
  isThumbnail,
  motionOff,
}: {
  sceneId: number;
  beat: number;
  language: Language;
  isActive: boolean;
  isThumbnail: boolean;
  motionOff: boolean;
}) {
  const scene = SCENES[sceneId] ?? SCENES[1];
  const safeBeat = isThumbnail ? scene.beats.en.length - 1 : clampBeat(sceneId, beat);
  const activeSide = scene.active[Math.min(safeBeat, scene.active.length - 1)];
  const flip = useFLIP<HTMLElement>({
    watch: [sceneId, safeBeat, language],
    disabled: motionOff || !isActive,
    duration: 560,
    easing: "cubic-bezier(0.16, 1, 0.3, 1)",
    selector: '[data-beat-layout-item="true"]',
  });

  return (
    <article
      ref={flip.ref}
      className="bq04-scene"
      data-layout={scene.layout}
      data-active-side={activeSide}
      data-beat-layout-container="true"
      data-beat-layout-mode="motion"
      style={{ "--scene-accent": scene.accent } as CSSProperties}
    >
      <header className="bq04-scene-header" data-beat-layout-item="true">
        <p className="bq04-kicker">{text(scene.kicker, language)}</p>
        <h1>{text(scene.title, language)}</h1>
        <p className="bq04-subtitle">{text(scene.subtitle, language)}</p>
      </header>

      <div className="bq04-dialogue-stage" data-beat-layout-item="true">
        <SpeakerMarker
          side="warm"
          active={activeSide === "warm" || activeSide === "both"}
          language={language}
        />
        <DialogueTurns scene={scene} beat={safeBeat} language={language} />
        <SpeakerMarker
          side="cool"
          active={activeSide === "cool" || activeSide === "both"}
          language={language}
        />
      </div>

      <SceneArtifact scene={scene} beat={safeBeat} language={language} />
    </article>
  );
}

function SpotlightCueRail({
  scene,
  onNavigate,
  language,
}: {
  scene: number;
  onNavigate?: BespokeStyleProps["onNavigate"];
  language: Language;
}) {
  return (
    <nav className="bq04-cue-rail" aria-label="Scene cues">
      {SCENE_IDS.map((sceneId) => {
        const target = SCENES[sceneId];
        const active = scene === sceneId;

        return (
          <button
            key={sceneId}
            type="button"
            className="bq04-cue-button"
            data-active={active ? "true" : "false"}
            onClick={() => onNavigate?.(sceneId, 0)}
            aria-label={text(target.title, language)}
            style={{ "--cue-accent": target.accent } as CSSProperties}
          >
            <span className="bq04-cue-lamp" />
            <span className="bq04-cue-label">{String(sceneId).padStart(2, "0")}</span>
          </button>
        );
      })}
    </nav>
  );
}

export function getMetadata(lang: Language): StyleMetadata {
  return {
    id: "04",
    band: "minimal-keynote",
    name: lang === "zh" ? "互动对话舞台" : "Interactive Dialogue Stage",
    theme: lang === "zh" ? "更好的问题" : "The Better Question",
    densityLabel: lang === "zh" ? "对话中密度" : "Dialogue Medium",
    heroScene: 3,
    colors: {
      bg: "#061019",
      ink: "#f5fbff",
      panel: "#102131",
    },
    typography: {
      header: "IBM Plex Mono 600",
      body: "IBM Plex Mono 400",
    },
    tags: ["minimal", "dialogue", "stage", "motion", "bilingual"],
    fonts: ["IBM Plex Mono", "cjk:Noto Sans SC"],
    scenes: SCENE_IDS.map((sceneId) => {
      const scene = SCENES[sceneId];
      return {
        id: sceneId,
        title: text(scene.title, lang),
        beats: scene.beats[lang].map((beat, index) => ({
          id: index,
          action: beat.action,
          title: beat.title,
          body: beat.body,
        })),
      };
    }),
  };
}

export default function BetterQuestionV2({
  scene,
  beat,
  language,
  isThumbnail,
  reducedMotion,
  onNavigate,
}: BespokeStyleProps) {
  useFonts();

  const safeScene = sceneOrFallback(scene);
  const safeBeat = clampBeat(safeScene, beat);
  const motionOff = reducedMotion || isThumbnail;

  return (
    <section
      className="bq04-root"
      data-motion={motionOff ? "off" : "on"}
      data-thumbnail={isThumbnail ? "true" : "false"}
    >
      <style>{BETTER_QUESTION_STYLES}</style>
      <div className="bq04-proscenium" aria-hidden="true" />
      <div className="bq04-light bq04-light-warm" aria-hidden="true" />
      <div className="bq04-light bq04-light-cool" aria-hidden="true" />
      <div className="bq04-top-chrome" aria-hidden="true">
        <span>04 / v2</span>
        <span>{language === "zh" ? "更好的问题" : "The Better Question"}</span>
      </div>
      <SpatialSceneTrack
        scene={safeScene}
        beat={safeBeat}
        transitionKind="fade"
        transitionMap={TRANSITION_MAP}
        transitionDurationMs={760}
        reducedMotion={motionOff}
        beatLayoutModes={BEAT_LAYOUT_MODES}
        className="bq04-track"
        renderScene={(sceneId, sceneBeat, isActive) => (
          <ScenePanel
            sceneId={sceneId}
            beat={sceneBeat}
            language={language}
            isActive={isActive}
            isThumbnail={isThumbnail}
            motionOff={motionOff}
          />
        )}
      />
      {isThumbnail ? null : (
        <SpotlightCueRail
          scene={safeScene}
          onNavigate={onNavigate}
          language={language}
        />
      )}
    </section>
  );
}

export const betterQuestionV2Version = defineStyleVersion({
  id: "v2",
  topic: "The Better Question",
  model: "GPT-5",
  component: BetterQuestionV2,
  getMetadata,
});

const BETTER_QUESTION_STYLES = `
.bq04-root {
  --bq04-bg: #061019;
  --bq04-ink: #f5fbff;
  --bq04-muted: #8ca4b8;
  --bq04-panel: rgba(11, 27, 41, 0.72);
  --bq04-panel-strong: rgba(15, 39, 58, 0.9);
  --bq04-warm: #ffb15f;
  --bq04-cool: #65dcff;
  --bq04-good: #8cf2c2;
  position: relative;
  width: 100%;
  height: 100%;
  container-type: size;
  overflow: hidden;
  color: var(--bq04-ink);
  font-family: "IBM Plex Mono", "Noto Sans SC", ui-monospace, monospace;
  background:
    linear-gradient(115deg, rgba(255, 177, 95, 0.16) 0%, rgba(255, 177, 95, 0) 28%),
    linear-gradient(245deg, rgba(101, 220, 255, 0.16) 0%, rgba(101, 220, 255, 0) 30%),
    linear-gradient(180deg, #071524 0%, #04080f 62%, #02050a 100%);
}

.bq04-root::before {
  content: "";
  position: absolute;
  inset: 0;
  background:
    repeating-linear-gradient(0deg, rgba(245, 251, 255, 0.045) 0 0.1cqh, transparent 0.1cqh 1.55cqh),
    linear-gradient(90deg, rgba(255, 177, 95, 0.09), transparent 24%, transparent 76%, rgba(101, 220, 255, 0.09));
  opacity: 0.72;
  pointer-events: none;
}

.bq04-proscenium {
  position: absolute;
  inset: 4.2cqh 3.2cqw 10.8cqh;
  border: 0.12cqw solid rgba(178, 213, 236, 0.22);
  border-radius: 1.4cqw;
  box-shadow:
    inset 0 0 3.4cqw rgba(101, 220, 255, 0.08),
    0 0 4.2cqw rgba(0, 0, 0, 0.34);
  pointer-events: none;
  z-index: 1;
}

.bq04-light {
  position: absolute;
  top: 3cqh;
  width: 22cqw;
  height: 78cqh;
  opacity: 0.48;
  filter: blur(0.35cqw);
  transform-origin: top center;
  pointer-events: none;
  z-index: 1;
}

.bq04-light-warm {
  left: 6cqw;
  background: linear-gradient(180deg, rgba(255, 177, 95, 0.28), rgba(255, 177, 95, 0.03) 62%, transparent);
  clip-path: polygon(42% 0, 58% 0, 100% 100%, 0 100%);
  transform: skewX(-8deg);
}

.bq04-light-cool {
  right: 6cqw;
  background: linear-gradient(180deg, rgba(101, 220, 255, 0.28), rgba(101, 220, 255, 0.03) 62%, transparent);
  clip-path: polygon(42% 0, 58% 0, 100% 100%, 0 100%);
  transform: skewX(8deg);
}

.bq04-top-chrome {
  position: absolute;
  top: 5.7cqh;
  left: 5.4cqw;
  right: 5.4cqw;
  z-index: 5;
  display: flex;
  justify-content: space-between;
  color: rgba(211, 231, 246, 0.62);
  font-size: 0.84cqw;
  line-height: 1;
  letter-spacing: 0;
  text-transform: uppercase;
}

.bq04-track {
  position: absolute;
  inset: 8.4cqh 5.4cqw 15cqh;
  z-index: 4;
}

.bq04-scene {
  position: relative;
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-rows: auto minmax(0, 1fr) auto;
  gap: 2.3cqh;
  padding: 4.4cqh 4.2cqw 3.4cqh;
  border-radius: 1.2cqw;
  background:
    linear-gradient(180deg, rgba(9, 24, 36, 0.74), rgba(5, 12, 20, 0.68)),
    linear-gradient(90deg, rgba(255, 255, 255, 0.035), rgba(255, 255, 255, 0));
  box-shadow: inset 0 0 0 0.1cqw rgba(226, 244, 255, 0.12);
}

.bq04-scene::after {
  content: "";
  position: absolute;
  left: 7cqw;
  right: 7cqw;
  bottom: 3cqh;
  height: 0.18cqh;
  background: linear-gradient(90deg, transparent, var(--scene-accent), transparent);
  opacity: 0.62;
}

.bq04-scene-header {
  display: grid;
  gap: 1.2cqh;
  max-width: 70cqw;
}

.bq04-kicker {
  margin: 0;
  color: var(--scene-accent);
  font-size: 0.95cqw;
  line-height: 1.1;
  letter-spacing: 0;
  text-transform: uppercase;
}

.bq04-scene h1 {
  margin: 0;
  color: var(--bq04-ink);
  font-size: clamp(3.2cqw, 4.8cqw, 5.8cqw);
  line-height: 1.02;
  font-weight: 700;
  letter-spacing: 0;
}

.bq04-subtitle {
  margin: 0;
  max-width: 58cqw;
  color: rgba(221, 237, 249, 0.76);
  font-size: clamp(1.2cqw, 1.55cqw, 1.8cqw);
  line-height: 1.34;
  letter-spacing: 0;
}

.bq04-dialogue-stage {
  display: grid;
  grid-template-columns: 15.5cqw minmax(0, 1fr) 15.5cqw;
  align-items: stretch;
  gap: 2.2cqw;
  min-height: 42cqh;
}

.bq04-scene[data-layout="loop"] .bq04-dialogue-stage,
.bq04-scene[data-layout="aligned"] .bq04-dialogue-stage {
  grid-template-columns: 12.5cqw minmax(0, 1fr) 12.5cqw;
}

.bq04-scene[data-layout="curtain"] .bq04-dialogue-stage {
  min-height: 36cqh;
}

.bq04-speaker {
  position: relative;
  display: grid;
  align-content: center;
  justify-items: center;
  gap: 1.2cqh;
  min-height: 34cqh;
  border: 0.1cqw solid rgba(202, 229, 246, 0.13);
  border-radius: 1cqw;
  background: rgba(255, 255, 255, 0.034);
  color: rgba(226, 242, 252, 0.58);
  transition:
    color 360ms ease,
    border-color 360ms ease,
    background 360ms ease,
    transform 560ms cubic-bezier(0.16, 1, 0.3, 1);
}

.bq04-speaker[data-active="true"] {
  color: var(--bq04-ink);
  border-color: color-mix(in srgb, var(--scene-accent) 64%, transparent);
  background: color-mix(in srgb, var(--scene-accent) 13%, rgba(255, 255, 255, 0.035));
  transform: translateY(-0.7cqh);
}

.bq04-speaker-light {
  width: 5.6cqw;
  height: 5.6cqw;
  border-radius: 50%;
  border: 0.16cqw solid currentColor;
  box-shadow: 0 0 2.4cqw color-mix(in srgb, currentColor 32%, transparent);
}

.bq04-speaker-warm .bq04-speaker-light {
  color: var(--bq04-warm);
}

.bq04-speaker-cool .bq04-speaker-light {
  color: var(--bq04-cool);
}

.bq04-speaker-label {
  font-size: 1.1cqw;
  font-weight: 700;
  line-height: 1;
  letter-spacing: 0;
  text-transform: uppercase;
}

.bq04-speaker-caption {
  color: rgba(210, 230, 244, 0.56);
  font-size: 0.84cqw;
  line-height: 1.1;
  letter-spacing: 0;
  text-transform: uppercase;
}

.bq04-turn-stack {
  align-self: stretch;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1.4cqh;
  min-width: 0;
}

.bq04-turn {
  position: relative;
  display: grid;
  gap: 0.85cqh;
  padding: 1.8cqh 2cqw;
  border: 0.1cqw solid rgba(220, 239, 252, 0.14);
  border-radius: 0.95cqw;
  background: var(--bq04-panel);
  box-shadow: 0 1.4cqh 2.8cqw rgba(0, 0, 0, 0.22);
  animation: bq04-turn-enter 520ms cubic-bezier(0.16, 1, 0.3, 1) both;
  animation-delay: calc(var(--turn-index) * 0.055s);
}

.bq04-turn::before {
  content: "";
  position: absolute;
  top: 1.5cqh;
  bottom: 1.5cqh;
  width: 0.22cqw;
  border-radius: 999cqw;
  background: var(--scene-accent);
  opacity: 0.78;
}

.bq04-turn-warm::before {
  left: 1cqw;
  background: var(--bq04-warm);
}

.bq04-turn-cool::before {
  right: 1cqw;
  background: var(--bq04-cool);
}

.bq04-turn-both::before {
  left: 1cqw;
  right: 1cqw;
  width: auto;
  top: auto;
  height: 0.22cqh;
  background: linear-gradient(90deg, var(--bq04-warm), var(--bq04-cool));
}

.bq04-turn-label {
  color: var(--scene-accent);
  font-size: 0.92cqw;
  font-weight: 700;
  line-height: 1;
  letter-spacing: 0;
  text-transform: uppercase;
}

.bq04-turn-line {
  color: var(--bq04-ink);
  font-size: clamp(1.25cqw, 1.65cqw, 2.05cqw);
  font-weight: 600;
  line-height: 1.22;
  letter-spacing: 0;
}

.bq04-turn-note {
  color: rgba(211, 230, 243, 0.65);
  font-size: clamp(0.88cqw, 1.02cqw, 1.18cqw);
  line-height: 1.35;
  letter-spacing: 0;
}

.bq04-artifact {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 1cqw;
  min-height: 8.8cqh;
}

.bq04-artifact-token,
.bq04-chip {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 4.2cqh;
  padding: 0.7cqh 1.25cqw;
  border: 0.1cqw solid color-mix(in srgb, var(--scene-accent) 48%, transparent);
  border-radius: 999cqw;
  background: color-mix(in srgb, var(--scene-accent) 12%, rgba(5, 16, 25, 0.78));
  color: rgba(245, 251, 255, 0.86);
  font-size: 0.95cqw;
  line-height: 1.1;
  letter-spacing: 0;
  animation: bq04-token-enter 520ms cubic-bezier(0.16, 1, 0.3, 1) both;
  animation-delay: calc(var(--token-index) * 0.07s);
}

.bq04-artifact-friction .bq04-artifact-token {
  border-color: rgba(255, 111, 95, 0.62);
  background: rgba(77, 21, 24, 0.64);
}

.bq04-artifact-loop {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  align-items: stretch;
}

.bq04-artifact-loop .bq04-artifact-token {
  border-radius: 0.85cqw;
  min-height: 6.4cqh;
}

.bq04-answer {
  display: grid;
  gap: 1.3cqh;
  justify-items: center;
  padding: 1.7cqh 2.4cqw;
  border: 0.1cqw solid rgba(140, 242, 194, 0.42);
  border-radius: 1cqw;
  background:
    linear-gradient(90deg, rgba(255, 177, 95, 0.09), rgba(140, 242, 194, 0.12), rgba(101, 220, 255, 0.09)),
    rgba(6, 20, 28, 0.7);
}

.bq04-answer-label {
  color: var(--bq04-good);
  font-size: 0.98cqw;
  font-weight: 700;
  line-height: 1;
  text-transform: uppercase;
  letter-spacing: 0;
}

.bq04-answer-body {
  margin: 0;
  max-width: 70cqw;
  color: var(--bq04-ink);
  text-align: center;
  font-size: clamp(1.15cqw, 1.45cqw, 1.75cqw);
  line-height: 1.34;
  letter-spacing: 0;
}

.bq04-chip-row {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.8cqw;
}

.bq04-cue-rail {
  position: absolute;
  left: 24cqw;
  right: 24cqw;
  bottom: 4.4cqh;
  z-index: 7;
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  align-items: end;
  gap: 1cqw;
}

.bq04-cue-rail::before {
  content: "";
  position: absolute;
  left: 3cqw;
  right: 3cqw;
  top: 2.2cqh;
  height: 0.12cqh;
  background: linear-gradient(90deg, transparent, rgba(222, 239, 250, 0.28), transparent);
}

.bq04-cue-button {
  appearance: none;
  position: relative;
  display: grid;
  justify-items: center;
  gap: 0.8cqh;
  border: 0;
  background: transparent;
  color: rgba(218, 236, 248, 0.54);
  font: inherit;
  cursor: pointer;
}

.bq04-cue-button:focus-visible {
  outline: 0.16cqw solid var(--cue-accent);
  outline-offset: 0.45cqw;
  border-radius: 1cqw;
}

.bq04-cue-lamp {
  width: 1.35cqw;
  height: 1.35cqw;
  border-radius: 50%;
  border: 0.1cqw solid currentColor;
  background: rgba(255, 255, 255, 0.05);
  box-shadow: 0 0 1cqw rgba(255, 255, 255, 0.08);
  transition:
    transform 300ms ease,
    background 300ms ease,
    box-shadow 300ms ease,
    border-color 300ms ease;
}

.bq04-cue-label {
  color: currentColor;
  font-size: 0.82cqw;
  line-height: 1;
  letter-spacing: 0;
}

.bq04-cue-button[data-active="true"] {
  color: var(--cue-accent);
}

.bq04-cue-button[data-active="true"] .bq04-cue-lamp {
  transform: translateY(-0.55cqh);
  background: var(--cue-accent);
  border-color: var(--cue-accent);
  box-shadow: 0 0 1.8cqw color-mix(in srgb, var(--cue-accent) 58%, transparent);
}

.bq04-root[data-thumbnail="true"] .bq04-track {
  inset: 7.4cqh 5cqw 7.4cqh;
}

.bq04-root[data-thumbnail="true"] .bq04-top-chrome {
  display: none;
}

.bq04-root[data-thumbnail="true"] .bq04-scene {
  padding: 4cqh 4cqw;
  gap: 1.6cqh;
}

.bq04-root[data-thumbnail="true"] .bq04-scene h1 {
  font-size: 4cqw;
}

.bq04-root[data-thumbnail="true"] .bq04-subtitle,
.bq04-root[data-thumbnail="true"] .bq04-turn-note,
.bq04-root[data-thumbnail="true"] .bq04-speaker-caption {
  display: none;
}

.bq04-root[data-motion="off"] *,
.bq04-root[data-motion="off"] *::before,
.bq04-root[data-motion="off"] *::after {
  animation-duration: 0s !important;
  transition-duration: 0s !important;
}

@keyframes bq04-turn-enter {
  from {
    opacity: 0;
    transform: translateY(1.4cqh) scale(0.985);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes bq04-token-enter {
  from {
    opacity: 0;
    transform: translateY(0.9cqh);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
`;

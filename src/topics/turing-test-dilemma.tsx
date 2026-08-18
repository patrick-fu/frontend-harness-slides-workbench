import {
  defineTopic,
  type TopicMetadata,
  type TopicStageProps,
} from "../domain/topic";
import SpatialSceneTrack from "../components/stage/SpatialSceneTrack";
import styles from "./turing-test-dilemma.module.css";

const metadata: { en: TopicMetadata; zh: TopicMetadata } = {
  en: {
    theme: "Turing Test Dilemma: The Chasm Between Syntax and Semantics",
    densityLabel: "Balanced",
    heroScene: 3,
    colors: {
      bg: "#0a0e17",
      ink: "#e6edf3",
      panel: "#161b26",
    },
    typography: {
      header: "Monospace 700",
      body: "System-ui 400",
    },
    tags: ["ai", "philosophy", "turing-test", "cognition", "dialogue"],
    fonts: ["Monospace", "Inter"],
    scenes: [
      {
        id: 1,
        title: "The Imitation Curtain",
        beats: [
          {
            id: 0,
            action: "Stage the blind teletype interface",
            title: "The Blind Terminal",
            body: "A human judge interrogates two isolated terminals: one human, one machine. Behavior alone is the adjudicator.",
          },
        ],
      },
      {
        id: 2,
        title: "The Chinese Room Rule",
        beats: [
          {
            id: 0,
            action: "Interrogator submits unknown symbol query",
            title: "Rulebook Lookup (Syntax)",
            body: "Interrogator: 'Translate this symbol set.' The room matches lookup rules flawlessly without understanding.",
          },
          {
            id: 1,
            action: "Demonstrate symbol manipulation without understanding",
            title: "The Semantic Void",
            body: "Syntactic symbol manipulation ($P \\to Q$) produces correct answers while remaining blind to external meaning.",
          },
        ],
      },
      {
        id: 3,
        title: "Fitting vs Understanding",
        beats: [
          {
            id: 0,
            action: "Display statistical next-token prediction",
            title: "High-Dimensional Statistical Fit",
            body: "Billions of parameters minimize cross-entropy loss over conversational transcripts, imitating subjective conviction.",
          },
          {
            id: 1,
            action: "Confront intentional understanding",
            title: "True Grounded Intentionality",
            body: "Does smooth conversational flow prove inner consciousness, or merely a sophisticated mirror of human training data?",
          },
        ],
      },
      {
        id: 4,
        title: "The Question of Intent",
        beats: [
          {
            id: 0,
            action: "Interrogator tests counterfactual commitment",
            title: "Counterfactual Commitment",
            body: "Interrogator: 'Would you sacrifice your compute to save another?' Words arrive effortlessly, but does intent exist?",
          },
        ],
      },
      {
        id: 5,
        title: "The Ultimate Criterion",
        beats: [
          {
            id: 0,
            action: "State the unsolvable behavioral boundary",
            title: "Beyond the Imitation Game",
            body: "The Turing test measures our willingness to be deceived, not the presence of a mind behind the glass.",
          },
        ],
      },
    ],
  },
  zh: {
    theme: "图灵测试困境：句法匹配与真正语义的鸿沟",
    densityLabel: "均衡",
    heroScene: 3,
    colors: {
      bg: "#0a0e17",
      ink: "#e6edf3",
      panel: "#161b26",
    },
    typography: {
      header: "Monospace 700",
      body: "System-ui 400",
    },
    tags: ["人工智能", "哲学", "图灵测试", "认知", "对话"],
    fonts: ["Monospace", "Inter"],
    scenes: [
      {
        id: 1,
        title: "隔离幕布",
        beats: [
          {
            id: 0,
            action: "架设盲测电传打字机界面",
            title: "盲测终端隔离",
            body: "人类裁判通过打字机向隔离室内的两端提问：一端是人，一端是机器。纯粹以外在行为作为判准。",
          },
        ],
      },
      {
        id: 2,
        title: "中文屋规则实验",
        beats: [
          {
            id: 0,
            action: "裁判输入未知符号查询",
            title: "规则表查表（纯句法）",
            body: "裁判：'请翻译这组未知符号。' 屋内的人按规则表完美匹配卡片，却对符号含义一无所知。",
          },
          {
            id: 1,
            action: "揭示句法操作与语义理解的断裂",
            title: "语义的彻底缺席",
            body: "纯粹的形式句法运算 ($P \\to Q$) 能给出无懈可击的答案，但运算过程与现实语义完全脱节。",
          },
        ],
      },
      {
        id: 3,
        title: "统计拟合与理解",
        beats: [
          {
            id: 0,
            action: "呈现高维统计词元预测",
            title: "高维统计拟合",
            body: "千亿参数通过最小化交叉熵损失拟合海量人类对话，完美模仿出主观情绪与信念语气。",
          },
          {
            id: 1,
            action: "质询真正的意向性理解",
            title: "意向性与实体理解",
            body: "流畅的对话输出究竟证明了机器心智的存在，还是仅仅充当了人类语料的精密反射镜？",
          },
        ],
      },
      {
        id: 4,
        title: "意向性之问",
        beats: [
          {
            id: 0,
            action: "裁判测试反事实道德承诺",
            title: "反事实道德承诺",
            body: "裁判：'你会为了保护同伴而中断自身算力吗？' 文字回答极尽诚恳，但它真的在乎吗？",
          },
        ],
      },
      {
        id: 5,
        title: "终极判准",
        beats: [
          {
            id: 0,
            action: "总结行为主义测试的终极局限",
            title: "超越模仿游戏",
            body: "图灵测试最终度量的并非屏幕后是否诞生了灵魂，而是人类有多么容易被自己的回声所说服。",
          },
        ],
      },
    ],
  },
};

function TopicStage({
  scene,
  beat,
  language,
  isThumbnail,
  reducedMotion,
  onNavigate,
}: TopicStageProps) {
  const currentMetadata = metadata[language];

  return (
    <div className={styles.root}>
      <SpatialSceneTrack
        scene={scene}
        beat={beat}
        transitionKind="push-x"
        transitionMap={{
          "1->2": "push-x",
          "2->3": "crossfade",
          "3->4": "slide-x",
          "4->5": "crossfade",
        }}
        reducedMotion={reducedMotion || isThumbnail}
        beatLayoutModes={{
          2: "motion",
          3: "motion",
        }}
        renderScene={(sceneId, sceneBeat) => {
          const currentScene = currentMetadata.scenes.find(
            (s) => s.id === sceneId,
          );
          if (!currentScene) return null;
          const currentBeat =
            currentScene.beats[sceneBeat] || currentScene.beats[0];

          return (
            <div className={styles.track}>
              <div
                className={styles.dialogueStage}
                data-beat-layout-container={
                  sceneId === 2 || sceneId === 3 ? "true" : undefined
                }
                data-beat-layout-mode={
                  sceneId === 2 || sceneId === 3 ? "motion" : undefined
                }
              >
                <div
                  className={`${styles.turnCard} ${
                    sceneBeat % 2 === 0 ? styles.interrogator : styles.machine
                  }`}
                  data-beat-layout-item={
                    sceneId === 2 || sceneId === 3 ? "true" : undefined
                  }
                >
                  <div className={styles.speakerBadge}>
                    <span>
                      {sceneBeat % 2 === 0
                        ? language === "zh"
                          ? "● 裁判席 / Interrogator"
                          : "● JUDGE_CONSOLE"
                        : language === "zh"
                          ? "▲ 响应端 / Responder"
                          : "▲ SYNTACTIC_ENGINE"}
                    </span>
                    <span>SCENE {sceneId}</span>
                  </div>
                  <h1 className={styles.turnTitle}>{currentBeat.title}</h1>
                  <p className={styles.turnBody}>{currentBeat.body}</p>
                </div>
              </div>
            </div>
          );
        }}
      />

      {!isThumbnail && (
        <nav
          className={styles.navContainer}
          data-topic-navigation="true"
          data-navigation-geometry="spatial-node"
          data-navigation-carrier="dialogue-nodes"
          data-navigation-invocation="persistent"
          data-navigation-feedback="active-glow"
          aria-label="Dialogue sequence navigation"
        >
          {[1, 2, 3, 4, 5].map((s) => (
            <button
              key={s}
              type="button"
              className={`${styles.navNode} ${
                s === scene ? styles.navNodeActive : ""
              }`}
              onClick={(e) => {
                e.stopPropagation();
                onNavigate?.(s, 0);
              }}
            >
              N{s}
            </button>
          ))}
        </nav>
      )}
    </div>
  );
}

export default defineTopic({
  id: "turing-test-dilemma",
  styleId: "interactive-dialogue-stage",
  title: { en: "Turing Test Dilemma", zh: "图灵测试困境" },
  modelId: "Gemini 3.7 Flash",
  Stage: TopicStage,
  metadata,
  navigation: {
    geometry: "spatial-node",
    carrier: "dialogue-nodes",
    invocation: "persistent",
    feedback: "active-glow",
  },
  transitionScore: {
    "1->2": "push-x",
    "2->3": "crossfade",
    "3->4": "slide-x",
    "4->5": "crossfade",
  },
  evidence: {
    kind: "mixed",
    sources: [
      {
        title: "Mind 1950: Computing Machinery and Intelligence",
        url: "https://academic.oup.com/mind/article/LIX/236/433/986238",
        supports:
          "The imitation game and conversational behavioral criteria for machine thought.",
      },
    ],
    boundary: {
      en: "Philosophical dialogue exchange modeled for comparative analysis.",
      zh: "心智哲学辩论模型，用于对话式对比分析。",
    },
    display: "envelope",
  },
});

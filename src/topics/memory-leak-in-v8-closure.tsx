import {
  defineTopic,
  type TopicMetadata,
  type TopicStageProps,
} from "../domain/topic";
import SpatialSceneTrack from "../components/stage/SpatialSceneTrack";
import styles from "./memory-leak-in-v8-closure.module.css";

const metadata: { en: TopicMetadata; zh: TopicMetadata } = {
  en: {
    theme: "V8 Engine Internals: Tracking Lexical Context Sharing in Sibling Closures",
    densityLabel: "Dense",
    heroScene: 3,
    colors: {
      bg: "#0d1117",
      ink: "#c9d1d9",
      panel: "#161b22",
    },
    typography: {
      header: "Fira Code 700",
      body: "Fira Code 400",
    },
    tags: ["javascript", "v8", "memory-leak", "closure", "issue-brief"],
    fonts: ["Fira Code", "monospace"],
    scenes: [
      {
        id: 1,
        title: "Linear Heap Growth",
        beats: [
          {
            id: 0,
            action: "Graph 72-hour continuous Node.js heap memory escalation to 1.4 GB",
            title: "ISSUE #1042: Heap Escalation to OOM",
            body: "Production microservices leak 20MB per hour, triggering SIGABRT out-of-memory crashes despite active V8 garbage collector passes.",
          },
        ],
      },
      {
        id: 2,
        title: "DevTools Retainer Tree",
        beats: [
          {
            id: 0,
            action: "Inspect heap snapshot retainer tree pinning large byte arrays",
            title: "Heap Snapshot Retainer Trace",
            body: "Chrome DevTools heap snapshot reveals huge 10MB ArrayBuffers pinned by invisible (closure) scope objects in the root retainer tree.",
          },
          {
            id: 1,
            action: "Isolate meteor closure pattern",
            title: "Shared Lexical Scope Trap",
            body: "A lightweight interval timer closure retains the outer lexical Context object containing the unused 10MB binary payload.",
          },
        ],
      },
      {
        id: 3,
        title: "Root Cause: V8 Context Sharing",
        beats: [
          {
            id: 0,
            action: "Explain why sibling closures in the same parent scope share a single V8 Context object",
            title: "ROOT CAUSE: Sibling Context Sharing",
            body: "V8 allocates one shared Context object per parent function activation; if one inner function touches a variable, all sibling closures keep it alive.",
          },
        ],
      },
      {
        id: 4,
        title: "Fix: Nullifying Reference",
        beats: [
          {
            id: 0,
            action: "Explicitly nullify the large reference or split scopes",
            title: "PATCH: Explicit Ref Nullification",
            body: "Setting `largeBuffer = null` after processing unpins the pointer from the shared V8 Context, allowing Mark-and-Sweep GC to free memory instantly.",
          },
        ],
      },
      {
        id: 5,
        title: "ESLint Guard Verification",
        beats: [
          {
            id: 0,
            action: "Enforce static AST linting rule in CI pipeline to prevent future regressions",
            title: "VERIFIED: Closed & Guarded by CI",
            body: "Merged PR #1048. Custom ESLint AST rule flags long-lived closures capturing large scoped variables across all repositories.",
          },
        ],
      },
    ],
  },
  zh: {
    theme: "V8 引擎内核：排查兄弟闭包共享词法上下文引发的内存泄漏",
    densityLabel: "密集",
    heroScene: 3,
    colors: {
      bg: "#0d1117",
      ink: "#c9d1d9",
      panel: "#161b22",
    },
    typography: {
      header: "Fira Code 700",
      body: "Fira Code 400",
    },
    tags: ["JavaScript", "V8引擎", "内存泄漏", "闭包", "问题排查"],
    fonts: ["Fira Code", "monospace"],
    scenes: [
      {
        id: 1,
        title: "72小时堆内存线性耗尽",
        beats: [
          {
            id: 0,
            action: "展示 Node.js 生产微服务 72 小时堆内存持续爬升至 1.4GB 触发 OOM",
            title: "问题报告 #1042：堆内存线性暴涨",
            body: "生产环境 Node.js 进程每小时稳定泄漏 20MB 内存，V8 垃圾回收器即使全量执行 Mark-Sweep 亦无法释放，最终触发 OOM 崩溃。",
          },
        ],
      },
      {
        id: 2,
        title: "堆快照引用链取证",
        beats: [
          {
            id: 0,
            action: "使用 Chrome DevTools 堆快照排查 10MB 缓冲区支配树",
            title: "DevTools 堆快照支配树取证",
            body: "分析 Heap Snapshot 发现数以百计的 10MB ArrayBuffer 被隐式 (closure) 作用域对象死死锚定在 GC Root 支配树上。",
          },
          {
            id: 1,
            action: "锁定典型 Meteor 闭包陷阱",
            title: "共享词法上下文死锁陷阱",
            body: "一个轻量的长生命周期定时器闭包，意外持有了包含 10MB 大变量的外部词法 Context 对象。",
          },
        ],
      },
      {
        id: 3,
        title: "根因：V8 Context 词法共享",
        beats: [
          {
            id: 0,
            action: "揭秘同级兄弟闭包在 V8 底层共用单一 Context 对象的实现细节",
            title: "根因剖析：兄弟闭包共享 Context",
            body: "V8 为外层函数单次执行分配单一的共享 Context；只要兄弟闭包之一访问了某个变量，所有闭包都将永久锁定整个 Context 内部对象。",
          },
        ],
      },
      {
        id: 4,
        title: "修复：显式置空与解构",
        beats: [
          {
            id: 0,
            action: "在执行完毕后显式置空引用打破 GC 引用链",
            title: "修复方案：显式引用解绑置空",
            body: "在业务处理完毕后显式赋值 `largeBuffer = null`，切断其在共享 V8 Context 中的强引用，垃圾回收器得以即刻释放千万字节内存。",
          },
        ],
      },
      {
        id: 5,
        title: "CI 静态扫描长效防护",
        beats: [
          {
            id: 0,
            action: "在 CI 流水线引入 AST 静态检查规则，彻底防范同类回归",
            title: "验收关闭：合入 CI 静态扫描防护",
            body: "PR #1048 正式合入。CI 流水线追加自定义 ESLint 规则，静态检测长周期回调对大型局部作用域变量的隐式捕获，实现防劣化闭环。",
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
          "2->3": "push-x",
          "3->4": "slide-x",
          "4->5": "crossfade",
        }}
        reducedMotion={reducedMotion || isThumbnail}
        beatLayoutModes={{
          2: "motion",
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
              <div className={styles.issueHeader}>
                <span className={styles.issueTag}>
                  GITHUB ISSUE #1042 // [BUG] V8 LEAK
                </span>
                <span className={sceneId === 5 ? styles.stateClosed : styles.stateOpen}>
                  {sceneId === 5 ? "CLOSED" : "INVESTIGATING"}
                </span>
              </div>

              <div
                className={styles.issueBody}
                data-beat-layout-container={sceneId === 2 ? "true" : undefined}
                data-beat-layout-mode={sceneId === 2 ? "motion" : undefined}
              >
                <div
                  className={styles.phaseLabel}
                  data-beat-layout-item={sceneId === 2 ? "true" : undefined}
                >
                  STEP 0{sceneId} // {sceneId === 1 ? "SYMPTOM" : sceneId === 2 ? "PROFILING" : sceneId === 3 ? "V8 INTERNALS" : sceneId === 4 ? "PATCH" : "VERIFICATION"}
                </div>
                <h1
                  className={styles.sceneTitle}
                  data-beat-layout-item={sceneId === 2 ? "true" : undefined}
                >
                  {currentBeat.title}
                </h1>
                <p
                  className={styles.sceneBody}
                  data-beat-layout-item={sceneId === 2 ? "true" : undefined}
                >
                  {currentBeat.body}
                </p>

                <div
                  className={styles.heapDump}
                  data-beat-layout-item={sceneId === 2 ? "true" : undefined}
                >
                  <div>$ node --inspect --max-old-space-size=2048 server.js</div>
                  <div>GC Root -&gt; (closure) -&gt; Context -&gt; ArrayBuffer (10,485,760 bytes) [LEAK PINNED]</div>
                  <div>STATUS: {sceneId >= 4 ? "RESOLVED (largeBuffer = null)" : "ROOT TRACE ACTIVE"}</div>
                </div>
              </div>

              <div className={styles.issueFooter}>
                <span>V8 ENGINE // CONTEXT ALLOCATION MODEL</span>
                <span>MAINTAINER TRIAGE REPORT</span>
              </div>
            </div>
          );
        }}
      />
    </div>
  );
}

export default defineTopic({
  id: "memory-leak-in-v8-closure",
  styleId: "maintainer-issue-brief",
  title: { en: "V8 Closure Memory Leak", zh: "V8闭包泄漏" },
  modelId: "Gemini 3.7 Flash",
  Stage: TopicStage,
  metadata,
  navigation: { mode: "none" },
  transitionScore: {
    "1->2": "push-x",
    "2->3": "push-x",
    "3->4": "slide-x",
    "4->5": "crossfade",
  },
  evidence: {
    kind: "facts",
    sources: [
      {
        title: "V8 JavaScript Engine: Scope and Context Allocation in Closures",
        url: "https://v8.dev/blog",
        supports:
          "Lexical context sharing between sibling closures, retainer tree snapshot tracing, and reference nullification.",
      },
    ],
  },
});

import {
  defineTopic,
  type TopicMetadata,
  type TopicStageProps,
} from "../domain/topic";
import SpatialSceneTrack from "../components/stage/SpatialSceneTrack";
import styles from "./linux-oom-killer.module.css";

const metadata: { en: TopicMetadata; zh: TopicMetadata } = {
  en: {
    theme: "Linux OOM Killer: Out-of-Memory Heuristic Process Arbitration",
    densityLabel: "Dense",
    heroScene: 3,
    colors: {
      bg: "#0d1117",
      ink: "#c9d1d9",
      panel: "#161b22",
    },
    typography: {
      header: "Monospace 800",
      body: "Monospace 400",
    },
    tags: ["linux", "kernel", "memory", "oom-killer", "debugging"],
    fonts: ["Monospace"],
    scenes: [
      {
        id: 1,
        title: "Memory Exhaustion Warning",
        beats: [
          {
            id: 0,
            action: "Trigger low memory watermarks and swap exhaustion",
            title: "Kernel Zone Watermark Depletion",
            body: "Active physical pages and swap reach 100% capacity; zone min watermarks are breached, failing all kmalloc allocations.",
          },
        ],
      },
      {
        id: 2,
        title: "Page Fault Allocation Failure",
        beats: [
          {
            id: 0,
            action: "Fail anonymous page allocation in handle_mm_fault",
            title: "__alloc_pages_nodemask Direct Reclaim",
            body: "Direct memory reclaim loops fail repeatedly; kswapd enters high-CPU thrashing without yielding contiguous free pages.",
          },
          {
            id: 1,
            action: "Invoke out_of_memory kernel entry point",
            title: "out_of_memory() Kernel Invocation",
            body: "The kernel panic handler is averted by invoking out_of_memory() to identify a sacrificial candidate process.",
          },
        ],
      },
      {
        id: 3,
        title: "The oom_badness Calculation",
        beats: [
          {
            id: 0,
            action: "Calculate badness score for every process in task list",
            title: "oom_badness() Heuristic Scoring",
            body: "Points = (RAM RSS + Swap) / Total RAM * 1000 + oom_score_adj. Root-privileged daemons are protected from termination.",
          },
          {
            id: 1,
            action: "Select victim process with highest badness score",
            title: "Victim Selection (PID 4092)",
            body: "Process 'leak_daemon' scores 842 points with 14GB RSS consumption, becoming the primary sacrifice target.",
          },
        ],
      },
      {
        id: 4,
        title: "Targeted Process Termination",
        beats: [
          {
            id: 0,
            action: "Send uncatchable SIGKILL to target process",
            title: "SIGKILL Dispatch to PID 4092",
            body: "do_send_sig_info(SIGKILL) terminates the process immediately, releasing page tables and reclaiming 14GB of physical RAM.",
          },
        ],
      },
      {
        id: 5,
        title: "System Health Restored",
        beats: [
          {
            id: 0,
            action: "Verify kernel zone recovery and green status",
            title: "Kernel Stability Restored",
            body: "Memory pressure collapses; kswapd settles into idle state, preserving critical system services without reboot.",
          },
        ],
      },
    ],
  },
  zh: {
    theme: "OOM 进程裁决：Linux 内核内存耗尽算法仲裁",
    densityLabel: "密集",
    heroScene: 3,
    colors: {
      bg: "#0d1117",
      ink: "#c9d1d9",
      panel: "#161b22",
    },
    typography: {
      header: "Monospace 800",
      body: "Monospace 400",
    },
    tags: ["Linux", "内核", "内存", "OOM", "调试"],
    fonts: ["Monospace"],
    scenes: [
      {
        id: 1,
        title: "内存耗尽警报",
        beats: [
          {
            id: 0,
            action: "物理内存与交换区耗尽，击穿水位线",
            title: "内核内存区低水位告警",
            body: "物理内存与 Swap 占用达 100%，触发 Zone Min 最低水位线，所有 kmalloc 内核内存分配陷入阻塞。",
          },
        ],
      },
      {
        id: 2,
        title: "缺页异常分配失败",
        beats: [
          {
            id: 0,
            action: "直接内存回收多次失败",
            title: "直接内存回收彻底停滞",
            body: "直接内存回收（Direct Reclaim）反复失败，后台 kswapd 进程持续 100% 占用 CPU 却无法腾出连续物理页。",
          },
          {
            id: 1,
            action: "触发 out_of_memory 内核裁决函数",
            title: "触发 out_of_memory() 入口",
            body: "为了避免整机内核崩溃（Kernel Panic），内核正式触发 OOM Killer 机制开始搜寻献祭目标。",
          },
        ],
      },
      {
        id: 3,
        title: "oom_badness 评分",
        beats: [
          {
            id: 0,
            action: "遍历全量进程计算坏度评分",
            title: "oom_badness() 启发式评分",
            body: "得分公式为：占物理内存与 Swap 比例乘以 1000 加上 oom_score_adj 偏置，系统核心守护进程受到特权保护。",
          },
          {
            id: 1,
            action: "锁定最高坏度评分的牺牲进程",
            title: "锁定献祭进程 (PID 4092)",
            body: "进程 'leak_daemon' 独占 14GB 内存，以 842 分高居榜首，被内核选为唯一的击杀对象。",
          },
        ],
      },
      {
        id: 4,
        title: "精准终止回收物理页",
        beats: [
          {
            id: 0,
            action: "下发不可拦截的 SIGKILL 信号",
            title: "向 PID 4092 发送 SIGKILL",
            body: "内核强制下发不可捕获的 SIGKILL 信号终止目标进程，瞬时解构页表并回收 14GB 物理内存。",
          },
        ],
      },
      {
        id: 5,
        title: "系统复苏绿灯",
        beats: [
          {
            id: 0,
            action: "确认系统指标恢复绿色安全水位",
            title: "内核平稳复苏恢复绿灯",
            body: "内存压力彻底归零，kswapd 恢复休眠，核心系统服务在免于重启的前提下平稳度过危机。",
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
          "2->3": "hard-cut",
          "3->4": "push-x",
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
              <div className={styles.terminalHeader}>
                <span className={styles.alertBadge}>
                  {sceneId === 5
                    ? "STATUS: STABLE"
                    : language === "zh"
                      ? "内核警报: 内存耗尽"
                      : "KERNEL ALERT: OOM"}
                </span>
                <span>DMESG // DIAGNOSTIC READOUT</span>
              </div>

              <div
                data-beat-layout-container={
                  sceneId === 2 || sceneId === 3 ? "true" : undefined
                }
                data-beat-layout-mode={
                  sceneId === 2 || sceneId === 3 ? "motion" : undefined
                }
              >
                <h1
                  className={styles.sceneTitle}
                  data-beat-layout-item={
                    sceneId === 2 || sceneId === 3 ? "true" : undefined
                  }
                >
                  {currentBeat.title}
                </h1>
                <p
                  className={styles.sceneBody}
                  data-beat-layout-item={
                    sceneId === 2 || sceneId === 3 ? "true" : undefined
                  }
                >
                  {currentBeat.body}
                </p>

                <table
                  className={styles.processTable}
                  data-beat-layout-item={
                    sceneId === 2 || sceneId === 3 ? "true" : undefined
                  }
                >
                  <thead>
                    <tr>
                      <th>PID</th>
                      <th>COMM</th>
                      <th>ANON-RSS</th>
                      <th>SCORE</th>
                      <th>STATUS</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className={sceneId >= 3 ? styles.targetRow : ""}>
                      <td>4092</td>
                      <td>leak_daemon</td>
                      <td>14.2 GB</td>
                      <td>842</td>
                      <td>{sceneId >= 4 ? "SIGKILL_SENT" : "EVALUATING"}</td>
                    </tr>
                    <tr>
                      <td>1024</td>
                      <td>redis-server</td>
                      <td>2.1 GB</td>
                      <td>120</td>
                      <td>PROTECTED</td>
                    </tr>
                    <tr>
                      <td>1</td>
                      <td>systemd</td>
                      <td>12 MB</td>
                      <td>-1000</td>
                      <td>EXEMPT</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div />
            </div>
          );
        }}
      />
    </div>
  );
}

export default defineTopic({
  id: "linux-oom-killer",
  styleId: "debug-reaction-board",
  title: { en: "Linux OOM Killer", zh: "OOM进程裁决" },
  modelId: "Gemini 3.7 Flash",
  Stage: TopicStage,
  metadata,
  navigation: { mode: "none" },
  transitionScore: {
    "1->2": "push-x",
    "2->3": "hard-cut",
    "3->4": "push-x",
    "4->5": "crossfade",
  },
  evidence: {
    kind: "facts",
    sources: [
      {
        title: "Linux Kernel Documentation: Out of Memory Management",
        url: "https://www.kernel.org/doc/html/latest/mm/oom_killer.html",
        supports:
          "oom_badness scoring algorithm and heuristic kill selection.",
      },
    ],
  },
});

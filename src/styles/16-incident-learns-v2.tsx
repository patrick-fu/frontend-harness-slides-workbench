import { useEffect, type CSSProperties } from "react";
import type { BespokeStyleProps, StyleMetadata } from "../types";
import { useFLIP } from "../hooks/useFLIP";
import SpatialSceneTrack, {
  type BeatLayoutMode,
  type SceneTransitionMap,
} from "./SpatialSceneTrack";
import { defineStyleVersion } from "./version";
import styles from "./16-incident-learns-v2.module.css";

type Language = "en" | "zh";
type Status = "risk" | "watch" | "clear" | "idle";
type VisualMode = "signal" | "trace" | "hypothesis" | "proof" | "monitor";

interface BeatCopy {
  id: number;
  action: Record<Language, string>;
  title: Record<Language, string>;
  body: Record<Language, string>;
}

interface DiagnosticItem {
  id: string;
  beat: number;
  status: Status;
  label: Record<Language, string>;
  detail: Record<Language, string>;
}

interface SceneCopy {
  id: number;
  visual: VisualMode;
  status: Status;
  nav: Record<Language, string>;
  eyebrow: Record<Language, string>;
  title: Record<Language, string>;
  lead: Record<Language, string>;
  metricLabel: Record<Language, string>;
  metricValue: string;
  terminal: Record<Language, string[]>;
  beats: BeatCopy[];
  checks: DiagnosticItem[];
}

const SCENE_IDS = [1, 2, 3, 4, 5];

const TRANSITION_MAP: SceneTransitionMap = {
  "1->2": "glitch",
  "2->1": "glitch",
  "2->3": "slide-x",
  "3->2": "slide-x",
  "3->4": "wipe",
  "4->3": "wipe",
  "4->5": "hard-cut",
  "5->4": "hard-cut",
};

const BEAT_LAYOUT_MODES: Record<number, BeatLayoutMode> = {
  1: "motion",
  2: "motion",
  3: "motion",
  4: "motion",
  5: "motion",
};

const STATUS_LABEL: Record<Status, Record<Language, string>> = {
  risk: { en: "risk", zh: "高危" },
  watch: { en: "watch", zh: "观察" },
  clear: { en: "clear", zh: "通过" },
  idle: { en: "idle", zh: "待定" },
};

const SCENES: SceneCopy[] = [
  {
    id: 1,
    visual: "signal",
    status: "risk",
    nav: { en: "Signal", zh: "信号" },
    eyebrow: { en: "01 / red signal", zh: "01 / 红色信号" },
    title: {
      en: "The alert is treated as evidence.",
      zh: "先把告警当成证据。",
    },
    lead: {
      en: "No one declares root cause from the first red light. The board records what is known, what is exposed, and what must stay reversible.",
      zh: "第一盏红灯不等于根因。看板先记录已知、暴露面，以及必须保持可回滚的边界。",
    },
    metricLabel: { en: "error spike", zh: "错误峰值" },
    metricValue: "8.7x",
    terminal: {
      en: ["alert:error_rate", "scope:checkout-api", "rollback:ready"],
      zh: ["告警:错误率", "范围:结算接口", "回滚:就绪"],
    },
    beats: [
      {
        id: 0,
        action: { en: "Alert enters", zh: "告警进入" },
        title: { en: "Red signal", zh: "红色信号" },
        body: {
          en: "The incident starts as a signal, not a conclusion.",
          zh: "事故先作为信号进入，而不是结论。",
        },
      },
      {
        id: 1,
        action: { en: "Scope is boxed", zh: "圈定范围" },
        title: { en: "Scope before cause", zh: "先范围后根因" },
        body: {
          en: "The exposed path and rollback line become visible.",
          zh: "暴露路径和回滚线被显性标出。",
        },
      },
      {
        id: 2,
        action: { en: "Learning target named", zh: "学习目标命名" },
        title: { en: "The board asks what the system will learn.", zh: "看板开始追问系统要学会什么。" },
        body: {
          en: "Diagnosis is framed as a future guardrail.",
          zh: "诊断被转成未来的护栏。",
        },
      },
    ],
    checks: [
      {
        id: "spike",
        beat: 0,
        status: "risk",
        label: { en: "checkout error spike", zh: "结算错误率飙升" },
        detail: { en: "high-risk signal, no cause assigned", zh: "高危信号，尚未指派根因" },
      },
      {
        id: "scope",
        beat: 1,
        status: "watch",
        label: { en: "affected path boxed", zh: "受影响路径已框定" },
        detail: { en: "API boundary and user action matched", zh: "接口边界与用户动作已匹配" },
      },
      {
        id: "rollback",
        beat: 2,
        status: "clear",
        label: { en: "rollback remains clean", zh: "回滚路径保持干净" },
        detail: { en: "no irreversible mitigation yet", zh: "暂未引入不可逆缓解动作" },
      },
    ],
  },
  {
    id: 2,
    visual: "trace",
    status: "watch",
    nav: { en: "Trace", zh: "链路" },
    eyebrow: { en: "02 / trace", zh: "02 / 链路追踪" },
    title: {
      en: "The trace turns panic into sequence.",
      zh: "链路把慌乱变成顺序。",
    },
    lead: {
      en: "Every hop receives a state. The noisy branch stays marked until timing, payload, and ownership agree.",
      zh: "每一跳都有状态。噪声分支在时间、载荷、归属三者对齐前保持观察。",
    },
    metricLabel: { en: "suspect hops", zh: "可疑节点" },
    metricValue: "04",
    terminal: {
      en: ["trace:start", "edge:cart -> pay", "retry:burst"],
      zh: ["追踪:开始", "边界:购物车 -> 支付", "重试:突增"],
    },
    beats: [
      {
        id: 0,
        action: { en: "Trace opens", zh: "打开链路" },
        title: { en: "Known-good first", zh: "先找已知正常点" },
        body: {
          en: "The trace begins at the last stable handoff.",
          zh: "链路从最后一个稳定交接点开始。",
        },
      },
      {
        id: 1,
        action: { en: "Noisy branch marked", zh: "标记噪声分支" },
        title: { en: "Noise stays labeled", zh: "噪声保持标签" },
        body: {
          en: "Retries are visible, but not yet guilty.",
          zh: "重试可见，但还不是罪证。",
        },
      },
      {
        id: 2,
        action: { en: "Clue stabilizes", zh: "线索稳定" },
        title: { en: "One clue repeats", zh: "一个线索重复出现" },
        body: {
          en: "The same payload gap appears across regions.",
          zh: "同一个载荷缺口跨区域出现。",
        },
      },
    ],
    checks: [
      {
        id: "last-good",
        beat: 0,
        status: "clear",
        label: { en: "last stable handoff", zh: "最后稳定交接点" },
        detail: { en: "cart event arrives intact", zh: "购物车事件完整到达" },
      },
      {
        id: "retry-burst",
        beat: 1,
        status: "watch",
        label: { en: "retry burst repeats", zh: "重试突增重复出现" },
        detail: { en: "correlated, not causal yet", zh: "相关，但尚非因果" },
      },
      {
        id: "payload-gap",
        beat: 2,
        status: "risk",
        label: { en: "payload gap on boundary", zh: "边界处载荷缺口" },
        detail: { en: "same missing field on failed path", zh: "失败路径缺少同一字段" },
      },
    ],
  },
  {
    id: 3,
    visual: "hypothesis",
    status: "watch",
    nav: { en: "Board", zh: "假设" },
    eyebrow: { en: "03 / hypothesis board", zh: "03 / 假设看板" },
    title: {
      en: "Hypotheses compete in public.",
      zh: "假设公开竞争。",
    },
    lead: {
      en: "The board separates likely, testable, and ruled-out explanations so the team can change its mind without losing the trail.",
      zh: "看板把可能、可验证、已排除的解释分开，让团队能改判断而不丢线索。",
    },
    metricLabel: { en: "open tests", zh: "开放验证" },
    metricValue: "03",
    terminal: {
      en: ["hyp:A schema drift", "hyp:B retry loop", "hyp:C cache cold"],
      zh: ["假设A:结构漂移", "假设B:重试循环", "假设C:缓存冷启动"],
    },
    beats: [
      {
        id: 0,
        action: { en: "Candidate causes posted", zh: "贴出候选原因" },
        title: { en: "Candidates before verdict", zh: "先候选再裁决" },
        body: {
          en: "Three explanations are visible at once.",
          zh: "三个解释同时摆上台面。",
        },
      },
      {
        id: 1,
        action: { en: "Tests attach to each claim", zh: "给每个判断挂验证" },
        title: { en: "Every claim needs a test", zh: "每个判断都要有验证" },
        body: {
          en: "Each card gets a falsifiable check.",
          zh: "每张卡都挂上可证伪检查。",
        },
      },
      {
        id: 2,
        action: { en: "Surviving path selected", zh: "选出幸存路径" },
        title: { en: "One path survives", zh: "一条路径幸存" },
        body: {
          en: "Schema drift explains both the trace and the spike.",
          zh: "结构漂移同时解释链路与错误峰值。",
        },
      },
    ],
    checks: [
      {
        id: "schema",
        beat: 0,
        status: "watch",
        label: { en: "schema drift", zh: "结构漂移" },
        detail: { en: "fits missing payload field", zh: "吻合缺失载荷字段" },
      },
      {
        id: "retry",
        beat: 1,
        status: "idle",
        label: { en: "retry loop", zh: "重试循环" },
        detail: { en: "explains load, not field loss", zh: "解释负载，但不解释字段丢失" },
      },
      {
        id: "cache",
        beat: 2,
        status: "clear",
        label: { en: "cache cold start ruled out", zh: "缓存冷启动已排除" },
        detail: { en: "healthy in failed regions", zh: "失败区域表现正常" },
      },
    ],
  },
  {
    id: 4,
    visual: "proof",
    status: "clear",
    nav: { en: "Patch", zh: "补丁" },
    eyebrow: { en: "04 / patch proof", zh: "04 / 补丁证明" },
    title: {
      en: "The patch earns trust before it ships.",
      zh: "补丁先证明自己，再进入线上。",
    },
    lead: {
      en: "The fix is paired with the proof that would have caught the incident. Passing is useful only when rollback stays visible.",
      zh: "修复必须带上本该提前抓住事故的证明。通过有用，但回滚仍要可见。",
    },
    metricLabel: { en: "proof checks", zh: "证明检查" },
    metricValue: "07/07",
    terminal: {
      en: ["patch:normalize_field", "test:contract", "canary:green"],
      zh: ["补丁:字段归一", "测试:契约", "金丝雀:绿色"],
    },
    beats: [
      {
        id: 0,
        action: { en: "Patch diff opens", zh: "打开补丁差异" },
        title: { en: "Small diff, named risk", zh: "小差异，风险具名" },
        body: {
          en: "The change touches only the failing boundary.",
          zh: "改动只触碰失败边界。",
        },
      },
      {
        id: 1,
        action: { en: "Proof suite passes", zh: "证明套件通过" },
        title: { en: "Proof travels with the fix", zh: "证明跟随修复" },
        body: {
          en: "A contract check now guards the field.",
          zh: "契约检查开始守住字段。",
        },
      },
      {
        id: 2,
        action: { en: "Canary confirms", zh: "金丝雀确认" },
        title: { en: "Canary before confidence", zh: "先金丝雀后信心" },
        body: {
          en: "The patch proves itself on the smallest useful slice.",
          zh: "补丁在最小有用流量上证明自己。",
        },
      },
    ],
    checks: [
      {
        id: "diff",
        beat: 0,
        status: "watch",
        label: { en: "boundary-only diff", zh: "仅边界差异" },
        detail: { en: "normalizes optional field", zh: "归一化可选字段" },
      },
      {
        id: "contract",
        beat: 1,
        status: "clear",
        label: { en: "contract proof added", zh: "契约证明已加入" },
        detail: { en: "fixture covers failed payload", zh: "夹具覆盖失败载荷" },
      },
      {
        id: "canary",
        beat: 2,
        status: "clear",
        label: { en: "canary holds", zh: "金丝雀稳定" },
        detail: { en: "no new retry burst", zh: "未出现新重试突增" },
      },
    ],
  },
  {
    id: 5,
    visual: "monitor",
    status: "clear",
    nav: { en: "Monitor", zh: "监控" },
    eyebrow: { en: "05 / monitor", zh: "05 / 监控" },
    title: {
      en: "The monitor keeps the lesson alive.",
      zh: "监控把教训留在系统里。",
    },
    lead: {
      en: "The incident closes only after the new guardrail watches the old failure mode and the runbook records the decision path.",
      zh: "只有新护栏监视旧失败模式，运行手册记录判断路径后，事故才算关闭。",
    },
    metricLabel: { en: "guardrail state", zh: "护栏状态" },
    metricValue: "LIVE",
    terminal: {
      en: ["monitor:field_gap", "slo:stable", "runbook:updated"],
      zh: ["监控:字段缺口", "SLO:稳定", "手册:已更新"],
    },
    beats: [
      {
        id: 0,
        action: { en: "Monitor opens", zh: "监控打开" },
        title: { en: "Old failure gets a gauge", zh: "旧失败模式有了仪表" },
        body: {
          en: "The system watches the exact gap that failed.",
          zh: "系统监视曾经失败的精确缺口。",
        },
      },
      {
        id: 1,
        action: { en: "Confidence accrues", zh: "信心累积" },
        title: { en: "Confidence is accumulated", zh: "信心是累积出来的" },
        body: {
          en: "Healthy intervals matter more than a single green frame.",
          zh: "连续健康区间比单帧绿色更重要。",
        },
      },
      {
        id: 2,
        action: { en: "Runbook learns", zh: "手册学习" },
        title: { en: "The incident becomes a guardrail", zh: "事故变成护栏" },
        body: {
          en: "The next alert starts one step wiser.",
          zh: "下一次告警从更聪明的一步开始。",
        },
      },
    ],
    checks: [
      {
        id: "gauge",
        beat: 0,
        status: "clear",
        label: { en: "field-gap gauge live", zh: "字段缺口仪表上线" },
        detail: { en: "alert threshold mirrors incident", zh: "告警阈值映射本次事故" },
      },
      {
        id: "intervals",
        beat: 1,
        status: "clear",
        label: { en: "healthy intervals logged", zh: "健康区间已记录" },
        detail: { en: "trend stable after canary", zh: "金丝雀后趋势稳定" },
      },
      {
        id: "runbook",
        beat: 2,
        status: "clear",
        label: { en: "runbook stores the path", zh: "手册保存判断路径" },
        detail: { en: "scope, trace, proof, monitor", zh: "范围、链路、证明、监控" },
      },
    ],
  },
];

function useIncidentFonts() {
  useEffect(() => {
    const id = "style-16-incident-learns-v2-fonts";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Noto+Sans+SC:wght@400;500;700&display=swap";
    document.head.appendChild(link);
  }, []);
}

function getScene(sceneId: number): SceneCopy {
  return SCENES.find((candidate) => candidate.id === sceneId) ?? SCENES[0];
}

function clampBeat(sceneData: SceneCopy, beat: number): number {
  return Math.max(0, Math.min(beat, sceneData.beats.length - 1));
}

function getMetadata(lang: Language): StyleMetadata {
  return {
    id: "16",
    band: "balanced-hybrid",
    name: lang === "zh" ? "调试反应板" : "Debug Reaction Board",
    theme: lang === "zh" ? "事故学会了" : "The Incident Learns",
    densityLabel: lang === "zh" ? "高密诊断" : "Dense diagnostic",
    heroScene: 3,
    colors: {
      bg: "#070b0f",
      ink: "#edf7f9",
      panel: "#101820",
    },
    typography: {
      header: "JetBrains Mono 700",
      body: "JetBrains Mono 400",
    },
    tags: ["diagnostic", "developer", "dark", "status", "motion"],
    fonts: ["JetBrains Mono", "cjk:Noto Sans SC"],
    scenes: SCENES.map((sceneData) => ({
      id: sceneData.id,
      title: sceneData.nav[lang],
      beats: sceneData.beats.map((beat) => ({
        id: beat.id,
        action: beat.action[lang],
        title: beat.title[lang],
        body: beat.body[lang],
      })),
    })),
  };
}

function StatusLedNav({
  activeScene,
  language,
  onNavigate,
}: {
  activeScene: number;
  language: Language;
  onNavigate?: (scene: number, beat: number) => void;
}) {
  return (
    <nav className={styles.ledNav} aria-label="Scene status">
      {SCENES.map((sceneData) => {
        const active = sceneData.id === activeScene;
        return (
          <button
            key={sceneData.id}
            type="button"
            className={[
              styles.ledButton,
              active ? styles.ledButtonActive : "",
            ].join(" ")}
            onClick={() => onNavigate?.(sceneData.id, 0)}
            style={statusStyle(sceneData.status)}
            aria-current={active ? "step" : undefined}
          >
            <span className={styles.ledDot} aria-hidden="true" />
            <span className={styles.navIndex}>{String(sceneData.id).padStart(2, "0")}</span>
            <span className={styles.navLabel}>{sceneData.nav[language]}</span>
          </button>
        );
      })}
    </nav>
  );
}

function statusStyle(status: Status): CSSProperties {
  const colors: Record<Status, string> = {
    risk: "#ff4f5f",
    watch: "#ffba4a",
    clear: "#4ee88a",
    idle: "#6c7a86",
  };
  return { "--status-color": colors[status] } as CSSProperties;
}

function ScenePanel({
  sceneId,
  beat,
  language,
  isActive,
  isStatic,
}: {
  sceneId: number;
  beat: number;
  language: Language;
  isActive: boolean;
  isStatic: boolean;
}) {
  const sceneData = getScene(sceneId);
  const safeBeat = clampBeat(sceneData, beat);
  const { ref } = useFLIP<HTMLDivElement>({
    watch: [sceneId, safeBeat],
    selector: '[data-beat-layout-item="true"]',
    disabled: isStatic || !isActive,
    duration: 520,
    easing: "cubic-bezier(0.16, 1, 0.3, 1)",
  });
  const visibleChecks = sceneData.checks.filter((item) => item.beat <= safeBeat);

  return (
    <section className={styles.sceneShell} aria-label={sceneData.nav[language]}>
      <div className={styles.topBar} data-beat-layout-item="true">
        <div>
          <p className={styles.eyebrow}>{sceneData.eyebrow[language]}</p>
          <h1>{sceneData.title[language]}</h1>
        </div>
        <BeatMarkers sceneData={sceneData} beat={safeBeat} language={language} />
      </div>

      <div
        ref={ref}
        className={styles.sceneBody}
        data-beat-layout-container="true"
        data-beat-layout-mode="motion"
      >
        <aside className={styles.diagnosticColumn} data-beat-layout-item="true">
          <div className={styles.metricBlock} style={statusStyle(sceneData.status)}>
            <span>{sceneData.metricLabel[language]}</span>
            <strong>{sceneData.metricValue}</strong>
          </div>
          <p className={styles.lead}>{sceneData.lead[language]}</p>
          <div className={styles.terminalBlock}>
            {sceneData.terminal[language].map((line) => (
              <code key={line}>{line}</code>
            ))}
          </div>
        </aside>

        <main className={styles.reactionBoard} data-beat-layout-item="true">
          <div className={styles.boardHeader}>
            <span>{sceneData.beats[safeBeat].title[language]}</span>
            <span className={styles.statusBadge} style={statusStyle(sceneData.status)}>
              {STATUS_LABEL[sceneData.status][language]}
            </span>
          </div>

          <div className={styles.visualAndChecks}>
            <VisualPanel sceneData={sceneData} beat={safeBeat} language={language} />
            <div className={styles.checkList}>
              {visibleChecks.map((item) => (
                <DiagnosticRow key={item.id} item={item} language={language} />
              ))}
            </div>
          </div>

          <p className={styles.beatBody}>{sceneData.beats[safeBeat].body[language]}</p>
        </main>
      </div>
    </section>
  );
}

function BeatMarkers({
  sceneData,
  beat,
  language,
}: {
  sceneData: SceneCopy;
  beat: number;
  language: Language;
}) {
  return (
    <div className={styles.beatRail} aria-label={language === "zh" ? "节拍标记" : "Beat markers"}>
      {sceneData.beats.map((beatData) => (
        <span
          key={beatData.id}
          className={[
            styles.beatMarker,
            beatData.id <= beat ? styles.beatMarkerLit : "",
          ].join(" ")}
        >
          {beatData.id + 1}
        </span>
      ))}
    </div>
  );
}

function DiagnosticRow({
  item,
  language,
}: {
  item: DiagnosticItem;
  language: Language;
}) {
  return (
    <article
      className={styles.checkRow}
      style={statusStyle(item.status)}
      data-beat-layout-item="true"
    >
      <span className={styles.checkState}>{STATUS_LABEL[item.status][language]}</span>
      <div>
        <h2>{item.label[language]}</h2>
        <p>{item.detail[language]}</p>
      </div>
    </article>
  );
}

function VisualPanel({
  sceneData,
  beat,
  language,
}: {
  sceneData: SceneCopy;
  beat: number;
  language: Language;
}) {
  if (sceneData.visual === "signal") {
    return (
      <div className={`${styles.visualPanel} ${styles.signalPanel}`} data-beat-layout-item="true">
        <span className={styles.signalCore} />
        <span className={styles.signalRing} />
        <div className={styles.signalReadout}>
          <strong>{language === "zh" ? "红色" : "RED"}</strong>
          <span>{beat >= 1 ? sceneData.metricValue : "..."}</span>
        </div>
      </div>
    );
  }

  if (sceneData.visual === "trace") {
    return (
      <div className={`${styles.visualPanel} ${styles.tracePanel}`} data-beat-layout-item="true">
        {[0, 1, 2, 3].map((index) => (
          <span
            key={index}
            className={[
              styles.traceNode,
              index <= beat + 1 ? styles.traceNodeLit : "",
            ].join(" ")}
          />
        ))}
        <div className={styles.traceLine} />
        <p>{beat >= 2 ? (language === "zh" ? "字段缺口重复" : "field gap repeats") : (language === "zh" ? "沿边界检查" : "checking boundary")}</p>
      </div>
    );
  }

  if (sceneData.visual === "hypothesis") {
    const lanes = [
      { key: "likely", label: language === "zh" ? "可能" : "likely", status: "watch" as Status },
      { key: "test", label: language === "zh" ? "验证" : "test", status: "idle" as Status },
      { key: "survive", label: language === "zh" ? "幸存" : "survive", status: "clear" as Status },
    ];
    return (
      <div className={`${styles.visualPanel} ${styles.hypothesisPanel}`} data-beat-layout-item="true">
        {lanes.map((lane, index) => (
          <div key={lane.key} className={styles.hypothesisLane} style={statusStyle(lane.status)}>
            <span>{lane.label}</span>
            <strong>{index <= beat ? "0" + (index + 1) : "--"}</strong>
          </div>
        ))}
      </div>
    );
  }

  if (sceneData.visual === "proof") {
    return (
      <div className={`${styles.visualPanel} ${styles.proofPanel}`} data-beat-layout-item="true">
        <code>- optional field unchecked</code>
        <code>+ normalize boundary field</code>
        {beat >= 1 && <code>+ contract proof fixture</code>}
        {beat >= 2 && <code>+ canary guardrail live</code>}
      </div>
    );
  }

  return (
    <div className={`${styles.visualPanel} ${styles.monitorPanel}`} data-beat-layout-item="true">
      {[42, 58, 46, 62, 54, 67, 72].map((height, index) => (
        <span
          key={height + index}
          className={index <= beat + 3 ? styles.monitorBarLit : ""}
          style={{ "--bar-height": `${height}%` } as CSSProperties}
        />
      ))}
      <p>{beat >= 2 ? (language === "zh" ? "护栏上线" : "guardrail live") : (language === "zh" ? "趋势稳定" : "trend stable")}</p>
    </div>
  );
}

export default function IncidentLearnsV2({
  scene,
  beat,
  language,
  isThumbnail,
  reducedMotion,
  onNavigate,
}: BespokeStyleProps) {
  useIncidentFonts();
  const activeScene = SCENE_IDS.includes(scene) ? scene : 1;
  const isStatic = reducedMotion || isThumbnail;

  return (
    <div
      className={[
        styles.root,
        isThumbnail ? styles.thumbnail : "",
        isStatic ? styles.staticMode : "",
      ].join(" ")}
      data-style-id="16"
      data-version-id="v2"
    >
      <div className={styles.gridBackdrop} aria-hidden="true" />
      {!isThumbnail && (
        <StatusLedNav
          activeScene={activeScene}
          language={language}
          onNavigate={onNavigate}
        />
      )}
      <SpatialSceneTrack
        scene={activeScene}
        beat={beat}
        transitionKind="slide-x"
        transitionMap={TRANSITION_MAP}
        transitionDurationMs={620}
        reducedMotion={isStatic}
        beatLayoutModes={BEAT_LAYOUT_MODES}
        className={styles.track}
        renderScene={(sceneId, sceneBeat, isActive) => (
          <ScenePanel
            sceneId={sceneId}
            beat={sceneBeat}
            language={language}
            isActive={isActive}
            isStatic={isStatic}
          />
        )}
      />
    </div>
  );
}

export { getMetadata };

export const incidentLearnsV2Version = defineStyleVersion({
  id: "v2",
  topic: {
    en: "Learning Incident",
    zh: "学习事故",
  },
  model: "GPT-5.5",
  component: IncidentLearnsV2,
  getMetadata,
});

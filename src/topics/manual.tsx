import React, { useEffect, useState, useCallback } from "react";
import {
  defineTopic,
  type TopicMetadata,
  type TopicStageProps,
  type TopicTransitionScore,
} from "../domain/topic";
import SpatialSceneTrack from "../styles/SpatialSceneTrack";
import styles from "./manual.module.css";
import { useFLIP } from "../hooks/useFLIP";

// ─── Font Injection ────────────────────────────────────────────────────────

function useFonts() {
  useEffect(() => {
    const id = "manual-fonts";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;700&display=swap";
    document.head.appendChild(link);
  }, []);
}

// ─── Content ────────────────────────────────────────────────────────────────

const BOOT_ASCII_EN = String.raw`
 ____  _                     _             _   _ ___
|  _ \| |__   ___  _ __ ___ (_)_ __   __ _| | | |_ _|
| |_) | '_ \ / _ \| '_ \` _ \| | '_ \ / _\` | | | || |
|  __/| | | | (_) | | | | | | | | | | (_| | |_| || |
|_|   |_| |_|\___/|_| |_| |_|_|_| |_|\__,_|\___/|___|
`;

const BOOT_ASCII_ZH = String.raw`
 ____  _                     _             _   _ ___
|  _ \| |__   ___  _ __ ___ (_)_ __   __ _| | | |_ _|
| |_) | '_ \ / _ \| '_ \` _ \| | '_ \ / _\` | | | || |
|  __/| | | | (_) | | | | | | | | | | (_| | |_| || |
|_|   |_| |_|\___/|_| |_| |_|_|_| |_|\__,_|\___/|___|
`;

const SCENES = {
  1: {
    en: {
      ascii: BOOT_ASCII_EN,
      bootLines: [
        { text: "Loading runbook engine v4.2.1...", status: "OK", ok: true },
        { text: "Verifying safety interlocks...", status: "OK", ok: true },
        { text: "Calibrating sensor array...", status: "OK", ok: true },
        { text: "Establishing control bus link...", status: "OK", ok: true },
        { text: "Operator authentication...", status: "OK", ok: true },
      ],
      prompt: "ops@control:~$ _",
    },
    zh: {
      ascii: BOOT_ASCII_ZH,
      bootLines: [
        { text: "正在加载操作手册引擎 v4.2.1...", status: "OK", ok: true },
        { text: "正在验证安全联锁...", status: "OK", ok: true },
        { text: "正在校准传感器阵列...", status: "OK", ok: true },
        { text: "正在建立控制总线连接...", status: "OK", ok: true },
        { text: "操作员身份验证...", status: "OK", ok: true },
      ],
      prompt: "ops@control:~$ _",
    },
  },
  2: {
    en: {
      title: "opsrun — ops manual — 120x36",
      lines: [
        { type: "cmd", text: "opsrun status --system" },
        { type: "out", text: "Querying subsystem status...", cls: "dim" },
        { type: "out", text: "[OK] Primary coolant loop: nominal", cls: "success" },
        { type: "out", text: "[OK] Power bus A: 480V / 60Hz", cls: "success" },
        { type: "out", text: "[OK] Ventilation: 94% efficiency", cls: "success" },
        { type: "out", text: "[WARN] Filter bank B: 78% capacity", cls: "warning" },
        { type: "out", text: "[INFO] 2 scheduled maintenance tasks pending", cls: "info" },
        { type: "blank" },
        { type: "cmd", text: "opsrun execute --procedure=shutdown" },
        { type: "out", text: "Executing controlled shutdown sequence...", cls: "dim" },
        { type: "out", text: "  -> Phase 1: Load shedding...", cls: "info" },
        { type: "out", text: "  -> Phase 2: Coolant ramp-down...", cls: "info" },
        { type: "out", text: "  -> Phase 3: System isolation...", cls: "info" },
        { type: "out", text: "[COMPLETE] Shutdown procedure finished safely.", cls: "success" },
      ],
    },
    zh: {
      title: "opsrun — 操作手册 — 120x36",
      lines: [
        { type: "cmd", text: "opsrun status --system" },
        { type: "out", text: "正在查询子系统状态...", cls: "dim" },
        { type: "out", text: "[OK] 主冷却回路：正常", cls: "success" },
        { type: "out", text: "[OK] 电源总线 A：480V / 60Hz", cls: "success" },
        { type: "out", text: "[OK] 通风系统：94% 效率", cls: "success" },
        { type: "out", text: "[WARN] 过滤组 B：78% 容量", cls: "warning" },
        { type: "out", text: "[INFO] 2 项计划维护任务待处理", cls: "info" },
        { type: "blank" },
        { type: "cmd", text: "opsrun execute --procedure=shutdown" },
        { type: "out", text: "正在执行受控停机程序...", cls: "dim" },
        { type: "out", text: "  -> 阶段 1：负载卸载...", cls: "info" },
        { type: "out", text: "  -> 阶段 2：冷却剂降速...", cls: "info" },
        { type: "out", text: "  -> 阶段 3：系统隔离...", cls: "info" },
        { type: "out", text: "[完成] 停机程序已安全结束。", cls: "success" },
      ],
    },
  },
  3: {
    en: {
      title: "opsrun help — procedure manual",
      header: "OPSRUN(1)              Operating Manual              OPSRUN(1)",
      sections: [
        {
          title: "NAME",
          items: [{ flag: "", desc: "opsrun — industrial operations runbook executor" }],
        },
        {
          title: "SYNOPSIS",
          items: [{ flag: "", desc: "opsrun <command> [--procedure=NAME] [--force]" }],
        },
        {
          title: "COMMANDS",
          items: [
            { flag: "status", desc: "Report all subsystem health indicators" },
            { flag: "execute", desc: "Run a named procedure from the runbook" },
            { flag: "abort", desc: "Emergency halt — requires supervisor override" },
            { flag: "calibrate", desc: "Recalibrate sensor array (offline only)" },
            { flag: "logs", desc: "Stream audit trail with severity filtering" },
            { flag: "checklist", desc: "Display pre-operation verification steps" },
            { flag: "handover", desc: "Transfer control to next shift operator" },
          ],
        },
        {
          title: "SAFETY",
          items: [
            { flag: "--lockout", desc: "Apply LOTO before maintenance procedure" },
            { flag: "--verify", desc: "Require two-person confirmation on critical ops" },
            { flag: "--dry-run", desc: "Simulate procedure without hardware changes" },
            { flag: "--help, -h", desc: "Display this manual page" },
          ],
        },
      ],
    },
    zh: {
      title: "opsrun 帮助 — 操作手册",
      header: "OPSRUN(1)                操作手册                OPSRUN(1)",
      sections: [
        {
          title: "名称",
          items: [{ flag: "", desc: "opsrun — 工业操作运行手册执行器" }],
        },
        {
          title: "概要",
          items: [{ flag: "", desc: "opsrun <命令> [--procedure=名称] [--force]" }],
        },
        {
          title: "命令",
          items: [
            { flag: "status", desc: "报告所有子系统健康指标" },
            { flag: "execute", desc: "运行手册中指定的程序" },
            { flag: "abort", desc: "紧急停止——需主管授权" },
            { flag: "calibrate", desc: "重新校准传感器阵列（仅限离线）" },
            { flag: "logs", desc: "按严重程度过滤审计日志" },
            { flag: "checklist", desc: "显示操作前验证步骤" },
            { flag: "handover", desc: "将控制权移交下一班操作员" },
          ],
        },
        {
          title: "安全",
          items: [
            { flag: "--lockout", desc: "维护程序前应用 LOTO 锁定" },
            { flag: "--verify", desc: "关键操作需双人确认" },
            { flag: "--dry-run", desc: "模拟程序不改变硬件状态" },
            { flag: "--help, -h", desc: "显示此手册页面" },
          ],
        },
      ],
    },
  },
  4: {
    en: {
      header: "Executing: Startup Sequence 7-B...",
      sub: "Verifying prerequisites before ignition",
      progress: 73,
      logs: [
        { time: "14:32:01", msg: "Pre-operation checklist: PASS" },
        { time: "14:32:02", msg: "Safety interlocks: ENGAGED" },
        { time: "14:32:03", msg: "Coolant pressure: 2.4 bar (nominal)" },
        { time: "14:32:04", msg: "Fuel line purge: COMPLETE" },
        { time: "14:32:05", msg: "Ignition system: ARMED" },
        { time: "14:32:06", msg: "Ramp-up phase 1 of 3..." },
        { time: "14:32:07", msg: "Temperature gradient: NOMINAL" },
        { time: "14:32:08", msg: "All subsystems reporting GREEN" },
      ],
    },
    zh: {
      header: "正在执行：启动程序 7-B...",
      sub: "点火前验证前提条件",
      progress: 73,
      logs: [
        { time: "14:32:01", msg: "操作前检查清单：通过" },
        { time: "14:32:02", msg: "安全联锁装置：已接合" },
        { time: "14:32:03", msg: "冷却剂压力：2.4 bar（正常）" },
        { time: "14:32:04", msg: "燃料管路吹扫：完成" },
        { time: "14:32:05", msg: "点火系统：待命中" },
        { time: "14:32:06", msg: "加速阶段 1 / 3..." },
        { time: "14:32:07", msg: "温度梯度：正常" },
        { time: "14:32:08", msg: "所有子系统报告正常" },
      ],
    },
  },
  5: {
    en: {
      title: "OPERATIONS SUMMARY",
      subtitle: "Shift complete — all procedures within tolerance",
      info: [
        { label: "Procedures Run", value: "12" },
        { label: "Shift Duration", value: "08:42:00" },
        { label: "Alarms Resolved", value: "3" },
        { label: "Checklists", value: "24" },
        { label: "Avg Response", value: "2.1s" },
        { label: "Safety Events", value: "0" },
        { label: "Handover", value: "Complete" },
        { label: "Next Review", value: "06:00" },
      ],
      goodbye: "System standby. Log out when ready.",
    },
    zh: {
      title: "操作摘要",
      subtitle: "班次结束——所有程序在容差范围内",
      info: [
        { label: "执行程序", value: "12" },
        { label: "班次时长", value: "08:42:00" },
        { label: "已解警报", value: "3" },
        { label: "检查清单", value: "24" },
        { label: "平均响应", value: "2.1秒" },
        { label: "安全事件", value: "0" },
        { label: "交接状态", value: "完成" },
        { label: "下次审查", value: "06:00" },
      ],
      goodbye: "系统待机。准备好后请注销。",
    },
  },
};

// ─── Metadata ───────────────────────────────────────────────────────────────

function buildMetadata(lang: "en" | "zh"): TopicMetadata {
  const themeMap = {
    en: "Runbook & Procedure Guides — industrial terminal aesthetic with monospace throughout, warning-amber accent and crisp sequential output",
    zh: "运行手册与程序指南——工业终端美学，全程等宽字体，警示琥珀色点缀，清晰顺序输出",
  };
  const densityLabelMap = { en: "Procedure-Dense", zh: "流程密集" };

  const sceneTitles = {
    en: ["Boot", "Status Check", "Manual", "Procedure", "Summary"],
    zh: ["启动", "状态检查", "操作手册", "执行程序", "摘要"],
  };

  const beatActions = {
    en: {
      1: ["System boot sequence"],
      2: ["Status command outputs", "Shutdown procedure executes"],
      3: ["Manual page renders", "Commands section", "Safety section"],
      4: ["Progress animates", "Audit log streams"],
      5: ["Operations summary reveals"],
    },
    zh: {
      1: ["系统启动序列"],
      2: ["状态命令输出", "停机程序执行"],
      3: ["手册页面渲染", "命令章节", "安全章节"],
      4: ["进度动画", "审计日志流"],
      5: ["操作摘要揭示"],
    },
  };

  const BEAT_COUNTS: Record<number, number> = {
    1: 1,
    2: 2,
    3: 3,
    4: 2,
    5: 1,
  };

  const scenes = [1, 2, 3, 4, 5].map((id) => {
    const beatCount = BEAT_COUNTS[id];
    const actions = beatActions[lang][id as keyof (typeof beatActions)["en"]];
    const c = SCENES[id as keyof typeof SCENES][lang];

    const beats = Array.from({ length: beatCount }, (_, beatIdx) => {
      let beatTitle = "";
      let beatBody = "";

      if (id === 1) {
        beatTitle = "Boot Sequence";
        beatBody = "Runbook engine initialized";
      } else if (id === 2) {
        const c2 = c as unknown as { lines: Array<{ text: string }> };
        beatTitle = "opsrun status";
        if (beatIdx >= 1) {
          beatTitle = "opsrun execute";
          beatBody = c2.lines.slice(-4).map((l) => l.text).join(" / ");
        } else {
          beatBody = c2.lines.slice(0, 7).map((l) => l.text).join(" / ");
        }
      } else if (id === 3) {
        const c3 = c as unknown as { header: string; sections: Array<{ title: string; items: Array<{ flag: string; desc: string }> }> };
        beatTitle = c3.header;
        const visibleSections = c3.sections.slice(0, beatIdx + 1);
        beatBody = visibleSections.map((s) => `${s.title}: ${s.items.slice(0, 2).map((i) => i.flag || i.desc).join(", ")}`).join(" / ");
      } else if (id === 4) {
        const c4 = c as unknown as { header: string; progress: number };
        beatTitle = c4.header;
        beatBody = beatIdx >= 1 ? `Progress: ${c4.progress}% — all systems nominal` : `Progress: ${c4.progress}%`;
      } else if (id === 5) {
        const c5 = c as unknown as { title: string; subtitle: string; goodbye: string };
        beatTitle = c5.title;
        beatBody = `${c5.subtitle} — ${c5.goodbye}`;
      }

      return {
        id: beatIdx,
        action: actions[beatIdx],
        title: beatTitle,
        body: beatBody,
      };
    });

    return {
      id,
      title: sceneTitles[lang][id - 1],
      beats,
    };
  });

  return {
    theme: themeMap[lang],
    densityLabel: densityLabelMap[lang],
    heroScene: 3,
    colors: {
      bg: "#0d0d0d",
      ink: "#e8e8e8",
      panel: "#1a1a1a",
    },
    typography: {
      header: "JetBrains Mono 700",
      body: "JetBrains Mono 400",
    },
    tags: [
      "runbook",
      "terminal",
      "monospace",
      "industrial",
      "procedure",
      "warning",
      "amber",
      "ops",
      "manual",
      "sequential",
    ],
    fonts: ["JetBrains Mono"],
    scenes,
  };
}

const TRANSITION_SCORE = {
  "1->2": "hard-cut",
  "2->3": "hard-cut",
  "3->4": "hard-cut",
  "4->5": "hard-cut",
} as const satisfies TopicTransitionScore;

const NAVIGATION = {
  geometry: "typographic-index",
  carrier: "terminal-function-index",
  invocation: "persistent",
  feedback: "typographic-emphasis",
} as const;

const EVIDENCE = {
  kind: "illustrative",
  boundary: {
    en: "Illustrative terminal scenario: commands, system readings, procedures, and outcomes are presentation examples, not operational instructions or external factual claims.",
    zh: "示例终端场景：命令、系统读数、流程和结果均为演示内容，不构成操作指令或外部事实主张。",
  },
  display: "stage",
} as const;

// ─── Component ──────────────────────────────────────────────────────────────

const BEAT_LAYOUT_MODES = {
  2: "motion",
  3: "motion",
  4: "motion",
} satisfies Record<number, "motion" | "reserved">;

function TopicStage({
  scene,
  beat,
  language,
  isThumbnail,
  reducedMotion,
  onNavigate,
}: TopicStageProps) {
  useFonts();

  const [entered, setEntered] = useState(false);

  // Beat-level entered state — controls reveal animations
  useEffect(() => {
    if (reducedMotion) {
      setEntered(true);
      return;
    }
    setEntered(false);
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setEntered(true);
      });
    });
    return () => cancelAnimationFrame(id);
  }, [scene, reducedMotion]);

  // FLIP for terminal output area (scene 2) — new lines push old ones up
  const { ref: terminalOutputRef } = useFLIP<HTMLDivElement>({
    watch: [beat],
    duration: 300,
    easing: "cubic-bezier(0.16, 1, 0.3, 1)",
  });

  const handleNavClick = useCallback(
    (e: React.MouseEvent, targetScene: number) => {
      e.stopPropagation();
      onNavigate?.(targetScene, 0);
    },
    [onNavigate],
  );

  const rootClasses = [
    styles.root,
    reducedMotion ? styles.reducedMotion : "",
  ]
    .filter(Boolean)
    .join(" ");

  // ── Scene 1: Boot ───────────────────────────────────────────────────────

  const renderScene1 = (isEntered: boolean) => {
    const c = SCENES[1][language];
    return (
      <div className={styles.bootScene}>
        <pre
          className={styles.bootAscii}
          style={{
            opacity: isEntered ? 1 : 0,
            transition: reducedMotion ? "none" : "opacity 0.3s steps(6)",
          }}
        >
          {c.ascii}
        </pre>
        {c.bootLines.map((line, i) => (
          <div
            key={i}
            className={styles.bootLine}
            style={{
              opacity: isEntered ? 1 : 0,
              transition: reducedMotion
                ? "none"
                : `opacity 0.05s steps(1) ${0.3 + i * 0.08}s`,
            }}
          >
            <span style={{ color: "var(--manual-dim)" }}>{line.text}</span>
            <span style={{ marginLeft: "auto" }}>
              <span className={line.ok ? styles.bootStatus : styles.bootStatusErr}>
                [{line.status}]
              </span>
            </span>
          </div>
        ))}
        <div
          className={styles.bootPrompt}
          style={{
            opacity: isEntered ? 1 : 0,
            transition: reducedMotion
              ? "none"
              : `opacity 0.1s steps(2) ${0.3 + c.bootLines.length * 0.08}s`,
          }}
        >
          {c.prompt}
          <span className={styles.blinkCursor} />
        </div>
      </div>
    );
  };

  // ── Scene 2: Commands ───────────────────────────────────────────────────

  const renderScene2 = (isEntered: boolean, beatNum: number, isCurrent: boolean) => {
    const c = SCENES[2][language];
    const lines = c.lines as Array<{ type: string; text: string; cls?: string }>;
    const secondCmdIdx = lines.findIndex((l, i) => i > 0 && l.type === "cmd");
    return (
      <div className={styles.terminalWindow}>
        <div className={styles.terminalTitlebar}>
          <div className={styles.terminalDots}>
            <div className={`${styles.terminalDot} ${styles.terminalDotRed}`} />
            <div className={`${styles.terminalDot} ${styles.terminalDotYellow}`} />
            <div className={`${styles.terminalDot} ${styles.terminalDotGreen}`} />
          </div>
          <span className={styles.terminalTitle}>{c.title}</span>
          <span style={{ width: "6cqw" }} />
        </div>
        <div
          ref={isCurrent ? terminalOutputRef : undefined}
          className={styles.cmdBody}
        >
          {lines.map((line, i) => {
            const visible = isEntered && (beatNum >= 1 || secondCmdIdx === -1 || i < secondCmdIdx);
            if (line.type === "blank") {
              return (
                <div
                  key={i}
                  style={{
                    height: "1.5cqh",
                    opacity: visible ? 1 : 0,
                    transition: reducedMotion ? "none" : `opacity 0.05s steps(1) ${i * 0.06}s`,
                  }}
                />
              );
            }
            if (line.type === "cmd") {
              return (
                <div
                  key={i}
                  className={styles.terminalLine}
                  style={{
                    animationDelay: reducedMotion ? "0s" : `${i * 0.06}s`,
                    opacity: visible ? 1 : 0,
                    transition: reducedMotion ? "none" : "opacity 0.15s steps(3)",
                  }}
                >
                  <span className={styles.terminalPrompt}>$</span>
                  <span className={styles.terminalCommand}>{line.text}</span>
                  {i === lines.length - 1 && (
                    <span className={styles.blinkCursor} />
                  )}
                </div>
              );
            }
            const clsMap: Record<string, string> = {
              success: styles.terminalOutputSuccess,
              error: styles.terminalOutputError,
              warning: styles.terminalOutputWarning,
              info: styles.terminalOutputInfo,
              dim: styles.terminalOutputDim,
            };
            const outputCls = line.cls ? clsMap[line.cls] : styles.terminalOutput;
            return (
              <div
                key={i}
                className={styles.terminalLine}
                style={{
                  animationDelay: reducedMotion ? "0s" : `${i * 0.06}s`,
                  opacity: visible ? 1 : 0,
                  transition: reducedMotion ? "none" : "opacity 0.15s steps(3)",
                  paddingLeft: "2cqw",
                }}
              >
                <span className={outputCls}>{line.text}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // ── Scene 3: Help / Man Page ────────────────────────────────────────────

  const renderScene3 = (isEntered: boolean, beatNum: number) => {
    const c = SCENES[3][language];
    return (
      <div className={styles.helpScene}>
        <div className={styles.terminalTitlebar}>
          <div className={styles.terminalDots}>
            <div className={`${styles.terminalDot} ${styles.terminalDotRed}`} />
            <div className={`${styles.terminalDot} ${styles.terminalDotYellow}`} />
            <div className={`${styles.terminalDot} ${styles.terminalDotGreen}`} />
          </div>
          <span className={styles.terminalTitle}>{c.title}</span>
          <span style={{ width: "6cqw" }} />
        </div>
        <div className={styles.helpBody}>
          <div
            className={styles.helpHeader}
            style={{
              opacity: isEntered ? 1 : 0,
              transition: reducedMotion ? "none" : "opacity 0.2s steps(4)",
            }}
          >
            {c.header}
          </div>
          {c.sections.map((section, si) => {
            const visible = isEntered && si <= beatNum + 1;
            return (
              <div
                key={si}
                className={styles.helpSection}
                style={{
                  opacity: visible ? 1 : 0,
                  transform: visible ? "translateX(0)" : "translateX(-1cqw)",
                  transition: reducedMotion
                    ? "none"
                    : `opacity 0.2s steps(4) ${si * 0.15}s, transform 0.2s steps(4) ${si * 0.15}s`,
                }}
              >
                <div className={styles.helpSectionTitle}>{section.title}</div>
                {section.items.map((item, ii) => (
                  <div key={ii} className={styles.helpItem}>
                    {item.flag && (
                      <span className={styles.helpFlag}>{item.flag}</span>
                    )}
                    <span className={styles.helpDesc}>{item.desc}</span>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // ── Scene 4: Progress / Install ─────────────────────────────────────────

  const renderScene4 = (isEntered: boolean, beatNum: number) => {
    const c = SCENES[4][language];
    const progress = isEntered ? c.progress : 0;
    return (
      <div className={styles.progressScene}>
        <div
          className={styles.progressHeader}
          style={{
            opacity: isEntered ? 1 : 0,
            transition: reducedMotion ? "none" : "opacity 0.3s steps(6)",
          }}
        >
          {c.header}
          <span className={styles.blinkCursor} />
        </div>
        <div
          className={styles.progressSub}
          style={{
            opacity: isEntered ? 1 : 0,
            transition: reducedMotion ? "none" : "opacity 0.3s steps(6) 0.1s",
          }}
        >
          {c.sub}
        </div>
        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{
              width: `${progress}%`,
              transition: reducedMotion ? "none" : "width 1s steps(20)",
            }}
          />
          <span className={styles.progressLabel}>{progress}%</span>
        </div>
        {beatNum >= 1 && (
          <div
            className={styles.progressLog}
            style={{
              opacity: isEntered ? 1 : 0,
              transition: reducedMotion ? "none" : "opacity 0.3s steps(6) 0.2s",
            }}
          >
            {c.logs.map((log, i) => (
              <div key={i} className={styles.progressLogLine}>
                <span className={styles.progressLogTime}>[{log.time}]</span>
                <span className={styles.progressLogMsg}>{log.msg}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  // ── Scene 5: System Info / Summary ──────────────────────────────────────

  const renderScene5 = (isEntered: boolean) => {
    const c = SCENES[5][language];
    return (
      <div className={styles.infoScene}>
        <div
          className={styles.infoAsciiBox}
          style={{
            opacity: isEntered ? 1 : 0,
            transform: isEntered ? "scale(1)" : "scale(0.97)",
            transition: reducedMotion
              ? "none"
              : "opacity 0.3s steps(6), transform 0.3s steps(6)",
          }}
        >
          <h2 className={styles.infoTitle}>{c.title}</h2>
          <p className={styles.infoSubtitle}>{c.subtitle}</p>
          <div className={styles.infoGrid}>
            {c.info.map((item, i) => (
              <div
                key={i}
                className={styles.infoItem}
                style={{
                  opacity: isEntered ? 1 : 0,
                  transition: reducedMotion
                    ? "none"
                    : `opacity 0.15s steps(3) ${0.2 + i * 0.05}s`,
                }}
              >
                <span className={styles.infoLabel}>{item.label}</span>
                <span className={styles.infoValue}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>
        <div
          className={styles.infoGoodbye}
          style={{
            opacity: isEntered ? 1 : 0,
            transition: reducedMotion ? "none" : "opacity 0.3s steps(6) 0.6s",
          }}
        >
          {c.goodbye} <span className={styles.blinkCursor} />
        </div>
      </div>
    );
  };

  // ── Render scene content for a given scene number ────────────────────────

  const renderSceneFor = (sceneNum: number, beatNum: number, isEntered: boolean, isCurrent: boolean) => {
    switch (sceneNum) {
      case 1:
        return renderScene1(isEntered);
      case 2:
        return renderScene2(isEntered, beatNum, isCurrent);
      case 3:
        return renderScene3(isEntered, beatNum);
      case 4:
        return renderScene4(isEntered, beatNum);
      case 5:
        return renderScene5(isEntered);
      default:
        return null;
    }
  };

  // ── Navigation Indicators ───────────────────────────────────────────────

  const renderNavIndicators = () => {
    if (isThumbnail) return null;
    return (
      <div
        className={styles.navIndicators}
        aria-label="Scene navigation"
        data-topic-navigation="true"
        data-navigation-geometry={NAVIGATION.geometry}
        data-navigation-carrier={NAVIGATION.carrier}
        data-navigation-invocation={NAVIGATION.invocation}
        data-navigation-feedback={NAVIGATION.feedback}
      >
        {[1, 2, 3, 4, 5].map((s) => {
          const isActive = s === scene;
          return (
            <button
              key={s}
              type="button"
              className={`${styles.navIndicator} ${isActive ? styles.navIndicatorActive : ""}`}
              aria-label={`Jump to scene ${s}`}
              onClick={(e) => handleNavClick(e, s)}
            >
              F{s}
            </button>
          );
        })}
      </div>
    );
  };

  // ── Build layer classes ─────────────────────────────────────────────────

  return (
    <div className={rootClasses}>
            <SpatialSceneTrack
        scene={scene}
        beat={beat}
        transitionKind="hard-cut"
        reducedMotion={reducedMotion || isThumbnail}
        beatLayoutModes={BEAT_LAYOUT_MODES}
        renderScene={(sceneId, sceneBeat, isActive) => (
          <div className={styles.sceneLayer}>
            {renderSceneFor(sceneId, sceneBeat, isActive ? entered : true, isActive)}
          </div>
        )}
      />

      {renderNavIndicators()}
    </div>
  );
}

const METADATA = {
  en: buildMetadata("en"),
  zh: buildMetadata("zh"),
} satisfies { en: TopicMetadata; zh: TopicMetadata };

export default defineTopic({
  id: "manual",
  styleId: "operating-manual",
  title: { en: "Runbook Manual", zh: "运行手册" },
  modelId: "Doubao-Seed-Evolving",
  Stage: TopicStage,
  metadata: METADATA,
  navigation: NAVIGATION,
  transitionScore: TRANSITION_SCORE,
  evidence: EVIDENCE,
});

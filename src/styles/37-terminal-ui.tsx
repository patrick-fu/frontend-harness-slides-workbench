import React, { useLayoutEffect, useEffect, useState, useCallback, useRef } from "react";
import type { BespokeStyleProps, StyleMetadata } from "../types";
import styles from "./37-terminal-ui.module.css";
import { useFLIP } from "../hooks/useFLIP";

// ─── Font Injection ────────────────────────────────────────────────────────

function useFonts() {
  useEffect(() => {
    const id = "style-37-fonts";
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
        { text: "Initializing kernel modules...", status: "OK", ok: true },
        { text: "Mounting /dev/sda1 on /", status: "OK", ok: true },
        { text: "Starting network daemon", status: "OK", ok: true },
        { text: "Loading CLI toolkit v3.14.2", status: "OK", ok: true },
        { text: "Checking filesystem integrity", status: "OK", ok: true },
      ],
      prompt: "user@devcli:~$ _",
    },
    zh: {
      ascii: BOOT_ASCII_ZH,
      bootLines: [
        { text: "正在初始化内核模块...", status: "OK", ok: true },
        { text: "挂载 /dev/sda1 到 /", status: "OK", ok: true },
        { text: "启动网络守护进程", status: "OK", ok: true },
        { text: "加载 CLI 工具包 v3.14.2", status: "OK", ok: true },
        { text: "检查文件系统完整性", status: "OK", ok: true },
      ],
      prompt: "user@devcli:~$ _",
    },
  },
  2: {
    en: {
      title: "devcli — bash — 120x36",
      lines: [
        { type: "cmd", text: "devcli status" },
        { type: "out", text: "Checking system status...", cls: "dim" },
        { type: "out", text: "[OK] API server running on :8080", cls: "success" },
        { type: "out", text: "[OK] Database connected (12ms)", cls: "success" },
        { type: "out", text: "[OK] Redis cache hit rate: 94.2%", cls: "success" },
        { type: "out", text: "[WARN] Disk usage at 78%", cls: "warning" },
        { type: "out", text: "[INFO] 3 background jobs active", cls: "info" },
        { type: "blank" },
        { type: "cmd", text: "devcli deploy --env=production" },
        { type: "out", text: "Deploying to production cluster...", cls: "dim" },
        { type: "out", text: "  -> Building Docker image...", cls: "info" },
        { type: "out", text: "  -> Pushing to registry: devcli/app:v2.14", cls: "info" },
        { type: "out", text: "  -> Rolling update (3 replicas)...", cls: "info" },
        { type: "out", text: "[SUCCESS] Deployment complete. v2.14.0 live.", cls: "success" },
      ],
    },
    zh: {
      title: "devcli — bash — 120x36",
      lines: [
        { type: "cmd", text: "devcli status" },
        { type: "out", text: "正在检查系统状态...", cls: "dim" },
        { type: "out", text: "[OK] API 服务器运行于 :8080", cls: "success" },
        { type: "out", text: "[OK] 数据库已连接 (12ms)", cls: "success" },
        { type: "out", text: "[OK] Redis 缓存命中率: 94.2%", cls: "success" },
        { type: "out", text: "[WARN] 磁盘使用率 78%", cls: "warning" },
        { type: "out", text: "[INFO] 3 个后台任务运行中", cls: "info" },
        { type: "blank" },
        { type: "cmd", text: "devcli deploy --env=production" },
        { type: "out", text: "正在部署到生产集群...", cls: "dim" },
        { type: "out", text: "  -> 构建 Docker 镜像...", cls: "info" },
        { type: "out", text: "  -> 推送到仓库: devcli/app:v2.14", cls: "info" },
        { type: "out", text: "  -> 滚动更新 (3 副本)...", cls: "info" },
        { type: "out", text: "[成功] 部署完成。v2.14.0 已上线。", cls: "success" },
      ],
    },
  },
  3: {
    en: {
      title: "devcli help — man page",
      header: "DEVCLI(1)                    User Manual                    DEVCLI(1)",
      sections: [
        {
          title: "NAME",
          items: [{ flag: "", desc: "devcli — the command-line developer toolkit" }],
        },
        {
          title: "SYNOPSIS",
          items: [{ flag: "", desc: "devcli <command> [options] [args...]" }],
        },
        {
          title: "COMMANDS",
          items: [
            { flag: "init", desc: "Initialize a new project workspace" },
            { flag: "dev", desc: "Start development server with hot reload" },
            { flag: "build", desc: "Compile and bundle for production" },
            { flag: "test", desc: "Run test suite with coverage report" },
            { flag: "deploy", desc: "Deploy to specified environment" },
            { flag: "status", desc: "Show system and service status" },
            { flag: "logs", desc: "Stream real-time application logs" },
          ],
        },
        {
          title: "OPTIONS",
          items: [
            { flag: "--env, -e", desc: "Target environment (dev/staging/prod)" },
            { flag: "--verbose, -v", desc: "Enable verbose output" },
            { flag: "--json, -j", desc: "Output in JSON format" },
            { flag: "--help, -h", desc: "Show this help message" },
          ],
        },
      ],
    },
    zh: {
      title: "devcli 帮助 — 手册页",
      header: "DEVCLI(1)                   用户手册                    DEVCLI(1)",
      sections: [
        {
          title: "名称",
          items: [{ flag: "", desc: "devcli — 命令行开发者工具包" }],
        },
        {
          title: "概要",
          items: [{ flag: "", desc: "devcli <命令> [选项] [参数...]" }],
        },
        {
          title: "命令",
          items: [
            { flag: "init", desc: "初始化新的项目工作区" },
            { flag: "dev", desc: "启动带热重载的开发服务器" },
            { flag: "build", desc: "编译并打包用于生产" },
            { flag: "test", desc: "运行测试套件并生成覆盖率报告" },
            { flag: "deploy", desc: "部署到指定环境" },
            { flag: "status", desc: "显示系统和服务状态" },
            { flag: "logs", desc: "流式传输实时应用日志" },
          ],
        },
        {
          title: "选项",
          items: [
            { flag: "--env, -e", desc: "目标环境 (dev/staging/prod)" },
            { flag: "--verbose, -v", desc: "启用详细输出" },
            { flag: "--json, -j", desc: "以 JSON 格式输出" },
            { flag: "--help, -h", desc: "显示此帮助信息" },
          ],
        },
      ],
    },
  },
  4: {
    en: {
      header: "Installing dependencies...",
      sub: "Resolving packages from npm registry",
      progress: 73,
      logs: [
        { time: "14:32:01", msg: "Resolving dependency tree..." },
        { time: "14:32:02", msg: "Found 248 packages to install" },
        { time: "14:32:03", msg: "Downloading react@18.3.1" },
        { time: "14:32:04", msg: "Downloading typescript@5.4.2" },
        { time: "14:32:05", msg: "Downloading vite@5.2.0" },
        { time: "14:32:06", msg: "Linking packages..." },
        { time: "14:32:07", msg: "Building native modules..." },
        { time: "14:32:08", msg: "Post-install scripts running..." },
      ],
    },
    zh: {
      header: "正在安装依赖...",
      sub: "从 npm 仓库解析软件包",
      progress: 73,
      logs: [
        { time: "14:32:01", msg: "正在解析依赖树..." },
        { time: "14:32:02", msg: "发现 248 个待安装包" },
        { time: "14:32:03", msg: "下载 react@18.3.1" },
        { time: "14:32:04", msg: "下载 typescript@5.4.2" },
        { time: "14:32:05", msg: "下载 vite@5.2.0" },
        { time: "14:32:06", msg: "正在链接软件包..." },
        { time: "14:32:07", msg: "正在构建原生模块..." },
        { time: "14:32:08", msg: "正在运行安装后脚本..." },
      ],
    },
  },
  5: {
    en: {
      title: "SYSTEM SUMMARY",
      subtitle: "Session complete — all operations successful",
      info: [
        { label: "Commands Executed", value: "47" },
        { label: "Uptime", value: "02:34:17" },
        { label: "Memory Used", value: "1.2 GB" },
        { label: "Packages", value: "248" },
        { label: "Build Time", value: "3.4s" },
        { label: "Test Coverage", value: "94.2%" },
        { label: "Deployments", value: "3" },
        { label: "Errors", value: "0" },
      ],
      goodbye: "Goodbye. See you in the terminal.",
    },
    zh: {
      title: "系统摘要",
      subtitle: "会话结束——所有操作成功",
      info: [
        { label: "执行命令数", value: "47" },
        { label: "运行时长", value: "02:34:17" },
        { label: "内存使用", value: "1.2 GB" },
        { label: "软件包", value: "248" },
        { label: "构建时间", value: "3.4秒" },
        { label: "测试覆盖率", value: "94.2%" },
        { label: "部署次数", value: "3" },
        { label: "错误数", value: "0" },
      ],
      goodbye: "再见。终端见。",
    },
  },
};

// ─── Metadata ───────────────────────────────────────────────────────────────

export function getMetadata(lang: "en" | "zh"): StyleMetadata {
  const nameMap = { en: "Terminal UI", zh: "终端界面" };
  const themeMap = {
    en: "CLI Developer Tools — terminal/tui aesthetic with ASCII borders, color-coded output and blinking cursor",
    zh: "CLI 开发者工具——终端/TUI 美学，ASCII 边框、彩色输出和闪烁光标",
  };
  const densityLabelMap = { en: "Text-Dense", zh: "文本密集" };

  const sceneTitles = {
    en: ["Boot", "Commands", "Help", "Install", "Summary"],
    zh: ["启动", "命令", "帮助", "安装", "摘要"],
  };

  const beatActions = {
    en: {
      1: ["Boot sequence"],
      2: ["Commands type out"],
      3: ["Help page renders"],
      4: ["Progress bar animates", "Log output streams"],
      5: ["System info reveals"],
    },
    zh: {
      1: ["启动序列"],
      2: ["命令逐字打出"],
      3: ["帮助页面渲染"],
      4: ["进度条动画", "日志输出流"],
      5: ["系统信息揭示"],
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
        beatBody = "System initialization complete";
      } else if (id === 2) {
        const c2 = c as unknown as { lines: Array<{ text: string }> };
        beatTitle = "devcli status";
        if (beatIdx >= 1) {
          beatTitle = "devcli deploy";
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
        beatBody = beatIdx >= 1 ? `Progress: ${c4.progress}% — packages linked` : `Progress: ${c4.progress}%`;
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
    id: "37",
    band: "contemporary-digital",
    name: nameMap[lang],
    theme: themeMap[lang],
    densityLabel: densityLabelMap[lang],
    heroScene: 3,
    colors: {
      bg: "#0a0a0a",
      ink: "#00ff00",
      panel: "#1a1a1a",
    },
    typography: {
      header: "JetBrains Mono 700",
      body: "JetBrains Mono 400",
    },
    tags: [
      "terminal",
      "cli",
      "monospace",
      "developer",
      "tui",
      "ascii",
      "green",
      "retro",
      "hacker",
      "code",
    ],
    fonts: ["JetBrains Mono"],
    scenes,
  };
}

// ─── Transition constants ───────────────────────────────────────────────────

const TRANSITION_DURATION = 400; // ms — outgoing 150ms + gap 50ms + line reveal ~200ms
const BEAT_COUNTS: Record<number, number> = { 1: 1, 2: 2, 3: 3, 4: 2, 5: 1 };

// ─── Component ──────────────────────────────────────────────────────────────

export default function TerminalUI({
  scene,
  beat,
  language,
  isThumbnail,
  reducedMotion,
  onNavigate,
  isTransitionClone,
}: BespokeStyleProps) {
  useFonts();

  const [entered, setEntered] = useState(false);
  const [outgoingScene, setOutgoingScene] = useState<number | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const prevSceneRef = useRef<number>(scene);

  // Detect scene changes and manage transition lifecycle
  useLayoutEffect(() => {
    const prev = prevSceneRef.current;
    if (prev !== scene && !reducedMotion) {
      setOutgoingScene(prev);
      setIsTransitioning(true);
      const timer = setTimeout(() => {
        setOutgoingScene(null);
        setIsTransitioning(false);
      }, TRANSITION_DURATION);
      prevSceneRef.current = scene;
      return () => clearTimeout(timer);
    }
    prevSceneRef.current = scene;
  }, [scene, reducedMotion]);

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
            <span style={{ color: "var(--style-37-dim)" }}>{line.text}</span>
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
      <div className={styles.navIndicators} aria-label="Scene navigation">
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

  const outgoingLayerClasses = [
    styles.sceneLayer,
    styles.exitAnim,
  ].filter(Boolean).join(" ");

  const incomingLayerClasses = [
    styles.sceneLayer,
    isTransitioning && !isTransitionClone ? styles.enterAnim : "",
  ].filter(Boolean).join(" ");

  return (
    <div className={rootClasses}>
      {/* Outgoing scene (exit animation) */}
      {outgoingScene !== null && (
        <div className={outgoingLayerClasses}>
          {renderSceneFor(outgoingScene, BEAT_COUNTS[outgoingScene] - 1, true, false)}
        </div>
      )}

      {/* Incoming / current scene */}
      <div className={incomingLayerClasses}>
        {renderSceneFor(scene, beat, entered, true)}
      </div>

      {renderNavIndicators()}
    </div>
  );
}

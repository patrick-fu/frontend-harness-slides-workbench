import React, { useEffect, useCallback, useState, useRef } from "react";
import type { BespokeStyleProps, StyleMetadata } from "../types";
import styles from "./08-terminal-glow.module.css";
import { useFLIP } from "../hooks/useFLIP";

// ─── Transition constants ─────────────────────────────────────────────────

const TRANSITION_DURATION = 700; // ms — scan-out 300 + gap 80 + scan-in 300 + buffer 20
const BEAT_COUNTS: Record<number, number> = { 1: 2, 2: 2, 3: 2, 4: 3, 5: 1 };

// ─── Font Injection ────────────────────────────────────────────────────────

function useFonts() {
  useEffect(() => {
    const id = "style-08-fonts";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;700&display=swap";
    document.head.appendChild(link);
  }, []);
}

// ─── Content ────────────────────────────────────────────────────────────────

interface BootLine {
  text: string;
  type?: "ok" | "warn" | "dim" | "accent" | "normal";
}

interface OutputLine {
  text: string;
  type?: "normal" | "green" | "amber" | "dim";
  indent?: boolean;
}

interface CodeLine {
  text?: string;
  tokens?: Array<{ text: string; cls: string }>;
}

interface DashCard {
  label: string;
  value: string;
  sub: string;
  barPct: number;
  variant?: "green" | "amber";
}

interface SceneContent {
  en: {
    termTitle?: string;
    termPath?: string;
    bootLines?: BootLine[];
    mainTitle?: string;
    subTitle?: string;
    prompt?: string;
    cmd?: string;
    output?: OutputLine[];
    codeLines?: CodeLine[];
    dashTitle?: string;
    dashStatus?: string;
    cards?: DashCard[];
    closingPrompt?: string;
    closingBig?: string;
    closingAccent?: string;
    closingSub?: string;
  };
  zh: {
    termTitle?: string;
    termPath?: string;
    bootLines?: BootLine[];
    mainTitle?: string;
    subTitle?: string;
    prompt?: string;
    cmd?: string;
    output?: OutputLine[];
    codeLines?: CodeLine[];
    dashTitle?: string;
    dashStatus?: string;
    cards?: DashCard[];
    closingPrompt?: string;
    closingBig?: string;
    closingAccent?: string;
    closingSub?: string;
  };
}

const SCENES: Record<number, SceneContent> = {
  1: {
    en: {
      termTitle: "devtools — zsh",
      termPath: "~/workspace/devkit",
      bootLines: [
        { text: "[    0.000] Booting DevKit v4.2.1 ...", type: "dim" },
        { text: "[    0.012] Loading kernel modules ............ [OK]", type: "ok" },
        { text: "[    0.034] Mounting filesystem .............. [OK]", type: "ok" },
        { text: "[    0.067] Initializing runtime engine ...... [OK]", type: "ok" },
        { text: "[    0.089] Connecting to upstream sync ...... [OK]", type: "ok" },
        { text: "[    0.112] Warm start complete", type: "accent" },
      ],
      mainTitle: "$ devkit",
      subTitle: "Developer Productivity Tools  ·  v4.2.1",
    },
    zh: {
      termTitle: "devtools — zsh",
      termPath: "~/workspace/devkit",
      bootLines: [
        { text: "[    0.000] 正在启动 DevKit v4.2.1 ...", type: "dim" },
        { text: "[    0.012] 加载内核模块 ................ [OK]", type: "ok" },
        { text: "[    0.034] 挂载文件系统 ................ [OK]", type: "ok" },
        { text: "[    0.067] 初始化运行时引擎 ............ [OK]", type: "ok" },
        { text: "[    0.089] 连接上游同步 ................ [OK]", type: "ok" },
        { text: "[    0.112] 热启动完成", type: "accent" },
      ],
      mainTitle: "$ devkit",
      subTitle: "开发者生产力工具  ·  v4.2.1",
    },
  },
  2: {
    en: {
      termTitle: "devkit — status",
      termPath: "~/workspace/devkit",
      prompt: "$",
      cmd: "devkit status --verbose",
      output: [
        { text: "Checking system status...", type: "dim" },
        { text: "", type: "dim" },
        { text: "SERVICES:", type: "green" },
        { text: "  build-server    running    pid 1842    uptime 14h 22m", type: "normal", indent: true },
        { text: "  live-reload     running    pid 2103    uptime 14h 22m", type: "normal", indent: true },
        { text: "  type-check      running    pid 2301    uptime 14h 21m", type: "normal", indent: true },
        { text: "  test-runner     idle       pid --      last 2m ago", type: "amber", indent: true },
        { text: "", type: "dim" },
        { text: "RESOURCES:", type: "green" },
        { text: "  cpu             12%        4.2 GHz     8 cores", type: "normal", indent: true },
        { text: "  memory          4.7/16 GB  29%         stable", type: "normal", indent: true },
        { text: "  disk            234/512 GB 46%         SSD", type: "normal", indent: true },
      ],
    },
    zh: {
      termTitle: "devkit — status",
      termPath: "~/workspace/devkit",
      prompt: "$",
      cmd: "devkit status --verbose",
      output: [
        { text: "正在检查系统状态...", type: "dim" },
        { text: "", type: "dim" },
        { text: "服务：", type: "green" },
        { text: "  构建服务器      运行中     pid 1842    运行 14h 22m", type: "normal", indent: true },
        { text: "  热重载          运行中     pid 2103    运行 14h 22m", type: "normal", indent: true },
        { text: "  类型检查        运行中     pid 2301    运行 14h 21m", type: "normal", indent: true },
        { text: "  测试运行器      空闲       pid --      上次 2m 前", type: "amber", indent: true },
        { text: "", type: "dim" },
        { text: "资源：", type: "green" },
        { text: "  CPU             12%        4.2 GHz     8 核", type: "normal", indent: true },
        { text: "  内存            4.7/16 GB  29%         稳定", type: "normal", indent: true },
        { text: "  磁盘            234/512 GB 46%         SSD", type: "normal", indent: true },
      ],
    },
  },
  3: {
    en: {
      termTitle: "workflow.ts — devkit",
      termPath: "~/workspace/devkit/src",
      codeLines: [
        {
          tokens: [
            { text: "// Optimized build pipeline", cls: "codeComment" },
          ],
        },
        {
          tokens: [
            { text: "import ", cls: "codeKeyword" },
            { text: "{ ", cls: "normal" },
            { text: "parallel", cls: "codeFunc" },
            { text: " } ", cls: "normal" },
            { text: "from ", cls: "codeKeyword" },
            { text: "'@core/scheduler'", cls: "codeString" },
            { text: ";", cls: "normal" },
          ],
        },
        {
          tokens: [
            { text: "import ", cls: "codeKeyword" },
            { text: "{ ", cls: "normal" },
            { text: "cache", cls: "codeFunc" },
            { text: " } ", cls: "normal" },
            { text: "from ", cls: "codeKeyword" },
            { text: "'@core/cache'", cls: "codeString" },
            { text: ";", cls: "normal" },
          ],
        },
        { text: "", tokens: [] },
        {
          tokens: [
            { text: "export async function ", cls: "codeKeyword" },
            { text: "buildPipeline", cls: "codeFunc" },
            { text: "(", cls: "normal" },
            { text: "config", cls: "codeVar" },
            { text: ": ", cls: "normal" },
            { text: "BuildConfig", cls: "codeVar" },
            { text: ") {", cls: "normal" },
          ],
        },
        {
          tokens: [
            { text: "  const ", cls: "codeKeyword" },
            { text: "tasks", cls: "codeVar" },
            { text: " = ", cls: "normal" },
            { text: "await ", cls: "codeKeyword" },
            { text: "cache.", cls: "normal" },
            { text: "resolve", cls: "codeFunc" },
            { text: "(", cls: "normal" },
            { text: "config", cls: "codeVar" },
            { text: ".entry);", cls: "normal" },
          ],
        },
        {
          tokens: [
            { text: "  return ", cls: "codeKeyword" },
            { text: "parallel", cls: "codeFunc" },
            { text: "(", cls: "normal" },
            { text: "tasks", cls: "codeVar" },
            { text: ", { ", cls: "normal" },
            { text: "workers", cls: "codeVar" },
            { text: ": ", cls: "normal" },
            { text: "8", cls: "codeString" },
            { text: " });", cls: "normal" },
          ],
        },
        {
          tokens: [
            { text: "}", cls: "normal" },
          ],
        },
      ],
    },
    zh: {
      termTitle: "workflow.ts — devkit",
      termPath: "~/workspace/devkit/src",
      codeLines: [
        {
          tokens: [
            { text: "// 优化的构建管道", cls: "codeComment" },
          ],
        },
        {
          tokens: [
            { text: "import ", cls: "codeKeyword" },
            { text: "{ ", cls: "normal" },
            { text: "parallel", cls: "codeFunc" },
            { text: " } ", cls: "normal" },
            { text: "from ", cls: "codeKeyword" },
            { text: "'@core/scheduler'", cls: "codeString" },
            { text: ";", cls: "normal" },
          ],
        },
        {
          tokens: [
            { text: "import ", cls: "codeKeyword" },
            { text: "{ ", cls: "normal" },
            { text: "cache", cls: "codeFunc" },
            { text: " } ", cls: "normal" },
            { text: "from ", cls: "codeKeyword" },
            { text: "'@core/cache'", cls: "codeString" },
            { text: ";", cls: "normal" },
          ],
        },
        { text: "", tokens: [] },
        {
          tokens: [
            { text: "export async function ", cls: "codeKeyword" },
            { text: "buildPipeline", cls: "codeFunc" },
            { text: "(", cls: "normal" },
            { text: "config", cls: "codeVar" },
            { text: ": ", cls: "normal" },
            { text: "BuildConfig", cls: "codeVar" },
            { text: ") {", cls: "normal" },
          ],
        },
        {
          tokens: [
            { text: "  const ", cls: "codeKeyword" },
            { text: "tasks", cls: "codeVar" },
            { text: " = ", cls: "normal" },
            { text: "await ", cls: "codeKeyword" },
            { text: "cache.", cls: "normal" },
            { text: "resolve", cls: "codeFunc" },
            { text: "(", cls: "normal" },
            { text: "config", cls: "codeVar" },
            { text: ".entry);", cls: "normal" },
          ],
        },
        {
          tokens: [
            { text: "  return ", cls: "codeKeyword" },
            { text: "parallel", cls: "codeFunc" },
            { text: "(", cls: "normal" },
            { text: "tasks", cls: "codeVar" },
            { text: ", { ", cls: "normal" },
            { text: "workers", cls: "codeVar" },
            { text: ": ", cls: "normal" },
            { text: "8", cls: "codeString" },
            { text: " });", cls: "normal" },
          ],
        },
        {
          tokens: [
            { text: "}", cls: "normal" },
          ],
        },
      ],
    },
  },
  4: {
    en: {
      termTitle: "dashboard — devkit",
      termPath: "~/workspace/devkit",
      dashTitle: "$ devkit dashboard",
      dashStatus: "LIVE",
      cards: [
        { label: "Build Time", value: "2.4s", sub: "avg / last 50 builds", barPct: 72, variant: "green" },
        { label: "Test Coverage", value: "94.2%", sub: "lines covered", barPct: 94, variant: "green" },
        { label: "Bundle Size", value: "187kb", sub: "gzipped", barPct: 38, variant: "green" },
        { label: "Lighthouse", value: "98", sub: "performance score", barPct: 98, variant: "green" },
        { label: "Open Issues", value: "3", sub: "2 critical / 1 minor", barPct: 15, variant: "amber" },
        { label: "Deploy Freq", value: "4.2x", sub: "per day avg", barPct: 84, variant: "green" },
      ],
    },
    zh: {
      termTitle: "dashboard — devkit",
      termPath: "~/workspace/devkit",
      dashTitle: "$ devkit dashboard",
      dashStatus: "实时",
      cards: [
        { label: "构建时间", value: "2.4s", sub: "最近 50 次平均", barPct: 72, variant: "green" },
        { label: "测试覆盖率", value: "94.2%", sub: "行覆盖率", barPct: 94, variant: "green" },
        { label: "打包体积", value: "187kb", sub: "gzip 后", barPct: 38, variant: "green" },
        { label: "Lighthouse", value: "98", sub: "性能得分", barPct: 98, variant: "green" },
        { label: "未解决问题", value: "3", sub: "2 严重 / 1 轻微", barPct: 15, variant: "amber" },
        { label: "部署频率", value: "4.2x", sub: "日均次数", barPct: 84, variant: "green" },
      ],
    },
  },
  5: {
    en: {
      closingPrompt: "$ exit --message",
      closingBig: "Ship ",
      closingAccent: "faster.",
      closingSub: "DevKit v4.2.1  ·  Built for developers who ship",
    },
    zh: {
      closingPrompt: "$ exit --message",
      closingBig: "更快地",
      closingAccent: "交付。",
      closingSub: "DevKit v4.2.1  ·  为交付而生的开发者工具",
    },
  },
};

// ─── Terminal Chrome ───────────────────────────────────────────────────────

function TermChrome({ title, path }: { title: string; path: string }) {
  return (
    <div className={styles.termChrome}>
      <div className={styles.termDots}>
        <span className={`${styles.termDot} ${styles.termDotRed}`} />
        <span className={`${styles.termDot} ${styles.termDotYellow}`} />
        <span className={`${styles.termDot} ${styles.termDotGreen}`} />
      </div>
      <span className={styles.termTitle}>{title}</span>
      <span className={styles.termPath}>{path}</span>
    </div>
  );
}

// ─── Metadata ───────────────────────────────────────────────────────────────

export function getMetadata(lang: "en" | "zh"): StyleMetadata {
  const nameMap = { en: "Terminal Glow", zh: "终端辉光" };
  const themeMap = {
    en: "Developer Productivity Tools — terminal aesthetic with green/amber accents and monospace type",
    zh: "开发者生产力工具——终端美学，绿色/琥珀色点缀，等宽字体",
  };
  const densityLabelMap = { en: "Code-Dense", zh: "代码密集" };

  const sceneTitles = {
    en: ["Boot", "Status", "Code", "Dashboard", "Exit"],
    zh: ["启动", "状态", "代码", "仪表", "退出"],
  };

  const beatActions = {
    en: {
      1: ["Boot sequence", "Title and subtitle appear"],
      2: ["Command prompt", "Output streams in"],
      3: ["Editor chrome", "Code lines type out"],
      4: ["Dashboard header", "Cards 1-3 populate", "Cards 4-6 populate"],
      5: ["Exit message revealed"],
    },
    zh: {
      1: ["启动序列", "标题和副标题呈现"],
      2: ["命令提示符", "输出流式呈现"],
      3: ["编辑器框架", "代码行逐行键入"],
      4: ["仪表标题", "卡片 1-3 填充", "卡片 4-6 填充"],
      5: ["退出消息揭示"],
    },
  };

  const BEAT_COUNTS: Record<number, number> = {
    1: 2,
    2: 2,
    3: 2,
    4: 3,
    5: 1,
  };

  const scenes = [1, 2, 3, 4, 5].map((id) => {
    const beatCount = BEAT_COUNTS[id];
    const actions = beatActions[lang][id as keyof (typeof beatActions)["en"]];
    const c = SCENES[id][lang];

    const beats = Array.from({ length: beatCount }, (_, beatIdx) => {
      let beatTitle = "";
      let beatBody = "";

      if (id === 1) {
        beatTitle = c.mainTitle || "";
        beatBody = beatIdx >= 1 ? c.subTitle || "" : "";
      } else if (id === 2) {
        beatTitle = c.cmd || "";
        if (beatIdx >= 1) {
          const visible = (c.output || []).slice(0, 6);
          beatBody = visible.map((o) => o.text).filter(Boolean).join(" / ");
        }
      } else if (id === 3) {
        beatTitle = "workflow.ts";
        if (beatIdx >= 1) {
          beatBody = "buildPipeline function definition";
        }
      } else if (id === 4) {
        beatTitle = c.dashTitle || "";
        const visible = (c.cards || []).slice(0, Math.min(beatIdx * 3, 6));
        beatBody = beatIdx >= 1 ? visible.map((card) => `${card.label}: ${card.value}`).join(" / ") : "";
      } else if (id === 5) {
        beatTitle = `${c.closingBig || ""}${c.closingAccent || ""}`;
        beatBody = c.closingSub || "";
      }

      return { id: beatIdx, action: actions[beatIdx], title: beatTitle, body: beatBody };
    });

    return { id, title: sceneTitles[lang][id - 1], beats };
  });

  return {
    id: "08",
    band: "minimal-keynote",
    name: nameMap[lang],
    theme: themeMap[lang],
    densityLabel: densityLabelMap[lang],
    heroScene: 4,
    colors: {
      bg: "#0d1117",
      ink: "#c9d1d9",
      panel: "#161b22",
    },
    typography: {
      header: "JetBrains Mono 500",
      body: "JetBrains Mono 400",
    },
    tags: [
      "terminal",
      "monospace",
      "dark",
      "green-glow",
      "developer",
      "code",
      "hacker",
      "amber-accent",
      "technical",
    ],
    fonts: ["JetBrains Mono"],
    scenes,
  };
}

// ─── Component ──────────────────────────────────────────────────────────────

export default function TerminalGlow({
  scene,
  beat,
  language,
  isThumbnail,
  reducedMotion,
  onNavigate,
  isTransitionClone,
}: BespokeStyleProps) {
  useFonts();

  const [outgoingScene, setOutgoingScene] = useState<number | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const prevSceneRef = useRef<number>(scene);

  // Detect scene changes and manage transition lifecycle
  useEffect(() => {
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

  // FLIP for output areas where new lines push old ones up
  const { ref: outputRef } = useFLIP<HTMLDivElement>({
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
    isThumbnail ? styles.thumbnail : "",
  ]
    .filter(Boolean)
    .join(" ");

  // ── Scene renderers (parameterized by beatNum) ──────────────────────────

  const renderScene1 = (beatNum: number, _isCurrent: boolean) => {
    const c = SCENES[1][language];
    const bootLines = c.bootLines || [];
    return (
      <div className={styles.scene1}>
        <TermChrome title={c.termTitle || ""} path={c.termPath || ""} />
        <div className={styles.bootLines}>
          {bootLines.map((line, i) => {
            const visible = i <= beatNum * 3 + 2;
            const lineClasses = [
              styles.bootLine,
              visible ? styles.bootLineVisible : "",
              line.type === "ok" ? styles.bootLineOk : "",
              line.type === "warn" ? styles.bootLineWarn : "",
              line.type === "accent" ? styles.bootLineAccent : "",
            ]
              .filter(Boolean)
              .join(" ");
            return (
              <div
                key={i}
                className={lineClasses}
                style={
                  reducedMotion
                    ? { opacity: visible ? 0.7 : 0 }
                    : { transitionDelay: `${i * 0.04}s` }
                }
              >
                {line.text}
              </div>
            );
          })}
        </div>
        {beatNum >= 1 && (
          <>
            <h1
              className={styles.termTitleMain}
            >
              {c.mainTitle}
            </h1>
            <p
              className={styles.termTitleSub}
            >
              {c.subTitle}
            </p>
          </>
        )}
      </div>
    );
  };

  const renderScene2 = (beatNum: number, isCurrent: boolean) => {
    const c = SCENES[2][language];
    const output = c.output || [];
    const visibleCount = beatNum >= 1 ? output.length : 0;
    return (
      <div className={styles.scene2}>
        <TermChrome title={c.termTitle || ""} path={c.termPath || ""} />
        <div className={styles.promptLine}>
          <span className={styles.promptSymbol}>{c.prompt}</span>
          <span className={styles.promptCmd}>{c.cmd}</span>
          <span className={styles.cursor} aria-hidden="true" />
        </div>
        <div
          ref={isCurrent ? outputRef : undefined}
          className={styles.outputBlock}
        >
          {output.map((line, i) => {
            const visible = i < visibleCount;
            const lineClasses = [
              styles.outputLine,
              visible ? styles.outputLineVisible : "",
              line.type === "green" ? styles.outputLineGreen : "",
              line.type === "amber" ? styles.outputLineAmber : "",
              line.type === "dim" ? styles.outputLineDim : "",
              line.indent ? styles.outputIndent : "",
            ]
              .filter(Boolean)
              .join(" ");
            return (
              <div
                key={i}
                className={lineClasses}
                style={
                  reducedMotion
                    ? { opacity: visible ? (line.type === "dim" ? 0.4 : 0.75) : 0 }
                    : { transitionDelay: `${i * 0.03}s` }
                }
              >
                {line.text || " "}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderScene3 = (beatNum: number, _isCurrent: boolean) => {
    const c = SCENES[3][language];
    const codeLines = c.codeLines || [];
    const visibleCount = beatNum >= 1 ? codeLines.length : 0;
    return (
      <div className={styles.scene3}>
        <TermChrome title={c.termTitle || ""} path={c.termPath || ""} />
        <div className={styles.codeEditor}>
          <div className={styles.lineNumbers}>
            {codeLines.map((_, i) => (
              <span key={i} className={styles.lineNum}>
                {i + 1}
              </span>
            ))}
          </div>
          <div className={styles.codeContent}>
            {codeLines.map((line, i) => {
              const visible = i < visibleCount;
              const lineClasses = [
                styles.codeLine,
                visible ? styles.codeLineVisible : "",
              ]
                .filter(Boolean)
                .join(" ");
              return (
                <div
                  key={i}
                  className={lineClasses}
                  style={
                    reducedMotion
                      ? { opacity: visible ? 1 : 0 }
                      : { transitionDelay: `${i * 0.06}s` }
                  }
                >
                  {line.tokens?.map((token, j) => {
                    if (token.cls === "codeComment") {
                      return (
                        <span key={j} className={styles.codeComment}>
                          {token.text}
                        </span>
                      );
                    }
                    if (token.cls === "codeKeyword") {
                      return (
                        <span key={j} className={styles.codeKeyword}>
                          {token.text}
                        </span>
                      );
                    }
                    if (token.cls === "codeString") {
                      return (
                        <span key={j} className={styles.codeString}>
                          {token.text}
                        </span>
                      );
                    }
                    if (token.cls === "codeFunc") {
                      return (
                        <span key={j} className={styles.codeFunc}>
                          {token.text}
                        </span>
                      );
                    }
                    if (token.cls === "codeVar") {
                      return (
                        <span key={j} className={styles.codeVar}>
                          {token.text}
                        </span>
                      );
                    }
                    return <span key={j}>{token.text}</span>;
                  })}
                  {i === codeLines.length - 1 && visible && (
                    <span className={styles.cursor} aria-hidden="true" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const renderScene4 = (beatNum: number, _isCurrent: boolean) => {
    const c = SCENES[4][language];
    const cards = c.cards || [];
    const visibleCount = Math.min(beatNum * 3, 6);
    return (
      <div className={styles.scene4}>
        <TermChrome title={c.termTitle || ""} path={c.termPath || ""} />
        <div className={styles.dashHeader}>
          <h2 className={styles.dashTitle}>{c.dashTitle}</h2>
          <div className={styles.dashStatus}>
            <span className={styles.dashStatusDot} />
            {c.dashStatus}
          </div>
        </div>
        <div className={styles.dashGrid}>
          {cards.map((card, i) => {
            const visible = i < visibleCount;
            const cardClasses = [
              styles.dashCard,
              visible ? styles.dashCardVisible : "",
            ]
              .filter(Boolean)
              .join(" ");
            const valueClasses = [
              styles.dashCardValue,
              card.variant === "amber" ? styles.dashCardValueAmber : "",
            ]
              .filter(Boolean)
              .join(" ");
            const barFillClasses = [
              styles.dashCardBarFill,
              card.variant === "amber" ? styles.dashCardBarFillAmber : "",
            ]
              .filter(Boolean)
              .join(" ");
            return (
              <div
                key={i}
                className={cardClasses}
                style={
                  reducedMotion
                    ? { opacity: visible ? 1 : 0, transform: "none" }
                    : { transitionDelay: `${i * 0.08}s` }
                }
              >
                <span className={styles.dashCardLabel}>{card.label}</span>
                <span className={valueClasses}>{card.value}</span>
                <span className={styles.dashCardSub}>{card.sub}</span>
                <div className={styles.dashCardBar}>
                  <div
                    className={barFillClasses}
                    style={{
                      width: visible ? `${card.barPct}%` : "0%",
                      transition: reducedMotion
                        ? "none"
                        : `width 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${0.2 + i * 0.08}s`,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderScene5 = (_beatNum: number, _isCurrent: boolean) => {
    const c = SCENES[5][language];
    return (
      <div className={styles.scene5}>
        <span className={styles.closingPrompt}>{c.closingPrompt}</span>
        <h2 className={styles.closingBig}>
          {c.closingBig}
          <span>{c.closingAccent}</span>
        </h2>
        <p className={styles.closingSub}>
          {c.closingSub}
          <span className={styles.closingCursor} aria-hidden="true" />
        </p>
      </div>
    );
  };

  const renderSceneFor = (sceneNum: number, beatNum: number, isCurrent: boolean) => {
    switch (sceneNum) {
      case 1:
        return renderScene1(beatNum, isCurrent);
      case 2:
        return renderScene2(beatNum, isCurrent);
      case 3:
        return renderScene3(beatNum, isCurrent);
      case 4:
        return renderScene4(beatNum, isCurrent);
      case 5:
        return renderScene5(beatNum, isCurrent);
      default:
        return null;
    }
  };

  // ── Navigation ──────────────────────────────────────────────────────────

  const renderNav = () => {
    if (isThumbnail) return null;

    return (
      <nav className={styles.cmdNav} aria-label="Scene navigation">
        <span className={styles.cmdPrompt}>$</span>
        <span className={styles.cmdCmd}>goto</span>
        {[1, 2, 3, 4, 5].map((s) => {
          const isActive = s === scene;
          const itemClasses = [
            styles.cmdScene,
            isActive ? styles.cmdSceneActive : "",
          ]
            .filter(Boolean)
            .join(" ");
          return (
            <button
              key={s}
              type="button"
              className={itemClasses}
              aria-label={`Jump to scene ${s}`}
              onClick={(e) => handleNavClick(e, s)}
            >
              scene_{s}
            </button>
          );
        })}
        <span className={styles.cursor} aria-hidden="true" />
      </nav>
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
      {/* CRT effects (persistent across transitions) */}
      <div className={styles.scanlines} aria-hidden="true" />
      <div className={styles.vignette} aria-hidden="true" />

      {/* Outgoing scene (scan-out animation) */}
      {outgoingScene !== null && (
        <div className={outgoingLayerClasses}>
          <div className={styles.track}>
            {renderSceneFor(outgoingScene, BEAT_COUNTS[outgoingScene] - 1, false)}
          </div>
        </div>
      )}

      {/* Incoming / current scene (scan-in animation) */}
      <div className={incomingLayerClasses}>
        <div
          key={`08-${scene}`}
          className={styles.track}
        >
          {renderSceneFor(scene, beat, true)}
        </div>
      </div>

      {renderNav()}
    </div>
  );
}

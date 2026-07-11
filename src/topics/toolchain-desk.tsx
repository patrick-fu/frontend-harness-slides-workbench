import { Fragment, type CSSProperties, type ReactNode } from "react";
import {
  defineTopic,
  type TopicMetadata,
  type TopicStageProps,
  type TopicTransitionScore,
} from "../domain/topic";
import SpatialSceneTrack, {
  type BeatLayoutMode,
  type SceneTransitionMap,
} from "../styles/SpatialSceneTrack";

type Lang = "en" | "zh";
type Tone = "green" | "red" | "yellow" | "cyan" | "navy";

interface BeatCopy {
  id: number;
  action: string;
  title: string;
  body: string;
}

interface PanelCopy {
  title: string;
  lines: string[];
  tone?: Tone;
}

interface MetricCopy {
  label: string;
  value: string;
  tone: Tone;
}

interface StepCopy {
  label: string;
  detail: string;
  tone: Tone;
}

interface DialogCopy {
  title: string;
  message: string;
  detail: string;
  primary: string;
  secondary: string;
}

interface SceneCopy {
  id: number;
  file: string;
  icon: string;
  title: string;
  subtitle: string;
  status: string;
  footer: string;
  beats: BeatCopy[];
  panels: PanelCopy[];
  metrics: MetricCopy[];
  steps: StepCopy[];
  commands: string[];
  dialog?: DialogCopy;
}

interface DeckCopy {
  start: string;
  tray: string;
  navLabel: string;
  beatLabel: string;
  sceneLabels: string[];
  scenes: Record<number, SceneCopy>;
}

const SCENE_IDS = [1, 2, 3, 4, 5];
const BEAT_LAYOUT_MODES: Record<number, BeatLayoutMode> = {
  1: "reserved",
  2: "reserved",
  3: "reserved",
  4: "reserved",
  5: "reserved",
};

const TRANSITION_SCORE = {
  "1->2": "hard-cut",
  "2->3": "glitch",
  "3->4": "slide-x",
  "4->5": "hard-cut",
} as const satisfies TopicTransitionScore;

const TRANSITION_MAP: SceneTransitionMap = TRANSITION_SCORE;

const COPY: Record<Lang, DeckCopy> = {
  en: {
    start: "Start",
    tray: "TOOLCHAIN READY",
    navLabel: "Toolchain desktop scenes",
    beatLabel: "Beat",
    sceneLabels: ["BOOT", "WINDOWS", "CONFLICT", "FIXED", "SHUTDOWN"],
    scenes: {
      1: {
        id: 1,
        file: "AUTOEXEC.BAT",
        icon: "B",
        title: "Boot the toolchain",
        subtitle: "Before any editor opens, the desktop proves the runtime is coherent.",
        status: "BOOT SEQUENCE",
        footer: "A stable session begins with versions, paths, and scripts agreeing.",
        beats: [
          {
            id: 0,
            action: "Run POST checks",
            title: "POST checks",
            body: "Node, package manager, and workspace paths report ready.",
          },
          {
            id: 1,
            action: "Mount the project",
            title: "Project mounted",
            body: "The harness opens with the correct source tree and no stray temp files.",
          },
          {
            id: 2,
            action: "Show desktop",
            title: "Desktop ready",
            body: "Tool windows can now open without guessing which runtime owns the session.",
          },
        ],
        panels: [
          {
            title: "POST CHECKLIST",
            lines: ["NODE.EXE found", "PNPM cache mounted", "TSCONFIG visible"],
            tone: "green",
          },
          {
            title: "BOOT LOG",
            lines: [
              "Loading harness shell",
              "Reading style protocol",
              "Desktop session ready",
            ],
            tone: "cyan",
          },
        ],
        metrics: [
          { label: "runtime", value: "82%", tone: "green" },
          { label: "paths", value: "64%", tone: "cyan" },
          { label: "scripts", value: "48%", tone: "yellow" },
        ],
        steps: [],
        commands: ["C:\\WORKBENCH> boot /toolchain", "AUTOEXEC: no conflicts found"],
      },
      2: {
        id: 2,
        file: "DESKTOP.INI",
        icon: "W",
        title: "Open the working windows",
        subtitle: "Editor, package manager, and test runner sit on the same gray desktop.",
        status: "WINDOW LAYOUT",
        footer: "Every tool stays visible enough to explain its part of the workflow.",
        beats: [
          {
            id: 0,
            action: "Open editor",
            title: "Editor window",
            body: "The source window owns the change surface.",
          },
          {
            id: 1,
            action: "Open dependencies",
            title: "Package window",
            body: "The dependency window locks versions before execution.",
          },
          {
            id: 2,
            action: "Open checks",
            title: "Test window",
            body: "The test runner stays docked beside the implementation.",
          },
        ],
        panels: [
          {
            title: "CODE.EXE",
            lines: ["src/styles/34-toolchain-desktop.tsx", "renderScene(scene, beat)", "export topic module"],
            tone: "navy",
          },
          {
            title: "PKGMAN95",
            lines: ["react locked", "typescript locked", "spatial track linked"],
            tone: "cyan",
          },
          {
            title: "TESTRUN.EXE",
            lines: ["metadata: pending", "layout: pending", "motion: pending"],
            tone: "yellow",
          },
        ],
        metrics: [
          { label: "editor", value: "88%", tone: "green" },
          { label: "deps", value: "72%", tone: "cyan" },
          { label: "checks", value: "41%", tone: "yellow" },
        ],
        steps: [],
        commands: ["WINDOWS: snap editor", "WINDOWS: snap package manager", "WINDOWS: snap test runner"],
      },
      3: {
        id: 3,
        file: "CONFLICT.DLG",
        icon: "!",
        title: "Resolve the tool conflict",
        subtitle: "A modal interrupts the desktop because two tools claim the same decision.",
        status: "CONFLICT DETECTED",
        footer: "The fix is not another window. One owner, one command, one visible result.",
        beats: [
          {
            id: 0,
            action: "Show mismatch",
            title: "Mismatch found",
            body: "Build and lint disagree about the active workflow.",
          },
          {
            id: 1,
            action: "Raise dialog",
            title: "Conflict dialog",
            body: "The desktop asks for an explicit owner instead of guessing.",
          },
          {
            id: 2,
            action: "Choose fix",
            title: "Fix selected",
            body: "The workflow is pinned and the warning can close.",
          },
        ],
        panels: [
          {
            title: "BUILD.LOG",
            lines: ["WARN duplicate scripts", "ERR stale lockfile", "HINT choose owner"],
            tone: "red",
          },
          {
            title: "LINT.TXT",
            lines: ["rule set mismatch", "unused workflow flag", "requires cleanup"],
            tone: "yellow",
          },
        ],
        metrics: [
          { label: "build", value: "34%", tone: "red" },
          { label: "lint", value: "46%", tone: "yellow" },
          { label: "owner", value: "22%", tone: "cyan" },
        ],
        steps: [
          { label: "Owner", detail: "harness scripts", tone: "cyan" },
          { label: "Lock", detail: "single command path", tone: "yellow" },
          { label: "Close", detail: "warning cleared", tone: "green" },
        ],
        commands: ["ERROR: two runners registered", "DIALOG: select workflow owner"],
        dialog: {
          title: "Workflow Conflict",
          message: "Two tools are trying to run the same step.",
          detail: "Assign ownership to the harness script and close the duplicate path.",
          primary: "Use harness script",
          secondary: "Inspect log",
        },
      },
      4: {
        id: 4,
        file: "WORKFLOW.WIZ",
        icon: "F",
        title: "Lock the fixed workflow",
        subtitle: "The desktop becomes a guided wizard: install, build, audit, ship.",
        status: "WORKFLOW FIXED",
        footer: "Once the order is visible, the toolchain stops arguing and starts reporting.",
        beats: [
          {
            id: 0,
            action: "Pin install",
            title: "Install pinned",
            body: "Dependencies resolve through one command.",
          },
          {
            id: 1,
            action: "Run build",
            title: "Build aligned",
            body: "Compile, lint, and audit agree on the same artifact.",
          },
          {
            id: 2,
            action: "Confirm workflow",
            title: "Workflow saved",
            body: "The next session can repeat the path without reading the room.",
          },
        ],
        panels: [
          {
            title: "WIZARD STEPS",
            lines: ["Install dependencies", "Build harness", "Audit scenes", "Ship preview"],
            tone: "green",
          },
          {
            title: "VERIFICATION",
            lines: ["metadata complete", "transition map active", "taskbar nav wired"],
            tone: "cyan",
          },
        ],
        metrics: [
          { label: "install", value: "100%", tone: "green" },
          { label: "build", value: "86%", tone: "green" },
          { label: "audit", value: "78%", tone: "cyan" },
        ],
        steps: [
          { label: "Install", detail: "one package command", tone: "green" },
          { label: "Build", detail: "one harness target", tone: "green" },
          { label: "Audit", detail: "five scene pass", tone: "cyan" },
          { label: "Ship", detail: "preview ready", tone: "yellow" },
        ],
        commands: ["WORKFLOW: install -> build -> audit", "RESULT: duplicate path removed"],
      },
      5: {
        id: 5,
        file: "SHUTDOWN.EXE",
        icon: "S",
        title: "Shut down cleanly",
        subtitle: "The desktop closes only after the fixed workflow is written back.",
        status: "SESSION COMPLETE",
        footer: "A good toolchain does not need drama on the next boot.",
        beats: [
          {
            id: 0,
            action: "Save state",
            title: "State saved",
            body: "The stable command path is recorded.",
          },
          {
            id: 1,
            action: "Close windows",
            title: "Windows closed",
            body: "Editor, package manager, and test runner exit without prompts.",
          },
          {
            id: 2,
            action: "Power off",
            title: "Clean shutdown",
            body: "The next boot starts from an agreed workflow.",
          },
        ],
        panels: [
          {
            title: "SESSION LOG",
            lines: ["saved workflow.wiz", "closed duplicate runner", "desktop can power off"],
            tone: "green",
          },
          {
            title: "NEXT BOOT",
            lines: ["one command path", "known verification step", "no modal conflict"],
            tone: "cyan",
          },
        ],
        metrics: [
          { label: "state", value: "100%", tone: "green" },
          { label: "windows", value: "100%", tone: "green" },
          { label: "next boot", value: "92%", tone: "cyan" },
        ],
        steps: [
          { label: "Save", detail: "workflow written", tone: "green" },
          { label: "Close", detail: "all windows exited", tone: "green" },
          { label: "Power", detail: "ready for reboot", tone: "cyan" },
        ],
        commands: ["SHUTDOWN: save session", "POWER: ready"],
        dialog: {
          title: "Shut Down Toolchain OS",
          message: "It is now safe to close the desktop.",
          detail: "All workflow changes were saved.",
          primary: "Shut Down",
          secondary: "Restart",
        },
      },
    },
  },
  zh: {
    start: "开始",
    tray: "工具链就绪",
    navLabel: "工具链桌面场景",
    beatLabel: "节拍",
    sceneLabels: ["启动", "窗口", "冲突", "修复", "关机"],
    scenes: {
      1: {
        id: 1,
        file: "AUTOEXEC.BAT",
        icon: "启",
        title: "启动工具链",
        subtitle: "编辑器打开前，桌面先确认运行环境没有互相打架。",
        status: "启动序列",
        footer: "稳定会话从版本、路径和脚本达成一致开始。",
        beats: [
          {
            id: 0,
            action: "执行自检",
            title: "自检通过",
            body: "Node、包管理器和工作区路径都返回就绪。",
          },
          {
            id: 1,
            action: "挂载项目",
            title: "项目已挂载",
            body: "Harness 打开正确源码树，不把临时文件混进桌面。",
          },
          {
            id: 2,
            action: "显示桌面",
            title: "桌面就绪",
            body: "工具窗口可以打开，且不再猜测谁拥有运行会话。",
          },
        ],
        panels: [
          {
            title: "自检清单",
            lines: ["NODE.EXE 已找到", "PNPM 缓存已挂载", "TSCONFIG 可读取"],
            tone: "green",
          },
          {
            title: "启动日志",
            lines: ["加载 harness shell", "读取 style 协议", "桌面会话就绪"],
            tone: "cyan",
          },
        ],
        metrics: [
          { label: "运行时", value: "82%", tone: "green" },
          { label: "路径", value: "64%", tone: "cyan" },
          { label: "脚本", value: "48%", tone: "yellow" },
        ],
        steps: [],
        commands: ["C:\\WORKBENCH> boot /toolchain", "AUTOEXEC: 未发现冲突"],
      },
      2: {
        id: 2,
        file: "DESKTOP.INI",
        icon: "窗",
        title: "打开工作窗口",
        subtitle: "编辑器、包管理器和测试运行器摆在同一张灰色桌面上。",
        status: "窗口布局",
        footer: "每个工具都保留足够可见面积，说明自己在流程里的职责。",
        beats: [
          {
            id: 0,
            action: "打开编辑器",
            title: "编辑器窗口",
            body: "源码窗口负责承载本次修改。",
          },
          {
            id: 1,
            action: "打开依赖",
            title: "包管理窗口",
            body: "依赖窗口先锁定版本，再允许执行。",
          },
          {
            id: 2,
            action: "打开检查",
            title: "测试窗口",
            body: "测试运行器固定在实现旁边，持续反馈状态。",
          },
        ],
        panels: [
          {
            title: "CODE.EXE",
            lines: ["src/styles/34-toolchain-desktop.tsx", "renderScene(scene, beat)", "导出 topic module"],
            tone: "navy",
          },
          {
            title: "PKGMAN95",
            lines: ["react 已锁定", "typescript 已锁定", "spatial track 已连接"],
            tone: "cyan",
          },
          {
            title: "TESTRUN.EXE",
            lines: ["metadata: 待完成", "layout: 待完成", "motion: 待完成"],
            tone: "yellow",
          },
        ],
        metrics: [
          { label: "编辑器", value: "88%", tone: "green" },
          { label: "依赖", value: "72%", tone: "cyan" },
          { label: "检查", value: "41%", tone: "yellow" },
        ],
        steps: [],
        commands: ["WINDOWS: 固定编辑器", "WINDOWS: 固定包管理器", "WINDOWS: 固定测试运行器"],
      },
      3: {
        id: 3,
        file: "CONFLICT.DLG",
        icon: "!",
        title: "处理工具冲突",
        subtitle: "两个工具抢同一个决策，桌面用模态框强制暂停。",
        status: "检测到冲突",
        footer: "修复不是再开一个窗口，而是一个 owner、一条命令、一个结果。",
        beats: [
          {
            id: 0,
            action: "显示不一致",
            title: "发现不一致",
            body: "构建和 lint 对当前工作流给出不同判断。",
          },
          {
            id: 1,
            action: "弹出对话框",
            title: "冲突对话框",
            body: "桌面要求显式指定 owner，而不是自动猜测。",
          },
          {
            id: 2,
            action: "选择修复",
            title: "修复已选择",
            body: "工作流被固定，警告可以关闭。",
          },
        ],
        panels: [
          {
            title: "BUILD.LOG",
            lines: ["WARN 重复脚本", "ERR 锁文件过期", "HINT 选择 owner"],
            tone: "red",
          },
          {
            title: "LINT.TXT",
            lines: ["规则集不一致", "workflow flag 未使用", "需要清理"],
            tone: "yellow",
          },
        ],
        metrics: [
          { label: "构建", value: "34%", tone: "red" },
          { label: "Lint", value: "46%", tone: "yellow" },
          { label: "Owner", value: "22%", tone: "cyan" },
        ],
        steps: [
          { label: "Owner", detail: "harness 脚本", tone: "cyan" },
          { label: "锁定", detail: "单一路径", tone: "yellow" },
          { label: "关闭", detail: "警告清除", tone: "green" },
        ],
        commands: ["ERROR: 注册了两个 runner", "DIALOG: 选择 workflow owner"],
        dialog: {
          title: "工作流冲突",
          message: "两个工具正在运行同一步。",
          detail: "把所有权交给 harness 脚本，并关闭重复路径。",
          primary: "使用 harness 脚本",
          secondary: "查看日志",
        },
      },
      4: {
        id: 4,
        file: "WORKFLOW.WIZ",
        icon: "修",
        title: "锁定修复后的工作流",
        subtitle: "桌面变成向导：安装、构建、审计、交付。",
        status: "工作流已修复",
        footer: "顺序清楚后，工具链停止争抢，开始报告。",
        beats: [
          {
            id: 0,
            action: "固定安装",
            title: "安装已固定",
            body: "依赖只通过一条命令解析。",
          },
          {
            id: 1,
            action: "运行构建",
            title: "构建已对齐",
            body: "编译、lint 和审计指向同一个产物。",
          },
          {
            id: 2,
            action: "确认工作流",
            title: "工作流已保存",
            body: "下一次会话可复现路径，不需要重新判断。",
          },
        ],
        panels: [
          {
            title: "向导步骤",
            lines: ["安装依赖", "构建 harness", "审计场景", "交付预览"],
            tone: "green",
          },
          {
            title: "验证项",
            lines: ["metadata 完整", "transition map 生效", "taskbar nav 已连接"],
            tone: "cyan",
          },
        ],
        metrics: [
          { label: "安装", value: "100%", tone: "green" },
          { label: "构建", value: "86%", tone: "green" },
          { label: "审计", value: "78%", tone: "cyan" },
        ],
        steps: [
          { label: "安装", detail: "一条包命令", tone: "green" },
          { label: "构建", detail: "一个 harness target", tone: "green" },
          { label: "审计", detail: "五场景通过", tone: "cyan" },
          { label: "交付", detail: "预览就绪", tone: "yellow" },
        ],
        commands: ["WORKFLOW: install -> build -> audit", "RESULT: 重复路径已移除"],
      },
      5: {
        id: 5,
        file: "SHUTDOWN.EXE",
        icon: "关",
        title: "干净关机",
        subtitle: "修复后的工作流写回后，桌面才允许关闭。",
        status: "会话完成",
        footer: "好的工具链不会把悬念留到下一次启动。",
        beats: [
          {
            id: 0,
            action: "保存状态",
            title: "状态已保存",
            body: "稳定命令路径已经记录。",
          },
          {
            id: 1,
            action: "关闭窗口",
            title: "窗口已关闭",
            body: "编辑器、包管理器和测试运行器都无提示退出。",
          },
          {
            id: 2,
            action: "切断电源",
            title: "干净关机",
            body: "下一次启动将从一致的工作流开始。",
          },
        ],
        panels: [
          {
            title: "会话日志",
            lines: ["已保存 workflow.wiz", "已关闭重复 runner", "桌面可关机"],
            tone: "green",
          },
          {
            title: "下次启动",
            lines: ["单一命令路径", "明确验证步骤", "无模态冲突"],
            tone: "cyan",
          },
        ],
        metrics: [
          { label: "状态", value: "100%", tone: "green" },
          { label: "窗口", value: "100%", tone: "green" },
          { label: "下次启动", value: "92%", tone: "cyan" },
        ],
        steps: [
          { label: "保存", detail: "工作流已写入", tone: "green" },
          { label: "关闭", detail: "全部窗口退出", tone: "green" },
          { label: "电源", detail: "可重新启动", tone: "cyan" },
        ],
        commands: ["SHUTDOWN: 保存会话", "POWER: 就绪"],
        dialog: {
          title: "关闭 Toolchain OS",
          message: "现在可以安全关闭桌面。",
          detail: "所有工作流修改都已保存。",
          primary: "关机",
          secondary: "重新启动",
        },
      },
    },
  },
};

function cx(...parts: Array<string | false | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

function cssVars(values: Record<string, string>): CSSProperties {
  return values as CSSProperties;
}

function getSceneCopy(language: Lang, sceneId: number): SceneCopy {
  return COPY[language].scenes[sceneId] ?? COPY[language].scenes[1];
}

function clampBeat(sceneCopy: SceneCopy, beat: number): number {
  return Math.max(0, Math.min(beat, sceneCopy.beats.length - 1));
}

function isRevealed(beat: number, index: number): boolean {
  return beat >= index;
}

function revealClass(beat: number, index: number, className?: string): string {
  return cx(
    "tw34-reveal",
    isRevealed(beat, index) ? "tw34-visible" : "tw34-hidden",
    beat === index && "tw34-current",
    className,
  );
}

function ToneLight({ tone }: { tone: Tone }) {
  return <span className={cx("tw34-light", `tw34-tone-${tone}`)} aria-hidden="true" />;
}

function RetroWindow({
  title,
  icon,
  className,
  children,
}: {
  title: string;
  icon: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cx("tw34-window", className)} data-beat-layout-item="true">
      <div className="tw34-titlebar">
        <span className="tw34-title-icon">{icon}</span>
        <span className="tw34-title-text">{title}</span>
        <span className="tw34-controls" aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
      </div>
      <div className="tw34-window-body">{children}</div>
    </div>
  );
}

function GroupBox({
  title,
  children,
  tone = "navy",
  className,
}: {
  title: string;
  children: ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <section className={cx("tw34-group", className)} data-tone={tone} data-beat-layout-item="true">
      <div className="tw34-group-title">
        <ToneLight tone={tone} />
        <span>{title}</span>
      </div>
      {children}
    </section>
  );
}

function BeatMarkers({
  beat,
  beats,
  label,
}: {
  beat: number;
  beats: BeatCopy[];
  label: string;
}) {
  return (
    <div className="tw34-beat-box" data-beat-layout-item="true" aria-label={label}>
      <span className="tw34-beat-caption">{label}</span>
      <div className="tw34-beat-markers">
        {beats.map((item, index) => (
          <span
            key={item.id}
            className={cx(
              "tw34-beat-marker",
              isRevealed(beat, index) && "tw34-beat-marker-on",
              beat === index && "tw34-beat-marker-current",
            )}
            title={item.title}
          />
        ))}
      </div>
    </div>
  );
}

function MetricBar({ metric }: { metric: MetricCopy }) {
  return (
    <div className="tw34-meter-row" data-beat-layout-item="true">
      <span className="tw34-meter-label">{metric.label}</span>
      <span className="tw34-meter">
        <span
          className={cx("tw34-meter-fill", `tw34-tone-${metric.tone}`)}
          style={cssVars({ "--tw34-fill": metric.value })}
        />
      </span>
    </div>
  );
}

function CommandLines({ lines, beat }: { lines: string[]; beat: number }) {
  return (
    <div className="tw34-terminal" data-beat-layout-item="true">
      {lines.map((line, index) => (
        <div key={line} className={revealClass(beat, index)}>
          <span className="tw34-prompt">&gt;</span> {line}
        </div>
      ))}
    </div>
  );
}

function PanelLines({ panel, beat }: { panel: PanelCopy; beat: number }) {
  return (
    <GroupBox title={panel.title} tone={panel.tone ?? "navy"}>
      <ul className="tw34-lines">
        {panel.lines.map((line, index) => (
          <li key={line} className={revealClass(beat, index)} data-beat-layout-item="true">
            <span className="tw34-chevron">»</span>
            <span>{line}</span>
          </li>
        ))}
      </ul>
    </GroupBox>
  );
}

function SceneHeader({
  sceneCopy,
  beat,
  language,
}: {
  sceneCopy: SceneCopy;
  beat: number;
  language: Lang;
}) {
  return (
    <header className="tw34-command-band" data-beat-layout-item="true">
      <div className="tw34-copy-block">
        <div className="tw34-kicker">
          <ToneLight tone={sceneCopy.id === 3 ? "red" : sceneCopy.id === 5 ? "cyan" : "green"} />
          <span>{sceneCopy.status}</span>
        </div>
        <h1>{sceneCopy.title}</h1>
        <p>{sceneCopy.subtitle}</p>
      </div>
      <BeatMarkers beat={beat} beats={sceneCopy.beats} label={COPY[language].beatLabel} />
    </header>
  );
}

function StatusFooter({ sceneCopy, beat }: { sceneCopy: SceneCopy; beat: number }) {
  const activeBeat = sceneCopy.beats[beat] ?? sceneCopy.beats[0];
  return (
    <footer className="tw34-status-footer" data-beat-layout-item="true">
      <span>{activeBeat.title}</span>
      <span>{activeBeat.body}</span>
      <span>{sceneCopy.footer}</span>
    </footer>
  );
}

function BootBody({ sceneCopy, beat }: { sceneCopy: SceneCopy; beat: number }) {
  return (
    <div className="tw34-body tw34-boot-body">
      <div className={revealClass(beat, 1, "tw34-splash")} data-beat-layout-item="true">
        <div className="tw34-splash-logo">TOOLCHAIN OS 95</div>
        <div className="tw34-splash-sub">C:\WORKBENCH\SYSTEM</div>
        <div className="tw34-progress">
          <span style={cssVars({ "--tw34-fill": isRevealed(beat, 2) ? "92%" : "58%" })} />
        </div>
      </div>
      <div className="tw34-boot-side">
        <PanelLines panel={sceneCopy.panels[0]} beat={beat} />
        <CommandLines lines={sceneCopy.commands} beat={beat} />
      </div>
      <div className="tw34-boot-meters">
        {sceneCopy.metrics.map((metric) => (
          <MetricBar key={metric.label} metric={metric} />
        ))}
      </div>
    </div>
  );
}

function DesktopBody({ sceneCopy, beat }: { sceneCopy: SceneCopy; beat: number }) {
  return (
    <div className="tw34-body tw34-desktop-body">
      {sceneCopy.panels.map((panel, index) => (
        <div
          key={panel.title}
          className={revealClass(beat, index, cx("tw34-floating-slot", `tw34-float-${index + 1}`))}
          data-beat-layout-item="true"
        >
          <RetroWindow title={panel.title} icon={index === 0 ? "C" : index === 1 ? "P" : "T"} className="tw34-floating-window">
            <ul className="tw34-lines">
              {panel.lines.map((line) => (
                <li key={line}>
                  <span className="tw34-chevron">»</span>
                  <span>{line}</span>
                </li>
              ))}
            </ul>
            {sceneCopy.metrics[index] && <MetricBar metric={sceneCopy.metrics[index]} />}
          </RetroWindow>
        </div>
      ))}
      <CommandLines lines={sceneCopy.commands} beat={beat} />
    </div>
  );
}

function ConflictDialog({ sceneCopy, beat }: { sceneCopy: SceneCopy; beat: number }) {
  if (!sceneCopy.dialog) return null;
  return (
    <div className={revealClass(beat, 1, "tw34-dialog")} data-beat-layout-item="true">
      <div className="tw34-dialog-title">
        <span>!</span>
        <span>{sceneCopy.dialog.title}</span>
      </div>
      <div className="tw34-dialog-body">
        <div className="tw34-warning-icon">!</div>
        <div>
          <strong>{sceneCopy.dialog.message}</strong>
          <p>{sceneCopy.dialog.detail}</p>
        </div>
      </div>
      <div className="tw34-dialog-buttons">
        <span className={cx("tw34-button-face", isRevealed(beat, 2) && "tw34-button-active")}>
          {sceneCopy.dialog.primary}
        </span>
        <span className="tw34-button-face">{sceneCopy.dialog.secondary}</span>
      </div>
    </div>
  );
}

function ConflictBody({ sceneCopy, beat }: { sceneCopy: SceneCopy; beat: number }) {
  return (
    <div className="tw34-body tw34-conflict-body">
      <div className="tw34-conflict-panels">
        {sceneCopy.panels.map((panel, index) => (
          <PanelLines key={panel.title} panel={panel} beat={Math.min(beat + index, 2)} />
        ))}
      </div>
      <div className="tw34-conflict-side" data-beat-layout-item="true">
        {sceneCopy.metrics.map((metric) => (
          <MetricBar key={metric.label} metric={metric} />
        ))}
        <CommandLines lines={sceneCopy.commands} beat={beat} />
      </div>
      <ConflictDialog sceneCopy={sceneCopy} beat={beat} />
    </div>
  );
}

function WorkflowBody({ sceneCopy, beat }: { sceneCopy: SceneCopy; beat: number }) {
  return (
    <div className="tw34-body tw34-workflow-body">
      <div className="tw34-step-rail" data-beat-layout-item="true">
        {sceneCopy.steps.map((step, index) => (
          <div
            key={step.label}
            className={revealClass(beat, Math.max(0, index - 1), "tw34-step-card")}
            data-beat-layout-item="true"
          >
            <ToneLight tone={step.tone} />
            <span className="tw34-step-label">{step.label}</span>
            <span className="tw34-step-detail">{step.detail}</span>
          </div>
        ))}
      </div>
      <div className="tw34-workflow-grid">
        <PanelLines panel={sceneCopy.panels[0]} beat={beat} />
        <PanelLines panel={sceneCopy.panels[1]} beat={beat} />
        <div className="tw34-metric-stack" data-beat-layout-item="true">
          {sceneCopy.metrics.map((metric) => (
            <MetricBar key={metric.label} metric={metric} />
          ))}
        </div>
      </div>
      <CommandLines lines={sceneCopy.commands} beat={beat} />
    </div>
  );
}

function ShutdownBody({ sceneCopy, beat }: { sceneCopy: SceneCopy; beat: number }) {
  return (
    <div className="tw34-body tw34-shutdown-body">
      <div className="tw34-dim-windows" data-beat-layout-item="true">
        {sceneCopy.panels.map((panel, index) => (
          <div key={panel.title} className={revealClass(beat, index, `tw34-dim-window tw34-dim-${index + 1}`)}>
            <PanelLines panel={panel} beat={beat} />
          </div>
        ))}
      </div>
      <div className="tw34-shutdown-dialog" data-beat-layout-item="true">
        <ConflictDialog sceneCopy={sceneCopy} beat={beat} />
      </div>
      <div className="tw34-power-strip" data-beat-layout-item="true">
        {sceneCopy.steps.map((step, index) => (
          <div key={step.label} className={revealClass(beat, index, "tw34-power-row")}>
            <ToneLight tone={step.tone} />
            <span>{step.label}</span>
            <span>{step.detail}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SceneBody({ sceneCopy, beat }: { sceneCopy: SceneCopy; beat: number }) {
  if (sceneCopy.id === 1) return <BootBody sceneCopy={sceneCopy} beat={beat} />;
  if (sceneCopy.id === 2) return <DesktopBody sceneCopy={sceneCopy} beat={beat} />;
  if (sceneCopy.id === 3) return <ConflictBody sceneCopy={sceneCopy} beat={beat} />;
  if (sceneCopy.id === 4) return <WorkflowBody sceneCopy={sceneCopy} beat={beat} />;
  return <ShutdownBody sceneCopy={sceneCopy} beat={beat} />;
}

function ScenePanel({
  sceneId,
  beat,
  language,
  isActive,
}: {
  sceneId: number;
  beat: number;
  language: Lang;
  isActive: boolean;
}) {
  const sceneCopy = getSceneCopy(language, sceneId);
  const activeBeat = clampBeat(sceneCopy, beat);

  return (
    <section
      className={cx("tw34-scene", `tw34-scene-${sceneId}`)}
      data-active={isActive ? "true" : "false"}
      data-beat-layout-container="true"
      data-beat-layout-mode="reserved"
    >
      <RetroWindow title={sceneCopy.file} icon={sceneCopy.icon} className="tw34-main-window">
        <SceneHeader sceneCopy={sceneCopy} beat={activeBeat} language={language} />
        <SceneBody sceneCopy={sceneCopy} beat={activeBeat} />
        <StatusFooter sceneCopy={sceneCopy} beat={activeBeat} />
      </RetroWindow>
    </section>
  );
}

function Taskbar({
  scene,
  language,
  onNavigate,
}: {
  scene: number;
  language: Lang;
  onNavigate?: (scene: number, beat: number) => void;
}) {
  const copy = COPY[language];

  return (
    <nav
      className="tw34-taskbar"
      aria-label={copy.navLabel}
      data-topic-navigation="true"
      data-navigation-geometry="edge-scale"
      data-navigation-carrier="toolchain-taskbar"
      data-navigation-invocation="persistent"
      data-navigation-feedback="mechanical-displacement"
    >
      <button type="button" className="tw34-start-button" onClick={() => onNavigate?.(1, 0)}>
        {copy.start}
      </button>
      <div className="tw34-task-buttons">
        {SCENE_IDS.map((sceneId, index) => (
          <button
            key={sceneId}
            type="button"
            className={cx("tw34-task-button", scene === sceneId && "tw34-task-button-active")}
            aria-current={scene === sceneId ? "page" : undefined}
            onClick={() => onNavigate?.(sceneId, 0)}
          >
            <span className="tw34-task-index">{sceneId}</span>
            <span>{copy.sceneLabels[index]}</span>
          </button>
        ))}
      </div>
      <div className="tw34-tray">
        <ToneLight tone={scene === 3 ? "red" : scene === 5 ? "cyan" : "green"} />
        <span>{copy.tray}</span>
      </div>
    </nav>
  );
}

function buildMetadata(lang: Lang): TopicMetadata {
  const copy = COPY[lang];

  return {
    theme: lang === "zh" ? "工具链桌面" : "The Toolchain Desktop",
    densityLabel: lang === "zh" ? "密集应用界面" : "Dense App UI",
    heroScene: 3,
    colors: {
      bg: "#bdbdb4",
      ink: "#111111",
      panel: "#f5f1df",
    },
    typography: {
      header: "Tahoma Bold",
      body: "Tahoma Regular",
    },
    tags: [
      "retro",
      "windows",
      "toolchain",
      "beveled",
      "desktop",
      "dense",
      "taskbar",
    ],
    fonts: ["Tahoma", "Arial", "cjk:Noto Sans SC"],
    scenes: SCENE_IDS.map((id) => {
      const sceneCopy = copy.scenes[id];
      return {
        id,
        title: sceneCopy.title,
        beats: sceneCopy.beats,
      };
    }),
  };
}

function TopicStage({
  scene,
  beat,
  language,
  isThumbnail,
  reducedMotion,
  onNavigate,
}: TopicStageProps) {
  const motionOff = reducedMotion || isThumbnail;

  return (
    <Fragment>
      <style>{STYLE_34_CSS}</style>
      <div
        className="tw34-root"
        data-topic-id="toolchain-desk"
        data-motion={motionOff ? "off" : "on"}
        data-thumbnail={isThumbnail ? "true" : "false"}
      >
        <div className="tw34-desktop">
          <SpatialSceneTrack
            scene={scene}
            beat={beat}
            transitionKind="hard-cut"
            transitionMap={TRANSITION_MAP}
            transitionDurationMs={520}
            reducedMotion={motionOff}
            beatLayoutModes={BEAT_LAYOUT_MODES}
            className="tw34-track"
            renderScene={(sceneId, sceneBeat, isActive) => (
              <ScenePanel
                sceneId={sceneId}
                beat={sceneBeat}
                language={language}
                isActive={isActive}
              />
            )}
          />
        </div>
        {!isThumbnail && <Taskbar scene={scene} language={language} onNavigate={onNavigate} />}
      </div>
    </Fragment>
  );
}

const metadata = {
  en: buildMetadata("en"),
  zh: buildMetadata("zh"),
};

export default defineTopic({
  id: "toolchain-desk",
  styleId: "retro-windows",
  title: {
    en: "Toolchain Desk",
    zh: "工具桌面",
  },
  modelId: "GPT 5.5",
  Stage: TopicStage,
  metadata,
  navigation: {
    geometry: "edge-scale",
    carrier: "toolchain-taskbar",
    invocation: "persistent",
    feedback: "mechanical-displacement",
  },
  transitionScore: TRANSITION_SCORE,
  evidence: {
    kind: "illustrative",
    boundary: {
      en: "Illustrative toolchain desktop: tool names, commands, workflow states, and outcomes are presentation examples, not a live development environment.",
      zh: "示例工具链桌面：其中工具名称、命令、工作流状态和结果均为演示内容，并非实时开发环境。",
    },
    display: "envelope",
  },
});

const STYLE_34_CSS = `
.tw34-root {
  --tw34-gray: #c8c8be;
  --tw34-gray-dark: #8b8b82;
  --tw34-gray-mid: #adada3;
  --tw34-gray-shadow: #5d5d56;
  --tw34-ink: #111111;
  --tw34-paper: #f5f1df;
  --tw34-navy: #001a63;
  --tw34-navy-hi: #0a2f86;
  --tw34-green: #0a8a2a;
  --tw34-red: #b31818;
  --tw34-yellow: #d1a216;
  --tw34-cyan: #148f9e;
  container-type: size;
  position: relative;
  width: 100cqw;
  height: 100cqh;
  overflow: hidden;
  color: var(--tw34-ink);
  background:
    repeating-linear-gradient(45deg, rgba(255,255,255,0.08) 0, rgba(255,255,255,0.08) 0.16cqw, transparent 0.16cqw, transparent 1.8cqw),
    #bdbdb4;
  font-family: "MS Sans Serif", Tahoma, Arial, "PingFang SC", "Microsoft YaHei", sans-serif;
}

.tw34-root *,
.tw34-root *::before,
.tw34-root *::after {
  box-sizing: border-box;
  letter-spacing: 0;
}

.tw34-root::after {
  content: "";
  position: absolute;
  inset: 0;
  z-index: 20;
  pointer-events: none;
  opacity: 0.18;
  background: repeating-linear-gradient(to bottom, rgba(0,0,0,0.16) 0, rgba(0,0,0,0.16) 0.12cqh, transparent 0.12cqh, transparent 0.48cqh);
}

.tw34-root[data-motion="off"] *,
.tw34-root[data-motion="off"] *::before,
.tw34-root[data-motion="off"] *::after {
  transition-duration: 0s !important;
  animation-duration: 0s !important;
}

.tw34-desktop {
  position: absolute;
  inset: 0;
  padding: 2.4cqh 2.1cqw 7.8cqh;
}

.tw34-root[data-thumbnail="true"] .tw34-desktop {
  padding: 2.1cqh 2cqw;
}

.tw34-track {
  width: 100%;
  height: 100%;
}

.tw34-scene {
  position: relative;
  width: 100%;
  height: 100%;
}

.tw34-window {
  position: relative;
  background: var(--tw34-gray);
  border: 0.16cqw solid var(--tw34-gray-shadow);
  box-shadow:
    inset 0.2cqw 0.2cqw 0 #ffffff,
    inset -0.2cqw -0.2cqw 0 #6f6f67;
  overflow: hidden;
}

.tw34-main-window {
  position: absolute;
  inset: 0;
  display: grid;
  grid-template-rows: 4.8cqh 1fr;
}

.tw34-titlebar {
  min-height: 4.8cqh;
  display: grid;
  grid-template-columns: 2.6cqw 1fr 7.4cqw;
  align-items: center;
  gap: 0.6cqw;
  padding: 0.55cqh 0.7cqw;
  color: #ffffff;
  background: linear-gradient(to right, var(--tw34-navy), var(--tw34-navy-hi));
  font-weight: 700;
  line-height: 1;
}

.tw34-title-icon {
  display: grid;
  place-items: center;
  width: 1.8cqw;
  height: 2.6cqh;
  color: var(--tw34-navy);
  background: #f5f1df;
  border: 0.12cqw solid #ffffff;
  box-shadow:
    inset -0.14cqw -0.14cqw 0 #777770,
    inset 0.14cqw 0.14cqw 0 #ffffff;
  font-size: 1.05cqw;
}

.tw34-title-text {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-size: 1.32cqw;
}

.tw34-controls {
  display: grid;
  grid-template-columns: repeat(3, 1.65cqw);
  justify-content: end;
  gap: 0.36cqw;
}

.tw34-controls span {
  width: 1.65cqw;
  height: 2.3cqh;
  background: var(--tw34-gray);
  border: 0.12cqw solid #3f3f39;
  box-shadow:
    inset 0.14cqw 0.14cqw 0 #ffffff,
    inset -0.14cqw -0.14cqw 0 #74746d;
}

.tw34-window-body {
  min-height: 0;
  display: grid;
  grid-template-rows: 17.8cqh 1fr 7.6cqh;
}

.tw34-command-band {
  display: grid;
  grid-template-columns: 1fr 16cqw;
  gap: 1.2cqw;
  padding: 2.1cqh 2cqw 1.5cqh;
  border-bottom: 0.18cqw solid var(--tw34-gray-shadow);
  box-shadow: inset 0 -0.18cqw 0 #ffffff;
}

.tw34-copy-block {
  min-width: 0;
}

.tw34-kicker {
  display: flex;
  align-items: center;
  gap: 0.55cqw;
  margin-bottom: 1cqh;
  font-size: 1.02cqw;
  font-weight: 700;
  text-transform: uppercase;
}

.tw34-command-band h1 {
  margin: 0;
  color: var(--tw34-navy);
  font-size: 3.05cqw;
  line-height: 1;
  font-weight: 800;
}

.tw34-command-band p {
  width: 62cqw;
  margin: 1cqh 0 0;
  font-size: 1.22cqw;
  line-height: 1.28;
}

.tw34-beat-box {
  align-self: stretch;
  display: grid;
  grid-template-rows: 3cqh 1fr;
  padding: 1cqh 0.8cqw;
  background: var(--tw34-gray-mid);
  border: 0.14cqw solid var(--tw34-gray-shadow);
  box-shadow:
    inset 0.16cqw 0.16cqw 0 #ffffff,
    inset -0.16cqw -0.16cqw 0 #6f6f67;
}

.tw34-beat-caption {
  font-size: 0.94cqw;
  font-weight: 700;
  text-transform: uppercase;
}

.tw34-beat-markers {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5cqw;
  align-items: center;
}

.tw34-beat-marker {
  display: block;
  height: 2.6cqh;
  background: #e9e7d8;
  border: 0.12cqw solid #464640;
  box-shadow:
    inset 0.14cqw 0.14cqw 0 #777770,
    inset -0.14cqw -0.14cqw 0 #ffffff;
}

.tw34-beat-marker-on {
  background: var(--tw34-navy);
}

.tw34-beat-marker-current {
  outline: 0.22cqw solid var(--tw34-yellow);
  outline-offset: -0.36cqw;
}

.tw34-body {
  min-height: 0;
  padding: 1.8cqh 1.8cqw;
  overflow: hidden;
}

.tw34-status-footer {
  display: grid;
  grid-template-columns: 17cqw 1fr 34cqw;
  align-items: center;
  gap: 1cqw;
  min-height: 7.6cqh;
  padding: 0.8cqh 1cqw;
  background: var(--tw34-gray-mid);
  border-top: 0.18cqw solid #ffffff;
  box-shadow: inset 0 0.18cqw 0 var(--tw34-gray-shadow);
  font-size: 1cqw;
  line-height: 1.18;
}

.tw34-status-footer span {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
}

.tw34-status-footer span:first-child {
  font-weight: 700;
  color: var(--tw34-navy);
}

.tw34-group {
  position: relative;
  min-height: 12cqh;
  padding: 2.5cqh 1cqw 1.2cqh;
  background: var(--tw34-gray);
  border: 0.14cqw solid var(--tw34-gray-shadow);
  box-shadow:
    inset 0.16cqw 0.16cqw 0 #ffffff,
    inset -0.16cqw -0.16cqw 0 #777770;
}

.tw34-group-title {
  position: absolute;
  top: -1.2cqh;
  left: 0.8cqw;
  display: flex;
  align-items: center;
  gap: 0.45cqw;
  padding: 0 0.45cqw;
  background: var(--tw34-gray);
  font-size: 0.95cqw;
  font-weight: 700;
  text-transform: uppercase;
}

.tw34-lines {
  display: grid;
  gap: 0.8cqh;
  margin: 0;
  padding: 0;
  list-style: none;
  font-size: 1.02cqw;
  line-height: 1.18;
}

.tw34-lines li {
  display: grid;
  grid-template-columns: 1.2cqw 1fr;
  gap: 0.4cqw;
  min-width: 0;
}

.tw34-chevron {
  color: var(--tw34-navy);
  font-weight: 700;
}

.tw34-light {
  display: inline-block;
  width: 0.9cqw;
  height: 1.6cqh;
  border: 0.12cqw solid #22221f;
  box-shadow:
    inset 0.12cqw 0.12cqw 0 rgba(255,255,255,0.45),
    inset -0.12cqw -0.12cqw 0 rgba(0,0,0,0.24);
}

.tw34-tone-green {
  background: var(--tw34-green);
}

.tw34-tone-red {
  background: var(--tw34-red);
}

.tw34-tone-yellow {
  background: var(--tw34-yellow);
}

.tw34-tone-cyan {
  background: var(--tw34-cyan);
}

.tw34-tone-navy {
  background: var(--tw34-navy);
}

.tw34-reveal {
  visibility: hidden;
  opacity: 0;
  transform: translateY(0.55cqh);
}

.tw34-root[data-motion="on"] .tw34-reveal {
  transition:
    visibility 120ms steps(1, end),
    opacity 120ms steps(1, end),
    transform 120ms steps(1, end);
}

.tw34-visible {
  visibility: visible;
  opacity: 1;
  transform: translateY(0);
}

.tw34-current {
  color: var(--tw34-navy);
}

.tw34-meter-row {
  display: grid;
  grid-template-columns: 9cqw 1fr;
  align-items: center;
  gap: 0.8cqw;
  min-height: 3.2cqh;
  font-size: 0.95cqw;
  text-transform: uppercase;
}

.tw34-meter-label {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.tw34-meter {
  display: block;
  height: 1.65cqh;
  padding: 0.26cqh 0.18cqw;
  background: #e9e7d8;
  border: 0.12cqw solid #45453f;
  box-shadow:
    inset 0.14cqw 0.14cqw 0 #777770,
    inset -0.14cqw -0.14cqw 0 #ffffff;
}

.tw34-meter-fill {
  display: block;
  width: var(--tw34-fill);
  height: 100%;
}

.tw34-terminal {
  display: grid;
  gap: 0.7cqh;
  padding: 1.2cqh 1cqw;
  color: #0cff64;
  background: #050704;
  border: 0.14cqw solid #3d3d38;
  box-shadow:
    inset 0.18cqw 0.18cqw 0 #1b1b18,
    inset -0.18cqw -0.18cqw 0 #ffffff;
  font-family: "Courier New", monospace;
  font-size: 0.96cqw;
  line-height: 1.18;
}

.tw34-prompt {
  color: var(--tw34-cyan);
}

.tw34-progress {
  height: 2.3cqh;
  padding: 0.3cqh 0.22cqw;
  background: #e9e7d8;
  border: 0.14cqw solid #474741;
  box-shadow:
    inset 0.14cqw 0.14cqw 0 #777770,
    inset -0.14cqw -0.14cqw 0 #ffffff;
}

.tw34-progress span {
  display: block;
  width: var(--tw34-fill);
  height: 100%;
  background: var(--tw34-navy);
}

.tw34-boot-body {
  display: grid;
  grid-template-columns: 45cqw 1fr;
  grid-template-rows: 1fr 12cqh;
  gap: 1.4cqw;
}

.tw34-splash {
  grid-row: 1 / 3;
  display: grid;
  align-content: center;
  gap: 2.6cqh;
  padding: 4cqh 4cqw;
  color: var(--tw34-navy);
  background: var(--tw34-paper);
  border: 0.18cqw solid #4a4a44;
  box-shadow:
    inset 0.18cqw 0.18cqw 0 #777770,
    inset -0.18cqw -0.18cqw 0 #ffffff;
}

.tw34-splash-logo {
  font-size: 3.25cqw;
  font-weight: 800;
  line-height: 1;
}

.tw34-splash-sub {
  color: #111111;
  font-family: "Courier New", monospace;
  font-size: 1.15cqw;
}

.tw34-boot-side {
  display: grid;
  gap: 1.5cqh;
}

.tw34-boot-meters {
  display: grid;
  gap: 0.8cqh;
  align-content: center;
  padding: 1.1cqh 1cqw;
  background: var(--tw34-gray-mid);
  border: 0.14cqw solid #5e5e58;
  box-shadow:
    inset 0.16cqw 0.16cqw 0 #ffffff,
    inset -0.16cqw -0.16cqw 0 #74746d;
}

.tw34-desktop-body {
  position: relative;
}

.tw34-floating-slot {
  position: absolute;
}

.tw34-float-1 {
  left: 2cqw;
  top: 1.5cqh;
  width: 42cqw;
  height: 29cqh;
}

.tw34-float-2 {
  right: 5cqw;
  top: 8cqh;
  width: 34cqw;
  height: 25cqh;
}

.tw34-float-3 {
  left: 19cqw;
  bottom: 8cqh;
  width: 46cqw;
  height: 22cqh;
}

.tw34-floating-window {
  width: 100%;
  height: 100%;
}

.tw34-floating-window .tw34-window-body {
  grid-template-rows: 1fr 6cqh;
  padding: 1.4cqh 1.1cqw;
  gap: 1cqh;
}

.tw34-desktop-body > .tw34-terminal {
  position: absolute;
  right: 2cqw;
  bottom: 2cqh;
  width: 28cqw;
  height: 12cqh;
}

.tw34-conflict-body {
  position: relative;
  display: grid;
  grid-template-columns: 1fr 27cqw;
  gap: 1.5cqw;
}

.tw34-conflict-panels {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.4cqw;
  align-content: start;
}

.tw34-conflict-side {
  display: grid;
  gap: 1.3cqh;
  align-content: start;
}

.tw34-dialog {
  position: absolute;
  left: 20cqw;
  top: 13cqh;
  width: 42cqw;
  min-height: 24cqh;
  z-index: 4;
  background: var(--tw34-gray);
  border: 0.16cqw solid #45453f;
  box-shadow:
    inset 0.2cqw 0.2cqw 0 #ffffff,
    inset -0.2cqw -0.2cqw 0 #6f6f67;
}

.tw34-dialog-title {
  display: grid;
  grid-template-columns: 2cqw 1fr;
  align-items: center;
  gap: 0.6cqw;
  min-height: 4cqh;
  padding: 0.55cqh 0.8cqw;
  color: #ffffff;
  background: var(--tw34-navy);
  font-size: 1.1cqw;
  font-weight: 700;
}

.tw34-dialog-title span:first-child {
  display: grid;
  place-items: center;
  color: #111111;
  background: var(--tw34-yellow);
  border: 0.1cqw solid #111111;
}

.tw34-dialog-body {
  display: grid;
  grid-template-columns: 6cqw 1fr;
  gap: 1cqw;
  padding: 2.2cqh 1.4cqw 1.4cqh;
  font-size: 1.1cqw;
  line-height: 1.2;
}

.tw34-dialog-body p {
  margin: 0.9cqh 0 0;
}

.tw34-warning-icon {
  display: grid;
  place-items: center;
  width: 4.4cqw;
  height: 7.2cqh;
  color: #111111;
  background: var(--tw34-yellow);
  border: 0.14cqw solid #111111;
  font-size: 2.5cqw;
  font-weight: 800;
}

.tw34-dialog-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 1cqw;
  padding: 0 1.4cqw 1.6cqh;
}

.tw34-button-face {
  display: grid;
  place-items: center;
  min-width: 10cqw;
  min-height: 3.8cqh;
  padding: 0.6cqh 0.9cqw;
  background: var(--tw34-gray);
  border: 0.12cqw solid #45453f;
  box-shadow:
    inset 0.16cqw 0.16cqw 0 #ffffff,
    inset -0.16cqw -0.16cqw 0 #777770;
  font-size: 0.98cqw;
  font-weight: 700;
}

.tw34-button-active {
  box-shadow:
    inset 0.16cqw 0.16cqw 0 #777770,
    inset -0.16cqw -0.16cqw 0 #ffffff;
  color: #ffffff;
  background: var(--tw34-navy);
}

.tw34-workflow-body {
  display: grid;
  grid-template-rows: 12cqh 1fr 10cqh;
  gap: 1.4cqh;
}

.tw34-step-rail {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1cqw;
}

.tw34-step-card {
  display: grid;
  grid-template-columns: 1.1cqw 1fr;
  grid-template-rows: 3.2cqh 1fr;
  gap: 0.35cqw 0.55cqw;
  padding: 1cqh 0.9cqw;
  background: var(--tw34-paper);
  border: 0.14cqw solid #474741;
  box-shadow:
    inset 0.16cqw 0.16cqw 0 #ffffff,
    inset -0.16cqw -0.16cqw 0 #777770;
}

.tw34-step-label {
  color: var(--tw34-navy);
  font-size: 1.12cqw;
  font-weight: 800;
}

.tw34-step-detail {
  grid-column: 2;
  font-size: 0.95cqw;
  line-height: 1.15;
}

.tw34-workflow-grid {
  min-height: 0;
  display: grid;
  grid-template-columns: 1fr 1fr 28cqw;
  gap: 1.2cqw;
}

.tw34-metric-stack {
  display: grid;
  align-content: start;
  gap: 1.4cqh;
  padding: 1.3cqh 1cqw;
  background: var(--tw34-gray-mid);
  border: 0.14cqw solid #5e5e58;
  box-shadow:
    inset 0.16cqw 0.16cqw 0 #ffffff,
    inset -0.16cqw -0.16cqw 0 #74746d;
}

.tw34-shutdown-body {
  position: relative;
  background:
    repeating-linear-gradient(0deg, rgba(0,0,0,0.22) 0, rgba(0,0,0,0.22) 0.2cqh, transparent 0.2cqh, transparent 1cqh),
    #5a5a54;
}

.tw34-dim-windows {
  position: absolute;
  inset: 3cqh 3cqw 12cqh 3cqw;
  opacity: 0.62;
}

.tw34-dim-window {
  position: absolute;
  width: 33cqw;
}

.tw34-dim-1 {
  left: 4cqw;
  top: 1cqh;
}

.tw34-dim-2 {
  right: 3cqw;
  top: 9cqh;
}

.tw34-shutdown-dialog .tw34-dialog {
  left: 25cqw;
  top: 10cqh;
}

.tw34-power-strip {
  position: absolute;
  left: 12cqw;
  right: 12cqw;
  bottom: 3cqh;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1cqw;
}

.tw34-power-row {
  display: grid;
  grid-template-columns: 1.2cqw 7cqw 1fr;
  align-items: center;
  gap: 0.6cqw;
  padding: 1cqh 1cqw;
  background: var(--tw34-gray);
  border: 0.14cqw solid #45453f;
  box-shadow:
    inset 0.16cqw 0.16cqw 0 #ffffff,
    inset -0.16cqw -0.16cqw 0 #777770;
  font-size: 0.95cqw;
}

.tw34-taskbar {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10;
  height: 5.8cqh;
  display: grid;
  grid-template-columns: 8.2cqw 1fr 17cqw;
  gap: 0.7cqw;
  align-items: center;
  padding: 0.6cqh 0.7cqw;
  background: var(--tw34-gray);
  border-top: 0.18cqw solid #ffffff;
  box-shadow: inset 0 0.18cqw 0 var(--tw34-gray-shadow);
}

.tw34-start-button,
.tw34-task-button {
  height: 4cqh;
  color: var(--tw34-ink);
  background: var(--tw34-gray);
  border: 0.13cqw solid #45453f;
  box-shadow:
    inset 0.16cqw 0.16cqw 0 #ffffff,
    inset -0.16cqw -0.16cqw 0 #74746d;
  font-family: inherit;
  font-size: 0.95cqw;
  font-weight: 700;
  text-align: left;
}

.tw34-start-button {
  display: grid;
  place-items: center;
  color: #ffffff;
  background: var(--tw34-navy);
}

.tw34-task-buttons {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 0.55cqw;
  min-width: 0;
}

.tw34-task-button {
  display: grid;
  grid-template-columns: 1.9cqw 1fr;
  align-items: center;
  gap: 0.45cqw;
  min-width: 0;
  padding: 0 0.55cqw;
}

.tw34-task-button-active {
  box-shadow:
    inset 0.16cqw 0.16cqw 0 #777770,
    inset -0.16cqw -0.16cqw 0 #ffffff;
  background: #e5e3d5;
}

.tw34-task-index {
  display: grid;
  place-items: center;
  height: 2.4cqh;
  color: #ffffff;
  background: var(--tw34-navy);
}

.tw34-tray {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.6cqw;
  height: 4cqh;
  padding: 0 0.8cqw;
  background: var(--tw34-gray-mid);
  border: 0.13cqw solid #45453f;
  box-shadow:
    inset 0.16cqw 0.16cqw 0 #777770,
    inset -0.16cqw -0.16cqw 0 #ffffff;
  font-size: 0.84cqw;
  font-weight: 700;
  text-transform: uppercase;
}
`;

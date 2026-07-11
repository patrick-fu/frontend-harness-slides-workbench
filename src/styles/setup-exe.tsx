import type { CSSProperties, MouseEvent, ReactNode } from "react";
import type { StyleMetadata } from "../types";
import type { BespokeStyleProps } from "../types";
import { defineStyleTopic } from "./topic";
import { curatedNavigationAttributes } from "./curated-topic-contract";
import SpatialSceneTrack from "./SpatialSceneTrack";
import type { SceneTransitionMap } from "./SpatialSceneTrack";
import styles from "./setup-exe.module.css";

/* ----------------------------------------------------------------------------
 * Bilingual copy (NOT `as const` — that breaks the build)
 * ------------------------------------------------------------------------- */
const COPY = {
  en: {
    name: "Retro Windows",
    topic: "Setup.exe",
    density: "Application-Dense",
    start: "Start",
    clock: "12:00 PM",
    back: "< Back",
    next: "Next >",
    finish: "Finish",
    stepOf: (n: number) => `Step ${n} of 5`,
    s1: {
      file: "SETUP.EXE",
      title: "Welcome",
      action: "Launch Setup",
      splash: "SETUP",
      product: "PIXELWORKS 95",
      version: "Version 3.0 — Install Wizard",
      headline: "Welcome to PixelWorks 95 Setup",
      para: "This wizard installs PixelWorks 95 on your computer. Please close all other applications before continuing.",
      steps: [
        "Review the license agreement",
        "Choose the components to install",
        "Copy program files to disk",
        "Finish and restart the system",
      ],
      status: "READY — press Next to begin.",
    },
    s2: {
      file: "LICENSE.TXT",
      title: "License",
      beats: [
        { action: "Read the agreement", title: "License Agreement", body: "Review the terms below, then tick the box to accept." },
        { action: "Accept the terms", title: "Agreement Accepted", body: "The check is set. The Next button is now enabled." },
      ],
      group: "End User License",
      well: [
        "PIXELWORKS 95 SOFTWARE LICENSE — read carefully before clicking Next.",
        "You are granted one nostalgic license to run this software on a single beige tower. Redistribution on floppy disk is permitted among friends.",
        "This costume is provided AS-IS, with no warranty against rounded corners, soft shadows, or the passage of time.",
      ],
      accept: "I accept the terms of the agreement",
      decline: "I do not accept the terms",
      hintNo: "! You must accept the terms to continue.",
      hintYes: "OK — terms accepted, you may continue.",
    },
    s3: {
      file: "SELECT.INI",
      title: "Components",
      beats: [
        { action: "Keep the core", title: "Core Runtime", body: "Required base files. This component cannot be deselected." },
        { action: "Add the tools", title: "Developer Tools", body: "Compilers, headers, and sample code for building add-ons." },
        { action: "Add the extras", title: "Bonus Themes", body: "Optional wallpapers, event sounds, and animated cursors." },
      ],
      groupSel: "Select Components",
      groupDesc: "Description",
      comps: [
        { name: "Core Runtime", size: "14.2 MB" },
        { name: "Developer Tools", size: "38.6 MB" },
        { name: "Bonus Themes", size: "9.1 MB" },
        { name: "Online Help", size: "4.4 MB" },
      ],
      reqLabel: "Space required",
      availLabel: "Space available",
      avail: "120.0 MB",
      req: ["14.2 MB", "52.8 MB", "61.9 MB"],
      widths: ["12%", "44%", "52%"],
    },
    s4: {
      file: "INSTALL.LOG",
      title: "Installing",
      action: "Copy files to disk",
      copy: "Copying program files...",
      path: "C:\\PROGRA~1\\PIXELW~1\\CORE\\RENDER.DLL",
      statLabels: ["Elapsed", "Remaining", "Files"],
      statVals: ["00:47", "00:18", "612 / 851"],
      percent: "72%",
    },
    s5: {
      file: "FINISH.LOG",
      title: "Finish",
      action: "Complete setup",
      dlgTitle: "SETUP COMPLETE",
      headline: "Installation Complete",
      para: "PixelWorks 95 has been installed successfully. Click OK to close the wizard and return to the desktop.",
      ok: "OK",
    },
  },
  zh: {
    name: "复古 Windows",
    topic: "安装向导",
    density: "应用密集",
    start: "开始",
    clock: "12:00",
    back: "< 上一步",
    next: "下一步 >",
    finish: "完成",
    stepOf: (n: number) => `步骤 ${n} / 5`,
    s1: {
      file: "SETUP.EXE",
      title: "欢迎",
      action: "启动安装程序",
      splash: "安装",
      product: "PIXELWORKS 95",
      version: "版本 3.0 — 安装向导",
      headline: "欢迎使用 PixelWorks 95 安装向导",
      para: "此向导将在您的计算机上安装 PixelWorks 95。继续之前请关闭其他所有应用程序。",
      steps: [
        "阅读许可协议",
        "选择要安装的组件",
        "将程序文件复制到磁盘",
        "完成安装并重启系统",
      ],
      status: "就绪 — 按下一步开始。",
    },
    s2: {
      file: "LICENSE.TXT",
      title: "许可",
      beats: [
        { action: "阅读协议", title: "许可协议", body: "请阅读下方条款，然后勾选复选框以接受。" },
        { action: "接受条款", title: "协议已接受", body: "复选框已勾选，下一步按钮现在可用。" },
      ],
      group: "最终用户许可",
      well: [
        "PIXELWORKS 95 软件许可 — 点击下一步前请仔细阅读。",
        "您获得一份怀旧许可，可在一台米色机箱上运行本软件。允许朋友间以软盘形式互相分享。",
        "本套装按“原样”提供，不对圆角、柔和阴影或时间流逝作任何担保。",
      ],
      accept: "我接受协议中的条款",
      decline: "我不接受这些条款",
      hintNo: "! 必须接受条款才能继续。",
      hintYes: "OK — 条款已接受，可以继续。",
    },
    s3: {
      file: "SELECT.INI",
      title: "组件",
      beats: [
        { action: "保留核心", title: "核心运行库", body: "必需的基础文件，此组件无法取消选择。" },
        { action: "添加工具", title: "开发者工具", body: "用于构建插件的编译器、头文件与示例代码。" },
        { action: "添加附加项", title: "额外主题", body: "可选的壁纸、事件声音与动态光标。" },
      ],
      groupSel: "选择组件",
      groupDesc: "说明",
      comps: [
        { name: "核心运行库", size: "14.2 MB" },
        { name: "开发者工具", size: "38.6 MB" },
        { name: "额外主题", size: "9.1 MB" },
        { name: "在线帮助", size: "4.4 MB" },
      ],
      reqLabel: "所需空间",
      availLabel: "可用空间",
      avail: "120.0 MB",
      req: ["14.2 MB", "52.8 MB", "61.9 MB"],
      widths: ["12%", "44%", "52%"],
    },
    s4: {
      file: "INSTALL.LOG",
      title: "安装中",
      action: "复制文件到磁盘",
      copy: "正在复制程序文件...",
      path: "C:\\PROGRA~1\\PIXELW~1\\CORE\\RENDER.DLL",
      statLabels: ["已用", "剩余", "文件"],
      statVals: ["00:47", "00:18", "612 / 851"],
      percent: "72%",
    },
    s5: {
      file: "FINISH.LOG",
      title: "完成",
      action: "完成安装",
      dlgTitle: "安装完成",
      headline: "安装已完成",
      para: "PixelWorks 95 已成功安装。点击 OK 关闭向导并返回桌面。",
      ok: "OK",
    },
  },
};

type Copy = typeof COPY.en;

/* ----------------------------------------------------------------------------
 * Transitions — blocky by default; a glitch flicker into the install step
 * ------------------------------------------------------------------------- */
const TRANSITIONS: SceneTransitionMap = {
  "1->2": "hard-cut",
  "2->3": "hard-cut",
  "3->4": "glitch",
  "4->5": "hard-cut",
};

/* ----------------------------------------------------------------------------
 * Chrome primitives
 * ------------------------------------------------------------------------- */
function TitleBar({ file }: { file: string }): ReactNode {
  return (
    <div className={styles.titleBar}>
      <span className={styles.titleIcon} aria-hidden />
      <span className={styles.titleText}>{file}</span>
      <span className={styles.titleButtons}>
        <span className={styles.titleBtn}>_</span>
        <span className={styles.titleBtn}>□</span>
        <span className={styles.titleBtn}>✕</span>
      </span>
    </div>
  );
}

interface NavProps {
  scene: number;
  copy: Copy;
  isThumbnail: boolean;
  onNavigate?: (scene: number, beat: number) => void;
}

function WizardNav({ scene, copy, isThumbnail, onNavigate }: NavProps): ReactNode {
  if (isThumbnail) return null;
  const canBack = scene > 1;
  const isLast = scene >= 5;
  const jump = (target: number) => (e: MouseEvent) => {
    e.stopPropagation();
    onNavigate?.(target, 0);
  };
  return (
    <div {...curatedNavigationAttributes("retro-windows", "setup-exe")} className={styles.nav}>
      <span className={styles.navStep}>{copy.stepOf(scene)}</span>
      <div className={styles.navBtns}>
        <button
          type="button"
          className={`${styles.navBtn} ${canBack ? "" : styles.navBtnDisabled}`}
          onClick={canBack ? jump(scene - 1) : (e) => e.stopPropagation()}
        >
          {copy.back}
        </button>
        <button
          type="button"
          className={`${styles.navBtn} ${styles.navBtnPrimary} ${isLast ? styles.navBtnDisabled : ""}`}
          onClick={isLast ? (e) => e.stopPropagation() : jump(scene + 1)}
        >
          {isLast ? copy.finish : copy.next}
        </button>
      </div>
    </div>
  );
}

function Frame({
  scene,
  file,
  copy,
  isThumbnail,
  onNavigate,
  children,
}: {
  scene: number;
  file: string;
  copy: Copy;
  isThumbnail: boolean;
  onNavigate?: (scene: number, beat: number) => void;
  children: ReactNode;
}): ReactNode {
  return (
    <div className={styles.window}>
      <TitleBar file={file} />
      <div className={styles.body}>{children}</div>
      <WizardNav
        scene={scene}
        copy={copy}
        isThumbnail={isThumbnail}
        onNavigate={onNavigate}
      />
    </div>
  );
}

/* ----------------------------------------------------------------------------
 * Scenes
 * ------------------------------------------------------------------------- */
function SceneWelcome({ copy }: { copy: Copy }): ReactNode {
  const s = copy.s1;
  return (
    <div className={styles.welcomeGrid}>
      <div className={styles.splash}>
        <div className={styles.splashWord}>{s.splash}</div>
        <div className={styles.splashProduct}>{s.product}</div>
        <div className={styles.splashVer}>{s.version}</div>
      </div>
      <div className={styles.welcomeCol}>
        <h1 className={styles.headline}>{s.headline}</h1>
        <p className={styles.para}>{s.para}</p>
        <div className={styles.stepList}>
          {s.steps.map((step) => (
            <div key={step} className={styles.chevRow}>
              <span className={styles.chev}>&gt;&gt;</span>
              <span>{step}</span>
            </div>
          ))}
        </div>
        <div className={styles.statusStrip}>
          <span className={styles.led} style={{ background: "var(--ok)" }} />
          <span>{s.status}</span>
        </div>
      </div>
    </div>
  );
}

function SceneLicense({ copy, beat }: { copy: Copy; beat: number }): ReactNode {
  const s = copy.s2;
  const accepted = beat >= 1;
  return (
    <div
      className={styles.licenseCol}
      data-beat-layout-container="true"
      data-beat-layout-mode="reserved"
    >
      <div
        className={`${styles.well} ${styles.licenseWell}`}
        data-beat-layout-item="true"
      >
        {s.well.map((line, i) => (
          <p key={i}>{line}</p>
        ))}
      </div>
      <div
        className={`${styles.groupBox} ${styles.optionBox}`}
        data-beat-layout-item="true"
      >
        <span className={styles.groupTitle}>{s.group}</span>
        <div className={styles.optionRows}>
          <div className={`${styles.optionRow} ${accepted ? styles.optionRowActive : ""}`}>
            <span className={styles.checkbox}>
              <span className={styles.checkMark} style={{ opacity: accepted ? 1 : 0 }}>
                x
              </span>
            </span>
            <span>{s.accept}</span>
          </div>
          <div className={styles.optionRow}>
            <span className={styles.checkbox}>
              <span className={styles.checkMark} style={{ opacity: 0 }}>
                x
              </span>
            </span>
            <span>{s.decline}</span>
          </div>
          <div className={`${styles.optionHint} ${accepted ? styles.optionHintOk : ""}`}>
            {accepted ? s.hintYes : s.hintNo}
          </div>
        </div>
      </div>
    </div>
  );
}

function SceneComponents({ copy, beat }: { copy: Copy; beat: number }): ReactNode {
  const s = copy.s3;
  const active = Math.min(beat, 2);
  const checked = (i: number) => i === 0 || i <= active;
  return (
    <div
      className={styles.compGrid}
      data-beat-layout-container="true"
      data-beat-layout-mode="reserved"
    >
      <div className={`${styles.groupBox} ${styles.compList}`} data-beat-layout-item="true">
        <span className={styles.groupTitle}>{s.groupSel}</span>
        {s.comps.map((comp, i) => (
          <div
            key={comp.name}
            className={`${styles.compRow} ${i === active ? styles.compRowActive : ""}`}
          >
            <span className={styles.chev} aria-hidden>
              &gt;
            </span>
            <span className={styles.checkbox}>
              <span className={styles.checkMark} style={{ opacity: checked(i) ? 1 : 0 }}>
                x
              </span>
            </span>
            <span className={styles.compName}>{comp.name}</span>
            <span className={styles.compSize}>{comp.size}</span>
          </div>
        ))}
      </div>
      <div className={styles.compRight} data-beat-layout-item="true">
        <div className={`${styles.groupBox} ${styles.descBox}`}>
          <span className={styles.groupTitle}>{s.groupDesc}</span>
          <p className={styles.descText}>{s.beats[active].body}</p>
        </div>
        <div className={`${styles.groupBox} ${styles.kpiStrip}`}>
          <span className={styles.groupTitle}>DISK</span>
          <div className={styles.kpiRow}>
            <span>{s.reqLabel}</span>
            <span className={styles.kpiVal} style={{ color: "var(--navy)" }}>
              {s.req[active]}
            </span>
          </div>
          <div className={styles.diskBar}>
            <div className={styles.diskFill} style={{ width: s.widths[active] }} />
          </div>
          <div className={styles.kpiRow}>
            <span>{s.availLabel}</span>
            <span className={styles.kpiVal} style={{ color: "var(--ok)" }}>
              {s.avail}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function SceneInstalling({ copy }: { copy: Copy }): ReactNode {
  const s = copy.s4;
  const pctStyle = { ["--pct"]: s.percent } as CSSProperties;
  return (
    <div className={styles.installWrap}>
      <div className={styles.installGroup}>
        <div className={styles.copyLine}>{s.copy}</div>
        <div className={styles.filePath}>{s.path}</div>
      </div>
      <div>
        <div className={styles.percentRow}>
          <span className={styles.copyLine}>PROGRESS</span>
          <span className={styles.percentBig}>{s.percent}</span>
        </div>
        <div className={styles.progressOuter}>
          <div className={styles.progressFill} style={pctStyle} />
        </div>
      </div>
      <div className={styles.installStats}>
        {s.statLabels.map((label, i) => (
          <div key={label} className={styles.statCell}>
            <span className={styles.statLabel}>{label}</span>
            <span className={styles.statValue}>{s.statVals[i]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SceneFinish({
  copy,
  isThumbnail,
  onNavigate,
}: {
  copy: Copy;
  isThumbnail: boolean;
  onNavigate?: (scene: number, beat: number) => void;
}): ReactNode {
  const s = copy.s5;
  return (
    <div className={styles.finishStage}>
      <div className={styles.finishBackdrop} aria-hidden>
        <div className={styles.groupBox} style={{ flex: 1 }}>
          <span className={styles.groupTitle}>LOG</span>
        </div>
        <div className={styles.groupBox} style={{ flex: 1 }}>
          <span className={styles.groupTitle}>SUMMARY</span>
        </div>
      </div>
      <div className={styles.dialog}>
        <div className={styles.dialogTitle}>{s.dlgTitle}</div>
        <div className={styles.dialogBody}>
          <span className={styles.checkIcon}>√</span>
          <div className={styles.dialogTextCol}>
            <h2 className={styles.dialogHeadline}>{s.headline}</h2>
            <p className={styles.dialogPara}>{s.para}</p>
          </div>
        </div>
        <div className={styles.dialogButtons}>
          <button
            type="button"
            className={styles.okBtn}
            onClick={(e) => {
              e.stopPropagation();
              if (!isThumbnail) onNavigate?.(1, 0);
            }}
          >
            {s.ok}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------------------
 * Root component
 * ------------------------------------------------------------------------- */
function SetupExeV3({
  scene,
  beat,
  language,
  isThumbnail,
  reducedMotion,
  onNavigate,
}: BespokeStyleProps): ReactNode {
  const copy = COPY[language];
  const reduced = reducedMotion || isThumbnail;

  const fileFor = (id: number): string =>
    [copy.s1.file, copy.s2.file, copy.s3.file, copy.s4.file, copy.s5.file][id - 1];

  const renderScene = (sceneId: number, sceneBeat: number): ReactNode => {
    let content: ReactNode = null;
    if (sceneId === 1) content = <SceneWelcome copy={copy} />;
    else if (sceneId === 2) content = <SceneLicense copy={copy} beat={sceneBeat} />;
    else if (sceneId === 3) content = <SceneComponents copy={copy} beat={sceneBeat} />;
    else if (sceneId === 4) content = <SceneInstalling copy={copy} />;
    else content = <SceneFinish copy={copy} isThumbnail={isThumbnail} onNavigate={onNavigate} />;
    return (
      <Frame
        scene={sceneId}
        file={fileFor(sceneId)}
        copy={copy}
        isThumbnail={isThumbnail}
        onNavigate={onNavigate}
      >
        {content}
      </Frame>
    );
  };

  return (
    <div className={styles.root} data-reduced={reduced ? "true" : undefined}>
      <SpatialSceneTrack
        scene={scene}
        beat={beat}
        transitionKind="hard-cut"
        transitionMap={TRANSITIONS}
        reducedMotion={reduced}
        beatLayoutModes={{ 2: "reserved", 3: "reserved" }}
        renderScene={(sceneId, sceneBeat) => renderScene(sceneId, sceneBeat)}
      />
      <div className={styles.taskbar} aria-hidden>
        <div className={styles.startBtn}>
          <span className={styles.startLogo} />
          <span>{copy.start}</span>
        </div>
        <div className={styles.taskItem}>
          <span className={styles.taskDot} style={{ background: "var(--navy)" }} />
          <span>{fileFor(scene)}</span>
        </div>
        <div className={styles.clock}>{copy.clock}</div>
      </div>
      <div className={styles.scanlines} aria-hidden />
    </div>
  );
}

/* ----------------------------------------------------------------------------
 * Metadata
 * ------------------------------------------------------------------------- */
export function getMetadata(lang: "en" | "zh"): StyleMetadata {
  const c = COPY[lang];
  return {
    id: "retro-windows",
    band: "contemporary-digital",
    name: c.name,
    theme: c.topic,
    densityLabel: c.density,
    heroScene: 1,
    colors: { bg: "#7e7d76", ink: "#16150f", panel: "#c4c1b8" },
    typography: { header: "Tahoma / MS Sans Serif", body: "VT323 / Tahoma" },
    tags: ["playful", "nostalgic", "dense", "system-gray", "navy", "blocky-motion", "retro-ui", "wizard"],
    fonts: [
      "Tahoma",
      "VT323:wght@400",
      "Press Start 2P:wght@400",
      "cjk:Noto Sans SC:wght@400;700",
    ],
    scenes: [
      {
        id: 1,
        title: c.s1.title,
        beats: [{ id: 0, action: c.s1.action, title: c.s1.headline, body: c.s1.para }],
      },
      {
        id: 2,
        title: c.s2.title,
        beats: c.s2.beats.map((b, i) => ({ id: i, action: b.action, title: b.title, body: b.body })),
      },
      {
        id: 3,
        title: c.s3.title,
        beats: c.s3.beats.map((b, i) => ({ id: i, action: b.action, title: b.title, body: b.body })),
      },
      {
        id: 4,
        title: c.s4.title,
        beats: [{ id: 0, action: c.s4.action, title: c.s4.title, body: c.s4.copy }],
      },
      {
        id: 5,
        title: c.s5.title,
        beats: [{ id: 0, action: c.s5.action, title: c.s5.headline, body: c.s5.para }],
      },
    ],
  };
}

export default SetupExeV3;

export const SetupExeTopic = defineStyleTopic({
  id: "setup-exe",
  topic: { en: COPY.en.topic, zh: COPY.zh.topic },
  model: "GPT 5.6 Sol",
  component: SetupExeV3,
  getMetadata,
});

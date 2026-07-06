import React, { useEffect, useState, useCallback, useRef } from "react";
import type { BespokeStyleProps, StyleMetadata } from "../types";
import styles from "./34-retro-os-95.module.css";
import { useFLIP } from "../hooks/useFLIP";

// ─── Font Injection ────────────────────────────────────────────────────────

function useFonts() {
  useEffect(() => {
    const id = "style-34-fonts";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap";
    document.head.appendChild(link);
  }, []);
}

// ─── Content ────────────────────────────────────────────────────────────────

interface SceneContent {
  en: Record<string, unknown>;
  zh: Record<string, unknown>;
}

const SCENES: Record<number, SceneContent> = {
  1: {
    en: {
      windowTitle: "Welcome.exe",
      title: "Retro OS 95",
      subtitle: "A nostalgic journey through classic computing",
      icons: [
        { img: "🖥️", label: "My Computer" },
        { img: "📁", label: "My Documents" },
        { img: "🗑️", label: "Recycle Bin" },
        { img: "🌐", label: "Internet" },
      ],
    },
    zh: {
      windowTitle: "欢迎.exe",
      title: "复古 OS 95",
      subtitle: "一段经典计算的怀旧之旅",
      icons: [
        { img: "🖥️", label: "我的电脑" },
        { img: "📁", label: "我的文档" },
        { img: "🗑️", label: "回收站" },
        { img: "🌐", label: "网上邻居" },
      ],
    },
  },
  2: {
    en: {
      windowTitle: "Exploring - C:\\Nostalgia",
      address: "C:\\Nostalgia\\Memories",
      sidebar: [
        { img: "🖥️", label: "Desktop" },
        { img: "📁", label: "My Documents" },
        { img: "💾", label: "Floppy (A:)" },
        { img: "💿", label: "CD-ROM (D:)" },
        { img: "🗑️", label: "Recycle Bin" },
      ],
      files: [
        { img: "📄", label: "Solitaire.sav" },
        { img: "🖼️", label: "Clouds.bmp" },
        { img: "🎵", label: "tada.wav" },
        { img: "📁", label: "Programs" },
        { img: "📁", label: "Games" },
        { img: "📄", label: "Readme.txt" },
        { img: "🖼️", label: "Setup.bmp" },
        { img: "💾", label: "Backup.img" },
      ],
    },
    zh: {
      windowTitle: "资源管理器 - C:\\怀旧",
      address: "C:\\怀旧\\回忆",
      sidebar: [
        { img: "🖥️", label: "桌面" },
        { img: "📁", label: "我的文档" },
        { img: "💾", label: "软盘 (A:)" },
        { img: "💿", label: "光盘 (D:)" },
        { img: "🗑️", label: "回收站" },
      ],
      files: [
        { img: "📄", label: "纸牌.sav" },
        { img: "🖼️", label: "蓝天白云.bmp" },
        { img: "🎵", label: "tada.wav" },
        { img: "📁", label: "程序" },
        { img: "📁", label: "游戏" },
        { img: "📄", label: "说明.txt" },
        { img: "🖼️", label: "安装.bmp" },
        { img: "💾", label: "备份.img" },
      ],
    },
  },
  3: {
    en: {
      windowTitle: "System Message",
      icon: "💡",
      text: "Did you know? The first version of this OS ran on a 66MHz 486 with 8MB RAM.",
      details: "Minimum requirements: 386DX/25, 4MB RAM, 50MB HDD. Recommended: 486/66, 8MB RAM, 120MB HDD. Installation time: ~30 minutes from 22 floppy disks.",
      buttons: ["OK", "Details >>"],
    },
    zh: {
      windowTitle: "系统消息",
      icon: "💡",
      text: "你知道吗？这个系统的初代版本运行在 66MHz 486 和 8MB 内存上。",
      details: "最低配置：386DX/25、4MB 内存、50MB 硬盘。推荐配置：486/66、8MB 内存、120MB 硬盘。安装时间：从 22 张软盘安装约需 30 分钟。",
      buttons: ["确定", "详细信息 >>"],
    },
  },
  4: {
    en: {
      windowTitle: "About Retro OS",
      logo: "95",
      title: "Retro OS 95",
      version: "Version 4.00.950  (C) 1995",
      specs: [
        { label: "Processor", value: "Pentium 90MHz" },
        { label: "Memory", value: "16 MB RAM" },
        { label: "Storage", value: "540 MB HDD" },
        { label: "Display", value: "800x600 256 colors" },
        { label: "Sound", value: "Sound Blaster 16" },
        { label: "Modem", value: "28.8 kbps" },
      ],
    },
    zh: {
      windowTitle: "关于 复古 OS",
      logo: "95",
      title: "复古 OS 95",
      version: "版本 4.00.950  (C) 1995",
      specs: [
        { label: "处理器", value: "奔腾 90MHz" },
        { label: "内存", value: "16 MB" },
        { label: "存储", value: "540 MB 硬盘" },
        { label: "显示", value: "800x600 256色" },
        { label: "声卡", value: "Sound Blaster 16" },
        { label: "调制解调器", value: "28.8 kbps" },
      ],
    },
  },
  5: {
    en: {
      text: "It is now safe to turn off",
      sub: "your presentation.",
      closing: "Thank you for watching.",
    },
    zh: {
      text: "现在可以安全地关闭",
      sub: "您的演示文稿。",
      closing: "感谢观看。",
    },
  },
};

// ─── Metadata ───────────────────────────────────────────────────────────────

export function getMetadata(lang: "en" | "zh"): StyleMetadata {
  const nameMap = { en: "Retro Windows", zh: "复古 Windows" };
  const themeMap = {
    en: "Nostalgic Computing — Win9x desktop costume with bevel depth, navy sole accent, CRT scanlines and dense application-UI body",
    zh: "怀旧计算——Windows 9x 桌面装扮，斜面深度、海军蓝主色、CRT 扫描线和密集应用界面",
  };
  const densityLabelMap = { en: "Application-Dense", zh: "应用密集" };

  const sceneTitles = {
    en: ["Desktop", "File Explorer", "System Dialog", "System Info", "Shutdown"],
    zh: ["桌面", "资源管理器", "系统对话框", "系统信息", "关机"],
  };

  const beatActions = {
    en: {
      1: ["Desktop appears"],
      2: ["Window opens", "Files populate"],
      3: ["Dialog shows", "Details expand", "Buttons appear"],
      4: ["System info loads"],
      5: ["Shutdown message"],
    },
    zh: {
      1: ["桌面呈现"],
      2: ["窗口打开", "文件填充"],
      3: ["对话框显示", "详情展开", "按钮出现"],
      4: ["系统信息加载"],
      5: ["关机消息"],
    },
  };

  const BEAT_COUNTS: Record<number, number> = {
    1: 1,
    2: 2,
    3: 3,
    4: 1,
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
        beatTitle = String(c.title || "");
        beatBody = String(c.subtitle || "");
      } else if (id === 2) {
        beatTitle = String(c.windowTitle || "");
        if (beatIdx >= 1) {
          const files = (c.files as Array<{ label: string }>) || [];
          beatBody = files.map((f) => f.label).join(" / ");
        }
      } else if (id === 3) {
        beatTitle = String(c.text || "");
        if (beatIdx >= 1) beatBody = String(c.details || "");
        if (beatIdx >= 2) beatBody = String(c.details || "") + " [Buttons: " + ((c.buttons as string[]) || []).join(", ") + "]";
      } else if (id === 4) {
        beatTitle = String(c.title || "");
        const specs = (c.specs as Array<{ label: string; value: string }>) || [];
        beatBody = specs.map((s) => `${s.label}: ${s.value}`).join(" / ");
      } else if (id === 5) {
        beatTitle = String(c.text || "") + " " + String(c.sub || "");
        beatBody = String(c.closing || "");
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
    id: "34",
    band: "contemporary-digital",
    name: nameMap[lang],
    theme: themeMap[lang],
    densityLabel: densityLabelMap[lang],
    heroScene: 3,
    colors: {
      bg: "#808080",
      ink: "#000000",
      panel: "#c0c0c0",
    },
    typography: {
      header: "MS Sans Serif Bold",
      body: "MS Sans Serif Regular",
    },
    tags: [
      "retro",
      "windows",
      "nostalgia",
      "beveled",
      "pixel",
      "classic",
      "desktop",
      "crt",
      "computing",
      "navy",
    ],
    fonts: ["MS Sans Serif", "Tahoma", "Inter"],
    scenes,
  };
}

// ─── Transition constants ──────────────────────────────────────────────────

const TRANSITION_DURATION = 450;
const BEAT_COUNTS: Record<number, number> = { 1: 1, 2: 2, 3: 3, 4: 1, 5: 1 };

// ─── Component ──────────────────────────────────────────────────────────────

export default function RetroOS95({
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

  const transitionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [transitionInfo, setTransitionInfo] = useState({
    outgoingScene: null as number | null,
    isTransitioning: false,
    lastScene: scene,
  });

  // Synchronous derivation — sets transition state in the SAME render cycle
  // as the scene prop change. Eliminates the 1-frame gap where the incoming
  // scene is visible without its enter animation class.
  if (transitionInfo.lastScene !== scene) {
    if (transitionTimerRef.current) {
      clearTimeout(transitionTimerRef.current);
    }

    if (!reducedMotion) {
      transitionTimerRef.current = setTimeout(() => {
        setTransitionInfo(function(prev) {
          return { outgoingScene: null, isTransitioning: false, lastScene: prev.lastScene };
        });
      }, TRANSITION_DURATION);

      setTransitionInfo({
        outgoingScene: transitionInfo.lastScene,
        isTransitioning: true,
        lastScene: scene,
      });
    } else {
      setTransitionInfo({
        outgoingScene: null,
        isTransitioning: false,
        lastScene: scene,
      });
    }
  }

  var outgoingScene = transitionInfo.outgoingScene;
  var isTransitioning = transitionInfo.isTransitioning;

  // Beat-level entered animation (for internal element reveals)
  useEffect(() => {
    setEntered(false);
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setEntered(true);
      });
    });
    return () => cancelAnimationFrame(id);
  }, [scene]);

  // FLIP for scene 1 desktop icons
  const { ref: desktopIconsRef } = useFLIP<HTMLDivElement>({
    watch: [beat],
    duration: 400,
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

  // ── Taskbar ─────────────────────────────────────────────────────────────

  const renderTaskbar = () => {
    if (isThumbnail) return null;
    return (
      <div className={styles.taskbar}>
        <button className={styles.startButton}>
          <span style={{ fontSize: "2.5cqh" }}>🪟</span>
          {language === "zh" ? "开始" : "Start"}
        </button>
        <div className={styles.taskbarClock}>
          {new Date().toLocaleTimeString(language === "zh" ? "zh-CN" : "en-US", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>
    );
  };

  // ── Render scene content for a given scene number ────────────────────────

  const renderSceneFor = (
    sceneNum: number,
    beatNum: number,
    effectiveEntered: boolean,
  ) => {
    const c = SCENES[sceneNum]?.[language] || SCENES[1][language];

    if (sceneNum === 1) {
      const icons = (c.icons as Array<{ img: string; label: string }>) || [];
      return (
        <div className={styles.desktop}>
          {/* Desktop icons */}
          <div
            ref={sceneNum === scene ? desktopIconsRef : undefined}
            className={styles.desktopIcons}
          >
            {icons.map((icon, i) => (
              <div
                key={i}
                className={styles.desktopIcon}
                style={{
                  opacity: effectiveEntered ? 1 : 0,
                  transition: reducedMotion
                    ? "none"
                    : `opacity 0.15s steps(4) ${i * 0.08}s`,
                }}
              >
                <div className={styles.desktopIconImg}>{icon.img}</div>
                <div className={styles.desktopIconLabel}>{icon.label}</div>
              </div>
            ))}
          </div>

          {/* Welcome window */}
          <div
            className={`${styles.window} ${styles.titleWindow}`}
            style={{
              opacity: effectiveEntered ? 1 : 0,
              transform: effectiveEntered ? "scale(1)" : "scale(0.95)",
              transition: reducedMotion
                ? "none"
                : "opacity 0.2s steps(4), transform 0.2s steps(4)",
            }}
          >
            <div className={styles.windowTitlebar}>
              <span className={styles.windowTitle}>{String(c.windowTitle)}</span>
              <div className={styles.windowControls}>
                <button className={styles.windowCtrlBtn} aria-label="Minimize">_</button>
                <button className={styles.windowCtrlBtn} aria-label="Maximize">▢</button>
                <button className={styles.windowCtrlBtn} aria-label="Close">×</button>
              </div>
            </div>
            <div className={`${styles.windowBody} ${styles.titleWindowBody}`}>
              <h1 className={styles.titleBig}>{String(c.title)}</h1>
              <p className={styles.titleSub}>{String(c.subtitle)}</p>
            </div>
          </div>

          {renderTaskbar()}
        </div>
      );
    }

    if (sceneNum === 2) {
      const sidebar = (c.sidebar as Array<{ img: string; label: string }>) || [];
      const files = (c.files as Array<{ img: string; label: string }>) || [];
      return (
        <div className={styles.explorerScene}>
          <div className={`${styles.window} ${styles.explorerWindow}`}>
            <div className={styles.windowTitlebar}>
              <span className={styles.windowTitle}>{String(c.windowTitle)}</span>
              <div className={styles.windowControls}>
                <button className={styles.windowCtrlBtn} aria-label="Minimize">_</button>
                <button className={styles.windowCtrlBtn} aria-label="Maximize">▢</button>
                <button className={styles.windowCtrlBtn} aria-label="Close">×</button>
              </div>
            </div>
            <div className={styles.explorerToolbar}>
              {["←", "→", "↑", "✂", "📋", "↺"].map((btn, i) => (
                <button key={i} className={styles.toolbarBtn}>{btn}</button>
              ))}
            </div>
            <div className={styles.explorerAddress}>
              <span className={styles.addressLabel}>
                {language === "zh" ? "地址" : "Address"}
              </span>
              <div className={styles.addressBar}>{String(c.address)}</div>
            </div>
            <div className={styles.explorerContent}>
              <div className={styles.explorerSidebar}>
                {sidebar.map((item, i) => (
                  <div key={i} className={styles.sidebarItem}>
                    <span>{item.img}</span>
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>
              <div className={styles.explorerFiles}>
                {files.map((file, i) => {
                  const visible = beatNum >= 1 && effectiveEntered;
                  return (
                    <div
                      key={i}
                      className={`${styles.fileItem} ${visible ? styles.fileItemVisible : ""}`}
                      style={{
                        transitionDelay: reducedMotion ? "0s" : `${i * 0.06}s`,
                      }}
                    >
                      <div className={styles.fileItemImg}>{file.img}</div>
                      <div className={styles.fileItemName}>{file.label}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (sceneNum === 3) {
      const buttons = (c.buttons as string[]) || ["OK"];
      const showDetails = beatNum >= 1;
      const showButtons = beatNum >= 2;
      return (
        <div className={styles.dialogScene}>
          <div
            className={styles.dialogBox}
            style={{
              opacity: effectiveEntered ? 1 : 0,
              transform: effectiveEntered ? "scale(1)" : "scale(0.9)",
              transition: reducedMotion
                ? "none"
                : "opacity 0.15s steps(3), transform 0.15s steps(3)",
            }}
          >
            <div className={styles.windowTitlebar}>
              <span className={styles.windowTitle}>{String(c.windowTitle)}</span>
              <div className={styles.windowControls}>
                <button className={styles.windowCtrlBtn} aria-label="Close">×</button>
              </div>
            </div>
            <div className={styles.dialogBody}>
              <div className={styles.dialogIcon}>{String(c.icon)}</div>
              <div className={styles.dialogContent}>
                <p className={styles.dialogText}>{String(c.text)}</p>
                <p
                  className={`${styles.dialogDetails} ${showDetails ? styles.dialogDetailsVisible : ""}`}
                >
                  {String(c.details)}
                </p>
                <div
                  className={styles.dialogButtons}
                  style={{
                    opacity: showButtons ? 1 : 0,
                    transition: reducedMotion ? "none" : "opacity 0.15s steps(3)",
                  }}
                >
                  {buttons.map((btn, i) => (
                    <button
                      key={i}
                      className={`${styles.osButton} ${i === 0 ? styles.osButtonDefault : ""}`}
                    >
                      {btn}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (sceneNum === 4) {
      const specs = (c.specs as Array<{ label: string; value: string }>) || [];
      return (
        <div className={styles.aboutScene}>
          <div className={`${styles.window} ${styles.aboutWindow}`}>
            <div className={styles.windowTitlebar}>
              <span className={styles.windowTitle}>{String(c.windowTitle)}</span>
              <div className={styles.windowControls}>
                <button className={styles.windowCtrlBtn} aria-label="OK">OK</button>
              </div>
            </div>
            <div className={styles.aboutBody}>
              <div className={styles.aboutLogo}>{String(c.logo)}</div>
              <div className={styles.aboutInfo}>
                <h2 className={styles.aboutTitle}>{String(c.title)}</h2>
                <p className={styles.aboutVersion}>{String(c.version)}</p>
                <div className={styles.aboutSpecs}>
                  {specs.map((spec, i) => (
                    <div
                      key={i}
                      className={styles.specRow}
                      style={{
                        opacity: effectiveEntered ? 1 : 0,
                        transition: reducedMotion
                          ? "none"
                          : `opacity 0.15s steps(3) ${i * 0.08}s`,
                      }}
                    >
                      <span className={styles.specLabel}>{spec.label}</span>
                      <span className={styles.specValue}>{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (sceneNum === 5) {
      return (
        <div className={styles.shutdownScene}>
          <div className={styles.shutdownContent}>
            <p
              className={styles.shutdownText}
              style={{
                opacity: effectiveEntered ? 1 : 0,
                transition: reducedMotion ? "none" : "opacity 0.3s steps(6)",
              }}
            >
              {String(c.text)}
            </p>
            <p className={styles.shutdownSub}>{String(c.sub)}</p>
            <p className={styles.shutdownItIs}>{String(c.closing)}</p>
          </div>
        </div>
      );
    }

    return null;
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
              {s}
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
  ]
    .filter(Boolean)
    .join(" ");

  const incomingLayerClasses = [
    styles.sceneLayer,
    isTransitioning && !isTransitionClone ? styles.enterAnim : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={rootClasses}>
      {/* Outgoing scene (exit animation) */}
      {outgoingScene !== null && (
        <div className={outgoingLayerClasses}>
          {renderSceneFor(outgoingScene, BEAT_COUNTS[outgoingScene] - 1, true)}
        </div>
      )}

      {/* Incoming / current scene */}
      <div className={incomingLayerClasses}>
        {renderSceneFor(scene, beat, entered)}
      </div>

      {renderNavIndicators()}
    </div>
  );
}

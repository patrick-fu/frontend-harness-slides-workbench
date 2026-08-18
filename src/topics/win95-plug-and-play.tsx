import {
  defineTopic,
  type TopicMetadata,
  type TopicStageProps,
} from "../domain/topic";
import SpatialSceneTrack from "../components/stage/SpatialSceneTrack";
import styles from "./win95-plug-and-play.module.css";

const metadata: { en: TopicMetadata; zh: TopicMetadata } = {
  en: {
    theme: "Win95 Plug and Play: Dynamic Hardware Resource Arbitration",
    densityLabel: "Dense",
    heroScene: 3,
    colors: {
      bg: "#008080",
      ink: "#000000",
      panel: "#c0c0c0",
    },
    typography: {
      header: "Tahoma 700",
      body: "Tahoma 400",
    },
    tags: ["windows", "retro", "plug-and-play", "hardware", "irq"],
    fonts: ["Tahoma", "sans-serif"],
    scenes: [
      {
        id: 1,
        title: "DIP Switch & Jumper Hell",
        beats: [
          {
            id: 0,
            action: "Inspect ISA expansion cards and hardware jumper jumpers",
            title: "Manual IRQ & DMA Conflicts",
            body: "Installing a Sound Blaster card required manually setting physical jumpers to avoid IRQ5 interrupts crashing LPT1 printers.",
          },
        ],
      },
      {
        id: 2,
        title: "PnP Auto-Hardware Detection",
        beats: [
          {
            id: 0,
            action: "Probe expansion bus via ACPI and PnP BIOS",
            title: "ACPI & PnP Enumeration",
            body: "At boot, the Configuration Manager isolates ISA/PCI slots, reading vendor and device IDs (EISA ID) directly from card EEPROMs.",
          },
          {
            id: 1,
            action: "Build dynamic system hardware tree",
            title: "Dynamic Hardware Registry Tree",
            body: "The OS constructs a dynamic hardware tree under HKEY_DYN_DATA, allocating clean memory ranges without user intervention.",
          },
        ],
      },
      {
        id: 3,
        title: "Resource Arbiter Allocation",
        beats: [
          {
            id: 0,
            action: "Arbitrate conflicting IRQ, DMA, and I/O port assignments",
            title: "Automated Resource Arbiter (No Blue Screen)",
            body: "The Resource Arbiter algorithmically resolves DMA/IO overlaps across PCI/ISA buses in 50 milliseconds without a Blue Screen.",
          },
        ],
      },
      {
        id: 4,
        title: "Dynamic VxD Driver Binding",
        beats: [
          {
            id: 0,
            action: "Load virtual device drivers without rebooting",
            title: "Dynamic VxD Virtual Driver Loading",
            body: "Device Manager mounts 32-bit virtual device drivers (.VXD) into ring 0 memory on the fly, avoiding MS-DOS reboots.",
          },
        ],
      },
      {
        id: 5,
        title: "The Plug and Play Standard",
        beats: [
          {
            id: 0,
            action: "Establish modern plug-and-play consumer PC standard",
            title: "Hardware Built for Human Beings",
            body: "From 'Plug and Pray' mockery to industry standard, Windows 95 turned hardware installation into a zero-configuration reality.",
          },
        ],
      },
    ],
  },
  zh: {
    theme: "即插即用架构：Windows 95 动态硬件资源仲裁革命",
    densityLabel: "密集",
    heroScene: 3,
    colors: {
      bg: "#008080",
      ink: "#000000",
      panel: "#c0c0c0",
    },
    typography: {
      header: "Tahoma 700",
      body: "Tahoma 400",
    },
    tags: ["Windows", "复古", "即插即用", "硬件", "中断冲突"],
    fonts: ["Tahoma", "sans-serif"],
    scenes: [
      {
        id: 1,
        title: "跳线帽与IRQ地狱",
        beats: [
          {
            id: 0,
            action: "展示 ISA 声卡跳线帽与并口打印机中断冲突",
            title: "手动拨码跳线与中断冲突",
            body: "在 DOS 时代安装声卡必须用镊子手动拔插跳线帽；IRQ5 中断稍有重叠便会导致打印机崩溃并触发蓝屏。",
          },
        ],
      },
      {
        id: 2,
        title: "PnP 自动硬件探测",
        beats: [
          {
            id: 0,
            action: "开机通过 PnP BIOS 遍历 PCI/ISA 总线卡槽",
            title: "PnP 硬件设备自动枚举",
            body: "开机阶段配置管理器遍历扩展槽，直接从板卡 EEPROM 芯片中读取厂商与设备 ID，无需人工拨码。",
          },
          {
            id: 1,
            action: "构建内存动态硬件设备树",
            title: "构建内存动态设备树",
            body: "操作系统在注册表中动态构建硬件拓扑树，自动申请未被占用的 I/O 端口与 DMA 传输通道。",
          },
        ],
      },
      {
        id: 3,
        title: "仲裁器重排 DMA/IO",
        beats: [
          {
            id: 0,
            action: "资源仲裁器算法自动化解中断重叠",
            title: "资源仲裁器算法自动重排 (告别蓝屏)",
            body: "资源仲裁器（Arbiter）在 50 毫秒内算法求解全量硬件资源约束，重新洗牌 IRQ 与 DMA，彻底消除冲突。",
          },
        ],
      },
      {
        id: 4,
        title: "动态 VxD 驱动绑定",
        beats: [
          {
            id: 0,
            action: "免重启热加载 32 位虚拟设备驱动",
            title: "动态 VxD 虚拟驱动热绑定",
            body: "设备管理器直接在 Ring 0 内核态动态挂载 32 位虚拟设备驱动（.VXD），彻底告别修改 CONFIG.SYS 重启的噩梦。",
          },
        ],
      },
      {
        id: 5,
        title: "现代硬件即插即用",
        beats: [
          {
            id: 0,
            action: "总结即插即用开创的现代个人电脑标准",
            title: "为人类设计的现代个人电脑",
            body: "从初期的调侃到现代工业基石，Windows 95 即插即用架构将复杂的底层硬件总线彻底驯化为开箱即用的日常体验。",
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
              <div
                className={styles.windowFrame}
                data-beat-layout-container={sceneId === 2 ? "true" : undefined}
                data-beat-layout-mode={sceneId === 2 ? "motion" : undefined}
              >
                <div className={styles.titleBar}>
                  <span>
                    💻{" "}
                    {language === "zh"
                      ? "设备管理器 - 即插即用配置向导"
                      : "DEVICE_MANAGER // PNP_WIZARD.EXE"}
                  </span>
                  <div className={styles.buttonCluster}>
                    <button className={styles.winButton}>_</button>
                    <button className={styles.winButton}>□</button>
                    <button className={styles.winButton}>✕</button>
                  </div>
                </div>

                <div className={styles.windowBody}>
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
                    className={styles.deviceTree}
                    data-beat-layout-item={sceneId === 2 ? "true" : undefined}
                  >
                    <div>📁 Computer (x86 PnP Architecture)</div>
                    <div>&nbsp;&nbsp;├─ 🔊 Sound Blaster 16 (IRQ: 05, DMA: 01) [OK]</div>
                    <div>&nbsp;&nbsp;├─ 🖨️ ECP Print Port (LPT1 / IRQ: 07) [OK]</div>
                    <div>&nbsp;&nbsp;└─ 🌐 NE2000 Compatible PCI (IRQ: 10) [RESOLVED]</div>
                  </div>
                </div>

                <div className={styles.statusBar}>
                  <span>STATUS: 0 HARDWARE CONFLICTS DETECTED</span>
                  <span>PNP ARBITER READY</span>
                </div>
              </div>
            </div>
          );
        }}
      />
    </div>
  );
}

export default defineTopic({
  id: "win95-plug-and-play",
  styleId: "retro-windows",
  title: { en: "Win95 Plug and Play", zh: "即插即用架构" },
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
        title: "Microsoft Windows 95 Plug and Play Architecture Whitepaper",
        url: "https://web.archive.org/web/microsoft-pnp-spec",
        supports:
          "PnP BIOS enumeration, Resource Arbiter IRQ resolution, and dynamic VxD binding.",
      },
    ],
  },
});

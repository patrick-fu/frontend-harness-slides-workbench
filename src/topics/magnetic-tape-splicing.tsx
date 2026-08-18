import {
  defineTopic,
  type TopicMetadata,
  type TopicStageProps,
} from "../domain/topic";
import SpatialSceneTrack from "../components/stage/SpatialSceneTrack";
import styles from "./magnetic-tape-splicing.module.css";

const metadata: { en: TopicMetadata; zh: TopicMetadata } = {
  en: {
    theme: "Razor and Tape: Physical Editing on 15 IPS Reel-to-Reel Masters",
    densityLabel: "Dense",
    heroScene: 3,
    colors: {
      bg: "#141416",
      ink: "#f1f5f9",
      panel: "#1e293b",
    },
    typography: {
      header: "Impact 900",
      body: "System-ui 400",
    },
    tags: ["audio", "analog", "tape", "mastering", "duotone"],
    fonts: ["Impact", "Arial Black"],
    scenes: [
      {
        id: 1,
        title: "Sound as Spatial Distance",
        beats: [
          {
            id: 0,
            action: "Map sound duration to physical tape length at 15 ips",
            title: "15 IPS Velocity Mapping",
            body: "At 15 inches per second, time is physical distance: one millimeter of brown ferric oxide tape corresponds to exactly 2.62 milliseconds of acoustic vibration.",
          },
        ],
      },
      {
        id: 2,
        title: "Locating the Transient",
        beats: [
          {
            id: 0,
            action: "Rock tape reels back and forth across playback head",
            title: "Tape Scrubbing Transient Detection",
            body: "The recording engineer rotates the aluminum reels by hand, listening to pitch-shifted groans to locate the initial strike of a snare drum.",
          },
          {
            id: 1,
            action: "Mark precise cut point with grease pencil",
            title: "Grease Pencil Zero-Crossing Mark",
            body: "A yellow grease pencil marks the exact zero-crossing wave apex across the backing layer directly over the playback head gap.",
          },
        ],
      },
      {
        id: 3,
        title: "The 45-Degree Siphon Cut",
        beats: [
          {
            id: 0,
            action: "Demonstrate 45-degree angle acoustic crossfade",
            title: "The 45-Degree Acoustic Crossfade",
            body: "A 90-degree perpendicular cut creates an explosive DC pop at the playback head; a 45-degree diagonal creates a 3-millisecond physical crossfade.",
          },
        ],
      },
      {
        id: 4,
        title: "The Splicing Block",
        beats: [
          {
            id: 0,
            action: "Apply non-magnetic razor blade in aluminum guide channel",
            title: "Aluminum Block & Adhesive Splicing",
            body: "The tape rests in an anodized aluminum dovetail groove; a demagnetized razor slice and adhesive splicing tape weld the takes seamlessly.",
          },
        ],
      },
      {
        id: 5,
        title: "The Permanent Cut",
        beats: [
          {
            id: 0,
            action: "Affirm irreversible discipline of physical audio editing",
            title: "Master Take Bound in Iron Oxide",
            body: "No undo stack, no digital quantization. The master take spins at full speed, bound by the unforgiving precision of hand, blade, and tape.",
          },
        ],
      },
    ],
  },
  zh: {
    theme: "刀片剪磁带：开盘母带 15 ips 物理手工剪辑纪律",
    densityLabel: "密集",
    heroScene: 3,
    colors: {
      bg: "#141416",
      ink: "#f1f5f9",
      panel: "#1e293b",
    },
    typography: {
      header: "Impact 900",
      body: "System-ui 400",
    },
    tags: ["音频", "模拟", "磁带", "母带", "双调录制"],
    fonts: ["Impact", "Arial Black"],
    scenes: [
      {
        id: 1,
        title: "物理距离映射时间",
        beats: [
          {
            id: 0,
            action: "将声音时长严密映射为 15 ips 走带物理距离",
            title: "15 ips 走带速度空间映射",
            body: "在每秒 15 英寸的开盘机走带速度下，1 毫米棕色氧化铁磁带的物理长度严格对应 2.62 毫秒的声音时间。",
          },
        ],
      },
      {
        id: 2,
        title: "磁头慢摇定位瞬态",
        beats: [
          {
            id: 0,
            action: "手动慢摇带盘监听定位瞬态爆破点",
            title: "慢摇带盘瞬态波形定位",
            body: "录音师用手前后摇动铝制开盘带盘，通过磁头传出的变调慢速低吟，精准锁定军鼓敲击的绝对起始点。",
          },
          {
            id: 1,
            action: "特种黄铅笔在磁带背基标记过零点",
            title: "特种铅笔标记过零点",
            body: "特制无油黄铅笔在磁头微米间隙正上方，于磁带背基精准画下波形过零点切割标记线。",
          },
        ],
      },
      {
        id: 3,
        title: "45度斜切消除爆音",
        beats: [
          {
            id: 0,
            action: "以 45 度斜角切断创造 3 毫秒物理淡入淡出",
            title: "45 度斜切物理微淡入淡出",
            body: "90度垂直切断会在穿过放音磁头时产生刺耳的直流跳变爆音；45度斜切在物理上创造出 3 毫秒无损自然过渡。",
          },
        ],
      },
      {
        id: 4,
        title: "铝槽拼接胶带固定",
        beats: [
          {
            id: 0,
            action: "在阳极氧化铝拼接槽内贴敷聚酯拼接胶带",
            title: "无磁刀片与聚酯胶带拼接",
            body: "磁带嵌入阳极氧化铝燕尾导向槽，消磁不锈钢刀片划过，覆上专用聚酯薄膜胶带完成永久物理熔接。",
          },
        ],
      },
      {
        id: 5,
        title: "剪入声音永恒",
        beats: [
          {
            id: 0,
            action: "总结模拟时代不可撤销的手工剪辑敬畏",
            title: "封存进氧化铁中的完美母带",
            body: "没有 Ctrl+Z，亦无数字量化。开盘母带以全速旋转，将录音师刀尖上的绝对精度封存为不朽的音乐瞬间。",
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
              <header className={styles.sessionHeader}>
                <span>
                  {language === "zh"
                    ? "双调开盘录音棚记录"
                    : "DUOTONE SESSION // REEL-TO-REEL"}
                </span>
                <span>TAKE 0{sceneId} // 15 IPS</span>
              </header>

              <div
                className={styles.duotoneBody}
                data-beat-layout-container={sceneId === 2 ? "true" : undefined}
                data-beat-layout-mode={sceneId === 2 ? "motion" : undefined}
              >
                <div
                  className={styles.tapeSpeedTag}
                  data-beat-layout-item={sceneId === 2 ? "true" : undefined}
                >
                  SPEED: 15.0 INCHES/SEC // 1/4 INCH MASTER TAPE
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
              </div>

              <footer className={styles.sessionFooter}>
                <span>STUDIO B // DIRECT CUTTING SPLICING PROTOCOL</span>
                <span>BLUE NOTE ANALOG MASTERING ARCHIVE</span>
              </footer>
            </div>
          );
        }}
      />
    </div>
  );
}

export default defineTopic({
  id: "magnetic-tape-splicing",
  styleId: "duotone-session",
  title: { en: "Razor and Tape", zh: "刀片剪磁带" },
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
        title: "The Audio Cyclopedia: Tape Recording and Splicing Standards",
        url: "https://aes2.org/publications/historical-publications/",
        supports:
          "45-degree angle tape splicing geometry and 15 ips velocity acoustic mapping.",
      },
    ],
  },
});

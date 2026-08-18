import {
  defineTopic,
  type TopicMetadata,
  type TopicStageProps,
} from "../domain/topic";
import SpatialSceneTrack from "../components/stage/SpatialSceneTrack";
import styles from "./rubber-hose-animation.module.css";

const metadata: { en: TopicMetadata; zh: TopicMetadata } = {
  en: {
    theme: "Rubber Hose Animation: Anatomy of Early Elastic Cartooning",
    densityLabel: "Balanced",
    heroScene: 3,
    colors: {
      bg: "#f8f4ec",
      ink: "#2b2725",
      panel: "#fff9ee",
    },
    typography: {
      header: "System-ui 800",
      body: "System-ui 400",
    },
    tags: ["animation", "cartoon", "craft", "sketch", "rubber-hose"],
    fonts: ["System-ui"],
    scenes: [
      {
        id: 1,
        title: "Farewell Rigid Bones",
        beats: [
          {
            id: 0,
            action: "Discard anatomic joints for continuous curves",
            title: "No Elbows, No Knees 〰️",
            body: "Early 1920s animators abolished realistic skeletal anatomy, replacing rigid joints with fluid, bendable rubber hose curves.",
          },
        ],
      },
      {
        id: 2,
        title: "Squash and Stretch",
        beats: [
          {
            id: 0,
            action: "Demonstrate volume preservation in impact",
            title: "Volume Preservation 🎾",
            body: "A dropped bowling ball flattens on impact like dough, then stretches vertically upon rebound while keeping total mass constant.",
          },
          {
            id: 1,
            action: "Exaggerate kinetic overshoot",
            title: "Kinetic Snap & Recoil 💥",
            body: "Exaggerating anticipation and follow-through converts mechanical motion into living, bouncy rhythm.",
          },
        ],
      },
      {
        id: 3,
        title: "The Walk Cycle Beat",
        beats: [
          {
            id: 0,
            action: "Stage 8-frame bouncy walk cycle",
            title: "8-Frame Steamboat Strut 👟",
            body: "Characters bounce in syncopated tempo: contact, down, pass, up. Every beat lands with musical foot-tapping cadence.",
          },
          {
            id: 1,
            action: "Harmonize secondary animation oscillations",
            title: "Secondary Oscillation 🕺",
            body: "Gloves, ears, and button eyes wobble half a frame behind the torso, multiplying slapstick vitality.",
          },
        ],
      },
      {
        id: 4,
        title: "Exaggerated Perspective",
        beats: [
          {
            id: 0,
            action: "Stretch limbs toward screen camera",
            title: "Fisheye Distortion 🔍",
            body: "Hands swell to 5x their size as they reach toward the viewer, breaking optical Euclidean geometry for emotional impact.",
          },
        ],
      },
      {
        id: 5,
        title: "Pure Living Energy",
        beats: [
          {
            id: 0,
            action: "Summarize the immortal cartoon spirit",
            title: "Illusion of Life 🎭",
            body: "Rubber hose was never a shortcut—it was the triumphant realization that drawn ink is liberated from gravity.",
          },
        ],
      },
    ],
  },
  zh: {
    theme: "橡皮管动画：早期弹性卡通手绘解剖",
    densityLabel: "均衡",
    heroScene: 3,
    colors: {
      bg: "#f8f4ec",
      ink: "#2b2725",
      panel: "#fff9ee",
    },
    typography: {
      header: "System-ui 800",
      body: "System-ui 400",
    },
    tags: ["动画", "卡通", "工艺", "手绘", "橡皮管"],
    fonts: ["System-ui"],
    scenes: [
      {
        id: 1,
        title: "告别僵硬骨骼",
        beats: [
          {
            id: 0,
            action: "抛弃解剖关节，引入平滑曲线",
            title: "没有肘关节与膝盖 〰️",
            body: "1920 年代的先驱动画师彻底摒弃僵硬的骨骼约束，用柔软弹性的无骨橡皮管弧线取而代之。",
          },
        ],
      },
      {
        id: 2,
        title: "挤压与拉伸",
        beats: [
          {
            id: 0,
            action: "展示撞击形变中的体积守恒",
            title: "体积绝对守恒 🎾",
            body: "落地时形体如面团般向两侧挤压压扁，反弹时纵向拉伸，全程保持几何体积恒定。",
          },
          {
            id: 1,
            action: "夸张动能超调与回弹",
            title: "动能顿挫与反冲 💥",
            body: "夸张的前摇预备与后挫跟随，让机械位移瞬间转化为充满弹性的生命节拍。",
          },
        ],
      },
      {
        id: 3,
        title: "循环行走节拍",
        beats: [
          {
            id: 0,
            action: "编排 8 帧弹性跨步循环",
            title: "8帧欢快跨步节拍 👟",
            body: "角色沿切分音节奏起伏：触地、下沉、迈步、升起。每一个节拍都与音乐律动严丝合缝。",
          },
          {
            id: 1,
            action: "协调副动效次级晃动",
            title: "次级惯性摆动 🕺",
            body: "白手套、大耳朵与圆纽扣落后躯干半帧晃动，将幽默感与生命力呈倍数放大。",
          },
        ],
      },
      {
        id: 4,
        title: "夸张透视弧线",
        beats: [
          {
            id: 0,
            action: "将肢体向镜头前方大幅拉伸",
            title: "鱼眼镜头透视 🔍",
            body: "向前伸出的拳头瞬间膨胀至原本尺寸的五倍，打破欧几里得几何透视，直击情绪核心。",
          },
        ],
      },
      {
        id: 5,
        title: "纯粹生命力",
        beats: [
          {
            id: 0,
            action: "总结不朽的动画幻象",
            title: "赋予线条生命 🎭",
            body: "橡皮管从来不是偷懒的简笔画，它是人类第一次领悟到：画纸上的墨水彻底摆脱了重力的束缚。",
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
        transitionKind="slide-x"
        transitionMap={{
          "1->2": "slide-x",
          "2->3": "push-x",
          "3->4": "slide-x",
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
              <div
                className={styles.boardContainer}
                data-beat-layout-container={
                  sceneId === 2 || sceneId === 3 ? "true" : undefined
                }
                data-beat-layout-mode={
                  sceneId === 2 || sceneId === 3 ? "motion" : undefined
                }
              >
                <div
                  className={styles.tapeStrip}
                  data-beat-layout-item={
                    sceneId === 2 || sceneId === 3 ? "true" : undefined
                  }
                />
                <div
                  className={styles.stickyNote}
                  data-beat-layout-item={
                    sceneId === 2 || sceneId === 3 ? "true" : undefined
                  }
                >
                  <div className={styles.emojiHeader}>
                    <span>🎨 SKETCHPAD // SCENE 0{sceneId}</span>
                  </div>
                  <h1 className={styles.sketchTitle}>{currentBeat.title}</h1>
                  <p className={styles.sketchBody}>{currentBeat.body}</p>
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
  id: "rubber-hose-animation",
  styleId: "sketch-board-emoji",
  title: { en: "Rubber Hose Animation", zh: "橡皮管动画" },
  modelId: "Gemini 3.7 Flash",
  Stage: TopicStage,
  metadata,
  navigation: { mode: "none" },
  transitionScore: {
    "1->2": "slide-x",
    "2->3": "push-x",
    "3->4": "slide-x",
    "4->5": "crossfade",
  },
  evidence: {
    kind: "illustrative",
    boundary: {
      en: "Animation craft principles illustrated through workshop sketches.",
      zh: "动画工艺原理手绘草图，展示早期橡皮管角色动态规律。",
    },
    display: "envelope",
  },
});

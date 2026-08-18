import {
  defineTopic,
  type TopicMetadata,
  type TopicStageProps,
} from "../domain/topic";
import SpatialSceneTrack from "../components/stage/SpatialSceneTrack";
import styles from "./mechanical-watch-escapement.module.css";

const metadata: { en: TopicMetadata; zh: TopicMetadata } = {
  en: {
    theme: "Swiss Lever Escapement: Slicing Continuous Potential into Time",
    densityLabel: "Balanced",
    heroScene: 3,
    colors: {
      bg: "#0f172a",
      ink: "#f8fafc",
      panel: "#1e1b4b",
    },
    typography: {
      header: "Didot 700",
      body: "System-ui 300",
    },
    tags: ["horology", "mechanics", "time", "escapement", "masthead"],
    fonts: ["Didot", "Georgia"],
    scenes: [
      {
        id: 1,
        title: "Mainspring Potential Energy",
        beats: [
          {
            id: 0,
            action: "Wind coiled spring inside barrel drum",
            title: "The Coiled Mainspring Reservoir",
            body: "A wound carbon steel spring stores raw mechanical torque inside the mainspring barrel, waiting to unleash uncontrolled acceleration.",
          },
        ],
      },
      {
        id: 2,
        title: "Ruby Pallet Fork Locking",
        beats: [
          {
            id: 0,
            action: "Lock escape wheel tooth on entry ruby pallet",
            title: "Synthetic Ruby Pallet Lock",
            body: "The escapement fork intercepts escape wheel teeth with synthetic ruby jewel faces, arresting rotation with zero friction wear.",
          },
          {
            id: 1,
            action: "Transfer impulse kick to balance roller jewel",
            title: "The Angular Impulse Kick",
            body: "As the tooth slides past the jewel impulse plane, it delivers a precise micro-joule kick to the oscillating balance wheel.",
          },
        ],
      },
      {
        id: 3,
        title: "Hairspring Isochronous Oscillation",
        beats: [
          {
            id: 0,
            action: "Oscillate balance wheel at 28,800 beats per hour (4Hz)",
            title: "28,800 BPH Isochronous Breath",
            body: "The Nivarox hairspring breathes outward and inward with absolute isochronism, slicing continuous torque into 8 discrete beats per second.",
          },
        ],
      },
      {
        id: 4,
        title: "Gear Train Step Amplification",
        beats: [
          {
            id: 0,
            action: "Transmit quantized steps to center wheel and hands",
            title: "Quantized Gear Train Transmission",
            body: "Jeweled pinion wheels amplify 1/8th-second ticks across fourth, third, and center wheels to sweep the golden hands smoothly.",
          },
        ],
      },
      {
        id: 5,
        title: "Micro-Engineered Eternity",
        beats: [
          {
            id: 0,
            action: "Celebrate mechanical horology triumph",
            title: "The Architecture of a Second",
            body: "Without a single battery or line of code, 150 microscopic brass and steel components civilize chaotic kinetic force into pure time.",
          },
        ],
      },
    ],
  },
  zh: {
    theme: "机械擒纵机构：将连续发条势能切割为恒定时间节拍",
    densityLabel: "均衡",
    heroScene: 3,
    colors: {
      bg: "#0f172a",
      ink: "#f8fafc",
      panel: "#1e1b4b",
    },
    typography: {
      header: "Didot 700",
      body: "System-ui 300",
    },
    tags: ["钟表学", "机械", "时间", "擒纵", "杂志刊头"],
    fonts: ["Didot", "Georgia"],
    scenes: [
      {
        id: 1,
        title: "发条势能储备",
        beats: [
          {
            id: 0,
            action: "发条盒紧绷积蓄机械势能",
            title: "发条盒发条势能积蓄",
            body: "卷紧的高弹性碳钢发条在发条盒内积蓄狂暴的旋转扭矩，若无节制将在一瞬间释放殆尽。",
          },
        ],
      },
      {
        id: 2,
        title: "红宝石擒纵叉锁止",
        beats: [
          {
            id: 0,
            action: "进瓦红宝石锁死擒纵轮齿",
            title: "人造红宝石叉瓦锁止",
            body: "擒纵叉两端的合成红宝石精确卡住擒纵轮齿的旋转，以几乎零磨损的微观硬度锁死转速。",
          },
          {
            id: 1,
            action: "冲位平面向摆轮传递微小冲力",
            title: "冲力平面脉冲传递",
            body: "轮齿滑过红宝石冲位的刹那，向摆轮上的圆盘钉传递极微弱的微焦耳冲量，维持摆动不衰减。",
          },
        ],
      },
      {
        id: 3,
        title: "游丝等时性等速振荡",
        beats: [
          {
            id: 0,
            action: "摆轮游丝以每小时 28,800 次 (4Hz) 等速呼吸",
            title: "28,800次/时 等时性振荡",
            body: "自补偿游丝以绝对的等时性向外舒张与收缩，将狂暴的连续扭矩精准切割为每秒 8 次微小节拍。",
          },
        ],
      },
      {
        id: 4,
        title: "齿轮系分步放大",
        beats: [
          {
            id: 0,
            action: "传动齿轮系将 1/8 秒节拍传导至秒针与分针",
            title: "微步齿轮系级联放大",
            body: "高精度红宝石轴承齿轮将 1/8 秒的微步逐级放大，驱动中央金针在表盘上划出平滑流动的优雅轨迹。",
          },
        ],
      },
      {
        id: 5,
        title: "微雕机械永恒",
        beats: [
          {
            id: 0,
            action: "总结机械钟表工程的微雕艺术",
            title: "一秒钟的精密机械架构",
            body: "无需一粒电池，亦无一行代码；一百五十个微米级钢铜齿轮，将混沌的物理张力驯化为了永恒的时间秩序。",
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
          4: "motion",
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
              <header className={styles.mastheadHeader}>
                <span className={styles.magazineTitle}>
                  {language === "zh"
                    ? "瑞士精密钟表刊头"
                    : "HAUTE HORLOGERIE // SWISS"}
                </span>
                <span className={styles.issueMeta}>
                  ISSUE NO. 84 // CHAPTER 0{sceneId}
                </span>
              </header>

              <div
                className={styles.coverBody}
                data-beat-layout-container={
                  sceneId === 2 || sceneId === 4 ? "true" : undefined
                }
                data-beat-layout-mode={
                  sceneId === 2 || sceneId === 4 ? "motion" : undefined
                }
              >
                <div
                  className={styles.coverKicker}
                  data-beat-layout-item={
                    sceneId === 2 || sceneId === 4 ? "true" : undefined
                  }
                >
                  THE MECHANICAL ESCAPEMENT REVEALED
                </div>
                <h1
                  className={styles.coverHeadline}
                  data-beat-layout-item={
                    sceneId === 2 || sceneId === 4 ? "true" : undefined
                  }
                >
                  {currentBeat.title}
                </h1>
                <p
                  className={styles.coverSubtitle}
                  data-beat-layout-item={
                    sceneId === 2 || sceneId === 4 ? "true" : undefined
                  }
                >
                  {currentBeat.body}
                </p>
              </div>

              <footer className={styles.coverFooter}>
                <span>CALIBRE 28,800 VPH // COSC SPEC</span>
                <span>GENEVA HOROLOGY QUARTERLY</span>
              </footer>
            </div>
          );
        }}
      />
    </div>
  );
}

export default defineTopic({
  id: "mechanical-watch-escapement",
  styleId: "magazine-masthead",
  title: { en: "Swiss Lever Escapement", zh: "机械擒纵机构" },
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
        title: "The Theory of Horology (Swiss Federation of Technical Colleges)",
        url: "https://www.fhs.swiss/eng/watchmaking_theory.html",
        supports:
          "Swiss lever escapement geometry, impulse angles, and isochronism formulas.",
      },
    ],
  },
});

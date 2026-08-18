import {
  defineTopic,
  type TopicMetadata,
  type TopicStageProps,
} from "../domain/topic";
import SpatialSceneTrack from "../components/stage/SpatialSceneTrack";
import styles from "./black-hole-event-horizon.module.css";

const metadata: { en: TopicMetadata; zh: TopicMetadata } = {
  en: {
    theme: "General Relativity: The Optical Geometry of the Black Hole Event Horizon",
    densityLabel: "Sparse",
    heroScene: 3,
    colors: {
      bg: "#000000",
      ink: "#ffffff",
      panel: "#0a0a0a",
    },
    typography: {
      header: "Cinzel 700",
      body: "Inter 300",
    },
    tags: ["astrophysics", "black-hole", "relativity", "widescreen", "cosmology"],
    fonts: ["Cinzel", "Inter", "sans-serif"],
    scenes: [
      {
        id: 1,
        title: "Relativistic Accretion Disk",
        beats: [
          {
            id: 0,
            action: "Frame spinning plasma disk glowing at relativistic speeds",
            title: "Relativistic Plasma Accretion",
            body: "Superheated matter spirals into the gravitational abyss at half the speed of light, Doppler-beaming radiation toward the observer.",
          },
        ],
      },
      {
        id: 2,
        title: "Gravitational Lensing",
        beats: [
          {
            id: 0,
            action: "Trace curved light trajectories wrapping around the shadow",
            title: "Extreme Gravitational Lensing",
            body: "Spacetime curvature bends light rays around the black hole, projecting the hidden rear of the accretion disk above and below the horizon.",
          },
          {
            id: 1,
            action: "Form the dark central shadow silhouette",
            title: "The 2.6x Schwarzschild Shadow",
            body: "The apparent dark silhouette spans 2.6 times the Schwarzschild radius due to inescapable photon capture trajectories.",
          },
        ],
      },
      {
        id: 3,
        title: "The 1.5 Rs Photon Sphere",
        beats: [
          {
            id: 0,
            action: "Isolate unstable circular photon orbits at 1.5 Schwarzschild radii",
            title: "Unstable 1.5 Rs Photon Sphere",
            body: "At exactly $r = 1.5 R_s$, light rays orbit in unstable circular trajectories, creating an infinitely thin, luminous halo of trapped photons.",
          },
        ],
      },
      {
        id: 4,
        title: "Spacetime Inversion",
        beats: [
          {
            id: 0,
            action: "Cross the event horizon where spatial radius becomes time",
            title: "Inward Arrow of Time",
            body: "Past the event horizon at $r = R_s$, the radial coordinate transforms into time: moving toward the central singularity is as inevitable as moving into tomorrow.",
          },
        ],
      },
      {
        id: 5,
        title: "The Cosmological Eye",
        beats: [
          {
            id: 0,
            action: "Synthesize Event Horizon Telescope radio interferometry",
            title: "The Cosmological Void Revealed",
            body: "From Einstein's equations to the Event Horizon Telescope's global array, the horizon stands as the absolute edge of observable reality.",
          },
        ],
      },
    ],
  },
  zh: {
    theme: "广义相对论：黑洞事件视界与光子球的光学几何",
    densityLabel: "稀疏",
    heroScene: 3,
    colors: {
      bg: "#000000",
      ink: "#ffffff",
      panel: "#0a0a0a",
    },
    typography: {
      header: "Cinzel 700",
      body: "Inter 300",
    },
    tags: ["天体物理", "黑洞", "相对论", "宽屏电影", "宇宙学"],
    fonts: ["Cinzel", "Inter", "sans-serif"],
    scenes: [
      {
        id: 1,
        title: "相对论等离子吸积盘",
        beats: [
          {
            id: 0,
            action: "超高温等离子体以半光速旋转产生多普勒增亮",
            title: "半光速相对论吸积流",
            body: "过热等离子体在极端引力井中以亚光速螺旋坠落，相对论多普勒效应使朝向观察者的一侧放射出耀眼的炽热光晕。",
          },
        ],
      },
      {
        id: 2,
        title: "强引力透镜双向环绕",
        beats: [
          {
            id: 0,
            action: "时空弯曲将黑洞背面的吸积盘光线扭曲至上下方",
            title: "极端时空引力透镜弯曲",
            body: "极端的引力场弯曲光线路径，将黑洞背面的吸积盘影像扭曲投射到视界上下两侧，形成跨越三维的环状光辉。",
          },
          {
            id: 1,
            action: "光子捕获截面形成 2.6 倍引力半径暗影",
            title: "2.6 倍史瓦西引力暗影",
            body: "光子捕获截面使黑洞中央呈现为 2.6 倍史瓦西半径的绝对深黑暗影，吞噬所有落入临界线的光线。",
          },
        ],
      },
      {
        id: 3,
        title: "1.5倍史瓦西光子球",
        beats: [
          {
            id: 0,
            action: "光线在 1.5 Rs 半径处进入不稳定的圆形公转轨道",
            title: "1.5 倍史瓦西半径光子球",
            body: "在 $r = 1.5 R_s$ 的临界轨道上，光子以圆形轨迹绕黑洞公转，构筑出一道无限薄且耀眼的宇宙光环边界。",
          },
        ],
      },
      {
        id: 4,
        title: "视界内部时空倒转",
        beats: [
          {
            id: 0,
            action: "跨过事件视界后径向空间坐标彻底转化为单向时间轴",
            title: "空间坍缩为不可逆时间轴",
            body: "一旦穿越 $r = R_s$ 事件视界，空间径向坐标与时间发生对调：走向中央奇点如同走向明天一样不可逆转。",
          },
        ],
      },
      {
        id: 5,
        title: "宇宙之眼与观测终极",
        beats: [
          {
            id: 0,
            action: "事件视界望远镜捕获人类首张黑洞照片的宇宙意义",
            title: "可观测宇宙的绝对终界",
            body: "从爱因斯坦场方程的纸上预言到事件视界望远镜的全球射电干涉阵列，黑洞视界刻画出了人类可知宇宙的终极几何边界。",
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
        transitionKind="crossfade"
        transitionMap={{
          "1->2": "crossfade",
          "2->3": "crossfade",
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
              <div className={styles.cinematicBar}>
                <span>WIDESCREEN 2.39:1 // INTERSTELLAR OPTICS</span>
                <span>M87* EVENT HORIZON</span>
              </div>

              <div
                className={styles.titleCard}
                data-beat-layout-container={sceneId === 2 ? "true" : undefined}
                data-beat-layout-mode={sceneId === 2 ? "motion" : undefined}
              >
                <div
                  className={styles.chapterBadge}
                  data-beat-layout-item={sceneId === 2 ? "true" : undefined}
                >
                  CHAPTER 0{sceneId} // r = {sceneId === 3 ? "1.5 Rs" : sceneId === 4 ? "< 1.0 Rs" : "2.6 Rs"}
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

              <div className={styles.cinematicFoot}>
                <span>PHOTON CAPTURE RADIUS: r = 3√3 / 2 GM/c²</span>
                <span>SINGULARITY CONVERGENCE</span>
              </div>
            </div>
          );
        }}
      />
    </div>
  );
}

export default defineTopic({
  id: "black-hole-event-horizon",
  styleId: "widescreen-title-card",
  title: { en: "Black Hole Horizon", zh: "事件视界" },
  modelId: "Gemini 3.7 Flash",
  Stage: TopicStage,
  metadata,
  navigation: { mode: "none" },
  transitionScore: {
    "1->2": "crossfade",
    "2->3": "crossfade",
    "3->4": "slide-x",
    "4->5": "crossfade",
  },
  evidence: {
    kind: "facts",
    sources: [
      {
        title: "First M87 Event Horizon Telescope Results. I. The Shadow of the Supermassive Black Hole",
        url: "https://iopscience.iop.org/article/10.3847/2041-8213/ab0ec7",
        supports:
          "Relativistic accretion disk, gravitational lensing, 1.5 Rs photon sphere, and shadow silhouette.",
      },
    ],
  },
});

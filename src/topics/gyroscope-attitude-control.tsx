import {
  defineTopic,
  type TopicMetadata,
  type TopicStageProps,
} from "../domain/topic";
import SpatialSceneTrack from "../components/stage/SpatialSceneTrack";
import styles from "./gyroscope-attitude-control.module.css";

const metadata: { en: TopicMetadata; zh: TopicMetadata } = {
  en: {
    theme: "Spacecraft Navigation: Control Moment Gyroscopes and Angular Momentum",
    densityLabel: "Sparse",
    heroScene: 3,
    colors: {
      bg: "#050814",
      ink: "#f8fafc",
      panel: "#0e1626",
    },
    typography: {
      header: "Syne 800",
      body: "Inter 300",
    },
    tags: ["spacecraft", "gyroscope", "physics", "object-hero", "attitude-control"],
    fonts: ["Syne", "Inter", "sans-serif"],
    scenes: [
      {
        id: 1,
        title: "Levitated Beryllium Rotor",
        beats: [
          {
            id: 0,
            action: "Spotlight spinning beryllium sphere magnetically suspended in vacuum",
            title: "Magnetically Levitated Beryllium Sphere",
            body: "A polished beryllium rotor spins at 10,000 RPM in a vacuum chamber, isolated from all mechanical friction by magnetic suspension.",
          },
        ],
      },
      {
        id: 2,
        title: "Angular Momentum Vectors",
        beats: [
          {
            id: 0,
            action: "Establish the conserved angular momentum vector L = I * omega",
            title: "Conserved Angular Momentum Vector",
            body: "Spinning mass creates a rigid angular momentum vector $\\vec{L} = I\\vec{\\omega}$ that resists external rotational perturbations in deep space.",
          },
          {
            id: 1,
            action: "Demonstrate gyroscopic precession reaction torque",
            title: "Precession & Torque Conversion",
            body: "Applying a lateral gimbal torque forces the spinning vector to precess at right angles, converting gimbal energy into vehicle rotation.",
          },
        ],
      },
      {
        id: 3,
        title: "Control Moment Gyroscopes",
        beats: [
          {
            id: 0,
            action: "Slew spacecraft attitude without expending consumable propellant",
            title: "Zero-Fuel Control Moment Gyros (CMG)",
            body: "Tilting four synchronized CMG gimbals reorients massive space stations and space telescopes using pure electrical power from solar arrays.",
          },
        ],
      },
      {
        id: 4,
        title: "Arcsecond Pointing Precision",
        beats: [
          {
            id: 0,
            action: "Lock space telescope optics onto distant exoplanets with 0.007 arcsecond accuracy",
            title: "0.007 Arcsecond Deep Space Stare",
            body: "Fine guidance reaction wheels lock the James Webb Space Telescope onto exoplanet light curves for 100 hours without jitter.",
          },
        ],
      },
      {
        id: 5,
        title: "Holding Direction in Void",
        beats: [
          {
            id: 0,
            action: "Synthesize the philosophical and physical anchor of direction in the cosmic void",
            title: "Eternal Direction in the Cosmic Void",
            body: "In the pitch-black vacuum where up and down cease to exist, the spinning gyroscope rotor provides an unshakeable moral compass for humanity's voyage.",
          },
        ],
      },
    ],
  },
  zh: {
    theme: "航天器姿态控制：控制力矩陀螺仪（CMG）与角动量守恒",
    densityLabel: "稀疏",
    heroScene: 3,
    colors: {
      bg: "#050814",
      ink: "#f8fafc",
      panel: "#0e1626",
    },
    typography: {
      header: "Syne 800",
      body: "Inter 300",
    },
    tags: ["航天器", "陀螺仪", "物理学", "主视觉隐喻", "姿态控制"],
    fonts: ["Syne", "Inter", "sans-serif"],
    scenes: [
      {
        id: 1,
        title: "磁悬浮铍金属转子",
        beats: [
          {
            id: 0,
            action: "特写聚光灯下的高精度真空磁悬浮铍金属自转球体",
            title: "真空中万转磁悬浮铍合金转子",
            body: "抛光至纳米级精度的铍金属转子在真空腔体内以每分钟上万转高速旋转，由磁悬浮轴承彻底消除机械摩擦力。",
          },
        ],
      },
      {
        id: 2,
        title: "角动量矢量刚性守恒",
        beats: [
          {
            id: 0,
            action: "确立角动量守恒矢量 L = I * omega 与抗倾覆刚性",
            title: "角动量守恒定律的物理刚性",
            body: "高速旋转的转子生成强大的角动量刚性矢量 $\\vec{L} = I\\vec{\\omega}$，在深空虚无中天然抵抗一切外部姿态扰动力矩。",
          },
          {
            id: 1,
            action: "演示框架进动力矩偏转",
            title: "陀螺力矩进动正交偏转",
            body: "通过外部电机对框架施加侧向力矩，旋转轴将在正交方向发生自发进动，将框架转动能量高效转化为飞船机体偏转。",
          },
        ],
      },
      {
        id: 3,
        title: "控制力矩陀螺零燃料",
        beats: [
          {
            id: 0,
            action: "利用控制力矩陀螺（CMG）实现无工质消耗的飞船大角度机动",
            title: "无工质消耗的 CMG 姿态机动",
            body: "4 组联动控制力矩陀螺仅消耗太阳能电池帆板的电能，即可轻松实现百吨级空间站的大角度高速姿态调姿，彻底告别化学推进剂消耗。",
          },
        ],
      },
      {
        id: 4,
        title: "角秒级极限空间指向",
        beats: [
          {
            id: 0,
            action: "展示韦伯与哈勃太空望远镜实现 0.007 角秒超精细凝视",
            title: "0.007 角秒级深空极限凝视",
            body: "微调反作用飞轮将韦伯空间望远镜的光学视轴牢牢锁定在百亿光年外的系外行星光谱上，连续百小时曝光无抖动偏移。",
          },
        ],
      },
      {
        id: 5,
        title: "虚空中握持永恒方向",
        beats: [
          {
            id: 0,
            action: "总结陀螺仪在虚空宇宙中为人类文明指明永恒方向的物理史诗",
            title: "在虚无宇宙中握持永恒坐标",
            body: "在没有任何参照系、失去上下方位的浩瀚真空深渊里，飞速旋转的陀螺仪为人类探索宇宙的征途雕刻出永不迷失的方向坐标。",
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
              <div className={styles.heroRibbon}>
                <span className={styles.heroBadge}>
                  OBJECT METAPHOR // SPACECRAFT GYRO
                </span>
                <span className={styles.rotorSpeed}>10,000 RPM // LEVITATED</span>
              </div>

              <div
                className={styles.heroPanel}
                data-beat-layout-container={sceneId === 2 ? "true" : undefined}
                data-beat-layout-mode={sceneId === 2 ? "motion" : undefined}
              >
                <div
                  className={styles.metaphorTag}
                  data-beat-layout-item={sceneId === 2 ? "true" : undefined}
                >
                  {sceneId === 1
                    ? "THE BERNOULLI-BERYLLIUM ROTOR"
                    : sceneId === 2
                      ? "CONSERVED ANGULAR MOMENTUM (L = Iω)"
                      : sceneId === 3
                        ? "CONTROL MOMENT GYROSCOPE (CMG)"
                        : sceneId === 4
                          ? "SUB-ARCSECOND STABILITY (0.007″)"
                          : "CELESTIAL COMPASS"}
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

              <div className={styles.heroFooter}>
                <span>MOMENT OF INERTIA // I = 2/5 m r²</span>
                <span>ATTITUDE DETERMINATION & CONTROL SYSTEM (ADCS)</span>
              </div>
            </div>
          );
        }}
      />
    </div>
  );
}

export default defineTopic({
  id: "gyroscope-attitude-control",
  styleId: "object-metaphor-hero",
  title: { en: "Spacecraft Gyroscope", zh: "航天陀螺仪" },
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
        title: "Spacecraft Attitude Determination and Control (James R. Wertz)",
        url: "https://link.springer.com/book/9789027712042",
        supports:
          "Control moment gyroscope dynamics, angular momentum vector conservation, and sub-arcsecond reaction wheel stability.",
      },
    ],
  },
});

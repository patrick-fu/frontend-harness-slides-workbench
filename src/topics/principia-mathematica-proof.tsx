import {
  defineTopic,
  type TopicMetadata,
  type TopicStageProps,
} from "../domain/topic";
import SpatialSceneTrack from "../components/stage/SpatialSceneTrack";
import styles from "./principia-mathematica-proof.module.css";

const metadata: { en: TopicMetadata; zh: TopicMetadata } = {
  en: {
    theme: "Newton's Geometric Proof: Kepler's Laws Derived via Pure Geometry",
    densityLabel: "Dense",
    heroScene: 3,
    colors: {
      bg: "#0f141c",
      ink: "#f1e7d0",
      panel: "#18202c",
    },
    typography: {
      header: "Palatino 400 italic",
      body: "Palatino 300",
    },
    tags: ["physics", "geometry", "newton", "principia", "scholarly"],
    fonts: ["Palatino", "Georgia"],
    scenes: [
      {
        id: 1,
        title: "Discarding Calculus Symbols",
        beats: [
          {
            id: 0,
            action: "Open Principia Proposition I manuscript page",
            title: "Proving Gravity Without Calculus",
            body: "Isaac Newton withheld his fluxions (calculus), choosing Euclidean compass and straightedge geometry to prove orbital mechanics unassailably.",
          },
        ],
      },
      {
        id: 2,
        title: "Equal Areas in Equal Times",
        beats: [
          {
            id: 0,
            action: "Construct triangles swept by inertial motion",
            title: "Triangular Area Equivalence",
            body: "A particle travels along straight segments; centripetal impulses toward the sun shear the triangles without altering base or altitude area.",
          },
          {
            id: 1,
            action: "Take infinitesimal limit of triangular sectors",
            title: "Infinitesimal Sector Limit",
            body: "Taking the limit as time intervals shrink to zero proves Kepler's Second Law: equal areas swept in equal times by any central force.",
          },
        ],
      },
      {
        id: 3,
        title: "The Inverse-Square Necessity",
        beats: [
          {
            id: 0,
            action: "Derive 1/r^2 law from ellipse focal geometry",
            title: "Proposition XI: Inverse-Square Orbit",
            body: "Using conjugate diameters and subtense sagitta $\\lim (QR / QT^2)$, Newton proved elliptical orbits demand an exact inverse-square force: $F \\propto 1/r^2$.",
          },
        ],
      },
      {
        id: 4,
        title: "Centripetal Vector Synthesis",
        beats: [
          {
            id: 0,
            action: "Unify lunar orbit with falling apple",
            title: "Unification of Apple and Moon",
            body: "Comparing the moon's centripetal deflection ($0.00272\\text{ m/s}^2$) with terrestrial surface gravity ($9.81\\text{ m/s}^2$) confirms $(60\\times)^2$ scaling.",
          },
        ],
      },
      {
        id: 5,
        title: "Euclidean Geometry Zenith",
        beats: [
          {
            id: 0,
            action: "Complete philosophical scholium",
            title: "The Celestial Clockwork Proved",
            body: "Greek classical geometry reached its eternal summit: the laws governing the heavens were captured in pure, candlelit Euclidean proportions.",
          },
        ],
      },
    ],
  },
  zh: {
    theme: "万有引力几何证明：牛顿纯几何推导开普勒行星定律",
    densityLabel: "密集",
    heroScene: 3,
    colors: {
      bg: "#0f141c",
      ink: "#f1e7d0",
      panel: "#18202c",
    },
    typography: {
      header: "Palatino 400 italic",
      body: "Palatino 300",
    },
    tags: ["物理", "几何", "牛顿", "自然哲学的数学原理", "学者笔记"],
    fonts: ["Palatino", "Georgia"],
    scenes: [
      {
        id: 1,
        title: "抛弃微积分符号",
        beats: [
          {
            id: 0,
            action: "翻开《自然哲学的数学原理》命题一手稿",
            title: "以纯欧氏几何证明引力",
            body: "牛顿刻意隐匿了他初创的流数术（微积分），完全改用古希腊欧几里得圆规与直尺几何，构建无可辩驳的天体力学大厦。",
          },
        ],
      },
      {
        id: 2,
        title: "面积定律几何证",
        beats: [
          {
            id: 0,
            action: "构造惯性直线移动所扫过的三角形",
            title: "等底同高三角形面积等价",
            body: "质点沿折线飞行，指向太阳的有心脉冲瞬时拉扯质点，在几何上仅造成三角形剪切，底与高对应的面积严格守恒。",
          },
          {
            id: 1,
            action: "取时间微元无限趋近于零的几何极限",
            title: "微元无限细分的扇形极限",
            body: "当时间间隔无限趋于零，折线平滑逼近连续轨道，以纯几何严格证毕开普勒第二定律：向径在相等时间内扫过相等面积。",
          },
        ],
      },
      {
        id: 3,
        title: "平方反比必然性",
        beats: [
          {
            id: 0,
            action: "利用椭圆共轭直径与矢高证明 1/r^2",
            title: "命题十一：平方反比有心力",
            body: "借助椭圆几何性质与极限矢高 $\\lim (QR / QT^2)$，牛顿从数学上铁证：唯有严格的平方反比引力 ($F \\propto 1/r^2$) 才能维系椭圆轨道。",
          },
        ],
      },
      {
        id: 4,
        title: "苹果与月球统一",
        beats: [
          {
            id: 0,
            action: "对比地面重力加速度与月球向心加速度",
            title: "月亮与坠落苹果的统一",
            body: "月球轨道向心偏折加速度 ($0.00272\\text{ m/s}^2$) 恰为地面落体重力加速度 ($9.81\\text{ m/s}^2$) 的 $1/60^2$，天地引力彻底统一。",
          },
        ],
      },
      {
        id: 5,
        title: "欧氏几何的巅峰",
        beats: [
          {
            id: 0,
            action: "写下《原理》终章总释",
            title: "烛光下欧氏几何的绝唱",
            body: "古典几何学在此刻登临万世巅峰：束缚星辰周转的天道法则，被完整镌刻进了羊皮卷上静穆的欧几里得比例线段之中。",
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
        transitionKind="fade"
        transitionMap={{
          "1->2": "fade",
          "2->3": "crossfade",
          "3->4": "fade",
          "4->5": "scale-fade",
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
              <header className={styles.vellumHeader}>
                <span>
                  {language === "zh"
                    ? "牛顿《自然哲学的数学原理》手稿"
                    : "PRINCIPIA MATHEMATICA // NEWTON, 1687"}
                </span>
                <span>LIBER I // SECT. II</span>
              </header>

              <div
                className={styles.manuscriptBody}
                data-beat-layout-container={
                  sceneId === 2 ? "true" : undefined
                }
                data-beat-layout-mode={sceneId === 2 ? "motion" : undefined}
              >
                <div
                  className={styles.propositionLabel}
                  data-beat-layout-item={sceneId === 2 ? "true" : undefined}
                >
                  PROPOSITIO 0{sceneId} // THEOREMA 0{sceneId}
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

              <div className={styles.pinAnnotation}>
                <span>MS. CAMBRIDGE ADD. 3965 // FOLIO 14R</span>
                <br />
                <span>Q.E.D. // PROPORTIO GEOMETRICA</span>
              </div>
            </div>
          );
        }}
      />
    </div>
  );
}

export default defineTopic({
  id: "principia-mathematica-proof",
  styleId: "scholars-vellum",
  title: { en: "Newton's Geometric Proof", zh: "万有引力几何证" },
  modelId: "Gemini 3.7 Flash",
  Stage: TopicStage,
  metadata,
  navigation: { mode: "none" },
  transitionScore: {
    "1->2": "fade",
    "2->3": "crossfade",
    "3->4": "fade",
    "4->5": "scale-fade",
  },
  evidence: {
    kind: "facts",
    sources: [
      {
        title:
          "Philosophiae Naturalis Principia Mathematica (Isaac Newton, 1687)",
        url: "https://cudl.lib.cam.ac.uk/view/PR-ADV-B-00039-00001/1",
        supports:
          "Geometric derivation of Kepler's second law and inverse-square gravitational attraction.",
      },
    ],
  },
});

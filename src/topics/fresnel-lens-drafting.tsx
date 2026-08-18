import {
  defineTopic,
  type TopicMetadata,
  type TopicStageProps,
} from "../domain/topic";
import SpatialSceneTrack from "../components/stage/SpatialSceneTrack";
import styles from "./fresnel-lens-drafting.module.css";

const metadata: { en: TopicMetadata; zh: TopicMetadata } = {
  en: {
    theme: "The Fresnel Lens: Concentric Stepped Optical Blueprint",
    densityLabel: "Dense",
    heroScene: 3,
    colors: {
      bg: "#0c2340",
      ink: "#e2edfc",
      panel: "#102f54",
    },
    typography: {
      header: "Monospace 700",
      body: "Monospace 400",
    },
    tags: ["optics", "engineering", "blueprint", "fresnel", "cyanotype"],
    fonts: ["Courier New", "monospace"],
    scenes: [
      {
        id: 1,
        title: "The Thick Glass Deadlock",
        beats: [
          {
            id: 0,
            action: "Draft traditional thick plano-convex lens cross-section",
            title: "Bulk Absorption Barrier",
            body: "Early lighthouse lenses weighed thousands of kilograms; massive central glass thickness absorbed over 50% of emitted light.",
          },
        ],
      },
      {
        id: 2,
        title: "Stripping Inactive Mass",
        beats: [
          {
            id: 0,
            action: "Identify inactive internal glass volume",
            title: "Refraction Only at Surfaces",
            body: "Augustin-Jean Fresnel recognized that refraction occurs exclusively at boundaries—the bulk glass interior is dead weight.",
          },
          {
            id: 1,
            action: "Project surface curvature onto single focal plane",
            title: "Planar Curvature Projection",
            body: "Collapsing continuous spherical curvature onto a flat plane eliminates 85% of lens volume while preserving focal geometry.",
          },
        ],
      },
      {
        id: 3,
        title: "Stepped Concentric Rings",
        beats: [
          {
            id: 0,
            action: "Section lens into concentric annular prism steps",
            title: "Annular Stepped Prisms",
            body: "The continuous surface becomes a series of concentric rings; each zone acts as an independent prism with precise angle step.",
          },
          {
            id: 1,
            action: "Integrate catadioptric total internal reflection rings",
            title: "Outer Catadioptric Rings",
            body: "Outer peripheral rings employ total internal reflection (catadioptrics) to capture wide-angle rays beyond 45 degrees.",
          },
        ],
      },
      {
        id: 4,
        title: "Parallel Beam Collimation",
        beats: [
          {
            id: 0,
            action: "Trace divergent point source rays into parallel beam",
            title: "Zero-Divergence Horizon",
            body: "Omnidirectional lamp flame emission is captured and focused into an intense horizontal beam visible over 20 nautical miles.",
          },
        ],
      },
      {
        id: 5,
        title: "Lightweight Revolution",
        beats: [
          {
            id: 0,
            action: "Complete blueprint signature block",
            title: "Victory of Surface over Mass",
            body: "By stripping inactive bulk matter, engineering achieved maximum luminous efficacy through pure geometric boundary design.",
          },
        ],
      },
    ],
  },
  zh: {
    theme: "菲涅尔透镜：同心阶梯光学工程蓝图",
    densityLabel: "密集",
    heroScene: 3,
    colors: {
      bg: "#0c2340",
      ink: "#e2edfc",
      panel: "#102f54",
    },
    typography: {
      header: "Monospace 700",
      body: "Monospace 400",
    },
    tags: ["光学", "工程", "蓝图", "菲涅尔", "蓝图制图"],
    fonts: ["Courier New", "monospace"],
    scenes: [
      {
        id: 1,
        title: "厚玻璃吸收死结",
        beats: [
          {
            id: 0,
            action: "绘制传统厚平凸透镜截面图",
            title: "实体吸收物理屏障",
            body: "早期灯塔巨型凸透镜重达数吨，中央过厚的玻璃实体吸收了超过 50% 的初始光通量。",
          },
        ],
      },
      {
        id: 2,
        title: "剥离无用实体",
        beats: [
          {
            id: 0,
            action: "识别透镜内部无用介质",
            title: "折射仅发生于表面界面",
            body: "菲涅尔洞察到光的折射仅取决于表面曲率界面，透镜内部厚实的实体玻璃对汇聚毫无贡献。",
          },
          {
            id: 1,
            action: "将曲面投影至基准平面",
            title: "曲面平面化投影",
            body: "将连续球面曲率沿基线向下压缩，在保留光学焦距的同时剔除了 85% 的多余自重。",
          },
        ],
      },
      {
        id: 3,
        title: "同心环棱镜阶梯",
        beats: [
          {
            id: 0,
            action: "将透镜切削为同心环带阶梯",
            title: "同心环带折射棱镜",
            body: "连续曲面被分割为一组同心环状棱镜阶梯，每个环带具备经过微积分精确计算的偏折角。",
          },
          {
            id: 1,
            action: "加入外圈折反射全反射棱镜",
            title: "外圈折反射全反射",
            body: "最外圈采用全反射折反射棱镜（Catadioptrics），将超过 45 度的发散大角度杂散光全部捕获。",
          },
        ],
      },
      {
        id: 4,
        title: "平行光束汇聚",
        beats: [
          {
            id: 0,
            action: "追踪点光源发散光线校正为平行光束",
            title: "零色散平行光束",
            body: "来自焦点的发散灯火光线穿透阶梯后被绝对校正为高准直平行光，夜间射程跃升至 20 海里以上。",
          },
        ],
      },
      {
        id: 5,
        title: "极简几何革命",
        beats: [
          {
            id: 0,
            action: "完成制图台工程签章",
            title: "表面几何对实体的胜利",
            body: "彻底剥离无用质量，工程学的终极之美在于用纯粹的边界几何取代沉重盲目的物质堆叠。",
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
          "2->3": "push-x",
          "3->4": "push-x",
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
              <div className={styles.drawingHeader}>
                <span>
                  {language === "zh"
                    ? "菲涅尔光学蓝图 DWG-1822"
                    : "FRESNEL OPTICAL BLUEPRINT // DWG-1822"}
                </span>
                <span>SHEET {sceneId} OF 5</span>
              </div>

              <div
                className={styles.drawingMain}
                data-beat-layout-container={
                  sceneId === 2 || sceneId === 3 ? "true" : undefined
                }
                data-beat-layout-mode={
                  sceneId === 2 || sceneId === 3 ? "motion" : undefined
                }
              >
                <div
                  className={styles.dimensionTag}
                  data-beat-layout-item={
                    sceneId === 2 || sceneId === 3 ? "true" : undefined
                  }
                >
                  SEC-0{sceneId} // DIMENSION ANGLE &radic;
                </div>
                <h1
                  className={styles.drawingTitle}
                  data-beat-layout-item={
                    sceneId === 2 || sceneId === 3 ? "true" : undefined
                  }
                >
                  {currentBeat.title}
                </h1>
                <p
                  className={styles.drawingBody}
                  data-beat-layout-item={
                    sceneId === 2 || sceneId === 3 ? "true" : undefined
                  }
                >
                  {currentBeat.body}
                </p>
              </div>

              <div className={styles.titleBlock}>
                <span className={styles.titleBlockLabel}>SCALE:</span>
                <span className={styles.titleBlockVal}>1:10 ORTHOGRAPHIC</span>
                <span className={styles.titleBlockLabel}>MATERIAL:</span>
                <span className={styles.titleBlockVal}>STEPPED CROWN GLASS</span>
              </div>
            </div>
          );
        }}
      />
    </div>
  );
}

export default defineTopic({
  id: "fresnel-lens-drafting",
  styleId: "cyanotype-drafting-table",
  title: { en: "The Fresnel Lens", zh: "菲涅尔透镜" },
  modelId: "Gemini 3.7 Flash",
  Stage: TopicStage,
  metadata,
  navigation: { mode: "none" },
  transitionScore: {
    "1->2": "crossfade",
    "2->3": "push-x",
    "3->4": "push-x",
    "4->5": "crossfade",
  },
  evidence: {
    kind: "facts",
    sources: [
      {
        title: "Mémoire sur un nouveau système d'éclairage des phares (1822)",
        url: "https://gallica.bnf.fr/ark:/12148/bpt6k96120935",
        supports:
          "Elimination of central lens mass and concentric annular prism design.",
      },
    ],
  },
});

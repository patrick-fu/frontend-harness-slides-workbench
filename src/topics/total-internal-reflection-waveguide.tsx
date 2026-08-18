import {
  defineTopic,
  type TopicMetadata,
  type TopicStageProps,
} from "../domain/topic";
import SpatialSceneTrack from "../components/stage/SpatialSceneTrack";
import styles from "./total-internal-reflection-waveguide.module.css";

const metadata: { en: TopicMetadata; zh: TopicMetadata } = {
  en: {
    theme: "Fiber Waveguide: Total Internal Reflection Trapping Light in Glass",
    densityLabel: "Balanced",
    heroScene: 3,
    colors: {
      bg: "#020617",
      ink: "#f8fafc",
      panel: "#0f172a",
    },
    typography: {
      header: "System-ui 800",
      body: "System-ui 400",
    },
    tags: ["optics", "physics", "fiber", "liquid-glass", "telecom"],
    fonts: ["System-ui"],
    scenes: [
      {
        id: 1,
        title: "The Glass Interface Gradient",
        beats: [
          {
            id: 0,
            action: "Establish high-index core and low-index cladding",
            title: "Core vs Cladding Index Differential",
            body: "High-purity fused silica core ($n_1 = 1.48$) is encapsulated in a lower refractive index cladding ($n_2 = 1.46$).",
          },
        ],
      },
      {
        id: 2,
        title: "The Critical Angle Threshold",
        beats: [
          {
            id: 0,
            action: "Demonstrate Snell's law critical angle jump",
            title: "Critical Angle Transition (81.3°)",
            body: "At incident angles $\\theta > \\arcsin(n_2/n_1) \\approx 81.3^\\circ$, refracted rays vanish, reflecting 100% of light energy back into the glass core.",
          },
          {
            id: 1,
            action: "Abolish surface transmission loss",
            title: "Zero Decibel Boundary Loss",
            body: "Unlike silvered metallic mirrors that absorb 1% of energy per bounce, total internal reflection is mathematically lossless.",
          },
        ],
      },
      {
        id: 3,
        title: "Multi-Mode Zigzag Bouncing",
        beats: [
          {
            id: 0,
            action: "Trace millions of ray bounces along bent fiber strand",
            title: "Trapped Photons Around Physical Bends",
            body: "Light bounces millions of times per meter inside a 50-micron glass filament, following tortuous fiber curves without leaking a photon.",
          },
        ],
      },
      {
        id: 4,
        title: "Single-Mode 9-Micron Core",
        beats: [
          {
            id: 0,
            action: "Shrink core to 9 microns to eliminate modal dispersion",
            title: "Single-Mode Planar Wavefront",
            body: "Shrinking core diameter to 9 micrometers eliminates intermodal delay, guiding optical solitons thousands of kilometers unblurred.",
          },
        ],
      },
      {
        id: 5,
        title: "The Glass Nervous System",
        beats: [
          {
            id: 0,
            action: "Synthesize global subsea and terrestrial fiber grid",
            title: "Planetary Luminous Substrate",
            body: "From microscopic silica boundaries to transatlantic conduits, total internal reflection forms the transparent nervous system of the earth.",
          },
        ],
      },
    ],
  },
  zh: {
    theme: "光纤全反射：高纯度玻璃丝中的光束禁锢与波导传导",
    densityLabel: "均衡",
    heroScene: 3,
    colors: {
      bg: "#020617",
      ink: "#f8fafc",
      panel: "#0f172a",
    },
    typography: {
      header: "System-ui 800",
      body: "System-ui 400",
    },
    tags: ["光学", "物理", "光纤", "液态玻璃", "通信"],
    fonts: ["System-ui"],
    scenes: [
      {
        id: 1,
        title: "玻璃界面折射率差",
        beats: [
          {
            id: 0,
            action: "确立纤芯与包层的高低折射率梯度",
            title: "纤芯与包层折射率分层",
            body: "高纯度二氧化硅玻璃纤芯（$n_1 = 1.48$）被包裹在折射率略低的掺氟玻璃包层（$n_2 = 1.46$）之中。",
          },
        ],
      },
      {
        id: 2,
        title: "临界角全反射发生",
        beats: [
          {
            id: 0,
            action: "斯涅尔定律推导临界角完全反射",
            title: "81.3度临界角全内反射",
            body: "当光线入射角大于临界角 $\\theta_c = \\arcsin(n_2/n_1) \\approx 81.3^\\circ$ 时，折射光完全消失，100% 的光能被无损反弹回纤芯。",
          },
          {
            id: 1,
            action: "展示无损全反射对比金属反射镜的优越性",
            title: "零分贝边界无损反射",
            body: "不同于金属镀银镜面每次反射损耗 1% 的能量，介质全内反射在数学与物理上完全没有透射能量衰减。",
          },
        ],
      },
      {
        id: 3,
        title: "多模微管光束弹跳",
        beats: [
          {
            id: 0,
            action: "光脉冲在弯曲玻璃丝内每米弹跳数百万次",
            title: "光子在弯曲玻璃丝中弹跳",
            body: "在 50 微米的多模光纤内，光脉冲以每秒二十万公里的速度连续弹跳数百万次，即使光纤在物理上弯曲成环亦绝不外泄。",
          },
        ],
      },
      {
        id: 4,
        title: "9微米单模平直波前",
        beats: [
          {
            id: 0,
            action: "纤芯缩至 9 微米消除模间色散",
            title: "9 微米单模平直光波前",
            body: "将纤芯直径压缩至 9 微米（接近光波长），几何弹跳消失，光波作为单一模式平直传导数千公里而波形不发生弥散。",
          },
        ],
      },
      {
        id: 5,
        title: "全球透明光脉络",
        beats: [
          {
            id: 0,
            action: "总结全内反射构建的地球透明光血管",
            title: "点亮地球的透明玻璃网络",
            body: "从微观二氧化硅折射边界到深海越洋光缆，全内反射定律将透明的玻璃细丝雕琢成了人类文明最坚韧的信息血管。",
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
              <header className={styles.glassHeader}>
                <span>
                  {language === "zh"
                    ? "液态玻璃 · 光学波导系统"
                    : "LIQUID GLASS // OPTICAL WAVEGUIDE"}
                </span>
                <span>CORE: 9µm // n1/n2 STEP</span>
              </header>

              <div
                className={styles.glassCard}
                data-beat-layout-container={sceneId === 2 ? "true" : undefined}
                data-beat-layout-mode={sceneId === 2 ? "motion" : undefined}
              >
                <div
                  className={styles.refractionIndexTag}
                  data-beat-layout-item={sceneId === 2 ? "true" : undefined}
                >
                  INDEX OF REFRACTION // n1 = 1.482 // n2 = 1.460
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

              <footer className={styles.glassFooter}>
                <span>CRITICAL ANGLE: 81.3 DEGREES // SNELL LAW</span>
                <span>TOTAL INTERNAL REFLECTION (TIR) SPECIFICATION</span>
              </footer>
            </div>
          );
        }}
      />
    </div>
  );
}

export default defineTopic({
  id: "total-internal-reflection-waveguide",
  styleId: "liquid-glass",
  title: { en: "Fiber Waveguide", zh: "光纤全反射" },
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
        title: "Optics and Optical Waveguide Theory (Snyder & Love)",
        url: "https://www.springer.com/gp/book/9780412099502",
        supports:
          "Total internal reflection, critical angle derivation, and single-mode 9µm core dispersion.",
      },
    ],
  },
});

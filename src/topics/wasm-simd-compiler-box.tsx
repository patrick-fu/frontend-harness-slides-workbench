import {
  defineTopic,
  type TopicMetadata,
  type TopicStageProps,
} from "../domain/topic";
import SpatialSceneTrack from "../components/stage/SpatialSceneTrack";
import styles from "./wasm-simd-compiler-box.module.css";

const metadata: { en: TopicMetadata; zh: TopicMetadata } = {
  en: {
    theme: "Runtime Architecture: WebAssembly 128-Bit Fixed-Width SIMD Vectorization",
    densityLabel: "Dense",
    heroScene: 3,
    colors: {
      bg: "#0a0f1d",
      ink: "#f8fafc",
      panel: "#161e31",
    },
    typography: {
      header: "Inter 700",
      body: "Inter 400",
    },
    tags: ["wasm", "simd", "compiler", "bento-box", "webassembly"],
    fonts: ["Inter", "sans-serif"],
    scenes: [
      {
        id: 1,
        title: "128-Bit Vector Core",
        beats: [
          {
            id: 0,
            action: "Present the 128-bit fixed-width WASM SIMD architecture tile",
            title: "Fixed-Width v128 Type Primitive",
            body: "WebAssembly SIMD introduces a portable 128-bit vector type (`v128`), compiling directly into x86 SSE/AVX and ARM NEON registers.",
          },
        ],
      },
      {
        id: 2,
        title: "Aligned Vector Load",
        beats: [
          {
            id: 0,
            action: "Execute single-cycle aligned vector memory loads",
            title: "v128.load Memory Packing",
            body: "A single `v128.load` instruction fetches 16 contiguous bytes from linear memory in one CPU cycle, eliminating scalar loop overhead.",
          },
          {
            id: 1,
            action: "Demonstrate cross-lane shuffle operations",
            title: "i8x16.shuffle Cross-Lane Permutation",
            body: "Byte shuffle instructions rearrange arbitrary lane elements within vector registers without round-tripping to main memory.",
          },
        ],
      },
      {
        id: 3,
        title: "4x Parallel F32 Pipeline",
        beats: [
          {
            id: 0,
            action: "Execute 4 simultaneous single-precision float additions per clock tick",
            title: "f32x4.add Quad-Lane Pipeline",
            body: "Four 32-bit floating point arithmetic operations execute in lockstep across vector execution pipelines within a single clock cycle.",
          },
        ],
      },
      {
        id: 4,
        title: "Deterministic Sandboxing",
        beats: [
          {
            id: 0,
            action: "Preserve strict WebAssembly trap semantics and NaN canonicalization",
            title: "Safe Sandboxed Traps & Determinism",
            body: "Hardware floating-point variations are strictly canonicalized to prevent CPU side-channel leaks across browser sandbox domains.",
          },
        ],
      },
      {
        id: 5,
        title: "4x Multimedia Acceleration",
        beats: [
          {
            id: 0,
            action: "Benchmark machine learning, computer vision, and audio DSP gains in the browser",
            title: "4x Real-Time Multimedia Leap",
            body: "WASM SIMD unlocks 60 FPS real-time background blur and in-browser ONNX neural inference without native plugin dependencies.",
          },
        ],
      },
    ],
  },
  zh: {
    theme: "运行时架构：WebAssembly 128 位定宽 SIMD 向量化加速便当盒",
    densityLabel: "密集",
    heroScene: 3,
    colors: {
      bg: "#0a0f1d",
      ink: "#f8fafc",
      panel: "#161e31",
    },
    typography: {
      header: "Inter 700",
      body: "Inter 400",
    },
    tags: ["WASM", "SIMD", "编译器", "便当盒", "WebAssembly"],
    fonts: ["Inter", "sans-serif"],
    scenes: [
      {
        id: 1,
        title: "128位定宽向量核心",
        beats: [
          {
            id: 0,
            action: "展示 WebAssembly 规范中的 128 位定宽 v128 原生向量类型便当分区",
            title: "跨平台 v128 原生定宽向量基元",
            body: "WebAssembly 规范引入 128 位通用向量基元（`v128`），可 1:1 无缝直译编译为 x86 SSE/AVX 与 ARM NEON 原生底层寄存器指令。",
          },
        ],
      },
      {
        id: 2,
        title: "对齐内存批量载入",
        beats: [
          {
            id: 0,
            action: "单周期批量载入 16 字节连续线性内存",
            title: "v128.load 连续内存单周期载入",
            body: "一条 `v128.load` 指令在一个时钟周期内将 16 字节连续线性内存直接灌入向量寄存器，消灭标量寻址开销。",
          },
          {
            id: 1,
            action: "展示跨通道洗牌指令",
            title: "i8x16.shuffle 跨通道重组",
            body: "字节级洗牌指令无需内存往返，直接在 CPU 向量寄存器内部实现多通道数据的任意排列组合与重映射。",
          },
        ],
      },
      {
        id: 3,
        title: "四路浮点并发管线",
        beats: [
          {
            id: 0,
            action: "展示四路 32 位单精度浮点并发运算指令管线",
            title: "f32x4.add 四路浮点单周期并行",
            body: "单条 SIMD 指令驱动 4 个 32 位单精度浮点数同步执行加减乘除流水线，算术吞吐量理论拉升整整 4 倍。",
          },
        ],
      },
      {
        id: 4,
        title: "沙箱确定性安全边界",
        beats: [
          {
            id: 0,
            action: "维持 WebAssembly 严格的内存越界陷阱与 NaN 规范化",
            title: "沙箱隔离与 NaN 确定性规范化",
            body: "跨架构的浮点差异经规范化处理抹平，保持 WebAssembly 严苛的越界 Trap 保护机制，防止侧信道漏洞利用。",
          },
        ],
      },
      {
        id: 5,
        title: "4倍音视频端侧加速",
        beats: [
          {
            id: 0,
            action: "总结浏览器内运行 ONNX 神经网络与音视频 DSP 提速 4 倍的实践突破",
            title: "端侧 4 倍多媒体实时计算突破",
            body: "WASM SIMD 让浏览器内实时 60 帧视频虚化与 ONNX 轻量级神经网络推理成为现实，彻底解放纯 Web 算力上限。",
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
              <div className={styles.bentoHeader}>
                <span className={styles.bentoTag}>
                  WASM RUNTIME // 128-BIT SIMD ARCHITECTURE
                </span>
                <span className={styles.vectorSpec}>x86_64 AVX / ARM64 NEON</span>
              </div>

              <div
                className={styles.bentoGrid}
                data-beat-layout-container={sceneId === 2 ? "true" : undefined}
                data-beat-layout-mode={sceneId === 2 ? "motion" : undefined}
              >
                <div
                  className={styles.mainCell}
                  data-beat-layout-item={sceneId === 2 ? "true" : undefined}
                >
                  <div className={styles.cellBadge}>
                    MODULE 0{sceneId} // {language === "zh" ? "便当盒模块" : "BENTO MODULE"}
                  </div>
                  <h1 className={styles.sceneTitle}>{currentBeat.title}</h1>
                  <p className={styles.sceneBody}>{currentBeat.body}</p>
                </div>

                <div
                  className={styles.sideCell}
                  data-beat-layout-item={sceneId === 2 ? "true" : undefined}
                >
                  <div className={styles.sideKey}>REGISTER MAP</div>
                  <div className={styles.sideVal}>128-Bit Vector (v128)</div>
                  <div className={styles.sideKey}>LANE FORMAT</div>
                  <div className={styles.sideVal}>i8x16 | i16x8 | i32x4 | f32x4</div>
                  <div className={styles.sideKey}>THROUGHPUT</div>
                  <div className={styles.sideVal}>4x FLOPs / Cycle</div>
                </div>
              </div>

              <div className={styles.bentoFooter}>
                <span>W3C WEBASSEMBLY 2.0 SPECIFICATION</span>
                <span>JIT NATIVE EMISSION</span>
              </div>
            </div>
          );
        }}
      />
    </div>
  );
}

export default defineTopic({
  id: "wasm-simd-compiler-box",
  styleId: "context-bento-box",
  title: { en: "WASM SIMD Runtime Box", zh: "WASM向量加速" },
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
        title: "WebAssembly 128-bit Fixed-width SIMD Specification",
        url: "https://github.com/WebAssembly/simd",
        supports:
          "v128 primitive, memory-aligned vector loading, f32x4.add execution, and JIT translation to SSE/NEON.",
      },
    ],
  },
});

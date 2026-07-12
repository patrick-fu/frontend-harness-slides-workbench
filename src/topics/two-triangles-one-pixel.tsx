import { useState } from "react";
import SpatialSceneTrack, {
  type SceneTransitionMap,
} from "../components/stage/SpatialSceneTrack";
import {
  defineTopic,
  type TopicMetadata,
  type TopicStageProps,
  type TopicTransitionScore,
} from "../domain/topic";
import styles from "./two-triangles-one-pixel.module.css";

/*
 * Private visual system: "Raster Flight Lab" — an engineering whiteboard where
 * two candidate triangles chase one target pixel through a real-time raster
 * pipeline. Audience copy never names this system.
 */

type Lang = "en" | "zh";

const cx = (...values: Array<string | false | undefined>): string =>
  values.filter(Boolean).join(" ");

const metadata: { en: TopicMetadata; zh: TopicMetadata } = {
  en: {
    theme:
      "A white engineering canvas where two triangles race a single target pixel through the vertex, clip, raster, shade, depth and framebuffer stages of a real-time pipeline.",
    densityLabel: "Explainer",
    heroScene: 4,
    colors: { bg: "#ffffff", ink: "#23272e", panel: "#f6f8fb" },
    typography: {
      header: "LXGW WenKai / Caveat",
      body: "JetBrains Mono",
    },
    tags: [
      "engineering",
      "whiteboard",
      "explainer",
      "graphics",
      "rasterization",
      "gpu-pipeline",
      "developer-education",
    ],
    fonts: ["JetBrains Mono", "Caveat", "cjk:LXGW WenKai"],
    scenes: [
      {
        id: 1,
        title: "One Pixel, Two Claims",
        beats: [
          {
            id: 0,
            action: "converge",
            title: "Two triangles can fight over one pixel",
            body: "Both cover the same target cell. Only one color survives.",
          },
        ],
      },
      {
        id: 2,
        title: "Place the Vertices",
        beats: [
          {
            id: 0,
            action: "transform",
            title: "First, every corner becomes a coordinate",
            body: "Vertices are pinned in clip space, not on the screen yet.",
          },
          {
            id: 1,
            action: "clip",
            title: "Whatever falls off-screen is clipped away",
            body: "Clipping trims outside geometry before it can cost work.",
          },
        ],
      },
      {
        id: 3,
        title: "Turn Area into Fragments",
        beats: [
          {
            id: 0,
            action: "grid",
            title: "The screen is really a grid of cells",
            body: "Rasterization asks which cells each triangle touches.",
          },
          {
            id: 1,
            action: "cover",
            title: "Each covered cell becomes a candidate fragment",
            body: "A fragment is a maybe-pixel, not a pixel yet.",
          },
          {
            id: 2,
            action: "interpolate",
            title: "Corner values are interpolated across the face",
            body: "Color and depth are blended in from the three vertices.",
          },
        ],
      },
      {
        id: 4,
        title: "Shade, then Reject",
        beats: [
          {
            id: 0,
            action: "shade",
            title: "The shader paints each candidate a color",
            body: "Two fragments now hold two finished colors.",
          },
          {
            id: 1,
            action: "depth-test",
            title: "At the depth gate, the nearer one wins",
            body: "Coral z=0.28 sits in front of cyan z=0.72.",
          },
          {
            id: 2,
            action: "reject",
            title: "The far fragment did real work, then lost",
            body: "Its shading is thrown away — that is overdraw.",
          },
        ],
      },
      {
        id: 5,
        title: "Commit One Pixel",
        beats: [
          {
            id: 0,
            action: "write",
            title: "The winner writes into the framebuffer",
            body: "Opaque fragments overwrite; transparent ones blend.",
          },
          {
            id: 1,
            action: "resolve",
            title: "A pixel is a survivor, not a stroke",
            body: "What you see is the fragment that made it through.",
          },
        ],
      },
    ],
  },
  zh: {
    theme:
      "一张白色工程画板：两个三角形争夺同一个目标像素，穿过顶点、裁剪、光栅、着色、深度与帧缓冲这条实时渲染流水线。",
    densityLabel: "讲解",
    heroScene: 4,
    colors: { bg: "#ffffff", ink: "#23272e", panel: "#f6f8fb" },
    typography: {
      header: "LXGW WenKai / Caveat",
      body: "JetBrains Mono",
    },
    tags: [
      "engineering",
      "whiteboard",
      "explainer",
      "graphics",
      "rasterization",
      "gpu-pipeline",
      "developer-education",
    ],
    fonts: ["JetBrains Mono", "Caveat", "cjk:LXGW WenKai"],
    scenes: [
      {
        id: 1,
        title: "一个像素，两方争夺",
        beats: [
          {
            id: 0,
            action: "converge",
            title: "两个三角形能抢同一个像素",
            body: "它们都盖住了那个格子，但最后只能留下一种颜色。",
          },
        ],
      },
      {
        id: 2,
        title: "先安放顶点",
        beats: [
          {
            id: 0,
            action: "transform",
            title: "第一步，每个角都变成坐标",
            body: "顶点先被钉在裁剪空间里，还没落到屏幕上。",
          },
          {
            id: 1,
            action: "clip",
            title: "掉出画面的部分会被剪掉",
            body: "裁剪在耗费算力之前，先修掉视野之外的几何。",
          },
        ],
      },
      {
        id: 3,
        title: "把面积拆成片元",
        beats: [
          {
            id: 0,
            action: "grid",
            title: "屏幕其实是一格格的网格",
            body: "光栅化要问：每个三角形碰到了哪些格子。",
          },
          {
            id: 1,
            action: "cover",
            title: "每个被覆盖的格子成为候选片元",
            body: "片元只是“候选像素”，还不是像素。",
          },
          {
            id: 2,
            action: "interpolate",
            title: "顶点上的值沿着面被插值",
            body: "颜色和深度从三个顶点混合进来。",
          },
        ],
      },
      {
        id: 4,
        title: "先着色，再淘汰",
        beats: [
          {
            id: 0,
            action: "shade",
            title: "着色器给每个候选涂上颜色",
            body: "两个片元现在各自拿到一种成品颜色。",
          },
          {
            id: 1,
            action: "depth-test",
            title: "在深度门前，更近的一方胜出",
            body: "珊瑚色 z=0.28 挡在青色 z=0.72 前面。",
          },
          {
            id: 2,
            action: "reject",
            title: "远处的片元做了活，却输了",
            body: "它的着色被丢弃——这就是过度绘制。",
          },
        ],
      },
      {
        id: 5,
        title: "写定这一个像素",
        beats: [
          {
            id: 0,
            action: "write",
            title: "胜出者写进帧缓冲",
            body: "不透明片元直接覆盖，透明的则做混合。",
          },
          {
            id: 1,
            action: "resolve",
            title: "像素是幸存者，不是一笔画",
            body: "你看到的，是穿过流水线活下来的那个片元。",
          },
        ],
      },
    ],
  },
};

const transitionScore: TopicTransitionScore = {
  "1->2": "zoom-through",
  "2->3": "grid-reveal",
  "3->4": "focus-swap",
  "4->5": "split-merge",
};

const transitionMap: SceneTransitionMap = {
  "1->2": "zoom-through",
  "2->3": "grid-reveal",
  "3->4": "focus-swap",
  "4->5": "split-merge",
};

const PIPELINE_STAGES: Record<Lang, string[]> = {
  en: ["Vertex", "Clip", "Raster", "Shade", "Depth · Blend", "Buffer"],
  zh: ["顶点", "裁剪", "光栅", "着色", "深度·混合", "帧缓冲"],
};

const ACTIVE_STAGES: Record<number, number[]> = {
  1: [5],
  2: [0, 1],
  3: [2],
  4: [3, 4],
  5: [5],
};

const TOKENS: Record<string, string> = {
  "1-0": "1 px  ←  2 △",
  "2-0": "v( x, y, z, w )",
  "2-1": "clip → discard",
  "3-0": "grid[ x ][ y ]",
  "3-1": "fragment[ ]",
  "3-2": "lerp( v0, v1, v2 )",
  "4-0": "shade( )",
  "4-1": "0.28  <  0.72",
  "4-2": "overdraw++",
  "5-0": "write | blend",
  "5-1": "pixel = survivor",
};

const UI = {
  kicker: { en: "Raster path", zh: "光栅路径" },
  near: { en: "near", zh: "近" },
  far: { en: "far", zh: "远" },
  candidate: { en: "candidate", zh: "候选" },
  coverage: { en: "coverage", zh: "覆盖" },
  target: { en: "target pixel", zh: "目标像素" },
  clipped: { en: "clipped", zh: "已裁剪" },
  keep: { en: "keep", zh: "保留" },
  shade: { en: "shade", zh: "着色" },
  pass: { en: "pass", zh: "通过" },
  reject: { en: "reject", zh: "淘汰" },
  overdraw: { en: "overdraw", zh: "过度绘制" },
  write: { en: "write", zh: "写入" },
  blend: { en: "blend", zh: "混合" },
  survivor: { en: "survivor", zh: "幸存者" },
  fragment: { en: "fragment", zh: "片元" },
  inspect: { en: "Inspect the winning pixel", zh: "检视胜出像素" },
  inspectShort: { en: "Pixel Inspector", zh: "像素检视器" },
  gotoVertex: { en: "Jump to vertices", zh: "跳到顶点" },
  gotoDepth: { en: "Jump to depth gate", zh: "跳到深度门" },
  result: { en: "result", zh: "结果" },
  wins: { en: "coral wins", zh: "珊瑚色胜" },
} as const;

function label(entry: { en: string; zh: string }, language: Lang): string {
  return entry[language];
}

function VertexPin({ tone }: { tone: "cyan" | "coral" | "ink" }) {
  return (
    <span className={cx(styles.pin, styles[`pin_${tone}`])} aria-hidden="true">
      📍
    </span>
  );
}

function SceneOne({ language }: { language: Lang }) {
  const t = (u: keyof typeof UI) => label(UI[u], language);
  return (
    <div className={styles.diagram} data-scene-diagram="1">
      <div className={styles.duelField}>
        <div className={cx(styles.tri, styles.triCyan)} aria-hidden="true">
          <span className={styles.triTag}>△ cyan · z 0.72 · {t("far")}</span>
        </div>
        <svg className={styles.travelLayer} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <path className={styles.travelPath} d="M18,20 Q40,42 49,49" />
          <path className={styles.travelPath} d="M82,80 Q60,58 51,51" />
        </svg>
        <div className={styles.targetPixel} aria-hidden="true">
          <span className={styles.crosshair} />
          <span className={styles.collision}>💥</span>
          <span className={styles.targetLabel}>{t("target")}</span>
        </div>
        <div className={cx(styles.tri, styles.triCoral)} aria-hidden="true">
          <span className={styles.triTag}>△ coral · z 0.28 · {t("near")}</span>
        </div>
      </div>
    </div>
  );
}

function SceneTwo({ language, beat }: { language: Lang; beat: number }) {
  const t = (u: keyof typeof UI) => label(UI[u], language);
  const clipped = beat >= 1;
  return (
    <div className={styles.diagram} data-scene-diagram="2">
      <div
        className={styles.vertexScene}
        data-beat-layout-container="true"
        data-beat-layout-mode="reserved"
      >
        <div className={styles.tunnel} aria-hidden="true">
          <span className={styles.tunnelRing} />
          <span className={styles.tunnelRing} />
          <span className={styles.tunnelRing} />
          <span className={styles.tunnelCore} />
        </div>
        <div className={cx(styles.vpin, styles.vpin_a)} data-beat-layout-item="true">
          <VertexPin tone="ink" />
          <code className={styles.coord}>v0 (-0.6, 0.4)</code>
        </div>
        <div className={cx(styles.vpin, styles.vpin_b)} data-beat-layout-item="true">
          <VertexPin tone="ink" />
          <code className={styles.coord}>v1 (0.5, 0.7)</code>
        </div>
        <div className={cx(styles.vpin, styles.vpin_c)} data-beat-layout-item="true">
          <VertexPin tone="ink" />
          <code className={styles.coord}>v2 (0.1, -0.5)</code>
        </div>
        <div
          className={cx(styles.clipCut, clipped && styles.clipCutOn)}
          data-beat-layout-item="true"
          aria-hidden="true"
        >
          <span className={styles.scissors}>✂️</span>
          <span className={styles.clipEdge} />
          <span className={cx(styles.chip, styles.chipRed)}>{t("clipped")}</span>
        </div>
        <span className={cx(styles.chip, styles.chipInk, styles.frustumKeep)}>
          {t("keep")}
        </span>
      </div>
    </div>
  );
}

function SceneThree({ language, beat }: { language: Lang; beat: number }) {
  const t = (u: keyof typeof UI) => label(UI[u], language);
  const covered = beat >= 1;
  const magnified = beat >= 2;
  const cells = Array.from({ length: 84 }, (_, index) => index);
  const coveredSet = new Set([
    27, 28, 29, 38, 39, 40, 41, 49, 50, 51, 52, 53, 61, 62, 63, 64,
  ]);
  const targetIndex = 40;
  return (
    <div className={styles.diagram} data-scene-diagram="3">
      <div
        className={styles.rasterScene}
        data-beat-layout-container="true"
        data-beat-layout-mode="reserved"
      >
        <div
          className={cx(styles.screenGrid, magnified && styles.screenGridDim)}
          data-beat-layout-item="true"
          aria-hidden="true"
        >
          {cells.map((index) => {
            const isCovered = coveredSet.has(index);
            const isTarget = index === targetIndex;
            return (
              <span
                key={index}
                className={cx(
                  styles.gridCell,
                  isCovered && covered && styles.gridCellCovered,
                  isTarget && styles.gridCellTarget,
                )}
              />
            );
          })}
          <span className={cx(styles.tri, styles.triCoralGhost)} />
        </div>
        <div
          className={cx(styles.magnifier, magnified && styles.magnifierOn)}
          data-beat-layout-item="true"
        >
          <span className={styles.magIcon} aria-hidden="true">🔍</span>
          <div className={styles.magCell} aria-hidden="true">
            <span className={styles.magFill} />
            <span className={styles.magVertex} data-corner="a" />
            <span className={styles.magVertex} data-corner="b" />
            <span className={styles.magVertex} data-corner="c" />
          </div>
          <span className={cx(styles.chip, styles.chipInk)}>
            {magnified ? "lerp" : t("coverage")}
          </span>
        </div>
      </div>
    </div>
  );
}

function SceneFour({ language, beat }: { language: Lang; beat: number }) {
  const t = (u: keyof typeof UI) => label(UI[u], language);
  const shaded = beat >= 0;
  const tested = beat >= 1;
  const resolved = beat >= 2;
  return (
    <div className={styles.diagram} data-scene-diagram="4">
      <div
        className={styles.shadeScene}
        data-beat-layout-container="true"
        data-beat-layout-mode="reserved"
      >
        <div className={styles.shaderRig} aria-hidden="true">
          <span className={cx(styles.vial, shaded && styles.vialOn)}>🧪</span>
          <span className={styles.shaderStream} />
        </div>

        <div
          className={cx(
            styles.fragCard,
            styles.fragCoral,
            shaded && styles.fragShaded,
            resolved && styles.fragWin,
          )}
          data-beat-layout-item="true"
        >
          <span className={styles.fragName}>{t("fragment")} · coral</span>
          <code className={styles.fragZ}>z = 0.28</code>
          <span className={styles.fragNote}>{t("near")}</span>
          {resolved && <span className={cx(styles.stamp, styles.stampPass)}>✅</span>}
        </div>

        <div className={styles.depthGate} aria-hidden="true">
          <span className={cx(styles.gate, tested && styles.gateTested)}>🚦</span>
          <code className={cx(styles.gateExpr, tested && styles.gateExprOn)}>
            0.28 &lt; 0.72
          </code>
        </div>

        <div
          className={cx(
            styles.fragCard,
            styles.fragCyan,
            shaded && styles.fragShaded,
            resolved && styles.fragLose,
          )}
          data-beat-layout-item="true"
        >
          <span className={styles.fragName}>{t("fragment")} · cyan</span>
          <code className={styles.fragZ}>z = 0.72</code>
          <span className={styles.fragNote}>{t("far")}</span>
          {resolved && <span className={cx(styles.stamp, styles.stampReject)}>❌</span>}
          {resolved && (
            <div className={styles.overdrawBurst} aria-hidden="true">
              <span>✨</span>
              <span>✨</span>
              <span>✨</span>
              <span className={cx(styles.chip, styles.chipRed)}>{t("overdraw")}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SceneFive({ language, beat }: { language: Lang; beat: number }) {
  const t = (u: keyof typeof UI) => label(UI[u], language);
  const written = beat >= 0;
  const lit = beat >= 1;
  const wall = Array.from({ length: 60 }, (_, index) => index);
  const targetIndex = 27;
  return (
    <div className={styles.diagram} data-scene-diagram="5">
      <div
        className={styles.commitScene}
        data-beat-layout-container="true"
        data-beat-layout-mode="reserved"
      >
        <div className={styles.survivorFlow} data-beat-layout-item="true" aria-hidden="true">
          <span className={cx(styles.tri, styles.triCoralSolid)} />
          <span className={styles.flowArrow} />
          <span className={cx(styles.chip, styles.chipInk)}>
            {t("write")} | {t("blend")}
          </span>
        </div>
        <div
          className={cx(styles.framebuffer, lit && styles.framebufferLit)}
          data-beat-layout-item="true"
        >
          <span className={styles.fbIcon} aria-hidden="true">🖼️</span>
          <div className={styles.pixelWall} aria-hidden="true">
            {wall.map((index) => (
              <span
                key={index}
                className={cx(
                  styles.wallCell,
                  written && index === targetIndex && styles.wallTarget,
                  lit && styles.wallLit,
                )}
                style={{ ["--i" as string]: index }}
              />
            ))}
          </div>
          {lit && <span className={styles.energy} aria-hidden="true">⚡</span>}
        </div>
      </div>
    </div>
  );
}

function renderSceneBody(scene: number, beat: number, language: Lang) {
  switch (scene) {
    case 1:
      return <SceneOne language={language} />;
    case 2:
      return <SceneTwo language={language} beat={beat} />;
    case 3:
      return <SceneThree language={language} beat={beat} />;
    case 4:
      return <SceneFour language={language} beat={beat} />;
    case 5:
      return <SceneFive language={language} beat={beat} />;
    default:
      return null;
  }
}

function PipelineRail({ scene, language }: { scene: number; language: Lang }) {
  const active = ACTIVE_STAGES[scene] ?? [];
  return (
    <div className={styles.rail} aria-hidden="true">
      <span className={styles.railKicker}>{label(UI.kicker, language)}</span>
      <ol className={styles.railList}>
        {PIPELINE_STAGES[language].map((name, index) => (
          <li
            key={name}
            className={cx(
              styles.railStep,
              active.includes(index) && styles.railStepActive,
            )}
          >
            <span className={styles.railDot} />
            <span className={styles.railName}>{name}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

function TakeawayLane({
  scene,
  beat,
  language,
}: {
  scene: number;
  beat: number;
  language: Lang;
}) {
  const meta = metadata[language].scenes[scene - 1];
  const beatData = meta?.beats.find((candidate) => candidate.id === beat) ?? meta?.beats[0];
  const token = TOKENS[`${scene}-${beat}`] ?? "";
  return (
    <div className={styles.takeaway}>
      <p className={styles.claim}>
        <span className={styles.claimMark}>{beatData?.title}</span>
      </p>
      <div className={styles.subline}>
        <p className={styles.explain}>{beatData?.body}</p>
        {token && <code className={styles.token}>{token}</code>}
      </div>
    </div>
  );
}

function PixelInspector({
  language,
  onNavigate,
}: {
  language: Lang;
  onNavigate?: (scene: number, beat: number) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const t = (u: keyof typeof UI) => label(UI[u], language);
  const stop = (event: { stopPropagation: () => void }) => event.stopPropagation();

  return (
    <div
      className={styles.nav}
      data-topic-navigation="true"
      data-navigation-geometry="spatial-node"
      data-navigation-carrier="pixel-inspector-grid"
      data-navigation-invocation="click-expand"
      data-navigation-feedback="geometry-reflow"
      onPointerDown={stop}
      onKeyDown={stop}
    >
      <button
        type="button"
        className={cx(styles.navPrimary, expanded && styles.navPrimaryOpen)}
        aria-label={t("inspect")}
        aria-expanded={expanded}
        onClick={(event) => {
          event.stopPropagation();
          setExpanded(true);
          onNavigate?.(4, 0);
        }}
      >
        <span className={styles.navPixelGrid} aria-hidden="true">
          {Array.from({ length: 15 }, (_, index) => (
            <span
              key={index}
              className={cx(
                styles.navPixel,
                index === 7 && styles.navPixelTarget,
              )}
            />
          ))}
        </span>
        <span className={styles.navPrimaryLabel}>{t("inspectShort")} 🔍</span>
      </button>

      {expanded && (
        <div className={styles.inspectPanel} role="group" aria-label={t("inspectShort")}>
          <div className={cx(styles.inspectRow, styles.inspectCoral)}>
            <span>△ coral</span>
            <code>z 0.28</code>
            <span className={styles.inspectPass}>✅</span>
          </div>
          <div className={cx(styles.inspectRow, styles.inspectCyan)}>
            <span>△ cyan</span>
            <code>z 0.72</code>
            <span className={styles.inspectReject}>❌</span>
          </div>
          <div className={styles.inspectResult}>
            {t("result")}: {t("wins")}
          </div>
        </div>
      )}

      <div className={styles.navSmallRow}>
        <button
          type="button"
          className={styles.navSmall}
          aria-label={t("gotoVertex")}
          onClick={(event) => {
            event.stopPropagation();
            onNavigate?.(2, 0);
          }}
        >
          📍 <span>{language === "zh" ? "顶点" : "Vertex"}</span>
        </button>
        <button
          type="button"
          className={styles.navSmall}
          aria-label={t("gotoDepth")}
          onClick={(event) => {
            event.stopPropagation();
            onNavigate?.(4, 1);
          }}
        >
          🚦 <span>{language === "zh" ? "深度门" : "Depth gate"}</span>
        </button>
      </div>
    </div>
  );
}

function TopicStage({
  scene,
  beat,
  language,
  isThumbnail,
  reducedMotion,
  onNavigate,
}: TopicStageProps) {
  return (
    <div
      className={styles.stage}
      data-motion={reducedMotion || isThumbnail ? "off" : "on"}
      data-thumbnail={isThumbnail ? "true" : undefined}
    >
      <SpatialSceneTrack
        scene={scene}
        beat={beat}
        reducedMotion={reducedMotion}
        transitionMap={transitionMap}
        transitionDurationMs={720}
        beatLayoutModes={{ 2: "reserved", 3: "reserved", 4: "reserved", 5: "reserved" }}
        renderScene={(sceneId, sceneBeat) => (
          <section className={styles.sceneRoot} data-scene-root={sceneId}>
            <header className={styles.head}>
              <span className={styles.headIndex}>0{sceneId}</span>
              <h2 className={styles.headTitle}>
                {metadata[language].scenes[sceneId - 1]?.title}
              </h2>
              <PipelineRail scene={sceneId} language={language} />
            </header>
            <div className={styles.body}>{renderSceneBody(sceneId, sceneBeat, language)}</div>
            <TakeawayLane scene={sceneId} beat={sceneBeat} language={language} />
          </section>
        )}
      />
      {!isThumbnail && <PixelInspector language={language} onNavigate={onNavigate} />}
    </div>
  );
}

export default defineTopic({
  id: "two-triangles-one-pixel",
  styleId: "engineering-whiteboard-explainer",
  title: { en: "Two Triangles, One Pixel", zh: "双三角，争一像素" },
  modelId: "Claude Opus 4.8",
  Stage: TopicStage,
  metadata,
  navigation: {
    geometry: "spatial-node",
    carrier: "pixel-inspector-grid",
    invocation: "click-expand",
    feedback: "geometry-reflow",
  },
  transitionScore,
  evidence: {
    kind: "mixed",
    display: "envelope",
    sources: [
      {
        authority: "W3C GPU for the Web Working Group",
        title: "WebGPU",
        url: "https://gpuweb.github.io/gpuweb/",
        supports:
          "Defines the real-time render pipeline stages — vertex processing, primitive assembly and clipping, rasterization into fragments, fragment shading, and depth/stencil plus blend output — that this Topic walks through.",
      },
      {
        authority: "W3C GPU for the Web Working Group",
        title: "WebGPU Shading Language (WGSL)",
        url: "https://gpuweb.github.io/gpuweb/wgsl/",
        supports:
          "Specifies how vertex and fragment shaders emit per-vertex and per-fragment outputs, supporting the claim that a shaded fragment is a candidate value rather than a final pixel.",
      },
      {
        authority: "Khronos Group",
        title: "Vulkan Tutorial — Graphics pipeline basics: Introduction",
        url: "https://docs.vulkan.org/tutorial/latest/03_Drawing_a_triangle/02_Graphics_pipeline_basics/00_Introduction.html",
        supports:
          "Describes the ordered fixed-function and programmable stages a triangle passes through, including rasterization to fragments and depth testing, supporting the pipeline ordering shown here.",
      },
    ],
    boundary: {
      en: "The two triangles, the fixed depth values (0.28 and 0.72), and the visual queues here are API-neutral teaching illustrations. Real GPUs, drivers, APIs, and pipeline state may reorder, batch, or optimize this work, so this is not a claim of serial hardware execution or fixed performance.",
      zh: "这里的两个三角形、固定深度值（0.28 与 0.72）以及可视化队列，都是与具体 API 无关的教学示意。真实的 GPU、驱动、API 与管线状态可能重排、合批或优化这些工作，因此这既不代表硬件真的按此串行执行，也不代表固定的性能。",
    },
  },
});

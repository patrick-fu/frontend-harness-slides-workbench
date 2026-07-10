import { useEffect, type CSSProperties } from "react";
import type { BespokeStyleProps, StyleMetadata } from "../types";
import SpatialSceneTrack, {
  type BeatLayoutMode,
  type SceneTransitionMap,
} from "./SpatialSceneTrack";
import { defineStyleTopic } from "./topic";
import styles from "./33-spatial-product-brief.module.css";

type Language = "en" | "zh";
type SceneId = 1 | 2 | 3 | 4 | 5;

interface BeatCopy {
  action: string;
  title: string;
  body: string;
}

interface SceneCopy {
  kicker: string;
  headline: string;
  body: string;
  glassTitle: string;
  proof: string;
  nav: string;
  background: string[];
  points: string[];
  beatLabels: string[];
  beats: BeatCopy[];
}

interface SceneContent {
  id: SceneId;
  accent: string;
  secondary: string;
  copy: Record<Language, SceneCopy>;
}

const SCENE_IDS: SceneId[] = [1, 2, 3, 4, 5];

const TRANSITION_MAP: SceneTransitionMap = {
  "1->2": "scale-fade",
  "2->3": "slide-x",
  "3->4": "wipe",
  "4->5": "fade",
};

const BEAT_LAYOUT_MODES: Record<SceneId, BeatLayoutMode> = {
  1: "reserved",
  2: "reserved",
  3: "reserved",
  4: "reserved",
  5: "reserved",
};

const SCENES: SceneContent[] = [
  {
    id: 1,
    accent: "#8cf6ff",
    secondary: "#ffd96f",
    copy: {
      en: {
        kicker: "Glass shell",
        headline: "The interface becomes a vessel",
        body: "A clear shell frames the product without hiding the signal inside.",
        glassTitle: "Shell",
        proof: "One pane. One object. One promise.",
        nav: "Shell",
        background: ["product silhouette", "ambient map", "edge highlight"],
        points: ["artifact first", "pane second", "promise locked"],
        beatLabels: ["vessel", "object", "promise"],
        beats: [
          {
            action: "Glass vessel settles over the product.",
            title: "Glass shell",
            body: "The product is held, not covered.",
          },
          {
            action: "The object behind the pane sharpens.",
            title: "Object clarity",
            body: "Depth proves the glass has a job.",
          },
          {
            action: "The primary promise locks into the pane.",
            title: "Promise lock",
            body: "The shell makes the offer feel precise.",
          },
        ],
      },
      zh: {
        kicker: "玻璃外壳",
        headline: "界面成为一个透明容器",
        body: "清透外壳托住产品，不遮住内部信号。",
        glassTitle: "外壳",
        proof: "一层玻璃。一个对象。一个承诺。",
        nav: "外壳",
        background: ["产品剪影", "环境地图", "边缘高光"],
        points: ["对象在前", "玻璃在后", "承诺锁定"],
        beatLabels: ["容器", "对象", "承诺"],
        beats: [
          {
            action: "玻璃容器落在产品上方。",
            title: "玻璃外壳",
            body: "产品被托住，而不是被盖住。",
          },
          {
            action: "玻璃后的对象变得清晰。",
            title: "对象清晰",
            body: "深度证明玻璃有真实作用。",
          },
          {
            action: "核心承诺锁进玻璃表面。",
            title: "承诺锁定",
            body: "外壳让主张更精确。",
          },
        ],
      },
    },
  },
  {
    id: 2,
    accent: "#b8ffcf",
    secondary: "#8cf6ff",
    copy: {
      en: {
        kicker: "Layer system",
        headline: "Every layer earns its depth",
        body: "Foreground explains, background keeps context, and the space between them stays readable.",
        glassTitle: "Layers",
        proof: "Depth is hierarchy, not decoration.",
        nav: "Layers",
        background: ["live context", "soft labels", "data underlay"],
        points: ["front pane: decision", "middle pane: state", "back plane: context"],
        beatLabels: ["front", "middle", "back"],
        beats: [
          {
            action: "Foreground decision pane appears.",
            title: "Front pane",
            body: "The main decision stays sharp.",
          },
          {
            action: "A middle state pane joins without pushing layout.",
            title: "Middle pane",
            body: "Status gains depth without noise.",
          },
          {
            action: "The contextual back plane remains legible.",
            title: "Back plane",
            body: "Context stays useful through the glass.",
          },
        ],
      },
      zh: {
        kicker: "层级系统",
        headline: "每一层都要证明自己的深度",
        body: "前景负责解释，背景保留上下文，中间距离必须可读。",
        glassTitle: "层级",
        proof: "深度是层级，不是装饰。",
        nav: "层级",
        background: ["实时上下文", "柔和标签", "数据底层"],
        points: ["前层：决策", "中层：状态", "后层：上下文"],
        beatLabels: ["前层", "中层", "后层"],
        beats: [
          {
            action: "前景决策玻璃层出现。",
            title: "前层",
            body: "主决策保持锐利。",
          },
          {
            action: "中间状态层加入，但不推动布局。",
            title: "中层",
            body: "状态有深度，但不制造噪音。",
          },
          {
            action: "上下文底层仍然可读。",
            title: "后层",
            body: "玻璃后的上下文仍有价值。",
          },
        ],
      },
    },
  },
  {
    id: 3,
    accent: "#ffd96f",
    secondary: "#f6a9ff",
    copy: {
      en: {
        kicker: "Gesture field",
        headline: "Gesture travels through space",
        body: "A light touch moves the front pane while the deeper product state answers with calmer motion.",
        glassTitle: "Gesture",
        proof: "Touch feels spatial because response has depth.",
        nav: "Gesture",
        background: ["touch path", "settle point", "response halo"],
        points: ["intent enters", "pane compresses", "state answers"],
        beatLabels: ["intent", "press", "answer"],
        beats: [
          {
            action: "Gesture path is drawn over the product field.",
            title: "Intent path",
            body: "The interaction has a visible route.",
          },
          {
            action: "The glass pane compresses with restraint.",
            title: "Material press",
            body: "Feedback respects the glass surface.",
          },
          {
            action: "The deeper state responds after the pane settles.",
            title: "State answer",
            body: "The product answers beneath the touch.",
          },
        ],
      },
      zh: {
        kicker: "手势场",
        headline: "手势在空间里移动",
        body: "轻触推动前层玻璃，更深的产品状态用更安静的运动回应。",
        glassTitle: "手势",
        proof: "触感之所以立体，是因为回应有深度。",
        nav: "手势",
        background: ["触控路径", "停靠点", "回应光晕"],
        points: ["意图进入", "玻璃压缩", "状态回应"],
        beatLabels: ["意图", "按压", "回应"],
        beats: [
          {
            action: "手势路径画过产品场域。",
            title: "意图路径",
            body: "交互有明确路线。",
          },
          {
            action: "玻璃表面克制地压缩。",
            title: "材质按压",
            body: "反馈尊重玻璃表面。",
          },
          {
            action: "更深层状态在玻璃稳定后回应。",
            title: "状态回应",
            body: "产品在触控下方给出答案。",
          },
        ],
      },
    },
  },
  {
    id: 4,
    accent: "#ffb39b",
    secondary: "#b8ffcf",
    copy: {
      en: {
        kicker: "Trust surface",
        headline: "Trust stays visible at depth",
        body: "Permission, reason, and escape route remain present behind the glass instead of hiding in a modal.",
        glassTitle: "Trust",
        proof: "Confidence rises when controls stay in sight.",
        nav: "Trust",
        background: ["permission", "reason shown", "escape route"],
        points: ["what changed", "why it changed", "how to reverse"],
        beatLabels: ["signal", "reason", "control"],
        beats: [
          {
            action: "Permission signal anchors the trust pane.",
            title: "Signal",
            body: "The user can see what is active.",
          },
          {
            action: "Reason text appears in a reserved layer.",
            title: "Reason",
            body: "Explanation stays close to the action.",
          },
          {
            action: "Control path remains visible beneath the pane.",
            title: "Control",
            body: "Trust includes a way back.",
          },
        ],
      },
      zh: {
        kicker: "信任表面",
        headline: "信任必须在深处也可见",
        body: "权限、原因和退出路径留在玻璃后方，而不是藏进弹窗。",
        glassTitle: "信任",
        proof: "控制始终可见，信心才会上升。",
        nav: "信任",
        background: ["权限", "原因展示", "退出路径"],
        points: ["改变了什么", "为什么改变", "如何撤回"],
        beatLabels: ["信号", "原因", "控制"],
        beats: [
          {
            action: "权限信号锚定信任玻璃层。",
            title: "信号",
            body: "用户能看见当前启用的内容。",
          },
          {
            action: "原因文字出现在预留层里。",
            title: "原因",
            body: "解释贴近动作，而不打断动作。",
          },
          {
            action: "控制路径保持在玻璃下方可见。",
            title: "控制",
            body: "信任也包含返回路径。",
          },
        ],
      },
    },
  },
  {
    id: 5,
    accent: "#ffe27a",
    secondary: "#8cf6ff",
    copy: {
      en: {
        kicker: "Product glow",
        headline: "The product becomes the light",
        body: "The final state lets the object illuminate the system instead of decorating the object.",
        glassTitle: "Glow",
        proof: "The interface recedes when the product can carry the room.",
        nav: "Glow",
        background: ["proof halo", "quiet chrome", "next action"],
        points: ["proof emits", "chrome recedes", "choice remains"],
        beatLabels: ["proof", "glow", "choice"],
        beats: [
          {
            action: "A proof halo rises from behind the product.",
            title: "Proof halo",
            body: "Evidence becomes visible light.",
          },
          {
            action: "Chrome recedes around the object.",
            title: "Quiet chrome",
            body: "The glass gets out of the way.",
          },
          {
            action: "The final choice stays inside the glow.",
            title: "Final choice",
            body: "The product carries the closing line.",
          },
        ],
      },
      zh: {
        kicker: "产品光晕",
        headline: "产品成为光源",
        body: "最终状态让对象照亮系统，而不是让系统装饰对象。",
        glassTitle: "光晕",
        proof: "当产品能撑起空间，界面就该后退。",
        nav: "光晕",
        background: ["证明光环", "安静框架", "下一步动作"],
        points: ["证明发光", "框架后退", "选择保留"],
        beatLabels: ["证明", "光晕", "选择"],
        beats: [
          {
            action: "证明光晕从产品后方升起。",
            title: "证明光环",
            body: "证据变成可见的光。",
          },
          {
            action: "界面框架围绕对象后退。",
            title: "安静框架",
            body: "玻璃不再抢占注意力。",
          },
          {
            action: "最终选择留在光晕内部。",
            title: "最终选择",
            body: "产品承载收束句。",
          },
        ],
      },
    },
  },
];

function useFonts() {
  useEffect(() => {
    const id = "style-33-spatial-product-brief-v2-fonts";
    if (document.getElementById(id)) return;

    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;650;750&family=Noto+Sans+SC:wght@400;500;700&display=swap";
    document.head.appendChild(link);
  }, []);
}

function clampScene(scene: number): SceneId {
  if (scene <= 1) return 1;
  if (scene >= 5) return 5;
  return Math.round(scene) as SceneId;
}

function cx(...classes: Array<string | false | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

function getSceneContent(sceneId: number): SceneContent {
  return SCENES.find((item) => item.id === sceneId) ?? SCENES[0];
}

function clampBeat(sceneData: SceneContent, language: Language, beat: number) {
  const maxBeat = sceneData.copy[language].beats.length - 1;
  return Math.max(0, Math.min(maxBeat, Math.round(beat)));
}

function getSceneStyle(sceneData: SceneContent): CSSProperties {
  return {
    "--style-33-v2-accent": sceneData.accent,
    "--style-33-v2-secondary": sceneData.secondary,
  } as CSSProperties;
}

function BackgroundField({
  copy,
  activeBeat,
}: {
  copy: SceneCopy;
  activeBeat: number;
}) {
  return (
    <div className={styles.backgroundField} data-beat-layout-item="true">
      {copy.background.map((item, index) => (
        <span
          key={item}
          className={styles.backgroundLabel}
          data-visible={index <= activeBeat ? "true" : "false"}
        >
          {item}
        </span>
      ))}
    </div>
  );
}

function BeatMarkers({
  copy,
  activeBeat,
}: {
  copy: SceneCopy;
  activeBeat: number;
}) {
  return (
    <div className={styles.beatRail} data-beat-layout-item="true">
      {copy.beatLabels.map((label, index) => (
        <div
          key={label}
          className={cx(styles.beatMark, index <= activeBeat && styles.beatMarkActive)}
        >
          <span className={styles.beatDot} />
          <span className={styles.beatLabel}>{label}</span>
        </div>
      ))}
    </div>
  );
}

function ProductGlyph({ sceneId }: { sceneId: SceneId }) {
  return (
    <svg
      className={styles.productGlyph}
      data-scene={sceneId}
      viewBox="0 0 100 100"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id={`style33v2-core-${sceneId}`} cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="var(--style-33-v2-secondary)" stopOpacity="0.95" />
          <stop offset="0.52" stopColor="var(--style-33-v2-accent)" stopOpacity="0.34" />
          <stop offset="1" stopColor="var(--style-33-v2-accent)" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="38" fill={`url(#style33v2-core-${sceneId})`} />
      <path className={styles.glyphOrbit} d="M18 58 C34 18 70 18 84 56" />
      <path className={styles.glyphOrbitSoft} d="M24 72 C44 43 66 42 82 70" />
      <circle className={styles.glyphNode} cx="18" cy="58" r="2.4" />
      <circle className={styles.glyphNode} cx="84" cy="56" r="2.4" />
    </svg>
  );
}

function DetailStack({
  copy,
  activeBeat,
}: {
  copy: SceneCopy;
  activeBeat: number;
}) {
  return (
    <div className={styles.detailStack} data-beat-layout-item="true">
      {copy.points.map((point, index) => (
        <div
          key={point}
          className={styles.detailItem}
          data-visible={index <= activeBeat ? "true" : "false"}
        >
          <span className={styles.detailIndex}>{String(index + 1).padStart(2, "0")}</span>
          <span>{point}</span>
        </div>
      ))}
    </div>
  );
}

function ScenePanel({
  sceneId,
  beat,
  language,
  isActive,
}: {
  sceneId: SceneId;
  beat: number;
  language: Language;
  isActive: boolean;
}) {
  const sceneData = getSceneContent(sceneId);
  const copy = sceneData.copy[language];
  const activeBeat = clampBeat(sceneData, language, beat);

  return (
    <section
      className={styles.scene}
      data-scene={sceneId}
      data-active={isActive ? "true" : "false"}
      style={getSceneStyle(sceneData)}
    >
      <ProductGlyph sceneId={sceneId} />
      <BackgroundField copy={copy} activeBeat={activeBeat} />

      <div className={styles.mainGlass} data-beat-layout-item="true">
        <div className={styles.edgeHighlight} />
        <p className={styles.kicker}>{copy.kicker}</p>
        <h1 className={styles.headline}>{copy.headline}</h1>
        <p className={styles.body}>{copy.body}</p>
      </div>

      <div
        className={styles.floatingGlass}
        data-beat-layout-item="true"
        data-visible={activeBeat >= 1 ? "true" : "false"}
      >
        <div className={styles.edgeHighlight} />
        <span className={styles.floatingTitle}>{copy.glassTitle}</span>
        <span className={styles.floatingBody}>
          {copy.beats[Math.min(1, copy.beats.length - 1)].body}
        </span>
      </div>

      <DetailStack copy={copy} activeBeat={activeBeat} />

      <div
        className={styles.proofGlass}
        data-beat-layout-item="true"
        data-visible={activeBeat >= 2 ? "true" : "false"}
      >
        <div className={styles.edgeHighlight} />
        <span>{copy.proof}</span>
      </div>

      <BeatMarkers copy={copy} activeBeat={activeBeat} />
    </section>
  );
}

function GlassChipNav({
  scene,
  language,
  onNavigate,
}: {
  scene: SceneId;
  language: Language;
  onNavigate?: (scene: number, beat: number) => void;
}) {
  return (
    <nav className={styles.nav} aria-label={language === "zh" ? "场景导航" : "Scene navigation"}>
      {SCENES.map((sceneData) => {
        const isActive = sceneData.id === scene;
        return (
          <button
            key={sceneData.id}
            type="button"
            className={styles.navChip}
            data-active={isActive ? "true" : "false"}
            aria-current={isActive ? "step" : undefined}
            onClick={() => onNavigate?.(sceneData.id, 0)}
          >
            <span className={styles.navNumber}>{String(sceneData.id).padStart(2, "0")}</span>
            <span className={styles.navLabel}>{sceneData.copy[language].nav}</span>
          </button>
        );
      })}
    </nav>
  );
}

export function getMetadata(lang: Language): StyleMetadata {
  return {
    id: "liquid-glass",
    band: "contemporary-digital",
    name: lang === "zh" ? "液态玻璃" : "Liquid Glass",
    theme: lang === "zh" ? "空间产品简报" : "Spatial Product Brief",
    densityLabel: lang === "zh" ? "层次化" : "Layered",
    heroScene: 5,
    colors: {
      bg: "#07111e",
      ink: "#effcff",
      panel: "#153042",
    },
    typography: {
      header: "Inter 750",
      body: "Inter 400",
    },
    tags: ["liquid-glass", "spatial", "product", "digital", "layered"],
    fonts: ["Inter", "cjk:Noto Sans SC"],
    scenes: SCENES.map((sceneData) => {
      const copy = sceneData.copy[lang];
      return {
        id: sceneData.id,
        title: copy.kicker,
        beats: copy.beats.map((beatCopy, index) => ({
          id: index,
          action: beatCopy.action,
          title: beatCopy.title,
          body: beatCopy.body,
        })),
      };
    }),
  };
}

export default function SpatialProductBriefV2({
  scene,
  beat,
  language,
  isThumbnail,
  reducedMotion,
  onNavigate,
}: BespokeStyleProps) {
  useFonts();
  const activeScene = clampScene(scene);
  const motionOff = reducedMotion || isThumbnail;

  return (
    <div
      className={styles.root}
      data-static={motionOff ? "true" : undefined}
      data-thumbnail={isThumbnail ? "true" : undefined}
    >
      <SpatialSceneTrack
        scene={activeScene}
        beat={beat}
        sceneIds={SCENE_IDS}
        transitionKind="scale-fade"
        transitionMap={TRANSITION_MAP}
        transitionDurationMs={760}
        reducedMotion={motionOff}
        beatLayoutModes={BEAT_LAYOUT_MODES}
        className={styles.track}
        renderScene={(sceneId, sceneBeat, isActive) => (
          <ScenePanel
            sceneId={clampScene(sceneId)}
            beat={sceneBeat}
            language={language}
            isActive={isActive}
          />
        )}
      />
      {!isThumbnail && (
        <GlassChipNav scene={activeScene} language={language} onNavigate={onNavigate} />
      )}
    </div>
  );
}

export const spatialProductBriefTopic = defineStyleTopic({
  id: "spatial-brief",
  topic: {
    en: "Spatial Brief",
    zh: "空间简报",
  },
  model: "GPT-5.5",
  component: SpatialProductBriefV2,
  getMetadata,
});

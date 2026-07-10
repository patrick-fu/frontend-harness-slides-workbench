import { useEffect } from "react";
import type { CSSProperties } from "react";
import type { BespokeStyleProps, StyleMetadata } from "../types";
import { useFLIP } from "../hooks/useFLIP";
import SpatialSceneTrack from "./SpatialSceneTrack";
import type {
  BeatLayoutMode,
  SceneTransitionMap,
} from "./SpatialSceneTrack";
import { defineStyleTopic } from "./topic";
import styles from "./03-repair-as-strategy.module.css";

type Language = "en" | "zh";
type SceneId = 1 | 2 | 3 | 4 | 5;
type VisualKind = "vessel" | "map" | "sequence" | "strength" | "held";

interface BeatCopy {
  action: string;
  title: string;
  body: string;
}

interface LocalizedSceneCopy {
  kicker: string;
  title: string;
  body: string;
  beats: BeatCopy[];
}

interface SceneCopy {
  id: SceneId;
  visual: VisualKind;
  nav: Record<Language, string>;
  en: LocalizedSceneCopy;
  zh: LocalizedSceneCopy;
}

const SCENES: SceneCopy[] = [
  {
    id: 1,
    visual: "vessel",
    nav: { en: "01", zh: "器" },
    en: {
      kicker: "Flawed vessel",
      title: "Start with the crack",
      body: "A break exposes the hidden load path. Treat it as evidence, not embarrassment.",
      beats: [
        {
          action: "Name the visible damage",
          title: "Name",
          body: "Name the fracture before choosing the tool.",
        },
        {
          action: "Keep the object in service",
          title: "Hold",
          body: "Keep the vessel in view while the system is still working.",
        },
        {
          action: "Read stress as signal",
          title: "Read",
          body: "The first strategy is to stop hiding the stress.",
        },
      ],
    },
    zh: {
      kicker: "有缺口的器物",
      title: "从裂纹开始",
      body: "破损暴露出真实受力路径。它不是羞耻，而是证据。",
      beats: [
        {
          action: "命名可见损伤",
          title: "命名",
          body: "先说清裂缝，再选择工具。",
        },
        {
          action: "让器物继续在场",
          title: "持住",
          body: "系统还在工作时，也要让器物留在视线里。",
        },
        {
          action: "把压力读成信号",
          title: "读纹",
          body: "策略的第一步，是停止掩盖压力。",
        },
      ],
    },
  },
  {
    id: 2,
    visual: "map",
    nav: { en: "02", zh: "纹" },
    en: {
      kicker: "Crack map",
      title: "Map the fracture",
      body: "Every line shows where force traveled. The repair plan follows the path, not the wish.",
      beats: [
        {
          action: "Trace the longest line",
          title: "Trace",
          body: "Follow the longest crack until it reaches the edge.",
        },
        {
          action: "Mark load junctions",
          title: "Mark",
          body: "Junctions reveal where a local fix would fail again.",
        },
        {
          action: "Choose the bind points",
          title: "Choose",
          body: "Bind where the map asks, not where the slide looks clean.",
        },
      ],
    },
    zh: {
      kicker: "裂纹地图",
      title: "把裂纹画成地图",
      body: "每一条线都记录力量经过哪里。修复方案跟随路径，而不是愿望。",
      beats: [
        {
          action: "追踪最长裂线",
          title: "追踪",
          body: "沿着最长裂纹，看到它抵达边缘。",
        },
        {
          action: "标记受力交汇",
          title: "标记",
          body: "交汇处说明局部补丁会再次失效。",
        },
        {
          action: "选择粘合位置",
          title: "选择",
          body: "在地图要求的位置粘合，而不是在画面最干净的位置。",
        },
      ],
    },
  },
  {
    id: 3,
    visual: "sequence",
    nav: { en: "03", zh: "补" },
    en: {
      kicker: "Repair sequence",
      title: "Bind, cure, return",
      body: "Repair is a sequence of patient moves: clean the edge, align the pieces, add the seam, wait.",
      beats: [
        {
          action: "Clean the exposed edge",
          title: "Clean",
          body: "Remove loose assumptions before adding new structure.",
        },
        {
          action: "Align before bonding",
          title: "Align",
          body: "Fit the pieces quietly; force makes a second crack.",
        },
        {
          action: "Add the visible seam",
          title: "Join",
          body: "The repair line stays visible so future hands know the load.",
        },
        {
          action: "Wait for cure",
          title: "Wait",
          body: "Durability arrives after the team stops touching the seam.",
        },
      ],
    },
    zh: {
      kicker: "修复步骤",
      title: "粘合，静置，归还",
      body: "修复是一组耐心动作：清边、对齐、补缝、等待。",
      beats: [
        {
          action: "清理暴露边缘",
          title: "清边",
          body: "加结构之前，先移除松动的假设。",
        },
        {
          action: "粘合前先对齐",
          title: "对齐",
          body: "安静地合上碎片；用力会制造第二道裂纹。",
        },
        {
          action: "补上可见接缝",
          title: "补缝",
          body: "修复线保留下来，让以后的人知道承载在哪里。",
        },
        {
          action: "等待固化",
          title: "静置",
          body: "当团队停止触碰接缝，耐久性才开始出现。",
        },
      ],
    },
  },
  {
    id: 4,
    visual: "strength",
    nav: { en: "04", zh: "静" },
    en: {
      kicker: "Quieter strength",
      title: "Strength gets quieter",
      body: "The repaired object does not pretend to be new. It carries the story without making noise.",
      beats: [
        {
          action: "Let the seam carry load",
          title: "Carry",
          body: "The seam becomes a load path, not a decoration.",
        },
        {
          action: "Keep memory visible",
          title: "Remember",
          body: "Visible repair prevents the same blind spot from returning.",
        },
        {
          action: "Return with less theater",
          title: "Return",
          body: "The strongest system may look less finished, and more honest.",
        },
      ],
    },
    zh: {
      kicker: "更安静的强度",
      title: "强度变得更安静",
      body: "修好的器物不假装崭新。它把故事带着，但不制造噪声。",
      beats: [
        {
          action: "让接缝承载",
          title: "承载",
          body: "接缝成为受力路径，而不是装饰。",
        },
        {
          action: "保留可见记忆",
          title: "记忆",
          body: "可见修复让同一个盲点不再轻易回来。",
        },
        {
          action: "用更少戏剧回到使用",
          title: "归还",
          body: "最强的系统也许没那么完整，却更诚实。",
        },
      ],
    },
  },
  {
    id: 5,
    visual: "held",
    nav: { en: "05", zh: "持" },
    en: {
      kicker: "Held object",
      title: "Put it back in hand",
      body: "A strategy is finished when someone can hold the repaired thing and trust how it was joined.",
      beats: [
        {
          action: "Move from diagram to hand",
          title: "Hold",
          body: "The object leaves the diagram and returns to touch.",
        },
        {
          action: "Turn care into operation",
          title: "Practice",
          body: "Care becomes a way of operating, not a rescue event.",
        },
        {
          action: "Keep the mark visible",
          title: "Keep",
          body: "The mark remains. It is the strategy remembering itself.",
        },
      ],
    },
    zh: {
      kicker: "被握住的器物",
      title: "把它放回手中",
      body: "当有人能握住修好的东西，并信任它如何被接合，策略才算完成。",
      beats: [
        {
          action: "从图解回到手感",
          title: "握住",
          body: "器物离开图解，回到触摸。",
        },
        {
          action: "把照护变成操作",
          title: "练习",
          body: "照护成为一种工作方式，而不是一次救援。",
        },
        {
          action: "让痕迹继续可见",
          title: "留下",
          body: "痕迹仍在。它是策略对自己的记忆。",
        },
      ],
    },
  },
];

const SCENE_BY_ID = new Map<SceneId, SceneCopy>(
  SCENES.map((scene) => [scene.id, scene] as const),
);
const FALLBACK_SCENE = SCENES[0] as SceneCopy;

const TRANSITION_MAP: SceneTransitionMap = {
  "1->2": "fade",
  "2->3": "scale-fade",
  "3->4": "wipe",
  "4->5": "fade",
};

const BEAT_LAYOUT_MODES: Partial<Record<number, BeatLayoutMode>> = {
  1: "motion",
  2: "motion",
  3: "motion",
  4: "motion",
  5: "motion",
};

function useFonts() {
  useEffect(() => {
    if (typeof document === "undefined") return;
    const id = "style-03-repair-as-strategy-v2-fonts";
    if (document.getElementById(id)) return;

    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Alegreya+Sans:wght@400;500;700&family=Noto+Serif+SC:wght@400;500;700&display=swap";
    document.head.appendChild(link);
  }, []);
}

function cx(...names: Array<string | false | undefined>): string {
  return names.filter(Boolean).join(" ");
}

function getScene(scene: number): SceneCopy {
  return SCENE_BY_ID.get(scene as SceneId) ?? FALLBACK_SCENE;
}

function clampBeat(beat: number, max: number): number {
  return Math.max(0, Math.min(beat, max));
}

interface ScenePanelProps {
  sceneId: number;
  beat: number;
  language: Language;
  isActive: boolean;
  motionDisabled: boolean;
}

function ScenePanel({
  sceneId,
  beat,
  language,
  isActive,
  motionDisabled,
}: ScenePanelProps) {
  const scene = getScene(sceneId);
  const copy = scene[language];
  const safeBeat = clampBeat(beat, copy.beats.length - 1);
  const visibleBeats = copy.beats.slice(0, safeBeat + 1);
  const { ref } = useFLIP<HTMLDivElement>({
    watch: [scene.id, safeBeat, language],
    disabled: motionDisabled || !isActive,
    duration: 720,
    easing: "cubic-bezier(0.16, 1, 0.3, 1)",
    selector: '[data-beat-layout-item="true"]',
  });

  return (
    <section
      className={cx(styles.scene, styles[`scene${scene.id}`])}
      data-scene-id={scene.id}
      data-scene-visual={scene.visual}
    >
      <div
        ref={ref}
        className={styles.sceneGrid}
        data-beat-layout-container="true"
        data-beat-layout-mode="motion"
      >
        <div className={styles.copyBlock} data-beat-layout-item="true">
          <p className={styles.kicker}>{copy.kicker}</p>
          <h1 className={styles.title}>{copy.title}</h1>
          <p className={styles.body}>{copy.body}</p>
          <div className={styles.brushGesture} aria-hidden="true" />
        </div>

        <div className={styles.visualStage} data-beat-layout-item="true">
          <CeramicVisual visual={scene.visual} beat={safeBeat} language={language} />
        </div>

        <div className={styles.beatStack} data-beat-layout-item="true">
          {visibleBeats.map((beatCopy, index) => (
            <article
              key={`${scene.id}-${beatCopy.title}`}
              className={styles.beatLine}
              style={{ "--beat-index": index } as CSSProperties}
              data-beat-layout-item="true"
            >
              <span className={styles.beatTitle}>{beatCopy.title}</span>
              <span className={styles.beatBody}>{beatCopy.body}</span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

interface CeramicVisualProps {
  visual: VisualKind;
  beat: number;
  language: Language;
}

function CeramicVisual({ visual, beat, language }: CeramicVisualProps) {
  if (visual === "map") {
    return <CrackMapVisual beat={beat} language={language} />;
  }
  if (visual === "sequence") {
    return <RepairSequenceVisual beat={beat} />;
  }
  if (visual === "strength") {
    return <QuietStrengthVisual beat={beat} />;
  }
  if (visual === "held") {
    return <HeldObjectVisual beat={beat} />;
  }
  return <FlawedVesselVisual beat={beat} />;
}

function FlawedVesselVisual({ beat }: { beat: number }) {
  return (
    <svg className={styles.visualSvg} viewBox="0 0 640 520" aria-hidden="true">
      <ellipse className={styles.tableShadow} cx="318" cy="438" rx="190" ry="32" />
      <path
        className={styles.vesselBody}
        d="M212 132 C248 96 389 96 426 132 C450 230 426 370 322 416 C218 370 190 230 212 132Z"
      />
      <path
        className={styles.vesselMouth}
        d="M212 132 C254 170 384 170 426 132 C390 99 248 99 212 132Z"
      />
      <path
        className={styles.missingChip}
        d="M394 153 L433 122 L421 185 C414 172 405 162 394 153Z"
      />
      <path
        className={cx(styles.darkCrack, beat >= 0 && styles.visibleTrace)}
        d="M322 140 L304 220 L334 274 L306 360"
      />
      <path
        className={cx(styles.darkCrack, styles.traceFine, beat >= 1 && styles.visibleTrace)}
        d="M305 222 L250 190"
      />
      <path
        className={cx(styles.darkCrack, styles.traceFine, beat >= 2 && styles.visibleTrace)}
        d="M334 274 L398 241"
      />
      <circle
        className={cx(styles.clayMark, beat >= 1 && styles.visibleTrace)}
        cx="212"
        cy="132"
        r="18"
      />
    </svg>
  );
}

function CrackMapVisual({
  beat,
  language,
}: {
  beat: number;
  language: Language;
}) {
  const loadLabel = language === "zh" ? "受力" : "load";
  const bindLabel = language === "zh" ? "粘合" : "bind";

  return (
    <svg className={styles.visualSvg} viewBox="0 0 640 520" aria-hidden="true">
      <circle className={styles.mapPlate} cx="322" cy="255" r="178" />
      <path className={styles.mapContour} d="M142 256 C204 145 412 122 493 250 C425 404 221 421 142 256Z" />
      <path
        className={cx(styles.darkCrack, beat >= 0 && styles.visibleTrace)}
        d="M323 80 L290 178 L342 242 L296 354 L319 438"
      />
      <path
        className={cx(styles.darkCrack, styles.traceFine, beat >= 0 && styles.visibleTrace)}
        d="M290 178 L178 122"
      />
      <path
        className={cx(styles.darkCrack, styles.traceFine, beat >= 1 && styles.visibleTrace)}
        d="M342 242 L484 158"
      />
      <path
        className={cx(styles.darkCrack, styles.traceFine, beat >= 1 && styles.visibleTrace)}
        d="M296 354 L184 410"
      />
      <path
        className={cx(styles.goldTrace, beat >= 2 && styles.visibleTrace)}
        d="M210 423 C276 379 372 376 444 422"
      />
      <circle
        className={cx(styles.mapPin, beat >= 1 && styles.visibleTrace)}
        cx="342"
        cy="242"
        r="17"
      />
      <circle
        className={cx(styles.mapPin, beat >= 2 && styles.visibleTrace)}
        cx="296"
        cy="354"
        r="13"
      />
      <text className={styles.mapLabel} x="150" y="116">
        {loadLabel}
      </text>
      <text className={styles.mapLabel} x="432" y="432">
        {bindLabel}
      </text>
    </svg>
  );
}

function RepairSequenceVisual({ beat }: { beat: number }) {
  return (
    <svg className={styles.visualSvg} viewBox="0 0 640 520" aria-hidden="true">
      <ellipse className={styles.tableShadow} cx="320" cy="448" rx="210" ry="30" />
      <path
        className={styles.vesselBody}
        d="M220 160 C268 124 374 126 421 160 L398 394 C362 428 280 428 242 394Z"
      />
      <path className={styles.vesselMouth} d="M220 160 C275 194 366 194 421 160 C372 128 268 128 220 160Z" />
      <path
        className={cx(styles.goldTrace, beat >= 0 && styles.visibleTrace)}
        d="M321 135 L300 218"
      />
      <path
        className={cx(styles.goldTrace, beat >= 1 && styles.visibleTrace)}
        d="M300 218 L341 270"
      />
      <path
        className={cx(styles.goldTrace, beat >= 2 && styles.visibleTrace)}
        d="M341 270 L302 356 L326 424"
      />
      <path
        className={cx(styles.goldTrace, styles.traceFine, beat >= 2 && styles.visibleTrace)}
        d="M302 356 L242 330"
      />
      <path
        className={cx(styles.goldTrace, styles.traceFine, beat >= 3 && styles.visibleTrace)}
        d="M341 270 L418 296"
      />
      {[0, 1, 2, 3].map((step) => (
        <circle
          key={step}
          className={cx(styles.sequenceChip, beat >= step && styles.visibleTrace)}
          cx={184 + step * 92}
          cy={82}
          r={step === 3 ? 16 : 13}
        />
      ))}
    </svg>
  );
}

function QuietStrengthVisual({ beat }: { beat: number }) {
  return (
    <svg className={styles.visualSvg} viewBox="0 0 640 520" aria-hidden="true">
      <path className={styles.windowWash} d="M92 84 C170 56 282 48 408 68 C336 152 226 194 92 196Z" />
      <ellipse className={styles.tableShadow} cx="324" cy="438" rx="198" ry="28" />
      <path
        className={styles.vesselBody}
        d="M202 142 C254 104 386 104 437 142 C444 248 418 376 326 416 C232 376 196 248 202 142Z"
      />
      <path className={styles.vesselMouth} d="M202 142 C254 181 386 181 437 142 C386 107 254 107 202 142Z" />
      <path
        className={cx(styles.goldTrace, beat >= 0 && styles.visibleTrace)}
        d="M326 128 L306 210 L350 276 L310 356 L330 414"
      />
      <path
        className={cx(styles.goldTrace, styles.traceFine, beat >= 1 && styles.visibleTrace)}
        d="M306 210 L238 188"
      />
      <path
        className={cx(styles.goldTrace, styles.traceFine, beat >= 2 && styles.visibleTrace)}
        d="M350 276 L424 302"
      />
      <path
        className={cx(styles.strengthRing, beat >= 1 && styles.visibleTrace)}
        d="M166 426 C240 466 408 464 486 424"
      />
    </svg>
  );
}

function HeldObjectVisual({ beat }: { beat: number }) {
  return (
    <svg className={styles.visualSvg} viewBox="0 0 640 520" aria-hidden="true">
      <path
        className={cx(styles.handShape, beat >= 0 && styles.visibleTrace)}
        d="M104 365 C154 312 226 322 270 376 C304 330 398 312 488 366"
      />
      <path
        className={cx(styles.handShape, styles.handShapeRight, beat >= 1 && styles.visibleTrace)}
        d="M145 424 C214 376 265 382 318 424 C374 382 430 378 496 423"
      />
      <path
        className={styles.vesselBody}
        d="M234 142 C274 112 376 112 416 142 L398 302 C366 338 286 338 254 302Z"
      />
      <path className={styles.vesselMouth} d="M234 142 C282 174 368 174 416 142 C374 114 276 114 234 142Z" />
      <path
        className={cx(styles.goldTrace, beat >= 0 && styles.visibleTrace)}
        d="M326 126 L310 194 L344 246 L316 316"
      />
      <path
        className={cx(styles.goldTrace, styles.traceFine, beat >= 2 && styles.visibleTrace)}
        d="M344 246 L400 268"
      />
      {[0, 1, 2, 3, 4].map((chip) => (
        <circle
          key={chip}
          className={cx(styles.sequenceChip, beat >= chip - 1 && styles.visibleTrace)}
          cx={228 + chip * 46}
          cy={452}
          r={chip === 2 ? 12 : 9}
        />
      ))}
    </svg>
  );
}

interface ClayChipRingProps {
  scene: number;
  language: Language;
  onNavigate?: (scene: number, beat: number) => void;
}

function ClayChipRing({ scene, language, onNavigate }: ClayChipRingProps) {
  return (
    <nav
      className={styles.nav}
      aria-label={language === "zh" ? "场景导航" : "Scene navigation"}
    >
      <div className={styles.navRing}>
        {SCENES.map((item, index) => {
          const angle = -90 + index * 72;
          const chipStyle = {
            "--chip-angle": `${angle}deg`,
            "--chip-counter-angle": `${-angle}deg`,
          } as CSSProperties;
          return (
            <button
              key={item.id}
              type="button"
              className={cx(styles.navChip, scene === item.id && styles.navChipActive)}
              style={chipStyle}
              aria-current={scene === item.id ? "step" : undefined}
              aria-label={`${item.id}. ${item[language].title}`}
              onClick={() => onNavigate?.(item.id, 0)}
            >
              <span>{item.nav[language]}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

export function getMetadata(lang: Language): StyleMetadata {
  return {
    id: "wabi-sabi-ceramic",
    band: "minimal-keynote",
    name: lang === "zh" ? "侘寂陶器" : "Wabi-Sabi Ceramic",
    theme: lang === "zh" ? "修复即策略" : "Repair as Strategy",
    densityLabel: lang === "zh" ? "留白 / 低密度" : "Sparse / contemplative",
    heroScene: 1,
    colors: {
      bg: "#eee4d4",
      ink: "#2b2923",
      panel: "#f7f0e4",
    },
    typography: {
      header: "Alegreya Sans 500",
      body: "Alegreya Sans 400 / Noto Serif SC 400",
    },
    tags: ["wabi-sabi", "ceramic", "minimal", "repair", "motion", "bilingual"],
    fonts: ["Alegreya Sans", "cjk:Noto Serif SC"],
    scenes: SCENES.map((sceneItem) => {
      const copy = sceneItem[lang];
      return {
        id: sceneItem.id,
        title: copy.title,
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

export default function RepairAsStrategyV2({
  scene,
  beat,
  language,
  isThumbnail,
  reducedMotion,
  onNavigate,
}: BespokeStyleProps) {
  useFonts();

  const motionDisabled = reducedMotion || isThumbnail;

  return (
    <div
      className={cx(
        styles.root,
        motionDisabled && styles.reduced,
        isThumbnail && styles.thumbnail,
      )}
    >
      <SpatialSceneTrack
        scene={scene}
        beat={beat}
        transitionKind="fade"
        transitionMap={TRANSITION_MAP}
        transitionDurationMs={760}
        reducedMotion={motionDisabled}
        beatLayoutModes={BEAT_LAYOUT_MODES}
        className={styles.track}
        renderScene={(sceneId, sceneBeat, isActive) => (
          <div className={styles.sceneLayer} data-beat-layout-item="true">
            <ScenePanel
              sceneId={sceneId}
              beat={sceneBeat}
              language={language}
              isActive={isActive}
              motionDisabled={motionDisabled}
            />
          </div>
        )}
      />

      {!isThumbnail && (
        <ClayChipRing scene={scene} language={language} onNavigate={onNavigate} />
      )}
    </div>
  );
}

export const repairAsStrategyTopic = defineStyleTopic({
  id: "repair-strategy",
  topic: {
    en: "Repair Strategy",
    zh: "修复策略",
  },
  model: "GPT 5.5",
  component: RepairAsStrategyV2,
  getMetadata,
});

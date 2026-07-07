import type { BespokeStyleProps, StyleMetadata } from "../types";
import SpatialSceneTrack, {
  type BeatLayoutMode,
  type SceneTransitionMap,
} from "./SpatialSceneTrack";
import { defineStyleTopic } from "./topic";

type Lang = "en" | "zh";
type SceneId = 1 | 2 | 3 | 4 | 5;

interface SceneCopy {
  eyebrow: string;
  title: string;
  subtitle: string;
  latin: string;
  caption: string;
  note: string;
  markers: [string, string, string];
  callouts: [string, string, string];
}

const SCENE_IDS: SceneId[] = [1, 2, 3, 4, 5];
const MAX_BEAT = 2;

const TRANSITION_MAP: SceneTransitionMap = {
  "1->2": "fade",
  "2->3": "wipe",
  "3->4": "scale-fade",
  "4->5": "page-flip",
};

const BEAT_LAYOUT_MODES: Record<SceneId, BeatLayoutMode> = {
  1: "reserved",
  2: "reserved",
  3: "reserved",
  4: "reserved",
  5: "reserved",
};

const SCENES: Record<Lang, Record<SceneId, SceneCopy>> = {
  en: {
    1: {
      eyebrow: "Plate XXVI",
      title: "Classifying Growth Signals",
      subtitle: "Treat each growth clue as a specimen: observed, named, compared.",
      latin: "Signalus incrementum",
      caption: "A single pressed signal, preserved before interpretation.",
      note: "Collected from activation traces, retention veins, and revenue buds.",
      markers: ["Observe", "Name", "Preserve"],
      callouts: ["first touch", "return vein", "value bud"],
    },
    2: {
      eyebrow: "Taxonomy",
      title: "Taxonomy of Signals",
      subtitle: "A signal becomes useful only after its family is named.",
      latin: "Familia signorum",
      caption: "Reach, retention, and revenue form the primary branches.",
      note: "Classification separates living growth from decorative motion.",
      markers: ["Reach", "Retention", "Revenue"],
      callouts: ["source", "family", "trait"],
    },
    3: {
      eyebrow: "Comparison",
      title: "Healthy Growth vs. Noise",
      subtitle: "Stable veins carry repeat value; blotches fade when context changes.",
      latin: "Incrementum sanum / rumor vacuus",
      caption: "Two specimens mounted side by side for like-against-like reading.",
      note: "Compare direction, repeatability, and conversion before naming progress.",
      markers: ["Clean", "Mixed", "False"],
      callouts: ["steady vein", "fragile blotch", "repeat proof"],
    },
    4: {
      eyebrow: "Annotation",
      title: "Annotate Leading Indicators",
      subtitle: "The earlier the marker appears, the more carefully it must be checked.",
      latin: "Indicia prima",
      caption: "Detail marks locate where a future outcome first becomes visible.",
      note: "Early movement matters only when it repeats and later converts.",
      markers: ["Early", "Repeats", "Converts"],
      callouts: ["early bud", "repeat vein", "conversion node"],
    },
    5: {
      eyebrow: "Plate Label",
      title: "Plate Label: Growth Signals",
      subtitle: "A decision label preserves the class, comparison, and next action.",
      latin: "Catalogus incrementi",
      caption: "Final label: classify, compare, decide.",
      note: "The label is not decoration; it is the act of making the signal usable.",
      markers: ["Classify", "Compare", "Decide"],
      callouts: ["class", "evidence", "action"],
    },
  },
  zh: {
    1: {
      eyebrow: "第二十六图版",
      title: "增长信号分类",
      subtitle: "把每个增长线索当作标本：先观察，再命名，再对照。",
      latin: "Signalus incrementum",
      caption: "单一信号被压平保存，先于解释。",
      note: "采自激活痕迹、留存叶脉与收入芽点。",
      markers: ["观察", "命名", "保存"],
      callouts: ["首次触达", "回访叶脉", "价值芽点"],
    },
    2: {
      eyebrow: "分类法",
      title: "信号分类法",
      subtitle: "只有归入家族后，信号才真正可用。",
      latin: "Familia signorum",
      caption: "触达、留存、收入构成三条主枝。",
      note: "分类把活的增长与装饰性波动分开。",
      markers: ["触达", "留存", "收入"],
      callouts: ["来源", "家族", "性状"],
    },
    3: {
      eyebrow: "对照",
      title: "健康增长与噪声",
      subtitle: "稳定叶脉承载复访价值；斑点会随情境褪去。",
      latin: "Incrementum sanum / rumor vacuus",
      caption: "两个标本并置，便于同类对照。",
      note: "先比较方向、可重复性与转化，再命名进展。",
      markers: ["干净", "混合", "虚假"],
      callouts: ["稳定叶脉", "脆弱斑点", "复验证据"],
    },
    4: {
      eyebrow: "标注",
      title: "标注领先指标",
      subtitle: "标记出现得越早，越需要仔细校验。",
      latin: "Indicia prima",
      caption: "细部标记指出未来结果最早显形的位置。",
      note: "早期动静只有在复现并转化后才有意义。",
      markers: ["早期", "复现", "转化"],
      callouts: ["早期芽点", "复访叶脉", "转化节点"],
    },
    5: {
      eyebrow: "标本铭牌",
      title: "标本铭牌：增长信号",
      subtitle: "决策铭牌保留类别、对照证据与下一步动作。",
      latin: "Catalogus incrementi",
      caption: "最终铭牌：分类、对照、决策。",
      note: "铭牌不是装饰，而是让信号可用的动作。",
      markers: ["分类", "对照", "决策"],
      callouts: ["类别", "证据", "行动"],
    },
  },
};

function normalizeScene(scene: number): SceneId {
  return scene === 1 || scene === 2 || scene === 3 || scene === 4 || scene === 5
    ? scene
    : 1;
}

function normalizeBeat(beat: number): number {
  if (!Number.isFinite(beat)) return 0;
  return Math.max(0, Math.min(MAX_BEAT, Math.floor(beat)));
}

function visibleAt(beat: number, index: number): "true" | "false" {
  return beat >= index ? "true" : "false";
}

function sceneTitle(lang: Lang, scene: SceneId): string {
  return SCENES[lang][scene].title;
}

export function getMetadata(lang: Lang): StyleMetadata {
  const isZh = lang === "zh";
  return {
    id: "botanical-specimen-plate",
    band: "craft-cultural",
    name: isZh ? "植物标本图版" : "Botanical Specimen Plate",
    theme: isZh ? "增长信号分类" : "Classifying Growth Signals",
    densityLabel: isZh ? "标本式阅读" : "Specimen Reading",
    heroScene: 1,
    colors: {
      bg: "#eadfbe",
      ink: "#3d311e",
      panel: "#d9c79b",
    },
    typography: {
      header: "Iowan Old Style 600",
      body: "Georgia 400",
    },
    tags: [
      "botanical",
      "specimen",
      "taxonomy",
      "observational",
      "craft-cultural",
      "light",
      "reserved",
    ],
    fonts: [
      "Iowan Old Style",
      "Georgia",
      "cjk:Songti SC",
      "cjk:Noto Serif CJK SC",
    ],
    scenes: SCENE_IDS.map((id) => ({
      id,
      title: sceneTitle(lang, id),
      beats: [
        {
          id: 0,
          action: isZh ? "标本主体入场" : "Specimen body appears",
          title: SCENES[lang][id].markers[0],
          body: SCENES[lang][id].caption,
        },
        {
          id: 1,
          action: isZh ? "分类标记显现" : "Classification marks appear",
          title: SCENES[lang][id].markers[1],
          body: SCENES[lang][id].subtitle,
        },
        {
          id: 2,
          action: isZh ? "铭牌注释完成" : "Plate annotation completes",
          title: SCENES[lang][id].markers[2],
          body: SCENES[lang][id].note,
        },
      ],
    })),
  };
}

function PlateFurniture({
  copy,
  sceneId,
  beat,
}: {
  copy: SceneCopy;
  sceneId: SceneId;
  beat: number;
}) {
  return (
    <header className="growthSignalsV2__furniture">
      <div
        className="growthSignalsV2__plateNumber"
        data-beat-layout-item="true"
      >
        {copy.eyebrow}
      </div>
      <div className="growthSignalsV2__species" data-beat-layout-item="true">
        <i>{copy.latin}</i>
      </div>
      <div className="growthSignalsV2__sceneIndex" data-beat-layout-item="true">
        {sceneId}/5 · {copy.markers[Math.min(beat, copy.markers.length - 1)]}
      </div>
    </header>
  );
}

function BeatMarkers({ copy, beat }: { copy: SceneCopy; beat: number }) {
  return (
    <ol className="growthSignalsV2__beatMarkers" aria-label="Beat markers">
      {copy.markers.map((marker, index) => (
        <li
          key={marker}
          data-beat-layout-item="true"
          data-visible={visibleAt(beat, index)}
          data-current={beat === index ? "true" : "false"}
        >
          <span className="growthSignalsV2__beatLeaf" aria-hidden="true" />
          <span>{marker}</span>
        </li>
      ))}
    </ol>
  );
}

function SceneTextBlock({ copy, beat }: { copy: SceneCopy; beat: number }) {
  return (
    <div className="growthSignalsV2__textBlock">
      <p
        className="growthSignalsV2__eyebrow"
        data-beat-layout-item="true"
        data-visible="true"
      >
        {copy.eyebrow}
      </p>
      <h1 data-beat-layout-item="true" data-visible="true">
        {copy.title}
      </h1>
      <p
        className="growthSignalsV2__subtitle"
        data-beat-layout-item="true"
        data-visible={visibleAt(beat, 1)}
      >
        {copy.subtitle}
      </p>
      <p
        className="growthSignalsV2__note"
        data-beat-layout-item="true"
        data-visible={visibleAt(beat, 2)}
      >
        {copy.note}
      </p>
    </div>
  );
}

function SpecimenSprig({ beat }: { beat: number }) {
  return (
    <svg
      className="growthSignalsV2__specimenSvg"
      viewBox="0 0 100 100"
      aria-hidden="true"
    >
      <path className="inkLine stem" d="M50 91 C47 72 56 56 51 32 C49 24 48 16 50 8" />
      <path
        className="inkLine vein"
        data-visible={visibleAt(beat, 0)}
        d="M49 72 C34 62 27 54 18 39 M51 61 C65 53 75 44 83 29 M50 44 C37 36 28 28 22 16 M51 35 C64 29 71 23 78 14"
      />
      <ellipse className="leaf leafA" cx="28" cy="56" rx="12" ry="22" transform="rotate(-36 28 56)" />
      <ellipse className="leaf leafB" cx="70" cy="46" rx="11" ry="21" transform="rotate(34 70 46)" />
      <ellipse className="leaf leafC" cx="32" cy="31" rx="10" ry="18" transform="rotate(-42 32 31)" />
      <ellipse className="leaf leafD" cx="69" cy="25" rx="9" ry="16" transform="rotate(38 69 25)" />
      <g data-visible={visibleAt(beat, 1)}>
        <circle className="bud" cx="50" cy="8" r="3.2" />
        <circle className="bud" cx="45" cy="12" r="2.6" />
        <circle className="bud" cx="55" cy="12" r="2.6" />
      </g>
      <g data-visible={visibleAt(beat, 2)}>
        <path className="pinLine" d="M58 17 L88 8" />
        <path className="pinLine" d="M77 39 L92 52" />
        <path className="pinLine" d="M28 73 L9 86" />
      </g>
    </svg>
  );
}

function TaxonomyPlate({ copy, beat }: { copy: SceneCopy; beat: number }) {
  return (
    <div className="growthSignalsV2__taxonomy">
      <div className="growthSignalsV2__taxonRoot" data-beat-layout-item="true">
        {copy.title}
      </div>
      <svg viewBox="0 0 100 64" aria-hidden="true">
        <path
          className="inkLine"
          d="M50 8 V20 M18 20 H82 M18 20 V34 M50 20 V34 M82 20 V34 M18 46 H82"
        />
      </svg>
      {copy.markers.map((marker, index) => (
        <div
          key={marker}
          className="growthSignalsV2__taxonNode"
          data-beat-layout-item="true"
          data-visible={visibleAt(beat, index)}
          data-node={index + 1}
        >
          <span>{marker}</span>
          <small>{copy.callouts[index]}</small>
        </div>
      ))}
    </div>
  );
}

function ComparisonPlate({ copy, beat }: { copy: SceneCopy; beat: number }) {
  return (
    <div className="growthSignalsV2__comparison">
      <div
        className="growthSignalsV2__compareHalf growthSignalsV2__compareHalf--healthy"
        data-beat-layout-item="true"
        data-visible={visibleAt(beat, 0)}
      >
        <SpecimenSprig beat={2} />
        <span>{copy.callouts[0]}</span>
      </div>
      <div
        className="growthSignalsV2__compareHalf growthSignalsV2__compareHalf--noise"
        data-beat-layout-item="true"
        data-visible={visibleAt(beat, 1)}
      >
        <SpecimenSprig beat={1} />
        <i aria-hidden="true" />
        <i aria-hidden="true" />
        <span>{copy.callouts[1]}</span>
      </div>
      <div
        className="growthSignalsV2__comparisonRibbon"
        data-beat-layout-item="true"
        data-visible={visibleAt(beat, 2)}
      >
        {copy.callouts[2]}
      </div>
    </div>
  );
}

function AnnotationPlate({ copy, beat }: { copy: SceneCopy; beat: number }) {
  return (
    <div className="growthSignalsV2__annotation">
      <SpecimenSprig beat={2} />
      {copy.callouts.map((callout, index) => (
        <div
          key={callout}
          className="growthSignalsV2__callout"
          data-beat-layout-item="true"
          data-visible={visibleAt(beat, index)}
          data-callout={index + 1}
        >
          <span>{String.fromCharCode(65 + index)}</span>
          <p>{callout}</p>
        </div>
      ))}
    </div>
  );
}

function FinalLabelPlate({ copy, beat }: { copy: SceneCopy; beat: number }) {
  return (
    <div className="growthSignalsV2__finalLabel">
      <div className="growthSignalsV2__labelCard" data-beat-layout-item="true">
        <p data-visible="true">{copy.eyebrow}</p>
        <h2 data-visible={visibleAt(beat, 0)}>{copy.title}</h2>
        <i data-visible={visibleAt(beat, 1)}>{copy.latin}</i>
        <div data-visible={visibleAt(beat, 2)}>
          {copy.markers.map((marker) => (
            <span key={marker}>{marker}</span>
          ))}
        </div>
      </div>
      <SpecimenSprig beat={beat} />
    </div>
  );
}

function PlateVisual({
  sceneId,
  copy,
  beat,
}: {
  sceneId: SceneId;
  copy: SceneCopy;
  beat: number;
}) {
  if (sceneId === 2) return <TaxonomyPlate copy={copy} beat={beat} />;
  if (sceneId === 3) return <ComparisonPlate copy={copy} beat={beat} />;
  if (sceneId === 4) return <AnnotationPlate copy={copy} beat={beat} />;
  if (sceneId === 5) return <FinalLabelPlate copy={copy} beat={beat} />;
  return (
    <div className="growthSignalsV2__singleSpecimen">
      <SpecimenSprig beat={beat} />
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
  language: Lang;
  isActive: boolean;
}) {
  const copy = SCENES[language][sceneId];

  return (
    <article
      className={`growthSignalsV2__scene growthSignalsV2__scene--${sceneId}`}
      data-scene-id={sceneId}
      data-active={isActive ? "true" : "false"}
      data-beat-layout-container="true"
      data-beat-layout-mode="reserved"
    >
      <PlateFurniture copy={copy} sceneId={sceneId} beat={beat} />
      <SceneTextBlock copy={copy} beat={beat} />
      <div className="growthSignalsV2__visualPlate" data-beat-layout-item="true">
        <PlateVisual sceneId={sceneId} copy={copy} beat={beat} />
      </div>
      <p
        className="growthSignalsV2__caption"
        data-beat-layout-item="true"
        data-visible={visibleAt(beat, 2)}
      >
        {copy.caption}
      </p>
      <BeatMarkers copy={copy} beat={beat} />
    </article>
  );
}

function PressedLeafNav({
  activeScene,
  language,
  onNavigate,
}: {
  activeScene: SceneId;
  language: Lang;
  onNavigate?: (scene: number, beat: number) => void;
}) {
  return (
    <nav className="growthSignalsV2__nav" aria-label="Scene navigation">
      {SCENE_IDS.map((sceneId) => {
        const copy = SCENES[language][sceneId];
        return (
          <button
            key={sceneId}
            type="button"
            data-active={activeScene === sceneId ? "true" : "false"}
            aria-label={copy.title}
            onPointerDown={(event) => event.stopPropagation()}
            onKeyDown={(event) => event.stopPropagation()}
            onClick={(event) => {
              event.stopPropagation();
              onNavigate?.(sceneId, 0);
            }}
          >
            <span className="growthSignalsV2__navLeaf" aria-hidden="true" />
            <span>{sceneId}</span>
          </button>
        );
      })}
    </nav>
  );
}

export default function BotanicalSpecimenGrowthSignals({
  scene,
  beat,
  language,
  isThumbnail,
  reducedMotion,
  onNavigate,
}: BespokeStyleProps) {
  const activeScene = normalizeScene(scene);
  const activeBeat = normalizeBeat(beat);
  const motionDisabled = reducedMotion || isThumbnail;

  return (
    <section
      className="growthSignalsV2"
      data-motion={motionDisabled ? "reduced" : "full"}
      data-thumbnail={isThumbnail ? "true" : "false"}
    >
      <style>{GROWTH_SIGNALS_V2_CSS}</style>
      <div className="growthSignalsV2__paper" aria-hidden="true" />
      <div className="growthSignalsV2__frame">
        <SpatialSceneTrack
          scene={activeScene}
          beat={activeBeat}
          sceneIds={SCENE_IDS}
          transitionKind="fade"
          transitionMap={TRANSITION_MAP}
          transitionDurationMs={840}
          reducedMotion={motionDisabled}
          beatLayoutModes={BEAT_LAYOUT_MODES}
          className="growthSignalsV2__track"
          renderScene={(sceneId, sceneBeat, isActive) => (
            <ScenePanel
              sceneId={normalizeScene(sceneId)}
              beat={normalizeBeat(sceneBeat)}
              language={language}
              isActive={isActive}
            />
          )}
        />
        {!isThumbnail && (
          <PressedLeafNav
            activeScene={activeScene}
            language={language}
            onNavigate={onNavigate}
          />
        )}
      </div>
    </section>
  );
}

export const growthSignalsTopic = defineStyleTopic({
  id: "growth-signals",
  topic: {
    en: "Growth Signals",
    zh: "增长信号",
  },
  model: "GPT-5.5",
  component: BotanicalSpecimenGrowthSignals,
  getMetadata,
});

const GROWTH_SIGNALS_V2_CSS = `
.growthSignalsV2 {
  --style-26-bg: #eadfbe;
  --style-26-paper: #f0e5c9;
  --style-26-ink: #3d311e;
  --style-26-sepia: #6c5834;
  --style-26-green: #707842;
  --style-26-ochre: #9b7b43;
  --style-26-rose: #966f60;
  --style-26-rule: rgba(83, 65, 35, 0.58);
  position: relative;
  container-type: size;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background:
    radial-gradient(circle at 18% 12%, rgba(255,255,255,0.32), transparent 26%),
    radial-gradient(circle at 80% 78%, rgba(132,103,57,0.16), transparent 34%),
    linear-gradient(135deg, #f2e8cb 0%, var(--style-26-bg) 48%, #ddcc9f 100%);
  color: var(--style-26-ink);
  font-family: "Iowan Old Style", "Palatino Linotype", Georgia, "Songti SC", "Noto Serif CJK SC", serif;
  font-variant-numeric: oldstyle-nums;
  letter-spacing: 0;
  isolation: isolate;
}

.growthSignalsV2 *,
.growthSignalsV2 *::before,
.growthSignalsV2 *::after {
  box-sizing: border-box;
}

.growthSignalsV2__paper {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  opacity: 0.54;
  background:
    repeating-linear-gradient(8deg, rgba(82,65,34,0.08) 0 0.08cqw, transparent 0.08cqw 2.2cqw),
    repeating-linear-gradient(98deg, rgba(255,255,255,0.16) 0 0.06cqw, transparent 0.06cqw 2.7cqw);
  mix-blend-mode: multiply;
}

.growthSignalsV2__frame {
  position: absolute;
  inset: 4.1cqh 4.2cqw;
  z-index: 1;
  overflow: hidden;
  border: 0.16cqw double var(--style-26-rule);
  background: rgba(240,229,201,0.86);
  box-shadow: inset 0 0 0 0.42cqw rgba(255,255,255,0.16);
}

.growthSignalsV2__track {
  position: absolute;
  inset: 0;
}

.growthSignalsV2__scene {
  position: absolute;
  inset: 0;
  display: grid;
  grid-template-columns: 33cqw 1fr;
  grid-template-rows: 9cqh 1fr 10cqh;
  column-gap: 3.2cqw;
  row-gap: 1.2cqh;
  padding: 5.2cqh 5.2cqw 4.2cqh;
  background:
    radial-gradient(circle at 50% 10%, rgba(255,255,255,0.30), transparent 30%),
    linear-gradient(180deg, rgba(248,240,217,0.96), rgba(229,214,174,0.96));
}

.growthSignalsV2__scene--1,
.growthSignalsV2__scene--5 {
  grid-template-columns: 30cqw 1fr;
}

.growthSignalsV2__scene--3 {
  grid-template-columns: 29cqw 1fr;
}

.growthSignalsV2__furniture {
  grid-column: 1 / 3;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  align-items: center;
  gap: 2cqw;
  padding-bottom: 1.2cqh;
  border-bottom: 0.08cqw solid var(--style-26-rule);
  font-size: 1.15cqw;
  font-variant: small-caps;
}

.growthSignalsV2__species {
  text-align: center;
  color: rgba(61,49,30,0.78);
}

.growthSignalsV2__sceneIndex {
  text-align: right;
}

.growthSignalsV2__textBlock {
  grid-column: 1;
  grid-row: 2;
  display: grid;
  grid-template-rows: 4cqh 17cqh 11cqh 14cqh;
  align-content: start;
  gap: 1.5cqh;
  padding-top: 4.2cqh;
}

.growthSignalsV2__eyebrow {
  margin: 0;
  font-size: 1.22cqw;
  font-variant: small-caps;
  color: var(--style-26-sepia);
}

.growthSignalsV2 h1 {
  margin: 0;
  max-width: 29cqw;
  font-size: 3.92cqw;
  line-height: 0.98;
  font-weight: 600;
}

.growthSignalsV2__subtitle,
.growthSignalsV2__note,
.growthSignalsV2__caption {
  margin: 0;
  font-size: 1.32cqw;
  line-height: 1.42;
  color: rgba(61,49,30,0.86);
}

.growthSignalsV2__note {
  font-style: italic;
  color: rgba(74,57,31,0.74);
}

.growthSignalsV2__visualPlate {
  grid-column: 2;
  grid-row: 2;
  position: relative;
  min-width: 0;
  min-height: 0;
  border: 0.12cqw solid rgba(88,69,36,0.46);
  background:
    linear-gradient(90deg, rgba(255,255,255,0.16), transparent 16%, transparent 84%, rgba(111,83,40,0.10)),
    rgba(242,232,204,0.72);
  overflow: hidden;
}

.growthSignalsV2__visualPlate::before,
.growthSignalsV2__visualPlate::after {
  content: "";
  position: absolute;
  inset: 2cqh 1.1cqw;
  border: 0.06cqw solid rgba(83,65,35,0.26);
  pointer-events: none;
}

.growthSignalsV2__visualPlate::after {
  inset: 4.2cqh 2.1cqw;
  border-style: dashed;
  opacity: 0.48;
}

.growthSignalsV2__singleSpecimen {
  position: absolute;
  inset: 3cqh 5cqw 5cqh;
  display: grid;
  place-items: center;
}

.growthSignalsV2__specimenSvg {
  width: 44cqw;
  height: 56cqh;
  overflow: visible;
}

.growthSignalsV2__singleSpecimen .growthSignalsV2__specimenSvg {
  width: 36cqw;
  height: 62cqh;
}

.growthSignalsV2 .inkLine {
  fill: none;
  stroke: var(--style-26-ink);
  stroke-width: 1.1;
  stroke-linecap: round;
  stroke-linejoin: round;
  opacity: 0.86;
}

.growthSignalsV2 .stem {
  stroke-width: 1.34;
}

.growthSignalsV2 .vein {
  stroke-width: 0.58;
  opacity: 0.7;
}

.growthSignalsV2 .leaf {
  fill: rgba(112,120,66,0.42);
  stroke: var(--style-26-ink);
  stroke-width: 0.54;
}

.growthSignalsV2 .leafB,
.growthSignalsV2 .leafD {
  fill: rgba(146,124,71,0.30);
}

.growthSignalsV2 .bud {
  fill: rgba(155,123,67,0.58);
  stroke: var(--style-26-ink);
  stroke-width: 0.36;
}

.growthSignalsV2 .pinLine {
  fill: none;
  stroke: var(--style-26-sepia);
  stroke-width: 0.42;
  stroke-dasharray: 1.6 1.1;
}

.growthSignalsV2__taxonomy {
  position: absolute;
  inset: 7cqh 5cqw 6cqh;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: 10cqh 18cqh 16cqh;
  gap: 2cqh 2cqw;
  align-items: center;
}

.growthSignalsV2__taxonomy svg {
  grid-column: 1 / 4;
  grid-row: 1 / 3;
  width: 100%;
  height: 100%;
}

.growthSignalsV2__taxonRoot,
.growthSignalsV2__taxonNode {
  border: 0.08cqw solid rgba(83,65,35,0.48);
  background: rgba(239,227,195,0.72);
  text-align: center;
  color: var(--style-26-ink);
}

.growthSignalsV2__taxonRoot {
  grid-column: 2;
  grid-row: 1;
  align-self: start;
  padding: 1.4cqh 0.8cqw;
  font-size: 1.42cqw;
  font-variant: small-caps;
}

.growthSignalsV2__taxonNode {
  grid-row: 3;
  min-height: 12cqh;
  padding: 2.1cqh 1cqw;
  font-size: 1.6cqw;
}

.growthSignalsV2__taxonNode small {
  display: block;
  margin-top: 1cqh;
  font-size: 0.98cqw;
  font-style: italic;
  color: rgba(61,49,30,0.68);
}

.growthSignalsV2__comparison {
  position: absolute;
  inset: 5cqh 4cqw 7cqh;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2.2cqw;
}

.growthSignalsV2__compareHalf {
  position: relative;
  display: grid;
  place-items: center;
  border: 0.08cqw solid rgba(83,65,35,0.42);
  background: rgba(239,227,195,0.54);
  overflow: hidden;
}

.growthSignalsV2__compareHalf .growthSignalsV2__specimenSvg {
  width: 19cqw;
  height: 48cqh;
}

.growthSignalsV2__compareHalf span,
.growthSignalsV2__comparisonRibbon {
  position: absolute;
  left: 2cqw;
  right: 2cqw;
  bottom: 2.3cqh;
  padding-top: 1.2cqh;
  border-top: 0.06cqw solid rgba(83,65,35,0.38);
  font-size: 1.2cqw;
  font-style: italic;
  text-align: center;
}

.growthSignalsV2__compareHalf--noise {
  background: rgba(223,203,167,0.58);
}

.growthSignalsV2__compareHalf--noise i {
  position: absolute;
  width: 6cqw;
  height: 8cqh;
  border-radius: 50%;
  background: rgba(150,111,96,0.26);
  border: 0.08cqw solid rgba(83,65,35,0.28);
}

.growthSignalsV2__compareHalf--noise i:nth-of-type(1) {
  top: 12cqh;
  right: 4cqw;
}

.growthSignalsV2__compareHalf--noise i:nth-of-type(2) {
  top: 28cqh;
  left: 5cqw;
}

.growthSignalsV2__comparisonRibbon {
  left: 26cqw;
  right: 26cqw;
  bottom: 0.8cqh;
  background: rgba(239,227,195,0.88);
}

.growthSignalsV2__annotation {
  position: absolute;
  inset: 3cqh 4cqw 5cqh;
}

.growthSignalsV2__annotation .growthSignalsV2__specimenSvg {
  position: absolute;
  left: 17cqw;
  top: 2cqh;
  width: 31cqw;
  height: 58cqh;
}

.growthSignalsV2__callout {
  position: absolute;
  display: grid;
  grid-template-columns: 2.6cqw 1fr;
  align-items: center;
  gap: 0.8cqw;
  width: 18cqw;
  padding: 1.2cqh 1cqw;
  border: 0.08cqw solid rgba(83,65,35,0.42);
  background: rgba(240,229,201,0.86);
  font-size: 1.2cqw;
}

.growthSignalsV2__callout span {
  display: grid;
  place-items: center;
  width: 2.2cqw;
  height: 2.2cqw;
  border-radius: 50%;
  border: 0.08cqw solid var(--style-26-sepia);
  font-variant: small-caps;
}

.growthSignalsV2__callout p {
  margin: 0;
  font-style: italic;
}

.growthSignalsV2__callout[data-callout="1"] {
  top: 8cqh;
  left: 6cqw;
}

.growthSignalsV2__callout[data-callout="2"] {
  top: 22cqh;
  right: 6cqw;
}

.growthSignalsV2__callout[data-callout="3"] {
  bottom: 5cqh;
  left: 8cqw;
}

.growthSignalsV2__finalLabel {
  position: absolute;
  inset: 6cqh 7cqw;
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  align-items: center;
  gap: 3cqw;
}

.growthSignalsV2__labelCard {
  display: grid;
  grid-template-rows: 5cqh 15cqh 7cqh 11cqh;
  gap: 1.8cqh;
  padding: 5cqh 3cqw;
  min-height: 43cqh;
  border: 0.12cqw double rgba(83,65,35,0.58);
  background: rgba(241,231,203,0.78);
  text-align: center;
}

.growthSignalsV2__labelCard p,
.growthSignalsV2__labelCard h2,
.growthSignalsV2__labelCard i {
  margin: 0;
}

.growthSignalsV2__labelCard p {
  font-size: 1.24cqw;
  font-variant: small-caps;
}

.growthSignalsV2__labelCard h2 {
  font-size: 2.92cqw;
  line-height: 1.06;
  font-weight: 600;
}

.growthSignalsV2__labelCard i {
  font-size: 1.32cqw;
  color: rgba(61,49,30,0.72);
}

.growthSignalsV2__labelCard div {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.8cqw;
  align-items: center;
}

.growthSignalsV2__labelCard span {
  padding: 1.1cqh 0.6cqw;
  border-top: 0.06cqw solid rgba(83,65,35,0.42);
  border-bottom: 0.06cqw solid rgba(83,65,35,0.42);
  font-size: 1.06cqw;
  font-variant: small-caps;
}

.growthSignalsV2__finalLabel .growthSignalsV2__specimenSvg {
  width: 24cqw;
  height: 50cqh;
}

.growthSignalsV2__caption {
  grid-column: 2;
  grid-row: 3;
  align-self: center;
  max-width: 48cqw;
  padding-top: 1.7cqh;
  border-top: 0.08cqw solid rgba(83,65,35,0.44);
  font-size: 1.18cqw;
  font-style: italic;
}

.growthSignalsV2__beatMarkers {
  grid-column: 1;
  grid-row: 3;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.8cqw;
  align-self: center;
  margin: 0;
  padding: 0;
  list-style: none;
}

.growthSignalsV2__beatMarkers li {
  display: grid;
  grid-template-columns: 1.5cqw 1fr;
  align-items: center;
  gap: 0.55cqw;
  min-height: 4.5cqh;
  font-size: 0.98cqw;
  font-variant: small-caps;
  color: rgba(61,49,30,0.72);
}

.growthSignalsV2__beatLeaf,
.growthSignalsV2__navLeaf {
  display: block;
  width: 1.05cqw;
  height: 2.2cqh;
  border: 0.06cqw solid var(--style-26-sepia);
  border-radius: 70% 30% 70% 30%;
  background: rgba(112,120,66,0.34);
  transform: rotate(-28deg);
}

.growthSignalsV2__beatMarkers li[data-current="true"] .growthSignalsV2__beatLeaf,
.growthSignalsV2__nav button[data-active="true"] .growthSignalsV2__navLeaf {
  background: rgba(155,123,67,0.58);
}

.growthSignalsV2__nav {
  position: absolute;
  left: 50%;
  bottom: 2.1cqh;
  z-index: 6;
  display: grid;
  grid-template-columns: repeat(5, 3.6cqw);
  gap: 0.7cqw;
  transform: translateX(-50%);
  padding: 0.9cqh 1.1cqw;
  border: 0.08cqw solid rgba(83,65,35,0.34);
  background: rgba(239,227,195,0.70);
}

.growthSignalsV2__nav button {
  appearance: none;
  display: grid;
  place-items: center;
  gap: 0.24cqh;
  width: 3.6cqw;
  height: 6.6cqh;
  padding: 0;
  border: 0;
  background: transparent;
  color: var(--style-26-ink);
  font: inherit;
  font-size: 0.9cqw;
  cursor: pointer;
}

.growthSignalsV2__nav button:focus-visible {
  outline: 0.12cqw solid rgba(83,65,35,0.72);
  outline-offset: 0.2cqw;
}

.growthSignalsV2__nav .growthSignalsV2__navLeaf {
  width: 1.35cqw;
  height: 3.2cqh;
  opacity: 0.62;
}

.growthSignalsV2__nav button[data-active="true"] .growthSignalsV2__navLeaf {
  opacity: 1;
  transform: rotate(-12deg) scale(1.18);
}

.growthSignalsV2 [data-visible="false"] {
  opacity: 0.18;
  transform: translateY(0.7cqh);
}

.growthSignalsV2 [data-visible="true"] {
  opacity: 1;
  transform: translateY(0);
}

.growthSignalsV2 [data-visible] {
  transition:
    opacity 520ms cubic-bezier(0.16, 1, 0.3, 1),
    transform 520ms cubic-bezier(0.16, 1, 0.3, 1);
}

.growthSignalsV2 .leaf,
.growthSignalsV2 .bud,
.growthSignalsV2 .pinLine,
.growthSignalsV2__navLeaf,
.growthSignalsV2__beatLeaf {
  transition:
    opacity 620ms cubic-bezier(0.16, 1, 0.3, 1),
    transform 620ms cubic-bezier(0.16, 1, 0.3, 1),
    background-color 620ms cubic-bezier(0.16, 1, 0.3, 1);
}

.growthSignalsV2[data-motion="full"] .growthSignalsV2__paper {
  animation: growthSignalsV2Dust 12s ease-in-out infinite alternate;
}

.growthSignalsV2[data-thumbnail="true"] .growthSignalsV2__scene {
  padding: 4cqh 4cqw;
}

.growthSignalsV2[data-thumbnail="true"] .growthSignalsV2__nav {
  display: none;
}

.growthSignalsV2[data-thumbnail="true"] .growthSignalsV2__textBlock {
  grid-template-rows: 4cqh 17cqh 8cqh 9cqh;
}

.growthSignalsV2[data-thumbnail="true"] h1 {
  font-size: 3.4cqw;
}

.growthSignalsV2[data-thumbnail="true"] .growthSignalsV2__subtitle,
.growthSignalsV2[data-thumbnail="true"] .growthSignalsV2__note {
  font-size: 1.12cqw;
}

.growthSignalsV2[data-motion="reduced"] *,
.growthSignalsV2[data-motion="reduced"] *::before,
.growthSignalsV2[data-motion="reduced"] *::after {
  transition-duration: 0s !important;
  animation-duration: 0s !important;
  animation-delay: 0s !important;
}

@keyframes growthSignalsV2Dust {
  from {
    opacity: 0.44;
    transform: translateY(-0.4cqh);
  }
  to {
    opacity: 0.64;
    transform: translateY(0.4cqh);
  }
}
`;

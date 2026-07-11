import { useState } from "react";
import type React from "react";
import type {
  TopicMetadata,
  TopicStageProps,
  TopicTransitionScore,
} from "../domain/topic";
import { defineTopic } from "../domain/topic";
import type { Source } from "../domain/evidence";
import SpatialSceneTrack from "../components/stage/SpatialSceneTrack";
import type {
  BeatLayoutMode,
  SceneTransitionMap,
} from "../components/stage/SpatialSceneTrack";
import styles from "./chrysalis-rebuild.module.css";

type Lang = "en" | "zh";
type SceneId = (typeof SCENE_IDS)[number];

interface BeatCopy {
  action: string;
  title: string;
  body: string;
}

interface SceneCopy {
  nav: string;
  preview: string;
  kicker: string;
  title: string;
  body: string;
  source: string;
  beats: BeatCopy[];
}

const SCENE_IDS = [1, 2, 3, 4, 5] as const;

export const CHRYSALIS_REBUILD_TRANSITION_SCORE = {
  "1->2": "iris-open",
  "2->3": "split-merge",
  "3->4": "iris-open",
  "4->5": "split-merge",
} as const satisfies TopicTransitionScore;

const TRANSITION_MAP: SceneTransitionMap = CHRYSALIS_REBUILD_TRANSITION_SCORE;

const BEAT_LAYOUT_MODES: Partial<Record<number, BeatLayoutMode>> = {
  1: "reserved",
  2: "reserved",
  3: "reserved",
  4: "reserved",
};

export const CHRYSALIS_REBUILD_SOURCES = [
  {
    id: "mjv-life-cycle",
    authority: "Monarch Joint Venture",
    title: "Monarch Life Cycle",
    citation: "Monarch Joint Venture, Monarch Biology: Life Cycle, Pupa and Adult sections.",
    url: "https://monarchjointventure.org/monarch-biology/life-cycle",
    supports:
      "Fixes the visible species to Danaus plexippus; supports the J-hang, chrysalis rather than cocoon, pre-existing clusters of adult-organ cells, 8–15 day summer pupal interval, and wing expansion after emergence.",
    boundary:
      "This public biology synthesis is species-specific at the life-cycle scale, but it is not a histological or cell-lineage atlas of a monarch pupa.",
  },
  {
    id: "complete-metamorphosis",
    authority: "Royal Society / University of Bath",
    title: "Complete metamorphosis of insects",
    citation:
      "Rolff, J., Johnston, P. R. & Reynolds, S. (2019), Philosophical Transactions of the Royal Society B 374:20190063.",
    url: "https://doi.org/10.1098/rstb.2019.0063",
    supports:
      "Supports the central correction that a pupa is not uniformly converted to soup: many larval tissues and organs persist while being re-specified or extensively remodeled.",
    boundary:
      "The review covers holometabolous insects broadly; it does not establish that every named tissue follows identical timing or fate in Danaus plexippus.",
  },
  {
    id: "cell-death-review",
    authority: "Royal Society / University of Insubria and University of Milan",
    title: "Cell death during complete metamorphosis",
    citation:
      "Tettamanti, G. & Casartelli, M. (2019), Philosophical Transactions of the Royal Society B 374:20190065.",
    url: "https://doi.org/10.1098/rstb.2019.0065",
    supports:
      "Supports three concurrent tissue-level outcomes described in Lepidoptera and other holometabolous insects: degeneration, remodeling or replacement, and proliferation and differentiation from imaginal primordia.",
    boundary:
      "Examples in the review span several insect taxa; the diagram therefore labels these as lepidopteran-scale mechanisms, not monarch-specific cell tracing.",
  },
  {
    id: "endocrine-view",
    authority: "Royal Society / University of Washington",
    title: "The evolution of insect metamorphosis: a developmental and endocrine view",
    citation:
      "Truman, J. W. & Riddiford, L. M. (2019), Philosophical Transactions of the Royal Society B 374:20190070.",
    url: "https://doi.org/10.1098/rstb.2019.0070",
    supports:
      "Supports the explanatory role of ecdysone and juvenile-hormone context, tissue-specific developmental responses, and imaginal primordia that grow and differentiate during metamorphosis.",
    boundary:
      "This is comparative developmental endocrinology; the signal rings are a teaching abstraction and are not measured hormone traces from one monarch chrysalis.",
  },
  {
    id: "monarch-heart",
    authority: "Royal Society Interface / UCLA",
    title: "Dynamic mechanical oscillations during metamorphosis of the monarch butterfly",
    citation:
      "Pelling, A. E. et al. (2009), Journal of the Royal Society Interface 6:29–37.",
    url: "https://doi.org/10.1098/rsif.2008.0224",
    supports:
      "Provides Danaus plexippus-specific evidence that measurable heart mechanics continue through the pupal interval while internal morphology changes.",
    boundary:
      "The study reports mechanical observations from a limited sample and does not map the origin of wings, eyes, legs, or every retained organ.",
  },
] as const satisfies readonly (Source & {
  id: string;
  authority: string;
  title: string;
  citation: string;
  boundary: string;
})[];

const SCENES: Record<SceneId, Record<Lang, SceneCopy>> = {
  1: {
    en: {
      nav: "Prepupa",
      preview: "prepupa",
      kicker: "DANAUS PLEXIPPUS · PREPUPA",
      title: "The rebuild begins before the chrysalis closes",
      body:
        "A late fifth-instar monarch leaves its milkweed, spins a silk pad and hangs in a J. Feeding gives way to a non-feeding developmental stage.",
      source: "Species evidence · Monarch Joint Venture",
      beats: [
        {
          action: "End the feeding stage",
          title: "Growth has filled the larval body",
          body: "The caterpillar stops feeding and searches for a secure place to pupate.",
        },
        {
          action: "Anchor the final larval molt",
          title: "A silk pad holds the turn",
          body: "The cremaster anchors the body as the last larval skin reveals the chrysalis.",
        },
      ],
    },
    zh: {
      nav: "预蛹",
      preview: "预蛹准备",
      kicker: "帝王蝶 · DANAUS PLEXIPPUS · 预蛹",
      title: "蛹壳闭合之前，重建已经开始",
      body:
        "末龄帝王蝶幼虫离开马利筋，织出丝垫并倒挂成 J 形。取食生长阶段结束，身体转入不再进食的发育阶段。",
      source: "物种依据 · Monarch Joint Venture",
      beats: [
        {
          action: "结束取食阶段",
          title: "幼虫身体完成生长储备",
          body: "毛毛虫停止进食，寻找安全位置化蛹。",
        },
        {
          action: "固定最后一次幼虫蜕皮",
          title: "丝垫托住这次转身",
          body: "臀棘锚住身体，最后一层幼虫表皮退去，露出蛹体。",
        },
      ],
    },
  },
  2: {
    en: {
      nav: "Signals",
      preview: "signal window",
      kicker: "DIDACTIC CUTAWAY · NOT LITERAL TRANSPARENCY",
      title: "Signals change what each tissue is asked to do",
      body:
        "Ecdysone pulses and juvenile-hormone context coordinate metamorphic decisions. The same systemic cue can produce different tissue responses.",
      source: "Mechanism scale · comparative insect endocrinology",
      beats: [
        {
          action: "Commit to the pupal stage",
          title: "The larval program yields",
          body: "A developmental-hormone pulse arrives in a low juvenile-hormone context.",
        },
        {
          action: "Route tissue-specific responses",
          title: "One signal, several instructions",
          body: "Each tissue responds according to its receptors, state, and developmental fate.",
        },
        {
          action: "Continue adult differentiation",
          title: "The adult program takes the lead",
          body: "Later endocrine changes coordinate the next molt and adult differentiation.",
        },
      ],
    },
    zh: {
      nav: "信号",
      preview: "信号窗口",
      kicker: "教学剖窗 · 不是蛹体真的透明",
      title: "信号改变每类组织接到的任务",
      body:
        "蜕皮激素脉冲与保幼激素背景共同协调变态决策。同一种全身信号，可以让不同组织产生不同响应。",
      source: "机制尺度 · 昆虫比较发育内分泌学",
      beats: [
        {
          action: "进入蛹期程序",
          title: "幼虫程序开始退场",
          body: "发育激素脉冲在较低的保幼激素背景中到来。",
        },
        {
          action: "分配组织特异响应",
          title: "同一信号，多种指令",
          body: "每种组织按照自身受体、状态和发育命运作出响应。",
        },
        {
          action: "继续成虫分化",
          title: "成虫程序接过主导权",
          body: "之后的内分泌变化继续协调下一次蜕皮与成虫分化。",
        },
      ],
    },
  },
  3: {
    en: {
      nav: "Three fates",
      preview: "three tissue fates",
      kicker: "THREE PROCESSES · ONE LIVING PUPA",
      title: "Breakdown, persistence and rebuilding coexist",
      body:
        "Selected larval tissues are removed; many organs persist and remodel; imaginal primordia expand and differentiate. The chrysalis is not a uniform soup.",
      source: "Evidence boundary · Lepidoptera and Holometabola reviews",
      beats: [
        {
          action: "Remove selected larval structures",
          title: "Break down",
          body: "Programmed cell death clears or reshapes tissues whose larval job has ended.",
        },
        {
          action: "Retain and remodel working systems",
          title: "Persist + remodel",
          body: "Parts of the nervous system, musculature, gut, epidermis and other organs can persist while changing.",
        },
        {
          action: "Expand adult primordia",
          title: "Grow + differentiate",
          body: "Pre-existing imaginal primordia proliferate and take on adult structure.",
        },
      ],
    },
    zh: {
      nav: "三种命运",
      preview: "三类组织命运",
      kicker: "三种过程 · 同一个活着的蛹体",
      title: "拆解、保留与重建同时发生",
      body:
        "部分幼虫组织被移除；许多器官保留并改造；成虫原基扩展、分化。蛹内不是一锅均匀的“汤”。",
      source: "证据边界 · 鳞翅目与全变态昆虫综述",
      beats: [
        {
          action: "移除特定幼虫结构",
          title: "选择性拆解",
          body: "程序性细胞死亡清除或重塑已经完成幼虫任务的组织。",
        },
        {
          action: "保留并改造持续工作的系统",
          title: "保留并改造",
          body: "部分神经、肌肉、消化道、表皮等系统可以延续，同时改变结构。",
        },
        {
          action: "扩展成虫原基",
          title: "生长并分化",
          body: "幼虫期已经存在的成虫原基增殖，并逐步形成成虫结构。",
        },
      ],
    },
  },
  4: {
    en: {
      nav: "Body map",
      preview: "body map",
      kicker: "ADULT LANDMARKS · SIMPLIFIED LEPIDOPTERAN MAP",
      title: "New structures expand onto a body that never vanished",
      body:
        "Wings, compound eyes, antennae and adult legs take shape while retained systems are remodeled around them. Arrows show landmarks, not one-to-one cell lineages.",
      source: "Scope note · no monarch cell-by-cell lineage is implied",
      beats: [
        {
          action: "Expand paired wings",
          title: "Wings unfold inside",
          body: "Wing primordia grow into thin, folded adult structures.",
        },
        {
          action: "Differentiate sensory structures",
          title: "Eyes and antennae reorganize sensing",
          body: "Compound eyes and antennae become adult landmarks at the head.",
        },
        {
          action: "Complete the adult body plan",
          title: "Legs meet a remodeled core",
          body: "Appendages and persistent organ systems settle into the adult arrangement.",
        },
      ],
    },
    zh: {
      nav: "身体地图",
      preview: "身体地图",
      kicker: "成虫地标 · 简化的鳞翅目示意",
      title: "新结构生长在从未消失的身体之上",
      body:
        "翅、复眼、触角和成虫足逐步成形，保留的系统也在周围改造。箭头表示结构地标，不代表一一对应的细胞谱系。",
      source: "范围说明 · 不暗示帝王蝶逐细胞谱系图",
      beats: [
        {
          action: "扩展成对翅结构",
          title: "翅在内部展开",
          body: "翅原基长成轻薄、折叠的成虫结构。",
        },
        {
          action: "分化感觉结构",
          title: "复眼与触角重组感知",
          body: "复眼和触角在头部形成成虫地标。",
        },
        {
          action: "完成成虫身体布局",
          title: "足与改造后的核心会合",
          body: "附肢与持续存在的器官系统落入成虫排列。",
        },
      ],
    },
  },
  5: {
    en: {
      nav: "Emergence",
      preview: "emergence",
      kicker: "EMERGENCE · STILLNESS BEFORE FLIGHT",
      title: "Emergence is the last assembly step, not the first",
      body:
        "After roughly 8–15 days in normal summer conditions, a monarch emerges, pumps fluid into folded wings, then rests for hours while they dry.",
      source: "Species boundary · Danaus plexippus life-cycle evidence",
      beats: [
        {
          action: "Rest while the wings expand and dry",
          title: "One monarch, one bounded explanation",
          body: "Species differ; this diagram combines monarch life history with broader lepidopteran mechanisms and is not a cell-by-cell atlas.",
        },
      ],
    },
    zh: {
      nav: "羽化",
      preview: "羽化",
      kicker: "羽化 · 起飞之前的静止",
      title: "羽化是最后一道装配，不是第一道",
      body:
        "在正常夏季条件下，帝王蝶蛹期约为 8–15 天；成虫出来后把体液泵入折叠的翅，再静止数小时等待翅变干。",
      source: "物种边界 · 帝王蝶生活史证据",
      beats: [
        {
          action: "静止等待翅展开并变干",
          title: "一只帝王蝶，一份有边界的解释",
          body: "不同物种会有差异；本图结合帝王蝶生活史与较广义的鳞翅目机制，并非逐细胞图谱。",
        },
      ],
    },
  },
};

function isSceneId(scene: number): scene is SceneId {
  return SCENE_IDS.includes(scene as SceneId);
}

function clampBeat(beat: number, total: number): number {
  return Math.min(Math.max(beat, 0), total - 1);
}

function buildMetadata(lang: Lang): TopicMetadata {
  return {
    theme:
      lang === "zh"
        ? "帝王蝶（Danaus plexippus）蛹中重建"
        : "Danaus plexippus: rebuilding inside a chrysalis",
    densityLabel: lang === "zh" ? "中等 / 图解" : "Medium / Diagram",
    heroScene: 3,
    colors: {
      bg: "#f7eadc",
      ink: "#51434d",
      panel: "#fff6eb",
    },
    typography: {
      header: "Avenir Next Rounded 700",
      body: lang === "zh" ? "PingFang SC 500" : "Avenir Next 500",
    },
    tags: [
      "soft-pastel",
      "friendly",
      "biology",
      "diagram-explainer",
      "material-transformation",
      "rounded-svg",
    ],
    fonts: ["Avenir Next Rounded", "Avenir Next", "cjk:PingFang SC"],
    scenes: SCENE_IDS.map((sceneId) => {
      const copy = SCENES[sceneId][lang];
      return {
        id: sceneId,
        title: copy.nav,
        beats: copy.beats.map((beat, beatId) => ({
          id: beatId,
          action: beat.action,
          title: beat.title,
          body: beat.body,
        })),
      };
    }),
  };
}

function TopicStage({
  scene,
  beat,
  language,
  isThumbnail,
  reducedMotion,
  onNavigate,
}: TopicStageProps) {
  const activeScene = isSceneId(scene) ? scene : 1;
  const noMotion = reducedMotion || isThumbnail;
  const activeBeat = clampBeat(beat, SCENES[activeScene][language].beats.length);

  return (
    <div
      className={[styles.root, noMotion ? styles.noMotion : ""]
        .filter(Boolean)
        .join(" ")}
      data-reduced-motion={noMotion ? "true" : "false"}
    >
      <PaperAtmosphere />
      <SpatialSceneTrack
        scene={activeScene}
        beat={activeBeat}
        transitionKind="iris-open"
        transitionMap={TRANSITION_MAP}
        transitionDurationMs={620}
        reducedMotion={noMotion}
        beatLayoutModes={BEAT_LAYOUT_MODES}
        renderScene={(sceneId, sceneBeat, isActive) => (
          <ScenePanel
            sceneId={sceneId as SceneId}
            beat={sceneBeat}
            language={language}
            motionSafe={!noMotion && isActive}
          />
        )}
      />
      {!isThumbnail && (
        <PollenNavigation
          scene={activeScene}
          language={language}
          motionSafe={!noMotion}
          onNavigate={onNavigate}
        />
      )}
    </div>
  );
}

function ScenePanel({
  sceneId,
  beat,
  language,
  motionSafe,
}: {
  sceneId: SceneId;
  beat: number;
  language: Lang;
  motionSafe: boolean;
}) {
  const copy = SCENES[sceneId][language];
  const safeBeat = clampBeat(beat, copy.beats.length);

  return (
    <section
      className={styles.scene}
      aria-label={copy.nav}
      data-composition={COMPOSITIONS[sceneId]}
      data-motion-safe={motionSafe ? "true" : "false"}
    >
      <SceneHeading copy={copy} beat={safeBeat} />
      {sceneId === 1 && <PrepupaComposition copy={copy} beat={safeBeat} language={language} />}
      {sceneId === 2 && <SignalComposition copy={copy} beat={safeBeat} language={language} />}
      {sceneId === 3 && <TissueFatesComposition copy={copy} beat={safeBeat} language={language} />}
      {sceneId === 4 && <BodyMapComposition copy={copy} beat={safeBeat} language={language} />}
      {sceneId === 5 && <EmergenceComposition copy={copy} language={language} />}
      <p className={styles.sourceRef} data-source-ref="true">
        {copy.source}
      </p>
    </section>
  );
}

const COMPOSITIONS: Record<SceneId, string> = {
  1: "character-hero",
  2: "chrysalis-window",
  3: "three-process-field",
  4: "adult-body-map",
  5: "still-emergence",
};

function SceneHeading({ copy, beat }: { copy: SceneCopy; beat: number }) {
  return (
    <header className={styles.heading} data-beat-layout-item="true">
      <p className={styles.kicker}>{copy.kicker}</p>
      <h1>{copy.title}</h1>
      <p className={styles.lede}>{copy.body}</p>
      <div className={styles.beatLine} aria-label="Beat state">
        {copy.beats.map((item, index) => (
          <span
            key={item.action}
            className={index <= beat ? styles.beatActive : ""}
            aria-hidden="true"
          />
        ))}
      </div>
    </header>
  );
}

function PrepupaComposition({
  copy,
  beat,
  language,
}: {
  copy: SceneCopy;
  beat: number;
  language: Lang;
}) {
  return (
    <div className={styles.prepupaLayout} data-beat-layout-item="true">
      <div className={styles.beatNote} data-beat-layout-item="true">
        <span>{String(beat + 1).padStart(2, "0")}</span>
        <h2>{copy.beats[beat].title}</h2>
        <p>{copy.beats[beat].body}</p>
      </div>
      <CaterpillarToChrysalis beat={beat} language={language} />
    </div>
  );
}

function SignalComposition({
  copy,
  beat,
  language,
}: {
  copy: SceneCopy;
  beat: number;
  language: Lang;
}) {
  return (
    <div className={styles.signalLayout} data-beat-layout-item="true">
      <ChrysalisSignalWindow beat={beat} language={language} />
      <div className={styles.signalSteps} data-beat-layout-item="true">
        {copy.beats.map((item, index) => (
          <article
            key={item.action}
            className={styles.signalStep}
            data-revealed={index <= beat ? "true" : "false"}
            data-beat-layout-item="true"
          >
            <span>{String(index + 1).padStart(2, "0")}</span>
            <div>
              <h2>{item.title}</h2>
              <p>{item.body}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function TissueFatesComposition({
  copy,
  beat,
  language,
}: {
  copy: SceneCopy;
  beat: number;
  language: Lang;
}) {
  const fateLabels =
    language === "zh"
      ? ["特定幼虫组织", "持续工作的器官", "成虫原基"]
      : ["Selected larval tissues", "Persistent organ systems", "Imaginal primordia"];
  const fates = ["break-down", "persist-remodel", "grow-differentiate"] as const;

  return (
    <div className={styles.fateField} data-beat-layout-item="true">
      <TissueFlowDiagram beat={beat} />
      {copy.beats.map((item, index) => (
        <article
          key={item.action}
          className={styles.fateZone}
          data-tissue-fate={fates[index]}
          data-revealed={index <= beat ? "true" : "false"}
          data-beat-layout-item="true"
        >
          <p>{fateLabels[index]}</p>
          <h2>{item.title}</h2>
          <span>{item.body}</span>
        </article>
      ))}
      <strong className={styles.notSoup}>
        {language === "zh" ? "不是整只幼虫液化" : "Not a uniform soup"}
      </strong>
    </div>
  );
}

function BodyMapComposition({
  copy,
  beat,
  language,
}: {
  copy: SceneCopy;
  beat: number;
  language: Lang;
}) {
  return (
    <div className={styles.bodyMapLayout} data-beat-layout-item="true">
      <AdultBodyMap beat={beat} language={language} />
      <div className={styles.mapNarrative} data-beat-layout-item="true">
        {copy.beats.map((item, index) => (
          <div
            key={item.action}
            className={styles.mapLine}
            data-revealed={index <= beat ? "true" : "false"}
            data-beat-layout-item="true"
          >
            <span>{index + 1}</span>
            <div>
              <h2>{item.title}</h2>
              <p>{item.body}</p>
            </div>
          </div>
        ))}
        <p className={styles.mapBoundary}>
          {language === "zh"
            ? "这是简化的鳞翅目地图，不是帝王蝶逐细胞谱系。"
            : "This is a simplified lepidopteran map, not a monarch cell-by-cell lineage."}
        </p>
      </div>
    </div>
  );
}

function EmergenceComposition({ copy, language }: { copy: SceneCopy; language: Lang }) {
  return (
    <div className={styles.emergenceLayout} data-beat-layout-item="true">
      <div className={styles.adultStage} data-beat-layout-item="true">
        <MonarchAdult />
      </div>
      <div className={styles.emergenceNote} data-beat-layout-item="true">
        <p className={styles.latin}>Danaus plexippus</p>
        <h2>{copy.beats[0].title}</h2>
        <p>{copy.beats[0].body}</p>
        <div className={styles.boundarySeal}>
          {language === "zh"
            ? "物种会有差异 · 不是逐细胞图谱"
            : "Species differ · not a cell-by-cell atlas"}
        </div>
      </div>
    </div>
  );
}

function CaterpillarToChrysalis({ beat, language }: { beat: number; language: Lang }) {
  return (
    <svg
      className={styles.characterSvg}
      viewBox="0 0 760 540"
      role="img"
      aria-label="A monarch caterpillar preparing to become a chrysalis"
      data-beat-layout-item="true"
    >
      <path className={styles.twig} d="M70 82 C250 44 504 50 690 96" />
      <path className={styles.silkPad} d="M526 85 C548 71 573 74 592 92 C573 103 548 103 526 85 Z" />
      <g className={styles.caterpillar} data-revealed={beat === 0 ? "true" : "false"}>
        {[0, 1, 2, 3, 4, 5].map((index) => (
          <g key={index} transform={`translate(${146 + index * 54} ${286 + Math.sin(index) * 18})`}>
            <circle r={52 - index * 2} className={index % 2 === 0 ? styles.caterpillarMint : styles.caterpillarButter} />
            <path className={styles.caterpillarBand} d="M-30 -34 Q0 -12 30 -34 M-34 12 Q0 31 34 12" />
          </g>
        ))}
        <circle cx="126" cy="270" r="49" className={styles.caterpillarHead} />
        <circle cx="111" cy="260" r="4" className={styles.eyeDot} />
        <circle cx="138" cy="260" r="4" className={styles.eyeDot} />
        <path className={styles.smallSmile} d="M112 280 Q125 287 139 278" />
        <path className={styles.antennaLine} d="M103 232 Q88 201 96 177 M148 232 Q167 202 162 177" />
        <path className={styles.softLeg} d="M214 328 q-10 34 8 42 M278 332 q-8 31 10 39 M340 325 q-6 31 11 38" />
      </g>
      <g className={styles.energyBundle} data-revealed={beat === 0 ? "true" : "false"}>
        <path d="M363 382 Q401 345 441 382 L433 448 Q401 469 370 446 Z" />
        <path d="M382 382 Q400 359 421 382" />
        <circle cx="390" cy="416" r="9" />
        <circle cx="414" cy="428" r="7" />
      </g>
      <g className={styles.jHang} data-revealed={beat >= 1 ? "true" : "false"}>
        <path className={styles.silkLine} d="M560 92 L560 132" />
        <path className={styles.jBody} d="M560 129 C505 151 498 260 541 318 C570 357 618 333 621 286 C624 247 594 231 572 247" />
        <path className={styles.jBand} d="M527 178 Q560 192 592 173 M516 227 Q555 244 604 224 M527 278 Q562 295 612 275" />
        <circle cx="575" cy="266" r="4" className={styles.eyeDot} />
      </g>
      <g className={styles.chrysalisGhost} data-revealed={beat >= 1 ? "true" : "false"}>
        <path d="M553 124 C502 157 507 275 560 351 C613 278 619 160 568 124 Z" />
        <path d="M519 191 Q560 207 603 190 M524 232 Q560 247 598 232" />
      </g>
      <text x="86" y="492" className={styles.svgCaption}>
        {language === "zh" ? "取食阶段" : "feeding stage"}
      </text>
      <text x="515" y="492" className={styles.svgCaption}>
        {language === "zh" ? "转入蛹期" : "pupal turn"}
      </text>
    </svg>
  );
}

function ChrysalisSignalWindow({ beat, language }: { beat: number; language: Lang }) {
  return (
    <div className={styles.windowWrap} data-beat-layout-item="true">
      <svg
        className={styles.windowSvg}
        viewBox="0 0 510 650"
        role="img"
        aria-label="Didactic cutaway of hormone signals around a monarch chrysalis"
      >
        <path className={styles.chrysalisShell} d="M253 48 C150 98 119 294 171 496 C192 576 232 611 255 626 C284 608 324 567 342 491 C389 292 355 99 253 48 Z" />
        <path className={styles.shellShade} d="M254 75 C194 122 177 301 208 467 C220 528 241 566 256 584 C270 565 291 526 302 465 C333 298 314 123 254 75 Z" />
        <path className={styles.coreLine} d="M255 143 C223 220 224 369 255 493 C287 367 288 219 255 143 Z" />
        <path className={styles.windowVein} d="M211 211 Q255 243 300 211 M199 291 Q254 328 312 292 M207 386 Q255 417 304 386" />
        {[0, 1, 2].map((index) => (
          <ellipse
            key={index}
            cx="255"
            cy="329"
            rx={116 + index * 47}
            ry={166 + index * 55}
            className={styles.signalRing}
            data-revealed={index <= beat ? "true" : "false"}
          />
        ))}
        <circle cx="255" cy="330" r="22" className={styles.signalNode} />
        <path className={styles.cremaster} d="M233 52 Q255 21 278 52" />
      </svg>
      <span className={styles.windowDisclaimer}>
        {language === "zh" ? "教学剖窗" : "diagram window"}
      </span>
    </div>
  );
}

function TissueFlowDiagram({ beat }: { beat: number }) {
  return (
    <svg className={styles.tissueFlow} viewBox="0 0 1200 420" aria-hidden="true">
      <path className={styles.fateRiver} d="M78 212 C214 92 310 331 456 211 C596 95 704 332 849 212 C963 117 1056 148 1133 211" />
      <g className={styles.breakParticles} data-revealed={beat >= 0 ? "true" : "false"}>
        <circle cx="186" cy="171" r="25" /><circle cx="238" cy="230" r="18" /><circle cx="145" cy="260" r="13" />
      </g>
      <g className={styles.persistOrgan} data-revealed={beat >= 1 ? "true" : "false"}>
        <path d="M488 247 C472 184 533 141 584 175 C619 115 707 137 705 206 C763 229 727 314 661 294 C621 337 536 313 542 260 C516 276 494 267 488 247 Z" />
        <path d="M541 238 Q603 190 671 240 Q608 287 541 238 Z" />
      </g>
      <g className={styles.growthBud} data-revealed={beat >= 2 ? "true" : "false"}>
        <path d="M918 274 C890 215 929 149 991 156 C1029 96 1114 127 1112 203 C1110 275 1014 318 918 274 Z" />
        <path d="M986 252 Q1025 195 1084 170 M1030 222 Q1061 225 1097 245" />
        <circle cx="964" cy="212" r="12" /><circle cx="1034" cy="164" r="9" />
      </g>
    </svg>
  );
}

function AdultBodyMap({ beat, language }: { beat: number; language: Lang }) {
  const labels =
    language === "zh"
      ? { wings: "翅", eyes: "复眼", antennae: "触角", legs: "成虫足" }
      : { wings: "wings", eyes: "compound eyes", antennae: "antennae", legs: "adult legs" };
  return (
    <svg
      className={styles.bodyMapSvg}
      viewBox="0 0 760 660"
      role="img"
      aria-label="Simplified body map of adult monarch structures"
      data-beat-layout-item="true"
    >
      <path className={styles.mapChrysalis} d="M380 35 C263 91 228 301 287 524 C311 607 357 636 381 649 C409 632 454 599 475 521 C531 300 493 92 380 35 Z" />
      <g data-adult-structure="true" data-revealed={beat >= 0 ? "true" : "false"} className={styles.mapWings}>
        <path d="M364 224 C285 116 152 125 127 253 C111 334 174 398 307 372 C253 442 283 520 369 471 Z" />
        <path d="M396 224 C475 116 608 125 633 253 C649 334 586 398 453 372 C507 442 477 520 391 471 Z" />
        <path d="M185 221 Q257 265 326 353 M575 221 Q503 265 434 353" />
      </g>
      <g data-adult-structure="true" data-revealed={beat >= 1 ? "true" : "false"} className={styles.mapEyes}>
        <circle cx="357" cy="174" r="27" /><circle cx="404" cy="174" r="27" />
        <circle cx="357" cy="174" r="8" /><circle cx="404" cy="174" r="8" />
      </g>
      <g data-adult-structure="true" data-revealed={beat >= 1 ? "true" : "false"} className={styles.mapAntennae}>
        <path d="M359 154 C318 103 302 69 314 35 M401 154 C442 103 458 69 446 35" />
        <circle cx="314" cy="35" r="9" /><circle cx="446" cy="35" r="9" />
      </g>
      <g data-adult-structure="true" data-revealed={beat >= 2 ? "true" : "false"} className={styles.mapLegs}>
        <path d="M351 334 C295 370 267 409 249 471 M349 381 C297 434 283 479 291 534 M410 334 C465 370 493 409 511 471 M412 381 C464 434 478 479 469 534" />
      </g>
      <path className={styles.mapBody} d="M380 192 C344 225 337 315 353 449 C361 518 372 550 380 570 C390 550 400 518 408 449 C424 315 416 225 380 192 Z" />
      <path className={styles.mapCallout} d="M194 142 H69 M566 142 H691 M186 488 H72 M574 488 H689" />
      <text x="49" y="132" className={styles.mapLabel}>{labels.wings}</text>
      <text x="584" y="132" className={styles.mapLabel}>{labels.eyes}</text>
      <text x="34" y="522" className={styles.mapLabel}>{labels.legs}</text>
      <text x="574" y="522" className={styles.mapLabel}>{labels.antennae}</text>
    </svg>
  );
}

function MonarchAdult() {
  return (
    <svg
      className={styles.adultSvg}
      viewBox="0 0 760 620"
      role="img"
      aria-label="A newly emerged monarch resting with open wings"
      data-monarch-adult="true"
    >
      <path className={styles.restingTwig} d="M76 540 C241 502 482 509 690 552" />
      <g className={styles.leftWing}>
        <path d="M369 286 C287 99 96 65 60 227 C31 358 167 440 344 394 C275 477 319 551 379 451 Z" />
        <path d="M340 294 Q208 228 91 201 M332 337 Q202 345 94 405 M276 178 Q239 280 211 414 M170 143 Q181 260 137 347" />
        <circle cx="101" cy="247" r="12" /><circle cx="113" cy="311" r="9" /><circle cx="141" cy="382" r="10" />
      </g>
      <g className={styles.rightWing}>
        <path d="M391 286 C473 99 664 65 700 227 C729 358 593 440 416 394 C485 477 441 551 381 451 Z" />
        <path d="M420 294 Q552 228 669 201 M428 337 Q558 345 666 405 M484 178 Q521 280 549 414 M590 143 Q579 260 623 347" />
        <circle cx="659" cy="247" r="12" /><circle cx="647" cy="311" r="9" /><circle cx="619" cy="382" r="10" />
      </g>
      <path className={styles.adultBody} d="M380 214 C345 254 348 410 380 487 C412 410 415 254 380 214 Z" />
      <circle cx="380" cy="194" r="32" className={styles.adultHead} />
      <path className={styles.adultAntenna} d="M365 172 Q327 112 305 86 M395 172 Q433 112 455 86" />
      <path className={styles.adultLegs} d="M366 355 Q307 411 286 514 M394 355 Q453 411 474 514" />
    </svg>
  );
}

function PaperAtmosphere() {
  return (
    <div className={styles.atmosphere} aria-hidden="true">
      <i className={styles.washOne} />
      <i className={styles.washTwo} />
      <i className={styles.washThree} />
      <svg viewBox="0 0 1920 1080" preserveAspectRatio="none">
        <path d="M0 873 C338 793 478 992 802 921 C1104 855 1385 715 1920 841" />
        <path d="M0 191 C328 303 617 61 960 174 C1301 287 1578 98 1920 168" />
      </svg>
    </div>
  );
}

function PollenNavigation({
  scene,
  language,
  motionSafe,
  onNavigate,
}: {
  scene: SceneId;
  language: Lang;
  motionSafe: boolean;
  onNavigate?: (scene: number, beat: number) => void;
}) {
  const [revealed, setRevealed] = useState(false);

  const navigate = (target: SceneId) => onNavigate?.(target, 0);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    event.stopPropagation();
    const eventScene = Number((event.target as HTMLElement).dataset.scene);
    const focusScene = isSceneId(eventScene)
      ? eventScene
      : Number((document.activeElement as HTMLElement | null)?.dataset.scene);
    const anchor = isSceneId(focusScene) ? focusScene : scene;
    let target: SceneId | null = null;

    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      target = SCENE_IDS[Math.min(SCENE_IDS.indexOf(anchor) + 1, SCENE_IDS.length - 1)];
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      target = SCENE_IDS[Math.max(SCENE_IDS.indexOf(anchor) - 1, 0)];
    } else if (event.key === "Home") {
      target = 1;
    } else if (event.key === "End") {
      target = 5;
    }

    if (target !== null) {
      event.preventDefault();
      navigate(target);
    }
  };

  return (
    <nav
      className={styles.pollenNav}
      aria-label={language === "zh" ? "蛹中阶段导航" : "Chrysalis stage navigation"}
      data-topic-navigation="true"
      data-navigation-geometry="ambient"
      data-navigation-carrier="cocoon-pollen-marks"
      data-navigation-invocation="proximity-reveal"
      data-navigation-feedback="next-state-preview"
      data-revealed={revealed ? "true" : "false"}
      data-motion-safe={motionSafe ? "true" : "false"}
      onPointerEnter={() => setRevealed(true)}
      onPointerLeave={() => setRevealed(false)}
      onFocus={() => setRevealed(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setRevealed(false);
        }
      }}
      onKeyDown={handleKeyDown}
      onClick={(event) => event.stopPropagation()}
      onPointerDown={(event) => event.stopPropagation()}
      onWheel={(event) => event.stopPropagation()}
    >
      {SCENE_IDS.map((sceneId) => {
        const copy = SCENES[sceneId][language];
        const active = sceneId === scene;
        const next = sceneId === Math.min(scene + 1, 5);
        return (
          <button
            key={sceneId}
            type="button"
            className={styles.pollenMark}
            data-scene={sceneId}
            data-active={active ? "true" : "false"}
            data-next={next ? "true" : "false"}
            data-preview={copy.preview}
            aria-current={active ? "step" : undefined}
            aria-label={`${language === "zh" ? "打开阶段" : "Open stage"} ${sceneId}: ${copy.preview}`}
            onClick={(event) => {
              event.stopPropagation();
              navigate(sceneId);
            }}
          >
            <span aria-hidden="true" />
          </button>
        );
      })}
    </nav>
  );
}

const metadata = {
  en: buildMetadata("en"),
  zh: buildMetadata("zh"),
};

export default defineTopic({
  id: "chrysalis-rebuild",
  styleId: "soft-pastel-friendly",
  title: {
    en: "Inside a Chrysalis",
    zh: "蛹中重建",
  },
  modelId: "GPT 5.6 Sol",
  Stage: TopicStage,
  metadata,
  navigation: {
    geometry: "ambient",
    carrier: "cocoon-pollen-marks",
    invocation: "proximity-reveal",
    feedback: "next-state-preview",
  },
  transitionScore: CHRYSALIS_REBUILD_TRANSITION_SCORE,
  evidence: {
    kind: "facts",
    sources: CHRYSALIS_REBUILD_SOURCES,
  },
});

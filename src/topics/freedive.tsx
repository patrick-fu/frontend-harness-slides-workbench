import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type MouseEvent,
  type PointerEvent,
  type RefObject,
  type TouchEvent as ReactTouchEvent,
} from "react";
import type {
  TopicDefinition,
  TopicMetadata,
  TopicStageProps,
} from "../domain/topic";
import { defineTopic } from "../domain/topic";
import type { Source } from "../domain/evidence";
import SpatialSceneTrack from "../components/stage/SpatialSceneTrack";
import type { BeatLayoutMode, SceneTransitionMap } from "../components/stage/SpatialSceneTrack";
import styles from "./freedive.module.css";

type Language = TopicStageProps["language"];
type SceneId = 1 | 2 | 3 | 4 | 5;
const FREEDIVE_SOURCE_IDS = [
  "dan-dive-reflex-2018",
  "foster-sheel-2005",
  "msd-barotrauma-2025",
  "dan-hypoxia-breath-hold-2016",
] as const;
type FreediveSourceId = (typeof FREEDIVE_SOURCE_IDS)[number];

const FREEDIVE_CLAIM_IDS = [
  "oxygen-is-not-replaced-during-a-breath-hold",
  "dive-response-prioritizes-oxygen-delivery",
  "ambient-pressure-changes-gas-volume",
  "pressure-related-gas-volume-changes-can-injure",
  "low-oxygen-can-impair-consciousness",
] as const;
type FreediveClaimId = (typeof FREEDIVE_CLAIM_IDS)[number];

type ClaimScopedSource = Source & {
  id: FreediveSourceId;
  claimIds: readonly FreediveClaimId[];
};

interface FreediveClaim {
  id: FreediveClaimId;
  statement: string;
  sourceIds: readonly FreediveSourceId[];
  sceneIds: readonly SceneId[];
}

interface BeatCopy {
  action: string;
  title: string;
  body: string;
}

interface SceneCopy {
  cue: string;
  title: string;
  subtitle: string;
  sourceLine: string;
  beats: readonly BeatCopy[];
}

const SCENE_IDS: readonly SceneId[] = [1, 2, 3, 4, 5];

export const FREEDIVE_TRANSITION_SCORE = {
  "1->2": "iris-open",
  "2->3": "linear-wipe",
  "3->4": "focus-swap",
  "4->5": "dip-to-color",
} as const satisfies TopicDefinition["transitionScore"];

const TRANSITION_MAP: SceneTransitionMap = {
  ...FREEDIVE_TRANSITION_SCORE,
  "2->1": "iris-open",
  "3->2": "linear-wipe",
  "4->3": "focus-swap",
  "5->4": "dip-to-color",
};

const BEAT_LAYOUT_MODES = {
  1: "reserved",
  2: "reserved",
  3: "reserved",
  4: "reserved",
  5: "reserved",
} as const satisfies Partial<Record<SceneId, BeatLayoutMode>>;

const NAVIGATION_PROFILE = {
  geometry: "ambient",
  carrier: "footlight-notches",
  invocation: "auto-hide",
  feedback: "history-trail",
} as const satisfies TopicDefinition["navigation"];

/**
 * Claim registry for the factual boundary of this topic. Statements stay at
 * the same conservative level as the four cited sources and visible copy.
 */
export const FREEDIVE_CLAIMS = [
  {
    id: "oxygen-is-not-replaced-during-a-breath-hold",
    statement: "During a breath hold, oxygen is used without being replaced by breathing.",
    sourceIds: ["dan-dive-reflex-2018", "dan-hypoxia-breath-hold-2016"],
    sceneIds: [1],
  },
  {
    id: "dive-response-prioritizes-oxygen-delivery",
    statement: "The diving response can prioritize oxygen delivery to the brain and heart.",
    sourceIds: ["dan-dive-reflex-2018", "foster-sheel-2005"],
    sceneIds: [2, 4],
  },
  {
    id: "ambient-pressure-changes-gas-volume",
    statement: "Changes in ambient pressure change gas volume in air-containing spaces.",
    sourceIds: ["msd-barotrauma-2025"],
    sceneIds: [1, 3, 4],
  },
  {
    id: "pressure-related-gas-volume-changes-can-injure",
    statement: "Pressure-related changes in gas volume can injure tissue.",
    sourceIds: ["msd-barotrauma-2025"],
    sceneIds: [3],
  },
  {
    id: "low-oxygen-can-impair-consciousness",
    statement: "Low oxygen can impair consciousness during breath-hold diving.",
    sourceIds: ["dan-hypoxia-breath-hold-2016"],
    sceneIds: [1],
  },
] as const satisfies readonly FreediveClaim[];

export const FREEDIVE_SOURCES = [
  {
    id: "dan-dive-reflex-2018",
    authority: "Divers Alert Network (DAN)",
    title: "How the Dive Reflex Protects the Brain and Heart",
    citation:
      "Brett K. How the Dive Reflex Protects the Brain and Heart. Alert Diver / Divers Alert Network. August 1, 2018.",
    url: "https://dan.org/alert-diver/article/how-the-dive-reflex-protects-the-brain-and-heart/",
    supports:
      "During a breath hold underwater, oxygen in the blood is used without being replaced by breathing; DAN describes slower heart rate and peripheral vasoconstriction as responses that prioritize blood delivery to the brain and heart.",
    claimIds: [
      "oxygen-is-not-replaced-during-a-breath-hold",
      "dive-response-prioritizes-oxygen-delivery",
    ],
  },
  {
    id: "foster-sheel-2005",
    authority: "Scandinavian Journal of Medicine & Science in Sports / PubMed",
    title: "The human diving response, its function, and its control",
    citation:
      "Foster GE, Sheel AW. The human diving response, its function, and its control. Scand J Med Sci Sports. 2005;15(1):3-12. PMID: 15679566. doi:10.1111/j.1600-0838.2005.00440.x.",
    url: "https://pubmed.ncbi.nlm.nih.gov/15679566/",
    supports:
      "This peer-reviewed review identifies bradycardia and vasoconstriction among responses associated with apnea and the diving response, and frames its oxygen-conserving role cautiously as likely rather than guaranteed.",
    claimIds: ["dive-response-prioritizes-oxygen-delivery"],
  },
  {
    id: "msd-barotrauma-2025",
    authority: "MSD Manual Professional Edition / Duke University Medical Center / UCLA",
    title: "Overview of Barotrauma",
    citation:
      "Moon RE. Overview of Barotrauma. MSD Manual Professional Edition. Full review June 2025; peer reviewed by Birnbaumer DM, David Geffen School of Medicine at UCLA.",
    url: "https://www.msdmanuals.com/professional/injuries-poisoning/injury-during-diving-or-work-in-compressed-air/overview-of-barotrauma",
    supports:
      "The medical reference explains that higher ambient pressure during descent compresses gas in air-containing spaces, lower pressure during ascent expands it, and pressure-related gas-volume changes can injure tissue (barotrauma).",
    claimIds: [
      "ambient-pressure-changes-gas-volume",
      "pressure-related-gas-volume-changes-can-injure",
    ],
  },
  {
    id: "dan-hypoxia-breath-hold-2016",
    authority: "Divers Alert Network (DAN)",
    title: "Hypoxia in Breath-Hold Diving",
    citation:
      "McCafferty M. Hypoxia in Breath-Hold Diving. Alert Diver / Divers Alert Network. May 1, 2016.",
    url: "https://dan.org/alert-diver/article/hypoxia-in-breath-hold-diving/",
    supports:
      "DAN notes that physical activity during a breath hold increases oxygen consumption and that oxygen can fall too low to maintain consciousness, describing hypoxia as a genuine hazard rather than a performance milestone.",
    claimIds: [
      "oxygen-is-not-replaced-during-a-breath-hold",
      "low-oxygen-can-impair-consciousness",
    ],
  },
] as const satisfies readonly ClaimScopedSource[];

const COPY: Record<Language, Record<SceneId, SceneCopy>> = {
  en: {
    1: {
      cue: "BREATH-HOLD PHYSIOLOGY / 01",
      title: "One breath. Two pressures.",
      subtitle:
        "A breath-hold dive has no fresh breath below: oxygen is finite while ambient pressure changes.",
      sourceLine: "CONSTRAINT MAP · DAN / MSD MANUAL",
      beats: [
        {
          action: "Hold the opening silhouette under one spotlight",
          title: "One breath enters a changing field.",
          body: "This is a physiology map, not a performance story.",
        },
        {
          action: "Reveal the missing fresh-breath cue",
          title: "No fresh breath arrives underwater.",
          body: "While a breath is held, oxygen is used without being replaced by breathing.",
        },
        {
          action: "Light the oxygen budget cue",
          title: "The oxygen budget keeps moving.",
          body: "Activity raises oxygen use; lower oxygen can impair consciousness.",
        },
        {
          action: "Tighten the pressure halo",
          title: "Pressure is the other force.",
          body: "As ambient pressure changes, gas-filled spaces change volume.",
        },
      ],
    },
    2: {
      cue: "OXYGEN ALLOCATION / 02",
      title: "The response redistributes. It does not replenish.",
      subtitle:
        "A simplified path: lungs → blood → oxygen-sensitive organs.",
      sourceLine: "DIVE RESPONSE · DAN / FOSTER & SHEEL 2005",
      beats: [
        {
          action: "Settle the three-part oxygen path",
          title: "Conservation is not a refill.",
          body: "The diving response can slow the heart and narrow peripheral vessels, helping prioritize oxygen without removing risk.",
        },
      ],
    },
    3: {
      cue: "AMBIENT PRESSURE / 03",
      title: "Gas spaces do not ignore pressure.",
      subtitle:
        "This simplified profile shows pressure change — not how to equalize.",
      sourceLine: "PRESSURE PHYSIOLOGY · MSD MANUAL",
      beats: [
        {
          action: "Close the first pressure ring",
          title: "Descending: external pressure rises.",
          body: "Gas volumes in air-containing spaces compress as outside pressure rises.",
        },
        {
          action: "Bring the tissue-risk boundary into focus",
          title: "Changing pressure can injure tissue.",
          body: "Pressure-related changes in gas volume can cause barotrauma; real risks are not a rite of passage.",
        },
      ],
    },
    4: {
      cue: "DUAL CONSTRAINT / 04",
      title: "Two constraints share one body.",
      subtitle:
        "The illustration is not a safe-zone chart. It holds two facts together.",
      sourceLine: "OXYGEN + PRESSURE · DAN / MSD MANUAL",
      beats: [
        {
          action: "Separate oxygen allocation and ambient pressure",
          title: "Oxygen is being allocated.",
          body: "A diving response can slow the heart and narrow peripheral vessels; it is an oxygen-conserving response, not a refill.",
        },
        {
          action: "Overlap the two pools of light",
          title: "Pressure still acts on gas.",
          body: "The two constraints coexist. Neither becomes optional because the other is present.",
        },
      ],
    },
    5: {
      cue: "SURFACE / 05",
      title: "This is a map of constraints.",
      subtitle:
        "A physiology explanation is not a training plan or individualized medical advice.",
      sourceLine: "DAN · FOSTER & SHEEL · MSD MANUAL",
      beats: [
        {
          action: "Return the light to a still surface ring",
          title: "No score. No record. No technique.",
          body: "The images describe oxygen use and pressure change. This is not a training plan and does not prescribe a dive.",
        },
      ],
    },
  },
  zh: {
    1: {
      cue: "屏息生理 / 01",
      title: "一口气。两种压力。",
      subtitle: "屏息下潜时没有新的呼吸：氧气有限，环境压力同时变化。",
      sourceLine: "约束地图 · DAN / MSD 医学手册",
      beats: [
        {
          action: "让开场剪影停在一束聚光下",
          title: "一口气进入持续变化的环境。",
          body: "这是生理地图，不是表现或挑战的故事。",
        },
        {
          action: "显出没有新鲜呼吸的提示",
          title: "水下没有新的呼吸补进来。",
          body: "屏息期间，氧气会被使用，却不会通过呼吸补回。",
        },
        {
          action: "点亮氧气预算提示",
          title: "氧气预算仍在变化。",
          body: "活动会增加氧气消耗；氧气降低会影响意识。",
        },
        {
          action: "收紧压力光环",
          title: "压力是另一股力量。",
          body: "环境压力变化时，含气空间的体积也会变化。",
        },
      ],
    },
    2: {
      cue: "氧气分配 / 02",
      title: "它会重新分配，不会重新补充。",
      subtitle: "一条简化路径：肺部 → 血液 → 对氧气敏感的器官。",
      sourceLine: "潜水反应 · DAN / FOSTER & SHEEL 2005",
      beats: [
        {
          action: "定格三段氧气路径",
          title: "节约不是补充。",
          body: "潜水反应可能减慢心率、收缩外周血管，帮助优先分配氧气，但不会消除风险。",
        },
      ],
    },
    3: {
      cue: "环境压力 / 03",
      title: "含气空间不会忽略压力。",
      subtitle: "这张简化剖面说明压力变化，不说明如何平压。",
      sourceLine: "压力生理 · MSD 医学手册",
      beats: [
        {
          action: "闭合第一道压力环",
          title: "下潜时：外界压力上升。",
          body: "外界压力上升时，含气空间中的气体体积会被压缩。",
        },
        {
          action: "聚焦组织损伤的边界",
          title: "压力变化可能伤及组织。",
          body: "气体体积的压力相关变化可能造成气压伤；真实风险不是必须跨越的仪式。",
        },
      ],
    },
    4: {
      cue: "双重约束 / 04",
      title: "两种约束共存于同一身体。",
      subtitle: "这不是安全区图表，只是把两件事实放在一起。",
      sourceLine: "氧气 + 压力 · DAN / MSD 医学手册",
      beats: [
        {
          action: "分开氧气分配与环境压力",
          title: "氧气正在被分配。",
          body: "潜水反应可能减慢心率、收缩外周血管；它有助于节约氧气，但不是重新补充。",
        },
        {
          action: "让两束灯短暂交叠",
          title: "压力仍会作用于气体。",
          body: "两种约束同时存在；任何一方都不会因为另一方出现而变得可有可无。",
        },
      ],
    },
    5: {
      cue: "水面 / 05",
      title: "这是一张约束地图。",
      subtitle: "生理解释不等于训练计划，也不等于个体化医疗建议。",
      sourceLine: "DAN · FOSTER & SHEEL · MSD 医学手册",
      beats: [
        {
          action: "让光回到静止的水面光环",
          title: "没有成绩。没有纪录。没有技巧。",
          body: "这些图像说明氧气消耗和压力变化，并不规定如何下潜，也不能替代训练计划。",
        },
      ],
    },
  },
};

const NAV_LABELS: Record<SceneId, Record<Language, string>> = {
  1: { en: "one breath", zh: "一口气" },
  2: { en: "oxygen", zh: "氧气" },
  3: { en: "pressure", zh: "压力" },
  4: { en: "two constraints", zh: "双重约束" },
  5: { en: "surface", zh: "水面" },
};

const SCENE_BEAT_CLAIM_IDS = {
  1: [
    [
      "oxygen-is-not-replaced-during-a-breath-hold",
      "ambient-pressure-changes-gas-volume",
    ],
    [
      "oxygen-is-not-replaced-during-a-breath-hold",
      "ambient-pressure-changes-gas-volume",
    ],
    [
      "oxygen-is-not-replaced-during-a-breath-hold",
      "ambient-pressure-changes-gas-volume",
      "low-oxygen-can-impair-consciousness",
    ],
    [
      "oxygen-is-not-replaced-during-a-breath-hold",
      "ambient-pressure-changes-gas-volume",
    ],
  ],
  2: [["dive-response-prioritizes-oxygen-delivery"]],
  3: [
    ["ambient-pressure-changes-gas-volume"],
    [
      "ambient-pressure-changes-gas-volume",
      "pressure-related-gas-volume-changes-can-injure",
    ],
  ],
  4: [
    ["dive-response-prioritizes-oxygen-delivery"],
    [
      "dive-response-prioritizes-oxygen-delivery",
      "ambient-pressure-changes-gas-volume",
    ],
  ],
  5: [[]],
} as const satisfies Record<SceneId, readonly (readonly FreediveClaimId[])[]>;

const FREEDIVE_CLAIMS_BY_ID = new Map<FreediveClaimId, FreediveClaim>(
  FREEDIVE_CLAIMS.map((claim) => [claim.id, claim] as const),
);

function claimDataAttributes(claimIds: readonly FreediveClaimId[]) {
  if (claimIds.length === 0) return {};

  const sourceIds = new Set<FreediveSourceId>();
  for (const claimId of claimIds) {
    for (const sourceId of FREEDIVE_CLAIMS_BY_ID.get(claimId)?.sourceIds ?? []) {
      sourceIds.add(sourceId);
    }
  }

  return {
    "data-claim-id": claimIds.join(" "),
    "data-source-ref": [...sourceIds].sort().join(" "),
  };
}

function toSceneId(scene: number): SceneId {
  return SCENE_IDS.includes(scene as SceneId) ? (scene as SceneId) : 1;
}

function clampBeat(scene: SceneId, beat: number): number {
  const maxBeat = COPY.en[scene].beats.length - 1;
  return Math.max(0, Math.min(maxBeat, Number.isFinite(beat) ? beat : 0));
}

function sceneComposition(scene: SceneId): string {
  return {
    1: "breath-hero",
    2: "oxygen-path",
    3: "pressure-depth",
    4: "dual-constraint",
    5: "surface-return",
  }[scene];
}

function BreathHero({ beat, language }: { beat: number; language: Language }) {
  const labels =
    language === "zh"
      ? {
          noFreshAir: "没有新的呼吸",
          oxygen: "氧气 / 有限",
          pressure: "压力 / 变化",
        }
      : {
          noFreshAir: "no new breath",
          oxygen: "O₂ / finite",
          pressure: "pressure / changes",
        };

  return (
    <div className={styles.breathHero} data-scene-composition="breath-hero">
      <div className={styles.lightCone} aria-hidden="true" />
      <div className={styles.breathOrb} aria-hidden="true" />
      <div className={styles.diverSilhouette} aria-hidden="true">
        <span className={styles.silhouetteHead} />
        <span className={styles.silhouetteBody} />
        <span className={styles.silhouetteArm} />
        <span className={styles.silhouetteLeg} />
      </div>
      <span
        className={styles.noFreshAir}
        data-no-fresh-air={beat >= 1 ? "visible" : "muted"}
        {...claimDataAttributes(["oxygen-is-not-replaced-during-a-breath-hold"])}
      >
        {labels.noFreshAir}
      </span>
      <span
        className={styles.oxygenCue}
        data-oxygen-cue={beat >= 2 ? "visible" : "muted"}
        {...claimDataAttributes(["oxygen-is-not-replaced-during-a-breath-hold"])}
      >
        {labels.oxygen}
      </span>
      <span
        className={styles.pressureCue}
        data-pressure-cue={beat >= 3 ? "visible" : "muted"}
        {...claimDataAttributes(["ambient-pressure-changes-gas-volume"])}
      >
        {labels.pressure}
      </span>
    </div>
  );
}

function OxygenPath({ language }: { language: Language }) {
  const labels =
    language === "zh"
      ? ["肺部", "血液", "脑与心脏"]
      : ["lungs", "blood", "brain + heart"];

  return (
    <div className={styles.oxygenPath} data-scene-composition="oxygen-path">
      <div className={styles.oxygenLine} aria-hidden="true" />
      {labels.map((label, index) => (
        <div
          className={styles.oxygenNode}
          data-oxygen-node="true"
          data-oxygen-step={index + 1}
          key={label}
        >
          <span aria-hidden="true">{index + 1}</span>
          <strong>{label}</strong>
        </div>
      ))}
      <p className={styles.oxygenCaption}>
        {language === "zh"
          ? "示意路径，不是个体化的生理读数。"
          : "A conceptual path, not an individual physiological reading."}
      </p>
    </div>
  );
}

function PressureDepth({ beat, language }: { beat: number; language: Language }) {
  return (
    <div className={styles.pressureDepth} data-scene-composition="pressure-depth">
      <div className={styles.depthAxis} aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <div className={styles.pressureBody} aria-hidden="true">
        <span className={styles.pressureHead} />
        <span className={styles.pressureTorso} />
        <span className={styles.pressureChest} />
      </div>
      <div className={styles.pressureRings} aria-hidden="true">
        {Array.from({ length: 5 }, (_, index) => (
          <span
            className={styles.pressureRing}
            data-pressure-ring="true"
            data-pressure-state={index < 2 || beat >= 1 ? "visible" : "muted"}
            key={index}
          />
        ))}
      </div>
      <p className={styles.pressureCaption}>
        {language === "zh"
          ? beat >= 1
            ? "压力相关损伤是临床风险，不是技术提示。"
            : "压力变化作用于含气空间。"
          : beat >= 1
            ? "Pressure-related injury is a clinical risk, not a technique cue."
            : "Pressure change acts on air-containing spaces."}
      </p>
    </div>
  );
}

function DualConstraint({ beat, language }: { beat: number; language: Language }) {
  return (
    <div className={styles.dualConstraint} data-scene-composition="dual-constraint">
      <div className={styles.constraintLight} data-constraint="oxygen">
        <span className={styles.constraintMark}>O₂</span>
        <strong>{language === "zh" ? "氧气预算" : "oxygen budget"}</strong>
        <p>{language === "zh" ? "使用与分配" : "use + allocation"}</p>
      </div>
      <div
        className={styles.constraintOverlap}
        data-overlap={beat >= 1 ? "visible" : "muted"}
        aria-hidden="true"
      />
      <div className={styles.constraintLight} data-constraint="pressure">
        <span className={styles.constraintMark}>P</span>
        <strong>{language === "zh" ? "环境压力" : "ambient pressure"}</strong>
        <p>{language === "zh" ? "压缩与变化" : "compression + change"}</p>
      </div>
      <p className={styles.dualCaption}>
        {language === "zh"
          ? "两种约束相遇，不生成安全区。"
          : "Their overlap does not create a safe zone."}
      </p>
    </div>
  );
}

function SurfaceReturn({ language }: { language: Language }) {
  return (
    <div className={styles.surfaceReturn} data-scene-composition="surface-return">
      <div className={styles.surfaceLine} aria-hidden="true" />
      <div className={styles.surfaceRing} aria-hidden="true" />
      <div className={styles.boundaryMark} data-boundary="physiology-not-advice">
        <span>{language === "zh" ? "说明" : "explain"}</span>
        <i aria-hidden="true" />
        <strong>{language === "zh" ? "不指导" : "not prescribe"}</strong>
      </div>
    </div>
  );
}

function SceneVisual({
  scene,
  beat,
  language,
}: {
  scene: SceneId;
  beat: number;
  language: Language;
}) {
  if (scene === 1) return <BreathHero beat={beat} language={language} />;
  if (scene === 2) return <OxygenPath language={language} />;
  if (scene === 3) return <PressureDepth beat={beat} language={language} />;
  if (scene === 4) return <DualConstraint beat={beat} language={language} />;
  return <SurfaceReturn language={language} />;
}

function ScenePanel({
  scene,
  beat,
  language,
}: {
  scene: SceneId;
  beat: number;
  language: Language;
}) {
  const copy = COPY[language][scene];
  const safeBeat = clampBeat(scene, beat);
  const beatCopy = copy.beats[safeBeat];
  const claimIds = SCENE_BEAT_CLAIM_IDS[scene][safeBeat] ?? [];
  const factAttributes = claimDataAttributes(claimIds);

  return (
    <article
      className={styles.scene}
      data-scene-content={scene}
      data-scene-composition={sceneComposition(scene)}
      data-beat={safeBeat}
      {...factAttributes}
    >
      <header className={styles.sceneHeader} data-beat-layout-item="true">
        <p className={styles.cue}>{copy.cue}</p>
        <h1 {...factAttributes}>{copy.title}</h1>
        <p className={styles.subtitle} {...factAttributes}>
          {copy.subtitle}
        </p>
      </header>

      <section className={styles.canvas} data-beat-layout-item="true">
        <SceneVisual scene={scene} beat={safeBeat} language={language} />
      </section>

      <section
        className={styles.beatCopy}
        data-beat-layout-item="true"
        {...factAttributes}
      >
        <p className={styles.beatAction}>{beatCopy.action}</p>
        <h2>{beatCopy.title}</h2>
        <p>{beatCopy.body}</p>
      </section>

      <footer className={styles.sceneFooter} data-beat-layout-item="true">
        <span {...factAttributes}>{copy.sourceLine}</span>
        <strong>{String(scene).padStart(2, "0")}</strong>
      </footer>
    </article>
  );
}

function useNavigationIdle(motionOff: boolean, scene: SceneId, beat: number) {
  const timeoutRef = useRef<number | null>(null);
  const [idle, setIdle] = useState(motionOff);

  const clearIdleTimer = useCallback(() => {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const wake = useCallback(() => {
    clearIdleTimer();
    if (motionOff) {
      setIdle(true);
      return;
    }
    setIdle(false);
    timeoutRef.current = window.setTimeout(() => {
      setIdle(true);
      timeoutRef.current = null;
    }, 2400);
  }, [clearIdleTimer, motionOff]);

  useEffect(() => {
    wake();
    return clearIdleTimer;
  }, [beat, clearIdleTimer, scene, wake]);

  return { idle, wake };
}

function useFootlightTouchShield(
  navigationRef: RefObject<HTMLElement | null>,
  onWake: () => void,
) {
  useEffect(() => {
    const navigation = navigationRef.current;
    if (!navigation) return;

    // Player Runtime listens natively on the stage, before React's delegated
    // touch handlers run. Capture every phase on the carrier itself so a
    // touch on its blank area, line, or buttons never becomes stage navigation.
    const stopNativeTouch = (event: Event) => {
      event.stopPropagation();
      onWake();
    };
    const touchPhases = [
      "touchstart",
      "touchmove",
      "touchend",
      "touchcancel",
    ] as const;

    for (const phase of touchPhases) {
      navigation.addEventListener(phase, stopNativeTouch, {
        capture: true,
        passive: true,
      });
    }

    return () => {
      for (const phase of touchPhases) {
        navigation.removeEventListener(phase, stopNativeTouch, true);
      }
    };
  }, [navigationRef, onWake]);
}

function FootlightNavigation({
  scene,
  language,
  idle,
  onWake,
  onNavigate,
}: {
  scene: SceneId;
  language: Language;
  idle: boolean;
  onWake: () => void;
  onNavigate?: TopicStageProps["onNavigate"];
}) {
  const navigationRef = useRef<HTMLElement | null>(null);
  useFootlightTouchShield(navigationRef, onWake);

  const stopPointer = (event: PointerEvent<HTMLElement>) => {
    event.stopPropagation();
    onWake();
  };
  const stopTouch = (event: ReactTouchEvent<HTMLElement>) => {
    event.stopPropagation();
    onWake();
  };
  const navigateFromClick = (
    event: MouseEvent<HTMLButtonElement>,
    target: SceneId,
  ) => {
    event.preventDefault();
    event.stopPropagation();
    onWake();
    onNavigate?.(target, 0);
  };
  const navigateFromKey = (
    event: KeyboardEvent<HTMLButtonElement>,
    target: SceneId,
  ) => {
    if (event.repeat) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    let next: SceneId | null = null;
    if (event.key === "Enter" || event.key === " " || event.key === "Spacebar") {
      next = target;
    } else if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      next = Math.min(5, target + 1) as SceneId;
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      next = Math.max(1, target - 1) as SceneId;
    } else if (event.key === "Home") {
      next = 1;
    } else if (event.key === "End") {
      next = 5;
    }

    if (next === null) return;
    event.preventDefault();
    event.stopPropagation();
    onWake();
    onNavigate?.(next, 0);
  };

  return (
    <nav
      ref={navigationRef}
      className={styles.footlightNavigation}
      aria-label={language === "zh" ? "自由潜水场景脚灯导航" : "Freedive footlight scene navigation"}
      data-topic-navigation="true"
      data-navigation-geometry={NAVIGATION_PROFILE.geometry}
      data-navigation-carrier={NAVIGATION_PROFILE.carrier}
      data-navigation-invocation={NAVIGATION_PROFILE.invocation}
      data-navigation-feedback={NAVIGATION_PROFILE.feedback}
      data-navigation-state={idle ? "idle" : "awake"}
      onPointerDown={stopPointer}
      onPointerMove={onWake}
      onTouchStart={stopTouch}
      onClick={(event) => event.stopPropagation()}
    >
      <span
        className={styles.footlightLine}
        data-footlight-line="true"
        aria-hidden="true"
      />
      {SCENE_IDS.map((target) => {
        const history =
          target < scene ? "visited" : target === scene ? "active" : "pending";
        const label = NAV_LABELS[target][language];
        return (
          <button
            className={styles.footlightNotch}
            data-history={history}
            data-active={target === scene ? "true" : "false"}
            key={target}
            type="button"
            aria-current={target === scene ? "step" : undefined}
            aria-label={
              language === "zh"
                ? `跳到场景 ${target}：${label}`
                : `Jump to scene ${target}: ${label}`
            }
            onPointerDown={stopPointer}
            onTouchStart={stopTouch}
            onClick={(event) => navigateFromClick(event, target)}
            onKeyDown={(event) => navigateFromKey(event, target)}
          >
            <span className={styles.notchGlow} aria-hidden="true" />
            <span className={styles.notchLabel}>{label}</span>
          </button>
        );
      })}
    </nav>
  );
}

function buildMetadata(language: Language): TopicMetadata {
  return {
    theme: language === "zh" ? "自由潜水：一口气，两种压力" : "Freedive: One Breath, Two Pressures",
    densityLabel: language === "zh" ? "稀疏聚焦" : "Sparse Focus",
    heroScene: 3,
    colors: {
      bg: "#02070d",
      ink: "#edf3f5",
      panel: "#07141f",
    },
    typography: {
      header: "ui-serif 600",
      body: "ui-sans-serif 400",
    },
    tags: [
      "dark-stage",
      "spotlight",
      "freedive-physiology",
      "pressure",
      "oxygen",
      "original-dom-svg",
      "bilingual",
      "no-training-advice",
    ],
    // System stacks are intentional: this topic must not create a remote font dependency.
    fonts: [],
    scenes: SCENE_IDS.map((scene) => {
      const copy = COPY[language][scene];
      return {
        id: scene,
        title: copy.title,
        beats: copy.beats.map((beat, index) => ({
          id: index,
          action: beat.action,
          title: beat.title,
          body: beat.body,
        })),
      };
    }),
  };
}

const METADATA = {
  en: buildMetadata("en"),
  zh: buildMetadata("zh"),
} satisfies TopicDefinition["metadata"];

const EVIDENCE = {
  kind: "mixed",
  sources: FREEDIVE_SOURCES,
  boundary: {
    en: "Physiology explainer only: this Topic is not training, medical, equalization, or safe-zone advice.",
    zh: "仅作生理机制说明：本 Topic 不构成训练、医疗、平压或安全区域建议。",
  },
  display: "envelope",
} as const satisfies TopicDefinition["evidence"];

function TopicStage({
  scene,
  beat,
  language,
  isThumbnail,
  reducedMotion,
  onNavigate,
}: TopicStageProps) {
  const activeScene = toSceneId(scene);
  const renderedBeat = isThumbnail
    ? COPY.en[activeScene].beats.length - 1
    : clampBeat(activeScene, beat);
  const motionOff = reducedMotion || isThumbnail;
  const { idle, wake } = useNavigationIdle(motionOff, activeScene, renderedBeat);

  return (
    <section
      className={styles.root}
      lang={language}
      data-topic-id="freedive"
      data-motion={motionOff ? "off" : "on"}
      data-thumbnail={isThumbnail ? "true" : "false"}
      data-rendered-beat={renderedBeat}
      onPointerMove={motionOff ? undefined : wake}
    >
      <div className={styles.stageDarkness} aria-hidden="true" />
      <div className={styles.stageLight} aria-hidden="true" />
      <SpatialSceneTrack
        scene={activeScene}
        beat={renderedBeat}
        transitionKind="iris-open"
        transitionMap={TRANSITION_MAP}
        transitionDurationMs={980}
        reducedMotion={motionOff}
        beatLayoutModes={BEAT_LAYOUT_MODES}
        className={styles.track}
        renderScene={(sceneId, sceneBeat) => (
          <ScenePanel
            scene={toSceneId(sceneId)}
            beat={sceneBeat}
            language={language}
          />
        )}
      />
      {isThumbnail ? null : (
        <FootlightNavigation
          scene={activeScene}
          language={language}
          idle={idle}
          onWake={wake}
          onNavigate={onNavigate}
        />
      )}
    </section>
  );
}

export default defineTopic({
  id: "freedive",
  styleId: "spotlight-quote-poster",
  title: {
    en: "Freedive",
    zh: "自由潜水",
  },
  modelId: "GPT 5.6 Sol",
  Stage: TopicStage,
  metadata: METADATA,
  navigation: NAVIGATION_PROFILE,
  transitionScore: FREEDIVE_TRANSITION_SCORE,
  evidence: EVIDENCE,
});

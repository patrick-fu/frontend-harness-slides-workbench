import { useEffect, type CSSProperties, type KeyboardEvent } from "react";
import type { Source } from "../domain/evidence";
import {
  defineTopic,
  type TopicMetadata,
  type TopicNavigation,
  type TopicStageProps,
  type TopicTransitionScore,
} from "../domain/topic";
import SpatialSceneTrack from "../styles/SpatialSceneTrack";
import type {
  BeatLayoutMode,
  SceneTransitionMap,
} from "../styles/SpatialSceneTrack";
import styles from "./vocal-folds.module.css";

type Language = TopicStageProps["language"];
type SceneId = 1 | 2 | 3 | 4 | 5;
type PhonationStep = "pressure" | "opening" | "recoil" | "pulse";

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
  beats: BeatCopy[];
}

type StageVariables = CSSProperties & {
  "--node-x"?: string;
  "--node-y"?: string;
  "--particle-index"?: string;
};

const SCENE_IDS: SceneId[] = [1, 2, 3, 4, 5];
const PHONATION_STEPS: PhonationStep[] = [
  "pressure",
  "opening",
  "recoil",
  "pulse",
];

const TRANSITION_SCORE = {
  "1->2": "split-merge",
  "2->3": "focus-swap",
  "3->4": "grid-reveal",
  "4->5": "split-merge",
} as const satisfies TopicTransitionScore;

const TRANSITION_MAP: SceneTransitionMap = {
  ...TRANSITION_SCORE,
  "2->1": "split-merge",
  "3->2": "focus-swap",
  "4->3": "grid-reveal",
  "5->4": "split-merge",
};

const BEAT_LAYOUT_MODES = {
  2: "reserved",
  3: "reserved",
  4: "reserved",
} satisfies Partial<Record<SceneId, BeatLayoutMode>>;

const NAVIGATION = {
  geometry: "spatial-node",
  carrier: "vocal-fold-stage-plan",
  invocation: "persistent",
  feedback: "typographic-emphasis",
} as const satisfies TopicNavigation;

const VOCAL_FOLDS_SOURCES = [
  {
    authority:
      "NIH / National Institute on Deafness and Other Communication Disorders",
    title: "Taking Care of Your Voice",
    citation:
      "NIDCD. Taking Care of Your Voice. NIH Publication No. 14-5160; page updated June 11, 2025.",
    url: "https://www.nidcd.nih.gov/health/taking-care-your-voice",
    supports:
      "Vocal folds are paired tissue in the larynx; lung airflow drives vibration, and the throat, nose, and mouth act as resonating cavities that modulate the resulting sound.",
  },
  {
    authority: "The Voice Foundation",
    title: "Understanding Voice Production",
    citation:
      "The Voice Foundation. Anatomy and Physiology of Voice Production: Understanding Voice Production. Accessed July 10, 2026.",
    url: "https://voicefoundation.org/health-science/voice-disorders/anatomy-physiology-of-voice-production/understanding-voice-production/",
    supports:
      "The vocal folds are layered, pliable structures rather than plucked strings; aerodynamic excitation, ordered opening and closing, resonance, and articulation have distinct roles.",
  },
  {
    authority: "National Center for Voice and Speech",
    title: "Myoelastic Aerodynamic Theory of Phonation",
    citation:
      "National Center for Voice and Speech. Voice Production Tutorial: Myoelastic Aerodynamic Theory of Phonation.",
    url: "https://ncvs.org/archive/ncvs/tutorials/voiceprod/tutorial/model.html",
    supports:
      "Air pressure, tissue elasticity, damping, and flow interact to sustain vocal-fold oscillation; repeated airflow pulses form a source that is subsequently filtered by the vocal tract.",
  },
  {
    authority: "Journal of the Acoustical Society of America / PubMed Central",
    title: "Mechanics of human voice production and control",
    citation:
      "Zhang Z. J Acoust Soc Am. 2016;140(4):2614. doi:10.1121/1.4964509. PMCID: PMC5412481.",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC5412481/",
    supports:
      "Self-sustained vibration results from airflow–tissue interaction; fold vibration modulates steady airflow into a pulsating glottal source, while vocal-tract resonances filter its spectrum.",
  },
] as const satisfies readonly Source[];

const COPY: Record<SceneId, Record<Language, SceneCopy>> = {
  1: {
    en: {
      cue: "ACT I / BEFORE PHONATION",
      title: "Two roles. No voice yet.",
      subtitle:
        "AIR waits below. FOLD is paired tissue at the midline. Neither makes a voice alone.",
      sourceLine: "MECHANISM MAP · NIDCD / THE VOICE FOUNDATION",
      beats: [
        {
          action: "Hold airflow below the closed glottis",
          title: "AIR meets paired FOLD",
          body: "Air can supply energy; pliable tissue can become the oscillator. The cycle has not started yet.",
        },
      ],
    },
    zh: {
      cue: "第一幕 / 发声之前",
      title: "两个角色。声音还没出现。",
      subtitle: "AIR 停在下方；FOLD 是中线处成对的组织。任何一方都不能单独生成嗓音。",
      sourceLine: "机制图 · NIDCD / THE VOICE FOUNDATION",
      beats: [
        {
          action: "让气流停在闭合声门下方",
          title: "AIR 遇见成对的 FOLD",
          body: "空气可以提供能量，柔软组织可以成为振荡器；此刻循环尚未开始。",
        },
      ],
    },
  },
  2: {
    en: {
      cue: "ACT II / PAIR THE CURTAINS",
      title: "A paired valve, not one string",
      subtitle:
        "The same two folds look different from above and in section. Both views are simplified and not to scale.",
      sourceLine: "ANATOMY · NIDCD / THE VOICE FOUNDATION",
      beats: [
        {
          action: "Align the superior view",
          title: "From above: two folds frame one glottis",
          body: "The opening between the folds changes as the paired tissue approaches and separates.",
        },
        {
          action: "Bring the coronal cutaway into focus",
          title: "In section: pliable layers meet moving air",
          body: "The edge and cover can deform in an ordered wave; this is not a plucked-string model.",
        },
      ],
    },
    zh: {
      cue: "第二幕 / 对齐双幕",
      title: "这是成对的阀，不是一根弦",
      subtitle: "从上方与剖面看，同一对声带呈现不同形态；两幅图都是简化示意，且不按比例。",
      sourceLine: "解剖依据 · NIDCD / THE VOICE FOUNDATION",
      beats: [
        {
          action: "对齐俯视图",
          title: "从上方看：两片声带围出一个声门",
          body: "成对组织靠近或分开时，中间开口随之改变。",
        },
        {
          action: "点亮冠状剖面",
          title: "从剖面看：柔软层次与流动空气相遇",
          body: "边缘与表层可以形成有序形变；这不是拨动琴弦的模型。",
        },
      ],
    },
  },
  3: {
    en: {
      cue: "ACT III / THE CYCLE",
      title: "Airflow and tissue trade energy",
      subtitle:
        "The folds do not receive one nerve command per cycle. Flow–tissue interaction can sustain the oscillation.",
      sourceLine: "PHONATION · NCVS / ZHANG 2016",
      beats: [
        {
          action: "Build subglottal pressure",
          title: "01 · Pressure builds below",
          body: "With the folds brought near midline, pressure rises beneath the glottis.",
        },
        {
          action: "Open the pliable lower edges",
          title: "02 · Pressure pushes the folds apart",
          body: "Air begins to pass through the narrowing; the paired tissue deforms rather than swinging as rigid doors.",
        },
        {
          action: "Let tissue and flow restore closure",
          title: "03 · Elastic return closes the gap",
          body: "Elastic restoring forces and the changing aerodynamic field bring the tissue back toward midline.",
        },
        {
          action: "Release one airflow pulse and repeat",
          title: "04 · The cycle makes a glottal source",
          body: "Repeated opening and closing modulates a steady lung stream into pulsating airflow—the raw voice source.",
        },
      ],
    },
    zh: {
      cue: "第三幕 / 振动循环",
      title: "空气与组织交换能量",
      subtitle: "声带并不是每振动一次就接收一次神经指令；气流与组织的相互作用可以维持自振。",
      sourceLine: "发声机制 · NCVS / ZHANG 2016",
      beats: [
        {
          action: "建立声门下压力",
          title: "01 · 压力在下方积累",
          body: "声带被带到中线附近后，声门下方压力上升。",
        },
        {
          action: "推开柔软的下缘",
          title: "02 · 压力把声带推开",
          body: "空气开始穿过狭窄开口；成对组织发生形变，而不是像硬门一样摆动。",
        },
        {
          action: "让组织与气流恢复闭合",
          title: "03 · 弹性回位让间隙合拢",
          body: "组织弹性与不断变化的空气动力场，共同把组织带回中线附近。",
        },
        {
          action: "释放一次气流脉冲并重复",
          title: "04 · 循环形成声门声源",
          body: "反复开合把稳定肺气流调制成脉动气流——这才是原始嗓音声源。",
        },
      ],
    },
  },
  4: {
    en: {
      cue: "ACT IV / RESONANCE SPACE",
      title: "The source leaves the larynx unfinished",
      subtitle:
        "The glottal cycle supplies a harmonic-rich source. The vocal tract emphasizes some frequencies and attenuates others.",
      sourceLine: "SOURCE–FILTER · NIDCD / ZHANG 2016",
      beats: [
        {
          action: "Hand off the glottal pulse train",
          title: "SOURCE · Glottal pulses set the periodic input",
          body: "Fundamental frequency mainly follows the vocal-fold vibration rate; the source is still a buzzy input, not a finished vowel.",
        },
        {
          action: "Light the vocal-tract resonances",
          title: "FILTER · Vocal tract resonances shape the spectrum",
          body: "Changing the throat and mouth changes which harmonics are emphasized. Resonance shapes timbre and speech sounds; it does not pluck the folds.",
        },
      ],
    },
    zh: {
      cue: "第四幕 / 共鸣空间",
      title: "声源离开喉部时还不是完整嗓音",
      subtitle: "声门循环提供富含谐波的声源；声道会增强一些频率，同时削弱另一些频率。",
      sourceLine: "声源—滤波 · NIDCD / ZHANG 2016",
      beats: [
        {
          action: "交出声门脉冲序列",
          title: "声源 · 声门脉冲给出周期性输入",
          body: "基频主要跟随声带振动速率；此时仍是带嗡鸣感的原始输入，还不是完整元音。",
        },
        {
          action: "点亮声道共振",
          title: "滤波 · 声道共振塑造频谱",
          body: "咽腔与口腔形状会改变哪些谐波被强调；共鸣塑造音色与语音，而不会像拨弦一样驱动声带。",
        },
      ],
    },
  },
  5: {
    en: {
      cue: "ACT V / VOICE LINE",
      title: "Air drives. Tissue oscillates. Space shapes.",
      subtitle:
        "One perceived voice emerges from three distinct jobs—not from a lone vibrating string.",
      sourceLine: "SIMPLIFIED EXPLANATORY DIAGRAM · NOT A DIAGNOSTIC IMAGE",
      beats: [
        {
          action: "Collapse the stage into one voice line",
          title: "One voice, three jobs",
          body: "Airflow supplies energy, paired tissue creates a periodic source, and the vocal tract shapes its spectrum.",
        },
      ],
    },
    zh: {
      cue: "第五幕 / 嗓音线",
      title: "空气驱动。组织自振。空间塑形。",
      subtitle: "一个可感知的嗓音来自三种不同分工，而不是一根独自振动的弦。",
      sourceLine: "简化解释图 · 不是医学诊断影像",
      beats: [
        {
          action: "让舞台收束为一条嗓音线",
          title: "一个嗓音，三种分工",
          body: "气流提供能量，成对组织建立周期性声源，声道再塑造它的频谱。",
        },
      ],
    },
  },
};

const NAV_LABELS: Record<SceneId, Record<Language, string>> = {
  1: { en: "AIR", zh: "气流" },
  2: { en: "PAIR", zh: "成对" },
  3: { en: "CYCLE", zh: "循环" },
  4: { en: "SPACE", zh: "空间" },
  5: { en: "VOICE", zh: "嗓音" },
};

const NODE_POSITIONS: Record<SceneId, { x: string; y: string }> = {
  1: { x: "5cqw", y: "4.4cqh" },
  2: { x: "25cqw", y: "1.2cqh" },
  3: { x: "47cqw", y: "4.8cqh" },
  4: { x: "70cqw", y: "1.5cqh" },
  5: { x: "89cqw", y: "4.2cqh" },
};

function clampScene(scene: number): SceneId {
  return SCENE_IDS.includes(scene as SceneId) ? (scene as SceneId) : 1;
}

function clampBeat(scene: SceneId, beat: number): number {
  return Math.max(0, Math.min(beat, COPY[scene].en.beats.length - 1));
}

function useFonts(): void {
  useEffect(() => {
    const id = "vocal-folds-fonts";
    if (document.getElementById(id)) return;

    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;700;900&family=Space+Grotesk:wght@400;500;600;700&display=swap";
    document.head.appendChild(link);
  }, []);
}

function AirParticles({ count }: { count: number }) {
  return (
    <div className={styles.airParticles} aria-hidden="true">
      {Array.from({ length: count }, (_, index) => (
        <span
          key={index}
          style={{ "--particle-index": String(index) } as StageVariables}
        />
      ))}
    </div>
  );
}

function DarkStage({ language }: { language: Language }) {
  return (
    <div
      className={styles.darkStage}
      data-role-stage="air-fold"
      data-air-stopped="true"
      data-beat-layout-item="true"
    >
      <div className={styles.airRole}>
        <span className={styles.roleCode}>AIR</span>
        <span className={styles.roleNote}>
          {language === "zh" ? "能量 / 压力" : "ENERGY / PRESSURE"}
        </span>
      </div>
      <div className={styles.airColumn} aria-hidden="true">
        <AirParticles count={13} />
      </div>
      <div className={styles.closedPair} aria-label="Paired vocal folds">
        <span className={styles.foldLeft} data-vocal-fold="true" />
        <span className={styles.glottalSeam} />
        <span className={styles.foldRight} data-vocal-fold="true" />
      </div>
      <div className={styles.foldRole}>
        <span className={styles.roleCode}>FOLD</span>
        <span className={styles.roleNote}>
          {language === "zh" ? "成对 / 柔软" : "PAIRED / PLIABLE"}
        </span>
      </div>
      <p className={styles.holdCue}>
        {language === "zh" ? "等待声门循环" : "WAITING FOR THE GLOTTAL CYCLE"}
      </p>
    </div>
  );
}

function AnatomyViews({ beat, language }: { beat: number; language: Language }) {
  return (
    <div
      className={styles.anatomyViews}
      data-anatomy-view="paired"
      data-beat-layout-item="true"
    >
      <figure
        className={styles.superiorView}
        data-view="superior"
        data-active={beat === 0 ? "true" : "false"}
      >
        <figcaption>
          <strong>{language === "zh" ? "上方视角" : "SUPERIOR VIEW"}</strong>
          <span>{language === "zh" ? "声门位于中央" : "GLOTTIS AT CENTER"}</span>
        </figcaption>
        <div className={styles.topPair} aria-label="Superior fold pair">
          <span className={styles.topFoldLeft} data-vocal-fold="true" />
          <span className={styles.topGlottis} />
          <span className={styles.topFoldRight} data-vocal-fold="true" />
        </div>
      </figure>

      <div className={styles.viewConnector} aria-hidden="true">
        <span />
        <span />
        <span />
      </div>

      <figure
        className={styles.coronalView}
        data-view="coronal"
        data-active={beat >= 1 ? "true" : "false"}
      >
        <figcaption>
          <strong>{language === "zh" ? "冠状剖面" : "CORONAL CUTAWAY"}</strong>
          <span>{language === "zh" ? "层次简化示意" : "LAYERS SIMPLIFIED"}</span>
        </figcaption>
        <div className={styles.sectionPair} aria-label="Coronal fold pair">
          <span className={styles.sectionFoldLeft} data-vocal-fold="true">
            <i />
          </span>
          <span className={styles.sectionAirway} />
          <span className={styles.sectionFoldRight} data-vocal-fold="true">
            <i />
          </span>
        </div>
      </figure>

      <p className={styles.anatomyBoundary}>
        {language === "zh"
          ? "两片柔软组织，不是一根弦 · 简化示意 / 不按比例"
          : "Two soft-tissue folds, not one string · simplified / not to scale"}
      </p>
    </div>
  );
}

function PhonationCycle({
  beat,
  language,
  motionOff,
}: {
  beat: number;
  language: Language;
  motionOff: boolean;
}) {
  const step = PHONATION_STEPS[beat] ?? PHONATION_STEPS[0];
  const beatCopy = COPY[3][language].beats[beat];

  return (
    <div
      className={styles.phonationCycle}
      data-phonation-cycle="true"
      data-phonation-step={step}
      data-spring="controlled"
      data-motion={motionOff ? "off" : "on"}
      data-beat-layout-item="true"
    >
      <div className={styles.airSideLabel} aria-hidden="true">
        <span>AIR</span>
        <i />
      </div>
      <div className={styles.cycleCutaway} aria-label={beatCopy.title}>
        <div className={styles.pressureChamber}>
          <AirParticles count={18} />
          <span className={styles.pressureLabel}>
            {language === "zh" ? "声门下压力" : "SUBGLOTTAL PRESSURE"}
          </span>
        </div>
        <div className={styles.cycleFoldLeft} data-vocal-fold="true">
          <span />
        </div>
        <div className={styles.cycleGap} aria-hidden="true" />
        <div className={styles.cycleFoldRight} data-vocal-fold="true">
          <span />
        </div>
        <div className={styles.pulseStack} aria-hidden="true">
          <i />
          <i />
          <i />
        </div>
        <div className={styles.forceArrowLeft} aria-hidden="true" />
        <div className={styles.forceArrowRight} aria-hidden="true" />
      </div>
      <div className={styles.foldSideLabel} aria-hidden="true">
        <i />
        <span>FOLD</span>
      </div>

      <ol className={styles.cycleScore} aria-label="Phonation cycle">
        {PHONATION_STEPS.map((cycleStep, index) => (
          <li key={cycleStep} data-active={index === beat ? "true" : "false"}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <strong>
              {language === "zh"
                ? ["积压", "推开", "回位", "脉冲"][index]
                : ["PRESSURE", "OPEN", "RECOIL", "PULSE"][index]}
            </strong>
          </li>
        ))}
      </ol>
      <div className={styles.mechanismCaption}>
        <strong>{beatCopy.title}</strong>
        <p>{beatCopy.body}</p>
      </div>
    </div>
  );
}

function ResonanceSpace({ beat, language }: { beat: number; language: Language }) {
  const filtering = beat >= 1;

  return (
    <div
      className={styles.resonanceSpace}
      data-source-filter={filtering ? "filter" : "source"}
      data-beat-layout-item="true"
    >
      <div className={styles.sourceEmitter}>
        <span className={styles.sourceLabel}>SOURCE</span>
        <div className={styles.miniFolds} aria-hidden="true">
          <i />
          <i />
        </div>
        <div className={styles.pulseTrain} aria-hidden="true">
          {Array.from({ length: 8 }, (_, index) => (
            <i key={index} />
          ))}
        </div>
        <strong>
          {language === "zh" ? "声门脉冲" : "Glottal pulses"}
        </strong>
      </div>

      <div className={styles.handoffBeam} aria-hidden="true">
        <span />
      </div>

      <div className={styles.tractSilhouette}>
        <span className={styles.tractLabel}>FILTER</span>
        <svg viewBox="0 0 520 360" role="img" aria-label="Simplified vocal tract outline">
          <path
            className={styles.tractOutline}
            d="M76 286 C104 242 105 190 117 145 C129 98 158 56 217 40 C275 24 343 47 386 91 C421 127 439 170 453 222 C418 207 381 199 342 204 C305 209 275 227 257 255 C238 285 210 312 165 319 C128 325 95 314 76 286 Z"
          />
          <path
            className={styles.tractChannel}
            d="M126 278 C157 244 165 206 168 166 C173 112 211 81 264 79 C326 77 373 116 392 173 C365 162 334 160 304 170 C264 182 234 207 218 245 C202 279 162 294 126 278 Z"
          />
          <circle className={styles.resonanceNode} cx="193" cy="132" r="23" />
          <circle className={styles.resonanceNode} cx="275" cy="192" r="29" />
          <circle className={styles.resonanceNode} cx="359" cy="149" r="18" />
        </svg>
        <strong>
          {language === "zh" ? "声道共振塑造频谱" : "Vocal tract resonances shape the spectrum"}
        </strong>
      </div>

      <div className={styles.spectrumStage} aria-hidden="true">
        {Array.from({ length: 11 }, (_, index) => (
          <span key={index} style={{ "--particle-index": String(index) } as StageVariables} />
        ))}
      </div>

      <p className={styles.sourceFilterBoundary}>
        {language === "zh"
          ? "基频主要跟随声带循环 · 声道主要改变谐波包络"
          : "FUNDAMENTAL FREQUENCY FOLLOWS THE FOLD CYCLE · THE TRACT MAINLY SHAPES THE HARMONIC ENVELOPE"}
      </p>
    </div>
  );
}

function VoiceLine({ language }: { language: Language }) {
  return (
    <div className={styles.voiceLineStage} data-beat-layout-item="true">
      <div className={styles.jobLabels}>
        <span>
          <b>AIR</b>
          {language === "zh" ? "驱动" : "DRIVES"}
        </span>
        <span>
          <b>FOLD</b>
          {language === "zh" ? "自振" : "OSCILLATES"}
        </span>
        <span>
          <b>SPACE</b>
          {language === "zh" ? "塑形" : "SHAPES"}
        </span>
      </div>
      <svg
        className={styles.voiceLine}
        viewBox="0 0 1400 280"
        role="img"
        aria-label={language === "zh" ? "最终嗓音线" : "Final voice line"}
        data-voice-line="true"
      >
        <path
          className={styles.voiceGhost}
          d="M0 142 L120 142 C146 142 154 72 180 72 C207 72 215 212 242 212 C269 212 277 94 304 94 C331 94 339 190 366 190 C393 190 401 118 428 118 C455 118 463 168 490 168 C517 168 525 130 552 130 C579 130 587 155 614 155 C641 155 649 136 676 136 C703 136 711 149 738 149 C765 149 773 139 800 139 C827 139 835 146 862 146 L1400 146"
        />
        <path
          className={styles.voiceSignal}
          d="M0 142 L120 142 C146 142 154 72 180 72 C207 72 215 212 242 212 C269 212 277 94 304 94 C331 94 339 190 366 190 C393 190 401 118 428 118 C455 118 463 168 490 168 C517 168 525 130 552 130 C579 130 587 155 614 155 C641 155 649 136 676 136 C703 136 711 149 738 149 C765 149 773 139 800 139 C827 139 835 146 862 146 L1400 146"
        />
      </svg>
    </div>
  );
}

function ScenePanel({
  sceneId,
  beat,
  language,
  motionOff,
}: {
  sceneId: SceneId;
  beat: number;
  language: Language;
  motionOff: boolean;
}) {
  const copy = COPY[sceneId][language];
  const safeBeat = clampBeat(sceneId, beat);
  const compositions: Record<SceneId, string> = {
    1: "dark-stage",
    2: "paired-curtains",
    3: "cutaway-cycle",
    4: "resonance-space",
    5: "voice-line",
  };

  return (
    <article
      className={styles.scene}
      data-composition={compositions[sceneId]}
      data-scene={sceneId}
      data-beat-layout-container={COPY[sceneId].en.beats.length > 1 ? "true" : undefined}
      data-beat-layout-mode={COPY[sceneId].en.beats.length > 1 ? "reserved" : undefined}
    >
      <header className={styles.sceneHeader} data-beat-layout-item="true">
        <p className={styles.sceneCue}>{copy.cue}</p>
        <h1>{copy.title}</h1>
        <p className={styles.sceneSubtitle}>{copy.subtitle}</p>
      </header>

      <div className={styles.sceneCanvas}>
        {sceneId === 1 ? <DarkStage language={language} /> : null}
        {sceneId === 2 ? <AnatomyViews beat={safeBeat} language={language} /> : null}
        {sceneId === 3 ? (
          <PhonationCycle
            beat={safeBeat}
            language={language}
            motionOff={motionOff}
          />
        ) : null}
        {sceneId === 4 ? <ResonanceSpace beat={safeBeat} language={language} /> : null}
        {sceneId === 5 ? <VoiceLine language={language} /> : null}
      </div>

      <footer className={styles.sceneFooter} data-beat-layout-item="true">
        <span>{copy.sourceLine}</span>
        <strong>{String(sceneId).padStart(2, "0")}</strong>
      </footer>
    </article>
  );
}

function VocalFoldStagePlan({
  scene,
  language,
  onNavigate,
}: {
  scene: SceneId;
  language: Language;
  onNavigate?: TopicStageProps["onNavigate"];
}) {
  const navigateWithKey = (
    event: KeyboardEvent<HTMLButtonElement>,
    sceneId: SceneId,
  ) => {
    event.stopPropagation();
    let target: SceneId | null = null;

    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      target = Math.min(5, sceneId + 1) as SceneId;
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      target = Math.max(1, sceneId - 1) as SceneId;
    } else if (event.key === "Home") {
      target = 1;
    } else if (event.key === "End") {
      target = 5;
    }

    if (target !== null) {
      event.preventDefault();
      onNavigate?.(target, 0);
    }
  };

  return (
    <nav
      className={styles.stagePlan}
      aria-label={language === "zh" ? "声带舞台灯位" : "Vocal-fold stage plan"}
      data-topic-navigation="true"
      data-navigation-geometry={NAVIGATION.geometry}
      data-navigation-carrier={NAVIGATION.carrier}
      data-navigation-invocation={NAVIGATION.invocation}
      data-navigation-feedback={NAVIGATION.feedback}
      onClick={(event) => event.stopPropagation()}
      onPointerDown={(event) => event.stopPropagation()}
      onTouchStart={(event) => event.stopPropagation()}
    >
      <div className={styles.planLine} aria-hidden="true" />
      {SCENE_IDS.map((sceneId) => {
        const active = scene === sceneId;
        const position = NODE_POSITIONS[sceneId];
        return (
          <button
            key={sceneId}
            type="button"
            className={styles.stageNode}
            data-active={active ? "true" : "false"}
            data-label-weight={active ? "emphasis" : "regular"}
            aria-current={active ? "step" : undefined}
            aria-label={`${language === "zh" ? "场景" : "Scene"} ${sceneId}: ${NAV_LABELS[sceneId][language]}`}
            style={{
              "--node-x": position.x,
              "--node-y": position.y,
            } as StageVariables}
            onPointerDown={(event) => event.stopPropagation()}
            onTouchStart={(event) => event.stopPropagation()}
            onClick={(event) => {
              event.stopPropagation();
              onNavigate?.(sceneId, 0);
            }}
            onKeyDown={(event) => navigateWithKey(event, sceneId)}
          >
            <span className={styles.nodeLamp} aria-hidden="true" />
            <span className={styles.nodeLabel}>{NAV_LABELS[sceneId][language]}</span>
          </button>
        );
      })}
    </nav>
  );
}

function buildMetadata(language: Language): TopicMetadata {
  return {
    theme: language === "zh" ? "声带：空气、组织与空间" : "Vocal Folds: Air, Tissue, Space",
    densityLabel: language === "zh" ? "舞台视觉型" : "Stage Visual",
    heroScene: 3,
    colors: {
      bg: "#050810",
      ink: "#f4f7fb",
      panel: "#111925",
    },
    typography: {
      header: "Space Grotesk 700",
      body: "Space Grotesk 400",
    },
    tags: [
      "stage",
      "anatomy",
      "voice-science",
      "cutaway",
      "source-filter",
      "high-impact",
      "bilingual",
    ],
    fonts: ["Space Grotesk", "cjk:Noto Sans SC"],
    scenes: SCENE_IDS.map((sceneId) => {
      const scene = COPY[sceneId][language];
      return {
        id: sceneId,
        title: scene.title,
        beats: scene.beats.map((beat, index) => ({
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
};

function TopicStage({
  scene,
  beat,
  language,
  isThumbnail,
  reducedMotion,
  onNavigate,
}: TopicStageProps) {
  useFonts();

  const safeScene = clampScene(scene);
  const safeBeat = isThumbnail
    ? COPY[safeScene].en.beats.length - 1
    : clampBeat(safeScene, beat);
  const motionOff = reducedMotion || isThumbnail;

  return (
    <section
      className={styles.root}
      data-topic-id="vocal-folds"
      data-motion={motionOff ? "off" : "on"}
      data-thumbnail={isThumbnail ? "true" : "false"}
    >
      <div className={styles.proscenium} aria-hidden="true" />
      <div className={styles.airLight} aria-hidden="true" />
      <div className={styles.foldLight} aria-hidden="true" />
      <div className={styles.rigLine} aria-hidden="true">
        <span>AIR</span>
        <i />
        <span>FOLD</span>
      </div>

      <SpatialSceneTrack
        scene={safeScene}
        beat={safeBeat}
        transitionKind="split-merge"
        transitionMap={TRANSITION_MAP}
        transitionDurationMs={720}
        reducedMotion={motionOff}
        beatLayoutModes={BEAT_LAYOUT_MODES}
        className={styles.track}
        renderScene={(sceneId, sceneBeat) => (
          <ScenePanel
            sceneId={sceneId as SceneId}
            beat={sceneBeat}
            language={language}
            motionOff={motionOff}
          />
        )}
      />

      {isThumbnail ? null : (
        <VocalFoldStagePlan
          scene={safeScene}
          language={language}
          onNavigate={onNavigate}
        />
      )}
    </section>
  );
}

export default defineTopic({
  id: "vocal-folds",
  styleId: "interactive-dialogue-stage",
  title: {
    en: "Vocal Folds",
    zh: "声带",
  },
  modelId: "GPT 5.6 Sol",
  Stage: TopicStage,
  metadata: METADATA,
  navigation: NAVIGATION,
  transitionScore: TRANSITION_SCORE,
  evidence: {
    kind: "facts",
    sources: VOCAL_FOLDS_SOURCES,
  },
});

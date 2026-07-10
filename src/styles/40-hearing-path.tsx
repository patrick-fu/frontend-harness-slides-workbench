import { useEffect, useState } from "react";
import type {
  CSSProperties,
  KeyboardEvent,
  MouseEvent,
  PointerEvent,
  TouchEvent,
} from "react";
import type {
  BespokeStyleProps,
  StyleMetadata,
  TopicNavigationProfile,
  TopicSource,
  TopicTransitionScore,
} from "../types";
import SpatialSceneTrack from "./SpatialSceneTrack";
import type { BeatLayoutMode, SceneTransitionMap } from "./SpatialSceneTrack";
import { defineStyleTopic } from "./topic";
import styles from "./40-hearing-path.module.css";

type Language = "en" | "zh";
type SceneId = 1 | 2 | 3 | 4 | 5;
type TransductionState = "bend" | "gate" | "synapse" | "chain";

interface BeatCopy {
  action: string;
  title: string;
  body: string;
}

interface SceneCopy {
  boardCode: string;
  title: string;
  subtitle: string;
  marginNote: string;
  sourceMark: string;
  beats: BeatCopy[];
}

type ChalkVariables = CSSProperties & {
  "--particle-delay"?: string;
  "--history-length"?: string;
  "--nav-x"?: string;
  "--nav-y"?: string;
};

const SCENE_IDS: SceneId[] = [1, 2, 3, 4, 5];

export const HEARING_PATH_TRANSITION_SCORE = {
  "1->2": "linear-wipe",
  "2->3": "push-x",
  "3->4": "dip-to-color",
  "4->5": "linear-wipe",
} as const satisfies TopicTransitionScore;

const TRANSITION_MAP: SceneTransitionMap = {
  ...HEARING_PATH_TRANSITION_SCORE,
  "2->1": "linear-wipe",
  "3->2": "push-x",
  "4->3": "dip-to-color",
  "5->4": "linear-wipe",
};

const BEAT_LAYOUT_MODES = {
  3: "reserved",
  4: "reserved",
  5: "reserved",
} satisfies Partial<Record<SceneId, BeatLayoutMode>>;

const NAVIGATION_PROFILE = {
  geometry: "path",
  carrier: "auditory-pathway",
  invocation: "gesture-hold",
  feedback: "history-trail",
} as const satisfies TopicNavigationProfile;

export const HEARING_PATH_SOURCES = [
  {
    authority: "NIH / National Institute on Deafness and Other Communication Disorders",
    title: "How Do We Hear?",
    citation: "NIDCD. How Do We Hear? Updated March 16, 2022.",
    url: "https://www.nidcd.nih.gov/health/how-do-we-hear",
    supports:
      "The outer-to-middle-to-inner-ear sequence, cochlear traveling wave, place dependence, stereocilia bending, electrical signaling, and auditory-nerve handoff.",
  },
  {
    authority: "National Library of Medicine / NCBI Bookshelf",
    title: "The Middle Ear",
    citation:
      "Purves D, Augustine GJ, Fitzpatrick D, et al., editors. Neuroscience. 2nd ed. Sinauer Associates; 2001. The Middle Ear.",
    url: "https://www.ncbi.nlm.nih.gov/books/NBK11076/",
    supports:
      "The middle ear matches airborne sound to cochlear fluid through tympanic-to-oval-window area concentration and ossicular lever action.",
  },
  {
    authority: "Hearing Research / PubMed Central",
    title: "Von Békésy and cochlear mechanics",
    citation:
      "Olson ES, Duifhuis H, Steele CR. Hearing Research. 2012;293(1–2):31–43. doi:10.1016/j.heares.2012.04.017.",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC3572775/",
    supports:
      "The basilar-membrane traveling wave is a central organizing feature of cochlear mechanical processing, while the living cochlea adds active amplification.",
  },
  {
    authority: "Comprehensive Physiology / PubMed Central",
    title:
      "Hair Cell Transduction, Tuning, and Synaptic Transmission in the Mammalian Cochlea",
    citation:
      "Fettiplace R. Comprehensive Physiology. 2017;7(4):1197–1227. doi:10.1002/cphy.c160049.",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC5658794/",
    supports:
      "Hair-bundle deflection activates mechanotransduction channels; inner hair cells provide the principal electrical input to auditory-nerve fibers, while outer hair cells amplify mechanics.",
  },
] as const satisfies readonly TopicSource[];

const COPY: Record<SceneId, Record<Language, SceneCopy>> = {
  1: {
    en: {
      boardCode: "01 / AIR",
      title: "Sound begins as pressure changing here",
      subtitle:
        "Air molecules crowd and spread locally. Energy moves across the field; the same molecules do not ride the whole route.",
      marginNote: "Draw density first. A sine curve is a graph, not a molecule's journey.",
      sourceMark: "SOURCE · NIDCD",
      beats: [
        {
          action: "Mark pressure bands",
          title: "Compression alternates with rarefaction",
          body: "A sound disturbance is a patterned pressure change in air, not a ribbon flying toward the ear.",
        },
      ],
    },
    zh: {
      boardCode: "01 / 空气",
      title: "声音从空气压力变化开始",
      subtitle: "空气分子在局部变密、变疏；能量向前传递，同一批分子并不会一路跑到耳朵里。",
      marginNote: "先画疏密。正弦线是图表，不是分子的行进路线。",
      sourceMark: "来源 · NIDCD",
      beats: [
        {
          action: "标出压力带",
          title: "压缩区与稀疏区交替",
          body: "声音扰动是空气中的规律压力变化，不是一条彩带飞向耳朵。",
        },
      ],
    },
  },
  2: {
    en: {
      boardCode: "02 / MEMBRANE",
      title: "At the eardrum, the medium changes",
      subtitle:
        "The outer ear guides an airborne pressure pattern to a membrane. From here, the story continues as tissue motion.",
      marginNote: "Conversion ① · air pressure → membrane displacement",
      sourceMark: "SOURCE · NIDCD",
      beats: [
        {
          action: "Stop air at the membrane",
          title: "Air pressure → membrane motion",
          body: "The eardrum vibrates with the incoming pressure pattern and passes mechanical motion into the middle ear.",
        },
      ],
    },
    zh: {
      boardCode: "02 / 鼓膜",
      title: "到达鼓膜，介质发生改变",
      subtitle: "外耳把空气压力变化引向一层膜；从这里起，故事以组织的机械运动继续。",
      marginNote: "转换 ① · 空气压力 → 鼓膜位移",
      sourceMark: "来源 · NIDCD",
      beats: [
        {
          action: "让空气停在膜外",
          title: "空气压力 → 鼓膜运动",
          body: "鼓膜随传入的压力变化振动，再把机械运动交给中耳。",
        },
      ],
    },
  },
  3: {
    en: {
      boardCode: "03 / OSSICLES",
      title: "Three bones bridge air and fluid",
      subtitle:
        "Malleus, incus, and stapes do not copy a waveform. Their geometry transfers motion and helps match two very different media.",
      marginNote: "Conversion ② · membrane motion → concentrated force at the oval window",
      sourceMark: "SOURCES · PURVES / NCBI · NIDCD",
      beats: [
        {
          action: "Trace the small lever",
          title: "The ossicular chain passes motion inward",
          body: "The malleus moves with the eardrum, the incus couples the chain, and the stapes drives the oval window.",
        },
        {
          action: "Compare the two areas",
          title: "Area concentrates force",
          body: "Force collected over the larger tympanic membrane is focused onto the smaller oval-window contact, alongside lever action.",
        },
      ],
    },
    zh: {
      boardCode: "03 / 听小骨",
      title: "三块小骨连接空气与液体",
      subtitle: "锤骨、砧骨、镫骨并不照抄波形；它们用几何关系传递运动，并帮助匹配两种差异很大的介质。",
      marginNote: "转换 ② · 鼓膜运动 → 卵圆窗处集中的作用力",
      sourceMark: "来源 · PURVES / NCBI · NIDCD",
      beats: [
        {
          action: "追踪小杠杆",
          title: "听小骨链把运动向内传递",
          body: "锤骨随鼓膜运动，砧骨连接链条，镫骨推动卵圆窗。",
        },
        {
          action: "比较两处面积",
          title: "面积差让作用力集中",
          body: "较大鼓膜收集到的力被集中到较小的卵圆窗接触面，同时还叠加听小骨的杠杆作用。",
        },
      ],
    },
  },
  4: {
    en: {
      boardCode: "04 / COCHLEA",
      title: "The cochlea sorts by where motion peaks",
      subtitle:
        "Stapes motion launches a fluid-mechanical traveling wave. Different frequencies reach their largest response at different places.",
      marginNote: "Conversion ③ · oval-window motion → fluid pressure → basilar-membrane motion",
      sourceMark: "SOURCES · NIDCD · OLSON ET AL.",
      beats: [
        {
          action: "Launch a traveling wave",
          title: "The wave grows, peaks, then falls",
          body: "Motion propagates along the cochlear partition; it does not make the whole membrane move equally at once.",
        },
        {
          action: "Place the frequency bands",
          title: "High frequencies peak nearer the base; low frequencies farther inward",
          body: "Frequency is represented across overlapping populations and places, not by one isolated cell assigned to one musical note.",
        },
        {
          action: "Add the living amplifier",
          title: "A living cochlea is not a passive tube",
          body: "Outer hair-cell feedback sharpens and boosts local mechanical response; the chalk profile is a teaching model, not a passive pipe law.",
        },
      ],
    },
    zh: {
      boardCode: "04 / 耳蜗",
      title: "耳蜗按运动峰值的位置分拣频率",
      subtitle: "镫骨运动启动液体—机械行波；不同频率在不同位置达到最大响应。",
      marginNote: "转换 ③ · 卵圆窗运动 → 液体压力 → 基底膜运动",
      sourceMark: "来源 · NIDCD · OLSON 等",
      beats: [
        {
          action: "启动行波",
          title: "波形先增长、到峰值、再衰减",
          body: "运动沿耳蜗分隔结构传播，不是整条膜同时等幅振动。",
        },
        {
          action: "标出频率区域",
          title: "高频峰值更靠近基底，低频峰值更靠近顶端",
          body: "频率由重叠的细胞群与位置共同表征，不是一个孤立细胞对应一个音符。",
        },
        {
          action: "加入活体放大",
          title: "活体耳蜗不是一根被动管道",
          body: "外毛细胞反馈会增强并锐化局部机械响应；粉笔曲线只是教学模型，不是被动管道定律。",
        },
      ],
    },
  },
  5: {
    en: {
      boardCode: "05 / TRANSDUCTION",
      title: "Motion becomes a neural code",
      subtitle:
        "The final step is another conversion: micromechanical deflection changes a hair cell's electrical state, then synapses drive auditory-nerve activity.",
      marginNote: "Conversion ④ · micromechanics → receptor potential → synapse → neural firing pattern",
      sourceMark: "SOURCES · NIDCD · FETTIPLACE",
      beats: [
        {
          action: "Bend the bundle",
          title: "Basilar motion deflects stereocilia",
          body: "Relative motion inside the organ of Corti bends a population of hair bundles rather than pushing a sound ribbon through the cell.",
        },
        {
          action: "Open the gate",
          title: "Mechanical tension changes ion-channel opening",
          body: "Deflection changes mechanotransduction-channel probability and therefore the hair cell's receptor potential.",
        },
        {
          action: "Cross the synapse",
          title: "Inner hair cells drive auditory-nerve fibers",
          body: "Synaptic release changes firing across nerve fibers; timing and place patterns carry information onward.",
        },
        {
          action: "Box the complete derivation",
          title: "The signal is transformed, not copied",
          body: "Air pressure becomes membrane motion, concentrated force, cochlear mechanics, hair-cell voltage, and finally neural coding.",
        },
      ],
    },
    zh: {
      boardCode: "05 / 换能",
      title: "机械运动变成神经编码",
      subtitle: "最后仍是一次转换：微观机械偏转改变毛细胞的电状态，随后突触驱动听神经活动。",
      marginNote: "转换 ④ · 微机械运动 → 感受器电位 → 突触 → 神经放电模式",
      sourceMark: "来源 · NIDCD · FETTIPLACE",
      beats: [
        {
          action: "弯曲毛束",
          title: "基底膜运动让静纤毛偏转",
          body: "柯蒂器内的相对运动弯曲一群毛束，而不是把一条声音波形推入细胞。",
        },
        {
          action: "打开通道",
          title: "机械张力改变离子通道的开放概率",
          body: "偏转改变机械换能通道的开放概率，从而改变毛细胞的感受器电位。",
        },
        {
          action: "跨过突触",
          title: "内毛细胞驱动听神经纤维",
          body: "突触释放改变多条神经纤维的放电；时间与位置模式继续携带信息。",
        },
        {
          action: "框出完整推导",
          title: "信号被转换，不是被照搬",
          body: "空气压力依次变成鼓膜运动、集中的作用力、耳蜗机械响应、毛细胞电位，最终成为神经编码。",
        },
      ],
    },
  },
};

const VISUAL_LABELS = {
  en: {
    compression: "COMPRESSION",
    rarefaction: "RAREFACTION",
    localMotion: "molecules move locally",
    travel: "pressure pattern travels →",
    pinna: "outer ear",
    canal: "ear canal",
    eardrum: "eardrum",
    airborne: "air pressure",
    mechanical: "membrane motion",
    malleus: "malleus",
    incus: "incus",
    stapes: "stapes",
    tympanicArea: "larger collecting area",
    ovalArea: "smaller contact area",
    lever: "lever action",
    notScale: "NOT TO SCALE",
    base: "BASE / HIGHER FREQUENCY",
    apex: "APEX / LOWER FREQUENCY",
    wave: "traveling wave",
    peak: "place-dependent peak",
    amplifier: "outer-hair-cell feedback sharpens the response",
    tectorial: "tectorial side",
    stereocilia: "stereocilia",
    hairCell: "inner hair cell",
    channel: "mechanical gate",
    ions: "ions → receptor potential",
    synapse: "synapse",
    nerve: "auditory nerve firing",
    stages: ["air pressure", "membrane + bones", "cochlear mechanics", "hair-cell voltage", "neural coding"],
  },
  zh: {
    compression: "压缩区",
    rarefaction: "稀疏区",
    localMotion: "分子只在局部往返",
    travel: "压力模式向前传播 →",
    pinna: "外耳",
    canal: "耳道",
    eardrum: "鼓膜",
    airborne: "空气压力",
    mechanical: "鼓膜运动",
    malleus: "锤骨",
    incus: "砧骨",
    stapes: "镫骨",
    tympanicArea: "较大的收集面积",
    ovalArea: "较小的接触面积",
    lever: "杠杆作用",
    notScale: "非真实比例",
    base: "基底 / 较高频率",
    apex: "顶端 / 较低频率",
    wave: "耳蜗行波",
    peak: "位置相关峰值",
    amplifier: "外毛细胞反馈增强并锐化响应",
    tectorial: "盖膜侧",
    stereocilia: "静纤毛",
    hairCell: "内毛细胞",
    channel: "机械门控",
    ions: "离子流 → 感受器电位",
    synapse: "突触",
    nerve: "听神经放电",
    stages: ["空气压力", "鼓膜与听小骨", "耳蜗机械响应", "毛细胞电位", "神经编码"],
  },
} as const;

const NAV_LABELS: Record<Language, Record<SceneId, string>> = {
  en: {
    1: "Air pressure",
    2: "Eardrum",
    3: "Ossicles",
    4: "Cochlea map",
    5: "Hair cell",
  },
  zh: {
    1: "空气压力",
    2: "鼓膜",
    3: "听小骨",
    4: "耳蜗地图",
    5: "毛细胞",
  },
};

const NAV_POINTS = {
  1: { x: 5.5, y: 8.6 },
  2: { x: 25, y: 5 },
  3: { x: 45.5, y: 9.2 },
  4: { x: 67, y: 4.5 },
  5: { x: 88, y: 8.6 },
} as const;

const AIR_PARTICLES = Array.from({ length: 54 }, (_, index) => {
  const band = Math.floor(index / 9);
  const withinBand = index % 9;
  const compressed = band % 2 === 0;
  const baseX = 84 + band * 118;
  const spacing = compressed ? 6 : 11;
  return {
    id: index,
    x: baseX + withinBand * spacing + (withinBand % 3) * 2,
    y: 112 + ((index * 37) % 250),
    compressed,
  };
});

function useFonts() {
  useEffect(() => {
    const id = "style-40-hearing-path-fonts";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=Noto+Sans+SC:wght@400;500;700&family=Patrick+Hand&display=swap";
    document.head.appendChild(link);
  }, []);
}

function isSceneId(value: number): value is SceneId {
  return SCENE_IDS.includes(value as SceneId);
}

function clampBeat(sceneId: SceneId, beat: number): number {
  return Math.max(0, Math.min(beat, COPY[sceneId].en.beats.length - 1));
}

function revealClass(visible: boolean): string {
  return visible ? styles.visible : styles.reserved;
}

function PressureField({ language }: { language: Language }) {
  const labels = VISUAL_LABELS[language];
  return (
    <div
      className={styles.pressureField}
      data-pressure-field="compression-rarefaction"
      aria-label={
        language === "zh"
          ? "空气粒子在压缩区与稀疏区之间局部振动"
          : "Air particles moving locally through compression and rarefaction bands"
      }
    >
      <svg className={styles.pressureSvg} viewBox="0 0 820 500" role="img">
        <path className={styles.fieldAxis} d="M 58 426 H 760" />
        <path className={styles.fieldArrow} d="M 744 414 L 770 426 L 744 440" />
        <g className={styles.particleLayer}>
          {AIR_PARTICLES.map((particle) => (
            <circle
              key={particle.id}
              data-air-particle="true"
              className={
                particle.compressed
                  ? styles.compressedParticle
                  : styles.rarefiedParticle
              }
              cx={particle.x}
              cy={particle.y}
              r={particle.compressed ? 4.2 : 3.4}
              style={
                {
                  "--particle-delay": `${(particle.id % 12) * 0.025}s`,
                } as ChalkVariables
              }
            />
          ))}
        </g>
        <path className={styles.localArrow} d="M 142 270 H 194 M 142 270 L 154 258 M 142 270 L 154 282" />
        <path className={styles.localArrow} d="M 194 320 H 142 M 194 320 L 182 308 M 194 320 L 182 332" />
        <text className={styles.svgNote} x="96" y="372">{labels.localMotion}</text>
        <text className={styles.svgTravel} x="320" y="472">{labels.travel}</text>
      </svg>
      <span className={`${styles.fieldLabel} ${styles.compressionLabel}`}>
        {labels.compression}
      </span>
      <span className={`${styles.fieldLabel} ${styles.rarefactionLabel}`}>
        {labels.rarefaction}
      </span>
    </div>
  );
}

function OuterEarDiagram({ language }: { language: Language }) {
  const labels = VISUAL_LABELS[language];
  return (
    <div className={styles.outerEarWrap} data-anatomy-scope="outer-eardrum">
      <svg
        className={styles.outerEarSvg}
        viewBox="0 0 880 520"
        role="img"
        aria-label={
          language === "zh"
            ? "空气压力通过外耳道到达鼓膜并转换成膜运动"
            : "Air pressure reaches the eardrum through the outer ear and becomes membrane motion"
        }
      >
        <g className={styles.pressureBands}>
          <path d="M 48 184 Q 98 258 48 334" />
          <path d="M 90 168 Q 152 258 90 350" />
          <path d="M 134 154 Q 204 258 134 364" />
        </g>
        <path
          className={styles.pinna}
          d="M 242 86 C 138 72 144 242 204 290 C 244 322 186 396 250 430 C 330 472 344 364 306 326 C 274 294 296 244 336 220 C 382 192 346 112 292 114 C 246 116 222 166 238 204 C 252 238 288 230 292 198"
        />
        <path className={styles.canal} d="M 292 258 C 388 250 492 252 626 262" />
        <path className={styles.canal} d="M 298 310 C 404 304 506 306 626 292" />
        <path className={styles.eardrum} d="M 636 238 Q 676 278 638 320" />
        <path className={styles.motionArrow} d="M 670 208 V 344 M 654 228 L 670 208 L 686 228 M 654 324 L 670 344 L 686 324" />
        <path className={styles.labelLine} d="M 214 104 L 110 66" />
        <text className={styles.svgLabel} x="46" y="58">{labels.pinna}</text>
        <path className={styles.labelLine} d="M 438 250 L 452 150" />
        <text className={styles.svgLabel} x="392" y="132">{labels.canal}</text>
        <path className={styles.labelLine} d="M 644 236 L 730 154" />
        <text className={styles.svgLabelAccent} x="700" y="134">{labels.eardrum}</text>
        <text className={styles.svgNote} x="44" y="446">{labels.airborne}</text>
        <text className={styles.svgNoteAccent} x="622" y="446">{labels.mechanical}</text>
        <path className={styles.conversionArrow} d="M 214 438 H 576" />
        <path className={styles.conversionArrow} d="M 558 424 L 584 438 L 558 452" />
      </svg>
    </div>
  );
}

function OssicleDiagram({ beat, language }: { beat: number; language: Language }) {
  const labels = VISUAL_LABELS[language];
  return (
    <div className={styles.ossicleWrap} data-ossicle-chain="true" data-beat={beat}>
      <svg
        className={styles.ossicleSvg}
        viewBox="0 0 920 540"
        role="img"
        aria-label={
          language === "zh"
            ? "鼓膜、锤骨、砧骨、镫骨与卵圆窗的简化传力图"
            : "Simplified force-transfer diagram of eardrum, malleus, incus, stapes, and oval window"
        }
      >
        <ellipse className={styles.tympanicMembrane} cx="132" cy="260" rx="54" ry="164" />
        <path className={styles.malleus} d="M 154 244 L 276 198 L 322 222 L 252 286 L 178 280 Z" />
        <circle className={styles.joint} cx="298" cy="222" r="20" />
        <path className={styles.incus} d="M 310 214 L 436 242 L 468 280 L 434 312 L 388 268 L 316 252 Z" />
        <circle className={styles.joint} cx="450" cy="284" r="17" />
        <path className={styles.stapes} d="M 466 276 L 554 238 L 614 260 L 554 304 L 468 292 Z M 548 252 L 548 290" />
        <ellipse className={styles.ovalWindow} cx="652" cy="272" rx="22" ry="72" />
        <path className={styles.forceArrow} d="M 54 260 H 74 M 54 260 L 68 246 M 54 260 L 68 274" />
        <path className={styles.forceArrowAccent} d="M 678 272 H 822 M 802 256 L 830 272 L 802 290" />
        <path className={styles.leverGuide} d="M 198 360 Q 354 426 530 350" />
        <text className={styles.svgLabel} x="220" y="154">{labels.malleus}</text>
        <text className={styles.svgLabel} x="376" y="190">{labels.incus}</text>
        <text className={styles.svgLabel} x="530" y="190">{labels.stapes}</text>
        <text className={styles.svgNote} x="250" y="438">{labels.lever}</text>
        <g className={revealClass(beat >= 1)}>
          <path className={styles.areaBracket} d="M 62 82 H 202 M 62 82 V 114 M 202 82 V 114" />
          <text className={styles.svgLabelAccent} x="52" y="60">{labels.tympanicArea}</text>
          <path className={styles.areaBracket} d="M 622 114 H 684 M 622 114 V 144 M 684 114 V 144" />
          <text className={styles.svgLabelAccent} x="576" y="94">{labels.ovalArea}</text>
          <path className={styles.areaRelation} d="M 210 90 C 356 34 474 46 610 112" />
          <path className={styles.areaRelation} d="M 592 98 L 618 116 L 588 122" />
        </g>
        <text className={styles.scaleWarning} x="720" y="504">{labels.notScale}</text>
      </svg>
    </div>
  );
}

function CochlearMap({ beat, language }: { beat: number; language: Language }) {
  const labels = VISUAL_LABELS[language];
  return (
    <div
      className={styles.cochlearWrap}
      data-cochlear-map="traveling-wave"
      data-active-amplification={beat >= 2 ? "true" : "false"}
      data-beat={beat}
    >
      <svg
        className={styles.cochlearSvg}
        viewBox="0 0 960 520"
        role="img"
        aria-label={
          language === "zh"
            ? "展开的耳蜗基底膜行波与频率位置图"
            : "Uncoiled cochlear basilar-membrane traveling wave and frequency-place map"
        }
      >
        <path className={styles.cochlearRoof} d="M 84 150 C 304 104 634 108 880 182" />
        <path className={styles.basilarMembrane} d="M 84 340 C 324 334 638 338 880 356" />
        <path className={styles.travelingWave} d="M 92 334 C 156 330 182 300 226 326 C 288 364 324 214 396 320 C 476 442 540 142 628 326 C 692 458 742 272 808 344 C 834 374 856 360 878 356" />
        <path className={styles.stapesInput} d="M 44 246 H 86 M 64 224 L 86 246 L 64 268" />
        <text className={styles.svgNoteAccent} x="72" y="404">{labels.wave}</text>
        <g data-frequency-place="base-high" className={revealClass(beat >= 1)}>
          <path className={styles.frequencyBracketHigh} d="M 96 104 H 316" />
          <text className={styles.svgLabelAccent} x="96" y="82">{labels.base}</text>
        </g>
        <g data-frequency-place="apex-low" className={revealClass(beat >= 1)}>
          <path className={styles.frequencyBracketLow} d="M 670 106 H 886" />
          <text className={styles.svgLabelAccent} x="662" y="84">{labels.apex}</text>
        </g>
        <g className={revealClass(beat >= 1)}>
          <path className={styles.peakGuide} d="M 622 142 V 326" />
          <circle className={styles.peakDot} cx="622" cy="326" r="10" />
          <text className={styles.svgNote} x="548" y="466">{labels.peak}</text>
        </g>
        <g className={revealClass(beat >= 2)}>
          <path className={styles.amplifierBracket} d="M 332 154 C 410 114 508 114 594 154" />
          <path className={styles.amplifierSpark} d="M 420 116 L 438 80 L 452 118 L 476 76 L 492 118" />
          <text className={styles.svgAmplifier} x="330" y="52">{labels.amplifier}</text>
        </g>
      </svg>
    </div>
  );
}

function HairCellGlyph({ language }: { language: Language }) {
  const labels = VISUAL_LABELS[language];
  return (
    <g className={styles.hairCellGlyph}>
      <path className={styles.tectorialLine} d="M 74 88 H 424" />
      <text className={styles.microLabel} x="82" y="66">{labels.tectorial}</text>
      <path className={styles.hairCellBody} d="M 172 218 C 170 156 208 130 254 132 C 300 130 338 156 336 218 L 326 360 C 322 416 186 416 182 360 Z" />
      {Array.from({ length: 7 }, (_, index) => (
        <path
          key={index}
          className={styles.stereocilium}
          d={`M ${208 + index * 15} 150 L ${198 + index * 15} ${92 + index * 3}`}
        />
      ))}
      <path className={styles.microGuide} d="M 118 142 L 196 118" />
      <text className={styles.microLabelAccent} x="66" y="148">{labels.stereocilia}</text>
      <text className={styles.microLabel} x="198" y="322">{labels.hairCell}</text>
      <path className={styles.basilarLineMicro} d="M 60 414 Q 250 382 438 414" />
    </g>
  );
}

function TransductionDiagram({
  beat,
  language,
  reduce,
}: {
  beat: number;
  language: Language;
  reduce: boolean;
}) {
  const labels = VISUAL_LABELS[language];
  const states: TransductionState[] = ["bend", "gate", "synapse", "chain"];
  const state = states[Math.max(0, Math.min(beat, states.length - 1))];
  return (
    <div
      className={styles.transductionWrap}
      data-transduction-sequence="true"
      data-transduction-state={state}
      data-motion={reduce ? "off" : "on"}
    >
      <svg
        className={styles.transductionSvg}
        viewBox="0 0 920 500"
        role="img"
        aria-label={
          language === "zh"
            ? "毛束偏转、机械换能通道、内毛细胞突触与听神经的逐步转换"
            : "Stepwise conversion through hair-bundle deflection, mechanotransduction channels, inner-hair-cell synapse, and auditory nerve"
        }
      >
        <HairCellGlyph language={language} />
        <g className={revealClass(beat >= 1)}>
          <circle className={styles.gateNode} cx="226" cy="138" r="10" />
          <circle className={styles.gateNode} cx="272" cy="138" r="10" />
          <path className={styles.ionPath} d="M 226 64 V 120 M 272 64 V 120" />
          <path className={styles.ionArrow} d="M 216 108 L 226 124 L 236 108 M 262 108 L 272 124 L 282 108" />
          <text className={styles.microLabelAccent} x="336" y="166">{labels.channel}</text>
          <path className={styles.microGuide} d="M 318 158 L 282 142" />
          <text className={styles.microLabel} x="336" y="198">{labels.ions}</text>
        </g>
        <g className={revealClass(beat >= 2)}>
          <circle className={styles.vesicle} cx="228" cy="374" r="7" />
          <circle className={styles.vesicle} cx="252" cy="382" r="7" />
          <circle className={styles.vesicle} cx="278" cy="372" r="7" />
          <path className={styles.nerveFiber} d="M 246 420 C 312 454 374 426 430 450 C 504 482 566 438 648 458 C 714 474 768 448 850 462" />
          <path className={styles.spikeMark} d="M 462 452 L 478 416 L 492 458 L 510 410 L 528 456" />
          <path className={styles.spikeMark} d="M 632 458 L 648 426 L 664 462 L 680 420 L 700 458" />
          <text className={styles.microLabelAccent} x="70" y="468">{labels.synapse}</text>
          <text className={styles.microLabel} x="680" y="420">{labels.nerve}</text>
        </g>
      </svg>
      <div className={`${styles.conversionChain} ${revealClass(beat >= 3)}`}>
        {labels.stages.map((stage, index) => (
          <div key={stage} className={styles.conversionStage} data-conversion-stage={index + 1}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <strong>{stage}</strong>
            {index < labels.stages.length - 1 && <i aria-hidden="true">→</i>}
          </div>
        ))}
      </div>
    </div>
  );
}

function SceneVisual({
  sceneId,
  beat,
  language,
  reduce,
}: {
  sceneId: SceneId;
  beat: number;
  language: Language;
  reduce: boolean;
}) {
  if (sceneId === 1) return <PressureField language={language} />;
  if (sceneId === 2) return <OuterEarDiagram language={language} />;
  if (sceneId === 3) return <OssicleDiagram beat={beat} language={language} />;
  if (sceneId === 4) return <CochlearMap beat={beat} language={language} />;
  return <TransductionDiagram beat={beat} language={language} reduce={reduce} />;
}

function ScenePanel({
  sceneId,
  beat,
  language,
  reduce,
}: {
  sceneId: SceneId;
  beat: number;
  language: Language;
  reduce: boolean;
}) {
  const scene = COPY[sceneId][language];
  const safeBeat = clampBeat(sceneId, beat);
  const currentBeat = scene.beats[safeBeat];

  return (
    <section
      className={styles.scene}
      data-scene-content={sceneId}
      data-scene={sceneId}
      data-beat={safeBeat}
      aria-label={scene.title}
    >
      <header className={styles.sceneHeader} data-beat-layout-item="true">
        <span className={styles.boardCode}>{scene.boardCode}</span>
        <span className={styles.chalkRule} aria-hidden="true" />
        <span className={styles.boardSeries}>FROM AIR TO HEARING</span>
      </header>

      <div className={styles.sceneGrid}>
        <div className={styles.titleBlock} data-beat-layout-item="true">
          <p className={styles.sceneIndex}>{String(sceneId).padStart(2, "0")}</p>
          <h1>{scene.title}</h1>
          <p className={styles.subtitle}>{scene.subtitle}</p>
        </div>

        <div className={styles.visualBoard} data-beat-layout-item="true">
          <SceneVisual
            sceneId={sceneId}
            beat={safeBeat}
            language={language}
            reduce={reduce}
          />
        </div>

        <aside className={styles.derivationNote} data-beat-layout-item="true">
          <div className={styles.beatCount}>
            <span>{String(safeBeat + 1).padStart(2, "0")}</span>
            <span>/ {String(scene.beats.length).padStart(2, "0")}</span>
          </div>
          <strong>{currentBeat.action}</strong>
          <h2>{currentBeat.title}</h2>
          <p>{currentBeat.body}</p>
          <div className={styles.beatMarks} aria-label={language === "zh" ? "推导步骤" : "Derivation steps"}>
            {scene.beats.map((item, index) => (
              <i
                key={item.action}
                data-state={
                  index === safeBeat
                    ? "active"
                    : index < safeBeat
                      ? "history"
                      : "waiting"
                }
              />
            ))}
          </div>
        </aside>

        <aside className={styles.marginNote} data-beat-layout-item="true">
          <span>{language === "zh" ? "板边注" : "MARGIN NOTE"}</span>
          <p>{scene.marginNote}</p>
        </aside>
      </div>

      <footer className={styles.sceneFooter} data-beat-layout-item="true">
        <span>{scene.sourceMark}</span>
        <span>{language === "zh" ? "原创粉笔示意 · 不代表真实比例" : "ORIGINAL CHALK DIAGRAM · CONCEPTUAL SCALE"}</span>
      </footer>
    </section>
  );
}

function AuditoryPathNavigation({
  activeScene,
  language,
  onNavigate,
}: {
  activeScene: SceneId;
  language: Language;
  onNavigate?: (scene: number, beat: number) => void;
}) {
  const [holding, setHolding] = useState(false);

  const stopPointer = (event: PointerEvent<HTMLElement>) => {
    event.stopPropagation();
  };

  const beginHold = (event: PointerEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    event.currentTarget.setPointerCapture?.(event.pointerId);
    setHolding(true);
  };

  const endHold = (event: PointerEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (event.currentTarget.hasPointerCapture?.(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    setHolding(false);
  };

  const beginTouchHold = (event: TouchEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setHolding(true);
  };

  const endTouchHold = (event: TouchEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setHolding(false);
  };

  const activate = (event: MouseEvent<HTMLButtonElement>, target: SceneId) => {
    event.preventDefault();
    event.stopPropagation();
    onNavigate?.(target, 0);
  };

  const moveFrom = (from: SceneId, key: string): SceneId | null => {
    if (key === "Home") return 1;
    if (key === "End") return 5;
    if (key === "ArrowRight" || key === "ArrowDown") {
      return Math.min(5, from + 1) as SceneId;
    }
    if (key === "ArrowLeft" || key === "ArrowUp") {
      return Math.max(1, from - 1) as SceneId;
    }
    return null;
  };

  const handleNodeKey = (
    event: KeyboardEvent<HTMLButtonElement>,
    from: SceneId,
  ) => {
    const target = moveFrom(from, event.key);
    if (target === null) return;
    event.preventDefault();
    event.stopPropagation();
    onNavigate?.(target, 0);
  };

  const handleHoldKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key !== " " && event.key !== "Enter") return;
    event.preventDefault();
    event.stopPropagation();
    setHolding(true);
  };

  const handleHoldKeyUp = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key !== " " && event.key !== "Enter") return;
    event.preventDefault();
    event.stopPropagation();
    setHolding(false);
  };

  return (
    <nav
      className={styles.auditoryNav}
      aria-label={language === "zh" ? "听觉路径场景导航" : "Auditory pathway scene navigation"}
      data-topic-navigation="true"
      data-navigation-geometry={NAVIGATION_PROFILE.geometry}
      data-navigation-carrier={NAVIGATION_PROFILE.carrier}
      data-navigation-invocation={NAVIGATION_PROFILE.invocation}
      data-navigation-feedback={NAVIGATION_PROFILE.feedback}
      data-holding={holding ? "true" : "false"}
      style={
        {
          "--history-length": `${((activeScene - 1) / 4) * 100}%`,
        } as ChalkVariables
      }
      onPointerDown={stopPointer}
    >
      <svg className={styles.navPath} viewBox="0 0 100 24" aria-hidden="true">
        <path className={styles.navPathGhost} d="M 5.5 14 C 15 5 18 5 25 8 S 37 18 45.5 15.5 S 57 3 67 7 S 80 20 88 14" />
        <path className={styles.navPathHistory} d="M 5.5 14 C 15 5 18 5 25 8 S 37 18 45.5 15.5 S 57 3 67 7 S 80 20 88 14" pathLength="100" />
      </svg>

      {SCENE_IDS.map((sceneId) => {
        const point = NAV_POINTS[sceneId];
        const active = sceneId === activeScene;
        const history = sceneId < activeScene;
        return (
          <button
            key={sceneId}
            type="button"
            className={styles.navNode}
            style={
              {
                "--nav-x": `${point.x}cqw`,
                "--nav-y": `${point.y}cqh`,
              } as ChalkVariables
            }
            data-active={active ? "true" : "false"}
            data-history={history ? "true" : "false"}
            aria-current={active ? "step" : undefined}
            aria-label={
              language === "zh"
                ? `跳转到场景 ${sceneId}：${NAV_LABELS.zh[sceneId]}`
                : `Jump to scene ${sceneId}: ${NAV_LABELS.en[sceneId]}`
            }
            onPointerDown={stopPointer}
            onClick={(event) => activate(event, sceneId)}
            onKeyDown={(event) => handleNodeKey(event, sceneId)}
          >
            <span className={styles.navNodeDot} aria-hidden="true" />
            <span className={styles.navNodeIndex}>{sceneId}</span>
            <span className={styles.navNodeLabel}>{NAV_LABELS[language][sceneId]}</span>
          </button>
        );
      })}

      <button
        type="button"
        className={styles.holdControl}
        aria-label={
          language === "zh"
            ? "按住以显示完整听觉路径"
            : "Hold to reveal the whole auditory pathway"
        }
        aria-pressed={holding}
        onPointerDown={beginHold}
        onPointerUp={endHold}
        onPointerCancel={endHold}
        onTouchStart={beginTouchHold}
        onTouchEnd={endTouchHold}
        onKeyDown={handleHoldKeyDown}
        onKeyUp={handleHoldKeyUp}
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
        }}
      >
        <span aria-hidden="true">↔</span>
        {language === "zh" ? "按住看全路径" : "HOLD · TRACE ALL"}
      </button>
    </nav>
  );
}

export function getMetadata(language: Language): StyleMetadata {
  return {
    id: "blackboard-chalk-talk",
    band: "contemporary-digital",
    name: language === "zh" ? "黑板粉笔演讲" : "Blackboard Chalk Talk",
    theme: language === "zh" ? "从空气到听觉" : "From Air to Hearing",
    densityLabel: language === "zh" ? "图解推导" : "Diagram Explainer",
    heroScene: 5,
    colors: {
      bg: "#102f27",
      ink: "#edf4df",
      panel: "#173b31",
    },
    typography: {
      header: "Patrick Hand 400",
      body: "IBM Plex Mono 400",
    },
    tags: [
      "chalk",
      "blackboard",
      "hearing",
      "auditory-system",
      "scientific-derivation",
      "diagram-explainer",
      "line-drawing",
      "path-topology",
    ],
    fonts: ["Patrick Hand", "IBM Plex Mono", "cjk:Noto Sans SC"],
    scenes: SCENE_IDS.map((sceneId) => {
      const scene = COPY[sceneId][language];
      return {
        id: sceneId,
        title: scene.title,
        beats: scene.beats.map((beat, beatIndex) => ({
          id: beatIndex,
          action: beat.action,
          title: beat.title,
          body: beat.body,
        })),
      };
    }),
  };
}

export default function HearingPath({
  scene,
  beat,
  language,
  isThumbnail,
  reducedMotion,
  onNavigate,
}: BespokeStyleProps) {
  useFonts();
  const activeScene = isSceneId(scene) ? scene : 1;
  const safeBeat = clampBeat(activeScene, beat);
  const reduce = reducedMotion || isThumbnail;

  return (
    <div
      className={`${styles.root} ${reduce ? styles.reduced : ""}`}
      data-topic-id="hearing-path"
      data-motion={reduce ? "off" : "on"}
      data-transition-score="linear-wipe|push-x|dip-to-color|linear-wipe"
    >
      <div className={styles.boardDust} aria-hidden="true" />
      <div className={styles.trackFrame}>
        <SpatialSceneTrack
          scene={activeScene}
          beat={safeBeat}
          sceneIds={SCENE_IDS}
          transitionKind="linear-wipe"
          transitionMap={TRANSITION_MAP}
          transitionDurationMs={620}
          reducedMotion={reduce}
          beatLayoutModes={BEAT_LAYOUT_MODES}
          className={styles.track}
          renderScene={(sceneId, sceneBeat) => (
            <ScenePanel
              sceneId={sceneId as SceneId}
              beat={sceneBeat}
              language={language}
              reduce={reduce}
            />
          )}
        />
      </div>
      {!isThumbnail && (
        <AuditoryPathNavigation
          activeScene={activeScene}
          language={language}
          onNavigate={onNavigate}
        />
      )}
    </div>
  );
}

export const hearingPathTopic = defineStyleTopic({
  id: "hearing-path",
  topic: {
    en: "How Hearing Begins",
    zh: "听觉起点",
  },
  model: "GPT 5.6 Sol",
  component: HearingPath,
  getMetadata,
  navigation: NAVIGATION_PROFILE,
  sources: HEARING_PATH_SOURCES,
  transitionScore: HEARING_PATH_TRANSITION_SCORE,
});

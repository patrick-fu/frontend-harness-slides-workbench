import { useState } from "react";
import type { Source } from "../domain/evidence";
import {
  defineTopic,
  type TopicMetadata,
  type TopicStageProps,
  type TopicTransitionScore,
} from "../domain/topic";
import SpatialSceneTrack from "../components/stage/SpatialSceneTrack";
import type {
  BeatLayoutMode,
} from "../components/stage/SpatialSceneTrack";
import styles from "./cocoon-to-cloth.module.css";

type Lang = TopicStageProps["language"];
type SceneId = 1 | 2 | 3 | 4 | 5;

interface BeatCopy {
  id: number;
  action: string;
  title: string;
  body: string;
}

interface SceneCopy {
  eyebrow: string;
  title: string;
  body: string;
  note: string;
  visualLabel: string;
  beats: BeatCopy[];
}

const SCENE_IDS: SceneId[] = [1, 2, 3, 4, 5];

const TRANSITION_SCORE = {
  "1->2": "iris-open",
  "2->3": "split-merge",
  "3->4": "zoom-through",
  "4->5": "iris-open",
} as const satisfies TopicTransitionScore;

const BEAT_LAYOUT_MODES = {
  1: "reserved",
  2: "reserved",
  3: "reserved",
  4: "reserved",
  5: "reserved",
} satisfies Partial<Record<number, BeatLayoutMode>>;

const SOURCES = [
  {
    authority: "Food and Agriculture Organization of the United Nations",
    title: "Silk reeling and testing manual — Characteristics of the cocoon",
    citation: "FAO Agricultural Services Bulletin 136, chapter 2 (1999)",
    url: "https://www.fao.org/4/x2099e/x2099e03.htm",
    supports:
      "The cocoon filament has a fibroin core covered by sericin; cocoon properties vary by type.",
  },
  {
    authority: "Food and Agriculture Organization of the United Nations",
    title: "Silk reeling and testing manual — Cocoon cooking",
    citation: "FAO Agricultural Services Bulletin 136, chapter 5 (1999)",
    url: "https://www.fao.org/4/x2099e/x2099e06.htm",
    supports:
      "Heat, water, and steam soften sericin in preparation for reeling; conditions require control.",
  },
  {
    authority: "Smithsonian National Museum of American History",
    title: "From hanging on by a thread, to buying a thread",
    url: "https://americanhistory.si.edu/explore/stories/hanging-thread-buying-thread-rise-us-silk-industry",
    supports:
      "Cocoons are heated in water before filaments are reeled, and silk manufacture depends on workers and machinery.",
  },
  {
    authority: "The Metropolitan Museum of Art",
    title: "Textile Production in Europe: Silk, 1600–1800",
    url: "https://www.metmuseum.org/essays/textile-production-in-europe-silk-1600-1800",
    supports:
      "Patterned silk production required skilled labor, prepared warp, inserted weft, specialized looms, and linked crafts.",
  },
  {
    authority: "Victoria and Albert Museum",
    title: "What is tapestry?",
    url: "https://www.vam.ac.uk/articles/what-is-tapestry",
    supports:
      "A loom holds warp under tension while weft passes through it; weaving is labor-intensive and structurally varied.",
  },
] as const satisfies readonly Source[];

const COPY: Record<Lang, Record<SceneId, SceneCopy>> = {
  en: {
    1: {
      eyebrow: "01 / cocoon",
      title: "One cocoon.",
      body: "A compact shell holds a filament pathway, waiting for a careful hand to find its end.",
      note: "No record-length claim. The object starts small.",
      visualLabel: "A single cocoon with one visible filament end",
      beats: [
        {
          id: 0,
          action: "The cocoon settles on its plinth",
          title: "The object arrives whole",
          body: "A cocoon is presented as the single material source.",
        },
        {
          id: 1,
          action: "One filament end becomes visible",
          title: "The path begins at one loose end",
          body: "The line points forward without assigning an unverified length.",
        },
      ],
    },
    2: {
      eyebrow: "02 / material",
      title: "Core. Gum. Continuity.",
      body: "Fibroin forms the load-bearing core. Sericin binds and coats the filament around the cocoon.",
      note: "Material view, not to scale.",
      visualLabel: "Magnified diagram of fibroin cores inside a sericin coating",
      beats: [
        {
          id: 0,
          action: "The cocoon opens into a material cross-section",
          title: "Look inside the filament",
          body: "The macro view separates core from coating.",
        },
        {
          id: 1,
          action: "Fibroin and sericin labels lock to the form",
          title: "Two material roles become legible",
          body: "Fibroin carries the strand; sericin binds its outer structure.",
        },
      ],
    },
    3: {
      eyebrow: "03 / reeling",
      title: "Many become one.",
      body: "Heat and water soften sericin. Reelers gather several cocoon filaments into a workable raw-silk thread.",
      note: "Conditions and tools vary by workshop.",
      visualLabel: "Cocoons in a basin feeding several filaments onto one reel",
      beats: [
        {
          id: 0,
          action: "Cocoons enter the warm basin",
          title: "Prepare the material",
          body: "Controlled heat and water soften the gum for reeling.",
        },
        {
          id: 1,
          action: "Several filaments rise and converge",
          title: "Gather fine lines",
          body: "Individual cocoon filaments meet at a guide eye.",
        },
        {
          id: 2,
          action: "The gathered thread winds around the reel",
          title: "Build a workable thread",
          body: "The reel gives many filaments shared tension and direction.",
        },
      ],
    },
    4: {
      eyebrow: "04 / structure",
      title: "Thread learns structure.",
      body: "Doubling and twist stabilize yarn. A loom holds warp in tension while weft crosses over and under.",
      note: "Structure—not sheen—makes cloth.",
      visualLabel: "Twisted silk yarn entering a loom as warp and weft",
      beats: [
        {
          id: 0,
          action: "Parallel threads align",
          title: "Double",
          body: "Fine threads are brought together before weaving.",
        },
        {
          id: 1,
          action: "The paired threads twist",
          title: "Twist",
          body: "Twist turns parallel lines into a more stable yarn.",
        },
        {
          id: 2,
          action: "Warp lines stretch across the loom",
          title: "Hold tension",
          body: "Lengthwise warp establishes the cloth's working grid.",
        },
        {
          id: 3,
          action: "The shuttle carries weft through the warp",
          title: "Interlace",
          body: "One crosswise pass demonstrates the over-under structure.",
        },
      ],
    },
    5: {
      eyebrow: "05 / cloth",
      title: "A surface, made by hands.",
      body: "Repeated passes turn linear yarn into cloth. The folded object keeps its makers and regional traditions in view.",
      note: "Silk histories are plural; processes vary by place and practice.",
      visualLabel: "A woven silk surface unfolding and resting as folded cloth",
      beats: [
        {
          id: 0,
          action: "The woven surface opens from the loom",
          title: "Lines become an expanse",
          body: "Repeated interlacing converts yarn into a continuous surface.",
        },
        {
          id: 1,
          action: "The cloth folds and comes to rest",
          title: "The object carries its making",
          body: "The final cloth remains connected to skilled labor and local practice.",
        },
      ],
    },
  },
  zh: {
    1: {
      eyebrow: "01 / 蚕茧",
      title: "一枚蚕茧。",
      body: "小小的茧壳包住可缫取的丝路，等待一双细心的手找到线头。",
      note: "不引用未经核验的纪录长度，从小物件开始。",
      visualLabel: "一枚蚕茧与一根可见丝头",
      beats: [
        {
          id: 0,
          action: "蚕茧落在台座上",
          title: "完整物件进入画面",
          body: "先把一枚蚕茧作为材料起点。",
        },
        {
          id: 1,
          action: "一根丝头显露",
          title: "路径从松开的线头开始",
          body: "丝线指向下一步，但不附会未经核验的长度。",
        },
      ],
    },
    2: {
      eyebrow: "02 / 材料",
      title: "丝芯、胶质、连续性。",
      body: "丝素构成承力的丝芯，丝胶在外层包覆并黏结蚕茧中的丝。",
      note: "材料示意，不按真实比例。",
      visualLabel: "丝素芯与丝胶包覆层的放大示意",
      beats: [
        {
          id: 0,
          action: "蚕茧展开为材料剖面",
          title: "进入丝的内部",
          body: "放大图把丝芯与外层包覆分开。",
        },
        {
          id: 1,
          action: "丝素与丝胶标注锁定形体",
          title: "两种材料作用变得清楚",
          body: "丝素承担丝芯，丝胶黏结外部结构。",
        },
      ],
    },
    3: {
      eyebrow: "03 / 缫丝",
      title: "多根，汇成一股。",
      body: "热与水让丝胶软化，缫丝者把多枚蚕茧的细丝汇成可用的生丝。",
      note: "工艺条件与工具因作坊而异。",
      visualLabel: "温水中的蚕茧把多根细丝送上同一只丝轮",
      beats: [
        {
          id: 0,
          action: "蚕茧进入温水槽",
          title: "先处理材料",
          body: "受控的热与水让丝胶为缫取而软化。",
        },
        {
          id: 1,
          action: "多根细丝升起并汇合",
          title: "聚拢细线",
          body: "来自不同蚕茧的细丝在导眼处相遇。",
        },
        {
          id: 2,
          action: "汇合后的丝绕上丝轮",
          title: "形成可用生丝",
          body: "丝轮让多根细丝获得共同的张力与方向。",
        },
      ],
    },
    4: {
      eyebrow: "04 / 结构",
      title: "线开始学习结构。",
      body: "并丝与加捻稳定纱线；织机拉紧经线，让纬线一次次上下穿过。",
      note: "构成织物的是结构，不只是光泽。",
      visualLabel: "加捻丝线以经纬结构进入织机",
      beats: [
        {
          id: 0,
          action: "平行细丝对齐",
          title: "并丝",
          body: "织造前，先把细丝合在一起。",
        },
        {
          id: 1,
          action: "并在一起的丝开始加捻",
          title: "加捻",
          body: "扭转让平行细线成为更稳定的纱线。",
        },
        {
          id: 2,
          action: "经线在织机上拉开",
          title: "保持张力",
          body: "纵向经线建立织物的工作网格。",
        },
        {
          id: 3,
          action: "梭子带着纬线穿过经线",
          title: "交织",
          body: "一次横向穿梭展示上下相间的基本结构。",
        },
      ],
    },
    5: {
      eyebrow: "05 / 织物",
      title: "一片由双手织成的表面。",
      body: "反复穿梭把线性纱线变成织物；折叠后的成品仍保留制作者与地域工艺的痕迹。",
      note: "丝绸史不止一条，工序随地域与实践而变化。",
      visualLabel: "丝织表面展开，再折叠为静置的织物",
      beats: [
        {
          id: 0,
          action: "织物从织机方向展开",
          title: "线扩展成面",
          body: "经纬反复交织，把纱线转化为连续表面。",
        },
        {
          id: 1,
          action: "织物折叠并静置",
          title: "成品保留制作过程",
          body: "最终织物仍连接着熟练劳动与地方实践。",
        },
      ],
    },
  },
};

function cx(...names: Array<string | false | undefined>): string {
  return names.filter(Boolean).join(" ");
}

function clampScene(scene: number): SceneId {
  return Math.min(5, Math.max(1, Math.round(scene))) as SceneId;
}

function SvgDefs({ sceneId }: { sceneId: SceneId }) {
  const prefix = `cocoon-${sceneId}`;
  return (
    <defs>
      <linearGradient id={`${prefix}-silk`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#fffaf0" />
        <stop offset="0.42" stopColor="#ead6ab" />
        <stop offset="0.72" stopColor="#fff3d7" />
        <stop offset="1" stopColor="#b98a4f" />
      </linearGradient>
      <linearGradient id={`${prefix}-amber`} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#6d3f22" />
        <stop offset="0.48" stopColor="#d29a4b" />
        <stop offset="1" stopColor="#7e4c27" />
      </linearGradient>
      <linearGradient id={`${prefix}-cloth`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#f8e3b8" />
        <stop offset="0.3" stopColor="#9d4f3c" />
        <stop offset="0.58" stopColor="#d18a67" />
        <stop offset="0.82" stopColor="#f4d7a1" />
        <stop offset="1" stopColor="#77372f" />
      </linearGradient>
      <radialGradient id={`${prefix}-water`} cx="50%" cy="35%" r="75%">
        <stop offset="0" stopColor="#d9cda8" stopOpacity="0.88" />
        <stop offset="1" stopColor="#587a70" stopOpacity="0.82" />
      </radialGradient>
      <filter id={`${prefix}-shadow`} x="-30%" y="-30%" width="160%" height="170%">
        <feDropShadow dx="0" dy="18" stdDeviation="18" floodColor="#321d11" floodOpacity="0.28" />
      </filter>
      <pattern id={`${prefix}-weave`} width="28" height="28" patternUnits="userSpaceOnUse">
        <path d="M0 5H28M0 19H28" stroke="#fff2cf" strokeOpacity="0.22" strokeWidth="4" />
        <path d="M7 0V28M21 0V28" stroke="#54271f" strokeOpacity="0.2" strokeWidth="3" />
      </pattern>
    </defs>
  );
}

function SceneOneVisual({ beat, frozen, language }: { beat: number; frozen: boolean; language: Lang }) {
  return (
    <svg className={styles.heroSvg} viewBox="0 0 1000 720" role="img" aria-label="Cocoon on a crafted plinth">
      <SvgDefs sceneId={1} />
      <ellipse className={styles.floorShadow} cx="500" cy="605" rx="320" ry="55" />
      <path className={styles.plinthTop} d="M190 525L500 445 815 525 500 625Z" />
      <path className={styles.plinthFront} d="M190 525L500 625 500 674 190 573Z" />
      <path className={styles.plinthSide} d="M815 525L500 625 500 674 815 573Z" />
      <g className={cx(styles.cocoonObject, !frozen && styles.settle)} filter="url(#cocoon-1-shadow)">
        <ellipse cx="512" cy="335" rx="176" ry="226" fill="url(#cocoon-1-silk)" transform="rotate(16 512 335)" />
        {[-70, -42, -14, 14, 42, 70].map((offset) => (
          <path
            key={offset}
            d={`M${393 + offset * 0.15} 238C${480 + offset} 190 ${550 + offset * 0.65} 245 ${622 + offset * 0.12} 390C${565 + offset * 0.2} 487 ${455 + offset * 0.45} 492 ${387 + offset * 0.1} 390`}
            className={styles.cocoonFiber}
          />
        ))}
        <ellipse cx="462" cy="246" rx="58" ry="92" className={styles.cocoonHighlight} transform="rotate(18 462 246)" />
      </g>
      <g className={cx(styles.reveal, beat >= 1 && styles.revealed)}>
        <circle cx="631" cy="420" r="10" className={styles.threadEnd} />
        <path
          d="M631 420C702 464 716 520 791 510C858 501 883 448 933 455"
          className={cx(styles.filamentLine, !frozen && styles.drawLine)}
        />
        <g transform="translate(822 415)">
          <path className={styles.labelLeader} d="M0 22L-45 58" />
          <rect className={styles.objectTag} width="145" height="48" rx="24" />
          <text className={styles.tagText} x="72" y="30" textAnchor="middle">
            {language === "zh" ? "一根丝头" : "one loose end"}
          </text>
        </g>
      </g>
    </svg>
  );
}

function SceneTwoVisual({ beat, language }: { beat: number; language: Lang }) {
  const fibroin = language === "zh" ? "丝素芯" : "fibroin core";
  const sericin = language === "zh" ? "丝胶层" : "sericin coat";
  return (
    <svg className={styles.heroSvg} viewBox="0 0 1000 720" role="img" aria-label="Magnified silk filament structure">
      <SvgDefs sceneId={2} />
      <circle cx="515" cy="355" r="292" className={styles.macroHalo} />
      <circle cx="515" cy="355" r="238" fill="url(#cocoon-2-amber)" filter="url(#cocoon-2-shadow)" />
      <circle cx="515" cy="355" r="205" className={styles.sericinLayer} />
      <path d="M385 339C401 237 487 213 524 300C548 206 649 241 657 345C665 444 571 499 518 423C467 510 368 449 385 339Z" fill="url(#cocoon-2-silk)" />
      <path d="M430 331C447 278 487 276 513 326C540 272 592 279 613 338C630 390 580 439 521 397C465 446 411 392 430 331Z" className={styles.fibroinInner} />
      <g className={styles.materialContours}>
        <circle cx="515" cy="355" r="174" />
        <circle cx="515" cy="355" r="190" />
        <circle cx="515" cy="355" r="222" />
      </g>
      <g className={cx(styles.reveal, beat >= 1 && styles.revealed)}>
        <path className={styles.labelLeader} d="M338 204L425 291" />
        <rect className={styles.objectTag} x="108" y="153" width="250" height="62" rx="31" />
        <text className={styles.macroLabel} x="233" y="191" textAnchor="middle">{sericin}</text>
        <path className={styles.labelLeader} d="M633 393L760 480" />
        <rect className={styles.objectTag} x="746" y="454" width="220" height="62" rx="31" />
        <text className={styles.macroLabel} x="856" y="492" textAnchor="middle">{fibroin}</text>
      </g>
      <path className={styles.scaleMark} d="M135 592H278M135 578V606M278 578V606" />
      <text className={styles.scaleText} x="206" y="635" textAnchor="middle">
        {language === "zh" ? "非比例示意" : "NOT TO SCALE"}
      </text>
    </svg>
  );
}

function SceneThreeVisual({ beat, frozen }: { beat: number; frozen: boolean }) {
  const cocoons = [245, 330, 415, 500, 585];
  return (
    <svg className={styles.heroSvg} viewBox="0 0 1000 720" role="img" aria-label="Silk filaments gathered from a warm basin onto a reel">
      <SvgDefs sceneId={3} />
      <g className={styles.reelingFrame} filter="url(#cocoon-3-shadow)">
        <path d="M645 126V602M905 126V602M615 602H936" />
        <path d="M669 190H881M669 536H881" />
        <circle cx="775" cy="363" r="174" className={styles.reelOuter} />
        <circle cx="775" cy="363" r="134" className={styles.reelInner} />
        <circle cx="775" cy="363" r="28" className={styles.brassHub} />
        {[0, 45, 90, 135].map((angle) => (
          <line key={angle} x1="640" y1="363" x2="910" y2="363" transform={`rotate(${angle} 775 363)`} />
        ))}
      </g>
      <g className={styles.basin}>
        <path d="M112 475Q380 420 641 475L601 629Q374 686 151 629Z" className={styles.basinBody} />
        <ellipse cx="376" cy="478" rx="266" ry="72" fill="url(#cocoon-3-water)" />
        <path d="M150 472Q376 525 605 472" className={styles.waterRim} />
        {cocoons.map((x, index) => (
          <g key={x} transform={`translate(${x} ${458 + (index % 2) * 14}) rotate(${index % 2 ? 15 : -12})`}>
            <ellipse rx="43" ry="58" fill="url(#cocoon-3-silk)" />
            <path d="M-25 -20Q0 -44 25 -20M-31 5Q0 -17 31 5M-26 29Q0 9 26 29" className={styles.miniFiber} />
          </g>
        ))}
        <g className={cx(styles.steam, beat >= 0 && styles.revealed)}>
          <path d="M238 397C210 360 255 339 231 302" />
          <path d="M372 386C344 349 389 328 365 291" />
          <path d="M509 397C481 360 526 339 502 302" />
        </g>
      </g>
      <g className={cx(styles.reveal, beat >= 1 && styles.revealed)}>
        {cocoons.map((x, index) => (
          <path
            key={x}
            d={`M${x} ${428 + (index % 2) * 14}Q${460 + index * 24} ${260 - index * 5} 616 294`}
            className={cx(styles.filamentLine, !frozen && styles.drawLine)}
            style={{ animationDelay: `${index * 80}ms` }}
          />
        ))}
        <circle cx="616" cy="294" r="18" className={styles.guideEye} />
      </g>
      <g className={cx(styles.reveal, beat >= 2 && styles.revealed)}>
        <path d="M616 294Q680 270 775 190" className={cx(styles.gatheredThread, !frozen && styles.drawLine)} />
        <path d="M672 246Q786 294 859 385Q773 462 686 392Q750 318 856 346" className={styles.reelWinding} />
      </g>
    </svg>
  );
}

function SceneFourVisual({ beat, frozen }: { beat: number; frozen: boolean }) {
  const warpXs = [536, 570, 604, 638, 672, 706, 740, 774, 808, 842];
  return (
    <svg className={styles.heroSvg} viewBox="0 0 1000 720" role="img" aria-label="Silk yarn being doubled, twisted, and woven">
      <SvgDefs sceneId={4} />
      <g className={styles.twistBench} filter="url(#cocoon-4-shadow)">
        <path d="M92 563H440M125 563V637M408 563V637" />
        <circle cx="202" cy="360" r="118" className={styles.reelOuter} />
        <circle cx="202" cy="360" r="26" className={styles.brassHub} />
        <path d="M202 241V479M83 360H321" />
      </g>
      <g className={styles.parallelThreads}>
        <path d="M202 292C302 282 355 262 456 285" />
        <path d="M202 427C304 438 357 454 456 429" />
      </g>
      <g className={cx(styles.reveal, beat >= 1 && styles.revealed)}>
        <path d="M202 292C286 291 328 348 404 360C329 371 287 427 202 427" className={cx(styles.twistLine, !frozen && styles.twistIn)} />
        <path d="M404 360C453 338 478 339 519 360C479 381 454 382 404 360" className={styles.twistLine} />
      </g>
      <g className={cx(styles.reveal, beat >= 2 && styles.revealed, styles.loom)} filter="url(#cocoon-4-shadow)">
        <path className={styles.loomFrame} d="M497 118H918V630H497ZM535 158H880V586H535Z" />
        <path className={styles.loomBeam} d="M514 183H901M514 552H901" />
        {warpXs.map((x, index) => (
          <line key={x} x1={x} y1="172" x2={x} y2="565" className={cx(styles.warpLine, index % 2 === 0 && styles.warpAlt)} />
        ))}
      </g>
      <g className={cx(styles.reveal, beat >= 3 && styles.revealed)}>
        {[256, 290, 324, 358, 392, 426, 460, 494].map((y, index) => (
          <path key={y} d={`M523 ${y}Q707 ${index % 2 ? y - 7 : y + 7} 893 ${y}`} className={styles.weftLine} />
        ))}
        <g className={cx(styles.shuttle, !frozen && styles.shuttlePass)} transform="translate(698 475)">
          <path d="M-117 0L-77 -26H77L117 0L77 26H-77Z" />
          <ellipse cx="0" cy="0" rx="54" ry="16" />
          <path d="M-50 0H50" />
        </g>
      </g>
      <g className={styles.processMarks}>
        <circle cx="202" cy="655" r="19" /><text x="202" y="661">1</text>
        <path d="M224 655H390" /><circle cx="414" cy="655" r="19" /><text x="414" y="661">2</text>
        <path d="M436 655H690" /><circle cx="714" cy="655" r="19" /><text x="714" y="661">3</text>
      </g>
    </svg>
  );
}

function SceneFiveVisual({ beat, frozen, language }: { beat: number; frozen: boolean; language: Lang }) {
  return (
    <svg className={styles.heroSvg} viewBox="0 0 1000 720" role="img" aria-label="Woven silk unfolding and folding into a finished cloth">
      <SvgDefs sceneId={5} />
      <ellipse className={styles.floorShadow} cx="528" cy="628" rx="392" ry="58" />
      <g className={cx(styles.openCloth, beat === 0 && styles.revealed, !frozen && beat === 0 && styles.clothUnfurl)} filter="url(#cocoon-5-shadow)">
        <path d="M185 112Q475 47 829 125L903 522Q552 633 151 532Z" fill="url(#cocoon-5-cloth)" />
        <path d="M185 112Q475 47 829 125L903 522Q552 633 151 532Z" fill="url(#cocoon-5-weave)" />
        <path d="M185 112Q475 169 829 125M151 532Q548 457 903 522" className={styles.clothEdge} />
        <path d="M256 104Q233 342 218 550M376 84Q378 352 351 577M514 78Q544 348 514 590M665 92Q714 332 706 573M799 119Q838 324 842 543" className={styles.clothFoldLines} />
      </g>
      <g className={cx(styles.foldedCloth, beat >= 1 && styles.revealed, !frozen && beat >= 1 && styles.foldSettle)} filter="url(#cocoon-5-shadow)">
        <path d="M201 459L538 340 865 453 523 580Z" fill="url(#cocoon-5-cloth)" />
        <path d="M201 459L523 580V646L201 528Z" className={styles.foldFront} />
        <path d="M865 453L523 580V646L865 520Z" className={styles.foldSide} />
        <path d="M201 459L538 340 865 453 523 580Z" fill="url(#cocoon-5-weave)" />
        <path d="M290 425L561 334 774 407 505 505Z" className={styles.foldLayer} />
        <path d="M355 392L584 320 705 363 478 443Z" className={styles.foldHighlight} />
        <path d="M203 459L523 580 865 453" className={styles.clothEdge} />
      </g>
      <g className={cx(styles.reveal, beat >= 1 && styles.revealed, styles.makerMark)}>
        <path d="M105 242Q153 211 199 241L181 297Q153 322 126 296Z" />
        <path d="M121 267L142 287 183 238" />
        <text x="101" y="350">{language === "zh" ? "多双手" : "MANY HANDS"}</text>
        <text x="101" y="382">{language === "zh" ? "多处工艺" : "MANY PLACES"}</text>
      </g>
    </svg>
  );
}

function SceneVisual({
  sceneId,
  beat,
  language,
  frozen,
}: {
  sceneId: SceneId;
  beat: number;
  language: Lang;
  frozen: boolean;
}) {
  if (sceneId === 1) return <SceneOneVisual beat={beat} frozen={frozen} language={language} />;
  if (sceneId === 2) return <SceneTwoVisual beat={beat} language={language} />;
  if (sceneId === 3) return <SceneThreeVisual beat={beat} frozen={frozen} />;
  if (sceneId === 4) return <SceneFourVisual beat={beat} frozen={frozen} />;
  return <SceneFiveVisual beat={beat} frozen={frozen} language={language} />;
}

function ScenePanel({
  sceneId,
  beat,
  language,
  isActive,
  frozen,
}: {
  sceneId: SceneId;
  beat: number;
  language: Lang;
  isActive: boolean;
  frozen: boolean;
}) {
  const copy = COPY[language][sceneId];
  const safeBeat = Math.min(copy.beats.length - 1, Math.max(0, beat));
  const beatCopy = copy.beats[safeBeat];

  return (
    <section
      className={cx(styles.scene, styles[`scene${sceneId}`], frozen && styles.frozen)}
      data-cocoon-scene={sceneId}
      data-active={isActive ? "true" : "false"}
      data-scene-beat={safeBeat}
    >
      <div className={styles.copyColumn} data-beat-layout-item="true">
        <div className={styles.eyebrowRow}>
          <span className={styles.eyebrow}>{copy.eyebrow}</span>
          <span className={styles.fineRule} />
          <span className={styles.materialCode}>
            {language === "zh" ? "B. MORI / 材料路径" : "B. MORI / MATERIAL PATH"}
          </span>
        </div>
        <h1 className={styles.title}>{copy.title}</h1>
        <p className={styles.body}>{copy.body}</p>
        <div className={styles.beatCaption} aria-live="polite">
          <span>{String(safeBeat + 1).padStart(2, "0")}</span>
          <strong>{beatCopy.title}</strong>
          <p>{beatCopy.body}</p>
        </div>
        <p className={styles.note}>{copy.note}</p>
      </div>
      <div className={styles.visualColumn} data-beat-layout-item="true" data-visual-object={sceneId}>
        <div className={styles.visualFrame}>
          <span className={styles.frameCornerA} />
          <span className={styles.frameCornerB} />
          <SceneVisual sceneId={sceneId} beat={safeBeat} language={language} frozen={frozen} />
        </div>
        <span className={styles.visualLabel}>{copy.visualLabel}</span>
      </div>
    </section>
  );
}

const NAV_LABELS: Record<Lang, Record<SceneId, string>> = {
  en: { 1: "Cocoon", 2: "Material", 3: "Reeling", 4: "Structure", 5: "Cloth" },
  zh: { 1: "蚕茧", 2: "材料", 3: "缫丝", 4: "结构", 5: "织物" },
};

function PreviewSilhouette({ sceneId }: { sceneId: SceneId }) {
  return (
    <svg viewBox="0 0 120 72" aria-hidden="true">
      {sceneId === 1 && <ellipse cx="60" cy="36" rx="23" ry="30" />}
      {sceneId === 2 && <><circle cx="60" cy="36" r="28" /><circle cx="60" cy="36" r="15" /></>}
      {sceneId === 3 && <><path d="M13 48Q41 37 69 48L63 62H19Z" /><circle cx="91" cy="30" r="20" /><path d="M45 43L91 10" /></>}
      {sceneId === 4 && <><path d="M15 13H104V61H15Z" /><path d="M31 13V61M48 13V61M65 13V61M82 13V61" /></>}
      {sceneId === 5 && <><path d="M15 45L60 28 106 44 60 61Z" /><path d="M15 45V55L60 70 106 54V44" /></>}
    </svg>
  );
}

function SpindleNavigation({
  scene,
  language,
  onNavigate,
}: {
  scene: SceneId;
  language: Lang;
  onNavigate?: TopicStageProps["onNavigate"];
}) {
  const [preview, setPreview] = useState<SceneId | null>(null);

  return (
    <nav
      className={styles.spindleNav}
      aria-label={language === "zh" ? "丝轴场景导航" : "Silk spindle scene navigation"}
      data-topic-navigation="true"
      data-navigation-geometry="object-controller"
      data-navigation-carrier="silk-spindle"
      data-navigation-invocation="gesture-hold"
      data-navigation-feedback="next-state-preview"
    >
      {preview !== null && (
        <div className={styles.spindlePreview} data-spindle-preview={preview}>
          <PreviewSilhouette sceneId={preview} />
          <span>{NAV_LABELS[language][preview]}</span>
        </div>
      )}
      <div className={styles.spindleAxle} aria-hidden="true" />
      <span className={styles.spindleCapLeft} aria-hidden="true" />
      {SCENE_IDS.map((sceneId) => {
        const active = sceneId === scene;
        return (
          <button
            key={sceneId}
            className={cx(styles.spindleRing, active && styles.activeRing)}
            type="button"
            aria-current={active ? "step" : undefined}
            aria-label={
              language === "zh"
                ? `跳到场景 ${sceneId}：${NAV_LABELS.zh[sceneId]}`
                : `Jump to scene ${sceneId}: ${NAV_LABELS.en[sceneId]}`
            }
            onClick={() => onNavigate?.(sceneId, 0)}
            onPointerDown={() => setPreview(sceneId)}
            onPointerUp={() => setPreview(null)}
            onPointerCancel={() => setPreview(null)}
            onPointerLeave={() => setPreview(null)}
            onFocus={() => setPreview(sceneId)}
            onBlur={() => setPreview(null)}
          >
            <span>{sceneId}</span>
          </button>
        );
      })}
      <span className={styles.spindleCapRight} aria-hidden="true" />
      <span className={styles.navHint}>
        {language === "zh" ? "按住预览 · 点击跳转" : "hold to preview · click to jump"}
      </span>
    </nav>
  );
}

function getMetadata(language: Lang): TopicMetadata {
  return {
    theme: language === "zh" ? "从蚕茧到织物" : "From Cocoon to Cloth",
    densityLabel: language === "zh" ? "舞台冲击" : "Stage Impact",
    heroScene: 5,
    colors: {
      bg: "#eadfc8",
      ink: "#342219",
      panel: "#f6ecd8",
    },
    typography: {
      header: "Cormorant Garamond 600",
      body: "Avenir Next 500",
    },
    tags: [
      "object-metaphor",
      "silk",
      "material-process",
      "loom",
      "warm",
      "crafted",
      "stage-impact",
    ],
    fonts: ["Cormorant Garamond", "Avenir Next", "cjk:Songti SC", "cjk:PingFang SC"],
    scenes: SCENE_IDS.map((sceneId) => ({
      id: sceneId,
      title: COPY[language][sceneId].title,
      beats: COPY[language][sceneId].beats,
    })),
  };
}

const METADATA = {
  en: getMetadata("en"),
  zh: getMetadata("zh"),
};

function TopicStage({
  scene,
  beat,
  language,
  isThumbnail,
  reducedMotion,
  onNavigate,
}: TopicStageProps) {
  const safeScene = clampScene(scene);
  const frozen = reducedMotion || isThumbnail;

  return (
    <div
      className={cx(styles.root, frozen && styles.frozen)}
      data-topic-id="cocoon-to-cloth"
      data-frozen={frozen ? "true" : "false"}
    >
      <div className={styles.paperGrain} aria-hidden="true" />
      <div className={styles.trackFrame}>
        <SpatialSceneTrack
          scene={safeScene}
          beat={beat}
          sceneIds={SCENE_IDS}
          transitionKind="iris-open"
          transitionMap={TRANSITION_SCORE}
          transitionDurationMs={780}
          reducedMotion={frozen}
          beatLayoutModes={BEAT_LAYOUT_MODES}
          renderScene={(sceneId, sceneBeat, isActive) => (
            <ScenePanel
              sceneId={clampScene(sceneId)}
              beat={sceneBeat}
              language={language}
              isActive={isActive}
              frozen={frozen}
            />
          )}
        />
      </div>
      {!isThumbnail && (
        <SpindleNavigation
          scene={safeScene}
          language={language}
          onNavigate={onNavigate}
        />
      )}
    </div>
  );
}

export default defineTopic({
  id: "cocoon-to-cloth",
  styleId: "object-metaphor-hero",
  title: { en: "Cocoon to Cloth", zh: "茧到织物" },
  modelId: "GPT 5.6 Sol",
  Stage: TopicStage,
  metadata: METADATA,
  navigation: {
    geometry: "object-controller",
    carrier: "silk-spindle",
    invocation: "gesture-hold",
    feedback: "next-state-preview",
  },
  transitionScore: TRANSITION_SCORE,
  evidence: {
    kind: "facts",
    sources: SOURCES,
  },
});

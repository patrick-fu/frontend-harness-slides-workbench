import { useCallback, useRef, useState } from "react";
import type {
  CSSProperties,
  KeyboardEvent as ReactKeyboardEvent,
  PointerEvent as ReactPointerEvent,
} from "react";
import type {
  BespokeStyleProps,
  StyleMetadata,
  TopicSource,
  TopicTransitionScore,
} from "../types";
import SpatialSceneTrack, {
  type BeatLayoutMode,
  type SceneTransitionKind,
  type SceneTransitionMap,
} from "./SpatialSceneTrack";
import { defineStyleTopic } from "./topic";
import styles from "./27-leaf-stomata.module.css";

type Language = BespokeStyleProps["language"];
type SceneId = 1 | 2 | 3 | 4 | 5;

interface BeatCopy {
  action: string;
  title: string;
  body: string;
  marker: string;
}

interface SceneCopy {
  plate: string;
  sceneName: string;
  title: string;
  subtitle: string;
  figure: string;
  evidence: string;
  beats: BeatCopy[];
}

const SCENE_IDS: SceneId[] = [1, 2, 3, 4, 5];

const BEAT_LAYOUT_MODES: Partial<Record<number, BeatLayoutMode>> = {
  2: "reserved",
  3: "reserved",
  4: "reserved",
};

export const LEAF_STOMATA_TRANSITION_SCORE = {
  "1->2": "iris-open",
  "2->3": "crossfade",
  "3->4": "hard-cut",
  "4->5": "focus-swap",
} as const satisfies Readonly<TopicTransitionScore>;

const TRANSITION_MAP: SceneTransitionMap = LEAF_STOMATA_TRANSITION_SCORE;

// SpatialSceneTrack clears an active outgoing panel when the next edge is a
// hard cut. Keep the current edge as the fallback so the settled track still
// reports the authored score after that clear, including rapid sequential nav.
const INCOMING_TRANSITION_KIND = {
  1: "crossfade",
  2: LEAF_STOMATA_TRANSITION_SCORE["1->2"],
  3: LEAF_STOMATA_TRANSITION_SCORE["2->3"],
  4: LEAF_STOMATA_TRANSITION_SCORE["3->4"],
  5: LEAF_STOMATA_TRANSITION_SCORE["4->5"],
} as const satisfies Record<SceneId, SceneTransitionKind>;

export const LEAF_STOMATA_SOURCES = [
  {
    authority: "OpenStax / Rice University",
    title: "Biology 2e — 30.4 Leaves",
    citation:
      "Clark, Choi, and Douglas, Biology 2e, section 30.4, OpenStax, 2018.",
    url: "https://openstax.org/books/biology-2e/pages/30-4-leaves",
    supports:
      "Supports the leaf-to-epidermis scale sequence, the paired guard cells surrounding a stomatal pore, and the sub-stomatal air space connecting the pore to the mesophyll.",
    boundary:
      "The illustrations are original explanatory line drawings, not reproductions of the microscopy in the textbook; stomatal form and distribution vary among plant groups and leaf surfaces.",
  },
  {
    authority: "OpenStax / Rice University",
    title: "Biology 2e — 30.5 Transport of Water and Solutes in Plants",
    citation:
      "Clark, Choi, and Douglas, Biology 2e, section 30.5, OpenStax, 2018.",
    url: "https://openstax.org/books/biology-2e/pages/30-5-transport-of-water-and-solutes-in-plants",
    supports:
      "Supports the central exchange: stomata admit carbon dioxide while open pores also permit water-vapor loss, and guard cells respond to multiple cues including light, leaf water status, and carbon-dioxide concentration.",
    boundary:
      "The Topic describes a regulated trade-off, not a claim that every stoma opens in daylight or that one cue alone fixes aperture across species, tissues, and environmental histories.",
  },
  {
    authority: "University of California, San Diego / The Arabidopsis Book",
    title: "The Clickable Guard Cell, Version II",
    citation:
      "Kwak, Mäser, and Schroeder, The Clickable Guard Cell, Version II, UC San Diego and The Arabidopsis Book.",
    url: "https://labs.biology.ucsd.edu/schroeder/clickablegc2/",
    supports:
      "Supports the guard-cell framing of the pore and its role in regulating atmospheric carbon-dioxide influx for carbon fixation together with transpiration-related water loss.",
    boundary:
      "The linked model summarizes Arabidopsis guard-cell signaling; this Topic does not imply that every pathway, ion channel, or response magnitude is identical in all vascular plants.",
  },
  {
    authority: "Frontiers in Plant Science / PubMed Central",
    title: "Rethinking Guard Cell Metabolism",
    citation:
      "Daloso et al., “Rethinking Guard Cell Metabolism,” Frontiers in Plant Science 7 (2016): 1373.",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC5100799/",
    supports:
      "Supports the view of guard-cell aperture as an actively regulated outcome involving ion transport, solute biosynthesis, metabolism, and adjustments in guard-cell volume rather than a binary mechanical switch.",
    boundary:
      "The review emphasizes open questions and metabolic plasticity; the plate intentionally stops at system-level conditions and does not assign a single molecular cause to any drawn aperture.",
  },
] as const satisfies readonly (TopicSource & { boundary: string })[];

const COPY: Record<SceneId, Record<Language, SceneCopy>> = {
  1: {
    en: {
      plate: "PLATE XXVII · FIG. I",
      sceneName: "Whole leaf",
      title: "The leaf’s smallest bargain",
      subtitle:
        "A broad photosynthetic surface depends on openings too small to see unaided.",
      figure: "Fagus sylvatica · reference leaf, schematic",
      evidence: "One inspection window locates the lower epidermis [S1]",
      beats: [
        {
          action: "Mount the whole leaf and locate one epidermal inspection window.",
          title: "One leaf · many regulated pores",
          body: "The frame marks a change of scale, not a decorative bloom.",
          marker: "WHOLE LEAF / ×1",
        },
      ],
    },
    zh: {
      plate: "第二十七图版 · 图一",
      sceneName: "完整叶片",
      title: "叶片最小的交换",
      subtitle: "一片宽阔的光合表面，依靠肉眼看不见的微小开口。",
      figure: "欧洲山毛榉 · 参考叶片示意",
      evidence: "单一观察框定位叶片下表皮 [S1]",
      beats: [
        {
          action: "装裱完整叶片，并定位一个表皮观察框。",
          title: "一片叶 · 许多受调节的孔隙",
          body: "方框表示尺度切换，不是装饰花纹。",
          marker: "完整叶片 / ×1",
        },
      ],
    },
  },
  2: {
    en: {
      plate: "PLATE XXVII · FIG. II",
      sceneName: "Epidermis window",
      title: "Lean into the epidermis",
      subtitle:
        "Pavement cells form the surface; paired guard cells define each pore.",
      figure: "Abaxial epidermis · interpretive field drawing",
      evidence: "Form and distribution vary by species and surface [S1]",
      beats: [
        {
          action: "Reveal the irregular pavement-cell field.",
          title: "A continuous protective surface",
          body: "Interlocking epidermal cells surround, but do not replace, the pore.",
          marker: "EPIDERMIS / ×180",
        },
        {
          action: "Resolve one stomatal complex inside the field.",
          title: "Two guard cells border one aperture",
          body: "The pore opens into an air space within the leaf.",
          marker: "STOMATAL COMPLEX / ×500",
        },
      ],
    },
    zh: {
      plate: "第二十七图版 · 图二",
      sceneName: "表皮视窗",
      title: "靠近叶片表皮",
      subtitle: "铺地细胞构成表面；成对保卫细胞围成气孔。",
      figure: "下表皮 · 解释性视野绘图",
      evidence: "形态与分布会随物种及叶面而变 [S1]",
      beats: [
        {
          action: "显露不规则的铺地细胞视野。",
          title: "连续的保护表面",
          body: "相互嵌合的表皮细胞围绕孔隙，却不等同于孔隙。",
          marker: "表皮 / ×180",
        },
        {
          action: "在视野中解析一个气孔复合体。",
          title: "两个保卫细胞围成一个开口",
          body: "孔隙向内连通叶片内部的空气腔。",
          marker: "气孔复合体 / ×500",
        },
      ],
    },
  },
  3: {
    en: {
      plate: "PLATE XXVII · FIG. III",
      sceneName: "Stomatal cutaway",
      title: "One pore, two directions",
      subtitle:
        "Opening creates a shared passage for carbon gain and atmospheric water loss.",
      figure: "Guard-cell pair and sub-stomatal air space · not to scale",
      evidence: "Flux directions are schematic; rates are not implied [S2, S3]",
      beats: [
        {
          action: "Draw the guard-cell pair and its central aperture.",
          title: "Guard cells define the aperture",
          body: "Changes in guard-cell volume alter the width of the pore.",
          marker: "APERTURE",
        },
        {
          action: "Trace carbon dioxide from atmosphere into the leaf.",
          title: "CO₂ enters",
          body: "Carbon dioxide diffuses toward the internal air spaces used for photosynthesis.",
          marker: "CO₂ / INWARD",
        },
        {
          action: "Trace water vapor from moist leaf interior to atmosphere.",
          title: "H₂O vapor leaves",
          body: "Water evaporated from internal cell surfaces can diffuse outward through the same pore.",
          marker: "H₂O / OUTWARD",
        },
        {
          action: "Set both arrows against the changing aperture.",
          title: "A wider passage can increase both fluxes",
          body: "Aperture regulates exchange; it does not provide carbon entry without a water cost.",
          marker: "EXCHANGE / COUPLED",
        },
      ],
    },
    zh: {
      plate: "第二十七图版 · 图三",
      sceneName: "气孔剖面",
      title: "一个孔隙，两个方向",
      subtitle: "开口同时承担碳收益与向大气失水的通道。",
      figure: "保卫细胞与气孔下腔 · 非比例绘制",
      evidence: "箭头只示方向，不代表通量大小 [S2, S3]",
      beats: [
        {
          action: "绘出成对保卫细胞与中央开口。",
          title: "保卫细胞界定开度",
          body: "保卫细胞体积变化会改变孔隙宽度。",
          marker: "开度",
        },
        {
          action: "描出二氧化碳由大气进入叶片的路径。",
          title: "CO₂ 进入",
          body: "二氧化碳向叶片内部空气腔扩散，供光合作用利用。",
          marker: "CO₂ / 向内",
        },
        {
          action: "描出水蒸气由湿润叶内通向大气的路径。",
          title: "H₂O 水蒸气离开",
          body: "内部细胞表面蒸发的水，可以经同一孔隙向外扩散。",
          marker: "H₂O / 向外",
        },
        {
          action: "把相反箭头与变化中的开度并置。",
          title: "通道变宽，两个通量都可能增加",
          body: "开度调节交换，却不能让碳进入而完全不付出水分代价。",
          marker: "交换 / 耦合",
        },
      ],
    },
  },
  4: {
    en: {
      plate: "PLATE XXVII · FIG. IV",
      sceneName: "Regulating conditions",
      title: "The aperture integrates conditions",
      subtitle:
        "Guard-cell responses combine environmental cues with the leaf’s present state.",
      figure: "Conditional influences · relationships, not toggle commands",
      evidence: "No single cue determines a universal open/closed state [S2, S4]",
      beats: [
        {
          action: "Annotate light and internal carbon-dioxide conditions.",
          title: "Signals arrive together",
          body: "Light and internal CO₂ can shape guard-cell signaling in context.",
          marker: "LIGHT + INTERNAL CO₂",
        },
        {
          action: "Add leaf water status and atmospheric demand.",
          title: "The response depends on the whole situation",
          body: "Leaf water status, humidity and species history interact—not a universal switch controlled by one factor.",
          marker: "WATER STATUS + AIR",
        },
      ],
    },
    zh: {
      plate: "第二十七图版 · 图四",
      sceneName: "调节条件",
      title: "开度整合多种条件",
      subtitle: "保卫细胞把环境线索与叶片当下状态共同纳入响应。",
      figure: "条件性影响 · 关系提示，而非开关指令",
      evidence: "不存在由单一因素决定的通用开闭状态 [S2, S4]",
      beats: [
        {
          action: "标注光照与叶内二氧化碳条件。",
          title: "多种信号同时到达",
          body: "光照与叶内 CO₂ 会在具体情境中影响保卫细胞信号。",
          marker: "光照 + 叶内 CO₂",
        },
        {
          action: "加入叶片水分状态与大气蒸发需求。",
          title: "响应取决于整体处境",
          body: "叶片水分、湿度与物种历史相互作用，并非单一因素控制的通用开关。",
          marker: "水分状态 + 空气",
        },
      ],
    },
  },
  5: {
    en: {
      plate: "PLATE XXVII · SPECIMEN LABEL",
      sceneName: "Specimen label",
      title: "Every opening is an exchange",
      subtitle:
        "The leaf keeps negotiating carbon access against the risk of water loss.",
      figure: "Mounted leaf · exchange apparatus returned to whole-organ scale",
      evidence: "A regulated trade-off, not a cost-free valve [S2–S4]",
      beats: [
        {
          action: "Return the microscopic exchange to the mounted whole leaf.",
          title: "Carbon in · water vapor out",
          body: "The smallest aperture helps set the terms under which the whole leaf works.",
          marker: "CATALOGUE NOTE / EXCHANGE",
        },
      ],
    },
    zh: {
      plate: "第二十七图版 · 标本铭牌",
      sceneName: "标本铭牌",
      title: "每次开口都是一次交换",
      subtitle: "叶片持续在碳进入与失水风险之间调节。",
      figure: "装裱叶片 · 把微观交换放回完整器官尺度",
      evidence: "这是受调节的权衡，不是无代价阀门 [S2–S4]",
      beats: [
        {
          action: "把微观交换放回装裱的完整叶片。",
          title: "碳进入 · 水蒸气离开",
          body: "最小的开度，参与决定整片叶以何种条件工作。",
          marker: "编目注记 / 交换",
        },
      ],
    },
  },
};

const COMPOSITIONS: Record<SceneId, string> = {
  1: "whole-leaf",
  2: "epidermis-window",
  3: "stomata-cutaway",
  4: "gas-water-conditions",
  5: "specimen-label",
};

const NAV_LABELS: Record<Language, Record<SceneId, string>> = {
  en: {
    1: "whole leaf",
    2: "epidermis window",
    3: "stomatal cutaway",
    4: "regulating conditions",
    5: "specimen label",
  },
  zh: {
    1: "完整叶片",
    2: "表皮视窗",
    3: "气孔剖面",
    4: "调节条件",
    5: "标本铭牌",
  },
};

function normalizeScene(scene: number): SceneId {
  return scene === 1 || scene === 2 || scene === 3 || scene === 4 || scene === 5
    ? scene
    : 1;
}

function normalizeBeat(scene: SceneId, beat: number): number {
  const lastBeat = COPY[scene].en.beats.length - 1;
  if (!Number.isFinite(beat)) return 0;
  return Math.max(0, Math.min(lastBeat, Math.floor(beat)));
}

function cx(...classes: Array<string | false | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

function visible(beat: number, index: number): "true" | "false" {
  return beat >= index ? "true" : "false";
}

export function getMetadata(language: Language): StyleMetadata {
  const isZh = language === "zh";
  return {
    id: "botanical-specimen-plate",
    band: "craft-cultural",
    name: isZh ? "植物标本图版" : "Botanical Specimen Plate",
    theme: isZh ? "叶片最小的交换" : "The Leaf’s Smallest Bargain",
    densityLabel: isZh ? "编辑阅读" : "Editorial Reading",
    heroScene: 3,
    colors: {
      bg: "#e8dfc8",
      ink: "#352d21",
      panel: "#d8cba9",
    },
    typography: {
      header: "Iowan Old Style 600",
      body: "Baskerville 400",
    },
    tags: [
      "botanical",
      "scientific-illustration",
      "stomata",
      "cutaway",
      "editorial-reading",
      "aged-paper",
      "sepia",
      "light",
      "reserved",
    ],
    fonts: [
      "Iowan Old Style",
      "Baskerville",
      "cjk:Songti SC",
      "cjk:Noto Serif CJK SC",
    ],
    scenes: SCENE_IDS.map((id) => ({
      id,
      title: COPY[id][language].sceneName,
      beats: COPY[id][language].beats.map((beat, index) => ({
        id: index,
        action: beat.action,
        title: beat.title,
        body: beat.body,
      })),
    })),
  };
}

function WholeLeaf({ closing = false }: { closing?: boolean }) {
  return (
    <svg
      className={cx(styles.wholeLeaf, closing && styles.wholeLeafClosing)}
      viewBox="0 0 860 690"
      role="img"
      aria-label="Original scientific line drawing of a mounted leaf"
    >
      <g className={styles.leafWash}>
        <path d="M425 626C398 562 381 498 386 429C391 354 430 302 473 246C528 175 562 112 548 53C472 68 391 118 338 189C279 269 266 365 300 452C327 521 371 577 425 626Z" />
      </g>
      <path
        className={styles.leafOutline}
        d="M425 626C398 562 381 498 386 429C391 354 430 302 473 246C528 175 562 112 548 53C472 68 391 118 338 189C279 269 266 365 300 452C327 521 371 577 425 626Z"
      />
      <path className={styles.midrib} d="M419 634C422 523 438 411 475 299C500 221 525 143 548 53" />
      <g className={styles.veins}>
        <path d="M435 513C386 499 343 477 303 444" />
        <path d="M442 463C386 439 337 406 292 362" />
        <path d="M453 408C391 374 344 332 309 281" />
        <path d="M466 353C405 310 371 267 345 221" />
        <path d="M480 300C431 254 404 211 389 166" />
        <path d="M494 249C460 208 445 167 437 124" />
        <path d="M506 205C544 188 570 167 590 143" />
        <path d="M488 268C541 258 578 241 611 211" />
        <path d="M469 329C534 326 582 308 626 274" />
        <path d="M452 392C516 400 568 390 617 364" />
        <path d="M438 458C493 470 539 469 581 454" />
      </g>
      <path className={styles.petiole} d="M419 634C403 649 386 664 366 680" />
      {!closing && (
        <g className={styles.inspectionWindow}>
          <path d="M326 398H404V466H326Z" />
          <path d="M326 409V398H337M393 398H404V409M404 455V466H393M337 466H326V455" />
          <path d="M404 432C482 435 550 449 620 492" />
          <circle cx="626" cy="496" r="7" />
        </g>
      )}
    </svg>
  );
}

function EpidermisField({ beat }: { beat: number }) {
  return (
    <svg
      className={styles.epidermisField}
      viewBox="0 0 1030 650"
      role="img"
      aria-label="Original epidermis field drawing with one stomatal complex"
    >
      <g className={styles.pavementCells}>
        <path d="M-18 56C84 3 127 95 213 48C287 8 337 19 389 78C432 128 498 121 549 70C603 14 674 7 744 55C812 101 888 90 955 35C1000 0 1052 9 1088 38" />
        <path d="M-15 210C55 148 126 153 189 214C247 270 309 252 355 200C408 141 477 149 531 208C579 260 651 267 705 214C769 151 836 160 891 219C950 282 1003 268 1065 218" />
        <path d="M-23 381C47 323 115 333 180 391C240 444 310 440 362 381C417 319 478 324 531 383C586 444 652 446 712 389C773 331 835 336 893 397C945 452 1007 450 1066 399" />
        <path d="M-17 555C52 494 119 506 183 564C241 617 310 615 365 555C420 494 482 502 536 562C590 622 657 623 716 566C776 508 841 512 897 572C949 628 1012 625 1068 571" />
        <path d="M101 18C145 89 138 153 88 202C39 250 42 324 92 376C141 427 140 501 92 551C58 587 52 626 66 673" />
        <path d="M292 -7C334 59 323 126 273 179C221 234 227 309 281 359C337 410 338 483 285 538C247 577 242 624 258 673" />
        <path d="M484 -8C530 52 522 117 477 171C429 228 433 300 484 353C536 406 542 476 492 533C457 573 454 620 470 674" />
        <path d="M681 -8C728 53 720 119 674 171C625 227 631 301 684 353C738 407 738 480 688 535C651 576 649 622 665 674" />
        <path d="M874 -9C918 53 910 120 865 172C817 228 824 302 876 355C929 409 932 480 881 537C845 578 843 624 859 674" />
      </g>
      <g className={cx(styles.stomatalComplex, beat >= 1 && styles.resolvedComplex)}>
        <path className={styles.guardCell} d="M431 257C379 291 374 372 426 408C457 429 482 410 491 378C501 344 500 319 488 288C477 258 456 240 431 257Z" />
        <path className={styles.guardCell} d="M599 257C651 291 656 372 604 408C573 429 548 410 539 378C529 344 530 319 542 288C553 258 574 240 599 257Z" />
        <path className={styles.pore} d="M500 278C514 262 530 262 543 278C533 315 533 350 542 389C527 405 513 405 499 389C508 351 508 315 500 278Z" />
        <path className={styles.stomaLeader} d="M605 329C699 321 778 286 846 230" />
        <circle className={styles.stomaLeader} cx="850" cy="226" r="7" />
      </g>
    </svg>
  );
}

function StomataCutaway({ beat, language }: { beat: number; language: Language }) {
  const labels = language === "zh"
    ? { atmosphere: "大气", interior: "叶内空气腔", guard: "保卫细胞", pore: "孔隙" }
    : { atmosphere: "ATMOSPHERE", interior: "LEAF AIR SPACE", guard: "GUARD CELL", pore: "PORE" };
  return (
    <svg
      className={styles.stomataCutaway}
      viewBox="0 0 1080 690"
      role="img"
      aria-label="Original stomatal cutaway showing carbon dioxide entering and water vapor leaving"
      data-aperture={beat >= 3 ? "wide" : "reference"}
    >
      <defs>
        <marker id="leaf-stomata-arrow-in" viewBox="0 0 12 12" refX="10" refY="6" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
          <path d="M1 1L11 6L1 11Z" className={styles.arrowHeadCarbon} />
        </marker>
        <marker id="leaf-stomata-arrow-out" viewBox="0 0 12 12" refX="10" refY="6" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
          <path d="M1 1L11 6L1 11Z" className={styles.arrowHeadWater} />
        </marker>
      </defs>
      <text className={styles.svgSmallCaps} x="50" y="57">{labels.atmosphere}</text>
      <text className={styles.svgSmallCaps} x="50" y="648">{labels.interior}</text>
      <path className={styles.epidermisLine} d="M50 328C240 320 382 322 473 336M607 336C719 322 859 321 1030 328" />
      <path className={styles.airSpace} d="M333 509C405 451 466 431 540 431C614 431 675 451 747 509C670 583 609 608 540 608C471 608 410 583 333 509Z" />
      <g className={styles.cutawayGuardLeft}>
        <path className={styles.cutawayGuard} d="M490 224C420 229 380 281 391 354C402 427 449 452 497 416C526 394 529 365 520 335C510 300 514 257 490 224Z" />
        <path className={styles.guardHatch} d="M417 281C445 297 466 319 476 347M416 322C443 336 463 354 474 376M431 376C449 384 463 394 473 405" />
      </g>
      <g className={styles.cutawayGuardRight}>
        <path className={styles.cutawayGuard} d="M590 224C660 229 700 281 689 354C678 427 631 452 583 416C554 394 551 365 560 335C570 300 566 257 590 224Z" />
        <path className={styles.guardHatch} d="M663 281C635 297 614 319 604 347M664 322C637 336 617 354 606 376M649 376C631 384 617 394 607 405" />
      </g>
      <path className={styles.poreMeasure} d="M526 350H554" />
      <path className={styles.poreMeasureTicks} d="M526 338V362M554 338V362" />
      <text className={styles.svgLabel} x="540" y="305" textAnchor="middle">{labels.pore}</text>
      <path className={styles.labelLeader} d="M393 248L288 173" />
      <text className={styles.svgLabel} x="278" y="163" textAnchor="end">{labels.guard}</text>
      <g className={styles.carbonFlow} data-visible={visible(beat, 1)}>
        <path d="M788 101C690 143 623 200 575 287C548 337 537 397 540 482" markerEnd="url(#leaf-stomata-arrow-in)" />
        <text className={styles.carbonText} x="804" y="91">CO₂ {language === "zh" ? "进入" : "ENTERS"}</text>
      </g>
      <g className={styles.waterFlow} data-visible={visible(beat, 2)}>
        <path d="M484 503C481 423 474 368 447 310C417 245 362 192 292 145" markerEnd="url(#leaf-stomata-arrow-out)" />
        <text className={styles.waterText} x="82" y="124">H₂O {language === "zh" ? "水蒸气离开" : "VAPOR LEAVES"}</text>
      </g>
    </svg>
  );
}

function ConditionsPlate({ beat, language }: { beat: number; language: Language }) {
  const labels = language === "zh"
    ? {
        light: "光照",
        carbon: "叶内 CO₂",
        water: "叶片水分状态",
        air: "湿度与空气需求",
        center: "响应中的开度",
        conditional: "条件性影响",
      }
    : {
        light: "LIGHT",
        carbon: "INTERNAL CO₂",
        water: "LEAF WATER STATUS",
        air: "HUMIDITY + AIR DEMAND",
        center: "APERTURE IN RESPONSE",
        conditional: "CONDITIONAL INFLUENCE",
      };
  return (
    <svg
      className={styles.conditionsPlate}
      viewBox="0 0 1080 690"
      role="img"
      aria-label="Conditional influences around a stomatal aperture"
    >
      <path className={styles.conditionLeaf} d="M540 617C408 562 315 456 312 325C309 193 402 92 540 55C678 92 771 193 768 325C765 456 672 562 540 617Z" />
      <path className={styles.conditionMidrib} d="M540 593V78" />
      <g className={styles.conditionStoma}>
        <path d="M482 272C432 296 425 388 477 419C505 436 526 409 529 368C532 327 518 286 482 272Z" />
        <path d="M598 272C648 296 655 388 603 419C575 436 554 409 551 368C548 327 562 286 598 272Z" />
        <path className={styles.conditionPore} d="M536 293C545 286 552 294 555 319C559 355 557 391 548 412C539 418 530 409 527 387C523 352 525 315 536 293Z" />
      </g>
      <g className={styles.conditionFirst} data-visible="true">
        <path d="M437 258C361 214 274 178 174 153" />
        <circle cx="161" cy="150" r="7" />
        <text className={styles.conditionLabel} x="68" y="127">{labels.light}</text>
        <text className={styles.conditionNote} x="68" y="159">{labels.conditional}</text>
        <path d="M641 257C724 213 807 180 908 153" />
        <circle cx="921" cy="150" r="7" />
        <text className={styles.conditionLabel} x="806" y="127">{labels.carbon}</text>
        <text className={styles.conditionNote} x="806" y="159">{labels.conditional}</text>
      </g>
      <g className={styles.conditionSecond} data-visible={visible(beat, 1)}>
        <path d="M438 432C358 475 276 510 174 535" />
        <circle cx="161" cy="538" r="7" />
        <text className={styles.conditionLabel} x="68" y="519">{labels.water}</text>
        <text className={styles.conditionNote} x="68" y="551">{labels.conditional}</text>
        <path d="M642 432C722 475 804 510 906 535" />
        <circle cx="919" cy="538" r="7" />
        <text className={styles.conditionLabel} x="792" y="519">{labels.air}</text>
        <text className={styles.conditionNote} x="792" y="551">{labels.conditional}</text>
      </g>
      <text className={styles.centerConditionLabel} x="540" y="476" textAnchor="middle">{labels.center}</text>
    </svg>
  );
}

function SpecimenConclusion({ language }: { language: Language }) {
  return (
    <div className={styles.conclusionMount}>
      <WholeLeaf closing />
      <div className={styles.conclusionLabel}>
        <span>{language === "zh" ? "交换记录" : "EXCHANGE RECORD"}</span>
        <strong>{language === "zh" ? "碳进入 / 水蒸气离开" : "CARBON IN / WATER VAPOR OUT"}</strong>
        <i>Stoma · from Greek stóma, “mouth”</i>
      </div>
    </div>
  );
}

function SceneVisual({
  sceneId,
  beat,
  language,
}: {
  sceneId: SceneId;
  beat: number;
  language: Language;
}) {
  if (sceneId === 1) return <WholeLeaf />;
  if (sceneId === 2) return <EpidermisField beat={beat} />;
  if (sceneId === 3) return <StomataCutaway beat={beat} language={language} />;
  if (sceneId === 4) return <ConditionsPlate beat={beat} language={language} />;
  return <SpecimenConclusion language={language} />;
}

function BeatRegister({ copy, beat }: { copy: SceneCopy; beat: number }) {
  return (
    <ol className={styles.beatRegister} aria-label="Figure observations" data-beat-layout-item="true">
      {copy.beats.map((item, index) => (
        <li
          key={item.marker}
          data-visible={visible(beat, index)}
          data-current={beat === index ? "true" : undefined}
          data-beat-layout-item="true"
        >
          <span>{String(index + 1).padStart(2, "0")}</span>
          <div>
            <strong>{item.title}</strong>
            <p>{item.body}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

function ScenePanel({
  sceneId,
  beat,
  language,
}: {
  sceneId: SceneId;
  beat: number;
  language: Language;
}) {
  const safeBeat = normalizeBeat(sceneId, beat);
  const copy = COPY[sceneId][language];
  return (
    <section
      className={cx(styles.scene, styles[`scene${sceneId}`])}
      data-composition={COMPOSITIONS[sceneId]}
    >
      <header className={styles.plateHeader} data-beat-layout-item="true">
        <span>{copy.plate}</span>
        <i>{copy.figure}</i>
        <span>{String(sceneId).padStart(2, "0")} / 05</span>
      </header>

      <div className={styles.titleBlock} data-beat-layout-item="true">
        <span>{copy.sceneName}</span>
        <h1>{copy.title}</h1>
        <p>{copy.subtitle}</p>
      </div>

      <figure className={styles.figure} data-beat-layout-item="true">
        <SceneVisual sceneId={sceneId} beat={safeBeat} language={language} />
        <figcaption>
          <span>{copy.beats[safeBeat].marker}</span>
          <span>{copy.evidence}</span>
        </figcaption>
      </figure>

      <aside className={styles.observations} data-beat-layout-item="true">
        <span className={styles.observationLabel}>
          {language === "zh" ? "观察记录" : "OBSERVATION REGISTER"}
        </span>
        <BeatRegister copy={copy} beat={safeBeat} />
      </aside>

      <footer className={styles.plateFooter} data-beat-layout-item="true">
        <span>Original diagram · explanatory, not to scale</span>
        <span>Leaf Stomata · {copy.beats[safeBeat].marker}</span>
      </footer>
    </section>
  );
}

const LENS_POSITIONS: Record<SceneId, { x: string; y: string }> = {
  1: { x: "15cqw", y: "22cqh" },
  2: { x: "31cqw", y: "53cqh" },
  3: { x: "50cqw", y: "33cqh" },
  4: { x: "69cqw", y: "55cqh" },
  5: { x: "84cqw", y: "23cqh" },
};

function SpecimenNavigation({
  scene,
  language,
  onNavigate,
}: {
  scene: SceneId;
  language: Language;
  onNavigate?: (scene: number, beat: number) => void;
}) {
  const [dragging, setDragging] = useState(false);
  const lastScrubScene = useRef<SceneId>(scene);
  const go = useCallback(
    (target: SceneId) => {
      lastScrubScene.current = target;
      onNavigate?.(target, 0);
    },
    [onNavigate],
  );
  const sceneFromPointer = useCallback(
    (event: ReactPointerEvent<HTMLElement>): SceneId => {
      const rect = event.currentTarget.getBoundingClientRect();
      const width = rect.width || 1;
      const fraction = Math.max(0, Math.min(1, (event.clientX - rect.left) / width));
      return Math.min(5, Math.floor(fraction * 5) + 1) as SceneId;
    },
    [],
  );
  const handlePointerDown = useCallback(
    (event: ReactPointerEvent<HTMLElement>) => {
      event.preventDefault();
      event.stopPropagation();
      setDragging(true);
      go(sceneFromPointer(event));
    },
    [go, sceneFromPointer],
  );
  const handlePointerMove = useCallback(
    (event: ReactPointerEvent<HTMLElement>) => {
      if (!dragging) return;
      event.preventDefault();
      event.stopPropagation();
      const target = sceneFromPointer(event);
      if (target !== lastScrubScene.current) go(target);
    },
    [dragging, go, sceneFromPointer],
  );
  const handlePointerUp = useCallback(
    (event: ReactPointerEvent<HTMLElement>) => {
      if (!dragging) return;
      event.preventDefault();
      event.stopPropagation();
      const target = sceneFromPointer(event);
      if (target !== lastScrubScene.current) go(target);
      setDragging(false);
    },
    [dragging, go, sceneFromPointer],
  );
  const handleKeyDown = useCallback(
    (event: ReactKeyboardEvent<HTMLButtonElement>, fromScene: SceneId) => {
      let target: SceneId | undefined;
      if (event.key === "ArrowRight" || event.key === "ArrowDown") {
        target = Math.min(5, fromScene + 1) as SceneId;
      } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
        target = Math.max(1, fromScene - 1) as SceneId;
      } else if (event.key === "Home") {
        target = 1;
      } else if (event.key === "End") {
        target = 5;
      }
      if (!target) return;
      event.preventDefault();
      event.stopPropagation();
      go(target);
    },
    [go],
  );
  const lens = LENS_POSITIONS[scene];
  const navStyle = {
    "--lens-x": lens.x,
    "--lens-y": lens.y,
  } as CSSProperties;

  return (
    <nav
      className={styles.specimenNavigation}
      aria-label={language === "zh" ? "标本位置导航" : "Specimen position navigation"}
      data-topic-navigation="true"
      data-navigation-geometry="ambient"
      data-navigation-carrier="specimen-registration-marks"
      data-navigation-invocation="drag-scrub"
      data-navigation-feedback="geometry-reflow"
      data-magnifier-scene={scene}
      data-dragging={dragging ? "true" : undefined}
      style={navStyle}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={() => setDragging(false)}
    >
      <div className={styles.magnifierFrame} aria-hidden="true">
        <span />
      </div>
      <div className={styles.scrubRail} aria-hidden="true">
        <span>{language === "zh" ? "拖动观察框" : "DRAG INSPECTION FRAME"}</span>
      </div>
      {SCENE_IDS.map((target) => (
        <button
          key={target}
          type="button"
          className={styles.registrationMark}
          data-position={target}
          data-active={target === scene ? "true" : "false"}
          aria-current={target === scene ? "step" : undefined}
          aria-label={
            language === "zh"
              ? `观察标本位置 ${target}：${NAV_LABELS.zh[target]}`
              : `Inspect specimen position ${target}: ${NAV_LABELS.en[target]}`
          }
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            go(target);
          }}
          onKeyDown={(event) => handleKeyDown(event, target)}
        >
          <span aria-hidden="true" />
          <b>{String(target).padStart(2, "0")}</b>
        </button>
      ))}
    </nav>
  );
}

export default function LeafStomata({
  scene,
  beat,
  language,
  isThumbnail,
  reducedMotion,
  onNavigate,
}: BespokeStyleProps) {
  const activeScene = normalizeScene(scene);
  const motionOff = reducedMotion || isThumbnail;
  return (
    <div
      className={cx(styles.root, motionOff && styles.frozen)}
      data-topic="leaf-stomata"
      data-frozen={motionOff ? "true" : "false"}
    >
      <div className={styles.paperGrain} aria-hidden="true" />
      <SpatialSceneTrack
        scene={activeScene}
        beat={beat}
        transitionKind={INCOMING_TRANSITION_KIND[activeScene]}
        transitionMap={TRANSITION_MAP}
        transitionDurationMs={620}
        reducedMotion={motionOff}
        beatLayoutModes={BEAT_LAYOUT_MODES}
        renderScene={(sceneId, sceneBeat) => (
          <ScenePanel
            sceneId={normalizeScene(sceneId)}
            beat={sceneBeat}
            language={language}
          />
        )}
      />
      {!isThumbnail && (
        <SpecimenNavigation
          scene={activeScene}
          language={language}
          onNavigate={onNavigate}
        />
      )}
    </div>
  );
}

export const leafStomataTopic = defineStyleTopic({
  id: "leaf-stomata",
  topic: { en: "Leaf Stomata", zh: "叶片气孔" },
  model: "GPT-5.5",
  component: LeafStomata,
  getMetadata,
  navigation: {
    geometry: "ambient",
    carrier: "specimen-registration-marks",
    invocation: "drag-scrub",
    feedback: "geometry-reflow",
  },
  sources: LEAF_STOMATA_SOURCES,
  transitionScore: LEAF_STOMATA_TRANSITION_SCORE,
});

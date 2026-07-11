import { useEffect, useState, type KeyboardEvent, type MouseEvent } from "react";
import type {
  BespokeStyleProps,
  StyleMetadata,
  TopicSource,
  TopicTransitionScore,
} from "../types";
import SpatialSceneTrack, {
  type BeatLayoutMode,
  type SceneTransitionMap,
} from "./SpatialSceneTrack";
import { defineStyleTopic } from "./topic";
import styles from "./scholars-vellum-hidden-text.module.css";

type Language = "en" | "zh";
type SceneId = 1 | 2 | 3 | 4 | 5;
type SourceId = "S1" | "S2" | "S3" | "S4" | "S5" | "S6";
type SpectralMethod = "visible" | "ultraviolet" | "pseudocolor" | "xrf";

interface BeatCopy {
  id: number;
  action: string;
  title: string;
  body: string;
}

interface SceneCopy {
  tab: string;
  folio: string;
  eyebrow: string;
  title: string;
  deck: string;
  pin: string;
  beats: BeatCopy[];
}

interface LocalizedCopy {
  caseFile: string;
  scope: string;
  schematic: string;
  scenes: Record<SceneId, SceneCopy>;
  folio: {
    overtext: string;
    undertext: string;
    direction: string;
    date: string;
    trace: string;
  };
  cutaway: {
    legend: string;
    layers: Array<{
      index: string;
      name: string;
      note: string;
      phase: 0 | 1;
    }>;
    readings: [string, string];
  };
  spectral: {
    coordinate: string;
    panels: Array<{
      method: SpectralMethod;
      index: string;
      label: string;
      result: string;
      boundary: string;
    }>;
    readings: [string, string, string, string];
  };
  interpretation: {
    imageLabel: string;
    imageTitle: string;
    imageSteps: string[];
    readingLabel: string;
    readingTitle: string;
    readingSteps: string[];
    boundary: string;
    qualifier: string;
  };
  close: {
    glyphLabel: string;
    glyph: string;
    glyphScope: string;
    sourceLabel: string;
    source: string;
    unresolvedLabel: string;
    unresolved: string;
    closing: string;
  };
  navigation: {
    label: string;
    expand: string;
    collapse: string;
    open: string;
  };
}

const SCENE_IDS = [1, 2, 3, 4, 5] as const;

export const hiddenTextTransitionScore = {
  "1->2": "hard-cut",
  "2->3": "page-turn",
  "3->4": "crossfade",
  "4->5": "hard-cut",
} satisfies TopicTransitionScore;

const TRANSITION_MAP: SceneTransitionMap = hiddenTextTransitionScore;

const BEAT_LAYOUT_MODES = {
  2: "reserved",
  3: "reserved",
  4: "reserved",
} satisfies Partial<Record<SceneId, BeatLayoutMode>>;

export const hiddenTextSources = [
  {
    id: "S1",
    authority: "The Archimedes Palimpsest Project / The Walters Art Museum",
    title: "About the Archimedes Palimpsest",
    citation:
      "Archimedes Palimpsest Project. About the Archimedes Palimpsest: contents, manufacture, and reused parchment structure.",
    url: "https://www.archimedespalimpsest.org/about/",
    supports:
      "Documents the April 1229 Greek euchologion, its 174 folios, the tenth-century Archimedes manuscript reused for most leaves, and the cutting, ninety-degree rotation, scraping, and refolding that put undertext across the prayer-book writing.",
  },
  {
    id: "S2",
    authority: "The Archimedes Palimpsest Project / The Walters Art Museum",
    title: "The Conservation of the Archimedes Palimpsest",
    citation:
      "Quandt, Abigail, and the Archimedes Palimpsest Project. Conservation record for disbinding and imaging preparation.",
    url: "https://www.archimedespalimpsest.org/about/conservation.php",
    supports:
      "Explains that safety came before legibility; records disbinding, parchment collagen and mold damage, wax and modern adhesive removal, fragile gutters, forged paintings, support papers, and double-sided conservation frames.",
  },
  {
    id: "S3",
    authority: "The Archimedes Palimpsest Project imaging team",
    title: "Capturing Images of the Archimedes Palimpsest",
    citation:
      "Easton, Roger, Knox, Keith, Christens-Barry, William, et al. Capture workflow for the Archimedes Palimpsest.",
    url: "https://www.archimedespalimpsest.org/about/imaging/capture.php",
    supports:
      "Describes controlled capture with ultraviolet, tungsten, and strobe illumination, high-resolution section imaging, an X-Y stage, stitching, and metadata logging across nearly ninety leaves imaged on both sides.",
  },
  {
    id: "S4",
    authority: "The Archimedes Palimpsest Project imaging team",
    title: "Multi-Spectral Imaging of the Archimedes Palimpsest",
    citation:
      "Easton, Roger. Overview of multispectral capture, registration, algorithms, and scholarly requirements for the Palimpsest.",
    url: "https://www.archimedespalimpsest.org/about/imaging/",
    supports:
      "Defines multispectral imaging as a registered stack of photographs made under different wavelengths and explains how algorithms enhance ink signatures; also records blur, registration artifacts, resolution limits, and scholar feedback on early processing.",
  },
  {
    id: "S5",
    authority: "The Archimedes Palimpsest Project imaging team",
    title: "Image Processing of the Archimedes Palimpsest",
    citation:
      "Knox, Keith, and collaborators. Pseudocolor processing and ink-separation notes for the Archimedes Palimpsest.",
    url: "https://www.archimedespalimpsest.org/about/imaging/processing.php",
    supports:
      "Explains that ultraviolet was especially useful for iron-rich ink, that pseudocolor combined information from several images, and that processed outputs could emphasize undertext or diagrams without becoming a self-interpreting transcription.",
  },
  {
    id: "S6",
    authority: "SLAC National Accelerator Laboratory / Stanford Synchrotron Radiation Lightsource",
    title: "Illuminating the Archimedes Palimpsest with X-rays",
    citation:
      "SLAC. Imaging with X-Rays: synchrotron X-ray fluorescence imaging of the Archimedes Palimpsest, updated July 28, 2006.",
    url: "https://www.slac.stanford.edu/gen/com/slac_xrayimaging.html",
    supports:
      "Describes X-ray fluorescence mapping of iron remaining in the inks, the tuned beam and raster scan, its use on difficult leaves and painted-over areas, and the scholars who compare elemental maps with other evidence to decipher letters.",
  },
] as const satisfies readonly (TopicSource & { id: SourceId })[];

export const hiddenTextClaims = [
  {
    id: "C1",
    sourceIds: ["S1"] as const,
    claim:
      "The visible manuscript is a 1229 prayer book made from older parchment leaves, including a tenth-century copy of works by Archimedes.",
    boundary:
      "This Topic follows the Archimedes leaves only; the bound manuscript also contains erased texts by other authors and from other books.",
  },
  {
    id: "C2",
    sourceIds: ["S1", "S2"] as const,
    claim:
      "Cutting, rotation, scraping, refolding, later use, damage, wax, adhesive, and forged paintings left a materially layered object rather than a clean hidden page.",
    boundary:
      "The cutaway is a schematic explanatory section, not a measured cross-section of one named folio or a reconstruction of every treatment event.",
  },
  {
    id: "C3",
    sourceIds: ["S3", "S4", "S5"] as const,
    claim:
      "Registered images under different illumination can be combined or processed to increase the contrast between parchment, overtext, and undertext signatures.",
    boundary:
      "Pseudocolor is a computed representation with registration and artifact risks; it is not a literal color photograph of the erased manuscript.",
  },
  {
    id: "C4",
    sourceIds: ["S6"] as const,
    claim:
      "X-ray fluorescence maps elemental signals such as iron from ink remnants and can help on areas where optical approaches struggle.",
    boundary:
      "An elemental map can contain signal from both writing layers and later deposits; it does not identify words or authorship by itself.",
  },
  {
    id: "C5",
    sourceIds: ["S4", "S5", "S6"] as const,
    claim:
      "Scholars compare processed images, elemental maps, letterforms, diagrams, language, and context to propose a transcription.",
    boundary:
      "Improved visibility narrows uncertainty, but damaged fibers, overlapping inks, abbreviations, and gaps can remain unresolved and should stay marked.",
  },
] as const;

const COPY: Record<Language, LocalizedCopy> = {
  en: {
    caseFile: "PALIMPSEST CASE / ARCHIMEDES",
    scope: "surface · residue · signal · reading",
    schematic: "SCHEMATIC EVIDENCE PLATE — NOT A FACSIMILE",
    scenes: {
      1: {
        tab: "Folio",
        folio: "folio i",
        eyebrow: "01 / THE VISIBLE BOOK",
        title: "A prayer book is the visible book.",
        deck:
          "At right angles, erased traces of a tenth-century Archimedes manuscript remain in the same parchment.",
        pin: "surface first",
        beats: [
          {
            id: 0,
            action: "Hold on the prayer-book surface and the faint perpendicular undertext.",
            title: "The visible book",
            body: "The overtext is read first; the erased writing survives as material trace.",
          },
        ],
      },
      2: {
        tab: "Layers",
        folio: "folio ii",
        eyebrow: "02 / MATERIAL CUTAWAY",
        title: "One leaf, five interventions.",
        deck:
          "Legibility begins with the object: collagen, ink residue, abrasion, overtext, and later deposits occupy one fragile support.",
        pin: "object before image",
        beats: [
          {
            id: 0,
            action: "Focus the parchment support and residual undertext ink.",
            title: "Support and residue",
            body: "The earlier writing persists as stains and particles in animal-skin parchment.",
          },
          {
            id: 1,
            action: "Focus the scraped surface, prayer-book ink, and later deposits.",
            title: "Reuse and obstruction",
            body: "Conservation stabilizes and exposes the material before imaging can ask for contrast.",
          },
        ],
      },
      3: {
        tab: "Signals",
        folio: "folio iii",
        eyebrow: "03 / SAME COORDINATES, DIFFERENT SIGNALS",
        title: "No single wavelength reads the page.",
        deck:
          "Four views hold the same geometry. Each method changes what becomes measurable, not what the manuscript once was.",
        pin: "focus, never spectacle",
        beats: [
          {
            id: 0,
            action: "Focus the visible-light record.",
            title: "Visible light",
            body: "The prayer-book hand and surface condition dominate ordinary viewing.",
          },
          {
            id: 1,
            action: "Focus ultraviolet evidence.",
            title: "Ultraviolet",
            body: "Iron-rich traces can gain contrast under ultraviolet illumination.",
          },
          {
            id: 2,
            action: "Focus a registered pseudocolor separation.",
            title: "Pseudocolor",
            body: "Several captured bands are registered and computed into a legibility aid.",
          },
          {
            id: 3,
            action: "Focus the X-ray fluorescence iron map.",
            title: "XRF iron map",
            body: "Elemental signal is rastered point by point; words still require scholarship.",
          },
        ],
      },
      4: {
        tab: "Reading",
        folio: "folio iv",
        eyebrow: "04 / OUTPUT IS NOT INTERPRETATION",
        title: "An image reveals contrast. A scholar proposes text.",
        deck:
          "Capture and processing produce evidence. Transcription adds paleography, language, diagrams, comparison, and explicit uncertainty.",
        pin: "keep the gap visible",
        beats: [
          {
            id: 0,
            action: "Focus the measured and processed image outputs.",
            title: "Image evidence",
            body: "Registered pixels and elemental maps expose contrast and signal.",
          },
          {
            id: 1,
            action: "Focus the bounded scholarly transcription step.",
            title: "Interpretive reading",
            body: "Letters, abbreviations, words, and mathematical sense are argued—not auto-recovered.",
          },
        ],
      },
      5: {
        tab: "Record",
        folio: "folio v",
        eyebrow: "05 / BOUNDED RECOVERY",
        title: "A readable letter is evidence, not certainty.",
        deck:
          "Every recovered form stays attached to its image, source record, transcription decision, and unresolved gaps.",
        pin: "leave lacunae open",
        beats: [
          {
            id: 0,
            action: "Close on one representative letterform, a source record, and a marked lacuna.",
            title: "Bounded recovery",
            body: "The page yields a traceable reading, not a magical original.",
          },
        ],
      },
    },
    folio: {
      overtext: "Greek euchologion · visible overtext",
      undertext: "erased mathematical hand · undertext trace",
      direction: "undertext runs at 90°",
      date: "prayer book completed · 13 APR 1229",
      trace: "tenth-century Archimedes copy · residual ink",
    },
    cutaway: {
      legend: "EXPLANATORY SECTION / NOT TO SCALE",
      layers: [
        { index: "05", name: "Later paint, wax, residues", note: "obstruction and damage", phase: 1 },
        { index: "04", name: "Prayer-book ink", note: "visible Greek overtext · 1229", phase: 1 },
        { index: "03", name: "Scraped / washed surface", note: "reuse altered the skin", phase: 1 },
        { index: "02", name: "Residual undertext ink", note: "faint iron-rich traces", phase: 0 },
        { index: "01", name: "Parchment collagen", note: "fragile animal-skin support", phase: 0 },
      ],
      readings: [
        "Erasure removed legibility more successfully than material residue.",
        "Conservation separates safe access from any promise of readability.",
      ],
    },
    spectral: {
      coordinate: "registered coordinate / identical crop",
      panels: [
        {
          method: "visible",
          index: "λ 01",
          label: "VISIBLE / RGB",
          result: "Overtext dominates",
          boundary: "surface record",
        },
        {
          method: "ultraviolet",
          index: "λ 02",
          label: "ULTRAVIOLET",
          result: "Faint ink gains contrast",
          boundary: "optical response",
        },
        {
          method: "pseudocolor",
          index: "ƒ 03",
          label: "PSEUDOCOLOR",
          result: "Signatures separated",
          boundary: "computed representation",
        },
        {
          method: "xrf",
          index: "Fe 04",
          label: "XRF / IRON MAP",
          result: "Elemental signal mapped",
          boundary: "not a transcription",
        },
      ],
      readings: [
        "Visible light records the actual surface; faint perpendicular traces may remain hard to distinguish.",
        "Ultraviolet can increase contrast for iron-rich ink, but the result still contains both writing systems and damage.",
        "Pseudocolor combines registered captures to separate signatures. Its colors encode processing choices, not original pigment color.",
        "XRF maps iron signal through difficult regions. Where inks overlap, stronger signal still does not choose a letter or word.",
      ],
    },
    interpretation: {
      imageLabel: "STEP A / MEASURE + PROCESS",
      imageTitle: "Evidence image",
      imageSteps: [
        "Capture aligned wavebands",
        "Register and combine signals",
        "Map contrast or elemental intensity",
      ],
      readingLabel: "STEP B / READ + ARGUE",
      readingTitle: "Scholarly interpretation",
      readingSteps: [
        "Propose letterforms and abbreviations",
        "Test words against language and context",
        "Keep damaged or ambiguous spans unresolved",
      ],
      boundary:
        "Better visibility narrows uncertainty. It does not transcribe the manuscript by itself.",
      qualifier: "image ≠ transcription · contrast ≠ meaning",
    },
    close: {
      glyphLabel: "REPRESENTATIVE GREEK LETTERFORM",
      glyph: "Α",
      glyphScope: "visual marker · not a quotation from a named folio",
      sourceLabel: "SOURCE RECORD",
      source:
        "Raw captures, processed views, metadata, and published transcriptions remain linked in the project archive.",
      unresolvedLabel: "UNRESOLVED REGION",
      unresolved: "[ damaged fiber · overlapping ink · lacuna ]",
      closing: "Recovered where legible. Marked where not.",
    },
    navigation: {
      label: "Folio layers",
      expand: "Expand folio index",
      collapse: "Collapse folio index",
      open: "Open folio layer",
    },
  },
  zh: {
    caseFile: "重写羊皮卷档案 / 阿基米德",
    scope: "表层 · 残留 · 信号 · 释读",
    schematic: "示意证据图版——不是原页摹本",
    scenes: {
      1: {
        tab: "书页",
        folio: "叶 i",
        eyebrow: "01 / 看得见的书",
        title: "眼前首先是一册祈祷书。",
        deck: "与它垂直的方向上，十世纪阿基米德抄本被擦除后的痕迹仍留在同一张羊皮纸里。",
        pin: "先看表层",
        beats: [
          {
            id: 0,
            action: "停在祈祷文表层与几乎不可见的垂直底文上。",
            title: "看得见的书",
            body: "上层文字首先被读到；被擦除的文字以材料残迹继续存在。",
          },
        ],
      },
      2: {
        tab: "分层",
        folio: "叶 ii",
        eyebrow: "02 / 材料剖面",
        title: "一张书页，五次介入。",
        deck: "胶原、残墨、刮洗表面、祈祷文与后期沉积物共处在一张脆弱的载体上。",
        pin: "先对象，后图像",
        beats: [
          {
            id: 0,
            action: "聚焦羊皮纸载体与底层残墨。",
            title: "载体与残留",
            body: "早期书写以污迹和颗粒残存在动物皮制羊皮纸中。",
          },
          {
            id: 1,
            action: "聚焦刮洗表面、祈祷文墨迹与后期沉积。",
            title: "再利用与遮挡",
            body: "修复先稳定并开放材料，成像才有条件追问信号对比。",
          },
        ],
      },
      3: {
        tab: "信号",
        folio: "叶 iii",
        eyebrow: "03 / 同一坐标，不同信号",
        title: "没有一种波长能独自读完书页。",
        deck: "四个视图保持相同几何位置。每种方法改变可测量的信号，而不是把原稿变回来。",
        pin: "只移焦点，不做奇观",
        beats: [
          {
            id: 0,
            action: "聚焦可见光记录。",
            title: "可见光",
            body: "普通观察首先看到祈祷文书写与书页表面状况。",
          },
          {
            id: 1,
            action: "聚焦紫外证据。",
            title: "紫外光",
            body: "富含铁的微弱墨迹在紫外照明下可能获得更强对比。",
          },
          {
            id: 2,
            action: "聚焦配准后的伪彩色分离结果。",
            title: "伪彩色",
            body: "多条成像波段先配准，再计算成帮助阅读的表示。",
          },
          {
            id: 3,
            action: "聚焦 X 射线荧光铁元素图。",
            title: "XRF 铁元素图",
            body: "元素信号逐点扫描；词句依旧需要学者释读。",
          },
        ],
      },
      4: {
        tab: "释读",
        folio: "叶 iv",
        eyebrow: "04 / 输出不等于解释",
        title: "图像显出对比，学者提出文本。",
        deck: "采集与处理产出证据；转写还要加入古文字、语言、图形、比对与明确的不确定性。",
        pin: "让间隙保持可见",
        beats: [
          {
            id: 0,
            action: "聚焦测量与处理后的图像输出。",
            title: "图像证据",
            body: "配准像素与元素图呈现对比和信号。",
          },
          {
            id: 1,
            action: "聚焦有边界的学术转写步骤。",
            title: "解释性阅读",
            body: "字形、缩写、词句和数学语义来自论证，不是自动复原。",
          },
        ],
      },
      5: {
        tab: "记录",
        folio: "叶 v",
        eyebrow: "05 / 有边界的复原",
        title: "一个可读字形是证据，不是确定性。",
        deck: "每个复原字形都应继续连接到图像、来源记录、转写判断与未解决缺口。",
        pin: "空缺继续留空",
        beats: [
          {
            id: 0,
            action: "以一个代表性字形、一条来源记录与一个明确缺口收束。",
            title: "有边界的复原",
            body: "书页给出可追溯的释读，而不是魔法般的原稿。",
          },
        ],
      },
    },
    folio: {
      overtext: "希腊礼仪祈祷文 · 可见上层文字",
      undertext: "被擦除的数学抄本 · 底层残迹",
      direction: "底文与上层文字垂直",
      date: "祈祷书完成于 · 1229 年 4 月 13 日",
      trace: "十世纪阿基米德抄本 · 残余墨迹",
    },
    cutaway: {
      legend: "解释性剖面 / 不按比例",
      layers: [
        { index: "05", name: "后期绘画、蜡与残留物", note: "遮挡与损伤", phase: 1 },
        { index: "04", name: "祈祷书墨迹", note: "1229 年可见希腊文", phase: 1 },
        { index: "03", name: "刮洗过的表面", note: "再利用改变了皮面", phase: 1 },
        { index: "02", name: "底层残余墨迹", note: "微弱、富含铁的痕迹", phase: 0 },
        { index: "01", name: "羊皮纸胶原", note: "脆弱的动物皮载体", phase: 0 },
      ],
      readings: [
        "擦除比清除材料残留更成功地清除了可读性。",
        "修复工作的目标是安全开放材料，而不是保证文字一定可读。",
      ],
    },
    spectral: {
      coordinate: "配准坐标 / 相同裁切",
      panels: [
        { method: "visible", index: "λ 01", label: "可见光 / RGB", result: "上层文字占主导", boundary: "表面记录" },
        { method: "ultraviolet", index: "λ 02", label: "紫外光", result: "微弱墨迹对比增强", boundary: "光学响应" },
        { method: "pseudocolor", index: "ƒ 03", label: "伪彩色", result: "光谱特征被分离", boundary: "计算表示" },
        { method: "xrf", index: "Fe 04", label: "XRF / 铁元素图", result: "元素信号被映射", boundary: "不是转写" },
      ],
      readings: [
        "可见光记录真实表面；垂直的微弱痕迹仍可能难以区分。",
        "紫外光能提高富铁墨迹的对比，但结果仍混合两层书写与损伤。",
        "伪彩色把配准后的多次采集合并以分离特征；颜色编码处理选择，不是原始颜料色。",
        "XRF 穿过困难区域映射铁信号；墨迹重叠时，更强信号仍不能自动选择字母或词。",
      ],
    },
    interpretation: {
      imageLabel: "步骤 A / 测量与处理",
      imageTitle: "证据图像",
      imageSteps: ["采集对齐波段", "配准并组合信号", "映射对比或元素强度"],
      readingLabel: "步骤 B / 阅读与论证",
      readingTitle: "学术释读",
      readingSteps: ["提出字形与缩写", "用语言和语境检验词句", "让损坏或歧义片段保持未决"],
      boundary: "更好的可见度会缩小不确定性，但不会自行转写手稿。",
      qualifier: "图像 ≠ 转写 · 对比 ≠ 意义",
    },
    close: {
      glyphLabel: "代表性希腊字形",
      glyph: "Α",
      glyphScope: "视觉标记 · 不是某一指定书页的原文引用",
      sourceLabel: "来源记录",
      source: "原始采集、处理视图、元数据与已出版转写在项目档案中保持关联。",
      unresolvedLabel: "未解决区域",
      unresolved: "[ 纤维损坏 · 墨迹重叠 · 空缺 ]",
      closing: "可读处复原，不可读处标明。",
    },
    navigation: {
      label: "书页分层",
      expand: "展开书页索引",
      collapse: "收起书页索引",
      open: "打开书页层",
    },
  },
};

function useFonts() {
  useEffect(() => {
    const id = "scholars-vellum-hidden-text-fonts";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@1,500;1,600&family=JetBrains+Mono:wght@400;500&family=Noto+Sans+SC:wght@400;500&family=Noto+Serif+SC:wght@500;600&family=Source+Sans+3:wght@400;500&display=swap";
    document.head.appendChild(link);
  }, []);
}

function clampScene(scene: number): SceneId {
  return (SCENE_IDS.includes(scene as SceneId) ? scene : 1) as SceneId;
}

function clampBeat(copy: LocalizedCopy, scene: SceneId, beat: number): number {
  return Math.max(0, Math.min(beat, copy.scenes[scene].beats.length - 1));
}

function SourceRef({ ids }: { ids: readonly SourceId[] }) {
  return (
    <span className={styles.sourceRef} data-source-ref="true">
      {ids.join(" · ")}
    </span>
  );
}

function SceneHeader({ copy }: { copy: SceneCopy }) {
  return (
    <header className={styles.sceneHeader}>
      <div>
        <span>{copy.eyebrow}</span>
        <b>{copy.folio}</b>
      </div>
      <h1>{copy.title}</h1>
      <p>{copy.deck}</p>
    </header>
  );
}

function PinNote({ scene, copy }: { scene: SceneId; copy: SceneCopy }) {
  return (
    <aside className={styles.pinNote} aria-label={copy.pin}>
      <b>{String(scene).padStart(2, "0")}</b>
      <span>{copy.pin}</span>
    </aside>
  );
}

function InkLines({ orientation }: { orientation: "over" | "under" }) {
  return (
    <div className={orientation === "over" ? styles.overInk : styles.underInk} aria-hidden="true">
      {Array.from({ length: orientation === "over" ? 10 : 8 }, (_, index) => (
        <i key={index} data-line={index % 4} />
      ))}
    </div>
  );
}

function FolioScene({ copy }: { copy: LocalizedCopy }) {
  const sceneCopy = copy.scenes[1];
  return (
    <article className={styles.scene} data-scene-id="1" data-beat="0">
      <div className={styles.folioLead}>
        <SceneHeader copy={sceneCopy} />
        <div className={styles.folioFacts}>
          <span>{copy.folio.date}</span>
          <span>{copy.folio.trace}</span>
          <SourceRef ids={["S1"]} />
        </div>
      </div>
      <figure className={styles.folioPlate}>
        <div className={styles.folioPage}>
          <InkLines orientation="over" />
          <InkLines orientation="under" />
          <span className={styles.overLabel}>{copy.folio.overtext}</span>
          <span className={styles.underLabel}>{copy.folio.undertext}</span>
          <b className={styles.directionMark}>{copy.folio.direction}</b>
        </div>
        <figcaption>{copy.schematic}</figcaption>
      </figure>
      <PinNote scene={1} copy={sceneCopy} />
    </article>
  );
}

function CutawayScene({ copy, beat }: { copy: LocalizedCopy; beat: number }) {
  const sceneCopy = copy.scenes[2];
  return (
    <article className={styles.scene} data-scene-id="2" data-beat={beat}>
      <div className={styles.cutawayLead} data-beat-layout-item="true">
        <SceneHeader copy={sceneCopy} />
        <p className={styles.cutawayReading}>{copy.cutaway.readings[beat]}</p>
        <SourceRef ids={["S1", "S2"]} />
      </div>
      <figure className={styles.cutawayFigure} data-beat-layout-item="true">
        <figcaption>{copy.cutaway.legend}</figcaption>
        <div className={styles.layerStack}>
          {copy.cutaway.layers.map((layer) => (
            <div
              key={layer.index}
              className={styles.materialLayer}
              data-layer={layer.index}
              data-focused={layer.phase === beat ? "true" : "false"}
              data-beat-layout-item="true"
            >
              <b>{layer.index}</b>
              <strong>{layer.name}</strong>
              <span>{layer.note}</span>
            </div>
          ))}
        </div>
        <p>{copy.schematic}</p>
      </figure>
      <PinNote scene={2} copy={sceneCopy} />
    </article>
  );
}

function SpectralFolio({ method }: { method: SpectralMethod }) {
  return (
    <svg viewBox="0 0 260 160" role="img" aria-label={`${method} schematic folio signal`}>
      <rect className={styles.spectralPage} x="8" y="8" width="244" height="144" />
      <g className={styles.spectralOvertext}>
        <path d="M29 34 H230 M22 54 H219 M36 74 H239 M25 94 H218 M41 114 H235 M27 134 H202" />
      </g>
      <g className={styles.spectralUndertext}>
        <path d="M70 18 V144 M92 27 V137 M114 16 V146 M136 32 V137 M158 19 V143 M180 29 V139" />
        <circle cx="116" cy="80" r="33" />
        <path d="M92 105 L143 51 M92 51 L143 105" />
      </g>
      <g className={styles.xrfDots}>
        {Array.from({ length: 18 }, (_, index) => (
          <circle
            key={index}
            cx={34 + ((index * 41) % 188)}
            cy={26 + ((index * 29) % 108)}
            r={index % 3 === 0 ? 2.4 : 1.5}
          />
        ))}
      </g>
      <path className={styles.registrationMark} d="M14 23 H30 M22 15 V31 M230 137 H246 M238 129 V145" />
    </svg>
  );
}

function SpectralScene({ copy, beat }: { copy: LocalizedCopy; beat: number }) {
  const sceneCopy = copy.scenes[3];
  return (
    <article className={styles.scene} data-scene-id="3" data-beat={beat}>
      <div className={styles.spectralHeader} data-beat-layout-item="true">
        <SceneHeader copy={sceneCopy} />
        <span>{copy.spectral.coordinate}</span>
      </div>
      <div className={styles.spectralGrid} data-beat-layout-item="true">
        {copy.spectral.panels.map((panel, index) => (
          <figure
            key={panel.method}
            className={styles.spectralPanel}
            data-spectral-panel="true"
            data-method={panel.method}
            data-focused={beat === index ? "true" : "false"}
            data-beat-layout-item="true"
          >
            <div className={styles.spectralFigure}>
              <SpectralFolio method={panel.method} />
            </div>
            <figcaption>
              <span>{panel.index}</span>
              <strong>{panel.label}</strong>
              <b>{panel.result}</b>
              <small>{panel.boundary}</small>
            </figcaption>
          </figure>
        ))}
      </div>
      <div className={styles.spectralReading} data-beat-layout-item="true">
        <p>{copy.spectral.readings[beat]}</p>
        <SourceRef ids={beat === 3 ? ["S6"] : beat === 2 ? ["S4", "S5"] : ["S3", "S4"]} />
      </div>
      <PinNote scene={3} copy={sceneCopy} />
    </article>
  );
}

function EvidenceGlyphs() {
  return (
    <div className={styles.evidenceGlyphs} aria-hidden="true">
      <i />
      <i />
      <i />
      <b />
      <b />
      <b />
      <span>?</span>
    </div>
  );
}

function InterpretationScene({ copy, beat }: { copy: LocalizedCopy; beat: number }) {
  const sceneCopy = copy.scenes[4];
  return (
    <article className={styles.scene} data-scene-id="4" data-beat={beat}>
      <div className={styles.interpretationHeader} data-beat-layout-item="true">
        <SceneHeader copy={sceneCopy} />
        <SourceRef ids={["S4", "S5", "S6"]} />
      </div>
      <div className={styles.interpretationSpread} data-beat-layout-item="true">
        <section
          className={styles.evidenceColumn}
          data-evidence-role="image"
          data-focused={beat === 0 ? "true" : "false"}
          data-beat-layout-item="true"
        >
          <span>{copy.interpretation.imageLabel}</span>
          <h2>{copy.interpretation.imageTitle}</h2>
          <EvidenceGlyphs />
          <ol>
            {copy.interpretation.imageSteps.map((step) => <li key={step}>{step}</li>)}
          </ol>
        </section>
        <div className={styles.notEqual} aria-hidden="true">≠</div>
        <section
          className={styles.readingColumn}
          data-evidence-role="interpretation"
          data-focused={beat === 1 ? "true" : "false"}
          data-beat-layout-item="true"
        >
          <span>{copy.interpretation.readingLabel}</span>
          <h2>{copy.interpretation.readingTitle}</h2>
          <div className={styles.readingProof}>
            <b>Α</b><i>·</i><b>?</b><i>·</i><b>[…]</b>
          </div>
          <ol>
            {copy.interpretation.readingSteps.map((step) => <li key={step}>{step}</li>)}
          </ol>
        </section>
      </div>
      <aside
        className={styles.interpretationBoundary}
        data-interpretation-boundary="true"
        data-beat-layout-item="true"
      >
        <strong>{copy.interpretation.boundary}</strong>
        <span>{copy.interpretation.qualifier}</span>
      </aside>
      <PinNote scene={4} copy={sceneCopy} />
    </article>
  );
}

function ClosingScene({ copy }: { copy: LocalizedCopy }) {
  const sceneCopy = copy.scenes[5];
  return (
    <article className={styles.scene} data-scene-id="5" data-beat="0">
      <div className={styles.closingHeader}>
        <SceneHeader copy={sceneCopy} />
        <SourceRef ids={["S1", "S6"]} />
      </div>
      <div className={styles.closingComposition}>
        <figure className={styles.glyphLeaf} data-glyph-scope="representative">
          <figcaption>{copy.close.glyphLabel}</figcaption>
          <b>{copy.close.glyph}</b>
          <span>{copy.close.glyphScope}</span>
        </figure>
        <div className={styles.closingNotes}>
          <section>
            <span>{copy.close.sourceLabel}</span>
            <p>{copy.close.source}</p>
          </section>
          <section className={styles.unresolved}>
            <span>{copy.close.unresolvedLabel}</span>
            <p>{copy.close.unresolved}</p>
          </section>
          <strong>{copy.close.closing}</strong>
        </div>
      </div>
      <PinNote scene={5} copy={sceneCopy} />
    </article>
  );
}

function ScenePanel({
  scene,
  beat,
  copy,
}: {
  scene: number;
  beat: number;
  copy: LocalizedCopy;
}) {
  const sceneId = clampScene(scene);
  const safeBeat = clampBeat(copy, sceneId, beat);
  if (sceneId === 1) return <FolioScene copy={copy} />;
  if (sceneId === 2) return <CutawayScene copy={copy} beat={safeBeat} />;
  if (sceneId === 3) return <SpectralScene copy={copy} beat={safeBeat} />;
  if (sceneId === 4) return <InterpretationScene copy={copy} beat={safeBeat} />;
  return <ClosingScene copy={copy} />;
}

function FolioTabs({
  copy,
  scene,
  onNavigate,
}: {
  copy: LocalizedCopy;
  scene: SceneId;
  onNavigate?: (scene: number, beat: number) => void;
}) {
  const [expanded, setExpanded] = useState(false);

  const navigate = (target: SceneId) => {
    onNavigate?.(target, 0);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    let target: SceneId | null = null;
    if (event.key === "ArrowDown" || event.key === "ArrowRight") {
      target = Math.min(5, scene + 1) as SceneId;
    } else if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
      target = Math.max(1, scene - 1) as SceneId;
    } else if (event.key === "Home") {
      target = 1;
    } else if (event.key === "End") {
      target = 5;
    }
    if (target === null) return;
    event.preventDefault();
    event.stopPropagation();
    if (target !== scene) navigate(target);
  };

  const openScene = (event: MouseEvent<HTMLButtonElement>, target: SceneId) => {
    event.stopPropagation();
    navigate(target);
  };

  return (
    <nav
      className={styles.folioTabs}
      aria-label={copy.navigation.label}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onPointerDown={(event) => event.stopPropagation()}
      data-topic-navigation="true"
      data-navigation-geometry="edge-scale"
      data-navigation-carrier="palimpsest-folio-tabs"
      data-navigation-invocation="click-expand"
      data-navigation-feedback="geometry-reflow"
      data-expanded={expanded ? "true" : "false"}
      data-reflow={expanded ? "five-layer-index" : "book-edge"}
    >
      <button
        type="button"
        className={styles.folioToggle}
        aria-expanded={expanded}
        aria-label={expanded ? copy.navigation.collapse : copy.navigation.expand}
        onClick={(event) => {
          event.stopPropagation();
          setExpanded((value) => !value);
        }}
      >
        <span>{expanded ? "×" : "+"}</span>
        <b>{copy.navigation.label}</b>
      </button>
      <div className={styles.folioTabStack}>
        {SCENE_IDS.map((sceneId) => (
          <button
            key={sceneId}
            type="button"
            className={styles.folioTab}
            aria-current={sceneId === scene ? "page" : undefined}
            aria-label={`${copy.navigation.open} ${sceneId}`}
            data-folio-tab="true"
            data-active={sceneId === scene ? "true" : "false"}
            data-depth={Math.abs(sceneId - scene)}
            onClick={(event) => openScene(event, sceneId)}
          >
            <span>{String(sceneId).padStart(2, "0")}</span>
            <b>{copy.scenes[sceneId].tab}</b>
          </button>
        ))}
      </div>
    </nav>
  );
}

export function getMetadata(language: Language): StyleMetadata {
  const copy = COPY[language];
  return {
    id: "scholars-vellum",
    band: "editorial-print",
    name: language === "zh" ? "学者羊皮卷" : "Scholars' Vellum",
    theme:
      language === "zh"
        ? "文字下面的文字：阿基米德重写羊皮卷的材料、成像与有边界释读"
        : "The text under the text: material, imaging, and bounded reading of the Archimedes Palimpsest",
    densityLabel: language === "zh" ? "编辑阅读 · 中高密度" : "Editorial reading · Medium-high",
    heroScene: 3,
    colors: {
      bg: "#171512",
      ink: "#ead9b4",
      panel: "#cbbb91",
    },
    typography: {
      header: language === "zh" ? "Noto Serif SC 600" : "Cormorant Garamond 600 Italic",
      body: language === "zh" ? "Noto Sans SC 400" : "Source Sans 3 400",
    },
    tags: [
      "scholars-vellum",
      "archimedes-palimpsest",
      "editorial-reading",
      "manuscript-cutaway",
      "multispectral-evidence",
      "source-bounded",
      "restrained-motion",
    ],
    fonts: [
      "Cormorant Garamond",
      "Source Sans 3",
      "JetBrains Mono",
      "cjk:Noto Serif SC",
      "cjk:Noto Sans SC",
    ],
    scenes: SCENE_IDS.map((sceneId) => ({
      id: sceneId,
      title: copy.scenes[sceneId].title,
      beats: copy.scenes[sceneId].beats,
    })),
  };
}

export default function HiddenText({
  scene,
  beat,
  language,
  isThumbnail,
  reducedMotion,
  onNavigate,
}: BespokeStyleProps) {
  useFonts();
  const copy = COPY[language];
  const activeScene = clampScene(scene);
  const safeBeat = clampBeat(copy, activeScene, beat);
  const motionOff = reducedMotion || isThumbnail;

  return (
    <section
      className={`${styles.root} ${motionOff ? styles.motionOff : ""}`}
      data-testid="hidden-text-root"
      data-style-id="scholars-vellum"
      data-topic-id="hidden-text"
      data-topic-origin="curated"
      data-motion={motionOff ? "off" : "restrained"}
      lang={language}
    >
      <header className={styles.caseHeader}>
        <span>{copy.caseFile}</span>
        <b>{copy.scope}</b>
        <i>{copy.schematic}</i>
      </header>
      <main className={styles.canvas}>
        <SpatialSceneTrack
          scene={activeScene}
          beat={safeBeat}
          sceneIds={[...SCENE_IDS]}
          transitionKind="hard-cut"
          transitionMap={TRANSITION_MAP}
          transitionDurationMs={720}
          reducedMotion={motionOff}
          beatLayoutModes={BEAT_LAYOUT_MODES}
          renderScene={(sceneId, sceneBeat) => (
            <ScenePanel scene={sceneId} beat={sceneBeat} copy={copy} />
          )}
        />
      </main>
      {!isThumbnail && (
        <FolioTabs copy={copy} scene={activeScene} onNavigate={onNavigate} />
      )}
    </section>
  );
}

export const hiddenTextTopic = defineStyleTopic({
  id: "hidden-text",
  topic: {
    en: "Hidden Text",
    zh: "重写羊皮卷",
  },
  model: "GPT 5.6 Sol",
  component: HiddenText,
  getMetadata,
  navigation: {
    geometry: "edge-scale",
    carrier: "palimpsest-folio-tabs",
    invocation: "click-expand",
    feedback: "geometry-reflow",
  },
  sources: hiddenTextSources,
  transitionScore: hiddenTextTransitionScore,
});

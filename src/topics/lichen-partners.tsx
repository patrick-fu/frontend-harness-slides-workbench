import { useCallback, useEffect, useRef, useState } from "react";
import type { KeyboardEvent, PointerEvent } from "react";
import type { Source } from "../domain/evidence";
import {
  defineTopic,
  type TopicMetadata,
  type TopicNavigation,
  type TopicStageProps,
  type TopicTransitionScore,
} from "../domain/topic";
import SpatialSceneTrack from "../components/stage/SpatialSceneTrack";
import type { BeatLayoutMode, SceneTransitionMap } from "../components/stage/SpatialSceneTrack";
import styles from "./lichen-partners.module.css";

type Language = TopicStageProps["language"];
type SceneId = 1 | 2 | 3 | 4 | 5;
type ClaimId =
  | "fungal-framework"
  | "photosynthetic-partner"
  | "stratified-thallus"
  | "core-exchange"
  | "yeast-cortex-case"
  | "bacterial-microbiome-case"
  | "scope-boundary"
  | "fungal-naming";
type SourceId = "s1-smithsonian" | "s2-usfs" | "s3-spribille" | "s4-review";

interface LichenClaim {
  id: ClaimId;
  sourceIds: readonly SourceId[];
  label: string;
}

interface LichenSource extends Source {
  id: SourceId;
  claimIds: readonly ClaimId[];
  accessDate: "2026-07-10";
}

interface BeatCopy {
  id: number;
  action: string;
  title: string;
  body: string;
}

interface SceneCopy {
  nav: string;
  eyebrow: string;
  title: string;
  body: string;
  sourceIds: readonly SourceId[];
  beats: readonly BeatCopy[];
}

const SCENE_IDS: SceneId[] = [1, 2, 3, 4, 5];
const HOLD_DELAY_MS = 360;

export const LICHEN_TRANSITION_SCORE = {
  "1->2": "grid-reveal",
  "2->3": "focus-swap",
  "3->4": "iris-open",
  "4->5": "grid-reveal",
} as const satisfies TopicTransitionScore;

const TRANSITION_MAP: SceneTransitionMap = LICHEN_TRANSITION_SCORE;

const BEAT_LAYOUT_MODES = {
  1: "reserved",
  2: "reserved",
  3: "reserved",
  4: "reserved",
  5: "reserved",
} satisfies Partial<Record<SceneId, BeatLayoutMode>>;

const NAVIGATION_PROFILE = {
  geometry: "spatial-node",
  carrier: "lichen-compartments",
  invocation: "gesture-hold",
  feedback: "material-color-change",
} as const satisfies TopicNavigation;

/**
 * Claim IDs are intentionally reciprocal with LICHEN_SOURCES.claimIds. The
 * source stamp on every scene exposes the source IDs used by its visible facts.
 */
export const LICHEN_CLAIMS: readonly LichenClaim[] = [
  {
    id: "fungal-framework",
    sourceIds: ["s1-smithsonian", "s2-usfs", "s4-review"],
    label: "A fungal partner forms much of the thallus structure around photobionts.",
  },
  {
    id: "photosynthetic-partner",
    sourceIds: ["s1-smithsonian", "s2-usfs", "s4-review"],
    label: "Photobionts can be green algae, cyanobacteria, or both in documented lichen systems.",
  },
  {
    id: "stratified-thallus",
    sourceIds: ["s2-usfs", "s4-review"],
    label: "A common heteromerous thallus has distinguishable fungal and photobiont layers; stratification varies among lichens.",
  },
  {
    id: "core-exchange",
    sourceIds: ["s1-smithsonian", "s2-usfs", "s4-review"],
    label: "The photobiont fixes carbon while fungal structure provides a protected habitat in the core partnership.",
  },
  {
    id: "yeast-cortex-case",
    sourceIds: ["s3-spribille"],
    label: "Basidiomycete yeasts were reported in the cortex of studied ascomycete macrolichens.",
  },
  {
    id: "bacterial-microbiome-case",
    sourceIds: ["s4-review"],
    label: "Research has documented structured lichen-associated bacterial microbiomes in particular study systems.",
  },
  {
    id: "scope-boundary",
    sourceIds: ["s2-usfs", "s3-spribille", "s4-review"],
    label: "Additional associates and layered forms are case-dependent and do not establish one fixed roster for every lichen.",
  },
  {
    id: "fungal-naming",
    sourceIds: ["s1-smithsonian"],
    label: "Lichen names follow the fungal component in the Smithsonian explanation of lichenization.",
  },
];

export const LICHEN_SCENE_CLAIMS = {
  1: ["fungal-framework", "scope-boundary"],
  2: ["stratified-thallus", "photosynthetic-partner", "scope-boundary"],
  3: ["core-exchange", "fungal-framework", "photosynthetic-partner"],
  4: ["scope-boundary", "yeast-cortex-case", "bacterial-microbiome-case"],
  5: ["fungal-naming", "scope-boundary"],
} as const satisfies Readonly<Record<SceneId, readonly ClaimId[]>>;

export const LICHEN_SOURCES: readonly LichenSource[] = [
  {
    id: "s1-smithsonian",
    authority: "Smithsonian National Museum of Natural History",
    title: "What's a Lichen? How a Smithsonian Scientist Studies a Unique Symbiosis",
    citation: "Smithsonian Learning Lab, National Museum of Natural History, updated 2025.",
    url: "https://learninglab.si.edu/collections/whats-a-lichen-how-a-smithsonian-scientist-studies-a-unique-symbiosis/E9fRnD5DoKRbF4ME",
    supports:
      "The lichen thallus is the fungal-algal house; algae make sugar by photosynthesis, fungi provide shelter, and lichenization is a fungal lifestyle whose name follows the fungal component.",
    accessDate: "2026-07-10",
    claimIds: [
      "fungal-framework",
      "photosynthetic-partner",
      "core-exchange",
      "fungal-naming",
    ],
  },
  {
    id: "s2-usfs",
    authority: "USDA Forest Service",
    title: "National Atlas of Epiphytic Lichens in Forested Habitats of the United States",
    citation: "USDA Forest Service, National Atlas of Epiphytic Lichens, introduction.",
    url: "https://www.fs.usda.gov/sites/default/files/fs_media/fs_document/Lichen-Atlas.pdf",
    supports:
      "The main partners are a fungus and one or more photobionts, including green algae, cyanobacteria, or both; fungal cells surround photobionts and other organisms occur in some lichens.",
    accessDate: "2026-07-10",
    claimIds: [
      "fungal-framework",
      "photosynthetic-partner",
      "stratified-thallus",
      "core-exchange",
      "scope-boundary",
    ],
  },
  {
    id: "s3-spribille",
    authority: "Science / PubMed Central",
    title: "Basidiomycete yeasts in the cortex of ascomycete macrolichens",
    citation: "Spribille T, et al. Science. 2016;353:488–492. doi:10.1126/science.aaf8287.",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC5793994/",
    supports:
      "In studied ascomycete macrolichens, the authors reported specific basidiomycete yeasts embedded in the cortex and linked their abundance with phenotype variation; this is not a claim about every lichen.",
    accessDate: "2026-07-10",
    claimIds: ["yeast-cortex-case", "scope-boundary"],
  },
  {
    id: "s4-review",
    authority: "Frontiers in Microbiology",
    title: "Understanding Microbial Multi-Species Symbioses",
    citation: "Aschenbrenner IA, Cernava T, Berg G, Grube M. Front Microbiol. 2016;7:180. doi:10.3389/fmicb.2016.00180.",
    url: "https://www.frontiersin.org/journals/microbiology/articles/10.3389/fmicb.2016.00180/full",
    supports:
      "This review distinguishes stratified and non-stratified thalli, describes fungal and photobiont roles, and reviews lichen-associated bacterial communities whose composition and functions depend on study system and context.",
    accessDate: "2026-07-10",
    claimIds: [
      "fungal-framework",
      "photosynthetic-partner",
      "stratified-thallus",
      "core-exchange",
      "bacterial-microbiome-case",
      "scope-boundary",
    ],
  },
];

const COPY: Record<Language, Record<SceneId, SceneCopy>> = {
  en: {
    1: {
      nav: "Whole",
      eyebrow: "01 / a visible thallus",
      title: "One surface. More than one role.",
      body: "A visible lichen body—the thallus—is largely fungal structure around photosynthetic partners. Six uneven cuts ask us to look inside without pretending every lichen has the same map.",
      sourceIds: ["s1-smithsonian", "s2-usfs", "s4-review"],
      beats: [
        { id: 0, action: "Settle the whole thallus", title: "A whole surface", body: "Begin with the visible body before separating its roles." },
        { id: 1, action: "Open the first cut", title: "A surface can hold layers", body: "One opening makes room for an internal view." },
        { id: 2, action: "Open unequal compartments", title: "The openings are not a card grid", body: "Their unequal geometry follows a body, not a menu." },
        { id: 3, action: "Name the scope boundary", title: "A useful model needs limits", body: "Layering and partners vary across lichen systems." },
      ],
    },
    2: {
      nav: "Layers",
      eyebrow: "02 / common stratified model",
      title: "A cutaway, not a universal blueprint.",
      body: "In a common stratified thallus, a fungal upper layer sits around a photobiont zone above a looser medulla. Other thalli are organized differently.",
      sourceIds: ["s2-usfs", "s4-review"],
      beats: [
        { id: 0, action: "Expose the asymmetrical cutaway", title: "Read the cut", body: "A common layered form comes into view." },
        { id: 1, action: "Label the outer and light-facing zones", title: "Structure meets light", body: "Fungal cortex and photobiont zone gain distinct positions." },
        { id: 2, action: "Set the medulla and caveat", title: "The stack has exceptions", body: "Not every thallus is stratified in the same way." },
      ],
    },
    3: {
      nav: "Exchange",
      eyebrow: "03 / across compartments",
      title: "The core relationship crosses the walls.",
      body: "The fungal partner builds a protected setting; the photobiont fixes carbon. This is a common core exchange, not a complete recipe for every lichen.",
      sourceIds: ["s1-smithsonian", "s2-usfs", "s4-review"],
      beats: [
        { id: 0, action: "Place the two main compartments", title: "Partners have different roles", body: "Structure and photosynthesis occupy distinct but connected regions." },
        { id: 1, action: "Draw the exchange through the wall", title: "The boundary is permeable", body: "The diagram connects habitat and fixed carbon across compartments." },
      ],
    },
    4: {
      nav: "Research",
      eyebrow: "04 / research boundary",
      title: "Additional partners: findings with a scope.",
      body: "Yeasts and bacterial communities belong in the picture only with their study boundary attached. They do not create a fixed roster for every lichen.",
      sourceIds: ["s2-usfs", "s3-spribille", "s4-review"],
      beats: [
        { id: 0, action: "Hold the scope boundary steady", title: "Some systems, not all systems", body: "Additional associates remain an evidence-labelled research finding." },
      ],
    },
    5: {
      nav: "Recombine",
      eyebrow: "05 / read together",
      title: "One name. Many collaborators.",
      body: "Lichen naming follows the fungal partner.",
      sourceIds: ["s1-smithsonian", "s2-usfs", "s3-spribille", "s4-review"],
      beats: [
        { id: 0, action: "Recombine the compartments", title: "Return to the whole", body: "The final thallus keeps its internal relationships in view." },
      ],
    },
  },
  zh: {
    1: {
      nav: "整体",
      eyebrow: "01 / 可见的 thallus",
      title: "一个表面，不止一种角色。",
      body: "可见的地衣体——thallus——主要由真菌结构围绕光合伙伴构成。六个不等形切口邀请我们向内看，但不假装每种地衣都有同一张地图。",
      sourceIds: ["s1-smithsonian", "s2-usfs", "s4-review"],
      beats: [
        { id: 0, action: "完整 thallus 落位", title: "先看完整表面", body: "在分开角色之前，先看可见的整体。" },
        { id: 1, action: "打开第一道切口", title: "表面可以容纳层次", body: "一个开口为内部视图让出位置。" },
        { id: 2, action: "打开不等形隔间", title: "这不是卡片网格", body: "不等形几何跟随身体，而不是菜单。" },
        { id: 3, action: "标出适用边界", title: "有用模型必须有边界", body: "不同地衣系统的层次与伙伴会变化。" },
      ],
    },
    2: {
      nav: "层次",
      eyebrow: "02 / 常见分层模型",
      title: "这是剖面，不是通用蓝图。",
      body: "在一种常见的分层 thallus 中，真菌外层围绕光合伙伴层，其下是较疏松的髓层。其他 thallus 的组织方式并不相同。",
      sourceIds: ["s2-usfs", "s4-review"],
      beats: [
        { id: 0, action: "显出不对称剖面", title: "先读这个切面", body: "一种常见层状形态进入视野。" },
        { id: 1, action: "标注外层与见光区域", title: "结构遇见光", body: "真菌皮层与光合伙伴层有了不同位置。" },
        { id: 2, action: "放入髓层与例外", title: "这个堆叠也有例外", body: "并非每个 thallus 都以同样方式分层。" },
      ],
    },
    3: {
      nav: "交换",
      eyebrow: "03 / 穿过隔间",
      title: "核心关系穿过隔墙。",
      body: "真菌伙伴建立受保护的环境；光合伙伴固定碳。这是常见的核心交换，不是每种地衣的完整配方。",
      sourceIds: ["s1-smithsonian", "s2-usfs", "s4-review"],
      beats: [
        { id: 0, action: "放入两个主要隔间", title: "伙伴分工不同", body: "结构与光合作用在不同却相连的区域出现。" },
        { id: 1, action: "让交换穿过隔墙", title: "边界可以通行", body: "图示把栖居环境与固定碳连接在隔间之间。" },
      ],
    },
    4: {
      nav: "研究",
      eyebrow: "04 / 研究边界",
      title: "其他伙伴：必须带着研究范围出现。",
      body: "酵母和细菌群落只有连同研究边界，才应进入画面。它们不能变成“每种地衣都有”的固定名单。",
      sourceIds: ["s2-usfs", "s3-spribille", "s4-review"],
      beats: [
        { id: 0, action: "让研究边界保持可见", title: "部分系统，不是所有系统", body: "其他共生者仍是带证据标签的研究发现。" },
      ],
    },
    5: {
      nav: "重组",
      eyebrow: "05 / 一起阅读",
      title: "一个名称，多个协作者。",
      body: "地衣命名跟随真菌伙伴。",
      sourceIds: ["s1-smithsonian", "s2-usfs", "s3-spribille", "s4-review"],
      beats: [
        { id: 0, action: "让隔间重新成为整体", title: "回到完整形体", body: "最终 thallus 仍保留内部关系。" },
      ],
    },
  },
};

function clampScene(scene: number): SceneId {
  return Math.min(5, Math.max(1, Math.round(scene))) as SceneId;
}

function clampBeat(sceneId: SceneId, beat: number): number {
  const max = COPY.en[sceneId].beats.length - 1;
  return Math.min(max, Math.max(0, Math.round(beat)));
}

function cx(...names: Array<string | false | undefined>): string {
  return names.filter(Boolean).join(" ");
}

function getLichenClaim(claimId: ClaimId): LichenClaim {
  const claim = LICHEN_CLAIMS.find((candidate) => candidate.id === claimId);
  if (!claim) throw new Error(`Unknown lichen claim: ${claimId}`);
  return claim;
}

function getLichenSource(sourceId: SourceId): LichenSource {
  const source = LICHEN_SOURCES.find((candidate) => candidate.id === sourceId);
  if (!source) throw new Error(`Unknown lichen source: ${sourceId}`);
  return source;
}

function getSceneSourceIds(sceneId: SceneId): SourceId[] {
  const claimIds: readonly ClaimId[] = LICHEN_SCENE_CLAIMS[sceneId];
  return LICHEN_SOURCES.filter((source) =>
    claimIds.some((claimId) => source.claimIds.includes(claimId)),
  ).map((source) => source.id);
}

function Claim({
  id,
  children,
  className,
}: {
  id: ClaimId;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span className={className} data-claim-id={id}>
      {children}
    </span>
  );
}

function SourceStamp({
  sceneId,
  language,
}: {
  sceneId: SceneId;
  language: Language;
}) {
  const claimIds: readonly ClaimId[] = LICHEN_SCENE_CLAIMS[sceneId];
  const sourceIds = getSceneSourceIds(sceneId);
  const claimSourceLinks = claimIds
    .map(
      (claimId) =>
        `${claimId}:${getLichenClaim(claimId).sourceIds.join(",")}`,
    )
    .join(";");

  return (
    <footer
      className={styles.sourceStamp}
      data-source-stamp="true"
      data-claim-source-map="true"
      data-scene-id={sceneId}
      data-claim-ids={claimIds.join(" ")}
      data-source-ids={sourceIds.join(" ")}
      data-claim-source-links={claimSourceLinks}
      aria-label={language === "zh" ? "本场事实来源" : "Sources for this scene"}
    >
      <span>{language === "zh" ? "来源" : "SOURCES"}</span>
      {sourceIds.map((sourceId) => {
        const source = getLichenSource(sourceId);
        return (
          <a
            key={sourceId}
            data-source-id={sourceId}
            href={source.url}
            target="_blank"
            rel="noreferrer"
            title={source.title}
            aria-label={`${sourceId}: ${source.title}`}
            onPointerDown={(event) => event.stopPropagation()}
            onTouchStart={(event) => event.stopPropagation()}
            onClick={(event) => event.stopPropagation()}
          >
            {sourceId.slice(0, 2).toUpperCase()}
          </a>
        );
      })}
    </footer>
  );
}

function BeatCaption({
  sceneId,
  copy,
  beat,
  language,
}: {
  sceneId: SceneId;
  copy: SceneCopy;
  beat: number;
  language: Language;
}) {
  const current = copy.beats[beat];
  return (
    <aside
      className={styles.beatCaption}
      data-beat-layout-item="true"
      data-claim-id={LICHEN_SCENE_CLAIMS[sceneId][0]}
      aria-live="polite"
    >
      <span>{String(beat + 1).padStart(2, "0")}</span>
      <strong>{current.title}</strong>
      <p>{current.body}</p>
      <i>{language === "zh" ? "当前节拍" : "CURRENT BEAT"}</i>
    </aside>
  );
}

function WholeThallus({
  beat,
  recombined = false,
  language,
}: {
  beat: number;
  recombined?: boolean;
  language: Language;
}) {
  const open = recombined ? 0 : beat;
  return (
    <svg
      className={cx(styles.wholeThallus, recombined && styles.recombinedThallus)}
      viewBox="0 0 1200 760"
      role="img"
      aria-label={language === "zh" ? "原创地衣 thallus 示意" : "Original lichen thallus diagram"}
      data-thallus-hero={recombined ? "recombined" : "whole"}
      data-thallus-open-stage={open}
    >
      <defs>
        <linearGradient id="lichen-field" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#d6db8d" />
          <stop offset="0.42" stopColor="#879752" />
          <stop offset="0.74" stopColor="#586c42" />
          <stop offset="1" stopColor="#354931" />
        </linearGradient>
        <linearGradient id="lichen-cut" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#efe5bf" />
          <stop offset="0.44" stopColor="#a2bd67" />
          <stop offset="1" stopColor="#33472f" />
        </linearGradient>
        <radialGradient id="lichen-glow" cx="50%" cy="42%" r="58%">
          <stop offset="0" stopColor="#f2edc8" stopOpacity="0.72" />
          <stop offset="1" stopColor="#d7db8a" stopOpacity="0" />
        </radialGradient>
      </defs>
      <path className={styles.thallusShadow} d="M184 521C150 409 207 250 346 178C461 116 609 144 719 105C834 64 1013 139 1038 282C1062 423 938 589 780 630C609 676 490 638 345 658C246 672 197 614 184 521Z" />
      <path
        className={styles.thallusBody}
        d="M160 474C152 362 218 228 350 174C466 126 582 157 694 111C823 57 995 124 1035 254C1077 389 991 550 830 617C685 677 558 632 408 663C271 692 173 598 160 474Z"
        fill="url(#lichen-field)"
      />
      <path className={styles.thallusGlow} d="M241 462C220 350 309 238 422 207C525 177 620 219 714 164C810 108 942 164 957 278C974 404 885 514 755 552C629 589 532 550 410 584C309 612 251 556 241 462Z" fill="url(#lichen-glow)" />
      <g className={styles.thallusRidges}>
        <path d="M246 389C346 322 402 364 467 319C544 267 615 303 698 249C781 195 876 235 943 197" />
        <path d="M209 484C310 418 374 460 450 414C541 357 620 402 694 354C790 293 874 347 961 307" />
        <path d="M271 560C363 501 440 547 514 496C590 443 671 490 754 437C838 382 910 436 954 404" />
      </g>
      <g className={styles.cutGroup} data-visible={open >= 1 ? "true" : "false"}>
        <path className={styles.cutPocket} d="M327 263C394 227 462 242 493 281C520 316 496 361 428 377C357 394 300 360 299 315C298 291 309 274 327 263Z" fill="url(#lichen-cut)" />
        <path className={styles.cutLine} d="M304 315C359 296 424 299 490 281" />
      </g>
      <g className={styles.cutGroup} data-visible={open >= 2 ? "true" : "false"}>
        <path className={styles.cutPocket} d="M571 188C663 153 747 174 780 229C808 276 757 329 674 338C590 347 525 303 532 249C535 221 550 199 571 188Z" fill="url(#lichen-cut)" />
        <path className={styles.cutLine} d="M537 251C605 229 685 233 777 228" />
        <path className={styles.cutPocket} d="M772 388C861 352 945 387 961 453C976 513 910 552 834 534C767 518 733 462 749 425C754 409 762 396 772 388Z" fill="url(#lichen-cut)" />
        <path className={styles.cutLine} d="M753 426C815 421 889 431 958 453" />
      </g>
      <g className={styles.cutGroup} data-visible={open >= 3 ? "true" : "false"}>
        <path className={styles.cutPocket} d="M374 473C453 434 538 457 568 515C594 566 543 613 455 616C366 619 301 568 320 516C330 496 348 485 374 473Z" fill="url(#lichen-cut)" />
        <path className={styles.cutLine} d="M323 516C388 503 474 505 563 516" />
        <path className={styles.cutPocket} d="M613 421C679 390 743 412 762 457C779 499 738 536 672 543C606 549 552 516 557 475C560 451 579 436 613 421Z" fill="url(#lichen-cut)" />
        <path className={styles.cutLine} d="M558 475C617 463 691 468 757 457" />
        <path className={styles.thallusTag} d="M855 126H1013" />
        <text className={styles.thallusTagText} x="859" y="111">
          {language === "zh" ? "六个不等形切口" : "SIX UNEQUAL CUTS"}
        </text>
      </g>
      {recombined && (
        <g className={styles.recombineMarks}>
          <path d="M365 265C480 194 662 189 791 248" />
          <path d="M338 520C491 599 706 581 858 482" />
        </g>
      )}
    </svg>
  );
}

function SceneOne({
  copy,
  beat,
  language,
}: {
  copy: SceneCopy;
  beat: number;
  language: Language;
}) {
  return (
    <section className={cx(styles.scene, styles.sceneOne)} data-composition="whole-thallus" data-visible-claim-ids={LICHEN_SCENE_CLAIMS[1].join(" ")} data-lichen-scene="1" data-scene-beat={beat} data-beat-layout-container="true" data-beat-layout-mode="reserved">
      <header className={styles.heroHeader} data-beat-layout-item="true">
        <span className={styles.eyebrow}>{copy.eyebrow}</span>
        <h1 data-claim-id="fungal-framework">{copy.title}</h1>
        <Claim id="fungal-framework" className={styles.sceneBody}>{copy.body}</Claim>
      </header>
      <div className={styles.wholeVisual} data-beat-layout-item="true">
        <WholeThallus beat={beat} language={language} />
        <div className={styles.cutLegend} data-visible={beat >= 3 ? "true" : "false"}>
          <Claim id="scope-boundary">{language === "zh" ? "切口提示层次；不是固定名单" : "Cuts suggest layers; not a fixed roster"}</Claim>
        </div>
      </div>
      <BeatCaption sceneId={1} copy={copy} beat={beat} language={language} />
      <SourceStamp sceneId={1} language={language} />
    </section>
  );
}

function CutawayDiagram({ beat, language }: { beat: number; language: Language }) {
  return (
    <svg className={styles.cutawayDiagram} viewBox="0 0 1000 700" role="img" aria-label={language === "zh" ? "地衣分层剖面图" : "Lichen layered cutaway diagram"} data-cutaway-beat={beat}>
      <defs>
        <linearGradient id="cutaway-cortex" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#dbe6a2" />
          <stop offset="1" stopColor="#6e824e" />
        </linearGradient>
        <linearGradient id="cutaway-medulla" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#eee3bf" />
          <stop offset="1" stopColor="#71806a" />
        </linearGradient>
      </defs>
      <path className={styles.cutawayBack} d="M206 105C371 65 588 85 809 172L829 552C631 635 406 634 181 558L166 224Z" />
      <path className={styles.cortexShape} d="M188 174C382 113 591 130 820 207L810 312C599 252 384 246 179 320Z" fill="url(#cutaway-cortex)" />
      <path className={styles.photobiontShape} data-visible={beat >= 1 ? "true" : "false"} d="M180 325C380 253 600 260 810 317L804 410C596 354 389 349 183 420Z" />
      <path className={styles.medullaShape} data-visible={beat >= 2 ? "true" : "false"} d="M185 426C389 354 598 361 803 416L801 542C608 605 408 607 188 548Z" fill="url(#cutaway-medulla)" />
      <g className={styles.cutawayHyphae} data-visible={beat >= 2 ? "true" : "false"}>
        <path d="M251 465C344 414 429 499 510 448C596 394 667 500 757 446" />
        <path d="M243 515C333 468 427 553 514 501C602 450 684 543 758 497" />
        <path d="M297 556C370 516 449 570 529 535C616 499 678 563 733 537" />
      </g>
      <g className={styles.cutawayLabels} data-visible={beat >= 1 ? "true" : "false"}>
        <path d="M817 251H942" />
        <text x="829" y="224" data-claim-id="stratified-thallus">{language === "zh" ? "真菌外层" : "fungal upper layer"}</text>
        <path d="M813 364H942" />
        <text x="829" y="337" data-claim-id="photosynthetic-partner">{language === "zh" ? "光合伙伴层" : "photobiont zone"}</text>
      </g>
      <g className={styles.cutawayLabels} data-visible={beat >= 2 ? "true" : "false"}>
        <path d="M800 484H942" />
        <text x="829" y="457" data-claim-id="stratified-thallus">{language === "zh" ? "较疏松的髓层" : "looser medulla"}</text>
        <path d="M185 590H466" />
        <text x="191" y="625" data-claim-id="scope-boundary">{language === "zh" ? "常见模型；并非所有 thallus 都这样分层" : "common model; not every thallus is stratified this way"}</text>
      </g>
    </svg>
  );
}

function SceneTwo({
  copy,
  beat,
  language,
}: {
  copy: SceneCopy;
  beat: number;
  language: Language;
}) {
  return (
    <section className={cx(styles.scene, styles.sceneTwo)} data-composition="asymmetric-cutaway" data-visible-claim-ids={LICHEN_SCENE_CLAIMS[2].join(" ")} data-lichen-scene="2" data-scene-beat={beat} data-beat-layout-container="true" data-beat-layout-mode="reserved">
      <header className={styles.sectionHeader} data-beat-layout-item="true">
        <span className={styles.eyebrow} data-claim-id="stratified-thallus">{copy.eyebrow}</span>
        <h1 data-claim-id="scope-boundary">{copy.title}</h1>
      </header>
      <aside className={styles.cutawayNote} data-beat-layout-item="true">
        <Claim id="stratified-thallus">{copy.body}</Claim>
        <div className={styles.layerKey}>
          <span data-claim-id="stratified-thallus">{language === "zh" ? "保护性真菌结构" : "protective fungal structure"}</span>
          <span data-claim-id="photosynthetic-partner">{language === "zh" ? "利用光的伙伴" : "light-using partner"}</span>
        </div>
      </aside>
      <div className={styles.cutawayFrame} data-beat-layout-item="true">
        <CutawayDiagram beat={beat} language={language} />
      </div>
      <BeatCaption sceneId={2} copy={copy} beat={beat} language={language} />
      <SourceStamp sceneId={2} language={language} />
    </section>
  );
}

function ExchangeNetwork({ beat, language }: { beat: number; language: Language }) {
  return (
    <div className={styles.exchangeNetwork} data-exchange-network="true" data-network-connected={beat >= 1 ? "true" : "false"}>
      <svg className={styles.exchangeLines} viewBox="0 0 1200 500" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <marker id="lichen-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
            <path d="M0 0L8 4L0 8Z" fill="#d8e39a" />
          </marker>
          <marker id="lichen-arrow-dark" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
            <path d="M0 0L8 4L0 8Z" fill="#527464" />
          </marker>
        </defs>
        <path className={styles.exchangeLine} data-visible={beat >= 1 ? "true" : "false"} d="M414 164C532 83 692 83 804 174" markerEnd="url(#lichen-arrow)" />
        <path className={styles.exchangeLineAlt} data-visible={beat >= 1 ? "true" : "false"} d="M804 331C679 426 526 416 397 326" markerEnd="url(#lichen-arrow-dark)" />
        <path className={styles.exchangeThread} d="M122 405C286 356 369 462 499 415C621 372 768 460 1067 390" />
      </svg>
      <article className={styles.fungalCompartment} data-beat-layout-item="true">
        <span data-claim-id="fungal-framework">{language === "zh" ? "主要真菌" : "main fungal partner"}</span>
        <strong data-claim-id="fungal-framework">{language === "zh" ? "搭起 thallus 的结构" : "shapes thallus structure"}</strong>
        <p data-claim-id="core-exchange">{language === "zh" ? "提供受保护的栖居环境" : "provides a protected setting"}</p>
      </article>
      <article className={styles.photobiontCompartment} data-beat-layout-item="true">
        <span data-claim-id="photosynthetic-partner">{language === "zh" ? "光合伙伴" : "photobiont"}</span>
        <strong data-claim-id="photosynthetic-partner">{language === "zh" ? "绿藻、蓝细菌，或二者" : "green alga, cyanobacterium, or both"}</strong>
        <p data-claim-id="core-exchange">{language === "zh" ? "以光合作用固定碳" : "fixes carbon through photosynthesis"}</p>
      </article>
      <div className={styles.exchangeTag} data-visible={beat >= 1 ? "true" : "false"}>
        <span data-claim-id="core-exchange">{language === "zh" ? "固定碳 → 伙伴关系中的能量来源" : "fixed carbon → energy source in the partnership"}</span>
        <span data-claim-id="core-exchange">{language === "zh" ? "结构与保护 ← 真菌组织" : "structure and shelter ← fungal organization"}</span>
      </div>
    </div>
  );
}

function SceneThree({
  copy,
  beat,
  language,
}: {
  copy: SceneCopy;
  beat: number;
  language: Language;
}) {
  return (
    <section className={cx(styles.scene, styles.sceneThree)} data-composition="partner-compartments" data-visible-claim-ids={LICHEN_SCENE_CLAIMS[3].join(" ")} data-lichen-scene="3" data-scene-beat={beat} data-beat-layout-container="true" data-beat-layout-mode="reserved">
      <header className={styles.networkHeader} data-beat-layout-item="true">
        <span className={styles.eyebrow}>{copy.eyebrow}</span>
        <h1 data-claim-id="core-exchange">{copy.title}</h1>
        <Claim id="core-exchange" className={styles.sceneBody}>{copy.body}</Claim>
      </header>
      <ExchangeNetwork beat={beat} language={language} />
      <BeatCaption sceneId={3} copy={copy} beat={beat} language={language} />
      <SourceStamp sceneId={3} language={language} />
    </section>
  );
}

function SceneFour({
  copy,
  beat,
  language,
}: {
  copy: SceneCopy;
  beat: number;
  language: Language;
}) {
  return (
    <section className={cx(styles.scene, styles.sceneFour)} data-composition="research-boundary" data-visible-claim-ids={LICHEN_SCENE_CLAIMS[4].join(" ")} data-lichen-scene="4" data-scene-beat={beat} data-beat-layout-container="true" data-beat-layout-mode="reserved">
      <header className={styles.researchHeader} data-beat-layout-item="true">
        <span className={styles.eyebrow}>{copy.eyebrow}</span>
        <h1 data-claim-id="scope-boundary">{copy.title}</h1>
        <Claim id="scope-boundary" className={styles.sceneBody}>{copy.body}</Claim>
      </header>
      <div className={styles.researchLedger} data-beat-layout-item="true">
        <article className={styles.studyCellYeast}>
          <span>{language === "zh" ? "研究例：酵母" : "STUDY CASE · YEAST"}</span>
          <strong data-claim-id="yeast-cortex-case">{language === "zh" ? "在研究过的子囊菌大型地衣中，发现皮层内的担子菌酵母。" : "Basidiomycete yeasts were reported in the cortex of studied ascomycete macrolichens."}</strong>
          <i>S3</i>
        </article>
        <article className={styles.studyCellBacteria}>
          <span>{language === "zh" ? "研究例：细菌群落" : "STUDY CASE · BACTERIA"}</span>
          <strong data-claim-id="bacterial-microbiome-case">{language === "zh" ? "部分研究系统显示，地衣相关细菌群落具有空间与宿主相关的结构。" : "Some study systems show spatially and host-structured lichen-associated bacterial communities."}</strong>
          <i>S4</i>
        </article>
        <aside className={styles.scopeSeal} data-claim-id="scope-boundary">
          <span>{language === "zh" ? "适用边界" : "SCOPE BOUNDARY"}</span>
          <strong>{language === "zh" ? "部分系统 / 研究中" : "SOME SYSTEMS / UNDER STUDY"}</strong>
          <p>{language === "zh" ? "不是每种地衣的固定名单" : "not a fixed roster for every lichen"}</p>
        </aside>
      </div>
      <BeatCaption sceneId={4} copy={copy} beat={beat} language={language} />
      <SourceStamp sceneId={4} language={language} />
    </section>
  );
}

function SceneFive({
  copy,
  beat,
  language,
}: {
  copy: SceneCopy;
  beat: number;
  language: Language;
}) {
  return (
    <section className={cx(styles.scene, styles.sceneFive)} data-composition="recombined-organism" data-visible-claim-ids={LICHEN_SCENE_CLAIMS[5].join(" ")} data-lichen-scene="5" data-scene-beat={beat} data-beat-layout-container="true" data-beat-layout-mode="reserved">
      <div className={styles.recombinedVisual} data-beat-layout-item="true">
        <WholeThallus beat={beat} recombined language={language} />
      </div>
      <header className={styles.recombinedCopy} data-beat-layout-item="true">
        <span className={styles.eyebrow}>{copy.eyebrow}</span>
        <h1 data-claim-id="fungal-naming">{copy.title}</h1>
        <Claim id="fungal-naming" className={styles.sceneBody}>{copy.body}</Claim>
        <div className={styles.recombinedRule} />
        <Claim id="scope-boundary" className={styles.finalBoundary}>
          {language === "zh" ? "伙伴与层次，逐个系统研究。" : "Partners and layers: study them system by system."}
        </Claim>
      </header>
      <BeatCaption sceneId={5} copy={copy} beat={beat} language={language} />
      <SourceStamp sceneId={5} language={language} />
    </section>
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
  const copy = COPY[language][sceneId];
  const safeBeat = clampBeat(sceneId, beat);

  if (sceneId === 1) return <SceneOne copy={copy} beat={safeBeat} language={language} />;
  if (sceneId === 2) return <SceneTwo copy={copy} beat={safeBeat} language={language} />;
  if (sceneId === 3) return <SceneThree copy={copy} beat={safeBeat} language={language} />;
  if (sceneId === 4) return <SceneFour copy={copy} beat={safeBeat} language={language} />;
  return <SceneFive copy={copy} beat={safeBeat} language={language} />;
}

function LichenNavigation({
  activeScene,
  language,
  frozen,
  onNavigate,
}: {
  activeScene: SceneId;
  language: Language;
  frozen: boolean;
  onNavigate?: TopicStageProps["onNavigate"];
}) {
  const navRef = useRef<HTMLElement>(null);
  const holdTimerRef = useRef<number | null>(null);
  const [holding, setHolding] = useState(false);
  const [holdComplete, setHoldComplete] = useState(false);
  const visibleNodes = frozen || holdComplete;

  const clearTimer = useCallback(() => {
    if (holdTimerRef.current !== null) {
      window.clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }
  }, []);

  const beginHold = useCallback(() => {
    if (frozen) return;
    clearTimer();
    setHolding(true);
    setHoldComplete(false);
    holdTimerRef.current = window.setTimeout(() => {
      holdTimerRef.current = null;
      setHoldComplete(true);
    }, HOLD_DELAY_MS);
  }, [clearTimer, frozen]);

  const endHold = useCallback(() => {
    clearTimer();
    setHolding(false);
    setHoldComplete(false);
  }, [clearTimer]);

  useEffect(() => () => clearTimer(), [clearTimer]);

  useEffect(() => {
    const navigation = navRef.current;
    if (!navigation) return undefined;

    const isolateStart = (event: TouchEvent) => {
      event.stopPropagation();
      beginHold();
    };
    const isolateEnd = (event: TouchEvent) => {
      event.stopPropagation();
      endHold();
    };
    const isolateMove = (event: TouchEvent) => event.stopPropagation();

    navigation.addEventListener("touchstart", isolateStart, { passive: true });
    navigation.addEventListener("touchend", isolateEnd, { passive: true });
    navigation.addEventListener("touchcancel", isolateEnd, { passive: true });
    navigation.addEventListener("touchmove", isolateMove, { passive: true });
    return () => {
      navigation.removeEventListener("touchstart", isolateStart);
      navigation.removeEventListener("touchend", isolateEnd);
      navigation.removeEventListener("touchcancel", isolateEnd);
      navigation.removeEventListener("touchmove", isolateMove);
    };
  }, [beginHold, endHold]);

  const navigate = (target: SceneId) => onNavigate?.(target, 0);

  const stopPointer = (event: PointerEvent<HTMLElement>) => event.stopPropagation();

  const startPointerHold = (event: PointerEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    event.currentTarget.setPointerCapture?.(event.pointerId);
    beginHold();
  };

  const stopPointerHold = (event: PointerEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (event.currentTarget.hasPointerCapture?.(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    endHold();
  };

  const handleNodeKey = (event: KeyboardEvent<HTMLButtonElement>, sceneId: SceneId) => {
    if (event.repeat) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    event.stopPropagation();
    const keyToTarget: Record<string, SceneId | undefined> = {
      Home: 1,
      End: 5,
      ArrowLeft: Math.max(1, sceneId - 1) as SceneId,
      ArrowUp: Math.max(1, sceneId - 1) as SceneId,
      ArrowRight: Math.min(5, sceneId + 1) as SceneId,
      ArrowDown: Math.min(5, sceneId + 1) as SceneId,
    };
    const target = keyToTarget[event.key];
    if (target) {
      event.preventDefault();
      navigate(target);
      return;
    }
    if (event.key === "Enter" || event.key === " " || event.key === "Spacebar") {
      event.preventDefault();
      navigate(sceneId);
    }
  };

  const handleHoldKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.repeat) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    if (event.key !== "Enter" && event.key !== " " && event.key !== "Spacebar") return;
    event.preventDefault();
    event.stopPropagation();
    beginHold();
  };

  const handleHoldKeyUp = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key !== "Enter" && event.key !== " " && event.key !== "Spacebar") return;
    event.preventDefault();
    event.stopPropagation();
    endHold();
  };

  return (
    <nav
      ref={navRef}
      className={styles.lichenNavigation}
      aria-label={language === "zh" ? "地衣隔间场景导航" : "Lichen compartments scene navigation"}
      data-topic-navigation="true"
      data-navigation-geometry={NAVIGATION_PROFILE.geometry}
      data-navigation-carrier={NAVIGATION_PROFILE.carrier}
      data-navigation-invocation={NAVIGATION_PROFILE.invocation}
      data-navigation-feedback={NAVIGATION_PROFILE.feedback}
      data-holding={holding ? "true" : "false"}
      data-hold-complete={visibleNodes ? "true" : "false"}
      onPointerDown={stopPointer}
    >
      <button
        type="button"
        className={styles.holdControl}
        data-hold-control="true"
        aria-label={language === "zh" ? "按住约 360 毫秒显示五个地衣层次节点" : "Hold about 360 milliseconds to reveal all five lichen layer nodes"}
        aria-pressed={visibleNodes}
        onPointerDown={startPointerHold}
        onPointerUp={stopPointerHold}
        onPointerCancel={stopPointerHold}
        onPointerLeave={stopPointerHold}
        onKeyDown={handleHoldKeyDown}
        onKeyUp={handleHoldKeyUp}
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
        }}
      >
        <span aria-hidden="true">◌</span>
        {language === "zh" ? "按住显露层次" : "HOLD · REVEAL LAYERS"}
      </button>
      <div className={styles.nodeColumn} role="group" aria-label={language === "zh" ? "场景节点" : "Scene nodes"}>
        {SCENE_IDS.map((sceneId) => {
          const active = activeScene === sceneId;
          const label = COPY[language][sceneId].nav;
          return (
            <button
              key={sceneId}
              type="button"
              className={styles.lichenNode}
              data-node-scene={sceneId}
              data-active={active ? "true" : "false"}
              data-material={sceneId === 2 ? "cortex" : sceneId === 3 ? "photobiont" : sceneId === 4 ? "research" : "thallus"}
              aria-current={active ? "step" : undefined}
              aria-label={language === "zh" ? `跳转到场景 ${sceneId}：${label}` : `Jump to scene ${sceneId}: ${label}`}
              onPointerDown={(event) => event.stopPropagation()}
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                navigate(sceneId);
              }}
              onKeyDown={(event) => handleNodeKey(event, sceneId)}
            >
              <span className={styles.nodeIndex}>{String(sceneId).padStart(2, "0")}</span>
              <span className={styles.nodeMaterial} aria-hidden="true" />
              <span className={styles.nodeName} data-visible={visibleNodes ? "true" : "false"}>{label}</span>
            </button>
          );
        })}
      </div>
      <span className={styles.navInstruction}>
        {language === "zh" ? "点击跳转 · 键盘可达" : "tap to jump · keyboard ready"}
      </span>
    </nav>
  );
}

function getMetadata(language: Language): TopicMetadata {
  return {
    theme: language === "zh" ? "地衣伙伴" : "Lichen Partners",
    densityLabel: language === "zh" ? "图解讲解" : "Diagram Explainer",
    heroScene: 1,
    colors: {
      bg: "#101812",
      ink: "#edf0d9",
      panel: "#1e2b1d",
    },
    typography: {
      header: "Georgia 600",
      body: "Avenir Next 500",
    },
    tags: language === "zh"
      ? ["地衣", "共生", "分层", "生态图解", "深色"]
      : ["lichen", "symbiosis", "thallus", "ecology", "compartments", "diagram", "dark"],
    fonts: ["Georgia", "Avenir Next", "cjk:Songti SC", "cjk:Noto Sans SC"],
    scenes: SCENE_IDS.map((sceneId) => ({
      id: sceneId,
      title: COPY[language][sceneId].title,
      beats: COPY[language][sceneId].beats.map((beat) => ({ ...beat })),
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
  const activeScene = clampScene(scene);
  const safeBeat = clampBeat(activeScene, beat);
  const frozen = reducedMotion || isThumbnail;

  return (
    <div
      className={cx(styles.root, frozen && styles.frozen)}
      data-topic-id="lichen-partners"
      data-stage-safe="1920x1080"
      data-motion={frozen ? "off" : "on"}
      data-frozen={frozen ? "true" : "false"}
    >
      <div className={styles.environmentalField} aria-hidden="true" />
      <div className={styles.trackFrame} data-stage-clip="true">
        <SpatialSceneTrack
          scene={activeScene}
          beat={safeBeat}
          sceneIds={SCENE_IDS}
          transitionKind="grid-reveal"
          transitionMap={TRANSITION_MAP}
          transitionDurationMs={520}
          reducedMotion={frozen}
          beatLayoutModes={BEAT_LAYOUT_MODES}
          renderScene={(sceneId, sceneBeat) => (
            <ScenePanel
              sceneId={clampScene(sceneId)}
              beat={sceneBeat}
              language={language}
            />
          )}
        />
      </div>
      {!isThumbnail && (
        <LichenNavigation
          activeScene={activeScene}
          language={language}
          frozen={frozen}
          onNavigate={onNavigate}
        />
      )}
    </div>
  );
}

export default defineTopic({
  id: "lichen-partners",
  styleId: "context-bento-box",
  title: { en: "Lichen Partners", zh: "地衣伙伴" },
  modelId: "GPT 5.6 Sol",
  Stage: TopicStage,
  metadata: METADATA,
  navigation: NAVIGATION_PROFILE,
  transitionScore: LICHEN_TRANSITION_SCORE,
  evidence: {
    kind: "facts",
    sources: LICHEN_SOURCES,
  },
});

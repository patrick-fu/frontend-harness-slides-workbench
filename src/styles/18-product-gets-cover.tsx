import { useEffect, type CSSProperties } from "react";
import type { BespokeStyleProps, StyleMetadata } from "../types";
import { useFLIP } from "../hooks/useFLIP";
import SpatialSceneTrack, {
  type BeatLayoutMode,
  type SceneTransitionMap,
} from "./SpatialSceneTrack";
import { defineStyleTopic } from "./topic";
import styles from "./18-product-gets-cover.module.css";

type Lang = "en" | "zh";
type SceneId = 1 | 2 | 3 | 4 | 5;

interface SceneCopy {
  section: string;
  title: string;
  subtitle: string;
  kicker: string;
  quote?: string;
  byline?: string;
  footline: string;
  items: string[];
}

const SCENE_IDS: SceneId[] = [1, 2, 3, 4, 5];

const TRANSITION_MAP: SceneTransitionMap = {
  "1->2": "scale-fade",
  "2->1": "scale-fade",
  "2->3": "page-flip",
  "3->2": "page-flip",
  "3->4": "slide-x",
  "4->3": "slide-x",
  "4->5": "fade",
  "5->4": "fade",
};

const BEAT_LAYOUT_MODES: Record<SceneId, BeatLayoutMode> = {
  1: "motion",
  2: "motion",
  3: "motion",
  4: "motion",
  5: "motion",
};

const SCENES: Record<SceneId, Record<Lang, SceneCopy>> = {
  1: {
    en: {
      section: "Cover",
      title: "The Object Earns the Cover",
      subtitle: "A quiet product becomes the whole issue.",
      kicker: "Issue 18 / Spring field note",
      footline: "Cover story / product edition",
      items: ["New silhouette", "Proof in use", "Designed to be remembered"],
    },
    zh: {
      section: "封面",
      title: "产品登上封面",
      subtitle: "一个安静的产品，成为整期杂志的中心。",
      kicker: "第 18 期 / 春季观察",
      footline: "封面故事 / 产品专号",
      items: ["新轮廓", "使用中的证明", "被记住的设计"],
    },
  },
  2: {
    en: {
      section: "Feature Quote",
      title: "Design is how it works. Style is how it speaks.",
      subtitle: "The cover line changes the product from object to argument.",
      kicker: "Feature interview",
      quote: "The product stopped asking for attention once the page gave it a point of view.",
      byline: "Editorial desk",
      footline: "Feature quote / page 24",
      items: ["Function first", "Tone becomes memory", "Every edge has an opinion"],
    },
    zh: {
      section: "专题引语",
      title: "设计决定它如何工作，风格决定它如何开口。",
      subtitle: "封面句把产品从物件变成观点。",
      kicker: "专题访谈",
      quote: "当页面给了它立场，产品就不再需要主动争取注意力。",
      byline: "编辑部",
      footline: "专题引语 / 第 24 页",
      items: ["功能先行", "语气成为记忆", "每条边都有态度"],
    },
  },
  3: {
    en: {
      section: "Spread",
      title: "Inside the issue, the object gets room to breathe.",
      subtitle: "A two-page spread turns a single artifact into a system of reasons.",
      kicker: "Center spread",
      footline: "Spread / pages 36-37",
      items: ["Left page: premise", "Right page: proof", "Spine: the edit holds"],
    },
    zh: {
      section: "跨页",
      title: "进入内页，产品有了呼吸的空间。",
      subtitle: "两页跨版把一个物件展开成一套理由。",
      kicker: "中心跨页",
      footline: "跨页 / 第 36-37 页",
      items: ["左页：命题", "右页：证明", "书脊：编辑线索"],
    },
  },
  4: {
    en: {
      section: "Fashion Detail",
      title: "The detail shot makes utility feel dressed.",
      subtitle: "A crop, a seam, a label: evidence becomes attitude.",
      kicker: "Close read",
      footline: "Detail study / page 52",
      items: ["Surface", "Cut", "Gesture", "Finish"],
    },
    zh: {
      section: "时装细节",
      title: "细节镜头让实用性穿上外衣。",
      subtitle: "裁切、边线、标签：证据变成态度。",
      kicker: "近距离阅读",
      footline: "细节研究 / 第 52 页",
      items: ["表面", "切线", "手势", "收口"],
    },
  },
  5: {
    en: {
      section: "Back Page",
      title: "Some things deserve the cover.",
      subtitle: "The final line sends the product back into the world with an editorial stance.",
      kicker: "Back page line",
      footline: "End matter / issue 18",
      items: ["Keep the title", "Keep the object", "Let the line close"],
    },
    zh: {
      section: "封底",
      title: "有些东西，值得登上封面。",
      subtitle: "最后一句让产品带着编辑立场回到世界里。",
      kicker: "封底短句",
      footline: "尾页 / 第 18 期",
      items: ["留下标题", "留下物件", "让短句收束"],
    },
  },
};

const METADATA: Record<Lang, StyleMetadata> = {
  en: {
    id: "magazine-masthead",
    band: "editorial-print",
    name: "Magazine Masthead",
    theme: "A Product Gets a Cover",
    densityLabel: "Medium-full",
    heroScene: 1,
    colors: {
      bg: "#00623f",
      ink: "#071010",
      panel: "#f3e5c6",
    },
    typography: {
      header: "Playfair Display 900",
      body: "Inter 700",
    },
    tags: ["editorial", "magazine", "masthead", "cover", "print"],
    fonts: ["Playfair Display", "Inter", "cjk:Noto Serif SC"],
    scenes: [
      {
        id: 1,
        title: "Cover",
        beats: [
          {
            id: 0,
            action: "Masthead and object lock into the cover frame.",
            title: "The Object Earns the Cover",
            body: "A quiet product becomes the whole issue.",
          },
          {
            id: 1,
            action: "Cover lines enter and push the editorial field.",
            title: "The Object Earns the Cover",
            body: "New silhouette, proof in use, designed to be remembered.",
          },
          {
            id: 2,
            action: "The cover settles with barcode, rules, and issue furniture.",
            title: "The Object Earns the Cover",
            body: "The object is now the publication's point of view.",
          },
        ],
      },
      {
        id: 2,
        title: "Feature Quote",
        beats: [
          {
            id: 0,
            action: "A feature quote appears as the lead voice.",
            title: "Design is how it works.",
            body: "The quote reframes the object as editorial argument.",
          },
          {
            id: 1,
            action: "Byline and supporting notes enter below the quote.",
            title: "Style is how it speaks.",
            body: "Function, tone, and memory align.",
          },
          {
            id: 2,
            action: "The quote resolves into a published pull line.",
            title: "The page gives it a point of view.",
            body: "The product no longer has to ask for attention.",
          },
        ],
      },
      {
        id: 3,
        title: "Spread",
        beats: [
          {
            id: 0,
            action: "The center spread opens on a warm paper surface.",
            title: "Inside the issue",
            body: "A single object becomes a two-page argument.",
          },
          {
            id: 1,
            action: "Left-page premise and right-page proof enter.",
            title: "Room to breathe",
            body: "The layout lets the artifact explain itself.",
          },
          {
            id: 2,
            action: "Captions, spine, and image blocks complete the spread.",
            title: "The edit holds",
            body: "The product becomes a system of reasons.",
          },
        ],
      },
      {
        id: 4,
        title: "Fashion Detail",
        beats: [
          {
            id: 0,
            action: "A cropped product detail fills the frame.",
            title: "The detail shot",
            body: "Utility starts to feel dressed.",
          },
          {
            id: 1,
            action: "Material labels slide in around the crop.",
            title: "Surface, cut, gesture",
            body: "Evidence becomes attitude.",
          },
          {
            id: 2,
            action: "The oversized display letter frames the final detail.",
            title: "Finish",
            body: "The close read becomes the style proof.",
          },
        ],
      },
      {
        id: 5,
        title: "Back Page",
        beats: [
          {
            id: 0,
            action: "The back page reduces the issue to one line.",
            title: "Some things deserve the cover.",
            body: "The final page keeps only the product and stance.",
          },
          {
            id: 1,
            action: "Object and footline return as restrained publication furniture.",
            title: "Some things deserve the cover.",
            body: "The product goes back into the world with a point of view.",
          },
        ],
      },
    ],
  },
  zh: {
    id: "magazine-masthead",
    band: "editorial-print",
    name: "杂志刊头",
    theme: "一个产品登上封面",
    densityLabel: "中高密度",
    heroScene: 1,
    colors: {
      bg: "#00623f",
      ink: "#071010",
      panel: "#f3e5c6",
    },
    typography: {
      header: "Playfair Display 900 / Noto Serif SC 900",
      body: "Inter 700 / Noto Serif SC 700",
    },
    tags: ["editorial", "magazine", "masthead", "cover", "print"],
    fonts: ["Playfair Display", "Inter", "cjk:Noto Serif SC"],
    scenes: [
      {
        id: 1,
        title: "封面",
        beats: [
          {
            id: 0,
            action: "刊头和产品进入封面框架。",
            title: "产品登上封面",
            body: "一个安静的产品，成为整期杂志的中心。",
          },
          {
            id: 1,
            action: "封面线索进入，并推动编辑场。",
            title: "产品登上封面",
            body: "新轮廓、使用证明、被记住的设计。",
          },
          {
            id: 2,
            action: "条码、规则线和期号信息完成封面。",
            title: "产品登上封面",
            body: "产品成为出版物的观点。",
          },
        ],
      },
      {
        id: 2,
        title: "专题引语",
        beats: [
          {
            id: 0,
            action: "专题引语作为主声音出现。",
            title: "设计决定它如何工作。",
            body: "引语把物件改写成编辑观点。",
          },
          {
            id: 1,
            action: "署名和支持信息进入引语下方。",
            title: "风格决定它如何开口。",
            body: "功能、语气和记忆对齐。",
          },
          {
            id: 2,
            action: "引语收束成已发表的拉页句。",
            title: "页面给了它立场。",
            body: "产品不再需要主动争取注意力。",
          },
        ],
      },
      {
        id: 3,
        title: "跨页",
        beats: [
          {
            id: 0,
            action: "中心跨页打开在暖纸色表面上。",
            title: "进入内页",
            body: "一个物件变成两页论证。",
          },
          {
            id: 1,
            action: "左页命题和右页证明进入。",
            title: "有了呼吸空间",
            body: "版式让产品自己说明理由。",
          },
          {
            id: 2,
            action: "图注、书脊和图片区块完成跨页。",
            title: "编辑线索成立",
            body: "产品成为一套理由。",
          },
        ],
      },
      {
        id: 4,
        title: "时装细节",
        beats: [
          {
            id: 0,
            action: "裁切后的产品细节占据画面。",
            title: "细节镜头",
            body: "实用性开始穿上外衣。",
          },
          {
            id: 1,
            action: "材质标签围绕裁切画面滑入。",
            title: "表面、切线、手势",
            body: "证据变成态度。",
          },
          {
            id: 2,
            action: "巨大的展示字母框住最后细节。",
            title: "收口",
            body: "近距离阅读成为风格证明。",
          },
        ],
      },
      {
        id: 5,
        title: "封底",
        beats: [
          {
            id: 0,
            action: "封底把整期杂志压缩成一句话。",
            title: "有些东西，值得登上封面。",
            body: "最后一页只保留产品和立场。",
          },
          {
            id: 1,
            action: "产品和脚注线作为克制的出版物信息回归。",
            title: "有些东西，值得登上封面。",
            body: "产品带着观点回到世界里。",
          },
        ],
      },
    ],
  },
};

function useMagazineFonts() {
  useEffect(() => {
    const id = "style-18-product-cover-v2-fonts";
    if (document.getElementById(id)) return;

    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Inter:wght@500;700;900&family=Noto+Serif+SC:wght@700;900&family=Playfair+Display:wght@800;900&display=swap";
    document.head.appendChild(link);
  }, []);
}

function clampScene(scene: number): SceneId {
  return SCENE_IDS.includes(scene as SceneId) ? (scene as SceneId) : 1;
}

function getVisibleItems(items: string[], beat: number): string[] {
  return items.slice(0, Math.min(items.length, beat + 1));
}

function getCopy(scene: SceneId, language: Lang): SceneCopy {
  return SCENES[scene][language];
}

function ProductMark({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={[styles.productMark, compact ? styles.productMarkCompact : ""]
        .filter(Boolean)
        .join(" ")}
      aria-hidden="true"
    >
      <div className={styles.productCap} />
      <div className={styles.productBottle}>
        <div className={styles.productLabel} />
      </div>
    </div>
  );
}

function DoubleRule() {
  return (
    <span className={styles.doubleRule} aria-hidden="true">
      <span />
      <span />
    </span>
  );
}

function MastheadChrome({ language }: { language: Lang }) {
  return (
    <header className={styles.masthead}>
      <div className={styles.issueBadge}>
        <span>18</span>
        <small>{language === "zh" ? "杂志刊头" : "Magazine Masthead"}</small>
      </div>
      <div className={styles.mastheadCenter}>
        <span className={styles.mastheadTitle}>Magazine</span>
        <div className={styles.mastheadMeta}>
          <span>{language === "zh" ? "产品专号" : "Product issue"}</span>
          <DoubleRule />
          <span>{language === "zh" ? "春季版" : "Spring edition"}</span>
        </div>
      </div>
      <div className={styles.topicBadge}>
        <span>{language === "zh" ? "主题" : "Topic"}</span>
        <strong>
          {language === "zh" ? "一个产品登上封面" : "A Product Gets a Cover"}
        </strong>
      </div>
    </header>
  );
}

function IssueStrip({
  scene,
  language,
  onNavigate,
}: {
  scene: SceneId;
  language: Lang;
  onNavigate?: (scene: number, beat: number) => void;
}) {
  return (
    <nav className={styles.issueStrip} aria-label="Magazine issue navigation">
      <div className={styles.issueStripLabel}>
        {language === "zh" ? "期号导航" : "Issue strip"}
      </div>
      {SCENE_IDS.map((sceneId) => {
        const copy = getCopy(sceneId, language);
        const active = sceneId === scene;
        return (
          <button
            className={[styles.issueButton, active ? styles.issueButtonActive : ""]
              .filter(Boolean)
              .join(" ")}
            type="button"
            key={sceneId}
            onClick={() => onNavigate?.(sceneId, 0)}
            aria-current={active ? "step" : undefined}
          >
            <span>{String(sceneId).padStart(2, "0")}</span>
            <strong>{copy.section}</strong>
          </button>
        );
      })}
    </nav>
  );
}

function BeatList({
  copy,
  beat,
  className,
}: {
  copy: SceneCopy;
  beat: number;
  className?: string;
}) {
  return (
    <ul className={[styles.beatList, className].filter(Boolean).join(" ")}>
      {getVisibleItems(copy.items, beat).map((item, index) => (
        <li
          key={item}
          data-beat-layout-item="true"
          className={styles.beatItem}
          style={{ "--reveal-index": index } as CSSProperties}
        >
          {item}
        </li>
      ))}
    </ul>
  );
}

function CoverScene({ copy, beat }: { copy: SceneCopy; beat: number }) {
  return (
    <section className={[styles.scene, styles.coverScene].join(" ")}>
      <div className={styles.coverFrame} data-beat-layout-item="true">
        <div className={styles.coverTopline}>
          <span>{copy.kicker}</span>
          <DoubleRule />
          <span>{copy.section}</span>
        </div>
        <h1 className={styles.coverTitle}>{copy.title}</h1>
        <p className={styles.coverSubtitle}>{copy.subtitle}</p>
        <ProductMark />
        {beat >= 1 && <BeatList copy={copy} beat={beat} className={styles.coverLines} />}
        {beat >= 2 && (
          <div className={styles.barcode} data-beat-layout-item="true" aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>
        )}
      </div>
      <p className={styles.sceneFootline} data-beat-layout-item="true">
        {copy.footline}
      </p>
    </section>
  );
}

function QuoteScene({ copy, beat }: { copy: SceneCopy; beat: number }) {
  return (
    <section className={[styles.scene, styles.quoteScene].join(" ")}>
      <div className={styles.quoteOrnament} data-beat-layout-item="true">
        <DoubleRule />
        <span>{copy.kicker}</span>
        <DoubleRule />
      </div>
      <blockquote className={styles.featureQuote} data-beat-layout-item="true">
        <span>“</span>
        {beat >= 0 ? copy.title : copy.section}
        <span>”</span>
      </blockquote>
      {beat >= 1 && (
        <p className={styles.quoteBody} data-beat-layout-item="true">
          {copy.quote}
        </p>
      )}
      {beat >= 2 && (
        <div className={styles.quoteFooter} data-beat-layout-item="true">
          <strong>{copy.byline}</strong>
          <BeatList copy={copy} beat={beat} />
        </div>
      )}
      <p className={styles.sceneFootline} data-beat-layout-item="true">
        {copy.footline}
      </p>
    </section>
  );
}

function SpreadScene({ copy, beat }: { copy: SceneCopy; beat: number }) {
  return (
    <section className={[styles.scene, styles.spreadScene].join(" ")}>
      <div className={styles.spreadBook} data-beat-layout-item="true">
        <div className={styles.leftPage}>
          <span className={styles.dropCap}>A</span>
          <h2>{copy.title}</h2>
          {beat >= 1 && <p>{copy.subtitle}</p>}
          {beat >= 2 && <BeatList copy={copy} beat={beat} />}
        </div>
        <div className={styles.spine} aria-hidden="true" />
        <div className={styles.rightPage}>
          <div className={styles.imageBlock}>
            <ProductMark compact />
          </div>
          {beat >= 1 && <div className={styles.captionBlock}>{copy.kicker}</div>}
          {beat >= 2 && (
            <div className={styles.textColumns} aria-hidden="true">
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
            </div>
          )}
        </div>
      </div>
      <p className={styles.sceneFootline} data-beat-layout-item="true">
        {copy.footline}
      </p>
    </section>
  );
}

function DetailScene({ copy, beat }: { copy: SceneCopy; beat: number }) {
  return (
    <section className={[styles.scene, styles.detailScene].join(" ")}>
      <div className={styles.detailCrop} data-beat-layout-item="true">
        <span className={styles.detailLetter}>A</span>
        <ProductMark />
      </div>
      <div className={styles.detailCopy} data-beat-layout-item="true">
        <span className={styles.sectionLabel}>{copy.kicker}</span>
        <h2>{copy.title}</h2>
        {beat >= 1 && <p>{copy.subtitle}</p>}
        {beat >= 2 && <BeatList copy={copy} beat={beat} />}
      </div>
      <p className={styles.sceneFootline} data-beat-layout-item="true">
        {copy.footline}
      </p>
    </section>
  );
}

function BackPageScene({ copy, beat }: { copy: SceneCopy; beat: number }) {
  return (
    <section className={[styles.scene, styles.backPageScene].join(" ")}>
      <div className={styles.backPageCard} data-beat-layout-item="true">
        <span className={styles.sectionLabel}>{copy.kicker}</span>
        <DoubleRule />
        <h2>{copy.title}</h2>
        {beat >= 1 && (
          <>
            <p>{copy.subtitle}</p>
            <ProductMark compact />
          </>
        )}
      </div>
      <p className={styles.sceneFootline} data-beat-layout-item="true">
        {copy.footline}
      </p>
    </section>
  );
}

function ScenePanel({
  scene,
  beat,
  language,
  motionDisabled,
  isActive,
}: {
  scene: SceneId;
  beat: number;
  language: Lang;
  motionDisabled: boolean;
  isActive: boolean;
}) {
  const copy = getCopy(scene, language);
  const { ref } = useFLIP<HTMLDivElement>({
    watch: [scene, beat, language],
    disabled: motionDisabled || !isActive,
    duration: 520,
    easing: "cubic-bezier(0.16, 1, 0.3, 1)",
    selector: '[data-beat-layout-item="true"]',
  });

  return (
    <div
      ref={ref}
      className={styles.sceneMotionRoot}
      data-beat-layout-container="true"
      data-beat-layout-mode="motion"
    >
      {scene === 1 && <CoverScene copy={copy} beat={beat} />}
      {scene === 2 && <QuoteScene copy={copy} beat={beat} />}
      {scene === 3 && <SpreadScene copy={copy} beat={beat} />}
      {scene === 4 && <DetailScene copy={copy} beat={beat} />}
      {scene === 5 && <BackPageScene copy={copy} beat={beat} />}
    </div>
  );
}

export function getMetadata(lang: Lang): StyleMetadata {
  return METADATA[lang];
}

export default function ProductGetsCoverV2({
  scene,
  beat,
  language,
  isThumbnail,
  reducedMotion,
  onNavigate,
}: BespokeStyleProps) {
  useMagazineFonts();

  const currentScene = clampScene(scene);
  const motionDisabled = reducedMotion || isThumbnail;

  return (
    <div
      className={styles.root}
      data-motion={motionDisabled ? "reduced" : "full"}
      data-thumbnail={isThumbnail ? "true" : undefined}
    >
      <MastheadChrome language={language} />
      <div
        className={[
          styles.trackShell,
          isThumbnail ? styles.trackShellThumbnail : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <SpatialSceneTrack
          scene={currentScene}
          beat={beat}
          sceneIds={SCENE_IDS}
          transitionKind="scale-fade"
          transitionMap={TRANSITION_MAP}
          transitionDurationMs={760}
          reducedMotion={motionDisabled}
          beatLayoutModes={BEAT_LAYOUT_MODES}
          className={styles.spatialTrack}
          renderScene={(sceneId, sceneBeat, isActive) => (
            <ScenePanel
              scene={clampScene(sceneId)}
              beat={sceneBeat}
              language={language}
              motionDisabled={motionDisabled}
              isActive={isActive}
            />
          )}
        />
      </div>
      {!isThumbnail && (
        <IssueStrip
          scene={currentScene}
          language={language}
          onNavigate={onNavigate}
        />
      )}
    </div>
  );
}

export const productGetsCoverTopic = defineStyleTopic({
  id: "product-cover",
  topic: {
    en: "Product Cover",
    zh: "产品封面",
  },
  model: "GPT 5.5",
  component: ProductGetsCoverV2,
  getMetadata,
});

import {
  defineTopic,
  type TopicMetadata,
  type TopicStageProps,
  type TopicTransitionScore,
} from "../domain/topic";
import SpatialSceneTrack from "../components/stage/SpatialSceneTrack";
import type { SceneTransitionMap } from "../components/stage/SpatialSceneTrack";
import styles from "./anatomy-of-an-idea.module.css";

/* ── Botanical Specimen Plate � · "Anatomy of an Idea" ──────────────
   An idea dissected like a pressed herbarium specimen. Engraving precision,
   taxonomic label furniture, aged-paper stillness. Layout in cqw/cqh only. */

type Lang = "en" | "zh";

const NUMERALS = ["I", "II", "III", "IV", "V"];

/* Bilingual content — NOT declared `as const`. Both languages share the exact
   same structure; only the strings differ. */
const CONTENT: Record<Lang, {
  theme: string;
  densityLabel: string;
  plate: string;
  specimen: { binomial: string; common: string };
  scenes: Array<{
    title: string;
    beats: Array<{ action: string; title: string; body: string }>;
    plateCaption?: string;
    callouts?: Array<{ tag: string; latin: string; body: string }>;
    detail?: { latin: string; hint: string; body: string };
    taxon?: {
      binomial: string;
      family: string;
      ranks: Array<[string, string]>;
      attribution: { label: string; value: string }[];
    };
    full?: {
      herbarium: string;
      accession: string;
      binomial: string;
      meta: string;
    };
  }>;
}> = {
  en: {
    theme: "Anatomy of an Idea",
    densityLabel: "Sparse · Herbarium",
    plate: "Plate",
    specimen: { binomial: "Idea lucida", common: "The Cultivated Thought" },
    scenes: [
      {
        title: "The Whole Specimen",
        plateCaption: "the idea entire — pressed, mounted, and held to the light",
        beats: [
          {
            action: "Mount the specimen",
            title: "Plate I",
            body: "The whole idea, centered and pressed against the sheet.",
          },
        ],
      },
      {
        title: "The Parts",
        callouts: [
          { tag: "Fig. a", latin: "Flos", body: "The bloom — the claim that opens at the top." },
          { tag: "Fig. b", latin: "Caulis", body: "The stem — the argument bearing it upward." },
          { tag: "Fig. c", latin: "Radix", body: "The root — the premise it quietly grows from." },
        ],
        beats: [
          { action: "Label the bloom", title: "Flos", body: "Name the claim the idea presents." },
          { action: "Label the stem", title: "Caulis", body: "Trace the argument that carries it." },
          { action: "Label the root", title: "Radix", body: "Expose the premise beneath the soil." },
        ],
      },
      {
        title: "The Detail",
        detail: {
          latin: "Nervatio",
          hint: "Fig. d — magnified ×12",
          body: "Venation: the finer reasoning that feeds every claim, visible only under the lens.",
        },
        beats: [
          { action: "Magnify a section", title: "Nervatio", body: "Bring the hidden structure into focus." },
          { action: "Trace the veins", title: "The finer reasoning", body: "Follow the lines that feed the whole." },
        ],
      },
      {
        title: "The Taxonomy",
        taxon: {
          binomial: "Idea lucida",
          family: "Cognitaceae",
          ranks: [
            ["Regnum", "Ratio"],
            ["Ordo", "Inventio"],
            ["Genus", "Idea"],
            ["Species", "lucida"],
          ],
          attribution: [
            { label: "Collected", value: "P. Fu" },
            { label: "Locality", value: "Marginalia, north light" },
            { label: "Determined", value: "Anno MMXXVI" },
          ],
        },
        beats: [
          { action: "Name it", title: "Binomial", body: "Idea lucida — the classified thought." },
          { action: "Rank it", title: "Classification", body: "Its place in the order of thought." },
          { action: "Attribute it", title: "Locality", body: "Collected, credited, and dated." },
        ],
      },
      {
        title: "Pressed & Catalogued",
        full: {
          herbarium: "Herbarium of Ideas",
          accession: "Accession No. 26",
          binomial: "Idea lucida",
          meta: "P. Fu · Marginalia, north light · MMXXVI",
        },
        beats: [
          {
            action: "File the sheet",
            title: "Pressed",
            body: "The complete plate, catalogued and returned to the drawer.",
          },
        ],
      },
    ],
  },
  zh: {
    theme: "想法解剖",
    densityLabel: "疏朗 · 标本",
    plate: "图版",
    specimen: { binomial: "Idea lucida", common: "栽培之思" },
    scenes: [
      {
        title: "完整标本",
        plateCaption: "一枚完整的想法 —— 压平、装裱、迎光而观",
        beats: [
          {
            action: "装裱标本",
            title: "图版 I",
            body: "完整的想法，居中压平于台纸之上。",
          },
        ],
      },
      {
        title: "各个部件",
        callouts: [
          { tag: "图 甲", latin: "Flos", body: "花 —— 顶端绽放的主张。" },
          { tag: "图 乙", latin: "Caulis", body: "茎 —— 承托其向上的论证。" },
          { tag: "图 丙", latin: "Radix", body: "根 —— 它悄然生长所依的前提。" },
        ],
        beats: [
          { action: "标注花部", title: "Flos", body: "命名想法所呈现的主张。" },
          { action: "标注茎部", title: "Caulis", body: "追溯承载它的论证。" },
          { action: "标注根部", title: "Radix", body: "揭示土壤之下的前提。" },
        ],
      },
      {
        title: "细部",
        detail: {
          latin: "Nervatio",
          hint: "图 丁 —— 放大 ×12",
          body: "脉络：滋养每一处主张的细密推理，唯有透镜之下方可得见。",
        },
        beats: [
          { action: "放大一处", title: "Nervatio", body: "使隐藏的结构进入焦点。" },
          { action: "描摹脉络", title: "细密推理", body: "循着滋养整体的纹路。" },
        ],
      },
      {
        title: "分类归属",
        taxon: {
          binomial: "Idea lucida",
          family: "Cognitaceae",
          ranks: [
            ["界", "Ratio"],
            ["目", "Inventio"],
            ["属", "Idea"],
            ["种", "lucida"],
          ],
          attribution: [
            { label: "采集", value: "P. Fu" },
            { label: "产地", value: "页边，北向天光" },
            { label: "鉴定", value: "MMXXVI 年" },
          ],
        },
        beats: [
          { action: "命名", title: "双名", body: "Idea lucida —— 被分类的思想。" },
          { action: "定阶", title: "分类", body: "它在思想秩序中的位置。" },
          { action: "标注归属", title: "产地", body: "采集、署名、纪年。" },
        ],
      },
      {
        title: "压制归档",
        full: {
          herbarium: "想法标本馆",
          accession: "登录号 26",
          binomial: "Idea lucida",
          meta: "P. Fu · 页边，北向天光 · MMXXVI",
        },
        beats: [
          {
            action: "归档台纸",
            title: "压制完成",
            body: "完整的图版，归档入册，重回抽屉。",
          },
        ],
      },
    ],
  },
};

/* ── the drawn specimen: a pressed sprig standing in for the idea ──────── */
function Specimen({ variant }: { variant?: "full" | "ghost" | "mini" }) {
  const petals = [0, 1, 2, 3, 4, 5];
  const hairs = [-26, -14, -3, 8, 20];
  return (
    <div className={styles.specimen} data-variant={variant ?? "full"} aria-hidden>
      <div className={styles.bloom}>
        {petals.map((p) => (
          <span
            key={p}
            className={styles.petal}
            style={{ transform: `rotate(${p * 60}deg)` }}
          />
        ))}
        <span className={styles.bloomCore} />
      </div>
      <span className={styles.stem} />
      {[1, 2, 3].map((row) => (
        <span key={`l${row}`} className={styles.leaf} data-side="l" data-row={row} />
      ))}
      {[1, 2, 3].map((row) => (
        <span key={`r${row}`} className={styles.leaf} data-side="r" data-row={row} />
      ))}
      <div className={styles.rootHairs}>
        {hairs.map((deg, i) => (
          <span
            key={i}
            className={styles.rootHair}
            style={{ transform: `rotate(${deg}deg)` }}
          />
        ))}
      </div>
    </div>
  );
}

/* ── one plate (scene content) ─────────────────────────────────────────── */
function PlateScene({
  scene,
  beat,
  isActive,
  language,
}: {
  scene: number;
  beat: number;
  isActive: boolean;
  language: Lang;
}) {
  const t = CONTENT[language];
  const s = t.scenes[scene - 1];
  const plateMark = `${t.plate} ${NUMERALS[scene - 1]}`;

  if (scene === 1) {
    return (
      <div className={styles.scene}>
        <div className={styles.sceneHeader}>
          <span className={styles.plateMark}>{plateMark}</span>
        </div>
        <div className={styles.stageCol}>
          <div className={styles.specimenStage} data-active={isActive}>
            <Specimen />
          </div>
        </div>
        <div className={styles.sceneFooter}>
          <span className={`${styles.binomial} ${styles.caption}`}>{t.specimen.binomial}</span>
          <span className={styles.captionRule} />
          <span className={styles.captionText}>{s.plateCaption}</span>
        </div>
      </div>
    );
  }

  if (scene === 2) {
    const callouts = s.callouts ?? [];
    const pos = ["2", "1", "0"];
    return (
      <div className={styles.scene}>
        <div className={styles.sceneHeader}>
          <span className={styles.plateMark}>{plateMark}</span>
        </div>
        <div className={styles.stageCol}>
          <div className={styles.specimenStage} data-active={isActive}>
            <Specimen />
            <div
              className={styles.callouts}
              data-beat-layout-container="true"
              data-beat-layout-mode="reserved"
            >
              {callouts.map((c, i) => (
                <div
                  key={i}
                  className={`${styles.callout} ${styles.slot}`}
                  data-beat-layout-item="true"
                  data-pos={pos[i]}
                  data-on={beat >= i}
                >
                  <span className={styles.leader} />
                  <div className={styles.calloutText}>
                    <span className={styles.tagMark}>{c.tag}</span>
                    <span className={styles.calloutLatin}>{c.latin}</span>
                    <span className={styles.calloutBody}>{c.body}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className={styles.sceneFooter}>
          <span className={styles.captionText}>{s.title}</span>
        </div>
      </div>
    );
  }

  if (scene === 3) {
    const d = s.detail;
    return (
      <div className={styles.scene}>
        <div className={styles.sceneHeader}>
          <span className={styles.plateMark}>{plateMark}</span>
        </div>
        <div className={styles.stageCol}>
          <div
            className={styles.specimenStage}
            data-active={isActive}
            data-beat-layout-container="true"
            data-beat-layout-mode="reserved"
          >
            <div className={styles.lens} data-beat-layout-item="true">
              <div className={styles.lensHatch} />
              <span className={styles.lensVein} />
            </div>
            <div className={styles.detailLabel} data-beat-layout-item="true">
              <span className={styles.tagMark}>{d?.hint}</span>
              <span className={styles.detailLatin}>{d?.latin}</span>
              <span className={`${styles.detailBody} ${styles.slot}`} data-on={beat >= 1}>
                {d?.body}
              </span>
            </div>
          </div>
        </div>
        <div className={styles.sceneFooter}>
          <span className={styles.captionText}>{s.title}</span>
        </div>
      </div>
    );
  }

  if (scene === 4) {
    const x = s.taxon;
    return (
      <div className={styles.scene}>
        <div className={styles.sceneHeader}>
          <span className={styles.plateMark}>{plateMark}</span>
        </div>
        <div className={styles.stageCol}>
          <div
            className={styles.taxonWrap}
            data-active={isActive}
            data-beat-layout-container="true"
            data-beat-layout-mode="reserved"
          >
            <div className={`${styles.binomialBig} ${styles.slot}`} data-beat-layout-item="true" data-on={beat >= 0}>
              <span className={styles.binomial}>{x?.binomial}</span>
              <span className={styles.family}>{x?.family}</span>
            </div>
            <div className={`${styles.rankTable} ${styles.slot}`} data-beat-layout-item="true" data-on={beat >= 1}>
              {(x?.ranks ?? []).map(([k, v], i) => (
                <div key={i} style={{ display: "contents" }}>
                  <span className={styles.rankKey}>{k}</span>
                  <span className={styles.rankVal}>{v}</span>
                </div>
              ))}
            </div>
            <div className={`${styles.attribution} ${styles.slot}`} data-beat-layout-item="true" data-on={beat >= 2}>
              {(x?.attribution ?? []).map((a, i) => (
                <span key={i}>
                  <span className={styles.smallcaps}>{a.label}: </span>
                  {a.value}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className={styles.sceneFooter}>
          <span className={styles.captionText}>{s.title}</span>
        </div>
      </div>
    );
  }

  // scene 5 — pressed & catalogued
  const f = s.full;
  return (
    <div className={styles.scene}>
      <div className={styles.sceneHeader}>
        <span className={styles.plateMark}>{plateMark}</span>
      </div>
      <div className={styles.stageCol}>
        <div className={styles.specimenStage} data-active={isActive}>
          <Specimen variant="ghost" />
          <Specimen variant="mini" />
        </div>
      </div>
      <div className={styles.fullLabel}>
        <div className={styles.labelRow}>
          <span>{f?.herbarium}</span>
          <span>{f?.accession}</span>
        </div>
        <span className={styles.binomial}>{f?.binomial}</span>
        <span className={styles.metaLine}>{f?.meta}</span>
      </div>
    </div>
  );
}

/* ── N5 navigation prototype: the plate spine (small-caps numerals) ────── */
function PlateSpine({
  scene,
  language,
  onNavigate,
}: {
  scene: number;
  language: Lang;
  onNavigate?: (scene: number, beat: number) => void;
}) {
  const plate = CONTENT[language].plate;
  return (
    <nav
      className={styles.spine}
      aria-label="plates"
      data-topic-navigation="true"
      data-navigation-geometry="typographic-index"
      data-navigation-carrier="idea-plate-numerals"
      data-navigation-invocation="click-expand"
      data-navigation-feedback="next-state-preview"
    >
      {NUMERALS.map((n, i) => {
        const target = i + 1;
        return (
          <button
            key={n}
            type="button"
            className={styles.spineBtn}
            data-current={scene === target}
            onClick={(e) => {
              e.stopPropagation();
              onNavigate?.(target, 0);
            }}
          >
            <span className={styles.spineNum}>{`${plate} ${n}`}</span>
          </button>
        );
      })}
    </nav>
  );
}

const ANATOMY_OF_AN_IDEA_TRANSITION_SCORE = {
  "1->2": "page-flip",
  "2->3": "fade",
  "3->4": "fade",
  "4->5": "page-flip",
} as const satisfies TopicTransitionScore;

const TRANSITIONS: SceneTransitionMap = ANATOMY_OF_AN_IDEA_TRANSITION_SCORE;

function TopicStage(props: TopicStageProps) {
  const { scene, beat, language, isThumbnail, reducedMotion, onNavigate } = props;
  const stillness = reducedMotion || isThumbnail;

  return (
    <div className={styles.root} data-motion={stillness ? "off" : "on"}>
      <div className={styles.sheetFrame} aria-hidden />
      <SpatialSceneTrack
        scene={scene}
        beat={beat}
        transitionKind="page-flip"
        transitionMap={TRANSITIONS}
        reducedMotion={stillness}
        beatLayoutModes={{ 2: "reserved", 3: "reserved", 4: "reserved" }}
        renderScene={(sceneId, sceneBeat, isActive) => (
          <PlateScene
            scene={sceneId}
            beat={sceneBeat}
            isActive={isActive}
            language={language}
          />
        )}
      />
      {!isThumbnail && (
        <PlateSpine scene={scene} language={language} onNavigate={onNavigate} />
      )}
    </div>
  );
}

function buildMetadata(lang: Lang): TopicMetadata {
  const t = CONTENT[lang];
  const tags =
    lang === "en"
      ? ["scholarly", "herbarium-still", "desaturated", "sepia-ink", "symmetrical", "barely-motion"]
      : ["学究", "标本静谧", "低饱和", "铁胆墨线", "对称居中", "近乎无动"];
  return {
    theme: t.theme,
    densityLabel: t.densityLabel,
    heroScene: 1,
    colors: { bg: "#e6dcc3", ink: "#3b2f24", panel: "#f0e8d4" },
    typography: {
      header: "EB Garamond · Small Caps",
      body: "EB Garamond",
    },
    tags,
    fonts: [
      "EB Garamond:ital,wght@0,400;0,500;1,400;1,500",
      "cjk:Noto Serif SC:wght@400;500",
    ],
    scenes: t.scenes.map((sc, i) => ({
      id: i + 1,
      title: sc.title,
      beats: sc.beats.map((b, bi) => ({
        id: bi,
        action: b.action,
        title: b.title,
        body: b.body,
      })),
    })),
  };
}

const METADATA = {
  en: buildMetadata("en"),
  zh: buildMetadata("zh"),
};

export default defineTopic({
  id: "anatomy-of-an-idea",
  styleId: "botanical-specimen-plate",
  title: {
    en: "Anatomy of an Idea",
    zh: "想法解剖",
  },
  modelId: "Claude Opus 4.8",
  Stage: TopicStage,
  metadata: METADATA,
  navigation: {
    geometry: "typographic-index",
    carrier: "idea-plate-numerals",
    invocation: "click-expand",
    feedback: "next-state-preview",
  },
  transitionScore: ANATOMY_OF_AN_IDEA_TRANSITION_SCORE,
  evidence: {
    kind: "illustrative",
    boundary: {
      en: "Illustrative idea anatomy: botanical taxonomy, specimen labels, and Latin names are metaphors for reasoning, not biological or taxonomic claims.",
      zh: "示例想法解剖：植物分类、标本标签与拉丁名称均为推理隐喻，并非生物学或分类学主张。",
    },
    display: "envelope",
  },
});

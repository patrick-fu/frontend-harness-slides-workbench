import {
  defineTopic,
  type TopicDefinition,
  type TopicMetadata,
  type TopicStageProps,
  type TopicTransitionScore,
} from "../domain/topic";
import SpatialSceneTrack from "../components/stage/SpatialSceneTrack";
import styles from "./what-ancients-knew.module.css";

const FOLIOS = ["i", "ii", "iii", "iv", "v"];

const TRANSITIONS = {
  "1->2": "fade",
  "2->3": "hard-cut",
  "3->4": "hard-cut",
  "4->5": "fade",
} as const satisfies TopicTransitionScore;

const BEAT_LAYOUT_MODES = { 2: "reserved", 3: "reserved", 4: "reserved" } as const;

/* ── Localized copy (en + zh kept structurally parallel) ─────── */
type Lang = "en" | "zh";

interface Copy {
  brand: string;
  folioWord: string;
  frontis: { kicker: string; title: string; sub: string; pin: string };
  claim: { glyph: string; quote: string; attribution: string; pin: string };
  evidence: {
    heading: string;
    rows: { num: string; text: string }[];
    pin: string;
  };
  gloss: {
    before: string;
    italic: string;
    roman: string;
    after: string;
    caption: string;
    pin: string;
  };
  colophon: { closing: string; finis: string; pin: string };
}

const COPY: Record<Lang, Copy> = {
  en: {
    brand: "SCHOLAR'S VELLUM",
    folioWord: "FOLIO",
    frontis: {
      kicker: "A Manuscript",
      title: "What the Ancients Knew",
      sub: "on the endurance of old knowledge",
      pin: "pinned after hours",
    },
    claim: {
      glyph: "\u201C",
      quote:
        "What is old is not therefore false; the oldest truths outlast the newest fashions.",
      attribution: "— the claim of this page",
      pin: "the thesis, stated plainly",
    },
    evidence: {
      heading: "Three witnesses",
      rows: [
        { num: "01", text: "Euclid's proofs still stand, unrevised, after two thousand years." },
        { num: "02", text: "The Stoics named what we now call resilience — and named it better." },
        { num: "03", text: "Old rivers of thought still water the fields we plant today." },
      ],
      pin: "counted, not bulleted",
    },
    gloss: {
      before: "The past does not merely inform us — it ",
      italic: "keeps",
      roman: "remembers",
      after: " for us.",
      caption: "one word turns upright",
      pin: "a quiet emphasis",
    },
    colophon: {
      closing: "Read slowly. The old pages are patient, and so is what they keep.",
      finis: "FINIS",
      pin: "the page is closed",
    },
  },
  zh: {
    brand: "学者羊皮卷",
    folioWord: "第",
    frontis: {
      kicker: "一卷手稿",
      title: "古人的智慧",
      sub: "论旧识之恒久",
      pin: "夜深所钉",
    },
    claim: {
      glyph: "\u201C",
      quote: "古者未必为谬；最古之真，长存于最新之风尚。",
      attribution: "— 本页之论",
      pin: "开宗明义之说",
    },
    evidence: {
      heading: "三则佐证",
      rows: [
        { num: "01", text: "欧几里得之证，历二千年而未改一字。" },
        { num: "02", text: "斯多噶早已命名今人所谓之韧性，且名之更精。" },
        { num: "03", text: "古老的思想之河，仍灌溉今人耕作之田。" },
      ],
      pin: "计数，而非圆点",
    },
    gloss: {
      before: "往昔非仅启示于我 —— 它替我们",
      italic: "守着",
      roman: "记得",
      after: "。",
      caption: "一字转为正体",
      pin: "一处静默的强调",
    },
    colophon: {
      closing: "缓缓读之。古页素有耐心，其所守者亦然。",
      finis: "卷 终",
      pin: "此页已合",
    },
  },
};

/* ── Signature pin-annotation (bottom-left, every slide) ─────── */
function Pin({ folio, phrase, brand, folioWord }: {
  folio: string;
  phrase: string;
  brand: string;
  folioWord: string;
}) {
  const folioLabel =
    folioWord === "第" ? `${folioWord} ${folio} 页` : `${folioWord} ${folio}`;
  return (
    <div className={styles.pin} aria-hidden="true">
      <span className={styles.pinTitle}>{brand}</span>
      <span className={styles.pinLine}>{folioLabel}</span>
      <span className={styles.pinLine}>{phrase}</span>
    </div>
  );
}

/* ── One scene of the manuscript ─────────────────────────────── */
function VellumScene({
  scene,
  beat,
  language,
}: {
  scene: number;
  beat: number;
  language: Lang;
}) {
  const c = COPY[language];
  const folio = FOLIOS[scene - 1] ?? "i";

  if (scene === 1) {
    return (
      <div className={styles.scene}>
        <div className={styles.frontis}>
          <span className={styles.kicker}>{c.frontis.kicker}</span>
          <h1 className={styles.title}>{c.frontis.title}</h1>
          <span className={styles.sub}>{c.frontis.sub}</span>
        </div>
        <Pin folio={folio} phrase={c.frontis.pin} brand={c.brand} folioWord={c.folioWord} />
      </div>
    );
  }

  if (scene === 2) {
    // reserved: attribution slot is held from beat 0, revealed at beat 1
    const showAttribution = beat >= 1;
    return (
      <div className={styles.scene}>
        <div
          className={styles.claim}
          data-beat-layout-container="true"
          data-beat-layout-mode="reserved"
        >
          <span className={styles.quoteGlyph} data-beat-layout-item="true" aria-hidden="true">
            {c.claim.glyph}
          </span>
          <p className={styles.quote} data-beat-layout-item="true">
            {c.claim.quote}
          </p>
          <span
            className={styles.attribution}
            data-beat-layout-item="true"
            style={{ opacity: showAttribution ? 1 : 0 }}
          >
            {c.claim.attribution}
          </span>
        </div>
        <Pin folio={folio} phrase={c.claim.pin} brand={c.brand} folioWord={c.folioWord} />
      </div>
    );
  }

  if (scene === 3) {
    // reserved: all three rows hold space; the third is revealed at beat 1
    return (
      <div className={styles.scene}>
        <div
          className={styles.evidence}
          data-beat-layout-container="true"
          data-beat-layout-mode="reserved"
        >
          <span className={styles.evHeading} data-beat-layout-item="true">
            {c.evidence.heading}
          </span>
          {c.evidence.rows.map((row, i) => (
            <div
              className={styles.evRow}
              data-beat-layout-item="true"
              key={row.num}
              style={{ opacity: beat >= 1 || i < 2 ? 1 : 0 }}
            >
              <span className={styles.evNum}>{row.num}</span>
              <span className={styles.evText}>{row.text}</span>
            </div>
          ))}
        </div>
        <Pin folio={folio} phrase={c.evidence.pin} brand={c.brand} folioWord={c.folioWord} />
      </div>
    );
  }

  if (scene === 4) {
    // reserved: the emphasis word switches italic -> roman amber at beat 1
    const upright = beat >= 1;
    return (
      <div className={styles.scene}>
        <div
          className={styles.gloss}
          data-beat-layout-container="true"
          data-beat-layout-mode="reserved"
        >
          <p className={styles.glossLine} data-beat-layout-item="true">
            {c.gloss.before}
            <span className={upright ? styles.glossRoman : styles.glossItalic}>
              {upright ? c.gloss.roman : c.gloss.italic}
            </span>
            {c.gloss.after}
          </p>
          <span
            className={styles.glossCaption}
            data-beat-layout-item="true"
            style={{ opacity: upright ? 1 : 0 }}
          >
            {c.gloss.caption}
          </span>
        </div>
        <Pin folio={folio} phrase={c.gloss.pin} brand={c.brand} folioWord={c.folioWord} />
      </div>
    );
  }

  // scene === 5 · Colophon
  return (
    <div className={styles.scene}>
      <div className={styles.colophon}>
        <p className={styles.closing}>{c.colophon.closing}</p>
        <span className={styles.finis}>{c.colophon.finis}</span>
      </div>
      <Pin folio={folio} phrase={c.colophon.pin} brand={c.brand} folioWord={c.folioWord} />
    </div>
  );
}

/* ── Folio spine (nav prototype N5) — dignified mono numerals ── */
function FolioSpine({
  scene,
  isThumbnail,
  onNavigate,
}: {
  scene: number;
  isThumbnail: boolean;
  onNavigate?: (scene: number, beat: number) => void;
}) {
  if (isThumbnail) return null;
  return (
    <nav
      className={styles.spine}
      aria-label="folio"
      data-topic-navigation="true"
      data-navigation-geometry="typographic-index"
      data-navigation-carrier="ancients-folio-counter"
      data-navigation-invocation="proximity-reveal"
      data-navigation-feedback="mechanical-displacement"
    >
      {FOLIOS.map((numeral, i) => {
        const target = i + 1;
        const active = target === scene;
        return (
          <button
            key={numeral}
            type="button"
            className={active ? styles.folioActive : styles.folio}
            aria-current={active ? "page" : undefined}
            aria-label={`Folio ${numeral}`}
            onClick={(e) => {
              e.stopPropagation();
              onNavigate?.(target, 0);
            }}
          >
            {numeral}
          </button>
        );
      })}
    </nav>
  );
}

/* ── Root component ──────────────────────────────────────────── */
function TopicStage({
  scene,
  beat,
  language,
  isThumbnail,
  reducedMotion,
  onNavigate,
}: TopicStageProps) {
  const still = reducedMotion || isThumbnail;
  const lang: Lang = language === "zh" ? "zh" : "en";

  return (
    <div className={`${styles.root} ${still ? styles.still : ""}`}>
      <SpatialSceneTrack
        scene={scene}
        beat={beat}
        transitionKind="fade"
        transitionMap={TRANSITIONS}
        reducedMotion={still}
        beatLayoutModes={BEAT_LAYOUT_MODES}
        renderScene={(sceneId, sceneBeat) => (
          <VellumScene scene={sceneId} beat={sceneBeat} language={lang} />
        )}
      />
      <FolioSpine scene={scene} isThumbnail={isThumbnail} onNavigate={onNavigate} />
    </div>
  );
}

/* ── Metadata (en + zh structurally identical) ───────────────── */
function buildMetadata(lang: Lang): TopicMetadata {
  const en = lang === "en";
  return {
    theme: en ? "What the Ancients Knew" : "古人的智慧",
    densityLabel: en ? "Low · one thought per page" : "低密度 · 一页一念",
    heroScene: 1,
    colors: { bg: "#1b1823", ink: "#e9d8b4", panel: "#232030" },
    typography: {
      header: en ? "Cormorant Garamond italic" : "思源宋体斜体",
      body: en ? "Alegreya Sans" : "思源黑体",
    },
    tags: en
      ? ["scholarly", "contemplative", "warm-dark", "low density", "amber serif", "stillness"]
      : ["学术", "沉思", "暖调深色", "低密度", "琥珀衬线", "静止"],
    fonts: [
      "Cormorant Garamond:ital,wght@1,500;1,600",
      "Alegreya Sans:wght@400;500",
      "Courier Prime:wght@400",
      "cjk:Noto Serif SC:wght@400;500",
      "cjk:Noto Sans SC:wght@400;500",
    ],
    scenes: [
      {
        id: 1,
        title: en ? "Frontispiece" : "扉页",
        beats: [
          {
            id: 0,
            action: en ? "Pin the title" : "钉上标题",
            title: en ? "What the Ancients Knew" : "古人的智慧",
            body: en
              ? "An amber italic title, pinned to the dark library wall."
              : "琥珀斜体标题，钉于幽暗的书斋墙上。",
          },
        ],
      },
      {
        id: 2,
        title: en ? "The Claim" : "立论",
        beats: [
          {
            id: 0,
            action: en ? "Open the quote" : "启引文",
            title: en ? "The oldest truths endure" : "最古之真长存",
            body: en
              ? "A centered pull-quote beneath a jewel opening glyph."
              : "居中的引语，其上有一枚碧色引号。",
          },
          {
            id: 1,
            action: en ? "Name the claim" : "点明所论",
            title: en ? "This is the thesis" : "此即论旨",
            body: en
              ? "A mono attribution surfaces, quiet and plain."
              : "打字机体署注浮现，安静而质朴。",
          },
        ],
      },
      {
        id: 3,
        title: en ? "The Evidence" : "佐证",
        beats: [
          {
            id: 0,
            action: en ? "Lay two witnesses" : "陈列二证",
            title: en ? "Counters, not bullets" : "计数，非圆点",
            body: en
              ? "A numbered list in mono, the first two witnesses shown."
              : "打字机体编号列表，先示前两则佐证。",
          },
          {
            id: 1,
            action: en ? "Reveal the third" : "揭出第三",
            title: en ? "Three witnesses stand" : "三证俱立",
            body: en
              ? "The third counter settles into its reserved slot."
              : "第三条落入其预留之位。",
          },
        ],
      },
      {
        id: 4,
        title: en ? "The Gloss" : "释义",
        beats: [
          {
            id: 0,
            action: en ? "Hold the line italic" : "保持斜体",
            title: en ? "All in one voice" : "同一声口",
            body: en
              ? "The whole line rests in italic serif, undifferentiated."
              : "整行安于斜体衬线，未加分别。",
          },
          {
            id: 1,
            action: en ? "Turn one word upright" : "一字转正",
            title: en ? "This is the line" : "即此一句",
            body: en
              ? "A single word switches to upright roman in brighter amber."
              : "唯一字转为正体罗马，琥珀更亮。",
          },
        ],
      },
      {
        id: 5,
        title: en ? "Colophon" : "尾记",
        beats: [
          {
            id: 0,
            action: en ? "Close the page" : "合上此页",
            title: en ? "Read slowly" : "缓缓读之",
            body: en
              ? "A pinned closing line; the manuscript rests."
              : "钉上的收束之语；手稿归于静。",
          },
        ],
      },
    ],
  };
}

const metadata = {
  en: buildMetadata("en"),
  zh: buildMetadata("zh"),
} satisfies TopicDefinition["metadata"];

export default defineTopic({
  id: "what-ancients-knew",
  styleId: "scholars-vellum",
  title: { en: "What the Ancients Knew", zh: "古人的智慧" },
  modelId: "Claude Opus 4.8",
  Stage: TopicStage,
  metadata,
  navigation: {
    geometry: "typographic-index",
    carrier: "ancients-folio-counter",
    invocation: "proximity-reveal",
    feedback: "mechanical-displacement",
  },
  transitionScore: TRANSITIONS,
  evidence: {
    kind: "illustrative",
    boundary: {
      en: "Illustrative scenario: names, figures, and outcomes are presentation examples, not external factual claims.",
      zh: "示例场景：其中名称、数字和结果均为演示内容，并非外部事实主张。",
    },
    display: "envelope",
  },
});

import type { BespokeStyleProps, StyleMetadata } from "../types";
import { defineStyleTopic } from "./topic";
import { curatedNavigationAttributes } from "./curated-topic-contract";
import SpatialSceneTrack from "./SpatialSceneTrack";
import type { SceneTransitionMap } from "./SpatialSceneTrack";
import { useFLIP } from "../hooks/useFLIP";
import styles from "./comeback-issue.module.css";

/* ── Magazine Masthead · v3 · The Comeback Issue ─────────────────────────
   The comeback told as a magazine cover story: one theatrical cover word per
   moment, masthead authority. Strict editorial triad — crimson field, warm
   paper, dark structural ink. Flat surfaces, double-rule ornament, footline
   furniture. cqw/cqh only. */

const FIELD = "#B11226"; // saturated crimson editorial field (dominant)
const PAPER = "#F2E7D2"; // warm paper alternate
const INK = "#17110E";

/* ── content ─────────────────────────────────────────────────────────── */
type Copy = {
  masthead: string;
  issue: string;
  coverSub: string;
  hero: string;
  fallLabel: string;
  fallWord: string;
  statValue: string;
  statLabel: string;
  fallNote: string;
  turnWords: [string, string, string];
  turnCaptions: [string, string, string];
  proofTiles: { value: string; key: string }[];
  ribbon: string;
  finalHero: string;
  finalLine: string;
  sections: [string, string, string, string, string];
};

const COPY: Record<"en" | "zh", Copy> = {
  en: {
    masthead: "THE COMEBACK ISSUE",
    issue: "ISSUE 03 · SPRING",
    coverSub: "A COVER STORY OF RETURN",
    hero: "RISE",
    fallLabel: "THE LOW",
    fallWord: "FALL",
    statValue: "-41%",
    statLabel: "MOMENTUM LOST",
    fallNote: "Where the story bottomed out — the long winter before the return.",
    turnWords: ["DOUBT", "DECIDE", "RETURN"],
    turnCaptions: [
      "The stillness right before the pivot.",
      "One choice reroutes everything after it.",
      "The headline swaps to the comeback.",
    ],
    proofTiles: [
      { value: "+63%", key: "REVENUE" },
      { value: "3.2×", key: "RETENTION" },
      { value: "No.1", key: "CATEGORY" },
    ],
    ribbon: "THE COMEBACK, VERIFIED",
    finalHero: "BACK",
    finalLine: "They wrote us off. We came back to write the cover.",
    sections: ["COVER", "THE FALL", "THE TURN", "THE PROOF", "COVER LINE"],
  },
  zh: {
    masthead: "回归特刊",
    issue: "第 03 期 · 春",
    coverSub: "一则关于归来的封面故事",
    hero: "崛起",
    fallLabel: "低谷",
    fallWord: "坠落",
    statValue: "-41%",
    statLabel: "势能流失",
    fallNote: "故事触底的地方——归来之前那个漫长的寒冬。",
    turnWords: ["犹疑", "抉择", "回归"],
    turnCaptions: [
      "转向之前那一刻的静止。",
      "一个选择改写此后全部走向。",
      "大标题切换成归来。",
    ],
    proofTiles: [
      { value: "+63%", key: "营收" },
      { value: "3.2×", key: "留存" },
      { value: "第一", key: "品类" },
    ],
    ribbon: "逆转 · 已核验",
    finalHero: "归来",
    finalLine: "他们早已写好我们的判词。我们归来，亲手写下封面。",
    sections: ["封面", "坠落", "转折", "佐证", "标语"],
  },
};

/* ── shared furniture ────────────────────────────────────────────────── */
function Masthead({ c, tone }: { c: Copy; tone: "field" | "paper" }) {
  return (
    <div className={styles.masthead}>
      <span className={styles.mastheadTitle}>{c.masthead}</span>
      <span className={styles.mastheadMeta}>
        {c.issue} · {tone === "field" ? "VOL.XII" : "SECTION"}
      </span>
    </div>
  );
}

/* ── scenes ──────────────────────────────────────────────────────────── */
type SceneProps = {
  beat: number;
  isActive: boolean;
  lang: "en" | "zh";
  still: boolean;
};

function CoverScene({ lang }: SceneProps) {
  const c = COPY[lang];
  return (
    <div className={`${styles.scene} ${styles.sceneField}`}>
      <Masthead c={c} tone="field" />
      <div className={styles.coverBody}>
        <div className={styles.ornament}>
          <div className={styles.ruleStack}>
            <span className={styles.rule} />
            <span className={styles.rule} />
          </div>
          <span className={`${styles.ornamentWord} ${styles.display} ${styles.heroWord}`}>
            {c.hero}
          </span>
          <div className={styles.ruleStack}>
            <span className={styles.rule} />
            <span className={styles.rule} />
          </div>
        </div>
        <span className={styles.coverSub}>{c.coverSub}</span>
      </div>
    </div>
  );
}

function FallScene({ beat, lang }: SceneProps) {
  const c = COPY[lang];
  const statOn = beat >= 1;
  return (
    <div className={`${styles.scene} ${styles.sceneField}`}>
      <Masthead c={c} tone="field" />
      <div className={styles.fallBody}>
        {/* reserved layout: tile word + stat slot both present from beat 0 */}
        <div
          className={styles.tile}
          data-beat-layout-container="true"
          data-beat-layout-mode="reserved"
        >
          <span className={styles.tileLabel}>{c.fallLabel}</span>
          <span
            className={`${styles.display} ${styles.tileWord}`}
            data-beat-layout-item="true"
          >
            {c.fallWord}
          </span>
          <div
            className={`${styles.statBlock} ${statOn ? styles.statOn : ""}`}
            data-beat-layout-item="true"
          >
            <span className={`${styles.display} ${styles.statValue}`}>{c.statValue}</span>
            <span className={styles.statLabel}>{c.statLabel}</span>
          </div>
          <p className={styles.tileNote}>{c.fallNote}</p>
        </div>
      </div>
    </div>
  );
}

function TurnScene({ beat, isActive, lang, still }: SceneProps) {
  const c = COPY[lang];
  const active = Math.min(beat, 2);
  const { ref } = useFLIP<HTMLDivElement>({
    watch: [beat],
    disabled: still || !isActive,
    duration: 480,
    easing: "cubic-bezier(0.34, 1.56, 0.64, 1)",
    selector: '[data-beat-layout-item="true"]',
  });
  return (
    <div className={`${styles.scene} ${styles.sceneField}`}>
      <Masthead c={c} tone="field" />
      <div className={styles.turnBody}>
        <div
          ref={ref}
          className={styles.turnStack}
          data-beat-layout-container="true"
          data-beat-layout-mode="motion"
        >
          {c.turnWords.map((w, i) => (
            <span
              key={w}
              data-beat-layout-item="true"
              className={`${styles.display} ${styles.turnWord} ${
                i === active ? styles.turnWordActive : ""
              }`}
            >
              {w}
            </span>
          ))}
        </div>
        <p className={styles.turnCaption}>{c.turnCaptions[active]}</p>
      </div>
    </div>
  );
}

function ProofScene({ beat, lang }: SceneProps) {
  const c = COPY[lang];
  const ribbonOn = beat >= 1;
  return (
    <div className={`${styles.scene} ${styles.scenePaper}`}>
      <Masthead c={c} tone="paper" />
      <div
        className={styles.proofBody}
        data-beat-layout-container="true"
        data-beat-layout-mode="reserved"
      >
        <div className={styles.tiles} data-beat-layout-item="true">
          {c.proofTiles.map((t, i) => (
            <div
              key={t.key}
              className={`${styles.proofTile} ${i === 1 ? styles.proofTileAccent : ""}`}
            >
              <span className={`${styles.display} ${styles.proofValue}`}>{t.value}</span>
              <span className={styles.proofKey}>{t.key}</span>
            </div>
          ))}
        </div>
        {/* reserved ribbon slot: present from beat 0, revealed at beat 1 */}
        <div
          className={`${styles.ribbon} ${ribbonOn ? styles.ribbonOn : ""}`}
          data-beat-layout-item="true"
        >
          {c.ribbon}
        </div>
      </div>
    </div>
  );
}

function FinalScene({ lang }: SceneProps) {
  const c = COPY[lang];
  return (
    <div className={`${styles.scene} ${styles.sceneField}`}>
      <Masthead c={c} tone="field" />
      <div className={styles.finalBody}>
        <div className={styles.ornament}>
          <div className={styles.ruleStack}>
            <span className={styles.rule} />
            <span className={styles.rule} />
          </div>
          <span className={`${styles.ornamentWord} ${styles.display} ${styles.finalHero}`}>
            {c.finalHero}
          </span>
          <div className={styles.ruleStack}>
            <span className={styles.rule} />
            <span className={styles.rule} />
          </div>
        </div>
        <p className={`${styles.display} ${styles.finalLine}`}>{c.finalLine}</p>
      </div>
    </div>
  );
}

/* ── navigation prototype : page numerals / spine (footline furniture) ── */
function NavSpine({
  scene,
  lang,
  onNavigate,
}: {
  scene: number;
  lang: "en" | "zh";
  onNavigate?: (scene: number, beat: number) => void;
}) {
  const c = COPY[lang];
  const page = `P.0${scene}`;
  return (
    <div
      {...curatedNavigationAttributes("magazine-masthead", "comeback-issue")}
      className={styles.navSpine}
    >
      <span className={styles.navIssue}>ISSUE 03</span>
      <span className={styles.navSep}>·</span>
      <span className={styles.navIssue}>{page}</span>
      <span className={styles.navSep}>·</span>
      <span className={styles.navIssue}>{c.sections[scene - 1]}</span>
      <div className={styles.navPages}>
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            className={`${styles.navPage} ${n === scene ? styles.navPageActive : ""}`}
            onClick={(e) => {
              e.stopPropagation();
              onNavigate?.(n, 0);
            }}
          >
            {`0${n}`}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ── transitions ─────────────────────────────────────────────────────── */
const TRANSITIONS: SceneTransitionMap = {
  "1->2": "page-flip",
  "2->3": "scale-fade",
  "3->4": "page-flip",
  "4->5": "fade",
};

/* ── component ───────────────────────────────────────────────────────── */
function ComebackIssueV3({
  scene,
  beat,
  language,
  isThumbnail,
  reducedMotion,
  onNavigate,
}: BespokeStyleProps) {
  const still = reducedMotion || isThumbnail;

  return (
    <div
      className={styles.root}
      data-lang={language}
      data-static={still ? "true" : "false"}
      style={
        {
          "--field": FIELD,
          "--paper": PAPER,
          "--ink": INK,
        } as React.CSSProperties
      }
    >
      <SpatialSceneTrack
        scene={scene}
        beat={beat}
        transitionKind="page-flip"
        transitionMap={TRANSITIONS}
        reducedMotion={still}
        beatLayoutModes={{ 2: "reserved", 3: "motion", 4: "reserved" }}
        renderScene={(sceneId, sceneBeat, isActive) => {
          const props: SceneProps = {
            beat: sceneBeat,
            isActive,
            lang: language,
            still,
          };
          switch (sceneId) {
            case 1:
              return <CoverScene {...props} />;
            case 2:
              return <FallScene {...props} />;
            case 3:
              return <TurnScene {...props} />;
            case 4:
              return <ProofScene {...props} />;
            default:
              return <FinalScene {...props} />;
          }
        }}
      />
      {!isThumbnail && (
        <NavSpine scene={scene} lang={language} onNavigate={onNavigate} />
      )}
    </div>
  );
}

/* ── metadata ────────────────────────────────────────────────────────── */
export function getMetadata(lang: "en" | "zh"): StyleMetadata {
  const en = lang === "en";
  return {
    id: "magazine-masthead",
    band: "editorial-print",
    name: en ? "Magazine Masthead" : "杂志刊头",
    theme: en ? "The Comeback Issue" : "回归特刊",
    densityLabel: en ? "Theatrical cover" : "刊面戏剧",
    heroScene: 1,
    colors: { bg: FIELD, ink: INK, panel: PAPER },
    typography: {
      header: en ? "Playfair Display, serif" : "Noto Serif SC, serif",
      body: "Archivo, sans-serif",
    },
    tags: en
      ? ["theatrical", "editorial", "authoritative", "triad", "print-settled"]
      : ["戏剧", "编辑", "权威", "三色", "沉稳"],
    fonts: [
      "Playfair Display:wght@700;900",
      "Archivo:wght@500;600;700",
      "cjk:Noto Serif SC:wght@700;900",
    ],
    scenes: [
      {
        id: 1,
        title: en ? "Cover" : "封面",
        beats: [
          {
            id: 0,
            action: en ? "Publish the masthead" : "印上刊头",
            title: en ? "RISE" : "崛起",
            body: en
              ? "The comeback issue opens on a single theatrical word."
              : "回归特刊以一个极具戏剧张力的字开场。",
          },
        ],
      },
      {
        id: 2,
        title: en ? "The Fall" : "坠落",
        beats: [
          {
            id: 0,
            action: en ? "Name the low point" : "点名低谷",
            title: en ? "FALL" : "坠落",
            body: en ? "An inverted tile states the low point." : "一块反色拼版点出低谷。",
          },
          {
            id: 1,
            action: en ? "Print the damage" : "印出损失",
            title: en ? "-41%" : "-41%",
            body: en ? "Momentum lost across a hard winter." : "一个寒冬里流失的势能。",
          },
        ],
      },
      {
        id: 3,
        title: en ? "The Turn" : "转折",
        beats: [
          {
            id: 0,
            action: en ? "Sit with the doubt" : "直面犹疑",
            title: en ? "DOUBT" : "犹疑",
            body: en ? "The stillness before the pivot." : "转向之前的静止。",
          },
          {
            id: 1,
            action: en ? "Make the decision" : "做出抉择",
            title: en ? "DECIDE" : "抉择",
            body: en ? "One choice reroutes everything." : "一个选择改写全部走向。",
          },
          {
            id: 2,
            action: en ? "Commit to return" : "决意回归",
            title: en ? "RETURN" : "回归",
            body: en ? "The headline swaps to the comeback." : "大标题切换成归来。",
          },
        ],
      },
      {
        id: 4,
        title: en ? "The Proof" : "佐证",
        beats: [
          {
            id: 0,
            action: en ? "Lay out the evidence" : "摊开证据",
            title: en ? "The receipts" : "凭证",
            body: en ? "Supporting tiles with issue and volume chrome." : "带刊号卷号的佐证拼版。",
          },
          {
            id: 1,
            action: en ? "Stamp the verdict" : "盖上定论",
            title: en ? "Verified" : "已核验",
            body: en ? "The ribbon certifies the turnaround." : "缎带为逆转背书。",
          },
        ],
      },
      {
        id: 5,
        title: en ? "The Cover Line" : "封面标语",
        beats: [
          {
            id: 0,
            action: en ? "Close the issue" : "合上本期",
            title: en ? "BACK" : "归来",
            body: en ? "One final published statement." : "以一句刊面标语收尾。",
          },
        ],
      },
    ],
  };
}

export const comebackIssueTopic = defineStyleTopic({
  id: "comeback-issue",
  topic: { en: "The Comeback Issue", zh: "回归特刊" },
  model: "GPT 5.6 Sol",
  component: ComebackIssueV3,
  getMetadata,
});

export default ComebackIssueV3;

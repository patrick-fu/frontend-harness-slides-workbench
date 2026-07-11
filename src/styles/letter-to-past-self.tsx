import type { BespokeStyleProps, StyleMetadata } from "../types";
import { defineStyleTopic } from "./topic";
import { curatedNavigationAttributes } from "./curated-topic-contract";
import SpatialSceneTrack from "./SpatialSceneTrack";
import type { SceneTransitionMap } from "./SpatialSceneTrack";
import { useFLIP } from "../hooks/useFLIP";
import styles from "./letter-to-past-self.module.css";

const TRANSITIONS: SceneTransitionMap = {
  "1->2": "fade",
  "2->3": "fade",
  "3->4": "slide-x",
  "4->5": "fade",
};

/* ── Slide copy (rendered text) ──────────────────────────────────── */

interface Copy {
  s1: { kicker: string; title: string; byline: string };
  s2: { body: string; tail: string; pull: string };
  s3: { quote: string; attr: string };
  s4: { kicker: string; word: string; before: string; after: string };
  s5: { closing: string; signature: string };
}

const COPY: Record<"en" | "zh", Copy> = {
  en: {
    s1: {
      kicker: "a letter, unsent",
      title: "Dear younger me, I owe you an apology.",
      byline:
        "Written on a slow afternoon, for the person I was before I learned any of this the hard way.",
    },
    s2: {
      body:
        "You spent so many years bracing for a failure that never came the way you feared it would. You rehearsed disaster in the dark and called it being careful.",
      tail:
        "I want to tell you: the waiting was the wound. Not the falling.",
      pull: "You mistook worry for love, and gave it away for free.",
    },
    s3: {
      quote: "The version of you that you were ashamed of was doing its best.",
      attr: "— what I wish someone had told you at twenty-two",
    },
    s4: {
      kicker: "the lesson",
      word: "unearned",
      before: "So here is the lesson I paid for, and I am handing it to you already ",
      after:
        ": be softer with the small self who is still learning how to stay. Kindness compounds quietly, like light through a window left uncovered.",
    },
    s5: {
      closing:
        "You will be alright. Not because it gets easy — because you get gentle.",
      signature: "— always, the one you become",
    },
  },
  zh: {
    s1: {
      kicker: "一封未寄出的信",
      title: "亲爱的从前的我，我该向你道歉。",
      byline:
        "写于一个缓慢的午后，写给那个还没有历尽这一切、还没学会这些的自己。",
    },
    s2: {
      body:
        "你花了那么多年，去提防一场从未按你所惧怕的样子降临的失败。你在黑暗里一遍遍排练灾难，还把它叫作谨慎。",
      tail: "我想告诉你：伤口是那段等待，而不是跌落本身。",
      pull: "你把担忧错认成爱，还把它白白送了出去。",
    },
    s3: {
      quote: "那个曾让你羞愧的自己，其实已经拼尽了全力。",
      attr: "——我多希望有人在你二十二岁时这样对你说",
    },
    s4: {
      kicker: "领悟",
      word: "温柔",
      before: "所以，这是我用代价换来的领悟，现在我把它提前交给还未偿付的你：请对那个仍在学着如何留下的小小的自己，多一点",
      after:
        "。善意会静静地累积，像光穿过一扇没有遮住的窗。",
    },
    s5: {
      closing: "你会没事的。不是因为一切变得容易，而是因为你终于变得温柔。",
      signature: "——永远地，你将成为的那个人",
    },
  },
};

/* ── Navigation · N7 ghost / hover-reveal folio ──────────────────── */

const ROMAN = ["I", "II", "III", "IV", "V"];

function GhostFolio({
  scene,
  isThumbnail,
  onNavigate,
}: {
  scene: number;
  isThumbnail: boolean;
  onNavigate?: (scene: number, beat: number) => void;
}) {
  if (isThumbnail) return null;
  const jump = (target: number) => (e: React.MouseEvent) => {
    e.stopPropagation();
    onNavigate?.(target, 0);
  };
  return (
    <nav
      {...curatedNavigationAttributes("warm-editorial-feature", "letter-to-past-self")}
      className={styles.folio}
      aria-label="folio navigation"
    >
      <div className={styles.folioReveal}>
        {ROMAN.map((label, i) => {
          const target = i + 1;
          const active = target === scene;
          return (
            <button
              key={target}
              type="button"
              className={`${styles.folioDot} ${active ? styles.folioActive : ""}`}
              aria-current={active ? "page" : undefined}
              onClick={jump(target)}
            >
              {label}
            </button>
          );
        })}
      </div>
      <span className={styles.folioCurrent}>{ROMAN[scene - 1]}</span>
    </nav>
  );
}

/* ── Scene content ───────────────────────────────────────────────── */

interface SceneProps {
  scene: number;
  beat: number;
  isActive: boolean;
  language: "en" | "zh";
  reducedMotion: boolean;
  isThumbnail: boolean;
}

function SceneContent({
  scene,
  beat,
  isActive,
  language,
  reducedMotion,
  isThumbnail,
}: SceneProps) {
  const c = COPY[language];
  const flipDisabled = reducedMotion || isThumbnail || !isActive;

  const turningFlip = useFLIP<HTMLDivElement>({
    watch: [beat],
    disabled: scene !== 3 || flipDisabled,
    duration: 640,
    easing: "cubic-bezier(0.22, 0.61, 0.36, 1)",
    selector: '[data-beat-layout-item="true"]',
  });

  if (scene === 1) {
    return (
      <div className={`${styles.scene} ${styles.opening}`}>
        <p className={styles.kicker}>{c.s1.kicker}</p>
        <h1 className={styles.title}>{c.s1.title}</h1>
        <hr className={styles.rule} />
        <p className={styles.byline}>{c.s1.byline}</p>
      </div>
    );
  }

  if (scene === 2) {
    // reserved: pull-quote slot reserved from beat 0, revealed at beat 1
    const pullShown = beat >= 1;
    return (
      <div className={`${styles.scene} ${styles.regret}`}>
        <div
          className={styles.regretInner}
          data-beat-layout-container="true"
          data-beat-layout-mode="reserved"
        >
          <div className={styles.bodyCol} data-beat-layout-item="true">
            <p className={styles.bodyText}>{c.s2.body}</p>
            <p
              className={styles.bodyTail}
              style={{ opacity: pullShown ? 1 : 0 }}
            >
              {c.s2.tail}
            </p>
          </div>
          <blockquote
            className={styles.pullOffset}
            data-beat-layout-item="true"
            style={{
              opacity: pullShown ? 1 : 0,
              transform: pullShown ? "translateY(0)" : "translateY(1.4cqh)",
              transition:
                reducedMotion || isThumbnail
                  ? "none"
                  : "opacity 640ms ease, transform 720ms cubic-bezier(0.22,0.61,0.36,1)",
            }}
          >
            <p>{c.s2.pull}</p>
          </blockquote>
        </div>
      </div>
    );
  }

  if (scene === 3) {
    // motion: full-margin pull-quote; attribution reflows the group at beat 1
    const attrShown = beat >= 1;
    return (
      <div className={`${styles.scene} ${styles.turning}`}>
        <div
          ref={turningFlip.ref}
          className={styles.turnGroup}
          data-beat-layout-container="true"
          data-beat-layout-mode="motion"
        >
          <span className={styles.turnMark} data-beat-layout-item="true">
            &ldquo;
          </span>
          <p className={styles.turnQuote} data-beat-layout-item="true">
            {c.s3.quote}
          </p>
          {attrShown && (
            <p className={styles.turnAttr} data-beat-layout-item="true">
              {c.s3.attr}
            </p>
          )}
        </div>
      </div>
    );
  }

  if (scene === 4) {
    // reserved: body resumes; botanical accent word revealed at beat 1
    const accentShown = beat >= 1;
    return (
      <div className={`${styles.scene} ${styles.lesson}`}>
        <div
          className={styles.lessonCol}
          data-beat-layout-container="true"
          data-beat-layout-mode="reserved"
        >
          <p className={styles.lessonKicker} data-beat-layout-item="true">
            {c.s4.kicker}
          </p>
          <p className={styles.bodyText} data-beat-layout-item="true">
            {c.s4.before}
            <span
              className={styles.accentWord}
              style={{
                opacity: accentShown ? 1 : 0.18,
                transition:
                  reducedMotion || isThumbnail ? "none" : "opacity 620ms ease",
              }}
            >
              {c.s4.word}
            </span>
            {c.s4.after}
          </p>
        </div>
      </div>
    );
  }

  // scene === 5 — the sign-off
  return (
    <div className={`${styles.scene} ${styles.signoff}`}>
      <hr className={styles.signRule} />
      <p className={styles.closing}>{c.s5.closing}</p>
      <p className={styles.signature}>{c.s5.signature}</p>
    </div>
  );
}

/* ── Root component ──────────────────────────────────────────────── */

function WarmEditorialFeatureV3({
  scene,
  beat,
  language,
  isThumbnail,
  reducedMotion,
  onNavigate,
}: BespokeStyleProps) {
  const still = reducedMotion || isThumbnail;

  return (
    <div className={styles.root} data-reduced={still ? "true" : "false"}>
      <SpatialSceneTrack
        scene={scene}
        beat={beat}
        transitionKind="fade"
        transitionMap={TRANSITIONS}
        reducedMotion={still}
        beatLayoutModes={{ 2: "reserved", 3: "motion", 4: "reserved" }}
        renderScene={(sceneId, sceneBeat, isActive) => (
          <SceneContent
            scene={sceneId}
            beat={sceneBeat}
            isActive={isActive}
            language={language}
            reducedMotion={reducedMotion}
            isThumbnail={isThumbnail}
          />
        )}
      />
      <GhostFolio
        scene={scene}
        isThumbnail={isThumbnail}
        onNavigate={onNavigate}
      />
    </div>
  );
}

/* ── Metadata (structurally identical EN / ZH) ───────────────────── */

interface SceneMeta {
  title: string;
  beats: { action: string; title: string; body: string }[];
}

const META: Record<"en" | "zh", { theme: string; densityLabel: string; scenes: SceneMeta[] }> = {
  en: {
    theme: "A Letter to My Past Self",
    densityLabel: "Airy · long-form",
    scenes: [
      {
        title: "The opening",
        beats: [
          {
            action: "Unfold the letter",
            title: "Dear younger me",
            body: "A single opening line breathes across the warm page, framed by one hairline rule.",
          },
        ],
      },
      {
        title: "The regret",
        beats: [
          {
            action: "Read the confession",
            title: "The waiting was the wound",
            body: "A body column holds the confession while the margin keeps a slot in reserve.",
          },
          {
            action: "Surface the pull-quote",
            title: "Worry mistaken for love",
            body: "The reserved margin quote surfaces into place beside the settled body text.",
          },
        ],
      },
      {
        title: "The turning point",
        beats: [
          {
            action: "Let the quote take over",
            title: "It was doing its best",
            body: "A full-margin pull-quote takes the whole page, centered and unhurried.",
          },
          {
            action: "Reflow with attribution",
            title: "What I wish you'd heard",
            body: "The attribution joins and the quote group reflows gently into its final shape.",
          },
        ],
      },
      {
        title: "The lesson",
        beats: [
          {
            action: "Resume the body",
            title: "The lesson I paid for",
            body: "Body text resumes in a calm column, one word held back for emphasis.",
          },
          {
            action: "Bloom one word",
            title: "Be softer, be gentle",
            body: "A single botanical accent word blooms in place, sage against warm paper.",
          },
        ],
      },
      {
        title: "The sign-off",
        beats: [
          {
            action: "Close the letter",
            title: "You will be alright",
            body: "One quiet italic closing line and a signature, framed by generous air.",
          },
        ],
      },
    ],
  },
  zh: {
    theme: "写给过去",
    densityLabel: "疏朗 · 长文",
    scenes: [
      {
        title: "开篇",
        beats: [
          {
            action: "展开信笺",
            title: "亲爱的从前的我",
            body: "一句开篇的话在暖色纸面上舒展，只用一条发丝般的细线相衬。",
          },
        ],
      },
      {
        title: "遗憾",
        beats: [
          {
            action: "读那句忏悔",
            title: "等待才是伤口",
            body: "正文列承载着忏悔，而页边预留出一处等待被填满的位置。",
          },
          {
            action: "浮现引句",
            title: "把担忧错认成爱",
            body: "预留的页边引句缓缓浮现，落在已经安顿好的正文旁边。",
          },
        ],
      },
      {
        title: "转折",
        beats: [
          {
            action: "让引句占据整页",
            title: "它已拼尽全力",
            body: "一句满页的引言接管整个版面，居中而从容，不慌不忙。",
          },
          {
            action: "随署名重排",
            title: "我多希望你听过",
            body: "署名加入，整组引言轻轻重排，落定成它最终的形状。",
          },
        ],
      },
      {
        title: "领悟",
        beats: [
          {
            action: "正文重启",
            title: "用代价换来的领悟",
            body: "正文在平静的一列里重新展开，留一个词等待被强调。",
          },
          {
            action: "让一个词绽放",
            title: "请更温柔一些",
            body: "唯一的一处植物色重点词就地绽放，鼠尾草色映着暖纸。",
          },
        ],
      },
      {
        title: "落款",
        beats: [
          {
            action: "合上信笺",
            title: "你会没事的",
            body: "一句安静的斜体收束与一行落款，被大片留白温柔地框住。",
          },
        ],
      },
    ],
  },
};

const NAME: Record<"en" | "zh", string> = {
  en: "Warm Editorial Feature",
  zh: "暖色专题特稿",
};

export function getMetadata(lang: "en" | "zh"): StyleMetadata {
  const m = META[lang];
  return {
    id: "warm-editorial-feature",
    band: "editorial-print",
    name: NAME[lang],
    theme: m.theme,
    densityLabel: m.densityLabel,
    heroScene: 3,
    colors: { bg: "#f3ebda", ink: "#2e2a24", panel: "#faf3e4" },
    typography: { header: "Playfair Display", body: "Source Sans 3" },
    tags: ["literary", "unhurried", "airy", "warm-cream", "quiet-motion"],
    fonts: [
      "Playfair Display:ital,wght@0,500;0,600;0,700;1,500;1,600;1,700",
      "Source Sans 3:ital,wght@0,300;0,400;1,300",
      "cjk:Noto Serif SC:wght@500;600;700",
      "cjk:Noto Sans SC:wght@300;400",
    ],
    scenes: m.scenes.map((s, si) => ({
      id: si + 1,
      title: s.title,
      beats: s.beats.map((b, bi) => ({
        id: bi,
        action: b.action,
        title: b.title,
        body: b.body,
      })),
    })),
  };
}

export const letterToPastSelfTopic = defineStyleTopic({
  id: "letter-to-past-self",
  topic: { en: "A Letter to My Past Self", zh: "写给过去" },
  model: "GPT 5.6 Sol",
  component: WarmEditorialFeatureV3,
  getMetadata,
});

export default WarmEditorialFeatureV3;

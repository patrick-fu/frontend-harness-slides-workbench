import { useEffect } from "react";
import type { BespokeStyleProps, StyleMetadata } from "../types";
import { defineStyleTopic } from "./topic";
import SpatialSceneTrack from "./SpatialSceneTrack";
import type { SceneTransitionMap } from "./SpatialSceneTrack";
import { useFLIP } from "../hooks/useFLIP";
import styles from "./last-feature-cut.module.css";

/* ─────────────────────────────────────────────────────────────────────────
   01 · Minimal Product Keynote · v3 — "The Last Feature We Cut"
   Style DNA: a held breath. One idea, enormous, alone in a warmed near-white
   void. Near-black ink. A single scarce saturated accent (#E4442B) touches
   only a tiny area — the "No." spark in scene 4. Slow, weighted motion.
   ───────────────────────────────────────────────────────────────────────── */

const EASE = "cubic-bezier(0.16, 1, 0.3, 1)";

const TRANSITIONS: SceneTransitionMap = {
  "1->2": "scale-fade",
  "2->3": "fade",
  "3->4": "scale-fade",
  "4->5": "fade",
};

const FONT_LINK_ID = "font-minimal-product-keynote-v3";
function useFonts() {
  useEffect(() => {
    if (document.getElementById(FONT_LINK_ID)) return;
    const link = document.createElement("link");
    link.id = FONT_LINK_ID;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,600&family=Noto+Serif+SC:wght@300;500&display=swap";
    document.head.appendChild(link);
  }, []);
}

function pad(n: number): string {
  return n < 10 ? `0${n}` : `${n}`;
}

/* ---- on-screen copy ---- */
type Copy = {
  mark: string;
  s1Hero: string;
  s2Feature: string;
  s2Whisper: string;
  s3Heading: string;
  s3Costs: [string, string, string];
  s4Lead: string;
  s4Verdict: string;
  s5Hero: string;
  s5Proof: string;
};

const COPY: Record<"en" | "zh", Copy> = {
  en: {
    mark: "PRODUCT NOTE — 01",
    s1Hero: "We cut it.",
    s2Feature: "One-tap everything.",
    s2Whisper: "We wanted it. Badly.",
    s3Heading: "What it would have cost",
    s3Costs: [
      "Six weeks of scope.",
      "A blurred core.",
      "A promise we couldn't keep.",
    ],
    s4Lead: "The answer was",
    s4Verdict: "No",
    s5Hero: "Now it breathes.",
    s5Proof: "Shipped three weeks early.",
  },
  zh: {
    mark: "产品手记 — 01",
    s1Hero: "我们删掉了它。",
    s2Feature: "一键搞定一切。",
    s2Whisper: "我们很想要，非常想。",
    s3Heading: "它会付出的代价",
    s3Costs: ["六周的工期。", "被模糊的核心。", "一个无法兑现的承诺。"],
    s4Lead: "答案是",
    s4Verdict: "不",
    s5Hero: "现在它能呼吸了。",
    s5Proof: "提前三周发布。",
  },
};

/* ─────────────────────────── scenes ─────────────────────────── */

function SceneTitle({ t }: { t: Copy }) {
  return (
    <div className={styles.centerCol}>
      <h1 className={`${styles.hero} ${styles.rise}`}>{t.s1Hero}</h1>
    </div>
  );
}

function SceneTemptation({
  beat,
  isActive,
  t,
  motionOff,
}: {
  beat: number;
  isActive: boolean;
  t: Copy;
  motionOff: boolean;
}) {
  const { ref } = useFLIP<HTMLDivElement>({
    watch: [beat],
    disabled: motionOff || !isActive,
    duration: 680,
    easing: EASE,
    selector: '[data-beat-layout-item="true"]',
  });
  return (
    <div
      ref={ref}
      data-beat-layout-container="true"
      data-beat-layout-mode="motion"
      data-beat={beat}
      className={styles.temptWrap}
    >
      <span className={styles.halo} data-beat={beat} aria-hidden="true" />
      <p data-beat-layout-item="true" className={styles.feature}>
        {t.s2Feature}
      </p>
      <p data-beat-layout-item="true" className={styles.whisper}>
        {t.s2Whisper}
      </p>
    </div>
  );
}

function SceneCost({ beat, t }: { beat: number; t: Copy }) {
  return (
    <div
      data-beat-layout-container="true"
      data-beat-layout-mode="reserved"
      className={styles.costWrap}
    >
      <p className={styles.costHeading}>{t.s3Heading}</p>
      {t.s3Costs.map((cost, i) => (
        <p
          key={i}
          data-beat-layout-item="true"
          data-shown={beat >= i}
          className={styles.cost}
        >
          {cost}
        </p>
      ))}
    </div>
  );
}

function SceneDecision({
  beat,
  isActive,
  t,
  motionOff,
}: {
  beat: number;
  isActive: boolean;
  t: Copy;
  motionOff: boolean;
}) {
  const { ref } = useFLIP<HTMLDivElement>({
    watch: [beat],
    disabled: motionOff || !isActive,
    duration: 760,
    easing: EASE,
    selector: '[data-beat-layout-item="true"]',
  });
  return (
    <div
      ref={ref}
      data-beat-layout-container="true"
      data-beat-layout-mode="motion"
      data-beat={beat}
      className={styles.decisionWrap}
    >
      <p data-beat-layout-item="true" className={styles.lead}>
        {t.s4Lead}
      </p>
      <h1 data-beat-layout-item="true" className={styles.verdict}>
        {t.s4Verdict}
        <span className={styles.spark}>.</span>
      </h1>
    </div>
  );
}

function SceneAfter({ t }: { t: Copy }) {
  return (
    <div className={styles.afterWrap}>
      <h1 className={`${styles.afterHero} ${styles.rise}`}>{t.s5Hero}</h1>
      <p className={`${styles.proof} ${styles.riseDelay}`}>{t.s5Proof}</p>
    </div>
  );
}

/* ─────────────────────── N7 ghost / hover-reveal nav ─────────────────────── */

function GhostNav({
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
    <div className={styles.nav}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          aria-label={`Scene ${n}`}
          className={`${styles.tick} ${n === scene ? styles.tickActive : ""}`}
          onClick={(e) => {
            e.stopPropagation();
            onNavigate?.(n, 0);
          }}
        />
      ))}
      <span className={styles.navNum}>{pad(scene)} / 05</span>
    </div>
  );
}

/* ─────────────────────────── component ─────────────────────────── */

function LastFeatureCutV3({
  scene,
  beat,
  language,
  isThumbnail,
  reducedMotion,
  onNavigate,
}: BespokeStyleProps) {
  useFonts();
  const t = COPY[language];
  const motionOff = reducedMotion || isThumbnail;

  return (
    <div
      className={`${styles.root} ${motionOff ? styles.reduced : ""}`}
      data-style="01"
      data-version="v3"
    >
      <span className={styles.mark}>{t.mark}</span>

      <SpatialSceneTrack
        scene={scene}
        beat={beat}
        transitionKind="scale-fade"
        transitionMap={TRANSITIONS}
        reducedMotion={motionOff}
        beatLayoutModes={{ 2: "motion", 3: "reserved", 4: "motion" }}
        renderScene={(sceneId, sceneBeat, isActive) => (
          <div className={styles.scene} data-active={isActive}>
            {sceneId === 1 && <SceneTitle t={t} />}
            {sceneId === 2 && (
              <SceneTemptation
                beat={sceneBeat}
                isActive={isActive}
                t={t}
                motionOff={motionOff}
              />
            )}
            {sceneId === 3 && <SceneCost beat={sceneBeat} t={t} />}
            {sceneId === 4 && (
              <SceneDecision
                beat={sceneBeat}
                isActive={isActive}
                t={t}
                motionOff={motionOff}
              />
            )}
            {sceneId === 5 && <SceneAfter t={t} />}
          </div>
        )}
      />

      <GhostNav
        scene={scene}
        isThumbnail={isThumbnail}
        onNavigate={onNavigate}
      />
    </div>
  );
}

/* ─────────────────────────── metadata ─────────────────────────── */

export function getMetadata(language: "en" | "zh"): StyleMetadata {
  const en: StyleMetadata = {
    id: "minimal-product-keynote",
    band: "minimal-keynote",
    name: "Minimal Product Keynote",
    theme: "The Last Feature We Cut",
    densityLabel: "One idea per scene",
    heroScene: 4,
    colors: { bg: "#F4F0E8", ink: "#141210", panel: "#EBE5D9" },
    typography: { header: "Fraunces", body: "Fraunces" },
    tags: ["minimal", "reverent", "value-extreme", "negative-space", "calm-slow"],
    fonts: ["Fraunces", "cjk:Noto Serif SC"],
    scenes: [
      {
        id: 1,
        title: "Title",
        beats: [
          {
            id: 0,
            action: "Open on silence",
            title: "We cut it.",
            body: "One decision, alone.",
          },
        ],
      },
      {
        id: 2,
        title: "The temptation",
        beats: [
          {
            id: 0,
            action: "The feature glows",
            title: "One-tap everything.",
            body: "The thing everyone begged for.",
          },
          {
            id: 1,
            action: "Held at arm's length",
            title: "We wanted it. Badly.",
            body: "Wanting was never the test.",
          },
        ],
      },
      {
        id: 3,
        title: "The cost",
        beats: [
          {
            id: 0,
            action: "First cost surfaces",
            title: "Six weeks of scope.",
            body: "Time we did not have.",
          },
          {
            id: 1,
            action: "Second cost surfaces",
            title: "A blurred core.",
            body: "The main thing, diluted.",
          },
          {
            id: 2,
            action: "Third cost surfaces",
            title: "A promise we couldn't keep.",
            body: "Trust, spent too early.",
          },
        ],
      },
      {
        id: 4,
        title: "The decision",
        beats: [
          {
            id: 0,
            action: "The question hangs",
            title: "The answer was",
            body: "Everything held still.",
          },
          {
            id: 1,
            action: "The spark lands",
            title: "No.",
            body: "One word. Nothing after it.",
          },
        ],
      },
      {
        id: 5,
        title: "After",
        beats: [
          {
            id: 0,
            action: "The product exhales",
            title: "Now it breathes.",
            body: "Shipped three weeks early.",
          },
        ],
      },
    ],
  };

  const zh: StyleMetadata = {
    id: "minimal-product-keynote",
    band: "minimal-keynote",
    name: "极简产品主题演讲",
    theme: "删掉的功能",
    densityLabel: "每屏一念",
    heroScene: 4,
    colors: { bg: "#F4F0E8", ink: "#141210", panel: "#EBE5D9" },
    typography: { header: "Fraunces", body: "Fraunces" },
    tags: ["minimal", "reverent", "value-extreme", "negative-space", "calm-slow"],
    fonts: ["Fraunces", "cjk:Noto Serif SC"],
    scenes: [
      {
        id: 1,
        title: "标题",
        beats: [
          {
            id: 0,
            action: "以静默开场",
            title: "我们删掉了它。",
            body: "一个决定，独自站立。",
          },
        ],
      },
      {
        id: 2,
        title: "诱惑",
        beats: [
          {
            id: 0,
            action: "功能在发光",
            title: "一键搞定一切。",
            body: "人人都在恳求的东西。",
          },
          {
            id: 1,
            action: "保持一臂的距离",
            title: "我们很想要，非常想。",
            body: "想要从来不是标准。",
          },
        ],
      },
      {
        id: 3,
        title: "代价",
        beats: [
          {
            id: 0,
            action: "第一个代价浮现",
            title: "六周的工期。",
            body: "我们没有的时间。",
          },
          {
            id: 1,
            action: "第二个代价浮现",
            title: "被模糊的核心。",
            body: "最重要的东西被稀释。",
          },
          {
            id: 2,
            action: "第三个代价浮现",
            title: "一个无法兑现的承诺。",
            body: "过早透支的信任。",
          },
        ],
      },
      {
        id: 4,
        title: "决定",
        beats: [
          {
            id: 0,
            action: "问题悬在空中",
            title: "答案是",
            body: "一切都静止了。",
          },
          {
            id: 1,
            action: "火花落定",
            title: "不。",
            body: "一个字，之后再无。",
          },
        ],
      },
      {
        id: 5,
        title: "之后",
        beats: [
          {
            id: 0,
            action: "产品终于呼吸",
            title: "现在它能呼吸了。",
            body: "提前三周发布。",
          },
        ],
      },
    ],
  };

  return language === "zh" ? zh : en;
}

/* ─────────────────────────── version ─────────────────────────── */

export const lastFeatureCutTopic = defineStyleTopic({
  id: "last-feature-cut",
  topic: { en: "The Last Feature We Cut", zh: "删掉的功能" },
  model: "Claude Opus 4.8",
  component: LastFeatureCutV3,
  getMetadata,
});

export default LastFeatureCutV3;

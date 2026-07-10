import { useEffect } from "react";
import type { BespokeStyleProps, StyleMetadata } from "../types";
import { defineStyleTopic } from "./topic";
import SpatialSceneTrack from "./SpatialSceneTrack";
import type { SceneTransitionMap } from "./SpatialSceneTrack";
import { useFLIP } from "../hooks/useFLIP";
import styles from "./grand-unveiling.module.css";

/* ============================================================
   Machine-Age Deco — v3 · "The Grand Unveiling"
   Midnight lacquer ground, one flat gold ink tracing frames,
   strict bilateral symmetry about a vertical axis. Monumental,
   low density, slow and stately motion. cqw/cqh only.
   ============================================================ */

const FONT_ID = "fonts-machine-age-deco-v3";
const FONT_HREF =
  "https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600;700&family=Josefin+Sans:wght@300;400;600&family=Noto+Serif+SC:wght@400;600;700&display=swap";

function useFonts() {
  useEffect(() => {
    if (document.getElementById(FONT_ID)) return;
    const link = document.createElement("link");
    link.id = FONT_ID;
    link.rel = "stylesheet";
    link.href = FONT_HREF;
    document.head.appendChild(link);
  }, []);
}

/* ---------- bilingual content (deliberately NOT `as const`) ---------- */
type Beat = { action: string; title: string; body: string };
type SceneCopy = { title: string; beats: Beat[] };
type Lang = "en" | "zh";

interface Content {
  theme: string;
  densityLabel: string;
  monogram: string;
  facade: { title: string; tag: string };
  ascentRows: string[];
  reveal: { kicker: string; hero: string; body1: string; body2: string };
  spec: {
    title: string;
    left: { label: string; value: string }[];
    right: { label: string; value: string }[];
  };
  seal: { top: string; word: string; sub: string };
  scenes: SceneCopy[];
}

const CONTENT: Record<Lang, Content> = {
  en: {
    theme: "The Grand Unveiling",
    densityLabel: "Monumental",
    monogram: "GU",
    facade: { title: "THE GRAND UNVEILING", tag: "EST · MMXXVI" },
    ascentRows: ["FOUNDATION", "ASCENT", "APEX"],
    reveal: {
      kicker: "WE PRESENT",
      hero: "ONE MACHINE, PERFECTED",
      body1: "Engineered to a single, unyielding purpose.",
      body2: "Built to stand for a generation.",
    },
    spec: {
      title: "SPECIFICATIONS",
      left: [
        { label: "MOVEMENT", value: "IN-HOUSE" },
        { label: "FRAME", value: "CAST BRASS" },
        { label: "FINISH", value: "LACQUER" },
      ],
      right: [
        { label: "AXIS", value: "BILATERAL" },
        { label: "ORNAMENT", value: "GILT RULE" },
        { label: "CLASS", value: "FLAGSHIP" },
      ],
    },
    seal: {
      top: "HEREBY UNVEILED",
      word: "UNVEILED",
      sub: "The hall is opened; the work now stands.",
    },
    scenes: [
      {
        title: "The Facade",
        beats: [
          {
            action: "Raise the frame",
            title: "The Facade",
            body: "A symmetric gilt frame and a single monogram announce the hall.",
          },
        ],
      },
      {
        title: "The Ascent",
        beats: [
          {
            action: "Lay the foundation",
            title: "Foundation",
            body: "The base tier settles onto the central axis.",
          },
          {
            action: "Step outward",
            title: "Ascent",
            body: "Stepped borders build outward from the center, tier upon tier.",
          },
        ],
      },
      {
        title: "The Reveal",
        beats: [
          {
            action: "Ignite the emblem",
            title: "The Reveal",
            body: "A radiating sunburst rises behind the hero line.",
          },
          {
            action: "Name the work",
            title: "The Proposition",
            body: "One machine, engineered to a single perfect purpose.",
          },
          {
            action: "State the promise",
            title: "The Promise",
            body: "Built to stand at the altar of geometry for a generation.",
          },
        ],
      },
      {
        title: "The Specifications",
        beats: [
          {
            action: "Open the ledger",
            title: "Left Column",
            body: "The left column of the gilt ledger is inscribed first.",
          },
          {
            action: "Balance the ledger",
            title: "Right Column",
            body: "The right column answers in perfect symmetry.",
          },
        ],
      },
      {
        title: "The Seal",
        beats: [
          {
            action: "Set the seal",
            title: "The Seal",
            body: "A centered stepped arch closes the ceremony.",
          },
        ],
      },
    ],
  },
  zh: {
    theme: "盛大揭幕",
    densityLabel: "恢弘",
    monogram: "揭",
    facade: { title: "盛大揭幕", tag: "启幕 · 二〇二六" },
    ascentRows: ["基座", "攀升", "顶峰"],
    reveal: {
      kicker: "郑重呈现",
      hero: "臻于至善的机器",
      body1: "为唯一而不移的目标精工而成。",
      body2: "铸就可传世一代之基。",
    },
    spec: {
      title: "规格铭录",
      left: [
        { label: "机芯", value: "自制" },
        { label: "框架", value: "铸黄铜" },
        { label: "饰面", value: "漆艺" },
      ],
      right: [
        { label: "轴线", value: "双向对称" },
        { label: "纹饰", value: "鎏金细线" },
        { label: "级别", value: "旗舰" },
      ],
    },
    seal: {
      top: "谨此揭幕",
      word: "揭幕",
      sub: "殿堂既启，其作永立。",
    },
    scenes: [
      {
        title: "立面",
        beats: [
          {
            action: "升起框架",
            title: "立面",
            body: "对称的鎏金框架与单一徽记，宣告殿堂开启。",
          },
        ],
      },
      {
        title: "攀升",
        beats: [
          {
            action: "奠定基座",
            title: "基座",
            body: "基座沉落于中央轴线之上。",
          },
          {
            action: "向外递进",
            title: "攀升",
            body: "阶梯边框自中心向外层层叠起。",
          },
        ],
      },
      {
        title: "揭幕",
        beats: [
          {
            action: "点亮徽记",
            title: "揭幕",
            body: "放射状的日芒于主句之后徐徐升起。",
          },
          {
            action: "为其命名",
            title: "命题",
            body: "一台机器，为唯一至善之用而生。",
          },
          {
            action: "许下承诺",
            title: "承诺",
            body: "铸就可立于几何之坛、传世一代之作。",
          },
        ],
      },
      {
        title: "规格",
        beats: [
          {
            action: "展开铭录",
            title: "左栏",
            body: "鎏金铭录之左栏率先镌刻。",
          },
          {
            action: "两栏对称",
            title: "右栏",
            body: "右栏以完美对称作出应答。",
          },
        ],
      },
      {
        title: "封印",
        beats: [
          {
            action: "钤下印记",
            title: "封印",
            body: "居中的阶梯拱门为典礼画下句点。",
          },
        ],
      },
    ],
  },
};

const GATE_LABELS = ["I", "II", "III", "IV", "V"];

const TRANSITIONS: SceneTransitionMap = {
  "1->2": "scale-fade",
  "2->3": "scale-fade",
  "3->4": "slide-y",
  "4->5": "scale-fade",
};

/* ================= Scene 1 — The Facade ================= */
function FacadeScene({ c, isActive }: { c: Content; isActive: boolean }) {
  return (
    <div
      className={styles.sceneRoot}
      data-active={isActive ? "true" : "false"}
    >
      <div className={styles.facadeFrame} aria-hidden="true">
        <span className={styles.cornerChevron} data-pos="tl" />
        <span className={styles.cornerChevron} data-pos="tr" />
        <span className={styles.cornerChevron} data-pos="bl" />
        <span className={styles.cornerChevron} data-pos="br" />
      </div>
      <div className={styles.facadeCenter}>
        <div className={styles.medallion}>
          <span className={styles.medallionPlate} aria-hidden="true" />
          <span className={styles.medallionFace} aria-hidden="true" />
          <span className={styles.monogram}>{c.monogram}</span>
        </div>
        <h1 className={styles.facadeTitle}>{c.facade.title}</h1>
        <span className={styles.rule} aria-hidden="true" />
        <span className={styles.facadeTag}>{c.facade.tag}</span>
      </div>
    </div>
  );
}

/* ================= Scene 2 — The Ascent ================= */
function AscentScene({
  c,
  beat,
  isActive,
  reducedMotion,
  isThumbnail,
}: {
  c: Content;
  beat: number;
  isActive: boolean;
  reducedMotion: boolean;
  isThumbnail: boolean;
}) {
  const { ref } = useFLIP<HTMLDivElement>({
    watch: [beat],
    disabled: reducedMotion || isThumbnail || !isActive,
    duration: 620,
    easing: "cubic-bezier(0.22, 0.61, 0.36, 1)",
    selector: '[data-beat-layout-item="true"]',
  });
  const visibleRows = beat === 0 ? 2 : 3;
  const litTiers = beat === 0 ? 2 : 4;
  return (
    <div className={styles.sceneRoot} data-active={isActive ? "true" : "false"}>
      <div className={styles.ascentWrap}>
        <div className={styles.zigLayer} aria-hidden="true">
          {[0, 1, 2, 3].map((t) => (
            <span
              key={t}
              className={styles.zigFrame}
              data-tier={t}
              data-lit={t < litTiers ? "true" : "false"}
            />
          ))}
        </div>
        <div
          className={styles.tierStack}
          data-beat-layout-container="true"
          data-beat-layout-mode="motion"
          ref={ref}
        >
          {c.ascentRows.slice(0, visibleRows).map((label, i) => (
            <div
              key={label}
              className={styles.tierRow}
              data-beat-layout-item="true"
              style={{ width: `${34 - i * 8}cqw` }}
            >
              <span className={styles.chevron} aria-hidden="true" />
              <span className={styles.tierLabel}>{label}</span>
              <span className={styles.chevron} aria-hidden="true" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ================= Scene 3 — The Reveal ================= */
function RevealScene({
  c,
  beat,
  isActive,
  reducedMotion,
  isThumbnail,
}: {
  c: Content;
  beat: number;
  isActive: boolean;
  reducedMotion: boolean;
  isThumbnail: boolean;
}) {
  const { ref } = useFLIP<HTMLDivElement>({
    watch: [beat],
    disabled: reducedMotion || isThumbnail || !isActive,
    duration: 620,
    easing: "cubic-bezier(0.22, 0.61, 0.36, 1)",
    selector: '[data-beat-layout-item="true"]',
  });
  return (
    <div className={styles.sceneRoot} data-active={isActive ? "true" : "false"}>
      <div className={styles.revealWrap}>
        <div
          className={styles.sunburst}
          data-lit={isActive ? "true" : "false"}
          aria-hidden="true"
        >
          <span className={styles.sunburstInner} />
        </div>
        <div
          className={styles.revealStack}
          data-beat-layout-container="true"
          data-beat-layout-mode="motion"
          ref={ref}
        >
          <span className={styles.revealKicker} data-beat-layout-item="true">
            {c.reveal.kicker}
          </span>
          <h1 className={styles.revealHero} data-beat-layout-item="true">
            {c.reveal.hero}
          </h1>
          {beat >= 1 && (
            <p className={styles.revealBody} data-beat-layout-item="true">
              {c.reveal.body1}
            </p>
          )}
          {beat >= 2 && (
            <p className={styles.revealBody} data-beat-layout-item="true">
              {c.reveal.body2}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

/* ================= Scene 4 — The Specifications ================= */
function SpecScene({
  c,
  beat,
  isActive,
}: {
  c: Content;
  beat: number;
  isActive: boolean;
}) {
  const rightLit = beat >= 1;
  return (
    <div className={styles.sceneRoot} data-active={isActive ? "true" : "false"}>
      <div className={styles.specWrap}>
        <h1 className={styles.specTitle}>{c.spec.title}</h1>
        <span className={styles.specTitleRule} aria-hidden="true" />
        <div
          className={styles.specLedger}
          data-beat-layout-container="true"
          data-beat-layout-mode="reserved"
        >
          <div className={styles.specCol} data-beat-layout-item="true">
            {c.spec.left.map((row) => (
              <div key={row.label} className={styles.specRow}>
                <span className={styles.specLabel}>{row.label}</span>
                <span className={styles.specValue}>{row.value}</span>
              </div>
            ))}
          </div>
          <span className={styles.specCenterRule} aria-hidden="true" />
          <div
            className={`${styles.specCol} ${styles.specColRight}`}
            data-beat-layout-item="true"
            data-lit={rightLit ? "true" : "false"}
          >
            {c.spec.right.map((row) => (
              <div key={row.label} className={styles.specRow}>
                <span className={styles.specLabel}>{row.label}</span>
                <span className={styles.specValue}>{row.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= Scene 5 — The Seal ================= */
function SealScene({ c, isActive }: { c: Content; isActive: boolean }) {
  return (
    <div className={styles.sceneRoot} data-active={isActive ? "true" : "false"}>
      <div className={styles.sealWrap}>
        <span className={styles.sealTop}>{c.seal.top}</span>
        <div className={styles.sealArch}>
          <span className={styles.sealArchPlate} aria-hidden="true" />
          <span className={styles.sealArchFace} aria-hidden="true" />
          <span className={styles.sealWord}>{c.seal.word}</span>
        </div>
        <div className={styles.sealChevron} aria-hidden="true">
          <span className={styles.chevron} />
          <span className={styles.chevron} />
          <span className={styles.chevron} />
        </div>
        <p className={styles.sealSub}>{c.seal.sub}</p>
      </div>
    </div>
  );
}

/* ================= Nav — N10 ceremonial gate index ================= */
function GateIndex({
  scene,
  c,
  onNavigate,
}: {
  scene: number;
  c: Content;
  onNavigate?: (scene: number, beat: number) => void;
}) {
  return (
    <nav className={styles.gateIndex} aria-label="scene index">
      {GATE_LABELS.map((label, i) => {
        const target = i + 1;
        const active = target === scene;
        return (
          <button
            key={label}
            type="button"
            className={styles.gateMark}
            data-active={active ? "true" : "false"}
            aria-label={c.scenes[i].title}
            aria-current={active ? "true" : undefined}
            onClick={(e) => {
              e.stopPropagation();
              onNavigate?.(target, 0);
            }}
          >
            <span className={styles.gateMarkPlate} aria-hidden="true" />
            <span className={styles.gateMarkFace} aria-hidden="true" />
            <span className={styles.gateLabel}>{label}</span>
          </button>
        );
      })}
    </nav>
  );
}

/* ================= Root component ================= */
function GrandUnveilingV3({
  scene,
  beat,
  language,
  isThumbnail,
  reducedMotion,
  onNavigate,
}: BespokeStyleProps) {
  useFonts();
  const c = CONTENT[language];
  const still = reducedMotion || isThumbnail;

  return (
    <div className={styles.root} data-reduced={still ? "true" : "false"}>
      <SpatialSceneTrack
        scene={scene}
        beat={beat}
        transitionKind="scale-fade"
        transitionMap={TRANSITIONS}
        reducedMotion={still}
        beatLayoutModes={{ 2: "motion", 3: "motion", 4: "reserved" }}
        renderScene={(sceneId, sceneBeat, isActive) => {
          if (sceneId === 1) return <FacadeScene c={c} isActive={isActive} />;
          if (sceneId === 2)
            return (
              <AscentScene
                c={c}
                beat={sceneBeat}
                isActive={isActive}
                reducedMotion={reducedMotion}
                isThumbnail={isThumbnail}
              />
            );
          if (sceneId === 3)
            return (
              <RevealScene
                c={c}
                beat={sceneBeat}
                isActive={isActive}
                reducedMotion={reducedMotion}
                isThumbnail={isThumbnail}
              />
            );
          if (sceneId === 4)
            return <SpecScene c={c} beat={sceneBeat} isActive={isActive} />;
          return <SealScene c={c} isActive={isActive} />;
        }}
      />
      {!isThumbnail && (
        <GateIndex scene={scene} c={c} onNavigate={onNavigate} />
      )}
    </div>
  );
}

/* ================= Metadata ================= */
export function getMetadata(lang: Lang): StyleMetadata {
  const c = CONTENT[lang];
  return {
    id: "machine-age-deco",
    band: "craft-cultural",
    name: lang === "en" ? "Machine-Age Deco" : "机器时代装饰艺术",
    theme: c.theme,
    densityLabel: c.densityLabel,
    heroScene: 3,
    colors: { bg: "#0a1524", ink: "#a9b8c8", panel: "#0e1f33" },
    typography: { header: "Cinzel", body: "Josefin Sans" },
    tags: [
      "monumental",
      "ceremonial",
      "gilt",
      "symmetric",
      "low-density",
      "dark",
      "metallic",
      "stately",
    ],
    fonts: ["Cinzel", "Josefin Sans", "cjk:Noto Serif SC"],
    scenes: c.scenes.map((s, si) => ({
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

export const grandUnveilingTopic = defineStyleTopic({
  id: "grand-unveiling",
  topic: { en: "The Grand Unveiling", zh: "盛大揭幕" },
  model: "Claude-Opus-4.8",
  component: GrandUnveilingV3,
  getMetadata,
});

export default GrandUnveilingV3;

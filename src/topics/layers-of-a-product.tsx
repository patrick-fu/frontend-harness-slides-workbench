import type { CSSProperties, ReactNode } from "react";
import {
  defineTopic,
  type TopicMetadata,
  type TopicStageProps,
  type TopicTransitionScore,
} from "../domain/topic";
import SpatialSceneTrack from "../components/stage/SpatialSceneTrack";
import type { SceneTransitionMap } from "../components/stage/SpatialSceneTrack";
import { useFLIP } from "../hooks/useFLIP";
import styles from "./layers-of-a-product.module.css";

/* ── bilingual content (no `as const`) ─────────────────────────────── */
interface PaneCopy {
  tag: string;
  label: string;
  sub: string;
}
interface BeatCopy {
  action: string;
  title: string;
  body: string;
}
interface ProductCopy {
  name: string;
  rows: Array<{ n: string; label: string; val: string }>;
}
interface SceneCopy {
  title: string;
  kicker: string;
  headline: string;
  body: string;
  panes?: PaneCopy[];
  product?: ProductCopy;
  beats: BeatCopy[];
}
interface LangCopy {
  name: string;
  topic: string;
  densityLabel: string;
  behind: string;
  nav: string[];
  scenes: SceneCopy[];
}

const COPY: Record<"en" | "zh", LangCopy> = {
  en: {
    name: "Liquid Glass",
    topic: "Layers of a Product",
    densityLabel: "Layered",
    behind: "PRODUCT",
    nav: ["Surface", "Beneath", "Stack", "Focus", "Whole"],
    scenes: [
      {
        title: "The Surface",
        kicker: "Layer 01",
        headline: "It starts as one pane.",
        body: "A single sheet of glass settles over the product — the layer itself is a mark of care.",
        panes: [{ tag: "01 · Surface", label: "Surface", sub: "The face you meet first." }],
        beats: [{ action: "Pane settles in", title: "The surface", body: "One glass pane, edge catching light." }],
      },
      {
        title: "Beneath",
        kicker: "Layer 02",
        headline: "Something rests behind it.",
        body: "Move closer and a second pane reveals — real depth, gently parallaxed, not a flat blur.",
        panes: [
          { tag: "01 · Surface", label: "Surface", sub: "What you see." },
          { tag: "02 · Beneath", label: "Beneath", sub: "What supports it." },
        ],
        beats: [
          { action: "Front pane holds", title: "The surface", body: "The face stands alone." },
          { action: "Second pane reveals", title: "Beneath", body: "Depth opens behind it." },
        ],
      },
      {
        title: "The Stack",
        kicker: "Layers 01–03",
        headline: "Three layers, front to back.",
        body: "Separate the product and you see the stack: surface, logic, foundation — each its own pane.",
        panes: [
          { tag: "01", label: "Surface", sub: "Interface" },
          { tag: "02", label: "Logic", sub: "Behaviour" },
          { tag: "03", label: "Core", sub: "Foundation" },
        ],
        beats: [
          { action: "Front separates", title: "Surface", body: "The top layer lifts clear." },
          { action: "Middle emerges", title: "Logic", body: "Behaviour sits below the face." },
          { action: "Base grounds it", title: "Core", body: "The foundation holds the stack." },
        ],
      },
      {
        title: "The Focus",
        kicker: "Layer 02",
        headline: "One lifts into focus.",
        body: "A single pane rises forward, a specular glint tracing its edge — attention without a flash.",
        panes: [{ tag: "02 · Logic", label: "In focus", sub: "The layer that matters now." }],
        beats: [{ action: "Pane lifts, glint plays", title: "The focus", body: "One layer forward, edge alight." }],
      },
      {
        title: "Whole",
        kicker: "The product",
        headline: "The layers recombine.",
        body: "Stacked back together, the panes read as one object — depth you can feel, not just see.",
        product: {
          name: "The product",
          rows: [
            { n: "01", label: "Surface", val: "Clarity" },
            { n: "02", label: "Logic", val: "Intent" },
            { n: "03", label: "Core", val: "Trust" },
          ],
        },
        beats: [{ action: "Layers recombine", title: "Whole", body: "Three panes settle into one product." }],
      },
    ],
  },
  zh: {
    name: "液态玻璃",
    topic: "产品的层",
    densityLabel: "分层",
    behind: "产品",
    nav: ["表层", "其下", "层叠", "聚焦", "整体"],
    scenes: [
      {
        title: "表层",
        kicker: "第一层",
        headline: "始于一片玻璃。",
        body: "一片玻璃落在产品之上——这层本身，就是用心的印记。",
        panes: [{ tag: "01 · 表层", label: "表层", sub: "你最先触及的面。" }],
        beats: [{ action: "玻璃落定", title: "表层", body: "一片玻璃，边缘承光。" }],
      },
      {
        title: "其下",
        kicker: "第二层",
        headline: "其下另有支撑。",
        body: "凑近些，第二片玻璃显现——真实的纵深，轻缓视差，而非扁平的模糊。",
        panes: [
          { tag: "01 · 表层", label: "表层", sub: "所见之面。" },
          { tag: "02 · 其下", label: "其下", sub: "支撑之层。" },
        ],
        beats: [
          { action: "前片稳住", title: "表层", body: "面，独自伫立。" },
          { action: "后片显现", title: "其下", body: "纵深自其后展开。" },
        ],
      },
      {
        title: "层叠",
        kicker: "第一至三层",
        headline: "三层，由表及里。",
        body: "拆开产品，便见层叠：表层、逻辑、内核——各自成片。",
        panes: [
          { tag: "01", label: "表层", sub: "界面" },
          { tag: "02", label: "逻辑", sub: "行为" },
          { tag: "03", label: "内核", sub: "根基" },
        ],
        beats: [
          { action: "前层分离", title: "表层", body: "顶层清晰抬起。" },
          { action: "中层浮现", title: "逻辑", body: "行为居于面之下。" },
          { action: "底层承托", title: "内核", body: "根基托住整叠。" },
        ],
      },
      {
        title: "聚焦",
        kicker: "第二层",
        headline: "一层，浮起聚焦。",
        body: "一片玻璃向前浮起，一道高光掠过边缘——不靠闪烁，也见着重。",
        panes: [{ tag: "02 · 逻辑", label: "聚焦中", sub: "此刻要紧的一层。" }],
        beats: [{ action: "玻璃抬起，高光掠过", title: "聚焦", body: "一层向前，边缘生辉。" }],
      },
      {
        title: "整体",
        kicker: "产品",
        headline: "层，重新合拢。",
        body: "重新叠合，各片读作一个整体——纵深可感，而不止于可见。",
        product: {
          name: "这件产品",
          rows: [
            { n: "01", label: "表层", val: "清晰" },
            { n: "02", label: "逻辑", val: "意图" },
            { n: "03", label: "内核", val: "信任" },
          ],
        },
        beats: [{ action: "层层合拢", title: "整体", body: "三片玻璃归为一件产品。" }],
      },
    ],
  },
};

const TRANSITION_SCORE = {
  "1->2": "fade",
  "2->3": "scale-fade",
  "3->4": "scale-fade",
  "4->5": "fade",
} as const satisfies TopicTransitionScore;

const TRANSITIONS: SceneTransitionMap = TRANSITION_SCORE;

function GlassPane({
  pane,
  style,
  className,
  emph,
  glint,
  item,
}: {
  pane: PaneCopy;
  style: CSSProperties;
  className?: string;
  emph?: "on" | "off";
  glint?: boolean;
  item?: boolean;
}): ReactNode {
  return (
    <div
      className={[styles.pane, glint ? styles.glint : "", className].filter(Boolean).join(" ")}
      style={style}
      data-emph={emph}
      data-beat-layout-item={item ? "true" : undefined}
    >
      <span className={styles.paneTag}>{pane.tag}</span>
      <span className={styles.paneLabel}>{pane.label}</span>
      <span className={styles.paneSub}>{pane.sub}</span>
    </div>
  );
}

function Scene({
  sceneId,
  beat,
  isActive,
  language,
  reducedMotion,
  isThumbnail,
}: {
  sceneId: number;
  beat: number;
  isActive: boolean;
  language: "en" | "zh";
  reducedMotion: boolean;
  isThumbnail: boolean;
}): ReactNode {
  const disabled = reducedMotion || isThumbnail || !isActive;
  const data = COPY[language].scenes[sceneId - 1];
  const behind = COPY[language].behind;
  const panes = data.panes ?? [];

  const flip = useFLIP<HTMLDivElement>({
    watch: [beat],
    disabled: disabled || sceneId !== 2,
    duration: 520,
    easing: "cubic-bezier(0.34, 1.56, 0.64, 1)",
    selector: '[data-beat-layout-item="true"]',
  });

  const caption = (align: "tl" | "bl", maxWidth: string): ReactNode => (
    <div className={styles.caption} data-align={align} style={{ maxWidth }}>
      <span className={styles.kicker}>{data.kicker}</span>
      <h1 className={styles.headline}>{data.headline}</h1>
      <p className={styles.body}>{data.body}</p>
    </div>
  );

  if (sceneId === 1) {
    return (
      <div className={styles.scene}>
        <div className={styles.behind}>{behind}</div>
        {caption("tl", "40cqw")}
        <GlassPane
          pane={panes[0]}
          className={isActive ? styles.settle : undefined}
          style={{ left: "54cqw", top: "22cqh", width: "36cqw", height: "58cqh", zIndex: 3 }}
        />
      </div>
    );
  }

  if (sceneId === 2) {
    return (
      <div className={styles.scene}>
        <div className={styles.behind}>{behind}</div>
        {caption("bl", "42cqw")}
        <div
          ref={flip.ref}
          className={styles.layerField}
          data-beat-layout-container="true"
          data-beat-layout-mode="motion"
        >
          <GlassPane
            key="back"
            item
            pane={panes[1]}
            className={styles.flipItem}
            style={{
              left: "24cqw",
              top: "14cqh",
              width: "34cqw",
              height: "50cqh",
              zIndex: 2,
              opacity: beat >= 1 ? 0.92 : 0,
            }}
          />
          <GlassPane
            key="front"
            item
            pane={panes[0]}
            className={[styles.flipItem, beat === 0 && isActive ? styles.settle : ""].filter(Boolean).join(" ")}
            style={
              beat === 0
                ? { left: "36cqw", top: "22cqh", width: "36cqw", height: "56cqh", zIndex: 4 }
                : { left: "46cqw", top: "30cqh", width: "36cqw", height: "56cqh", zIndex: 4 }
            }
          />
        </div>
      </div>
    );
  }

  if (sceneId === 3) {
    const emph = (idx: number): "on" | "off" => (beat >= idx ? "on" : "off");
    return (
      <div className={styles.scene}>
        <div className={styles.behind}>{behind}</div>
        {caption("bl", "33cqw")}
        <div
          className={styles.layerField}
          data-beat-layout-container="true"
          data-beat-layout-mode="reserved"
        >
          <GlassPane
            key="c"
            item
            pane={panes[2]}
            emph={emph(2)}
            style={{ left: "40cqw", top: "8cqh", width: "28cqw", height: "44cqh", zIndex: 2 }}
          />
          <GlassPane
            key="b"
            item
            pane={panes[1]}
            emph={emph(1)}
            style={{ left: "52cqw", top: "20cqh", width: "28cqw", height: "44cqh", zIndex: 3 }}
          />
          <GlassPane
            key="a"
            item
            pane={panes[0]}
            emph="on"
            style={{ left: "46cqw", top: "32cqh", width: "28cqw", height: "44cqh", zIndex: 4 }}
          />
        </div>
      </div>
    );
  }

  if (sceneId === 4) {
    return (
      <div className={styles.scene}>
        <div className={styles.behind}>{behind}</div>
        {caption("tl", "40cqw")}
        <GlassPane
          pane={panes[0]}
          glint={!disabled}
          className={isActive ? styles.lift : undefined}
          style={{ left: "50cqw", top: "20cqh", width: "38cqw", height: "58cqh", zIndex: 5 }}
        />
      </div>
    );
  }

  const product = data.product;
  return (
    <div className={styles.scene}>
      <div className={styles.behind}>{behind}</div>
      {caption("tl", "38cqw")}
      <div
        className={[styles.pane, styles.product, isActive ? styles.settle : ""].filter(Boolean).join(" ")}
        style={{ left: "50cqw", top: "16cqh", width: "40cqw", height: "66cqh", zIndex: 4 }}
      >
        <span className={styles.paneTag}>{data.kicker}</span>
        <span className={styles.productName}>{product?.name}</span>
        <div className={styles.productRows}>
          {product?.rows.map((r) => (
            <div key={r.n} className={styles.productRow}>
              <span>{r.n}</span>
              <b>{r.label}</b>
              <i>{r.val}</i>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DepthNav({
  scene,
  labels,
  isThumbnail,
  onNavigate,
}: {
  scene: number;
  labels: string[];
  isThumbnail: boolean;
  onNavigate?: (scene: number, beat: number) => void;
}): ReactNode {
  if (isThumbnail) return null;
  return (
    <div
      data-topic-navigation="true"
      data-navigation-geometry="object-controller"
      data-navigation-carrier="product-layer-stack"
      data-navigation-invocation="drag-scrub"
      data-navigation-feedback="next-state-preview"
      className={styles.nav}
      aria-label="layer depth"
    >
      {labels.map((label, i) => {
        const sceneId = i + 1;
        const active = sceneId === scene;
        return (
          <button
            key={sceneId}
            type="button"
            className={styles.navChip}
            data-active={active ? "true" : "false"}
            title={label}
            aria-label={label}
            aria-current={active ? "true" : undefined}
            onClick={(e) => {
              e.stopPropagation();
              onNavigate?.(sceneId, 0);
            }}
          >
            <span />
            <span />
            <span />
          </button>
        );
      })}
    </div>
  );
}

function TopicStage({
  scene,
  beat,
  language,
  isThumbnail,
  reducedMotion,
  onNavigate,
}: TopicStageProps): ReactNode {
  const motionOff = reducedMotion || isThumbnail;
  return (
    <div className={styles.root} data-lang={language} data-motion={motionOff ? "off" : "on"}>
      <div className={styles.ambient}>
        <div className={styles.orb} data-orb="a" />
        <div className={styles.orb} data-orb="b" />
      </div>
      <SpatialSceneTrack
        scene={scene}
        beat={beat}
        transitionKind="scale-fade"
        transitionMap={TRANSITIONS}
        reducedMotion={motionOff}
        beatLayoutModes={{ 2: "motion", 3: "reserved" }}
        renderScene={(sceneId, sceneBeat, isActive) => (
          <Scene
            sceneId={sceneId}
            beat={sceneBeat}
            isActive={isActive}
            language={language}
            reducedMotion={reducedMotion}
            isThumbnail={isThumbnail}
          />
        )}
      />
      <DepthNav scene={scene} labels={COPY[language].nav} isThumbnail={isThumbnail} onNavigate={onNavigate} />
    </div>
  );
}

function buildMetadata(lang: "en" | "zh"): TopicMetadata {
  const c = COPY[lang];
  return {
    theme: c.topic,
    densityLabel: c.densityLabel,
    heroScene: 3,
    colors: { bg: "#0b1116", ink: "#eef4f8", panel: "#e8f1f6" },
    typography: { header: "Inter", body: "Inter" },
    tags: [
      "luminous",
      "refined",
      "spatial",
      "translucent",
      "layered",
      "cool-neutral",
      "depth",
      "calm-motion",
      "glass",
      "product",
    ],
    fonts: ["Inter:wght@400;600;700", "cjk:Noto Sans SC:wght@400;500;700"],
    scenes: c.scenes.map((s, i) => ({
      id: i + 1,
      title: s.title,
      beats: s.beats.map((b, bi) => ({ id: bi, action: b.action, title: b.title, body: b.body })),
    })),
  };
}

const metadata = {
  en: buildMetadata("en"),
  zh: buildMetadata("zh"),
};

export default defineTopic({
  id: "layers-of-a-product",
  styleId: "liquid-glass",
  title: { en: "Layers of a Product", zh: "产品的层" },
  modelId: "Claude Opus 4.8",
  Stage: TopicStage,
  metadata,
  navigation: {
    geometry: "object-controller",
    carrier: "product-layer-stack",
    invocation: "drag-scrub",
    feedback: "next-state-preview",
  },
  transitionScore: TRANSITION_SCORE,
  evidence: {
    kind: "illustrative",
    boundary: {
      en: "Illustrative scenario: names, figures, and outcomes are presentation examples, not external factual claims.",
      zh: "示例场景：其中名称、数字和结果均为演示内容，并非外部事实主张。",
    },
    display: "envelope",
  },
});

import { useEffect } from "react";
import type React from "react";
import type { BespokeStyleProps, StyleMetadata } from "../types";
import SpatialSceneTrack, {
  type BeatLayoutMode,
  type SceneTransitionMap,
} from "./SpatialSceneTrack";
import { defineStyleVersion } from "./version";

type Language = "en" | "zh";
type SceneId = 1 | 2 | 3 | 4 | 5;

interface SceneCopy {
  kicker: string;
  title: string;
  body: string;
  quiet: string;
  proof: string;
  choice: string;
  closing: string;
}

type CSSVars = React.CSSProperties & Record<`--${string}`, string>;

const SCENE_IDS: SceneId[] = [1, 2, 3, 4, 5];

const TRANSITION_MAP: SceneTransitionMap = {
  "1->2": "scale-fade",
  "2->3": "wipe",
  "3->4": "fade",
  "4->5": "hard-cut",
};

const BEAT_LAYOUT_MODES: Partial<Record<number, BeatLayoutMode>> = {
  1: "reserved",
  2: "reserved",
  3: "reserved",
  4: "reserved",
  5: "reserved",
};

const MAX_BEATS: Record<SceneId, number> = {
  1: 2,
  2: 2,
  3: 3,
  4: 3,
  5: 2,
};

const COPY: Record<SceneId, Record<Language, SceneCopy>> = {
  1: {
    en: {
      kicker: "THRESHOLD",
      title: "The window opens only when the room gets quiet.",
      body: "No countdown. No pressure wave. Just the moment the signal stops shaking.",
      quiet: "Launch condition: calm demand.",
      proof: "Signal held through the last private loop.",
      choice: "Wait for quiet.",
      closing: "The edge is the product.",
    },
    zh: {
      kicker: "门槛",
      title: "只有房间安静下来，窗口才打开。",
      body: "没有倒计时。没有声浪。只有信号停止晃动的那一刻。",
      quiet: "发布条件：需求安静。",
      proof: "最后一轮内测后，信号仍然稳定。",
      choice: "等到安静。",
      closing: "边界就是产品。",
    },
  },
  2: {
    en: {
      kicker: "SILHOUETTE",
      title: "Show less of the product. Let the shape do the work.",
      body: "A narrow reveal makes the object feel finished before it speaks.",
      quiet: "One aperture. One surface.",
      proof: "Detail visible only after intent is clear.",
      choice: "Keep the object held back.",
      closing: "The reveal stays narrow.",
    },
    zh: {
      kicker: "轮廓",
      title: "少展示产品，让形状自己说话。",
      body: "窄幅露出，让对象在开口之前就像已经完成。",
      quiet: "一个孔径。一个表面。",
      proof: "意图明确之后，细节才出现。",
      choice: "让对象继续保持克制。",
      closing: "露出保持很窄。",
    },
  },
  3: {
    en: {
      kicker: "PROOF SIGNAL",
      title: "The proof is not loud. It refuses to drift.",
      body: "Private users return, support stays still, and the same sentence keeps landing.",
      quiet: "Return signal",
      proof: "steady for 21 days",
      choice: "Treat stability as the headline.",
      closing: "The line held.",
    },
    zh: {
      kicker: "证明信号",
      title: "证明不需要响亮。它只是不再漂移。",
      body: "内测用户回来，支持量没有抬头，同一句话持续成立。",
      quiet: "回访信号",
      proof: "连续 21 天稳定",
      choice: "把稳定当作标题。",
      closing: "这条线守住了。",
    },
  },
  4: {
    en: {
      kicker: "LAUNCH CHOICE",
      title: "Do we open the door, or preserve the hush?",
      body: "The decision is not volume. It is whether the quiet survives first contact.",
      quiet: "Hold",
      proof: "Open",
      choice: "Open, but keep the aperture small.",
      closing: "Small window. Real launch.",
    },
    zh: {
      kicker: "发布选择",
      title: "我们打开门，还是保留这份安静？",
      body: "决策不是音量，而是第一次接触后，安静是否仍然存在。",
      quiet: "继续等待",
      proof: "打开窗口",
      choice: "打开，但保持小孔径。",
      closing: "小窗口。真发布。",
    },
  },
  5: {
    en: {
      kicker: "FINAL LINE",
      title: "Launch as a window, not a broadcast.",
      body: "A quiet entrance gives the product its first honest room.",
      quiet: "Quiet launch window",
      proof: "v2",
      choice: "The line is ready.",
      closing: "Open softly.",
    },
    zh: {
      kicker: "最后一句",
      title: "发布是一扇窗口，不是一场广播。",
      body: "安静进入，产品才有第一个诚实的房间。",
      quiet: "安静发布窗口",
      proof: "v2",
      choice: "这句话已经准备好。",
      closing: "轻轻打开。",
    },
  },
};

const META_SCENES: Record<Language, StyleMetadata["scenes"]> = {
  en: [
    {
      id: 1,
      title: "Threshold",
      beats: [
        {
          id: 0,
          action: "Hold a nearly blank threshold with a closed aperture.",
          title: "The window opens only when the room gets quiet.",
          body: "No countdown. No pressure wave.",
        },
        {
          id: 1,
          action: "Reveal the launch condition without moving the layout.",
          title: "Launch condition",
          body: "Calm demand.",
        },
      ],
    },
    {
      id: 2,
      title: "Product Silhouette",
      beats: [
        {
          id: 0,
          action: "Present a restrained product silhouette.",
          title: "Show less of the product.",
          body: "Let the shape do the work.",
        },
        {
          id: 1,
          action: "Light one narrow product aperture.",
          title: "One aperture",
          body: "One surface.",
        },
      ],
    },
    {
      id: 3,
      title: "Proof Signal",
      beats: [
        {
          id: 0,
          action: "Reserve the proof field with a single baseline.",
          title: "The proof is not loud.",
          body: "It refuses to drift.",
        },
        {
          id: 1,
          action: "Reveal the held return signal.",
          title: "Return signal",
          body: "steady for 21 days",
        },
        {
          id: 2,
          action: "Mark stability as the headline.",
          title: "The line held.",
          body: "Treat stability as the headline.",
        },
      ],
    },
    {
      id: 4,
      title: "Launch Choice",
      beats: [
        {
          id: 0,
          action: "Frame the decision as a quiet door.",
          title: "Open the door?",
          body: "Or preserve the hush?",
        },
        {
          id: 1,
          action: "Reveal the hold option in a reserved slot.",
          title: "Hold",
          body: "Preserve quiet.",
        },
        {
          id: 2,
          action: "Reveal the selected open option.",
          title: "Open",
          body: "Keep the aperture small.",
        },
      ],
    },
    {
      id: 5,
      title: "Final Line",
      beats: [
        {
          id: 0,
          action: "Hold the final line alone.",
          title: "Launch as a window, not a broadcast.",
          body: "A quiet entrance gives the product its first honest room.",
        },
        {
          id: 1,
          action: "Add the small maker mark and close softly.",
          title: "Open softly.",
          body: "Quiet launch window.",
        },
      ],
    },
  ],
  zh: [
    {
      id: 1,
      title: "门槛",
      beats: [
        {
          id: 0,
          action: "保留近乎空白的门槛和关闭的孔径。",
          title: "只有房间安静下来，窗口才打开。",
          body: "没有倒计时。没有声浪。",
        },
        {
          id: 1,
          action: "在不移动版式的前提下揭示发布条件。",
          title: "发布条件",
          body: "需求安静。",
        },
      ],
    },
    {
      id: 2,
      title: "产品轮廓",
      beats: [
        {
          id: 0,
          action: "呈现克制的产品轮廓。",
          title: "少展示产品。",
          body: "让形状自己说话。",
        },
        {
          id: 1,
          action: "点亮一条很窄的产品孔径。",
          title: "一个孔径",
          body: "一个表面。",
        },
      ],
    },
    {
      id: 3,
      title: "证明信号",
      beats: [
        {
          id: 0,
          action: "用单条基线预留证明区域。",
          title: "证明不需要响亮。",
          body: "它只是不再漂移。",
        },
        {
          id: 1,
          action: "揭示持续成立的回访信号。",
          title: "回访信号",
          body: "连续 21 天稳定",
        },
        {
          id: 2,
          action: "把稳定标记为真正标题。",
          title: "这条线守住了。",
          body: "把稳定当作标题。",
        },
      ],
    },
    {
      id: 4,
      title: "发布选择",
      beats: [
        {
          id: 0,
          action: "把决策框成一扇安静的门。",
          title: "打开门？",
          body: "还是保留这份安静？",
        },
        {
          id: 1,
          action: "在预留槽位里揭示等待选项。",
          title: "继续等待",
          body: "保留安静。",
        },
        {
          id: 2,
          action: "揭示被选择的打开选项。",
          title: "打开窗口",
          body: "保持小孔径。",
        },
      ],
    },
    {
      id: 5,
      title: "最后一句",
      beats: [
        {
          id: 0,
          action: "单独保留最后一句。",
          title: "发布是一扇窗口，不是一场广播。",
          body: "安静进入，产品才有第一个诚实的房间。",
        },
        {
          id: 1,
          action: "加入微小署名并轻轻收束。",
          title: "轻轻打开。",
          body: "安静发布窗口。",
        },
      ],
    },
  ],
};

function useFonts() {
  useEffect(() => {
    const id = "style-01-quiet-launch-window-v2-fonts";
    if (document.getElementById(id)) return;

    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;520;680&family=Noto+Sans+SC:wght@300;400;500;700&display=swap";
    document.head.appendChild(link);
  }, []);
}

function toSceneId(scene: number): SceneId {
  return SCENE_IDS.includes(scene as SceneId) ? (scene as SceneId) : 1;
}

function clampBeat(scene: SceneId, beat: number): number {
  return Math.max(0, Math.min(Math.trunc(beat), MAX_BEATS[scene] - 1));
}

function revealStyle(
  visible: boolean,
  reducedMotion: boolean,
  delay = "0s",
): React.CSSProperties {
  return {
    opacity: visible ? 1 : 0,
    visibility: visible ? "visible" : "hidden",
    transform: visible ? "translateY(0)" : "translateY(0.75cqh)",
    transition: reducedMotion
      ? "none"
      : `opacity 760ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}, transform 760ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}`,
  };
}

function getCopy(scene: SceneId, language: Language): SceneCopy {
  return COPY[scene][language];
}

export function getMetadata(lang: Language): StyleMetadata {
  return {
    id: "01",
    band: "minimal-keynote",
    name: lang === "zh" ? "极简产品 Keynote" : "Minimal Product Keynote",
    theme: lang === "zh" ? "安静发布窗口" : "Quiet Launch Window",
    densityLabel: lang === "zh" ? "稀疏" : "Sparse",
    heroScene: 2,
    colors: {
      bg: "#f5f1e8",
      ink: "#11100d",
      panel: "#e8e0d4",
    },
    typography: {
      header: "Inter 680",
      body: "Inter 300",
    },
    tags: ["minimal", "keynote", "product", "premium", "reserved"],
    fonts: ["Inter", "cjk:Noto Sans SC"],
    scenes: META_SCENES[lang],
  };
}

export default function QuietLaunchWindowV2({
  scene,
  beat,
  language,
  isThumbnail,
  reducedMotion,
  onNavigate,
}: BespokeStyleProps) {
  useFonts();

  const activeScene = toSceneId(scene);
  const activeBeat = clampBeat(activeScene, beat);
  const motionOff = reducedMotion || isThumbnail;

  return (
    <section
      data-style-id="01"
      data-style-version="v2"
      data-topic="quiet-launch-window"
      style={rootStyle}
    >
      <QuietChrome
        activeScene={activeScene}
        language={language}
        isThumbnail={isThumbnail}
      />
      <SpatialSceneTrack
        scene={activeScene}
        beat={activeBeat}
        sceneIds={SCENE_IDS}
        transitionKind="scale-fade"
        transitionMap={TRANSITION_MAP}
        transitionDurationMs={720}
        reducedMotion={motionOff}
        beatLayoutModes={BEAT_LAYOUT_MODES}
        className="quiet-launch-window-v2-track"
        renderScene={(trackScene, trackBeat, isActive) => {
          const sceneId = toSceneId(trackScene);
          return (
            <ScenePanel
              scene={sceneId}
              beat={clampBeat(sceneId, trackBeat)}
              language={language}
              isActive={isActive}
              reducedMotion={motionOff}
            />
          );
        }}
      />
      <ApertureNav
        activeScene={activeScene}
        hidden={isThumbnail}
        onNavigate={onNavigate}
      />
    </section>
  );
}

function QuietChrome({
  activeScene,
  language,
  isThumbnail,
}: {
  activeScene: SceneId;
  language: Language;
  isThumbnail: boolean;
}) {
  const copy = getCopy(activeScene, language);

  return (
    <div aria-hidden="true" style={chromeStyle}>
      <div style={makerMarkStyle}>{copy.kicker}</div>
      {!isThumbnail && <div style={sceneCountStyle}>0{activeScene}/05</div>}
    </div>
  );
}

function ScenePanel({
  scene,
  beat,
  language,
  isActive,
  reducedMotion,
}: {
  scene: SceneId;
  beat: number;
  language: Language;
  isActive: boolean;
  reducedMotion: boolean;
}) {
  const copy = getCopy(scene, language);

  return (
    <article
      data-scene={scene}
      data-active-panel={isActive ? "true" : "false"}
      style={sceneShellStyle}
    >
      <div data-beat-layout-item="true" style={headlineBlockStyle}>
        <div style={kickerStyle}>{copy.kicker}</div>
        <h1 style={headlineStyle}>{copy.title}</h1>
      </div>

      <div
        data-beat-layout-item="true"
        style={{
          ...bodySlotStyle,
          ...revealStyle(beat >= 0, reducedMotion),
        }}
      >
        {copy.body}
      </div>

      <div data-beat-layout-item="true" style={visualSlotStyle}>
        {scene === 1 && (
          <ThresholdVisual
            beat={beat}
            copy={copy}
            reducedMotion={reducedMotion}
          />
        )}
        {scene === 2 && (
          <ProductSilhouette
            beat={beat}
            copy={copy}
            reducedMotion={reducedMotion}
          />
        )}
        {scene === 3 && (
          <ProofSignal beat={beat} copy={copy} reducedMotion={reducedMotion} />
        )}
        {scene === 4 && (
          <LaunchChoice beat={beat} copy={copy} reducedMotion={reducedMotion} />
        )}
        {scene === 5 && (
          <FinalLine beat={beat} copy={copy} reducedMotion={reducedMotion} />
        )}
      </div>
    </article>
  );
}

function ThresholdVisual({
  beat,
  copy,
  reducedMotion,
}: {
  beat: number;
  copy: SceneCopy;
  reducedMotion: boolean;
}) {
  return (
    <div style={thresholdWrapStyle}>
      <div style={thresholdLineStyle} />
      <div
        data-beat-layout-item="true"
        style={{
          ...thresholdNoteStyle,
          ...revealStyle(beat >= 1, reducedMotion, "120ms"),
        }}
      >
        {copy.quiet}
      </div>
    </div>
  );
}

function ProductSilhouette({
  beat,
  copy,
  reducedMotion,
}: {
  beat: number;
  copy: SceneCopy;
  reducedMotion: boolean;
}) {
  return (
    <div style={productWrapStyle}>
      <div style={productBodyStyle}>
        <div style={productApertureStyle} />
        <div
          style={{
            ...productDetailStyle,
            ...revealStyle(beat >= 1, reducedMotion, "120ms"),
          }}
        >
          {copy.quiet}
        </div>
      </div>
    </div>
  );
}

function ProofSignal({
  beat,
  copy,
  reducedMotion,
}: {
  beat: number;
  copy: SceneCopy;
  reducedMotion: boolean;
}) {
  return (
    <div style={proofWrapStyle}>
      <svg
        aria-hidden="true"
        viewBox="0 0 640 180"
        preserveAspectRatio="none"
        style={proofSvgStyle}
      >
        <path
          d="M20 126 C140 126 168 84 268 84 C368 84 382 84 472 84 C540 84 582 72 620 72"
          fill="none"
          stroke="var(--style-01-ink)"
          strokeLinecap="round"
          strokeWidth="5"
          opacity={beat >= 1 ? "0.86" : "0.2"}
        />
        <path
          d="M20 138 L620 138"
          fill="none"
          stroke="var(--style-01-hairline)"
          strokeLinecap="round"
          strokeWidth="3"
        />
        <circle
          cx="472"
          cy="84"
          r="10"
          fill="var(--style-01-accent)"
          opacity={beat >= 2 ? "1" : "0"}
        />
      </svg>
      <div style={proofTextRailStyle}>
        <span
          style={{
            ...proofLabelStyle,
            ...revealStyle(beat >= 1, reducedMotion, "80ms"),
          }}
        >
          {copy.quiet}
        </span>
        <span
          style={{
            ...proofValueStyle,
            ...revealStyle(beat >= 2, reducedMotion, "120ms"),
          }}
        >
          {copy.proof}
        </span>
      </div>
    </div>
  );
}

function LaunchChoice({
  beat,
  copy,
  reducedMotion,
}: {
  beat: number;
  copy: SceneCopy;
  reducedMotion: boolean;
}) {
  return (
    <div style={choiceWrapStyle}>
      <div
        style={{
          ...choiceOptionStyle,
          ...revealStyle(beat >= 1, reducedMotion, "80ms"),
        }}
      >
        <span style={choiceLabelStyle}>{copy.quiet}</span>
      </div>
      <div
        style={{
          ...choiceOptionStyle,
          ...selectedChoiceStyle,
          ...revealStyle(beat >= 2, reducedMotion, "140ms"),
        }}
      >
        <span style={choiceLabelStyle}>{copy.proof}</span>
      </div>
      <div
        style={{
          ...choiceLineStyle,
          ...revealStyle(beat >= 2, reducedMotion, "180ms"),
        }}
      >
        {copy.choice}
      </div>
    </div>
  );
}

function FinalLine({
  beat,
  copy,
  reducedMotion,
}: {
  beat: number;
  copy: SceneCopy;
  reducedMotion: boolean;
}) {
  return (
    <div style={finalWrapStyle}>
      <div
        style={{
          ...finalMarkStyle,
          ...revealStyle(beat >= 1, reducedMotion, "80ms"),
        }}
      >
        {copy.quiet} · {copy.proof}
      </div>
      <div
        style={{
          ...finalCloseStyle,
          ...revealStyle(beat >= 1, reducedMotion, "140ms"),
        }}
      >
        {copy.closing}
      </div>
    </div>
  );
}

function ApertureNav({
  activeScene,
  hidden,
  onNavigate,
}: {
  activeScene: SceneId;
  hidden: boolean;
  onNavigate?: (scene: number, beat: number) => void;
}) {
  if (hidden) return null;

  return (
    <nav aria-label="Scene aperture" style={navStyle}>
      {SCENE_IDS.map((targetScene) => {
        const active = targetScene === activeScene;
        return (
          <button
            key={targetScene}
            type="button"
            aria-label={`Scene ${targetScene}`}
            aria-current={active ? "step" : undefined}
            onClick={() => onNavigate?.(targetScene, 0)}
            style={{
              ...navButtonStyle,
              ...(active ? activeNavButtonStyle : null),
            }}
          >
            <span style={active ? activeNavMarkStyle : navMarkStyle} />
          </button>
        );
      })}
    </nav>
  );
}

const rootStyle: CSSVars = {
  "--style-01-bg": "#f5f1e8",
  "--style-01-ink": "#11100d",
  "--style-01-soft": "#6f6a60",
  "--style-01-panel": "#e8e0d4",
  "--style-01-hairline": "rgba(17, 16, 13, 0.18)",
  "--style-01-accent": "#1d6d65",
  "--style-01-accent-soft": "rgba(29, 109, 101, 0.16)",
  position: "relative",
  width: "100%",
  height: "100%",
  containerType: "size",
  overflow: "hidden",
  background:
    "radial-gradient(circle at 54% 42%, rgba(255, 252, 244, 0.88), transparent 32cqw), var(--style-01-bg)",
  color: "var(--style-01-ink)",
  fontFamily:
    "Inter, 'Noto Sans SC', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
};

const chromeStyle: React.CSSProperties = {
  position: "absolute",
  inset: "5.2cqh 5.2cqw auto 5.2cqw",
  zIndex: 5,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  pointerEvents: "none",
  color: "var(--style-01-soft)",
};

const makerMarkStyle: React.CSSProperties = {
  fontSize: "0.72cqw",
  fontWeight: 520,
  lineHeight: 1,
  letterSpacing: "0",
  textTransform: "uppercase",
};

const sceneCountStyle: React.CSSProperties = {
  fontSize: "0.72cqw",
  fontWeight: 400,
  lineHeight: 1,
  letterSpacing: "0",
};

const sceneShellStyle: React.CSSProperties = {
  position: "absolute",
  inset: "0",
  display: "grid",
  gridTemplateColumns: "58cqw 28cqw",
  gridTemplateRows: "15cqh 28cqh 36cqh 21cqh",
  columnGap: "5cqw",
  padding: "11cqh 8cqw 8cqh 9cqw",
  boxSizing: "border-box",
};

const headlineBlockStyle: React.CSSProperties = {
  gridColumn: "1 / 2",
  gridRow: "2 / 3",
  alignSelf: "end",
};

const kickerStyle: React.CSSProperties = {
  marginBottom: "2cqh",
  color: "var(--style-01-soft)",
  fontSize: "0.86cqw",
  fontWeight: 520,
  lineHeight: 1,
  letterSpacing: "0",
  textTransform: "uppercase",
};

const headlineStyle: React.CSSProperties = {
  margin: "0",
  maxWidth: "58cqw",
  fontSize: "4.9cqw",
  fontWeight: 680,
  lineHeight: 0.95,
  letterSpacing: "0",
};

const bodySlotStyle: React.CSSProperties = {
  gridColumn: "1 / 2",
  gridRow: "3 / 4",
  maxWidth: "36cqw",
  alignSelf: "start",
  color: "var(--style-01-soft)",
  fontSize: "1.3cqw",
  fontWeight: 300,
  lineHeight: 1.45,
  letterSpacing: "0",
};

const visualSlotStyle: React.CSSProperties = {
  gridColumn: "2 / 3",
  gridRow: "2 / 4",
  alignSelf: "center",
  justifySelf: "center",
  width: "28cqw",
  height: "53cqh",
  position: "relative",
};

const thresholdWrapStyle: React.CSSProperties = {
  position: "absolute",
  inset: "2cqh 0",
  display: "grid",
  gridTemplateRows: "1fr 8cqh",
  placeItems: "center",
};

const thresholdLineStyle: React.CSSProperties = {
  width: "0.2cqw",
  height: "34cqh",
  borderRadius: "50%",
  background:
    "linear-gradient(180deg, transparent, var(--style-01-ink) 18%, var(--style-01-accent) 52%, var(--style-01-ink) 82%, transparent)",
};

const thresholdNoteStyle: React.CSSProperties = {
  color: "var(--style-01-soft)",
  fontSize: "1.05cqw",
  fontWeight: 400,
  lineHeight: 1.2,
  letterSpacing: "0",
  textAlign: "center",
};

const productWrapStyle: React.CSSProperties = {
  position: "absolute",
  inset: "1cqh 0",
  display: "grid",
  placeItems: "center",
};

const productBodyStyle: React.CSSProperties = {
  position: "relative",
  width: "18cqw",
  height: "42cqh",
  borderRadius: "2.8cqw",
  background: "linear-gradient(145deg, #1b1a16, #0e0d0b 58%, #2a2822)",
  border: "0.08cqw solid rgba(17, 16, 13, 0.72)",
  overflow: "hidden",
};

const productApertureStyle: React.CSSProperties = {
  position: "absolute",
  top: "10cqh",
  left: "50%",
  width: "0.4cqw",
  height: "20cqh",
  transform: "translateX(-50%)",
  borderRadius: "50%",
  background:
    "linear-gradient(180deg, transparent, rgba(245, 241, 232, 0.9), var(--style-01-accent), rgba(245, 241, 232, 0.72), transparent)",
};

const productDetailStyle: React.CSSProperties = {
  position: "absolute",
  left: "3cqw",
  right: "3cqw",
  bottom: "6cqh",
  color: "rgba(245, 241, 232, 0.72)",
  fontSize: "0.92cqw",
  fontWeight: 300,
  lineHeight: 1.35,
  letterSpacing: "0",
  textAlign: "center",
};

const proofWrapStyle: React.CSSProperties = {
  position: "absolute",
  inset: "6cqh 0 0 0",
  display: "grid",
  gridTemplateRows: "28cqh 13cqh",
  alignItems: "center",
};

const proofSvgStyle: React.CSSProperties = {
  width: "27cqw",
  height: "24cqh",
  overflow: "visible",
};

const proofTextRailStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateRows: "4cqh 5cqh",
  alignItems: "center",
  textAlign: "center",
};

const proofLabelStyle: React.CSSProperties = {
  color: "var(--style-01-soft)",
  fontSize: "0.95cqw",
  fontWeight: 400,
  lineHeight: 1,
  letterSpacing: "0",
};

const proofValueStyle: React.CSSProperties = {
  color: "var(--style-01-ink)",
  fontSize: "1.55cqw",
  fontWeight: 520,
  lineHeight: 1,
  letterSpacing: "0",
};

const choiceWrapStyle: React.CSSProperties = {
  position: "absolute",
  inset: "5cqh 0",
  display: "grid",
  gridTemplateRows: "12cqh 12cqh 11cqh",
  gap: "4cqh",
  alignContent: "center",
};

const choiceOptionStyle: React.CSSProperties = {
  display: "grid",
  placeItems: "center",
  border: "0.08cqw solid var(--style-01-hairline)",
  borderRadius: "8cqw",
  color: "var(--style-01-soft)",
  background: "rgba(245, 241, 232, 0.26)",
};

const selectedChoiceStyle: React.CSSProperties = {
  color: "var(--style-01-ink)",
  borderColor: "var(--style-01-accent)",
  background: "var(--style-01-accent-soft)",
};

const choiceLabelStyle: React.CSSProperties = {
  fontSize: "1.12cqw",
  fontWeight: 520,
  lineHeight: 1,
  letterSpacing: "0",
};

const choiceLineStyle: React.CSSProperties = {
  color: "var(--style-01-soft)",
  fontSize: "0.98cqw",
  fontWeight: 300,
  lineHeight: 1.35,
  letterSpacing: "0",
  textAlign: "center",
};

const finalWrapStyle: React.CSSProperties = {
  position: "absolute",
  inset: "10cqh 0",
  display: "grid",
  gridTemplateRows: "1fr 6cqh 7cqh",
  alignItems: "end",
  textAlign: "center",
};

const finalMarkStyle: React.CSSProperties = {
  gridRow: "2 / 3",
  color: "var(--style-01-soft)",
  fontSize: "0.82cqw",
  fontWeight: 520,
  lineHeight: 1,
  letterSpacing: "0",
  textTransform: "uppercase",
};

const finalCloseStyle: React.CSSProperties = {
  gridRow: "3 / 4",
  color: "var(--style-01-accent)",
  fontSize: "1.22cqw",
  fontWeight: 520,
  lineHeight: 1.2,
  letterSpacing: "0",
};

const navStyle: React.CSSProperties = {
  position: "absolute",
  right: "4.7cqw",
  top: "50%",
  transform: "translateY(-50%)",
  zIndex: 7,
  display: "grid",
  gridTemplateRows: "repeat(5, 2.9cqh)",
  gap: "1.1cqh",
  alignItems: "center",
};

const navButtonStyle: React.CSSProperties = {
  width: "1.2cqw",
  height: "2.9cqh",
  padding: "0",
  border: "0",
  borderRadius: "50%",
  background: "transparent",
  display: "grid",
  placeItems: "center",
  cursor: "pointer",
};

const activeNavButtonStyle: React.CSSProperties = {
  cursor: "default",
};

const navMarkStyle: React.CSSProperties = {
  width: "0.18cqw",
  height: "0.8cqh",
  borderRadius: "50%",
  background: "rgba(17, 16, 13, 0.28)",
};

const activeNavMarkStyle: React.CSSProperties = {
  width: "0.28cqw",
  height: "2.6cqh",
  borderRadius: "50%",
  background:
    "linear-gradient(180deg, var(--style-01-ink), var(--style-01-accent), var(--style-01-ink))",
};

export const quietLaunchWindowV2Version = defineStyleVersion({
  id: "v2",
  topic: "Quiet Launch Window",
  model: "GPT-5",
  component: QuietLaunchWindowV2,
  getMetadata,
});

import {
  defineTopic,
  type TopicMetadata,
  type TopicStageProps,
  type TopicTransitionScore,
} from "../domain/topic";
import SpatialSceneTrack from "../styles/SpatialSceneTrack";
import type { SceneTransitionMap } from "../styles/SpatialSceneTrack";
import { useFLIP } from "../hooks/useFLIP";
import styles from "./beauty-unfinished.module.css";

const TRANSITION_SCORE = {
  "1->2": "fade",
  "2->3": "fade",
  "3->4": "slide-x",
  "4->5": "fade",
} as const satisfies TopicTransitionScore;

const TRANSITION_MAP: SceneTransitionMap = TRANSITION_SCORE;

/* ── shared brush / ceramic gestures ────────────────────────────────────── */
function BrushUnderline() {
  return (
    <svg className={styles.brushUnderline} viewBox="0 0 400 44" aria-hidden="true">
      <path
        d="M6,26 C 90,10 210,34 300,18 C 342,11 372,20 396,15 L392,27 C 360,33 320,26 300,30 C 210,44 90,26 8,36 Z"
        fill="#3d372d"
      />
    </svg>
  );
}

function CrackedBowl() {
  return (
    <svg className={styles.bowlSvg} viewBox="0 0 220 200" aria-hidden="true">
      <path d="M18,72 C 30,150 190,150 202,72 C 176,88 44,88 18,72 Z" fill="#d9cfbc" />
      <ellipse cx="110" cy="72" rx="92" ry="16" fill="#cfc4ae" />
      <path
        d="M118,60 L124,90 L112,116 L122,140"
        stroke="#3d372d"
        strokeWidth="2.4"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

function KintsugiSeam({ active }: { active: boolean }) {
  return (
    <svg className={styles.seam} viewBox="0 0 44 400" aria-hidden="true">
      <path
        className={styles.seamPath}
        style={{ opacity: active ? 1 : 0.22 }}
        d="M22,6 C 14,70 30,120 20,180 C 12,236 28,300 22,394"
        stroke="#5e6a8c"
        strokeWidth="6.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        className={styles.seamPath}
        style={{ opacity: active ? 0.85 : 0 }}
        d="M22,150 L34,132 M20,250 L9,270"
        stroke="#5e6a8c"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

function RestBowl() {
  return (
    <svg className={styles.bowlSvgRest} viewBox="0 0 260 120" aria-hidden="true">
      <path d="M14,40 C 40,110 220,110 246,40 C 210,58 50,58 14,40 Z" fill="#d9cfbc" />
      <ellipse cx="130" cy="40" rx="116" ry="16" fill="#cfc4ae" />
    </svg>
  );
}

function DashMark({ className }: { className: string }) {
  return (
    <svg className={className} viewBox="0 0 130 40" aria-hidden="true">
      <path
        d="M6,22 C 44,8 86,32 124,16 L120,27 C 84,35 44,22 8,32 Z"
        fill="#6f675a"
      />
    </svg>
  );
}

/* ── scene content ──────────────────────────────────────────────────────── */
interface SceneProps {
  beat: number;
  isActive: boolean;
  language: "en" | "zh";
  still: boolean;
}

function enterClass(still: boolean, isActive: boolean) {
  return !still && isActive ? styles.enter : undefined;
}

/* Scene 1 · Title — one imperfect brush stroke underlines the title, off-axis */
function SceneTitle({ language, still, isActive }: SceneProps) {
  const en = language === "en";
  return (
    <div className={`${styles.scene} ${styles.s1}`}>
      <div className={`${styles.s1inner} ${enterClass(still, isActive) ?? ""}`}>
        <p className={styles.eyebrow}>
          {en ? "Wabi-Sabi · a meditation on clay" : "侘寂 · 一则关于陶土的沉思"}
        </p>
        <h1 className={styles.title}>
          {en ? "The Beauty of the Unfinished" : "未完成之美"}
        </h1>
        <div className={styles.brushWrap}>
          <BrushUnderline />
        </div>
        <p className={styles.sub}>
          {en
            ? "Nothing lasts, nothing is finished, nothing is perfect."
            : "无物长存，无物圆满，无物终成。"}
        </p>
      </div>
    </div>
  );
}

/* Scene 2 · The crack — a flaw framed, not hidden. motion, 2 beats (see→accept) */
function SceneCrack({ beat, isActive, language, still }: SceneProps) {
  const en = language === "en";
  const { ref } = useFLIP<HTMLDivElement>({
    watch: [beat],
    disabled: still || !isActive,
    duration: 520,
    easing: "cubic-bezier(0.22, 1, 0.36, 1)",
    selector: '[data-beat-layout-item="true"]',
  });
  return (
    <div className={`${styles.scene}`}>
      <div className={styles.s2frame} />
      <div
        ref={ref}
        className={styles.s2stack}
        data-beat-layout-container="true"
        data-beat-layout-mode="motion"
      >
        <figure className={styles.s2figure} data-beat-layout-item="true">
          <CrackedBowl />
        </figure>
        <p className={styles.s2see} data-beat-layout-item="true">
          {en ? "A flaw runs through the clay." : "一道裂痕穿过陶土。"}
        </p>
        {beat >= 1 && (
          <p
            className={`${styles.s2accept} ${enterClass(still, isActive) ?? ""}`}
            data-beat-layout-item="true"
          >
            {en
              ? "We leave it in the light, unhidden."
              : "我们把它留在光里，不加遮掩。"}
          </p>
        )}
      </div>
    </div>
  );
}

/* Scene 3 · Kintsugi — the mended seam in three quiet lines. reserved, 2 beats */
function SceneKintsugi({ beat, language }: SceneProps) {
  const en = language === "en";
  const lines = en
    ? [
        "The break is filled with lacquer and gold.",
        "The seam is never concealed.",
        "It becomes the most beautiful part.",
      ]
    : ["以漆与金填补裂口。", "接缝从不加以遮掩。", "它成了最美的所在。"];
  // reserved: all three slots hold space from beat 0; opacity reveals over beats
  const shown = beat >= 1 ? 3 : 1;
  return (
    <div className={`${styles.scene}`}>
      <div
        className={styles.s3wrap}
        data-beat-layout-container="true"
        data-beat-layout-mode="reserved"
      >
        <KintsugiSeam active={beat >= 1} />
        <div className={styles.s3lines}>
          {lines.map((line, i) => (
            <p
              key={i}
              className={styles.s3line}
              data-beat-layout-item="true"
              style={{ opacity: i < shown ? 1 : 0.16 }}
            >
              {line}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

/* Scene 4 · What time adds — patina across reflective beats of aging. motion, 3 */
function SceneTime({ beat, isActive, language, still }: SceneProps) {
  const en = language === "en";
  const lines = en
    ? [
        "Hands warm the glaze over years.",
        "Tea settles quietly into the grain.",
        "The surface remembers every use.",
      ]
    : ["经年累月，掌心温润了釉色。", "茶汤静静沉入肌理。", "器身记得每一次使用。"];
  const shown = Math.min(beat, 2) + 1;
  const { ref } = useFLIP<HTMLDivElement>({
    watch: [beat],
    disabled: still || !isActive,
    duration: 560,
    easing: "cubic-bezier(0.22, 1, 0.36, 1)",
    selector: '[data-beat-layout-item="true"]',
  });
  return (
    <div className={`${styles.scene}`}>
      <div className={styles.s4patina} data-patina={String(Math.min(beat, 2))} />
      <div
        ref={ref}
        className={styles.s4stack}
        data-beat-layout-container="true"
        data-beat-layout-mode="motion"
      >
        <DashMark className={styles.s4dot} />
        {lines.slice(0, shown).map((line, i) => (
          <p
            key={i}
            className={`${styles.s4line} ${
              i === shown - 1 ? enterClass(still, isActive) ?? "" : ""
            }`}
            data-beat-layout-item="true"
          >
            {line}
          </p>
        ))}
      </div>
    </div>
  );
}

/* Scene 5 · Rest — finished-because-abandoned, still. 1 beat */
function SceneRest({ language, still, isActive }: SceneProps) {
  const en = language === "en";
  return (
    <div className={`${styles.scene}`}>
      <div className={`${styles.s5inner} ${enterClass(still, isActive) ?? ""}`}>
        <RestBowl />
        <h2 className={styles.s5line}>
          {en ? "It is finished — because we set it down." : "它已完成——因为我们放下了它。"}
        </h2>
        <div className={styles.s5markWrap}>
          <DashMark className={styles.restMark} />
        </div>
        <p className={styles.s5sub}>
          {en ? "Not perfected. Simply, at rest." : "并非圆满，只是归于平静。"}
        </p>
      </div>
    </div>
  );
}

/* ── root component ─────────────────────────────────────────────────────── */
function TopicStage(props: TopicStageProps) {
  const { scene, beat, language, isThumbnail, reducedMotion } = props;
  const still = reducedMotion || isThumbnail;

  return (
    <div
      className={`${styles.root} ${still ? styles.still : ""}`}
      data-lang={language}
    >
      <div className={styles.paper} />
      <div className={styles.grain} />
      <SpatialSceneTrack
        scene={scene}
        beat={beat}
        transitionKind="fade"
        transitionMap={TRANSITION_MAP}
        reducedMotion={still}
        beatLayoutModes={{ 2: "motion", 3: "reserved", 4: "motion" }}
        renderScene={(sceneId, sceneBeat, isActive) => {
          const sp: SceneProps = { beat: sceneBeat, isActive, language, still };
          switch (sceneId) {
            case 1:
              return <SceneTitle {...sp} />;
            case 2:
              return <SceneCrack {...sp} />;
            case 3:
              return <SceneKintsugi {...sp} />;
            case 4:
              return <SceneTime {...sp} />;
            case 5:
              return <SceneRest {...sp} />;
            default:
              return null;
          }
        }}
      />
      {/* No visible navigation — envelope owns keyboard / click-zone nav */}
    </div>
  );
}

/* ── metadata (en / zh structurally identical) ──────────────────────────── */
function buildMetadata(lang: "en" | "zh"): TopicMetadata {
  const en = lang === "en";
  return {
    theme: en ? "The Beauty of the Unfinished" : "未完成之美",
    densityLabel: en ? "Sparse · contemplative" : "疏朗 · 沉思",
    heroScene: 1,
    colors: { bg: "#e9e1d2", ink: "#3d372d", panel: "#d9cfbc" },
    typography: { header: "Fraunces", body: "Newsreader" },
    tags: en
      ? ["contemplative", "earthen", "ma-negative-space", "kintsugi-indigo", "slow-settling", "humanist-serif"]
      : ["沉思", "土质", "留白之美", "金缮靛蓝", "缓慢沉降", "人文衬线"],
    fonts: [
      "Fraunces:opsz,wght@9..144,300..500",
      "Newsreader:opsz,wght@6..72,300..500",
      "cjk:Noto Serif SC:wght@300;400;500",
    ],
    scenes: [
      {
        id: 1,
        title: en ? "Title" : "标题",
        beats: [
          {
            id: 0,
            action: en ? "open" : "开启",
            title: en ? "The Beauty of the Unfinished" : "未完成之美",
            body: en
              ? "Nothing lasts, nothing is finished, nothing is perfect."
              : "无物长存，无物圆满，无物终成。",
          },
        ],
      },
      {
        id: 2,
        title: en ? "The crack" : "裂痕",
        beats: [
          {
            id: 0,
            action: en ? "see" : "看见",
            title: en ? "The flaw" : "瑕疵",
            body: en ? "A flaw runs through the clay." : "一道裂痕穿过陶土。",
          },
          {
            id: 1,
            action: en ? "accept" : "接纳",
            title: en ? "Framed, not hidden" : "留框，不藏",
            body: en
              ? "We leave it in the light, unhidden."
              : "我们把它留在光里，不加遮掩。",
          },
        ],
      },
      {
        id: 3,
        title: en ? "Kintsugi" : "金缮",
        beats: [
          {
            id: 0,
            action: en ? "mend" : "修补",
            title: en ? "Gold in the break" : "裂中之金",
            body: en ? "The break is filled with lacquer and gold." : "以漆与金填补裂口。",
          },
          {
            id: 1,
            action: en ? "reveal" : "显露",
            title: en ? "The seam" : "接缝",
            body: en ? "It becomes the most beautiful part." : "它成了最美的所在。",
          },
        ],
      },
      {
        id: 4,
        title: en ? "What time adds" : "时间所赠",
        beats: [
          {
            id: 0,
            action: en ? "use" : "使用",
            title: en ? "Warmth" : "温润",
            body: en ? "Hands warm the glaze over years." : "经年累月，掌心温润了釉色。",
          },
          {
            id: 1,
            action: en ? "settle" : "沉淀",
            title: en ? "Patina" : "包浆",
            body: en ? "Tea settles quietly into the grain." : "茶汤静静沉入肌理。",
          },
          {
            id: 2,
            action: en ? "remember" : "记忆",
            title: en ? "Memory" : "记得",
            body: en ? "The surface remembers every use." : "器身记得每一次使用。",
          },
        ],
      },
      {
        id: 5,
        title: en ? "Rest" : "安息",
        beats: [
          {
            id: 0,
            action: en ? "rest" : "静置",
            title: en ? "At rest" : "归于平静",
            body: en ? "Not perfected. Simply, at rest." : "并非圆满，只是归于平静。",
          },
        ],
      },
    ],
  };
}

const METADATA = {
  en: buildMetadata("en"),
  zh: buildMetadata("zh"),
};

export default defineTopic({
  id: "beauty-unfinished",
  styleId: "wabi-sabi-ceramic",
  title: { en: "The Beauty of the Unfinished", zh: "未完成之美" },
  modelId: "Claude Opus 4.8",
  Stage: TopicStage,
  metadata: METADATA,
  navigation: { mode: "none" },
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

import { useEffect, type CSSProperties } from "react";
import type { BespokeStyleProps, StyleMetadata } from "../types";
import { useFLIP } from "../hooks/useFLIP";
import SpatialSceneTrack, {
  type BeatLayoutMode,
  type SceneTransitionMap,
} from "./SpatialSceneTrack";
import { defineStyleVersion } from "./version";
import styles from "./35-calmer-growth-model-v2.module.css";

const SCENE_IDS = [1, 2, 3, 4, 5] as const;

type Lang = "en" | "zh";
type SceneId = (typeof SCENE_IDS)[number];

interface BeatCopy {
  action: string;
  title: string;
  body: string;
}

interface SceneCopy {
  kicker: string;
  title: string;
  body: string;
  note: string;
  beats: BeatCopy[];
  labels: string[];
}

const TRANSITION_MAP: SceneTransitionMap = {
  "1->2": "fade",
  "2->3": "slide-y",
  "3->4": "scale-fade",
  "4->5": "fade",
};

const BEAT_LAYOUT_MODES: Partial<Record<number, BeatLayoutMode>> = {
  1: "motion",
  2: "motion",
  3: "motion",
  4: "motion",
  5: "motion",
};

const CONTENT: Record<SceneId, Record<Lang, SceneCopy>> = {
  1: {
    en: {
      kicker: "Grove",
      title: "Growth starts by lowering the noise.",
      body: "A calmer model gives every team light, room, and rhythm before it asks for scale.",
      note: "Shared ground before expansion.",
      labels: ["soil", "shade", "cadence"],
      beats: [
        {
          action: "Name the grove",
          title: "Shared ground",
          body: "The model begins with one calm field of intent.",
        },
        {
          action: "Set the rhythm",
          title: "Light, room, rhythm",
          body: "Each team gets the conditions to deepen before pressure rises.",
        },
        {
          action: "Let the canopy settle",
          title: "Expansion waits",
          body: "Scale follows stability instead of forcing it.",
        },
      ],
    },
    zh: {
      kicker: "林地",
      title: "增长先降噪。",
      body: "更平静的模型，先给每个团队光照、空间和节奏，再要求规模。",
      note: "先有共同土壤，再谈扩张。",
      labels: ["土壤", "遮阴", "节奏"],
      beats: [
        {
          action: "命名林地",
          title: "共同土壤",
          body: "模型从一块安静的共同意图开始。",
        },
        {
          action: "设定节律",
          title: "光照、空间、节奏",
          body: "压力上升前，先让团队有条件扎深。",
        },
        {
          action: "稳定树冠",
          title: "扩张稍后",
          body: "规模跟随稳定，而不是逼出稳定。",
        },
      ],
    },
  },
  2: {
    en: {
      kicker: "Canopy layers",
      title: "The work grows in layers, not lanes.",
      body: "Purpose shades the work. Habits hold the middle. Evidence keeps the roots honest.",
      note: "Layered protection beats parallel noise.",
      labels: ["purpose canopy", "team habits", "evidence soil"],
      beats: [
        {
          action: "Reveal the upper canopy",
          title: "Purpose canopy",
          body: "One clear north star filters what deserves attention.",
        },
        {
          action: "Add the middle layer",
          title: "Team habits",
          body: "Rituals make the model repeatable without making it rigid.",
        },
        {
          action: "Anchor the soil",
          title: "Evidence soil",
          body: "Signals at the root keep optimism from floating away.",
        },
      ],
    },
    zh: {
      kicker: "树冠层",
      title: "工作分层生长，不分道抢跑。",
      body: "目标遮住噪声，习惯托住中层，证据让根系保持诚实。",
      note: "分层保护，胜过并行噪声。",
      labels: ["目标树冠", "团队习惯", "证据土壤"],
      beats: [
        {
          action: "展开上层树冠",
          title: "目标树冠",
          body: "一个清晰北极星，过滤哪些事值得注意。",
        },
        {
          action: "加入中层",
          title: "团队习惯",
          body: "仪式让模型可重复，但不僵硬。",
        },
        {
          action: "固定土壤",
          title: "证据土壤",
          body: "根部信号防止乐观漂走。",
        },
      ],
    },
  },
  3: {
    en: {
      kicker: "Resource flow",
      title: "Resources move like water through roots.",
      body: "Capacity, attention, and trust travel through visible channels, so no branch is quietly starved.",
      note: "Flow is managed before urgency appears.",
      labels: ["capacity", "attention", "trust"],
      beats: [
        {
          action: "Open capacity",
          title: "Capacity",
          body: "Limit work in progress so energy reaches the live edge.",
        },
        {
          action: "Route attention",
          title: "Attention",
          body: "Review cycles point people to the places that need light.",
        },
        {
          action: "Balance trust",
          title: "Trust",
          body: "Teams know what they can decide without asking twice.",
        },
      ],
    },
    zh: {
      kicker: "资源流",
      title: "资源像水一样穿过根系。",
      body: "产能、注意力和信任沿可见通道流动，避免某个枝条悄悄缺水。",
      note: "先管理流动，再处理紧急。",
      labels: ["产能", "注意力", "信任"],
      beats: [
        {
          action: "打开产能",
          title: "产能",
          body: "限制并行工作，让能量抵达真正生长处。",
        },
        {
          action: "导向注意力",
          title: "注意力",
          body: "复盘节奏把人带到需要光照的位置。",
        },
        {
          action: "平衡信任",
          title: "信任",
          body: "团队知道哪些决定无需反复请示。",
        },
      ],
    },
  },
  4: {
    en: {
      kicker: "Seasonal check",
      title: "A calm system checks the season before adding more.",
      body: "Prune, rest, invest, and harvest are different moves. The model names the season before choosing the move.",
      note: "Not every month should look like spring.",
      labels: ["prune", "rest", "invest", "harvest"],
      beats: [
        {
          action: "Mark the current season",
          title: "Prune",
          body: "Cut work that no longer feeds the grove.",
        },
        {
          action: "Compare the next move",
          title: "Rest and invest",
          body: "Recovery and investment are both deliberate growth work.",
        },
        {
          action: "Close the ring",
          title: "Harvest",
          body: "The check ends with a choice, not another meeting.",
        },
      ],
    },
    zh: {
      kicker: "季节检查",
      title: "平静系统先看季节，再加码。",
      body: "修剪、休整、投入、收获是不同动作。模型先命名季节，再选择动作。",
      note: "不是每个月都应该像春天。",
      labels: ["修剪", "休整", "投入", "收获"],
      beats: [
        {
          action: "标出现季",
          title: "修剪",
          body: "剪掉不再滋养林地的工作。",
        },
        {
          action: "比较下一步",
          title: "休整与投入",
          body: "恢复和投资，都属于有意图的增长工作。",
        },
        {
          action: "闭合圆环",
          title: "收获",
          body: "检查以选择结束，而不是以更多会议结束。",
        },
      ],
    },
  },
  5: {
    en: {
      kicker: "Path",
      title: "The path stays visible while the grove thickens.",
      body: "Calm growth is not slow growth. It is a path with fewer surprises and clearer next steps.",
      note: "Less rush. More signal. Steadier reach.",
      labels: ["next step", "owner", "review"],
      beats: [
        {
          action: "Draw the first bend",
          title: "Next step",
          body: "Every branch knows the next visible move.",
        },
        {
          action: "Place the keeper",
          title: "Owner",
          body: "Ownership is named close to the work, not above it.",
        },
        {
          action: "Set the return point",
          title: "Review",
          body: "The model returns to the grove before it asks for more.",
        },
      ],
    },
    zh: {
      kicker: "路径",
      title: "林地变密，路径仍清楚。",
      body: "平静增长不是慢增长，而是少一点意外、多一点清晰下一步。",
      note: "少些冲刺，多些信号，更稳地抵达。",
      labels: ["下一步", "负责人", "回看"],
      beats: [
        {
          action: "画出第一道弯",
          title: "下一步",
          body: "每个枝条都知道下一个可见动作。",
        },
        {
          action: "放置守护者",
          title: "负责人",
          body: "责任靠近工作命名，而不是悬在上方。",
        },
        {
          action: "设定回看点",
          title: "回看",
          body: "模型先回到林地，再要求更多增长。",
        },
      ],
    },
  },
};

function useFonts() {
  useEffect(() => {
    const id = "style-35-calmer-growth-model-v2-fonts";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Inter:wght@500;600;700&family=Noto+Sans+SC:wght@500;700&family=Noto+Serif+SC:wght@500;600;700&display=swap";
    document.head.appendChild(link);
  }, []);
}

function isSceneId(value: number): value is SceneId {
  return SCENE_IDS.includes(value as SceneId);
}

function clampBeat(scene: SceneId, beat: number, isThumbnail: boolean): number {
  const maxBeat = CONTENT[scene].en.beats.length - 1;
  if (isThumbnail) return maxBeat;
  return Math.max(0, Math.min(beat, maxBeat));
}

function delayStyle(index: number): CSSProperties {
  return { "--grove-delay": `${index * 140}ms` } as CSSProperties;
}

function BeatMarkers({
  total,
  active,
  motionOff,
}: {
  total: number;
  active: number;
  motionOff: boolean;
}) {
  return (
    <div
      className={styles.beatMarkers}
      aria-hidden="true"
      data-motion-off={motionOff ? "true" : "false"}
    >
      {Array.from({ length: total }).map((_, index) => (
        <span
          key={index}
          className={styles.beatMarker}
          data-active={index <= active ? "true" : "false"}
        />
      ))}
    </div>
  );
}

function ScenePanel({
  scene,
  beat,
  language,
  isThumbnail,
  motionOff,
  isActive,
}: {
  scene: SceneId;
  beat: number;
  language: Lang;
  isThumbnail: boolean;
  motionOff: boolean;
  isActive: boolean;
}) {
  const copy = CONTENT[scene][language];
  const displayBeat = clampBeat(scene, beat, isThumbnail);
  const flip = useFLIP<HTMLDivElement>({
    watch: [scene, displayBeat, language],
    disabled: motionOff || !isActive,
    duration: 760,
    easing: "cubic-bezier(0.19, 1, 0.22, 1)",
    selector: '[data-beat-layout-item="true"]',
  });

  return (
    <section
      className={[styles.scene, styles[`scene${scene}`]].join(" ")}
      data-scene={scene}
      data-beat={displayBeat}
      data-beat-layout-container="true"
      data-beat-layout-mode="motion"
      data-motion-off={motionOff ? "true" : "false"}
    >
      <div ref={flip.ref} className={styles.sceneGrid}>
        <header className={styles.copyBlock} data-beat-layout-item="true">
          <p className={styles.kicker}>{copy.kicker}</p>
          <h1>{copy.title}</h1>
          {displayBeat >= 1 ? <p className={styles.body}>{copy.body}</p> : null}
          <BeatMarkers
            total={copy.beats.length}
            active={displayBeat}
            motionOff={motionOff}
          />
        </header>

        <div className={styles.visualBlock} data-beat-layout-item="true">
          <SceneVisual scene={scene} beat={displayBeat} labels={copy.labels} />
        </div>

        {displayBeat >= 2 ? (
          <aside className={styles.noteBlock} data-beat-layout-item="true">
            <span>{copy.beats[displayBeat].title}</span>
            <p>{copy.note}</p>
          </aside>
        ) : null}
      </div>
    </section>
  );
}

function SceneVisual({
  scene,
  beat,
  labels,
}: {
  scene: SceneId;
  beat: number;
  labels: string[];
}) {
  switch (scene) {
    case 1:
      return <GroveVisual beat={beat} labels={labels} />;
    case 2:
      return <CanopyVisual beat={beat} labels={labels} />;
    case 3:
      return <ResourceVisual beat={beat} labels={labels} />;
    case 4:
      return <SeasonVisual beat={beat} labels={labels} />;
    case 5:
      return <PathVisual beat={beat} labels={labels} />;
    default:
      return null;
  }
}

function GroveVisual({ beat, labels }: { beat: number; labels: string[] }) {
  return (
    <div className={styles.groveVisual}>
      <svg className={styles.posterSvg} viewBox="0 0 640 460" aria-hidden="true">
        <circle className={styles.sunDot} cx="512" cy="108" r="34" />
        <path className={styles.groundLine} d="M86 342 C210 318 388 318 548 344" />
        <path
          className={styles.canopyBack}
          d="M132 268 C154 128 304 94 376 206 C430 150 534 182 548 292 C422 310 278 310 132 268Z"
        />
        <path
          className={styles.canopyFront}
          data-show={beat >= 1 ? "true" : "false"}
          d="M174 286 C206 182 310 172 350 250 C404 210 486 232 500 306 C386 330 266 326 174 286Z"
        />
        <path className={styles.trunk} d="M326 316 C326 258 330 214 348 162" />
        <path
          className={styles.rootLine}
          data-show={beat >= 2 ? "true" : "false"}
          d="M326 324 C266 358 204 374 116 372 M326 324 C384 358 454 374 548 370 M326 324 C310 366 304 392 288 424"
        />
      </svg>
      <div className={styles.labelRow}>
        {labels.map((label, index) => (
          <span
            key={label}
            className={styles.groveLabel}
            data-active={index <= beat ? "true" : "false"}
            style={delayStyle(index)}
          >
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}

function CanopyVisual({ beat, labels }: { beat: number; labels: string[] }) {
  return (
    <div className={styles.layerStack}>
      {labels.map((label, index) => (
        <div
          key={label}
          className={styles.layer}
          data-active={index <= beat ? "true" : "false"}
          style={delayStyle(index)}
        >
          <span>{label}</span>
        </div>
      ))}
      <svg className={styles.layerStem} viewBox="0 0 500 360" aria-hidden="true">
        <path d="M250 56 C242 150 260 224 250 320" />
        <path data-show={beat >= 1 ? "true" : "false"} d="M250 170 C184 144 118 138 68 150" />
        <path data-show={beat >= 2 ? "true" : "false"} d="M250 236 C324 208 392 210 444 232" />
      </svg>
    </div>
  );
}

function ResourceVisual({ beat, labels }: { beat: number; labels: string[] }) {
  return (
    <div className={styles.flowVisual}>
      <svg className={styles.flowSvg} viewBox="0 0 660 420" aria-hidden="true">
        <path className={styles.flowCanopy} d="M110 176 C170 80 292 78 334 154 C392 102 528 124 560 222" />
        <path className={styles.flowRoot} d="M330 188 C330 258 316 312 258 370" />
        <path className={styles.flowRoot} d="M330 188 C382 264 424 318 534 354" />
        <path className={styles.flowRoot} d="M330 188 C288 270 220 302 104 318" />
        <path
          className={styles.flowPulse}
          data-show={beat >= 1 ? "true" : "false"}
          d="M94 318 C206 302 282 270 330 188 C390 250 450 324 548 356"
        />
      </svg>
      <div className={styles.resourceCards}>
        {labels.map((label, index) => (
          <article
            key={label}
            className={styles.resourceCard}
            data-active={index <= beat ? "true" : "false"}
            style={delayStyle(index)}
          >
            <span>{`0${index + 1}`}</span>
            <p>{label}</p>
          </article>
        ))}
      </div>
    </div>
  );
}

function SeasonVisual({ beat, labels }: { beat: number; labels: string[] }) {
  return (
    <div className={styles.seasonVisual}>
      <svg className={styles.seasonRing} viewBox="0 0 520 520" aria-hidden="true">
        <circle className={styles.ringBase} cx="260" cy="260" r="172" />
        <path
          className={styles.ringArc}
          data-active={beat >= 0 ? "true" : "false"}
          d="M260 88 A172 172 0 0 1 432 260"
        />
        <path
          className={styles.ringArc}
          data-active={beat >= 1 ? "true" : "false"}
          d="M432 260 A172 172 0 0 1 260 432"
        />
        <path
          className={styles.ringArc}
          data-active={beat >= 1 ? "true" : "false"}
          d="M260 432 A172 172 0 0 1 88 260"
        />
        <path
          className={styles.ringArc}
          data-active={beat >= 2 ? "true" : "false"}
          d="M88 260 A172 172 0 0 1 260 88"
        />
        <circle className={styles.ringCenter} cx="260" cy="260" r="72" />
      </svg>
      <div className={styles.seasonLabels}>
        {labels.map((label, index) => (
          <span
            key={label}
            className={styles.seasonLabel}
            data-active={index <= beat + 1 ? "true" : "false"}
          >
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}

function PathVisual({ beat, labels }: { beat: number; labels: string[] }) {
  return (
    <div className={styles.pathVisual}>
      <svg className={styles.pathSvg} viewBox="0 0 660 420" aria-hidden="true">
        <path className={styles.pathGround} d="M72 330 C196 232 284 344 374 230 C448 136 536 150 594 82" />
        <path
          className={styles.pathTrace}
          data-show={beat >= 1 ? "true" : "false"}
          d="M72 330 C196 232 284 344 374 230 C448 136 536 150 594 82"
        />
        <circle className={styles.pathSun} cx="556" cy="102" r="34" />
        <path className={styles.pathTree} d="M156 286 C178 204 244 214 258 292" />
        <path className={styles.pathTree} d="M452 194 C476 116 546 126 556 206" />
      </svg>
      <div className={styles.pathStops}>
        {labels.map((label, index) => (
          <span
            key={label}
            className={styles.pathStop}
            data-active={index <= beat ? "true" : "false"}
            style={delayStyle(index)}
          >
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}

function WoodenBeadRail({
  activeScene,
  onNavigate,
}: {
  activeScene: SceneId;
  onNavigate?: (scene: number, beat: number) => void;
}) {
  return (
    <nav className={styles.beadRail} aria-label="Scene navigation">
      {SCENE_IDS.map((targetScene) => (
        <button
          key={targetScene}
          className={styles.bead}
          type="button"
          aria-label={`Scene ${targetScene}`}
          aria-current={targetScene === activeScene ? "step" : undefined}
          data-active={targetScene === activeScene ? "true" : "false"}
          onClick={() => onNavigate?.(targetScene, 0)}
        >
          {targetScene}
        </button>
      ))}
    </nav>
  );
}

export function getMetadata(lang: Lang): StyleMetadata {
  return {
    id: "35",
    band: "contemporary-digital",
    name: lang === "zh" ? "世纪中叶林园" : "Mid-Century Grove",
    theme: lang === "zh" ? "更平静的增长模型" : "A Calmer Growth Model",
    densityLabel: lang === "zh" ? "中低密度" : "Medium-sparse",
    heroScene: 1,
    colors: {
      bg: "#183f2b",
      ink: "#f4e8c8",
      panel: "#274a31",
    },
    typography: {
      header: "Cormorant Garamond 600",
      body: "Inter 500",
    },
    tags: ["mid-century", "botanical", "warm", "organic", "motion"],
    fonts: [
      "Cormorant Garamond",
      "Inter",
      "cjk:Noto Serif SC",
      "cjk:Noto Sans SC",
    ],
    scenes: SCENE_IDS.map((sceneId) => {
      const copy = CONTENT[sceneId][lang];
      return {
        id: sceneId,
        title: copy.kicker,
        beats: copy.beats.map((beat, index) => ({
          id: index,
          action: beat.action,
          title: beat.title,
          body: beat.body,
        })),
      };
    }),
  };
}

export default function CalmerGrowthModelV2({
  scene,
  beat,
  language,
  isThumbnail,
  reducedMotion,
  onNavigate,
}: BespokeStyleProps) {
  useFonts();

  const activeScene = isSceneId(scene) ? scene : 1;
  const motionOff = reducedMotion || isThumbnail;

  return (
    <div
      className={styles.root}
      data-style-id="35"
      data-version-id="v2"
      data-motion-off={motionOff ? "true" : "false"}
    >
      <SpatialSceneTrack
        scene={activeScene}
        beat={beat}
        transitionKind="fade"
        transitionMap={TRANSITION_MAP}
        transitionDurationMs={860}
        reducedMotion={motionOff}
        beatLayoutModes={BEAT_LAYOUT_MODES}
        className={styles.sceneTrack}
        renderScene={(sceneId, sceneBeat, isActive) => (
          <ScenePanel
            scene={isSceneId(sceneId) ? sceneId : 1}
            beat={sceneBeat}
            language={language}
            isThumbnail={isThumbnail}
            motionOff={motionOff}
            isActive={isActive}
          />
        )}
      />
      {isThumbnail ? null : (
        <WoodenBeadRail activeScene={activeScene} onNavigate={onNavigate} />
      )}
    </div>
  );
}

export const calmerGrowthModelV2Version = defineStyleVersion({
  id: "v2",
  topic: {
    en: "Calm Growth",
    zh: "冷静增长",
  },
  model: "GPT-5.5",
  component: CalmerGrowthModelV2,
  getMetadata,
});

import { useEffect } from "react";
import type { BespokeStyleProps, StyleMetadata } from "../types";
import { defineStyleTopic } from "./topic";
import SpatialSceneTrack from "./SpatialSceneTrack";
import type { SceneTransitionMap } from "./SpatialSceneTrack";
import { useFLIP } from "../hooks/useFLIP";
import styles from "./refactor-the-system.module.css";

/* Red-Wedge Agitprop — v3 "Refactor the System"
   A call to tear down and rebuild: a red wedge drives into black, hard-cropped
   montage collides, type braces as structural beams. RED / BLACK / raw-paper.
   Flat color, no gradients, no soft shadows. Diagonal tension is enforced;
   centered symmetry is refused. */

const TRANSITIONS: SceneTransitionMap = {
  "1->2": "glitch",
  "2->3": "hard-cut",
  "3->4": "glitch",
  "4->5": "hard-cut",
};

const BEAT_LAYOUT_MODES = { 2: "motion", 3: "reserved", 4: "motion" } as const;

// ---------------------------------------------------------------------------
// Bilingual content. EN and ZH share the exact same shape; only strings differ.
// getMetadata() reads only { title } + beats[].{ action, title, body }; the
// extra visual arrays (frags / vfrags / slogan) are ignored by metadata.
// ---------------------------------------------------------------------------

type Beat = {
  action: string;
  title: string;
  body: string;
  frags?: string[];
  vfrags?: string[];
  slogan?: string;
};
type Scene = { title: string; beats: Beat[] };
type Locale = { scenes: Scene[] };

const CONTENT: Record<"en" | "zh", Locale> = {
  en: {
    scenes: [
      {
        title: "The Manifesto",
        beats: [
          {
            action: "Manifesto — 01",
            title: "REFACTOR THE SYSTEM",
            body: "The scaffolding is rotten. We stop patching. We drive a wedge and start again.",
          },
        ],
      },
      {
        title: "The Old Order",
        beats: [
          {
            action: "Legacy — 01",
            title: "WHAT WE INHERITED",
            body: "Frozen process. Absent owners. Rules nobody remembers writing.",
            frags: ["MONOLITH", "SILOS", "DEAD CODE"],
          },
          {
            action: "Collision — 02",
            title: "IT COLLIDES",
            body: "Every fragment fights the next. Nothing moves without breaking three more.",
            frags: ["MONOLITH", "SILOS", "DEAD CODE", "HOT-FIX", "TECH DEBT"],
          },
        ],
      },
      {
        title: "The Demand",
        beats: [
          {
            action: "Demand — 01",
            title: "OWN IT",
            body: "No committee. A name on every fault line.",
            slogan: "TEAR IT DOWN",
          },
          {
            action: "Demand — 02",
            title: "SHIP SMALL",
            body: "Cut the release in half. Then cut it again.",
          },
          {
            action: "Demand — 03",
            title: "DELETE MORE",
            body: "The best refactor removes code, not adds it.",
          },
        ],
      },
      {
        title: "The Mobilization",
        beats: [
          {
            action: "Assemble — 01",
            title: "FORM THE LINE",
            body: "Scattered hands find the same edge.",
            vfrags: ["MAP", "CUT", "REWIRE", "TEST", "SHIP", "OWN"],
          },
          {
            action: "Assemble — 02",
            title: "CLOSE THE GAP",
            body: "The gaps between us shrink to nothing.",
            vfrags: ["MAP", "CUT", "REWIRE", "TEST", "SHIP", "OWN"],
          },
          {
            action: "Assemble — 03",
            title: "ONE VECTOR",
            body: "Six fragments, one diagonal, one push.",
            vfrags: ["MAP", "CUT", "REWIRE", "TEST", "SHIP", "OWN"],
          },
        ],
      },
      {
        title: "Forward",
        beats: [
          {
            action: "Forward — 05",
            title: "BUILD THE NEW",
            body: "The wedge has cut through. Now point it at what comes next.",
          },
        ],
      },
    ],
  },
  zh: {
    scenes: [
      {
        title: "宣言",
        beats: [
          {
            action: "宣言 — 01",
            title: "重构体制",
            body: "旧框架已腐朽。停止修补，楔入其中，重新开始。",
          },
        ],
      },
      {
        title: "旧秩序",
        beats: [
          {
            action: "遗产 — 01",
            title: "我们继承了什么",
            body: "僵化的流程、缺席的负责人、无人记得为何存在的规则。",
            frags: ["巨石架构", "部门孤岛", "僵尸代码"],
          },
          {
            action: "碰撞 — 02",
            title: "它开始碰撞",
            body: "每块碎片相互撕咬。动一处，就崩掉另外三处。",
            frags: ["巨石架构", "部门孤岛", "僵尸代码", "临时补丁", "技术债务"],
          },
        ],
      },
      {
        title: "诉求",
        beats: [
          {
            action: "诉求 — 01",
            title: "自己扛起",
            body: "不设委员会。每条断层都写上一个名字。",
            slogan: "拆掉它",
          },
          {
            action: "诉求 — 02",
            title: "小步交付",
            body: "把版本砍掉一半，然后再砍一半。",
          },
          {
            action: "诉求 — 03",
            title: "多做删减",
            body: "最好的重构是删掉代码，而不是堆加代码。",
          },
        ],
      },
      {
        title: "动员",
        beats: [
          {
            action: "集结 — 01",
            title: "列队成形",
            body: "散落的人手，找到同一条边。",
            vfrags: ["盘点", "切分", "重连", "验证", "交付", "担责"],
          },
          {
            action: "集结 — 02",
            title: "收紧缝隙",
            body: "彼此之间的缝隙，收缩至零。",
            vfrags: ["盘点", "切分", "重连", "验证", "交付", "担责"],
          },
          {
            action: "集结 — 03",
            title: "同一向量",
            body: "六块碎片，一条对角，一次推进。",
            vfrags: ["盘点", "切分", "重连", "验证", "交付", "担责"],
          },
        ],
      },
      {
        title: "向前",
        beats: [
          {
            action: "向前 — 05",
            title: "建造新的",
            body: "楔子已劈开旧局。如今，把它指向接下来的一切。",
          },
        ],
      },
    ],
  },
};

// ---------------------------------------------------------------------------
// Fonts — inject once via a deduped Google Fonts <link>.
// ---------------------------------------------------------------------------

function useFonts(): void {
  useEffect(() => {
    const id = "rwa-v3-fonts";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Anton&family=Archivo+Black&family=Noto+Sans+SC:wght@700;900&display=swap";
    document.head.appendChild(link);
  }, []);
}

const clampBeat = (beat: number, len: number): number =>
  Math.min(Math.max(beat, 0), len - 1);

// ---------------------------------------------------------------------------
// Scenes
// ---------------------------------------------------------------------------

function Scene1({ sc }: { sc: Scene }) {
  const b = sc.beats[0];
  return (
    <div className={styles.scene}>
      <div className={styles.s1Black} />
      <div className={styles.s1Wedge} />
      <div className={styles.s1Tag}>01</div>
      <div className={styles.s1Action}>{b.action}</div>
      <h1 className={styles.s1Title}>{b.title}</h1>
      <p className={styles.s1Body}>{b.body}</p>
    </div>
  );
}

function Scene2({
  sc,
  beat,
  isActive,
  frozen,
}: {
  sc: Scene;
  beat: number;
  isActive: boolean;
  frozen: boolean;
}) {
  const b = clampBeat(beat, sc.beats.length);
  const cur = sc.beats[b];
  const frags = cur.frags ?? [];
  const { ref } = useFLIP<HTMLDivElement>({
    watch: [b],
    disabled: frozen || !isActive,
    duration: 420,
    easing: "cubic-bezier(0.16, 1, 0.3, 1)",
    selector: '[data-beat-layout-item="true"]',
  });
  return (
    <div className={styles.scene}>
      <div className={styles.s2Bar}>
        <span className={styles.s2Action}>{cur.action}</span>
        <span className={styles.s2Title}>{cur.title}</span>
      </div>
      <div
        ref={ref}
        className={styles.s2Grid}
        data-beat={b}
        data-beat-layout-container="true"
        data-beat-layout-mode="motion"
      >
        {frags.map((f) => (
          <div key={f} className={styles.frag} data-beat-layout-item="true">
            {f}
          </div>
        ))}
      </div>
      <p className={styles.s2Body}>{cur.body}</p>
    </div>
  );
}

function Scene3({ sc, beat }: { sc: Scene; beat: number }) {
  const b = clampBeat(beat, sc.beats.length);
  const cur = sc.beats[b];
  const slogan = sc.beats[0].slogan ?? "";
  return (
    <div className={styles.scene}>
      <div className={styles.s3Action}>{cur.action}</div>
      <div
        className={styles.s3Beams}
        data-beat-layout-container="true"
        data-beat-layout-mode="reserved"
      >
        {sc.beats.map((bm, i) => (
          <div
            key={bm.title}
            className={`${styles.beam} ${b >= i ? styles.beamOn : ""}`}
            data-beat-layout-item="true"
          >
            <span className={styles.beamIndex}>{`0${i + 1}`}</span>
            <span className={styles.beamText}>{bm.title}</span>
          </div>
        ))}
      </div>
      <h2 className={styles.s3Slogan}>{slogan}</h2>
      <p className={styles.s3Body}>{cur.body}</p>
    </div>
  );
}

function Scene4({
  sc,
  beat,
  isActive,
  frozen,
}: {
  sc: Scene;
  beat: number;
  isActive: boolean;
  frozen: boolean;
}) {
  const b = clampBeat(beat, sc.beats.length);
  const cur = sc.beats[b];
  const vfrags = cur.vfrags ?? [];
  const { ref } = useFLIP<HTMLDivElement>({
    watch: [b],
    disabled: frozen || !isActive,
    duration: 480,
    easing: "cubic-bezier(0.34, 1.56, 0.64, 1)",
    selector: '[data-beat-layout-item="true"]',
  });
  return (
    <div className={styles.scene}>
      <div className={styles.s4Header}>{cur.action}</div>
      <div
        ref={ref}
        className={styles.s4Vector}
        data-beat={b}
        data-beat-layout-container="true"
        data-beat-layout-mode="motion"
      >
        {vfrags.map((v) => (
          <div key={v} className={styles.vfrag} data-beat-layout-item="true">
            {v}
          </div>
        ))}
      </div>
      <h2 className={styles.s4Title}>{cur.title}</h2>
      <p className={styles.s4Body}>{cur.body}</p>
    </div>
  );
}

function Scene5({ sc }: { sc: Scene }) {
  const b = sc.beats[0];
  return (
    <div className={styles.scene}>
      <div className={styles.s5Black} />
      <div className={styles.s5Wedge} />
      <div className={styles.s5Tag}>05</div>
      <div className={styles.s5Action}>{b.action}</div>
      <h1 className={styles.s5Title}>{b.title}</h1>
      <p className={styles.s5Body}>{b.body}</p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Navigation — bespoke "diagonal progress wedge": a skewed red bar that drives
// further across the field with each scene. Cells jump to a scene.
// ---------------------------------------------------------------------------

function ProgressWedge({
  scene,
  onNavigate,
}: {
  scene: number;
  onNavigate?: (scene: number, beat: number) => void;
}) {
  const fillPct = (scene / 5) * 100;
  return (
    <div className={styles.nav}>
      <div className={styles.navTrack}>
        <div className={styles.navFill} style={{ width: `${fillPct}%` }} />
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            className={`${styles.navCell} ${n <= scene ? styles.navCellOn : ""}`}
            onClick={(e) => {
              e.stopPropagation();
              onNavigate?.(n, 0);
            }}
            aria-label={`Go to scene ${n}`}
          >
            <span className={styles.navNum}>{`0${n}`}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Root
// ---------------------------------------------------------------------------

function RedWedgeAgitpropV3({
  scene,
  beat,
  language,
  isThumbnail,
  reducedMotion,
  onNavigate,
}: BespokeStyleProps) {
  useFonts();
  const frozen = reducedMotion || isThumbnail;
  const locale = CONTENT[language] ?? CONTENT.en;

  return (
    <div className={`${styles.root} ${frozen ? styles.reduced : ""}`}>
      <SpatialSceneTrack
        scene={scene}
        beat={beat}
        transitionKind="glitch"
        transitionMap={TRANSITIONS}
        reducedMotion={reducedMotion || isThumbnail}
        beatLayoutModes={BEAT_LAYOUT_MODES}
        renderScene={(sceneId, sceneBeat, isActive) => {
          const sc = locale.scenes[sceneId - 1];
          if (!sc) return null;
          switch (sceneId) {
            case 1:
              return <Scene1 sc={sc} />;
            case 2:
              return (
                <Scene2
                  sc={sc}
                  beat={sceneBeat}
                  isActive={isActive}
                  frozen={frozen}
                />
              );
            case 3:
              return <Scene3 sc={sc} beat={sceneBeat} />;
            case 4:
              return (
                <Scene4
                  sc={sc}
                  beat={sceneBeat}
                  isActive={isActive}
                  frozen={frozen}
                />
              );
            case 5:
              return <Scene5 sc={sc} />;
            default:
              return null;
          }
        }}
      />
      {!isThumbnail && <ProgressWedge scene={scene} onNavigate={onNavigate} />}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------

export function getMetadata(language: "en" | "zh"): StyleMetadata {
  const locale = CONTENT[language] ?? CONTENT.en;
  const isEn = language === "en";
  return {
    id: "red-wedge-agitprop",
    band: "craft-cultural",
    name: isEn ? "Red-Wedge Agitprop" : "红楔宣传画",
    theme: isEn ? "Refactor the System" : "重构体制",
    densityLabel: isEn ? "Dense / Agitprop" : "高密度 / 宣传画",
    heroScene: 1,
    colors: { bg: "#eae3d0", ink: "#141210", panel: "#e1251b" },
    typography: {
      header: "Anton",
      body: "Archivo Black",
    },
    tags: isEn
      ? ["urgent", "confrontational", "diagonal", "flat-color", "montage", "kinetic"]
      : ["紧迫", "对抗", "对角", "平涂", "拼贴", "凌厉"],
    fonts: ["Anton", "Archivo Black", "cjk:Noto Sans SC"],
    scenes: locale.scenes.map((sc, i) => ({
      id: i + 1,
      title: sc.title,
      beats: sc.beats.map((b, j) => ({
        id: j,
        action: b.action,
        title: b.title,
        body: b.body,
      })),
    })),
  };
}

export const refactorTheSystemTopic = defineStyleTopic({
  id: "refactor-the-system",
  topic: { en: "Refactor the System", zh: "重构体制" },
  model: "Claude Opus 4.8",
  component: RedWedgeAgitpropV3,
  getMetadata,
});

export default RedWedgeAgitpropV3;

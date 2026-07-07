import { useEffect } from "react";
import type { CSSProperties, ReactNode } from "react";
import type { BespokeStyleProps, StyleMetadata } from "../types";
import { useFLIP } from "../hooks/useFLIP";
import SpatialSceneTrack from "./SpatialSceneTrack";
import type { BeatLayoutMode, SceneTransitionMap } from "./SpatialSceneTrack";
import { defineStyleVersion } from "./version";
import styles from "./22-five-takes-room-v2.module.css";

type Language = "en" | "zh";
const SCENE_IDS = [1, 2, 3, 4, 5] as const;
type SceneId = (typeof SCENE_IDS)[number];
type PhotoVariant = "sleeve" | "take" | "note" | "mix" | "liner";

interface BeatCopy {
  id: number;
  action: string;
  title: string;
  body: string;
}

interface RevealCopy {
  kicker: string;
  line: string;
}

interface SceneCopy {
  nav: string;
  eyebrow: string;
  titleLines: string[];
  serifLine: string;
  body: string;
  credit: string;
  imageLabel: string;
  photoVariant: PhotoVariant;
  reveals: RevealCopy[];
  beats: BeatCopy[];
}

const TRANSITION_MAP: SceneTransitionMap = {
  "1->2": "slide-x",
  "2->3": "fade",
  "3->4": "glitch",
  "4->5": "scale-fade",
};

const BEAT_LAYOUT_MODES: Record<SceneId, BeatLayoutMode> = {
  1: "motion",
  2: "motion",
  3: "motion",
  4: "motion",
  5: "motion",
};

const SCENES: Record<SceneId, Record<Language, SceneCopy>> = {
  1: {
    en: {
      nav: "Sleeve",
      eyebrow: "SESSION 22",
      titleLines: ["Five", "Takes", "Room"],
      serifLine: "A working room chooses the keeper.",
      body: "The sleeve opens like a count-in: hard black stock, one cobalt tint, five takes waiting for a verdict.",
      credit: "Room A / after midnight / no audience",
      imageLabel: "duotone sleeve plate",
      photoVariant: "sleeve",
      reveals: [
        { kicker: "01", line: "The band hears the room first." },
        { kicker: "02", line: "Every take keeps a different truth." },
        { kicker: "03", line: "The sleeve withholds the verdict." },
      ],
      beats: [
        {
          id: 0,
          action: "Sleeve lands",
          title: "Five Takes in the Room",
          body: "The jacket establishes the session.",
        },
        {
          id: 1,
          action: "Credits enter",
          title: "The room gets named",
          body: "A thin credit band fixes place and hour.",
        },
        {
          id: 2,
          action: "Groove count locks",
          title: "Five cuts wait",
          body: "The record metaphor becomes the navigator.",
        },
      ],
    },
    zh: {
      nav: "唱片封套",
      eyebrow: "录音 22",
      titleLines: ["五次", "录音", "同室"],
      serifLine: "真正的选择，先由房间做出。",
      body: "封套像一次起拍：厚黑纸面，一层钴蓝专色，五条 take 等着被听见。",
      credit: "A 房 / 午夜后 / 无观众",
      imageLabel: "双色封套图像",
      photoVariant: "sleeve",
      reveals: [
        { kicker: "01", line: "乐队先听见房间。" },
        { kicker: "02", line: "每条 take 都留下一种真实。" },
        { kicker: "03", line: "封套暂时不宣布答案。" },
      ],
      beats: [
        {
          id: 0,
          action: "封套落位",
          title: "五次录音同在一室",
          body: "唱片外套建立整场 session。",
        },
        {
          id: 1,
          action: "署名进入",
          title: "房间被命名",
          body: "细窄署名条固定地点和时间。",
        },
        {
          id: 2,
          action: "沟槽计数锁定",
          title: "五条录音等待选择",
          body: "黑胶隐喻成为内部导航。",
        },
      ],
    },
  },
  2: {
    en: {
      nav: "Take One",
      eyebrow: "TAKE ONE",
      titleLines: ["Take", "One"],
      serifLine: "The first pass is brave because it has not learned shame.",
      body: "Piano counts too early. The horn answers late. Nobody stops; the take earns its heat by refusing polish.",
      credit: "False start kept / bass enters last",
      imageLabel: "duotone first take plate",
      photoVariant: "take",
      reveals: [
        { kicker: "Piano", line: "Enters ahead of the click." },
        { kicker: "Horn", line: "Waits, then bends the phrase." },
        { kicker: "Bass", line: "Arrives last and steadies the floor." },
      ],
      beats: [
        {
          id: 0,
          action: "First player enters",
          title: "The first pass starts hot",
          body: "One instrument pushes the room forward.",
        },
        {
          id: 1,
          action: "Second voice answers",
          title: "The hesitation becomes phrasing",
          body: "A late entrance turns into intent.",
        },
        {
          id: 2,
          action: "Section settles",
          title: "The take earns its floor",
          body: "The band finds a shared pulse without fixing the stumble.",
        },
      ],
    },
    zh: {
      nav: "第一条",
      eyebrow: "第一条 TAKE",
      titleLines: ["第一", "Take"],
      serifLine: "第一遍之所以勇敢，是因为它还没学会遮掩。",
      body: "钢琴进早，号声答晚。没人喊停；这条 take 的热度来自拒绝修饰。",
      credit: "误起保留 / 贝斯最后进入",
      imageLabel: "双色第一条图像",
      photoVariant: "take",
      reveals: [
        { kicker: "钢琴", line: "比节拍提前一步。" },
        { kicker: "号声", line: "等了一拍，再把句子压弯。" },
        { kicker: "贝斯", line: "最后进入，把地面稳住。" },
      ],
      beats: [
        {
          id: 0,
          action: "第一位演奏者进入",
          title: "第一遍带着热度开始",
          body: "一个声部把房间向前推。",
        },
        {
          id: 1,
          action: "第二个声音回应",
          title: "犹豫变成乐句",
          body: "晚到的入口成为意图。",
        },
        {
          id: 2,
          action: "段落落稳",
          title: "这条 take 找到地面",
          body: "乐队不修正失误，也找到了共同脉冲。",
        },
      ],
    },
  },
  3: {
    en: {
      nav: "Producer Note",
      eyebrow: "PRODUCER NOTE",
      titleLines: ["Producer", "Note"],
      serifLine: "Do not fix the breath before the chorus.",
      body: "The note is short because the band already knows the arrangement. Keep the cough, lose the clever ending, let the room decay.",
      credit: "Pencil on tape box / take three circled",
      imageLabel: "duotone producer note plate",
      photoVariant: "note",
      reveals: [
        { kicker: "Keep", line: "The breath before the chorus." },
        { kicker: "Lose", line: "The clever ending." },
        { kicker: "Let", line: "The room decay all the way out." },
      ],
      beats: [
        {
          id: 0,
          action: "Note card appears",
          title: "The note refuses drama",
          body: "A producer chooses one useful constraint.",
        },
        {
          id: 1,
          action: "Edits stack",
          title: "Keep and lose get separated",
          body: "The room learns what not to repair.",
        },
        {
          id: 2,
          action: "Take three is circled",
          title: "The instruction becomes a cut",
          body: "The next pass has a sharper job.",
        },
      ],
    },
    zh: {
      nav: "制作人便笺",
      eyebrow: "制作人便笺",
      titleLines: ["制作人", "便笺"],
      serifLine: "副歌前那口气，不要修掉。",
      body: "便笺很短，因为乐队已经懂编曲。保留咳声，删掉聪明结尾，让房间自然衰减。",
      credit: "磁带盒铅笔字 / 第三条画圈",
      imageLabel: "双色制作人便笺图像",
      photoVariant: "note",
      reveals: [
        { kicker: "保留", line: "副歌前那口气。" },
        { kicker: "删掉", line: "那个聪明结尾。" },
        { kicker: "让它", line: "把房间衰减完整。" },
      ],
      beats: [
        {
          id: 0,
          action: "便笺卡出现",
          title: "便笺拒绝戏剧化",
          body: "制作人只选一个真正有用的约束。",
        },
        {
          id: 1,
          action: "编辑指令堆叠",
          title: "保留和删除被分开",
          body: "房间知道哪些地方不该修。",
        },
        {
          id: 2,
          action: "第三条被画圈",
          title: "指令变成剪辑点",
          body: "下一遍有了更清楚的任务。",
        },
      ],
    },
  },
  4: {
    en: {
      nav: "Final Mix",
      eyebrow: "FINAL MIX",
      titleLines: ["Final", "Mix"],
      serifLine: "The keeper is not clean. It is complete.",
      body: "Four takes donate fragments. The final mix keeps the spill, the chair scrape, the bass note that arrives like a door closing.",
      credit: "Master bus printed / no recall",
      imageLabel: "duotone final mix plate",
      photoVariant: "mix",
      reveals: [
        { kicker: "Take 1", line: "Heat from the false start." },
        { kicker: "Take 3", line: "The note that learned restraint." },
        { kicker: "Take 5", line: "The ending no one could repeat." },
      ],
      beats: [
        {
          id: 0,
          action: "Track lanes arrive",
          title: "The mix opens the lanes",
          body: "Fragments from earlier passes line up.",
        },
        {
          id: 1,
          action: "Keeper fragments lock",
          title: "The useful spill stays",
          body: "The master favors completion over cleanliness.",
        },
        {
          id: 2,
          action: "Master bus prints",
          title: "No recall is needed",
          body: "The decision is committed to the room.",
        },
      ],
    },
    zh: {
      nav: "最终混音",
      eyebrow: "最终混音",
      titleLines: ["最终", "混音"],
      serifLine: "被留下的不是干净版本，而是完整版本。",
      body: "四条 take 各自交出碎片。最终混音保留溢出、椅子摩擦声，以及像关门一样落下的贝斯音。",
      credit: "母线已打印 / 不再召回",
      imageLabel: "双色最终混音图像",
      photoVariant: "mix",
      reveals: [
        { kicker: "第一条", line: "误起带来的热。" },
        { kicker: "第三条", line: "学会克制的音。" },
        { kicker: "第五条", line: "没人能重复的结尾。" },
      ],
      beats: [
        {
          id: 0,
          action: "轨道条进入",
          title: "混音打开所有声道",
          body: "早先的碎片重新排成一列。",
        },
        {
          id: 1,
          action: "保留片段锁定",
          title: "有用的溢出被留下",
          body: "母版选择完整，而不是洁净。",
        },
        {
          id: 2,
          action: "母线打印",
          title: "不需要再召回",
          body: "决定被交还给这个房间。",
        },
      ],
    },
  },
  5: {
    en: {
      nav: "Liner Note",
      eyebrow: "LINER NOTE",
      titleLines: ["Liner", "Note"],
      serifLine: "Nobody in the room called it perfect.",
      body: "They called it the take where everyone stopped performing the song and started listening to it.",
      credit: "Pressed in warm black / cobalt ink only",
      imageLabel: "duotone liner note plate",
      photoVariant: "liner",
      reveals: [
        { kicker: "No edits", line: "The breath stays in." },
        { kicker: "No fixes", line: "The scrape keeps time." },
        { kicker: "No myth", line: "Only a room that listened back." },
      ],
      beats: [
        {
          id: 0,
          action: "Liner note opens",
          title: "The note lowers its voice",
          body: "The final page stops selling the record.",
        },
        {
          id: 1,
          action: "Credits settle",
          title: "The facts stay spare",
          body: "Small type carries the material truth.",
        },
        {
          id: 2,
          action: "Room closes",
          title: "The room listened back",
          body: "The ending holds without decoration.",
        },
      ],
    },
    zh: {
      nav: "内页附记",
      eyebrow: "内页附记",
      titleLines: ["内页", "附记"],
      serifLine: "屋里没人称它完美。",
      body: "他们只说：那一条里，所有人终于不再表演这首歌，而是开始听它。",
      credit: "暖黑压印 / 只用钴蓝专色",
      imageLabel: "双色内页附记图像",
      photoVariant: "liner",
      reveals: [
        { kicker: "不剪", line: "那口气留着。" },
        { kicker: "不修", line: "椅子声也在计时。" },
        { kicker: "不造神", line: "只有一个会回听的房间。" },
      ],
      beats: [
        {
          id: 0,
          action: "内页附记打开",
          title: "附记放低声音",
          body: "最后一页不再推销这张唱片。",
        },
        {
          id: 1,
          action: "署名落稳",
          title: "事实保持稀疏",
          body: "小字承载材料本身的真实。",
        },
        {
          id: 2,
          action: "房间合上",
          title: "房间完成回听",
          body: "结尾不靠装饰，也能停住。",
        },
      ],
    },
  },
};

const SCENE_CLASS: Record<SceneId, string> = {
  1: styles.sceneSleeve,
  2: styles.sceneTake,
  3: styles.sceneNote,
  4: styles.sceneMix,
  5: styles.sceneLiner,
};

function useFonts() {
  useEffect(() => {
    const id = "style-22-five-takes-room-v2-fonts";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Noto+Serif:wght@400;700&family=Noto+Serif+SC:wght@400;700&family=Oswald:wght@700&display=swap";
    document.head.appendChild(link);
  }, []);
}

function clampScene(scene: number): SceneId {
  return SCENE_IDS.includes(scene as SceneId) ? (scene as SceneId) : 1;
}

function getSceneCopy(scene: number, language: Language): SceneCopy {
  return SCENES[clampScene(scene)][language];
}

function clampBeat(scene: SceneId, beat: number): number {
  const maxBeat = SCENES[scene].en.beats.length - 1;
  return Math.max(0, Math.min(beat, maxBeat));
}

function getMetadata(lang: Language): StyleMetadata {
  return {
    id: "22",
    band: "editorial-print",
    name: lang === "zh" ? "双色录音场" : "Duotone Session",
    theme: lang === "zh" ? "五次录音同在一室" : "Five Takes in the Room",
    densityLabel: lang === "zh" ? "海报式中密度" : "Poster-density",
    heroScene: 1,
    colors: {
      bg: "#151311",
      ink: "#f2ead8",
      panel: "#1f55b7",
    },
    typography: {
      header: "Oswald 700",
      body: lang === "zh" ? "Noto Serif SC 400" : "Noto Serif 400",
    },
    tags: ["editorial", "print", "duotone", "music", "motion"],
    fonts: ["Oswald", "Noto Serif", "cjk:Noto Serif SC"],
    scenes: SCENE_IDS.map((sceneId) => {
      const copy = SCENES[sceneId][lang];
      return {
        id: sceneId,
        title: copy.nav,
        beats: copy.beats,
      };
    }),
  };
}

function BeatMarkers({ beat, count }: { beat: number; count: number }) {
  return (
    <div className={styles.beatMarkers} aria-hidden="true">
      {Array.from({ length: count }, (_, index) => (
        <span
          key={index}
          className={[
            styles.beatMarker,
            index <= beat ? styles.beatMarkerActive : "",
          ]
            .filter(Boolean)
            .join(" ")}
        />
      ))}
    </div>
  );
}

function PhotoPlate({
  variant,
  label,
}: {
  variant: PhotoVariant;
  label: string;
}) {
  const shapes: Record<PhotoVariant, ReactNode> = {
    sleeve: (
      <>
        <circle cx="420" cy="210" r="76" fill="#0d0b0a" opacity="0.72" />
        <path d="M340 660c28-190 62-322 126-398c72 86 106 218 142 398z" fill="#0d0b0a" opacity="0.72" />
        <rect x="78" y="120" width="102" height="436" fill="#0d0b0a" opacity="0.42" />
        <rect x="196" y="186" width="62" height="316" fill="#0d0b0a" opacity="0.36" />
      </>
    ),
    take: (
      <>
        <circle cx="216" cy="202" r="72" fill="#0d0b0a" opacity="0.74" />
        <path d="M126 648c34-168 72-292 118-372c70 82 110 206 144 372z" fill="#0d0b0a" opacity="0.74" />
        <rect x="410" y="132" width="64" height="454" fill="#0d0b0a" opacity="0.52" />
        <rect x="486" y="190" width="42" height="320" fill="#0d0b0a" opacity="0.38" />
      </>
    ),
    note: (
      <>
        <rect x="98" y="124" width="424" height="138" fill="#0d0b0a" opacity="0.52" />
        <rect x="98" y="302" width="326" height="92" fill="#0d0b0a" opacity="0.42" />
        <rect x="98" y="440" width="380" height="76" fill="#0d0b0a" opacity="0.46" />
        <circle cx="518" cy="576" r="46" fill="none" stroke="#0d0b0a" strokeWidth="18" opacity="0.58" />
      </>
    ),
    mix: (
      <>
        <rect x="82" y="142" width="456" height="66" fill="#0d0b0a" opacity="0.48" />
        <rect x="82" y="252" width="374" height="66" fill="#0d0b0a" opacity="0.64" />
        <rect x="82" y="362" width="496" height="66" fill="#0d0b0a" opacity="0.5" />
        <rect x="82" y="472" width="318" height="66" fill="#0d0b0a" opacity="0.58" />
        <circle cx="504" cy="572" r="58" fill="#0d0b0a" opacity="0.62" />
      </>
    ),
    liner: (
      <>
        <rect x="426" y="92" width="96" height="542" fill="#0d0b0a" opacity="0.66" />
        <rect x="294" y="138" width="64" height="452" fill="#0d0b0a" opacity="0.42" />
        <circle cx="184" cy="202" r="62" fill="#0d0b0a" opacity="0.6" />
        <path d="M112 650c24-150 52-266 94-348c54 78 86 196 116 348z" fill="#0d0b0a" opacity="0.56" />
      </>
    ),
  };

  return (
    <figure className={styles.photoPlate} data-beat-layout-item="true">
      <svg viewBox="0 0 640 760" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <rect width="640" height="760" fill="#1f55b7" />
        {shapes[variant]}
      </svg>
      <figcaption>{label}</figcaption>
    </figure>
  );
}

function ScenePanel({
  sceneId,
  beat,
  language,
  isActive,
  motionDisabled,
}: {
  sceneId: SceneId;
  beat: number;
  language: Language;
  isActive: boolean;
  motionDisabled: boolean;
}) {
  const activeBeat = clampBeat(sceneId, beat);
  const copy = SCENES[sceneId][language];
  const visibleReveals = copy.reveals.slice(0, activeBeat + 1);
  const { ref } = useFLIP<HTMLDivElement>({
    watch: [activeBeat, language],
    disabled: motionDisabled || !isActive,
    duration: 360,
    easing: "cubic-bezier(0.2, 0, 0, 1)",
    selector: '[data-beat-layout-item="true"]',
  });

  return (
    <section
      className={[styles.scene, SCENE_CLASS[sceneId]].join(" ")}
      data-scene={sceneId}
      aria-label={copy.nav}
    >
      <div
        ref={ref}
        className={styles.sceneGrid}
        data-beat-layout-container="true"
        data-beat-layout-mode="motion"
      >
        <div className={styles.titleBlock} data-beat-layout-item="true">
          <p className={styles.eyebrow}>{copy.eyebrow}</p>
          <h1>
            {copy.titleLines.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </h1>
        </div>

        <PhotoPlate variant={copy.photoVariant} label={copy.imageLabel} />

        <div className={styles.copyBand} data-beat-layout-item="true">
          <p className={styles.serifLine}>{copy.serifLine}</p>
          <p className={styles.bodyLine}>{copy.body}</p>
          <p className={styles.creditLine}>{copy.credit}</p>
        </div>

        <div className={styles.revealStack} data-beat-layout-item="true">
          {visibleReveals.map((item, index) => (
            <article
              key={item.kicker}
              className={styles.revealItem}
              style={{ "--beat-index": index } as CSSProperties}
              data-beat-layout-item="true"
            >
              <strong>{item.kicker}</strong>
              <span>{item.line}</span>
            </article>
          ))}
        </div>
      </div>

      <BeatMarkers beat={activeBeat} count={copy.beats.length} />
    </section>
  );
}

function VinylGrooveNav({
  currentScene,
  language,
  onNavigate,
}: {
  currentScene: SceneId;
  language: Language;
  onNavigate?: (scene: number, beat: number) => void;
}) {
  return (
    <nav
      className={styles.grooveNav}
      aria-label={language === "zh" ? "黑胶沟槽场景导航" : "Vinyl groove scene navigation"}
    >
      <div className={styles.grooveRings} aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <div className={styles.navMarkers}>
        {SCENE_IDS.map((sceneId) => {
          const copy = getSceneCopy(sceneId, language);
          const isActive = sceneId === currentScene;
          return (
            <button
              key={sceneId}
              type="button"
              className={[styles.navMarker, isActive ? styles.navMarkerActive : ""]
                .filter(Boolean)
                .join(" ")}
              aria-label={copy.nav}
              aria-current={isActive ? "step" : undefined}
              onClick={() => onNavigate?.(sceneId, 0)}
            >
              {sceneId}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

export default function FiveTakesRoomV2({
  scene,
  beat,
  language,
  isThumbnail,
  reducedMotion,
  onNavigate,
}: BespokeStyleProps) {
  useFonts();

  const currentScene = clampScene(scene);
  const motionDisabled = reducedMotion || isThumbnail;

  return (
    <div
      className={[styles.root, motionDisabled ? styles.noMotion : ""]
        .filter(Boolean)
        .join(" ")}
      lang={language === "zh" ? "zh-CN" : "en"}
    >
      <SpatialSceneTrack
        scene={currentScene}
        beat={beat}
        transitionKind="slide-x"
        transitionMap={TRANSITION_MAP}
        transitionDurationMs={620}
        reducedMotion={motionDisabled}
        beatLayoutModes={BEAT_LAYOUT_MODES}
        className={styles.track}
        renderScene={(sceneId, sceneBeat, isActive) => (
          <ScenePanel
            sceneId={clampScene(sceneId)}
            beat={sceneBeat}
            language={language}
            isActive={isActive}
            motionDisabled={motionDisabled}
          />
        )}
      />

      {!isThumbnail && (
        <VinylGrooveNav
          currentScene={currentScene}
          language={language}
          onNavigate={onNavigate}
        />
      )}
    </div>
  );
}

export { getMetadata };

export const fiveTakesRoomV2Version = defineStyleVersion({
  id: "v2",
  topic: {
    en: "Five Takes",
    zh: "五个视角",
  },
  model: "GPT-5.5",
  component: FiveTakesRoomV2,
  getMetadata,
});

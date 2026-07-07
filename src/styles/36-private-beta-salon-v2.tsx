import type React from "react";
import type { BespokeStyleProps, StyleMetadata } from "../types";
import SpatialSceneTrack, {
  type BeatLayoutMode,
  type SceneTransitionMap,
} from "./SpatialSceneTrack";
import { defineStyleVersion } from "./version";
import styles from "./36-private-beta-salon-v2.module.css";

type Lang = "en" | "zh";

interface LocalizedBeat {
  id: number;
  action: string;
  title: string;
  body: string;
}

interface LocalizedScene {
  kicker: string;
  headline: string;
  body: string;
  railTitle: string;
  railItems: string[];
  whisper: string;
  close: string;
  beats: LocalizedBeat[];
}

interface SalonScene {
  id: number;
  art: "door" | "guestList" | "demo" | "proof" | "nightcap";
  copy: Record<Lang, LocalizedScene>;
}

const SCENE_ORDER = [1, 2, 3, 4, 5];

const TRANSITION_MAP: SceneTransitionMap = {
  "1->2": "scale-fade",
  "2->3": "wipe",
  "3->4": "fade",
  "4->5": "hard-cut",
};

const BEAT_LAYOUT_MODES: Record<number, BeatLayoutMode> = {
  1: "reserved",
  2: "reserved",
  3: "reserved",
  4: "reserved",
  5: "reserved",
};

const SCENES: Record<number, SalonScene> = {
  1: {
    id: 1,
    art: "door",
    copy: {
      en: {
        kicker: "Door",
        headline: "The room starts before the door opens.",
        body: "Private beta is not a signup form. It is a threshold, a pause, and a reason to lean closer.",
        railTitle: "Entry ritual",
        railItems: ["Unlisted link", "One guest per invite", "Host confirms fit"],
        whisper: "Access should feel earned, not scarce by accident.",
        close: "Knock once.",
        beats: [
          {
            id: 0,
            action: "Set the private threshold.",
            title: "A closed door",
            body: "The first signal is restraint.",
          },
          {
            id: 1,
            action: "Reveal the entry rules.",
            title: "Invitation protocol",
            body: "One link, one guest, one clear reason.",
          },
          {
            id: 2,
            action: "Land the desired feeling.",
            title: "Earned access",
            body: "The door creates focus before the product speaks.",
          },
        ],
      },
      zh: {
        kicker: "门口",
        headline: "房间在开门前就已经开始。",
        body: "Private beta 不是报名表。它是一道门槛、一次停顿，也是一种让人靠近的理由。",
        railTitle: "入场仪式",
        railItems: ["非公开链接", "每帖一位来宾", "主人确认匹配"],
        whisper: "门槛要像被认真邀请，而不是被随手限制。",
        close: "轻敲一次。",
        beats: [
          {
            id: 0,
            action: "建立私密门槛。",
            title: "一扇关着的门",
            body: "第一个信号是克制。",
          },
          {
            id: 1,
            action: "揭示入场规则。",
            title: "邀请协议",
            body: "一个链接，一位来宾，一个清楚理由。",
          },
          {
            id: 2,
            action: "落到目标感受。",
            title: "被认真筛选",
            body: "门先制造专注，产品随后开口。",
          },
        ],
      },
    },
  },
  2: {
    id: 2,
    art: "guestList",
    copy: {
      en: {
        kicker: "Guest list",
        headline: "The list is smaller than the market.",
        body: "We choose guests by the jobs they are ready to do tonight, not by the size of their audience.",
        railTitle: "Who enters",
        railItems: ["Sharp use case", "Taste for unfinished work", "Permission to speak plainly"],
        whisper: "Beta quality follows the room you curate.",
        close: "Names before numbers.",
        beats: [
          {
            id: 0,
            action: "Show curation before scale.",
            title: "A short list",
            body: "Market size stays outside the velvet rope.",
          },
          {
            id: 1,
            action: "Reveal guest criteria.",
            title: "Useful tension",
            body: "The best guests arrive with a real job to solve.",
          },
          {
            id: 2,
            action: "Confirm the operating rule.",
            title: "Room quality",
            body: "The room decides the product signal.",
          },
        ],
      },
      zh: {
        kicker: "名单",
        headline: "这张名单比市场小得多。",
        body: "我们按今晚真正要完成的任务选人，而不是按他们的受众规模选人。",
        railTitle: "谁能入席",
        railItems: ["清晰使用场景", "能接受未完成", "愿意说真话"],
        whisper: "Beta 的质量，先取决于你请进了谁。",
        close: "先有名字，再谈数字。",
        beats: [
          {
            id: 0,
            action: "先展示筛选，再谈规模。",
            title: "短名单",
            body: "市场规模先留在绒绳外。",
          },
          {
            id: 1,
            action: "揭示来宾条件。",
            title: "有用的张力",
            body: "最好的来宾带着真实任务入场。",
          },
          {
            id: 2,
            action: "确认运行规则。",
            title: "房间质量",
            body: "房间决定产品信号。",
          },
        ],
      },
    },
  },
  3: {
    id: 3,
    art: "demo",
    copy: {
      en: {
        kicker: "Velvet demo",
        headline: "Show less. Let the product glow longer.",
        body: "The demo is one velvet booth: one flow, one hesitation removed, one detail worth remembering.",
        railTitle: "Demo discipline",
        railItems: ["One live path", "No feature parade", "A single remembered moment"],
        whisper: "The room should repeat the detail without being prompted.",
        close: "Let it linger.",
        beats: [
          {
            id: 0,
            action: "Frame a single demo booth.",
            title: "One velvet booth",
            body: "The guest sees one complete path.",
          },
          {
            id: 1,
            action: "Reveal the product glow.",
            title: "One removed hesitation",
            body: "The moment is quiet enough to notice.",
          },
          {
            id: 2,
            action: "Hold the memorable detail.",
            title: "One repeated detail",
            body: "A good demo leaves a phrase behind.",
          },
        ],
      },
      zh: {
        kicker: "绒面演示",
        headline: "少展示一点，让产品亮久一点。",
        body: "演示像一间绒面包厢：一条流程、一个被拿掉的犹豫、一个值得记住的细节。",
        railTitle: "演示纪律",
        railItems: ["一条现场路径", "不做功能巡游", "只留下一个记忆点"],
        whisper: "不用提示，房间里的人也能复述那个细节。",
        close: "让它停留。",
        beats: [
          {
            id: 0,
            action: "建立单一演示包厢。",
            title: "一间绒面包厢",
            body: "来宾只看一条完整路径。",
          },
          {
            id: 1,
            action: "揭示产品发光点。",
            title: "少一次犹豫",
            body: "安静到足够被注意。",
          },
          {
            id: 2,
            action: "停住记忆细节。",
            title: "一个会被复述的细节",
            body: "好的演示会留下一句话。",
          },
        ],
      },
    },
  },
  4: {
    id: 4,
    art: "proof",
    copy: {
      en: {
        kicker: "Whispered proof",
        headline: "The proof arrives below conversation volume.",
        body: "Do not chase applause. Watch for a guest lowering their voice because the result feels useful enough to protect.",
        railTitle: "Signals to keep",
        railItems: ["Unprompted return", "Borrowed language", "A calendar hold"],
        whisper: "Quiet proof is still proof.",
        close: "Listen lower.",
        beats: [
          {
            id: 0,
            action: "Lower the proof volume.",
            title: "No applause needed",
            body: "The room gets quieter when the value is real.",
          },
          {
            id: 1,
            action: "Reveal the retained signals.",
            title: "Signals worth keeping",
            body: "Return visits, borrowed words, and time held open.",
          },
          {
            id: 2,
            action: "Make the evidence intimate.",
            title: "Whispered confidence",
            body: "Guests protect what they plan to use.",
          },
        ],
      },
      zh: {
        kicker: "低声证据",
        headline: "证据会用低于谈话的音量出现。",
        body: "不要追逐掌声。观察来宾是否压低声音，因为结果有用到值得被保护。",
        railTitle: "该留下的信号",
        railItems: ["主动回来", "借用你的说法", "留出下一次时间"],
        whisper: "安静的证据仍然是证据。",
        close: "把音量听低。",
        beats: [
          {
            id: 0,
            action: "降低证据音量。",
            title: "不需要掌声",
            body: "价值真实时，房间会安静下来。",
          },
          {
            id: 1,
            action: "揭示可保留信号。",
            title: "值得保留的信号",
            body: "回访、借用说法、留出时间。",
          },
          {
            id: 2,
            action: "让证据变得亲密。",
            title: "低声的信心",
            body: "来宾会保护自己准备使用的东西。",
          },
        ],
      },
    },
  },
  5: {
    id: 5,
    art: "nightcap",
    copy: {
      en: {
        kicker: "Nightcap",
        headline: "End with the next invitation already warm.",
        body: "A private beta closes like a good nightcap: exact, quiet, and impossible to confuse with a public launch.",
        railTitle: "Closing note",
        railItems: ["Thank the room", "Confirm the next pour", "Keep the door narrow"],
        whisper: "The waitlist can grow later. Tonight, the room matters.",
        close: "Worth the wait.",
        beats: [
          {
            id: 0,
            action: "Close the salon without broadening it.",
            title: "A precise close",
            body: "The ending protects the tone of the room.",
          },
          {
            id: 1,
            action: "Reveal the next invitation.",
            title: "Next pour",
            body: "The follow-up is already warm, not automated.",
          },
          {
            id: 2,
            action: "Land the final line.",
            title: "Worth the wait",
            body: "The public launch can wait for a better story.",
          },
        ],
      },
      zh: {
        kicker: "最后一杯",
        headline: "结束时，下一张邀请已经温热。",
        body: "Private beta 的收尾像一杯好的 nightcap：准确、安静，绝不会被误认为公开发布。",
        railTitle: "收尾便条",
        railItems: ["感谢房间", "确认下一杯", "保持门窄"],
        whisper: "等候名单可以以后再长。今晚，房间更重要。",
        close: "值得等待。",
        beats: [
          {
            id: 0,
            action: "不扩大房间地收尾。",
            title: "准确收束",
            body: "结尾要保护房间的语气。",
          },
          {
            id: 1,
            action: "揭示下一张邀请。",
            title: "下一杯",
            body: "跟进已经温热，而不是自动化。",
          },
          {
            id: 2,
            action: "落到最终句。",
            title: "值得等待",
            body: "公开发布可以等到故事更好时。",
          },
        ],
      },
    },
  },
};

function clampBeat(sceneId: number, beat: number): number {
  const maxBeat = SCENES[sceneId]?.copy.en.beats.length ?? 1;
  return Math.min(Math.max(beat, 0), maxBeat - 1);
}

function getSceneCopy(sceneId: number, language: Lang): LocalizedScene {
  return SCENES[sceneId]?.copy[language] ?? SCENES[1].copy[language];
}

function CueSlot({
  show,
  className,
  children,
}: {
  show: boolean;
  className: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={className}
      data-beat-layout-item="true"
      data-visible={show ? "true" : "false"}
    >
      {children}
    </div>
  );
}

function SceneArtifact({
  art,
  beat,
}: {
  art: SalonScene["art"];
  beat: number;
}) {
  if (art === "door") {
    return (
      <div className={styles.doorArtifact} aria-hidden="true" data-beat={beat}>
        <div className={styles.doorHalo} />
        <div className={styles.doorPanel}>
          <span />
          <span />
          <span />
        </div>
        <div className={styles.doorKeyhole} />
        <div className={styles.velvetRope} />
      </div>
    );
  }

  if (art === "guestList") {
    return (
      <div className={styles.guestArtifact} aria-hidden="true" data-beat={beat}>
        {Array.from({ length: 7 }).map((_, index) => (
          <div
            className={styles.guestRow}
            data-lit={index <= beat + 1 ? "true" : "false"}
            key={index}
          >
            <span />
            <span />
            <span />
          </div>
        ))}
      </div>
    );
  }

  if (art === "demo") {
    return (
      <div className={styles.demoArtifact} aria-hidden="true" data-beat={beat}>
        <div className={styles.velvetCurtain} />
        <div className={styles.demoDevice}>
          <span />
          <span />
          <span />
        </div>
        <div className={styles.productGlow} />
      </div>
    );
  }

  if (art === "proof") {
    return (
      <div className={styles.proofArtifact} aria-hidden="true" data-beat={beat}>
        <div className={styles.whisperArc} />
        <div className={styles.whisperArc} />
        <div className={styles.proofPearls}>
          <span />
          <span />
          <span />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.nightcapArtifact} aria-hidden="true" data-beat={beat}>
      <div className={styles.glassBowl} />
      <div className={styles.liquidLine} />
      <div className={styles.coasterGlow} />
      <div className={styles.stem} />
    </div>
  );
}

function BeatMarkers({ beat, count }: { beat: number; count: number }) {
  return (
    <div className={styles.beatMarkers} aria-hidden="true">
      {Array.from({ length: count }).map((_, index) => (
        <span
          className={styles.beatMarker}
          data-active={index <= beat ? "true" : "false"}
          key={index}
        />
      ))}
    </div>
  );
}

function ScenePanel({
  sceneId,
  beat,
  language,
  isActive,
}: {
  sceneId: number;
  beat: number;
  language: Lang;
  isActive: boolean;
}) {
  const scene = SCENES[sceneId] ?? SCENES[1];
  const copy = getSceneCopy(sceneId, language);
  const safeBeat = clampBeat(sceneId, beat);

  return (
    <section
      className={styles.scene}
      data-scene={sceneId}
      data-active={isActive ? "true" : "false"}
      data-beat={safeBeat}
      aria-label={copy.headline}
    >
      <CueSlot className={styles.kicker} show={safeBeat >= 0}>
        {copy.kicker}
      </CueSlot>

      <CueSlot className={styles.headlineSlot} show={safeBeat >= 0}>
        <h2 className={styles.headline}>{copy.headline}</h2>
      </CueSlot>

      <CueSlot className={styles.bodySlot} show={safeBeat >= 1}>
        <p className={styles.body}>{copy.body}</p>
      </CueSlot>

      <CueSlot className={styles.artifactSlot} show={safeBeat >= 0}>
        <SceneArtifact art={scene.art} beat={safeBeat} />
      </CueSlot>

      <CueSlot className={styles.railSlot} show={safeBeat >= 1}>
        <aside className={styles.rail}>
          <p className={styles.railTitle}>{copy.railTitle}</p>
          <ul>
            {copy.railItems.map((item, index) => (
              <li data-visible={index <= safeBeat ? "true" : "false"} key={item}>
                {item}
              </li>
            ))}
          </ul>
        </aside>
      </CueSlot>

      <CueSlot className={styles.whisperSlot} show={safeBeat >= 2}>
        <p className={styles.whisper}>{copy.whisper}</p>
      </CueSlot>

      <CueSlot className={styles.closeSlot} show={safeBeat >= 2}>
        <p className={styles.close}>{copy.close}</p>
      </CueSlot>

      <BeatMarkers beat={safeBeat} count={copy.beats.length} />
    </section>
  );
}

function CoasterPicker({
  scene,
  language,
  onNavigate,
}: {
  scene: number;
  language: Lang;
  onNavigate?: (scene: number, beat: number) => void;
}) {
  return (
    <nav
      className={styles.coasterPicker}
      aria-label={
        language === "zh" ? "鸡尾酒杯垫场景选择器" : "Cocktail coaster scene picker"
      }
    >
      {SCENE_ORDER.map((sceneId) => {
        const distance = Math.abs(sceneId - scene);
        return (
          <button
            aria-current={sceneId === scene ? "step" : undefined}
            aria-label={
              language === "zh"
                ? `跳转到第 ${sceneId} 场`
                : `Jump to scene ${sceneId}`
            }
            className={styles.coaster}
            data-active={sceneId === scene ? "true" : "false"}
            data-distance={Math.min(distance, 2)}
            key={sceneId}
            onClick={(event) => {
              event.stopPropagation();
              onNavigate?.(sceneId, 0);
            }}
            type="button"
          >
            <span>{String(sceneId).padStart(2, "0")}</span>
          </button>
        );
      })}
    </nav>
  );
}

export function getMetadata(lang: Lang): StyleMetadata {
  return {
    id: "36",
    band: "contemporary-digital",
    name: lang === "zh" ? "午夜奢华" : "After-Hours Luxe",
    theme: lang === "zh" ? "私享 Beta 沙龙" : "Private Beta Salon",
    densityLabel: lang === "zh" ? "低中密度" : "Low-medium",
    heroScene: 3,
    colors: {
      bg: "#090706",
      ink: "#f0e2ca",
      panel: "#18100e",
    },
    typography: {
      header: "Didot / Songti SC",
      body: "Avenir Next / PingFang SC",
    },
    tags: [
      "luxury",
      "nocturnal",
      "premium",
      "serif-display",
      "private-beta",
      "coaster-nav",
    ],
    fonts: [
      "Didot",
      "Bodoni 72",
      "Avenir Next",
      "SF Mono",
      "cjk:Songti SC",
      "cjk:PingFang SC",
    ],
    scenes: SCENE_ORDER.map((sceneId) => {
      const copy = getSceneCopy(sceneId, lang);
      return {
        id: sceneId,
        title: copy.kicker,
        beats: copy.beats,
      };
    }),
  };
}

export default function PrivateBetaSalonV2({
  scene,
  beat,
  language,
  isThumbnail,
  reducedMotion,
  onNavigate,
}: BespokeStyleProps) {
  const currentScene = SCENES[scene] ? scene : 1;
  const motionOff = reducedMotion || isThumbnail;

  return (
    <div
      className={styles.root}
      data-motion={motionOff ? "off" : "on"}
      data-thumbnail={isThumbnail ? "true" : "false"}
    >
      <div className={styles.hairlineFrame} aria-hidden="true" />
      <SpatialSceneTrack
        beat={clampBeat(currentScene, beat)}
        beatLayoutModes={BEAT_LAYOUT_MODES}
        className={styles.track}
        reducedMotion={motionOff}
        renderScene={(sceneId, sceneBeat, isActive) => (
          <ScenePanel
            beat={sceneBeat}
            isActive={isActive}
            language={language}
            sceneId={sceneId}
          />
        )}
        scene={currentScene}
        sceneIds={SCENE_ORDER}
        transitionKind="scale-fade"
        transitionMap={TRANSITION_MAP}
      />
      {!isThumbnail && (
        <CoasterPicker
          language={language}
          onNavigate={onNavigate}
          scene={currentScene}
        />
      )}
    </div>
  );
}

export const privateBetaSalonV2Version = defineStyleVersion({
  id: "v2",
  topic: {
    en: "Beta Salon",
    zh: "内测沙龙",
  },
  model: "GPT-5.5",
  component: PrivateBetaSalonV2,
  getMetadata,
});

import type { BespokeStyleProps, StyleMetadata } from "../types";
import { defineStyleTopic } from "./topic";
import { curatedNavigationAttributes } from "./curated-topic-contract";
import SpatialSceneTrack from "./SpatialSceneTrack";
import type { SceneTransitionMap } from "./SpatialSceneTrack";
import { useFLIP } from "../hooks/useFLIP";
import styles from "./first-week-here.module.css";

/* ------------------------------------------------------------------ */
/* Palette (warm bone/peach ground, pastel family, one peach accent)  */
/* ------------------------------------------------------------------ */
const COLORS = {
  bg: "#F7E9DA",
  ink: "#5A4636",
  panel: "#FFF8F0",
  accentSoft: "#FBD9C0", // half-step-forward peach spot accent
  accentDeep: "#E39A6E",
  lavender: "#E4DBF2",
  mint: "#D5EDDD",
  butter: "#FBEEC6",
  blush: "#F8D9DE",
};

/* ------------------------------------------------------------------ */
/* Content (bilingual)                                                 */
/* ------------------------------------------------------------------ */
type Lang = "en" | "zh";

const TXT = {
  en: {
    welcomeKicker: "Welcome aboard",
    welcomeTitle: "Your First Week Here",
    welcomeSub: "A gentle map for the days ahead — no rush, we've got you.",
    dayKicker: "Day one",
    dayTitle: "Three easy things",
    tasks: [
      { icon: "☕", title: "Say hello", note: "Meet your buddy over coffee" },
      { icon: "💻", title: "Get set up", note: "Laptop, badge, and logins" },
      { icon: "📖", title: "Skim the guide", note: "Just the welcome pages" },
    ],
    peopleKicker: "The people",
    peopleTitle: "Your friendly crew",
    team: [
      { initial: "M", name: "Mei", role: "Your buddy", bg: COLORS.lavender },
      { initial: "L", name: "Leo", role: "Team lead", bg: COLORS.mint },
      { initial: "A", name: "Ada", role: "Desk neighbor", bg: COLORS.blush },
      { initial: "R", name: "Rio", role: "People team", bg: COLORS.butter },
    ],
    peopleHi: "They already know you're coming — say hi anytime.",
    toolsKicker: "The tools",
    toolsTitle: "A few soft helpers",
    tools: [
      { icon: "💬", name: "Chat", bg: COLORS.mint },
      { icon: "📅", name: "Calendar", bg: COLORS.lavender },
      { icon: "📝", name: "Docs", bg: COLORS.butter, accent: true },
      { icon: "✅", name: "Tasks", bg: COLORS.blush },
    ],
    toolsFav: "Docs is where every answer already lives.",
    setKicker: "You're all set",
    setTitle: "Take it gently",
    setSub: "Week one is for settling in. Questions are welcome — always.",
  },
  zh: {
    welcomeKicker: "欢迎加入",
    welcomeTitle: "入职第一周",
    welcomeSub: "为接下来的日子准备的温柔地图——不着急，我们都在。",
    dayKicker: "第一天",
    dayTitle: "三件轻松小事",
    tasks: [
      { icon: "☕", title: "打个招呼", note: "和搭档喝杯咖啡认识一下" },
      { icon: "💻", title: "搞定设备", note: "电脑、工牌和各种账号" },
      { icon: "📖", title: "翻翻指南", note: "先看欢迎那几页就好" },
    ],
    peopleKicker: "身边的人",
    peopleTitle: "友好的小伙伴",
    team: [
      { initial: "梅", name: "小梅", role: "你的搭档", bg: COLORS.lavender },
      { initial: "磊", name: "阿磊", role: "团队负责人", bg: COLORS.mint },
      { initial: "雅", name: "小雅", role: "邻座同事", bg: COLORS.blush },
      { initial: "睿", name: "小睿", role: "人力团队", bg: COLORS.butter },
    ],
    peopleHi: "他们早就知道你要来啦——随时打招呼都行。",
    toolsKicker: "常用工具",
    toolsTitle: "几个贴心帮手",
    tools: [
      { icon: "💬", name: "聊天", bg: COLORS.mint },
      { icon: "📅", name: "日历", bg: COLORS.lavender },
      { icon: "📝", name: "文档", bg: COLORS.butter, accent: true },
      { icon: "✅", name: "任务", bg: COLORS.blush },
    ],
    toolsFav: "文档里早已藏好了每个答案。",
    setKicker: "你已就绪",
    setTitle: "慢慢来就好",
    setSub: "第一周是用来适应的。有问题随时问——永远欢迎。",
  },
} satisfies Record<Lang, Record<string, unknown>>;

/* ------------------------------------------------------------------ */
/* Tiny hand-drawn motifs (quiet corner punctuation)                   */
/* ------------------------------------------------------------------ */
function Daisy({ size = 6, animate = false }: { size?: number; animate?: boolean }) {
  const s = `${size}cqh`;
  return (
    <svg
      className={animate ? styles.floatMotif : undefined}
      width={s}
      height={s}
      viewBox="0 0 40 40"
      fill="none"
      aria-hidden="true"
    >
      {[0, 60, 120, 180, 240, 300].map((deg) => (
        <ellipse
          key={deg}
          cx="20"
          cy="9"
          rx="5"
          ry="8"
          fill={COLORS.blush}
          transform={`rotate(${deg} 20 20)`}
        />
      ))}
      <circle cx="20" cy="20" r="5.6" fill={COLORS.accentDeep} />
    </svg>
  );
}

function Star({ size = 5 }: { size?: number }) {
  const s = `${size}cqh`;
  return (
    <svg width={s} height={s} viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <path
        d="M20 4c1.6 6.4 5.6 10.4 12 12-6.4 1.6-10.4 5.6-12 12-1.6-6.4-5.6-10.4-12-12 6.4-1.6 10.4-5.6 12-12z"
        fill={COLORS.accentDeep}
      />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Scenes                                                              */
/* ------------------------------------------------------------------ */
interface SceneProps {
  scene: number;
  beat: number;
  isActive: boolean;
  language: Lang;
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
  const t = TXT[language];
  const still = reducedMotion || isThumbnail;

  const dayFlip = useFLIP<HTMLDivElement>({
    watch: [beat],
    disabled: still || !isActive || scene !== 2,
    duration: 520,
    easing: "cubic-bezier(0.34, 1.56, 0.64, 1)",
    selector: '[data-beat-layout-item="true"]',
  });

  const toolFlip = useFLIP<HTMLDivElement>({
    watch: [beat],
    disabled: still || !isActive || scene !== 4,
    duration: 480,
    easing: "cubic-bezier(0.34, 1.56, 0.64, 1)",
    selector: '[data-beat-layout-item="true"]',
  });

  /* ----- Scene 1 · Welcome ----- */
  if (scene === 1) {
    return (
      <div className={styles.scene}>
        <div className={`${styles.welcomeCard} ${still ? "" : styles.aCard}`}>
          <span className={styles.welcomeMotif}>
            <Daisy size={9} animate={!still} />
          </span>
          <span className={styles.kicker}>{t.welcomeKicker}</span>
          <h1 className={styles.welcomeTitle}>{t.welcomeTitle}</h1>
          <p className={styles.welcomeSub}>{t.welcomeSub}</p>
        </div>
      </div>
    );
  }

  /* ----- Scene 2 · Day One (motion, 3 beats) ----- */
  if (scene === 2) {
    const shown = still ? t.tasks.length : Math.min(beat + 1, t.tasks.length);
    return (
      <div className={styles.scene}>
        <span className={styles.kicker}>{t.dayKicker}</span>
        <div
          ref={dayFlip.ref}
          className={styles.pillCol}
          data-beat-layout-container="true"
          data-beat-layout-mode="motion"
        >
          {t.tasks.slice(0, shown).map((task, i) => (
            <div
              key={task.title}
              data-beat-layout-item="true"
              className={`${styles.pill} ${
                still || i < beat ? "" : styles.aPill
              }`}
              style={
                {
                  ["--pill-bg" as string]:
                    i === 0 ? COLORS.mint : i === 1 ? COLORS.lavender : COLORS.blush,
                } as React.CSSProperties
              }
            >
              <span className={styles.pillIcon}>{task.icon}</span>
              <span className={styles.pillText}>
                <span className={styles.pillTitle}>{task.title}</span>
                <span className={styles.pillNote}>{task.note}</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  /* ----- Scene 3 · The People (reserved, 2 beats) ----- */
  if (scene === 3) {
    const revealed = still || beat >= 1;
    return (
      <div className={styles.scene}>
        <span className={styles.kicker}>{t.peopleKicker}</span>
        <div
          className={styles.avatarRow}
          data-beat-layout-container="true"
          data-beat-layout-mode="reserved"
        >
          {t.team.map((m, i) => (
            <div
              key={m.name}
              data-beat-layout-item="true"
              className={`${styles.avatarCell} ${still ? "" : styles.aPop}`}
              style={{ animationDelay: still ? undefined : `${i * 90}ms` }}
            >
              <span
                className={styles.avatar}
                style={{ ["--ava-bg" as string]: m.bg } as React.CSSProperties}
              >
                {m.initial}
              </span>
              <span
                className={styles.avatarName}
                style={{ opacity: revealed ? 1 : 0, transform: revealed ? "none" : "translateY(0.8cqh)" }}
              >
                {m.name}
              </span>
              <span
                className={styles.avatarRole}
                style={{ opacity: revealed ? 1 : 0, transform: revealed ? "none" : "translateY(0.8cqh)" }}
              >
                {m.role}
              </span>
            </div>
          ))}
        </div>
        <span
          className={styles.peopleHi}
          data-beat-layout-item="true"
          style={{ opacity: revealed ? 1 : 0, transform: revealed ? "none" : "scale(0.94)" }}
        >
          {t.peopleHi}
        </span>
      </div>
    );
  }

  /* ----- Scene 4 · The Tools (motion, 2 beats) ----- */
  if (scene === 4) {
    const favShown = still || beat >= 1;
    return (
      <div className={styles.scene}>
        <span className={styles.kicker}>{t.toolsKicker}</span>
        <div
          ref={toolFlip.ref}
          className={styles.cardRow}
          data-beat-layout-container="true"
          data-beat-layout-mode="motion"
        >
          {t.tools.map((tool, i) => (
            <div
              key={tool.name}
              data-beat-layout-item="true"
              className={`${styles.toolCard} ${tool.accent ? styles.accentCard : ""} ${
                still ? "" : styles.aPop
              }`}
              style={
                {
                  ["--card-bg" as string]: tool.bg,
                  animationDelay: still ? undefined : `${i * 80}ms`,
                } as React.CSSProperties
              }
            >
              {tool.accent && (
                <span className={styles.toolMotif}>
                  <Star size={5} />
                </span>
              )}
              <span className={styles.toolIcon}>{tool.icon}</span>
              <span className={styles.toolName}>{tool.name}</span>
            </div>
          ))}
        </div>
        <span
          className={styles.toolFav}
          data-beat-layout-item="true"
          style={{ opacity: favShown ? 1 : 0, transform: favShown ? "none" : "translateY(1cqh)" }}
        >
          {t.toolsFav}
        </span>
      </div>
    );
  }

  /* ----- Scene 5 · You're All Set (1 beat) ----- */
  return (
    <div className={styles.scene}>
      <div className={`${styles.closingCard} ${still ? "" : styles.aCard}`}>
        <span className={styles.closingMotif}>
          <Daisy size={8} animate={!still} />
        </span>
        <span className={styles.kicker}>{t.setKicker}</span>
        <h2 className={styles.closingTitle}>{t.setTitle}</h2>
        <p className={styles.closingSub}>{t.setSub}</p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Nav · rounded Day-picker drum (N4 wheel/picker)                     */
/* ------------------------------------------------------------------ */
const DAY_ROW = 6.2; // cqh, matches .drumRow height
const DRUM_CENTER = 6.2; // cqh offset so active row sits in the window center

function DayDrum({
  scene,
  language,
  isThumbnail,
  onNavigate,
}: {
  scene: number;
  language: Lang;
  isThumbnail: boolean;
  onNavigate?: (scene: number, beat: number) => void;
}) {
  if (isThumbnail) return null;
  const label = language === "en" ? "Day" : "第";
  const suffix = language === "en" ? "" : "天";
  const days = [1, 2, 3, 4, 5];
  const offset = DRUM_CENTER - (scene - 1) * DAY_ROW;

  return (
    <div
      {...curatedNavigationAttributes("soft-pastel-friendly", "first-week-here")}
      className={styles.drum}
      onClick={(e) => e.stopPropagation()}
    >
      <span className={styles.drumLabel}>{language === "en" ? "Week 1" : "第一周"}</span>
      <div className={styles.drumWindow}>
        <div
          className={styles.drumList}
          style={{
            transform: `translateY(${offset}cqh)`,
            transition: "transform 560ms cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}
        >
          {days.map((d) => (
            <button
              key={d}
              type="button"
              className={`${styles.drumRow} ${
                d === scene ? styles.drumRowActive : ""
              }`}
              onClick={(e) => {
                e.stopPropagation();
                onNavigate?.(d, 0);
              }}
            >
              {label} {d}
              {suffix}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Transitions                                                         */
/* ------------------------------------------------------------------ */
const TRANSITIONS: SceneTransitionMap = {
  "1->2": "scale-fade",
  "2->3": "slide-y",
  "3->4": "slide-y",
  "4->5": "scale-fade",
};

const BEAT_LAYOUT_MODES = { 2: "motion", 3: "reserved", 4: "motion" } as const;

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */
function FirstWeekHereV3({
  scene,
  beat,
  language,
  isThumbnail,
  reducedMotion,
  onNavigate,
}: BespokeStyleProps) {
  const still = reducedMotion || isThumbnail;

  return (
    <div
      className={styles.root}
      data-motion={still ? "off" : "on"}
      style={
        {
          ["--fw-bg" as string]: COLORS.bg,
          ["--fw-ink" as string]: COLORS.ink,
          ["--fw-panel" as string]: COLORS.panel,
          ["--fw-accent-soft" as string]: COLORS.accentSoft,
          ["--fw-accent-deep" as string]: COLORS.accentDeep,
        } as React.CSSProperties
      }
    >
      <SpatialSceneTrack
        scene={scene}
        beat={beat}
        transitionKind="scale-fade"
        transitionMap={TRANSITIONS}
        reducedMotion={still}
        beatLayoutModes={BEAT_LAYOUT_MODES}
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
      <DayDrum
        scene={scene}
        language={language}
        isThumbnail={isThumbnail}
        onNavigate={onNavigate}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Metadata — en & zh structurally identical (5 scenes, beats 1/3/2/2/1)*/
/* ------------------------------------------------------------------ */
export function getMetadata(lang: Lang): StyleMetadata {
  const t = TXT[lang];
  const isEn = lang === "en";
  return {
    id: "soft-pastel-friendly",
    band: "balanced-hybrid",
    name: isEn ? "Soft Pastel Friendly" : "柔和粉彩友好",
    theme: isEn ? "Your First Week Here" : "入职第一周",
    densityLabel: isEn ? "Medium · warm" : "中等 · 温暖",
    heroScene: 1,
    colors: { bg: COLORS.bg, ink: COLORS.ink, panel: COLORS.panel },
    typography: { header: "Quicksand", body: "Nunito Sans" },
    tags: isEn
      ? ["friendly", "warm", "pastel", "rounded", "gentle-spring"]
      : ["友好", "温暖", "粉彩", "圆润", "柔和弹性"],
    fonts: [
      "Quicksand:wght@500;600;700",
      "Nunito Sans:wght@400;600;700",
      "cjk:Noto Sans SC:wght@500;600;700",
    ],
    scenes: [
      {
        id: 1,
        title: isEn ? "Welcome" : "欢迎",
        beats: [
          {
            id: 0,
            action: isEn ? "Welcome card springs in" : "欢迎卡片弹入",
            title: t.welcomeTitle,
            body: t.welcomeSub,
          },
        ],
      },
      {
        id: 2,
        title: isEn ? "Day one" : "第一天",
        beats: [
          {
            id: 0,
            action: isEn ? "First task pill lands" : "第一个任务胶囊落定",
            title: t.tasks[0].title,
            body: t.tasks[0].note,
          },
          {
            id: 1,
            action: isEn ? "Second task pill lands" : "第二个任务胶囊落定",
            title: t.tasks[1].title,
            body: t.tasks[1].note,
          },
          {
            id: 2,
            action: isEn ? "Third task pill lands" : "第三个任务胶囊落定",
            title: t.tasks[2].title,
            body: t.tasks[2].note,
          },
        ],
      },
      {
        id: 3,
        title: isEn ? "The people" : "身边的人",
        beats: [
          {
            id: 0,
            action: isEn ? "Squircle avatars appear" : "方圆头像出现",
            title: t.peopleTitle,
            body: isEn ? "Four friendly faces settle in." : "四张友好的面孔就位。",
          },
          {
            id: 1,
            action: isEn ? "Names and welcome note fade in" : "名字与欢迎语淡入",
            title: isEn ? "Meet the crew" : "认识小伙伴",
            body: t.peopleHi,
          },
        ],
      },
      {
        id: 4,
        title: isEn ? "The tools" : "常用工具",
        beats: [
          {
            id: 0,
            action: isEn ? "Tool cards pop in" : "工具卡片弹入",
            title: t.toolsTitle,
            body: isEn ? "Four soft helpers for the week." : "四个本周的贴心帮手。",
          },
          {
            id: 1,
            action: isEn ? "Favorite tool note rises" : "首选工具提示浮现",
            title: isEn ? "Start with Docs" : "从文档开始",
            body: t.toolsFav,
          },
        ],
      },
      {
        id: 5,
        title: isEn ? "You're set" : "你已就绪",
        beats: [
          {
            id: 0,
            action: isEn ? "Warm closing pill settles" : "温暖收尾胶囊落定",
            title: t.setTitle,
            body: t.setSub,
          },
        ],
      },
    ],
  };
}

export const firstWeekHereTopic = defineStyleTopic({
  id: "first-week-here",
  topic: { en: "Your First Week Here", zh: "入职第一周" },
  model: "Claude Opus 4.8",
  component: FirstWeekHereV3,
  getMetadata,
});

export default FirstWeekHereV3;

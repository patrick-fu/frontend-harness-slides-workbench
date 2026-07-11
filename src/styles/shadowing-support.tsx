import { useEffect, type CSSProperties, type ReactNode } from "react";
import type { BespokeStyleProps, StyleMetadata } from "../types";
import { defineStyleTopic } from "./topic";
import SpatialSceneTrack from "./SpatialSceneTrack";
import type { SceneTransitionMap } from "./SpatialSceneTrack";
import { useFLIP } from "../hooks/useFLIP";
import styles from "./shadowing-support.module.css";

/* ────────────────────────────────────────────────────────────────────────
   Style 44 — Field Notes Report — v3 "A Day Shadowing Support"
   A researcher's notebook from a day spent shadowing a support team.
   Aged-paper ground, sepia writing, one terracotta accent, hand-paced motion.
   ──────────────────────────────────────────────────────────────────────── */

const FONT_LINK_ID = "font-44-shadowing-support-v3";

function useFonts(): void {
  useEffect(() => {
    if (document.getElementById(FONT_LINK_ID)) return;
    const link = document.createElement("link");
    link.id = FONT_LINK_ID;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Caveat:wght@400;600;700" +
      "&family=Lora:ital,wght@0,400;0,500;1,400" +
      "&family=Ma+Shan+Zheng&family=Noto+Serif+SC:wght@400;600&display=swap";
    document.head.appendChild(link);
  }, []);
}

const handFont = (lang: "en" | "zh"): string =>
  lang === "zh"
    ? '"Ma Shan Zheng", "Caveat", cursive'
    : '"Caveat", "Ma Shan Zheng", cursive';

const bodyFont = (lang: "en" | "zh"): string =>
  lang === "zh"
    ? '"Noto Serif SC", "Lora", serif'
    : '"Lora", "Noto Serif SC", serif';

/* ── bilingual content (no `as const` — that breaks the build) ───────────── */
const COPY = {
  en: {
    s1: {
      kicker: "Field Log",
      date: "Tues · 09:12 — 17:40",
      place: "Support floor · third desk row",
      title: "A Day Shadowing Support",
      subtitle:
        "Notebook, coffee, one headset borrowed. Watching how tickets actually get solved — not how the handbook says they should.",
    },
    s2: {
      title: "Observations",
      hint: "recorded as I saw them",
      items: [
        "Reps read the whole thread before typing a single word.",
        "The fastest ones keep a private list of canned fixes.",
        "Angry tickets get a name and a pause, not a script.",
        "Every truly hard case gets pasted into the team channel.",
      ],
    },
    s3: {
      title: "The desk",
      caption: "one seat · three screens · a ring of sticky notes",
      findLabel: "What the setup tells you",
      finds: [
        "Left screen never leaves the ticket queue.",
        "Sticky notes are the shortcuts the tool forgot.",
      ],
      keyTag: "Pattern",
      key: "Two screens hold context, one holds the reply — always.",
    },
    s4: {
      title: "Recurring patterns",
      hint: "margin notes, added later",
      rows: [
        {
          tag: "Copy-first",
          text: "They draft the reply in a scratch doc, then paste it in.",
          note: "fear of a misfire",
        },
        {
          tag: "Name the mood",
          text: "First line answers the feeling, second line the problem.",
          note: "learned, never trained",
        },
        {
          tag: "Ask the room",
          text: "Stuck for 90 seconds → they ping a neighbor, not a manager.",
          note: "trust over hierarchy",
        },
      ],
    },
    s5: {
      kicker: "Takeaway",
      big: "The tool should do what the best reps already do by hand.",
      body: "Not another dashboard. Fewer copy-pastes, faster context, and a shortcut placed exactly where the sticky note is.",
      sign: "— end of day, notebook closed",
    },
    folioWord: "p.",
    folioMeta: "field log · 44",
  },
  zh: {
    s1: {
      kicker: "田野日志",
      date: "周二 · 09:12 — 17:40",
      place: "客服区 · 第三排工位",
      title: "跟班客服的一天",
      subtitle:
        "带着笔记本、咖啡，借了一副耳机。看工单到底是怎么被解决的——而不是手册里说该怎么解决。",
    },
    s2: {
      title: "观察",
      hint: "边看边记",
      items: [
        "客服会先读完整个会话，再敲下第一个字。",
        "手最快的人，自己攒了一份常用解法清单。",
        "遇到情绪激动的工单，先叫出名字、停一拍，而不是套模板。",
        "每个真正难缠的案子，都会被贴进团队群里。",
      ],
    },
    s3: {
      title: "工位",
      caption: "一个座位 · 三块屏 · 一圈便签",
      findLabel: "工位透露的信息",
      finds: [
        "左边那块屏，永远停在工单队列上。",
        "那些便签，就是工具没做出来的快捷方式。",
      ],
      keyTag: "规律",
      key: "两块屏看上下文，一块屏写回复——雷打不动。",
    },
    s4: {
      title: "反复出现的模式",
      hint: "边注，是后来补上的",
      rows: [
        {
          tag: "先起草",
          text: "先在草稿里把回复写好，再粘贴到工单里。",
          note: "怕手滑点错发送",
        },
        {
          tag: "先安情绪",
          text: "第一句回应情绪，第二句才去解决问题。",
          note: "是悟出来的，不是培训的",
        },
        {
          tag: "问一嗓子",
          text: "卡住超过 90 秒 → 转头问邻座，而不是找主管。",
          note: "信任高过层级",
        },
      ],
    },
    s5: {
      kicker: "带走的一句",
      big: "工具该做的，是替最好的客服，做掉他们已经在手动做的事。",
      body: "不是再加一个仪表盘。而是少几次复制粘贴、更快看到上下文、在贴便签的地方给一个快捷键。",
      sign: "— 一天结束，合上本子",
    },
    folioWord: "第",
    folioMeta: "田野日志 · 44",
  },
};

type Copy = typeof COPY.en;

const TRANSITIONS: SceneTransitionMap = {
  "1->2": "page-flip",
  "2->3": "slide-y",
  "3->4": "slide-y",
  "4->5": "page-flip",
};

const TOTAL_SCENES = 5;

/* ── hand-drawn page folio (nav prototype N5) ────────────────────────────── */
function Folio({
  scene,
  language,
  isThumbnail,
  onNavigate,
}: {
  scene: number;
  language: "en" | "zh";
  isThumbnail: boolean;
  onNavigate?: (scene: number, beat: number) => void;
}): ReactNode {
  if (isThumbnail) return null;
  const c = COPY[language];
  return (
    <div className={styles.folio} style={{ fontFamily: handFont(language) }}>
      <span className={styles.folioWord}>{c.folioWord}</span>
      <div className={styles.folioNums}>
        {Array.from({ length: TOTAL_SCENES }, (_, i) => i + 1).map((n) => (
          <button
            key={n}
            type="button"
            className={styles.folioNum}
            data-current={n === scene ? "true" : "false"}
            onClick={(e) => {
              e.stopPropagation();
              onNavigate?.(n, 0);
            }}
          >
            {n}
          </button>
        ))}
      </div>
      <span className={styles.folioMeta}>{c.folioMeta}</span>
    </div>
  );
}

/* ── setup sketch (draws in on scene enter) ──────────────────────────────── */
function DeskSketch({ drawing }: { drawing: boolean }): ReactNode {
  const cls = [styles.sketchSvg, drawing ? styles.draw : ""]
    .filter(Boolean)
    .join(" ");
  const pen = styles.pen;
  const fill = styles.fillMark;
  return (
    <svg className={cls} viewBox="0 0 120 96" role="img" aria-hidden="true">
      {/* desk surface + legs */}
      <path className={pen} pathLength="1" d="M4 76 L116 76" fill="none" />
      <path className={pen} pathLength="1" d="M16 76 L16 94" fill="none" />
      <path className={pen} pathLength="1" d="M104 76 L104 94" fill="none" />
      {/* left screen */}
      <path
        className={pen}
        pathLength="1"
        d="M14 36 L42 36 L42 62 L14 62 Z"
        fill="none"
      />
      <path className={pen} pathLength="1" d="M28 62 L28 70 M22 70 L34 70" fill="none" />
      {/* center screen */}
      <path
        className={pen}
        pathLength="1"
        d="M50 28 L82 28 L82 60 L50 60 Z"
        fill="none"
      />
      <path className={pen} pathLength="1" d="M66 60 L66 70 M60 70 L72 70" fill="none" />
      {/* right screen */}
      <path
        className={pen}
        pathLength="1"
        d="M90 40 L112 40 L112 60 L90 60 Z"
        fill="none"
      />
      <path className={pen} pathLength="1" d="M101 60 L101 68 M95 68 L107 68" fill="none" />
      {/* keyboard */}
      <path
        className={pen}
        pathLength="1"
        d="M42 71 L82 71 L80 75 L44 75 Z"
        fill="none"
      />
      {/* mug */}
      <path
        className={fill}
        d="M92 66 a6 6 0 1 0 12 0 a6 6 0 0 0 -12 0 Z"
        fill="rgba(193,90,52,0.30)"
        stroke="#3b342a"
        strokeWidth="1.1"
      />
      <path className={pen} pathLength="1" d="M104 63 q6 2 0 6" fill="none" />
      {/* sticky notes on left screen frame */}
      <rect
        className={fill}
        x="15"
        y="38"
        width="9"
        height="8"
        rx="0.8"
        fill="rgba(214,154,60,0.5)"
        stroke="#8b6a2a"
        strokeWidth="0.6"
        transform="rotate(-6 19 42)"
      />
      <rect
        className={fill}
        x="30"
        y="46"
        width="9"
        height="8"
        rx="0.8"
        fill="rgba(214,154,60,0.42)"
        stroke="#8b6a2a"
        strokeWidth="0.6"
        transform="rotate(5 34 50)"
      />
    </svg>
  );
}

/* ── one scene's content ─────────────────────────────────────────────────── */
function SceneContent({
  scene,
  beat,
  isActive,
  language,
  reducedMotion,
  isThumbnail,
}: {
  scene: number;
  beat: number;
  isActive: boolean;
  language: "en" | "zh";
  reducedMotion: boolean;
  isThumbnail: boolean;
}): ReactNode {
  const c: Copy = COPY[language] as Copy;
  const hand = handFont(language);
  const body = bodyFont(language);
  const motionOn = isActive && !reducedMotion && !isThumbnail;

  // FLIP for scene 3 (motion): reflows the findings column as the key note lands.
  const { ref: findRef } = useFLIP<HTMLDivElement>({
    watch: [beat, isActive],
    disabled: !motionOn || scene !== 3,
    duration: 480,
    easing: "cubic-bezier(0.34, 1.56, 0.64, 1)",
    selector: '[data-beat-layout-item="true"]',
  });

  const reveal = (lit: boolean, delayMs: number): CSSProperties => ({
    opacity: lit ? 1 : 0.14,
    transform: lit ? "translateY(0)" : "translateY(0.7cqh)",
    transition: "opacity 500ms ease, transform 500ms ease",
    transitionDelay: `${delayMs}ms`,
  });

  if (scene === 1) {
    return (
      <div className={styles.page}>
        <div className={styles.marginRule} aria-hidden="true" />
        <div className={styles.logHeadRow} style={{ fontFamily: body }}>
          <span className={styles.kicker}>{c.s1.kicker}</span>
          <span className={styles.kicker}>{c.s1.date}</span>
        </div>
        <div className={styles.place} style={{ fontFamily: body }}>
          {c.s1.place}
        </div>
        <h1
          className={`${styles.titleHand} ${motionOn ? styles.aWrite : ""}`}
          style={{ fontFamily: hand }}
        >
          {c.s1.title}
        </h1>
        <svg
          className={styles.underline}
          viewBox="0 0 340 12"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M2 8 C70 2 150 12 210 6 C260 1 300 8 338 4"
            fill="none"
            stroke="#c15a34"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
        <p
          className={`${styles.subtitle} ${motionOn ? styles.aSoft : ""}`}
          style={{ fontFamily: body, animationDelay: "260ms" }}
        >
          {c.s1.subtitle}
        </p>
      </div>
    );
  }

  if (scene === 2) {
    const revealCount = isThumbnail ? 4 : beat >= 1 ? 4 : 2;
    return (
      <div className={styles.page}>
        <div className={styles.marginRule} aria-hidden="true" />
        <div>
          <h2 className={styles.sectionTitle} style={{ fontFamily: hand }}>
            {c.s2.title}
          </h2>
          <div className={styles.sectionHint} style={{ fontFamily: body }}>
            {c.s2.hint}
          </div>
        </div>
        <div
          className={styles.obsList}
          data-beat-layout-container="true"
          data-beat-layout-mode="reserved"
        >
          {c.s2.items.map((text, i) => {
            const lit = i < revealCount;
            return (
              <div
                key={i}
                data-beat-layout-item="true"
                className={styles.obsRow}
                style={reveal(lit, (i % 2) * 120)}
              >
                <svg
                  className={styles.obsBullet}
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    d="M4 14 L9 19 L20 5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className={styles.obsIndex} style={{ fontFamily: hand }}>
                  0{i + 1}
                </span>
                <span className={styles.obsText} style={{ fontFamily: body }}>
                  {text}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  if (scene === 3) {
    const showKey = isThumbnail || beat >= 1;
    return (
      <div className={styles.page}>
        <div className={styles.marginRule} aria-hidden="true" />
        <div>
          <h2 className={styles.sectionTitle} style={{ fontFamily: hand }}>
            {c.s3.title}
          </h2>
          <div className={styles.sectionHint} style={{ fontFamily: body }}>
            {c.s3.caption}
          </div>
        </div>
        <div className={styles.sketchWrap}>
          <div className={styles.sketchCol}>
            <DeskSketch drawing={motionOn} />
            <div className={styles.sketchCaption} style={{ fontFamily: hand }}>
              {c.s3.caption}
            </div>
          </div>
          <div className={styles.findCol}>
            <div className={styles.findLabel} style={{ fontFamily: body }}>
              {c.s3.findLabel}
            </div>
            <div
              className={styles.findList}
              ref={findRef}
              data-beat-layout-container="true"
              data-beat-layout-mode="motion"
            >
              {showKey ? (
                <div
                  data-beat-layout-item="true"
                  className={`${styles.findKey} ${motionOn ? styles.aRise : ""}`}
                  style={{ fontFamily: body }}
                >
                  <span
                    className={styles.findKeyTag}
                    style={{ fontFamily: body }}
                  >
                    {c.s3.keyTag}
                  </span>
                  {c.s3.key}
                </div>
              ) : null}
              {c.s3.finds.map((text, i) => (
                <div
                  key={i}
                  data-beat-layout-item="true"
                  className={styles.findRow}
                  style={{ fontFamily: body }}
                >
                  <span className={styles.findDash}>—</span>
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (scene === 4) {
    const showNotes = isThumbnail || beat >= 1;
    return (
      <div className={styles.page}>
        <div className={styles.marginRule} aria-hidden="true" />
        <div>
          <h2 className={styles.sectionTitle} style={{ fontFamily: hand }}>
            {c.s4.title}
          </h2>
          <div className={styles.sectionHint} style={{ fontFamily: body }}>
            {c.s4.hint}
          </div>
        </div>
        <div
          className={styles.patternGrid}
          data-beat-layout-container="true"
          data-beat-layout-mode="reserved"
        >
          {c.s4.rows.map((row, i) => (
            <div
              key={i}
              data-beat-layout-item="true"
              className={styles.behaviorRow}
            >
              <div className={styles.behMain}>
                <span className={styles.behTag} style={{ fontFamily: hand }}>
                  {row.tag}
                </span>
                <span className={styles.behText} style={{ fontFamily: body }}>
                  {row.text}
                </span>
              </div>
              <span
                className={styles.marginNote}
                style={{ fontFamily: hand, ...reveal(showNotes, i * 110) }}
              >
                {row.note}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // scene 5
  return (
    <div className={styles.page}>
      <div className={styles.marginRule} aria-hidden="true" />
      <div className={styles.takeWrap}>
        <span
          className={styles.kicker}
          style={{ fontFamily: body }}
        >
          {c.s5.kicker}
        </span>
        <h1
          className={`${styles.takeBig} ${motionOn ? styles.aWrite : ""}`}
          style={{ fontFamily: hand }}
        >
          {c.s5.big}
        </h1>
        <p
          className={`${styles.takeBody} ${motionOn ? styles.aSoft : ""}`}
          style={{ fontFamily: body, animationDelay: "220ms" }}
        >
          {c.s5.body}
        </p>
        <div
          className={`${styles.takeSign} ${motionOn ? styles.aSoft : ""}`}
          style={{ fontFamily: hand, animationDelay: "420ms" }}
        >
          {c.s5.sign}
        </div>
      </div>
    </div>
  );
}

/* ── component ───────────────────────────────────────────────────────────── */
function ShadowingSupportV3({
  scene,
  beat,
  language,
  isThumbnail,
  reducedMotion,
  onNavigate,
}: BespokeStyleProps): ReactNode {
  useFonts();
  const reduced = reducedMotion || isThumbnail;

  return (
    <div className={styles.root} data-reduced={reduced ? "true" : "false"}>
      <div className={styles.grain} aria-hidden="true" />
      <div className={styles.stain} aria-hidden="true" />
      <SpatialSceneTrack
        scene={scene}
        beat={beat}
        transitionKind="page-flip"
        transitionMap={TRANSITIONS}
        reducedMotion={reduced}
        beatLayoutModes={{ 2: "reserved", 3: "motion", 4: "reserved" }}
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
      <Folio
        scene={scene}
        language={language}
        isThumbnail={isThumbnail}
        onNavigate={onNavigate}
      />
    </div>
  );
}

/* ── metadata ────────────────────────────────────────────────────────────── */
export function getMetadata(lang: "en" | "zh"): StyleMetadata {
  const c: Copy = COPY[lang] as Copy;
  const en = lang === "en";
  return {
    id: "field-notes-report",
    band: "text-report",
    name: en ? "Field Notes Report" : "田野笔记",
    theme: en ? "A Day Shadowing Support" : "跟班客服",
    densityLabel: en ? "Reading-First" : "以阅读为先",
    heroScene: 3,
    colors: { bg: "#f2e8cf", ink: "#3b342a", panel: "#e7d8b0" },
    typography: {
      header: en ? "Caveat" : "Ma Shan Zheng",
      body: en ? "Lora" : "Noto Serif SC",
    },
    tags: en
      ? [
          "observational",
          "tactile",
          "handwritten",
          "warm",
          "aged-paper",
          "research",
          "notebook",
          "reading-first",
          "gentle-motion",
        ]
      : [
          "观察感",
          "手作质感",
          "手写",
          "温暖",
          "旧纸",
          "用户研究",
          "笔记本",
          "阅读优先",
          "柔和动效",
        ],
    fonts: ["Caveat", "Lora", "cjk:Ma Shan Zheng", "cjk:Noto Serif SC"],
    scenes: [
      {
        id: 1,
        title: c.s1.title,
        beats: [
          {
            id: 0,
            action: en ? "Open the log" : "翻开日志",
            title: c.s1.title,
            body: c.s1.subtitle,
          },
        ],
      },
      {
        id: 2,
        title: c.s2.title,
        beats: [
          {
            id: 0,
            action: en ? "First notes down" : "先记下前两条",
            title: c.s2.title,
            body: c.s2.items[0],
          },
          {
            id: 1,
            action: en ? "Fill the page" : "记满这一页",
            title: c.s2.title,
            body: c.s2.items[3],
          },
        ],
      },
      {
        id: 3,
        title: c.s3.title,
        beats: [
          {
            id: 0,
            action: en ? "Sketch the desk" : "画下工位",
            title: c.s3.title,
            body: c.s3.finds[0],
          },
          {
            id: 1,
            action: en ? "Mark the pattern" : "标出规律",
            title: c.s3.title,
            body: c.s3.key,
          },
        ],
      },
      {
        id: 4,
        title: c.s4.title,
        beats: [
          {
            id: 0,
            action: en ? "List the behaviors" : "列出行为",
            title: c.s4.title,
            body: c.s4.rows[0].text,
          },
          {
            id: 1,
            action: en ? "Add margin notes" : "补上边注",
            title: c.s4.title,
            body: c.s4.rows[2].note,
          },
        ],
      },
      {
        id: 5,
        title: c.s5.kicker,
        beats: [
          {
            id: 0,
            action: en ? "Close the notebook" : "合上本子",
            title: c.s5.big,
            body: c.s5.body,
          },
        ],
      },
    ],
  };
}

export default ShadowingSupportV3;

export const ShadowingSupportTopic = defineStyleTopic({
  id: "shadowing-support",
  topic: { en: "A Day Shadowing Support", zh: "跟班客服" },
  model: "Claude Opus 4.8",
  component: ShadowingSupportV3,
  getMetadata,
});

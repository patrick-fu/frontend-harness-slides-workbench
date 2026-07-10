import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import { defineStyleTopic } from "./topic";
import SpatialSceneTrack from "./SpatialSceneTrack";
import type { SceneTransitionMap } from "./SpatialSceneTrack";
import { useFLIP } from "../hooks/useFLIP";
import type { BespokeStyleProps, StyleMetadata } from "../types";
import styles from "./make-something-weekly.module.css";

/* ── palette: warm aged stock + 2 spot inks + a muddy overprint ─────────── */
const PAPER = "#ECE2C8"; // warm cream/khaki ground, never white
const INK = "#2B2620"; // warm near-black body ink
const RED = "#E14434"; // spot ink 1 — vermilion, carries emphasis
const BLUE = "#1C4C6B"; // spot ink 2 — teal-blue, carries structure
const OVER = "#5B3A46"; // celebrated muddy overprint where inks meet

const FONT_ID = "riso-zine-v3-fonts";
const FONT_HREF =
  "https://fonts.googleapis.com/css2?family=Anton&family=Caveat:wght@700&family=Work+Sans:wght@400;500;600;700&family=Noto+Sans+SC:wght@400;500;700&display=swap";

function useFonts() {
  useEffect(() => {
    if (typeof document === "undefined") return;
    if (document.getElementById(FONT_ID)) return;
    const link = document.createElement("link");
    link.id = FONT_ID;
    link.rel = "stylesheet";
    link.href = FONT_HREF;
    document.head.appendChild(link);
  }, []);
}

type Lang = "en" | "zh";
const pick = (lang: Lang, en: string, zh: string) => (lang === "en" ? en : zh);

/* ── transitions: EXACT per assignment ──────────────────────────────────── */
const TRANSITIONS: SceneTransitionMap = {
  "1->2": "page-flip",
  "2->3": "hard-cut",
  "3->4": "page-flip",
  "4->5": "hard-cut",
};

/* ── a misregistered word: an outline layer drifts a hair from its fill ──── */
function MisWord({
  text,
  front,
  back,
  size,
}: {
  text: string;
  front: string;
  back: string;
  size: string;
}) {
  return (
    <span className={styles.mis} style={{ fontSize: size }}>
      <span className={styles.misBack} style={{ color: back }} aria-hidden="true">
        {text}
      </span>
      <span className={styles.misFront} style={{ color: front }}>
        {text}
      </span>
    </span>
  );
}

/* ── Scene 1 : the cover ────────────────────────────────────────────────── */
function Cover({ lang }: { lang: Lang; isActive: boolean }) {
  return (
    <div className={styles.scene}>
      <div className={`${styles.cover} ${styles.enter}`}>
        <div className={styles.coverTop}>
          <span className={styles.kicker} style={{ color: BLUE }}>
            {pick(lang, "ISSUE 03 · A ZINE", "第 03 期 · 一本杂志")}
          </span>
          <span className={styles.coverScript} style={{ color: OVER }}>
            {pick(lang, "print it, staple it", "印出来，钉起来")}
          </span>
        </div>

        <div>
          <div style={{ display: "block" }}>
            <MisWord text={pick(lang, "MAKE", "每周")} front={RED} back={BLUE} size="15cqw" />
          </div>
          <div style={{ display: "block", marginTop: "-1cqh" }}>
            <MisWord
              text={pick(lang, "SOMETHING", "做点")}
              front={INK}
              back={RED}
              size="15cqw"
            />
          </div>
          <div style={{ display: "block", marginTop: "-1cqh" }}>
            <MisWord text={pick(lang, "WEEKLY", "东西")} front={BLUE} back={OVER} size="15cqw" />
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
          <span className={styles.coverFoot} style={{ color: INK }}>
            {pick(lang, "52 WEEKS · 52 THINGS", "52 周 · 52 件事")}
          </span>
          <div className={styles.coverBar} style={{ background: RED, transform: "rotate(-1.4deg)" }} />
        </div>
      </div>
    </div>
  );
}

/* ── Scene 2 : the manifesto — motion, loud all-caps + tape strip ───────── */
function Manifesto({
  lang,
  beat,
  isActive,
  frozen,
}: {
  lang: Lang;
  beat: number;
  isActive: boolean;
  frozen: boolean;
}) {
  const { ref } = useFLIP<HTMLDivElement>({
    watch: [beat],
    disabled: frozen || !isActive,
    duration: 480,
    easing: "cubic-bezier(0.34, 1.56, 0.64, 1)",
    selector: '[data-beat-layout-item="true"]',
  });

  return (
    <div className={styles.scene}>
      <div className={styles.manifestoSlab} style={{ background: BLUE, opacity: 0.9 }} />
      <div className={styles.tape} style={{ background: OVER, color: PAPER, opacity: 0.94 }}>
        {pick(lang, "NO EXCUSES", "别找借口")}
      </div>

      <div
        ref={ref}
        className={styles.manifestoStack}
        data-beat-layout-container="true"
        data-beat-layout-mode="motion"
      >
        <div className={styles.manifestoLine} data-beat-layout-item="true" style={{ color: RED }}>
          {pick(lang, "SHIP UGLY.", "先做丑的。")}
        </div>
        <div
          className={styles.manifestoLine2}
          data-beat-layout-item="true"
          style={{ color: INK }}
        >
          {pick(lang, "SHIP OFTEN.", "常常地做。")}
        </div>
        {beat >= 1 && (
          <p className={styles.manifestoBody} data-beat-layout-item="true" style={{ color: INK }}>
            {pick(
              lang,
              "Volume is the teacher. Fifty-two rough issues teach more than one you never print.",
              "数量才是老师。五十二期粗糙的东西，比一期永不付印的更教得会你。",
            )}
          </p>
        )}
      </div>
    </div>
  );
}

/* ── Scene 3 : the method — reserved, three stamped collage panels ──────── */
function Method({ lang, beat }: { lang: Lang; beat: number; isActive: boolean }) {
  const panels = [
    {
      num: "01",
      ink: RED,
      tilt: "-2deg",
      title: pick(lang, "PICK", "选题"),
      body: pick(
        lang,
        "One small idea. Set a timer, not a standard, and let the constraint choose.",
        "一个小点子。定时间，别定标准，让限制替你挑。",
      ),
    },
    {
      num: "02",
      ink: BLUE,
      tilt: "1.4deg",
      title: pick(lang, "MAKE", "动手"),
      body: pick(
        lang,
        "Two hours, hands moving. Trade polish for finished and keep the machine warm.",
        "两小时，手别停。用完成换打磨，让机器一直热着。",
      ),
    },
    {
      num: "03",
      ink: OVER,
      tilt: "-1deg",
      title: pick(lang, "POST", "发布"),
      body: pick(
        lang,
        "Push it out today. Public feedback beats a private draft rotting in a folder.",
        "今天就发出去。公开的反馈，胜过烂在文件夹里的私藏草稿。",
      ),
    },
  ];

  const slab = (color: string): CSSProperties => ({
    position: "absolute",
    inset: 0,
    background: color,
    transform: "translate(0.8cqw, 0.9cqh)",
    zIndex: 0,
  });

  return (
    <div className={styles.scene}>
      <div className={styles.methodHead} style={{ color: INK }}>
        {pick(lang, "THE METHOD", "方法")}
      </div>
      <div
        className={styles.methodRow}
        data-beat-layout-container="true"
        data-beat-layout-mode="reserved"
      >
        {panels.map((p, i) => (
          <div
            key={p.num}
            className={styles.methodPanel}
            data-beat-layout-item="true"
            data-active={beat === i}
            style={{ ["--tilt" as string]: p.tilt } as CSSProperties}
          >
            <div style={slab(p.ink)} />
            <div
              style={{
                position: "relative",
                zIndex: 1,
                height: "100%",
                background: PAPER,
                border: `0.3cqw solid ${INK}`,
                padding: "3cqh 2cqw",
                boxSizing: "border-box",
              }}
            >
              <span
                className={styles.methodStamp}
                style={{ background: p.ink, color: PAPER, border: `0.3cqw solid ${INK}` }}
              >
                {p.num}
              </span>
              <h3 className={styles.methodTitle} style={{ color: p.ink }}>
                {p.title}
              </h3>
              <p className={styles.methodBody} style={{ color: INK }}>
                {p.body}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Scene 4 : the gallery — motion, overlapping samples + hand byline ──── */
function Gallery({
  lang,
  beat,
  isActive,
  frozen,
}: {
  lang: Lang;
  beat: number;
  isActive: boolean;
  frozen: boolean;
}) {
  const { ref } = useFLIP<HTMLDivElement>({
    watch: [beat],
    disabled: frozen || !isActive,
    duration: 480,
    easing: "cubic-bezier(0.34, 1.56, 0.64, 1)",
    selector: '[data-beat-layout-item="true"]',
  });

  const all = [
    { wk: pick(lang, "WK 07", "第07周"), label: pick(lang, "RISO ORANGE", "孔版橙"), ink: RED, tilt: "-3deg" },
    { wk: pick(lang, "WK 19", "第19周"), label: pick(lang, "MUDDY OVERPRINT", "浑浊叠印"), ink: OVER, tilt: "2.5deg" },
    { wk: pick(lang, "WK 33", "第33周"), label: pick(lang, "TEAL PULL", "青色印张"), ink: BLUE, tilt: "-1.5deg" },
    { wk: pick(lang, "WK 48", "第48周"), label: pick(lang, "DOUBLE HIT", "双色套印"), ink: RED, tilt: "3deg" },
  ];
  const shown = all.slice(0, beat >= 1 ? 4 : 2);

  return (
    <div className={styles.scene}>
      <div className={styles.galleryHead} style={{ color: INK }}>
        {pick(lang, "THE GALLERY", "作品墙")}
      </div>
      <div
        ref={ref}
        className={styles.galleryWrap}
        data-beat-layout-container="true"
        data-beat-layout-mode="motion"
      >
        {shown.map((s, i) => (
          <div
            key={s.wk}
            className={styles.sample}
            data-beat-layout-item="true"
            style={
              {
                ["--tilt" as string]: s.tilt,
                marginLeft: i === 0 ? "0cqw" : undefined,
                background: PAPER,
                border: `0.3cqw solid ${INK}`,
              } as CSSProperties
            }
          >
            <span className={styles.sampleTag} style={{ color: s.ink }}>
              {s.wk}
            </span>
            <div className={styles.sampleSwatch} style={{ background: s.ink, opacity: 0.9 }} />
            <span className={styles.sampleLabel} style={{ color: INK }}>
              {s.label}
            </span>
          </div>
        ))}
      </div>
      <span className={styles.byline} style={{ color: OVER }}>
        {pick(lang, "— pulled fresh, still tacky", "— 刚印好，还没干")}
      </span>
    </div>
  );
}

/* ── Scene 5 : the colophon — a stamped back-cover mark ─────────────────── */
function Colophon({ lang }: { lang: Lang; isActive: boolean }) {
  return (
    <div className={styles.scene}>
      <div className={styles.colophon}>
        <div className={styles.seal} style={{ background: RED, color: PAPER, border: `0.6cqw solid ${INK}` }}>
          <span className={styles.sealMark}>MSW</span>
          <span className={styles.sealSub}>{pick(lang, "MAKE SOMETHING WEEKLY", "每周做点东西")}</span>
        </div>
        <div className={`${styles.colTitle} ${styles.enter}`} style={{ color: INK }}>
          {pick(lang, "KEEP MAKING", "继续做下去")}
        </div>
        <div className={styles.colLines} style={{ color: BLUE }}>
          {pick(lang, "PRINTED IN A HURRY · EDITION OF YOU · NO. 52", "匆忙付印 · 限量属于你 · 第 52 号")}
        </div>
        <div className={styles.colScript} style={{ color: OVER }}>
          {pick(lang, "see you next week", "下周见")}
        </div>
      </div>
    </div>
  );
}

/* ── Nav : a stamped page counter that presses to the next page ─────────── */
function PageSeal({
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
  const [pressed, setPressed] = useState(false);
  if (isThumbnail) return null;

  const next = scene >= 5 ? 1 : scene + 1;
  const ink = scene % 2 === 0 ? BLUE : RED;

  return (
    <button
      type="button"
      className={styles.navSeal}
      aria-label={`page ${scene}, press to advance`}
      onClick={(e) => {
        e.stopPropagation();
        setPressed(true);
        onNavigate?.(next, 0);
      }}
    >
      <span
        className={`${styles.navRing} ${pressed ? styles.navPress : ""}`}
        onAnimationEnd={() => setPressed(false)}
        style={{ background: ink, color: PAPER, border: `0.5cqw solid ${INK}` }}
      >
        <span className={styles.navNum}>{scene}</span>
        <span className={styles.navLabel}>{pick(language, "PAGE", "页")}</span>
      </span>
    </button>
  );
}

/* ── Root component ─────────────────────────────────────────────────────── */
function RisoPrintZineV3({
  scene,
  beat,
  language,
  isThumbnail,
  reducedMotion,
  onNavigate,
}: BespokeStyleProps) {
  useFonts();
  const lang: Lang = language === "zh" ? "zh" : "en";
  const frozen = reducedMotion || isThumbnail;

  return (
    <div className={styles.root} style={{ background: PAPER, color: INK }} data-reduced={frozen}>
      <SpatialSceneTrack
        scene={scene}
        beat={beat}
        transitionKind="page-flip"
        transitionMap={TRANSITIONS}
        reducedMotion={reducedMotion || isThumbnail}
        beatLayoutModes={{ 2: "motion", 3: "reserved", 4: "motion" }}
        renderScene={(sceneId, sceneBeat, isActive) => {
          switch (sceneId) {
            case 1:
              return <Cover lang={lang} isActive={isActive} />;
            case 2:
              return <Manifesto lang={lang} beat={sceneBeat} isActive={isActive} frozen={frozen} />;
            case 3:
              return <Method lang={lang} beat={sceneBeat} isActive={isActive} />;
            case 4:
              return <Gallery lang={lang} beat={sceneBeat} isActive={isActive} frozen={frozen} />;
            case 5:
              return <Colophon lang={lang} isActive={isActive} />;
            default:
              return null;
          }
        }}
      />
      <div className={styles.grain} aria-hidden="true" />
      <PageSeal scene={scene} language={lang} isThumbnail={isThumbnail} onNavigate={onNavigate} />
    </div>
  );
}

/* ── Metadata — en / zh built from one shape to stay structurally identical ─ */
type BeatCopy = { action: string; title: string; body: string };
type SceneCopy = { title: string; beats: BeatCopy[] };
type Copy = { theme: string; densityLabel: string; scenes: SceneCopy[] };

const COPY: Record<Lang, Copy> = {
  en: {
    theme: "Make Something Weekly",
    densityLabel: "Medium-high collage",
    scenes: [
      {
        title: "The Cover",
        beats: [
          {
            action: "Pull the print",
            title: "Make Something Weekly",
            body: "Issue 03 of a zine about the habit of showing up and making one small thing every week.",
          },
        ],
      },
      {
        title: "The Manifesto",
        beats: [
          {
            action: "Read it loud",
            title: "Ship Ugly",
            body: "The first rule, stamped in ink: a finished ugly thing beats a perfect idea stuck in your head.",
          },
          {
            action: "Then the reason",
            title: "Ship Often",
            body: "Volume is the teacher. Fifty-two rough issues teach more than one you never print.",
          },
        ],
      },
      {
        title: "The Method",
        beats: [
          {
            action: "Stamp step one",
            title: "Pick",
            body: "One small idea. Set a timer, not a standard, and let the constraint choose for you.",
          },
          {
            action: "Stamp step two",
            title: "Make",
            body: "Two hours, hands moving. Trade polish for finished and keep the machine warm.",
          },
          {
            action: "Stamp step three",
            title: "Post",
            body: "Push it out today. Public feedback beats a private draft rotting in a folder.",
          },
        ],
      },
      {
        title: "The Gallery",
        beats: [
          {
            action: "Tack up two",
            title: "Fresh Pulls",
            body: "Early samples off the drum — orange on cream, still tacky, edges out of register.",
          },
          {
            action: "Fill the wall",
            title: "Overprint Wall",
            body: "Weeks pile up and overlap: muddy overprints, teal double-hits, a growing wall of proof.",
          },
        ],
      },
      {
        title: "The Colophon",
        beats: [
          {
            action: "Press the seal",
            title: "Keep Making",
            body: "Back cover mark: printed in a hurry, edition of you, number fifty-two. See you next week.",
          },
        ],
      },
    ],
  },
  zh: {
    theme: "每周做点",
    densityLabel: "中高密度拼贴",
    scenes: [
      {
        title: "封面",
        beats: [
          {
            action: "揭下印张",
            title: "每周做点",
            body: "第 03 期，一本关于坚持露面、每周做出一件小东西的杂志。",
          },
        ],
      },
      {
        title: "宣言",
        beats: [
          {
            action: "大声念",
            title: "先做丑的",
            body: "第一条，用墨盖章：一件做完的丑东西，胜过脑子里那个完美却卡住的点子。",
          },
          {
            action: "再说理由",
            title: "常常地做",
            body: "数量才是老师。五十二期粗糙的东西，比一期永不付印的更教得会你。",
          },
        ],
      },
      {
        title: "方法",
        beats: [
          {
            action: "盖第一章",
            title: "选题",
            body: "一个小点子。定时间，别定标准，让限制替你挑。",
          },
          {
            action: "盖第二章",
            title: "动手",
            body: "两小时，手别停。用完成换打磨，让机器一直热着。",
          },
          {
            action: "盖第三章",
            title: "发布",
            body: "今天就发出去。公开的反馈，胜过烂在文件夹里的私藏草稿。",
          },
        ],
      },
      {
        title: "作品墙",
        beats: [
          {
            action: "先钉两张",
            title: "新鲜印张",
            body: "刚从滚筒下来的样张——橙压在米色上，还没干，边缘没对准。",
          },
          {
            action: "铺满整墙",
            title: "叠印之墙",
            body: "周数越堆越多、层层交叠：浑浊的叠印、青色的双压，一整墙的证据。",
          },
        ],
      },
      {
        title: "版权页",
        beats: [
          {
            action: "盖下印章",
            title: "继续做下去",
            body: "封底印记：匆忙付印，限量属于你，第五十二号。下周见。",
          },
        ],
      },
    ],
  },
};

export function getMetadata(lang: Lang): StyleMetadata {
  const copy = COPY[lang];
  return {
    id: "riso-print-zine",
    band: "editorial-print",
    name: "Riso Print Zine",
    theme: copy.theme,
    densityLabel: copy.densityLabel,
    heroScene: 1,
    colors: { bg: PAPER, ink: INK, panel: RED },
    typography: { header: "Anton", body: "Work Sans" },
    tags:
      lang === "en"
        ? ["warm", "scrappy", "handmade", "risograph", "two-ink", "print-registration"]
        : ["温暖", "手作", "粗粝", "孔版印刷", "双色", "套印偏移"],
    fonts: ["Anton", "Caveat", "Work Sans", "cjk:Noto Sans SC"],
    scenes: copy.scenes.map((s, si) => ({
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

export const makeSomethingWeeklyTopic = defineStyleTopic({
  id: "make-something-weekly",
  topic: { en: "Make Something Weekly", zh: "每周做点" },
  model: "Claude-Opus-4.8",
  component: RisoPrintZineV3,
  getMetadata,
});

export default RisoPrintZineV3;

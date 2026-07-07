import { useEffect } from "react";
import type { CSSProperties } from "react";
import type { BespokeStyleProps, StyleMetadata } from "../types";
import { useFLIP } from "../hooks/useFLIP";
import SpatialSceneTrack from "./SpatialSceneTrack";
import type { BeatLayoutMode, SceneTransitionMap } from "./SpatialSceneTrack";
import { defineStyleVersion } from "./version";
import styles from "./21-public-light-program-v2.module.css";

type Language = "en" | "zh";
type SceneId = 1 | 2 | 3 | 4 | 5;

interface BeatCopy {
  id: number;
  action: string;
  title: string;
  body: string;
}

interface SceneCopy {
  title: string;
  shortTitle: string;
  eyebrow: string;
  subtitle: string;
  body: string;
  mono: string;
  footnote: string;
  beats: BeatCopy[];
  points: string[];
}

type CustomStyle = CSSProperties & Record<`--${string}`, string>;

const SCENE_IDS: SceneId[] = [1, 2, 3, 4, 5];

const TRANSITION_MAP: SceneTransitionMap = {
  "1->2": "scale-fade",
  "2->3": "wipe",
  "3->4": "slide-x",
  "4->5": "fade",
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
      title: "Public Light Program",
      shortTitle: "Poster",
      eyebrow: "Solar Biennale 04 / Public Works",
      subtitle: "A citywide poster for daylight as shared infrastructure.",
      body: "Five temporary installations turn noon, shade, wall-glow, and afterlight into a public program.",
      mono: "SB-04 / 21.06-21.09 / 43.296 N",
      footnote: "Opening poster issued at civic scale.",
      points: ["Noon commons", "West wall afterlight", "Roof reflector"],
      beats: [
        {
          id: 0,
          action: "Poster field appears",
          title: "Public Light Program",
          body: "A biennale poster opens the civic light brief.",
        },
        {
          id: 1,
          action: "Program premise enters",
          title: "Daylight becomes infrastructure",
          body: "The program treats sunlight as a public work, not a backdrop.",
        },
        {
          id: 2,
          action: "Civic ledger completes",
          title: "Five works, one shared noon",
          body: "Dates, coordinates, and access notes complete the printed sheet.",
        },
      ],
    },
    zh: {
      title: "公共光计划",
      shortTitle: "海报",
      eyebrow: "太阳双年展 04 / 公共作品",
      subtitle: "把日光作为共享基础设施的城市海报。",
      body: "五处临时装置把正午、阴影、墙面余光和日落之后的停留编成公共项目。",
      mono: "SB-04 / 06.21-09.21 / 北纬 43.296",
      footnote: "开幕海报以城市尺度发布。",
      points: ["正午公共域", "西墙余光", "屋顶反射器"],
      beats: [
        {
          id: 0,
          action: "海报场域出现",
          title: "公共光计划",
          body: "一张双年展海报打开城市光线命题。",
        },
        {
          id: 1,
          action: "项目命题进入",
          title: "日光成为基础设施",
          body: "项目把阳光视为公共工程，而非背景。",
        },
        {
          id: 2,
          action: "城市台账完成",
          title: "五件作品，共享一个正午",
          body: "日期、坐标与通达说明补全印刷版面。",
        },
      ],
    },
  },
  2: {
    en: {
      title: "Installation Map",
      shortTitle: "Map",
      eyebrow: "Distributed Works / Solar Index",
      subtitle: "A map arranged by the hour each surface becomes public.",
      body: "The program is read as an orbit: library roof, market canopy, school wall, quay mirror, and archive court.",
      mono: "MAP / AZIMUTH 118-271 / WALKABLE",
      footnote: "Nodes are sequenced by light, not by district.",
      points: ["Library roof", "Market canopy", "School wall", "Quay mirror", "Archive court"],
      beats: [
        {
          id: 0,
          action: "Solar map lands",
          title: "Map by incident light",
          body: "The city is organized by where light arrives first.",
        },
        {
          id: 1,
          action: "Installations appear",
          title: "Five public works enter orbit",
          body: "Each node names a different civic surface.",
        },
        {
          id: 2,
          action: "Access key enters",
          title: "The route stays walkable",
          body: "Hours and distances make the map usable without becoming a dashboard.",
        },
      ],
    },
    zh: {
      title: "装置地图",
      shortTitle: "地图",
      eyebrow: "分布式作品 / 太阳索引",
      subtitle: "地图按每个表面变成公共场所的时刻来排列。",
      body: "项目被读成一条轨道：图书馆屋顶、市场篷顶、学校墙面、码头镜面与档案庭院。",
      mono: "MAP / 方位角 118-271 / 可步行",
      footnote: "节点按光线排序，而非按行政片区排序。",
      points: ["图书馆屋顶", "市场篷顶", "学校墙面", "码头镜面", "档案庭院"],
      beats: [
        {
          id: 0,
          action: "太阳地图落版",
          title: "按入射光制图",
          body: "城市由光先抵达的位置组织起来。",
        },
        {
          id: 1,
          action: "装置节点出现",
          title: "五件公共作品进入轨道",
          body: "每个节点命名一种不同的城市表面。",
        },
        {
          id: 2,
          action: "通达索引进入",
          title: "路线保持可步行",
          body: "时间与距离让地图可用，但不滑向仪表盘。",
        },
      ],
    },
  },
  3: {
    en: {
      title: "Visitor Path",
      shortTitle: "Path",
      eyebrow: "Walking Score / 12:10-18:40",
      subtitle: "The visitor follows warmth, glare, shade, reflection, and pause.",
      body: "A slow path turns the poster into a score for bodies moving through light.",
      mono: "PATH / 4.8 KM / 92 MIN / LOW SPEED",
      footnote: "Each stop is timed to a change in solar angle.",
      points: ["Enter at noon", "Cross the canopy", "Hold at the wall", "Turn by the quay", "Close in afterlight"],
      beats: [
        {
          id: 0,
          action: "Entrance mark appears",
          title: "Begin where the ground is brightest",
          body: "The first mark asks visitors to slow before the route begins.",
        },
        {
          id: 1,
          action: "Middle stops extend",
          title: "The path bends through shade",
          body: "Canopy, wall, and quay each change the body at a different tempo.",
        },
        {
          id: 2,
          action: "Return path completes",
          title: "Afterlight becomes the exit",
          body: "The close is not a door; it is a cooling surface.",
        },
      ],
    },
    zh: {
      title: "观众路径",
      shortTitle: "路径",
      eyebrow: "步行谱 / 12:10-18:40",
      subtitle: "观众跟随温度、眩光、阴影、反射与停顿前进。",
      body: "一条缓慢路径把海报变成身体穿过光线的乐谱。",
      mono: "PATH / 4.8 公里 / 92 分钟 / 低速",
      footnote: "每一站都对应一次太阳角度的变化。",
      points: ["正午进入", "穿过篷顶", "停在墙面", "沿码头转向", "在余光中闭合"],
      beats: [
        {
          id: 0,
          action: "入口标记出现",
          title: "从最亮的地面开始",
          body: "第一处标记要求观众在路线开始前先慢下来。",
        },
        {
          id: 1,
          action: "中段站点展开",
          title: "路径弯入阴影",
          body: "篷顶、墙面与码头以不同节奏改变身体。",
        },
        {
          id: 2,
          action: "回返路径完成",
          title: "余光成为出口",
          body: "闭幕不是一扇门，而是一块逐渐冷却的表面。",
        },
      ],
    },
  },
  4: {
    en: {
      title: "Critique",
      shortTitle: "Critique",
      eyebrow: "Public Review / Shade Has Politics",
      subtitle: "The program asks who receives warmth, who receives glare, and who gets to remain.",
      body: "A beautiful light program is incomplete unless it also measures shelter, care, and access.",
      mono: "CRIT / THREE AMENDMENTS / OPEN MINUTES",
      footnote: "The poster accepts critique as part of the exhibition.",
      points: ["Glare is not neutral", "Shade is a right", "Access is maintenance"],
      beats: [
        {
          id: 0,
          action: "Critique question opens",
          title: "Who gets the shade?",
          body: "The review begins with the civic cost of sunlight.",
        },
        {
          id: 1,
          action: "Counter-notes enter",
          title: "Beauty needs maintenance",
          body: "Care, seating, and repair are folded back into the program.",
        },
        {
          id: 2,
          action: "Amended promise resolves",
          title: "The light stays public only when access stays public",
          body: "The critique changes the closing terms.",
        },
      ],
    },
    zh: {
      title: "批评",
      shortTitle: "批评",
      eyebrow: "公共评议 / 阴影具有政治性",
      subtitle: "项目追问谁得到温度，谁承受眩光，又是谁可以留下。",
      body: "一个漂亮的光计划若不同时衡量遮蔽、照护与通达，就仍未完成。",
      mono: "CRIT / 三项修订 / 公开纪要",
      footnote: "海报把批评接纳为展览的一部分。",
      points: ["眩光并不中立", "阴影是一种权利", "通达需要维护"],
      beats: [
        {
          id: 0,
          action: "批评问题打开",
          title: "谁拥有阴影？",
          body: "评议从日光的公共代价开始。",
        },
        {
          id: 1,
          action: "反向注释进入",
          title: "美需要维护",
          body: "照护、座椅与修复被折回项目内部。",
        },
        {
          id: 2,
          action: "修订承诺落定",
          title: "只有通达保持公共，光才保持公共",
          body: "批评改变了闭幕条件。",
        },
      ],
    },
  },
  5: {
    en: {
      title: "Exhibition Close",
      shortTitle: "Close",
      eyebrow: "Closing Sheet / Archive of Warmth",
      subtitle: "The exhibition closes at sunset; the public claim remains on the wall.",
      body: "What is temporary is the installation. What remains is a way to notice civic light.",
      mono: "CLOSE / 21 SEP / 18:52 / FREE ENTRY",
      footnote: "Final sheet filed with the municipal light archive.",
      points: ["Remove fixtures", "Keep route notes", "Publish shade repairs"],
      beats: [
        {
          id: 0,
          action: "Closing sheet appears",
          title: "The exhibition closes at sunset",
          body: "The last poster is quieter than the opening sheet.",
        },
        {
          id: 1,
          action: "Public claim remains",
          title: "The light stays public",
          body: "The program leaves behind a language for shared daylight.",
        },
        {
          id: 2,
          action: "Archive number resolves",
          title: "A warm record is filed",
          body: "The close becomes a civic maintenance note.",
        },
      ],
    },
    zh: {
      title: "展览闭幕",
      shortTitle: "闭幕",
      eyebrow: "闭幕页 / 温度档案",
      subtitle: "展览在日落闭幕；公共主张仍留在墙面上。",
      body: "临时的是装置。留下的是一种重新注意城市光线的方法。",
      mono: "CLOSE / 09.21 / 18:52 / 免费入场",
      footnote: "最终页归入市政光线档案。",
      points: ["撤除构件", "保留路线注释", "发布阴影修复"],
      beats: [
        {
          id: 0,
          action: "闭幕页出现",
          title: "展览在日落闭幕",
          body: "最后一张海报比开幕页更安静。",
        },
        {
          id: 1,
          action: "公共主张留下",
          title: "光仍属于公共",
          body: "项目留下关于共享日光的语言。",
        },
        {
          id: 2,
          action: "档案编号落定",
          title: "一份温暖记录归档",
          body: "闭幕转化为一条城市维护注释。",
        },
      ],
    },
  },
};

const MAP_POSITIONS = [
  { x: 50, y: 15, labelX: "50%", labelY: "9%" },
  { x: 78, y: 35, labelX: "84%", labelY: "34%" },
  { x: 67, y: 72, labelX: "78%", labelY: "76%" },
  { x: 30, y: 76, labelX: "22%", labelY: "79%" },
  { x: 18, y: 38, labelX: "13%", labelY: "35%" },
];

function useFonts() {
  useEffect(() => {
    const id = "style-21-public-light-program-v2-fonts";
    if (document.getElementById(id)) return;

    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600&family=IBM+Plex+Mono:wght@400;500&family=Manrope:wght@500;700;800&family=Noto+Sans+SC:wght@500;700;800&family=Noto+Serif+SC:wght@500;600&display=swap";
    document.head.appendChild(link);
  }, []);
}

function isSceneId(scene: number): scene is SceneId {
  return SCENE_IDS.includes(scene as SceneId);
}

function getVisibleBeat(sceneId: SceneId, beat: number, isThumbnail: boolean) {
  const maxBeat = SCENES[sceneId].en.beats.length - 1;
  if (isThumbnail) return maxBeat;
  return Math.min(Math.max(beat, 0), maxBeat);
}

function getMetadata(language: Language): StyleMetadata {
  return {
    id: "21",
    band: "editorial-print",
    name: language === "zh" ? "太阳双年展海报" : "Solar Biennale Poster",
    theme: language === "zh" ? "公共光计划" : "Public Light Program",
    densityLabel: language === "zh" ? "海报式" : "Poster-led",
    heroScene: 1,
    colors: {
      bg: "#f5e5ba",
      ink: "#17204a",
      panel: "#edca56",
    },
    typography: {
      header: "Cormorant Garamond 600",
      body: "Manrope 500",
    },
    tags: ["editorial", "poster", "biennale", "solar", "print", "warm"],
    fonts: [
      "Cormorant Garamond",
      "Manrope",
      "IBM Plex Mono",
      "cjk:Noto Serif SC",
      "cjk:Noto Sans SC",
    ],
    scenes: SCENE_IDS.map((sceneId) => {
      const copy = SCENES[sceneId][language];
      return {
        id: sceneId,
        title: copy.shortTitle,
        beats: copy.beats.map((beat) => ({ ...beat })),
      };
    }),
  };
}

function BeatTicks({
  total,
  activeBeat,
}: {
  total: number;
  activeBeat: number;
}) {
  return (
    <div className={styles.beatTicks} aria-hidden="true">
      {Array.from({ length: total }, (_, index) => (
        <span
          key={index}
          data-beat-marker="true"
          className={[
            styles.beatTick,
            index <= activeBeat ? styles.beatTickActive : "",
          ]
            .filter(Boolean)
            .join(" ")}
        />
      ))}
    </div>
  );
}

function SolarOrbitNav({
  language,
  scene,
  onNavigate,
}: {
  language: Language;
  scene: number;
  onNavigate?: (scene: number, beat: number) => void;
}) {
  return (
    <nav
      className={styles.orbitNav}
      aria-label={language === "zh" ? "太阳轨道场景导航" : "Solar orbit scene navigation"}
    >
      <div className={styles.orbitRule} aria-hidden="true" />
      {SCENE_IDS.map((sceneId, index) => {
        const copy = SCENES[sceneId][language];
        return (
          <button
            key={sceneId}
            type="button"
            className={[
              styles.orbitButton,
              sceneId === scene ? styles.orbitButtonActive : "",
            ]
              .filter(Boolean)
              .join(" ")}
            style={{ "--angle": `${index * 72 - 90}deg` } as CustomStyle}
            aria-label={copy.shortTitle}
            aria-current={sceneId === scene ? "step" : undefined}
            onClick={() => onNavigate?.(sceneId, 0)}
          >
            <span className={styles.orbitTick} />
          </button>
        );
      })}
    </nav>
  );
}

function ScenePanel({
  sceneId,
  beat,
  language,
  isActive,
  isThumbnail,
  reduceMotion,
}: {
  sceneId: SceneId;
  beat: number;
  language: Language;
  isActive: boolean;
  isThumbnail: boolean;
  reduceMotion: boolean;
}) {
  const copy = SCENES[sceneId][language];
  const visibleBeat = getVisibleBeat(sceneId, beat, isThumbnail);
  const { ref } = useFLIP<HTMLDivElement>({
    watch: [sceneId, visibleBeat, language],
    selector: '[data-beat-layout-item="true"]',
    disabled: reduceMotion || !isActive,
    duration: 620,
    easing: "cubic-bezier(0.16, 1, 0.3, 1)",
  });

  return (
    <section
      className={[
        styles.scene,
        sceneId === 1 ? styles.posterScene : "",
        sceneId === 2 ? styles.mapScene : "",
        sceneId === 3 ? styles.pathScene : "",
        sceneId === 4 ? styles.critiqueScene : "",
        sceneId === 5 ? styles.closeScene : "",
      ]
        .filter(Boolean)
        .join(" ")}
      aria-label={copy.title}
    >
      <div
        ref={ref}
        className={styles.sceneBody}
        data-beat-layout-container="true"
        data-beat-layout-mode="motion"
      >
        {sceneId === 1 && <PosterScene copy={copy} beat={visibleBeat} />}
        {sceneId === 2 && <MapScene copy={copy} beat={visibleBeat} />}
        {sceneId === 3 && <PathScene copy={copy} beat={visibleBeat} />}
        {sceneId === 4 && <CritiqueScene copy={copy} beat={visibleBeat} />}
        {sceneId === 5 && <CloseScene copy={copy} beat={visibleBeat} />}
      </div>
      <BeatTicks total={copy.beats.length} activeBeat={visibleBeat} />
      <p className={[styles.mono, styles.folio].join(" ")} aria-hidden="true">
        {`21 / 0${sceneId}`}
      </p>
    </section>
  );
}

function PosterScene({ copy, beat }: { copy: SceneCopy; beat: number }) {
  return (
    <>
      <div className={styles.yellowColumn} aria-hidden="true" />
      <header
        className={[styles.posterHeader, styles.motionItem].join(" ")}
        data-beat-layout-item="true"
      >
        <p className={styles.eyebrow}>{copy.eyebrow}</p>
        <div className={styles.rule} />
      </header>
      <div
        className={[styles.posterTitleBlock, styles.motionItem].join(" ")}
        data-beat-layout-item="true"
        style={{ "--delay": "80ms" } as CustomStyle}
      >
        <h1 className={[styles.display, styles.posterTitle].join(" ")}>
          {copy.title}
        </h1>
        {beat >= 1 && <p className={styles.bodyCopy}>{copy.subtitle}</p>}
      </div>
      {beat >= 2 && (
        <aside
          className={[styles.posterAside, styles.motionItem].join(" ")}
          data-beat-layout-item="true"
          style={{ "--delay": "120ms" } as CustomStyle}
        >
          <p className={styles.mono}>{copy.mono}</p>
          <div className={styles.posterLedger}>
            {copy.points.map((point) => (
              <p key={point} className={styles.smallCopy}>
                {point}
              </p>
            ))}
          </div>
        </aside>
      )}
      <footer
        className={[styles.posterFooter, styles.motionItem].join(" ")}
        data-beat-layout-item="true"
      >
        <p className={styles.mono}>{copy.footnote}</p>
      </footer>
    </>
  );
}

function MapScene({ copy, beat }: { copy: SceneCopy; beat: number }) {
  return (
    <>
      <div className={styles.mapIntro} data-beat-layout-item="true">
        <p className={[styles.eyebrow, styles.motionItem].join(" ")}>
          {copy.eyebrow}
        </p>
        <h1 className={[styles.display, styles.mapTitle, styles.motionItem].join(" ")}>
          {copy.title}
        </h1>
        {beat >= 1 && (
          <p className={[styles.bodyCopy, styles.motionItem].join(" ")}>
            {copy.subtitle}
          </p>
        )}
      </div>
      <div className={styles.mapCanvas} data-beat-layout-item="true">
        <svg
          className={styles.mapSvg}
          viewBox="0 0 100 100"
          role="img"
          aria-label={copy.title}
        >
          <circle cx="50" cy="50" r="34" fill="rgba(242, 197, 54, 0.22)" />
          <circle
            cx="50"
            cy="50"
            r="24"
            fill="none"
            stroke="rgba(23, 32, 74, 0.52)"
            strokeWidth="0.35"
          />
          <path
            d="M50 15 C80 25 83 58 67 72 C49 90 20 78 18 38 C18 23 33 13 50 15"
            fill="none"
            stroke="rgba(23, 32, 74, 0.78)"
            strokeWidth="0.45"
          />
          {beat >= 1 &&
            MAP_POSITIONS.map((point, index) => (
              <g key={index}>
                <line
                  x1="50"
                  y1="50"
                  x2={point.x}
                  y2={point.y}
                  stroke="rgba(23, 32, 74, 0.32)"
                  strokeWidth="0.22"
                />
                <circle
                  cx={point.x}
                  cy={point.y}
                  r={index === 0 ? "2.9" : "2.15"}
                  fill="#17204a"
                />
                <circle
                  cx={point.x}
                  cy={point.y}
                  r="4.8"
                  fill="none"
                  stroke="rgba(242, 197, 54, 0.92)"
                  strokeWidth="0.75"
                />
              </g>
            ))}
        </svg>
        {beat >= 2 &&
          MAP_POSITIONS.map((point, index) => (
            <div
              key={copy.points[index]}
              className={[styles.mapLabel, styles.motionItem].join(" ")}
              style={
                {
                  left: point.labelX,
                  top: point.labelY,
                  "--delay": `${index * 90}ms`,
                } as CustomStyle
              }
            >
              <strong>{`0${index + 1}`}</strong>
              <span>{copy.points[index]}</span>
            </div>
          ))}
      </div>
      {beat >= 2 && (
        <footer className={styles.mapFooter} data-beat-layout-item="true">
          <p className={styles.mono}>{copy.mono}</p>
          <p className={styles.smallCopy}>{copy.footnote}</p>
        </footer>
      )}
    </>
  );
}

function PathScene({ copy, beat }: { copy: SceneCopy; beat: number }) {
  const visibleStops = beat === 0 ? 1 : beat === 1 ? 4 : 5;

  return (
    <>
      <header className={styles.pathTop} data-beat-layout-item="true">
        <div className={styles.motionItem}>
          <p className={styles.eyebrow}>{copy.eyebrow}</p>
          <h1 className={[styles.display, styles.pathTitle].join(" ")}>
            {copy.title}
          </h1>
        </div>
        <p className={[styles.bodyCopy, styles.motionItem].join(" ")}>
          {beat >= 1 ? copy.subtitle : copy.beats[0].body}
        </p>
      </header>
      <div className={styles.pathRail} data-beat-layout-item="true">
        {copy.points.slice(0, visibleStops).map((point, index) => (
          <article
            key={point}
            className={[styles.pathStop, styles.motionItem].join(" ")}
            style={{ "--delay": `${index * 80}ms` } as CustomStyle}
          >
            <span className={styles.stopIndex}>{`0${index + 1}`}</span>
            <strong className={styles.stopName}>{point}</strong>
            <span className={styles.stopTime}>
              {index === 0 ? "12:10" : index === 1 ? "13:35" : index === 2 ? "15:20" : index === 3 ? "17:05" : "18:40"}
            </span>
          </article>
        ))}
      </div>
      <footer className={styles.pathFooter} data-beat-layout-item="true">
        <p className={styles.mono}>{copy.mono}</p>
        {beat >= 2 && <p className={styles.smallCopy}>{copy.footnote}</p>}
      </footer>
    </>
  );
}

function CritiqueScene({ copy, beat }: { copy: SceneCopy; beat: number }) {
  const visibleNotes = beat === 0 ? 1 : beat === 1 ? 2 : 3;

  return (
    <>
      <main className={styles.critiqueMain} data-beat-layout-item="true">
        <p className={[styles.eyebrow, styles.motionItem].join(" ")}>
          {copy.eyebrow}
        </p>
        <h1 className={[styles.display, styles.critiqueTitle, styles.motionItem].join(" ")}>
          {beat >= 2 ? copy.beats[2].title : copy.beats[0].title}
        </h1>
        <p className={[styles.bodyCopy, styles.motionItem].join(" ")}>
          {beat >= 1 ? copy.body : copy.subtitle}
        </p>
      </main>
      <aside className={styles.critiqueNotes} data-beat-layout-item="true">
        {copy.points.slice(0, visibleNotes).map((point, index) => (
          <section
            key={point}
            className={[styles.critiqueNote, styles.motionItem].join(" ")}
            style={{ "--delay": `${index * 100}ms` } as CustomStyle}
          >
            <p className={styles.mono}>{`0${index + 1} / NOTE`}</p>
            <h2 className={styles.critiqueNoteTitle}>{point}</h2>
            <p className={styles.smallCopy}>{copy.beats[Math.min(index, 2)].body}</p>
          </section>
        ))}
      </aside>
    </>
  );
}

function CloseScene({ copy, beat }: { copy: SceneCopy; beat: number }) {
  return (
    <>
      <div className={styles.closeFlood} aria-hidden="true" />
      <section className={styles.closeStatement} data-beat-layout-item="true">
        <p className={[styles.eyebrow, styles.motionItem].join(" ")}>
          {copy.eyebrow}
        </p>
        <h1 className={[styles.display, styles.closeTitle, styles.motionItem].join(" ")}>
          {beat >= 1 ? copy.beats[1].title : copy.beats[0].title}
        </h1>
        {beat >= 1 && (
          <p className={[styles.bodyCopy, styles.motionItem].join(" ")}>
            {copy.body}
          </p>
        )}
      </section>
      {beat >= 2 && (
        <aside className={styles.closeAside} data-beat-layout-item="true">
          <p className={[styles.mono, styles.motionItem].join(" ")}>{copy.mono}</p>
          {copy.points.map((point, index) => (
            <p
              key={point}
              className={[styles.smallCopy, styles.motionItem].join(" ")}
              style={{ "--delay": `${index * 80}ms` } as CustomStyle}
            >
              {point}
            </p>
          ))}
        </aside>
      )}
      <footer className={styles.closeFooter} data-beat-layout-item="true">
        <p className={styles.mono}>{copy.footnote}</p>
      </footer>
    </>
  );
}

export default function PublicLightProgramV2({
  scene,
  beat,
  language,
  isThumbnail,
  reducedMotion,
  onNavigate,
}: BespokeStyleProps) {
  useFonts();

  const reduceMotion = reducedMotion || isThumbnail;
  const activeScene = isSceneId(scene) ? scene : 1;

  return (
    <div
      className={styles.root}
      data-reduced-motion={reduceMotion ? "true" : "false"}
      data-thumbnail={isThumbnail ? "true" : "false"}
    >
      <SpatialSceneTrack
        scene={activeScene}
        beat={beat}
        sceneIds={SCENE_IDS}
        transitionKind="scale-fade"
        transitionMap={TRANSITION_MAP}
        transitionDurationMs={760}
        reducedMotion={reduceMotion}
        beatLayoutModes={BEAT_LAYOUT_MODES}
        className={styles.track}
        renderScene={(sceneId, sceneBeat, isActive) => (
          <ScenePanel
            sceneId={isSceneId(sceneId) ? sceneId : 1}
            beat={sceneBeat}
            language={language}
            isActive={isActive}
            isThumbnail={isThumbnail}
            reduceMotion={reduceMotion}
          />
        )}
      />
      {!isThumbnail && (
        <SolarOrbitNav
          language={language}
          scene={activeScene}
          onNavigate={onNavigate}
        />
      )}
    </div>
  );
}

export { getMetadata };

export const publicLightProgramV2Version = defineStyleVersion({
  id: "v2",
  topic: {
    en: "Public Light",
    zh: "公共灯光",
  },
  model: "GPT-5.5",
  component: PublicLightProgramV2,
  getMetadata,
});

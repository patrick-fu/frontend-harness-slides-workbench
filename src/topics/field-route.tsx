import { useEffect } from "react";
import {
  defineTopic,
  type TopicMetadata,
  type TopicNavigation,
  type TopicStageProps,
  type TopicTransitionScore,
} from "../domain/topic";
import { useFLIP } from "../hooks/useFLIP";
import SpatialSceneTrack from "../components/stage/SpatialSceneTrack";
import type {
  BeatLayoutMode,
  SceneTransitionMap,
} from "../components/stage/SpatialSceneTrack";
import styles from "./field-route.module.css";

type Lang = "en" | "zh";
type SceneId = 1 | 2 | 3 | 4 | 5;

interface BeatCopy {
  action: string;
  title: string;
  body: string;
}

interface SceneCopy {
  eyebrow: string;
  navLabel: string;
  title: string;
  subtitle: string;
  coordinate: string;
  marker: string;
  routeNote: string;
  terrainNote: string;
  details: string[];
  stamp: string;
  beats: BeatCopy[];
}

const SCENE_IDS: SceneId[] = [1, 2, 3, 4, 5];

const TRANSITION_SCORE = {
  "1->2": "slide-x",
  "2->3": "wipe",
  "3->4": "fade",
  "4->5": "scale-fade",
} as const satisfies TopicTransitionScore;

const TRANSITION_MAP: SceneTransitionMap = TRANSITION_SCORE;

const NAVIGATION = {
  geometry: "path",
  carrier: "field-route-coordinate-rail",
  invocation: "persistent",
  feedback: "active-glow",
} as const satisfies TopicNavigation;

const BEAT_LAYOUT_MODES: Record<number, BeatLayoutMode> = {
  1: "motion",
  2: "motion",
  3: "motion",
  4: "motion",
  5: "motion",
};

const COPY: Record<Lang, Record<SceneId, SceneCopy>> = {
  en: {
    1: {
      eyebrow: "FIELD ROUTE",
      navLabel: "Trailhead",
      title: "TRAILHEAD",
      subtitle: "Begin where the ridge cuts the relay line.",
      coordinate: "N 40.71 / W 108.26",
      marker: "START",
      routeNote: "Pack the question before the climb.",
      terrainNote: "Sand bench, pine shade, first cairn.",
      details: ["Set bearing", "Log first cairn", "Leave the road"],
      stamp: "Route open",
      beats: [
        {
          action: "Trailhead poster locks to the first coordinate",
          title: "Trailhead",
          body: "The route starts with one public promise and one marked bearing.",
        },
        {
          action: "Bearing marks rise from the ground plane",
          title: "Bearing set",
          body: "The field team marks a first cairn before the map gains detail.",
        },
        {
          action: "Departure note settles into the print",
          title: "Road left behind",
          body: "The last paved edge drops away; the signal path becomes visible.",
        },
      ],
    },
    2: {
      eyebrow: "MAP LEGS",
      navLabel: "Map legs",
      title: "THREE LEGS NORTH",
      subtitle: "A route becomes useful when every turn earns its ink.",
      coordinate: "N 40.96 / W 108.04",
      marker: "LEG 02",
      routeNote: "Ridge, wash, and tower draw one broken line.",
      terrainNote: "Contour intervals tighten near the relay basin.",
      details: ["Ridge traverse", "Dry wash crossing", "Tower approach"],
      stamp: "Map locked",
      beats: [
        {
          action: "Contour field appears as a flat ink plate",
          title: "Map field",
          body: "The first plate names the terrain without pretending to be exact.",
        },
        {
          action: "Three route legs connect through the basin",
          title: "Legs joined",
          body: "Each segment has a job: gain height, cross the wash, reach the tower.",
        },
        {
          action: "Relay coordinate is marked on the last leg",
          title: "Coordinate marked",
          body: "The final turn is no longer guesswork; it has a printed bearing.",
        },
      ],
    },
    3: {
      eyebrow: "WEATHER WINDOW",
      navLabel: "Weather",
      title: "HOLD FOR WEATHER",
      subtitle: "Cloud cover is not noise; it is the next instruction.",
      coordinate: "N 41.08 / W 107.88",
      marker: "BARO",
      routeNote: "Wind shifts across the saddle before the team moves.",
      terrainNote: "Cloud deck low, rain band east, visibility opening west.",
      details: ["Read the front", "Wait out the squall", "Move on clear air"],
      stamp: "Window found",
      beats: [
        {
          action: "Weather plate covers the route",
          title: "Front arriving",
          body: "The storm gets a place in the composition instead of a warning label.",
        },
        {
          action: "Rain and wind bands reveal the delay",
          title: "Delay accepted",
          body: "A slower leg keeps the expedition legible and intact.",
        },
        {
          action: "Clear window opens on the western edge",
          title: "Window open",
          body: "The field note changes from hold to move when the sky plate breaks.",
        },
      ],
    },
    4: {
      eyebrow: "SIGNAL DISCOVERY",
      navLabel: "Discovery",
      title: "SIGNAL IN THE BASIN",
      subtitle: "The finding is small, but the whole route turns toward it.",
      coordinate: "N 41.16 / W 107.61",
      marker: "PING",
      routeNote: "A weak pulse repeats behind the last ridge.",
      terrainNote: "The basin answers twice; the team pins the second reply.",
      details: ["Catch weak pulse", "Triangulate basin", "Pin the return"],
      stamp: "Signal held",
      beats: [
        {
          action: "Discovery ridge enters as a dark screenprint mass",
          title: "Ridge crossed",
          body: "The route narrows to the basin where the first repeat appears.",
        },
        {
          action: "Signal rings overprint the basin",
          title: "Pulse caught",
          body: "The signal stays modest: one clear return, not spectacle.",
        },
        {
          action: "Field note pins the confirmed return",
          title: "Return pinned",
          body: "The route is now evidence, stamped by terrain and repetition.",
        },
      ],
    },
    5: {
      eyebrow: "FIELD STAMP",
      navLabel: "Stamp",
      title: "ROUTE STAMPED",
      subtitle: "A finished route is a public artifact, not a private hunch.",
      coordinate: "N 41.20 / W 107.55",
      marker: "DONE",
      routeNote: "The last mark turns the route into a shareable signal.",
      terrainNote: "Filed at dusk with bearing, weather, and return confirmed.",
      details: ["Seal the card", "Archive bearing", "Send route back"],
      stamp: "Signal returned",
      beats: [
        {
          action: "Stamp ring presses into the poster field",
          title: "Stamp ready",
          body: "The last scene behaves like a field office mark on warm paper.",
        },
        {
          action: "Final coordinate locks inside the stamp",
          title: "Coordinate filed",
          body: "The discovery becomes repeatable because the bearing survives the walk.",
        },
        {
          action: "Route card closes as a public record",
          title: "Route returned",
          body: "The signal goes back to the people who needed the map.",
        },
      ],
    },
  },
  zh: {
    1: {
      eyebrow: "野外路线",
      navLabel: "起点",
      title: "路线起点",
      subtitle: "从山脊切过中继线的地方出发。",
      coordinate: "北 40.71 / 西 108.26",
      marker: "出发",
      routeNote: "上坡之前，先把问题装进地图。",
      terrainNote: "沙台、松荫、第一座石标。",
      details: ["校准方位", "记录石标", "离开公路"],
      stamp: "路线开启",
      beats: [
        {
          action: "起点海报锁定第一组坐标",
          title: "路线起点",
          body: "路线从一个公开承诺和一个明确方位开始。",
        },
        {
          action: "方位标从地面色块中升起",
          title: "方位已定",
          body: "队伍先标记第一座石标，再让地图长出细节。",
        },
        {
          action: "出发记录压进印刷层",
          title: "离开道路",
          body: "最后一段铺装边界退后，信号路径开始显形。",
        },
      ],
    },
    2: {
      eyebrow: "地图分段",
      navLabel: "分段",
      title: "三段向北",
      subtitle: "每一次转向都值得落墨，路线才有用。",
      coordinate: "北 40.96 / 西 108.04",
      marker: "第二段",
      routeNote: "山脊、干沟、塔点连成一条断线。",
      terrainNote: "等高线在中继盆地附近收紧。",
      details: ["横切山脊", "穿过干沟", "接近塔点"],
      stamp: "地图锁定",
      beats: [
        {
          action: "等高线场作为平面墨层出现",
          title: "地图底板",
          body: "第一层只说明地形，不假装精确。",
        },
        {
          action: "三段路线在盆地中连接",
          title: "分段相接",
          body: "每段都有任务：爬升、过沟、抵达塔点。",
        },
        {
          action: "中继坐标标在最后一段",
          title: "坐标落点",
          body: "最后一次转向不再靠猜，它有了印出来的方位。",
        },
      ],
    },
    3: {
      eyebrow: "天气窗口",
      navLabel: "天气",
      title: "等待天气",
      subtitle: "云层不是噪音，而是下一条指令。",
      coordinate: "北 41.08 / 西 107.88",
      marker: "气压",
      routeNote: "队伍移动前，风先越过鞍部。",
      terrainNote: "云底低、雨带向东、西侧能见度打开。",
      details: ["读取锋面", "等过阵雨", "趁晴移动"],
      stamp: "窗口确认",
      beats: [
        {
          action: "天气墨层覆盖路线",
          title: "锋面抵达",
          body: "风暴进入构图，而不是变成孤立的警告。",
        },
        {
          action: "雨带和风带揭示延迟",
          title: "接受延迟",
          body: "更慢的一段，让整条远征仍然清楚完整。",
        },
        {
          action: "西侧打开晴窗",
          title: "窗口打开",
          body: "当天空色块断开，野外记录从等待变成前进。",
        },
      ],
    },
    4: {
      eyebrow: "发现信号",
      navLabel: "发现",
      title: "盆地信号",
      subtitle: "发现很小，但整条路线都转向它。",
      coordinate: "北 41.16 / 西 107.61",
      marker: "回波",
      routeNote: "最后一道山脊后方，弱脉冲开始重复。",
      terrainNote: "盆地回应两次；队伍钉住第二次回波。",
      details: ["捕捉弱脉冲", "三角定位盆地", "钉住回波"],
      stamp: "信号保持",
      beats: [
        {
          action: "发现山脊以深色丝网块进入",
          title: "越过山脊",
          body: "路线收窄到盆地，第一次重复在那里出现。",
        },
        {
          action: "信号环在盆地上套印",
          title: "捕捉脉冲",
          body: "信号保持克制：一次清楚回波，而不是炫示。",
        },
        {
          action: "野外记录钉住确认回波",
          title: "回波钉住",
          body: "路线成为证据，由地形和重复共同盖章。",
        },
      ],
    },
    5: {
      eyebrow: "野外盖章",
      navLabel: "盖章",
      title: "路线归档",
      subtitle: "完成的路线是公共记录，不是私人直觉。",
      coordinate: "北 41.20 / 西 107.55",
      marker: "完成",
      routeNote: "最后一记让路线变成可以分享的信号。",
      terrainNote: "黄昏归档：方位、天气和回波都已确认。",
      details: ["盖住卡片", "归档方位", "送回路线"],
      stamp: "信号返回",
      beats: [
        {
          action: "印章环压入海报纸面",
          title: "印章就绪",
          body: "最后一页像野外办公室落在暖纸上的印记。",
        },
        {
          action: "最终坐标锁进印章",
          title: "坐标归档",
          body: "因为方位留存，发现才可以被再次走到。",
        },
        {
          action: "路线卡片合为公共记录",
          title: "路线返回",
          body: "信号回到真正需要这张地图的人手里。",
        },
      ],
    },
  },
};

function cx(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

function useFonts() {
  useEffect(() => {
    const id = "field-route-fonts";
    if (document.getElementById(id)) return;

    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700;800;900&family=Noto+Sans+SC:wght@500;700;900&display=swap";
    document.head.appendChild(link);
  }, []);
}

function normalizeScene(scene: number): SceneId {
  return SCENE_IDS.includes(scene as SceneId) ? (scene as SceneId) : 1;
}

function clampBeat(beat: number, total: number): number {
  return Math.max(0, Math.min(beat, total - 1));
}

function getSceneCopy(language: Lang, scene: number): SceneCopy {
  return COPY[language][normalizeScene(scene)];
}

function buildMetadata(lang: Lang): TopicMetadata {
  return {
    theme: lang === "zh" ? "通往信号的野外路线" : "Field Route to the Signal",
    densityLabel: lang === "zh" ? "中密度海报" : "Poster Moderate",
    heroScene: 4,
    colors: {
      bg: "#e9d29d",
      ink: "#173c34",
      panel: "#d7642d",
    },
    typography: {
      header: "Barlow Condensed 800",
      body: "Noto Sans SC 500",
    },
    tags: [
      "screenprint",
      "expedition",
      "map",
      "craft",
      "poster",
      "motion",
    ],
    fonts: ["Barlow Condensed", "cjk:Noto Sans SC"],
    scenes: SCENE_IDS.map((sceneId) => {
      const scene = COPY[lang][sceneId];
      return {
        id: sceneId,
        title: scene.navLabel,
        beats: scene.beats.map((beat, index) => ({
          id: index,
          action: beat.action,
          title: beat.title,
          body: beat.body,
        })),
      };
    }),
  };
}

interface ScenePanelProps {
  scene: number;
  beat: number;
  language: Lang;
  isActive: boolean;
  staticMode: boolean;
}

function ScenePanel({
  scene,
  beat,
  language,
  isActive,
  staticMode,
}: ScenePanelProps) {
  const sceneId = normalizeScene(scene);
  const copy = getSceneCopy(language, sceneId);
  const activeBeat = clampBeat(beat, copy.beats.length);
  const activeBeatCopy = copy.beats[activeBeat];
  const sceneClass = styles[`scene${sceneId}`];
  const flip = useFLIP<HTMLDivElement>({
    watch: [sceneId, activeBeat],
    disabled: staticMode || !isActive,
    duration: 560,
    easing: "cubic-bezier(0.34, 1.56, 0.64, 1)",
    selector: '[data-beat-layout-item="true"]',
  });

  return (
    <section className={cx(styles.scenePanel, sceneClass)} data-scene={sceneId}>
      <div
        ref={flip.ref}
        className={styles.posterBody}
        data-beat-layout-container="true"
        data-beat-layout-mode="motion"
      >
        <header className={styles.headerBlock} data-beat-layout-item="true">
          <p className={styles.eyebrow}>{copy.eyebrow}</p>
          <h1>{copy.title}</h1>
          <p className={styles.subtitle}>{copy.subtitle}</p>
        </header>

        <ExpeditionIllustration
          scene={sceneId}
          beat={activeBeat}
          copy={copy}
        />

        <aside className={styles.coordinateCard} data-beat-layout-item="true">
          <p className={styles.cardKicker}>{copy.coordinate}</p>
          <p className={styles.cardTitle}>{activeBeatCopy.title}</p>
          <p>{activeBeatCopy.body}</p>
        </aside>

        <div className={styles.routeStack} data-beat-layout-item="true">
          <p className={styles.routeNote}>{copy.routeNote}</p>
          <ul>
            {copy.details.slice(0, activeBeat + 1).map((detail) => (
              <li key={detail} data-beat-layout-item="true">
                {detail}
              </li>
            ))}
          </ul>
        </div>

        <footer className={styles.fieldFooter} data-beat-layout-item="true">
          <span>{copy.terrainNote}</span>
          <strong>{copy.stamp}</strong>
        </footer>
      </div>
      <BeatRun total={copy.beats.length} current={activeBeat} />
    </section>
  );
}

function BeatRun({ total, current }: { total: number; current: number }) {
  return (
    <div className={styles.beatRun} aria-hidden="true">
      {Array.from({ length: total }, (_, index) => (
        <span
          key={index}
          className={cx(styles.beatMark, index <= current && styles.activeBeat)}
        />
      ))}
    </div>
  );
}

function CoordinateRail({
  scene,
  beat,
  language,
  onNavigate,
}: {
  scene: number;
  beat: number;
  language: Lang;
  onNavigate?: (scene: number, beat: number) => void;
}) {
  const safeScene = normalizeScene(scene);
  const label =
    language === "zh" ? "地图坐标场景导航" : "Map coordinate scene navigation";

  return (
    <nav
      className={styles.coordinateRail}
      aria-label={label}
      data-topic-navigation="true"
      data-navigation-geometry="path"
      data-navigation-carrier="field-route-coordinate-rail"
      data-navigation-invocation="persistent"
      data-navigation-feedback="active-glow"
      onPointerDown={(event) => event.stopPropagation()}
      onClick={(event) => event.stopPropagation()}
      onKeyDown={(event) => event.stopPropagation()}
    >
      <div className={styles.railRule} aria-hidden="true" />
      <p className={styles.railNorth}>{language === "zh" ? "北" : "N"}</p>
      <p className={styles.railWest}>{language === "zh" ? "西" : "W"}</p>
      <div className={styles.railStops}>
        {SCENE_IDS.map((sceneId) => {
          const copy = COPY[language][sceneId];
          const isCurrent = sceneId === safeScene;
          const activeBeat = isCurrent
            ? clampBeat(beat, copy.beats.length)
            : -1;

          return (
            <button
              key={sceneId}
              type="button"
              className={cx(styles.railStop, isCurrent && styles.activeStop)}
              aria-current={isCurrent ? "step" : undefined}
              onClick={(event) => {
                event.stopPropagation();
                onNavigate?.(sceneId, 0);
              }}
            >
              <span className={styles.stopNumber}>
                <span className={styles.stopNumberText}>0{sceneId}</span>
              </span>
              <span className={styles.stopLabel}>{copy.navLabel}</span>
              <span className={styles.stopBeats} aria-hidden="true">
                {copy.beats.map((beatCopy, index) => (
                  <span
                    key={beatCopy.title}
                    className={cx(
                      styles.stopBeat,
                      index <= activeBeat && styles.activeStopBeat,
                    )}
                  />
                ))}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

function ScreenGrain() {
  return (
    <svg className={styles.grainSvg} viewBox="0 0 1200 800" aria-hidden="true">
      <defs>
        <pattern
          id="field-route-grain"
          width="24"
          height="24"
          patternUnits="userSpaceOnUse"
        >
          <path d="M3 4h3v2H3zM11 17h2v2h-2zM19 7h4v1h-4zM6 22h5v1H6z" />
        </pattern>
      </defs>
      <rect width="1200" height="800" fill="url(#field-route-grain)" />
    </svg>
  );
}

function ExpeditionIllustration({
  scene,
  beat,
  copy,
}: {
  scene: SceneId;
  beat: number;
  copy: SceneCopy;
}) {
  return (
    <div className={styles.illustration} data-beat-layout-item="true">
      <svg
        className={styles.mapSvg}
        viewBox="0 0 1000 620"
        role="img"
        aria-label={copy.navLabel}
      >
        <rect className={styles.skyPlate} x="0" y="0" width="1000" height="620" />
        <path
          className={styles.ridgeBack}
          d="M0 244 C118 188 202 222 302 165 C420 94 548 223 660 144 C782 61 894 144 1000 92 L1000 620 L0 620 Z"
        />
        <path
          className={styles.ridgeMid}
          d="M0 324 C130 273 236 322 354 260 C498 185 610 335 758 256 C872 194 934 224 1000 198 L1000 620 L0 620 Z"
        />
        <path
          className={styles.groundPlate}
          d="M0 430 C128 382 238 430 372 382 C502 335 610 462 748 396 C865 340 930 372 1000 338 L1000 620 L0 620 Z"
        />
        <path
          className={styles.routeGhost}
          d="M128 492 C232 424 314 462 396 386 C520 272 636 374 760 282 C830 231 894 218 936 182"
        />
        <path
          className={cx(styles.routeLine, beat >= 1 && styles.visible)}
          d="M112 505 C226 432 314 468 398 386 C518 274 636 374 760 282 C830 231 894 218 936 182"
        />

        {scene === 1 && <TrailheadMarks beat={beat} copy={copy} />}
        {scene === 2 && <MapLegMarks beat={beat} copy={copy} />}
        {scene === 3 && <WeatherMarks beat={beat} copy={copy} />}
        {scene === 4 && <DiscoveryMarks beat={beat} copy={copy} />}
        {scene === 5 && <StampMarks beat={beat} copy={copy} />}
      </svg>
    </div>
  );
}

function TrailheadMarks({ beat, copy }: { beat: number; copy: SceneCopy }) {
  return (
    <g>
      <rect className={styles.signPost} x="212" y="340" width="28" height="150" />
      <rect className={styles.signFace} x="160" y="278" width="220" height="92" />
      <text className={styles.svgLabel} x="190" y="335">
        {copy.marker}
      </text>
      <g className={cx(styles.svgReveal, beat >= 1 && styles.visible)}>
        <path className={styles.cairn} d="M470 482 L520 482 L508 448 L482 448 Z" />
        <path className={styles.cairn} d="M500 448 L552 448 L532 414 L514 414 Z" />
        <path className={styles.cairn} d="M530 414 L572 414 L552 386 Z" />
      </g>
      <g className={cx(styles.svgReveal, beat >= 2 && styles.visible)}>
        <path
          className={styles.flagLine}
          d="M690 406 C728 370 780 378 818 342"
        />
        <path className={styles.flag} d="M814 342 L914 366 L814 392 Z" />
      </g>
    </g>
  );
}

function MapLegMarks({ beat, copy }: { beat: number; copy: SceneCopy }) {
  return (
    <g>
      <path className={styles.contour} d="M120 234 C198 180 292 202 330 262 S486 360 548 286 S704 180 858 220" />
      <path className={styles.contour} d="M108 344 C210 292 300 316 392 365 S582 434 666 344 S790 262 912 296" />
      <path className={styles.contour} d="M180 132 C274 98 378 122 456 184 S632 240 718 170 S840 112 930 138" />
      <g className={cx(styles.svgReveal, beat >= 1 && styles.visible)}>
        <path className={styles.routeLeg} d="M158 492 L336 398 L512 426" />
        <path className={styles.routeLeg} d="M512 426 L640 318 L786 304" />
      </g>
      <g className={cx(styles.svgReveal, beat >= 2 && styles.visible)}>
        <circle className={styles.targetRing} cx="786" cy="304" r="46" />
        <circle className={styles.targetCore} cx="786" cy="304" r="14" />
        <text className={styles.svgLabel} x="706" y="252">
          {copy.marker}
        </text>
      </g>
    </g>
  );
}

function WeatherMarks({ beat, copy }: { beat: number; copy: SceneCopy }) {
  return (
    <g>
      <path
        className={styles.cloud}
        d="M192 230 C210 162 276 176 302 130 C368 72 438 122 452 180 C532 166 596 210 594 278 L176 278 C162 254 170 238 192 230 Z"
      />
      <g className={cx(styles.svgReveal, beat >= 1 && styles.visible)}>
        <path className={styles.rainBand} d="M262 310 L208 444" />
        <path className={styles.rainBand} d="M352 310 L286 482" />
        <path className={styles.rainBand} d="M446 310 L380 482" />
      </g>
      <g className={cx(styles.svgReveal, beat >= 2 && styles.visible)}>
        <path
          className={styles.clearWindow}
          d="M676 190 C748 150 826 162 892 216 C835 265 748 276 668 238 Z"
        />
        <text className={styles.svgLabel} x="696" y="230">
          {copy.marker}
        </text>
      </g>
    </g>
  );
}

function DiscoveryMarks({ beat, copy }: { beat: number; copy: SceneCopy }) {
  return (
    <g>
      <path
        className={styles.basinShadow}
        d="M548 454 C638 360 724 350 834 274 L1000 338 L1000 620 L548 620 Z"
      />
      <g className={cx(styles.svgReveal, beat >= 1 && styles.visible)}>
        <circle className={styles.signalRing} cx="706" cy="318" r="48" />
        <circle className={styles.signalRing} cx="706" cy="318" r="92" />
        <circle className={styles.targetCore} cx="706" cy="318" r="13" />
      </g>
      <g className={cx(styles.svgReveal, beat >= 2 && styles.visible)}>
        <path className={styles.noteCard} d="M210 338 H430 V456 H210 Z" />
        <path className={styles.noteRule} d="M238 382 H402 M238 418 H360" />
        <text className={styles.svgLabel} x="246" y="360">
          {copy.marker}
        </text>
      </g>
    </g>
  );
}

function StampMarks({ beat, copy }: { beat: number; copy: SceneCopy }) {
  return (
    <g>
      <g className={cx(styles.stampGroup, beat >= 0 && styles.visible)}>
        <circle className={styles.stampOuter} cx="500" cy="308" r="172" />
        <circle className={styles.stampInner} cx="500" cy="308" r="126" />
        <path className={styles.stampRoute} d="M378 340 C440 282 506 350 570 276 C604 236 640 226 684 206" />
      </g>
      <g className={cx(styles.svgReveal, beat >= 1 && styles.visible)}>
        <text className={styles.svgLabel} x="432" y="284">
          {copy.marker}
        </text>
        <path className={styles.noteRule} d="M410 330 H592 M434 368 H568" />
      </g>
      <g className={cx(styles.svgReveal, beat >= 2 && styles.visible)}>
        <path className={styles.flag} d="M362 170 L500 120 L638 170 L500 214 Z" />
      </g>
    </g>
  );
}

const metadata = {
  en: buildMetadata("en"),
  zh: buildMetadata("zh"),
};

function TopicStage({
  scene,
  beat,
  language,
  isThumbnail,
  reducedMotion,
  onNavigate,
}: TopicStageProps) {
  useFonts();
  const staticMode = reducedMotion || isThumbnail;

  return (
    <div
      className={styles.root}
      data-topic-id="field-route"
      data-static={staticMode ? "true" : "false"}
    >
      <ScreenGrain />
      <div className={styles.printFrame} aria-hidden="true" />
      <SpatialSceneTrack
        scene={scene}
        beat={beat}
        transitionKind="slide-x"
        transitionMap={TRANSITION_MAP}
        transitionDurationMs={720}
        reducedMotion={reducedMotion || isThumbnail}
        beatLayoutModes={BEAT_LAYOUT_MODES}
        className={styles.track}
        renderScene={(sceneId, sceneBeat, isActive) => (
          <ScenePanel
            scene={sceneId}
            beat={sceneBeat}
            language={language}
            isActive={isActive}
            staticMode={staticMode}
          />
        )}
      />
      {!isThumbnail && (
        <CoordinateRail
          scene={scene}
          beat={beat}
          language={language}
          onNavigate={onNavigate}
        />
      )}
    </div>
  );
}

export default defineTopic({
  id: "field-route",
  styleId: "expedition-screenprint",
  title: {
    en: "Field Route",
    zh: "现场路线",
  },
  modelId: "GPT 5.5",
  Stage: TopicStage,
  metadata,
  navigation: NAVIGATION,
  transitionScore: TRANSITION_SCORE,
  evidence: {
    kind: "illustrative",
    boundary: {
      en: "Illustrative field route: coordinates, terrain notes, weather states, and signal discoveries are presentation examples, not external factual claims.",
      zh: "示例野外路线：其中坐标、地形笔记、天气状态和信号发现均为演示内容，并非外部事实主张。",
    },
    display: "envelope",
  },
});

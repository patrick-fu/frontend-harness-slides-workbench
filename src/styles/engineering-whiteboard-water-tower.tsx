import { useEffect, useRef, useState } from "react";
import type React from "react";
import type { BespokeStyleProps, StyleMetadata } from "../types";
import SpatialSceneTrack, { type SceneTransitionMap } from "./SpatialSceneTrack";
import { defineStyleTopic } from "./topic";
import styles from "./engineering-whiteboard-water-tower.module.css";

type Lang = "en" | "zh";

const STYLE_ID = "engineering-whiteboard-explainer";
const TOPIC_ID = "water-tower";

export const WATER_TOWER_TRANSITION_SCORE = {
  "1->2": "grid-reveal",
  "2->3": "push-y",
  "3->4": "focus-swap",
  "4->5": "split-merge",
} as const;

const TRANSITION_MAP: SceneTransitionMap = {
  ...WATER_TOWER_TRANSITION_SCORE,
  "2->1": "grid-reveal",
  "3->2": "push-y",
  "4->3": "focus-swap",
  "5->4": "split-merge",
};

const BEAT_LAYOUT_MODES = {
  3: "reserved",
  4: "reserved",
  5: "reserved",
} satisfies Record<number, "reserved">;

export const WATER_TOWER_SOURCES = [
  {
    authority: "US EPA",
    title: "Water Quality in Small Community Distribution Systems",
    url: "https://nepis.epa.gov/Exe/ZyPURL.cgi?Dockey=P1000OY3.TXT",
    supports:
      "Distribution storage accommodates peak flow, emergency demand, firefighting, and pressure equalization.",
  },
  {
    authority: "USGS",
    title: "Use of Submersible Pressure Transducers in Water-Resources Investigations",
    url: "https://pubs.usgs.gov/twri/twri8a3/",
    supports:
      "Pressure head is related to the height of the water column; total head also includes elevation and velocity terms.",
  },
  {
    authority: "Washington State Department of Health",
    title: "Water System Design Manual",
    url: "https://doh.wa.gov/sites/default/files/2022-02/331-123.pdf",
    supports:
      "Real distribution design requires hydraulic analysis across demand, fire flow, terrain, friction, storage, and pressure zones.",
  },
  {
    authority: "Minnesota Department of Health",
    title: "From Tall to Taller: Minnetonka Raises a Tower",
    url: "https://www.health.state.mn.us/communities/environment/water/waterline/featurestories/tonkatower.html",
    supports:
      "A municipal case shows why tower overflow elevations must align inside a pressure zone and why terrain creates several zones.",
  },
] as const;

const COPY = {
  en: {
    name: "Engineering Whiteboard Explainer",
    theme:
      "A hand-drawn engineering explanation of how elevation, stored volume, demand, and pressure zones make a water tower useful without pretending a static sketch is a full hydraulic model.",
    density: "Diagram explainer",
    deckLabel: "CITY WATER / HEAD + STORAGE",
    laneLabel: "BOARD NOTE",
    sourceLabel: "FACT PACK",
    navOpen: "Open scene",
    scenes: [
      {
        nav: "Tap question",
        title: "The pressure puzzle",
        beats: [
          {
            action: "Ask from one tap",
            title: "If the pump pauses, why does the tap still run?",
            body: "A short pump pause does not instantly erase the head already stored above the network.",
          },
        ],
      },
      {
        nav: "Elevation",
        title: "Lift water before demand arrives",
        beats: [
          {
            action: "Connect height to head",
            title: "Elevation turns stored water into pressure head",
            body: "The tank water surface sets a hydraulic-grade reference; terrain and losses decide what reaches each tap.",
          },
        ],
      },
      {
        nav: "Tower cutaway",
        title: "Inside the tower",
        beats: [
          {
            action: "Open the tank",
            title: "A tank above the network stores both water and head",
            body: "The riser connects the elevated volume to the pressure zone so the tank can fill or discharge as operation changes.",
          },
          {
            action: "Attach controls and uses",
            title: "Level controls coordinate pumps; limits protect operation",
            body: "Overflow, low-level alarms, valves, and controls are part of the system—not decorative tower details.",
          },
        ],
      },
      {
        nav: "Pressure zones",
        title: "Pressure follows the whole network",
        beats: [
          {
            action: "Draw static head",
            title: "More vertical difference means more static pressure head",
            body: "p ≈ ρgΔh is a useful teaching reference, not a complete operating model.",
          },
          {
            action: "Trigger peak flow",
            title: "Peak and fire flow draw on stored volume",
            body: "Residual pressure also depends on available supply, pipe friction, valves, and where demand occurs.",
          },
          {
            action: "Separate the terrain",
            title: "Terrain divides cities into pressure zones",
            body: "Boosters and pressure-reducing valves help high and low ground stay within workable pressure ranges.",
          },
        ],
      },
      {
        nav: "Network reality",
        title: "Pull back to the real system",
        beats: [
          {
            action: "Place elevated storage",
            title: "Elevated storage can ride on a pressure zone",
            body: "Its water level helps establish head while stored volume absorbs part of the demand swing.",
          },
          {
            action: "Add another system form",
            title: "Ground storage plus pumps can do the job differently",
            body: "Some systems use ground reservoirs, hydropneumatic tanks, or controlled pumping instead of a familiar tower.",
          },
          {
            action: "Join several zones",
            title: "Tanks, reservoirs, and controls can work as a network",
            body: "Large systems may coordinate several storage sites and pressure zones rather than rely on one landmark.",
          },
          {
            action: "State the boundary",
            title: "One job, several system forms",
            body: "Real operation combines pumps, valves, pipe friction, terrain, controls, and water-quality constraints—not one static-pressure equation.",
          },
        ],
      },
    ],
    labels: {
      storedHead: "stored head",
      pumpPaused: "pump paused",
      tapFlow: "tap still flows",
      waterSurface: "water surface / HGL reference",
      peakDemand: "morning peak",
      terrain: "ground elevation",
      headDifference: "vertical head",
      tankVolume: "usable storage",
      overflow: "overflow + high-level limit",
      riser: "common riser",
      pumpControl: "pump / level control",
      homeDemand: "Home demand",
      fireReserve: "Fire-flow reserve",
      staticSketch: "STATIC SKETCH ONLY",
      frictionLoss: "losses grow with flow",
      fireFlow: "high-flow event",
      highZone: "HIGH ZONE",
      middleZone: "MIDDLE ZONE",
      lowZone: "LOW ZONE",
      booster: "booster",
      prv: "pressure-reducing valve",
      elevated: "elevated storage",
      ground: "ground reservoir + pumps",
      distributed: "several pressure zones",
      caveatTitle: "A real system is not one static-pressure equation",
      systemFactors:
        "Model pumps, valves, friction, terrain, demand, controls, and water-quality constraints together.",
      sources: "EPA · USGS · WA DOH · MN DOH",
    },
  },
  zh: {
    name: "工程白板讲解",
    theme:
      "用手绘工程图解释高程、储水量、需求和压力分区为何让水塔有用，同时明确静水压草图不等于完整水力模型。",
    density: "图解型",
    deckLabel: "城市供水 / 压头 + 储水",
    laneLabel: "白板结论",
    sourceLabel: "事实来源",
    navOpen: "打开场景",
    scenes: [
      {
        nav: "水龙头之问",
        title: "压力谜题",
        beats: [
          {
            action: "从一个水龙头提问",
            title: "泵停一下，水为什么还在来？",
            body: "泵短暂停止，并不会立刻抹掉管网上方已经储存的压头。",
          },
        ],
      },
      {
        nav: "高程",
        title: "先把水提升，再等待需求",
        beats: [
          {
            action: "连接高程与压头",
            title: "高程把储水变成压力压头",
            body: "水面给出水力坡线参考；地形与沿程损失决定用户端真正得到什么。",
          },
        ],
      },
      {
        nav: "水塔剖面",
        title: "水塔里面有什么",
        beats: [
          {
            action: "打开水箱",
            title: "管网上方的水箱，同时储存水量与压头",
            body: "立管把高位储水接入压力分区；随运行状态变化，水塔可以进水或出水。",
          },
          {
            action: "接上控制与用途",
            title: "液位控制协调水泵，边界设施保护运行",
            body: "溢流、低液位报警、阀门和控制不是装饰，而是系统的一部分。",
          },
        ],
      },
      {
        nav: "压力分区",
        title: "压力取决于整张管网",
        beats: [
          {
            action: "画出静态压头",
            title: "垂直高差越大，静态压力压头越高",
            body: "p ≈ ρgΔh 适合帮助理解，但不是完整运行模型。",
          },
          {
            action: "触发高峰流量",
            title: "用水高峰与消防流量会动用储水",
            body: "剩余压力还取决于可用供水、管道摩阻、阀门和需求发生的位置。",
          },
          {
            action: "按地形分区",
            title: "高低起伏让城市需要压力分区",
            body: "加压泵与减压阀帮助高地、低地保持在合适的压力范围。",
          },
        ],
      },
      {
        nav: "真实网络",
        title: "拉远，看见真实系统",
        beats: [
          {
            action: "放置高位储水",
            title: "高位储水可以与一个压力分区共同运行",
            body: "水位帮助建立压头，储水量则吸收一部分需求波动。",
          },
          {
            action: "加入另一种系统形式",
            title: "地面水池配合水泵，也能用另一种方式完成任务",
            body: "有些系统采用地面水池、气压罐或受控泵送，并不依赖常见的高架水塔。",
          },
          {
            action: "连接多个分区",
            title: "水塔、水池与控制设施可以组成网络",
            body: "大型系统可能协调多个储水点和压力分区，而不是只靠一个地标。",
          },
          {
            action: "说明模型边界",
            title: "一种任务，多种系统形态",
            body: "真实运行要同时考虑泵、阀门、摩阻、地形、控制与水质约束，而不是只看一道静水压算式。",
          },
        ],
      },
    ],
    labels: {
      storedHead: "已储存的压头",
      pumpPaused: "水泵暂停",
      tapFlow: "水龙头仍有水",
      waterSurface: "水面 / 水力坡线参考",
      peakDemand: "早间用水峰值",
      terrain: "地面高程",
      headDifference: "垂直压头",
      tankVolume: "可用储水",
      overflow: "溢流 + 高液位边界",
      riser: "共用立管",
      pumpControl: "水泵 / 液位控制",
      homeDemand: "住宅用水",
      fireReserve: "消防储备",
      staticSketch: "仅为静态草图",
      frictionLoss: "流量增大，损失上升",
      fireFlow: "高流量事件",
      highZone: "高区",
      middleZone: "中区",
      lowZone: "低区",
      booster: "加压泵",
      prv: "减压阀",
      elevated: "高位储水",
      ground: "地面水池 + 水泵",
      distributed: "多个压力分区",
      caveatTitle: "现实系统不是一道静水压算式",
      systemFactors: "泵、阀门、摩阻、地形、需求、控制与水质约束必须一起进入真实模型。",
      sources: "EPA · USGS · 华盛顿州卫生部门 · 明尼苏达州卫生部门",
    },
  },
} as const;

function useFonts() {
  useEffect(() => {
    const id = "style-engineering-whiteboard-explainer-fonts";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500;600;700&family=LXGW+WenKai:wght@400;700&display=swap";
    document.head.appendChild(link);
  }, []);
}

export function getMetadata(lang: Lang): StyleMetadata {
  const copy = COPY[lang];
  return {
    id: STYLE_ID,
    band: "balanced-hybrid",
    name: copy.name,
    theme: copy.theme,
    densityLabel: copy.density,
    heroScene: 4,
    colors: { bg: "#fbfcff", ink: "#20262f", panel: "#ffffff" },
    typography: {
      header: "LXGW WenKai 700",
      body: "Inter 500",
    },
    tags: [
      "engineering",
      "whiteboard",
      "explainer",
      "water-distribution",
      "infrastructure",
      "hydraulic-head",
      "pressure-zones",
      "line-drawing",
      "diagram",
    ],
    fonts: ["Inter", "JetBrains Mono", "cjk:LXGW WenKai"],
    scenes: copy.scenes.map((scene, sceneIndex) => ({
      id: sceneIndex + 1,
      title: scene.title,
      beats: scene.beats.map((beat, beatIndex) => ({
        id: beatIndex,
        action: beat.action,
        title: beat.title,
        body: beat.body,
      })),
    })),
  };
}

function visibleAt(beat: number, threshold: number) {
  return beat >= threshold;
}

function visibilityClass(visible: boolean) {
  return visible ? styles.visible : styles.waiting;
}

function Header({ lang, scene }: { lang: Lang; scene: number }) {
  const copy = COPY[lang];
  return (
    <header className={styles.header}>
      <div className={styles.deckLabel}>{copy.deckLabel}</div>
      <div className={styles.sceneHeading}>
        <span className={styles.sceneTick} aria-hidden="true" />
        {copy.scenes[scene - 1]?.title ?? copy.scenes[0].title}
      </div>
    </header>
  );
}

function Takeaway({ lang, scene, beat }: { lang: Lang; scene: number; beat: number }) {
  const copy = COPY[lang];
  const sceneCopy = copy.scenes[scene - 1] ?? copy.scenes[0];
  const activeBeat = sceneCopy.beats[Math.min(beat, sceneCopy.beats.length - 1)];
  return (
    <aside className={styles.takeaway} aria-live="polite">
      <span className={styles.takeawayLabel}>{copy.laneLabel}</span>
      <span className={styles.takeawayText}>{activeBeat.body}</span>
    </aside>
  );
}

function NodeSticker({
  kind,
  label,
  visible,
}: {
  kind: "home" | "hydrant";
  label: string;
  visible: boolean;
}) {
  return (
    <div
      data-testid="water-node-sticker"
      data-node-sticker="true"
      data-visible={visible ? "true" : "false"}
      className={`${styles.nodeSticker} ${visibilityClass(visible)}`}
      role="img"
      aria-label={label}
    >
      <svg className={styles.stickerIcon} viewBox="0 0 64 64" aria-hidden="true">
        {kind === "home" ? (
          <>
            <path d="M8 31 L32 10 L56 31" />
            <path d="M14 28 V55 H50 V28" />
            <path d="M27 55 V39 H38 V55" />
          </>
        ) : (
          <>
            <path d="M23 15 H42 V23 C47 25 49 30 49 36 V54 H16 V36 C16 30 18 25 23 23 Z" />
            <path d="M12 34 H53 M25 15 V8 H40 V15 M10 54 H55" />
            <circle cx="11" cy="34" r="5" />
            <circle cx="54" cy="34" r="5" />
          </>
        )}
      </svg>
      <span>{label}</span>
    </div>
  );
}

function SceneOne({ lang }: { lang: Lang }) {
  const copy = COPY[lang];
  return (
    <section className={`${styles.scene} ${styles.sceneOne}`} data-beat-layout-item="true">
      <div className={styles.questionBlock}>
        <span className={styles.markerKicker}>01 / WHY</span>
        <h1>{copy.scenes[0].beats[0].title}</h1>
      </div>
      <div className={styles.tapDiagram} aria-label={copy.scenes[0].beats[0].body}>
        <svg viewBox="0 0 1080 510" role="img" aria-label={copy.scenes[0].beats[0].title}>
          <defs>
            <marker id="water-arrow-one" markerWidth="12" markerHeight="12" refX="9" refY="6" orient="auto">
              <path d="M0 0 L12 6 L0 12 Z" className={styles.blueFill} />
            </marker>
          </defs>
          <path className={styles.faintGridLine} d="M70 430 H1010" />
          <path className={styles.sketchInk} d="M175 369 H365 V250 H520" />
          <path className={styles.sketchInk} d="M520 250 V205 C520 167 552 141 591 141 H714" />
          <path className={styles.sketchInk} d="M594 141 V79 H786 V141" />
          <path className={styles.sketchInk} d="M714 141 V255 H883" />
          <path className={styles.sketchInk} d="M844 255 H940 V330" />
          <path className={styles.sketchInk} d="M902 330 H978" />
          <path className={styles.sketchInk} d="M940 330 V371" />
          <path className={styles.waterLine} pathLength="1" d="M179 369 H365 V250 H514" markerEnd="url(#water-arrow-one)" />
          <path className={styles.waterLine} pathLength="1" d="M714 141 V255 H878" markerEnd="url(#water-arrow-one)" />
          <path className={styles.markerStroke} d="M666 70 Q732 62 803 73" />
          <path className={styles.pauseMark} d="M251 305 V335 M276 305 V335" />
          <path className={styles.drop} d="M940 378 C925 398 925 415 940 424 C955 415 955 398 940 378 Z" />
          <path className={styles.headArrow} d="M815 351 V111" markerEnd="url(#water-arrow-one)" />
        </svg>
        <span className={`${styles.diagramLabel} ${styles.pumpPaused}`}>{copy.labels.pumpPaused}</span>
        <span className={`${styles.diagramLabel} ${styles.tapFlow}`}>{copy.labels.tapFlow}</span>
        <span className={`${styles.diagramLabel} ${styles.storedHead}`}>{copy.labels.storedHead}</span>
      </div>
    </section>
  );
}

function SceneTwo({ lang }: { lang: Lang }) {
  const copy = COPY[lang];
  return (
    <section className={`${styles.scene} ${styles.sceneTwo}`} data-beat-layout-item="true">
      <div className={styles.sceneStatement}>
        <span className={styles.markerKicker}>02 / ELEVATION</span>
        <h2>{copy.scenes[1].beats[0].title}</h2>
      </div>
      <div className={styles.neighborhoodDiagram}>
        <svg viewBox="0 0 1540 610" role="img" aria-label={copy.scenes[1].beats[0].body}>
          <defs>
            <marker id="water-arrow-two" markerWidth="12" markerHeight="12" refX="9" refY="6" orient="auto">
              <path d="M0 0 L12 6 L0 12 Z" className={styles.blueFill} />
            </marker>
          </defs>
          <path className={styles.terrainFill} d="M45 465 C245 413 369 449 525 402 C695 351 832 407 1015 350 C1176 300 1340 341 1498 281 L1498 584 H45 Z" />
          <path className={styles.terrainLine} d="M45 465 C245 413 369 449 525 402 C695 351 832 407 1015 350 C1176 300 1340 341 1498 281" />
          <path className={styles.hglLine} pathLength="1" d="M205 156 H1488" />
          <path className={styles.towerInk} d="M115 391 L145 180 H286 L316 429" />
          <path className={styles.towerInk} d="M132 181 Q214 112 298 181 V238 Q214 275 132 238 Z" />
          <path className={styles.waterFill} d="M139 188 Q214 142 291 188 V225 Q214 252 139 225 Z" />
          <path className={styles.pipeLine} pathLength="1" d="M214 245 V489 H1458" markerEnd="url(#water-arrow-two)" />
          <path className={styles.pipeBranch} d="M542 488 V414 M840 488 V390 M1155 488 V337 M1395 488 V300" />
          <path className={styles.houseInk} d="M490 402 L542 358 L594 402 V452 H490 Z M804 380 L840 348 L878 380 V431 H804 Z M1110 327 L1155 289 L1200 327 V378 H1110 Z M1355 291 L1395 257 L1437 291 V343 H1355 Z" />
          <path className={styles.headArrow} d="M369 471 V157" markerEnd="url(#water-arrow-two)" />
          <path className={styles.demandGraph} d="M1040 103 H1480 M1058 98 V63 M1093 98 V55 M1128 98 V45 M1163 98 V62 M1198 98 V82 M1233 98 V88 M1268 98 V70 M1303 98 V46 M1338 98 V31 M1373 98 V50 M1408 98 V72 M1443 98 V86" />
        </svg>
        <span className={`${styles.diagramLabel} ${styles.waterSurface}`}>{copy.labels.waterSurface}</span>
        <span className={`${styles.diagramLabel} ${styles.terrainLabel}`}>{copy.labels.terrain}</span>
        <span className={`${styles.diagramLabel} ${styles.headDifference}`}>{copy.labels.headDifference}</span>
        <span className={`${styles.diagramLabel} ${styles.peakDemand}`}>{copy.labels.peakDemand}</span>
      </div>
    </section>
  );
}

function SceneThree({ lang, beat }: { lang: Lang; beat: number }) {
  const copy = COPY[lang];
  const controlsVisible = visibleAt(beat, 1);
  return (
    <section className={`${styles.scene} ${styles.sceneThree}`} data-testid="water-tower-cutaway">
      <div className={styles.cutawayTitle} data-beat-layout-item="true">
        <span className={styles.markerKicker}>03 / CUTAWAY</span>
        <h2>{copy.scenes[2].beats[Math.min(beat, 1)].title}</h2>
      </div>
      <div className={styles.cutawayBoard} data-beat-layout-item="true">
        <svg viewBox="0 0 1150 650" role="img" aria-label={copy.scenes[2].beats[Math.min(beat, 1)].body}>
          <defs>
            <marker id="water-arrow-three" markerWidth="12" markerHeight="12" refX="9" refY="6" orient="auto">
              <path d="M0 0 L12 6 L0 12 Z" className={styles.blueFill} />
            </marker>
          </defs>
          <path className={styles.tankShell} d="M260 89 Q465 18 673 89 V271 Q465 343 260 271 Z" />
          <path className={styles.waterCutaway} d="M280 153 Q465 108 653 153 V259 Q465 314 280 259 Z" />
          <path className={styles.waterLevel} d="M280 153 Q465 108 653 153" />
          <path className={styles.towerLeg} d="M311 296 L217 571 M621 296 L714 571 M356 306 L320 571 M576 306 L610 571" />
          <path className={styles.crossBrace} d="M278 390 L651 500 M654 390 L279 500" />
          <path className={styles.riserLine} pathLength="1" d="M466 300 V578 H1012" markerEnd="url(#water-arrow-three)" />
          <path className={`${styles.controlLine} ${visibilityClass(controlsVisible)}`} pathLength="1" d="M652 137 H837 V68" />
          <path className={`${styles.controlLine} ${visibilityClass(controlsVisible)}`} pathLength="1" d="M668 189 H922 V242" />
          <path className={`${styles.controlLine} ${visibilityClass(controlsVisible)}`} pathLength="1" d="M466 511 H160 V438" />
          <path className={`${styles.overflowLine} ${visibilityClass(controlsVisible)}`} pathLength="1" d="M654 121 H769 V305" />
          <path className={`${styles.pumpShape} ${visibilityClass(controlsVisible)}`} d="M97 410 H213 V468 H97 Z M80 439 H97 M213 439 H244 M128 410 Q156 368 183 410" />
          <path className={`${styles.valveShape} ${visibilityClass(controlsVisible)}`} d="M836 559 L866 534 L896 559 L866 584 Z M866 534 V505" />
        </svg>
        <span className={`${styles.diagramLabel} ${styles.tankVolume}`}>{copy.labels.tankVolume}</span>
        <span className={`${styles.diagramLabel} ${styles.riserLabel}`}>{copy.labels.riser}</span>
        <span className={`${styles.diagramLabel} ${styles.overflowLabel} ${visibilityClass(controlsVisible)}`} data-visible={controlsVisible ? "true" : "false"}>
          {copy.labels.overflow}
        </span>
        <span className={`${styles.diagramLabel} ${styles.pumpControl} ${visibilityClass(controlsVisible)}`} data-visible={controlsVisible ? "true" : "false"}>
          {copy.labels.pumpControl}
        </span>
        <div className={`${styles.stickerHome} ${visibilityClass(controlsVisible)}`}>
          <NodeSticker kind="home" label={copy.labels.homeDemand} visible={controlsVisible} />
        </div>
        <div className={`${styles.stickerHydrant} ${visibilityClass(controlsVisible)}`}>
          <NodeSticker kind="hydrant" label={copy.labels.fireReserve} visible={controlsVisible} />
        </div>
      </div>
      <div className={styles.cutawayNotes} data-beat-layout-item="true">
        {copy.scenes[2].beats.map((item, index) => (
          <div key={item.action} className={visibilityClass(visibleAt(beat, index))} data-visible={visibleAt(beat, index) ? "true" : "false"}>
            <span>{`0${index + 1}`}</span>
            <p>{item.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function SceneFour({ lang, beat }: { lang: Lang; beat: number }) {
  const copy = COPY[lang];
  const peakVisible = visibleAt(beat, 1);
  const zonesVisible = visibleAt(beat, 2);
  return (
    <section className={`${styles.scene} ${styles.sceneFour}`}>
      <div className={styles.pressureTitle} data-beat-layout-item="true">
        <span className={styles.markerKicker}>04 / HEAD ≠ WHOLE MODEL</span>
        <h2>{copy.scenes[3].beats[Math.min(beat, 2)].title}</h2>
      </div>
      <div className={styles.formulaTag} data-beat-layout-item="true">
        <strong>p ≈ ρgΔh</strong>
        <span>{copy.labels.staticSketch}</span>
      </div>
      <div className={styles.pressureBoard} data-beat-layout-item="true">
        <svg viewBox="0 0 1480 610" role="img" aria-label={copy.scenes[3].beats[Math.min(beat, 2)].body}>
          <defs>
            <marker id="water-arrow-four" markerWidth="12" markerHeight="12" refX="9" refY="6" orient="auto">
              <path d="M0 0 L12 6 L0 12 Z" className={styles.blueFill} />
            </marker>
            <marker id="risk-arrow-four" markerWidth="12" markerHeight="12" refX="9" refY="6" orient="auto">
              <path d="M0 0 L12 6 L0 12 Z" className={styles.redFill} />
            </marker>
          </defs>
          <path className={styles.zoneTerrain} d="M43 494 C280 420 398 450 565 374 C745 294 867 358 1020 258 C1182 153 1305 208 1446 132 L1446 574 H43 Z" />
          <path className={styles.terrainLine} d="M43 494 C280 420 398 450 565 374 C745 294 867 358 1020 258 C1182 153 1305 208 1446 132" />
          <path className={styles.hglLine} pathLength="1" d="M104 92 H1418" />
          <path className={styles.pressurePipe} pathLength="1" d="M119 529 H1386" />
          <path className={styles.pressureBranch} d="M310 529 V416 M712 529 V322 M1128 529 V197" />
          <path className={styles.houseInk} d="M265 410 L310 373 L355 410 V454 H265 Z M671 316 L712 281 L753 316 V361 H671 Z M1086 191 L1128 155 L1170 191 V236 H1086 Z" />
          <path className={styles.headArrow} d="M189 489 V94" markerEnd="url(#water-arrow-four)" />
          <path className={`${styles.lossLine} ${visibilityClass(peakVisible)}`} pathLength="1" d="M97 126 C457 126 816 154 1177 231 C1281 254 1355 277 1419 309" />
          <path className={`${styles.fireBranch} ${visibilityClass(peakVisible)}`} pathLength="1" d="M529 529 V403" markerEnd="url(#risk-arrow-four)" />
          <path className={`${styles.hydrantInk} ${visibilityClass(peakVisible)}`} d="M498 400 H560 V466 H498 Z M486 426 H572 M511 400 V377 H548 V400 M493 466 H566" />
          <path className={`${styles.zoneDivider} ${visibilityClass(zonesVisible)}`} d="M510 122 V564 M975 122 V564" />
          <path className={`${styles.boosterInk} ${visibilityClass(zonesVisible)}`} d="M820 493 H900 V548 H820 Z M803 520 H820 M900 520 H923 M839 493 Q860 458 881 493" />
          <path className={`${styles.prvInk} ${visibilityClass(zonesVisible)}`} d="M1200 513 L1233 486 L1266 513 L1233 540 Z M1233 486 V455" />
        </svg>
        <span className={`${styles.diagramLabel} ${styles.lossLabel} ${visibilityClass(peakVisible)}`}>{copy.labels.frictionLoss}</span>
        <span className={`${styles.diagramLabel} ${styles.fireLabel} ${visibilityClass(peakVisible)}`}>{copy.labels.fireFlow}</span>
        <span className={`${styles.zoneLabel} ${styles.lowZone} ${visibilityClass(zonesVisible)}`}>{copy.labels.lowZone}</span>
        <span className={`${styles.zoneLabel} ${styles.middleZone} ${visibilityClass(zonesVisible)}`}>{copy.labels.middleZone}</span>
        <span className={`${styles.zoneLabel} ${styles.highZone} ${visibilityClass(zonesVisible)}`}>{copy.labels.highZone}</span>
        <span className={`${styles.diagramLabel} ${styles.boosterLabel} ${visibilityClass(zonesVisible)}`}>{copy.labels.booster}</span>
        <span className={`${styles.diagramLabel} ${styles.prvLabel} ${visibilityClass(zonesVisible)}`}>{copy.labels.prv}</span>
      </div>
    </section>
  );
}

function SceneFive({ lang, beat }: { lang: Lang; beat: number }) {
  const copy = COPY[lang];
  const alternateVisible = visibleAt(beat, 1);
  const zonesVisible = visibleAt(beat, 2);
  const finalVisible = visibleAt(beat, 3);
  return (
    <section className={`${styles.scene} ${styles.sceneFive}`}>
      <div className={styles.networkTitle} data-beat-layout-item="true">
        <span className={styles.markerKicker}>05 / SYSTEM MAP</span>
        <h2>{copy.scenes[4].beats[Math.min(beat, 3)].title}</h2>
      </div>
      <div
        className={styles.networkMap}
        data-testid="water-network-map"
        data-final-network={finalVisible ? "true" : "false"}
        data-beat-layout-item="true"
      >
        <svg viewBox="0 0 1430 600" role="img" aria-label={copy.scenes[4].beats[Math.min(beat, 3)].body}>
          <defs>
            <marker id="water-arrow-five" markerWidth="12" markerHeight="12" refX="9" refY="6" orient="auto">
              <path d="M0 0 L12 6 L0 12 Z" className={styles.blueFill} />
            </marker>
          </defs>
          <path className={styles.mapContour} d="M36 500 C197 420 291 458 433 398 C596 330 703 369 844 302 C1027 215 1163 274 1396 142" />
          <path className={styles.mapContourFaint} d="M36 556 C217 481 331 507 478 452 C636 394 764 427 919 361 C1084 291 1211 333 1398 240" />
          <path className={styles.mapPipe} pathLength="1" d="M146 494 C333 493 450 432 602 413 C781 391 895 331 1057 301 C1196 274 1302 231 1381 180" markerEnd="url(#water-arrow-five)" />
          <path className={styles.mapTower} d="M106 403 L126 260 H242 L263 454 M117 260 Q184 202 252 260 V310 Q184 341 117 310 Z M184 315 V470" />
          <path className={`${styles.mapGroundTank} ${visibilityClass(alternateVisible)}`} d="M410 398 Q500 354 592 398 V473 Q500 519 410 473 Z M410 398 Q500 444 592 398" />
          <path className={`${styles.mapPump} ${visibilityClass(alternateVisible)}`} d="M627 392 H707 V445 H627 Z M611 418 H627 M707 418 H727 M646 392 Q666 358 688 392" />
          <path className={`${styles.mapZoneLine} ${visibilityClass(zonesVisible)}`} pathLength="1" d="M729 418 C869 400 925 352 1038 329 C1150 306 1250 263 1358 205" />
          <path className={`${styles.mapZoneLineAlt} ${visibilityClass(zonesVisible)}`} pathLength="1" d="M654 463 C824 479 966 449 1120 409 C1239 377 1314 333 1383 289" />
          <circle className={styles.mapNodeBlue} cx="324" cy="463" r="13" />
          <circle className={`${styles.mapNodeGreen} ${visibilityClass(alternateVisible)}`} cx="650" cy="418" r="13" />
          <circle className={`${styles.mapNodePurple} ${visibilityClass(zonesVisible)}`} cx="978" cy="350" r="13" />
          <circle className={`${styles.mapNodeYellow} ${visibilityClass(zonesVisible)}`} cx="1213" cy="288" r="13" />
          <path className={`${styles.finalBracket} ${visibilityClass(finalVisible)}`} d="M372 94 H1328 M372 79 V110 M1328 79 V110" />
        </svg>
        <span className={`${styles.mapLabel} ${styles.elevatedLabel}`}>{copy.labels.elevated}</span>
        <span className={`${styles.mapLabel} ${styles.groundLabel} ${visibilityClass(alternateVisible)}`}>{copy.labels.ground}</span>
        <span className={`${styles.mapLabel} ${styles.distributedLabel} ${visibilityClass(zonesVisible)}`}>{copy.labels.distributed}</span>
        <div className={`${styles.realityNote} ${visibilityClass(finalVisible)}`} data-visible={finalVisible ? "true" : "false"}>
          <strong>{copy.labels.caveatTitle}</strong>
          <p>{copy.labels.systemFactors}</p>
        </div>
        <div className={`${styles.sourceStrip} ${visibilityClass(finalVisible)}`} data-visible={finalVisible ? "true" : "false"}>
          <span>{copy.sourceLabel}</span>
          <strong>{copy.labels.sources}</strong>
        </div>
      </div>
    </section>
  );
}

function renderScene(scene: number, beat: number, lang: Lang) {
  switch (scene) {
    case 1:
      return <SceneOne lang={lang} />;
    case 2:
      return <SceneTwo lang={lang} />;
    case 3:
      return <SceneThree lang={lang} beat={beat} />;
    case 4:
      return <SceneFour lang={lang} beat={beat} />;
    case 5:
      return <SceneFive lang={lang} beat={beat} />;
    default:
      return <SceneOne lang={lang} />;
  }
}

const NAV_POSITIONS = [
  { x: 2, y: 4 },
  { x: 7, y: 14 },
  { x: 3, y: 25 },
  { x: 8, y: 36 },
  { x: 4, y: 48 },
] as const;

function WaterNetworkNavigation({
  scene,
  lang,
  onNavigate,
}: {
  scene: number;
  lang: Lang;
  onNavigate?: (scene: number, beat: number) => void;
}) {
  const copy = COPY[lang];
  const [touchPreviewScene, setTouchPreviewScene] = useState<number | null>(null);
  const touchPendingRef = useRef<{ target: number; confirmed: boolean } | null>(null);

  const armTouchPreview = (event: React.TouchEvent<HTMLButtonElement>, target: number) => {
    event.stopPropagation();
    touchPendingRef.current = {
      target,
      confirmed: touchPreviewScene === target,
    };
    setTouchPreviewScene(target);
  };

  const activateNode = (event: React.MouseEvent<HTMLButtonElement>, target: number) => {
    event.preventDefault();
    event.stopPropagation();
    const pendingTouch = touchPendingRef.current;
    touchPendingRef.current = null;
    if (pendingTouch?.target === target && !pendingTouch.confirmed) return;
    setTouchPreviewScene(null);
    onNavigate?.(target, 0);
  };

  return (
    <nav
      className={styles.networkNav}
      data-testid="water-network-navigation"
      data-topic-navigation="true"
      data-navigation-geometry="spatial-node"
      data-navigation-carrier="water-network-node-map"
      data-navigation-invocation="proximity-reveal"
      data-navigation-feedback="history-trail"
      aria-label={lang === "zh" ? "水网场景导航" : "Water-network scene navigation"}
      onClick={(event) => event.stopPropagation()}
      onTouchStart={(event) => event.stopPropagation()}
    >
      <svg className={styles.navTrail} viewBox="0 0 160 620" aria-hidden="true">
        <path className={styles.navTrailBase} d="M40 52 C122 138 28 224 112 312 C24 394 126 478 56 568" />
        <path
          className={styles.navTrailHistory}
          pathLength="1"
          style={{ strokeDashoffset: `${1 - Math.max(0, scene - 1) / 4}` }}
          d="M40 52 C122 138 28 224 112 312 C24 394 126 478 56 568"
        />
      </svg>
      {NAV_POSITIONS.map((position, index) => {
        const target = index + 1;
        const isActive = target === scene;
        const isHistory = target < scene;
        const isTouchPreview = touchPreviewScene === target;
        const navLabel = copy.scenes[index].nav;
        return (
          <button
            key={target}
            type="button"
            className={styles.navNode}
            style={{ left: `${position.x}cqw`, top: `${position.y}cqh` }}
            data-active={isActive ? "true" : "false"}
            data-history={isHistory ? "true" : "false"}
            data-touch-preview={isTouchPreview ? "true" : "false"}
            aria-current={isActive ? "step" : undefined}
            aria-label={`${copy.navOpen} ${target}: ${navLabel}`}
            onTouchStart={(event) => armTouchPreview(event, target)}
            onClick={(event) => activateNode(event, target)}
          >
            <span className={styles.navNodeDot} aria-hidden="true" />
            <span className={styles.navNodeLabel}>{navLabel}</span>
          </button>
        );
      })}
    </nav>
  );
}

export default function EngineeringWhiteboardWaterTower({
  scene,
  beat,
  language,
  isThumbnail,
  reducedMotion,
  onNavigate,
}: BespokeStyleProps) {
  useFonts();
  const settled = reducedMotion || isThumbnail;
  const safeScene = Math.min(5, Math.max(1, scene));
  return (
    <div
      className={`${styles.root} ${settled ? styles.reduced : ""}`}
      data-water-tower-topic="true"
      data-reduced-motion={settled ? "true" : "false"}
      data-transition-score="grid-reveal|push-y|focus-swap|split-merge"
    >
      <Header lang={language} scene={safeScene} />
      <div className={styles.canvas}>
        <SpatialSceneTrack
          scene={safeScene}
          beat={beat}
          transitionMap={TRANSITION_MAP}
          transitionDurationMs={620}
          reducedMotion={settled}
          beatLayoutModes={BEAT_LAYOUT_MODES}
          renderScene={(sceneId, sceneBeat) => renderScene(sceneId, sceneBeat, language)}
        />
      </div>
      <Takeaway lang={language} scene={safeScene} beat={beat} />
      {!isThumbnail && (
        <WaterNetworkNavigation scene={safeScene} lang={language} onNavigate={onNavigate} />
      )}
    </div>
  );
}

export const waterTowerTopic = defineStyleTopic({
  id: TOPIC_ID,
  topic: { en: "Water Tower", zh: "城市水塔" },
  model: "GPT 5.6 Sol",
  component: EngineeringWhiteboardWaterTower,
  getMetadata,
  navigation: {
    geometry: "spatial-node",
    carrier: "water-network-node-map",
    invocation: "proximity-reveal",
    feedback: "history-trail",
  },
  sources: WATER_TOWER_SOURCES,
  transitionScore: WATER_TOWER_TRANSITION_SCORE,
});

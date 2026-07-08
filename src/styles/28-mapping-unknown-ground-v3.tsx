/* Expedition Screenprint · v3 · Mapping Unknown Ground
 * A WPA-poster expedition into unknown territory. Flat limited spot inks laid
 * as unmodulated planes, a felt horizon giving each slide place, visible
 * screenprint grain and misfit. Poster-static / gentle drift only. cqw/cqh only.
 */
import { useEffect } from "react";
import type { BespokeStyleProps, StyleMetadata } from "../types";
import { defineStyleVersion } from "./version";
import SpatialSceneTrack from "./SpatialSceneTrack";
import type { SceneTransitionMap } from "./SpatialSceneTrack";
import { useFLIP } from "../hooks/useFLIP";
import styles from "./28-mapping-unknown-ground-v3.module.css";

type Lang = "en" | "zh";

const FONT_LINK_ID = "font-expedition-screenprint-v3";
const FONT_HREF =
  "https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Oswald:wght@500;600&family=Archivo+Narrow:wght@500;600&family=Noto+Sans+SC:wght@500;700&display=swap";

function useFonts() {
  useEffect(() => {
    if (document.getElementById(FONT_LINK_ID)) return;
    const link = document.createElement("link");
    link.id = FONT_LINK_ID;
    link.rel = "stylesheet";
    link.href = FONT_HREF;
    document.head.appendChild(link);
  }, []);
}

const TRANSITIONS: SceneTransitionMap = {
  "1->2": "slide-x",
  "2->3": "slide-y",
  "3->4": "slide-x",
  "4->5": "fade",
};

const BEAT_LAYOUT_MODES = { 2: "motion", 3: "reserved", 4: "motion" } as Record<
  number,
  "motion" | "reserved"
>;

// ── bilingual copy (single source; en/zh structurally identical) ─────────────
interface Beat {
  action: string;
  title: string;
  body: string;
}
interface SceneCopy {
  title: string;
  beats: Beat[];
}
interface Copy {
  theme: string;
  density: string;
  scenes: SceneCopy[];
  s1: { l1: string; l2: string; sub: string };
  s2: { start: string; end: string };
  s3: { kicker: string; line: string; camps: { no: string; sub: string }[] };
  s4: { alt: string; altSub: string };
  s5: { mark: string; line: string };
  scale: string[];
}

const COPY: Record<Lang, Copy> = {
  en: {
    theme: "Mapping Unknown Ground",
    density: "Poster · civic",
    scenes: [
      {
        title: "The Trailhead",
        beats: [
          {
            action: "Set out",
            title: "Unknown Ground",
            body: "A public expedition begins where the map runs out.",
          },
        ],
      },
      {
        title: "The Route",
        beats: [
          {
            action: "Plot the line",
            title: "Chart the Way",
            body: "A single stylized path is drawn across the open plane.",
          },
          {
            action: "Commit",
            title: "Cross the Plane",
            body: "The route commits — one crossing from edge to ridge.",
          },
        ],
      },
      {
        title: "The Camps",
        beats: [
          {
            action: "Raise camp one",
            title: "First Waypoint",
            body: "Basecamp is pitched at the foot of the unknown.",
          },
          {
            action: "Raise camp two",
            title: "Second Waypoint",
            body: "The mid-camp holds the line halfway up.",
          },
          {
            action: "Raise camp three",
            title: "Third Waypoint",
            body: "The high camp waits below the final push.",
          },
        ],
      },
      {
        title: "The Summit",
        beats: [
          {
            action: "Reach the top",
            title: "High Point",
            body: "The headline lands inside the ridge itself.",
          },
          {
            action: "Read the altitude",
            title: "Mark the Height",
            body: "Altitude is stamped flat into the ink plane.",
          },
        ],
      },
      {
        title: "The Marker",
        beats: [
          {
            action: "Sign the print",
            title: "Printer's Mark",
            body: "A plain attribution closes the poster like a colophon.",
          },
        ],
      },
    ],
    s1: {
      l1: "Unknown",
      l2: "Ground",
      sub: "An expedition into territory the map has not yet named.",
    },
    s2: { start: "Trailhead", end: "Ridge" },
    s3: {
      kicker: "Three Camps",
      line: "Waypoints marked in flat ink along the ascending line.",
      camps: [
        { no: "Camp I", sub: "Basecamp" },
        { no: "Camp II", sub: "Mid-Camp" },
        { no: "Camp III", sub: "High Camp" },
      ],
    },
    s4: { alt: "3,842 M", altSub: "Elevation Gained" },
    s5: { mark: "Surveyed", line: "Mapping Unknown Ground · Field Print No.28" },
    scale: ["Summit", "High Camp", "Route", "Mid-Camp", "Trailhead"],
  },
  zh: {
    theme: "勘探未知",
    density: "海报 · 公共",
    scenes: [
      {
        title: "起点",
        beats: [
          {
            action: "出发",
            title: "未知之境",
            body: "一场公共远征，始于地图的尽头。",
          },
        ],
      },
      {
        title: "路线",
        beats: [
          {
            action: "描出线条",
            title: "标定去路",
            body: "一条风格化的路径横越开阔的平面。",
          },
          {
            action: "确定",
            title: "横越平面",
            body: "路线落定——一次从边缘到山脊的穿越。",
          },
        ],
      },
      {
        title: "营地",
        beats: [
          {
            action: "扎起一号营",
            title: "第一站点",
            body: "大本营驻扎在未知的山脚。",
          },
          {
            action: "扎起二号营",
            title: "第二站点",
            body: "中途营地守住半程之线。",
          },
          {
            action: "扎起三号营",
            title: "第三站点",
            body: "高山营地静候最后的冲顶。",
          },
        ],
      },
      {
        title: "顶峰",
        beats: [
          {
            action: "登顶",
            title: "至高之点",
            body: "标题落进山脊本身。",
          },
          {
            action: "读取海拔",
            title: "标记高度",
            body: "海拔被平印进油墨的平面里。",
          },
        ],
      },
      {
        title: "印记",
        beats: [
          {
            action: "落款",
            title: "印刷者标记",
            body: "一行朴素的署名像版权页般收束海报。",
          },
        ],
      },
    ],
    s1: {
      l1: "未知",
      l2: "之境",
      sub: "一次进入地图尚未命名之地的远征。",
    },
    s2: { start: "起点", end: "山脊" },
    s3: {
      kicker: "三处营地",
      line: "沿上行的线条以平印油墨标出的站点。",
      camps: [
        { no: "一号营", sub: "大本营" },
        { no: "二号营", sub: "中途营" },
        { no: "三号营", sub: "高山营" },
      ],
    },
    s4: { alt: "3,842 米", altSub: "累计爬升" },
    s5: { mark: "已勘测", line: "勘探未知 · 田野印本 第28号" },
    scale: ["顶峰", "高山营", "路线", "中途营", "起点"],
  },
};

// shared felt-horizon anchor — flat overlapping planes, no light sim
function Backdrop() {
  return (
    <>
      <div className={styles.sky} />
      <div className={styles.sun} />
      <div className={styles.ridgeBack} />
      <div className={styles.horizonLine} />
      <div className={styles.ground} />
    </>
  );
}

// ── scenes ───────────────────────────────────────────────────────────────
function Scene1({ language }: { language: Lang }) {
  const c = COPY[language].s1;
  return (
    <div className={styles.scene}>
      <Backdrop />
      <div className={styles.s1Wrap}>
        <div className={styles.headlineStack}>
          <h1 className={styles.headlineMisfit} aria-hidden="true">
            {c.l1}
            <br />
            {c.l2}
          </h1>
          <h1 className={`${styles.headline} ${styles.s1Headline}`}>
            {c.l1}
            <br />
            {c.l2}
          </h1>
        </div>
      </div>
      <div className={styles.trailMark} />
      <p className={styles.s1Sub}>{c.sub}</p>
    </div>
  );
}

function Scene2({
  language,
  beat,
  isActive,
  reducedMotion,
  isThumbnail,
}: {
  language: Lang;
  beat: number;
  isActive: boolean;
  reducedMotion: boolean;
  isThumbnail: boolean;
}) {
  const s = COPY[language].scenes[1];
  const tags = COPY[language].s2;
  const b = Math.min(beat, 1);
  const { ref } = useFLIP<HTMLDivElement>({
    watch: [b],
    disabled: reducedMotion || isThumbnail || !isActive,
    duration: 620,
    easing: "cubic-bezier(0.22, 0.61, 0.36, 1)",
    selector: '[data-beat-layout-item="true"]',
  });
  return (
    <div className={styles.scene}>
      <Backdrop />
      <svg
        className={styles.routeSvg}
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          className={styles.routePath}
          d="M8 78 C 26 66, 34 74, 46 54 S 68 40, 90 20"
          style={{ strokeDashoffset: b >= 1 ? 0 : 150 }}
        />
        <circle className={styles.routeNode} cx="8" cy="78" r="1.6" />
        <circle
          className={styles.routeNode}
          cx="90"
          cy="20"
          r="1.6"
          style={{ opacity: b >= 1 ? 1 : 0.25 }}
        />
      </svg>
      <span className={`${styles.routeTag} ${styles.routeTagStart}`}>
        {tags.start}
      </span>
      <span className={`${styles.routeTag} ${styles.routeTagEnd}`}>
        {tags.end}
      </span>
      <div
        ref={ref}
        className={styles.s2Items}
        data-beat={b}
        data-beat-layout-container="true"
        data-beat-layout-mode="motion"
      >
        <div className={styles.s2Block}>
          <h2 className={styles.s2Title} data-beat-layout-item="true">
            {s.beats[b].title}
          </h2>
          <p className={styles.s2Body} data-beat-layout-item="true">
            {s.beats[b].body}
          </p>
        </div>
      </div>
    </div>
  );
}

function Scene3({ language, beat }: { language: Lang; beat: number }) {
  const s3 = COPY[language].s3;
  return (
    <div className={styles.scene}>
      <Backdrop />
      <h2 className={styles.s3Kicker}>{s3.kicker}</h2>
      <p className={styles.s3Line}>{s3.line}</p>
      <div
        className={styles.campsRow}
        data-beat-layout-container="true"
        data-beat-layout-mode="reserved"
      >
        {s3.camps.map((camp, i) => (
          <div
            key={camp.no}
            className={`${styles.camp} ${i <= beat ? styles.campActive : ""}`}
            data-beat-layout-item="true"
          >
            <div className={styles.campTent} />
            <span className={styles.campNo}>{camp.no}</span>
            <span className={styles.campSub}>{camp.sub}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Scene4({
  language,
  beat,
  isActive,
  reducedMotion,
  isThumbnail,
}: {
  language: Lang;
  beat: number;
  isActive: boolean;
  reducedMotion: boolean;
  isThumbnail: boolean;
}) {
  const s = COPY[language].scenes[3];
  const s4 = COPY[language].s4;
  const b = Math.min(beat, 1);
  const { ref } = useFLIP<HTMLDivElement>({
    watch: [b],
    disabled: reducedMotion || isThumbnail || !isActive,
    duration: 620,
    easing: "cubic-bezier(0.22, 0.61, 0.36, 1)",
    selector: '[data-beat-layout-item="true"]',
  });
  return (
    <div className={styles.scene}>
      <div className={styles.sky} />
      <div className={styles.sun} />
      <div className={styles.ridge4} />
      <div className={styles.ridge4Front} />
      <div className={styles.horizonLine} />
      <div
        ref={ref}
        className={styles.summitWrap}
        data-beat={b}
        data-beat-layout-container="true"
        data-beat-layout-mode="motion"
      >
        <h2 className={styles.summitHead} data-beat-layout-item="true">
          {s.beats[b].title}
        </h2>
        <div className={styles.summitAlt} data-beat-layout-item="true">
          <span className={styles.summitAltNo}>{s4.alt}</span>
          <span className={styles.summitAltSub}>{s4.altSub}</span>
        </div>
      </div>
    </div>
  );
}

function Scene5({ language }: { language: Lang }) {
  const s5 = COPY[language].s5;
  return (
    <div className={styles.scene}>
      <Backdrop />
      <div className={styles.markerWrap}>
        <div className={styles.printMark}>
          <div className={styles.markRing} />
          <div className={styles.markCrossV} />
          <div className={styles.markCrossH} />
          <div className={styles.markDot} />
        </div>
        <div className={styles.colophon}>
          <h2 className={styles.coloMark}>{s5.mark}</h2>
          <span className={styles.coloLine}>{s5.line}</span>
        </div>
      </div>
    </div>
  );
}

// ── N1 nav · altitude / horizon tick scale (climbs as scenes advance) ────────
function AltitudeScale({
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
  const labels = COPY[language].scale; // index 0 = summit (top) … 4 = trailhead
  // tick i (top→bottom) maps to scene (5 - i); climber rides current scene.
  const topFor = (sceneNo: number) => 8 + ((5 - sceneNo) / 4) * 84;
  return (
    <div
      className={styles.scale}
      onClick={(e) => e.stopPropagation()}
      aria-label="altitude scale"
    >
      <div className={styles.scaleAxis} />
      {labels.map((label, i) => {
        const sceneNo = 5 - i;
        return (
          <button
            key={label}
            type="button"
            className={`${styles.tick} ${
              sceneNo === scene ? styles.tickActive : ""
            }`}
            style={{ top: `${topFor(sceneNo)}cqh` }}
            onClick={(e) => {
              e.stopPropagation();
              onNavigate?.(sceneNo, 0);
            }}
          >
            <span className={styles.tickLabel}>{label}</span>
            <span className={styles.tickMark} />
          </button>
        );
      })}
      <div className={styles.climber} style={{ top: `${topFor(scene)}cqh` }} />
    </div>
  );
}

// ── root component ───────────────────────────────────────────────────────
function MappingUnknownGroundV3({
  scene,
  beat,
  language,
  isThumbnail,
  reducedMotion,
  onNavigate,
}: BespokeStyleProps) {
  useFonts();
  const still = reducedMotion || isThumbnail;
  return (
    <div className={`${styles.root} ${still ? styles.static : ""}`}>
      <SpatialSceneTrack
        scene={scene}
        beat={beat}
        transitionKind="slide-x"
        transitionMap={TRANSITIONS}
        reducedMotion={still}
        beatLayoutModes={BEAT_LAYOUT_MODES}
        renderScene={(sceneId, sceneBeat, isActive) => {
          if (sceneId === 1) return <Scene1 language={language} />;
          if (sceneId === 2)
            return (
              <Scene2
                language={language}
                beat={sceneBeat}
                isActive={isActive}
                reducedMotion={reducedMotion}
                isThumbnail={isThumbnail}
              />
            );
          if (sceneId === 3)
            return <Scene3 language={language} beat={sceneBeat} />;
          if (sceneId === 4)
            return (
              <Scene4
                language={language}
                beat={sceneBeat}
                isActive={isActive}
                reducedMotion={reducedMotion}
                isThumbnail={isThumbnail}
              />
            );
          return <Scene5 language={language} />;
        }}
      />
      <AltitudeScale
        scene={scene}
        language={language}
        isThumbnail={isThumbnail}
        onNavigate={onNavigate}
      />
    </div>
  );
}

export function getMetadata(lang: Lang): StyleMetadata {
  const c = COPY[lang];
  return {
    id: "28",
    band: "craft-cultural",
    name: lang === "en" ? "Expedition Screenprint" : "探险丝网印",
    theme: c.theme,
    densityLabel: c.density,
    heroScene: 4,
    colors: { bg: "#e9d6ab", ink: "#1c3a2a", panel: "#d9581f" },
    typography: { header: "Bebas Neue", body: "Archivo Narrow" },
    tags:
      lang === "en"
        ? ["civic", "outdoors", "flat-ink", "poster", "screenprint", "static-drift"]
        : ["公共", "户外", "平印", "海报", "丝网印", "静态微移"],
    fonts: ["Bebas Neue", "Oswald", "Archivo Narrow", "cjk:Noto Sans SC"],
    scenes: c.scenes.map((s, i) => ({
      id: i + 1,
      title: s.title,
      beats: s.beats.map((b, j) => ({
        id: j,
        action: b.action,
        title: b.title,
        body: b.body,
      })),
    })),
  };
}

export const mappingUnknownGroundV3Version = defineStyleVersion({
  id: "v3",
  topic: { en: "Mapping Unknown Ground", zh: "勘探未知" },
  model: "Claude-Opus-4.8",
  component: MappingUnknownGroundV3,
  getMetadata,
});

export default MappingUnknownGroundV3;

/**
 * 09 · Subway Map of Intent · v3 — "Three Teams, One Launch"
 *
 * Three teams (design / engineering / marketing) drawn as three transit lines
 * that converge on one interchange station: launch day. Light signage ground,
 * three distinct functional line colors, flat diagrammatic depth, motion that
 * travels along the tracks (lines draw station-to-station, nothing off-track).
 *
 * Isolation: authored only from the shared brief + the Subway Map of Intent DNA.
 * No other style, registry, or workbench file was consulted.
 */

import { useEffect } from "react";
import type { ReactNode } from "react";
import type { BespokeStyleProps, StyleMetadata } from "../types";
import { defineStyleTopic } from "./topic";
import SpatialSceneTrack from "./SpatialSceneTrack";
import type { SceneTransitionMap } from "./SpatialSceneTrack";
import { useFLIP } from "../hooks/useFLIP";
import styles from "./three-teams-launch.module.css";

/* ── Signage palette (functional route colors, real hex) ──────────────── */
const GROUND = "#F3F1EC"; // warm neutral paper
const INK = "#1B1B22"; // near-black signage ink
const PANEL = "#FFFFFF";
const MUTE = "#B7B2A6"; // dormant track / dim station ring
const HAIR = "#DAD6CC"; // hairline dividers

const DESIGN = "#E5397F"; // magenta line
const ENGINEER = "#2E6BE6"; // blue line
const MARKET = "#F5A524"; // amber line

const LINE_FONT = "Inter";
const FONT_LINK_ID = "font-subway-map-intent-v3";
const FONT_HREF =
  "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap";

const BEATS = [1, 3, 3, 2, 1] as const;

/* ── Network geometry (SVG user units in a 0..192 × 0..108 viewBox) ───── */
type Team = {
  key: "design" | "engineer" | "market";
  color: string;
  labelEn: string;
  labelZh: string;
  path: string; // route from depot into the interchange
  labelXY: [number, number];
  stations: [number, number][];
};

const INTERCHANGE: [number, number] = [128, 54];
const TERMINUS: [number, number] = [176, 54];

const TEAMS: Team[] = [
  {
    key: "design",
    color: DESIGN,
    labelEn: "Design",
    labelZh: "设计线",
    path: "M20,30 H92 L116,54 H128",
    labelXY: [20, 22],
    stations: [
      [32, 30],
      [56, 30],
      [80, 30],
    ],
  },
  {
    key: "engineer",
    color: ENGINEER,
    labelEn: "Engineering",
    labelZh: "工程线",
    path: "M20,54 H128",
    labelXY: [20, 47],
    stations: [
      [32, 54],
      [60, 54],
      [88, 54],
    ],
  },
  {
    key: "market",
    color: MARKET,
    labelEn: "Marketing",
    labelZh: "市场线",
    path: "M20,78 H92 L116,54 H128",
    labelXY: [20, 88],
    stations: [
      [32, 78],
      [56, 78],
      [80, 78],
    ],
  },
];

const TRUNK = "M128,54 H176";

/* ── Font loader (dedup guarded) ──────────────────────────────────────── */
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

/* ── The network map — flat, diagrammatic, one legible plane ──────────── */
type MapProps = {
  shownLines: number; // how many team lines are on the plane (0..3)
  dormant: boolean; // scene 1 — lines present but sleeping
  litTeams: number; // stations lit cumulatively for teams [0..count)
  interchange: boolean; // interchange node energized
  trunk: boolean; // shared launch trunk drawn to terminus
  complete: boolean; // final terminus roundel highlighted
  animate: boolean; // allow along-track draw animation
  lang: "en" | "zh";
};

function NetworkMap({
  shownLines,
  dormant,
  litTeams,
  interchange,
  trunk,
  complete,
  animate,
  lang,
}: MapProps) {
  return (
    <svg
      viewBox="0 0 192 108"
      width="100%"
      height="100%"
      role="img"
      aria-label="Transit network of three team lines meeting at one launch station"
      style={{ display: "block", overflow: "visible" }}
    >
      {/* faint plane grid — signage under-print */}
      <g stroke={HAIR} strokeWidth={0.15} opacity={0.6}>
        <line x1="20" y1="30" x2="176" y2="30" />
        <line x1="20" y1="54" x2="176" y2="54" />
        <line x1="20" y1="78" x2="176" y2="78" />
      </g>

      {/* shared trunk to terminus (behind the team lines) */}
      <path
        d={TRUNK}
        fill="none"
        stroke={trunk || complete ? INK : MUTE}
        strokeWidth={trunk || complete ? 3 : 2}
        strokeLinecap="round"
        opacity={trunk || complete ? 1 : 0.4}
      />

      {/* team routes */}
      {TEAMS.map((team, i) => {
        const shown = i < shownLines;
        if (!shown) return null;
        const isNewest = i === shownLines - 1;
        const drawing = animate && isNewest && !dormant;
        const stroke = dormant ? MUTE : team.color;
        return (
          <g key={team.key} opacity={shown ? 1 : 0}>
            <path
              d={team.path}
              fill="none"
              stroke={stroke}
              strokeWidth={dormant ? 2 : 3}
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={dormant ? 0.4 : 1}
              pathLength={100}
              className={drawing ? styles.drawLine : undefined}
              style={drawing ? { strokeDasharray: 100 } : undefined}
            />
            {/* stations along the line */}
            {team.stations.map(([sx, sy], si) => {
              const lit = !dormant && i < litTeams;
              return (
                <circle
                  key={si}
                  cx={sx}
                  cy={sy}
                  r={lit ? 2.1 : 1.6}
                  fill={lit ? PANEL : GROUND}
                  stroke={lit ? team.color : MUTE}
                  strokeWidth={lit ? 1.1 : 0.8}
                  opacity={dormant ? 0.5 : lit ? 1 : 0.55}
                  className={lit && animate ? styles.stationPop : undefined}
                  style={
                    lit && animate ? { animationDelay: `${si * 90}ms` } : undefined
                  }
                />
              );
            })}
            {/* line label (roundel-style tag) */}
            <text
              x={team.labelXY[0]}
              y={team.labelXY[1]}
              fontFamily={LINE_FONT}
              fontSize={3.4}
              fontWeight={700}
              fill={dormant ? MUTE : team.color}
              letterSpacing={0.1}
            >
              {lang === "en" ? team.labelEn : team.labelZh}
            </text>
          </g>
        );
      })}

      {/* interchange node — the deliberate junction */}
      <g>
        {interchange && (
          <circle
            cx={INTERCHANGE[0]}
            cy={INTERCHANGE[1]}
            r={6.6}
            fill="none"
            stroke={INK}
            strokeWidth={0.9}
            opacity={0.25}
            className={animate ? styles.interchangePulse : undefined}
          />
        )}
        <circle
          cx={INTERCHANGE[0]}
          cy={INTERCHANGE[1]}
          r={interchange || complete ? 4.4 : 3.2}
          fill={PANEL}
          stroke={INK}
          strokeWidth={interchange || complete ? 1.6 : 1}
          opacity={shownLines > 0 ? 1 : 0.5}
        />
        <circle
          cx={INTERCHANGE[0]}
          cy={INTERCHANGE[1]}
          r={interchange || complete ? 1.7 : 1.2}
          fill={INK}
          opacity={interchange || complete ? 1 : 0.45}
        />
        <text
          x={INTERCHANGE[0]}
          y={INTERCHANGE[1] - 8}
          textAnchor="middle"
          fontFamily={LINE_FONT}
          fontSize={3.2}
          fontWeight={700}
          fill={INK}
          opacity={interchange || complete ? 1 : 0.4}
        >
          {lang === "en" ? "Launch Day" : "发布日"}
        </text>
      </g>

      {/* terminus roundel */}
      <g opacity={trunk || complete ? 1 : 0.35}>
        <circle
          cx={TERMINUS[0]}
          cy={TERMINUS[1]}
          r={complete ? 4 : 3}
          fill={complete ? INK : PANEL}
          stroke={INK}
          strokeWidth={1.4}
        />
        <text
          x={TERMINUS[0]}
          y={TERMINUS[1] + 9}
          textAnchor="middle"
          fontFamily={LINE_FONT}
          fontSize={3}
          fontWeight={700}
          fill={INK}
          opacity={complete ? 1 : 0.6}
        >
          {lang === "en" ? "One Launch" : "同一发布"}
        </text>
      </g>
    </svg>
  );
}

/* ── Shared scene chrome ──────────────────────────────────────────────── */
function SceneFrame({
  index,
  total,
  kicker,
  title,
  children,
}: {
  index: string;
  total: string;
  kicker: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        padding: "5.5cqh 6cqw 4.5cqh",
        boxSizing: "border-box",
        color: INK,
        fontFamily: LINE_FONT,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: "1.6cqw",
          borderBottom: `0.12cqw solid ${HAIR}`,
          paddingBottom: "1.6cqh",
        }}
      >
        <span
          style={{
            fontSize: "2cqh",
            fontWeight: 800,
            letterSpacing: "0.05cqw",
            color: ENGINEER,
          }}
        >
          {index}
          <span style={{ color: MUTE, fontWeight: 600 }}> / {total}</span>
        </span>
        <span
          style={{
            fontSize: "1.9cqh",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.24cqw",
            color: MUTE,
          }}
        >
          {kicker}
        </span>
        <span style={{ flex: 1 }} />
        <span style={{ fontSize: "2.6cqh", fontWeight: 700 }}>{title}</span>
      </div>
      <div style={{ flex: 1, minHeight: 0, display: "flex", marginTop: "2.2cqh" }}>
        {children}
      </div>
    </div>
  );
}

/* ── Scene 1 · Title — network dormant, one beat ──────────────────────── */
function SceneTitle({ lang }: { lang: "en" | "zh" }) {
  const en = lang === "en";
  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          padding: "6cqh 6cqw",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          zIndex: 2,
          pointerEvents: "none",
        }}
      >
        <div>
          <div
            style={{
              fontSize: "2cqh",
              fontWeight: 600,
              letterSpacing: "0.3cqw",
              textTransform: "uppercase",
              color: MUTE,
            }}
          >
            {en ? "Intent Transit · Line Network" : "意图地铁 · 线网图"}
          </div>
          <h1
            style={{
              margin: "1.4cqh 0 0",
              fontSize: en ? "8.4cqh" : "9cqh",
              lineHeight: 1.02,
              fontWeight: 800,
              letterSpacing: en ? "-0.05cqw" : "0.3cqw",
              maxWidth: "58cqw",
            }}
          >
            {en ? "Three Teams," : "三队"}
            <br />
            <span style={{ color: DESIGN }}>{en ? "One Launch" : "一发"}</span>
          </h1>
        </div>
        <p
          style={{
            margin: 0,
            fontSize: "2.8cqh",
            fontWeight: 500,
            color: INK,
            maxWidth: "50cqw",
          }}
        >
          {en
            ? "Design, engineering, and marketing — three lines sharing one destination."
            : "设计、工程、市场——三条线，同一终点。"}
        </p>
      </div>
      <div style={{ position: "absolute", inset: 0, zIndex: 1, opacity: 0.9 }}>
        <NetworkMap
          shownLines={3}
          dormant
          litTeams={0}
          interchange={false}
          trunk={false}
          complete={false}
          animate={false}
          lang={lang}
        />
      </div>
    </div>
  );
}

/* ── Scene 2 · The lines — motion (FLIP reflow) · 3 beats ─────────────── */
function SceneLines({
  beat,
  isActive,
  reducedMotion,
  lang,
}: {
  beat: number;
  isActive: boolean;
  reducedMotion: boolean;
  lang: "en" | "zh";
}) {
  const en = lang === "en";
  const shown = Math.min(beat + 1, 3);
  const cards = TEAMS.slice(0, shown);
  const { ref } = useFLIP<HTMLDivElement>({
    watch: [beat],
    disabled: reducedMotion || !isActive,
    duration: 480,
    easing: "cubic-bezier(0.34, 1.56, 0.64, 1)",
    selector: '[data-beat-layout-item="true"]',
  });

  const copy = [
    {
      title: en ? "Design Line" : "设计线",
      body: en ? "The design track leaves the depot first." : "设计轨道率先驶出车库。",
    },
    {
      title: en ? "Engineering Line" : "工程线",
      body: en ? "Engineering runs parallel on its own track." : "工程沿自己的轨道并行。",
    },
    {
      title: en ? "Marketing Line" : "市场线",
      body: en ? "Marketing joins; three lines now live." : "市场加入，三线齐发。",
    },
  ];

  return (
    <div style={{ display: "flex", width: "100%", height: "100%", gap: "3cqw" }}>
      <div style={{ flex: "1 1 62%", minWidth: 0 }}>
        <NetworkMap
          shownLines={shown}
          dormant={false}
          litTeams={0}
          interchange={false}
          trunk={false}
          complete={false}
          animate={!reducedMotion && isActive}
          lang={lang}
        />
      </div>
      <div
        ref={ref}
        data-beat-layout-container="true"
        data-beat-layout-mode="motion"
        style={{
          flex: "1 1 34%",
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
          gap: "1.6cqh",
          justifyContent: "center",
        }}
      >
        <div
          data-beat-layout-item="true"
          style={{
            fontSize: "1.9cqh",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.2cqw",
            color: MUTE,
          }}
        >
          {en ? "Lines entering service" : "陆续发车的线路"}
        </div>
        {cards.map((team, i) => (
          <div
            key={team.key}
            data-beat-layout-item="true"
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "1.4cqw",
              background: PANEL,
              border: `0.12cqw solid ${HAIR}`,
              borderLeft: `0.6cqw solid ${team.color}`,
              borderRadius: "1.2cqh",
              padding: "1.8cqh 1.8cqw",
            }}
          >
            <span
              style={{
                width: "2.4cqh",
                height: "2.4cqh",
                borderRadius: "50%",
                background: team.color,
                flex: "0 0 auto",
                marginTop: "0.4cqh",
              }}
            />
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: "2.6cqh", fontWeight: 700, color: INK }}>
                {copy[i].title}
              </div>
              <div style={{ fontSize: "2cqh", fontWeight: 500, color: "#4A4A55" }}>
                {copy[i].body}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Scene 3 · The stations — reserved (fixed slots) · 3 beats ────────── */
function SceneStations({ beat, lang }: { beat: number; lang: "en" | "zh" }) {
  const en = lang === "en";
  const litTeams = Math.min(beat + 1, 3);
  const rows = [
    {
      color: DESIGN,
      title: en ? "Design Milestones" : "设计里程碑",
      stops: en ? "Research · Mockups · Specs" : "调研 · 样稿 · 规范",
    },
    {
      color: ENGINEER,
      title: en ? "Engineering Milestones" : "工程里程碑",
      stops: en ? "API · Build · Hardening" : "接口 · 构建 · 加固",
    },
    {
      color: MARKET,
      title: en ? "Marketing Milestones" : "市场里程碑",
      stops: en ? "Story · Assets · Press" : "故事 · 素材 · 发稿",
    },
  ];
  return (
    <div style={{ display: "flex", width: "100%", height: "100%", gap: "3cqw" }}>
      <div style={{ flex: "1 1 62%", minWidth: 0 }}>
        <NetworkMap
          shownLines={3}
          dormant={false}
          litTeams={litTeams}
          interchange={false}
          trunk={false}
          complete={false}
          animate={false}
          lang={lang}
        />
      </div>
      {/* reserved: all three slots present from beat 0; opacity/weight toggles */}
      <div
        data-beat-layout-container="true"
        data-beat-layout-mode="reserved"
        style={{
          flex: "1 1 34%",
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
          gap: "1.8cqh",
          justifyContent: "center",
        }}
      >
        {rows.map((row, i) => {
          const lit = i < litTeams;
          return (
            <div
              key={i}
              data-beat-layout-item="true"
              style={{
                background: PANEL,
                border: `0.12cqw solid ${lit ? row.color : HAIR}`,
                borderRadius: "1.2cqh",
                padding: "1.8cqh 1.8cqw",
                opacity: lit ? 1 : 0.4,
                transform: lit ? "translateX(0)" : "translateX(0.6cqw)",
                transition: "opacity 360ms ease, transform 360ms ease",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1.2cqw",
                }}
              >
                <span
                  style={{
                    width: "2cqh",
                    height: "2cqh",
                    borderRadius: "50%",
                    border: `0.3cqw solid ${row.color}`,
                    background: lit ? row.color : GROUND,
                  }}
                />
                <span style={{ fontSize: "2.5cqh", fontWeight: 700, color: INK }}>
                  {row.title}
                </span>
              </div>
              <div
                style={{
                  marginTop: "0.9cqh",
                  fontSize: "2cqh",
                  fontWeight: 600,
                  letterSpacing: "0.06cqw",
                  color: lit ? row.color : MUTE,
                }}
              >
                {row.stops}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Scene 4 · The interchange — motion (FLIP collapse) · 2 beats ─────── */
function SceneInterchange({
  beat,
  isActive,
  reducedMotion,
  lang,
}: {
  beat: number;
  isActive: boolean;
  reducedMotion: boolean;
  lang: "en" | "zh";
}) {
  const en = lang === "en";
  const locked = beat >= 1;
  const { ref } = useFLIP<HTMLDivElement>({
    watch: [beat],
    disabled: reducedMotion || !isActive,
    duration: 520,
    easing: "cubic-bezier(0.34, 1.56, 0.64, 1)",
    selector: '[data-beat-layout-item="true"]',
  });
  return (
    <div style={{ display: "flex", width: "100%", height: "100%", gap: "3cqw" }}>
      <div style={{ flex: "1 1 62%", minWidth: 0 }}>
        <NetworkMap
          shownLines={3}
          dormant={false}
          litTeams={3}
          interchange
          trunk={locked}
          complete={false}
          animate={!reducedMotion && isActive}
          lang={lang}
        />
      </div>
      <div
        ref={ref}
        data-beat-layout-container="true"
        data-beat-layout-mode="motion"
        style={{
          flex: "1 1 34%",
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
          gap: "1.6cqh",
          justifyContent: "center",
        }}
      >
        <div
          data-beat-layout-item="true"
          style={{
            fontSize: "1.9cqh",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.2cqw",
            color: MUTE,
          }}
        >
          {locked
            ? en
              ? "One platform"
              : "同一站台"
            : en
              ? "Lines arriving"
              : "各线抵达"}
        </div>
        {locked ? (
          <div
            data-beat-layout-item="true"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1.4cqw",
              background: INK,
              color: PANEL,
              borderRadius: "1.4cqh",
              padding: "2.4cqh 2cqw",
            }}
          >
            <span
              style={{
                display: "inline-flex",
                gap: "0.5cqw",
              }}
            >
              {TEAMS.map((t) => (
                <span
                  key={t.key}
                  style={{
                    width: "1.8cqh",
                    height: "1.8cqh",
                    borderRadius: "50%",
                    background: t.color,
                  }}
                />
              ))}
            </span>
            <div>
              <div style={{ fontSize: "3cqh", fontWeight: 800 }}>
                {en ? "Launch Day" : "发布日"}
              </div>
              <div style={{ fontSize: "2cqh", fontWeight: 500, opacity: 0.85 }}>
                {en ? "Three lines, one platform." : "三线，同一站台。"}
              </div>
            </div>
          </div>
        ) : (
          TEAMS.map((t) => (
            <div
              key={t.key}
              data-beat-layout-item="true"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1.2cqw",
                background: PANEL,
                border: `0.12cqw solid ${HAIR}`,
                borderLeft: `0.6cqw solid ${t.color}`,
                borderRadius: "1.2cqh",
                padding: "1.5cqh 1.6cqw",
              }}
            >
              <span
                style={{
                  width: "2cqh",
                  height: "2cqh",
                  borderRadius: "50%",
                  background: t.color,
                }}
              />
              <span style={{ fontSize: "2.4cqh", fontWeight: 700, color: INK }}>
                {en ? t.labelEn : t.labelZh}
              </span>
              <span style={{ flex: 1 }} />
              <span style={{ fontSize: "2cqh", fontWeight: 600, color: MUTE }}>
                {en ? "→ interchange" : "→ 换乘"}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

/* ── Scene 5 · Terminus — one destination, one beat ───────────────────── */
function SceneTerminus({ lang }: { lang: "en" | "zh" }) {
  const en = lang === "en";
  return (
    <div style={{ display: "flex", width: "100%", height: "100%", gap: "3cqw" }}>
      <div style={{ flex: "1 1 62%", minWidth: 0 }}>
        <NetworkMap
          shownLines={3}
          dormant={false}
          litTeams={3}
          interchange
          trunk
          complete
          animate={false}
          lang={lang}
        />
      </div>
      <div
        style={{
          flex: "1 1 34%",
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: "1.8cqh",
        }}
      >
        <div
          style={{
            fontSize: "2cqh",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.24cqw",
            color: MUTE,
          }}
        >
          {en ? "Terminus" : "终点站"}
        </div>
        <h2
          style={{
            margin: 0,
            fontSize: en ? "6.6cqh" : "7cqh",
            lineHeight: 1.05,
            fontWeight: 800,
            color: INK,
          }}
        >
          {en ? "One Destination" : "同一终点"}
        </h2>
        <p style={{ margin: 0, fontSize: "2.6cqh", fontWeight: 500, color: "#4A4A55" }}>
          {en
            ? "Separate tracks, one terminus: launch day."
            : "各行其道，终点唯一：发布日。"}
        </p>
        <div style={{ display: "flex", gap: "1cqw", marginTop: "0.6cqh" }}>
          {TEAMS.map((t) => (
            <span
              key={t.key}
              style={{
                fontSize: "1.9cqh",
                fontWeight: 700,
                color: t.color,
                border: `0.12cqw solid ${t.color}`,
                borderRadius: "3cqh",
                padding: "0.6cqh 1.2cqw",
              }}
            >
              {en ? t.labelEn : t.labelZh}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── N1 nav prototype — a route line with 5 station dots ──────────────── */
function RouteNav({
  scene,
  isThumbnail,
  onNavigate,
  lang,
}: {
  scene: number;
  isThumbnail: boolean;
  onNavigate?: (scene: number, beat: number) => void;
  lang: "en" | "zh";
}) {
  if (isThumbnail) return null;
  const labels =
    lang === "en"
      ? ["Title", "Lines", "Stations", "Interchange", "Terminus"]
      : ["起点", "三线", "站点", "换乘", "终点"];
  const fillPct = ((scene - 1) / 4) * 100;
  return (
    <div
      onClick={(e) => e.stopPropagation()}
      style={{
        position: "absolute",
        left: "6cqw",
        right: "6cqw",
        bottom: "2.6cqh",
        height: "5cqh",
        display: "flex",
        alignItems: "center",
        zIndex: 20,
      }}
    >
      {/* base track */}
      <div
        style={{
          position: "absolute",
          left: "2cqw",
          right: "2cqw",
          height: "0.5cqh",
          borderRadius: "0.5cqh",
          background: HAIR,
        }}
      />
      {/* filled connector up to current station */}
      <div
        style={{
          position: "absolute",
          left: "2cqw",
          width: `calc((100% - 4cqw) * ${fillPct / 100})`,
          height: "0.5cqh",
          borderRadius: "0.5cqh",
          background: `linear-gradient(90deg, ${DESIGN}, ${ENGINEER}, ${MARKET})`,
          transition: "width 420ms cubic-bezier(0.4,0,0.2,1)",
        }}
      />
      <div
        style={{
          position: "relative",
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          padding: "0 2cqw",
          boxSizing: "border-box",
        }}
      >
        {labels.map((label, i) => {
          const sceneNo = i + 1;
          const current = sceneNo === scene;
          const past = sceneNo < scene;
          return (
            <button
              key={label}
              onClick={(e) => {
                e.stopPropagation();
                onNavigate?.(sceneNo, 0);
              }}
              aria-label={`Go to ${label}`}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "0.6cqh",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                padding: 0,
                fontFamily: LINE_FONT,
              }}
            >
              <span
                style={{
                  width: current ? "2.4cqh" : "1.6cqh",
                  height: current ? "2.4cqh" : "1.6cqh",
                  borderRadius: "50%",
                  background: current || past ? PANEL : GROUND,
                  border: `${current ? "0.35cqw" : "0.22cqw"} solid ${
                    current ? INK : past ? ENGINEER : MUTE
                  }`,
                  boxSizing: "border-box",
                }}
              />
              <span
                style={{
                  fontSize: "1.6cqh",
                  fontWeight: current ? 700 : 500,
                  color: current ? INK : MUTE,
                }}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ── Root component ───────────────────────────────────────────────────── */
const TRANSITIONS: SceneTransitionMap = {
  "1->2": "slide-x",
  "2->3": "slide-x",
  "3->4": "scale-fade",
  "4->5": "slide-x",
};

function ThreeTeamsLaunchV3({
  scene,
  beat,
  language,
  isThumbnail,
  reducedMotion,
  onNavigate,
}: BespokeStyleProps) {
  useFonts();
  const settle = reducedMotion || isThumbnail;
  const total = String(BEATS.length).padStart(2, "0");

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        background: GROUND,
        color: INK,
        fontFamily: LINE_FONT,
        overflow: "hidden",
      }}
    >
      <SpatialSceneTrack
        scene={scene}
        beat={beat}
        transitionKind="slide-x"
        transitionMap={TRANSITIONS}
        reducedMotion={settle}
        beatLayoutModes={{ 2: "motion", 3: "reserved", 4: "motion" }}
        renderScene={(sceneId, sceneBeat, isActive) => {
          const idx = String(sceneId).padStart(2, "0");
          if (sceneId === 1) {
            return (
              <SceneFrame
                index={idx}
                total={total}
                kicker={language === "en" ? "Title" : "起点"}
                title={language === "en" ? "The Network" : "线网"}
              >
                <SceneTitle lang={language} />
              </SceneFrame>
            );
          }
          if (sceneId === 2) {
            return (
              <SceneFrame
                index={idx}
                total={total}
                kicker={language === "en" ? "The Lines" : "三条线"}
                title={language === "en" ? "Enter Service" : "陆续发车"}
              >
                <SceneLines
                  beat={sceneBeat}
                  isActive={isActive}
                  reducedMotion={settle}
                  lang={language}
                />
              </SceneFrame>
            );
          }
          if (sceneId === 3) {
            return (
              <SceneFrame
                index={idx}
                total={total}
                kicker={language === "en" ? "The Stations" : "沿途站点"}
                title={language === "en" ? "Milestones" : "里程碑"}
              >
                <SceneStations beat={sceneBeat} lang={language} />
              </SceneFrame>
            );
          }
          if (sceneId === 4) {
            return (
              <SceneFrame
                index={idx}
                total={total}
                kicker={language === "en" ? "The Interchange" : "换乘枢纽"}
                title={language === "en" ? "Converge" : "汇合"}
              >
                <SceneInterchange
                  beat={sceneBeat}
                  isActive={isActive}
                  reducedMotion={settle}
                  lang={language}
                />
              </SceneFrame>
            );
          }
          return (
            <SceneFrame
              index={idx}
              total={total}
              kicker={language === "en" ? "Terminus" : "终点站"}
              title={language === "en" ? "One Launch" : "同一发布"}
            >
              <SceneTerminus lang={language} />
            </SceneFrame>
          );
        }}
      />
      <RouteNav
        scene={scene}
        isThumbnail={isThumbnail}
        onNavigate={onNavigate}
        lang={language}
      />
    </div>
  );
}

/* ── Metadata — EN and ZH structurally identical (shape must match) ───── */
export function getMetadata(lang: "en" | "zh"): StyleMetadata {
  const en = lang === "en";
  return {
    id: "subway-map-of-intent",
    band: "balanced-hybrid",
    name: en ? "Subway Map of Intent" : "意图地铁图",
    theme: en ? "Three Teams, One Launch" : "三队一发",
    densityLabel: en ? "Systematic · Diagrammatic" : "系统 · 图解",
    heroScene: 4,
    colors: { bg: GROUND, ink: INK, panel: PANEL },
    typography: { header: "Inter", body: "Inter" },
    tags: en
      ? ["calm", "systematic", "structured", "diagrammatic", "light", "multi-track"]
      : ["沉静", "系统", "有序", "图解", "明亮", "多线"],
    fonts: ["Inter"],
    scenes: [
      {
        id: 1,
        title: en ? "Title" : "起点",
        beats: [
          {
            id: 0,
            action: en ? "The network wakes" : "线网苏醒",
            title: en ? "Three Teams, One Launch" : "三队一发",
            body: en
              ? "Design, engineering, and marketing share one destination."
              : "设计、工程、市场，共赴同一终点。",
          },
        ],
      },
      {
        id: 2,
        title: en ? "The Lines" : "三条线",
        beats: [
          {
            id: 0,
            action: en ? "Design enters service" : "设计线发车",
            title: en ? "Design Line" : "设计线",
            body: en ? "The design track leaves the depot first." : "设计轨道率先驶出车库。",
          },
          {
            id: 1,
            action: en ? "Engineering enters service" : "工程线发车",
            title: en ? "Engineering Line" : "工程线",
            body: en ? "Engineering runs parallel on its own track." : "工程沿自己的轨道并行。",
          },
          {
            id: 2,
            action: en ? "Marketing enters service" : "市场线发车",
            title: en ? "Marketing Line" : "市场线",
            body: en ? "Marketing joins; three lines now live." : "市场加入，三线齐发。",
          },
        ],
      },
      {
        id: 3,
        title: en ? "The Stations" : "沿途站点",
        beats: [
          {
            id: 0,
            action: en ? "Design milestones light" : "设计里程碑点亮",
            title: en ? "Design Milestones" : "设计里程碑",
            body: en
              ? "Research, mockups, and specs mark the design line."
              : "调研、样稿、规范，标记设计线。",
          },
          {
            id: 1,
            action: en ? "Engineering milestones light" : "工程里程碑点亮",
            title: en ? "Engineering Milestones" : "工程里程碑",
            body: en
              ? "API, build, and hardening mark the engineering line."
              : "接口、构建、加固，标记工程线。",
          },
          {
            id: 2,
            action: en ? "Marketing milestones light" : "市场里程碑点亮",
            title: en ? "Marketing Milestones" : "市场里程碑",
            body: en
              ? "Story, assets, and press mark the marketing line."
              : "故事、素材、发稿，标记市场线。",
          },
        ],
      },
      {
        id: 4,
        title: en ? "The Interchange" : "换乘枢纽",
        beats: [
          {
            id: 0,
            action: en ? "Lines arrive" : "各线抵达",
            title: en ? "Launch Interchange" : "发布换乘站",
            body: en
              ? "All three tracks bend toward one transfer station."
              : "三条轨道齐齐弯向同一换乘站。",
          },
          {
            id: 1,
            action: en ? "Transfer locks" : "换乘锁定",
            title: en ? "One Platform" : "同一站台",
            body: en
              ? "Three lines share a single launch-day platform."
              : "三线共用同一个发布日站台。",
          },
        ],
      },
      {
        id: 5,
        title: en ? "Terminus" : "终点站",
        beats: [
          {
            id: 0,
            action: en ? "The map completes" : "线网完成",
            title: en ? "One Destination" : "同一终点",
            body: en
              ? "Separate tracks, one terminus: launch day."
              : "各行其道，终点唯一：发布日。",
          },
        ],
      },
    ],
  };
}

export const threeTeamsLaunchTopic = defineStyleTopic({
  id: "three-teams-launch",
  topic: { en: "Three Teams, One Launch", zh: "三队一发" },
  model: "Claude Opus 4.8",
  component: ThreeTeamsLaunchV3,
  getMetadata,
});

export default ThreeTeamsLaunchV3;

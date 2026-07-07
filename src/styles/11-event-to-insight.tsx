import { useEffect } from "react";
import type React from "react";
import type { BespokeStyleProps, StyleMetadata } from "../types";
import { useFLIP } from "../hooks/useFLIP";
import SpatialSceneTrack from "./SpatialSceneTrack";
import type {
  BeatLayoutMode,
  SceneTransitionMap,
} from "./SpatialSceneTrack";
import { defineStyleTopic } from "./topic";

type Lang = "en" | "zh";
type SceneId = 1 | 2 | 3 | 4 | 5;
type SceneVariant = "source" | "routing" | "transform" | "alert" | "loop";
type Tone = "signal" | "alert" | "loop" | "muted";

interface BeatCopy {
  action: string;
  title: string;
  body: string;
  marker: string;
}

interface CardCopy {
  label: string;
  value: string;
  note: string;
}

interface SceneCopy {
  nav: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  body: string;
  metricLabel: string;
  metricValue: string;
  statusLabel: string;
  statusValue: string;
  cards: CardCopy[];
  beats: BeatCopy[];
}

interface RouteNode {
  id: string;
  x: number;
  y: number;
  beat: number;
  tone?: Tone;
  label: Record<Lang, string>;
}

interface RoutePath {
  d: string;
  beat: number;
  tone?: Tone;
}

interface PipelineSceneDefinition {
  id: SceneId;
  code: string;
  variant: SceneVariant;
  accent: string;
  secondary: string;
  nodes: RouteNode[];
  paths: RoutePath[];
  copy: Record<Lang, SceneCopy>;
}

const SCENE_IDS: SceneId[] = [1, 2, 3, 4, 5];

const TRANSITION_MAP: SceneTransitionMap = {
  "1->2": "slide-x",
  "2->3": "glitch",
  "3->4": "wipe",
  "4->5": "scale-fade",
};

const BEAT_LAYOUT_MODES: Record<number, BeatLayoutMode> = {
  1: "motion",
  2: "motion",
  3: "motion",
  4: "motion",
  5: "motion",
};

const SIGNAL_PIPELINE_CSS = `
.signalPipelineV2Root {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  container-type: size;
  background:
    radial-gradient(circle at 18% 18%, rgba(77, 232, 212, 0.18), transparent 24%),
    radial-gradient(circle at 82% 72%, rgba(248, 183, 74, 0.12), transparent 26%),
    linear-gradient(135deg, #071017 0%, #0b1721 48%, #05090d 100%);
  color: #ecfbff;
  font-family: "IBM Plex Mono", "Noto Sans SC", ui-monospace, monospace;
}

.signalPipelineV2Root,
.signalPipelineV2Root * {
  box-sizing: border-box;
  letter-spacing: 0;
}

.signalPipelineV2Root::before {
  content: "";
  position: absolute;
  inset: 0;
  background:
    repeating-linear-gradient(90deg, rgba(255,255,255,0.055) 0, rgba(255,255,255,0.055) 0.06cqw, transparent 0.06cqw, transparent 5cqw),
    repeating-linear-gradient(0deg, rgba(255,255,255,0.04) 0, rgba(255,255,255,0.04) 0.08cqh, transparent 0.08cqh, transparent 5cqh);
  opacity: 0.45;
  pointer-events: none;
}

.signalPipelineV2Root::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, rgba(255,255,255,0.04), transparent 18%, transparent 82%, rgba(255,255,255,0.05));
  pointer-events: none;
}

.signalPipelineV2Root[data-motion="off"] *,
.signalPipelineV2Root[data-motion="off"] *::before,
.signalPipelineV2Root[data-motion="off"] *::after {
  animation-duration: 0s !important;
  animation-delay: 0s !important;
  transition-duration: 0s !important;
}

.spv2Track {
  position: relative;
  z-index: 1;
}

.spv2Scene {
  position: relative;
  width: 100%;
  height: 100%;
  padding: 5.6cqh 7cqw 11.4cqh;
}

.spv2SceneShell {
  height: 100%;
  display: grid;
  grid-template-rows: auto minmax(0, 1fr) auto;
  gap: 2.4cqh;
}

.spv2Header {
  display: grid;
  grid-template-columns: 12cqw minmax(0, 1fr) 16cqw;
  gap: 2.2cqw;
  align-items: end;
}

.spv2CodeBlock {
  display: grid;
  gap: 0.7cqh;
  color: rgba(236,251,255,0.66);
  font-size: 1.05cqw;
  line-height: 1.2;
  text-transform: uppercase;
}

.spv2Code {
  color: var(--spv2-accent);
  font-size: 2.2cqw;
  line-height: 1;
  text-shadow: 0 0 1.2cqw color-mix(in srgb, var(--spv2-accent) 55%, transparent);
}

.spv2TitleWrap {
  min-width: 0;
}

.spv2Eyebrow {
  margin: 0 0 0.8cqh;
  color: var(--spv2-accent);
  font-size: 1.05cqw;
  line-height: 1.25;
  text-transform: uppercase;
}

.spv2Title {
  margin: 0;
  max-width: 58cqw;
  color: #f5fdff;
  font-size: 4.15cqw;
  line-height: 0.98;
  font-weight: 600;
  text-wrap: balance;
}

.spv2Subtitle {
  margin: 1.2cqh 0 0;
  max-width: 52cqw;
  color: rgba(236,251,255,0.74);
  font-size: 1.35cqw;
  line-height: 1.45;
}

.spv2Metric {
  justify-self: end;
  min-width: 13cqw;
  border: 0.08cqw solid rgba(236,251,255,0.16);
  border-radius: 0.9cqw;
  padding: 1.1cqh 1.1cqw;
  background: rgba(6,14,20,0.7);
  box-shadow: inset 0 0 2.4cqw rgba(255,255,255,0.04);
}

.spv2MetricLabel {
  color: rgba(236,251,255,0.56);
  font-size: 0.85cqw;
  line-height: 1.2;
  text-transform: uppercase;
}

.spv2MetricValue {
  margin-top: 0.7cqh;
  color: var(--spv2-accent);
  font-size: 1.85cqw;
  line-height: 1;
  font-weight: 700;
}

.spv2MainGrid {
  min-height: 0;
  display: grid;
  grid-template-columns: minmax(0, 1.18fr) minmax(0, 0.82fr);
  gap: 2.8cqw;
}

.spv2Visual {
  position: relative;
  min-height: 0;
  overflow: hidden;
  border: 0.08cqw solid rgba(236,251,255,0.14);
  border-radius: 1.2cqw;
  background:
    radial-gradient(circle at 30% 24%, color-mix(in srgb, var(--spv2-accent) 14%, transparent), transparent 25%),
    linear-gradient(140deg, rgba(255,255,255,0.065), rgba(255,255,255,0.015));
  box-shadow:
    inset 0 0 4.5cqw rgba(255,255,255,0.045),
    0 0 3.5cqw rgba(0,0,0,0.32);
}

.spv2Visual::before {
  content: "";
  position: absolute;
  inset: 1.2cqw;
  border: 0.08cqw solid color-mix(in srgb, var(--spv2-accent) 28%, transparent);
  border-radius: 0.85cqw;
  opacity: 0.55;
}

.spv2Visual::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(110deg, transparent 0%, rgba(255,255,255,0.08) 48%, transparent 55%);
  transform: translateX(-80%);
  animation: spv2Scan 5s cubic-bezier(0.16, 1, 0.3, 1) infinite;
  pointer-events: none;
}

.spv2Svg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.spv2Path {
  fill: none;
  stroke: rgba(236,251,255,0.24);
  stroke-width: 5;
  stroke-linecap: round;
  stroke-linejoin: round;
  opacity: 0.36;
  transition: opacity 420ms cubic-bezier(0.16, 1, 0.3, 1), stroke 420ms cubic-bezier(0.16, 1, 0.3, 1);
}

.spv2Path[data-active="true"] {
  stroke: var(--spv2-accent);
  stroke-dasharray: 24 18;
  opacity: 0.95;
  filter: drop-shadow(0 0 1.2cqw color-mix(in srgb, var(--spv2-accent) 75%, transparent));
  animation: spv2Flow 1.25s linear infinite;
}

.spv2Path[data-tone="alert"][data-active="true"] {
  stroke: #f8b74a;
}

.spv2Path[data-tone="loop"][data-active="true"] {
  stroke: #7cffb7;
}

.spv2NodeCore {
  fill: #091620;
  stroke: rgba(236,251,255,0.44);
  stroke-width: 4;
  transition: fill 420ms cubic-bezier(0.16, 1, 0.3, 1), stroke 420ms cubic-bezier(0.16, 1, 0.3, 1), opacity 420ms cubic-bezier(0.16, 1, 0.3, 1);
}

.spv2NodeHalo {
  fill: var(--spv2-accent);
  opacity: 0.08;
  transform-origin: center;
}

.spv2Node[data-active="true"] .spv2NodeCore {
  fill: var(--spv2-accent);
  stroke: #f3fdff;
  filter: drop-shadow(0 0 1cqw color-mix(in srgb, var(--spv2-accent) 80%, transparent));
}

.spv2Node[data-active="true"] .spv2NodeHalo {
  opacity: 0.24;
  animation: spv2Pulse 1.65s cubic-bezier(0.16, 1, 0.3, 1) infinite;
}

.spv2Node[data-tone="alert"][data-active="true"] .spv2NodeCore,
.spv2Node[data-tone="alert"][data-active="true"] .spv2NodeHalo {
  fill: #f8b74a;
}

.spv2Node[data-tone="loop"][data-active="true"] .spv2NodeCore,
.spv2Node[data-tone="loop"][data-active="true"] .spv2NodeHalo {
  fill: #7cffb7;
}

.spv2NodeBadge {
  position: absolute;
  transform: translate(-50%, 2.35cqh);
  padding: 0.55cqh 0.65cqw;
  border: 0.08cqw solid rgba(236,251,255,0.12);
  border-radius: 0.55cqw;
  background: rgba(5,11,16,0.78);
  color: rgba(236,251,255,0.62);
  font-size: 0.82cqw;
  line-height: 1;
  text-transform: uppercase;
  white-space: nowrap;
  transition: color 420ms cubic-bezier(0.16, 1, 0.3, 1), border-color 420ms cubic-bezier(0.16, 1, 0.3, 1), transform 420ms cubic-bezier(0.16, 1, 0.3, 1);
}

.spv2NodeBadge[data-active="true"] {
  color: #f5fdff;
  border-color: color-mix(in srgb, var(--spv2-accent) 62%, transparent);
  transform: translate(-50%, 1.8cqh);
}

.spv2EmitterRing,
.spv2AlertRing,
.spv2LoopRing {
  fill: none;
  stroke: var(--spv2-accent);
  stroke-width: 3;
  stroke-dasharray: 18 14;
  opacity: 0.46;
  transform-origin: center;
  animation: spv2Orbit 7s linear infinite;
}

.spv2AlertRing {
  stroke: #f8b74a;
  animation-duration: 3.4s;
}

.spv2LoopRing {
  stroke: #7cffb7;
  animation-duration: 5.5s;
}

.spv2GlitchShard {
  fill: #ff4fd8;
  opacity: 0;
}

.spv2GlitchShard[data-active="true"] {
  opacity: 0.62;
  animation: spv2Glitch 820ms steps(2, jump-none) infinite;
}

.spv2WipeBand {
  fill: #f8b74a;
  opacity: 0.18;
  transform: translateX(-28%);
  transition: transform 520ms cubic-bezier(0.16, 1, 0.3, 1), opacity 520ms cubic-bezier(0.16, 1, 0.3, 1);
}

.spv2WipeBand[data-active="true"] {
  opacity: 0.34;
  transform: translateX(18%);
}

.spv2Readout {
  min-height: 0;
  display: grid;
  align-content: start;
  gap: 1.35cqh;
}

.spv2Body {
  margin: 0;
  color: rgba(236,251,255,0.78);
  font-size: 1.35cqw;
  line-height: 1.46;
}

.spv2Status {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 1cqw;
  align-items: center;
  border: 0.08cqw solid color-mix(in srgb, var(--spv2-accent) 28%, transparent);
  border-radius: 0.9cqw;
  padding: 1.2cqh 1.1cqw;
  background: rgba(6,14,20,0.72);
}

.spv2StatusLabel {
  color: rgba(236,251,255,0.55);
  font-size: 0.88cqw;
  line-height: 1.2;
  text-transform: uppercase;
}

.spv2StatusValue {
  color: var(--spv2-accent);
  font-size: 1.12cqw;
  line-height: 1.2;
  text-align: right;
}

.spv2Cards {
  display: grid;
  gap: 1.2cqh;
}

.spv2Card {
  display: grid;
  grid-template-columns: 9.5cqw minmax(0, 1fr);
  gap: 1cqw;
  align-items: start;
  border: 0.08cqw solid rgba(236,251,255,0.12);
  border-radius: 0.9cqw;
  padding: 1.15cqh 1.05cqw;
  background: linear-gradient(135deg, rgba(255,255,255,0.075), rgba(255,255,255,0.025));
  box-shadow: inset 0 0 2.2cqw rgba(255,255,255,0.035);
}

.spv2CardLabel {
  color: var(--spv2-accent);
  font-size: 0.9cqw;
  line-height: 1.2;
  text-transform: uppercase;
}

.spv2CardValue {
  margin: 0;
  color: #f5fdff;
  font-size: 1.18cqw;
  line-height: 1.25;
}

.spv2CardNote {
  margin: 0.45cqh 0 0;
  color: rgba(236,251,255,0.58);
  font-size: 0.92cqw;
  line-height: 1.35;
}

.spv2BeatRail {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1cqw;
}

.spv2Beat {
  min-width: 0;
  border-top: 0.18cqh solid rgba(236,251,255,0.16);
  padding-top: 0.85cqh;
  color: rgba(236,251,255,0.5);
  font-size: 0.86cqw;
  line-height: 1.22;
  text-transform: uppercase;
  transition: color 360ms cubic-bezier(0.16, 1, 0.3, 1), border-color 360ms cubic-bezier(0.16, 1, 0.3, 1);
}

.spv2Beat[data-active="true"] {
  color: #f5fdff;
  border-color: var(--spv2-accent);
}

.spv2RouteNav {
  position: absolute;
  z-index: 3;
  left: 7cqw;
  right: 7cqw;
  bottom: 2.4cqh;
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 1.4cqw;
  align-items: center;
}

.spv2RouteNavLine {
  position: absolute;
  left: 4cqw;
  right: 4cqw;
  top: 1.35cqh;
  height: 0.18cqh;
  background: linear-gradient(90deg, transparent, rgba(236,251,255,0.28), transparent);
}

.spv2NavButton {
  position: relative;
  display: grid;
  grid-template-columns: 2.7cqw minmax(0, 1fr);
  gap: 0.8cqw;
  align-items: center;
  min-width: 0;
  border: 0;
  padding: 0;
  background: transparent;
  color: rgba(236,251,255,0.55);
  font: inherit;
  text-align: left;
  cursor: pointer;
}

.spv2NavButton:disabled {
  cursor: default;
}

.spv2NavPulse {
  position: relative;
  width: 2.2cqw;
  aspect-ratio: 1;
  border: 0.08cqw solid rgba(236,251,255,0.24);
  border-radius: 50%;
  background: #071017;
  box-shadow: 0 0 0 0.34cqw rgba(255,255,255,0.035);
}

.spv2NavPulse::after {
  content: "";
  position: absolute;
  inset: 0.46cqw;
  border-radius: 50%;
  background: rgba(236,251,255,0.35);
}

.spv2NavButton[data-active="true"] {
  color: #f5fdff;
}

.spv2NavButton[data-active="true"] .spv2NavPulse {
  border-color: var(--spv2-active-accent);
  box-shadow: 0 0 1.6cqw color-mix(in srgb, var(--spv2-active-accent) 42%, transparent);
  animation: spv2Pulse 1.5s cubic-bezier(0.16, 1, 0.3, 1) infinite;
}

.spv2NavButton[data-active="true"] .spv2NavPulse::after {
  background: var(--spv2-active-accent);
}

.spv2NavIndex {
  display: block;
  color: var(--spv2-active-accent);
  font-size: 0.8cqw;
  line-height: 1;
}

.spv2NavLabel {
  display: block;
  overflow: hidden;
  color: currentColor;
  font-size: 0.86cqw;
  line-height: 1.2;
  text-overflow: ellipsis;
  text-transform: uppercase;
  white-space: nowrap;
}

@keyframes spv2Pulse {
  0%, 100% { transform: scale(0.94); opacity: 0.78; }
  50% { transform: scale(1.08); opacity: 1; }
}

@keyframes spv2Flow {
  from { stroke-dashoffset: 42; }
  to { stroke-dashoffset: 0; }
}

@keyframes spv2Orbit {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes spv2Scan {
  0%, 46% { transform: translateX(-86%); opacity: 0; }
  58% { opacity: 0.72; }
  76%, 100% { transform: translateX(86%); opacity: 0; }
}

@keyframes spv2Glitch {
  0%, 100% { transform: translate(0, 0); }
  25% { transform: translate(0.45cqw, -0.35cqh); }
  50% { transform: translate(-0.32cqw, 0.24cqh); }
  75% { transform: translate(0.2cqw, 0.42cqh); }
}
`;

const SCENES: Record<SceneId, PipelineSceneDefinition> = {
  1: {
    id: 1,
    code: "SRC",
    variant: "source",
    accent: "#4de8d4",
    secondary: "#88fff0",
    nodes: [
      { id: "edge", x: 150, y: 280, beat: 0, label: { en: "event", zh: "事件" } },
      { id: "shape", x: 420, y: 210, beat: 1, label: { en: "schema", zh: "结构" } },
      { id: "queue", x: 710, y: 305, beat: 2, label: { en: "queue", zh: "队列" } },
    ],
    paths: [
      { d: "M190 280 C270 250 320 225 380 216", beat: 0 },
      { d: "M462 220 C560 230 610 275 674 300", beat: 1 },
      { d: "M710 305 C780 332 830 322 890 282", beat: 2 },
    ],
    copy: {
      en: {
        nav: "Source",
        eyebrow: "01 / signal source",
        title: "Signal source",
        subtitle: "A useful insight starts as a captured fact.",
        body: "The first job is not interpretation. It is disciplined capture: who emitted the event, which shape it owns, and whether it is ready to route.",
        metricLabel: "ingest",
        metricValue: "1.8M / min",
        statusLabel: "edge state",
        statusValue: "schema locked",
        cards: [
          { label: "capture", value: "Raw event", note: "Preserve origin, time, and actor." },
          { label: "shape", value: "Contracted schema", note: "Reject ambiguity before routing." },
          { label: "queue", value: "Durable handoff", note: "Ready for priority lanes." },
        ],
        beats: [
          { action: "Capture the raw event at the edge", title: "Event captured", body: "Origin and timestamp stay intact.", marker: "capture" },
          { action: "Apply a stable schema", title: "Shape locked", body: "The signal gets a reliable contract.", marker: "shape" },
          { action: "Hand the signal into the queue", title: "Queue ready", body: "The system can route without guessing.", marker: "queue" },
        ],
      },
      zh: {
        nav: "源点",
        eyebrow: "01 / 信号源点",
        title: "信号源点",
        subtitle: "可用洞察，先是一条被准确捕获的事实。",
        body: "第一步不是解释，而是克制地捕获：谁发出事件、它属于什么结构、是否已经可以进入路由。",
        metricLabel: "摄入",
        metricValue: "1.8M / 分",
        statusLabel: "边缘状态",
        statusValue: "结构锁定",
        cards: [
          { label: "捕获", value: "原始事件", note: "保留来源、时间和角色。" },
          { label: "定型", value: "稳定结构", note: "在路由前消除歧义。" },
          { label: "入队", value: "可靠交接", note: "准备进入优先级通道。" },
        ],
        beats: [
          { action: "在边缘捕获原始事件", title: "事件已捕获", body: "来源和时间戳保持完整。", marker: "捕获" },
          { action: "套用稳定事件结构", title: "结构已锁定", body: "信号获得可靠契约。", marker: "定型" },
          { action: "把信号交给队列", title: "队列就绪", body: "系统可以无猜测路由。", marker: "入队" },
        ],
      },
    },
  },
  2: {
    id: 2,
    code: "RTE",
    variant: "routing",
    accent: "#59bfff",
    secondary: "#4de8d4",
    nodes: [
      { id: "intake", x: 135, y: 280, beat: 0, label: { en: "intake", zh: "入口" } },
      { id: "router", x: 375, y: 280, beat: 0, label: { en: "router", zh: "路由" } },
      { id: "incident", x: 650, y: 160, beat: 1, tone: "alert", label: { en: "incident", zh: "事故" } },
      { id: "product", x: 720, y: 285, beat: 2, label: { en: "product", zh: "产品" } },
      { id: "ops", x: 650, y: 415, beat: 2, label: { en: "ops", zh: "运维" } },
    ],
    paths: [
      { d: "M175 280 C245 280 295 280 335 280", beat: 0 },
      { d: "M415 270 C500 230 560 178 612 162", beat: 1, tone: "alert" },
      { d: "M418 280 C520 286 596 288 684 286", beat: 2 },
      { d: "M414 292 C505 340 560 396 614 414", beat: 2 },
    ],
    copy: {
      en: {
        nav: "Route",
        eyebrow: "02 / routing",
        title: "Routing without guesswork",
        subtitle: "The path says who should care before anyone opens a dashboard.",
        body: "Priority lanes separate incidents, product telemetry, and operational noise. The route itself becomes the first explanation.",
        metricLabel: "fan out",
        metricValue: "3 lanes",
        statusLabel: "route state",
        statusValue: "owner resolved",
        cards: [
          { label: "classify", value: "Intent lane", note: "Separate incident, product, and ops paths." },
          { label: "assign", value: "Clear owner", note: "Every route has an accountable reader." },
          { label: "pace", value: "SLA-aware flow", note: "Urgency changes the signal speed." },
        ],
        beats: [
          { action: "Classify the incoming signal", title: "Lane chosen", body: "The signal gets a route class.", marker: "class" },
          { action: "Resolve the accountable owner", title: "Owner lit", body: "The urgent branch is visible.", marker: "owner" },
          { action: "Fan out into stable lanes", title: "Flow split", body: "Non-urgent paths keep moving.", marker: "split" },
        ],
      },
      zh: {
        nav: "路由",
        eyebrow: "02 / 路由",
        title: "无猜测路由",
        subtitle: "在任何人打开看板前，路径已经说明谁应该处理。",
        body: "优先级通道把事故、产品遥测和运维噪声拆开。路由本身就是第一层解释。",
        metricLabel: "分流",
        metricValue: "3 路",
        statusLabel: "路由状态",
        statusValue: "负责人明确",
        cards: [
          { label: "分类", value: "意图通道", note: "区分事故、产品与运维路径。" },
          { label: "指派", value: "明确负责人", note: "每条路径都有可追责读者。" },
          { label: "节奏", value: "按 SLA 流动", note: "紧急程度改变信号速度。" },
        ],
        beats: [
          { action: "分类进入的信号", title: "通道已选", body: "信号获得路由类别。", marker: "分类" },
          { action: "解析可追责负责人", title: "负责人点亮", body: "紧急分支清晰可见。", marker: "负责人" },
          { action: "分流到稳定通道", title: "流向拆分", body: "非紧急路径继续推进。", marker: "分流" },
        ],
      },
    },
  },
  3: {
    id: 3,
    code: "XFM",
    variant: "transform",
    accent: "#ff4fd8",
    secondary: "#59bfff",
    nodes: [
      { id: "normalize", x: 140, y: 310, beat: 0, label: { en: "normalize", zh: "归一" } },
      { id: "enrich", x: 390, y: 210, beat: 1, label: { en: "enrich", zh: "补全" } },
      { id: "join", x: 600, y: 340, beat: 1, label: { en: "join", zh: "联结" } },
      { id: "feature", x: 820, y: 260, beat: 2, label: { en: "feature", zh: "特征" } },
    ],
    paths: [
      { d: "M178 300 C260 255 306 230 352 216", beat: 0 },
      { d: "M424 224 C482 260 526 314 564 332", beat: 1 },
      { d: "M636 332 C710 320 760 286 784 266", beat: 2 },
    ],
    copy: {
      en: {
        nav: "Transform",
        eyebrow: "03 / transform",
        title: "Transform into meaning",
        subtitle: "The signal is useful only after the system repairs its context.",
        body: "Normalization, enrichment, and joins convert fragments into features. The brief glitch is the machine admitting what changed.",
        metricLabel: "shape shift",
        metricValue: "42 ms",
        statusLabel: "feature state",
        statusValue: "context joined",
        cards: [
          { label: "normalize", value: "One vocabulary", note: "Inputs stop disagreeing about names." },
          { label: "enrich", value: "Context attached", note: "Account, cohort, and source join in." },
          { label: "publish", value: "Feature stream", note: "Readers consume stable meaning." },
        ],
        beats: [
          { action: "Normalize the event vocabulary", title: "Vocabulary aligned", body: "Raw names become stable fields.", marker: "norm" },
          { action: "Enrich and join the context", title: "Context joined", body: "The fragment becomes explainable.", marker: "join" },
          { action: "Publish a feature stream", title: "Feature ready", body: "Downstream readers get meaning.", marker: "publish" },
        ],
      },
      zh: {
        nav: "转换",
        eyebrow: "03 / 转换",
        title: "转换为含义",
        subtitle: "只有系统修复上下文后，信号才真正可用。",
        body: "归一、补全和联结把碎片变成特征。短暂故障感，是机器承认这里发生了改变。",
        metricLabel: "形态转换",
        metricValue: "42 毫秒",
        statusLabel: "特征状态",
        statusValue: "上下文已联结",
        cards: [
          { label: "归一", value: "统一词汇", note: "输入不再为字段命名争吵。" },
          { label: "补全", value: "附上上下文", note: "账户、分群和来源被接入。" },
          { label: "发布", value: "特征流", note: "读者消费稳定含义。" },
        ],
        beats: [
          { action: "归一事件词汇", title: "词汇已对齐", body: "原始命名变成稳定字段。", marker: "归一" },
          { action: "补全并联结上下文", title: "上下文已联结", body: "碎片变得可以解释。", marker: "联结" },
          { action: "发布特征流", title: "特征就绪", body: "下游读者获得含义。", marker: "发布" },
        ],
      },
    },
  },
  4: {
    id: 4,
    code: "ALT",
    variant: "alert",
    accent: "#f8b74a",
    secondary: "#ff6b6b",
    nodes: [
      { id: "score", x: 150, y: 300, beat: 0, label: { en: "score", zh: "评分" } },
      { id: "threshold", x: 390, y: 300, beat: 1, tone: "alert", label: { en: "threshold", zh: "阈值" } },
      { id: "alert", x: 645, y: 235, beat: 2, tone: "alert", label: { en: "alert", zh: "告警" } },
      { id: "owner", x: 815, y: 330, beat: 2, tone: "alert", label: { en: "owner", zh: "负责人" } },
    ],
    paths: [
      { d: "M190 300 C270 300 318 300 350 300", beat: 0 },
      { d: "M430 292 C506 270 558 246 608 236", beat: 1, tone: "alert" },
      { d: "M680 246 C738 270 768 302 792 326", beat: 2, tone: "alert" },
    ],
    copy: {
      en: {
        nav: "Alert",
        eyebrow: "04 / alert",
        title: "Alert only when action exists",
        subtitle: "Noise becomes a decision only when context names the next move.",
        body: "Thresholds are not alarms by themselves. They need history, blast radius, and an owner who can change the outcome.",
        metricLabel: "decision",
        metricValue: "P1",
        statusLabel: "alert state",
        statusValue: "actionable",
        cards: [
          { label: "score", value: "Anomaly scored", note: "Distance from baseline is explicit." },
          { label: "context", value: "Blast radius known", note: "The alert knows why it matters." },
          { label: "handoff", value: "Owner paged", note: "A real person can close the loop." },
        ],
        beats: [
          { action: "Score the anomaly", title: "Score visible", body: "The deviation is measurable.", marker: "score" },
          { action: "Cross the contextual threshold", title: "Threshold crossed", body: "The system knows impact.", marker: "impact" },
          { action: "Page the accountable owner", title: "Owner paged", body: "The alert has a next move.", marker: "page" },
        ],
      },
      zh: {
        nav: "告警",
        eyebrow: "04 / 告警",
        title: "只在可行动时告警",
        subtitle: "只有上下文指出下一步，噪声才变成决策。",
        body: "阈值本身不是告警。它需要历史、影响范围，以及能改变结果的负责人。",
        metricLabel: "决策",
        metricValue: "P1",
        statusLabel: "告警状态",
        statusValue: "可行动",
        cards: [
          { label: "评分", value: "异常已评分", note: "与基线的距离清晰可见。" },
          { label: "上下文", value: "影响范围已知", note: "告警知道自己为何重要。" },
          { label: "交接", value: "负责人已通知", note: "真实的人可以闭环。" },
        ],
        beats: [
          { action: "为异常评分", title: "评分可见", body: "偏离程度可以衡量。", marker: "评分" },
          { action: "跨过上下文阈值", title: "越过阈值", body: "系统理解影响范围。", marker: "影响" },
          { action: "通知可追责负责人", title: "负责人已通知", body: "告警有明确下一步。", marker: "通知" },
        ],
      },
    },
  },
  5: {
    id: 5,
    code: "LOP",
    variant: "loop",
    accent: "#7cffb7",
    secondary: "#4de8d4",
    nodes: [
      { id: "insight", x: 220, y: 300, beat: 0, tone: "loop", label: { en: "insight", zh: "洞察" } },
      { id: "rule", x: 470, y: 170, beat: 1, tone: "loop", label: { en: "rule", zh: "规则" } },
      { id: "instrument", x: 735, y: 300, beat: 2, tone: "loop", label: { en: "instrument", zh: "埋点" } },
      { id: "source", x: 470, y: 430, beat: 2, tone: "loop", label: { en: "source", zh: "源点" } },
    ],
    paths: [
      { d: "M254 286 C328 220 380 184 436 174", beat: 0, tone: "loop" },
      { d: "M506 176 C602 192 674 246 702 282", beat: 1, tone: "loop" },
      { d: "M710 328 C650 402 560 438 506 430", beat: 2, tone: "loop" },
      { d: "M438 424 C340 404 260 356 230 324", beat: 2, tone: "loop" },
    ],
    copy: {
      en: {
        nav: "Loop",
        eyebrow: "05 / closed loop",
        title: "Insight returns to the source",
        subtitle: "A pipeline is complete only when the next event gets cleaner.",
        body: "The finding updates rules, instrumentation, and the route map. The system learns by changing the place where the next signal starts.",
        metricLabel: "loop gain",
        metricValue: "+18%",
        statusLabel: "cycle state",
        statusValue: "learning",
        cards: [
          { label: "insight", value: "Decision captured", note: "The answer is stored as system memory." },
          { label: "rule", value: "Routing updated", note: "Future signals take a clearer path." },
          { label: "source", value: "Instrumented better", note: "The next event arrives cleaner." },
        ],
        beats: [
          { action: "Capture the decision as an insight", title: "Insight stored", body: "The answer becomes memory.", marker: "store" },
          { action: "Update the route and rule set", title: "Rules updated", body: "Future paths improve.", marker: "rules" },
          { action: "Return learning to the source", title: "Loop closed", body: "The next event gets cleaner.", marker: "close" },
        ],
      },
      zh: {
        nav: "闭环",
        eyebrow: "05 / 闭环",
        title: "洞察回到源点",
        subtitle: "只有下一条事件更干净，管线才算完成。",
        body: "发现会更新规则、埋点和路由图。系统通过改变下一条信号的起点来学习。",
        metricLabel: "闭环收益",
        metricValue: "+18%",
        statusLabel: "循环状态",
        statusValue: "学习中",
        cards: [
          { label: "洞察", value: "决策已捕获", note: "答案被存成系统记忆。" },
          { label: "规则", value: "路由已更新", note: "未来信号走更清晰的路径。" },
          { label: "源点", value: "埋点更准确", note: "下一条事件更干净。" },
        ],
        beats: [
          { action: "把决策捕获为洞察", title: "洞察已存储", body: "答案成为记忆。", marker: "存储" },
          { action: "更新路由和规则集", title: "规则已更新", body: "未来路径得到改善。", marker: "规则" },
          { action: "把学习返回源点", title: "闭环完成", body: "下一条事件更干净。", marker: "闭环" },
        ],
      },
    },
  },
};

function useFonts() {
  useEffect(() => {
    const id = "style-11-event-to-insight-v2-fonts";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600;700&family=Noto+Sans+SC:wght@400;500;700&display=swap";
    document.head.appendChild(link);
  }, []);
}

function useSignalPipelineStyles() {
  useEffect(() => {
    const id = "style-11-event-to-insight-v2-styles";
    if (document.getElementById(id)) return;
    const style = document.createElement("style");
    style.id = id;
    style.textContent = SIGNAL_PIPELINE_CSS;
    document.head.appendChild(style);
  }, []);
}

function normalizeScene(scene: number): SceneId {
  return SCENE_IDS.includes(scene as SceneId) ? (scene as SceneId) : 1;
}

function clampBeat(beat: number, maxBeat: number): number {
  if (!Number.isFinite(beat)) return 0;
  return Math.max(0, Math.min(Math.floor(beat), maxBeat));
}

function toPercent(value: number, max: number): string {
  return `${(value / max) * 100}%`;
}

function getSceneCopy(sceneId: SceneId, language: Lang): SceneCopy {
  return SCENES[sceneId].copy[language];
}

function renderVariantOverlays(variant: SceneVariant, activeBeat: number) {
  if (variant === "source") {
    return (
      <>
        <circle className="spv2EmitterRing" cx="150" cy="280" r="96" />
        <circle className="spv2EmitterRing" cx="150" cy="280" r="145" />
      </>
    );
  }

  if (variant === "transform") {
    return (
      <>
        <rect
          className="spv2GlitchShard"
          data-active={activeBeat >= 1 ? "true" : "false"}
          x="315"
          y="148"
          width="92"
          height="18"
        />
        <rect
          className="spv2GlitchShard"
          data-active={activeBeat >= 1 ? "true" : "false"}
          x="520"
          y="258"
          width="136"
          height="22"
        />
        <rect
          className="spv2GlitchShard"
          data-active={activeBeat >= 2 ? "true" : "false"}
          x="724"
          y="214"
          width="82"
          height="18"
        />
      </>
    );
  }

  if (variant === "alert") {
    return (
      <>
        <rect
          className="spv2WipeBand"
          data-active={activeBeat >= 1 ? "true" : "false"}
          x="374"
          y="66"
          width="210"
          height="430"
          transform="skewX(-12)"
        />
        <circle className="spv2AlertRing" cx="645" cy="235" r="104" />
        <circle className="spv2AlertRing" cx="645" cy="235" r="150" />
      </>
    );
  }

  if (variant === "loop") {
    return (
      <>
        <circle className="spv2LoopRing" cx="470" cy="300" r="202" />
        <circle className="spv2LoopRing" cx="470" cy="300" r="132" />
      </>
    );
  }

  return null;
}

function SignalVisual({
  scene,
  language,
  activeBeat,
}: {
  scene: PipelineSceneDefinition;
  language: Lang;
  activeBeat: number;
}) {
  return (
    <div
      className="spv2Visual"
      data-variant={scene.variant}
      data-beat-layout-item="true"
    >
      <svg className="spv2Svg" viewBox="0 0 1000 560" aria-hidden="true">
        <defs>
          <filter id="spv2Glow">
            <feGaussianBlur stdDeviation="7" result="blur" />
            <feColorMatrix
              in="blur"
              type="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.72 0"
              result="glow"
            />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {renderVariantOverlays(scene.variant, activeBeat)}
        {scene.paths.map((path) => (
          <path
            key={path.d}
            className="spv2Path"
            data-active={activeBeat >= path.beat ? "true" : "false"}
            data-tone={path.tone ?? "signal"}
            d={path.d}
          />
        ))}
        {scene.nodes.map((node) => (
          <g
            key={node.id}
            className="spv2Node"
            data-active={activeBeat >= node.beat ? "true" : "false"}
            data-tone={node.tone ?? "signal"}
            filter={activeBeat >= node.beat ? "url(#spv2Glow)" : undefined}
          >
            <circle className="spv2NodeHalo" cx={node.x} cy={node.y} r="58" />
            <circle className="spv2NodeCore" cx={node.x} cy={node.y} r="26" />
          </g>
        ))}
      </svg>
      {scene.nodes.map((node) => (
        <span
          key={node.id}
          className="spv2NodeBadge"
          data-active={activeBeat >= node.beat ? "true" : "false"}
          style={
            {
              left: toPercent(node.x, 1000),
              top: toPercent(node.y, 560),
            } as React.CSSProperties
          }
        >
          {node.label[language]}
        </span>
      ))}
    </div>
  );
}

function BeatMarkers({
  copy,
  activeBeat,
}: {
  copy: SceneCopy;
  activeBeat: number;
}) {
  return (
    <div className="spv2BeatRail" data-beat-layout-item="true">
      {copy.beats.map((beat, index) => (
        <div
          key={beat.marker}
          className="spv2Beat"
          data-active={activeBeat >= index ? "true" : "false"}
        >
          {beat.marker}
        </div>
      ))}
    </div>
  );
}

function ReadoutCards({
  copy,
  activeBeat,
}: {
  copy: SceneCopy;
  activeBeat: number;
}) {
  return (
    <div className="spv2Cards">
      {copy.cards.slice(0, activeBeat + 1).map((card) => (
        <article
          key={card.label}
          className="spv2Card"
          data-beat-layout-item="true"
        >
          <div className="spv2CardLabel">{card.label}</div>
          <div>
            <p className="spv2CardValue">{card.value}</p>
            <p className="spv2CardNote">{card.note}</p>
          </div>
        </article>
      ))}
    </div>
  );
}

function PipelineScene({
  sceneId,
  beat,
  language,
  isActive,
  isThumbnail,
  reducedMotion,
}: {
  sceneId: number;
  beat: number;
  language: Lang;
  isActive: boolean;
  isThumbnail: boolean;
  reducedMotion: boolean;
}) {
  const normalizedScene = normalizeScene(sceneId);
  const scene = SCENES[normalizedScene];
  const copy = getSceneCopy(normalizedScene, language);
  const maxBeat = copy.beats.length - 1;
  const activeBeat = isThumbnail ? maxBeat : clampBeat(beat, maxBeat);
  const { ref } = useFLIP<HTMLDivElement>({
    watch: [normalizedScene, activeBeat, language],
    disabled: reducedMotion || isThumbnail || !isActive,
    duration: 560,
    easing: "cubic-bezier(0.16, 1, 0.3, 1)",
    selector: '[data-beat-layout-item="true"]',
  });

  return (
    <section
      className="spv2Scene"
      data-scene={normalizedScene}
      style={
        {
          "--spv2-accent": scene.accent,
          "--spv2-secondary": scene.secondary,
        } as React.CSSProperties
      }
    >
      <div
        ref={ref}
        className="spv2SceneShell"
        data-beat-layout-container="true"
        data-beat-layout-mode="motion"
      >
        <header className="spv2Header" data-beat-layout-item="true">
          <div className="spv2CodeBlock">
            <span>{copy.eyebrow}</span>
            <span className="spv2Code">{scene.code}</span>
          </div>
          <div className="spv2TitleWrap">
            <p className="spv2Eyebrow">{copy.subtitle}</p>
            <h1 className="spv2Title">{copy.title}</h1>
          </div>
          <div className="spv2Metric">
            <div className="spv2MetricLabel">{copy.metricLabel}</div>
            <div className="spv2MetricValue">{copy.metricValue}</div>
          </div>
        </header>

        <main className="spv2MainGrid">
          <SignalVisual
            scene={scene}
            language={language}
            activeBeat={activeBeat}
          />
          <aside className="spv2Readout" data-beat-layout-item="true">
            <p className="spv2Body" data-beat-layout-item="true">
              {copy.body}
            </p>
            <div className="spv2Status" data-beat-layout-item="true">
              <div>
                <div className="spv2StatusLabel">{copy.statusLabel}</div>
              </div>
              <div className="spv2StatusValue">{copy.statusValue}</div>
            </div>
            <ReadoutCards copy={copy} activeBeat={activeBeat} />
          </aside>
        </main>

        <BeatMarkers copy={copy} activeBeat={activeBeat} />
      </div>
    </section>
  );
}

function RouteNavigator({
  scene,
  language,
  isThumbnail,
  onNavigate,
}: {
  scene: SceneId;
  language: Lang;
  isThumbnail: boolean;
  onNavigate?: (scene: number, beat: number) => void;
}) {
  if (isThumbnail) return null;

  return (
    <nav
      className="spv2RouteNav"
      aria-label={
        language === "zh" ? "信号管线路由导航" : "Signal pipeline route navigation"
      }
    >
      <span className="spv2RouteNavLine" aria-hidden="true" />
      {SCENE_IDS.map((sceneId) => {
        const itemScene = SCENES[sceneId];
        const active = sceneId === scene;
        return (
          <button
            key={sceneId}
            type="button"
            className="spv2NavButton"
            data-active={active ? "true" : "false"}
            aria-current={active ? "step" : undefined}
            disabled={!onNavigate}
            onClick={() => onNavigate?.(sceneId, 0)}
            style={
              {
                "--spv2-active-accent": itemScene.accent,
              } as React.CSSProperties
            }
          >
            <span className="spv2NavPulse" aria-hidden="true" />
            <span>
              <span className="spv2NavIndex">
                {String(sceneId).padStart(2, "0")}
              </span>
              <span className="spv2NavLabel">
                {itemScene.copy[language].nav}
              </span>
            </span>
          </button>
        );
      })}
    </nav>
  );
}

export function getMetadata(lang: Lang): StyleMetadata {
  return {
    id: "signal-pipeline-flow",
    band: "balanced-hybrid",
    name: lang === "zh" ? "信号管线流" : "Signal Pipeline Flow",
    theme: lang === "zh" ? "从事件到洞察" : "From Event to Insight",
    densityLabel: lang === "zh" ? "技术密集" : "Technical Dense",
    heroScene: 3,
    colors: {
      bg: "#071017",
      ink: "#ecfbff",
      panel: "#0b1721",
    },
    typography: {
      header: "IBM Plex Mono 600",
      body: "IBM Plex Mono 400",
    },
    tags: [
      "pipeline",
      "technical",
      "data-flow",
      "glow",
      "motion",
      "balanced-hybrid",
    ],
    fonts: ["IBM Plex Mono", "cjk:Noto Sans SC"],
    scenes: SCENE_IDS.map((sceneId) => {
      const copy = getSceneCopy(sceneId, lang);
      return {
        id: sceneId,
        title: copy.title,
        beats: copy.beats.map((beat, index) => ({
          id: index,
          action: beat.action,
          title: beat.title,
          body: beat.body,
        })),
      };
    }),
  };
}

export default function EventToInsightV2({
  scene,
  beat,
  language,
  isThumbnail,
  reducedMotion,
  onNavigate,
}: BespokeStyleProps) {
  useFonts();
  useSignalPipelineStyles();

  const normalizedScene = normalizeScene(scene);
  const motionOff = reducedMotion || isThumbnail;

  return (
    <div
      className="signalPipelineV2Root"
      data-motion={motionOff ? "off" : "on"}
      style={
        {
          "--spv2-active-accent": SCENES[normalizedScene].accent,
        } as React.CSSProperties
      }
    >
      <SpatialSceneTrack
        scene={normalizedScene}
        beat={beat}
        transitionKind="slide-x"
        transitionMap={TRANSITION_MAP}
        transitionDurationMs={720}
        reducedMotion={motionOff}
        beatLayoutModes={BEAT_LAYOUT_MODES}
        className="spv2Track"
        renderScene={(sceneId, sceneBeat, isActive) => (
          <PipelineScene
            sceneId={sceneId}
            beat={sceneBeat}
            language={language}
            isActive={isActive}
            isThumbnail={isThumbnail}
            reducedMotion={motionOff}
          />
        )}
      />
      <RouteNavigator
        scene={normalizedScene}
        language={language}
        isThumbnail={isThumbnail}
        onNavigate={onNavigate}
      />
    </div>
  );
}

export const eventToInsightTopic = defineStyleTopic({
  id: "event-insight",
  topic: {
    en: "Event Insight",
    zh: "事件洞察",
  },
  model: "GPT-5.5",
  component: EventToInsightV2,
  getMetadata,
});

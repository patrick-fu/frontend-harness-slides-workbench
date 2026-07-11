import { useEffect, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import SpatialSceneTrack from "./SpatialSceneTrack";
import type { SceneTransitionMap } from "./SpatialSceneTrack";
import { useFLIP } from "../hooks/useFLIP";
import type { BespokeStyleProps, StyleMetadata } from "../types";
import { defineStyleTopic } from "./topic";
import { curatedNavigationAttributes } from "./curated-topic-contract";

/* ── Palette: warm natural material tones (sand, leather, wood, brass) ── */
const P = {
  bg: "#E7D8BE",
  bgDeep: "#D9C39D",
  ink: "#2E2418",
  inkSoft: "#5C4A32",
  cream: "#F5EDDB",
  kraft: "#C9A876",
  kraftDeep: "#B08A46",
  leather: "#6E4A2A",
  leatherDeep: "#472D18",
  wood: "#8A5A2E",
  brass: "#B8944D",
  brassLite: "#D2B06A",
  amber: "#C1762E",
  line: "#9C8763",
};

const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

function useEntered(isActive: boolean, settled: boolean): boolean {
  const [entered, setEntered] = useState(false);
  useEffect(() => {
    if (!isActive) {
      setEntered(false);
      return;
    }
    if (settled) {
      setEntered(true);
      return;
    }
    const id = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(id);
  }, [isActive, settled]);
  return settled ? isActive : entered;
}

/* ── Bilingual content (no `as const`; see Copy type below) ── */
const COPY = {
  en: {
    topic: "The Onboarding Toolkit",
    name: "Object Metaphor Hero",
    density: "Object-Led",
    nav: ["Case", "Open", "Tools", "Assemble", "Ready"],
    kitLabel: "One coherent kit",
    kitNote: "Covers the first week end to end.",
    readyStamp: "READY · DAY ONE",
    tools: [
      { name: "Access", task: "Log in to everything" },
      { name: "Handbook", task: "Read the team docs" },
      { name: "Buddy", task: "Meet your buddy" },
      { name: "Checklist", task: "Tick off day one" },
      { name: "Setup", task: "Build the project" },
    ],
    scenes: [
      {
        title: "The Case",
        beats: [
          { action: "The case eases in", title: "The Onboarding Toolkit", body: "Everything a new teammate needs, packed into one honest case." },
        ],
      },
      {
        title: "Opened",
        beats: [
          { action: "Unlatch", title: "Open the case", body: "Release the brass latches and lift the lid." },
          { action: "Lift the lid", title: "Compartments", body: "The tray fans open, one part of the ramp-up per slot." },
          { action: "Fully open", title: "Laid out", body: "Five compartments, one tidy tray, nothing missing." },
        ],
      },
      {
        title: "The Tools",
        beats: [
          { action: "Name the tools", title: "Every tool in its slot", body: "Each compartment holds one named, labeled tool." },
          { action: "Match to task", title: "A tool for each task", body: "Every tool maps to a first-week task." },
        ],
      },
      {
        title: "Assembled",
        beats: [
          { action: "Relate the parts", title: "Parts of one kit", body: "Connectors tie each tool back to the whole." },
          { action: "See the whole", title: "One coherent kit", body: "Together the parts cover the first week." },
        ],
      },
      {
        title: "Ready",
        beats: [
          { action: "Pack it up", title: "Packed and ready", body: "The lid closes, tagged for the new hire." },
          { action: "Hand it over", title: "Ready on day one", body: "Handed over, prepared before the first standup." },
        ],
      },
    ],
  },
  zh: {
    topic: "入职工具包",
    name: "物体主视觉",
    density: "以物载意",
    nav: ["工具箱", "开箱", "工具", "组装", "就绪"],
    kitLabel: "一套完整方案",
    kitNote: "覆盖第一周始终。",
    readyStamp: "就绪 · 第一天",
    tools: [
      { name: "权限", task: "登录所有系统" },
      { name: "手册", task: "通读团队文档" },
      { name: "伙伴", task: "认识你的伙伴" },
      { name: "清单", task: "完成第一天清单" },
      { name: "环境", task: "跑通项目" },
    ],
    scenes: [
      {
        title: "工具箱",
        beats: [
          { action: "工具箱缓缓入场", title: "入职工具包", body: "新同事所需的一切，装进一只扎实的箱子。" },
        ],
      },
      {
        title: "开箱",
        beats: [
          { action: "解开搭扣", title: "打开箱子", body: "松开黄铜搭扣，掀起箱盖。" },
          { action: "掀起箱盖", title: "分格收纳", body: "托盘徐徐展开，每个格子装着上手的一部分。" },
          { action: "完全打开", title: "一览无余", body: "五个格子，一只整齐托盘，样样齐全。" },
        ],
      },
      {
        title: "工具",
        beats: [
          { action: "为工具命名", title: "各归其位", body: "每个格子装着一件贴好标签的工具。" },
          { action: "对应任务", title: "每件工具对应一个任务", body: "每件工具对应第一周的一项任务。" },
        ],
      },
      {
        title: "组装",
        beats: [
          { action: "关联各部分", title: "同属一套", body: "连接线把每件工具连回整体。" },
          { action: "看见整体", title: "一套完整方案", body: "合在一起，覆盖第一周始终。" },
        ],
      },
      {
        title: "就绪",
        beats: [
          { action: "收拾装箱", title: "打包就绪", body: "箱盖合上，贴好新同事的标签。" },
          { action: "交到手上", title: "第一天即就绪", body: "在第一次站会前，已备妥交付。" },
        ],
      },
    ],
  },
};

type Copy = typeof COPY.en;

const TRANSITIONS: SceneTransitionMap = {
  "1->2": "page-flip",
  "2->3": "scale-fade",
  "3->4": "fade",
  "4->5": "scale-fade",
};

/* ── Small line-drawn tool glyphs (leather ink) ── */
function ToolGlyph({ index, color }: { index: number; color: string }) {
  const common: CSSProperties = { width: "5.6cqw", height: "5.6cqw", display: "block" };
  const stroke = { fill: "none", stroke: color, strokeWidth: 1.6, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  const paths: ReactNode[] = [
    <g key="k"><circle cx="8" cy="9" r="4" {...stroke} /><path d="M11 12 L20 21 M17 18 h3 M18 17 v3" {...stroke} /></g>,
    <g key="b"><path d="M4 5h7v15H4z M13 5h7v15h-7z M11 5v15" {...stroke} /></g>,
    <g key="p"><circle cx="12" cy="8" r="3.4" {...stroke} /><path d="M5.5 20c0-3.6 3-6.5 6.5-6.5S18.5 16.4 18.5 20" {...stroke} /></g>,
    <g key="c"><path d="M6 4h12v16H6z M9 9l2 2 4-4 M9 15h6" {...stroke} /></g>,
    <g key="w"><path d="M20 6a4 4 0 0 1-5.3 5.3L6.5 19.5l-2-2 8.2-8.2A4 4 0 0 1 18 4l-2.6 2.6 2 2L20 6Z" {...stroke} /></g>,
  ];
  return (
    <svg viewBox="0 0 24 24" style={common} aria-hidden="true">
      {paths[index] ?? paths[0]}
    </svg>
  );
}

/* ── Shared header: kraft action tag + authored title + calm body ── */
function Header({
  action,
  title,
  body,
  fontTitle,
  fontLabel,
  entered,
  reducedMotion,
}: {
  action: string;
  title: string;
  body: string;
  fontTitle: string;
  fontLabel: string;
  entered: boolean;
  reducedMotion: boolean;
}) {
  const rise = (d: number): CSSProperties => ({
    opacity: entered ? 1 : 0,
    transform: entered ? "translateY(0)" : "translateY(2.4cqh)",
    transition: reducedMotion ? "none" : `opacity 620ms ${EASE} ${d}ms, transform 620ms ${EASE} ${d}ms`,
  });
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.6cqh", maxWidth: "62cqw" }}>
      <span
        style={{
          ...rise(0),
          alignSelf: "flex-start",
          fontFamily: fontLabel,
          fontSize: "1.9cqh",
          fontWeight: 600,
          letterSpacing: "0.24em",
          textTransform: "uppercase",
          color: P.leather,
          background: P.kraft,
          padding: "0.7cqh 1.5cqw",
          borderRadius: "0.5cqw",
          border: `0.12cqw solid ${P.kraftDeep}`,
          boxShadow: `0 0.4cqh 0.9cqw rgba(46,36,24,0.16)`,
        }}
      >
        {action}
      </span>
      <h1
        style={{
          ...rise(70),
          margin: 0,
          fontFamily: fontTitle,
          fontSize: "6.4cqh",
          fontWeight: 500,
          lineHeight: 1.02,
          letterSpacing: "-0.01em",
          color: P.ink,
        }}
      >
        {title}
      </h1>
      <p
        style={{
          ...rise(140),
          margin: 0,
          fontFamily: fontLabel,
          fontSize: "2.4cqh",
          fontWeight: 400,
          lineHeight: 1.42,
          color: P.inkSoft,
        }}
      >
        {body}
      </p>
    </div>
  );
}

interface SceneProps {
  scene: number;
  beat: number;
  isActive: boolean;
  language: "en" | "zh";
  reducedMotion: boolean;
  isThumbnail: boolean;
}

function Scene({
  scene,
  beat,
  isActive,
  language,
  reducedMotion: requestedReducedMotion,
  isThumbnail,
}: SceneProps) {
  const c: Copy = COPY[language];
  const fontTitle = language === "zh" ? '"Noto Serif SC", "Fraunces", serif' : '"Fraunces", "Noto Serif SC", serif';
  const fontLabel = language === "zh" ? '"Noto Sans SC", "Inter", sans-serif' : '"Inter", "Noto Sans SC", sans-serif';
  const reducedMotion = requestedReducedMotion || isThumbnail;
  const still = reducedMotion;
  const entered = useEntered(isActive, still);

  const sc = c.scenes[scene - 1];
  const b = Math.min(beat, sc.beats.length - 1);
  const step = sc.beats[b];

  const flip = useFLIP<HTMLDivElement>({
    watch: [b],
    disabled: still || !isActive || scene !== 2,
    duration: 520,
    easing: "cubic-bezier(0.34, 1.42, 0.64, 1)",
    selector: '[data-beat-layout-item="true"]',
  });

  const frame: CSSProperties = {
    position: "absolute",
    inset: 0,
    padding: "6.5cqh 8cqw 15cqh",
    display: "flex",
    flexDirection: "column",
    boxSizing: "border-box",
  };
  const stageRise: CSSProperties = {
    opacity: entered ? 1 : 0,
    transition: reducedMotion ? "none" : `opacity 640ms ${EASE} 120ms`,
  };

  /* ── Scene 1 — the closed case eases in ── */
  if (scene === 1) {
    return (
      <div style={{ ...frame, alignItems: "center", justifyContent: "center", textAlign: "center", gap: "4cqh" }}>
        <div
          style={{
            position: "relative",
            width: "44cqw",
            height: "27cqh",
            transform: entered ? "translateY(0) scale(1)" : "translateY(5cqh) scale(0.94)",
            opacity: entered ? 1 : 0,
            transition: reducedMotion ? "none" : `transform 820ms ${EASE}, opacity 700ms ${EASE}`,
          }}
        >
          <div style={{ position: "absolute", left: "50%", top: "-4.6cqh", transform: "translateX(-50%)", width: "15cqw", height: "5cqh", borderRadius: "3cqw", border: `1cqh solid ${P.leatherDeep}`, background: "transparent", boxShadow: `0 0.4cqh 0.9cqw rgba(46,36,24,0.28)` }} />
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "1.4cqw",
              background: `linear-gradient(158deg, ${P.wood} 0%, ${P.leather} 52%, ${P.leatherDeep} 100%)`,
              boxShadow: `0 3cqh 4cqw rgba(46,36,24,0.32), inset 0 0.3cqh 0.6cqw rgba(255,240,214,0.14)`,
              border: `0.14cqw solid ${P.leatherDeep}`,
              overflow: "hidden",
            }}
          >
            <div style={{ position: "absolute", left: 0, right: 0, top: "48%", height: "0.3cqh", background: "rgba(46,36,24,0.4)" }} />
            {[35, 65].map((x) => (
              <div key={x} style={{ position: "absolute", left: `${x}%`, top: "44%", transform: "translateX(-50%)", width: "6cqw", height: "4cqh", borderRadius: "0.5cqw", background: `linear-gradient(${P.brassLite}, ${P.brass})`, boxShadow: `0 0.4cqh 0.7cqw rgba(46,36,24,0.3)` }} />
            ))}
            <div style={{ position: "absolute", left: "8%", top: "9%", transform: "rotate(-5deg)", background: P.cream, color: P.leather, fontFamily: fontLabel, fontSize: "1.7cqh", fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", padding: "0.7cqh 1.4cqw", borderRadius: "0.4cqw", boxShadow: `0 0.4cqh 0.8cqw rgba(46,36,24,0.28)` }}>
              KIT · 48
            </div>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1.4cqh" }}>
          <span style={{ opacity: entered ? 1 : 0, transition: reducedMotion ? "none" : `opacity 620ms ${EASE} 200ms`, fontFamily: fontLabel, fontSize: "1.9cqh", fontWeight: 600, letterSpacing: "0.26em", textTransform: "uppercase", color: P.leather }}>
            {step.action}
          </span>
          <h1 style={{ margin: 0, opacity: entered ? 1 : 0, transform: entered ? "translateY(0)" : "translateY(2cqh)", transition: reducedMotion ? "none" : `opacity 700ms ${EASE} 260ms, transform 700ms ${EASE} 260ms`, fontFamily: fontTitle, fontSize: "8cqh", fontWeight: 500, lineHeight: 1, letterSpacing: "-0.012em", color: P.ink }}>
            {step.title}
          </h1>
          <p style={{ margin: 0, maxWidth: "56cqw", opacity: entered ? 1 : 0, transition: reducedMotion ? "none" : `opacity 640ms ${EASE} 340ms`, fontFamily: fontLabel, fontSize: "2.4cqh", lineHeight: 1.4, color: P.inkSoft }}>
            {step.body}
          </p>
        </div>
      </div>
    );
  }

  /* ── Scene 2 — lid lifts, compartments fan open (motion / FLIP) ── */
  if (scene === 2) {
    const lidDeg = [-20, -64, -98][b] ?? -98;
    const trayW = [56, 72, 88][b] ?? 88;
    return (
      <div style={frame}>
        <Header action={step.action} title={step.title} body={step.body} fontTitle={fontTitle} fontLabel={fontLabel} entered={entered} reducedMotion={reducedMotion} />
        <div style={{ ...stageRise, flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", perspective: "1400px" }}>
          <div
            style={{
              width: `${trayW}cqw`,
              height: "5cqh",
              transformOrigin: "bottom center",
              transform: `rotateX(${lidDeg}deg)`,
              transition: reducedMotion ? "none" : `transform 640ms ${EASE}, width 560ms ${EASE}`,
              borderRadius: "1cqw 1cqw 0 0",
              background: `linear-gradient(180deg, ${P.leatherDeep}, ${P.leather})`,
              boxShadow: `0 -0.6cqh 1.4cqw rgba(46,36,24,0.3)`,
              border: `0.12cqw solid ${P.leatherDeep}`,
            }}
          />
          <div
            ref={flip.ref}
            data-beat-layout-container="true"
            data-beat-layout-mode="motion"
            style={{
              width: `${trayW}cqw`,
              height: "32cqh",
              display: "flex",
              gap: "1.4cqw",
              padding: "1.6cqh 1.4cqw",
              boxSizing: "border-box",
              borderRadius: "0 0 1.2cqw 1.2cqw",
              background: `linear-gradient(180deg, ${P.wood}, ${P.leather})`,
              boxShadow: `inset 0 0.6cqh 1.4cqw rgba(46,36,24,0.4), 0 2cqh 3cqw rgba(46,36,24,0.28)`,
              transition: reducedMotion ? "none" : `width 560ms ${EASE}`,
            }}
          >
            {c.tools.map((tool, i) => (
              <div
                key={tool.name}
                data-beat-layout-item="true"
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "1.2cqh",
                  borderRadius: "0.7cqw",
                  background: `linear-gradient(160deg, ${P.cream}, ${P.kraft})`,
                  boxShadow: `inset 0 0.3cqh 0.7cqw rgba(46,36,24,0.18)`,
                  border: `0.1cqw solid ${P.kraftDeep}`,
                }}
              >
                <ToolGlyph index={i} color={P.leather} />
                <span style={{ fontFamily: fontLabel, fontSize: "1.9cqh", fontWeight: 600, color: P.leatherDeep }}>{tool.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* ── Scene 3 — each slot's tool related to a first-week task (reserved) ── */
  if (scene === 3) {
    return (
      <div style={frame}>
        <Header action={step.action} title={step.title} body={step.body} fontTitle={fontTitle} fontLabel={fontLabel} entered={entered} reducedMotion={reducedMotion} />
        <div
          data-beat-layout-container="true"
          data-beat-layout-mode="reserved"
          style={{ ...stageRise, flex: 1, display: "flex", gap: "1.6cqw", alignItems: "stretch", marginTop: "3cqh" }}
        >
          {c.tools.map((tool, i) => (
            <div
              key={tool.name}
              data-beat-layout-item="true"
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                gap: "1.6cqh",
                padding: "2.2cqh 1.2cqw",
                boxSizing: "border-box",
                borderRadius: "0.9cqw",
                background: `linear-gradient(165deg, ${P.cream}, ${P.bgDeep})`,
                border: `0.12cqw solid ${b >= 1 ? P.kraftDeep : P.kraft}`,
                boxShadow: b >= 1 ? `0 1.2cqh 2cqw rgba(46,36,24,0.2)` : `0 0.5cqh 1cqw rgba(46,36,24,0.12)`,
                transform: b >= 1 ? "translateY(0)" : "translateY(0.6cqh)",
                transition: reducedMotion ? "none" : `box-shadow 480ms ${EASE}, transform 480ms ${EASE}, border-color 480ms ${EASE}`,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "9cqw", height: "9cqw", borderRadius: "50%", background: P.kraft, border: `0.14cqw solid ${P.kraftDeep}` }}>
                <ToolGlyph index={i} color={P.leatherDeep} />
              </div>
              <span style={{ fontFamily: fontTitle, fontSize: "3cqh", fontWeight: 500, color: P.ink }}>{tool.name}</span>
              <div
                style={{
                  marginTop: "auto",
                  opacity: b >= 1 ? 1 : 0.26,
                  transform: b >= 1 ? "translateX(0)" : "translateX(-0.8cqw)",
                  transition: reducedMotion ? "none" : `opacity 480ms ${EASE}, transform 480ms ${EASE}`,
                }}
              >
                <span style={{ fontFamily: fontLabel, fontSize: "1.6cqh", fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: P.amber }}>
                  {language === "zh" ? "任务" : "Task"}
                </span>
                <p style={{ margin: "0.5cqh 0 0", fontFamily: fontLabel, fontSize: "2cqh", lineHeight: 1.34, color: P.inkSoft }}>{tool.task}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  /* ── Scene 4 — connectors relate parts to the whole kit (reserved) ── */
  if (scene === 4) {
    return (
      <div style={frame}>
        <Header action={step.action} title={step.title} body={step.body} fontTitle={fontTitle} fontLabel={fontLabel} entered={entered} reducedMotion={reducedMotion} />
        <div
          data-beat-layout-container="true"
          data-beat-layout-mode="reserved"
          style={{ ...stageRise, flex: 1, display: "flex", alignItems: "center", gap: "3cqw", marginTop: "2cqh" }}
        >
          <div data-beat-layout-item="true" style={{ display: "flex", flexDirection: "column", gap: "1.4cqh", width: "36cqw" }}>
            {c.tools.map((tool, i) => (
              <div key={tool.name} style={{ display: "flex", alignItems: "center", gap: "1.4cqw", padding: "1.4cqh 1.4cqw", borderRadius: "0.7cqw", background: P.cream, border: `0.1cqw solid ${P.kraft}`, boxShadow: `0 0.4cqh 0.9cqw rgba(46,36,24,0.12)` }}>
                <ToolGlyph index={i} color={P.leather} />
                <span style={{ fontFamily: fontLabel, fontSize: "2.1cqh", fontWeight: 600, color: P.ink }}>{tool.name}</span>
              </div>
            ))}
          </div>
          <div
            style={{
              width: "9cqw",
              alignSelf: "stretch",
              margin: "2cqh 0",
              borderTop: `0.3cqw solid ${P.brass}`,
              borderBottom: `0.3cqw solid ${P.brass}`,
              borderRight: `0.3cqw solid ${P.brass}`,
              borderRadius: "0 2cqw 2cqw 0",
              opacity: b >= 1 ? 1 : 0.3,
              transform: b >= 1 ? "scaleX(1)" : "scaleX(0.7)",
              transformOrigin: "left center",
              transition: reducedMotion ? "none" : `opacity 520ms ${EASE}, transform 520ms ${EASE}`,
            }}
          />
          <div
            data-beat-layout-item="true"
            style={{
              flex: 1,
              alignSelf: "stretch",
              margin: "1cqh 0",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: "2cqh",
              padding: "3cqh 2.4cqw",
              borderRadius: "1.2cqw",
              background: `linear-gradient(160deg, ${P.wood}, ${P.leatherDeep})`,
              color: P.cream,
              border: `0.14cqw solid ${P.leatherDeep}`,
              boxShadow: b >= 1 ? `0 2.4cqh 3.4cqw rgba(46,36,24,0.36)` : `0 1cqh 2cqw rgba(46,36,24,0.24)`,
              transform: b >= 1 ? "scale(1)" : "scale(0.98)",
              transition: reducedMotion ? "none" : `box-shadow 520ms ${EASE}, transform 520ms ${EASE}`,
            }}
          >
            <span style={{ fontFamily: fontLabel, fontSize: "1.8cqh", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: P.brassLite }}>
              {language === "zh" ? "整体" : "The Kit"}
            </span>
            <span style={{ fontFamily: fontTitle, fontSize: "4.4cqh", fontWeight: 500, lineHeight: 1.06 }}>{c.kitLabel}</span>
            <span style={{ fontFamily: fontLabel, fontSize: "2.1cqh", lineHeight: 1.4, color: "rgba(245,237,219,0.86)" }}>{c.kitNote}</span>
          </div>
        </div>
      </div>
    );
  }

  /* ── Scene 5 — the complete kit, packed and tagged (reserved) ── */
  return (
    <div style={frame}>
      <Header action={step.action} title={step.title} body={step.body} fontTitle={fontTitle} fontLabel={fontLabel} entered={entered} reducedMotion={reducedMotion} />
      <div
        data-beat-layout-container="true"
        data-beat-layout-mode="reserved"
        style={{ ...stageRise, flex: 1, display: "flex", alignItems: "center", gap: "4cqw", marginTop: "2cqh" }}
      >
        <div data-beat-layout-item="true" style={{ position: "relative", width: "38cqw", height: "34cqh" }}>
          <div style={{ position: "absolute", left: "50%", top: "-4cqh", transform: "translateX(-50%)", width: "13cqw", height: "4.4cqh", borderRadius: "3cqw", border: `0.9cqh solid ${P.leatherDeep}`, boxShadow: `0 0.4cqh 0.8cqw rgba(46,36,24,0.26)` }} />
          <div style={{ position: "absolute", inset: 0, borderRadius: "1.4cqw", background: `linear-gradient(158deg, ${P.wood}, ${P.leather} 55%, ${P.leatherDeep})`, boxShadow: `0 2.6cqh 3.6cqw rgba(46,36,24,0.32)`, border: `0.14cqw solid ${P.leatherDeep}`, overflow: "hidden" }}>
            <div style={{ position: "absolute", left: 0, right: 0, top: "50%", height: "0.3cqh", background: "rgba(46,36,24,0.42)" }} />
            {[35, 65].map((x) => (
              <div key={x} style={{ position: "absolute", left: `${x}%`, top: "46%", transform: "translateX(-50%)", width: "5cqw", height: "3.4cqh", borderRadius: "0.5cqw", background: `linear-gradient(${P.brassLite}, ${P.brass})`, boxShadow: `0 0.3cqh 0.6cqw rgba(46,36,24,0.3)` }} />
            ))}
          </div>
          <div
            style={{
              position: "absolute",
              right: "-3cqw",
              top: "6cqh",
              transform: b >= 1 ? "rotate(6deg)" : "rotate(6deg) translateY(-0.6cqh)",
              opacity: b >= 1 ? 1 : 0.86,
              background: P.cream,
              color: P.leatherDeep,
              fontFamily: fontLabel,
              fontSize: "1.9cqh",
              fontWeight: 600,
              letterSpacing: "0.16em",
              padding: "1.1cqh 1.8cqw",
              borderRadius: "0.5cqw",
              border: `0.12cqw solid ${P.kraftDeep}`,
              boxShadow: `0 0.6cqh 1.2cqw rgba(46,36,24,0.28)`,
              transition: reducedMotion ? "none" : `opacity 480ms ${EASE}, transform 480ms ${EASE}`,
            }}
          >
            {c.readyStamp}
          </div>
        </div>
        <div data-beat-layout-item="true" style={{ flex: 1, display: "flex", flexDirection: "column", gap: "1.4cqh" }}>
          {c.tools.map((tool, i) => (
            <div key={tool.name} style={{ display: "flex", alignItems: "center", gap: "1.4cqw" }}>
              <span
                style={{
                  width: "3.6cqw",
                  height: "3.6cqw",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: b >= 1 ? P.amber : "transparent",
                  border: `0.2cqw solid ${b >= 1 ? P.amber : P.kraftDeep}`,
                  color: P.cream,
                  fontFamily: fontLabel,
                  fontSize: "2cqh",
                  fontWeight: 700,
                  transition: reducedMotion ? "none" : `background 420ms ${EASE} ${i * 40}ms, border-color 420ms ${EASE} ${i * 40}ms`,
                }}
              >
                {b >= 1 ? "✓" : ""}
              </span>
              <span style={{ fontFamily: fontLabel, fontSize: "2.2cqh", fontWeight: 500, color: P.ink, opacity: b >= 1 ? 1 : 0.6, transition: reducedMotion ? "none" : `opacity 420ms ${EASE}` }}>
                {tool.name} · {tool.task}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── N10 nav: the kit's own slots as a compartment index ── */
function CompartmentIndex({
  scene,
  language,
  isThumbnail,
  onNavigate,
}: {
  scene: number;
  language: "en" | "zh";
  isThumbnail: boolean;
  onNavigate?: (scene: number, beat: number) => void;
}) {
  if (isThumbnail) return null;
  const c = COPY[language];
  const fontLabel = language === "zh" ? '"Noto Sans SC", "Inter", sans-serif' : '"Inter", "Noto Sans SC", sans-serif';
  return (
    <div
      {...curatedNavigationAttributes("object-metaphor-hero", "onboarding-toolkit")}
      onClick={(e) => e.stopPropagation()}
      style={{
        position: "absolute",
        left: "50%",
        bottom: "3.4cqh",
        transform: "translateX(-50%)",
        display: "flex",
        gap: "0.6cqw",
        padding: "1cqh 1cqw",
        borderRadius: "1cqw",
        background: `linear-gradient(180deg, ${P.wood}, ${P.leather})`,
        border: `0.14cqw solid ${P.leatherDeep}`,
        boxShadow: `inset 0 0.4cqh 0.9cqw rgba(46,36,24,0.4), 0 1.2cqh 2cqw rgba(46,36,24,0.26)`,
        zIndex: 5,
      }}
    >
      {c.nav.map((label, i) => {
        const target = i + 1;
        const active = target === scene;
        return (
          <button
            key={label}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onNavigate?.(target, 0);
            }}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "0.4cqh",
              width: "11cqw",
              padding: "1cqh 0.6cqw",
              cursor: "pointer",
              borderRadius: "0.6cqw",
              border: `0.1cqw solid ${active ? P.brassLite : "transparent"}`,
              background: active ? `linear-gradient(180deg, ${P.brassLite}, ${P.brass})` : "rgba(245,237,219,0.1)",
              boxShadow: active ? `0 0.5cqh 1cqw rgba(46,36,24,0.3)` : "inset 0 0.2cqh 0.5cqw rgba(46,36,24,0.28)",
              transform: active ? "translateY(-0.6cqh)" : "translateY(0)",
              transition: `all 320ms ${EASE}`,
            }}
          >
            <span style={{ fontFamily: fontLabel, fontSize: "1.5cqh", fontWeight: 700, color: active ? P.leatherDeep : P.brassLite }}>0{target}</span>
            <span style={{ fontFamily: fontLabel, fontSize: "1.5cqh", fontWeight: 600, color: active ? P.leatherDeep : "rgba(245,237,219,0.72)", whiteSpace: "nowrap" }}>{label}</span>
          </button>
        );
      })}
    </div>
  );
}

function OnboardingToolkitV3({ scene, beat, language, isThumbnail, reducedMotion, onNavigate }: BespokeStyleProps) {
  return (
    <div
      data-style="onboarding-toolkit-v3"
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        background: `radial-gradient(120% 120% at 50% 0%, ${P.bg} 0%, ${P.bgDeep} 100%)`,
        color: P.ink,
      }}
    >
      <SpatialSceneTrack
        scene={scene}
        beat={beat}
        transitionKind="page-flip"
        transitionMap={TRANSITIONS}
        reducedMotion={reducedMotion || isThumbnail}
        beatLayoutModes={{ 2: "motion", 3: "reserved", 4: "reserved", 5: "reserved" }}
        renderScene={(sceneId, sceneBeat, isActive) => (
          <Scene
            scene={sceneId}
            beat={sceneBeat}
            isActive={isActive}
            language={language}
            reducedMotion={reducedMotion}
            isThumbnail={isThumbnail}
          />
        )}
      />
      <CompartmentIndex scene={scene} language={language} isThumbnail={isThumbnail} onNavigate={onNavigate} />
    </div>
  );
}

export function getMetadata(lang: "en" | "zh"): StyleMetadata {
  const c: Copy = COPY[lang];
  return {
    id: "object-metaphor-hero",
    band: "text-report",
    name: c.name,
    theme: c.topic,
    densityLabel: c.density,
    heroScene: 2,
    colors: { bg: P.bg, ink: P.ink, panel: P.kraft },
    typography: { header: "Fraunces", body: "Inter" },
    tags: ["warm", "tactile", "crafted", "material", "kraft", "object-metaphor", "calm-motion", "text-report"],
    fonts: [
      "Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600",
      "Inter:wght@400;500;600",
      "cjk:Noto Serif SC:wght@500;600",
      "cjk:Noto Sans SC:wght@400;500",
    ],
    scenes: c.scenes.map((s, i) => ({
      id: i + 1,
      title: s.title,
      beats: s.beats.map((bt, j) => ({ id: j, action: bt.action, title: bt.title, body: bt.body })),
    })),
  };
}

export default OnboardingToolkitV3;

export const OnboardingToolkitTopic = defineStyleTopic({
  id: "onboarding-toolkit",
  topic: { en: "The Onboarding Toolkit", zh: "入职工具包" },
  model: "GPT 5.6 Sol",
  component: OnboardingToolkitV3,
  getMetadata,
});

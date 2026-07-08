import { useEffect } from "react";
import type { BespokeStyleProps, StyleMetadata } from "../types";
import { defineStyleVersion } from "./version";
import SpatialSceneTrack from "./SpatialSceneTrack";
import type { SceneTransitionMap } from "./SpatialSceneTrack";
import { useFLIP } from "../hooks/useFLIP";
import s from "./32-triage-the-backlog-v3.module.css";

type Lang = "en" | "zh";

/* ── Machine data (lanes carry MEANING via coded color) ─────────── */
const LANES = [
  { key: "crit", c: "#ff3d68", g: "#ff6f95", en: { name: "Critical", tag: "user-blocking", mult: "×3.0" }, zh: { name: "关键", tag: "阻断用户", mult: "×3.0" }, count: 2, score: 182 },
  { key: "grow", c: "#18d7ff", g: "#6fe6ff", en: { name: "Growth", tag: "moves metrics", mult: "×2.0" }, zh: { name: "增长", tag: "拉动指标", mult: "×2.0" }, count: 2, score: 135 },
  { key: "poli", c: "#ffb020", g: "#ffcb5e", en: { name: "Polish", tag: "nice-to-have", mult: "×1.2" }, zh: { name: "打磨", tag: "锦上添花", mult: "×1.2" }, count: 1, score: 38 },
  { key: "debt", c: "#a06bff", g: "#c39bff", en: { name: "Tech Debt", tag: "future cost", mult: "×1.4" }, zh: { name: "技术债", tag: "未来成本", mult: "×1.4" }, count: 1, score: 52 },
];
const LANE = (k: string) => LANES.find((l) => l.key === k)!;

// backlog items: laneKey, beatIn (drop/fill order), final weighted score
const ITEMS = [
  { lane: "crit", beatIn: 0, score: 94, en: "SSO Login Bug", zh: "SSO 登录故障" },
  { lane: "grow", beatIn: 0, score: 71, en: "Referral Program", zh: "邀请返利" },
  { lane: "poli", beatIn: 1, score: 38, en: "Dark Mode", zh: "深色模式" },
  { lane: "debt", beatIn: 1, score: 52, en: "Refactor Auth", zh: "重构鉴权" },
  { lane: "crit", beatIn: 2, score: 88, en: "Payment Retry", zh: "支付重试" },
  { lane: "grow", beatIn: 2, score: 64, en: "Onboarding Flow", zh: "新手引导" },
];
const RANKED = [...ITEMS].sort((a, b) => b.score - a.score); // scene 5 output

const MAX_SCORE = 182;
const BEATS = [1, 3, 3, 3, 1];

/* ── Bilingual scene/beat copy (NOT `as const`) ─────────────────── */
const COPY: Record<Lang, {
  theme: string; densityLabel: string;
  scenes: { title: string; beats: { action: string; title: string; body: string }[] }[];
}> = {
  en: {
    theme: "Triage the Backlog",
    densityLabel: "Dense · Kinetic",
    scenes: [
      { title: "The Machine", beats: [
        { action: "LOAD", title: "The Sorting Machine", body: "Four weighted lanes sit dormant beneath the hopper. Feed the backlog in and let the machine categorize and score it." },
      ] },
      { title: "The Inputs", beats: [
        { action: "DROP", title: "Inputs Fall In", body: "Raw backlog items tumble from the hopper into the playfield." },
        { action: "BOUNCE", title: "Through the Pins", body: "Each item bounces off pins, its category not yet decided." },
        { action: "SPREAD", title: "Six in the Field", body: "Six requests are live, drifting toward the lanes below." },
      ] },
      { title: "The Lanes", beats: [
        { action: "OPEN", title: "Lanes Go Live", body: "The four category channels light their edges and open their gates." },
        { action: "SORT", title: "First Pass Lands", body: "Early items snap into the lane that matches their category." },
        { action: "FILL", title: "Every Lane Claimed", body: "All six items settle — each channel now holds its sorted set." },
      ] },
      { title: "The Scoring", beats: [
        { action: "COUNT", title: "Raw Tallies", body: "Each lane starts from a plain count of the items it caught." },
        { action: "WEIGH", title: "Multipliers Apply", body: "Every lane's weight kicks in — critical work counts triple." },
        { action: "TICK", title: "Scores Lock In", body: "Counters tick up and the lanes re-rank by weighted score." },
      ] },
      { title: "The Output", beats: [
        { action: "RANK", title: "Top of the Stack", body: "Ranked slots light up and the highest-weighted item takes the crown." },
      ] },
    ],
  },
  zh: {
    theme: "需求分拣",
    densityLabel: "高密度 · 动感",
    scenes: [
      { title: "机器", beats: [
        { action: "装载", title: "分拣机器", body: "四条加权通道静默待机于料斗之下。把需求倒进去，让机器分类并打分。" },
      ] },
      { title: "输入", beats: [
        { action: "投放", title: "输入落入", body: "原始需求从料斗里滚落，进入分拣场。" },
        { action: "碰撞", title: "穿过挡针", body: "每一项在挡针间弹跳，归类尚未确定。" },
        { action: "散布", title: "六项入场", body: "六条需求全部入场，向下方的通道飘落。" },
      ] },
      { title: "通道", beats: [
        { action: "开闸", title: "通道激活", body: "四条分类通道点亮边缘、打开闸门。" },
        { action: "分拣", title: "首批落位", body: "先到的需求落入与其类别匹配的通道。" },
        { action: "填满", title: "各就各位", body: "六项全部归位——每条通道各自持有已分拣的集合。" },
      ] },
      { title: "评分", beats: [
        { action: "计数", title: "原始计数", body: "每条通道先从它接住的需求数量起步。" },
        { action: "加权", title: "乘子生效", body: "各通道权重生效——关键工作三倍计分。" },
        { action: "跳动", title: "分数锁定", body: "计数器跳动，通道按加权分数重新排名。" },
      ] },
      { title: "输出", beats: [
        { action: "排名", title: "栈顶之选", body: "排名槽位点亮，权重最高的需求摘得桂冠。" },
      ] },
    ],
  },
};

const TRANSITIONS: SceneTransitionMap = {
  "1->2": "slide-y",
  "2->3": "slide-y",
  "3->4": "slide-y",
  "4->5": "scale-fade",
};

function useFonts() {
  useEffect(() => {
    const id = "fonts-msf-v3";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@500;700&family=Rajdhani:wght@500;600;700&family=JetBrains+Mono:wght@500;700&family=Noto+Sans+SC:wght@500;700&display=swap";
    document.head.appendChild(link);
  }, []);
}

const clampBeat = (scene: number, beat: number) =>
  Math.max(0, Math.min(beat, BEATS[scene - 1] - 1));

const laneVars = (l: (typeof LANES)[number]) =>
  ({ ["--c" as string]: l.c, ["--cg" as string]: l.g }) as React.CSSProperties;

/* ── Shared HUD ─────────────────────────────────────────────────── */
function Hud({ scene, beat, language }: { scene: number; beat: number; language: Lang }) {
  const b = COPY[language].scenes[scene - 1].beats[beat];
  return (
    <div className={s.hud}>
      <div className={s.hudTop}>
        <span className={s.hudIndex}>{String(scene).padStart(2, "0")} / 05</span>
        <span className={s.hudAction}>{b.action}</span>
        <div className={s.legend}>
          {LANES.map((l) => (
            <span key={l.key} className={s.legendItem}>
              <span className={s.legendDot} style={laneVars(l)} />
              {l[language].name}
            </span>
          ))}
        </div>
      </div>
      <h1 className={s.hudTitle}>{b.title}</h1>
      <p className={s.hudBody}>{b.body}</p>
    </div>
  );
}

/* ── Pins field ─────────────────────────────────────────────────── */
const PIN_ROWS = [16, 27, 38, 49];
function Pins() {
  return (
    <div className={s.pins}>
      {PIN_ROWS.map((top, r) =>
        Array.from({ length: r % 2 === 0 ? 6 : 5 }).map((_, i) => {
          const step = 100 / (r % 2 === 0 ? 7 : 6);
          const left = step * (i + 1) + (r % 2 === 0 ? 0 : step / 2);
          return <span key={`${r}-${i}`} className={s.pin} style={{ left: `${left}%`, top: `${top}cqh` }} />;
        }),
      )}
    </div>
  );
}

/* ── Scene 1: the machine (1 beat) ──────────────────────────────── */
function MachineScene({ language, reduced }: { language: Lang; reduced: boolean }) {
  return (
    <>
      <Hud scene={1} beat={0} language={language} />
      <div className={s.machine}>
        <div className={`${s.hopper} ${reduced ? "" : s.pulse}`}>
          <span className={s.hopperLip}>BACKLOG IN</span>
        </div>
        <Pins />
        <div className={s.laneRow}>
          {LANES.map((l) => (
            <div key={l.key} className={`${s.laneCard} ${s.laneDim}`} style={laneVars(l)}>
              <div className={s.laneHeader}>
                <span className={s.laneName}>{l[language].name}</span>
                <span className={`${s.laneMult} ${s.mono}`}>{l[language].mult}</span>
              </div>
              <span className={s.laneTag}>{l[language].tag}</span>
            </div>
          ))}
        </div>
        <div className={s.baseSlots}>
          {[1, 2, 3, 4, 5].map((n) => (
            <span key={n} className={`${s.baseSlot} ${s.mono}`}>#{n}</span>
          ))}
        </div>
      </div>
    </>
  );
}

/* ── Scene 2: inputs drop (3 beats · motion) ────────────────────── */
function InputsScene({ beat, isActive, language, reduced, isThumbnail }: {
  beat: number; isActive: boolean; language: Lang; reduced: boolean; isThumbnail: boolean;
}) {
  const { ref } = useFLIP<HTMLDivElement>({
    watch: [beat],
    disabled: reduced || isThumbnail || !isActive,
    duration: 480,
    easing: "cubic-bezier(0.34, 1.56, 0.64, 1)",
    selector: '[data-beat-layout-item="true"]',
  });
  const shown = ITEMS.filter((it) => it.beatIn <= beat);
  return (
    <>
      <Hud scene={2} beat={beat} language={language} />
      <div className={s.machine}>
        <div className={`${s.hopper} ${reduced ? "" : s.pulse}`}>
          <span className={s.hopperLip}>BACKLOG IN</span>
        </div>
        <Pins />
        <div ref={ref} className={s.dropTrack} data-beat-layout-container="true" data-beat-layout-mode="motion">
          {shown.map((it) => {
            const l = LANE(it.lane);
            return (
              <div
                key={it.en}
                data-beat-layout-item="true"
                className={`${s.dropChip} ${reduced ? "" : s.bobbing}`}
                style={laneVars(l)}
              >
                <span className={s.chipDot} />
                <span className={s.chipLabel}>{it[language]}</span>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

/* ── Scene 3: lanes sort (3 beats · reserved) ───────────────────── */
function LanesScene({ beat, language }: { beat: number; language: Lang }) {
  return (
    <>
      <Hud scene={3} beat={beat} language={language} />
      <div className={s.machine}>
        <div className={s.laneRow} data-beat-layout-container="true" data-beat-layout-mode="reserved">
          {LANES.map((l) => {
            const dormant = beat < 1;
            const laneItems = ITEMS.filter((it) => it.lane === l.key);
            return (
              <div key={l.key} className={`${s.laneCard} ${dormant ? s.laneDim : ""}`} style={laneVars(l)}>
                <div className={s.laneHeader}>
                  <span className={s.laneName}>{l[language].name}</span>
                  <span className={`${s.laneMult} ${s.mono}`}>{l[language].mult}</span>
                </div>
                <span className={s.laneTag}>{l[language].tag}</span>
                <div className={s.laneSlots}>
                  {laneItems.map((it) => {
                    const filled = beat >= 1 && it.beatIn <= beat;
                    return (
                      <div
                        key={it.en}
                        data-beat-layout-item="true"
                        className={`${s.itemChip} ${filled ? "" : s.chipEmpty}`}
                        style={laneVars(l)}
                      >
                        <span className={s.chipDot} />
                        <span className={s.chipLabel}>{it[language]}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

/* ── Scene 4: scoring (3 beats · motion) ────────────────────────── */
function ScoringScene({ beat, isActive, language, reduced, isThumbnail }: {
  beat: number; isActive: boolean; language: Lang; reduced: boolean; isThumbnail: boolean;
}) {
  const { ref } = useFLIP<HTMLDivElement>({
    watch: [beat],
    disabled: reduced || isThumbnail || !isActive,
    duration: 480,
    easing: "cubic-bezier(0.34, 1.56, 0.64, 1)",
    selector: '[data-beat-layout-item="true"]',
  });
  // beat 2 re-ranks lanes by weighted score; earlier beats keep declared order
  const rows = beat >= 2 ? [...LANES].sort((a, b) => b.score - a.score) : LANES;
  return (
    <>
      <Hud scene={4} beat={beat} language={language} />
      <div ref={ref} className={s.board} data-beat-layout-container="true" data-beat-layout-mode="motion">
        {rows.map((l, i) => {
          const weighted = beat >= 1;
          const value = weighted ? l.score : l.count;
          const pct = weighted ? (l.score / MAX_SCORE) * 100 : (l.count / 2) * 28;
          return (
            <div key={l.key} data-beat-layout-item="true" className={s.scoreRow} style={laneVars(l)}>
              <span className={`${s.scoreRank} ${s.mono}`}>{String(i + 1).padStart(2, "0")}</span>
              <span className={s.scoreName}>{l[language].name}</span>
              <span className={s.scoreMult} style={{ opacity: weighted ? 1 : 0.28 }}>{l[language].mult}</span>
              <span className={s.scoreBar}>
                <span className={s.scoreBarFill} style={{ width: `${pct}%` }} />
              </span>
              <span className={s.scoreVal}>{value}</span>
            </div>
          );
        })}
      </div>
    </>
  );
}

/* ── Scene 5: ranked output (1 beat) ────────────────────────────── */
function OutputScene({ language }: { language: Lang }) {
  return (
    <>
      <Hud scene={5} beat={0} language={language} />
      <div className={s.ranking}>
        {RANKED.map((it, i) => {
          const l = LANE(it.lane);
          const top = i === 0;
          return (
            <div key={it.en} className={`${s.rankSlot} ${top ? s.rankTop : ""}`} style={laneVars(l)}>
              <span className={`${s.rankNum} ${s.mono}`}>
                {top && (
                  <svg className={s.crown} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M3 18h18l-1.5-9-4.5 4-3-6-3 6-4.5-4L3 18z" />
                  </svg>
                )}
                #{i + 1}
              </span>
              <span className={s.rankName}>
                {it[language]}
                <span className={s.rankLane}>{l[language].name}</span>
              </span>
              <span className={s.rankScore}>{it.score}</span>
            </div>
          );
        })}
      </div>
    </>
  );
}

/* ── Nav: numbered slots at the funnel base ─────────────────────── */
function LaneNav({ scene, isThumbnail, onNavigate }: {
  scene: number; isThumbnail: boolean; onNavigate?: (scene: number, beat: number) => void;
}) {
  if (isThumbnail) return null;
  return (
    <nav className={s.nav} aria-label="scene stages">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          className={s.navSlot}
          data-active={scene === n}
          onClick={(e) => {
            e.stopPropagation();
            onNavigate?.(n, 0);
          }}
        >
          {n}
        </button>
      ))}
    </nav>
  );
}

/* ── Root component ─────────────────────────────────────────────── */
const MechanicalScoringFunnelV3: React.FC<BespokeStyleProps> = ({
  scene,
  beat,
  language,
  isThumbnail,
  reducedMotion,
  onNavigate,
}) => {
  useFonts();
  const reduced = reducedMotion || isThumbnail;

  return (
    <div className={s.panel} data-reduced={reduced}>
      <SpatialSceneTrack
        scene={scene}
        beat={beat}
        transitionKind="slide-y"
        transitionMap={TRANSITIONS}
        reducedMotion={reduced}
        beatLayoutModes={{ 2: "motion", 3: "reserved", 4: "motion" }}
        renderScene={(sceneId, sceneBeat, isActive) => {
          const b = clampBeat(sceneId, sceneBeat);
          if (sceneId === 1) return <MachineScene language={language} reduced={reduced} />;
          if (sceneId === 2)
            return <InputsScene beat={b} isActive={isActive} language={language} reduced={reduced} isThumbnail={isThumbnail} />;
          if (sceneId === 3) return <LanesScene beat={b} language={language} />;
          if (sceneId === 4)
            return <ScoringScene beat={b} isActive={isActive} language={language} reduced={reduced} isThumbnail={isThumbnail} />;
          return <OutputScene language={language} />;
        }}
      />
      <LaneNav scene={scene} isThumbnail={isThumbnail} onNavigate={onNavigate} />
    </div>
  );
};

/* ── Metadata (en / zh structurally identical) ──────────────────── */
export function getMetadata(lang: Lang): StyleMetadata {
  const c = COPY[lang];
  return {
    id: "32",
    band: "craft-cultural",
    name: lang === "en" ? "Mechanical Scoring Funnel" : "机械评分漏斗",
    theme: c.theme,
    densityLabel: c.densityLabel,
    heroScene: 4,
    colors: { bg: "#0a0e17", ink: "#e8eef7", panel: "#141e34" },
    typography: { header: "Chakra Petch", body: "Rajdhani" },
    tags:
      lang === "en"
        ? ["playful", "systematic", "evaluative", "dark-playfield", "coded-accents", "kinetic", "arcade-adjacent"]
        : ["playful", "systematic", "evaluative", "dark-playfield", "coded-accents", "kinetic", "arcade-adjacent"],
    fonts: ["Chakra Petch", "Rajdhani", "JetBrains Mono", "cjk:Noto Sans SC"],
    scenes: c.scenes.map((sc, si) => ({
      id: si + 1,
      title: sc.title,
      beats: sc.beats.map((bt, bi) => ({
        id: bi,
        action: bt.action,
        title: bt.title,
        body: bt.body,
      })),
    })),
  };
}

export const mechanicalScoringFunnelV3Version = defineStyleVersion({
  id: "v3",
  topic: { en: "Triage the Backlog", zh: "需求分拣" },
  model: "Claude-Opus-4.8",
  component: MechanicalScoringFunnelV3,
  getMetadata,
});

export default MechanicalScoringFunnelV3;

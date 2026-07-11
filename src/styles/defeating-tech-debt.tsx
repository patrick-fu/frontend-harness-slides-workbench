import type { CSSProperties, ReactNode } from "react";
import SpatialSceneTrack from "./SpatialSceneTrack";
import type { SceneTransitionMap } from "./SpatialSceneTrack";
import { defineStyleTopic } from "./topic";
import { curatedNavigationAttributes } from "./curated-topic-contract";
import { useFLIP } from "../hooks/useFLIP";
import type { BespokeStyleProps, StyleMetadata } from "../types";
import styles from "./defeating-tech-debt.module.css";

/* ── palette (arcade neon on near-black) ─────────────────────────── */
const BG = "#05070f";
const INK = "#e8ffe8";
const PANEL = "#0e1526";
const GREEN = "#3dff73"; // health / reward
const RED = "#ff2d4a"; // danger
const YELLOW = "#ffe23d"; // reward / score
const CYAN = "#35e0ff"; // player accent
const DIM = "#33405e";

const DISPLAY = '"Press Start 2P", "Noto Sans SC", monospace';
const LABEL = '"Silkscreen", "Noto Sans SC", monospace';
const BODY = '"VT323", "Noto Sans SC", monospace';

/* ── bilingual content (no `as const` — breaks build) ────────────── */
const COPY = {
  en: {
    navLabels: ["INSERT COIN", "THE BOSS", "POWER-UPS", "THE FIGHT", "VICTORY"],
    s1: {
      kicker: "1 PLAYER   \u00a9 1986 REFACTOR CORP",
      title: ["DEFEATING", "TECH DEBT"],
      tagline: "A BOSS FIGHT IN 5 STAGES",
      press: "PRESS START",
      credit: "INSERT COIN \u2014 0 CREDITS",
    },
    s2: {
      label: "!! BOSS APPROACHING !!",
      name: "THE MONOLITH",
      sub: "LEGACY SYSTEM v0.9",
      hp: "HP",
      stats: [
        ["AGE", "8 YEARS"],
        ["SIZE", "12,480 LOC"],
        ["THREAT", "\u2605\u2605\u2605\u2605\u2605"],
      ],
      captions: [
        "The legacy system blocks every release.",
        "Full health. It won't fall in one hit.",
      ],
    },
    s3: {
      label: "LOADOUT",
      slots: [
        ["UNIT TESTS", "safety net"],
        ["REFACTOR", "cut complexity"],
        ["CI PIPELINE", "auto-guard"],
        ["MONITORING", "see failures"],
        ["FEATURE FLAG", "safe rollout"],
        ["STRANGLER FIG", "replace slowly"],
      ],
      locked: "LOCKED",
      captions: [
        "Equip the essentials.",
        "Add automation and eyes.",
        "Loadout complete \u2014 ready to strike.",
      ],
    },
    s4: {
      label: "FIGHT !",
      hp: "BOSS HP",
      combo: "COMBO",
      feed: [
        ["UNIT TESTS", "-18"],
        ["REFACTOR", "-16"],
        ["CI PIPELINE", "-14"],
        ["MONITORING", "-14"],
      ],
      captions: [
        "Every test pins behavior. Hits land.",
        "Complexity drops. The boss stumbles.",
      ],
    },
    s5: {
      clear: "STAGE CLEAR",
      sub: "TECH DEBT DEFEATED",
      rows: [
        ["SCORE", "148,200"],
        ["TIME", "03:42"],
        ["MAX COMBO", "x24"],
        ["RATING", "S"],
      ],
      press: "PRESS START \u25b8 NEXT STAGE",
    },
  },
  zh: {
    navLabels: ["\u6295\u5e01", "\u767b\u573a", "\u9053\u5177", "\u6fc0\u6218", "\u901a\u5173"],
    s1: {
      kicker: "1P \u73a9\u5bb6   \u00a9 1986 \u91cd\u6784\u4f1a\u793e",
      title: ["\u6253\u8d25", "\u6280\u672f\u503a"],
      tagline: "\u4e94\u5173 BOSS \u6311\u6218",
      press: "\u6309 START \u5f00\u59cb",
      credit: "\u6295\u5e01 \u2014 0 \u5e01",
    },
    s2: {
      label: "!! BOSS \u903c\u8fd1 !!",
      name: "\u5de8\u77f3\u602a",
      sub: "\u9057\u7559\u7cfb\u7edf v0.9",
      hp: "\u8840\u91cf",
      stats: [
        ["\u5b58\u6d3b", "8 \u5e74"],
        ["\u4f53\u91cf", "12,480 \u884c"],
        ["\u5a01\u80c1", "\u2605\u2605\u2605\u2605\u2605"],
      ],
      captions: [
        "\u9057\u7559\u7cfb\u7edf\u5361\u4f4f\u4e86\u6bcf\u4e00\u6b21\u53d1\u5e03\u3002",
        "\u6ee1\u8840\u3002\u4e00\u51fb\u6253\u4e0d\u5012\u3002",
      ],
    },
    s3: {
      label: "\u88c5\u5907\u680f",
      slots: [
        ["\u5355\u5143\u6d4b\u8bd5", "\u5b89\u5168\u7f51"],
        ["\u91cd\u6784\u5229\u5203", "\u5256\u5f00\u590d\u6742"],
        ["CI \u6d41\u6c34\u7ebf", "\u81ea\u52a8\u9632\u5b88"],
        ["\u76d1\u63a7\u96f7\u8fbe", "\u770b\u89c1\u6545\u969c"],
        ["\u529f\u80fd\u5f00\u5173", "\u5b89\u5168\u4e0a\u7ebf"],
        ["\u7ede\u6740\u66ff\u6362", "\u9010\u6b65\u66ff\u4ee3"],
      ],
      locked: "\u672a\u89e3\u9501",
      captions: [
        "\u5148\u88c5\u4e0a\u57fa\u7840\u88c5\u5907\u3002",
        "\u52a0\u4e0a\u81ea\u52a8\u5316\u4e0e\u89c2\u6d4b\u3002",
        "\u88c5\u5907\u5c31\u7eea \u2014 \u53ef\u4ee5\u5f00\u6253\u3002",
      ],
    },
    s4: {
      label: "\u5f00\u6253\uff01",
      hp: "BOSS \u8840\u91cf",
      combo: "\u8fde\u51fb",
      feed: [
        ["\u5355\u5143\u6d4b\u8bd5", "-18"],
        ["\u91cd\u6784\u5229\u5203", "-16"],
        ["CI \u6d41\u6c34\u7ebf", "-14"],
        ["\u76d1\u63a7\u96f7\u8fbe", "-14"],
      ],
      captions: [
        "\u6bcf\u4e2a\u6d4b\u8bd5\u9501\u4f4f\u884c\u4e3a\u3002\u547d\u4e2d\u3002",
        "\u590d\u6742\u5ea6\u9aa4\u964d\u3002BOSS \u8e09\u8dc4\u3002",
      ],
    },
    s5: {
      clear: "\u901a \u5173",
      sub: "\u6280\u672f\u503a\u5df2\u6253\u8d25",
      rows: [
        ["\u5f97\u5206", "148,200"],
        ["\u7528\u65f6", "03:42"],
        ["\u6700\u9ad8\u8fde\u51fb", "x24"],
        ["\u8bc4\u7ea7", "S"],
      ],
      press: "\u6309 START \u25b8 \u4e0b\u4e00\u5173",
    },
  },
};
type Copy = typeof COPY.en;

const TRANSITIONS: SceneTransitionMap = {
  "1->2": "glitch",
  "2->3": "hard-cut",
  "3->4": "glitch",
  "4->5": "hard-cut",
};

/* ── shared bits ─────────────────────────────────────────────────── */
function SectionLabel({ text, color }: { text: string; color: string }): ReactNode {
  return (
    <span
      style={{
        fontFamily: LABEL,
        fontSize: "1.7cqh",
        letterSpacing: "0.35cqw",
        color,
        textShadow: `0 0 1.2cqw ${color}`,
      }}
    >
      {text}
    </span>
  );
}

function PixelBoss({ hurt }: { hurt?: boolean }): ReactNode {
  const eye = hurt ? RED : GREEN;
  return (
    <div
      style={{
        position: "relative",
        width: "18cqh",
        height: "18cqh",
        background: "#160a12",
        border: `0.6cqw solid ${RED}`,
        boxShadow: `0 0 3cqw ${RED}, inset 0 0 2cqw rgba(255,45,74,0.35)`,
      }}
    >
      <div style={{ position: "absolute", top: "4.2cqh", left: "3cqh", width: "3.4cqh", height: "3.4cqh", background: eye, boxShadow: `0 0 1.4cqw ${eye}` }} />
      <div style={{ position: "absolute", top: "4.2cqh", right: "3cqh", width: "3.4cqh", height: "3.4cqh", background: eye, boxShadow: `0 0 1.4cqw ${eye}` }} />
      <div style={{ position: "absolute", bottom: "3.4cqh", left: "3.6cqh", right: "3.6cqh", height: "2cqh", background: RED, clipPath: "polygon(0 0,12% 100%,25% 0,38% 100%,50% 0,62% 100%,75% 0,88% 100%,100% 0)" }} />
    </div>
  );
}

/* ── SCENE 1 — Insert Coin (1 beat, motion) ──────────────────────── */
function Scene1({ c }: { c: Copy }): ReactNode {
  const s = c.s1;
  return (
    <div style={sceneWrap("center")}>
      <div style={{ fontFamily: LABEL, fontSize: "1.5cqh", letterSpacing: "0.4cqw", color: CYAN, marginBottom: "3cqh" }}>{s.kicker}</div>
      <div className="bob" style={{ marginBottom: "3.4cqh" }}>
        <PixelBoss />
      </div>
      <h1 style={{ margin: 0, fontFamily: DISPLAY, fontSize: "6cqh", lineHeight: 1.32, letterSpacing: "0.25cqw", color: GREEN, textShadow: `0 0 2.4cqw rgba(61,255,115,0.7), 0.5cqw 0.5cqh ${RED}` }}>
        {s.title[0]}
        <br />
        <span style={{ color: YELLOW, textShadow: `0 0 2.4cqw rgba(255,226,61,0.7), 0.5cqw 0.5cqh ${RED}` }}>{s.title[1]}</span>
      </h1>
      <div style={{ fontFamily: BODY, fontSize: "3cqh", color: INK, opacity: 0.85, marginTop: "2.4cqh", letterSpacing: "0.15cqw" }}>{s.tagline}</div>
      <div className="blink" style={{ fontFamily: LABEL, fontSize: "2.4cqh", color: RED, marginTop: "4.2cqh", textShadow: `0 0 1.6cqw ${RED}` }}>{s.press}</div>
      <div style={{ fontFamily: BODY, fontSize: "2.4cqh", color: DIM, marginTop: "1.8cqh" }}>{s.credit}</div>
    </div>
  );
}

/* ── SCENE 2 — The Boss (2 beats, motion) ────────────────────────── */
function Scene2({ c, beat, isActive, reduced }: SceneInner): ReactNode {
  const s = c.s2;
  const { ref } = useFLIP<HTMLDivElement>({
    watch: [beat],
    disabled: reduced || !isActive,
    duration: 420,
    easing: "steps(6, end)",
    selector: '[data-beat-layout-item="true"]',
  });
  return (
    <div style={sceneWrap("center")}>
      <div style={{ marginBottom: "2.6cqh" }} className={beat < 1 ? "blink" : undefined}>
        <SectionLabel text={s.label} color={RED} />
      </div>
      <div
        ref={ref}
        data-beat-layout-container="true"
        data-beat-layout-mode="motion"
        style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2.8cqh", width: "78cqw" }}
      >
        <div data-beat-layout-item="true" style={{ display: "flex", alignItems: "center", gap: "3.2cqw" }}>
          <div className="bob">
            <PixelBoss />
          </div>
          <div style={{ textAlign: "left" }}>
            <div style={{ fontFamily: DISPLAY, fontSize: "3.6cqh", color: RED, textShadow: `0 0 2cqw ${RED}` }}>{s.name}</div>
            <div style={{ fontFamily: BODY, fontSize: "2.6cqh", color: DIM, marginTop: "1cqh" }}>{s.sub}</div>
          </div>
        </div>
        <div data-beat-layout-item="true" style={{ width: "72cqw" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontFamily: LABEL, fontSize: "1.7cqh", color: GREEN, marginBottom: "1cqh" }}>
            <span>{s.hp}</span>
            <span>100%</span>
          </div>
          <div style={{ height: "3.4cqh", background: "#0a1a10", border: `0.3cqw solid ${GREEN}`, padding: "0.4cqh" }}>
            <div className="meter" style={{ width: "100%", height: "100%", background: GREEN, boxShadow: `0 0 2cqw ${GREEN}` }} />
          </div>
        </div>
        {beat >= 1 && (
          <div data-beat-layout-item="true" className="tick" style={{ display: "flex", gap: "2cqw" }}>
            {s.stats.map(([k, v]) => (
              <div key={k} style={statChip()}>
                <div style={{ fontFamily: LABEL, fontSize: "1.4cqh", color: CYAN }}>{k}</div>
                <div style={{ fontFamily: DISPLAY, fontSize: "1.9cqh", color: INK, marginTop: "0.8cqh" }}>{v}</div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Caption text={s.captions[Math.min(beat, s.captions.length - 1)]} />
    </div>
  );
}

/* ── SCENE 3 — Power-ups (3 beats, reserved) ─────────────────────── */
function Scene3({ c, beat }: SceneInner): ReactNode {
  const s = c.s3;
  const unlocked = beat <= 0 ? 2 : beat === 1 ? 4 : 6;
  return (
    <div style={sceneWrap("center")}>
      <div style={{ marginBottom: "3cqh" }}>
        <SectionLabel text={s.label} color={YELLOW} />
      </div>
      <div
        data-beat-layout-container="true"
        data-beat-layout-mode="reserved"
        style={{ display: "grid", gridTemplateColumns: "repeat(3, 24cqw)", gridAutoRows: "20cqh", gap: "2.4cqw" }}
      >
        {s.slots.map((slot, i) => {
          const on = i < unlocked;
          return (
            <div
              key={slot[0]}
              data-beat-layout-item="true"
              className={on ? "pop" : undefined}
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                gap: "1.4cqh",
                background: on ? PANEL : "#080b14",
                border: `0.35cqw solid ${on ? GREEN : DIM}`,
                boxShadow: on ? `0 0 2.2cqw rgba(61,255,115,0.45), inset 0 0 1.4cqw rgba(61,255,115,0.12)` : "none",
                opacity: on ? 1 : 0.4,
                filter: on ? "none" : "grayscale(1)",
                transition: "opacity 0.3s steps(3,end), border-color 0.3s steps(3,end)",
              }}
            >
              <div style={{ width: "5cqh", height: "5cqh", background: on ? GREEN : DIM, boxShadow: on ? `0 0 1.6cqw ${GREEN}` : "none", clipPath: "polygon(50% 0,100% 38%,82% 100%,18% 100%,0 38%)" }} />
              <div style={{ fontFamily: LABEL, fontSize: "1.9cqh", color: on ? INK : DIM, textAlign: "center" }}>{slot[0]}</div>
              <div style={{ fontFamily: BODY, fontSize: "2.2cqh", color: on ? YELLOW : DIM }}>{on ? slot[1] : s.locked}</div>
            </div>
          );
        })}
      </div>
      <Caption text={s.captions[Math.min(beat, s.captions.length - 1)]} />
    </div>
  );
}

/* ── SCENE 4 — The Fight (2 beats, motion) ───────────────────────── */
function Scene4({ c, beat, isActive, reduced }: SceneInner): ReactNode {
  const s = c.s4;
  const hp = beat <= 0 ? 62 : 8;
  const combo = beat <= 0 ? 2 : 4;
  const rows = beat <= 0 ? 2 : 4;
  const { ref } = useFLIP<HTMLDivElement>({
    watch: [beat],
    disabled: reduced || !isActive,
    duration: 380,
    easing: "steps(5, end)",
    selector: '[data-beat-layout-item="true"]',
  });
  return (
    <div style={sceneWrap("center")}>
      <div className={reduced ? undefined : "flash"} key={`fl-${beat}`} style={{ marginBottom: "2.4cqh" }}>
        <SectionLabel text={s.label} color={RED} />
      </div>
      <div
        ref={ref}
        data-beat-layout-container="true"
        data-beat-layout-mode="motion"
        style={{ display: "flex", flexDirection: "column", alignItems: "stretch", gap: "2.2cqh", width: "72cqw" }}
      >
        <div data-beat-layout-item="true">
          <div style={{ display: "flex", justifyContent: "space-between", fontFamily: LABEL, fontSize: "1.7cqh", color: hp < 25 ? RED : GREEN, marginBottom: "1cqh" }}>
            <span>{s.hp}</span>
            <span>{hp}%</span>
          </div>
          <div style={{ height: "3.6cqh", background: "#1a0a0f", border: `0.3cqw solid ${hp < 25 ? RED : GREEN}`, padding: "0.4cqh" }}>
            <div className="meter" style={{ width: `${hp}%`, height: "100%", background: hp < 25 ? RED : GREEN, boxShadow: `0 0 2cqw ${hp < 25 ? RED : GREEN}` }} />
          </div>
        </div>
        {s.feed.slice(0, rows).map((row, i) => (
          <div
            key={row[0]}
            data-beat-layout-item="true"
            className="tick"
            style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 1.6cqw", height: "5.4cqh", background: PANEL, borderLeft: `0.6cqw solid ${CYAN}` }}
          >
            <span style={{ fontFamily: BODY, fontSize: "3cqh", color: INK }}>{`> ${row[0]}`}</span>
            <span style={{ fontFamily: DISPLAY, fontSize: "2.2cqh", color: YELLOW, textShadow: `0 0 1.4cqw ${YELLOW}` }}>{row[1]}{i === 0 ? " HP" : ""}</span>
          </div>
        ))}
        <div data-beat-layout-item="true" style={{ display: "flex", justifyContent: "flex-end", alignItems: "baseline", gap: "1.4cqw" }}>
          <span style={{ fontFamily: LABEL, fontSize: "1.7cqh", color: CYAN }}>{s.combo}</span>
          <span className="pop" key={`c-${combo}`} style={{ fontFamily: DISPLAY, fontSize: "3.4cqh", color: CYAN, textShadow: `0 0 2cqw ${CYAN}` }}>{`x${combo}`}</span>
        </div>
      </div>
      <Caption text={s.captions[Math.min(beat, s.captions.length - 1)]} />
    </div>
  );
}

/* ── SCENE 5 — Victory (1 beat, motion) ──────────────────────────── */
function Scene5({ c }: { c: Copy }): ReactNode {
  const s = c.s5;
  return (
    <div style={sceneWrap("center")}>
      <div className="flash" style={{ marginBottom: "1.6cqh" }}>
        <h1 style={{ margin: 0, fontFamily: DISPLAY, fontSize: "7cqh", letterSpacing: "0.4cqw", color: YELLOW, textShadow: `0 0 3cqw rgba(255,226,61,0.8), 0.6cqw 0.6cqh ${RED}` }}>{s.clear}</h1>
      </div>
      <div style={{ fontFamily: LABEL, fontSize: "2.2cqh", color: GREEN, letterSpacing: "0.3cqw", marginBottom: "4cqh", textShadow: `0 0 1.6cqw ${GREEN}` }}>{s.sub}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: "1.6cqh", width: "48cqw" }}>
        {s.rows.map((row, i) => (
          <div key={row[0]} className="tick" style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", borderBottom: `0.2cqw dashed ${DIM}`, paddingBottom: "1cqh", animationDelay: `${i * 0.08}s` }}>
            <span style={{ fontFamily: LABEL, fontSize: "1.8cqh", color: CYAN }}>{row[0]}</span>
            <span style={{ fontFamily: DISPLAY, fontSize: "3cqh", color: row[0] === "RATING" || row[0] === "\u8bc4\u7ea7" ? YELLOW : INK }}>{row[1]}</span>
          </div>
        ))}
      </div>
      <div className="blink" style={{ fontFamily: LABEL, fontSize: "2.2cqh", color: RED, marginTop: "4cqh", textShadow: `0 0 1.6cqw ${RED}` }}>{s.press}</div>
    </div>
  );
}

/* ── shared style helpers + small components ─────────────────────── */
function sceneWrap(justify: "center"): CSSProperties {
  return {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: justify,
    padding: "6cqh 7cqw",
    boxSizing: "border-box",
    textAlign: "center",
  };
}
function statChip(): CSSProperties {
  return {
    minWidth: "16cqw",
    padding: "1.4cqh 1.6cqw",
    background: PANEL,
    border: `0.25cqw solid ${DIM}`,
  };
}
function Caption({ text }: { text: string }): ReactNode {
  return (
    <div style={{ fontFamily: BODY, fontSize: "3cqh", color: INK, opacity: 0.82, marginTop: "3.6cqh", maxWidth: "76cqw", letterSpacing: "0.1cqw" }}>
      {text}
    </div>
  );
}

/* ── STAGE nav HUD (bottom) ──────────────────────────────────────── */
function StageNav({
  scene,
  labels,
  onNavigate,
}: {
  scene: number;
  labels: string[];
  onNavigate?: (scene: number, beat: number) => void;
}): ReactNode {
  return (
    <div
      {...curatedNavigationAttributes("arcade-boss-fight", "defeating-tech-debt")}
      style={{
        display: "flex",
        gap: "0.8cqw",
        height: "9cqh",
        padding: "0 3cqw 1.6cqh",
        boxSizing: "border-box",
        alignItems: "stretch",
      }}
    >
      {labels.map((label, i) => {
        const stage = i + 1;
        const on = stage === scene;
        const done = stage < scene;
        return (
          <button
            key={label}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onNavigate?.(stage, 0);
            }}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: "0.4cqh",
              cursor: "pointer",
              background: on ? "rgba(61,255,115,0.14)" : "rgba(14,21,38,0.7)",
              border: `0.25cqw solid ${on ? GREEN : done ? CYAN : DIM}`,
              boxShadow: on ? `0 0 2cqw rgba(61,255,115,0.55)` : "none",
              color: on ? GREEN : done ? CYAN : DIM,
              textShadow: on ? `0 0 1.2cqw ${GREEN}` : "none",
            }}
          >
            <span style={{ fontFamily: DISPLAY, fontSize: "1.2cqh", letterSpacing: "0.15cqw" }}>{`STAGE ${stage}`}</span>
            <span style={{ fontFamily: LABEL, fontSize: "1.4cqh", color: on ? INK : "inherit" }}>{label}</span>
          </button>
        );
      })}
    </div>
  );
}

/* ── main component ──────────────────────────────────────────────── */
interface SceneInner {
  c: Copy;
  beat: number;
  isActive: boolean;
  reduced: boolean;
}

function DefeatingTechDebtV3({
  scene,
  beat,
  language,
  isThumbnail,
  reducedMotion,
  onNavigate,
}: BespokeStyleProps): ReactNode {
  const reduced = reducedMotion || isThumbnail;
  const c = COPY[language];

  return (
    <div className={`${styles.root}${reduced ? ` ${styles.reduce}` : ""}`} style={{ background: BG }}>
      <div style={{ flex: 1, minHeight: 0, position: "relative" }}>
        <SpatialSceneTrack
          scene={scene}
          beat={beat}
          transitionKind="glitch"
          transitionMap={TRANSITIONS}
          reducedMotion={reduced}
          beatLayoutModes={{ 2: "motion", 3: "reserved", 4: "motion" }}
          renderScene={(sceneId, sceneBeat, isActive) => {
            if (sceneId === 1) return <Scene1 c={c} />;
            if (sceneId === 2) return <Scene2 c={c} beat={sceneBeat} isActive={isActive} reduced={reduced} />;
            if (sceneId === 3) return <Scene3 c={c} beat={sceneBeat} isActive={isActive} reduced={reduced} />;
            if (sceneId === 4) return <Scene4 c={c} beat={sceneBeat} isActive={isActive} reduced={reduced} />;
            return <Scene5 c={c} />;
          }}
        />
      </div>
      {!isThumbnail && <StageNav scene={scene} labels={c.navLabels} onNavigate={onNavigate} />}
    </div>
  );
}

/* ── metadata ────────────────────────────────────────────────────── */
export function getMetadata(lang: "en" | "zh"): StyleMetadata {
  const c = COPY[lang];
  const name = lang === "en" ? "Arcade Boss Fight" : "\u8857\u673a Boss \u6218";
  const theme = lang === "en" ? "Defeating Tech Debt" : "\u6253\u8d25\u6280\u672f\u503a";
  const densityLabel = lang === "en" ? "Playful" : "\u8f7b\u5feb";
  const scenes = [
    {
      id: 1,
      title: c.navLabels[0],
      beats: [{ id: 0, action: c.s1.press, title: c.s1.title.join(" "), body: c.s1.tagline }],
    },
    {
      id: 2,
      title: c.navLabels[1],
      beats: [
        { id: 0, action: c.s2.label, title: c.s2.name, body: c.s2.captions[0] },
        { id: 1, action: c.s2.hp, title: `${c.s2.name} 100%`, body: c.s2.captions[1] },
      ],
    },
    {
      id: 3,
      title: c.navLabels[2],
      beats: [
        { id: 0, action: c.s3.label, title: c.s3.slots[0][0], body: c.s3.captions[0] },
        { id: 1, action: c.s3.label, title: c.s3.slots[2][0], body: c.s3.captions[1] },
        { id: 2, action: c.s3.label, title: c.s3.slots[4][0], body: c.s3.captions[2] },
      ],
    },
    {
      id: 4,
      title: c.navLabels[3],
      beats: [
        { id: 0, action: c.s4.label, title: `${c.s4.hp} 62%`, body: c.s4.captions[0] },
        { id: 1, action: c.s4.label, title: `${c.s4.hp} 8%`, body: c.s4.captions[1] },
      ],
    },
    {
      id: 5,
      title: c.navLabels[4],
      beats: [{ id: 0, action: c.s5.clear, title: c.s5.sub, body: c.s5.rows.map((r) => `${r[0]} ${r[1]}`).join("  \u00b7  ") }],
    },
  ];
  return {
    id: "arcade-boss-fight",
    band: "contemporary-digital",
    name,
    theme,
    densityLabel,
    heroScene: 2,
    colors: { bg: BG, ink: INK, panel: PANEL },
    typography: { header: "Press Start 2P", body: "VT323" },
    tags: [
      "playful",
      "nostalgic",
      "energetic",
      "8-bit",
      "arcade",
      "pixel",
      "dark",
      "neon",
      "high-energy",
      "stepped-motion",
      "game-hud",
      "boss-fight",
      "contemporary-digital",
    ],
    fonts: [
      "Press Start 2P:wght@400",
      "Silkscreen:wght@400;700",
      "VT323:wght@400",
      "cjk:Noto Sans SC:wght@400;700;900",
    ],
    scenes,
  };
}

export default DefeatingTechDebtV3;

export const DefeatingTechDebtTopic = defineStyleTopic({
  id: "defeating-tech-debt",
  topic: { en: "Defeating Tech Debt", zh: "\u6253\u8d25\u6280\u672f\u503a" },
  model: "GPT 5.6 Sol",
  component: DefeatingTechDebtV3,
  getMetadata,
});

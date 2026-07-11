import type { BespokeStyleProps, StyleMetadata } from "../types";
import { defineStyleTopic } from "./topic";
import { curatedNavigationAttributes } from "./curated-topic-contract";
import SpatialSceneTrack from "./SpatialSceneTrack";
import type { SceneTransitionMap } from "./SpatialSceneTrack";
import { useFLIP } from "../hooks/useFLIP";
import styles from "./read-before-merge.module.css";

/* ── Palette (paper · ink · one high-voltage acidic accent) ────────────── */
const PAPER = "#F1E8D6"; // warm off-white paper ground — never white, never dark
const INK = "#141210"; // near-black, does the structural border work
const PANEL = "#FCF7EA"; // slightly lifted paper for elevated cards
const ACCENT = "#C6F82A"; // acidic high-voltage lime — one region per slide

/* ── Bilingual content (plain object — no `as const`) ──────────────────── */
type Lang = "en" | "zh";

interface RuleTile {
  no: string;
  text: string;
}
interface WarnTile {
  text: string;
  sev: string;
}
interface ConsequencePanel {
  title: string;
  rows: string[];
}
interface MetaBeat {
  action: string;
  title: string;
  body: string;
}
interface MetaScene {
  title: string;
  beats: MetaBeat[];
}
interface Content {
  notice: { pill: string; kicker: string; title: string; body: string };
  rules: { tag: string; lead: string; accent: string; tiles: RuleTile[] };
  warnings: { tag: string; heading: string; tiles: WarnTile[] };
  consequences: { tag: string; heading: string; panels: ConsequencePanel[] };
  ack: { tag: string; heading: string; body: string; stamp: string };
  meta: { theme: string; densityLabel: string; tags: string[]; scenes: MetaScene[] };
}

const DATA: Record<Lang, Content> = {
  en: {
    notice: {
      pill: "MANDATORY · PRE-MERGE BULLETIN",
      kicker: "NOTICE 001",
      title: "READ THIS BEFORE YOU MERGE",
      body: "This branch touches shared infrastructure. Ship it wrong and everyone downstream pays. Read every rule on this board first.",
    },
    rules: {
      tag: "SECTION A",
      lead: "THE",
      accent: "RULES",
      tiles: [
        { no: "01", text: "Rebase — never a merge commit" },
        { no: "02", text: "Green CI or it does not land" },
        { no: "03", text: "One human reviewer, minimum" },
        { no: "04", text: "No force-push to main. Ever." },
      ],
    },
    warnings: {
      tag: "SECTION B",
      heading: "THIS DIFF IS LOUD",
      tiles: [
        { text: "Schema migration included", sev: "CRITICAL" },
        { text: "Public API signature changed", sev: "HIGH" },
        { text: "Lockfile regenerated", sev: "WATCH" },
      ],
    },
    consequences: {
      tag: "SECTION C",
      heading: "WHAT BREAKS",
      panels: [
        {
          title: "IF YOU SKIP THE STEPS",
          rows: ["Prod deploy blocks", "Rollback turns ugly", "Oncall gets paged at 3am"],
        },
        {
          title: "WHAT ACTUALLY BREAKS",
          rows: ["Downstream builds go red", "Cache invalidation storm", "Data write path stalls"],
        },
      ],
    },
    ack: {
      tag: "SIGN-OFF",
      heading: "ACKNOWLEDGED",
      body: "Check every box. Sign your name. Then — and only then — hit merge.",
      stamp: "READ",
    },
    meta: {
      theme: "Read This Before You Merge",
      densityLabel: "Dense · Bulletin",
      tags: ["Blunt", "Bulletin", "Dense", "Paper · Ink · Accent", "Snappy", "Uppercase"],
      scenes: [
        {
          title: "The Notice",
          beats: [
            {
              action: "Post the notice",
              title: "The Notice",
              body: "A bordered headline is nailed to the wall with a hard offset shadow.",
            },
          ],
        },
        {
          title: "The Rules",
          beats: [
            {
              action: "Snap in rules one and two",
              title: "Rules 01–02",
              body: "The first two bordered tiles snap into their fixed slots.",
            },
            {
              action: "Reveal the remaining rules",
              title: "Rules 03–04",
              body: "The last two tiles light up in their reserved slots.",
            },
          ],
        },
        {
          title: "The Warnings",
          beats: [
            {
              action: "Flag the critical risk",
              title: "Critical",
              body: "A severity pill marks the schema migration as critical.",
            },
            {
              action: "Flag the high risk",
              title: "High",
              body: "A second pill flags the changed public API.",
            },
            {
              action: "Flag the last risk",
              title: "Watch",
              body: "The regenerated lockfile gets a watch pill.",
            },
          ],
        },
        {
          title: "The Consequences",
          beats: [
            {
              action: "Show the first fallout",
              title: "Fallout 1",
              body: "The top row of each consequence panel is revealed.",
            },
            {
              action: "Show the second fallout",
              title: "Fallout 2",
              body: "The middle row of each panel lights up.",
            },
            {
              action: "Show the final fallout",
              title: "Fallout 3",
              body: "The last row of each dense panel appears.",
            },
          ],
        },
        {
          title: "Acknowledged",
          beats: [
            {
              action: "Present the sign-off",
              title: "Sign-off",
              body: "The acknowledgement lines sit centered on the board.",
            },
            {
              action: "Stamp it read",
              title: "Stamped",
              body: "A READ stamp pops in and reflows the lines with FLIP.",
            },
          ],
        },
      ],
    },
  },
  zh: {
    notice: {
      pill: "强制 · 合并前公告",
      kicker: "公告 001",
      title: "合并前必读",
      body: "此分支改动共享基础设施。一旦合错，下游全体买单。请先读完这块板上的每一条。",
    },
    rules: {
      tag: "章节 A",
      lead: "本板",
      accent: "规则",
      tiles: [
        { no: "01", text: "只用变基，绝不合并提交" },
        { no: "02", text: "CI 全绿才能落地" },
        { no: "03", text: "至少一名人工评审" },
        { no: "04", text: "永远禁止强推主干" },
      ],
    },
    warnings: {
      tag: "章节 B",
      heading: "这份改动很吵",
      tiles: [
        { text: "包含库表迁移", sev: "严重" },
        { text: "公共 API 签名已变", sev: "高危" },
        { text: "锁文件被重新生成", sev: "留意" },
      ],
    },
    consequences: {
      tag: "章节 C",
      heading: "会坏什么",
      panels: [
        {
          title: "若跳过步骤",
          rows: ["生产部署被阻断", "回滚变得棘手", "凌晨三点被电话叫醒"],
        },
        {
          title: "到底会坏什么",
          rows: ["下游构建全部变红", "缓存雪崩式失效", "数据写入路径卡死"],
        },
      ],
    },
    ack: {
      tag: "签字确认",
      heading: "已确认",
      body: "勾选每一项，签上你的名字。然后——也只有到那时——再点合并。",
      stamp: "已读",
    },
    meta: {
      theme: "合并前必读",
      densityLabel: "高密度 · 公告",
      tags: ["直白", "公告", "高密度", "纸张 · 墨黑 · 高压", "利落", "全大写"],
      scenes: [
        {
          title: "公告",
          beats: [
            { action: "张贴公告", title: "公告", body: "带硬阴影的描边标题被钉在墙上。" },
          ],
        },
        {
          title: "规则",
          beats: [
            { action: "弹入第一、二条", title: "规则 01–02", body: "前两块描边卡片弹入固定卡位。" },
            { action: "揭示其余规则", title: "规则 03–04", body: "后两块卡片在预留卡位中点亮。" },
          ],
        },
        {
          title: "警告",
          beats: [
            { action: "标记严重风险", title: "严重", body: "严重级标签把库表迁移标为最高风险。" },
            { action: "标记高危风险", title: "高危", body: "第二枚标签标出已变更的公共 API。" },
            { action: "标记最后风险", title: "留意", body: "重新生成的锁文件获得留意标签。" },
          ],
        },
        {
          title: "后果",
          beats: [
            { action: "显示第一项后果", title: "后果 1", body: "两块后果面板的首行被揭示。" },
            { action: "显示第二项后果", title: "后果 2", body: "每块面板的中间一行点亮。" },
            { action: "显示最后后果", title: "后果 3", body: "两块密集面板的末行出现。" },
          ],
        },
        {
          title: "已确认",
          beats: [
            { action: "呈现签字项", title: "签字", body: "确认文案居中排布在板上。" },
            { action: "盖上已读章", title: "盖章", body: "一枚已读印章弹入，并用 FLIP 重排文案。" },
          ],
        },
      ],
    },
  },
};

/* ── Scene props ───────────────────────────────────────────────────────── */
interface SceneProps {
  lang: Lang;
  beat: number;
  motionOff: boolean;
  isActive: boolean;
}

const cardVars = {
  "--paper": PAPER,
  "--ink": INK,
  "--panel": PANEL,
  "--accent": ACCENT,
} as React.CSSProperties;

/* ── Scene 1 · The notice ─────────────────────────────────────────────── */
function SceneNotice({ lang, motionOff, isActive }: SceneProps) {
  const d = DATA[lang].notice;
  const play = isActive && !motionOff;
  return (
    <div className={styles.scene}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: "3.2cqh" }}>
        <div
          className={`${styles.card} ${play ? styles.animUp : ""}`}
          style={{ alignSelf: "flex-start", maxWidth: "84cqw", padding: "4.5cqh 4cqw 5cqh" }}
        >
          <span
            className={`${styles.pill} ${styles.pillAccent}`}
            style={{ padding: "0.9cqh 1.4cqw", fontSize: "1.6cqh", marginBottom: "2.6cqh" }}
          >
            {d.kicker}
          </span>
          <h1 className={styles.display} style={{ fontSize: "12.5cqh" }}>
            {d.title}
          </h1>
        </div>
        <div style={{ display: "flex", alignItems: "flex-start", gap: "2cqw" }}>
          <span
            className={styles.pill}
            style={{ padding: "0.8cqh 1.2cqw", fontSize: "1.4cqh", flexShrink: 0 }}
          >
            {d.pill}
          </span>
          <p className={styles.body} style={{ fontSize: "2.5cqh", lineHeight: 1.45, maxWidth: "58cqw" }}>
            {d.body}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ── Scene 2 · The rules (reserved) ───────────────────────────────────── */
function SceneRules({ lang, beat, motionOff, isActive }: SceneProps) {
  const d = DATA[lang].rules;
  const play = isActive && !motionOff;
  const litCount = (beat + 1) * 2; // beat 0 → 2 tiles, beat 1 → 4 tiles
  return (
    <div className={styles.scene}>
      <span
        className={styles.pill}
        style={{ padding: "0.8cqh 1.2cqw", fontSize: "1.4cqh", marginBottom: "2.4cqh" }}
      >
        {d.tag}
      </span>
      <h2 className={styles.display} style={{ fontSize: "8.5cqh", marginBottom: "3.6cqh" }}>
        {d.lead} <span className={styles.accent}>{d.accent}</span>
      </h2>
      <div
        data-beat-layout-container="true"
        data-beat-layout-mode="reserved"
        style={{
          flex: 1,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gridTemplateRows: "1fr 1fr",
          gap: "3cqw",
        }}
      >
        {d.tiles.map((tile, i) => {
          const lit = i < litCount;
          return (
            <div
              key={tile.no}
              data-beat-layout-item="true"
              className={`${styles.card} ${play && lit ? styles.animUp : ""}`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "2cqw",
                padding: "0 3cqw",
                opacity: lit ? 1 : 0.26,
              }}
            >
              <span className={styles.display} style={{ fontSize: "6.5cqh", color: INK }}>
                {tile.no}
              </span>
              <span className={styles.body} style={{ fontSize: "3cqh", fontWeight: 500, lineHeight: 1.2 }}>
                {tile.text}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Scene 3 · The warnings (reserved) ────────────────────────────────── */
function SceneWarnings({ lang, beat, motionOff, isActive }: SceneProps) {
  const d = DATA[lang].warnings;
  const play = isActive && !motionOff;
  return (
    <div className={styles.scene}>
      <span
        className={styles.pill}
        style={{ padding: "0.8cqh 1.2cqw", fontSize: "1.4cqh", marginBottom: "2.4cqh" }}
      >
        {d.tag}
      </span>
      <h2 className={styles.display} style={{ fontSize: "8.5cqh", marginBottom: "3.6cqh" }}>
        {d.heading}
      </h2>
      <div
        data-beat-layout-container="true"
        data-beat-layout-mode="reserved"
        style={{ flex: 1, display: "flex", flexDirection: "column", gap: "2.4cqh" }}
      >
        {d.tiles.map((tile, i) => {
          const flagged = i <= beat;
          const critical = i === 0;
          const pillStyle: React.CSSProperties = critical
            ? { background: ACCENT, color: INK }
            : i === 1
            ? { background: INK, color: PAPER }
            : { background: PANEL, color: INK };
          return (
            <div
              key={tile.text}
              data-beat-layout-item="true"
              className={`${styles.card} ${play && flagged ? styles.animLeft : ""}`}
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0 3.4cqw",
                opacity: flagged ? 1 : 0.24,
              }}
            >
              <span className={styles.body} style={{ fontSize: "3.4cqh", fontWeight: 700 }}>
                {tile.text}
              </span>
              <span
                className={styles.pill}
                style={{
                  padding: "1cqh 1.8cqw",
                  fontSize: "1.9cqh",
                  visibility: flagged ? "visible" : "hidden",
                  ...pillStyle,
                }}
              >
                {tile.sev}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Scene 4 · The consequences (reserved) ────────────────────────────── */
function SceneConsequences({ lang, beat, motionOff, isActive }: SceneProps) {
  const d = DATA[lang].consequences;
  const play = isActive && !motionOff;
  return (
    <div className={styles.scene}>
      <div style={{ display: "flex", alignItems: "center", gap: "2cqw", marginBottom: "3cqh" }}>
        <span className={`${styles.pill} ${styles.pillAccent}`} style={{ padding: "0.8cqh 1.2cqw", fontSize: "1.4cqh" }}>
          {d.tag}
        </span>
        <h2 className={styles.display} style={{ fontSize: "7cqh" }}>
          {d.heading}
        </h2>
      </div>
      <div
        data-beat-layout-container="true"
        data-beat-layout-mode="reserved"
        style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3cqw" }}
      >
        {d.panels.map((panel) => (
          <div
            key={panel.title}
            data-beat-layout-item="true"
            className={styles.card}
            style={{ display: "flex", flexDirection: "column", padding: "0" }}
          >
            <div
              style={{
                background: INK,
                color: PAPER,
                padding: "1.6cqh 2.2cqw",
                borderBottom: `0.3cqw solid ${INK}`,
              }}
            >
              <span className={styles.display} style={{ fontSize: "2.9cqh", letterSpacing: "-0.01em" }}>
                {panel.title}
              </span>
            </div>
            <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
              {panel.rows.map((row, ri) => {
                const shown = ri <= beat;
                return (
                  <div
                    key={row}
                    className={play && shown ? styles.animLeft : ""}
                    style={{
                      flex: 1,
                      display: "flex",
                      alignItems: "center",
                      gap: "1.6cqw",
                      padding: "0 2.4cqw",
                      borderBottom: ri < panel.rows.length - 1 ? `0.18cqw solid ${INK}` : "none",
                      opacity: shown ? 1 : 0.2,
                    }}
                  >
                    <span
                      style={{
                        width: "1.4cqw",
                        height: "1.4cqw",
                        background: ri === 0 ? ACCENT : INK,
                        border: `0.18cqw solid ${INK}`,
                        flexShrink: 0,
                      }}
                    />
                    <span className={styles.body} style={{ fontSize: "2.7cqh", fontWeight: 500 }}>
                      {row}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Scene 5 · Acknowledged (motion / FLIP) ───────────────────────────── */
function SceneAck({ lang, beat, motionOff, isActive }: SceneProps) {
  const d = DATA[lang].ack;
  const play = isActive && !motionOff;
  const { ref } = useFLIP<HTMLDivElement>({
    watch: [beat],
    disabled: motionOff || !isActive,
    duration: 420,
    easing: "cubic-bezier(0.34, 1.56, 0.64, 1)",
    selector: '[data-beat-layout-item="true"]',
  });
  return (
    <div className={styles.scene}>
      <div
        ref={ref}
        data-beat-layout-container="true"
        data-beat-layout-mode="motion"
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "3.4cqh",
        }}
      >
        <span
          data-beat-layout-item="true"
          className={styles.pill}
          style={{ padding: "0.9cqh 1.6cqw", fontSize: "1.6cqh" }}
        >
          {d.tag}
        </span>
        <h2
          data-beat-layout-item="true"
          className={styles.display}
          style={{ fontSize: "10cqh", textAlign: "center" }}
        >
          {d.heading}
        </h2>
        {beat >= 1 && (
          <div
            data-beat-layout-item="true"
            className={`${styles.card} ${play ? styles.animPop : ""}`}
            style={{
              transform: "rotate(-6deg)",
              background: ACCENT,
              padding: "1.6cqh 3.4cqw",
            }}
          >
            <span className={styles.display} style={{ fontSize: "7cqh", color: INK }}>
              {d.stamp}
            </span>
          </div>
        )}
        <p
          data-beat-layout-item="true"
          className={styles.body}
          style={{ fontSize: "2.7cqh", lineHeight: 1.45, maxWidth: "56cqw", textAlign: "center" }}
        >
          {d.body}
        </p>
      </div>
    </div>
  );
}

/* ── Bottom nav · thick-bordered square page chips (N2) ───────────────── */
interface NavProps {
  scene: number;
  isThumbnail: boolean;
  onNavigate?: (scene: number, beat: number) => void;
}
function BulletinNav({ scene, isThumbnail, onNavigate }: NavProps) {
  if (isThumbnail) return null;
  return (
    <div
      {...curatedNavigationAttributes("neo-brutalist-bulletin", "read-before-merge")}
      style={{
        position: "absolute",
        bottom: "3cqh",
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        gap: "1.6cqw",
        zIndex: 20,
      }}
    >
      {[1, 2, 3, 4, 5].map((n) => {
        const active = n === scene;
        return (
          <button
            key={n}
            type="button"
            aria-label={`Go to notice ${n}`}
            onClick={(e) => {
              e.stopPropagation();
              onNavigate?.(n, 0);
            }}
            style={{
              width: "3cqw",
              height: "3cqw",
              padding: 0,
              cursor: "pointer",
              background: active ? ACCENT : PANEL,
              border: `0.28cqw solid ${INK}`,
              boxShadow: `0.4cqw 0.4cqh 0 ${INK}`,
              fontFamily: '"Space Grotesk", "Noto Sans SC", sans-serif',
              fontWeight: 700,
              fontSize: "1.6cqh",
              color: INK,
              lineHeight: 1,
            }}
          >
            {n}
          </button>
        );
      })}
    </div>
  );
}

/* ── Root component ────────────────────────────────────────────────────── */
const TRANSITIONS: SceneTransitionMap = {
  "1->2": "hard-cut",
  "2->3": "slide-x",
  "3->4": "hard-cut",
  "4->5": "slide-x",
};

function ReadBeforeMergeV3({
  scene,
  beat,
  language,
  isThumbnail,
  reducedMotion,
  onNavigate,
}: BespokeStyleProps) {
  const motionOff = reducedMotion || isThumbnail;
  const lang: Lang = language === "zh" ? "zh" : "en";

  return (
    <div
      className={`${styles.root} ${motionOff ? styles.killMotion : ""}`}
      style={{ ...cardVars, background: PAPER }}
    >
      <SpatialSceneTrack
        scene={scene}
        beat={beat}
        transitionKind="hard-cut"
        transitionMap={TRANSITIONS}
        reducedMotion={motionOff}
        beatLayoutModes={{ 2: "reserved", 3: "reserved", 4: "reserved", 5: "motion" }}
        renderScene={(sceneId, sceneBeat, isActive) => {
          const props: SceneProps = { lang, beat: sceneBeat, motionOff, isActive };
          switch (sceneId) {
            case 1:
              return <SceneNotice {...props} />;
            case 2:
              return <SceneRules {...props} />;
            case 3:
              return <SceneWarnings {...props} />;
            case 4:
              return <SceneConsequences {...props} />;
            case 5:
              return <SceneAck {...props} />;
            default:
              return null;
          }
        }}
      />
      <BulletinNav scene={scene} isThumbnail={isThumbnail} onNavigate={onNavigate} />
    </div>
  );
}

export function getMetadata(language: Lang): StyleMetadata {
  const d = DATA[language];
  return {
    id: "neo-brutalist-bulletin",
    band: "craft-cultural",
    name: language === "zh" ? "新粗野公告" : "Neo-Brutalist Bulletin",
    theme: d.meta.theme,
    densityLabel: d.meta.densityLabel,
    heroScene: 1,
    colors: { bg: PAPER, ink: INK, panel: PANEL },
    typography: { header: "Archivo Black", body: "Space Grotesk" },
    tags: d.meta.tags,
    fonts: [
      "Archivo Black:wght@400",
      "Space Grotesk:wght@400;500;700",
      "cjk:Noto Sans SC:wght@400;700;900",
    ],
    scenes: d.meta.scenes.map((s, si) => ({
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

export const readBeforeMergeTopic = defineStyleTopic({
  id: "read-before-merge",
  topic: { en: "Read This Before You Merge", zh: "合并前必读" },
  model: "Claude Opus 4.8",
  component: ReadBeforeMergeV3,
  getMetadata,
});

export default ReadBeforeMergeV3;

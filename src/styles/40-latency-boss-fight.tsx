import { useEffect } from "react";
import type { CSSProperties } from "react";
import { useFLIP } from "../hooks/useFLIP";
import type { BespokeStyleProps, StyleMetadata } from "../types";
import SpatialSceneTrack from "./SpatialSceneTrack";
import type {
  BeatLayoutMode,
  SceneTransitionMap,
} from "./SpatialSceneTrack";
import { defineStyleTopic } from "./topic";
import styles from "./40-latency-boss-fight.module.css";

type Lang = "en" | "zh";

interface SceneCopy {
  kicker: string;
  title: string;
  subtitle: string;
  beats: Array<{
    action: string;
    title: string;
    body: string;
  }>;
}

interface PowerUp {
  key: string;
  icon: string;
  color: string;
  en: { name: string; text: string };
  zh: { name: string; text: string };
}

interface Attack {
  key: string;
  en: { title: string; text: string };
  zh: { title: string; text: string };
}

interface Combo {
  key: string;
  en: string;
  zh: string;
}

interface Result {
  key: string;
  en: { label: string; value: string };
  zh: { label: string; value: string };
}

const SCENE_IDS = [1, 2, 3, 4, 5];

const TRANSITION_MAP = {
  "1->2": "glitch",
  "2->3": "slide-x",
  "3->4": "scale-fade",
  "4->5": "hard-cut",
} satisfies SceneTransitionMap;

const BEAT_LAYOUT_MODES = {
  1: "motion",
  2: "motion",
  3: "motion",
  4: "motion",
  5: "motion",
} satisfies Partial<Record<number, BeatLayoutMode>>;

const BOSS_HP_BY_SCENE = [100, 82, 58, 22, 0];
const SCORE_BY_SCENE = [0, 1200, 3600, 7200, 9999];

const SCENES: Record<number, Record<Lang, SceneCopy>> = {
  1: {
    en: {
      kicker: "LEVEL 01 / BOSS INTRO",
      title: "Defeat the Latency Boss",
      subtitle:
        "The room sees the enemy: a slow path hiding behind a giant health bar.",
      beats: [
        {
          action: "Boot the arena",
          title: "Boss gate opens",
          body: "Latency enters as a visible opponent.",
        },
        {
          action: "Reveal boss health",
          title: "999 ms health bar",
          body: "The target becomes measurable.",
        },
        {
          action: "Lock the player objective",
          title: "P95 under 160 ms",
          body: "The win condition is clear.",
        },
      ],
    },
    zh: {
      kicker: "第一关 / Boss 登场",
      title: "击败延迟 Boss",
      subtitle: "把看不见的慢路径变成屏幕中央的敌人和血条。",
      beats: [
        {
          action: "启动战场",
          title: "Boss 门打开",
          body: "延迟以可见敌人的形式登场。",
        },
        {
          action: "显示血条",
          title: "999 ms 血量",
          body: "目标变得可以测量。",
        },
        {
          action: "锁定玩家目标",
          title: "P95 低于 160 ms",
          body: "胜利条件明确。",
        },
      ],
    },
  },
  2: {
    en: {
      kicker: "LEVEL 02 / ATTACK PATTERN",
      title: "Read the Spike Script",
      subtitle:
        "Every hit has a tell: jitter rain, queue slam, and timeout beam.",
      beats: [
        {
          action: "Trace the first wave",
          title: "Jitter rain",
          body: "Small spikes arrive in clusters.",
        },
        {
          action: "Reveal queue pressure",
          title: "Queue slam",
          body: "Backlog turns one miss into many.",
        },
        {
          action: "Reveal timeout path",
          title: "Timeout beam",
          body: "Long-tail requests drain the last life pip.",
        },
        {
          action: "Map the safe lane",
          title: "Dodge window",
          body: "The team knows where to move first.",
        },
      ],
    },
    zh: {
      kicker: "第二关 / 攻击模式",
      title: "读懂尖峰脚本",
      subtitle: "每次受击都有前摇：抖动雨、队列重击、超时光束。",
      beats: [
        {
          action: "追踪第一波",
          title: "抖动雨",
          body: "小尖峰成簇出现。",
        },
        {
          action: "暴露队列压力",
          title: "队列重击",
          body: "一次错过会放大成连锁堆积。",
        },
        {
          action: "暴露超时路径",
          title: "超时光束",
          body: "长尾请求消耗最后一格生命。",
        },
        {
          action: "标出安全路线",
          title: "闪避窗口",
          body: "团队知道先移动哪里。",
        },
      ],
    },
  },
  3: {
    en: {
      kicker: "LEVEL 03 / POWER-UPS",
      title: "Collect the Counters",
      subtitle:
        "The loadout changes the fight: cache, edge route, trace, and budget shield.",
      beats: [
        {
          action: "Open inventory",
          title: "Empty slots",
          body: "The player has room for tools.",
        },
        {
          action: "Collect cache",
          title: "Cache shard",
          body: "Hot reads stop crossing the arena.",
        },
        {
          action: "Collect edge route",
          title: "Edge boots",
          body: "Traffic moves closer to the player.",
        },
        {
          action: "Collect tracing",
          title: "Trace lens",
          body: "Hidden frames become targets.",
        },
        {
          action: "Collect latency budget",
          title: "Budget shield",
          body: "Each path gets a hard cap.",
        },
      ],
    },
    zh: {
      kicker: "第三关 / 道具补给",
      title: "收集反制道具",
      subtitle: "装备改变战斗：缓存、边缘路由、链路追踪、预算护盾。",
      beats: [
        {
          action: "打开背包",
          title: "空槽位",
          body: "玩家有位置装入工具。",
        },
        {
          action: "收集缓存",
          title: "缓存碎片",
          body: "热读不再穿过整个战场。",
        },
        {
          action: "收集边缘路由",
          title: "边缘靴",
          body: "流量移动到离玩家更近的位置。",
        },
        {
          action: "收集追踪",
          title: "追踪镜",
          body: "隐藏帧变成可攻击目标。",
        },
        {
          action: "收集延迟预算",
          title: "预算护盾",
          body: "每条路径都有硬上限。",
        },
      ],
    },
  },
  4: {
    en: {
      kicker: "LEVEL 04 / FINAL COMBO",
      title: "Chain the Winning Inputs",
      subtitle:
        "The team stops trading single hits and lands one timed sequence.",
      beats: [
        {
          action: "Start combo",
          title: "Ready stance",
          body: "The boss is vulnerable for one window.",
        },
        {
          action: "Route first hit",
          title: "Edge route",
          body: "Move the longest hop out of the path.",
        },
        {
          action: "Cache second hit",
          title: "Cache cancel",
          body: "Remove repeated work from the frame.",
        },
        {
          action: "Trace and budget finisher",
          title: "Trace break",
          body: "Cut the tail and lock the budget.",
        },
        {
          action: "Land final strike",
          title: "Combo clear",
          body: "The health bar drops to zero.",
        },
      ],
    },
    zh: {
      kicker: "第四关 / 终结连招",
      title: "串起胜利输入",
      subtitle: "团队不再零散攻击，而是在同一窗口打出完整序列。",
      beats: [
        {
          action: "启动连招",
          title: "准备姿态",
          body: "Boss 在一个窗口内露出破绽。",
        },
        {
          action: "先打路由",
          title: "边缘路由",
          body: "把最长一跳移出关键路径。",
        },
        {
          action: "再打缓存",
          title: "缓存取消",
          body: "移除帧内重复工作。",
        },
        {
          action: "追踪和预算收尾",
          title: "追踪破防",
          body: "切掉长尾并锁住预算。",
        },
        {
          action: "落下终击",
          title: "连招清场",
          body: "血条归零。",
        },
      ],
    },
  },
  5: {
    en: {
      kicker: "LEVEL 05 / SCORE",
      title: "Boss Clear",
      subtitle:
        "The scoreboard turns engineering work into a finish screen everyone can read.",
      beats: [
        {
          action: "Show final score",
          title: "Score 9999",
          body: "The run is complete.",
        },
        {
          action: "Reveal latency delta",
          title: "P95 down",
          body: "The main bar moves from 420 ms to 148 ms.",
        },
        {
          action: "Reveal route delta",
          title: "Path shortened",
          body: "The critical route loses two hops.",
        },
        {
          action: "Award badges",
          title: "No-hit route",
          body: "The team leaves with repeatable power-ups.",
        },
      ],
    },
    zh: {
      kicker: "第五关 / 分数结算",
      title: "Boss 已清除",
      subtitle: "记分屏把工程成果变成所有人都能读懂的胜利画面。",
      beats: [
        {
          action: "显示最终分数",
          title: "得分 9999",
          body: "这一轮完成。",
        },
        {
          action: "显示延迟差值",
          title: "P95 下降",
          body: "主指标从 420 ms 降到 148 ms。",
        },
        {
          action: "显示路径差值",
          title: "路径缩短",
          body: "关键路径减少两跳。",
        },
        {
          action: "颁发徽章",
          title: "无伤路线",
          body: "团队带走可复用道具。",
        },
      ],
    },
  },
};

const ATTACKS: Attack[] = [
  {
    key: "jitter",
    en: {
      title: "Jitter rain",
      text: "Tiny spikes hide inside a busy frame.",
    },
    zh: {
      title: "抖动雨",
      text: "细碎尖峰藏在繁忙帧里。",
    },
  },
  {
    key: "queue",
    en: {
      title: "Queue slam",
      text: "Backlog chains every request behind one miss.",
    },
    zh: {
      title: "队列重击",
      text: "积压把一次失误串成多次等待。",
    },
  },
  {
    key: "timeout",
    en: {
      title: "Timeout beam",
      text: "The tail stays alive after the screen looks calm.",
    },
    zh: {
      title: "超时光束",
      text: "画面看似平静，长尾仍在掉血。",
    },
  },
  {
    key: "lane",
    en: {
      title: "Safe lane",
      text: "Move first where damage repeats.",
    },
    zh: {
      title: "安全路线",
      text: "先移动重复伤害最高的位置。",
    },
  },
];

const POWER_UPS: PowerUp[] = [
  {
    key: "cache",
    icon: "C",
    color: "#7cffb2",
    en: { name: "Cache shard", text: "Skip repeated work." },
    zh: { name: "缓存碎片", text: "跳过重复工作。" },
  },
  {
    key: "edge",
    icon: "E",
    color: "#37f4ff",
    en: { name: "Edge boots", text: "Shorten the hop." },
    zh: { name: "边缘靴", text: "缩短路径跳数。" },
  },
  {
    key: "trace",
    icon: "T",
    color: "#ffe45c",
    en: { name: "Trace lens", text: "Expose hidden frames." },
    zh: { name: "追踪镜", text: "暴露隐藏帧。" },
  },
  {
    key: "budget",
    icon: "B",
    color: "#ff3b6b",
    en: { name: "Budget shield", text: "Cap every route." },
    zh: { name: "预算盾", text: "锁住每条路线。" },
  },
];

const COMBO_STEPS: Combo[] = [
  { key: "route", en: "Edge route cuts the longest hop", zh: "边缘路由切掉最长跳" },
  { key: "cache", en: "Cache cancel removes repeated work", zh: "缓存取消移除重复工作" },
  { key: "trace", en: "Trace lens finds the tail frame", zh: "追踪镜找到长尾帧" },
  { key: "budget", en: "Budget shield locks the win window", zh: "预算盾锁定胜利窗口" },
  { key: "strike", en: "Final input lands before timeout", zh: "终击在超时前命中" },
];

const RESULTS: Result[] = [
  {
    key: "p95",
    en: { label: "P95 latency", value: "420 ms -> 148 ms" },
    zh: { label: "P95 延迟", value: "420 ms -> 148 ms" },
  },
  {
    key: "tail",
    en: { label: "Timeouts", value: "-73%" },
    zh: { label: "超时", value: "-73%" },
  },
  {
    key: "route",
    en: { label: "Critical path", value: "4 hops -> 2" },
    zh: { label: "关键路径", value: "4 跳 -> 2" },
  },
];

function useFonts() {
  useEffect(() => {
    const id = "style-40-latency-boss-fonts";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Press+Start+2P&family=ZCOOL+KuaiLe&display=swap";
    document.head.appendChild(link);
  }, []);
}

function sceneCopy(scene: number, language: Lang): SceneCopy {
  return SCENES[scene]?.[language] ?? SCENES[1][language];
}

function clampBeat(scene: number, beat: number, language: Lang): number {
  const maxBeat = sceneCopy(scene, language).beats.length - 1;
  return Math.max(0, Math.min(beat, maxBeat));
}

function getDelay(index: number): CSSProperties {
  return { "--delay": `${index * 0.08}s` } as CSSProperties;
}

function getPowerColor(color: string, index: number): CSSProperties {
  return {
    "--power-color": color,
    "--delay": `${index * 0.08}s`,
  } as CSSProperties;
}

function BossSprite({ damaged = false }: { damaged?: boolean }) {
  return (
    <svg
      className={styles.bossSprite}
      viewBox="0 0 120 96"
      aria-hidden="true"
      focusable="false"
    >
      <rect x="26" y="16" width="68" height="18" fill="#ff3b6b" />
      <rect x="14" y="34" width="92" height="42" fill="#ff3b6b" />
      <rect x="2" y="50" width="18" height="24" fill="#ff3b6b" />
      <rect x="100" y="50" width="18" height="24" fill="#ff3b6b" />
      <rect x="34" y="44" width="14" height="14" fill="#080914" />
      <rect x="72" y="44" width="14" height="14" fill="#080914" />
      <rect x="50" y="66" width="20" height="8" fill={damaged ? "#ffe45c" : "#080914"} />
      <rect x="28" y="78" width="14" height="12" fill="#ff7b47" />
      <rect x="78" y="78" width="14" height="12" fill="#ff7b47" />
      {damaged ? (
        <>
          <rect x="8" y="8" width="12" height="12" fill="#ffe45c" />
          <rect x="100" y="12" width="10" height="10" fill="#37f4ff" />
          <rect x="18" y="82" width="10" height="10" fill="#7cffb2" />
        </>
      ) : null}
    </svg>
  );
}

function PlayerSprite() {
  return (
    <svg
      className={styles.playerSprite}
      viewBox="0 0 70 88"
      aria-hidden="true"
      focusable="false"
    >
      <rect x="22" y="4" width="26" height="22" fill="#7cffb2" />
      <rect x="14" y="26" width="42" height="34" fill="#37f4ff" />
      <rect x="6" y="36" width="12" height="18" fill="#ffe45c" />
      <rect x="52" y="36" width="12" height="18" fill="#ffe45c" />
      <rect x="18" y="60" width="12" height="22" fill="#7cffb2" />
      <rect x="40" y="60" width="12" height="22" fill="#7cffb2" />
      <rect x="28" y="12" width="6" height="6" fill="#080914" />
      <rect x="40" y="12" width="6" height="6" fill="#080914" />
    </svg>
  );
}

function SceneHeader({
  content,
  beat,
}: {
  content: SceneCopy;
  beat: number;
}) {
  const currentBeat = content.beats[beat];
  return (
    <header className={styles.sceneHeader} data-beat-layout-item="true">
      <div className={styles.kicker}>{content.kicker}</div>
      <h1 className={styles.title}>{content.title}</h1>
      <p className={styles.subtitle}>{content.subtitle}</p>
      <div className={styles.statusCard}>
        <span className={styles.statName}>{currentBeat.title}</span>
        <span className={styles.statHint}>{currentBeat.body}</span>
      </div>
    </header>
  );
}

function BeatMarkers({ count, beat }: { count: number; beat: number }) {
  return (
    <div
      className={styles.beatRail}
      data-beat-markers="true"
      data-beat-layout-item="true"
      aria-hidden="true"
    >
      {Array.from({ length: count }, (_, index) => (
        <span
          key={index}
          className={[
            styles.beatMarker,
            index <= beat ? styles.beatMarkerActive : "",
          ]
            .filter(Boolean)
            .join(" ")}
        />
      ))}
    </div>
  );
}

function BossIntroScene({
  beat,
  language,
}: {
  beat: number;
  language: Lang;
}) {
  const stats = sceneCopy(1, language).beats.slice(0, beat + 1);
  return (
    <div className={`${styles.sceneBody} ${styles.bossArena}`}>
      <div className={styles.bossCard} data-beat-layout-item="true">
        <BossSprite damaged={beat >= 2} />
        <div className={styles.spriteLabel}>
          {language === "zh" ? "延迟 Boss" : "LATENCY BOSS"}
        </div>
      </div>
      <div className={styles.statusGrid}>
        {stats.map((item, index) => (
          <div
            className={styles.statusCard}
            data-beat-layout-item="true"
            key={item.title}
            style={getDelay(index)}
          >
            <span className={styles.statName}>{item.title}</span>
            <span className={styles.statValue}>{item.action}</span>
            <span className={styles.statHint}>{item.body}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function AttackPatternScene({
  beat,
  language,
}: {
  beat: number;
  language: Lang;
}) {
  const attacks = ATTACKS.slice(0, beat + 1);
  return (
    <div className={`${styles.sceneBody} ${styles.attackArena}`}>
      <div className={styles.patternScreen} data-beat-layout-item="true">
        <svg
          className={styles.attackSvg}
          viewBox="0 0 520 270"
          aria-hidden="true"
          focusable="false"
        >
          <path
            className={styles.attackPath}
            d="M 24 220 H 120 V 92 H 210 V 166 H 312 V 58 H 474"
          />
          <rect className={styles.attackNode} x="112" y="84" width="24" height="24" />
          {beat >= 1 ? (
            <rect className={styles.attackNode} x="202" y="158" width="24" height="24" />
          ) : null}
          {beat >= 2 ? (
            <rect className={styles.attackNode} x="304" y="50" width="24" height="24" />
          ) : null}
          {beat >= 3 ? (
            <rect className={styles.attackNode} x="456" y="196" width="32" height="32" />
          ) : null}
        </svg>
        <div className={styles.warningText}>
          {language === "zh"
            ? "危险模式：尖峰不是随机噪声。"
            : "DANGER PATTERN: spikes are not random noise."}
        </div>
      </div>
      <div className={styles.attackList}>
        {attacks.map((attack, index) => (
          <article
            className={styles.attackCard}
            data-beat-layout-item="true"
            key={attack.key}
            style={getDelay(index)}
          >
            <div className={styles.cardTitle}>{attack[language].title}</div>
            <div className={styles.cardText}>{attack[language].text}</div>
          </article>
        ))}
      </div>
    </div>
  );
}

function PowerUpsScene({
  beat,
  language,
}: {
  beat: number;
  language: Lang;
}) {
  const powerUps = POWER_UPS.slice(0, Math.max(0, beat));
  return (
    <div className={`${styles.sceneBody} ${styles.powerArena}`}>
      <div className={styles.inventory}>
        {powerUps.map((power, index) => (
          <article
            className={styles.powerCard}
            data-beat-layout-item="true"
            key={power.key}
            style={getPowerColor(power.color, index)}
          >
            <div className={styles.powerIcon}>{power.icon}</div>
            <div>
              <div className={styles.powerName}>{power[language].name}</div>
              <div className={styles.powerText}>{power[language].text}</div>
            </div>
          </article>
        ))}
      </div>
      <aside className={styles.playerPanel} data-beat-layout-item="true">
        <PlayerSprite />
        <div className={styles.loadoutText}>
          {language === "zh"
            ? `装备槽 ${powerUps.length}/4`
            : `LOADOUT ${powerUps.length}/4`}
        </div>
      </aside>
    </div>
  );
}

function FinalComboScene({
  beat,
  language,
}: {
  beat: number;
  language: Lang;
}) {
  const steps = COMBO_STEPS.slice(0, beat + 1);
  return (
    <div className={`${styles.sceneBody} ${styles.comboArena}`}>
      <div className={styles.comboBoss} data-beat-layout-item="true">
        <BossSprite damaged />
        <div className={styles.damageTag}>
          {language === "zh" ? "破防窗口" : "BREAK WINDOW"}
        </div>
      </div>
      <div className={styles.comboStack}>
        {steps.map((step, index) => (
          <article
            className={styles.comboCard}
            data-beat-layout-item="true"
            key={step.key}
            style={getDelay(index)}
          >
            <div className={styles.comboKey}>{`HIT ${index + 1}`}</div>
            <div className={styles.comboText}>{step[language]}</div>
          </article>
        ))}
      </div>
    </div>
  );
}

function ScoreScene({
  beat,
  language,
}: {
  beat: number;
  language: Lang;
}) {
  const results = RESULTS.slice(0, Math.max(0, beat));
  const badges =
    beat >= 3
      ? language === "zh"
        ? ["无伤路线", "预算锁定", "可复用打法"]
        : ["No-hit route", "Budget locked", "Reusable runbook"]
      : [];
  return (
    <div className={`${styles.sceneBody} ${styles.scoreArena}`}>
      <section className={styles.scoreBoard} data-beat-layout-item="true">
        <div className={styles.scoreNumber}>9999</div>
        <div className={styles.scoreCaption}>
          {language === "zh" ? "Boss Clear / 延迟已清除" : "Boss Clear / Latency cleared"}
        </div>
        <div className={styles.resultList}>
          {results.map((result, index) => (
            <div
              className={styles.resultItem}
              data-beat-layout-item="true"
              key={result.key}
              style={getDelay(index)}
            >
              <span>{result[language].label}</span>
              <span>{result[language].value}</span>
            </div>
          ))}
        </div>
      </section>
      <aside className={styles.badgePanel}>
        {badges.map((badge, index) => (
          <div
            className={styles.badge}
            data-beat-layout-item="true"
            key={badge}
            style={getDelay(index)}
          >
            {badge}
          </div>
        ))}
      </aside>
    </div>
  );
}

function renderSceneBody(scene: number, beat: number, language: Lang) {
  if (scene === 1) return <BossIntroScene beat={beat} language={language} />;
  if (scene === 2) return <AttackPatternScene beat={beat} language={language} />;
  if (scene === 3) return <PowerUpsScene beat={beat} language={language} />;
  if (scene === 4) return <FinalComboScene beat={beat} language={language} />;
  return <ScoreScene beat={beat} language={language} />;
}

function ScenePanel({
  scene,
  beat,
  language,
  isActive,
  motionDisabled,
}: {
  scene: number;
  beat: number;
  language: Lang;
  isActive: boolean;
  motionDisabled: boolean;
}) {
  const safeBeat = clampBeat(scene, beat, language);
  const content = sceneCopy(scene, language);
  const flip = useFLIP<HTMLDivElement>({
    watch: [scene, safeBeat, language],
    disabled: motionDisabled || !isActive,
    duration: 320,
    easing: "steps(5, end)",
    selector: '[data-beat-layout-item="true"]',
  });

  return (
    <section className={styles.sceneLayer} aria-hidden={!isActive}>
      <div
        ref={flip.ref}
        className={styles.sceneInner}
        data-beat-layout-container="true"
        data-beat-layout-mode="motion"
      >
        <SceneHeader content={content} beat={safeBeat} />
        {renderSceneBody(scene, safeBeat, language)}
        <BeatMarkers count={content.beats.length} beat={safeBeat} />
      </div>
    </section>
  );
}

function Hud({ scene, language }: { scene: number; language: Lang }) {
  const hp = BOSS_HP_BY_SCENE[scene - 1] ?? 100;
  const score = SCORE_BY_SCENE[scene - 1] ?? 0;
  return (
    <div className={styles.hud} aria-hidden="true">
      <div>
        <span className={styles.hudLabel}>
          {language === "zh" ? "玩家" : "PLAYER"}
        </span>
        <span className={styles.hudValue}>
          {language === "zh" ? "性能队" : "PERF TEAM"}
        </span>
      </div>
      <div className={styles.bossMeterShell}>
        <div className={styles.bossMeterText}>
          <span>{language === "zh" ? "Boss 血量" : "BOSS HP"}</span>
          <span>{hp}%</span>
        </div>
        <div className={styles.bossMeter}>
          <div
            className={styles.bossMeterFill}
            style={{ "--boss-hp": `${hp}%` } as CSSProperties}
          />
        </div>
      </div>
      <div className={styles.scoreBox}>
        <span className={styles.scoreLabel}>
          {language === "zh" ? "得分" : "SCORE"}
        </span>
        <div className={styles.scoreValue}>{score.toString().padStart(4, "0")}</div>
      </div>
    </div>
  );
}

function LifePipNav({
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
  if (isThumbnail) {
    return <nav className={styles.hiddenNav} aria-hidden="true" />;
  }

  return (
    <nav className={styles.lifeNav} aria-label={language === "zh" ? "关卡导航" : "Level navigation"}>
      {SCENE_IDS.map((sceneId) => (
        <button
          type="button"
          key={sceneId}
          className={[
            styles.lifeButton,
            sceneId === scene ? styles.lifeButtonActive : "",
            sceneId < scene ? styles.lifeButtonCleared : "",
          ]
            .filter(Boolean)
            .join(" ")}
          onClick={() => onNavigate?.(sceneId, 0)}
          aria-current={sceneId === scene ? "step" : undefined}
          aria-label={
            language === "zh" ? `跳转到第 ${sceneId} 关` : `Go to level ${sceneId}`
          }
        >
          <span className={styles.srOnly}>{sceneId}</span>
        </button>
      ))}
    </nav>
  );
}

export function getMetadata(lang: Lang): StyleMetadata {
  return {
    id: "arcade-boss-fight",
    band: "contemporary-digital",
    name: lang === "zh" ? "街机 Boss 战" : "Arcade Boss Fight",
    theme: lang === "zh" ? "击败延迟 Boss" : "Defeat the Latency Boss",
    densityLabel: lang === "zh" ? "HUD 高密度" : "HUD Dense",
    heroScene: 1,
    colors: {
      bg: "#080914",
      ink: "#f5fbff",
      panel: "#11152c",
    },
    typography: {
      header: "Press Start 2P",
      body: "Press Start 2P",
    },
    tags: ["arcade", "retro", "pixel", "hud", "game", "digital", "motion"],
    fonts: ["Press Start 2P", "cjk:ZCOOL KuaiLe"],
    scenes: SCENE_IDS.map((id) => {
      const copy = sceneCopy(id, lang);
      return {
        id,
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

export default function LatencyBossFightV2({
  scene,
  beat,
  language,
  isThumbnail,
  reducedMotion,
  onNavigate,
}: BespokeStyleProps) {
  useFonts();
  const activeScene = Math.max(1, Math.min(scene, 5));
  const motionDisabled = reducedMotion || isThumbnail;

  return (
    <div
      className={[styles.root, motionDisabled ? styles.motionReduced : ""]
        .filter(Boolean)
        .join(" ")}
    >
      <Hud scene={activeScene} language={language} />
      <SpatialSceneTrack
        scene={activeScene}
        beat={beat}
        sceneIds={SCENE_IDS}
        transitionKind="glitch"
        transitionMap={TRANSITION_MAP}
        transitionDurationMs={620}
        reducedMotion={motionDisabled}
        beatLayoutModes={BEAT_LAYOUT_MODES}
        className={styles.track}
        renderScene={(sceneId, sceneBeat, isActive) => (
          <ScenePanel
            scene={sceneId}
            beat={sceneBeat}
            language={language}
            isActive={isActive}
            motionDisabled={motionDisabled}
          />
        )}
      />
      <LifePipNav
        scene={activeScene}
        language={language}
        isThumbnail={isThumbnail}
        onNavigate={onNavigate}
      />
    </div>
  );
}

export const latencyBossFightTopic = defineStyleTopic({
  id: "latency-boss",
  topic: {
    en: "Latency Boss",
    zh: "延迟 Boss",
  },
  model: "GPT-5.5",
  component: LatencyBossFightV2,
  getMetadata,
});

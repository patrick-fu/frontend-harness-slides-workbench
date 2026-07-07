import React, { useEffect } from "react";
import type { BespokeStyleProps, StyleMetadata } from "../types";
import { useFLIP } from "../hooks/useFLIP";
import SpatialSceneTrack from "./SpatialSceneTrack";
import { defineStyleTopic } from "./topic";
import styles from "./13-raw-notes-clean-brief.module.css";

type Lang = "en" | "zh";

interface BeatCopy {
  action: string;
  title: string;
  body: string;
}

interface SceneCopy {
  nav: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  counterLabel: string;
  primary: string[];
  secondary: string[];
  result: string[];
  beats: BeatCopy[];
}

const SCENE_IDS = [1, 2, 3, 4, 5];
const BEAT_LAYOUT_MODES = {
  1: "motion",
  2: "motion",
  3: "motion",
  4: "motion",
  5: "motion",
} as const;

const TRANSITION_MAP = {
  "1->2": "slide-y",
  "2->3": "wipe",
  "3->4": "scale-fade",
  "4->5": "fade",
} as const;

const ROTATIONS = ["-3deg", "2deg", "-1deg", "3deg", "-2deg", "1deg"];
const NOTE_TONE_CLASSES = {
  paper: styles.noteTonePaper,
  green: styles.noteToneGreen,
  terracotta: styles.noteToneTerracotta,
};

const CONTENT: Record<number, Record<Lang, SceneCopy>> = {
  1: {
    en: {
      nav: "Ingredients",
      eyebrow: "Step 1",
      title: "Ingredients",
      subtitle: "Dump the raw notes on the board before deciding what deserves heat.",
      counterLabel: "Raw basket",
      primary: ["Meeting scraps", "Customer quote", "Metric hint", "Loose ask"],
      secondary: ["Keep", "Question", "Trim"],
      result: ["Signal separated", "Filler swept aside"],
      beats: [
        {
          action: "Drop raw notes on the counter",
          title: "Raw notes arrive",
          body: "Everything is visible before anything is cleaned.",
        },
        {
          action: "Sort notes into prep bowls",
          title: "Sort the useful pieces",
          body: "Quotes, facts, and asks move into separate bowls.",
        },
        {
          action: "Trim filler from the board",
          title: "Trim the filler",
          body: "Noise leaves the surface so the brief has a clean start.",
        },
      ],
    },
    zh: {
      nav: "原料",
      eyebrow: "步骤 1",
      title: "原料上桌",
      subtitle: "先把散乱笔记摊开，再判断哪些值得加热。",
      counterLabel: "原始篮",
      primary: ["会议碎片", "用户原话", "指标线索", "模糊诉求"],
      secondary: ["保留", "追问", "修剪"],
      result: ["信号分离", "废料扫开"],
      beats: [
        {
          action: "把原始笔记倒上台面",
          title: "原料先全部可见",
          body: "先不美化，先看清每一块素材。",
        },
        {
          action: "把笔记分进备料碗",
          title: "把有用部分分拣",
          body: "原话、事实和诉求各进各的碗。",
        },
        {
          action: "从台面修掉填充词",
          title: "修掉填充噪音",
          body: "杂质离开台面，简报才有干净起点。",
        },
      ],
    },
  },
  2: {
    en: {
      nav: "Mise en place",
      eyebrow: "Step 2",
      title: "Mise en place",
      subtitle: "Line up the brief parts so the argument can cook evenly.",
      counterLabel: "Prep line",
      primary: ["Audience", "Problem", "Evidence", "Ask"],
      secondary: ["Cut scope", "Dice facts", "Label gaps", "Reserve proof"],
      result: ["Brief mise ready", "Missing salt marked"],
      beats: [
        {
          action: "Line up the bowls",
          title: "Give every part a place",
          body: "The brief stops being a pile and becomes a prep line.",
        },
        {
          action: "Chop notes into brief blocks",
          title: "Cut into usable pieces",
          body: "Each note gets a job: context, evidence, decision, or ask.",
        },
        {
          action: "Mark missing seasoning",
          title: "Label the gaps",
          body: "Open questions stay visible instead of hiding in prose.",
        },
      ],
    },
    zh: {
      nav: "备料",
      eyebrow: "步骤 2",
      title: "备料归位",
      subtitle: "把简报部件排好，论点才能均匀入味。",
      counterLabel: "备料线",
      primary: ["受众", "问题", "证据", "请求"],
      secondary: ["切范围", "切事实", "贴缺口", "留证明"],
      result: ["备料完成", "缺的盐已标出"],
      beats: [
        {
          action: "把备料碗排成一线",
          title: "每个部件都有位置",
          body: "简报不再是一堆，而是一条备料线。",
        },
        {
          action: "把笔记切成简报块",
          title: "切成可用小块",
          body: "每条笔记变成背景、证据、决策或请求。",
        },
        {
          action: "标出缺失调味",
          title: "把缺口贴出来",
          body: "开放问题留在台面上，不藏进长段落。",
        },
      ],
    },
  },
  3: {
    en: {
      nav: "Simmer",
      eyebrow: "Step 3",
      title: "Simmer",
      subtitle: "Reduce the notes until the brief keeps only the strongest flavor.",
      counterLabel: "Reduction pot",
      primary: ["Thesis", "Scope", "Decision", "Owner"],
      secondary: ["because", "so that", "not now", "next"],
      result: ["One clean line", "Objections tasted"],
      beats: [
        {
          action: "Combine the prepared parts",
          title: "Combine the parts",
          body: "The pot gets thesis, evidence, boundary, and ask.",
        },
        {
          action: "Reduce repeated wording",
          title: "Reduce repetition",
          body: "Duplicate flavor evaporates before the reader sees it.",
        },
        {
          action: "Taste-check the argument",
          title: "Taste-check the logic",
          body: "If the line cannot be served aloud, it simmers longer.",
        },
      ],
    },
    zh: {
      nav: "慢炖",
      eyebrow: "步骤 3",
      title: "慢炖收汁",
      subtitle: "把笔记熬到只剩最强的味道。",
      counterLabel: "收汁锅",
      primary: ["论点", "范围", "决策", "负责人"],
      secondary: ["因为", "因此", "现在不做", "下一步"],
      result: ["一句干净主线", "反对意见已试味"],
      beats: [
        {
          action: "合并已备好的部件",
          title: "把部件下锅",
          body: "论点、证据、边界和请求一起入锅。",
        },
        {
          action: "收掉重复措辞",
          title: "收掉重复味道",
          body: "重复表达先蒸发，不让读者尝到。",
        },
        {
          action: "试味论证逻辑",
          title: "试味逻辑",
          body: "如果不能顺口说清，就继续慢炖。",
        },
      ],
    },
  },
  4: {
    en: {
      nav: "Plate",
      eyebrow: "Step 4",
      title: "Plate",
      subtitle: "Serve the clean brief with the decision, proof, and next bite in view.",
      counterLabel: "Service pass",
      primary: ["Decision", "Why now", "Evidence", "Next ask"],
      secondary: ["Garnish proof", "Wipe rim", "Portion next step"],
      result: ["Ready to serve", "No garnish pretending to be substance"],
      beats: [
        {
          action: "Place the clean brief on the plate",
          title: "Plate the brief",
          body: "The main line sits in the center, not buried in garnish.",
        },
        {
          action: "Add proof and next step",
          title: "Add the sides",
          body: "Evidence and the ask sit close enough to read in one pass.",
        },
        {
          action: "Wipe away decorative noise",
          title: "Wipe the rim",
          body: "Anything pretty but useless leaves before service.",
        },
      ],
    },
    zh: {
      nav: "装盘",
      eyebrow: "步骤 4",
      title: "干净装盘",
      subtitle: "把决策、证据和下一口都摆在读者眼前。",
      counterLabel: "出餐口",
      primary: ["决策", "为何现在", "证据", "下一步请求"],
      secondary: ["点缀证明", "擦净盘边", "分好下一口"],
      result: ["可以上桌", "装饰不冒充内容"],
      beats: [
        {
          action: "把干净简报放上盘",
          title: "主线居中装盘",
          body: "主线放在中央，不埋进装饰里。",
        },
        {
          action: "加入证据和下一步",
          title: "配好旁菜",
          body: "证据和请求靠近主线，一眼能读完。",
        },
        {
          action: "擦掉无用装饰",
          title: "擦净盘边",
          body: "好看但没用的东西，在上桌前离开。",
        },
      ],
    },
  },
  5: {
    en: {
      nav: "Recipe card",
      eyebrow: "Step 5",
      title: "Recipe card",
      subtitle: "Capture the repeatable recipe so the next messy note pile starts cleaner.",
      counterLabel: "House recipe",
      primary: ["Input", "Cut", "Reduce", "Serve"],
      secondary: ["Owner named", "Decision dated", "Gap visible", "Ask explicit"],
      result: ["Reusable brief recipe", "Next prep starts faster"],
      beats: [
        {
          action: "Write the repeatable recipe",
          title: "Write the card",
          body: "The process becomes visible enough to repeat.",
        },
        {
          action: "Portion the next actions",
          title: "Portion next steps",
          body: "Owners and asks are measured before the card is pinned.",
        },
        {
          action: "Pin the final recipe",
          title: "Pin the recipe",
          body: "The clean brief leaves a cleaner path behind it.",
        },
      ],
    },
    zh: {
      nav: "菜谱卡",
      eyebrow: "步骤 5",
      title: "写成菜谱卡",
      subtitle: "把可复用做法留下，下次乱笔记能更快变干净。",
      counterLabel: "本店菜谱",
      primary: ["输入", "切分", "收汁", "上桌"],
      secondary: ["负责人明确", "决策有日期", "缺口可见", "请求具体"],
      result: ["可复用简报菜谱", "下次备料更快"],
      beats: [
        {
          action: "写下可复用菜谱",
          title: "写下菜谱卡",
          body: "流程变得足够清楚，可以重复使用。",
        },
        {
          action: "分装下一步动作",
          title: "分装下一步",
          body: "负责人和请求先量好，再把卡片钉上去。",
        },
        {
          action: "钉住最终菜谱",
          title: "钉住菜谱",
          body: "干净简报走出去，也留下更干净的路径。",
        },
      ],
    },
  },
};

function useKitchenFonts() {
  useEffect(() => {
    const id = "style-13-raw-notes-clean-brief-v2-fonts";
    if (document.getElementById(id)) return;

    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Nunito:wght@500;700;800&family=Noto+Sans+SC:wght@500;700;800&display=swap";
    document.head.appendChild(link);
  }, []);
}

function cx(...classNames: Array<string | false | undefined>) {
  return classNames.filter(Boolean).join(" ");
}

function cssVars(vars: Record<`--${string}`, string>): React.CSSProperties {
  return vars as unknown as React.CSSProperties;
}

function getSceneCopy(sceneId: number, language: Lang) {
  return CONTENT[sceneId]?.[language] ?? CONTENT[1][language];
}

function clampScene(scene: number) {
  return Math.min(5, Math.max(1, Math.trunc(scene)));
}

function clampBeat(beat: number, copy: SceneCopy) {
  return Math.min(copy.beats.length - 1, Math.max(0, Math.trunc(beat)));
}

function getVisible<T>(items: T[], beat: number) {
  return items.slice(0, Math.min(items.length, beat + 2));
}

function BeatMarkers({ copy, beat }: { copy: SceneCopy; beat: number }) {
  return (
    <div className={styles.beatMarkers} aria-label="Beat markers">
      {copy.beats.map((beatCopy, index) => (
        <span
          key={beatCopy.title}
          className={cx(styles.beatMarker, index <= beat && styles.beatMarkerActive)}
          title={beatCopy.action}
        >
          <span className={styles.beatDot} />
          <span>{index + 1}</span>
        </span>
      ))}
    </div>
  );
}

function RecipeMagnets({
  language,
  scene,
  onNavigate,
}: {
  language: Lang;
  scene: number;
  onNavigate?: (scene: number, beat: number) => void;
}) {
  return (
    <nav className={styles.recipeMagnets} aria-label="Recipe steps">
      {SCENE_IDS.map((sceneId) => {
        const copy = getSceneCopy(sceneId, language);
        const isActive = sceneId === scene;

        return (
          <button
            key={sceneId}
            className={cx(styles.magnet, isActive && styles.magnetActive)}
            type="button"
            aria-current={isActive ? "step" : undefined}
            onClick={() => onNavigate?.(sceneId, 0)}
          >
            <span className={styles.magnetNumber}>{sceneId}</span>
            <span className={styles.magnetLabel}>{copy.nav}</span>
          </button>
        );
      })}
    </nav>
  );
}

function SceneHeader({ copy, beat }: { copy: SceneCopy; beat: number }) {
  const currentBeat = copy.beats[beat];

  return (
    <header className={styles.sceneHeader} data-beat-layout-item="true">
      <div className={styles.eyebrowRow}>
        <span className={styles.eyebrow}>{copy.eyebrow}</span>
        <BeatMarkers copy={copy} beat={beat} />
      </div>
      <h1>{copy.title}</h1>
      <p className={styles.subtitle}>{copy.subtitle}</p>
      <p className={styles.beatLine}>{currentBeat.body}</p>
    </header>
  );
}

function NoteChip({
  label,
  index,
  tone = "paper",
}: {
  label: string;
  index: number;
  tone?: "paper" | "green" | "terracotta";
}) {
  return (
    <span
      className={cx(styles.noteChip, NOTE_TONE_CLASSES[tone])}
      data-beat-layout-item="true"
      style={cssVars({
        "--rot": ROTATIONS[index % ROTATIONS.length],
        "--delay": `${index * 70}ms`,
      })}
    >
      {label}
    </span>
  );
}

function IngredientsScene({ copy, beat }: { copy: SceneCopy; beat: number }) {
  return (
    <div className={styles.ingredientsScene}>
      <div className={styles.rawBasket} data-beat-layout-item="true">
        <span className={styles.stationLabel}>{copy.counterLabel}</span>
        <div className={styles.notePile}>
          {getVisible(copy.primary, beat).map((item, index) => (
            <NoteChip key={item} label={item} index={index} />
          ))}
        </div>
      </div>

      {beat >= 1 && (
        <div className={styles.bowlRow} data-beat-layout-item="true">
          {copy.secondary.map((item) => (
            <span key={item} className={styles.prepBowl}>
              <span className={styles.bowlFill} />
              <span>{item}</span>
            </span>
          ))}
        </div>
      )}

      {beat >= 2 && (
        <div className={styles.trimTray} data-beat-layout-item="true">
          {copy.result.map((item, index) => (
            <NoteChip
              key={item}
              label={item}
              index={index + 3}
              tone={index === 0 ? "green" : "terracotta"}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function MiseScene({ copy, beat }: { copy: SceneCopy; beat: number }) {
  return (
    <div className={styles.miseScene}>
      <div className={styles.cuttingBoard} data-beat-layout-item="true">
        <span className={styles.stationLabel}>{copy.counterLabel}</span>
        <div className={styles.knife} aria-hidden="true" />
        <div className={styles.prepGrid}>
          {copy.primary.map((item) => (
            <span key={item} className={styles.prepSlot}>
              <span className={styles.slotBowl} />
              <span>{item}</span>
            </span>
          ))}
        </div>
      </div>

      {beat >= 1 && (
        <div className={styles.chopLine} data-beat-layout-item="true">
          {getVisible(copy.secondary, beat).map((item, index) => (
            <NoteChip key={item} label={item} index={index} tone="green" />
          ))}
        </div>
      )}

      {beat >= 2 && (
        <div className={styles.seasoningPins} data-beat-layout-item="true">
          {copy.result.map((item) => (
            <span key={item} className={styles.pinTag}>
              {item}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function SimmerScene({ copy, beat }: { copy: SceneCopy; beat: number }) {
  return (
    <div className={styles.simmerScene}>
      <div className={styles.pot} data-beat-layout-item="true">
        <span className={styles.stationLabel}>{copy.counterLabel}</span>
        <div className={styles.steam} aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <div className={styles.potLip} />
        <div className={styles.potBody}>
          {getVisible(copy.primary, beat).map((item) => (
            <span key={item} className={styles.bubble}>
              {item}
            </span>
          ))}
        </div>
      </div>

      {beat >= 1 && (
        <div className={styles.reductionRail} data-beat-layout-item="true">
          {copy.secondary.map((item, index) => (
            <span key={item} className={index <= beat + 1 ? styles.railActive : ""}>
              {item}
            </span>
          ))}
        </div>
      )}

      {beat >= 2 && (
        <div className={styles.tasteSpoons} data-beat-layout-item="true">
          {copy.result.map((item, index) => (
            <NoteChip key={item} label={item} index={index} tone="terracotta" />
          ))}
        </div>
      )}
    </div>
  );
}

function PlateScene({ copy, beat }: { copy: SceneCopy; beat: number }) {
  return (
    <div className={styles.plateScene}>
      <div className={styles.plate} data-beat-layout-item="true">
        <span className={styles.stationLabel}>{copy.counterLabel}</span>
        <div className={styles.briefStack}>
          {getVisible(copy.primary, beat).map((item) => (
            <span key={item} className={styles.briefLine}>
              {item}
            </span>
          ))}
        </div>
      </div>

      {beat >= 1 && (
        <div className={styles.sideDishes} data-beat-layout-item="true">
          {copy.secondary.slice(0, beat + 1).map((item) => (
            <span key={item} className={styles.sideDish}>
              {item}
            </span>
          ))}
        </div>
      )}

      {beat >= 2 && (
        <div className={styles.serviceTicket} data-beat-layout-item="true">
          {copy.result.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      )}
    </div>
  );
}

function RecipeCardScene({ copy, beat }: { copy: SceneCopy; beat: number }) {
  return (
    <div className={styles.recipeScene}>
      <div className={styles.recipeCard} data-beat-layout-item="true">
        <span className={styles.stationLabel}>{copy.counterLabel}</span>
        <div className={styles.cardTitle}>{copy.title}</div>
        <ol>
          {copy.primary.map((item, index) => (
            <li key={item} className={index <= beat + 1 ? styles.cardLineActive : ""}>
              <span>{index + 1}</span>
              {item}
            </li>
          ))}
        </ol>
      </div>

      {beat >= 1 && (
        <div className={styles.checkTags} data-beat-layout-item="true">
          {copy.secondary.map((item, index) => (
            <span key={item} className={index <= beat + 1 ? styles.checkTagActive : ""}>
              {item}
            </span>
          ))}
        </div>
      )}

      {beat >= 2 && (
        <div className={styles.finalPin} data-beat-layout-item="true">
          {copy.result.map((item, index) => (
            <NoteChip key={item} label={item} index={index} tone="green" />
          ))}
        </div>
      )}
    </div>
  );
}

function SceneVisual({ sceneId, copy, beat }: { sceneId: number; copy: SceneCopy; beat: number }) {
  if (sceneId === 1) return <IngredientsScene copy={copy} beat={beat} />;
  if (sceneId === 2) return <MiseScene copy={copy} beat={beat} />;
  if (sceneId === 3) return <SimmerScene copy={copy} beat={beat} />;
  if (sceneId === 4) return <PlateScene copy={copy} beat={beat} />;
  return <RecipeCardScene copy={copy} beat={beat} />;
}

function ScenePanel({
  sceneId,
  beat,
  language,
  motionOff,
  isActive,
}: {
  sceneId: number;
  beat: number;
  language: Lang;
  motionOff: boolean;
  isActive: boolean;
}) {
  const copy = getSceneCopy(sceneId, language);
  const safeBeat = clampBeat(beat, copy);
  const { ref } = useFLIP<HTMLDivElement>({
    watch: [sceneId, safeBeat, language],
    disabled: motionOff || !isActive,
    duration: 520,
    easing: "cubic-bezier(0.34, 1.56, 0.64, 1)",
    selector: '[data-beat-layout-item="true"]',
  });

  return (
    <section
      ref={ref}
      className={styles.scene}
      data-beat-layout-container="true"
      data-beat-layout-mode="motion"
      data-scene-kind={copy.nav}
    >
      <SceneHeader copy={copy} beat={safeBeat} />
      <div className={styles.visualWell} data-beat-layout-item="true">
        <SceneVisual sceneId={sceneId} copy={copy} beat={safeBeat} />
      </div>
    </section>
  );
}

export function getMetadata(lang: Lang): StyleMetadata {
  return {
    id: "kitchen-prep-station",
    band: "balanced-hybrid",
    name: lang === "zh" ? "厨房备料台" : "Kitchen Prep Station",
    theme: lang === "zh" ? "从原始笔记到干净简报" : "Raw Notes to Clean Brief",
    densityLabel: lang === "zh" ? "温暖流程" : "Warm process",
    heroScene: 4,
    colors: {
      bg: "#f7dfb8",
      ink: "#322313",
      panel: "#fff2d8",
    },
    typography: {
      header: "Nunito 800",
      body: "Nunito 500",
    },
    tags: ["balanced", "warm", "process", "kitchen", "tactile", "motion"],
    fonts: ["Nunito", "cjk:Noto Sans SC"],
    scenes: SCENE_IDS.map((sceneId) => {
      const copy = getSceneCopy(sceneId, lang);
      return {
        id: sceneId,
        title: copy.nav,
        beats: copy.beats.map((beatCopy, index) => ({
          id: index,
          action: beatCopy.action,
          title: beatCopy.title,
          body: beatCopy.body,
        })),
      };
    }),
  };
}

export default function RawNotesCleanBriefV2({
  scene,
  beat,
  language,
  isThumbnail,
  reducedMotion,
  onNavigate,
}: BespokeStyleProps) {
  useKitchenFonts();

  const activeScene = clampScene(scene);
  const activeCopy = getSceneCopy(activeScene, language);
  const activeBeat = clampBeat(beat, activeCopy);
  const motionOff = reducedMotion || isThumbnail;

  return (
    <div
      className={styles.root}
      data-motion-off={motionOff ? "true" : undefined}
      data-thumbnail={isThumbnail ? "true" : undefined}
    >
      <div className={styles.counterGlow} aria-hidden="true" />
      <div className={styles.herbSprig} aria-hidden="true" />

      <SpatialSceneTrack
        scene={activeScene}
        beat={activeBeat}
        transitionKind="fade"
        transitionMap={TRANSITION_MAP}
        transitionDurationMs={720}
        reducedMotion={motionOff}
        beatLayoutModes={BEAT_LAYOUT_MODES}
        className={styles.track}
        renderScene={(sceneId, sceneBeat, isActive) => (
          <ScenePanel
            sceneId={sceneId}
            beat={sceneBeat}
            language={language}
            motionOff={motionOff}
            isActive={isActive}
          />
        )}
      />

      {!isThumbnail && (
        <RecipeMagnets
          language={language}
          scene={activeScene}
          onNavigate={onNavigate}
        />
      )}
    </div>
  );
}

export const rawNotesCleanBriefTopic = defineStyleTopic({
  id: "clean-brief",
  topic: {
    en: "Clean Brief",
    zh: "清爽简报",
  },
  model: "GPT-5.5",
  component: RawNotesCleanBriefV2,
  getMetadata,
});

import type { CSSProperties } from "react";
import type { BespokeStyleProps, StyleMetadata } from "../types";
import { useFLIP } from "../hooks/useFLIP";
import SpatialSceneTrack, {
  type BeatLayoutMode,
  type SceneTransitionMap,
} from "./SpatialSceneTrack";
import { defineStyleVersion } from "./version";
import styles from "./30-shipping-hard-thing-v2.module.css";

type Language = "en" | "zh";
type SceneId = 1 | 2 | 3 | 4 | 5;
type BlockTone = "paper" | "accent" | "ink";

interface BulletinBlock {
  label: string;
  body: string;
  reveal: number;
  tone?: BlockTone;
  value?: string;
}

interface SceneCopy {
  eyebrow: string;
  tag: string;
  headline: string;
  body: string;
  footnote: string;
  blocks: BulletinBlock[];
}

const SCENE_IDS = [1, 2, 3, 4, 5] as const;
const TRACK_SCENE_IDS = [...SCENE_IDS];

const BEAT_COUNTS: Record<SceneId, number> = {
  1: 3,
  2: 4,
  3: 4,
  4: 3,
  5: 4,
};

const BEAT_LAYOUT_MODES: Record<SceneId, BeatLayoutMode> = {
  1: "motion",
  2: "motion",
  3: "motion",
  4: "motion",
  5: "motion",
};

const TRANSITION_MAP = {
  "1->2": "hard-cut",
  "2->3": "slide-x",
  "3->4": "wipe",
  "4->5": "glitch",
} satisfies SceneTransitionMap;

const COPY: Record<SceneId, Record<Language, SceneCopy>> = {
  1: {
    en: {
      eyebrow: "Taped thesis",
      tag: "No soft launch",
      headline: "Ship the hard thing",
      body: "The hard thing is not the big idea. It is the uncomfortable edge where the promise meets a real user.",
      footnote: "Bias to shipping. Keep the scar visible.",
      blocks: [
        {
          label: "Thesis",
          body: "Progress starts when the risky part is exposed.",
          reveal: 0,
          tone: "accent",
        },
        {
          label: "Pressure",
          body: "If it can only survive in rehearsal, it is not ready.",
          reveal: 1,
        },
        {
          label: "Move",
          body: "Ship the narrow edge, then widen from evidence.",
          reveal: 2,
          tone: "ink",
        },
      ],
    },
    zh: {
      eyebrow: "胶带论点",
      tag: "不做软启动",
      headline: "把难的东西发出去",
      body: "难点不是宏大的想法，而是承诺接触真实用户时最别扭、最容易露馅的那一边。",
      footnote: "偏向发货。保留伤痕。",
      blocks: [
        {
          label: "论点",
          body: "进展从暴露风险开始。",
          reveal: 0,
          tone: "accent",
        },
        {
          label: "压力",
          body: "如果它只能活在彩排里，就还没准备好。",
          reveal: 1,
        },
        {
          label: "动作",
          body: "先发最窄的边，再用证据扩大。",
          reveal: 2,
          tone: "ink",
        },
      ],
    },
  },
  2: {
    en: {
      eyebrow: "Blocker",
      tag: "Name the drag",
      headline: "The blocker is polite fear",
      body: "It arrives dressed as quality control, extra review, and one more internal pass.",
      footnote: "The blocker loses power when it gets a name.",
      blocks: [
        {
          label: "Signal",
          body: "Nobody can define the last missing piece.",
          reveal: 0,
        },
        {
          label: "Disguise",
          body: "Preparation keeps replacing contact.",
          reveal: 1,
          tone: "accent",
        },
        {
          label: "Cost",
          body: "Every hidden week makes the release less honest.",
          reveal: 2,
        },
        {
          label: "Counter",
          body: "Cut scope, not truth.",
          reveal: 3,
          tone: "ink",
        },
      ],
    },
    zh: {
      eyebrow: "阻塞点",
      tag: "把阻力说破",
      headline: "阻塞点是礼貌的害怕",
      body: "它通常穿着质量控制、再评审一次、内部再过一遍的外衣出现。",
      footnote: "阻塞点被命名之后，威力会下降。",
      blocks: [
        {
          label: "信号",
          body: "没人能说清最后缺的那块是什么。",
          reveal: 0,
        },
        {
          label: "伪装",
          body: "准备工作持续替代真实接触。",
          reveal: 1,
          tone: "accent",
        },
        {
          label: "代价",
          body: "每藏一周，发布就少一分诚实。",
          reveal: 2,
        },
        {
          label: "反制",
          body: "砍范围，不砍真实。",
          reveal: 3,
          tone: "ink",
        },
      ],
    },
  },
  3: {
    en: {
      eyebrow: "Blunt plan",
      tag: "Three moves",
      headline: "Make the plan hard to hide from",
      body: "No theater. One edge, one owner, one real exposure, one review loop.",
      footnote: "A blunt plan is easier to trust than a beautiful fog.",
      blocks: [
        {
          label: "01",
          body: "Define the smallest honest edge.",
          reveal: 0,
          tone: "accent",
        },
        {
          label: "02",
          body: "Put one accountable owner on it.",
          reveal: 1,
        },
        {
          label: "03",
          body: "Ship it to real users before it feels complete.",
          reveal: 2,
        },
        {
          label: "04",
          body: "Read evidence every day until the next cut is obvious.",
          reveal: 3,
          tone: "ink",
        },
      ],
    },
    zh: {
      eyebrow: "直白计划",
      tag: "三步推进",
      headline: "让计划无法躲起来",
      body: "不要剧场感。一个边界、一个负责人、一次真实暴露、一个复盘循环。",
      footnote: "直白的计划，比漂亮的雾更值得信任。",
      blocks: [
        {
          label: "01",
          body: "定义最小但诚实的发布边界。",
          reveal: 0,
          tone: "accent",
        },
        {
          label: "02",
          body: "只放一个真正负责的人。",
          reveal: 1,
        },
        {
          label: "03",
          body: "在它还不完整时给真实用户使用。",
          reveal: 2,
        },
        {
          label: "04",
          body: "每天读证据，直到下一刀变得明显。",
          reveal: 3,
          tone: "ink",
        },
      ],
    },
  },
  4: {
    en: {
      eyebrow: "Evidence",
      tag: "Proof beats taste",
      headline: "Let usage argue",
      body: "Evidence is not decoration. It is the wall that stops opinion from driving the whole release.",
      footnote: "The next version is hidden inside the first contact.",
      blocks: [
        {
          label: "Observed",
          body: "Users found the hard edge faster than the team did.",
          reveal: 0,
          value: "18m",
        },
        {
          label: "Changed",
          body: "The plan lost two nice-to-have branches.",
          reveal: 1,
          value: "-2",
          tone: "accent",
        },
        {
          label: "Kept",
          body: "The risky core survived contact.",
          reveal: 2,
          value: "core",
          tone: "ink",
        },
      ],
    },
    zh: {
      eyebrow: "证据",
      tag: "证据压过品味",
      headline: "让使用情况来争论",
      body: "证据不是装饰。它是一堵墙，阻止意见独自开完整个发布。",
      footnote: "下一版藏在第一次真实接触里。",
      blocks: [
        {
          label: "观察",
          body: "用户比团队更快找到难点边界。",
          reveal: 0,
          value: "18分",
        },
        {
          label: "改变",
          body: "计划砍掉两个好看但不必要的分支。",
          reveal: 1,
          value: "-2",
          tone: "accent",
        },
        {
          label: "保留",
          body: "高风险核心经受住了接触。",
          reveal: 2,
          value: "核心",
          tone: "ink",
        },
      ],
    },
  },
  5: {
    en: {
      eyebrow: "Poster wall",
      tag: "Make it public",
      headline: "The wall remembers the rules",
      body: "A shipped hard thing leaves a wall of proof: cuts made, risks faced, decisions earned.",
      footnote: "Final poster: ship what teaches.",
      blocks: [
        {
          label: "Rule",
          body: "No invisible bravery.",
          reveal: 0,
          tone: "accent",
        },
        {
          label: "Rule",
          body: "The user gets a vote.",
          reveal: 1,
        },
        {
          label: "Rule",
          body: "Scope is movable. Truth is not.",
          reveal: 2,
        },
        {
          label: "Stamp",
          body: "Shipped, read, cut again.",
          reveal: 3,
          tone: "ink",
        },
      ],
    },
    zh: {
      eyebrow: "海报墙",
      tag: "让它公开",
      headline: "墙会记住规则",
      body: "一个真正发出去的难题，会留下证据墙：做过的取舍、面对的风险、挣来的决定。",
      footnote: "最终海报：发布能教会你的东西。",
      blocks: [
        {
          label: "规则",
          body: "不要隐形的勇敢。",
          reveal: 0,
          tone: "accent",
        },
        {
          label: "规则",
          body: "用户必须有投票权。",
          reveal: 1,
        },
        {
          label: "规则",
          body: "范围可以移动，真实不能。",
          reveal: 2,
        },
        {
          label: "印章",
          body: "已发布，已阅读，再切一刀。",
          reveal: 3,
          tone: "ink",
        },
      ],
    },
  },
};

const METADATA_SCENES: Record<Language, StyleMetadata["scenes"]> = {
  en: [
    {
      id: 1,
      title: "Taped thesis",
      beats: [
        {
          id: 0,
          action: "Tape the thesis to the wall",
          title: "Ship the hard thing",
          body: "Progress starts when the risky edge is exposed.",
        },
        {
          id: 1,
          action: "Add the pressure note",
          title: "If it only survives rehearsal, it is not ready",
          body: "The hidden week is part of the problem.",
        },
        {
          id: 2,
          action: "Stamp the shipping bias",
          title: "Ship narrow, learn wide",
          body: "Use evidence to widen the release.",
        },
      ],
    },
    {
      id: 2,
      title: "Blocker",
      beats: [
        {
          id: 0,
          action: "Expose the blocker",
          title: "The blocker is polite fear",
          body: "The last missing piece cannot be named.",
        },
        {
          id: 1,
          action: "Reveal the disguise",
          title: "Preparation replaces contact",
          body: "More internal review stops being quality work.",
        },
        {
          id: 2,
          action: "Show the cost",
          title: "Hidden weeks make the release less honest",
          body: "Delay compounds uncertainty.",
        },
        {
          id: 3,
          action: "Choose the counter-move",
          title: "Cut scope, not truth",
          body: "Keep the hard edge visible.",
        },
      ],
    },
    {
      id: 3,
      title: "Blunt plan",
      beats: [
        {
          id: 0,
          action: "Set the smallest honest edge",
          title: "Define the edge",
          body: "The plan starts with a boundary that can ship.",
        },
        {
          id: 1,
          action: "Assign one accountable owner",
          title: "Name the owner",
          body: "No committee can hide the next move.",
        },
        {
          id: 2,
          action: "Expose it to real users",
          title: "Ship before complete",
          body: "Contact arrives before polish.",
        },
        {
          id: 3,
          action: "Lock the evidence loop",
          title: "Read daily and cut again",
          body: "The next move comes from usage.",
        },
      ],
    },
    {
      id: 4,
      title: "Evidence",
      beats: [
        {
          id: 0,
          action: "Open the evidence board",
          title: "Let usage argue",
          body: "Users find the hard edge fast.",
        },
        {
          id: 1,
          action: "Compare promise to usage",
          title: "Opinion loses two branches",
          body: "Evidence trims the plan.",
        },
        {
          id: 2,
          action: "Extract the decision",
          title: "The risky core survives contact",
          body: "The next version is now obvious.",
        },
      ],
    },
    {
      id: 5,
      title: "Poster wall",
      beats: [
        {
          id: 0,
          action: "Pin the first rule",
          title: "No invisible bravery",
          body: "The release needs visible evidence.",
        },
        {
          id: 1,
          action: "Pin the user rule",
          title: "The user gets a vote",
          body: "Feedback becomes part of the room.",
        },
        {
          id: 2,
          action: "Pin the scope rule",
          title: "Scope moves, truth does not",
          body: "The plan can shrink without hiding.",
        },
        {
          id: 3,
          action: "Stamp the final poster",
          title: "Ship what teaches",
          body: "Read it, cut it, ship again.",
        },
      ],
    },
  ],
  zh: [
    {
      id: 1,
      title: "胶带论点",
      beats: [
        {
          id: 0,
          action: "把论点贴到墙上",
          title: "把难的东西发出去",
          body: "进展从暴露风险边界开始。",
        },
        {
          id: 1,
          action: "加上压力便签",
          title: "只能活在彩排里，就还没准备好",
          body: "被藏起来的一周，也是问题的一部分。",
        },
        {
          id: 2,
          action: "盖上发布偏向印章",
          title: "窄发，宽学",
          body: "用证据扩大发布面。",
        },
      ],
    },
    {
      id: 2,
      title: "阻塞点",
      beats: [
        {
          id: 0,
          action: "暴露阻塞点",
          title: "阻塞点是礼貌的害怕",
          body: "最后缺的那块没人说得清。",
        },
        {
          id: 1,
          action: "揭开伪装",
          title: "准备替代了接触",
          body: "更多内部评审不再等于质量工作。",
        },
        {
          id: 2,
          action: "展示代价",
          title: "被藏起的一周让发布更不诚实",
          body: "延迟会复利不确定性。",
        },
        {
          id: 3,
          action: "选择反制动作",
          title: "砍范围，不砍真实",
          body: "让最难的边界保持可见。",
        },
      ],
    },
    {
      id: 3,
      title: "直白计划",
      beats: [
        {
          id: 0,
          action: "确定最小诚实边界",
          title: "定义边界",
          body: "计划从一个能发出去的边界开始。",
        },
        {
          id: 1,
          action: "指定唯一负责人",
          title: "说出负责人",
          body: "委员会不能藏住下一步。",
        },
        {
          id: 2,
          action: "给真实用户使用",
          title: "未完整时先发布",
          body: "接触先于打磨。",
        },
        {
          id: 3,
          action: "锁定证据循环",
          title: "每天读，再切一刀",
          body: "下一步来自使用情况。",
        },
      ],
    },
    {
      id: 4,
      title: "证据",
      beats: [
        {
          id: 0,
          action: "打开证据板",
          title: "让使用情况来争论",
          body: "用户会很快找到难点边界。",
        },
        {
          id: 1,
          action: "比较承诺与使用",
          title: "意见失去两个分支",
          body: "证据会修剪计划。",
        },
        {
          id: 2,
          action: "提取决定",
          title: "高风险核心经受住接触",
          body: "下一版已经明显。",
        },
      ],
    },
    {
      id: 5,
      title: "海报墙",
      beats: [
        {
          id: 0,
          action: "钉上第一条规则",
          title: "不要隐形的勇敢",
          body: "发布需要可见证据。",
        },
        {
          id: 1,
          action: "钉上用户规则",
          title: "用户必须有投票权",
          body: "反馈成为房间的一部分。",
        },
        {
          id: 2,
          action: "钉上范围规则",
          title: "范围可以移动，真实不能",
          body: "计划可以缩小，但不能隐藏。",
        },
        {
          id: 3,
          action: "盖上最终海报印章",
          title: "发布能教会你的东西",
          body: "读它，切它，再发一次。",
        },
      ],
    },
  ],
};

function normalizeScene(scene: number): SceneId {
  return SCENE_IDS.includes(scene as SceneId) ? (scene as SceneId) : 1;
}

function normalizeBeat(scene: SceneId, beat: number): number {
  return Math.min(Math.max(beat, 0), BEAT_COUNTS[scene] - 1);
}

function visibleBlocks(scene: SceneId, language: Language, beat: number) {
  return COPY[scene][language].blocks.filter((block) => block.reveal <= beat);
}

function blockClassName(tone: BlockTone | undefined): string {
  return [
    styles.block,
    tone === "accent" ? styles.blockAccent : "",
    tone === "ink" ? styles.blockInk : "",
  ]
    .filter(Boolean)
    .join(" ");
}

function SceneHeader({
  scene,
  copy,
}: {
  scene: SceneId;
  copy: SceneCopy;
}) {
  return (
    <header className={styles.header} data-beat-layout-item="true">
      <span className={styles.sceneNumber}>0{scene}</span>
      <span className={styles.eyebrow}>{copy.eyebrow}</span>
      <span className={styles.tag}>{copy.tag}</span>
    </header>
  );
}

function BeatMarkers({ count, beat }: { count: number; beat: number }) {
  return (
    <div className={styles.beatMarkers} aria-hidden="true">
      {Array.from({ length: count }).map((_, index) => (
        <span
          key={index}
          className={[
            styles.beatMarker,
            index <= beat ? styles.beatMarkerOn : "",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {index + 1}
        </span>
      ))}
    </div>
  );
}

function BlockList({
  scene,
  language,
  beat,
}: {
  scene: SceneId;
  language: Language;
  beat: number;
}) {
  return (
    <div className={styles.blockList}>
      {visibleBlocks(scene, language, beat).map((block) => (
        <article
          key={`${block.label}-${block.body}`}
          className={blockClassName(block.tone)}
          data-beat-layout-item="true"
        >
          <span className={styles.blockLabel}>{block.label}</span>
          {block.value ? <strong className={styles.blockValue}>{block.value}</strong> : null}
          <p>{block.body}</p>
        </article>
      ))}
    </div>
  );
}

function SceneOne({
  copy,
  language,
  beat,
}: {
  copy: SceneCopy;
  language: Language;
  beat: number;
}) {
  return (
    <div className={styles.sceneOneLayout}>
      <section className={styles.thesisPoster} data-beat-layout-item="true">
        <span className={styles.tape} />
        <h1>{copy.headline}</h1>
        <p>{copy.body}</p>
      </section>
      <BlockList scene={1} language={language} beat={beat} />
      <aside className={styles.footerStrip} data-beat-layout-item="true">
        {copy.footnote}
      </aside>
    </div>
  );
}

function SceneTwo({
  copy,
  language,
  beat,
}: {
  copy: SceneCopy;
  language: Language;
  beat: number;
}) {
  return (
    <div className={styles.sceneTwoLayout}>
      <section className={styles.blockerPanel} data-beat-layout-item="true">
        <span className={styles.warningLabel}>Blocker</span>
        <h1>{copy.headline}</h1>
        <p>{copy.body}</p>
      </section>
      <BlockList scene={2} language={language} beat={beat} />
      <aside className={styles.footerStrip} data-beat-layout-item="true">
        {copy.footnote}
      </aside>
    </div>
  );
}

function SceneThree({
  copy,
  language,
  beat,
}: {
  copy: SceneCopy;
  language: Language;
  beat: number;
}) {
  const blocks = visibleBlocks(3, language, beat);

  return (
    <div className={styles.sceneThreeLayout}>
      <section className={styles.planHeader} data-beat-layout-item="true">
        <h1>{copy.headline}</h1>
        <p>{copy.body}</p>
      </section>
      <ol className={styles.planList}>
        {blocks.map((block) => (
          <li
            key={block.label}
            className={blockClassName(block.tone)}
            data-beat-layout-item="true"
          >
            <span className={styles.planIndex}>{block.label}</span>
            <p>{block.body}</p>
          </li>
        ))}
      </ol>
      <aside className={styles.footerStrip} data-beat-layout-item="true">
        {copy.footnote}
      </aside>
    </div>
  );
}

function SceneFour({
  copy,
  language,
  beat,
}: {
  copy: SceneCopy;
  language: Language;
  beat: number;
}) {
  const bars = [
    { label: "prep", height: "17cqh", reveal: 0 },
    { label: "contact", height: "28cqh", reveal: 1 },
    { label: "signal", height: "41cqh", reveal: 2 },
  ];

  return (
    <div className={styles.sceneFourLayout}>
      <section className={styles.evidenceLead} data-beat-layout-item="true">
        <h1>{copy.headline}</h1>
        <p>{copy.body}</p>
      </section>
      <div className={styles.chartPanel} data-beat-layout-item="true">
        <div className={styles.chartAxis} />
        {bars.map((bar) => (
          <div
            key={bar.label}
            className={[
              styles.chartBar,
              bar.reveal <= beat ? styles.chartBarOn : "",
              bar.label === "signal" ? styles.chartBarAccent : "",
            ]
              .filter(Boolean)
              .join(" ")}
            style={{ "--bar-height": bar.height } as CSSProperties}
          >
            <span>{bar.label}</span>
          </div>
        ))}
      </div>
      <BlockList scene={4} language={language} beat={beat} />
      <aside className={styles.footerStrip} data-beat-layout-item="true">
        {copy.footnote}
      </aside>
    </div>
  );
}

function SceneFive({
  copy,
  language,
  beat,
}: {
  copy: SceneCopy;
  language: Language;
  beat: number;
}) {
  const blocks = visibleBlocks(5, language, beat);

  return (
    <div className={styles.sceneFiveLayout}>
      <section className={styles.wallLead} data-beat-layout-item="true">
        <h1>{copy.headline}</h1>
        <p>{copy.body}</p>
      </section>
      <div className={styles.posterWall}>
        {blocks.map((block, index) => (
          <article
            key={`${block.label}-${block.body}`}
            className={[
              styles.posterCard,
              block.tone === "accent" ? styles.posterAccent : "",
              block.tone === "ink" ? styles.posterInk : "",
            ]
              .filter(Boolean)
              .join(" ")}
            data-beat-layout-item="true"
            style={{ "--poster-tilt": `${index % 2 === 0 ? -1 : 1.2}deg` } as CSSProperties}
          >
            <span>{block.label}</span>
            <p>{block.body}</p>
          </article>
        ))}
      </div>
      <aside className={styles.footerStrip} data-beat-layout-item="true">
        {copy.footnote}
      </aside>
    </div>
  );
}

function ScenePanel({
  scene,
  beat,
  language,
  motionOff,
  isActive,
}: {
  scene: SceneId;
  beat: number;
  language: Language;
  motionOff: boolean;
  isActive: boolean;
}) {
  const safeBeat = normalizeBeat(scene, beat);
  const copy = COPY[scene][language];
  const { ref } = useFLIP<HTMLElement>({
    watch: [scene, safeBeat, language],
    disabled: motionOff || !isActive,
    duration: 180,
    easing: "steps(2, end)",
    selector: '[data-beat-layout-item="true"]',
  });

  return (
    <section
      ref={ref}
      className={[
        styles.scene,
        styles[`scene${scene}` as keyof typeof styles],
        isActive ? styles.sceneActive : styles.sceneIdle,
      ]
        .filter(Boolean)
        .join(" ")}
      data-scene={scene}
      data-beat={safeBeat}
      data-beat-layout-container="true"
      data-beat-layout-mode="motion"
    >
      <SceneHeader scene={scene} copy={copy} />
      {scene === 1 ? <SceneOne copy={copy} language={language} beat={safeBeat} /> : null}
      {scene === 2 ? <SceneTwo copy={copy} language={language} beat={safeBeat} /> : null}
      {scene === 3 ? <SceneThree copy={copy} language={language} beat={safeBeat} /> : null}
      {scene === 4 ? <SceneFour copy={copy} language={language} beat={safeBeat} /> : null}
      {scene === 5 ? <SceneFive copy={copy} language={language} beat={safeBeat} /> : null}
      <BeatMarkers count={BEAT_COUNTS[scene]} beat={safeBeat} />
    </section>
  );
}

function ConcreteTabNav({
  scene,
  onNavigate,
}: {
  scene: SceneId;
  onNavigate?: (scene: number, beat: number) => void;
}) {
  return (
    <nav className={styles.nav} aria-label="Scene navigation">
      {SCENE_IDS.map((sceneId) => (
        <button
          key={sceneId}
          className={[
            styles.navTab,
            sceneId === scene ? styles.navTabActive : "",
          ]
            .filter(Boolean)
            .join(" ")}
          type="button"
          aria-label={`Go to scene ${sceneId}`}
          aria-current={sceneId === scene ? "step" : undefined}
          onClick={() => onNavigate?.(sceneId, 0)}
        >
          <span>0{sceneId}</span>
        </button>
      ))}
    </nav>
  );
}

export function getMetadata(lang: Language): StyleMetadata {
  return {
    id: "30",
    band: "craft-cultural",
    name: lang === "zh" ? "新野兽派公告" : "Neo-Brutalist Bulletin",
    theme:
      lang === "zh"
        ? "把难的东西发出去"
        : "Shipping the Hard Thing",
    densityLabel: lang === "zh" ? "密集公告" : "Dense bulletin",
    heroScene: 1,
    colors: {
      bg: "#f5f0df",
      ink: "#050505",
      panel: "#c8ff17",
    },
    typography: {
      header: "Impact 900",
      body: "Arial Narrow 700",
    },
    tags: [
      "neo-brutalist",
      "bulletin",
      "poster",
      "dense",
      "craft",
      "motion",
    ],
    fonts: ["Impact", "Arial Narrow", "cjk:Noto Sans SC"],
    scenes: METADATA_SCENES[lang],
  };
}

export default function ShippingHardThingV2({
  scene,
  beat,
  language,
  isThumbnail,
  reducedMotion,
  onNavigate,
}: BespokeStyleProps) {
  const safeScene = normalizeScene(scene);
  const motionOff = reducedMotion || isThumbnail;

  return (
    <div
      className={[styles.root, motionOff ? styles.motionOff : ""]
        .filter(Boolean)
        .join(" ")}
    >
      <SpatialSceneTrack
        scene={safeScene}
        beat={normalizeBeat(safeScene, beat)}
        sceneIds={TRACK_SCENE_IDS}
        transitionKind="hard-cut"
        transitionMap={TRANSITION_MAP}
        transitionDurationMs={420}
        reducedMotion={motionOff}
        beatLayoutModes={BEAT_LAYOUT_MODES}
        className={styles.track}
        renderScene={(renderedScene, renderedBeat, isActive) => {
          const renderedSceneId = normalizeScene(renderedScene);
          return (
            <ScenePanel
              scene={renderedSceneId}
              beat={renderedBeat}
              language={language}
              motionOff={motionOff}
              isActive={isActive}
            />
          );
        }}
      />
      {isThumbnail ? null : (
        <ConcreteTabNav scene={safeScene} onNavigate={onNavigate} />
      )}
    </div>
  );
}

export const shippingHardThingV2Version = defineStyleVersion({
  id: "v2",
  topic: "Shipping the Hard Thing",
  model: "GPT-5",
  component: ShippingHardThingV2,
  getMetadata,
});

import { useEffect } from "react";
import type { CSSProperties } from "react";
import { useFLIP } from "../hooks/useFLIP";
import type { BespokeStyleProps, StyleMetadata } from "../types";
import SpatialSceneTrack from "./SpatialSceneTrack";
import { defineStyleTopic } from "./topic";
import styles from "./23-community-prints-itself.module.css";

type Lang = "en" | "zh";
type RisoStyle = CSSProperties & Record<`--${string}`, string>;

interface BeatCopy {
  action: string;
  title: string;
  body: string;
}

interface CardCopy {
  index: string;
  title: string;
  body: string;
  beat: number;
  tilt: string;
}

interface SceneCopy {
  kicker: string;
  title: string;
  body: string;
  note: string;
  caption: string;
  stamp: string;
  stampBody: string;
  cards: CardCopy[];
  beats: BeatCopy[];
}

interface SceneDefinition {
  id: number;
  variant: "cover" | "cutList" | "spread" | "overprint" | "foldout";
  copy: Record<Lang, SceneCopy>;
}

const TRANSITION_MAP = {
  "1->2": "glitch",
  "2->3": "slide-y",
  "3->4": "wipe",
  "4->5": "hard-cut",
} as const;

const BEAT_LAYOUT_MODES = {
  1: "motion",
  2: "motion",
  3: "motion",
  4: "motion",
  5: "motion",
} as const;

const SCENES: SceneDefinition[] = [
  {
    id: 1,
    variant: "cover",
    copy: {
      en: {
        kicker: "Issue 00 / table copy",
        title: "A Community Prints Itself",
        body: "The first run is not a campaign. It is a table, a drum, and everyone leaving a mark.",
        note: "pulled by many hands",
        caption: "cover: title slips out of register",
        stamp: "Local press",
        stampBody: "Fold, staple, pass it on before the ink fully dries.",
        cards: [
          {
            index: "A",
            title: "Open table",
            body: "A public surface replaces the perfect announcement.",
            beat: 1,
            tilt: "-2deg",
          },
          {
            index: "B",
            title: "Shared run",
            body: "Every contributor gets a pass through the drum.",
            beat: 2,
            tilt: "2deg",
          },
        ],
        beats: [
          {
            action: "Cover title lands with misregistered ink",
            title: "Cover pull",
            body: "The zine declares the table before the process appears.",
          },
          {
            action: "Workshop promise is added",
            title: "Open table",
            body: "A public making surface enters the cover.",
          },
          {
            action: "Shared edition note appears",
            title: "Shared run",
            body: "The cover becomes an invitation to print together.",
          },
        ],
      },
      zh: {
        kicker: "第 00 期 / 桌边样张",
        title: "一个社群把自己印出来",
        body: "第一版不是宣传。它是一张桌子、一台滚筒，以及每个人留下的痕迹。",
        note: "很多双手一起拉印",
        caption: "封面：标题故意套印偏移",
        stamp: "本地印台",
        stampBody: "折页，订钉，在油墨完全干透前传出去。",
        cards: [
          {
            index: "A",
            title: "开放桌面",
            body: "公共制作面取代完美发布稿。",
            beat: 1,
            tilt: "-2deg",
          },
          {
            index: "B",
            title: "共同印次",
            body: "每位参与者都让滚筒经过一次。",
            beat: 2,
            tilt: "2deg",
          },
        ],
        beats: [
          {
            action: "封面标题以错位套印落下",
            title: "封面拉印",
            body: "小志先宣告这张桌子，再展开过程。",
          },
          {
            action: "加入工作坊承诺",
            title: "开放桌面",
            body: "公共制作面进入封面。",
          },
          {
            action: "出现共同印次注记",
            title: "共同印次",
            body: "封面变成一起印刷的邀请。",
          },
        ],
      },
    },
  },
  {
    id: 2,
    variant: "cutList",
    copy: {
      en: {
        kicker: "Cut list / before the drum",
        title: "What the table needs",
        body: "The print run starts as a pile of ordinary parts, each one claimed by someone in the room.",
        note: "measure twice, cut once, overprint anyway",
        caption: "cut list: the supply pile becomes a roster",
        stamp: "Cut list",
        stampBody: "Nothing arrives finished. The parts make authors visible.",
        cards: [
          {
            index: "01",
            title: "Paper",
            body: "Warm stock with tooth, ready to take imperfect pressure.",
            beat: 0,
            tilt: "-2deg",
          },
          {
            index: "02",
            title: "Ink",
            body: "Two spot colors: one for structure, one for emphasis.",
            beat: 0,
            tilt: "1.5deg",
          },
          {
            index: "03",
            title: "Names",
            body: "Bylines stay small, but nobody disappears into the edition.",
            beat: 1,
            tilt: "2.5deg",
          },
          {
            index: "04",
            title: "Routes",
            body: "Stacks leave by bicycle, notice board, classroom, and stoop.",
            beat: 2,
            tilt: "-1.5deg",
          },
        ],
        beats: [
          {
            action: "Paper and ink cards appear",
            title: "Raw stock",
            body: "The material constraint is established first.",
          },
          {
            action: "Contributor names join the cut list",
            title: "Names added",
            body: "The inventory becomes social.",
          },
          {
            action: "Distribution routes complete the list",
            title: "Routes added",
            body: "The zine is designed to travel.",
          },
        ],
      },
      zh: {
        kicker: "裁切清单 / 上机之前",
        title: "这张桌子需要什么",
        body: "印次从一堆普通部件开始，屋里每个人都认领其中一件。",
        note: "量两次，裁一次，仍然欢迎套印偏差",
        caption: "裁切清单：物料堆变成成员名单",
        stamp: "裁切清单",
        stampBody: "没有东西一开始就是成品。部件让作者显形。",
        cards: [
          {
            index: "01",
            title: "纸",
            body: "带纤维感的暖色纸，能接住不完美的压力。",
            beat: 0,
            tilt: "-2deg",
          },
          {
            index: "02",
            title: "油墨",
            body: "两种专色：一种管结构，一种管强调。",
            beat: 0,
            tilt: "1.5deg",
          },
          {
            index: "03",
            title: "姓名",
            body: "署名可以很小，但没人被版本吞掉。",
            beat: 1,
            tilt: "2.5deg",
          },
          {
            index: "04",
            title: "去向",
            body: "纸堆流向单车、公告栏、教室和门廊。",
            beat: 2,
            tilt: "-1.5deg",
          },
        ],
        beats: [
          {
            action: "纸张和油墨卡片出现",
            title: "原始物料",
            body: "先建立材料限制。",
          },
          {
            action: "参与者姓名进入清单",
            title: "加入姓名",
            body: "库存开始变成关系。",
          },
          {
            action: "流通路径补完清单",
            title: "加入去向",
            body: "小志从一开始就被设计成会流动。",
          },
        ],
      },
    },
  },
  {
    id: 3,
    variant: "spread",
    copy: {
      en: {
        kicker: "Center spread / two pages open",
        title: "The edition learns in public",
        body: "Left page records the first pass. Right page answers with what changed after people touched it.",
        note: "the margin keeps talking back",
        caption: "spread: two pages find a shared middle",
        stamp: "Open spread",
        stampBody: "A zine is not read alone; it is annotated while passing hands.",
        cards: [
          {
            index: "L",
            title: "First pass",
            body: "A neighbor circles the missing line and writes it back in.",
            beat: 0,
            tilt: "-1deg",
          },
          {
            index: "R",
            title: "Second pass",
            body: "The correction is not hidden; it becomes the next layer.",
            beat: 1,
            tilt: "1deg",
          },
          {
            index: "M",
            title: "Margin chorus",
            body: "Small notes collect until the issue has a voice wider than its editor.",
            beat: 2,
            tilt: "-2deg",
          },
        ],
        beats: [
          {
            action: "Left page opens with first-pass notes",
            title: "Left page",
            body: "The edition begins as a visible draft.",
          },
          {
            action: "Right page answers with corrections",
            title: "Right page",
            body: "Revision becomes content instead of cleanup.",
          },
          {
            action: "Margin chorus completes the spread",
            title: "Margin chorus",
            body: "The spread becomes collective memory.",
          },
        ],
      },
      zh: {
        kicker: "中间跨页 / 两页摊开",
        title: "这个版本在公开处学习",
        body: "左页记录第一次拉印。右页回应人们触摸之后发生的变化。",
        note: "页边一直在回话",
        caption: "跨页：两页找到共同中缝",
        stamp: "展开跨页",
        stampBody: "小志不是独自阅读的；它在传手时被批注。",
        cards: [
          {
            index: "L",
            title: "第一遍",
            body: "邻居圈出缺失的一行，并把它写回来。",
            beat: 0,
            tilt: "-1deg",
          },
          {
            index: "R",
            title: "第二遍",
            body: "修正不被藏起，而是成为下一层油墨。",
            beat: 1,
            tilt: "1deg",
          },
          {
            index: "M",
            title: "页边合唱",
            body: "小字条越积越多，直到这期拥有比编辑更宽的声音。",
            beat: 2,
            tilt: "-2deg",
          },
        ],
        beats: [
          {
            action: "左页带着第一遍注记打开",
            title: "左页",
            body: "版本先以可见草稿开始。",
          },
          {
            action: "右页用修正回应",
            title: "右页",
            body: "修订成为内容，而不是清理。",
          },
          {
            action: "页边合唱补完跨页",
            title: "页边合唱",
            body: "跨页成为集体记忆。",
          },
        ],
      },
    },
  },
  {
    id: 4,
    variant: "overprint",
    copy: {
      en: {
        kicker: "Overprint / layers refuse to line up",
        title: "Where colors meet, ownership blurs",
        body: "Cyan carries the route, red carries the call, and the muddy middle is where the community recognizes itself.",
        note: "registration is a negotiation",
        caption: "overprint: ink layers make a shared claim",
        stamp: "Overprint",
        stampBody: "Misalignment is not an error here. It is proof of more than one pass.",
        cards: [
          {
            index: "C",
            title: "Cyan route",
            body: "The first layer maps who carries the stack.",
            beat: 0,
            tilt: "-3deg",
          },
          {
            index: "R",
            title: "Red call",
            body: "The second layer names what people are invited to change.",
            beat: 1,
            tilt: "2deg",
          },
          {
            index: "M",
            title: "Muddy middle",
            body: "The overlap is where shared authorship becomes visible.",
            beat: 2,
            tilt: "-1deg",
          },
        ],
        beats: [
          {
            action: "Cyan routing layer lands",
            title: "Cyan route",
            body: "Structure prints first.",
          },
          {
            action: "Red invitation layer overprints",
            title: "Red call",
            body: "A second pass changes the reading.",
          },
          {
            action: "Overlap area is named",
            title: "Muddy middle",
            body: "The mixed ink becomes the shared claim.",
          },
        ],
      },
      zh: {
        kicker: "套印 / 图层拒绝完全对齐",
        title: "颜色相遇处，归属变得模糊",
        body: "青色承载路线，红色承载召唤，而浑浊的中间色让社群认出自己。",
        note: "套准是一场协商",
        caption: "套印：油墨层叠出共同声明",
        stamp: "套印",
        stampBody: "错位在这里不是错误。它证明纸张经过了不止一遍。",
        cards: [
          {
            index: "C",
            title: "青色路线",
            body: "第一层标出谁来带走这叠纸。",
            beat: 0,
            tilt: "-3deg",
          },
          {
            index: "R",
            title: "红色召唤",
            body: "第二层写明人们被邀请改变什么。",
            beat: 1,
            tilt: "2deg",
          },
          {
            index: "M",
            title: "浑浊中间",
            body: "重叠处让共同作者身份显形。",
            beat: 2,
            tilt: "-1deg",
          },
        ],
        beats: [
          {
            action: "青色路线层落下",
            title: "青色路线",
            body: "结构先印出来。",
          },
          {
            action: "红色邀请层完成套印",
            title: "红色召唤",
            body: "第二遍改变阅读方式。",
          },
          {
            action: "重叠区域被命名",
            title: "浑浊中间",
            body: "混合油墨成为共同声明。",
          },
        ],
      },
    },
  },
  {
    id: 5,
    variant: "foldout",
    copy: {
      en: {
        kicker: "Fold-out / take-home sheet",
        title: "The issue leaves as a tool",
        body: "A final hard cut turns the zine from object to instruction: print nearby, credit loudly, leave room for the next hand.",
        note: "edition open, never finished",
        caption: "fold-out: take the rule sheet home",
        stamp: "Fold-out",
        stampBody: "The last page does not close the project. It teaches the next table how to start.",
        cards: [
          {
            index: "1",
            title: "Print nearby",
            body: "Keep production close enough for people to interrupt it.",
            beat: 0,
            tilt: "-1deg",
          },
          {
            index: "2",
            title: "Credit loudly",
            body: "Names are infrastructure, not decoration.",
            beat: 1,
            tilt: "1.5deg",
          },
          {
            index: "3",
            title: "Leave blanks",
            body: "Every issue reserves space for the next person to revise.",
            beat: 2,
            tilt: "-2deg",
          },
        ],
        beats: [
          {
            action: "First fold opens with local production rule",
            title: "Print nearby",
            body: "The practice stays close to its people.",
          },
          {
            action: "Second fold opens with credit rule",
            title: "Credit loudly",
            body: "Authorship is printed into the system.",
          },
          {
            action: "Final fold leaves a blank for the next hand",
            title: "Leave blanks",
            body: "The edition remains open.",
          },
        ],
      },
      zh: {
        kicker: "折页 / 可带走的单张",
        title: "这一期离开时变成工具",
        body: "最后一次硬切让小志从物件变成说明：就近印刷，大声署名，把位置留给下一双手。",
        note: "版本开放，永不完稿",
        caption: "折页：把规则单带回去",
        stamp: "折页",
        stampBody: "最后一页不结束项目。它教下一张桌子如何开始。",
        cards: [
          {
            index: "1",
            title: "就近印刷",
            body: "让生产近到人们可以打断它。",
            beat: 0,
            tilt: "-1deg",
          },
          {
            index: "2",
            title: "大声署名",
            body: "姓名是基础设施，不是装饰。",
            beat: 1,
            tilt: "1.5deg",
          },
          {
            index: "3",
            title: "留下空白",
            body: "每一期都为下一个修改者保留位置。",
            beat: 2,
            tilt: "-2deg",
          },
        ],
        beats: [
          {
            action: "第一折打开就近生产规则",
            title: "就近印刷",
            body: "实践留在它的人附近。",
          },
          {
            action: "第二折打开署名规则",
            title: "大声署名",
            body: "作者身份被印进系统。",
          },
          {
            action: "最后一折给下一双手留下空白",
            title: "留下空白",
            body: "版本保持开放。",
          },
        ],
      },
    },
  },
];

const SCENE_LOOKUP = new Map(SCENES.map((scene) => [scene.id, scene]));

function useRisoFonts() {
  useEffect(() => {
    if (typeof document === "undefined") return;
    const id = "style-23-community-prints-itself-v2-fonts";
    if (document.getElementById(id)) return;

    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Caveat:wght@600;700&family=IBM+Plex+Mono:wght@400;500;700&family=Noto+Sans+SC:wght@400;700&display=swap";
    document.head.appendChild(link);
  }, []);
}

function getScene(scene: number): SceneDefinition {
  return SCENE_LOOKUP.get(scene) ?? SCENES[0];
}

function getSafeBeat(scene: SceneDefinition, language: Lang, beat: number): number {
  const maxBeat = scene.copy[language].beats.length - 1;
  return Math.max(0, Math.min(beat, maxBeat));
}

function styleVars(vars: RisoStyle): RisoStyle {
  return vars;
}

function classNames(...names: Array<string | false | undefined>) {
  return names.filter(Boolean).join(" ");
}

function BeatMarks({
  scene,
  beat,
  total,
}: {
  scene: number;
  beat: number;
  total: number;
}) {
  return (
    <div
      className={styles.beatMarks}
      aria-label={`Scene ${scene} beat progress`}
    >
      {Array.from({ length: total }, (_, index) => (
        <span
          key={index}
          className={classNames(
            styles.beatMark,
            index === beat && styles.beatMarkActive,
            index < beat && styles.beatMarkPassed,
          )}
          style={styleVars({ "--tilt": `${index % 2 === 0 ? -2 : 2}deg` })}
        />
      ))}
    </div>
  );
}

function StapleNav({
  activeScene,
  onNavigate,
}: {
  activeScene: number;
  onNavigate?: (scene: number, beat: number) => void;
}) {
  return (
    <nav className={styles.nav} aria-label="Scene navigation">
      {SCENES.map((entry, index) => (
        <button
          key={entry.id}
          type="button"
          className={classNames(
            styles.stapleButton,
            entry.id === activeScene && styles.stapleButtonActive,
          )}
          style={styleVars({ "--tilt": `${index % 2 === 0 ? -5 : 4}deg` })}
          aria-label={`Go to scene ${entry.id}`}
          aria-current={entry.id === activeScene ? "step" : undefined}
          onClick={() => onNavigate?.(entry.id, 0)}
        />
      ))}
    </nav>
  );
}

function Chrome({
  copy,
  scene,
}: {
  copy: SceneCopy;
  scene: number;
}) {
  return (
    <header className={styles.chrome}>
      <div className={styles.issue} data-beat-layout-item="true">
        <span className={styles.issueMark} />
        <span>{copy.kicker}</span>
      </div>
      <div
        className={styles.sceneNumber}
        data-shadow={`0${scene}`}
        data-beat-layout-item="true"
      >
        0{scene}
      </div>
    </header>
  );
}

function CoverScene({
  copy,
  beat,
}: {
  copy: SceneCopy;
  beat: number;
}) {
  return (
    <div className={classNames(styles.canvas, styles.coverCanvas)}>
      <div className={styles.titleStack} data-beat-layout-item="true">
        <p className={styles.kicker}>{copy.stamp}</p>
        <h1 className={styles.title} data-title={copy.title}>
          {copy.title}
        </h1>
        <p className={styles.dek}>{copy.body}</p>
        {beat >= 1 && <div className={styles.handNote}>{copy.note}</div>}
      </div>
      <div
        className={classNames(styles.posterBlock, styles.visible)}
        style={styleVars({ "--tilt": "1.7deg" })}
        data-beat-layout-item="true"
      >
        <div className={styles.posterLabel}>{copy.stampBody}</div>
      </div>
      {copy.cards
        .filter((card) => card.beat <= beat)
        .map((card) => (
          <article
            key={card.index}
            className={classNames(
              styles.cutCard,
              styles.coverSlip,
              card.index === "A" ? styles.coverSlipOne : styles.coverSlipTwo,
              styles.visible,
            )}
            style={styleVars({ "--tilt": card.tilt })}
            data-beat-layout-item="true"
          >
            <span className={styles.cardIndex}>{card.index}</span>
            <h2 className={styles.cardTitle}>{card.title}</h2>
            <p className={styles.cardBody}>{card.body}</p>
          </article>
        ))}
    </div>
  );
}

function CutListScene({
  copy,
  beat,
}: {
  copy: SceneCopy;
  beat: number;
}) {
  return (
    <div className={classNames(styles.canvas, styles.listCanvas)}>
      <aside
        className={classNames(styles.columnStamp, styles.visible)}
        style={styleVars({ "--tilt": "-3deg" })}
        data-beat-layout-item="true"
      >
        <strong>{copy.stamp}</strong>
        <span>{copy.stampBody}</span>
      </aside>
      <div className={styles.cutGrid}>
        {copy.cards
          .filter((card) => card.beat <= beat)
          .map((card) => (
            <article
              key={card.index}
              className={classNames(styles.cutCard, styles.visible)}
              style={styleVars({ "--tilt": card.tilt })}
              data-beat-layout-item="true"
            >
              <span className={styles.cardIndex}>{card.index}</span>
              <h2 className={styles.cardTitle}>{card.title}</h2>
              <p className={styles.cardBody}>{card.body}</p>
            </article>
          ))}
      </div>
    </div>
  );
}

function SpreadScene({
  copy,
  beat,
}: {
  copy: SceneCopy;
  beat: number;
}) {
  const [left, right, margin] = copy.cards;

  return (
    <div className={classNames(styles.canvas, styles.spreadCanvas)}>
      {[left, right].map((card, index) => (
        <article
          key={card.index}
          className={classNames(styles.zinePage, styles.visible)}
          style={styleVars({ "--tilt": index === 0 ? "-0.9deg" : "0.8deg" })}
          data-beat-layout-item="true"
        >
          <h2 className={styles.pageHead}>{card.title}</h2>
          <p className={styles.pageText}>{card.body}</p>
          {beat >= card.beat + 1 && (
            <div className={styles.pullQuote}>
              {index === 0 ? copy.note : copy.stampBody}
            </div>
          )}
        </article>
      ))}
      {beat >= margin.beat && (
        <article
          className={classNames(
            styles.cutCard,
            styles.marginSlip,
            styles.visible,
          )}
          style={styleVars({ "--tilt": margin.tilt })}
          data-beat-layout-item="true"
        >
          <span className={styles.cardIndex}>{margin.index}</span>
          <h2 className={styles.cardTitle}>{margin.title}</h2>
          <p className={styles.cardBody}>{margin.body}</p>
        </article>
      )}
    </div>
  );
}

function OverprintScene({
  copy,
  beat,
}: {
  copy: SceneCopy;
  beat: number;
}) {
  return (
    <div className={classNames(styles.canvas, styles.overprintCanvas)}>
      <div className={styles.overprintStack} data-beat-layout-item="true">
        {beat >= 0 && (
          <div
            className={classNames(
              styles.inkLayer,
              styles.inkLayerOne,
              styles.visible,
            )}
            style={styleVars({ "--tilt": "-3deg" })}
          />
        )}
        {beat >= 1 && (
          <div
            className={classNames(
              styles.inkLayer,
              styles.inkLayerTwo,
              styles.visible,
            )}
            style={styleVars({ "--tilt": "2deg" })}
          />
        )}
        {beat >= 2 && (
          <div
            className={classNames(
              styles.inkLayer,
              styles.inkLayerThree,
              styles.visible,
            )}
            style={styleVars({ "--tilt": "-1deg" })}
          />
        )}
      </div>
      <div className={styles.overprintCopy} data-beat-layout-item="true">
        <p className={styles.kicker}>{copy.stamp}</p>
        <h3>{copy.title}</h3>
        <p>{copy.body}</p>
        {beat >= 2 && <div className={styles.handNote}>{copy.note}</div>}
      </div>
    </div>
  );
}

function FoldoutScene({
  copy,
  beat,
}: {
  copy: SceneCopy;
  beat: number;
}) {
  return (
    <div className={classNames(styles.canvas, styles.foldCanvas)}>
      <div
        className={classNames(styles.foldout, styles.visible)}
        style={styleVars({ "--tilt": "-0.45deg" })}
        data-beat-layout-item="true"
      >
        {copy.cards.map((card) => (
          <section
            key={card.index}
            className={classNames(
              styles.foldPanel,
              card.beat > beat && styles.muted,
            )}
            data-beat-layout-item="true"
          >
            <div>
              <span className={styles.cardIndex}>{card.index}</span>
              <h3>{card.title}</h3>
              <p>{card.body}</p>
            </div>
            {card.beat <= beat && <strong>{copy.note}</strong>}
          </section>
        ))}
      </div>
    </div>
  );
}

function SceneBody({
  scene,
  copy,
  beat,
}: {
  scene: SceneDefinition;
  copy: SceneCopy;
  beat: number;
}) {
  if (scene.variant === "cover") return <CoverScene copy={copy} beat={beat} />;
  if (scene.variant === "cutList") {
    return <CutListScene copy={copy} beat={beat} />;
  }
  if (scene.variant === "spread") return <SpreadScene copy={copy} beat={beat} />;
  if (scene.variant === "overprint") {
    return <OverprintScene copy={copy} beat={beat} />;
  }
  return <FoldoutScene copy={copy} beat={beat} />;
}

function RisoScenePanel({
  scene,
  beat,
  language,
  isActive,
  motionOff,
}: {
  scene: number;
  beat: number;
  language: Lang;
  isActive: boolean;
  motionOff: boolean;
}) {
  const sceneData = getScene(scene);
  const safeBeat = getSafeBeat(sceneData, language, beat);
  const copy = sceneData.copy[language];
  const flip = useFLIP<HTMLElement>({
    watch: [scene, safeBeat, language],
    disabled: motionOff || !isActive,
    duration: 500,
    easing: "cubic-bezier(0.2, 0.9, 0.24, 1.18)",
    selector: '[data-beat-layout-item="true"]',
  });

  return (
    <section
      ref={flip.ref}
      className={styles.scene}
      data-beat-layout-container="true"
      data-beat-layout-mode="motion"
      aria-label={copy.title}
    >
      <Chrome copy={copy} scene={sceneData.id} />
      <SceneBody scene={sceneData} copy={copy} beat={safeBeat} />
      <footer className={styles.footer}>
        <BeatMarks
          scene={sceneData.id}
          beat={safeBeat}
          total={copy.beats.length}
        />
        <p className={styles.caption} data-beat-layout-item="true">
          {copy.caption}
        </p>
      </footer>
    </section>
  );
}

export function getMetadata(lang: Lang): StyleMetadata {
  return {
    id: "riso-print-zine",
    band: "editorial-print",
    name: lang === "zh" ? "孔版印刷小志" : "Riso Print Zine",
    theme:
      lang === "zh"
        ? "一个社群把自己印出来"
        : "A Community Prints Itself",
    densityLabel: lang === "zh" ? "中高密度" : "Medium-high density",
    heroScene: 1,
    colors: {
      bg: "#eadba8",
      ink: "#211d18",
      panel: "#0b6870",
    },
    typography: {
      header: 'Bebas Neue / Noto Sans SC',
      body: "IBM Plex Mono / Noto Sans SC",
    },
    tags: [
      "editorial-print",
      "riso",
      "zine",
      "lo-fi",
      "overprint",
      "bilingual",
      "motion",
    ],
    fonts: ["Bebas Neue", "IBM Plex Mono", "Caveat", "cjk:Noto Sans SC"],
    scenes: SCENES.map((scene) => {
      const copy = scene.copy[lang];
      return {
        id: scene.id,
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

export default function CommunityPrintsItselfV2({
  scene,
  beat,
  language,
  isThumbnail,
  reducedMotion,
  onNavigate,
}: BespokeStyleProps) {
  useRisoFonts();
  const motionOff = reducedMotion || isThumbnail;

  return (
    <div className={classNames(styles.root, motionOff && styles.isStatic)}>
      <div className={styles.printBed} />
      <SpatialSceneTrack
        scene={scene}
        beat={beat}
        transitionKind="glitch"
        transitionMap={TRANSITION_MAP}
        transitionDurationMs={620}
        reducedMotion={motionOff}
        beatLayoutModes={BEAT_LAYOUT_MODES}
        className={styles.track}
        renderScene={(sceneId, sceneBeat, isActive) => (
          <RisoScenePanel
            scene={sceneId}
            beat={sceneBeat}
            language={language}
            isActive={isActive}
            motionOff={motionOff}
          />
        )}
      />
      {!isThumbnail && (
        <StapleNav activeScene={scene} onNavigate={onNavigate} />
      )}
      <svg
        className={styles.paperNoise}
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <filter id="riso-paper-grain-23">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.72"
            numOctaves="3"
            seed="23"
          />
          <feColorMatrix type="saturate" values="0" />
          <feComponentTransfer>
            <feFuncA type="table" tableValues="0 0.42" />
          </feComponentTransfer>
        </filter>
        <rect width="100" height="100" filter="url(#riso-paper-grain-23)" />
      </svg>
    </div>
  );
}

export const communityPrintsItselfTopic = defineStyleTopic({
  id: "community-print",
  topic: {
    en: "Community Print",
    zh: "社群印刷",
  },
  model: "GPT 5.5",
  component: CommunityPrintsItselfV2,
  getMetadata,
});

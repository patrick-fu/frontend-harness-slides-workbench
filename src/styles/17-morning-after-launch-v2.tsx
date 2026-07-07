import React, { useEffect } from "react";
import type { BespokeStyleProps, StyleMetadata } from "../types";
import SpatialSceneTrack from "./SpatialSceneTrack";
import type { BeatLayoutMode, SceneTransitionMap } from "./SpatialSceneTrack";
import { defineStyleVersion } from "./version";
import styles from "./17-morning-after-launch-v2.module.css";

type Language = BespokeStyleProps["language"];
type SceneId = 1 | 2 | 3 | 4 | 5;

interface BeatCopy {
  action: string;
  title: string;
  body: string;
}

interface SidebarCopy {
  label: string;
  value: string;
  body: string;
}

interface SceneCopy {
  nav: string;
  section: string;
  kicker: string;
  headline: string;
  deck: string;
  byline: string;
  dateline: string;
  lead: string;
  columns: [string, string, string];
  sidebars: [SidebarCopy, SidebarCopy, SidebarCopy];
  caption: string;
  correction: {
    label: string;
    before: string;
    after: string;
  };
  stamp: string;
  beats: [BeatCopy, BeatCopy, BeatCopy];
}

const SCENE_IDS = [1, 2, 3, 4, 5] as const;

const TRANSITION_MAP: SceneTransitionMap = {
  "1->2": "page-flip",
  "2->3": "slide-y",
  "3->4": "wipe",
  "4->5": "fade",
};

const BEAT_LAYOUT_MODES: Record<SceneId, BeatLayoutMode> = {
  1: "reserved",
  2: "reserved",
  3: "reserved",
  4: "reserved",
  5: "reserved",
};

const PAPER_NAME: Record<Language, string> = {
  en: "The Launch Gazette",
  zh: "发布晨报",
};

const ISSUE_LINE: Record<Language, string> = {
  en: "Morning edition / systems desk / page A1",
  zh: "晨版 / 系统编辑台 / A1 版",
};

const SCENES: Record<SceneId, Record<Language, SceneCopy>> = {
  1: {
    en: {
      nav: "Masthead",
      section: "Masthead",
      kicker: "First light",
      headline: "The morning after launch",
      deck: "The front page opens with the edition line, the first proof, and a calm accounting of what shipped.",
      byline: "By the launch desk",
      dateline: "Dateline: 06:12, edition room",
      lead: "After the release window closed, the story moved from promise to record.",
      columns: [
        "The night staff kept the page open until the last deploy note crossed the wire. No victory language made the cut.",
        "The first edition carries the facts that can survive daylight: scope, signal, exceptions, and what remains under watch.",
        "Readers arrive with coffee, not applause. The page gives them a route through the result without asking them to cheer.",
      ],
      sidebars: [
        {
          label: "Folio",
          value: "A1",
          body: "Edition marks anchor every jump.",
        },
        {
          label: "Proof",
          value: "03",
          body: "Three confirmed beats before print.",
        },
        {
          label: "Tone",
          value: "Steady",
          body: "Record first, theater never.",
        },
      ],
      caption: "A quiet press mark stands in for the launch room after midnight.",
      correction: {
        label: "Desk note",
        before: "Drafts favored celebration.",
        after: "The printed page favors evidence.",
      },
      stamp: "FIRST EDITION",
      beats: [
        {
          action: "Masthead locks to the top rule",
          title: "Nameplate",
          body: "The paper establishes authority before the story opens.",
        },
        {
          action: "Lead line and columns enter reserved slots",
          title: "First proof",
          body: "The opening copy treats launch as public record.",
        },
        {
          action: "Folio and press marks complete the front page",
          title: "Folio marks",
          body: "Navigation becomes newspaper furniture.",
        },
      ],
    },
    zh: {
      nav: "报头",
      section: "报头",
      kicker: "天色初明",
      headline: "发布后的清晨",
      deck: "头版先落下版名、初校和冷静记录：哪些已经发出，哪些仍在观察。",
      byline: "发布编辑台",
      dateline: "电头：06:12，排版室",
      lead: "发布窗口关闭后，故事从承诺转为记录。",
      columns: [
        "夜班编辑等到最后一条部署记录过线，才把版面送入晨版。庆祝词没有进入正文。",
        "第一版只刊登能经得起天亮复核的事实：范围、信号、例外，以及仍需看守的部分。",
        "读者带着咖啡到来，不是掌声。版面给出阅读路径，不要求任何人先欢呼。",
      ],
      sidebars: [
        {
          label: "版记",
          value: "A1",
          body: "跳转由版面记号锚定。",
        },
        {
          label: "校次",
          value: "03",
          body: "三段确认后付印。",
        },
        {
          label: "语气",
          value: "稳定",
          body: "先记录，不演出。",
        },
      ],
      caption: "午夜后的发布室，只留下安静的压印痕迹。",
      correction: {
        label: "编辑注",
        before: "草稿偏向庆祝。",
        after: "成版偏向证据。",
      },
      stamp: "第一版",
      beats: [
        {
          action: "报头锁定在顶端细线下",
          title: "报头",
          body: "故事开始前，版名先建立权威。",
        },
        {
          action: "导语与正文进入预留栏位",
          title: "初校",
          body: "开篇把发布当作公共记录处理。",
        },
        {
          action: "版记与压印标记补齐头版",
          title: "版面记号",
          body: "导航成为报纸家具的一部分。",
        },
      ],
    },
  },
  2: {
    en: {
      nav: "Lead",
      section: "Lead story",
      kicker: "Lead story",
      headline: "Launch holds through first night",
      deck: "Traffic arrived early, alarms stayed ordinary, and the team found its first real readers in the logs.",
      byline: "By Mara Chen and the release desk",
      dateline: "Dateline: 07:04, operations wire",
      lead: "The product met the morning with fewer surprises than the rehearsal suggested.",
      columns: [
        "At the top of the hour, the launch was no longer an internal event. It became a page people could open and a path they could complete.",
        "The first wave tested the quiet parts: empty states, receipt language, recovery paths, and the small decisions that rarely make a keynote.",
        "The notable fact is restraint. No team declared the night finished. They reduced the room to dashboards, notes, and one open channel.",
      ],
      sidebars: [
        {
          label: "Signal",
          value: "82%",
          body: "First-run tasks completed without help.",
        },
        {
          label: "Noise",
          value: "Low",
          body: "Alerts matched rehearsal bands.",
        },
        {
          label: "Watch",
          value: "Copy",
          body: "Support language drew the most edits.",
        },
      ],
      caption: "A halftone trace of first traffic crossing the release desk.",
      correction: {
        label: "Clarification",
        before: "Launch meant announcement.",
        after: "Launch means first sustained use.",
      },
      stamp: "LEAD STORY",
      beats: [
        {
          action: "Lead headline takes the upper columns",
          title: "Headline",
          body: "The central claim lands before supporting copy appears.",
        },
        {
          action: "Drop-cap paragraph and body columns reveal",
          title: "Record",
          body: "The report shifts from headline to evidence.",
        },
        {
          action: "Side facts and caption complete the account",
          title: "First readers",
          body: "The sidebars keep the page dense and navigable.",
        },
      ],
    },
    zh: {
      nav: "头条",
      section: "头条",
      kicker: "头条",
      headline: "发布平稳越过首夜",
      deck: "流量提前到场，告警保持常态，团队在日志里看见第一批真正读者。",
      byline: "陈玛拉与发布编辑台",
      dateline: "电头：07:04，运维专线",
      lead: "产品迎来清晨时，意外比彩排中更少。",
      columns: [
        "整点过后，发布不再是内部事件。它变成用户能打开的页面，也变成用户能走完的路径。",
        "第一波流量考验的是安静处：空状态、回执文案、恢复路径，以及很少出现在发布会里的小决定。",
        "值得记录的是克制。没有人宣布夜晚结束。房间缩小为仪表盘、记录和一个仍打开的频道。",
      ],
      sidebars: [
        {
          label: "信号",
          value: "82%",
          body: "首轮任务无需帮助完成。",
        },
        {
          label: "噪声",
          value: "低",
          body: "告警落在彩排区间内。",
        },
        {
          label: "观察",
          value: "文案",
          body: "支持语言被修改最多。",
        },
      ],
      caption: "第一波流量穿过发布台的半调痕迹。",
      correction: {
        label: "澄清",
        before: "发布等于宣布。",
        after: "发布等于首次持续使用。",
      },
      stamp: "头条",
      beats: [
        {
          action: "头条占据上方主栏",
          title: "标题",
          body: "中心判断先落下，证据随后进入。",
        },
        {
          action: "首字导语和正文栏显现",
          title: "记录",
          body: "报道从标题转入证据。",
        },
        {
          action: "侧栏事实和图注补齐页面",
          title: "首批读者",
          body: "侧栏让高密版面仍可导航。",
        },
      ],
    },
  },
  3: {
    en: {
      nav: "Sidebars",
      section: "Sidebars",
      kicker: "Inside columns",
      headline: "The small stories explain the big one",
      deck: "Every sidebar narrows one question: what moved, what stayed quiet, what needs a second look.",
      byline: "Compiled by the morning copy desk",
      dateline: "Dateline: 08:20, sidebar rail",
      lead: "The launch report becomes useful when the margins start doing work.",
      columns: [
        "No single metric could carry the story. The page turned to smaller boxes, each with one job and no borrowed drama.",
        "The sidebars changed the pace of reading. They let a scanner find the pressure points before entering the long columns.",
        "The design choice is editorial, not decorative: the rail gives busy facts a home without breaking the front-page voice.",
      ],
      sidebars: [
        {
          label: "Moved",
          value: "Onboarding",
          body: "The first task tightened after two copy passes.",
        },
        {
          label: "Quiet",
          value: "Billing",
          body: "No unusual support pattern reached the desk.",
        },
        {
          label: "Open",
          value: "Exports",
          body: "Long files wait for a larger sample.",
        },
      ],
      caption: "Column furniture gives the page a faster route through dense reporting.",
      correction: {
        label: "Reader guide",
        before: "Start with the biggest number.",
        after: "Start with the question you own.",
      },
      stamp: "SIDE RAIL",
      beats: [
        {
          action: "Side rail reserves three fixed columns",
          title: "Rail",
          body: "The margin becomes a reading tool.",
        },
        {
          action: "Each sidebar reveals inside its fixed slot",
          title: "Boxes",
          body: "Nothing pushes the lead story out of place.",
        },
        {
          action: "Reader guide and caption settle",
          title: "Route",
          body: "The page now supports scanning and reading.",
        },
      ],
    },
    zh: {
      nav: "侧栏",
      section: "侧栏",
      kicker: "栏内新闻",
      headline: "小故事解释大故事",
      deck: "每个侧栏只回答一个问题：什么变了，什么安静，什么需要再看一版。",
      byline: "晨版文案台整理",
      dateline: "电头：08:20，侧栏轨",
      lead: "当边栏开始承担任务，发布报道才真正有用。",
      columns: [
        "没有单个指标足以托住整篇报道。版面改用更小的盒子，每个盒子只做一件事，不借用戏剧性。",
        "侧栏改变了阅读速度。快速浏览的人可以先找到压力点，再进入长栏正文。",
        "这是编辑选择，不是装饰：侧栏给繁忙事实一个固定位置，同时保留头版语气。",
      ],
      sidebars: [
        {
          label: "变化",
          value: "引导",
          body: "首个任务在两轮文案后收紧。",
        },
        {
          label: "安静",
          value: "账单",
          body: "支持台未见异常模式。",
        },
        {
          label: "待看",
          value: "导出",
          body: "长文件等待更大样本。",
        },
      ],
      caption: "栏间家具为密集报道提供更快路径。",
      correction: {
        label: "读者指南",
        before: "先看最大的数字。",
        after: "先看你负责的问题。",
      },
      stamp: "侧栏",
      beats: [
        {
          action: "侧栏轨预留三列固定空间",
          title: "栏轨",
          body: "页边成为阅读工具。",
        },
        {
          action: "每个侧栏在固定槽位内显现",
          title: "盒子",
          body: "头条位置不会被推开。",
        },
        {
          action: "读者指南和图注落定",
          title: "路径",
          body: "版面同时支持扫读和深读。",
        },
      ],
    },
  },
  4: {
    en: {
      nav: "Correction",
      section: "Correction",
      kicker: "Correction box",
      headline: "A correction earns the page",
      deck: "The morning edition updates one confident sentence and leaves the mark visible.",
      byline: "Issued by standards and release operations",
      dateline: "Dateline: 09:11, standards desk",
      lead: "A correction is not a blemish here. It is the contract that keeps the page honest.",
      columns: [
        "The first draft described the queue as clear. Overnight use proved the sentence too broad for the evidence available.",
        "The desk changed the claim, kept the earlier wording visible, and moved the stronger version into the record.",
        "The launch story improves because the page refuses to protect its first phrasing from better information.",
      ],
      sidebars: [
        {
          label: "Before",
          value: "Queue clear",
          body: "Too broad for the sample.",
        },
        {
          label: "After",
          value: "Queue stable",
          body: "Matches measured behavior.",
        },
        {
          label: "Policy",
          value: "Visible",
          body: "Corrections remain on page.",
        },
      ],
      caption: "A red desk rule marks the only sanctioned accent on the page.",
      correction: {
        label: "Correction",
        before: "All import queues cleared before dawn.",
        after: "Import queues remained stable; two long files continued processing.",
      },
      stamp: "CORRECTED",
      beats: [
        {
          action: "Correction box reserves the center of the sheet",
          title: "Notice",
          body: "The page makes room for the update.",
        },
        {
          action: "Earlier wording and revised wording appear together",
          title: "Revision",
          body: "The difference is visible instead of hidden.",
        },
        {
          action: "Standards sidebar confirms the policy",
          title: "Record",
          body: "Trust is carried by the correction, not harmed by it.",
        },
      ],
    },
    zh: {
      nav: "更正",
      section: "更正",
      kicker: "更正栏",
      headline: "更正让版面成立",
      deck: "晨版更新一句过于自信的话，并把修改痕迹留在页面上。",
      byline: "标准编辑台与发布运维",
      dateline: "电头：09:11，标准台",
      lead: "在这里，更正不是污点。它是让版面保持诚实的契约。",
      columns: [
        "初稿称队列已经清空。夜间使用证明，这句话超出了当时证据能够支持的范围。",
        "编辑台改写判断，保留原句可见，并把更稳妥的版本放入记录。",
        "发布故事因此变得更好，因为版面不保护第一种说法，而保护更好的信息。",
      ],
      sidebars: [
        {
          label: "之前",
          value: "队列清空",
          body: "样本不足以支持。",
        },
        {
          label: "之后",
          value: "队列稳定",
          body: "符合实测行为。",
        },
        {
          label: "规则",
          value: "可见",
          body: "更正留在版面。",
        },
      ],
      caption: "红色编辑线是页面唯一被允许的强调色。",
      correction: {
        label: "更正",
        before: "所有导入队列在天亮前清空。",
        after: "导入队列保持稳定；两个长文件仍在处理。",
      },
      stamp: "已更正",
      beats: [
        {
          action: "更正框预留在版面中央",
          title: "公告",
          body: "页面为更新留出位置。",
        },
        {
          action: "旧说法与新说法同时出现",
          title: "修订",
          body: "差异可见，而不是被藏起。",
        },
        {
          action: "标准侧栏确认处理规则",
          title: "记录",
          body: "信任由更正承载，而不是被更正损害。",
        },
      ],
    },
  },
  5: {
    en: {
      nav: "Second",
      section: "Second edition",
      kicker: "Second edition",
      headline: "By noon, the launch becomes routine",
      deck: "The second edition moves the story from breaking news into operating record.",
      byline: "By the noon rewrite desk",
      dateline: "Dateline: 12:00, second edition",
      lead: "A launch is finished only when the new habit can survive ordinary hours.",
      columns: [
        "The second edition is less dramatic and more useful. It removes the overnight suspense and keeps the operating facts.",
        "Support copied the revised language into its queue. Product kept the watch list open. Engineering closed only the checks that had earned it.",
        "The final page does not declare triumph. It gives the next team enough context to run the afternoon without folklore.",
      ],
      sidebars: [
        {
          label: "Edition",
          value: "Noon",
          body: "Breaking copy retired.",
        },
        {
          label: "Handoff",
          value: "Ready",
          body: "Support and product share terms.",
        },
        {
          label: "Next",
          value: "Habit",
          body: "Ordinary use becomes the test.",
        },
      ],
      caption: "The second plate keeps the record, not the adrenaline.",
      correction: {
        label: "Edition note",
        before: "Watch everything.",
        after: "Watch the few things that still move.",
      },
      stamp: "SECOND EDITION",
      beats: [
        {
          action: "Noon edition stamp lands in its reserved block",
          title: "Stamp",
          body: "The page acknowledges the story has changed shape.",
        },
        {
          action: "Routine operating columns replace suspense",
          title: "Routine",
          body: "The launch becomes usable work.",
        },
        {
          action: "Final folio marks close the five-scene paper",
          title: "Handoff",
          body: "The record is ready for the next shift.",
        },
      ],
    },
    zh: {
      nav: "二版",
      section: "第二版",
      kicker: "第二版",
      headline: "到中午，发布成为日常",
      deck: "第二版把故事从突发新闻移入运营记录。",
      byline: "午版改写台",
      dateline: "电头：12:00，第二版",
      lead: "只有当新习惯能撑过普通时段，发布才算真正完成。",
      columns: [
        "第二版戏剧性更低，也更有用。它撤下夜间悬念，留下运营事实。",
        "支持台把修订后的语言写入队列。产品继续保留观察列表。工程只关闭已经被证据证明的检查项。",
        "最终版不宣布胜利。它给下一班团队足够上下文，让下午不靠传闻运转。",
      ],
      sidebars: [
        {
          label: "版次",
          value: "午版",
          body: "突发文案退场。",
        },
        {
          label: "交接",
          value: "就绪",
          body: "支持与产品共用术语。",
        },
        {
          label: "下一步",
          value: "习惯",
          body: "日常使用成为测试。",
        },
      ],
      caption: "第二块版保留记录，而不是肾上腺素。",
      correction: {
        label: "版次注",
        before: "观察所有事项。",
        after: "观察仍在变化的少数事项。",
      },
      stamp: "第二版",
      beats: [
        {
          action: "午版印章落入预留块",
          title: "印章",
          body: "页面承认故事形态已经变化。",
        },
        {
          action: "日常运营栏替代夜间悬念",
          title: "日常",
          body: "发布变成可执行的工作。",
        },
        {
          action: "最终版记关闭五幕报纸",
          title: "交接",
          body: "记录已经交给下一班。",
        },
      ],
    },
  },
};

function useFonts() {
  useEffect(() => {
    if (typeof document === "undefined") return;
    const id = "style-17-morning-after-launch-v2-fonts";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Libre+Baskerville:wght@400;700&family=Libre+Caslon+Text:wght@400;700&family=Noto+Serif+SC:wght@400;600;700&display=swap";
    document.head.appendChild(link);
  }, []);
}

function normalizeScene(scene: number): SceneId {
  return SCENE_IDS.includes(scene as SceneId) ? (scene as SceneId) : 1;
}

function clampBeat(sceneId: SceneId, beat: number): number {
  const maxBeat = SCENES[sceneId].en.beats.length - 1;
  if (!Number.isFinite(beat)) return 0;
  return Math.min(Math.max(Math.floor(beat), 0), maxBeat);
}

function revealClass(currentBeat: number, threshold: number): string {
  return [
    styles.reveal,
    currentBeat >= threshold ? styles.revealVisible : styles.revealHidden,
  ].join(" ");
}

function revealIndex(index: number): React.CSSProperties {
  return { "--reveal-index": index } as React.CSSProperties;
}

interface ScenePageProps {
  sceneId: SceneId;
  beat: number;
  language: Language;
  isActive: boolean;
}

function ScenePage({ sceneId, beat, language, isActive }: ScenePageProps) {
  const copy = SCENES[sceneId][language];
  const safeBeat = clampBeat(sceneId, beat);
  const activeBeat = copy.beats[safeBeat];

  return (
    <article
      className={[styles.page, styles[`scene${sceneId}`]].filter(Boolean).join(" ")}
      data-scene-active={isActive ? "true" : "false"}
      data-scene-kind={copy.section}
      aria-label={copy.section}
    >
      <header className={styles.paperHeader} data-beat-layout-item="true">
        <div className={styles.issueLine}>
          <span>{ISSUE_LINE[language]}</span>
          <span>{copy.section}</span>
        </div>
        <div className={styles.nameplateRow}>
          <span className={styles.nameplateRule} />
          <h1 className={styles.nameplate}>{PAPER_NAME[language]}</h1>
          <span className={styles.nameplateRule} />
        </div>
      </header>

      <div className={styles.topRule} data-beat-layout-item="true" />

      <section
        className={[styles.leadBlock, revealClass(safeBeat, 0)].join(" ")}
        data-beat-layout-item="true"
      >
        <p className={styles.kicker}>{copy.kicker}</p>
        <h2 className={styles.headline}>{copy.headline}</h2>
        <p className={styles.deck}>{copy.deck}</p>
        <p className={styles.byline}>{copy.byline}</p>
        <p className={styles.dateline}>{copy.dateline}</p>
      </section>

      <figure
        className={[styles.photoBox, revealClass(safeBeat, 2)].join(" ")}
        data-beat-layout-item="true"
      >
        <div className={styles.halftonePlate}>
          <span className={styles.plateRule} />
          <span className={styles.plateMark}>{copy.stamp}</span>
          <span className={styles.plateRule} />
        </div>
        <figcaption className={styles.caption}>{copy.caption}</figcaption>
      </figure>

      <section
        className={[styles.bodyColumns, revealClass(safeBeat, 1)].join(" ")}
        data-beat-layout-item="true"
      >
        <p className={styles.leadParagraph}>
          <span className={styles.dropCap}>{copy.lead.slice(0, 1)}</span>
          {copy.lead.slice(1)}
        </p>
        {copy.columns.map((paragraph, index) => (
          <p
            className={styles.bodyParagraph}
            key={paragraph}
            style={revealIndex(index)}
          >
            {paragraph}
          </p>
        ))}
      </section>

      <aside
        className={[styles.sideRail, revealClass(safeBeat, 2)].join(" ")}
        data-beat-layout-item="true"
      >
        {copy.sidebars.map((item, index) => (
          <section
            className={styles.sidebarCard}
            key={item.label}
            style={revealIndex(index)}
          >
            <p className={styles.sidebarLabel}>{item.label}</p>
            <strong className={styles.sidebarValue}>{item.value}</strong>
            <p className={styles.sidebarBody}>{item.body}</p>
          </section>
        ))}
      </aside>

      <section
        className={[styles.correctionBox, revealClass(safeBeat, sceneId === 4 ? 0 : 2)].join(" ")}
        data-beat-layout-item="true"
      >
        <p className={styles.correctionLabel}>{copy.correction.label}</p>
        <p className={styles.correctionBefore}>{copy.correction.before}</p>
        <p className={styles.correctionAfter}>{copy.correction.after}</p>
      </section>

      <aside
        className={[styles.editionStamp, revealClass(safeBeat, sceneId === 5 ? 0 : 2)].join(" ")}
        data-beat-layout-item="true"
      >
        <span>{copy.stamp}</span>
        <small>{activeBeat.title}</small>
      </aside>
    </article>
  );
}

interface FolioNavProps {
  scene: SceneId;
  beat: number;
  language: Language;
  onNavigate?: BespokeStyleProps["onNavigate"];
}

function FolioNav({ scene, beat, language, onNavigate }: FolioNavProps) {
  const safeBeat = clampBeat(scene, beat);
  const beats = SCENES[scene][language].beats;

  return (
    <nav className={styles.folioNav} aria-label={language === "zh" ? "报纸版记导航" : "Newspaper folio navigation"}>
      <div className={styles.sceneFolios}>
        {SCENE_IDS.map((sceneId) => {
          const isCurrent = sceneId === scene;
          return (
            <button
              className={[styles.folioButton, isCurrent ? styles.folioButtonActive : ""]
                .filter(Boolean)
                .join(" ")}
              type="button"
              key={sceneId}
              aria-current={isCurrent ? "page" : undefined}
              onClick={() => onNavigate?.(sceneId, 0)}
            >
              <span className={styles.folioCode}>A{sceneId}</span>
              <span className={styles.folioLabel}>{SCENES[sceneId][language].nav}</span>
            </button>
          );
        })}
      </div>
      <div className={styles.beatMarkers} aria-label={language === "zh" ? "节拍标记" : "Beat markers"}>
        {beats.map((beatCopy, beatIndex) => {
          const isCurrent = beatIndex === safeBeat;
          return (
            <button
              className={[styles.beatMarker, isCurrent ? styles.beatMarkerActive : ""]
                .filter(Boolean)
                .join(" ")}
              type="button"
              key={beatCopy.title}
              aria-current={isCurrent ? "step" : undefined}
              onClick={() => onNavigate?.(scene, beatIndex)}
            >
              <span className={styles.beatRule} />
              <span className={styles.beatText}>{beatCopy.title}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

export function getMetadata(lang: Language): StyleMetadata {
  return {
    id: "17",
    band: "editorial-print",
    name: lang === "zh" ? "头版大报" : "Front Page Broadsheet",
    theme: lang === "zh" ? "发布后的清晨" : "The Morning After Launch",
    densityLabel: lang === "zh" ? "高密阅读" : "Dense Reading",
    heroScene: 2,
    colors: {
      bg: "#f3eddd",
      ink: "#15130e",
      panel: "#ded4bd",
    },
    typography: {
      header: "Libre Caslon Text 700",
      body: "Libre Baskerville 400",
    },
    tags: ["editorial", "print", "broadsheet", "newsprint", "dense"],
    fonts: ["Libre Caslon Text", "Libre Baskerville", "cjk:Noto Serif SC"],
    scenes: SCENE_IDS.map((sceneId) => {
      const copy = SCENES[sceneId][lang];
      return {
        id: sceneId,
        title: copy.section,
        beats: copy.beats.map((beatCopy, beatId) => ({
          id: beatId,
          action: beatCopy.action,
          title: beatCopy.title,
          body: beatCopy.body,
        })),
      };
    }),
  };
}

export default function MorningAfterLaunchBroadsheet({
  scene,
  beat,
  language,
  isThumbnail,
  reducedMotion,
  onNavigate,
}: BespokeStyleProps) {
  useFonts();
  const activeScene = normalizeScene(scene);
  const motionDisabled = reducedMotion || isThumbnail;

  return (
    <div
      className={[
        styles.root,
        language === "zh" ? styles.langZh : styles.langEn,
        motionDisabled ? styles.reducedMotion : "",
        isThumbnail ? styles.thumbnail : "",
      ]
        .filter(Boolean)
        .join(" ")}
      data-style-id="17"
      data-version-id="v2"
    >
      <SpatialSceneTrack
        className={styles.track}
        scene={activeScene}
        beat={clampBeat(activeScene, beat)}
        transitionKind="page-flip"
        transitionMap={TRANSITION_MAP}
        transitionDurationMs={760}
        reducedMotion={motionDisabled}
        beatLayoutModes={BEAT_LAYOUT_MODES}
        renderScene={(sceneId, sceneBeat, isActive) => (
          <div className={styles.sceneLayer}>
            <ScenePage
              sceneId={normalizeScene(sceneId)}
              beat={sceneBeat}
              language={language}
              isActive={isActive}
            />
          </div>
        )}
      />
      {!isThumbnail && (
        <FolioNav
          scene={activeScene}
          beat={beat}
          language={language}
          onNavigate={onNavigate}
        />
      )}
    </div>
  );
}

export const morningAfterLaunchV2Version = defineStyleVersion({
  id: "v2",
  topic: {
    en: "After Launch",
    zh: "发布翌日",
  },
  model: "GPT-5.5",
  component: MorningAfterLaunchBroadsheet,
  getMetadata,
});

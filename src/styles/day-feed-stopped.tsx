import { useEffect } from "react";
import type { CSSProperties } from "react";
import type { BespokeStyleProps, StyleMetadata } from "../types";
import { defineStyleTopic } from "./topic";
import SpatialSceneTrack from "./SpatialSceneTrack";
import type { SceneTransitionMap } from "./SpatialSceneTrack";
import styles from "./day-feed-stopped.module.css";

/* ────────────────────────────────────────────────────────────────────────
   Front-Page Broadsheet — v3 · "The Day the Feed Stopped"
   Newsprint value world, near-black ink, ONE quarantined accent (nameplate +
   kicker only). Dense justified multi-column journalism. cqw/cqh units only.
   ──────────────────────────────────────────────────────────────────────── */

const FONT_ID = "fonts-broadsheet-v3";
const FONT_HREF =
  "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800;900&" +
  "family=Source+Serif+4:ital,wght@0,400;0,600;1,400&family=Archivo:wght@600;700&" +
  "family=Noto+Serif+SC:wght@400;600;700&display=swap";

function useFonts() {
  useEffect(() => {
    if (document.getElementById(FONT_ID)) return;
    const link = document.createElement("link");
    link.id = FONT_ID;
    link.rel = "stylesheet";
    link.href = FONT_HREF;
    document.head.appendChild(link);
  }, []);
}

/* ── Display copy (bilingual, no lorem) ─────────────────────────────────── */
interface Copy {
  paper: string;
  edLeft: string;
  edRight: string;
  motto: string;
  dateLeft: string;
  dateRight: string;
  teaser: string;
  inside: { t: string; p: string }[];
  lede: {
    kicker: string;
    headline: string;
    deck: string;
    byline: string;
    drop: string;
    lead: string;
    paras: string[];
  };
  story: {
    section: string;
    date: string;
    subheads: [string, string];
    col0: string[];
    col1: string[];
    col2: string[];
    caption: string;
  };
  analysis: {
    section: string;
    date: string;
    kicker: string;
    head: string;
    paras: string[];
    sidebarHead: string;
    sidebar: string[];
  };
  late: {
    section: string;
    date: string;
    ghost: string;
    stamp: string;
    kicker: string;
    head: string;
    body: string;
    bulletins: string[];
  };
  spine: { mark: string; label: string }[];
}

const EN: Copy = {
  paper: "THE MERIDIAN CHRONICLE",
  edLeft: "VOL. CLXII · NO. 41,208",
  edRight: "CITY & FINAL",
  motto: "All The Silence Fit To Print",
  dateLeft: "THURSDAY, OCTOBER 12, 2028",
  dateRight: "SIGNAL 0%  ·  PRICE $3.00",
  teaser:
    "At fourteen minutes past six this morning, the great feeds went dark — every scroll, every stream, every notification stilled at once. What follows is the record of a day the world spent looking up.",
  inside: [
    { t: "Markets Seize as Ad Engines Go Dark", p: "B1" },
    { t: "Op-Ed: The Quiet We Had Forgotten", p: "A9" },
    { t: "A Field Guide to Reading Newspapers", p: "C3" },
    { t: "Weather, Notices & the Long Silence", p: "D2" },
  ],
  lede: {
    kicker: "GLOBAL OUTAGE",
    headline: "THE DAY THE FEED STOPPED",
    deck:
      "At 6:14 a.m. the world's largest platforms fell silent within the same minute. By noon three billion people had nothing left to scroll — and, briefly, nowhere to look but at one another.",
    byline: "By E. HALVORSEN and R. OKAFOR · Technology Desk",
    drop: "F",
    lead:
      "or thirteen uninterrupted years the feed had never once stopped. It thinned in the small hours and swelled at dusk, but it always moved. Yesterday, in the span of a single breath, it did not.",
    paras: [
      "Engineers first noticed the graphs go flat, then the phones stop buzzing, then the strange, carrying hush of a city that had misplaced its reflex. Refresh returned nothing. Reload returned nothing.",
      "Within the hour, transit boards blanked, delivery fleets idled, and a generation raised on the infinite column discovered the disquiet of a still one. Newsrooms, improbably, filled again with the sound of typewriters retired a decade ago.",
      "Officials urged calm and offered none of the usual channels to deliver it. For the first time since the platforms were built, the public square had no square, and the crowd, uncertain, drifted into the streets to find each other in person.",
    ],
  },
  story: {
    section: "A3 · THE REPORT",
    date: "OCT. 12 · 09:40",
    subheads: ["Silence at the Data Halls", "\u201cWe Just Kept Refreshing\u201d"],
    col0: [
      "Inside the Cascade exchange, the country's largest routing floor, engineers worked by handheld light after backup power tripped the display walls dark. \u201cThe traffic didn't crash,\u201d one supervisor said. \u201cIt simply stopped arriving.\u201d",
      "By dawn the outage had spread across four continents, defying the redundancies that were supposed to make such a thing impossible. No single cable, no single company; the failure moved like weather.",
      "Investigators declined to name a cause, cautioning that the systems were now too entangled to fault-trace by lunchtime, or perhaps by week's end.",
    ],
    col1: [
      "Commuters described a morning turned suddenly analog: paper schedules pinned to poles, strangers comparing notes, a shared and unfamiliar patience settling over the platforms.",
      "In cafes, patrons who had not spoken in years of adjacent silence found, awkwardly at first, that the room could still hold a conversation.",
    ],
    col2: [
      "Retailers reported the collapse of same-hour delivery within ninety minutes, as the algorithms that choreograph the warehouses lost their conductor and the belts fell still.",
      "Yet hospitals, air traffic, and the power grid — deliberately walled off from the consumer feeds years ago — ran without a flutter, a quiet vindication of the engineers who insisted the two worlds never touch.",
      "By evening the phrase repeated on every corner had nothing to do with technology at all. People simply asked one another, again and again: did you feel how quiet it was?",
    ],
    caption:
      "A darkened operations floor at the Cascade exchange, where staff worked by handheld light. — Chronicle photo",
  },
  analysis: {
    section: "A4 · ANALYSIS",
    date: "OCT. 12 · 14:05",
    kicker: "ANALYSIS",
    head: "What We Lost When the Scroll Went Quiet",
    paras: [
      "The outage will be remembered less for what broke than for what it revealed: how thoroughly a habit had replaced attention, and how little of the day, once handed back, we knew what to do with.",
      "For a decade the feed was the weather we lived inside — ambient, total, unremarked. Its absence did not feel like a blackout so much as a sudden, disorienting clarity, the kind that arrives when a fan you never noticed finally switches off.",
      "Whatever restored the signal tonight, the more difficult question outlasts the fix. We built a public life that cannot pause without alarm. The engineers can repair the servers. The rest is ours.",
    ],
    sidebarHead: "By The Numbers",
    sidebar: [
      "6:14 a.m. — the minute the feeds fell silent, across every major platform at once.",
      "3 billion accounts left without a single refresh by local noon.",
      "$47bn in advertising throughput stalled inside the first working hour.",
      "0% — the signal strength printed, for the first time, on this newspaper's masthead.",
    ],
  },
  late: {
    section: "A5 · LATE EDITION",
    date: "OCT. 12 · 23:52",
    ghost: "STOP PRESS",
    stamp: "LATE ED.",
    kicker: "BULLETIN — 11:52 P.M.",
    head: "Service Partly Restored; Cause Still Unknown",
    body:
      "Late tonight, fragments of the feed flickered back — a trickle of posts, then a hesitant stream. Officials cautioned the restoration is partial and the underlying failure remains unexplained. The morning edition, they said, will be worth reading in full.",
    bulletins: [
      "MARKETS — Indices recovered two-thirds of the day's losses on word of a staged restart.",
      "STREETS — Impromptu gatherings in three cities lingered past midnight, reluctant to disperse.",
      "TOMORROW — The Chronicle prints an extended edition; the feed, for once, can wait.",
    ],
  },
  spine: [
    { mark: "A1", label: "Front" },
    { mark: "A2", label: "Lede" },
    { mark: "A3", label: "Report" },
    { mark: "A4", label: "Analysis" },
    { mark: "A5", label: "Late" },
  ],
};

const ZH: Copy = {
  paper: "子午纪事报",
  edLeft: "第一六二卷 · 第 41,208 期",
  edRight: "城市终版",
  motto: "凡值得沉默者皆付梓",
  dateLeft: "二〇二八年十月十二日 星期四",
  dateRight: "信号 0%  ·  售价 三元",
  teaser:
    "今晨六时十四分，庞大的信息流骤然熄灭——每一次滑动、每一段直播、每一条推送同时归于静止。以下，是世人抬头仰望的这一整天的记录。",
  inside: [
    { t: "广告引擎熄火，市场骤然冻结", p: "B1" },
    { t: "社论：我们早已遗忘的安静", p: "A9" },
    { t: "如何阅读一份纸质报纸", p: "C3" },
    { t: "天气、公告与漫长的沉默", p: "D2" },
  ],
  lede: {
    kicker: "全球停摆",
    headline: "信息流停摆的那一天",
    deck:
      "上午六时十四分，全球最大的平台在同一分钟内集体失声。至正午，三十亿人再无可供滑动之物——短暂地，他们只能望向彼此。",
    byline: "本报记者 霍尔沃森、奥卡福 · 科技版",
    drop: "十",
    lead:
      "三年来，信息流从未有一刻停歇。它在凌晨稀薄，于黄昏丰盈，却始终流动不息。而昨日，仅在一次呼吸之间，它停了。",
    paras: [
      "工程师最先察觉曲线趋平，接着手机不再震动，随后是一座城市弄丢了本能反射后那种绵长而清晰的寂静。刷新，一无所获；重载，一无所获。",
      "不出一小时，交通显示屏空白，配送车队停摆，在无限信息流中长大的一代人，第一次尝到了静止之流的不安。而报社里，竟又响起了退役十年的打字机声。",
      "官员呼吁镇定，却拿不出任何惯用渠道去传递镇定。自平台建成以来，公共广场第一次没有了广场，惶惑的人群涌向街头，去当面寻找彼此。",
    ],
  },
  story: {
    section: "A3 · 正文",
    date: "十月十二日 · 09:40",
    subheads: ["数据中心里的死寂", "\u201c我们只是一直在刷新\u201d"],
    col0: [
      "在全国最大的路由机房——瀑布交换中心内，备用电力跳闸令显示墙陷入黑暗，工程师只得借手电作业。\u201c流量并没有崩溃，\u201d一位主管说，\u201c它只是不再抵达。\u201d",
      "至黎明，停摆已横跨四大洲，击穿了本应令此事绝无可能的层层冗余。没有哪一条线缆，没有哪一家公司；故障像天气一样蔓延。",
      "调查人员拒绝指认成因，警告称系统如今盘根错节，恐怕午饭前、乃至本周末都无从溯源。",
    ],
    col1: [
      "通勤者形容这个清晨骤然回到了模拟时代：纸质时刻表钉在电杆上，陌生人互相对照，一种共有而陌生的耐心，沉降在站台之上。",
      "在咖啡馆里，多年相邻无言的客人，起初笨拙地发现——原来这间屋子仍容得下一场交谈。",
    ],
    col2: [
      "零售商称，即时配送在九十分钟内彻底瘫痪：编排仓库的算法失去了指挥，传送带随之静止。",
      "然而医院、空管与电网——多年前便被刻意隔绝于消费级信息流之外——却运转如常，波澜不惊，悄然印证了那些坚持两个世界永不相触的工程师。",
      "入夜时分，街角反复出现的那句话，已与技术毫无干系。人们只是一次又一次地问彼此：你有没有感到，那有多安静？",
    ],
    caption:
      "瀑布交换中心一片漆黑的运营大厅，工作人员借手电照明作业。——本报摄",
  },
  analysis: {
    section: "A4 · 分析",
    date: "十月十二日 · 14:05",
    kicker: "分析",
    head: "当滑动归于沉寂，我们失去了什么",
    paras: [
      "这场停摆终将被铭记的，不是坏掉了什么，而是它揭示了什么：一种习惯已何等彻底地替代了注意力；而当一整天被交还，我们竟又是何等不知所措。",
      "十年来，信息流是我们栖居其间的天气——弥漫、彻底、无人置评。它的缺席不像断电，更像一种骤然而至的、令人失措的清明：仿佛你从未留意的风扇，终于关停。",
      "无论今夜是什么让信号复归，那道更棘手的问题都比修复本身活得更久。我们建起了一种一停顿便警报大作的公共生活。服务器工程师能修好，其余的，是我们自己的事。",
    ],
    sidebarHead: "数字一览",
    sidebar: [
      "六时十四分——各大平台同时失声的那一分钟。",
      "三十亿个账号，到本地正午再未刷新过一次。",
      "四百七十亿美元的广告流量，在首个工作小时内停滞。",
      "0%——本报报头上，史无前例地印出的信号强度。",
    ],
  },
  late: {
    section: "A5 · 末版",
    date: "十月十二日 · 23:52",
    ghost: "紧急停机",
    stamp: "末 版",
    kicker: "快讯 — 23:52",
    head: "服务部分恢复；成因仍属未知",
    body:
      "今夜稍晚，信息流的碎片重新闪现——先是零星几条，继而是迟疑的一股细流。官员告诫，恢复仍属局部，底层故障尚无解释。他们说，明日的晨报，值得从头读到尾。",
    bulletins: [
      "市场 —— 传出分阶段重启的消息后，各指数收复当日三分之二跌幅。",
      "街头 —— 三座城市的临时聚集持续至午夜之后，人群迟迟不愿散去。",
      "明日 —— 本报将付印加长版；这一次，信息流可以等一等。",
    ],
  },
  spine: [
    { mark: "A1", label: "头版" },
    { mark: "A2", label: "导语" },
    { mark: "A3", label: "正文" },
    { mark: "A4", label: "分析" },
    { mark: "A5", label: "末版" },
  ],
};

/* ── Reveal helpers (reserved-mode: fixed slots, opacity only) ──────────── */
const seen = (beat: number, threshold: number, settled: boolean) =>
  settled || beat >= threshold;

const reveal = (visible: boolean, settled: boolean): CSSProperties => ({
  opacity: visible ? 1 : 0,
  transition: settled ? "none" : "opacity 640ms ease",
});

/* ── Running head (editorial furniture) ─────────────────────────────────── */
function Folio({ paper, section, date }: { paper: string; section: string; date: string }) {
  return (
    <div className={styles.folio}>
      <span className={styles.folioSection}>{section}</span>
      <span className={styles.paper}>{paper}</span>
      <span className={styles.folioMark}>{date}</span>
    </div>
  );
}

/* ── Scenes ─────────────────────────────────────────────────────────────── */
interface SceneProps {
  scene: number;
  beat: number;
  isActive: boolean;
  settled: boolean;
  c: Copy;
}

function BroadsheetScene({ scene, beat, isActive, settled, c }: SceneProps) {
  const enter = isActive && !settled ? ` ${styles.enter}` : "";

  if (scene === 1) {
    return (
      <div className={`${styles.page} ${styles.pageNameplate}${enter}`}>
        <div className={styles.editionRow}>
          <span>{c.edLeft}</span>
          <span>{c.edRight}</span>
        </div>
        <div className={styles.drawRule} />
        <h1 className={styles.plateName}>{c.paper}</h1>
        <div className={styles.mottoRow}>
          <span className={styles.mottoLine} />
          <span className={styles.motto}>{c.motto}</span>
          <span className={styles.mottoLine} />
        </div>
        <div className={styles.dateline}>
          <span>{c.dateLeft}</span>
          <span>{c.dateRight}</span>
        </div>
        <div className={styles.plateFooter}>
          <div className={styles.insideBox}>
            <div className={styles.insideTitle}>{c.spine[0].label} · Inside</div>
            <ul className={styles.insideList}>
              {c.inside.map((it) => (
                <li key={it.t}>
                  <span>{it.t}</span>
                  <span className={styles.insideDots} />
                  <span>{it.p}</span>
                </li>
              ))}
            </ul>
          </div>
          <p className={styles.plateTeaser}>{c.teaser}</p>
        </div>
      </div>
    );
  }

  if (scene === 2) {
    return (
      <div className={`${styles.page}${enter}`}>
        <Folio paper={c.paper} section={c.spine[1].mark + " · " + c.spine[1].label} date={c.dateRight} />
        <div
          className={styles.lede}
          data-beat-layout-container="true"
          data-beat-layout-mode="reserved"
        >
          <div
            className={styles.ledeHead}
            data-beat-layout-item="true"
            style={reveal(seen(beat, 0, settled), settled)}
          >
            <div className={styles.kickerAccent}>{c.lede.kicker}</div>
            <h1 className={styles.headline}>{c.lede.headline}</h1>
            <p className={styles.deck}>{c.lede.deck}</p>
            <div className={styles.byline}>{c.lede.byline}</div>
          </div>
          <div
            className={styles.ledeBody}
            data-beat-layout-item="true"
            style={reveal(seen(beat, 1, settled), settled)}
          >
            <p className={styles.leadPara}>
              <span className={styles.dropInitial}>{c.lede.drop}</span>
              {c.lede.lead}
            </p>
            {c.lede.paras.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (scene === 3) {
    return (
      <div className={`${styles.page}${enter}`}>
        <Folio paper={c.paper} section={c.story.section} date={c.story.date} />
        <div
          className={styles.story}
          data-beat-layout-container="true"
          data-beat-layout-mode="reserved"
        >
          <div
            className={styles.storyCol}
            data-beat-layout-item="true"
            style={reveal(seen(beat, 0, settled), settled)}
          >
            <div className={styles.subhead}>{c.story.subheads[0]}</div>
            {c.story.col0.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          <div
            className={styles.storyCol}
            data-beat-layout-item="true"
            style={reveal(seen(beat, 1, settled), settled)}
          >
            <figure className={styles.figure}>
              <div className={styles.halftone} role="img" aria-label={c.story.caption} />
              <figcaption className={styles.figCaption}>{c.story.caption}</figcaption>
            </figure>
            {c.story.col1.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          <div
            className={styles.storyCol}
            data-beat-layout-item="true"
            style={reveal(seen(beat, 2, settled), settled)}
          >
            <div className={styles.subhead}>{c.story.subheads[1]}</div>
            {c.story.col2.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (scene === 4) {
    return (
      <div className={`${styles.page}${enter}`}>
        <Folio paper={c.paper} section={c.analysis.section} date={c.analysis.date} />
        <div
          className={styles.analysis}
          data-beat-layout-container="true"
          data-beat-layout-mode="reserved"
        >
          <div
            className={styles.analysisMain}
            data-beat-layout-item="true"
            style={reveal(seen(beat, 0, settled), settled)}
          >
            <div className={styles.kickerAccent}>{c.analysis.kicker}</div>
            <h1 className={styles.analysisHead}>{c.analysis.head}</h1>
            <div className={styles.analysisBody}>
              {c.analysis.paras.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>
          <aside
            className={styles.sidebar}
            data-beat-layout-item="true"
            style={reveal(seen(beat, 1, settled), settled)}
          >
            <h2 className={styles.sidebarHead}>{c.analysis.sidebarHead}</h2>
            <div className={styles.sidebarBody}>
              {c.analysis.sidebar.map((s, i) => (
                <p key={i} style={{ margin: "0 0 0.7cqh" }}>
                  {s}
                </p>
              ))}
            </div>
          </aside>
        </div>
      </div>
    );
  }

  // scene 5 — Late edition
  return (
    <div className={`${styles.page} ${styles.pageLate}${enter}`}>
      <Folio paper={c.paper} section={c.late.section} date={c.late.date} />
      <div className={styles.lateGhost}>{c.late.ghost}</div>
      <div className={styles.stamp}>{c.late.stamp}</div>
      <div className={styles.stopPress}>
        <div className={styles.kickerAccent}>{c.late.kicker}</div>
        <h1 className={styles.lateHead}>{c.late.head}</h1>
        <p className={styles.lateBody}>{c.late.body}</p>
      </div>
      <ul className={styles.bulletins}>
        {c.late.bulletins.map((b, i) => (
          <li key={i}>{b}</li>
        ))}
      </ul>
    </div>
  );
}

/* ── N5 · Section spine (page numerals / furniture) ─────────────────────── */
function SectionSpine({
  scene,
  isThumbnail,
  c,
  onNavigate,
}: {
  scene: number;
  isThumbnail: boolean;
  c: Copy;
  onNavigate?: (scene: number, beat: number) => void;
}) {
  if (isThumbnail) return null;
  return (
    <nav className={styles.spine} aria-label="Sections">
      {c.spine.map((s, i) => {
        const target = i + 1;
        const active = target === scene;
        return (
          <button
            key={s.mark}
            type="button"
            className={`${styles.spineItem}${active ? " " + styles.spineActive : ""}`}
            aria-current={active ? "page" : undefined}
            onClick={(e) => {
              e.stopPropagation();
              onNavigate?.(target, 0);
            }}
          >
            <span className={styles.spineMark}>{s.mark}</span>
            <span className={styles.spineLabel}>{s.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

/* ── Transition map (per brief) ─────────────────────────────────────────── */
const TRANSITIONS: SceneTransitionMap = {
  "1->2": "page-flip",
  "2->3": "slide-y",
  "3->4": "slide-y",
  "4->5": "page-flip",
};

/* ── Root component ─────────────────────────────────────────────────────── */
function FrontPageBroadsheetV3({
  scene,
  beat,
  language,
  isThumbnail,
  reducedMotion,
  onNavigate,
}: BespokeStyleProps) {
  useFonts();
  const c = language === "zh" ? ZH : EN;
  const settled = reducedMotion || isThumbnail;

  return (
    <div className={styles.root} lang={language}>
      <SpatialSceneTrack
        scene={scene}
        beat={beat}
        transitionKind="page-flip"
        transitionMap={TRANSITIONS}
        reducedMotion={reducedMotion || isThumbnail}
        beatLayoutModes={{ 2: "reserved", 3: "reserved", 4: "reserved" }}
        renderScene={(sceneId, sceneBeat, isActive) => (
          <BroadsheetScene
            scene={sceneId}
            beat={sceneBeat}
            isActive={isActive}
            settled={settled}
            c={c}
          />
        )}
      />
      <SectionSpine scene={scene} isThumbnail={isThumbnail} c={c} onNavigate={onNavigate} />
    </div>
  );
}

/* ── Metadata (getMetadata("en") ≡ getMetadata("zh") in shape) ──────────── */
interface MetaBeat {
  action: string;
  title: string;
  body: string;
}
interface MetaScene {
  title: string;
  beats: MetaBeat[];
}
interface MetaCopy {
  theme: string;
  densityLabel: string;
  scenes: MetaScene[];
}

const META_EN: MetaCopy = {
  theme: "The Day the Feed Stopped",
  densityLabel: "Dense · Multi-column",
  scenes: [
    {
      title: "Nameplate",
      beats: [
        {
          action: "Draw the masthead",
          title: "The Chronicle wakes",
          body: "Nameplate, motto, and dateline rule across the top of the page.",
        },
      ],
    },
    {
      title: "The Lede",
      beats: [
        {
          action: "Set the banner",
          title: "Headline and deck",
          body: "The headline, deck, and byline claim the top of the fold.",
        },
        {
          action: "Fill the first column",
          title: "Drop-cap lead",
          body: "A drop-cap lead paragraph pours the first columns full.",
        },
      ],
    },
    {
      title: "The Story",
      beats: [
        {
          action: "Open column one",
          title: "Silence at the halls",
          body: "The report opens on the darkened data floor.",
        },
        {
          action: "Break the flow",
          title: "A halftone breaks in",
          body: "A grayscale halftone image interrupts the middle column.",
        },
        {
          action: "Close the report",
          title: "The final column",
          body: "The last column settles and the page is full.",
        },
      ],
    },
    {
      title: "The Analysis",
      beats: [
        {
          action: "Run the essay",
          title: "What we lost",
          body: "The analysis essay runs in a two-column measure.",
        },
        {
          action: "Box the sidebar",
          title: "By the numbers",
          body: "A ruled sidebar with the accent kicker sums the toll.",
        },
      ],
    },
    {
      title: "Late Edition",
      beats: [
        {
          action: "Stamp the update",
          title: "Stop press",
          body: "A late bulletin is stamped across the finished page.",
        },
      ],
    },
  ],
};

const META_ZH: MetaCopy = {
  theme: "信息流停摆",
  densityLabel: "高密度 · 多栏",
  scenes: [
    {
      title: "报头",
      beats: [
        {
          action: "绘出报头",
          title: "纪事报醒来",
          body: "报头、报训与日期栏横贯版面顶部。",
        },
      ],
    },
    {
      title: "导语",
      beats: [
        {
          action: "定下大字标题",
          title: "标题与提要",
          body: "标题、提要与署名占据版面上折。",
        },
        {
          action: "填满首栏",
          title: "首字下沉引文",
          body: "首字下沉的引文段将头几栏灌满。",
        },
      ],
    },
    {
      title: "正文",
      beats: [
        {
          action: "开启第一栏",
          title: "机房的死寂",
          body: "报道自漆黑的数据大厅展开。",
        },
        {
          action: "打断栏流",
          title: "网点照片插入",
          body: "一张灰度网点照片打断中栏的文字流。",
        },
        {
          action: "收束报道",
          title: "最后一栏",
          body: "末栏落定，整个版面被填满。",
        },
      ],
    },
    {
      title: "分析",
      beats: [
        {
          action: "刊出评论",
          title: "我们失去了什么",
          body: "分析评论以双栏排式刊出。",
        },
        {
          action: "框出边栏",
          title: "数字一览",
          body: "带强调眉题的框线边栏统计代价。",
        },
      ],
    },
    {
      title: "末版",
      beats: [
        {
          action: "盖上更新戳",
          title: "紧急停机",
          body: "一条末版快讯盖印在完成的版面上。",
        },
      ],
    },
  ],
};

export function getMetadata(language: "en" | "zh"): StyleMetadata {
  const m = language === "zh" ? META_ZH : META_EN;
  return {
    id: "front-page-broadsheet",
    band: "editorial-print",
    name: "Front-Page Broadsheet",
    theme: m.theme,
    densityLabel: m.densityLabel,
    heroScene: 2,
    colors: { bg: "#f3efe4", ink: "#191410", panel: "#e9e3d3" },
    typography: { header: "Playfair Display", body: "Source Serif 4" },
    tags: ["authoritative", "serious", "dense", "newsprint", "grayscale", "print-motion"],
    fonts: ["Playfair Display", "Source Serif 4", "Archivo", "cjk:Noto Serif SC"],
    scenes: m.scenes.map((s, si) => ({
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

export const dayFeedStoppedTopic = defineStyleTopic({
  id: "day-feed-stopped",
  topic: { en: "The Day the Feed Stopped", zh: "信息流停摆" },
  model: "Claude Opus 4.8",
  component: FrontPageBroadsheetV3,
  getMetadata,
});

export default FrontPageBroadsheetV3;

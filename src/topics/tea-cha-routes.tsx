import type React from "react";
import {
  defineTopic,
  type TopicMetadata,
  type TopicStageProps,
  type TopicTransitionScore,
} from "../domain/topic";
import type { Source } from "../domain/evidence";
import SpatialSceneTrack, {
  type BeatLayoutMode,
  type SceneTransitionMap,
} from "../components/stage/SpatialSceneTrack";
import styles from "./tea-cha-routes.module.css";

type Lang = "en" | "zh";
type RouteFamily = "origin" | "sea" | "land" | "exception";

interface BeatCopy {
  action: string;
  title: string;
  body: string;
}

interface SceneCopy {
  index: string;
  kicker: string;
  title: string;
  body: string;
  navLabel: string;
  evidenceLabel: string;
  caveat: string;
  beats: BeatCopy[];
}

export interface TeaChaEvidenceRow {
  language: Record<Lang, string>;
  form: string;
  record: Record<Lang, string>;
  path: RouteFamily;
  sourceKeys: readonly string[];
}

const SCENE_IDS = [1, 2, 3, 4, 5] as const;

const COPY: Record<Lang, Record<number, SceneCopy>> = {
  en: {
    1: {
      index: "01",
      kicker: "ONE GRAPH · SEVERAL READINGS",
      title: "Tea and cha begin with 茶",
      body: "The world map is not split by two unrelated words. Related Chinese readings supplied different contact forms.",
      navLabel: "word pair",
      evidenceLabel: "Common written source",
      caveat: "The character is shared; pronunciation changed across Chinese varieties and time.",
      beats: [
        {
          action: "Pair the two global word families",
          title: "One written source, two familiar routes",
          body: "Southern Min tê and Mandarin chá are related readings, not competing origins.",
        },
      ],
    },
    2: {
      index: "02",
      kicker: "SOURCE CLUSTER",
      title: "The split starts inside a language landscape",
      body: "Before any ocean or caravan route, the form already varied across Chinese speech communities and historical layers.",
      navLabel: "source cluster",
      evidenceLabel: "Form · record marker · role",
      caveat: "Reconstructed forms are scholarly models; modern readings are not borders on a political map.",
      beats: [
        {
          action: "Place the written source",
          title: "茶 becomes the dominant written word",
          body: "Historical corpus work places 茶 at the center by the Tang period, after earlier competition with 茗.",
        },
        {
          action: "Open the Southern Min branch",
          title: "tê supplies the t-family contact form",
          body: "Southern Min around Fujian, Taiwan, and diaspora contact zones preserves the t-initial form.",
        },
        {
          action: "Open the cha readings",
          title: "chá and caa4 supply ch-family forms",
          body: "Mandarin and Cantonese readings anchor another broad borrowing family.",
        },
      ],
    },
    3: {
      index: "03",
      kicker: "MARITIME CONTACT BRAID",
      title: "The t-form travels through ports",
      body: "Southern Min tê appears in Southeast Asian contact and Dutch maritime trade, then spreads into western European languages.",
      navLabel: "sea route",
      evidenceLabel: "Possible entry points remain open",
      caveat: "Jurafsky notes that Xiamen, Chinese communities on Java, or both remain possible Dutch entry points.",
      beats: [
        {
          action: "Trace the port braid",
          title: "Xiamen and Batavia converge on Dutch thee",
          body: "The visual keeps both documented contact settings instead of inventing one certain chain.",
        },
        {
          action: "Trace the European loans",
          title: "thee branches to tea, thé, and Tee",
          body: "English tea is first known from 1655; the family spread through seventeenth-century maritime exchange.",
        },
      ],
    },
    4: {
      index: "04",
      kicker: "EURASIAN CONTACT CORRIDOR",
      title: "Cha and chai form a broad inland band",
      body: "Across Central, West, and South Asia into Eastern Europe, related ch-initial forms align strongly with long-running contact networks.",
      navLabel: "land route",
      evidenceLabel: "Contact corridor · not one caravan",
      caveat: "Silk Roads were dynamic land-and-sea networks. A word map records repeated contact, not a single causal itinerary.",
      beats: [
        {
          action: "Start from the cha readings",
          title: "chá enters the contact corridor",
          body: "Northern and western contact begins from ch-initial Chinese forms.",
        },
        {
          action: "Mark the Persian interchange",
          title: "Persian chāy helps carry the -i form",
          body: "A European account records Chiai in 1559; Persian is a likely source of the final -i in chai.",
        },
        {
          action: "Branch north and south",
          title: "Russian чай and Hindi चाय join the band",
          body: "The same broad family appears across multiple languages without implying one direct loan between every adjacent node.",
        },
        {
          action: "Complete the exchange network",
          title: "A corridor, not a one-way arrow",
          body: "Turkish çay, Mongolian цай, and Greek τσάι show a network shaped by different periods and intermediaries.",
        },
      ],
    },
    5: {
      index: "05",
      kicker: "EXCEPTION OVERLAY",
      title: "A strong pattern is not a rule",
      body: "Borrowing time, direct contact, and mixed maritime paths keep the two-family map useful—but never absolute.",
      navLabel: "exceptions",
      evidenceLabel: "Three checks against the slogan",
      caveat: "Language evidence can suggest contact histories; it does not prove one route or one cause by itself.",
      beats: [
        {
          action: "Overlay the exceptions",
          title: "Keep the pattern; retire the law",
          body: "Portuguese chá traveled by direct maritime contact, English recorded chaa before tea, and Dutch entry may have been braided.",
        },
      ],
    },
  },
  zh: {
    1: {
      index: "01",
      kicker: "一个字形 · 多种读音",
      title: "Tea 与 cha 都从“茶”出发",
      body: "世界地图上的两组词并非两个无关来源；不同汉语读音在接触中提供了不同借词形式。",
      navLabel: "词形并置",
      evidenceLabel: "共同书写源头",
      caveat: "字形相同，但读音会随汉语变体与历史时期变化。",
      beats: [
        {
          action: "并置两组全球词形",
          title: "一个书写源头，两条常见词路",
          body: "闽南语 tê 与普通话 chá 是相关读音，并非互相竞争的两个起源。",
        },
      ],
    },
    2: {
      index: "02",
      kicker: "源头簇",
      title: "分化先发生在语言地景内部",
      body: "在海船与商队之前，词形已经随汉语社群与历史层次出现差异。",
      navLabel: "源头簇",
      evidenceLabel: "词形 · 记录标记 · 角色",
      caveat: "重构音是学术模型；现代读音也不是政治地图上的国界。",
      beats: [
        {
          action: "放入共同书写形式",
          title: "“茶”成为核心书写词",
          body: "历时语料研究显示，“茶”在早期与“茗”竞争，并在唐代取得核心地位。",
        },
        {
          action: "打开闽南语分支",
          title: "tê 提供 t 词族的接触形式",
          body: "福建、台湾及移民接触区的闽南语保留了 t 起首形式。",
        },
        {
          action: "打开 cha 读音分支",
          title: "chá 与 caa4 提供 ch 词族形式",
          body: "普通话和粤语读音构成另一组广泛借词的起点。",
        },
      ],
    },
    3: {
      index: "03",
      kicker: "海上接触编织线",
      title: "t 词形沿港口传播",
      body: "闽南语 tê 出现在东南亚接触与荷兰海贸中，随后进入西欧多种语言。",
      navLabel: "海路线",
      evidenceLabel: "多个入口仍然成立",
      caveat: "Jurafsky 指出：厦门、爪哇华人社群，或两者共同作用，都可能是荷兰语的入口。",
      beats: [
        {
          action: "追踪港口编织线",
          title: "厦门与巴达维亚汇入荷兰语 thee",
          body: "图中保留两个有文献支撑的接触场景，不虚构唯一确定链条。",
        },
        {
          action: "追踪欧洲借词",
          title: "thee 分出 tea、thé 与 Tee",
          body: "英语 tea 的已知最早使用为 1655 年；这一词族随十七世纪海贸传播。",
        },
      ],
    },
    4: {
      index: "04",
      kicker: "欧亚接触走廊",
      title: "Cha 与 chai 构成广阔内陆带",
      body: "从中亚、西亚、南亚到东欧，ch 起首词形与长期接触网络呈现强相关。",
      navLabel: "陆路线",
      evidenceLabel: "接触走廊 · 不是一支商队",
      caveat: "丝绸之路是动态的陆海网络；词形地图记录反复接触，不等于单一因果路线。",
      beats: [
        {
          action: "从 cha 读音起步",
          title: "chá 进入接触走廊",
          body: "北方与西向接触从汉语 ch 起首形式展开。",
        },
        {
          action: "标记波斯语换乘",
          title: "波斯语 chāy 帮助传播 -i 词尾",
          body: "欧洲文献在 1559 年记录 Chiai；波斯语很可能提供 chai 的词尾 -i。",
        },
        {
          action: "向北与向南分支",
          title: "俄语 чай 与印地语 चाय 加入词带",
          body: "同一大词族跨越多种语言，但不表示每个相邻节点都存在直接借入。",
        },
        {
          action: "补全交换网络",
          title: "这是一条走廊，不是单向箭头",
          body: "土耳其语 çay、蒙古语 цай 与希腊语 τσάι 反映不同阶段和不同中介。",
        },
      ],
    },
    5: {
      index: "05",
      kicker: "例外覆盖层",
      title: "强模式不等于铁律",
      body: "借入时间、直接接触与混合海路，让二分地图仍然有用，却不能绝对化。",
      navLabel: "例外",
      evidenceLabel: "三条反口号校验",
      caveat: "语言证据可以提示接触史，但无法单独证明唯一道路或唯一因果。",
      beats: [
        {
          action: "覆盖例外",
          title: "保留模式，撤掉定律",
          body: "葡萄牙语 chá 经海上直接接触传播；英语先记录 chaa，再出现 tea；荷兰语入口可能是编织式的。",
        },
      ],
    },
  },
};

export const TEA_CHA_ROUTES_TRANSITION_SCORE = {
  "1->2": "push-x",
  "2->3": "linear-wipe",
  "3->4": "iris-open",
  "4->5": "diagonal-pan",
} as const satisfies TopicTransitionScore;

const TRANSITION_MAP: SceneTransitionMap =
  TEA_CHA_ROUTES_TRANSITION_SCORE;

export const TEA_CHA_ROUTES_SOURCES = [
  {
    authority: "Brill Encyclopedia of Chinese Language and Linguistics",
    citation: "Dan Jurafsky (2015), ‘Tea’",
    url: "https://web.stanford.edu/~jurafsky/pubs/tea.pdf",
    supports:
      "Supports the related Southern Min te, Mandarin chá, and Cantonese caa4 forms; the ch/chai and t families; Persian -i; the 1559 Chiai record; Xiamen/Batavia uncertainty; Dutch maritime transmission; and Portuguese as an exception.",
  },
  {
    authority: "Bulletin of Chinese Linguistics / Brill",
    citation:
      "Wang Feng (2020), Semantic Change, Lexical Competition and Lexical Stratification: The Rise and Fall of Two Words Meaning Tea, Ming 茗 and Cha 茶",
    url: "https://brill.com/view/journals/bcl/13/2/article-p378_5.pdf",
    supports:
      "Peer-reviewed historical-linguistics evidence for the rise of 茶, its competition with 茗, and 茶 becoming the core term during the Tang dynasty.",
  },
  {
    authority: "Merriam-Webster Dictionary",
    title: "Tea — Word History",
    url: "https://www.merriam-webster.com/dictionary/tea",
    supports:
      "Supports English tea as a borrowing from the Xiamen Chinese form and gives 1655 as the first known English use.",
  },
  {
    authority: "Online Etymology Dictionary",
    title: "Tea — Origin and history",
    url: "https://www.etymonline.com/word/tea",
    supports:
      "Supports English chaa in the 1590s, tea in the 1650s, Dutch/Malay/Xiamen transmission for tea, and ch-initial forms across overland networks.",
  },
  {
    authority: "UNESCO Silk Roads Programme",
    title: "About the Silk Roads",
    url: "https://www.unesco.org/en/silk-roads/about-silk-roads",
    supports:
      "Supports treating the Silk Roads as dynamic, porous networks of multiple land and maritime routes rather than one fixed itinerary or single causal arrow.",
  },
] as const satisfies readonly Source[];

export const TEA_CHA_EVIDENCE = [
  {
    language: { en: "Written Chinese", zh: "汉字书写" },
    form: "茶",
    record: { en: "core by Tang period", zh: "唐代成为核心词" },
    path: "origin",
    sourceKeys: ["wang-2020"],
  },
  {
    language: { en: "Middle Chinese (reconstructed)", zh: "中古汉语（重构）" },
    form: "*dra",
    record: { en: "c. 500 CE model", zh: "约公元 500 年的重构模型" },
    path: "origin",
    sourceKeys: ["jurafsky-2015"],
  },
  {
    language: { en: "Southern Min", zh: "闽南语" },
    form: "tê",
    record: { en: "source form; date not asserted", zh: "来源读音；不虚构借入日期" },
    path: "origin",
    sourceKeys: ["jurafsky-2015", "merriam-webster"],
  },
  {
    language: { en: "Mandarin", zh: "普通话" },
    form: "chá",
    record: { en: "source form; date not asserted", zh: "来源读音；不虚构借入日期" },
    path: "origin",
    sourceKeys: ["jurafsky-2015"],
  },
  {
    language: { en: "Cantonese", zh: "粤语" },
    form: "caa4",
    record: { en: "source form; date not asserted", zh: "来源读音；不虚构借入日期" },
    path: "origin",
    sourceKeys: ["jurafsky-2015"],
  },
  {
    language: { en: "Malay / Indonesian", zh: "马来语 / 印尼语" },
    form: "teh",
    record: { en: "early-1600s contact layer", zh: "十七世纪初接触层" },
    path: "sea",
    sourceKeys: ["jurafsky-2015"],
  },
  {
    language: { en: "Dutch", zh: "荷兰语" },
    form: "thee",
    record: { en: "early-1600s transmission", zh: "十七世纪初传播" },
    path: "sea",
    sourceKeys: ["jurafsky-2015"],
  },
  {
    language: { en: "English", zh: "英语" },
    form: "tea",
    record: { en: "first known use 1655", zh: "已知最早使用 1655" },
    path: "sea",
    sourceKeys: ["merriam-webster", "jurafsky-2015"],
  },
  {
    language: { en: "Persian", zh: "波斯语" },
    form: "chāy",
    record: { en: "Chiai recorded in Europe, 1559", zh: "欧洲文献 1559 年记作 Chiai" },
    path: "land",
    sourceKeys: ["jurafsky-2015"],
  },
  {
    language: { en: "Russian", zh: "俄语" },
    form: "чай",
    record: { en: "chai group; date not asserted", zh: "chai 词族；不虚构日期" },
    path: "land",
    sourceKeys: ["jurafsky-2015"],
  },
  {
    language: { en: "Hindi", zh: "印地语" },
    form: "चाय",
    record: { en: "chai group; date not asserted", zh: "chai 词族；不虚构日期" },
    path: "land",
    sourceKeys: ["jurafsky-2015"],
  },
  {
    language: { en: "Portuguese", zh: "葡萄牙语" },
    form: "chá",
    record: { en: "direct maritime exception", zh: "海上直接接触例外" },
    path: "exception",
    sourceKeys: ["jurafsky-2015"],
  },
  {
    language: { en: "English", zh: "英语" },
    form: "chaa",
    record: { en: "recorded in the 1590s", zh: "十六世纪 1590 年代已有记录" },
    path: "exception",
    sourceKeys: ["etymonline"],
  },
  {
    language: { en: "Dutch", zh: "荷兰语" },
    form: "thee",
    record: { en: "Xiamen / Batavia / both", zh: "厦门 / 巴达维亚 / 两者" },
    path: "exception",
    sourceKeys: ["jurafsky-2015"],
  },
] as const satisfies readonly TeaChaEvidenceRow[];

const BEAT_LAYOUT_MODES: Record<number, BeatLayoutMode> = {
  1: "reserved",
  2: "reserved",
  3: "reserved",
  4: "reserved",
  5: "reserved",
};

function clampScene(scene: number): number {
  return Math.max(1, Math.min(5, scene));
}

function clampBeat(scene: number, beat: number): number {
  const maxBeat = COPY.en[scene].beats.length - 1;
  return Math.max(0, Math.min(maxBeat, beat));
}

function getCopy(scene: number, lang: Lang): SceneCopy {
  return COPY[lang][scene] ?? COPY[lang][1];
}

function buildMetadata(lang: Lang): TopicMetadata {
  const isZh = lang === "zh";
  return {
    theme: isZh ? "茶的两条词路" : "Tea by Sea, Cha by Land",
    densityLabel: isZh ? "图解型 · 中密度" : "Diagram explainer · Medium",
    heroScene: 5,
    colors: {
      bg: "#f4f0e5",
      ink: "#18313a",
      panel: "#fffdf6",
    },
    typography: {
      header: "Arial 800",
      body: "Arial 500",
    },
    tags: [
      "diagram-explainer",
      "historical-linguistics",
      "language-geography",
      "route-map",
      "evidence",
      "public-information",
      "medium-density",
      "path-motion",
    ],
    fonts: ["Arial", "Georgia", "cjk:PingFang SC"],
    scenes: SCENE_IDS.map((sceneId) => {
      const copy = getCopy(sceneId, lang);
      return {
        id: sceneId,
        title: copy.navLabel,
        beats: copy.beats.map((beat, beatId) => ({
          id: beatId,
          action: beat.action,
          title: beat.title,
          body: beat.body,
        })),
      };
    }),
  };
}

function WordPairVisual({ lang }: { lang: Lang }) {
  return (
    <div className={styles.wordPairVisual} data-beat-layout-item="true">
      <svg
        className={styles.wordPairRoutes}
        viewBox="0 0 1000 650"
        role="img"
        aria-label={
          lang === "zh"
            ? "汉字茶分出 tê 与 chá 两组读音的图解"
            : "Diagram of 茶 branching toward the tê and chá readings"
        }
      >
        <path className={styles.sourceHalo} d="M500 116 C710 116 830 225 830 332 C830 486 696 556 500 556 C304 556 170 486 170 332 C170 225 290 116 500 116 Z" />
        <path className={styles.seaWordRoute} d="M450 332 C353 302 292 250 198 203 C126 168 82 182 46 220" />
        <path className={styles.landWordRoute} d="M550 332 C647 302 708 250 802 203 C874 168 918 182 954 220" />
        <path className={styles.seaWordRouteMuted} d="M450 360 C328 390 254 449 121 472" />
        <path className={styles.landWordRouteMuted} d="M550 360 C672 390 746 449 879 472" />
        {[198, 121].map((x, index) => (
          <circle key={`sea-${x}`} className={styles.seaStop} cx={x} cy={index === 0 ? 203 : 472} r="13" />
        ))}
        {[802, 879].map((x, index) => (
          <circle key={`land-${x}`} className={styles.landStop} cx={x} cy={index === 0 ? 203 : 472} r="13" />
        ))}
      </svg>
      <div className={styles.sourceCharacter} data-source-character="tea">
        <span>{lang === "zh" ? "共同字形" : "shared graph"}</span>
        <strong>茶</strong>
        <small>{lang === "zh" ? "不是英语中心" : "not English-first"}</small>
      </div>
      <div className={`${styles.wordFamily} ${styles.wordFamilySea}`}>
        <span>{lang === "zh" ? "闽南语" : "Southern Min"}</span>
        <strong>tê</strong>
        <b>TEA · THÉ · TEE</b>
      </div>
      <div className={`${styles.wordFamily} ${styles.wordFamilyLand}`}>
        <span>{lang === "zh" ? "普通话" : "Mandarin"}</span>
        <strong>chá</strong>
        <b>CHAI · ÇAY · ЧАЙ</b>
      </div>
    </div>
  );
}

const ORIGIN_NODES = [
  {
    id: "written",
    original: "茶",
    romanized: "written form",
    localized: { en: "Chinese graph", zh: "汉字书写" },
    note: { en: "core by Tang", zh: "唐代成为核心词" },
    x: 50,
    y: 48,
    beat: 0,
    family: "origin",
  },
  {
    id: "middle",
    original: "*dra",
    romanized: "reconstruction",
    localized: { en: "Middle Chinese", zh: "中古汉语" },
    note: { en: "c. 500 CE model", zh: "约 500 年重构" },
    x: 48,
    y: 17,
    beat: 0,
    family: "origin",
  },
  {
    id: "min",
    original: "茶",
    romanized: "tê",
    localized: { en: "Southern Min", zh: "闽南语" },
    note: { en: "Fujian contact form", zh: "福建接触读音" },
    x: 18,
    y: 62,
    beat: 1,
    family: "sea",
  },
  {
    id: "mandarin",
    original: "茶",
    romanized: "chá",
    localized: { en: "Mandarin", zh: "普通话" },
    note: { en: "ch-family source", zh: "ch 词族来源" },
    x: 74,
    y: 57,
    beat: 2,
    family: "land",
  },
  {
    id: "cantonese",
    original: "茶",
    romanized: "caa4",
    localized: { en: "Cantonese", zh: "粤语" },
    note: { en: "direct-contact form", zh: "直接接触读音" },
    x: 83,
    y: 28,
    beat: 2,
    family: "land",
  },
] as const;

function OriginCluster({ lang, beat }: { lang: Lang; beat: number }) {
  return (
    <div className={styles.originCluster} data-beat-layout-item="true">
      <svg className={styles.originRoutes} viewBox="0 0 1000 650" aria-hidden="true">
        <path className={styles.originSpine} d="M500 130 C482 245 490 274 500 330" />
        <path className={styles.seaOriginBranch} d="M500 330 C405 350 296 397 180 438" />
        <path className={styles.landOriginBranch} d="M500 330 C610 342 692 380 742 404" />
        <path className={styles.landOriginBranch} d="M500 330 C646 265 735 206 826 218" />
      </svg>
      <div className={styles.originGuide}>
        <span>{lang === "zh" ? "书写层" : "written layer"}</span>
        <i />
        <span>{lang === "zh" ? "接触读音" : "contact readings"}</span>
      </div>
      {ORIGIN_NODES.map((node) => {
        const visible = beat >= node.beat;
        return (
          <article
            key={node.id}
            className={styles.originNode}
            style={{ left: `${node.x}%`, top: `${node.y}%` }}
            data-origin-language-node="true"
            data-family={node.family}
            data-revealed={visible ? "true" : "false"}
          >
            <span>{node.localized[lang]}</span>
            <strong>{node.original}</strong>
            <b>{node.romanized}</b>
            <small>{node.note[lang]}</small>
          </article>
        );
      })}
    </div>
  );
}

const SEA_NODES = [
  {
    id: "xiamen",
    place: { en: "Xiamen", zh: "厦门" },
    language: { en: "Southern Min", zh: "闽南语" },
    form: "tê",
    record: { en: "source port", zh: "来源港口" },
    x: 13,
    y: 31,
    beat: 0,
  },
  {
    id: "batavia",
    place: { en: "Batavia / Java", zh: "巴达维亚 / 爪哇" },
    language: { en: "Malay / Indonesian", zh: "马来语 / 印尼语" },
    form: "teh",
    record: { en: "early 1600s contact", zh: "十七世纪初接触" },
    x: 28,
    y: 69,
    beat: 0,
  },
  {
    id: "dutch",
    place: { en: "Dutch network", zh: "荷兰贸易网" },
    language: { en: "Dutch", zh: "荷兰语" },
    form: "thee",
    record: { en: "entry path uncertain", zh: "入口路径未定" },
    x: 50,
    y: 43,
    beat: 0,
  },
  {
    id: "english",
    place: { en: "England", zh: "英格兰" },
    language: { en: "English", zh: "英语" },
    form: "tea",
    record: { en: "first known use 1655", zh: "已知最早使用 1655" },
    x: 72,
    y: 21,
    beat: 1,
  },
  {
    id: "french",
    place: { en: "French contact", zh: "法语接触" },
    language: { en: "French", zh: "法语" },
    form: "thé",
    record: { en: "17th-century family", zh: "十七世纪词族" },
    x: 79,
    y: 49,
    beat: 1,
  },
  {
    id: "german",
    place: { en: "German contact", zh: "德语接触" },
    language: { en: "German", zh: "德语" },
    form: "Tee",
    record: { en: "western t-family", zh: "西欧 t 词族" },
    x: 72,
    y: 76,
    beat: 1,
  },
] as const;

function SeaRouteMap({ lang, beat }: { lang: Lang; beat: number }) {
  return (
    <div className={styles.seaRouteMap} data-beat-layout-item="true">
      <div className={styles.waveField} aria-hidden="true">
        <i />
        <i />
        <i />
        <i />
      </div>
      <svg className={styles.seaRouteSvg} viewBox="0 0 1000 650" aria-hidden="true">
        <path className={styles.seaMainLine} d="M130 215 C278 184 356 260 500 290 C642 320 709 220 735 155" />
        <path className={styles.seaMainLine} d="M280 465 C342 387 397 330 500 290" />
        <path className={styles.seaBranchLine} data-revealed={beat >= 1 ? "true" : "false"} d="M500 290 C626 335 708 355 795 335" />
        <path className={styles.seaBranchLine} data-revealed={beat >= 1 ? "true" : "false"} d="M500 290 C602 420 663 480 735 500" />
        <path className={styles.seaUncertainLine} d="M130 215 C320 90 430 122 500 290" />
      </svg>
      <div className={styles.uncertaintyStamp}>
        <span>{lang === "zh" ? "荷兰语入口" : "DUTCH ENTRY"}</span>
        <strong>{lang === "zh" ? "厦门 / 巴达维亚 / 两者" : "Xiamen / Batavia / both remain possible"}</strong>
      </div>
      {SEA_NODES.map((node) => (
        <article
          key={node.id}
          className={styles.routeNode}
          style={{ left: `${node.x}%`, top: `${node.y}%` }}
          data-sea-language-node="true"
          data-revealed={beat >= node.beat ? "true" : "false"}
        >
          <span>{node.place[lang]}</span>
          <strong>{node.form}</strong>
          <b>{node.language[lang]}</b>
          <small>{node.record[lang]}</small>
        </article>
      ))}
    </div>
  );
}

const LAND_NODES = [
  {
    id: "china",
    place: { en: "Chinese contact", zh: "汉语接触" },
    language: { en: "Mandarin", zh: "普通话" },
    form: "chá",
    record: { en: "ch-family source", zh: "ch 词族来源" },
    x: 12,
    y: 51,
    beat: 0,
  },
  {
    id: "persian",
    place: { en: "Persian interchange", zh: "波斯语换乘" },
    language: { en: "Persian", zh: "波斯语" },
    form: "chāy",
    record: { en: "Chiai · 1559", zh: "Chiai · 1559" },
    x: 37,
    y: 40,
    beat: 1,
  },
  {
    id: "turkish",
    place: { en: "Anatolian branch", zh: "安纳托利亚分支" },
    language: { en: "Turkish", zh: "土耳其语" },
    form: "çay",
    record: { en: "chai family", zh: "chai 词族" },
    x: 57,
    y: 24,
    beat: 1,
  },
  {
    id: "mongolian",
    place: { en: "Steppe branch", zh: "草原分支" },
    language: { en: "Mongolian", zh: "蒙古语" },
    form: "цай",
    record: { en: "chai family", zh: "chai 词族" },
    x: 38,
    y: 72,
    beat: 1,
  },
  {
    id: "russian",
    place: { en: "Northern branch", zh: "北向分支" },
    language: { en: "Russian", zh: "俄语" },
    form: "чай",
    record: { en: "chai family", zh: "chai 词族" },
    x: 73,
    y: 16,
    beat: 2,
  },
  {
    id: "hindi",
    place: { en: "Southern branch", zh: "南向分支" },
    language: { en: "Hindi", zh: "印地语" },
    form: "चाय",
    record: { en: "chai family", zh: "chai 词族" },
    x: 62,
    y: 72,
    beat: 2,
  },
  {
    id: "greek",
    place: { en: "Southeast Europe", zh: "东南欧" },
    language: { en: "Greek", zh: "希腊语" },
    form: "τσάι",
    record: { en: "chai family", zh: "chai 词族" },
    x: 86,
    y: 42,
    beat: 3,
  },
] as const;

function LandRouteMap({ lang, beat }: { lang: Lang; beat: number }) {
  return (
    <div className={styles.landRouteMap} data-beat-layout-item="true">
      <div className={styles.corridorBands} aria-hidden="true"><i /><i /><i /></div>
      <svg className={styles.landRouteSvg} viewBox="0 0 1000 650" aria-hidden="true">
        <path className={styles.landMainLine} d="M120 340 C218 306 286 284 370 270 C474 252 542 196 575 160 C666 124 740 114 770 110" />
        <path className={styles.landBranchLine} data-revealed={beat >= 1 ? "true" : "false"} d="M370 270 C356 365 345 415 380 470" />
        <path className={styles.landBranchLine} data-revealed={beat >= 2 ? "true" : "false"} d="M370 270 C490 354 561 418 620 470" />
        <path className={styles.landBranchLine} data-revealed={beat >= 3 ? "true" : "false"} d="M575 160 C710 218 798 256 860 285" />
      </svg>
      <div className={styles.networkStatement}>
        <span>{lang === "zh" ? "交换网络" : "EXCHANGE NETWORK"}</span>
        <strong>{lang === "zh" ? "不是一支商队，也不是单向因果" : "not one caravan · not one-way causation"}</strong>
      </div>
      {LAND_NODES.map((node) => (
        <article
          key={node.id}
          className={styles.routeNode}
          style={{ left: `${node.x}%`, top: `${node.y}%` }}
          data-land-language-node="true"
          data-revealed={beat >= node.beat ? "true" : "false"}
          data-current={beat === node.beat ? "true" : "false"}
        >
          <span>{node.place[lang]}</span>
          <strong>{node.form}</strong>
          <b>{node.language[lang]}</b>
          <small>{node.record[lang]}</small>
        </article>
      ))}
    </div>
  );
}

const EXCEPTIONS = {
  en: [
    {
      route: "SEA → CHA",
      title: "Portuguese chá",
      body: "Direct maritime contact with China carries a ch-form—the clearest check against a literal sea/land law.",
      mark: "MARITIME EXCEPTION",
    },
    {
      route: "1590s → 1650s",
      title: "English chaa → tea",
      body: "One language records a ch-form before the later t-form becomes standard; borrowing has timing and replacement.",
      mark: "MULTIPLE ARRIVALS",
    },
    {
      route: "XIAMEN ↔ BATAVIA",
      title: "Dutch thee had a braided entry",
      body: "The evidence supports Xiamen, Java contact, or both—not a single invented port-to-word arrow.",
      mark: "PATH UNCERTAINTY",
    },
  ],
  zh: [
    {
      route: "海路 → CHA",
      title: "葡萄牙语 chá",
      body: "与中国直接海上接触却带来 ch 词形，是反对“海陆铁律”的最清楚校验。",
      mark: "海路例外",
    },
    {
      route: "1590 年代 → 1650 年代",
      title: "英语 chaa → tea",
      body: "同一语言先记录 ch 词形，之后 t 词形成为主流；借词存在时差与替换。",
      mark: "多次抵达",
    },
    {
      route: "厦门 ↔ 巴达维亚",
      title: "荷兰语 thee 的入口是编织式的",
      body: "证据支持厦门、爪哇接触或两者共同作用，不支持虚构唯一港口箭头。",
      mark: "路径不确定",
    },
  ],
} as const;

function ExceptionMap({ lang }: { lang: Lang }) {
  return (
    <div className={styles.exceptionMap} data-beat-layout-item="true">
      <div className={styles.patternSeal}>
        <span>{lang === "zh" ? "强模式" : "STRONG PATTERN"}</span>
        <i />
        <strong>{lang === "zh" ? "不是铁律" : "NOT A RULE"}</strong>
      </div>
      <svg className={styles.exceptionRoutes} viewBox="0 0 1000 650" aria-hidden="true">
        <path className={styles.exceptionSeaLine} d="M160 170 C310 72 423 123 500 318" />
        <path className={styles.exceptionMixedLine} d="M160 486 C315 567 424 513 500 318" />
        <path className={styles.exceptionLandLine} d="M840 180 C696 88 584 144 500 318" />
        <path className={styles.exceptionMixedLine} d="M840 476 C690 560 578 500 500 318" />
      </svg>
      <div className={styles.exceptionCards}>
        {EXCEPTIONS[lang].map((item, index) => (
          <article key={item.title} data-route-exception="true" data-exception-index={index + 1}>
            <span>{item.route}</span>
            <strong>{item.title}</strong>
            <p>{item.body}</p>
            <b>{item.mark}</b>
          </article>
        ))}
      </div>
    </div>
  );
}

function EvidenceStrip({ scene, lang }: { scene: number; lang: Lang }) {
  const rows =
    scene === 1
      ? TEA_CHA_EVIDENCE.slice(0, 4)
      : scene === 2
        ? TEA_CHA_EVIDENCE.slice(0, 5)
        : scene === 3
          ? TEA_CHA_EVIDENCE.slice(5, 8)
          : scene === 4
            ? TEA_CHA_EVIDENCE.slice(8, 11)
            : TEA_CHA_EVIDENCE.slice(11, 14);

  return (
    <aside className={styles.evidenceStrip} data-beat-layout-item="true">
      <div className={styles.evidenceHeader}>
        <span>{lang === "zh" ? "证据表" : "EVIDENCE LEDGER"}</span>
        <small>{lang === "zh" ? "记录标记 ≠ 最早口语" : "record marker ≠ first utterance"}</small>
      </div>
      <div className={styles.evidenceRows}>
        {rows.map((row) => (
          <div key={`${row.language.en}-${row.form}`} data-evidence-family={row.path}>
            <span>{row.language[lang]}</span>
            <strong>{row.form}</strong>
            <small>{row.record[lang]}</small>
          </div>
        ))}
      </div>
    </aside>
  );
}

function SceneVisual({ scene, lang, beat }: { scene: number; lang: Lang; beat: number }) {
  if (scene === 1) return <WordPairVisual lang={lang} />;
  if (scene === 2) return <OriginCluster lang={lang} beat={beat} />;
  if (scene === 3) return <SeaRouteMap lang={lang} beat={beat} />;
  if (scene === 4) return <LandRouteMap lang={lang} beat={beat} />;
  return <ExceptionMap lang={lang} />;
}

function ScenePanel({
  scene,
  beat,
  lang,
  isActive,
}: {
  scene: number;
  beat: number;
  lang: Lang;
  isActive: boolean;
}) {
  const activeBeat = clampBeat(scene, beat);
  const copy = getCopy(scene, lang);
  const beatCopy = copy.beats[activeBeat];

  return (
    <section
      className={styles.scene}
      data-scene-id={scene}
      data-active={isActive ? "true" : "false"}
      data-beat-layout-container="true"
      data-beat-layout-mode="reserved"
    >
      <header className={styles.sceneHeader} data-beat-layout-item="true">
        <div className={styles.sceneIndex}>
          <span>{copy.index}</span>
          <i />
          <b>{copy.kicker}</b>
        </div>
        <h1>{copy.title}</h1>
        <p>{copy.body}</p>
      </header>

      <div className={styles.visualBay} data-beat-layout-item="true">
        <SceneVisual scene={scene} lang={lang} beat={activeBeat} />
      </div>

      <div className={styles.beatCaption} data-beat-layout-item="true">
        <span>{`${activeBeat + 1} / ${copy.beats.length}`}</span>
        <div>
          <strong>{beatCopy.title}</strong>
          <p>{beatCopy.body}</p>
        </div>
      </div>

      <div className={styles.caveatCard} data-beat-layout-item="true">
        <span>{copy.evidenceLabel}</span>
        <p>{copy.caveat}</p>
      </div>

      <EvidenceStrip scene={scene} lang={lang} />
    </section>
  );
}

const NAV_COORDS = [
  [14, 21],
  [43, 43],
  [17, 77],
  [68, 80],
  [86, 25],
] as const;

function RouteNavigator({
  scene,
  lang,
  onNavigate,
}: {
  scene: number;
  lang: Lang;
  onNavigate?: (scene: number, beat: number) => void;
}) {
  const navigate = (target: number) => {
    onNavigate?.(Math.max(1, Math.min(5, target)), 0);
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLButtonElement>,
    current: number,
  ) => {
    let target: number | null = null;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      target = Math.min(5, current + 1);
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      target = Math.max(1, current - 1);
    } else if (event.key === "Home") {
      target = 1;
    } else if (event.key === "End") {
      target = 5;
    }

    if (target !== null) {
      event.preventDefault();
      event.stopPropagation();
      navigate(target);
    }
  };

  return (
    <nav
      className={styles.routeNavigator}
      aria-label={lang === "zh" ? "茶与 Cha 路线导航" : "Tea and cha route navigation"}
      data-topic-navigation="true"
      data-navigation-geometry="path"
      data-navigation-carrier="tea-cha-route-lines"
      data-navigation-invocation="persistent"
      data-navigation-feedback="next-state-preview"
    >
      <div className={styles.navTitle} aria-hidden="true">
        <span>{lang === "zh" ? "路线索引" : "ROUTE INDEX"}</span>
        <b>{lang === "zh" ? "下一站预览" : "NEXT STOP PREVIEW"}</b>
      </div>
      <svg className={styles.navRouteSvg} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <path className={styles.navOriginLine} d="M14 21 C28 20 35 31 43 43" />
        <path className={styles.navSeaLine} d="M43 43 C34 55 25 68 17 77" />
        <path className={styles.navLandLine} d="M43 43 C54 58 60 68 68 80" />
        <path className={styles.navExceptionLine} d="M17 77 C41 94 69 91 86 25" />
        <path className={styles.navExceptionLine} d="M68 80 C82 66 88 47 86 25" />
      </svg>
      {SCENE_IDS.map((target, index) => {
        const next = scene < 5 ? scene + 1 : null;
        const state =
          target === scene
            ? "active"
            : target === next
              ? "next"
              : target < scene
                ? "past"
                : "future";
        const copy = getCopy(target, lang);
        return (
          <button
            key={target}
            type="button"
            className={styles.navStop}
            style={{ left: `${NAV_COORDS[index][0]}%`, top: `${NAV_COORDS[index][1]}%` }}
            data-nav-state={state}
            aria-current={target === scene ? "step" : undefined}
            aria-label={
              lang === "zh"
                ? `场景 ${target}：${copy.navLabel}`
                : `Scene ${target}: ${copy.navLabel}`
            }
            onPointerDown={(event) => event.stopPropagation()}
            onClick={(event) => {
              event.stopPropagation();
              navigate(target);
            }}
            onKeyDown={(event) => handleKeyDown(event, target)}
          >
            <span>{target}</span>
            <b>{copy.navLabel}</b>
          </button>
        );
      })}
    </nav>
  );
}

function TopicStage({
  scene,
  beat,
  language,
  isThumbnail,
  reducedMotion,
  onNavigate,
}: TopicStageProps) {
  const activeScene = clampScene(scene);
  const motionDisabled = reducedMotion || isThumbnail;

  return (
    <div
      className={styles.root}
      data-topic-id="tea-cha-routes"
      data-language={language}
      data-thumbnail={isThumbnail ? "true" : "false"}
      data-motion={motionDisabled ? "off" : "on"}
    >
      <div className={styles.atlasChrome} aria-hidden="true">
        <span>LANGUAGE GEOGRAPHY / 09</span>
        <b>茶 · TEA · CHA · CHAI</b>
      </div>
      <SpatialSceneTrack
        scene={activeScene}
        beat={beat}
        sceneIds={[...SCENE_IDS]}
        transitionKind="push-x"
        transitionMap={TRANSITION_MAP}
        transitionDurationMs={720}
        reducedMotion={motionDisabled}
        beatLayoutModes={BEAT_LAYOUT_MODES}
        className={styles.track}
        renderScene={(sceneId, sceneBeat, isActive) => (
          <ScenePanel
            scene={sceneId}
            beat={sceneBeat}
            lang={language}
            isActive={isActive}
          />
        )}
      />
      {!isThumbnail ? (
        <RouteNavigator
          scene={activeScene}
          lang={language}
          onNavigate={onNavigate}
        />
      ) : null}
    </div>
  );
}

const metadata = {
  en: buildMetadata("en"),
  zh: buildMetadata("zh"),
};

export default defineTopic({
  id: "tea-cha-routes",
  styleId: "subway-map-of-intent",
  title: {
    en: "Tea / Cha",
    zh: "茶与 Cha",
  },
  modelId: "GPT 5.6 Sol",
  Stage: TopicStage,
  metadata,
  navigation: {
    geometry: "path",
    carrier: "tea-cha-route-lines",
    invocation: "persistent",
    feedback: "next-state-preview",
  },
  transitionScore: TEA_CHA_ROUTES_TRANSITION_SCORE,
  evidence: {
    kind: "facts",
    sources: TEA_CHA_ROUTES_SOURCES,
  },
});

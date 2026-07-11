import type { CSSProperties, KeyboardEvent } from "react";
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
import styles from "./monarch-migration.module.css";

type Language = TopicStageProps["language"];
type SceneId = 1 | 2 | 3 | 4 | 5;

interface BeatCopy {
  action: string;
  title: string;
  body: string;
  marker: string;
}

interface SceneCopy {
  eyebrow: string;
  title: string;
  subtitle: string;
  scope: string;
  sceneTitle: string;
  beats: BeatCopy[];
}

const SCENE_IDS: SceneId[] = [1, 2, 3, 4, 5];

const BEAT_LAYOUT_MODES: Partial<Record<number, BeatLayoutMode>> = {
  2: "reserved",
  3: "reserved",
  4: "reserved",
};

const MONARCH_MIGRATION_TRANSITION_SCORE = {
  "1->2": "push-y",
  "2->3": "push-x",
  "3->4": "focus-swap",
  "4->5": "push-y",
} as const satisfies TopicTransitionScore;

const TRANSITION_MAP: SceneTransitionMap = MONARCH_MIGRATION_TRANSITION_SCORE;

const MONARCH_MIGRATION_SOURCES = [
  {
    authority: "U.S. Fish and Wildlife Service",
    title: "Monarch Butterfly Species Status Assessment Report, Version 2.3",
    citation:
      "U.S. Fish and Wildlife Service. 2024. Monarch Butterfly (Danaus plexippus) Species Status Assessment Report, Version 2.3.",
    url: "https://www.fws.gov/sites/default/files/documents/2025-01/ssa_monarch-butterfly_2024.pdf",
    supports:
      "Supports the explicit separation of eastern and western North American migratory populations, their distinct Mexico and California overwintering geographies, and the habitat, insecticide, and climate pressures named in the final forest scene.",
    boundary:
      "The assessment treats population pathways and risks at continental scale; this Topic follows the eastern population's main Mexico route and does not imply that every individual, year, or alternative wintering behavior follows one identical line.",
  },
  {
    authority: "U.S. National Park Service",
    title: "Continental Nomads: Monarch Butterflies",
    citation:
      "U.S. National Park Service. 2019. Continental Nomads: Monarch Butterflies.",
    url: "https://www.nps.gov/subjects/pollinators/migratingmonarchs.htm",
    supports:
      "Supports the relay framing: eastern monarchs move north across breeding generations, while the last generation of the season can live much longer and attempts the complete southbound journey to Mexico.",
    boundary:
      "The page is an educational overview rather than an annual route forecast; the animation therefore uses broad seasonal stages and labels western monarch migration as a separate route instead of merging it into the eastern map.",
  },
  {
    authority: "Proceedings of the Royal Society B",
    title:
      "Tracking multi-generational colonization of the breeding grounds by monarch butterflies in eastern North America",
    citation:
      "Flockhart, D. T. T., et al. 2013. Proceedings of the Royal Society B 280: 20131087. doi:10.1098/rspb.2013.1087.",
    url: "https://doi.org/10.1098/rspb.2013.1087",
    supports:
      "Supports multi-generational recolonization of eastern North American breeding grounds and the use of geographically distinct generation markers rather than depicting one butterfly completing the annual north-and-south circuit.",
    boundary:
      "The isotope-based assignments describe sampled cohorts and broad source regions; the Topic avoids fixed annual borders, a universal generation count, or a claim that each year's distribution reaches the same northern extent.",
  },
  {
    authority: "Proceedings of the Royal Society B",
    title: "Juvenile hormone regulation of longevity in the migratory monarch butterfly",
    citation:
      "Herman, W. S., and M. Tatar. 2001. Proceedings of the Royal Society B 268: 2509–2514. doi:10.1098/rspb.2001.1765.",
    url: "https://doi.org/10.1098/rspb.2001.1765",
    supports:
      "Supports the contrast between shorter-lived summer adults and longer-lived eastern migrants, including the association between reproductive diapause, endocrine regulation, and persistence through migration and overwintering.",
    boundary:
      "The study combines field context with controlled experiments; the Topic calls the autumn cohort long-lived without turning one reported lifespan or one hormonal mechanism into a guaranteed outcome for every migrant.",
  },
] as const satisfies readonly (Source & {
  authority: string;
  title: string;
  citation: string;
  boundary: string;
})[];

const COPY: Record<SceneId, Record<Language, SceneCopy>> = {
  1: {
    en: {
      eyebrow: "WINTER · CENTRAL MEXICO",
      title: "The year begins in a grove holding still.",
      subtitle:
        "Eastern migratory monarchs cluster in high-elevation oyamel forest. The route is paused—not finished.",
      scope: "EASTERN NORTH AMERICAN POPULATION · MAIN MEXICO ROUTE",
      sceneTitle: "Winter grove",
      beats: [
        {
          action: "Hold the overwintering grove without moving an individual butterfly",
          title: "Winter hold",
          body: "A living cluster waits for spring conditions in central Mexico.",
          marker: "OYAMEL FOREST",
        },
      ],
    },
    zh: {
      eyebrow: "冬季 · 墨西哥中部",
      title: "一年的开端，是一片静止的林地。",
      subtitle: "北美东部迁徙帝王蝶聚集在高海拔圣杉林。路线暂停，并未结束。",
      scope: "北美东部迁徙种群 · 墨西哥主路线",
      sceneTitle: "越冬林地",
      beats: [
        {
          action: "保持越冬林地静止，不让单只蝶移动",
          title: "冬季停驻",
          body: "一个活着的蝶群在墨西哥中部等待春季条件。",
          marker: "圣杉林",
        },
      ],
    },
  },
  2: {
    en: {
      eyebrow: "SPRING · NORTHBOUND RELAY",
      title: "North is reached by handing the journey on.",
      subtitle:
        "Overwintered adults leave Mexico, breed in the southern United States, and end their stage of the route.",
      scope: "RELAY, NOT A ROUND TRIP",
      sceneTitle: "Spring relay",
      beats: [
        {
          action: "Open the first northbound leg from Mexico",
          title: "Wintered adults move north",
          body: "The same long-lived adults that overwintered begin the spring remigration.",
          marker: "MEXICO → SOUTH",
        },
        {
          action: "Stop the first cohort beside emerging milkweed",
          title: "Eggs become the handoff",
          body: "Adults lay on milkweed in the southern United States; their route ends here.",
          marker: "MILKWEED HANDOFF",
        },
        {
          action: "Start the next generation farther north",
          title: "Relay, not a round trip",
          body: "The next generation continues north. No single butterfly completes the annual loop.",
          marker: "NEW GENERATION",
        },
      ],
    },
    zh: {
      eyebrow: "春季 · 向北接力",
      title: "北方不是一次飞到，而是一代代交接。",
      subtitle: "越冬成蝶离开墨西哥，在美国南部繁殖，并在那里结束自己的路段。",
      scope: "接力，不是同一只蝶往返",
      sceneTitle: "春季接力",
      beats: [
        {
          action: "打开从墨西哥向北的第一段",
          title: "越冬成蝶开始北返",
          body: "完成越冬的长寿成蝶，开始春季再迁徙。",
          marker: "墨西哥 → 南部",
        },
        {
          action: "让第一批成蝶停在新生乳草旁",
          title: "卵就是交接棒",
          body: "成蝶在美国南部乳草上产卵；它们自己的路程在这里结束。",
          marker: "乳草交接",
        },
        {
          action: "让下一代从更北处继续",
          title: "接力，不是同一只蝶往返",
          body: "下一代继续向北；没有一只蝶完成全年闭环。",
          marker: "新一代",
        },
      ],
    },
  },
  3: {
    en: {
      eyebrow: "LATE SPRING + SUMMER · GENERATION RINGS",
      title: "The range fills through successive generations.",
      subtitle:
        "Breeding waves extend through the central and northern United States into southern Canada.",
      scope: "GENERATION COUNT AND REACH VARY BY PLACE AND YEAR",
      sceneTitle: "Generation rings",
      beats: [
        {
          action: "Add the first spring-born generation across the central range",
          title: "One generation carries one section",
          body: "Spring-born adults expand the breeding range as milkweed becomes available.",
          marker: "SPRING GENERATION",
        },
        {
          action: "Layer successive generations across the northern breeding range",
          title: "Successive generations complete the expansion",
          body: "Several breeding generations can occur; their number and reach vary by place and year.",
          marker: "SUMMER GENERATIONS",
        },
      ],
    },
    zh: {
      eyebrow: "晚春 + 夏季 · 世代年轮",
      title: "繁殖范围由连续世代共同铺开。",
      subtitle: "繁殖波从美国中部与北部延伸到加拿大南部。",
      scope: "世代数量与最北范围因地点和年份而异",
      sceneTitle: "世代年轮",
      beats: [
        {
          action: "加入覆盖中部范围的第一批春生世代",
          title: "一代只承担一段",
          body: "春生成蝶随着乳草出现，扩大繁殖范围。",
          marker: "春季世代",
        },
        {
          action: "把连续世代叠进北部繁殖范围",
          title: "连续世代共同完成扩展",
          body: "一年可出现多个繁殖世代；数量与到达范围随地点和年份改变。",
          marker: "夏季世代",
        },
      ],
    },
  },
  4: {
    en: {
      eyebrow: "AUTUMN · THE LONG RETURN",
      title: "Then one long-lived generation turns south.",
      subtitle:
        "The autumn cohort delays reproduction, stores fuel, and follows a converging route toward central Mexico.",
      scope: "SUPER GENERATION · ONE LONG SOUTHBOUND JOURNEY",
      sceneTitle: "Autumn return",
      beats: [
        {
          action: "Cool the seasonal field and hold the northern cohort",
          title: "Seasonal cues change the life strategy",
          body: "Decreasing day length and cooler conditions help produce the migratory state.",
          marker: "MIGRATORY STATE",
        },
        {
          action: "Name reproductive diapause and extended adult life",
          title: "The super generation lasts longer",
          body: "Delayed reproduction and exceptional longevity distinguish fall migrants from summer adults.",
          marker: "LONG-LIVED COHORT",
        },
        {
          action: "Draw one continuous route southwest through the continental funnel",
          title: "Many origins converge",
          body: "Eastern migrants funnel toward Texas and northern Mexico; routes vary with weather and geography.",
          marker: "CONTINENTAL FUNNEL",
        },
        {
          action: "Complete the return to the oyamel forest",
          title: "One long southbound journey",
          body: "The super generation reaches central Mexico, overwinters, and can begin the next spring remigration.",
          marker: "FOREST RETURN",
        },
      ],
    },
    zh: {
      eyebrow: "秋季 · 漫长南返",
      title: "随后，一个长寿世代转向南方。",
      subtitle: "秋季蝶群延迟繁殖、积累能量，沿逐渐汇合的路线前往墨西哥中部。",
      scope: "超级世代 · 一段漫长南返旅程",
      sceneTitle: "秋季南返",
      beats: [
        {
          action: "冷却季节色场，让北方蝶群停驻",
          title: "季节线索改变生命策略",
          body: "日照缩短与气温转凉，有助于形成迁徙状态。",
          marker: "迁徙状态",
        },
        {
          action: "标出生殖滞育与更长成蝶寿命",
          title: "超级世代活得更久",
          body: "延迟繁殖和超常寿命，使秋季迁徙蝶区别于夏季成蝶。",
          marker: "长寿蝶群",
        },
        {
          action: "画出穿过大陆汇合带的连续西南路线",
          title: "多处起点逐渐汇合",
          body: "东部迁徙蝶汇向得州和墨西哥北部；路线随天气与地理而变化。",
          marker: "大陆汇合带",
        },
        {
          action: "让路线回到圣杉林",
          title: "一段漫长南返旅程",
          body: "超级世代抵达墨西哥中部越冬，并可在下一年春季开始再迁徙。",
          marker: "重返林地",
        },
      ],
    },
  },
  5: {
    en: {
      eyebrow: "FOREST HOLD · CYCLE WITH BOUNDARIES",
      title: "A population completes what no one butterfly can.",
      subtitle:
        "Habitat loss and degradation, insecticides, climate, and extreme weather can break the relay at different points.",
      scope:
        "EASTERN MIGRATORY POPULATION SHOWN · WESTERN ROUTES ARE SEPARATE",
      sceneTitle: "Forest hold",
      beats: [
        {
          action: "Return quietly to the forest and state the map boundary",
          title: "Four seasons, multiple lives",
          body: "Annual paths vary. This map follows the eastern Mexico route; western routes and other monarch populations are separate stories.",
          marker: "RELAY CONTINUES",
        },
      ],
    },
    zh: {
      eyebrow: "林地停驻 · 有边界的循环",
      title: "一个种群，完成单只帝王蝶做不到的旅程。",
      subtitle: "栖息地丧失与退化、杀虫剂、气候与极端天气，可能在不同环节打断接力。",
      scope: "仅示北美东部迁徙种群 · 西部路线另行叙述",
      sceneTitle: "林地停驻",
      beats: [
        {
          action: "安静回到林地并声明地图边界",
          title: "四季，多次生命",
          body: "年度路径会变化。本图只沿东部墨西哥路线；西部路线与其他帝王蝶种群是不同叙事。",
          marker: "接力继续",
        },
      ],
    },
  },
};

const NAV_LABELS: Record<Language, string[]> = {
  en: ["Winter grove", "Spring relay", "Generation rings", "Autumn return", "Forest hold"],
  zh: ["越冬林地", "春季接力", "世代年轮", "秋季南返", "林地停驻"],
};

const NAV_MATERIALS = [
  "winter-walnut",
  "spring-sage",
  "summer-ochre",
  "autumn-rust",
  "forest-cream",
] as const;

function isSceneId(scene: number): scene is SceneId {
  return SCENE_IDS.includes(scene as SceneId);
}

function safeBeat(scene: SceneId, beat: number, isThumbnail: boolean): number {
  const lastBeat = COPY[scene].en.beats.length - 1;
  if (isThumbnail) return lastBeat;
  return Math.max(0, Math.min(beat, lastBeat));
}

function revealStyle(active: boolean, delay = 0): CSSProperties {
  return { "--reveal": active ? 1 : 0, "--reveal-delay": `${delay}ms` } as CSSProperties;
}

function ButterflyMark({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 120 92" aria-hidden="true">
      <path className={styles.wing} d="M57 45 C38 4 2 5 9 33 C13 51 34 56 54 55Z" />
      <path className={styles.wing} d="M63 45 C82 4 118 5 111 33 C107 51 86 56 66 55Z" />
      <path className={styles.wingLower} d="M54 56 C33 54 18 64 25 82 C41 84 52 74 59 62Z" />
      <path className={styles.wingLower} d="M66 56 C87 54 102 64 95 82 C79 84 68 74 61 62Z" />
      <path className={styles.butterflyBody} d="M58 28 C63 27 66 34 64 62 C63 73 57 73 56 62 C54 36 55 30 58 28Z" />
      <path className={styles.antenna} d="M59 29 C51 18 47 15 40 12 M61 29 C69 18 73 15 80 12" />
    </svg>
  );
}

function ContinentalBase() {
  return (
    <>
      <path
        className={styles.landMass}
        d="M202 90 C286 34 446 30 556 86 C618 119 676 190 688 268 C704 359 644 430 578 470 C516 507 505 552 464 602 C419 660 357 646 321 602 C287 561 278 509 236 469 C184 421 128 363 130 282 C132 198 153 126 202 90Z"
      />
      <path
        className={styles.easternField}
        d="M395 86 C504 69 604 121 660 207 C708 281 676 380 600 438 C543 482 510 539 464 602 C424 653 370 642 344 595 C320 551 337 486 306 443 C274 398 268 332 292 270 C320 194 350 128 395 86Z"
      />
      <path className={styles.rockyBoundary} d="M314 96 C290 188 310 264 287 342 C268 410 288 485 326 564" />
      <path className={styles.gulfCut} d="M305 446 C352 455 390 440 414 402 C432 373 458 367 492 384" />
    </>
  );
}

function WinterGroveVisual() {
  return (
    <div className={styles.groveVisual} data-visual="winter-grove">
      <svg viewBox="0 0 780 640" aria-hidden="true">
        <circle className={styles.winterSun} cx="620" cy="102" r="54" />
        {[92, 186, 280, 374, 468, 562, 656].map((x, index) => (
          <g key={x} className={styles.oyamelTree} opacity={0.52 + index * 0.04}>
            <path d={`M${x} 566 C${x - 12} 420 ${x + 8} 250 ${x - 2} 76`} />
            <path d={`M${x - 8} 218 C${x - 68} 184 ${x - 76} 146 ${x - 102} 116`} />
            <path d={`M${x + 2} 286 C${x + 60} 248 ${x + 76} 214 ${x + 104} 190`} />
          </g>
        ))}
        <path className={styles.forestFloor} d="M48 566 C210 528 532 536 730 578" />
      </svg>
      <span className={styles.clusterPosition}>
        <ButterflyMark
          className={styles.clusterButterfly}
        />
      </span>
      <p className={styles.visualCaption}>OYAMEL / ABIES RELIGIOSA</p>
    </div>
  );
}

function SpringPathVisual({ beat, language }: { beat: number; language: Language }) {
  const labels = language === "zh"
    ? ["墨西哥中部", "美国南部", "下一代", "北部繁殖区"]
    : ["CENTRAL MEXICO", "SOUTHERN U.S.", "NEXT GENERATION", "NORTHERN RANGE"];
  return (
    <div className={styles.mapVisual} data-visual="spring-path">
      <svg viewBox="0 0 780 680" aria-hidden="true">
        <ContinentalBase />
        <path className={styles.routeGhost} d="M445 603 C398 520 392 452 412 382 C434 307 470 246 508 181" />
        <path
          className={styles.springRoute}
          data-active={beat >= 0 ? "true" : "false"}
          d="M445 603 C418 548 403 501 400 455"
        />
        <path
          className={styles.springRoute}
          data-active={beat >= 1 ? "true" : "false"}
          d="M400 455 C402 422 406 399 412 382"
        />
        <path
          className={styles.springRoute}
          data-active={beat >= 2 ? "true" : "false"}
          d="M412 382 C434 307 470 246 508 181"
        />
        <circle className={styles.routeNode} data-active="true" cx="445" cy="603" r="12" />
        <circle className={styles.routeNode} data-active={beat >= 1 ? "true" : "false"} cx="400" cy="455" r="15" />
        <circle className={styles.generationNode} data-active={beat >= 2 ? "true" : "false"} cx="412" cy="382" r="24" />
        <circle className={styles.generationNode} data-active={beat >= 2 ? "true" : "false"} cx="508" cy="181" r="30" />
      </svg>
      <div className={styles.mapLabels}>
        {labels.map((label, index) => (
          <span
            key={label}
            className={styles.mapLabel}
            data-active={index <= beat + 1 ? "true" : "false"}
            data-position={index + 1}
          >
            {label}
          </span>
        ))}
      </div>
      <div className={styles.handoffKey} data-active={beat >= 1 ? "true" : "false"}>
        <span className={styles.oldCohort} />
        <span>{language === "zh" ? "上一代在此结束" : "previous cohort ends"}</span>
        <span className={styles.newCohort} />
        <span>{language === "zh" ? "下一代继续" : "next generation continues"}</span>
      </div>
    </div>
  );
}

function GenerationRingsVisual({ beat, language }: { beat: number; language: Language }) {
  const rings = language === "zh"
    ? ["越冬成蝶", "春生世代", "夏季连续世代"]
    : ["WINTERED ADULTS", "SPRING-BORN", "SUMMER SUCCESSION"];
  return (
    <div className={styles.ringsVisual} data-visual="generation-rings">
      <svg viewBox="0 0 760 650" aria-hidden="true">
        <path className={styles.ringLand} d="M252 84 C390 30 578 118 624 254 C660 361 590 474 506 522 C431 565 421 630 355 624 C294 618 280 548 232 509 C168 457 130 374 151 279 C171 191 197 114 252 84Z" />
        <ellipse className={styles.generationRing} data-active="true" cx="370" cy="476" rx="88" ry="70" />
        <ellipse className={styles.generationRing} data-active="true" cx="398" cy="370" rx="152" ry="122" />
        <ellipse className={styles.generationRing} data-active={beat >= 1 ? "true" : "false"} cx="430" cy="276" rx="228" ry="192" />
        <path className={styles.ringSpine} d="M356 534 C376 449 390 369 424 289 C446 237 470 191 496 138" />
        {[{x:356,y:534},{x:390,y:402},{x:434,y:288},{x:496,y:138}].map((point, index) => (
          <circle
            key={`${point.x}-${point.y}`}
            className={styles.ringMarker}
            data-active={index <= beat + 2 ? "true" : "false"}
            cx={point.x}
            cy={point.y}
            r={10 + index * 3}
          />
        ))}
      </svg>
      <div className={styles.ringLegend}>
        {rings.map((ring, index) => (
          <span key={ring} data-active={index <= beat + 1 ? "true" : "false"}>
            <i data-ring={index + 1} />{ring}
          </span>
        ))}
      </div>
      <p className={styles.variabilityNote}>
        {language === "zh"
          ? "边界为季节范围示意，不是固定年度疆界。"
          : "Seasonal range schematic—not a fixed annual border."}
      </p>
    </div>
  );
}

function AutumnReturnVisual({ beat, language }: { beat: number; language: Language }) {
  const stations = language === "zh"
    ? ["北部起点", "迁徙状态", "得州汇合", "墨西哥圣杉林"]
    : ["NORTHERN ORIGINS", "MIGRATORY STATE", "TEXAS FUNNEL", "MEXICO GROVE"];
  return (
    <div className={styles.autumnVisual} data-visual="autumn-return">
      <svg viewBox="0 0 780 680" aria-hidden="true">
        <ContinentalBase />
        <path className={styles.autumnGhost} d="M521 150 C520 254 481 348 424 432 C390 482 410 542 446 608" />
        <path
          className={styles.autumnRoute}
          data-active={beat >= 2 ? "true" : "false"}
          d="M521 150 C520 254 481 348 424 432 C390 482 410 542 446 608"
        />
        <path className={styles.convergeRoute} data-active={beat >= 2 ? "true" : "false"} d="M612 210 C556 272 500 337 424 432" />
        <path className={styles.convergeRoute} data-active={beat >= 2 ? "true" : "false"} d="M365 184 C392 270 398 348 424 432" />
        <g className={styles.cohortCluster} data-active={beat >= 0 ? "true" : "false"}>
          <circle cx="482" cy="132" r="12" /><circle cx="510" cy="150" r="15" />
          <circle cx="540" cy="130" r="11" /><circle cx="566" cy="162" r="13" />
        </g>
        <circle className={styles.diapauseRing} data-active={beat >= 1 ? "true" : "false"} cx="521" cy="150" r="58" />
        <circle className={styles.returnNode} data-active={beat >= 3 ? "true" : "false"} cx="446" cy="608" r="23" />
      </svg>
      <div className={styles.autumnStations}>
        {stations.map((station, index) => (
          <span key={station} data-active={index <= beat ? "true" : "false"} data-station={index + 1}>
            <i />{station}
          </span>
        ))}
      </div>
      <div className={styles.cohortNote} data-active={beat >= 1 ? "true" : "false"}>
        <ButterflyMark />
        <span>
          {language === "zh"
            ? "蝶形代表秋季蝶群，不是一只被追踪的个体"
            : "cohort symbol—not one tracked insect"}
        </span>
      </div>
    </div>
  );
}

function ForestHoldVisual({ language }: { language: Language }) {
  const riskLabels = language === "zh"
    ? ["繁殖地", "迁徙通道", "越冬林"]
    : ["BREEDING HABITAT", "MIGRATION CORRIDOR", "OVERWINTERING FOREST"];
  return (
    <div className={styles.holdVisual} data-visual="forest-hold">
      <svg viewBox="0 0 780 630" aria-hidden="true">
        <circle className={styles.holdSun} cx="592" cy="122" r="65" />
        {[148, 270, 392, 514, 636].map((x, index) => (
          <g key={x} className={styles.holdTree} opacity={0.66 + index * 0.06}>
            <path d={`M${x} 570 C${x - 10} 410 ${x + 8} 246 ${x} 72`} />
            <path d={`M${x} 252 C${x - 62} 218 ${x - 78} 174 ${x - 104} 144`} />
            <path d={`M${x + 2} 326 C${x + 58} 284 ${x + 79} 252 ${x + 103} 224`} />
          </g>
        ))}
        <path className={styles.holdGround} d="M74 566 C272 520 532 526 714 574" />
      </svg>
      <div className={styles.riskArc}>
        {riskLabels.map((label, index) => (
          <span key={label} data-risk={index + 1}><i />{label}</span>
        ))}
      </div>
      <p className={styles.holdBoundary}>
        {language === "zh" ? "地图边界：东部种群 → 墨西哥" : "MAP BOUNDARY: EASTERN POPULATION → MEXICO"}
      </p>
    </div>
  );
}

function SceneVisual({ scene, beat, language }: { scene: SceneId; beat: number; language: Language }) {
  switch (scene) {
    case 1:
      return <WinterGroveVisual />;
    case 2:
      return <SpringPathVisual beat={beat} language={language} />;
    case 3:
      return <GenerationRingsVisual beat={beat} language={language} />;
    case 4:
      return <AutumnReturnVisual beat={beat} language={language} />;
    case 5:
      return <ForestHoldVisual language={language} />;
  }
}

const COMPOSITIONS: Record<SceneId, string> = {
  1: "vertical-winter-grove",
  2: "diagonal-spring-relay",
  3: "concentric-generation-field",
  4: "descending-autumn-route",
  5: "quiet-forest-boundary",
};

function ScenePanel({
  scene,
  beat,
  language,
  isThumbnail,
  isActive,
}: {
  scene: SceneId;
  beat: number;
  language: Language;
  isThumbnail: boolean;
  isActive: boolean;
}) {
  const copy = COPY[scene][language];
  const displayBeat = safeBeat(scene, beat, isThumbnail);
  const activeCopy = copy.beats[displayBeat];

  return (
    <section
      className={`${styles.scene} ${styles[`scene${scene}`]}`}
      data-scene={scene}
      data-beat={displayBeat}
      data-composition={COMPOSITIONS[scene]}
      data-scene-active={isActive ? "true" : "false"}
      data-beat-layout-container={copy.beats.length > 1 ? "true" : undefined}
      data-beat-layout-mode={copy.beats.length > 1 ? "reserved" : undefined}
    >
      <div className={styles.seasonField} aria-hidden="true" />
      <header className={styles.copyBlock} data-beat-layout-item="true">
        <p className={styles.eyebrow}>{copy.eyebrow}</p>
        <h1>{copy.title}</h1>
        <p className={styles.subtitle}>{copy.subtitle}</p>
      </header>

      <div className={styles.visualBlock} data-beat-layout-item="true">
        <SceneVisual scene={scene} beat={displayBeat} language={language} />
      </div>

      <div className={styles.beatStatement} data-beat-layout-item="true">
        <span>{activeCopy.marker}</span>
        <strong>{activeCopy.title}</strong>
        <p>{activeCopy.body}</p>
      </div>

      <div className={styles.beatRail} aria-hidden="true">
        {copy.beats.map((item, index) => (
          <i
            key={item.marker}
            data-active={index <= displayBeat ? "true" : "false"}
            style={revealStyle(index <= displayBeat, index * 90)}
          />
        ))}
      </div>
      <p className={styles.scopeLine}>{copy.scope}</p>
    </section>
  );
}

function SeasonalHalo({
  activeScene,
  language,
  onNavigate,
}: {
  activeScene: SceneId;
  language: Language;
  onNavigate?: (scene: number, beat: number) => void;
}) {
  const navigate = (target: SceneId) => onNavigate?.(target, 0);

  const handleKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    target: SceneId,
  ) => {
    event.stopPropagation();
    const index = SCENE_IDS.indexOf(target);
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault();
      navigate(SCENE_IDS[Math.min(SCENE_IDS.length - 1, index + 1)]);
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault();
      navigate(SCENE_IDS[Math.max(0, index - 1)]);
    } else if (event.key === "Home") {
      event.preventDefault();
      navigate(1);
    } else if (event.key === "End") {
      event.preventDefault();
      navigate(5);
    }
  };

  return (
    <nav
      className={styles.seasonalHalo}
      aria-label={language === "zh" ? "季节场景导航" : "Seasonal scene navigation"}
      data-topic-navigation="true"
      data-navigation-geometry="ambient"
      data-navigation-carrier="seasonal-halo"
      data-navigation-invocation="keyboard-focus"
      data-navigation-feedback="material-color-change"
      data-active-material={NAV_MATERIALS[activeScene - 1]}
      onClick={(event) => event.stopPropagation()}
      onPointerDown={(event) => event.stopPropagation()}
    >
      <span className={styles.haloCore} aria-hidden="true">
        <ButterflyMark />
      </span>
      {SCENE_IDS.map((target, index) => (
        <button
          key={target}
          type="button"
          aria-label={`Scene ${target}: ${NAV_LABELS[language][index]}`}
          aria-current={target === activeScene ? "step" : undefined}
          data-active={target === activeScene ? "true" : "false"}
          data-position={target}
          data-material={NAV_MATERIALS[index]}
          onClick={(event) => {
            event.stopPropagation();
            navigate(target);
          }}
          onPointerDown={(event) => event.stopPropagation()}
          onKeyDown={(event) => handleKeyDown(event, target)}
        >
          <i aria-hidden="true" />
          <span>{NAV_LABELS[language][index]}</span>
        </button>
      ))}
    </nav>
  );
}

function buildMetadata(language: Language): TopicMetadata {
  return {
    theme: language === "zh" ? "四代完成一次迁徙" : "Four Generations, One Migration",
    densityLabel: language === "zh" ? "视觉叙事" : "Visual narrative",
    heroScene: 4,
    colors: {
      bg: "#17382a",
      ink: "#f1e3bf",
      panel: "#28503b",
    },
    typography: {
      header: "Iowan Old Style 600",
      body: "Avenir Next 500",
    },
    tags: [
      "mid-century",
      "organic-map",
      "migration",
      "warm-organic",
      "visual-narrative",
      "atmospheric-drift",
    ],
    fonts: [
      "Iowan Old Style",
      "Avenir Next",
      "cjk:Songti SC",
      "cjk:PingFang SC",
    ],
    scenes: SCENE_IDS.map((scene) => {
      const copy = COPY[scene][language];
      return {
        id: scene,
        title: copy.sceneTitle,
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

const METADATA = {
  en: buildMetadata("en"),
  zh: buildMetadata("zh"),
};

function TopicStage({
  scene,
  beat,
  language,
  isThumbnail,
  reducedMotion,
  onNavigate,
}: TopicStageProps) {
  const activeScene = isSceneId(scene) ? scene : 1;
  const motionOff = reducedMotion || isThumbnail;

  return (
    <main
      className={`${styles.root} ${motionOff ? styles.motionOff : ""}`}
      data-topic-id="monarch-migration"
      data-current-scene={activeScene}
      data-motion-state={motionOff ? "settled" : "gentle"}
    >
      <SpatialSceneTrack
        scene={activeScene}
        beat={beat}
        transitionKind="push-y"
        transitionMap={TRANSITION_MAP}
        transitionDurationMs={840}
        reducedMotion={motionOff}
        beatLayoutModes={BEAT_LAYOUT_MODES}
        className={styles.sceneTrack}
        renderScene={(trackScene, trackBeat, isActive) => (
          <ScenePanel
            scene={isSceneId(trackScene) ? trackScene : 1}
            beat={trackBeat}
            language={language}
            isThumbnail={isThumbnail}
            isActive={isActive}
          />
        )}
      />
      {!isThumbnail && (
        <SeasonalHalo
          activeScene={activeScene}
          language={language}
          onNavigate={onNavigate}
        />
      )}
    </main>
  );
}

export default defineTopic({
  id: "monarch-migration",
  styleId: "mid-century-grove",
  title: {
    en: "Monarch Migration",
    zh: "帝王蝶迁徙",
  },
  modelId: "GPT 5.6 Sol",
  Stage: TopicStage,
  metadata: METADATA,
  navigation: {
    geometry: "ambient",
    carrier: "seasonal-halo",
    invocation: "keyboard-focus",
    feedback: "material-color-change",
  },
  transitionScore: MONARCH_MIGRATION_TRANSITION_SCORE,
  evidence: {
    kind: "facts",
    sources: MONARCH_MIGRATION_SOURCES,
  },
});

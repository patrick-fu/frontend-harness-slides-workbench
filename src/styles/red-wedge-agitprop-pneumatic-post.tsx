import { useRef } from "react";
import type React from "react";
import type {
  BespokeStyleProps,
  StyleMetadata,
  TopicSource,
  TopicTransitionScore,
} from "../types";
import SpatialSceneTrack, {
  type BeatLayoutMode,
  type SceneTransitionMap,
  type SceneTransitionModifierMap,
} from "./SpatialSceneTrack";
import { defineStyleTopic } from "./topic";
import styles from "./red-wedge-agitprop-pneumatic-post.module.css";

type Language = BespokeStyleProps["language"];
type SceneId = 1 | 2 | 3 | 4 | 5;

interface BeatCopy {
  action: string;
  title: string;
  body: string;
}

interface SceneCopy {
  kicker: string;
  title: string;
  subtitle: string;
  beats: BeatCopy[];
}

const SCENE_IDS: SceneId[] = [1, 2, 3, 4, 5];

const BEAT_LAYOUT_MODES: Record<number, BeatLayoutMode> = {
  1: "reserved",
  2: "reserved",
  3: "reserved",
  4: "reserved",
  5: "reserved",
};

export const PNEUMATIC_POST_TRANSITION_SCORE = {
  "1->2": "diagonal-pan",
  "2->3": "split-merge",
  "3->4": "dip-to-color",
  "4->5": "diagonal-pan",
} as const satisfies Readonly<TopicTransitionScore>;

const TRANSITION_MAP: SceneTransitionMap = PNEUMATIC_POST_TRANSITION_SCORE;

const TRANSITION_MODIFIER_MAP: SceneTransitionModifierMap = {
  "3->4": "pneumatic-burst",
};

export const PNEUMATIC_POST_SOURCES = [
  {
    authority: "Comité pour l’histoire de la Poste",
    title: "Le réseau avant l’heure : la Poste pneumatique à Paris (1866–1984)",
    citation:
      "Elisa Le Briand and Anne-Laure Cermak, Les Cahiers pour l’histoire de la Poste, no. 6, 2006.",
    url: "https://comitehistoire.laposte.fr/wp-content/uploads/2006/05/Cahiers-pour-lhistoire-6-CHP.pdf",
    supports:
      "Supports the Paris-only chronology, the first Bourse-area trials, the underground tube topology, force stations, manual handling, maintenance access, incidents, and the long decline of the service.",
    boundary:
      "The network changed repeatedly over almost 120 years. The route plate is a newly drawn teaching topology, not a reconstruction of one dated engineering plan or a claim that a capsule crossed the whole city without transfer.",
  },
  {
    authority: "Comité pour l’histoire de la Poste",
    title: "Il y a 140 ans, la naissance de la Poste pneumatique",
    citation:
      "Comité pour l’histoire de la Poste, Anniversaire postal no. 4, 2006.",
    url: "https://comitehistoire.laposte.fr/publication/il-y-a-140-ans-la-naissance-de-la-poste-pneumatique/",
    supports:
      "Supports the December 1866 trial, the 1879 opening to private correspondence, roughly 400 kilometres of tubes in the twentieth century, compacted bundles inside cursors, the reported 800 metres-per-minute tube speed, and the 30 March 1984 stop.",
    boundary:
      "The cited 800 m/min is cursor speed in a tube, not guaranteed door-to-door delivery time or unrestricted capacity; sorting, transfers, final delivery, tube condition, and blockages remained outside that number.",
  },
  {
    authority: "Comité pour l’histoire de la Poste / Université Paris IV Sorbonne",
    title:
      "La Poste pneumatique, un système original d’acheminement rapide du courrier",
    citation:
      "Anne-Laure Cermak, master’s research directed by Jean-Pierre Chaline, Université Paris IV Sorbonne, 2003.",
    url: "https://comitehistoire.laposte.fr/recherche/la-poste-pneumatique-un-systeme-original-dacheminement-rapide-du-courrier-lexemple-du-reseau-de-paris-des-origines-a-sa-suppression-1866-1984/",
    supports:
      "Supports the steel-tube and cylindrical-cursor mechanism driven by pressure difference, the postal/telegraph operating split, the Bourse–Grenelle expansion, less-than-an-hour service claims, and the roles of aging infrastructure, economics, telephone, and telex in decline.",
    boundary:
      "Its 450 km maximum and the commemorative publication’s rounded 400 km describe network extent at broad historical scale; this Topic therefore says ABOUT 400 KM instead of presenting a spurious exact map total.",
  },
  {
    authority: "Bibliothèque nationale de France",
    title: "La poste pneumatique de Paris — catalogue record",
    citation:
      "BnF Catalogue général, record FRBNF47124638B for Hervé Barbelin, La poste pneumatique de Paris.",
    url: "https://catalogue.bnf.fr/ark:/12148/cb47124638b",
    supports:
      "Supports the public-service boundary from 1 May 1879 to 30 March 1984 and identifies the surviving postal stationery, technical, economic, and social record as distinct forms of evidence.",
    boundary:
      "The final blue note is explicitly labeled as a reconstructed teaching form. It borrows only the folded-card logic and does not claim to reproduce any BnF-held item, handwriting, rate, address, or postmark.",
  },
] as const satisfies readonly (TopicSource & { boundary: string })[];

const COPY: Record<SceneId, Record<Language, SceneCopy>> = {
  1: {
    en: {
      kicker: "PARIS · 1866—1984",
      title: "MAIL / UNDER / PRESSURE",
      subtitle: "A written message became freight inside a city-scale tube.",
      beats: [
        {
          action: "Drive the capsule into the red pressure wedge.",
          title: "Paris pneumatic post",
          body: "First trial · 1866 / public service · 1879 / stopped · 1984 [S1–S4]",
        },
      ],
    },
    zh: {
      kicker: "巴黎 · 1866—1984",
      title: "压力 / 驱动 / 邮件",
      subtitle: "一条书面消息，曾是城市管道里的实体货物。",
      beats: [
        {
          action: "让胶囊切入红色压力楔形。",
          title: "巴黎气动邮政",
          body: "首次试验 · 1866 / 公众服务 · 1879 / 停止 · 1984 [S1–S4]",
        },
      ],
    },
  },
  2: {
    en: {
      kicker: "SECTION / ΔP",
      title: "AIR DOES THE PUSHING",
      subtitle: "Pressure behind. Lower pressure ahead. A seal makes the cursor answer.",
      beats: [
        {
          action: "Establish the pressure difference across the cursor.",
          title: "Pressure difference",
          body: "Compressed air and suction supplied force at opposite sides of a tube section. [S1, S3]",
        },
        {
          action: "Expose the cursor body and its leather sealing rings.",
          title: "Seal the annulus",
          body: "The cursor’s sealing skirt limited bypass; contact and tube condition still created friction.",
        },
        {
          action: "Release the cursor and state only the sourced operating speed.",
          title: "Reported tube speed",
          body: "800 m/min is a reported operating speed—not an end-to-end delivery promise. [S2]",
        },
      ],
    },
    zh: {
      kicker: "剖面 / 压差",
      title: "空气负责推动",
      subtitle: "后方增压，前方降压，密封让游标响应压差。",
      beats: [
        {
          action: "建立游标两侧的压力差。",
          title: "压力差",
          body: "压缩空气与抽吸在管段两侧提供驱动力。[S1, S3]",
        },
        {
          action: "揭示游标壳体与皮革密封环。",
          title: "密封环隙",
          body: "密封裙边限制漏气；接触与管况仍会带来摩擦。",
        },
        {
          action: "释放游标，只呈现有来源的运行速度。",
          title: "记录中的管内速度",
          body: "800 米/分钟是记录中的管内速度，不等于端到端交付承诺。[S2]",
        },
      ],
    },
  },
  3: {
    en: {
      kicker: "PARIS / ROUTE PLATE",
      title: "A NETWORK, NOT A TELEPORT",
      subtitle: "Tubes linked offices; stations and postal workers completed the route.",
      beats: [
        {
          action: "Draw the first Bourse–Grand-Hôtel trial connection.",
          title: "1866 test",
          body: "The first successful relation served telegraph traffic in the business centre. [S1, S2]",
        },
        {
          action: "Extend the plate into the mature Paris office network.",
          title: "About 400 km",
          body: "By the 1930s, sources describe roughly 400–450 km of tubes across Paris. [S1–S3]",
        },
      ],
    },
    zh: {
      kicker: "巴黎 / 路线图版",
      title: "它是网络，不是瞬移",
      subtitle: "管道连接邮局，站点与邮政人员完成整条路线。",
      beats: [
        {
          action: "画出证券交易所至大饭店的首条试验连接。",
          title: "1866 年试验",
          body: "第一次成功线路服务于商业中心的电报传递。[S1, S2]",
        },
        {
          action: "将图版扩展为成熟的巴黎邮局网络。",
          title: "约 400 公里",
          body: "到 1930 年代，资料记载巴黎管网约 400–450 公里。[S1–S3]",
        },
      ],
    },
  },
  4: {
    en: {
      kicker: "TRANSFER STATION / SCHEMATIC",
      title: "RECEIVE · SORT · RE-SEND",
      subtitle: "The fast tube still had a human-scale switching point.",
      beats: [
        {
          action: "Bring one cursor into the receiving chamber.",
          title: "Receive",
          body: "A cursor ends one tube leg at a staffed office.",
        },
        {
          action: "Turn the selector toward the next route.",
          title: "Sort",
          body: "Correspondence can be transferred instead of claiming one continuous citywide shot.",
        },
        {
          action: "Fire the capsule through the outbound tube with one rebound.",
          title: "Re-send",
          body: "Pressure rises; the cursor sprints, touches the stop, and settles once.",
        },
        {
          action: "Lock the cursor at the receiving endpoint.",
          title: "Delivered to office",
          body: "Final street delivery still happens outside the tube. [S1, S3]",
        },
      ],
    },
    zh: {
      kicker: "换向站 / 示意",
      title: "接收 · 分拣 · 再发送",
      subtitle: "高速管道仍然依赖人尺度的换向节点。",
      beats: [
        {
          action: "让一个游标进入接收舱。",
          title: "接收",
          body: "一个游标在有人值守的邮局结束一段管程。",
        },
        {
          action: "把选择器转向下一条线路。",
          title: "分拣",
          body: "邮件可以在此转交，而不是一次贯穿全城。",
        },
        {
          action: "游标冲入外发管道，并且只回弹一次。",
          title: "再发送",
          body: "压力建立；游标冲刺、触及止挡、一次回弹后稳定。",
        },
        {
          action: "把游标锁定在接收端点。",
          title: "送达邮局",
          body: "最后一段街道投递仍在管道之外。[S1, S3]",
        },
      ],
    },
  },
  5: {
    en: {
      kicker: "PETIT BLEU / TEACHING RECONSTRUCTION",
      title: "THE NOTE OUTLIVED THE MACHINE",
      subtitle: "Fast physical communication remained bounded by batches, access, and replacement media.",
      beats: [
        {
          action: "Unfold a reconstructed note and print the system limits beside it.",
          title: "Delivered note",
          body: "Bundled, not infinite · blockages needed access · telephone, telex, and fax changed the equation. [S1–S4]",
        },
      ],
    },
    zh: {
      kicker: "小蓝函 / 教学重构",
      title: "短笺比机器留得更久",
      subtitle: "高速实体通信仍受批次、维修入口与替代媒介约束。",
      beats: [
        {
          action: "展开一张重构短笺，并在旁边印出系统边界。",
          title: "送达短笺",
          body: "批量不等于无限 · 堵塞需要检修 · 电话、电传与传真改变了选择。[S1–S4]",
        },
      ],
    },
  },
};

const NAV_LABELS: Record<Language, string[]> = {
  en: [
    "Capsule hero",
    "Pressure section",
    "Paris tube map",
    "Switching station",
    "Delivered note",
  ],
  zh: ["胶囊主视觉", "压力剖面", "巴黎管网", "换向站", "送达短笺"],
};

function clampScene(value: number): SceneId {
  const safe = Math.min(Math.max(Math.trunc(value), 1), 5);
  return safe as SceneId;
}

function clampBeat(scene: SceneId, value: number): number {
  const max = COPY[scene].en.beats.length - 1;
  return Math.min(Math.max(Math.trunc(value), 0), max);
}

function reveal(visible: boolean): "true" | "false" {
  return visible ? "true" : "false";
}

function SceneHeader({
  number,
  copy,
}: {
  number: SceneId;
  copy: SceneCopy;
}) {
  return (
    <header className={styles.sceneHeader} data-beat-layout-item="true">
      <span className={styles.sceneNumber}>0{number}</span>
      <div>
        <p className={styles.kicker}>{copy.kicker}</p>
        <h2>{copy.title}</h2>
        <p className={styles.subtitle}>{copy.subtitle}</p>
      </div>
    </header>
  );
}

function BeatReadout({
  scene,
  beat,
  language,
}: {
  scene: SceneId;
  beat: number;
  language: Language;
}) {
  const sceneCopy = COPY[scene][language];
  const beatCopy = sceneCopy.beats[clampBeat(scene, beat)];
  return (
    <aside className={styles.beatReadout} data-beat-layout-item="true">
      <span>{String(beat + 1).padStart(2, "0")}</span>
      <div>
        <b>{beatCopy.title}</b>
        <p>{beatCopy.body}</p>
      </div>
    </aside>
  );
}

function Capsule({ className = "" }: { className?: string }) {
  return (
    <span className={[styles.capsule, className].filter(Boolean).join(" ")} aria-hidden="true">
      <i />
      <b />
      <i />
    </span>
  );
}

function SceneOne({ copy }: { copy: SceneCopy }) {
  const titleWords = copy.title.split(" / ");
  return (
    <div className={styles.sceneOne}>
      <div className={styles.heroTube} data-beat-layout-item="true">
        <span className={styles.heroPressure} />
        <Capsule className={styles.heroCapsule} />
      </div>
      <div className={styles.heroTitle} data-beat-layout-item="true">
        <p>{copy.kicker}</p>
        <h1>
          {titleWords.map((word, index) => (
            <span key={word} data-accent={index === 2 ? "true" : "false"}>{word}</span>
          ))}
        </h1>
        <p>{copy.subtitle}</p>
      </div>
      <div className={styles.heroTimeline} data-beat-layout-item="true">
        <span><b>TEST · 1866</b></span>
        <i />
        <span><b>PUBLIC SERVICE · 1879</b></span>
        <i />
        <span><b>STOP · 1984</b></span>
      </div>
      <p className={styles.sourceFlag} data-beat-layout-item="true">PARIS ONLY · [S1—S4]</p>
    </div>
  );
}

function SceneTwo({
  beat,
  copy,
  language,
}: {
  beat: number;
  copy: SceneCopy;
  language: Language;
}) {
  return (
    <div className={styles.sceneBody}>
      <SceneHeader number={2} copy={copy} />
      <div className={styles.pressurePlate} data-beat-layout-item="true">
        <div className={styles.pressureTube}>
          <span className={styles.highPressure} data-visible="true">
            <b>{language === "zh" ? "高压" : "HIGH PRESSURE"}</b>
            {Array.from({ length: 7 }, (_, index) => <i key={index} />)}
          </span>
          <Capsule className={styles.sectionCapsule} />
          <span className={styles.lowPressure} data-visible="true">
            <b>{language === "zh" ? "低压" : "LOW PRESSURE"}</b>
            {Array.from({ length: 4 }, (_, index) => <i key={index} />)}
          </span>
        </div>
        <div className={styles.deltaBadge} data-visible="true">
          <b>ΔP</b>
          <span>{language === "zh" ? "压力差" : "PRESSURE DIFFERENCE"}</span>
        </div>
        <div className={styles.sealCallout} data-visible={reveal(beat >= 1)}>
          <span />
          <b>{language === "zh" ? "皮革密封" : "LEATHER SEAL"}</b>
          <small>{language === "zh" ? "限制旁通漏气，不消除摩擦" : "LIMITS BYPASS · DOES NOT ERASE FRICTION"}</small>
        </div>
        <div className={styles.speedStamp} data-visible={reveal(beat >= 2)}>
          <b>800 m/min</b>
          <span>{language === "zh" ? "资料记录的管内速度 · 非交付承诺 [S2]" : "REPORTED OPERATING SPEED · NOT DELIVERY TIME [S2]"}</span>
        </div>
      </div>
      <BeatReadout scene={2} beat={beat} language={language} />
    </div>
  );
}

const MAP_NODES = [
  { id: "bourse", x: 31, y: 36 },
  { id: "hotel", x: 48, y: 25 },
  { id: "grenelle", x: 27, y: 71 },
  { id: "louvre", x: 50, y: 52 },
  { id: "bastille", x: 70, y: 48 },
  { id: "nord", x: 59, y: 15 },
  { id: "latin", x: 53, y: 76 },
  { id: "neuilly", x: 9, y: 44 },
] as const;

function SceneThree({
  beat,
  copy,
  language,
}: {
  beat: number;
  copy: SceneCopy;
  language: Language;
}) {
  const expanded = beat >= 1;
  return (
    <div className={styles.sceneBody}>
      <SceneHeader number={3} copy={copy} />
      <div className={styles.routePlate} data-expanded={reveal(expanded)} data-beat-layout-item="true">
        <div className={styles.mapFrame}>
          <svg viewBox="0 0 100 90" role="img" aria-label={language === "zh" ? "巴黎气动邮政示意拓扑" : "Schematic Paris pneumatic-post topology"}>
            <path className={styles.seine} d="M-3 57 C18 44 27 64 43 55 C58 45 72 67 103 49" />
            <path className={styles.firstRoute} d="M31 36 L48 25" />
            <g className={styles.expandedRoutes} data-visible={reveal(expanded)}>
              <path d="M31 36 L27 71 L53 76 L50 52 L70 48" />
              <path d="M31 36 L59 15 L48 25" />
              <path d="M31 36 L9 44 L27 71" />
              <path d="M48 25 L50 52 L53 76" />
            </g>
            {MAP_NODES.map((node) => (
              <g key={node.id} className={styles.mapNode} data-core={node.id === "bourse" || node.id === "hotel" ? "true" : "false"} data-visible={reveal(expanded || node.id === "bourse" || node.id === "hotel")}>
                <circle cx={node.x} cy={node.y} r="2.7" />
                <circle cx={node.x} cy={node.y} r="1" />
              </g>
            ))}
          </svg>
          <span className={styles.bourseLabel}>BOURSE</span>
          <span className={styles.hotelLabel}>GRAND-HÔTEL</span>
          <span className={styles.grenelleLabel} data-visible={reveal(expanded)}>GRENELLE</span>
          <span className={styles.networkLabel} data-visible={reveal(expanded)}>
            {language === "zh" ? "约 400 公里 / 1930 年代" : "ABOUT 400 KM / 1930s"}
          </span>
          <span className={styles.testLabel}>1866 TEST</span>
        </div>
        <div className={styles.mapLegend}>
          <span><i />{language === "zh" ? "第一条试验关系" : "FIRST TEST RELATION"}</span>
          <span data-visible={reveal(expanded)}><i />{language === "zh" ? "成熟网络示意" : "MATURE NETWORK SCHEMATIC"}</span>
          <b>{language === "zh" ? "示意 · 不按比例" : "SCHEMATIC · NOT TO SCALE"}</b>
        </div>
      </div>
      <BeatReadout scene={3} beat={beat} language={language} />
    </div>
  );
}

function StationCapsule({ motionOff }: { motionOff: boolean }) {
  if (motionOff) {
    return (
      <>
        <span className={styles.settledRoute} data-reduced-route="settled" />
        <span className={styles.settledEndpoint} data-reduced-endpoint="emphasized">
          <Capsule />
        </span>
      </>
    );
  }

  return (
    <span
      className={styles.signatureCapsule}
      data-signature-capsule="once"
      data-rebound-count="1"
    >
      <Capsule />
    </span>
  );
}

function SceneFour({
  beat,
  copy,
  language,
  motionOff,
}: {
  beat: number;
  copy: SceneCopy;
  language: Language;
  motionOff: boolean;
}) {
  return (
    <div className={styles.sceneBody}>
      <SceneHeader number={4} copy={copy} />
      <div className={styles.switchPlate} data-beat-layout-item="true">
        <div className={styles.inboundTube}><span /></div>
        <div className={styles.stationHub} data-sorted={reveal(beat >= 1)}>
          <span className={styles.hubRing} />
          <span className={styles.hubSelector} />
          <b>{language === "zh" ? "换向站" : "TRANSFER"}</b>
        </div>
        <div className={styles.outboundTube} data-live={reveal(beat >= 2)}><span /></div>
        <span className={styles.receiveCursor} data-visible={reveal(beat === 0)}><Capsule /></span>
        {beat >= 2 && <StationCapsule motionOff={motionOff} />}
        <div className={styles.stationSteps}>
          {COPY[4][language].beats.map((item, index) => (
            <span key={item.title} data-active={index === beat ? "true" : "false"} data-past={index <= beat ? "true" : "false"}>
              <i>0{index + 1}</i><b>{item.title}</b>
            </span>
          ))}
        </div>
        <p className={styles.transferBoundary} data-visible={reveal(beat >= 1)}>
          {language === "zh" ? "站内转交 · 不是一次贯穿全城" : "STATION TRANSFER · NOT ONE CONTINUOUS CITYWIDE SHOT"}
        </p>
      </div>
      <BeatReadout scene={4} beat={beat} language={language} />
    </div>
  );
}

function SceneFive({ copy, language }: { copy: SceneCopy; language: Language }) {
  return (
    <div className={styles.sceneFive}>
      <SceneHeader number={5} copy={copy} />
      <div className={styles.noteComposition} data-beat-layout-item="true">
        <article className={styles.blueNote} data-note-type="reconstruction">
          <header>
            <span>RÉPUBLIQUE FRANÇAISE</span>
            <b>CARTE-TÉLÉGRAMME</b>
            <i>PARIS · 14 h 20</i>
          </header>
          <div>
            <p>{language === "zh" ? "请在三点前把图纸送到格勒内尔。" : "Please send the drawings to Grenelle before three."}</p>
            <span>{language === "zh" ? "— 教学重构，不是档案摹本" : "— teaching reconstruction, not an archival facsimile"}</span>
          </div>
          <footer>RECONSTRUCTED TEACHING FORM · [S4]</footer>
        </article>
        <div className={styles.limitStack}>
          <section>
            <span>01</span>
            <b>{language === "zh" ? "批量，不是无限" : "BUNDLED, NOT INFINITE"}</b>
            <p>{language === "zh" ? "游标装载压紧的邮件束；站点与批次仍限制吞吐。[S2]" : "Cursors held compacted bundles; batches and stations still bounded throughput. [S2]"}</p>
          </section>
          <section>
            <span>02</span>
            <b>{language === "zh" ? "堵塞需要检修" : "BLOCKAGES NEEDED ACCESS"}</b>
            <p>{language === "zh" ? "下水道让被卡住的游标可以被定位、拆管取出。[S1]" : "Sewer access let crews locate a stuck train and open the line. [S1]"}</p>
          </section>
          <section>
            <span>03</span>
            <b>TELEPHONE · TELEX · FAX</b>
            <p>{language === "zh" ? "老化、成本与新通信方式共同改变了取舍。[S1–S3]" : "Aging tubes, economics, and newer communications changed the trade-off. [S1–S3]"}</p>
          </section>
        </div>
      </div>
      <p className={styles.finalFact} data-beat-layout-item="true">
        800 m/min {language === "zh" ? "管内速度 ≠ 端到端送达时间" : "IN-TUBE SPEED ≠ DOOR-TO-DOOR TIME"}
      </p>
    </div>
  );
}

function ScenePanel({
  scene,
  beat,
  language,
  motionOff,
}: {
  scene: SceneId;
  beat: number;
  language: Language;
  motionOff: boolean;
}) {
  const safeBeat = clampBeat(scene, beat);
  const copy = COPY[scene][language];
  return (
    <section
      className={styles.scene}
      data-scene={scene}
      data-beat={safeBeat}
      data-beat-layout-container="true"
      data-beat-layout-mode="reserved"
    >
      <div className={styles.paperGrain} aria-hidden="true" />
      {scene === 1 && <SceneOne copy={copy} />}
      {scene === 2 && <SceneTwo beat={safeBeat} copy={copy} language={language} />}
      {scene === 3 && <SceneThree beat={safeBeat} copy={copy} language={language} />}
      {scene === 4 && <SceneFour beat={safeBeat} copy={copy} language={language} motionOff={motionOff} />}
      {scene === 5 && <SceneFive copy={copy} language={language} />}
    </section>
  );
}

function PneumaticTubeNavigation({
  scene,
  language,
  onNavigate,
}: {
  scene: SceneId;
  language: Language;
  onNavigate?: (scene: number, beat: number) => void;
}) {
  const draggingRef = useRef(false);
  const lastScrubSceneRef = useRef<SceneId>(scene);

  const navigate = (next: number) => {
    const target = clampScene(next);
    lastScrubSceneRef.current = target;
    onNavigate?.(target, 0);
  };

  const scrub = (clientX: number, element: HTMLDivElement) => {
    const bounds = element.getBoundingClientRect();
    if (bounds.width <= 0) return;
    const progress = Math.min(Math.max((clientX - bounds.left) / bounds.width, 0), 1);
    const target = clampScene(Math.round(progress * 4) + 1);
    if (target !== lastScrubSceneRef.current) navigate(target);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, current: SceneId) => {
    let target: number | null = null;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") target = current + 1;
    if (event.key === "ArrowLeft" || event.key === "ArrowUp") target = current - 1;
    if (event.key === "Home") target = 1;
    if (event.key === "End") target = 5;
    if (target === null) return;
    event.preventDefault();
    event.stopPropagation();
    navigate(target);
  };

  return (
    <nav
      className={styles.navigation}
      aria-label={language === "zh" ? "气动管路径导航" : "Pneumatic tube scene navigation"}
      data-topic-navigation="true"
      data-navigation-geometry="path"
      data-navigation-carrier="pneumatic-tube"
      data-navigation-invocation="drag-scrub"
      data-navigation-feedback="typographic-emphasis"
    >
      <div
        className={styles.scrubSurface}
        data-navigation-scrub-surface="true"
        onPointerDownCapture={(event) => {
          event.stopPropagation();
          draggingRef.current = true;
          event.currentTarget.setPointerCapture?.(event.pointerId);
          scrub(event.clientX, event.currentTarget);
        }}
        onPointerMove={(event) => {
          if (!draggingRef.current) return;
          event.stopPropagation();
          scrub(event.clientX, event.currentTarget);
        }}
        onPointerUp={(event) => {
          if (!draggingRef.current) return;
          event.stopPropagation();
          scrub(event.clientX, event.currentTarget);
          draggingRef.current = false;
          event.currentTarget.releasePointerCapture?.(event.pointerId);
        }}
        onPointerCancel={() => {
          draggingRef.current = false;
        }}
      >
        <span className={styles.navTube} aria-hidden="true" />
        <span className={styles.navCapsule} aria-hidden="true" style={{ "--nav-scene": scene } as React.CSSProperties}>
          <Capsule />
        </span>
        {SCENE_IDS.map((sceneId) => {
          const active = sceneId === scene;
          return (
            <button
              key={sceneId}
              type="button"
              className={styles.navStation}
              data-active={active ? "true" : "false"}
              aria-current={active ? "step" : undefined}
              aria-label={`${language === "zh" ? "场景" : "Scene"} ${sceneId} · ${NAV_LABELS[language][sceneId - 1]}`}
              onPointerDown={(event) => event.stopPropagation()}
              onClick={(event) => {
                event.stopPropagation();
                navigate(sceneId);
              }}
              onKeyDown={(event) => handleKeyDown(event, sceneId)}
            >
              <i />
              <span>0{sceneId}</span>
              <b>{NAV_LABELS[language][sceneId - 1]}</b>
            </button>
          );
        })}
      </div>
      <p>{language === "zh" ? "拖动胶囊 / 点击站点 / 方向键" : "DRAG CAPSULE / TAP STATION / ARROW KEYS"}</p>
    </nav>
  );
}

export function getMetadata(language: Language): StyleMetadata {
  return {
    id: "red-wedge-agitprop",
    band: "craft-cultural",
    name: language === "zh" ? "红楔宣传画" : "Red Wedge Agitprop",
    theme: language === "zh" ? "气动邮政：巴黎 1866—1984" : "Pneumatic Post: Paris 1866—1984",
    densityLabel: language === "zh" ? "舞台冲击 · 强度 5" : "Stage Impact · Intensity 5",
    heroScene: 4,
    colors: {
      bg: "#efe4c9",
      ink: "#11100e",
      panel: "#d81f1f",
    },
    typography: {
      header: "Impact / Noto Sans SC 900",
      body: "Arial Narrow / PingFang SC 600",
    },
    tags: [
      "red-wedge",
      "constructivist",
      "pneumatic-post",
      "infrastructure-history",
      "object-mechanics",
      "path-navigation",
      "stage-impact",
      "bilingual",
    ],
    fonts: ["Impact", "Arial Narrow", "cjk:PingFang SC", "cjk:Noto Sans SC"],
    scenes: SCENE_IDS.map((sceneId) => {
      const sceneCopy = COPY[sceneId][language];
      return {
        id: sceneId,
        title: sceneCopy.title,
        beats: sceneCopy.beats.map((beat, index) => ({
          id: index,
          action: beat.action,
          title: beat.title,
          body: beat.body,
        })),
      };
    }),
  };
}

export default function PneumaticPost({
  scene,
  beat,
  language,
  isThumbnail,
  reducedMotion,
  onNavigate,
}: BespokeStyleProps) {
  const safeScene = clampScene(scene);
  const safeBeat = clampBeat(safeScene, beat);
  const motionOff = reducedMotion || isThumbnail;

  return (
    <main
      className={styles.root}
      lang={language === "zh" ? "zh-CN" : "en"}
      data-style-id="red-wedge-agitprop"
      data-topic-id="pneumatic-post"
      data-motion={motionOff ? "off" : "on"}
      data-frozen={motionOff ? "true" : "false"}
    >
      <div className={styles.outerFrame} aria-hidden="true"><span /><span /><span /></div>
      <SpatialSceneTrack
        scene={safeScene}
        beat={safeBeat}
        transitionKind="diagonal-pan"
        transitionMap={TRANSITION_MAP}
        transitionModifierMap={TRANSITION_MODIFIER_MAP}
        transitionDurationMs={700}
        reducedMotion={motionOff}
        beatLayoutModes={BEAT_LAYOUT_MODES}
        className={styles.track}
        renderScene={(sceneId, sceneBeat) => (
          <ScenePanel
            scene={clampScene(sceneId)}
            beat={sceneBeat}
            language={language}
            motionOff={motionOff}
          />
        )}
      />
      {!isThumbnail && (
        <PneumaticTubeNavigation
          scene={safeScene}
          language={language}
          onNavigate={onNavigate}
        />
      )}
    </main>
  );
}

export const pneumaticPostTopic = defineStyleTopic({
  id: "pneumatic-post",
  topic: {
    en: "Pneumatic Post",
    zh: "气动邮政",
  },
  model: "GPT 5.6 Sol",
  component: PneumaticPost,
  getMetadata,
  navigation: {
    geometry: "path",
    carrier: "pneumatic-tube",
    invocation: "drag-scrub",
    feedback: "typographic-emphasis",
  },
  sources: PNEUMATIC_POST_SOURCES,
  transitionScore: PNEUMATIC_POST_TRANSITION_SCORE,
});

import { useCallback, useEffect } from "react";
import type { MouseEvent, PointerEvent } from "react";
import {
  defineTopic,
  type TopicDefinition,
  type TopicStageProps,
} from "../domain/topic";
import SpatialSceneTrack from "../components/stage/SpatialSceneTrack";
import type {
  SceneTransitionMap,
  SceneTransitionModifierMap,
} from "../components/stage/SpatialSceneTrack";
import styles from "./before-a.module.css";

type Lang = TopicStageProps["language"];
type SceneId = 1 | 2 | 3 | 4 | 5;
type GlyphKind = "head" | "phoenician" | "greek" | "old-italic" | "latin";

interface BeatCopy {
  action: string;
  title: string;
  body: string;
}

interface SceneCopy {
  nav: string;
  title: string;
  kicker: string;
  display: string[];
  support: string;
  source: string;
  labels: string[];
  beats: BeatCopy[];
}

const SCENE_IDS: SceneId[] = [1, 2, 3, 4, 5];

const BEAT_LAYOUT_MODES = {
  3: "reserved",
  4: "reserved",
  5: "reserved",
} as const;

const BEFORE_A_TRANSITION_SCORE = {
  "1->2": "afterimage",
  "2->3": "zoom-through",
  "3->4": "multi-blind",
  "4->5": "afterimage",
} as const satisfies TopicDefinition["transitionScore"];

const BEFORE_A_TRANSITION_MAP: SceneTransitionMap =
  BEFORE_A_TRANSITION_SCORE;

const BEFORE_A_TRANSITION_MODIFIER_MAP: SceneTransitionModifierMap = {
  "3->4": "letterform-lineage",
};

const BEFORE_A_SOURCES = [
  {
    authority: "The British Museum",
    title: "Sandstone sphinx with Proto-Sinaitic signs (EA41748)",
    url: "https://www.britishmuseum.org/collection/object/Y_EA41748",
    supports:
      "The object is dated to about 1800 BCE and carries Proto-Sinaitic signs; the museum describes alphabetic, hieroglyph-derived, West Semitic interpretation as the basis of attempted decipherment.",
    boundary:
      "The object does not preserve a continuous aleph-to-A sequence and does not by itself prove that a specific head-shaped outline became modern A.",
  },
  {
    authority: "Unicode Consortium",
    title: "The Unicode Standard, Chapter 10.3: Phoenician",
    url: "https://www.unicode.org/versions/Unicode16.0.0/core-spec/chapter-10/",
    supports:
      "An older form of the Phoenician alphabet is described as a forerunner of Greek, Old Italic, and Latin among other scripts.",
    boundary:
      "A character encoding standard identifies script relationships and repertoire; its reference glyphs are not prescriptive inscription facsimiles.",
  },
  {
    authority: "Unicode Consortium",
    title: "Unicode Technical Note 40: Old Italic Glyph Variation",
    url: "https://www.unicode.org/notes/tn40/old-italic-glyph-variation.pdf",
    supports:
      "The technical note identifies Euboean Greek in Italy as the ultimate source for ancient Italian alphabets and documents substantial local glyph variation.",
    boundary:
      "Unicode unifies several ancient Italian traditions in one block, so the displayed U+10300 outline is a comparison sample rather than a universal historical form.",
  },
  {
    authority: "The Metropolitan Museum of Art",
    title: "Assyria to Iberia at the Dawn of the Classical Age",
    url: "https://resources.metmuseum.org/resources/metpublications/pdf/Assyria_to_Iberia_at_the_Dawn_of_the_Classical_Age.pdf",
    supports:
      "The museum publication describes Greek adoption of Phoenician letters and shows the exchange occurring across multiple Mediterranean locales.",
    boundary:
      "The publication does not establish one single transfer location or a smooth, uniform sequence of letter shapes.",
  },
  {
    authority: "Cambridge University Press",
    title: "Greek Alphabetic Writing, The Cambridge Ancient History 20b",
    url: "https://www.cambridge.org/core/books/abs/cambridge-ancient-history/greek-alphabetic-writing/E26EF87BAEDA11D809E7F88751C1BE43",
    supports:
      "The chapter summary says the order, names, and shapes demonstrate that Greek alpha through tau derived from a Semitic alphabet.",
    boundary:
      "The place, date, and pathway of adoption remain debated; the slide therefore labels forms as sourced samples rather than animation frames.",
  },
  {
    citation:
      "John F. Healey, The Early Alphabet, Reading the Past 9 (British Museum Press / University of California Press, 1990).",
    url: "https://books.google.com/books/about/The_Early_Alphabet.html?id=0_KnI588AnkC",
    supports:
      "The scholarly synthesis supplies the comparative early-alphabet and Proto-Sinaitic context behind the slide's explicitly labeled pictorial and acrophonic reconstruction.",
    boundary:
      "Comparative charts compress regional and chronological variation; the slide redraws a teaching schematic and does not present it as a facsimile of one inscription.",
  },
] as const;

const SCENES: Record<SceneId, Record<Lang, SceneCopy>> = {
  1: {
    en: {
      nav: "NOW",
      title: "Modern A",
      kicker: "LATIN CAPITAL / U+0041",
      display: ["BEFORE", "A"],
      support: "The finished letter is only the latest sampled frame.",
      source: "SOURCE CUE  ·  UNICODE LATIN CHART U+0041",
      labels: ["MODERN FORM"],
      beats: [
        {
          action: "Modern A occupies the full field",
          title: "Before A",
          body: "Begin with the familiar Latin capital, then travel backward.",
        },
      ],
    },
    zh: {
      nav: "今",
      title: "现代 A",
      kicker: "拉丁大写字母 / U+0041",
      display: ["A 之前", "A"],
      support: "眼前这个稳定字形，只是目前最新的一次抽样。",
      source: "来源线索  ·  UNICODE 拉丁字符表 U+0041",
      labels: ["现代形态"],
      beats: [
        {
          action: "现代 A 占满画面",
          title: "A 之前",
          body: "从熟悉的拉丁大写字母出发，沿字形向前追溯。",
        },
      ],
    },
  },
  2: {
    en: {
      nav: "SIN",
      title: "Head-shaped hypothesis",
      kicker: "c. 1800 BCE / SERABIT EL-KHADIM",
      display: ["HEAD", "BEFORE", "LETTER"],
      support: "The ox-head reading is a reconstruction—not a preserved flipbook.",
      source: "BRITISH MUSEUM EA41748  ·  HEALEY, THE EARLY ALPHABET",
      labels: ["PICTURE", "ACROPHONIC SOUND", "RECONSTRUCTION"],
      beats: [
        {
          action: "A head-shaped sign confronts modern A",
          title: "Head before letter",
          body: "Proto-Sinaitic evidence supports a pictorial ancestry, with interpretive limits.",
        },
      ],
    },
    zh: {
      nav: "西奈",
      title: "头形假说",
      kicker: "约公元前 1800 年 / 塞拉比特·哈迪姆",
      display: ["字母之前", "先有头形"],
      support: "“牛头”释读是学术重建，不是一段被完整保存的逐帧动画。",
      source: "大英博物馆 EA41748  ·  HEALEY《THE EARLY ALPHABET》",
      labels: ["图像", "首音原则", "重建"],
      beats: [
        {
          action: "头形符号与现代 A 对照",
          title: "字母之前，先有头形",
          body: "原始西奈文字支持图像祖先的判断，同时保留释读边界。",
        },
      ],
    },
  },
  3: {
    en: {
      nav: "PHN",
      title: "Two writing worlds",
      kicker: "SAMPLED INSCRIPTIONS / NOT ANIMATION FRAMES",
      display: ["ONE NAME.", "TWO WRITING WORLDS."],
      support: "A Semitic letter family was adapted; shape, sound role and direction were reworked.",
      source: "UNICODE U+10900  ·  CAMBRIDGE ANCIENT HISTORY 20B  ·  THE MET",
      labels: [
        "PHOENICIAN ALF",
        "RIGHT → LEFT",
        "GREEK ALPHA",
        "EARLY DIRECTION VARIED",
      ],
      beats: [
        {
          action: "Phoenician alf enters as a sourced sample",
          title: "Phoenician alf",
          body: "Unicode U+10900 records the Phoenician letter alf.",
        },
        {
          action: "Greek alpha joins without erasing the gap",
          title: "Greek alpha",
          body: "Greek adaptation retained a related name and reordered the letter's function.",
        },
      ],
    },
    zh: {
      nav: "腓尼",
      title: "两个书写世界",
      kicker: "铭文抽样 / 不是动画中间帧",
      display: ["同一条名字线", "两个书写世界"],
      support: "闪米特字母传统进入希腊后，形状、语音角色和书写方向都被重新组织。",
      source: "UNICODE U+10900  · 《剑桥古代史》20B  ·  大都会艺术博物馆",
      labels: ["腓尼基 ALF", "从右向左", "希腊 ALPHA", "早期方向并不固定"],
      beats: [
        {
          action: "腓尼基 alf 作为来源明确的抽样出现",
          title: "腓尼基 alf",
          body: "Unicode U+10900 记录腓尼基字母 alf。",
        },
        {
          action: "希腊 alpha 加入，但不抹平历史间隙",
          title: "希腊 alpha",
          body: "希腊改造保留了相关名称，同时重组了这个字母的功能。",
        },
      ],
    },
  },
  4: {
    en: {
      nav: "GRK",
      title: "Sampled turns",
      kicker: "NO TWEENING / KEEP THE GHOSTS",
      display: ["TURN", "ADAPT", "KEEP THE GHOSTS"],
      support: "Rotation is a visual comparison. The surviving record contains variants and gaps.",
      source: "UNICODE U+10900, U+10300, U+0041  ·  THE MET, ASSYRIA TO IBERIA",
      labels: ["PHOENICIAN ALF", "GREEK ALPHA", "OLD ITALIC → LATIN"],
      beats: [
        {
          action: "Phoenician sample locks to the stage",
          title: "Alf",
          body: "A right-to-left letter sample begins the comparison.",
        },
        {
          action: "Greek alpha turns while the prior sample remains",
          title: "Alpha",
          body: "The earlier outline stays as evidence, not a dissolving tween.",
        },
        {
          action: "Old Italic and Latin A complete the sampled comparison",
          title: "A",
          body: "Old Italic U+10300 marks the bridge toward the Latin capital.",
        },
      ],
    },
    zh: {
      nav: "希腊",
      title: "抽样转向",
      kicker: "不做补间 / 保留前代残影",
      display: ["转向", "改写", "留下残影"],
      support: "旋转只是视觉比较；真实留存中有地区变体，也有历史空白。",
      source: "UNICODE U+10900、U+10300、U+0041  ·  大都会《ASSYRIA TO IBERIA》",
      labels: ["腓尼基 ALF", "希腊 ALPHA", "古意大利 → 拉丁"],
      beats: [
        {
          action: "腓尼基抽样锁定在舞台中央",
          title: "Alf",
          body: "一枚从右向左书写的字母抽样开始比较。",
        },
        {
          action: "希腊 alpha 转向，前代抽样仍然保留",
          title: "Alpha",
          body: "旧轮廓作为证据留下，而不是被补间动画抹掉。",
        },
        {
          action: "古意大利与拉丁 A 完成抽样比较",
          title: "A",
          body: "古意大利字母 U+10300 标记通向拉丁大写 A 的桥梁。",
        },
      ],
    },
  },
  5: {
    en: {
      nav: "LAT",
      title: "A family album",
      kicker: "LATIN CAPITAL A / NOW",
      display: ["NOT A", "STRAIGHT LINE."],
      support: "A family album of sampled forms—not a smooth evolutionary film.",
      source: "SOURCE TRAIL  ·  BM EA41748  ·  UNICODE 17  ·  THE MET  ·  CAH 20B",
      labels: ["HEAD-SHAPED", "ALF", "ALPHA", "A"],
      beats: [
        {
          action: "Modern A locks into its final field",
          title: "A",
          body: "The present form stands alone first.",
        },
        {
          action: "Head-shaped reconstruction cuts into A",
          title: "Image",
          body: "The pictorial hypothesis returns as a visible cut.",
        },
        {
          action: "Alf and alpha cuts retain intermediate directions",
          title: "Samples",
          body: "Earlier sourced outlines remain legible inside the final form.",
        },
        {
          action: "Final punchline rejects a smooth progress myth",
          title: "Not a straight line",
          body: "The lineage resolves as a family album with gaps.",
        },
      ],
    },
    zh: {
      nav: "拉丁",
      title: "字形家族相册",
      kicker: "拉丁大写 A / 现在",
      display: ["不是", "一条直线"],
      support: "这是抽样字形的家族相册，不是一部顺滑演化影片。",
      source: "来源链  ·  大英博物馆 EA41748  ·  UNICODE 17  ·  大都会  · 《剑桥古代史》20B",
      labels: ["头形", "ALF", "ALPHA", "A"],
      beats: [
        {
          action: "现代 A 锁定在最终色场",
          title: "A",
          body: "先让现在的字形独自站立。",
        },
        {
          action: "头形重建切入 A",
          title: "图像",
          body: "图像祖先的假说以切口重新出现。",
        },
        {
          action: "Alf 与 alpha 切口保留中间方向",
          title: "抽样",
          body: "有来源的前代轮廓留在最终字形内部。",
        },
        {
          action: "最终金句拒绝顺滑进步神话",
          title: "不是一条直线",
          body: "字形谱系收束为一册带有空白的家族相册。",
        },
      ],
    },
  },
};

const SCENE_CLASSES: Record<SceneId, string> = {
  1: styles.sceneOne,
  2: styles.sceneTwo,
  3: styles.sceneThree,
  4: styles.sceneFour,
  5: styles.sceneFive,
};

function useFonts() {
  useEffect(() => {
    const id = "before-a-fonts";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Anton&family=Noto+Sans+SC:wght@700;900&display=swap";
    document.head.appendChild(link);
  }, []);
}

function clampScene(scene: number): SceneId {
  return SCENE_IDS.includes(scene as SceneId) ? (scene as SceneId) : 1;
}

function clampBeat(sceneId: SceneId, beat: number, language: Lang): number {
  const lastBeat = SCENES[sceneId][language].beats.length - 1;
  return Math.min(Math.max(beat, 0), lastBeat);
}

function joinClasses(...classes: Array<string | false | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

function LetterGlyph({
  kind,
  className,
  label,
  decorative = false,
}: {
  kind: GlyphKind;
  className?: string;
  label: string;
  decorative?: boolean;
}) {
  return (
    <svg
      className={joinClasses(styles.glyph, className)}
      viewBox="0 0 240 240"
      role={decorative ? undefined : "img"}
      aria-hidden={decorative ? true : undefined}
      aria-label={decorative ? undefined : label}
      focusable="false"
    >
      {kind === "head" && (
        <g className={styles.glyphStroke}>
          <path d="M34 48 L82 76 L120 66 L158 76 L206 48" />
          <path d="M82 76 L92 172 L120 202 L148 172 L158 76" />
          <path d="M84 112 L156 112" />
          <circle cx="106" cy="132" r="5" />
          <circle cx="134" cy="132" r="5" />
        </g>
      )}
      {kind === "phoenician" && (
        <g className={styles.glyphStroke}>
          <path d="M48 42 L184 186" />
          <path d="M190 48 L50 170" />
          <path d="M80 112 L170 98" />
        </g>
      )}
      {kind === "greek" && (
        <g className={styles.glyphStroke}>
          <path d="M48 202 L120 30 L194 202" />
          <path d="M80 142 L164 142" />
        </g>
      )}
      {kind === "old-italic" && (
        <g className={styles.glyphStroke}>
          <path d="M54 202 L122 34 L192 202" />
          <path d="M80 150 L168 126" />
        </g>
      )}
      {kind === "latin" && (
        <g className={styles.glyphStroke}>
          <path d="M48 206 L120 30 L194 206" />
          <path d="M78 148 L166 148" />
        </g>
      )}
    </svg>
  );
}

function SourceCue({ children }: { children: string }) {
  return (
    <p className={styles.sourceCue} data-beat-layout-item="true">
      {children}
    </p>
  );
}

function SceneOne({ content }: { content: SceneCopy }) {
  return (
    <div className={styles.sceneOneLayout} data-composition="cropped-glyph-poster">
      <div className={styles.sceneOneCopy}>
        <p className={styles.kicker}>{content.kicker}</p>
        <h1 className={styles.beforeTitle}>
          <span>{content.display[0]}</span>
          <span className={styles.beforeAccent}>{content.display[1]}</span>
        </h1>
        <p className={styles.support}>{content.support}</p>
      </div>
      <div className={styles.modernAHero}>
        <LetterGlyph kind="latin" label={content.labels[0]} />
        <LetterGlyph
          kind="latin"
          className={styles.modernAGhost}
          label={content.labels[0]}
          decorative
        />
      </div>
      <SourceCue>{content.source}</SourceCue>
    </div>
  );
}

function SceneTwo({ content }: { content: SceneCopy }) {
  return (
    <div className={styles.sceneTwoLayout} data-composition="head-sign-split-field">
      <div className={styles.headCopy}>
        <p className={styles.kicker}>{content.kicker}</p>
        <h2 className={styles.headTitle}>
          {content.display.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </h2>
        <p className={styles.support}>{content.support}</p>
      </div>
      <div className={styles.headField}>
        <LetterGlyph kind="head" label={content.labels[0]} />
        <div className={styles.headLabelStrip}>
          {content.labels.map((label) => (
            <span key={label}>{label}</span>
          ))}
        </div>
      </div>
      <SourceCue>{content.source}</SourceCue>
    </div>
  );
}

function SceneThree({ content, beat }: { content: SceneCopy; beat: number }) {
  const greekVisible = beat >= 1;
  return (
    <div
      className={styles.sceneThreeLayout}
      data-composition="two-world-lineage-strip"
      data-beat-layout-container="true"
      data-beat-layout-mode="reserved"
    >
      <header className={styles.lineageHeader} data-beat-layout-item="true">
        <p className={styles.kicker}>{content.kicker}</p>
        <h2>
          {content.display.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </h2>
      </header>
      <div className={styles.lineageNodes} data-beat-layout-item="true">
        <article className={styles.lineageNode} data-revealed="true">
          <div className={styles.nodeNumber}>ALF</div>
          <LetterGlyph kind="phoenician" label={content.labels[0]} />
          <h3>{content.labels[0]}</h3>
          <p>{content.labels[1]}</p>
        </article>
        <div className={styles.lineageGap} aria-hidden="true">
          <span />
          <b>≠</b>
          <span />
        </div>
        <article
          className={joinClasses(
            styles.lineageNode,
            styles.greekNode,
            greekVisible ? styles.revealed : styles.concealed,
          )}
          data-revealed={greekVisible ? "true" : "false"}
          aria-hidden={greekVisible ? undefined : true}
        >
          <div className={styles.nodeNumber}>A</div>
          <LetterGlyph kind="greek" label={content.labels[2]} />
          <h3>{content.labels[2]}</h3>
          <p>{content.labels[3]}</p>
        </article>
      </div>
      <p className={styles.lineageSupport} data-beat-layout-item="true">
        {content.support}
      </p>
      <SourceCue>{content.source}</SourceCue>
    </div>
  );
}

function SceneFour({ content, beat }: { content: SceneCopy; beat: number }) {
  const phase = Math.min(beat, 2);
  const phases: Array<{ kind: GlyphKind; label: string }> = [
    { kind: "phoenician", label: content.labels[0] },
    { kind: "greek", label: content.labels[1] },
    { kind: "latin", label: content.labels[2] },
  ];

  return (
    <div
      className={styles.sceneFourLayout}
      data-composition="full-field-glyph-archaeology"
      data-current-phase={phase}
      data-beat-layout-container="true"
      data-beat-layout-mode="reserved"
    >
      <header className={styles.morphHeader} data-beat-layout-item="true">
        <p className={styles.kicker}>{content.kicker}</p>
        <h2>
          {content.display.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </h2>
      </header>
      <div className={styles.morphStage} data-beat-layout-item="true">
        <div className={styles.blindBars} aria-hidden="true">
          {Array.from({ length: 7 }, (_, index) => (
            <span key={index} />
          ))}
        </div>
        {phases.map((item, index) => {
          const state = index === phase ? "current" : index < phase ? "ghost" : "future";
          return (
            <div
              key={item.kind}
              className={joinClasses(
                styles.phaseGlyph,
                state === "current" && styles.phaseCurrent,
                state === "ghost" && styles.phaseGhost,
                state === "future" && styles.phaseFuture,
              )}
              data-phase={index}
              data-phase-state={state}
            >
              <LetterGlyph kind={item.kind} label={item.label} decorative={state !== "current"} />
              <span>{item.label}</span>
            </div>
          );
        })}
        <div
          className={joinClasses(
            styles.oldItalicStamp,
            phase >= 2 ? styles.revealed : styles.concealed,
          )}
          data-revealed={phase >= 2 ? "true" : "false"}
          aria-hidden={phase >= 2 ? undefined : true}
        >
          <LetterGlyph kind="old-italic" label="Old Italic A, Unicode U+10300" />
          <span>U+10300</span>
        </div>
      </div>
      <p className={styles.morphSupport} data-beat-layout-item="true">
        {content.support}
      </p>
      <SourceCue>{content.source}</SourceCue>
    </div>
  );
}

function SceneFive({ content, beat }: { content: SceneCopy; beat: number }) {
  const headVisible = beat >= 1;
  const lineageVisible = beat >= 2;
  const punchVisible = beat >= 3;

  return (
    <div
      className={styles.sceneFiveLayout}
      data-composition="cut-letter-final-poster"
      data-beat-layout-container="true"
      data-beat-layout-mode="reserved"
    >
      <p className={styles.kicker} data-beat-layout-item="true">
        {content.kicker}
      </p>
      <div className={styles.finalGlyphField} data-beat-layout-item="true">
        <LetterGlyph kind="latin" className={styles.finalA} label={content.labels[3]} />
        <div
          className={joinClasses(styles.finalCut, styles.headCut, headVisible ? styles.revealed : styles.concealed)}
          data-revealed={headVisible ? "true" : "false"}
          aria-hidden={headVisible ? undefined : true}
        >
          <LetterGlyph kind="head" label={content.labels[0]} decorative />
        </div>
        <div
          className={joinClasses(
            styles.finalCut,
            styles.alfCut,
            lineageVisible ? styles.revealed : styles.concealed,
          )}
          data-revealed={lineageVisible ? "true" : "false"}
          aria-hidden={lineageVisible ? undefined : true}
        >
          <LetterGlyph kind="phoenician" label={content.labels[1]} decorative />
        </div>
        <div
          className={joinClasses(
            styles.finalCut,
            styles.alphaCut,
            lineageVisible ? styles.revealed : styles.concealed,
          )}
          data-revealed={lineageVisible ? "true" : "false"}
          aria-hidden={lineageVisible ? undefined : true}
        >
          <LetterGlyph kind="greek" label={content.labels[2]} decorative />
        </div>
      </div>
      <div
        className={joinClasses(styles.finalPunch, punchVisible ? styles.revealed : styles.concealed)}
        data-final-punch="true"
        data-revealed={punchVisible ? "true" : "false"}
        aria-hidden={punchVisible ? undefined : true}
        data-beat-layout-item="true"
      >
        <h2>
          {content.display.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </h2>
        <p>{content.support}</p>
      </div>
      <SourceCue>{content.source}</SourceCue>
    </div>
  );
}

function ScenePanel({
  sceneId,
  beat,
  language,
}: {
  sceneId: SceneId;
  beat: number;
  language: Lang;
}) {
  const safeBeat = clampBeat(sceneId, beat, language);
  const content = SCENES[sceneId][language];

  return (
    <section
      className={joinClasses(styles.scene, SCENE_CLASSES[sceneId])}
      aria-label={content.title}
      data-scene={sceneId}
      data-beat={safeBeat}
    >
      {sceneId === 1 && <SceneOne content={content} />}
      {sceneId === 2 && <SceneTwo content={content} />}
      {sceneId === 3 && <SceneThree content={content} beat={safeBeat} />}
      {sceneId === 4 && <SceneFour content={content} beat={safeBeat} />}
      {sceneId === 5 && <SceneFive content={content} beat={safeBeat} />}
    </section>
  );
}

function LineageNavigation({
  scene,
  language,
  isThumbnail,
  onNavigate,
}: {
  scene: SceneId;
  language: Lang;
  isThumbnail: boolean;
  onNavigate?: (scene: number, beat: number) => void;
}) {
  const handlePointerDown = useCallback((event: PointerEvent<HTMLButtonElement>) => {
    event.stopPropagation();
  }, []);

  const handleClick = useCallback(
    (event: MouseEvent<HTMLButtonElement>, targetScene: SceneId) => {
      event.stopPropagation();
      onNavigate?.(targetScene, 0);
    },
    [onNavigate],
  );

  if (isThumbnail) return null;

  return (
    <nav
      className={styles.lineageNav}
      aria-label={language === "zh" ? "字形年代导航" : "Letterform era navigation"}
      data-topic-navigation="true"
      data-navigation-geometry="typographic-index"
      data-navigation-carrier="letterform-lineage-index"
      data-navigation-invocation="persistent"
      data-navigation-feedback="material-color-change"
    >
      {SCENE_IDS.map((sceneId) => {
        const active = sceneId === scene;
        return (
          <button
            key={sceneId}
            type="button"
            className={joinClasses(styles.eraButton, active && styles.eraActive)}
            aria-label={
              language === "zh"
                ? `跳到${SCENES[sceneId][language].title}`
                : `Jump to ${SCENES[sceneId][language].title}`
            }
            aria-current={active ? "step" : undefined}
            onPointerDown={handlePointerDown}
            onClick={(event) => handleClick(event, sceneId)}
            onKeyDown={(event) => event.stopPropagation()}
          >
            <span>{SCENES[sceneId][language].nav}</span>
          </button>
        );
      })}
    </nav>
  );
}

function createMetadata(lang: Lang): TopicDefinition["metadata"]["en"] {
  return {
    theme: lang === "zh" ? "A 还不是 A 的时候" : "Before A Was A",
    densityLabel: lang === "zh" ? "舞台冲击" : "Stage Impact",
    heroScene: 4,
    colors: {
      bg: "#070706",
      ink: "#fff5df",
      panel: "#ef3f24",
    },
    typography: {
      header: "Anton 900",
      body: "Noto Sans SC 700",
    },
    tags: [
      "kinetic-type",
      "letterform-archaeology",
      "poster",
      "high-contrast",
      "stage-impact",
      "percussive-motion",
    ],
    fonts: ["Anton", "cjk:Noto Sans SC"],
    scenes: SCENE_IDS.map((sceneId) => {
      const scene = SCENES[sceneId][lang];
      return {
        id: sceneId,
        title: scene.title,
        beats: scene.beats.map((beat, index) => ({
          id: index,
          action: beat.action,
          title: beat.title,
          body: beat.body,
        })),
      };
    }),
  };
}

const metadata = {
  en: createMetadata("en"),
  zh: createMetadata("zh"),
} satisfies TopicDefinition["metadata"];

function TopicStage({
  scene,
  beat,
  language,
  isThumbnail,
  reducedMotion,
  onNavigate,
}: TopicStageProps) {
  useFonts();
  const safeScene = clampScene(scene);
  const safeBeat = clampBeat(safeScene, beat, language);
  const shouldReduceMotion = reducedMotion || isThumbnail;

  return (
    <div
      className={joinClasses(
        styles.root,
        language === "zh" && styles.zh,
        (safeScene === 3 || safeScene === 5) && styles.lightScene,
        shouldReduceMotion && styles.reducedMotion,
        isThumbnail && styles.thumbnail,
      )}
      data-language={language}
    >
      <SpatialSceneTrack
        scene={safeScene}
        beat={safeBeat}
        sceneIds={SCENE_IDS}
        transitionKind="afterimage"
        transitionMap={BEFORE_A_TRANSITION_MAP}
        transitionModifierMap={BEFORE_A_TRANSITION_MODIFIER_MAP}
        transitionDurationMs={520}
        reducedMotion={shouldReduceMotion}
        beatLayoutModes={BEAT_LAYOUT_MODES}
        className={styles.track}
        renderScene={(sceneId, sceneBeat) => (
          <ScenePanel
            sceneId={clampScene(sceneId)}
            beat={sceneBeat}
            language={language}
          />
        )}
      />
      <LineageNavigation
        scene={safeScene}
        language={language}
        isThumbnail={isThumbnail}
        onNavigate={onNavigate}
      />
    </div>
  );
}

export default defineTopic({
  id: "before-a",
  styleId: "kinetic-type-punchline",
  title: {
    en: "Before A",
    zh: "A之前",
  },
  modelId: "GPT 5.6 Sol",
  Stage: TopicStage,
  metadata,
  navigation: {
    geometry: "typographic-index",
    carrier: "letterform-lineage-index",
    invocation: "persistent",
    feedback: "material-color-change",
  },
  transitionScore: BEFORE_A_TRANSITION_SCORE,
  evidence: {
    kind: "mixed",
    sources: BEFORE_A_SOURCES,
    boundary: {
      en: "Historical letterforms are comparative teaching samples, not a single continuous or uniform aleph-to-A lineage; dates, shapes, locations, and paths of adoption vary across inscriptions and traditions.",
      zh: "历史字形为比较教学样本，并非一条连续或统一的从 aleph 到 A 的演变谱系；不同铭文和传统之间的年代、形状、地点与传播路径均有差异。",
    },
    display: "envelope",
  },
});

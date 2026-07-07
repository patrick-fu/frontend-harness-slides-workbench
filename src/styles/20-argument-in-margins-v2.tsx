import { useEffect } from "react";
import type { ReactNode } from "react";
import type { BespokeStyleProps, StyleMetadata } from "../types";
import SpatialSceneTrack from "./SpatialSceneTrack";
import type { BeatLayoutMode, SceneTransitionMap } from "./SpatialSceneTrack";
import { defineStyleVersion } from "./version";
import styles from "./20-argument-in-margins-v2.module.css";

type Language = "en" | "zh";

interface BeatCopy {
  id: number;
  action: string;
  title: string;
  body: string;
}

interface SceneCopy {
  label: string;
  kicker: string;
  titlePrefix: string;
  titleEmphasis: string;
  titleSuffix: string;
  body: string;
  sourceTitle: string;
  sourceLines: string[];
  marginNotes: string[];
  counterClaim: string;
  counterReply: string;
  conclusion: string;
  pin: string;
  beats: BeatCopy[];
}

const SCENE_IDS = [1, 2, 3, 4, 5] as const;
const TRANSITION_MAP: SceneTransitionMap = {
  "1->2": "fade",
  "2->3": "wipe",
  "3->4": "page-flip",
  "4->5": "hard-cut",
};
const BEAT_LAYOUT_MODES: Record<number, BeatLayoutMode> = {
  1: "reserved",
  2: "reserved",
  3: "reserved",
  4: "reserved",
  5: "reserved",
};

const SCENES: Record<number, Record<Language, SceneCopy>> = {
  1: {
    en: {
      label: "Thesis",
      kicker: "folio i",
      titlePrefix: "A claim is unfinished until the ",
      titleEmphasis: "margin",
      titleSuffix: " answers.",
      body: "The main text can make a position. The margin shows whether it survives first contact.",
      sourceTitle: "Working thesis",
      sourceLines: [
        "A thesis is a public sentence.",
        "Its private test arrives beside it.",
        "What cannot answer the margin is not ready.",
      ],
      marginNotes: ["claim placed", "premise named", "question reserved"],
      counterClaim: "",
      counterReply: "",
      conclusion: "",
      pin: "thesis pinned",
      beats: [
        {
          id: 0,
          action: "Pin the thesis as the central manuscript line.",
          title: "Thesis",
          body: "A claim is unfinished until the margin answers.",
        },
        {
          id: 1,
          action: "Reveal why the margin is the first stress test.",
          title: "First contact",
          body: "The main text makes a position; the margin tests it.",
        },
        {
          id: 2,
          action: "Reserve the three questions that will govern the argument.",
          title: "Three marginal tests",
          body: "Claim placed, premise named, question reserved.",
        },
      ],
    },
    zh: {
      label: "论点",
      kicker: "卷 i",
      titlePrefix: "一个论点，直到",
      titleEmphasis: "页边",
      titleSuffix: "回应，才算完成。",
      body: "正文可以提出立场；页边负责检验它能否承受第一次追问。",
      sourceTitle: "工作论点",
      sourceLines: [
        "论点是一句公开的话。",
        "它的私人检验写在旁边。",
        "不能回答页边的问题，就还没有准备好。",
      ],
      marginNotes: ["安放主张", "标出前提", "保留追问"],
      counterClaim: "",
      counterReply: "",
      conclusion: "",
      pin: "论点已钉住",
      beats: [
        {
          id: 0,
          action: "把论点钉在中央稿页上。",
          title: "论点",
          body: "一个论点，直到页边回应，才算完成。",
        },
        {
          id: 1,
          action: "揭示页边为何是第一道压力测试。",
          title: "第一次追问",
          body: "正文提出立场；页边检验立场。",
        },
        {
          id: 2,
          action: "预留接下来支配论证的三个问题。",
          title: "三个页边测试",
          body: "安放主张、标出前提、保留追问。",
        },
      ],
    },
  },
  2: {
    en: {
      label: "Source",
      kicker: "folio ii",
      titlePrefix: "The source text refuses to stay ",
      titleEmphasis: "silent",
      titleSuffix: ".",
      body: "A cited passage is not decoration. It is the room where the claim must speak clearly.",
      sourceTitle: "Source text",
      sourceLines: [
        "When a city writes down its memory,",
        "it also edits its future.",
        "Every archive is both lamp and locked door.",
        "The reader must ask who stands outside the light.",
      ],
      marginNotes: ["definition?", "outside the archive", "evidence before elegance"],
      counterClaim: "",
      counterReply: "",
      conclusion: "",
      pin: "source opened",
      beats: [
        {
          id: 0,
          action: "Open the cited passage as the source page.",
          title: "Source text",
          body: "The claim enters a passage with its own pressure.",
        },
        {
          id: 1,
          action: "Reveal the key quoted lines.",
          title: "The passage speaks",
          body: "Archive, memory, future, and exclusion become the working terms.",
        },
        {
          id: 2,
          action: "Place the first scholarly gloss beside the citation.",
          title: "First gloss",
          body: "Definition, boundary, and evidence are marked.",
        },
      ],
    },
    zh: {
      label: "原文",
      kicker: "卷 ii",
      titlePrefix: "原文并不保持",
      titleEmphasis: "沉默",
      titleSuffix: "。",
      body: "引用不是装饰。它是让论点必须说清楚的房间。",
      sourceTitle: "原文片段",
      sourceLines: [
        "当一座城市写下它的记忆，",
        "它也在编辑自己的未来。",
        "每一座档案馆既是灯，也是上锁的门。",
        "读者必须追问谁站在光外。",
      ],
      marginNotes: ["定义？", "谁在档案之外", "先证据，后文采"],
      counterClaim: "",
      counterReply: "",
      conclusion: "",
      pin: "原文已打开",
      beats: [
        {
          id: 0,
          action: "把引用作为原文稿页打开。",
          title: "原文",
          body: "论点进入一段自带压力的文字。",
        },
        {
          id: 1,
          action: "显露关键引用行。",
          title: "原文发声",
          body: "档案、记忆、未来与排除，成为工作术语。",
        },
        {
          id: 2,
          action: "把第一条学术旁注放到引文边上。",
          title: "第一条训诂",
          body: "定义、边界和证据被标出。",
        },
      ],
    },
  },
  3: {
    en: {
      label: "Marginalia",
      kicker: "folio iii",
      titlePrefix: "The margin becomes a ",
      titleEmphasis: "second author",
      titleSuffix: ".",
      body: "Annotation changes the argument by asking for precision exactly where the prose wants speed.",
      sourceTitle: "Margin work",
      sourceLines: [
        "A smooth paragraph hides the joints.",
        "A good note touches the hinge.",
        "A better note asks whether the hinge holds.",
      ],
      marginNotes: [
        "name the missing actor",
        "separate observation from judgment",
        "mark the leap in causality",
      ],
      counterClaim: "",
      counterReply: "",
      conclusion: "",
      pin: "notes accumulate",
      beats: [
        {
          id: 0,
          action: "Show the source fragment awaiting notes.",
          title: "Margin work",
          body: "The page keeps space for the argument beside the argument.",
        },
        {
          id: 1,
          action: "Reveal two precision notes in the margin.",
          title: "Precision notes",
          body: "Actor and judgment are separated.",
        },
        {
          id: 2,
          action: "Reveal the causal objection that changes the reading.",
          title: "Causal hinge",
          body: "The leap in causality is marked.",
        },
      ],
    },
    zh: {
      label: "旁注",
      kicker: "卷 iii",
      titlePrefix: "页边成为",
      titleEmphasis: "第二作者",
      titleSuffix: "。",
      body: "当正文急着向前，旁注会在最需要精确的地方改变论证。",
      sourceTitle: "页边工作",
      sourceLines: [
        "顺滑的段落会藏起关节。",
        "好的旁注碰到铰链。",
        "更好的旁注会问铰链是否承重。",
      ],
      marginNotes: ["说出缺席的行动者", "分开观察与判断", "标出因果跳跃"],
      counterClaim: "",
      counterReply: "",
      conclusion: "",
      pin: "旁注累积",
      beats: [
        {
          id: 0,
          action: "显示等待旁注的原文片段。",
          title: "页边工作",
          body: "页面在论证旁边，为另一层论证留出空间。",
        },
        {
          id: 1,
          action: "揭示两条精确化旁注。",
          title: "精确化旁注",
          body: "行动者与判断被拆开。",
        },
        {
          id: 2,
          action: "揭示改变阅读方式的因果质疑。",
          title: "因果铰链",
          body: "因果跳跃被标出。",
        },
      ],
    },
  },
  4: {
    en: {
      label: "Counterpoint",
      kicker: "folio iv",
      titlePrefix: "A counterpoint turns the page ",
      titleEmphasis: "back",
      titleSuffix: ".",
      body: "The objection is not a rival paragraph. It is a load test for the sentence that wants to conclude.",
      sourceTitle: "Two leaves",
      sourceLines: ["The main claim asks for assent.", "The counterpoint asks for proof."],
      marginNotes: ["define the burden", "keep the objection visible", "revise the hinge"],
      counterClaim: "A margin only annotates.",
      counterReply: "No. It tests the architecture of the claim.",
      conclusion: "The objection is not decoration; it is load-bearing.",
      pin: "counterpoint weighed",
      beats: [
        {
          id: 0,
          action: "Place the original claim on the left leaf.",
          title: "Claim",
          body: "A margin only annotates.",
        },
        {
          id: 1,
          action: "Place the counterpoint on the facing leaf.",
          title: "Reply",
          body: "The margin tests the architecture of the claim.",
        },
        {
          id: 2,
          action: "Mark the hinge that must be revised.",
          title: "Load-bearing objection",
          body: "The objection changes the conclusion.",
        },
      ],
    },
    zh: {
      label: "反题",
      kicker: "卷 iv",
      titlePrefix: "反题把页面",
      titleEmphasis: "翻回去",
      titleSuffix: "。",
      body: "质疑不是另一个竞争段落；它是结论句必须通过的承重测试。",
      sourceTitle: "双页",
      sourceLines: ["主张请求同意。", "反题要求证明。"],
      marginNotes: ["界定举证责任", "让质疑保持可见", "修订铰链"],
      counterClaim: "页边只是注释。",
      counterReply: "不。它检验主张的结构。",
      conclusion: "质疑不是装饰；它承担重量。",
      pin: "反题已称量",
      beats: [
        {
          id: 0,
          action: "把原主张放在左页。",
          title: "主张",
          body: "页边只是注释。",
        },
        {
          id: 1,
          action: "把反题放到相对的右页。",
          title: "回应",
          body: "页边检验主张的结构。",
        },
        {
          id: 2,
          action: "标出必须修订的铰链。",
          title: "承重的质疑",
          body: "质疑改变结论。",
        },
      ],
    },
  },
  5: {
    en: {
      label: "Conclusion",
      kicker: "folio v",
      titlePrefix: "The final argument is a ",
      titleEmphasis: "negotiated",
      titleSuffix: " text.",
      body: "Write the thesis. Invite the margin. Keep the sentence that survives both.",
      sourceTitle: "Final hand",
      sourceLines: [
        "The thesis is now smaller.",
        "The evidence is now closer.",
        "The answer is now earned.",
      ],
      marginNotes: ["revise", "seal", "cite"],
      counterClaim: "",
      counterReply: "",
      conclusion: "Keep the sentence that survives both.",
      pin: "answer sealed",
      beats: [
        {
          id: 0,
          action: "Return to one centered final leaf.",
          title: "Conclusion",
          body: "The final argument is a negotiated text.",
        },
        {
          id: 1,
          action: "Reveal the rule for surviving both text and margin.",
          title: "Survival rule",
          body: "Write the thesis. Invite the margin.",
        },
        {
          id: 2,
          action: "Seal the final sentence as the conclusion.",
          title: "Final sentence",
          body: "Keep the sentence that survives both.",
        },
      ],
    },
    zh: {
      label: "结论",
      kicker: "卷 v",
      titlePrefix: "最后的论证，是一份",
      titleEmphasis: "协商后",
      titleSuffix: "的文本。",
      body: "写下论点。邀请页边。留下同时经受二者的句子。",
      sourceTitle: "定稿",
      sourceLines: ["论点变小了。", "证据更近了。", "答案是挣来的。"],
      marginNotes: ["修订", "封存", "引用"],
      counterClaim: "",
      counterReply: "",
      conclusion: "留下同时经受二者的句子。",
      pin: "答案已封存",
      beats: [
        {
          id: 0,
          action: "回到一张居中的最终稿页。",
          title: "结论",
          body: "最后的论证，是一份协商后的文本。",
        },
        {
          id: 1,
          action: "揭示正文与页边共同筛选后的规则。",
          title: "幸存规则",
          body: "写下论点。邀请页边。",
        },
        {
          id: 2,
          action: "把最终句封存为结论。",
          title: "最终句",
          body: "留下同时经受二者的句子。",
        },
      ],
    },
  },
};

function useFonts() {
  useEffect(() => {
    const id = "style-20-argument-in-margins-v2-fonts";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@1,500;1,600&family=JetBrains+Mono:wght@500&family=Noto+Sans+SC:wght@400;500&family=Noto+Serif+SC:wght@500;600&family=Source+Sans+3:wght@400;500&display=swap";
    document.head.appendChild(link);
  }, []);
}

function clampScene(scene: number): number {
  return SCENE_IDS.includes(scene as (typeof SCENE_IDS)[number]) ? scene : 1;
}

function clampBeat(sceneId: number, language: Language, beat: number): number {
  const maxBeat = SCENES[sceneId][language].beats.length - 1;
  return Math.max(0, Math.min(beat, maxBeat));
}

function joinClasses(...classes: Array<string | false | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

function BeatSlot({
  beat,
  index,
  className,
  children,
}: {
  beat: number;
  index: number;
  className?: string;
  children: ReactNode;
}) {
  const isVisible = beat >= index;
  return (
    <div
      data-beat-layout-item="true"
      data-beat-index={index}
      data-visible={isVisible ? "true" : "false"}
      className={joinClasses(
        styles.beatSlot,
        isVisible ? styles.beatVisible : styles.beatHidden,
        className,
      )}
    >
      {children}
    </div>
  );
}

function TitleLine({ copy }: { copy: SceneCopy }) {
  return (
    <h1 className={styles.title}>
      {copy.titlePrefix}
      <span className={styles.roman}>{copy.titleEmphasis}</span>
      {copy.titleSuffix}
    </h1>
  );
}

function BeatMarkers({
  beat,
  total,
}: {
  beat: number;
  total: number;
}) {
  return (
    <div className={styles.beatMarkers} data-beat-layout-item="true" aria-hidden="true">
      {Array.from({ length: total }, (_, index) => (
        <span
          key={index}
          data-beat-marker="true"
          data-active={index <= beat ? "true" : "false"}
          className={styles.beatMarker}
        />
      ))}
    </div>
  );
}

function PinAnnotation({
  sceneId,
  copy,
  beat,
}: {
  sceneId: number;
  copy: SceneCopy;
  beat: number;
}) {
  return (
    <aside className={styles.pinNote} data-beat-layout-item="true" aria-label={copy.pin}>
      <span>{String(sceneId).padStart(2, "0")}</span>
      <span>{copy.pin}</span>
      <BeatMarkers beat={beat} total={copy.beats.length} />
    </aside>
  );
}

function BookmarkNav({
  activeScene,
  language,
  onNavigate,
}: {
  activeScene: number;
  language: Language;
  onNavigate?: (scene: number, beat: number) => void;
}) {
  return (
    <nav className={styles.sideNav} aria-label="Vellum side bookmarks">
      {SCENE_IDS.map((sceneId) => {
        const copy = SCENES[sceneId][language];
        return (
          <button
            key={sceneId}
            type="button"
            className={styles.bookmark}
            aria-current={sceneId === activeScene ? "page" : undefined}
            onClick={() => onNavigate?.(sceneId, 0)}
          >
            <span>{String(sceneId).padStart(2, "0")}</span>
            <span>{copy.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

function MarginalList({
  notes,
  beat,
  startAt = 0,
}: {
  notes: string[];
  beat: number;
  startAt?: number;
}) {
  return (
    <ol className={styles.marginalList}>
      {notes.map((note, index) => (
        <li key={note}>
          <BeatSlot
            beat={beat}
            index={Math.min(startAt + index, 2)}
            className={styles.marginNote}
          >
            <span className={styles.marginNumber}>
              {String(index + 1).padStart(2, "0")}
            </span>
            <span>{note}</span>
          </BeatSlot>
        </li>
      ))}
    </ol>
  );
}

function SceneOne({ copy, beat }: { copy: SceneCopy; beat: number }) {
  return (
    <div className={joinClasses(styles.scene, styles.sceneOne)}>
      <section className={joinClasses(styles.vellum, styles.thesisLeaf)}>
        <BeatSlot beat={beat} index={0} className={styles.kickerSlot}>
          <p className={styles.kicker}>{copy.kicker}</p>
          <TitleLine copy={copy} />
        </BeatSlot>
        <BeatSlot beat={beat} index={1} className={styles.bodySlot}>
          <p className={styles.body}>{copy.body}</p>
        </BeatSlot>
        <BeatSlot beat={beat} index={2} className={styles.noteSlot}>
          <MarginalList notes={copy.marginNotes} beat={2} />
        </BeatSlot>
      </section>
    </div>
  );
}

function SceneTwo({ copy, beat }: { copy: SceneCopy; beat: number }) {
  return (
    <div className={joinClasses(styles.scene, styles.sceneTwo)}>
      <section className={joinClasses(styles.vellum, styles.sourceLeaf)}>
        <BeatSlot beat={beat} index={0} className={styles.sourceHeader}>
          <p className={styles.kicker}>{copy.kicker}</p>
          <h2 className={styles.sectionTitle}>{copy.sourceTitle}</h2>
        </BeatSlot>
        <BeatSlot beat={beat} index={1} className={styles.sourceText}>
          {copy.sourceLines.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </BeatSlot>
      </section>
      <aside className={styles.marginColumn}>
        <BeatSlot beat={beat} index={0} className={styles.slimTitle}>
          <TitleLine copy={copy} />
        </BeatSlot>
        <MarginalList notes={copy.marginNotes} beat={beat} startAt={1} />
      </aside>
    </div>
  );
}

function SceneThree({ copy, beat }: { copy: SceneCopy; beat: number }) {
  return (
    <div className={joinClasses(styles.scene, styles.sceneThree)}>
      <section className={joinClasses(styles.vellum, styles.fragmentLeaf)}>
        <BeatSlot beat={beat} index={0} className={styles.kickerSlot}>
          <p className={styles.kicker}>{copy.kicker}</p>
          <TitleLine copy={copy} />
        </BeatSlot>
        <BeatSlot beat={beat} index={0} className={styles.fragmentLines}>
          {copy.sourceLines.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </BeatSlot>
      </section>
      <aside className={styles.annotationStack}>
        {copy.marginNotes.map((note, index) => (
          <BeatSlot
            key={note}
            beat={beat}
            index={Math.min(index, 2)}
            className={styles.annotation}
          >
            <span>{String(index + 1).padStart(2, "0")}</span>
            <p>{note}</p>
          </BeatSlot>
        ))}
      </aside>
    </div>
  );
}

function SceneFour({ copy, beat }: { copy: SceneCopy; beat: number }) {
  return (
    <div className={joinClasses(styles.scene, styles.sceneFour)}>
      <div className={styles.counterSpread}>
        <section className={joinClasses(styles.vellum, styles.counterLeaf)}>
          <BeatSlot beat={beat} index={0} className={styles.kickerSlot}>
            <p className={styles.kicker}>{copy.kicker}</p>
            <h2 className={styles.sectionTitle}>{copy.counterClaim}</h2>
          </BeatSlot>
          <BeatSlot beat={beat} index={1} className={styles.bodySlot}>
            <p className={styles.body}>{copy.sourceLines[0]}</p>
          </BeatSlot>
        </section>
        <section className={joinClasses(styles.vellum, styles.counterLeaf)}>
          <BeatSlot beat={beat} index={1} className={styles.kickerSlot}>
            <p className={styles.kicker}>{copy.sourceTitle}</p>
            <h2 className={styles.sectionTitle}>{copy.counterReply}</h2>
          </BeatSlot>
          <BeatSlot beat={beat} index={2} className={styles.bodySlot}>
            <p className={styles.body}>{copy.conclusion}</p>
          </BeatSlot>
        </section>
      </div>
      <aside className={styles.counterMargin}>
        <BeatSlot beat={beat} index={0}>
          <TitleLine copy={copy} />
        </BeatSlot>
        <MarginalList notes={copy.marginNotes} beat={beat} />
      </aside>
    </div>
  );
}

function SceneFive({ copy, beat }: { copy: SceneCopy; beat: number }) {
  return (
    <div className={joinClasses(styles.scene, styles.sceneFive)}>
      <section className={joinClasses(styles.vellum, styles.finalLeaf)}>
        <BeatSlot beat={beat} index={0} className={styles.kickerSlot}>
          <p className={styles.kicker}>{copy.kicker}</p>
          <TitleLine copy={copy} />
        </BeatSlot>
        <BeatSlot beat={beat} index={1} className={styles.bodySlot}>
          <p className={styles.body}>{copy.body}</p>
        </BeatSlot>
        <BeatSlot beat={beat} index={2} className={styles.sealSlot}>
          <p>{copy.conclusion}</p>
          <span>{copy.marginNotes.join(" / ")}</span>
        </BeatSlot>
      </section>
    </div>
  );
}

function ScenePanel({
  sceneId,
  beat,
  language,
}: {
  sceneId: number;
  beat: number;
  language: Language;
}) {
  const copy = SCENES[sceneId][language];
  const safeBeat = clampBeat(sceneId, language, beat);

  return (
    <article className={styles.sceneShell} data-scene-name={copy.label}>
      {sceneId === 1 && <SceneOne copy={copy} beat={safeBeat} />}
      {sceneId === 2 && <SceneTwo copy={copy} beat={safeBeat} />}
      {sceneId === 3 && <SceneThree copy={copy} beat={safeBeat} />}
      {sceneId === 4 && <SceneFour copy={copy} beat={safeBeat} />}
      {sceneId === 5 && <SceneFive copy={copy} beat={safeBeat} />}
      <PinAnnotation sceneId={sceneId} copy={copy} beat={safeBeat} />
    </article>
  );
}

export function getMetadata(lang: Language): StyleMetadata {
  return {
    id: "20",
    band: "editorial-print",
    name: lang === "zh" ? "学者羊皮纸" : "Scholars' Vellum",
    theme: lang === "zh" ? "页边的论证" : "The Argument in the Margins",
    densityLabel: lang === "zh" ? "留白阅读" : "Reserved Reading",
    heroScene: 3,
    colors: {
      bg: "#17130f",
      ink: "#ead7ad",
      panel: "#261f18",
    },
    typography: {
      header: "Cormorant Garamond 600 Italic",
      body: "Source Sans 3 400",
    },
    tags: [
      "editorial",
      "scholarly",
      "vellum",
      "serif",
      "marginalia",
      "reserved",
    ],
    fonts: [
      "Cormorant Garamond",
      "Source Sans 3",
      "JetBrains Mono",
      "cjk:Noto Serif SC",
      "cjk:Noto Sans SC",
    ],
    scenes: SCENE_IDS.map((sceneId) => ({
      id: sceneId,
      title: SCENES[sceneId][lang].label,
      beats: SCENES[sceneId][lang].beats,
    })),
  };
}

export default function ArgumentInMarginsV2({
  scene,
  beat,
  language,
  isThumbnail,
  reducedMotion,
  onNavigate,
}: BespokeStyleProps) {
  useFonts();

  const activeScene = clampScene(scene);
  const motionOff = reducedMotion || isThumbnail;

  return (
    <div
      className={joinClasses(styles.root, motionOff && styles.motionOff)}
      data-thumbnail={isThumbnail ? "true" : "false"}
      lang={language}
    >
      <SpatialSceneTrack
        scene={activeScene}
        beat={clampBeat(activeScene, language, beat)}
        transitionKind="fade"
        transitionMap={TRANSITION_MAP}
        transitionDurationMs={760}
        reducedMotion={motionOff}
        beatLayoutModes={BEAT_LAYOUT_MODES}
        className={styles.track}
        renderScene={(sceneId, sceneBeat) => (
          <ScenePanel sceneId={sceneId} beat={sceneBeat} language={language} />
        )}
      />
      {!isThumbnail && (
        <BookmarkNav
          activeScene={activeScene}
          language={language}
          onNavigate={onNavigate}
        />
      )}
    </div>
  );
}

export const argumentInMarginsV2Version = defineStyleVersion({
  id: "v2",
  topic: {
    en: "Margin Argument",
    zh: "页边论点",
  },
  model: "GPT-5.5",
  component: ArgumentInMarginsV2,
  getMetadata,
});

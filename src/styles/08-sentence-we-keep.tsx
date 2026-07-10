import { useEffect } from "react";
import type { CSSProperties, ReactNode } from "react";
import type { BespokeStyleProps, StyleMetadata } from "../types";
import SpatialSceneTrack, {
  type BeatLayoutMode,
  type SceneTransitionMap,
} from "./SpatialSceneTrack";
import { defineStyleTopic } from "./topic";

type Language = "en" | "zh";
type SceneId = 1 | 2 | 3 | 4 | 5;

interface QuoteSceneContent {
  metadataTitle: string;
  kicker: string;
  title: string;
  body: string;
  quote: string[];
  attribution: string;
  evidence: string[];
  editLabel: string;
  editBefore: string[];
  editAfter: string[];
  beats: StyleMetadata["scenes"][number]["beats"];
}

const SCENE_IDS: SceneId[] = [1, 2, 3, 4, 5];

const TRANSITION_MAP: SceneTransitionMap = {
  "1->2": "fade",
  "2->3": "scale-fade",
  "3->4": "fade",
  "4->5": "hard-cut",
};

const BEAT_LAYOUT_MODES: Partial<Record<number, BeatLayoutMode>> = {
  1: "reserved",
  2: "reserved",
  3: "reserved",
  4: "reserved",
  5: "reserved",
};

const COLORS = {
  bg: "#070605",
  ink: "#f6eddd",
  muted: "#9d8f7c",
  panel: "#15110d",
  paper: "#e8dcc5",
  paperInk: "#17120d",
  shadow: "#12100e",
  accent: "#8d2f28",
  footlight: "#d99a47",
};

const CONTENT: Record<Language, Record<SceneId, QuoteSceneContent>> = {
  en: {
    1: {
      metadataTitle: "Dark Stage",
      kicker: "Before the line",
      title: "The Sentence We Keep",
      body: "The room goes dark so one thought can stay visible.",
      quote: ["A stage is built", "for one sentence."],
      attribution: "opening pause",
      evidence: [],
      editLabel: "hold",
      editBefore: [],
      editAfter: [],
      beats: [
        {
          id: 0,
          action: "Open the spotlight",
          title: "Dark stage",
          body: "A quiet stage reserves attention.",
        },
        {
          id: 1,
          action: "Reveal the theme",
          title: "The Sentence We Keep",
          body: "The premise enters without a poster yet.",
        },
        {
          id: 2,
          action: "Set the pause",
          title: "One thought stays visible",
          body: "The first beat defines the silence around the quote.",
        },
      ],
    },
    2: {
      metadataTitle: "First Quote",
      kicker: "First draft",
      title: "First quote",
      body: "A full sentence steps into the pool of light.",
      quote: ["Keep the sentence", "that changes", "the room."],
      attribution: "from the working wall",
      evidence: [],
      editLabel: "keep",
      editBefore: [],
      editAfter: [],
      beats: [
        {
          id: 0,
          action: "Place the poster",
          title: "First quote",
          body: "The paper enters before the words fully arrive.",
        },
        {
          id: 1,
          action: "Raise the line",
          title: "Keep the sentence",
          body: "The quote takes the visual center.",
        },
        {
          id: 2,
          action: "Name the source",
          title: "Working wall",
          body: "A small attribution anchors the poster.",
        },
      ],
    },
    3: {
      metadataTitle: "Evidence Shadow",
      kicker: "What survived",
      title: "Evidence shadow",
      body: "Notes gather behind the quote, but never outshine it.",
      quote: ["It survived", "the notes."],
      attribution: "three quiet proofs",
      evidence: [
        "Repeated in the debrief",
        "Quoted without the slide",
        "Used to decide the next cut",
      ],
      editLabel: "proof",
      editBefore: [],
      editAfter: [],
      beats: [
        {
          id: 0,
          action: "Hold the quote",
          title: "Evidence shadow",
          body: "The hero sentence stays fixed.",
        },
        {
          id: 1,
          action: "Reveal shadow cards",
          title: "Notes behind it",
          body: "Evidence appears as depth, not data.",
        },
        {
          id: 2,
          action: "Dim the proof",
          title: "The quote still wins",
          body: "The supporting material remains secondary.",
        },
      ],
    },
    4: {
      metadataTitle: "Edit to Essence",
      kicker: "Cut the ornament",
      title: "Edit to essence",
      body: "The sentence gets shorter until it can be remembered.",
      quote: ["Keep only", "what carries."],
      attribution: "red pencil pass",
      evidence: [],
      editLabel: "EDIT",
      editBefore: ["Keep the sentence", "that changes the room"],
      editAfter: ["Keep", "the sentence."],
      beats: [
        {
          id: 0,
          action: "Show the draft",
          title: "Edit to essence",
          body: "The original phrase is still intact.",
        },
        {
          id: 1,
          action: "Strike the excess",
          title: "Cut the ornament",
          body: "The edit marks appear without moving the layout.",
        },
        {
          id: 2,
          action: "Hold the distilled line",
          title: "Keep the sentence",
          body: "The final form is shorter and easier to carry.",
        },
      ],
    },
    5: {
      metadataTitle: "Final Hold",
      kicker: "What remains",
      title: "Final hold",
      body: "The last frame stops explaining and lets the line stay.",
      quote: ["The sentence", "we keep", "becomes the standard."],
      attribution: "final hold",
      evidence: [],
      editLabel: "hold",
      editBefore: [],
      editAfter: [],
      beats: [
        {
          id: 0,
          action: "Cut to the black poster",
          title: "Final hold",
          body: "The scene arrives without transition flourish.",
        },
        {
          id: 1,
          action: "Set the final sentence",
          title: "The sentence we keep",
          body: "The quote becomes the entire frame.",
        },
        {
          id: 2,
          action: "Let it remain",
          title: "Becomes the standard",
          body: "The closing beat keeps the room still.",
        },
      ],
    },
  },
  zh: {
    1: {
      metadataTitle: "暗场",
      kicker: "在那句话之前",
      title: "留下的那句话",
      body: "房间暗下来，只让一个念头继续被看见。",
      quote: ["这一束光", "只等一句话。"],
      attribution: "开场停顿",
      evidence: [],
      editLabel: "留",
      editBefore: [],
      editAfter: [],
      beats: [
        {
          id: 0,
          action: "打开聚光",
          title: "暗场",
          body: "安静的舞台先预留注意力。",
        },
        {
          id: 1,
          action: "显出主题",
          title: "留下的那句话",
          body: "主题先进入，海报还没有完全出现。",
        },
        {
          id: 2,
          action: "建立停顿",
          title: "只让一个念头被看见",
          body: "第一幕定义语录周围的沉默。",
        },
      ],
    },
    2: {
      metadataTitle: "第一句",
      kicker: "第一版",
      title: "第一句",
      body: "完整的句子走进光里。",
      quote: ["留下那句", "能改变房间", "的话。"],
      attribution: "来自工作墙",
      evidence: [],
      editLabel: "留",
      editBefore: [],
      editAfter: [],
      beats: [
        {
          id: 0,
          action: "放上海报",
          title: "第一句",
          body: "纸面先出现，文字随后落定。",
        },
        {
          id: 1,
          action: "抬起句子",
          title: "留下那句",
          body: "语录占据视觉中心。",
        },
        {
          id: 2,
          action: "标注来源",
          title: "工作墙",
          body: "小号署名固定这张海报。",
        },
      ],
    },
    3: {
      metadataTitle: "证据阴影",
      kicker: "留下来的原因",
      title: "证据阴影",
      body: "笔记在背后聚拢，但不抢走那句话。",
      quote: ["它留了下来", "因为反复被用到。"],
      attribution: "三条安静证据",
      evidence: ["复盘里又被提起", "离开幻灯片后仍被引用", "下一次删改用它做判断"],
      editLabel: "证据",
      editBefore: [],
      editAfter: [],
      beats: [
        {
          id: 0,
          action: "稳住语录",
          title: "证据阴影",
          body: "核心句子保持固定。",
        },
        {
          id: 1,
          action: "露出背后卡片",
          title: "笔记在背后",
          body: "证据成为深度，而不是数据展示。",
        },
        {
          id: 2,
          action: "压低证明",
          title: "还是那句话获胜",
          body: "支撑材料继续保持次要。",
        },
      ],
    },
    4: {
      metadataTitle: "删到本质",
      kicker: "删掉装饰",
      title: "删到本质",
      body: "句子越短，越容易被带走。",
      quote: ["只留下", "真正承重的部分。"],
      attribution: "红笔一遍",
      evidence: [],
      editLabel: "删改",
      editBefore: ["留下那句", "能改变房间的话"],
      editAfter: ["留下", "那句话。"],
      beats: [
        {
          id: 0,
          action: "展示草稿",
          title: "删到本质",
          body: "原句仍然完整。",
        },
        {
          id: 1,
          action: "划掉多余部分",
          title: "删掉装饰",
          body: "删改痕迹出现，但版式不跳动。",
        },
        {
          id: 2,
          action: "保留精炼句",
          title: "留下那句话",
          body: "最终形态更短，也更容易被记住。",
        },
      ],
    },
    5: {
      metadataTitle: "最后停住",
      kicker: "剩下的东西",
      title: "最后停住",
      body: "最后一幕不再解释，只让那句话留下。",
      quote: ["被留下的", "那句话", "会变成标准。"],
      attribution: "最后停住",
      evidence: [],
      editLabel: "留",
      editBefore: [],
      editAfter: [],
      beats: [
        {
          id: 0,
          action: "切到黑色海报",
          title: "最后停住",
          body: "场景不靠花哨转场进入。",
        },
        {
          id: 1,
          action: "放下最终句",
          title: "被留下的那句话",
          body: "语录成为整张画面。",
        },
        {
          id: 2,
          action: "让它停留",
          title: "会变成标准",
          body: "收束节拍保持房间安静。",
        },
      ],
    },
  },
};

const rootStyle = {
  "--sentence08-bg": COLORS.bg,
  "--sentence08-ink": COLORS.ink,
  "--sentence08-muted": COLORS.muted,
  "--sentence08-panel": COLORS.panel,
  "--sentence08-paper": COLORS.paper,
  "--sentence08-paper-ink": COLORS.paperInk,
  "--sentence08-shadow": COLORS.shadow,
  "--sentence08-accent": COLORS.accent,
  "--sentence08-footlight": COLORS.footlight,
  position: "relative",
  width: "100cqw",
  height: "100cqh",
  containerType: "size",
  overflow: "hidden",
  background: "var(--sentence08-bg)",
  color: "var(--sentence08-ink)",
  fontFamily: "\"Libre Baskerville\", \"Noto Serif SC\", serif",
  boxSizing: "border-box",
} as CSSProperties;

const sceneFrameStyle: CSSProperties = {
  position: "relative",
  width: "100cqw",
  height: "100cqh",
  overflow: "hidden",
  boxSizing: "border-box",
};

function useFonts() {
  useEffect(() => {
    const id = "style-08-sentence-we-keep-v2-fonts";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Noto+Serif+SC:wght@400;600;700&family=Playfair+Display:ital,wght@0,600;0,700;1,600&display=swap";
    document.head.appendChild(link);
  }, []);
}

function isSceneId(value: number): value is SceneId {
  return value >= 1 && value <= 5 && Number.isInteger(value);
}

function clampBeat(beat: number, maxBeat: number): number {
  return Math.min(Math.max(beat, 0), maxBeat);
}

function getContent(language: Language, scene: number): QuoteSceneContent {
  const sceneId = isSceneId(scene) ? scene : 1;
  return CONTENT[language][sceneId];
}

function quoteFont(language: Language): string {
  return language === "zh"
    ? "\"Noto Serif SC\", \"Songti SC\", serif"
    : "\"Playfair Display\", \"Libre Baskerville\", Georgia, serif";
}

function revealStyle(
  visible: boolean,
  motionDisabled: boolean,
  delay = "0ms",
  lift = "1.4cqh",
): CSSProperties {
  return {
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0cqh)" : `translateY(${lift})`,
    transition: motionDisabled
      ? "none"
      : `opacity 680ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}, transform 680ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}`,
  };
}

function StageAtmosphere({
  scene,
  beat,
  motionDisabled,
}: {
  scene: SceneId;
  beat: number;
  motionDisabled: boolean;
}) {
  const lightLevel = scene === 1 ? 0.42 : scene === 5 ? 0.5 : 0.62;
  const width = scene === 1 ? "26cqw" : scene === 3 ? "42cqw" : "36cqw";
  const x = scene === 3 ? "47%" : scene === 4 ? "52%" : "50%";
  const y = scene === 1 ? "7%" : "9%";

  return (
    <div aria-hidden="true" style={{ position: "absolute", inset: "0cqw" }}>
      <div
        style={{
          position: "absolute",
          inset: "0cqw",
          background: `radial-gradient(ellipse ${width} 64cqh at ${x} ${y}, rgba(255, 233, 190, ${lightLevel}) 0%, rgba(255, 223, 172, 0.22) 25%, rgba(255, 218, 162, 0.08) 44%, rgba(7, 6, 5, 0) 68%), linear-gradient(180deg, #050403 0%, #0b0907 58%, #030302 100%)`,
          transition: motionDisabled
            ? "none"
            : "background 700ms cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: scene === 1 ? "40cqw" : "31cqw",
          top: "8cqh",
          width,
          height: scene === 1 ? "78cqh" : "72cqh",
          clipPath: "polygon(42% 0%, 58% 0%, 100% 100%, 0% 100%)",
          background:
            "linear-gradient(180deg, rgba(255, 237, 198, 0.22) 0%, rgba(255, 229, 183, 0.09) 38%, rgba(255, 229, 183, 0) 100%)",
          filter: "blur(0.8cqw)",
          opacity: scene === 1 ? 0.9 : 0.62,
          transform: beat > 0 ? "translateY(0.4cqh)" : "translateY(0cqh)",
          transition: motionDisabled
            ? "none"
            : "opacity 700ms ease, transform 700ms ease",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: "0cqw",
          right: "0cqw",
          bottom: "0cqh",
          height: "18cqh",
          background:
            "linear-gradient(180deg, rgba(7, 6, 5, 0) 0%, rgba(9, 7, 5, 0.9) 48%, rgba(4, 3, 3, 1) 100%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: "0cqw",
          opacity: 0.18,
          backgroundImage:
            "repeating-radial-gradient(circle at 18% 24%, rgba(255,255,255,0.18) 0cqw, rgba(255,255,255,0.18) 0.05cqw, transparent 0.08cqw, transparent 0.34cqw)",
          mixBlendMode: "screen",
        }}
      />
    </div>
  );
}

function ScenePanel({
  scene,
  beat,
  language,
  motionDisabled,
}: {
  scene: number;
  beat: number;
  language: Language;
  motionDisabled: boolean;
}) {
  const sceneId = isSceneId(scene) ? scene : 1;
  const content = CONTENT[language][sceneId];
  const safeBeat = clampBeat(beat, content.beats.length - 1);

  if (sceneId === 1) {
    return (
      <DarkStageScene
        content={content}
        beat={safeBeat}
        language={language}
        motionDisabled={motionDisabled}
      />
    );
  }

  if (sceneId === 2) {
    return (
      <FirstQuoteScene
        content={content}
        beat={safeBeat}
        language={language}
        motionDisabled={motionDisabled}
      />
    );
  }

  if (sceneId === 3) {
    return (
      <EvidenceScene
        content={content}
        beat={safeBeat}
        language={language}
        motionDisabled={motionDisabled}
      />
    );
  }

  if (sceneId === 4) {
    return (
      <EditScene
        content={content}
        beat={safeBeat}
        language={language}
        motionDisabled={motionDisabled}
      />
    );
  }

  return (
    <FinalHoldScene
      content={content}
      beat={safeBeat}
      language={language}
      motionDisabled={motionDisabled}
    />
  );
}

function DarkStageScene({
  content,
  beat,
  language,
  motionDisabled,
}: {
  content: QuoteSceneContent;
  beat: number;
  language: Language;
  motionDisabled: boolean;
}) {
  return (
    <div
      style={sceneFrameStyle}
      data-beat-layout-container="true"
      data-beat-layout-mode="reserved"
    >
      <div
        data-beat-layout-item="true"
        style={{
          position: "absolute",
          left: "12cqw",
          top: "56cqh",
          width: "42cqw",
          minHeight: "24cqh",
          ...revealStyle(beat >= 1, motionDisabled),
        }}
      >
        <div style={kickerStyle}>{content.kicker}</div>
        <h1
          style={{
            margin: "1.2cqh 0cqw 0cqh",
            color: "var(--sentence08-ink)",
            fontFamily: quoteFont(language),
            fontSize: language === "zh" ? "6.2cqw" : "5.8cqw",
            lineHeight: 0.98,
            fontWeight: 600,
            letterSpacing: 0,
          }}
        >
          {content.title}
        </h1>
      </div>
      <p
        data-beat-layout-item="true"
        style={{
          position: "absolute",
          left: "12.3cqw",
          top: "82cqh",
          width: "36cqw",
          margin: "0cqw",
          color: "rgba(246, 237, 221, 0.68)",
          fontSize: language === "zh" ? "1.9cqw" : "1.55cqw",
          lineHeight: 1.55,
          ...revealStyle(beat >= 2, motionDisabled, "90ms", "0.8cqh"),
        }}
      >
        {content.body}
      </p>
      <div
        data-beat-layout-item="true"
        aria-hidden="true"
        style={{
          position: "absolute",
          left: "42cqw",
          top: "80cqh",
          width: "17cqw",
          height: "1.2cqh",
          borderRadius: "999cqw",
          background:
            "radial-gradient(ellipse at center, rgba(255, 230, 176, 0.74) 0%, rgba(255, 213, 139, 0.18) 52%, rgba(255, 213, 139, 0) 74%)",
          filter: "blur(0.25cqw)",
          opacity: beat >= 0 ? 1 : 0,
        }}
      />
    </div>
  );
}

function FirstQuoteScene({
  content,
  beat,
  language,
  motionDisabled,
}: {
  content: QuoteSceneContent;
  beat: number;
  language: Language;
  motionDisabled: boolean;
}) {
  return (
    <div
      style={sceneFrameStyle}
      data-beat-layout-container="true"
      data-beat-layout-mode="reserved"
    >
      <Poster
        variant="paper"
        dataBeatItem
        style={{
          left: "28cqw",
          top: "16cqh",
          width: "44cqw",
          height: "68cqh",
          ...revealStyle(beat >= 0, motionDisabled, "0ms", "0.6cqh"),
        }}
      >
        <QuoteMark align="left" dark={false} />
        <QuoteLines
          lines={content.quote}
          language={language}
          color="var(--sentence08-paper-ink)"
          visible={beat >= 1}
          motionDisabled={motionDisabled}
          size={language === "zh" ? "5.5cqw" : "5.9cqw"}
        />
        <Attribution
          text={content.attribution}
          visible={beat >= 2}
          motionDisabled={motionDisabled}
          tone="paper"
        />
      </Poster>
      <SideCaption
        content={content}
        beat={beat}
        language={language}
        motionDisabled={motionDisabled}
      />
    </div>
  );
}

function EvidenceScene({
  content,
  beat,
  language,
  motionDisabled,
}: {
  content: QuoteSceneContent;
  beat: number;
  language: Language;
  motionDisabled: boolean;
}) {
  return (
    <div
      style={sceneFrameStyle}
      data-beat-layout-container="true"
      data-beat-layout-mode="reserved"
    >
      <EvidenceCards
        items={content.evidence}
        visible={beat >= 1}
        emphasized={beat >= 2}
        language={language}
        motionDisabled={motionDisabled}
      />
      <Poster
        variant="paper"
        dataBeatItem
        style={{
          left: "33cqw",
          top: "24cqh",
          width: "34cqw",
          height: "52cqh",
          boxShadow:
            "0cqw 2.4cqh 4.4cqw rgba(0,0,0,0.58), 0cqw 0cqh 2.4cqw rgba(255,226,180,0.1)",
          ...revealStyle(beat >= 0, motionDisabled, "0ms", "0.4cqh"),
        }}
      >
        <QuoteMark align="left" dark={false} />
        <QuoteLines
          lines={content.quote}
          language={language}
          color="var(--sentence08-paper-ink)"
          visible={beat >= 0}
          motionDisabled={motionDisabled}
          size={language === "zh" ? "3.5cqw" : "4.6cqw"}
        />
        <Attribution
          text={content.attribution}
          visible={beat >= 2}
          motionDisabled={motionDisabled}
          tone="paper"
        />
      </Poster>
      <SideCaption
        content={content}
        beat={beat}
        language={language}
        motionDisabled={motionDisabled}
      />
    </div>
  );
}

function EditScene({
  content,
  beat,
  language,
  motionDisabled,
}: {
  content: QuoteSceneContent;
  beat: number;
  language: Language;
  motionDisabled: boolean;
}) {
  return (
    <div
      style={sceneFrameStyle}
      data-beat-layout-container="true"
      data-beat-layout-mode="reserved"
    >
      <Poster
        variant="paper"
        dataBeatItem
        style={{
          left: "23cqw",
          top: "18cqh",
          width: "54cqw",
          height: "64cqh",
          ...revealStyle(beat >= 0, motionDisabled, "0ms", "0.4cqh"),
        }}
      >
        <QuoteMark align="left" dark={false} />
        <div
          data-beat-layout-item="true"
          style={{
            position: "absolute",
            left: "8cqw",
            top: "18cqh",
            width: "38cqw",
            minHeight: "18cqh",
            color: "var(--sentence08-paper-ink)",
            fontFamily: quoteFont(language),
            fontSize: language === "zh" ? "4.6cqw" : "4.9cqw",
            lineHeight: 1.06,
            fontWeight: 600,
            letterSpacing: 0,
            ...revealStyle(beat >= 0, motionDisabled),
          }}
        >
          {content.editBefore.map((line) => (
            <div key={line}>{line}</div>
          ))}
          <StrikeLine
            top="4.8cqh"
            visible={beat >= 1}
            motionDisabled={motionDisabled}
          />
          <StrikeLine
            top="10.8cqh"
            visible={beat >= 1}
            motionDisabled={motionDisabled}
            rotate="-3deg"
          />
        </div>
        <div
          data-beat-layout-item="true"
          style={{
            position: "absolute",
            right: "6cqw",
            top: "13cqh",
            color: "var(--sentence08-accent)",
            fontFamily:
              language === "zh"
                ? "\"Noto Serif SC\", serif"
                : "\"Libre Baskerville\", Georgia, serif",
            fontSize: language === "zh" ? "2.2cqw" : "1.8cqw",
            fontStyle: language === "zh" ? "normal" : "italic",
            fontWeight: 700,
            transform: "rotate(-7deg)",
            ...revealStyle(beat >= 1, motionDisabled, "60ms", "0.5cqh"),
          }}
        >
          {content.editLabel}
        </div>
        <div
          data-beat-layout-item="true"
          style={{
            position: "absolute",
            left: "15cqw",
            top: "43cqh",
            width: "26cqw",
            minHeight: "12cqh",
            color: "var(--sentence08-accent)",
            fontFamily: quoteFont(language),
            fontSize: language === "zh" ? "4.2cqw" : "4.4cqw",
            lineHeight: 1.04,
            fontWeight: 600,
            letterSpacing: 0,
            textAlign: "center",
            ...revealStyle(beat >= 2, motionDisabled, "90ms", "0.7cqh"),
          }}
        >
          {content.editAfter.map((line) => (
            <div key={line}>{line}</div>
          ))}
        </div>
        <Attribution
          text={content.attribution}
          visible={beat >= 2}
          motionDisabled={motionDisabled}
          tone="paper"
        />
      </Poster>
      <SideCaption
        content={content}
        beat={beat}
        language={language}
        motionDisabled={motionDisabled}
      />
    </div>
  );
}

function FinalHoldScene({
  content,
  beat,
  language,
  motionDisabled,
}: {
  content: QuoteSceneContent;
  beat: number;
  language: Language;
  motionDisabled: boolean;
}) {
  return (
    <div
      style={sceneFrameStyle}
      data-beat-layout-container="true"
      data-beat-layout-mode="reserved"
    >
      <Poster
        variant="black"
        dataBeatItem
        style={{
          left: "25cqw",
          top: "17cqh",
          width: "50cqw",
          height: "66cqh",
          ...revealStyle(beat >= 0, motionDisabled, "0ms", "0cqh"),
        }}
      >
        <QuoteMark align="left" dark />
        <QuoteLines
          lines={content.quote}
          language={language}
          color="var(--sentence08-ink)"
          visible={beat >= 1}
          motionDisabled={motionDisabled}
          size={language === "zh" ? "4.9cqw" : "5.2cqw"}
        />
        <Attribution
          text={content.attribution}
          visible={beat >= 2}
          motionDisabled={motionDisabled}
          tone="black"
        />
      </Poster>
      <p
        data-beat-layout-item="true"
        style={{
          position: "absolute",
          left: "32cqw",
          top: "85cqh",
          width: "36cqw",
          margin: "0cqw",
          color: "rgba(246, 237, 221, 0.46)",
          fontSize: language === "zh" ? "1.55cqw" : "1.25cqw",
          lineHeight: 1.6,
          textAlign: "center",
          ...revealStyle(beat >= 2, motionDisabled, "120ms", "0.4cqh"),
        }}
      >
        {content.body}
      </p>
    </div>
  );
}

function Poster({
  variant,
  dataBeatItem,
  style,
  children,
}: {
  variant: "paper" | "black";
  dataBeatItem?: boolean;
  style?: CSSProperties;
  children: ReactNode;
}) {
  const isPaper = variant === "paper";

  return (
    <div
      data-beat-layout-item={dataBeatItem ? "true" : undefined}
      style={{
        position: "absolute",
        boxSizing: "border-box",
        borderRadius: "0.35cqw",
        overflow: "hidden",
        border: isPaper
          ? "0.08cqw solid rgba(72, 55, 33, 0.22)"
          : "0.08cqw solid rgba(217, 154, 71, 0.24)",
        background: isPaper
          ? "radial-gradient(ellipse at 48% 26%, rgba(255,247,225,0.96) 0%, rgba(232,220,197,0.98) 52%, rgba(202,184,151,0.96) 100%)"
          : "radial-gradient(ellipse at 50% 20%, rgba(38,32,25,0.96) 0%, rgba(18,15,12,0.98) 56%, rgba(7,6,5,1) 100%)",
        color: isPaper
          ? "var(--sentence08-paper-ink)"
          : "var(--sentence08-ink)",
        boxShadow: isPaper
          ? "0cqw 2.8cqh 5.5cqw rgba(0,0,0,0.62), 0cqw 0cqh 2.2cqw rgba(255,226,180,0.15)"
          : "0cqw 3cqh 6cqw rgba(0,0,0,0.72), 0cqw 0cqh 2.6cqw rgba(217,154,71,0.12)",
        ...style,
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: "0cqw",
          opacity: isPaper ? 0.13 : 0.18,
          backgroundImage:
            "repeating-radial-gradient(circle at 28% 18%, rgba(0,0,0,0.44) 0cqw, rgba(0,0,0,0.44) 0.04cqw, transparent 0.06cqw, transparent 0.28cqw)",
          mixBlendMode: isPaper ? "multiply" : "screen",
        }}
      />
      {children}
    </div>
  );
}

function QuoteMark({ align, dark }: { align: "left" | "right"; dark: boolean }) {
  return (
    <div
      data-beat-layout-item="true"
      aria-hidden="true"
      style={{
        position: "absolute",
        left: align === "left" ? "4cqw" : undefined,
        right: align === "right" ? "4cqw" : undefined,
        top: "3cqh",
        color: dark ? "rgba(246,237,221,0.18)" : "rgba(23,18,13,0.25)",
        fontFamily: "\"Playfair Display\", Georgia, serif",
        fontSize: "8cqw",
        lineHeight: 0.8,
        fontWeight: 700,
      }}
    >
      “
    </div>
  );
}

function QuoteLines({
  lines,
  language,
  color,
  visible,
  motionDisabled,
  size,
}: {
  lines: string[];
  language: Language;
  color: string;
  visible: boolean;
  motionDisabled: boolean;
  size: string;
}) {
  return (
    <div
      data-beat-layout-item="true"
      style={{
        position: "absolute",
        left: "6cqw",
        right: "6cqw",
        top: "19cqh",
        minHeight: "28cqh",
        color,
        fontFamily: quoteFont(language),
        fontSize: size,
        lineHeight: language === "zh" ? 1.14 : 0.94,
        fontWeight: 600,
        letterSpacing: 0,
        textAlign: "center",
        ...revealStyle(visible, motionDisabled, "40ms", "0.6cqh"),
      }}
    >
      {lines.map((line) => (
        <div key={line}>{line}</div>
      ))}
    </div>
  );
}

function Attribution({
  text,
  visible,
  motionDisabled,
  tone,
}: {
  text: string;
  visible: boolean;
  motionDisabled: boolean;
  tone: "paper" | "black";
}) {
  return (
    <div
      data-beat-layout-item="true"
      style={{
        position: "absolute",
        left: "8cqw",
        right: "8cqw",
        bottom: "8cqh",
        minHeight: "6cqh",
        color:
          tone === "paper"
            ? "rgba(23,18,13,0.52)"
            : "rgba(246,237,221,0.58)",
        fontSize: "1.2cqw",
        lineHeight: 1.6,
        textAlign: "center",
        fontStyle: "italic",
        ...revealStyle(visible, motionDisabled, "90ms", "0.45cqh"),
      }}
    >
      <div
        aria-hidden="true"
        style={{
          width: "12cqw",
          height: "0.12cqh",
          margin: "0cqh auto 1.8cqh",
          background:
            tone === "paper"
              ? "rgba(23,18,13,0.34)"
              : "rgba(217,154,71,0.58)",
        }}
      />
      {text}
    </div>
  );
}

function EvidenceCards({
  items,
  visible,
  emphasized,
  language,
  motionDisabled,
}: {
  items: string[];
  visible: boolean;
  emphasized: boolean;
  language: Language;
  motionDisabled: boolean;
}) {
  const transforms = [
    "translate(-12cqw, -7cqh) rotate(-8deg)",
    "translate(10cqw, -4cqh) rotate(7deg)",
    "translate(-7cqw, 12cqh) rotate(5deg)",
  ];

  return (
    <div
      data-beat-layout-item="true"
      aria-label={language === "zh" ? "证据阴影" : "Evidence shadow"}
      style={{
        position: "absolute",
        left: "34cqw",
        top: "25cqh",
        width: "32cqw",
        height: "48cqh",
      }}
    >
      {items.map((item, index) => (
        <div
          key={item}
          style={{
            position: "absolute",
            left: "0cqw",
            top: "0cqh",
            width: "30cqw",
            height: "24cqh",
            padding: "3.2cqh 2.4cqw",
            boxSizing: "border-box",
            borderRadius: "0.25cqw",
            background:
              "linear-gradient(180deg, rgba(29,26,23,0.96) 0%, rgba(13,12,11,0.98) 100%)",
            border: "0.08cqw solid rgba(246,237,221,0.08)",
            color: "rgba(246,237,221,0.42)",
            boxShadow: "0cqw 1.6cqh 3.2cqw rgba(0,0,0,0.54)",
            opacity: visible ? (emphasized ? 0.78 : 0.5) : 0,
            transform: visible ? transforms[index] : "translate(0cqw, 0cqh)",
            transition: motionDisabled
              ? "none"
              : `opacity 700ms ease ${index * 90}ms, transform 700ms cubic-bezier(0.16, 1, 0.3, 1) ${index * 90}ms`,
          }}
        >
          <div
            style={{
              width: "12cqw",
              height: "0.8cqh",
              marginBottom: "2cqh",
              background: "rgba(246,237,221,0.16)",
            }}
          />
          <p
            style={{
              margin: "0cqw",
              fontSize: language === "zh" ? "1.35cqw" : "1.1cqw",
              lineHeight: 1.55,
            }}
          >
            {item}
          </p>
        </div>
      ))}
    </div>
  );
}

function StrikeLine({
  top,
  visible,
  motionDisabled,
  rotate = "2deg",
}: {
  top: string;
  visible: boolean;
  motionDisabled: boolean;
  rotate?: string;
}) {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        left: "-1cqw",
        top,
        width: "35cqw",
        height: "0.45cqh",
        borderRadius: "999cqw",
        background: "rgba(141, 47, 40, 0.86)",
        opacity: visible ? 1 : 0,
        transform: visible ? `rotate(${rotate}) scaleX(1)` : `rotate(${rotate}) scaleX(0)`,
        transformOrigin: "left center",
        transition: motionDisabled
          ? "none"
          : "opacity 420ms ease, transform 520ms cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    />
  );
}

const kickerStyle: CSSProperties = {
  color: "var(--sentence08-footlight)",
  fontSize: "1.15cqw",
  lineHeight: 1.4,
  textTransform: "uppercase",
  letterSpacing: 0,
};

function SideCaption({
  content,
  beat,
  language,
  motionDisabled,
}: {
  content: QuoteSceneContent;
  beat: number;
  language: Language;
  motionDisabled: boolean;
}) {
  return (
    <aside
      data-beat-layout-item="true"
      style={{
        position: "absolute",
        left: "7cqw",
        top: "19cqh",
        width: "17cqw",
        minHeight: "34cqh",
        color: "rgba(246, 237, 221, 0.68)",
        ...revealStyle(beat >= 0, motionDisabled, "80ms", "0.5cqh"),
      }}
    >
      <div style={kickerStyle}>{content.kicker}</div>
      <h2
        style={{
          margin: "1.8cqh 0cqw 2cqh",
          fontFamily: quoteFont(language),
          fontSize: language === "zh" ? "3cqw" : "2.45cqw",
          lineHeight: 1.02,
          fontWeight: 600,
          letterSpacing: 0,
        }}
      >
        {content.title}
      </h2>
      <p
        style={{
          margin: "0cqw",
          color: "rgba(246, 237, 221, 0.52)",
          fontSize: language === "zh" ? "1.32cqw" : "1.08cqw",
          lineHeight: 1.65,
        }}
      >
        {content.body}
      </p>
    </aside>
  );
}

function FootlightTicks({
  activeScene,
  onNavigate,
  language,
  isThumbnail,
}: {
  activeScene: SceneId;
  onNavigate?: (scene: number, beat: number) => void;
  language: Language;
  isThumbnail: boolean;
}) {
  if (isThumbnail) return null;

  return (
    <nav
      aria-label={language === "zh" ? "场景导航" : "Scene navigation"}
      style={{
        position: "absolute",
        left: "35cqw",
        bottom: "3.1cqh",
        width: "30cqw",
        height: "4.8cqh",
        display: "grid",
        gridTemplateColumns: "repeat(5, 1fr)",
        alignItems: "end",
        zIndex: 5,
      }}
    >
      {SCENE_IDS.map((targetScene) => {
        const active = targetScene === activeScene;
        return (
          <button
            key={targetScene}
            type="button"
            aria-label={
              language === "zh"
                ? `跳到第 ${targetScene} 幕`
                : `Go to scene ${targetScene}`
            }
            aria-current={active ? "step" : undefined}
            onClick={() => onNavigate?.(targetScene, 0)}
            style={{
              appearance: "none",
              alignSelf: "end",
              justifySelf: "center",
              width: "2.4cqw",
              height: "4.2cqh",
              border: "0cqw",
              padding: "0cqw",
              background: "transparent",
              cursor: onNavigate ? "pointer" : "default",
              position: "relative",
            }}
          >
            <span
              aria-hidden="true"
              style={{
                position: "absolute",
                left: "1.04cqw",
                bottom: "0.2cqh",
                width: "0.32cqw",
                height: active ? "2.3cqh" : "1.35cqh",
                borderRadius: "999cqw",
                background: "var(--sentence08-footlight)",
                boxShadow: active
                  ? "0cqw 0cqh 1.4cqw rgba(217,154,71,0.95), 0cqw -1.2cqh 2.6cqw rgba(255,226,174,0.38)"
                  : "0cqw 0cqh 0.7cqw rgba(217,154,71,0.38)",
                opacity: active ? 1 : 0.48,
                transition: "height 220ms ease, opacity 220ms ease, box-shadow 220ms ease",
              }}
            />
            <span
              aria-hidden="true"
              style={{
                position: "absolute",
                left: "0.35cqw",
                bottom: "0cqh",
                width: "1.7cqw",
                height: "0.18cqh",
                background: active
                  ? "rgba(217,154,71,0.72)"
                  : "rgba(217,154,71,0.28)",
              }}
            />
          </button>
        );
      })}
    </nav>
  );
}

export function getMetadata(lang: Language): StyleMetadata {
  const localized = CONTENT[lang];

  return {
    id: "spotlight-quote-poster",
    band: "minimal-keynote",
    name: lang === "zh" ? "聚光语录海报" : "Spotlight Quote Poster",
    theme: lang === "zh" ? "留下的那句话" : "The Sentence We Keep",
    densityLabel: lang === "zh" ? "稀疏停顿" : "Sparse Pause",
    heroScene: 5,
    colors: {
      bg: COLORS.bg,
      ink: COLORS.ink,
      panel: COLORS.panel,
    },
    typography: {
      header:
        lang === "zh"
          ? "Noto Serif SC 600"
          : "Playfair Display 600",
      body:
        lang === "zh"
          ? "Noto Serif SC 400"
          : "Libre Baskerville 400",
    },
    tags: [
      "minimal",
      "spotlight",
      "quote",
      "poster",
      "dark",
      "reflective",
      "bilingual",
      "topic",
    ],
    fonts: ["Playfair Display", "Libre Baskerville", "cjk:Noto Serif SC"],
    scenes: SCENE_IDS.map((sceneId) => ({
      id: sceneId,
      title: localized[sceneId].metadataTitle,
      beats: localized[sceneId].beats,
    })),
  };
}

export default function SentenceWeKeepV2({
  scene,
  beat,
  language,
  isThumbnail,
  reducedMotion,
  onNavigate,
}: BespokeStyleProps) {
  useFonts();

  const activeScene = isSceneId(scene) ? scene : 1;
  const activeContent = getContent(language, activeScene);
  const activeBeat = clampBeat(beat, activeContent.beats.length - 1);
  const motionDisabled = reducedMotion || isThumbnail;

  return (
    <section
      aria-label={activeContent.title}
      data-style-id="08"
      data-topic-origin="curated"
      style={rootStyle}
    >
      <StageAtmosphere
        scene={activeScene}
        beat={activeBeat}
        motionDisabled={motionDisabled}
      />
      <SpatialSceneTrack
        scene={activeScene}
        beat={activeBeat}
        transitionKind="fade"
        transitionMap={TRANSITION_MAP}
        transitionDurationMs={720}
        reducedMotion={motionDisabled}
        beatLayoutModes={BEAT_LAYOUT_MODES}
        renderScene={(sceneId, sceneBeat) => (
          <ScenePanel
            scene={sceneId}
            beat={sceneBeat}
            language={language}
            motionDisabled={motionDisabled}
          />
        )}
      />
      <FootlightTicks
        activeScene={activeScene}
        onNavigate={onNavigate}
        language={language}
        isThumbnail={isThumbnail}
      />
    </section>
  );
}

export const sentenceWeKeepTopic = defineStyleTopic({
  id: "kept-sentence",
  topic: {
    en: "Kept Sentence",
    zh: "留下句子",
  },
  model: "GPT 5.5",
  component: SentenceWeKeepV2,
  getMetadata,
});

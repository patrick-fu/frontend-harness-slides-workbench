import type React from "react";
import { useFLIP } from "../hooks/useFLIP";
import type { BespokeStyleProps, StyleMetadata } from "../types";
import SpatialSceneTrack, {
  type BeatLayoutMode,
  type SceneTransitionMap,
} from "./SpatialSceneTrack";
import { defineStyleVersion } from "./version";

type Language = "en" | "zh";

interface BeatCopy {
  id: number;
  action: string;
  title: string;
  body: string;
}

interface LogField {
  label: string;
  value: string;
}

interface NoteItem {
  time?: string;
  title: string;
  body: string;
  mark: string;
}

interface FieldSceneCopy {
  title: string;
  deckTitle: string;
  strap: string;
  page: string;
  nav: string;
  logFields: LogField[];
  notes: NoteItem[];
  callout: string;
  sketchLabel: string;
  beats: BeatCopy[];
}

const SCENE_IDS = [1, 2, 3, 4, 5];
const BEAT_LAYOUT_MODES: Partial<Record<number, BeatLayoutMode>> = {
  1: "motion",
  2: "motion",
  3: "motion",
  4: "motion",
  5: "motion",
};
const TRANSITION_MAP: SceneTransitionMap = {
  "1->2": "fade",
  "2->3": "slide-y",
  "3->4": "scale-fade",
  "4->5": "page-flip",
};

const FIELD_COPY: Record<Language, Record<number, FieldSceneCopy>> = {
  en: {
    1: {
      title: "Field cover",
      deckTitle: "Station Platform Study",
      strap: "Morning walk log. Observe the platform before it fills.",
      page: "Pg. 1",
      nav: "Cover",
      logFields: [
        { label: "Project", value: "Station Platform Study" },
        { label: "Date", value: "18 May" },
        { label: "Location", value: "Northline platform" },
        { label: "Start", value: "07:10, light wind" },
      ],
      notes: [
        {
          title: "Field edge",
          body: "Enter from the north gate and keep the first ten minutes quiet.",
          mark: "A",
        },
        {
          title: "Working rule",
          body: "Walk slow. Look up. Notice what people avoid.",
          mark: "B",
        },
      ],
      callout: "Question for the page: where does waiting become movement?",
      sketchLabel: "Northbound platform, canopy, stair edge",
      beats: [
        {
          id: 0,
          action: "Open the notebook cover",
          title: "Station Platform Study",
          body: "Set the field log and first route.",
        },
        {
          id: 1,
          action: "Add the working rule",
          title: "Walk slow",
          body: "The study starts with a quiet route and a single question.",
        },
      ],
    },
    2: {
      title: "Observations",
      deckTitle: "What I saw and noted",
      strap: "Three short observations from the first pass.",
      page: "Pg. 2",
      nav: "Obs",
      logFields: [
        { label: "Window", value: "07:12-07:27" },
        { label: "Weather", value: "Overcast, mild" },
        { label: "Crowd", value: "Light to moderate" },
        { label: "Method", value: "Stand, sketch, move" },
      ],
      notes: [
        {
          time: "07:12",
          title: "Arrivals cluster",
          body: "People gather near the middle doors. Early space, then compression.",
          mark: "1",
        },
        {
          time: "07:18",
          title: "Announcement clears the lane",
          body: "Sound shifts attention under the canopy, then the walking line resumes.",
          mark: "2",
        },
        {
          time: "07:23",
          title: "Tactile strip slows turns",
          body: "Worn surface near the stair edge makes suitcase turns hesitate.",
          mark: "3",
        },
      ],
      callout: "Note to self: repeat during evening peak for contrast.",
      sketchLabel: "Observed flow from canopy to stair",
      beats: [
        {
          id: 0,
          action: "Reveal the first observed cluster",
          title: "Arrivals cluster",
          body: "The first pattern appears around door position.",
        },
        {
          id: 1,
          action: "Add announcement behavior",
          title: "Sound resets the lane",
          body: "A clear announcement briefly changes platform movement.",
        },
        {
          id: 2,
          action: "Add surface detail",
          title: "Small surfaces slow bodies",
          body: "The tactile strip becomes a movement constraint.",
        },
      ],
    },
    3: {
      title: "Equipment",
      deckTitle: "Simple kit, light load",
      strap: "Tools that kept the walk observational, not extractive.",
      page: "Pg. 3",
      nav: "Equip",
      logFields: [
        { label: "Bag", value: "One shoulder pouch" },
        { label: "Mode", value: "No tripod" },
        { label: "Capture", value: "Sketch first" },
        { label: "Noise", value: "Low profile" },
      ],
      notes: [
        {
          title: "Field notebook",
          body: "Pocket size, grid pages, fast margins.",
          mark: "□",
        },
        {
          title: "Mechanical pencil",
          body: "Reliable line. Good for quick canopies and arrows.",
          mark: "□",
        },
        {
          title: "Phone camera",
          body: "Reference shots only. Details, not everything.",
          mark: "□",
        },
        {
          title: "Tape measure",
          body: "Column gaps and platform edge distances.",
          mark: "□",
        },
      ],
      callout: "Pack light. Move easy. Observe more.",
      sketchLabel: "Notebook, pencil, phone, small tape",
      beats: [
        {
          id: 0,
          action: "Introduce the note kit",
          title: "Notebook first",
          body: "The page records sequence before the camera records surfaces.",
        },
        {
          id: 1,
          action: "Add capture tools",
          title: "Pencil and camera",
          body: "The kit supports quick sketches and reference shots.",
        },
        {
          id: 2,
          action: "Add measuring tool",
          title: "Measure only when useful",
          body: "Distances matter where bodies hesitate.",
        },
      ],
    },
    4: {
      title: "Patterns",
      deckTitle: "Recurring rhythms",
      strap: "Turn scattered notes into repeatable platform patterns.",
      page: "Pg. 4",
      nav: "Patterns",
      logFields: [
        { label: "Primary", value: "Arrival waves" },
        { label: "Secondary", value: "Pause zones" },
        { label: "Detail", value: "Edges and shadows" },
        { label: "Check", value: "Repeat window" },
      ],
      notes: [
        {
          title: "Arrival rhythm",
          body: "Small waves arrive every few minutes; crowding peaks around the middle doors.",
          mark: "I",
        },
        {
          title: "Movement flow",
          body: "Main flow stays straight, while late riders cut diagonally toward the stairs.",
          mark: "II",
        },
        {
          title: "Details that recur",
          body: "Column wear, sticker residue, drain grates, and morning light explain where eyes land.",
          mark: "III",
        },
      ],
      callout: "Pattern is not a metric yet. It is a repeatable note.",
      sketchLabel: "Flow arrows, arrival bars, recurring details",
      beats: [
        {
          id: 0,
          action: "Show arrival rhythm",
          title: "Waves, not a constant stream",
          body: "The platform breathes in short intervals.",
        },
        {
          id: 1,
          action: "Add movement flow",
          title: "Two paths overlap",
          body: "One line waits; another cuts diagonally to the stair.",
        },
        {
          id: 2,
          action: "Add recurring details",
          title: "Small marks explain behavior",
          body: "Surfaces, signs, and light turn notes into a pattern.",
        },
      ],
    },
    5: {
      title: "Next walk",
      deckTitle: "What to check next",
      strap: "The next pass tests the morning notes against a busier platform.",
      page: "Pg. 5",
      nav: "Next",
      logFields: [
        { label: "Next window", value: "17:00-19:00" },
        { label: "Compare", value: "Platform 1 and 2" },
        { label: "Watch", value: "Signage distance" },
        { label: "Carry", value: "Same light kit" },
      ],
      notes: [
        {
          title: "Evening peak observation",
          body: "Repeat the route when waiting space is under pressure.",
          mark: "□",
        },
        {
          title: "Compare platform sides",
          body: "Check whether stairs, signs, and canopy gaps create the same pauses.",
          mark: "□",
        },
        {
          title: "Measure hesitation points",
          body: "Record column spacing, sign distance, and turn angles.",
          mark: "□",
        },
      ],
      callout: "Next question: where do people hesitate, and why?",
      sketchLabel: "Folded page corner, next route, evening check",
      beats: [
        {
          id: 0,
          action: "List the next checks",
          title: "Return at peak",
          body: "Use the same route when pressure is higher.",
        },
        {
          id: 1,
          action: "Close with the next question",
          title: "Hesitation is the next signal",
          body: "The next walk looks for where flow pauses and why.",
        },
      ],
    },
  },
  zh: {
    1: {
      title: "现场封面",
      deckTitle: "站台平台观察",
      strap: "早晨步行记录。趁站台还没有满，先观察它的形状。",
      page: "第 1 页",
      nav: "封面",
      logFields: [
        { label: "项目", value: "站台平台观察" },
        { label: "日期", value: "5 月 18 日" },
        { label: "地点", value: "北线站台" },
        { label: "开始", value: "07:10，微风" },
      ],
      notes: [
        {
          title: "现场边界",
          body: "从北侧入口进入，前十分钟只看，不急着判断。",
          mark: "A",
        },
        {
          title: "工作规则",
          body: "慢慢走。抬头看。记录人们绕开的地方。",
          mark: "B",
        },
      ],
      callout: "这一页的问题：等待从哪里变成移动？",
      sketchLabel: "北向站台、雨棚、楼梯边缘",
      beats: [
        {
          id: 0,
          action: "打开现场记录封面",
          title: "站台平台观察",
          body: "建立现场日志和第一条路线。",
        },
        {
          id: 1,
          action: "加入工作规则",
          title: "慢慢走",
          body: "这次观察从一条安静路线和一个问题开始。",
        },
      ],
    },
    2: {
      title: "观察记录",
      deckTitle: "我看到并记下的事",
      strap: "第一轮步行留下三条短记录。",
      page: "第 2 页",
      nav: "观察",
      logFields: [
        { label: "时段", value: "07:12-07:27" },
        { label: "天气", value: "阴，温和" },
        { label: "人流", value: "偏少到中等" },
        { label: "方法", value: "站定、速写、移动" },
      ],
      notes: [
        {
          time: "07:12",
          title: "到站人群聚集",
          body: "多数人靠近中段车门。先是空，再迅速压缩。",
          mark: "1",
        },
        {
          time: "07:18",
          title: "广播清出通道",
          body: "雨棚下的注意力被声音带走，随后步行线恢复。",
          mark: "2",
        },
        {
          time: "07:23",
          title: "触觉带让转弯变慢",
          body: "楼梯边缘的磨损地面，让拖箱转弯明显犹豫。",
          mark: "3",
        },
      ],
      callout: "给自己的备注：晚高峰再看一次，做对照。",
      sketchLabel: "从雨棚到楼梯的可见流线",
      beats: [
        {
          id: 0,
          action: "出现第一条聚集记录",
          title: "到站聚集",
          body: "第一个模式出现在车门位置附近。",
        },
        {
          id: 1,
          action: "加入广播后的行为变化",
          title: "声音重置通道",
          body: "清晰广播会短暂改变站台移动。",
        },
        {
          id: 2,
          action: "加入地面细节",
          title: "小表面会减慢身体",
          body: "触觉带变成了移动约束。",
        },
      ],
    },
    3: {
      title: "设备",
      deckTitle: "简单装备，轻量携带",
      strap: "这些工具让观察保持低打扰，而不是变成采集工程。",
      page: "第 3 页",
      nav: "设备",
      logFields: [
        { label: "包", value: "一个单肩小包" },
        { label: "方式", value: "不用三脚架" },
        { label: "记录", value: "先画草图" },
        { label: "存在感", value: "尽量低" },
      ],
      notes: [
        {
          title: "现场笔记本",
          body: "口袋大小，网格纸，边栏写得快。",
          mark: "□",
        },
        {
          title: "自动铅笔",
          body: "线条稳定，适合快速画雨棚和箭头。",
          mark: "□",
        },
        {
          title: "手机相机",
          body: "只拍参考。拍细节，不拍一切。",
          mark: "□",
        },
        {
          title: "卷尺",
          body: "测柱距和站台边缘距离。",
          mark: "□",
        },
      ],
      callout: "轻装。好移动。多观察。",
      sketchLabel: "笔记本、铅笔、手机、小卷尺",
      beats: [
        {
          id: 0,
          action: "引入记录装备",
          title: "笔记本优先",
          body: "页面先记录顺序，相机再记录表面。",
        },
        {
          id: 1,
          action: "加入捕捉工具",
          title: "铅笔和相机",
          body: "装备支持快速速写和参考照片。",
        },
        {
          id: 2,
          action: "加入测量工具",
          title: "只在有用时测量",
          body: "身体犹豫的地方，距离才重要。",
        },
      ],
    },
    4: {
      title: "模式",
      deckTitle: "反复出现的节奏",
      strap: "把零散记录整理成可复看的站台模式。",
      page: "第 4 页",
      nav: "模式",
      logFields: [
        { label: "主要", value: "到站波峰" },
        { label: "次要", value: "停顿区" },
        { label: "细节", value: "边缘和光影" },
        { label: "检查", value: "重复时段" },
      ],
      notes: [
        {
          title: "到站节奏",
          body: "人群每隔几分钟形成小波峰，中段车门附近最容易拥挤。",
          mark: "I",
        },
        {
          title: "移动流线",
          body: "主流线保持直行，赶时间的人斜切到楼梯。",
          mark: "II",
        },
        {
          title: "重复出现的细节",
          body: "柱脚磨损、贴纸残留、排水格栅和早晨光线，解释视线落点。",
          mark: "III",
        },
      ],
      callout: "模式还不是指标。它是可以重复验证的记录。",
      sketchLabel: "流线箭头、到站条、重复细节",
      beats: [
        {
          id: 0,
          action: "展示到站节奏",
          title: "是波峰，不是恒定水流",
          body: "站台以短间隔呼吸。",
        },
        {
          id: 1,
          action: "加入移动流线",
          title: "两条路径重叠",
          body: "一条线等待，另一条线斜切去楼梯。",
        },
        {
          id: 2,
          action: "加入重复细节",
          title: "小痕迹解释行为",
          body: "表面、标识和光线把记录变成模式。",
        },
      ],
    },
    5: {
      title: "下一次步行",
      deckTitle: "下一轮要检查什么",
      strap: "下一次用更忙的站台，验证早晨记录。",
      page: "第 5 页",
      nav: "下一步",
      logFields: [
        { label: "下次时段", value: "17:00-19:00" },
        { label: "对照", value: "1 与 2 站台" },
        { label: "观察", value: "标识可见距离" },
        { label: "携带", value: "同一套轻装备" },
      ],
      notes: [
        {
          title: "晚高峰观察",
          body: "等待空间受压时，重复同一路线。",
          mark: "□",
        },
        {
          title: "对照两侧站台",
          body: "检查楼梯、标识和雨棚缺口是否制造相同停顿。",
          mark: "□",
        },
        {
          title: "测量犹豫点",
          body: "记录柱距、标识距离和转弯角度。",
          mark: "□",
        },
      ],
      callout: "下一个问题：人们在哪里犹豫，为什么？",
      sketchLabel: "折起的页角、下一条路线、晚间检查",
      beats: [
        {
          id: 0,
          action: "列出下一轮检查",
          title: "晚高峰返回",
          body: "压力更高时走同一条路线。",
        },
        {
          id: 1,
          action: "以问题收束",
          title: "犹豫是下一个信号",
          body: "下一次步行寻找流线暂停的位置和原因。",
        },
      ],
    },
  },
};

function clampScene(scene: number): number {
  return SCENE_IDS.includes(scene) ? scene : 1;
}

function clampBeat(scene: number, beat: number, language: Language): number {
  const sceneCopy = FIELD_COPY[language][clampScene(scene)];
  return Math.max(0, Math.min(beat, sceneCopy.beats.length - 1));
}

function getSceneCopy(language: Language, scene: number): FieldSceneCopy {
  return FIELD_COPY[language][clampScene(scene)];
}

function getMetadata(language: Language): StyleMetadata {
  const scenes = SCENE_IDS.map((id) => {
    const copy = FIELD_COPY[language][id];
    return {
      id,
      title: copy.title,
      beats: copy.beats.map((beat, index) => ({
        id: index,
        action: beat.action,
        title: beat.title,
        body: beat.body,
      })),
    };
  });

  return {
    id: "44",
    band: "text-report",
    name: language === "zh" ? "现场笔记报告" : "Field Notes Report",
    theme: language === "zh" ? "站台平台观察" : "Station Platform Study",
    densityLabel: language === "zh" ? "阅读型现场记录" : "Reading-first field log",
    heroScene: 1,
    colors: {
      bg: "#f1dfb9",
      ink: "#2f2a20",
      panel: "#f8edcf",
    },
    typography: {
      header: "Noteworthy / Kaiti SC",
      body: "Avenir Next / PingFang SC",
    },
    tags: [
      "field-notes",
      "notebook",
      "observational",
      "tactile",
      "text-report",
      "warm-paper",
      "motion",
    ],
    fonts: ["Noteworthy", "Avenir Next", "cjk:Kaiti SC", "cjk:PingFang SC"],
    scenes,
  };
}

function StationPlatformStudyV2({
  scene,
  beat,
  language,
  isThumbnail,
  reducedMotion,
  onNavigate,
}: BespokeStyleProps) {
  const safeScene = clampScene(scene);
  const safeBeat = clampBeat(safeScene, beat, language);
  const motionOff = reducedMotion || isThumbnail;

  return (
    <div
      data-station-v2-root="true"
      data-motion={motionOff ? "off" : "on"}
      style={styles.root}
    >
      <style>{MOTION_CSS}</style>
      <div style={styles.paperGrain} />
      <div style={styles.trackFrame}>
        <SpatialSceneTrack
          scene={safeScene}
          beat={safeBeat}
          sceneIds={SCENE_IDS}
          transitionKind="fade"
          transitionMap={TRANSITION_MAP}
          transitionDurationMs={720}
          reducedMotion={motionOff}
          beatLayoutModes={BEAT_LAYOUT_MODES}
          renderScene={(sceneId, sceneBeat, isActive) => (
            <FieldScene
              scene={sceneId}
              beat={sceneBeat}
              language={language}
              isActive={isActive}
              motionOff={motionOff}
            />
          )}
        />
      </div>
      <EdgeFlags
        scene={safeScene}
        language={language}
        isThumbnail={isThumbnail}
        onNavigate={onNavigate}
      />
    </div>
  );
}

interface FieldSceneProps {
  scene: number;
  beat: number;
  language: Language;
  isActive: boolean;
  motionOff: boolean;
}

function FieldScene({
  scene,
  beat,
  language,
  isActive,
  motionOff,
}: FieldSceneProps) {
  const copy = getSceneCopy(language, scene);
  const safeBeat = clampBeat(scene, beat, language);
  const flip = useFLIP<HTMLElement>({
    watch: [scene, safeBeat, language],
    disabled: motionOff || !isActive,
    duration: 520,
    easing: "cubic-bezier(0.2, 0.8, 0.24, 1)",
    selector: '[data-beat-layout-item="true"]',
  });

  return (
    <section
      ref={flip.ref}
      data-scene={scene}
      data-beat={safeBeat}
      data-beat-layout-container="true"
      data-beat-layout-mode="motion"
      style={styles.scene}
    >
      <FieldLogHeader copy={copy} />
      <div style={styles.bookSpread} data-beat-layout-item="true">
        <div style={styles.leftPage}>
          <PageTitle copy={copy} scene={scene} />
          {scene === 1 ? (
            <CoverSketch copy={copy} beat={safeBeat} motionOff={motionOff} />
          ) : scene === 4 ? (
            <PatternSketch copy={copy} beat={safeBeat} motionOff={motionOff} />
          ) : scene === 5 ? (
            <NextWalkSketch copy={copy} beat={safeBeat} motionOff={motionOff} />
          ) : (
            <PlatformSketch
              copy={copy}
              scene={scene}
              beat={safeBeat}
              motionOff={motionOff}
            />
          )}
        </div>
        <div style={styles.rightPage}>
          <ObservationList copy={copy} beat={safeBeat} motionOff={motionOff} />
          <MarginCallout copy={copy} beat={safeBeat} motionOff={motionOff} />
        </div>
      </div>
    </section>
  );
}

function FieldLogHeader({ copy }: { copy: FieldSceneCopy }) {
  return (
    <header style={styles.logHeader} data-beat-layout-item="true">
      <div style={styles.reportTitle}>FIELD NOTES REPORT</div>
      {copy.logFields.map((field) => (
        <div key={field.label} style={styles.logField}>
          <div style={styles.logLabel}>{field.label}</div>
          <div style={styles.logValue}>{field.value}</div>
        </div>
      ))}
    </header>
  );
}

function PageTitle({
  copy,
  scene,
}: {
  copy: FieldSceneCopy;
  scene: number;
}) {
  return (
    <div style={styles.pageTitleBlock} data-beat-layout-item="true">
      <div style={styles.sceneBadge}>{scene}</div>
      <div>
        <div style={styles.pageEyebrow}>{copy.title}</div>
        <h1 style={styles.deckTitle}>{copy.deckTitle}</h1>
        <p style={styles.strap}>{copy.strap}</p>
      </div>
      <div style={styles.pageNumber}>{copy.page}</div>
    </div>
  );
}

function ObservationList({
  copy,
  beat,
  motionOff,
}: {
  copy: FieldSceneCopy;
  beat: number;
  motionOff: boolean;
}) {
  const visibleNotes = copy.notes.slice(0, Math.min(copy.notes.length, beat + 1));

  return (
    <div style={styles.noteList} data-beat-layout-item="true">
      {visibleNotes.map((note, index) => (
        <article
          key={`${note.title}-${index}`}
          data-beat-layout-item="true"
          style={{
            ...styles.noteCard,
            animation: motionOff
              ? "none"
              : `station44-note-in 520ms cubic-bezier(0.2, 0.8, 0.24, 1) ${index * 70}ms both`,
          }}
        >
          <div style={styles.noteMark}>{note.mark}</div>
          <div style={styles.noteBody}>
            <div style={styles.noteLine}>
              {note.time ? <span style={styles.noteTime}>{note.time}</span> : null}
              <strong style={styles.noteTitle}>{note.title}</strong>
            </div>
            <p style={styles.noteText}>{note.body}</p>
          </div>
        </article>
      ))}
    </div>
  );
}

function MarginCallout({
  copy,
  beat,
  motionOff,
}: {
  copy: FieldSceneCopy;
  beat: number;
  motionOff: boolean;
}) {
  return (
    <aside
      data-beat-layout-item="true"
      style={{
        ...styles.marginCallout,
        opacity: beat > 0 ? 1 : 0,
        transform: beat > 0 ? "translateY(0) rotate(-0.6deg)" : "translateY(2cqh)",
        transition: motionOff
          ? "none"
          : "opacity 420ms ease, transform 520ms cubic-bezier(0.2, 0.8, 0.24, 1)",
      }}
    >
      {copy.callout}
    </aside>
  );
}

function CoverSketch({
  copy,
  beat,
  motionOff,
}: {
  copy: FieldSceneCopy;
  beat: number;
  motionOff: boolean;
}) {
  return (
    <div style={styles.coverArea} data-beat-layout-item="true">
      <div style={styles.coverStamp}>NORTHLINE / 18 MAY</div>
      <svg
        aria-label={copy.sketchLabel}
        viewBox="0 0 100 58"
        style={styles.coverSketch}
      >
        <path d="M5 43 L92 43" stroke="currentColor" strokeWidth="0.4%" />
        <path d="M8 38 L94 33" stroke="currentColor" strokeWidth="0.28%" />
        <path d="M10 48 L95 52" stroke="currentColor" strokeWidth="0.28%" />
        <path d="M17 18 L81 14 L92 25 L29 29 Z" fill="none" stroke="currentColor" strokeWidth="0.45%" />
        <path d="M25 19 L25 44 M41 17 L41 45 M62 16 L62 44 M78 16 L78 43" stroke="currentColor" strokeWidth="0.3%" />
        <path d="M2 54 C24 48 48 46 74 50" stroke="#ad5a35" strokeWidth="0.35%" fill="none" strokeDasharray="2 2" />
        <circle cx="55" cy="43" r="1.3" fill="#ad5a35" />
        <circle cx="63" cy="43" r="1.3" fill="#ad5a35" />
        <circle cx="70" cy="43" r="1.3" fill="#ad5a35" />
      </svg>
      <p
        style={{
          ...styles.sketchCaption,
          opacity: beat > 0 ? 1 : 0,
          animation: motionOff || beat === 0 ? "none" : "station44-pencil 560ms ease both",
        }}
      >
        {copy.sketchLabel}
      </p>
    </div>
  );
}

function PlatformSketch({
  copy,
  scene,
  beat,
  motionOff,
}: {
  copy: FieldSceneCopy;
  scene: number;
  beat: number;
  motionOff: boolean;
}) {
  const showSecond = beat > 0;
  const showThird = beat > 1;

  return (
    <div style={styles.sketchPanel} data-beat-layout-item="true">
      <svg
        aria-label={copy.sketchLabel}
        viewBox="0 0 100 72"
        style={styles.fieldSketch}
      >
        <path d="M7 56 H93" stroke="currentColor" strokeWidth="0.36%" />
        <path d="M10 47 L91 39" stroke="currentColor" strokeWidth="0.28%" />
        <path d="M13 62 L92 68" stroke="currentColor" strokeWidth="0.24%" />
        <path d="M12 24 C32 16 61 13 88 17" stroke="currentColor" strokeWidth="0.34%" fill="none" />
        <path d="M17 25 V56 M34 21 V56 M55 18 V56 M78 17 V55" stroke="currentColor" strokeWidth="0.24%" />
        <path
          d={scene === 3 ? "M22 34 H76" : "M20 38 C38 31 53 43 75 35"}
          stroke="#ad5a35"
          strokeWidth="0.7%"
          strokeDasharray={scene === 3 ? "2 3" : "4 3"}
          fill="none"
          opacity={showSecond ? 1 : 0.25}
        />
        <path
          d="M62 26 C70 30 76 36 82 43"
          stroke="#ad5a35"
          strokeWidth="0.55%"
          fill="none"
          opacity={showThird ? 1 : 0}
        />
        <g opacity={showSecond ? 1 : 0.35}>
          <circle cx="36" cy="48" r="1.4" fill="currentColor" />
          <circle cx="45" cy="46" r="1.4" fill="currentColor" />
          <circle cx="54" cy="49" r="1.4" fill="currentColor" />
          <circle cx="68" cy="44" r="1.4" fill="currentColor" />
        </g>
        <g opacity={showThird ? 1 : 0}>
          <path d="M71 31 L83 31 L83 43 L71 43 Z" fill="none" stroke="currentColor" strokeWidth="0.28%" />
          <path d="M73 34 H81 M73 38 H79" stroke="currentColor" strokeWidth="0.24%" />
        </g>
      </svg>
      <p
        style={{
          ...styles.sketchCaption,
          animation: motionOff ? "none" : "station44-pencil 560ms ease both",
        }}
      >
        {copy.sketchLabel}
      </p>
    </div>
  );
}

function PatternSketch({
  copy,
  beat,
  motionOff,
}: {
  copy: FieldSceneCopy;
  beat: number;
  motionOff: boolean;
}) {
  return (
    <div style={styles.patternPanel} data-beat-layout-item="true">
      <svg aria-label={copy.sketchLabel} viewBox="0 0 100 78" style={styles.fieldSketch}>
        <path d="M8 25 H92" stroke="currentColor" strokeWidth="0.3%" />
        {[16, 28, 40, 52, 64, 76].map((x, index) => (
          <g key={x}>
            <path d={`M${x} 25 V16`} stroke="currentColor" strokeWidth="0.18%" />
            <rect
              x={x - 2}
              y={22 - ((index % 3) + 2) * 2}
              width="4"
              height={((index % 3) + 2) * 2}
              fill="#c47446"
              opacity={beat >= 0 ? 0.72 : 0.2}
            />
          </g>
        ))}
        <path
          d="M13 50 C30 42 44 56 59 47 C70 40 80 40 89 45"
          fill="none"
          stroke="#ad5a35"
          strokeWidth="0.7%"
          strokeDasharray="5 3"
          opacity={beat > 0 ? 1 : 0.18}
        />
        <path
          d="M14 64 H86 M18 58 L26 64 L18 70 M80 58 L88 64 L80 70"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.3%"
          opacity={beat > 0 ? 1 : 0.24}
        />
        <g opacity={beat > 1 ? 1 : 0}>
          <rect x="12" y="34" width="16" height="12" fill="none" stroke="currentColor" strokeWidth="0.25%" />
          <rect x="42" y="34" width="16" height="12" fill="none" stroke="currentColor" strokeWidth="0.25%" />
          <rect x="72" y="34" width="16" height="12" fill="none" stroke="currentColor" strokeWidth="0.25%" />
          <path d="M15 42 L25 36 M45 37 L55 43 M75 41 L85 37" stroke="#ad5a35" strokeWidth="0.28%" />
        </g>
      </svg>
      <p
        style={{
          ...styles.sketchCaption,
          animation: motionOff ? "none" : "station44-pencil 560ms ease both",
        }}
      >
        {copy.sketchLabel}
      </p>
    </div>
  );
}

function NextWalkSketch({
  copy,
  beat,
  motionOff,
}: {
  copy: FieldSceneCopy;
  beat: number;
  motionOff: boolean;
}) {
  return (
    <div style={styles.nextPanel} data-beat-layout-item="true">
      <svg aria-label={copy.sketchLabel} viewBox="0 0 100 76" style={styles.fieldSketch}>
        <path d="M14 20 H78 V59 H14 Z" fill="#f8edcf" stroke="currentColor" strokeWidth="0.35%" />
        <path d="M78 20 C84 27 88 35 88 48 C83 44 79 41 74 39 C77 33 79 27 78 20 Z" fill="#ead6aa" stroke="currentColor" strokeWidth="0.3%" />
        <path d="M25 35 C42 28 58 43 75 35" stroke="#ad5a35" strokeWidth="0.65%" fill="none" strokeDasharray="4 3" />
        <path d="M26 47 H63 M26 53 H58" stroke="currentColor" strokeWidth="0.24%" />
        <circle cx="25" cy="35" r="1.6" fill="#ad5a35" />
        <circle cx="75" cy="35" r="1.6" fill="#ad5a35" />
        <path
          d="M66 58 C76 62 84 58 89 50"
          stroke="#ad5a35"
          strokeWidth="0.45%"
          fill="none"
          strokeDasharray="2 2"
          opacity={beat > 0 ? 1 : 0.2}
        />
      </svg>
      <p
        style={{
          ...styles.sketchCaption,
          opacity: beat > 0 ? 1 : 0.45,
          animation: motionOff || beat === 0 ? "none" : "station44-pencil 560ms ease both",
        }}
      >
        {copy.sketchLabel}
      </p>
    </div>
  );
}

function EdgeFlags({
  scene,
  language,
  isThumbnail,
  onNavigate,
}: {
  scene: number;
  language: Language;
  isThumbnail: boolean;
  onNavigate?: (scene: number, beat: number) => void;
}) {
  if (isThumbnail) {
    return null;
  }

  return (
    <nav aria-label="Notebook scene flags" style={styles.edgeFlags}>
      {SCENE_IDS.map((id, index) => {
        const copy = getSceneCopy(language, id);
        const active = scene === id;
        return (
          <button
            key={id}
            type="button"
            aria-current={active ? "step" : undefined}
            aria-label={copy.title}
            onPointerDown={(event) => event.stopPropagation()}
            onClick={(event) => {
              event.stopPropagation();
              onNavigate?.(id, 0);
            }}
            style={{
              ...styles.edgeFlag,
              top: `${17 + index * 13}cqh`,
              background: active ? "#b85f3b" : "#d9bd82",
              color: active ? "#fff8e8" : "#3a2b20",
              transform: active ? "translateX(0) rotate(-0.8deg)" : "translateX(1.1cqw)",
            }}
          >
            <span style={styles.flagNumber}>{id}</span>
            <span style={styles.flagLabel}>{copy.nav}</span>
          </button>
        );
      })}
    </nav>
  );
}

const MOTION_CSS = `
@keyframes station44-note-in {
  from { opacity: 0; transform: translateY(1.8cqh) rotate(-0.4deg); }
  to { opacity: 1; transform: translateY(0) rotate(0); }
}
@keyframes station44-pencil {
  from { opacity: 0; clip-path: inset(0 100% 0 0); }
  to { opacity: 1; clip-path: inset(0 0 0 0); }
}
[data-station-v2-root][data-motion="off"] * {
  animation-duration: 0s !important;
  transition-duration: 0s !important;
}
`;

const paperBackground =
  "radial-gradient(circle at 12% 18%, rgba(95, 68, 37, 0.12) 0 0.08cqw, transparent 0.12cqw), radial-gradient(circle at 78% 22%, rgba(95, 68, 37, 0.1) 0 0.06cqw, transparent 0.1cqw), repeating-linear-gradient(0deg, rgba(93, 65, 38, 0.055) 0 0.08cqh, transparent 0.08cqh 4.1cqh), linear-gradient(115deg, #f5e7c6 0%, #ead6aa 54%, #f8edcf 100%)";

const styles: Record<string, React.CSSProperties> = {
  root: {
    containerType: "size",
    position: "relative",
    width: "100%",
    height: "100%",
    overflow: "hidden",
    color: "#30281d",
    background: paperBackground,
    fontFamily:
      '"Avenir Next", "Trebuchet MS", "PingFang SC", "Hiragino Sans GB", sans-serif',
  },
  paperGrain: {
    position: "absolute",
    inset: "0",
    pointerEvents: "none",
    opacity: 0.55,
    mixBlendMode: "multiply",
    background:
      "radial-gradient(circle at 20% 70%, rgba(65, 43, 25, 0.16) 0 0.06cqw, transparent 0.12cqw), radial-gradient(circle at 56% 38%, rgba(65, 43, 25, 0.12) 0 0.05cqw, transparent 0.1cqw), radial-gradient(circle at 88% 76%, rgba(65, 43, 25, 0.1) 0 0.08cqw, transparent 0.14cqw)",
  },
  trackFrame: {
    position: "absolute",
    inset: "0",
  },
  scene: {
    position: "relative",
    width: "100%",
    height: "100%",
    padding: "4.8cqh 5.2cqw 5.2cqh 5.2cqw",
    boxSizing: "border-box",
  },
  logHeader: {
    display: "grid",
    gridTemplateColumns: "31% 17% 17% 17% 18%",
    alignItems: "stretch",
    minHeight: "10cqh",
    border: "0.12cqw solid rgba(61, 43, 28, 0.65)",
    background: "rgba(248, 237, 207, 0.72)",
    boxShadow: "0 0.45cqh 1.2cqw rgba(61, 43, 28, 0.12)",
  },
  reportTitle: {
    display: "flex",
    alignItems: "center",
    padding: "1.2cqh 1.5cqw",
    borderRight: "0.1cqw solid rgba(61, 43, 28, 0.45)",
    color: "#2b251c",
    fontFamily: '"Noteworthy", "Kaiti SC", "STKaiti", cursive',
    fontSize: "2.9cqw",
    lineHeight: 0.9,
    textTransform: "uppercase",
  },
  logField: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    gap: "0.7cqh",
    padding: "1.1cqh 1.1cqw",
    borderRight: "0.1cqw solid rgba(61, 43, 28, 0.28)",
  },
  logLabel: {
    color: "rgba(48, 40, 29, 0.7)",
    fontSize: "0.78cqw",
    lineHeight: 1,
    textTransform: "uppercase",
  },
  logValue: {
    color: "#ad5a35",
    fontFamily: '"Noteworthy", "Kaiti SC", "STKaiti", cursive',
    fontSize: "1.45cqw",
    lineHeight: 1.05,
  },
  bookSpread: {
    position: "relative",
    display: "grid",
    gridTemplateColumns: "46% 54%",
    gap: "2.2cqw",
    height: "78.4cqh",
    marginTop: "2.2cqh",
  },
  leftPage: {
    position: "relative",
    display: "grid",
    gridTemplateRows: "22cqh 1fr",
    overflow: "hidden",
    border: "0.16cqw solid rgba(43, 34, 24, 0.72)",
    borderRadius: "0.65cqw",
    background:
      "linear-gradient(90deg, rgba(74, 53, 34, 0.12), transparent 5%, transparent 94%, rgba(74, 53, 34, 0.1)), #f8edcf",
    boxShadow: "0 1cqh 1.8cqw rgba(43, 34, 24, 0.22)",
  },
  rightPage: {
    position: "relative",
    display: "grid",
    gridTemplateRows: "1fr auto",
    gap: "2cqh",
    overflow: "hidden",
    border: "0.16cqw solid rgba(43, 34, 24, 0.72)",
    borderRadius: "0.65cqw",
    background:
      "linear-gradient(90deg, rgba(74, 53, 34, 0.12), transparent 6%, transparent 95%, rgba(74, 53, 34, 0.12)), #f9efcf",
    boxShadow: "0 1cqh 1.8cqw rgba(43, 34, 24, 0.18)",
    padding: "3.4cqh 3.2cqw",
    boxSizing: "border-box",
  },
  pageTitleBlock: {
    display: "grid",
    gridTemplateColumns: "5.2cqw 1fr auto",
    gap: "1.4cqw",
    alignItems: "start",
    padding: "3cqh 3cqw 1.8cqh 3cqw",
    borderBottom: "0.12cqw solid rgba(48, 40, 29, 0.28)",
  },
  sceneBadge: {
    display: "grid",
    placeItems: "center",
    width: "3.4cqw",
    height: "3.4cqw",
    border: "0.18cqw solid #ad5a35",
    borderRadius: "50%",
    color: "#ad5a35",
    fontFamily: '"Noteworthy", "Kaiti SC", "STKaiti", cursive',
    fontSize: "1.8cqw",
    lineHeight: 1,
    transform: "rotate(-4deg)",
  },
  pageEyebrow: {
    color: "rgba(48, 40, 29, 0.72)",
    fontSize: "1cqw",
    lineHeight: 1.1,
    textTransform: "uppercase",
  },
  deckTitle: {
    margin: "0.5cqh 0 0 0",
    color: "#2d271d",
    fontFamily: '"Noteworthy", "Kaiti SC", "STKaiti", cursive',
    fontSize: "4.1cqw",
    lineHeight: 0.95,
    fontWeight: 700,
  },
  strap: {
    margin: "1cqh 0 0 0",
    maxWidth: "31cqw",
    color: "rgba(48, 40, 29, 0.72)",
    fontSize: "1.15cqw",
    lineHeight: 1.25,
  },
  pageNumber: {
    color: "rgba(48, 40, 29, 0.66)",
    fontFamily: '"Noteworthy", "Kaiti SC", "STKaiti", cursive',
    fontSize: "1.2cqw",
    lineHeight: 1,
  },
  coverArea: {
    display: "grid",
    gridTemplateRows: "auto 1fr auto",
    alignItems: "center",
    gap: "2.4cqh",
    padding: "3.2cqh 4cqw 3.6cqh 4cqw",
  },
  coverStamp: {
    justifySelf: "start",
    border: "0.12cqw solid #ad5a35",
    borderRadius: "50%",
    padding: "1.8cqh 1.2cqw",
    color: "#ad5a35",
    fontFamily: '"Noteworthy", "Kaiti SC", "STKaiti", cursive',
    fontSize: "1.05cqw",
    lineHeight: 1.1,
    textAlign: "center",
    transform: "rotate(-8deg)",
  },
  coverSketch: {
    width: "100%",
    height: "34cqh",
    color: "#4b4030",
  },
  sketchPanel: {
    display: "grid",
    gridTemplateRows: "1fr auto",
    gap: "1cqh",
    padding: "2cqh 3.6cqw 3cqh 3.6cqw",
  },
  patternPanel: {
    display: "grid",
    gridTemplateRows: "1fr auto",
    gap: "1cqh",
    padding: "2cqh 3.6cqw 3cqh 3.6cqw",
  },
  nextPanel: {
    display: "grid",
    gridTemplateRows: "1fr auto",
    gap: "1cqh",
    padding: "2cqh 3.6cqw 3cqh 3.6cqw",
  },
  fieldSketch: {
    width: "100%",
    height: "39cqh",
    color: "#4b4030",
  },
  sketchCaption: {
    margin: "0",
    color: "#ad5a35",
    fontFamily: '"Noteworthy", "Kaiti SC", "STKaiti", cursive',
    fontSize: "1.35cqw",
    lineHeight: 1.15,
  },
  noteList: {
    display: "grid",
    gridTemplateColumns: "1fr",
    alignContent: "start",
    gap: "1.7cqh",
  },
  noteCard: {
    display: "grid",
    gridTemplateColumns: "3.1cqw 1fr",
    gap: "1.1cqw",
    padding: "1.4cqh 1.2cqw",
    borderBottom: "0.1cqw solid rgba(48, 40, 29, 0.2)",
  },
  noteMark: {
    display: "grid",
    placeItems: "center",
    width: "2.1cqw",
    height: "2.1cqw",
    border: "0.12cqw solid #ad5a35",
    borderRadius: "50%",
    color: "#ad5a35",
    fontFamily: '"Noteworthy", "Kaiti SC", "STKaiti", cursive',
    fontSize: "1.05cqw",
    lineHeight: 1,
  },
  noteBody: {
    minWidth: "0",
  },
  noteLine: {
    display: "flex",
    alignItems: "baseline",
    gap: "1cqw",
    color: "#30281d",
  },
  noteTime: {
    color: "#ad5a35",
    fontFamily: '"Noteworthy", "Kaiti SC", "STKaiti", cursive',
    fontSize: "1.25cqw",
    lineHeight: 1.1,
    whiteSpace: "nowrap",
  },
  noteTitle: {
    fontSize: "1.5cqw",
    lineHeight: 1.12,
    fontWeight: 700,
  },
  noteText: {
    margin: "0.8cqh 0 0 0",
    color: "rgba(48, 40, 29, 0.78)",
    fontSize: "1.18cqw",
    lineHeight: 1.32,
  },
  marginCallout: {
    justifySelf: "stretch",
    padding: "1.5cqh 1.5cqw",
    border: "0.12cqw dashed #ad5a35",
    background: "rgba(232, 204, 148, 0.42)",
    color: "#8b432a",
    fontFamily: '"Noteworthy", "Kaiti SC", "STKaiti", cursive',
    fontSize: "1.45cqw",
    lineHeight: 1.18,
    boxShadow: "0 0.45cqh 0.8cqw rgba(58, 43, 28, 0.1)",
  },
  edgeFlags: {
    position: "absolute",
    top: "0",
    right: "0",
    width: "9cqw",
    height: "100%",
    pointerEvents: "none",
  },
  edgeFlag: {
    position: "absolute",
    right: "0.6cqw",
    display: "grid",
    gridTemplateColumns: "1.6cqw 1fr",
    alignItems: "center",
    gap: "0.35cqw",
    width: "7.2cqw",
    height: "7.2cqh",
    padding: "0 0.8cqw",
    border: "0.1cqw solid rgba(62, 43, 27, 0.45)",
    borderTopLeftRadius: "0.5cqw",
    borderBottomLeftRadius: "0.5cqw",
    boxShadow: "0 0.45cqh 0.8cqw rgba(56, 38, 22, 0.18)",
    pointerEvents: "auto",
    cursor: "pointer",
    fontFamily: '"Avenir Next", "PingFang SC", sans-serif',
    transition:
      "background 260ms ease, color 260ms ease, transform 360ms cubic-bezier(0.2, 0.8, 0.24, 1)",
  },
  flagNumber: {
    fontFamily: '"Noteworthy", "Kaiti SC", "STKaiti", cursive',
    fontSize: "1.3cqw",
    lineHeight: 1,
  },
  flagLabel: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    fontSize: "0.88cqw",
    lineHeight: 1,
    textTransform: "uppercase",
  },
};

export { getMetadata };
export default StationPlatformStudyV2;

export const stationPlatformStudyV2Version = defineStyleVersion({
  id: "v2",
  topic: {
    en: "Platform Study",
    zh: "站台研究",
  },
  model: "GPT-5.5",
  component: StationPlatformStudyV2,
  getMetadata,
});

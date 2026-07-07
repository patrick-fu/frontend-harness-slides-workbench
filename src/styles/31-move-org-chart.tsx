import type { CSSProperties } from "react";
import type { BespokeStyleProps, StyleMetadata } from "../types";
import { useFLIP } from "../hooks/useFLIP";
import SpatialSceneTrack, {
  type BeatLayoutMode,
  type SceneTransitionMap,
} from "./SpatialSceneTrack";
import { defineStyleTopic } from "./topic";
import styles from "./31-move-org-chart.module.css";

type Lang = "en" | "zh";

interface SceneCopy {
  eyebrow: string;
  title: string;
  subtitle: string;
  command: string;
  body: string;
  beats: Array<{
    action: string;
    title: string;
    body: string;
  }>;
}

interface SceneData {
  id: number;
  copy: Record<Lang, SceneCopy>;
}

const SCENES: SceneData[] = [
  {
    id: 1,
    copy: {
      en: {
        eyebrow: "wedge",
        title: "MOVE THE ORG CHART",
        subtitle: "The work moved. Authority did not.",
        command: "Break the static chart",
        body: "A red wedge drives through the old reporting map and opens space for the real flow of work.",
        beats: [
          {
            action: "Expose the static hierarchy",
            title: "Static chart",
            body: "Boxes name power, not flow.",
          },
          {
            action: "Drive the wedge through the center",
            title: "Wedge enters",
            body: "The new work pattern cuts across reporting lines.",
          },
          {
            action: "Open the diagonal route",
            title: "Route opens",
            body: "Decision lanes point toward delivery.",
          },
        ],
      },
      zh: {
        eyebrow: "楔入",
        title: "移动组织图",
        subtitle: "工作已经移动，权力还停在原地。",
        command: "打破静态组织图",
        body: "红色楔形刺入旧汇报地图，为真实工作流打开通道。",
        beats: [
          {
            action: "显露静态层级",
            title: "静态图",
            body: "方框标记权力，不标记流动。",
          },
          {
            action: "红楔刺入中心",
            title: "楔形进入",
            body: "新工作方式切过汇报线。",
          },
          {
            action: "打开斜向路线",
            title: "路线打开",
            body: "决策通道指向交付。",
          },
        ],
      },
    },
  },
  {
    id: 2,
    copy: {
      en: {
        eyebrow: "opposition",
        title: "THE OLD ORDER FIGHTS BACK",
        subtitle: "Layers defend their edges.",
        command: "Name the resistance",
        body: "The blockers are not abstract. They are titles, handoffs, approvals, and territory.",
        beats: [
          {
            action: "Raise the opposition wall",
            title: "Wall",
            body: "Bureaucracy stacks itself into a barrier.",
          },
          {
            action: "Stamp the old objections",
            title: "Objections",
            body: "Control, policy, territory, and fear speak as one.",
          },
          {
            action: "Mark the crack in the wall",
            title: "Crack",
            body: "The wedge finds the first seam in the hierarchy.",
          },
        ],
      },
      zh: {
        eyebrow: "阻力",
        title: "旧秩序反击",
        subtitle: "层级守住自己的边界。",
        command: "说出阻力",
        body: "阻碍不是抽象词，而是头衔、交接、审批和地盘。",
        beats: [
          {
            action: "立起阻力墙",
            title: "墙",
            body: "官僚层叠成一道屏障。",
          },
          {
            action: "盖上旧借口",
            title: "借口",
            body: "控制、政策、地盘和恐惧合成一种声音。",
          },
          {
            action: "标出墙上的裂口",
            title: "裂口",
            body: "红楔找到层级里的第一条缝。",
          },
        ],
      },
    },
  },
  {
    id: 3,
    copy: {
      en: {
        eyebrow: "mobilization",
        title: "MOBILIZE THE WORK",
        subtitle: "People align around the mission, not the boxes.",
        command: "Build diagonal lanes",
        body: "Product, design, engineering, and operations move as one line of force.",
        beats: [
          {
            action: "Show separate teams",
            title: "Separate teams",
            body: "Each function starts in its own block.",
          },
          {
            action: "Tilt teams into shared lanes",
            title: "Shared lanes",
            body: "The lane replaces the department as the operating unit.",
          },
          {
            action: "Advance the mobilized line",
            title: "Mobilized",
            body: "Ownership travels with the work.",
          },
        ],
      },
      zh: {
        eyebrow: "动员",
        title: "动员工作本身",
        subtitle: "人围绕使命对齐，不围绕方框对齐。",
        command: "建立斜向通道",
        body: "产品、设计、工程和运营合成一条力量线。",
        beats: [
          {
            action: "展示分散团队",
            title: "分散团队",
            body: "每个职能先在自己的方块里。",
          },
          {
            action: "团队倾斜进入共用通道",
            title: "共用通道",
            body: "通道取代部门，成为运行单元。",
          },
          {
            action: "推进动员线",
            title: "已动员",
            body: "责任跟着工作移动。",
          },
        ],
      },
    },
  },
  {
    id: 4,
    copy: {
      en: {
        eyebrow: "proof",
        title: "PROOF, NOT THEORY",
        subtitle: "The new chart shows up in cycle time.",
        command: "Show the results",
        body: "Fewer handoffs. Clearer ownership. Faster decisions. The poster earns its claim.",
        beats: [
          {
            action: "Show the before pyramid",
            title: "Before",
            body: "Four layers wait for permission.",
          },
          {
            action: "Reveal the after lanes",
            title: "After",
            body: "Three lanes own the work end to end.",
          },
          {
            action: "Stamp the proof points",
            title: "Proof",
            body: "Two handoffs removed; one accountable loop remains.",
          },
        ],
      },
      zh: {
        eyebrow: "证明",
        title: "要证明，不要理论",
        subtitle: "新组织图会体现在周期时间里。",
        command: "展示结果",
        body: "更少交接，更清晰责任，更快决策。海报必须兑现口号。",
        beats: [
          {
            action: "展示改造前金字塔",
            title: "之前",
            body: "四层结构等待许可。",
          },
          {
            action: "展开改造后通道",
            title: "之后",
            body: "三条通道端到端负责。",
          },
          {
            action: "盖上证据点",
            title: "证据",
            body: "移除两次交接，只留下一个负责闭环。",
          },
        ],
      },
    },
  },
  {
    id: 5,
    copy: {
      en: {
        eyebrow: "call",
        title: "MOVE AUTHORITY TO THE WORK",
        subtitle: "Do not redraw the boxes. Move the power.",
        command: "Move now",
        body: "The org chart is not a document. It is a marching order.",
        beats: [
          {
            action: "Hold the final call",
            title: "Call",
            body: "Move authority to the work.",
          },
          {
            action: "Lock the marching order",
            title: "Order",
            body: "Move now. Build what is next.",
          },
        ],
      },
      zh: {
        eyebrow: "号召",
        title: "把权力移到工作现场",
        subtitle: "不要重画方框。移动权力。",
        command: "现在移动",
        body: "组织图不是文档，而是行动命令。",
        beats: [
          {
            action: "停留在最终号召",
            title: "号召",
            body: "把权力移到工作现场。",
          },
          {
            action: "锁定行动命令",
            title: "命令",
            body: "现在移动。建设下一步。",
          },
        ],
      },
    },
  },
];

const TRANSITION_MAP: SceneTransitionMap = {
  "1->2": "slide-x",
  "2->3": "glitch",
  "3->4": "scale-fade",
  "4->5": "hard-cut",
};

const BEAT_LAYOUT_MODES: Record<number, BeatLayoutMode> = {
  1: "motion",
  2: "motion",
  3: "motion",
  4: "motion",
  5: "motion",
};

const OPPOSITION_LABELS: Record<Lang, string[]> = {
  en: ["Title", "Approval", "Policy", "Territory", "Handoff", "Fear"],
  zh: ["头衔", "审批", "政策", "地盘", "交接", "恐惧"],
};

const MOBILIZE_LABELS: Record<Lang, string[]> = {
  en: ["Product", "Design", "Engineering", "Ops"],
  zh: ["产品", "设计", "工程", "运营"],
};

const PROOF_LABELS: Record<Lang, string[]> = {
  en: ["2 handoffs removed", "1 owner loop", "3 lanes ship"],
  zh: ["移除 2 次交接", "保留 1 个负责闭环", "3 条通道交付"],
};

const NAV_POSITIONS = [
  { top: "12cqh", left: "85cqw" },
  { top: "26cqh", left: "80cqw" },
  { top: "40cqh", left: "75cqw" },
  { top: "54cqh", left: "70cqw" },
  { top: "68cqh", left: "65cqw" },
];

function clampScene(scene: number): number {
  return Math.min(Math.max(Math.trunc(scene), 1), SCENES.length);
}

function clampBeat(scene: number, beat: number): number {
  const safeScene = clampScene(scene);
  const maxBeat = SCENES[safeScene - 1].copy.en.beats.length - 1;
  return Math.min(Math.max(Math.trunc(beat), 0), maxBeat);
}

function getScene(scene: number): SceneData {
  return SCENES[clampScene(scene) - 1];
}

function getCopy(scene: number, language: Lang): SceneCopy {
  return getScene(scene).copy[language];
}

function getVisibleBeatIndexes(scene: number, beat: number): number[] {
  const maxBeat = clampBeat(scene, beat);
  return Array.from({ length: maxBeat + 1 }, (_, index) => index);
}

function visibleFromBeat(index: number, beat: number): "true" | "false" {
  return index <= beat ? "true" : "false";
}

function styleVars(vars: Record<string, string | number>): CSSProperties {
  return vars as CSSProperties;
}

function BeatMarkers({ scene, beat, language }: {
  scene: number;
  beat: number;
  language: Lang;
}) {
  const copy = getCopy(scene, language);
  return (
    <div className={styles.beatMarkers} aria-label={language === "zh" ? "节拍" : "Beats"}>
      {copy.beats.map((item, index) => (
        <span
          key={item.title}
          className={styles.beatMarker}
          data-active={index <= beat ? "true" : "false"}
          title={item.title}
        />
      ))}
    </div>
  );
}

function WedgeRail({
  activeScene,
  language,
  onNavigate,
}: {
  activeScene: number;
  language: Lang;
  onNavigate?: (scene: number, beat: number) => void;
}) {
  return (
    <nav className={styles.wedgeRail} aria-label={language === "zh" ? "场景导航" : "Scene navigation"}>
      <div className={styles.railSpine} />
      {SCENES.map((scene, index) => {
        const navStyle = styleVars({
          "--nav-top": NAV_POSITIONS[index].top,
          "--nav-left": NAV_POSITIONS[index].left,
        });
        return (
          <button
            key={scene.id}
            type="button"
            className={styles.railButton}
            data-active={scene.id === activeScene ? "true" : "false"}
            aria-label={`${language === "zh" ? "跳转到场景" : "Go to scene"} ${scene.id}`}
            onClick={(event) => {
              event.stopPropagation();
              onNavigate?.(scene.id, 0);
            }}
            style={navStyle}
          />
        );
      })}
    </nav>
  );
}

function OrgChart({ beat }: { beat: number }) {
  const nodes = Array.from({ length: 13 }, (_, index) => index);
  return (
    <div className={styles.orgChart} data-beat-layout-item="true">
      <div className={styles.orgConnector} />
      {nodes.map((node) => (
        <span
          key={node}
          className={styles.orgNode}
          data-broken={beat >= 1 && node > 6 ? "true" : "false"}
          data-open={beat >= 2 && node > 8 ? "true" : "false"}
        />
      ))}
    </div>
  );
}

function SceneOne({ beat, copy }: { beat: number; copy: SceneCopy }) {
  return (
    <div className={`${styles.sceneGrid} ${styles.sceneOne}`}>
      <div className={styles.posterIndex} data-beat-layout-item="true">01</div>
      <div className={styles.titleBlock} data-beat-layout-item="true">
        <p className={styles.eyebrow}>{copy.eyebrow}</p>
        <h1>{copy.title}</h1>
        <p>{copy.subtitle}</p>
      </div>
      <OrgChart beat={beat} />
      <div className={styles.attackWedge} data-open={beat >= 1 ? "true" : "false"} data-beat-layout-item="true" />
      <div className={styles.breakBurst} data-open={beat >= 1 ? "true" : "false"} data-beat-layout-item="true">
        {Array.from({ length: 12 }, (_, index) => (
          <i key={index} />
        ))}
      </div>
      <div className={styles.routeArrows} data-open={beat >= 2 ? "true" : "false"} data-beat-layout-item="true">
        <span />
        <span />
        <span />
      </div>
      <p className={styles.commandStrip} data-beat-layout-item="true">{copy.command}</p>
      <p className={styles.bodyBlock} data-visible={beat >= 2 ? "true" : "false"} data-beat-layout-item="true">
        {copy.body}
      </p>
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
  language: Lang;
}) {
  return (
    <div className={`${styles.sceneGrid} ${styles.sceneTwo}`}>
      <div className={styles.posterIndex} data-beat-layout-item="true">02</div>
      <div className={styles.verticalBanner} data-beat-layout-item="true">{copy.eyebrow}</div>
      <div className={styles.oppositionTitle} data-beat-layout-item="true">
        <h2>{copy.title}</h2>
        <p>{copy.subtitle}</p>
      </div>
      <div className={styles.oppositionWall} data-beat-layout-item="true">
        {OPPOSITION_LABELS[language].map((label, index) => (
          <span key={label} data-visible={visibleFromBeat(index > 1 ? 1 : 0, beat)}>
            {label}
          </span>
        ))}
      </div>
      <div className={styles.wallCrack} data-visible={beat >= 2 ? "true" : "false"} data-beat-layout-item="true" />
      <p className={styles.commandStrip} data-beat-layout-item="true">{copy.command}</p>
      <p className={styles.bodyBlock} data-visible={beat >= 1 ? "true" : "false"} data-beat-layout-item="true">
        {copy.body}
      </p>
    </div>
  );
}

function SceneThree({
  beat,
  copy,
  language,
}: {
  beat: number;
  copy: SceneCopy;
  language: Lang;
}) {
  return (
    <div className={`${styles.sceneGrid} ${styles.sceneThree}`}>
      <div className={styles.posterIndex} data-beat-layout-item="true">03</div>
      <div className={styles.mobilizeTitle} data-beat-layout-item="true">
        <p className={styles.eyebrow}>{copy.eyebrow}</p>
        <h2>{copy.title}</h2>
        <p>{copy.subtitle}</p>
      </div>
      <div className={styles.laneField} data-beat-layout-item="true">
        {MOBILIZE_LABELS[language].map((label, index) => (
          <div
            key={label}
            className={styles.lane}
            data-visible={visibleFromBeat(index === 0 ? 0 : 1, beat)}
            style={styleVars({ "--lane-offset": `${index * 11}cqh` })}
          >
            <span>{label}</span>
            <i />
            <b />
          </div>
        ))}
      </div>
      <div className={styles.marchLine} data-visible={beat >= 2 ? "true" : "false"} data-beat-layout-item="true">
        {Array.from({ length: 7 }, (_, index) => (
          <span key={index} />
        ))}
      </div>
      <p className={styles.commandStrip} data-beat-layout-item="true">{copy.command}</p>
      <p className={styles.bodyBlock} data-visible={beat >= 2 ? "true" : "false"} data-beat-layout-item="true">
        {copy.body}
      </p>
    </div>
  );
}

function BeforePyramid({ beat }: { beat: number }) {
  return (
    <div className={styles.beforePyramid} data-visible={beat >= 0 ? "true" : "false"}>
      {Array.from({ length: 10 }, (_, index) => (
        <span key={index} />
      ))}
    </div>
  );
}

function AfterLanes({ beat }: { beat: number }) {
  return (
    <div className={styles.afterLanes} data-visible={beat >= 1 ? "true" : "false"}>
      {Array.from({ length: 3 }, (_, lane) => (
        <div key={lane}>
          {Array.from({ length: 4 }, (_, node) => (
            <span key={node} />
          ))}
        </div>
      ))}
    </div>
  );
}

function SceneFour({
  beat,
  copy,
  language,
}: {
  beat: number;
  copy: SceneCopy;
  language: Lang;
}) {
  return (
    <div className={`${styles.sceneGrid} ${styles.sceneFour}`}>
      <div className={styles.posterIndex} data-beat-layout-item="true">04</div>
      <div className={styles.proofTitle} data-beat-layout-item="true">
        <p className={styles.eyebrow}>{copy.eyebrow}</p>
        <h2>{copy.title}</h2>
        <p>{copy.subtitle}</p>
      </div>
      <div className={styles.proofArena} data-beat-layout-item="true">
        <section>
          <h3>{copy.beats[0].title}</h3>
          <BeforePyramid beat={beat} />
        </section>
        <section>
          <h3>{copy.beats[1].title}</h3>
          <AfterLanes beat={beat} />
        </section>
      </div>
      <div className={styles.proofStamps} data-visible={beat >= 2 ? "true" : "false"} data-beat-layout-item="true">
        {PROOF_LABELS[language].map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>
      <p className={styles.commandStrip} data-beat-layout-item="true">{copy.command}</p>
      <p className={styles.bodyBlock} data-visible={beat >= 2 ? "true" : "false"} data-beat-layout-item="true">
        {copy.body}
      </p>
    </div>
  );
}

function SceneFive({ beat, copy }: { beat: number; copy: SceneCopy }) {
  return (
    <div className={`${styles.sceneGrid} ${styles.sceneFive}`}>
      <div className={styles.posterIndex} data-beat-layout-item="true">05</div>
      <div className={styles.finalWedge} data-beat-layout-item="true" />
      <div className={styles.callTitle} data-beat-layout-item="true">
        <p className={styles.eyebrow}>{copy.eyebrow}</p>
        <h2>{copy.title}</h2>
        <p>{copy.subtitle}</p>
      </div>
      <div className={styles.crowdLine} data-visible={beat >= 1 ? "true" : "false"} data-beat-layout-item="true">
        {Array.from({ length: 12 }, (_, index) => (
          <span key={index} />
        ))}
      </div>
      <p className={styles.callCommand} data-visible={beat >= 1 ? "true" : "false"} data-beat-layout-item="true">
        {copy.command}
      </p>
      <p className={styles.bodyBlock} data-visible={beat >= 1 ? "true" : "false"} data-beat-layout-item="true">
        {copy.body}
      </p>
    </div>
  );
}

function ScenePanel({
  scene,
  beat,
  language,
  motionOff,
  isActive,
}: {
  scene: number;
  beat: number;
  language: Lang;
  motionOff: boolean;
  isActive: boolean;
}) {
  const safeBeat = clampBeat(scene, beat);
  const copy = getCopy(scene, language);
  const { ref } = useFLIP<HTMLElement>({
    watch: [scene, safeBeat, language],
    disabled: motionOff || !isActive,
    duration: 460,
    easing: "cubic-bezier(0.2, 0.9, 0.1, 1)",
    selector: '[data-beat-layout-item="true"]',
  });

  return (
    <section
      ref={ref}
      className={styles.scene}
      data-scene={scene}
      data-beat={safeBeat}
      data-beat-layout-container="true"
      data-beat-layout-mode="motion"
    >
      {scene === 1 && <SceneOne beat={safeBeat} copy={copy} />}
      {scene === 2 && <SceneTwo beat={safeBeat} copy={copy} language={language} />}
      {scene === 3 && <SceneThree beat={safeBeat} copy={copy} language={language} />}
      {scene === 4 && <SceneFour beat={safeBeat} copy={copy} language={language} />}
      {scene === 5 && <SceneFive beat={safeBeat} copy={copy} />}
      <BeatMarkers scene={scene} beat={safeBeat} language={language} />
    </section>
  );
}

export function getMetadata(lang: Lang): StyleMetadata {
  return {
    id: "red-wedge-agitprop",
    band: "craft-cultural",
    name: lang === "zh" ? "红楔宣传画" : "Red Wedge Agitprop",
    theme: lang === "zh" ? "移动组织图" : "Move the Org Chart",
    densityLabel: lang === "zh" ? "中等密度 · 动员型" : "Medium · Mobilizing",
    heroScene: 1,
    colors: {
      bg: "#f1e7d0",
      ink: "#11100d",
      panel: "#e11b1a",
    },
    typography: {
      header: "Impact / Noto Sans SC 900",
      body: "Arial Black / PingFang SC",
    },
    tags: [
      "red-wedge",
      "agitprop",
      "constructivist",
      "diagonal",
      "urgent",
      "motion",
      "bilingual",
    ],
    fonts: ["Impact", "Arial Black", "cjk:PingFang SC", "cjk:Noto Sans SC"],
    scenes: SCENES.map((sceneData) => {
      const copy = sceneData.copy[lang];
      return {
        id: sceneData.id,
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

export default function MoveOrgChartV2({
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
  const visibleBeats = getVisibleBeatIndexes(safeScene, safeBeat).join(":");

  return (
    <div
      className={styles.root}
      data-motion={motionOff ? "off" : "on"}
      data-thumbnail={isThumbnail ? "true" : "false"}
      data-visible-beats={visibleBeats}
    >
      <div className={styles.paperFrame} aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <SpatialSceneTrack
        scene={safeScene}
        beat={safeBeat}
        transitionKind="slide-x"
        transitionMap={TRANSITION_MAP}
        transitionDurationMs={620}
        reducedMotion={motionOff}
        beatLayoutModes={BEAT_LAYOUT_MODES}
        className={styles.track}
        renderScene={(sceneId, sceneBeat, isActive) => (
          <ScenePanel
            scene={sceneId}
            beat={sceneBeat}
            language={language}
            motionOff={motionOff}
            isActive={isActive}
          />
        )}
      />
      {!isThumbnail && (
        <WedgeRail
          activeScene={safeScene}
          language={language}
          onNavigate={onNavigate}
        />
      )}
    </div>
  );
}

export const moveOrgChartTopic = defineStyleTopic({
  id: "org-move",
  topic: {
    en: "Org Move",
    zh: "组织移动",
  },
  model: "GPT-5.5",
  component: MoveOrgChartV2,
  getMetadata,
});

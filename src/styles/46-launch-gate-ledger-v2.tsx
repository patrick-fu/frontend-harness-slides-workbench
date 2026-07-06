import type { CSSProperties, ReactNode } from "react";
import type { BespokeStyleProps, StyleMetadata } from "../types";
import SpatialSceneTrack from "./SpatialSceneTrack";
import type { BeatLayoutMode, SceneTransitionMap } from "./SpatialSceneTrack";
import { defineStyleVersion } from "./version";

type Lang = "en" | "zh";
type SceneId = 1 | 2 | 3 | 4 | 5;

interface BeatText {
  id: number;
  action: string;
  title: string;
  body: string;
}

interface SceneText {
  id: SceneId;
  title: string;
  shortTitle: string;
  folio: string;
  eyebrow: string;
  heading: string;
  subheading: string;
  beats: BeatText[];
}

const PALETTE = {
  bg: "#f6f2e8",
  paper: "#fffaf0",
  ink: "#17221d",
  muted: "#66736a",
  rule: "#d8d0bd",
  ruleStrong: "#afa68f",
  green: "#247a4f",
  greenSoft: "#dceadd",
  red: "#a44a3f",
  redSoft: "#f1ddda",
  gold: "#a57a29",
};

const TRANSITION_MAP: SceneTransitionMap = {
  "1->2": "fade",
  "2->3": "slide-y",
  "3->4": "wipe",
  "4->5": "hard-cut",
};

const BEAT_LAYOUT_MODES: Partial<Record<number, BeatLayoutMode>> = {
  1: "reserved",
  2: "reserved",
  3: "reserved",
  4: "reserved",
  5: "reserved",
};

const SCENE_IDS: SceneId[] = [1, 2, 3, 4, 5];

const CONTENT: Record<Lang, { styleName: string; theme: string; density: string; scenes: SceneText[] }> = {
  en: {
    styleName: "Checklist Ledger",
    theme: "Launch Gate Ledger",
    density: "Ledger Dense",
    scenes: [
      {
        id: 1,
        title: "Cover",
        shortTitle: "Cover",
        folio: "LG-46 / COVER",
        eyebrow: "Release readiness record",
        heading: "Launch Gate Ledger",
        subheading: "A signed record for the final gate, written as accountable rows instead of loose tasks.",
        beats: [
          {
            id: 0,
            action: "Open the launch ledger cover",
            title: "Ledger opened",
            body: "Gate scope, release lane, and approval rail are visible.",
          },
          {
            id: 1,
            action: "Stamp the cover as ready for audit",
            title: "Cover stamped",
            body: "The release can proceed only when each ledger page has a receipt.",
          },
        ],
      },
      {
        id: 2,
        title: "Checklist",
        shortTitle: "Checks",
        folio: "LG-46 / CHECKS",
        eyebrow: "Gate criteria",
        heading: "Checklist ledger",
        subheading: "Every row carries an explicit owner receipt, not a casual done state.",
        beats: [
          {
            id: 0,
            action: "Verify build and quality rows",
            title: "Core checks posted",
            body: "Build lock, QA pass, and rollback drill are checked first.",
          },
          {
            id: 1,
            action: "Add customer and metrics rows",
            title: "Operational checks posted",
            body: "Support brief and metrics guardrails are added without moving prior rows.",
          },
          {
            id: 2,
            action: "Resolve the checklist total",
            title: "Checklist balanced",
            body: "The running total closes at five verified rows.",
          },
        ],
      },
      {
        id: 3,
        title: "Exceptions",
        shortTitle: "Exceptions",
        folio: "LG-46 / EXCEPTIONS",
        eyebrow: "Exception register",
        heading: "Exceptions accounted",
        subheading: "A gate can carry exceptions only when the waiver, containment, and signer are visible.",
        beats: [
          {
            id: 0,
            action: "List contained exceptions",
            title: "Exceptions logged",
            body: "Known exceptions are named in the register.",
          },
          {
            id: 1,
            action: "Attach containment notes",
            title: "Containment attached",
            body: "Each exception shows its guardrail and review owner.",
          },
          {
            id: 2,
            action: "Mark the release-safe path",
            title: "Waivers signed",
            body: "The ledger distinguishes accepted risk from hidden work.",
          },
        ],
      },
      {
        id: 4,
        title: "Owner List",
        shortTitle: "Owners",
        folio: "LG-46 / OWNERS",
        eyebrow: "Receipt owners",
        heading: "Owner list",
        subheading: "The launch is not ready until each functional receipt has a named signer.",
        beats: [
          {
            id: 0,
            action: "Show owner rows",
            title: "Owners named",
            body: "Release, risk, data, and support owners occupy fixed rows.",
          },
          {
            id: 1,
            action: "Add initials and receipts",
            title: "Receipts entered",
            body: "Each owner row receives initials and a ledger receipt.",
          },
        ],
      },
      {
        id: 5,
        title: "Signoff",
        shortTitle: "Signoff",
        folio: "LG-46 / SIGNOFF",
        eyebrow: "Final receipt",
        heading: "Signed for launch",
        subheading: "The gate closes as a record of accountability: criteria met, exceptions accepted, owners signed.",
        beats: [
          {
            id: 0,
            action: "Present the final receipt",
            title: "Receipt prepared",
            body: "Checklist, exceptions, and owner pages roll into the final page.",
          },
          {
            id: 1,
            action: "Seal the launch gate ledger",
            title: "Gate signed",
            body: "The ledger closes with an approved launch receipt.",
          },
        ],
      },
    ],
  },
  zh: {
    styleName: "核对账本",
    theme: "上线闸口账本",
    density: "账本高密",
    scenes: [
      {
        id: 1,
        title: "封面",
        shortTitle: "封面",
        folio: "LG-46 / 封面",
        eyebrow: "发布就绪记录",
        heading: "上线闸口账本",
        subheading: "最终闸口用可签收的账本记录，而不是松散任务列表。",
        beats: [
          {
            id: 0,
            action: "打开上线账本封面",
            title: "账本打开",
            body: "闸口范围、发布通道和审批栏已经可见。",
          },
          {
            id: 1,
            action: "给封面盖上可审计标记",
            title: "封面盖章",
            body: "只有每一页都有签收凭据，发布才可以继续。",
          },
        ],
      },
      {
        id: 2,
        title: "清单",
        shortTitle: "清单",
        folio: "LG-46 / 清单",
        eyebrow: "闸口标准",
        heading: "清单账本",
        subheading: "每一行都有明确责任人签收，而不是随手勾掉的完成状态。",
        beats: [
          {
            id: 0,
            action: "核验构建和质量行",
            title: "核心检查入账",
            body: "先确认构建锁定、QA 通过和回滚演练。",
          },
          {
            id: 1,
            action: "补入用户和指标行",
            title: "运营检查入账",
            body: "支持简报和指标护栏补入，前序行位置保持稳定。",
          },
          {
            id: 2,
            action: "结算清单总数",
            title: "清单轧平",
            body: "运行总数收束为五条已核验记录。",
          },
        ],
      },
      {
        id: 3,
        title: "例外",
        shortTitle: "例外",
        folio: "LG-46 / 例外",
        eyebrow: "例外登记",
        heading: "例外已入账",
        subheading: "闸口可以带例外，但豁免、兜底和签署人必须清楚可见。",
        beats: [
          {
            id: 0,
            action: "列出已兜底例外",
            title: "例外登记",
            body: "已知例外在登记簿中逐项命名。",
          },
          {
            id: 1,
            action: "附上兜底说明",
            title: "兜底附注",
            body: "每个例外显示护栏和复核责任人。",
          },
          {
            id: 2,
            action: "标记可发布路径",
            title: "豁免签收",
            body: "账本区分已接受风险和隐藏工作。",
          },
        ],
      },
      {
        id: 4,
        title: "责任人",
        shortTitle: "责任人",
        folio: "LG-46 / 责任人",
        eyebrow: "签收责任人",
        heading: "责任人名册",
        subheading: "每个职能签收都必须有具名签署人，上线才算就绪。",
        beats: [
          {
            id: 0,
            action: "展示责任人行",
            title: "责任人列名",
            body: "发布、风险、数据和支持责任人进入固定行。",
          },
          {
            id: 1,
            action: "补入缩写和签收",
            title: "签收录入",
            body: "每个责任人行补入缩写和账本签收凭据。",
          },
        ],
      },
      {
        id: 5,
        title: "签署",
        shortTitle: "签署",
        folio: "LG-46 / 签署",
        eyebrow: "最终凭据",
        heading: "上线已签收",
        subheading: "闸口以责任记录收束：标准满足、例外接受、责任人签署。",
        beats: [
          {
            id: 0,
            action: "呈现最终凭据",
            title: "凭据备妥",
            body: "清单、例外和责任人页面汇入最终页。",
          },
          {
            id: 1,
            action: "封存上线闸口账本",
            title: "闸口签署",
            body: "账本以批准上线凭据关闭。",
          },
        ],
      },
    ],
  },
};

const CHECK_ROWS = {
  en: [
    ["Build lock", "Release branch frozen", "Platform"],
    ["QA pass", "Smoke and core journeys green", "Quality"],
    ["Rollback drill", "Rollback path rehearsed", "SRE"],
    ["Support brief", "Response lines published", "CX"],
    ["Metrics guard", "Alerts armed and owned", "Data"],
  ],
  zh: [
    ["构建锁定", "发布分支已冻结", "平台"],
    ["QA 通过", "冒烟和核心路径均为绿色", "质量"],
    ["回滚演练", "回滚路径已演练", "SRE"],
    ["支持简报", "响应口径已发布", "客服"],
    ["指标护栏", "告警已启用且有人负责", "数据"],
  ],
};

const EXCEPTION_ROWS = {
  en: [
    ["Copy drift", "Contained by launch note", "Waived"],
    ["Cache warm-up", "Guarded by staged traffic", "Contained"],
    ["FAQ lag", "Support owner on call", "Accepted"],
  ],
  zh: [
    ["文案偏差", "由上线说明兜底", "豁免"],
    ["缓存预热", "由分阶段流量护栏控制", "已兜底"],
    ["FAQ 滞后", "支持负责人值守", "接受"],
  ],
};

const OWNER_ROWS = {
  en: [
    ["Release", "Maya Chen", "MC", "Launch captain"],
    ["Risk", "Owen Hart", "OH", "Exception owner"],
    ["Data", "Nina Shah", "NS", "Metric desk"],
    ["Support", "Luis Park", "LP", "Customer desk"],
  ],
  zh: [
    ["发布", "Maya Chen", "MC", "上线负责人"],
    ["风险", "Owen Hart", "OH", "例外负责人"],
    ["数据", "Nina Shah", "NS", "指标台"],
    ["支持", "Luis Park", "LP", "用户支持台"],
  ],
};

const FINAL_ROWS = {
  en: [
    ["Gate criteria", "5 / 5 checked"],
    ["Exceptions", "3 accepted with receipts"],
    ["Owners", "4 signatures entered"],
    ["Launch receipt", "Approved"],
  ],
  zh: [
    ["闸口标准", "5 / 5 已核验"],
    ["例外", "3 条带凭据接受"],
    ["责任人", "4 个签名已录入"],
    ["上线凭据", "已批准"],
  ],
};

const rootStyle = {
  "--style-46-bg": PALETTE.bg,
  "--style-46-ink": PALETTE.ink,
  "--style-46-panel": PALETTE.paper,
  "--style-46-accent": PALETTE.green,
  position: "relative",
  width: "100%",
  height: "100%",
  overflow: "hidden",
  containerType: "size",
  backgroundColor: "var(--style-46-bg)",
  backgroundImage:
    "repeating-linear-gradient(to bottom, rgba(216, 208, 189, 0.44) 0 0.10cqh, transparent 0.10cqh 5.20cqh), repeating-linear-gradient(to right, rgba(216, 208, 189, 0.28) 0 0.06cqw, transparent 0.06cqw 8.50cqw)",
  color: "var(--style-46-ink)",
  fontFamily:
    "\"Aptos\", \"Inter\", \"Noto Sans SC\", \"PingFang SC\", \"Microsoft YaHei\", sans-serif",
} as CSSProperties;

function clampBeat(beat: number, sceneId: SceneId): number {
  const max = CONTENT.en.scenes[sceneId - 1].beats.length - 1;
  return Math.max(0, Math.min(beat, max));
}

function revealStyle(visible: boolean, motionOff: boolean, shift = "0.80cqh"): CSSProperties {
  return {
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : `translateY(${shift})`,
    transition: motionOff
      ? "none"
      : "opacity 420ms ease, transform 420ms ease, border-color 420ms ease, background-color 420ms ease",
  };
}

function getScene(lang: Lang, sceneId: SceneId): SceneText {
  return CONTENT[lang].scenes[sceneId - 1];
}

function sceneMetadata(lang: Lang) {
  return CONTENT[lang].scenes.map((scene) => ({
    id: scene.id,
    title: scene.title,
    beats: scene.beats,
  }));
}

function PageHeader({ scene, language }: { scene: SceneText; language: Lang }) {
  return (
    <header
      data-beat-layout-item="true"
      style={{
        display: "grid",
        gridTemplateColumns: "68% 32%",
        alignItems: "end",
        borderBottom: `0.11cqh solid ${PALETTE.ruleStrong}`,
        paddingBottom: "1.1cqh",
      }}
    >
      <div>
        <div
          style={{
            color: PALETTE.green,
            fontSize: "1.15cqw",
            fontWeight: 700,
            letterSpacing: "0",
            textTransform: "uppercase",
          }}
        >
          {scene.eyebrow}
        </div>
        <h1
          style={{
            margin: "0.55cqh 0 0",
            fontSize: "3.9cqw",
            lineHeight: 0.94,
            letterSpacing: "0",
            fontWeight: 760,
          }}
        >
          {scene.heading}
        </h1>
      </div>
      <div
        style={{
          justifySelf: "end",
          width: "84%",
          border: `0.10cqh solid ${PALETTE.ruleStrong}`,
          padding: "0.8cqh 0.8cqw",
          textAlign: "right",
          color: PALETTE.muted,
          fontSize: "1.05cqw",
          lineHeight: 1.2,
          backgroundColor: "rgba(255, 250, 240, 0.76)",
        }}
        >
          <div>{scene.folio}</div>
        <div>{language === "zh" ? "状态 / 受控" : "STATUS / CONTROLLED"}</div>
      </div>
    </header>
  );
}

function LedgerRail({
  scene,
  language,
  onNavigate,
  isThumbnail,
}: {
  scene: number;
  language: Lang;
  onNavigate?: (scene: number, beat: number) => void;
  isThumbnail: boolean;
}) {
  if (isThumbnail) return null;

  return (
    <nav
      aria-label={language === "zh" ? "账本场景导航" : "Ledger scene navigation"}
      style={{
        position: "absolute",
        left: "2.2cqw",
        top: "8.8cqh",
        width: "4.8cqw",
        height: "82.4cqh",
        display: "grid",
        gridTemplateRows: "repeat(5, 20%)",
        borderLeft: `0.12cqw solid ${PALETTE.ruleStrong}`,
      }}
    >
      {SCENE_IDS.map((id) => {
        const item = getScene(language, id);
        const active = scene === id;
        const checked = scene > id;
        return (
          <button
            key={id}
            type="button"
            onClick={() => onNavigate?.(id, 0)}
            aria-current={active ? "step" : undefined}
            aria-label={item.title}
            style={{
              position: "relative",
              display: "grid",
              gridTemplateRows: "42% 58%",
              alignItems: "center",
              justifyItems: "start",
              padding: "0 0 0 0.8cqw",
              border: "0",
              background: "transparent",
              color: active ? PALETTE.ink : PALETTE.muted,
              cursor: "pointer",
              font: "inherit",
            }}
          >
            <span
              style={{
                position: "absolute",
                left: "-0.48cqw",
                top: "2.3cqh",
                width: "0.9cqw",
                height: "0.9cqw",
                display: "grid",
                placeItems: "center",
                border: `0.11cqw solid ${active || checked ? PALETTE.green : PALETTE.ruleStrong}`,
                backgroundColor: active || checked ? PALETTE.greenSoft : PALETTE.paper,
                color: PALETTE.green,
                fontSize: "0.70cqw",
                lineHeight: 1,
              }}
            >
              {checked ? "✓" : ""}
            </span>
            <span
              style={{
                alignSelf: "end",
                fontSize: "0.88cqw",
                color: active ? PALETTE.green : PALETTE.muted,
                fontWeight: active ? 760 : 620,
              }}
            >
              {String(id).padStart(2, "0")}
            </span>
            <span
              style={{
                writingMode: "vertical-rl",
                textOrientation: "mixed",
                fontSize: "0.82cqw",
                lineHeight: 1.1,
                color: active ? PALETTE.ink : PALETTE.muted,
                maxHeight: "12cqh",
                overflow: "hidden",
              }}
            >
              {item.shortTitle}
            </span>
          </button>
        );
      })}
    </nav>
  );
}

function LedgerShell({
  scene,
  sceneBeat,
  motionOff,
  language,
  children,
}: {
  scene: SceneText;
  sceneBeat: number;
  motionOff: boolean;
  language: Lang;
  children: ReactNode;
}) {
  return (
    <section
      data-beat-layout-container="true"
      data-beat-layout-mode="reserved"
      style={{
        position: "absolute",
        inset: "0",
        display: "grid",
        gridTemplateRows: "17% 9% 74%",
        padding: "6.0cqh 4.4cqw 5.2cqh 9.2cqw",
      }}
    >
      <PageHeader scene={scene} language={language} />
      <p
        data-beat-layout-item="true"
        style={{
          margin: "1.6cqh 0 0",
          maxWidth: "72%",
          color: PALETTE.muted,
          fontSize: "1.35cqw",
          lineHeight: 1.28,
          ...revealStyle(sceneBeat >= 0, motionOff),
        }}
      >
        {scene.subheading}
      </p>
      <main data-beat-layout-item="true" style={{ minHeight: "0", ...revealStyle(sceneBeat >= 0, motionOff) }}>
        {children}
      </main>
    </section>
  );
}

function CheckBox({ active, muted }: { active: boolean; muted?: boolean }) {
  return (
    <span
      aria-hidden="true"
      style={{
        width: "1.22cqw",
        height: "1.22cqw",
        display: "grid",
        placeItems: "center",
        border: `0.12cqw solid ${active ? PALETTE.green : muted ? PALETTE.rule : PALETTE.ruleStrong}`,
        color: PALETTE.green,
        backgroundColor: active ? PALETTE.greenSoft : "transparent",
        fontSize: "0.92cqw",
        fontWeight: 800,
        lineHeight: 1,
      }}
    >
      {active ? "✓" : ""}
    </span>
  );
}

function CoverScene({ scene, beat, motionOff, language }: { scene: SceneText; beat: number; motionOff: boolean; language: Lang }) {
  const issued = language === "zh" ? "发布闸口" : "Release gate";
  const receipt = language === "zh" ? "签收凭据" : "Receipt";
  const ready = language === "zh" ? "可审计" : "Auditable";
  const coverLabels = language === "zh" ? [ready, "范围", "签署人"] : [ready, "Scope", "Signers"];

  return (
    <LedgerShell scene={scene} sceneBeat={beat} motionOff={motionOff} language={language}>
      <div
        style={{
          height: "100%",
          display: "grid",
          gridTemplateColumns: "58% 42%",
          gap: "2.6cqw",
          alignItems: "stretch",
        }}
      >
        <div
          data-beat-layout-item="true"
          style={{
            border: `0.14cqw solid ${PALETTE.ruleStrong}`,
            backgroundColor: "rgba(255, 250, 240, 0.82)",
            padding: "3.2cqh 2.0cqw",
            display: "grid",
            gridTemplateRows: "18% 44% 38%",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "48% 52%",
              gap: "1.2cqw",
              color: PALETTE.muted,
              fontSize: "1.08cqw",
              lineHeight: 1.25,
            }}
            >
              <span>{issued}</span>
            <span style={{ textAlign: "right" }}>
              {language === "zh" ? "控制号 LG-46-V2" : "Control no. LG-46-V2"}
            </span>
          </div>
          <div
            style={{
              alignSelf: "center",
              borderTop: `0.10cqh solid ${PALETTE.rule}`,
              borderBottom: `0.10cqh solid ${PALETTE.rule}`,
              padding: "2.4cqh 0",
            }}
          >
            <div
              style={{
                color: PALETTE.green,
                fontSize: "1.0cqw",
                fontWeight: 800,
                textTransform: "uppercase",
              }}
            >
              {receipt}
            </div>
            <div
              style={{
                marginTop: "0.9cqh",
                fontSize: "2.55cqw",
                lineHeight: 1.05,
                fontWeight: 720,
              }}
            >
              {scene.beats[beat].title}
            </div>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 32%)",
              gap: "2%",
              alignItems: "end",
            }}
          >
            {[0, 1, 2].map((index) => (
              <div
                key={index}
                style={{
                  borderTop: `0.10cqh solid ${PALETTE.ruleStrong}`,
                  paddingTop: "1.0cqh",
                  color: index === 0 ? PALETTE.ink : PALETTE.muted,
                  fontSize: "1.05cqw",
                  lineHeight: 1.22,
                }}
              >
                <CheckBox active={index === 0 || beat >= 1} muted={index > 0 && beat < 1} />
                <div style={{ marginTop: "0.8cqh" }}>
                  {coverLabels[index]}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div
          data-beat-layout-item="true"
          style={{
            position: "relative",
            borderLeft: `0.10cqw solid ${PALETTE.ruleStrong}`,
            paddingLeft: "2.4cqw",
            display: "grid",
            gridTemplateRows: "46% 54%",
          }}
        >
          <div
            style={{
              alignSelf: "start",
              justifySelf: "center",
              width: "18cqw",
              height: "18cqw",
              border: `0.36cqw double ${beat >= 1 ? PALETTE.green : PALETTE.ruleStrong}`,
              borderRadius: "50%",
              display: "grid",
              placeItems: "center",
              color: beat >= 1 ? PALETTE.green : PALETTE.ruleStrong,
              fontSize: "1.45cqw",
              fontWeight: 820,
              textAlign: "center",
              transform: beat >= 1 ? "rotate(-8deg)" : "rotate(0)",
              transition: motionOff ? "none" : "transform 420ms ease, color 420ms ease, border-color 420ms ease",
            }}
          >
            {language === "zh" ? "准许审阅" : "READY FOR REVIEW"}
          </div>
          <p
            style={{
              alignSelf: "end",
              margin: "0",
              color: PALETTE.muted,
              fontSize: "1.36cqw",
              lineHeight: 1.34,
              ...revealStyle(beat >= 1, motionOff, "0.45cqh"),
            }}
          >
            {scene.beats[beat].body}
          </p>
        </div>
      </div>
    </LedgerShell>
  );
}

function ChecklistScene({ scene, beat, motionOff, language }: { scene: SceneText; beat: number; motionOff: boolean; language: Lang }) {
  const rows = CHECK_ROWS[language];
  const visibleCount = beat === 0 ? 3 : beat === 1 ? 5 : 5;

  return (
    <LedgerShell scene={scene} sceneBeat={beat} motionOff={motionOff} language={language}>
      <div
        data-beat-layout-item="true"
        style={{
          height: "100%",
          display: "grid",
          gridTemplateRows: "78% 22%",
          border: `0.12cqw solid ${PALETTE.ruleStrong}`,
          backgroundColor: "rgba(255, 250, 240, 0.78)",
        }}
      >
        <div style={{ display: "grid", gridTemplateRows: "11% repeat(5, 17.8%)" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "8% 28% 42% 22%",
            alignItems: "center",
            borderBottom: `0.10cqh solid ${PALETTE.ruleStrong}`,
            color: PALETTE.muted,
              fontSize: "0.95cqw",
              fontWeight: 720,
            textTransform: "uppercase",
          }}
        >
            <span style={{ paddingLeft: "1.1cqw" }}>{language === "zh" ? "核验" : "OK"}</span>
            <span>{language === "zh" ? "项目" : "Criterion"}</span>
            <span>{language === "zh" ? "凭据" : "Receipt"}</span>
            <span>{language === "zh" ? "签收台" : "Desk"}</span>
          </div>
          {rows.map((row, index) => {
            const visible = index < visibleCount;
            const active = index < visibleCount;
            return (
              <div
                key={row[0]}
                data-beat-layout-item="true"
                style={{
                  display: "grid",
                  gridTemplateColumns: "8% 28% 42% 22%",
                  alignItems: "center",
                  borderBottom: index === rows.length - 1 ? "0" : `0.08cqh solid ${PALETTE.rule}`,
                  color: visible ? PALETTE.ink : PALETTE.muted,
                  fontSize: "1.26cqw",
                  lineHeight: 1.18,
                  ...revealStyle(visible, motionOff, "0.35cqh"),
                }}
              >
                <span style={{ paddingLeft: "1.1cqw" }}>
                  <CheckBox active={active} />
                </span>
                <strong style={{ fontWeight: 720 }}>{row[0]}</strong>
                <span>{row[1]}</span>
                <span style={{ color: PALETTE.green, fontWeight: 720 }}>{row[2]}</span>
              </div>
            );
          })}
        </div>
        <div
          data-beat-layout-item="true"
          style={{
            display: "grid",
            gridTemplateColumns: "24% 52% 24%",
            alignItems: "center",
            borderTop: `0.14cqh solid ${PALETTE.ruleStrong}`,
            padding: "0 1.2cqw",
            backgroundColor: beat >= 2 ? PALETTE.greenSoft : "rgba(255, 250, 240, 0.62)",
            transition: motionOff ? "none" : "background-color 420ms ease",
          }}
        >
          <div style={{ color: PALETTE.muted, fontSize: "1.0cqw", textTransform: "uppercase" }}>
            {language === "zh" ? "运行总数" : "Running total"}
          </div>
          <div style={{ fontSize: "2.2cqw", fontWeight: 780, color: beat >= 2 ? PALETTE.green : PALETTE.ink }}>
            {visibleCount} / 5
          </div>
          <p style={{ margin: "0", fontSize: "1.05cqw", lineHeight: 1.22, color: PALETTE.muted }}>
            {scene.beats[beat].body}
          </p>
        </div>
      </div>
    </LedgerShell>
  );
}

function ExceptionsScene({ scene, beat, motionOff, language }: { scene: SceneText; beat: number; motionOff: boolean; language: Lang }) {
  const rows = EXCEPTION_ROWS[language];

  return (
    <LedgerShell scene={scene} sceneBeat={beat} motionOff={motionOff} language={language}>
      <div
        style={{
          height: "100%",
          display: "grid",
          gridTemplateColumns: "60% 40%",
          gap: "2.0cqw",
        }}
      >
        <div
          data-beat-layout-item="true"
          style={{
            border: `0.12cqw solid ${PALETTE.ruleStrong}`,
            backgroundColor: "rgba(255, 250, 240, 0.78)",
            display: "grid",
            gridTemplateRows: "14% repeat(3, 28.66%)",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "30% 44% 26%",
              alignItems: "center",
              borderBottom: `0.10cqh solid ${PALETTE.ruleStrong}`,
              padding: "0 1.1cqw",
              color: PALETTE.muted,
              fontSize: "0.95cqw",
              fontWeight: 720,
              textTransform: "uppercase",
            }}
          >
            <span>{language === "zh" ? "例外" : "Exception"}</span>
            <span>{language === "zh" ? "兜底" : "Containment"}</span>
            <span>{language === "zh" ? "状态" : "State"}</span>
          </div>
          {rows.map((row, index) => {
            const visible = beat >= 0;
            const noteVisible = beat >= 1 || index === 0;
            const signed = beat >= 2;
            return (
              <div
                key={row[0]}
                data-beat-layout-item="true"
                style={{
                  display: "grid",
                  gridTemplateColumns: "30% 44% 26%",
                  alignItems: "center",
                  padding: "0 1.1cqw",
                  borderBottom: index === rows.length - 1 ? "0" : `0.08cqh solid ${PALETTE.rule}`,
                  fontSize: "1.18cqw",
                  lineHeight: 1.22,
                  ...revealStyle(visible, motionOff, "0.35cqh"),
                }}
              >
                <strong style={{ color: PALETTE.red, fontWeight: 760 }}>{row[0]}</strong>
                <span style={{ color: noteVisible ? PALETTE.ink : "transparent" }}>{row[1]}</span>
                <span
                  style={{
                    justifySelf: "start",
                    border: `0.09cqw solid ${signed ? PALETTE.green : PALETTE.red}`,
                    backgroundColor: signed ? PALETTE.greenSoft : PALETTE.redSoft,
                    color: signed ? PALETTE.green : PALETTE.red,
                    padding: "0.42cqh 0.58cqw",
                    fontSize: "0.92cqw",
                    fontWeight: 760,
                  }}
                >
                  {signed ? row[2] : language === "zh" ? "待签" : "Open"}
                </span>
              </div>
            );
          })}
        </div>
        <aside
          data-beat-layout-item="true"
          style={{
            borderLeft: `0.11cqw solid ${PALETTE.red}`,
            paddingLeft: "1.6cqw",
            display: "grid",
            gridTemplateRows: "30% 32% 38%",
          }}
        >
          {[0, 1, 2].map((index) => (
            <div
              key={index}
              style={{
                borderTop: `0.09cqh solid ${index === 0 ? PALETTE.red : PALETTE.rule}`,
                paddingTop: "1.0cqh",
                ...revealStyle(beat >= index, motionOff, "0.50cqh"),
              }}
            >
              <div style={{ color: index === 0 ? PALETTE.red : PALETTE.green, fontSize: "1.0cqw", fontWeight: 800 }}>
                {scene.beats[index].title}
              </div>
              <p style={{ margin: "0.8cqh 0 0", color: PALETTE.muted, fontSize: "1.08cqw", lineHeight: 1.28 }}>
                {scene.beats[index].body}
              </p>
            </div>
          ))}
        </aside>
      </div>
    </LedgerShell>
  );
}

function OwnersScene({ scene, beat, motionOff, language }: { scene: SceneText; beat: number; motionOff: boolean; language: Lang }) {
  const rows = OWNER_ROWS[language];

  return (
    <LedgerShell scene={scene} sceneBeat={beat} motionOff={motionOff} language={language}>
      <div
        data-beat-layout-item="true"
        style={{
          height: "100%",
          border: `0.12cqw solid ${PALETTE.ruleStrong}`,
          backgroundColor: "rgba(255, 250, 240, 0.80)",
          display: "grid",
          gridTemplateRows: "13% repeat(4, 21.75%)",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "18% 25% 14% 25% 18%",
            alignItems: "center",
            borderBottom: `0.10cqh solid ${PALETTE.ruleStrong}`,
            padding: "0 1.2cqw",
            color: PALETTE.muted,
            fontSize: "0.95cqw",
            fontWeight: 720,
            textTransform: "uppercase",
          }}
        >
          <span>{language === "zh" ? "职能" : "Area"}</span>
          <span>{language === "zh" ? "签署人" : "Signer"}</span>
          <span>{language === "zh" ? "缩写" : "Init"}</span>
          <span>{language === "zh" ? "职责" : "Receipt role"}</span>
          <span>{language === "zh" ? "签收" : "Receipt"}</span>
        </div>
        {rows.map((row) => (
          <div
            key={row[0]}
            data-beat-layout-item="true"
            style={{
              display: "grid",
              gridTemplateColumns: "18% 25% 14% 25% 18%",
              alignItems: "center",
              padding: "0 1.2cqw",
              borderBottom: `0.08cqh solid ${PALETTE.rule}`,
              fontSize: "1.2cqw",
              lineHeight: 1.18,
              ...revealStyle(beat >= 0, motionOff, "0.35cqh"),
            }}
          >
            <strong style={{ color: PALETTE.ink, fontWeight: 760 }}>{row[0]}</strong>
            <span>{row[1]}</span>
            <span
              style={{
                width: "3.0cqw",
                height: "3.0cqw",
                display: "grid",
                placeItems: "center",
                border: `0.10cqw solid ${beat >= 1 ? PALETTE.green : PALETTE.ruleStrong}`,
                borderRadius: "50%",
                color: beat >= 1 ? PALETTE.green : PALETTE.muted,
                backgroundColor: beat >= 1 ? PALETTE.greenSoft : "transparent",
                fontSize: "1.0cqw",
                fontWeight: 800,
                transition: motionOff ? "none" : "border-color 420ms ease, color 420ms ease, background-color 420ms ease",
              }}
            >
              {beat >= 1 ? row[2] : ""}
            </span>
            <span style={{ color: PALETTE.muted }}>{row[3]}</span>
            <span
              style={{
                color: beat >= 1 ? PALETTE.green : PALETTE.muted,
                fontWeight: 760,
                ...revealStyle(beat >= 1, motionOff, "0.20cqh"),
              }}
            >
              {language === "zh" ? "已签收" : "Signed"}
            </span>
          </div>
        ))}
      </div>
    </LedgerShell>
  );
}

function SignoffScene({ scene, beat, motionOff, language }: { scene: SceneText; beat: number; motionOff: boolean; language: Lang }) {
  const rows = FINAL_ROWS[language];

  return (
    <LedgerShell scene={scene} sceneBeat={beat} motionOff={motionOff} language={language}>
      <div
        style={{
          height: "100%",
          display: "grid",
          gridTemplateColumns: "54% 46%",
          gap: "2.2cqw",
        }}
      >
        <div
          data-beat-layout-item="true"
          style={{
            border: `0.14cqw solid ${PALETTE.ruleStrong}`,
            backgroundColor: "rgba(255, 250, 240, 0.82)",
            display: "grid",
            gridTemplateRows: "repeat(4, 25%)",
          }}
        >
          {rows.map((row, index) => (
            <div
              key={row[0]}
              style={{
                display: "grid",
                gridTemplateColumns: "42% 58%",
                alignItems: "center",
                padding: "0 1.3cqw",
                borderBottom: index === rows.length - 1 ? "0" : `0.08cqh solid ${PALETTE.rule}`,
                backgroundColor: index === rows.length - 1 && beat >= 1 ? PALETTE.greenSoft : "transparent",
                transition: motionOff ? "none" : "background-color 420ms ease",
                ...revealStyle(index < 3 || beat >= 1, motionOff, "0.35cqh"),
              }}
            >
              <strong style={{ fontSize: "1.14cqw", color: PALETTE.muted, fontWeight: 720 }}>{row[0]}</strong>
              <span style={{ fontSize: "1.42cqw", color: index === rows.length - 1 ? PALETTE.green : PALETTE.ink, fontWeight: 760 }}>
                {row[1]}
              </span>
            </div>
          ))}
        </div>
        <div
          data-beat-layout-item="true"
          style={{
            position: "relative",
            display: "grid",
            gridTemplateRows: "34% 34% 32%",
            borderLeft: `0.10cqw solid ${PALETTE.ruleStrong}`,
            paddingLeft: "2.2cqw",
          }}
        >
          <div
            style={{
              color: PALETTE.muted,
              fontSize: "1.15cqw",
              lineHeight: 1.32,
              borderTop: `0.09cqh solid ${PALETTE.rule}`,
              paddingTop: "1.0cqh",
            }}
          >
            {scene.beats[0].body}
          </div>
          <div
            style={{
              justifySelf: "center",
              alignSelf: "center",
              width: "17cqw",
              height: "17cqw",
              border: `0.36cqw double ${beat >= 1 ? PALETTE.green : PALETTE.ruleStrong}`,
              borderRadius: "50%",
              display: "grid",
              placeItems: "center",
              color: beat >= 1 ? PALETTE.green : PALETTE.ruleStrong,
              fontSize: "1.35cqw",
              fontWeight: 840,
              textAlign: "center",
              transform: beat >= 1 ? "rotate(-7deg)" : "rotate(0)",
              transition: motionOff ? "none" : "transform 420ms ease, color 420ms ease, border-color 420ms ease",
            }}
          >
            {language === "zh" ? "批准上线" : "APPROVED TO LAUNCH"}
          </div>
          <p
            style={{
              margin: "0",
              alignSelf: "end",
              color: PALETTE.muted,
              fontSize: "1.18cqw",
              lineHeight: 1.28,
              ...revealStyle(beat >= 1, motionOff, "0.45cqh"),
            }}
          >
            {scene.beats[1].body}
          </p>
        </div>
      </div>
    </LedgerShell>
  );
}

function ScenePanel({
  sceneId,
  beat,
  language,
  isThumbnail,
  reducedMotion,
}: {
  sceneId: SceneId;
  beat: number;
  language: Lang;
  isThumbnail: boolean;
  reducedMotion: boolean;
}) {
  const scene = getScene(language, sceneId);
  const sceneBeat = clampBeat(beat, sceneId);
  const motionOff = reducedMotion || isThumbnail;

  if (sceneId === 1) {
    return <CoverScene scene={scene} beat={sceneBeat} motionOff={motionOff} language={language} />;
  }
  if (sceneId === 2) {
    return <ChecklistScene scene={scene} beat={sceneBeat} motionOff={motionOff} language={language} />;
  }
  if (sceneId === 3) {
    return <ExceptionsScene scene={scene} beat={sceneBeat} motionOff={motionOff} language={language} />;
  }
  if (sceneId === 4) {
    return <OwnersScene scene={scene} beat={sceneBeat} motionOff={motionOff} language={language} />;
  }
  return <SignoffScene scene={scene} beat={sceneBeat} motionOff={motionOff} language={language} />;
}

export function getMetadata(lang: Lang): StyleMetadata {
  return {
    id: "46",
    band: "text-report",
    name: CONTENT[lang].styleName,
    theme: CONTENT[lang].theme,
    densityLabel: CONTENT[lang].density,
    heroScene: 2,
    colors: {
      bg: PALETTE.bg,
      ink: PALETTE.ink,
      panel: PALETTE.paper,
    },
    typography: {
      header: "Aptos 760",
      body: "Aptos 430",
    },
    tags: ["ledger", "checklist", "audit", "launch", "signoff", "text-report"],
    fonts: ["Aptos", "Inter", "cjk:Noto Sans SC"],
    scenes: sceneMetadata(lang),
  };
}

export default function LaunchGateLedgerV2({
  scene,
  beat,
  language,
  isThumbnail,
  reducedMotion,
  onNavigate,
}: BespokeStyleProps) {
  const activeScene = SCENE_IDS.includes(scene as SceneId) ? (scene as SceneId) : 1;

  return (
    <div style={rootStyle}>
      <SpatialSceneTrack
        scene={activeScene}
        beat={beat}
        sceneIds={SCENE_IDS}
        transitionKind="fade"
        transitionMap={TRANSITION_MAP}
        transitionDurationMs={620}
        reducedMotion={reducedMotion || isThumbnail}
        beatLayoutModes={BEAT_LAYOUT_MODES}
        renderScene={(sceneId, sceneBeat) => (
          <ScenePanel
            sceneId={sceneId as SceneId}
            beat={sceneBeat}
            language={language}
            isThumbnail={isThumbnail}
            reducedMotion={reducedMotion}
          />
        )}
      />
      <LedgerRail scene={activeScene} language={language} onNavigate={onNavigate} isThumbnail={isThumbnail} />
    </div>
  );
}

export const launchGateLedgerV2Version = defineStyleVersion({
  id: "v2",
  topic: "Launch Gate Ledger",
  model: "GPT-5",
  component: LaunchGateLedgerV2,
  getMetadata,
});

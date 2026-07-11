import type { CSSProperties, ReactNode } from "react";
import {
  defineTopic,
  type TopicDefinition,
  type TopicMetadata,
  type TopicStageProps,
} from "../domain/topic";
import SpatialSceneTrack from "../styles/SpatialSceneTrack";
import type { SceneTransitionMap } from "../styles/SpatialSceneTrack";
import styles from "./close-the-quarter.module.css";

type Lang = "en" | "zh";

interface LedgerItem {
  ref: string;
  label: string;
}

interface ExceptionItem {
  label: string;
  note: string;
  owner: string;
}

interface CopyShape {
  eyebrow: string;
  headTitle: string;
  reconciledLabel: string;
  sceneTitles: string[];
  colRef: string;
  colItem: string;
  colStatus: string;
  posted: string;
  reconciled: string;
  items: LedgerItem[];
  caption1: string;
  caption2: string;
  caption3: string;
  exHead: string;
  exContext: string;
  exceptions: ExceptionItem[];
  ownerPrefix: string;
  pillPending: string;
  pillSigned: string;
  closeStats: { label: string; value: string }[];
  stampWord: string;
  stampDate: string;
  meterLabel: string;
}

const COPY: { en: CopyShape; zh: CopyShape } = {
  en: {
    eyebrow: "FISCAL 2026 · Q3",
    headTitle: "Quarter-End Close Ledger",
    reconciledLabel: "Reconciled",
    sceneTitles: [
      "The Ledger",
      "The Books",
      "Reconciling",
      "The Exceptions",
      "Closed",
    ],
    colRef: "Ref",
    colItem: "Line Item",
    colStatus: "Status",
    posted: "Posted",
    reconciled: "Reconciled",
    items: [
      { ref: "GL-100", label: "Bank reconciliations" },
      { ref: "AR-210", label: "Accounts receivable" },
      { ref: "AP-320", label: "Accounts payable" },
      { ref: "AC-430", label: "Accruals & prepayments" },
      { ref: "RV-540", label: "Revenue recognition" },
      { ref: "IC-650", label: "Intercompany balances" },
    ],
    caption1: "The period ledger opens — every line accounted for before close.",
    caption2: "Balances are posted into the ledger, aligned and awaiting review.",
    caption3: "Each line is verified and marked reconciled, one after another.",
    exHead: "Outstanding Exceptions",
    exContext:
      "Two items fell outside tolerance and require a controller signature before close.",
    exceptions: [
      {
        label: "Deferred revenue timing",
        note: "Reclass pending controller review.",
        owner: "J. Mercer",
      },
      {
        label: "FX revaluation gap",
        note: "Rate confirmed, adjusting entry posted.",
        owner: "L. Ng",
      },
    ],
    ownerPrefix: "Owner",
    pillPending: "Awaiting sign-off",
    pillSigned: "Signed",
    closeStats: [
      { label: "Line items closed", value: "6 / 6" },
      { label: "Exceptions cleared", value: "2 / 2" },
      { label: "Unreconciled variance", value: "0.0%" },
    ],
    stampWord: "CLOSED",
    stampDate: "30 Sep 2026 · Controller signed",
    meterLabel: "Close Readiness",
  },
  zh: {
    eyebrow: "2026 财年 · 第三季度",
    headTitle: "季末结账台账",
    reconciledLabel: "已核对",
    sceneTitles: ["台账", "入账", "对账核对", "例外事项", "结账完成"],
    colRef: "编号",
    colItem: "结账科目",
    colStatus: "状态",
    posted: "已入账",
    reconciled: "已核对",
    items: [
      { ref: "GL-100", label: "银行对账" },
      { ref: "AR-210", label: "应收账款" },
      { ref: "AP-320", label: "应付账款" },
      { ref: "AC-430", label: "计提与预付" },
      { ref: "RV-540", label: "收入确认" },
      { ref: "IC-650", label: "内部往来" },
    ],
    caption1: "本期台账开立——结账前逐项列明，无一遗漏。",
    caption2: "各科目余额已入账，对齐排列，等待复核。",
    caption3: "逐条核验并标记为已核对，一项接一项。",
    exHead: "未决例外",
    exContext: "两项超出容差，须经管控签核后方可结账。",
    exceptions: [
      {
        label: "递延收入时点",
        note: "重分类待管控复核。",
        owner: "孟杰",
      },
      {
        label: "汇兑重估差异",
        note: "汇率已确认，调整分录已入账。",
        owner: "吴琳",
      },
    ],
    ownerPrefix: "负责人",
    pillPending: "待签核",
    pillSigned: "已签核",
    closeStats: [
      { label: "已结科目", value: "6 / 6" },
      { label: "例外清理", value: "2 / 2" },
      { label: "未核对差异", value: "0.0%" },
    ],
    stampWord: "已结账",
    stampDate: "2026年9月30日 · 管控已签核",
    meterLabel: "结账就绪度",
  },
};

const TRANSITION_SCORE = {
  "1->2": "slide-y",
  "2->3": "slide-y",
  "3->4": "fade",
  "4->5": "hard-cut",
} as const satisfies TopicDefinition["transitionScore"];

const TRANSITIONS: SceneTransitionMap = TRANSITION_SCORE;

const TOPIC_NAVIGATION = {
  geometry: "edge-scale",
  carrier: "quarter-close-meter",
  invocation: "gesture-hold",
  feedback: "active-glow",
} as const satisfies TopicDefinition["navigation"];

const BEAT_LAYOUT_MODES = {
  2: "reserved",
  3: "reserved",
  4: "reserved",
  5: "reserved",
} as const;

const TOTAL_ITEMS = 6;

function visibleCountScene2(beat: number): number {
  return beat <= 0 ? 3 : TOTAL_ITEMS;
}

function checkedCountScene3(beat: number): number {
  return [2, 4, 6][Math.min(beat, 2)];
}

function reconciledFor(scene: number, beat: number): number {
  if (scene < 3) return 0;
  if (scene === 3) return checkedCountScene3(beat);
  return TOTAL_ITEMS;
}

/* ── Header (formal, consistent ledger identity) ── */
function Header({
  copy,
  scene,
  reconciled,
}: {
  copy: CopyShape;
  scene: number;
  reconciled: number;
}): ReactNode {
  return (
    <div>
      <div className={styles.header}>
        <div className={styles.headLeft}>
          <span className={styles.eyebrow}>
            {copy.eyebrow} · {copy.sceneTitles[scene - 1]}
          </span>
          <h1 className={styles.title}>{copy.headTitle}</h1>
        </div>
        <div className={styles.headRight}>
          <span className={styles.tallyLabel}>{copy.reconciledLabel}</span>
          <span className={styles.tallyValue}>
            {reconciled} / {TOTAL_ITEMS}
          </span>
        </div>
      </div>
      <div className={styles.headRule} />
      <div className={styles.subRule} />
    </div>
  );
}

/* ── Ledger table shared by scenes 1-3 ── */
function LedgerTable({
  copy,
  scene,
  beat,
}: {
  copy: CopyShape;
  scene: number;
  beat: number;
}): ReactNode {
  const visibleCount = scene === 2 ? visibleCountScene2(beat) : TOTAL_ITEMS;
  const checkedCount = scene === 3 ? checkedCountScene3(beat) : 0;
  const isBeatContainer = scene === 2 || scene === 3;

  return (
    <>
      <div className={styles.colHead}>
        <span>{copy.colRef}</span>
        <span>{copy.colItem}</span>
        <span className={styles.colHeadStatus}>{copy.colStatus}</span>
      </div>
      <div
        className={styles.table}
        data-beat-layout-container={isBeatContainer ? "true" : undefined}
        data-beat-layout-mode={isBeatContainer ? "reserved" : undefined}
      >
        {copy.items.map((item, i) => {
          const labelVisible = scene === 1 ? false : i < visibleCount;
          const checked = scene === 3 && i < checkedCount;
          const showStatusWord = scene !== 1 && labelVisible;
          const statusText = checked ? copy.reconciled : copy.posted;
          return (
            <div
              key={item.ref}
              className={styles.row}
              data-beat-layout-item={isBeatContainer ? "true" : undefined}
            >
              <span className={styles.rowNum}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <div
                className={styles.itemCell}
                style={{ opacity: labelVisible ? 1 : 0 }}
              >
                <span className={styles.refChip}>{item.ref}</span>
                <span className={styles.itemLabel}>{item.label}</span>
              </div>
              <div className={styles.statusCell}>
                <span className={styles.markSlot}>
                  <span
                    className={styles.box}
                    style={{ opacity: checked ? 0 : labelVisible ? 1 : 0.5 }}
                  />
                  <span
                    className={styles.check}
                    style={{
                      opacity: checked ? 1 : 0,
                      transform: checked ? "scale(1)" : "scale(0.6)",
                    }}
                  >
                    ✓
                  </span>
                </span>
                <span
                  className={`${styles.statusWord} ${
                    checked ? styles.statusWordDone : styles.statusWordPosted
                  }`}
                  style={{ opacity: showStatusWord ? 1 : 0 }}
                >
                  {statusText}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

/* ── Scene 4 · exceptions awaiting sign-off ── */
function ExceptionsScene({
  copy,
  beat,
}: {
  copy: CopyShape;
  beat: number;
}): ReactNode {
  const signedCount = beat; // 0 → none, 1 → first, 2 → both
  return (
    <>
      <div className={styles.exHead}>{copy.exHead}</div>
      <p className={styles.contextLine}>{copy.exContext}</p>
      <div
        className={styles.exList}
        data-beat-layout-container="true"
        data-beat-layout-mode="reserved"
      >
        {copy.exceptions.map((ex, i) => {
          const signed = i < signedCount;
          return (
            <div
              key={ex.label}
              className={`${styles.exRow} ${signed ? styles.exRowSigned : ""}`}
              data-beat-layout-item="true"
            >
              <div className={styles.exMain}>
                <div className={styles.exTitleLine}>
                  <span className={styles.rowNum}>E{i + 1}</span>
                  <span className={styles.exLabel}>{ex.label}</span>
                </div>
                <span className={styles.exNote}>{ex.note}</span>
              </div>
              <div className={styles.exSign}>
                <span
                  className={`${styles.pill} ${
                    signed ? styles.pillSigned : styles.pillPending
                  }`}
                >
                  {signed ? copy.pillSigned : copy.pillPending}
                </span>
                <span className={styles.exOwner}>
                  {copy.ownerPrefix} · {ex.owner}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

/* ── Scene 5 · closed readiness total ── */
function ClosedScene({
  copy,
  beat,
}: {
  copy: CopyShape;
  beat: number;
}): ReactNode {
  const resolved = beat >= 1;
  const stampStyle: CSSProperties = {
    opacity: resolved ? 1 : 0.16,
    transform: resolved ? "scale(1)" : "scale(0.94)",
  };
  return (
    <div
      className={styles.closeGrid}
      data-beat-layout-container="true"
      data-beat-layout-mode="reserved"
    >
      <div className={styles.statList} data-beat-layout-item="true">
        {copy.closeStats.map((s) => (
          <div key={s.label} className={styles.statRow}>
            <span className={styles.statLabel}>{s.label}</span>
            <span className={styles.statValue}>{s.value}</span>
          </div>
        ))}
      </div>
      <div
        className={styles.stampBox}
        style={stampStyle}
        data-beat-layout-item="true"
      >
        <span className={styles.stampWord}>{copy.stampWord}</span>
        <span className={styles.stampDate}>{copy.stampDate}</span>
      </div>
    </div>
  );
}

/* ── One scene panel ── */
function SceneContent({
  scene,
  beat,
  copy,
}: {
  scene: number;
  beat: number;
  copy: CopyShape;
}): ReactNode {
  const reconciled = reconciledFor(scene, beat);
  return (
    <div className={styles.scene}>
      <Header copy={copy} scene={scene} reconciled={reconciled} />
      {scene <= 3 && <LedgerTable copy={copy} scene={scene} beat={beat} />}
      {scene <= 3 && (
        <p className={styles.caption}>
          {scene === 1 ? copy.caption1 : scene === 2 ? copy.caption2 : copy.caption3}
        </p>
      )}
      {scene === 4 && <ExceptionsScene copy={copy} beat={beat} />}
      {scene === 5 && <ClosedScene copy={copy} beat={beat} />}
    </div>
  );
}

/* ── N2 · bottom completeness meter (dots) ── */
function CompletenessMeter({
  copy,
  scene,
  reconciled,
  onNavigate,
}: {
  copy: CopyShape;
  scene: number;
  reconciled: number;
  onNavigate?: (scene: number, beat: number) => void;
}): ReactNode {
  return (
    <div
      data-topic-navigation="true"
      data-navigation-geometry={TOPIC_NAVIGATION.geometry}
      data-navigation-carrier={TOPIC_NAVIGATION.carrier}
      data-navigation-invocation={TOPIC_NAVIGATION.invocation}
      data-navigation-feedback={TOPIC_NAVIGATION.feedback}
      className={styles.meter}
    >
      <span className={styles.meterLabel}>{copy.meterLabel}</span>
      <div className={styles.dots}>
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            className={styles.dot}
            data-filled={n <= scene ? "true" : "false"}
            data-current={n === scene ? "true" : "false"}
            aria-label={copy.sceneTitles[n - 1]}
            onClick={(e) => {
              e.stopPropagation();
              onNavigate?.(n, 0);
            }}
          />
        ))}
      </div>
      <span className={styles.meterFrac}>
        {reconciled} / {TOTAL_ITEMS}
      </span>
    </div>
  );
}

function TopicStage({
  scene,
  beat,
  language,
  isThumbnail,
  reducedMotion,
  onNavigate,
}: TopicStageProps): ReactNode {
  const copy = COPY[language];
  const calm = reducedMotion || isThumbnail;

  return (
    <div className={styles.root} data-reduced-motion={calm ? "true" : undefined}>
      <SpatialSceneTrack
        scene={scene}
        beat={beat}
        transitionKind="slide-y"
        transitionMap={TRANSITIONS}
        reducedMotion={calm}
        beatLayoutModes={BEAT_LAYOUT_MODES}
        renderScene={(sceneId, sceneBeat) => (
          <SceneContent scene={sceneId} beat={sceneBeat} copy={copy} />
        )}
      />
      {!isThumbnail && (
        <CompletenessMeter
          copy={copy}
          scene={scene}
          reconciled={reconciledFor(scene, beat)}
          onNavigate={onNavigate}
        />
      )}
    </div>
  );
}

function buildMetadata(lang: Lang): TopicMetadata {
  const t = lang === "en"
    ? {
        theme: "Close the Quarter",
        density: "Reading-First",
        scenes: [
          {
            title: "The Ledger",
            beats: [
              {
                action: "Open the period ledger",
                title: "Quarter-end close",
                body: "A formal header over ruled, empty rows — the record before a single line is written.",
              },
            ],
          },
          {
            title: "The Books",
            beats: [
              {
                action: "Post the first balances",
                title: "Balances entered",
                body: "The opening line items are posted into aligned ledger rows.",
              },
              {
                action: "Complete the postings",
                title: "Books populated",
                body: "Every line item is entered and squared into orderly rows.",
              },
            ],
          },
          {
            title: "Reconciling",
            beats: [
              {
                action: "Reconcile the first lines",
                title: "First checks",
                body: "The opening items are verified and marked reconciled.",
              },
              {
                action: "Continue down the list",
                title: "Halfway checked",
                body: "Reconciliation proceeds line by line, each with a clear check.",
              },
              {
                action: "Confirm the remainder",
                title: "All reconciled",
                body: "Every line item carries a confirming check.",
              },
            ],
          },
          {
            title: "The Exceptions",
            beats: [
              {
                action: "Flag the exceptions",
                title: "Two items pending",
                body: "Two lines fell outside tolerance and await a controller signature.",
              },
              {
                action: "Sign off the first",
                title: "First cleared",
                body: "The deferred-revenue reclass is reviewed and signed.",
              },
              {
                action: "Sign off the second",
                title: "Both cleared",
                body: "The FX revaluation entry is confirmed and both exceptions are signed.",
              },
            ],
          },
          {
            title: "Closed",
            beats: [
              {
                action: "Total the ledger",
                title: "Readiness totalled",
                body: "Line items closed, exceptions cleared, variance at zero.",
              },
              {
                action: "Stamp the close",
                title: "Quarter closed",
                body: "The ledger resolves to a signed, closed state.",
              },
            ],
          },
        ],
      }
    : {
        theme: "季度结账",
        density: "阅读优先",
        scenes: [
          {
            title: "台账",
            beats: [
              {
                action: "开立本期台账",
                title: "季末结账",
                body: "正式表头之下是划好线的空行——落笔之前的账册原貌。",
              },
            ],
          },
          {
            title: "入账",
            beats: [
              {
                action: "登记首批余额",
                title: "余额录入",
                body: "首批科目余额被登入对齐的台账行中。",
              },
              {
                action: "完成全部登记",
                title: "入账完成",
                body: "每一科目均已录入并规整排列。",
              },
            ],
          },
          {
            title: "对账核对",
            beats: [
              {
                action: "核对首批科目",
                title: "首批勾稽",
                body: "开头几项经核验后标记为已核对。",
              },
              {
                action: "沿清单继续",
                title: "过半核对",
                body: "核对逐条推进，每项都有清晰的勾选。",
              },
              {
                action: "确认其余各项",
                title: "全部已核对",
                body: "每一科目都带有确认勾选。",
              },
            ],
          },
          {
            title: "例外事项",
            beats: [
              {
                action: "标记例外事项",
                title: "两项待决",
                body: "两项超出容差，等待管控签核。",
              },
              {
                action: "签核第一项",
                title: "首项清理",
                body: "递延收入重分类经复核后签核。",
              },
              {
                action: "签核第二项",
                title: "两项清理",
                body: "汇兑重估分录确认，两项例外均已签核。",
              },
            ],
          },
          {
            title: "结账完成",
            beats: [
              {
                action: "汇总台账",
                title: "就绪度汇总",
                body: "科目已结、例外清理、差异归零。",
              },
              {
                action: "加盖结账",
                title: "季度结账",
                body: "台账收束为已签核的结账状态。",
              },
            ],
          },
        ],
      };

  return {
    theme: t.theme,
    densityLabel: t.density,
    heroScene: 3,
    colors: { bg: "#f5f3ea", ink: "#2c2a22", panel: "#3f7d55" },
    typography: { header: "IBM Plex Serif", body: "IBM Plex Sans" },
    tags: [
      "trustworthy",
      "restrained",
      "diligent",
      "reading-first",
      "light",
      "ledger-green",
      "calm-motion",
      lang === "en" ? "checklist" : "检查清单",
    ],
    fonts: [
      "IBM Plex Sans:wght@400;500;600",
      "IBM Plex Serif:ital,wght@0,400;0,500;0,600;1,400",
      "cjk:Noto Serif SC:wght@500;600",
      "cjk:Noto Sans SC:wght@400;500",
    ],
    scenes: t.scenes.map((s, i) => ({
      id: i + 1,
      title: s.title,
      beats: s.beats.map((b, j) => ({
        id: j,
        action: b.action,
        title: b.title,
        body: b.body,
      })),
    })),
  };
}

const METADATA = {
  en: buildMetadata("en"),
  zh: buildMetadata("zh"),
} satisfies TopicDefinition["metadata"];

export default defineTopic({
  id: "close-the-quarter",
  styleId: "checklist-ledger",
  title: { en: "Close the Quarter", zh: "季度结账" },
  modelId: "Claude Opus 4.8",
  Stage: TopicStage,
  metadata: METADATA,
  navigation: TOPIC_NAVIGATION,
  transitionScore: TRANSITION_SCORE,
  evidence: {
    kind: "illustrative",
    boundary: {
      en: "Illustrative scenario: names, figures, and outcomes are presentation examples, not external factual claims.",
      zh: "示例场景：其中名称、数字和结果均为演示内容，并非外部事实主张。",
    },
    display: "envelope",
  },
});

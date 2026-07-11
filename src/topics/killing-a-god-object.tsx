import type { CSSProperties, ReactNode } from "react";
import {
  defineTopic,
  type TopicDefinition,
  type TopicMetadata,
  type TopicStageProps,
} from "../domain/topic";
import SpatialSceneTrack from "../styles/SpatialSceneTrack";
import type { SceneTransitionMap } from "../styles/SpatialSceneTrack";
import { useFLIP } from "../hooks/useFLIP";

/* ────────────────────────────────────────────────────────────────────────
   Annotated Source & Diff · Killing a God Object
   A reviewer's surface: clean light ground, monospaced source, soft git-red
   removal + git-green addition tones as the only strong color, readable
   annotations. Motion proves the transformation: before resolves into after.
   ──────────────────────────────────────────────────────────────────────── */

type Lang = "en" | "zh";

const MONO = '"JetBrains Mono", "Fira Code", ui-monospace, monospace';
const sansFor = (lang: Lang): string =>
  lang === "zh"
    ? '"Noto Sans SC", "Inter", system-ui, sans-serif'
    : '"Inter", system-ui, sans-serif';

const C = {
  ground: "#eceff3",
  panel: "#ffffff",
  edge: "rgba(31,35,40,0.12)",
  ink: "#1f2328",
  inkSoft: "#57606a",
  inkFaint: "#8c959f",
  gutter: "#aeb6bf",
  markBg: "rgba(31,35,40,0.055)",
  delBg: "rgba(255,129,130,0.22)",
  delEdge: "#cf222e",
  delInk: "#82071e",
  addBg: "rgba(74,194,107,0.24)",
  addEdge: "#1a7f37",
  addInk: "#116329",
};

/* Language-neutral code — code is code. */
const SOURCE_LINES: string[] = [
  "// src/order/OrderManager.ts",
  'import { Order, Card, User } from "./types";',
  "",
  "export class OrderManager {",
  "  validate(order: Order): boolean { … }",
  "  charge(card: Card, amount: number) { … }",
  "  reserveStock(sku: string, qty: number) { … }",
  "  releaseStock(sku: string) { … }",
  "  notifyUser(user: User) { … }",
  "  sendReceipt(user: User) { … }",
  "  refund(orderId: string) { … }",
  "  writeAudit(event: Event) { … }",
  "  retryPayment(card: Card) { … }",
  "}",
];

interface DiffLine {
  s: " " | "+" | "-";
  k: "ctx" | "add" | "del";
  t: string;
}
const DIFF_LINES: DiffLine[] = [
  { s: " ", k: "ctx", t: 'import { Order, Card, User } from "./types";' },
  { s: "+", k: "add", t: 'import { OrderValidator } from "./OrderValidator";' },
  { s: "+", k: "add", t: 'import { PaymentGateway } from "./PaymentGateway";' },
  { s: "+", k: "add", t: 'import { InventoryStore } from "./InventoryStore";' },
  { s: " ", k: "ctx", t: "" },
  { s: " ", k: "ctx", t: "export class OrderManager {" },
  { s: "-", k: "del", t: "  validate(order: Order): boolean { … }" },
  { s: "-", k: "del", t: "  charge(card: Card, amount: number) { … }" },
  { s: "-", k: "del", t: "  reserveStock(sku: string, qty: number) { … }" },
  { s: "-", k: "del", t: "  notifyUser(user: User) { … }" },
  { s: "+", k: "add", t: "  constructor(" },
  { s: "+", k: "add", t: "    private validator: OrderValidator," },
  { s: "+", k: "add", t: "    private payments: PaymentGateway," },
  { s: "+", k: "add", t: "    private stock: InventoryStore," },
  { s: "+", k: "add", t: "  ) {}" },
  { s: " ", k: "ctx", t: "}" },
];

const MODULES = [
  {
    name: "OrderValidator",
    file: "OrderValidator.ts",
    methods: "validate()",
    lines: 120,
    snippet: ["export class OrderValidator {", "  validate(o: Order) {", "    return checks(o);", "  }", "}"],
  },
  {
    name: "PaymentGateway",
    file: "PaymentGateway.ts",
    methods: "charge · refund",
    lines: 180,
    snippet: ["export class PaymentGateway {", "  charge(c: Card, n: number) {…}", "  refund(id: string) {…}", "}"],
  },
  {
    name: "InventoryStore",
    file: "InventoryStore.ts",
    methods: "reserve · release",
    lines: 140,
    snippet: ["export class InventoryStore {", "  reserve(sku, qty) {…}", "  release(sku) {…}", "}"],
  },
];

const COPY = {
  en: {
    langBadge: "TypeScript",
    s1: { kicker: "01 · source", title: "The file", note: "One class. Every responsibility." },
    s2: {
      kicker: "02 · review",
      title: "The problem",
      c1label: "GOD OBJECT",
      c1: "OrderManager owns validation, payment, stock, and notifications — all at once.",
      c1ref: "L4–L13",
      c2label: "COST",
      c2: "1,240 lines · 9 collaborators · every feature has to edit it.",
      c2ref: "blast radius",
    },
    s3: {
      kicker: "03 · diff",
      title: "The diff",
      strip: "unified diff",
      caption: "Four methods removed; the class now takes three injected dependencies.",
    },
    s4: { kicker: "04 · refactor", title: "The split", note: "One class becomes three focused modules." },
    s5: {
      kicker: "05 · result",
      title: "After",
      stamp: "MERGED",
      note: "Three clean modules, each with one job.",
      mLabels: ["Largest file", "Cyclomatic", "Coverage"],
      mVals: ["1,240 → 180 lines", "47 → 9", "12% → 88%"],
    },
    modRole: ["Validation", "Payment", "Inventory"],
    modTag: ["pure", "isolated", "testable"],
    navEnds: ["before", "after"],
    navStops: ["file", "problem", "diff", "split", "after"],
    acts: {
      s1: ["Open the source"],
      s2: ["Circle the class", "Count the cost"],
      s3: ["Strike the methods", "Tint the additions", "Read the summary"],
      s4: ["Hold the monolith", "Break into three"],
      s5: ["See the modules", "Check the metrics", "Mark it done"],
    },
  },
  zh: {
    langBadge: "TypeScript",
    s1: { kicker: "01 · 源码", title: "这个文件", note: "一个类，包揽了所有职责。" },
    s2: {
      kicker: "02 · 评审",
      title: "问题所在",
      c1label: "巨型类",
      c1: "OrderManager 同时管着校验、支付、库存和通知，全塞在一起。",
      c1ref: "L4–L13",
      c2label: "代价",
      c2: "1,240 行 · 9 个协作者 · 每个需求都得改它。",
      c2ref: "影响面",
    },
    s3: {
      kicker: "03 · 差异",
      title: "差异",
      strip: "统一差异",
      caption: "删掉四个方法；这个类改为注入三个依赖。",
    },
    s4: { kicker: "04 · 重构", title: "拆分", note: "一个类拆成三个各司其职的模块。" },
    s5: {
      kicker: "05 · 结果",
      title: "拆分之后",
      stamp: "已合并",
      note: "三个干净的模块，各做一件事。",
      mLabels: ["最大文件", "圈复杂度", "测试覆盖"],
      mVals: ["1,240 → 180 行", "47 → 9", "12% → 88%"],
    },
    modRole: ["校验", "支付", "库存"],
    modTag: ["无副作用", "相互隔离", "可测试"],
    navEnds: ["改前", "改后"],
    navStops: ["文件", "问题", "差异", "拆分", "之后"],
    acts: {
      s1: ["打开源码"],
      s2: ["圈出这个类", "算清代价"],
      s3: ["划掉方法", "标出新增", "读懂汇总"],
      s4: ["锁定巨类", "拆成三份"],
      s5: ["看清模块", "核对指标", "标记完成"],
    },
  },
};

/* ── shared frame ───────────────────────────────────────────────────────── */
interface FrameProps {
  language: Lang;
  kicker: string;
  title: string;
  rightNode?: ReactNode;
  children: ReactNode;
}
function SceneFrame({ language, kicker, title, rightNode, children }: FrameProps) {
  const sans = sansFor(language);
  return (
    <div
      style={{
        position: "absolute",
        inset: "0",
        boxSizing: "border-box",
        padding: "5.5cqh 5cqw 10.5cqh 5cqw",
        display: "flex",
        flexDirection: "column",
        background: C.ground,
        color: C.ink,
      }}
    >
      <header
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          gap: "2cqw",
          flex: "0 0 auto",
          marginBottom: "2.4cqh",
        }}
      >
        <div>
          <div
            style={{
              fontFamily: MONO,
              fontSize: "1.5cqh",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: C.inkFaint,
              marginBottom: "0.7cqh",
            }}
          >
            {kicker}
          </div>
          <h1
            style={{
              margin: 0,
              fontFamily: sans,
              fontSize: "4.7cqh",
              fontWeight: 680,
              letterSpacing: "-0.01em",
              lineHeight: 1,
              color: C.ink,
            }}
          >
            {title}
          </h1>
        </div>
        {rightNode ? <div style={{ flex: "0 0 auto" }}>{rightNode}</div> : null}
      </header>
      <div style={{ flex: "1 1 auto", minHeight: 0, display: "flex", flexDirection: "column" }}>
        {children}
      </div>
    </div>
  );
}

/* ── reusable editor chrome ─────────────────────────────────────────────── */
function EditorStrip({ file, badge, extra }: { file: string; badge: string; extra?: ReactNode }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "1cqw",
        padding: "1.2cqh 1.6cqw",
        borderBottom: `0.1cqw solid ${C.edge}`,
        flex: "0 0 auto",
      }}
    >
      <span style={{ display: "flex", gap: "0.5cqw" }}>
        {["#ff5f57", "#febc2e", "#28c840"].map((d) => (
          <span key={d} style={{ width: "1.1cqh", height: "1.1cqh", borderRadius: "50%", background: d, opacity: 0.75 }} />
        ))}
      </span>
      <span style={{ fontFamily: MONO, fontSize: "1.5cqh", color: C.ink, marginLeft: "0.8cqw" }}>{file}</span>
      <span style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "1cqw" }}>
        {extra}
        <span
          style={{
            fontFamily: MONO,
            fontSize: "1.25cqh",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: C.inkFaint,
          }}
        >
          {badge}
        </span>
      </span>
    </div>
  );
}

const codeRowBase: CSSProperties = {
  display: "flex",
  alignItems: "center",
  height: "2.7cqh",
  fontFamily: MONO,
  fontSize: "1.55cqh",
  lineHeight: 1,
  whiteSpace: "pre",
};
const gutterStyle: CSSProperties = {
  width: "3cqw",
  flex: "0 0 auto",
  textAlign: "right",
  paddingRight: "1cqw",
  color: C.gutter,
  fontSize: "1.35cqh",
  userSelect: "none",
};

/* ── Scene 1 · The file ─────────────────────────────────────────────────── */
function Scene1({ language }: SceneInner) {
  const t = COPY[language];
  const sans = sansFor(language);
  return (
    <SceneFrame
      language={language}
      kicker={t.s1.kicker}
      title={t.s1.title}
      rightNode={
        <span style={{ fontFamily: sans, fontSize: "1.9cqh", color: C.inkSoft, maxWidth: "34cqw", textAlign: "right", display: "block" }}>
          {t.s1.note}
        </span>
      }
    >
      <div
        style={{
          flex: "1 1 auto",
          minHeight: 0,
          display: "flex",
          flexDirection: "column",
          background: C.panel,
          border: `0.1cqw solid ${C.edge}`,
          borderRadius: "1.4cqh",
          overflow: "hidden",
          boxShadow: "0 0.6cqh 2.2cqh rgba(31,35,40,0.06)",
        }}
      >
        <EditorStrip file="OrderManager.ts" badge={t.langBadge} />
        <div style={{ padding: "1.6cqh 1.4cqw", display: "flex", flexDirection: "column", justifyContent: "center", flex: "1 1 auto" }}>
          {SOURCE_LINES.map((ln, i) => (
            <div key={i} style={codeRowBase}>
              <span style={gutterStyle}>{i + 1}</span>
              <span style={{ color: ln.startsWith("//") ? C.inkFaint : C.ink }}>{ln === "" ? " " : ln}</span>
            </div>
          ))}
        </div>
      </div>
    </SceneFrame>
  );
}

/* ── Scene 2 · The problem (2 beats · reserved) ─────────────────────────── */
function Scene2({ language, beat, reducedMotion, isThumbnail }: SceneInner) {
  const t = COPY[language];
  const sans = sansFor(language);
  const motionOn = !(reducedMotion || isThumbnail);
  const vb = motionOn ? beat : 1;
  const trans = motionOn ? "opacity 440ms cubic-bezier(0.16,1,0.3,1), transform 440ms cubic-bezier(0.16,1,0.3,1)" : "none";

  const callout = (active: boolean, label: string, text: string, ref: string): ReactNode => (
    <div
      data-beat-layout-item="true"
      style={{
        background: C.panel,
        border: `0.1cqw solid ${active ? C.edge : "rgba(31,35,40,0.06)"}`,
        borderLeft: `0.4cqw solid ${active ? C.ink : C.inkFaint}`,
        borderRadius: "1cqh",
        padding: "1.6cqh 1.4cqw",
        boxShadow: active ? "0 0.5cqh 1.8cqh rgba(31,35,40,0.07)" : "none",
        opacity: active ? 1 : 0.32,
        transform: active ? "translateY(0)" : "translateY(0.6cqh)",
        transition: trans,
      }}
    >
      <div
        style={{
          fontFamily: MONO,
          fontSize: "1.3cqh",
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: C.inkFaint,
          marginBottom: "0.9cqh",
        }}
      >
        ▸ {label}
      </div>
      <p style={{ margin: 0, fontFamily: sans, fontSize: "1.95cqh", lineHeight: 1.5, color: C.ink }}>{text}</p>
      <div style={{ fontFamily: MONO, fontSize: "1.3cqh", color: C.inkFaint, marginTop: "1cqh" }}>{ref}</div>
    </div>
  );

  return (
    <SceneFrame language={language} kicker={t.s2.kicker} title={t.s2.title}>
      <div style={{ flex: "1 1 auto", minHeight: 0, display: "flex", gap: "3cqw", alignItems: "stretch" }}>
        <div
          style={{
            flex: "1 1 auto",
            minWidth: 0,
            display: "flex",
            flexDirection: "column",
            background: C.panel,
            border: `0.1cqw solid ${C.edge}`,
            borderRadius: "1.4cqh",
            overflow: "hidden",
            boxShadow: "0 0.6cqh 2.2cqh rgba(31,35,40,0.06)",
          }}
        >
          <EditorStrip file="OrderManager.ts" badge={t.langBadge} />
          <div style={{ padding: "1.4cqh 1.2cqw", display: "flex", flexDirection: "column", justifyContent: "center", flex: "1 1 auto" }}>
            {SOURCE_LINES.map((ln, i) => {
              const marked = i >= 3 && i <= 12;
              return (
                <div
                  key={i}
                  style={{
                    ...codeRowBase,
                    background: marked ? C.markBg : "transparent",
                    borderLeft: `0.35cqw solid ${marked ? C.ink : "transparent"}`,
                    paddingLeft: "0.4cqw",
                  }}
                >
                  <span style={gutterStyle}>{i + 1}</span>
                  <span style={{ color: ln.startsWith("//") ? C.inkFaint : C.ink }}>{ln === "" ? " " : ln}</span>
                </div>
              );
            })}
          </div>
        </div>
        <div
          data-beat-layout-container="true"
          data-beat-layout-mode="reserved"
          style={{ flex: "0 0 30cqw", display: "flex", flexDirection: "column", gap: "2.4cqh", justifyContent: "center" }}
        >
          {callout(true, t.s2.c1label, t.s2.c1, t.s2.c1ref)}
          {callout(vb >= 1, t.s2.c2label, t.s2.c2, t.s2.c2ref)}
        </div>
      </div>
    </SceneFrame>
  );
}

/* ── Scene 3 · The diff (3 beats · reserved) ────────────────────────────── */
function Scene3({ language, beat, reducedMotion, isThumbnail }: SceneInner) {
  const t = COPY[language];
  const sans = sansFor(language);
  const motionOn = !(reducedMotion || isThumbnail);
  const vb = motionOn ? beat : 2;
  const addShown = vb >= 1;
  const summaryShown = vb >= 2;
  const trans = motionOn ? "opacity 440ms ease, background-color 440ms ease" : "none";

  const stat = (label: string, color: string, bg: string): ReactNode => (
    <span
      style={{
        fontFamily: MONO,
        fontSize: "1.7cqh",
        fontWeight: 700,
        color,
        background: bg,
        border: `0.1cqw solid ${color}`,
        borderRadius: "0.8cqh",
        padding: "0.5cqh 1cqw",
        opacity: summaryShown ? 1 : 0.22,
        transition: trans,
      }}
    >
      {label}
    </span>
  );

  return (
    <SceneFrame
      language={language}
      kicker={t.s3.kicker}
      title={t.s3.title}
      rightNode={
        <div style={{ display: "flex", gap: "0.8cqw", alignItems: "center" }}>
          {stat("−4", C.delInk, C.delBg)}
          {stat("+8", C.addInk, C.addBg)}
        </div>
      }
    >
      <div
        style={{
          flex: "1 1 auto",
          minHeight: 0,
          display: "flex",
          flexDirection: "column",
          background: C.panel,
          border: `0.1cqw solid ${C.edge}`,
          borderRadius: "1.4cqh",
          overflow: "hidden",
          boxShadow: "0 0.6cqh 2.2cqh rgba(31,35,40,0.06)",
        }}
      >
        <EditorStrip file="OrderManager.ts" badge={t.s3.strip} />
        <div
          data-beat-layout-container="true"
          data-beat-layout-mode="reserved"
          style={{ padding: "1.2cqh 1.2cqw 1.4cqh", display: "flex", flexDirection: "column", justifyContent: "center", flex: "1 1 auto" }}
        >
          {DIFF_LINES.map((dl, i) => {
            const isDel = dl.k === "del";
            const isAdd = dl.k === "add";
            const bg = isDel ? C.delBg : isAdd && addShown ? C.addBg : "transparent";
            const signColor = isDel ? C.delEdge : isAdd ? (addShown ? C.addEdge : C.inkFaint) : "transparent";
            const opacity = isAdd ? (addShown ? 1 : 0.22) : 1;
            return (
              <div
                key={i}
                data-beat-layout-item="true"
                style={{
                  ...codeRowBase,
                  height: "2.55cqh",
                  fontSize: "1.5cqh",
                  background: bg,
                  opacity,
                  transition: trans,
                  borderLeft: `0.35cqw solid ${isDel ? C.delEdge : isAdd && addShown ? C.addEdge : "transparent"}`,
                }}
              >
                <span style={{ ...gutterStyle, width: "2.4cqw", color: signColor, paddingRight: "0.6cqw", fontWeight: 700 }}>{dl.s}</span>
                <span
                  style={{
                    color: isDel ? C.delInk : C.ink,
                    textDecoration: isDel ? "line-through" : "none",
                    textDecorationColor: "rgba(130,7,30,0.5)",
                  }}
                >
                  {dl.t === "" ? " " : dl.t}
                </span>
              </div>
            );
          })}
        </div>
      </div>
      <p
        style={{
          margin: "1.6cqh 0 0",
          fontFamily: sans,
          fontSize: "1.85cqh",
          color: C.inkSoft,
          opacity: summaryShown ? 1 : 0.35,
          transition: trans,
          flex: "0 0 auto",
        }}
      >
        {t.s3.caption}
      </p>
    </SceneFrame>
  );
}

/* ── Scene 4 · The split (2 beats · motion / FLIP) ──────────────────────── */
function Scene4({ language, beat, isActive, reducedMotion, isThumbnail }: SceneInner) {
  const t = COPY[language];
  const sans = sansFor(language);
  const motionOn = !(reducedMotion || isThumbnail);
  const vb = motionOn ? beat : 1;
  const split = vb >= 1;
  const trans = motionOn ? "opacity 440ms ease, background-color 440ms ease, border-color 440ms ease" : "none";

  const { ref } = useFLIP<HTMLDivElement>({
    watch: [beat],
    disabled: reducedMotion || isThumbnail || !isActive,
    duration: 480,
    easing: "cubic-bezier(0.34, 1.56, 0.64, 1)",
    selector: '[data-beat-layout-item="true"]',
  });

  return (
    <SceneFrame
      language={language}
      kicker={t.s4.kicker}
      title={t.s4.title}
      rightNode={
        <span style={{ fontFamily: sans, fontSize: "1.9cqh", color: C.inkSoft, maxWidth: "34cqw", textAlign: "right", display: "block" }}>
          {t.s4.note}
        </span>
      }
    >
      <div style={{ flex: "1 1 auto", minHeight: 0, position: "relative", display: "flex", alignItems: "center" }}>
        {/* monolith label — fades out as it splits */}
        <div
          style={{
            position: "absolute",
            top: "0",
            left: "50%",
            transform: "translateX(-50%)",
            fontFamily: MONO,
            fontSize: "1.7cqh",
            color: C.inkFaint,
            letterSpacing: "0.06em",
            opacity: split ? 0 : 1,
            transition: trans,
          }}
        >
          class OrderManager {"{ … }"}
        </div>
        <div
          ref={ref}
          data-beat-layout-container="true"
          data-beat-layout-mode="motion"
          style={{
            display: "flex",
            flexDirection: split ? "row" : "column",
            gap: split ? "2.6cqw" : "1.6cqh",
            alignItems: "stretch",
            justifyContent: "center",
            width: split ? "100%" : "48cqw",
            margin: "0 auto",
            padding: split ? "0" : "3cqh 2cqw",
            border: `0.2cqw dashed ${split ? "transparent" : C.inkFaint}`,
            borderRadius: "1.6cqh",
            background: split ? "transparent" : "rgba(31,35,40,0.03)",
            transition: trans,
          }}
        >
          {MODULES.map((m, i) => (
            <div
              key={m.name}
              data-beat-layout-item="true"
              style={{
                flex: split ? "1 1 0" : "0 0 auto",
                display: "flex",
                flexDirection: split ? "column" : "row",
                alignItems: split ? "stretch" : "center",
                justifyContent: split ? "flex-start" : "space-between",
                gap: split ? "1.2cqh" : "1.4cqw",
                background: C.panel,
                border: `0.1cqw solid ${split ? C.addEdge : C.edge}`,
                borderTop: split ? `0.5cqw solid ${C.addEdge}` : `0.1cqw solid ${C.edge}`,
                borderRadius: "1.2cqh",
                padding: split ? "1.8cqh 1.4cqw" : "1.4cqh 1.6cqw",
                boxShadow: split ? "0 0.6cqh 2cqh rgba(26,127,55,0.12)" : "0 0.3cqh 1cqh rgba(31,35,40,0.05)",
                minHeight: split ? "40cqh" : "auto",
                transition: trans,
              }}
            >
              <div>
                <div style={{ fontFamily: MONO, fontSize: "1.9cqh", fontWeight: 700, color: C.ink }}>{m.name}</div>
                <div style={{ fontFamily: MONO, fontSize: "1.4cqh", color: C.inkFaint, marginTop: "0.5cqh" }}>{m.methods}</div>
              </div>
              <div
                style={{
                  fontFamily: sans,
                  fontSize: "1.5cqh",
                  fontWeight: 600,
                  color: C.addInk,
                  background: C.addBg,
                  borderRadius: "0.7cqh",
                  padding: "0.4cqh 0.9cqw",
                  alignSelf: split ? "flex-start" : "center",
                }}
              >
                {t.modRole[i]}
              </div>
              {/* annotation — reveals with the split */}
              <div
                style={{
                  marginTop: split ? "auto" : 0,
                  fontFamily: MONO,
                  fontSize: "1.4cqh",
                  color: C.addEdge,
                  opacity: split ? 1 : 0,
                  transition: trans,
                  display: split ? "block" : "none",
                }}
              >
                ✓ {t.modTag[i]}
              </div>
            </div>
          ))}
        </div>
      </div>
    </SceneFrame>
  );
}

/* ── Scene 5 · After (3 beats · reserved) ───────────────────────────────── */
function Scene5({ language, beat, reducedMotion, isThumbnail }: SceneInner) {
  const t = COPY[language];
  const sans = sansFor(language);
  const motionOn = !(reducedMotion || isThumbnail);
  const vb = motionOn ? beat : 2;
  const metricsShown = vb >= 1;
  const doneShown = vb >= 2;
  const trans = motionOn ? "opacity 440ms ease, border-color 440ms ease" : "none";

  return (
    <SceneFrame
      language={language}
      kicker={t.s5.kicker}
      title={t.s5.title}
      rightNode={
        <span style={{ fontFamily: sans, fontSize: "1.9cqh", color: C.inkSoft, maxWidth: "34cqw", textAlign: "right", display: "block" }}>
          {t.s5.note}
        </span>
      }
    >
      <div
        data-beat-layout-container="true"
        data-beat-layout-mode="reserved"
        style={{ flex: "1 1 auto", minHeight: 0, position: "relative", display: "flex", flexDirection: "column", gap: "2.2cqh" }}
      >
        {/* done stamp */}
        <div
          style={{
            position: "absolute",
            top: "-1cqh",
            right: "0",
            fontFamily: MONO,
            fontSize: "1.7cqh",
            fontWeight: 700,
            letterSpacing: "0.1em",
            color: C.addInk,
            background: C.addBg,
            border: `0.15cqw solid ${C.addEdge}`,
            borderRadius: "0.9cqh",
            padding: "0.6cqh 1.2cqw",
            transform: doneShown ? "rotate(-4deg) scale(1)" : "rotate(-4deg) scale(0.9)",
            opacity: doneShown ? 1 : 0,
            transition: motionOn ? "opacity 440ms ease, transform 440ms cubic-bezier(0.34,1.56,0.64,1)" : "none",
            zIndex: 3,
          }}
        >
          ✓ {t.s5.stamp}
        </div>
        {/* module file cards */}
        <div style={{ flex: "1 1 auto", minHeight: 0, display: "flex", gap: "2.6cqw", alignItems: "stretch" }}>
          {MODULES.map((m) => (
            <div
              key={m.file}
              data-beat-layout-item="true"
              style={{
                flex: "1 1 0",
                display: "flex",
                flexDirection: "column",
                background: C.panel,
                border: `0.1cqw solid ${doneShown ? C.addEdge : C.edge}`,
                borderRadius: "1.3cqh",
                overflow: "hidden",
                boxShadow: "0 0.6cqh 2cqh rgba(31,35,40,0.06)",
                transition: trans,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "1.2cqh 1.2cqw",
                  borderBottom: `0.1cqw solid ${C.edge}`,
                  borderTop: `0.5cqw solid ${C.addEdge}`,
                }}
              >
                <span style={{ fontFamily: MONO, fontSize: "1.55cqh", color: C.ink }}>{m.file}</span>
                <span style={{ fontFamily: MONO, fontSize: "1.3cqh", color: C.inkFaint }}>{m.lines} L</span>
              </div>
              <div style={{ padding: "1.4cqh 1.2cqw", display: "flex", flexDirection: "column", justifyContent: "center", flex: "1 1 auto" }}>
                {m.snippet.map((ln, i) => (
                  <div key={i} style={{ ...codeRowBase, height: "2.5cqh", fontSize: "1.4cqh" }}>
                    <span style={{ ...gutterStyle, width: "2cqw", fontSize: "1.2cqh" }}>{i + 1}</span>
                    <span style={{ color: ln.startsWith("export") || ln.trim().startsWith("return") ? C.ink : C.inkSoft }}>{ln}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        {/* metrics row — reserved, revealed at beat 1 */}
        <div
          style={{
            flex: "0 0 auto",
            display: "flex",
            gap: "2.6cqw",
            opacity: metricsShown ? 1 : 0.16,
            transition: trans,
          }}
        >
          {t.s5.mLabels.map((label, i) => (
            <div
              key={label}
              style={{
                flex: "1 1 0",
                display: "flex",
                alignItems: "baseline",
                justifyContent: "space-between",
                gap: "1cqw",
                background: C.panel,
                border: `0.1cqw solid ${C.edge}`,
                borderRadius: "1cqh",
                padding: "1.1cqh 1.4cqw",
              }}
            >
              <span style={{ fontFamily: sans, fontSize: "1.55cqh", color: C.inkSoft }}>{label}</span>
              <span style={{ fontFamily: MONO, fontSize: "1.7cqh", fontWeight: 700, color: C.addInk }}>{t.s5.mVals[i]}</span>
            </div>
          ))}
        </div>
      </div>
    </SceneFrame>
  );
}

/* ── before/after diff toggle nav (N1) ──────────────────────────────────── */
function DiffToggleNav({
  language,
  scene,
  isThumbnail,
  onNavigate,
  motionOn,
}: {
  language: Lang;
  scene: number;
  isThumbnail: boolean;
  onNavigate?: (scene: number, beat: number) => void;
  motionOn: boolean;
}) {
  if (isThumbnail) return null;
  const t = COPY[language];
  const sans = sansFor(language);
  const activeIndex = Math.min(Math.max(scene - 1, 0), 4);
  const label = (s: string): CSSProperties => ({
    fontFamily: MONO,
    fontSize: "1.3cqh",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: s === "on" ? C.addInk : C.inkFaint,
  });

  return (
    <div
      data-topic-navigation="true"
      data-navigation-geometry={TOPIC_NAVIGATION.geometry}
      data-navigation-carrier={TOPIC_NAVIGATION.carrier}
      data-navigation-invocation={TOPIC_NAVIGATION.invocation}
      data-navigation-feedback={TOPIC_NAVIGATION.feedback}
      style={{
        position: "absolute",
        bottom: "3cqh",
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        alignItems: "center",
        gap: "1.4cqw",
        padding: "1cqh 1.6cqw",
        background: "rgba(255,255,255,0.92)",
        border: `0.1cqw solid ${C.edge}`,
        borderRadius: "3cqh",
        boxShadow: "0 0.6cqh 2cqh rgba(31,35,40,0.1)",
        backdropFilter: "blur(0.5cqh)",
        zIndex: 30,
      }}
    >
      <span style={{ fontFamily: sans, fontSize: "1.4cqh", fontWeight: 600, color: C.delInk }}>{t.navEnds[0]}</span>
      <div style={{ position: "relative", display: "flex", width: "32cqw" }}>
        {t.navStops.map((stopLabel, i) => (
          <button
            key={stopLabel}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onNavigate?.(i + 1, 0);
            }}
            style={{
              flex: "1 1 0",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "0.6cqh",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "0.4cqh 0",
              ...label(i === activeIndex ? "on" : "off"),
            }}
          >
            {i === 2 ? <span style={{ fontSize: "1.6cqh" }}>⟷</span> : <span style={{ fontSize: "1.6cqh", opacity: 0.5 }}>·</span>}
            <span>{stopLabel}</span>
          </button>
        ))}
        <span
          style={{
            position: "absolute",
            bottom: "-0.2cqh",
            left: `${activeIndex * 20}%`,
            width: "20%",
            height: "0.4cqh",
            background: C.addEdge,
            borderRadius: "0.2cqh",
            transition: motionOn ? "left 380ms cubic-bezier(0.34,1.56,0.64,1)" : "none",
          }}
        />
      </div>
      <span style={{ fontFamily: sans, fontSize: "1.4cqh", fontWeight: 600, color: C.addInk }}>{t.navEnds[1]}</span>
    </div>
  );
}

/* ── scene routing ──────────────────────────────────────────────────────── */
interface SceneInner {
  beat: number;
  isActive: boolean;
  language: Lang;
  reducedMotion: boolean;
  isThumbnail: boolean;
}

const TRANSITION_SCORE = {
  "1->2": "slide-y",
  "2->3": "slide-y",
  "3->4": "wipe",
  "4->5": "slide-y",
} as const satisfies TopicDefinition["transitionScore"];

const TRANSITIONS: SceneTransitionMap = TRANSITION_SCORE;

const TOPIC_NAVIGATION = {
  geometry: "edge-scale",
  carrier: "god-object-diff-toggle",
  invocation: "keyboard-focus",
  feedback: "typographic-emphasis",
} as const satisfies TopicDefinition["navigation"];

function TopicStage({
  scene,
  beat,
  language,
  isThumbnail,
  reducedMotion,
  onNavigate,
}: TopicStageProps) {
  const motionOn = !(reducedMotion || isThumbnail);

  const renderScene = (sceneId: number, sceneBeat: number, isActive: boolean): ReactNode => {
    const p: SceneInner = { beat: sceneBeat, isActive, language, reducedMotion, isThumbnail };
    switch (sceneId) {
      case 1:
        return <Scene1 {...p} />;
      case 2:
        return <Scene2 {...p} />;
      case 3:
        return <Scene3 {...p} />;
      case 4:
        return <Scene4 {...p} />;
      case 5:
        return <Scene5 {...p} />;
      default:
        return null;
    }
  };

  return (
    <div style={{ position: "relative", width: "100%", height: "100%", background: C.ground, containerType: "size" }}>
      <SpatialSceneTrack
        scene={scene}
        beat={beat}
        transitionKind="slide-y"
        transitionMap={TRANSITIONS}
        reducedMotion={reducedMotion || isThumbnail}
        beatLayoutModes={{ 2: "reserved", 3: "reserved", 4: "motion", 5: "reserved" }}
        renderScene={renderScene}
      />
      <DiffToggleNav
        language={language}
        scene={scene}
        isThumbnail={isThumbnail}
        onNavigate={onNavigate}
        motionOn={motionOn}
      />
    </div>
  );
}

/* ── metadata ───────────────────────────────────────────────────────────── */
function buildMetadata(lang: Lang): TopicMetadata {
  const t = COPY[lang];
  const en = lang === "en";
  return {
    theme: en ? "Killing a God Object" : "拆解巨类",
    densityLabel: en ? "Reading-First" : "重阅读",
    heroScene: 3,
    colors: { bg: C.ground, ink: C.ink, panel: C.panel },
    typography: { header: "Inter", body: "JetBrains Mono" },
    tags: [
      en ? "precise" : "精确",
      en ? "reviewable" : "可评审",
      "diff",
      "before-after",
      "reading-first",
      "light",
      "monospace",
      "refactor",
      "reserved-motion",
    ],
    fonts: [
      "JetBrains Mono:wght@400;500;700",
      "Inter:wght@400;500;600;700",
      "cjk:Noto Sans SC:wght@400;500;700",
    ],
    scenes: [
      {
        id: 1,
        title: t.s1.title,
        beats: [{ id: 0, action: t.acts.s1[0], title: t.s1.title, body: t.s1.note }],
      },
      {
        id: 2,
        title: t.s2.title,
        beats: [
          { id: 0, action: t.acts.s2[0], title: t.s2.c1label, body: t.s2.c1 },
          { id: 1, action: t.acts.s2[1], title: t.s2.c2label, body: t.s2.c2 },
        ],
      },
      {
        id: 3,
        title: t.s3.title,
        beats: [
          {
            id: 0,
            action: t.acts.s3[0],
            title: en ? "Removed" : "删除",
            body: "validate · charge · reserveStock · notifyUser",
          },
          {
            id: 1,
            action: t.acts.s3[1],
            title: en ? "Added" : "新增",
            body: en ? "constructor injects three dependencies" : "构造函数注入三个依赖",
          },
          { id: 2, action: t.acts.s3[2], title: "−4 / +8", body: t.s3.caption },
        ],
      },
      {
        id: 4,
        title: t.s4.title,
        beats: [
          {
            id: 0,
            action: t.acts.s4[0],
            title: "OrderManager",
            body: en ? "validate · charge · reserve · notify …" : "校验 · 支付 · 库存 · 通知 …",
          },
          { id: 1, action: t.acts.s4[1], title: en ? "3 modules" : "三个模块", body: t.s4.note },
        ],
      },
      {
        id: 5,
        title: t.s5.title,
        beats: [
          { id: 0, action: t.acts.s5[0], title: en ? "3 files" : "三个文件", body: t.s5.note },
          {
            id: 1,
            action: t.acts.s5[1],
            title: en ? "Metrics" : "指标",
            body: `${t.s5.mLabels[0]} ${t.s5.mVals[0]}`,
          },
          { id: 2, action: t.acts.s5[2], title: t.s5.stamp, body: en ? "Refactor merged." : "重构已合并。" },
        ],
      },
    ],
  };
}

const METADATA = {
  en: buildMetadata("en"),
  zh: buildMetadata("zh"),
} satisfies TopicDefinition["metadata"];

export default defineTopic({
  id: "killing-a-god-object",
  styleId: "annotated-source-diff",
  title: { en: "Killing a God Object", zh: "拆解巨类" },
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

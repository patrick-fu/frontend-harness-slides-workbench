import type React from "react";
import type { BespokeStyleProps, StyleMetadata } from "../types";
import SpatialSceneTrack, {
  type BeatLayoutMode,
  type SceneTransitionMap,
} from "./SpatialSceneTrack";
import { defineStyleVersion } from "./version";

type Lang = "en" | "zh";
type Tone = "plain" | "muted" | "delete" | "add" | "note";

interface CodeLine {
  n: string;
  mark: " " | "-" | "+" | "!";
  text: string;
  tone: Tone;
  beat?: number;
}

interface BeatCopy {
  id: number;
  action: string;
  title: string;
  body: string;
}

interface AnnotationCopy {
  id: string;
  title: string;
  body: string;
  beat: number;
  tone: Tone;
}

interface SceneCopy {
  id: number;
  nav: string;
  phase: string;
  title: string;
  body: string;
  file: string;
  summary: string;
  sideTitle: string;
  sideBody: string;
  beats: BeatCopy[];
  lines: CodeLine[];
  annotations: AnnotationCopy[];
}

const colors = {
  paper: "#f7f4ee",
  panel: "#fffdf8",
  panelSoft: "#f1eee6",
  ink: "#26322d",
  muted: "#68746f",
  rule: "#d6ddd7",
  ruleStrong: "#aebbb4",
  deleteBg: "#f8dedb",
  deleteInk: "#8d352e",
  addBg: "#dcefe4",
  addInk: "#235b3b",
  noteBg: "#fff0b8",
  noteInk: "#6b5717",
  blueBg: "#dcecff",
  blueInk: "#254d75",
};

const transitions: SceneTransitionMap = {
  "1->2": "slide-x",
  "2->3": "wipe",
  "3->4": "scale-fade",
  "4->5": "hard-cut",
};

const beatLayoutModes: Partial<Record<number, BeatLayoutMode>> = {
  2: "reserved",
  3: "reserved",
  4: "reserved",
  5: "reserved",
};

const copy: Record<Lang, SceneCopy[]> = {
  en: [
    {
      id: 1,
      nav: "00 before",
      phase: "before",
      title: "The flow breaks inside one branch.",
      body: "The first read shows the smell: routing, validation, and recovery are fused into a single path nobody can review cleanly.",
      file: "flow-before.ts",
      summary: "Failure mode: one hidden branch owns too many decisions.",
      sideTitle: "Review notes",
      sideBody: "The broken path is legible only when the whole file is open. A reviewer cannot isolate the state change.",
      beats: [
        {
          id: 0,
          action: "Show the brittle starting point",
          title: "Before",
          body: "A coupled branch hides the real failure.",
        },
      ],
      lines: [
        { n: "18", mark: " ", text: "function continueFlow(input: FlowInput) {", tone: "plain" },
        { n: "19", mark: " ", text: "  const draft = cache.read(input.userId);", tone: "plain" },
        { n: "20", mark: "!", text: "  if (draft || input.retry) {", tone: "note" },
        { n: "21", mark: "-", text: "    routeTo(draft?.step || input.step);", tone: "delete" },
        { n: "22", mark: "-", text: "    validateAfterRoute(input);", tone: "delete" },
        { n: "23", mark: "-", text: "    showGenericCopy();", tone: "delete" },
        { n: "24", mark: " ", text: "  }", tone: "plain" },
        { n: "25", mark: " ", text: "}", tone: "plain" },
      ],
      annotations: [
        {
          id: "A",
          title: "Hidden order",
          body: "Navigation fires before validity is known.",
          beat: 0,
          tone: "note",
        },
        {
          id: "B",
          title: "Blunt copy",
          body: "The user sees a fallback message, not the blocked field.",
          beat: 0,
          tone: "delete",
        },
      ],
    },
    {
      id: 2,
      nav: "01 diff",
      phase: "diff",
      title: "Split the branch into reviewable hunks.",
      body: "Each hunk owns one decision: derive the step, validate the step, then commit the route.",
      file: "flow-rewrite.diff",
      summary: "The diff makes the change small enough to audit.",
      sideTitle: "Hunk order",
      sideBody: "Read top to bottom. No hunk depends on hidden side effects from the next one.",
      beats: [
        {
          id: 0,
          action: "Reveal the route hunk",
          title: "Hunk 1",
          body: "Make routing a pure selection.",
        },
        {
          id: 1,
          action: "Reveal the validation hunk",
          title: "Hunk 2",
          body: "Validate before state moves.",
        },
        {
          id: 2,
          action: "Reveal the commit hunk",
          title: "Hunk 3",
          body: "Commit only after proof exists.",
        },
      ],
      lines: [
        { n: "31", mark: "-", text: "const target = draft?.step || input.step;", tone: "delete", beat: 0 },
        { n: "32", mark: "+", text: "const target = chooseNextStep({ draft, input });", tone: "add", beat: 0 },
        { n: "33", mark: " ", text: "", tone: "muted", beat: 0 },
        { n: "34", mark: "-", text: "routeTo(target);", tone: "delete", beat: 1 },
        { n: "35", mark: "-", text: "validateAfterRoute(input);", tone: "delete", beat: 1 },
        { n: "36", mark: "+", text: "const result = validateStep(target, input);", tone: "add", beat: 1 },
        { n: "37", mark: "+", text: "if (!result.ok) return explainBlock(result);", tone: "add", beat: 1 },
        { n: "38", mark: " ", text: "", tone: "muted", beat: 1 },
        { n: "39", mark: "-", text: "showGenericCopy();", tone: "delete", beat: 2 },
        { n: "40", mark: "+", text: "routeTo(target);", tone: "add", beat: 2 },
        { n: "41", mark: "+", text: "showFieldCopy(result.copy);", tone: "add", beat: 2 },
      ],
      annotations: [
        {
          id: "01",
          title: "Selection",
          body: "Pure input, no UI work.",
          beat: 0,
          tone: "add",
        },
        {
          id: "02",
          title: "Guard",
          body: "No state mutation before the check.",
          beat: 1,
          tone: "note",
        },
        {
          id: "03",
          title: "Commit",
          body: "The route happens after the proof.",
          beat: 2,
          tone: "add",
        },
      ],
    },
    {
      id: 3,
      nav: "02 notes",
      phase: "annotation",
      title: "Pin the why beside the changed lines.",
      body: "The annotation layer turns a code diff into a decision brief: what changed, why it changed, and what must stay true.",
      file: "flow-review.md",
      summary: "Reviewer can approve intent without reconstructing the story.",
      sideTitle: "Pinned rationale",
      sideBody: "Every marker connects to one line group and one invariant.",
      beats: [
        {
          id: 0,
          action: "Pin the route reason",
          title: "Pin A",
          body: "Route selection becomes pure.",
        },
        {
          id: 1,
          action: "Pin the guard reason",
          title: "Pin B",
          body: "Validation blocks mutation.",
        },
        {
          id: 2,
          action: "Pin the proof reason",
          title: "Pin C",
          body: "Copy proves the exact blocked field.",
        },
      ],
      lines: [
        { n: "52", mark: "+", text: "const target = chooseNextStep({ draft, input });", tone: "add", beat: 0 },
        { n: "53", mark: "!", text: "assertKnownStep(target);", tone: "note", beat: 0 },
        { n: "54", mark: "+", text: "const result = validateStep(target, input);", tone: "add", beat: 1 },
        { n: "55", mark: "!", text: "if (!result.ok) return explainBlock(result);", tone: "note", beat: 1 },
        { n: "56", mark: "+", text: "routeTo(target);", tone: "add", beat: 2 },
        { n: "57", mark: "+", text: "showFieldCopy(result.copy);", tone: "add", beat: 2 },
      ],
      annotations: [
        {
          id: "A",
          title: "Invariant",
          body: "The selected step is named before routing.",
          beat: 0,
          tone: "note",
        },
        {
          id: "B",
          title: "Stop line",
          body: "Invalid input exits before UI state changes.",
          beat: 1,
          tone: "delete",
        },
        {
          id: "C",
          title: "User proof",
          body: "The final copy points to the failing field.",
          beat: 2,
          tone: "add",
        },
      ],
    },
    {
      id: 4,
      nav: "03 after",
      phase: "after",
      title: "The after state reads in one pass.",
      body: "The final source separates selection, guard, and commit. The flow is shorter because every line now has one job.",
      file: "flow-after.ts",
      summary: "The repaired path is direct enough to maintain.",
      sideTitle: "After contract",
      sideBody: "A future edit can change copy, validation, or routing without touching the other two.",
      beats: [
        {
          id: 0,
          action: "Show the clean path",
          title: "Readable source",
          body: "One pass through the new flow.",
        },
        {
          id: 1,
          action: "Confirm isolated edits",
          title: "Isolated edits",
          body: "Future changes stay within their hunk.",
        },
      ],
      lines: [
        { n: "10", mark: "+", text: "export function continueFlow(input: FlowInput) {", tone: "add", beat: 0 },
        { n: "11", mark: "+", text: "  const draft = cache.read(input.userId);", tone: "add", beat: 0 },
        { n: "12", mark: "+", text: "  const target = chooseNextStep({ draft, input });", tone: "add", beat: 0 },
        { n: "13", mark: "+", text: "  const result = validateStep(target, input);", tone: "add", beat: 0 },
        { n: "14", mark: "+", text: "  if (!result.ok) return explainBlock(result);", tone: "add", beat: 0 },
        { n: "15", mark: "+", text: "  routeTo(target);", tone: "add", beat: 1 },
        { n: "16", mark: "+", text: "  showFieldCopy(result.copy);", tone: "add", beat: 1 },
        { n: "17", mark: "+", text: "}", tone: "add", beat: 1 },
      ],
      annotations: [
        {
          id: "S",
          title: "Selection",
          body: "Pure selector. Easy unit target.",
          beat: 0,
          tone: "add",
        },
        {
          id: "G",
          title: "Guard",
          body: "Return path explains the block.",
          beat: 0,
          tone: "note",
        },
        {
          id: "C",
          title: "Commit",
          body: "Only proven state reaches UI.",
          beat: 1,
          tone: "add",
        },
      ],
    },
    {
      id: 5,
      nav: "04 proof",
      phase: "proof",
      title: "Proof closes the rewrite.",
      body: "The brief ends where a code review should end: with the exact tests and the behavioral signal that justify the rewrite.",
      file: "flow-proof.test.ts",
      summary: "Approval rests on executable evidence, not style preference.",
      sideTitle: "Verification",
      sideBody: "The proof covers the old break, the new guard, and the user-visible result.",
      beats: [
        {
          id: 0,
          action: "Show proof matrix",
          title: "Tests",
          body: "Each changed hunk has a failing-before test.",
        },
        {
          id: 1,
          action: "Show review verdict",
          title: "Verdict",
          body: "The new flow is traceable and safer to change.",
        },
      ],
      lines: [
        { n: "01", mark: "+", text: "it('blocks invalid step before routing')", tone: "add", beat: 0 },
        { n: "02", mark: "+", text: "it('shows field-level recovery copy')", tone: "add", beat: 0 },
        { n: "03", mark: "+", text: "it('keeps retry path on the same target')", tone: "add", beat: 0 },
        { n: "04", mark: "!", text: "trace: choose -> validate -> route -> copy", tone: "note", beat: 1 },
        { n: "05", mark: "+", text: "review: approved with proof attached", tone: "add", beat: 1 },
      ],
      annotations: [
        {
          id: "P1",
          title: "Break covered",
          body: "Invalid steps can no longer mutate route state.",
          beat: 0,
          tone: "add",
        },
        {
          id: "P2",
          title: "User signal",
          body: "Recovery copy matches the blocked input.",
          beat: 0,
          tone: "note",
        },
        {
          id: "P3",
          title: "Review close",
          body: "The diff carries its own evidence.",
          beat: 1,
          tone: "add",
        },
      ],
    },
  ],
  zh: [
    {
      id: 1,
      nav: "00 改前",
      phase: "改前",
      title: "断点藏在同一个分支里。",
      body: "第一眼就能看到问题：路由、校验和恢复文案混在一起，评审无法单独看清状态变化。",
      file: "flow-before.ts",
      summary: "故障模式：一个隐藏分支承担了太多判断。",
      sideTitle: "评审记录",
      sideBody: "只有打开整份文件才看得懂旧路径。评审者无法隔离状态变化。",
      beats: [
        {
          id: 0,
          action: "展示脆弱起点",
          title: "改前",
          body: "耦合分支隐藏真实失败点。",
        },
      ],
      lines: [
        { n: "18", mark: " ", text: "function continueFlow(input: FlowInput) {", tone: "plain" },
        { n: "19", mark: " ", text: "  const draft = cache.read(input.userId);", tone: "plain" },
        { n: "20", mark: "!", text: "  if (draft || input.retry) {", tone: "note" },
        { n: "21", mark: "-", text: "    routeTo(draft?.step || input.step);", tone: "delete" },
        { n: "22", mark: "-", text: "    validateAfterRoute(input);", tone: "delete" },
        { n: "23", mark: "-", text: "    showGenericCopy();", tone: "delete" },
        { n: "24", mark: " ", text: "  }", tone: "plain" },
        { n: "25", mark: " ", text: "}", tone: "plain" },
      ],
      annotations: [
        {
          id: "A",
          title: "顺序被藏住",
          body: "还不知道是否合法，就已经触发跳转。",
          beat: 0,
          tone: "note",
        },
        {
          id: "B",
          title: "文案太粗",
          body: "用户看到兜底提示，看不到具体卡住的字段。",
          beat: 0,
          tone: "delete",
        },
      ],
    },
    {
      id: 2,
      nav: "01 差异",
      phase: "差异",
      title: "把分支拆成可评审的 hunk。",
      body: "每个 hunk 只负责一个判断：推导步骤、校验步骤、再提交路由。",
      file: "flow-rewrite.diff",
      summary: "差异视图把改动缩小到可以审计的粒度。",
      sideTitle: "Hunk 顺序",
      sideBody: "从上到下阅读。没有任何 hunk 依赖后续隐藏副作用。",
      beats: [
        {
          id: 0,
          action: "显示路由 hunk",
          title: "Hunk 1",
          body: "路由选择变成纯计算。",
        },
        {
          id: 1,
          action: "显示校验 hunk",
          title: "Hunk 2",
          body: "先校验，再移动状态。",
        },
        {
          id: 2,
          action: "显示提交 hunk",
          title: "Hunk 3",
          body: "只有证据成立后才提交。",
        },
      ],
      lines: [
        { n: "31", mark: "-", text: "const target = draft?.step || input.step;", tone: "delete", beat: 0 },
        { n: "32", mark: "+", text: "const target = chooseNextStep({ draft, input });", tone: "add", beat: 0 },
        { n: "33", mark: " ", text: "", tone: "muted", beat: 0 },
        { n: "34", mark: "-", text: "routeTo(target);", tone: "delete", beat: 1 },
        { n: "35", mark: "-", text: "validateAfterRoute(input);", tone: "delete", beat: 1 },
        { n: "36", mark: "+", text: "const result = validateStep(target, input);", tone: "add", beat: 1 },
        { n: "37", mark: "+", text: "if (!result.ok) return explainBlock(result);", tone: "add", beat: 1 },
        { n: "38", mark: " ", text: "", tone: "muted", beat: 1 },
        { n: "39", mark: "-", text: "showGenericCopy();", tone: "delete", beat: 2 },
        { n: "40", mark: "+", text: "routeTo(target);", tone: "add", beat: 2 },
        { n: "41", mark: "+", text: "showFieldCopy(result.copy);", tone: "add", beat: 2 },
      ],
      annotations: [
        {
          id: "01",
          title: "选择",
          body: "纯输入，不做 UI 操作。",
          beat: 0,
          tone: "add",
        },
        {
          id: "02",
          title: "守卫",
          body: "检查前不改状态。",
          beat: 1,
          tone: "note",
        },
        {
          id: "03",
          title: "提交",
          body: "证据成立后再跳转。",
          beat: 2,
          tone: "add",
        },
      ],
    },
    {
      id: 3,
      nav: "02 批注",
      phase: "批注",
      title: "把为什么钉在变更行旁边。",
      body: "批注层把代码差异变成决策简报：改了什么、为什么改、什么约束必须保持。",
      file: "flow-review.md",
      summary: "评审者不需要重建故事，也能确认意图。",
      sideTitle: "钉住理由",
      sideBody: "每个标记都连到一组行和一条不变量。",
      beats: [
        {
          id: 0,
          action: "钉住路由理由",
          title: "标记 A",
          body: "路由选择变成纯计算。",
        },
        {
          id: 1,
          action: "钉住守卫理由",
          title: "标记 B",
          body: "校验阻止状态变动。",
        },
        {
          id: 2,
          action: "钉住证据理由",
          title: "标记 C",
          body: "文案证明具体卡住的字段。",
        },
      ],
      lines: [
        { n: "52", mark: "+", text: "const target = chooseNextStep({ draft, input });", tone: "add", beat: 0 },
        { n: "53", mark: "!", text: "assertKnownStep(target);", tone: "note", beat: 0 },
        { n: "54", mark: "+", text: "const result = validateStep(target, input);", tone: "add", beat: 1 },
        { n: "55", mark: "!", text: "if (!result.ok) return explainBlock(result);", tone: "note", beat: 1 },
        { n: "56", mark: "+", text: "routeTo(target);", tone: "add", beat: 2 },
        { n: "57", mark: "+", text: "showFieldCopy(result.copy);", tone: "add", beat: 2 },
      ],
      annotations: [
        {
          id: "A",
          title: "不变量",
          body: "命名目标步骤后，才能路由。",
          beat: 0,
          tone: "note",
        },
        {
          id: "B",
          title: "停止线",
          body: "非法输入在 UI 状态变化前退出。",
          beat: 1,
          tone: "delete",
        },
        {
          id: "C",
          title: "用户证据",
          body: "最终文案指向失败字段。",
          beat: 2,
          tone: "add",
        },
      ],
    },
    {
      id: 4,
      nav: "03 改后",
      phase: "改后",
      title: "改后的路径一遍就能读完。",
      body: "最终源码分开了选择、守卫和提交。流程更短，因为每行都只有一个职责。",
      file: "flow-after.ts",
      summary: "修复后的路径足够直接，后续维护更轻。",
      sideTitle: "改后契约",
      sideBody: "未来可以单独改文案、校验或路由，不必碰另外两处。",
      beats: [
        {
          id: 0,
          action: "展示清理后的路径",
          title: "可读源码",
          body: "一遍读完新流程。",
        },
        {
          id: 1,
          action: "确认编辑隔离",
          title: "隔离编辑",
          body: "后续变化留在自己的 hunk 内。",
        },
      ],
      lines: [
        { n: "10", mark: "+", text: "export function continueFlow(input: FlowInput) {", tone: "add", beat: 0 },
        { n: "11", mark: "+", text: "  const draft = cache.read(input.userId);", tone: "add", beat: 0 },
        { n: "12", mark: "+", text: "  const target = chooseNextStep({ draft, input });", tone: "add", beat: 0 },
        { n: "13", mark: "+", text: "  const result = validateStep(target, input);", tone: "add", beat: 0 },
        { n: "14", mark: "+", text: "  if (!result.ok) return explainBlock(result);", tone: "add", beat: 0 },
        { n: "15", mark: "+", text: "  routeTo(target);", tone: "add", beat: 1 },
        { n: "16", mark: "+", text: "  showFieldCopy(result.copy);", tone: "add", beat: 1 },
        { n: "17", mark: "+", text: "}", tone: "add", beat: 1 },
      ],
      annotations: [
        {
          id: "S",
          title: "选择",
          body: "纯选择器，容易单测。",
          beat: 0,
          tone: "add",
        },
        {
          id: "G",
          title: "守卫",
          body: "返回路径解释阻塞原因。",
          beat: 0,
          tone: "note",
        },
        {
          id: "C",
          title: "提交",
          body: "只有通过证明的状态进入 UI。",
          beat: 1,
          tone: "add",
        },
      ],
    },
    {
      id: 5,
      nav: "04 证明",
      phase: "证明",
      title: "证明收束这次重写。",
      body: "简报停在代码评审该停的位置：用精确测试和行为信号证明这次重写值得合入。",
      file: "flow-proof.test.ts",
      summary: "批准基于可执行证据，而不是风格偏好。",
      sideTitle: "验证",
      sideBody: "证明覆盖旧断点、新守卫和用户可见结果。",
      beats: [
        {
          id: 0,
          action: "展示证明矩阵",
          title: "测试",
          body: "每个变更 hunk 都有改前会失败的测试。",
        },
        {
          id: 1,
          action: "展示评审结论",
          title: "结论",
          body: "新流程可追踪，也更安全。",
        },
      ],
      lines: [
        { n: "01", mark: "+", text: "it('blocks invalid step before routing')", tone: "add", beat: 0 },
        { n: "02", mark: "+", text: "it('shows field-level recovery copy')", tone: "add", beat: 0 },
        { n: "03", mark: "+", text: "it('keeps retry path on the same target')", tone: "add", beat: 0 },
        { n: "04", mark: "!", text: "trace: choose -> validate -> route -> copy", tone: "note", beat: 1 },
        { n: "05", mark: "+", text: "review: approved with proof attached", tone: "add", beat: 1 },
      ],
      annotations: [
        {
          id: "P1",
          title: "断点覆盖",
          body: "非法步骤不能再改动路由状态。",
          beat: 0,
          tone: "add",
        },
        {
          id: "P2",
          title: "用户信号",
          body: "恢复文案匹配被阻塞输入。",
          beat: 0,
          tone: "note",
        },
        {
          id: "P3",
          title: "评审收束",
          body: "差异本身带着证据。",
          beat: 1,
          tone: "add",
        },
      ],
    },
  ],
};

function toneStyle(tone: Tone): React.CSSProperties {
  if (tone === "delete") {
    return {
      background: colors.deleteBg,
      color: colors.deleteInk,
      borderColor: "#e9b5af",
    };
  }
  if (tone === "add") {
    return {
      background: colors.addBg,
      color: colors.addInk,
      borderColor: "#add5bb",
    };
  }
  if (tone === "note") {
    return {
      background: colors.noteBg,
      color: colors.noteInk,
      borderColor: "#e6cb65",
    };
  }
  if (tone === "muted") {
    return {
      background: colors.panelSoft,
      color: colors.muted,
      borderColor: colors.rule,
    };
  }
  return {
    background: colors.panel,
    color: colors.ink,
    borderColor: colors.rule,
  };
}

function revealStyle(
  visible: boolean,
  reducedMotion: boolean,
  delay = 0,
): React.CSSProperties {
  return {
    opacity: visible ? 1 : 0,
    visibility: visible ? "visible" : "hidden",
    transform: visible ? "translate3d(0, 0, 0)" : "translate3d(0, 1.2cqh, 0)",
    transition: reducedMotion
      ? "none"
      : "opacity 420ms ease, transform 420ms ease",
    transitionDelay: reducedMotion || !visible ? "0ms" : `${delay}ms`,
  };
}

function clampBeat(scene: SceneCopy, beat: number): number {
  return Math.max(0, Math.min(beat, scene.beats.length - 1));
}

function getScenes(lang: Lang): SceneCopy[] {
  return copy[lang];
}

function getScene(lang: Lang, scene: number): SceneCopy {
  return getScenes(lang)[scene - 1] ?? getScenes(lang)[0];
}

function metadataScenes(lang: Lang): StyleMetadata["scenes"] {
  return getScenes(lang).map((item) => ({
    id: item.id,
    title: item.title,
    beats: item.beats,
  }));
}

export function getMetadata(lang: Lang): StyleMetadata {
  return {
    id: "45",
    band: "text-report",
    name: lang === "zh" ? "带批注的源码差异" : "Annotated Source & Diff",
    theme: lang === "zh" ? "重写断裂流程" : "Rewrite the Broken Flow",
    densityLabel: lang === "zh" ? "阅读优先" : "Reading-first",
    heroScene: 2,
    colors: { bg: colors.paper, ink: colors.ink, panel: colors.panel },
    typography: {
      header: "Inter 600",
      body: "SF Mono 400",
    },
    tags: [
      "text-report",
      "diff",
      "annotation",
      "source",
      "review",
      "before-after",
    ],
    fonts: ["Inter", "SF Mono", "cjk:PingFang SC"],
    scenes: metadataScenes(lang),
  };
}

function HunkNavigator({
  language,
  activeScene,
  onNavigate,
}: {
  language: Lang;
  activeScene: number;
  onNavigate?: (scene: number, beat: number) => void;
}) {
  const items = getScenes(language);
  return (
    <nav
      aria-label={language === "zh" ? "差异 hunk 导航" : "Diff hunk navigator"}
      style={{
        position: "absolute",
        left: "2.4cqw",
        top: "14cqh",
        width: "13cqw",
        display: "grid",
        gap: "1cqh",
        zIndex: 5,
      }}
    >
      {items.map((item) => {
        const active = item.id === activeScene;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onNavigate?.(item.id, 0)}
            style={{
              appearance: "none",
              border: "0.08cqw solid",
              borderColor: active ? colors.ink : colors.ruleStrong,
              background: active ? colors.ink : colors.panel,
              color: active ? colors.panel : colors.ink,
              borderRadius: "0.45cqw",
              padding: "0.9cqh 0.7cqw",
              fontFamily:
                "'SFMono-Regular', 'SF Mono', Consolas, 'Liberation Mono', monospace",
              fontSize: "0.92cqw",
              lineHeight: 1.1,
              letterSpacing: 0,
              textAlign: "left",
              cursor: "pointer",
              boxShadow: active ? "0 0.45cqh 0 #c9d1ca" : "none",
            }}
          >
            <span
              style={{
                display: "block",
                color: active ? colors.addBg : colors.muted,
                fontSize: "0.72cqw",
                marginBlockEnd: "0.25cqh",
              }}
            >
              @@ hunk {String(item.id).padStart(2, "0")}
            </span>
            {item.nav}
          </button>
        );
      })}
    </nav>
  );
}

function CodeLineRow({
  line,
  activeBeat,
  reducedMotion,
}: {
  line: CodeLine;
  activeBeat: number;
  reducedMotion: boolean;
}) {
  const visible = (line.beat ?? 0) <= activeBeat;
  const tone = toneStyle(line.tone);
  return (
    <div
      data-beat-layout-item="true"
      style={{
        ...tone,
        ...revealStyle(visible, reducedMotion, (line.beat ?? 0) * 80),
        display: "grid",
        gridTemplateColumns: "8% 7% 1fr",
        alignItems: "center",
        minHeight: "4.25cqh",
        borderInlineStart: "0.24cqw solid",
        borderBlockEnd: "0.08cqw solid rgba(38, 50, 45, 0.08)",
        fontFamily:
          "'SFMono-Regular', 'SF Mono', Consolas, 'Liberation Mono', monospace",
        fontSize: "1.04cqw",
        lineHeight: 1.24,
      }}
    >
      <span
        style={{
          paddingInlineStart: "0.8cqw",
          color: colors.muted,
          userSelect: "none",
        }}
      >
        {line.n}
      </span>
      <span
        style={{
          color:
            line.mark === "+"
              ? colors.addInk
              : line.mark === "-"
                ? colors.deleteInk
                : colors.noteInk,
          fontWeight: 700,
          userSelect: "none",
        }}
      >
        {line.mark}
      </span>
      <span
        style={{
          paddingInlineEnd: "1cqw",
          whiteSpace: "pre-wrap",
          overflowWrap: "anywhere",
          textDecoration: line.mark === "-" ? "line-through" : "none",
          textDecorationThickness: "0.12cqw",
        }}
      >
        {line.text || " "}
      </span>
    </div>
  );
}

function CodePanel({
  scene,
  activeBeat,
  reducedMotion,
}: {
  scene: SceneCopy;
  activeBeat: number;
  reducedMotion: boolean;
}) {
  return (
    <section
      data-beat-layout-item="true"
      style={{
        background: colors.panel,
        border: `0.1cqw solid ${colors.rule}`,
        borderRadius: "0.6cqw",
        overflow: "hidden",
        minHeight: "58cqh",
        display: "grid",
        gridTemplateRows: "6cqh 1fr",
      }}
    >
      <header
        style={{
          display: "grid",
          gridTemplateColumns: "1fr auto",
          alignItems: "center",
          gap: "1cqw",
          paddingInline: "1.2cqw",
          borderBlockEnd: `0.1cqw solid ${colors.rule}`,
          background: "#fbfaf5",
        }}
      >
        <span
          style={{
            fontFamily:
              "'SFMono-Regular', 'SF Mono', Consolas, 'Liberation Mono', monospace",
            fontSize: "0.98cqw",
            color: colors.ink,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {scene.file}
        </span>
        <span
          style={{
            fontSize: "0.78cqw",
            color: colors.muted,
            fontFamily:
              "'SFMono-Regular', 'SF Mono', Consolas, 'Liberation Mono', monospace",
          }}
        >
          {scene.phase}
        </span>
      </header>
      <div
        style={{
          display: "grid",
          alignContent: "start",
        }}
      >
        {scene.lines.map((line, index) => (
          <CodeLineRow
            key={`${line.n}-${index}`}
            line={line}
            activeBeat={activeBeat}
            reducedMotion={reducedMotion}
          />
        ))}
      </div>
    </section>
  );
}

function AnnotationPanel({
  scene,
  activeBeat,
  reducedMotion,
}: {
  scene: SceneCopy;
  activeBeat: number;
  reducedMotion: boolean;
}) {
  return (
    <aside
      data-beat-layout-item="true"
      style={{
        display: "grid",
        gridTemplateRows: "auto 1fr auto",
        gap: "1.2cqh",
        minHeight: "58cqh",
      }}
    >
      <section
        style={{
          background: colors.ink,
          color: colors.panel,
          borderRadius: "0.6cqw",
          padding: "1.7cqh 1.2cqw",
        }}
      >
        <div
          style={{
            fontSize: "0.78cqw",
            fontFamily:
              "'SFMono-Regular', 'SF Mono', Consolas, 'Liberation Mono', monospace",
            color: colors.addBg,
            marginBlockEnd: "0.8cqh",
          }}
        >
          review note
        </div>
        <h2
          style={{
            margin: 0,
            fontSize: "1.38cqw",
            lineHeight: 1.08,
            letterSpacing: 0,
          }}
        >
          {scene.sideTitle}
        </h2>
        <p
          style={{
            margin: "1cqh 0 0",
            color: "#e8eee8",
            fontSize: "0.98cqw",
            lineHeight: 1.35,
          }}
        >
          {scene.sideBody}
        </p>
      </section>
      <div
        style={{
          display: "grid",
          gap: "1cqh",
          gridAutoRows: "1fr",
        }}
      >
        {scene.annotations.map((annotation) => {
          const visible = annotation.beat <= activeBeat;
          const tone = toneStyle(annotation.tone);
          return (
            <article
              key={annotation.id}
              data-beat-layout-item="true"
              style={{
                ...tone,
                ...revealStyle(visible, reducedMotion, annotation.beat * 100),
                border: "0.1cqw solid",
                borderColor: tone.borderColor,
                borderRadius: "0.6cqw",
                padding: "1.1cqh 1cqw",
                minHeight: "10.5cqh",
                display: "grid",
                gridTemplateColumns: "20% 1fr",
                gap: "0.8cqw",
                alignItems: "start",
              }}
            >
              <strong
                style={{
                  display: "grid",
                  placeItems: "center",
                  minHeight: "4.2cqh",
                  borderRadius: "50%",
                  background: colors.panel,
                  border: `0.1cqw solid ${colors.ruleStrong}`,
                  fontFamily:
                    "'SFMono-Regular', 'SF Mono', Consolas, 'Liberation Mono', monospace",
                  fontSize: "0.86cqw",
                }}
              >
                {annotation.id}
              </strong>
              <span>
                <span
                  style={{
                    display: "block",
                    fontWeight: 700,
                    fontSize: "1.02cqw",
                    lineHeight: 1.12,
                    marginBlockEnd: "0.45cqh",
                  }}
                >
                  {annotation.title}
                </span>
                <span
                  style={{
                    display: "block",
                    color: colors.ink,
                    fontSize: "0.86cqw",
                    lineHeight: 1.3,
                  }}
                >
                  {annotation.body}
                </span>
              </span>
            </article>
          );
        })}
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "0.6cqw",
        }}
      >
        {["-", "+", "!"].map((token, index) => (
          <span
            key={token}
            style={{
              background:
                index === 0
                  ? colors.deleteBg
                  : index === 1
                    ? colors.addBg
                    : colors.noteBg,
              color:
                index === 0
                  ? colors.deleteInk
                  : index === 1
                    ? colors.addInk
                    : colors.noteInk,
              borderRadius: "0.45cqw",
              padding: "0.8cqh 0.6cqw",
              fontFamily:
                "'SFMono-Regular', 'SF Mono', Consolas, 'Liberation Mono', monospace",
              fontSize: "0.82cqw",
              textAlign: "center",
              border: `0.08cqw solid ${colors.rule}`,
            }}
          >
            {token} hunk
          </span>
        ))}
      </div>
    </aside>
  );
}

function BeatRail({
  scene,
  activeBeat,
}: {
  scene: SceneCopy;
  activeBeat: number;
}) {
  return (
    <div
      data-beat-layout-item="true"
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${scene.beats.length}, 1fr)`,
        gap: "0.5cqw",
        alignItems: "stretch",
      }}
    >
      {scene.beats.map((beat) => {
        const active = beat.id <= activeBeat;
        return (
          <div
            key={beat.id}
            data-beat-layout-item="true"
            style={{
              border: "0.08cqw solid",
              borderColor: active ? colors.ink : colors.rule,
              background: active ? colors.blueBg : colors.panel,
              color: active ? colors.blueInk : colors.muted,
              borderRadius: "0.45cqw",
              padding: "0.8cqh 0.75cqw",
              minHeight: "7cqh",
              display: "grid",
              alignContent: "start",
              gap: "0.35cqh",
            }}
          >
            <strong
              style={{
                fontSize: "0.78cqw",
                fontFamily:
                  "'SFMono-Regular', 'SF Mono', Consolas, 'Liberation Mono', monospace",
              }}
            >
              {beat.title}
            </strong>
            <span
              style={{
                fontSize: "0.78cqw",
                lineHeight: 1.25,
              }}
            >
              {beat.body}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function ScenePanel({
  sceneId,
  beat,
  language,
  reducedMotion,
}: {
  sceneId: number;
  beat: number;
  language: Lang;
  reducedMotion: boolean;
}) {
  const scene = getScene(language, sceneId);
  const activeBeat = clampBeat(scene, beat);
  const isMultiBeat = scene.beats.length > 1;
  const mainColumns =
    sceneId === 1
      ? "58% 1fr"
      : sceneId === 5
        ? "52% 1fr"
        : "64% 1fr";

  return (
    <section
      data-beat-layout-container={isMultiBeat ? "true" : undefined}
      data-beat-layout-mode={isMultiBeat ? "reserved" : undefined}
      style={{
        width: "100%",
        height: "100%",
        boxSizing: "border-box",
        display: "grid",
        gridTemplateRows: "17cqh 1fr 11cqh",
        gap: "2cqh",
        padding: "5cqh 4cqw 4cqh 18cqw",
        color: colors.ink,
        background:
          "linear-gradient(90deg, rgba(214,221,215,0.55) 0.08cqw, transparent 0.08cqw), linear-gradient(0deg, rgba(214,221,215,0.45) 0.08cqh, transparent 0.08cqh)",
        backgroundSize: "5cqw 5cqh",
        overflow: "hidden",
      }}
    >
      <header
        data-beat-layout-item="true"
        style={{
          display: "grid",
          gridTemplateColumns: "auto 1fr",
          gap: "1.6cqw",
          alignItems: "start",
          minHeight: "14cqh",
        }}
      >
        <div
          style={{
            width: "7.8cqw",
            minHeight: "8.4cqh",
            background: colors.panel,
            border: `0.12cqw solid ${colors.ink}`,
            borderRadius: "0.5cqw",
            display: "grid",
            placeItems: "center",
            fontFamily:
              "'SFMono-Regular', 'SF Mono', Consolas, 'Liberation Mono', monospace",
            fontSize: "1.2cqw",
            boxShadow: "0.35cqw 0.8cqh 0 #d7ded8",
          }}
        >
          @@{sceneId}
        </div>
        <div style={{ minWidth: 0 }}>
          <p
            style={{
              margin: "0 0 0.8cqh",
              color: colors.muted,
              fontFamily:
                "'SFMono-Regular', 'SF Mono', Consolas, 'Liberation Mono', monospace",
              fontSize: "0.88cqw",
              textTransform: "uppercase",
              letterSpacing: 0,
            }}
          >
            {scene.phase} / Rewrite the Broken Flow
          </p>
          <h1
            style={{
              margin: 0,
              fontSize: language === "zh" ? "3.05cqw" : "2.86cqw",
              lineHeight: 1.02,
              letterSpacing: 0,
              maxWidth: "66cqw",
            }}
          >
            {scene.title}
          </h1>
        </div>
      </header>

      <main
        data-beat-layout-item="true"
        style={{
          display: "grid",
          gridTemplateColumns: mainColumns,
          gap: "1.4cqw",
          minHeight: "58cqh",
          alignItems: "stretch",
        }}
      >
        <CodePanel
          scene={scene}
          activeBeat={activeBeat}
          reducedMotion={reducedMotion}
        />
        <AnnotationPanel
          scene={scene}
          activeBeat={activeBeat}
          reducedMotion={reducedMotion}
        />
      </main>

      <footer
        data-beat-layout-item="true"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 42%",
          gap: "1.4cqw",
          alignItems: "stretch",
          minHeight: "9cqh",
        }}
      >
        <section
          style={{
            display: "grid",
            gridTemplateColumns: "22% 1fr",
            gap: "1cqw",
            alignItems: "stretch",
            background: colors.panel,
            border: `0.1cqw solid ${colors.rule}`,
            borderRadius: "0.6cqw",
            padding: "1.1cqh 1cqw",
          }}
        >
          <strong
            style={{
              fontFamily:
                "'SFMono-Regular', 'SF Mono', Consolas, 'Liberation Mono', monospace",
              fontSize: "0.84cqw",
              color: colors.muted,
            }}
          >
            {scene.summary}
          </strong>
          <span
            style={{
              fontSize: "0.98cqw",
              lineHeight: 1.3,
              color: colors.ink,
            }}
          >
            {scene.body}
          </span>
        </section>
        <BeatRail scene={scene} activeBeat={activeBeat} />
      </footer>
    </section>
  );
}

export default function RewriteBrokenFlowV2({
  scene,
  beat,
  language,
  isThumbnail,
  reducedMotion,
  onNavigate,
}: BespokeStyleProps) {
  const motionOff = reducedMotion || isThumbnail;
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        containerType: "size",
        background: colors.paper,
        color: colors.ink,
        fontFamily:
          "Inter, 'PingFang SC', 'Microsoft YaHei', system-ui, sans-serif",
        letterSpacing: 0,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {!isThumbnail && (
        <HunkNavigator
          language={language}
          activeScene={scene}
          onNavigate={onNavigate}
        />
      )}
      <SpatialSceneTrack
        scene={scene}
        beat={beat}
        sceneIds={[1, 2, 3, 4, 5]}
        transitionKind="slide-x"
        transitionMap={transitions}
        reducedMotion={motionOff}
        beatLayoutModes={beatLayoutModes}
        renderScene={(sceneId, sceneBeat) => (
          <ScenePanel
            sceneId={sceneId}
            beat={sceneBeat}
            language={language}
            reducedMotion={motionOff}
          />
        )}
      />
    </div>
  );
}

export const rewriteBrokenFlowV2Version = defineStyleVersion({
  id: "v2",
  topic: {
    en: "Flow Rewrite",
    zh: "流程重写",
  },
  model: "GPT-5.5",
  component: RewriteBrokenFlowV2,
  getMetadata,
});

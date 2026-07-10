import React, { useEffect } from "react";
import type { BespokeStyleProps, StyleMetadata } from "../types";
import SpatialSceneTrack, { type SceneTransitionMap } from "./SpatialSceneTrack";
import { defineStyleTopic } from "./topic";

type Lang = "en" | "zh";

const STYLE_ID = "engineering-whiteboard-explainer";
const TOPIC_ID = "from-prompt-to-patch";

const BEAT_LAYOUT_MODES = {
  2: "reserved",
  3: "reserved",
  4: "reserved",
  5: "reserved",
} satisfies Record<number, "motion" | "reserved">;
const TRANSITION_MAP: SceneTransitionMap = {
  "1->2": "wipe",
  "2->3": "slide-x",
  "3->4": "slide-y",
  "4->5": "scale-fade",
  "5->4": "slide-y",
  "4->3": "slide-x",
  "3->2": "slide-x",
  "2->1": "wipe",
};
const PATCH_LANE_COLUMNS_CQW = [25, 4.5, 25, 4.5, 25] as const;
const PATCH_LANE_INSET_CQW = 5;
const PATCH_LANE_TOTAL_CQW =
  PATCH_LANE_COLUMNS_CQW.reduce((sum, value) => sum + value, 0) +
  PATCH_LANE_INSET_CQW * 2;

const COPY = {
  en: {
    name: "Engineering Whiteboard Explainer",
    theme:
      "A clean engineering whiteboard walkthrough that turns a prompt into a reviewed patch through cards, arrows, status badges, and marker callouts.",
    density: "Explainer",
    title: "Prompt → Patch",
    subtitle: "A live engineering walkthrough for how an agent turns intent into a safe code change.",
    lane: "Takeaway",
    scenes: [
      {
        title: "Map the path",
        beats: [
          {
            action: "Frame the route",
            title: "One prompt becomes a patch through visible checkpoints",
            body: "Route: intent, context, plan, edit, verify, handoff.",
          },
        ],
      },
      {
        title: "Collect context",
        beats: [
          {
            action: "Show user intent",
            title: "Intent lands on the board",
            body: "The request is translated into constraints before code changes.",
          },
          {
            action: "Add repo evidence",
            title: "Repo evidence narrows the move",
            body: "Existing exports, tests, and nearby patterns become guardrails.",
          },
          {
            action: "Stamp the plan",
            title: "A small plan keeps the edit bounded",
            body: "Only the files required by the route are touched.",
          },
        ],
      },
      {
        title: "Make the patch",
        beats: [
          {
            action: "Open edit cards",
            title: "Code cards line up by responsibility",
            body: "Parser, state, UI, and tests stay in separate lanes.",
          },
          {
            action: "Connect review to work",
            title: "Review comments become patch tasks",
            body: "Each comment maps to one concrete code or test change.",
          },
          {
            action: "Attach verification",
            title: "Tests + diff + PR summary",
            body: "The patch is not done until evidence is attached.",
          },
        ],
      },
      {
        title: "Verify the change",
        beats: [
          {
            action: "Run narrow tests",
            title: "Narrow tests prove the changed contract",
            body: "Start with focused unit coverage at the public seam.",
          },
          {
            action: "Run integration checks",
            title: "Integration checks catch broken wiring",
            body: "Typecheck and build verify the registry, routing, and UI agree.",
          },
          {
            action: "Mark risk",
            title: "Residual risk is labeled, not hidden",
            body: "Anything unverified gets a red callout before handoff.",
          },
        ],
      },
      {
        title: "Final check",
        beats: [
          {
            action: "Summarize evidence",
            title: "A patch needs a clear receipt",
            body: "The final note names what changed and what passed.",
          },
          {
            action: "Close the loop",
            title: "A chain you can explain is a chain worth automating.",
            body: "The board ends where the reviewer can replay every step.",
          },
        ],
      },
    ],
    tags: ["prompt", "context", "patch", "tests", "handoff"],
    finalTakeaway: "A chain you can explain is a chain worth automating.",
  },
  zh: {
    name: "工程讲解白板",
    theme:
      "用干净的工程白板，把一次提示如何变成经过验证的补丁讲清楚：卡片、箭头、状态章和标注一起推进论证。",
    density: "讲解型",
    title: "提示 → 补丁",
    subtitle: "一次工程白板讲解：Agent 如何把意图变成可验证的代码改动。",
    lane: "结论",
    scenes: [
      {
        title: "画出路径",
        beats: [
          {
            action: "框定路线",
            title: "一个提示，要经过可见检查点才变成补丁",
            body: "路线：意图、上下文、计划、编辑、验证、交接。",
          },
        ],
      },
      {
        title: "收集上下文",
        beats: [
          {
            action: "展示用户意图",
            title: "意图先落到板上",
            body: "在改代码前，先把请求翻译成约束。",
          },
          {
            action: "加入仓库证据",
            title: "仓库证据会缩小动作范围",
            body: "现有导出、测试、相邻模式都变成护栏。",
          },
          {
            action: "盖章计划",
            title: "小计划让改动保持边界",
            body: "只触碰这条路线真正需要的文件。",
          },
        ],
      },
      {
        title: "生成补丁",
        beats: [
          {
            action: "展开编辑卡片",
            title: "代码卡片按职责排好",
            body: "解析、状态、界面、测试各自待在自己的泳道里。",
          },
          {
            action: "把评审映射成任务",
            title: "评审意见变成补丁任务",
            body: "每条意见对应一个明确的代码或测试改动。",
          },
          {
            action: "挂上验证证据",
            title: "测试 + diff + PR 摘要",
            body: "没有证据，补丁就还没完成。",
          },
        ],
      },
      {
        title: "验证改动",
        beats: [
          {
            action: "跑窄测试",
            title: "窄测试证明被改的契约",
            body: "从公共接口上的聚焦单测开始。",
          },
          {
            action: "跑集成检查",
            title: "集成检查抓住断掉的接线",
            body: "typecheck 和 build 验证 registry、路由、界面一致。",
          },
          {
            action: "标出风险",
            title: "剩余风险要标出来，而不是藏起来",
            body: "没验证的地方，在交接前用红色标注。",
          },
        ],
      },
      {
        title: "最终检查",
        beats: [
          {
            action: "总结证据",
            title: "补丁需要一张清楚的收据",
            body: "最后说明改了什么、通过了什么。",
          },
          {
            action: "闭环",
            title: "能解释的链路，才值得自动化。",
            body: "白板结束时，评审者能重放每一步。",
          },
        ],
      },
    ],
    tags: ["提示", "上下文", "补丁", "测试", "交接"],
    finalTakeaway: "能解释的链路，才值得自动化。",
  },
} as const;

const STAGES = [
  { key: "intent", en: "Intent", zh: "意图", emoji: "🧭", color: "#f6c945" },
  { key: "context", en: "Context", zh: "上下文", emoji: "📚", color: "#4b8fe8" },
  { key: "plan", en: "Plan", zh: "计划", emoji: "✍️", color: "#7b61ff" },
  { key: "patch", en: "Patch", zh: "补丁", emoji: "🧩", color: "#24a66a" },
  { key: "verify", en: "Verify", zh: "验证", emoji: "✅", color: "#24a66a" },
] as const;

const sceneTitles = (lang: Lang) =>
  COPY[lang].scenes.map((scene, index) => ({
    id: index + 1,
    title: scene.title,
    beats: scene.beats.map((beat, beatIndex) => ({
      id: beatIndex,
      action: beat.action,
      title: beat.title,
      body: beat.body,
    })),
  }));

function useFonts() {
  useEffect(() => {
    const id = "style-engineering-whiteboard-explainer-fonts";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&family=LXGW+WenKai:wght@400;700&display=swap";
    document.head.appendChild(link);
  }, []);
}

export function getMetadata(lang: Lang): StyleMetadata {
  const copy = COPY[lang];
  return {
    id: STYLE_ID,
    band: "balanced-hybrid",
    name: copy.name,
    theme: copy.theme,
    densityLabel: copy.density,
    heroScene: 3,
    colors: { bg: "#fbfcff", ink: "#20242a", panel: "#ffffff" },
    typography: {
      header: "LXGW WenKai 700",
      body: "Inter 400",
    },
    tags: [
      "engineering",
      "whiteboard",
      "explainer",
      "agent",
      "workflow",
      "diagram",
      "developer-education",
      ...copy.tags,
    ],
    fonts: ["Inter", "JetBrains Mono", "cjk:LXGW WenKai"],
    scenes: sceneTitles(lang),
  };
}

function showAt(beat: number, threshold: number) {
  return beat >= threshold;
}

function cardStyle(active: boolean, accent: string): React.CSSProperties {
  return {
    border: `0.16cqw solid ${active ? accent : "#d7dde5"}`,
    boxShadow: active ? `0 0.8cqh 0 ${accent}26` : "0 0.45cqh 0 #dce3ec",
    transform: active ? "translateY(-0.35cqh)" : "translateY(0)",
  };
}

function Badge({ children, color }: { children: React.ReactNode; color: string }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        borderRadius: "0.7cqw",
        padding: "0.35cqh 0.7cqw",
        background: `${color}18`,
        border: `0.12cqw solid ${color}`,
        color: "#20242a",
        fontFamily: "JetBrains Mono, ui-monospace, monospace",
        fontSize: "0.95cqw",
        fontWeight: 700,
      }}
    >
      {children}
    </span>
  );
}

function Arrow({ active = true }: { active?: boolean }) {
  return (
    <svg
      viewBox="0 0 180 42"
      aria-hidden="true"
      style={{
        width: "5cqw",
        height: "3.2cqh",
        opacity: active ? 1 : 0.24,
        flex: "0 0 auto",
      }}
    >
      <path
        d="M8 22 C48 22 58 11 94 20 S142 31 164 18"
        fill="none"
        stroke="#4b8fe8"
        strokeWidth="5"
        strokeLinecap="round"
        strokeDasharray={active ? "0" : "10 12"}
      />
      <path d="M164 18 l-18 -9 l5 18 z" fill="#4b8fe8" />
    </svg>
  );
}

function Takeaway({ text, label }: { text: string; label: string }) {
  return (
    <div
      style={{
        position: "absolute",
        left: "5cqw",
        right: "5cqw",
        bottom: "4.5cqh",
        minHeight: "8.2cqh",
        borderTop: "0.18cqw solid #cfd7e1",
        display: "flex",
        alignItems: "center",
        gap: "1.4cqw",
        color: "#20242a",
      }}
    >
      <Badge color="#f6c945">{label}</Badge>
      <div
        style={{
          fontFamily: "LXGW WenKai, Inter, sans-serif",
          fontSize: "2.15cqw",
          fontWeight: 700,
          lineHeight: 1.1,
          background: "linear-gradient(transparent 58%, #ffe580 58%)",
        }}
      >
        {text}
      </div>
    </div>
  );
}

function Header({ sceneTitle, copy }: { sceneTitle: string; copy: (typeof COPY)[Lang] }) {
  return (
    <header style={{ position: "absolute", top: "4.6cqh", left: "5cqw", right: "5cqw" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "2cqw",
        }}
      >
        <div>
          <div
            style={{
              fontFamily: "JetBrains Mono, ui-monospace, monospace",
              fontSize: "1cqw",
              fontWeight: 700,
              letterSpacing: 0,
              color: "#6b7280",
              textTransform: "uppercase",
            }}
          >
            {sceneTitle}
          </div>
          <h1
            style={{
              margin: "0.5cqh 0 0",
              fontFamily: "LXGW WenKai, Inter, sans-serif",
              fontSize: "4.5cqw",
              lineHeight: 0.95,
              color: "#20242a",
            }}
          >
            {copy.title}
          </h1>
        </div>
        <div
          style={{
            width: "32cqw",
            fontSize: "1.28cqw",
            lineHeight: 1.35,
            color: "#4b5563",
          }}
        >
          {copy.subtitle}
        </div>
      </div>
    </header>
  );
}

function SceneOne({ lang }: { lang: Lang }) {
  const copy = COPY[lang];
  return (
    <>
      <Header sceneTitle={copy.scenes[0].title} copy={copy} />
      <main
        data-beat-layout-item="true"
        style={{
          position: "absolute",
          left: "5cqw",
          right: "5cqw",
          top: "24cqh",
          display: "flex",
          alignItems: "center",
          gap: "0.8cqw",
        }}
      >
        {STAGES.map((stage, index) => (
          <React.Fragment key={stage.key}>
            <div
              style={{
                width: "12cqw",
                minHeight: "20cqh",
                borderRadius: "1.2cqw",
                background: "#fff",
                padding: "2cqh 1.2cqw",
                ...cardStyle(true, stage.color),
              }}
            >
              <div style={{ fontSize: "3.5cqw", lineHeight: 1 }}>{stage.emoji}</div>
              <div
                style={{
                  marginTop: "2cqh",
                  fontFamily: "LXGW WenKai, Inter, sans-serif",
                  fontSize: "2cqw",
                  fontWeight: 700,
                }}
              >
                {stage[lang]}
              </div>
              <div
                style={{
                  marginTop: "1.2cqh",
                  fontFamily: "JetBrains Mono, ui-monospace, monospace",
                  fontSize: "0.9cqw",
                  color: "#697386",
                }}
              >
                {index === 0 ? "input" : index === STAGES.length - 1 ? "proof" : `step.${index}`}
              </div>
            </div>
            {index < STAGES.length - 1 && <Arrow />}
          </React.Fragment>
        ))}
      </main>
      <Takeaway text={copy.scenes[0].beats[0].title} label={copy.lane} />
    </>
  );
}

function SceneTwo({ lang, beat }: { lang: Lang; beat: number }) {
  const copy = COPY[lang];
  const cards = [
    { label: "USER", title: copy.scenes[1].beats[0].title, icon: "🧭", color: "#f6c945" },
    { label: "REPO", title: copy.scenes[1].beats[1].title, icon: "📚", color: "#4b8fe8" },
    { label: "PLAN", title: copy.scenes[1].beats[2].title, icon: "✍️", color: "#7b61ff" },
  ];
  return (
    <>
      <Header sceneTitle={copy.scenes[1].title} copy={copy} />
      <main
        style={{
          position: "absolute",
          left: "6cqw",
          right: "6cqw",
          top: "26cqh",
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: "2cqw",
        }}
      >
        {cards.map((card, index) => {
          const active = showAt(beat, index);
          return (
            <section
              key={card.label}
              data-beat-layout-item="true"
              style={{
                minHeight: "36cqh",
                borderRadius: "1.4cqw",
                background: active ? "#fff" : "#f7f9fc",
                padding: "2.4cqh 1.7cqw",
                opacity: active ? 1 : 0.32,
                ...cardStyle(active, card.color),
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Badge color={card.color}>{card.label}</Badge>
                <span style={{ fontSize: "3.2cqw" }}>{card.icon}</span>
              </div>
              <h2
                style={{
                  margin: "4cqh 0 0",
                  fontFamily: "LXGW WenKai, Inter, sans-serif",
                  fontSize: "2.45cqw",
                  lineHeight: 1.05,
                }}
              >
                {card.title}
              </h2>
              <p style={{ marginTop: "2cqh", fontSize: "1.2cqw", lineHeight: 1.4, color: "#4b5563" }}>
                {copy.scenes[1].beats[index].body}
              </p>
            </section>
          );
        })}
      </main>
      <Takeaway text={copy.scenes[1].beats[Math.min(beat, 2)].body} label={copy.lane} />
    </>
  );
}

function SceneThree({ lang, beat }: { lang: Lang; beat: number }) {
  const copy = COPY[lang];
  const rows = [
    { title: copy.scenes[2].beats[0].title, detail: "router.ts · state.ts", color: "#7b61ff", icon: "🗂️" },
    { title: copy.scenes[2].beats[1].title, detail: "review → task list", color: "#4b8fe8", icon: "💬" },
    { title: copy.scenes[2].beats[2].title, detail: "vitest · diff · summary", color: "#24a66a", icon: "✅" },
  ];
  return (
    <>
      <Header sceneTitle={copy.scenes[2].title} copy={copy} />
      <main
        data-testid="engineering-whiteboard-patch-lane"
        data-total-width-cqw={PATCH_LANE_TOTAL_CQW}
        style={{
          position: "absolute",
          left: `${PATCH_LANE_INSET_CQW}cqw`,
          right: `${PATCH_LANE_INSET_CQW}cqw`,
          top: "24.5cqh",
          display: "grid",
          gridTemplateColumns: PATCH_LANE_COLUMNS_CQW.map((value) => `${value}cqw`).join(" "),
          alignItems: "center",
        }}
      >
        {rows.map((row, index) => {
          const active = showAt(beat, index);
          return (
            <React.Fragment key={row.title}>
              <section
                data-beat-layout-item="true"
                style={{
                  minHeight: "39cqh",
                  borderRadius: "1.3cqw",
                  background: "#fff",
                  padding: "2.2cqh 1.5cqw",
                  opacity: active ? 1 : 0.28,
                  ...cardStyle(active, row.color),
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Badge color={row.color}>PATCH.{index + 1}</Badge>
                  <span style={{ fontSize: "3.1cqw" }}>{row.icon}</span>
                </div>
                <h2
                  style={{
                    margin: "4cqh 0 0",
                    fontFamily: "LXGW WenKai, Inter, sans-serif",
                    fontSize: "2.25cqw",
                    lineHeight: 1.08,
                  }}
                >
                  {row.title}
                </h2>
                <p
                  style={{
                    marginTop: "2.2cqh",
                    fontFamily: "JetBrains Mono, ui-monospace, monospace",
                    fontSize: "1.05cqw",
                    color: "#475569",
                  }}
                >
                  {row.detail}
                </p>
              </section>
              {index < rows.length - 1 && <Arrow active={showAt(beat, index + 1)} />}
            </React.Fragment>
          );
        })}
      </main>
      <Takeaway text={copy.scenes[2].beats[Math.min(beat, 2)].body} label={copy.lane} />
    </>
  );
}

function SceneFour({ lang, beat }: { lang: Lang; beat: number }) {
  const copy = COPY[lang];
  const checks = [
    { title: copy.scenes[3].beats[0].title, cmd: "npm test -- registry", color: "#24a66a" },
    { title: copy.scenes[3].beats[1].title, cmd: "npm run typecheck && build", color: "#4b8fe8" },
    { title: copy.scenes[3].beats[2].title, cmd: "risk: visual audit pending", color: "#ef5b5b" },
  ];
  return (
    <>
      <Header sceneTitle={copy.scenes[3].title} copy={copy} />
      <main
        style={{
          position: "absolute",
          left: "8cqw",
          right: "8cqw",
          top: "25cqh",
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: "2cqh",
        }}
      >
        {checks.map((check, index) => {
          const active = showAt(beat, index);
          return (
            <section
              key={check.cmd}
              data-beat-layout-item="true"
              style={{
                display: "grid",
                gridTemplateColumns: "8cqw 1fr 24cqw",
                alignItems: "center",
                gap: "1.6cqw",
                minHeight: "12cqh",
                borderRadius: "1.1cqw",
                background: active ? "#fff" : "#f7f9fc",
                padding: "1.5cqh 1.4cqw",
                opacity: active ? 1 : 0.28,
                ...cardStyle(active, check.color),
              }}
            >
              <Badge color={check.color}>{active ? "PASS" : "WAIT"}</Badge>
              <h2
                style={{
                  margin: 0,
                  fontFamily: "LXGW WenKai, Inter, sans-serif",
                  fontSize: "2.1cqw",
                }}
              >
                {check.title}
              </h2>
              <code
                style={{
                  fontFamily: "JetBrains Mono, ui-monospace, monospace",
                  fontSize: "1.05cqw",
                  color: "#334155",
                  textAlign: "right",
                }}
              >
                {check.cmd}
              </code>
            </section>
          );
        })}
      </main>
      <Takeaway text={copy.scenes[3].beats[Math.min(beat, 2)].body} label={copy.lane} />
    </>
  );
}

function SceneFive({ lang, beat }: { lang: Lang; beat: number }) {
  const copy = COPY[lang];
  const active = showAt(beat, 1);
  return (
    <>
      <Header sceneTitle={copy.scenes[4].title} copy={copy} />
      <main
        style={{
          position: "absolute",
          left: "12cqw",
          right: "12cqw",
          top: "27cqh",
          minHeight: "39cqh",
          borderRadius: "1.8cqw",
          background: "#fff",
          border: "0.18cqw solid #d7dde5",
          boxShadow: "0 0.8cqh 0 #dce3ec",
          padding: "5cqh 4cqw",
          display: "grid",
          placeItems: "center",
          textAlign: "center",
        }}
      >
        <Badge color={active ? "#24a66a" : "#f6c945"}>{active ? "READY" : "RECEIPT"}</Badge>
        <h2
          data-beat-layout-item="true"
          style={{
            margin: "3cqh 0 0",
            maxWidth: "62cqw",
            fontFamily: "LXGW WenKai, Inter, sans-serif",
            fontSize: "4cqw",
            lineHeight: 1.05,
            background: active ? "linear-gradient(transparent 58%, #ffe580 58%)" : "none",
          }}
        >
          {active ? copy.finalTakeaway : copy.scenes[4].beats[0].title}
        </h2>
        <p
          data-beat-layout-item="true"
          style={{
            margin: "2.4cqh 0 0",
            maxWidth: "52cqw",
            fontSize: "1.35cqw",
            lineHeight: 1.45,
            color: "#4b5563",
          }}
        >
          {copy.scenes[4].beats[active ? 1 : 0].body}
        </p>
      </main>
    </>
  );
}

function renderScene(scene: number, beat: number, lang: Lang) {
  switch (scene) {
    case 1:
      return <SceneOne lang={lang} />;
    case 2:
      return <SceneTwo lang={lang} beat={beat} />;
    case 3:
      return <SceneThree lang={lang} beat={beat} />;
    case 4:
      return <SceneFour lang={lang} beat={beat} />;
    case 5:
      return <SceneFive lang={lang} beat={beat} />;
    default:
      return <SceneOne lang={lang} />;
  }
}

export default function EngineeringWhiteboardExplainer({
  scene,
  beat,
  language,
  isThumbnail,
  reducedMotion,
}: BespokeStyleProps) {
  useFonts();
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background:
          "linear-gradient(90deg, rgba(75,143,232,0.06) 0.12cqw, transparent 0.12cqw), linear-gradient(rgba(75,143,232,0.05) 0.12cqh, transparent 0.12cqh), #fbfcff",
        backgroundSize: "4cqw 4cqh",
        color: "#20242a",
        fontFamily: "Inter, system-ui, sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <SpatialSceneTrack
        scene={scene}
        beat={beat}
        transitionMap={TRANSITION_MAP}
        reducedMotion={reducedMotion || isThumbnail}
        beatLayoutModes={BEAT_LAYOUT_MODES}
        renderScene={(sceneId, sceneBeat) => renderScene(sceneId, sceneBeat, language)}
      />
    </div>
  );
}

export const engineeringWhiteboardExplainerTopic = defineStyleTopic({
  id: TOPIC_ID,
  topic: { en: "From Prompt to Patch", zh: "提示到补丁" },
  model: "GPT-5",
  component: EngineeringWhiteboardExplainer,
  getMetadata,
});

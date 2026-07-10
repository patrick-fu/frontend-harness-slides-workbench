# Style Authoring Specification

> 本文档定义了 Agent 如何为 Frontend Harness Slides Workbench 创建一个风格题材（Style Topic）。
> Agent 只需关注自己的单体文件，无需了解 Workbench 整体架构。

---

## 1. 核心概念

| 术语 | 说明 |
|------|------|
| **Style（风格）** | 视觉家族，如 `minimal-product-keynote`、`engineering-whiteboard-explainer`。由语义 slug ID 标识。 |
| **Topic（题材）** | 某个风格下的一个具体内容实现。每个 Agent 产出一个 Topic，包含独立题材、内容和视觉表现。 |
| **Scene（场景）** | 一个 Topic 包含 5 个场景（1-5），对应 slides 的 5 页。 |
| **Beat（节拍）** | 每个场景内的动态步骤。场景 1 可能只有 1 个 beat，场景 3 可能有 3 个 beats。 |

---

## 2. 协议：Topic 模块是 Agent 面向接口

Agent 产出的单位是一个黑盒 Style Topic module。模块内部可以拆分组件和 CSS，但对 Workbench 只暴露一个 `defineStyleTopic(...)` 结果：

```ts
import { defineStyleTopic } from "./topic";

export const engineeringWhiteboardExplainerTopic = defineStyleTopic({
  id: "from-prompt-to-patch",
  topic: { en: "From Prompt to Patch", zh: "从提示到补丁" },
  model: "GPT-5.5",
  component: EngineeringWhiteboardExplainer,
  getMetadata,
});
```

稳定要求：

- `id` 必须显式、稳定、小写，可用数字和 hyphen，例如 `decision-art`。
- 不允许使用 `v1`、`v2` 这类旧版本 ID。
- `topic` 是 TopicBar / Sidebar 显示的中英文题材名。
- `component` 是 Topic 组件。
- `getMetadata(lang)` 返回该 Topic 完整 metadata。
- 所有 Topic 都必须显式声明完整字段；不允许依赖数组顺序生成 ID。

Topic 组件接收以下 Props：

```ts
interface BespokeStyleProps {
  scene: number;        // 当前场景 (1-5)
  beat: number;         // 当前节拍 (0-based)
  language: "en" | "zh"; // 显示语言
  isThumbnail: boolean;  // 是否为概览缩略图
  reducedMotion: boolean; // 是否减少动画
  onNavigate?: (scene: number, beat: number) => void; // 内部导航回调
}
```

`isTransitionClone` 是旧 outgoing-clone 模型遗留字段。新增版本不要读取或传递它。

**输出**：一个 `defineStyleTopic(...)` 导出的 Topic 模块；可以同时保留 `export default` 组件和 `getMetadata(lang)` 便于测试。

---

## 3. 文件结构

每个 Topic 至少包含一个 `.tsx` 模块，放在 `src/styles/` 目录下。复杂样式可配套 CSS Module；不要把转场生命周期写进每一页场景。

### 命名规则

```
{style-slug}-{topic-id}.tsx
```

示例：
```
minimal-product-keynote-decision-art.tsx
engineering-whiteboard-explainer-from-prompt-to-patch.tsx
```

如果有配套 CSS Module：
```
engineering-whiteboard-explainer-from-prompt-to-patch.module.css
```

已有 legacy 文件名可能保留数字前缀；新增 Style ID、Topic ID 和 URL 均使用语义 slug。最终顺序只由 `STYLE_REGISTRY` 数组维护。

### 文件内部结构

```tsx
// 1. 导入
import React, { useEffect, useCallback } from "react";
import type { BespokeStyleProps, StyleMetadata } from "../types";
import SpatialSceneTrack from "./SpatialSceneTrack";
import { defineStyleTopic } from "./topic";
import styles from "./engineering-whiteboard-explainer-from-prompt-to-patch.module.css"; // 可选

// 2. 字体注入（可选）
function useFonts() {
  useEffect(() => {
    const id = "engineering-whiteboard-explainer-fonts";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=...";
    document.head.appendChild(link);
  }, []);
}

// 3. 内容数据（双语）
const SCENES = {
  1: {
    en: { title: "...", subtitle: "..." },
    zh: { title: "...", subtitle: "..." },
  },
  // ... 场景 2-5
};

// 4. Metadata 导出
export function getMetadata(lang: "en" | "zh"): StyleMetadata {
  return {
    id: "engineering-whiteboard-explainer",
    band: "balanced-hybrid",
    name: lang === "zh" ? "工程白板讲解" : "Engineering Whiteboard Explainer",
    theme: lang === "zh" ? "从提示到补丁" : "From Prompt to Patch",
    densityLabel: lang === "zh" ? "中密度" : "Medium",
    heroScene: 3,
    colors: { bg: "#f8fafc", ink: "#1e293b", panel: "#ffffff" },
    typography: { header: "Inter 700", body: "Inter 400" },
    tags: ["engineering", "whiteboard", "explainer"],
    fonts: ["Inter", "JetBrains Mono"],
    scenes: [/* 5 个场景的 beats 定义 */],
  };
}

// 5. 组件默认导出
export default function EngineeringWhiteboardExplainer({
  scene,
  beat,
  language,
  isThumbnail,
  reducedMotion,
  onNavigate,
}: BespokeStyleProps) {
  useFonts();
  const content = SCENES[scene]?.[language] || SCENES[1][language];

  // 渲染逻辑...
  return (
    <div className={styles.root}>
      <SpatialSceneTrack
        scene={scene}
        beat={beat}
        transitionKind="scale-fade"
        reducedMotion={reducedMotion || isThumbnail}
        renderScene={(sceneId, sceneBeat, isActive) => (
          <ScenePanel scene={sceneId} beat={sceneBeat} isActive={isActive} />
        )}
      />
    </div>
  );
}

export const engineeringWhiteboardExplainerTopic = defineStyleTopic({
  id: "from-prompt-to-patch",
  topic: { en: "From Prompt to Patch", zh: "从提示到补丁" },
  model: "GPT-5.5",
  component: EngineeringWhiteboardExplainer,
  getMetadata,
});
```

---

## 4. Topic 元信息

每个 Topic 需要通过 `defineStyleTopic(...)` 声明以下元信息：

```ts
interface StyleTopicModule {
  id: string;              // 稳定 Topic ID，如 "decision-art", "product-launch"
  topic: { en: string; zh: string }; // 题材短名，如 { en: "Decision Art", zh: "决策艺术" }
  model: string;           // 编写模型，如 "Doubao-Seed-Evolving", "GPT-5.5"
  component: React.ComponentType<BespokeStyleProps>;  // 默认导出的组件
  getMetadata: (lang: "en" | "zh") => StyleMetadata;  // metadata 函数
  navigation?: TopicNavigationProfile;
  sources?: readonly TopicSource[];
  transitionScore?: Readonly<TopicTransitionScore>;
}
```

通用 legacy Topic 可以不声明后三项。`CROSS_DOMAIN_TOPIC_SET_PLAN` 统筹的
49 个新 Topic 必须声明精确 `navigation`、claim-scoped `sources` 和四条 edge
的 `transitionScore`；具体值以计划对应 Style 小节为准。

---

## 5. 设计约束

### 5.1 Stage 尺寸

- 固定 **1920×1080** 舞台
- 使用 **`cqw`**（container query width）和 **`cqh`**（container query height）单位
- **禁止**使用 `px`、`vw`、`vh`、`rem`、`em` 做尺寸
- 1cqw = 19.2px, 1cqh = 10.8px

```css
/* ✅ 正确 */
.title { font-size: 8cqw; margin-top: 3cqh; }

/* ❌ 错误 */
.title { font-size: 150px; margin-top: 32px; }
```

### 5.2 场景转场

- 默认使用 `SpatialSceneTrack` 管理 scene 生命周期。
- `SpatialSceneTrack` 会渲染稳定 scene panels，并通过 `transitionKind` 或 `transitionMap` 选择视觉转场。
- 不要在 Style 内维护 `outgoingScene`、不要渲染 full-screen outgoing clone、不要读取 `isTransitionClone`。
- `reducedMotion` 或 thumbnail/frozen 场景下传入 `reducedMotion={true}`，track 会关闭 transition。
- 每个 Style 必须显式声明 `transitionKind`，或为每条 scene edge 声明 `transitionMap`，避免全仓库退化成同一种横向滑动。
- 当前 canonical vocabulary 共 21 种：`hard-cut`、`crossfade`、
  `dip-to-color`、`push-x`、`push-y`、`diagonal-pan`、`zoom-through`、
  `dolly-pull`、`focus-swap`、`linear-wipe`、`iris-open`、`multi-blind`、
  `page-turn`、`paper-fold`、`ink-spread`、`grid-reveal`、`split-merge`、
  `card-carousel`、`glitch`、`scanline`、`afterimage`。现有 Topic 仍可使用
  legacy `slide-x`、`slide-y`、`fade`、`scale-fade`、`wipe`、`page-flip`。

```tsx
// ✅ 正确
<SpatialSceneTrack
  scene={scene}
  beat={beat}
  transitionKind="scale-fade"
  transitionMap={{
    "1->2": "scale-fade",
    "2->3": "wipe",
    "3->4": "fade",
    "4->5": "hard-cut",
  }}
  reducedMotion={reducedMotion || isThumbnail}
  renderScene={(sceneId, sceneBeat, isActive) => (
    <ScenePanel scene={sceneId} beat={sceneBeat} isActive={isActive} />
  )}
/>

// ❌ 错误
const [outgoingScene, setOutgoingScene] = useState(null);
return <>
  {outgoingScene && <Scene scene={outgoingScene} data-transition-clone="true" />}
  <Scene key={scene} scene={scene} />
</>;
```

旧实现中的 `key={scene}` / `outgoingScene` / `isTransitionClone` clone-lifecycle 已迁移出 legacy style；不要重新引入。

### 5.3 Beat 动态揭示

- Beat 内的元素用 CSS `transition` 或 `animation` 实现逐步揭示
- 条件渲染基于 `beat` 索引判断
- 新协议版本的 multi-beat scene 必须选择一种 beat layout strategy，并暴露 `data-beat-layout-container="true"`、`data-beat-layout-mode="motion|reserved"` 和稳定子元素 `data-beat-layout-item="true"`，用于自动化测试约束
- `reducedMotion` 或 `isThumbnail` 为真时必须禁用动画；最终布局仍必须稳定、可读、不溢出

#### Mode A: `motion`

适用：新增 beat 会自然推开标题、正文、列表或卡片，且这个抬升/挪动本身是叙事的一部分。

要求：对参与重排的稳定元素做 FLIP/layout motion，不能只给新增元素做 fade/slide。旧内容的位置变化必须有非线性、自然的过渡。

```tsx
const { ref: contentRef } = useFLIP<HTMLDivElement>({
  watch: [beat],
  disabled: reducedMotion || isThumbnail,
  duration: 520,
  easing: "cubic-bezier(0.34, 1.56, 0.64, 1)",
  selector: '[data-beat-layout-item="true"]',
});

<div
  ref={contentRef}
  data-beat-layout-container="true"
  data-beat-layout-mode="motion"
>
  <h1 data-beat-layout-item="true">{content.title}</h1>
  <p data-beat-layout-item="true">{content.body}</p>
  {beat >= 1 && (
    <p className={styles.subtitle} style={{
      opacity: 1,
      transition: reducedMotion ? "none" : "opacity 0.6s ease",
    }}>
      {content.subtitle}
    </p>
  )}
</div>
```

#### Mode B: `reserved`

适用：阅读型、表格型、仪表盘型、对齐精密的版式；新增 beat 不应该推动任何已有元素。

要求：从 beat 0 就预留最终版式的空间。后续 beat 只改变槽位内元素的 `opacity`、小幅 `transform` 或强调状态，不能改变兄弟元素的位置。预留空间要用固定 grid track、固定行高、`min-height`、固定 slot、`visibility: hidden` 或 `opacity: 0`；不要用 `display: none` 移除会占位的内容。

```tsx
<div data-beat-layout-container="true" data-beat-layout-mode="reserved">
  <h1 data-beat-layout-item="true">{content.title}</h1>
  <p data-beat-layout-item="true">{content.body}</p>
  <div className={styles.reservedList} data-beat-layout-item="true">
    {items.map((item, index) => (
      <p
        key={item.id}
        className={index <= beat ? styles.visibleItem : styles.hiddenReservedItem}
      >
        {item.label}
      </p>
    ))}
  </div>
</div>
```

选择规则：如果“整体上抬”能增强节奏，选 `motion`；如果页面需要像专业排版一样稳定，选 `reserved`。两种都合法，禁止第三种：新增内容导致已有内容硬切到新位置。

### 5.4 减少动画支持

- 检查 `reducedMotion` prop
- 为真时：禁用所有动画和过渡，设置 `transitionDuration: "0s"`、`animationDuration: "0s"`
- 缩略图模式（`isThumbnail`）也应减少动画

### 5.5 内部导航

- 如果实现了场景导航条，使用 `onNavigate?.(targetScene, 0)` 跳转
- 导航元素在 `isThumbnail` 时必须隐藏（`return null`）
- 新 Topic Set 的导航元素必须标记 `data-topic-navigation="true"`，并把已声明的
  `geometry`、`carrier`、`invocation`、`feedback` 分别暴露为
  `data-navigation-geometry`、`data-navigation-carrier`、
  `data-navigation-invocation`、`data-navigation-feedback`。这些属性只用于协议与
  可访问性审计，不限制导航的视觉构图。
- 导航形式自由发挥：底部圆点、侧边标签、时间轴、滚轮选择器等

### 5.6 字体

- 通过 `useFonts()` hook 动态注入 Google Fonts 或其他 CDN
- CJK 字体在 `fonts` 数组中加 `cjk:` 前缀，如 `"cjk:Noto Serif SC"`
- 在 `getMetadata().fonts` 中声明所有使用的字体

### 5.7 颜色

- 使用 CSS 变量定义风格色板：`--style-{id}-bg`, `--style-{id}-ink`, `--style-{id}-accent`
- 在 `getMetadata().colors` 中声明 `{ bg, ink, panel }` 供概览卡片使用

---

## 6. Metadata 规范

```ts
export function getMetadata(lang: "en" | "zh"): StyleMetadata {
  return {
    id: "01",                    // 风格 ID（两位数字）
    band: "minimal-keynote",     // 视觉家族（见下方枚举）
    name: "Executive Silence",   // 风格名（本地化）
    theme: "The Art of Decision",// 题材/主题描述（本地化）
    densityLabel: "Sparse",      // 密度标签（本地化）
    heroScene: 1,                // 概览缩略图展示哪个场景
    colors: {                    // 色板（用于卡片和 chrome）
      bg: "#0a0a0a",
      ink: "#f5f5f0",
      panel: "#141414",
    },
    typography: {                // 字体提示
      header: "Inter 500",
      body: "Inter 300",
    },
    tags: ["minimal", "premium"],// 过滤标签
    fonts: ["Inter"],            // 使用的字体
    scenes: [                    // 5 个场景定义
      {
        id: 1,
        title: "Title Card",     // 场景标题（本地化）
        beats: [                 // 节拍列表
          {
            id: 0,               // beat ID（0-based）
            action: "Title appears",  // 节拍动作描述
            title: "The Art of Decision", // 此 beat 的标题
            body: "",             // 此 beat 的正文
          },
        ],
      },
      // ... 场景 2-5
    ],
  };
}
```

### Band 枚举

| Band | 说明 | 风格范围 |
|------|------|----------|
| `minimal-keynote` | 极简主题演讲 | 01-08 |
| `balanced-hybrid` | 平衡混合 | 09-16 + registry 插入项 |
| `editorial-print` | 编辑/印刷 | 17-24 |
| `craft-cultural` | 工艺/文化 | 25-32 |
| `contemporary-digital` | 当代数字 | 33-40 |
| `text-report` | 文本/报告 | 41-48 |

---

## 7. 注册到 Workbench

完成 Topic 模块后，在 `src/styles/registry.ts` 中注册。当前 registry 仍是集中枚举文件，属于已知冲突热点；新增 Topic 应把所有元信息放进自己的 Topic 模块，registry 只做一行 import 和数组追加。

并行 Topic Set 施工时，Topic agent 只修改自己的 TSX/CSS/test；主 integrator
统一修改 registry、registry test 与 E2E audit，避免共享文件冲突。

### 7.1 导入

```ts
import { engineeringWhiteboardExplainerTopic } from "./engineering-whiteboard-explainer";
```

### 7.2 注册到 Topic 数组

```ts
buildEntry("engineering-whiteboard-explainer", [
  engineeringWhiteboardExplainerTopic,
]);
```

不要新增手写 `{ id, topic, model, component, getMetadata }` 对象到 registry。用 Topic 模块导出的常量。

---

## 8. 题材自由

**风格和题材是解耦的。**

- 风格定义视觉约束（如"极简、深色、高管感"）
- 题材由 Agent 自由选择（可以讲任何故事）
- 同一个风格下可以有完全不同题材的 Topic

本节只适用于没有统筹 assignment 的普通 Topic。参与
`CROSS_DOMAIN_TOPIC_SET_PLAN` 的 Topic 已锁定题材、5-Scene 叙事、Viewing
Mode、Visual Engine、Motion、Navigation、Transition Score、事实边界与
forbidden defaults；实现 agent 不得自行换题或放宽这些约束。

示例：
- 风格 `minimal-product-keynote` + 题材 "Product Keynote"
- 风格 01 (Executive Silence) + 题材 "产品发布会"
- 风格 16 (Case Study) + 题材 "Globex 转化率翻三倍"
- 风格 16 (Case Study) + 题材 "Stripe 如何做开发者体验"

---

## 9. 表现层自由度

以下方面**完全由 Agent 自由发挥**：

- 导航条的具体形式和位置
- 转场动画的具体效果
- 布局结构
- 色彩搭配（在风格约束内）
- 交互细节
- CSS 实现方式（inline style / CSS module / styled-jsx）

**通用硬性约束**：第 5 节列出的设计约束（cqw/cqh 单位、
SpatialSceneTrack 或等价空间轨道、reducedMotion 支持等）。统筹 Topic Set
还必须满足计划正文与本规范第 4 节扩展元信息；表现层自由不能覆盖这些契约。

---

## 10. 检查清单

提交前确认：

- [ ] 文件命名符合 `{style-slug}-{topic-id}.tsx`，legacy 文件除外
- [ ] 导出 `defineStyleTopic(...)` Topic 模块
- [ ] Topic `id` 显式稳定，不依赖数组顺序，不使用 `v1` / `v2`
- [ ] 可选 `export default` 组件
- [ ] `export function getMetadata(lang)` 导出
- [ ] 组件接收 `BespokeStyleProps` 所有 props
- [ ] 使用 `cqw`/`cqh` 单位，无 `px`/`vw`/`vh`
- [ ] 场景转场使用 `SpatialSceneTrack` 或等价相邻 panel track
- [ ] 不使用 `outgoingScene` / full-screen transition clone / `isTransitionClone`
- [ ] Beat 揭示基于 `beat` 条件
- [ ] `reducedMotion` 时禁用动画
- [ ] `isThumbnail` 时隐藏导航
- [ ] 双语内容（en + zh）
- [ ] `getMetadata` 包含完整的 5 个场景 beats 定义
- [ ] 字体在 `getMetadata().fonts` 中声明
- [ ] 统筹 Topic 声明精确 `navigation`、`sources`、`transitionScore`
- [ ] 至少 3 个 claim-scoped HTTPS 权威 sources，字段完整且事实边界保守
- [ ] 根导航渲染 `data-topic-navigation` 及 geometry/carrier/invocation/feedback
- [ ] 导航具备 click/tap 与 keyboard fallback，并隔离全局导航事件
- [ ] multi-beat Scene 声明稳定的 `motion` 或 `reserved` beat layout
- [ ] reduced-motion、thumbnail、frozen 都渲染确定性 settled frame
- [ ] focused unit test、typecheck、`git diff --check` 通过
- [ ] 完成 1920×1080 EN/ZH、导航、console、overflow 视觉 Review
- [ ] 无临时 preview、无限动画、remote hotlink 或未知许可资产
- [ ] 主 integrator 已在 `registry.ts`、registry test 与 E2E audit 完成集中注册

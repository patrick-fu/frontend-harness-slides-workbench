# Style Authoring Specification

> 本文档定义了 Agent 如何为 Frontend Harness Slides Workbench 创建一个风格版本（Style Version）。
> Agent 只需关注自己的单体文件，无需了解 Workbench 整体架构。

---

## 1. 核心概念

| 术语 | 说明 |
|------|------|
| **Style（风格）** | 视觉家族，如 "01 Executive Silence"、"17 Editorial Broadsheet"。由两位数字 ID 标识。 |
| **Version（版本）** | 某个风格下的一个具体实现。每个 Agent 产出一个版本，包含独立的题材、内容和视觉表现。 |
| **Topic（题材）** | 版本的主题/内容，如 "决策的艺术"、"产品发布会"。用几个字概括。 |
| **Scene（场景）** | 一个版本包含 5 个场景（1-5），对应 slides 的 5 页。 |
| **Beat（节拍）** | 每个场景内的动态步骤。场景 1 可能只有 1 个 beat，场景 3 可能有 3 个 beats。 |

---

## 2. 协议：输入与输出

Agent 产出的文件是一个标准的 React 组件，接收以下 Props：

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

**输出**：一个 `export default` 的 React 组件 + 一个 `getMetadata(lang)` 函数。

---

## 3. 文件结构

每个版本是一个**单体 `.tsx` 文件**，放在 `src/styles/` 目录下。

### 命名规则

```
{styleId}-{kebab-topic}-v{n}.tsx
```

示例：
```
01-executive-silence-decision-art-v1.tsx     ← 风格01，题材"决策的艺术"，版本1
01-executive-silence-product-launch-v2.tsx   ← 风格01，题材"产品发布"，版本2
16-case-study-globex-v1.tsx                  ← 风格16，题材"Globex案例"，版本1
```

如果有配套 CSS Module：
```
01-executive-silence-decision-art-v1.module.css
```

### 文件内部结构

```tsx
// 1. 导入
import React, { useEffect, useCallback } from "react";
import type { BespokeStyleProps, StyleMetadata } from "../types";
import styles from "./01-executive-silence-decision-art-v1.module.css"; // 可选

// 2. 字体注入（可选）
function useFonts() {
  useEffect(() => {
    const id = "style-01-v2-fonts";
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
    id: "01",
    band: "minimal-keynote",
    name: lang === "zh" ? "高管静默" : "Executive Silence",
    theme: lang === "zh" ? "决策的艺术" : "The Art of Decision",
    densityLabel: lang === "zh" ? "稀疏" : "Sparse",
    heroScene: 1,
    colors: { bg: "#0a0a0a", ink: "#f5f5f0", panel: "#141414" },
    typography: { header: "Inter 500", body: "Inter 300" },
    tags: ["minimal", "premium", "executive"],
    fonts: ["Inter"],
    scenes: [/* 5 个场景的 beats 定义 */],
  };
}

// 5. 组件默认导出
export default function ExecutiveSilenceDecisionArt({
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
    <div className={styles.root} key={scene}>
      {/* 场景内容 */}
    </div>
  );
}
```

---

## 4. 版本元信息

每个版本需要在**注册表**中声明以下元信息：

```ts
interface StyleVersion {
  id: string;              // 版本 ID，如 "v1", "v2"
  topic: string;           // 题材名（几个字），如 "决策的艺术"
  model: string;           // 编写模型，如 "Doubao-Seed-Evolving", "GPT-5.5"
  component: React.ComponentType<BespokeStyleProps>;  // 默认导出的组件
  getMetadata: (lang: "en" | "zh") => StyleMetadata;  // metadata 函数
}
```

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

- 使用 `key={scene}` 强制组件在场景切换时重新挂载
- 配合 CSS `@keyframes` + `animation: ... forwards` 实现入场动画
- **禁止**使用 `useLayoutEffect` + `entered` state 模式（会导致闪烁）

```tsx
// ✅ 正确
<div key={scene} className={styles.animateEnter}>
  {content}
</div>

// ❌ 错误
const [entered, setEntered] = useState(false);
useLayoutEffect(() => { setEntered(false); rAF(() => setEntered(true)); }, [scene]);
```

### 5.3 Beat 动态揭示

- Beat 内的元素用 CSS `transition` 或 `animation` 实现逐步揭示
- 条件渲染基于 `beat` 索引判断

```tsx
{beat >= 1 && (
  <p className={styles.subtitle} style={{
    opacity: 1,
    transition: reducedMotion ? "none" : "opacity 0.6s ease",
  }}>
    {content.subtitle}
  </p>
)}
```

### 5.4 减少动画支持

- 检查 `reducedMotion` prop
- 为真时：禁用所有动画和过渡，设置 `transitionDuration: "0s"`、`animationDuration: "0s"`
- 缩略图模式（`isThumbnail`）也应减少动画

### 5.5 内部导航

- 如果实现了场景导航条，使用 `onNavigate?.(targetScene, 0)` 跳转
- 导航元素在 `isThumbnail` 时必须隐藏（`return null`）
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
| `balanced-hybrid` | 平衡混合 | 09-16 |
| `editorial-print` | 编辑/印刷 | 17-24 |
| `craft-cultural` | 工艺/文化 | 25-32 |
| `contemporary-digital` | 当代数字 | 33-40 |
| `text-report` | 文本/报告 | 41-48 |

---

## 7. 注册到 Workbench

完成单体文件后，在 `src/styles/registry.ts` 中注册：

### 7.1 导入

```ts
import ExecutiveSilenceDecisionArtV1, {
  getMetadata as getMetadata01V1,
} from "./01-executive-silence-decision-art-v1";
```

### 7.2 注册到版本数组

```ts
// 在 STYLE_REGISTRY 中，风格 01 的条目：
{
  id: "01",
  name: { en: "Executive Silence", zh: "高管静默" },
  versions: [
    {
      id: "v1",
      topic: "决策的艺术",
      model: "Doubao-Seed-Evolving",
      component: ExecutiveSilenceDecisionArtV1,
      getMetadata: getMetadata01V1,
    },
    // 新版本追加在这里
    // {
    //   id: "v2",
    //   topic: "产品发布会",
    //   model: "GPT-5.5",
    //   component: ExecutiveSilenceProductLaunchV2,
    //   getMetadata: getMetadata01V2,
    // },
  ],
}
```

---

## 8. 题材自由

**风格和题材是解耦的。**

- 风格定义视觉约束（如"极简、深色、高管感"）
- 题材由 Agent 自由选择（可以讲任何故事）
- 同一个风格下可以有完全不同题材的版本

示例：
- 风格 01 (Executive Silence) + 题材 "决策的艺术"
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

**唯一硬性约束**：第 5 节列出的设计约束（cqw/cqh 单位、key={scene} 转场模式、reducedMotion 支持等）。

---

## 10. 检查清单

提交前确认：

- [ ] 文件命名符合 `{styleId}-{topic}-v{n}.tsx`
- [ ] `export default` 组件
- [ ] `export function getMetadata(lang)` 导出
- [ ] 组件接收 `BespokeStyleProps` 所有 props
- [ ] 使用 `cqw`/`cqh` 单位，无 `px`/`vw`/`vh`
- [ ] 场景转场使用 `key={scene}` + CSS `@keyframes`
- [ ] Beat 揭示基于 `beat` 条件
- [ ] `reducedMotion` 时禁用动画
- [ ] `isThumbnail` 时隐藏导航
- [ ] 双语内容（en + zh）
- [ ] `getMetadata` 包含完整的 5 个场景 beats 定义
- [ ] 字体在 `getMetadata().fonts` 中声明
- [ ] 已在 `registry.ts` 中注册

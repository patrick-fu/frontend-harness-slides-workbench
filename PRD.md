# Frontend Harness Slides Workbench — PRD

## 去中心化高保真单体演示引擎工作台技术规约

---

## 0. 项目定位

本项目是 **Frontend Harness Slides** 体系的配套演示工作台（Workbench / Demo Site）。它不是一份幻灯片，而是一个同时展示 48 份独立幻灯片风格的"电影院"框架。

每份幻灯片风格（Style）由独立的 sub-agent 在隔离环境中制作——agent 不知道自己被包裹在 Workbench 中，它以为自己在做一个独立的、自包含的幻灯片项目。Workbench 只负责提供外壳导航、目录、过滤和展示功能。

**核心设计原则：隔离性。** 每个 Style 是一个自包含的 React 组件，拥有自己的字体、动画、场景切换逻辑和内嵌导航。Workbench 通过极简的 props 接口与 Style 通信，绝不干涉其内部实现。

**开发纪律：TDD。** 所有代码（Envelope 框架和每个 Style 组件）必须先写测试再实现。

---

## 1. 刚性信封层与接口规范

### 1.1 容器查询与视口自适应

*   **16:9 物理黄金比例**：Stage 强制约束在 `16:9` 标准物理比例中（标称设计尺寸 `1920×1080`），通过计算视口缩放因子（Scale Factor）进行绝对等比缩放。
*   **去像素化单位律**：严禁在 Style 组件内部使用任何固定像素单位（`px`）或视口相关单位（`vw`, `vh`）。**必须全量使用容器查询单位（`cqw`, `cqh`）定义所有的字体大小、内外边距、圆角和元素尺寸**。
*   **全画幅剪裁机制**：Style 根容器必须声明 `w-full h-full relative overflow-hidden select-none`，配合 `@container` 的声明，将所有视觉元素强行约束在幻灯片画布内部。

### 1.2 混合模式架构（Envelope/Stage Boundary）

Workbench 采用"电影院"架构——外壳（Envelope）和舞台（Stage）是两个独立的坐标系统：

| 层级 | 内容 | 单位系统 | 响应方式 |
|------|------|----------|----------|
| Envelope 外壳 | Header、侧边目录栏、底部进度条 | `px` / `rem` / Tailwind 响应式 | 随视口大小自适应布局 |
| Stage 舞台 | Style 组件的所有视觉元素 + 风格内嵌导航 | `cqw` / `cqh` | 随 Stage 整体等比缩放 |

**这不是 Viewport Trap 违规**——因为 Workbench 是元应用（meta-application），不是幻灯片本身。

### 1.3 Stage 缩放机制

Stage 始终保持其标称 `1920×1080` 尺寸。缩放通过外层 wrapper 的 CSS `transform: scale()` 实现：

1.  计算可用空间：视口尺寸减去 Envelope chrome（header、sidebar、bottom bar）的占位。
2.  `scale = min(availableWidth / 1920, availableHeight / 1080)`。
3.  Stage 容器保持 `1920×1080` 原始尺寸（这是 `container-type: size` 看到的尺寸）。
4.  外层 wrapper 应用 `transform: scale(scale)` 并居中。

**关键含义**：Stage 内部的 `1cqw` 始终等于 `19.2px`（1920 的 1%），无论 Stage 在屏幕上看起来多小。这保证了 Style 布局的稳定性。

Overview 缩略图卡片使用相同的缩放策略——Stage 仍是 `1920×1080`，只是 `scale` 更小（约 `0.15`）。

### 1.4 数据契约与生命周期接口

#### 1.4.1 Style 组件输入规范（Props Interface）

```typescript
interface BespokeStyleProps {
  scene: number;          // 当前激活场景索引 (1 至 5)
  beat: number;           // 当前场景下的激活节拍索引 (0-based，动态长度)
  language: "en" | "zh";  // 语言环境
  isThumbnail: boolean;   // 是否处于缩略图渲染模式
  reducedMotion: boolean; // 系统是否开启"减少动画"
  onNavigate?: (scene: number, beat: number) => void; // 内嵌导航回调
}
```

当 `isThumbnail={true}` 时，`onNavigate` 为 `undefined`，Style 必须抑制所有内嵌导航 UI 和交互元素。

当 `reducedMotion={true}` 时，Style 应将动画降级为 instant 或简化形式（如 `transition-duration: 0s`）。

#### 1.4.2 风格元数据导出规范（getMetadata API）

每个 Style 文件导出 `getMetadata(lang: "en" | "zh")` 函数：

```typescript
interface StyleMetadata {
  id: string;             // 风格唯一双位数 ID ("01" .. "48")
  band: string;           // 视觉家族："minimal-keynote" | "balanced-hybrid" |
                          //   "editorial-print" | "craft-cultural" |
                          //   "contemporary-digital" | "text-report"
  name: string;           // 风格名称（本地化）
  theme: string;          // 风格叙事主题（本地化）
  densityLabel: string;   // 密度描述符（本地化）
  heroScene: number;      // 1-5，Overview 缩略图展示哪个场景
  colors: {
    bg: string;           // 背景色值
    ink: string;          // 前景色值
    panel: string;        // 边框/面板色值
  };
  typography: {
    header: string;       // 头部字体描述
    body: string;         // 正文字体描述
  };
  tags: string[];         // 过滤标签（mood, tone, formality, density,
                          //   scheme, motion, aliases 的合并去重数组）
  fonts: string[];        // 该风格使用的字体族名称列表
                          //   CJK 字体加 "cjk:" 前缀，如 "cjk:Noto Serif SC"
  scenes: Array<{
    id: number;           // 1-5
    title: string;        // 场景标题（本地化）
    beats: Array<{
      id: number;         // 0-based
      action: string;     // 操作步骤描述（本地化）
      title: string;      // 节拍级细分标题（本地化）
      body: string;       // 节拍级细分正文（本地化）
    }>;
  }>;
}
```

**关键约束**：
- `scene.title`（不是 `scene.name`）
- Beat 对象始终包含 `{id, action, title, body}` 四个字段
- 无 `tier` 字段——分类通过 `band` + `tags` 实现
- `tags` 数组用于 Overview 过滤系统
- `fonts` 数组用于外壳字体去重预加载

#### 1.4.3 onNavigate 语义：绝对跳转

`onNavigate(scene, beat)` 使用绝对跳转语义。调用 `onNavigate(3, 2)` 直接跳到 Scene 3 Beat 2。

Envelope 不做相对位置计算。如果 Style 需要 next/prev 行为，它从自己的 metadata 计算目标值，然后用绝对值调用 `onNavigate`。

#### 1.4.4 onNavigate 验证：静默修正

Envelope 收到 `onNavigate` 调用后：
1.  `scene` clamp 到 1-5。
2.  `beat` clamp 到 `0 .. metadata.scenes[scene-1].beats.length - 1`。
3.  使用修正后的值更新状态和 URL。
4.  不抛错误，不向 Style 反馈。

与 URL 参数边界处理策略一致。

#### 1.4.5 动态节拍自适应（Dynamic Beats Count）

*   **解耦硬编码**：节拍数量不固定为 3。
*   **动态驱动**：
    *   外壳的 Beat 进度条由 `style.scenes[scene - 1].beats.length` 动态渲染。
    *   步进边界判定动态对齐该 Scene 的最大 beat index。
    *   *正向示例*：Scene 1 仅有 1 个 beat，Scene 5 弹性拓宽为 5 个。

#### 1.4.6 组件导出方式

每个 Style 文件导出：

```typescript
// src/styles/01-executive-silence.tsx
export default function ExecutiveSilence(props: BespokeStyleProps) { ... }
export function getMetadata(lang: "en" | "zh"): StyleMetadata { ... }
```

注册表中：`import Style01, { getMetadata as meta01 } from "./01-executive-silence";`

---

## 2. 三视图规范

应用提供且仅提供三种视图形态 + 冻结模式。

### 2.1 总览过滤视图（Overview View）

高度响应式的卡片式风格检索大盘。

```
+------------------------------------------------------------------------+
|  [☰]          FH Slides Workbench          [EN/ZH] [🌓] [GitHub]      |
+------------------------------------------------------------------------+
|  Bands: [Minimal] [Balanced] [Editorial] [Craft] ...                   |
|  Tags:  [premium×] [dense×] [retro] [academic] ...                     |
+------------------------------------------------------------------------+
|  [Grid: auto-fill minmax(280px, 1fr)]                                   |
|  +----------------+  +----------------+  +----------------+           |
|  | [16:9 Thumb]   |  | [16:9 Thumb]   |  | [16:9 Thumb]   |           |
|  |                |  |                |  |                |           |
|  | 01 Name        |  | 02 Name        |  | 03 Name        |           |
|  +----------------+  +----------------+  +----------------+           |
+------------------------------------------------------------------------+
```

**缩略图渲染规则**：
- 每张卡片的 16:9 缩略图渲染该 Style 的 `heroScene` 的**最后一个 beat**（settled 完整状态）。
- 由 `isThumbnail={true}` 挂载，所有动画强制 instant 完成（与 frozen mode 相同机制）。
- Stage 使用与 Lab View 相同的 `1920×1080 + transform:scale()` 策略。

**卡片内容**：缩略图 + Style 名称 + ID。无 Specimen Table、无场景列表、无元数据徽章。

**卡片交互**：整张卡片可点击。点击后**即时**（无动画过渡）导航至 Lab 视图，从 **Scene 1, Beat 0**（最开头）开始体验。

**懒加载**：通过 `IntersectionObserver` 实现。初始只挂载视口内的卡片（约 12-16 个），未加载的卡片显示占位符（metadata 背景色 + 名称 + ID）。一旦挂载过的卡片保持挂载（不卸载），避免快速滚动时的重挂载抖动。

**无悬停预览**：卡片就是静态海报，悬停仅有轻微 scale/elevation 视觉反馈，不展示额外信息。

**无"当前播放"指示器**：Overview 不反映 Lab View 中正在看哪个风格。

**网格布局**：`grid-template-columns: repeat(auto-fill, minmax(280px, 1fr))`。浏览器自动计算列数。移动端 1 列，最小 280px 保证内容可读。

**空状态**：当过滤无匹配时，显示友好提示 + 当前选中的 bands/tags chips + "清除所有过滤"按钮。

### 2.2 单页交互视图（Lab View）

16:9 单张幻灯片的高保真演示大厅。

```
+------------------------------------------------------------------------+
|  [☰]          FH Slides Workbench          [EN/ZH] [🌓] [GitHub]      |
+----------+-------------------------------------------------------------+
|          |                                                             |
|  [Side   |              [16:9 Bespoke Slide Stage]                     |
|   Bar]   |         (Style's Internal Nav rendered inside)              |
|  可调整   |                                                             |
|  240-360  |                                                             |
|          |                                                             |
|          |                                                             |
+----------+-------------------------------------------------------------+
| [◀]    ●───●───●───●───●    ████████░░░░ 3/5    [▶]                   |
+------------------------------------------------------------------------+
```

**侧边目录栏**：
- 桌面端：宽度可拖拽调整（240-360px），可折叠为 48px 窄条（仅显示风格编号）。宽度和折叠状态持久化到 localStorage。
- 移动端（`< 1024px`）：侧边栏变为 slide-over drawer（320px 从左侧滑入，带半透明遮罩），由 header hamburger 按钮触发。
- 按 Band 分组展示 48 个风格（6 个可折叠 section）。当前风格高亮 + 自动滚动到可视区域。不展开当前风格详情（无 scene 列表内联展开）。

**底部进度条（双层设计）**：
- **Scene 层**：5 个固定圆点（因为固定 5 scenes）。当前 = 实心高亮 + `aria-current="true"`。可点击跳转到对应 scene 的 beat 0。
- **Beat 层**：水平进度条 + "N/M" 数字读数（当前 beat 1-based / 该 scene 总 beats）。
- **Prev/Next**：纯图标按钮（◀ / ▶），hover 显示键盘快捷键 tooltip。边界时降低不透明度。

**跨风格闪现通知**：当 Next/Prev 跨越风格边界时：
1.  Stage 顶部滑下一个细条通知，显示 "Style 02 — Swiss Precision"（淡入 200ms → 保持 800ms → 淡出 200ms）。
2.  侧边栏中新风格条目短暂脉冲闪烁。
3.  不阻塞键盘输入。

**移动端竖屏提示**：竖屏时 Stage 下方显示非阻塞提示"建议横屏获得最佳体验"，可关闭，关闭后同一会话不再出现。

### 2.3 纯净模式（Pure Mode）

完全隐藏所有 Workbench 外壳，仅展示 Style 的 Stage。通过 URL 参数 `&pure=1` 激活。

```
+------------------------------------------------------------------------+
|                                                                        |
|                                                                        |
|                                                                        |
|                     [16:9 Stage 撑满视口居中]                           |
|                                                                        |
|                                                                        |
|                                                                        |
+------------------------------------------------------------------------+
```

**行为规范**：
- 隐藏所有 Envelope chrome（Header、侧边栏、底部进度条）。
- Stage 缩放因子 = `min(viewportWidth / 1920, viewportHeight / 1080)`，水平垂直居中。
- **无浮动退出按钮**——完全裸奔。
- **退出方式**：浏览器后退按钮，或按 `Esc` 键。
- **保留的交互**：键盘（Space/Arrow）、触摸手势、分屏点击区域、Style 内嵌导航。
- **禁止跨风格循环**：在 Scene 5 最后一个 beat 时，Next 操作为 no-op（不做任何事）。

**使用场景**：
- 纯净截图与录屏
- iframe 外部嵌入（不被外壳视觉污染）
- 单风格聚焦演示

### 2.4 冻结模式（Frozen Mode）

通过 `&frozen=1` URL 参数激活，专为 Playwright 测试提供确定性的 settled 终态：

1.  Envelope 在 `<html>` 元素上设置 `data-frozen="true"`。
2.  全局 CSS 规则强制所有动画 instant：
    ```css
    [data-frozen="true"] * {
      animation-duration: 0s !important;
      transition-duration: 0s !important;
    }
    ```
3.  同时向 Style 组件传入 `reducedMotion={true}`。
4.  `frozen` 不持久化——仅作为每次请求的标志。

这确保了无论 Style 内部使用何种动画机制，测试都能获得确定性的渲染结果。

---

## 3. 导航系统

### 3.1 无缝循环播放链路（Continuous Next/Prev Flow）

**仅在 Lab View 中生效（非 Pure Mode）**：

*   **Next 无缝顺延**：当前处于 Scene 5 的最后一个 Beat 时，自动顺延至**下一个风格的 Scene 1, Beat 0**。若处于列表最后一个风格的末页，循环回第一个风格的首页。
*   **Prev 逆向追溯**：当前处于 Scene 1, Beat 0 时，自动回溯至**上一个风格的 Scene 5 的最后一个 Beat**。若已处于第一个风格首页，循环回最后一个风格的末页。

**过渡算法契约**：

```typescript
function handleNextStep(registry, currentStyleId, scene, beat, isPureMode) {
  const currentMeta = findStyle(currentStyleId).getMetadata("en");
  const currentSceneBeats = currentMeta.scenes[scene - 1].beats;

  if (beat < currentSceneBeats.length - 1) {
    return { styleId: currentStyleId, scene, beat: beat + 1 };
  } else if (scene < 5) {
    return { styleId: currentStyleId, scene: scene + 1, beat: 0 };
  } else {
    if (isPureMode) return null; // Pure Mode 不跨风格
    const idx = registry.findIndex(s => s.id === currentStyleId);
    const nextIdx = (idx + 1) % registry.length;
    return { styleId: registry[nextIdx].id, scene: 1, beat: 0, flashStyle: true };
  }
}
```

### 3.2 活跃风格列表与展示顺序

活跃风格列表（用于跨风格循环）始终为全部 48 个。**过滤不改变活跃列表**——只影响 Overview 视图的卡片可见性，不影响 Lab 视图的循环顺序。

注册表顺序（即跨风格循环顺序）按 Band 分组：

| 范围 | Band |
|------|------|
| 01-08 | Minimal Keynote |
| 09-16 | Balanced Hybrid |
| 17-24 | Editorial & Print |
| 25-32 | Craft & Cultural Traditions |
| 33-40 | Contemporary Digital |
| 41-48 | Text Report |

同一 Band 内按 Skill Design DNA 目录原始顺序排列。这意味着跨风格循环时，用户先看完同一家族的所有风格再进入下一个。

### 3.3 键盘快捷键

| 按键 | 动作 |
|------|------|
| Space / → / ↓ | Next beat |
| ← / ↑ | Prev beat |
| Home | Scene 1, Beat 0 |
| End | Scene 5, 最后一个 beat |
| 1-5 | 跳至 Scene N, Beat 0 |
| O | 返回 Overview |
| L | 切换到 Lab View（当前风格） |
| P | 切换 Pure Mode |
| Esc | 退出 Pure Mode（返回 Lab） |
| Tab | 下一个 Style（跨风格跳转） |
| Shift+Tab | 上一个 Style |

- 所有键盘导航应用 **150ms debounce**（防止长按连跳）。
- 焦点在 input/textarea 元素中时禁用导航快捷键。
- Tab/ShiftTab 用于风格切换时调用 `e.preventDefault()` 避免浏览器焦点循环。

### 3.4 移动端触摸导航

在 Stage 区域支持：

- **水平左 swipe** → Next beat（最小位移阈值 50px）
- **水平右 swipe** → Prev beat
- **点击 Stage 右半区** → Next beat
- **点击 Stage 左半区** → Prev beat
- **垂直 swipe** → 不触发导航（防止误触滚动）

Style 内部的可交互元素必须调用 `e.stopPropagation()` 防止事件冒泡到 Envelope 的触摸/点击监听器。

### 3.5 动画中断处理

Envelope 在收到有效导航事件时**立即更新** `scene`/`beat` props，不等待 Style 的转场完成。

- 大多数基于 CSS `transition` 的动画在被中断时会自然平滑过渡到新目标状态。
- JS 驱动的动画应优雅处理 props 变化（sub-agent 的责任）。
- 150ms 键盘 debounce 作为第一道防线。

---

## 4. 过滤系统

### 4.1 两层复合过滤

**第一层：Band 快速筛选**
6 个视觉家族的多选按钮组。选中的 Band 之间为 **OR 逻辑**（一个风格属于任一被选 Band 即通过）。

**第二层：标签云精筛**
从所有 Style 的 `metadata.tags` 数组中自动聚合去重。每个标签显示频率计数（如 "premium (12)"）。支持多选，**AND 交集逻辑**——仅显示同时拥有所有被选标签的风格。

**组合逻辑**：Band 筛选先收窄候选池，然后标签云在收窄后的池中执行 AND 精筛。

```
visibleStyles = allStyles
  .filter(s => selectedBands.length === 0 || selectedBands.includes(s.band))
  .filter(s => selectedTags.every(tag => s.tags.includes(tag)))
```

### 4.2 过滤面板位置与交互

过滤面板位于 Overview 网格上方，作为水平条始终可见：

- **Band 行**：6 个 Band 切换按钮，选中高亮。
- **Tag 行**：水平可滚动标签云，选中标签显示 × 号可移除。
- 无"应用"按钮——变更即时生效。
- 移动端过滤面板垂直堆叠（bands 在上，tags 在下），均可水平滚动。

### 4.3 非破坏性过滤

过滤过程不重载页面或清空 DOM，仅控制卡片的可见性（CSS 显示/隐藏）。Overview 组件保持挂载以保留滚动位置。

### 4.4 过滤状态持久化

过滤状态完全编码在 URL 查询参数中：

```
?view=overview&bands=minimal-keynote,editorial-print&tags=premium,dense
```

- `bands`：逗号分隔的 Band ID（此层内 OR 逻辑）。
- `tags`：逗号分隔的标签字符串（此层内 AND 逻辑）。
- 两者都缺失时显示全部 48 个风格。
- 过滤变更使用 `history.pushState`（不是 replaceState），因此浏览器前进/后退可以回溯过滤操作。

---

## 5. 全局辅助控制系统

### 5.1 跨平台 GitHub 链接

*   页面头部右侧提供官方 GitHub 链接，`data-testid="github-link"`。
*   `href` 对准：`https://github.com/patrick-fu/frontend-harness-slides-workbench`
*   `target="_blank"`，绝不在本地路由内部跳转。

### 5.2 语言环境切换与状态同步（Bilingual Localization）

*   **全局 EN/ZH 切换**：头部语言切换按钮。
*   **本地存储持久化**：语言状态写入 localStorage（键名 `fhsw:language`）。
*   **整站重渲染绑定**：语言切换时，Envelope UI 文本与 Style 的 `getMetadata(lang)` 以及组件的 `language` 属性在同一个 React 渲染 tick 中同步重绘。
*   **Envelope i18n**：使用轻量级自定义系统（翻译字典 + React Context），不引入外部 i18n 库。仅用于 Envelope chrome，Style 内容使用 `getMetadata(lang)`。

### 5.3 全局深浅色模式自适应（Dark/Light Auto Mode）

*   三种色彩环境：**浅色（Light）、深色（Dark）、系统自动（Auto）**。
*   **默认 Auto 逻辑**：检测 `matchMedia("(prefers-color-scheme: dark)")`，首选项存 localStorage（键名 `fhsw:theme`）。
*   **配色对置契约**：
    *   **深色**：`bg-zinc-950 text-slate-100 border-zinc-800`
    *   **浅色**：`bg-slate-100 text-slate-900 border-slate-200`
*   **不影响 Style 内部**：每个 Style 控制自己的背景和前景色，Envelope 主题不穿透到 Stage 内部。

### 5.4 减少动画适配（Reduced Motion）

Envelope 检测 `prefers-reduced-motion: reduce`：

1.  禁用 Envelope 自身的动画（侧边栏滑出、过滤淡入、闪现通知）——使用 instant 切换。
2.  向每个 Style 组件传入 `reducedMotion: boolean` prop。
3.  每个 Style 自行决定如何响应该标志（通常设 `transition-duration: 0s` 或简化动画）。

### 5.5 资源声明与去重预加载策略

字体及类似共享资源采用"声明 + 去重 + fallback"三层模式：

1.  **元数据声明**：每个 Style 的 `getMetadata()` 包含 `fonts: string[]` 字段。
2.  **外壳去重预加载**：Envelope 启动时遍历注册表所有 Style 的 `fonts` 数组，合并去重后在 `<head>` 注入统一的 `<link rel="stylesheet">`。
3.  **组件内 Fallback**：每个 Style 组件在 mount 时通过 `useEffect` 动态注入 `<link>` 标签（带去重检查），保证脱离 Workbench 时仍可独立渲染。

**CJK 字体特殊处理**：
- `metadata.fonts` 中 CJK 字体加 `"cjk:"` 前缀标记（如 `"cjk:Noto Serif SC"`）。
- 拉丁字体：启动时正常预加载。
- CJK 字体：仅在以下情况加载：
  - Style 正在 Lab View 展示 **且** `language === "zh"`
  - Style 的 Overview 卡片被 IntersectionObserver 触发懒加载 **且** `language === "zh"`
- 当 `language === "en"` 时，CJK 字体永不加载。

同一模式适用于其他可能重复加载的资源：在 metadata 中声明资源标识，外壳统一去重加载，组件内保留自包含 fallback。

### 5.6 初始加载体验

首屏采用渐进式渲染：

1.  **Envelope chrome 立即渲染**（header、sidebar、bottom bar）——轻量，不依赖字体或 Style 组件。
2.  **Stage 区域**显示占位符（目标 Style 的 metadata 背景色）。
3.  **Overview 卡片**显示骨架占位符（metadata 背景色 + 名称 + ID 文本）。随 IntersectionObserver 触发，真实 Style 组件挂载并渐入。
4.  **字体加载**：不阻塞渲染。如果 Style 在字体就绪前 mount，短暂使用 fallback 字体。
5.  无全屏 loading spinner。用户始终能看到可操作的界面。

### 5.7 动态文档标题

`document.title` 根据当前状态动态更新：
- Overview：`"FH Slides Workbench — 48 Bespoke Styles"`
- Lab：`"Style 01 Executive Silence — Scene 3 · FH Slides Workbench"`

---

## 6. 风格内容与美学规范

### 6.1 主题内容与风格设计的高保真匹配

任何新风格的文案内容不能盲目、随机拼凑。必须依据该风格的"材质、配色、图形和叙事深度"，逆向推导出最具说服力的内容。

*   **正向示例（材质内容共鸣）**：
    *   *学术哥特黑板风* → 选择《巴赫对位赋格》、《开普勒天体轨道对数推导》等数理秩序题材。
    *   *古董宣纸太政官印* → 选择《明治维新迁都东京大政》、《遣唐使航海账簿》等帝国政令题材。
*   **负向警示（材质错位灾难）**：
    *   "1980 霓虹复古游戏"风格里塞入《克尔度规黑洞视界熵增》→ 粗制滥造的违和感。

### 6.2 内嵌导航设计（360° 空间散落 + 幽灵弱化）

Style 的 Internal Navigation 不应是千篇一律的底部横向排布。必须根据风格的主题隐喻，将控制点散落在画布的**顶部、左侧、右侧及四角**空间中。

**幽灵导航存在感弱化标准**：
*   **发丝线限制**：导航线条粗度一律 `0.5px` 或 `1px`，颜色透明度降至当前前景色的 `15%-20%`。
*   **高灰度退避**：非激活节点的静态不透明度 `8%-15%`（几不可见）。
*   **交互渐显**：仅在 Hover 时以平滑淡入呈现全貌。激活状态的 Glow 直径比普通发光缩小 50%。

### 6.3 语义驱动的物理转场模型

Scene 切换由 Style 自行决定转场模型（Envelope 不提供转场容器）。四大参考模型：

1.  **H-Slide（横向滑轨平移）**：适用时间线、地理跨度、行旅漫游。外壳 `overflow-hidden`，内层 `flex w-[500%] h-full`，场景 `w-[20%] h-full shrink-0`。
2.  **V-Slide（纵向地层升降）**：适用纵深剖面、深度发掘。内层 `flex flex-col h-[500%] w-full`，场景 `h-[20%] w-full shrink-0`。
3.  **Magic Move（背景静止与局部变焦）**：适用静默学术、数理对位。5 个场景绝对定位重合，背景骨架静止，前景元素 `scale(1) opacity-100` ↔ `scale(0.96) opacity-0` 渐变。
4.  **Mechanical Stamp & Glitch（瞬间砸落与电磁故障）**：适用工业机械、冲突对立。瞬间硬切 + 400ms 全屏重力震颤。

**运动缓动与时长**：所有滑轨和变焦转场 `1.2s-1.4s`，缓动曲线 `cubic-bezier(0.16, 1, 0.3, 1)`。

### 6.4 文本物理化与非对称排版

严禁死板的"左右分栏"和"标准文本段落"。文字必须被赋予**物理材质形态**：

*   **标本吊牌格式（Specimen Tags）**：手绘泛黄博物馆标本签。
*   **金石雕刻格式（Stone Inscriptions）**：SVG 阴刻滤镜凿刻在玄武岩石板凹槽中。
*   **重合便签格式（Sticky Notes）**：牛皮纸手账便签 + 大头针 + 红棉线。
*   **宣纸手卷格式（Scrolls/Steles）**：古典 Mincho 竖排 + 朱红双线框敕令手卷。
*   **控制台/账册格式（Ledgers & Consoles）**：复古记账表格行数据 + 蜡印。

**绝对禁止**：
*   使用 Tailwind 标准的 `bg-slate-900 border-slate-800` + Lucide 图标——产生廉价赛博朋克感。
*   Scene 2/3/4 中出现 `col-span-6` 左右对称排布。布局必须有冲突、倾斜、重叠且非对称。

### 6.5 语言翻译与排版伸缩性

*   **中短英长规律**：英文平均字符长度比中文长 `40%-60%`。多行 Body 文本卡片必须加 `max-h-[35cqh]` + `leading-relaxed`，英文微调 `text-[1.3cqw] leading-normal`。
*   **中重英轻规律**：切换英文时增强字重或字母间距；切换中文时拉宽行距和字间距。
*   **东方竖排变换**：强烈东方历史背景的风格中，`language === "zh"` 时将 H-Header 转为 `writing-mode: vertical-rl`；英文恢复为横向 Flex/Grid 双栏布局。

---

## 7. 路由与状态管理

### 7.1 URL Query Parameter 路由

所有导航状态反映在 URL 查询参数中：

```
?view=lab&style=01&scene=1&beat=0&pure=0&frozen=0
```

| 参数 | 值 | 说明 |
|------|-----|------|
| `view` | `"overview"` \| `"lab"` | 当前视图 |
| `style` | `"01"` .. `"48"` | 风格双位数 ID |
| `scene` | `1` .. `5` | 场景索引 |
| `beat` | `0` .. `N` | 节拍索引（0-based） |
| `pure` | `"1"` \| 省略 | `"1"` = 纯净模式 |
| `frozen` | `"1"` \| 省略 | `"1"` = 冻结模式（测试用） |
| `bands` | 逗号分隔的 Band ID | Overview 过滤：选中的 bands |
| `tags` | 逗号分隔的标签 | Overview 过滤：选中的 tags |

不使用 React Router。通过 `history.pushState` / `replaceState` + `popstate` 监听器实现浏览器前进/后退同步。

### 7.2 稳定帧地址（Stable Frame Address）

每个 `(styleId, scene, beat)` 组合都可以通过 URL 直接打开。这是 Harness Contract 的核心要求——测试和审查者不需要点击整个演示流程即可直达目标帧。

### 7.3 URL 参数边界处理

当用户输入无效参数时，系统**静默修正**并通过 `history.replaceState` 更正 URL（不污染浏览器历史）：

- `style` 不在注册表中 → 回退到 `"01"`
- `scene` 超出 1-5 → clamp 到最近的有效值
- `beat` 超出当前 scene 的合法范围 → clamp 到最近的有效值
- `view` 不是 `"overview"` 或 `"lab"` → 回退到 `"overview"`
- `pure` 不是 `"0"` 或 `"1"` → 回退到 `"0"`
- `frozen` 不是 `"0"` 或 `"1"` → 回退到 `"0"`

无错误页面，无 toast 提示。URL 始终是合法的稳定帧地址。

### 7.4 默认路由

当应用以无参数 URL 打开时，显示 Overview 视图。URL 不被重写为 `?view=overview`——参数缺失即默认为 Overview。

这符合"电影院大厅"隐喻：用户先进入大厅浏览目录，再选择要看的电影。

### 7.5 Lab → Overview 状态保留

从 Lab View 返回 Overview 时：
- 滚动位置保留（用户回到之前在网格中的位置）。
- 过滤选择保留（已在 URL 参数中）。
- 实现方式：Overview 组件保持挂载（通过 CSS `display: none` 隐藏），保留 DOM 状态包括滚动位置。

---

## 8. 工程深坑红线规避

这些是前几轮开发中多次引发崩溃的致命深坑，作为刚性红线：

1.  **SVG 内层属性绝对 unitless 铁律**：
    *   *坑*：SVG `path d="..."`、`circle cx="..."`、`<line>` 坐标中写入 `cqw`/`cqh` 单位 → 浏览器抛出 `Expected number` 运行时错误，页面卡死。
    *   *正规实现*：SVG 内部所有渲染属性保持**纯无单位数字**。通过最外层 `viewBox="0 0 W H"` + `<svg>` 标签应用 `w-[30cqw] h-[30cqh]` 实现外部流式包裹。

2.  **转场容器 React Key Remount 铁律**：
    *   *坑*：不绑定 key → React 复用 DOM 节点 → CSS 转场 Keyframes 动画因未触发 DOM 重建而失效 → 退化为静止硬切。
    *   *正规实现*：承载空间滑轨或神奇移动的转场轨道容器，必须绑定 `key={\`${styleId}-${scene}\`}`，强制每次 scene 步进时彻底重构 DOM 分支以唤醒动画。

3.  **Vercel Token Expiration CI 铁律**：
    *   *坑*：Vercel CLI OAuth 临时 Token 寿命仅 24 小时 → CI 一天后频繁断线。
    *   *正规实现*：使用 Vercel Token Dashboard 创建永不过期的 Personal Access Token，存入 GitHub Repository Secrets 的 `VERCEL_TOKEN`。

4.  **事件冒泡与导航泄漏防护**：
    *   *坑*：Style 内部的可交互按钮、链接、代码编辑器被点击时冒泡到 Envelope 的分屏点击监听器 → 意外触发切页。
    *   *正规实现*：Style 内部所有交互元素的点击处理器必须调用 `e.stopPropagation()`。

---

## 9. 技术栈与项目结构

### 9.1 技术栈

| 层 | 技术 |
|----|------|
| 框架 | React 19 |
| 构建 | Vite 6 |
| 样式 | Tailwind CSS v4（零配置 Vite 插件模式） |
| 语言 | TypeScript（strict mode） |
| 单元测试 | Vitest + React Testing Library |
| E2E/视觉 | Playwright |
| 部署 | Vercel + GitHub Actions CI |

### 9.2 目录结构

```
src/
├── components/
│   ├── layout/              # 外壳 chrome
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   └── BottomBar.tsx
│   ├── stage/               # Stage 容器
│   │   ├── StageWrapper.tsx
│   │   └── StageScale.tsx
│   ├── views/               # 视图
│   │   ├── OverviewView.tsx
│   │   └── LabView.tsx
│   ├── FilterPanel.tsx
│   ├── StyleCard.tsx
│   ├── StyleErrorBoundary.tsx
│   └── CrossStyleFlash.tsx
├── styles/                  # 48 个风格组件（扁平文件）
│   ├── registry.ts          # 手动注册表
│   ├── 01-executive-silence.tsx
│   ├── 01-executive-silence.module.css
│   ├── 01-executive-silence.test.tsx
│   └── ...
├── hooks/                   # useUrlState, useKeyboard, useTouchNav, useFontPreload
├── i18n/
│   └── translations.ts      # Envelope UI 翻译字典
├── utils/                   # route, navigation, filter, fonts
├── test/
│   └── setup.ts
├── App.tsx
├── main.tsx
├── index.css                # Tailwind + 全局规则
├── types.ts                 # BespokeStyleProps, StyleMetadata 接口
└── vite-env.d.ts

public/
└── styles/                  # Style 静态资源
    ├── 01/
    │   └── hero.jpg
    └── 17/
        └── photo.webp

tests/                       # Playwright 测试
├── audit.spec.ts
└── visual-smoke.spec.ts
```

### 9.3 CSS Modules 隔离

每个 Style 组件使用 CSS Modules（`style.module.css`）实现样式隔离。

- Vite 原生支持，类名和 `@keyframes` 自动 hash 化。
- Sub-agent 无需关心与其他 Style 的命名冲突。

### 9.4 CSS 自定义属性命名约定

Style 组件设置的 CSS 自定义属性必须以风格 ID 前缀命名：

```css
/* 正确 */
--style-01-bg: #030712;
--style-01-accent: #f59e0b;

/* 错误 — 会泄漏到其他 Style */
--bg: #030712;
--accent: #f59e0b;
```

因为 CSS custom properties 不受 CSS Modules 隔离，会通过 DOM 继承传播。

### 9.5 图片资源管理

Style 的静态资源（照片、纹理等栅格图）放在 `public/styles/<id>/` 目录下：

```
public/
  styles/
    01/
      hero.jpg
      texture.png
```

Style 组件中通过绝对路径引用：`/styles/01/hero.jpg`。

属于 Style 视觉系统的 SVG 图标应直接内联为 JSX/SVG（随 `cqw`/`cqh` 缩放），不放入 public。

### 9.6 字体 Fallback 实现

每个 Style 组件在 mount 时通过 `useEffect` 注入字体 `<link>`：

```typescript
useEffect(() => {
  const id = "style-01-fonts";
  if (!document.getElementById(id)) {
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=...&display=swap";
    document.head.appendChild(link);
  }
}, []);
```

注入前检查是否已存在（防止重复）。如果 Envelope 已预加载相同字体，浏览器缓存自动处理。

### 9.7 错误边界

每个 Style 的渲染位置（Lab View Stage、Overview 卡片缩略图）都包裹在独立的 React ErrorBoundary 中。

- 单个 Style 渲染异常只影响该区域。
- Fallback 显示：Style 的 metadata 背景色 + "Style XX — 渲染失败" 文本。
- Overview 中一张卡片坏了不影响其他 47 张。
- Lab View 中 Stage 崩溃但侧边栏/header/底部栏保持功能。
- 错误详情带 Style ID 输出到 console。

### 9.8 审计表面（Data Attributes）

Envelope 在 Stage wrapper 上设置审计属性：

```html
<div data-style-id="01" data-scene-id="3" data-beat="2" data-testid="stage">
  <Style ... />
</div>
```

Playwright 结构审计测试通过这些属性验证 URL 导航是否到达了预期的 scene/beat。Style 组件不需要设置任何 data 属性。

### 9.9 开发规范：TDD

所有代码——Envelope 框架和每个 Style 组件——必须使用测试驱动开发：

- **Envelope 框架**：先写 Vitest 单元测试（URL 解析、过滤逻辑、导航计算、注册表验证），再实现。
- **Style 组件**：每个 sub-agent 在 prompt 中收到 TDD 强制要求。agent 必须：
  1. 先写测试文件，验证：所有 scene/beat 可渲染无错、`isThumbnail` 抑制交互元素、`onNavigate` 被正确调用、无 Stage 溢出。
  2. 再实现组件使测试通过。
- Style 测试文件与组件同目录：`src/styles/01-executive-silence.test.tsx`。

### 9.10 localStorage 键名命名空间

所有 localStorage 键使用 `fhsw:` 前缀：

| 键名 | 用途 |
|------|------|
| `fhsw:language` | `"en"` 或 `"zh"` |
| `fhsw:theme` | `"auto"`、`"light"` 或 `"dark"` |
| `fhsw:sidebar-width` | 数字（px） |
| `fhsw:sidebar-collapsed` | `"true"` 或 `"false"` |
| `fhsw:portrait-hint-dismissed` | `"true"`（仅当前会话） |

每个值是独立的 key，不使用单个 JSON blob 存储。

---

## 10. 实施阶段

```
Phase 1: 3 个参考风格（跨 Band 验证）
  目的：验证接口契约、证明自包含模式可行
  风格：
    - Style 01 — Executive Silence (Minimal Keynote)
    - Style 17 — Editorial Broadsheet (Editorial & Print)
    - Style 33 — Glass Dashboard (Contemporary Digital)
  方式：TDD，每个风格先写测试再实现

Phase 2: Envelope 外壳框架
  目的：搭建完整的 Workbench 功能
  产出：Overview 网格、Lab 视图、Pure Mode、导航系统、过滤系统、
        深浅色、双语、键盘/手势/分屏点击交互、冻结模式、错误边界

Phase 3: 批量风格生产
  目的：完成全部 48 个风格
  方式：并行 sub-agents
  隔离：每个 agent 在独立临时目录工作，prompt 中不提及 Workbench
  每个 agent 收到：Skill Design DNA + 接口契约 + TDD 要求
  产出：.tsx + .module.css + .test.tsx

Phase 4: 公共基础设施抽取
  目的：在所有风格完成后，识别并提取重复模式
  可能产出：共享动画库、字体预加载优化、SceneTrack 组件等
```

---

## 11. 测试规范

### 11.1 三层测试策略

| 层级 | 框架 | 覆盖内容 | 运行时机 |
|------|------|----------|----------|
| Envelope 单元测试 | Vitest | URL 解析、导航计算、过滤逻辑、注册表完整性 | 每次 push/PR |
| 结构审计 | Playwright | 所有 Style×Scene×Beat 可渲染、无溢出、无 console error | 手动 + 每周定时 |
| 视觉烟雾 | Playwright + 人工 | 代表性帧截图审查 | 手动 + 每周定时 |

### 11.2 必须覆盖的测试维度

| 维度 | 检查内容 |
|------|----------|
| 渲染 | Stage 可见、内容存在、无零尺寸塌陷 |
| 帧地址 | 每个 scene/beat 可通过 URL 直接打开 |
| 导航 | 键盘前后步进、跨场景边界、跨风格循环 |
| 交互隔离 | 点击 Style 内部按钮不触发切页（stopPropagation） |
| 布局安全 | 内容不溢出 Stage 边界（scrollWidth/scrollHeight 检测） |
| 运行时错误 | console 无 error/warning |
| 资源加载 | 字体正常加载 |
| 构建/部署 | `npm run build` 成功 |
| 移动端 | 侧边栏抽屉、触摸导航 |
| 纯净模式 | `&pure=1` 隐藏外壳、Esc 退出、不跨风格 |
| 冻结模式 | `&frozen=1` 渲染确定性 settled 状态 |
| 缩略图模式 | `isThumbnail=true` 无交互元素、无动画 |

### 11.3 Stage 溢出检测

两层保护：

1.  **CSS 防线**：Stage 容器 `overflow: hidden` 作为硬边界。
2.  **Playwright 主动检测**：对每个 Style×Scene×Beat：
    ```typescript
    const hasOverflow = await stage.evaluate(el =>
      el.scrollWidth > el.clientWidth + 1 || el.scrollHeight > el.clientHeight + 1
    );
    expect(hasOverflow).toBe(false);
    ```
    `+1` 容差考虑亚像素舍入。测试失败意味着 Style 内容超出 Stage 范围，必须修复。

---

## 12. 可访问性

Envelope chrome 实现基础无障碍：

- 所有交互元素有描述性 `aria-label`（尤其是纯图标按钮）。
- Tab 顺序遵循视觉布局：header → sidebar → stage → bottom bar。
- 侧边栏当前风格有 `aria-current="true"`。
- 底部栏当前 scene dot 有 `aria-current="true"`。
- Envelope UI 文本颜色对比度满足 WCAG AA。
- Stage 内容本身的可访问性由 Style 自行负责——Envelope 不向 Style 渲染的内容添加 ARIA 属性。

---

## 13. 浏览器支持

最低浏览器版本（硬约束：CSS Container Queries 支持）：

| 浏览器 | 最低版本 |
|--------|----------|
| Chrome / Edge | ≥ 110 |
| Firefox | ≥ 110 |
| Safari | ≥ 16.4 |
| iOS Safari | ≥ 16.4 |

不支持 IE。不提供 Container Queries polyfill（无法可靠实现）。旧版浏览器用户看到提示："本站需要支持 Container Queries 的现代浏览器。"

---

## 14. 分享机制

无专用"分享"按钮。浏览器 URL 栏就是分享机制：

- 每个视图、风格、场景、节拍都可直接寻址。
- 用户直接复制地址栏分享特定帧。
- Pure Mode URL（`&pure=1`）适合 iframe 嵌入。
- 过滤后的 Overview 视图也可分享（`?view=overview&bands=...&tags=...`）。

---

## 15. CI/CD

两个独立的 GitHub Actions workflow：

### 15.1 CI & Deploy（`.github/workflows/ci.yml`）
- 触发：push to `main` + pull requests
- 步骤：checkout → setup node → `npm ci` → `npm run build` → `npm test`
- Push to main 时额外部署到 Vercel

### 15.2 Full Visual Audit（`.github/workflows/audit.yml`）
- 触发：`workflow_dispatch`（手动）+ 每周定时
- 步骤：checkout → setup node → `npm ci` → `npm run build` → Playwright 全量结构审计
- 产物：截图 + 审计日志作为 artifact 上传

---

## 16. PDF 导出

通过 Pure Mode + 浏览器原生打印实现：

1.  用户导航到目标 Style/scene/beat。
2.  进入 Pure Mode（`&pure=1`）——所有 Envelope chrome 隐藏。
3.  使用浏览器打印（⌘P / Ctrl+P）→ "保存为 PDF"。

`@media print` CSS 规则：
- 隐藏除 Stage 外的所有元素。
- Stage 填满页面（无边距、无页眉页脚）。
- 保留背景色和图片（`-webkit-print-color-adjust: exact`）。
- 页面尺寸设为 16:9 横向（`@page { size: 16in 9in; margin: 0; }`）。

---

## 17. 非目标

*   不是幻灯片制作工具（不提供编辑器/创作界面）
*   不是 npm 包（不发布到 npm，不提供 import API）
*   不是演示运行器（不是 Keynote/PowerPoint 的替代品）
*   不做风格内容的人工精修——Phase 3 由 sub-agent 自生成，后续人工迭代是另一个项目
*   不做 SSR/SSG——纯 SPA，SEO 通过基础 meta tags 和动态 title 覆盖
*   不做用户系统/收藏夹/评论等社交功能

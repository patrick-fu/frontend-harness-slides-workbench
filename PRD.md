# Frontend Harness Slides Workbench — PRD

## 去中心化高保真单体演示引擎工作台技术规约

---

## 0. 项目定位

本项目是 **Frontend Harness Slides** 体系的配套演示工作台（Workbench / Demo Site）。它不是一份幻灯片，而是一个同时展示 48 份独立幻灯片风格的"电影院"框架。

每份幻灯片风格（Style）由独立的 sub-agent 在隔离环境中制作——agent 不知道自己被包裹在 Workbench 中，它以为自己在做一个独立的、自包含的幻灯片项目。Workbench 只负责提供外壳导航、目录、过滤和展示功能。

**核心设计原则：隔离性。** 每个 Style 是一个自包含的 React 组件，拥有自己的字体、动画、场景切换逻辑和内嵌导航。Workbench 通过极简的 props 接口与 Style 通信，绝不干涉其内部实现。

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
| Envelope 外壳 | Header、侧边目录栏、底部进度条、Scene Tabs | `px` / `rem` / Tailwind 响应式 | 随视口大小自适应布局 |
| Stage 舞台 | Style 组件的所有视觉元素 + 风格内嵌导航 | `cqw` / `cqh` | 随 Stage 整体等比缩放 |

**这不是 Viewport Trap 违规**——因为 Workbench 是元应用（meta-application），不是幻灯片本身。

### 1.3 数据契约与生命周期接口

#### 1.3.1 Style 组件输入规范（Props Interface）

```typescript
interface BespokeStyleProps {
  scene: number;         // 当前激活场景索引 (1 至 5)
  beat: number;          // 当前场景下的激活节拍索引 (0-based，动态长度)
  language: "en" | "zh"; // 语言环境
  isThumbnail: boolean;  // 是否处于缩略图渲染模式
  reducedMotion: boolean; // 系统是否开启"减少动画"
  onNavigate?: (scene: number, beat: number) => void; // 内嵌导航回调
}
```

当 `isThumbnail={true}` 时，`onNavigate` 为 `undefined`，Style 必须抑制所有内嵌导航 UI 和交互元素。

当 `reducedMotion={true}` 时，Style 应将动画降级为 instant 或简化形式（如 `transition-duration: 0s`）。

#### 1.3.2 风格元数据导出规范（getMetadata API）

每个 Style 文件头部必须独立导出 `getMetadata(lang: "en" | "zh")` 函数：

```typescript
interface StyleMetadata {
  id: string;             // 风格唯一双位数 ID ("01" .. "48")
  band: string;           // 视觉家族："minimal-keynote" | "balanced-hybrid" |
                          //   "editorial-print" | "craft-cultural" |
                          //   "contemporary-digital" | "text-report"
  name: string;           // 风格名称（中英双语 inline）
  theme: string;          // 风格叙事主题
  densityLabel: string;   // 密度描述符
  heroScene: number;      // 1-5，Overview 缩略图展示哪个场景
  colors: {
    bg: string;           // Tailwind 背景类名 (如 "bg-[#030712]")
    ink: string;          // Tailwind 前景色类名 (如 "text-slate-100")
    panel: string;        // Tailwind 边框/面板类名 (如 "border-slate-800")
  };
  typography: {
    header: string;       // 头部字体类名 (如 "font-serif")
    body: string;         // 正文字体类名 (如 "font-mono")
  };
  tags: string[];         // 过滤标签（mood, tone, formality, density,
                          //   scheme, motion, aliases 的合并去重数组）
  fonts: string[];        // 该风格使用的字体族名称列表
                          //   外壳收集去重后统一预加载，组件内保留 @import fallback
  scenes: Array<{
    id: number;           // 1-5
    title: string;        // 场景标题
    beats: Array<{
      id: number;         // 0-based
      action: string;     // 操作步骤模拟名称
      title: string;      // 节拍级细分标题
      body: string;       // 节拍级细分正文
    }>;
  }>;
}
```

**关键约束**：
- `scene.title`（不是 `scene.name`）
- Beat 对象始终包含 `{id, action, title, body}` 四个字段
- 无 `tier` 字段——分类通过 `band` + `tags` 实现
- `tags` 数组用于 Overview 过滤系统

#### 1.3.3 动态节拍自适应（Dynamic Beats Count）

*   **解耦硬编码**：取消节拍数量为"3"的定死限制。
*   **动态驱动**：
    *   外壳的 Beat 进度条由 `style.scenes[scene - 1].beats.length` 动态渲染。
    *   步进边界判定 `disabled={scene === 5 && beat === maxBeat}` 动态对齐该 Scene 的最大索引值。
    *   *正向示例*：Scene 1 仅有 1 个 beat，Scene 5 弹性拓宽为 5 个。
    *   *负向警示*：定死所有 Scene 为 3 beats 导致极简场景填充空 beats、密集看板省略核心数据。

---

## 2. 三视图规范

应用提供且仅提供三种视图形态。

### 2.1 总览过滤视图（Overview View）

高度响应式的卡片式风格检索大盘。

```
+------------------------------------------------------------------------+
|  [Header: Title]             [Language Toggles]   [Theme]   [GitHub]   |
+------------------------------------------------------------------------+
|  [Filter Panel]                                                        |
|  Band: [x] Minimal Keynote  [x] Editorial  [ ] Craft  [ ] ...          |
|  Tags: [x] Premium  [x] High-Density  [ ] Retro  [ ] Academic          |
+------------------------------------------------------------------------+
|  [Grid Matrix: responsive dynamic columns]                             |
|  +----------------+  +----------------+  +----------------+           |
|  | [16:9 Thumb]   |  | [16:9 Thumb]   |  | [16:9 Thumb]   |           |
|  |                |  |                |  |                |           |
|  | ST 01 Name     |  | ST 02 Name     |  | ST 03 Name     |           |
|  +----------------+  +----------------+  +----------------+           |
+------------------------------------------------------------------------+
```

*   **缩略图渲染规则**：每张卡片的 16:9 缩略图渲染该 Style 的 `heroScene` 的**最后一个 beat**（settled 完整状态），由 `isThumbnail={true}` 挂载。
*   **卡片内容**：缩略图 + Style 名称 + ID。无 Specimen Table、无场景列表、无元数据徽章。
*   **卡片交互**：整张卡片可点击。点击后导航至 Lab 视图，从 **Scene 1, Beat 0**（最开头）开始体验。
*   **最小宽度约束**：卡片最小宽度 `280px`（移动端）至 `360px`（大屏）。
*   **响应式栅格**：
    *   `< 640px`：强制 1 列，占满视口宽度
    *   `≥ 640px`：2 列
    *   `≥ 1024px`：3-4 列
    *   超宽屏：弹性延展至 6 列
*   **全屏填充**：网格容器配合 `w-full` 与 `px-4 md:px-8`，最大化利用屏幕宽度。

### 2.2 单页交互视图（Lab View）

16:9 单张幻灯片的高保真演示大厅。

```
+------------------------------------------------------------------------+
| [Header]                    [Scene Tabs: 1 | 2 | 3 | 4 | 5]            |
+------------------------------------------------------------------------+
|          |                                                             |
|          |                                                             |
|  [Side   |              [16:9 Bespoke Slide Stage]                     |
|   Bar]   |         (With Style's Internal Nav Overlay)                 |
|  w-72    |                                                             |
|          |                                                             |
|          |                                                             |
+----------+-------------------------------------------------------------+
| [Prev]              === [Scene Dots] + [Beat Progress] ===   [Next]   |
+------------------------------------------------------------------------+
```

*   **侧边目录栏**：宽度 `w-72`（18rem），展示 48 款风格的名录、主题和标签。
    *   桌面端：可点击 `data-testid="sidebar-toggle"` 按钮完全收起（`translate-x-full`）。
    *   移动端（`< 768px`）：默认关闭，汉堡菜单唤起浮层抽屉。选定新风格后自动滑出隐藏。
*   **底部进度条（双层设计）**：
    *   **Scene 层**：5 个固定圆点（因为固定 5 scenes）。当前 = 实心高亮。
    *   **Beat 层**：动态进度条 + "N/M" 数字显示（当前 beat / 该 scene 的总 beats）。

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
*   隐藏所有 Envelope chrome（Header、侧边栏、底部进度条、Scene Tabs）。
*   Stage 缩放因子 = `min(viewportWidth / 1920, viewportHeight / 1080)`，水平垂直居中。
*   **无浮动退出按钮**——完全裸奔。
*   **退出方式**：浏览器后退按钮，或按 `Esc` 键。
*   **保留的交互**：键盘（Space/Arrow）、触摸手势、分屏点击区域、Style 内嵌导航。
*   **禁止跨风格循环**：在 Scene 5 最后一个 beat 时，Next 操作为 no-op（不做任何事）。

**使用场景**：
*   纯净截图与录屏
*   iframe 外部嵌入（不被外壳视觉污染）
*   单风格聚焦演示

---

## 3. 导航系统

### 3.1 无缝循环播放链路（Continuous Next/Prev Flow）

**仅在 Lab View 中生效（非 Pure Mode）**：

*   **Next 无缝顺延**：当前处于 Scene 5 的最后一个 Beat 时，自动顺延至**活跃风格列表中下一个风格的 Scene 1, Beat 0**。若处于列表最后一个风格的末页，循环回第一个风格的首页。
*   **Prev 逆向追溯**：当前处于 Scene 1, Beat 0 时，自动回溯至**上一个风格的 Scene 5 的最后一个 Beat**。若已处于第一个风格首页，循环回最后一个风格的末页。

**跨风格闪现通知**：当 Next/Prev 跨越风格边界时，在 Stage 上方显示一个短暂闪现浮层，展示新风格的名称和 ID。浮层快速淡入（~200ms），保持 ~1.2s，然后淡出（~400ms）。

**过渡算法契约**：

```typescript
function handleNextStep(activeStylesList, currentStyleId, scene, beat, isPureMode) {
  const currentStyle = findStyle(currentStyleId);
  const currentSceneBeats = currentStyle.scenes[scene - 1].beats;

  if (beat < currentSceneBeats.length - 1) {
    // 步进 Beat
    return { styleId: currentStyleId, scene, beat: beat + 1 };
  } else if (scene < 5) {
    // 跨场景：步进 Scene，重置 Beat
    return { styleId: currentStyleId, scene: scene + 1, beat: 0 };
  } else {
    // 跨风格
    if (isPureMode) {
      return null; // Pure Mode 下不跨风格，no-op
    }
    const currentIndex = activeStylesList.findIndex(s => s.id === currentStyleId);
    const nextIndex = (currentIndex + 1) % activeStylesList.length;
    const nextStyle = activeStylesList[nextIndex];
    return { styleId: nextStyle.id, scene: 1, beat: 0, flashStyle: nextStyle };
  }
}
```

### 3.2 活跃风格列表（Active Styles List）

始终为全部 48 个风格的完整列表。**过滤不改变活跃列表**——只影响 Overview 视图的卡片可见性，不影响 Lab 视图的循环顺序。

### 3.3 物理多模交互控制协议

系统除了点击 Next/Prev 按钮，必须响应三种物理维度的多模交互：

*   **键盘极速控制**：
    *   `Space` 或 `ArrowRight`：前进一格（触发 `handleNextStep`）。
    *   `ArrowLeft`：后退一格（触发 `handlePrevStep`）。
    *   `Esc`：退出 Pure Mode（移除 `&pure=1` 参数）。
    *   忽略 `event.repeat`，防止长按连跳。
*   **移动端手势滑扫（Touch Swipe Gestures）**：
    *   在 Stage 区域绑定 `onTouchStart` / `onTouchEnd` 监听器。
    *   **位移判定阈值**：`55px`。
    *   **横向滑扫**：向左 > 55px → Next；向右 > 55px → Prev。
    *   **纵向滑扫**：向上 > 55px → 步进至下一个 Scene 的 Beat 0；向下 > 55px → 步退至前一个 Scene 的 Beat 0。
*   **分裂屏幕点击控制（Split-Screen Click Zones）**：
    *   点击 Stage 最左侧 **15%** 区域 → Prev。
    *   点击 Stage 最右侧 **15%** 区域 → Next。
    *   **安全保护**：如果点击命中了 Style 内部的可交互元素（按钮、链接、导航节点），由 Style 组件调用 `e.stopPropagation()` 拦截，避免误触切页。

---

## 4. 过滤系统

### 4.1 两层复合过滤

**第一层：Band 快速筛选**
6 个视觉家族的多选按钮组。选中的 Band 之间为 **OR 逻辑**（一个风格属于任一被选 Band 即通过）。

**第二层：标签云精筛**
从所有 Style 的 `tags` 数组中提取去重的标签集合。支持多选，**AND 交集逻辑**——仅显示同时拥有所有被选标签的风格。

**组合逻辑**：Band 筛选先收窄候选池，然后标签云在收窄后的池中执行 AND 精筛。

```
visibleStyles = allStyles
  .filter(s => selectedBands.length === 0 || selectedBands.includes(s.band))
  .filter(s => selectedTags.every(tag => s.tags.includes(tag)))
```

### 4.2 非破坏性过滤

过滤过程不重载页面或清空 DOM，仅控制卡片的可见性（通过 CSS 缩放或淡入淡出动画进行条件过滤）。

---

## 5. 全局辅助控制系统

### 5.1 跨平台 GitHub 链接

*   页面头部右侧提供官方 GitHub 链接，`data-testid="github-link"`。
*   `href` 对准：`https://github.com/patrick-fu/frontend-harness-slides`
*   `target="_blank"`，绝不在本地路由内部跳转。

### 5.2 语言环境切换与状态同步（Bilingual Localization）

*   **全局 EN/ZH 切换**：头部高对比度、无边框的语言切换按钮。
*   **本地存储持久化**：语言状态写入 LocalStorage（`harness-slides-language-mode`）。
*   **整站重渲染绑定**：语言切换时，Envelope UI 文本与 Style 的 `getMetadata(lang)` 以及组件的 `language` 属性在同一个 React 渲染 tick 中同步重绘。

### 5.3 全局深浅色模式自适应（Dark/Light Auto Mode）

*   三种色彩环境：**浅色（Light）、深色（Dark）、系统自动（Auto）**。
*   **默认 Auto 逻辑**：检测 `matchMedia("(prefers-color-scheme: dark)")`，首选项存本地缓存。
*   **配色对置契约**：
    *   **深色**：`bg-zinc-950 text-slate-100 border-zinc-800 shadow-2xl shadow-cyan-950/20`
    *   **浅色**：`bg-slate-100 text-slate-900 border-slate-200 shadow-md`
*   **不影响 Style 内部**：每个 Style 控制自己的背景和前景色，Envelope 主题不穿透到 Stage 内部。

### 5.4 资源声明与去重预加载策略

字体及类似共享资源采用"声明 + 去重 + fallback"三层模式：

1.  **元数据声明**：每个 Style 的 `getMetadata()` 包含 `fonts: string[]` 字段，列出该 Style 使用的所有字体族名称（如 `["Playfair Display", "Noto Serif SC"]`）。
2.  **外壳去重预加载**：Envelope 启动时遍历注册表所有 Style 的 `fonts` 数组，合并去重后在 `<head>` 注入统一的 `<link rel="stylesheet">`（Google Fonts 或等效 CDN）。这解决了 Overview 网格同时渲染 48 个缩略图时的字体风暴问题。
3.  **组件内 Fallback**：每个 Style 组件内部仍保留自己的 `@import` 或 `@font-face` 声明。这保证 Style 在脱离 Workbench 环境时仍可独立渲染（符合 D10 自包含原则）。

同一模式适用于其他可能重复加载的资源（图标集、动画库等）：在 metadata 中声明资源标识，外壳统一去重加载，组件内保留自包含 fallback。

---

## 6. 风格内容与美学规范

### 6.1 主题内容与风格设计的高保真匹配

任何新风格的文案内容不能盲目、随机拼凑。必须依据该风格的"材质、配色、图形和叙事深度"，逆向推导出最具说服力的内容。

*   **正向示例（材质内容共鸣）**：
    *   *学术哥特黑板风* → 选择《巴赫对位赋格》、《开普勒天体轨道对数推导》等数理秩序题材。
    *   *古董宣纸太政官印* → 选择《明治维新迁都东京大政》、《遣唐使航海账簿》等帝国政令题材。
    *   *大漠沙岩西域都护* → 选择《汉西域都护府屯田军实》、《张骞凿空西域沿途水井大账》等地缘战术题材。
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
?view=lab&style=01&scene=1&beat=0&pure=0
```

| 参数 | 值 | 说明 |
|------|-----|------|
| `view` | `"overview"` \| `"lab"` | 当前视图 |
| `style` | `"01"` .. `"48"` | 风格双位数 ID |
| `scene` | `1` .. `5` | 场景索引 |
| `beat` | `0` .. `N` | 节拍索引（0-based） |
| `pure` | `"1"` \| 省略 | `"1"` = 纯净模式 |

不使用 React Router。通过 `history.pushState` / `replaceState` + `popstate` 监听器实现浏览器前进/后退同步。

### 7.2 稳定帧地址（Stable Frame Address）

每个 `(styleId, scene, beat)` 组合都可以通过 URL 直接打开。这是 Harness Contract 的核心要求——测试和审查者不需要点击整个演示流程即可直达目标帧。

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
| 语言 | TypeScript |
| 测试 | Playwright |
| 部署 | Vercel + GitHub Actions CI |

### 9.2 目录结构

```
src/
├── components/
│   ├── layout/           # 外壳 chrome
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   ├── BottomBar.tsx
│   │   └── PureMode.tsx
│   ├── stage/            # Stage 容器
│   │   ├── StageWrapper.tsx
│   │   └── SlideRenderer.tsx
│   ├── views/            # 视图
│   │   ├── OverviewView.tsx
│   │   └── LabView.tsx
│   └── styles/           # 48 个风格组件
│       ├── index.ts      # Registry
│       ├── Style01.tsx
│       └── ...
├── hooks/                # useKeyboard, useSwipe, useScale 等
├── i18n/                 # 外壳 UI 翻译
├── utils/                # 导航算法、过滤逻辑
├── App.tsx
├── main.tsx
└── styles.css            # Tailwind + 全局动画
```

---

## 10. 实施阶段

```
Phase 1: 2-3 个参考风格
  目的：验证接口契约、证明自包含模式可行
  产出：2-3 个完整的 Style 组件 + 可运行的最小外壳

Phase 2: Envelope 外壳框架
  目的：搭建完整的 Workbench 功能
  产出：Overview 网格、Lab 视图、Pure Mode、导航系统、过滤系统、
        深浅色、双语、键盘/手势/分屏点击交互

Phase 3: 批量风格生产
  目的：完成全部 48 个风格
  方式：并行 sub-agents，每个 agent 接收一个风格的 Design DNA，
        独立决定内容、节拍数、转场模型、内嵌导航

Phase 4: 公共基础设施抽取
  目的：在所有风格完成后，识别并提取重复模式
  可能产出：共享动画库、字体预加载优化、SceneTrack 组件等
```

---

## 11. 测试规范

每个修改过的 HTML 幻灯片制品必须有可运行的测试命令和足够的多角度测试套件。Playwright 为推荐测试框架。

**必须覆盖的测试维度**：

| 维度 | 检查内容 |
|------|----------|
| 渲染 | Stage 可见、内容存在、无零尺寸塌陷 |
| 帧地址 | 每个 scene/beat 可通过 URL 直接打开 |
| 导航 | 键盘前后步进、跨场景边界、跨风格循环 |
| 交互隔离 | 点击 Style 内部按钮不触发切页 |
| 布局安全 | 内容不溢出 Stage 边界 |
| 运行时错误 | console 无 error/warning |
| 资源加载 | 字体、图片正常加载 |
| 构建/部署 | `npm run build` 成功 |
| 移动端 | 侧边栏默认隐藏、选择风格后自动收起 |
| 纯净模式 | `&pure=1` 隐藏外壳、Esc 退出、不跨风格 |

---

## 12. 非目标

*   不是幻灯片制作工具（不提供编辑器/创作界面）
*   不是 npm 包（不发布到 npm，不提供 import API）
*   不是演示运行器（不是 Keynote/PowerPoint 的替代品）
*   不做风格内容的人工精修——Phase 3 由 sub-agent 自生成，后续人工迭代是另一个项目
*   不做 PDF 导出（Phase 4 之后可考虑）

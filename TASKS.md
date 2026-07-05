# Implementation Tasks

按 TDD 顺序排列的实施任务清单。每个任务必须先写测试再实现。

---

## Phase 2: Envelope 外壳框架

### T2.1 — 路由与状态管理
- [ ] 测试：URL 参数解析函数（`parseQueryParams`）
  - 正常参数解析
  - 无效参数静默修正（style 超界、scene 超界、beat 超界、view 无效、pure 无效）
  - 无参数默认 Overview
- [ ] 实现：`src/utils/route.ts`
- [ ] 测试：导航计算函数（`computeNext`、`computePrev`）
  - 同 scene 内 beat 步进
  - 跨 scene 边界
  - 跨风格边界（Lab View）
  - Pure Mode 下跨风格 no-op
  - 循环回绕（最后→第一，第一→最后）
- [ ] 实现：`src/utils/navigation.ts`
- [ ] 测试：过滤逻辑（`applyFilters`）
  - Band OR 逻辑
  - Tag AND 逻辑
  - 组合过滤
  - 空过滤返回全部
- [ ] 实现：`src/utils/filter.ts`

### T2.2 — URL 状态同步 Hook
- [ ] 测试：`useUrlState` hook
  - 初始状态从 URL 读取
  - `pushState` 更新 URL
  - `popstate` 事件响应
  - 过滤状态编码/解码
- [ ] 实现：`src/hooks/useUrlState.ts`

### T2.3 — 字体预加载
- [ ] 测试：字体收集与去重函数
  - 拉丁字体去重
  - CJK 字体识别（`cjk:` 前缀）
  - 生成 Google Fonts URL
- [ ] 实现：`src/utils/fonts.ts`
- [ ] 实现：`src/hooks/useFontPreload.ts`

### T2.4 — 全局 Context
- [ ] 实现：`LanguageContext`（EN/ZH 切换 + localStorage `fhsw:language`）
- [ ] 实现：`ThemeContext`（light/dark/auto + localStorage `fhsw:theme`）
- [ ] 实现：`ReducedMotionContext`（`prefers-reduced-motion` 检测）
- [ ] 实现：Envelope i18n 翻译字典 `src/i18n/translations.ts`

### T2.5 — Stage 容器组件
- [ ] 测试：StageWrapper 渲染
  - 设置 `data-testid="stage"`、`data-style-id`、`data-scene-id`、`data-beat`
  - `container-type: size` 应用
  - `overflow: hidden` 应用
- [ ] 实现：`src/components/stage/StageWrapper.tsx`
- [ ] 实现：Stage 缩放逻辑（`transform: scale()`）
  - Lab View：可用空间 = 视口 - header - sidebar - bottombar
  - Pure Mode：可用空间 = 视口
  - Thumbnail：可用空间 = 卡片宽度
- [ ] 实现：`src/components/stage/StageScale.tsx`（计算 scale factor 的 hook）

### T2.6 — Error Boundary
- [ ] 测试：Style 渲染异常时显示 fallback
  - fallback 包含 Style ID
  - fallback 背景色使用 metadata.colors.bg
- [ ] 实现：`src/components/StyleErrorBoundary.tsx`

### T2.7 — Header 组件
- [ ] 测试：Header 渲染
  - 标题可点击返回 Overview
  - 语言切换按钮存在
  - 主题切换按钮存在
  - GitHub 链接存在且 `target="_blank"`
  - 移动端 hamburger 按钮（< 1024px）
- [ ] 实现：`src/components/layout/Header.tsx`
- [ ] 实现：`document.title` 动态更新

### T2.8 — Sidebar 组件
- [ ] 测试：Sidebar 渲染
  - 按 Band 分组展示 48 个风格
  - 当前风格高亮 + `aria-current="true"`
  - 点击风格跳转 Lab View
  - 宽度可拖拽调整（240-360px）
  - 折叠为 48px 窄条
  - 宽度/折叠状态持久化 localStorage
- [ ] 实现：`src/components/layout/Sidebar.tsx`
- [ ] 实现：移动端 slide-over drawer

### T2.9 — BottomBar 组件
- [ ] 测试：BottomBar 渲染
  - 5 个 scene dots，当前高亮 + `aria-current="true"`
  - Beat 进度条 + "N/M" 数字
  - Prev/Next 图标按钮
  - 点击 dot 跳转到对应 scene beat 0
  - 边界时按钮 disabled
- [ ] 实现：`src/components/layout/BottomBar.tsx`

### T2.10 — 键盘导航
- [ ] 测试：键盘事件处理
  - Space/→/↓ → Next
  - ←/↑ → Prev
  - Home → Scene 1 Beat 0
  - End → Scene 5 Last Beat
  - 1-5 → 跳 Scene N Beat 0
  - O → Overview
  - P → 切换 Pure Mode
  - Esc → 退出 Pure Mode
  - Tab/Shift+Tab → 下/上一个 Style
  - 150ms debounce
  - input/textarea 聚焦时禁用
- [ ] 实现：`src/hooks/useKeyboard.ts`

### T2.11 — 触摸导航
- [ ] 测试：触摸事件处理
  - 左 swipe → Next（阈值 50px）
  - 右 swipe → Prev
  - 点击右半区 → Next
  - 点击左半区 → Prev
  - 垂直 swipe 不触发导航
- [ ] 实现：`src/hooks/useTouchNav.ts`

### T2.12 — Overview View
- [ ] 测试：Overview 渲染
  - 过滤面板：Band 按钮 + Tag 云
  - 网格 `auto-fill minmax(280px, 1fr)`
  - 卡片：缩略图 + 名称 + ID
  - 空状态：无匹配时显示提示 + 清除按钮
  - 点击卡片 → Lab View Scene 1 Beat 0（instant，无动画）
- [ ] 实现：`src/components/views/OverviewView.tsx`
- [ ] 实现：`src/components/FilterPanel.tsx`
- [ ] 实现：`src/components/StyleCard.tsx`（含 IntersectionObserver 懒加载）

### T2.13 — Lab View
- [ ] 测试：Lab 渲染
  - Header + Sidebar + Stage + BottomBar 布局
  - Stage 内渲染当前 Style
  - 跨风格闪现通知（顶部细条 + 侧边栏闪烁）
  - 移动端竖屏提示
- [ ] 实现：`src/components/views/LabView.tsx`
- [ ] 实现：`src/components/CrossStyleFlash.tsx`

### T2.14 — Pure Mode
- [ ] 测试：Pure Mode 行为
  - `&pure=1` 时隐藏所有 Envelope chrome
  - Stage 撑满视口居中
  - Esc 键退出（移除 `&pure=1`）
  - 跨风格 Next no-op
  - 键盘/触摸/分屏点击仍工作
- [ ] 实现：Pure Mode 条件渲染逻辑

### T2.15 — Frozen Mode
- [ ] 测试：Frozen Mode 行为
  - `&frozen=1` 时 `<html data-frozen="true">`
  - 全局 CSS 强制 `animation-duration: 0s !important; transition-duration: 0s !important`
  - `reducedMotion=true` 传入 Style
- [ ] 实现：Frozen Mode 激活逻辑 + 全局 CSS

### T2.16 — App 根组件
- [ ] 实现：`src/App.tsx`
  - Provider 嵌套（Language → Theme → ReducedMotion → UrlState）
  - View 切换逻辑（Overview vs Lab）
  - Overview 组件保持 mounted（CSS 隐藏）保留滚动位置
  - 全局样式（Tailwind + frozen mode CSS + print CSS）

### T2.17 — 注册表与 Style 加载
- [ ] 测试：注册表完整性
  - 所有条目有唯一 ID
  - 所有条目有 component 和 getMetadata
  - getMetadata 返回完整字段
- [ ] 实现：`src/styles/registry.ts`

---

## Phase 1: 参考风格（TDD）

### T1.1 — Style 01: Executive Silence (Minimal Keynote)
- [ ] 测试文件：`src/styles/01-executive-silence.test.tsx`
  - 所有 5 scenes × N beats 可渲染
  - `isThumbnail=true` 时无交互元素
  - `onNavigate` 被内部导航调用时传正确参数
  - 无 Stage 溢出
  - `reducedMotion=true` 时无动画
- [ ] 实现：`src/styles/01-executive-silence.tsx` + `01-executive-silence.module.css`
  - 极简稀疏排版
  - 大字号标题 + 大量留白
  - 内嵌导航：幽灵弱化 dot，角落散落
  - 转场：Magic Move（背景静止，前景淡入淡出）
  - 字体：Inter 或类似无衬线
  - 内容：关于"决策的艺术"或类似 executive 主题

### T1.2 — Style 17: Editorial Broadsheet (Editorial & Print)
- [ ] 测试文件：`src/styles/17-editorial-broadsheet.test.tsx`
  - 同上测试矩阵
  - 额外：中文竖排模式（`language="zh"` 时）
- [ ] 实现：`src/styles/17-editorial-broadsheet.tsx` + `17-editorial-broadsheet.module.css`
  - 报纸/杂志排版：多栏、serif 标题、drop cap
  - 密集文本、强排版层次
  - 内嵌导航：页码样式，底部发丝线分隔
  - 转场：V-Slide（纵向翻页）
  - 字体：Playfair Display (EN) + Noto Serif SC (ZH)
  - 内容：深度报道主题，如"城市变迁"

### T1.3 — Style 33: Glass Dashboard (Contemporary Digital)
- [ ] 测试文件：`src/styles/33-glass-dashboard.test.tsx`
  - 同上测试矩阵
  - 额外：交互元素调用 `e.stopPropagation()`
- [ ] 实现：`src/styles/33-glass-dashboard.tsx` + `33-glass-dashboard.module.css`
  - Glassmorphism：毛玻璃面板、模糊背景
  - UI 组件化：卡片、指标、图表占位
  - 内嵌导航：侧边 tab 栏样式
  - 转场：H-Slide（横向面板切换）
  - 字体：Inter + JetBrains Mono（数据）
  - 内容：产品指标/数据看板主题

---

## Phase 2 补充：Playwright 审计框架

### T2.18 — Playwright 配置
- [ ] 实现：`playwright.config.ts`
  - Chromium + WebKit（如果可用）
  - Base URL: `http://localhost:4173`
  - 测试目录：`tests/`

### T2.19 — 结构审计测试
- [ ] 实现：`tests/audit.spec.ts`
  - 遍历注册表所有 Style
  - 每个 Style 的每个 scene/beat：
    - 直接 URL 打开（`&frozen=1`）
    - 验证 `data-style-id`、`data-scene-id`、`data-beat` 匹配
    - 验证 Stage 内容可见（非零尺寸）
    - 验证无溢出（scrollWidth/scrollHeight 检查）
    - 验证无 console error
  - 键盘导航测试
  - Pure Mode 测试
  - 过滤功能测试

### T2.20 — 视觉烟雾测试
- [ ] 实现：`tests/visual-smoke.spec.ts`
  - 每个 Style 的 heroScene last beat 截图
  - 代表性边缘 case 截图
  - 移动端视口截图

---

## CI/CD

### T3.1 — CI Workflow
- [ ] 实现：`.github/workflows/ci.yml`
  - 触发：push main + pull_request
  - 步骤：checkout → setup node → npm ci → build → test
  - push to main → Vercel deploy

### T3.2 — 全量审计 Workflow
- [ ] 实现：`.github/workflows/audit.yml`
  - 触发：workflow_dispatch + weekly schedule
  - 步骤：checkout → setup node → npm ci → build → Playwright 审计
  - 上传 artifacts：截图 + 审计日志

---

## 验证清单（完成标准）

- [ ] `npm test` 全部通过
- [ ] `npm run build` 成功
- [ ] `npm run test:audit` 结构审计通过
- [ ] 3 个参考风格视觉审查通过
- [ ] 移动端竖屏/横屏均可操作
- [ ] Pure Mode 截图无外壳元素
- [ ] Vercel 部署成功
- [ ] GitHub Actions CI 绿色

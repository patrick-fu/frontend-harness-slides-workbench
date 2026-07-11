# Frontend Harness Slides Workbench — 验收报告

**更新日期**：2026-07-11
**范围**：Catalog + Player 改版、完整 Topic 展示、Model ID 筛选、URL 状态、静态缩略图、响应式交互、按 Topic 拆包

## 结果

| 指标 | 实际 | 状态 |
|---|---:|---|
| Styles | 49 | ✅ |
| Topics / Catalog Cards | 146 | ✅ |
| committed WebP thumbnails | 146 / 8.4 MiB | ✅ |
| Vitest | 134 files / 1405 tests | ✅ |
| Playwright audit | 141 tests | ✅ |
| TypeScript | 0 errors | ✅ |
| production build | passed | ✅ |

## 功能验收

- Catalog 连续自适应 grid：无固定列数；卡片最小宽度 400px，窄屏自动缩到容器宽度。
- Registry 顺序展示全部 Topic；Style Group 仅用轻量起始标记，不强制独占一行。
- 第一行保留六个 Category；第二行改为 Model ID；facet 内 OR、facet 间 AND。
- 多选 `band` / `model`、语言、精确 Topic、Scene、Beat、Pure、Frozen 全部通过 query 持久化；不使用 hash。
- Topic Card 是原生精确链接；普通左键由 SPA 接管，修饰键/新标签页/上下文菜单保持浏览器语义。
- Catalog 滚动位置在进入 Player 后保留；返回时恢复。
- Player 提供 Rail、Top Bar、Library Drawer、Topic Switcher、Command Palette、五个 Scene 直达项、Beat 直达项。
- 键盘、鼠标点击区、移动端直接触摸手势共享同一导航序列；触控板和滚轮不导航。
- 左 20% 点击/触摸返回；其余 80% 前进；左/上滑前进，右/下滑返回。
- 跨 Topic 连续浏览使用 `replaceState`，不增加浏览器历史；显式选择 Topic 使用 `pushState`。
- Pure Mode 与浏览器 Fullscreen 分离；移动端旋转提示三秒后隐藏。
- Global More 提供 skill 与 Workbench 两条 GitHub 外链。

## 性能与资源

- Catalog 启动只加载同步 metadata 与静态缩略图，不加载 146 个 Stage 组件。
- 每个 Topic Stage 的 JS/CSS 独立动态加载；失败可在固定 1920×1080 Stage 内重试。
- Topic Card hover/focus/touch-start 预取精确 Topic；Player ready 后预取前后相邻 Topic。
- 当前入口 JS：约 1,149 kB / gzip 381 kB；入口 CSS：约 51 kB / gzip 9 kB。
- 入口 JS 仍超过 Vite 500 kB 警告线，主因是同步双语 metadata；Stage 组件与 CSS 已完成拆分。

## 验证命令

```bash
npm run ci
npm run test:audit
git diff --check
```

`npm run ci` 包含类型检查、生产构建、全量 Vitest、Catalog manifest drift 检查、146 份 WebP 完整性检查。

## 已知风险

- 入口同步双语 metadata 仍偏大；后续可压缩字段或拆分非首屏 metadata。
- 146 张缩略图为单一 WebP，不生成 responsive variants；这是已确认的产品取舍。
- 本报告只确认当前本地分支；部署状态需在合并/发布后单独验证。

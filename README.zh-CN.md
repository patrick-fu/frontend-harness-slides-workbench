# Frontend Harness Slides Workbench

[English](README.md)

[![Styles](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Ffrontend-harness-slides-workbench.vercel.app%2Fcatalog-stats.json&query=%24.styles&label=styles&color=1f6feb)](https://frontend-harness-slides-workbench.vercel.app)
[![Topics](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Ffrontend-harness-slides-workbench.vercel.app%2Fcatalog-stats.json&query=%24.topics&label=topics&color=8250df)](https://frontend-harness-slides-workbench.vercel.app)

一个公开的 React/Vite 工作台，用于浏览独立设计的幻灯片体验，并通过确定性、可由 URL 定位的播放器演示选定的 Topic。

它是 [Frontend Harness Slides skill](https://github.com/patrick-fu/frontend-harness-slides) 的在线配套工作台。

## 在线演示

访问[在线演示](https://frontend-harness-slides-workbench.vercel.app)。

## Catalog 与 Player

- **Catalog** 支持按 Band 和 Model ID 筛选浏览；筛选条件和语言均可通过 URL 分享。
- **Player** 打开选定的 Style 和 Topic，并支持键盘、指针和触摸的场景与节拍导航。

## Stage、Pure 与 Frozen

- **Stage** 将每个 Topic 渲染在固定的 `1920×1080` 画布上，并以可预测方式缩放。
- **Pure**（`pure=1`）隐藏 Workbench 外壳，只保留 Stage。
- **Frozen**（`frozen=1`）禁用动画和转场，用于可重复的捕捉与审阅。

## URL 查询参数

将以下查询字符串追加到在线演示 URL：

```text
?view=overview&band=minimal-keynote&model=GPT+5.5&lang=en
?view=lab&style=minimal-product-keynote&topic=product-keynote&scene=1&beat=0
?view=lab&style=minimal-product-keynote&topic=product-keynote&scene=1&beat=0&pure=1&frozen=1
```

`scene` 从 1 开始；`beat` 从 0 开始。

## 快速开始

需要 Node.js 22。

```bash
nvm use
npm ci
npm run dev
```

## 验证

先运行仓库检查，再运行浏览器审计：

```bash
npm run ci
npm run test:audit
```

## 文档

- [新增 Topics](AGENTS.md#adding-topics) — 新增一份、多份或完成 Model
  全 Style 覆盖的 Slides 指引。
- [AGENTS.md](AGENTS.md) — 完整的 Agent 与维护指引。
- [CONTEXT.md](CONTEXT.md) — 共享领域术语表。
- [ADRs](docs/adr/) — 架构决策记录。
- [SECURITY.md](SECURITY.md) — 漏洞报告政策。

## 安全

请按 [SECURITY.md](SECURITY.md) 报告漏洞。

## 第三方声明

Stadium Wave Topic 包含两个由 OpenMoji 设计的 [OpenMoji 16.0](https://openmoji.org/) 彩色 SVG 资源的本地副本：

- `openmoji-person-standing.svg` — Unicode `U+1F9CD`
- `openmoji-person-raising-hand.svg` — Unicode `U+1F64B`

来源：[OpenMoji](https://openmoji.org/)。两个文件均采用 [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) 许可。本地副本仅针对空白字符和数值精度做了优化，视觉形态保持不变。Workbench 通过 CSS transforms 改变姿态，并将站立人物与原创座椅轮廓组合。这两个本地 SVG 仍受 CC BY-SA 4.0 约束。

## 许可证

Workbench 代码和原创资源采用 [MIT License](LICENSE)。该许可证不对 OpenMoji SVG 重新授权；它们仍采用 CC BY-SA 4.0。

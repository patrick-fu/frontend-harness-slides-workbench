# Cross-Domain Topic Set：49 风格统筹方案

> 状态：规划已确认，实施已授权。本文是本 Topic Set 的唯一分配源；它不是运行时版本，也不引入 `v3` 路由。

## 1. 目标、范围与硬边界

- 为注册表中的 49 个 Style 各新增 1 个 Topic；每个 Topic 固定 5 个 Scene，英文与中文保持同一事实、同一叙事节点，但分别排版和写作。
- 先统一决定题材、叙事、观看方式、视觉引擎、Scene 动效、转场乐谱与内嵌导航，再分派实现；本阶段不创建 Topic 组件、不启动开发服务器、不启动 49 个实现 agent。
- 新 Topic 不再围绕软件发布、AI 工作流、指标、路线图、团队流程。题材构成采用 7 个 Content Territory × 7 个 Narrative Archetype 的正交矩阵。
- 每项都是事实驱动的 5-Scene 微型纪录片。约 70% 证据、30% 解释；禁止编造数字、人物、引语、实验结果或历史结论。
- Style Design DNA 与理解成本高于形式上的“绝对不重复”。允许复用底层 SVG、轨道、遮罩等 primitive；禁止复用完整构图、物理隐喻、导航套件或动效编舞。
- 交付目标仍是现有 1920×1080 React/Vite Workbench；`styleId + topicId + scene + beat` 可稳定寻址；thumbnail、frozen、reduced-motion、键盘与触摸契约不变。

## 2. 内容矩阵

### 2.1 七个 Content Territory

| 代码 | Territory | 中文 |
|---|---|---|
| U | Universe & Deep Time | 宇宙与深时间 |
| E | Earth, Ocean & Weather | 地球、海洋与天气 |
| L | Life & Evolution | 生命与演化 |
| M | Materials, Craft & Food | 材料、工艺与食物 |
| C | Cities, Machines & Infrastructure | 城市、机器与基础设施 |
| S | Sound, Body & Ritual | 声音、身体与仪式 |
| H | Memory, Language & Hidden History | 记忆、语言与隐秘历史 |

### 2.2 七个 Narrative Archetype 与统一节奏曲线

曲线数字表示五个 Scene 的局部动效峰值，不是 Topic 的总强度。

| 原型 | 五 Scene 逻辑 | 曲线 |
|---|---|---|
| Scale Journey | 微观入口 → 尺度扩展 → 系统定位 → 最大揭示 → 安静回落 | `1-1-2-3-4` Slow burn |
| Cutaway Decoding | 外观 → 剖面 → 核心机制 → 重新组装 → 一句结论 | `1-2-4-2-1` Middle reveal |
| Path Tracing | 起点 → 出发 → 中继/阻力 → 抵达 → 路径余韵 | `1-3-2-4-1` Double wave |
| Material Transformation | 原料 → 条件 → 变化 → 稳定结构 → 成品/后果 | `2-3-3-3-1` Sustained tension |
| Evidence Investigation | 问题 → 线索 A → 线索 B/反证 → 证据合流 → 结论边界 | `2-4-1-3-1` Alternating pulse |
| Dual-Force Conflict | 冲突冷开场 → 力 A → 力 B → 暂时平衡 → 未完状态 | `4-1-2-2-1` Cold open |
| Chorus of Examples | 总体冲击 → 多例并陈 → 分类 → 共同规律 → 单一静物收束 | `4-3-2-1-1` Descent to stillness |

### 2.3 49 个内容单元

每一行、每一列恰好出现一次；`F/S/W` 分别是熟悉事物的意外解释、具体冷门个案、深水 wildcard。

| Territory | Scale Journey | Cutaway Decoding | Path Tracing | Material Transformation | Evidence Investigation | Dual-Force Conflict | Chorus of Examples |
|---|---|---|---|---|---|---|---|
| U | 太阳系前尘粒（W） | 彗星解剖（F） | Voyager 穿越日球层（S） | 星尘炼成铁（F） | 小行星撞击证据（F） | 月球远离与地球日变长（S） | 自然界的计时档案（S） |
| E | 雪花从分子到晶体（F） | 怪浪解剖（S） | 撒哈拉尘埃抵达亚马孙（F） | 玄武岩风化成红土（S） | 臭氧洞如何被证实（F） | 三角洲下沉与河流造陆（S） | 南极冰芯的多信号档案（W） |
| L | 鲸落生态接替（S） | 叶片气孔的交换（F） | 帝王蝶多代迁徙（F） | 毛毛虫到蛹再到蝶（F） | 桦尺蛾实验究竟证明了什么（S） | 杜鹃与宿主的卵拟态军备竞赛（S） | 地衣其实是多伙伴共同体（W） |
| M | 一根蚕丝到一块织物（S） | 夹层安全玻璃为何裂而不散（F） | 可可发酵到巧克力香气（F） | 湿气中固化的漆（W） | 无损识别古画颜料（S） | 钢筋混凝土的拉与压（F） | 人类制造蓝色的七条路径（S） |
| C | 水塔如何稳住城市水压（F） | 机械钟擒纵器（F） | 城市地下的气动邮政（W） | 废热进入区域供暖（S） | 用声发射寻找桥梁裂缝（S） | 电梯轿厢与配重（F） | 让桥梁可以移动的隐藏装置（S） |
| S | 声波到听觉（F） | 声带如何产生音高（F） | 看台人浪如何传播（F） | 舞谱如何变回身体动作（S） | 从乐器与空间重建古代音乐（S） | 自由潜水中的节氧与压力（S） | 山谷间的口哨语言（W） |
| H | 字母 A 的形态谱系（F） | 多光谱下的重写羊皮卷（S） | `tea/cha` 两条词路（F） | 口述史诗成为文字后改变了什么（S） | 罗塞塔石碑与破译证据（F） | 地方太阳时与铁路标准时（S） | 藏在建筑墙体里的仪式物件（W） |

## 3. 组合配额与防同质化规则

### 3.1 精确配额

| 轴 | 配额 |
|---|---|
| 题材熟悉度 | F 21 / S 21 / W 7；每 Territory 各 `3/3/1` |
| Style 适配 | Direct 28 / Metaphor 14 / Productive Contrast 7；每 Territory 1 个 Contrast |
| Viewing Mode | Stage impact 15 / Visual narrative 9 / Diagram explainer 14 / Editorial reading 6 / Evidence report 5 |
| Motion Intensity | 1/5 ×7 / 2/5 ×14 / 3/5 ×14 / 4/5 ×10 / 5/5 ×4 |
| Signature Effect | 7 个；每 Territory 仅 1 个 |
| 原创代码主视觉 | 至少 14 个 Topic；不以外部图片代替解释 |

### 3.2 Viewing Mode 与 Visual Engine 分离

- Stage impact：低字数，演讲者主导；冲击可能来自巨型文字、灯光、单一物体或几何力。
- Visual narrative：以连续画面讲故事；可以是照片、拼贴、木版、Emoji、像素角色或绘制图形。
- Diagram explainer：图形先于段落；重点是剖面、路径、力、交换、系统状态。
- Editorial reading：允许较高文字密度，靠标题层级、图注、边注和留白组织阅读。
- Evidence report：证据链、来源、置信边界可见；动效服务于比对和定位，不表演。

Visual Engine 必须具体到媒介：type-as-image、light/stage、photo/cinematic、fixed SVG Emoji、原创可爱 SVG、手绘推理、科学/工程绘图、几何力、材料/印刷、机械物体、仪器/UI/game、编辑/证据。禁止把“视觉冲击”当成统一引擎。

主 Visual Engine 分布如下；每项仍可使用一个次要 accent，但不得改变主物理：

| Primary Visual Engine | Style # | 数量 |
|---|---|---:|
| Type as image | 06, 19, 23 | 3 |
| Light / stage | 04, 08 | 2 |
| Photo / cinematic macro | 01, 36, 39 | 3 |
| Fixed SVG Emoji acting | 07 | 1 |
| Original cute SVG | 13 | 1 |
| Hand-drawn reasoning | 12, 40 | 2 |
| Technical / scientific drawing | 02, 05, 09, 27, 48 | 5 |
| Geometric force | 22, 28, 31, 32 | 4 |
| Materials / print | 03, 14, 24, 25, 26, 29, 37 | 7 |
| Physical object / mechanics | 15, 33, 34, 38, 49 | 5 |
| UI / instrument / game | 10, 11, 16, 17, 30, 35, 41 | 7 |
| Editorial / evidence | 18, 20, 21, 42, 43, 44, 45, 46, 47 | 9 |

### 3.3 Motion Language

可用 12 类：Type choreography、Stroke drawing、Line drawing/growth、Shape morph、Character acting、Material operations、Object mechanics、Camera/light、Path/topology、Data/instrument、Document/evidence、Environmental life。每 Topic 1 个主语言，最多 1 个辅助语言。普通 fade-up 只能做辅助或 reduced-motion 前的保底，不能成为主编舞。

| Primary Motion Language | 数量 |
|---|---:|
| Type choreography | 3 |
| Stroke drawing | 3 |
| Line drawing/growth | 4 |
| Shape morph | 4 |
| Character acting | 4 |
| Material operations | 5 |
| Object mechanics | 6 |
| Camera/light | 3 |
| Path/topology | 4 |
| Data/instrument | 4 |
| Document/evidence | 6 |
| Environmental life | 3 |

同一 `Primary + Secondary` 最多出现 2 次；完整 fingerprint 还必须加入 Visual Engine、材料物理、节奏曲线、signature Scene 与 easing，因此共享语言不等于共享编舞。

### 3.4 Emoji、手绘与图形隐喻的边界

- `sketch-board-emoji`：许可清晰、固定版本的 SVG Emoji 是主角；不使用 OS 原生 glyph。
- `engineering-whiteboard-explainer`：Emoji 只作为图节点上的语义贴纸；主视觉仍是工程图。
- `soft-pastel-friendly`：原创圆润 SVG 角色/图标；不是 Emoji。
- `arcade-boss-fight`：像素 sprite；不是 Emoji。
- 至少 14 项以 SVG/CSS 自绘剖面、力场、路径或物体作为视觉比喻；AI 图只能是气氛/隐喻，不能充当历史、科学或人物证据。

## 4. 转场、导航与资产系统

### 4.1 21 个共享转场 primitive

| Family | Primitives |
|---|---|
| Editing | `hard-cut`, `crossfade`, `dip-to-color` |
| Spatial push | `push-x`, `push-y`, `diagonal-pan` |
| Camera depth | `zoom-through`, `dolly-pull`, `focus-swap` |
| Mask/aperture | `linear-wipe`, `iris-open`, `multi-blind` |
| Material surface | `page-turn`, `paper-fold`, `ink-spread` |
| Structural | `grid-reveal`, `split-merge`, `card-carousel` |
| Signal/time | `glitch`, `scanline`, `afterimage` |

每 Topic 的四条 Scene edge 形成唯一 Transition Score，并只使用 2–3 个 family。具体 Style 不能自己维护 outgoing clone；由扩展后的 `SpatialSceneTrack` 统一生命周期、中断、frozen 与 reduced-motion。转场优先级高于 Beat 动效；二者不同时抢峰值。

### 4.2 七个受控 Signature Effect

| Territory | Topic / Style | 效果 | Reduced motion |
|---|---|---|---|
| U | Voyager / Retro Windows | CRT 星图越过日球层边界，遥测窗口失去太阳风底噪 | 静态前后两帧 + 边界高亮 |
| E | 南极冰芯 / Cassette-Era Packaging | 冰芯像磁带被光谱“播放”，气泡/灰尘/同位素轨同步 | 直接显示三轨并列读数 |
| L | 杜鹃卵拟态 / Arcade Boss Fight | 蛋纹 sprite 在宿主关卡中逐代变形 | 三个静态代际 sprite |
| M | 漆固化 / After-Hours Luxe | 湿度触发漆面由散射转为深色镜面光泽 | 切换前后材质样片 |
| C | 气动邮政 / Red Wedge Agitprop | 胶囊沿对角红管压缩冲出，墙面短暂回弹 | 路径与终点瞬时强调 |
| S | 看台人浪 / Sketch Board Emoji | 固定 SVG Emoji 分区起立、传递、坐下，波速由节拍体现 | 五段静态人群姿态 |
| H | 字母 A 谱系 / Kinetic Type Punchline | 牛头符号经旋转、简化、翻转形成现代 A | 关键字形硬切序列 |

### 4.3 Navigation Language：三轴、但不混写

每项分别声明：纯 carrier geometry、invocation、feedback。Carrier 名称只描述承载形状，不提前包含“长按、滑动、发光”等行为。49 个 invocation × feedback 组合采用 7×7 拉丁方，确保不重复；几何允许同 family，但具名 carrier 不重复。

- Geometry family：ambient、edge scale、path、object controller、card/miniature、typographic index、spatial node。
- Invocation：persistent、auto-hide、proximity reveal、click-expand、drag/scrub、keyboard focus、gesture/hold。
- Feedback：active glow、history trail、next-state preview、mechanical displacement、geometry reflow、material/color change、typographic emphasis。
- 所有 hover/proximity 行为必须有触摸点击替代；所有 drag/hold 必须有键盘等价；`isThumbnail` 时完全隐藏。

### 4.4 资产与研究包

- 代码绘制优先：SVG/CSS/DOM；照片或档案只用 public-domain/open-license，并在 Topic 旁记录来源、许可、裁切与本地文件名。
- 禁止远程 hotlink。纹理本地化；来源不明的 Pinterest/博客图不可进入资产包。
- 每个 Topic 在实现前完成 research brief：至少 3 个权威来源；科学/历史定量 claim 可追溯到具体来源。
- Evidence report 在画面显示来源；Editorial reading 用边注/脚注；Diagram explainer 只对数值、历史与科学结论显示引用；Visual narrative 将完整来源放 Topic notes；Stage impact 只在核心数字或引语出现时可见引用。

## 5. 49 项总览

`D/M/X` = Direct / Metaphor / Productive Contrast。Viewing Mode：`SI/VN/DE/ER/EV` = Stage impact / Visual narrative / Diagram explainer / Editorial reading / Evidence report。

| # | Style | 新 Topic | 单元 | 适配 | Mode | 强度 |
|---:|---|---|---|---|---|---:|
| 01 | minimal-product-keynote | A Grain Older Than the Sun / 比太阳更老的一粒尘 | U×Scale W | M | SI | 1 |
| 02 | objective-swiss-grid | The Bridge Must Move / 桥必须会移动 | C×Chorus S | D | DE | 1 |
| 03 | wabi-sabi-ceramic | Stone Becoming Soil / 石头如何成为土壤 | E×Transform S | M | SI | 2 |
| 04 | interactive-dialogue-stage | Two Voices in One Throat / 一副喉咙里的两种力量 | S×Cutaway F | X | SI | 4 |
| 05 | cyanotype-drafting-table | Anatomy of a Comet / 彗星解剖图 | U×Cutaway F | D | VN | 2 |
| 06 | kinetic-type-punchline | Before A Was A / A 还不是 A 的时候 | H×Scale F | X | SI | 5 |
| 07 | sketch-board-emoji | The Wave With No Water / 没有水的人浪 | S×Path F | M | VN | 4 |
| 08 | spotlight-quote-poster | One Breath, Two Pressures / 一口气，两种压力 | S×Dual S | M | SI | 2 |
| 09 | subway-map-of-intent | Tea by Sea, Cha by Land / 茶的两条词路 | H×Path F | D | DE | 2 |
| 10 | benchmark-matrix | Seven Ways Nature Keeps Time / 自然保存时间的七种方式 | U×Chorus S | D | DE | 2 |
| 11 | signal-pipeline-flow | The City’s Second Heat / 城市的第二次热量 | C×Transform S | D | DE | 4 |
| 12 | engineering-whiteboard-explainer | Why Cities Need Water Towers / 城市为何需要水塔 | C×Scale F | D | DE | 4 |
| 13 | soft-pastel-friendly | The Body Rebuilt Inside a Chrysalis / 蛹里重建的身体 | L×Transform F | D | DE | 3 |
| 14 | kitchen-prep-station | Fermentation Before Chocolate / 巧克力之前的发酵 | M×Path F | D | DE | 3 |
| 15 | collaborative-pairing-board | The Elevator’s Invisible Partner / 电梯看不见的搭档 | C×Dual F | M | DE | 3 |
| 16 | studio-mixing-console | The Moon Pulls, the Day Lengthens / 月球拉远，白昼变长 | U×Dual S | M | DE | 3 |
| 17 | debug-reaction-board | Listening for a Crack / 听见桥梁裂缝 | C×Evidence S | D | DE | 3 |
| 18 | front-page-broadsheet | The Rogue Wave File / 怪浪档案 | E×Cutaway S | D | ER | 1 |
| 19 | magazine-masthead | The Moth Experiment, Reopened / 重审桦尺蛾实验 | L×Evidence S | D | ER | 2 |
| 20 | warm-editorial-feature | When an Epic Becomes a Page / 当史诗成为纸页 | H×Transform S | D | ER | 2 |
| 21 | scholars-vellum | The Text Under the Text / 文字下面的文字 | H×Cutaway S | D | ER | 1 |
| 22 | solar-biennale-poster | How a Star Makes Iron / 恒星如何炼出铁 | U×Transform F | M | SI | 3 |
| 23 | duotone-session | A Dance Written Twice / 一支舞的两次书写 | S×Transform S | D | SI | 4 |
| 24 | riso-print-zine | Seven Blues / 七种蓝 | M×Chorus S | D | VN | 5 |
| 25 | analog-cutout-collage | What the Wall Kept / 墙里藏着什么 | H×Chorus W | D | VN | 3 |
| 26 | woodblock-floating-world | A Language Carried by Mountains / 山谷传递的语言 | S×Chorus W | M | VN | 1 |
| 27 | botanical-specimen-plate | The Leaf’s Smallest Bargain / 叶片最小的交换 | L×Cutaway F | D | ER | 2 |
| 28 | machine-age-deco | Concrete’s Two Strengths / 混凝土的两种力量 | M×Dual F | D | SI | 4 |
| 29 | expedition-screenprint | Dust Across an Ocean / 尘埃横渡大西洋 | E×Path F | D | SI | 3 |
| 30 | cassette-era-packaging | The Ice That Recorded the Sky / 记录天空的冰 | E×Chorus W | X | VN | 3 |
| 31 | neo-brutalist-bulletin | The Delta Is Losing Ground / 三角洲正在失去地面 | E×Dual S | M | VN | 3 |
| 32 | red-wedge-agitprop | Mail Under Pressure / 压力驱动的城市邮件 | C×Path W | X | SI | 5 |
| 33 | mechanical-scoring-funnel | How a Snowflake Chooses Its Branches / 雪花如何长出分支 | E×Scale F | M | DE | 3 |
| 34 | liquid-glass | Cracked, Still Holding / 裂了，仍然连在一起 | M×Cutaway F | D | SI | 4 |
| 35 | retro-windows | Voyager at the Edge of the Sun / Voyager 抵达太阳边界 | U×Path S | X | VN | 4 |
| 36 | mid-century-grove | Four Generations, One Migration / 四代完成一次迁徙 | L×Path F | D | VN | 2 |
| 37 | after-hours-luxe | Lacquer Needs Humidity / 漆需要湿气 | M×Transform W | D | SI | 3 |
| 38 | operating-manual | The Escapement / 擒纵器 | C×Cutaway F | D | DE | 2 |
| 39 | widescreen-title-card | After the Whale Falls / 鲸落之后 | L×Scale S | M | SI | 4 |
| 40 | blackboard-chalk-talk | From Air to Hearing / 从空气到听觉 | S×Scale F | D | DE | 3 |
| 41 | arcade-boss-fight | The Egg-Mimic Arms Race / 卵拟态军备竞赛 | L×Dual S | X | SI | 5 |
| 42 | research-memo | The Case for an Impact / 撞击说的证据 | U×Evidence F | D | EV | 1 |
| 43 | decision-record | Why Noon Stopped Being Local / 正午为何不再属于本地 | H×Dual S | D | EV | 1 |
| 44 | maintainer-issue-brief | Finding the Ozone Hole / 臭氧洞如何被发现 | E×Evidence F | M | EV | 2 |
| 45 | field-notes-report | Reconstructing a Lost Sound / 重建失落的声音 | S×Evidence S | D | ER | 2 |
| 46 | annotated-source-diff | How the Rosetta Stone Was Read / 罗塞塔石碑如何被读懂 | H×Evidence F | M | EV | 2 |
| 47 | checklist-ledger | Identify the Pigment Without Touching It / 不触碰地识别颜料 | M×Evidence S | X | EV | 2 |
| 48 | context-bento-box | Lichen Is Not One Organism / 地衣不是一个生物 | L×Chorus W | M | DE | 3 |
| 49 | object-metaphor-hero | From Cocoon to Cloth / 从蚕茧到织物 | M×Scale S | D | SI | 4 |

---

## 6. 逐 Style 实施简报

以下每节都是未来单个实现 agent 的边界。Scene 括号中的数字是该 Scene 的局部动效强度；Topic 总强度见标题行。

### 01 — `minimal-product-keynote` · Presolar Grain · 总强度 1/5

- **注册信息**：`topicId: presolar-grain`；TopicBar `Presolar Grain / 太阳前尘`。U×Scale，Wildcard，Metaphor，Stage impact。核心句：实验室里的一粒矿物，可以携带太阳诞生前恒星的同位素指纹。
- **Style fit**：把“产品 hero”换成唯一一粒尘；奢华来自尺度反差与留白，不来自高运动。Visual Engine 为宇宙微粒实物 hero + 巨型尺度文字；构图序列 `macro-object → empty-field → isotope-map → cosmic-scale → single-object`。
- **Scene 1（1）**：近乎全黑，中央一粒 3D/SVG 矿物切面；只让掠射光移动一次，标题静置。
- **Scene 2（1）**：视野退到陨石薄片，尘粒仍是唯一高亮；边注出现“如何被识别”，不堆参数。
- **Scene 3（2）**：同位素比例以三条极细轨道从粒内长出，与太阳系常见值形成非对称对照。
- **Scene 4（3）**：背景尺度从实验室、陨石、原行星盘扩展到母恒星；总强度被 1/5 ceiling 压成连续缩放而非飞行。
- **Scene 5（4）**：所有尺度折回到一粒尘，出现一句收束；只有最后 1% 的 focus shift，长时间静止。
- **Motion**：主 Camera/light，辅 Type choreography；attention curve `1-1-2-3-4`，800–1400ms ease-out，Scene 5 为 quiet hold。禁止循环星空和粒子墙。
- **Navigation**：ambient / `corner grain field` / persistent / active glow；五粒微尘分布在右上角，当前位置仅改变亮度，不形成底部点条。
- **Transition Score**：`crossfade → iris-open → zoom-through → dip-to-color`。Reduced motion 全部改为 hard cut + 最终清晰帧；此处的 zoom 被 1/5 ceiling 压成克制的尺度换挡。
- **资产/研究**：原创 SVG/CSS hero。目标来源 NASA Astromaterials、NASA Astrobiology、同行评议 presolar-grain 论文；`research_status: pending`。不得给出未经 facts packet 核验的具体年龄纪录。
- **碰撞/禁用**：旧库最近 `product-keynote`，但本项是科学尺度论证而非产品揭幕；新批最近“星尘炼铁”，差异是“保存恒星证据”而非“元素生成”。禁 mockup、卖点卡、三行 KPI。

### 02 — `objective-swiss-grid` · Bridge Movement · 总强度 1/5

- **注册信息**：`topicId: bridge-movement`；TopicBar `Bridge Movement / 桥的位移`。C×Chorus，Specific，Direct，Diagram explainer。核心句：桥不是靠完全不动来保持安全，而是靠一组可控的移动装置处理温度、车辆与地震。
- **Style fit**：Swiss grid 直接承载分类与公差；Visual Engine 为工程构件标本 + 尺规信息图；构图 `thesis-grid → component-row → section-comparison → force-table → resolved-grid`。
- **Scene 1（4）**：大标题“THE BRIDGE MUST MOVE”，一条严格基线在桥面下方；标题不是动画主角，桥面长度轻微伸缩一次。
- **Scene 2（3）**：轴承、伸缩缝、阻尼器、铰与滑移面按功能进入同一网格，每次只聚焦一个。
- **Scene 3（2）**：两张精确剖面展示“允许哪一方向移动、限制哪一方向”，规则线逐段校准。
- **Scene 4（1）**：温度/交通/风/地震 × 装置的稀疏矩阵静态落位；无计数器和热力彩色噪声。
- **Scene 5（1）**：桥梁轮廓回归，装置位置成为五个微小注记；保留阅读停顿。
- **Motion**：主 Object mechanics，辅 Data/instrument；curve `4-3-2-1-1` 在 1/5 ceiling 下表现为“注意力顺序”，位移不超过 1cqw。
- **Navigation**：edge scale / `bearing ruler` / persistent / history trail；左边缘为公差刻度，已读 Scene 留极细历史线。
- **Transition Score**：`dip-to-color → linear-wipe → crossfade → linear-wipe`；只用 Editing + Mask，保证图解稳定。
- **资产/研究**：自绘桥面剖面。目标来源 FHWA/各国桥梁设计手册、结构工程教材、具体桥梁维护资料；`pending`。装置名称与作用不能凭常识简化。
- **碰撞/禁用**：旧库最近 `infrastructure-gala`，差异是隐蔽运动机制而非宏大基础设施愿景；新批最近“钢筋混凝土”，差异是连接与自由度而非材料受力。禁 dashboard、圆角卡、赢家排名。

### 03 — `wabi-sabi-ceramic` · Stone to Soil · 总强度 2/5

- **注册信息**：`topicId: stone-to-soil`；TopicBar `Stone to Soil / 石成土`。E×Material Transformation，Specific，Metaphor，Stage impact。核心句：红色热带土不是“碎石粉末”，而是玄武岩在水、热与时间里选择性失去和重组后的材料。
- **Style fit**：陶土的哑光、不均匀和裂隙帮助理解风化与成土；不是用陶器假装岩石。Visual Engine 为手作材料样片 + 土壤剖面；构图 `stone-object → wet-surface → mineral-fragments → soil-profile → bowl-of-earth`。
- **Scene 1（2）**：一块黑色玄武岩孤置在暖灰台面，微光扫出孔隙。
- **Scene 2（3）**：雨水沿真实裂隙渗入，表面颜色与粗糙度分区变化；不做“溶解魔法”。
- **Scene 3（3）**：矿物片像陶片一样缓慢分层，保留“溶出/残留/新生黏土矿物”三个证据层。
- **Scene 4（3）**：侧面土壤剖面逐层沉降，铁氧化物只以颜色变化表达，定量信息旁注。
- **Scene 5（1）**：一只不完美陶碗盛一撮红土；无运动，只留材料来源一句话。
- **Motion**：主 Material operations，辅 Environmental life；curve `2-3-3-3-1`，湿润扩散、颗粒沉降、釉感退去，400–1000ms 非匀速。
- **Navigation**：object controller / `ceramic shard ring` / persistent / mechanical displacement；五枚不规则陶片围绕样品，当前片轻微错位。
- **Transition Score**：`ink-spread → dolly-pull → ink-spread → iris-open`；ink 只模拟水渗边界，不变成水墨装饰；dolly 幅度受 2/5 ceiling 限制。
- **资产/研究**：原创 CSS 材质 + SVG 剖面；目标来源 USGS、土壤学机构与玄武岩风化论文；`pending`。颜色、矿物转化与气候条件需分别核验。
- **碰撞/禁用**：旧库最近 `repair-as-strategy`，差异是不可逆地球化学转化，不讲修复；新批最近“漆固化”，差异是分解/重组而非聚合固化。禁金缮裂纹、陶器轮播、完美渐变球。

### 04 — `interactive-dialogue-stage` · Vocal Folds · 总强度 4/5

- **注册信息**：`topicId: vocal-folds`；TopicBar `Vocal Folds / 声带`。S×Cutaway，Familiar，Productive Contrast，Stage impact。核心句：音高并不是一根“声带弦”单独发出，而是气流、组织振动与声道共鸣的分工结果。
- **反差价值**：把两片组织与气流设为两位舞台角色，能看清“驱动—振动—塑形”的对话；避免把身体拟人成聊天机器人。Visual Engine 为双角色光场剖面；构图 `dark-stage → paired-curtains → cutaway → resonance-space → voice-line`。
- **Scene 1（1）**：舞台只有 AIR 与 FOLD 两束灯，气流在闭合前停止；悬念而非解释。
- **Scene 2（2）**：两片声带从俯视与侧视两角度对齐，开合频率只通过节拍和标尺表现。
- **Scene 3（4）**：剖面放大：气压推开、组织弹性回位、周期振动形成声源；三步互相接力，不同时乱动。
- **Scene 4（2）**：声源进入声道，空间形状改变频谱；灯光从喉部交给口腔轮廓。
- **Scene 5（1）**：完整声音波形与一句短句出现，舞台灯熄成一条细线。
- **Motion**：主 Character acting，辅 Camera/light；curve `1-2-4-2-1`，弹性开合使用受控 spring，剖面 600ms settle；Scene 5 quiet。
- **Navigation**：spatial node / `vocal-fold stage plan` / persistent / typographic emphasis；五个灯位直接对应 Scene，当前灯位的标签增重。
- **Transition Score**：`split-merge → focus-swap → grid-reveal → split-merge`；Scene 3 进入时 split，Scene 5 合拢。
- **资产/研究**：原创 SVG 喉部剖面；目标来源 NIH/NIDCD、语音科学教材、喉科学机构；`pending`。不得将简化图当医学诊断。
- **碰撞/禁用**：旧库最近 `better-question`，差异是生理机制，不是人机问答；新批最近“从空气到听觉”，一个讲声源生成，一个讲接收转换。禁聊天气泡、头像、左右对称观点卡。

### 05 — `cyanotype-drafting-table` · Comet Anatomy · 总强度 2/5

- **注册信息**：`topicId: comet-anatomy`；TopicBar `Comet Anatomy / 彗星解剖`。U×Cutaway，Familiar，Direct，Visual narrative。核心句：彗星靠近太阳时，核、彗发、尘尾和离子尾成为方向与材料不同的一套结构，尾巴不只是“拖在后面”。
- **Style fit**：蓝晒尺规与天文观测草图天然匹配剖面和方向；Visual Engine 为 cyanotype 科学图版；构图 `silhouette → nucleus-section → jet-field → twin-tail-map → orbital-plate`。
- **Scene 1（1）**：深蓝纸上只压印彗核不规则轮廓与比例尺，标题像图纸编号。
- **Scene 2（2）**：核的表层/挥发物/尘埃以剖切层显示；尺寸与组成只用已核验数据。
- **Scene 3（4）**：日照区升华喷流逐笔绘出，彗发扩展；这是唯一峰值 Scene。
- **Scene 4（2）**：尘尾弯曲、离子尾沿太阳风方向展开；太阳方向箭头始终可见，避免“运动尾迹”误解。
- **Scene 5（1）**：轨道图把四个结构重新放回时间位置，蓝晒逐渐停止曝光。
- **Motion**：主 Stroke drawing，辅 Camera/light；curve `1-2-4-2-1`，SVG stroke 450–900ms，喷流的漂移仅在 Scene 3。
- **Navigation**：edge scale / `comet sectional scale` / auto-hide / next-state preview；靠右比例尺在静置后淡出，触摸时 tap 显示下一剖面缩略。
- **Transition Score**：`linear-wipe → push-x → iris-open → dip-to-color`；像换一张蓝图纸，不使用 3D 翻页。
- **资产/研究**：原创 SVG；目标来源 NASA/JPL、ESA/Rosetta、同行评议彗星结构资料；`pending`。真实任务照片可选，但须许可与本地 manifest。
- **碰撞/禁用**：旧库最近 `resilience-blueprint`，差异是观测剖面，不是系统规划；新批最近“Voyager”，一个解释天体结构，一个追踪探测器路径。禁通用系统框图、圆节点流水线、霓虹太空背景。

### 06 — `kinetic-type-punchline` · Before A · 总强度 5/5

- **注册信息**：`topicId: before-a`；TopicBar `Before A / A之前`。H×Scale，Familiar，Productive Contrast，Stage impact。核心句：现代 A 的稳定外形，来自一个图像符号在不同书写系统中持续旋转、抽象和重排。
- **反差价值**：不是用巨字包装历史，而是让字形本身成为证据与时间机器。Visual Engine 为 type-as-image 字形考古；构图 `single-glyph → glyph-pair → lineage-strip → full-field-morph → modern-letter`。
- **Scene 1（1）**：现代 A 占满画面，标题只有 “BEFORE A”。中文版本用“A 之前”与同一字形，不靠英文双关。
- **Scene 2（1）**：早期牛头形符号与方向标记硬切对照，出处在底边小字。
- **Scene 3（2）**：关键中间形态按时间与书写方向排列；每个 Beat 只加入一个可核验节点。
- **Scene 4（3）**：Signature：符号旋转、简化、翻转后成为现代 A；每一步保留 ghost，拒绝一键液态 morph 伪造连续性。
- **Scene 5（4）**：巨型 A 定格，内部留下前代字形的切口；最后一个 punch 后静止。
- **Motion**：主 Type choreography，辅 Shape morph；curve `1-1-2-3-4`，100–450ms 硬节拍 + 700ms 最终 hold。Signature reduced motion 为四个关键字形硬切。
- **Navigation**：typographic index / `letterform lineage index` / persistent / material-color change；五个时代缩写沿左边竖排，当前项从纸白切到红色。
- **Transition Score**：`afterimage → zoom-through → multi-blind → afterimage`；仅本 Topic 使用如此激进的字形时间残影组合。
- **资产/研究**：字形轮廓必须按碑铭/博物馆出处重绘并记录，不直接抓字体替代古文字。目标来源 British Museum 等藏品、专业书写史研究、Unicode/碑铭数据库；`pending`。
- **碰撞/禁用**：旧库最近 `one-constraint-wins`，差异是字形谱系论证而非口号；新批最近“罗塞塔石碑”，一个追踪形态演变，一个解释破译方法。禁长段落、三字卡、无出处的“顺滑进化链”。

### 07 — `sketch-board-emoji` · Stadium Wave · 总强度 4/5

- **注册信息**：`topicId: stadium-wave`；TopicBar `Stadium Wave / 看台人浪`。S×Path，Familiar，Metaphor，Visual narrative。核心句：人浪传播的是一个局部动作规则，而不是人群沿看台移动。
- **Style fit**：固定 SVG Emoji 是“坐下/起立/观察邻座”的演员，手绘看台承担空间关系。Visual Engine 为 Emoji character acting；构图 `crowd-board → local-rule → wave-path → interference → settled-crowd`。
- **Scene 1（1）**：一圈坐着的观众 Emoji，只有一人举手；不先播放完整波浪。
- **Scene 2（3）**：相邻角色依次站起/坐下，手绘箭头说明局部触发；每 Beat 增加一段。
- **Scene 3（2）**：俯视看台显示“人不移动、状态移动”，位置点保持固定。
- **Scene 4（4）**：Signature：多分区 SVG Emoji 以不同延迟接力；展示相遇、衰减或断点中的一种，不做无限循环。
- **Scene 5（1）**：所有人坐下，只留一条波形粉笔线和结论。
- **Motion**：主 Character acting，辅 Path/topology；curve `1-3-2-4-1`，140–220ms 分区节拍、gentle spring；reduced motion 为五段静态姿态。
- **Navigation**：spatial node / `stadium seating array` / auto-hide / active glow；五个看台扇区对应 Scene，点击/键盘均可用。
- **Transition Score**：`push-x → card-carousel → diagonal-pan → grid-reveal`；carousel 表现视角绕看台，不渲染卡片 UI。
- **资产/研究**：使用固定许可 SVG Emoji 套件并本地化；看台与路径原创 SVG。目标来源群体动力学/人浪传播的同行评议研究与体育场记录；`pending`。
- **碰撞/禁用**：旧库最近 `human-loop-retrofit`，差异是集体传播机制而非协作流程；新批最近“口哨语言”，一个传播状态、一个远距编码语言。禁 OS Emoji、彩纸庆祝、pastel 三卡、无限人浪 loop。

### 08 — `spotlight-quote-poster` · Freedive · 总强度 2/5

- **注册信息**：`topicId: freedive`；TopicBar `Freedive / 自由潜水`。S×Dual，Specific，Metaphor，Stage impact。核心句：自由潜水同时面对氧气预算与不断增加的环境压力，身体的应对并不是“忍住呼吸”这么简单。
- **Style fit**：单束光把一口气作为珍贵、有限的主角；引用式排版只放经核验短句或原创解释，不制造名人引语。Visual Engine 为身体剪影 + 光圈/压力环；构图 `breath-hero → oxygen-gauge → pressure-depth → split-body → dark-hold`。
- **Scene 1（4）**：一次可见吸气后立刻冷开场：人物剪影下沉，光圈收紧；没有数字洪流。
- **Scene 2（1）**：氧气路径以胸腔—血液—器官三处微光表示，出现节氧反应的边界说明。
- **Scene 3（2）**：水压环随深度变密，耳/肺以抽象剖面标示，不做医疗演示。
- **Scene 4（2）**：左右两束灯分别代表氧预算与压力，短暂交叠成可管理区间。
- **Scene 5（1）**：画面回到水面一圈呼吸光，停留在“生理解释不等于训练建议”。
- **Motion**：主 Camera/light，辅 Environmental life；curve `4-1-2-2-1`，700–1200ms 慢压缩；Scene 5 quiet，无 loop。
- **Navigation**：ambient / `footlight notches` / auto-hide / history trail；舞台底边五道极弱脚灯，已读位置留短暂余光，但不是传统 dots。
- **Transition Score**：`iris-open → linear-wipe → focus-swap → dip-to-color`；dip 取深海蓝，严禁闪白。
- **资产/研究**：原创剪影和压力环；目标来源 DAN、潜水医学/生理学论文、专业医疗机构；`pending`。避免训练建议、纪录崇拜与风险浪漫化。
- **碰撞/禁用**：旧库最近 `kept-sentence`，差异是生理双力解释而非金句提炼；新批最近“声带”，一个讲缺氧/压力，一个讲发声结构。禁伪引语、名人头像、深海 stock hero、连续呼吸动画。

### 09 — `subway-map-of-intent` · Tea / Cha · 总强度 2/5

- **注册信息**：`topicId: tea-cha-routes`；TopicBar `Tea / Cha / 茶与Cha`。H×Path，Familiar，Direct，Diagram explainer。核心句：世界各地“茶”的两大词族，常与海路和陆路传播相关，但不能被简化成一张没有例外的二色地图。
- **Style fit**：地铁图负责表现词形传播、转写与换乘，不把语言史画成现代国界。Visual Engine 为语言地理 route map；构图 `word-pair → origin-cluster → sea-route → land-route → exception-map`。
- **Scene 1（1）**：`TEA / CHA` 两词像两个站牌并置；中文以“茶”作为共同源头，不制造英文中心。
- **Scene 2（3）**：在中国方言/历史接触点上建立起点簇，站名同时显示原语言与转写。
- **Scene 3（2）**：海路词形沿港口传播，线条在具体语言节点发生拼写变体。
- **Scene 4（4）**：陆路词形穿过中亚/欧亚节点；只画有来源支持的中继，不把贸易路线当单一因果。
- **Scene 5（1）**：例外、借词时间差和混合路径覆盖在全图上，结论改为“强模式，不是铁律”。
- **Motion**：主 Path/topology，辅 Document/evidence；curve `1-3-2-4-1`，路线按语言证据逐段生长，停站 260–400ms。
- **Navigation**：path / `tea-cha route lines` / persistent / next-state preview；当前路线旁预亮下一站，键盘与 tap 都能绝对跳转。
- **Transition Score**：`push-x → linear-wipe → iris-open → diagonal-pan`；方向由对应历史路线决定，不使用固定左到右进度条。
- **资产/研究**：原创 SVG 地图；目标来源历史语言学论文、词源词典、海洋/陆路贸易史研究；`pending`。制作前必须建立“语言—词形—最早记录—借入路径”证据表。
- **碰撞/禁用**：旧库最近 `three-tracks-release`，差异是语言扩散与例外，不是项目汇流；新批最近“口哨语言”，一个追踪借词地理，一个解释同语言的声学编码。禁五站进度条、现代地铁 logo、无来源“一海一陆”绝对论。

### 10 — `benchmark-matrix` · Natural Clocks · 总强度 2/5

- **注册信息**：`topicId: natural-clocks`；TopicBar `Natural Clocks / 自然时钟`。U×Chorus，Specific，Direct，Diagram explainer。核心句：树轮、珊瑚、冰芯、沉积层、洞穴矿物、年层湖泥与脉冲星并非同一种“钟”，它们记录时间的分辨率、连续性和校准方式不同。
- **Style fit**：矩阵不评选冠军，而是公平比较“记录介质 × 时间跨度 × 分辨率 × 校准”；Visual Engine 为比较仪器 + 小型标本；构图 `criteria-axis → specimen-row → temporal-scale → uncertainty-matrix → one-record`。
- **Scene 1（4）**：七件记录介质以完全不同轮廓出现，先给“都记时间，但方法不同”的总冲击。
- **Scene 2（3）**：每件介质只展示一个形成机制动画：长一圈、沉一层、封一个气泡等。
- **Scene 3（2）**：横向时间尺度对齐；使用数量级区间而非虚假精确排序。
- **Scene 4（1）**：校准、缺口、扰动与地域限制进入矩阵，主体开始静止供阅读。
- **Scene 5（1）**：只保留一根记录芯与“时钟首先是材料”的结论。
- **Motion**：主 Data/instrument，辅 Shape morph；curve `4-3-2-1-1`，指针/刻度 250–600ms，Scene 4–5 无 loop。
- **Navigation**：typographic index / `clock taxonomy index` / auto-hide / typographic emphasis；七个介质缩写中五项对应 Scene 群组，当前项字重变化。
- **Transition Score**：`page-turn → grid-reveal → crossfade → dip-to-color`；Material + Structural + Editing 三类，避免矩阵被 3D 打散。
- **资产/研究**：七个原创微型 SVG 标本；目标来源 NOAA/NASA paleoclimate、树轮与洞穴年代学机构、脉冲星计时研究；`pending`。所有跨度和分辨率必须带来源和范围。
- **碰撞/禁用**：旧库最近 `durable-tool`，差异是认识论比较而非工具选型；新批最近“冰芯档案”，本项比较媒介，后者深入同一介质的多信号。禁总分、奖杯、红绿胜负热图。

### 11 — `signal-pipeline-flow` · Second Heat · 总强度 4/5

- **注册信息**：`topicId: district-heat`；TopicBar `Second Heat / 城市余热`。C×Material Transformation，Specific，Direct，Diagram explainer。核心句：数据中心、工业或发电产生的低品位余热，经过换热、升温、储存与网络匹配，才可能成为区域供暖的一次“第二用途”。
- **Style fit**：深色信号管线被改造成热量载体，颜色和脉冲表示温度层级而非数据包。Visual Engine 为 luminous infrastructure network；构图 `waste-source → exchanger → heat-pump → district-loop → seasonal-balance`。
- **Scene 1（2）**：一股原本排向环境的热流停在系统边缘，标明来源温度区间。
- **Scene 2（3）**：换热器把污染/工作流体分开，热量跨膜而物质不混合。
- **Scene 3（3）**：热泵与峰值锅炉进入；仪表同步展示“温度提升需要额外能量”。
- **Scene 4（3）**：建筑支路按需求开启，回水温度改变主环路；管线不是均匀发光。
- **Scene 5（1）**：季节储能与距离损耗成为最后两条边界，网络降到低亮静态。
- **Motion**：主 Path/topology，辅 Data/instrument；curve `2-3-3-3-1`，流动速度受温度/泵状态控制，峰值不超过两层同时运动。
- **Navigation**：path / `heat-pipe loop` / auto-hide / mechanical displacement；五个阀位对应 Scene，当前阀柄转动而不是点发光。
- **Transition Score**：`push-x → grid-reveal → scanline → push-y`；scanline 只在系统调试 Scene 出现一次。
- **资产/研究**：原创 SVG 管网；目标来源 IEA、城市公用事业公司、district heating 技术报告；`pending`。必须选真实案例或明确为综合示意，避免夸大可回收比例。
- **碰撞/禁用**：旧库最近 `event-to-insight`，差异是热力学变换而非信号处理；新批最近“水塔”，一个是热能网络，一个是压力/重力网络。禁数据 pipeline 术语、等距圆节点、全线同速脉冲。

### 12 — `engineering-whiteboard-explainer` · Water Tower · 总强度 4/5

- **注册信息**：`topicId: water-tower`；TopicBar `Water Tower / 城市水塔`。C×Scale，Familiar，Direct，Diagram explainer。核心句：水塔把水提升为重力势能，帮助配水系统稳定压力、覆盖峰值用水并保留短时缓冲。
- **Style fit**：工程白板用手绘剖面逐 Beat 建立高程—压力—流量关系。Emoji 只可作为住宅、消防栓等节点 sticker。Visual Engine 为手绘工程网络；构图 `single-tap → neighborhood-section → tower-cutaway → pressure-zones → full-network`。
- **Scene 1（1）**：一个水龙头与压力箭头，先问“泵停一下，水为什么还在来？”
- **Scene 2（1）**：街区剖面展开，管网高程与用水峰值逐层加入。
- **Scene 3（2）**：水塔内部水位、进出管、溢流与泵连接爆炸图；节点 sticker 只做语义定位。
- **Scene 4（3）**：压力线随水位与地形变化，消防需求触发瞬时流量；图线重排解释因果。
- **Scene 5（4）**：从单塔拉远到分区配水网络，强调“真实系统形式多样，不是每座城市都靠同一种塔”。
- **Motion**：主 Line drawing/growth，辅 Data/instrument；curve `1-1-2-3-4`，马克笔 stroke 300–650ms，Scene 5 网络展开是唯一峰值。
- **Navigation**：spatial node / `water-network node map` / proximity reveal / history trail；touch 以 tap reveal，已读路径留下浅灰笔迹。
- **Transition Score**：`grid-reveal → push-y → focus-swap → split-merge`；转场和白板 stroke 不同时启动。
- **资产/研究**：原创 SVG/DOM 白板图。目标来源 AWWA、EPA/市政供水文档与具体水塔资料；`pending`。不得把简化静水压公式当完整运行模型。
- **碰撞/禁用**：旧库最近 `from-prompt-to-patch`，差异是物理系统推导而非软件过程；新批最近“区域供暖”，差异是势能缓冲与热量转换。禁三栏卡、Emoji confetti、每 Beat 只 fade 一个框。

### 13 — `soft-pastel-friendly` · Inside a Chrysalis · 总强度 3/5

- **注册信息**：`topicId: chrysalis-rebuild`；TopicBar `Inside a Chrysalis / 蛹中重建`。L×Material Transformation，Familiar，Direct，Diagram explainer。核心句：蛹内不是整只幼虫化为液体，而是部分组织拆解、保留与重建共同发生。
- **Style fit**：原创圆润 SVG 角色可以把“拆解/保留/生长”讲清而不制造恐怖感；不是幼儿奖励里程碑。Visual Engine 为 cute custom SVG biology；构图 `character-hero → cocoon-window → three-process-field → body-map → emergence`。
- **Scene 1（2）**：毛毛虫角色整理能量“行李”，随后进入蛹；表情克制，不说话。
- **Scene 2（3）**：蛹体成为半透明观察窗，激素信号用柔和环形标记触发阶段变化。
- **Scene 3（3）**：三类组织以不同形态处理：拆解、保留、imaginal structures 扩展；不画成一锅汤。
- **Scene 4（3）**：翅、复眼、足等结构在身体地图上重组，线条解释来源与方向。
- **Scene 5（1）**：成虫静止展开翅膀，旁注承认物种差异与简化边界。
- **Motion**：主 Character acting，辅 Shape morph；curve `2-3-3-3-1`，柔和 spring 450–700ms，Scene 5 无摆动 loop。
- **Navigation**：ambient / `cocoon pollen marks` / proximity reveal / next-state preview；角落五枚形态不同的微小种子标记预览下一阶段。
- **Transition Score**：`iris-open → split-merge → iris-open → split-merge`；split 表示组织分化，不做卡片重排。
- **资产/研究**：整套角色原创 SVG。目标来源昆虫发育生物学论文、Smithsonian/大学昆虫学资料；`pending`。物种需固定，不能把果蝇知识无条件套到蝴蝶。
- **碰撞/禁用**：旧库最近 `onboarding-that-breathes`，差异是生物组织变形而非用户引导；新批最近“帝王蝶迁徙”，一个讲个体发育，一个讲种群迁徙。禁原生 Emoji、pastel 卡格、进度奖励、彩虹庆祝。

### 14 — `kitchen-prep-station` · Cocoa Fermentation · 总强度 3/5

- **注册信息**：`topicId: cocoa-fermentation`；TopicBar `Cocoa Fermentation / 可可发酵`。M×Path，Familiar，Direct，Diagram explainer。核心句：巧克力风味在烘焙前已由果肉中的微生物接力、温度和酸度变化深刻塑造。
- **Style fit**：备料台直接承载豆荚、发酵箱、翻堆和样豆；Visual Engine 为真实材料过程 + 小型化学标注；构图 `ingredient-stage → microbial-zones → heat-stack → bean-cutaway → aroma-plate`。
- **Scene 1（1）**：打开果荚，湿豆与果肉在砧板上；指出此时还不是“巧克力味”。
- **Scene 2（3）**：酵母、乳酸菌、醋酸菌按氧气条件接力；用台面区域而非角色头像表示。
- **Scene 3（2）**：发酵堆温度、翻堆与气体交换同步变化；仪表只保留三项关键读数。
- **Scene 4（4）**：剖开豆粒，酸、热与细胞死亡促成前体变化；切面是唯一峰值画面。
- **Scene 5（1）**：干燥豆与成品香气轮并置，明确烘焙仍会继续改变风味。
- **Motion**：主 Material operations，辅 Environmental life；curve `1-3-2-4-1`，切、翻、升温、扩散，材料操作先后明确。
- **Navigation**：object controller / `cocoa sample tray` / auto-hide / geometry reflow；五格样豆托盘收起时成为台面物件，展开时重排但不遮挡内容。
- **Transition Score**：`paper-fold → push-y → ink-spread → paper-fold`；paper-fold 模拟包叶/翻堆，ink-spread 只表示扩散。
- **资产/研究**：原创剖面与本地许可可可实物图。目标来源食品微生物论文、ICCO/农业研究机构、发酵研究；`pending`。菌群顺序与风味 claim 必须限定工艺条件。
- **碰撞/禁用**：旧库最近 `raw-notes-clean-brief`，差异是真实发酵而非厨房隐喻；新批最近“漆固化”，一个微生物/热路径，一个湿度驱动聚合。禁食谱步骤卡、库存食物照、厨师帽 icon。

### 15 — `collaborative-pairing-board` · Counterweight · 总强度 3/5

- **注册信息**：`topicId: elevator-counterweight`；TopicBar `Counterweight / 电梯配重`。C×Dual，Familiar，Metaphor，Diagram explainer。核心句：轿厢和配重不是互相“抵消重量”，而是在缆绳、曳引轮和电机之间共同降低不平衡负载。
- **Style fit**：两栏 pairing board 成为真实轿厢/配重两侧，不画人类角色。Visual Engine 为 paired mechanical cable；构图 `paired-columns → cable-loop → load-cases → brake-interface → balanced-system`。
- **Scene 1（4）**：轿厢与配重冷开场反向移动，中间只留曳引轮。
- **Scene 2（1）**：轿厢侧展示乘客/空载变化，配重侧标出设计基准，不宣称精确固定比例。
- **Scene 3（2）**：电机只需处理差值与损耗的概念图，箭头按受力方向进入。
- **Scene 4（2）**：制动、限速与安全钳作为第三条安全链出现，避免把配重误当安全装置。
- **Scene 5（1）**：两侧停在同一水平线，留下“搭档减少工作，不取消工作”。
- **Motion**：主 Object mechanics，辅 Path/topology；curve `4-1-2-2-1`，滑轮运动 350–700ms，Scene 5 quiet。
- **Navigation**：path / `counterweight cable` / proximity reveal / geometry reflow；Scene 切换时导航缆线重新布置，touch tap 唤出。
- **Transition Score**：`split-merge → focus-swap → push-y → split-merge`；方向与两侧真实运动一致。
- **资产/研究**：原创 SVG 绳轮系统；目标来源 ASME、电梯工程资料、制造商安全技术文档；`pending`。不展示可被误用的维修指导。
- **碰撞/禁用**：旧库最近 `two-teams-one-artifact`，差异是真实机械互补而非团队协作；新批最近“钢筋混凝土”，同为双力，但一个是移动平衡，一个是复合材料受力。禁 org chart、人头像、握手、假 50/50 数字。

### 16 — `studio-mixing-console` · Tidal Time · 总强度 3/5

- **注册信息**：`topicId: tidal-time`；TopicBar `Tidal Time / 潮汐时差`。U×Dual，Specific，Metaphor，Diagram explainer。核心句：潮汐摩擦把地球自转角动量转移给月球轨道，使地球自转缓慢减速、月球缓慢远离。
- **Style fit**：混音台把两个耦合量做成可见推子与相位，而不是把科学变成音频装饰。Visual Engine 为 physical instrument + orbital diagram；构图 `two-faders → tidal-bulge → torque-meter → transfer-console → laser-ranging`。
- **Scene 1（4）**：EARTH SPIN 推子下降、MOON ORBIT 推子上升的冷开场，立即标注“比例极度夸张”。
- **Scene 2（1）**：月球引力产生潮汐隆起，仪表归零后逐项加入海洋/地形摩擦。
- **Scene 3（2）**：地球自转把潮峰带到地月连线前方，扭矩方向通过相位表解释。
- **Scene 4（2）**：角动量 transfer meter 从地球轨道送往月球轨道；能量损耗与角动量转移分开显示。
- **Scene 5（1）**：激光测距反射器作为证据落位，并提示当前速率不可线性外推深时。
- **Motion**：主 Data/instrument，辅 Object mechanics；curve `4-1-2-2-1`，推子/相位 250–500ms，读数稳定后无持续抖动。
- **Navigation**：object controller / `tidal fader bank` / proximity reveal / material-color change；当前 Scene 的推子帽换色，普通 click/tap/keyboard 均可操作。
- **Transition Score**：`push-y → push-x → afterimage → focus-swap`；afterimage 只在角动量转移时表现过去位置。
- **资产/研究**：原创仪器与轨道 SVG；目标来源 NASA/JPL Apollo laser ranging、ILRS、潮汐动力学研究；`pending`。
- **碰撞/禁用**：旧库最近 `tuning-operating-model`，差异是物理耦合而非组织调参；新批最近“自由潜水”，同为 dual-force，但一个是天体角动量，一个是生理约束。禁装饰波形、全控件乱跳、把月球“推走”的单力箭头。

### 17 — `debug-reaction-board` · Acoustic Crack · 总强度 3/5

- **注册信息**：`topicId: acoustic-crack`；TopicBar `Acoustic Crack / 听裂缝`。C×Evidence，Specific，Direct，Diagram explainer。核心句：受力材料中的微裂纹会释放瞬态弹性波，传感器阵列可用到时、频率和事件聚类定位损伤，但噪声与解释边界同样重要。
- **Style fit**：诊断面板天然适合信号、假设、定位与置信度；Visual Engine 为 oscilloscope + structural map；构图 `quiet-structure → pulse-trace → sensor-array → triangulation → confidence-board`。
- **Scene 1（2）**：完整桥构件与静默基线，红色警报保持关闭。
- **Scene 2（4）**：一个微裂事件触发短脉冲，波形与构件位置同步闪现一次。
- **Scene 3（1）**：传感器 A/B/C 的到时差静态排列，先解释“事件”不是连续声音。
- **Scene 4（3）**：三角定位与事件簇叠加；噪声候选被标记而不是删除。
- **Scene 5（1）**：结论面板只写“哪里值得进一步检查”，不宣称自动判定裂缝严重度。
- **Motion**：主 Data/instrument，辅 Document/evidence；curve `2-4-1-3-1`，脉冲 80–180ms、定位 400ms，禁止循环报警。
- **Navigation**：edge scale / `acoustic trace ruler` / proximity reveal / mechanical displacement；边缘游标移动到当前 Scene 波形位置。
- **Transition Score**：`scanline → focus-swap → dip-to-color → scanline`；scanline 是传感器读取，不是复古滤镜。
- **资产/研究**：原创传感器/结构 SVG。目标来源 FHWA/NIST、结构健康监测研究、声发射标准；`pending`。所有“裂缝类型对应波形”需谨慎限定。
- **碰撞/禁用**：旧库最近 `incident-learns`，差异是材料诊断证据而非软件事故复盘；新批最近“无损颜料”，两者都无损，但一个监听弹性波，一个分析光谱。禁 kanban、错误堆栈、常亮红灯、伪确定诊断。

### 18 — `front-page-broadsheet` · Rogue Wave · 总强度 1/5

- **注册信息**：`topicId: rogue-wave`；TopicBar `Rogue Wave / 怪浪`。E×Cutaway，Specific，Direct，Editorial reading。核心句：怪浪不是普通大浪的新闻别名；它由海况背景、波群叠加和观测定义共同界定，形成机制可能不止一种。
- **Style fit**：头版适合把一次异常观测拆成“事件、剖面、解释、边界”的证据档案。Visual Engine 为 newspaper evidence + wave diagram；构图 `front-page → incident-column → cutaway-spread → mechanism-sidebar → correction-box`。
- **Scene 1（1）**：头版只放事件时间线、海况图与一个主标题；不使用灾难照片充当证据。
- **Scene 2（2）**：观测仪器与基准波高定义在两栏内静态落位，读者先知道“如何被测到”。
- **Scene 3（4）**：中央跨栏剖面逐步叠加波群、能量聚焦与流场影响；1/5 ceiling 下只做细线绘制和局部高亮。
- **Scene 4（2）**：并列不同机制及其适用条件，不给单一万能解释。
- **Scene 5（1）**：以“已知 / 尚未统一”更正版收束；正文完全静止。
- **Motion**：主 Document/evidence，辅 Line drawing/growth；curve `1-2-4-2-1` 表示揭示密度，正文出现后无移动、缩放、模糊或 loop。
- **Navigation**：card/miniature / `wavefront clipping deck` / persistent / geometry reflow；五张报纸剪页沿书口排列，当前页进入阅读面。
- **Transition Score**：`page-turn → hard-cut → crossfade → page-turn`；Editing + Material 两类。
- **资产/研究**：自绘海况/波群图，实物观测图需本地化。目标来源 NOAA、海洋研究机构、同行评议怪浪研究；`pending`。
- **碰撞/禁用**：旧库最近 `morning-after-launch`，差异是海洋证据档案，不是发布后新闻；新批最近“桥梁裂缝”，同为异常检测，但观测对象和证据链完全不同。禁 dashboard tiles、灾难图库、持续波浪背景、把“叠加”写成唯一成因。

### 19 — `magazine-masthead` · Moth Experiment · 总强度 2/5

- **注册信息**：`topicId: moth-experiment`；TopicBar `Moth Experiment / 桦尺蛾实验`。L×Evidence，Specific，Direct，Editorial reading。核心句：桦尺蛾案例的价值不在一张树干照片，而在多轮野外实验如何检验捕食、背景匹配与频率变化，并暴露早期方法争议。
- **Style fit**：巨型 masthead 文字负责提出争议，标本、照片与方法边注作为证据层重开实验。Primary Visual Engine 为 type-as-image，secondary 为 specimen evidence；构图 `cover-specimen → method-spread → photo-evidence → critique-margin → revised-cover`。
- **Scene 1（2）**：一只浅色、一只深色标本成为封面人物；标题是“THE EXPERIMENT, REOPENED”，不把演化简化为一张前后图。
- **Scene 2（4）**：实验设计、释放位置、观察方式与假设分栏出现；仅一个版面元素移动。
- **Scene 3（1）**：关键观测图/表完全静态，图注与来源优先于装饰。
- **Scene 4（3）**：早期批评与后续改进用边注对齐，证据权重而非“打脸”动画。
- **Scene 5（1）**：封面缩成一张标本标签，写清该案例证明什么、不证明什么。
- **Motion**：主 Environmental life，辅 Document/evidence；curve `2-4-1-3-1`，正文落位后零持续运动；生命动效仅在标本/背景匹配的短暂比较中发生。
- **Navigation**：card/miniature / `moth specimen cards` / auto-hide / material-color change；当前标本卡的纸色/针脚色变化，click/tap 永久可达。
- **Transition Score**：`iris-open → crossfade → focus-swap → iris-open`；Mask + Camera + Editing，像相机/显微镜换景。
- **资产/研究**：优先公共博物馆标本/开放许可实验资料。目标来源同行评议原始与复现实验、自然史博物馆、演化生物学综述；`pending`。
- **碰撞/禁用**：旧库最近 `product-gets-cover`，差异是实验复核而非封面包装；新批最近“小行星撞击证据”，一个依赖野外生物实验，一个依赖地质多证据。禁每 Scene 一张封面、Ken Burns、英雄/反派科学家叙事。

### 20 — `warm-editorial-feature` · Oral to Written · 总强度 2/5

- **注册信息**：`topicId: oral-to-written`；TopicBar `Oral to Written / 史诗成文`。H×Material Transformation，Specific，Direct，Editorial reading。核心句：口述史诗被录音、转写、编辑和出版时，表演中的变体、节奏、听众互动与权威关系会被重新配置，不是简单“保存到纸上”。
- **Style fit**：温暖专题特稿允许讲述一次具体的记录/出版个案，同时把口述者、记录者与编辑位置写清。Visual Engine 为 long-form editorial + waveform marginalia；构图 `performance-opener → transcript-column → editorial-layer → parallel-versions → listening-close`。
- **Scene 1（2）**：具体表演场景作为 feature opener；人名、地点、日期必须来自 facts packet。
- **Scene 2（3）**：一小段音频节奏与转写并排，展示停顿、重复和语气如何进入/离开文本。
- **Scene 3（3）**：编辑标记、拼写标准化、段落与注释像透明层依次覆盖原转写。
- **Scene 4（3）**：两个表演版本与一个出版版本并读，差异不被判为“错误”。
- **Scene 5（1）**：回到声音与表演者署名；纸页合上但音频来源保持可追溯。
- **Motion**：主 Type choreography，辅 Document/evidence；curve `2-3-3-3-1`，页内仅焦点移动；阅读阶段完全静止。
- **Navigation**：typographic index / `oral-written chapter labels` / proximity reveal / active glow；章节词在页边出现，touch 以 tap 展开。
- **Transition Score**：`linear-wipe → page-turn → hard-cut → page-turn`；Mask + Material + Editing 三类。
- **资产/研究**：制作时锁定一个有社区/档案许可的具体史诗记录个案。目标来源原始录音/手稿、相关文化机构、口述文学研究；`pending`。
- **碰撞/禁用**：旧库最近 `useful-week-notes`，差异是媒介转化与权威问题，不是人物随笔；新批最近“字母 A”，一个讲表演变文本，一个讲字形谱系。禁虚构表演者、无语境民族风、把“书面”写成必然进步。

### 21 — `scholars-vellum` · Hidden Text · 总强度 1/5

- **注册信息**：`topicId: hidden-text`；TopicBar `Hidden Text / 重写羊皮卷`。H×Cutaway，Specific，Direct，Editorial reading。核心个案锁定 Archimedes Palimpsest：被擦除并覆写的底层文本，靠保护修复、多光谱成像与 XRF 等不同方法逐层显现。
- **Style fit**：羊皮卷与边注不是装饰，而是原对象和研究过程。Visual Engine 为 manuscript layers + multispectral evidence；构图 `folio → layer-section → spectral-grid → glyph-reconstruction → source-note`。
- **Scene 1（1）**：完整 folio 与上层祈祷文，底文只留下几乎不可见的方向线索。
- **Scene 2（2）**：材料剖面区分羊皮、底层墨、擦洗/刮除、上层墨和后期伪画。
- **Scene 3（4）**：多波段图像按同一坐标切换，1/5 ceiling 下使用瞬时焦点，不做彩虹扫描 loop。
- **Scene 4（2）**：算法分离/XRF 结果与人工释读并排，明确“显现图像”与“解释文字”不是同一步。
- **Scene 5（1）**：一个恢复字形、一条出处、一个未解决区静止收束。
- **Motion**：主 Document/evidence，辅 Camera/light；curve `1-2-4-2-1`，阅读安全优先，正文稳定后无动效。
- **Navigation**：edge scale / `palimpsest folio tabs` / click-expand / geometry reflow；书口 tabs 展开成五层索引，普通键盘焦点明确。
- **Transition Score**：`hard-cut → page-turn → crossfade → hard-cut`；Editing + Material 两类。
- **资产/研究**：目标来源 Archimedes Palimpsest Project、Walters Art Museum、SLAC 技术资料；`pending`。具体图像逐张核对开放许可与 attribution。
- **碰撞/禁用**：旧库最近 `argument-in-margins`，差异是成像取证而非思想辩论；新批最近“罗塞塔石碑”，一个恢复不可见底文，一个用平行文本解码语言。禁伪拉丁文、魔法显影、无法追溯的 parchment texture。

### 22 — `solar-biennale-poster` · Iron from Stars · 总强度 3/5

- **注册信息**：`topicId: iron-from-stars`；TopicBar `Iron from Stars / 恒星炼铁`。U×Material Transformation，Familiar，Metaphor，Stage impact。核心句：大质量恒星在更高温度下逐层进行核反应，能量有利的聚变链在铁峰附近触到边界；更重元素有其他形成通道。
- **Style fit**：太阳般的巨大圆盘与一条庄严元素序列承担“层层烧制”的视觉诗性；不能把 fusion 画成普通火焰。Visual Engine 为 cosmic geometric poster；构图 `solar-disc → element-ring → onion-shell → iron-core → multiple-sites`。
- **Scene 1（2）**：一枚巨大氢符号与太阳圆盘，文字极少。
- **Scene 2（3）**：氦、碳、氧等关键阶段按温度环逐层生长，不把完整元素周期表一次抛出。
- **Scene 3（3）**：大质量恒星“洋葱壳层”剖面成为主视觉，元素环以缓慢呼吸区分。
- **Scene 4（3）**：铁核在画面中央变为不再提供同类能量收益的暗块，运动突然减弱。
- **Scene 5（1）**：超新星、恒星风、中子星并合等多来源以远处小圆并列，明确“不是所有重元素都来自同一事件”。
- **Motion**：主 Shape morph，辅 Camera/light；curve `2-3-3-3-1`，700–1100ms solar bloom，Scene 5 quiet。
- **Navigation**：ambient / `solar orbit points` / click-expand / mechanical displacement；点击轨道点时其绕行角度改变并展开标签。
- **Transition Score**：`iris-open → zoom-through → dip-to-color → iris-open`；Mask + Camera + Editing 三类。
- **资产/研究**：原创 SVG 周期/壳层图；目标来源 NASA、DOE Office of Science、核天体物理综述；`pending`。facts packet 必须区分 fusion、s/r-process 与仍不确定的来源占比。
- **碰撞/禁用**：旧库最近 `public-light`，差异是核合成解释而非文化展览；新批最近“太阳前尘”，一个讲元素生成，一个讲保存下来的微粒证据。禁全屏粒子爆炸、彩虹周期表、所有重元素归因超新星。

### 23 — `duotone-session` · Dance Notation · 总强度 4/5

- **注册信息**：`topicId: dance-notation`；TopicBar `Dance Notation / 舞谱`。S×Material Transformation，Specific，Direct，Stage impact。核心句：舞谱把三维、连续、带力度的身体动作压缩成平面符号；重演时，符号又必须通过训练者的解释回到身体。
- **Style fit**：巨型 condensed take 编号、duotone 影像与 LP 节拍让“纸上符号 / 身体姿态”成为两条 take。具体系统锁定 Labanotation，不把不同舞谱混成一套。Primary Visual Engine 为 type-as-image，secondary 为 silhouette + notation score；构图 `pose-photo → symbol-key → split-score → reconstruction-stage → double-exposure`。
- **Scene 1（2）**：舞者单一姿态与一列陌生符号并置，标题像 session sleeve。
- **Scene 2（3）**：方向、高度、身体部位和时值逐项进入 legend，每个 Beat 只解释一个维度。
- **Scene 3（3）**：一小段动作与谱面同步滚动，身体运动和纸面游标保持一一对应。
- **Scene 4（3）**：两位重建者对同一谱段的解释差异以姿态叠印表现，证据边界可见。
- **Scene 5（1）**：动作与谱面双曝光静止，结论是“记谱保存结构，不保存全部表演”。
- **Motion**：主 Line drawing/growth，辅 Camera/light；curve `2-3-3-3-1`，动作以 12fps 风格抽帧，谱线 300ms 绘制。
- **Navigation**：object controller / `notation turntable` / click-expand / typographic emphasis；五段谱记在圆盘刻度上，当前 take 的编号增重。
- **Transition Score**：`focus-swap → afterimage → push-x → afterimage`；Camera + Signal + Spatial 三类。
- **资产/研究**：原创姿态剪影；目标来源 Dance Notation Bureau、NYPL 舞蹈档案、Labanotation 权威教材；`pending`。真实舞者影像须明确许可。
- **碰撞/禁用**：旧库最近 `five-takes-room`，差异是记谱与重建，不是录音 session；新批最近“古代音乐重建”，一个从舞谱到动作，一个从文物/空间到声音。禁播放器 UI、唱片装饰、无证据姿态 montage。

### 24 — `riso-print-zine` · Seven Blues · 总强度 5/5

- **注册信息**：`topicId: seven-blues`；TopicBar `Seven Blues / 七种蓝`。M×Chorus，Specific，Direct，Visual narrative。核心句：群青、蓝铜矿、埃及蓝、靛蓝、钴蓝、普鲁士蓝与结构蓝看似同色，却依靠完全不同的材料和光学机制。
- **Style fit**：Riso 的有限色、错版与油墨叠印可把“屏幕上的同一个蓝”拆成七种材料过程。Visual Engine 为 pigment/material print；构图 `blue-field → mineral-pairs → plant-vat → synthetic-lab → swatch-wall`。
- **Scene 1（4）**：一整面蓝被七个不同网点切口撕开，先感受“蓝不是一种材料”。
- **Scene 2（3）**：群青/蓝铜矿的颗粒剖面通过粗网点和研磨动作进入。
- **Scene 3（2）**：靛蓝发酵/还原—氧化过程用两层墨色翻转，不做化学魔法。
- **Scene 4（1）**：埃及蓝、钴蓝、普鲁士蓝与结构色按机制并置，版面对齐供比较。
- **Scene 5（1）**：七张实体感 swatch 变成一本折页，标出屏幕无法忠实还原实物色。
- **Motion**：主 Stroke drawing，辅 Material operations；curve `4-3-2-1-1`，网点刮印、套印错位、压合 160–500ms；Scene 5 完全静止。
- **Navigation**：card/miniature / `blue pigment swatches` / proximity reveal / typographic emphasis；当前 swatch 名称增重，touch tap 展开。
- **Transition Score**：`multi-blind → ink-spread → afterimage → multi-blind`；Mask + Material + Signal 三类，afterimage 模拟套印残差。
- **资产/研究**：七种原创纹理/机制图；目标来源 Smithsonian/博物馆颜料档案、Getty Conservation、材料科学研究；`pending`。实物色、毒性和文化物件语境分别核验。
- **碰撞/禁用**：旧库最近 `community-prints-itself`，差异是材料比较而非社区叙事；新批最近“无损颜料”，本项讲蓝色生成路径，后者讲识别方法。禁环保 icon、干净矢量、七张同构卡、声称屏幕颜色等于实物。

### 25 — `analog-cutout-collage` · Inside the Wall · 总强度 3/5

- **注册信息**：`topicId: concealed-objects`；TopicBar `Inside the Wall / 墙中藏物`。H×Chorus，Wildcard，Direct，Visual narrative。核心句：鞋、瓶、动物遗存、符号刻痕等物件曾被有意藏入建筑；考古语境常提示保护/仪式用途，但具体意图不能被现代人确定代言。
- **Style fit**：剪贴碎片模拟“从墙层、地板和烟囱中取出的分散证据”，不是用复古图制造神秘。Visual Engine 为 archival object collage；构图 `sealed-wall → object-fragments → location-plan → evidence-clusters → conservation-tray`。
- **Scene 1（4）**：墙纸被剪开一个不规则孔，露出单件有馆藏记录的物件。
- **Scene 2（3）**：三类物件以真实发现位置标签进入，不配虚构主人故事。
- **Scene 3（2）**：建筑平面与隐藏位置通过缝线关联，展示烟囱、门槛、墙腔等模式。
- **Scene 4（1）**：解释层分为“发现事实 / 研究推断 / 民俗类比”，透明纸重叠但不混色。
- **Scene 5（1）**：所有物件回到保护托盘，留下“concealed does not mean understood”。
- **Motion**：主 Material operations，辅 Document/evidence；curve `4-3-2-1-1`，剪、揭、贴、缝，纸张 220–650ms，不用光滑 UI easing。
- **Navigation**：card/miniature / `wall-cache fragments` / click-expand / active glow；碎片边缘只在当前项产生微弱背光。
- **Transition Score**：`paper-fold → card-carousel → push-x → paper-fold`；Material + Structural + Spatial 三类。
- **资产/研究**：必须先锁定 5–7 件有官方馆藏/发掘记录的物件。目标来源 Historic England、MOLA/地方博物馆、考古论文；`pending`。文化/宗教解释遵循 public museum standard。
- **碰撞/禁用**：旧库最近 `archive-reassembled`，差异是考古语境与推断边界，不是抽象拼贴；新批最近“重写羊皮卷”，一个从建筑层取物，一个从文献层取字。禁虚构鬼故事、Pinterest 图、神秘符号乱贴、均匀卡阵。

### 26 — `woodblock-floating-world` · Whistled Language · 总强度 1/5

- **注册信息**：`topicId: whistled-language`；TopicBar `Whistled Language / 口哨语言`。S×Chorus，Wildcard，Metaphor，Visual narrative。核心句：Silbo Gomero、Kuş dili 与 Mazatec whistled speech 都把口语信息压缩到口哨声，但语言结构、使用场景与社区传承各不相同。
- **Style fit**：木版的平面山谷与空气线适合表现远距离声学路径；只借版画材料物理，不把三地人物画成日本服饰。Visual Engine 为 woodblock landscape + sound lines；构图 `mountain-silence → canary-valley → black-sea-valley → mazatec-field → three-waveforms`。
- **Scene 1（4）**：两座山之间一条极细声线，人物只是远处尺度点。
- **Scene 2（3）**：Silbo Gomero：语言压缩维度与地形/教育传承，用社区认可资料描述。
- **Scene 3（2）**：Kuş dili：连续山谷与分散聚落，不复制前 Scene 的人物构图。
- **Scene 4（1）**：Mazatec 案例突出声调语言与具体使用语境；不泛化整个族群。
- **Scene 5（1）**：三条频率/中断图样并置，结论强调“不是一门全球通用口哨语”。
- **Motion**：主 Environmental life，辅 Line drawing/growth；curve `4-3-2-1-1` 在 1/5 ceiling 下仅做声线 stroke 与雾层微移，主体近静态。
- **Navigation**：spatial node / `mountain peak array` / click-expand / next-state preview；五座山峰代表 Scene，点击后峰后出现下一场轮廓。
- **Transition Score**：`ink-spread → crossfade → diagonal-pan → ink-spread`；Material + Editing + Spatial，pan 幅度受 1/5 ceiling 限制。
- **资产/研究**：原创木版 SVG；目标来源 UNESCO Silbo/Kuş dili 档案、社区文化机构、Mazatec 语言学研究；`pending`。音频须授权，不以 AI 合成冒充真实语言。
- **碰撞/禁用**：旧库最近 `tide-map`，差异是声学语言跨地形，不是团队旅程；新批最近“tea/cha”，一个比较三种口哨编码，一个追踪词形传播。禁 Great Wave 贴纸、假汉字/假日文、文化混装、泛化距离数字。

### 27 — `botanical-specimen-plate` · Leaf Stomata · 总强度 2/5

- **注册信息**：`topicId: leaf-stomata`；TopicBar `Leaf Stomata / 叶片气孔`。L×Cutaway，Familiar，Direct，Editorial reading。核心句：气孔让二氧化碳进入叶片，也让水蒸气离开；保卫细胞不断在碳收益与失水风险之间调节开度。
- **Style fit**：科学标本板可把整叶、表皮、气孔与细胞机制在同一图版上逐级放大。Visual Engine 为 scientific botanical illustration；构图 `whole-leaf → epidermis-window → stomata-cutaway → gas-water-split → specimen-label`。
- **Scene 1（1）**：完整叶片与标本编号，气孔位置只用一处放大框提示。
- **Scene 2（2）**：表皮视图切入，保卫细胞与孔隙按真实形态描线。
- **Scene 3（4）**：CO₂ 进入、水蒸气离开的相反箭头与开度变化一起出现；总强度 2 只做线长变化。
- **Scene 4（2）**：光、水分、CO₂ 等因素作为调节条件边注，不做一一确定开关。
- **Scene 5（1）**：回到整叶与“每次开口都是一次交换”，图版完全静止。
- **Motion**：主 Line drawing/growth，辅 Environmental life；curve `1-2-4-2-1`，细线 350–700ms；正文落位后无 loop。
- **Navigation**：ambient / `specimen registration marks` / drag-scrub / geometry reflow；拖动只用于放大框在五个标本位置间移动，click/tap/keyboard 始终可替代。
- **Transition Score**：`iris-open → crossfade → hard-cut → focus-swap`；Mask + Editing + Camera 三类，阅读安全。
- **资产/研究**：原创植物科学绘图；目标来源植物生理学教材、USDA/大学植物研究、同行评议气孔研究；`pending`。
- **碰撞/禁用**：旧库最近 `growth-signals`，差异是具体气体交换机制，不是增长分类；新批最近“从空气到听觉”，同为尺度图解但器官、物理与视觉语法不同。禁装饰花卉、漂浮气泡、卡片 taxonomy、单因素开关论。

### 28 — `machine-age-deco` · Reinforced Concrete · 总强度 4/5

- **注册信息**：`topicId: reinforced-concrete`；TopicBar `Reinforced Concrete / 钢筋混凝土`。M×Dual，Familiar，Direct，Stage impact。核心句：混凝土擅长承受压缩，钢筋跨越拉裂区承担拉力；二者靠黏结、相近热变形与构造细节形成一个复合构件。
- **Style fit**：Deco 的阶梯、拱券和金属线直接成为受压几何与受拉骨架。Visual Engine 为 geometric force + structural object；构图 `monolith → compression-field → rebar-skeleton → bending-beam → deco-arch`。
- **Scene 1（4）**：一根无钢筋梁在荷载下出现张力裂缝，红线只出现一次。
- **Scene 2（1）**：混凝土柱/拱以金色向内箭头表现压缩优势，构图庄重近静态。
- **Scene 3（2）**：钢筋骨架从黑场升起，拉力沿连续线传递；不画成“钢筋撑住一切”。
- **Scene 4（2）**：受弯梁剖面把受压区、受拉区、中性轴与裂缝控制放入同一画面。
- **Scene 5（1）**：结构回到完整建筑局部，留下“复合不是相加，而是分工与黏结”。
- **Motion**：主 Object mechanics，辅 Line drawing/growth；curve `4-1-2-2-1`，轴压 250ms、钢筋线 500ms、裂缝只触发一次。
- **Navigation**：edge scale / `load ruler` / drag-scrub / material-color change；边缘荷载刻度可 scrub，当前 Scene 从黄铜转为混凝土灰；click/tap/keyboard 有等价路径。
- **Transition Score**：`split-merge → dolly-pull → grid-reveal → focus-swap`；Structural + Camera 两类。
- **资产/研究**：原创 SVG 受力图；目标来源 NIST、ASCE/结构工程教材、钢筋混凝土设计资料；`pending`。不提供施工配筋建议，示意图必须标 not to scale。
- **碰撞/禁用**：旧库最近 `infrastructure-gala`，差异是复合材料力学，不是机器时代愿景；新批最近“夹层玻璃”，两者都复合，但一个分担拉压，一个用中间层保持碎片。禁摩天楼 stock、装饰齿轮、粒子爆炸、把 fusion/force 画成火焰。

### 29 — `expedition-screenprint` · Saharan Dust · 总强度 3/5

- **注册信息**：`topicId: saharan-dust`；TopicBar `Saharan Dust / 撒哈拉尘`。E×Path，Familiar，Direct，Stage impact。核心句：来自撒哈拉特定源区的尘埃能进入高空、跨越大西洋并沉降到亚马孙；卫星和采样显示这条路存在，但年际输送量并不固定。
- **Style fit**：探险地图、坐标戳与屏印层适合一条大尺度空气路径。Visual Engine 为 stamped map + satellite section；构图 `source-stamp → vertical-section → ocean-map → deposition-field → seasonal-map`。
- **Scene 1（1）**：博德莱洼地等源区以单个坐标戳出现，沙面纹理不运动。
- **Scene 2（3）**：尘埃被抬升到空气层带，纵剖面与风场分开绘制。
- **Scene 3（2）**：CALIPSO 类激光雷达剖面与平面路线并列，明确真实观测和图解层。
- **Scene 4（4）**：尘层跨海抵达并沉降，路径在亚马孙土壤/营养收支处汇合；唯一峰值。
- **Scene 5（1）**：不同年份路线粗细并列，结论改为“跨海补给的一部分”，不讲固定年吨数。
- **Motion**：主 Path/topology，辅 Environmental life；curve `1-3-2-4-1`，屏印横漂与颗粒沉降 350–800ms，无持续风沙 loop。
- **Navigation**：path / `dust arc` / click-expand / material-color change；路线展开时墨色从赭石变为亚马孙绿，但不把绿色等于“好”。
- **Transition Score**：`diagonal-pan → ink-spread → push-x → ink-spread`；Spatial + Material 两类。
- **资产/研究**：原创地图，卫星图需 NASA 开放资产并本地化。目标来源 NASA CALIPSO/Earth Observatory、同行评议大气输送论文；`pending`。
- **碰撞/禁用**：旧库最近 `field-route`，差异是可观测气溶胶运输而非抽象探索；新批最近“tea/cha”，同为跨洲路径，但介质、证据和地理结构不同。禁装饰指南针、透视地球、固定输送数字、把沙漠画成单一文化符号。

### 30 — `cassette-era-packaging` · Ice-Core Archive · 总强度 3/5

- **注册信息**：`topicId: ice-core-archive`；TopicBar `Ice-Core Archive / 冰芯档案`。E×Chorus，Wildcard，Productive Contrast，Visual narrative。核心句：同一根冰芯可保存气泡、稳定同位素、灰尘、火山灰、盐与化学物等不同信号；它更像多轨档案，不是一支单读数温度计。
- **反差价值**：磁带多轨语言让同时共存、采样分辨率不同的 proxy 可见；反差服务于“同一介质，多种录音”，不是怀旧包装。Visual Engine 为 tape/archive instrument；构图 `ice-cylinder → tape-reel → multitrack-spectra → event-marker → archive-case`。
- **Scene 1（4）**：冰芯柱像透明 cassette 被装入 deck，五条轨仍为空。
- **Scene 2（3）**：气泡、同位素、尘埃各自进入一轨，说明它们记录的物理量不同。
- **Scene 3（2）**：Signature：光谱“播放头”沿冰芯移动，三轨对齐但保持不同分辨率；reduced motion 直接显示三轨并列。
- **Scene 4（1）**：火山灰/盐等事件标记与年代模型对齐，缺口和不确定性可见。
- **Scene 5（1）**：磁带盒关闭，标签写“archive, not a single thermometer”。
- **Motion**：主 Data/instrument，辅 Material operations；curve `4-3-2-1-1`，走带 300–600ms 后停止，严禁无限旋转磁带。
- **Navigation**：object controller / `ice-core tape reels` / drag-scrub / active glow；scrub 只预览五个固定 Scene，普通按钮/键盘绝对跳转可用。
- **Transition Score**：`scanline → push-y → afterimage → hard-cut`；Signal + Spatial + Editing。Signature 是 modifier，基础 fallback 始终存在。
- **资产/研究**：原创冰芯/磁带 SVG，数据图按真实来源重绘。目标来源 NOAA/NASA paleoclimate、冰芯项目和同行评议资料；`pending`。每条 proxy 的意义和限制单独核验。
- **碰撞/禁用**：旧库最近 `release-mixtape`，差异是多 proxy 科学档案，不是发行主题；新批最近“自然时钟”，一个深挖冰芯，多者横向比较记录介质。禁播放器 controls、复古 catalog 换皮、伪声谱、把 proxy 当直接温度。

### 31 — `neo-brutalist-bulletin` · Sinking Delta · 总强度 3/5

- **注册信息**：`topicId: sinking-delta`；TopicBar `Sinking Delta / 下沉三角洲`。E×Dual，Specific，Metaphor，Visual narrative。核心句：河流仍能输送泥沙造陆，但压实、沉降、海平面变化与堤坝削弱漫滩补沙等力量，会让部分三角洲失地。
- **Style fit**：粗野主义黑块与硬阴影成为土地增减的真实面积，不是政治口号。具体案例锁定 Mississippi Delta，所有数字带时间/区域。Visual Engine 为 blocky cartography；构图 `land-block → sediment-wedge → subsidence-cut → levee-split → restoration-mosaic`。
- **Scene 1（4）**：大片陆地图块被水域负空间切掉，标题“THE DELTA IS LOSING GROUND”。
- **Scene 2（1）**：泥沙三角楔沿河口增加，说明造陆力仍存在。
- **Scene 3（2）**：地层压实/沉降通过剖面黑块下移，海平面基线保持独立。
- **Scene 4（2）**：堤坝、渠道与湿地补沙关系重排；不把单一工程当唯一因果。
- **Scene 5（1）**：修复分流方案与限制并置为动态镶嵌，画面降到静态。
- **Motion**：主 Shape morph，辅 Path/topology；curve `4-1-2-2-1`，块状 snap 180–350ms、地图重排 600ms。
- **Navigation**：spatial node / `delta distributary blocks` / drag-scrub / mechanical displacement；拖动分汊块预览 Scene，click/tap/keyboard fallback 完整。
- **Transition Score**：`hard-cut → grid-reveal → diagonal-pan → hard-cut`；Editing + Structural + Spatial 三类。
- **资产/研究**：原创地图，真实岸线数据需明确年份。目标来源 USGS、Louisiana CPRA、湿地/沉降研究；`pending`。
- **碰撞/禁用**：旧库最近 `shipping-hard-thing`，差异是地貌收支，不是硬问题宣言；新批最近“区域供暖”，一个土地质量收支，一个热量网络。禁等宽卡、绿色=好/红色=坏的单轴编码、单一下沉率。

### 32 — `red-wedge-agitprop` · Pneumatic Post · 总强度 5/5

- **注册信息**：`topicId: pneumatic-post`；TopicBar `Pneumatic Post / 气动邮政`。C×Path，Wildcard，Productive Contrast，Stage impact。核心句：在电话与数字网络之前，一些城市用压差推动胶囊穿过地下管道，把书面消息压缩成一条高速物理路线。
- **反差价值**：constructivist 对角线天然像加压管路；把原本政治动员的“速度与方向”转用于基础设施史，强调通信曾是有摩擦、有站点的物理运输。
- **Visual Engine**：geometric force + pneumatic capsule；构图 `capsule-hero → pressure-section → tube-map → switching-station → delivered-note`。
- **Scene 1（1）**：一枚胶囊占据红色楔形入口，标题只写 “MAIL / UNDER / PRESSURE”。
- **Scene 2（3）**：活塞/风机、压差与胶囊密封剖面分三 Beat 建立。
- **Scene 3（2）**：具体城市/年代的管网地图沿对角线展开，站点不画成现代地铁。
- **Scene 4（4）**：Signature：胶囊沿管道压缩冲出并在换向站回弹一次；reduced motion 为路径与终点瞬时强调。
- **Scene 5（1）**：真实格式的短笺从胶囊中展开，补充容量、堵塞与被替代的边界。
- **Motion**：主 Object mechanics，辅 Type choreography；curve `1-3-2-4-1`，100–300ms 强硬冲刺 + 700ms 机械 settle。
- **Navigation**：path / `pneumatic tube` / drag-scrub / typographic emphasis；拖动胶囊预览 Scene，当前站名增重，保留 keyboard/tap。
- **Transition Score**：`diagonal-pan → split-merge → dip-to-color → diagonal-pan`；Spatial + Structural + Editing 三类。
- **资产/研究**：原创管路/胶囊 SVG；目标来源邮政/交通博物馆、城市档案、工程史论文；`pending`。制作前锁定一个可追溯城市网络和公开档案。
- **碰撞/禁用**：旧库最近 `move-org-chart`，差异是实体通信网络，不是组织动员；新批最近“Voyager”，同为路径但一个在城市管道、一个在日球层。禁政治口号、人物动员海报、现代 app 通知、无来源速度纪录。

### 33 — `mechanical-scoring-funnel` · Snowflake Branches · 总强度 3/5

- **注册信息**：`topicId: snowflake-branches`；TopicBar `Snowflake Branches / 雪花分支`。E×Scale，Familiar，Metaphor，Diagram explainer。核心句：雪晶从水分子排列到六重对称，再由温度、湿度和生长历史影响板、柱、枝晶等形态；不是每片都成为完美六角星。
- **Style fit**：机械分类机器用来解释形态条件和分支，而不是给雪花打分。Visual Engine 为 kinetic morphology machine；构图 `molecule-hopper → hex-lattice → condition-gates → branch-growth → imperfect-specimens`。
- **Scene 1（1）**：一个水分子进入冷场，机器仍停机。
- **Scene 2（1）**：六角晶格像齿轮咬合建立，强调分子层面对称来源。
- **Scene 3（2）**：温度/过饱和条件通过两道物理 gate，输出板状、柱状等形态区间。
- **Scene 4（3）**：枝晶从六个方向受同一局部条件共同生长，微小扰动被放大；不生成完美复制臂。
- **Scene 5（4）**：多枚不规则真实形态滑入标本盘，最后一枚完整但不“胜出”。
- **Motion**：主 Shape morph，辅 Object mechanics；curve `1-1-2-3-4`，形态生长 400–900ms，机械落料 180ms。
- **Navigation**：object controller / `crystal morphology dial` / keyboard focus / history trail；焦点旋钮保留已看过的形态刻痕。
- **Transition Score**：`grid-reveal → push-y → afterimage → push-y`；Structural + Spatial + Signal 三类。
- **资产/研究**：原创程序化 SVG 雪晶；目标来源冰晶物理研究、气象机构与权威雪晶形态资料；`pending`。禁止把每枚生成图称为真实观测。
- **碰撞/禁用**：旧库最近 `prioritize-without-debate`，差异是形态生成而非筛选评分；新批最近“冰芯档案”，一个解释晶体生长，一个读取长期积冰记录。禁赢家漏斗、随机弹球、完美复制雪花、儿童竞赛语气。

### 34 — `liquid-glass` · Safety Glass · 总强度 4/5

- **注册信息**：`topicId: safety-glass`；TopicBar `Safety Glass / 夹层玻璃`。M×Cutaway，Familiar，Direct，Stage impact。核心句：夹层安全玻璃破裂时，玻璃层通过中间聚合物层保持附着并分散裂纹；“裂了仍连在一起”是分层设计的结果。
- **Style fit**：透明层、折射与空间深度直接对应真实材料，不套用玻璃卡 UI。Visual Engine 为 glass fracture + laminae；构图 `intact-pane → layer-explode → impact-field → adhesion-closeup → held-fragments`。
- **Scene 1（1）**：一块完整玻璃悬在黑/白极简空间，边缘显示三层截面。
- **Scene 2（2）**：两片玻璃与中间层沿 Z 轴分离，层名直接刻在边缘。
- **Scene 3（4）**：冲击点出现，裂纹传播到层间界面并被保持；唯一高速 Scene。
- **Scene 4（2）**：微观附着与能量耗散用柔性膜变形表示，不做“自动修复”。
- **Scene 5（1）**：碎裂面仍成整体悬挂，文字说明不同安全玻璃类型不可混称。
- **Motion**：主 Material operations，辅 Camera/light；curve `1-2-4-2-1`，玻璃裂纹 120–240ms，分层 700ms，最后完全静止。
- **Navigation**：card/miniature / `glass lamina stack` / drag-scrub / history trail；层片可 scrub 展开，已读层留下细微边缘蚀刻。
- **Transition Score**：`focus-swap → zoom-through → split-merge → focus-swap`；Camera + Structural 两类。
- **资产/研究**：原创 SVG/CSS fracture 与层片；目标来源 NIST/材料标准、汽车/建筑安全玻璃技术资料；`pending`。不得把 tempered 与 laminated 机制混合。
- **碰撞/禁用**：旧库最近 `spatial-product-brief`，差异是材料剖面而非透明 UI；新批最近“玻璃泪滴/钢筋混凝土”不在本批，最近“漆固化”同为材料但物理完全不同。禁 glass dashboard、透明卡海、装饰 blur、慢动作 stock 砸玻璃。

### 35 — `retro-windows` · Voyager Boundary · 总强度 4/5

- **注册信息**：`topicId: voyager-boundary`；TopicBar `Voyager Boundary / 日球层边界`。U×Path，Specific，Productive Contrast，Visual narrative。核心句：Voyager 1/2 沿真实轨迹穿过终止激波、日鞘并进入星际空间；“离开太阳系”取决于采用日球层还是引力边界定义。
- **反差价值**：多窗口桌面可同时显示轨迹、粒子、磁场与等离子体数据，让“边界”从单一线变成多仪器判断；不是复古软件 demo。
- **Visual Engine**：retro telemetry UI + star-map；构图 `boot-window → trajectory-window → plasma-panels → boundary-event → quiet-desktop`。
- **Scene 1（1）**：桌面启动只打开 Voyager 任务时钟和一张极简太阳系窗口。
- **Scene 2（3）**：轨迹窗口沿行星飞掠展开，窗口位置对应空间方向，不平铺任务卡。
- **Scene 3（2）**：粒子/磁场/等离子体窗口出现不同边界信号；缺测仪器状态明确显示。
- **Scene 4（4）**：Signature：CRT 星图越过 heliopause，太阳风底噪消失并切到星际数据；reduced motion 为前后两帧 + 边界高亮。
- **Scene 5（1）**：桌面仅留“interstellar space ≠ beyond the Sun’s gravity”说明和当前任务状态时间戳。
- **Motion**：主 Path/topology，辅 Data/instrument；curve `1-3-2-4-1`，窗口 snap 120ms、轨迹 800ms、CRT 只扫描一次。
- **Navigation**：path / `telemetry trail` / keyboard focus / active glow；五段遥测 breadcrumb 可键盘遍历，当前段荧光增强。
- **Transition Score**：`hard-cut → scanline → glitch → push-x`；Editing + Signal + Spatial。glitch 只表达信号边界，不做系统故障。
- **资产/研究**：原创 UI/轨迹 SVG，NASA 任务图像按许可本地化。目标来源 NASA/JPL Voyager mission、仪器论文与任务状态页；`pending`。
- **碰撞/禁用**：旧库最近 `toolchain-desktop`，差异是科学遥测证据而非开发工具；新批最近“彗星解剖”，一个追踪任务跨边界，一个解释天体结构。禁 generic modal、现代圆角、虚构命令、把 heliopause 叫太阳引力终点。

### 36 — `mid-century-grove` · Monarch Migration · 总强度 2/5

- **注册信息**：`topicId: monarch-migration`；TopicBar `Monarch Migration / 帝王蝶迁徙`。L×Path，Familiar，Direct，Visual narrative。核心句：帝王蝶全年迁徙由多代个体接力完成，而秋季长寿代承担南返越冬；不是同一只蝶完成简单往返。
- **Style fit**：中世纪现代主义的季节色块、木质路线和有机曲线适合温和讲述跨代迁徙。Visual Engine 为 organic map + life-cycle markers；构图 `winter-grove → spring-path → generation-rings → autumn-return → forest-hold`。
- **Scene 1（1）**：墨西哥越冬林以大片暖棕/橙色叶群呈现，单只蝶不运动。
- **Scene 2（3）**：春季北上与产卵，第一代以小圆环替换上一代，不让角色飞完整路程。
- **Scene 3（2）**：多代向北扩展，地图同时显示时间与世代而非单一箭头。
- **Scene 4（4）**：秋季 super generation 沿一条连续长路径南返，色彩随季节转冷。
- **Scene 5（1）**：回到越冬林，注明不同种群/区域路线差异与栖息地风险。
- **Motion**：主 Environmental life，辅 Path/topology；curve `1-3-2-4-1`，缓慢 drift 500–900ms，Scene 5 quiet。
- **Navigation**：ambient / `seasonal halo` / keyboard focus / material-color change；五段季节环切换木色/叶色，键盘焦点显著。
- **Transition Score**：`push-y → push-x → focus-swap → push-y`；Spatial + Camera 两类，强度克制。
- **资产/研究**：原创蝶/地图 SVG。目标来源 USFWS、NPS、同行评议迁徙研究；`pending`。东西部种群与年度路线不可混写。
- **碰撞/禁用**：旧库最近 `calmer-growth-model`，差异是具体跨代迁徙，不是增长隐喻；新批最近“毛虫变蝶”，一个讲种群时空，一个讲个体发育。禁叶片卡片、线性进度条、让一只蝶走完整年循环。

### 37 — `after-hours-luxe` · Urushi Cure · 总强度 3/5

- **注册信息**：`topicId: urushi-cure`；TopicBar `Urushi Cure / 漆的固化`。M×Material Transformation，Wildcard，Direct，Stage impact。核心句：传统 urushi 漆在适宜湿度和温度下通过酶促氧化与聚合固化；这与“潮湿让普通涂料难干”的直觉相反。
- **Style fit**：深色、金色边缘与缓慢镜面光泽来自漆材本身，不把工艺变成香水广告。Visual Engine 为 luxury material sheen；构图 `raw-sap-drop → filtered-layers → humidity-chamber → polymer-surface → lacquer-object`。
- **Scene 1（2）**：生漆滴在黑色台面，只有一圈微弱棕光；标注材料安全边界。
- **Scene 2（3）**：过滤/精制与薄层涂布用刮片动作表示，每层透明度不同。
- **Scene 3（3）**：湿度环境进入，表面散射与反应层缓慢改变；仪表只显示范围，不写单一万能配方。
- **Scene 4（3）**：Signature：漆面由哑光散射转为深色镜面 sheen；reduced motion 显示固化前后样片。
- **Scene 5（1）**：一件有明确来源的漆器或抽象样板静置，说明层数/条件随传统与工艺而异。
- **Motion**：主 Material operations，辅 Camera/light；curve `2-3-3-3-1`，sheen 900–1400ms，拒绝粒子闪耀。
- **Navigation**：ambient / `lacquer sheen loci` / gesture-hold / typographic emphasis；长按只负责显露导航，释放后仍可 tap；当前层名增重。
- **Transition Score**：`focus-swap → ink-spread → iris-open → focus-swap`；Camera + Material + Mask 三类。
- **资产/研究**：原创材质 shader/CSS，真实漆器图来自博物馆开放资产。目标来源日本/东亚漆艺文化机构、博物馆保育研究、材料科学论文；`pending`。
- **碰撞/禁用**：旧库最近 `private-beta-salon`，差异是材料固化而非独家活动；新批最近“玄武岩成土”，都与湿度有关，但一个聚合成膜，一个矿物风化。禁香水瓶、金粉粒子、第二 accent、把 urushi 等同所有 lacquer。

### 38 — `operating-manual` · The Escapement · 总强度 2/5

- **注册信息**：`topicId: escapement`；TopicBar `The Escapement / 擒纵器`。C×Cutaway，Familiar，Direct，Diagram explainer。核心句：机械钟的擒纵器把持续的发条/重锤能量切成离散脉冲，同时允许振荡器按自己的节律释放齿轮。
- **Style fit**：编号步骤与高对比剖面直接解释零件顺序；不是把钟表写成 terminal 命令。Visual Engine 为 exploded mechanical manual；构图 `clock-face → gear-section → pallet-closeup → pulse-cycle → assembled-clock`。
- **Scene 1（1）**：秒针忽然停住，问题是“持续能量如何变成一格一格？”
- **Scene 2（2）**：动力源、轮系、擒纵轮、擒纵叉、振荡器按编号爆炸展开。
- **Scene 3（4）**：锁止—冲量—释放的一个周期逐 Beat 运行；只动两个接触点。
- **Scene 4（2）**：把重复周期放回齿轮比与计时误差，标出简化模型边界。
- **Scene 5（1）**：组件合拢，秒针走一格后完全停住供阅读。
- **Motion**：主 Object mechanics，辅 Line drawing/growth；curve `1-2-4-2-1`，齿轮 180–360ms step，禁止常转 loop。
- **Navigation**：edge scale / `gear-tooth register` / keyboard focus / typographic emphasis；五个齿号兼作 Scene 索引，当前编号加粗。
- **Transition Score**：`hard-cut → linear-wipe → iris-open → focus-swap`；Editing + Mask + Camera 三类。
- **资产/研究**：原创 SVG 机构图；目标来源 horological institutions、Smithsonian/Science Museum、机械钟技术资料；`pending`。具体擒纵类型锁定 anchor escapement，不能混入其他机构动作。
- **碰撞/禁用**：旧库最近 `new-habit-runbook`，差异是真实机构周期，不是行为步骤；新批最近“电梯配重”，同属机械但一个离散计时、一个负载平衡。禁 terminal prompt、普通 checklist、自由旋转全齿轮。

### 39 — `widescreen-title-card` · Whale Fall · 总强度 4/5

- **注册信息**：`topicId: whale-fall`；TopicBar `Whale Fall / 鲸落`。L×Scale，Specific，Metaphor，Stage impact。核心句：一具鲸尸沉到深海后，会从大型食腐、机会主义群落到富硫阶段形成跨多年、跨尺度的生态接替；阶段并非每个地点都同样清晰。
- **Style fit**：cinematic letterbox 适合用时间与深度建立一场缓慢“降幕”；不靠五张海洋电影剧照。Visual Engine 为 deep-sea cinematic illustration；构图 `surface-title → descent-wide → scavenger-close → bone-microcosm → abyssal-endcard`。
- **Scene 1（1）**：海面亮带与“AFTER THE WHALE FALLS”片名，主体尚未出现。
- **Scene 2（1）**：镜头极慢下沉到海床，鲸体从负空间中显现。
- **Scene 3（2）**：大型食腐动物与机会主义生物依次进入，时间轴只标来源支持的范围。
- **Scene 4（3）**：骨骼近景切入微生物/化能生态，光线从摄影式转为科学示意式。
- **Scene 5（4）**：拉远显示鲸落成为深海“岛屿”，随后所有运动停止，保留阶段差异边注。
- **Motion**：主 Camera/light，辅 Environmental life；curve `1-1-2-3-4`，dolly 900–1600ms、生态进入 400ms；不做漂浮粒子 loop。
- **Navigation**：card/miniature / `whale-fall filmstrip` / keyboard focus / next-state preview；五格胶片是不同尺度而非同构缩略图。
- **Transition Score**：`dip-to-color → dolly-pull → focus-swap → crossfade`；Editing + Camera 两类。
- **资产/研究**：原创深海 SVG/插画，真实照片仅用 NOAA/MBARI 等许可资产。目标来源 NOAA Ocean Exploration、MBARI、鲸落生态论文；`pending`。
- **碰撞/禁用**：旧库最近 `five-acts-system`，差异是生态接替而非抽象戏剧结构；新批最近“地衣伙伴”，一个是时间接替，一个是共生网络。禁电影剧照拼贴、旁白式空字幕、把阶段画成严格线性定律。

### 40 — `blackboard-chalk-talk` · How Hearing Begins · 总强度 3/5

- **注册信息**：`topicId: hearing-path`；TopicBar `How Hearing Begins / 听觉起点`。S×Scale，Familiar，Direct，Diagram explainer。核心句：空气压力变化经外耳、听小骨、耳蜗液体与毛细胞转换为神经信号；声音不是一条波形原样“进入大脑”。
- **Style fit**：黑板按推导顺序画出介质和转换，每一步保留前一步痕迹。Visual Engine 为 chalk scientific derivation；构图 `wave-equation → ear-outline → lever-diagram → cochlea-map → neural-box`。
- **Scene 1（1）**：粉笔画出疏密相间的空气压力，不先画正弦线当空气轨迹。
- **Scene 2（1）**：外耳和鼓膜加入，压力变化变成机械振动。
- **Scene 3（2）**：听小骨杠杆与面积关系以简化箭头推导，标注不是比例图。
- **Scene 4（3）**：耳蜗行波沿基底膜位置达到峰值，连续频率地图逐笔出现。
- **Scene 5（4）**：毛细胞机械—电转换与听神经编码接上整条链，最后框出“多次转换”。
- **Motion**：主 Line drawing/growth，辅 Path/topology；curve `1-1-2-3-4`，粉笔 300–700ms，Scene 5 为唯一密集推导。
- **Navigation**：path / `auditory pathway` / gesture-hold / history trail；长按显露整条粉笔路径，松开后各节点仍可 tap/keyboard。
- **Transition Score**：`linear-wipe → push-x → dip-to-color → linear-wipe`；Mask + Spatial + Editing 三类，像擦板/换黑板区域。
- **资产/研究**：原创 SVG/CSS chalk。目标来源 NIH/NIDCD、听觉生理教材、耳蜗力学研究；`pending`。不得把单个毛细胞对应单个音符。
- **碰撞/禁用**：旧库最近 `derive-shortcut`，差异是跨介质生理推导而非公式捷径；新批最近“声带”，一个生成声音，一个转换声音。禁一次出现全耳图、装饰公式、同速画线、波形穿脑。

### 41 — `arcade-boss-fight` · Egg Mimicry · 总强度 5/5

- **注册信息**：`topicId: egg-mimicry`；TopicBar `Egg Mimicry / 卵拟态`。L×Dual，Specific，Productive Contrast，Stage impact。具体系统锁定 common cuckoo 与一个有充足研究的 host population。核心句：寄生者提高卵拟态，宿主提高识别/拒绝，双方选择压力推动宿主特异的视觉军备竞赛，但并非每轮都有单向“升级”。
- **反差价值**：boss-fight 把互相施加选择压力做成关卡规则；同时明确这不是善恶叙事，也不把幼鸟死亡做笑料。Visual Engine 为 pixel sprites + pattern comparison。
- **Scene 1（4）**：宿主巢与外来卵冷开场，HUD 只显示“识别阈值”，没有生命值。
- **Scene 2（1）**：宿主卵花纹分布成为参考空间，外来卵尝试匹配；不画主观“完美/丑”。
- **Scene 3（2）**：宿主接受/拒绝的代价与识别误差形成规则，界面停止供解释。
- **Scene 4（2）**：Signature：三代蛋纹 sprite 在同一宿主关卡中改变，宿主阈值也重排；reduced motion 为三张静态代际 sprite。
- **Scene 5（1）**：胜负屏改为 “ARMS RACE CONTINUES”，列出系统依赖与研究边界。
- **Motion**：主 Character acting，辅 Shape morph；curve `4-1-2-2-1`，8/12fps 像素步进、pattern morph 硬切；不循环死亡/重生。
- **Navigation**：spatial node / `nest map` / keyboard focus / geometry reflow；巢内五个位置重排显示状态，焦点框符合复古 UI 但可读。
- **Transition Score**：`push-x → glitch → split-merge → push-x`；Spatial + Signal + Structural 三类。
- **资产/研究**：原创 pixel sprites；目标来源自然史博物馆、杜鹃—宿主实证研究、行为生态论文；`pending`。host、地点、实验条件必须锁定。
- **碰撞/禁用**：旧库最近 `latency-boss-fight`，差异是演化博弈而非性能障碍；新批最近“桦尺蛾实验”，一个是共同演化军备竞赛，一个是选择实验史。禁 HP 装饰、死亡笑料、无限复活、smooth emoji。

### 42 — `research-memo` · Impact Evidence · 总强度 1/5

- **注册信息**：`topicId: impact-evidence`；TopicBar `Impact Evidence / 撞击证据`。U×Evidence，Familiar，Direct，Evidence report。核心句：白垩纪—古近纪边界的铱异常、冲击石英/玻璃球粒、全球沉积层与 Chicxulub 撞击坑共同构成证据链；科学共识不是由单篇论文瞬间完成。
- **Style fit**：memo 的问题—方法—发现—边界结构直接适配多证据调查。Visual Engine 为 research dossier；构图 `research-question → evidence-table → sample-plate → site-correlation → bounded-finding`。
- **Scene 1（2）**：研究问题、时间边界与候选解释，三段文本一次落位。
- **Scene 2（4）**：铱异常的多地点记录表与一张边界层剖面；1/5 ceiling 下只做行聚焦。
- **Scene 3（1）**：冲击石英、球粒等标本证据静态并列，图注完整。
- **Scene 4（3）**：撞击坑地球物理/钻芯证据与全球层位关联，只有一条关联线移动。
- **Scene 5（1）**：结论与边界：撞击的关键作用、研究史中的其他环境压力及不可过度推断之处。
- **Motion**：主 Document/evidence，辅 Data/instrument；curve `2-4-1-3-1` 仅表示聚焦顺序，正文出现后零运动。
- **Navigation**：typographic index / `impact citation chain` / click-expand / history trail；引用编号形成链，已读证据留下细线。
- **Transition Score**：`hard-cut → crossfade → focus-swap → hard-cut`；Editing + Camera 两类。
- **资产/研究**：目标来源 Alvarez et al. 1980、IODP Expedition 364、USGS/NASA/博物馆资料；`pending`。每个 claim 建 `claim_id → source_id`。
- **碰撞/禁用**：旧库最近 `evidence-smaller-team`，差异是地质证据链而非组织研究；新批最近“臭氧洞”，两者同为科学发现，但证据介质、尺度和时间线不同。禁陨石爆炸 hero、单一科学家神话、把时间相关写成全部因果。

### 43 — `decision-record` · Standard Time · 总强度 1/5

- **注册信息**：`topicId: standard-time`；TopicBar `Standard Time / 标准时`。H×Dual，Specific，Direct，Evidence report。范围锁定 19 世纪英国铁路时间：地方太阳时与跨城时刻表发生冲突，铁路、电报、天文授时和法规逐步形成标准。
- **Style fit**：ADR 式 Context / Forces / Decision / Consequences 能展示“为什么社会选择统一时间”及代价，不把历史伪装成现代架构决策。
- **Visual Engine**：document record + clock diagram；构图 `local-clock-pair → conflict-table → synchronization-network → adoption-record → consequence-note`。
- **Scene 1（4）**：两个城镇的正午时钟静态并列，差值与经度来源可追溯。
- **Scene 2（1）**：铁路时刻表展示地方时带来的接续问题，不夸大为普遍混乱。
- **Scene 3（2）**：天文台授时、电报与车站钟组成同步网络。
- **Scene 4（2）**：采用过程用多份记录/日期推进，避免一个法令瞬间统一的故事。
- **Scene 5（1）**：后果分为协调收益、地方时间消失与后来时区扩展；文字稳定。
- **Motion**：主 Document/evidence，辅 Type choreography；curve `4-1-2-2-1`，时钟只校正一次，正文无 loop。
- **Navigation**：typographic index / `time-standard clauses` / drag-scrub / next-state preview；scrub 只预览五份记录，普通 click/tap/keyboard 为主操作。
- **Transition Score**：`hard-cut → crossfade → page-turn → crossfade`；Editing + Material 两类。
- **资产/研究**：目标来源 Royal Observatory Greenwich、Science Museum/铁路档案、英国标准时间史研究；`pending`。国家/地区范围写清，不做全球一条时间线。
- **碰撞/禁用**：旧库最近 `choose-boundary`，差异是历史协调制度而非技术边界；新批最近“月球拉远”，都涉及“日变长/时间”，但一项是天体物理，一项是社会标准。禁伪 ADR 结论、现代 roadmap、单一英雄发明标准时。

### 44 — `maintainer-issue-brief` · Ozone Hole · 总强度 2/5

- **注册信息**：`topicId: ozone-hole`；TopicBar `Ozone Hole / 臭氧洞`。E×Evidence，Familiar，Metaphor，Evidence report。核心句：南极春季臭氧急降由地面长期测量、卫星复核、极地云化学和氯化合物机制逐步闭环；“洞”是季节性低值区，不是天空破了一个孔。
- **Style fit**：issue brief 的 Repro / Signals / Root cause / Verification / Status 恰好组织发现史，但页面必须明确它是科学案件，不是软件 bug。
- **Visual Engine**：evidence timeline + atmospheric section；构图 `issue-header → station-series → satellite-check → chemistry-cutaway → recovery-status`。
- **Scene 1（2）**：定义观测问题、地点、季节与测量单位，正文一次落位。
- **Scene 2（4）**：Halley 等地面序列显示异常下降，数据来源与质量控制可见。
- **Scene 3（1）**：卫星资料如何复核/重处理异常，算法细节只保留与故事相关部分。
- **Scene 4（3）**：极地平流层云、低温、氯化学与春季阳光的机制链逐步高亮。
- **Scene 5（1）**：Montreal Protocol 后的状态与恢复预期使用最新权威评估，并区分天气年际波动。
- **Motion**：主 Document/evidence，辅 Data/instrument；curve `2-4-1-3-1`，数据图读数出现后静止，无 radar loop。
- **Navigation**：typographic index / `ozone issue states` / keyboard focus / mechanical displacement；五个状态标签像档案夹移动，焦点可见。
- **Transition Score**：`linear-wipe → hard-cut → crossfade → linear-wipe`；Mask + Editing 两类。
- **资产/研究**：目标来源 British Antarctic Survey、NASA/NOAA、WMO/UNEP 最新臭氧评估；`pending`。恢复年份、年度面积等不稳定数据在制作时重新核验。
- **碰撞/禁用**：旧库最近 `ready-agent-pickup`，差异是环境科学证据，不是开发 ticket；新批最近“小行星撞击证据”，一个是仪器时间序列+化学机制，一个是地质空间证据。禁 bug icon、灾难化地球洞、最新状态不查证。

### 45 — `field-notes-report` · Ancient Sound · 总强度 2/5

- **注册信息**：`topicId: ancient-sound`；TopicBar `Ancient Sound / 古代声音`。S×Evidence，Specific，Direct，Editorial reading。个案锁定 Chavín de Huántar：pututu 海螺号角、地下廊道与声学测量可以重建可能的听觉体验，但不能直接证明具体仪式意图。
- **Style fit**：田野笔记容纳位置、器物、测量设置、观察与解释分层。Visual Engine 为 field notebook + instrument/acoustic plan；构图 `site-cover → object-sketch → measurement-setup → impulse-map → interpretation-notes`。
- **Scene 1（2）**：遗址入口、日期、研究问题和现场平面，一页内稳定落位。
- **Scene 2（4）**：pututu 形制、出土语境和可发声复原分开记录；真实文物与复制品标识清楚。
- **Scene 3（1）**：测量设备、声源/麦克风位置与廊道尺寸成为静态实验图。
- **Scene 4（3）**：脉冲响应/声场模型在平面上逐区高亮，并列不确定性。
- **Scene 5（1）**：Observation / Inference 两栏明确分开，不写“声学操控仪式”定论。
- **Motion**：主 Stroke drawing，辅 Document/evidence；curve `2-4-1-3-1`，田野草图与声场路径逐笔出现；阅读期间无持续动画。
- **Navigation**：card/miniature / `instrument field cards` / gesture-hold / mechanical displacement；hold 只显露卡组，tap/keyboard 是主导航，当前卡像夹子挪位。
- **Transition Score**：`page-turn → crossfade → page-turn → hard-cut`；Editing + Material 两类。
- **资产/研究**：目标来源 Stanford CCRMA Chavín project、同行评议遗址声学、UNESCO/遗址机构；`pending`。文物/现场照片逐张核权。
- **碰撞/禁用**：旧库最近 `station-platform-study`，差异是考古声学实验，不是现代现场观察；新批最近“舞谱”，一个用场所/器物重建声音，一个用符号重建动作。禁虚构 field note、神秘仪式图、AI 合成“真实古声”。

### 46 — `annotated-source-diff` · Reading Rosetta · 总强度 2/5

- **注册信息**：`topicId: reading-rosetta`；TopicBar `Reading Rosetta / 破译罗塞塔`。H×Evidence，Familiar，Metaphor，Evidence report。核心句：罗塞塔石碑不是“三种语言”，而是两种语言、三种书写体；学者通过名字、语法、平行段落与其他文本逐步检验音值假设。
- **Style fit**：source/diff 能把同一敕令的对应段落、假设、修订和验证直接标出；不是把碑文涂成代码语法色。
- **Visual Engine**：parallel text diff + glyph evidence；构图 `stone-source → three-registers → aligned-lines → hypothesis-diff → verified-reading`。
- **Scene 1（2）**：石碑整体与缺失部分，三段 register 清晰标出；同时用一行说明取得/归属历史语境。
- **Scene 2（4）**：希腊文内容与埃及文字的平行结构按段落对齐，正文静态。
- **Scene 3（1）**：cartouche、人名和重复符号作为少量锚点，不展示“猜中一切”。
- **Scene 4（3）**：Young、Champollion 及其他贡献链中的假设/修订/新文本验证以 diff 状态表现。
- **Scene 5（1）**：保留一组可解释字形和一组仍需更多语境的字形，拒绝单英雄结尾。
- **Motion**：主 Type choreography，辅 Document/evidence；curve `2-4-1-3-1`，只在字形对齐时轻 morph，正文不移动。
- **Navigation**：typographic index / `Rosetta symbol minimap` / gesture-hold / geometry reflow；hold 显露 minimap，tap/keyboard 可直接选择，当前段重新排到中央。
- **Transition Score**：`hard-cut → focus-swap → crossfade → hard-cut`；Editing + Camera 两类。
- **资产/研究**：目标来源 British Museum、原始破译文献、埃及学研究；`pending`。碑文图像许可、殖民取得与归属争议需准确简述。
- **碰撞/禁用**：旧库最近 `rewrite-broken-flow`，差异是历史语言证据链，不是代码/文案优化；新批最近“字母 A”，一个做平行文本破译，一个做字形谱系。禁红绿 code diff、单英雄“瞬间破解”、伪象形字动画。

### 47 — `checklist-ledger` · Pigment Without Touch · 总强度 2/5

- **注册信息**：`topicId: pigment-without-touch`；TopicBar `Pigment Without Touch / 无损识色`。M×Evidence，Specific，Productive Contrast，Evidence report。个案锁定 Mauritshuis “Girl in the Spotlight” 一类公开研究包：多种非侵入成像/光谱方法共同约束颜料与层次，单一仪器不能自动给出完整答案。
- **反差价值**：ledger 把 conservation workflow、校准、证据覆盖和解释限制逐项核验；反差来自“清单风格也能做视觉科学”，不是重复打勾。
- **Visual Engine**：conservation ledger + spectral overlays；构图 `painting-overview → method-register → element-map → cross-check-table → conservation-record`。
- **Scene 1（2）**：作品与研究问题、禁止取样边界、坐标系统一次落位。
- **Scene 2（4）**：XRF、反射成像、显微/OCT 等方法按“测到什么 / 测不到什么”登记；2/5 ceiling 下只做选中高亮。
- **Scene 3（1）**：一张元素分布图静态显示，明确元素不是颜料名称的自动等号。
- **Scene 4（3）**：多方法交叉验证一处颜色/层次推断；冲突证据保留。
- **Scene 5（1）**：ledger 记录结论、置信边界、未解问题和资产来源。
- **Motion**：主 Document/evidence，辅 Camera/light；curve `2-4-1-3-1`，正文稳定；光谱/成像焦点只切换一次，无扫描 loop。
- **Navigation**：edge scale / `pigment swatch rail` / gesture-hold / active glow；hold 只显示轨道，tap/keyboard 主操作，当前 swatch 发光不遮正文。
- **Transition Score**：`crossfade → hard-cut → linear-wipe → crossfade`；Editing + Mask 两类。
- **资产/研究**：目标来源 Mauritshuis 公布研究、Getty/National Gallery conservation science、仪器方法论文；`pending`。具体作品与图像许可在 facts/asset packet 固定。
- **碰撞/禁用**：旧库最近 `launch-gate-ledger`，差异是证据交叉验证而非发布验收；新批最近“七种蓝”，一个识别既有作品颜料，一个比较蓝色制造机制。禁重复 checkbox、红绿通过态、把元素图等同颜料答案。

### 48 — `context-bento-box` · Lichen Partners · 总强度 3/5

- **注册信息**：`topicId: lichen-partners`；TopicBar `Lichen Partners / 地衣伙伴`。L×Chorus，Wildcard，Metaphor，Diagram explainer。核心句：地衣的可见身体由主要真菌、光合伙伴及其他微生物共同构成；伙伴关系和分层结构比“真菌 + 藻类”的二元公式更复杂，但不能把所有发现泛化到所有地衣。
- **Style fit**：bento 的分隔与跨格连接让不同伙伴、层次与功能同时可见；不能做七个等大卡片。Visual Engine 为 compartmental ecological diagram；构图 `whole-thallus → asymmetric-cutaway → partner-compartments → exchange-network → recombined-organism`。
- **Scene 1（4）**：一块地衣占满画面，六个不等形切口提示内部并非单体。
- **Scene 2（3）**：上皮层、光合层、髓层等剖面分区进入，几何按真实层次而非 bento 均分。
- **Scene 3（2）**：主要真菌与藻/蓝细菌的物质交换在跨格通道中显示。
- **Scene 4（1）**：其他酵母/细菌等研究发现以“在部分系统中”标签出现，避免“每个地衣都有固定名单”。
- **Scene 5（1）**：格子重组为完整 thallus，结论是“一个名称，多个协作者”。
- **Motion**：主 Shape morph，辅 Environmental life；curve `4-3-2-1-1`，格口 300–600ms 开合，后两 Scene 静止。
- **Navigation**：spatial node / `lichen compartments` / gesture-hold / material-color change；长按显露五个层次节点，当前格材质变化；tap/keyboard 可直接跳。
- **Transition Score**：`grid-reveal → focus-swap → iris-open → grid-reveal`；Structural + Camera + Mask 三类。
- **资产/研究**：原创 SVG 剖面；目标来源 Smithsonian/USFS、地衣学综述和微生物组研究；`pending`。不同地衣系统的伙伴范围必须保守书写。
- **碰撞/禁用**：旧库最近 `handoff-compartments`，差异是跨格共生网络而非上下文打包；新批最近“鲸落”，一个是同时共生，一个是时间接替。禁七等分 cards、无连接格子、可爱食物 icon、宣称“地衣不是生物”这种过度标题。

### 49 — `object-metaphor-hero` · Cocoon to Cloth · 总强度 4/5

- **注册信息**：`topicId: cocoon-to-cloth`；TopicBar `Cocoon to Cloth / 茧到织物`。M×Scale，Specific，Direct，Stage impact。核心句：一枚蚕茧由连续丝蛋白长丝与胶质组成，经煮茧、缫丝、并丝、加捻与织造才成为稳定织物；“一根丝”与“一块布”之间是尺度和结构的连续重组。
- **Style fit**：英雄物件从单茧变成线轴和织物，物体本身承担抽象“从一到多”的隐喻。Visual Engine 为 crafted object + mechanical loom；构图 `cocoon-hero → filament-macro → reeling-object → weave-structure → folded-cloth`。
- **Scene 1（1）**：单枚蚕茧置于暖色台座，只有一根可见线头。
- **Scene 2（1）**：微观放大显示丝芯/胶质与连续长丝概念，不给未经核验的纪录长度。
- **Scene 3（2）**：多茧丝在缫丝器上汇为一股，张力与水温只做关键标注。
- **Scene 4（3）**：并丝/加捻后进入经纬结构，梭子完成一次真实交织循环。
- **Scene 5（4）**：织物从线性结构展开为完整英雄物，随后折叠静置，保留劳动与地域工艺注记。
- **Motion**：主 Object mechanics，辅 Material operations；curve `1-1-2-3-4`，抽丝 600ms、梭子 240ms、布面展开 900ms；不做无限纺纱 loop。
- **Navigation**：object controller / `silk spindle` / gesture-hold / next-state preview；hold 显露五圈线轴，tap/keyboard 主操作，下一圈显示对应物态轮廓。
- **Transition Score**：`iris-open → split-merge → zoom-through → iris-open`；Mask + Structural + Camera 三类。
- **资产/研究**：原创 3D-like SVG/CSS hero；目标来源 Smithsonian/Met/V&A 纺织资料、sericulture 研究与相关文化机构；`pending`。具体工序按选定地域/传统核验，避免把丝绸史简化成单一路径。
- **碰撞/禁用**：旧库最近 `recovery-kit`，差异是一个物体的真实制造链，不是工具包隐喻；新批最近“七种蓝”，一个讲纤维结构放大，一个讲颜色材料比较。禁多 hero 套装、工具箱、stock 丝绸照、无劳动者语境的奢华广告。

## 7. 阅读密度、动效强度与双语约束

### 7.1 Mode × Intensity 已锁定交叉表

这张表避免把“舞台冲击”误判为“必须高运动”，也确保阅读型 Topic 全部停在 1–2/5。

| Viewing Mode | 1 | 2 | 3 | 4 | 5 | 合计 |
|---|---:|---:|---:|---:|---:|---:|
| Stage impact | 1 | 2 | 3 | 6 | 3 | 15 |
| Visual narrative | 1 | 2 | 3 | 2 | 1 | 9 |
| Diagram explainer | 1 | 3 | 8 | 2 | 0 | 14 |
| Editorial reading | 2 | 4 | 0 | 0 | 0 | 6 |
| Evidence report | 2 | 3 | 0 | 0 | 0 | 5 |
| 合计 | 7 | 14 | 14 | 10 | 4 | 49 |

### 7.2 单 Scene 文案预算

| Mode | English 预算 | 画面规则 |
|---|---:|---|
| Stage impact | 8–35 words | 一个主动作；演讲者补足解释 |
| Visual narrative | 20–60 | 动作必须表现材料、角色或路径的真实属性 |
| Diagram explainer | 35–100 | 动画只解释因果、顺序、受力或结构 |
| Editorial reading | 80–160 | 正文阅读前完全落位；无 loop |
| Evidence report | 120–220 | 引用、表题、证据边界稳定可读；无 loop |

中文不按英文字数机械折算；以真实行数、CJK 字体覆盖、标题断行和 1920×1080 / thumbnail 浏览器截图为准。TopicBar 使用紧凑标题：EN `≤32` 字符，ZH `≤8` 字；总览中的长纪录片标题放 Scene 1，不塞入 TopicBar。

EN/ZH 必须共享：5 个 Scene ID、Beat 数、关键实体、数字、年代、claim 与 source。允许分别写作、分别断行、分别编排巨型文字。Style 06 的字形叙事不能依赖不可翻译的英文双关；中文以同一历史字形与“A 之前”独立构图。

## 8. 研究、资产与事实验收

### 8.1 每个 Topic 的 facts packet

实现 agent 只接收已核验 packet，不自行补事实。统一字段：

```text
topic_id
canonical_subject
scope_place_time
central_claim
claim_id -> source_id[]
named_cases_or_objects
known_limits_and_disputes
approved_numbers_and_dates
approved_quotes
source_url / publisher / author / date / access_date
asset_url / creator / license / crop / local_path
```

通过条件：每 Topic 至少 3 个权威来源，49 项至少 147 条 topic-source links；至少 2/3 来自原始档案、政府/国际机构、博物馆、大学、论文或专业组织。研究状态在 packet 完成前统一为 `pending`，本文不把题材可行性误写成 citation passed。

### 8.2 需要额外审稿的 8 项

| Topic | 风险 | 固定处理 |
|---|---|---|
| Tea / Cha | 两路线过度简化 | 保留例外层；逐语言列最早记录与借入路径 |
| Iron from Stars | “超新星制造一切” | 明写 multiple sites；分开 fusion 与中子俘获 |
| Oral to Written | 记录者替代社区声音 | 锁定一个有社区/档案许可的个案；署名表演者与编辑链 |
| Concealed Objects | 仪式意图不可证 | 分开 find / inference / analogy；不编物件主人 |
| Whistled Language | 跨文化扁平化 | 只用 Silbo Gomero、Kuş dili、Mazatec 三个有上游来源的案例 |
| Egg Mimicry | 物种间差异大 | 锁定 common cuckoo + 一个研究充分的 host population |
| Ancient Sound | 声学证据被写成仪式事实 | Observation / Inference 分栏；仪式意图只写 hypothesis |
| Pigment Without Touch | 元素图不等于颜料名 | 以多方法交叉验证；固定公开 conservation case |

### 8.3 计划中的原创代码 hero

至少 25 项已明确为独立 SVG/CSS/DOM 主视觉：01 尘粒、02 桥构件、03 成土剖面、04 声带、05 彗星、06 字形、07 看台、11 热网、12 水塔、13 蛹、15 电梯、16 潮汐台、17 传感阵列、22 元素壳层、24 蓝色材料、28 复合梁、30 冰芯磁带、33 雪晶、34 夹层玻璃、35 Voyager 遥测、38 擒纵器、40 听觉链、41 卵拟态、48 地衣剖面、49 丝轴织机。

这些 hero 不跨 Topic 复用。外部照片只作为真实对象/现场证据；AI 图只允许抽象背景、气氛或明确虚构物件，不得替代科学、历史、新闻、文化对象或真实人物证据。

## 9. 生产顺序与多 agent 策略

### Gate 0 — 用户确认本矩阵（已通过）

用户已确认本文，并授权所有待定项直接采用本文推荐值；不再追加确认轮次。

### Gate 1 — Anchor 预览并入首批施工（已授权）

用户授权采用推荐值直接施工。7 个真实互动 anchor 不再单独等待选择，而是作为前三个生产批次的质量基线：

| Anchor | 验证目标 |
|---|---|
| 06 Before A | 5/5 巨型文字、中文独立编舞、历史字形证据 |
| 07 Stadium Wave | 固定 SVG Emoji 角色、群体接力、触摸 fallback |
| 12 Water Tower | 工程白板 Beat、图线增长、Emoji sticker 边界 |
| 18 Rogue Wave | 1/5 高密阅读、正文稳定、版面脚注 |
| 35 Voyager Boundary | 新 Signal primitives、窗口导航、Signature modifier |
| 37 Urushi Cure | 材料物理、慢光泽、非摄影 hero |
| 42 Impact Evidence | Evidence report、claim-source、frozen/readability |

Anchor 使用最终生产代码、最终 URL 与最终 registry，不创建临时 preview-only route。前三批通过截图与交互审计后，继续其余批次。

### Gate 2 — 共享基础设施先行

1. 已扩展 `SpatialSceneTrack` 的类型、CSS 与测试；21 种 canonical primitives 均已可用，同时保留 legacy kinds 供现有 Topic 使用。
2. 建立 signature modifier API；每个 edge 仍有 shared primitive/fallback，modifier 不接管 outgoing lifecycle。
3. 补 transition interruption、rapid navigation、frozen、thumbnail、reduced-motion 测试。
4. 固化 Navigation contract：carrier / invocation / feedback 分字段；普通 click/tap/keyboard 永远存在，proximity/drag/hold 只是增强层。
5. 建 7 个 Territory research brief 与 49 个 facts packet；最多 3 个研究 agent 并发，不拆成 49 个独立研究口径。
6. 集中完成 registry schema、TopicBar 紧凑 label 与资产 manifest 约束；各 Topic agent 不自行改共享协议。

### Gate 3 — 49 个独立 sub-agent，施工并发与提交批次分离

- 每个 Topic 由一个独立 sub-agent 负责实现、Review 与聚焦测试；共 49 个 sub-agent task。
- 当前逻辑批次按用户当时指令一次性并发启动全部剩余 Topic sub-agent；已完成但尚未提交的 Topic 不重复施工。已启动 Agent 不因后续并发策略调整而中断。
- 从下一逻辑批次开始，同时最多 4 个生产 sub-agent；任一 Topic 完成即补位，直到该逻辑批次全部完成。施工并发不改变 `10 + 10 + 8` 的提交边界。
- 主 agent 负责共享文件、冲突处理、全局验证、提交、推送和部署。批内仍严格一 Topic 一负责人，禁止复用完成 Agent 施工第二个 Topic。
- 前 21 个 Topic 已按最初七个 3-Topic 批次提交。用户随后把剩余 28 个 Topic 的逻辑提交批次改为 `10 + 10 + 8`；每个逻辑批次全部集成并通过完整回归后才 commit + push，批次未满不得提前提交。
- 每个 agent 只拿到：Style DNA、本文对应小节、facts packet、共享 contract、forbidden defaults；不得自行改题或复制旧 Topic 布局。

| Logical batch | Style # | Topic count | Commit condition |
|---:|---|---:|---|
| Shipped 01–07 | 06, 07, 12, 18, 35, 37, 42, 01, 33, 39, 49, 38, 40, 21, 05, 29, 27, 34, 32, 04, 09 | 21 | 已完成七个历史 3-Topic commit |
| Current | 03, 22, 36, 11, 14, 23, 20, 16, 44, 13 | 10 | registry total `128`；完整 unit/typecheck/build/audit 通过 |
| Next | 47, 17, 45, 46, 10, 31, 19, 28, 15, 08 | 10 | registry total `138`；完整 unit/typecheck/build/audit 通过 |
| Final | 43, 30, 41, 48, 24, 02, 26, 25 | 8 | registry total `146`；完整 unit/typecheck/build/audit 与最终多-agent 验收通过 |

每个 Topic 检查：聚焦 unit test、typecheck、registry/protocol、EN/ZH、frozen/thumbnail、1920×1080 视觉 Review。每个逻辑提交批次再运行完整 unit/typecheck/build/audit 与跨 Topic 视觉抽查，避免局部测试掩盖集成问题。

### Gate 5 — 集中集成

- integrator 统一注册 49 Topic，最终总 Topic 数应从 97 变为 146；原 48 Style 各 3 Topic，`engineering-whiteboard-explainer` 共 2 Topic。
- Topic agent 不直接改跨 Style 顺序、Envelope、全局 URL 语义或 shared transition lifecycle。
- 旧 Topic 的可达 URL、顺序和 frozen screenshot 不得回归。

## 10. 自动化检查与人工审计

### 10.1 必跑命令

```bash
npm run test:unit
npm run typecheck
npm run build
npm run test:audit
```

新增/扩展的测试面：

- Registry：49 Style、最终 146 Topic、49 个新 `topicId` 唯一、每个新 Topic 5 Scenes、所有 Beat 可寻址。
- Protocol：21 transition kinds 类型与样式全覆盖；49 scores 可枚举；任何 Topic 不维护 outgoing clone。
- Motion：`reducedMotion` 与 `frozen` 到达相同信息终态；rapid scene change 无残留层。
- Navigation：49 carrier 唯一、7 activation/feedback 各 7 次、49 pair 唯一；click/tap/keyboard fallback、thumbnail 隐藏。
- Reading：245 个新 Scene 的 overflow、遮挡、最小字号、引用、表格、CJK 断行；ER/EV 无 loop。
- Assets：无 remote hotlink、404、缺字体、未知许可；manifest 与本地文件一一对应。
- Visual：每个新 Topic 至少 Scene 1/3/5 的 EN/ZH frozen screenshot；7 anchor 与 7 Signature 做全 Beat baseline。

### 10.2 约束优先级

- **H0 不可破坏**：事实、5 Scenes、EN/ZH 同构、Style DNA、阅读安全、reduced/frozen/thumbnail、与旧 97 / 新 48 不同题同论点。
- **H1 集合硬配额**：7×7 内容矩阵、21/21/7 specificity、28/14/7 fit、7/14/14/10/4 intensity、49 nav carrier/pair、49 primitive/family scores、7 Signature。
- **S 可由 Style Fit Veto 调整**：Visual Engine 数量范围、Motion Language 范围、相邻 Band 分散。例外必须记录 `constraint / invariant / harm_if_forced / swaps_attempted / accepted_deviation / reviewer`。
- 处理顺序：先换兼容 Style 的 Topic → 换 motion/nav/transition package → 在同一 Territory×Archetype 单元内换题 → 放宽 S → 若仍要改 H1，重新让用户确认。

## 11. 规划 Scorecard

| 检查 | 结果 |
|---|---|
| 49 Style assignments | PASS：49/49 |
| Territory | PASS：7 类各 7 |
| Archetype | PASS：7 类各 7 |
| Territory × Archetype | PASS：49 cells 各 1 |
| Specificity | PASS：21 Familiar / 21 Specific / 7 Wildcard |
| Fit | PASS：28 Direct / 14 Metaphor / 7 Contrast；每 Territory 1 Contrast |
| Viewing Mode | PASS：15 / 9 / 14 / 6 / 5 |
| Intensity | PASS：1×7 / 2×14 / 3×14 / 4×10 / 5×4 |
| Mode × Intensity | PASS：与 §7.1 完全一致 |
| Scene plan | PASS：245/245 有构图与局部动效；每 Topic 至少 1 quiet Scene，最多 2 peak |
| Visual Engine | PASS：12 类全覆盖；Emoji 与 cute SVG 各恰好 1；其余分布见 §3.2 |
| Primary Motion Language | PASS：12 类全覆盖，分布 `3/3/4/4/4/5/6/3/4/4/6/3`；任一主辅组合最多 2 次 |
| Navigation families | PASS：7 类各 7；49 carrier 唯一 |
| Invocation / Feedback | PASS：各 7 次；49 对组合唯一 |
| Primitive scores | PASS：49 条唯一 |
| Family scores | PASS：49 条唯一 |
| 21 primitives coverage | PASS：每种 2–20 次；总计 196 edges |
| Primitive counts | `hard-cut 18, crossfade 17, dip 10, push-x 13, push-y 10, diagonal 7, zoom 5, dolly 3, focus 20, linear 12, iris 17, blind 3, page 9, fold 4, ink 9, grid 10, split 12, carousel 2, glitch 2, scanline 5, afterimage 8` |
| Signature Effects | PASS：7 Territory 各 1 |
| Planned SVG/CSS hero | PASS：25，超过 14 下限 |
| Generic three-card + fade-up | PASS：0 个被规划为主构图 |
| Existing-neighbor review | PLAN PASS：49/49 已写最近旧 Topic 与差异；实现前仍需从 `STYLE_REGISTRY + getMetadata(en/zh)` 生成 97 项机器基线 |
| New-neighbor review | PLAN PASS：49/49 已写最近新 Topic 与差异；实现后以 screenshot/fingerprint 再复核 |
| Research briefs | PENDING：0/49；这是实现 Gate，不伪报通过 |
| Style Fit exceptions | 0；后续若出现按 §10.2 记录 |

## 12. 本轮交付边界

本文已成为施工 source of truth。实施按 §9 的施工并发与逻辑提交批次推进；所有 Topic、最终 multi-agent 验收、Vercel 生产部署与线上冒烟通过后才算完成。

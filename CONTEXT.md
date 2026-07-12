# Frontend Harness Slides Workbench Context

This glossary defines the shared runtime and curation language of the Workbench.

## Language

### Runtime

**Style（风格）**:
A stable visual system with one canonical identity, localized name, and Band. Topics reference it as their visual frame without redefining it.
_Avoid_: Slide, deck, version

**Topic（题材）**:
A unique, self-contained presentation with its own bilingual title that combines subject matter with a Style. It is independently addressable and does not belong to a model batch or version family.
_Avoid_: Slide, deck, version, variant, Topic Set member

**Topic ID（题材标识）**:
The globally unique, stable semantic identifier of one Topic. It is sufficient
to select the Topic in authoring tools and names the Topic's implementation,
focused test, optional CSS module, and showcase WebP. Moving the Topic between
Styles does not change its Topic ID; public Navigation State still addresses
the Topic with its Style and Topic ID.
_Avoid_: Style-local ID, generated suffix, ordinal, model-qualified ID

**Band（风格族）**:
A high-level visual family that groups related Styles. It classifies visual identity rather than subject matter.
_Avoid_: Content Territory

**Scene（场景）**:
A major narrative unit within a Topic. It contains a coherent part of the Topic's argument.

**Beat（节拍）**:
A meaningful story state within a Scene. It changes audience understanding rather than merely decorating a transition.

**Model ID（模型标识）**:
The canonical, exact provenance label that records which model authored a
Topic. An explicit Model ID registry defines allowed values; Topics must match
one exactly. It permits no aliases or normalization and is descriptive
metadata, not a collection identity or an authoring contract. Catalog filters
show only values used by the Topic Registry and order them by first Topic
appearance rather than by the Model ID registry.
_Avoid_: Version, batch, Topic Set, normalized alias

The corresponding public contract field is always `modelId`. The shorter
`model` field is not part of the domain vocabulary.

**Registry（注册表）**:
The canonical author-maintained two-dimensional collection of Topics. Its
outer arrays order Style Groups and each inner array orders Topics of exactly
one Style. It is the sole hand-edited source of Catalog Order; the Manifest,
runtime Registry, and Stage loading map derive from it without becoming part
of Topic identity.

**Publication Plan（发布计划）**:
The deterministic, model-neutral projection of the validated Topic Catalog
used by generated Manifest data, repository statistics, Topic-ID preview
targets, and browser audit cases. Capture and verification tools consume it;
they do not maintain their own Topic order or selection rules.
_Avoid_: Screenshot mapping, model batch plan, second Registry

**Catalog Order（目录顺序）**:
The sequence produced by ordered Style Groups and the ordered Topics inside each group. It controls Catalog presentation and sequential Player navigation but carries no identity or priority meaning.
_Avoid_: Version order, primary, secondary, rank, sequence field

**Workbench（工作台）**:
The interactive environment for discovering and presenting Topics. It comprises the Catalog and Player.

**Catalog（目录）**:
The Workbench surface for discovering Topics. It organizes Topic Cards by Style and exposes Filters.
_Avoid_: Overview View, gallery

**Player（播放器）**:
The Workbench surface for viewing a selected Topic. It frames the Stage with navigation and presentation controls.
_Avoid_: Lab View

**Player Runtime（播放器运行时）**:
The single presentation boundary that consumes Catalog access and semantic
Navigation State, then owns Stage loading and recovery, fixed-canvas fitting,
display modes, shared Evidence, announcements, rotate guidance, and Player
input arbitration. It emits Navigation Intents and never owns URL or History
policy.
_Avoid_: Lab View, Player router, Topic runtime

**Stage（舞台）**:
The bounded presentation canvas that displays a Topic. It preserves the Topic's visual composition as the focus of viewing.
_Avoid_: Page, browser viewport

**TopicStage（题材舞台组件）**:
The module-local React component that renders one Topic on the Stage. Every
Topic implementation uses this same internal component name; Topic identity
lives in its module basename and TopicDefinition rather than the component
symbol.
_Avoid_: Topic-named component, Style component, versioned component

**Envelope（外壳）**:
The single responsive Workbench interface surrounding the Stage. The
authoritative `src/envelope` family owns Catalog and Player chrome, global
controls, discovery overlays, help, focus management, and responsive shell
behavior without becoming Topic content. Pure removes its output while keeping
the active Stage mounted.
_Avoid_: Chrome module family, Layout shell, Header/Sidebar shell

**Topic Card（题材卡片）**:
The Catalog representation of a particular Topic. It presents a visual preview and the Topic's identifying information.
_Avoid_: Style card, version card

**Style Group（风格组）**:
A Catalog grouping of Topic Cards belonging to the same Style. It preserves the relationship between a Style and its Topics.

**Filter（筛选）**:
A Catalog criterion that narrows the visible Topics. It changes discovery context without changing Topic identity.
_Avoid_: Navigation

**Library Drawer（资料库抽屉）**:
An on-demand Player navigator for moving across Styles and Topics. It chooses global destinations rather than refining the Catalog.
_Avoid_: Persistent sidebar

**Topic Switcher（题材切换器）**:
A Player control for choosing among Topics within the current Style. It keeps local Topic selection distinct from global browsing.

**Command Palette（快速跳转面板）**:
A direct-navigation surface for finding a Topic by Style, Topic, or Model ID. It resolves a search to a destination rather than refining the Catalog.
_Avoid_: Filter, settings runner

**Player Transport（播放器控制条）**:
The Player controls that move through a Topic's Scenes and Beats. It expresses the Topic's ordered narrative progression.
_Avoid_: Internal Navigation

**Internal Navigation（内嵌导航）**:
Navigation rendered as part of a Topic's visual language. It remains distinct from the Envelope and Player Transport.

**Topic Navigation Profile（题材导航契约）**:
The source-owned record of an Internal Navigation's geometry, carrier,
invocation, and feedback. It keeps the rendered navigation and its semantic
contract aligned.

**Pure（纯净模式）**:
A display state that foregrounds the Stage by removing surrounding Workbench chrome. It retains the selected Topic and Navigation State.
_Avoid_: Fullscreen

**Frozen（冻结模式）**:
A display state that holds a Topic's current temporal state. It supports stable inspection without redefining the Topic.
_Avoid_: Reduced motion

**Hero Final Frame（Hero 最终帧）**:
The final Beat of a Topic's localized hero Scene. It is the stable frozen
capture and audit target for that language.

**Navigation State（导航状态）**:
The current view, selected Topic, presentation position, and display context of the Workbench. It is the unit represented by a Share Link.

**History（历史）**:
The ordered record of Navigation States reached by a viewer. It supports return to prior contexts.

**Catalog Return（目录返回）**:
The restoration of a prior Catalog context after leaving the Player. It lets discovery continue from the same context.

**Seamless Cycling（无缝循环）**:
Continuous Player progression from one Topic to another. It keeps narrative movement continuous across Topic boundaries.

**Share Link（分享链接）**:
A portable reference to a Navigation State. It opens the same selected context for another viewer.

### Topic protocols

**Evidence（证据边界）**:
The explicit declaration that a Topic has no external claim, presents an
illustrative scenario, makes source-backed factual claims, or mixes sourced
facts with illustrative material. Illustrative and mixed Evidence include the
localized boundary that prevents examples from being mistaken for measured
facts; factual and mixed Evidence own their Sources.

**Transition Score（转场乐谱）**:
The authored sequence of scene-to-scene transitions within a Topic. It gives narrative movement a deliberate rhythm.
_Avoid_: Global transition preset

# Frontend Harness Slides Workbench Context

This glossary defines the shared runtime and curation language of the Workbench.

## Language

### Runtime

**Style（风格）**:
A stable visual system with a distinct visual identity. It provides the visual frame for Topics.
_Avoid_: Slide, deck, version

**Topic（题材）**:
A self-contained presentation that combines subject matter with a Style. It is the independently addressable unit of the Workbench.
_Avoid_: Version, variant

**Band（风格族）**:
A high-level visual family that groups related Styles. It classifies visual identity rather than subject matter.
_Avoid_: Content Territory

**Scene（场景）**:
A major narrative unit within a Topic. It contains a coherent part of the Topic's argument.

**Beat（节拍）**:
A meaningful story state within a Scene. It changes audience understanding rather than merely decorating a transition.

**Model ID（模型标识）**:
A label that identifies the model associated with a Topic. It distinguishes Topics that share a Style.
_Avoid_: Version

**Registry（注册表）**:
The canonical ordered collection of Styles and their Topics. It supplies the shared vocabulary for finding and moving between Topics.

**Workbench（工作台）**:
The interactive environment for discovering and presenting Topics. It comprises the Catalog and Player.

**Catalog（目录）**:
The Workbench surface for discovering Topics. It organizes Topic Cards by Style and exposes Filters.
_Avoid_: Overview View, gallery

**Player（播放器）**:
The Workbench surface for viewing a selected Topic. It frames the Stage with navigation and presentation controls.
_Avoid_: Lab View

**Stage（舞台）**:
The bounded presentation canvas that displays a Topic. It preserves the Topic's visual composition as the focus of viewing.
_Avoid_: Page, browser viewport

**Envelope（外壳）**:
The Workbench interface surrounding the Stage. It holds global and Player controls without becoming Topic content.

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

### Curation

**Topic Set（Topic 套系）**:
A curated anthology of Topics conceived as a shared collection. It guides the distribution of subjects and expression across Styles.
_Avoid_: Version set, batch

**Topic Set Contract（Topic 套系契约）**:
The source-owned record that associates each Topic in a Topic Set with its
semantic identity, navigation profile, transition score, and claim evidence.
It is not a version or a separate assignment document.

**Evidence（证据边界）**:
The declaration that classifies Topic claims as source-backed facts or as an
illustrative scenario, including the localized boundary that prevents examples
from being mistaken for measured facts.

**Content Territory（内容疆域）**:
A subject-area partition that places a Topic within a Topic Set. It is independent of Style and Band.
_Avoid_: Band

**Narrative Archetype（叙事原型）**:
The story logic that organizes a Topic's Scenes. It is independent of Content Territory and Style.
_Avoid_: Layout template, transition preset

**Viewing Mode（观看模式）**:
The intended reading or viewing profile of a Topic. It guides density and readability rather than visual identity.
_Avoid_: Style category, Visual Engine

**Visual Engine（主视觉引擎）**:
The dominant visual medium or mechanism through which a Topic expresses its subject. It is independent of Viewing Mode and Intensity.
_Avoid_: Animation style

**Motion Language（动画语言）**:
The material-specific vocabulary for temporal change within a Topic. It describes how content reveals or transforms.
_Avoid_: Transition

**Intensity（运动强度）**:
The intended ceiling for a Topic's visual change. It represents an attention budget rather than speed or quality.
_Avoid_: Speed, spectacle score

**Navigation Language（导航语言）**:
The geometry and feedback character of a Topic's Internal Navigation. It is distinct from Player Transport.
_Avoid_: Navigation bar

**Transition Score（转场乐谱）**:
The authored sequence of scene-to-scene transitions within a Topic. It gives narrative movement a deliberate rhythm.
_Avoid_: Global transition preset

**Signature Effect（签名效果）**:
A rare bespoke visual change that embodies a Topic's visual metaphor. It is an accent rather than a general transition pattern.
_Avoid_: Decorative one-off effect

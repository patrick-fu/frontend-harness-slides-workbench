# Frontend Harness Slides Workbench

This glossary defines the shared language for discovering, presenting, and
authoring Topics in the Workbench.

## Presentation

**Style（风格）**:
A stable visual system with one canonical identity, localized name, and Band.
Topics use a Style without redefining it.
_Avoid_: Slide, deck, version

**Topic（题材）**:
A unique, self-contained presentation that combines subject matter with a
Style. A Topic is not a version, variant, batch member, or model collection.
_Avoid_: Slide, deck, version, variant, Topic Set member

**Topic ID（题材标识）**:
The globally unique and stable semantic identity of one Topic. Moving a Topic
to another Style does not change its Topic ID.
_Avoid_: Style-local ID, ordinal, model-qualified ID

**Band（风格族）**:
A high-level visual family that groups related Styles without classifying
subject matter.
_Avoid_: Content Territory

**Scene（场景）**:
A major narrative unit that advances one coherent part of a Topic's argument.

**Beat（节拍）**:
A meaningful story state within a Scene that changes audience understanding.

**Model ID（模型标识）**:
The exact provenance label for the model that authored a Topic. It describes
origin only and never defines identity, order, behavior, or a collection.
_Avoid_: Version, batch, Topic Set, model family

**Stage（舞台）**:
The bounded presentation canvas that preserves a Topic's visual composition.
_Avoid_: Page, browser viewport

## Discovery and presentation

**Workbench（工作台）**:
The environment for discovering Topics in the Catalog and presenting them in
the Player.

**Catalog（目录）**:
The discovery surface that organizes Topic Cards by Style and narrows them
with Filters.
_Avoid_: Overview View, gallery

**Player（播放器）**:
The presentation surface that frames one selected Topic with viewing and
navigation controls.
_Avoid_: Lab View

**Envelope（外壳）**:
The responsive Workbench interface surrounding the Stage. It belongs to the
Workbench rather than to any Topic.
_Avoid_: Topic chrome, persistent shell inside a Topic

**Topic Card（题材卡片）**:
The Catalog representation of one Topic, including its preview and identity.
_Avoid_: Style card, version card

**Style Group（风格组）**:
A Catalog grouping of Topics that share one Style.

**Registry（注册表）**:
The canonical ordered collection of Topics grouped by Style. It is the sole
source of Catalog Order.
_Avoid_: Model collection, batch list, second order table

**Catalog Order（目录顺序）**:
The sequence of Style Groups and their Topics. It controls presentation order
without carrying identity, priority, or version meaning.
_Avoid_: Version order, priority, primary, secondary

**Filter（筛选）**:
A Workbench criterion that narrows visible Topics in the Catalog and derives
the Player's Cycle Scope without changing Topic identity.
_Avoid_: Navigation

**Library Drawer（资料库抽屉）**:
An on-demand Player surface for moving across Styles and Topics.
_Avoid_: Persistent sidebar

**Topic Switcher（题材切换器）**:
A Player control for choosing another Topic within the current Style.

**Command Palette（快速跳转面板）**:
A direct-navigation surface for finding a destination by Style, Topic, or
Model ID.
_Avoid_: Filter, settings runner

**Player Transport（播放器控制条）**:
The Player controls that move through a Topic's Scenes and Beats.
_Avoid_: Internal Navigation

**Internal Navigation（内嵌导航）**:
Navigation that belongs to a Topic's visual language rather than the Player.

## Viewing state

**Pure（纯净模式）**:
A display state that removes the Envelope while retaining the selected Topic
and Stage.
_Avoid_: Fullscreen

**Frozen（冻结模式）**:
A display state that settles temporal behavior for stable inspection without
changing Topic identity or position.
_Avoid_: Reduced motion

**Hero Final Frame（Hero 最终帧）**:
The final Beat of a Topic's localized hero Scene and its stable capture target.

**Navigation State（导航状态）**:
The current Workbench surface, selected Topic, presentation position, filters,
language, and display state represented by a Share Link.

**History（历史）**:
The ordered record of Navigation States that supports returning to earlier
viewing contexts.

**Catalog Return（目录返回）**:
Restoration of a prior Catalog context after leaving the Player.

**Seamless Cycling（无缝循环）**:
Continuous Player progression between Topics at narrative boundaries.

**Cycle Scope（循环范围）**:
The Registry-ordered subset of Topics that Seamless Cycling may enter, derived
from active Filters. A directly selected Topic may remain visible outside the
Cycle Scope without becoming part of it.
_Avoid_: Playlist, Topic Set

**Cycle Scope Indicator（循环范围提示条）**:
A persistent Player control that summarizes active Filters and matching Topic
count, opens the Filter editor, and warns when the selected Topic is outside
the Cycle Scope. It is absent when no Filters are active.
_Avoid_: Toast, disclaimer

**Share Link（分享链接）**:
A portable URL that restores the same Navigation State for another viewer.

## Topic protocols

**Evidence（证据边界）**:
The declaration that a Topic has no external claim, uses an illustrative
scenario, presents sourced facts, or mixes sourced facts with illustration.

**Source（来源）**:
An authoritative reference that supports a factual claim made by a Topic.

**Transition Score（转场乐谱）**:
The authored sequence of Scene-to-Scene transitions within a Topic.
_Avoid_: Global transition preset

**Topic Navigation Profile（题材导航契约）**:
The description of an Internal Navigation's geometry, carrier, invocation,
and feedback.

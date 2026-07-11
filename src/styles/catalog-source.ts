import type { StyleRegistryEntry } from "../types";
import {
  buildStyleRegistryEntry,
  type StyleTopicModule,
} from "./topic";
import {
  hasCuratedTopicContract,
  withCuratedTopicContract,
} from "./curated-topic-contract";
import ExecutiveSilence01, {
  getMetadata as getMetadata01,
} from "./01-executive-silence";
import SwissPrecision02, {
  getMetadata as getMetadata02,
} from "./02-swiss-precision";
import ZenVoid03, {
  getMetadata as getMetadata03,
} from "./03-zen-void";
import AuroraGradient04, {
  getMetadata as getMetadata04,
} from "./04-aurora-gradient";
import Blueprint05, {
  getMetadata as getMetadata05,
} from "./05-blueprint";
import MonochromeStudy06, {
  getMetadata as getMetadata06,
} from "./06-monochrome-study";
import QuietConfidence07, {
  getMetadata as getMetadata07,
} from "./07-quiet-confidence";
import TerminalGlow08, {
  getMetadata as getMetadata08,
} from "./08-terminal-glow";
import { quietLaunchWindowTopic } from "./01-quiet-launch-window";
import { presolarGrainTopic } from "./01-presolar-grain";
import { metricsWithoutNoiseTopic } from "./02-metrics-without-noise";
import { bridgeMovementTopic } from "./objective-swiss-grid-bridge-movement";
import { repairAsStrategyTopic } from "./03-repair-as-strategy";
import { stoneToSoilTopic } from "./wabi-sabi-ceramic-stone-to-soil";
import { betterQuestionTopic } from "./04-better-question";
import { vocalFoldsTopic } from "./04-vocal-folds";
import { resilienceBlueprintTopic } from "./05-resilience-blueprint";
import { cometAnatomyTopic } from "./05-comet-anatomy";
import { oneConstraintWinsTopic } from "./06-one-constraint-wins";
import { humanLoopRetrofitTopic } from "./07-human-loop-retrofit";
import { beforeATopic } from "./06-before-a";
import { stadiumWaveTopic } from "./07-stadium-wave";
import { sentenceWeKeepTopic } from "./08-sentence-we-keep";
import { freediveTopic } from "./spotlight-quote-poster-freedive";
import ProcessFlow09, {
  getMetadata as getMetadata09,
} from "./09-process-flow";
import MatrixGrid10, {
  getMetadata as getMetadata10,
} from "./10-matrix-grid";
import TimelineSpiral11, {
  getMetadata as getMetadata11,
} from "./11-timeline-spiral";
import Iconography12, {
  getMetadata as getMetadata12,
} from "./12-iconography";
import StickyBoard13, {
  getMetadata as getMetadata13,
} from "./13-sticky-board";
import OrgChart14, {
  getMetadata as getMetadata14,
} from "./14-org-chart";
import Roadmap15, {
  getMetadata as getMetadata15,
} from "./15-roadmap";
import CaseStudy16, {
  getMetadata as getMetadata16,
} from "./16-case-study";
import { threeTracksReleaseTopic } from "./09-three-tracks-release";
import { teaChaRoutesTopic } from "./09-tea-cha-routes";
import { durableToolTopic } from "./10-durable-tool";
import { naturalClocksTopic } from "./benchmark-matrix-natural-clocks";
import { eventToInsightTopic } from "./11-event-to-insight";
import { districtHeatTopic } from "./signal-pipeline-flow-district-heat";
import { engineeringWhiteboardExplainerTopic } from "./engineering-whiteboard-explainer";
import { waterTowerTopic } from "./engineering-whiteboard-water-tower";
import { tcpCongestionControlTopic } from "./engineering-whiteboard-tcp";
import { onboardingThatBreathesTopic } from "./12-onboarding-that-breathes";
import { chrysalisRebuildTopic } from "./soft-pastel-friendly-chrysalis-rebuild";
import { rawNotesCleanBriefTopic } from "./13-raw-notes-clean-brief";
import { cocoaFermentationTopic } from "./kitchen-prep-station-cocoa-fermentation";
import { twoTeamsOneArtifactTopic } from "./14-two-teams-one-artifact";
import { elevatorCounterweightTopic } from "./collaborative-pairing-board-elevator-counterweight";
import { tuningOperatingModelTopic } from "./15-tuning-operating-model";
import { tidalTimeTopic } from "./studio-mixing-console-tidal-time";
import { incidentLearnsTopic } from "./16-incident-learns";
import { acousticCrackTopic } from "./debug-reaction-board-acoustic-crack";
import EditorialBroadsheet17, {
  getMetadata as getMetadata17,
} from "./17-editorial-broadsheet";
import LiteraryReview18, {
  getMetadata as getMetadata18,
} from "./18-literary-review";
import FinancialTimes19, {
  getMetadata as getMetadata19,
} from "./19-financial-times";
import NationalGeographic20, {
  getMetadata as getMetadata20,
} from "./20-national-geographic";
import VogueEditorial21, {
  getMetadata as getMetadata21,
} from "./21-vogue-editorial";
import AcademicJournal22, {
  getMetadata as getMetadata22,
} from "./22-academic-journal";
import ZineCulture23, {
  getMetadata as getMetadata23,
} from "./23-zine-culture";
import ManuscriptScroll24, {
  getMetadata as getMetadata24,
} from "./24-manuscript-scroll";
import { morningAfterLaunchTopic } from "./17-morning-after-launch";
import { rogueWaveTopic } from "./18-rogue-wave";
import { productGetsCoverTopic } from "./18-product-gets-cover";
import { mothExperimentTopic } from "./magazine-masthead-moth-experiment";
import { usefulWeekNotesTopic } from "./19-useful-week-notes";
import { oralToWrittenTopic } from "./warm-editorial-feature-oral-to-written";
import { argumentInMarginsTopic } from "./20-argument-in-margins";
import { hiddenTextTopic } from "./scholars-vellum-hidden-text";
import { publicLightProgramTopic } from "./21-public-light-program";
import { ironFromStarsTopic } from "./solar-biennale-poster-iron-from-stars";
import { fiveTakesRoomTopic } from "./22-five-takes-room";
import { danceNotationTopic } from "./duotone-session-dance-notation";
import { communityPrintsItselfTopic } from "./23-community-prints-itself";
import { archiveReassembledTopic } from "./24-archive-reassembled";
import { sevenBluesTopic } from "./riso-print-zine-seven-blues";
import { concealedObjectsTopic } from "./analog-cutout-collage-concealed-objects";
import WoodblockPrint25, {
  getMetadata as getMetadata25,
} from "./25-woodblock-print";
import ChineseInk26, {
  getMetadata as getMetadata26,
} from "./26-chinese-ink";
import ArtDeco27, {
  getMetadata as getMetadata27,
} from "./27-art-deco";
import BauhausPoster28, {
  getMetadata as getMetadata28,
} from "./28-bauhaus-poster";
import CelticKnot29, {
  getMetadata as getMetadata29,
} from "./29-celtic-knot";
import MexicanMural30, {
  getMetadata as getMetadata30,
} from "./30-mexican-mural";
import AfricanKente31, {
  getMetadata as getMetadata31,
} from "./31-african-kente";
import NordicRosemaling32, {
  getMetadata as getMetadata32,
} from "./32-nordic-rosemaling";
import { tideMapTeamTopic } from "./25-tide-map-team";
import { whistledLanguageTopic } from "./woodblock-floating-world-whistled-language";
import { growthSignalsTopic } from "./26-growth-signals";
import { leafStomataTopic } from "./27-leaf-stomata";
import { infrastructureGalaTopic } from "./27-infrastructure-gala";
import { reinforcedConcreteTopic } from "./machine-age-deco-reinforced-concrete";
import { fieldRouteSignalTopic } from "./28-field-route-signal";
import { saharanDustTopic } from "./expedition-screenprint-saharan-dust";
import { releaseMixtapeTopic } from "./29-release-mixtape";
import { iceCoreArchiveTopic } from "./cassette-era-packaging-ice-core-archive";
import { shippingHardThingTopic } from "./30-shipping-hard-thing";
import { sinkingDeltaTopic } from "./neo-brutalist-bulletin-sinking-delta";
import { moveOrgChartTopic } from "./31-move-org-chart";
import { pneumaticPostTopic } from "./red-wedge-agitprop-pneumatic-post";
import { prioritizeWithoutDebateTopic } from "./32-prioritize-without-debate";
import { snowflakeBranchesTopic } from "./33-snowflake-branches";
import GlassDashboard33, {
  getMetadata as getMetadata33,
} from "./33-glass-dashboard";
import RetroOs9534, {
  getMetadata as getMetadata34,
} from "./34-retro-os-95";
import NeonGrid35, {
  getMetadata as getMetadata35,
} from "./35-neon-grid";
import GlassMorph36, {
  getMetadata as getMetadata36,
} from "./36-glass-morph";
import TerminalUi37, {
  getMetadata as getMetadata37,
} from "./37-terminal-ui";
import FigmaCanvas38, {
  getMetadata as getMetadata38,
} from "./38-figma-canvas";
import NotionDoc39, {
  getMetadata as getMetadata39,
} from "./39-notion-doc";
import ParticleField40, {
  getMetadata as getMetadata40,
} from "./40-particle-field";
import { spatialProductBriefTopic } from "./33-spatial-product-brief";
import { safetyGlassTopic } from "./liquid-glass-safety-glass";
import { toolchainDesktopTopic } from "./34-toolchain-desktop";
import { voyagerBoundaryTopic } from "./35-voyager-boundary";
import { calmerGrowthModelTopic } from "./35-calmer-growth-model";
import { monarchMigrationTopic } from "./mid-century-grove-monarch-migration";
import { privateBetaSalonTopic } from "./36-private-beta-salon";
import { urushiCureTopic } from "./37-urushi-cure";
import { newHabitRunbookTopic } from "./37-new-habit-runbook";
import { escapementTopic } from "./38-escapement";
import { fiveActsSystemTopic } from "./38-five-acts-system";
import { whaleFallTopic } from "./39-whale-fall";
import { deriveShortcutTopic } from "./39-derive-shortcut";
import { hearingPathTopic } from "./40-hearing-path";
import { latencyBossFightTopic } from "./40-latency-boss-fight";
import { eggMimicryTopic } from "./arcade-boss-fight-egg-mimicry";
import AnnualReport41, {
  getMetadata as getMetadata41,
} from "./41-annual-report";
import LegalBrief42, {
  getMetadata as getMetadata42,
} from "./42-legal-brief";
import ResearchDigest43, {
  getMetadata as getMetadata43,
} from "./43-research-digest";
import MeetingMinutes44, {
  getMetadata as getMetadata44,
} from "./44-meeting-minutes";
import PolicyPaper45, {
  getMetadata as getMetadata45,
} from "./45-policy-paper";
import AuditReport46, {
  getMetadata as getMetadata46,
} from "./46-audit-report";
import WhitePaper47, {
  getMetadata as getMetadata47,
} from "./47-white-paper";
import ExecutiveSummary48, {
  getMetadata as getMetadata48,
} from "./48-executive-summary";
import { evidenceSmallerTeamTopic } from "./41-evidence-smaller-team";
import { impactEvidenceTopic } from "./42-impact-evidence";
import { chooseBoundaryTopic } from "./42-choose-boundary";
import { standardTimeTopic } from "./decision-record-standard-time";
import { readyAgentPickupTopic } from "./43-ready-agent-pickup";
import { ozoneHoleTopic } from "./maintainer-issue-brief-ozone-hole";
import { stationPlatformStudyTopic } from "./44-station-platform-study";
import { ancientSoundTopic } from "./field-notes-report-ancient-sound";
import { rewriteBrokenFlowTopic } from "./45-rewrite-broken-flow";
import { readingRosettaTopic } from "./annotated-source-diff-reading-rosetta";
import { launchGateLedgerTopic } from "./46-launch-gate-ledger";
import { pigmentWithoutTouchTopic } from "./checklist-ledger-pigment-without-touch";
import { handoffCompartmentsTopic } from "./47-handoff-compartments";
import { lichenPartnersTopic } from "./context-bento-box-lichen-partners";
import { recoveryKitTopic } from "./48-recovery-kit";
import { cocoonToClothTopic } from "./49-cocoon-to-cloth";

// ─── Curated Topic Set ──────────────────────────────────────────────────
import { lastFeatureCutTopic } from "./last-feature-cut";
import { objectiveSwissGridTopic } from "./anatomy-timetable";
import { beautyUnfinishedTopic } from "./beauty-unfinished";
import { rubberDuckTopic } from "./rubber-duck";
import { drawingABridgeTopic } from "./drawing-a-bridge";
import { shipItTopic } from "./ship-it";
import { sketchBoardEmojiTopic } from "./how-we-named-it";
import { onQuittingWellTopic } from "./on-quitting-well";
import { threeTeamsLaunchTopic } from "./three-teams-launch";
import { benchmarkMatrixTopic } from "./build-buy-borrow";
import { whereRequestGoesTopic } from "./where-request-goes";
import { firstWeekHereTopic } from "./first-week-here";
import { kitchenPrepStationTopic } from "./raw-logs-to-report";
import { humanReviewsAiTopic } from "./human-reviews-ai";
import { tuningTheModelTopic } from "./tuning-the-model";
import { safeToDeployTopic } from "./safe-to-deploy";
import { dayFeedStoppedTopic } from "./day-feed-stopped";
import { comebackIssueTopic } from "./comeback-issue";
import { letterToPastSelfTopic } from "./letter-to-past-self";
import { whatAncientsKnewTopic } from "./what-ancients-knew";
import { festivalSlowIdeasTopic } from "./festival-slow-ideas";
import { cutInOneTakeTopic } from "./cut-in-one-take";
import { makeSomethingWeeklyTopic } from "./make-something-weekly";
import { piecingIdeaTogetherTopic } from "./piecing-idea-together";
import { aRiversJourneyTopic } from "./a-rivers-journey";
import { anatomyOfAnIdeaTopic } from "./anatomy-of-an-idea";
import { grandUnveilingTopic } from "./grand-unveiling";
import { mappingUnknownGroundTopic } from "./mapping-unknown-ground";
import { greatestHitsVol1Topic } from "./greatest-hits-vol1";
import { readBeforeMergeTopic } from "./read-before-merge";
import { refactorTheSystemTopic } from "./refactor-the-system";
import { mechanicalScoringFunnelTopic } from "./triage-the-backlog";
import { LayersOfAProductTopic } from "./layers-of-a-product";
import { SetupExeTopic } from "./setup-exe";
import { GrowingSlowlyOnPurposeTopic } from "./growing-slowly-on-purpose";
import { TheMidnightReleaseTopic } from "./the-midnight-release";
import { RotateTheSecretsTopic } from "./rotate-the-secrets";
import { ChapterZeroTopic } from "./chapter-zero";
import { DerivingBigOTopic } from "./deriving-big-o";
import { DefeatingTechDebtTopic } from "./defeating-tech-debt";
import { WhyUsersChurnTopic } from "./why-users-churn";
import { WhyWeChoseMonorepoTopic } from "./why-we-chose-monorepo";
import { FlakyTestRootCauseTopic } from "./flaky-test-root-cause";
import { ShadowingSupportTopic } from "./shadowing-support";
import { KillingAGodObjectTopic } from "./killing-a-god-object";
import { CloseTheQuarterTopic } from "./close-the-quarter";
import { EverythingTheInternNeedsTopic } from "./everything-the-intern-needs";
import { OnboardingToolkitTopic } from "./onboarding-toolkit";

const buildEntry = (styleId: string, topics: StyleTopicModule[]) =>
  buildStyleRegistryEntry(
    styleId,
    topics.map((topic) =>
      hasCuratedTopicContract(styleId, topic.id)
        ? withCuratedTopicContract(styleId, topic)
        : topic,
    ),
  );

// ─── Registry ───────────────────────────────────────────────────────────────

/**
 * The authoritative registry of all Styles and their Topics.
 *
 * Registry order determines cross-style cycling order (D33: band-grouped).
 * Within each Style, topics are ordered by their index in the topics array.
 *
 * Navigation cycling: first style topic → next topic → next style topic → ...
 */
export const STYLE_CATALOG_SOURCE: StyleRegistryEntry[] = [
  // Minimal Keynote: 01-08
  buildEntry("minimal-product-keynote", [
    {
      id: "product-keynote",
      topic: { en: "Product Keynote", zh: "产品主题" },
      model: "Doubao-Seed-Evolving",
      component: ExecutiveSilence01,
      getMetadata: getMetadata01,
    },
    quietLaunchWindowTopic,
    presolarGrainTopic,
    lastFeatureCutTopic,
  ]),
  buildEntry("objective-swiss-grid", [
    {
      id: "swiss-grid",
      topic: { en: "Swiss Grid", zh: "瑞士网格" },
      model: "Doubao-Seed-Evolving",
      component: SwissPrecision02,
      getMetadata: getMetadata02,
    },
    metricsWithoutNoiseTopic,
    bridgeMovementTopic,
    objectiveSwissGridTopic,
  ]),
  buildEntry("wabi-sabi-ceramic", [
    {
      id: "ceramic-calm",
      topic: { en: "Ceramic Calm", zh: "陶器静场" },
      model: "Doubao-Seed-Evolving",
      component: ZenVoid03,
      getMetadata: getMetadata03,
    },
    repairAsStrategyTopic,
    stoneToSoilTopic,
    beautyUnfinishedTopic,
  ]),
  buildEntry("interactive-dialogue-stage", [
    {
      id: "dialogue-stage",
      topic: { en: "Dialogue Stage", zh: "对话舞台" },
      model: "Doubao-Seed-Evolving",
      component: AuroraGradient04,
      getMetadata: getMetadata04,
    },
    betterQuestionTopic,
    vocalFoldsTopic,
    rubberDuckTopic,
  ]),
  buildEntry("cyanotype-drafting-table", [
    {
      id: "blueprint",
      topic: { en: "Blueprint", zh: "蓝图" },
      model: "Doubao-Seed-Evolving",
      component: Blueprint05,
      getMetadata: getMetadata05,
    },
    resilienceBlueprintTopic,
    cometAnatomyTopic,
    drawingABridgeTopic,
  ]),
  buildEntry("kinetic-type-punchline", [
    {
      id: "type-poster",
      topic: { en: "Type Poster", zh: "字体海报" },
      model: "Doubao-Seed-Evolving",
      component: MonochromeStudy06,
      getMetadata: getMetadata06,
    },
    oneConstraintWinsTopic,
    beforeATopic,
    shipItTopic,
  ]),
  buildEntry("sketch-board-emoji", [
    {
      id: "workshop-board",
      topic: { en: "Workshop Board", zh: "工作坊" },
      model: "Doubao-Seed-Evolving",
      component: QuietConfidence07,
      getMetadata: getMetadata07,
    },
    humanLoopRetrofitTopic,
    stadiumWaveTopic,
    sketchBoardEmojiTopic,
  ]),
  buildEntry("spotlight-quote-poster", [
    {
      id: "quote-poster",
      topic: { en: "Quote Poster", zh: "引言海报" },
      model: "Doubao-Seed-Evolving",
      component: TerminalGlow08,
      getMetadata: getMetadata08,
    },
    sentenceWeKeepTopic,
    freediveTopic,
    onQuittingWellTopic,
  ]),
  // Balanced Hybrid: 09-16
  buildEntry("subway-map-of-intent", [
    {
      id: "subway-flow",
      topic: { en: "Subway Flow", zh: "地铁流程" },
      model: "Doubao-Seed-Evolving",
      component: ProcessFlow09,
      getMetadata: getMetadata09,
    },
    threeTracksReleaseTopic,
    teaChaRoutesTopic,
    threeTeamsLaunchTopic,
  ]),
  buildEntry("benchmark-matrix", [
    {
      id: "benchmark",
      topic: { en: "Benchmark", zh: "基准评估" },
      model: "Doubao-Seed-Evolving",
      component: MatrixGrid10,
      getMetadata: getMetadata10,
    },
    durableToolTopic,
    naturalClocksTopic,
    benchmarkMatrixTopic,
  ]),
  buildEntry("signal-pipeline-flow", [
    {
      id: "pipeline",
      topic: { en: "Pipeline", zh: "管道流程" },
      model: "Doubao-Seed-Evolving",
      component: TimelineSpiral11,
      getMetadata: getMetadata11,
    },
    eventToInsightTopic,
    districtHeatTopic,
    whereRequestGoesTopic,
  ]),
  buildEntry("engineering-whiteboard-explainer", [
    engineeringWhiteboardExplainerTopic,
    waterTowerTopic,
    tcpCongestionControlTopic,
  ]),
  buildEntry("soft-pastel-friendly", [
    {
      id: "friendly-onboard",
      topic: { en: "Friendly Onboard", zh: "友好入门" },
      model: "Doubao-Seed-Evolving",
      component: Iconography12,
      getMetadata: getMetadata12,
    },
    onboardingThatBreathesTopic,
    chrysalisRebuildTopic,
    firstWeekHereTopic,
  ]),
  buildEntry("kitchen-prep-station", [
    {
      id: "prep-station",
      topic: { en: "Prep Station", zh: "备料台" },
      model: "Doubao-Seed-Evolving",
      component: StickyBoard13,
      getMetadata: getMetadata13,
    },
    rawNotesCleanBriefTopic,
    cocoaFermentationTopic,
    kitchenPrepStationTopic,
  ]),
  buildEntry("collaborative-pairing-board", [
    {
      id: "pairing-board",
      topic: { en: "Pairing Board", zh: "配对板" },
      model: "Doubao-Seed-Evolving",
      component: OrgChart14,
      getMetadata: getMetadata14,
    },
    twoTeamsOneArtifactTopic,
    elevatorCounterweightTopic,
    humanReviewsAiTopic,
  ]),
  buildEntry("studio-mixing-console", [
    {
      id: "mixing-console",
      topic: { en: "Mixing Console", zh: "混音台" },
      model: "Doubao-Seed-Evolving",
      component: Roadmap15,
      getMetadata: getMetadata15,
    },
    tuningOperatingModelTopic,
    tidalTimeTopic,
    tuningTheModelTopic,
  ]),
  buildEntry("debug-reaction-board", [
    {
      id: "debug-board",
      topic: { en: "Debug Board", zh: "调试面板" },
      model: "Doubao-Seed-Evolving",
      component: CaseStudy16,
      getMetadata: getMetadata16,
    },
    incidentLearnsTopic,
    acousticCrackTopic,
    safeToDeployTopic,
  ]),
  // Editorial & Print: 17-24
  buildEntry("front-page-broadsheet", [
    {
      id: "broadsheet",
      topic: { en: "Broadsheet", zh: "大报头版" },
      model: "Doubao-Seed-Evolving",
      component: EditorialBroadsheet17,
      getMetadata: getMetadata17,
    },
    morningAfterLaunchTopic,
    rogueWaveTopic,
    dayFeedStoppedTopic,
  ]),
  buildEntry("magazine-masthead", [
    {
      id: "masthead",
      topic: { en: "Masthead", zh: "杂志刊头" },
      model: "Doubao-Seed-Evolving",
      component: LiteraryReview18,
      getMetadata: getMetadata18,
    },
    productGetsCoverTopic,
    mothExperimentTopic,
    comebackIssueTopic,
  ]),
  buildEntry("warm-editorial-feature", [
    {
      id: "editorial-feature",
      topic: { en: "Editorial Feature", zh: "专题特稿" },
      model: "Doubao-Seed-Evolving",
      component: FinancialTimes19,
      getMetadata: getMetadata19,
    },
    usefulWeekNotesTopic,
    oralToWrittenTopic,
    letterToPastSelfTopic,
  ]),
  buildEntry("scholars-vellum", [
    {
      id: "scholar-notes",
      topic: { en: "Scholar Notes", zh: "学者笔记" },
      model: "Doubao-Seed-Evolving",
      component: NationalGeographic20,
      getMetadata: getMetadata20,
    },
    argumentInMarginsTopic,
    hiddenTextTopic,
    whatAncientsKnewTopic,
  ]),
  buildEntry("solar-biennale-poster", [
    {
      id: "biennale-poster",
      topic: { en: "Biennale Poster", zh: "双年展" },
      model: "Doubao-Seed-Evolving",
      component: VogueEditorial21,
      getMetadata: getMetadata21,
    },
    publicLightProgramTopic,
    ironFromStarsTopic,
    festivalSlowIdeasTopic,
  ]),
  buildEntry("duotone-session", [
    {
      id: "session-poster",
      topic: { en: "Session Poster", zh: "录制海报" },
      model: "Doubao-Seed-Evolving",
      component: AcademicJournal22,
      getMetadata: getMetadata22,
    },
    fiveTakesRoomTopic,
    danceNotationTopic,
    cutInOneTakeTopic,
  ]),
  buildEntry("riso-print-zine", [
    {
      id: "riso-zine",
      topic: { en: "Riso Zine", zh: "孔版杂志" },
      model: "Doubao-Seed-Evolving",
      component: ZineCulture23,
      getMetadata: getMetadata23,
    },
    communityPrintsItselfTopic,
    sevenBluesTopic,
    makeSomethingWeeklyTopic,
  ]),
  buildEntry("analog-cutout-collage", [
    {
      id: "cutout-collage",
      topic: { en: "Cutout Collage", zh: "剪纸拼贴" },
      model: "Doubao-Seed-Evolving",
      component: ManuscriptScroll24,
      getMetadata: getMetadata24,
    },
    archiveReassembledTopic,
    concealedObjectsTopic,
    piecingIdeaTogetherTopic,
  ]),
  // Craft & Cultural Traditions: 25-32
  buildEntry("woodblock-floating-world", [
    {
      id: "woodblock",
      topic: { en: "Woodblock", zh: "木版画" },
      model: "Doubao-Seed-Evolving",
      component: WoodblockPrint25,
      getMetadata: getMetadata25,
    },
    tideMapTeamTopic,
    whistledLanguageTopic,
    aRiversJourneyTopic,
  ]),
  buildEntry("botanical-specimen-plate", [
    {
      id: "specimen-plate",
      topic: { en: "Specimen Plate", zh: "标本板" },
      model: "Doubao-Seed-Evolving",
      component: ChineseInk26,
      getMetadata: getMetadata26,
    },
    growthSignalsTopic,
    leafStomataTopic,
    anatomyOfAnIdeaTopic,
  ]),
  buildEntry("machine-age-deco", [
    {
      id: "deco-gala",
      topic: { en: "Deco Gala", zh: "装饰仪式" },
      model: "Doubao-Seed-Evolving",
      component: ArtDeco27,
      getMetadata: getMetadata27,
    },
    infrastructureGalaTopic,
    reinforcedConcreteTopic,
    grandUnveilingTopic,
  ]),
  buildEntry("expedition-screenprint", [
    {
      id: "expedition-print",
      topic: { en: "Expedition Print", zh: "探险海报" },
      model: "Doubao-Seed-Evolving",
      component: BauhausPoster28,
      getMetadata: getMetadata28,
    },
    fieldRouteSignalTopic,
    saharanDustTopic,
    mappingUnknownGroundTopic,
  ]),
  buildEntry("cassette-era-packaging", [
    {
      id: "cassette-pack",
      topic: { en: "Cassette Pack", zh: "卡带包装" },
      model: "Doubao-Seed-Evolving",
      component: CelticKnot29,
      getMetadata: getMetadata29,
    },
    releaseMixtapeTopic,
    iceCoreArchiveTopic,
    greatestHitsVol1Topic,
  ]),
  buildEntry("neo-brutalist-bulletin", [
    {
      id: "brutalist-bulletin",
      topic: { en: "Brutalist Bulletin", zh: "粗野公告" },
      model: "Doubao-Seed-Evolving",
      component: MexicanMural30,
      getMetadata: getMetadata30,
    },
    shippingHardThingTopic,
    sinkingDeltaTopic,
    readBeforeMergeTopic,
  ]),
  buildEntry("red-wedge-agitprop", [
    {
      id: "red-wedge",
      topic: { en: "Red Wedge", zh: "红楔海报" },
      model: "Doubao-Seed-Evolving",
      component: AfricanKente31,
      getMetadata: getMetadata31,
    },
    moveOrgChartTopic,
    pneumaticPostTopic,
    refactorTheSystemTopic,
  ]),
  buildEntry("mechanical-scoring-funnel", [
    {
      id: "scoring-funnel",
      topic: { en: "Scoring Funnel", zh: "评分漏斗" },
      model: "Doubao-Seed-Evolving",
      component: NordicRosemaling32,
      getMetadata: getMetadata32,
    },
    prioritizeWithoutDebateTopic,
    snowflakeBranchesTopic,
    mechanicalScoringFunnelTopic,
  ]),
  // Contemporary Digital: 33-40
  buildEntry("liquid-glass", [
    {
      id: "liquid-glass",
      topic: { en: "Liquid Glass", zh: "液态玻璃" },
      model: "Doubao-Seed-Evolving",
      component: GlassDashboard33,
      getMetadata: getMetadata33,
    },
    spatialProductBriefTopic,
    safetyGlassTopic,
    LayersOfAProductTopic,
  ]),
  buildEntry("retro-windows", [
    {
      id: "retro-desktop",
      topic: { en: "Retro Desktop", zh: "复古桌面" },
      model: "Doubao-Seed-Evolving",
      component: RetroOs9534,
      getMetadata: getMetadata34,
    },
    toolchainDesktopTopic,
    voyagerBoundaryTopic,
    SetupExeTopic,
  ]),
  buildEntry("mid-century-grove", [
    {
      id: "botanical-brand",
      topic: { en: "Botanical Brand", zh: "植物品牌" },
      model: "Doubao-Seed-Evolving",
      component: NeonGrid35,
      getMetadata: getMetadata35,
    },
    calmerGrowthModelTopic,
    monarchMigrationTopic,
    GrowingSlowlyOnPurposeTopic,
  ]),
  buildEntry("after-hours-luxe", [
    {
      id: "after-hours",
      topic: { en: "Luxe Reveal", zh: "奢华揭幕" },
      model: "Doubao-Seed-Evolving",
      component: GlassMorph36,
      getMetadata: getMetadata36,
    },
    privateBetaSalonTopic,
    urushiCureTopic,
    TheMidnightReleaseTopic,
  ]),
  buildEntry("operating-manual", [
    {
      id: "manual",
      topic: { en: "Runbook Manual", zh: "运行手册" },
      model: "Doubao-Seed-Evolving",
      component: TerminalUi37,
      getMetadata: getMetadata37,
    },
    newHabitRunbookTopic,
    escapementTopic,
    RotateTheSecretsTopic,
  ]),
  buildEntry("widescreen-title-card", [
    {
      id: "title-card",
      topic: { en: "Title Card", zh: "宽屏片头" },
      model: "Doubao-Seed-Evolving",
      component: FigmaCanvas38,
      getMetadata: getMetadata38,
    },
    fiveActsSystemTopic,
    whaleFallTopic,
    ChapterZeroTopic,
  ]),
  buildEntry("blackboard-chalk-talk", [
    {
      id: "chalk-talk",
      topic: { en: "Chalk Talk", zh: "粉笔推导" },
      model: "Doubao-Seed-Evolving",
      component: NotionDoc39,
      getMetadata: getMetadata39,
    },
    deriveShortcutTopic,
    hearingPathTopic,
    DerivingBigOTopic,
  ]),
  buildEntry("arcade-boss-fight", [
    {
      id: "boss-fight",
      topic: { en: "Boss Fight", zh: "Boss 战" },
      model: "Doubao-Seed-Evolving",
      component: ParticleField40,
      getMetadata: getMetadata40,
    },
    latencyBossFightTopic,
    eggMimicryTopic,
    DefeatingTechDebtTopic,
  ]),
  // Text Report: 41-48
  buildEntry("research-memo", [
    {
      id: "research-memo",
      topic: { en: "Research Memo", zh: "研究备忘" },
      model: "Doubao-Seed-Evolving",
      component: AnnualReport41,
      getMetadata: getMetadata41,
    },
    evidenceSmallerTeamTopic,
    impactEvidenceTopic,
    WhyUsersChurnTopic,
  ]),
  buildEntry("decision-record", [
    {
      id: "decision-record",
      topic: { en: "Decision Record", zh: "决策记录" },
      model: "Doubao-Seed-Evolving",
      component: LegalBrief42,
      getMetadata: getMetadata42,
    },
    chooseBoundaryTopic,
    standardTimeTopic,
    WhyWeChoseMonorepoTopic,
  ]),
  buildEntry("maintainer-issue-brief", [
    {
      id: "issue-brief",
      topic: { en: "Issue Brief", zh: "问题简报" },
      model: "Doubao-Seed-Evolving",
      component: ResearchDigest43,
      getMetadata: getMetadata43,
    },
    readyAgentPickupTopic,
    ozoneHoleTopic,
    FlakyTestRootCauseTopic,
  ]),
  buildEntry("field-notes-report", [
    {
      id: "field-notes",
      topic: { en: "Field Notes", zh: "田野笔记" },
      model: "Doubao-Seed-Evolving",
      component: MeetingMinutes44,
      getMetadata: getMetadata44,
    },
    stationPlatformStudyTopic,
    ancientSoundTopic,
    ShadowingSupportTopic,
  ]),
  buildEntry("annotated-source-diff", [
    {
      id: "source-diff",
      topic: { en: "Source Diff", zh: "源码差异" },
      model: "Doubao-Seed-Evolving",
      component: PolicyPaper45,
      getMetadata: getMetadata45,
    },
    rewriteBrokenFlowTopic,
    readingRosettaTopic,
    KillingAGodObjectTopic,
  ]),
  buildEntry("checklist-ledger", [
    {
      id: "checklist-ledger",
      topic: { en: "Checklist", zh: "检查清单" },
      model: "Doubao-Seed-Evolving",
      component: AuditReport46,
      getMetadata: getMetadata46,
    },
    launchGateLedgerTopic,
    pigmentWithoutTouchTopic,
    CloseTheQuarterTopic,
  ]),
  buildEntry("context-bento-box", [
    {
      id: "context-bento",
      topic: { en: "Context Bento", zh: "上下文盒" },
      model: "Doubao-Seed-Evolving",
      component: WhitePaper47,
      getMetadata: getMetadata47,
    },
    handoffCompartmentsTopic,
    lichenPartnersTopic,
    EverythingTheInternNeedsTopic,
  ]),
  buildEntry("object-metaphor-hero", [
    {
      id: "object-metaphor",
      topic: { en: "Object Hero", zh: "物体主视觉" },
      model: "Doubao-Seed-Evolving",
      component: ExecutiveSummary48,
      getMetadata: getMetadata48,
    },
    recoveryKitTopic,
    cocoonToClothTopic,
    OnboardingToolkitTopic,
  ]),
];

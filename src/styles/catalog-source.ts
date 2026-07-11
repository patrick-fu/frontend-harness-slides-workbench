import type { StyleRegistryEntry } from "../types";
import {
  buildStyleRegistryEntry,
  type StyleTopicModule,
} from "./topic";
import {
  hasCuratedTopicContract,
  withCuratedTopicContract,
} from "./curated-topic-contract";
import { toMigratingStyleTopic } from "../catalog/topic-migration-adapter";
import productKeynoteDefinition from "../topics/product-keynote";
import quietLaunchDefinition from "../topics/quiet-launch";
import presolarGrainDefinition from "../topics/presolar-grain";
import lastFeatureCutDefinition from "../topics/last-feature-cut";
import swissGridDefinition from "../topics/swiss-grid";
import cleanMetricsDefinition from "../topics/clean-metrics";
import bridgeMovementDefinition from "../topics/bridge-movement";
import anatomyTimetableDefinition from "../topics/anatomy-timetable";
import ceramicCalmDefinition from "../topics/ceramic-calm";
import repairStrategyDefinition from "../topics/repair-strategy";
import stoneToSoilDefinition from "../topics/stone-to-soil";
import beautyUnfinishedDefinition from "../topics/beauty-unfinished";
import dialogueStageDefinition from "../topics/dialogue-stage";
import betterQuestionDefinition from "../topics/better-question";
import vocalFoldsDefinition from "../topics/vocal-folds";
import rubberDuckDefinition from "../topics/rubber-duck";
import blueprintDefinition from "../topics/blueprint";
import resiliencePlanDefinition from "../topics/resilience-plan";
import cometAnatomyDefinition from "../topics/comet-anatomy";
import drawingABridgeDefinition from "../topics/drawing-a-bridge";
import typePosterDefinition from "../topics/type-poster";
import oneConstraintDefinition from "../topics/one-constraint";
import beforeADefinition from "../topics/before-a";
import shipItDefinition from "../topics/ship-it";
import workshopBoardDefinition from "../topics/workshop-board";
import humanLoopDefinition from "../topics/human-loop";
import stadiumWaveDefinition from "../topics/stadium-wave";
import howWeNamedItDefinition from "../topics/how-we-named-it";
import quotePosterDefinition from "../topics/quote-poster";
import keptSentenceDefinition from "../topics/kept-sentence";
import freediveDefinition from "../topics/freedive";
import onQuittingWellDefinition from "../topics/on-quitting-well";
import subwayFlowDefinition from "../topics/subway-flow";
import releaseTracksDefinition from "../topics/release-tracks";
import teaChaRoutesDefinition from "../topics/tea-cha-routes";
import threeTeamsLaunchDefinition from "../topics/three-teams-launch";
import benchmarkDefinition from "../topics/benchmark";
import durableToolDefinition from "../topics/durable-tool";
import naturalClocksDefinition from "../topics/natural-clocks";
import buildBuyBorrowDefinition from "../topics/build-buy-borrow";
import pipelineDefinition from "../topics/pipeline";
import eventInsightDefinition from "../topics/event-insight";
import districtHeatDefinition from "../topics/district-heat";
import whereRequestGoesDefinition from "../topics/where-request-goes";
import fromPromptToPatchDefinition from "../topics/from-prompt-to-patch";
import waterTowerDefinition from "../topics/water-tower";
import friendlyOnboardDefinition from "../topics/friendly-onboard";
import breathingOnboardDefinition from "../topics/breathing-onboard";
import chrysalisRebuildDefinition from "../topics/chrysalis-rebuild";
import firstWeekHereDefinition from "../topics/first-week-here";
import prepStationDefinition from "../topics/prep-station";
import cleanBriefDefinition from "../topics/clean-brief";
import cocoaFermentationDefinition from "../topics/cocoa-fermentation";
import rawLogsToReportDefinition from "../topics/raw-logs-to-report";
import pairingBoardDefinition from "../topics/pairing-board";
import sharedArtifactDefinition from "../topics/shared-artifact";
import elevatorCounterweightDefinition from "../topics/elevator-counterweight";
import humanReviewsAiDefinition from "../topics/human-reviews-ai";
import mixingConsoleDefinition from "../topics/mixing-console";
import operatingModelDefinition from "../topics/operating-model";
import tidalTimeDefinition from "../topics/tidal-time";
import tuningTheModelDefinition from "../topics/tuning-the-model";
import debugBoardDefinition from "../topics/debug-board";
import learningIncidentDefinition from "../topics/learning-incident";
import acousticCrackDefinition from "../topics/acoustic-crack";
import safeToDeployDefinition from "../topics/safe-to-deploy";
import broadsheetDefinition from "../topics/broadsheet";
import afterLaunchDefinition from "../topics/after-launch";
import rogueWaveDefinition from "../topics/rogue-wave";
import dayFeedStoppedDefinition from "../topics/day-feed-stopped";
import mastheadDefinition from "../topics/masthead";
import productCoverDefinition from "../topics/product-cover";
import mothExperimentDefinition from "../topics/moth-experiment";
import comebackIssueDefinition from "../topics/comeback-issue";
import editorialFeatureDefinition from "../topics/editorial-feature";
import usefulWeekDefinition from "../topics/useful-week";
import oralToWrittenDefinition from "../topics/oral-to-written";
import letterToPastSelfDefinition from "../topics/letter-to-past-self";
import scholarNotesDefinition from "../topics/scholar-notes";
import marginArgumentDefinition from "../topics/margin-argument";
import hiddenTextDefinition from "../topics/hidden-text";
import whatAncientsKnewDefinition from "../topics/what-ancients-knew";
import biennalePosterDefinition from "../topics/biennale-poster";
import publicLightDefinition from "../topics/public-light";
import ironFromStarsDefinition from "../topics/iron-from-stars";
import festivalSlowIdeasDefinition from "../topics/festival-slow-ideas";
import sessionPosterDefinition from "../topics/session-poster";
import fiveTakesDefinition from "../topics/five-takes";
import danceNotationDefinition from "../topics/dance-notation";
import cutInOneTakeDefinition from "../topics/cut-in-one-take";
import risoZineDefinition from "../topics/riso-zine";
import communityPrintDefinition from "../topics/community-print";
import sevenBluesDefinition from "../topics/seven-blues";
import makeSomethingWeeklyDefinition from "../topics/make-something-weekly";
import cutoutCollageDefinition from "../topics/cutout-collage";
import rebuiltArchiveDefinition from "../topics/rebuilt-archive";
import concealedObjectsDefinition from "../topics/concealed-objects";
import piecingIdeaTogetherDefinition from "../topics/piecing-idea-together";
import woodblockDefinition from "../topics/woodblock";
import tideMapDefinition from "../topics/tide-map";
import whistledLanguageDefinition from "../topics/whistled-language";
import aRiversJourneyDefinition from "../topics/a-rivers-journey";
import specimenPlateDefinition from "../topics/specimen-plate";
import growthSignalsDefinition from "../topics/growth-signals";
import leafStomataDefinition from "../topics/leaf-stomata";
import anatomyOfAnIdeaDefinition from "../topics/anatomy-of-an-idea";
import decoGalaDefinition from "../topics/deco-gala";
import infrastructureGalaDefinition from "../topics/infrastructure-gala";
import reinforcedConcreteDefinition from "../topics/reinforced-concrete";
import grandUnveilingDefinition from "../topics/grand-unveiling";
import expeditionPrintDefinition from "../topics/expedition-print";
import fieldRouteDefinition from "../topics/field-route";
import saharanDustDefinition from "../topics/saharan-dust";
import mappingUnknownGroundDefinition from "../topics/mapping-unknown-ground";
import cassettePackDefinition from "../topics/cassette-pack";
import releaseMixtapeDefinition from "../topics/release-mixtape";
import iceCoreArchiveDefinition from "../topics/ice-core-archive";
import greatestHitsVol1Definition from "../topics/greatest-hits-vol1";
import brutalistBulletinDefinition from "../topics/brutalist-bulletin";
import hardThingDefinition from "../topics/hard-thing";
import sinkingDeltaDefinition from "../topics/sinking-delta";
import readBeforeMergeDefinition from "../topics/read-before-merge";
import redWedgeDefinition from "../topics/red-wedge";
import orgMoveDefinition from "../topics/org-move";
import pneumaticPostDefinition from "../topics/pneumatic-post";
import refactorTheSystemDefinition from "../topics/refactor-the-system";
import scoringFunnelDefinition from "../topics/scoring-funnel";
import priorityScoreDefinition from "../topics/priority-score";
import snowflakeBranchesDefinition from "../topics/snowflake-branches";
import triageTheBacklogDefinition from "../topics/triage-the-backlog";
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
  buildEntry(
    "minimal-product-keynote",
    [
      productKeynoteDefinition,
      quietLaunchDefinition,
      presolarGrainDefinition,
      lastFeatureCutDefinition,
    ].map(toMigratingStyleTopic),
  ),
  buildEntry(
    "objective-swiss-grid",
    [
      swissGridDefinition,
      cleanMetricsDefinition,
      bridgeMovementDefinition,
      anatomyTimetableDefinition,
    ].map(toMigratingStyleTopic),
  ),
  buildEntry(
    "wabi-sabi-ceramic",
    [
      ceramicCalmDefinition,
      repairStrategyDefinition,
      stoneToSoilDefinition,
      beautyUnfinishedDefinition,
    ].map(toMigratingStyleTopic),
  ),
  buildEntry(
    "interactive-dialogue-stage",
    [
      dialogueStageDefinition,
      betterQuestionDefinition,
      vocalFoldsDefinition,
      rubberDuckDefinition,
    ].map(toMigratingStyleTopic),
  ),
  buildEntry(
    "cyanotype-drafting-table",
    [
      blueprintDefinition,
      resiliencePlanDefinition,
      cometAnatomyDefinition,
      drawingABridgeDefinition,
    ].map(toMigratingStyleTopic),
  ),
  buildEntry(
    "kinetic-type-punchline",
    [
      typePosterDefinition,
      oneConstraintDefinition,
      beforeADefinition,
      shipItDefinition,
    ].map(toMigratingStyleTopic),
  ),
  buildEntry(
    "sketch-board-emoji",
    [
      workshopBoardDefinition,
      humanLoopDefinition,
      stadiumWaveDefinition,
      howWeNamedItDefinition,
    ].map(toMigratingStyleTopic),
  ),
  buildEntry(
    "spotlight-quote-poster",
    [
      quotePosterDefinition,
      keptSentenceDefinition,
      freediveDefinition,
      onQuittingWellDefinition,
    ].map(toMigratingStyleTopic),
  ),
  // Balanced Hybrid: 09-16
  buildEntry(
    "subway-map-of-intent",
    [
      subwayFlowDefinition,
      releaseTracksDefinition,
      teaChaRoutesDefinition,
      threeTeamsLaunchDefinition,
    ].map(toMigratingStyleTopic),
  ),
  buildEntry(
    "benchmark-matrix",
    [
      benchmarkDefinition,
      durableToolDefinition,
      naturalClocksDefinition,
      buildBuyBorrowDefinition,
    ].map(toMigratingStyleTopic),
  ),
  buildEntry(
    "signal-pipeline-flow",
    [
      pipelineDefinition,
      eventInsightDefinition,
      districtHeatDefinition,
      whereRequestGoesDefinition,
    ].map(toMigratingStyleTopic),
  ),
  buildEntry(
    "engineering-whiteboard-explainer",
    [fromPromptToPatchDefinition, waterTowerDefinition].map(
      toMigratingStyleTopic,
    ),
  ),
  buildEntry(
    "soft-pastel-friendly",
    [
      friendlyOnboardDefinition,
      breathingOnboardDefinition,
      chrysalisRebuildDefinition,
      firstWeekHereDefinition,
    ].map(toMigratingStyleTopic),
  ),
  buildEntry(
    "kitchen-prep-station",
    [
      prepStationDefinition,
      cleanBriefDefinition,
      cocoaFermentationDefinition,
      rawLogsToReportDefinition,
    ].map(toMigratingStyleTopic),
  ),
  buildEntry(
    "collaborative-pairing-board",
    [
      pairingBoardDefinition,
      sharedArtifactDefinition,
      elevatorCounterweightDefinition,
      humanReviewsAiDefinition,
    ].map(toMigratingStyleTopic),
  ),
  buildEntry(
    "studio-mixing-console",
    [
      mixingConsoleDefinition,
      operatingModelDefinition,
      tidalTimeDefinition,
      tuningTheModelDefinition,
    ].map(toMigratingStyleTopic),
  ),
  buildEntry(
    "debug-reaction-board",
    [
      debugBoardDefinition,
      learningIncidentDefinition,
      acousticCrackDefinition,
      safeToDeployDefinition,
    ].map(toMigratingStyleTopic),
  ),
  // Editorial & Print: 17-24
  buildEntry(
    "front-page-broadsheet",
    [
      broadsheetDefinition,
      afterLaunchDefinition,
      rogueWaveDefinition,
      dayFeedStoppedDefinition,
    ].map(toMigratingStyleTopic),
  ),
  buildEntry(
    "magazine-masthead",
    [
      mastheadDefinition,
      productCoverDefinition,
      mothExperimentDefinition,
      comebackIssueDefinition,
    ].map(toMigratingStyleTopic),
  ),
  buildEntry(
    "warm-editorial-feature",
    [
      editorialFeatureDefinition,
      usefulWeekDefinition,
      oralToWrittenDefinition,
      letterToPastSelfDefinition,
    ].map(toMigratingStyleTopic),
  ),
  buildEntry(
    "scholars-vellum",
    [
      scholarNotesDefinition,
      marginArgumentDefinition,
      hiddenTextDefinition,
      whatAncientsKnewDefinition,
    ].map(toMigratingStyleTopic),
  ),
  buildEntry(
    "solar-biennale-poster",
    [
      biennalePosterDefinition,
      publicLightDefinition,
      ironFromStarsDefinition,
      festivalSlowIdeasDefinition,
    ].map(toMigratingStyleTopic),
  ),
  buildEntry(
    "duotone-session",
    [
      sessionPosterDefinition,
      fiveTakesDefinition,
      danceNotationDefinition,
      cutInOneTakeDefinition,
    ].map(toMigratingStyleTopic),
  ),
  buildEntry(
    "riso-print-zine",
    [
      risoZineDefinition,
      communityPrintDefinition,
      sevenBluesDefinition,
      makeSomethingWeeklyDefinition,
    ].map(toMigratingStyleTopic),
  ),
  buildEntry(
    "analog-cutout-collage",
    [
      cutoutCollageDefinition,
      rebuiltArchiveDefinition,
      concealedObjectsDefinition,
      piecingIdeaTogetherDefinition,
    ].map(toMigratingStyleTopic),
  ),
  // Craft & Cultural Traditions: 25-32
  buildEntry(
    "woodblock-floating-world",
    [
      woodblockDefinition,
      tideMapDefinition,
      whistledLanguageDefinition,
      aRiversJourneyDefinition,
    ].map(toMigratingStyleTopic),
  ),
  buildEntry(
    "botanical-specimen-plate",
    [
      specimenPlateDefinition,
      growthSignalsDefinition,
      leafStomataDefinition,
      anatomyOfAnIdeaDefinition,
    ].map(toMigratingStyleTopic),
  ),
  buildEntry(
    "machine-age-deco",
    [
      decoGalaDefinition,
      infrastructureGalaDefinition,
      reinforcedConcreteDefinition,
      grandUnveilingDefinition,
    ].map(toMigratingStyleTopic),
  ),
  buildEntry(
    "expedition-screenprint",
    [
      expeditionPrintDefinition,
      fieldRouteDefinition,
      saharanDustDefinition,
      mappingUnknownGroundDefinition,
    ].map(toMigratingStyleTopic),
  ),
  buildEntry(
    "cassette-era-packaging",
    [
      cassettePackDefinition,
      releaseMixtapeDefinition,
      iceCoreArchiveDefinition,
      greatestHitsVol1Definition,
    ].map(toMigratingStyleTopic),
  ),
  buildEntry(
    "neo-brutalist-bulletin",
    [
      brutalistBulletinDefinition,
      hardThingDefinition,
      sinkingDeltaDefinition,
      readBeforeMergeDefinition,
    ].map(toMigratingStyleTopic),
  ),
  buildEntry(
    "red-wedge-agitprop",
    [
      redWedgeDefinition,
      orgMoveDefinition,
      pneumaticPostDefinition,
      refactorTheSystemDefinition,
    ].map(toMigratingStyleTopic),
  ),
  buildEntry(
    "mechanical-scoring-funnel",
    [
      scoringFunnelDefinition,
      priorityScoreDefinition,
      snowflakeBranchesDefinition,
      triageTheBacklogDefinition,
    ].map(toMigratingStyleTopic),
  ),
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

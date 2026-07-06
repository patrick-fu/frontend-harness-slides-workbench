import type { StyleRegistryEntry, StyleMetadata } from "../types";
import { buildStyleRegistryEntry } from "./version";
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
import { quietLaunchWindowV2Version } from "./01-quiet-launch-window-v2";
import { metricsWithoutNoiseV2Version } from "./02-metrics-without-noise-v2";
import { repairAsStrategyV2Version } from "./03-repair-as-strategy-v2";
import { betterQuestionV2Version } from "./04-better-question-v2";
import { resilienceBlueprintV2Version } from "./05-resilience-blueprint-v2";
import { oneConstraintWinsV2Version } from "./06-one-constraint-wins-v2";
import { humanLoopRetrofitV2Version } from "./07-human-loop-retrofit-v2";
import { sentenceWeKeepV2Version } from "./08-sentence-we-keep-v2";
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
import { threeTracksReleaseV2Version } from "./09-three-tracks-release-v2";
import { durableToolV2Version } from "./10-durable-tool-v2";
import { eventToInsightV2Version } from "./11-event-to-insight-v2";
import { onboardingThatBreathesV2Version } from "./12-onboarding-that-breathes-v2";
import { rawNotesCleanBriefV2Version } from "./13-raw-notes-clean-brief-v2";
import { twoTeamsOneArtifactV2Version } from "./14-two-teams-one-artifact-v2";
import { tuningOperatingModelV2Version } from "./15-tuning-operating-model-v2";
import { incidentLearnsV2Version } from "./16-incident-learns-v2";
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
import { morningAfterLaunchV2Version } from "./17-morning-after-launch-v2";
import { productGetsCoverV2Version } from "./18-product-gets-cover-v2";
import { usefulWeekNotesV2Version } from "./19-useful-week-notes-v2";
import { argumentInMarginsV2Version } from "./20-argument-in-margins-v2";
import { publicLightProgramV2Version } from "./21-public-light-program-v2";
import { fiveTakesRoomV2Version } from "./22-five-takes-room-v2";
import { communityPrintsItselfV2Version } from "./23-community-prints-itself-v2";
import { archiveReassembledV2Version } from "./24-archive-reassembled-v2";
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
import { tideMapTeamV2Version } from "./25-tide-map-team-v2";
import { growthSignalsV2Version } from "./26-growth-signals-v2";
import { infrastructureGalaV2Version } from "./27-infrastructure-gala-v2";
import { fieldRouteSignalV2Version } from "./28-field-route-signal-v2";
import { releaseMixtapeV2Version } from "./29-release-mixtape-v2";
import { shippingHardThingV2Version } from "./30-shipping-hard-thing-v2";
import { moveOrgChartV2Version } from "./31-move-org-chart-v2";
import { prioritizeWithoutDebateV2Version } from "./32-prioritize-without-debate-v2";
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
import { spatialProductBriefV2Version } from "./33-spatial-product-brief-v2";
import { toolchainDesktopV2Version } from "./34-toolchain-desktop-v2";
import { calmerGrowthModelV2Version } from "./35-calmer-growth-model-v2";
import { privateBetaSalonV2Version } from "./36-private-beta-salon-v2";
import { newHabitRunbookV2Version } from "./37-new-habit-runbook-v2";
import { fiveActsSystemV2Version } from "./38-five-acts-system-v2";
import { deriveShortcutV2Version } from "./39-derive-shortcut-v2";
import { latencyBossFightV2Version } from "./40-latency-boss-fight-v2";
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

const buildEntry = buildStyleRegistryEntry;

// ─── Registry ───────────────────────────────────────────────────────────────

/**
 * The authoritative registry of all Styles and their Versions.
 *
 * Registry order determines cross-style cycling order (D33: band-grouped).
 * Within each Style, versions are ordered by their index in the versions array.
 *
 * Navigation cycling: style01v1 → style01v2 → ... → style02v1 → ...
 */
export const STYLE_REGISTRY: StyleRegistryEntry[] = [
  // Minimal Keynote: 01-08
  buildEntry("01", [
    { component: ExecutiveSilence01, getMetadata: getMetadata01 },
    quietLaunchWindowV2Version,
  ]),
  buildEntry("02", [
    { component: SwissPrecision02, getMetadata: getMetadata02 },
    metricsWithoutNoiseV2Version,
  ]),
  buildEntry("03", [
    { component: ZenVoid03, getMetadata: getMetadata03 },
    repairAsStrategyV2Version,
  ]),
  buildEntry("04", [
    { component: AuroraGradient04, getMetadata: getMetadata04 },
    betterQuestionV2Version,
  ]),
  buildEntry("05", [
    { component: Blueprint05, getMetadata: getMetadata05 },
    resilienceBlueprintV2Version,
  ]),
  buildEntry("06", [
    { component: MonochromeStudy06, getMetadata: getMetadata06 },
    oneConstraintWinsV2Version,
  ]),
  buildEntry("07", [
    { component: QuietConfidence07, getMetadata: getMetadata07 },
    humanLoopRetrofitV2Version,
  ]),
  buildEntry("08", [
    { component: TerminalGlow08, getMetadata: getMetadata08 },
    sentenceWeKeepV2Version,
  ]),
  // Balanced Hybrid: 09-16
  buildEntry("09", [
    { component: ProcessFlow09, getMetadata: getMetadata09 },
    threeTracksReleaseV2Version,
  ]),
  buildEntry("10", [
    { component: MatrixGrid10, getMetadata: getMetadata10 },
    durableToolV2Version,
  ]),
  buildEntry("11", [
    { component: TimelineSpiral11, getMetadata: getMetadata11 },
    eventToInsightV2Version,
  ]),
  buildEntry("12", [
    { component: Iconography12, getMetadata: getMetadata12 },
    onboardingThatBreathesV2Version,
  ]),
  buildEntry("13", [
    { component: StickyBoard13, getMetadata: getMetadata13 },
    rawNotesCleanBriefV2Version,
  ]),
  buildEntry("14", [
    { component: OrgChart14, getMetadata: getMetadata14 },
    twoTeamsOneArtifactV2Version,
  ]),
  buildEntry("15", [
    { component: Roadmap15, getMetadata: getMetadata15 },
    tuningOperatingModelV2Version,
  ]),
  buildEntry("16", [
    { component: CaseStudy16, getMetadata: getMetadata16 },
    incidentLearnsV2Version,
  ]),
  // Editorial & Print: 17-24
  buildEntry("17", [
    { component: EditorialBroadsheet17, getMetadata: getMetadata17 },
    morningAfterLaunchV2Version,
  ]),
  buildEntry("18", [
    { component: LiteraryReview18, getMetadata: getMetadata18 },
    productGetsCoverV2Version,
  ]),
  buildEntry("19", [
    { component: FinancialTimes19, getMetadata: getMetadata19 },
    usefulWeekNotesV2Version,
  ]),
  buildEntry("20", [
    { component: NationalGeographic20, getMetadata: getMetadata20 },
    argumentInMarginsV2Version,
  ]),
  buildEntry("21", [
    { component: VogueEditorial21, getMetadata: getMetadata21 },
    publicLightProgramV2Version,
  ]),
  buildEntry("22", [
    { component: AcademicJournal22, getMetadata: getMetadata22 },
    fiveTakesRoomV2Version,
  ]),
  buildEntry("23", [
    { component: ZineCulture23, getMetadata: getMetadata23 },
    communityPrintsItselfV2Version,
  ]),
  buildEntry("24", [
    { component: ManuscriptScroll24, getMetadata: getMetadata24 },
    archiveReassembledV2Version,
  ]),
  // Craft & Cultural Traditions: 25-32
  buildEntry("25", [
    { component: WoodblockPrint25, getMetadata: getMetadata25 },
    tideMapTeamV2Version,
  ]),
  buildEntry("26", [
    { component: ChineseInk26, getMetadata: getMetadata26 },
    growthSignalsV2Version,
  ]),
  buildEntry("27", [
    { component: ArtDeco27, getMetadata: getMetadata27 },
    infrastructureGalaV2Version,
  ]),
  buildEntry("28", [
    { component: BauhausPoster28, getMetadata: getMetadata28 },
    fieldRouteSignalV2Version,
  ]),
  buildEntry("29", [
    { component: CelticKnot29, getMetadata: getMetadata29 },
    releaseMixtapeV2Version,
  ]),
  buildEntry("30", [
    { component: MexicanMural30, getMetadata: getMetadata30 },
    shippingHardThingV2Version,
  ]),
  buildEntry("31", [
    { component: AfricanKente31, getMetadata: getMetadata31 },
    moveOrgChartV2Version,
  ]),
  buildEntry("32", [
    { component: NordicRosemaling32, getMetadata: getMetadata32 },
    prioritizeWithoutDebateV2Version,
  ]),
  // Contemporary Digital: 33-40
  buildEntry("33", [
    { component: GlassDashboard33, getMetadata: getMetadata33 },
    spatialProductBriefV2Version,
  ]),
  buildEntry("34", [
    { component: RetroOs9534, getMetadata: getMetadata34 },
    toolchainDesktopV2Version,
  ]),
  buildEntry("35", [
    { component: NeonGrid35, getMetadata: getMetadata35 },
    calmerGrowthModelV2Version,
  ]),
  buildEntry("36", [
    { component: GlassMorph36, getMetadata: getMetadata36 },
    privateBetaSalonV2Version,
  ]),
  buildEntry("37", [
    { component: TerminalUi37, getMetadata: getMetadata37 },
    newHabitRunbookV2Version,
  ]),
  buildEntry("38", [
    { component: FigmaCanvas38, getMetadata: getMetadata38 },
    fiveActsSystemV2Version,
  ]),
  buildEntry("39", [
    { component: NotionDoc39, getMetadata: getMetadata39 },
    deriveShortcutV2Version,
  ]),
  buildEntry("40", [
    { component: ParticleField40, getMetadata: getMetadata40 },
    latencyBossFightV2Version,
  ]),
  // Text Report: 41-48
  buildEntry("41", [{ component: AnnualReport41, getMetadata: getMetadata41 }]),
  buildEntry("42", [{ component: LegalBrief42, getMetadata: getMetadata42 }]),
  buildEntry("43", [{ component: ResearchDigest43, getMetadata: getMetadata43 }]),
  buildEntry("44", [{ component: MeetingMinutes44, getMetadata: getMetadata44 }]),
  buildEntry("45", [{ component: PolicyPaper45, getMetadata: getMetadata45 }]),
  buildEntry("46", [{ component: AuditReport46, getMetadata: getMetadata46 }]),
  buildEntry("47", [{ component: WhitePaper47, getMetadata: getMetadata47 }]),
  buildEntry("48", [{ component: ExecutiveSummary48, getMetadata: getMetadata48 }]),
];

// ─── Utility functions for version-aware navigation ─────────────────────────

/** A flat list of all versions across all styles, in navigation order. */
export interface FlatVersionEntry {
  styleId: string;
  styleName: { en: string; zh: string };
  versionId: string;
  versionIndex: number; // index within the style's versions array
  topic: string;
  model: string;
  component: React.ComponentType<any>;
  getMetadata: (lang: "en" | "zh") => StyleMetadata;
}

/**
 * Returns a flat array of all versions in navigation order.
 * Used for cross-style/version cycling (D81).
 */
export function getAllVersions(): FlatVersionEntry[] {
  const result: FlatVersionEntry[] = [];
  for (const style of STYLE_REGISTRY) {
    for (let vi = 0; vi < style.versions.length; vi++) {
      const v = style.versions[vi];
      result.push({
        styleId: style.id,
        styleName: style.name,
        versionId: v.id,
        versionIndex: vi,
        topic: v.topic,
        model: v.model,
        component: v.component,
        getMetadata: v.getMetadata,
      });
    }
  }
  return result;
}

/**
 * Find a specific version entry by style ID and version ID.
 */
export function findVersion(
  styleId: string,
  versionId: string,
): FlatVersionEntry | null {
  const style = STYLE_REGISTRY.find((s) => s.id === styleId);
  if (!style) return null;
  const vi = style.versions.findIndex((v) => v.id === versionId);
  if (vi === -1) return null;
  const v = style.versions[vi];
  return {
    styleId: style.id,
    styleName: style.name,
    versionId: v.id,
    versionIndex: vi,
    topic: v.topic,
    model: v.model,
    component: v.component,
    getMetadata: v.getMetadata,
  };
}

/**
 * Get the next version in navigation order (D81).
 * Wraps from last version of last style back to first version of first style.
 */
export function getNextVersion(
  styleId: string,
  versionId: string,
): FlatVersionEntry {
  const all = getAllVersions();
  const idx = all.findIndex(
    (v) => v.styleId === styleId && v.versionId === versionId,
  );
  const nextIdx = (idx + 1) % all.length;
  return all[nextIdx];
}

/**
 * Get the previous version in navigation order (D81).
 * Wraps from first version of first style back to last version of last style.
 */
export function getPrevVersion(
  styleId: string,
  versionId: string,
): FlatVersionEntry {
  const all = getAllVersions();
  const idx = all.findIndex(
    (v) => v.styleId === styleId && v.versionId === versionId,
  );
  const prevIdx = (idx - 1 + all.length) % all.length;
  return all[prevIdx];
}

/**
 * Total number of versions across all styles.
 */
export function getTotalVersionCount(): number {
  return STYLE_REGISTRY.reduce((sum, s) => sum + s.versions.length, 0);
}

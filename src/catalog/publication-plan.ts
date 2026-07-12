import type { CatalogStyleGroup, TopicCatalog } from "./topic-catalog";

export interface PublicationStats {
  styles: number;
  topics: number;
}

export interface PublicationTarget {
  styleId: string;
  topicId: string;
  modulePath: string;
  testPath: string;
  previewFilename: string;
  capture: {
    language: "en";
    scene: number;
    beat: number;
    pure: true;
    frozen: true;
  };
}

export interface PublicationHeroFrame {
  styleId: string;
  topicId: string;
  topicName: string;
  language: "en" | "zh";
  scene: number;
  beat: number;
  evidenceBoundary?: string;
}

export interface PublicationAuditCases {
  styleStarts: readonly {
    styleId: string;
    topicId: string;
    firstMultiBeatScene: number;
  }[];
  heroFinalFrames: readonly PublicationHeroFrame[];
  bandBoundaryTransitions: readonly { from: string; to: string }[];
}

export interface PublicationPlan {
  manifest: readonly CatalogStyleGroup[];
  stats: PublicationStats;
  targets: readonly PublicationTarget[];
  auditCases: PublicationAuditCases;
}

function projectManifest(catalog: TopicCatalog): readonly CatalogStyleGroup[] {
  return catalog.styleGroups.map((group) => ({
    style: group.style,
    topics: group.topics.map((topic) => {
      const { Stage: _Stage, ...projected } = topic;
      return {
        ...projected,
        modulePath: `../topics/${topic.id}.tsx`,
      };
    }),
  }));
}

function heroFinalFrame(
  styleId: string,
  topic: CatalogStyleGroup["topics"][number],
  language: "en" | "zh",
): PublicationHeroFrame {
  const metadata = topic.metadata[language];
  const heroScene = metadata.scenes.find(
    (scene) => scene.id === metadata.heroScene,
  );
  if (!heroScene) {
    throw new Error(
      `Publication target ${styleId}/${topic.id}/${language} has no hero Scene ${metadata.heroScene}.`,
    );
  }
  const finalBeat = heroScene.beats[heroScene.beats.length - 1];
  if (!finalBeat) {
    throw new Error(
      `Publication target ${styleId}/${topic.id}/${language} hero Scene ${heroScene.id} has no Beats.`,
    );
  }

  const evidenceBoundary =
    (topic.evidence.kind === "illustrative" || topic.evidence.kind === "mixed") &&
    topic.evidence.display === "envelope"
      ? topic.evidence.boundary[language]
      : undefined;

  return {
    styleId,
    topicId: topic.id,
    topicName: topic.title[language],
    language,
    scene: heroScene.id,
    beat: finalBeat.id,
    ...(evidenceBoundary ? { evidenceBoundary } : {}),
  };
}

export function buildPublicationPlan(catalog: TopicCatalog): PublicationPlan {
  const manifest = projectManifest(catalog);
  const targets: PublicationTarget[] = [];
  const heroFinalFrames: PublicationHeroFrame[] = [];

  for (const group of manifest) {
    for (const topic of group.topics) {
      const englishFrame = heroFinalFrame(group.style.id, topic, "en");
      targets.push({
        styleId: group.style.id,
        topicId: topic.id,
        modulePath: topic.modulePath,
        testPath: `src/topics/${topic.id}.test.tsx`,
        previewFilename: `${topic.id}.webp`,
        capture: {
          language: "en",
          scene: englishFrame.scene,
          beat: englishFrame.beat,
          pure: true,
          frozen: true,
        },
      });
      heroFinalFrames.push(
        englishFrame,
        heroFinalFrame(group.style.id, topic, "zh"),
      );
    }
  }

  const styleStarts = manifest.map((group) => {
    const topic = group.topics[0];
    if (!topic) {
      throw new Error(`Publication Style ${group.style.id} has no Topics.`);
    }
    return {
      styleId: group.style.id,
      topicId: topic.id,
      firstMultiBeatScene:
        topic.metadata.en.scenes.find((scene) => scene.beats.length > 1)?.id ??
        topic.metadata.en.scenes[0]?.id ??
        1,
    };
  });

  const bandBoundaryTransitions = manifest.flatMap((group, index) => {
    const next = manifest[(index + 1) % manifest.length];
    if (!next || next.style.band === group.style.band) return [];
    return [{ from: group.style.id, to: next.style.id }];
  });

  return {
    manifest,
    stats: {
      styles: manifest.length,
      topics: targets.length,
    },
    targets,
    auditCases: {
      styleStarts,
      heroFinalFrames,
      bandBoundaryTransitions,
    },
  };
}

export const RECENT_TOPICS_KEY = "fhsw:recent-topics";

const RECENT_TOPICS_LIMIT = 8;

interface RecentTopic {
  id: string;
}

interface RecentTopicGroup {
  style: { id: string };
  topics: readonly RecentTopic[];
}

interface RecentTopicsStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

type TopicOf<Group extends RecentTopicGroup> = Group["topics"][number];

export function createRecentTopics<Group extends RecentTopicGroup>(
  registry: readonly Group[],
  options: {
    storage?: () => RecentTopicsStorage;
    key?: string;
  } = {},
) {
  const getStorage = options.storage ?? (() => window.localStorage);
  const key = options.key ?? RECENT_TOPICS_KEY;

  const findTopic = (
    topicId: string,
  ): { group: Group; topic: TopicOf<Group> } | null => {
    for (const group of registry) {
      const topic = group.topics.find(
        (candidate) => candidate.id === topicId,
      ) as TopicOf<Group> | undefined;
      if (topic) return { group, topic };
    }
    return null;
  };

  const normalizeId = (value: unknown): string | null => {
    if (typeof value !== "string") return null;
    const parts = value.split("/");
    const topicId =
      parts.length === 1
        ? parts[0]
        : parts.length === 2 && parts[0] && parts[1]
          ? parts[1]
          : null;
    return topicId && findTopic(topicId) ? topicId : null;
  };

  const readIds = (): string[] => {
    let payload: unknown;
    try {
      payload = JSON.parse(getStorage().getItem(key) ?? "[]");
    } catch {
      return [];
    }
    if (!Array.isArray(payload)) return [];

    const seen = new Set<string>();
    const topicIds: string[] = [];
    for (const value of payload) {
      const topicId = normalizeId(value);
      if (!topicId || seen.has(topicId)) continue;
      seen.add(topicId);
      topicIds.push(topicId);
      if (topicIds.length === RECENT_TOPICS_LIMIT) break;
    }
    return topicIds;
  };

  return {
    readIds,

    resolve(): Array<{ group: Group; topic: TopicOf<Group> }> {
      return readIds().flatMap((topicId) => {
        const resolved = findTopic(topicId);
        return resolved ? [resolved] : [];
      });
    },

    record(topicId: string): string[] {
      const current = readIds();
      if (!findTopic(topicId)) return current;
      const next = [topicId, ...current.filter((id) => id !== topicId)].slice(
        0,
        RECENT_TOPICS_LIMIT,
      );
      try {
        getStorage().setItem(key, JSON.stringify(next));
      } catch {
        // Persistence failure must not block semantic Topic navigation.
      }
      return next;
    },
  };
}

import {
  findRuntimeTopic,
  loadRuntimeTopicStage,
  prefetchAdjacentRuntimeTopics,
} from "../catalog/runtime-registry";
import type { PlayerCatalogAccess } from "./PlayerRuntime";

/** Production adapter: Catalog metadata stays synchronous and Stages stay lazy. */
export const RUNTIME_PLAYER_CATALOG: PlayerCatalogAccess = {
  findTopic: findRuntimeTopic,
  loadStage: loadRuntimeTopicStage,
  prefetchAdjacent: prefetchAdjacentRuntimeTopics,
};

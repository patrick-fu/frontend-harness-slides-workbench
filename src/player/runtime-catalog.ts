import {
  findRuntimeTopic,
  loadRuntimeTopicStage,
  prefetchAdjacentRuntimeTopics,
  RUNTIME_REGISTRY,
} from "../catalog/runtime-registry";
import type { PlayerCatalogAccess } from "./PlayerRuntime";

/** Production adapter: Catalog metadata stays synchronous and Stages stay lazy. */
export const RUNTIME_PLAYER_CATALOG: PlayerCatalogAccess = {
  registry: RUNTIME_REGISTRY,
  findTopic: findRuntimeTopic,
  loadStage: loadRuntimeTopicStage,
  prefetchAdjacent: prefetchAdjacentRuntimeTopics,
};

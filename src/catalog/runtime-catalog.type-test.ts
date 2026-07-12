import { expectTypeOf, it } from "vitest";
import type {
  RuntimeCatalogDiscovery,
  RuntimeCatalogTopic,
  RuntimePlayerCatalog,
} from "./runtime-catalog";

type DiscoveryTopicLoadingKeys = Extract<
  keyof RuntimeCatalogTopic,
  | "Stage"
  | "loadStage"
  | "modulePath"
  | "retry"
  | "prefetch"
  | "styleIndex"
  | "topicIndex"
>;

it("keeps loading behavior available only through the Player Catalog type", () => {
  expectTypeOf<DiscoveryTopicLoadingKeys>().toEqualTypeOf<never>();
  expectTypeOf<RuntimeCatalogDiscovery>().not.toHaveProperty("loadStage");
  expectTypeOf<RuntimePlayerCatalog>().toHaveProperty("loadStage");
});

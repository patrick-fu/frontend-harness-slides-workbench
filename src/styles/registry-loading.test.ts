import { describe, expect, it } from "vitest";
import { CATALOG_MANIFEST } from "./catalog-manifest.generated";
import {
  findTopic,
  loadRegistryTopicComponent,
  STYLE_REGISTRY,
} from "./registry";
import { hasTopicModule } from "./topic-module-loader";

describe("Catalog + Player registry split", () => {
  it("keeps generated Catalog metadata available synchronously", () => {
    const catalogTopic = CATALOG_MANIFEST[0]?.topics[0];
    const runtimeTopic = STYLE_REGISTRY[0]?.topics[0];

    expect(catalogTopic).toBeDefined();
    expect(runtimeTopic?.getMetadata("en")).toEqual(catalogTopic?.metadata.en);
    expect(runtimeTopic?.getMetadata("zh")).toEqual(catalogTopic?.metadata.zh);
  });

  it("keeps every Catalog Topic mapped to a lazy Stage module", () => {
    const modulePaths = CATALOG_MANIFEST.flatMap((style) =>
      style.topics.map((topic) => topic.modulePath),
    );

    expect(modulePaths).toHaveLength(194);
    expect(modulePaths.every(hasTopicModule)).toBe(true);
  });

  it("maps an exact Topic to its Stage component only when the Player asks for it", async () => {
    const component = await loadRegistryTopicComponent(
      "minimal-product-keynote",
      "product-keynote",
    );

    expect(typeof component).toBe("function");
  });

  it("retains a typed component loader on navigation lookup results", () => {
    const topic = findTopic("minimal-product-keynote", "quiet-launch");

    expect(topic).not.toBeNull();
    expect(typeof topic?.loadComponent).toBe("function");
  });

  it("rejects an unavailable Player Topic without making the Catalog unavailable", async () => {
    await expect(
      loadRegistryTopicComponent("minimal-product-keynote", "missing-topic"),
    ).rejects.toThrow('Unknown Topic "minimal-product-keynote/missing-topic".');

    expect(STYLE_REGISTRY).toHaveLength(49);
  });
});

import { describe, expect, it } from "vitest";
import { CATALOG_MANIFEST } from "./catalog-manifest.generated";
import { STYLE_CATALOG_SOURCE } from "./catalog-source";

describe("CATALOG_MANIFEST", () => {
  it("keeps synchronous Catalog metadata equal to the authored Topic metadata", () => {
    expect(CATALOG_MANIFEST).toHaveLength(STYLE_CATALOG_SOURCE.length);

    for (const [styleIndex, sourceStyle] of STYLE_CATALOG_SOURCE.entries()) {
      const catalogStyle = CATALOG_MANIFEST[styleIndex];
      expect(catalogStyle?.id).toBe(sourceStyle.id);
      expect(catalogStyle?.name).toEqual(sourceStyle.name);
      expect(catalogStyle?.topics).toHaveLength(sourceStyle.topics.length);

      for (const [topicIndex, sourceTopic] of sourceStyle.topics.entries()) {
        const catalogTopic = catalogStyle?.topics[topicIndex];
        expect(catalogTopic?.id).toBe(sourceTopic.id);
        expect(catalogTopic?.topic).toEqual(sourceTopic.topic);
        expect(catalogTopic?.model).toBe(sourceTopic.model);
        expect(catalogTopic?.metadata).toEqual({
          en: sourceTopic.getMetadata("en"),
          zh: sourceTopic.getMetadata("zh"),
        });
        expect(catalogTopic?.navigation).toEqual(sourceTopic.navigation);
        expect(catalogTopic?.sources).toEqual(sourceTopic.sources);
        expect(catalogTopic?.transitionScore).toEqual(
          sourceTopic.transitionScore,
        );
      }
    }
  });
});
